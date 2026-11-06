'use client';

import ViTWellnessFunnel from '@/app/components/diagnostics/ViTWellnessFunnel';
import CareCheckIn from '@/app/components/wellness/CareCheckIn';
import WellnessPartnerPanel from '@/app/components/wellness/WellnessPartnerPanel';
import { protocols } from '@/app/protocols/protocols';
import { protocolDisplayName } from '@/lib/ai/symptom-lexicon';
import type { AnalyzeApiResponse } from '@/lib/ai/types';
import { vitResultToWellnessContext } from '@/lib/wellness/partners';
import {
  DIAGNOSTICS_GREEN_BODY,
  DIAGNOSTICS_GREEN_TITLE,
  DIAGNOSTICS_RED_DEFAULT,
  DIAGNOSTICS_RED_TITLE,
} from '@/lib/legal/diagnostics-disclaimer';
import { careForSpec, visibleFindings } from '@/lib/wellness/care-format';

type Props = {
  result: AnalyzeApiResponse;
  feedbackSent: 'helpful' | 'wrong' | null;
  wrongProtocol: string;
  onWrongProtocolChange: (value: string) => void;
  onFeedback: (feedback: 'helpful' | 'wrong') => void;
  onTryAnother: () => void;
  petId?: string | null;
  petName?: string | null;
  gaitFile?: File | null;
};

export default function ViTResultsPanel({
  result,
  feedbackSent,
  wrongProtocol,
  onWrongProtocolChange,
  onFeedback,
  onTryAnother,
  petId = null,
  petName = null,
  gaitFile = null,
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

  const care = careForSpec(result.primary?.specShort) ?? careForSpec('Wellness Baseline');
  const photoNotes = visibleFindings(result.visualFindings);
  const seen = care
    ? [care.seen, ...photoNotes.filter((line) => line !== care.seen)].join('. ')
    : photoNotes.join('. ');
  const also =
    result.secondary?.slug && result.secondary.slug !== result.primary?.slug
      ? result.secondary
      : null;

  return (
    <div className="mt-8 space-y-6">
      <div className="rounded-2xl border border-[#F5C242]/30 bg-gradient-to-br from-[#1F2A44] to-[#0A1428] p-6 text-center">
        <p className="text-[#F5C242] text-xs font-bold uppercase tracking-widest mb-1">
          Your wellness analysis
        </p>
        <h3 className="text-xl font-bold text-white">A plan for this dog</h3>
        <p className="text-xs text-white/45 mt-2">{mediaLabel}</p>
        {result.usedVision && (
          <p className="text-sm text-amber-200/90 mt-3 leading-relaxed">
            We combined your described symptoms with AI photo analysis below.
          </p>
        )}
      </div>

      {photoNotes.length > 0 && (
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
            {photoNotes.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="rounded-2xl border-2 border-green-500/60 bg-green-950/45 p-5">
        <p className="text-green-300 font-bold text-sm">{DIAGNOSTICS_GREEN_TITLE}</p>
        <p className="text-green-100/90 text-sm mt-2 leading-relaxed">{DIAGNOSTICS_GREEN_BODY}</p>
      </div>

      {result.vetUrgent && (
        <div className="rounded-2xl border-2 border-red-500 bg-red-950/50 p-5">
          <p className="text-red-300 font-bold text-sm">{DIAGNOSTICS_RED_TITLE}</p>
          <p className="text-red-200/90 text-sm mt-2 leading-relaxed">
          {DIAGNOSTICS_RED_DEFAULT}
          </p>
        </div>
      )}

      {!result.vetUrgent && result.mildModerateOnly && (
        <div className="rounded-2xl border border-emerald-500/40 bg-emerald-950/25 p-5">
          <p className="text-emerald-300 font-bold text-sm">🌿 Wellness-first routing</p>
          <p className="text-emerald-200/85 text-sm mt-2 leading-relaxed">
            Signs look like a day you can work with at home. Use the food, movement, and training
            steps below. Call your own veterinarian if they worsen.
          </p>
        </div>
      )}

      {care ? (
        <CareCheckIn
          care={care}
          seen={seen}
          urgent={Boolean(result.vetUrgent)}
          alsoSeenHref={also?.slug ? `/protocols/${also.slug}/pamphlet` : null}
          alsoSeenLabel={also?.brandedTitle ?? null}
          petId={petId}
          petName={petName}
          gaitFile={gaitFile}
        />
      ) : null}

      <ViTWellnessFunnel
        primarySlug={result.primary?.slug}
        secondarySlug={result.secondary?.slug}
      />

      {visibleFindings(result.matchedTerms).length > 0 && (
        <div className="rounded-xl border border-green-500/30 bg-green-950/20 p-4">
          <p className="text-xs font-semibold text-green-400 mb-3 uppercase tracking-wide">
            Symptoms recognised
          </p>
          <div className="flex flex-wrap gap-2">
            {visibleFindings(result.matchedTerms).map((t) => (
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
