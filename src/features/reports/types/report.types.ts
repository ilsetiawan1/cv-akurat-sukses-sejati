// src/features/reports/types/report.types.ts

export interface SelectedMonthOption {
  key: string;
  label: string;
}

export interface ReportSummary {
  totalIncomingValue: number;
  totalOutgoingValue: number;
  margin: number;
  totalIncomingQuantity: number;
  totalOutgoingQuantity: number;
}

export interface UnifiedMutationItem {
  id: string;
  code: string;
  date: string;
  type: 'masuk' | 'keluar';
  itemName: string;
  itemCode: string;
  categoryName?: string;
  unitName?: string;
  partnerOrNote: string;
  quantity: number;
  amount: number;
  unitPriceOrHpp: number;
}
