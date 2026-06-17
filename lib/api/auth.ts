import { NextResponse } from 'next/server';
import type { IdUserRole } from '@/lib/id/types';
import {
  canAccessMatchQueue,
  canReviewMatches,
  canSubmitFoundReport,
  ensureUserProfile,
  type UserProfile,
} from '@/lib/id/profiles';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { getServerUser } from '@/lib/supabase/server';
import { canManageListings } from '@/lib/partner/listing-auth';

export function supabaseNotConfiguredResponse() {
  return NextResponse.json(
    {
      success: false,
      error:
        'Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local.',
    },
    { status: 503 }
  );
}

export async function requireApiUser() {
  if (!isSupabaseConfigured()) {
    return { user: null, error: supabaseNotConfiguredResponse() };
  }

  const user = await getServerUser();
  if (!user) {
    return {
      user: null,
      error: NextResponse.json(
        { success: false, error: 'Sign in required.' },
        { status: 401 }
      ),
    };
  }

  return { user, error: null };
}

export async function requireApiUserWithProfile() {
  const { user, error } = await requireApiUser();
  if (error) return { user: null, profile: null, error };

  const profile = await ensureUserProfile(user!.id, user!.email);
  return { user: user!, profile, error: null };
}

export function forbiddenResponse(message = 'Not authorized.') {
  return NextResponse.json({ success: false, error: message }, { status: 403 });
}

export async function requireMatchReviewer() {
  const { user, profile, error } = await requireApiUserWithProfile();
  if (error) return { user: null, profile: null, error };
  if (!canAccessMatchQueue(profile!.role)) {
    return { user: null, profile: null, error: forbiddenResponse('Match queue access required.') };
  }
  return { user, profile, error: null };
}

export async function requireMatchDecider() {
  const { user, profile, error } = await requireApiUserWithProfile();
  if (error) return { user: null, profile: null, error };
  if (!canReviewMatches(profile!.role)) {
    return {
      user: null,
      profile: null,
      error: forbiddenResponse('Shelter admin or FP ops required to approve matches.'),
    };
  }
  return { user, profile, error: null };
}

export async function requireFoundReporter() {
  const { user, profile, error } = await requireApiUserWithProfile();
  if (error) return { user: null, profile: null, error };
  if (!canSubmitFoundReport(profile!.role)) {
    return { user: null, profile: null, error: forbiddenResponse('Cannot submit found-dog reports.') };
  }
  return { user, profile, error: null };
}

export function hasRole(profile: UserProfile, roles: IdUserRole[]) {
  return roles.includes(profile.role);
}

export async function requirePartnerStaff() {
  const { user, profile, error } = await requireApiUserWithProfile();
  if (error) return { user: null, profile: null, error };
  if (!canManageListings(profile!.role)) {
    return {
      user: null,
      profile: null,
      error: forbiddenResponse('Shelter partner access required for adoption listings.'),
    };
  }
  return { user, profile, error: null };
}
