// lib/validations/user.schema.ts

import { z } from 'zod';

// ── Login ────────────────────────────────────────────────────────────────────
export const loginSchema = z.object({
  email: z.string().min(1, 'Email wajib diisi').email('Format email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  remember: z.boolean().optional().default(false),
});

export type LoginInput = z.infer<typeof loginSchema>;

// ── Forgot Password ──────────────────────────────────────────────────────────
export const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Email wajib diisi').email('Format email tidak valid'),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
