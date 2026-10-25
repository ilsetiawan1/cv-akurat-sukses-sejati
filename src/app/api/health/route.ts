// app/api/health/route.ts
import { NextResponse } from 'next/server';
import { createAdminClient } from '@/shared/lib/supabase/server-admin';

export const dynamic = 'force-dynamic';

export async function GET() {
  const startTime = Date.now();
  try {
    const supabase = createAdminClient();

    // Query ringan: ambil 1 baris untuk memastikan database aktif & keepalive Supabase
    const { error } = await supabase
      .from('categories')
      .select('id')
      .limit(1);

    if (error) {
      return NextResponse.json(
        {
          status: 'error',
          database: 'disconnected',
          message: error.message,
          latency: `${Date.now() - startTime}ms`,
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      status: 'healthy',
      database: 'connected',
      latency: `${Date.now() - startTime}ms`,
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
    return NextResponse.json(
      {
        status: 'error',
        database: 'unreachable',
        message: errorMessage,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
