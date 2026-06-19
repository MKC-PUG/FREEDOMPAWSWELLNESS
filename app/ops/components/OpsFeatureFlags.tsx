'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { FeatureFlags } from '@/lib/ops/types';
import { OpsCard } from './OpsUi';

export default function OpsFeatureFlags({ initial }: { initial: FeatureFlags }) {
  const router = useRouter();
  const [flags, setFlags] = useState(initial);
  const [saving, setSaving] = useState(false);

  async function toggle(key: keyof FeatureFlags, value: boolean) {
    setSaving(true);
    try {
      const res = await fetch('/api/ops/settings/feature-flags', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [key]: value }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error();
      setFlags(data.flags);
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  const items: { key: keyof FeatureFlags; label: string; hint: string }[] = [
    {
      key: 'adoptDirectoryPublic',
      label: 'Adoption directory public',
      hint: '/adopt/tn live for families',
    },
    { key: 'waitlistOpen', label: 'Waitlist open', hint: 'Accept new waitlist signups' },
    { key: 'photoboothEnabled', label: 'Photo Booth enabled', hint: 'Member-facing Photo Booth' },
  ];

  return (
    <OpsCard>
      <h3 className="font-bold">Feature flags</h3>
      <p className="mt-1 text-xs text-white/50 mb-4">Product toggles stored in ops_settings.</p>
      <div className="space-y-3">
        {items.map((item) => (
          <label
            key={item.key}
            className="flex items-center justify-between gap-4 cursor-pointer py-2 border-b border-white/5 last:border-0"
          >
            <span>
              <span className="text-sm font-medium">{item.label}</span>
              <span className="block text-xs text-white/50">{item.hint}</span>
            </span>
            <input
              type="checkbox"
              checked={flags[item.key]}
              disabled={saving}
              onChange={(e) => toggle(item.key, e.target.checked)}
              className="h-4 w-4 accent-[#F5C242]"
            />
          </label>
        ))}
      </div>
    </OpsCard>
  );
}
