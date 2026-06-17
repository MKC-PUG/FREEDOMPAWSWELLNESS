'use client';

import { useCallback, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ADOPTION_AGE_BANDS,
  ADOPTION_BREEDS,
  ADOPTION_SEX_OPTIONS,
  ADOPTION_SIZES,
  BREED_MIXED,
  LISTING_STATUS_LABELS,
} from '@/lib/partner/breeds';
import type { AdoptionListing, ListingStatus } from '@/lib/partner/listings-types';
import type { PartnerOrg } from '@/lib/partner/types';
import { compressImageForUpload } from '@/lib/compress-image';

type Props = {
  mode: 'create' | 'edit';
  listing?: AdoptionListing;
  partners: PartnerOrg[];
  defaultShelterId: string | null;
  canChangeStatus: boolean;
  isFpOps: boolean;
};

const STATUS_OPTIONS: ListingStatus[] = [
  'draft',
  'available',
  'pending',
  'adopted',
  'archived',
];

export default function ListingFormClient({
  mode,
  listing,
  partners,
  defaultShelterId,
  canChangeStatus,
  isFpOps,
}: Props) {
  const router = useRouter();
  const [shelterId, setShelterId] = useState(
    listing?.shelterId ?? defaultShelterId ?? (isFpOps ? partners[0]?.id ?? '' : '')
  );
  const [displayName, setDisplayName] = useState(listing?.displayName ?? '');
  const [breedPrimary, setBreedPrimary] = useState(listing?.breedPrimary ?? ADOPTION_BREEDS[0]);
  const [breedSecondary, setBreedSecondary] = useState(listing?.breedSecondary ?? '');
  const [sex, setSex] = useState(listing?.sex ?? 'unknown');
  const [ageBand, setAgeBand] = useState(listing?.ageBand ?? 'adult');
  const [size, setSize] = useState(listing?.size ?? 'medium');
  const [bio, setBio] = useState(listing?.bio ?? '');
  const [status, setStatus] = useState<ListingStatus>(listing?.status ?? 'draft');
  const [photoUrls, setPhotoUrls] = useState<string[]>(listing?.photoUrls ?? []);
  const [primaryPhotoUrl, setPrimaryPhotoUrl] = useState<string | null>(
    listing?.primaryPhotoUrl ?? null
  );
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const showSecondary = breedPrimary === BREED_MIXED;

  const primary = useMemo(
    () => primaryPhotoUrl ?? photoUrls[0] ?? null,
    [primaryPhotoUrl, photoUrls]
  );

  const uploadPhoto = useCallback(
    async (file: File) => {
      if (!shelterId) {
        setError('Select a shelter before uploading photos.');
        return;
      }
      setUploading(true);
      setError(null);
      try {
        const compressed = await compressImageForUpload(file, 1400, 0.85);
        const blob = await fetch(compressed.dataUrl).then((r) => r.blob());
        const uploadFile = new File([blob], compressed.name, {
          type: blob.type || 'image/jpeg',
        });

        const fd = new FormData();
        fd.append('photo', uploadFile);
        fd.append('shelterId', shelterId);

        const res = await fetch('/api/partner/listings/photo', { method: 'POST', body: fd });
        const data = (await res.json()) as { success?: boolean; url?: string; error?: string };
        if (!res.ok || !data.url) {
          throw new Error(data.error ?? 'Upload failed.');
        }

        setPhotoUrls((prev) => [...prev, data.url!]);
        if (!primaryPhotoUrl && photoUrls.length === 0) {
          setPrimaryPhotoUrl(data.url);
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Upload failed.');
      } finally {
        setUploading(false);
      }
    },
    [shelterId, primaryPhotoUrl, photoUrls.length]
  );

  const removePhoto = (url: string) => {
    setPhotoUrls((prev) => prev.filter((u) => u !== url));
    if (primaryPhotoUrl === url) {
      setPrimaryPhotoUrl(null);
    }
  };

  const submit = async () => {
    setBusy(true);
    setError(null);
    try {
      const payload: Record<string, unknown> = {
        displayName,
        breedPrimary,
        breedSecondary: showSecondary ? breedSecondary : null,
        sex,
        ageBand,
        size,
        bio,
        photoUrls,
        primaryPhotoUrl: primary,
      };

      if (mode === 'create') {
        payload.shelterId = shelterId;
      } else if (canChangeStatus) {
        payload.status = status;
      }

      const url =
        mode === 'create' ? '/api/partner/listings' : `/api/partner/listings/${listing!.id}`;
      const method = mode === 'create' ? 'POST' : 'PATCH';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { success?: boolean; error?: string };
      if (!res.ok || !data.success) {
        throw new Error(data.error ?? 'Save failed.');
      }

      router.push('/partner/listings');
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A1625] text-white font-sans">
      <div className="mx-auto max-w-lg px-6 py-10">
        <Link href="/partner/listings" className="text-xs text-emerald-400/80 hover:text-emerald-300">
          ← All listings
        </Link>
        <h1 className="mt-3 text-2xl font-bold">
          {mode === 'create' ? 'New adoption listing' : `Edit ${listing?.displayName}`}
        </h1>

        <div className="mt-6 space-y-5">
          {isFpOps && mode === 'create' ? (
            <label className="block text-sm">
              <span className="text-white/55">Shelter</span>
              <select
                value={shelterId}
                onChange={(e) => setShelterId(e.target.value)}
                className="mt-1 w-full rounded-xl border border-white/15 bg-black/25 px-3 py-3 text-white"
              >
                {partners.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </label>
          ) : null}

          <label className="block text-sm">
            <span className="text-white/55">Display name</span>
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="mt-1 w-full rounded-xl border border-white/15 bg-black/25 px-3 py-3 text-white"
              placeholder="e.g. Buddy"
            />
          </label>

          <label className="block text-sm">
            <span className="text-white/55">Primary breed</span>
            <select
              value={breedPrimary}
              onChange={(e) => setBreedPrimary(e.target.value)}
              className="mt-1 w-full rounded-xl border border-white/15 bg-black/25 px-3 py-3 text-white"
            >
              {ADOPTION_BREEDS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </label>

          {showSecondary ? (
            <label className="block text-sm">
              <span className="text-white/55">Mixed with / notes</span>
              <input
                value={breedSecondary}
                onChange={(e) => setBreedSecondary(e.target.value)}
                className="mt-1 w-full rounded-xl border border-white/15 bg-black/25 px-3 py-3 text-white"
                placeholder="e.g. Labrador mix"
              />
            </label>
          ) : null}

          <div className="grid grid-cols-3 gap-3">
            <label className="block text-sm">
              <span className="text-white/55">Sex</span>
              <select
                value={sex}
                onChange={(e) => setSex(e.target.value as typeof sex)}
                className="mt-1 w-full rounded-xl border border-white/15 bg-black/25 px-2 py-3 text-white text-xs"
              >
                {ADOPTION_SEX_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              <span className="text-white/55">Age</span>
              <select
                value={ageBand}
                onChange={(e) => setAgeBand(e.target.value as typeof ageBand)}
                className="mt-1 w-full rounded-xl border border-white/15 bg-black/25 px-2 py-3 text-white text-xs"
              >
                {ADOPTION_AGE_BANDS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              <span className="text-white/55">Size</span>
              <select
                value={size ?? 'unknown'}
                onChange={(e) => setSize(e.target.value as typeof size)}
                className="mt-1 w-full rounded-xl border border-white/15 bg-black/25 px-2 py-3 text-white text-xs"
              >
                {ADOPTION_SIZES.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="block text-sm">
            <span className="text-white/55">Bio</span>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={5}
              className="mt-1 w-full rounded-xl border border-white/15 bg-black/25 px-3 py-3 text-white"
              placeholder="Personality, good with kids, energy level…"
            />
          </label>

          <div>
            <p className="text-sm text-white/55">Photos (min 1)</p>
            <div className="mt-2 flex flex-wrap gap-3">
              {photoUrls.map((url) => (
                <div key={url} className="relative h-24 w-24 overflow-hidden rounded-xl border border-white/15">
                  <Image src={url} alt="" fill sizes="96px" className="object-cover" />
                  <button
                    type="button"
                    onClick={() => removePhoto(url)}
                    className="absolute right-1 top-1 rounded bg-black/70 px-1.5 text-[10px]"
                  >
                    ✕
                  </button>
                  <button
                    type="button"
                    onClick={() => setPrimaryPhotoUrl(url)}
                    className={`absolute bottom-1 left-1 rounded px-1.5 text-[9px] ${
                      primary === url ? 'bg-emerald-500 text-black' : 'bg-black/70 text-white/80'
                    }`}
                  >
                    {primary === url ? 'Cover' : 'Set cover'}
                  </button>
                </div>
              ))}
            </div>
            <label className="mt-3 inline-flex min-h-[44px] cursor-pointer items-center rounded-xl border border-dashed border-emerald-500/40 px-4 text-sm font-semibold text-emerald-300">
              {uploading ? 'Uploading…' : 'Add photo'}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                disabled={uploading || busy}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) void uploadPhoto(f);
                  e.target.value = '';
                }}
              />
            </label>
          </div>

          {mode === 'edit' && canChangeStatus ? (
            <label className="block text-sm">
              <span className="text-white/55">Status</span>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ListingStatus)}
                className="mt-1 w-full rounded-xl border border-white/15 bg-black/25 px-3 py-3 text-white"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {LISTING_STATUS_LABELS[s]}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-[11px] text-white/40">
                Available and pending appear on the public TN directory.
              </p>
            </label>
          ) : mode === 'edit' ? (
            <p className="text-xs text-white/45">
              Status: <span className="text-emerald-300">{LISTING_STATUS_LABELS[status]}</span> —
              shelter admin can publish.
            </p>
          ) : null}

          {error ? <p className="text-sm text-rose-300">{error}</p> : null}

          <button
            type="button"
            onClick={() => void submit()}
            disabled={busy || uploading}
            className="w-full min-h-[48px] rounded-xl bg-emerald-500 text-sm font-bold text-black disabled:opacity-50"
          >
            {busy ? 'Saving…' : mode === 'create' ? 'Save draft' : 'Save changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
