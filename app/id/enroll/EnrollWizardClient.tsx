'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import BackLink from '@/app/components/BackLink';
import PageShell from '@/app/components/ui/PageShell';
import PageHeader from '@/app/components/ui/PageHeader';
import SectionCard from '@/app/components/ui/SectionCard';
import PrimaryButton from '@/app/components/ui/PrimaryButton';
import SecondaryButton from '@/app/components/ui/SecondaryButton';
import EnrollStepper from '@/app/components/ui/EnrollStepper';
import WellnessPartnerPanel from '@/app/components/wellness/WellnessPartnerPanel';
import { BIOMETRIC_CONSENT_TEXT, BIOMETRIC_CONSENT_VERSION } from '@/lib/id/consent';
import { enrollStepForRegion, readVitIdBridgeSession } from '@/lib/id/enroll-bridge';
import type { IdentityRegion } from '@/lib/id/types';
import { IDENTITY_REGIONS } from '@/lib/id/types';
import { fetchServerPets, createServerPet } from '@/lib/mypets/api';
import type { PetProfile } from '@/lib/mypets/types';
import { compressFileToUpload } from '@/lib/compress-image';
import { extractVideoFrames, isValidVitVideoFile, selectGaitFrames } from '@/lib/vit/extract-video-frames';
import { gateEyes, gateFace, gateGait } from '@/lib/vit/media-quality-gate';

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
  initialFocusRegion?: string | null;
  fromVit?: boolean;
};

type CaptureResult = {
  qualityScore: number;
  descriptors: string[];
  enrollReady: boolean;
};

type ReviewMedia = {
  id: string;
  region: string;
  angle: string | null;
  qualityScore: number;
  descriptors: string[];
};

type CompleteResult = {
  freedomPawsId: string;
  qrSlug: string;
};

