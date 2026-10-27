// src/features/dashboard/types/dashboard.types.ts

export interface RecentMovement {
  id: string;
  type: 'IN' | 'OUT';
  code: string;
  itemName: string;
  itemCode: string;
  quantity: number;
  date: string;
}

export interface LowStockItem {
  id: string;
  itemCode: string;
  name: string;
  category: string;
  unit: string;
  stock: number;
  hpp: number;
}

export interface DashboardInventoryItem {
  id: string;
  inventoryCode: string;
  itemCode: string;
  name: string;
  category: string;
  unit: string;
  stock: number;
  hpp: number;
}

export interface StatMetric {
  value: number;
  change?: number;
  trend?: number;
  label?: string;
}

export interface SelectedMonthMeta {
  key: string;
  label: string;
  shortLabel: string;
  isCurrentMonth: boolean;
}

export interface DashboardStats {
  selectedMonth: SelectedMonthMeta;
  kategoriBarang: StatMetric;
  totalItem: StatMetric;
  pengguna: StatMetric;
  supplier: StatMetric;
  barangMasuk: StatMetric;
  barangKeluar: StatMetric;
  persediaan: StatMetric;
  totalValuasi: StatMetric;
  stokMenipisCount: number;
  lowStockItems: LowStockItem[];
  inventoryList: DashboardInventoryItem[];
  recentMovements: RecentMovement[];
}
