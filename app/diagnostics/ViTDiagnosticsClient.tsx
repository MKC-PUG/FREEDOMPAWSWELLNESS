'use client';

import { useEffect, useRef, useState } from 'react';
import { protocols } from '@/app/protocols/protocols';
import { compressFileToUpload } from '@/lib/compress-image';
import { PWA_VERSION } from '@/lib/pwa-version';
import BackLink from '@/app/components/BackLink';
import type { AnalyzeApiResponse } from '@/lib/ai/types';
import ViTMediaUpload, { type VitMediaSelection } from './ViTMediaUpload';
import ViTResultsPanel from './ViTResultsPanel';
import ViTIdentityResultsPanel from './ViTIdentityResultsPanel';
import type { IdentityRegion } from '@/lib/id/types';
import { IDENTITY_REGIONS } from '@/lib/id/types';
import ViTQualityGate from './ViTQualityGate';
import ViTHowItWorks from './ViTHowItWorks';
import {
  assessPhotoForVit,
  assessVideoFramesForVit,
  gateEyes,
  gateFace,
  gateGait,
  type VitMediaQuality,
} from '@/lib/vit/media-quality-gate';
import { selectGaitFrames } from '@/lib/vit/extract-video-frames';
import { saveVitRunLocal, saveVitRunServer } from '@/lib/vit/history';
import { fetchServerPets } from '@/lib/mypets/api';
import { readPetProfiles } from '@/lib/mypets/storage';
import {
  buildDiagnosticsPath,
  diagnosticsPathWithoutUploadParams,
  diagnosticsReturnTo,
} from '@/lib/diagnostics-url';

const REGION_LABELS: Record<IdentityRegion, string> = {
  eyes: 'Eyes',
  face: 'Face',
  body: 'Body / coat',
  posture: 'Posture',
  gait: 'Gait (video)',
};

type Props = {
  initialPhoto: string | null;
  initialFileName: string;
  uploadError: string | null;
  uploadSuccess: boolean;
  identityMode?: boolean;
  petName?: string | null;
  petId?: string | null;
};

async function dataUrlToFile(dataUrl: string, name: string): Promise<File> {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  return new File([blob], name, { type: blob.type || 'image/jpeg' });
}

