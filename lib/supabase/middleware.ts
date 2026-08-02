import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { isSupabaseConfigured } from './config';

/** Keep well under Vercel's ~25s middleware limit so a hung Auth call cannot 504 the app. */
const AUTH_FETCH_TIMEOUT_MS = 3_000;

/**
 * Public shell routes — never block on Auth refresh (even with cookies).
 * PWA start_url is `/`; Safari was 504ing when getUser stalled with a session cookie.
 */
const PUBLIC_SHELL_PREFIXES = [
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

function isPublicShellRoute(pathname: string): boolean {
  if (pathname === '/') return true;
  return PUBLIC_SHELL_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

function hasSupabaseAuthCookies(request: NextRequest): boolean {
  return request.cookies.getAll().some(
    (c) => c.name.includes('-auth-token') || c.name.startsWith('sb-')
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

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(label)), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      }
    );
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

  // Home / marketing / public tools must never wait on Supabase Auth.
  if (isPublicShellRoute(pathname)) {
    return response;
  }

  // Protected routes without a session cookie: skip network refresh.
  if (!hasSupabaseAuthCookies(request)) {
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
    await withTimeout(
      supabase.auth.getUser(),
      AUTH_FETCH_TIMEOUT_MS,
      'Supabase getUser timed out'
    );
  } catch (error) {
    // Fail open: never block page load on Auth latency/outage (Safari/PWA 504s).
    console.error('[middleware] Supabase getUser failed or timed out', error);
  }

  return response;
}
