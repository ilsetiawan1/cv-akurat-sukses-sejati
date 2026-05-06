// lib/actions/user.actions.ts

'use server';

import { revalidatePath } from 'next/cache';
import { createUserSchema, updateUserSchema, upsertPermissionsSchema } from '@/lib/validations/user.schema';
import { listUsers, addUser, editUser, removeUser, savePermissions } from '@/lib/services/user.service';
import type { ActionResult, PaginatedUsers } from '@/types/user.types';

const REVALIDATE = () => revalidatePath('/hak-akses');

// ── List ──────────────────────────────────────────────────────
export async function getUsersAction(
  page = 1,
  limit = 10,
  search = ''
): Promise<ActionResult<PaginatedUsers>> {
  try {
    const result = await listUsers(page, limit, search);
    return { success: true, data: result };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}

// ── Create ────────────────────────────────────────────────────
export async function createUserAction(
  formData: unknown
): Promise<ActionResult<{ id: string }>> {
  const parsed = createUserSchema.safeParse(formData);
  if (!parsed.success) {
    const msg = Object.values(parsed.error.flatten().fieldErrors)[0]?.[0];
    return { success: false, error: msg ?? 'Input tidak valid' };
  }

  try {
    const result = await addUser(parsed.data);
    REVALIDATE();
    return { success: true, data: result };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}

// ── Update ────────────────────────────────────────────────────
export async function updateUserAction(
  id: string,
  formData: unknown
): Promise<ActionResult> {
  const parsed = updateUserSchema.safeParse(formData);
  if (!parsed.success) {
    const msg = Object.values(parsed.error.flatten().fieldErrors)[0]?.[0];
    return { success: false, error: msg ?? 'Input tidak valid' };
  }

  try {
    await editUser(id, parsed.data);
    REVALIDATE();
    return { success: true };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}

// ── Delete ────────────────────────────────────────────────────
export async function deleteUserAction(id: string): Promise<ActionResult> {
  try {
    await removeUser(id);
    REVALIDATE();
    return { success: true };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}

// ── Permissions ───────────────────────────────────────────────
export async function updatePermissionsAction(
  formData: unknown
): Promise<ActionResult> {
  const parsed = upsertPermissionsSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: 'Data permissions tidak valid' };
  }

  try {
    await savePermissions(parsed.data.userId, parsed.data.permissions);
    REVALIDATE();
    return { success: true };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}