// lib/services/goods-issue.service.ts
import { 
  getGoodsIssuesPaginated, 
  generateIssueCode, 
  insertGoodsIssue, 
  deleteGoodsIssue 
} from '@/lib/repositories/goods-issue.repository';
import { 
  getRawInventoryByItemId, 
  updateInventoryStockAndHpp 
} from '@/lib/repositories/inventory.repository';
import type { CreateGoodsIssueInput } from '@/types/transaction.types';

export async function listGoodsIssues(page: number, limit: number, search?: string) {
  const { data, count, error } = await getGoodsIssuesPaginated(page, limit, search);
  if (error) throw new Error(`Gagal mengambil data barang keluar: ${error.message}`);
  return { data: data ?? [], total: count ?? 0, page, limit };
}

export async function addGoodsIssue(userId: string, input: CreateGoodsIssueInput) {
  // 1. Pengecekan Awal (Pre-flight Check) & Kalkulasi HPP via Inventory Repository
  const { data: inv } = await getRawInventoryByItemId(input.item_id);

  if (!inv) {
    throw new Error('Barang ini belum memiliki catatan persediaan.');
  }

  if (Number(inv.stock) < input.quantity) {
    throw new Error('Stok tidak mencukupi untuk melakukan transaksi barang keluar');
  }

  const hpp_berjalan = Number(inv.hpp);
  const total_hpp = hpp_berjalan * input.quantity;
  const issue_code = await generateIssueCode();

  // 2. Insert First to goods_issues via Goods Issue Repository
  const { data: issue, error: issueError } = await insertGoodsIssue({
    issue_code,
    item_id: input.item_id,
    user_id: userId,
    quantity: input.quantity,
    issue_date: input.issue_date,
    total_hpp
  });

  if (issueError || !issue) {
    throw new Error(`Gagal menyimpan transaksi: ${issueError?.message}`);
  }

  // 3. Try-Catch Block (Decrement Stock via Inventory Repository)
  try {
    const newStock = Number(inv.stock) - input.quantity;
    const { error: invError } = await updateInventoryStockAndHpp(inv.id, newStock);

    if (invError) throw invError;
  } catch (error) {
    // 4. Manual Rollback
    await deleteGoodsIssue(issue.id);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Gagal mengurangi stok (Transaksi dibatalkan): ${errorMessage}`);
  }

  return issue;
}
