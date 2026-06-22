import { NextResponse, NextRequest } from 'next/server';
import { FP_SURFACE_HEADER, surfaceFromRequest, PARTNER_PATH_PREFIX } from '@/lib/partner/surface';
import { updateSupabaseSession } from '@/lib/supabase/middleware';

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

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(FP_SURFACE_HEADER, surface);
  requestHeaders.set('x-pathname', pathname);

  const requestWithSurface = new NextRequest(request.url, {
    headers: requestHeaders,
  });

  const response = await updateSupabaseSession(requestWithSurface);

  response.headers.set(FP_SURFACE_HEADER, surface);
  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|favicon.png|images/|manifest.json|sw.js|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
