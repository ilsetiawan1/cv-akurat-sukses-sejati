// src/features/reports/components/ReportTable.tsx
'use client';

import { useState, useMemo } from 'react';
import { Archive, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import type { ReportSummary, UnifiedMutationItem } from '../types/report.types';
import ReportStatCards from './ReportStatCards';
import ReportMobileCardList from './ReportMobileCardList';
import ExportButton from './ExportButton';

interface ReportTableProps {
  mutations: UnifiedMutationItem[];
  summary: ReportSummary;
  dateRangeText: string;
  companyName: string;
  companyAddress: string;
}

export default function ReportTable({ 
  mutations, 
  summary, 
  dateRangeText, 
  companyName, 
  companyAddress 
}: ReportTableProps) {
  const [filterType, setFilterType] = useState<'all' | 'masuk' | 'keluar'>('all');

  const filteredMutations = useMemo(() => {
    if (filterType === 'all') return mutations;
    return mutations.filter((m) => m.type === filterType);
  }, [mutations, filterType]);

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @page { size: A4 landscape; margin: 15mm 12mm 15mm 12mm; }
        @media print {
          html, body, #__next, [data-turbo], main { position: static !important; overflow: visible !important; height: auto !important; min-height: auto !important; background: #ffffff !important; }
          .print-hide-all, button { display: none !important; }
          .print-container-formal { position: static !important; display: block !important; width: 100% !important; box-shadow: none !important; border: none !important; margin: 0 !important; padding: 0 !important; }
          table { border-collapse: collapse !important; width: 100% !important; }
          th, td { border: 1px solid #d1d5db !important; padding: 8px 12px !important; background: white !important; color: #111827 !important; }
          th { background-color: #f8fafc !important; font-weight: 600 !important; font-size: 11px !important; }
          td { font-size: 11px !important; }
        }
      `}} />

      <div className="flex flex-col gap-4 sm:gap-5">
        {/* STAT SUMMARY CARDS */}
        <ReportStatCards summary={summary} />

        {/* MAIN DATA CARD + FORMAL PRINT HEADER */}
        <div className="relative z-10 bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden print-container-formal" id="report-container">
          {/* TOOLBAR WEB VIEW: LEDGER TITLE, FILTER TIPE & EXPORT BUTTONS */}
          <div className="p-4 md:p-5 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 border-b border-slate-100 print:hidden print-hide-all">
            {/* Sisi Kiri: Switcher Filter Tipe Mutasi (Semua / Masuk / Keluar) */}
            <div className="flex items-center gap-2">
              <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200/60 select-none">
                <button 
                  type="button"
                  onClick={() => setFilterType('all')} 
                  className={`px-3 sm:px-4 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                    filterType === 'all' 
                      ? 'bg-white text-slate-900 shadow-2xs' 
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Semua Mutasi ({mutations.length})
                </button>
                <button 
                  type="button"
                  onClick={() => setFilterType('masuk')} 
                  className={`px-3 sm:px-4 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                    filterType === 'masuk' 
                      ? 'bg-white text-emerald-800 shadow-2xs' 
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Barang Masuk
                </button>
                <button 
                  type="button"
                  onClick={() => setFilterType('keluar')} 
                  className={`px-3 sm:px-4 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                    filterType === 'keluar' 
                      ? 'bg-white text-rose-800 shadow-2xs' 
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Barang Keluar
                </button>
              </div>
            </div>

            {/* Sisi Kanan: Action Buttons [Icon CSV] & [Icon PDF] */}
            <ExportButton 
              targetId="report-container" 
              filename={`Laporan_Mutasi_${new Date().toISOString().slice(0, 10)}`} 
            />
          </div>

          {/* KOP SURAT DINAMIS (Khusus Mode Cetak / PDF) */}
          <div className="hidden print:flex items-center justify-between border-b-[3px] border-slate-800 pb-5 mb-5 w-full">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-full border-[3px] border-[#1E3A8A] p-0.5 flex items-center justify-center bg-white shrink-0 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo-cv-akurat-sukses-sejati-bg-purple.png" alt="Logo" className="w-full h-full object-contain rounded-full" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-black uppercase tracking-tight leading-tight m-0">{companyName}</h1>
                {companyAddress && companyAddress.trim() !== '' && (
                  <p className="text-xs text-gray-600 font-medium mt-0.5">{companyAddress}</p>
                )}
                <p className="text-xs text-gray-900 font-semibold mt-1 uppercase tracking-wider">
                  LAPORAN BUKU MUTASI PERSEDIAAN GUDANG
                </p>
                <p className="text-xs text-gray-600 mt-0.5">Periode: {dateRangeText}</p>
              </div>
            </div>
            <div className="text-right self-end">
              <p className="text-2xs text-gray-500 font-medium uppercase tracking-widest">TANGGAL CETAK</p>
              <p className="text-xs font-bold text-black mt-0.5">{new Date().toLocaleDateString('id-ID', {day:'2-digit', month:'long', year:'numeric'})}</p>
            </div>
          </div>

          {/* 1. Mobile View: Card List (< md) */}
          <div className="block md:hidden print:hidden">
            <ReportMobileCardList mutations={filteredMutations} />
          </div>

          {/* 2. Desktop View: Full Table (>= md & print) */}
          <div className="hidden md:block overflow-x-auto w-full print:block print:overflow-visible">
            <table className="w-full text-left border-collapse min-w-190">
              <thead>
                <tr className="bg-slate-50/75 text-slate-800 text-xs font-semibold border-b border-slate-200/70 uppercase tracking-wider">
                  <th className="py-3.5 px-5">Kode Transaksi</th>
                  <th className="py-3.5 px-5">Tanggal</th>
                  <th className="py-3.5 px-5 text-center">Tipe</th>
                  <th className="py-3.5 px-5 min-w-50">Nama Barang</th>
                  <th className="py-3.5 px-5">Rekanan / Keterangan</th>
                  <th className="py-3.5 px-5 text-center">Jumlah Mutasi</th>
                  <th className="py-3.5 px-5 text-right">Nilai Mutasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredMutations.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 px-4 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-2.5 border border-slate-100">
                          <Archive className="h-6 w-6 text-slate-300" />
                        </div>
                        <p className="font-medium text-slate-800 text-sm">Tidak ada transaksi mutasi</p>
                        <p className="text-slate-400 text-xs mt-0.5">Catatan pergerakan barang akan muncul sesuai periode yang dipilih.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredMutations.map((row) => {
                    const isIncoming = row.type === 'masuk';

                    return (
                      <tr key={row.id} className="hover:bg-slate-50/75 transition-colors print:break-inside-avoid">
                        {/* 1. Kode Transaksi */}
                        <td className="py-3.5 px-5">
                          <span className="font-mono text-xs font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/60">
                            {row.code}
                          </span>
                        </td>

                        {/* 2. Tanggal */}
                        <td className="py-3.5 px-5 text-slate-600 text-xs whitespace-nowrap">
                          {new Date(row.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </td>

                        {/* 3. Tipe Mutasi */}
                        <td className="py-3.5 px-5 text-center">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium border ${
                            isIncoming
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200/70'
                              : 'bg-rose-50 text-rose-700 border-rose-200/70'
                          }`}>
                            {isIncoming ? (
                              <>
                                <ArrowDownLeft size={11} className="stroke-[2.5]" />
                                <span>Masuk</span>
                              </>
                            ) : (
                              <>
                                <ArrowUpRight size={11} className="stroke-[2.5]" />
                                <span>Keluar</span>
                              </>
                            )}
                          </span>
                        </td>

                        {/* 4. Nama Barang & Kategori */}
                        <td className="py-3.5 px-5">
                          <span className="font-medium text-slate-800 block leading-tight">
                            {row.itemName}
                          </span>
                          <span className="text-xs text-slate-400 block mt-0.5">
                            {row.categoryName} • {row.unitName}
                          </span>
                        </td>

                        {/* 5. Rekanan / Keterangan */}
                        <td className="py-3.5 px-5 text-slate-600 text-xs">
                          {row.partnerOrNote}
                        </td>

                        {/* 6. Jumlah Mutasi */}
                        <td className="py-3.5 px-5 text-center">
                          <span className={`inline-flex items-center gap-0.5 px-2.5 py-0.5 rounded-full text-xs font-medium border tabular-nums ${
                            isIncoming
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                              : 'bg-rose-50 text-rose-700 border-rose-100'
                          }`}>
                            {isIncoming ? `+${row.quantity}` : `-${row.quantity}`} {row.unitName}
                          </span>
                        </td>

                        {/* 7. Nilai Mutasi */}
                        <td className="py-3.5 px-5 text-right whitespace-nowrap">
                          <span className="font-medium text-slate-800 text-sm tabular-nums block">
                            Rp {row.amount.toLocaleString('id-ID')}
                          </span>
                          <span className="text-3xs text-slate-400 font-normal tabular-nums block">
                            @ Rp {row.unitPriceOrHpp.toLocaleString('id-ID')}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
