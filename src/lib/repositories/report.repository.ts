// lib/repositories/report.repository.ts
import { createAdminClient } from '@/lib/supabase/server-admin';
import type { GoodsReceiptWithRelations, GoodsIssueWithRelations } from '@/types/transaction.types';

export async function getGoodsReceiptReport(startDate: string, endDate: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('goods_receipts')
    .select(`
      *,
      item:items!inner(id, item_code, name, category:categories(name), unit:units(name)),
      supplier:suppliers(id, name),
      user:users(id, name)
    `)
    .gte('receipt_date', startDate)
    .lte('receipt_date', endDate)
    .order('receipt_date', { ascending: false });

  if (error) throw error;

  return ((data ?? []) as unknown as GoodsReceiptWithRelations[]).map((row) => ({
    ...row,
    item: row.item,
    supplier: row.supplier,
    user: row.user
  }));
}

export async function getGoodsIssueReport(startDate: string, endDate: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('goods_issues')
    .select(`
      *,
      item:items!inner(id, item_code, name, category:categories(name), unit:units(name)),
      user:users(id, name)
    `)
    .gte('issue_date', startDate)
    .lte('issue_date', endDate)
    .order('issue_date', { ascending: false });

  if (error) throw error;

  return ((data ?? []) as unknown as GoodsIssueWithRelations[]).map((row) => ({
    ...row,
    item: row.item,
    user: row.user
  }));
}
