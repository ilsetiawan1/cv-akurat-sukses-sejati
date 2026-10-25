// lib/repositories/dashboard.repository.ts

import { createAdminClient } from '@/shared/lib/supabase/server-admin';

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

/**
 * DATA ACCESS LAYER — query statistik, mutasi terkini, dan persediaan untuk dashboard.
 */
export async function getDashboardStats(selectedMonthParam?: string) {
  const supabase = createAdminClient();

  const now = new Date();
  let targetYear = now.getFullYear();
  let targetMonth = now.getMonth(); // 0-based

  if (selectedMonthParam && /^\d{4}-\d{2}$/.test(selectedMonthParam)) {
    const [y, m] = selectedMonthParam.split('-').map(Number);
    if (!isNaN(y) && !isNaN(m) && m >= 1 && m <= 12) {
      targetYear = y;
      targetMonth = m - 1;
    }
  }

  const startOfSelectedMonth = new Date(targetYear, targetMonth, 1).toISOString();
  const endOfSelectedMonth = new Date(targetYear, targetMonth + 1, 0, 23, 59, 59, 999).toISOString();
  const startOfPrevMonth = new Date(targetYear, targetMonth - 1, 1).toISOString();
  const endOfPrevMonth = new Date(targetYear, targetMonth, 0, 23, 59, 59, 999).toISOString();

  const [
    { count: categoryCount },
    { count: itemCount },
    { count: userCount },
    { count: supplierCount },
    { data: receiptThisMonth },
    { data: receiptLastMonth },
    { data: issueThisMonth },
    { data: issueLastMonth },
    { data: inventoryRaw },
    { data: recentReceipts },
    { data: recentIssues },
  ] = await Promise.all([
    // Kategori
    supabase.from('categories').select('*', { count: 'exact', head: true }),

    // Total Item Barang
    supabase.from('items').select('*', { count: 'exact', head: true }),

    // Pengguna
    supabase.from('users').select('*', { count: 'exact', head: true }),

    // Supplier
    supabase.from('suppliers').select('*', { count: 'exact', head: true }),

    // Barang Masuk bulan yang dipilih
    supabase
      .from('goods_receipts')
      .select('quantity')
      .gte('receipt_date', startOfSelectedMonth)
      .lte('receipt_date', endOfSelectedMonth),

    // Barang Masuk bulan sebelumnya
    supabase
      .from('goods_receipts')
      .select('quantity')
      .gte('receipt_date', startOfPrevMonth)
      .lte('receipt_date', endOfPrevMonth),

    // Barang Keluar bulan yang dipilih
    supabase
      .from('goods_issues')
      .select('quantity')
      .gte('issue_date', startOfSelectedMonth)
      .lte('issue_date', endOfSelectedMonth),

    // Barang Keluar bulan sebelumnya
    supabase
      .from('goods_issues')
      .select('quantity')
      .gte('issue_date', startOfPrevMonth)
      .lte('issue_date', endOfPrevMonth),

    // Data Persediaan lengkap
    supabase.from('inventory').select(`
      id,
      inventory_code,
      stock,
      hpp,
      items (
        id,
        item_code,
        name,
        category:categories(name),
        unit:units(name)
      )
    `),

    // 5 Transaksi Barang Masuk Terkini
    supabase
      .from('goods_receipts')
      .select(`
        id,
        receipt_code,
        quantity,
        receipt_date,
        created_at,
        items (
          item_code,
          name
        )
      `)
      .order('created_at', { ascending: false })
      .limit(5),

    // 5 Transaksi Barang Keluar Terkini
    supabase
      .from('goods_issues')
      .select(`
        id,
        issue_code,
        quantity,
        issue_date,
        created_at,
        items (
          item_code,
          name
        )
      `)
      .order('created_at', { ascending: false })
      .limit(5),
  ]);

  const sumQty = (rows: { quantity: number }[] | null) =>
    (rows ?? []).reduce((acc, r) => acc + (r.quantity ?? 0), 0);

  const calcChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  const barangMasukNow = sumQty(receiptThisMonth as { quantity: number }[]);
  const barangMasukPrev = sumQty(receiptLastMonth as { quantity: number }[]);
  const barangKeluarNow = sumQty(issueThisMonth as { quantity: number }[]);
  const barangKeluarPrev = sumQty(issueLastMonth as { quantity: number }[]);

  let totalPersediaan = 0;
  let totalValuasi = 0;
  const lowStockList: LowStockItem[] = [];
  const inventoryList: DashboardInventoryItem[] = [];

  type InventoryItemRow = {
    id: string;
    inventory_code?: string;
    stock: number;
    hpp: number;
    items: {
      id: string;
      item_code: string;
      name: string;
      category?: { name: string } | null;
      unit?: { name: string } | null;
    } | null;
  };

  const invList = (inventoryRaw ?? []) as unknown as InventoryItemRow[];

  for (const inv of invList) {
    const s = Number(inv.stock || 0);
    const h = Number(inv.hpp || 0);
    totalPersediaan += s;
    totalValuasi += s * h;

    if (inv.items) {
      inventoryList.push({
        id: inv.id,
        inventoryCode: inv.inventory_code || '-',
        itemCode: inv.items.item_code || '-',
        name: inv.items.name || '-',
        category: inv.items.category?.name || 'UMUM',
        unit: inv.items.unit?.name || 'UNIT',
        stock: s,
        hpp: h,
      });

      if (s <= 5) {
        lowStockList.push({
          id: inv.id,
          itemCode: inv.items.item_code || '-',
          name: inv.items.name || '-',
          category: inv.items.category?.name || 'UMUM',
          unit: inv.items.unit?.name || 'UNIT',
          stock: s,
          hpp: h,
        });
      }
    }
  }

  // Urutkan stok terendah
  lowStockList.sort((a, b) => a.stock - b.stock);

  // Satukan mutasi terakhir
  type MovementReceiptRow = {
    id: string;
    receipt_code: string;
    quantity: number;
    receipt_date: string;
    created_at: string;
    items: { item_code: string; name: string } | null;
  };

  type MovementIssueRow = {
    id: string;
    issue_code: string;
    quantity: number;
    issue_date: string;
    created_at: string;
    items: { item_code: string; name: string } | null;
  };

  const mappedReceipts = ((recentReceipts ?? []) as unknown as MovementReceiptRow[]).map((r) => ({
    id: r.id,
    type: 'IN' as const,
    code: r.receipt_code,
    itemName: r.items?.name || 'Suku Cadang',
    itemCode: r.items?.item_code || '-',
    quantity: r.quantity,
    date: r.receipt_date,
    created_at: r.created_at,
  }));

  const mappedIssues = ((recentIssues ?? []) as unknown as MovementIssueRow[]).map((i) => ({
    id: i.id,
    type: 'OUT' as const,
    code: i.issue_code,
    itemName: i.items?.name || 'Suku Cadang',
    itemCode: i.items?.item_code || '-',
    quantity: i.quantity,
    date: i.issue_date,
    created_at: i.created_at,
  }));

  const allMovements = [...mappedReceipts, ...mappedIssues].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const recentMovements: RecentMovement[] = allMovements.slice(0, 5).map(({ id, type, code, itemName, itemCode, quantity, date }) => ({
    id,
    type,
    code,
    itemName,
    itemCode,
    quantity,
    date,
  }));

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  const selectedMonthLabel = `${monthNames[targetMonth]} ${targetYear}`;
  const selectedMonthKey = `${targetYear}-${String(targetMonth + 1).padStart(2, '0')}`;
  const isCurrentMonth = targetYear === now.getFullYear() && targetMonth === now.getMonth();

  return {
    selectedMonth: {
      key: selectedMonthKey,
      label: selectedMonthLabel,
      shortLabel: `${monthNames[targetMonth].slice(0, 3)} ${targetYear}`,
      isCurrentMonth,
    },
    kategoriBarang: { value: categoryCount ?? 0, change: 12 },
    totalItem: { value: itemCount ?? 0, change: 5 },
    pengguna: { value: userCount ?? 0, change: 0 },
    supplier: { value: supplierCount ?? 0, change: 2 },
    barangMasuk: {
      value: barangMasukNow,
      change: calcChange(barangMasukNow, barangMasukPrev),
    },
    barangKeluar: {
      value: barangKeluarNow,
      change: calcChange(barangKeluarNow, barangKeluarPrev),
    },
    persediaan: { value: totalPersediaan, change: 2 },
    totalValuasi: { value: totalValuasi, change: 4 },
    stokMenipisCount: lowStockList.length,
    lowStockItems: lowStockList.slice(0, 5),
    inventoryList: inventoryList.slice(0, 6),
    recentMovements,
  };
}