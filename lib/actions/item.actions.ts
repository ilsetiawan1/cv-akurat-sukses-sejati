// lib/actions/item.actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/services/user.service';
import { itemSchema } from '@/lib/validations/item.schema';
import { addItem, editItem, removeItem } from '@/lib/services/item.service';
import type { ActionResult } from '@/types/user.types';

const REVALIDATE = () => revalidatePath('/data-master/barang');

async function checkAccess(action: 'can_create' | 'can_update' | 'can_delete') {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');
  
  const currentUser = await getCurrentUser(user.id);
  if (!currentUser) throw new Error('Unauthorized');

  if (currentUser.role === 'super_admin') return;

  const perm = currentUser.user_permissions?.find(p => p.feature === 'data_master');
  if (!perm || !perm[action]) {
    throw new Error('Anda tidak memiliki akses untuk melakukan tindakan ini');
  }
}

function toNull(val: string | null | undefined): string | null {
  return val ? val : null;
}

export async function addItemAction(formData: unknown): Promise<ActionResult> {
  try {
    await checkAccess('can_create');

    const parsed = itemSchema.safeParse(formData);
    if (!parsed.success) {
      const firstError =
        Object.values(parsed.error.flatten().fieldErrors)[0]?.[0] ?? 'Input tidak valid';
      return { success: false, error: firstError };
    }

    const { name, category_id, unit_id, price } = parsed.data;

    await addItem({
      name,
      category_id: toNull(category_id),
      unit_id: toNull(unit_id),
      price,
    });

    REVALIDATE();
    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: (error as Error).message || 'Terjadi kesalahan' };
  }
}

export async function editItemAction(id: string, formData: unknown): Promise<ActionResult> {
  try {
    await checkAccess('can_update');

    const parsed = itemSchema.safeParse(formData);
    if (!parsed.success) {
      const firstError =
        Object.values(parsed.error.flatten().fieldErrors)[0]?.[0] ?? 'Input tidak valid';
      return { success: false, error: firstError };
    }

    const { name, category_id, unit_id, price } = parsed.data;

    await editItem(id, {
      name,
      category_id: toNull(category_id),
      unit_id: toNull(unit_id),
      price,
    });

    REVALIDATE();
    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: (error as Error).message || 'Terjadi kesalahan' };
  }
}

export async function deleteItemAction(id: string): Promise<ActionResult> {
  try {
    await checkAccess('can_delete');
    await removeItem(id);
    REVALIDATE();
    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: (error as Error).message || 'Terjadi kesalahan' };
  }
}
