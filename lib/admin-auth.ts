import { createHmac, timingSafeEqual } from 'crypto';

export const ADMIN_SESSION_COOKIE = 'fp-admin-session';
const SESSION_PAYLOAD = 'freedom-paws-admin-v1';

export function isAdminConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD?.trim());
}

export function createAdminSessionToken(): string {
  const password = process.env.ADMIN_PASSWORD?.trim();
  if (!password) {
    throw new Error('ADMIN_PASSWORD is not configured');
  }
  return createHmac('sha256', password).update(SESSION_PAYLOAD).digest('hex');
}

export function verifyAdminSessionToken(token: string | undefined): boolean {
  const password = process.env.ADMIN_PASSWORD?.trim();
  if (!password || !token) return false;

  try {
    const expected = createAdminSessionToken();
    if (token.length !== expected.length) return false;
    return timingSafeEqual(Buffer.from(token), Buffer.from(expected));
  } catch {
    return false;
  }
}

export function verifyAdminPassword(candidate: string): boolean {
  const password = process.env.ADMIN_PASSWORD?.trim();
  if (!password) return false;
  if (candidate.length !== password.length) return false;
  try {
    return timingSafeEqual(Buffer.from(candidate), Buffer.from(password));
  } catch {
    return false;
  }
}
