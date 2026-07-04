import type { Metadata, Viewport } from 'next';
import './globals.css';
import AppChrome from './components/AppChrome';
import ServiceWorkerRegister from './components/ServiceWorkerRegister';
import DeferredPwaInstallBanner from './components/DeferredPwaInstallBanner';
import PwaUpdateBanner from './components/PwaUpdateBanner';
import OfflineBanner from './components/OfflineBanner';
import PreviewModeBanner from './components/PreviewModeBanner';
import { isPreviewMode } from '@/lib/site-mode';

export const metadata: Metadata = {
  title: 'Freedom Paws Wellness',
  description: 'Tokenized Holistic Wellness on XRPL • Inspired by Buddy’s Miracle',
  applicationName: 'Freedom Paws',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.png', type: 'image/png' },
      { url: '/images/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/images/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/images/apple-touch-icon.png',
  },
  appleWebApp: {
    capable: true,
    title: 'Freedom Paws',
    statusBarStyle: 'black-translucent',
  },
  formatDetection: {
    telephone: false,
  },
  robots: isPreviewMode()
    ? { index: false, follow: false, nocache: true }
    : { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#F5C242',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#0A1428] text-white">
        <ServiceWorkerRegister />
        <OfflineBanner />
        <PwaUpdateBanner />
        <PreviewModeBanner />
        <DeferredPwaInstallBanner />
        <AppChrome>
          <main>{children}</main>
        </AppChrome>
      </body>
    </html>
  );
}
