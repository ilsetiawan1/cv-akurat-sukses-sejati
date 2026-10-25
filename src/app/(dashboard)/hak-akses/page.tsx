// app/(dashboard)/hak-akses/page.tsx

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/services/user.service';
import { UserTable } from '@/components/hak-akses/UserTable';

export default async function HakAksesPage() {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();
  if (!authUser) redirect('/login');

  const currentUser = await getCurrentUser(authUser.id);
  if (!currentUser) redirect('/login');

  const perm = currentUser.user_permissions?.find(p => p.feature === 'hak_akses');
  const canRead = currentUser.role === 'super_admin' || !!perm?.can_read;
  const canCreate = currentUser.role === 'super_admin' || !!perm?.can_create;
  const canUpdate = currentUser.role === 'super_admin' || !!perm?.can_update;
  const canDelete = currentUser.role === 'super_admin' || !!perm?.can_delete;

  if (!canRead) {
    return (
      <div className="flex flex-col items-center justify-center h-72 bg-white rounded-2xl border border-gray-200 p-6 text-center shadow-xs">
        <div className="w-14 h-14 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-3.5">
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-lg font-bold text-gray-900 mb-1">Akses Dibatasi</h2>
        <p className="text-sm text-gray-500 max-w-md">Anda tidak memiliki wewenang untuk mengakses atau mengelola modul Hak Akses Pengguna.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Hak Akses Pengguna</h1>
        <p className="text-sm text-gray-500 mt-1">Kelola akun dan hak akses pengguna sistem</p>
      </div>

      <UserTable canCreate={canCreate} canUpdate={canUpdate} canDelete={canDelete} />
    </div>
  );
}
