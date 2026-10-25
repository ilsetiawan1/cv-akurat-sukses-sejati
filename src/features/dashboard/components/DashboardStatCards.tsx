// src/features/dashboard/components/DashboardStatCards.tsx
'use client';

import { Calendar, ChevronDown } from 'lucide-react';
import type { DashboardStats } from '../services/dashboard.service';
import { useDashboardMonthFilter } from '../hooks/useDashboardMonthFilter';

interface DashboardStatCardsProps {
  stats: DashboardStats;
}

export function DashboardStatCards({ stats }: DashboardStatCardsProps) {
  const roundedValuasi = Math.round(stats.totalValuasi.value);
  const valuasiJuta = (roundedValuasi / 1_000_000).toFixed(1).replace('.', ',');

  const { selectedMonth, handleMonthChange, monthOptions, isPending } = useDashboardMonthFilter(
    stats.selectedMonth?.key
  );

  const monthLabel = stats.selectedMonth?.label || 'Bulan Ini';
  const isCurrentMonth = stats.selectedMonth?.isCurrentMonth ?? true;

  return (
    <div className="space-y-3">
      {/* Filter Bar Metrik Berdasarkan Bulan */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-600 tracking-tight">
            Ringkasan Metrik
          </span>
          <span className="text-[11px] text-slate-400 font-medium">
            • Periode {monthLabel}
          </span>
          {isPending && (
            <span className="text-[10px] text-slate-400 animate-pulse">Memuat...</span>
          )}
        </div>

        {/* Month Selector Dropdown */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <label htmlFor="dashboard-month-filter" className="text-xs text-slate-500 font-medium">
            Pilih Bulan:
          </label>
          <div className="relative">
            <select
              id="dashboard-month-filter"
              value={selectedMonth}
              onChange={(e) => handleMonthChange(e.target.value)}
              disabled={isPending}
              className="h-8.5 pl-3 pr-8 text-xs font-semibold text-slate-700 bg-white border border-slate-200/90 rounded-xl shadow-2xs hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900/10 cursor-pointer transition-all appearance-none disabled:opacity-60"
            >
              {monthOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={13}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
          </div>
        </div>
      </div>

      {/* 3 Stat Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Total Modal Persediaan */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-5 flex flex-col justify-between min-h-36.25 hover:border-slate-200/80 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Modal Persediaan</span>
            {/* Badge 'HPP Berjalan' dihilangkan sesuai permintaan user */}
          </div>

          <div className="my-2.5">
            <div className="flex items-baseline">
              <span className="text-lg sm:text-xl font-normal text-slate-400 mr-1">Rp</span>
              <span className="text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums tracking-tight">
                {roundedValuasi.toLocaleString('id-ID')}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">~Rp {valuasiJuta} Juta aset stok</p>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md shrink-0">
                Aktif
              </span>
              {/* Teks disembunyikan pada tablet view agar tidak bertumpuk */}
              <span className="text-[11px] text-slate-400 max-md:inline md:hidden xl:inline whitespace-nowrap">
                kalkulasi moving average
              </span>
            </div>

            {/* Smooth Emerald Wave SVG */}
            <svg width="76" height="24" viewBox="0 0 76 24" fill="none" className="shrink-0 ml-2">
              <path
                d="M2 18C14 18 20 12 30 14C40 16 50 4 64 6C70 7 73 4 74 3"
                stroke="#10b981"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Card 2: Total Fisik Persediaan */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-5 flex flex-col justify-between min-h-36.25 hover:border-slate-200/80 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Fisik Persediaan</span>
            {/* Badge unit dihilangkan sesuai permintaan user */}
          </div>

          <div className="my-2.5">
            <div className="flex items-baseline">
              <span className="text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums tracking-tight">
                {stats.persediaan.value.toLocaleString('id-ID')}
              </span>
              <span className="text-xs text-slate-400 font-medium ml-2">unit fisik</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">{stats.totalItem.value} SKU katalog terdaftar</p>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-[10px] font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md shrink-0">
                Siap Kirim
              </span>
              {/* Teks disembunyikan pada tablet view agar tidak bertumpuk */}
              <span className="text-[11px] text-slate-400 max-md:inline md:hidden xl:inline whitespace-nowrap">
                stok fisik prima
              </span>
            </div>

            {/* Smooth Sky Blue Wave SVG */}
            <svg width="76" height="24" viewBox="0 0 76 24" fill="none" className="shrink-0 ml-2">
              <path
                d="M2 19C16 19 24 16 34 17C46 18 52 6 64 7C70 8 72 5 74 4"
                stroke="#0ea5e9"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Card 3: Barang Keluar Berdasarkan Bulan */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-5 flex flex-col justify-between min-h-36.25 hover:border-slate-200/80 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              Barang Keluar ({isCurrentMonth ? 'Bulan Ini' : stats.selectedMonth?.shortLabel})
            </span>
            {/* Badge 'Penjualan & Servis' dihilangkan sesuai permintaan user */}
          </div>

          <div className="my-2.5">
            <div className="flex items-baseline">
              <span className="text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums tracking-tight">
                {stats.barangKeluar.value}
              </span>
              <span className="text-xs text-slate-400 font-medium ml-2">unit dikeluarkan</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              +{stats.barangMasuk.value} unit masuk ({isCurrentMonth ? 'bulan ini' : 'periode ini'})
            </p>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-[11px] text-slate-400 truncate">
                {stats.supplier.value} rekanan distributor aktif
              </span>
            </div>

            {/* Smooth Slate Wave SVG */}
            <svg width="76" height="24" viewBox="0 0 76 24" fill="none" className="shrink-0 ml-2">
              <path
                d="M2 14C12 14 22 16 34 16C46 16 54 9 64 10C70 11 72 8 74 7"
                stroke="#64748b"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
