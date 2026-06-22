'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import BrandLogo from '@/app/components/BrandLogo';
import { VIT_PRO_NAV } from '@/lib/vit-pro/nav';

function isActive(pathname: string, href: string, exact?: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function VitProNavbar() {
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
      className="fp-nav sticky top-0 z-[100] bg-[#071018] border-b border-sky-500/35"
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 min-h-[var(--nav-bar-height)] py-1.5 sm:py-2 flex items-center gap-2 sm:gap-3">
        <BrandLogo href="/vit-pro" variant="vitpro" />

        <div className="hidden lg:flex flex-1 min-w-0 fp-nav-links-scroll items-center justify-end gap-1">
          {VIT_PRO_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              prefetch={false}
              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold tracking-wide touch-manipulation ${
                isActive(pathname, item.href, 'exact' in item ? item.exact : false)
                  ? 'bg-sky-500/20 text-sky-200'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/ops"
            className="ml-2 px-2.5 py-1.5 rounded-lg text-[10px] font-semibold text-white/45 hover:text-white/70"
          >
            FP Ops
          </Link>
        </div>

        <button
          type="button"
          className="lg:hidden min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg border border-white/15 text-white touch-manipulation ml-auto shrink-0"
          aria-label="Open ViT Pro menu"
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
            <div className="absolute right-0 top-0 bottom-0 w-[min(100%,20rem)] bg-[#071018] border-l border-sky-500/25 p-4 overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <span className="text-sm font-bold text-sky-300">ViT Pro</span>
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
                {VIT_PRO_NAV.map((item) => (
                  <button
                    key={item.href}
                    type="button"
                    className={`text-left px-4 py-3 rounded-xl text-sm font-bold touch-manipulation ${
                      isActive(pathname, item.href, 'exact' in item ? item.exact : false)
                        ? 'bg-sky-500/20 text-sky-200'
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
