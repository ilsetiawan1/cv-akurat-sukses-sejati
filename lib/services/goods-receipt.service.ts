// lib/services/goods-receipt.service.ts
import { 
  getGoodsReceiptsPaginated, 
  generateReceiptCode, 
  insertGoodsReceipt, 
  deleteGoodsReceipt 
} from '@/lib/repositories/goods-receipt.repository';
import { createAdminClient } from '@/lib/supabase/server-admin';
import type { CreateGoodsReceiptInput } from '@/types/transaction.types';

export async function listGoodsReceipts(page: number, limit: number, search?: string) {
  const { data, count, error } = await getGoodsReceiptsPaginated(page, limit, search);
  if (error) throw new Error(`Gagal mengambil data barang masuk: ${error.message}`);
  return { data: data ?? [], total: count ?? 0, page, limit };
}

export async function addGoodsReceipt(userId: string, input: CreateGoodsReceiptInput) {
  const supabase = createAdminClient();

  const receipt_code = await generateReceiptCode();
  const total_price = input.quantity * input.harga_satuan;

  // 1. Simpan ke tabel goods_receipts
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
    // 2 & 3. Update stok dan Recalculate HPP di tabel inventory
    const { data: inv } = await supabase
      .from('inventory')
      .select('*')
      .eq('item_id', input.item_id)
      .single();

    if (inv) {
      // HPP Moving Average Calculation
      const oldStock = Number(inv.stock);
      const oldHpp = Number(inv.hpp);
      const incomingQty = Number(input.quantity);
      const incomingPrice = Number(input.harga_satuan);

      const newStock = oldStock + incomingQty;
      const newHpp = ((oldStock * oldHpp) + (incomingQty * incomingPrice)) / newStock;

      const { error: invError } = await supabase
        .from('inventory')
        .update({ 
          stock: newStock, 
          hpp: newHpp,
          updated_at: new Date().toISOString()
        })
        .eq('id', inv.id);

      if (invError) throw invError;
    } else {
      // Generate Inventory DP code dynamically avoiding race condition
      let newInvCode = 'DP' + Date.now().toString().slice(-4);
      for (let i = 1; i <= 9999; i++) {
        const testCode = 'DP' + String(i).padStart(4, '0');
        const { count } = await supabase.from('inventory').select('*', { count: 'exact', head: true }).eq('inventory_code', testCode);
        if ((count ?? 0) === 0) {
          newInvCode = testCode;
          break;
        }
      }

      const { error: invError } = await supabase
        .from('inventory')
        .insert({
          inventory_code: newInvCode,
          item_id: input.item_id,
          stock: input.quantity,
          hpp: input.harga_satuan
        });

      if (invError) throw invError;
    }

  } catch (error: any) {
    // MANUAL ROLLBACK: Delete the created receipt if inventory update fails
    await deleteGoodsReceipt(receipt.id);
    throw new Error(`Gagal update persediaan (Transaksi dibatalkan): ${error.message}`);
  }

  return receipt;
}
