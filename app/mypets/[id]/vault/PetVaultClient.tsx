'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import BackLink from '@/app/components/BackLink';
import {
  createVaultEntryServer,
  deleteVaultEntryServer,
  fetchVaultEntries,
} from '@/lib/mypets/vault-api';
import { fileToVaultAttachment } from '@/lib/mypets/vault-attachment';
import {
  countVaultEntriesLocal,
  createVaultEntryLocal,
  deleteVaultEntryLocal,
  readVaultEntriesLocal,
} from '@/lib/mypets/vault-storage';
import type { PetVaultEntry, VaultEntryInput, VaultEntryKind } from '@/lib/mypets/vault-types';
import { VAULT_KIND_LABELS } from '@/lib/mypets/vault-types';

const TAB_ORDER: VaultEntryKind[] = ['vet_record', 'vaccination', 'daily_note'];

type Props = {
  petId: string;
  petName: string;
};

const EMPTY_FORM = {
  title: '',
  body: '',
  recordDate: '',
  attachmentThumb: null as string | null,
  attachmentName: null as string | null,
};

export default function PetVaultClient({ petId, petName }: Props) {
  const [activeKind, setActiveKind] = useState<VaultEntryKind>('vet_record');
  const [entries, setEntries] = useState<PetVaultEntry[]>([]);
  const [useServer, setUseServer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setFormError('');
    try {
      const serverEntries = await fetchVaultEntries(petId, activeKind);
      if (serverEntries !== null) {
        setEntries(serverEntries);
        setUseServer(true);
      } else {
        setEntries(readVaultEntriesLocal(petId, activeKind));
        setUseServer(false);
      }
    } catch {
      setEntries(readVaultEntriesLocal(petId, activeKind));
      setUseServer(false);
    } finally {
      setLoading(false);
    }
  }, [petId, activeKind]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setFormError('');
    setFormOpen(true);
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      const result = await fileToVaultAttachment(file);
      if (!result) {
        setFormError('Use JPG, PNG, HEIC, or PDF.');
        return;
      }
      setForm((f) => ({
        ...f,
        attachmentThumb: result.attachmentThumb,
        attachmentName: result.attachmentName,
      }));
      setFormError('');
    } catch {
      setFormError('Could not read that file.');
    }
  };

  const saveEntry = async () => {
    if (!form.title.trim()) {
      setFormError('Title is required.');
      return;
    }
    setSaving(true);
    setFormError('');
    const input: VaultEntryInput = {
      kind: activeKind,
      title: form.title,
      body: form.body,
      recordDate: form.recordDate || null,
      attachmentThumb: form.attachmentThumb,
      attachmentName: form.attachmentName,
    };
    try {
      if (useServer) {
        await createVaultEntryServer(petId, input);
      } else {
        createVaultEntryLocal(petId, input);
      }
      setFormOpen(false);
      await refresh();
    } catch {
      setFormError('Could not save — try again or sign in for cloud sync.');
    } finally {
      setSaving(false);
    }
  };

  const removeEntry = async (entryId: string) => {
    if (!window.confirm('Remove this vault entry?')) return;
    try {
      if (useServer) {
        await deleteVaultEntryServer(petId, entryId);
      } else {
        deleteVaultEntryLocal(entryId);
      }
      await refresh();
    } catch {
      setFormError('Could not remove entry.');
    }
  };

  const meta = VAULT_KIND_LABELS[activeKind];

  return (
    <div className="min-h-screen bg-[#0A1428] text-white p-6 sm:p-8 pb-20">
      <div className="max-w-lg mx-auto">
        <BackLink href="/mypets" label="Back to My Pets" />

        {!useServer && (
          <div className="mt-4 mb-4 rounded-2xl border border-amber-500/30 bg-amber-950/25 px-4 py-3 text-sm text-amber-200/90">
            Vault saved on this device.{' '}
            <Link href={`/login?next=/mypets/${encodeURIComponent(petId)}/vault`} className="font-semibold text-amber-300 underline">
              Sign in
            </Link>{' '}
            for cloud sync across phones.
          </div>
        )}

        <header className="mt-4 mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
            Wellness vault
          </p>
          <h1 className="mt-2 text-2xl font-bold">{petName}</h1>
          <p className="mt-2 text-sm text-white/60 leading-relaxed">
            Vet records, vaccinations, and daily wellness notes — private to you. Not shared with
            shelters unless you choose to export.
          </p>
        </header>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {TAB_ORDER.map((kind) => {
            const tab = VAULT_KIND_LABELS[kind];
            const active = activeKind === kind;
            return (
              <button
                key={kind}
                type="button"
                onClick={() => setActiveKind(kind)}
                className={`shrink-0 min-h-[44px] rounded-xl px-4 py-2 text-xs font-bold touch-manipulation ${
                  active
                    ? 'bg-emerald-500/25 border border-emerald-400/50 text-emerald-200'
                    : 'border border-white/15 text-white/65'
                }`}
              >
                {tab.emoji} {tab.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between gap-3 mb-4">
          <p className="text-sm text-white/55">{meta.emptyHint}</p>
          <button
            type="button"
            onClick={openAdd}
            className="shrink-0 min-h-[44px] rounded-xl bg-[#F5C242] px-4 text-xs font-bold text-black touch-manipulation"
          >
            + {meta.addLabel}
          </button>
        </div>

        {loading ? (
          <p className="text-center text-sm text-white/45 py-8">Loading vault…</p>
        ) : entries.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 bg-[#1F2A44]/50 p-8 text-center">
            <span className="text-4xl">{meta.emoji}</span>
            <p className="mt-3 text-sm text-white/55">No {meta.label.toLowerCase()} yet.</p>
            <button
              type="button"
              onClick={openAdd}
              className="mt-4 text-sm font-bold text-amber-400 touch-manipulation"
            >
              {meta.addLabel} →
            </button>
          </div>
        ) : (
          <ul className="space-y-3">
            {entries.map((entry) => (
              <li
                key={entry.id}
                className="rounded-2xl border border-white/10 bg-[#1F2A44] p-4"
              >
                <div className="flex gap-3">
                  {entry.attachmentThumb ? (
                    <div className="shrink-0 w-16 h-16 rounded-xl overflow-hidden bg-[#0A1428]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={entry.attachmentThumb}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : entry.attachmentName ? (
                    <div className="shrink-0 w-16 h-16 rounded-xl bg-[#0A1428] flex items-center justify-center text-2xl">
                      📄
                    </div>
                  ) : null}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-white truncate">{entry.title}</p>
                    {entry.recordDate && (
                      <p className="text-xs text-emerald-400/90 mt-0.5">
                        {new Date(entry.recordDate + 'T12:00:00').toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    )}
                    {entry.body && (
                      <p className="mt-2 text-xs text-white/55 leading-relaxed line-clamp-3">
                        {entry.body}
                      </p>
                    )}
                    {entry.attachmentName && !entry.attachmentThumb && (
                      <p className="mt-1 text-[10px] text-white/40 truncate">{entry.attachmentName}</p>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => void removeEntry(entry.id)}
                  className="mt-3 text-xs font-bold text-red-400/90 touch-manipulation"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}

        <p className="mt-8 text-[10px] text-white/35 leading-relaxed text-center">
          Educational wellness storage only — not a substitute for veterinary records systems. Encrypted
          cloud vault (IPFS) planned for a future release.
        </p>
      </div>

      {formOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <button
            type="button"
            aria-label="Close"
            className="absolute inset-0 bg-black/70 touch-manipulation"
            onClick={() => setFormOpen(false)}
          />
          <div className="relative z-10 w-full max-w-md rounded-t-3xl sm:rounded-3xl border border-white/10 bg-[#1F2A44] p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-center">{meta.addLabel}</h3>
            <div className="mt-5 space-y-4">
              <label className="block">
                <span className="text-xs font-bold text-white/60">Title *</span>
                <input
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-white/15 bg-[#0A1428] px-4 py-3 text-sm"
                  placeholder={
                    activeKind === 'vaccination'
                      ? 'Rabies booster'
                      : activeKind === 'daily_note'
                        ? 'Good energy after walk'
                        : 'Annual wellness visit'
                  }
                />
              </label>
              <label className="block">
                <span className="text-xs font-bold text-white/60">Date (optional)</span>
                <input
                  type="date"
                  value={form.recordDate}
                  onChange={(e) => setForm((f) => ({ ...f, recordDate: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-white/15 bg-[#0A1428] px-4 py-3 text-sm"
                />
              </label>
              <label className="block">
                <span className="text-xs font-bold text-white/60">Notes</span>
                <textarea
                  value={form.body}
                  onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
                  rows={3}
                  className="mt-1 w-full rounded-xl border border-white/15 bg-[#0A1428] px-4 py-3 text-sm resize-none"
                  placeholder="Details, vet name, dosage, observations…"
                />
              </label>
              <div>
                <span className="text-xs font-bold text-white/60">Attachment (optional)</span>
                <div className="mt-2 flex items-center gap-3">
                  {form.attachmentThumb ? (
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#0A1428]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={form.attachmentThumb} alt="" className="w-full h-full object-cover" />
                    </div>
                  ) : form.attachmentName ? (
                    <div className="text-xs text-white/60">📄 {form.attachmentName}</div>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="text-xs font-bold text-amber-400 touch-manipulation"
                  >
                    {form.attachmentName ? 'Change file' : 'Add photo or PDF'}
                  </button>
                  {form.attachmentName && (
                    <button
                      type="button"
                      onClick={() =>
                        setForm((f) => ({
                          ...f,
                          attachmentThumb: null,
                          attachmentName: null,
                        }))
                      }
                      className="text-xs text-white/45 touch-manipulation"
                    >
                      Remove
                    </button>
                  )}
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*,application/pdf"
                    className="hidden"
                    onChange={(e) => void handleFile(e)}
                  />
                </div>
              </div>
              {formError && <p className="text-sm text-red-400">{formError}</p>}
              <button
                type="button"
                disabled={saving}
                onClick={() => void saveEntry()}
                className="w-full min-h-[48px] rounded-full bg-[#F5C242] text-black font-bold text-sm disabled:opacity-60 touch-manipulation"
              >
                {saving ? 'Saving…' : 'Save to vault'}
              </button>
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                className="w-full min-h-[44px] text-sm text-white/50 touch-manipulation"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
