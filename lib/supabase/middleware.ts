import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { isSupabaseConfigured } from './config';

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

export async function updateSupabaseSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  if (!isSupabaseConfigured()) {
    return response;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!.trim(),
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!.trim(),
    {
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
              headers: request.headers,
            },
          });
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const pathname = request.nextUrl.pathname;
  if (!hasSupabaseAuthCookies(request) && isPublicAnonymousRoute(pathname)) {
    return response;
  }

  await supabase.auth.getUser();
  return response;
}
