// src/features/dashboard/hooks/useDashboardMonthFilter.ts
'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useTransition, useMemo } from 'react';

export interface MonthOption {
  value: string;
  label: string;
}

export function useDashboardMonthFilter(currentMonthKey?: string) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const monthOptions = useMemo<MonthOption[]>(() => {
    const options: MonthOption[] = [];
    const now = new Date();
    const monthNames = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    // Generate 6 bulan terakhir
    for (let i = 0; i < 6; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const val = `${y}-${m}`;
      const name = `${monthNames[d.getMonth()]} ${y}`;
      options.push({
        value: val,
        label: i === 0 ? `${name} (Bulan Ini)` : name,
      });
    }

    return options;
  }, []);

  const selectedMonth = searchParams.get('month') || currentMonthKey || monthOptions[0]?.value || '';

  const handleMonthChange = (month: string) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (month && month !== monthOptions[0]?.value) {
        params.set('month', month);
      } else {
        params.delete('month');
      }
      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname);
    });
  };

  return {
    selectedMonth,
    handleMonthChange,
    monthOptions,
    isPending,
  };
}
