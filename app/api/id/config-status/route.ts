import { NextResponse } from 'next/server';
import { getIdConfigStatus } from '@/lib/id/config-status';

/** Public readiness check — booleans only, no secrets. */
export async function GET() {
  const status = getIdConfigStatus();
  return NextResponse.json({ success: true, ...status });
}
