'use client';

import Image from 'next/image';
import Link from 'next/link';
import { BRAND_LOGO_PAW } from '@/lib/brand/paths';

type Variant = 'consumer' | 'partner' | 'ops' | 'vitpro';
type Size = 'nav' | 'hero';

type Props = {
  href?: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  onClick?: () => void;
};

const TITLES: Record<Variant, string> = {
  consumer: 'Freedom Paws Wellness',
  partner: 'Freedom Paws Adoption Network',
  ops: 'Freedom Paws Command Center',
  vitpro: 'ViT Pro™ CDS',
};

const SUBTITLES: Record<Variant, string | null> = {
  consumer: "Honor Buddy's Legacy",
  partner: 'Partner portal · Tennessee pilot',
  ops: 'FP Ops · Owner console',
  vitpro: 'Freedom Paws · Clinical decision support',
};

const SUBTITLE_ACCENT: Record<Variant, string> = {
  consumer: 'text-amber-400',
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
  const title = TITLES[variant];
  const subtitle = SUBTITLES[variant];

  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2 sm:gap-3 shrink-0 touch-manipulation min-w-0 ${className}`}
      prefetch={false}
      onClick={onClick}
      aria-label={title}
    >
      <Image
        src={BRAND_LOGO_PAW}
        alt=""
        width={isHero ? 80 : 40}
        height={isHero ? 80 : 40}
        className={
          isHero
            ? 'shrink-0 w-16 h-16 sm:w-20 sm:h-20 object-contain'
            : 'shrink-0 w-9 h-9 sm:w-10 sm:h-10 object-contain'
        }
        priority
        aria-hidden
      />
      <div className="min-w-0 leading-tight text-left">
        <div
          className={`font-bold tracking-tight truncate text-white ${
            isHero ? 'text-xl sm:text-2xl' : 'text-base sm:text-xl lg:text-2xl'
          }`}
        >
          {title}
        </div>
        {subtitle ? (
          <div
            className={`${isHero ? 'text-sm' : 'hidden sm:block text-xs'} mt-0.5 truncate ${SUBTITLE_ACCENT[variant]}`}
          >
            {subtitle}
          </div>
        ) : null}
      </div>
    </Link>
  );
}
