// proxy.ts
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// proxy.ts
export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthPage = pathname.startsWith('/login');

  // 1. Inisialisasi response
  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  // 2. Inisialisasi Supabase
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        // Update request agar getUser() berikutnya melihat cookie baru
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));

        // Buat response baru agar header Set-Cookie benar-benar terkirim ke browser
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  // 3. Verifikasi User
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 4. Logika Redirect (PENTING: Gunakan headers dari response)
  if (!user && !isAuthPage) {
    return NextResponse.redirect(new URL('/login', request.url), {
      headers: response.headers, // Pastikan cookie (jika ada refresh) tetap terbawa
    });
  }

  // proxy.ts
  if (user && isAuthPage) {
    const url = new URL('/beranda', request.url);
    // PENTING: Gunakan response.headers agar cookie terbaru ikut terbawa
    return NextResponse.redirect(url, {
      headers: response.headers,
    });
  }
  return response;
}
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|bmp|tiff|woff|woff2)$).*)'],
};
