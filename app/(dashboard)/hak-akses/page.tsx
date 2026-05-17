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
  const canCreate = currentUser.role === 'super_admin' || !!perm?.can_create;
  const canUpdate = currentUser.role === 'super_admin' || !!perm?.can_update;
  const canDelete = currentUser.role === 'super_admin' || !!perm?.can_delete;

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
