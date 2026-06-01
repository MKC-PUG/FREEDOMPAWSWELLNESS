'use client';

import { useEffect, useRef, useState } from 'react';
import { protocols } from '@/app/protocols/protocols';
import { compressFileToUpload } from '@/lib/compress-image';
import { PWA_VERSION } from '@/lib/pwa-version';
import BackLink from '@/app/components/BackLink';
import type { AnalyzeApiResponse } from '@/lib/ai/types';
import ViTMediaUpload, { type VitMediaSelection } from './ViTMediaUpload';
import ViTResultsPanel from './ViTResultsPanel';
import ViTQualityGate from './ViTQualityGate';
import { PHOTO_UPLOAD_BUILD } from '@/app/components/PhotoUploadZone';
import {
  assessPhotoForVit,
  assessVideoFramesForVit,
  type VitMediaQuality,
} from '@/lib/vit/media-quality-gate';

type Props = {
  initialPhoto: string | null;
  initialFileName: string;
  uploadError: string | null;
  uploadSuccess: boolean;
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
}: Props) {
  const symptomsRef = useRef<HTMLTextAreaElement>(null);
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

  const resetAnalysis = () => {
    setResult(null);
    setError('');
    setFeedbackSent(null);
    if (symptomsRef.current) symptomsRef.current.value = '';
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

    if (!media && !initialPhoto) {
      setError('Please upload a photo or short video first.');
      return;
    }

    if (!symptoms.trim()) {
      setError('Please describe symptoms.');
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
      formData.append('symptoms', symptoms);

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
        <BackLink />
        <h1 className="text-5xl font-bold text-center mb-2">ViT Diagnostics</h1>
        <p className="text-center text-[#F5C242] mb-2">
          Upload photo or short video + symptoms for AI protocol recommendation
        </p>
        <p className="text-center text-sm font-semibold text-[#F5C242] mb-1">
          App release {PWA_VERSION}
        </p>
        <p className="text-center text-xs text-white/40 mb-4">
          Upload module {PHOTO_UPLOAD_BUILD} · Photo + video (Phase 2b)
        </p>

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
            <h3 className="text-xl font-semibold mb-4">2. Describe Symptoms</h3>
            <textarea
              ref={symptomsRef}
              name="symptoms"
              defaultValue=""
              placeholder="e.g. limping on walks, sneezing, senior pacing at night..."
              className="w-full h-40 bg-[#0A1428] border border-[#F5C242]/30 rounded-2xl p-6 text-white resize-y focus:outline-none focus:border-[#F5C242]"
            />

            <button
              type="button"
              onClick={() => void analyze()}
              disabled={loading || !canAnalyze}
              className="mt-6 bg-[#F5C242] hover:bg-[#F5C242]/90 disabled:opacity-50 text-black font-bold py-4 rounded-2xl text-xl transition"
            >
              {loading ? 'Analyzing…' : 'Get AI Recommendation'}
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

            {result && (
              <ViTResultsPanel
                result={result}
                feedbackSent={feedbackSent}
                wrongProtocol={wrongProtocol}
                onWrongProtocolChange={setWrongProtocol}
                onFeedback={(f) => void sendFeedback(f)}
                onTryAnother={resetAnalysis}
              />
            )}

            {error && <p className="text-red-400 mt-6 text-center">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
