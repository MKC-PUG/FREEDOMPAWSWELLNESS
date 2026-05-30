'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRef } from 'react';

const navLinks = [
  { label: 'HOME', href: '/' },
  { label: 'VIT DIAGNOSTICS', href: '/diagnostics' },
  { label: 'MY PETS', href: '/mypets' },
  { label: 'PROTOCOL OVERVIEW', href: '/protocols' },
  { label: 'COMMUNITY', href: '#' },
  { label: 'TOKEN SHOP', href: '/token-shop' },
];

export default function Navbar() {
  const pathname = usePathname();
  const mobileMenuRef = useRef<HTMLDetailsElement>(null);

  const closeMobileMenu = () => {
    mobileMenuRef.current?.removeAttribute('open');
  };

  return (
    <nav className="sticky top-0 z-[100] bg-[#0A1625] border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-2 sm:gap-6">
        <Link href="/" className="min-w-0 flex-1 leading-tight" onClick={closeMobileMenu}>
          <div className="font-bold text-base sm:text-2xl tracking-tight truncate">
            Freedom Paws Wellness
          </div>
          <div className="hidden sm:block text-xs text-amber-400 mt-0.5">Honor Buddy&apos;s Legacy</div>
        </Link>

        <div className="hidden md:flex items-center gap-4 lg:gap-6 text-[11px] lg:text-xs font-semibold tracking-wider whitespace-nowrap">
          {navLinks.map((l) => {
            const isActive = l.href !== '#' && pathname === l.href;
            return (
              <Link
                key={l.label}
                href={l.href}
                className={isActive ? 'text-amber-400' : 'text-white/80 hover:text-white transition-colors'}
              >
                {l.label}
              </Link>
            );
          })}
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3 md:hidden">
          {/* Native <details> toggle — reliable on iPhone 12 (iOS Chrome & Safari) */}
          <details ref={mobileMenuRef} className="group relative">
            <summary
              className="list-none cursor-pointer relative z-20 inline-flex shrink-0 items-center justify-center min-w-[48px] min-h-[48px] w-12 h-12 rounded-lg border border-white/15 bg-[#0A1625] text-white text-2xl leading-none active:bg-white/20 touch-manipulation select-none [&::-webkit-details-marker]:hidden"
              style={{ WebkitTapHighlightColor: 'transparent' }}
              aria-label="Open menu"
            >
              <span className="group-open:hidden pointer-events-none" aria-hidden="true">
                ☰
              </span>
              <span className="hidden group-open:inline pointer-events-none" aria-hidden="true">
                ✕
              </span>
            </summary>

            <div
              id="mobile-menu"
              className="fixed left-0 right-0 top-[calc(3.75rem+env(safe-area-inset-top,0px))] z-[99] border-t border-white/10 bg-[#0A1625] shadow-xl shadow-black/40 max-h-[calc(100dvh-4rem)] overflow-y-auto"
            >
              <div className="px-4 sm:px-6 py-4 flex flex-col text-sm font-semibold tracking-wider">
                {navLinks.map((l) => {
                  const isActive = l.href !== '#' && pathname === l.href;
                  return (
                    <Link
                      key={l.label}
                      href={l.href}
                      onClick={closeMobileMenu}
                      className={
                        isActive
                          ? 'text-amber-400 py-3.5 border-b border-white/5'
                          : 'text-white/80 active:text-white py-3.5 border-b border-white/5'
                      }
                    >
                      {l.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </details>

          <Link
            id="connect-wallet"
            href="#"
            className="relative z-10 bg-amber-400 active:bg-amber-300 text-black text-[10px] font-bold px-3 py-2.5 rounded-xl whitespace-nowrap"
          >
            WALLET
          </Link>
        </div>

        <Link
          id="connect-wallet-desktop"
          href="#"
          className="hidden md:inline-flex bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold px-6 py-3 rounded-xl whitespace-nowrap transition-colors"
        >
          CONNECT WALLET
        </Link>
      </div>
    </nav>
  );
}
