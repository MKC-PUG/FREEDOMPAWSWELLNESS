import Link from 'next/link';
import { getOpsOverview } from '@/lib/ops/stats-server';
import { getServerUser } from '@/lib/supabase/server';
import { OpsPartnerApprovalToggle } from '../../components/OpsMarketingControls';
import {
  OpsCard,
  OpsKpiCard,
  OpsPageShell,
  OpsSection,
  OpsStatusBadge,
} from '../../components/OpsUi';

export default async function OpsAdoptionPage() {
  const user = await getServerUser();
  const { adoption, marketing } = await getOpsOverview(user?.email);

  return (
    <OpsPageShell
      title="Adoption Network"
      subtitle="Tennessee pilot partners, listing health, and outreach approval gates."
    >
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <OpsKpiCard label="Pilot partners" value={adoption.tnPilotPartners} />
        <OpsKpiCard label="Available" value={adoption.listingCounts.available} accent="emerald" />
        <OpsKpiCard label="Pending adoption" value={adoption.listingCounts.pending} accent="amber" />
        <OpsKpiCard label="Adopted" value={adoption.listingCounts.adopted} />
      </div>

      <OpsSection
        title="TN pilot partners"
        action={
          <Link href="/adopt/tn" className="text-sm text-[#F5C242] hover:underline">
            Public directory →
          </Link>
        }
      >
        <div className="space-y-3">
          {adoption.partners.map((p) => (
            <OpsCard key={p.id}>
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold">{p.name}</h3>
                    <span className="text-[10px] uppercase tracking-wide text-white/40 border border-white/15 rounded px-1.5 py-0.5">
                      {p.orgType}
                    </span>
                    {p.listingCount === 0 ? (
                      <OpsStatusBadge status="warning" />
                    ) : (
                      <OpsStatusBadge status="ready" />
                    )}
                  </div>
                  <p className="mt-1 text-sm text-white/55">
                    {p.city ?? 'TN'} · {p.availableCount} available / {p.listingCount} listings
                  </p>
                  <div className="mt-3 flex flex-wrap gap-3 text-xs">
                    <Link href={`/adopt/tn/${p.slug}`} className="text-emerald-400 hover:underline">
                      Public page
                    </Link>
                    <Link href="/partner/listings" className="text-[#F5C242] hover:underline">
                      Partner listings
                    </Link>
                    {p.draftEmailPath ? (
                      <span className="text-white/40">Draft: {p.draftEmailPath}</span>
                    ) : null}
                  </div>
                </div>
                <OpsPartnerApprovalToggle
                  slug={p.slug}
                  name={p.name}
                  approved={p.approvedForOutreach}
                />
              </div>
            </OpsCard>
          ))}
        </div>
      </OpsSection>

      <OpsSection title="Listing pipeline">
        <OpsCard>
          <dl className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-center">
            {(
              [
                ['draft', adoption.listingCounts.draft],
                ['available', adoption.listingCounts.available],
                ['pending', adoption.listingCounts.pending],
                ['adopted', adoption.listingCounts.adopted],
                ['archived', adoption.listingCounts.archived],
              ] as const
            ).map(([status, count]) => (
              <div key={status}>
                <dt className="text-xs uppercase text-white/45">{status}</dt>
                <dd className="text-xl font-bold mt-1">{count}</dd>
              </div>
            ))}
          </dl>
        </OpsCard>
      </OpsSection>

      <p className="text-xs text-white/40">
        Partner approvals sync to marketing gates. Outreach sends only when emergency stop is off,
        master enabled, Workflow D on, and n8n active — current approved count:{' '}
        {Object.values(marketing.partnerApprovals).filter(Boolean).length}.
      </p>
    </OpsPageShell>
  );
}
