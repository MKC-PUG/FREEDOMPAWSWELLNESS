import { NextResponse, NextRequest } from 'next/server';
import { FP_SURFACE_HEADER, surfaceFromRequest, PARTNER_PATH_PREFIX } from '@/lib/partner/surface';
import { updateSupabaseSession } from '@/lib/supabase/middleware';

/** Absolute ceiling so middleware always returns before Vercel's ~25s hard kill. */
const MIDDLEWARE_BUDGET_MS = 5_000;

export async function middleware(request: NextRequest) {
  const host = request.headers.get('host') ?? '';
  const pathname = request.nextUrl.pathname;
  const surface = surfaceFromRequest(host, pathname);

  if (pathname === '/' && request.nextUrl.searchParams.has('code')) {
    const url = request.nextUrl.clone();
    url.pathname = '/auth/callback';
    if (!url.searchParams.has('next')) {
      url.searchParams.set('next', surface === 'partner' ? PARTNER_PATH_PREFIX : '/mypets');
    }
    return NextResponse.redirect(url);
  }

  if (surface === 'partner' && pathname === '/') {
    const url = request.nextUrl.clone();
    url.pathname = PARTNER_PATH_PREFIX;
    return NextResponse.redirect(url);
  }

  // Cookie-gate heavy authenticated shells so RSC pages cannot start DB work in parallel
  // with a layout redirect (Next runs layout + page concurrently).
  const needsAuthCookie =
    pathname === '/ops' ||
    pathname.startsWith('/ops/') ||
    pathname === '/vit-pro' ||
    pathname.startsWith('/vit-pro/') ||
    pathname === '/admin/symptoms' ||
    pathname.startsWith('/admin/symptoms/');
  const hasAuthCookie = request.cookies
    .getAll()
    .some((c) => c.name.includes('-auth-token') || c.name.startsWith('sb-'));
  if (needsAuthCookie && !hasAuthCookie) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.search = `?next=${encodeURIComponent(pathname)}`;
    return NextResponse.redirect(url);
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(FP_SURFACE_HEADER, surface);
  requestHeaders.set('x-pathname', pathname);

  const fallback = NextResponse.next({
    request: { headers: requestHeaders },
  });
  fallback.headers.set(FP_SURFACE_HEADER, surface);

  try {
    const response = await Promise.race([
      updateSupabaseSession(request, requestHeaders),
      new Promise<NextResponse>((resolve) => {
        setTimeout(() => resolve(fallback), MIDDLEWARE_BUDGET_MS);
      }),
    ]);
    response.headers.set(FP_SURFACE_HEADER, surface);
    return response;
  } catch (error) {
    console.error('[middleware] unexpected failure; continuing', error);
    return fallback;
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|favicon.png|images/|manifest.json|sw.js|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
