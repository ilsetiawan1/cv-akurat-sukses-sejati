// src/features/reports/components/ReportStatCards.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { Info } from 'lucide-react';
import type { ReportSummary } from '../types/report.types';

export interface ReportStatCardsProps {
  summary: ReportSummary;
}

export default function ReportStatCards({ summary }: ReportStatCardsProps) {
  const [activeTooltip, setActiveTooltip] = useState<'incoming' | 'outgoing' | 'margin' | null>(null);
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

  const hasIncoming = summary.totalIncomingValue > 0;
  const hasOutgoing = summary.totalOutgoingValue > 0;
  const isMarginNonZero = summary.margin !== 0;

  return (
    <div 
      ref={containerRef}
      className="relative z-30 grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-4 select-none print:hidden print-hide-all"
    >
      {/* CARD 1: TOTAL NILAI MASUK (ASET) */}
      <div className="relative bg-white border border-slate-200/80 rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
        {/* Top Header */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-medium text-slate-600 tracking-tight truncate">
            Total Nilai Masuk (Aset)
          </span>
          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveTooltip((prev) => (prev === 'incoming' ? null : 'incoming'));
              }}
              onMouseEnter={() => setActiveTooltip('incoming')}
              onMouseLeave={() => setActiveTooltip(null)}
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border flex items-center justify-center transition-all shrink-0 cursor-pointer ${
                activeTooltip === 'incoming'
                  ? 'bg-slate-100 border-slate-300 text-slate-900 shadow-2xs'
                  : 'border-slate-200/90 text-slate-400 hover:text-slate-800 hover:border-slate-300 hover:bg-slate-50'
              }`}
              title="Penjelasan & rumus Total Nilai Masuk"
              aria-label="Info Total Nilai Masuk"
            >
              <Info size={14} />
            </button>

            {/* FLOATING CARD: LIGHT MONOCHROME GLASS */}
            {activeTooltip === 'incoming' && (
              <div 
                onMouseEnter={() => setActiveTooltip('incoming')}
                onMouseLeave={() => setActiveTooltip(null)}
                className="absolute right-0 top-9 sm:top-10 w-68 sm:w-72 bg-white/95 backdrop-blur-md text-slate-800 p-3.5 rounded-xl sm:rounded-2xl shadow-xl shadow-slate-900/10 border border-slate-200/90 text-xs z-50 pointer-events-auto animate-in fade-in zoom-in-95 duration-150 select-text"
                role="tooltip"
              >
                <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100">
                  <span className="font-medium text-slate-900 text-xs">Total Nilai Masuk</span>
                  <span className="text-3xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-mono border border-slate-200/70">
                    PENGADAAN
                  </span>
                </div>
                <p className="mt-2 text-slate-600 text-2xs leading-relaxed font-normal">
                  Akumulasi seluruh nilai perolehan finansial suku cadang yang masuk ke persediaan gudang dari supplier pada periode terpilih.
                </p>
                <div className="mt-2.5 p-2 rounded-lg bg-slate-50/90 border border-slate-200/80">
                  <span className="text-3xs text-slate-400 font-normal uppercase tracking-wider block">
                    Rumus Perhitungan:
                  </span>
                  <code className="text-2xs text-slate-800 font-mono font-medium block mt-0.5">
                    Σ (Qty Masuk × Harga Beli)
                  </code>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Body: Value on left, Waveform on right */}
        <div className="mt-4 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline whitespace-nowrap">
              <span className="text-xs font-normal text-slate-400 mr-1">Rp</span>
              <span className="text-xl sm:text-2xl font-medium text-slate-900 tabular-nums">
                {summary.totalIncomingValue.toLocaleString('id-ID')}
              </span>
              <span className={`text-xs font-medium ml-1.5 select-none ${hasIncoming ? 'text-emerald-500' : 'text-slate-300'}`}>
                ▲
              </span>
            </div>
            <div className="mt-1 flex flex-col">
              <span className={`text-xs font-medium ${hasIncoming ? 'text-emerald-600' : 'text-slate-500'}`}>
                Aset Masuk
              </span>
              <span className="text-xs text-slate-400 font-normal">
                penerimaan gudang
              </span>
            </div>
          </div>

          {/* Mini Waveform Sparkline */}
          <div className="flex items-end gap-1 sm:gap-1.5 h-10 sm:h-11 pb-0.5" aria-hidden="true">
            <span className="w-2 sm:w-2.5 rounded-full bg-slate-100 h-3.5" />
            <span className="w-2 sm:w-2.5 rounded-full bg-slate-100 h-6" />
            <span className="w-2 sm:w-2.5 rounded-full bg-slate-100 h-5" />
            <span className={`w-2 sm:w-2.5 rounded-full ${hasIncoming ? 'bg-[#2E82F6]' : 'bg-slate-200'} h-10`} />
            <span className="w-2 sm:w-2.5 rounded-full bg-slate-100 h-7" />
            <span className="w-2 sm:w-2.5 rounded-full bg-slate-100 h-4" />
          </div>
        </div>
      </div>

      {/* CARD 2: TOTAL HPP KELUAR (BEBAN) */}
      <div className="relative bg-white border border-slate-200/80 rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
        {/* Top Header */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-medium text-slate-600 tracking-tight truncate">
            Total HPP Keluar (Beban)
          </span>
          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveTooltip((prev) => (prev === 'outgoing' ? null : 'outgoing'));
              }}
              onMouseEnter={() => setActiveTooltip('outgoing')}
              onMouseLeave={() => setActiveTooltip(null)}
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border flex items-center justify-center transition-all shrink-0 cursor-pointer ${
                activeTooltip === 'outgoing'
                  ? 'bg-slate-100 border-slate-300 text-slate-900 shadow-2xs'
                  : 'border-slate-200/90 text-slate-400 hover:text-slate-800 hover:border-slate-300 hover:bg-slate-50'
              }`}
              title="Penjelasan & rumus Total HPP Keluar"
              aria-label="Info Total HPP Keluar"
            >
              <Info size={14} />
            </button>

            {/* FLOATING CARD: LIGHT MONOCHROME GLASS */}
            {activeTooltip === 'outgoing' && (
              <div 
                onMouseEnter={() => setActiveTooltip('outgoing')}
                onMouseLeave={() => setActiveTooltip(null)}
                className="absolute right-0 top-9 sm:top-10 w-68 sm:w-72 bg-white/95 backdrop-blur-md text-slate-800 p-3.5 rounded-xl sm:rounded-2xl shadow-xl shadow-slate-900/10 border border-slate-200/90 text-xs z-50 pointer-events-auto animate-in fade-in zoom-in-95 duration-150 select-text"
                role="tooltip"
              >
                <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100">
                  <span className="font-medium text-slate-900 text-xs">Total HPP Keluar</span>
                  <span className="text-3xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-mono border border-slate-200/70">
                    BEBAN POKOK
                  </span>
                </div>
                <p className="mt-2 text-slate-600 text-2xs leading-relaxed font-normal">
                  Akumulasi nilai modal berjalan (HPP) dari seluruh suku cadang yang dikeluarkan untuk kebutuhan operasional gudang.
                </p>
                <div className="mt-2.5 p-2 rounded-lg bg-slate-50/90 border border-slate-200/80">
                  <span className="text-3xs text-slate-400 font-normal uppercase tracking-wider block">
                    Rumus Perhitungan:
                  </span>
                  <code className="text-2xs text-slate-800 font-mono font-medium block mt-0.5">
                    Σ (Qty Keluar × HPP Berjalan)
                  </code>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Body: Value on left, Waveform on right */}
        <div className="mt-4 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline whitespace-nowrap">
              <span className="text-xs font-normal text-slate-400 mr-1">Rp</span>
              <span className="text-xl sm:text-2xl font-medium text-slate-900 tabular-nums">
                {summary.totalOutgoingValue.toLocaleString('id-ID')}
              </span>
              <span className={`text-xs font-medium ml-1.5 select-none ${hasOutgoing ? 'text-amber-500' : 'text-slate-300'}`}>
                ▼
              </span>
            </div>
            <div className="mt-1 flex flex-col">
              <span className={`text-xs font-medium ${hasOutgoing ? 'text-amber-700' : 'text-slate-500'}`}>
                Beban HPP
              </span>
              <span className="text-xs text-slate-400 font-normal">
                pengeluaran gudang
              </span>
            </div>
          </div>

          {/* Mini Waveform Sparkline */}
          <div className="flex items-end gap-1 sm:gap-1.5 h-10 sm:h-11 pb-0.5" aria-hidden="true">
            <span className="w-2 sm:w-2.5 rounded-full bg-slate-100 h-4" />
            <span className="w-2 sm:w-2.5 rounded-full bg-slate-100 h-5" />
            <span className={`w-2 sm:w-2.5 rounded-full ${hasOutgoing ? 'bg-amber-500' : 'bg-slate-200'} h-10`} />
            <span className="w-2 sm:w-2.5 rounded-full bg-slate-100 h-6" />
            <span className="w-2 sm:w-2.5 rounded-full bg-slate-100 h-4" />
            <span className="w-2 sm:w-2.5 rounded-full bg-slate-100 h-3" />
          </div>
        </div>
      </div>

      {/* CARD 3: SELISIH ARUS MUTASI (NET) */}
      <div className="relative bg-white border border-slate-200/80 rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
        {/* Top Header */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-medium text-slate-600 tracking-tight truncate">
            Selisih Arus Mutasi (Net)
          </span>
          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveTooltip((prev) => (prev === 'margin' ? null : 'margin'));
              }}
              onMouseEnter={() => setActiveTooltip('margin')}
              onMouseLeave={() => setActiveTooltip(null)}
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border flex items-center justify-center transition-all shrink-0 cursor-pointer ${
                activeTooltip === 'margin'
                  ? 'bg-slate-100 border-slate-300 text-slate-900 shadow-2xs'
                  : 'border-slate-200/90 text-slate-400 hover:text-slate-800 hover:border-slate-300 hover:bg-slate-50'
              }`}
              title="Penjelasan Selisih Arus Mutasi"
              aria-label="Info Selisih Arus Mutasi"
            >
              <Info size={14} />
            </button>

            {/* FLOATING CARD: LIGHT MONOCHROME GLASS */}
            {activeTooltip === 'margin' && (
              <div 
                onMouseEnter={() => setActiveTooltip('margin')}
                onMouseLeave={() => setActiveTooltip(null)}
                className="absolute right-0 top-9 sm:top-10 w-68 sm:w-72 bg-white/95 backdrop-blur-md text-slate-800 p-3.5 rounded-xl sm:rounded-2xl shadow-xl shadow-slate-900/10 border border-slate-200/90 text-xs z-50 pointer-events-auto animate-in fade-in zoom-in-95 duration-150 select-text"
                role="tooltip"
              >
                <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100">
                  <span className="font-medium text-slate-900 text-xs">Selisih Arus Mutasi</span>
                  <span className="text-3xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-mono border border-slate-200/70">
                    NERACA MUTASI
                  </span>
                </div>
                <p className="mt-2 text-slate-600 text-2xs leading-relaxed font-normal">
                  Selisih bersih antara akumulasi nilai aset barang yang diterima dibandingkan dengan total beban modal suku cadang yang dikeluarkan.
                </p>
                <div className="mt-2.5 p-2 rounded-lg bg-slate-50/90 border border-slate-200/80">
                  <span className="text-3xs text-slate-400 font-normal uppercase tracking-wider block">
                    Rumus Perhitungan:
                  </span>
                  <code className="text-2xs text-slate-800 font-mono font-medium block mt-0.5">
                    Nilai Masuk − Beban HPP Keluar
                  </code>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Body: Value on left, Waveform on right */}
        <div className="mt-4 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline whitespace-nowrap">
              <span className="text-xs font-normal text-slate-400 mr-1">
                {summary.margin < 0 ? '-Rp' : 'Rp'}
              </span>
              <span className="text-xl sm:text-2xl font-medium text-slate-900 tabular-nums">
                {Math.abs(summary.margin).toLocaleString('id-ID')}
              </span>
              <span className={`text-xs font-medium ml-1.5 select-none ${
                summary.margin > 0 ? 'text-emerald-500' : summary.margin < 0 ? 'text-rose-500' : 'text-slate-300'
              }`}>
                {summary.margin > 0 ? '▲' : summary.margin < 0 ? '▼' : '●'}
              </span>
            </div>
            <div className="mt-1 flex flex-col">
              <span className={`text-xs font-medium ${
                summary.margin > 0 ? 'text-emerald-700' : summary.margin < 0 ? 'text-rose-700' : 'text-slate-500'
              }`}>
                {summary.margin > 0 ? 'Surplus Aset' : summary.margin < 0 ? 'Defisit Bersih' : 'Seimbang'}
              </span>
              <span className="text-xs text-slate-400 font-normal">
                keseimbangan mutasi
              </span>
            </div>
          </div>

          {/* Mini Waveform Sparkline */}
          <div className="flex items-end gap-1 sm:gap-1.5 h-10 sm:h-11 pb-0.5" aria-hidden="true">
            <span className="w-2 sm:w-2.5 rounded-full bg-slate-100 h-3" />
            <span className="w-2 sm:w-2.5 rounded-full bg-slate-100 h-5" />
            <span className={`w-2 sm:w-2.5 rounded-full ${isMarginNonZero ? 'bg-indigo-500' : 'bg-slate-200'} h-10`} />
            <span className="w-2 sm:w-2.5 rounded-full bg-slate-100 h-6" />
            <span className="w-2 sm:w-2.5 rounded-full bg-slate-100 h-4" />
            <span className="w-2 sm:w-2.5 rounded-full bg-slate-100 h-3" />
          </div>
        </div>
      </div>
    </div>
  );
}

