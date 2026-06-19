import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { canFpOps, ensureUserProfile } from '@/lib/id/profiles';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { getServerUser } from '@/lib/supabase/server';
import EnrollSetupRequired from '@/app/id/enroll/EnrollSetupRequired';

export const metadata: Metadata = {
  title: 'Command Center • Freedom Paws Ops',
  description: 'Owner command center — adoption, marketing, shelter ID, wellness, product, and system.',
  robots: { index: false, follow: false },
};

export default async function OpsProtectedLayout({ children }: { children: React.ReactNode }) {
  if (!isSupabaseConfigured()) {
    return <EnrollSetupRequired />;
  }

  const user = await getServerUser();
  if (!user) {
    redirect('/login?next=/ops');
  }

  const profile = await ensureUserProfile(user.id, user.email);
  if (!canFpOps(profile.role)) {
    redirect('/mypets');
  }

  return <>{children}</>;
}
