// app/api/reports/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { generateReportData } from '@/lib/services/report.service';
import { authenticateApiRequest } from '@/lib/supabase/api-guard';

export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateApiRequest();
    if (auth.errorResponse) return auth.errorResponse;

    const { searchParams } = new URL(request.url);
    const today = new Date().toISOString().split('T')[0];
    const startDate = searchParams.get('start') || new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
    const endDate = searchParams.get('end') || today;

    const data = await generateReportData(startDate, endDate);
    return NextResponse.json({ success: true, ...data });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal menghasilkan laporan';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
