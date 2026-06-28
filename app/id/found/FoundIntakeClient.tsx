'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import BackLink from '@/app/components/BackLink';
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
    <div className="min-h-screen bg-[#0A1625] text-white font-sans">
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

      <div className="mx-auto max-w-lg px-6 py-10">
        <BackLink href="/id" label="Back to ID hub" />

        <header className="mt-4 mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">
            Shelter intake
          </p>
          <h1 className="mt-2 text-2xl font-bold">Report found dog</h1>
          <p className="mt-1 text-xs text-white/50">
            CA / TN pilot · signed in as {userEmail}
          </p>
        </header>

        {error && (
          <p className="mb-4 rounded-xl border border-red-500/40 bg-red-950/30 px-4 py-3 text-sm text-red-300">
            {error}
          </p>
        )}

        {!result ? (
          <section className="space-y-4">
            <div className="rounded-2xl border border-amber-500/25 bg-amber-950/15 px-4 py-3 text-sm text-amber-100/90">
              <strong className="text-amber-200">Optional first step:</strong> scan microchip on{' '}
              <Link href="/id/scan" className="underline font-semibold">
                /id/scan
              </Link>{' '}
              — if Freedom Paws match, note the ID; then continue with photo intake below.
            </div>
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

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              {preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview} alt="Found dog preview" className="w-full rounded-xl object-cover max-h-64" />
              ) : (
                <p className="text-sm text-white/45 text-center py-8">No media yet</p>
              )}
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => photoLibraryRef.current?.click()}
                  className="flex-1 rounded-xl border border-emerald-500/40 py-2 text-sm font-semibold text-emerald-300"
                >
                  Photo library
                </button>
                <button
                  type="button"
                  onClick={() => photoCameraRef.current?.click()}
                  className="flex-1 rounded-xl border border-emerald-500/25 py-2 text-sm font-semibold text-emerald-200/80"
                >
                  Camera
                </button>
                <button
                  type="button"
                  onClick={() => videoRef.current?.click()}
                  className="flex-1 rounded-xl border border-amber-500/40 py-2 text-sm font-semibold text-amber-300"
                >
                  Video
                </button>
              </div>
              <p className="mt-2 text-center text-[10px] text-white/40 leading-relaxed">
                Photo library opens your camera roll or files — use for enrollment test images.
              </p>
            </div>

            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Intake notes — location found, collar, temperament…"
              className="w-full h-24 rounded-xl bg-[#0A1428] border border-white/20 px-3 py-2 text-sm resize-y"
            />

            <button
              type="button"
              disabled={busy}
              onClick={() => void submit()}
              className="w-full rounded-2xl bg-amber-400 py-4 font-bold text-black disabled:opacity-50"
            >
              {busy ? 'Analyzing & searching…' : 'Submit for match review'}
            </button>

            <p className="text-center text-[10px] text-white/40 leading-relaxed">
              Similarity search runs automatically. Candidates require human review before any
              owner contact.
            </p>
          </section>
        ) : (
          <section className="space-y-4">
            <div className="rounded-2xl border border-emerald-500/40 bg-emerald-900/20 p-6 text-center">
              <p className="font-semibold text-emerald-300">Report submitted</p>
              <p className="mt-2 text-xs text-white/55">ID: {result.reportId.slice(0, 8)}…</p>
              <p className="mt-3 text-sm">
                {result.candidateCount > 0
                  ? `${result.candidateCount} candidate(s) above threshold — pending review`
                  : 'No candidates above threshold yet. More enrollments improve matches.'}
              </p>
            </div>

            {result.matches.length > 0 && (
              <div className="rounded-xl border border-white/10 p-4">
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
              </div>
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
      </div>
    </div>
  );
}
