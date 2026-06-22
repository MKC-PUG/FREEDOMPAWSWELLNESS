'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import ViTMediaUpload, { type VitMediaSelection } from '@/app/diagnostics/ViTMediaUpload';
import type { AnalyzeApiResponse } from '@/lib/ai/types';
import type { VitProRegion } from '@/lib/vit-pro/types';
import VitProReportPanel from './VitProReportPanel';
import { VitProCard } from './VitProUi';

const REGIONS: { value: VitProRegion | ''; label: string }[] = [
  { value: '', label: 'Auto-detect from history' },
  { value: 'eye', label: 'Eye / ocular' },
  { value: 'skin', label: 'Skin / coat' },
  { value: 'oral', label: 'Oral / dental' },
];

export default function VitProAnalyzeClient() {
  const symptomsRef = useRef<HTMLTextAreaElement>(null);
  const signalmentRef = useRef<HTMLTextAreaElement>(null);
  const [media, setMedia] = useState<VitMediaSelection | null>(null);
  const [region, setRegion] = useState<VitProRegion | ''>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<AnalyzeApiResponse | null>(null);

  const runAnalysis = async () => {
    setError('');
    setResult(null);
    const symptoms = symptomsRef.current?.value.trim() ?? '';
    if (!symptoms) {
      setError('Enter history / chief complaint before running CDS.');
      return;
    }
    if (!media) {
      setError('Upload a photo or short video first.');
      return;
    }

    setLoading(true);
    try {
      const form = new FormData();
      form.set('mode', 'vit_pro');
      form.set('outputTier', 'both');
      form.set('symptoms', symptoms);
      form.set('mediaType', media.kind);
      const signalment = signalmentRef.current?.value.trim();
      if (signalment) form.set('signalmentNotes', signalment);
      if (region) form.set('vitRegion', region);

      if (media.kind === 'photo') {
        form.set('image', media.file);
      } else {
        media.frames.forEach((f, i) => {
          if (i === 0) form.set('image', f);
          else form.set(`frame_${i}`, f);
        });
      }

      const res = await fetch('/api/analyze', { method: 'POST', body: form });
      const data = (await res.json()) as AnalyzeApiResponse & { error?: string };
      if (!data.success || !data.vitPro) {
        setError(data.error || 'Analysis failed');
        return;
      }
      setResult(data);
    } catch {
      setError('Network error — try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="space-y-5">
        <VitProCard>
          <label className="block text-xs font-bold uppercase tracking-wide text-white/50 mb-2">
            History / chief complaint *
          </label>
          <textarea
            ref={symptomsRef}
            rows={4}
            className="w-full rounded-xl border border-white/15 bg-black/30 px-3 py-2 text-sm text-white placeholder:text-white/30"
            placeholder="e.g. 3-day history of mucoid ocular discharge, squinting OS…"
          />
        </VitProCard>

        <VitProCard>
          <label className="block text-xs font-bold uppercase tracking-wide text-white/50 mb-2">
            Signalment (optional)
          </label>
          <textarea
            ref={signalmentRef}
            rows={2}
            className="w-full rounded-xl border border-white/15 bg-black/30 px-3 py-2 text-sm text-white placeholder:text-white/30"
            placeholder="Species, breed, age, sex…"
          />
        </VitProCard>

        <VitProCard>
          <label className="block text-xs font-bold uppercase tracking-wide text-white/50 mb-2">
            Body region
          </label>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value as VitProRegion | '')}
            className="w-full rounded-xl border border-white/15 bg-black/30 px-3 py-2 text-sm text-white"
          >
            {REGIONS.map((r) => (
              <option key={r.label} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </VitProCard>

        <VitProCard>
          <ViTMediaUpload
            selection={media}
            initialPhoto={null}
            uploadSuccess={false}
            onSelect={setMedia}
            onClear={() => setMedia(null)}
            onError={setError}
          />
        </VitProCard>

        {error ? <p className="text-sm text-rose-300">{error}</p> : null}

        <button
          type="button"
          disabled={loading}
          onClick={() => void runAnalysis()}
          className="w-full rounded-2xl bg-sky-600 hover:bg-sky-500 disabled:opacity-50 py-4 text-sm font-bold touch-manipulation"
        >
          {loading ? 'Generating CDS report…' : 'Run ViT Pro CDS analysis'}
        </button>

        <p className="text-[11px] text-white/40 leading-relaxed">
          For licensed veterinary professionals and authorized advisors. Output includes literature
          citations — not a definitive diagnosis.
        </p>
      </div>

      <div>
        {result?.vitPro ? (
          <VitProReportPanel vet={result.vitPro} publicTier={result.vitProPublic} />
        ) : (
          <VitProCard className="min-h-[320px] flex flex-col items-center justify-center text-center">
            <p className="text-white/50 text-sm max-w-xs">
              Upload media and run analysis to generate a structured CDS report with citations and
              EMR-ready text.
            </p>
            <Link href="/vit-pro/benchmark" className="mt-4 text-xs text-sky-400 hover:underline">
              Benchmark workflow →
            </Link>
          </VitProCard>
        )}
      </div>
    </div>
  );
}
