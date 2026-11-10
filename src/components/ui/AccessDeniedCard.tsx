// src/components/ui/AccessDeniedCard.tsx
import Link from 'next/link';
import { ShieldAlert, LayoutDashboard } from 'lucide-react';

interface AccessDeniedCardProps {
  title?: string;
  message?: string;
}

export function AccessDeniedCard({
  title = 'Hak Akses Dibatasi',
  message = 'Akun Anda saat ini tidak memiliki izin operasional untuk mengakses modul ini.',
}: AccessDeniedCardProps) {
  return (
    <div className="w-full min-h-[50vh] flex items-center justify-center py-8 select-none font-sans">
      <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 sm:p-8 text-center flex flex-col items-center">
        
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono font-medium text-amber-800 bg-amber-50 border border-amber-200/70 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          <span>KODE 403 • AKSES DITOLAK</span>
        </div>

        <div className="w-14 h-14 rounded-2xl bg-amber-50/80 border border-amber-200/60 flex items-center justify-center text-amber-700 mb-4 shadow-2xs">
          <ShieldAlert size={28} className="stroke-[1.75]" />
        </div>

        <h2 className="text-lg sm:text-xl font-semibold text-slate-900 tracking-tight">
          {title}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-sm leading-relaxed">
          {message}
        </p>
        <p className="text-2xs text-slate-400 mt-1">
          Hubungi Super Admin atau pemilik sistem jika Anda memerlukan penyesuaian hak akses.
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

