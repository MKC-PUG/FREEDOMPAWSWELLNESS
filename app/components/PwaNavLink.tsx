'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { navigatePwa, shouldUseHardPwaNav } from '@/lib/pwa-nav';

type Props = Omit<ComponentPropsWithoutRef<typeof Link>, 'href' | 'prefetch'> & {
  href: string;
  children: ReactNode;
};

/** Same-origin nav — hard navigation only when leaving Photo Booth on iOS PWA. */
export default function PwaNavLink({ href, onClick, children, className, ...rest }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Link
      href={href}
      scroll
      className={className}
      style={{ WebkitTapHighlightColor: 'transparent' }}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented) return;
        if (!shouldUseHardPwaNav(pathname)) return;
        e.preventDefault();
        navigatePwa(href, router, { currentPath: pathname });
      }}
      {...rest}
    >
      {children}
    </Link>
  );
}
