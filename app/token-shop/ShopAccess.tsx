'use client';

import Link from 'next/link';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { xrpForUsd } from '@/lib/shop/membership-plans';
import { useTokenShop } from './TokenShopProvider';

export type ShopPass = { protocolSlug: string; periodEnd: string };

export type ShopAccessState = {
  loading: boolean;
  signedIn: boolean;
  membership: { plan: string; periodEnd: string } | null;
  passes: ShopPass[];
  offers: {
    foundingOpen: boolean;
    featuredAnnual: 'founding_annual' | 'annual';
    foundingAnnualUsd: number;
    annualUsd: number;
    monthlyUsd: number;
    passUsd: number;
  };
  refresh: () => Promise<void>;
};

const defaultOffers: ShopAccessState['offers'] = {
  foundingOpen: true,
  featuredAnnual: 'founding_annual',
  foundingAnnualUsd: 79,
  annualUsd: 99,
  monthlyUsd: 12,
  passUsd: 29,
};

const ShopAccessContext = createContext<ShopAccessState | null>(null);

export function useShopAccess(): ShopAccessState {
  const value = useContext(ShopAccessContext);
  if (!value) throw new Error('useShopAccess must be used inside ShopAccessProvider');
  return value;
}

export function ShopAccessProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [signedIn, setSignedIn] = useState(false);
  const [membership, setMembership] = useState<ShopAccessState['membership']>(null);
  const [passes, setPasses] = useState<ShopPass[]>([]);
  const [offers, setOffers] = useState(defaultOffers);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/shop/entitlement');
      const data = await res.json();
      if (data.offers) setOffers(data.offers);
      setSignedIn(Boolean(data.signedIn));
      setMembership(data.membership ?? null);
      setPasses(Array.isArray(data.passes) ? data.passes : []);
    } catch {
      setSignedIn(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const resumeXaman = useCallback(async () => {
    const keys = Object.keys(sessionStorage).filter(
      (key) => key === 'fp-xaman-pending-plan' || key.startsWith('fp-xumm-pending-')
    );
    for (const key of keys) {
      const uuid = sessionStorage.getItem(key);
      if (!uuid) continue;
      try {
        const res = await fetch(`/api/xumm/status?uuid=${encodeURIComponent(uuid)}`);
        const data = await res.json();
        if (data.granted || data.cancelled || data.expired || (data.resolved && !data.signed)) {
          sessionStorage.removeItem(key);
        }
      } catch {
        /* keep the pending id and try on the next visit */
      }
    }
    await refresh();
  }, [refresh]);

  useEffect(() => {
    void resumeXaman();
    const onVisible = () => {
      if (document.visibilityState === 'visible') void resumeXaman();
    };
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('pageshow', onVisible);
    return () => {
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('pageshow', onVisible);
    };
  }, [resumeXaman]);

  return (
    <ShopAccessContext.Provider value={{ loading, signedIn, membership, passes, offers, refresh }}>
      {children}
    </ShopAccessContext.Provider>
  );
}

function loginHref() {
  return '/login?next=/token-shop';
}

export function MembershipOffer() {
  const access = useShopAccess();
  const { quote } = useTokenShop();
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const annualUsd = access.offers.foundingOpen ? access.offers.foundingAnnualUsd : access.offers.annualUsd;
  const annualPlan = access.offers.featuredAnnual;
  const xrp = xrpForUsd(annualUsd, quote.xrpUsdRate);

  const start = async (plan: 'founding_annual' | 'annual' | 'monthly', rail: 'card' | 'xaman') => {
    if (!access.signedIn) {
      window.location.assign(loginHref());
      return;
    }
    setBusy(true);
    setMessage(null);
    try {
      if (rail === 'card') {
        const res = await fetch('/api/stripe/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ plan }),
        });
        const data = await res.json();
        if (!data.ok || !data.url) {
          setMessage(data.error || 'Card checkout is not available yet.');
          return;
        }
        window.location.assign(data.url);
        return;
      }
      const res = await fetch('/api/xumm/payload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, currency: 'xrp' }),
      });
      const data = await res.json();
      if (!data.ok) {
        setMessage(data.error || 'Could not start Xaman checkout.');
        return;
      }
      sessionStorage.setItem('fp-xaman-pending-plan', data.uuid);
      window.location.href = data.deeplink;
    } catch {
      setMessage('Network error. Try again.');
    } finally {
      setBusy(false);
    }
  };

  if (access.membership) {
    const end = new Date(access.membership.periodEnd).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
    return (
      <div className="mx-auto mb-10 max-w-xl rounded-3xl border border-green-500/40 bg-green-950/30 px-6 py-6 text-center">
        <p className="text-sm font-bold text-green-300">Membership is on this account</p>
        <p className="mt-2 text-sm text-white/70">Open through {end}. The same login shows it on another phone.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto mb-10 max-w-xl rounded-3xl border border-[#F5C242]/40 bg-[#0A1428]/80 px-6 py-7 text-center">
      <p className="text-xs font-semibold uppercase tracking-wide text-[#F5C242]">Annual membership</p>
      <p className="mt-2 text-4xl font-bold text-white">${annualUsd}</p>
      <p className="mt-2 text-sm text-white/70">
        {access.offers.foundingOpen
          ? 'Founding price through April 30, 2027. Twelve months, then the annual price is $99.'
          : 'Twelve months of the protocols and the member scans.'}
      </p>
      <p className="mt-2 text-sm text-[#F5C242]">or {xrp.toFixed(2)} XRP</p>
      <button
        type="button"
        disabled={busy || access.loading}
        onClick={() => void start(annualPlan, 'card')}
        className="mt-5 w-full min-h-[52px] rounded-full bg-[#F5C242] text-sm font-bold text-black disabled:opacity-60"
      >
        {access.signedIn ? `Pay $${annualUsd} by card` : 'Sign in to pay by card'}
      </button>
      <button
        type="button"
        disabled={busy || access.loading}
        onClick={() => void start(annualPlan, 'xaman')}
        className="mt-3 w-full min-h-[48px] rounded-full border border-white/25 text-xs font-bold text-white disabled:opacity-60"
      >
        {access.signedIn ? `Pay $${annualUsd} with Xaman` : 'Sign in to pay with Xaman'}
      </button>
      <button
        type="button"
        disabled={busy || access.loading}
        onClick={() => void start('monthly', 'card')}
        className="mt-4 text-xs text-white/55 underline"
      >
        Monthly is ${access.offers.monthlyUsd}, and it is not the main offer
      </button>
      {message && <p className="mt-4 text-xs text-amber-200">{message}</p>}
      {!access.signedIn && (
        <p className="mt-4 text-xs text-white/50">
          <Link href={loginHref()} className="text-[#F5C242] underline">
            Email sign-in
          </Link>{' '}
          is required. A payment is saved to the account, not to this browser.
        </p>
      )}
    </div>
  );
}
