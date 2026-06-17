import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ADOPTION_AGE_BANDS,
  ADOPTION_SEX_OPTIONS,
  ADOPTION_SIZES,
  LISTING_STATUS_LABELS,
} from '@/lib/partner/breeds';
import { getPublicListing } from '@/lib/partner/listings-server';
import { adoptTnPath } from '@/lib/site-urls';

type Props = { params: Promise<{ shelterSlug: string; listingSlug: string }> };

function labelFor<T extends { value: string; label: string }>(
  options: readonly T[],
  value: string
) {
  return options.find((o) => o.value === value)?.label ?? value;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { shelterSlug, listingSlug } = await params;
  const listing = await getPublicListing(shelterSlug, listingSlug);
  return {
    title: listing
      ? `${listing.displayName} • ${listing.shelterName}`
      : 'Listing not found',
    description: listing?.bio?.slice(0, 160),
  };
}

export default async function AdoptListingDetailPage({ params }: Props) {
  const { shelterSlug, listingSlug } = await params;
  const listing = await getPublicListing(shelterSlug, listingSlug);
  if (!listing) notFound();

  const pending = listing.status === 'pending';
  const photos =
    listing.photoUrls.length > 0
      ? listing.photoUrls
      : listing.primaryPhotoUrl
        ? [listing.primaryPhotoUrl]
        : [];

  return (
    <div className="min-h-screen bg-[#0A1428] text-white">
      <div className="mx-auto max-w-3xl px-6 py-10">
        <Link
          href={adoptTnPath(shelterSlug)}
          className="text-xs text-emerald-400/80 hover:text-emerald-300"
        >
          ← {listing.shelterName}
        </Link>

        <header className="mt-4">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold">{listing.displayName}</h1>
            {pending ? (
              <span className="rounded-full border border-amber-400/50 bg-amber-950/50 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-200">
                {LISTING_STATUS_LABELS.pending}
              </span>
            ) : null}
          </div>
          <p className="mt-2 text-white/65">
            {listing.breedPrimary}
            {listing.breedSecondary ? ` · ${listing.breedSecondary}` : ''}
          </p>
        </header>

        {photos.length > 0 ? (
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {photos.map((url, i) => (
              <div
                key={url}
                className={`relative overflow-hidden rounded-2xl border border-white/10 bg-black/20 ${
                  i === 0 ? 'sm:col-span-2 aspect-[16/10]' : 'aspect-square'
                }`}
              >
                <Image
                  src={url}
                  alt={`${listing.displayName} photo ${i + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 672px"
                  className="object-cover"
                  priority={i === 0}
                />
              </div>
            ))}
          </div>
        ) : null}

        <dl className="mt-8 grid grid-cols-2 gap-4 rounded-2xl border border-white/10 bg-[#16223C] p-5 text-sm sm:grid-cols-4">
          <div>
            <dt className="text-[10px] uppercase tracking-wide text-white/45">Sex</dt>
            <dd className="mt-1 font-medium">{labelFor(ADOPTION_SEX_OPTIONS, listing.sex)}</dd>
          </div>
          <div>
            <dt className="text-[10px] uppercase tracking-wide text-white/45">Age</dt>
            <dd className="mt-1 font-medium">{labelFor(ADOPTION_AGE_BANDS, listing.ageBand)}</dd>
          </div>
          <div>
            <dt className="text-[10px] uppercase tracking-wide text-white/45">Size</dt>
            <dd className="mt-1 font-medium">
              {labelFor(ADOPTION_SIZES, listing.size ?? 'unknown')}
            </dd>
          </div>
          <div>
            <dt className="text-[10px] uppercase tracking-wide text-white/45">Shelter</dt>
            <dd className="mt-1 font-medium">{listing.shelterName}</dd>
          </div>
        </dl>

        {listing.bio ? (
          <section className="mt-8">
            <h2 className="text-sm font-bold uppercase tracking-wide text-white/50">About</h2>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-white/80">
              {listing.bio}
            </p>
          </section>
        ) : null}

        <section className="mt-10 rounded-2xl border border-emerald-500/25 bg-emerald-950/20 p-6">
          <h2 className="text-sm font-bold text-emerald-300">Ready to adopt?</h2>
          <p className="mt-2 text-sm text-white/70 leading-relaxed">
            Contact {listing.shelterName} directly to start the adoption process. Freedom Paws lists
            dogs on behalf of pilot partners but does not handle adoptions.
          </p>
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            {listing.shelterPhone ? (
              <a
                href={`tel:${listing.shelterPhone}`}
                className="inline-flex min-h-[44px] items-center rounded-xl bg-emerald-500 px-5 font-bold text-black"
              >
                Call shelter
              </a>
            ) : null}
            {listing.shelterWebsite ? (
              <a
                href={listing.shelterWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center rounded-xl border border-white/20 px-5 text-white/85"
              >
                Shelter website ↗
              </a>
            ) : null}
          </div>
        </section>
      </div>
    </div>
  );
}
