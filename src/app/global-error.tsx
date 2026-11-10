// src/app/global-error.tsx
'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { RotateCcw } from 'lucide-react';

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
      <body className="min-h-screen bg-gradient-to-b from-[#99c8f1] via-[#bfe0fa] to-[#eaf4fe] flex items-center justify-center p-4 font-sans text-slate-900 select-none antialiased">
        <div className="relative w-full max-w-xl bg-white/90 backdrop-blur-md rounded-3xl border border-white/80 shadow-xs p-6 sm:p-8 text-center flex flex-col items-center justify-center overflow-hidden">
          {/* Mascot */}
          <div className="relative w-36 sm:w-44 aspect-square mb-2">
            <Image
              src="/mascot-404.png"
              alt="Karakter Mascot"
              fill
              className="object-contain drop-shadow-[0_12px_16px_rgba(15,23,42,0.15)]"
              priority
            />
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Oops, terjadi kendala dasar sistem
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed max-w-sm">
            Terjadi kendala pada lapisan dasar aplikasi. Silakan muat ulang halaman untuk memulihkan sesi kerja Anda.
          </p>

          {error?.digest && (
            <div className="mt-3 px-3 py-1 bg-white border border-slate-200/80 rounded-lg text-2xs font-mono text-slate-600 break-all select-all">
              Ref: {error.digest}
            </div>
          )}

          <button
            type="button"
            onClick={() => reset()}
            className="mt-6 inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#1E3A8A] hover:bg-blue-800 text-white text-xs sm:text-sm font-medium rounded-xl shadow-xs transition-colors cursor-pointer min-h-[44px]"
          >
            <RotateCcw size={15} />
            <span>Muat Ulang Aplikasi</span>
          </button>
        </div>
      </body>
    </html>
  );
}
