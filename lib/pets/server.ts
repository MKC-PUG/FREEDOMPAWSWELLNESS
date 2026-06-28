import type { PetFormInput, PetProfile } from '@/lib/mypets/types';
import { createSupabaseServerClient } from '@/lib/supabase/server';

type PetRow = {
  id: string;
  owner_id: string;
  name: string;
  breed: string;
  age: string;
  notes: string;
  photo_url: string | null;
  photo_thumb: string | null;
  microchip_id?: string | null;
  microchip_linked_at?: string | null;
  created_at: string;
  updated_at: string;
};

export function rowToPetProfile(row: PetRow): PetProfile {
  return {
    id: row.id,
    name: row.name,
    breed: row.breed ?? '',
    age: row.age ?? '',
    notes: row.notes ?? '',
    photoThumb: row.photo_thumb,
    microchipId: row.microchip_id ?? null,
    microchipLinkedAt: row.microchip_linked_at ?? null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function listPetsForUser(userId: string): Promise<PetProfile[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('pets')
    .select('*')
    .eq('owner_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data as PetRow[]).map(rowToPetProfile);
}

export async function createPetForUser(
  userId: string,
  input: PetFormInput
): Promise<PetProfile> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('pets')
    .insert({
      owner_id: userId,
      name: input.name.trim(),
      breed: input.breed.trim(),
      age: input.age.trim(),
      notes: input.notes.trim(),
      photo_thumb: input.photoThumb,
    })
    .select('*')
    .single();

  if (error) throw error;
  return rowToPetProfile(data as PetRow);
}

export async function updatePetForUser(
  userId: string,
  petId: string,
  input: PetFormInput
): Promise<PetProfile | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('pets')
    .update({
      name: input.name.trim(),
      breed: input.breed.trim(),
      age: input.age.trim(),
      notes: input.notes.trim(),
      photo_thumb: input.photoThumb,
    })
    .eq('id', petId)
    .eq('owner_id', userId)
    .select('*')
    .maybeSingle();

  if (error) throw error;
  return data ? rowToPetProfile(data as PetRow) : null;
}

export async function deletePetForUser(userId: string, petId: string): Promise<boolean> {
  const supabase = await createSupabaseServerClient();
  const { error, count } = await supabase
    .from('pets')
    .delete({ count: 'exact' })
    .eq('id', petId)
    .eq('owner_id', userId);

  if (error) throw error;
  return (count ?? 0) > 0;
}

export async function getPetForUser(
  userId: string,
  petId: string
): Promise<PetProfile | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('pets')
    .select('*')
    .eq('id', petId)
    .eq('owner_id', userId)
    .maybeSingle();

  if (error) throw error;
  return data ? rowToPetProfile(data as PetRow) : null;
}
