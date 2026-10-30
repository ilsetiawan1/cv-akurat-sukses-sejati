// src/app/(dashboard)/transaksi/barang-masuk/page.tsx
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/features/users/services/user.service';
import { GoodsReceiptTable, getGoodsReceiptPageData } from '@/features/goods-receipt';
import type { UserPermission } from '@/features/users/types/user.types';

export default async function BarangMasukPage(props: {
  searchParams?: Promise<{ search?: string; category?: string; month?: string; page?: string; item_id?: string }>;
}) {
  const searchParams = await props.searchParams;
  const search = searchParams?.search || '';
  const category = searchParams?.category || '';
  const month = searchParams?.month || '';
  const page = Number(searchParams?.page) || 1;
  const itemId = searchParams?.item_id || '';
  const limit = 10;

  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();
  if (!authUser) redirect('/login');

  const currentUser = await getCurrentUser(authUser.id);
  if (!currentUser) redirect('/login');

  const perm = currentUser.user_permissions?.find((p: UserPermission) => p.feature === 'transaksi');
  const canRead = currentUser.role === 'super_admin' || !!perm?.can_read;
  
  // Kasir (P03) hanya berwenang mencatat Barang Keluar, bukan Barang Masuk
  const isKasir = currentUser.user_code === 'P03' || currentUser.name.toLowerCase().includes('kasir');
  const canCreate = (currentUser.role === 'super_admin' || !!perm?.can_create) && !isKasir;
  const canDelete = currentUser.role === 'super_admin';

  if (!canRead) {
    return (
      <div className="flex items-center justify-center h-64 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
        <p className="text-rose-500 font-medium text-sm">Anda tidak memiliki akses untuk melihat halaman ini.</p>
      </div>
    );
  }

  const { 
    receipts, 
    totalReceipts, 
    stats,
    monthOptions,
    items, 
    suppliers, 
    categories 
  } = await getGoodsReceiptPageData(
    page, 
    limit, 
    search, 
    category,
    month
  );

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Data Barang Masuk</h1>
        <p className="text-sm text-slate-500 mt-1">
          Kelola transaksi penerimaan stok barang dari supplier dan kalkulasi HPP otomatis.
        </p>
      </div>

      <GoodsReceiptTable 
        data={receipts}
        total={totalReceipts}
        currentPage={page}
        limit={limit}
        searchQuery={search}
        selectedCategory={category}
        selectedMonth={month}
        categories={categories}
        monthOptions={monthOptions}
        stats={stats}
        items={items}
        suppliers={suppliers}
        canCreate={canCreate}
        canDelete={canDelete}
        initialItemId={itemId}
      />
    </div>
  );
}
