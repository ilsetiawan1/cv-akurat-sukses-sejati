// src/app/(dashboard)/not-found.tsx
import Link from 'next/link';
import Image from 'next/image';
import { LayoutDashboard, Package } from 'lucide-react';

export default function DashboardNotFound() {
  return (
    <div className="w-full min-h-[75vh] flex items-center justify-center p-2 sm:p-4 select-none font-sans">
      <div className="relative w-full max-w-3xl bg-gradient-to-b from-[#a1cdf4] via-[#c6e3fa] to-[#ebf5fe] rounded-3xl border border-white/80 shadow-xs p-6 sm:p-10 text-center flex flex-col items-center justify-center overflow-hidden">
        {/* Soft Background Clouds */}
        <div className="absolute top-6 -left-10 w-48 h-24 bg-white/45 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute top-8 -right-10 w-52 h-28 bg-white/55 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-10 left-1/3 w-64 h-24 bg-white/60 rounded-full blur-2xl pointer-events-none" />

        {/* 404 Visual with Mascot */}
        <div className="relative flex items-center justify-center w-full select-none z-10 py-2">
          {/* Giant 404 Typography Backdrop */}
          <div className="flex items-center justify-center font-black tracking-tighter text-white drop-shadow-[0_8px_25px_rgba(255,255,255,0.7)] text-[100px] sm:text-[160px] md:text-[200px] leading-none select-none gap-1 sm:gap-3">
            <span className="transform -translate-x-2">4</span>
            <span className="opacity-95">0</span>
            <span className="transform translate-x-2">4</span>
          </div>

          {/* 3D Mascot Overlapping 0 */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <div className="relative w-36 sm:w-52 md:w-60 aspect-square">
              <Image
                src="/mascot-404.png"
                alt="Karakter Mascot 404"
                fill
                sizes="(max-width: 640px) 144px, (max-width: 768px) 208px, 240px"
                className="object-contain drop-shadow-[0_16px_20px_rgba(15,23,42,0.18)]"
                priority
              />
            </div>
            <div className="w-28 sm:w-40 h-3 bg-blue-950/15 rounded-full blur-md -mt-2 sm:-mt-4" />
          </div>
        </div>

        {/* Text and Actions */}
        <div className="relative z-10 mt-3 max-w-md mx-auto">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            Oops, sepertinya Anda tersesat
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
            Halaman atau tautan modul yang Anda tuju tidak ditemukan dalam sistem persediaan.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-2.5">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-800 text-xs sm:text-sm font-medium rounded-xl border border-white/90 shadow-xs hover:shadow transition-all group min-h-[44px]"
            >
              <LayoutDashboard size={16} className="text-slate-500" />
              <span>Kembali ke Dashboard</span>
            </Link>

            <Link
              href="/transaksi/persediaan"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white/70 hover:bg-white text-slate-700 text-xs sm:text-sm font-medium rounded-xl border border-white/60 shadow-2xs hover:shadow-xs transition-all min-h-[44px]"
            >
              <Package size={15} className="text-slate-500" />
              <span>Data Persediaan</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
