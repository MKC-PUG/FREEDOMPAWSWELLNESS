'use client';

import { useCallback, useEffect, useState } from 'react';

/** Large, readable banner when a new service worker is waiting (PWA update). */
export default function PwaUpdateBanner() {
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    const onUpdate = (e: Event) => {
      const worker = (e as CustomEvent<ServiceWorker>).detail;
      if (worker) setWaitingWorker(worker);
    };

    window.addEventListener('fp-sw-update', onUpdate);

    void navigator.serviceWorker.getRegistration().then((reg) => {
      if (reg?.waiting) setWaitingWorker(reg.waiting);
    });

    return () => window.removeEventListener('fp-sw-update', onUpdate);
  }, []);

  const refresh = useCallback(() => {
    waitingWorker?.postMessage({ type: 'SKIP_WAITING' });
    window.location.reload();
  }, [waitingWorker]);

  if (!waitingWorker) return null;

  return (
    <div
      role="alert"
      className="sticky z-[95] border-b-2 border-amber-400 bg-[#1a1208] px-4 py-4 text-center"
      style={{ top: 'var(--nav-total-height)' }}
    >
      <p className="text-base font-bold text-amber-400">Update ready</p>
      <p className="mt-1 text-sm text-white/75 leading-relaxed">
        A newer version of Freedom Paws is available.
      </p>
      <button
        type="button"
        onClick={refresh}
        className="mt-3 min-h-[52px] w-full max-w-sm rounded-xl bg-amber-400 px-6 py-3 text-base font-bold text-black active:bg-amber-300 touch-manipulation"
      >
        Refresh now
      </button>
    </div>
  );
}
