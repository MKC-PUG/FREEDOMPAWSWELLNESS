import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { canChangeListingStatus, canManageListings } from '@/lib/partner/listing-auth';
import { listPartnerListings } from '@/lib/partner/listings-server';
import type { AdoptionListingWithShelter } from '@/lib/partner/listings-types';
import { ensureUserProfile } from '@/lib/id/profiles';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { getServerUser } from '@/lib/supabase/server';
import EnrollSetupRequired from '../../id/enroll/EnrollSetupRequired';
import PartnerListingsClient from './PartnerListingsClient';

export const metadata: Metadata = {
  title: 'Adoption Listings • Freedom Paws Adoption Network',
  description: 'Manage adoptable dog listings for the Tennessee pilot.',
};

export default async function PartnerListingsPage() {
  if (!isSupabaseConfigured()) {
    return <EnrollSetupRequired />;
  }

  const user = await getServerUser();
  if (!user) {
    redirect('/login?next=/partner/listings');
  }

  const profile = await ensureUserProfile(user.id, user.email);
  if (!canManageListings(profile.role)) {
    redirect('/partner');
  }

  let listings: AdoptionListingWithShelter[] = [];
  try {
    listings = await listPartnerListings(profile);
  } catch {
    listings = [];
  }

  return (
    <PartnerListingsClient
      listings={listings}
      canManageStatus={canChangeListingStatus(profile.role)}
    />
  );
}
