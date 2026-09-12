// app/api/items/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { listItems, addItem } from '@/lib/services/item.service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 10;
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';

    const result = await listItems(page, limit, search, category);
    return NextResponse.json({ success: true, ...result });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal mengambil data barang';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await addItem(body);
    return NextResponse.json({ success: true, message: 'Barang berhasil ditambahkan', data: result }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal menambahkan barang';
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
