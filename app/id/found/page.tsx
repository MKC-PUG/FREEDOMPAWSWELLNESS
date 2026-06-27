import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { canAccessMatchQueue, ensureUserProfile } from '@/lib/id/profiles';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { getServerUser } from '@/lib/supabase/server';
import FoundIntakeClient from './FoundIntakeClient';
import EnrollSetupRequired from '../enroll/EnrollSetupRequired';

export const metadata: Metadata = {
  title: 'Report Found Dog • Freedom Paws ID',
  description: 'Shelter found-dog intake — Tennessee pilot with biometric match search.',
};

export default async function IdFoundPage() {
  if (!isSupabaseConfigured()) {
    return <EnrollSetupRequired />;
  }

  const user = await getServerUser();
  if (!user) {
    redirect('/login?next=/id/found');
  }

  const profile = await ensureUserProfile(user.id, user.email);

  return (
    <FoundIntakeClient
      userEmail={user.email ?? 'your account'}
      canReview={canAccessMatchQueue(profile.role)}
    />
  );
}
