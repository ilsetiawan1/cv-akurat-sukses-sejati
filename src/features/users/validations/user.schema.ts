// lib/validations/user.schema.ts

import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'Email wajib diisi').email('Format email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  remember: z.boolean().optional().default(false),
});

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Email wajib diisi').email('Format email tidak valid'),
});

export const createUserSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter').max(100),
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(8, 'Password minimal 8 karakter'),
  role: z.enum(['super_admin', 'admin']),
});

export const updateUserSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  email: z.string().email().optional(),
  role: z.enum(['super_admin', 'admin']).optional(),
  status: z.enum(['active', 'inactive']).optional(),
});

export const permissionSchema = z.object({
  feature: z.enum(['dashboard', 'hak_akses', 'data_master', 'transaksi', 'laporan', 'pengaturan']),
  can_create: z.boolean(),
  can_read: z.boolean(),
  can_update: z.boolean(),
  can_delete: z.boolean(),
});

export const upsertPermissionsSchema = z.object({
  userId: z.string().uuid(),
  permissions: z.array(permissionSchema),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UpsertPermissionsInput = z.infer<typeof upsertPermissionsSchema>;