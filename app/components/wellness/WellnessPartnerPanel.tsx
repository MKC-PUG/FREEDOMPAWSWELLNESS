'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  wellnessFunnelCopy,
} from '@/lib/wellness/partners';
import type { WellnessFunnelContext, WellnessPartnersPublic } from '@/lib/wellness/types';

type Props = {
  context: WellnessFunnelContext;
  /** Show prominent ID enroll CTA (ViT flows). */
  showIdEnroll?: boolean;
  className?: string;
};

function PartnerButton({
  href,
  label,
  variant,
}: {
  href: string;
  label: string;
  variant: 'primary' | 'secondary';
}) {
  const cls =
    variant === 'primary'
      ? 'bg-amber-400 text-black hover:bg-amber-300'
      : 'border border-emerald-400/50 bg-emerald-950/30 text-emerald-200 hover:bg-emerald-950/50';

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className={`block w-full rounded-xl px-4 py-3 text-center text-sm font-bold transition touch-manipulation ${cls}`}
    >
      {label} ↗
    </a>
  );
}

export default function WellnessPartnerPanel({
  context,
  showIdEnroll = false,
  className = '',
}: Props) {
  const [config, setConfig] = useState<WellnessPartnersPublic | null>(null);

  useEffect(() => {
    void fetch('/api/wellness/partners')
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setConfig(d as WellnessPartnersPublic);
      })
      .catch(() => setConfig(null));
  }, []);

  const copy = wellnessFunnelCopy(context);

  const insuranceHref =
    config?.insurance.enabled &&
    config.insurance[copy.insuranceHrefKey];

  const telehealthHref =
    config?.telehealth.enabled && config.telehealth.bookUrl;

  const showPanel =
    config?.hasOutboundLinks || showIdEnroll || !config;

  if (!showPanel && config && !config.hasOutboundLinks && !showIdEnroll) {
    return null;
  }

  return (
    <section
      className={`rounded-2xl border border-white/10 bg-[#0F1E38]/80 p-5 space-y-4 ${className}`}
      aria-labelledby="wellness-partner-heading"
    >
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-400/90">
          Wellness partners
        </p>
        <h3 id="wellness-partner-heading" className="mt-1 text-lg font-bold text-white">
          {copy.title}
        </h3>
        <p className="mt-2 text-sm text-white/65 leading-relaxed">{copy.subtitle}</p>
      </div>

      {showIdEnroll && (
        <Link
          href="/id/enroll"
          className="block w-full rounded-xl border-2 border-amber-400/60 bg-amber-950/25 py-3 text-center text-sm font-bold text-amber-300 hover:bg-amber-950/40 transition"
        >
          Enroll Freedom Paws ID →
        </Link>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        {copy.showTelehealth && telehealthHref && (
          <div className="flex-1 space-y-2">
            <PartnerButton
              href={telehealthHref}
              label={copy.telehealthLabel}
              variant="secondary"
            />
            {config?.telehealth.partnerName && (
              <p className="text-[10px] text-white/40 text-center">
                via {config.telehealth.partnerName}
              </p>
            )}
          </div>
        )}
        {copy.showInsurance && insuranceHref && (
          <div className="flex-1 space-y-2">
            <PartnerButton
              href={insuranceHref}
              label={copy.insuranceLabel}
              variant="primary"
            />
            {config?.insurance.partnerName && (
              <p className="text-[10px] text-white/40 text-center">
                via {config.insurance.partnerName}
              </p>
            )}
          </div>
        )}
      </div>

      {!config?.hasOutboundLinks && (
        <p className="text-xs text-amber-200/70 rounded-xl border border-amber-500/20 bg-amber-950/20 px-3 py-2">
          Partner links not configured yet — add affiliate URLs in environment settings.
          Check <code className="text-amber-100">/api/wellness/config-status</code>.
        </p>
      )}

      <p className="text-[10px] text-white/35 leading-relaxed">
        {config?.philosophyNote ||
          'Freedom Paws provides holistic wellness education and protocol recommendations — not veterinary medical care.'}
        {config?.insurance.enabled && config.insurance.disclosure ? (
          <> {config.insurance.disclosure}</>
        ) : null}
      </p>

      <Link
        href="/wellness"
        className="block text-center text-xs font-semibold text-amber-400/90 hover:text-amber-300"
      >
        Learn about prevention & natural care →
      </Link>

      <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-3 space-y-2">
        <p className="text-[10px] font-bold uppercase tracking-wide text-white/45 text-center">
          For affiliate &amp; telehealth partners
        </p>
        <div className="flex flex-col sm:flex-row gap-2 text-center">
          <Link
            href="/wellness/partners/insurance"
            className="flex-1 text-[11px] font-semibold text-white/55 hover:text-amber-300 py-1"
          >
            Insurance standards →
          </Link>
          <Link
            href="/wellness/partners/telehealth"
            className="flex-1 text-[11px] font-semibold text-white/55 hover:text-emerald-300 py-1"
          >
            Telehealth standards →
          </Link>
        </div>
      </div>
    </section>
  );
}
