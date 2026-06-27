'use client';

import PwaNavLink from '@/app/components/PwaNavLink';
import ViTWellnessFunnel from '@/app/components/diagnostics/ViTWellnessFunnel';
import { tokenShopHref } from '@/app/lib/routes';
import WellnessPartnerPanel from '@/app/components/wellness/WellnessPartnerPanel';
import { protocols } from '@/app/protocols/protocols';
import { protocolDisplayName } from '@/lib/ai/symptom-lexicon';
import type { AnalyzeApiResponse, ApiProtocolResult } from '@/lib/ai/types';
import { vitResultToWellnessContext } from '@/lib/wellness/partners';

type Props = {
  result: AnalyzeApiResponse;
  feedbackSent: 'helpful' | 'wrong' | null;
  wrongProtocol: string;
  onWrongProtocolChange: (value: string) => void;
  onFeedback: (feedback: 'helpful' | 'wrong') => void;
  onTryAnother: () => void;
};

function ConfidenceBar({
  value,
  tone,
}: {
  value: number;
  tone: 'primary' | 'secondary';
}) {
  const barClass =
    tone === 'primary'
      ? 'bg-gradient-to-r from-green-600 to-emerald-400'
      : 'bg-gradient-to-r from-blue-600 to-cyan-400';
  const labelClass = tone === 'primary' ? 'text-green-400' : 'text-blue-400';

  return (
    <div className="mt-4">
      <div className="flex justify-between items-baseline mb-1.5">
        <span className={`text-xs font-semibold uppercase tracking-wide ${labelClass}`}>
          Match strength
        </span>
        <span className={`text-lg font-bold ${labelClass}`}>{value}%</span>
      </div>
      <div className="h-2.5 rounded-full bg-black/40 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${barClass}`}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
    </div>
  );
}

