// app/(dashboard)/laporan/page.tsx
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/services/user.service';
import ReportFilterBar from '@/components/laporan/ReportFilterBar';
import ReportTable from '@/components/laporan/ReportTable';
import { generateReportData } from '@/lib/services/report.service';
import type { ReportFilterPeriod } from '@/types/report.types';
import { cookies } from 'next/headers';

function getDateRanges(period: ReportFilterPeriod, start?: string, end?: string) {
  const today = new Date();
  let startDate = new Date();
  let endDate = new Date();
  let text = '';

  if (period === 'hari_ini') {
    text = today.toLocaleDateString('id-ID');
  } else if (period === 'minggu_ini') {
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    startDate = new Date(today.setDate(diff));
    text = `Minggu Ini (${startDate.toLocaleDateString('id-ID')} - ${endDate.toLocaleDateString('id-ID')})`;
  } else if (period === 'bulan_ini') {
    startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    text = `Bulan Ini (${startDate.toLocaleDateString('id-ID')} - ${endDate.toLocaleDateString('id-ID')})`;
  } else if (period === 'kustom') {
    startDate = start ? new Date(start) : new Date(today.getFullYear(), today.getMonth(), 1);
    endDate = end ? new Date(end) : new Date();
    text = `${startDate.toLocaleDateString('id-ID')} - ${endDate.toLocaleDateString('id-ID')}`;
  }

  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
    text
  };
}

export default async function LaporanPage(props: {
  searchParams?: Promise<{ period?: string; start?: string; end?: string; }>;
}) {
  const searchParams = await props.searchParams;
  const period = (searchParams?.period as ReportFilterPeriod) || 'bulan_ini';
  const startParam = searchParams?.start;
  const endParam = searchParams?.end;

  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();
  if (!authUser) redirect('/login');

  const currentUser = await getCurrentUser(authUser.id);
  if (!currentUser) redirect('/login');

  const perm = currentUser.user_permissions?.find((p: any) => p.feature === 'laporan');
  const canRead = currentUser.role === 'super_admin' || !!perm?.can_read;

  if (!canRead) {
    return (
      <div className="flex items-center justify-center h-64 bg-white rounded-xl border border-gray-200">
        <p className="text-red-500 font-medium">Anda tidak memiliki akses untuk melihat laporan.</p>
      </div>
    );
  }

  // Tarik Informasi Perusahaan Dinamis dari Cookie (di-set via /pengaturan)
  const cookieStore = await cookies();
  const companyName = cookieStore.get('company_name')?.value || 'CV. AKURAT SUKSES SEJATI';
  const companyAddress = cookieStore.get('company_address')?.value || '';

  const ranges = getDateRanges(period, startParam, endParam);
  const { summary, receipts, issues } = await generateReportData(ranges.startDate, ranges.endDate);

  return (
    <div className="w-full">
      <div className="mb-6 print:hidden print-hide-all">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Laporan & Analitik</h1>
        <p className="text-base text-gray-500 mt-2 max-w-2xl">Pantau pergerakan uang masuk-keluar persediaan, margin HPP secara real-time dan ekspor laporan ke format cetak resmi.</p>
      </div>

      <div className="print:hidden print-hide-all">
        <ReportFilterBar />
      </div>
      
      <ReportTable 
        receipts={receipts}
        issues={issues}
        summary={summary}
        dateRangeText={ranges.text}
        companyName={companyName}
        companyAddress={companyAddress}
      />
    </div>
  );
}
