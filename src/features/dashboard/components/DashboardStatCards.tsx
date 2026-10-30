// src/features/dashboard/components/DashboardStatCards.tsx
'use client';

import { ChevronDown } from 'lucide-react';
import type { DashboardStats } from '../services/dashboard.service';
import { useDashboardMonthFilter } from '../hooks/useDashboardMonthFilter';

interface DashboardStatCardsProps {
  stats: DashboardStats;
}

export function DashboardStatCards({ stats }: DashboardStatCardsProps) {
  const roundedValuasi = Math.round(stats.totalValuasi.value);

  const { selectedMonth, handleMonthChange, monthOptions, isPending } = useDashboardMonthFilter(
    stats.selectedMonth?.key
  );

  const monthLabel = stats.selectedMonth?.label || 'Bulan Ini';

  return (
    <div className="space-y-3.5">
      {/* Filter Bar Metrik Berdasarkan Bulan */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700 tracking-tight">
            Ringkasan Metrik
          </span>
          <span className="text-[11px] text-slate-400 font-medium">
            • Periode {monthLabel}
          </span>
          {isPending && (
            <span className="text-[10px] text-blue-600 animate-pulse font-semibold">Memuat...</span>
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

      {/* 3 Stat Cards Grid - Responsive Soft Glass & 3D Isometric Vectors */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 lg:gap-5 select-none">
        
        {/* CARD 1: TOTAL MODAL PERSEDIAAN */}
        <div className="relative overflow-hidden rounded-2xl p-4 sm:p-5 md:p-4 lg:p-5 border border-emerald-200/80 bg-linear-to-br from-white via-emerald-50/70 to-emerald-100/60 shadow-xs hover:border-emerald-300 hover:shadow-sm transition-all group">
          {/* Lapisan Gelombang Kurva SVG */}
          <svg className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-40" viewBox="0 0 400 200" fill="none" preserveAspectRatio="none">
            <path d="M-20 140 C100 60, 240 200, 420 80 L420 220 L-20 220 Z" fill="#10B981" fillOpacity="0.08"/>
            <path d="M140 -20 C220 90, 120 160, 280 220 L420 220 L420 -20 Z" fill="#059669" fillOpacity="0.06"/>
            <circle cx="330" cy="145" r="85" fill="#34D399" fillOpacity="0.08"/>
          </svg>

          {/* Konten Kiri */}
          <div className="relative z-10 flex flex-col justify-between min-h-18 md:min-h-16 lg:min-h-20">
            <div className="flex items-start justify-between gap-1.5">
              <span className="text-slate-700 font-semibold text-xs sm:text-sm md:text-xs lg:text-sm tracking-tight whitespace-nowrap">
                Total Modal Persediaan
              </span>
              <span className="inline-flex items-center gap-1 px-2 md:px-1.5 lg:px-2.5 py-0.5 rounded-full text-[10px] md:text-[10px] lg:text-xs font-semibold border transition-colors bg-emerald-100 text-emerald-800 border-emerald-300 shadow-xs ring-1 ring-emerald-400/20 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                <span>Aset Aktif</span>
              </span>
            </div>

            <div className="mt-2 md:mt-1.5 lg:mt-2">
              <div className="flex items-baseline">
                <span className="text-base sm:text-lg md:text-sm lg:text-lg font-medium text-emerald-700 mr-1">Rp</span>
                <span className="text-2xl sm:text-3xl md:text-xl lg:text-3xl xl:text-4xl font-extrabold tracking-tight text-emerald-950 tabular-nums">
                  {roundedValuasi.toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          </div>

          {/* Ilustrasi 3D Isometric Gold & Emerald Coins Stack (Kanan Bawah) */}
          <div className="absolute -right-2 -bottom-2 md:-right-2 md:-bottom-2 lg:-right-3 lg:-bottom-4 w-20 h-20 sm:w-24 sm:h-24 md:w-20 md:h-20 lg:w-28 lg:h-28 pointer-events-none transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-3">
            <svg viewBox="0 0 140 140" fill="none" className="drop-shadow-sm w-full h-full">
              <defs>
                {/* Gold Gradients */}
                <linearGradient id="goldTop" x1="0" y1="0" x2="1" y2="1">
                  <stop stopColor="#FEF3C7"/>
                  <stop offset="0.6" stopColor="#FDE047"/>
                  <stop offset="1" stopColor="#F59E0B"/>
                </linearGradient>
                <linearGradient id="goldSide" x1="0" y1="0" x2="0" y2="1">
                  <stop stopColor="#F59E0B"/>
                  <stop offset="1" stopColor="#B45309"/>
                </linearGradient>
                {/* Emerald Gradients */}
                <linearGradient id="emTop" x1="0" y1="0" x2="1" y2="1">
                  <stop stopColor="#D1FAE5"/>
                  <stop offset="0.7" stopColor="#6EE7B7"/>
                  <stop offset="1" stopColor="#10B981"/>
                </linearGradient>
                <linearGradient id="emSide" x1="0" y1="0" x2="0" y2="1">
                  <stop stopColor="#059669"/>
                  <stop offset="1" stopColor="#064E3B"/>
                </linearGradient>
                <linearGradient id="shinyMedal" x1="20" y1="20" x2="110" y2="110" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FFFBEB"/>
                  <stop offset="0.4" stopColor="#FDE68A"/>
                  <stop offset="1" stopColor="#F59E0B"/>
                </linearGradient>
              </defs>

              <g transform="rotate(-10 70 70)">
                {/* Drop Shadow Base */}
                <ellipse cx="68" cy="115" rx="42" ry="14" fill="#065F46" fillOpacity="0.12"/>

                {/* Back Stack: 3 Emerald Coins */}
                <path d="M26 86 V92 C26 98 58 98 58 92 V86 Z" fill="url(#emSide)"/>
                <ellipse cx="42" cy="86" rx="16" ry="6" fill="url(#emTop)"/>
                <path d="M26 80 V86 C26 92 58 92 58 86 V80 Z" fill="url(#emSide)"/>
                <ellipse cx="42" cy="80" rx="16" ry="6" fill="url(#emTop)"/>
                <path d="M26 74 V80 C26 86 58 86 58 80 V74 Z" fill="url(#emSide)"/>
                <ellipse cx="42" cy="74" rx="16" ry="6" fill="url(#emTop)"/>

                {/* Right Stack: 4 Gold Coins */}
                <path d="M72 90 V96 C72 103 108 103 108 96 V90 Z" fill="url(#goldSide)"/>
                <ellipse cx="90" cy="90" rx="18" ry="7" fill="url(#goldTop)"/>
                <path d="M72 83 V89 C72 96 108 96 108 89 V83 Z" fill="url(#goldSide)"/>
                <ellipse cx="90" cy="83" rx="18" ry="7" fill="url(#goldTop)"/>
                <path d="M72 76 V82 C72 89 108 89 108 82 V76 Z" fill="url(#goldSide)"/>
                <ellipse cx="90" cy="76" rx="18" ry="7" fill="url(#goldTop)"/>
                <path d="M72 69 V75 C72 82 108 82 108 75 V69 Z" fill="url(#goldSide)"/>
                <ellipse cx="90" cy="69" rx="18" ry="7" fill="url(#goldTop)"/>

                {/* Front Showcase Coin */}
                <g transform="translate(10, 8)">
                  <path d="M38 68 C38 86 54 99 74 97 C86 96 95 88 98 76 L104 78 C100 93 89 103 74 104 C51 106 32 91 32 68 Z" fill="#B45309"/>
                  <ellipse cx="66" cy="68" rx="30" ry="32" fill="url(#shinyMedal)" stroke="#FEF3C7" strokeWidth="1.5"/>
                  <ellipse cx="66" cy="68" rx="23" ry="25" fill="#F59E0B" fillOpacity="0.15" stroke="#F59E0B" strokeWidth="1.2" strokeDasharray="3 2"/>
                  <path d="M66 52 L70 64 L82 68 L70 72 L66 84 L62 72 L50 68 L62 64 Z" fill="#D97706"/>
                  <circle cx="66" cy="68" r="4" fill="#FEF3C7"/>
                </g>
              </g>
            </svg>
          </div>
        </div>

        {/* CARD 2: TOTAL FISIK PERSEDIAAN */}
        <div className="relative overflow-hidden rounded-2xl p-4 sm:p-5 md:p-4 lg:p-5 border border-sky-200/80 bg-linear-to-br from-white via-sky-50/70 to-blue-100/60 shadow-xs hover:border-sky-300 hover:shadow-sm transition-all group">
          {/* Lapisan Gelombang Kurva SVG */}
          <svg className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-40" viewBox="0 0 400 200" fill="none" preserveAspectRatio="none">
            <path d="M-20 160 C120 120, 180 20, 420 50 L420 220 L-20 220 Z" fill="#0EA5E9" fillOpacity="0.08"/>
            <path d="M160 220 C210 110, 290 40, 420 20 L420 220 Z" fill="#0284C7" fillOpacity="0.06"/>
            <circle cx="335" cy="140" r="80" fill="#38BDF8" fillOpacity="0.08"/>
          </svg>

          {/* Konten Kiri */}
          <div className="relative z-10 flex flex-col justify-between min-h-18 md:min-h-16 lg:min-h-20">
            <div className="flex items-start justify-between gap-1.5">
              <span className="text-slate-700 font-semibold text-xs sm:text-sm md:text-xs lg:text-sm tracking-tight whitespace-nowrap">
                Total Fisik Persediaan
              </span>
              <span className="inline-flex items-center gap-1 px-2 md:px-1.5 lg:px-2.5 py-0.5 rounded-full text-[10px] md:text-[10px] lg:text-xs font-semibold border transition-colors bg-sky-100 text-sky-800 border-sky-300 shadow-xs ring-1 ring-sky-400/20 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-600" />
                <span>Siap Kirim</span>
              </span>
            </div>

            <div className="mt-2 md:mt-1.5 lg:mt-2">
              <div className="text-2xl sm:text-3xl md:text-xl lg:text-3xl xl:text-4xl font-extrabold tracking-tight text-sky-950 tabular-nums">
                {stats.persediaan.value.toLocaleString('id-ID')}
              </div>
            </div>
          </div>

          {/* Ilustrasi 3D Isometric Warehouse Pallet & Box (Kanan Bawah) */}
          <div className="absolute -right-2 -bottom-2 md:-right-2 md:-bottom-2 lg:-right-3 lg:-bottom-4 w-20 h-20 sm:w-24 sm:h-24 md:w-20 md:h-20 lg:w-28 lg:h-28 pointer-events-none transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-3">
            <svg viewBox="0 0 140 140" fill="none" className="drop-shadow-sm w-full h-full">
              <defs>
                <linearGradient id="palTop" x1="20" y1="20" x2="120" y2="90" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FFFFFF"/>
                  <stop offset="1" stopColor="#E0F2FE"/>
                </linearGradient>
                <linearGradient id="palLeft" x1="20" y1="50" x2="70" y2="130" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#BAE6FD"/>
                  <stop offset="1" stopColor="#7DD3FC"/>
                </linearGradient>
                <linearGradient id="palRight" x1="70" y1="50" x2="125" y2="130" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#E0F2FE"/>
                  <stop offset="1" stopColor="#38BDF8"/>
                </linearGradient>
                <linearGradient id="woodBase" x1="0" y1="0" x2="1" y2="0">
                  <stop stopColor="#94A3B8"/>
                  <stop offset="1" stopColor="#64748B"/>
                </linearGradient>
              </defs>
              <g transform="rotate(-14 75 75)">
                <path d="M68 96L116 116L70 134L22 114L68 96Z" fill="url(#woodBase)" fillOpacity="0.7"/>
                <path d="M22 114L70 134V138L22 118Z" fill="#475569"/>
                <path d="M116 116L70 134V138L116 120Z" fill="#334155"/>
                <path d="M70 28L114 50L70 72L26 50L70 28Z" fill="url(#palTop)"/>
                <path d="M26 50L70 72V112L26 90V50Z" fill="url(#palLeft)" fillOpacity="0.95"/>
                <path d="M114 50L70 72V112L114 90V50Z" fill="url(#palRight)" fillOpacity="0.95"/>
                <path d="M48 39L92 61V74L76 82V69L32 47L48 39Z" fill="#0284C7" fillOpacity="0.35"/>
                <path d="M26 50L70 72L114 50" stroke="#93C5FD" strokeWidth="1.5" strokeLinecap="round"/>
              </g>
            </svg>
          </div>
        </div>

        {/* CARD 3: BARANG KELUAR */}
        <div className="relative overflow-hidden rounded-2xl p-4 sm:p-5 md:p-4 lg:p-5 border border-purple-200/80 bg-linear-to-br from-white via-purple-50/70 to-violet-100/60 shadow-xs hover:border-purple-300 hover:shadow-sm transition-all group">
          {/* Lapisan Gelombang Kurva SVG */}
          <svg className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-40" viewBox="0 0 400 200" fill="none" preserveAspectRatio="none">
            <path d="M-20 120 C90 190, 240 60, 420 130 L420 220 L-20 220 Z" fill="#8B5CF6" fillOpacity="0.08"/>
            <path d="M180 -20 C240 80, 200 150, 360 220 L420 220 L420 -20 Z" fill="#7C3AED" fillOpacity="0.06"/>
            <circle cx="330" cy="145" r="82" fill="#A78BFA" fillOpacity="0.08"/>
          </svg>

          {/* Konten Kiri */}
          <div className="relative z-10 flex flex-col justify-between min-h-18 md:min-h-16 lg:min-h-20">
            <div className="flex items-start justify-between gap-1.5">
              <span className="text-slate-700 font-semibold text-xs sm:text-sm md:text-xs lg:text-sm tracking-tight whitespace-nowrap">
                Barang Keluar
              </span>
              <span className="inline-flex items-center gap-1 px-2 md:px-1.5 lg:px-2.5 py-0.5 rounded-full text-[10px] md:text-[10px] lg:text-xs font-semibold border transition-colors bg-purple-100 text-purple-800 border-purple-300 shadow-xs ring-1 ring-purple-400/20 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-600" />
                <span>Distribusi</span>
              </span>
            </div>

            <div className="mt-2 md:mt-1.5 lg:mt-2">
              <div className="text-2xl sm:text-3xl md:text-xl lg:text-3xl xl:text-4xl font-extrabold tracking-tight text-purple-950 tabular-nums">
                {stats.barangKeluar.value}
              </div>
            </div>
          </div>

          {/* Ilustrasi 3D Isometric Logistics Outbound Cargo (Kanan Bawah) */}
          <div className="absolute -right-2 -bottom-2 md:-right-2 md:-bottom-2 lg:-right-3 lg:-bottom-4 w-20 h-20 sm:w-24 sm:h-24 md:w-20 md:h-20 lg:w-28 lg:h-28 pointer-events-none transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-3">
            <svg viewBox="0 0 140 140" fill="none" className="drop-shadow-sm w-full h-full">
              <defs>
                <linearGradient id="truckTop" x1="20" y1="20" x2="120" y2="90" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FFFFFF"/>
                  <stop offset="1" stopColor="#EDE9FE"/>
                </linearGradient>
                <linearGradient id="truckLeft" x1="20" y1="50" x2="70" y2="130" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#DDD6FE"/>
                  <stop offset="1" stopColor="#A78BFA"/>
                </linearGradient>
                <linearGradient id="truckRight" x1="70" y1="50" x2="125" y2="130" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#EDE9FE"/>
                  <stop offset="1" stopColor="#8B5CF6"/>
                </linearGradient>
              </defs>
              <g transform="rotate(-12 75 75)">
                <path d="M70 24L118 48L70 72L22 48L70 24Z" fill="url(#truckTop)"/>
                <path d="M22 48L70 72V122L22 98V48Z" fill="url(#truckLeft)" fillOpacity="0.95"/>
                <path d="M118 48L70 72V122L118 98V48Z" fill="url(#truckRight)" fillOpacity="0.95"/>
                <path d="M84 56L102 65L96 74L78 65Z" fill="#7C3AED" fillOpacity="0.4"/>
                <path d="M22 48L70 72L118 48" stroke="#C4B5FD" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M60 92L78 80L78 86L94 86L94 74L100 74L100 92L78 92L78 98Z" fill="#FFFFFF" fillOpacity="0.9"/>
              </g>
            </svg>
          </div>
        </div>

      </div>
    </div>
  );
}
