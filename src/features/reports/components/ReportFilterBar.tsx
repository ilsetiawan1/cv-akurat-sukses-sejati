// src/features/reports/components/ReportFilterBar.tsx
'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Calendar, RotateCcw } from 'lucide-react';
import type { SelectedMonthOption } from '../types/report.types';

interface ReportFilterBarProps {
  selectedMonth: string;
  monthOptions: SelectedMonthOption[];
}

export default function ReportFilterBar({
  selectedMonth,
  monthOptions,
}: ReportFilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleMonthChange = (month: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (month) {
      params.set('month', month);
    } else {
      params.delete('month');
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleReset = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('month');
    router.push(pathname);
  };

  return (
    <div className="bg-white p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-between select-none">
      {/* Label & Icon */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#1E3A8A] border border-blue-200/60 flex items-center justify-center shrink-0 shadow-2xs">
          <Calendar size={16} />
        </div>
        <div>
          <h2 className="text-xs sm:text-sm font-medium text-slate-800 tracking-tight">
            Filter Periode Laporan Mutasi
          </h2>
          <p className="text-2xs sm:text-xs text-slate-400 font-normal">
            Pilih bulan pembukuan untuk rekap arus persediaan
          </p>
        </div>
      </div>

      {/* Dropdown Filter Periode Bulan */}
      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
        <select 
          value={selectedMonth}
          onChange={(e) => handleMonthChange(e.target.value)}
          className="w-full sm:w-auto px-3.5 py-2 text-xs sm:text-sm font-medium border border-slate-200 rounded-xl text-slate-700 bg-white hover:border-slate-300 focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 outline-none transition-all cursor-pointer shadow-2xs truncate"
          title="Pilih filter bulan pembukuan"
        >
          <option value="">Semua Periode</option>
          {monthOptions.map((m) => (
            <option key={m.key} value={m.key}>
              {m.label}
            </option>
          ))}
        </select>

        {Boolean(selectedMonth) && (
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-colors shrink-0 cursor-pointer"
            title="Reset ke semua periode"
          >
            <RotateCcw size={13} />
            <span className="hidden sm:inline">Reset</span>
          </button>
        )}
      </div>
    </div>
  );
}
