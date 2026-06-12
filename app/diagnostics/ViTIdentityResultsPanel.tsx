'use client';

import Link from 'next/link';
import type { AnalyzeApiResponse } from '@/lib/ai/types';
import type { IdentityRegion } from '@/lib/id/types';
import { IDENTITY_REGIONS } from '@/lib/id/types';

const REGION_LABELS: Record<IdentityRegion, string> = {
  eyes: 'Eyes',
  face: 'Face',
  body: 'Body / coat',
  posture: 'Posture',
  gait: 'Gait / movement',
};

type Props = {
  result: AnalyzeApiResponse;
  onTryAnother: () => void;
};

export default function ViTIdentityResultsPanel({ result, onTryAnother }: Props) {
  const identity = result.identity;
  const mediaLabel =
    result.mediaType === 'video' && (result.frameCount ?? 0) > 1
      ? `Video · ${result.frameCount} frames`
      : 'Photo capture';

  return (
    <div className="mt-8 space-y-6">
      <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-[#1F2A44] to-[#0A1428] p-6 text-center">
        <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-1">
          Freedom Paws ID — vision capture
        </p>
        <h3 className="text-xl font-bold text-white">Identity region analysis</h3>
        <p className="text-xs text-white/45 mt-2">{mediaLabel}</p>
      </div>

      {identity?.enrollReady ? (
        <div className="rounded-2xl border-2 border-green-500/50 bg-green-900/20 p-4 text-center">
          <p className="text-green-400 font-semibold">
            ✓ Quality sufficient for enrollment (beta)
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border-2 border-amber-500/40 bg-amber-900/20 p-4 text-center">
          <p className="text-amber-300 font-semibold text-sm">
            Retake recommended — improve lighting, center the dog, reduce blur
          </p>
        </div>
      )}

      {IDENTITY_REGIONS.map((region) => {
        const r = identity?.regions[region];
        if (!r) return null;
        const pct = Math.round(r.qualityScore * 100);
        return (
          <div
            key={region}
            className="rounded-2xl border border-white/10 bg-[#0A1428]/50 p-5"
          >
            <div className="flex items-center justify-between gap-2 mb-3">
              <p className="text-sm font-bold text-[#F5C242] uppercase tracking-wide">
                {REGION_LABELS[region]}
              </p>
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  pct >= 65
                    ? 'bg-green-500/20 text-green-300'
                    : 'bg-amber-500/20 text-amber-300'
                }`}
              >
                Quality {pct}%
              </span>
            </div>
            {r.descriptors.length > 0 && (
              <ul className="text-sm text-white/85 list-disc pl-5 space-y-1">
                {r.descriptors.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            )}
            {r.qualityIssues.length > 0 && (
              <p className="mt-2 text-xs text-amber-400/80">
                Issues: {r.qualityIssues.join('; ')}
              </p>
            )}
            {r.gaitDescriptor && (
              <p className="mt-2 text-xs text-white/60">Gait: {r.gaitDescriptor}</p>
            )}
            {r.limbSymmetry && (
              <p className="mt-1 text-xs text-white/60">Symmetry: {r.limbSymmetry}</p>
            )}
          </div>
        );
      })}

      {identity?.fusedDescriptorText && (
        <details className="rounded-xl border border-white/10 bg-[#0A1428]/40 p-4 group">
          <summary className="text-xs font-semibold text-white/50 cursor-pointer list-none flex justify-between items-center">
            Fused descriptor summary
            <span className="text-white/30 group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <p className="text-xs text-white/55 mt-3 leading-relaxed">
            {identity.fusedDescriptorText}
          </p>
        </details>
      )}

      {identity?.enrollReady ? (
        <Link
          href="/id/enroll"
          className="block w-full text-center rounded-2xl border-2 border-[#F5C242] bg-[#F5C242]/15 py-4 text-[#F5C242] font-bold hover:bg-[#F5C242]/25 transition"
        >
          Save to ID profile →
        </Link>
      ) : (
        <Link
          href="/id/enroll"
          className="block w-full text-center rounded-2xl border border-white/20 py-4 text-white/70 font-semibold hover:bg-white/5 transition"
        >
          Continue to enrollment wizard →
        </Link>
      )}

      <Link
        href="/id"
        className="block w-full text-center rounded-2xl border-2 border-emerald-500/40 bg-emerald-900/20 py-3 text-sm text-emerald-300 font-semibold hover:bg-emerald-900/30 transition"
      >
        Freedom Paws ID hub
      </Link>

      {result.disclaimer && (
        <p className="text-center text-[10px] text-white/35 leading-relaxed px-2">
          {result.disclaimer}
        </p>
      )}

      <button
        type="button"
        onClick={onTryAnother}
        className="w-full rounded-2xl border-2 border-[#F5C242]/50 py-4 text-[#F5C242] font-bold text-lg hover:bg-[#F5C242]/10 transition"
      >
        Capture another region
      </button>
    </div>
  );
}
