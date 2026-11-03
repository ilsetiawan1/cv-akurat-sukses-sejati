// src/app/(dashboard)/laporan/page.tsx
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/features/users/services/user.service';
import ReportFilterBar from '@/features/reports/components/ReportFilterBar';
import ReportTable from '@/features/reports/components/ReportTable';
import { generateReportData } from '@/features/reports/services/report.service';
import type { UserPermission } from '@/features/users/types/user.types';
import { cookies } from 'next/headers';

function getDateRangeText(month?: string, start?: string, end?: string): string {
  if (month && month.length === 7 && month.includes('-')) {
    const parts = month.split('-');
    const y = Number(parts[0]);
    const m = Number(parts[1]);
    if (!Number.isNaN(y) && !Number.isNaN(m) && m >= 1 && m <= 12) {
      const d = new Date(y, m - 1, 1);
      return d.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
    }
  }
  if (start && end) {
    const s = new Date(start);
    const e = new Date(end);
    return `${s.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })} - ${e.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}`;
  }
  return 'Semua Periode';
}

export default async function LaporanPage(props: {
  searchParams?: Promise<{ month?: string; start?: string; end?: string; }>;
}) {
  const searchParams = await props.searchParams;
  // Default ke '' (Semua Periode) agar konsisten dengan menu Barang Masuk & Barang Keluar
  const month = searchParams?.month || '';
  const startParam = searchParams?.start;
  const endParam = searchParams?.end;

  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();
  if (!authUser) redirect('/login');

  const currentUser = await getCurrentUser(authUser.id);
  if (!currentUser) redirect('/login');

  const perm = currentUser.user_permissions?.find((p: UserPermission) => p.feature === 'laporan');
  const canRead = currentUser.role === 'super_admin' || !!perm?.can_read;

  if (!canRead) {
    return (
      <div className="flex items-center justify-center h-64 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
        <p className="text-rose-500 font-medium text-sm">Anda tidak memiliki akses untuk melihat laporan.</p>
      </div>
    );
  }

  // Tarik Informasi Perusahaan Dinamis dari Cookie (di-set via /pengaturan)
  const cookieStore = await cookies();
  const companyName = cookieStore.get('company_name')?.value || 'CV. AKURAT SUKSES SEJATI';
  const companyAddress = cookieStore.get('company_address')?.value || '';

  const { summary, mutations, monthOptions } = await generateReportData(month, startParam, endParam);
  const dateRangeText = getDateRangeText(month, startParam, endParam);

  return (
    <div className="w-full space-y-5 sm:space-y-6">
      <div className="print:hidden print-hide-all">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Laporan & Analitik</h1>
        <p className="text-sm text-slate-500 mt-1 max-w-2xl">
          Pantau pergerakan uang masuk-keluar persediaan, margin HPP secara real-time dan ekspor laporan ke format cetak resmi.
        </p>
      </div>

      <div className="print:hidden print-hide-all">
        <ReportFilterBar 
          selectedMonth={month}
          monthOptions={monthOptions}
        />
      </div>
      
      <ReportTable 
        mutations={mutations}
        summary={summary}
        dateRangeText={dateRangeText}
        companyName={companyName}
        companyAddress={companyAddress}
      />
    </div>
  );
}
