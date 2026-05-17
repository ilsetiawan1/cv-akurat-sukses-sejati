// app/(dashboard)/layout.tsx

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/services/user.service';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { MobileNavProvider } from '@/components/layout/MobileNavProvider';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    redirect('/login');
  }

  const user = await getCurrentUser(authUser.id);
  if (!user) {
    await supabase.auth.signOut();
    redirect('/login');
  }

  return (
    <MobileNavProvider>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar user={user} />
        
        {/* Konten Utama */}
        <div className="flex-1 flex flex-col min-w-0 pl-0 lg:pl-64 transition-all duration-300 ease-in-out">
          <Header />
          <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </MobileNavProvider>
  );
}
