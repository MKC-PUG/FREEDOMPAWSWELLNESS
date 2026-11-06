import Link from 'next/link';
import type { CareFormat, SupportCard } from '@/lib/wellness/care-format';

const SPONSORED_HREF = '/wellness/sponsored';

function CardActions({ card }: { card: SupportCard }) {
  if (card.kind === 'plan' && card.planSlug) {
    return (
      <Link
        href={`/protocols/${card.planSlug}`}
        className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-[#F5C242] px-5 text-sm font-bold text-black"
      >
        Open this plan
      </Link>
    );
  }
  return (
    <Link
      href={SPONSORED_HREF}
      className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-white/20 px-5 text-sm font-bold text-white"
    >
      Sponsored
    </Link>
  );
}

function ProductCard({ card }: { card: SupportCard }) {
  return (
    <article className="flex flex-col rounded-2xl border border-white/10 bg-[#0A1428]/60 p-4">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-base font-bold text-white">{card.title}</h3>
        {card.kind === 'sponsored' ? (
          <span className="shrink-0 rounded-full border border-white/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white/55">
            Sponsored
          </span>
        ) : (
          <span className="shrink-0 rounded-full border border-[#F5C242]/40 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#F5C242]">
            Freedom Paws
          </span>
        )}
      </div>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-white/65">{card.detail}</p>
      <div className="mt-4">
        <CardActions card={card} />
      </div>
    </article>
  );
}

type Props = {
  care: CareFormat;
  showProducts: boolean;
};

export default function OptionalSupportiveProducts({ care, showProducts }: Props) {
  if (!showProducts) return null;

  const harness =
    care.includesWalk
      ? {
          id: 'harness',
          title: 'Walking harness',
          detail:
            'A well-fitted harness for every leash walk in this plan. The leash clips to the harness, not the neck.',
          kind: 'sponsored' as const,
        }
      : null;

  return (
    <section className="rounded-3xl border border-white/10 bg-[#16223C] p-6 md:p-8" aria-labelledby="optional-support-heading">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#F5C242]">Optional</p>
      <h2 id="optional-support-heading" className="mt-2 text-2xl font-bold">
        Optional Supportive Products
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/60">
        Home options for this care area. You scroll and choose. Nothing here is selected for your dog.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {care.cards.map((card) => (
          <ProductCard key={card.id} card={card} />
        ))}
        {harness && care.cards.length < 3 ? <ProductCard card={harness} /> : null}
      </div>

      {harness && care.cards.length >= 3 ? (
        <div className="mt-4">
          <ProductCard card={harness} />
        </div>
      ) : null}

      {care.foods.length > 0 && (
        <div className="mt-8">
          <h3 className="text-sm font-bold uppercase tracking-wide text-white/45">Food and daily support</h3>
          <p className="mt-1 text-xs text-white/45">
            Partner buttons stay on the sponsorship page until each product is signed.
          </p>
          <ul className="mt-3 grid gap-3 sm:grid-cols-2">
            {care.foods.map((food) => (
              <li key={food.id} className="rounded-2xl border border-white/10 bg-[#0A1428]/50 p-4">
                <p className="text-[10px] font-bold uppercase tracking-wide text-white/40">Sponsored</p>
                <p className="mt-1 font-bold text-white">{food.title}</p>
                <p className="mt-1 text-sm text-white/55">{food.detail}</p>
                <Link
                  href={SPONSORED_HREF}
                  className="mt-3 inline-flex min-h-[40px] items-center text-sm font-bold text-[#F5C242]"
                >
                  Sponsored
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="mt-6 text-sm">
        <Link href={SPONSORED_HREF} className="font-semibold text-[#F5C242] underline underline-offset-2">
          Read the sponsored page
        </Link>
      </p>
    </section>
  );
}
