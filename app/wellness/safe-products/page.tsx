import type { Metadata } from 'next';
import Link from 'next/link';
import BackLink from '@/app/components/BackLink';
import SafeProductCard from '@/app/components/wellness/SafeProductCard';
import {
  getSafeProductsPageData,
  SAFE_PRODUCT_CATEGORY_LABELS,
  SAFE_PRODUCT_CRITERIA,
} from '@/lib/wellness/safe-products';

export const metadata: Metadata = {
  title: 'Safe Picks • Non-Toxic Chews, Toys & Home • Freedom Paws',
  description:
    'Freedom Paws curated non-toxic chews, toys, and home products — vetted for wellness-first dogs. Affiliate links activate as partners are signed.',
};

export default function SafeProductsPage() {
  const data = getSafeProductsPageData();

  if (!data.moduleEnabled) {
    return (
      <div className="min-h-screen bg-[#0A1625] text-white font-sans">
        <div className="mx-auto max-w-lg px-6 py-10">
          <BackLink href="/wellness" label="Back to Wellness" />
          <p className="mt-8 text-center text-white/60">Safe Picks catalog is temporarily unavailable.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A1625] text-white font-sans">
      <div className="mx-auto max-w-lg px-6 py-10">
        <BackLink href="/wellness" label="Back to Wellness" />

        <header className="mt-6 mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
            Freedom Paws Safe Picks
          </p>
          <h1 className="mt-2 text-2xl font-bold leading-tight">
            Curated non-toxic chews, toys &amp; home
          </h1>
          <p className="mt-3 text-sm text-white/70 leading-relaxed">
            Ten vetted brands and product lines aligned with our{' '}
            <strong className="text-white/90">wellness-first</strong> standards — no rawhide
            priority, transparent sourcing, and quarterly recall review. Live affiliate links appear
            as partners are signed.
          </p>
        </header>

        <section className="rounded-2xl border border-emerald-500/25 bg-emerald-950/15 p-5 mb-8">
          <h2 className="text-sm font-bold text-emerald-300">How we vet Safe Picks</h2>
          <ul className="mt-3 space-y-2 text-sm text-white/65 list-disc pl-5">
            {SAFE_PRODUCT_CRITERIA.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-white/45 leading-relaxed">
            We reject partners requiring pharmaceutical-first co-marketing. Not every SKU from a
            brand is approved — only lines that meet our criteria appear here.
          </p>
        </section>

        {data.activeCount === 0 && (
          <p className="mb-6 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/55 text-center">
            Affiliate applications in progress — all picks show as{' '}
            <strong className="text-white/75">Launching soon</strong> until tracked URLs are
            configured.
          </p>
        )}

        {data.activeCount > 0 && (
          <p className="mb-6 text-sm text-emerald-300/90 text-center">
            {data.activeCount} live partner link{data.activeCount === 1 ? '' : 's'} on this page.
          </p>
        )}

        {(() => {
          const protocolSlugs = [
            'gut-balance',
            'allergy-shield',
            'fresh-smile-dental',
            'freedom-calm',
            'max-movement',
          ] as const;
          const sections = protocolSlugs
            .map((slug) => ({
              slug,
              picks: data.picks.filter((p) => p.protocolSlugs.includes(slug)),
            }))
            .filter((s) => s.picks.length > 0);
          if (!sections.length) return null;
          return (
            <div className="mb-10 space-y-6">
              <h2 className="text-sm font-bold text-white/80">By protocol (ViT funnel)</h2>
              {sections.map(({ slug, picks }) => (
                <section key={slug} id={slug} className="scroll-mt-28">
                  <h3 className="text-xs font-bold uppercase tracking-wide text-emerald-400/90">
                    {slug.replace(/-/g, ' ')}
                  </h3>
                  <ul className="mt-2 space-y-2">
                    {picks.map((pick) => (
                      <li
                        key={pick.id}
                        className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70"
                      >
                        {pick.brandName} — {pick.productLine}
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          );
        })()}

        <div className="space-y-10">
          {(Object.keys(SAFE_PRODUCT_CATEGORY_LABELS) as Array<
            keyof typeof SAFE_PRODUCT_CATEGORY_LABELS
          >).map((categoryKey) => {
            const meta = SAFE_PRODUCT_CATEGORY_LABELS[categoryKey];
            const items = data.byCategory[categoryKey];
            if (!items.length) return null;

            return (
              <section key={categoryKey}>
                <div className="mb-4">
                  <span className="text-2xl" aria-hidden>
                    {meta.icon}
                  </span>
                  <h2 className="mt-2 text-lg font-bold">{meta.title}</h2>
                  <p className="mt-1 text-sm text-white/55">{meta.subtitle}</p>
                </div>
                <ul className="space-y-3">
                  {items.map((pick) => (
                    <SafeProductCard key={pick.id} pick={pick} />
                  ))}
                </ul>
              </section>
            );
          })}
        </div>

        <section className="mt-10 rounded-2xl border border-amber-400/20 bg-amber-950/15 p-5">
          <h2 className="text-sm font-bold text-amber-300">ViT → Safe Picks funnel</h2>
          <p className="mt-2 text-sm text-white/65 leading-relaxed">
            After ViT flags dental, allergy, or enrichment patterns, explore related protocols and
            Safe Picks together — education first, products optional.
          </p>
          <div className="mt-4 grid grid-cols-1 gap-2">
            <Link
              href="/diagnostics"
              className="rounded-xl border border-white/10 bg-[#0A1625]/50 py-3 text-center text-sm font-bold text-amber-300 hover:border-amber-400/40 transition"
            >
              Run ViT Diagnostics →
            </Link>
            <Link
              href="/protocols/fresh-smile-dental"
              className="rounded-xl border border-white/10 py-2.5 text-center text-xs font-semibold text-white/70 hover:text-white transition"
            >
              Fresh Smile Dental protocol
            </Link>
            <Link
              href="/protocols/allergy-shield"
              className="rounded-xl border border-white/10 py-2.5 text-center text-xs font-semibold text-white/70 hover:text-white transition"
            >
              Allergy Shield protocol
            </Link>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
          <h2 className="text-sm font-bold text-white/80">Safety &amp; recalls</h2>
          <p className="mt-2 text-sm text-white/60 leading-relaxed">
            Founder quarterly review against{' '}
            <a
              href="https://www.fda.gov/animal-veterinary/recalls-withdrawals"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400/90 underline underline-offset-2"
            >
              FDA pet recall alerts
            </a>
            . If a listed product is recalled, it is removed from this page within 48 hours.
          </p>
          <p className="mt-3 text-xs text-white/45">
            Brands interested in Safe Picks:{' '}
            <a href="mailto:partners@freedompawsinc.com" className="text-emerald-400/80">
              partners@freedompawsinc.com
            </a>
          </p>
        </section>

        <p className="mt-6 text-[11px] leading-relaxed text-white/40">{data.disclosure}</p>

        <p className="mt-3 text-center text-xs">
          <Link
            href="/wellness/partners"
            className="text-emerald-400/90 hover:text-emerald-300 underline underline-offset-2"
          >
            Freedom Paws partner standards →
          </Link>
        </p>
      </div>
    </div>
  );
}
