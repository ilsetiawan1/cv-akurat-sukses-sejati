// src/app/(dashboard)/data-master/supplier/page.tsx
import { listSuppliers } from '@/features/suppliers/services/supplier.service';
import SupplierTable from '@/features/suppliers/components/SupplierTable';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/features/users/services/user.service';
import { redirect } from 'next/navigation';
import type { UserPermission } from '@/features/users/types/user.types';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SupplierPage({ searchParams }: PageProps) {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();

  if (!authUser) {
    redirect('/login');
  }

  const currentUser = await getCurrentUser(authUser.id);
  if (!currentUser) redirect('/login');

  const perm = currentUser.user_permissions?.find((p: UserPermission) => p.feature === 'data_master');
  const canRead = currentUser.role === 'super_admin' || !!perm?.can_read;
  const canCreate = currentUser.role === 'super_admin' || !!perm?.can_create;
  const canUpdate = currentUser.role === 'super_admin' || !!perm?.can_update;
  const canDelete = currentUser.role === 'super_admin' || !!perm?.can_delete;

  if (!canRead) {
    return (
      <div className="flex items-center justify-center h-64 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
        <p className="text-rose-500 font-medium text-sm">Anda tidak memiliki hak akses untuk melihat Data Supplier.</p>
      </div>
    );
  }

  const resolvedSearchParams = await searchParams;
  const page = typeof resolvedSearchParams.page === 'string' ? parseInt(resolvedSearchParams.page, 10) : 1;
  const search = typeof resolvedSearchParams.search === 'string' ? resolvedSearchParams.search : undefined;
  const limit = 10;

  const { data, total } = await listSuppliers(page, limit, search);

  return (
    <div className="w-full space-y-5 sm:space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Data Supplier</h1>
        <p className="text-sm text-slate-500 mt-1">
          Kelola data master supplier rekanan untuk keperluan pengadaan barang masuk.
        </p>
      </div>
      
      <SupplierTable 
        data={data} 
        total={total} 
        currentPage={page} 
        limit={limit} 
        searchQuery={search || ''} 
        canCreate={canCreate}
        canUpdate={canUpdate}
        canDelete={canDelete}
      />
    </div>
  );
}
