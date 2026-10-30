// src/features/goods-receipt/actions/goods-receipt.actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/features/users/services/user.service';
import { goodsReceiptSchema } from '@/features/transactions/validations/transaction.schema';
import { addGoodsReceipt, cancelGoodsReceipt } from '@/features/goods-receipt/services/goods-receipt.service';
import type { ActionResult } from '@/features/users/types/user.types';

const REVALIDATE = () => {
  revalidatePath('/transaksi/barang-masuk');
  revalidatePath('/transaksi/persediaan');
  revalidatePath('/dashboard');
};

async function checkAccess(action: 'can_create') {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');
  
  const currentUser = await getCurrentUser(user.id);
  if (!currentUser) throw new Error('Unauthorized');

  if (currentUser.role === 'super_admin') return currentUser;

  if (currentUser.user_code === 'P03' || currentUser.name.toLowerCase().includes('kasir')) {
    throw new Error('Role Kasir tidak memiliki hak akses untuk mencatat penerimaan barang masuk');
  }

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

export async function deleteGoodsReceiptAction(receiptId: string): Promise<ActionResult> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    const currentUser = await getCurrentUser(user.id);
    if (!currentUser) throw new Error('Unauthorized');

    if (currentUser.role !== 'super_admin') {
      return { success: false, error: 'Hanya Super Admin yang berwenang membatalkan transaksi barang masuk.' };
    }

    await cancelGoodsReceipt(receiptId);

    REVALIDATE();
    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: (error as Error).message || 'Terjadi kesalahan saat membatalkan transaksi' };
  }
}
