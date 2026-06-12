import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { canAccessMatchQueue, ensureUserProfile } from '@/lib/id/profiles';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { getServerUser } from '@/lib/supabase/server';
import EnrollSetupRequired from '../enroll/EnrollSetupRequired';
import ShelterDashboardClient from './ShelterDashboardClient';

export const metadata: Metadata = {
  title: 'Shelter Dashboard • Freedom Paws ID',
  description: 'CA/TN pilot — found-dog intake and match review.',
};

export default async function IdShelterPage() {
  if (!isSupabaseConfigured()) {
    return <EnrollSetupRequired />;
  }

  const user = await getServerUser();
  if (!user) {
    redirect('/login?next=/id/shelter');
  }

  const profile = await ensureUserProfile(user.id, user.email);
  const isReviewer = canAccessMatchQueue(profile.role);

  return (
    <ShelterDashboardClient role={profile.role} isReviewer={isReviewer} />
  );
}
