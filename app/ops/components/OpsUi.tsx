import type { ReactNode } from 'react';

export function OpsPageShell({
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
    <div className="min-h-screen bg-[#0A1428] text-white font-sans">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-10">
        <header className="mb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#F5C242]/80">
              Freedom Paws Ops
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

export function OpsKpiCard({
  label,
  value,
  hint,
  accent = 'gold',
}: {
  label: string;
  value: string | number;
  hint?: string;
  accent?: 'gold' | 'emerald' | 'amber' | 'rose';
}) {
  const border =
    accent === 'emerald'
      ? 'border-emerald-500/30'
      : accent === 'amber'
        ? 'border-amber-500/30'
        : accent === 'rose'
          ? 'border-rose-500/30'
          : 'border-[#F5C242]/25';

  return (
    <div className={`rounded-2xl border ${border} bg-white/5 p-4`}>
      <p className="text-xs uppercase tracking-wide text-white/50">{label}</p>
      <p className="mt-2 text-2xl font-bold tabular-nums">{value}</p>
      {hint ? <p className="mt-1 text-xs text-white/45">{hint}</p> : null}
    </div>
  );
}

export function OpsSection({
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

export function OpsStatusBadge({
  status,
}: {
  status: 'active' | 'dormant' | 'warning' | 'ready' | 'blocked';
}) {
  const styles = {
    active: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    dormant: 'bg-white/10 text-white/60 border-white/20',
    warning: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    ready: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
    blocked: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
  };
  const labels = {
    active: 'Active',
    dormant: 'Dormant',
    warning: 'Needs attention',
    ready: 'Ready',
    blocked: 'Blocked',
  };
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}

export function OpsConfigRow({
  label,
  ok,
  detail,
}: {
  label: string;
  ok: boolean;
  detail?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-white/10 last:border-0">
      <div>
        <p className="text-sm font-medium">{label}</p>
        {detail ? <p className="text-xs text-white/50 mt-0.5">{detail}</p> : null}
      </div>
      <span className={`text-xs font-bold shrink-0 ${ok ? 'text-emerald-400' : 'text-amber-400'}`}>
        {ok ? 'OK' : 'Missing'}
      </span>
    </div>
  );
}

export function OpsCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-5 ${className}`}>
      {children}
    </div>
  );
}

export function OpsExternalLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-sm text-[#F5C242] hover:underline"
    >
      {label} ↗
    </a>
  );
}
