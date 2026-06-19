/** Allow only same-origin relative paths after sign-in. */
export function safeNextPath(next: string | null | undefined, fallback = '/mypets'): string {
  if (!next || !next.startsWith('/') || next.startsWith('//')) {
    return fallback;
  }
  return next;
}

export function loginUrlWithError(origin: string, next: string, fallback = '/mypets'): string {
  const safeNext = safeNextPath(next, fallback);
  const params = new URLSearchParams({ error: 'auth', next: safeNext });
  return `${origin}/login?${params.toString()}`;
}
