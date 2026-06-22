import Link from 'next/link';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import {
  VitProBadge,
  VitProCard,
  VitProPageShell,
  VitProSection,
} from '../../components/VitProUi';

type BenchmarkCase = {
  id: string;
  region: string;
  imagePath?: string;
  symptoms: string;
  status?: 'ready' | 'pending';
  advisorReview?: { notes?: string };
};

function loadBenchmarkCases(): BenchmarkCase[] {
  const path = join(process.cwd(), 'data/vit-pro/benchmark/cases.json');
  if (!existsSync(path)) return [];
  try {
    const data = JSON.parse(readFileSync(path, 'utf8')) as { cases?: BenchmarkCase[] };
    return data.cases ?? [];
  } catch {
    return [];
  }
}

export default function VitProBenchmarkPage() {
  const cases = loadBenchmarkCases();
  const withImages = cases.filter(
    (c) => c.imagePath && existsSync(join(process.cwd(), c.imagePath))
  );
  const pending = cases.filter((c) => c.status === 'pending' || !c.imagePath);

  return (
    <VitProPageShell
      title="50-photo benchmark"
      subtitle="Internal validation with one veterinary advisor before production launch. Add photos over time — target 50 cases."
      badge={<VitProBadge status="validation" />}
    >
      <div className="grid grid-cols-3 gap-3 mb-8">
        <VitProCard className="text-center">
          <p className="text-2xl font-bold">{cases.length}</p>
          <p className="text-xs text-white/50 mt-1">Cases defined</p>
        </VitProCard>
        <VitProCard className="text-center">
          <p className="text-2xl font-bold text-sky-300">{withImages.length}</p>
          <p className="text-xs text-white/50 mt-1">With images</p>
        </VitProCard>
        <VitProCard className="text-center">
          <p className="text-2xl font-bold text-amber-300">{pending.length}</p>
          <p className="text-xs text-white/50 mt-1">Pending photos</p>
        </VitProCard>
      </div>

      <VitProSection title="Pass criteria (advisor sign-off)">
        <VitProCard>
          <ul className="text-sm text-white/75 space-y-2">
            <li>· Zero missed <strong className="text-white">critical</strong> urgent flags</li>
            <li>· ≥70% agreement on differential considerations</li>
            <li>· 100% citation presence on vet reports</li>
          </ul>
        </VitProCard>
      </VitProSection>

      <VitProSection title="Run batch analysis">
        <VitProCard>
          <p className="text-sm text-white/65 mb-4">
            From project root (requires <code className="text-xs">OPENAI_API_KEY</code>):
          </p>
          <pre className="rounded-xl bg-black/40 p-4 text-xs text-emerald-200/90 overflow-x-auto">
            npm run vit-pro:benchmark
          </pre>
          <p className="mt-3 text-xs text-white/45">
            Outputs CSV + JSON in <code>data/vit-pro/benchmark/results/</code> — share JSON with advisor.
          </p>
        </VitProCard>
      </VitProSection>

      <VitProSection title="Case list">
        <div className="rounded-2xl border border-white/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-left text-xs uppercase tracking-wide text-white/45">
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Region</th>
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3">Symptoms (excerpt)</th>
              </tr>
            </thead>
            <tbody>
              {cases.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-white/45">
                    No cases.json yet — copy from{' '}
                    <code className="text-xs">data/vit-pro/benchmark/cases.template.json</code>
                  </td>
                </tr>
              ) : (
                cases.slice(0, 50).map((c) => {
                  const hasImg =
                    c.imagePath && existsSync(join(process.cwd(), c.imagePath));
                  return (
                    <tr key={c.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                      <td className="px-4 py-2 font-mono text-xs">{c.id}</td>
                      <td className="px-4 py-2 capitalize">{c.region}</td>
                      <td className="px-4 py-2">
                        {hasImg ? (
                          <span className="text-emerald-400 text-xs">Ready</span>
                        ) : (
                          <span className="text-amber-400/80 text-xs">Pending</span>
                        )}
                      </td>
                      <td className="px-4 py-2 text-white/60 truncate max-w-[200px]">{c.symptoms}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </VitProSection>

      <VitProSection title="Add cases">
        <VitProCard>
          <ol className="text-sm text-white/70 space-y-2 list-decimal list-inside">
            <li>Edit <code className="text-xs">data/vit-pro/benchmark/cases.json</code></li>
            <li>Save photos to <code className="text-xs">data/vit-pro/benchmark/images/</code></li>
            <li>Set <code className="text-xs">imagePath</code> and fill <code className="text-xs">advisorReview</code> after advisor call</li>
          </ol>
          <Link href="/vit-pro/analyze" className="inline-block mt-4 text-sm text-sky-400 hover:underline">
            Or test single cases in CDS Analyze →
          </Link>
        </VitProCard>
      </VitProSection>
    </VitProPageShell>
  );
}
