import Link from 'next/link';
import type { SafeProductPick } from '@/lib/wellness/safe-products';
import { protocols } from '@/app/protocols/protocols';

type Props = {
  pick: SafeProductPick;
};

function protocolTitle(slug: string): string {
  return protocols.find((p) => p.slug === slug)?.title ?? slug;
}

export default function SafeProductCard({ pick }: Props) {
  return (
    <li className="rounded-2xl border border-white/10 bg-[#0A1428]/60 p-4 md:p-5">
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            {pick.priority === 'featured' && (
              <span className="inline-block rounded-full border border-emerald-500/40 bg-emerald-950/40 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-300">
                Featured pick
              </span>
            )}
            <p className="mt-1 text-xs font-bold uppercase tracking-wide text-emerald-400/90">
              {pick.productLine}
            </p>
            <p className="text-lg font-bold text-white">{pick.brandName}</p>
            <p className="mt-1.5 text-sm text-white/60 leading-relaxed">{pick.description}</p>
          </div>
          <div className="shrink-0">
            {pick.active && pick.url ? (
              <a
                href={pick.url}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-emerald-400 px-6 py-2.5 text-sm font-bold text-black hover:bg-emerald-300 transition-colors touch-manipulation"
              >
                Shop safe pick →
              </a>
            ) : (
              <span className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold text-white/45">
                Launching soon
              </span>
            )}
          </div>
        </div>

        <ul className="flex flex-wrap gap-1.5">
          {pick.whySafe.map((tag) => (
            <li
              key={tag}
              className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-[10px] text-white/55"
            >
              {tag}
            </li>
          ))}
        </ul>

        {pick.protocolSlugs.length > 0 && (
          <p className="text-xs text-white/45">
            Related protocols:{' '}
            {pick.protocolSlugs.map((slug, i) => (
              <span key={slug}>
                {i > 0 ? ' · ' : ''}
                <Link
                  href={`/protocols/${slug}`}
                  className="text-emerald-400/90 underline underline-offset-2 hover:text-emerald-300"
                >
                  {protocolTitle(slug)}
                </Link>
              </span>
            ))}
          </p>
        )}
      </div>
    </li>
  );
}
