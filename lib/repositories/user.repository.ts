// lib/repositories/user.repository.ts

import { createClient } from '@/lib/supabase/server';

/**
 * DATA ACCESS LAYER — hanya boleh berisi Supabase query.
 * Tidak ada logika bisnis di sini.
 */

/** Ambil data user beserta permissions-nya berdasarkan user ID Supabase Auth. */
export async function getUserById(id: string) {
  const supabase = await createClient();
  return supabase.from('users').select('*, user_permissions(*)').eq('id', id).single();
}

/** Ambil data user berdasarkan email (untuk keperluan validasi manual). */
export async function getUserByEmail(email: string) {
  const supabase = await createClient();
  return supabase.from('users').select('*').eq('email', email).single();
}