export default function EnrollWizardClient({
  userEmail,
  initialPetId = null,
  initialFocusRegion = null,
  fromVit = false,
}: Props) {
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
  const [vitBridgeHint, setVitBridgeHint] = useState<string | null>(null);

  const parsedFocusRegion = IDENTITY_REGIONS.includes(initialFocusRegion as IdentityRegion)
    ? (initialFocusRegion as IdentityRegion)
    : null;

  const photoRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);
  /** Ref avoids stale state when iOS fires file input change before re-render. */
  const pendingCaptureRef = useRef<
    | {
        kind: 'photo';
        region: 'eyes' | 'face' | 'body' | 'posture';
        angle?: 'front' | 'side';
      }
    | { kind: 'gait' }
    | null
  >(null);

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
    if (!fromVit) return;
    const bridge = readVitIdBridgeSession();
    if (!bridge) {
      setVitBridgeHint('ViT pre-check noted — capture each region here to store your ID profile.');
      return;
    }
    const ready = bridge.enrollReadyRegions.length
      ? bridge.enrollReadyRegions.join(', ')
      : bridge.focusRegion ?? 'selected regions';
    setVitBridgeHint(
      `ViT pre-check passed for ${ready}. Re-capture here to permanently store biometric ID.`
    );
  }, [fromVit]);

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
      setStep(parsedFocusRegion ? enrollStepForRegion(parsedFocusRegion) : 3);
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
    pendingCaptureRef.current = { kind: 'photo', region, angle };
    photoRef.current?.click();
  };

  const openGaitCapture = () => {
    pendingCaptureRef.current = { kind: 'gait' };
    videoRef.current?.click();
  };

  const onPhotoPicked = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    const pendingCapture = pendingCaptureRef.current;
    if (!file || !pendingCapture || pendingCapture.kind !== 'photo' || !enrollmentId) return;

    setBusy(true);
    setError('');
    try {
      let upload = file;
      if (upload.size > 2 * 1024 * 1024) {
        upload = await compressFileToUpload(upload);
      }

      const quality =
        pendingCapture.region === 'eyes'
          ? await gateEyes(upload)
          : pendingCapture.region === 'face'
            ? await gateFace(upload)
            : null;
      if (quality && !quality.canAnalyze) {
        setError(
          quality.suggestions[0] ??
            'Photo quality is too low for this region. Retake with better lighting and framing.'
        );
        return;
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
      pendingCaptureRef.current = null;
    }
  };

  const onVideoPicked = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    const pendingCapture = pendingCaptureRef.current;
    if (!file || pendingCapture?.kind !== 'gait' || !enrollmentId) return;

    if (!isValidVitVideoFile(file)) {
      setError('Use MP4/MOV/WebM under 25 MB, 3–8 seconds, dog walking in frame.');
      pendingCaptureRef.current = null;
      return;
    }

    setBusy(true);
    setError('');
    try {
      const { frames } = await extractVideoFrames(file, {
        maxFrames: 5,
        maxDurationSec: 8,
      });

      const gaitFrames = selectGaitFrames(frames);
      const gaitQuality = await gateGait(gaitFrames);
      if (!gaitQuality.canAnalyze) {
        setError(
          gaitQuality.suggestions[0] ??
            'Video quality is too low for gait analysis. Retake with the dog walking in brighter light.'
        );
        return;
      }

      const data = await postRegionCapture('gait', gaitFrames, 'video');
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
      pendingCaptureRef.current = null;
    }
  };

  const removeCapture = async (mediaId: string) => {
    if (!enrollmentId) return;
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/id/enroll/media', {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enrollmentId, mediaId }),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.error || 'Could not remove capture.');
        return;
      }
      await loadReview(enrollmentId);
    } catch {
      setError('Connection error.');
    } finally {
      setBusy(false);
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
    <PageShell maxWidth="lg">
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

      <BackLink href="/id" label="Back to ID hub" />

      <PageHeader
        eyebrow="Enroll biometric ID"
        eyebrowVariant="emerald"
        title="9-step wizard"
        subtitle={`Signed in as ${userEmail}`}
        className="mt-4 mb-2"
      />

        {vitBridgeHint ? (
          <SectionCard className="mb-6 border-emerald-500/35 bg-emerald-950/25">
            <p className="text-sm text-emerald-100/90 leading-relaxed">{vitBridgeHint}</p>
          </SectionCard>
        ) : null}

        <EnrollStepper steps={STEPS} currentStep={step} />

        {error && (
          <p className="mb-4 rounded-xl border border-red-500/40 bg-red-950/30 px-4 py-3 text-sm text-red-300">
            {error}
          </p>
        )}

        {step === 1 && (
          <SectionCard className="space-y-4">
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
                      className={`w-full rounded-2xl border p-4 text-left transition touch-manipulation min-h-[52px] active:scale-[0.99] ${
                        selectedPetId === pet.id
                          ? 'border-emerald-400 bg-emerald-500/10'
                          : 'border-white/10 bg-white/5 hover:border-white/25'
                      }`}
                      style={{ WebkitTapHighlightColor: 'transparent' }}
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
              <SecondaryButton
                type="button"
                variant="gold"
                fullWidth
                disabled={creatingPet}
                onClick={() => void createPet()}
              >
                {creatingPet ? 'Creating…' : 'Add pet'}
              </SecondaryButton>
            </div>

            <PrimaryButton
              type="button"
              variant="emerald"
              fullWidth
              disabled={busy || !selectedPetId}
              onClick={() => void startEnrollment()}
            >
              {busy ? 'Starting…' : `Continue with ${selectedPet?.name ?? 'pet'}`}
            </PrimaryButton>
          </SectionCard>
        )}

        {step === 2 && (
          <SectionCard className="space-y-4">
            <h2 className="text-lg font-semibold">2. Biometric consent</h2>
            <pre className="whitespace-pre-wrap rounded-2xl border border-white/10 bg-[#0A1428] p-4 text-xs leading-relaxed text-white/75 font-sans">
              {BIOMETRIC_CONSENT_TEXT}
            </pre>
            <label className="flex items-start gap-3 text-sm touch-manipulation min-h-[48px] cursor-pointer">
              <input
                type="checkbox"
                checked={consentChecked}
                onChange={(e) => setConsentChecked(e.target.checked)}
                className="mt-1 h-5 w-5 shrink-0 rounded border-white/30"
              />
              <span>
                I agree to biometric capture and storage (v{BIOMETRIC_CONSENT_VERSION}).
              </span>
            </label>
            <PrimaryButton
              type="button"
              variant="emerald"
              fullWidth
              disabled={busy || !consentChecked}
              onClick={() => void recordConsent()}
            >
              {busy ? 'Saving…' : 'I agree — continue'}
            </PrimaryButton>
          </SectionCard>
        )}

        {step >= 3 && step <= 7 && enrollmentId && (
          <SectionCard className="space-y-4">
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
                  <SecondaryButton
                    type="button"
                    variant="gold"
                    fullWidth
                    onClick={() => {
                      setError('');
                      setStep(4);
                    }}
                  >
                    Continue to Face → ({Math.round(captures.eyes.qualityScore * 100)}% quality)
                  </SecondaryButton>
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
          </SectionCard>
        )}

        {step === 8 && enrollmentId && (
          <SectionCard className="space-y-4">
            <h2 className="text-lg font-semibold">8. Review &amp; confirm</h2>
            <p className="text-sm text-white/65">
              {petName ? `${petName} — ` : ''}confirm all regions before we create your embedding
              and Freedom Paws ID.
            </p>

            <ul className="space-y-2">
              {reviewMedia.map((m) => {
                const label = m.angle ? `${m.region} (${m.angle})` : m.region;
                const pct = Math.round(m.qualityScore * 100);
                const lowQuality = pct < 65;
                return (
                  <li
                    key={m.id}
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm"
                  >
                    <div className="flex justify-between gap-3">
                      <span className="font-semibold capitalize">{label}</span>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={pct >= 65 ? 'text-green-400' : 'text-amber-400'}>
                          {pct}%
                        </span>
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => void removeCapture(m.id)}
                          className="min-h-[44px] min-w-[44px] px-2 text-xs font-semibold text-red-300/80 hover:text-red-200 disabled:opacity-40 touch-manipulation active:bg-red-500/10 rounded-lg"
                          aria-label={`Remove ${label} capture`}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    {m.descriptors[0] && (
                      <p className="mt-1 text-xs text-white/55 truncate">{m.descriptors[0]}</p>
                    )}
                    {lowQuality && (
                      <p className="mt-1 text-xs text-amber-300/70">
                        Low quality — remove or retake from the region step.
                      </p>
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

            <PrimaryButton
              type="button"
              variant="emerald"
              fullWidth
              disabled={busy || !reviewReady}
              onClick={() => void confirmEnrollment()}
            >
              {busy ? 'Creating ID…' : 'Confirm & create Freedom Paws ID'}
            </PrimaryButton>
          </SectionCard>
        )}

        {step === 9 && completeResult && (
          <SectionCard className="space-y-4 text-center">
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

            <WellnessPartnerPanel context="id_enroll_complete" className="text-left" />

            <Link href="/id" className="block text-sm text-white/50 hover:text-white/70">
              Return to ID hub
            </Link>
          </SectionCard>
        )}
    </PageShell>
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
    <SectionCard>
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
      <SecondaryButton
        type="button"
        variant="emerald"
        fullWidth
        disabled={busy || disabled}
        onClick={onCapture}
        className="mt-4 !min-h-[48px] !rounded-xl"
      >
        {busy ? 'Analyzing…' : capture ? 'Retake' : actionLabel ?? 'Take photo'}
      </SecondaryButton>
    </SectionCard>
  );
}
