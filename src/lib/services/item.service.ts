// lib/services/item.service.ts
import {
  getItemsPaginated,
  getItemById,
  generateItemCode,
  createItem,
  updateItem,
  deleteItem,
  getAllItems,
} from '@/lib/repositories/item.repository';
import type { CreateItemInput, UpdateItemInput } from '@/types/item.types';

export async function listItems(page: number, limit: number, search?: string, categoryId?: string) {
  const { data, count, error } = await getItemsPaginated(page, limit, search, categoryId);
  if (error) throw new Error(error.message);
  return { data: data ?? [], total: count ?? 0, page, limit };
}

export async function getItem(id: string) {
  const { data, error } = await getItemById(id);
  if (error) throw new Error(error.message);
  return data;
}

export async function addItem(input: CreateItemInput) {
  const item_code = await generateItemCode();

  const { data, error } = await createItem({ ...input, item_code });
  if (error) throw new Error(`Gagal menambahkan barang: ${error.message}`);
  return data;
}

export async function editItem(id: string, input: UpdateItemInput) {
  const { data, error } = await updateItem(id, input);
  if (error) throw new Error(`Gagal memperbarui barang: ${error.message}`);
  return data;
}

export async function removeItem(id: string) {
  const { error } = await deleteItem(id);
  if (error) throw new Error(error.message);
}

export async function listAllItems() {
  const { data, error } = await getAllItems();
  if (error) throw new Error(error.message);
  return data ?? [];
}
