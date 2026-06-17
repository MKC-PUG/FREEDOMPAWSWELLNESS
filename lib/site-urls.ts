/**
 * Canonical URLs for Framer ↔ app integration.
 * Set NEXT_PUBLIC_APP_URL when app.freedompawsinc.com DNS is live (Vercel custom domain).
 */

const trim = (url: string) => url.replace(/\/$/, '');

/** Production PWA base — empty string = same-origin relative links in the app UI. */
export function appBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_APP_URL?.trim();
  return raw ? trim(raw) : '';
}

/**
 * Absolute HTTPS origin for Xaman return URLs and webhooks.
 * Falls back to VERCEL_URL when NEXT_PUBLIC_APP_URL is not set yet.
 */
export function appOrigin(): string {
  const explicit = appBaseUrl();
  if (explicit) return explicit;
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return `https://${vercel.replace(/^https?:\/\//, '')}`;
  return '';
}

/** Marketing site (Framer). */
export function framerBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_FRAMER_URL?.trim();
  return raw ? trim(raw) : 'https://freedompawsinc.com';
}

export const APP_PATHS = {
  home: '/',
  diagnostics: '/diagnostics',
  photobooth: '/photobooth',
  mypets: '/mypets',
  protocols: '/protocols',
  tokenShop: '/token-shop',
  monitor: '/monitor',
} as const;

export function appPath(path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`;
  const base = appBaseUrl();
  return base ? `${base}${p}` : p;
}

export function tokenShopHref(slug?: string): string {
  if (!slug) return appPath(APP_PATHS.tokenShop);
  return appPath(
    `${APP_PATHS.tokenShop}?protocol=${encodeURIComponent(slug)}#${slug}`
  );
}

export function tokenShopBuyHref(slug: string): string {
  return appPath(
    `${APP_PATHS.tokenShop}?protocol=${encodeURIComponent(slug)}&buy=1#${slug}`
  );
}

export function protocolDetailHref(slug: string): string {
  return appPath(`${APP_PATHS.protocols}/${slug}`);
}

/** Framer marketing paths — override via env if your Framer slugs differ. */
export function framerGrantsUrl(): string {
  const raw = process.env.NEXT_PUBLIC_FRAMER_GRANTS_URL?.trim();
  return raw || `${framerBaseUrl()}/grants`;
}

export function framerMissionUrl(): string {
  const raw = process.env.NEXT_PUBLIC_FRAMER_MISSION_URL?.trim();
  return raw || `${framerBaseUrl()}/mission`;
}

export function framerVeteransUrl(): string {
  const raw = process.env.NEXT_PUBLIC_FRAMER_VETERANS_URL?.trim();
  return raw || `${framerBaseUrl()}/veterans`;
}

export function framerSheltersUrl(): string {
  const raw = process.env.NEXT_PUBLIC_FRAMER_SHELTERS_URL?.trim();
  return raw || `${framerBaseUrl()}/shelters`;
}

/** Partner portal (Adoption Network). */
export function partnerBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_PARTNER_HOST?.trim();
  if (raw) return trim(raw.startsWith('http') ? raw : `https://${raw}`);
  return 'https://shelter.freedompawsinc.com';
}

export function partnerPath(path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`;
  const base = partnerBaseUrl();
  return `${base}${p}`;
}

/** Canonical live adoption directory — app SSR (dynamic listings from Supabase). */
export function adoptTnCanonicalUrl(subpath = ''): string {
  return appPath(adoptTnPath(subpath));
}

/**
 * Framer marketing entry for Adoption Network (story + CTA only).
 * Live inventory always lives on the app — see adoptTnCanonicalUrl().
 */
export function framerAdoptLandingUrl(): string {
  const raw = process.env.NEXT_PUBLIC_FRAMER_ADOPT_URL?.trim();
  return raw || `${framerBaseUrl()}/adopt`;
}

/** @deprecated Use adoptTnCanonicalUrl() for directory links; framerAdoptLandingUrl() for marketing. */
export function framerAdoptTnUrl(): string {
  return adoptTnCanonicalUrl();
}

/** App-hosted TN adoption directory (SSR). */
export function adoptTnPath(subpath = ''): string {
  const base = '/adopt/tn';
  if (!subpath) return base;
  const p = subpath.startsWith('/') ? subpath : `/${subpath}`;
  return `${base}${p}`;
}

export function adoptTnListingPath(shelterSlug: string, listingSlug: string): string {
  return adoptTnPath(`/${shelterSlug}/${listingSlug}`);
}

/** True when custom app subdomain is configured (not placeholder). */
export function isAppSubdomainConfigured(): boolean {
  const url = appBaseUrl();
  return Boolean(url && url.includes('app.'));
}
