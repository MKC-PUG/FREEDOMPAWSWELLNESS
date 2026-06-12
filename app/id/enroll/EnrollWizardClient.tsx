'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import BackLink from '@/app/components/BackLink';
import { BIOMETRIC_CONSENT_TEXT, BIOMETRIC_CONSENT_VERSION } from '@/lib/id/consent';
import { fetchServerPets, createServerPet } from '@/lib/mypets/api';
import type { PetProfile } from '@/lib/mypets/types';
import { compressFileToUpload } from '@/lib/compress-image';
import { extractVideoFrames, isValidVitVideoFile } from '@/lib/vit/extract-video-frames';

const STEPS = [
  { n: 1, label: 'Pet' },
  { n: 2, label: 'Consent' },
  { n: 3, label: 'Eyes' },
  { n: 4, label: 'Face' },
  { n: 5, label: 'Body' },
  { n: 6, label: 'Posture' },
  { n: 7, label: 'Gait' },
  { n: 8, label: 'Review' },
  { n: 9, label: 'Done' },
] as const;

type Props = {
  userEmail: string;
  initialPetId?: string | null;
};

type CaptureResult = {
  qualityScore: number;
  descriptors: string[];
  enrollReady: boolean;
};

type ReviewMedia = {
  region: string;
  angle: string | null;
  qualityScore: number;
  descriptors: string[];
};

type CompleteResult = {
  freedomPawsId: string;
  qrSlug: string;
};

