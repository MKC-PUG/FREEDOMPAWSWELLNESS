import type { Metadata } from 'next';
import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import {
  canAccessMatchQueue,
  canReviewMatches,
  ensureUserProfile,
} from '@/lib/id/profiles';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { getServerUser } from '@/lib/supabase/server';
import MatchReviewClient from './MatchReviewClient';
import EnrollSetupRequired from '../enroll/EnrollSetupRequired';

export const metadata: Metadata = {
  title: 'Match Review • Freedom Paws ID',
  description: 'Shelter match candidate review — human approval before owner contact.',
};

export default async function IdMatchPage() {
  if (!isSupabaseConfigured()) {
    return <EnrollSetupRequired />;
  }

  const user = await getServerUser();
  if (!user) {
    redirect('/login?next=/id/match');
  }

  const profile = await ensureUserProfile(user.id, user.email);
  if (!canAccessMatchQueue(profile.role)) {
    redirect('/id/found');
  }

  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0A1625] text-white p-10">Loading…</div>}>
      <MatchReviewClient canDecide={canReviewMatches(profile.role)} />
    </Suspense>
  );
}
