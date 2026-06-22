import Link from 'next/link';
import { getVitProModuleStatus } from '@/lib/vit-pro/status-server';
import { VIT_PRO_PHASE_LABEL } from '@/lib/vit-pro/nav';
import { getServerUser } from '@/lib/supabase/server';
import { isVitProEnabled } from '@/lib/vit-pro/access';
import {
  VitProBadge,
  VitProCard,
  VitProKpi,
  VitProPageShell,
  VitProSection,
} from '../components/VitProUi';

export default async function VitProHomePage() {
  const user = await getServerUser();
  const status = getVitProModuleStatus();
  const enabled = isVitProEnabled();

  return (
    <VitProPageShell
      title="ViT Pro Foundation"
      subtitle={`${VIT_PRO_PHASE_LABEL}. Build and validate over the next 3–4 months with your veterinary advisor before production launch alongside Freedom Paws.`}
      badge={
        <VitProBadge status={enabled ? 'foundation' : 'blocked'} />
      }
    >
      {!enabled ? (
        <div className="mb-6 rounded-2xl border border-rose-500/40 bg-rose-950/25 px-4 py-3 text-sm text-rose-100">
          ViT Pro is disabled on this deployment (<code className="text-xs">VIT_PRO_ENABLED=false</code>
          ).
        </div>
      ) : null}

      <p className="mb-6 text-sm text-white/55">
        Signed in as <strong className="text-white/80">{user?.email ?? 'advisor'}</strong>
      </p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <VitProKpi label="RAG corpus chunks" value={status.corpusChunkCount} hint={`v${status.ragCorpusVersion}`} />
        <VitProKpi
          label="Benchmark photos"
          value={`${status.benchmark.casesWithImages}/${status.benchmark.targetCases}`}
          hint="Target 50 for advisor review"
        />
        <VitProKpi label="Pipeline" value={status.pipelineVersion} hint="Phase V0" />
        <VitProKpi label="Rubrics" value={status.rubrics.length} hint="Eye, skin, oral" />
      </div>

      <VitProSection title="Workflow">
        <div className="grid sm:grid-cols-2 gap-4">
          <Link
            href="/vit-pro/analyze"
            className="rounded-2xl border border-sky-500/30 bg-sky-950/20 p-5 hover:border-sky-400/50 transition-colors"
          >
            <h3 className="font-bold text-sky-200">CDS Analyze</h3>
            <p className="mt-2 text-sm text-white/55">
              Upload photo/video → Tier B vet report with citations + Tier A public preview.
            </p>
            <p className="mt-3 text-xs text-sky-400">Open analyzer →</p>
          </Link>
          <Link
            href="/vit-pro/benchmark"
            className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 hover:border-white/25 transition-colors"
          >
            <h3 className="font-bold">50-photo benchmark</h3>
            <p className="mt-2 text-sm text-white/55">
              Set up cases with your advisor; validate before LLC launch.
            </p>
            <p className="mt-3 text-xs text-sky-400">Benchmark setup →</p>
          </Link>
          <Link
            href="/vit-pro/corpus"
            className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 hover:border-white/25 transition-colors"
          >
            <h3 className="font-bold">Scientific corpus</h3>
            <p className="mt-2 text-sm text-white/55">
              Open-source RAG references (Merck links, AAHA concepts, internal CDS policy).
            </p>
            <p className="mt-3 text-xs text-sky-400">View corpus →</p>
          </Link>
          <Link
            href="/diagnostics"
            className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 hover:border-white/25 transition-colors"
          >
            <h3 className="font-bold">Public Tier A (live)</h3>
            <p className="mt-2 text-sm text-white/55">
              Member-facing ViT wellness — separate from vet CDS until you wire shared engine.
            </p>
            <p className="mt-3 text-xs text-sky-400">Member diagnostics →</p>
          </Link>
        </div>
      </VitProSection>

      <VitProSection title="Dual-output architecture">
        <VitProCard>
          <pre className="text-xs text-white/60 overflow-x-auto leading-relaxed">{`Photo/video + history
    → Region rubrics (eye | skin | oral)
    → RAG literature retrieval
    → VitProFullReport (internal)
    → Tier B: vet JSON + citations + EMR text
    → Tier A: simplified public JSON (no citations)`}</pre>
        </VitProCard>
      </VitProSection>

      <VitProSection title="Timeline (founder plan)">
        <VitProCard>
          <ul className="text-sm text-white/70 space-y-2">
            <li>
              <strong className="text-white/90">Now — Phase V0:</strong> Portal, RAG, rubrics, advisor
              benchmark (parallel with shelter pilots & affiliates).
            </li>
            <li>
              <strong className="text-white/90">Months 2–3:</strong> Advisor validation on 50 cases; rubric
              refinements.
            </li>
            <li>
              <strong className="text-white/90">Post LLC/legal:</strong> Production launch with pilot clinics;
              Phase V1 billing & PDF export.
            </li>
          </ul>
        </VitProCard>
      </VitProSection>
    </VitProPageShell>
  );
}
