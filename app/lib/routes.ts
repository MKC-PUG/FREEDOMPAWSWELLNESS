/** User journey: Protocol Overview → Protocol Detail → Token Shop (purchase) */

export function protocolOverviewHref() {
  return '/protocols';
}

export function protocolDetailHref(slug: string) {
  return `/protocols/${slug}`;
}

/** Token shop with optional protocol pre-selected (scroll + highlight). */
export function tokenShopHref(slug?: string) {
  if (!slug) return '/token-shop';
  return `/token-shop?protocol=${encodeURIComponent(slug)}#${slug}`;
}

export function tokenShopBuyHref(slug: string) {
  return `/token-shop?protocol=${encodeURIComponent(slug)}&buy=1#${slug}`;
}
