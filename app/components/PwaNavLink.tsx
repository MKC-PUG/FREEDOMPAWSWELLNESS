'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

type Props = Omit<ComponentPropsWithoutRef<typeof Link>, 'href' | 'prefetch'> & {
  href: string;
  children: ReactNode;
};

/** Same-origin nav with router.push — reliable on iOS installed PWA (see Navbar mobile menu). */
export default function PwaNavLink({ href, onClick, children, className, ...rest }: Props) {
  const router = useRouter();

  return (
    <Link
      href={href}
      prefetch={false}
      scroll
      className={className}
      style={{ WebkitTapHighlightColor: 'transparent' }}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented) return;
        e.preventDefault();
        router.push(href);
      }}
      {...rest}
    >
      {children}
    </Link>
  );
}
