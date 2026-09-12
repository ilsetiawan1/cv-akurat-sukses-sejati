// app/api/suppliers/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { listSuppliers, addSupplier } from '@/lib/services/supplier.service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 10;
    const search = searchParams.get('search') || undefined;

    const result = await listSuppliers(page, limit, search);
    return NextResponse.json({ success: true, ...result });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal mengambil data supplier';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await addSupplier(body);
    return NextResponse.json({ success: true, message: 'Supplier berhasil ditambahkan', data: result }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal menambahkan supplier';
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
