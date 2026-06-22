import type { ReactNode } from 'react';

export function VitProPageShell({
  title,
  subtitle,
  children,
  badge,
}: {
  title: string;
  subtitle?: string;
  badge?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#071018] text-white font-sans">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-10">
        <header className="mb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-400/80">
              ViT Pro Clinical Decision Support
            </p>
            <h1 className="mt-2 text-2xl sm:text-3xl font-bold leading-tight">{title}</h1>
            {subtitle ? <p className="mt-2 text-sm text-white/60 max-w-2xl">{subtitle}</p> : null}
          </div>
          {badge}
        </header>
        {children}
      </div>
    </div>
  );
}

export function VitProCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-white/10 bg-white/[0.04] p-5 ${className}`}>{children}</div>
  );
}

export function VitProSection({
  title,
  children,
  action,
}: {
  title: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <section className="mb-8">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-white/90">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export function VitProBadge({
  status,
}: {
  status: 'foundation' | 'validation' | 'ready' | 'blocked';
}) {
  const styles = {
    foundation: 'bg-sky-500/20 text-sky-200 border-sky-500/40',
    validation: 'bg-amber-500/20 text-amber-200 border-amber-500/40',
    ready: 'bg-emerald-500/20 text-emerald-200 border-emerald-500/40',
    blocked: 'bg-rose-500/20 text-rose-200 border-rose-500/40',
  };
  const labels = {
    foundation: 'Phase V0',
    validation: 'Advisor review',
    ready: 'Pilot ready',
    blocked: 'Disabled',
  };
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}

export function VitProKpi({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-sky-500/20 bg-white/5 p-4">
      <p className="text-xs uppercase tracking-wide text-white/50">{label}</p>
      <p className="mt-2 text-2xl font-bold tabular-nums">{value}</p>
      {hint ? <p className="mt-1 text-xs text-white/45">{hint}</p> : null}
    </div>
  );
}
