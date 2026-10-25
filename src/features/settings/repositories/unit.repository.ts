// lib/repositories/unit.repository.ts
import { createAdminClient } from '@/shared/lib/supabase/server-admin';
import type { Unit } from '@/features/items/types/item.types';

export async function getAllUnits(): Promise<Unit[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('units')
    .select('*')
    .order('name', { ascending: true });
    
  if (error) throw new Error(`Gagal mengambil satuan: ${error.message}`);
  return data ?? [];
}
