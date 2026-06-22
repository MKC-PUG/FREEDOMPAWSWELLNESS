import type { IdUserRole } from '@/lib/id/types';

function parseAdvisorEmails(): Set<string> {
  const raw = process.env.VIT_PRO_ADVISOR_EMAILS ?? '';
  return new Set(
    raw
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean)
  );
}

/** Phase V0 — fp_ops, vet_staff, or allowlisted advisor emails. */
export function canAccessVitPro(role: IdUserRole, email?: string | null): boolean {
  if (role === 'fp_ops' || role === 'vet_staff') return true;
  if (email && parseAdvisorEmails().has(email.toLowerCase())) return true;
  return false;
}

export function isVitProEnabled(): boolean {
  const flag = process.env.VIT_PRO_ENABLED?.trim().toLowerCase();
  if (flag === 'false' || flag === '0') return false;
  return true;
}
