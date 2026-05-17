// app/(dashboard)/beranda/page.tsx

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/services/user.service';
import { fetchDashboardStats } from '@/lib/services/dashboard.service';
import { StatCard } from '@/components/beranda/StatCard';

export default async function BerandaPage() {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();
  if (!authUser) redirect('/login');

  const user = await getCurrentUser(authUser.id);
  if (!user) redirect('/login');

  const stats = await fetchDashboardStats();

  const cards = [
    {
      title: 'Kategori Barang',
      value: stats.kategoriBarang.value,
      change: stats.kategoriBarang.change,
    },
    {
      title: 'Pengguna',
      value: stats.pengguna.value,
      change: stats.pengguna.change,
    },
    {
      title: 'Supplier',
      value: stats.supplier.value,
      change: stats.supplier.change,
    },
    {
      title: 'Total Barang Masuk',
      value: stats.barangMasuk.value,
      change: stats.barangMasuk.change,
    },
    {
      title: 'Total Barang Keluar',
      value: stats.barangKeluar.value,
      change: stats.barangKeluar.change,
    },
    {
      title: 'Total Persediaan Barang',
      value: stats.persediaan.value,
      change: stats.persediaan.change,
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">
        Selamat Datang, {user.name}!
      </h1>

      <div className="grid grid-cols-2 lg:grid-cols-12 gap-4">
          {cards.map((card) => (
            <div
              key={card.title}
              className="col-span-1 lg:col-span-4"
            >
            <StatCard
              title={card.title}
              value={card.value}
              change={card.change}
            />
          </div>
        ))}
      </div>
    </div>
  );
}