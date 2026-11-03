// src/features/goods-receipt/components/ReceiptStatCards.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { Info } from 'lucide-react';
import type { ReceiptSummaryStats } from '../types/goods-receipt.types';

export interface ReceiptStatCardsProps {
  stats: ReceiptSummaryStats;
}

export default function ReceiptStatCards({ stats }: ReceiptStatCardsProps) {
  const [activeTooltip, setActiveTooltip] = useState<'purchase' | 'tx' | null>(null);
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

  return (
    <div 
      ref={containerRef}
      className="relative z-30 grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4 select-none"
    >
      {/* CARD 1: TOTAL NILAI PEMBELIAN (POSISI KIRI) */}
      <div className="relative bg-white border border-slate-200/80 rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
        {/* Top Header: Title & Info Button */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-medium text-slate-600 tracking-tight truncate">
            Total Nilai Pembelian
          </span>
          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveTooltip((prev) => (prev === 'purchase' ? null : 'purchase'));
              }}
              onMouseEnter={() => setActiveTooltip('purchase')}
              onMouseLeave={() => setActiveTooltip(null)}
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border flex items-center justify-center transition-all shrink-0 cursor-pointer ${
                activeTooltip === 'purchase'
                  ? 'bg-slate-100 border-slate-300 text-slate-900 shadow-2xs'
                  : 'border-slate-200/90 text-slate-400 hover:text-slate-800 hover:border-slate-300 hover:bg-slate-50'
              }`}
              title="Penjelasan & rumus Total Nilai Pembelian"
              aria-label="Info rumus Total Nilai Pembelian"
            >
              <Info size={14} />
            </button>

            {/* FLOATING CARD: LIGHT MONOCHROME GLASS (HITAM - ABU - PUTIH) */}
            {activeTooltip === 'purchase' && (
              <div 
                onMouseEnter={() => setActiveTooltip('purchase')}
                onMouseLeave={() => setActiveTooltip(null)}
                className="absolute right-0 top-9 sm:top-10 w-68 sm:w-72 bg-white/95 backdrop-blur-md text-slate-800 p-3.5 rounded-xl sm:rounded-2xl shadow-xl shadow-slate-900/10 border border-slate-200/90 text-xs z-50 pointer-events-auto animate-in fade-in zoom-in-95 duration-150 select-text"
                role="tooltip"
              >
                <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100">
                  <span className="font-medium text-slate-900 text-xs">Total Nilai Pembelian</span>
                  <span className="text-3xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-mono border border-slate-200/70">
                    FINANSIAL
                  </span>
                </div>
                <p className="mt-2 text-slate-600 text-2xs leading-relaxed font-normal">
                  Akumulasi total nilai perolehan suku cadang yang dibeli dari supplier rekanan pada periode yang dipilih.
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
                {stats.totalAmount.toLocaleString('id-ID')}
              </span>
              <span className={`text-xs font-medium ml-1.5 select-none ${stats.totalAmount > 0 ? 'text-emerald-500' : 'text-slate-300'}`}>
                ▲
              </span>
            </div>
            <div className="mt-1 flex flex-col">
              <span className={`text-xs font-medium ${stats.totalAmount > 0 ? 'text-emerald-600' : 'text-slate-500'}`}>
                Harga Beli
              </span>
              <span className="text-xs text-slate-400 font-normal">
                total nilai pengadaan
              </span>
            </div>
          </div>

          {/* Mini Waveform Sparkline */}
          <div className="flex items-end gap-1 sm:gap-1.5 h-10 sm:h-11 pb-0.5" aria-hidden="true">
            <span className="w-2 sm:w-2.5 rounded-full bg-slate-100 h-3.5" />
            <span className="w-2 sm:w-2.5 rounded-full bg-slate-100 h-6" />
            <span className="w-2 sm:w-2.5 rounded-full bg-slate-100 h-5" />
            <span className={`w-2 sm:w-2.5 rounded-full ${stats.totalAmount > 0 ? 'bg-indigo-500' : 'bg-slate-200'} h-10`} />
            <span className="w-2 sm:w-2.5 rounded-full bg-slate-100 h-7" />
            <span className="w-2 sm:w-2.5 rounded-full bg-slate-100 h-8" />
            <span className="w-2 sm:w-2.5 rounded-full bg-slate-100 h-4" />
          </div>
        </div>
      </div>

      {/* CARD 2: TOTAL TRANSAKSI (POSISI KANAN) */}
      <div className="relative bg-white border border-slate-200/80 rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
        {/* Top Header: Title & Info Button */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-medium text-slate-600 tracking-tight truncate">
            Total Transaksi
          </span>
          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveTooltip((prev) => (prev === 'tx' ? null : 'tx'));
              }}
              onMouseEnter={() => setActiveTooltip('tx')}
              onMouseLeave={() => setActiveTooltip(null)}
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border flex items-center justify-center transition-all shrink-0 cursor-pointer ${
                activeTooltip === 'tx'
                  ? 'bg-slate-100 border-slate-300 text-slate-900 shadow-2xs'
                  : 'border-slate-200/90 text-slate-400 hover:text-slate-800 hover:border-slate-300 hover:bg-slate-50'
              }`}
              title="Penjelasan Total Transaksi Masuk"
              aria-label="Info Total Transaksi Masuk"
            >
              <Info size={14} />
            </button>

            {/* FLOATING CARD: LIGHT MONOCHROME GLASS (HITAM - ABU - PUTIH) */}
            {activeTooltip === 'tx' && (
              <div 
                onMouseEnter={() => setActiveTooltip('tx')}
                onMouseLeave={() => setActiveTooltip(null)}
                className="absolute right-0 top-9 sm:top-10 w-68 sm:w-72 bg-white/95 backdrop-blur-md text-slate-800 p-3.5 rounded-xl sm:rounded-2xl shadow-xl shadow-slate-900/10 border border-slate-200/90 text-xs z-50 pointer-events-auto animate-in fade-in zoom-in-95 duration-150 select-text"
                role="tooltip"
              >
                <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100">
                  <span className="font-medium text-slate-900 text-xs">Total Transaksi Masuk</span>
                  <span className="text-3xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-mono border border-slate-200/70">
                    OPERASIONAL
                  </span>
                </div>
                <p className="mt-2 text-slate-600 text-2xs leading-relaxed font-normal">
                  Jumlah seluruh dokumen transaksi barang masuk yang berhasil dicatat dan diverifikasi di sistem pada periode ini.
                </p>
                <div className="mt-2.5 p-2 rounded-lg bg-slate-50/90 border border-slate-200/80">
                  <span className="text-3xs text-slate-400 font-normal uppercase tracking-wider block">
                    Keterangan:
                  </span>
                  <code className="text-2xs text-slate-800 font-mono font-medium block mt-0.5">
                    Count (Dokumen AD-XXXX)
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
                {stats.totalTransactions.toLocaleString('id-ID')}
              </span>
              <span className={`text-xs font-medium select-none ${stats.totalTransactions > 0 ? 'text-emerald-500' : 'text-slate-300'}`}>
                ▲
              </span>
            </div>
            <div className="mt-1 flex flex-col">
              <span className={`text-xs font-medium ${stats.totalTransactions > 0 ? 'text-emerald-600' : 'text-slate-500'}`}>
                Tercatat
              </span>
              <span className="text-xs text-slate-400 font-normal">
                total transaksi
              </span>
            </div>
          </div>

          {/* Mini Waveform Sparkline */}
          <div className="flex items-end gap-1 sm:gap-1.5 h-10 sm:h-11 pb-0.5" aria-hidden="true">
            <span className="w-2 sm:w-2.5 rounded-full bg-slate-100 h-3" />
            <span className="w-2 sm:w-2.5 rounded-full bg-slate-100 h-5" />
            <span className="w-2 sm:w-2.5 rounded-full bg-slate-100 h-7" />
            <span className={`w-2 sm:w-2.5 rounded-full ${stats.totalTransactions > 0 ? 'bg-[#2E82F6]' : 'bg-slate-200'} h-10`} />
            <span className="w-2 sm:w-2.5 rounded-full bg-slate-100 h-6" />
            <span className="w-2 sm:w-2.5 rounded-full bg-slate-100 h-5" />
            <span className="w-2 sm:w-2.5 rounded-full bg-slate-100 h-3.5" />
          </div>
        </div>
      </div>
    </div>
  );
}
