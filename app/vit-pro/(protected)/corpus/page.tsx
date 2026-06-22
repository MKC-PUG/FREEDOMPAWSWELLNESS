import { listCorpusSources } from '@/lib/vit-pro/rag/retrieve';
import { getAllRubrics } from '@/lib/vit-pro/rubrics';
import {
  VitProBadge,
  VitProCard,
  VitProPageShell,
  VitProSection,
} from '../../components/VitProUi';

export default function VitProCorpusPage() {
  const chunks = listCorpusSources();
  const rubrics = getAllRubrics();

  return (
    <VitProPageShell
      title="Scientific corpus & rubrics"
      subtitle="Phase V0 RAG sources (open references + Freedom Paws–authored summaries). Full texts remain at cited URLs."
      badge={<VitProBadge status="foundation" />}
    >
      <VitProSection title="Region rubrics">
        <div className="grid sm:grid-cols-3 gap-4">
          {rubrics.map((r) => (
            <VitProCard key={r.region}>
              <h3 className="font-bold capitalize">{r.region}</h3>
              <p className="text-xs text-white/45 mt-1">v{r.version}</p>
              <p className="text-xs text-white/55 mt-2">
                {r.findingFields.length} fields · {r.differentialConsiderations.length} differentials
              </p>
              <p className="text-xs text-sky-400/80 mt-2">Protocol: {r.protocolSlug}</p>
            </VitProCard>
          ))}
        </div>
      </VitProSection>

      <VitProSection title={`RAG corpus (${chunks.length} chunks)`}>
        <div className="space-y-3">
          {chunks.map((c) => (
            <VitProCard key={c.id}>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <h3 className="font-bold text-sm">{c.title}</h3>
                <span className="text-[10px] uppercase tracking-wide text-white/40">
                  {c.regions.join(', ')}
                </span>
              </div>
              <p className="text-xs text-white/45 mt-1">{c.source}</p>
              <p className="text-sm text-white/70 mt-3 leading-relaxed">{c.chunk}</p>
              {c.url ? (
                <a
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 text-xs text-sky-400 hover:underline"
                >
                  Reference link →
                </a>
              ) : null}
            </VitProCard>
          ))}
        </div>
      </VitProSection>
    </VitProPageShell>
  );
}
