'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { CANONICAL_USD, FALLBACK_XRP } from '@/lib/shop/pricing';

export type TokenShopQuote = {
  xrp: number;
  xrpIsLive: boolean;
  xrpUsdRate: number;
  updatedAt: string;
};

type TokenShopContextValue = {
  quote: TokenShopQuote;
  configReady: boolean | null;
  refreshQuote: () => Promise<void>;
};

const defaultQuote: TokenShopQuote = {
  xrp: FALLBACK_XRP,
  xrpIsLive: false,
  xrpUsdRate: 0,
  updatedAt: '',
};

const TokenShopContext = createContext<TokenShopContextValue | null>(null);

type Props = {
  children: ReactNode;
  initialQuote?: TokenShopQuote;
  initialConfigReady?: boolean;
};

export function TokenShopProvider({ children, initialQuote, initialConfigReady }: Props) {
  const [quote, setQuote] = useState<TokenShopQuote>(initialQuote ?? defaultQuote);
  const [configReady, setConfigReady] = useState<boolean | null>(
    initialConfigReady ?? null
  );

  const refreshQuote = useCallback(async () => {
    try {
      const res = await fetch('/api/pricing/live');
      const data = await res.json();
      if (data.ok) {
        setQuote({
          xrp: data.xrp,
          xrpIsLive: data.xrpIsLive,
          xrpUsdRate: data.xrpUsdRate,
          updatedAt: data.updatedAt,
        });
      }
    } catch {
      /* keep last quote */
    }
  }, []);

  useEffect(() => {
    if (initialConfigReady === undefined) {
      fetch('/api/shop/config-status')
        .then((r) => r.json())
        .then((d) => setConfigReady(Boolean(d.readyForXamanTest)))
        .catch(() => setConfigReady(null));
    }
  }, [initialConfigReady]);

  useEffect(() => {
    if (!initialQuote) void refreshQuote();
    const interval = setInterval(refreshQuote, 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, [initialQuote, refreshQuote]);

  const value = useMemo(
    () => ({ quote, configReady, refreshQuote }),
    [quote, configReady, refreshQuote]
  );

  return <TokenShopContext.Provider value={value}>{children}</TokenShopContext.Provider>;
}

export function useTokenShop(): TokenShopContextValue {
  const ctx = useContext(TokenShopContext);
  if (!ctx) {
    throw new Error('useTokenShop must be used within TokenShopProvider');
  }
  return ctx;
}

/** Server-serializable quote shape for TokenShopPage. */
export function toTokenShopQuote(live: {
  xrp: number;
  xrpIsLive: boolean;
  xrpUsdRate: number;
  updatedAt: string;
}): TokenShopQuote {
  return {
    xrp: live.xrp,
    xrpIsLive: live.xrpIsLive,
    xrpUsdRate: live.xrpUsdRate,
    updatedAt: live.updatedAt,
  };
}

export { CANONICAL_USD };
