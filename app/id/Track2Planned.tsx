import Link from 'next/link';
import BackLink from '@/app/components/BackLink';

type Props = {
  title: string;
  subtitle: string;
  icon: string;
  targetDate: string;
  bullets: string[];
};

export default function Track2Planned({ title, subtitle, icon, targetDate, bullets }: Props) {
  return (
    <div className="min-h-screen bg-[#0A1625] text-white font-sans">
      <div className="mx-auto max-w-lg px-6 py-10">
        <BackLink href="/id" label="Back to ID hub" />

        <header className="mt-4 mb-8 text-center">
          <span className="text-4xl" aria-hidden>
            {icon}
          </span>
          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
            Track 2 · Planned
          </p>
          <h1 className="mt-2 text-2xl font-bold">{title}</h1>
          <p className="mt-3 text-sm text-white/65 leading-relaxed">{subtitle}</p>
          <p className="mt-4 inline-block rounded-full border border-amber-500/40 bg-amber-900/20 px-4 py-1 text-xs font-semibold text-amber-300">
            Target: {targetDate}
          </p>
        </header>

        <ul className="space-y-3 mb-8">
          {bullets.map((b) => (
            <li
              key={b}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/75"
            >
              {b}
            </li>
          ))}
        </ul>

        <div className="space-y-3">
          <Link
            href="/id/enroll"
            className="block w-full rounded-2xl border-2 border-emerald-500/40 bg-emerald-900/20 py-4 text-center font-bold text-emerald-300 hover:bg-emerald-900/30 transition"
          >
            Enroll biometric ID now →
          </Link>
          <Link
            href="/diagnostics?mode=identity"
            className="block w-full rounded-2xl border border-white/20 py-3 text-center text-sm text-white/60 hover:bg-white/5 transition"
          >
            Test ViT identity capture
          </Link>
        </div>

        <p className="mt-8 text-center text-[10px] text-white/40 leading-relaxed">
          Biometric pilot launches Oct 1, 2026 (Tennessee). Track 2 ships after pilot validation.
          Phones cannot read implanted microchips — hardware scanner required.
        </p>
      </div>
    </div>
  );
}
