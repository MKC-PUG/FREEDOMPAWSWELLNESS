'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import BackLink from '@/app/components/BackLink';
import PageShell from '@/app/components/ui/PageShell';
import PageHeader from '@/app/components/ui/PageHeader';
import SectionCard from '@/app/components/ui/SectionCard';
import PrimaryButton from '@/app/components/ui/PrimaryButton';
import SecondaryButton from '@/app/components/ui/SecondaryButton';
import { compressFileToUpload } from '@/lib/compress-image';
import { extractVideoFrames, isValidVitVideoFile } from '@/lib/vit/extract-video-frames';

type Shelter = { id: string; name: string; state: string };

type SubmitResult = {
  reportId: string;
  status: string;
  candidateCount: number;
  matches: {
    freedomPawsId: string;
    petName: string;
    similarity: number;
  }[];
};

type Props = {
  userEmail: string;
  canReview: boolean;
};

export default function FoundIntakeClient({ userEmail, canReview }: Props) {
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [shelterId, setShelterId] = useState('');
  const [notes, setNotes] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const photoLibraryRef = useRef<HTMLInputElement>(null);
  const photoCameraRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);
  const [mediaType, setMediaType] = useState<'photo' | 'video'>('photo');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [videoFrames, setVideoFrames] = useState<File[]>([]);

  useEffect(() => {
    void fetch('/api/id/found', { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.shelters?.length) {
          setShelters(d.shelters);
          setShelterId(d.shelters[0].id);
        }
      })
      .catch(() => setError('Could not load pilot shelters.'));
  }, []);

  const onPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setMediaType('photo');
    setVideoFrames([]);
    let f = file;
    if (f.size > 2 * 1024 * 1024) f = await compressFileToUpload(f);
    setPhotoFile(f);
    setPreview(URL.createObjectURL(f));
    setResult(null);
  };

  const onVideo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!isValidVitVideoFile(file)) {
      setError('Use MP4/MOV/WebM under 25 MB, 8 seconds or less.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      const { frames, posterDataUrl } = await extractVideoFrames(file, {
        maxFrames: 5,
        maxDurationSec: 8,
      });
      setMediaType('video');
      setPhotoFile(null);
      setVideoFrames(frames);
      setPreview(posterDataUrl);
      setResult(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Video processing failed.');
    } finally {
      setBusy(false);
    }
  };

  const submit = async () => {
    if (!shelterId) {
      setError('Select a pilot shelter.');
      return;
    }
    const hasMedia = mediaType === 'photo' ? Boolean(photoFile) : videoFrames.length > 0;
    if (!hasMedia) {
      setError('Add a photo or short walking video of the found dog.');
      return;
    }

    setBusy(true);
    setError('');
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('shelterId', shelterId);
      formData.append('mediaType', mediaType);
      if (notes.trim()) formData.append('notes', notes.trim());

      if (mediaType === 'photo' && photoFile) {
        formData.append('image', photoFile, photoFile.name);
      } else {
        videoFrames.forEach((frame, i) => {
          formData.append(i === 0 ? 'image' : `frame_${i}`, frame, frame.name);
        });
      }

      const res = await fetch('/api/id/found', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.error || 'Submission failed.');
        return;
      }
      setResult({
        reportId: data.reportId,
        status: data.status,
        candidateCount: data.candidateCount,
        matches: (data.matches ?? []).map((m: SubmitResult['matches'][0]) => ({
          freedomPawsId: m.freedomPawsId,
          petName: m.petName,
          similarity: m.similarity,
        })),
      });
    } catch {
      setError('Connection error.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <PageShell maxWidth="lg">
      <input
        ref={photoLibraryRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => void onPhoto(e)}
      />
      <input
        ref={photoCameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => void onPhoto(e)}
      />
      <input ref={videoRef} type="file" accept="video/*" className="hidden" onChange={(e) => void onVideo(e)} />

      <BackLink href="/id" label="Back to ID hub" />

      <PageHeader
        eyebrow="Shelter intake"
        eyebrowVariant="emerald"
        title="Report found dog"
        subtitle={`CA / TN pilot · signed in as ${userEmail}`}
        className="mt-4 mb-6"
      />

        {error && (
          <p className="mb-4 rounded-xl border border-red-500/40 bg-red-950/30 px-4 py-3 text-sm text-red-300">
            {error}
          </p>
        )}

        {!result ? (
          <section className="space-y-4">
            <SectionCard className="border-amber-500/25 bg-amber-950/15 text-sm text-amber-100/90">
              <strong className="text-amber-200">Optional first step:</strong> scan microchip on{' '}
              <Link href="/id/scan" className="underline font-semibold">
                /id/scan
              </Link>{' '}
              — if Freedom Paws match, note the ID; then continue with photo intake below.
            </SectionCard>
            <div>
              <label className="text-sm font-semibold text-white/80">Pilot shelter</label>
              <select
                value={shelterId}
                onChange={(e) => setShelterId(e.target.value)}
                className="mt-2 w-full rounded-xl bg-[#0A1428] border border-white/20 px-3 py-3 text-sm"
              >
                {shelters.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.state})
                  </option>
                ))}
              </select>
            </div>

            <SectionCard variant="glass">
              {preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview} alt="Found dog preview" className="w-full rounded-xl object-cover max-h-64" />
              ) : (
                <p className="text-sm text-white/45 text-center py-8">No media yet</p>
              )}
              <div className="mt-3 flex gap-2">
                <SecondaryButton
                  type="button"
                  variant="emerald"
                  fullWidth
                  className="!min-h-[44px] !rounded-xl !text-sm"
                  onClick={() => photoLibraryRef.current?.click()}
                >
                  Photo library
                </SecondaryButton>
                <SecondaryButton
                  type="button"
                  variant="emerald"
                  fullWidth
                  className="!min-h-[44px] !rounded-xl !text-sm opacity-90"
                  onClick={() => photoCameraRef.current?.click()}
                >
                  Camera
                </SecondaryButton>
                <SecondaryButton
                  type="button"
                  variant="gold"
                  fullWidth
                  className="!min-h-[44px] !rounded-xl !text-sm"
                  onClick={() => videoRef.current?.click()}
                >
                  Video
                </SecondaryButton>
              </div>
              <p className="mt-2 text-center text-[10px] text-white/40 leading-relaxed">
                Photo library opens your camera roll or files — use for enrollment test images.
              </p>
            </SectionCard>

            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Intake notes — location found, collar, temperament…"
              className="w-full h-24 rounded-xl bg-[#0A1428] border border-white/20 px-3 py-2 text-sm resize-y"
            />

            <PrimaryButton
              type="button"
              variant="emerald"
              fullWidth
              disabled={busy}
              onClick={() => void submit()}
            >
              {busy ? 'Analyzing & searching…' : 'Submit for match review'}
            </PrimaryButton>

            <p className="text-center text-[10px] text-white/40 leading-relaxed">
              Similarity search runs automatically. Candidates require human review before any
              owner contact.
            </p>
          </section>
        ) : (
          <section className="space-y-4">
            <SectionCard className="border-emerald-500/40 bg-emerald-900/20 text-center">
              <p className="font-semibold text-emerald-300">Report submitted</p>
              <p className="mt-2 text-xs text-white/55">ID: {result.reportId.slice(0, 8)}…</p>
              <p className="mt-3 text-sm">
                {result.candidateCount > 0
                  ? `${result.candidateCount} candidate(s) above threshold — pending review`
                  : 'No candidates above threshold yet. More enrollments improve matches.'}
              </p>
            </SectionCard>

            {result.matches.length > 0 && (
              <SectionCard>
                <p className="text-xs font-bold uppercase text-white/45 mb-3">
                  Top matches (staff review only)
                </p>
                <ul className="space-y-2 text-sm">
                  {result.matches.map((m) => (
                    <li key={m.freedomPawsId} className="flex justify-between">
                      <span>
                        {m.petName} · {m.freedomPawsId}
                      </span>
                      <span className="text-emerald-400">{Math.round(m.similarity * 100)}%</span>
                    </li>
                  ))}
                </ul>
              </SectionCard>
            )}

            {canReview && (
              <Link
                href={`/id/match?report=${result.reportId}`}
                className="block rounded-2xl border border-amber-400/50 bg-amber-900/20 py-4 text-center font-bold text-amber-300"
              >
                Open match review queue →
              </Link>
            )}

            <button
              type="button"
              onClick={() => {
                setResult(null);
                setPhotoFile(null);
                setVideoFrames([]);
                setPreview(null);
                setNotes('');
              }}
              className="w-full text-sm text-white/50 hover:text-white/70"
            >
              Submit another report
            </button>
          </section>
        )}
    </PageShell>
  );
}
