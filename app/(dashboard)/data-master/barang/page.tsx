// app/(dashboard)/data-master/barang/page.tsx
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/services/user.service';
import ItemTable from '@/components/data-master/ItemTable';
import { listItems } from '@/lib/services/item.service';
import { getAllCategories } from '@/lib/repositories/category.repository';
import { getAllUnits } from '@/lib/repositories/unit.repository';
import type { UserRole } from '@/types/user.types';

export default async function DataBarangPage(props: {
  searchParams?: Promise<{
    search?: string;
    category?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const search = searchParams?.search || '';
  const category = searchParams?.category || '';
  const page = Number(searchParams?.page) || 1;
  const limit = 10;

  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();
  if (!authUser) redirect('/login');

  const currentUser = await getCurrentUser(authUser.id);
  if (!currentUser) redirect('/login');

  const perm = currentUser.user_permissions?.find((p: any) => p.feature === 'data_master');
  const role: UserRole = currentUser.role;
  const canCreate = role === 'super_admin' || !!perm?.can_create;
  const canUpdate = role === 'super_admin' || !!perm?.can_update;
  const canDelete = role === 'super_admin' || !!perm?.can_delete;

  const { data, total } = await listItems(page, limit, search, category);
  const categories = await getAllCategories();
  const units = await getAllUnits();

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Data Master Barang</h1>
        <p className="text-sm text-gray-500 mt-1">Kelola data seluruh barang, kategori, satuan, dan harga jual.</p>
      </div>

      <ItemTable 
        data={data}
        total={total}
        currentPage={page}
        limit={limit}
        searchQuery={search}
        categoryQuery={category}
        categories={categories}
        units={units}
        canCreate={canCreate}
        canUpdate={canUpdate}
        canDelete={canDelete}
      />
    </div>
  );
}
