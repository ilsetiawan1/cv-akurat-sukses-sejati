// src/app/(dashboard)/transaksi/barang-keluar/page.tsx
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/features/users/services/user.service';
import { GoodsIssueTable, getGoodsIssuePageData } from '@/features/goods-issue';
import type { UserPermission } from '@/features/users/types/user.types';

export default async function BarangKeluarPage(props: {
  searchParams?: Promise<{ search?: string; page?: string }>;
}) {
  const searchParams = await props.searchParams;
  const search = searchParams?.search || '';
  const page = Number(searchParams?.page) || 1;
  const limit = 10;

  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();
  if (!authUser) redirect('/login');

  const currentUser = await getCurrentUser(authUser.id);
  if (!currentUser) redirect('/login');

  const perm = currentUser.user_permissions?.find((p: UserPermission) => p.feature === 'transaksi');
  const canRead = currentUser.role === 'super_admin' || !!perm?.can_read;
  const canCreate = currentUser.role === 'super_admin' || !!perm?.can_create;

  if (!canRead) {
    return (
      <div className="flex items-center justify-center h-64 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
        <p className="text-rose-500 font-medium text-sm">Anda tidak memiliki akses untuk melihat halaman ini.</p>
      </div>
    );
  }

  const { issues, totalIssues, items } = await getGoodsIssuePageData(page, limit, search);

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Data Barang Keluar</h1>
        <p className="text-sm text-slate-500 mt-1">
          Kelola transaksi pengeluaran stok (Otomatis mengurangi persediaan dan mencatat HPP).
        </p>
      </div>

      <GoodsIssueTable 
        data={issues}
        total={totalIssues}
        currentPage={page}
        limit={limit}
        searchQuery={search}
        items={items}
        canCreate={canCreate}
      />
    </div>
  );
}
