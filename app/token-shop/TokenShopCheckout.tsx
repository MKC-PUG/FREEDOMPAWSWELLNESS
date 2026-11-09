'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { xrpForUsd } from '@/lib/shop/membership-plans';
import { isProtocolUnlocked } from '@/lib/shop/unlocks';
import { useShopAccess } from './ShopAccess';
import { useTokenShop } from './TokenShopProvider';

type Props = {
  slug: string;
  cardTitle: string;
};

type Phase = 'idle' | 'creating' | 'waiting' | 'success' | 'error';

export default function TokenShopCheckout({ slug, cardTitle }: Props) {
  const { quote } = useTokenShop();
  const access = useShopAccess();
  const [phase, setPhase] = useState<Phase>('idle');
  const [message, setMessage] = useState<string | null>(null);
  const [legacyUnlock, setLegacyUnlock] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const passUsd = access.offers.passUsd;
  const xrp = xrpForUsd(passUsd, quote.xrpUsdRate);
  const serverAccess =
    Boolean(access.membership) || access.passes.some((pass) => pass.protocolSlug === slug);

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  const checkStatusOnce = useCallback(
    async (uuid: string) => {
      const res = await fetch(`/api/xumm/status?uuid=${encodeURIComponent(uuid)}`);
      const data = await res.json();
      if (!data.ok) return false;
      if (data.resolved && data.signed) {
        sessionStorage.removeItem(`fp-xumm-pending-${slug}`);
        if (data.granted) {
          setPhase('success');
          setMessage('Payment is on your account. Open this page on another phone with the same login.');
          await access.refresh();
        } else if (data.legacyProtocol) {
          setPhase('error');
          setMessage('That payment was the retired $18 offer. It does not open a membership.');
        } else {
          setPhase('error');
          setMessage(data.error || 'Xaman signed, and the account was not updated. Stay signed in and try again.');
        }
        stopPolling();
        return true;
      }
      if (data.cancelled || data.expired) {
        sessionStorage.removeItem(`fp-xumm-pending-${slug}`);
        setPhase('error');
        setMessage(data.cancelled ? 'Payment cancelled in Xaman.' : 'Payment request expired. Tap Buy again.');
        stopPolling();
        return true;
      }
      return false;
    },
    [access, slug, stopPolling]
  );

  useEffect(() => {
    setLegacyUnlock(isProtocolUnlocked(slug));
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [slug]);

  const startXaman = async () => {
    if (!access.signedIn) {
      window.location.assign('/login?next=/token-shop');
      return;
    }
    setPhase('creating');
    setMessage(null);
    try {
      const res = await fetch('/api/xumm/payload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: 'pass', slug, currency: 'xrp' }),
      });
      const data = await res.json();
      if (!data.ok) {
        setPhase('error');
        setMessage(data.error || 'Could not start Xaman checkout.');
        return;
      }
      setPhase('waiting');
      setMessage(`Open Xaman to pay ${data.amountLabel} for the ${cardTitle} pass…`);
      sessionStorage.setItem(`fp-xumm-pending-${slug}`, data.uuid);
      void checkStatusOnce(data.uuid);
      pollRef.current = setInterval(() => {
        void checkStatusOnce(data.uuid);
      }, 2500);
      window.location.href = data.deeplink;
    } catch {
      setPhase('error');
      setMessage('Network error. Try again.');
    }
  };

  const startStripe = async () => {
    if (!access.signedIn) {
      window.location.assign('/login?next=/token-shop');
      return;
    }
    setPhase('creating');
    setMessage(null);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: 'pass', slug }),
      });
      const data = await res.json();
      if (!data.ok) {
        setPhase('error');
        setMessage(data.error || 'Card checkout is not available yet.');
        return;
      }
      window.location.assign(data.url);
    } catch {
      setPhase('error');
      setMessage('Network error. Try again.');
    }
  };

  if (serverAccess) {
    return (
      <div className="mt-6 rounded-2xl border border-green-500/40 bg-green-950/30 px-4 py-4 text-center">
        <p className="text-sm font-bold text-green-300">Included on this account</p>
        <p className="mt-1 text-xs text-white/55">{cardTitle}</p>
      </div>
    );
  }

  if (legacyUnlock) {
    return (
      <div className="mt-6 rounded-2xl border border-white/15 bg-[#0A1428]/50 px-4 py-4 text-center">
        <p className="text-sm font-bold text-white">Older unlock on this device</p>
        <p className="mt-1 text-xs text-white/55">
          It stays on this browser. A new purchase is the membership above, saved to the account.
        </p>
      </div>
    );
  }

  const busy = phase === 'creating' || phase === 'waiting';

  return (
    <div className="mt-6 space-y-3">
      <div className="rounded-2xl border border-white/15 bg-[#0A1428]/50 px-4 py-4 text-center">
        <p className="text-xs font-semibold uppercase tracking-wide text-white/50">12-month protocol pass</p>
        <p className="mt-1 text-3xl font-bold text-white">${passUsd}</p>
        <p className="mt-2 text-sm text-[#F5C242]">or {xrp.toFixed(2)} XRP</p>
        <p className="mt-2 text-[10px] text-white/40">The annual membership above includes every protocol.</p>
      </div>
      <button
        type="button"
        disabled={busy}
        onClick={() => void startStripe()}
        className="w-full min-h-[48px] rounded-full border border-white/25 text-xs font-bold text-white disabled:opacity-60"
      >
        {access.signedIn ? `Pay $${passUsd} by card` : 'Sign in to buy this pass'}
      </button>
      <button
        type="button"
        disabled={busy}
        onClick={() => void startXaman()}
        className="w-full min-h-[44px] text-xs font-semibold text-white/70 underline disabled:opacity-60"
      >
        Pay ${passUsd} with Xaman
      </button>
      {message && (
        <p className={`text-center text-xs ${phase === 'error' ? 'text-red-300' : 'text-amber-200/80'}`}>{message}</p>
      )}
    </div>
  );
}
