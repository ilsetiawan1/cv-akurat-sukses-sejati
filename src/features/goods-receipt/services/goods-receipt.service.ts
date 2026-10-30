// src/features/goods-receipt/services/goods-receipt.service.ts
import { 
  getGoodsReceiptsPaginated, 
  getGoodsReceiptStats,
  getLastReceiptPerItemMap,
  generateReceiptCode, 
  insertGoodsReceipt, 
  deleteGoodsReceipt 
} from '@/features/goods-receipt/repositories/goods-receipt.repository';
import { 
  getRawInventoryByItemId, 
  updateInventoryStockAndHpp, 
  generateInventoryCode, 
  insertInventoryRecord 
} from '@/features/inventory/repositories/inventory.repository';
import { getAllItems } from '@/features/items/repositories/item.repository';
import { getAllSuppliers } from '@/features/suppliers/repositories/supplier.repository';
import { getAllCategories } from '@/features/settings/repositories/category.repository';
import { listInventory } from '@/features/inventory/services/inventory.service';
import { createAdminClient } from '@/lib/supabase/server-admin';
import type { 
  CreateGoodsReceiptInput, 
  GoodsReceiptPageData, 
  ReceiptModalItem,
  SelectedMonthOption 
} from '../types/goods-receipt.types';
import type { ItemWithRelations } from '@/types';

export function getMonthOptions(): SelectedMonthOption[] {
  const options: SelectedMonthOption[] = [];
  const now = new Date();
  
  for (let i = 0; i < 6; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = d.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
    options.push({
      key,
      label: i === 0 ? `${label} (Bulan Ini)` : label,
    });
  }
  return options;
}

export async function listGoodsReceipts(
  page: number, 
  limit: number, 
  search?: string, 
  categoryId?: string,
  month?: string
) {
  const { data, count, error } = await getGoodsReceiptsPaginated(page, limit, search, categoryId, month);
  if (error) throw new Error(`Gagal mengambil data barang masuk: ${error.message}`);
  return { data: data ?? [], total: count ?? 0, page, limit };
}

export async function getGoodsReceiptPageData(
  page: number, 
  limit: number, 
  search?: string,
  categoryId?: string,
  month?: string
): Promise<GoodsReceiptPageData> {
  const [
    receiptsResult, 
    statsResult,
    rawItemsResult, 
    suppliersResult, 
    invData, 
    lastReceiptMap, 
    categories
  ] = await Promise.all([
    listGoodsReceipts(page, limit, search, categoryId, month),
    getGoodsReceiptStats(search, categoryId, month),
    getAllItems(),
    getAllSuppliers(),
    listInventory(1, 1000),
    getLastReceiptPerItemMap(),
    getAllCategories(),
  ]);

  const invMap = new Map((invData.data ?? []).map(inv => [inv.item_id, inv]));
  const typedRawItems = (rawItemsResult.data ?? []) as unknown as ItemWithRelations[];
  const items: ReceiptModalItem[] = typedRawItems.map((item) => {
    const lastReceipt = lastReceiptMap[item.id];
    const inv = invMap.get(item.id);
    return {
      ...item,
      current_stock: inv?.stock ?? 0,
      inventory_id: inv?.id,
      last_supplier_id: lastReceipt?.supplierId,
      last_purchase_price: lastReceipt?.purchasePrice ?? inv?.hpp ?? 0,
    };
  });

  return {
    receipts: receiptsResult.data,
    totalReceipts: receiptsResult.total,
    stats: statsResult,
    monthOptions: getMonthOptions(),
    items,
    suppliers: suppliersResult.data || [],
    categories: categories || [],
  };
}

export async function addGoodsReceipt(userId: string, input: CreateGoodsReceiptInput) {
  const receipt_code = await generateReceiptCode();
  const total_price = input.quantity * input.harga_satuan;

  // 1. Simpan ke tabel goods_receipts via repository
  const { data: receipt, error: receiptError } = await insertGoodsReceipt({
    receipt_code,
    item_id: input.item_id,
    user_id: userId,
    supplier_id: input.supplier_id,
    quantity: input.quantity,
    receipt_date: input.receipt_date,
    total_price
  });

  if (receiptError || !receipt) {
    throw new Error(`Gagal menyimpan transaksi: ${receiptError?.message}`);
  }

  try {
    // 2 & 3. Update stok dan Recalculate HPP di tabel inventory via repository
    const { data: inv } = await getRawInventoryByItemId(input.item_id);

    if (inv) {
      // HPP Moving Average Calculation
      const oldStock = Number(inv.stock);
      const oldHpp = Number(inv.hpp);
      const incomingQty = Number(input.quantity);
      const incomingPrice = Number(input.harga_satuan);

      const newStock = oldStock + incomingQty;
      const newHpp = ((oldStock * oldHpp) + (incomingQty * incomingPrice)) / newStock;

      const { error: invError } = await updateInventoryStockAndHpp(inv.id, newStock, newHpp);
      if (invError) throw invError;
    } else {
      // Generate Inventory DP code dynamically
      const newInvCode = await generateInventoryCode();

      const { error: invError } = await insertInventoryRecord({
        inventory_code: newInvCode,
        item_id: input.item_id,
        stock: input.quantity,
        hpp: input.harga_satuan
      });

      if (invError) throw invError;
    }

  } catch (error) {
    // MANUAL ROLLBACK: Delete the created receipt if inventory update fails
    await deleteGoodsReceipt(receipt.id);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Gagal update persediaan (Transaksi dibatalkan): ${errorMessage}`);
  }

  return receipt;
}

export async function cancelGoodsReceipt(receiptId: string) {
  const supabase = createAdminClient();

  // 1. Ambil data transaksi
  const { data: receipt, error: receiptErr } = await supabase
    .from('goods_receipts')
    .select('*, item_id, quantity')
    .eq('id', receiptId)
    .single();

  if (receiptErr || !receipt) {
    throw new Error('Transaksi penerimaan barang tidak ditemukan.');
  }

  // 2. Cek stok persediaan saat ini
  const { data: inv, error: invErr } = await getRawInventoryByItemId(receipt.item_id);
  if (invErr || !inv) {
    throw new Error('Data persediaan untuk barang ini tidak ditemukan.');
  }

  const currentStock = Number(inv.stock);
  const qtyToDeduct = Number(receipt.quantity);

  if (currentStock < qtyToDeduct) {
    throw new Error(
      `Tidak dapat membatalkan transaksi: Stok gudang saat ini (${currentStock}) lebih sedikit dari jumlah transaksi (${qtyToDeduct}). Sebagian stok telah terpakai dalam transaksi barang keluar.`
    );
  }

  // 3. Kembalikan stok fisik di persediaan
  const newStock = currentStock - qtyToDeduct;
  const { error: updateErr } = await updateInventoryStockAndHpp(inv.id, newStock);
  if (updateErr) {
    throw new Error(`Gagal mengembalikan stok persediaan: ${updateErr.message}`);
  }

  // 4. Hapus riwayat transaksi penerimaan
  const { error: delErr } = await deleteGoodsReceipt(receiptId);
  if (delErr) {
    // Rollback stok jika penghapusan gagal
    await updateInventoryStockAndHpp(inv.id, currentStock);
    throw new Error(`Gagal menghapus transaksi barang masuk: ${delErr.message}`);
  }

  return { success: true };
}
