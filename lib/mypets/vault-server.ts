import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { PetVaultEntry, VaultEntryInput, VaultEntryKind } from '@/lib/mypets/vault-types';

type VaultRow = {
  id: string;
  pet_id: string;
  kind: VaultEntryKind;
  title: string;
  body: string;
  record_date: string | null;
  attachment_thumb: string | null;
  attachment_name: string | null;
  created_at: string;
  updated_at: string;
};

function rowToEntry(row: VaultRow): PetVaultEntry {
  return {
    id: row.id,
    petId: row.pet_id,
    kind: row.kind,
    title: row.title,
    body: row.body ?? '',
    recordDate: row.record_date,
    attachmentThumb: row.attachment_thumb,
    attachmentName: row.attachment_name,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function listVaultEntriesForPet(
  userId: string,
  petId: string,
  kind?: VaultEntryKind
): Promise<PetVaultEntry[]> {
  const supabase = await createSupabaseServerClient();
  let query = supabase
    .from('pet_vault_entries')
    .select('*')
    .eq('pet_id', petId)
    .eq('owner_id', userId)
    .order('record_date', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false });

  if (kind) query = query.eq('kind', kind);

  const { data, error } = await query;
  if (error) throw error;
  return (data as VaultRow[]).map(rowToEntry);
}

export async function countVaultEntriesForPet(userId: string, petId: string): Promise<number> {
  const supabase = await createSupabaseServerClient();
  const { count, error } = await supabase
    .from('pet_vault_entries')
    .select('*', { count: 'exact', head: true })
    .eq('pet_id', petId)
    .eq('owner_id', userId);

  if (error) throw error;
  return count ?? 0;
}

export async function createVaultEntryForPet(
  userId: string,
  petId: string,
  input: VaultEntryInput
): Promise<PetVaultEntry | null> {
  const supabase = await createSupabaseServerClient();

  const { data: pet } = await supabase
    .from('pets')
    .select('id')
    .eq('id', petId)
    .eq('owner_id', userId)
    .maybeSingle();

  if (!pet) return null;

  const { data, error } = await supabase
    .from('pet_vault_entries')
    .insert({
      pet_id: petId,
      owner_id: userId,
      kind: input.kind,
      title: input.title.trim(),
      body: input.body?.trim() ?? '',
      record_date: input.recordDate?.trim() || null,
      attachment_thumb: input.attachmentThumb ?? null,
      attachment_name: input.attachmentName ?? null,
    })
    .select('*')
    .single();

  if (error) throw error;
  return rowToEntry(data as VaultRow);
}

export async function deleteVaultEntryForPet(
  userId: string,
  petId: string,
  entryId: string
): Promise<boolean> {
  const supabase = await createSupabaseServerClient();
  const { error, count } = await supabase
    .from('pet_vault_entries')
    .delete({ count: 'exact' })
    .eq('id', entryId)
    .eq('pet_id', petId)
    .eq('owner_id', userId);

  if (error) throw error;
  return (count ?? 0) > 0;
}
