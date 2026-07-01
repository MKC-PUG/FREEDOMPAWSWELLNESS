import type { Metadata } from 'next';
import Link from 'next/link';
import {
  listPublicTnListings,
  listPublicTnSheltersWithCounts,
} from '@/lib/partner/listings-server';
import { adoptTnPath } from '@/lib/site-urls';
import PageShell from '@/app/components/ui/PageShell';
import PageHeader from '@/app/components/ui/PageHeader';
import SectionCard from '@/app/components/ui/SectionCard';
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
    <PageShell maxWidth="6xl">
      <PageHeader
        center
        eyebrow="Freedom Paws Adoption Network"
        eyebrowVariant="emerald"
        title="Adopt in Tennessee"
        subtitle="Pilot directory — adoptable dogs from partner municipal shelters and private rescues near Lebanon, Nashville, Memphis, Knoxville, and Sumner County."
      />

        <section className="mb-12">
          <h2 className="text-sm font-bold uppercase tracking-wide text-white/50 mb-4">
            Partner organizations ({shelters.length})
          </h2>
          {shelters.length === 0 ? (
            <SectionCard variant="glass">
              <p className="text-sm text-white/55">
                Listings will appear here once partners publish adoptable dogs.
              </p>
            </SectionCard>
          ) : (
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {shelters.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={adoptTnPath(s.slug)}
                    className="block rounded-2xl border border-white/10 bg-[#16223C] px-4 py-4 hover:border-emerald-500/35 transition-colors touch-manipulation"
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
    </PageShell>
  );
}
