// src/features/reports/components/ReportMobileCardList.tsx
'use client';

import { Archive, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import type { UnifiedMutationItem } from '../types/report.types';

export interface ReportMobileCardListProps {
  mutations: UnifiedMutationItem[];
}

export default function ReportMobileCardList({ mutations }: ReportMobileCardListProps) {
  if (mutations.length === 0) {
    return (
      <div className="py-12 px-4 text-center">
        <div className="flex flex-col items-center justify-center">
          <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-2.5 border border-slate-100">
            <Archive className="h-6 w-6 text-slate-300" />
          </div>
          <p className="font-medium text-slate-800 text-sm">Tidak ada catatan mutasi</p>
          <p className="text-slate-400 text-xs mt-0.5">Tidak ditemukan pergerakan barang pada periode laporan ini.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-100">
      {mutations.map((row) => {
        const isIncoming = row.type === 'masuk';

        return (
          <div key={row.id} className="p-4 space-y-2.5">
            {/* Header: Nama Barang & Kategori */}
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-medium text-slate-800 leading-snug">
                  {row.itemName}
                </p>
                <p className="text-xs text-slate-400 font-normal mt-0.5">
                  {row.categoryName} • {row.unitName}
                </p>
              </div>

              {/* Tipe Mutasi Badge */}
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-2xs font-medium border shrink-0 ${
                isIncoming
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200/70'
                  : 'bg-rose-50 text-rose-700 border-rose-200/70'
              }`}>
                {isIncoming ? (
                  <>
                    <ArrowDownLeft size={11} className="stroke-[2.5]" />
                    <span>Masuk</span>
                  </>
                ) : (
                  <>
                    <ArrowUpRight size={11} className="stroke-[2.5]" />
                    <span>Keluar</span>
                  </>
                )}
              </span>
            </div>

            {/* Meta: Kode, Tanggal & Partner/Catatan */}
            <div className="flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/60">
                  {row.code}
                </span>
                <span className="text-slate-400 font-normal">
                  {new Date(row.date).toLocaleDateString('id-ID', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <span className="text-slate-500 font-normal truncate max-w-36 text-right">
                {row.partnerOrNote}
              </span>
            </div>

            {/* Footer: Qty Mutasi & Total Nilai */}
            <div className="flex items-center justify-between pt-1 border-t border-slate-100/70">
              <span className={`inline-flex items-center gap-0.5 px-2.5 py-0.5 rounded-full text-xs font-medium border tabular-nums ${
                isIncoming 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                  : 'bg-rose-50 text-rose-700 border-rose-100'
              }`}>
                {isIncoming ? `+${row.quantity}` : `-${row.quantity}`} {row.unitName}
              </span>
              <div className="text-right">
                <span className="font-medium text-slate-800 text-sm tabular-nums block">
                  Rp {row.amount.toLocaleString('id-ID')}
                </span>
                <span className="text-3xs text-slate-400 font-normal tabular-nums block">
                  @ Rp {row.unitPriceOrHpp.toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
