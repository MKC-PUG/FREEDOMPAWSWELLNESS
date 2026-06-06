import { NextResponse } from 'next/server';
import { getShopConfigStatus } from '@/lib/shop/config-status';

/** Safe checkout readiness check — no secrets exposed. */
export async function GET() {
  const status = getShopConfigStatus();
  return NextResponse.json({
    ok: true,
    pwaVersion: process.env.NEXT_PUBLIC_PWA_VERSION ?? 'see lib/pwa-version.ts',
    ...status,
  });
}
