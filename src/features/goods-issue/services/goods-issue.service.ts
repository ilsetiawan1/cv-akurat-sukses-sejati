// src/features/goods-issue/services/goods-issue.service.ts
import { 
  getGoodsIssuesPaginated, 
  getGoodsIssueStats,
  generateIssueCode, 
  insertGoodsIssue, 
  deleteGoodsIssue 
} from '@/features/goods-issue/repositories/goods-issue.repository';
import { 
  getRawInventoryByItemId, 
  updateInventoryStockAndHpp 
} from '@/features/inventory/repositories/inventory.repository';
import { getAllItems } from '@/features/items/repositories/item.repository';
import { getAllCategories } from '@/features/settings/repositories/category.repository';
import { listInventory } from '@/features/inventory/services/inventory.service';
import { createAdminClient } from '@/lib/supabase/server-admin';
import type { CreateGoodsIssueInput } from '@/features/transactions/types/transaction.types';
import type { 
  GoodsIssuePageData, 
  IssueModalItem, 
  SelectedMonthOption 
} from '../types/goods-issue.types';
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

export async function listGoodsIssues(
  page: number, 
  limit: number, 
  search?: string,
  categoryId?: string,
  month?: string
) {
  const { data, count, error } = await getGoodsIssuesPaginated(page, limit, search, categoryId, month);
  if (error) throw new Error(`Gagal mengambil data barang keluar: ${error.message}`);
  return { data: data ?? [], total: count ?? 0, page, limit };
}

export async function getGoodsIssuePageData(
  page: number, 
  limit: number, 
  search?: string,
  categoryId?: string,
  month?: string
): Promise<GoodsIssuePageData> {
  const [issuesResult, rawItemsResult, invData, rawCategories, stats] = await Promise.all([
    listGoodsIssues(page, limit, search, categoryId, month),
    getAllItems(),
    listInventory(1, 1000),
    getAllCategories(),
    getGoodsIssueStats(search, categoryId, month)
  ]);

  const invMap = new Map((invData.data ?? []).map(inv => [inv.item_id, inv]));
  const typedRawItems = (rawItemsResult.data ?? []) as unknown as ItemWithRelations[];
  const items: IssueModalItem[] = typedRawItems.map((item) => {
    const inv = invMap.get(item.id);
    return {
      ...item,
      current_stock: inv?.stock ?? 0,
      current_hpp: inv?.hpp ?? 0
    };
  });

  const monthOptions = getMonthOptions();

  return {
    issues: issuesResult.data,
    totalIssues: issuesResult.total,
    stats,
    categories: rawCategories,
    monthOptions,
    items
  };
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

export async function cancelGoodsIssue(issueId: string) {
  const supabase = createAdminClient();

  // 1. Ambil data transaksi barang keluar
  const { data: issue, error: issueErr } = await supabase
    .from('goods_issues')
    .select('*, item_id, quantity')
    .eq('id', issueId)
    .single();

  if (issueErr || !issue) {
    throw new Error('Transaksi pengeluaran barang tidak ditemukan.');
  }

  // 2. Ambil catatan persediaan barang terkait
  const { data: inv, error: invErr } = await getRawInventoryByItemId(issue.item_id);
  if (invErr || !inv) {
    throw new Error('Data persediaan untuk barang ini tidak ditemukan.');
  }

  const currentStock = Number(inv.stock);
  const qtyToRestore = Number(issue.quantity);

  // 3. Kembalikan stok fisik di persediaan (stok bertambah kembali)
  const newStock = currentStock + qtyToRestore;
  const { error: updateErr } = await updateInventoryStockAndHpp(inv.id, newStock);
  if (updateErr) {
    throw new Error(`Gagal mengembalikan stok persediaan: ${updateErr.message}`);
  }

  // 4. Hapus riwayat transaksi pengeluaran
  const { error: delErr } = await deleteGoodsIssue(issueId);
  if (delErr) {
    // Rollback stok jika penghapusan gagal
    await updateInventoryStockAndHpp(inv.id, currentStock);
    throw new Error(`Gagal menghapus transaksi barang keluar: ${delErr.message}`);
  }

  return { success: true };
}
