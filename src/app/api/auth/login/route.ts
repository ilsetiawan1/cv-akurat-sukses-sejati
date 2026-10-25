// app/api/auth/login/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    
    // Inisialisasi response terlebih dahulu
    const response = NextResponse.json({ success: true });

    // Gunakan createServerClient lokal agar kita bisa memaksa set cookies
    // langsung ke objek response, bukan mengandalkan cookies() dari next/headers
    // yang kadang memiliki masalah sinkronisasi di Route Handlers.
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!, 
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, 
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              // PENTING: Paksa path: '/' agar cookie bisa dibaca oleh /beranda
              response.cookies.set(name, value, {
                ...options,
                path: options?.path ?? '/',
              });
            });
          },
        },
      }
    );

    // Sign in (Otomatis memanggil setAll)
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    // Kembalikan response yang sudah berisi Set-Cookie
    return response;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Terjadi kesalahan pada server';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
