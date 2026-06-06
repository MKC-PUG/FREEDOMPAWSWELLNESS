import { NextRequest, NextResponse } from 'next/server';
import { getPayloadStatus } from '@/lib/xumm/server';

export async function GET(request: NextRequest) {
  const uuid = request.nextUrl.searchParams.get('uuid')?.trim();
  if (!uuid) {
    return NextResponse.json(
      { ok: false, code: 'MISSING_UUID', error: 'Payload uuid is required.' },
      { status: 400 }
    );
  }

  const result = await getPayloadStatus(uuid);
  if (!result.ok) {
    return NextResponse.json(result, { status: 503 });
  }

  return NextResponse.json(result);
}
