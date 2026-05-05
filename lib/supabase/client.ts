// lib/supabase/client.ts

import { createBrowserClient } from '@supabase/ssr';

/**
 * Digunakan di dalam Client Components ('use client').
 * Membuat instance Supabase yang berjalan di browser.
 */
export function createClient() {
  return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
}
