// src/app/(dashboard)/not-found.tsx
import Link from 'next/link';
import { Compass, LayoutDashboard } from 'lucide-react';

export default function DashboardNotFound() {
  return (
    <div className="w-full min-h-[60vh] flex items-center justify-center py-10 select-none font-sans">
      <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 sm:p-8 text-center flex flex-col items-center">
        
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono font-medium text-slate-600 bg-slate-100 border border-slate-200/70 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
          <span>KODE 404 • TIDAK DITEMUKAN</span>
        </div>

        <div className="w-14 h-14 rounded-2xl bg-blue-50/80 border border-blue-100 flex items-center justify-center text-[#1E3A8A] mb-4 shadow-2xs">
          <Compass size={28} className="stroke-[1.75]" />
        </div>

        <h2 className="text-lg sm:text-xl font-semibold text-slate-900 tracking-tight">
          Halaman Tidak Ditemukan
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-sm leading-relaxed">
          Sub-halaman atau tautan modul yang Anda tuju tidak tersedia dalam sistem manajemen persediaan.
        </p>

        <div className="mt-6 flex items-center justify-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#1E3A8A] hover:bg-blue-800 text-white text-xs sm:text-sm font-medium rounded-xl shadow-2xs transition-colors shrink-0"
          >
            <LayoutDashboard size={15} />
            <span>Kembali ke Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

