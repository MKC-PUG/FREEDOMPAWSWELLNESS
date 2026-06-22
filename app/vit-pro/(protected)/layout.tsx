import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { canAccessVitPro } from '@/lib/vit-pro/access';
import { ensureUserProfile } from '@/lib/id/profiles';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { getServerUser } from '@/lib/supabase/server';
import EnrollSetupRequired from '@/app/id/enroll/EnrollSetupRequired';

export const metadata: Metadata = {
  title: 'ViT Pro CDS • Freedom Paws',
  description: 'Veterinary clinical decision support — literature-cited photo and video intake reports.',
  robots: { index: false, follow: false },
};

export default async function VitProProtectedLayout({ children }: { children: React.ReactNode }) {
  if (!isSupabaseConfigured()) {
    return <EnrollSetupRequired />;
  }

  const user = await getServerUser();
  if (!user) {
    redirect('/login?next=/vit-pro');
  }

  const profile = await ensureUserProfile(user.id, user.email);
  if (!canAccessVitPro(profile.role, user.email)) {
    redirect('/mypets?vit_pro=denied');
  }

  return <>{children}</>;
}
