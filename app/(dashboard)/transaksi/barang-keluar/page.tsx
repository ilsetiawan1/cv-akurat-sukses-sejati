// app/(dashboard)/transaksi/barang-keluar/page.tsx
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/services/user.service';
import GoodsIssueTable from '@/components/transaksi/GoodsIssueTable';
import { listGoodsIssues } from '@/lib/services/goods-issue.service';
import { getAllItems } from '@/lib/repositories/item.repository';
import { listInventory } from '@/lib/services/inventory.service';

export default async function BarangKeluarPage(props: {
  searchParams?: Promise<{ search?: string; page?: string; }>;
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

  const perm = currentUser.user_permissions?.find((p: any) => p.feature === 'transaksi');
  const canRead = currentUser.role === 'super_admin' || !!perm?.can_read;
  const canCreate = currentUser.role === 'super_admin' || !!perm?.can_create;

  if (!canRead) {
    return (
      <div className="flex items-center justify-center h-64 bg-white rounded-xl border border-gray-200">
        <p className="text-red-500 font-medium">Anda tidak memiliki akses untuk melihat halaman ini.</p>
      </div>
    );
  }

  const { data, total } = await listGoodsIssues(page, limit, search);
  
  const { data: rawItems } = await getAllItems();
  
  // Fetch inventory to show current stock and HPP in the dropdown
  const invData = await listInventory(1, 10000);
  
  const items = rawItems?.map((item: any) => {
    const inv = invData.data.find(i => i.item_id === item.id);
    return {
      ...item,
      current_stock: inv?.stock || 0,
      current_hpp: inv?.hpp || 0
    };
  }) || [];

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Data Barang Keluar</h1>
        <p className="text-sm text-gray-500 mt-1">Kelola transaksi pengeluaran stok (Otomatis mengurangi persediaan dan mencatat HPP).</p>
      </div>

      <GoodsIssueTable 
        data={data}
        total={total}
        currentPage={page}
        limit={limit}
        searchQuery={search}
        items={items}
        canCreate={canCreate}
      />
    </div>
  );
}
