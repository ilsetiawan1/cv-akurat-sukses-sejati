// src/features/inventory/types/inventory.types.ts
export * from '@/types/inventory.types';
import type { InventoryWithItem } from '@/types/inventory.types';
import type { Category } from '@/types';

export interface InventoryStats {
  totalSku: number;
  emptyStock: number;
  lowStock: number;
}

export interface InventoryTableProps {
  data: InventoryWithItem[];
  total: number;
  currentPage: number;
  limit: number;
  searchQuery: string;
  selectedCategory: string;
  selectedStatus: string;
  categories: Category[];
  stats: InventoryStats;
}

export interface InventoryPageData {
  data: InventoryWithItem[];
  total: number;
  categories: Category[];
  stats: InventoryStats;
  page: number;
  limit: number;
}

export type StockStatusLevel = 'safe' | 'low' | 'empty';

export interface StockStatusInfo {
  level: StockStatusLevel;
  label: string;
  badgeClass: string;
  textClass: string;
}

export interface StockMovementHistoryEntry {
  id: string;
  type: 'IN' | 'OUT';
  code: string;
  date: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  operatorName: string;
  partyName: string;
  runningBalance: number;
  createdAt: string;
}

export interface ItemStockCardDetail {
  item: {
    id: string;
    itemCode: string;
    name: string;
    categoryName: string;
    unitName: string;
    price: number;
  };
  inventory: {
    id: string;
    inventoryCode: string;
    stock: number;
    hpp: number;
    totalValuation: number;
  };
  summary: {
    totalIn: number;
    totalOut: number;
    currentStock: number;
    totalTransactions: number;
  };
  movements: StockMovementHistoryEntry[];
}
