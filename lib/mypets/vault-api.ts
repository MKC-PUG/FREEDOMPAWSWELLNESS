import type { PetVaultEntry, VaultEntryInput, VaultEntryKind } from '@/lib/mypets/vault-types';

export async function fetchVaultEntries(
  petId: string,
  kind?: VaultEntryKind
): Promise<PetVaultEntry[] | null> {
  const qs = kind ? `?kind=${encodeURIComponent(kind)}` : '';
  const res = await fetch(`/api/pets/${encodeURIComponent(petId)}/vault${qs}`, {
    credentials: 'include',
  });
  if (res.status === 401) return null;
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Could not load vault');
  return (data.entries ?? []) as PetVaultEntry[];
}

export async function createVaultEntryServer(
  petId: string,
  input: VaultEntryInput
): Promise<PetVaultEntry> {
  const res = await fetch(`/api/pets/${encodeURIComponent(petId)}/vault`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Could not save entry');
  return data.entry as PetVaultEntry;
}

export async function deleteVaultEntryServer(petId: string, entryId: string): Promise<void> {
  const res = await fetch(
    `/api/pets/${encodeURIComponent(petId)}/vault/${encodeURIComponent(entryId)}`,
    { method: 'DELETE', credentials: 'include' }
  );
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Could not delete entry');
}

export async function fetchVaultCount(petId: string): Promise<number | null> {
  const res = await fetch(`/api/pets/${encodeURIComponent(petId)}/vault?count=1`, {
    credentials: 'include',
  });
  if (res.status === 401) return null;
  const data = await res.json();
  if (!data.success) return 0;
  return data.count as number;
}
