'use client';

import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import BackLink from '@/app/components/BackLink';
import PageShell from '@/app/components/ui/PageShell';
import PageHeader from '@/app/components/ui/PageHeader';
import SectionCard from '@/app/components/ui/SectionCard';
import PrimaryButton from '@/app/components/ui/PrimaryButton';
import SecondaryButton from '@/app/components/ui/SecondaryButton';
import type { MatchReviewStatus } from '@/lib/id/types';

type Report = {
  id: string;
  shelterName: string;
  state: string;
  status: string;
  notes: string | null;
  candidateCount: number;
  pendingReviews: number;
  createdAt: string;
};

type Candidate = {
  id: string;
  similarityScore: number;
  reviewStatus: MatchReviewStatus;
  freedomPawsId: string;
  petName: string;
  breed: string;
  reviewNotes: string | null;
};

type Props = {
  canDecide: boolean;
};

export default function MatchReviewClient({ canDecide }: Props) {
  const searchParams = useSearchParams();
  const initialReport = searchParams.get('report');

  const [reports, setReports] = useState<Report[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(initialReport);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notes, setNotes] = useState('');
  const [toast, setToast] = useState('');

  const loadReports = useCallback(async () => {
    const res = await fetch('/api/id/match/reports', {
      credentials: 'include',
      signal: AbortSignal.timeout(12_000),
    });
    const data = await res.json();
    if (data.success) setReports(data.reports ?? []);
  }, []);

  const loadCandidates = useCallback(async (reportId: string) => {
    const res = await fetch(
      `/api/id/match/candidates?reportId=${encodeURIComponent(reportId)}`,
      {
        credentials: 'include',
        signal: AbortSignal.timeout(12_000),
      }
    );
    const data = await res.json();
    if (data.success) setCandidates(data.candidates ?? []);
  }, []);

  useEffect(() => {
    void (async () => {
      setLoading(true);
      try {
        await loadReports();
        if (initialReport) {
          setSelectedId(initialReport);
          await loadCandidates(initialReport);
        }
      } catch {
        setError('Could not load match queue.');
      } finally {
        setLoading(false);
      }
    })();
  }, [initialReport, loadReports, loadCandidates]);

  const selectReport = async (id: string) => {
    setSelectedId(id);
    setError('');
    await loadCandidates(id);
  };

  const review = async (candidateId: string, decision: MatchReviewStatus) => {
    if (!canDecide) {
      setError('Only shelter admin or FP ops can approve matches.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/id/match/review', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidateId, decision, notes }),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.error || 'Review failed.');
        return;
      }
      if (decision === 'approved') {
        setToast(
          data.ownerEmailSent
            ? 'Match approved — owner notified by email.'
            : 'Match approved — owner email not sent (check Resend / service role config).'
        );
      } else {
        setToast(`Candidate marked ${decision.replace('_', ' ')}.`);
      }
      if (selectedId) await loadCandidates(selectedId);
      await loadReports();
      setNotes('');
    } catch {
      setError('Connection error.');
    } finally {
      setBusy(false);
    }
  };

  const selected = reports.find((r) => r.id === selectedId);

  return (
    <PageShell maxWidth="2xl">
      <BackLink href="/id/shelter" label="Shelter dashboard" />

      <PageHeader
        eyebrow="Match queue"
        eyebrowVariant="emerald"
        title="Review candidates"
        subtitle="Human review required before owner contact · threshold 0.72"
        className="mt-4 mb-6"
      />

        {error && (
          <p className="mb-4 rounded-xl border border-red-500/40 bg-red-950/30 px-4 py-3 text-sm text-red-300">
            {error}
          </p>
        )}

        {toast && (
          <p className="mb-4 rounded-xl border border-emerald-500/40 bg-emerald-950/30 px-4 py-3 text-sm text-emerald-300">
            {toast}
          </p>
        )}

        {loading ? (
          <p className="text-white/50">Loading…</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h2 className="text-sm font-semibold text-white/70 mb-3">Found reports</h2>
              <ul className="space-y-2 max-h-[28rem] overflow-y-auto">
                {reports.length === 0 ? (
                  <li className="text-sm text-white/45">No reports yet.</li>
                ) : (
                  reports.map((r) => (
                    <li key={r.id}>
                      <button
                        type="button"
                        onClick={() => void selectReport(r.id)}
                        className={`w-full rounded-xl border p-3 text-left text-sm transition ${
                          selectedId === r.id
                            ? 'border-amber-400 bg-amber-500/10'
                            : 'border-white/10 bg-white/5 hover:border-white/25'
                        }`}
                      >
                        <p className="font-semibold">{r.shelterName}</p>
                        <p className="text-xs text-white/50 mt-1">
                          {r.state} · {r.candidateCount} candidates · {r.pendingReviews} pending
                        </p>
                        <p className="text-[10px] text-white/35 mt-1">
                          {new Date(r.createdAt).toLocaleString()}
                        </p>
                      </button>
                    </li>
                  ))
                )}
              </ul>
            </div>

            <div>
              {selected ? (
                <>
                  <h2 className="text-sm font-semibold text-white/70 mb-2">{selected.shelterName}</h2>
                  {selected.notes && (
                    <p className="text-xs text-white/55 mb-4 italic">{selected.notes}</p>
                  )}

                  {candidates.length === 0 ? (
                    <p className="text-sm text-white/45">No candidates for this report.</p>
                  ) : (
                    <ul className="space-y-3">
                      {candidates.map((c) => (
                        <li
                          key={c.id}
                          className="list-none"
                        >
                        <SectionCard>
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-bold">{c.petName}</p>
                              <p className="text-xs text-amber-400/90 font-mono">{c.freedomPawsId}</p>
                              {c.breed && <p className="text-xs text-white/50">{c.breed}</p>}
                            </div>
                            <span
                              className={`text-sm font-bold ${
                                c.similarityScore >= 0.72 ? 'text-green-400' : 'text-amber-400'
                              }`}
                            >
                              {Math.round(c.similarityScore * 100)}%
                            </span>
                          </div>
                          <p className="mt-2 text-[10px] uppercase tracking-wide text-white/40">
                            Status: {c.reviewStatus}
                          </p>

                          {c.reviewStatus === 'pending' && canDecide && (
                            <div className="mt-4 space-y-2">
                              <input
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Review notes (optional)"
                                className="w-full rounded-lg bg-[#0A1428] border border-white/15 px-2 py-1.5 text-xs"
                              />
                              <div className="flex flex-wrap gap-2">
                                <PrimaryButton
                                  type="button"
                                  variant="emerald"
                                  disabled={busy}
                                  onClick={() => void review(c.id, 'approved')}
                                  className="!min-h-[36px] !rounded-lg !px-3 !py-1.5 !text-xs"
                                >
                                  Approve
                                </PrimaryButton>
                                <SecondaryButton
                                  type="button"
                                  variant="neutral"
                                  disabled={busy}
                                  onClick={() => void review(c.id, 'rejected')}
                                  className="!min-h-[36px] !rounded-lg !px-3 !py-1.5 !text-xs !border-red-500/50 !text-red-300"
                                >
                                  Reject
                                </SecondaryButton>
                                <SecondaryButton
                                  type="button"
                                  variant="neutral"
                                  disabled={busy}
                                  onClick={() => void review(c.id, 'insufficient_evidence')}
                                  className="!min-h-[36px] !rounded-lg !px-3 !py-1.5 !text-xs"
                                >
                                  Insufficient
                                </SecondaryButton>
                              </div>
                            </div>
                          )}
                        </SectionCard>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <p className="text-sm text-white/45">Select a report to review candidates.</p>
              )}
            </div>
          </div>
        )}

        {!canDecide && (
          <p className="mt-8 text-center text-xs text-amber-400/80">
            View-only mode — shelter admin or FP ops required to approve matches.
          </p>
        )}
    </PageShell>
  );
}
