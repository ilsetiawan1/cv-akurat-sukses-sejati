// types/user.types.ts

export type UserRole = 'super_admin' | 'admin';
export type UserStatus = 'active' | 'inactive';
export type FeatureKey = 'dashboard' | 'hak_akses' | 'data_master' | 'transaksi' | 'laporan' | 'pengaturan';

export interface User {
  id: string;
  user_code: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserPermission {
  id: string;
  user_id: string;
  feature: FeatureKey;
  can_create: boolean;
  can_read: boolean;
  can_update: boolean;
  can_delete: boolean;
}

export interface UserWithPermissions extends User {
  user_permissions: UserPermission[];
}

// ── Input types ───────────────────────────────────────────────
export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
  role?: UserRole;
  status?: UserStatus;
}

export interface PermissionInput {
  feature: FeatureKey;
  can_create: boolean;
  can_read: boolean;
  can_update: boolean;
  can_delete: boolean;
}

// ── Paginated response ────────────────────────────────────────
export interface PaginatedUsers {
  data: UserWithPermissions[];
  total: number;
  page: number;
  limit: number;
}

export type ActionResult<T = void> = { success: true; data?: T } | { success: false; error: string };
