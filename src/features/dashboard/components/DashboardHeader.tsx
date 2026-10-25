// src/features/dashboard/components/DashboardHeader.tsx
'use client';

import Link from 'next/link';
import { RotateCw } from 'lucide-react';
import { useDashboardHeader } from '../hooks/useDashboardHeader';

export function DashboardHeader() {
  const { isRefreshing, handleRefresh } = useDashboardHeader();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl sm:text-[26px] font-bold text-slate-900 tracking-tight leading-snug">
          Dashboard Operasional
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Pantau pergerakan mutasi, stok persediaan, dan evaluasi HPP dalam satu layar.
        </p>
      </div>

      {/* Right Action Group */}
      <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
        {/* Status Online Pill */}
        <div className="h-9 px-3.5 rounded-full bg-white border border-slate-100 shadow-2xs text-xs font-medium text-slate-700 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Sistem Aktif (Online)</span>
        </div>

        {/* Primary Action Button */}
        <Link
          href="/transaksi/barang-masuk"
          className="h-9 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-all flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
        >
          <span>+ Catat Barang Masuk</span>
        </Link>

        {/* Refresh Icon Button */}
        <button
          type="button"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="w-9 h-9 rounded-xl bg-white hover:bg-slate-50 border border-slate-100 shadow-2xs flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors cursor-pointer disabled:opacity-50"
          title="Muat ulang data"
        >
          <RotateCw size={14} className={isRefreshing ? 'animate-spin text-slate-900' : ''} />
        </button>
      </div>
    </div>
  );
}
