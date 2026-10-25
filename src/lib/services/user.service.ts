// lib/services/user.service.ts

import { createAdminClient } from '@/lib/supabase/server-admin';
import { getUsers, getUserById, updateUser, deleteUserById, upsertUserPermissions } from '@/lib/repositories/user.repository';
import type { UserWithPermissions, PaginatedUsers, PermissionInput } from '@/types/user.types';

/**
 * BUSINESS LOGIC LAYER
 */

export async function getCurrentUser(userId: string): Promise<UserWithPermissions | null> {
  const { data, error } = await getUserById(userId);
  if (error || !data) return null;
  return data as UserWithPermissions;
}

export async function listUsers(page = 1, limit = 10, search = ''): Promise<PaginatedUsers> {
  const { data, count, error } = await getUsers(page, limit, search);
  if (error) throw new Error(error.message);
  return { data: (data ?? []) as UserWithPermissions[], total: count ?? 0, page, limit };
}

export async function addUser(input: { name: string; email: string; password: string; role: string }): Promise<{ id: string }> {
  const supabase = createAdminClient();

  // 1. Buat user di Supabase Auth
  // Trigger on_auth_user_created akan OTOMATIS insert ke public.users
  // JANGAN insert manual ke public.users — akan menyebabkan duplicate key!
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: input.email,
    password: input.password,
    email_confirm: true,
    user_metadata: {
      name: input.name,
      role: input.role,
    },
  });
  if (authError) throw new Error(authError.message);

  const userId = authData.user.id;

  // 2. Tunggu sebentar agar trigger selesai insert ke public.users
  await new Promise((resolve) => setTimeout(resolve, 500));

  // 3. Update role & name (trigger mungkin pakai default)
  const { error: updateError } = await updateUser(userId, {
    name: input.name,
    role: input.role,
  });
  if (updateError) throw new Error(updateError.message);

  // 4. Set default permissions (read-only semua fitur)
  const features = ['dashboard', 'hak_akses', 'data_master', 'transaksi', 'laporan', 'pengaturan'];
  const { error: permError } = await upsertUserPermissions(
    userId,
    features.map((f) => ({
      feature: f,
      can_create: false,
      can_read: true,
      can_update: false,
      can_delete: false,
    })),
  );
  if (permError) throw new Error(permError.message);

  return { id: userId };
}

export async function editUser(id: string, data: Partial<{ name: string; email: string; role: string; status: string }>) {
  const { error } = await updateUser(id, data);
  if (error) throw new Error(error.message);
}

export async function removeUser(id: string) {
  const supabase = createAdminClient();

  // Hapus dari Supabase Auth (cascade ke public.users via FK)
  const { error: authError } = await supabase.auth.admin.deleteUser(id);
  if (authError) throw new Error(authError.message);

  // Hapus dari public.users jika masih ada (trigger mungkin tidak hapus)
  await deleteUserById(id);
}

export async function savePermissions(userId: string, permissions: PermissionInput[]) {
  const { error } = await upsertUserPermissions(userId, permissions);
  if (error) throw new Error(error.message);
}
