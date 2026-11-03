// src/features/inventory/components/InventoryStatCards.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { Info } from 'lucide-react';
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
  const [activeTooltip, setActiveTooltip] = useState<'sku' | 'low' | 'empty' | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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

  const isAllActive = !selectedStatus;
  const isLowActive = selectedStatus === 'low';
  const isEmptyActive = selectedStatus === 'empty';

  return (
    <div 
      ref={containerRef}
      className="relative z-30 grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-4 select-none"
    >
      {/* CARD 1: TOTAL KATALOG SKU */}
      <div 
        onClick={() => onStatusChange('')}
        className={`relative bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-xs transition-all flex flex-col justify-between cursor-pointer border ${
          isAllActive 
            ? 'border-blue-400/80 bg-blue-50/10 ring-1 ring-blue-400/20' 
            : 'border-slate-200/80 hover:border-slate-300'
        }`}
      >
        {/* Top Header: Title & Info Button */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-medium text-slate-600 tracking-tight truncate">
            Total Katalog SKU
          </span>
          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveTooltip((prev) => (prev === 'sku' ? null : 'sku'));
              }}
              onMouseEnter={() => setActiveTooltip('sku')}
              onMouseLeave={() => setActiveTooltip(null)}
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border flex items-center justify-center transition-all shrink-0 cursor-pointer ${
                activeTooltip === 'sku'
                  ? 'bg-slate-100 border-slate-300 text-slate-900 shadow-2xs'
                  : 'border-slate-200/90 text-slate-400 hover:text-slate-800 hover:border-slate-300 hover:bg-slate-50'
              }`}
              title="Penjelasan Total Katalog SKU"
              aria-label="Info Total Katalog SKU"
            >
              <Info size={14} />
            </button>

            {/* FLOATING CARD: LIGHT MONOCHROME GLASS */}
            {activeTooltip === 'sku' && (
              <div 
                onMouseEnter={() => setActiveTooltip('sku')}
                onMouseLeave={() => setActiveTooltip(null)}
                className="absolute right-0 top-9 sm:top-10 w-68 sm:w-72 bg-white/95 backdrop-blur-md text-slate-800 p-3.5 rounded-xl sm:rounded-2xl shadow-xl shadow-slate-900/10 border border-slate-200/90 text-xs z-50 pointer-events-auto animate-in fade-in zoom-in-95 duration-150 select-text"
                role="tooltip"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100">
                  <span className="font-medium text-slate-900 text-xs">Total Katalog SKU</span>
                  <span className="text-3xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-mono border border-slate-200/70">
                    MASTER DATA
                  </span>
                </div>
                <p className="mt-2 text-slate-600 text-2xs leading-relaxed font-normal">
                  Jumlah seluruh varian suku cadang unik (Stock Keeping Unit) yang terdaftar aktif dalam katalog persediaan gudang.
                </p>
                <div className="mt-2.5 p-2 rounded-lg bg-slate-50/90 border border-slate-200/80">
                  <span className="text-3xs text-slate-400 font-normal uppercase tracking-wider block">
                    Keterangan:
                  </span>
                  <code className="text-2xs text-slate-800 font-mono font-medium block mt-0.5">
                    Count (Unique Item SKU)
                  </code>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Body: Value on left, Waveform on right */}
        <div className="mt-4 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-medium text-slate-900 tabular-nums">
                {stats.totalSku.toLocaleString('id-ID')}
              </span>
              <span className={`text-xs font-medium select-none ${stats.totalSku > 0 ? 'text-blue-600' : 'text-slate-300'}`}>
                ●
              </span>
            </div>
            <div className="mt-1 flex flex-col">
              <span className={`text-xs font-medium ${stats.totalSku > 0 ? 'text-blue-700' : 'text-slate-500'}`}>
                Varian SKU
              </span>
              <span className="text-xs text-slate-400 font-normal">
                katalog persediaan
              </span>
            </div>
          </div>

          {/* Mini Waveform Sparkline */}
          <div className="flex items-end gap-1 sm:gap-1.5 h-10 sm:h-11 pb-0.5" aria-hidden="true">
            <span className="w-2 sm:w-2.5 rounded-full bg-slate-100 h-3" />
            <span className="w-2 sm:w-2.5 rounded-full bg-slate-100 h-6" />
            <span className="w-2 sm:w-2.5 rounded-full bg-slate-100 h-5" />
            <span className={`w-2 sm:w-2.5 rounded-full ${stats.totalSku > 0 ? 'bg-[#2E82F6]' : 'bg-slate-200'} h-10`} />
            <span className="w-2 sm:w-2.5 rounded-full bg-slate-100 h-7" />
            <span className="w-2 sm:w-2.5 rounded-full bg-slate-100 h-4" />
          </div>
        </div>
      </div>

      {/* CARD 2: STOK MENIPIS (< 5) */}
      <div 
        onClick={() => onStatusChange(isLowActive ? '' : 'low')}
        className={`relative bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-xs transition-all flex flex-col justify-between cursor-pointer border ${
          isLowActive 
            ? 'border-amber-400/80 bg-amber-50/10 ring-1 ring-amber-400/20' 
            : 'border-slate-200/80 hover:border-slate-300'
        }`}
      >
        {/* Top Header: Title & Info Button */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-medium text-slate-600 tracking-tight truncate">
            Stok Menipis (&lt; 5)
          </span>
          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveTooltip((prev) => (prev === 'low' ? null : 'low'));
              }}
              onMouseEnter={() => setActiveTooltip('low')}
              onMouseLeave={() => setActiveTooltip(null)}
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border flex items-center justify-center transition-all shrink-0 cursor-pointer ${
                activeTooltip === 'low'
                  ? 'bg-slate-100 border-slate-300 text-slate-900 shadow-2xs'
                  : 'border-slate-200/90 text-slate-400 hover:text-slate-800 hover:border-slate-300 hover:bg-slate-50'
              }`}
              title="Penjelasan Stok Menipis"
              aria-label="Info Stok Menipis"
            >
              <Info size={14} />
            </button>

            {/* FLOATING CARD: LIGHT MONOCHROME GLASS */}
            {activeTooltip === 'low' && (
              <div 
                onMouseEnter={() => setActiveTooltip('low')}
                onMouseLeave={() => setActiveTooltip(null)}
                className="absolute right-0 top-9 sm:top-10 w-68 sm:w-72 bg-white/95 backdrop-blur-md text-slate-800 p-3.5 rounded-xl sm:rounded-2xl shadow-xl shadow-slate-900/10 border border-slate-200/90 text-xs z-50 pointer-events-auto animate-in fade-in zoom-in-95 duration-150 select-text"
                role="tooltip"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100">
                  <span className="font-medium text-slate-900 text-xs">Stok Menipis (&lt; 5)</span>
                  <span className="text-3xs px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 font-mono border border-amber-200/70">
                    PERINGATAN
                  </span>
                </div>
                <p className="mt-2 text-slate-600 text-2xs leading-relaxed font-normal">
                  Suku cadang dengan sisa stok fisik di bawah batas minimum (kurang dari 5 unit). Disarankan segera melakukan restock pemesanan ke supplier.
                </p>
                <div className="mt-2.5 p-2 rounded-lg bg-slate-50/90 border border-slate-200/80">
                  <span className="text-3xs text-slate-400 font-normal uppercase tracking-wider block">
                    Kriteria:
                  </span>
                  <code className="text-2xs text-slate-800 font-mono font-medium block mt-0.5">
                    1 ≤ Sisa Fisik &lt; 5 Unit
                  </code>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Body: Value on left, Waveform on right */}
        <div className="mt-4 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-medium text-slate-900 tabular-nums">
                {stats.lowStock.toLocaleString('id-ID')}
              </span>
              <span className={`text-xs font-medium select-none ${stats.lowStock > 0 ? 'text-amber-500' : 'text-slate-300'}`}>
                ▲
              </span>
            </div>
            <div className="mt-1 flex flex-col">
              <span className={`text-xs font-medium ${stats.lowStock > 0 ? 'text-amber-700' : 'text-slate-500'}`}>
                Perlu Restock
              </span>
              <span className="text-xs text-slate-400 font-normal">
                di bawah ambang batas
              </span>
            </div>
          </div>

          {/* Mini Waveform Sparkline */}
          <div className="flex items-end gap-1 sm:gap-1.5 h-10 sm:h-11 pb-0.5" aria-hidden="true">
            <span className="w-2 sm:w-2.5 rounded-full bg-slate-100 h-4" />
            <span className="w-2 sm:w-2.5 rounded-full bg-slate-100 h-5" />
            <span className={`w-2 sm:w-2.5 rounded-full ${stats.lowStock > 0 ? 'bg-amber-400' : 'bg-slate-200'} h-10`} />
            <span className="w-2 sm:w-2.5 rounded-full bg-slate-100 h-6" />
            <span className="w-2 sm:w-2.5 rounded-full bg-slate-100 h-4" />
            <span className="w-2 sm:w-2.5 rounded-full bg-slate-100 h-3" />
          </div>
        </div>
      </div>

      {/* CARD 3: STOK HABIS (0) */}
      <div 
        onClick={() => onStatusChange(isEmptyActive ? '' : 'empty')}
        className={`relative bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-xs transition-all flex flex-col justify-between cursor-pointer border ${
          isEmptyActive 
            ? 'border-rose-400/80 bg-rose-50/10 ring-1 ring-rose-400/20' 
            : 'border-slate-200/80 hover:border-slate-300'
        }`}
      >
        {/* Top Header: Title & Info Button */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-medium text-slate-600 tracking-tight truncate">
            Stok Habis (0)
          </span>
          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveTooltip((prev) => (prev === 'empty' ? null : 'empty'));
              }}
              onMouseEnter={() => setActiveTooltip('empty')}
              onMouseLeave={() => setActiveTooltip(null)}
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border flex items-center justify-center transition-all shrink-0 cursor-pointer ${
                activeTooltip === 'empty'
                  ? 'bg-slate-100 border-slate-300 text-slate-900 shadow-2xs'
                  : 'border-slate-200/90 text-slate-400 hover:text-slate-800 hover:border-slate-300 hover:bg-slate-50'
              }`}
              title="Penjelasan Stok Habis"
              aria-label="Info Stok Habis"
            >
              <Info size={14} />
            </button>

            {/* FLOATING CARD: LIGHT MONOCHROME GLASS */}
            {activeTooltip === 'empty' && (
              <div 
                onMouseEnter={() => setActiveTooltip('empty')}
                onMouseLeave={() => setActiveTooltip(null)}
                className="absolute right-0 top-9 sm:top-10 w-68 sm:w-72 bg-white/95 backdrop-blur-md text-slate-800 p-3.5 rounded-xl sm:rounded-2xl shadow-xl shadow-slate-900/10 border border-slate-200/90 text-xs z-50 pointer-events-auto animate-in fade-in zoom-in-95 duration-150 select-text"
                role="tooltip"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100">
                  <span className="font-medium text-slate-900 text-xs">Stok Habis (0)</span>
                  <span className="text-3xs px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 font-mono border border-rose-200/70">
                    KRITIS
                  </span>
                </div>
                <p className="mt-2 text-slate-600 text-2xs leading-relaxed font-normal">
                  Suku cadang dengan sisa persediaan fisik 0 unit di gudang. Tidak dapat dikeluarkan sebelum ada penerimaan barang baru.
                </p>
                <div className="mt-2.5 p-2 rounded-lg bg-slate-50/90 border border-slate-200/80">
                  <span className="text-3xs text-slate-400 font-normal uppercase tracking-wider block">
                    Kriteria:
                  </span>
                  <code className="text-2xs text-slate-800 font-mono font-medium block mt-0.5">
                    Sisa Fisik = 0 Unit
                  </code>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Body: Value on left, Waveform on right */}
        <div className="mt-4 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-medium text-slate-900 tabular-nums">
                {stats.emptyStock.toLocaleString('id-ID')}
              </span>
              <span className={`text-xs font-medium select-none ${stats.emptyStock > 0 ? 'text-rose-500' : 'text-slate-300'}`}>
                ●
              </span>
            </div>
            <div className="mt-1 flex flex-col">
              <span className={`text-xs font-medium ${stats.emptyStock > 0 ? 'text-rose-700' : 'text-slate-500'}`}>
                Stok Kosong
              </span>
              <span className="text-xs text-slate-400 font-normal">
                ketersediaan nol
              </span>
            </div>
          </div>

          {/* Mini Waveform Sparkline */}
          <div className="flex items-end gap-1 sm:gap-1.5 h-10 sm:h-11 pb-0.5" aria-hidden="true">
            <span className="w-2 sm:w-2.5 rounded-full bg-slate-100 h-3" />
            <span className="w-2 sm:w-2.5 rounded-full bg-slate-100 h-4" />
            <span className={`w-2 sm:w-2.5 rounded-full ${stats.emptyStock > 0 ? 'bg-rose-500' : 'bg-slate-200'} h-10`} />
            <span className="w-2 sm:w-2.5 rounded-full bg-slate-100 h-5" />
            <span className="w-2 sm:w-2.5 rounded-full bg-slate-100 h-4" />
            <span className="w-2 sm:w-2.5 rounded-full bg-slate-100 h-3" />
          </div>
        </div>
      </div>
    </div>
  );
}
