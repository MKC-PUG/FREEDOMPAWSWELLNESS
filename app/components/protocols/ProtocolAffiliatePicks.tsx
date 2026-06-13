import Link from 'next/link';
import type { ProtocolAffiliateSection } from '@/lib/protocols/affiliates';

type Props = {
  section: ProtocolAffiliateSection;
};

export default function ProtocolAffiliatePicks({ section }: Props) {
  if (!section.moduleEnabled) return null;

  return (
    <section
      className="mt-8 rounded-3xl border border-emerald-500/25 bg-emerald-950/15 p-7 md:p-10"
      aria-labelledby="protocol-affiliate-heading"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
        Whole-food &amp; safe picks
      </p>
      <h2 id="protocol-affiliate-heading" className="mt-2 text-2xl md:text-3xl font-bold">
        Protocol-aligned partners
      </h2>
      <p className="mt-3 text-sm text-white/65 leading-relaxed max-w-2xl">
        Non-toxic, whole-food brands curated for{' '}
        <span className="text-white/90">{section.protocolTitle}</span>. Live affiliate links
        appear as partners are signed — every pick must meet our wellness standards.
      </p>

      <ul className="mt-6 space-y-3">
        {section.picks.map((pick) => (
          <li
            key={pick.id}
            className="rounded-2xl border border-white/10 bg-[#0A1428]/60 p-4 md:p-5"
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold uppercase tracking-wide text-emerald-400/90">
                  {pick.label}
                </p>
                <p className="mt-1 text-lg font-bold text-white">{pick.brandName}</p>
                <p className="mt-1.5 text-sm text-white/60 leading-relaxed">{pick.description}</p>
              </div>
              <div className="shrink-0 sm:pt-1">
                {pick.active && pick.url ? (
                  <a
                    href={pick.url}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-emerald-400 px-6 py-2.5 text-sm font-bold text-black hover:bg-emerald-300 transition-colors touch-manipulation"
                  >
                    Shop partner →
                  </a>
                ) : (
                  <span className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold text-white/45">
                    Launching soon
                  </span>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>

      {section.hasActiveLinks ? (
        <p className="mt-5 text-xs text-emerald-300/80">
          {section.activeCount} live partner link{section.activeCount === 1 ? '' : 's'} on this
          protocol.
        </p>
      ) : (
        <p className="mt-5 text-xs text-white/45">
          Affiliate applications in progress — brands shown are outreach targets aligned with this
          protocol.
        </p>
      )}

      <p className="mt-4 text-[11px] leading-relaxed text-white/40">{section.disclosure}</p>

      <p className="mt-3 text-center text-xs">
        <Link
          href="/wellness/partners"
          className="text-emerald-400/90 hover:text-emerald-300 underline underline-offset-2"
        >
          Freedom Paws partner standards →
        </Link>
      </p>
    </section>
  );
}
