'use client';

import { GUEST_ID_HEADER } from './ai-credits-config';

const STORAGE_KEY = 'fp_ai_guest_id';

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/** Stable anonymous id for AI credit metering (stored on device). */
export function getOrCreateGuestId(): string {
  if (typeof window === 'undefined') return '';
  try {
    let id = localStorage.getItem(STORAGE_KEY);
    if (!id || !UUID_RE.test(id)) {
      id = crypto.randomUUID();
      localStorage.setItem(STORAGE_KEY, id);
    }
    return id;
  } catch {
    return '';
  }
}

export function aiCreditFetchInit(): RequestInit {
  const guestId = getOrCreateGuestId();
  const headers: Record<string, string> = {};
  if (guestId) headers[GUEST_ID_HEADER] = guestId;
  return { headers, credentials: 'same-origin' as RequestCredentials };
}
