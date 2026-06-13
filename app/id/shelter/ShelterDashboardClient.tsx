'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import BackLink from '@/app/components/BackLink';

type Stats = {
  totalReports: number;
  pendingReviews: number;
  matchedReports: number;
  totalEnrollments: number;
  pilotShelters: number;
};

type Props = {
  role: string;
  isReviewer: boolean;
};

export default function ShelterDashboardClient({ role, isReviewer }: Props) {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    if (!isReviewer) return;
    void fetch('/api/id/shelter/stats', { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setStats(d.stats);
      })
      .catch(() => {});
  }, [isReviewer]);

  return (
    <div className="min-h-screen bg-[#0A1625] text-white font-sans">
      <div className="mx-auto max-w-lg px-6 py-10">
        <BackLink href="/id" label="Back to ID hub" />

        <header className="mt-4 mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">
            Shelter portal
          </p>
          <h1 className="mt-2 text-2xl font-bold">CA / TN pilot dashboard</h1>
          <p className="mt-2 text-sm text-white/60">
            Role: <span className="text-amber-300">{role}</span>
          </p>
        </header>

        {isReviewer && stats && (
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { label: 'Found reports', value: stats.totalReports },
              { label: 'Pending reviews', value: stats.pendingReviews },
              { label: 'Matched', value: stats.matchedReports },
              { label: 'Enrollments', value: stats.totalEnrollments },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center"
              >
                <p className="text-2xl font-bold text-amber-300">{s.value}</p>
                <p className="text-[10px] uppercase tracking-wide text-white/45">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        <ul className="space-y-4">
          <li>
            <Link
              href="/id/found"
              className="block rounded-2xl border border-amber-500/40 bg-amber-900/20 p-5 hover:bg-amber-900/30 transition"
            >
              <p className="font-bold text-amber-300">Found dog intake →</p>
              <p className="mt-1 text-sm text-white/60">
                Upload photo or video — automatic similarity search
              </p>
            </Link>
          </li>

          {isReviewer ? (
            <li>
              <Link
                href="/id/match"
                className="block rounded-2xl border border-emerald-500/40 bg-emerald-900/20 p-5 hover:bg-emerald-900/30 transition"
              >
                <p className="font-bold text-emerald-300">Match review queue →</p>
                <p className="mt-1 text-sm text-white/60">
                  Approve or reject candidates before owner contact
                </p>
              </Link>
            </li>
          ) : (
            <li className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-white/50">
              Match review requires shelter admin or FP ops.
            </li>
          )}

          {isReviewer && (
            <li className="rounded-2xl border border-white/10 bg-[#0F1E38]/80 p-5">
              <p className="text-xs font-bold uppercase tracking-wide text-white/45">
                Pilot E2E flow (Oct 2026)
              </p>
              <ol className="mt-3 space-y-2 text-sm text-white/65 list-decimal pl-5">
                <li>Owner enrolls at <Link href="/id/enroll" className="text-amber-400 underline">/id/enroll</Link></li>
                <li>Intake found dog at <Link href="/id/found" className="text-amber-400 underline">/id/found</Link></li>
                <li>Approve match at <Link href="/id/match" className="text-emerald-400 underline">/id/match</Link></li>
                <li>Owner receives email alert (Resend)</li>
              </ol>
            </li>
          )}
        </ul>

        <p className="mt-8 text-center text-[10px] text-white/40 leading-relaxed">
          {stats?.pilotShelters ?? 3} pilot shelters · California &amp; Tennessee
        </p>
      </div>
    </div>
  );
}
