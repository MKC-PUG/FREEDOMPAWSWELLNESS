'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { MarketingAutomationSettings } from '@/lib/ops/types';
import { OpsCard } from './OpsUi';

type Props = {
  initial: MarketingAutomationSettings;
  canSend: boolean;
};

export default function OpsMarketingControls({ initial, canSend }: Props) {
  const router = useRouter();
  const [settings, setSettings] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function patch(body: Record<string, unknown>) {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/ops/settings/marketing', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Save failed');
      setSettings(data.settings);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  async function togglePartner(slug: string, approved: boolean) {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/ops/settings/partner-approval', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, approved }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Save failed');
      setSettings(data.settings);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  const blocked = settings.emergencyStop || !settings.masterEnabled;

  return (
    <div className="space-y-6">
      {error ? (
        <div className="rounded-xl border border-rose-500/40 bg-rose-950/30 px-4 py-3 text-sm text-rose-200">
          {error}
        </div>
      ) : null}

      <OpsCard>
        <h3 className="font-bold text-[#F5C242]">Global gates</h3>
        <p className="mt-1 text-xs text-white/50">
          Toggles save to Supabase. No email sends from this app — n8n reads these when you connect
          it later.
        </p>
        <div className="mt-4 space-y-4">
          <label className="flex items-center justify-between gap-4 cursor-pointer">
            <span>
              <span className="text-sm font-medium">Emergency stop</span>
              <span className="block text-xs text-white/50">Blocks all automated outbound when on</span>
            </span>
            <input
              type="checkbox"
              checked={settings.emergencyStop}
              disabled={saving}
              onChange={(e) => patch({ emergencyStop: e.target.checked })}
              className="h-5 w-5 accent-rose-500"
            />
          </label>
          <label className="flex items-center justify-between gap-4 cursor-pointer">
            <span>
              <span className="text-sm font-medium">Master marketing enabled</span>
              <span className="block text-xs text-white/50">Required before any workflow can run</span>
            </span>
            <input
              type="checkbox"
              checked={settings.masterEnabled}
              disabled={saving || settings.emergencyStop}
              onChange={(e) => patch({ masterEnabled: e.target.checked })}
              className="h-5 w-5 accent-[#F5C242]"
            />
          </label>
        </div>
        <p className="mt-4 text-xs text-white/45">
          Send path status:{' '}
          <span className={canSend ? 'text-emerald-400' : 'text-amber-400'}>
            {canSend ? 'Workflow D could send (if n8n active)' : 'Blocked — dormant'}
          </span>
        </p>
      </OpsCard>

      <OpsCard>
        <h3 className="font-bold">n8n workflows</h3>
        <p className="mt-1 text-xs text-white/50 mb-4">
          Import from docs/automation/n8n. Keep inactive in n8n until ready.
        </p>
        <div className="space-y-3">
          {(Object.keys(settings.workflows) as Array<keyof typeof settings.workflows>).map((key) => {
            const sends = key === 'd' || key === 'g';
            return (
              <label
                key={key}
                className="flex items-center justify-between gap-4 py-2 border-b border-white/5 last:border-0 cursor-pointer"
              >
                <span>
                  <span className="text-sm font-medium uppercase">{key}</span>
                  {sends ? (
                    <span className="ml-2 text-[10px] text-rose-300/80">sends email</span>
                  ) : null}
                </span>
                <input
                  type="checkbox"
                  checked={settings.workflows[key]}
                  disabled={saving || blocked}
                  onChange={(e) =>
                    patch({ workflows: { ...settings.workflows, [key]: e.target.checked } })
                  }
                  className="h-4 w-4 accent-emerald-500"
                />
              </label>
            );
          })}
        </div>
      </OpsCard>

      <OpsCard>
        <h3 className="font-bold">TN pilot partner approvals</h3>
        <p className="mt-1 text-xs text-white/50 mb-4">
          Workflow D only sends when partner is approved here (and gates above allow).
        </p>
        <div className="space-y-2">
          {Object.keys(settings.partnerApprovals).length === 0 ? (
            <p className="text-sm text-white/45">Approve partners from the Adoption module.</p>
          ) : null}
        </div>
      </OpsCard>
    </div>
  );
}

export function OpsPartnerApprovalToggle({
  slug,
  name,
  approved,
}: {
  slug: string;
  name: string;
  approved: boolean;
}) {
  const router = useRouter();
  const [value, setValue] = useState(approved);
  const [saving, setSaving] = useState(false);

  async function onChange(next: boolean) {
    setSaving(true);
    try {
      const res = await fetch('/api/ops/settings/partner-approval', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, approved: next }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error();
      setValue(next);
      router.refresh();
    } catch {
      setValue(approved);
    } finally {
      setSaving(false);
    }
  }

  return (
    <label className="flex items-center gap-2 text-xs cursor-pointer">
      <input
        type="checkbox"
        checked={value}
        disabled={saving}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-[#F5C242]"
      />
      <span className="text-white/70">Approved for outreach</span>
      <span className="sr-only">{name}</span>
    </label>
  );
}
