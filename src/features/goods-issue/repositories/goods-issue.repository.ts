// src/features/goods-issue/repositories/goods-issue.repository.ts
import { createAdminClient } from '@/lib/supabase/server-admin';
import type { 
  GoodsIssueWithRelations, 
  InsertGoodsIssuePayload, 
  IssueSummaryStats,
  IssueCategoryBreakdown 
} from '../types/goods-issue.types';

function isValidMonthFormat(month?: string): boolean {
  if (!month || month.length !== 7 || month.indexOf('-') !== 4) return false;
  const parts = month.split('-');
  if (parts.length !== 2) return false;
  const y = Number(parts[0]);
  const m = Number(parts[1]);
  return !Number.isNaN(y) && !Number.isNaN(m) && y >= 2000 && y <= 2100 && m >= 1 && m <= 12;
}

const CATEGORY_PALETTE = [
  { barColor: 'bg-[#2E82F6]', dotColor: 'bg-[#2E82F6]', textColor: 'text-blue-700' },
  { barColor: 'bg-[#7EB0FA]', dotColor: 'bg-[#7EB0FA]', textColor: 'text-blue-600' },
  { barColor: 'bg-[#EEF4FC] border border-blue-100/80', dotColor: 'bg-[#B9D5FD]', textColor: 'text-blue-500' },
  { barColor: 'bg-[#C7D2FE]', dotColor: 'bg-[#C7D2FE]', textColor: 'text-indigo-600' },
  { barColor: 'bg-[#E2E8F0]', dotColor: 'bg-[#CBD5E1]', textColor: 'text-slate-600' },
];

export async function getGoodsIssuesPaginated(
  page: number, 
  limit: number, 
  search?: string, 
  categoryId?: string,
  month?: string
) {
  const supabase = createAdminClient();
  
  let query = supabase.from('goods_issues').select(`
    *,
    item:items!inner (
      id, item_code, name, category_id,
      category:categories(name),
      unit:units(name)
    ),
    user:users(id, name)
  `, { count: 'exact' });

  if (search) {
    query = query.ilike('items.name', `%${search}%`);
  }

  if (categoryId) {
    query = query.eq('items.category_id', categoryId);
  }

  if (isValidMonthFormat(month)) {
    const [yStr, mStr] = (month as string).split('-');
    const y = Number(yStr);
    const m = Number(mStr);
    const start = `${yStr}-${mStr.padStart(2, '0')}-01`;
    const lastDay = new Date(y, m, 0).getDate();
    const end = `${yStr}-${mStr.padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
    query = query.gte('issue_date', start).lte('issue_date', end);
  }

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, count, error } = await query
    .order('issue_date', { ascending: false })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    return { data: null, count: null, error };
  }

  const mappedData = ((data ?? []) as unknown as GoodsIssueWithRelations[]).map((row) => ({
    ...row,
    item: row.item,
    user: row.user
  }));

  return { data: mappedData, count, error: null };
}

export async function getGoodsIssueStats(
  search?: string, 
  categoryId?: string, 
  month?: string
): Promise<IssueSummaryStats> {
  const supabase = createAdminClient();
  
  let query = supabase.from('goods_issues').select(`
    quantity,
    total_hpp,
    item:items!inner (
      name,
      category_id,
      category:categories(name)
    )
  `);

  if (search) {
    query = query.ilike('items.name', `%${search}%`);
  }

  if (categoryId) {
    query = query.eq('items.category_id', categoryId);
  }

  if (isValidMonthFormat(month)) {
    const [yStr, mStr] = (month as string).split('-');
    const y = Number(yStr);
    const m = Number(mStr);
    const start = `${yStr}-${mStr.padStart(2, '0')}-01`;
    const lastDay = new Date(y, m, 0).getDate();
    const end = `${yStr}-${mStr.padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
    query = query.gte('issue_date', start).lte('issue_date', end);
  }

  const { data, error } = await query;
  if (error || !data) {
    return { 
      totalTransactions: 0, 
      totalQuantity: 0, 
      totalHppAmount: 0,
      categoryBreakdown: [] 
    };
  }

  const totalTransactions = data.length;
  const totalQuantity = data.reduce((acc, r) => acc + (Number(r.quantity) || 0), 0);
  const totalHppAmount = data.reduce((acc, r) => acc + (Number(r.total_hpp) || 0), 0);

  // Agregasi distribusi per kategori
  const catMap = new Map<string, number>();
  for (const row of data) {
    const itemObj = row.item as unknown as { category?: { name?: string } | null } | null;
    const catName = itemObj?.category?.name || 'Lainnya';
    const qty = Number(row.quantity) || 0;
    catMap.set(catName, (catMap.get(catName) || 0) + qty);
  }

  const categoryBreakdown: IssueCategoryBreakdown[] = Array.from(catMap.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([name, quantity], idx) => {
      const palette = CATEGORY_PALETTE[idx % CATEGORY_PALETTE.length];
      const percentage = totalQuantity > 0 ? Math.round((quantity / totalQuantity) * 100) : 0;
      return {
        name,
        quantity,
        percentage,
        barColor: palette.barColor,
        dotColor: palette.dotColor,
        textColor: palette.textColor,
      };
    });

  return {
    totalTransactions,
    totalQuantity,
    totalHppAmount,
    categoryBreakdown,
  };
}

export async function generateIssueCode(): Promise<string> {
  const supabase = createAdminClient();
  for (let i = 1; i <= 999999; i++) {
    const code = 'AD' + String(i).padStart(4, '0');
    const { count } = await supabase
      .from('goods_issues')
      .select('*', { count: 'exact', head: true })
      .eq('issue_code', code);
    if ((count ?? 0) === 0) return code;
  }
  return 'AD' + Date.now().toString().slice(-6);
}

export async function insertGoodsIssue(data: InsertGoodsIssuePayload) {
  const supabase = createAdminClient();
  return supabase.from('goods_issues').insert(data).select().single();
}

export async function deleteGoodsIssue(id: string) {
  const supabase = createAdminClient();
  return supabase.from('goods_issues').delete().eq('id', id);
}
