// src/features/reports/repositories/report.repository.ts
import { createAdminClient } from '@/lib/supabase/server-admin';
import type { GoodsReceiptWithRelations, GoodsIssueWithRelations } from '@/features/transactions/types/transaction.types';

function isValidMonthFormat(month?: string): boolean {
  if (!month || month.length !== 7 || month.indexOf('-') !== 4) return false;
  const parts = month.split('-');
  if (parts.length !== 2) return false;
  const y = Number(parts[0]);
  const m = Number(parts[1]);
  return !Number.isNaN(y) && !Number.isNaN(m) && y >= 2000 && y <= 2100 && m >= 1 && m <= 12;
}

export async function getGoodsReceiptReport(month?: string, startDate?: string, endDate?: string) {
  const supabase = createAdminClient();
  let query = supabase
    .from('goods_receipts')
    .select(`
      *,
      item:items!inner(id, item_code, name, category:categories(name), unit:units(name)),
      supplier:suppliers(id, name),
      user:users(id, name)
    `);

  if (isValidMonthFormat(month)) {
    const [yStr, mStr] = (month as string).split('-');
    const y = Number(yStr);
    const m = Number(mStr);
    const start = `${yStr}-${mStr.padStart(2, '0')}-01`;
    const lastDay = new Date(y, m, 0).getDate();
    const end = `${yStr}-${mStr.padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
    query = query.gte('receipt_date', start).lte('receipt_date', end);
  } else if (startDate && endDate) {
    query = query.gte('receipt_date', startDate).lte('receipt_date', endDate);
  }

  const { data, error } = await query.order('receipt_date', { ascending: false });
  if (error) throw error;

  return ((data ?? []) as unknown as GoodsReceiptWithRelations[]).map((row) => ({
    ...row,
    item: row.item,
    supplier: row.supplier,
    user: row.user
  }));
}

export async function getGoodsIssueReport(month?: string, startDate?: string, endDate?: string) {
  const supabase = createAdminClient();
  let query = supabase
    .from('goods_issues')
    .select(`
      *,
      item:items!inner(id, item_code, name, category:categories(name), unit:units(name)),
      user:users(id, name)
    `);

  if (isValidMonthFormat(month)) {
    const [yStr, mStr] = (month as string).split('-');
    const y = Number(yStr);
    const m = Number(mStr);
    const start = `${yStr}-${mStr.padStart(2, '0')}-01`;
    const lastDay = new Date(y, m, 0).getDate();
    const end = `${yStr}-${mStr.padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
    query = query.gte('issue_date', start).lte('issue_date', end);
  } else if (startDate && endDate) {
    query = query.gte('issue_date', startDate).lte('issue_date', endDate);
  }

  const { data, error } = await query.order('issue_date', { ascending: false });
  if (error) throw error;

  return ((data ?? []) as unknown as GoodsIssueWithRelations[]).map((row) => ({
    ...row,
    item: row.item,
    user: row.user
  }));
}