export default function EnrollWizardClient({ userEmail, initialPetId = null }: Props) {
  const [step, setStep] = useState(1);
  const [pets, setPets] = useState<PetProfile[]>([]);
  const [loadingPets, setLoadingPets] = useState(true);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);
  const [enrollmentId, setEnrollmentId] = useState<string | null>(null);
  const [consentChecked, setConsentChecked] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const [newPetName, setNewPetName] = useState('');
  const [newPetBreed, setNewPetBreed] = useState('');
  const [creatingPet, setCreatingPet] = useState(false);

  const [bodyFrontDone, setBodyFrontDone] = useState(false);
  const [captures, setCaptures] = useState<Record<string, CaptureResult>>({});
  const [reviewMedia, setReviewMedia] = useState<ReviewMedia[]>([]);
  const [reviewIssues, setReviewIssues] = useState<string[]>([]);
  const [reviewReady, setReviewReady] = useState(false);
  const [petName, setPetName] = useState('');
  const [completeResult, setCompleteResult] = useState<CompleteResult | null>(null);

  const photoRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);
  const [pendingCapture, setPendingCapture] = useState<{
    kind: 'photo';
    region: 'eyes' | 'face' | 'body' | 'posture';
    angle?: 'front' | 'side';
  } | { kind: 'gait' } | null>(null);

  const loadPets = useCallback(async () => {
    setLoadingPets(true);
    try {
      const list = await fetchServerPets();
      setPets(list ?? []);
    } catch {
      setError('Could not load pets.');
    } finally {
      setLoadingPets(false);
    }
  }, []);

  const loadReview = useCallback(async (id: string) => {
    const res = await fetch(`/api/id/enroll/status?enrollmentId=${encodeURIComponent(id)}`, {
      credentials: 'include',
    });
    const data = await res.json();
    if (!data.success) return;
    setReviewMedia(data.status.media ?? []);
    setReviewIssues(data.status.reviewIssues ?? []);
    setReviewReady(Boolean(data.status.reviewReady));
    setPetName(data.status.petName ?? '');
    if (data.status.status === 'complete' && data.status.freedomPawsId && data.status.qrSlug) {
      setCompleteResult({
        freedomPawsId: data.status.freedomPawsId,
        qrSlug: data.status.qrSlug,
      });
      setStep(9);
    }
  }, []);

  useEffect(() => {
    void loadPets();
  }, [loadPets]);

  useEffect(() => {
    if (!initialPetId || selectedPetId) return;
    setSelectedPetId(initialPetId);
  }, [initialPetId, selectedPetId]);

  useEffect(() => {
    if (step === 8 && enrollmentId) {
      void loadReview(enrollmentId);
    }
  }, [step, enrollmentId, loadReview]);

  const applyCapture = (key: string, capture: CaptureResult) => {
    setCaptures((c) => ({ ...c, [key]: capture }));
  };

  const postRegionCapture = async (
    region: string,
    frames: File[],
    mediaType: 'photo' | 'video',
    angle?: string
  ) => {
    if (!enrollmentId) return null;

    const formData = new FormData();
    formData.append('enrollmentId', enrollmentId);
    formData.append('region', region);
    formData.append('mediaType', mediaType);
    frames.forEach((frame, i) => {
      formData.append(i === 0 ? 'image' : `frame_${i}`, frame, frame.name);
    });
    if (angle) formData.append('angle', angle);

    const res = await fetch('/api/id/enroll/region', {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });
    return res.json() as Promise<{
      success: boolean;
      error?: string;
      capture?: CaptureResult;
    }>;
  };

  const startEnrollment = async () => {
    if (!selectedPetId) {
      setError('Select a pet to continue.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/id/enroll/start', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ petId: selectedPetId }),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.error || 'Could not start enrollment.');
        return;
      }
      const en = data.enrollment;
      setEnrollmentId(en.id);
      if (en.status === 'complete' && en.freedomPawsId && en.qrSlug) {
        setCompleteResult({ freedomPawsId: en.freedomPawsId, qrSlug: en.qrSlug });
        setStep(9);
      } else if (en.consentedAt) {
        setStep(Math.max(3, en.currentStep ?? 3));
      } else {
        setStep(2);
      }
    } catch {
      setError('Connection error.');
    } finally {
      setBusy(false);
    }
  };

  const recordConsent = async () => {
    if (!enrollmentId || !consentChecked) {
      setError('Read and accept consent to continue.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/id/enroll/consent', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enrollmentId,
          consentVersion: BIOMETRIC_CONSENT_VERSION,
          agreed: true,
        }),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.error || 'Consent failed.');
        return;
      }
      setStep(3);
    } catch {
      setError('Connection error.');
    } finally {
      setBusy(false);
    }
  };

  const openPhotoCapture = (
    region: 'eyes' | 'face' | 'body' | 'posture',
    angle?: 'front' | 'side'
  ) => {
    setPendingCapture({ kind: 'photo', region, angle });
    photoRef.current?.click();
  };

  const openGaitCapture = () => {
    setPendingCapture({ kind: 'gait' });
    videoRef.current?.click();
  };

  const onPhotoPicked = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !pendingCapture || pendingCapture.kind !== 'photo' || !enrollmentId) return;

    setBusy(true);
    setError('');
    try {
      let upload = file;
      if (upload.size > 2 * 1024 * 1024) {
        upload = await compressFileToUpload(upload);
      }

      const data = await postRegionCapture(
        pendingCapture.region,
        [upload],
        'photo',
        pendingCapture.angle
      );
      if (!data?.success || !data.capture) {
        setError(data?.error || 'Capture failed.');
        return;
      }

      const key =
        pendingCapture.region === 'body'
          ? `body-${pendingCapture.angle}`
          : pendingCapture.region;
      applyCapture(key, {
        qualityScore: data.capture.qualityScore,
        descriptors: data.capture.descriptors,
        enrollReady: data.capture.enrollReady,
      });

      const captureOk = data.capture.enrollReady;

      if (pendingCapture.region === 'eyes' && captureOk) setStep(4);
      if (pendingCapture.region === 'face' && captureOk) setStep(5);
      if (pendingCapture.region === 'body' && pendingCapture.angle === 'front') {
        setBodyFrontDone(true);
      }
      if (
        pendingCapture.region === 'body' &&
        pendingCapture.angle === 'side' &&
        data.capture.enrollReady
      ) {
        setStep(6);
      }
      if (pendingCapture.region === 'posture' && data.capture.enrollReady) setStep(7);

      if (!captureOk && data.capture.descriptors.length > 0) {
        setError(
          `Captured (${Math.round(data.capture.qualityScore * 100)}% quality) — retake with brighter light, or tap Continue below if descriptors look right.`
        );
      }
    } catch {
      setError('Connection error.');
    } finally {
      setBusy(false);
      setPendingCapture(null);
    }
  };

  const onVideoPicked = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || pendingCapture?.kind !== 'gait' || !enrollmentId) return;

    if (!isValidVitVideoFile(file)) {
      setError('Use MP4/MOV/WebM under 25 MB, 3–8 seconds, dog walking in frame.');
      setPendingCapture(null);
      return;
    }

    setBusy(true);
    setError('');
    try {
      const { frames } = await extractVideoFrames(file, {
        maxFrames: 5,
        maxDurationSec: 8,
      });

      const data = await postRegionCapture('gait', frames, 'video');
      if (!data?.success || !data.capture) {
        setError(data?.error || 'Gait analysis failed.');
        return;
      }

      applyCapture('gait', {
        qualityScore: data.capture.qualityScore,
        descriptors: data.capture.descriptors,
        enrollReady: data.capture.enrollReady,
      });

      if (data.capture.enrollReady) setStep(8);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not process video.');
    } finally {
      setBusy(false);
      setPendingCapture(null);
    }
  };

  const confirmEnrollment = async () => {
    if (!enrollmentId) return;
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/id/enroll/complete', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enrollmentId }),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.error || 'Could not complete enrollment.');
        await loadReview(enrollmentId);
        return;
      }
      setCompleteResult({
        freedomPawsId: data.freedomPawsId,
        qrSlug: data.qrSlug,
      });
      setStep(9);
    } catch {
      setError('Connection error.');
    } finally {
      setBusy(false);
    }
  };

  const createPet = async () => {
    if (!newPetName.trim()) {
      setError('Pet name is required.');
      return;
    }
    setCreatingPet(true);
    setError('');
    try {
      const pet = await createServerPet({
        name: newPetName.trim(),
        breed: newPetBreed.trim(),
        age: '',
        notes: '',
        photoThumb: null,
      });
      setPets((p) => [pet, ...p]);
      setSelectedPetId(pet.id);
      setNewPetName('');
      setNewPetBreed('');
    } catch {
      setError('Could not create pet.');
    } finally {
      setCreatingPet(false);
    }
  };

  const selectedPet = pets.find((p) => p.id === selectedPetId);
  const cardHref = completeResult ? `/id/p/${completeResult.qrSlug}` : '#';

  return (
    <div className="min-h-screen bg-[#0A1625] text-white font-sans">
      <input
        ref={photoRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(ev) => void onPhotoPicked(ev)}
      />
      <input
        ref={videoRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={(ev) => void onVideoPicked(ev)}
      />

      <div className="mx-auto max-w-lg px-6 py-10">
        <BackLink href="/id" label="Back to ID hub" />

        <header className="mt-4 mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
            Enroll biometric ID
          </p>
          <h1 className="mt-2 text-2xl font-bold">9-step wizard</h1>
          <p className="mt-1 text-xs text-white/50">Signed in as {userEmail}</p>
        </header>

        <ol className="mb-8 flex gap-0.5 overflow-x-auto">
          {STEPS.map((s) => (
            <li
              key={s.n}
              className={`min-w-[3.25rem] flex-1 rounded-md py-1.5 text-center text-[9px] font-semibold uppercase tracking-wide ${
                step === s.n
                  ? 'bg-emerald-500/25 text-emerald-200'
                  : step > s.n
                    ? 'bg-white/10 text-white/50'
                    : 'bg-white/5 text-white/30'
              }`}
            >
              {s.label}
            </li>
          ))}
        </ol>

        {error && (
          <p className="mb-4 rounded-xl border border-red-500/40 bg-red-950/30 px-4 py-3 text-sm text-red-300">
            {error}
          </p>
        )}

        {step === 1 && (
          <section className="space-y-4">
            <h2 className="text-lg font-semibold">1. Select your pet</h2>
            {loadingPets ? (
              <p className="text-sm text-white/50">Loading pets…</p>
            ) : pets.length === 0 ? (
              <p className="text-sm text-white/60">No pets yet — create one below.</p>
            ) : (
              <ul className="space-y-2">
                {pets.map((pet) => (
                  <li key={pet.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedPetId(pet.id)}
                      className={`w-full rounded-2xl border p-4 text-left transition ${
                        selectedPetId === pet.id
                          ? 'border-emerald-400 bg-emerald-500/10'
                          : 'border-white/10 bg-white/5 hover:border-white/25'
                      }`}
                    >
                      <span className="font-semibold">{pet.name}</span>
                      {pet.breed && (
                        <span className="ml-2 text-sm text-white/50">{pet.breed}</span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3">
              <p className="text-sm font-semibold text-white/80">Or create new pet</p>
              <input
                value={newPetName}
                onChange={(e) => setNewPetName(e.target.value)}
                placeholder="Pet name"
                className="w-full rounded-xl bg-[#0A1428] border border-white/20 px-3 py-2 text-sm"
              />
              <input
                value={newPetBreed}
                onChange={(e) => setNewPetBreed(e.target.value)}
                placeholder="Breed (optional)"
                className="w-full rounded-xl bg-[#0A1428] border border-white/20 px-3 py-2 text-sm"
              />
              <button
                type="button"
                disabled={creatingPet}
                onClick={() => void createPet()}
                className="w-full rounded-xl border border-amber-400/50 py-2 text-sm font-semibold text-amber-300"
              >
                {creatingPet ? 'Creating…' : 'Add pet'}
              </button>
            </div>

            <button
              type="button"
              disabled={busy || !selectedPetId}
              onClick={() => void startEnrollment()}
              className="w-full rounded-2xl bg-emerald-400 py-4 font-bold text-black disabled:opacity-50"
            >
              {busy ? 'Starting…' : `Continue with ${selectedPet?.name ?? 'pet'}`}
            </button>
          </section>
        )}

        {step === 2 && (
          <section className="space-y-4">
            <h2 className="text-lg font-semibold">2. Biometric consent</h2>
            <pre className="whitespace-pre-wrap rounded-2xl border border-white/10 bg-[#0A1428] p-4 text-xs leading-relaxed text-white/75 font-sans">
              {BIOMETRIC_CONSENT_TEXT}
            </pre>
            <label className="flex items-start gap-3 text-sm">
              <input
                type="checkbox"
                checked={consentChecked}
                onChange={(e) => setConsentChecked(e.target.checked)}
                className="mt-1"
              />
              <span>
                I agree to biometric capture and storage (v{BIOMETRIC_CONSENT_VERSION}).
              </span>
            </label>
            <button
              type="button"
              disabled={busy || !consentChecked}
              onClick={() => void recordConsent()}
              className="w-full rounded-2xl bg-emerald-400 py-4 font-bold text-black disabled:opacity-50"
            >
              {busy ? 'Saving…' : 'I agree — continue'}
            </button>
          </section>
        )}

        {step >= 3 && step <= 7 && enrollmentId && (
          <section className="space-y-4">
            {step === 3 && (
              <>
                <h2 className="text-lg font-semibold">3. Eyes</h2>
                <p className="text-sm text-white/65">
                  Close-up of both eyes — good lighting. For black or dark-coated dogs, use a
                  bright room or flash so catchlights show on the eyes.
                </p>
                <CaptureCard
                  label="Eyes"
                  capture={captures.eyes}
                  onCapture={() => openPhotoCapture('eyes')}
                  busy={busy}
                />
                {captures.eyes && !captures.eyes.enrollReady && (
                  <button
                    type="button"
                    onClick={() => {
                      setError('');
                      setStep(4);
                    }}
                    className="w-full rounded-2xl border border-amber-400/50 py-3 text-sm font-bold text-amber-300"
                  >
                    Continue to Face → ({Math.round(captures.eyes.qualityScore * 100)}% quality)
                  </button>
                )}
              </>
            )}
            {step === 4 && (
              <>
                <h2 className="text-lg font-semibold">4. Face</h2>
                <p className="text-sm text-white/65">Muzzle, ears, and unique markings.</p>
                <CaptureCard
                  label="Face"
                  capture={captures.face}
                  onCapture={() => openPhotoCapture('face')}
                  busy={busy}
                />
              </>
            )}
            {step === 5 && (
              <>
                <h2 className="text-lg font-semibold">5. Body (2 angles)</h2>
                <CaptureCard
                  label="Body — front"
                  capture={captures['body-front']}
                  onCapture={() => openPhotoCapture('body', 'front')}
                  busy={busy}
                />
                <CaptureCard
                  label="Body — side"
                  capture={captures['body-side']}
                  onCapture={() => openPhotoCapture('body', 'side')}
                  busy={busy}
                  disabled={!bodyFrontDone}
                />
              </>
            )}
            {step === 6 && (
              <>
                <h2 className="text-lg font-semibold">6. Posture</h2>
                <p className="text-sm text-white/65">
                  Still photo — dog standing naturally, full body visible.
                </p>
                <CaptureCard
                  label="Posture"
                  capture={captures.posture}
                  onCapture={() => openPhotoCapture('posture')}
                  busy={busy}
                />
              </>
            )}
            {step === 7 && (
              <>
                <h2 className="text-lg font-semibold">7. Gait video</h2>
                <p className="text-sm text-white/65">
                  3–8 second clip of your dog walking toward or across the camera.
                </p>
                <CaptureCard
                  label="Gait / movement"
                  capture={captures.gait}
                  onCapture={openGaitCapture}
                  busy={busy}
                  actionLabel="Record or upload video"
                />
              </>
            )}
          </section>
        )}

        {step === 8 && enrollmentId && (
          <section className="space-y-4">
            <h2 className="text-lg font-semibold">8. Review &amp; confirm</h2>
            <p className="text-sm text-white/65">
              {petName ? `${petName} — ` : ''}confirm all regions before we create your embedding
              and Freedom Paws ID.
            </p>

            <ul className="space-y-2">
              {reviewMedia.map((m) => {
                const label = m.angle ? `${m.region} (${m.angle})` : m.region;
                const pct = Math.round(m.qualityScore * 100);
                return (
                  <li
                    key={`${m.region}-${m.angle ?? 'x'}`}
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm"
                  >
                    <div className="flex justify-between">
                      <span className="font-semibold capitalize">{label}</span>
                      <span className={pct >= 65 ? 'text-green-400' : 'text-amber-400'}>
                        {pct}%
                      </span>
                    </div>
                    {m.descriptors[0] && (
                      <p className="mt-1 text-xs text-white/55 truncate">{m.descriptors[0]}</p>
                    )}
                  </li>
                );
              })}
            </ul>

            {reviewIssues.length > 0 && (
              <div className="rounded-xl border border-amber-500/40 bg-amber-950/20 p-4 text-sm text-amber-200">
                <p className="font-semibold">Fix before completing:</p>
                <ul className="mt-2 list-disc pl-5 space-y-1 text-xs">
                  {reviewIssues.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              </div>
            )}

            <button
              type="button"
              disabled={busy || !reviewReady}
              onClick={() => void confirmEnrollment()}
              className="w-full rounded-2xl bg-emerald-400 py-4 font-bold text-black disabled:opacity-50"
            >
              {busy ? 'Creating ID…' : 'Confirm & create Freedom Paws ID'}
            </button>
          </section>
        )}

        {step === 9 && completeResult && (
          <section className="space-y-4 text-center">
            <div className="rounded-2xl border-2 border-emerald-500/50 bg-emerald-900/20 p-8">
              <p className="text-emerald-300 font-bold text-lg">Enrollment complete</p>
              <p className="mt-4 text-3xl font-mono font-bold text-amber-400">
                {completeResult.freedomPawsId}
              </p>
              <p className="mt-2 text-sm text-white/60">Freedom Paws biometric ID issued</p>
            </div>

            <Link
              href={cardHref}
              className="block rounded-2xl border border-amber-400/50 bg-amber-900/20 py-4 font-bold text-amber-300 hover:bg-amber-900/30"
            >
              Open QR pet card →
            </Link>

            <Link href="/id" className="block text-sm text-white/50 hover:text-white/70">
              Return to ID hub
            </Link>
          </section>
        )}
      </div>
    </div>
  );
}

function CaptureCard({
  label,
  capture,
  onCapture,
  busy,
  disabled,
  actionLabel,
}: {
  label: string;
  capture?: CaptureResult;
  onCapture: () => void;
  busy: boolean;
  disabled?: boolean;
  actionLabel?: string;
}) {
  const pct = capture ? Math.round(capture.qualityScore * 100) : null;
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="flex items-center justify-between">
        <p className="font-semibold">{label}</p>
        {pct !== null && (
          <span
            className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              pct >= 65 ? 'bg-green-500/20 text-green-300' : 'bg-amber-500/20 text-amber-300'
            }`}
          >
            {pct}%
          </span>
        )}
      </div>
      {capture?.descriptors?.length ? (
        <ul className="mt-3 text-xs text-white/70 list-disc pl-4 space-y-1">
          {capture.descriptors.slice(0, 4).map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-xs text-white/45">No capture yet</p>
      )}
      <button
        type="button"
        disabled={busy || disabled}
        onClick={onCapture}
        className="mt-4 w-full rounded-xl bg-[#0A1428] border border-emerald-500/40 py-3 text-sm font-semibold text-emerald-300 disabled:opacity-40"
      >
        {busy ? 'Analyzing…' : capture ? 'Retake' : actionLabel ?? 'Take photo'}
      </button>
    </div>
  );
}
