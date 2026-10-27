// src/features/dashboard/services/dashboard.service.ts
import { getDashboardStats } from '@/features/dashboard/repositories/dashboard.repository';
import type { DashboardStats } from '../types/dashboard.types';

export type { RecentMovement, LowStockItem, DashboardStats } from '../types/dashboard.types';

/**
 * BUSINESS LOGIC LAYER — mengambil dan memformat data dashboard.
 */
export async function fetchDashboardStats(selectedMonth?: string): Promise<DashboardStats> {
  return getDashboardStats(selectedMonth);
}