import { cache } from 'react';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { isSupabaseConfigured } from './config';

/** Bound server Auth/DB fetches so RSC pages cannot spin until the function limit. */
const SERVER_FETCH_TIMEOUT_MS = 8_000;

function serverFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const timeoutSignal = AbortSignal.timeout(SERVER_FETCH_TIMEOUT_MS);
  const callerSignal = init?.signal;
  const signal =
    callerSignal && typeof AbortSignal.any === 'function'
      ? AbortSignal.any([callerSignal, timeoutSignal])
      : timeoutSignal;

  return fetch(input, {
    ...init,
    signal,
  });
}

export async function createSupabaseServerClient() {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured');
  }

  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!.trim(),
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!.trim(),
    {
      global: {
        fetch: serverFetch,
      },
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Called from a Server Component — middleware will refresh session.
          }
        },
      },
    }
  );
}

/** Deduped per request — AppChrome + page both call this safely. */
export const getServerUser = cache(async () => {
  if (!isSupabaseConfigured()) return null;
  try {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase.auth.getUser();
    return data.user;
  } catch (error) {
    // Let Next.js static analysis mark the route dynamic; do not swallow it.
    if (
      error instanceof Error &&
      (error.message.includes('Dynamic server usage') ||
        ('digest' in error && error.digest === 'DYNAMIC_SERVER_USAGE'))
    ) {
      throw error;
    }
    console.error('[getServerUser] failed or timed out', error);
    return null;
  }
});
