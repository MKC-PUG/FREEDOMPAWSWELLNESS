import Link from 'next/link';

type Props = {
  href?: string;
  label?: string;
};

/** Large tap target back navigation for mobile PWA. */
export default function BackLink({ href = '/', label = 'Back to Home' }: Props) {
  return (
    <Link
      href={href}
      prefetch={false}
      className="inline-flex items-center gap-2 min-h-[48px] py-2 mb-2 text-sm font-semibold text-white/70 hover:text-white active:text-amber-400 transition-colors touch-manipulation select-none"
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      <span aria-hidden="true" className="text-xl leading-none">
        ←
      </span>
      {label}
    </Link>
  );
}
