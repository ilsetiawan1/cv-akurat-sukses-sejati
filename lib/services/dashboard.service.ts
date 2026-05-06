// lib/services/dashboard.service.ts

import { getDashboardStats } from '@/lib/repositories/dashboard.repository';

export type DashboardStats = Awaited<ReturnType<typeof getDashboardStats>>;

/**
 * BUSINESS LOGIC LAYER — mengambil dan memformat data dashboard.
 */
export async function fetchDashboardStats(): Promise<DashboardStats> {
  return getDashboardStats();
}