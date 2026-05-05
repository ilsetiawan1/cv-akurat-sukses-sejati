// app/api/auth/login/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * POST /api/auth/login
 *
 * Menggunakan Route Handler agar cookie sesi Supabase bisa di-set 
 * dengan benar sebelum redirect. Menggunakan createClient dari 
 * lib/supabase/server.ts memastikan setAll cookie options
 * memiliki path: '/' secara default.
 */
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    
    // Inisialisasi client yang otomatis memanggil cookies().set() 
    // dari next/headers untuk mengubah response header.
    const supabase = await createClient();

    // Sign in (Otomatis set-cookie melalui client)
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    // Response sukses. Karena kita menggunakan cookies() dari next/headers,
    // Next.js akan otomatis menyisipkan Set-Cookie ke response ini.
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
