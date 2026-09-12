// app/api/inventory/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { listInventory } from '@/lib/services/inventory.service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 10;
    const search = searchParams.get('search') || undefined;

    const result = await listInventory(page, limit, search);
    return NextResponse.json({ success: true, ...result });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal mengambil data persediaan';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
