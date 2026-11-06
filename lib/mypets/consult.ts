import { randomBytes } from 'crypto';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import type { VaultEntryKind } from '@/lib/mypets/vault-types';

export const VAULT_MEDIA_BUCKET = 'pet-vault-media';
export const CONSULT_DAYS = 14;

const VIDEO_TYPES = new Set(['video/mp4', 'video/quicktime', 'video/webm']);

type ShareRow = {
  token: string;
  pet_id: string;
  owner_id: string;
  expires_at: string;
};

type EntryRow = {
  id: string;
  kind: VaultEntryKind;
  title: string;
  body: string;
  record_date: string | null;
  attachment_thumb: string | null;
  attachment_name: string | null;
  storage_path: string | null;
  created_at: string;
};

export type ConsultEntry = {
  id: string;
  kind: VaultEntryKind;
  title: string;
  note: string;
  recordDate: string | null;
  imageUrl: string | null;
  fileName: string | null;
  videoUrl: string | null;
};

export type ConsultPacket = {
  petName: string;
  expiresAt: string;
  entries: ConsultEntry[];
};

export function ownerFacingNote(body: string): string {
  return body
    .split('\n')
    .filter((line) => !/^clipId:\S+/.test(line.trim()))
    .join('\n')
    .trim();
}

function extFor(contentType: string): string {
  if (contentType === 'video/quicktime') return '.mov';
  if (contentType === 'video/webm') return '.webm';
  return '.mp4';
}

export async function createGaitCloudEntry(input: {
  userId: string;
  petId: string;
  seen: string;
  fileName: string;
  contentType: string;
  clipId: string;
}): Promise<{ entryId: string; signedUrl: string }> {
  const admin = createSupabaseAdminClient();
  if (!admin) throw new Error('Vault storage is not configured.');
  const contentType = VIDEO_TYPES.has(input.contentType) ? input.contentType : 'video/mp4';
  const entryId = crypto.randomUUID();
  const storagePath = `${input.userId}/${input.petId}/${entryId}${extFor(contentType)}`;
  const today = new Date().toISOString().slice(0, 10);
  const body = [`clipId:${input.clipId}`, input.seen, 'Walking video for this dog.'].join('\n');

  const { error: insertError } = await admin.from('pet_vault_entries').insert({
    id: entryId,
    pet_id: input.petId,
    owner_id: input.userId,
    kind: 'gait_clip',
    title: 'Gait video',
    body,
    record_date: today,
    attachment_name: input.fileName || 'gait-video',
    storage_path: storagePath,
  });
  if (insertError) throw insertError;

  const signed = await admin.storage.from(VAULT_MEDIA_BUCKET).createSignedUploadUrl(storagePath);
  if (signed.error || !signed.data?.signedUrl) {
    throw signed.error ?? new Error('Could not prepare the video upload.');
  }
  return { entryId, signedUrl: signed.data.signedUrl };
}

export async function createConsultShare(input: {
  userId: string;
  petId: string;
}): Promise<{ token: string; expiresAt: string }> {
  const admin = createSupabaseAdminClient();
  if (!admin) throw new Error('Vault storage is not configured.');
  const token = randomBytes(24).toString('base64url');
  const expiresAt = new Date(Date.now() + CONSULT_DAYS * 24 * 60 * 60 * 1000).toISOString();
  const { error } = await admin.from('pet_vault_shares').insert({
    token,
    pet_id: input.petId,
    owner_id: input.userId,
    expires_at: expiresAt,
  });
  if (error) throw error;
  return { token, expiresAt };
}

export async function loadConsult(token: string): Promise<ConsultPacket | null> {
  const admin = createSupabaseAdminClient();
  if (!admin) return null;

  const { data: share, error: shareError } = await admin
    .from('pet_vault_shares')
    .select('token, pet_id, owner_id, expires_at')
    .eq('token', token)
    .maybeSingle();
  if (shareError || !share) return null;
  const row = share as ShareRow;
  if (new Date(row.expires_at).getTime() < Date.now()) return null;

  const { data: pet } = await admin.from('pets').select('name').eq('id', row.pet_id).maybeSingle();
  const { data: entries, error: entryError } = await admin
    .from('pet_vault_entries')
    .select('id, kind, title, body, record_date, attachment_thumb, attachment_name, storage_path, created_at')
    .eq('pet_id', row.pet_id)
    .eq('owner_id', row.owner_id)
    .order('record_date', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false });
  if (entryError) throw entryError;

  const consultEntries: ConsultEntry[] = [];
  for (const entry of (entries ?? []) as EntryRow[]) {
    let videoUrl: string | null = null;
    if (entry.storage_path) {
      const signed = await admin.storage
        .from(VAULT_MEDIA_BUCKET)
        .createSignedUrl(entry.storage_path, 60 * 60 * 2);
      videoUrl = signed.data?.signedUrl ?? null;
    }
    const thumb = entry.attachment_thumb;
    const imageUrl = thumb && (thumb.startsWith('data:image') || thumb.startsWith('http')) ? thumb : null;
    consultEntries.push({
      id: entry.id,
      kind: entry.kind,
      title: entry.title,
      note: ownerFacingNote(entry.body ?? ''),
      recordDate: entry.record_date,
      imageUrl,
      fileName: imageUrl ? null : entry.attachment_name,
      videoUrl,
    });
  }

  return {
    petName: (pet as { name?: string } | null)?.name || 'This dog',
    expiresAt: row.expires_at,
    entries: consultEntries,
  };
}
