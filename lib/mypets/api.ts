import type { PetFormInput, PetProfile } from './types';

export type PetsApiListResponse = {
  success: boolean;
  pets?: PetProfile[];
  source?: 'server' | 'local';
  error?: string;
};

export async function fetchServerPets(): Promise<PetProfile[] | null> {
  const res = await fetch('/api/pets', { credentials: 'include' });
  if (res.status === 401) return null;
  if (res.status === 503) return null;
  const data = (await res.json()) as PetsApiListResponse;
  if (!data.success || !data.pets) throw new Error(data.error || 'Failed to load pets');
  return data.pets;
}

export async function createServerPet(input: PetFormInput): Promise<PetProfile> {
  const res = await fetch('/api/pets', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Failed to create pet');
  return data.pet as PetProfile;
}

export async function updateServerPet(id: string, input: PetFormInput): Promise<PetProfile> {
  const res = await fetch(`/api/pets/${id}`, {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Failed to update pet');
  return data.pet as PetProfile;
}

export async function deleteServerPet(id: string): Promise<void> {
  const res = await fetch(`/api/pets/${id}`, { method: 'DELETE', credentials: 'include' });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Failed to delete pet');
}
