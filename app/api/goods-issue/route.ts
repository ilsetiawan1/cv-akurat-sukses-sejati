// app/api/goods-issue/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { listGoodsIssues, addGoodsIssue } from '@/lib/services/goods-issue.service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 10;
    const search = searchParams.get('search') || undefined;

    const result = await listGoodsIssues(page, limit, search);
    return NextResponse.json({ success: true, ...result });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal mengambil data barang keluar';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id || '3f4fea5d-c0dd-46e0-bad6-b168d682f79d'; // default Siti Rahma (Kasir)

    const result = await addGoodsIssue(userId, body);
    return NextResponse.json({ 
      success: true, 
      message: 'Transaksi barang keluar berhasil dicatat', 
      data: result 
    }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal mencatat transaksi barang keluar';
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
