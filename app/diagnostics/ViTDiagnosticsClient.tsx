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
  type VitMediaQuality,
} from '@/lib/vit/media-quality-gate';

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
  const [media, setMedia] = useState<VitMediaSelection | null>(null);
  const [result, setResult] = useState<AnalyzeApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [localUploadError, setLocalUploadError] = useState('');
  const [feedbackSent, setFeedbackSent] = useState<'helpful' | 'wrong' | null>(null);
  const [wrongProtocol, setWrongProtocol] = useState(protocols[0]?.title ?? '');
  const [mediaQuality, setMediaQuality] = useState<VitMediaQuality | null>(null);
  const [qualityChecking, setQualityChecking] = useState(false);

  const runQualityCheck = async (selection: VitMediaSelection) => {
    setQualityChecking(true);
    setMediaQuality(null);
    try {
      const quality =
        selection.kind === 'video'
          ? await assessVideoFramesForVit(selection.frames)
          : await assessPhotoForVit(selection.file);
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
    window.location.href = '/diagnostics';
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
      } else {
        formData.append('mode', 'wellness');
        formData.append('symptoms', symptoms);
      }

      if (selection.kind === 'video') {
        formData.append('mediaType', 'video');
        const vq = await assessVideoFramesForVit(selection.frames);
        setMediaQuality(vq);
        if (!vq.canAnalyze) {
          setError('Video quality is too low. Retake in brighter light with the dog centered.');
          return;
        }
        selection.frames.forEach((frame, i) => {
          formData.append(i === 0 ? 'image' : `frame_${i}`, frame, frame.name);
        });
      } else {
        formData.append('mediaType', 'photo');
        let file = selection.file;
        if (file.size > 2 * 1024 * 1024) {
          file = await compressFileToUpload(file);
        }
        const pq = await assessPhotoForVit(file);
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
        {petName && (
          <div className="mt-4 mb-2 rounded-2xl border border-amber-500/35 bg-amber-950/25 px-4 py-3 text-center text-sm text-amber-100">
            ViT scan for <strong>{petName}</strong>
            {petId ? (
              <>
                {' '}
                ·{' '}
                <a href={`/id/enroll?petId=${encodeURIComponent(petId)}`} className="text-amber-300 underline">
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
              onSelect={(sel) => {
                setLocalUploadError('');
                setError('');
                setMedia(sel);
                setResult(null);
                setFeedbackSent(null);
                void runQualityCheck(sel);
                if (typeof window !== 'undefined' && window.location.search) {
                  window.history.replaceState({}, '', '/diagnostics');
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
                        className={`rounded-full px-4 py-2 text-sm font-semibold border transition ${
                          active
                            ? 'border-emerald-400 bg-emerald-500/20 text-emerald-200'
                            : 'border-white/20 bg-[#0A1428] text-white/60 hover:border-white/40'
                        }`}
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
              </>
            )}

            <button
              type="button"
              onClick={() => void analyze()}
              disabled={loading || !canAnalyze}
              className={`mt-6 disabled:opacity-50 text-black font-bold py-4 rounded-2xl text-xl transition ${
                identityMode
                  ? 'bg-emerald-400 hover:bg-emerald-400/90'
                  : 'bg-[#F5C242] hover:bg-[#F5C242]/90'
              }`}
            >
              {loading
                ? 'Analyzing…'
                : identityMode
                  ? 'Analyze identity regions'
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

            {result &&
              (identityMode || result.mode === 'identity' ? (
                <ViTIdentityResultsPanel result={result} onTryAnother={resetAnalysis} />
              ) : (
                <ViTResultsPanel
                  result={result}
                  feedbackSent={feedbackSent}
                  wrongProtocol={wrongProtocol}
                  onWrongProtocolChange={setWrongProtocol}
                  onFeedback={(f) => void sendFeedback(f)}
                  onTryAnother={resetAnalysis}
                />
              ))}

            {error && <p className="text-red-400 mt-6 text-center">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