export default function ViTDiagnosticsClient({
  initialPhoto,
  initialFileName,
  uploadError,
  uploadSuccess,
  identityMode = false,
  petName = null,
  petId = null,
}: Props) {
  const symptomsRef = useRef<HTMLTextAreaElement>(null);
  const identityNotesRef = useRef<HTMLTextAreaElement>(null);
  const [selectedRegions, setSelectedRegions] = useState<IdentityRegion[]>(['face']);
  const [alsoCaptureId, setAlsoCaptureId] = useState(false);
  const [media, setMedia] = useState<VitMediaSelection | null>(null);
  const [result, setResult] = useState<AnalyzeApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [localUploadError, setLocalUploadError] = useState('');
  const [feedbackSent, setFeedbackSent] = useState<'helpful' | 'wrong' | null>(null);
  const [wrongProtocol, setWrongProtocol] = useState(protocols[0]?.title ?? '');
  const [mediaQuality, setMediaQuality] = useState<VitMediaQuality | null>(null);
  const [qualityChecking, setQualityChecking] = useState(false);
  const [activePetId, setActivePetId] = useState(petId);
  const [activePetName, setActivePetName] = useState(petName);

  useEffect(() => {
    setActivePetId(petId);
    setActivePetName(petName);
  }, [petId, petName]);

  useEffect(() => {
    if (activePetId) return;
    void fetchServerPets()
      .then((pets) => {
        if (pets?.[0]) {
          setActivePetId(pets[0].id);
          setActivePetName(pets[0].name);
          return;
        }
        const local = readPetProfiles();
        if (local[0]) {
          setActivePetId(local[0].id);
          setActivePetName(local[0].name);
        }
      })
      .catch(() => {
        const local = readPetProfiles();
        if (local[0]) {
          setActivePetId(local[0].id);
          setActivePetName(local[0].name);
        }
      });
  }, [activePetId]);

  const resolvedPetId = activePetId;
  const resolvedPetName = activePetName;
  const diagnosticsReturnPath = diagnosticsReturnTo({
    petId: resolvedPetId,
    pet: resolvedPetName,
    mode: identityMode ? 'identity' : null,
  });

  const assessMediaQuality = async (
    selection: VitMediaSelection
  ): Promise<VitMediaQuality> => {
    if (identityMode) {
      if (selection.kind === 'video') {
        return gateGait(selection.frames);
      }
      if (selectedRegions.includes('eyes')) {
        return gateEyes(selection.file);
      }
      if (selectedRegions.includes('face')) {
        return gateFace(selection.file);
      }
      return assessPhotoForVit(selection.file);
    }
    return selection.kind === 'video'
      ? await assessVideoFramesForVit(selection.frames)
      : await assessPhotoForVit(selection.file);
  };

  const runQualityCheck = async (selection: VitMediaSelection) => {
    setQualityChecking(true);
    setMediaQuality(null);
    try {
      const quality = await assessMediaQuality(selection);
      setMediaQuality(quality);
      if (!quality.canAnalyze) {
        setError('Media quality is too low for reliable AI analysis. See tips below.');
      }
    } catch {
      setMediaQuality({
        status: 'warn',
        score: 60,
        issues: [],
        suggestions: ['Could not verify quality — you may still try analyzing'],
        canAnalyze: true,
      });
    } finally {
      setQualityChecking(false);
    }
  };

  useEffect(() => {
    if (!initialPhoto || media) return;
    void dataUrlToFile(initialPhoto, initialFileName).then(async (file) => {
      const sel: VitMediaSelection = { kind: 'photo', file, previewUrl: initialPhoto };
      setMedia(sel);
      await runQualityCheck(sel);
    });
  }, [initialPhoto, initialFileName, media]);

  const hasMedia = Boolean(media || (uploadSuccess && initialPhoto));

  const toggleRegion = (region: IdentityRegion) => {
    setSelectedRegions((prev) => {
      if (prev.includes(region)) {
        return prev.length > 1 ? prev.filter((r) => r !== region) : prev;
      }
      return [...prev, region];
    });
  };

  const resetAnalysis = () => {
    setResult(null);
    setError('');
    setFeedbackSent(null);
    if (symptomsRef.current) symptomsRef.current.value = '';
    if (identityNotesRef.current) identityNotesRef.current.value = '';
  };

  const clearMedia = async () => {
    await fetch('/api/clear-upload', { method: 'POST' }).catch(() => {});
    setMedia(null);
    setMediaQuality(null);
    setLocalUploadError('');
    setResult(null);
    window.location.href = buildDiagnosticsPath({
      petId: resolvedPetId,
      pet: resolvedPetName,
      mode: identityMode ? 'identity' : null,
    });
  };

  const analyze = async () => {
    const symptoms = symptomsRef.current?.value ?? '';
    const identityNotes = identityNotesRef.current?.value ?? '';

    if (!media && !initialPhoto) {
      setError('Please upload a photo or short video first.');
      return;
    }

    if (!identityMode && !symptoms.trim()) {
      setError('Please describe symptoms.');
      return;
    }

    const useBothMode =
      !identityMode && Boolean(resolvedPetId) && alsoCaptureId && selectedRegions.length > 0;

    if (useBothMode && !symptoms.trim()) {
      setError('Please describe symptoms for wellness analysis.');
      return;
    }

    if (identityMode && selectedRegions.length === 0) {
      setError('Select at least one identity region.');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);
    setFeedbackSent(null);

    try {
      let selection = media;
      if (!selection && initialPhoto) {
        const file = await dataUrlToFile(initialPhoto, initialFileName);
        selection = { kind: 'photo', file, previewUrl: initialPhoto };
      }
      if (!selection) {
        setError('Please upload a photo or short video first.');
        return;
      }

      const formData = new FormData();
      if (identityMode) {
        formData.append('mode', 'identity');
        formData.append('regions', selectedRegions.join(','));
        if (identityNotes.trim()) {
          formData.append('identityNotes', identityNotes.trim());
        }
      } else if (useBothMode) {
        formData.append('mode', 'both');
        formData.append('symptoms', symptoms);
        formData.append('regions', selectedRegions.join(','));
        if (identityNotes.trim()) {
          formData.append('identityNotes', identityNotes.trim());
        }
      } else {
        formData.append('mode', 'wellness');
        formData.append('symptoms', symptoms);
      }

      if (selection.kind === 'video') {
        formData.append('mediaType', 'video');
        const gaitFrames = identityMode ? selectGaitFrames(selection.frames) : selection.frames;
        const vq = identityMode
          ? await gateGait(gaitFrames)
          : await assessVideoFramesForVit(selection.frames);
        setMediaQuality(vq);
        if (!vq.canAnalyze) {
          setError('Video quality is too low. Retake in brighter light with the dog centered.');
          return;
        }
        gaitFrames.forEach((frame, i) => {
          formData.append(i === 0 ? 'image' : `frame_${i}`, frame, frame.name);
        });
      } else {
        formData.append('mediaType', 'photo');
        let file = selection.file;
        if (file.size > 2 * 1024 * 1024) {
          file = await compressFileToUpload(file);
        }
        const pq = identityMode
          ? selectedRegions.includes('eyes')
            ? await gateEyes(file)
            : selectedRegions.includes('face')
              ? await gateFace(file)
              : await assessPhotoForVit(file)
          : await assessPhotoForVit(file);
        setMediaQuality(pq);
        if (!pq.canAnalyze) {
          setError('Photo quality is too low. Retake with the dog in frame and good lighting.');
          return;
        }
        formData.append('image', file, file.name || 'dog-photo.jpg');
      }

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        setResult(data);
        if (data.mode === 'wellness' || data.mode === 'both') {
          saveVitRunLocal(data, resolvedPetId ?? null, resolvedPetName ?? null);
          if (resolvedPetId) void saveVitRunServer(resolvedPetId, data);
        }
      } else {
        setError(data.error || 'Analysis failed');
      }
    } catch {
      setError('Connection error. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const sendFeedback = async (feedback: 'helpful' | 'wrong') => {
    if (!result?.analysisId) return;
    await fetch('/api/symptom-feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        analysisId: result.analysisId,
        feedback,
        suggestedProtocol: feedback === 'wrong' ? wrongProtocol : undefined,
      }),
    });
    setFeedbackSent(feedback);
  };

  const displayError = uploadError && !hasMedia ? uploadError : localUploadError;
  const canAnalyze =
    hasMedia &&
    !qualityChecking &&
    (mediaQuality === null || mediaQuality.canAnalyze);

  return (
    <div className="min-h-screen bg-[#0A1428] text-white p-6 sm:p-8">
      <div className="max-w-5xl mx-auto">
        <BackLink href={identityMode ? '/id' : '/mypets'} label={identityMode ? 'Back to ID hub' : 'Back to My Pets'} />
        {resolvedPetName && (
          <div className="mt-4 mb-2 rounded-2xl border border-amber-500/35 bg-amber-950/25 px-4 py-3 text-center text-sm text-amber-100">
            ViT scan for <strong>{resolvedPetName}</strong>
            {resolvedPetId ? (
              <>
                {' '}
                ·{' '}
                <a
                  href={`/id/enroll?petId=${encodeURIComponent(resolvedPetId)}`}
                  className="text-amber-300 underline"
                >
                  Enroll ID →
                </a>
              </>
            ) : null}
          </div>
        )}
        <h1 className="text-5xl font-bold text-center mb-2">
          {identityMode ? 'ViT Identity Capture' : 'ViT Diagnostics'}
        </h1>
        <p className="text-center text-[#F5C242] mb-2">
          {identityMode
            ? 'Upload photo or video — capture identity regions for Freedom Paws ID'
            : 'Upload photo or short video + symptoms for AI protocol recommendation'}
        </p>
        <p className="text-center text-sm font-semibold text-[#F5C242] mb-1">
          App release {PWA_VERSION}
        </p>
        <p className="text-center text-xs text-white/40 mb-4">
          Photo · short video · symptom matching · AI vision
        </p>

        {!identityMode && (
          <div className="mb-6 rounded-2xl border border-emerald-500/25 bg-emerald-950/15 px-4 py-3 text-center text-xs text-emerald-200/85 leading-relaxed">
            Results link to{' '}
            <a href="/wellness/safe-products" className="font-bold text-emerald-300 underline">
              Safe Picks
            </a>{' '}
            and{' '}
            <a href="/protocols" className="font-bold text-amber-300 underline">
              protocols
            </a>
            . Enroll{' '}
            <a href="/id/enroll" className="font-bold text-amber-300 underline">
              Freedom Paws ID
            </a>{' '}
            from My Pets when ready.
          </div>
        )}

        <ViTHowItWorks />

        {hasMedia && canAnalyze && mediaQuality?.status === 'pass' && (
          <div className="mb-6 rounded-2xl border-2 border-green-500/50 bg-green-900/20 p-4 text-center">
            <p className="text-green-400 font-semibold">
              ✓ Media quality looks good — describe symptoms, tap Get AI Recommendation
            </p>
          </div>
        )}

        {displayError && (
          <div className="mb-6 rounded-2xl border-2 border-red-500 bg-red-950/50 p-4 text-center">
            <p className="text-red-300 font-semibold">{displayError}</p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-[#1F2A44] rounded-3xl p-8">
            <h3 className="text-xl font-semibold mb-4">1. Upload Photo or Video</h3>

            <ViTMediaUpload
              returnTo={diagnosticsReturnPath}
              onSelect={(sel) => {
                setLocalUploadError('');
                setError('');
                setMedia(sel);
                setResult(null);
                setFeedbackSent(null);
                void runQualityCheck(sel);
                if (typeof window !== 'undefined' && window.location.search) {
                  window.history.replaceState(
                    {},
                    '',
                    diagnosticsPathWithoutUploadParams(window.location.search)
                  );
                }
              }}
              onClear={() => void clearMedia()}
              onError={setLocalUploadError}
              uploadSuccess={uploadSuccess}
              initialPhoto={initialPhoto}
              selection={media}
            />

            <div className="mt-4">
              <ViTQualityGate
                quality={mediaQuality}
                checking={qualityChecking}
                mediaKind={media?.kind ?? null}
              />
            </div>
          </div>

          <div className="bg-[#1F2A44] rounded-3xl p-8 flex flex-col">
            {identityMode ? (
              <>
                <h3 className="text-xl font-semibold mb-4">2. Identity regions</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {IDENTITY_REGIONS.map((region) => {
                    const active = selectedRegions.includes(region);
                    return (
                      <button
                        key={region}
                        type="button"
                        onClick={() => toggleRegion(region)}
                        className={`rounded-full px-4 py-2.5 min-h-[44px] text-sm font-semibold border transition touch-manipulation active:scale-[0.98] ${
                          active
                            ? 'border-emerald-400 bg-emerald-500/20 text-emerald-200'
                            : 'border-white/20 bg-[#0A1428] text-white/60 hover:border-white/40'
                        }`}
                        style={{ WebkitTapHighlightColor: 'transparent' }}
                      >
                        {REGION_LABELS[region]}
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs text-white/45 mb-4">
                  Use video for gait. Photo works for eyes, face, body, and posture.
                </p>
                <textarea
                  ref={identityNotesRef}
                  name="identityNotes"
                  defaultValue=""
                  placeholder="Optional: lighting, collar color, capture context…"
                  className="w-full h-24 bg-[#0A1428] border border-emerald-500/30 rounded-2xl p-4 text-white resize-y focus:outline-none focus:border-emerald-400 text-sm"
                />
              </>
            ) : (
              <>
                <h3 className="text-xl font-semibold mb-4">2. Describe Symptoms</h3>
                <textarea
                  ref={symptomsRef}
                  name="symptoms"
                  defaultValue=""
                  placeholder="e.g. limping on walks, sneezing, senior pacing at night..."
                  className="w-full h-40 bg-[#0A1428] border border-[#F5C242]/30 rounded-2xl p-6 text-white resize-y focus:outline-none focus:border-[#F5C242]"
                />
                {resolvedPetId ? (
                  <div className="mt-5 rounded-2xl border border-emerald-500/25 bg-emerald-950/15 p-4">
                    <label className="flex items-start gap-3 cursor-pointer touch-manipulation min-h-[48px]">
                      <input
                        type="checkbox"
                        checked={alsoCaptureId}
                        onChange={(e) => setAlsoCaptureId(e.target.checked)}
                        className="mt-1 h-5 w-5 shrink-0 rounded border-white/30"
                      />
                      <span className="text-sm text-emerald-100/90 leading-relaxed">
                        Also analyze for{' '}
                        <strong className="text-emerald-300">Freedom Paws ID</strong> (Track 1) —
                        one upload for wellness + identity regions
                      </span>
                    </label>
                    {alsoCaptureId ? (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {IDENTITY_REGIONS.map((region) => {
                          const active = selectedRegions.includes(region);
                          return (
                            <button
                              key={region}
                              type="button"
                              onClick={() => toggleRegion(region)}
                              className={`rounded-full px-3 py-2 min-h-[44px] text-xs font-semibold border transition touch-manipulation active:scale-[0.98] ${
                                active
                                  ? 'border-emerald-400 bg-emerald-500/20 text-emerald-200'
                                  : 'border-white/20 bg-[#0A1428] text-white/60 hover:border-white/40'
                              }`}
                              style={{ WebkitTapHighlightColor: 'transparent' }}
                            >
                              {REGION_LABELS[region]}
                            </button>
                          );
                        })}
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </>
            )}

            <button
              type="button"
              onClick={() => void analyze()}
              disabled={loading || !canAnalyze}
              className={`mt-6 min-h-[52px] disabled:opacity-50 text-black font-bold py-4 rounded-2xl text-xl transition touch-manipulation active:scale-[0.99] ${
                identityMode
                  ? 'bg-emerald-400 hover:bg-emerald-400/90 active:bg-emerald-300'
                  : 'bg-[#F5C242] hover:bg-[#F5C242]/90 active:bg-amber-300'
              }`}
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              {loading
                ? 'Analyzing…'
                : identityMode
                  ? 'Analyze identity regions'
                  : alsoCaptureId && resolvedPetId
                    ? 'Get wellness + ID analysis'
                    : 'Get AI Recommendation'}
            </button>

            {!hasMedia && (
              <p className="mt-3 text-center text-xs text-white/45">
                Upload a photo or video first — then this button activates
              </p>
            )}
            {hasMedia && !qualityChecking && mediaQuality && !mediaQuality.canAnalyze && (
              <p className="mt-3 text-center text-xs text-red-400/90">
                Improve photo or video quality above to unlock analysis
              </p>
            )}
            {hasMedia && mediaQuality?.status === 'warn' && mediaQuality.canAnalyze && (
              <p className="mt-3 text-center text-xs text-amber-400/80">
                Quality is OK — a brighter, closer shot may improve results
              </p>
            )}

            {result ? (
              <>
                {(result.mode === 'wellness' || result.mode === 'both') && result.primary ? (
                  <ViTResultsPanel
                    result={result}
                    feedbackSent={feedbackSent}
                    wrongProtocol={wrongProtocol}
                    onWrongProtocolChange={setWrongProtocol}
                    onFeedback={(f) => void sendFeedback(f)}
                    onTryAnother={resetAnalysis}
                  />
                ) : null}
                {(identityMode ||
                  result.mode === 'identity' ||
                  (result.mode === 'both' && result.identity)) ? (
                  <ViTIdentityResultsPanel
                    result={result}
                    petId={resolvedPetId}
                    onTryAnother={resetAnalysis}
                  />
                ) : null}
              </>
            ) : null}

            {error && <p className="text-red-400 mt-6 text-center">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
