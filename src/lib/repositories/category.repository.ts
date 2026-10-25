// lib/repositories/category.repository.ts
import { createAdminClient } from '@/lib/supabase/server-admin';
import type { Category } from '@/types/item.types';

export async function getAllCategories(): Promise<Category[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true });
    
  if (error) throw new Error(`Gagal mengambil kategori: ${error.message}`);
  return data ?? [];
}
