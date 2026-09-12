// app/api/suppliers/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSupplier, editSupplier, removeSupplier } from '@/lib/services/supplier.service';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supplier = await getSupplier(id);
    if (!supplier) {
      return NextResponse.json({ success: false, error: 'Supplier tidak ditemukan' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: supplier });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Terjadi kesalahan';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updated = await editSupplier(id, body);
    return NextResponse.json({ success: true, message: 'Supplier berhasil diperbarui', data: updated });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal memperbarui supplier';
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await removeSupplier(id);
    return NextResponse.json({ success: true, message: 'Supplier berhasil dihapus' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal menghapus supplier';
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
