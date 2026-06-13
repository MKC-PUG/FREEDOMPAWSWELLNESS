import type { Metadata } from 'next';
import Link from 'next/link';
import BackLink from '@/app/components/BackLink';
import WellnessPartnerPanel from '@/app/components/wellness/WellnessPartnerPanel';
import { getWellnessPartnerConfig } from '@/lib/wellness/partners';

export const metadata: Metadata = {
  title: 'Wellness Partners • Freedom Paws',
  description:
    'Holistic prevention, natural care education, telehealth referrals, and optional pet insurance — wellness-first, not pharmaceutical care.',
};

const EDUCATION_PILLARS = [
  {
    icon: '🥗',
    title: 'Non-toxic nutrition',
    body: 'Whole-food nutrition, clean water, and treats without harmful additives — aligned with our Gut Balance and protocol guidance.',
  },
  {
    icon: '🏡',
    title: 'Environment & lifestyle',
    body: 'Reduce household toxins, support movement and calm, and use ViT + protocols to catch patterns early.',
  },
  {
    icon: '🛡️',
    title: 'Prevention first',
    body: 'We empower owners with education and holistic tools. Licensed vets remain your partner for triage and diagnosis when needed.',
  },
  {
    icon: '🆔',
    title: 'ID + protection',
    body: 'Freedom Paws ID for lost-dog reunion; optional insurance for urgent-care financial gaps — not a substitute for daily wellness.',
  },
];

