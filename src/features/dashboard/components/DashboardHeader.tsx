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
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Dashboard Operasional
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Pantau pergerakan mutasi, stok persediaan, dan evaluasi HPP dalam satu layar terpadu.
        </p>
      </div>

      {/* Right Action Group */}
      <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
        <button
          type="button"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="w-9 h-9 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 shadow-2xs flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50"
          title="Muat ulang data"
        >
          <RotateCw size={14} className={isRefreshing ? 'animate-spin text-slate-900' : ''} />
        </button>

        {/* Solid Brand Navy Primary Action Button */}
        <Link
          href="/transaksi/barang-masuk"
          className="h-9 px-3.5 rounded-xl bg-[#1E3A8A] hover:bg-blue-800 text-white font-medium text-xs sm:text-sm transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer active:scale-[0.99]"
        >
          <Plus size={15} />
          <span>Catat Barang Masuk</span>
        </Link>
      </div>
    </div>
  );
}
