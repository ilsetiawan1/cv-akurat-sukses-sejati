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
  const mappedData = data?.map((row: any) => ({
    ...row,
    item: row.items,
    items: undefined
  })) as InventoryWithItem[];

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
