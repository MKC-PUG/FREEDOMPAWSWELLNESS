import { NextRequest, NextResponse } from 'next/server';
import { requireApiUser } from '@/lib/api/auth';
import { parseChipInput } from '@/lib/id/chip-server';

export async function POST(request: NextRequest) {
  const { error } = await requireApiUser();
  if (error) return error;

  try {
    const body = (await request.json()) as { raw?: string };
    const raw = (body.raw ?? '').toString();
    const validation = parseChipInput(raw);

    return NextResponse.json({
      success: validation.ok,
      normalized: validation.normalized,
      digitCount: validation.digitCount,
      format: validation.format,
      checksumOk: validation.checksumOk,
      status: validation.status,
      error: validation.error,
    });
  } catch (err) {
    console.error('[api/id/chip/validate]', err);
    return NextResponse.json({ success: false, error: 'Validation failed.' }, { status: 500 });
  }
}
