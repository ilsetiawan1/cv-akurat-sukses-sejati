// lib/services/inventory.service.ts
import { 
  getInventoryPaginated, 
  getInventoryByItemId, 
  getInventorySummaryStats 
} from '@/features/inventory/repositories/inventory.repository';
import { getAllCategories } from '@/features/settings/repositories/category.repository';
import type { InventoryPageData } from '../types/inventory.types';

export async function listInventory(
  page: number, 
  limit: number, 
  search?: string,
  categoryId?: string,
  status?: string
) {
  const { data, count, error } = await getInventoryPaginated(page, limit, search, categoryId, status);
  if (error) throw new Error(`Gagal mengambil data persediaan: ${error.message}`);
  return { data: data ?? [], total: count ?? 0, page, limit };
}

export async function getInventoryPageData(
  page: number,
  limit: number,
  search?: string,
  categoryId?: string,
  status?: string
): Promise<InventoryPageData> {
  const [invResult, categories, stats] = await Promise.all([
    listInventory(page, limit, search, categoryId, status),
    getAllCategories(),
    getInventorySummaryStats()
  ]);

  return {
    data: invResult.data,
    total: invResult.total,
    categories,
    stats,
    page,
    limit
  };
}

export async function getInventoryStatus(itemId: string) {
  const { data, error } = await getInventoryByItemId(itemId);
  // It's possible an item doesn't have an inventory record yet if no goods receipt has been made.
  if (error && error.code !== 'PGRST116') { // Ignore "Row not found" error
    throw new Error(`Gagal mengambil status persediaan: ${error.message}`);
  }
  return data;
}
