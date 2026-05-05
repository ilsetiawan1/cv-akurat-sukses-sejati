// app/page.tsx

import { redirect } from 'next/navigation';

/**
 * Root route (/) langsung diarahkan ke /beranda.
 * Middleware akan menangani redirect ke /login jika belum login.
 */
export default function RootPage() {
  redirect('/beranda');
}
