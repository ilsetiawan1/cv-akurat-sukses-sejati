// lib/repositories/goods-issue.repository.ts
import { createAdminClient } from '@/lib/supabase/server-admin';
import type { GoodsIssueWithRelations } from '@/types/transaction.types';

export async function getGoodsIssuesPaginated(page: number, limit: number, search?: string) {
  const supabase = createAdminClient();
  
  let query = supabase.from('goods_issues').select(`
    *,
    item:items!inner (
      id, item_code, name,
      category:categories(name),
      unit:units(name)
    ),
    user:users(id, name)
  `, { count: 'exact' });

  if (search) {
    query = query.ilike('items.name', `%${search}%`);
  }

  const from = (page - 1) * limit;
  const { data, count, error } = await query
    .range(from, from + limit - 1)
    .order('created_at', { ascending: false });

  if (error) {
    return { data: null, count: null, error };
  }

  const mappedData = data?.map((row: any) => ({
    ...row,
    item: row.item,
    user: row.user
  })) as GoodsIssueWithRelations[];

  return { data: mappedData, count, error: null };
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

export async function insertGoodsIssue(data: any) {
  const supabase = createAdminClient();
  return supabase.from('goods_issues').insert(data).select().single();
}

export async function deleteGoodsIssue(id: string) {
  const supabase = createAdminClient();
  return supabase.from('goods_issues').delete().eq('id', id);
}
