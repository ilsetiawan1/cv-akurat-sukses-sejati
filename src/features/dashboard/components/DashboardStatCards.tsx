// src/features/dashboard/components/DashboardStatCards.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Calendar, Info } from 'lucide-react';
import type { DashboardStats } from '../services/dashboard.service';
import { useDashboardMonthFilter } from '../hooks/useDashboardMonthFilter';

interface DashboardStatCardsProps {
  stats: DashboardStats;
}

export function DashboardStatCards({ stats }: DashboardStatCardsProps) {
  const [activeTooltip, setActiveTooltip] = useState<'valuasi' | 'fisik' | 'keluar' | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const roundedValuasi = Math.round(stats.totalValuasi.value);

  const { selectedMonth, handleMonthChange, monthOptions, isPending } = useDashboardMonthFilter(
    stats.selectedMonth?.key
  );

  const monthLabel = stats.selectedMonth?.label || 'Bulan Ini';

  useEffect(() => {
    if (!activeTooltip) return;
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setActiveTooltip(null);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [activeTooltip]);

  return (
    <div ref={containerRef} className="space-y-3.5 select-none relative z-30">
      {/* Filter Bar Metrik Berdasarkan Bulan */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-800 uppercase tracking-wider">
            Ringkasan Metrik
          </span>
          <span className="text-xs text-slate-400 font-normal">
            • Periode {monthLabel}
          </span>
          {isPending && (
            <span className="text-2xs text-blue-700 animate-pulse font-medium">Memuat...</span>
          )}
        </div>

        {/* Month Selector Dropdown */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          <div className="relative">
            <Calendar
              size={13}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <select
              id="dashboard-month-filter"
              value={selectedMonth}
              onChange={(e) => handleMonthChange(e.target.value)}
              disabled={isPending}
              className="h-8 pl-7 pr-7 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-xl shadow-2xs hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-900/10 cursor-pointer transition-colors appearance-none disabled:opacity-60"
            >
              {monthOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={12}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
          </div>
        </div>
      </div>

      {/* 3 Stat Cards: Horizontal Snap Carousel di Mobile (< md), Grid di Tablet/Desktop (>= md) */}
      <div className="flex md:grid md:grid-cols-3 gap-3.5 overflow-x-auto snap-x snap-mandatory pb-1 md:pb-0 scrollbar-none">
        
        {/* CARD 1: TOTAL MODAL PERSEDIAAN */}
        <div className="w-[270px] sm:w-[290px] md:w-auto shrink-0 snap-start bg-white rounded-xl sm:rounded-2xl border border-slate-200/80 shadow-xs p-4 sm:p-5 flex flex-col justify-between hover:border-slate-300/80 transition-all">
          {/* Header Card: Title & Tooltip Trigger */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-medium text-slate-600 tracking-tight truncate">
              Total Modal Persediaan
            </span>
            <div className="relative">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveTooltip((prev) => (prev === 'valuasi' ? null : 'valuasi'));
                }}
                onMouseEnter={() => setActiveTooltip('valuasi')}
                onMouseLeave={() => setActiveTooltip(null)}
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border flex items-center justify-center transition-all shrink-0 cursor-pointer ${
                  activeTooltip === 'valuasi'
                    ? 'bg-slate-100 border-slate-300 text-slate-900 shadow-2xs'
                    : 'border-slate-200/90 text-slate-400 hover:text-slate-800 hover:border-slate-300 hover:bg-slate-50'
                }`}
                title="Penjelasan & rumus Total Modal Persediaan"
                aria-label="Info rumus Total Modal Persediaan"
              >
                <Info size={14} />
              </button>

              {/* Tooltip Card: Clean Monochrome Glass */}
              {activeTooltip === 'valuasi' && (
                <div
                  onMouseEnter={() => setActiveTooltip('valuasi')}
                  onMouseLeave={() => setActiveTooltip(null)}
                  className="absolute right-0 top-9 sm:top-10 w-68 sm:w-72 bg-white/95 backdrop-blur-md text-slate-800 p-3.5 rounded-xl sm:rounded-2xl shadow-xl shadow-slate-900/10 border border-slate-200/90 text-xs z-50 pointer-events-auto animate-in fade-in zoom-in-95 duration-150 select-text"
                  role="tooltip"
                >
                  <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100">
                    <span className="font-medium text-slate-900 text-xs">Total Modal Persediaan</span>
                    <span className="text-3xs px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-mono border border-emerald-200/70">
                      FINANSIAL
                    </span>
                  </div>
                  <p className="mt-2 text-slate-600 text-2xs leading-relaxed font-normal">
                    Akumulasi nilai total HPP persediaan dari seluruh suku cadang aktif di gudang dengan metode kalkulasi Moving Average.
                  </p>
                  <div className="mt-2.5 p-2 rounded-lg bg-slate-50/90 border border-slate-200/80">
                    <span className="text-3xs text-slate-400 font-normal uppercase tracking-wider block">
                      Rumus Perhitungan:
                    </span>
                    <code className="text-2xs text-slate-800 font-mono font-medium block mt-0.5">
                      Σ (Stok Fisik × HPP Terkini)
                    </code>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Body: Value on left, Sparkline Waveform on right */}
          <div className="mt-4 flex items-center justify-between gap-2">
            <div>
              <div className="flex items-baseline whitespace-nowrap">
                <span className="text-xs font-normal text-slate-400 mr-1">Rp</span>
                <span className="text-xl sm:text-2xl font-medium text-slate-900 tabular-nums">
                  {roundedValuasi.toLocaleString('id-ID')}
                </span>
                <span
                  className={`text-xs font-medium ml-1.5 select-none ${
                    roundedValuasi > 0 ? 'text-emerald-500' : 'text-slate-300'
                  }`}
                >
                  ▲
                </span>
              </div>
              <div className="mt-1 flex flex-col">
                <span
                  className={`text-xs font-medium ${
                    roundedValuasi > 0 ? 'text-emerald-600' : 'text-slate-500'
                  }`}
                >
                  Nilai Berjalan HPP
                </span>
                <span className="text-xs text-slate-400 font-normal">
                  akumulasi valuasi persediaan
                </span>
              </div>
            </div>

            {/* Mini Waveform Sparkline (Emerald Accent) */}
            <div className="flex items-end gap-1 sm:gap-1.5 h-10 sm:h-11 pb-0.5 shrink-0" aria-hidden="true">
              <span className="w-2 sm:w-2.5 rounded-full bg-slate-100 h-3.5" />
              <span className="w-2 sm:w-2.5 rounded-full bg-slate-100 h-6" />
              <span className="w-2 sm:w-2.5 rounded-full bg-slate-100 h-5" />
              <span
                className={`w-2 sm:w-2.5 rounded-full ${
                  roundedValuasi > 0 ? 'bg-emerald-500 shadow-2xs' : 'bg-slate-200'
                } h-10`}
              />
              <span className="w-2 sm:w-2.5 rounded-full bg-slate-100 h-7" />
              <span className="w-2 sm:w-2.5 rounded-full bg-slate-100 h-8" />
              <span className="w-2 sm:w-2.5 rounded-full bg-slate-100 h-4" />
            </div>
          </div>
        </div>

        {/* CARD 2: TOTAL FISIK PERSEDIAAN */}
        <div className="w-[270px] sm:w-[290px] md:w-auto shrink-0 snap-start bg-white rounded-xl sm:rounded-2xl border border-slate-200/80 shadow-xs p-4 sm:p-5 flex flex-col justify-between hover:border-slate-300/80 transition-all">
          {/* Header Card: Title & Tooltip Trigger */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-medium text-slate-600 tracking-tight truncate">
              Total Fisik Persediaan
            </span>
            <div className="relative">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveTooltip((prev) => (prev === 'fisik' ? null : 'fisik'));
                }}
                onMouseEnter={() => setActiveTooltip('fisik')}
                onMouseLeave={() => setActiveTooltip(null)}
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border flex items-center justify-center transition-all shrink-0 cursor-pointer ${
                  activeTooltip === 'fisik'
                    ? 'bg-slate-100 border-slate-300 text-slate-900 shadow-2xs'
                    : 'border-slate-200/90 text-slate-400 hover:text-slate-800 hover:border-slate-300 hover:bg-slate-50'
                }`}
                title="Penjelasan Total Fisik Persediaan"
                aria-label="Info Total Fisik Persediaan"
              >
                <Info size={14} />
              </button>

              {/* Tooltip Card: Clean Monochrome Glass */}
              {activeTooltip === 'fisik' && (
                <div
                  onMouseEnter={() => setActiveTooltip('fisik')}
                  onMouseLeave={() => setActiveTooltip(null)}
                  className="absolute right-0 top-9 sm:top-10 w-68 sm:w-72 bg-white/95 backdrop-blur-md text-slate-800 p-3.5 rounded-xl sm:rounded-2xl shadow-xl shadow-slate-900/10 border border-slate-200/90 text-xs z-50 pointer-events-auto animate-in fade-in zoom-in-95 duration-150 select-text"
                  role="tooltip"
                >
                  <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100">
                    <span className="font-medium text-slate-900 text-xs">Total Fisik Persediaan</span>
                    <span className="text-3xs px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-mono border border-blue-200/70">
                      LOGISTIK
                    </span>
                  </div>
                  <p className="mt-2 text-slate-600 text-2xs leading-relaxed font-normal">
                    Jumlah total unit fisik seluruh suku cadang yang saat ini tersedia dan siap disalurkan dari rak gudang.
                  </p>
                  <div className="mt-2.5 p-2 rounded-lg bg-slate-50/90 border border-slate-200/80">
                    <span className="text-3xs text-slate-400 font-normal uppercase tracking-wider block">
                      Keterangan:
                    </span>
                    <code className="text-2xs text-slate-800 font-mono font-medium block mt-0.5">
                      Σ Qty Fisik Seluruh Item
                    </code>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Body: Value on left, Sparkline Waveform on right */}
          <div className="mt-4 flex items-center justify-between gap-2">
            <div>
              <div className="flex items-baseline whitespace-nowrap">
                <span className="text-xl sm:text-2xl font-medium text-slate-900 tabular-nums">
                  {stats.persediaan.value.toLocaleString('id-ID')}
                </span>
                <span className="text-xs font-normal text-slate-400 ml-1">unit</span>
                <span
                  className={`text-xs font-medium ml-1.5 select-none ${
                    stats.persediaan.value > 0 ? 'text-blue-500' : 'text-slate-300'
                  }`}
                >
                  ▲
                </span>
              </div>
              <div className="mt-1 flex flex-col">
                <span
                  className={`text-xs font-medium ${
                    stats.persediaan.value > 0 ? 'text-blue-600' : 'text-slate-500'
                  }`}
                >
                  Siap Distribusi
                </span>
                <span className="text-xs text-slate-400 font-normal">
                  volume suku cadang di gudang
                </span>
              </div>
            </div>

            {/* Mini Waveform Sparkline (Vibrant Blue Accent) */}
            <div className="flex items-end gap-1 sm:gap-1.5 h-10 sm:h-11 pb-0.5 shrink-0" aria-hidden="true">
              <span className="w-2 sm:w-2.5 rounded-full bg-slate-100 h-3" />
              <span className="w-2 sm:w-2.5 rounded-full bg-slate-100 h-5" />
              <span className="w-2 sm:w-2.5 rounded-full bg-slate-100 h-7" />
              <span
                className={`w-2 sm:w-2.5 rounded-full ${
                  stats.persediaan.value > 0 ? 'bg-[#2E82F6] shadow-2xs' : 'bg-slate-200'
                } h-10`}
              />
              <span className="w-2 sm:w-2.5 rounded-full bg-slate-100 h-6" />
              <span className="w-2 sm:w-2.5 rounded-full bg-slate-100 h-5" />
              <span className="w-2 sm:w-2.5 rounded-full bg-slate-100 h-3.5" />
            </div>
          </div>
        </div>

        {/* CARD 3: BARANG KELUAR */}
        <div className="w-[270px] sm:w-[290px] md:w-auto shrink-0 snap-start bg-white rounded-xl sm:rounded-2xl border border-slate-200/80 shadow-xs p-4 sm:p-5 flex flex-col justify-between hover:border-slate-300/80 transition-all">
          {/* Header Card: Title & Tooltip Trigger */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-medium text-slate-600 tracking-tight truncate">
              Barang Keluar
            </span>
            <div className="relative">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveTooltip((prev) => (prev === 'keluar' ? null : 'keluar'));
                }}
                onMouseEnter={() => setActiveTooltip('keluar')}
                onMouseLeave={() => setActiveTooltip(null)}
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border flex items-center justify-center transition-all shrink-0 cursor-pointer ${
                  activeTooltip === 'keluar'
                    ? 'bg-slate-100 border-slate-300 text-slate-900 shadow-2xs'
                    : 'border-slate-200/90 text-slate-400 hover:text-slate-800 hover:border-slate-300 hover:bg-slate-50'
                }`}
                title="Penjelasan Total Barang Keluar"
                aria-label="Info Total Barang Keluar"
              >
                <Info size={14} />
              </button>

              {/* Tooltip Card: Clean Monochrome Glass */}
              {activeTooltip === 'keluar' && (
                <div
                  onMouseEnter={() => setActiveTooltip('keluar')}
                  onMouseLeave={() => setActiveTooltip(null)}
                  className="absolute right-0 top-9 sm:top-10 w-68 sm:w-72 bg-white/95 backdrop-blur-md text-slate-800 p-3.5 rounded-xl sm:rounded-2xl shadow-xl shadow-slate-900/10 border border-slate-200/90 text-xs z-50 pointer-events-auto animate-in fade-in zoom-in-95 duration-150 select-text"
                  role="tooltip"
                >
                  <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100">
                    <span className="font-medium text-slate-900 text-xs">Total Barang Keluar</span>
                    <span className="text-3xs px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 font-mono border border-rose-200/70">
                      OPERASIONAL
                    </span>
                  </div>
                  <p className="mt-2 text-slate-600 text-2xs leading-relaxed font-normal">
                    Jumlah seluruh transaksi pengeluaran dan pengurangan persediaan suku cadang dari gudang pada periode ini.
                  </p>
                  <div className="mt-2.5 p-2 rounded-lg bg-slate-50/90 border border-slate-200/80">
                    <span className="text-3xs text-slate-400 font-normal uppercase tracking-wider block">
                      Keterangan:
                    </span>
                    <code className="text-2xs text-slate-800 font-mono font-medium block mt-0.5">
                      Count (Dokumen BK)
                    </code>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Body: Value on left, Sparkline Waveform on right */}
          <div className="mt-4 flex items-center justify-between gap-2">
            <div>
              <div className="flex items-baseline whitespace-nowrap">
                <span className="text-xl sm:text-2xl font-medium text-slate-900 tabular-nums">
                  {stats.barangKeluar.value.toLocaleString('id-ID')}
                </span>
                <span className="text-xs font-normal text-slate-400 ml-1">transaksi</span>
                <span
                  className={`text-xs font-medium ml-1.5 select-none ${
                    stats.barangKeluar.value > 0 ? 'text-rose-500' : 'text-slate-300'
                  }`}
                >
                  {stats.barangKeluar.value > 0 ? '▼' : '—'}
                </span>
              </div>
              <div className="mt-1 flex flex-col">
                <span
                  className={`text-xs font-medium ${
                    stats.barangKeluar.value > 0 ? 'text-rose-600' : 'text-slate-500'
                  }`}
                >
                  Pengeluaran Stok
                </span>
                <span className="text-xs text-slate-400 font-normal">
                  mutasi keluar periode ini
                </span>
              </div>
            </div>

            {/* Mini Waveform Sparkline (Rose Accent) */}
            <div className="flex items-end gap-1 sm:gap-1.5 h-10 sm:h-11 pb-0.5 shrink-0" aria-hidden="true">
              <span className="w-2 sm:w-2.5 rounded-full bg-slate-100 h-4" />
              <span className="w-2 sm:w-2.5 rounded-full bg-slate-100 h-3.5" />
              <span className="w-2 sm:w-2.5 rounded-full bg-slate-100 h-6" />
              <span
                className={`w-2 sm:w-2.5 rounded-full ${
                  stats.barangKeluar.value > 0 ? 'bg-rose-500 shadow-2xs' : 'bg-slate-200'
                } h-10`}
              />
              <span className="w-2 sm:w-2.5 rounded-full bg-slate-100 h-5" />
              <span className="w-2 sm:w-2.5 rounded-full bg-slate-100 h-7" />
              <span className="w-2 sm:w-2.5 rounded-full bg-slate-100 h-3" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
