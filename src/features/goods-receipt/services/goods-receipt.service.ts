// lib/services/goods-receipt.service.ts
import { 
  getGoodsReceiptsPaginated, 
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
import { listInventory } from '@/features/inventory/services/inventory.service';
import type { CreateGoodsReceiptInput } from '@/features/transactions/types/transaction.types';
import type { GoodsReceiptPageData, ReceiptModalItem } from '../types/goods-receipt.types';
import type { ItemWithRelations } from '@/types';

export async function listGoodsReceipts(page: number, limit: number, search?: string) {
  const { data, count, error } = await getGoodsReceiptsPaginated(page, limit, search);
  if (error) throw new Error(`Gagal mengambil data barang masuk: ${error.message}`);
  return { data: data ?? [], total: count ?? 0, page, limit };
}

export async function getGoodsReceiptPageData(
  page: number, 
  limit: number, 
  search?: string
): Promise<GoodsReceiptPageData> {
  const [receiptsResult, rawItemsResult, suppliersResult, invData] = await Promise.all([
    listGoodsReceipts(page, limit, search),
    getAllItems(),
    getAllSuppliers(),
    listInventory(1, 1000)
  ]);

  const stockMap = new Map((invData.data ?? []).map(inv => [inv.item_id, inv.stock]));
  const typedRawItems = (rawItemsResult.data ?? []) as unknown as ItemWithRelations[];
  const items: ReceiptModalItem[] = typedRawItems.map((item) => ({
    ...item,
    current_stock: stockMap.get(item.id) ?? 0
  }));

  return {
    receipts: receiptsResult.data,
    totalReceipts: receiptsResult.total,
    items,
    suppliers: suppliersResult.data || []
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
