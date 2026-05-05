// app/(dashboard)/layout.tsx

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/services/user.service';
import { Sidebar } from '@/components/layout/Sidebar';

/**
 * Layout ini membungkus semua halaman di dalam grup (dashboard).
 * Berjalan di server — memverifikasi sesi sebelum render apapun.
 */
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // 1. Ambil sesi dari Supabase Auth
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  // 2. Jika tidak ada sesi, paksa ke login
  if (!authUser) {
    redirect('/login');
  }

  // 3. Ambil data user lengkap dari tabel users (termasuk permissions)
  const user = await getCurrentUser(authUser.id);
  if (!user) {
    // User ada di Auth tapi TIDAK di tabel public.users.
    // Sign out dulu agar middleware tidak redirect balik ke /beranda → infinite loop.
    await supabase.auth.signOut();
    redirect('/login');
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar tetap di kiri */}
      <Sidebar user={user} />

      {/* Konten halaman */}
      <main className="flex-1 min-w-0 overflow-auto">
        <div className="px-8 py-8">{children}</div>
      </main>
    </div>
  );
}
