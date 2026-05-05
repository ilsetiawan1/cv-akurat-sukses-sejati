// app/(dashboard)/beranda/page.tsx

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/services/user.service';

export const dynamic = 'force-dynamic'; // Tambahkan ini

export default async function BerandaPage() {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();

  if (!authUser) redirect('/login');

  const user = await getCurrentUser(authUser.id);
  
  // Jika profil tidak ada, jangan langsung buang ke login 
  // karena user sebenarnya sudah terautentikasi.
  if (!user) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-red-600 font-bold">Profil Tidak Ditemukan</h1>
        <p>Akun Auth ({authUser.email}) aktif, tapi data profil di database tidak ada.</p>
        <p className="text-sm text-gray-500 mt-2">ID: {authUser.id}</p>
      </div>
    );
  }
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">Selamat Datang, {user.name}!</h1>

      <div className="grid grid-cols-12 gap-5">
        {['Kategori Barang', 'Pengguna', 'Supplier', 'Total Barang Masuk', 'Total Barang Keluar', 'Total Persediaan Barang'].map((label) => (
          <div
            key={label}
            className="col-span-4 bg-white rounded-xl border border-gray-200 p-6 animate-pulse"
          >
            <p className="text-sm text-gray-500 mb-2">{label}</p>
            <div className="h-8 w-16 bg-gray-100 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
