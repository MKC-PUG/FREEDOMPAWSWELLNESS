import { NextRequest, NextResponse } from 'next/server';
import { requireApiUser } from '@/lib/api/auth';
import { linkChipToPet, lookupChipByNormalized } from '@/lib/id/chip-server';
import { validateChipRaw } from '@/lib/id/chip-id';

export async function POST(request: NextRequest) {
  const { user, error } = await requireApiUser();
  if (error) return error;

  try {
    const body = (await request.json()) as { petId?: string; raw?: string };
    const petId = (body.petId ?? '').trim();
    const raw = (body.raw ?? '').toString();

    if (!petId) {
      return NextResponse.json({ success: false, error: 'petId is required.' }, { status: 400 });
    }

    const result = await linkChipToPet(user!.id, petId, raw);
    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
          validation: result.validation,
        },
        { status: result.error?.includes('already linked') ? 409 : 400 }
      );
    }

    const lookup = result.validation.normalized
      ? await lookupChipByNormalized(result.validation.normalized)
      : { freedomPawsMatch: false };

    return NextResponse.json({
      success: true,
      validation: result.validation,
      lookup,
    });
  } catch (err) {
    console.error('[api/id/chip/link]', err);
    return NextResponse.json({ success: false, error: 'Could not link chip.' }, { status: 500 });
  }
}
