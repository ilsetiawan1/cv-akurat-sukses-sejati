// src/features/goods-receipt/types/goods-receipt.types.ts
import type { 
  GoodsReceipt, 
  GoodsReceiptWithRelations, 
  CreateGoodsReceiptInput, 
  InsertGoodsReceiptPayload,
  ItemWithRelations, 
  Supplier,
  Category 
} from '@/types';

// Re-export core domain contracts for feature autonomy & encapsulation
export type { GoodsReceipt, GoodsReceiptWithRelations, CreateGoodsReceiptInput, InsertGoodsReceiptPayload };

export interface ReceiptModalItem extends ItemWithRelations {
  current_stock: number;
  last_supplier_id?: string;
  last_purchase_price?: number;
  inventory_id?: string;
}

export interface GoodsReceiptFormData {
  item_id: string;
  supplier_id: string;
  quantity: string;
  harga_satuan: string;
  receipt_date: string;
}

export interface ReceiptSummaryStats {
  totalTransactions: number;
  totalQuantity: number;
  totalAmount: number;
}

export interface SelectedMonthOption {
  key: string;
  label: string;
}

export interface GoodsReceiptTableProps {
  data: GoodsReceiptWithRelations[];
  total: number;
  currentPage: number;
  limit: number;
  searchQuery: string;
  selectedCategory: string;
  selectedMonth: string;
  categories: Category[];
  monthOptions: SelectedMonthOption[];
  stats: ReceiptSummaryStats;
  items: ReceiptModalItem[];
  suppliers: Supplier[];
  canCreate: boolean;
  canDelete?: boolean;
  initialItemId?: string;
}

export interface GoodsReceiptPageData {
  receipts: GoodsReceiptWithRelations[];
  totalReceipts: number;
  stats: ReceiptSummaryStats;
  monthOptions: SelectedMonthOption[];
  items: ReceiptModalItem[];
  suppliers: Supplier[];
  categories: Category[];
}

export interface UseGoodsReceiptFormReturn {
  formData: GoodsReceiptFormData;
  isSubmitting: boolean;
  selectedItem: ReceiptModalItem | undefined;
  quantityNum: number;
  unitPriceNum: number;
  totalPrice: number;
  currentStock: number;
  estimatedNewStock: number;
  isFormValid: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  resetForm: () => void;
}
