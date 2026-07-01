import type { ReactNode } from 'react';

type Variant = 'gold' | 'emerald' | 'muted';

const variantClass: Record<Variant, string> = {
  gold: 'text-amber-400',
  emerald: 'text-emerald-400',
  muted: 'text-white/50',
};

type Props = {
  children: ReactNode;
  variant?: Variant;
  className?: string;
};

export default function EyebrowLabel({ children, variant = 'gold', className = '' }: Props) {
  return (
    <p
      className={`text-xs font-semibold uppercase tracking-[0.2em] ${variantClass[variant]} ${className}`}
    >
      {children}
    </p>
  );
}