function ProtocolCard({
  rank,
  rec,
  tone,
}: {
  rank: 1 | 2;
  rec: ApiProtocolResult;
  tone: 'primary' | 'secondary';
}) {
  const border =
    tone === 'primary' ? 'border-green-500/50 bg-green-900/25' : 'border-blue-500/50 bg-blue-900/25';
  const badge =
    tone === 'primary'
      ? 'bg-green-500/20 text-green-300 border-green-500/40'
      : 'bg-blue-500/20 text-blue-300 border-blue-500/40';
  const rankLabel = rank === 1 ? '#1 PRIORITY SUPPLEMENT' : '#2 SUPPORTING SUPPLEMENT';

  return (
    <div className={`rounded-2xl border-2 p-6 ${border}`}>
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${badge}`}>
          {rankLabel}
        </span>
        {rank === 1 && (
          <span className="text-[10px] text-amber-400/90 font-medium">Recommended first</span>
        )}
      </div>
      <p className="text-sm text-amber-300/90 font-semibold leading-snug">{rec.specCategory}</p>
      <p className="text-2xl font-bold mt-2 leading-tight">{rec.brandedTitle}</p>
      <ConfidenceBar value={rec.confidenceValue} tone={tone} />
      <div className="mt-5 flex flex-col sm:flex-row gap-3">
        {rec.slug && (
          <PwaNavLink
            href={`/protocols/${rec.slug}`}
            className="flex-1 text-center rounded-xl border border-[#F5C242]/40 bg-[#F5C242]/10 px-4 py-3 text-sm font-semibold text-[#F5C242] hover:bg-[#F5C242]/20 transition touch-manipulation min-h-[48px] flex items-center justify-center"
          >
            Protocol details →
          </PwaNavLink>
        )}
        {rec.slug && (
          <PwaNavLink
            href={tokenShopHref(rec.slug)}
            className="flex-1 text-center rounded-xl bg-[#F5C242] px-4 py-3 text-sm font-bold text-black hover:bg-[#F5C242]/90 active:bg-amber-300 transition touch-manipulation min-h-[48px] flex items-center justify-center"
          >
            View in Token Shop
          </PwaNavLink>
        )}
      </div>
    </div>
  );
}

export default function ViTResultsPanel({
  result,
  feedbackSent,
  wrongProtocol,
  onWrongProtocolChange,
  onFeedback,
  onTryAnother,
}: Props) {
  const wellnessContext = vitResultToWellnessContext({
    vetUrgent: result.vetUrgent,
    primaryConfidence: result.primary?.confidenceValue,
  });
  const showIdEnroll =
    wellnessContext === 'vit_urgent' || wellnessContext === 'vit_concern';

  const mediaLabel =
    result.mediaType === 'video' && (result.frameCount ?? 0) > 1
      ? `Video analysis · ${result.frameCount} frames`
      : result.usedVision
        ? 'Photo + AI vision'
        : 'Symptom matching';

  return (
    <div className="mt-8 space-y-6">
      <div className="rounded-2xl border border-[#F5C242]/30 bg-gradient-to-br from-[#1F2A44] to-[#0A1428] p-6 text-center">
        <p className="text-[#F5C242] text-xs font-bold uppercase tracking-widest mb-1">
          Your wellness analysis
        </p>
        <h3 className="text-xl font-bold text-white">Personalised protocol recommendations</h3>
        <p className="text-xs text-white/45 mt-2">{mediaLabel}</p>
        {result.usedVision && (
          <p className="text-sm text-amber-200/90 mt-3 leading-relaxed">
            We combined your described symptoms with AI photo analysis below.
          </p>
        )}
      </div>

      {result.visualFindings && result.visualFindings.length > 0 && (
        <div className="rounded-2xl border-2 border-amber-400/50 bg-amber-950/25 p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg" aria-hidden>
              👁️
            </span>
            <p className="text-sm font-bold text-amber-300 uppercase tracking-wide">
              What AI saw from your {result.mediaType === 'video' ? 'video' : 'photo'}
            </p>
          </div>
          <p className="text-[11px] text-white/45 mb-2 leading-relaxed">
            Visible cues from this {result.mediaType === 'video' ? 'clip' : 'still image'} only — movement
            symptoms come from what you typed or from video.
          </p>
          <ul className="text-sm text-white/90 list-disc pl-5 space-y-1.5">
            {result.visualFindings.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>
      )}

      {result.vetUrgent && (
        <div className="rounded-2xl border-2 border-red-500 bg-red-950/50 p-5">
          <p className="text-red-300 font-bold text-sm">⚠️ Veterinary attention recommended</p>
          <p className="text-red-200/90 text-sm mt-2 leading-relaxed">
            {result.vetUrgentReason ||
              'Visible or reported signs may need prompt professional evaluation.'}
          </p>
          {(result.urgentCongruency ?? 0) > 0 && (
            <p className="text-red-200/70 text-xs mt-2">
              Severe indicator congruency: {result.urgentCongruency}%
              {result.matchedSevereCondition ? ` — ${result.matchedSevereCondition}` : ''}
            </p>
          )}
        </div>
      )}

      {!result.vetUrgent && result.mildModerateOnly && (
        <div className="rounded-2xl border border-emerald-500/40 bg-emerald-950/25 p-5">
          <p className="text-emerald-300 font-bold text-sm">🌿 Wellness-first routing</p>
          <p className="text-emerald-200/85 text-sm mt-2 leading-relaxed">
            Signs appear mild-to-moderate. Focus on natural nutrition, detox support, lifestyle
            shifts, and our protocol recommendations. Seek veterinary triage if symptoms worsen.
          </p>
        </div>
      )}

      {result.primary && <ProtocolCard rank={1} rec={result.primary} tone="primary" />}
      {result.secondary && <ProtocolCard rank={2} rec={result.secondary} tone="secondary" />}

      <ViTWellnessFunnel
        primarySlug={result.primary?.slug}
        secondarySlug={result.secondary?.slug}
      />

      {result.matchedTerms && result.matchedTerms.length > 0 && (
        <div className="rounded-xl border border-green-500/30 bg-green-950/20 p-4">
          <p className="text-xs font-semibold text-green-400 mb-3 uppercase tracking-wide">
            Symptoms recognised
          </p>
          <div className="flex flex-wrap gap-2">
            {result.matchedTerms.map((t) => (
              <span
                key={t}
                className="text-xs px-3 py-1.5 rounded-full bg-green-900/40 border border-green-500/30 text-white/85"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      )}

      {(result.unknownPhrases?.length ?? 0) > 0 && (
        <p className="text-center text-xs text-amber-400/80">
          New phrases queued for lexicon review: {result.unknownPhrases!.join(', ')}
        </p>
      )}

      {result.reasoning && (
        <details className="rounded-xl border border-white/10 bg-[#0A1428]/40 p-4 group">
          <summary className="text-xs font-semibold text-white/50 cursor-pointer list-none flex justify-between items-center">
            How we matched your symptoms
            <span className="text-white/30 group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <p className="text-xs text-white/55 mt-3 leading-relaxed">{result.reasoning}</p>
        </details>
      )}

      {result.disclaimer && (
        <p className="text-center text-[10px] text-white/35 leading-relaxed px-2">
          {result.disclaimer}
        </p>
      )}

      <WellnessPartnerPanel
        context={wellnessContext}
        showIdEnroll={showIdEnroll}
      />

      {result.analysisId && !feedbackSent && (
        <div className="rounded-2xl border border-white/10 bg-[#0A1428]/60 p-4 space-y-3">
          <p className="text-sm text-center text-white/70">Was this recommendation helpful?</p>
          <div className="flex gap-3 justify-center">
            <button
              type="button"
              onClick={() => onFeedback('helpful')}
              className="rounded-xl bg-green-700/80 px-5 py-2.5 text-sm font-semibold"
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => onFeedback('wrong')}
              className="rounded-xl border border-red-500/50 px-5 py-2.5 text-sm text-red-300"
            >
              No — suggest fix
            </button>
          </div>
          <select
            value={wrongProtocol}
            onChange={(e) => onWrongProtocolChange(e.target.value)}
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
          Thanks — your feedback helps improve ViT Diagnostics.
        </p>
      )}

      <button
        type="button"
        onClick={onTryAnother}
        className="w-full rounded-2xl border-2 border-[#F5C242]/50 py-4 text-[#F5C242] font-bold text-lg hover:bg-[#F5C242]/10 transition"
      >
        Try another analysis
      </button>
    </div>
  );
}
