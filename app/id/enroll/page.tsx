import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { getServerUser } from '@/lib/supabase/server';
import EnrollSetupRequired from './EnrollSetupRequired';
import EnrollWizardClient from './EnrollWizardClient';

export const metadata: Metadata = {
  title: 'Enroll Biometric ID • Freedom Paws ID',
  description: 'Multi-step biometric enrollment — pet select, consent, eyes, face, body.',
};

export default async function IdEnrollPage({
  searchParams,
}: {
  searchParams: Promise<{ petId?: string; focusRegion?: string; fromVit?: string }>;
}) {
  if (!isSupabaseConfigured()) {
    return <EnrollSetupRequired />;
  }

  const user = await getServerUser();
  if (!user) {
    redirect('/login?next=/id/enroll');
  }

  const params = await searchParams;
  const initialPetId = params.petId?.trim() || null;
  const initialFocusRegion = params.focusRegion?.trim() || null;
  const fromVit = params.fromVit === '1';

  return (
    <EnrollWizardClient
      userEmail={user.email ?? 'your account'}
      initialPetId={initialPetId}
      initialFocusRegion={initialFocusRegion}
      fromVit={fromVit}
    />
  );
}
