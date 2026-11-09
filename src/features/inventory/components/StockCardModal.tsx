// src/features/inventory/components/StockCardModal.tsx
'use client';

import { useState, useEffect, useCallback, useTransition } from 'react';
import { 
  X, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Package, 
  Loader2, 
  AlertCircle,
  FileSpreadsheet,
  Clock,
  Printer
} from 'lucide-react';
import { getItemStockCardAction } from '../actions/inventory.actions';
import type { ItemStockCardDetail } from '../types/inventory.types';

export interface StockCardModalProps {
  itemId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function StockCardModal({ itemId, isOpen, onClose }: StockCardModalProps) {
  const [data, setData] = useState<ItemStockCardDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'ALL' | 'IN' | 'OUT'>('ALL');
  const [isPending, startTransition] = useTransition();

  const handleClose = useCallback(() => {
    setData(null);
    setError(null);
    setFilterType('ALL');
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!isOpen || !itemId) return;

    startTransition(async () => {
      try {
        const res = await getItemStockCardAction(itemId);
        if (res.success && res.data) {
          setData(res.data);
          setError(null);
        } else if (!res.success) {
          setError(res.error);
        } else {
          setError('Data kartu stok tidak ditemukan');
        }
      } catch (err: unknown) {
        setError((err as Error).message || 'Terjadi kesalahan sistem');
      }
    });
  }, [isOpen, itemId]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  const isLoading = isPending && !data;

  const movements = data?.movements || [];
  const filteredMovements = movements.filter((m) => {
    if (filterType === 'IN') return m.type === 'IN';
    if (filterType === 'OUT') return m.type === 'OUT';
    return true;
  });

  const handleRetry = () => {
    if (!itemId) return;
    startTransition(async () => {
      try {
        const res = await getItemStockCardAction(itemId);
        if (res.success && res.data) {
          setData(res.data);
          setError(null);
        } else if (!res.success) {
          setError(res.error);
        }
      } catch (err: unknown) {
        setError((err as Error).message || 'Gagal memuat');
      }
    });
  };

  const exportCSV = () => {
    if (!data || data.movements.length === 0) return;

    const headers = [
      'Tanggal',
      'No. Dokumen',
      'Tipe Mutasi',
      'Pihak Terkait',
      'Petugas',
      'Kuantitas',
      'Harga / HPP Satuan',
      'Total Nilai',
      'Saldo Akhir'
    ];

    const rows = data.movements.map((m) => [
      m.date,
      m.code,
      m.type === 'IN' ? 'Barang Masuk' : 'Barang Keluar',
      `"${m.partyName.replaceAll('"', '""')}"`,
      `"${m.operatorName.replaceAll('"', '""')}"`,
      m.type === 'IN' ? `+${m.quantity}` : `-${m.quantity}`,
      m.unitPrice,
      m.totalAmount,
      m.runningBalance
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `kartu_stok_${data.item.itemCode}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    if (!data || data.movements.length === 0) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      window.print();
      return;
    }

    const rowsHtml = data.movements
      .map((m) => {
        const isEntry = m.type === 'IN';
        const formattedDate = m.date
          ? new Date(m.date).toLocaleDateString('id-ID', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })
          : '-';
        return `
          <tr>
            <td>${formattedDate}</td>
            <td style="font-family: monospace; font-weight: 600;">${m.code}</td>
            <td><span class="${isEntry ? 'badge-in' : 'badge-out'}">${isEntry ? 'MASUK' : 'KELUAR'}</span></td>
            <td>
              <div><strong>${m.partyName}</strong></div>
              <div style="font-size: 10px; color: #64748b;">Petugas: ${m.operatorName}</div>
            </td>
            <td class="text-right">Rp ${Math.round(m.unitPrice).toLocaleString('id-ID')}</td>
            <td class="text-center" style="font-weight: 600; color: ${isEntry ? '#059669' : '#dc2626'};">
              ${isEntry ? `+${m.quantity}` : `-${m.quantity}`}
            </td>
            <td class="text-right" style="font-weight: 600;">
              ${m.runningBalance.toLocaleString('id-ID')} ${data.item.unitName}
            </td>
          </tr>
        `;
      })
      .join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="id">
        <head>
          <meta charset="utf-8" />
          <title>Kartu Stok - ${data.item.itemCode} - ${data.item.name}</title>
          <style>
            @page { size: A4 portrait; margin: 12mm 15mm; }
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; color: #0f172a; margin: 0; padding: 20px; font-size: 11px; }
            .header { border-bottom: 2px solid #0f172a; padding-bottom: 10px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: flex-start; }
            .company-title { font-size: 15px; font-weight: bold; color: #1e3a8a; letter-spacing: -0.3px; }
            .company-sub { font-size: 10px; color: #64748b; margin-top: 2px; }
            .doc-title { font-size: 13px; font-weight: bold; text-align: right; text-transform: uppercase; color: #0f172a; }
            .doc-meta { font-size: 10px; color: #64748b; text-align: right; margin-top: 2px; }
            
            .item-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px 14px; margin-bottom: 14px; display: flex; justify-content: space-between; align-items: center; }
            .item-name { font-size: 13px; font-weight: bold; color: #0f172a; }
            .item-meta { font-size: 10px; color: #64748b; margin-top: 2px; }
            
            .summary-grid { display: flex; gap: 10px; margin-bottom: 14px; }
            .summary-card { flex: 1; border: 1px solid #e2e8f0; border-radius: 6px; padding: 8px 12px; background: #ffffff; }
            .summary-card .label { font-size: 10px; color: #64748b; font-weight: 500; }
            .summary-card .val { font-size: 15px; font-weight: bold; margin-top: 2px; color: #0f172a; }
            .summary-card .sub { font-size: 9px; margin-top: 2px; }
            
            table { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 10px; }
            th { background: #f1f5f9; padding: 6px 8px; border-bottom: 1px solid #cbd5e1; text-align: left; font-weight: 600; color: #334155; }
            td { padding: 6px 8px; border-bottom: 1px solid #f1f5f9; vertical-align: middle; }
            .text-right { text-align: right; }
            .text-center { text-align: center; }
            
            .badge-in { color: #047857; background: #ecfdf5; padding: 2px 6px; border-radius: 4px; font-weight: 600; font-size: 9px; border: 1px solid #a7f3d0; }
            .badge-out { color: #be123c; background: #fff1f2; padding: 2px 6px; border-radius: 4px; font-weight: 600; font-size: 9px; border: 1px solid #fecdd3; }
            
            .footer { margin-top: 20px; padding-top: 8px; border-top: 1px solid #e2e8f0; font-size: 9px; color: #94a3b8; display: flex; justify-content: space-between; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="company-title">CV. AKURAT SUKSES SEJATI</div>
              <div class="company-sub">Sistem Manajemen Persediaan Suku Cadang Otomotif</div>
            </div>
            <div>
              <div class="doc-title">Buku Kartu Stok Barang</div>
              <div class="doc-meta">Dicetak: ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
            </div>
          </div>

          <div class="item-card">
            <div>
              <div class="item-name">${data.item.name}</div>
              <div class="item-meta">Kode: ${data.item.itemCode} &bull; Kategori: ${data.item.categoryName} &bull; Satuan: ${data.item.unitName}</div>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 9px; color: #64748b;">Harga Jual Standar</div>
              <div style="font-size: 12px; font-weight: 600;">Rp ${Number(data.item.price).toLocaleString('id-ID')}</div>
            </div>
          </div>

          <div class="summary-grid">
            <div class="summary-card">
              <div class="label">Total Diterima</div>
              <div class="val">${data.summary.totalIn.toLocaleString('id-ID')} <span style="font-size: 10px; font-weight: normal; color: #64748b;">${data.item.unitName}</span></div>
              <div class="sub" style="color: #059669;">Akumulasi barang masuk</div>
            </div>
            <div class="summary-card">
              <div class="label">Total Dikeluarkan</div>
              <div class="val">${data.summary.totalOut.toLocaleString('id-ID')} <span style="font-size: 10px; font-weight: normal; color: #64748b;">${data.item.unitName}</span></div>
              <div class="sub" style="color: #dc2626;">Akumulasi barang keluar</div>
            </div>
            <div class="summary-card">
              <div class="label">Saldo Stok Fisik</div>
              <div class="val">${data.inventory.stock.toLocaleString('id-ID')} <span style="font-size: 10px; font-weight: normal; color: #64748b;">${data.item.unitName}</span></div>
              <div class="sub" style="color: #2563eb;">HPP: Rp ${Math.round(data.inventory.hpp).toLocaleString('id-ID')}</div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>No. Dokumen</th>
                <th>Tipe</th>
                <th>Keterangan / Pihak Terkait</th>
                <th class="text-right">Harga Satuan</th>
                <th class="text-center">Mutasi</th>
                <th class="text-right">Saldo Akhir</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>

          <div class="footer">
            <div>Dokumen resmi catatan kartu stok persediaan suku cadang.</div>
            <div>Dicetak otomatis melalui sistem informasi.</div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 select-none">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity" 
        onClick={handleClose} 
      />

      {/* Modal Dialog Card */}
      <div className="relative bg-white rounded-2xl shadow-xl border border-slate-200/80 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col z-10 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header Bar */}
        <div className="sticky top-0 bg-white flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-100 z-20">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/70">
                KARTU STOK
              </span>
              <span className="text-xs text-slate-400 font-normal">
                • Riwayat Kronologis Mutasi
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-semibold text-slate-900 tracking-tight mt-1">
              Buku Mutasi Persediaan Barang
            </h2>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {data && data.movements.length > 0 && (
              <>
                <button
                  type="button"
                  onClick={exportCSV}
                  className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-2xs transition-colors cursor-pointer"
                  title="Unduh riwayat mutasi dalam format CSV"
                >
                  <FileSpreadsheet size={13} className="text-emerald-600" />
                  <span>CSV</span>
                </button>

                <button
                  type="button"
                  onClick={exportPDF}
                  className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-2xs transition-colors cursor-pointer"
                  title="Cetak atau simpan riwayat mutasi ke format PDF"
                >
                  <Printer size={13} className="text-blue-600" />
                  <span>PDF</span>
                </button>
              </>
            )}
            <button
              type="button"
              onClick={handleClose}
              className="w-8 h-8 rounded-xl border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50 flex items-center justify-center transition-colors cursor-pointer"
              title="Tutup (Esc)"
              aria-label="Tutup"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-4">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center text-slate-400">
              <Loader2 size={30} className="animate-spin text-blue-600 mb-3 stroke-[2]" />
              <p className="text-sm font-medium text-slate-700">Memuat kartu stok...</p>
              <p className="text-xs text-slate-400 mt-0.5">Menghitung riwayat penerimaan dan pengeluaran</p>
            </div>
          ) : error ? (
            <div className="py-16 text-center">
              <div className="w-10 h-10 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center mx-auto mb-2 text-rose-500">
                <AlertCircle size={20} />
              </div>
              <p className="text-sm font-medium text-slate-800">{error}</p>
              <button
                type="button"
                onClick={handleRetry}
                className="mt-3 text-xs text-blue-600 hover:underline font-medium cursor-pointer"
              >
                Coba lagi
              </button>
            </div>
          ) : data ? (
            <>
              {/* Item Info Box: Clean & Structured */}
              <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1E3A8A] border border-blue-100 flex items-center justify-center shrink-0">
                    <Package size={18} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm sm:text-base font-semibold text-slate-900 truncate leading-snug">
                      {data.item.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                      <span className="font-mono text-2xs font-medium text-slate-700 bg-white px-1.5 py-0.5 rounded border border-slate-200/80">
                        {data.item.itemCode}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span>Kategori: {data.item.categoryName}</span>
                      <span className="text-slate-300">•</span>
                      <span>Satuan: {data.item.unitName}</span>
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200/60 shrink-0">
                  <span className="text-xs text-slate-400 font-normal">Harga Standar:</span>
                  <span className="text-xs sm:text-sm font-medium text-slate-800 tabular-nums">
                    Rp {Number(data.item.price).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {/* 3 Summary Stat Cards: Equal Heights & Balanced Typography */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* 1. Total Masuk */}
                <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <span className="text-xs font-medium text-slate-500 block">Total Diterima</span>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-xl sm:text-2xl font-medium text-slate-900 tracking-tight tabular-nums">
                        {data.summary.totalIn.toLocaleString('id-ID')}
                      </span>
                      <span className="text-xs text-slate-400 font-normal">{data.item.unitName}</span>
                    </div>
                    <span className="text-xs font-medium text-emerald-600 mt-0.5 block truncate">
                      Akumulasi barang masuk
                    </span>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
                    <ArrowDownLeft size={16} />
                  </div>
                </div>

                {/* 2. Total Keluar */}
                <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <span className="text-xs font-medium text-slate-500 block">Total Dikeluarkan</span>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-xl sm:text-2xl font-medium text-slate-900 tracking-tight tabular-nums">
                        {data.summary.totalOut.toLocaleString('id-ID')}
                      </span>
                      <span className="text-xs text-slate-400 font-normal">{data.item.unitName}</span>
                    </div>
                    <span className="text-xs font-medium text-rose-600 mt-0.5 block truncate">
                      Akumulasi barang keluar
                    </span>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center shrink-0">
                    <ArrowUpRight size={16} />
                  </div>
                </div>

                {/* 3. Saldo Fisik Aktif */}
                <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <span className="text-xs font-medium text-slate-500 block">Saldo Stok Fisik</span>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-xl sm:text-2xl font-medium text-slate-900 tracking-tight tabular-nums">
                        {data.inventory.stock.toLocaleString('id-ID')}
                      </span>
                      <span className="text-xs text-slate-400 font-normal">{data.item.unitName}</span>
                    </div>
                    <span className="text-xs font-medium text-blue-600 mt-0.5 block truncate">
                      HPP: Rp {Math.round(data.inventory.hpp).toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#1E3A8A] border border-blue-100 flex items-center justify-center shrink-0">
                    <Package size={16} />
                  </div>
                </div>
              </div>

              {/* Toolbar: Filter Tabs & Meta Count */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1">
                <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-xl border border-slate-200/60 w-fit">
                  <button
                    type="button"
                    onClick={() => setFilterType('ALL')}
                    className={`px-3 py-1 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                      filterType === 'ALL'
                        ? 'bg-white text-slate-900 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Semua ({movements.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterType('IN')}
                    className={`px-3 py-1 text-xs font-medium rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                      filterType === 'IN'
                        ? 'bg-white text-emerald-700 shadow-2xs'
                        : 'text-slate-600 hover:text-emerald-700'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>Masuk ({movements.filter((m) => m.type === 'IN').length})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterType('OUT')}
                    className={`px-3 py-1 text-xs font-medium rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                      filterType === 'OUT'
                        ? 'bg-white text-rose-700 shadow-2xs'
                        : 'text-slate-600 hover:text-rose-700'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    <span>Keluar ({movements.filter((m) => m.type === 'OUT').length})</span>
                  </button>
                </div>

                <div className="text-xs text-slate-400 font-normal">
                  Menampilkan <span className="font-medium text-slate-700 tabular-nums">{filteredMovements.length}</span> baris riwayat
                </div>
              </div>

              {/* Ledger Table (Desktop View >= sm) */}
              <div className="hidden sm:block border border-slate-200/80 rounded-xl overflow-hidden shadow-2xs bg-white">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50/80 text-slate-700 font-semibold border-b border-slate-200/70">
                      <th className="py-2.5 px-3.5">Tanggal</th>
                      <th className="py-2.5 px-3.5">No. Dokumen</th>
                      <th className="py-2.5 px-3.5">Tipe</th>
                      <th className="py-2.5 px-3.5 min-w-44">Keterangan / Pihak Terkait</th>
                      <th className="py-2.5 px-3.5 text-right">Harga Satuan</th>
                      <th className="py-2.5 px-3.5 text-center">Mutasi</th>
                      <th className="py-2.5 px-3.5 text-right">Saldo Akhir</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredMovements.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-slate-400">
                          <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto mb-2 text-slate-400">
                            <FileSpreadsheet size={18} />
                          </div>
                          <p className="font-medium text-slate-700 text-xs">Belum ada riwayat transaksi</p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Mutasi barang masuk atau keluar akan tercatat otomatis di sini.
                          </p>
                        </td>
                      </tr>
                    ) : (
                      filteredMovements.map((mov) => {
                        const isEntry = mov.type === 'IN';
                        return (
                          <tr key={mov.id} className="hover:bg-slate-50/60 transition-colors">
                            {/* 1. Tanggal */}
                            <td className="py-2.5 px-3.5 whitespace-nowrap text-slate-700 tabular-nums">
                              {mov.date
                                ? new Date(mov.date).toLocaleDateString('id-ID', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric',
                                  })
                                : '-'}
                            </td>

                            {/* 2. No Dokumen */}
                            <td className="py-2.5 px-3.5 whitespace-nowrap">
                              <span className="font-mono text-2xs font-medium text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200/60">
                                {mov.code}
                              </span>
                            </td>

                            {/* 3. Jenis Mutasi */}
                            <td className="py-2.5 px-3.5 whitespace-nowrap">
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-medium text-2xs border ${
                                  isEntry
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60'
                                    : 'bg-rose-50 text-rose-700 border-rose-200/60'
                                }`}
                              >
                                {isEntry ? (
                                  <>
                                    <ArrowDownLeft size={10} />
                                    <span>Masuk</span>
                                  </>
                                ) : (
                                  <>
                                    <ArrowUpRight size={10} />
                                    <span>Keluar</span>
                                  </>
                                )}
                              </span>
                            </td>

                            {/* 4. Keterangan / Pihak Terkait */}
                            <td className="py-2.5 px-3.5">
                              <span className="font-medium text-slate-800 block truncate max-w-56">
                                {mov.partyName}
                              </span>
                              <span className="text-2xs text-slate-400 block mt-0.5">
                                Petugas: {mov.operatorName}
                              </span>
                            </td>

                            {/* 5. Harga / HPP */}
                            <td className="py-2.5 px-3.5 text-right font-medium text-slate-700 tabular-nums whitespace-nowrap">
                              Rp {Math.round(mov.unitPrice).toLocaleString('id-ID')}
                            </td>

                            {/* 6. Mutasi Qty */}
                            <td className="py-2.5 px-3.5 text-center whitespace-nowrap">
                              <span
                                className={`font-medium tabular-nums ${
                                  isEntry ? 'text-emerald-600' : 'text-rose-600'
                                }`}
                              >
                                {isEntry ? `+${mov.quantity}` : `-${mov.quantity}`}
                              </span>
                            </td>

                            {/* 7. Saldo Akhir */}
                            <td className="py-2.5 px-3.5 text-right font-medium text-slate-900 tabular-nums whitespace-nowrap">
                              {mov.runningBalance.toLocaleString('id-ID')} {data.item.unitName}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card List (< sm) */}
              <div className="block sm:hidden space-y-2">
                {filteredMovements.length === 0 ? (
                  <div className="py-10 text-center text-slate-400 bg-slate-50/50 rounded-xl border border-slate-100">
                    <Clock size={20} className="mx-auto mb-1 text-slate-300 stroke-[1.5]" />
                    <p className="text-xs font-medium text-slate-700">Belum ada riwayat mutasi</p>
                    <p className="text-2xs text-slate-400 mt-0.5">Transaksi barang akan muncul di sini</p>
                  </div>
                ) : (
                  filteredMovements.map((mov) => {
                    const isEntry = mov.type === 'IN';
                    return (
                      <div
                        key={mov.id}
                        className="p-3 rounded-xl border border-slate-200/80 bg-white space-y-2 shadow-2xs"
                      >
                        {/* Baris 1: Kode Dokumen & Tanggal */}
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono text-2xs font-medium text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200/60">
                            {mov.code}
                          </span>
                          <span className="text-2xs text-slate-400 tabular-nums">
                            {mov.date
                              ? new Date(mov.date).toLocaleDateString('id-ID', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric',
                                })
                              : '-'}
                          </span>
                        </div>

                        {/* Baris 2: Jenis & Pihak Terkait */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-slate-800 truncate">
                              {mov.partyName}
                            </p>
                            <p className="text-2xs text-slate-400 mt-0.5">
                              Petugas: {mov.operatorName}
                            </p>
                          </div>
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-medium text-2xs border shrink-0 ${
                              isEntry
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60'
                                : 'bg-rose-50 text-rose-700 border-rose-200/60'
                            }`}
                          >
                            {isEntry ? `+${mov.quantity}` : `-${mov.quantity}`} {data.item.unitName}
                          </span>
                        </div>

                        {/* Baris 3: Harga Satuan & Saldo Akhir */}
                        <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 text-2xs">
                          <span className="text-slate-500">
                            Harga: Rp {Math.round(mov.unitPrice).toLocaleString('id-ID')}
                          </span>
                          <span className="font-medium text-slate-900 tabular-nums">
                            Saldo: {mov.runningBalance.toLocaleString('id-ID')} {data.item.unitName}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </>
          ) : null}
        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 bg-slate-50/90 backdrop-blur-xs px-5 sm:px-6 py-3 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs text-slate-400 hidden sm:block font-normal">
            Saldo akhir diperbarui otomatis berdasarkan urutan mutasi barang.
          </p>
          <button
            type="button"
            onClick={handleClose}
            className="w-full sm:w-auto px-4 py-2 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors cursor-pointer shadow-2xs ml-auto"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
}
