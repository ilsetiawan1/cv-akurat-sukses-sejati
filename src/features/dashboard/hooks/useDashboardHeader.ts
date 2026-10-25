// src/features/dashboard/hooks/useDashboardHeader.ts
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export interface UseDashboardHeaderReturn {
  isRefreshing: boolean;
  handleRefresh: () => void;
}

export function useDashboardHeader(): UseDashboardHeaderReturn {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    router.refresh();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  return {
    isRefreshing,
    handleRefresh,
  };
}
