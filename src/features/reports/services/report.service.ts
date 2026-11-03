// src/features/reports/services/report.service.ts
import { getGoodsReceiptReport, getGoodsIssueReport } from '@/features/reports/repositories/report.repository';
import type { ReportSummary, SelectedMonthOption, UnifiedMutationItem } from '../types/report.types';

export function getReportMonthOptions(): SelectedMonthOption[] {
  const options: SelectedMonthOption[] = [];
  const now = new Date();
  
  for (let i = 0; i < 6; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = d.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
    options.push({
      key,
      label: i === 0 ? `${label} (Bulan Ini)` : label,
    });
  }
  return options;
}

export async function generateReportData(month?: string, startDate?: string, endDate?: string) {
  const [receipts, issues] = await Promise.all([
    getGoodsReceiptReport(month, startDate, endDate),
    getGoodsIssueReport(month, startDate, endDate)
  ]);

  const totalIncomingValue = receipts.reduce((sum, r) => sum + Number(r.total_price), 0);
  const totalOutgoingValue = issues.reduce((sum, i) => sum + Number(i.total_hpp), 0);
  const totalIncomingQuantity = receipts.reduce((sum, r) => sum + Number(r.quantity), 0);
  const totalOutgoingQuantity = issues.reduce((sum, i) => sum + Number(i.quantity), 0);
  const margin = totalIncomingValue - totalOutgoingValue;

  const summary: ReportSummary = {
    totalIncomingValue,
    totalOutgoingValue,
    margin,
    totalIncomingQuantity,
    totalOutgoingQuantity,
  };

  // Gabungkan ke Buku Mutasi Terpadu (Single Ledger)
  const incomingMutations: UnifiedMutationItem[] = receipts.map((r) => ({
    id: `receipt-${r.id}`,
    code: r.receipt_code,
    date: r.receipt_date,
    type: 'masuk',
    itemName: r.item?.name || '-',
    itemCode: r.item?.item_code || '-',
    categoryName: r.item?.category?.name || '-',
    unitName: r.item?.unit?.name || '-',
    partnerOrNote: r.supplier?.name || 'Supplier Rekanan',
    quantity: Number(r.quantity) || 0,
    amount: Number(r.total_price) || 0,
    unitPriceOrHpp: r.quantity > 0 ? Math.round(Number(r.total_price) / r.quantity) : 0,
  }));

  const outgoingMutations: UnifiedMutationItem[] = issues.map((i) => ({
    id: `issue-${i.id}`,
    code: i.issue_code,
    date: i.issue_date,
    type: 'keluar',
    itemName: i.item?.name || '-',
    itemCode: i.item?.item_code || '-',
    categoryName: i.item?.category?.name || '-',
    unitName: i.item?.unit?.name || '-',
    partnerOrNote: i.user?.name ? `Petugas: ${i.user.name}` : 'Pengeluaran Bengkel',
    quantity: Number(i.quantity) || 0,
    amount: Number(i.total_hpp) || 0,
    unitPriceOrHpp: i.quantity > 0 ? Math.round(Number(i.total_hpp) / i.quantity) : 0,
  }));

  const mutations = [...incomingMutations, ...outgoingMutations].sort((a, b) => {
    const diff = new Date(b.date).getTime() - new Date(a.date).getTime();
    if (diff !== 0) return diff;
    return b.code.localeCompare(a.code);
  });

  return {
    summary,
    mutations,
    monthOptions: getReportMonthOptions(),
  };
}
