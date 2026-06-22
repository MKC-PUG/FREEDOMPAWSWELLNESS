import Link from 'next/link';
import { getOpsOverview } from '@/lib/ops/stats-server';
import { getServerUser } from '@/lib/supabase/server';
import { OPS_QUICK_LINKS } from '@/lib/ops/nav';
import {
  OpsCard,
  OpsExternalLink,
  OpsKpiCard,
  OpsPageShell,
  OpsSection,
  OpsStatusBadge,
} from '../components/OpsUi';

export default async function OpsHomePage() {
  const user = await getServerUser();
  const overview = await getOpsOverview(user?.email);

  const marketingStatus: 'active' | 'dormant' | 'blocked' = overview.marketing.emergencyStop
    ? 'blocked'
    : overview.marketing.masterEnabled
      ? 'active'
      : 'dormant';

  return (
    <OpsPageShell
      title="Command Center"
      subtitle={`Signed in as ${overview.userEmail ?? 'FP ops'}. One console for adoption, marketing, ID, wellness, product, and infrastructure.`}
      badge={<OpsStatusBadge status={marketingStatus} />}
    >
      {overview.marketing.emergencyStop ? (
        <div className="mb-6 rounded-2xl border border-rose-500/40 bg-rose-950/25 px-4 py-3 text-sm text-rose-100">
          Emergency stop is <strong>ON</strong> — all marketing automation is blocked. This is the
          safe default.
        </div>
      ) : null}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <OpsKpiCard
          label="TN pilot partners"
          value={overview.adoption.tnPilotPartners}
          hint={`${overview.adoption.sheltersWithListings} with listings`}
        />
        <OpsKpiCard
          label="Available dogs"
          value={overview.adoption.listingCounts.available}
          hint={`${overview.adoption.listingCounts.total} total listings`}
          accent="emerald"
        />
        <OpsKpiCard
          label="Match queue"
          value={overview.shelterId.pendingReviews}
          hint="Pending human review"
          accent="amber"
        />
        <OpsKpiCard
          label="Waitlist"
          value={overview.growth.waitlistSignups ?? '—'}
          hint="Requires service role"
        />
      </div>

      <OpsSection title="Departments">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(
            [
              {
                href: '/ops/adoption',
                title: 'Adoption Network',
                stat: `${overview.adoption.listingCounts.available} live`,
                status: 'ready',
              },
              {
                href: '/ops/marketing',
                title: 'Marketing',
                stat: overview.marketingCanSend ? 'Send path open' : 'Dormant',
                status: marketingStatus,
              },
              {
                href: '/ops/shelter-id',
                title: 'Shelter & ID',
                stat: `${overview.shelterId.pendingReviews} pending`,
                status: overview.shelterId.pendingReviews > 0 ? 'warning' : 'ready',
              },
              {
                href: '/ops/wellness',
                title: 'Wellness & affiliates',
                stat: overview.wellness.ready ? 'Configured' : 'Needs URLs',
                status: overview.wellness.ready ? 'ready' : 'warning',
              },
              {
                href: '/ops/product',
                title: 'Product',
                stat: overview.product.pwaVersion,
                status: 'ready',
              },
              {
                href: '/vit-pro',
                title: 'ViT Pro CDS',
                stat: 'Phase V0 foundation',
                status: 'ready' as const,
              },
              {
                href: '/ops/system',
                title: 'System',
                stat: overview.system.supabaseReady ? 'Supabase OK' : 'Check env',
                status: overview.system.supabaseReady ? 'ready' : 'warning',
              },
            ] as Array<{
              href: string;
              title: string;
              stat: string;
              status: 'active' | 'dormant' | 'warning' | 'ready' | 'blocked';
            }>
          ).map((mod) => (
            <Link
              key={mod.href}
              href={mod.href}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 hover:border-[#F5C242]/40 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-bold">{mod.title}</h3>
                <OpsStatusBadge status={mod.status} />
              </div>
              <p className="mt-2 text-sm text-white/55">{mod.stat}</p>
              <p className="mt-3 text-xs text-[#F5C242]">Open module →</p>
            </Link>
          ))}
        </div>
      </OpsSection>

      <OpsSection title="Quick actions">
        <OpsCard>
          <div className="flex flex-wrap gap-4">
            {OPS_QUICK_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-[#F5C242] hover:underline"
              >
                {link.label} →
              </Link>
            ))}
            <OpsExternalLink href="https://vercel.com/dashboard" label="Vercel" />
            <OpsExternalLink
              href="https://supabase.com/dashboard"
              label="Supabase"
            />
          </div>
        </OpsCard>
      </OpsSection>

      {overview.recentAudit.length > 0 ? (
        <OpsSection title="Recent audit">
          <OpsCard>
            <ul className="space-y-2 text-sm">
              {overview.recentAudit.slice(0, 8).map((row) => (
                <li key={row.id} className="flex justify-between gap-4 text-white/70">
                  <span>{row.action}</span>
                  <span className="text-xs text-white/40 shrink-0">
                    {new Date(row.createdAt).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          </OpsCard>
        </OpsSection>
      ) : null}
    </OpsPageShell>
  );
}
