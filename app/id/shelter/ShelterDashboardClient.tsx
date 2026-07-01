'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import BackLink from '@/app/components/BackLink';
import PageShell from '@/app/components/ui/PageShell';
import PageHeader from '@/app/components/ui/PageHeader';
import SectionCard from '@/app/components/ui/SectionCard';

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
    <PageShell maxWidth="lg">
      <BackLink href="/id" label="Back to ID hub" />

      <PageHeader
        eyebrow="Shelter portal"
        eyebrowVariant="emerald"
        title="Tennessee pilot dashboard"
        subtitle={
          <>
            Role: <span className="text-emerald-300">{role}</span>
          </>
        }
        className="mt-4 mb-6"
      />

      {isReviewer && stats && (
        <div className="grid grid-cols-2 gap-3 mb-6">
          {[
            { label: 'Found reports', value: stats.totalReports },
            { label: 'Pending reviews', value: stats.pendingReviews },
            { label: 'Matched', value: stats.matchedReports },
            { label: 'Enrollments', value: stats.totalEnrollments },
          ].map((s) => (
            <SectionCard key={s.label} className="text-center !p-4">
              <p className="text-2xl font-bold text-amber-300">{s.value}</p>
              <p className="text-[10px] uppercase tracking-wide text-white/45">{s.label}</p>
            </SectionCard>
          ))}
        </div>
      )}

      <ul className="space-y-4">
        <li>
          <Link href="/id/found" className="block group">
            <SectionCard className="border-amber-500/40 bg-amber-900/20 transition hover:bg-amber-900/30">
              <p className="font-bold text-amber-300">Found dog intake →</p>
              <p className="mt-1 text-sm text-white/60">
                Upload photo or video — automatic similarity search
              </p>
            </SectionCard>
          </Link>
        </li>

        {isReviewer ? (
          <li>
            <Link href="/id/match" className="block group">
              <SectionCard className="border-emerald-500/40 bg-emerald-900/20 transition hover:bg-emerald-900/30">
                <p className="font-bold text-emerald-300">Match review queue →</p>
                <p className="mt-1 text-sm text-white/60">
                  Approve or reject candidates before owner contact
                </p>
              </SectionCard>
            </Link>
          </li>
        ) : (
          <li>
            <SectionCard variant="glass" className="text-sm text-white/50">
              Match review requires shelter admin or FP ops.
            </SectionCard>
          </li>
        )}

        {isReviewer && (
          <li>
            <SectionCard variant="glass">
              <p className="text-xs font-bold uppercase tracking-wide text-white/45">
                Pilot E2E flow (Oct 2026)
              </p>
              <ol className="mt-3 space-y-2 text-sm text-white/65 list-decimal pl-5">
                <li>Owner enrolls at <Link href="/id/enroll" className="text-amber-400 underline">/id/enroll</Link></li>
                <li>Intake found dog at <Link href="/id/found" className="text-amber-400 underline">/id/found</Link></li>
                <li>Approve match at <Link href="/id/match" className="text-emerald-400 underline">/id/match</Link></li>
                <li>Owner receives email alert (Resend)</li>
              </ol>
            </SectionCard>
          </li>
        )}
      </ul>

      <p className="mt-8 text-center text-[10px] text-white/40 leading-relaxed">
        {stats?.pilotShelters ?? 6} Tennessee pilot partners · expanding after validation
      </p>
    </PageShell>
  );
}
