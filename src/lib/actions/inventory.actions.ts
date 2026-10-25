// lib/actions/inventory.actions.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/services/user.service';
import { listInventory } from '@/lib/services/inventory.service';
import type { ActionResult } from '@/types/user.types';
import type { PaginatedInventory } from '@/types/inventory.types';

async function checkAccess(action: 'can_read') {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');
  
  const currentUser = await getCurrentUser(user.id);
  if (!currentUser) throw new Error('Unauthorized');

  if (currentUser.role === 'super_admin') return;

  const perm = currentUser.user_permissions?.find(p => p.feature === 'transaksi');
  if (!perm || !perm[action]) {
    throw new Error('Anda tidak memiliki akses untuk melihat data ini');
  }
}

export async function getInventoryAction(page = 1, limit = 10, search = ''): Promise<ActionResult<PaginatedInventory>> {
  try {
    await checkAccess('can_read');
    const result = await listInventory(page, limit, search);
    return { success: true, data: result };
  } catch (error: unknown) {
    return { success: false, error: (error as Error).message || 'Terjadi kesalahan sistem' };
  }
}
