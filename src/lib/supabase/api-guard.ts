// lib/supabase/api-guard.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { User } from '@supabase/supabase-js';

/**
 * Helper untuk memvalidasi autentikasi pengguna pada API Route Handlers.
 * Mengembalikan objek User jika terautentikasi, atau NextResponse 401 jika belum login.
 */
export async function authenticateApiRequest(): Promise<{ user: User; errorResponse: null } | { user: null; errorResponse: NextResponse }> {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return {
        user: null,
        errorResponse: NextResponse.json(
          {
            success: false,
            error: {
              code: 'UNAUTHORIZED',
              message: 'Akses ditolak: Sesi tidak valid atau belum login. Silakan lakukan POST /api/auth/login terlebih dahulu.',
            },
          },
          { status: 401 }
        ),
      };
    }

    return { user, errorResponse: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Autentikasi gagal';
    return {
      user: null,
      errorResponse: NextResponse.json(
        {
          success: false,
          error: {
            code: 'AUTH_ERROR',
            message,
          },
        },
        { status: 401 }
      ),
    };
  }
}
