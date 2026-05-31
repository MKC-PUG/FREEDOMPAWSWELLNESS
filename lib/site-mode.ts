/** Site visibility — keep `preview` until LLC/trademark/public launch. */
export type SiteMode = 'preview' | 'public';

export function getSiteMode(): SiteMode {
  const mode = process.env.NEXT_PUBLIC_SITE_MODE?.trim().toLowerCase();
  return mode === 'public' ? 'public' : 'preview';
}

export function isPreviewMode(): boolean {
  return getSiteMode() !== 'public';
}
