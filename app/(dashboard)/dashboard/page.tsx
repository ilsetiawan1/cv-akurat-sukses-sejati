// app/(dashboard)/dashboard/page.tsx

import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
  RotateCw,
  Search,
  Filter,
  Boxes,
  Clock,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/services/user.service';
import { fetchDashboardStats } from '@/lib/services/dashboard.service';

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  if (!authUser) redirect('/login');

  const user = await getCurrentUser(authUser.id);
  if (!user) redirect('/login');

  const stats = await fetchDashboardStats();

  // Pembulatan angka valuasi agar bersih tanpa desimal koma
  const roundedValuasi = Math.round(stats.totalValuasi.value);
  const valuasiJuta = (roundedValuasi / 1_000_000).toFixed(1).replace('.', ',');

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 select-none font-sans">
      {/* ── 1. Top Section: Header & Action Pill ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-[26px] font-bold text-slate-900 tracking-tight leading-snug">
            Dashboard Operasional
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Pantau pergerakan mutasi, stok persediaan, dan evaluasi HPP dalam satu layar.
          </p>
        </div>

        {/* Right Action Group */}
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          {/* Status Online Pill */}
          <div className="h-9 px-3.5 rounded-full bg-white border border-slate-100 shadow-2xs text-xs font-medium text-slate-700 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Sistem Aktif (Online)</span>
          </div>

          {/* Primary Action Button */}
          <Link
            href="/transaksi/barang-masuk"
            className="h-9 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-all flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
          >
            <span>+ Catat Barang Masuk</span>
          </Link>

          {/* Refresh Icon Button */}
          <Link
            href="/dashboard"
            className="w-9 h-9 rounded-xl bg-white hover:bg-slate-50 border border-slate-100 shadow-2xs flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
            title="Muat ulang data"
          >
            <RotateCw size={14} />
          </Link>
        </div>
      </div>

      {/* ── 2. Top Row: 3 Clean Minimalist Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Total Modal Persediaan (Angka Bulat Bersih) */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-5 flex flex-col justify-between min-h-[145px] hover:border-slate-200/80 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Modal Persediaan</span>
            <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-500">
              HPP BERJALAN
            </span>
          </div>

          <div className="my-2.5">
            <div className="flex items-baseline">
              <span className="text-lg sm:text-xl font-normal text-slate-400 mr-1">Rp</span>
              <span className="text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums tracking-tight">
                {roundedValuasi.toLocaleString('id-ID')}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">~Rp {valuasiJuta} Juta aset stok</p>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                Aktif
              </span>
              <span className="text-[11px] text-slate-400">kalkulasi moving average</span>
            </div>

            {/* Smooth Emerald Wave SVG */}
            <svg width="76" height="24" viewBox="0 0 76 24" fill="none" className="shrink-0">
              <path
                d="M2 18C14 18 20 12 30 14C40 16 50 4 64 6C70 7 73 4 74 3"
                stroke="#10b981"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Card 2: Total Fisik Persediaan */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-5 flex flex-col justify-between min-h-[145px] hover:border-slate-200/80 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Fisik Persediaan</span>
            <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-500">
              {stats.persediaan.value} UNIT
            </span>
          </div>

          <div className="my-2.5">
            <div className="flex items-baseline">
              <span className="text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums tracking-tight">
                {stats.persediaan.value.toLocaleString('id-ID')}
              </span>
              <span className="text-xs text-slate-400 font-medium ml-2">unit fisik</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">{stats.totalItem.value} SKU katalog terdaftar</p>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md">
                Siap Kirim
              </span>
              <span className="text-[11px] text-slate-400">stok fisik prima</span>
            </div>

            {/* Smooth Sky Blue Wave SVG */}
            <svg width="76" height="24" viewBox="0 0 76 24" fill="none" className="shrink-0">
              <path
                d="M2 19C16 19 24 16 34 17C46 18 52 6 64 7C70 8 72 5 74 4"
                stroke="#0ea5e9"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Card 3: Barang Keluar Bulan Ini */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-5 flex flex-col justify-between min-h-[145px] hover:border-slate-200/80 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Barang Keluar (Bulan Ini)</span>
            <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-500">
              PENJUALAN & SERVIS
            </span>
          </div>

          <div className="my-2.5">
            <div className="flex items-baseline">
              <span className="text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums tracking-tight">
                {stats.barangKeluar.value}
              </span>
              <span className="text-xs text-slate-400 font-medium ml-2">unit dikeluarkan</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">+{stats.barangMasuk.value} unit masuk bulan ini</p>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-slate-400">
                {stats.supplier.value} rekanan distributor aktif
              </span>
            </div>

            {/* Smooth Slate Wave SVG */}
            <svg width="76" height="24" viewBox="0 0 76 24" fill="none" className="shrink-0">
              <path
                d="M2 14C12 14 22 16 34 16C46 16 54 9 64 10C70 11 72 8 74 7"
                stroke="#64748b"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* ── 3. Middle Row: 2 Kolom Fungsional Seimbang (Tanpa Grafik Bar) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Kolom Kiri: Aktivitas Mutasi Terkini */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-1">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                Aktivitas Mutasi Terkini
              </h3>
              <span className="text-[10px] font-medium text-slate-400">Real-time</span>
            </div>
            <p className="text-xs text-slate-400 mb-3">
              5 transaksi barang masuk dan keluar terakhir di sistem
            </p>

            {/* Search Input */}
            <div className="relative mb-3">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
              <input
                type="text"
                placeholder="Cari aktivitas atau kode transaksi..."
                className="w-full h-9 pl-9 pr-3 text-xs bg-slate-50/80 rounded-xl text-slate-800 placeholder:text-slate-400 outline-none border border-transparent focus:border-slate-200 transition-all"
              />
            </div>

            {/* List Transaksi */}
            <div className="mt-2">
              {stats.recentMovements.length === 0 ? (
                <div className="py-10 text-center text-slate-400">
                  <Clock size={28} className="mx-auto mb-2 text-slate-300 stroke-[1.5]" />
                  <p className="font-semibold text-slate-700 text-xs">Belum ada aktivitas operasional</p>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                    Pergerakan barang masuk & keluar akan muncul di sini
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {stats.recentMovements.map((mov) => {
                    const isEntry = mov.type === 'IN';
                    return (
                      <div key={mov.id} className="py-3 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span
                            className={`w-2 h-2 rounded-full shrink-0 ${
                              isEntry ? 'bg-emerald-500' : 'bg-slate-400'
                            }`}
                          />
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-slate-800 truncate">
                              {mov.itemName}
                            </p>
                            <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                              {mov.code} • {isEntry ? 'Barang Masuk' : 'Barang Keluar'}
                            </p>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span
                            className={`text-xs font-bold tabular-nums ${
                              isEntry ? 'text-emerald-600' : 'text-slate-800'
                            }`}
                          >
                            {isEntry ? `+${mov.quantity}` : `-${mov.quantity}`}
                          </span>
                          <p className="text-[10px] text-slate-400 whitespace-nowrap mt-0.5">
                            {mov.date
                              ? new Date(mov.date).toLocaleDateString('id-ID', {
                                  day: 'numeric',
                                  month: 'short',
                                })
                              : '-'}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-50 mt-3">
            <Link
              href="/laporan"
              className="text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors inline-flex items-center gap-1.5"
            >
              <span>Buka Seluruh Laporan Mutasi</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        {/* Kolom Kanan: Peringatan Stok Kritis (Perlu Restock) */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-1">
              <div className="flex items-center gap-2">
                <AlertTriangle
                  size={16}
                  className={
                    stats.stokMenipisCount > 0 ? 'text-amber-500' : 'text-slate-400'
                  }
                />
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                  Peringatan Stok Kritis
                </h3>
              </div>

              {stats.stokMenipisCount > 0 ? (
                <span className="text-[10px] font-semibold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                  {stats.stokMenipisCount} Perlu Restock
                </span>
              ) : (
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                  <CheckCircle2 size={11} className="text-emerald-500" />
                  Stok Aman
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mb-3">
              Daftar suku cadang dengan stok menipis di bawah ambang minimum (&le; 5 unit)
            </p>

            {/* List Barang Menipis */}
            <div className="divide-y divide-slate-100 mt-2">
              {stats.lowStockItems.length === 0 ? (
                <div className="py-12 text-center text-slate-400">
                  <CheckCircle2 size={32} className="mx-auto mb-2 text-emerald-500 stroke-[1.5]" />
                  <p className="text-xs font-bold text-slate-800">Semua Persediaan Aman</p>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    Tidak ada barang dengan stok menipis di bawah batas minimum saat ini.
                  </p>
                </div>
              ) : (
                stats.lowStockItems.map((item) => (
                  <div key={item.id} className="py-3 flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-slate-800 truncate">
                        {item.name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-mono text-slate-400">
                          {item.itemCode}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded text-nowrap">
                          {item.category}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-bold text-rose-600 tabular-nums">
                        {item.stock} {item.unit}
                      </span>
                      <div>
                        <Link
                          href={`/transaksi/barang-masuk?item_id=${item.id}`}
                          className="text-[11px] font-semibold text-slate-900 hover:underline mt-0.5 inline-block"
                        >
                          + Restock
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-50 mt-3">
            <Link
              href="/transaksi/persediaan"
              className="text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors inline-flex items-center gap-1.5"
            >
              <span>Kelola Status Persediaan Lengkap</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>

      {/* ── 4. Bottom Row: Tabel Ketersediaan Suku Cadang Gudang ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-6 space-y-4">
        {/* Table Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Ketersediaan Suku Cadang Hari Ini
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Ringkasan status persediaan suku cadang CV Akurat Sukses Sejati
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Filter Dropdown */}
            <div className="h-8 px-3 rounded-xl border border-slate-200/60 bg-white text-xs font-medium text-slate-700 shadow-2xs flex items-center gap-1.5 cursor-pointer">
              <Filter size={12} className="text-slate-400" />
              <span>Semua Status</span>
            </div>

            {/* Direct Link */}
            <Link
              href="/transaksi/persediaan"
              className="h-8 px-3 rounded-xl border border-slate-200/60 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>Kelola Status Barang ↗</span>
            </Link>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white text-slate-400 font-semibold border-b border-slate-100 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4 font-bold">KODE BARANG</th>
                <th className="py-3 px-4 font-bold">NAMA SUKU CADANG</th>
                <th className="py-3 px-4 font-bold">KATEGORI / SATUAN</th>
                <th className="py-3 px-4 font-bold">STOK FISIK</th>
                <th className="py-3 px-4 font-bold">STATUS STOK</th>
                <th className="py-3 px-4 text-right font-bold">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {stats.inventoryList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-400">
                    <Boxes size={24} className="mx-auto mb-2 text-slate-300" />
                    Belum ada data barang dalam inventaris.
                  </td>
                </tr>
              ) : (
                stats.inventoryList.map((item) => {
                  const isSafe = item.stock > 5;
                  const isLow = item.stock > 0 && item.stock <= 5;

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900 font-mono">
                        {item.itemCode}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800">
                        {item.name}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">
                        {item.category} ({item.unit})
                      </td>
                      <td className="py-3.5 px-4 font-bold tabular-nums text-slate-900">
                        {item.stock} {item.unit}
                      </td>
                      <td className="py-3.5 px-4">
                        {isSafe ? (
                          <span className="bg-slate-100 text-slate-700 text-[11px] font-medium px-2.5 py-0.5 rounded-full inline-flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Siap Kirim (Ready)
                          </span>
                        ) : isLow ? (
                          <span className="bg-amber-50 text-amber-700 text-[11px] font-medium px-2.5 py-0.5 rounded-full inline-flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            Stok Menipis
                          </span>
                        ) : (
                          <span className="bg-rose-50 text-rose-700 text-[11px] font-medium px-2.5 py-0.5 rounded-full inline-flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                            Habis
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          href={`/transaksi/barang-masuk?item_id=${item.id}`}
                          className="text-xs font-semibold text-slate-800 hover:text-slate-900 hover:underline cursor-pointer"
                        >
                          Restock
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
