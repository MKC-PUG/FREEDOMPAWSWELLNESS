import type { ReactNode } from 'react';

type Variant = 'solid' | 'glass' | 'dashed';

const variantClass: Record<Variant, string> = {
  solid: 'bg-[#1F2A44] border border-white/10',
  glass: 'bg-[#0F1E38]/85 backdrop-blur-sm border border-white/10',
  dashed: 'bg-[#0F1E38]/50 border border-dashed border-white/15',
};

type Padding = 'md' | 'lg';

const paddingClass: Record<Padding, string> = {
  md: 'p-5 sm:p-6',
  lg: 'p-7 sm:p-8',
};

type Props = {
  children: ReactNode;
  className?: string;
  variant?: Variant;
  padding?: Padding;
};

export default function SectionCard({
  children,
  className = '',
  variant = 'solid',
  padding = 'md',
}: Props) {
  return (
    <div
      className={`rounded-2xl ${variantClass[variant]} ${paddingClass[padding]} ${className}`}
    >
      {children}
    </div>
  );
}
