// lib/services/inventory.service.ts
import { 
  getInventoryPaginated, 
  getInventoryByItemId, 
  getInventorySummaryStats,
  getItemStockCardRaw,
} from '@/features/inventory/repositories/inventory.repository';
import { getAllCategories } from '@/features/settings/repositories/category.repository';
import type { 
  InventoryPageData, 
  ItemStockCardDetail, 
  StockMovementHistoryEntry 
} from '../types/inventory.types';

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

export async function fetchItemStockCard(itemId: string): Promise<ItemStockCardDetail> {
  const { inventoryRow, itemRow, receipts, issues } = await getItemStockCardRaw(itemId);

  const rawItem = inventoryRow?.items || itemRow;
  if (!rawItem) {
    throw new Error('Data suku cadang tidak ditemukan.');
  }

  const currentStock = Number(inventoryRow?.stock || 0);
  const currentHpp = Number(inventoryRow?.hpp || 0);
  const totalValuation = currentStock * currentHpp;

  type RawReceipt = {
    id: string;
    receipt_code: string;
    quantity: number;
    total_price: number;
    receipt_date: string;
    created_at: string;
    supplier?: { id: string; name: string } | null;
    user?: { id: string; name: string } | null;
  };

  type RawIssue = {
    id: string;
    issue_code: string;
    quantity: number;
    hpp: number;
    total_hpp: number;
    issue_date: string;
    created_at: string;
    user?: { id: string; name: string } | null;
  };

  const parsedReceipts: StockMovementHistoryEntry[] = ((receipts ?? []) as unknown as RawReceipt[]).map((r) => {
    const qty = Number(r.quantity) || 0;
    const total = Number(r.total_price) || 0;
    const unitPrice = qty > 0 ? Math.round(total / qty) : 0;
    return {
      id: r.id,
      type: 'IN',
      code: r.receipt_code,
      date: r.receipt_date,
      quantity: qty,
      unitPrice,
      totalAmount: total,
      operatorName: r.user?.name || 'Petugas Gudang',
      partyName: r.supplier?.name || 'Supplier Rekanan',
      runningBalance: 0,
      createdAt: r.created_at,
    };
  });

  const parsedIssues: StockMovementHistoryEntry[] = ((issues ?? []) as unknown as RawIssue[]).map((i) => {
    const qty = Number(i.quantity) || 0;
    const hpp = Number(i.hpp) || 0;
    const total = Number(i.total_hpp) || qty * hpp;
    return {
      id: i.id,
      type: 'OUT',
      code: i.issue_code,
      date: i.issue_date,
      quantity: qty,
      unitPrice: hpp,
      totalAmount: total,
      operatorName: i.user?.name || 'Kasir',
      partyName: 'Pelayanan Kasir / Servis',
      runningBalance: 0,
      createdAt: i.created_at,
    };
  });

  // Combine and sort chronologically (oldest to newest) to calculate running balance
  const combined = [...parsedReceipts, ...parsedIssues];
  combined.sort((a, b) => {
    const timeA = new Date(a.date).getTime();
    const timeB = new Date(b.date).getTime();
    if (timeA !== timeB) return timeA - timeB;
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

  let running = 0;
  let totalIn = 0;
  let totalOut = 0;

  const movementsWithBalance: StockMovementHistoryEntry[] = combined.map((m) => {
    if (m.type === 'IN') {
      running += m.quantity;
      totalIn += m.quantity;
    } else {
      running -= m.quantity;
      totalOut += m.quantity;
    }
    return {
      ...m,
      runningBalance: running,
    };
  });

  // Reverse so newest transactions appear at the top in UI
  const displayMovements = [...movementsWithBalance].reverse();

  return {
    item: {
      id: rawItem.id,
      itemCode: rawItem.item_code,
      name: rawItem.name,
      categoryName: rawItem.category?.name || 'UMUM',
      unitName: rawItem.unit?.name || 'UNIT',
      price: Number(rawItem.price || 0),
    },
    inventory: {
      id: inventoryRow?.id || '',
      inventoryCode: inventoryRow?.inventory_code || '-',
      stock: currentStock,
      hpp: currentHpp,
      totalValuation,
    },
    summary: {
      totalIn,
      totalOut,
      currentStock,
      totalTransactions: combined.length,
    },
    movements: displayMovements,
  };
}
