// src/app/(dashboard)/pengaturan/page.tsx
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/server-admin';
import { getCurrentUser } from '@/features/users/services/user.service';
import ProfileForm from '@/features/settings/components/ProfileForm';
import CategoryManager from '@/features/settings/components/CategoryManager';
import UnitManager from '@/features/settings/components/UnitManager';
import { cookies } from 'next/headers';
import type { UserPermission } from '@/features/users/types/user.types';

export default async function PengaturanPage(props: {
  searchParams?: Promise<{ tab?: string }>;
}) {
  const searchParams = await props.searchParams;
  const tab = searchParams?.tab || 'profil';

  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();
  if (!authUser) redirect('/login');

  const currentUser = await getCurrentUser(authUser.id);
  if (!currentUser) redirect('/login');

  const perm = currentUser.user_permissions?.find((p: UserPermission) => p.feature === 'pengaturan');
  const canRead = currentUser.role === 'super_admin' || !!perm?.can_read;

  if (!canRead) {
    return (
      <div className="flex items-center justify-center h-64 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
        <p className="text-rose-500 font-medium text-sm">Anda tidak memiliki hak akses untuk melihat Pengaturan Sistem.</p>
      </div>
    );
  }

  // Fetch Data Master Settings
  const adminSupabase = createAdminClient();
  const [{ data: categories }, { data: units }] = await Promise.all([
    adminSupabase.from('categories').select('*').order('name', { ascending: true }),
    adminSupabase.from('units').select('*').order('name', { ascending: true })
  ]);

  const cookieStore = await cookies();
  const companyName = cookieStore.get('company_name')?.value || 'CV. AKURAT SUKSES SEJATI';
  const companyAddress = cookieStore.get('company_address')?.value || '';

  return (
    <div className="w-full space-y-5 sm:space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Pengaturan Sistem</h1>
        <p className="text-sm text-slate-500 mt-1 max-w-2xl">
          Kelola profil pengguna, kredensial keamanan, parameter master kategori & satuan, serta identitas kop laporan resmi.
        </p>
      </div>

      {/* Segmented Toggle Pills Tab Bar */}
      <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200/60 max-w-full overflow-x-auto">
        <Link 
          href="/pengaturan?tab=profil" 
          className={`px-4 py-2 text-xs font-medium rounded-lg transition-all whitespace-nowrap cursor-pointer ${
            tab === 'profil' 
              ? 'bg-white text-slate-900 shadow-2xs font-semibold' 
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Profil & Keamanan Akun
        </Link>
        <Link 
          href="/pengaturan?tab=kategori" 
          className={`px-4 py-2 text-xs font-medium rounded-lg transition-all whitespace-nowrap cursor-pointer ${
            tab === 'kategori' 
              ? 'bg-white text-slate-900 shadow-2xs font-semibold' 
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Manajemen Kategori
        </Link>
        <Link 
          href="/pengaturan?tab=satuan" 
          className={`px-4 py-2 text-xs font-medium rounded-lg transition-all whitespace-nowrap cursor-pointer ${
            tab === 'satuan' 
              ? 'bg-white text-slate-900 shadow-2xs font-semibold' 
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Manajemen Satuan
        </Link>
      </div>

      <div className="pb-10">
        {tab === 'profil' && (
          <ProfileForm user={currentUser} companyName={companyName} companyAddress={companyAddress} />
        )}
        {tab === 'kategori' && (
          <CategoryManager categories={categories || []} />
        )}
        {tab === 'satuan' && (
          <UnitManager units={units || []} />
        )}
      </div>
    </div>
  );
}
