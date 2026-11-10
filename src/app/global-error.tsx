// src/app/global-error.tsx
'use client';

import { useEffect } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[GlobalError Caught]:', error);
  }, [error]);

  return (
    <html lang="id">
      <body className="min-h-screen bg-[#f8f9fc] flex items-center justify-center p-4 font-sans text-slate-900 select-none antialiased">
        <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 sm:p-8 text-center flex flex-col items-center">
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono font-medium text-rose-700 bg-rose-50 border border-rose-200/70 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            <span>KENDALA DASAR SISTEM</span>
          </div>

          <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 mb-4 shadow-2xs">
            <AlertTriangle size={28} className="stroke-[1.75]" />
          </div>

          <h1 className="text-xl font-semibold text-slate-900 tracking-tight">
            Kendala Kritis Sistem
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed max-w-xs">
            Terjadi kendala pada lapisan dasar aplikasi. Silakan muat ulang halaman untuk memulihkan sesi kerja Anda.
          </p>

          {error?.digest && (
            <div className="mt-4 p-2 bg-slate-50 border border-slate-200/80 rounded-lg text-2xs font-mono text-slate-600 break-all select-all">
              Ref: {error.digest}
            </div>
          )}

          <button
            type="button"
            onClick={() => reset()}
            className="mt-6 inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#1E3A8A] hover:bg-blue-800 text-white text-xs sm:text-sm font-medium rounded-xl shadow-2xs transition-colors cursor-pointer"
          >
            <RotateCcw size={15} />
            <span>Muat Ulang Aplikasi</span>
          </button>
        </div>
      </body>
    </html>
  );
}

