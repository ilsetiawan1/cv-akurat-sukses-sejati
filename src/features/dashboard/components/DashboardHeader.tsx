// src/features/dashboard/components/DashboardHeader.tsx
'use client';

import Link from 'next/link';
import { RotateCw, Plus } from 'lucide-react';
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
      <div className="flex items-center gap-2.5 self-start sm:self-auto shrink-0">
        {/* Soft Glass Action Button */}
        <Link
          href="/transaksi/barang-masuk"
          className="h-9 px-3.5 rounded-xl bg-linear-to-r from-blue-50/90 via-white/80 to-blue-50/90 hover:from-blue-100 hover:to-sky-100 border border-blue-200/90 text-blue-900 font-semibold text-xs transition-all flex items-center gap-1.5 shadow-2xs backdrop-blur-md cursor-pointer active:scale-95"
        >
          <Plus size={14} className="text-blue-700 stroke-[2.5]" />
          <span>Catat Barang Masuk</span>
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
