import Link from 'next/link';
import type { PhotoBoothAffiliatesData } from '@/lib/photobooth/affiliates';

type Props = {
  data: PhotoBoothAffiliatesData;
  variant?: 'compact' | 'full';
};

export default function PhotoBoothAffiliatePicks({ data, variant = 'full' }: Props) {
  if (!data.moduleEnabled) return null;

  const compact = variant === 'compact';

  return (
    <section
      className={
        compact
          ? 'mt-4 rounded-xl border border-violet-400/25 bg-violet-950/20 p-3'
          : 'rounded-2xl border border-violet-400/30 bg-violet-950/15 p-4 sm:p-5'
      }
      aria-labelledby={compact ? undefined : 'photobooth-affiliate-heading'}
    >
      {!compact && (
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-violet-300">
          Print &amp; gift partners
        </p>
      )}
      <h3
        id="photobooth-affiliate-heading"
        className={
          compact
            ? 'text-sm font-bold text-violet-200'
            : 'mt-1 text-base sm:text-lg font-bold text-white'
        }
      >
        {compact ? '🎁 Turn your photo into gifts' : 'Turn your Photo Booth image into keepsakes'}
      </h3>
      <p
        className={
          compact
            ? 'mt-1 text-[10px] text-white/50 leading-relaxed'
            : 'mt-2 text-xs text-white/55 leading-relaxed'
        }
      >
        {data.hasActiveLinks
          ? 'Order framed prints, mugs, pillows, blankets, or holiday cards — partners ship to you.'
          : 'Framed prints, mugs, pillows, non-toxic blankets, and Christmas cards — partner links launching soon.'}
      </p>

      <ul className={compact ? 'mt-3 space-y-2' : 'mt-4 space-y-2.5'}>
        {data.picks.map((pick) => (
          <li
            key={pick.id}
            className={
              compact
                ? 'rounded-lg border border-white/10 bg-[#0A1625]/60 px-3 py-2.5'
                : 'rounded-xl border border-white/10 bg-[#0A1625]/50 px-3 py-3 sm:px-4 sm:py-3.5'
            }
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-violet-200/90">
                  <span aria-hidden className="mr-1">
                    {pick.emoji}
                  </span>
                  {pick.label}
                </p>
                {!compact && (
                  <p className="mt-0.5 text-sm font-semibold text-white/90">{pick.brandName}</p>
                )}
                {!compact && (
                  <p className="mt-1 text-xs text-white/55 leading-relaxed">{pick.description}</p>
                )}
              </div>
              <div className="shrink-0">
                {pick.active && pick.url ? (
                  <a
                    href={pick.url}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className={
                      compact
                        ? 'inline-flex min-h-[36px] items-center rounded-lg bg-violet-400 px-3 py-1.5 text-[11px] font-bold text-black touch-manipulation'
                        : 'inline-flex min-h-[40px] items-center rounded-full bg-violet-400 px-4 py-2 text-xs font-bold text-black touch-manipulation'
                    }
                  >
                    Order →
                  </a>
                ) : (
                  <span
                    className={
                      compact
                        ? 'inline-flex min-h-[36px] items-center rounded-lg border border-white/15 px-2.5 text-[10px] font-semibold text-white/40'
                        : 'inline-flex min-h-[40px] items-center rounded-full border border-white/15 px-3 text-[11px] font-semibold text-white/45'
                    }
                  >
                    Launching soon
                  </span>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>

      {!compact && (
        <>
          <p className="mt-3 text-[10px] leading-relaxed text-white/40">{data.disclosure}</p>
          <p className="mt-2 text-[10px] text-white/45">
            Prospective print partners:{' '}
            <a href={`mailto:${data.contactEmail}`} className="text-violet-300/90 underline">
              {data.contactEmail}
            </a>
          </p>
          <p className="mt-2 text-center text-xs">
            <Link
              href="/photobooth/partners"
              className="text-violet-300/90 hover:text-violet-200 underline underline-offset-2"
            >
              Photo Booth partner standards →
            </Link>
          </p>
        </>
      )}
    </section>
  );
}
