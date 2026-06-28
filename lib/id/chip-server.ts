import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { validateChipRaw } from '@/lib/id/chip-id';
import type { ChipLookupResult, ChipScanSource, ChipValidationResult } from '@/lib/id/chip-types';
import { writeAuditLog } from '@/lib/id/audit';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export function parseChipInput(raw: string): ChipValidationResult {
  return validateChipRaw(raw);
}

export async function lookupChipByNormalized(normalized: string): Promise<ChipLookupResult> {
  const admin = createSupabaseAdminClient();
  const client = admin ?? (await createSupabaseServerClient());

  const { data: pet, error } = await client
    .from('pets')
    .select('id, name, microchip_id_normalized')
    .eq('microchip_id_normalized', normalized)
    .maybeSingle();

  if (error || !pet) {
    return { freedomPawsMatch: false };
  }

  const { data: enrollment } = await client
    .from('biometric_enrollments')
    .select('freedom_paws_id, qr_slug, status')
    .eq('pet_id', pet.id)
    .eq('status', 'complete')
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  return {
    freedomPawsMatch: true,
    petId: pet.id,
    petName: pet.name,
    freedomPawsId: enrollment?.freedom_paws_id ?? undefined,
    qrSlug: enrollment?.qr_slug ?? undefined,
    enrollmentStatus: enrollment?.status ?? undefined,
  };
}

export async function linkChipToPet(
  userId: string,
  petId: string,
  raw: string
): Promise<{ success: true; validation: ChipValidationResult } | { success: false; error: string; validation?: ChipValidationResult }> {
  const validation = validateChipRaw(raw);
  if (!validation.ok || !validation.normalized) {
    return { success: false, error: validation.error ?? 'Invalid chip ID.', validation };
  }

  const supabase = await createSupabaseServerClient();

  const { data: pet, error: petErr } = await supabase
    .from('pets')
    .select('id, name')
    .eq('id', petId)
    .eq('owner_id', userId)
    .maybeSingle();

  if (petErr || !pet) {
    return { success: false, error: 'Pet not found.' };
  }

  const admin = createSupabaseAdminClient();
  if (admin) {
    const { data: existing } = await admin
      .from('pets')
      .select('id, name')
      .eq('microchip_id_normalized', validation.normalized)
      .neq('id', petId)
      .maybeSingle();

    if (existing) {
      return {
        success: false,
        error: 'This chip ID is already linked to another Freedom Paws pet.',
        validation,
      };
    }
  }

  const { error: updateErr } = await supabase
    .from('pets')
    .update({
      microchip_id: validation.display,
      microchip_id_normalized: validation.normalized,
      microchip_linked_at: new Date().toISOString(),
    })
    .eq('id', petId)
    .eq('owner_id', userId);

  if (updateErr) {
    if (updateErr.code === '23505') {
      return {
        success: false,
        error: 'This chip ID is already linked to another Freedom Paws pet.',
        validation,
      };
    }
    console.error('[chip link]', updateErr);
    return { success: false, error: 'Could not save chip ID.', validation };
  }

  await writeAuditLog(userId, 'chip.link', 'pet', petId, {
    normalized: validation.normalized,
    format: validation.format,
  });

  return { success: true, validation };
}

export async function logChipScanEvent(
  userId: string,
  raw: string,
  source: ChipScanSource,
  options?: { shelterId?: string | null; matchedPetId?: string | null }
): Promise<ChipValidationResult> {
  const validation = validateChipRaw(raw);

  try {
    const supabase = await createSupabaseServerClient();
    await supabase.from('chip_scan_events').insert({
      scanner_user_id: userId,
      shelter_id: options?.shelterId ?? null,
      raw_input: raw.slice(0, 500),
      normalized_id: validation.normalized,
      digit_count: validation.digitCount || null,
      validation_status: validation.status,
      freedom_paws_pet_id: options?.matchedPetId ?? null,
      source,
    });
  } catch (err) {
    console.warn('[chip scan event]', err);
  }

  return validation;
}
