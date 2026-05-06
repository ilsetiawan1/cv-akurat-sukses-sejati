// lib/services/user.service.ts

import { createAdminClient } from '@/lib/supabase/server-admin';
import {
  getUsers,
  getUserById,
  generateUserCode,
  insertUser,
  updateUser,
  deleteUserById,
  upsertUserPermissions,
} from '@/lib/repositories/user.repository';
import type {
  UserWithPermissions,
  PaginatedUsers,
  PermissionInput,
} from '@/types/user.types';

/**
 * BUSINESS LOGIC LAYER
 */

export async function getCurrentUser(userId: string): Promise<UserWithPermissions | null> {
  const { data, error } = await getUserById(userId);
  if (error || !data) return null;
  return data as UserWithPermissions;
}

export async function listUsers(
  page = 1,
  limit = 10,
  search = ''
): Promise<PaginatedUsers> {
  const { data, count, error } = await getUsers(page, limit, search);
  if (error) throw new Error(error.message);
  return {
    data: (data ?? []) as UserWithPermissions[],
    total: count ?? 0,
    page,
    limit,
  };
}

export async function addUser(input: {
  name: string;
  email: string;
  password: string;
  role: string;
}): Promise<{ id: string }> {
  const supabase = createAdminClient();

  // 1. Buat user di Supabase Auth
  const { data: authData, error: authError } =
    await supabase.auth.admin.createUser({
      email: input.email,
      password: input.password,
      email_confirm: true,
    });
  if (authError) throw new Error(authError.message);

  const userId = authData.user.id;
  const userCode = await generateUserCode();

  // 2. Insert ke tabel public.users
  const { error: insertError } = await insertUser({
    id: userId,
    user_code: userCode,
    name: input.name,
    email: input.email,
    role: input.role,
  });
  if (insertError) throw new Error(insertError.message);

  // 3. Buat default permissions (read-only semua fitur)
  const features = [
    'dashboard','hak_akses','data_master','transaksi','laporan','pengaturan',
  ];
  await upsertUserPermissions(
    userId,
    features.map((f) => ({
      feature: f,
      can_create: false,
      can_read: true,
      can_update: false,
      can_delete: false,
    }))
  );

  return { id: userId };
}

export async function editUser(
  id: string,
  data: Partial<{ name: string; email: string; role: string; status: string }>
) {
  const { error } = await updateUser(id, data);
  if (error) throw new Error(error.message);
}

export async function removeUser(id: string) {
  const supabase = createAdminClient();

  // Hapus dari Auth dulu
  const { error: authError } = await supabase.auth.admin.deleteUser(id);
  if (authError) throw new Error(authError.message);

  // Hapus dari public.users (cascade akan hapus permissions)
  const { error } = await deleteUserById(id);
  if (error) throw new Error(error.message);
}

export async function savePermissions(
  userId: string,
  permissions: PermissionInput[]
) {
  const { error } = await upsertUserPermissions(userId, permissions);
  if (error) throw new Error(error.message);
}