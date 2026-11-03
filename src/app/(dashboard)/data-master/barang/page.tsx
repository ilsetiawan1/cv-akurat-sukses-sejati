// src/app/(dashboard)/data-master/barang/page.tsx
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/features/users/services/user.service';
import ItemTable from '@/features/items/components/ItemTable';
import { listItems } from '@/features/items/services/item.service';
import { getAllCategories } from '@/features/settings/repositories/category.repository';
import { getAllUnits } from '@/features/settings/repositories/unit.repository';
import type { UserRole, UserPermission } from '@/features/users/types/user.types';

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

  const perm = currentUser.user_permissions?.find((p: UserPermission) => p.feature === 'data_master');
  const role: UserRole = currentUser.role;
  const canRead = role === 'super_admin' || !!perm?.can_read;
  const canCreate = role === 'super_admin' || !!perm?.can_create;
  const canUpdate = role === 'super_admin' || !!perm?.can_update;
  const canDelete = role === 'super_admin' || !!perm?.can_delete;

  if (!canRead) {
    return (
      <div className="flex items-center justify-center h-64 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
        <p className="text-rose-500 font-medium text-sm">Anda tidak memiliki hak akses untuk melihat Data Barang.</p>
      </div>
    );
  }

  const { data, total } = await listItems(page, limit, search, category);
  const categories = await getAllCategories();
  const units = await getAllUnits();

  return (
    <div className="w-full space-y-5 sm:space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Data Master Barang</h1>
        <p className="text-sm text-slate-500 mt-1">
          Kelola master data suku cadang otomotif, pengelompokan kategori, satuan, dan penentuan harga jual.
        </p>
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
