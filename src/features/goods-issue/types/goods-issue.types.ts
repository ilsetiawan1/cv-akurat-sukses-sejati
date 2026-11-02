// src/features/goods-issue/types/goods-issue.types.ts
import type { 
  GoodsIssue, 
  GoodsIssueWithRelations, 
  CreateGoodsIssueInput, 
  InsertGoodsIssuePayload,
  ItemWithRelations, 
  Category 
} from '@/types';

// Re-export core domain contracts for feature autonomy & encapsulation
export type { GoodsIssue, GoodsIssueWithRelations, CreateGoodsIssueInput, InsertGoodsIssuePayload };

export interface IssueModalItem extends ItemWithRelations {
  current_stock: number;
  current_hpp: number;
}

export interface GoodsIssueFormData {
  item_id: string;
  quantity: string;
  issue_date: string;
}

export interface IssueCategoryBreakdown {
  name: string;
  quantity: number;
  percentage: number;
  barColor: string;
  dotColor: string;
  textColor: string;
}

export interface IssueSummaryStats {
  totalTransactions: number;
  totalQuantity: number;
  totalHppAmount: number;
  categoryBreakdown: IssueCategoryBreakdown[];
}

export interface SelectedMonthOption {
  key: string;
  label: string;
}

export interface GoodsIssueTableProps {
  data: GoodsIssueWithRelations[];
  total: number;
  currentPage: number;
  limit: number;
  searchQuery: string;
  selectedCategory: string;
  selectedMonth: string;
  categories: Category[];
  monthOptions: SelectedMonthOption[];
  stats: IssueSummaryStats;
  items: IssueModalItem[];
  canCreate: boolean;
  canDelete?: boolean;
}

export interface GoodsIssuePageData {
  issues: GoodsIssueWithRelations[];
  totalIssues: number;
  stats: IssueSummaryStats;
  categories: Category[];
  monthOptions: SelectedMonthOption[];
  items: IssueModalItem[];
}
