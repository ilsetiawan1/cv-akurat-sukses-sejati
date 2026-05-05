// lib/services/user.service.ts

import { getUserById } from '@/lib/repositories/user.repository';
import type { UserWithPermissions } from '@/types/user.types';

/**
 * BUSINESS LOGIC LAYER — mengolah data dari repository.
 * Tidak mengakses Supabase secara langsung.
 */

/**
 * Ambil data user lengkap (termasuk permissions) berdasarkan ID.
 * Kembalikan null jika user tidak ditemukan.
 */
export async function getCurrentUser(userId: string): Promise<UserWithPermissions | null> {
  const { data, error } = await getUserById(userId);
  if (error || !data) return null;
  return data as UserWithPermissions;
}
