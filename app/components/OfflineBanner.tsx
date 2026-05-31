'use client';

import { useEffect, useState } from 'react';

export default function OfflineBanner() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    const sync = () => setOffline(!navigator.onLine);
    sync();
    window.addEventListener('online', sync);
    window.addEventListener('offline', sync);
    return () => {
      window.removeEventListener('online', sync);
      window.removeEventListener('offline', sync);
    };
  }, []);

  if (!offline) return null;

  return (
    <div
      role="status"
      className="sticky z-[90] border-b border-amber-400/40 bg-[#1a1208] px-4 py-3 text-center text-sm text-amber-200"
      style={{ top: 'var(--nav-total-height)' }}
    >
      <p className="font-semibold text-amber-400">You&apos;re offline</p>
      <p className="mt-1 text-xs text-white/55 leading-relaxed">
        Photo Booth, uploads, and diagnostics need Wi‑Fi. Turn off Airplane Mode to continue.
        If iPhone shows a system alert, tap <strong className="text-white/80">OK</strong> — you can
        keep using this screen until you&apos;re back online.
      </p>
    </div>
  );
}
