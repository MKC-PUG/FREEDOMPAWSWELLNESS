import type { ReactNode } from 'react';
import BackLink from '@/app/components/BackLink';

const maxWidthClass = {
  lg: 'max-w-lg',
  '2xl': 'max-w-2xl',
  '5xl': 'max-w-5xl',
  '6xl': 'max-w-6xl',
  '7xl': 'max-w-7xl',
} as const;

type MaxWidth = keyof typeof maxWidthClass;

type Props = {
  children: ReactNode;
  maxWidth?: MaxWidth;
  backLink?: { href: string; label: string };
  className?: string;
  innerClassName?: string;
};

export default function PageShell({
  children,
  maxWidth = '5xl',
  backLink,
  className = '',
  innerClassName = '',
}: Props) {
  return (
    <div className={`min-h-screen bg-[#0A1428] text-white font-sans ${className}`}>
      <div
        className={`mx-auto px-6 py-8 sm:py-10 pb-20 ${maxWidthClass[maxWidth]} ${innerClassName}`}
      >
        {backLink ? <BackLink href={backLink.href} label={backLink.label} /> : null}
        {children}
      </div>
    </div>
  );
}
