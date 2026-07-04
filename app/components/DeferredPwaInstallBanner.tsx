'use client';

import dynamic from 'next/dynamic';

const PwaInstallBanner = dynamic(() => import('./PwaInstallBanner'), {
  ssr: false,
  loading: () => null,
});

/** Defers install banner JS until after first paint. */
export default function DeferredPwaInstallBanner() {
  return <PwaInstallBanner />;
}
