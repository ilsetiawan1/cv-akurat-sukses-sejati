// lib/repositories/user.repository.ts

import { createAdminClient } from '@/lib/supabase/server-admin';

/**
 * DATA ACCESS LAYER — hanya boleh berisi Supabase query.
 * Tidak ada logika bisnis di sini.
 *
 * Menggunakan Admin Client (service_role) agar query tidak diblokir RLS.
 * Aman karena semua fungsi di sini hanya dipanggil dari server-side code
 * yang sudah memverifikasi autentikasi pengguna terlebih dahulu.
 */

/** Ambil data user beserta permissions-nya berdasarkan user ID Supabase Auth. */
export async function getUserById(id: string) {
  const supabase = createAdminClient();
  return supabase.from('users').select('*, user_permissions(*)').eq('id', id).single();
}

/** Ambil data user berdasarkan email (untuk keperluan validasi manual). */
export async function getUserByEmail(email: string) {
  const supabase = createAdminClient();
  return supabase.from('users').select('*').eq('email', email).single();
}
