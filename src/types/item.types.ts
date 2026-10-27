// src/types/item.types.ts
import type { PaginatedResult } from './common.types';

export interface Category {
  id: string;
  name: string;
  description?: string | null;
  created_at: string;
}

export interface Unit {
  id: string;
  name: string;
  description?: string | null;
  created_at: string;
}

export interface Item {
  id: string;
  item_code: string;
  name: string;
  category_id: string | null;
  unit_id: string | null;
  price: number;
  created_at: string;
  updated_at: string;
}

export interface ItemWithRelations extends Item {
  category: { id: string; name: string } | null;
  unit: { id: string; name: string } | null;
}

export interface CreateItemInput {
  name: string;
  category_id?: string | null;
  unit_id?: string | null;
  price: number;
}

export interface UpdateItemInput {
  name?: string;
  category_id?: string | null;
  unit_id?: string | null;
  price?: number;
}

export type PaginatedItems = PaginatedResult<ItemWithRelations>;
