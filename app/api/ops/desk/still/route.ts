import { NextResponse } from 'next/server';
import { requireFpOps } from '@/lib/api/auth';
import { readLockedStill } from '@/lib/ops/studio-render';

export async function GET() {
  const { error } = await requireFpOps();
  if (error) return error;
  try {
    const still = readLockedStill();
    return new NextResponse(new Uint8Array(still), {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'private, max-age=86400',
      },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Still missing';
    return NextResponse.json({ success: false, error: message }, { status: 404 });
  }
}
