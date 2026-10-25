// lib/repositories/goods-receipt.repository.ts
import { createAdminClient } from '@/lib/supabase/server-admin';
import type { GoodsReceiptWithRelations, InsertGoodsReceiptPayload } from '@/types/transaction.types';

export async function getGoodsReceiptsPaginated(page: number, limit: number, search?: string) {
  const supabase = createAdminClient();
  
  let query = supabase.from('goods_receipts').select(`
    *,
    item:items!inner (
      id, item_code, name,
      category:categories(name),
      unit:units(name)
    ),
    supplier:suppliers(id, name),
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

  const mappedData = ((data ?? []) as unknown as GoodsReceiptWithRelations[]).map((row) => ({
    ...row,
    item: row.item,
    supplier: row.supplier,
    user: row.user
  }));

  return { data: mappedData, count, error: null };
}

export async function generateReceiptCode(): Promise<string> {
  const supabase = createAdminClient();
  for (let i = 1; i <= 999999; i++) {
    const code = 'AD' + String(i).padStart(4, '0');
    const { count } = await supabase
      .from('goods_receipts')
      .select('*', { count: 'exact', head: true })
      .eq('receipt_code', code);
    if ((count ?? 0) === 0) return code;
  }
  return 'AD' + Date.now().toString().slice(-6);
}

export async function insertGoodsReceipt(data: InsertGoodsReceiptPayload) {
  const supabase = createAdminClient();
  return supabase.from('goods_receipts').insert(data).select().single();
}

export async function deleteGoodsReceipt(id: string) {
  const supabase = createAdminClient();
  return supabase.from('goods_receipts').delete().eq('id', id);
}
