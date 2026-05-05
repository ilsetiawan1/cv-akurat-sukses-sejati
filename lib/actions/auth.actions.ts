// lib/actions/auth.actions.ts
'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { loginSchema } from '@/lib/validations/user.schema';
import type { ActionResult } from '@/types/user.types';
import { revalidatePath } from 'next/cache';

export async function loginAction(formData: { email: string; password: string }): Promise<ActionResult> {
  const parsed = loginSchema.safeParse(formData);

  if (!parsed.success) {
    const firstError = Object.values(parsed.error.flatten().fieldErrors)[0]?.[0];
    return { success: false, error: firstError ?? 'Input tidak valid' };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error || !data.session) {
    return { success: false, error: 'Email atau password salah. Silakan coba lagi.' };
  }

  console.log('[loginAction] ✅ login success:', data.user?.email);

  // KUNCI: Revalidate path untuk memastikan data session terbaru dibaca
  revalidatePath('/', 'layout');

  // REDIRECT: Pastikan berada di paling akhir fungsi
  redirect('/beranda');
}

export async function logoutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();

  revalidatePath('/', 'layout');
  redirect('/login');
}
