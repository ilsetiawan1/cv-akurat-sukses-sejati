// types/transaction.types.ts

export interface InsertGoodsReceiptPayload {
  receipt_code: string;
  item_id: string;
  user_id: string;
  supplier_id: string;
  quantity: number;
  receipt_date: string;
  total_price: number;
}

export interface InsertGoodsIssuePayload {
  issue_code: string;
  item_id: string;
  user_id: string;
  quantity: number;
  issue_date: string;
  total_hpp: number;
}

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

export interface GoodsIssue {
  id: string;
  issue_code: string;
  item_id: string;
  user_id: string;
  quantity: number;
  issue_date: string;
  total_hpp: number;
  created_at: string;
  updated_at: string;
}

export interface GoodsIssueWithRelations extends GoodsIssue {
  item: {
    id: string;
    item_code: string;
    name: string;
    category: { name: string } | null;
    unit: { name: string } | null;
  } | null;
  user: { id: string; name: string } | null;
}

export interface CreateGoodsIssueInput {
  item_id: string;
  quantity: number;
  issue_date: string;
}

export interface PaginatedGoodsIssues {
  data: GoodsIssueWithRelations[];
  total: number;
  page: number;
  limit: number;
}
