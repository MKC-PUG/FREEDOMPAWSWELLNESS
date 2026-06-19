import { headers } from 'next/headers';
import type { AppSurface } from '@/lib/partner/types';
import { isPartnerHostname } from '@/lib/partner/host';

export const FP_SURFACE_HEADER = 'x-fp-app-surface';

/** Path prefix that uses partner shell on any host (local dev without DNS). */
export const PARTNER_PATH_PREFIX = '/partner';

/** FP ops command center — any host. */
export const OPS_PATH_PREFIX = '/ops';

export function surfaceFromPathname(pathname: string): AppSurface | null {
  if (pathname === OPS_PATH_PREFIX || pathname.startsWith(`${OPS_PATH_PREFIX}/`)) {
    return 'ops';
  }
  if (pathname === PARTNER_PATH_PREFIX || pathname.startsWith(`${PARTNER_PATH_PREFIX}/`)) {
    return 'partner';
  }
  return null;
}

export function surfaceFromRequest(host: string, pathname: string): AppSurface {
  if (isPartnerHostname(host)) return 'partner';
  return surfaceFromPathname(pathname) ?? 'consumer';
}

/** Server components — reads middleware header or host. */
export async function getAppSurface(): Promise<AppSurface> {
  const h = await headers();
  const marked = h.get(FP_SURFACE_HEADER);
  if (marked === 'ops') return 'ops';
  if (marked === 'partner') return 'partner';
  if (marked === 'consumer') return 'consumer';
  const host = h.get('host') ?? '';
  const pathname = h.get('x-pathname') ?? '';
  return surfaceFromRequest(host, pathname);
}
