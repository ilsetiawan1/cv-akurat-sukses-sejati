// src/app/(dashboard)/transaksi/persediaan/page.tsx
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/features/users/services/user.service';
import { InventoryTable, getInventoryPageData } from '@/features/inventory';
import type { UserPermission } from '@/features/users/types/user.types';

export default async function DataPersediaanPage(props: {
  searchParams?: Promise<{
    search?: string;
    page?: string;
    category?: string;
    status?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const search = searchParams?.search || '';
  const page = Number(searchParams?.page) || 1;
  const category = searchParams?.category || '';
  const status = searchParams?.status || '';
  const limit = 10;

  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();
  if (!authUser) redirect('/login');

  const currentUser = await getCurrentUser(authUser.id);
  if (!currentUser) redirect('/login');

  const perm = currentUser.user_permissions?.find((p: UserPermission) => p.feature === 'transaksi');
  const canRead = currentUser.role === 'super_admin' || !!perm?.can_read;

  if (!canRead) {
    return (
      <div className="flex items-center justify-center h-64 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
        <p className="text-rose-500 font-medium text-sm">Anda tidak memiliki akses untuk melihat halaman ini.</p>
      </div>
    );
  }

  const { data, total, categories, stats } = await getInventoryPageData(page, limit, search, category, status);

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Data Persediaan Barang</h1>
        <p className="text-sm text-slate-500 mt-1">
          Pantau sisa stok dan Nilai Harga Pokok Penjualan (HPP) berjalan untuk setiap barang.
        </p>
      </div>

      <InventoryTable 
        data={data}
        total={total}
        currentPage={page}
        limit={limit}
        searchQuery={search}
        selectedCategory={category}
        selectedStatus={status}
        categories={categories}
        stats={stats}
      />
    </div>
  );
}
