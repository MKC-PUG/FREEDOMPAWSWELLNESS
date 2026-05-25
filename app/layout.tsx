import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Freedom Paws Wellness',
  description: 'Tokenized Holistic Wellness on XRPL • Inspired by Buddy’s Miracle',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#0A1428] text-white">
        {children}
      </body>
    </html>
  );
}