import { getOpsOverview } from '@/lib/ops/stats-server';
import { getServerUser } from '@/lib/supabase/server';
import { MARKETING_WORKFLOW_LABELS } from '@/lib/ops/types';
import OpsMarketingControls from '../../components/OpsMarketingControls';
import {
  OpsCard,
  OpsPageShell,
  OpsSection,
  OpsStatusBadge,
} from '../../components/OpsUi';

export default async function OpsMarketingPage() {
  const user = await getServerUser();
  const { marketing, marketingCanSend } = await getOpsOverview(user?.email);

  const status = marketing.emergencyStop
    ? 'blocked'
    : marketing.masterEnabled
      ? 'active'
      : 'dormant';

  return (
    <OpsPageShell
      title="Marketing automation"
      subtitle="CRM outreach, n8n workflows, and TN pilot onboarding — dormant by default."
      badge={<OpsStatusBadge status={status} />}
    >
      <div className="mb-6 rounded-2xl border border-[#F5C242]/25 bg-[#F5C242]/5 px-4 py-3 text-sm text-white/80">
        <strong>No emails send from this console.</strong> Toggles record your intent in Supabase.
        When you connect n8n, read these settings before activating workflows. See{' '}
        <code className="text-[#F5C242]">docs/marketing/ACTIVATION-GATE.md</code> in the repo.
      </div>

      <OpsMarketingControls initial={marketing} canSend={marketingCanSend} />

      <OpsSection title="Workflow reference">
        <div className="grid sm:grid-cols-2 gap-3">
          {(Object.keys(MARKETING_WORKFLOW_LABELS) as Array<keyof typeof MARKETING_WORKFLOW_LABELS>).map(
            (key) => {
              const wf = MARKETING_WORKFLOW_LABELS[key];
              const on = marketing.workflows[key];
              return (
                <OpsCard key={key}>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-bold">{wf.name}</h3>
                    <OpsStatusBadge status={on && !marketing.emergencyStop ? 'active' : 'dormant'} />
                  </div>
                  <p className="mt-2 text-xs text-white/55">{wf.description}</p>
                  {wf.sendsEmail ? (
                    <p className="mt-2 text-[10px] text-rose-300/80 uppercase tracking-wide">
                      Sends email when active
                    </p>
                  ) : null}
                </OpsCard>
              );
            }
          )}
        </div>
      </OpsSection>

      <OpsSection title="Local tooling">
        <OpsCard>
          <ul className="text-sm space-y-2 text-white/70">
            <li>
              <code className="text-[#F5C242]">npm run marketing:crm-export</code> — CRM CSV (no send)
            </li>
            <li>
              <code className="text-[#F5C242]">npm run marketing:tn-outreach</code> — draft emails
            </li>
            <li>Drafts: docs/marketing/outbox/tn-pilot/</li>
            <li>n8n templates: docs/automation/n8n/</li>
          </ul>
        </OpsCard>
      </OpsSection>
    </OpsPageShell>
  );
}
