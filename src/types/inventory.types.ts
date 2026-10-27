// src/types/inventory.types.ts
import type { ItemWithRelations } from './item.types';
import type { PaginatedResult } from './common.types';

export interface Inventory {
  id: string;
  inventory_code: string;
  item_id: string;
  stock: number;
  hpp: number;
  updated_at: string;
}

export interface InventoryWithItem extends Inventory {
  item: ItemWithRelations | null;
}

export interface CreateInventoryInput {
  item_id: string;
  stock: number;
  hpp: number;
}

export interface UpdateInventoryInput {
  stock?: number;
  hpp?: number;
}

export type PaginatedInventory = PaginatedResult<InventoryWithItem>;
