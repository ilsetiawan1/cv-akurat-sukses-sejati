// src/features/inventory/components/InventoryStatCards.tsx
'use client';

import type { InventoryStats } from '../types/inventory.types';

export interface InventoryStatCardsProps {
  stats: InventoryStats;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
}

export default function InventoryStatCards({
  stats,
  selectedStatus,
  onStatusChange,
}: InventoryStatCardsProps) {
  return (
    <div className="hidden md:grid md:grid-cols-3 gap-4 lg:gap-5 select-none">
      {/* CARD 1: TOTAL KATALOG SKU */}
      <div 
        onClick={() => onStatusChange('')}
        className={`relative overflow-hidden rounded-2xl p-5 transition-all duration-300 cursor-pointer group border shadow-xs ${
          !selectedStatus 
            ? 'bg-linear-to-br from-white via-blue-50/70 to-blue-100/60 border-blue-200/80 ring-2 ring-blue-500/20' 
            : 'bg-linear-to-br from-white via-slate-50 to-blue-50/40 border-slate-200/80 hover:border-blue-200 hover:shadow-sm'
        }`}
      >
        {/* Lapisan Gelombang Kurva SVG */}
        <svg className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-40" viewBox="0 0 400 200" fill="none" preserveAspectRatio="none">
          <path d="M-20 140 C100 60, 240 200, 420 80 L420 220 L-20 220 Z" fill="#3B82F6" fillOpacity="0.08"/>
          <path d="M140 -20 C220 90, 120 160, 280 220 L420 220 L420 -20 Z" fill="#2563EB" fillOpacity="0.06"/>
          <circle cx="330" cy="145" r="85" fill="#60A5FA" fillOpacity="0.08"/>
        </svg>


        {/* Konten Kiri */}
        <div className="relative z-10 flex flex-col justify-between min-h-20">
          <div className="flex items-start justify-between gap-2">
            <span className="text-slate-700 font-semibold text-sm tracking-tight">
              Total Katalog SKU
            </span>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-colors ${
              !selectedStatus
                ? 'bg-blue-100 text-blue-700 border-blue-300 shadow-xs ring-1 ring-blue-400/20'
                : 'bg-slate-100 text-slate-500 border-slate-200'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${
                !selectedStatus ? 'bg-blue-600' : 'bg-slate-400'
              }`} />
              <span>Semua</span>
            </span>
          </div>

          <div className="mt-2">
            <div className="text-3xl md:text-4xl font-extrabold tracking-tight text-blue-900 tabular-nums">
              {stats.totalSku}
            </div>
          </div>
        </div>

        {/* Ilustrasi 3D Isometric Box (Kanan Bawah) */}
        <div className="absolute -right-3 -bottom-4 w-28 h-28 pointer-events-none transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-3">
          <svg viewBox="0 0 140 140" fill="none" className="drop-shadow-sm">
            <defs>
              <linearGradient id="boxTop" x1="20" y1="20" x2="120" y2="90" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FFFFFF"/>
                <stop offset="1" stopColor="#E0F2FE"/>
              </linearGradient>
              <linearGradient id="boxLeft" x1="20" y1="50" x2="70" y2="130" gradientUnits="userSpaceOnUse">
                <stop stopColor="#BAE6FD"/>
                <stop offset="1" stopColor="#7DD3FC"/>
              </linearGradient>
              <linearGradient id="boxRight" x1="70" y1="50" x2="125" y2="130" gradientUnits="userSpaceOnUse">
                <stop stopColor="#E0F2FE"/>
                <stop offset="1" stopColor="#38BDF8"/>
              </linearGradient>
            </defs>
            <g transform="rotate(-14 75 75)">
              <path d="M70 24L118 48L70 72L22 48L70 24Z" fill="url(#boxTop)"/>
              <path d="M22 48L70 72V124L22 100V48Z" fill="url(#boxLeft)" fillOpacity="0.92"/>
              <path d="M118 48L70 72V124L118 100V48Z" fill="url(#boxRight)" fillOpacity="0.95"/>
              <path d="M44 37L92 61V78L76 86V68L28 44L44 37Z" fill="#2563EB" fillOpacity="0.3"/>
              <path d="M22 48L70 72L118 48" stroke="#93C5FD" strokeWidth="1.5" strokeLinecap="round"/>
            </g>
          </svg>
        </div>
      </div>

      {/* CARD 2: STOK MENIPIS (< 5) */}
      <div 
        onClick={() => onStatusChange(selectedStatus === 'low' ? '' : 'low')}
        className={`relative overflow-hidden rounded-2xl p-5 transition-all duration-300 cursor-pointer group border shadow-xs ${
          selectedStatus === 'low'
            ? 'bg-linear-to-br from-white via-amber-50 to-amber-100/70 border-amber-300 ring-2 ring-amber-400/30 shadow-md'
            : 'bg-linear-to-br from-white via-slate-50 to-amber-50/40 border-slate-200/80 hover:border-amber-200 hover:shadow-sm'
        }`}
      >
        {/* Lapisan Gelombang Kurva SVG */}
        <svg className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-40" viewBox="0 0 400 200" fill="none" preserveAspectRatio="none">
          <path d="M-20 160 C120 120, 180 20, 420 50 L420 220 L-20 220 Z" fill="#F59E0B" fillOpacity="0.08"/>
          <path d="M160 220 C210 110, 290 40, 420 20 L420 220 Z" fill="#D97706" fillOpacity="0.06"/>
          <circle cx="335" cy="140" r="80" fill="#FBBF24" fillOpacity="0.08"/>
        </svg>


        {/* Konten Kiri */}
        <div className="relative z-10 flex flex-col justify-between min-h-20">
          <div className="flex items-start justify-between gap-2">
            <span className="text-slate-700 font-semibold text-sm tracking-tight">
              Stok Menipis (&lt; 5)
            </span>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-colors ${
              selectedStatus === 'low'
                ? 'bg-amber-100 text-amber-800 border-amber-300 shadow-xs ring-1 ring-amber-400/20'
                : 'bg-slate-100 text-slate-500 border-slate-200'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${
                selectedStatus === 'low' ? 'bg-amber-600 animate-pulse' : 'bg-slate-400'
              }`} />
              <span>Perlu Order</span>
            </span>
          </div>

          <div className="mt-2">
            <div className="text-3xl md:text-4xl font-extrabold tracking-tight text-amber-800 tabular-nums">
              {stats.lowStock}
            </div>
          </div>
        </div>

        {/* Ilustrasi 3D Warning Triangle (Kanan Bawah) */}
        <div className="absolute -right-3 -bottom-4 w-28 h-28 pointer-events-none transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-3">
          <svg viewBox="0 0 140 140" fill="none" className="drop-shadow-sm">
            <defs>
              <linearGradient id="warnGrad" x1="30" y1="20" x2="115" y2="125" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FFFFFF"/>
                <stop offset="0.6" stopColor="#FEF3C7"/>
                <stop offset="1" stopColor="#FDE68A"/>
              </linearGradient>
              <linearGradient id="warnInner" x1="50" y1="45" x2="95" y2="110" gradientUnits="userSpaceOnUse">
                <stop stopColor="#F59E0B"/>
                <stop offset="1" stopColor="#EA580C"/>
              </linearGradient>
            </defs>
            <g transform="rotate(-16 75 75)">
              <path d="M64 30C68.5 22 80 22 84.5 30L122 96C126.5 104 120.7 114 111.5 114H36.5C27.3 114 21.5 104 26 96L64 30Z" fill="#FDE68A" fillOpacity="0.4" transform="translate(4, 5)"/>
              <path d="M64 30C68.5 22 80 22 84.5 30L122 96C126.5 104 120.7 114 111.5 114H36.5C27.3 114 21.5 104 26 96L64 30Z" fill="url(#warnGrad)"/>
              <rect x="69.5" y="52" width="9" height="26" rx="4.5" fill="url(#warnInner)"/>
              <circle cx="74" cy="91" r="5" fill="url(#warnInner)"/>
            </g>
          </svg>
        </div>
      </div>

      {/* CARD 3: STOK HABIS (0) */}
      <div 
        onClick={() => onStatusChange(selectedStatus === 'empty' ? '' : 'empty')}
        className={`relative overflow-hidden rounded-2xl p-5 transition-all duration-300 cursor-pointer group border shadow-xs ${
          selectedStatus === 'empty'
            ? 'bg-linear-to-br from-white via-rose-50 to-rose-100/70 border-rose-300 ring-2 ring-rose-400/30 shadow-md'
            : 'bg-linear-to-br from-white via-slate-50 to-rose-50/40 border-slate-200/80 hover:border-rose-200 hover:shadow-sm'
        }`}
      >
        {/* Lapisan Gelombang Kurva SVG */}
        <svg className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-40" viewBox="0 0 400 200" fill="none" preserveAspectRatio="none">
          <path d="M-20 120 C90 190, 240 60, 420 130 L420 220 L-20 220 Z" fill="#F43F5E" fillOpacity="0.08"/>
          <path d="M180 -20 C240 80, 200 150, 360 220 L420 220 L420 -20 Z" fill="#E11D48" fillOpacity="0.06"/>
          <circle cx="330" cy="145" r="82" fill="#FB7185" fillOpacity="0.08"/>
        </svg>


        {/* Konten Kiri */}
        <div className="relative z-10 flex flex-col justify-between min-h-20">
          <div className="flex items-start justify-between gap-2">
            <span className="text-slate-700 font-semibold text-sm tracking-tight">
              Stok Habis (0)
            </span>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-colors ${
              selectedStatus === 'empty'
                ? 'bg-rose-100 text-rose-800 border-rose-300 shadow-xs ring-1 ring-rose-400/20'
                : 'bg-slate-100 text-slate-500 border-slate-200'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${
                selectedStatus === 'empty' ? 'bg-rose-600' : 'bg-slate-400'
              }`} />
              <span>Habis Total</span>
            </span>
          </div>

          <div className="mt-2">
            <div className="text-3xl md:text-4xl font-extrabold tracking-tight text-rose-800 tabular-nums">
              {stats.emptyStock}
            </div>
          </div>
        </div>

        {/* Ilustrasi 3D Glossy Cross Disc (Kanan Bawah) */}
        <div className="absolute -right-3 -bottom-4 w-28 h-28 pointer-events-none transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-3">
          <svg viewBox="0 0 140 140" fill="none" className="drop-shadow-sm">
            <defs>
              <linearGradient id="discGrad" x1="25" y1="25" x2="115" y2="115" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FFFFFF"/>
                <stop offset="0.65" stopColor="#FFE4E6"/>
                <stop offset="1" stopColor="#FECDD3"/>
              </linearGradient>
              <linearGradient id="crossGrad" x1="50" y1="50" x2="95" y2="95" gradientUnits="userSpaceOnUse">
                <stop stopColor="#F43F5E"/>
                <stop offset="1" stopColor="#E11D48"/>
              </linearGradient>
            </defs>
            <g transform="rotate(-12 75 75)">
              <circle cx="78" cy="78" r="44" fill="#FECDD3" fillOpacity="0.4"/>
              <circle cx="73" cy="73" r="44" fill="url(#discGrad)"/>
              <circle cx="73" cy="73" r="32" stroke="#FDA4AF" strokeWidth="1.5" strokeOpacity="0.4"/>
              <path d="M62 62L84 84M84 62L62 84" stroke="url(#crossGrad)" strokeWidth="8" strokeLinecap="round"/>
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}
