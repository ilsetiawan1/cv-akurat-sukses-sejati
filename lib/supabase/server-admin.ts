// lib/supabase/server-admin.ts

import { createClient } from '@supabase/supabase-js';

/**
 * Admin client menggunakan SERVICE_ROLE KEY.
 * Melewati semua RLS policy — hanya gunakan dari server-side code
 * yang sudah memverifikasi autentikasi pengguna terlebih dahulu.
 *
 * JANGAN PERNAH expose client ini ke browser.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        // Matikan auto-refresh token — ini server-side only
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
