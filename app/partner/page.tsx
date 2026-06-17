import type { Metadata } from 'next';
import { canAccessMatchQueue, ensureUserProfile } from '@/lib/id/profiles';
import { getShelterDashboardStats } from '@/lib/id/shelter-stats';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { listTnPilotPartners } from '@/lib/partner/orgs-server';
import type { PartnerOrg } from '@/lib/partner/types';
import { getServerUser } from '@/lib/supabase/server';
import PartnerDashboardClient from './PartnerDashboardClient';
import EnrollSetupRequired from '../id/enroll/EnrollSetupRequired';

export const metadata: Metadata = {
  title: 'Partner Dashboard • Freedom Paws Adoption Network',
  description: 'Tennessee pilot — shelter intake, adoption listings, and ID tools.',
};

export default async function PartnerDashboardPage() {
  if (!isSupabaseConfigured()) {
    return <EnrollSetupRequired />;
  }

  let partners: PartnerOrg[] = [];
  try {
    partners = await listTnPilotPartners();
  } catch {
    partners = [];
  }

  const user = await getServerUser();
  if (!user) {
    return (
      <PartnerDashboardClient
        signedIn={false}
        partners={partners}
        role={null}
        isReviewer={false}
        stats={null}
        shelterName={null}
      />
    );
  }

  const profile = await ensureUserProfile(user.id, user.email);
  const isReviewer = canAccessMatchQueue(profile.role);

  let stats = null;
  if (isReviewer) {
    try {
      stats = await getShelterDashboardStats();
    } catch {
      stats = null;
    }
  }

  let shelterName: string | null = null;
  if (profile.shelterId && partners.length > 0) {
    shelterName = partners.find((p) => p.id === profile.shelterId)?.name ?? null;
  }

  return (
    <PartnerDashboardClient
      signedIn
      userEmail={user.email ?? ''}
      partners={partners}
      role={profile.role}
      isReviewer={isReviewer}
      stats={stats}
      shelterName={shelterName}
    />
  );
}
