// src/features/goods-receipt/repositories/goods-receipt.repository.ts
import { createAdminClient } from '@/lib/supabase/server-admin';
import type { 
  GoodsReceiptWithRelations, 
  InsertGoodsReceiptPayload, 
  ReceiptSummaryStats,
  ReceiptCategoryBreakdown
} from '../types/goods-receipt.types';

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

export async function getGoodsReceiptsPaginated(
  page: number, 
  limit: number, 
  search?: string, 
  categoryId?: string,
  month?: string
) {
  const supabase = createAdminClient();
  
  let query = supabase.from('goods_receipts').select(`
    *,
    item:items!inner (
      id, item_code, name, category_id,
      category:categories(name),
      unit:units(name)
    ),
    supplier:suppliers(id, name),
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
    query = query.gte('receipt_date', start).lte('receipt_date', end);
  }

  const from = (page - 1) * limit;
  const { data, count, error } = await query
    .range(from, from + limit - 1)
    .order('receipt_date', { ascending: false })
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

export async function getGoodsReceiptStats(
  search?: string, 
  categoryId?: string, 
  month?: string
): Promise<ReceiptSummaryStats> {
  const supabase = createAdminClient();
  
  let query = supabase.from('goods_receipts').select(`
    quantity,
    total_price,
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
    query = query.gte('receipt_date', start).lte('receipt_date', end);
  }

  const { data, error } = await query;
  if (error || !data) {
    return { 
      totalTransactions: 0, 
      totalQuantity: 0, 
      totalAmount: 0,
      categoryBreakdown: [] 
    };
  }

  const totalTransactions = data.length;
  const totalQuantity = data.reduce((acc, r) => acc + (Number(r.quantity) || 0), 0);
  const totalAmount = data.reduce((acc, r) => acc + (Number(r.total_price) || 0), 0);

  // Agregasi distribusi per kategori
  const catMap = new Map<string, number>();
  for (const row of data) {
    const itemObj = row.item as unknown as { category?: { name?: string } | null } | null;
    const catName = itemObj?.category?.name || 'Lainnya';
    const qty = Number(row.quantity) || 0;
    catMap.set(catName, (catMap.get(catName) || 0) + qty);
  }

  const categoryBreakdown: ReceiptCategoryBreakdown[] = Array.from(catMap.entries())
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
    totalAmount,
    categoryBreakdown,
  };
}

export async function getLastReceiptPerItemMap(): Promise<Record<string, { supplierId: string; purchasePrice: number }>> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('goods_receipts')
    .select('item_id, supplier_id, quantity, total_price, created_at')
    .order('created_at', { ascending: false });

  if (error || !data) {
    return {};
  }

  const result: Record<string, { supplierId: string; purchasePrice: number }> = {};
  for (const row of data) {
    if (row.item_id && !result[row.item_id]) {
      const qty = Number(row.quantity) || 1;
      const totalPrice = Number(row.total_price) || 0;
      const unitPrice = qty > 0 ? Math.round(totalPrice / qty) : 0;
      result[row.item_id] = {
        supplierId: row.supplier_id,
        purchasePrice: unitPrice,
      };
    }
  }

  return result;
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
