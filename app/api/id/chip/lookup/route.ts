import { NextRequest, NextResponse } from 'next/server';
import { requireApiUser } from '@/lib/api/auth';
import { lookupChipByNormalized } from '@/lib/id/chip-server';
import { extractChipDigits } from '@/lib/id/chip-id';

export async function GET(request: NextRequest) {
  const { error } = await requireApiUser();
  if (error) return error;

  const chip = request.nextUrl.searchParams.get('chip')?.trim() ?? '';
  const normalized = extractChipDigits(chip) ?? chip.replace(/\D/g, '');

  if (!normalized || ![9, 10, 15].includes(normalized.length)) {
    return NextResponse.json(
      { success: false, error: 'Provide a valid 9-, 10-, or 15-digit chip query.' },
      { status: 400 }
    );
  }

  try {
    const lookup = await lookupChipByNormalized(normalized);
    return NextResponse.json({
      success: true,
      normalized,
      ...lookup,
      registryNote:
        'Freedom Paws internal match only — AAHA/AVID registry lookup is Phase 2 (/id/lookup).',
    });
  } catch (err) {
    console.error('[api/id/chip/lookup]', err);
    return NextResponse.json({ success: false, error: 'Lookup failed.' }, { status: 500 });
  }
}
