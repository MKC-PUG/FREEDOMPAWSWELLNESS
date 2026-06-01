'use client';

import type { VitMediaQuality } from '@/lib/vit/media-quality-gate';
import { qualityStatusLabel } from '@/lib/vit/media-quality-gate';

type Props = {
  quality: VitMediaQuality | null;
  checking?: boolean;
  mediaKind?: 'photo' | 'video' | null;
};

export default function ViTQualityGate({ quality, checking, mediaKind }: Props) {
  if (checking) {
    return (
      <div className="rounded-xl border border-white/15 bg-[#0A1428]/60 px-4 py-3 text-center">
        <p className="text-xs text-white/55">Checking {mediaKind === 'video' ? 'video' : 'photo'} quality…</p>
      </div>
    );
  }

  if (!quality) return null;

  const border =
    quality.status === 'pass'
      ? 'border-green-500/40 bg-green-950/20'
      : quality.status === 'warn'
        ? 'border-amber-500/40 bg-amber-950/20'
        : 'border-red-500/50 bg-red-950/30';

  const scoreColor =
    quality.status === 'pass'
      ? 'text-green-400'
      : quality.status === 'warn'
        ? 'text-amber-400'
        : 'text-red-400';

  return (
    <div className={`rounded-xl border-2 p-4 ${border}`}>
      <div className="flex items-center justify-between gap-2 mb-2">
        <p className={`text-sm font-semibold ${scoreColor}`}>
          {qualityStatusLabel(quality.status)}
        </p>
        <span className={`text-lg font-bold tabular-nums ${scoreColor}`}>{quality.score}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-black/40 overflow-hidden mb-3">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            quality.status === 'pass'
              ? 'bg-green-500'
              : quality.status === 'warn'
                ? 'bg-amber-500'
                : 'bg-red-500'
          }`}
          style={{ width: `${quality.score}%` }}
        />
      </div>
      {quality.issues.length > 0 && (
        <ul className="text-xs text-white/70 list-disc pl-4 space-y-1 mb-2">
          {quality.issues.map((issue) => (
            <li key={issue}>{issue}</li>
          ))}
        </ul>
      )}
      {quality.suggestions.length > 0 && (
        <p className="text-xs text-white/50 leading-relaxed">
          <span className="text-[#F5C242] font-medium">Tip: </span>
          {quality.suggestions[0]}
        </p>
      )}
      {!quality.canAnalyze && (
        <p className="text-xs text-red-300/90 mt-2 font-medium">
          Please upload a clearer {mediaKind === 'video' ? 'video' : 'photo'} before analyzing.
        </p>
      )}
    </div>
  );
}
