// types/transaction.types.ts
import type { ItemWithRelations } from './item.types';

export interface GoodsReceipt {
  id: string;
  receipt_code: string;
  item_id: string;
  user_id: string;
  supplier_id: string;
  quantity: number;
  receipt_date: string;
  total_price: number;
  created_at: string;
  updated_at: string;
}

export interface GoodsReceiptWithRelations extends GoodsReceipt {
  item: {
    id: string;
    item_code: string;
    name: string;
    category: { name: string } | null;
    unit: { name: string } | null;
  } | null;
  supplier: { id: string; name: string } | null;
  user: { id: string; name: string } | null;
}

export interface CreateGoodsReceiptInput {
  item_id: string;
  supplier_id: string;
  quantity: number;
  receipt_date: string;
  harga_satuan: number;
}

export interface PaginatedGoodsReceipts {
  data: GoodsReceiptWithRelations[];
  total: number;
  page: number;
  limit: number;
}
