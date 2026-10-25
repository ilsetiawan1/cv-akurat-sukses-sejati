// lib/repositories/item.repository.ts
import { createAdminClient } from '@/lib/supabase/server-admin';
import type { CreateItemInput, UpdateItemInput } from '@/types/item.types';

export async function getItemsPaginated(page: number, limit: number, search?: string, categoryId?: string) {
  const supabase = createAdminClient();
  let query = supabase.from('items').select(`
    *,
    category:categories(id, name),
    unit:units(id, name)
  `, { count: 'exact' });

  if (search) {
    query = query.ilike('name', `%${search}%`);
  }
  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }

  const from = (page - 1) * limit;
  return query.range(from, from + limit - 1).order('created_at', { ascending: false });
}

export async function getItemById(id: string) {
  const supabase = createAdminClient();
  return supabase.from('items').select(`
    *,
    category:categories(id, name),
    unit:units(id, name)
  `).eq('id', id).single();
}

export async function generateItemCode(): Promise<string> {
  const supabase = createAdminClient();

  for (let i = 1; i <= 999999; i++) {
    const code = String(i).padStart(6, '0');

    const { count } = await supabase
      .from('items')
      .select('*', { count: 'exact', head: true })
      .eq('item_code', code);

    if ((count ?? 0) === 0) return code;
  }

  return Date.now().toString().slice(-6);
}

export async function createItem(data: CreateItemInput & { item_code: string }) {
  const supabase = createAdminClient();
  return supabase.from('items').insert(data).select().single();
}

export async function updateItem(id: string, data: UpdateItemInput) {
  const supabase = createAdminClient();
  return supabase.from('items').update(data).eq('id', id).select().single();
}

export async function deleteItem(id: string) {
  const supabase = createAdminClient();
  
  // Validasi: Cek apakah ada di tabel inventory
  const { count } = await supabase
    .from('inventory')
    .select('*', { count: 'exact', head: true })
    .eq('item_id', id);
    
  if (count && count > 0) {
    return { error: { message: 'Barang tidak dapat dihapus karena sudah memiliki catatan persediaan (inventory).' } };
  }
  
  return supabase.from('items').delete().eq('id', id);
}

export async function getAllItems() {
  const supabase = createAdminClient();
  return supabase.from('items').select(`*, category:categories(id, name), unit:units(id, name)`).order('name', { ascending: true });
}
