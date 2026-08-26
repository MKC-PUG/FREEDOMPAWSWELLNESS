import { getOpsOverview } from '@/lib/ops/stats-server';
import {
  getSocialDashboardStats,
  listSocialPosts,
} from '@/lib/ops/social-server';
import { getServerUser } from '@/lib/supabase/server';
import { MARKETING_WORKFLOW_LABELS } from '@/lib/ops/types';
import OpsMarketingControls from '../../components/OpsMarketingControls';
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
      title="Marketing & SuperBud studio"
      subtitle="Social production arm — draft, approve, Buffer — plus CRM automation gates (dormant by default)."
      badge={<OpsStatusBadge status={status} />}
    >
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
          <code className="text-[#F5C242]">BUFFER_WEBHOOK_URL</code> is set). See{' '}
          <code className="text-[#F5C242]">docs/ops/SUPERBUD-SOCIAL-STUDIO-CLICK-BY-CLICK.md</code>.
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
