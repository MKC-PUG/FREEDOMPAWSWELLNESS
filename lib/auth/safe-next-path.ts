/** Decode next= from magic links (handles %2F and double-encoded values). */
export function decodeNextParam(raw: string | null | undefined): string | null {
  if (!raw) return null;
  let decoded = raw.trim();
  for (let i = 0; i < 2; i++) {
    try {
      const next = decodeURIComponent(decoded);
      if (next === decoded) break;
      decoded = next;
    } catch {
      break;
    }
  }
  return decoded;
}

/** Allow only same-origin relative paths after sign-in. */
export function safeNextPath(next: string | null | undefined, fallback = '/mypets'): string {
  const decoded = decodeNextParam(next) ?? next;
  if (!decoded || !decoded.startsWith('/') || decoded.startsWith('//')) {
    return fallback;
  }
  return decoded;
}

export function loginUrlWithError(origin: string, next: string, fallback = '/mypets'): string {
  const safeNext = safeNextPath(next, fallback);
  const params = new URLSearchParams({ error: 'auth', next: safeNext });
  return `${origin}/login?${params.toString()}`;
}
