// lib/services/report.service.ts
import { getGoodsReceiptReport, getGoodsIssueReport } from '@/lib/repositories/report.repository';
import type { ReportSummary } from '@/types/report.types';

export async function generateReportData(startDate: string, endDate: string) {
  const [receipts, issues] = await Promise.all([
    getGoodsReceiptReport(startDate, endDate),
    getGoodsIssueReport(startDate, endDate)
  ]);

  const totalIncomingValue = receipts.reduce((sum, r) => sum + Number(r.total_price), 0);
  const totalOutgoingValue = issues.reduce((sum, i) => sum + Number(i.total_hpp), 0);
  const margin = totalIncomingValue - totalOutgoingValue;

  const summary: ReportSummary = {
    totalIncomingValue,
    totalOutgoingValue,
    margin
  };

  return {
    summary,
    receipts,
    issues
  };
}
