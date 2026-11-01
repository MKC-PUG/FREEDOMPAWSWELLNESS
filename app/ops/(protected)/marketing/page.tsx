import Link from 'next/link';
import { getOpsOverview } from '@/lib/ops/stats-server';
import {
  getSocialDashboardStats,
  listSocialPosts,
} from '@/lib/ops/social-server';
import { parseManual } from '@/lib/ops/manual-blocks';
import { readSuperbudPageManual } from '@/lib/ops/manual-source';
import { getServerUser } from '@/lib/supabase/server';
import { MARKETING_WORKFLOW_LABELS } from '@/lib/ops/types';
import OpsMarketingControls from '../../components/OpsMarketingControls';
import { OpsReferenceManual } from '../../components/OpsReferenceManual';
import OpsSocialStudio from '../../components/OpsSocialStudio';
import {
  OpsCard,
  OpsPageShell,
  OpsSection,
  OpsStatusBadge,
} from '../../components/OpsUi';

export default async function OpsMarketingPage() {
  const user = await getServerUser();
  const { marketing, marketingCanSend } = await getOpsOverview(user?.email);

  let posts: Awaited<ReturnType<typeof listSocialPosts>> = [];
  let stats = {
    total: 0,
    draft: 0,
    needsApproval: 0,
    approved: 0,
    scheduled: 0,
    posted: 0,
    failed: 0,
  };
  let tableReady = true;
  let tableError: string | null = null;

  try {
    posts = await listSocialPosts(60);
    stats = await getSocialDashboardStats();
  } catch (e) {
    tableReady = false;
    tableError =
      e instanceof Error
        ? e.message
        : 'social_posts unavailable — run migration 015_social_posts.sql';
  }

  const status = marketing.emergencyStop
    ? 'blocked'
    : marketing.masterEnabled
      ? 'active'
      : 'dormant';

  return (
    <OpsPageShell
      title="SuperBud (Distribution)"
      subtitle="Social posts to the platforms, and member email when a member list exists. Video production stays on Studio."
      badge={<OpsStatusBadge status={status} />}
    >
      <OpsReferenceManual
        kicker="UPDATED 11/1/26"
        title="SuperBud page — click-by-click"
        note="Internal reference. Approving a caption still leaves the send in your hands."
        blocks={parseManual(readSuperbudPageManual())}
      />
      <div className="mb-6 rounded-2xl border border-[#F5C242]/30 bg-[#F5C242]/10 px-4 py-3 text-sm text-white/80">
        Make the picture on{' '}
        <Link href="/ops/desk" className="font-bold text-[#F5C242] hover:underline">
          Studio (Production)
        </Link>
        . This page distributes. A handed-off cut arrives as a draft. You approve it, then you send
        it to Buffer.
      </div>
      <div className="mb-6 rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white/75">
        <strong className="text-white">Member email is closed.</strong> There is no member list.
        When members exist, drafts will sit here and you will send them. This page does not connect
        a mailbox. Shelter email stays on its own path.
      </div>
      <OpsSocialStudio
        initialPosts={posts}
        stats={stats}
        tableReady={tableReady}
        tableError={tableError}
      />

      <div className="my-10 border-t border-white/10 pt-8">
        <div className="mb-6 rounded-2xl border border-[#F5C242]/25 bg-[#F5C242]/5 px-4 py-3 text-sm text-white/80">
          <strong>Email automation still does not send from this console.</strong> Toggles below
          record intent for n8n. Social Buffer send is separate (dry-run until{' '}
          <code className="text-[#F5C242]">BUFFER_WEBHOOK_URL</code> is set). The click path is the
          manual at the top of this page.
        </div>

        <OpsMarketingControls initial={marketing} canSend={marketingCanSend} />

        <OpsSection title="Workflow reference">
          <div className="grid sm:grid-cols-2 gap-3">
            {(
              Object.keys(MARKETING_WORKFLOW_LABELS) as Array<keyof typeof MARKETING_WORKFLOW_LABELS>
            ).map((key) => {
              const wf = MARKETING_WORKFLOW_LABELS[key];
              const on = marketing.workflows[key];
              return (
                <OpsCard key={key}>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-bold">{wf.name}</h3>
                    <OpsStatusBadge
                      status={on && !marketing.emergencyStop ? 'active' : 'dormant'}
                    />
                  </div>
                  <p className="mt-2 text-xs text-white/55">{wf.description}</p>
                  {wf.sendsEmail ? (
                    <p className="mt-2 text-[10px] text-rose-300/80 uppercase tracking-wide">
                      Sends email when active
                    </p>
                  ) : null}
                </OpsCard>
              );
            })}
          </div>
        </OpsSection>

        <OpsSection title="Local tooling">
          <OpsCard>
            <ul className="text-sm space-y-2 text-white/70">
              <li>
                <code className="text-[#F5C242]">npm run marketing:crm-export</code> — CRM CSV (no
                send)
              </li>
              <li>
                <code className="text-[#F5C242]">npm run marketing:tn-outreach</code> — draft emails
              </li>
              <li>Drafts: docs/marketing/outbox/tn-pilot/</li>
              <li>n8n templates: docs/automation/n8n/</li>
            </ul>
          </OpsCard>
        </OpsSection>
      </div>
    </OpsPageShell>
  );
}
