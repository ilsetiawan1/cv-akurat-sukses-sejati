// lib/repositories/supplier.repository.ts

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/server-admin';
import type { CreateSupplierInput, UpdateSupplierInput } from '@/types/supplier.types';

export async function getSuppliersPaginated(page: number, limit: number, search?: string) {
  const supabase = await createClient();
  let query = supabase.from('suppliers').select('*', { count: 'exact' });

  if (search) {
    query = query.or(
      `name.ilike.%${search}%,email.ilike.%${search}%,contact_name.ilike.%${search}%`
    );
  }

  const from = (page - 1) * limit;
  return query.range(from, from + limit - 1).order('created_at', { ascending: false });
}

export async function getSupplierById(id: string) {
  const supabase = await createClient();
  return supabase.from('suppliers').select('*').eq('id', id).single();
}

/**
 * FIX: Loop cek ketersediaan kode satu per satu.
 * Tidak pakai getLatestSupplier() + increment karena bisa conflict
 * jika ada gap atau data seed sudah mengisi kode tertentu.
 * Gunakan Admin Client agar tidak diblokir RLS saat cek.
 */
export async function generateSupplierCode(): Promise<string> {
  const supabase = createAdminClient();

  for (let i = 1; i <= 999; i++) {
    const code = 'S' + String(i).padStart(3, '0');

    const { count } = await supabase
      .from('suppliers')
      .select('*', { count: 'exact', head: true })
      .eq('supplier_code', code);

    if ((count ?? 0) === 0) return code; // kode belum dipakai → gunakan ini
  }

  // Fallback sangat jarang terjadi
  return 'S' + Date.now().toString().slice(-6);
}

export async function createSupplier(data: CreateSupplierInput & { supplier_code: string }) {
  const supabase = await createClient();
  return supabase.from('suppliers').insert(data).select().single();
}

export async function updateSupplier(id: string, data: UpdateSupplierInput) {
  const supabase = await createClient();
  return supabase.from('suppliers').update(data).eq('id', id).select().single();
}

export async function deleteSupplier(id: string) {
  const supabase = await createClient();
  return supabase.from('suppliers').delete().eq('id', id);
}

export async function getAllSuppliers() {
  const supabase = await createClient();
  return supabase.from('suppliers').select('*').order('name', { ascending: true });
}