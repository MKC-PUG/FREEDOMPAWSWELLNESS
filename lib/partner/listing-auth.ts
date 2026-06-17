import type { IdUserRole } from '@/lib/id/types';
import type { UserProfile } from '@/lib/id/profiles';

const LISTING_ROLES: IdUserRole[] = ['shelter_admin', 'shelter_staff', 'fp_ops'];

export function canManageListings(role: IdUserRole): boolean {
  return LISTING_ROLES.includes(role);
}

/** Publish, pending, adopted, archived — shelter admin + fp_ops only. */
export function canChangeListingStatus(role: IdUserRole): boolean {
  return role === 'shelter_admin' || role === 'fp_ops';
}

export function resolveListingShelterId(
  profile: UserProfile,
  requestedShelterId: string | undefined
): string | null {
  if (profile.role === 'fp_ops') {
    return requestedShelterId?.trim() || profile.shelterId;
  }
  return profile.shelterId;
}

export function assertShelterAccess(profile: UserProfile, shelterId: string): boolean {
  if (profile.role === 'fp_ops') return true;
  return profile.shelterId === shelterId;
}
