// lib/services/goods-receipt.service.ts
import { 
  getGoodsReceiptsPaginated, 
  generateReceiptCode, 
  insertGoodsReceipt, 
  deleteGoodsReceipt 
} from '@/lib/repositories/goods-receipt.repository';
import { 
  getRawInventoryByItemId, 
  updateInventoryStockAndHpp, 
  generateInventoryCode, 
  insertInventoryRecord 
} from '@/lib/repositories/inventory.repository';
import type { CreateGoodsReceiptInput } from '@/types/transaction.types';

export async function listGoodsReceipts(page: number, limit: number, search?: string) {
  const { data, count, error } = await getGoodsReceiptsPaginated(page, limit, search);
  if (error) throw new Error(`Gagal mengambil data barang masuk: ${error.message}`);
  return { data: data ?? [], total: count ?? 0, page, limit };
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
