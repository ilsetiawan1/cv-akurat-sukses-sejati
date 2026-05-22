import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/server-admin';
import { getCurrentUser } from '@/lib/services/user.service';
import ProfileForm from '@/components/pengaturan/ProfileForm';
import CategoryManager from '@/components/pengaturan/CategoryManager';
import UnitManager from '@/components/pengaturan/UnitManager';
import { cookies } from 'next/headers';

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

  const perm = currentUser.user_permissions?.find((p: any) => p.feature === 'pengaturan');
  const canRead = currentUser.role === 'super_admin' || !!perm?.can_read;

  if (!canRead) {
    return (
      <div className="flex items-center justify-center h-64 bg-white rounded-xl border border-gray-200">
        <p className="text-red-500 font-medium">Anda tidak memiliki akses untuk melihat pengaturan.</p>
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
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Pengaturan Sistem</h1>
        <p className="text-base text-gray-500 mt-2 max-w-2xl">Kelola profil pengguna, kredensial, parameter master data, dan identitas laporan perusahaan Anda.</p>
      </div>

      <div className="flex gap-4 border-b border-gray-200 mb-8 overflow-x-auto">
        <a href="?tab=profil" className={`px-6 py-3.5 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${tab === 'profil' ? 'border-[#7C3AED] text-[#7C3AED]' : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300'}`}>
          Profil & Keamanan Akun
        </a>
        <a href="?tab=kategori" className={`px-6 py-3.5 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${tab === 'kategori' ? 'border-[#7C3AED] text-[#7C3AED]' : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300'}`}>
          Manajemen Kategori
        </a>
        <a href="?tab=satuan" className={`px-6 py-3.5 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${tab === 'satuan' ? 'border-[#7C3AED] text-[#7C3AED]' : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300'}`}>
          Manajemen Satuan
        </a>
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
