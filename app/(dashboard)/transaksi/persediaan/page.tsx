// app/(dashboard)/transaksi/persediaan/page.tsx
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/services/user.service';
import InventoryTable from '@/components/transaksi/InventoryTable';
import { listInventory } from '@/lib/services/inventory.service';
import type { UserPermission } from '@/types/user.types';

export default async function DataPersediaanPage(props: {
  searchParams?: Promise<{
    search?: string;
    page?: string;
  }>;
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

  if (!canRead) {
    return (
      <div className="flex items-center justify-center h-64 bg-white rounded-xl border border-gray-200">
        <p className="text-red-500 font-medium">Anda tidak memiliki akses untuk melihat halaman ini.</p>
      </div>
    );
  }

  const { data, total } = await listInventory(page, limit, search);

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Data Persediaan Barang</h1>
        <p className="text-sm text-gray-500 mt-1">
          Pantau sisa stok dan Nilai Harga Pokok Penjualan (HPP) untuk setiap barang.
        </p>
      </div>

      <InventoryTable 
        data={data}
        total={total}
        currentPage={page}
        limit={limit}
        searchQuery={search}
      />
    </div>
  );
}
