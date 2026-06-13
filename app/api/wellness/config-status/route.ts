import { NextResponse } from 'next/server';
import { getWellnessConfigStatus } from '@/lib/wellness/config-status';

export async function GET() {
  const status = getWellnessConfigStatus();
  return NextResponse.json({ success: true, ...status });
}
