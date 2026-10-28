// src/features/goods-issue/types/goods-issue.types.ts
import type { GoodsIssueWithRelations, ItemWithRelations } from '@/types';

export interface IssueModalItem extends ItemWithRelations {
  current_stock: number;
  current_hpp: number;
}

export interface GoodsIssueFormData {
  item_id: string;
  quantity: string;
  issue_date: string;
}

export interface GoodsIssueTableProps {
  data: GoodsIssueWithRelations[];
  total: number;
  currentPage: number;
  limit: number;
  searchQuery: string;
  items: IssueModalItem[];
  canCreate: boolean;
}

export interface GoodsIssuePageData {
  issues: GoodsIssueWithRelations[];
  totalIssues: number;
  items: IssueModalItem[];
}
