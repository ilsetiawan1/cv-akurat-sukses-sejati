// src/app/error.tsx
'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { RotateCcw, Home, LogIn } from 'lucide-react';

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[RootError Caught]:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#99c8f1] via-[#bfe0fa] to-[#eaf4fe] flex flex-col justify-between p-4 sm:p-6 lg:p-8 relative overflow-hidden font-sans select-none">
      {/* Decorative Atmosphere Clouds */}
      <div className="absolute top-10 -left-12 w-72 h-36 bg-white/45 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-20 -right-16 w-80 h-44 bg-white/55 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-1/4 w-96 h-40 bg-white/60 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-4 right-1/4 w-80 h-32 bg-white/50 rounded-full blur-2xl pointer-events-none" />

      {/* Top Header Navigation */}
      <header className="w-full max-w-5xl mx-auto flex items-center justify-between py-2 z-20">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 transition-opacity hover:opacity-90"
        >
          <div className="w-10 h-10 rounded-xl bg-white/95 border border-white/80 flex items-center justify-center p-1.5 shrink-0 shadow-2xs backdrop-blur-xs">
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
            <span className="font-semibold text-sm sm:text-base text-slate-900 leading-tight block">
              CV Akurat Sukses Sejati
            </span>
            <span className="text-2xs sm:text-xs text-slate-600 font-normal">
              Sistem Manajemen Persediaan Suku Cadang
            </span>
          </div>
        </Link>

        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/90 hover:bg-white text-slate-800 text-xs sm:text-sm font-medium rounded-xl border border-white/80 shadow-2xs transition-all backdrop-blur-xs"
        >
          <LogIn size={14} className="text-slate-600" />
          <span>Masuk</span>
        </Link>
      </header>

      {/* Main 500 Hero Container */}
      <main className="relative flex flex-col items-center justify-center my-auto py-4 sm:py-6 z-10 w-full max-w-4xl mx-auto">
        {/* Visual 500 with Overlapping 3D Mascot */}
        <div className="relative flex items-center justify-center w-full select-none">
          {/* Giant 500 Typography Backdrop */}
          <div className="flex items-center justify-center font-black tracking-tighter text-white drop-shadow-[0_8px_30px_rgba(255,255,255,0.7)] text-[120px] sm:text-[190px] md:text-[250px] lg:text-[300px] leading-none select-none gap-1 sm:gap-4">
            <span className="transform -translate-x-2 sm:-translate-x-4">5</span>
            <span className="opacity-95">0</span>
            <span className="transform translate-x-2 sm:translate-x-4">0</span>
          </div>

          {/* 3D Cute Mascot Overlapping Middle 0 */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <div className="relative w-44 sm:w-60 md:w-72 lg:w-80 aspect-square">
              <Image
                src="/mascot-404.png"
                alt="Karakter Mascot Kendala Sistem"
                fill
                sizes="(max-width: 640px) 176px, (max-width: 768px) 240px, (max-width: 1024px) 288px, 320px"
                className="object-contain drop-shadow-[0_20px_25px_rgba(15,23,42,0.2)]"
                priority
              />
            </div>
            {/* Ambient Ground Shadow */}
            <div className="w-32 sm:w-44 md:w-52 h-3.5 bg-blue-950/15 rounded-full blur-md -mt-3 sm:-mt-5" />
          </div>
        </div>

        {/* Copywriting Section */}
        <div className="text-center mt-3 sm:mt-5 max-w-lg mx-auto px-4 z-20">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
            Oops, terjadi kendala pada sistem
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-slate-600 mt-2 leading-relaxed">
            Sistem mendeteksi gangguan saat memproses halaman ini. Data persediaan Anda tetap aman dan tidak mengalami perubahan.
          </p>

          {/* Reference Digest */}
          {error?.digest && (
            <div className="mt-3 inline-block px-3 py-1 bg-white/70 border border-white/90 rounded-lg text-2xs sm:text-xs font-mono text-slate-600 select-all backdrop-blur-xs">
              Ref: {error.digest}
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => reset()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-white hover:bg-slate-50 text-slate-800 text-xs sm:text-sm font-medium rounded-xl border border-white/90 shadow-xs hover:shadow transition-all min-h-[44px] cursor-pointer"
            >
              <RotateCcw size={15} className="text-slate-500" />
              <span>Coba Muat Ulang</span>
            </button>

            <Link
              href="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white/70 hover:bg-white text-slate-700 text-xs sm:text-sm font-medium rounded-xl border border-white/60 shadow-2xs hover:shadow-xs transition-all min-h-[44px]"
            >
              <Home size={15} className="text-slate-500" />
              <span>Ke Dashboard</span>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer Note */}
      <footer className="w-full max-w-5xl mx-auto text-center py-3 text-xs text-slate-600/80 z-20">
        © 2026 CV Akurat Sukses Sejati. Seluruh hak cipta dilindungi.
      </footer>
    </div>
  );
}
