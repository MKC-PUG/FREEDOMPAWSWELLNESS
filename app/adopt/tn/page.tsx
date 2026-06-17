import type { Metadata } from 'next';
import Link from 'next/link';
import {
  listPublicTnListings,
  listPublicTnSheltersWithCounts,
} from '@/lib/partner/listings-server';
import { adoptTnPath } from '@/lib/site-urls';
import AdoptListingCard from '../AdoptListingCard';

export const metadata: Metadata = {
  title: 'Adopt in Tennessee • Freedom Paws Adoption Network',
  description:
    'Browse adoptable dogs from Tennessee municipal shelters and private rescues in the Freedom Paws pilot.',
};

export default async function AdoptTnPage() {
  let shelters: Awaited<ReturnType<typeof listPublicTnSheltersWithCounts>> = [];
  let listings: Awaited<ReturnType<typeof listPublicTnListings>> = [];

  try {
    [shelters, listings] = await Promise.all([
      listPublicTnSheltersWithCounts(),
      listPublicTnListings(),
    ]);
  } catch {
    shelters = [];
    listings = [];
  }

  return (
    <div className="min-h-screen bg-[#0A1428] text-white">
      <div className="mx-auto max-w-6xl px-6 py-10 sm:py-14">
        <header className="mb-10 text-center max-w-2xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
            Freedom Paws Adoption Network
          </p>
          <h1 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">
            Adopt in Tennessee
          </h1>
          <p className="mt-4 text-sm sm:text-base text-white/70 leading-relaxed">
            Pilot directory — adoptable dogs from partner municipal shelters and private rescues
            near Lebanon, Nashville, Memphis, Knoxville, and Sumner County.
          </p>
        </header>

        <section className="mb-12">
          <h2 className="text-sm font-bold uppercase tracking-wide text-white/50 mb-4">
            Partner organizations ({shelters.length})
          </h2>
          {shelters.length === 0 ? (
            <p className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-white/55">
              Listings will appear here once partners publish adoptable dogs.
            </p>
          ) : (
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {shelters.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={adoptTnPath(s.slug)}
                    className="block rounded-xl border border-white/10 bg-[#16223C] px-4 py-4 hover:border-emerald-500/35 transition-colors"
                  >
                    <p className="font-semibold text-white">{s.name}</p>
                    {s.city ? <p className="mt-1 text-xs text-white/50">{s.city}, TN</p> : null}
                    <p className="mt-2 text-xs text-emerald-400/90">
                      {s.listingCount === 0
                        ? 'No listings yet'
                        : `${s.listingCount} adoptable ${s.listingCount === 1 ? 'dog' : 'dogs'}`}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <h2 className="text-sm font-bold uppercase tracking-wide text-white/50 mb-4">
            All adoptable dogs ({listings.length})
          </h2>
          {listings.length === 0 ? (
            <p className="text-sm text-white/50">Check back soon for new listings.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {listings.map((listing) => (
                <AdoptListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </section>

        <p className="mt-12 text-center text-[11px] text-white/40 leading-relaxed">
          Interested in adopting? Contact the shelter listed on each dog&apos;s profile.
          Freedom Paws does not process adoptions directly.
        </p>
      </div>
    </div>
  );
}
