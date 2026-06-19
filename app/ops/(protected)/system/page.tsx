import { getOpsOverview } from '@/lib/ops/stats-server';
import { getServerUser } from '@/lib/supabase/server';
import {
  OpsCard,
  OpsConfigRow,
  OpsExternalLink,
  OpsPageShell,
  OpsSection,
  OpsStatusBadge,
} from '../../components/OpsUi';

export default async function OpsSystemPage() {
  const user = await getServerUser();
  const { system, marketing, generatedAt } = await getOpsOverview(user?.email);

  const allCoreOk =
    system.supabaseReady && system.resendReady && system.fpOpsEmails && system.serviceRoleKey;

  return (
    <OpsPageShell
      title="System & infrastructure"
      subtitle="Environment health, migrations, and external dashboards."
      badge={<OpsStatusBadge status={allCoreOk ? 'ready' : 'warning'} />}
    >
      <p className="text-xs text-white/40 mb-6">
        Snapshot: {new Date(generatedAt).toLocaleString()}
      </p>

      <OpsSection title="Core services">
        <OpsCard>
          <OpsConfigRow label="Supabase" ok={system.supabaseReady} />
          <OpsConfigRow label="Resend API" ok={system.resendReady} />
          <OpsConfigRow label="Match owner email path" ok={system.matchEmailReady} />
          <OpsConfigRow label="FP_OPS_EMAILS" ok={system.fpOpsEmails} />
          <OpsConfigRow label="Service role key" ok={system.serviceRoleKey} />
        </OpsCard>
      </OpsSection>

      <OpsSection title="Ops database">
        <OpsCard>
          <p className="text-sm text-white/65">{system.migrationsNote}</p>
          <p className="mt-3 text-xs text-white/45">
            Marketing emergency stop:{' '}
            <strong className={marketing.emergencyStop ? 'text-emerald-400' : 'text-amber-400'}>
              {marketing.emergencyStop ? 'ON (safe)' : 'OFF'}
            </strong>
          </p>
        </OpsCard>
      </OpsSection>

      <OpsSection title="External consoles">
        <OpsCard>
          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            <OpsExternalLink href="https://vercel.com/dashboard" label="Vercel — deploys & domains" />
            <OpsExternalLink href="https://supabase.com/dashboard" label="Supabase — DB & auth" />
            <OpsExternalLink href="https://resend.com/emails" label="Resend — email log" />
            <OpsExternalLink href="https://n8n.io" label="n8n — automation (when ready)" />
          </div>
        </OpsCard>
      </OpsSection>

      <OpsSection title="Key URLs">
        <OpsCard>
          <ul className="text-sm space-y-2 text-white/70">
            <li>App: https://app.freedompawsinc.com</li>
            <li>Partner: https://shelter.freedompawsinc.com/partner</li>
            <li>Adopt TN: https://app.freedompawsinc.com/adopt/tn</li>
            <li>Ops: https://app.freedompawsinc.com/ops</li>
          </ul>
        </OpsCard>
      </OpsSection>
    </OpsPageShell>
  );
}
