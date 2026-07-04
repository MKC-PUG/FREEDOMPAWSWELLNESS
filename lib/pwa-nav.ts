import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

/** Release scroll locks left by Photo Booth drawers or the mobile nav menu. */
export function clearPwaBodyScrollLock() {
  if (typeof document === 'undefined') return;
  document.body.style.overflow = '';
  document.body.style.position = '';
}

function isStandalonePwa(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    ('standalone' in navigator &&
      (navigator as Navigator & { standalone?: boolean }).standalone === true)
  );
}

/** Full document navigation — only when leaving Photo Booth on iOS PWA (scroll lock / stale canvas). */
export function shouldUseHardPwaNav(currentPath: string): boolean {
  if (typeof window === 'undefined') return false;
  if (!currentPath.startsWith('/photobooth')) return false;
  return isStandalonePwa() && /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

export function navigatePwa(
  href: string,
  router: AppRouterInstance,
  options?: { currentPath?: string; replace?: boolean }
) {
  if (typeof window === 'undefined') return;

  clearPwaBodyScrollLock();

  const current = options?.currentPath ?? window.location.pathname;
  const targetPath = href.split('#')[0].split('?')[0];
  const currentPath = current.split('#')[0].split('?')[0];
  if (targetPath === currentPath && !href.includes('#')) return;

  if (shouldUseHardPwaNav(currentPath)) {
    if (options?.replace) window.location.replace(href);
    else window.location.assign(href);
    return;
  }

  if (options?.replace) router.replace(href);
  else router.push(href);
}
