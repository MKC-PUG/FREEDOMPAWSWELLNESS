'use client';

import Image from 'next/image';
import Link from 'next/link';
import { BRAND_LOGO_HERO, BRAND_LOGO_NAV } from '@/lib/brand/paths';

type Variant = 'consumer' | 'partner' | 'ops' | 'vitpro';
type Size = 'nav' | 'hero';

type Props = {
  href?: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  onClick?: () => void;
};

const PORTAL_LABEL: Partial<Record<Variant, string>> = {
  partner: 'Partner portal',
  ops: 'Command Center',
  vitpro: 'ViT Pro CDS',
};

const PORTAL_ACCENT: Partial<Record<Variant, string>> = {
  partner: 'text-emerald-400/90',
  ops: 'text-[#F5C242]/90',
  vitpro: 'text-sky-300/90',
};

export default function BrandLogo({
  href = '/',
  variant = 'consumer',
  size = 'nav',
  className = '',
  onClick,
}: Props) {
  const isHero = size === 'hero';
  const portalLabel = variant !== 'consumer' ? PORTAL_LABEL[variant] : null;
  const src = isHero ? BRAND_LOGO_HERO : BRAND_LOGO_NAV;
  const height = isHero ? 128 : 56;
  const width = isHero ? 128 : 56;

  return (
    <Link
      href={href}
      className={`inline-flex flex-col items-center shrink-0 touch-manipulation ${className}`}
      prefetch={false}
      onClick={onClick}
      aria-label="Freedom Paws"
    >
      <Image
        src={src}
        alt="Freedom Paws"
        width={width}
        height={height}
        className={
          isHero
            ? 'h-24 sm:h-32 w-auto object-contain'
            : 'h-12 sm:h-14 w-auto max-w-[4.5rem] sm:max-w-[5rem] object-contain'
        }
        priority
      />
      {portalLabel ? (
        <span
          className={`mt-0.5 text-[8px] sm:text-[9px] font-semibold tracking-wide whitespace-nowrap ${PORTAL_ACCENT[variant]}`}
        >
          {portalLabel}
        </span>
      ) : null}
    </Link>
  );
}
