import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { isSupabaseConfigured } from './config';

/** Keep well under Vercel's ~25s middleware limit so a hung Auth call cannot 504 the app. */
const AUTH_FETCH_TIMEOUT_MS = 4_000;

/** Routes that skip session refresh when the user has no auth cookies (faster TTFB). */
const PUBLIC_ANON_PREFIXES = [
  '/protocols',
  '/wellness',
  '/token-shop',
  '/waitlist',
  '/terms',
  '/privacy',
  '/photobooth',
  '/monitor',
  '/diagnostics',
  '/adopt',
  '/grants',
  '/partners',
  '/auth/callback',
  '/login',
  '/id',
] as const;

function hasSupabaseAuthCookies(request: NextRequest): boolean {
  return request.cookies.getAll().some(
    (c) => c.name.includes('-auth-token') || c.name.startsWith('sb-')
  );
}

function isPublicAnonymousRoute(pathname: string): boolean {
  if (pathname === '/') return true;
  return PUBLIC_ANON_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

function authFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const timeoutSignal = AbortSignal.timeout(AUTH_FETCH_TIMEOUT_MS);
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

export async function updateSupabaseSession(
  request: NextRequest,
  requestHeaders?: Headers
) {
  const headersForNext = requestHeaders ?? request.headers;
  let response = NextResponse.next({
    request: {
      headers: headersForNext,
    },
  });

  if (!isSupabaseConfigured()) {
    return response;
  }

  const pathname = request.nextUrl.pathname;
  if (!hasSupabaseAuthCookies(request) && isPublicAnonymousRoute(pathname)) {
    return response;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!.trim(),
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!.trim(),
    {
      global: {
        fetch: authFetch,
      },
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });
          response = NextResponse.next({
            request: {
              headers: headersForNext,
            },
          });
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  try {
    await supabase.auth.getUser();
  } catch (error) {
    // Fail open: never block page load on Auth latency/outage (Safari/PWA 504s).
    console.error('[middleware] Supabase getUser failed or timed out', error);
  }

  return response;
}
