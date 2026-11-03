// src/features/goods-receipt/components/ReceiptFunnelCard.tsx
'use client';

import { ArrowDown, Calendar } from 'lucide-react';
import type { ReceiptSummaryStats, SelectedMonthOption } from '../types/goods-receipt.types';

export interface ReceiptFunnelCardProps {
  stats: ReceiptSummaryStats;
  selectedMonth?: string;
  monthOptions?: SelectedMonthOption[];
  onMonthChange?: (month: string) => void;
}

function formatCategoryName(name: string): string {
  if (!name) return '';
  if (name === name.toUpperCase() && name.length > 1) {
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  }
  return name;
}

export default function ReceiptFunnelCard({ 
  stats, 
  selectedMonth = '', 
  monthOptions = [], 
  onMonthChange 
}: ReceiptFunnelCardProps) {
  const hasData = stats.categoryBreakdown && stats.categoryBreakdown.length > 0;

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200/80 p-4 sm:p-5 lg:p-6 shadow-xs select-none">
      {/* HEADER: TITLE & FILTER PERIODE SEJAJAR (FLEX HORIZONTAL DI SEMUA UKURAN LAYAR) */}
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-xs sm:text-sm md:text-base font-medium text-slate-800 tracking-tight shrink-0">
          Distribusi Pengadaan Kategori
        </h3>

        {/* Dropdown Filter Periode terintegrasi di pojok kanan kartu */}
        {monthOptions.length > 0 && onMonthChange && (
          <div className="relative flex items-center shrink-0">
            <Calendar size={12} className="absolute left-2.5 text-slate-400 pointer-events-none" />
            <select
              value={selectedMonth}
              onChange={(e) => onMonthChange(e.target.value)}
              className="pl-6 sm:pl-7 pr-2.5 sm:pr-3 py-1 sm:py-1.5 text-2xs sm:text-xs font-medium border border-slate-200 rounded-lg sm:rounded-xl text-slate-700 bg-white hover:border-slate-300 focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 outline-none transition-all cursor-pointer shadow-2xs max-w-32.5 sm:max-w-40 truncate"
              title="Pilih filter periode transaksi"
            >
              <option value="">Semua Periode</option>
              {monthOptions.map((m) => (
                <option key={m.key} value={m.key}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* METRIC VALUE & TREND BADGE */}
      <div className="mt-2.5 sm:mt-3">
        <div className="flex items-baseline gap-2.5 flex-wrap">
          <span className="text-2xl sm:text-3xl lg:text-4xl font-medium text-slate-900 tabular-nums tracking-tight">
            {stats.totalQuantity.toLocaleString('id-ID')}
          </span>
          {stats.totalQuantity > 0 ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/70">
              <ArrowDown size={11} className="stroke-[2.5]" />
              <span>Fisik Masuk</span>
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-normal text-slate-500 bg-slate-100">
              Nihil Transaksi
            </span>
          )}
        </div>
        <p className="text-xs sm:text-sm text-slate-400 font-normal mt-0.5">
          Akumulasi volume suku cadang diterima dari supplier rekanan
        </p>
      </div>

      {/* PILL GLASSES SEGMENTED BAR - SLEEK & REFINED (24-28px) */}
      <div className="mt-4 sm:mt-5">
        {hasData ? (
          <div className="flex items-center gap-2 sm:gap-2.5 w-full select-none">
            {stats.categoryBreakdown.map((cat, idx) => (
              <div
                key={cat.name + idx}
                style={{ flex: `${Math.max(cat.quantity, 1)}` }}
                className={`h-6 sm:h-7 rounded-lg sm:rounded-xl ${cat.barColor} transition-all duration-300 relative cursor-pointer hover:opacity-90 shadow-2xs`}
                title={`${cat.name}: ${cat.quantity} unit (${cat.percentage}%)`}
              />
            ))}
          </div>
        ) : (
          <div className="h-6 sm:h-7 rounded-lg sm:rounded-xl bg-slate-50 border border-dashed border-slate-200 flex items-center justify-center text-xs text-slate-400">
            Belum ada data penerimaan suku cadang pada periode ini
          </div>
        )}
      </div>

      {/* LEGEND PILLS */}
      {hasData && (
        <div className="mt-4 sm:mt-5 flex flex-wrap items-center gap-x-6 gap-y-2.5 text-xs sm:text-sm text-slate-600">
          {stats.categoryBreakdown.map((cat, idx) => (
            <div key={cat.name + idx} className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded-[5px] ${cat.dotColor} flex items-center justify-center shrink-0 shadow-2xs`}>
                <span className="w-1.5 h-1.5 rounded-full bg-white shadow-2xs" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-medium text-slate-900 tabular-nums">
                  {cat.quantity.toLocaleString('id-ID')}
                </span>
                <span className="text-slate-600 font-normal">
                  {formatCategoryName(cat.name)}
                </span>
                <span className="text-slate-400 text-xs font-normal tabular-nums">
                  ({cat.percentage}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

