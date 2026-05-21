// components/laporan/ReportFilterBar.tsx
'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Calendar } from 'lucide-react';
import type { ReportFilterPeriod } from '@/types/report.types';

export default function ReportFilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentPeriod = (searchParams.get('period') as ReportFilterPeriod) || 'bulan_ini';
  const currentStart = searchParams.get('start') || '';
  const currentEnd = searchParams.get('end') || '';

  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const period = e.target.value as ReportFilterPeriod;
    const params = new URLSearchParams(searchParams.toString());
    params.set('period', period);
    if (period !== 'kustom') {
      params.delete('start');
      params.delete('end');
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleDateChange = (type: 'start' | 'end', val: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('period', 'kustom');
    if (val) params.set(type, val);
    else params.delete(type);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col sm:flex-row gap-4 items-center justify-between mb-6">
      <div className="flex items-center gap-2">
        <div className="p-2 bg-purple-50 text-[#7C3AED] rounded-lg">
          <Calendar size={20} />
        </div>
        <h2 className="font-semibold text-gray-800">Filter Periode Laporan</h2>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <select 
          value={currentPeriod}
          onChange={handlePeriodChange}
          className="px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] outline-none"
        >
          <option value="hari_ini">Hari Ini</option>
          <option value="minggu_ini">Minggu Ini</option>
          <option value="bulan_ini">Bulan Ini</option>
          <option value="kustom">Kustom Rentang Tanggal</option>
        </select>

        {currentPeriod === 'kustom' && (
          <div className="flex gap-2 items-center">
            <input 
              type="date"
              value={currentStart}
              onChange={(e) => handleDateChange('start', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#7C3AED]/20 outline-none w-full sm:w-auto"
            />
            <span className="text-gray-400">-</span>
            <input 
              type="date"
              value={currentEnd}
              onChange={(e) => handleDateChange('end', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#7C3AED]/20 outline-none w-full sm:w-auto"
            />
          </div>
        )}
      </div>
    </div>
  );
}
