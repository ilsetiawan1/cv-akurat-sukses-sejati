// types/report.types.ts
export type ReportFilterPeriod = 'hari_ini' | 'minggu_ini' | 'bulan_ini' | 'kustom';

export interface ReportFilter {
  period: ReportFilterPeriod;
  startDate?: string;
  endDate?: string;
}

export interface ReportSummary {
  totalIncomingValue: number;
  totalOutgoingValue: number;
  margin: number;
}
