// src/app/error.tsx
'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log technical error safely to console for debugging
    console.error('[RootError Boundary Caught]:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex flex-col justify-between p-4 sm:p-6 lg:p-8 select-none font-sans">
      {/* Top Header Brand */}
      <header className="w-full max-w-5xl mx-auto flex items-center justify-between py-2">
        <Link href="/dashboard" className="flex items-center gap-3 transition-opacity hover:opacity-85">
          <div className="w-10 h-10 rounded-xl bg-white border border-slate-200/90 flex items-center justify-center p-1.5 shrink-0 shadow-2xs">
            <Image
              src="/logo-cv-akurat-sukses-sejati.png"
              alt="Logo CV Akurat Sukses Sejati"
              width={28}
              height={28}
              className="object-contain"
              priority
            />
          </div>
          <div>
            <span className="font-semibold text-sm text-slate-900 leading-tight block">
              CV Akurat Sukses Sejati
            </span>
            <span className="text-2xs text-slate-500 font-normal">
              Sistem Manajemen Persediaan Suku Cadang
            </span>
          </div>
        </Link>
      </header>

      {/* Main Error Card Container */}
      <main className="w-full max-w-lg mx-auto my-auto py-8">
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 sm:p-8 text-center flex flex-col items-center">
          
          {/* Badge & Icon */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono font-medium text-rose-700 bg-rose-50 border border-rose-200/70 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            <span>KODE 500 • KENDALA SISTEM</span>
          </div>

          <div className="w-14 h-14 rounded-2xl bg-rose-50/80 border border-rose-100 flex items-center justify-center text-rose-600 mb-4 shadow-2xs">
            <AlertTriangle size={28} className="stroke-[1.75]" />
          </div>

          {/* Heading & Description */}
          <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">
            Terjadi Gangguan pada Sistem
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-sm leading-relaxed">
            Sistem mendeteksi kendala saat memproses halaman ini. Data persediaan Anda tetap aman dan tidak mengalami perubahan.
          </p>

          {/* Technical Digest Reference (Safe for Production) */}
          {error.digest && (
            <div className="mt-4 p-2.5 bg-slate-50 border border-slate-200/70 rounded-xl text-left w-full max-w-sm">
              <span className="text-3xs text-slate-400 uppercase font-mono block">
                Kode Referensi Teknis:
              </span>
              <code className="text-xs font-mono text-slate-700 break-all select-all">
                {error.digest}
              </code>
            </div>
          )}

          {/* Action Buttons */}
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
              <Home size={15} />
              <span>Ke Dashboard</span>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer Note */}
      <footer className="w-full max-w-5xl mx-auto text-center py-4 text-xs text-slate-400">
        © 2026 CV Akurat Sukses Sejati. Seluruh hak cipta dilindungi.
      </footer>
    </div>
  );
}

