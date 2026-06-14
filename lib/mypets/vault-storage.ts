import type { PetVaultEntry, VaultEntryInput, VaultEntryKind } from '@/lib/mypets/vault-types';

const STORAGE_KEY = 'fp-pet-vault';

function readAll(): PetVaultEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as PetVaultEntry[];
  } catch {
    return [];
  }
}

function writeAll(entries: PetVaultEntry[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function newId(): string {
  return `vault-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function readVaultEntriesLocal(petId: string, kind?: VaultEntryKind): PetVaultEntry[] {
  const all = readAll().filter((e) => e.petId === petId);
  const filtered = kind ? all.filter((e) => e.kind === kind) : all;
  return filtered.sort((a, b) => {
    const da = a.recordDate ?? a.createdAt;
    const db = b.recordDate ?? b.createdAt;
    return db.localeCompare(da);
  });
}

export function countVaultEntriesLocal(petId: string): number {
  return readAll().filter((e) => e.petId === petId).length;
}

export function createVaultEntryLocal(petId: string, input: VaultEntryInput): PetVaultEntry {
  const now = new Date().toISOString();
  const entry: PetVaultEntry = {
    id: newId(),
    petId,
    kind: input.kind,
    title: input.title.trim(),
    body: input.body?.trim() ?? '',
    recordDate: input.recordDate?.trim() || null,
    attachmentThumb: input.attachmentThumb ?? null,
    attachmentName: input.attachmentName ?? null,
    createdAt: now,
    updatedAt: now,
  };
  writeAll([entry, ...readAll()]);
  return entry;
}

export function deleteVaultEntryLocal(entryId: string): boolean {
  const all = readAll();
  const next = all.filter((e) => e.id !== entryId);
  if (next.length === all.length) return false;
  writeAll(next);
  return true;
}
