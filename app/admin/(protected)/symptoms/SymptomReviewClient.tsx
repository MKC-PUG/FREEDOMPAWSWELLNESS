'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { protocols } from '@/app/protocols/protocols';
import { protocolDisplayName } from '@/lib/ai/symptom-lexicon';

type PendingPhrase = {
  id: string;
  phrase: string;
  status: string;
  protocol: string | null;
  rawSymptoms: string;
  matchedProtocols: string[];
  occurrenceCount: number;
  createdAt: string;
};

type ApprovedAlias = {
  id: string;
  alias: string;
  protocol: string;
  canonical: string;
  approvedAt: string;
  exportedToLexicon?: boolean;
};

export default function SymptomReviewClient() {
  const router = useRouter();
  const [pending, setPending] = useState<PendingPhrase[]>([]);
  const [approved, setApproved] = useState<ApprovedAlias[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProtocol, setSelectedProtocol] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/symptom-review', {
        signal: AbortSignal.timeout(12_000),
      });
      if (res.status === 401) {
        router.push('/admin/login');
        return;
      }
      const data = await res.json();
      setPending(data.pending ?? []);
      setApproved(data.approved ?? []);
    } catch {
      setPending([]);
      setApproved([]);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    void load();
  }, [load]);

  const review = async (phraseId: string, action: 'approve' | 'reject') => {
    const protocol = selectedProtocol[phraseId] ?? protocols[0]?.title ?? '';
    const res = await fetch('/api/symptom-review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(
        action === 'approve'
          ? { action, phraseId, protocol }
          : { action, phraseId }
      ),
    });
    if (res.status === 401) {
      router.push('/admin/login');
      return;
    }
    if (res.ok) void load();
  };

  const logout = async () => {
    await fetch('/api/admin/login', { method: 'DELETE' });
    router.push('/admin/login');
    router.refresh();
  };

  const pendingExport = approved.filter((a) => !a.exportedToLexicon);

  return (
    <div className="min-h-screen bg-[#0A1428] text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Symptom Lexicon Review</h1>
            <p className="text-[#F5C242] text-sm">
              Approve phrases for live use, then run{' '}
              <code className="text-white/80">npm run symptom:merge</code> to commit them to git.
            </p>
          </div>
          <button
            type="button"
            onClick={() => void logout()}
            className="rounded-xl border border-white/20 px-4 py-2 text-sm text-white/70"
          >
            Sign out
          </button>
        </div>

        {pendingExport.length > 0 && (
          <div className="mb-8 rounded-2xl border border-amber-500/40 bg-amber-950/30 p-4 text-sm text-amber-200">
            {pendingExport.length} approved alias(es) ready to export — run{' '}
            <code className="text-white">npm run symptom:merge</code> on your Mac, then git commit{' '}
            <code className="text-white">lib/ai/symptom-lexicon.ts</code>.
          </div>
        )}

        {loading ? (
          <p className="text-white/60">Loading queue…</p>
        ) : pending.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-[#1F2A44] p-8 text-center text-white/60">
            No pending phrases — all caught up.
          </div>
        ) : (
          <div className="space-y-4 mb-12">
            {pending.map((item) => (
              <div key={item.id} className="rounded-2xl border border-[#F5C242]/30 bg-[#1F2A44] p-5">
                <p className="text-xl font-semibold text-[#F5C242]">&ldquo;{item.phrase}&rdquo;</p>
                <p className="mt-2 text-sm text-white/60">Full input: {item.rawSymptoms}</p>
                <p className="mt-1 text-sm text-white/60">
                  AI matched: {item.matchedProtocols.join(', ') || 'none'} · seen {item.occurrenceCount}×
                </p>
                <div className="mt-4 flex flex-wrap gap-3 items-center">
                  <select
                    value={selectedProtocol[item.id] ?? protocols[0]?.title ?? ''}
                    onChange={(e) =>
                      setSelectedProtocol((prev) => ({ ...prev, [item.id]: e.target.value }))
                    }
                    className="rounded-xl bg-[#0A1428] border border-white/20 px-3 py-2 text-sm"
                  >
                    {protocols.map((p) => (
                      <option key={p.slug} value={p.title}>
                        {protocolDisplayName(p.title)}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => void review(item.id, 'approve')}
                    className="rounded-xl bg-green-600 px-4 py-2 text-sm font-bold"
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    onClick={() => void review(item.id, 'reject')}
                    className="rounded-xl border border-red-500/50 px-4 py-2 text-sm text-red-300"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <h2 className="text-2xl font-bold mb-4">Approved aliases ({approved.length})</h2>
        {approved.length === 0 ? (
          <p className="text-white/50 text-sm">None yet — approve phrases above to grow the lexicon.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {approved.slice(0, 30).map((a) => (
              <li key={a.id} className="rounded-xl bg-[#1F2A44] px-4 py-3 flex justify-between gap-4">
                <span>&ldquo;{a.alias}&rdquo;</span>
                <span className="text-right">
                  <span className="text-[#F5C242] block">{protocolDisplayName(a.protocol)}</span>
                  <span className="text-white/40 text-xs">
                    {a.exportedToLexicon ? 'in git lexicon' : 'live only — merge pending'}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
