'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import BrandLogo from '@/app/components/BrandLogo';

const discordInviteUrl = process.env.NEXT_PUBLIC_FP_DISCORD_INVITE_URL?.trim() || '';

const navLinks = [
  { label: 'HOME', href: '/' },
  { label: 'VIT DIAGNOSTICS', href: '/diagnostics' },
  { label: 'PHOTO BOOTH', href: '/photobooth' },
  { label: 'MY PETS', href: '/mypets' },
  { label: 'FREEDOM PAWS ID', href: '/id' },
  { label: 'WELLNESS', href: '/wellness' },
  { label: 'PROTOCOLS', href: '/protocols' },
  { label: 'MONITOR', href: '/monitor' },
  discordInviteUrl
    ? { label: 'DISCORD', href: discordInviteUrl, external: true }
    : { label: 'COMMUNITY', href: '/waitlist' },
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
      <div className="max-w-7xl mx-auto px-3 sm:px-6 min-h-[var(--nav-bar-height)] py-1.5 sm:py-2 flex items-center gap-2 sm:gap-3">
        <BrandLogo href="/" variant="consumer" onClick={closeMobileMenu} />

        <div className="fp-nav-desktop hidden md:flex flex-1 min-w-0 fp-nav-links-scroll items-center justify-end gap-2 lg:gap-3 xl:gap-4 text-[9px] lg:text-[10px] xl:text-xs font-semibold tracking-wide pr-1">
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
                  className="text-white/80 hover:text-white transition-colors whitespace-nowrap py-2 shrink-0"
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
                    ? 'text-amber-400 whitespace-nowrap py-2 shrink-0'
                    : 'text-white/80 hover:text-white transition-colors whitespace-nowrap py-2 shrink-0'
                }
              >
                {l.label}
              </Link>
            );
          })}
        </div>

        <div className="fp-nav-mobile flex shrink-0 items-center gap-2 md:hidden ml-auto">
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            className="relative z-[101] inline-flex shrink-0 items-center justify-center min-w-[44px] min-h-[44px] w-11 h-11 rounded-lg border border-white/15 bg-[#0A1625] text-white text-xl leading-none active:bg-white/20 touch-manipulation select-none"
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
            className="relative z-[101] bg-amber-400 active:bg-amber-300 text-black text-[10px] font-bold px-3 min-h-[44px] inline-flex items-center rounded-xl whitespace-nowrap touch-manipulation"
          >
            WALLET
          </Link>
        </div>

        <Link
          id="connect-wallet-desktop"
          href="/token-shop"
          prefetch={false}
          className="hidden md:inline-flex shrink-0 bg-amber-400 hover:bg-amber-300 text-black text-[10px] xl:text-xs font-bold px-4 xl:px-6 py-2.5 xl:py-3 rounded-xl whitespace-nowrap transition-colors"
        >
          WALLET
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
