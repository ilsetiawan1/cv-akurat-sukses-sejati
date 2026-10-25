// lib/actions/supplier.actions.ts

'use server';

import { supplierSchema } from '@/lib/validations/supplier.schema';
import { addSupplier, editSupplier, removeSupplier } from '@/lib/services/supplier.service';
import { revalidatePath } from 'next/cache';
import type { ActionResult } from '@/types/user.types';
import { createClient } from '@/lib/supabase/server';

async function checkSession() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new Error('Unauthorized');
  return user;
}

// Helper: konversi undefined → null agar cocok dengan DB types
function toNull(val: string | null | undefined): string | null {
  return val ?? null;
}

export async function addSupplierAction(formData: unknown): Promise<ActionResult> {
  try {
    await checkSession();

    const parsed = supplierSchema.safeParse(formData);
    if (!parsed.success) {
      const firstError =
        Object.values(parsed.error.flatten().fieldErrors)[0]?.[0] ??
        parsed.error.flatten().formErrors[0] ??
        'Input tidak valid';
      return { success: false, error: firstError };
    }

    const { name, contact_name, email, address, phone } = parsed.data;

    await addSupplier({
      name,
      contact_name: toNull(contact_name),
      email:        toNull(email),
      address:      toNull(address),
      phone:        toNull(phone),
      avatar_url:   null,
    });

    revalidatePath('/data-master/supplier');
    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: (error as Error).message || 'Terjadi kesalahan' };
  }
}

export async function editSupplierAction(id: string, formData: unknown): Promise<ActionResult> {
  try {
    await checkSession();

    const parsed = supplierSchema.safeParse(formData);
    if (!parsed.success) {
      const firstError =
        Object.values(parsed.error.flatten().fieldErrors)[0]?.[0] ?? 'Input tidak valid';
      return { success: false, error: firstError };
    }

    const { name, contact_name, email, address, phone } = parsed.data;

    await editSupplier(id, {
      name,
      contact_name: toNull(contact_name),
      email:        toNull(email),
      address:      toNull(address),
      phone:        toNull(phone),
    });

    revalidatePath('/data-master/supplier');
    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: (error as Error).message || 'Terjadi kesalahan' };
  }
}

export async function deleteSupplierAction(id: string): Promise<ActionResult> {
  try {
    await checkSession();
    await removeSupplier(id);
    revalidatePath('/data-master/supplier');
    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: (error as Error).message || 'Terjadi kesalahan' };
  }
}