import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'gold' | 'emerald';

const variantClass: Record<Variant, string> = {
  gold: 'bg-[#F5C242] hover:bg-white active:bg-amber-300 text-black',
  emerald: 'bg-emerald-400 hover:bg-emerald-400/90 active:bg-emerald-300 text-black',
};

type Size = 'md' | 'lg';

const sizeClass: Record<Size, string> = {
  md: 'min-h-[52px] px-6 py-3 text-sm rounded-2xl',
  lg: 'min-h-[52px] px-10 py-4 text-lg rounded-2xl',
};

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
};

export default function PrimaryButton({
  children,
  variant = 'gold',
  size = 'md',
  fullWidth = false,
  className = '',
  type = 'button',
  ...rest
}: Props) {
  return (
    <button
      type={type}
      className={`font-bold transition touch-manipulation active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none ${variantClass[variant]} ${sizeClass[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      style={{ WebkitTapHighlightColor: 'transparent' }}
      {...rest}
    >
      {children}
    </button>
  );
}
