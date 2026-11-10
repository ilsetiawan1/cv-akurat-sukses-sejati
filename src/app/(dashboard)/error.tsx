// src/app/(dashboard)/error.tsx
'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RotateCcw, LayoutDashboard } from 'lucide-react';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[Dashboard Error Caught]:', error);
  }, [error]);

  return (
    <div className="w-full min-h-[60vh] flex items-center justify-center py-10 select-none font-sans">
      <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 sm:p-8 text-center flex flex-col items-center">
        
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono font-medium text-rose-700 bg-rose-50 border border-rose-200/70 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
          <span>KENDALA MODUL OPERASIONAL</span>
        </div>

        <div className="w-14 h-14 rounded-2xl bg-rose-50/80 border border-rose-100 flex items-center justify-center text-rose-600 mb-4 shadow-2xs">
          <AlertTriangle size={28} className="stroke-[1.75]" />
        </div>

        <h2 className="text-lg sm:text-xl font-semibold text-slate-900 tracking-tight">
          Gagal Memuat Data Halaman
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-sm leading-relaxed">
          Terjadi kendala saat menyinkronkan data modul ini dari server. Silakan coba muat ulang atau buka modul lainnya via menu navigasi.
        </p>

        {error?.digest && (
          <div className="mt-4 p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-left w-full max-w-sm">
            <span className="text-3xs text-slate-400 uppercase font-mono block">
              Kode Referensi Teknis:
            </span>
            <code className="text-xs font-mono text-slate-700 break-all select-all">
              {error.digest}
            </code>
          </div>
        )}

        <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#1E3A8A] hover:bg-blue-800 text-white text-xs sm:text-sm font-medium rounded-xl shadow-2xs transition-colors shrink-0 cursor-pointer"
          >
            <RotateCcw size={15} />
            <span>Coba Muat Ulang</span>
          </button>

          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs sm:text-sm font-medium rounded-xl shadow-2xs transition-colors shrink-0"
          >
            <LayoutDashboard size={15} />
            <span>Dashboard Utama</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

