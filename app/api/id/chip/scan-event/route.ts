import { NextRequest, NextResponse } from 'next/server';
import { requireApiUser } from '@/lib/api/auth';
import { lookupChipByNormalized } from '@/lib/id/chip-server';
import { validateChipRaw } from '@/lib/id/chip-id';
import type { ChipLookupResult, ChipScanSource } from '@/lib/id/chip-types';
import { createSupabaseServerClient } from '@/lib/supabase/server';

function parseSource(raw: string): ChipScanSource {
  if (raw === 'hid' || raw === 'web_serial') return raw;
  return 'manual';
}

export async function POST(request: NextRequest) {
  const { user, error } = await requireApiUser();
  if (error) return error;

  try {
    const body = (await request.json()) as {
      raw?: string;
      source?: string;
      shelterId?: string | null;
    };
    const raw = (body.raw ?? '').toString();
    if (!raw.trim()) {
      return NextResponse.json({ success: false, error: 'raw scan input is required.' }, { status: 400 });
    }

    const source = parseSource((body.source ?? 'manual').toString());
    const validation = validateChipRaw(raw);

    let lookup: ChipLookupResult = { freedomPawsMatch: false };
    if (validation.normalized) {
      lookup = await lookupChipByNormalized(validation.normalized);
    }

    try {
      const supabase = await createSupabaseServerClient();
      await supabase.from('chip_scan_events').insert({
        scanner_user_id: user!.id,
        shelter_id: body.shelterId ?? null,
        raw_input: raw.slice(0, 500),
        normalized_id: validation.normalized,
        digit_count: validation.digitCount || null,
        validation_status: validation.status,
        freedom_paws_pet_id: lookup.petId ?? null,
        source,
      });
    } catch (insertErr) {
      console.warn('[chip scan event insert]', insertErr);
    }

    return NextResponse.json({
      success: true,
      validation,
      lookup,
    });
  } catch (err) {
    console.error('[api/id/chip/scan-event]', err);
    return NextResponse.json({ success: false, error: 'Scan log failed.' }, { status: 500 });
  }
}
