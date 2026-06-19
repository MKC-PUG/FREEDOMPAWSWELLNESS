'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { OPS_NAV } from '@/lib/ops/nav';

function isActive(pathname: string, href: string, exact?: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function OpsNavbar() {
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

  useEffect(() => setMounted(true), []);
  useEffect(() => closeMobileMenu(), [pathname, closeMobileMenu]);

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
      className="fp-nav sticky top-0 z-[100] bg-[#0A1428] border-b border-[#F5C242]/30"
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 min-h-[var(--nav-bar-height)] py-2 sm:py-3 flex items-center justify-between gap-2">
        <Link href="/ops" className="min-w-0 flex-1 leading-tight touch-manipulation" prefetch={false}>
          <div className="font-bold text-base sm:text-lg tracking-tight truncate text-white">
            Freedom Paws Command Center
          </div>
          <div className="hidden sm:block text-xs text-[#F5C242]/90 mt-0.5">FP Ops · Owner console</div>
        </Link>

        <div className="hidden lg:flex items-center gap-1">
          {OPS_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              prefetch={false}
              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold tracking-wide touch-manipulation ${
                isActive(pathname, item.href, 'exact' in item ? item.exact : false)
                  ? 'bg-[#F5C242]/20 text-[#F5C242]'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <button
          type="button"
          className="lg:hidden min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg border border-white/15 text-white touch-manipulation"
          aria-label="Open ops menu"
          onClick={() => setMenuOpen(true)}
        >
          <span className="text-xl">☰</span>
        </button>
      </div>

      {mounted &&
        menuOpen &&
        createPortal(
          <div className="fixed inset-0 z-[200] lg:hidden">
            <button
              type="button"
              className="absolute inset-0 bg-black/70"
              aria-label="Close menu"
              onClick={closeMobileMenu}
            />
            <div className="absolute right-0 top-0 bottom-0 w-[min(100%,20rem)] bg-[#0A1428] border-l border-[#F5C242]/25 p-4 overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <span className="text-sm font-bold text-[#F5C242]">Command Center</span>
                <button
                  type="button"
                  className="text-white/70 text-2xl leading-none px-2"
                  onClick={closeMobileMenu}
                  aria-label="Close"
                >
                  ×
                </button>
              </div>
              <div className="flex flex-col gap-1">
                {OPS_NAV.map((item) => (
                  <button
                    key={item.href}
                    type="button"
                    className={`text-left px-4 py-3 rounded-xl text-sm font-bold touch-manipulation ${
                      isActive(pathname, item.href, 'exact' in item ? item.exact : false)
                        ? 'bg-[#F5C242]/20 text-[#F5C242]'
                        : 'text-white/80 hover:bg-white/5'
                    }`}
                    onClick={() => navigateFromMenu(item.href)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>,
          document.body
        )}
    </nav>
  );
}
