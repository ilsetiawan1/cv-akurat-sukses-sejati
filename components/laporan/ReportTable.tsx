// components/laporan/ReportTable.tsx
'use client';

import { useState } from 'react';
import type { GoodsReceiptWithRelations, GoodsIssueWithRelations } from '@/types/transaction.types';
import type { ReportSummary } from '@/types/report.types';
import ExportButton from './ExportButton';

interface Props {
  receipts: GoodsReceiptWithRelations[];
  issues: GoodsIssueWithRelations[];
  summary: ReportSummary;
  dateRangeText: string;
}

export default function ReportTable({ receipts, issues, summary, dateRangeText }: Props) {
  const [activeTab, setActiveTab] = useState<'masuk' | 'keluar'>('masuk');

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @page {
          size: A4 landscape;
          margin: 15mm 12mm 15mm 12mm;
        }
        @media print {
          html, body, #__next, [data-turbo], main, flex, grid {
            position: static !important;
            overflow: visible !important;
            height: auto !important;
            min-height: auto !important;
            background: #ffffff !important;
          }
          .print-hide-all, sidebar, nav, header, button {
            display: none !important;
          }
          /* Pastikan kontainer Kop Surat dan Tabel tidak dipaksa bertumpuk */
          .print-container-formal {
            position: static !important;
            display: block !important;
            width: 100% !important;
            page-break-inside: auto;
            box-shadow: none !important;
            border: none !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          table {
            border-collapse: collapse !important;
            width: 100% !important;
          }
          th, td {
            border: 1px solid #d1d5db !important;
            padding: 10px 14px !important;
            background: white !important;
            color: #111827 !important;
          }
          th {
            background-color: #f3f4f6 !important;
            font-weight: bold !important;
          }
        }
      `}} />

      <div className="flex flex-col gap-6">
        
        {/* STAT CARDS - Sembunyikan saat dicetak agar hemat tinta (print:hidden) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 print:hidden print-hide-all">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Total Nilai Masuk (Aset)</p>
            <p className="text-3xl font-bold text-emerald-600 mt-3">
              Rp {summary.totalIncomingValue.toLocaleString('id-ID')}
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Total HPP Keluar (Beban)</p>
            <p className="text-3xl font-bold text-red-500 mt-3">
              Rp {summary.totalOutgoingValue.toLocaleString('id-ID')}
            </p>
          </div>
          <div className="bg-gradient-to-br from-[#7C3AED] to-purple-700 p-6 rounded-2xl shadow-lg flex flex-col justify-between text-white">
            <p className="text-sm font-semibold text-purple-100 uppercase tracking-wider">Selisih Transaksi (Margin)</p>
            <p className="text-3xl font-bold mt-3">
              Rp {summary.margin.toLocaleString('id-ID')}
            </p>
          </div>
        </div>

        {/* TABS & EXPORT BUTTON - Wajib hilang saat print */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mt-2 print:hidden print-hide-all">
          <div className="flex p-1.5 bg-slate-100/80 rounded-xl w-full lg:w-auto">
            <button 
              onClick={() => setActiveTab('masuk')}
              className={`flex-1 lg:flex-none px-8 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                activeTab === 'masuk' ? 'bg-white text-[#7C3AED] shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
              }`}
            >
              Data Barang Masuk
            </button>
            <button 
              onClick={() => setActiveTab('keluar')}
              className={`flex-1 lg:flex-none px-8 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                activeTab === 'keluar' ? 'bg-white text-[#7C3AED] shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
              }`}
            >
              Data Barang Keluar
            </button>
          </div>

          <ExportButton targetId="report-container" filename={`Laporan_Persediaan_${activeTab}_${new Date().toISOString().slice(0,10)}`} />
        </div>

        {/* ========================================================
            CONTAINER CETAK & TABEL UTAMA 
            ======================================================== */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden print-container-formal" id="report-container">
          
          {/* KOP SURAT PERUSAHAAN (KHUSUS PRINT, SEMBUNYI DI WEB) */}
          <div className="hidden print:flex items-center justify-between border-b-[3px] border-gray-800 pb-5 mb-6 w-full">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-full border-[3px] border-[#7C3AED] p-0.5 flex items-center justify-center bg-white shrink-0 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo-cv-akurat-sukses-sejati-bg-purple.png" alt="Logo Perusahaan" className="w-full h-full object-contain rounded-full" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-black tracking-tight uppercase m-0 leading-tight">
                  CV. AKURAT SUKSES SEJATI
                </h1>
                <p className="text-sm text-gray-800 font-semibold mt-1 uppercase tracking-wide">
                  LAPORAN MUTASI {activeTab === 'masuk' ? 'BARANG MASUK' : 'BARANG KELUAR'}
                </p>
                <p className="text-sm text-gray-600 mt-0.5">Periode: {dateRangeText}</p>
              </div>
            </div>
            <div className="text-right self-end">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-widest">TANGGAL CETAK</p>
              <p className="text-sm font-bold text-black mt-1">{new Date().toLocaleDateString('id-ID', {day: '2-digit', month: 'long', year: 'numeric'})}</p>
            </div>
          </div>

          {/* TABEL DATA INTERAKTIF & CETAK */}
          <div className="overflow-x-auto w-full print:overflow-visible">
            {activeTab === 'masuk' ? (
              <table className="w-full text-left min-w-[1000px]">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs font-bold border-b border-gray-200 uppercase tracking-widest print:bg-gray-100 print:text-black print:border-gray-400">
                    <th className="py-4 px-6">ID / Kode</th>
                    <th className="py-4 px-6">Tanggal</th>
                    <th className="py-4 px-6 min-w-[220px]">Nama Barang</th>
                    <th className="py-4 px-6">Supplier</th>
                    <th className="py-4 px-6 text-center">Jumlah</th>
                    <th className="py-4 px-6 text-right">Total Harga</th>
                  </tr>
                </thead>
                <tbody className="text-sm bg-white divide-y divide-gray-100 print:divide-gray-300">
                  {receipts.length === 0 && (
                    <tr><td colSpan={6} className="p-10 text-center text-gray-500 font-medium text-base print:border print:border-gray-300">Tidak ada data transaksi di periode ini</td></tr>
                  )}
                  {receipts.map((row) => (
                    <tr key={row.id} className="odd:bg-white even:bg-slate-50/50 hover:bg-slate-100/60 transition-colors duration-150 print:break-inside-avoid">
                      <td className="py-4 px-6 font-mono text-xs text-gray-500 font-semibold print:text-black">{row.receipt_code}</td>
                      <td className="py-4 px-6 text-gray-700 font-medium print:text-black">{new Date(row.receipt_date).toLocaleDateString('id-ID')}</td>
                      <td className="py-4 px-6">
                        <p className="font-bold text-gray-900 print:text-black">{row.item?.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5 font-medium print:text-gray-700">{row.item?.category?.name} • {row.item?.unit?.name}</p>
                      </td>
                      <td className="py-4 px-6 text-gray-600 font-medium print:text-black">{row.supplier?.name}</td>
                      <td className="py-4 px-6 text-center font-extrabold text-emerald-600 text-base print:text-black">+{row.quantity}</td>
                      <td className="py-4 px-6 text-right font-bold text-gray-900 print:text-black">Rp {Number(row.total_price).toLocaleString('id-ID')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className="w-full text-left min-w-[1000px]">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs font-bold border-b border-gray-200 uppercase tracking-widest print:bg-gray-100 print:text-black print:border-gray-400">
                    <th className="py-4 px-6">ID / Kode</th>
                    <th className="py-4 px-6">Tanggal</th>
                    <th className="py-4 px-6 min-w-[220px]">Nama Barang</th>
                    <th className="py-4 px-6 text-center">Jumlah Keluar</th>
                    <th className="py-4 px-6 text-right">HPP / Unit</th>
                    <th className="py-4 px-6 text-right">Total HPP</th>
                  </tr>
                </thead>
                <tbody className="text-sm bg-white divide-y divide-gray-100 print:divide-gray-300">
                  {issues.length === 0 && (
                    <tr><td colSpan={6} className="p-10 text-center text-gray-500 font-medium text-base print:border print:border-gray-300">Tidak ada data transaksi di periode ini</td></tr>
                  )}
                  {issues.map((row) => (
                    <tr key={row.id} className="odd:bg-white even:bg-slate-50/50 hover:bg-slate-100/60 transition-colors duration-150 print:break-inside-avoid">
                      <td className="py-4 px-6 font-mono text-xs text-gray-500 font-semibold print:text-black">{row.issue_code}</td>
                      <td className="py-4 px-6 text-gray-700 font-medium print:text-black">{new Date(row.issue_date).toLocaleDateString('id-ID')}</td>
                      <td className="py-4 px-6">
                        <p className="font-bold text-gray-900 print:text-black">{row.item?.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5 font-medium print:text-gray-700">{row.item?.category?.name} • {row.item?.unit?.name}</p>
                      </td>
                      <td className="py-4 px-6 text-center font-extrabold text-red-500 text-base print:text-black">-{row.quantity}</td>
                      <td className="py-4 px-6 text-right text-gray-500 font-medium print:text-black">
                         Rp {(Number(row.total_hpp) / row.quantity).toLocaleString('id-ID')}
                      </td>
                      <td className="py-4 px-6 text-right font-bold text-gray-900 print:text-black">Rp {Number(row.total_hpp).toLocaleString('id-ID')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
