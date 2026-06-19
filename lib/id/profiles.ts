import type { IdUserRole } from '@/lib/id/types';
import { createSupabaseServerClient } from '@/lib/supabase/server';

const REVIEWER_ROLES: IdUserRole[] = ['shelter_admin', 'shelter_staff', 'fp_ops'];
const MATCH_REVIEW_ROLES: IdUserRole[] = ['shelter_admin', 'fp_ops'];

export type UserProfile = {
  id: string;
  role: IdUserRole;
  shelterId: string | null;
  displayName: string | null;
};

function parseOpsEmails(): Set<string> {
  const raw = process.env.FP_OPS_EMAILS ?? process.env.FP_OPS_EMAIL ?? '';
  return new Set(
    raw
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean)
  );
}

function defaultRoleForEmail(email: string | undefined): IdUserRole {
  if (email && parseOpsEmails().has(email.toLowerCase())) {
    return 'fp_ops';
  }
  return 'owner';
}

export async function ensureUserProfile(
  userId: string,
  email?: string | null
): Promise<UserProfile> {
  const supabase = await createSupabaseServerClient();
  const { data: existing } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (existing) {
    return {
      id: existing.id as string,
      role: existing.role as IdUserRole,
      shelterId: (existing.shelter_id as string) ?? null,
      displayName: (existing.display_name as string) ?? null,
    };
  }

  const role = defaultRoleForEmail(email ?? undefined);
  const { data, error } = await supabase
    .from('user_profiles')
    .insert({ id: userId, role })
    .select('*')
    .single();

  if (error) throw error;

  return {
    id: data.id as string,
    role: data.role as IdUserRole,
    shelterId: (data.shelter_id as string) ?? null,
    displayName: (data.display_name as string) ?? null,
  };
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from('user_profiles').select('*').eq('id', userId).maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return {
    id: data.id as string,
    role: data.role as IdUserRole,
    shelterId: (data.shelter_id as string) ?? null,
    displayName: (data.display_name as string) ?? null,
  };
}

export function canAccessMatchQueue(role: IdUserRole): boolean {
  return REVIEWER_ROLES.includes(role);
}

export function canReviewMatches(role: IdUserRole): boolean {
  return MATCH_REVIEW_ROLES.includes(role);
}

export function canFpOps(role: IdUserRole): boolean {
  return role === 'fp_ops';
}

export function canSubmitFoundReport(role: IdUserRole): boolean {
  return ['owner', 'shelter_admin', 'shelter_staff', 'fp_ops'].includes(role);
}
