'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { CANONICAL_RLUSD, CANONICAL_USD, FALLBACK_XRP } from '@/lib/shop/pricing';
import { isProtocolUnlocked, unlockProtocol } from '@/lib/shop/unlocks';

type LiveQuote = {
  xrp: number;
  xrpIsLive: boolean;
  xrpUsdRate: number;
  updatedAt: string;
};

type Props = {
  slug: string;
  cardTitle: string;
};

type Phase = 'idle' | 'creating' | 'waiting' | 'success' | 'error';

export default function TokenShopCheckout({ slug, cardTitle }: Props) {
  const [quote, setQuote] = useState<LiveQuote>({
    xrp: FALLBACK_XRP,
    xrpIsLive: false,
    xrpUsdRate: 0,
    updatedAt: '',
  });
  const [phase, setPhase] = useState<Phase>('idle');
  const [message, setMessage] = useState<string | null>(null);
  const [unlocked, setUnlocked] = useState(false);
  const [configReady, setConfigReady] = useState<boolean | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const loadQuote = useCallback(async () => {
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
      /* keep fallback */
    }
  }, []);

  useEffect(() => {
    setUnlocked(isProtocolUnlocked(slug));
    loadQuote();
    fetch('/api/shop/config-status')
      .then((r) => r.json())
      .then((d) => setConfigReady(Boolean(d.readyForXamanTest)))
      .catch(() => setConfigReady(null));
    const interval = setInterval(loadQuote, 2 * 60 * 1000);
    return () => {
      clearInterval(interval);
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [slug, loadQuote]);

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  const markUnlocked = useCallback(() => {
    unlockProtocol(slug);
    setUnlocked(true);
    setPhase('success');
    setMessage('Payment confirmed — lifetime access unlocked on this device.');
    stopPolling();
  }, [slug, stopPolling]);

  const pollStatus = useCallback(
    (uuid: string) => {
      stopPolling();
      pollRef.current = setInterval(async () => {
        try {
          const res = await fetch(`/api/xumm/status?uuid=${encodeURIComponent(uuid)}`);
          const data = await res.json();
          if (!data.ok) return;
          if (data.resolved && data.signed) {
            markUnlocked();
            return;
          }
          if (data.cancelled || data.expired) {
            setPhase('error');
            setMessage(
              data.cancelled
                ? 'Payment cancelled in Xaman.'
                : 'Payment request expired — tap Buy again.'
            );
            stopPolling();
          }
        } catch {
          /* keep polling */
        }
      }, 2500);
    },
    [markUnlocked, stopPolling]
  );

  const startXaman = async (currency: 'xrp' | 'rlusd') => {
    setPhase('creating');
    setMessage(null);
    stopPolling();

    try {
      const body: { slug: string; currency: string; xrpAmount?: number } = { slug, currency };
      if (currency === 'xrp') body.xrpAmount = quote.xrp;

      const res = await fetch('/api/xumm/payload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (!data.ok) {
        setPhase('error');
        setMessage(data.error || 'Could not start Xaman checkout.');
        return;
      }

      setPhase('waiting');
      setMessage(`Open Xaman to pay ${data.amountLabel} for ${cardTitle}…`);
      pollStatus(data.uuid);
      // href works more reliably than assign for xaman.app / xumm.app on iOS PWA
      window.location.href = data.deeplink;
    } catch {
      setPhase('error');
      setMessage('Network error — check connection and try again.');
    }
  };

  const startStripe = async () => {
    setPhase('creating');
    setMessage(null);
    stopPolling();

    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
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
      setMessage('Network error — try again.');
    }
  };

  const xrpLabel = quote.xrpIsLive
    ? `≈ ${quote.xrp.toFixed(2)} XRP`
    : `≈ ${quote.xrp.toFixed(2)} XRP (estimate)`;

  if (unlocked) {
    return (
      <div className="mt-6 space-y-3">
        <div className="rounded-2xl border border-green-500/40 bg-green-950/30 px-4 py-4 text-center">
          <p className="text-sm font-bold text-green-300">✓ Unlocked on this device</p>
          <p className="mt-1 text-xs text-white/55">{cardTitle}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-3">
      {/* Price: RLUSD/fiat first, live XRP second */}
      <div className="rounded-2xl border border-white/15 bg-[#0A1428]/50 px-4 py-4 text-center">
        <p className="text-2xl font-bold text-white">
          {CANONICAL_RLUSD} RLUSD
        </p>
        <p className="text-sm text-white/60 mt-1">
          ≈ ${CANONICAL_USD} USD fiat equivalent
        </p>
        <p className="text-lg font-semibold text-[#F5C242] mt-3">{xrpLabel}</p>
        <p className="text-[10px] text-white/40 mt-1">
          {quote.xrpIsLive ? 'Live XRP conversion' : 'Using estimate — live rate unavailable'}
          {quote.xrpIsLive && quote.xrpUsdRate > 0 && (
            <span> · 1 XRP ≈ ${quote.xrpUsdRate.toFixed(4)}</span>
          )}
        </p>
      </div>

      {configReady === false && (
        <p className="text-center text-xs text-amber-300/90 leading-relaxed rounded-xl border border-amber-400/30 bg-amber-950/20 px-3 py-2">
          Checkout setup incomplete on server — add Vercel env vars from{' '}
          <span className="font-semibold">Today-Tasks-2-and-3</span> doc, then redeploy.
        </p>
      )}

      <p className="text-center text-[10px] text-white/45 leading-relaxed">
        Primary: XRPL via Xaman (RLUSD or live XRP). Card is alternative #2.
      </p>

      <button
        type="button"
        data-purchase
        disabled={phase === 'creating' || phase === 'waiting'}
        onClick={() => startXaman('rlusd')}
        className="w-full min-h-[52px] text-center bg-[#F5C242] hover:bg-amber-300 active:bg-amber-200 disabled:opacity-60 text-black text-sm font-bold py-3.5 rounded-full transition-colors touch-manipulation"
      >
        {phase === 'creating' || phase === 'waiting'
          ? 'Opening Xaman…'
          : `Pay with Xaman — ${CANONICAL_RLUSD} RLUSD`}
      </button>

      <button
        type="button"
        disabled={phase === 'creating' || phase === 'waiting'}
        onClick={() => startXaman('xrp')}
        className="w-full min-h-[48px] text-center border border-[#F5C242]/50 text-[#F5C242] hover:bg-[#F5C242]/10 disabled:opacity-60 text-xs font-bold py-3 rounded-full transition-colors touch-manipulation"
      >
        Pay with Xaman — {quote.xrp.toFixed(2)} XRP (live)
      </button>

      <button
        type="button"
        disabled={phase === 'creating' || phase === 'waiting'}
        onClick={startStripe}
        className="w-full min-h-[48px] text-center border border-white/25 bg-white/5 hover:bg-white/10 disabled:opacity-60 text-white text-xs font-bold py-3 rounded-full transition-colors touch-manipulation"
      >
        Pay with card (Stripe) — ${CANONICAL_USD} USD
      </button>

      {message && (
        <p
          className={`text-center text-xs leading-relaxed ${
            phase === 'error' ? 'text-red-300' : phase === 'success' ? 'text-green-300' : 'text-amber-200/80'
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
