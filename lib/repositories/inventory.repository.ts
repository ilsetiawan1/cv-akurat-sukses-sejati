// lib/repositories/inventory.repository.ts
import { createAdminClient } from '@/lib/supabase/server-admin';
import type { InventoryWithItem } from '@/types/inventory.types';

export async function getInventoryPaginated(page: number, limit: number, search?: string) {
  const supabase = createAdminClient();
  
  let query = supabase.from('inventory').select(`
    *,
    items!inner (
      id,
      item_code,
      name,
      price,
      category:categories(id, name),
      unit:units(id, name)
    )
  `, { count: 'exact' });

  if (search) {
    query = query.ilike('items.name', `%${search}%`);
  }

  const from = (page - 1) * limit;
  const { data, count, error } = await query
    .range(from, from + limit - 1)
    .order('updated_at', { ascending: false });

  if (error) {
    return { data: null, count: null, error };
  }

  // Map "items" relation to "item" to match our interface
  const mappedData = ((data ?? []) as unknown as Record<string, unknown>[]).map((row) => ({
    ...row,
    item: row.items,
    items: undefined
  })) as unknown as InventoryWithItem[];

  return { data: mappedData, count, error: null };
}

export async function getInventoryByItemId(itemId: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('inventory')
    .select(`
      *,
      items (
        id,
        item_code,
        name,
        price,
        category:categories(id, name),
        unit:units(id, name)
      )
    `)
    .eq('item_id', itemId)
    .single();

  if (error) {
    return { data: null, error };
  }

  const mappedData = {
    ...data,
    item: data.items,
    items: undefined
  } as InventoryWithItem;

  return { data: mappedData, error: null };
}

export async function getRawInventoryByItemId(itemId: string) {
  const supabase = createAdminClient();
  return supabase
    .from('inventory')
    .select('*')
    .eq('item_id', itemId)
    .single();
}

export async function updateInventoryStockAndHpp(id: string, stock: number, hpp?: number) {
  const supabase = createAdminClient();
  const updatePayload: Record<string, unknown> = {
    stock,
    updated_at: new Date().toISOString()
  };
  if (hpp !== undefined) {
    updatePayload.hpp = hpp;
  }
  return supabase
    .from('inventory')
    .update(updatePayload)
    .eq('id', id);
}

export async function generateInventoryCode(): Promise<string> {
  const supabase = createAdminClient();
  for (let i = 1; i <= 9999; i++) {
    const code = 'DP' + String(i).padStart(4, '0');
    const { count } = await supabase
      .from('inventory')
      .select('*', { count: 'exact', head: true })
      .eq('inventory_code', code);
    if ((count ?? 0) === 0) return code;
  }
  return 'DP' + Date.now().toString().slice(-4);
}

export async function insertInventoryRecord(data: {
  inventory_code: string;
  item_id: string;
  stock: number;
  hpp: number;
}) {
  const supabase = createAdminClient();
  return supabase.from('inventory').insert(data);
}
