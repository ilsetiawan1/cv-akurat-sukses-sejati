// src/features/goods-receipt/components/ReceiptStatCards.tsx
'use client';

import { PackageCheck, ArrowDownLeft, Wallet } from 'lucide-react';
import type { ReceiptSummaryStats } from '../types/goods-receipt.types';

export interface ReceiptStatCardsProps {
  stats: ReceiptSummaryStats;
}

export default function ReceiptStatCards({ stats }: ReceiptStatCardsProps) {
  return (
    <div className="flex sm:grid sm:grid-cols-3 gap-2.5 lg:gap-4 overflow-x-auto sm:overflow-visible pb-1 sm:pb-0 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden select-none">
      {/* CARD 1: TOTAL TRANSAKSI */}
      <div className="w-[210px] sm:w-auto shrink-0 snap-start relative overflow-hidden rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-5 bg-linear-to-br from-white via-slate-50 to-blue-50/40 border border-slate-200/80 shadow-xs hover:border-blue-200/80 transition-all group">
        <svg className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-30" viewBox="0 0 400 200" fill="none" preserveAspectRatio="none">
          <path d="M-20 140 C100 60, 240 200, 420 80 L420 220 L-20 220 Z" fill="#3B82F6" fillOpacity="0.08" />
          <path d="M140 -20 C220 90, 120 160, 280 220 L420 220 L420 -20 Z" fill="#2563EB" fillOpacity="0.06" />
          <circle cx="330" cy="145" r="85" fill="#60A5FA" fillOpacity="0.08" />
        </svg>

        <div className="relative z-10 flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2">
            <span className="text-slate-600 font-medium text-xs sm:text-sm tracking-tight truncate">
              Total Transaksi Masuk
            </span>
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-blue-100/80 text-blue-700 flex items-center justify-center shrink-0 border border-blue-200/70 shadow-2xs">
              <PackageCheck size={13} />
            </div>
          </div>

          <div className="mt-2 sm:mt-2.5 flex items-baseline gap-1.5">
            <span className="text-lg sm:text-2xl lg:text-3xl font-medium text-slate-900 tabular-nums">
              {stats.totalTransactions.toLocaleString('id-ID')}
            </span>
            <span className="text-xs text-slate-400 font-normal">transaksi</span>
          </div>
        </div>
      </div>

      {/* CARD 2: TOTAL UNIT MASUK */}
      <div className="w-[210px] sm:w-auto shrink-0 snap-start relative overflow-hidden rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-5 bg-linear-to-br from-white via-slate-50 to-emerald-50/40 border border-slate-200/80 shadow-xs hover:border-emerald-200/80 transition-all group">
        <svg className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-30" viewBox="0 0 400 200" fill="none" preserveAspectRatio="none">
          <path d="M-20 160 C120 120, 180 20, 420 50 L420 220 L-20 220 Z" fill="#10B981" fillOpacity="0.08" />
          <circle cx="335" cy="140" r="80" fill="#34D399" fillOpacity="0.08" />
        </svg>

        <div className="relative z-10 flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2">
            <span className="text-slate-600 font-medium text-xs sm:text-sm tracking-tight truncate">
              Total Fisik Diterima
            </span>
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-emerald-100/80 text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-200/70 shadow-2xs">
              <ArrowDownLeft size={13} />
            </div>
          </div>

          <div className="mt-2 sm:mt-2.5 flex items-baseline gap-1.5">
            <span className="text-lg sm:text-2xl lg:text-3xl font-medium text-emerald-700 tabular-nums">
              +{stats.totalQuantity.toLocaleString('id-ID')}
            </span>
            <span className="text-xs text-emerald-600/80 font-normal">unit</span>
          </div>
        </div>
      </div>

      {/* CARD 3: TOTAL NILAI BELANJA */}
      <div className="w-[210px] sm:w-auto shrink-0 snap-start relative overflow-hidden rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-5 bg-linear-to-br from-white via-slate-50 to-indigo-50/40 border border-slate-200/80 shadow-xs hover:border-indigo-200/80 transition-all group">
        <svg className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-30" viewBox="0 0 400 200" fill="none" preserveAspectRatio="none">
          <path d="M-20 120 C90 190, 240 60, 420 130 L420 220 L-20 220 Z" fill="#6366F1" fillOpacity="0.08" />
          <circle cx="330" cy="145" r="82" fill="#818CF8" fillOpacity="0.08" />
        </svg>

        <div className="relative z-10 flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2">
            <span className="text-slate-600 font-medium text-xs sm:text-sm tracking-tight truncate">
              Total Nilai Pembelian
            </span>
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-indigo-100/80 text-indigo-700 flex items-center justify-center shrink-0 border border-indigo-200/70 shadow-2xs">
              <Wallet size={13} />
            </div>
          </div>

          <div className="mt-2 sm:mt-2.5 flex items-baseline whitespace-nowrap">
            <span className="text-xs sm:text-sm font-normal text-slate-400 mr-1">Rp</span>
            <span className="text-lg sm:text-2xl lg:text-3xl font-medium text-slate-900 tabular-nums">
              {stats.totalAmount.toLocaleString('id-ID')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
