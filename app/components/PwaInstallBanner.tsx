'use client';

import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { BRAND_LOGO_PAW } from '@/lib/brand/paths';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

const DISMISS_KEY = 'freedom-paws-pwa-install-dismissed';

export default function PwaInstallBanner() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(true);
  const [isIos, setIsIos] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  const [offline, setOffline] = useState(false);

  useEffect(() => {
    setDismissed(localStorage.getItem(DISMISS_KEY) === '1');
    setIsStandalone(
      window.matchMedia('(display-mode: standalone)').matches ||
        (navigator as Navigator & { standalone?: boolean }).standalone === true
    );
    setIsIos(/iphone|ipad|ipod/i.test(navigator.userAgent));

    const syncOnline = () => setOffline(!navigator.onLine);
    syncOnline();
    window.addEventListener('online', syncOnline);
    window.addEventListener('offline', syncOnline);

    const onBip = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', onBip);
    return () => {
      window.removeEventListener('beforeinstallprompt', onBip);
      window.removeEventListener('online', syncOnline);
      window.removeEventListener('offline', syncOnline);
    };
  }, []);

  const dismiss = useCallback(() => {
    localStorage.setItem(DISMISS_KEY, '1');
    setDismissed(true);
  }, []);

  const install = useCallback(async () => {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
    dismiss();
  }, [deferred, dismiss]);

  if (isStandalone || dismissed || offline) return null;

  if (deferred) {
    return (
      <div className="mx-4 mb-4 rounded-2xl border border-amber-400/40 bg-[#0F1E38]/95 p-4 shadow-lg">
        <div className="flex items-center gap-3">
          <Image
            src={BRAND_LOGO_PAW}
            alt=""
            width={48}
            height={48}
            className="h-11 w-auto shrink-0 object-contain"
            aria-hidden
          />
          <div>
            <p className="text-sm font-semibold text-amber-400">Install Freedom Paws</p>
            <p className="mt-1 text-xs text-white/55 leading-relaxed">
              Add to your home screen for quick access to Photo Booth, protocols, and diagnostics.
            </p>
          </div>
        </div>
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={() => void install()}
            className="flex-1 min-h-[48px] rounded-xl bg-amber-400 py-2.5 text-sm font-bold text-black touch-manipulation active:bg-amber-300"
          >
            Install app
          </button>
          <button
            type="button"
            onClick={dismiss}
            className="min-h-[48px] rounded-xl border border-white/20 px-4 py-2.5 text-sm text-white/60 touch-manipulation active:bg-white/5"
          >
            Not now
          </button>
        </div>
      </div>
    );
  }

  if (isIos) {
    return (
      <div className="mx-4 mb-4 rounded-2xl border border-white/10 bg-[#0F1E38]/80 p-4">
        <p className="text-sm font-semibold text-amber-400">Install on iPhone</p>
        <p className="mt-1 text-xs text-white/55 leading-relaxed">
          Tap <strong className="text-white">Share</strong> →{' '}
          <strong className="text-white">Add to Home Screen</strong> in Safari.
        </p>
        <button
          type="button"
          onClick={dismiss}
          className="mt-3 min-h-[44px] text-xs text-white/40 underline touch-manipulation"
        >
          Dismiss
        </button>
      </div>
    );
  }

  return null;
}
