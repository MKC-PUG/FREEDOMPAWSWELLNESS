'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { PARTNER_NAV } from '@/lib/partner/nav';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase/config';

type Props = {
  userEmail?: string | null;
};

export default function PartnerNavbar({ userEmail = null }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const signedIn = Boolean(userEmail);

  const closeMobileMenu = useCallback(() => setMenuOpen(false), []);

  const navigateFromMenu = useCallback(
    (href: string) => {
      closeMobileMenu();
      if (href === pathname) return;
      router.push(href);
    },
    [closeMobileMenu, pathname, router]
  );

  const signOut = useCallback(async () => {
    closeMobileMenu();
    setSigningOut(true);
    try {
      if (isSupabaseConfigured()) {
        const supabase = createSupabaseBrowserClient();
        await supabase.auth.signOut();
      }
    } catch {
      // Still redirect — session cookie may already be cleared.
    } finally {
      setSigningOut(false);
      router.push('/partner');
      router.refresh();
    }
  }, [closeMobileMenu, router]);

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

  const navItems = PARTNER_NAV.filter((l) => l.label !== 'SIGN IN');
  const signInNext =
    pathname.startsWith('/login') || pathname === '/' ? '/partner' : pathname;
  const signInHref = `/login?next=${encodeURIComponent(signInNext)}`;

  return (
    <nav
      className="fp-nav sticky top-0 z-[100] bg-[#0A1625] border-b border-emerald-500/25"
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 min-h-[var(--nav-bar-height)] py-2 sm:py-3 flex items-center justify-between gap-2 sm:gap-6">
        <Link
          href="/partner"
          className="min-w-0 flex-1 leading-tight touch-manipulation"
          prefetch={false}
          onClick={closeMobileMenu}
        >
          <div className="font-bold text-base sm:text-xl tracking-tight truncate text-white">
            Freedom Paws Adoption Network
          </div>
          <div className="hidden sm:block text-xs text-emerald-400/90 mt-0.5">
            Partner portal · Tennessee pilot
          </div>
        </Link>

        <div className="fp-nav-desktop hidden md:flex items-center gap-3 lg:gap-5 text-[10px] lg:text-xs font-semibold tracking-wider">
          {navItems.map((l) => {
            const isActive =
              pathname === l.href ||
              (l.href === '/partner' && pathname === '/partner') ||
              (l.href === '/partner/listings' && pathname.startsWith('/partner/listings')) ||
              (l.href === '/id/found' && pathname.startsWith('/id/found')) ||
              (l.href === '/id/match' && pathname.startsWith('/id/match'));
            return (
              <Link
                key={l.label}
                href={l.href}
                prefetch={false}
                className={
                  isActive
                    ? 'text-emerald-400 whitespace-nowrap py-2'
                    : 'text-white/80 hover:text-white transition-colors whitespace-nowrap py-2'
                }
              >
                {l.label}
              </Link>
            );
          })}
          {!signedIn ? (
            <Link
              href={signInHref}
              prefetch={false}
              className="text-white/80 hover:text-white transition-colors whitespace-nowrap py-2"
            >
              SIGN IN
            </Link>
          ) : null}
        </div>

        <div className="fp-nav-mobile flex shrink-0 items-center md:hidden">
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            className="relative z-[101] inline-flex shrink-0 items-center justify-center min-w-[48px] min-h-[48px] w-12 h-12 rounded-lg border border-emerald-500/30 bg-[#0A1625] text-white text-2xl leading-none active:bg-white/20 touch-manipulation select-none"
            aria-expanded={menuOpen}
            aria-controls="partner-mobile-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {signedIn ? (
        <div className="border-t border-emerald-500/15 bg-emerald-950/25">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex items-center justify-between gap-3 text-xs">
            <p className="min-w-0 truncate text-white/60">
              Signed in as <span className="font-medium text-white/90">{userEmail}</span>
            </p>
            <button
              type="button"
              disabled={signingOut}
              onClick={() => void signOut()}
              className="shrink-0 rounded-lg border border-white/20 px-3 py-1.5 font-semibold text-white/80 hover:text-white hover:border-white/35 disabled:opacity-50 touch-manipulation"
            >
              {signingOut ? 'Signing out…' : 'Sign out'}
            </button>
          </div>
        </div>
      ) : null}

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
              id="partner-mobile-menu"
              className="fp-mobile-menu-panel fixed left-0 right-0 z-[201] border-t border-emerald-500/20 bg-[#0A1625] shadow-xl shadow-black/40 overflow-y-auto md:hidden"
              style={{
                top: 'var(--nav-total-height)',
                maxHeight: 'calc(100dvh - var(--nav-total-height))',
                paddingBottom: 'env(safe-area-inset-bottom, 0px)',
              }}
            >
              <div className="px-4 sm:px-6 py-2 flex flex-col text-sm font-semibold tracking-wide">
                {navItems.map((l) => {
                  const isActive = pathname === l.href || pathname.startsWith(`${l.href}/`);
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
                          ? 'text-emerald-400 min-h-[52px] flex items-center border-b border-white/5 touch-manipulation'
                          : 'text-white/90 active:text-white min-h-[52px] flex items-center border-b border-white/5 touch-manipulation'
                      }
                    >
                      {l.label}
                    </Link>
                  );
                })}
                {!signedIn ? (
                  <Link
                    href={signInHref}
                    prefetch={false}
                    onClick={(e) => {
                      e.preventDefault();
                      navigateFromMenu(signInHref);
                    }}
                    className="text-white/90 active:text-white min-h-[52px] flex items-center border-b border-white/5 touch-manipulation"
                  >
                    SIGN IN
                  </Link>
                ) : (
                  <button
                    type="button"
                    disabled={signingOut}
                    onClick={() => void signOut()}
                    className="text-left text-white/90 active:text-white min-h-[52px] flex items-center border-b border-white/5 touch-manipulation disabled:opacity-50"
                  >
                    {signingOut ? 'Signing out…' : 'SIGN OUT'}
                  </button>
                )}
              </div>
            </div>
          </>,
          document.body
        )}
    </nav>
  );
}
