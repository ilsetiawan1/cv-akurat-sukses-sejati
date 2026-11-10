// src/app/(dashboard)/hak-akses/page.tsx
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/features/users/services/user.service';
import { UserTable } from '@/features/users/components/UserTable';
import { AccessDeniedCard } from '@/components/ui/AccessDeniedCard';

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
    return <AccessDeniedCard message="Akun Anda tidak memiliki hak akses untuk mengelola Hak Akses Pengguna." />;
  }

  return (
    <div className="w-full space-y-5 sm:space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Kelola Akun Staf</h1>
        <p className="text-sm text-slate-500 mt-1">
          Kelola data akun staf, peran akses super admin / admin, dan matriks izin hak akses modul operasional.
        </p>
      </div>

      <UserTable canCreate={canCreate} canUpdate={canUpdate} canDelete={canDelete} />
    </div>
  );
}
