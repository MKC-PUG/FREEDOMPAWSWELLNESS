import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { canChangeListingStatus, canManageListings } from '@/lib/partner/listing-auth';
import { listTnPilotPartners } from '@/lib/partner/orgs-server';
import { ensureUserProfile } from '@/lib/id/profiles';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { getServerUser } from '@/lib/supabase/server';
import EnrollSetupRequired from '../../../id/enroll/EnrollSetupRequired';
import ListingFormClient from '../ListingFormClient';

export const metadata: Metadata = {
  title: 'New Listing • Freedom Paws Adoption Network',
};

export default async function NewListingPage() {
  if (!isSupabaseConfigured()) {
    return <EnrollSetupRequired />;
  }

  const user = await getServerUser();
  if (!user) {
    redirect('/login?next=/partner/listings/new');
  }

  const profile = await ensureUserProfile(user.id, user.email);
  if (!canManageListings(profile.role)) {
    redirect('/partner');
  }

  const partners = await listTnPilotPartners();

  return (
    <ListingFormClient
      mode="create"
      partners={partners}
      defaultShelterId={profile.shelterId}
      canChangeStatus={canChangeListingStatus(profile.role)}
      isFpOps={profile.role === 'fp_ops'}
    />
  );
}
