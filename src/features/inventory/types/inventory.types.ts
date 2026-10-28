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
