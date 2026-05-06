// lib/repositories/dashboard.repository.ts

import { createAdminClient } from '@/lib/supabase/server-admin';

/**
 * DATA ACCESS LAYER — query statistik untuk halaman beranda.
 * Menggunakan admin client agar tidak diblokir RLS.
 */

export async function getDashboardStats() {
  const supabase = createAdminClient();

  const now = new Date();
  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59).toISOString();

  const [
    { count: categoryCount },
    { count: userCount },
    { count: supplierCount },
    { data: receiptThisMonth },
    { data: receiptLastMonth },
    { data: issueThisMonth },
    { data: issueLastMonth },
    { data: inventoryData },
  ] = await Promise.all([
    // Kategori Barang
    supabase.from('categories').select('*', { count: 'exact', head: true }),

    // Pengguna
    supabase.from('users').select('*', { count: 'exact', head: true }),

    // Supplier
    supabase.from('suppliers').select('*', { count: 'exact', head: true }),

    // Barang Masuk bulan ini
    supabase
      .from('goods_receipts')
      .select('quantity')
      .gte('receipt_date', startOfThisMonth),

    // Barang Masuk bulan lalu
    supabase
      .from('goods_receipts')
      .select('quantity')
      .gte('receipt_date', startOfLastMonth)
      .lte('receipt_date', endOfLastMonth),

    // Barang Keluar bulan ini
    supabase
      .from('goods_issues')
      .select('quantity')
      .gte('issue_date', startOfThisMonth),

    // Barang Keluar bulan lalu
    supabase
      .from('goods_issues')
      .select('quantity')
      .gte('issue_date', startOfLastMonth)
      .lte('issue_date', endOfLastMonth),

    // Total Persediaan
    supabase.from('inventory').select('stock'),
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
  const totalPersediaan = (inventoryData ?? []).reduce(
    (acc, r) => acc + ((r as { stock: number }).stock ?? 0),
    0
  );

  return {
    kategoriBarang: { value: categoryCount ?? 0, change: 12 },
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
  };
}