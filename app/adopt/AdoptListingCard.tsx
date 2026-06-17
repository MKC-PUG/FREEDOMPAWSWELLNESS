import Image from 'next/image';
import Link from 'next/link';
import { LISTING_STATUS_LABELS } from '@/lib/partner/breeds';
import type { AdoptionListingWithShelter } from '@/lib/partner/listings-types';
import { adoptTnListingPath } from '@/lib/site-urls';

type Props = {
  listing: AdoptionListingWithShelter;
  showShelter?: boolean;
};

export default function AdoptListingCard({ listing, showShelter = true }: Props) {
  const href = adoptTnListingPath(listing.shelterSlug, listing.slug);
  const pending = listing.status === 'pending';

  return (
    <Link
      href={href}
      className="group block overflow-hidden rounded-2xl border border-white/10 bg-[#16223C] hover:border-emerald-500/35 transition-colors"
    >
      <div className="relative aspect-[4/3] bg-black/30">
        {listing.primaryPhotoUrl ? (
          <Image
            src={listing.primaryPhotoUrl}
            alt={listing.displayName}
            fill
            sizes="(max-width: 640px) 100vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-white/35">Photo coming soon</div>
        )}
        {pending ? (
          <span className="absolute left-3 top-3 rounded-full border border-amber-400/50 bg-amber-950/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-200">
            {LISTING_STATUS_LABELS.pending}
          </span>
        ) : null}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-white">{listing.displayName}</h3>
        <p className="mt-1 text-sm text-white/60">
          {listing.breedPrimary}
          {listing.breedSecondary ? ` · ${listing.breedSecondary}` : ''}
        </p>
        {showShelter ? (
          <p className="mt-2 text-xs text-emerald-400/90">{listing.shelterName}</p>
        ) : null}
      </div>
    </Link>
  );
}
