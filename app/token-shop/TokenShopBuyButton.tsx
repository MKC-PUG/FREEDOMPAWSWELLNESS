'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { SHOP_PRICE } from './shop-items';
import { isProtocolUnlocked, unlockProtocol } from '@/lib/shop/unlocks';

type Props = {
  slug: string;
  cardTitle: string;
};

type Phase = 'idle' | 'creating' | 'waiting' | 'success' | 'error';

export default function TokenShopBuyButton({ slug, cardTitle }: Props) {
  const [phase, setPhase] = useState<Phase>('idle');
  const [message, setMessage] = useState<string | null>(null);
  const [unlocked, setUnlocked] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setUnlocked(isProtocolUnlocked(slug));
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [slug]);

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

  const startPayment = async (currency: 'xrp' | 'rlusd') => {
    setPhase('creating');
    setMessage(null);
    stopPolling();

    try {
      const res = await fetch('/api/xumm/payload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, currency }),
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
      window.location.assign(data.deeplink);
    } catch {
      setPhase('error');
      setMessage('Network error — check connection and try again.');
    }
  };

  if (unlocked) {
    return (
      <div className="mt-4 rounded-2xl border border-green-500/40 bg-green-950/30 px-4 py-4 text-center">
        <p className="text-sm font-bold text-green-300">✓ Unlocked on this device</p>
        <p className="mt-1 text-xs text-white/55">{cardTitle}</p>
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-2">
      <button
        type="button"
        data-purchase
        disabled={phase === 'creating' || phase === 'waiting'}
        onClick={() => startPayment('xrp')}
        className="w-full min-h-[52px] text-center bg-[#F5C242] hover:bg-amber-300 active:bg-amber-200 disabled:opacity-60 text-black text-sm font-bold py-3.5 rounded-full transition-colors touch-manipulation flex items-center justify-center gap-2"
      >
        {phase === 'creating' || phase === 'waiting' ? 'Opening Xaman…' : `Pay with Xaman — ${SHOP_PRICE.xrp} XRP`}
      </button>
      <button
        type="button"
        disabled={phase === 'creating' || phase === 'waiting'}
        onClick={() => startPayment('rlusd')}
        className="w-full min-h-[48px] text-center border border-[#F5C242]/50 text-[#F5C242] hover:bg-[#F5C242]/10 disabled:opacity-60 text-xs font-bold py-3 rounded-full transition-colors touch-manipulation"
      >
        Pay with Xaman — {SHOP_PRICE.rlusd} RLUSD
      </button>
      <p className="text-center text-[10px] text-white/45 leading-relaxed">
        Primary: XRPL via Xaman. Card (Stripe) — coming as alternative.
      </p>
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
