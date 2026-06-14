import Link from 'next/link';
import { vitWellnessFunnelHints } from '@/lib/vit/wellness-funnel';

type Props = {
  primarySlug?: string | null;
  secondarySlug?: string | null;
};

export default function ViTWellnessFunnel({ primarySlug, secondarySlug }: Props) {
  const hints = vitWellnessFunnelHints(primarySlug, secondarySlug);

  return (
    <section className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-5 space-y-4">
      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-emerald-400">
          Next steps — wellness funnel
        </p>
        <p className="mt-1 text-sm text-white/65 leading-relaxed">
          Education first — explore protocol guidance and vetted Safe Picks aligned with your
          results.
        </p>
      </div>

      <ul className="space-y-3">
        {hints.map((hint) => (
          <li
            key={hint.protocolSlug}
            className="rounded-xl border border-white/10 bg-[#0A1428]/50 p-4"
          >
            <p className="text-sm font-bold text-white">{hint.protocolLabel}</p>
            <p className="mt-1 text-xs text-white/55">{hint.safePickNote}</p>
            <div className="mt-3 flex flex-col sm:flex-row gap-2">
              {hint.protocolSlug !== 'wellness' && (
                <Link
                  href={`/protocols/${hint.protocolSlug}`}
                  className="flex-1 rounded-xl border border-[#F5C242]/40 bg-[#F5C242]/10 py-2.5 text-center text-xs font-bold text-[#F5C242] hover:bg-[#F5C242]/20 transition"
                >
                  Protocol details →
                </Link>
              )}
              <Link
                href={
                  hint.protocolSlug !== 'wellness'
                    ? `/wellness/safe-products#${hint.protocolSlug}`
                    : '/wellness/safe-products'
                }
                className="flex-1 rounded-xl border border-emerald-400/40 bg-emerald-900/30 py-2.5 text-center text-xs font-bold text-emerald-200 hover:bg-emerald-900/50 transition"
              >
                Safe Picks →
              </Link>
            </div>
          </li>
        ))}
      </ul>

      <div className="flex flex-col sm:flex-row gap-2 pt-1">
        <Link
          href="/wellness"
          className="flex-1 rounded-xl border border-white/15 py-2.5 text-center text-xs font-semibold text-white/75 hover:text-white transition"
        >
          Wellness hub →
        </Link>
        <Link
          href="/id/enroll"
          className="flex-1 rounded-xl border border-amber-400/40 py-2.5 text-center text-xs font-bold text-amber-300 hover:bg-amber-950/30 transition"
        >
          Enroll Freedom Paws ID →
        </Link>
      </div>
    </section>
  );
}
