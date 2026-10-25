// app/api/items/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getItem, editItem, removeItem } from '@/lib/services/item.service';
import { authenticateApiRequest } from '@/lib/supabase/api-guard';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await authenticateApiRequest();
    if (auth.errorResponse) return auth.errorResponse;

    const { id } = await params;
    const item = await getItem(id);
    if (!item) {
      return NextResponse.json({ success: false, error: 'Barang tidak ditemukan' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: item });
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
    const auth = await authenticateApiRequest();
    if (auth.errorResponse) return auth.errorResponse;

    const { id } = await params;
    const body = await request.json();
    const updated = await editItem(id, body);
    return NextResponse.json({ success: true, message: 'Barang berhasil diperbarui', data: updated });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal memperbarui barang';
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await authenticateApiRequest();
    if (auth.errorResponse) return auth.errorResponse;

    const { id } = await params;
    await removeItem(id);
    return NextResponse.json({ success: true, message: 'Barang berhasil dihapus' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal menghapus barang';
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
