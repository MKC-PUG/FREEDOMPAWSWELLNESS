import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { canChangeListingStatus, canManageListings } from '@/lib/partner/listing-auth';
import { getListingById } from '@/lib/partner/listings-server';
import { listTnPilotPartners } from '@/lib/partner/orgs-server';
import { ensureUserProfile } from '@/lib/id/profiles';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { getServerUser } from '@/lib/supabase/server';
import EnrollSetupRequired from '../../../../id/enroll/EnrollSetupRequired';
import ListingFormClient from '../../ListingFormClient';

export const metadata: Metadata = {
  title: 'Edit Listing • Freedom Paws Adoption Network',
};

type Props = { params: Promise<{ id: string }> };

export default async function EditListingPage({ params }: Props) {
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

  const { id } = await params;
  const listing = await getListingById(id, profile);
  if (!listing) notFound();

  const partners = await listTnPilotPartners();

  return (
    <ListingFormClient
      mode="edit"
      listing={listing}
      partners={partners}
      defaultShelterId={profile.shelterId}
      canChangeStatus={canChangeListingStatus(profile.role)}
      isFpOps={profile.role === 'fp_ops'}
    />
  );
}
