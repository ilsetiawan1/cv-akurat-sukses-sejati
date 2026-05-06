// lib/repositories/user.repository.ts

import { createAdminClient } from '@/lib/supabase/server-admin';

/**
 * DATA ACCESS LAYER — query tabel users & user_permissions.
 * Selalu gunakan Admin Client agar tidak diblokir RLS.
 */

// ── Read ──────────────────────────────────────────────────────

export async function getUsers(page: number, limit: number, search: string) {
  const supabase = createAdminClient();
  const from = (page - 1) * limit;

  let query = supabase
    .from('users')
    .select('*, user_permissions(*)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, from + limit - 1);

  if (search) {
    query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
  }

  return query;
}

export async function getUserById(id: string) {
  const supabase = createAdminClient();
  return supabase
    .from('users')
    .select('*, user_permissions(*)')
    .eq('id', id)
    .single();
}

export async function getUserByEmail(email: string) {
  const supabase = createAdminClient();
  return supabase.from('users').select('*').eq('email', email).single();
}

// ── Generate user_code ────────────────────────────────────────

export async function generateUserCode(): Promise<string> {
  const supabase = createAdminClient();
  const { count } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true });
  const next = (count ?? 0) + 1;
  return 'P' + String(next).padStart(2, '0');
}

// ── Create ────────────────────────────────────────────────────

export async function insertUser(data: {
  id: string;
  user_code: string;
  name: string;
  email: string;
  role: string;
}) {
  const supabase = createAdminClient();
  return supabase.from('users').insert({
    id: data.id,
    user_code: data.user_code,
    name: data.name,
    email: data.email,
    password_hash: 'MANAGED_BY_SUPABASE_AUTH',
    role: data.role,
    status: 'active',
  });
}

// ── Update ────────────────────────────────────────────────────

export async function updateUser(
  id: string,
  data: Partial<{ name: string; email: string; role: string; status: string }>
) {
  const supabase = createAdminClient();
  return supabase.from('users').update(data).eq('id', id);
}

// ── Delete ────────────────────────────────────────────────────

export async function deleteUserById(id: string) {
  const supabase = createAdminClient();
  return supabase.from('users').delete().eq('id', id);
}

// ── Permissions ───────────────────────────────────────────────

export async function upsertUserPermissions(
  userId: string,
  permissions: {
    feature: string;
    can_create: boolean;
    can_read: boolean;
    can_update: boolean;
    can_delete: boolean;
  }[]
) {
  const supabase = createAdminClient();
  const rows = permissions.map((p) => ({ user_id: userId, ...p }));
  return supabase
    .from('user_permissions')
    .upsert(rows, { onConflict: 'user_id,feature' });
}