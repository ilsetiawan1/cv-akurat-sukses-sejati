// lib/actions/goods-receipt.actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/services/user.service';
import { goodsReceiptSchema } from '@/lib/validations/transaction.schema';
import { addGoodsReceipt } from '@/lib/services/goods-receipt.service';
import type { ActionResult } from '@/types/user.types';

const REVALIDATE = () => {
  revalidatePath('/transaksi/barang-masuk');
  revalidatePath('/transaksi/persediaan'); // Update dashboard persediaan juga
};

async function checkAccess(action: 'can_create') {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');
  
  const currentUser = await getCurrentUser(user.id);
  if (!currentUser) throw new Error('Unauthorized');

  if (currentUser.role === 'super_admin') return currentUser;

  const perm = currentUser.user_permissions?.find(p => p.feature === 'transaksi');
  if (!perm || !perm[action]) {
    throw new Error('Anda tidak memiliki akses untuk melakukan tindakan ini');
  }
  return currentUser;
}

export async function addGoodsReceiptAction(formData: unknown): Promise<ActionResult> {
  try {
    const currentUser = await checkAccess('can_create');

    const parsed = goodsReceiptSchema.safeParse(formData);
    if (!parsed.success) {
      const firstError = Object.values(parsed.error.flatten().fieldErrors)[0]?.[0] ?? 'Input tidak valid';
      return { success: false, error: firstError };
    }

    await addGoodsReceipt(currentUser.id, parsed.data);

    REVALIDATE();
    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: (error as Error).message || 'Terjadi kesalahan sistem' };
  }
}