export default function WellnessPage() {
  const config = getWellnessPartnerConfig();

  return (
    <div className="min-h-screen bg-[#0A1625] text-white font-sans">
      <div className="mx-auto max-w-lg px-6 py-10">
        <BackLink href="/" label="Back to Home" />

        <header className="mt-6 mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">
            Holistic wellness
          </p>
          <h1 className="mt-2 text-2xl font-bold leading-tight">
            Prevention, natural care &amp; partner services
          </h1>
          <p className="mt-3 text-sm text-white/70 leading-relaxed">
            Freedom Paws is a <strong className="text-white/90">wellness platform</strong> — not a
            veterinary clinic. We do not prescribe pharmaceutical drugs. We educate dog owners on
            reducing toxicity and deficiencies, support lifestyle optimization through our 10
            protocols, and refer to licensed professionals when triage is indicated.
          </p>
        </header>

        <WellnessPartnerPanel context="wellness_hub" className="mb-8" />

        <section className="rounded-2xl border border-emerald-500/25 bg-emerald-950/15 p-5 mb-8">
          <div className="flex items-start gap-3">
            <span className="text-2xl shrink-0" aria-hidden>
              ✅
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="text-sm font-bold text-emerald-300">
                Safe Picks — non-toxic chews, toys &amp; home
              </h2>
              <p className="mt-2 text-sm text-white/65 leading-relaxed">
                Ten vetted brands for dental chews, enrichment toys, non-toxic cleaners, and
                optional monitor setup — curated for allergy, gut, and dental protocol alignment.
              </p>
              <Link
                href="/wellness/safe-products"
                className="mt-4 block w-full rounded-xl border border-emerald-400/50 bg-emerald-900/30 py-3.5 text-center text-sm font-bold text-emerald-200 hover:bg-emerald-900/50 transition touch-manipulation"
              >
                Browse Freedom Paws Safe Picks →
              </Link>
            </div>
          </div>
        </section>

        <section className="space-y-4 mb-8">
          <h2 className="text-sm font-bold uppercase tracking-wide text-white/50">
            Our approach
          </h2>
          <ul className="space-y-3">
            {EDUCATION_PILLARS.map((p) => (
              <li
                key={p.title}
                className="rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <span className="text-2xl" aria-hidden>
                  {p.icon}
                </span>
                <h3 className="mt-2 font-semibold">{p.title}</h3>
                <p className="mt-1 text-sm text-white/65 leading-relaxed">{p.body}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-5 mb-8">
          <h2 className="text-sm font-bold text-amber-300">When to see a veterinarian</h2>
          <p className="mt-2 text-sm text-white/65 leading-relaxed">
            If ViT flags urgent signs, or your dog has sudden pain, collapse, breathing difficulty,
            uncontrolled bleeding, or other emergency symptoms — seek{' '}
            <strong className="text-white/85">in-person veterinary care immediately</strong>.
            Holistic telehealth is for guidance and wellness planning; it does not replace emergency
            treatment.
          </p>
        </section>

        <section className="rounded-2xl border border-amber-400/30 bg-amber-950/20 p-5 mb-8">
          <div className="flex items-start gap-3">
            <span className="text-2xl shrink-0" aria-hidden>
              🛡️
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="text-sm font-bold text-amber-300">Pet insurance — protect what wellness builds</h2>
              <p className="mt-2 text-sm text-white/65 leading-relaxed">
                Daily prevention — clean nutrition, our protocols, and lifestyle — is the foundation.
                Pet insurance helps close the{' '}
                <strong className="text-white/85">financial gap</strong> when urgent care, surgery,
                or emergencies happen despite your best efforts. Pair with{' '}
                <Link href="/id/enroll" className="text-amber-400/90 underline hover:text-amber-300">
                  Freedom Paws ID
                </Link>{' '}
                for lost-dog peace of mind; many plans include recovery and emergency benefits.
              </p>
              <ul className="mt-3 space-y-1.5 text-sm text-white/60 list-disc pl-5">
                <li>Compare plans before a crisis — only ~3–4% of U.S. dogs are insured today</li>
                <li>Wellness-first: insurance complements natural care; it does not replace it</li>
                <li>Freedom Paws is not an insurer — we refer to licensed partner programs</li>
              </ul>
              {config.insurance.enabled && config.insurance.quoteUrl ? (
                <a
                  href={config.insurance.quoteUrl}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="mt-4 block w-full rounded-xl bg-amber-400 py-3.5 text-center text-sm font-bold text-black hover:bg-amber-300 transition touch-manipulation"
                >
                  Get a pet insurance quote
                  {config.insurance.partnerName ? (
                    <span className="block text-[10px] font-semibold text-black/70 mt-0.5">
                      via {config.insurance.partnerName} ↗
                    </span>
                  ) : null}
                </a>
              ) : (
                <div className="mt-4 rounded-xl border border-amber-500/25 bg-amber-950/30 px-4 py-3">
                  <p className="text-sm text-amber-200/90 font-semibold text-center">
                    Partner quotes launching soon
                  </p>
                  <p className="mt-1 text-xs text-white/50 text-center leading-relaxed">
                    We&apos;re onboarding mission-aligned insurers with member discounts. Enroll in{' '}
                    <Link href="/id/enroll" className="text-amber-400/90 underline">
                      Freedom Paws ID
                    </Link>{' '}
                    now — insurance options appear here and after ViT when partners go live.
                  </p>
                </div>
              )}
              <p className="mt-3 text-[10px] text-white/40 leading-relaxed">
                {config.insurance.disclosure}
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-emerald-400/30 bg-emerald-950/20 p-5 mb-8">
          <div className="flex items-start gap-3">
            <span className="text-2xl shrink-0" aria-hidden>
              🌿
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="text-sm font-bold text-emerald-300">
                Holistic telehealth — wellness guidance, not emergency care
              </h2>
              <p className="mt-2 text-sm text-white/65 leading-relaxed">
                For mild-to-moderate concerns, nutrition questions, and lifestyle planning, connect
                with <strong className="text-white/85">integrative veterinarians</strong> aligned
                with our prevention-first approach. Telehealth supports whole-food nutrition,
                supplementation education, and behavior — not pharmaceutical-first care plans.
              </p>
              <p className="mt-2 text-xs text-white/50 leading-relaxed">
                {config.telehealth.focusNote}
              </p>
              <ul className="mt-3 space-y-1.5 text-sm text-white/60 list-disc pl-5">
                <li>Ideal after ViT when you want professional guidance without an ER visit</li>
                <li>Not a substitute for in-person care when urgent signs appear</li>
                <li>Independent licensed providers — Freedom Paws does not diagnose or treat</li>
              </ul>
              {config.telehealth.enabled && config.telehealth.bookUrl ? (
                <a
                  href={config.telehealth.bookUrl}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="mt-4 block w-full rounded-xl border border-emerald-400/60 bg-emerald-900/40 py-3.5 text-center text-sm font-bold text-emerald-200 hover:bg-emerald-900/60 transition touch-manipulation"
                >
                  Book holistic vet telehealth
                  {config.telehealth.partnerName ? (
                    <span className="block text-[10px] font-semibold text-emerald-300/70 mt-0.5">
                      via {config.telehealth.partnerName} ↗
                    </span>
                  ) : null}
                </a>
              ) : (
                <div className="mt-4 rounded-xl border border-emerald-500/25 bg-emerald-950/30 px-4 py-3">
                  <p className="text-sm text-emerald-200/90 font-semibold text-center">
                    Holistic telehealth partners onboarding
                  </p>
                  <p className="mt-1 text-xs text-white/50 text-center leading-relaxed">
                    We&apos;re signing integrative vet telehealth programs with member discounts.{' '}
                    <Link href="/diagnostics" className="text-emerald-400/90 underline">
                      Run ViT Diagnostics
                    </Link>{' '}
                    today — partner booking links appear here and in your results when live.
                  </p>
                </div>
              )}
              <p className="mt-3 text-[10px] text-white/40 leading-relaxed">
                {config.telehealth.disclosure}
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-amber-400/20 bg-amber-950/15 p-5 mb-8">
          <h2 className="text-sm font-bold text-amber-300">Partner program (for affiliates)</h2>
          <p className="mt-2 text-sm text-white/65 leading-relaxed">
            Prospective insurance and holistic telehealth partners can review our acceptance
            standards, recommended financial structures, and wellness-first requirements before
            applying.
          </p>
          <div className="mt-4 grid grid-cols-1 gap-2">
            <Link
              href="/wellness/partners"
              className="rounded-xl border border-white/10 bg-[#0A1625]/50 py-3 text-center text-sm font-bold text-amber-300 hover:border-amber-400/40 transition"
            >
              View partner program overview →
            </Link>
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/wellness/partners/insurance"
                className="rounded-xl border border-white/10 py-2.5 text-center text-xs font-semibold text-white/70 hover:text-white transition"
              >
                Insurance standards
              </Link>
              <Link
                href="/wellness/partners/telehealth"
                className="rounded-xl border border-white/10 py-2.5 text-center text-xs font-semibold text-white/70 hover:text-white transition"
              >
                Telehealth standards
              </Link>
            </div>
          </div>
          <p className="mt-3 text-[10px] text-white/40 text-center">
            Apply:{' '}
            <a href="mailto:partners@freedompawsinc.com" className="text-amber-400/80">
              partners@freedompawsinc.com
            </a>
          </p>
        </section>

        <section className="grid grid-cols-1 gap-3">
          <Link
            href="/diagnostics"
            className="rounded-2xl border border-white/10 bg-[#1F2A44] py-4 text-center text-sm font-bold hover:border-amber-400/40 transition"
          >
            Run ViT Diagnostics →
          </Link>
          <Link
            href="/id/enroll"
            className="rounded-2xl border border-amber-400/40 bg-amber-950/20 py-4 text-center text-sm font-bold text-amber-300 hover:bg-amber-950/30 transition"
          >
            Enroll Freedom Paws ID →
          </Link>
          <Link
            href="/protocols"
            className="rounded-2xl border border-white/10 py-4 text-center text-sm font-semibold text-white/80 hover:text-white transition"
          >
            Browse 10 wellness protocols →
          </Link>
        </section>

        {!config.ready && (
          <p className="mt-6 text-xs text-white/40 text-center">
            Configure partner URLs via{' '}
            <code className="text-white/55">/api/wellness/config-status</code>
          </p>
        )}

        <p className="mt-8 text-[10px] text-white/35 leading-relaxed text-center">
          Not veterinary advice. Not a government pet license. Partner services are provided by
          third parties under their own terms.
        </p>
      </div>
    </div>
  );
}
