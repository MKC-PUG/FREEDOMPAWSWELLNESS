'use client';

import { useState } from 'react';
import type { VitProPublicOutput, VitProVetOutput } from '@/lib/vit-pro/types';

type Props = {
  vet: VitProVetOutput;
  publicTier?: VitProPublicOutput | null;
};

export default function VitProReportPanel({ vet, publicTier }: Props) {
  const [view, setView] = useState<'vet' | 'public'>('vet');
  const [copied, setCopied] = useState(false);

  const copyEmr = async () => {
    try {
      await navigator.clipboard.writeText(vet.emrPlainText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <div className="inline-flex rounded-xl border border-white/15 overflow-hidden text-xs font-bold">
          <button
            type="button"
            onClick={() => setView('vet')}
            className={`px-4 py-2 touch-manipulation ${view === 'vet' ? 'bg-sky-600 text-white' : 'bg-white/5 text-white/70'}`}
          >
            Tier B — Vet CDS
          </button>
          <button
            type="button"
            onClick={() => setView('public')}
            className={`px-4 py-2 touch-manipulation ${view === 'public' ? 'bg-sky-600 text-white' : 'bg-white/5 text-white/70'}`}
          >
            Tier A — Public preview
          </button>
        </div>
        {view === 'vet' ? (
          <button
            type="button"
            onClick={() => void copyEmr()}
            className="rounded-xl border border-sky-500/40 bg-sky-500/10 px-4 py-2 text-xs font-bold text-sky-200 touch-manipulation"
          >
            {copied ? 'Copied!' : 'Copy EMR text'}
          </button>
        ) : null}
        <span className="text-xs text-white/40">Report {vet.reportId.slice(0, 8)}…</span>
      </div>

      {view === 'public' && publicTier ? (
        <PublicTierPanel output={publicTier} />
      ) : (
        <VetTierPanel vet={vet} />
      )}

      <p className="text-[11px] text-white/40 leading-relaxed">{vet.disclaimer}</p>
    </div>
  );
}

function urgencyLabel(u: VitProVetOutput['urgency']) {
  const map = {
    routine: 'Routine',
    monitor: 'Monitor',
    prompt_vet: 'Prompt evaluation',
    urgent: 'Urgent',
  };
  return map[u];
}

function VetTierPanel({ vet }: { vet: VitProVetOutput }) {
  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
        <p className="text-xs uppercase tracking-wide text-white/45">Urgency</p>
        <p className="mt-1 text-lg font-bold text-white">{urgencyLabel(vet.urgency)}</p>
        {vet.urgencyReason ? <p className="mt-1 text-sm text-amber-200/90">{vet.urgencyReason}</p> : null}
      </div>

      <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
        <p className="text-xs uppercase tracking-wide text-white/45">History</p>
        <p className="mt-2 text-sm text-white/85">{vet.historySummary}</p>
        {vet.signalmentNotes ? (
          <>
            <p className="mt-3 text-xs uppercase tracking-wide text-white/45">Signalment</p>
            <p className="mt-1 text-sm text-white/75">{vet.signalmentNotes}</p>
          </>
        ) : null}
      </div>

      {vet.regions.map((region) => (
        <div key={region.region} className="rounded-2xl border border-sky-500/20 bg-white/[0.03] p-4">
          <h3 className="text-sm font-bold uppercase tracking-wide text-sky-300">{region.region}</h3>
          {region.visualFindings.length ? (
            <p className="mt-2 text-sm text-white/80">
              <span className="text-white/50">Visual: </span>
              {region.visualFindings.join('; ')}
            </p>
          ) : null}
          <ul className="mt-3 grid sm:grid-cols-2 gap-2 text-xs">
            {region.structuredFindings.map((sf) => (
              <li key={sf.key} className="rounded-lg bg-black/25 px-3 py-2">
                <span className="text-white/50">{sf.label}: </span>
                <span className="text-white/90">{String(sf.value)}</span>
              </li>
            ))}
          </ul>
          {region.differentialConsiderations.length ? (
            <div className="mt-4">
              <p className="text-xs font-bold text-white/50 uppercase">Differential considerations</p>
              <ul className="mt-2 space-y-1 text-sm">
                {region.differentialConsiderations.map((d) => (
                  <li key={d.label} className="text-white/80">
                    · {d.label}{' '}
                    <span className="text-[10px] text-white/40">({d.confidenceBand})</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {region.suggestedDiagnostics.length ? (
            <div className="mt-4">
              <p className="text-xs font-bold text-white/50 uppercase">Suggested diagnostics</p>
              <ul className="mt-2 space-y-1 text-sm text-white/75">
                {region.suggestedDiagnostics.map((d) => (
                  <li key={d}>· {d}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ))}

      {vet.citations.length ? (
        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-white/50">References</p>
          <ol className="mt-3 space-y-3 text-sm list-decimal list-inside">
            {vet.citations.map((c) => (
              <li key={c.id} className="text-white/80">
                <span className="font-medium">{c.title}</span>
                <span className="text-white/45"> — {c.source}</span>
                {c.url ? (
                  <>
                    {' '}
                    <a
                      href={c.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sky-400 hover:underline text-xs"
                    >
                      Link
                    </a>
                  </>
                ) : null}
                {c.excerpt ? (
                  <p className="mt-1 ml-5 text-xs text-white/50 leading-relaxed">{c.excerpt}</p>
                ) : null}
              </li>
            ))}
          </ol>
        </div>
      ) : null}

      <details className="rounded-2xl border border-white/10 bg-black/30">
        <summary className="cursor-pointer px-4 py-3 text-xs font-bold uppercase tracking-wide text-white/50">
          EMR plain text
        </summary>
        <pre className="px-4 pb-4 text-xs text-white/70 whitespace-pre-wrap font-mono leading-relaxed overflow-x-auto">
          {vet.emrPlainText}
        </pre>
      </details>
    </div>
  );
}

function PublicTierPanel({ output }: { output: VitProPublicOutput }) {
  return (
    <div className="rounded-2xl border border-emerald-500/25 bg-emerald-950/20 p-4 space-y-3">
      <p className="text-xs uppercase tracking-wide text-emerald-300/80">Owner-facing preview (Tier A)</p>
      <p className="text-lg font-bold">{output.finding}</p>
      <ul className="text-sm text-white/80 space-y-1">
        {output.indications.map((i) => (
          <li key={i}>· {i}</li>
        ))}
      </ul>
      <p className="text-sm text-white/60">{output.reasoning}</p>
      {output.vetUrgent ? (
        <p className="text-sm font-bold text-amber-300">⚠️ {output.vetUrgentReason || 'Veterinary evaluation recommended'}</p>
      ) : null}
      <p className="text-[11px] text-white/40">{output.disclaimer}</p>
    </div>
  );
}
