'use client';

import { useEffect, useRef, useState } from 'react';
import { protocols } from '@/app/protocols/protocols';
import { compressFileToUpload } from '@/lib/compress-image';
import PhotoUploadZone, { PHOTO_UPLOAD_BUILD } from '@/app/components/PhotoUploadZone';
import BackLink from '@/app/components/BackLink';
import { protocolDisplayName } from '@/lib/ai/symptom-lexicon';
import type { ImageSelection } from '@/lib/read-image-file';

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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [localUploadError, setLocalUploadError] = useState('');
  const [feedbackSent, setFeedbackSent] = useState<'helpful' | 'wrong' | null>(null);
  const [wrongProtocol, setWrongProtocol] = useState(protocols[0]?.title ?? '');

  useEffect(() => {
    if (!initialPhoto) return;
    void dataUrlToFile(initialPhoto, initialFileName).then(setImageFile);
  }, [initialPhoto, initialFileName]);

  const handlePhotoSelect = (selection: ImageSelection) => {
    setLocalUploadError('');
    setError('');
    setImageFile(selection.file);
    setResult(null);
    setFeedbackSent(null);
    if (typeof window !== 'undefined' && window.location.search) {
      window.history.replaceState({}, '', '/diagnostics');
    }
  };

  const clearPhoto = async () => {
    await fetch('/api/clear-upload', { method: 'POST' }).catch(() => {});
    setImageFile(null);
    setLocalUploadError('');
    window.location.href = '/diagnostics';
  };

  const analyzeImage = async () => {
    const symptoms = symptomsRef.current?.value ?? '';

    if (!imageFile && !initialPhoto) {
      setError('Please upload a photo first.');
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
    setFeedbackSent(null);

    try {
      let file = imageFile;
      if (!file && initialPhoto) {
        file = await dataUrlToFile(initialPhoto, initialFileName);
      }
      if (!file) {
        setError('Please upload a photo first.');
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        file = await compressFileToUpload(file);
      }

      const formData = new FormData();
      formData.append('image', file, file.name || 'dog-photo.jpg');
      formData.append('symptoms', symptoms);

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

  const hasPhoto = Boolean(initialPhoto || imageFile);
  const displayError = uploadError && !hasPhoto ? uploadError : localUploadError;

  return (
    <div className="min-h-screen bg-[#0A1428] text-white p-6 sm:p-8">
      <div className="max-w-5xl mx-auto">
        <BackLink />
        <h1 className="text-5xl font-bold text-center mb-2">ViT Diagnostics</h1>
        <p className="text-center text-[#F5C242] mb-2">Upload photo + symptoms for AI protocol recommendation</p>
        <p className="text-center text-xs text-white/40 mb-2">
          Build {PHOTO_UPLOAD_BUILD} · Server upload mode
        </p>
        <p className="text-center text-xs text-amber-400/80 mb-4">
          iPhone: use production server (npm run start:mobile) — dev mode reloads every ~1 min
        </p>
        <p className="text-center text-xs mb-4">
          <a href="/vit-upload.html" className="text-[#F5C242] underline">
            Open backup upload page (recommended if photo clears after Send anyway)
          </a>
          {' · '}
          <a href="/admin/symptoms" className="text-[#F5C242] underline">
            Review symptom queue
          </a>
        </p>

        {hasPhoto && !uploadSuccess && (
          <div className="mb-6 rounded-2xl border-2 border-green-500/50 bg-green-900/20 p-4 text-center">
            <p className="text-green-400 font-semibold">
              ✓ Photo ready — scroll down, describe symptoms, tap Get AI Recommendation
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
            <h3 className="text-xl font-semibold mb-4">1. Upload Photo</h3>

            {uploadSuccess && initialPhoto && (
              <div className="mb-5 rounded-2xl border-2 border-green-500/50 bg-green-900/20 p-4">
                <p className="text-green-400 font-semibold mb-3">✓ Photo saved on server</p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={initialPhoto}
                  alt="Uploaded dog"
                  className="max-h-72 w-full object-contain rounded-2xl border border-[#F5C242]/40"
                />
              </div>
            )}

            {!uploadSuccess && (
              <PhotoUploadZone
                onSelect={handlePhotoSelect}
                onClear={() => void clearPhoto()}
                onError={setLocalUploadError}
                storageKey="vit-diagnostics"
                returnTo="/diagnostics"
              />
            )}

            {uploadSuccess && (
              <button
                type="button"
                onClick={() => void clearPhoto()}
                className="w-full rounded-2xl border border-white/20 py-3 text-sm text-white/70"
              >
                Upload a Different Photo
              </button>
            )}

            {displayError && (
              <p className="text-red-400 mt-4 text-center text-sm font-medium">{displayError}</p>
            )}
          </div>

          <div className="bg-[#1F2A44] rounded-3xl p-8 flex flex-col">
            <h3 className="text-xl font-semibold mb-4">2. Describe Symptoms</h3>
            <textarea
              ref={symptomsRef}
              name="symptoms"
              defaultValue=""
              placeholder="e.g. painful joints, constipation, red eyes, fatigue..."
              className="w-full h-40 bg-[#0A1428] border border-[#F5C242]/30 rounded-2xl p-6 text-white resize-y focus:outline-none focus:border-[#F5C242]"
            />

            <button
              type="button"
              onClick={() => void analyzeImage()}
              disabled={loading || !hasPhoto}
              className="mt-6 bg-[#F5C242] hover:bg-[#F5C242]/90 disabled:opacity-50 text-black font-bold py-4 rounded-2xl text-xl transition"
            >
              {loading ? 'Analyzing...' : 'Get AI Recommendation'}
            </button>

            {!hasPhoto && (
              <p className="mt-3 text-center text-xs text-white/45">
                Upload a photo first — then this button activates
              </p>
            )}

            {result && (
              <div className="mt-8 space-y-6">
                {result.primary && (
                  <div className="bg-green-900/30 border border-green-500/50 rounded-2xl p-6">
                    <h4 className="text-green-400 text-sm font-medium">PRIMARY RECOMMENDATION</h4>
                    <p className="text-3xl font-bold mt-2">{result.primary.protocol}</p>
                    <p className="text-green-400 mt-1">Confidence: {result.primary.confidence}</p>
                  </div>
                )}

                {result.secondary && (
                  <div className="bg-blue-900/30 border border-blue-500/50 rounded-2xl p-6">
                    <h4 className="text-blue-400 text-sm font-medium">SECONDARY CONSIDERATION</h4>
                    <p className="text-3xl font-bold mt-2">{result.secondary.protocol}</p>
                    <p className="text-blue-400 mt-1">Confidence: {result.secondary.confidence}</p>
                  </div>
                )}

                {result.reasoning && (
                  <p className="text-center text-xs text-white/45">{result.reasoning}</p>
                )}

                {result.unknownPhrases?.length > 0 && (
                  <p className="text-center text-xs text-amber-400/80">
                    New phrases queued for review: {result.unknownPhrases.join(', ')}
                  </p>
                )}

                {result.analysisId && !feedbackSent && (
                  <div className="rounded-2xl border border-white/10 bg-[#0A1428]/60 p-4 space-y-3">
                    <p className="text-sm text-center text-white/70">Was this recommendation right?</p>
                    <div className="flex gap-3 justify-center">
                      <button
                        type="button"
                        onClick={() => void sendFeedback('helpful')}
                        className="rounded-xl bg-green-700/80 px-4 py-2 text-sm font-semibold"
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        onClick={() => void sendFeedback('wrong')}
                        className="rounded-xl border border-red-500/50 px-4 py-2 text-sm text-red-300"
                      >
                        No — queue for review
                      </button>
                    </div>
                    <select
                      value={wrongProtocol}
                      onChange={(e) => setWrongProtocol(e.target.value)}
                      className="w-full rounded-xl bg-[#0A1428] border border-white/20 px-3 py-2 text-xs"
                    >
                      {protocols.map((p) => (
                        <option key={p.slug} value={p.title}>
                          If wrong, suggest: {protocolDisplayName(p.title)}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {feedbackSent && (
                  <p className="text-center text-sm text-green-400">
                    Thanks — feedback recorded for lexicon review.
                  </p>
                )}
              </div>
            )}

            {error && <p className="text-red-400 mt-6 text-center">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
