// app/api/goods-receipt/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { listGoodsReceipts, addGoodsReceipt } from '@/lib/services/goods-receipt.service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 10;
    const search = searchParams.get('search') || undefined;

    const result = await listGoodsReceipts(page, limit, search);
    return NextResponse.json({ success: true, ...result });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal mengambil data barang masuk';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Ambil user ID dari session jika ada, atau gunakan default admin jika dipanggil via API
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id || 'a9d004e5-5169-45af-ae0a-b80391703fff'; // default Budi Santoso (Kepala Gudang)

    const result = await addGoodsReceipt(userId, body);
    return NextResponse.json({ 
      success: true, 
      message: 'Transaksi barang masuk berhasil dicatat dan HPP telah diperbarui', 
      data: result 
    }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal mencatat transaksi barang masuk';
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
