import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPartnerOrgBySlug } from '@/lib/partner/orgs-server';
import { listPublicListingsForShelter } from '@/lib/partner/listings-server';
import { adoptTnPath } from '@/lib/site-urls';
import AdoptListingCard from '../../AdoptListingCard';

type Props = { params: Promise<{ shelterSlug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { shelterSlug } = await params;
  const org = await getPartnerOrgBySlug(shelterSlug);
  return {
    title: org
      ? `Adopt from ${org.name} • Freedom Paws Adoption Network`
      : 'Shelter not found',
  };
}

export default async function AdoptShelterPage({ params }: Props) {
  const { shelterSlug } = await params;
  const org = await getPartnerOrgBySlug(shelterSlug);
  if (!org || !org.listingsEnabled) notFound();

  let listings: Awaited<ReturnType<typeof listPublicListingsForShelter>> = [];
  try {
    listings = await listPublicListingsForShelter(shelterSlug);
  } catch {
    listings = [];
  }

  return (
    <div className="min-h-screen bg-[#0A1428] text-white">
      <div className="mx-auto max-w-6xl px-6 py-10 sm:py-14">
        <Link href={adoptTnPath()} className="text-xs text-emerald-400/80 hover:text-emerald-300">
          ← Tennessee directory
        </Link>

        <header className="mt-4 mb-10">
          <h1 className="text-3xl font-bold">{org.name}</h1>
          <p className="mt-2 text-sm text-white/60">
            {[org.city, org.county ? `${org.county} County` : null, 'TN']
              .filter(Boolean)
              .join(' · ')}
          </p>
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            {org.phone ? (
              <a href={`tel:${org.phone}`} className="text-emerald-300 hover:underline">
                {org.phone}
              </a>
            ) : null}
            {org.website ? (
              <a
                href={org.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-white"
              >
                Website ↗
              </a>
            ) : null}
          </div>
        </header>

        {listings.length === 0 ? (
          <p className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-white/55">
            No adoptable listings published yet. Check the full{' '}
            <Link href={adoptTnPath()} className="text-emerald-400 hover:underline">
              TN directory
            </Link>
            .
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((listing) => (
              <AdoptListingCard key={listing.id} listing={listing} showShelter={false} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
