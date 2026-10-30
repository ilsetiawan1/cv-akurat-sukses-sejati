// src/features/inventory/components/InventoryStatCards.tsx
'use client';

import { Boxes, AlertTriangle, PackageX } from 'lucide-react';
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
    <div className="flex md:grid md:grid-cols-3 gap-2.5 lg:gap-4 overflow-x-auto md:overflow-visible pb-1 md:pb-0 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden select-none">
      {/* CARD 1: TOTAL KATALOG SKU */}
      <div 
        onClick={() => onStatusChange('')}
        className={`w-[210px] md:w-auto shrink-0 snap-start relative overflow-hidden rounded-xl md:rounded-2xl p-3 md:p-4 lg:p-5 transition-all duration-300 cursor-pointer group border shadow-xs ${
          !selectedStatus 
            ? 'bg-linear-to-br from-white via-blue-50/70 to-blue-100/50 border-blue-300 ring-2 ring-blue-500/20' 
            : 'bg-linear-to-br from-white via-slate-50 to-blue-50/40 border-slate-200/80 hover:border-blue-200/80 hover:shadow-xs'
        }`}
      >
        <svg className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-30" viewBox="0 0 400 200" fill="none" preserveAspectRatio="none">
          <path d="M-20 140 C100 60, 240 200, 420 80 L420 220 L-20 220 Z" fill="#3B82F6" fillOpacity="0.08"/>
          <path d="M140 -20 C220 90, 120 160, 280 220 L420 220 L420 -20 Z" fill="#2563EB" fillOpacity="0.06"/>
          <circle cx="330" cy="145" r="85" fill="#60A5FA" fillOpacity="0.08"/>
        </svg>

        <div className="relative z-10 flex flex-col justify-between">
          <div className="flex items-center justify-between gap-1.5">
            <span className="text-slate-600 font-medium text-xs sm:text-sm tracking-tight truncate">
              Total Katalog SKU
            </span>
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-blue-100/80 text-blue-700 flex items-center justify-center shrink-0 border border-blue-200/70 shadow-2xs">
              <Boxes size={13} />
            </div>
          </div>

          <div className="mt-2 sm:mt-2.5 flex items-baseline gap-1.5">
            <span className="text-lg sm:text-2xl lg:text-3xl font-medium text-slate-900 tabular-nums">
              {stats.totalSku.toLocaleString('id-ID')}
            </span>
            <span className="text-xs text-slate-400 font-normal">item SKU</span>
          </div>
        </div>
      </div>

      {/* CARD 2: STOK MENIPIS (< 5) */}
      <div 
        onClick={() => onStatusChange(selectedStatus === 'low' ? '' : 'low')}
        className={`w-[210px] md:w-auto shrink-0 snap-start relative overflow-hidden rounded-xl md:rounded-2xl p-3 md:p-4 lg:p-5 transition-all duration-300 cursor-pointer group border shadow-xs ${
          selectedStatus === 'low'
            ? 'bg-linear-to-br from-white via-amber-50 to-amber-100/60 border-amber-300 ring-2 ring-amber-500/20'
            : 'bg-linear-to-br from-white via-slate-50 to-amber-50/40 border-slate-200/80 hover:border-amber-200/80 hover:shadow-xs'
        }`}
      >
        <svg className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-30" viewBox="0 0 400 200" fill="none" preserveAspectRatio="none">
          <path d="M-20 160 C120 120, 180 20, 420 50 L420 220 L-20 220 Z" fill="#F59E0B" fillOpacity="0.08"/>
          <circle cx="335" cy="140" r="80" fill="#FBBF24" fillOpacity="0.08"/>
        </svg>

        <div className="relative z-10 flex flex-col justify-between">
          <div className="flex items-center justify-between gap-1.5">
            <span className="text-slate-600 font-medium text-xs sm:text-sm tracking-tight truncate">
              Stok Menipis (&lt; 5)
            </span>
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-amber-100/80 text-amber-800 flex items-center justify-center shrink-0 border border-amber-200/70 shadow-2xs">
              <AlertTriangle size={13} />
            </div>
          </div>

          <div className="mt-2 sm:mt-2.5 flex items-baseline gap-1.5">
            <span className="text-lg sm:text-2xl lg:text-3xl font-medium text-amber-700 tabular-nums">
              {stats.lowStock.toLocaleString('id-ID')}
            </span>
            <span className="text-xs text-amber-600/80 font-normal">perlu restock</span>
          </div>
        </div>
      </div>

      {/* CARD 3: STOK HABIS (0) */}
      <div 
        onClick={() => onStatusChange(selectedStatus === 'empty' ? '' : 'empty')}
        className={`w-[210px] md:w-auto shrink-0 snap-start relative overflow-hidden rounded-xl md:rounded-2xl p-3 md:p-4 lg:p-5 transition-all duration-300 cursor-pointer group border shadow-xs ${
          selectedStatus === 'empty'
            ? 'bg-linear-to-br from-white via-rose-50 to-rose-100/60 border-rose-300 ring-2 ring-rose-500/20'
            : 'bg-linear-to-br from-white via-slate-50 to-rose-50/40 border-slate-200/80 hover:border-rose-200/80 hover:shadow-xs'
        }`}
      >
        <svg className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-30" viewBox="0 0 400 200" fill="none" preserveAspectRatio="none">
          <path d="M-20 120 C90 190, 240 60, 420 130 L420 220 L-20 220 Z" fill="#F43F5E" fillOpacity="0.08"/>
          <circle cx="330" cy="145" r="82" fill="#FB7185" fillOpacity="0.08"/>
        </svg>

        <div className="relative z-10 flex flex-col justify-between">
          <div className="flex items-center justify-between gap-1.5">
            <span className="text-slate-600 font-medium text-xs sm:text-sm tracking-tight truncate">
              Stok Habis (0)
            </span>
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-rose-100/80 text-rose-800 flex items-center justify-center shrink-0 border border-rose-200/70 shadow-2xs">
              <PackageX size={13} />
            </div>
          </div>

          <div className="mt-2 sm:mt-2.5 flex items-baseline gap-1.5">
            <span className="text-lg sm:text-2xl lg:text-3xl font-medium text-rose-700 tabular-nums">
              {stats.emptyStock.toLocaleString('id-ID')}
            </span>
            <span className="text-xs text-rose-600/80 font-normal">stok habis</span>
          </div>
        </div>
      </div>
    </div>
  );
}
