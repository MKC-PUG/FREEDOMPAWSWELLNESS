import Link from 'next/link';
import { getOpsOverview } from '@/lib/ops/stats-server';
import { getServerUser } from '@/lib/supabase/server';
import {
  OpsCard,
  OpsKpiCard,
  OpsPageShell,
  OpsSection,
  OpsStatusBadge,
} from '../../components/OpsUi';

export default async function OpsShelterIdPage() {
  const user = await getServerUser();
  const { shelterId, system } = await getOpsOverview(user?.email);

  return (
    <OpsPageShell
      title="Shelter & Freedom Paws ID"
      subtitle="Found-dog intake, biometric enrollments, and match review queue."
      badge={
        <OpsStatusBadge
          status={shelterId.pendingReviews > 0 ? 'warning' : 'ready'}
        />
      }
    >
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <OpsKpiCard label="Found reports" value={shelterId.totalReports} />
        <OpsKpiCard
          label="Pending reviews"
          value={shelterId.pendingReviews}
          accent="amber"
        />
        <OpsKpiCard label="Matched" value={shelterId.matchedReports} accent="emerald" />
        <OpsKpiCard label="ID enrollments" value={shelterId.totalEnrollments} />
      </div>

      <OpsSection title="Operations">
        <div className="grid sm:grid-cols-2 gap-4">
          <OpsCard>
            <h3 className="font-bold">Match queue</h3>
            <p className="mt-2 text-sm text-white/60">
              Human approval required before any owner contact. {shelterId.pendingReviews} pending.
            </p>
            <Link
              href="/id/match"
              className="mt-4 inline-flex text-sm font-bold text-[#F5C242] hover:underline"
            >
              Open match queue →
            </Link>
          </OpsCard>
          <OpsCard>
            <h3 className="font-bold">Found intake</h3>
            <p className="mt-2 text-sm text-white/60">
              Shelter staff submit found dogs for biometric matching.
            </p>
            <Link
              href="/id/found"
              className="mt-4 inline-flex text-sm font-bold text-[#F5C242] hover:underline"
            >
              Found intake →
            </Link>
          </OpsCard>
          <OpsCard>
            <h3 className="font-bold">Partner dashboard</h3>
            <p className="mt-2 text-sm text-white/60">
              Cross-shelter view as fp_ops — listings + ID tools.
            </p>
            <Link
              href="/partner"
              className="mt-4 inline-flex text-sm font-bold text-emerald-400 hover:underline"
            >
              Partner portal →
            </Link>
          </OpsCard>
          <OpsCard>
            <h3 className="font-bold">Owner match email</h3>
            <p className="mt-2 text-sm text-white/60">
              Resend alerts after staff approval.
            </p>
            <p className="mt-3 text-xs">
              Status:{' '}
              <span className={system.matchEmailReady ? 'text-emerald-400' : 'text-amber-400'}>
                {system.matchEmailReady ? 'Ready' : 'Missing env vars'}
              </span>
            </p>
          </OpsCard>
        </div>
      </OpsSection>
    </OpsPageShell>
  );
}
