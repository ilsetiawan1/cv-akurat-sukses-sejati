// types/inventory.types.ts
import type { ItemWithRelations } from './item.types';

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

export interface PaginatedInventory {
  data: InventoryWithItem[];
  total: number;
  page: number;
  limit: number;
}
