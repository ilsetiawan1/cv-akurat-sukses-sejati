// src/app/(dashboard)/dashboard/page.tsx
import { redirect } from 'next/navigation';
import { createClient } from '@/shared/lib/supabase/server';
import { getCurrentUser } from '@/features/users/services/user.service';
import {
  fetchDashboardStats,
  DashboardHeader,
  DashboardStatCards,
  RecentMovementsCard,
  CriticalStockCard,
} from '@/features/dashboard';

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  if (!authUser) redirect('/login');

  const user = await getCurrentUser(authUser.id);
  if (!user) redirect('/login');

  const { month } = await searchParams;
  const stats = await fetchDashboardStats(month);

  return (
    <div className="space-y-6 w-full pb-12 select-none font-sans">
      <DashboardHeader />
      <DashboardStatCards stats={stats} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <RecentMovementsCard movements={stats.recentMovements} />
        <CriticalStockCard
          lowStockCount={stats.stokMenipisCount}
          lowStockItems={stats.lowStockItems}
        />
      </div>
    </div>
  );
}
