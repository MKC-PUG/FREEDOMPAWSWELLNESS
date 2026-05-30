import type { Metadata, Viewport } from 'next';
import './globals.css';
import Navbar from './components/Navbar';
import ServiceWorkerRegister from './components/ServiceWorkerRegister';

export const metadata: Metadata = {
  title: 'Freedom Paws Wellness',
  description: 'Tokenized Holistic Wellness on XRPL • Inspired by Buddy’s Miracle',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/images/apple-touch-icon.png',
  },
  appleWebApp: {
    capable: true,
    title: 'Freedom Paws',
    statusBarStyle: 'black-translucent',
  },
};

export const viewport: Viewport = {
  themeColor: '#F5C242',
  colorScheme: 'dark',
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
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
