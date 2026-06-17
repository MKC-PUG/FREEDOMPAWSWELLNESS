'use client';

import Link from 'next/link';
import Image from 'next/image';
import { LISTING_STATUS_LABELS } from '@/lib/partner/breeds';
import type { AdoptionListingWithShelter } from '@/lib/partner/listings-types';
import { adoptTnListingPath } from '@/lib/site-urls';

type Props = {
  listings: AdoptionListingWithShelter[];
  canManageStatus: boolean;
};

function statusTone(status: string) {
  if (status === 'available') return 'text-emerald-300 border-emerald-500/40 bg-emerald-950/30';
  if (status === 'pending') return 'text-amber-300 border-amber-500/40 bg-amber-950/30';
  if (status === 'draft') return 'text-white/55 border-white/15 bg-white/5';
  return 'text-white/45 border-white/10 bg-white/[0.03]';
}

export default function PartnerListingsClient({ listings, canManageStatus }: Props) {
  return (
    <div className="min-h-screen bg-[#0A1625] text-white font-sans">
      <div className="mx-auto max-w-lg px-6 py-10">
        <header className="mb-8">
          <Link href="/partner" className="text-xs text-emerald-400/80 hover:text-emerald-300">
            ← Partner dashboard
          </Link>
          <h1 className="mt-3 text-2xl font-bold">Adoption listings</h1>
          <p className="mt-2 text-sm text-white/60 leading-relaxed">
            Draft listings are partner-only. Available and pending dogs appear on the public TN
            directory.
          </p>
          <Link
            href="/partner/listings/new"
            className="mt-5 inline-flex min-h-[48px] items-center justify-center rounded-xl bg-emerald-500 px-6 text-sm font-bold text-black touch-manipulation"
          >
            New listing →
          </Link>
        </header>

        {listings.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-sm text-white/55">
            No listings yet. Create your first adoptable dog profile.
          </div>
        ) : (
          <ul className="space-y-4">
            {listings.map((listing) => {
              const publicHref = adoptTnListingPath(listing.shelterSlug, listing.slug);
              const isPublic = listing.status === 'available' || listing.status === 'pending';

              return (
                <li
                  key={listing.id}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] overflow-hidden"
                >
                  <div className="flex gap-4 p-4">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-black/30">
                      {listing.primaryPhotoUrl ? (
                        <Image
                          src={listing.primaryPhotoUrl}
                          alt={listing.displayName}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-[10px] text-white/35">
                          No photo
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h2 className="font-bold text-white truncate">{listing.displayName}</h2>
                        <span
                          className={`shrink-0 rounded-full border px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide ${statusTone(listing.status)}`}
                        >
                          {LISTING_STATUS_LABELS[listing.status] ?? listing.status}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-white/50 truncate">
                        {listing.breedPrimary}
                        {listing.breedSecondary ? ` · ${listing.breedSecondary}` : ''}
                      </p>
                      <p className="mt-1 text-xs text-white/40">{listing.shelterName}</p>
                      <div className="mt-3 flex flex-wrap gap-2 text-xs">
                        <Link
                          href={`/partner/listings/${listing.id}/edit`}
                          className="rounded-lg border border-emerald-500/35 px-3 py-1.5 font-semibold text-emerald-300 hover:bg-emerald-950/40"
                        >
                          Edit
                        </Link>
                        {isPublic ? (
                          <a
                            href={publicHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-lg border border-white/15 px-3 py-1.5 text-white/70 hover:text-white"
                          >
                            Public page ↗
                          </a>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {!canManageStatus ? (
          <p className="mt-6 text-center text-[11px] text-white/40">
            Shelter staff can draft listings. Shelter admin publishes and marks adopted.
          </p>
        ) : null}
      </div>
    </div>
  );
}
