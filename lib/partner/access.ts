import type { IdUserRole } from '@/lib/id/types';

const PARTNER_ROLES: IdUserRole[] = [
  'shelter_admin',
  'shelter_staff',
  'vet_staff',
  'fp_ops',
];

export function isPartnerRole(role: IdUserRole): boolean {
  return PARTNER_ROLES.includes(role);
}
