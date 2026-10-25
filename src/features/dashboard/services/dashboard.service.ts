// lib/services/dashboard.service.ts

import { getDashboardStats } from '@/features/dashboard/repositories/dashboard.repository';
export type { RecentMovement, LowStockItem } from '@/features/dashboard/repositories/dashboard.repository';

export type DashboardStats = Awaited<ReturnType<typeof getDashboardStats>>;

/**
 * BUSINESS LOGIC LAYER — mengambil dan memformat data dashboard.
 */
export async function fetchDashboardStats(selectedMonth?: string): Promise<DashboardStats> {
  return getDashboardStats(selectedMonth);
}