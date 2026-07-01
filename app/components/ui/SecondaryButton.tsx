import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'gold' | 'emerald' | 'neutral';

const variantClass: Record<Variant, string> = {
  gold: 'border-amber-400/50 text-amber-300 hover:border-amber-400 active:bg-amber-400/10',
  emerald: 'border-emerald-500/40 text-emerald-300 hover:border-emerald-400 active:bg-emerald-500/10',
  neutral: 'border-white/20 text-white/70 hover:border-white/40 active:bg-white/5',
};

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: Variant;
  fullWidth?: boolean;
};

export default function SecondaryButton({
  children,
  variant = 'gold',
  fullWidth = false,
  className = '',
  type = 'button',
  ...rest
}: Props) {
  return (
    <button
      type={type}
      className={`min-h-[52px] px-6 py-3 rounded-2xl border font-semibold text-sm transition touch-manipulation active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none ${variantClass[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      style={{ WebkitTapHighlightColor: 'transparent' }}
      {...rest}
    >
      {children}
    </button>
  );
}
