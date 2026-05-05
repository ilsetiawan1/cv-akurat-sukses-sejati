// types/user.types.ts

export type UserRole = 'super_admin' | 'admin';
export type UserStatus = 'active' | 'inactive';
export type FeatureKey = 'dashboard' | 'hak_akses' | 'data_master' | 'transaksi' | 'laporan' | 'pengaturan';

export interface User {
  id: string;
  user_code: string; // P01, P02, ...
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

// Hasil kembalian dari setiap Server Action
export type ActionResult<T = void> = { success: true; data?: T } | { success: false; error: string };
