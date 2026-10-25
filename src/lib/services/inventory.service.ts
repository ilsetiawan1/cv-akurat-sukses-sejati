// lib/services/inventory.service.ts
import { getInventoryPaginated, getInventoryByItemId } from '@/lib/repositories/inventory.repository';

export async function listInventory(page: number, limit: number, search?: string) {
  const { data, count, error } = await getInventoryPaginated(page, limit, search);
  if (error) throw new Error(`Gagal mengambil data persediaan: ${error.message}`);
  return { data: data ?? [], total: count ?? 0, page, limit };
}

export async function getInventoryStatus(itemId: string) {
  const { data, error } = await getInventoryByItemId(itemId);
  // It's possible an item doesn't have an inventory record yet if no goods receipt has been made.
  if (error && error.code !== 'PGRST116') { // Ignore "Row not found" error
    throw new Error(`Gagal mengambil status persediaan: ${error.message}`);
  }
  return data;
}
