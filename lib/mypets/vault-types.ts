export type VaultEntryKind = 'vet_record' | 'vaccination' | 'daily_note';

export type PetVaultEntry = {
  id: string;
  petId: string;
  kind: VaultEntryKind;
  title: string;
  body: string;
  /** ISO date string (YYYY-MM-DD) or null */
  recordDate: string | null;
  attachmentThumb: string | null;
  attachmentName: string | null;
  createdAt: string;
  updatedAt: string;
};

export type VaultEntryInput = {
  kind: VaultEntryKind;
  title: string;
  body?: string;
  recordDate?: string | null;
  attachmentThumb?: string | null;
  attachmentName?: string | null;
};

export const VAULT_KIND_LABELS: Record<
  VaultEntryKind,
  { label: string; emoji: string; addLabel: string; emptyHint: string }
> = {
  vet_record: {
    label: 'Vet records',
    emoji: '📋',
    addLabel: 'Add vet record',
    emptyHint: 'Upload vet visit summaries, lab results, or prescription notes.',
  },
  vaccination: {
    label: 'Vaccinations',
    emoji: '💉',
    addLabel: 'Add vaccination',
    emptyHint: 'Track rabies, Bordetella, and other vaccine dates.',
  },
  daily_note: {
    label: 'Daily notes',
    emoji: '📝',
    addLabel: 'Add daily note',
    emptyHint: 'Log mood, meals, supplements, walks, and wellness observations.',
  },
};
