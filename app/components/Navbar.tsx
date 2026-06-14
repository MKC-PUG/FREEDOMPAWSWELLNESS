'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const discordInviteUrl = process.env.NEXT_PUBLIC_FP_DISCORD_INVITE_URL?.trim() || '';

const navLinks = [
  { label: 'HOME', href: '/' },
  { label: 'VIT DIAGNOSTICS', href: '/diagnostics' },
  { label: 'SUPERBUD PHOTO BOOTH', href: '/photobooth' },
  { label: 'MY PETS', href: '/mypets' },
  { label: 'FREEDOM PAWS ID', href: '/id' },
  { label: 'WELLNESS', href: '/wellness' },
  { label: 'PROTOCOL OVERVIEW', href: '/protocols' },
  { label: 'MONITOR MY DOG', href: '/monitor' },
  discordInviteUrl
    ? { label: 'COMMUNITY DISCORD', href: discordInviteUrl, external: true }
    : { label: 'JOIN COMMUNITY', href: '/waitlist' },
  { label: 'TOKEN SHOP', href: '/token-shop' },
] as const;

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const closeMobileMenu = useCallback(() => setMenuOpen(false), []);

  const navigateFromMenu = useCallback(
    (href: string) => {
      closeMobileMenu();
      if (href === pathname) return;
      router.push(href);
    },
    [closeMobileMenu, pathname, router]
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    closeMobileMenu();
  }, [pathname, closeMobileMenu]);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  return (
    <nav
      className="fp-nav sticky top-0 z-[100] bg-[#0A1625] border-b border-white/10"
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 min-h-[var(--nav-bar-height)] py-2 sm:py-3 flex items-center justify-between gap-2 sm:gap-6">
        <Link
          href="/"
          className="min-w-0 flex-1 leading-tight touch-manipulation"
          prefetch={false}
          onClick={closeMobileMenu}
        >
          <div className="font-bold text-base sm:text-2xl tracking-tight truncate text-white">
            Freedom Paws Wellness
          </div>
          <div className="hidden sm:block text-xs text-amber-400 mt-0.5">Honor Buddy&apos;s Legacy</div>
        </Link>

        <div className="fp-nav-desktop hidden md:flex items-center gap-3 lg:gap-5 text-[10px] lg:text-xs font-semibold tracking-wider">
          {navLinks.map((l) => {
            const isExternal = 'external' in l && l.external;
            const isActive =
              !isExternal &&
              (pathname === l.href ||
                (l.href === '/id' && pathname.startsWith('/id')) ||
                (l.href === '/wellness' && pathname.startsWith('/wellness')));
            if (isExternal) {
              return (
                <a
                  key={l.label}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-white transition-colors whitespace-nowrap py-2"
                >
                  {l.label}
                </a>
              );
            }
            return (
              <Link
                key={l.label}
                href={l.href}
                prefetch={false}
                className={
                  isActive
                    ? 'text-amber-400 whitespace-nowrap py-2'
                    : 'text-white/80 hover:text-white transition-colors whitespace-nowrap py-2'
                }
              >
                {l.label}
              </Link>
            );
          })}
        </div>

        <div className="fp-nav-mobile flex shrink-0 items-center gap-2 sm:gap-3 md:hidden">
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            className="relative z-[101] inline-flex shrink-0 items-center justify-center min-w-[48px] min-h-[48px] w-12 h-12 rounded-lg border border-white/15 bg-[#0A1625] text-white text-2xl leading-none active:bg-white/20 touch-manipulation select-none"
            style={{ WebkitTapHighlightColor: 'transparent' }}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? '✕' : '☰'}
          </button>

          <Link
            id="connect-wallet"
            href="/token-shop"
            prefetch={false}
            className="relative z-[101] bg-amber-400 active:bg-amber-300 text-black text-[10px] font-bold px-3 min-h-[48px] inline-flex items-center rounded-xl whitespace-nowrap touch-manipulation"
          >
            WALLET
          </Link>
        </div>

        <Link
          id="connect-wallet-desktop"
          href="/token-shop"
          prefetch={false}
          className="hidden md:inline-flex bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold px-6 py-3 rounded-xl whitespace-nowrap transition-colors"
        >
          CONNECT WALLET
        </Link>
      </div>

      {mounted &&
        menuOpen &&
        createPortal(
          <>
            <button
              type="button"
              className="fp-mobile-menu-backdrop fixed inset-0 z-[200] bg-black/60 md:hidden touch-manipulation"
              aria-label="Close menu"
              onClick={closeMobileMenu}
            />
            <div
              id="mobile-menu"
              className="fp-mobile-menu-panel fixed left-0 right-0 z-[201] border-t border-white/10 bg-[#0A1625] shadow-xl shadow-black/40 overflow-y-auto md:hidden"
              style={{
                top: 'var(--nav-total-height)',
                maxHeight: 'calc(100dvh - var(--nav-total-height))',
                paddingBottom: 'env(safe-area-inset-bottom, 0px)',
              }}
            >
              <div className="px-4 sm:px-6 py-2 flex flex-col text-sm font-semibold tracking-wide">
                {navLinks.map((l) => {
                  const isExternal = 'external' in l && l.external;
                  const isActive =
                    !isExternal &&
                    (pathname === l.href ||
                      (l.href === '/id' && pathname.startsWith('/id')) ||
                      (l.href === '/wellness' && pathname.startsWith('/wellness')));
                  if (isExternal) {
                    return (
                      <a
                        key={l.label}
                        href={l.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={closeMobileMenu}
                        className="text-white/90 active:text-white min-h-[52px] flex items-center border-b border-white/5 touch-manipulation"
                        style={{ WebkitTapHighlightColor: 'transparent' }}
                      >
                        {l.label}
                      </a>
                    );
                  }
                  return (
                    <Link
                      key={l.label}
                      href={l.href}
                      prefetch={false}
                      onClick={(e) => {
                        e.preventDefault();
                        navigateFromMenu(l.href);
                      }}
                      className={
                        isActive
                          ? 'text-amber-400 min-h-[52px] flex items-center border-b border-white/5 touch-manipulation'
                          : 'text-white/90 active:text-white min-h-[52px] flex items-center border-b border-white/5 touch-manipulation'
                      }
                      style={{ WebkitTapHighlightColor: 'transparent' }}
                    >
                      {l.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </>,
          document.body
        )}
    </nav>
  );
}
