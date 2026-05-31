'use client';

import { useEffect } from 'react';
import { PWA_VERSION } from '@/lib/pwa-version';

/**
 * Registers the service worker in production only.
 * Dev / local HMR: SW stays unregistered to avoid stale bundles on mobile.
 */
export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    const isDev = process.env.NODE_ENV === 'development';

    if (isDev) {
      void navigator.serviceWorker.getRegistrations().then((regs) => {
        regs.forEach((r) => void r.unregister());
      });
      if ('caches' in window) {
        void caches.keys().then((keys) => {
          keys.forEach((k) => void caches.delete(k));
        });
      }
      return;
    }

    let refreshing = false;
    const onControllerChange = () => {
      if (refreshing) return;
      refreshing = true;
      // Reload only after user taps Refresh in PwaUpdateBanner (skipWaiting posted there).
      window.location.reload();
    };
    navigator.serviceWorker.addEventListener('controllerchange', onControllerChange);

    const registerSw = () => {
      if (!navigator.onLine) return;
      void navigator.serviceWorker
        .register(`/sw.js?${PWA_VERSION}`, { scope: '/', updateViaCache: 'none' })
        .then((reg) => {
          if (navigator.onLine) reg.update().catch(() => {});
          reg.addEventListener('updatefound', () => {
            const worker = reg.installing;
            if (!worker) return;
            worker.addEventListener('statechange', () => {
              if (worker.state === 'installed' && navigator.serviceWorker.controller) {
                window.dispatchEvent(new CustomEvent('fp-sw-update', { detail: reg.waiting ?? worker }));
              }
            });
          });
        })
        .catch(() => {});
    };

    registerSw();
    window.addEventListener('online', registerSw);

    return () => {
      navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
      window.removeEventListener('online', registerSw);
    };
  }, []);

  return null;
}
