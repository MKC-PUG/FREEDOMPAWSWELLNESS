import type { PetFormInput, PetProfile } from './types';

const STORAGE_KEY = 'fp-pet-profiles';

function newId(): string {
  return `pet-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function readPetProfiles(): PetProfile[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (p): p is PetProfile =>
        typeof p === 'object' &&
        p !== null &&
        typeof (p as PetProfile).id === 'string' &&
        typeof (p as PetProfile).name === 'string'
    );
  } catch {
    return [];
  }
}

function writePetProfiles(pets: PetProfile[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(pets));
}

export function createPetProfile(input: PetFormInput): PetProfile {
  const now = new Date().toISOString();
  const pet: PetProfile = {
    id: newId(),
    name: input.name.trim(),
    breed: input.breed.trim(),
    age: input.age.trim(),
    notes: input.notes.trim(),
    photoThumb: input.photoThumb,
    createdAt: now,
    updatedAt: now,
  };
  const pets = readPetProfiles();
  pets.unshift(pet);
  writePetProfiles(pets);
  return pet;
}

export function updatePetProfile(id: string, input: PetFormInput): PetProfile | null {
  const pets = readPetProfiles();
  const idx = pets.findIndex((p) => p.id === id);
  if (idx < 0) return null;
  const updated: PetProfile = {
    ...pets[idx],
    name: input.name.trim(),
    breed: input.breed.trim(),
    age: input.age.trim(),
    notes: input.notes.trim(),
    photoThumb: input.photoThumb,
    updatedAt: new Date().toISOString(),
  };
  pets[idx] = updated;
  writePetProfiles(pets);
  return updated;
}

export function deletePetProfile(id: string): void {
  writePetProfiles(readPetProfiles().filter((p) => p.id !== id));
}
