// src/features/goods-receipt/types/goods-receipt.types.ts
import type { GoodsReceiptWithRelations, ItemWithRelations, Supplier } from '@/types';

export interface ReceiptModalItem extends ItemWithRelations {
  current_stock: number;
}

export interface GoodsReceiptFormData {
  item_id: string;
  supplier_id: string;
  quantity: string;
  harga_satuan: string;
  receipt_date: string;
}

export interface GoodsReceiptTableProps {
  data: GoodsReceiptWithRelations[];
  total: number;
  currentPage: number;
  limit: number;
  searchQuery: string;
  items: ReceiptModalItem[];
  suppliers: Supplier[];
  canCreate: boolean;
}

export interface GoodsReceiptPageData {
  receipts: GoodsReceiptWithRelations[];
  totalReceipts: number;
  items: ReceiptModalItem[];
  suppliers: Supplier[];
}
