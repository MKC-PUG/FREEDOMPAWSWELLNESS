/**
 * Canonical protocol + price catalog for app shop, Framer CTAs, and docs.
 * Code source of truth — sync docs/Protocol-Price-Source-of-Truth.* when prices change.
 */

import { PROTOCOL_BY_SLUG } from '@/lib/ai/protocol-registry';
import { SHOP_PRICE, tokenShopItems } from '@/app/token-shop/shop-items';
import {
  protocolDetailHref,
  tokenShopBuyHref,
  tokenShopHref,
} from '@/lib/site-urls';

export const CANONICAL_SHOP = 'app' as const;
export const PRIMARY_PAYMENT_RAIL = 'xaman-xrpl' as const;
export const SECONDARY_PAYMENT_RAIL = 'stripe' as const;

export type ProtocolCatalogRow = {
  slug: string;
  cardTitle: string;
  brandedTitle: string;
  specCategory: string;
  priceXrp: number;
  priceRlusd: number;
  appShopUrl: string;
  appBuyUrl: string;
  appProtocolUrl: string;
  framerTeaserNote: string;
};

export function getProtocolCatalog(): ProtocolCatalogRow[] {
  return tokenShopItems.map((item) => {
    const rec = PROTOCOL_BY_SLUG[item.slug];
    return {
      slug: item.slug,
      cardTitle: item.cardTitle,
      brandedTitle: rec?.brandedTitle ?? item.cardTitle,
      specCategory: rec?.specCategory ?? '',
      priceXrp: SHOP_PRICE.xrp,
      priceRlusd: SHOP_PRICE.rlusd,
      appShopUrl: tokenShopHref(item.slug),
      appBuyUrl: tokenShopBuyHref(item.slug),
      appProtocolUrl: protocolDetailHref(item.slug),
      framerTeaserNote: `Teaser only — buy in app: ${tokenShopBuyHref(item.slug)}`,
    };
  });
}

export function getCatalogBySlug(slug: string): ProtocolCatalogRow | undefined {
  return getProtocolCatalog().find((r) => r.slug === slug);
}

export function shopPrices() {
  return { ...SHOP_PRICE };
}
