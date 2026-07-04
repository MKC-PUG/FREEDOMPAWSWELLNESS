type Props = {
  percent: number;
  label: string;
  variant?: 'amber' | 'violet' | 'emerald';
  className?: string;
};

const BAR: Record<NonNullable<Props['variant']>, string> = {
  amber: 'bg-amber-400',
  violet: 'bg-violet-400',
  emerald: 'bg-emerald-400',
};

export default function TaskProgressBar({
  percent,
  label,
  variant = 'amber',
  className = '',
}: Props) {
  const value = Math.min(100, Math.max(0, Math.round(percent)));

  return (
    <div className={className}>
      <div className="mb-1.5 flex items-center justify-between gap-3 text-xs">
        <span className="text-white/70 leading-snug">{label}</span>
        <span className="shrink-0 font-bold tabular-nums text-white/90">{value}%</span>
      </div>
      <div
        className="h-2 overflow-hidden rounded-full bg-white/10"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <div
          className={`h-full rounded-full transition-[width] duration-500 ease-out ${BAR[variant]}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
