import type { ReactNode } from 'react';
import Link from 'next/link';
import type { PartnerPolicyDoc } from '@/lib/wellness/partner-policies';

type Props = {
  policy: PartnerPolicyDoc;
};

function SectionBlock({
  section,
  children,
}: {
  section: { title: string; body: string; bullets?: string[] };
  children?: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <h2 className="text-sm font-bold uppercase tracking-wide text-amber-300">{section.title}</h2>
      <p className="mt-2 text-sm text-white/70 leading-relaxed">{section.body}</p>
      {section.bullets && section.bullets.length > 0 && (
        <ul className="mt-3 space-y-2 text-sm text-white/65 list-disc pl-5">
          {section.bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      )}
      {children}
    </section>
  );
}

export default function PartnerPolicyView({ policy }: Props) {
  return (
    <div className="space-y-5">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">
          Partner program
        </p>
        <h1 className="mt-2 text-2xl font-bold leading-tight">{policy.title}</h1>
        <p className="mt-2 text-sm text-white/60 leading-relaxed">{policy.subtitle}</p>
        <p className="mt-3 text-xs text-white/40">
          Last updated {policy.lastUpdated} · Apply:{' '}
          <a
            href={`mailto:${policy.contactEmail}`}
            className="text-amber-400/90 hover:text-amber-300"
          >
            {policy.contactEmail}
          </a>
        </p>
      </header>

      <SectionBlock section={policy.missionAlignment} />
      <SectionBlock section={policy.acceptanceCriteria} />

      <section className="rounded-2xl border border-amber-400/25 bg-amber-950/15 p-5">
        <h2 className="text-sm font-bold uppercase tracking-wide text-amber-300">
          Recommended financial structure
        </h2>
        <p className="mt-2 text-sm text-white/70 leading-relaxed">{policy.financialStructure.intro}</p>
        <div className="mt-4 space-y-3">
          {policy.financialStructure.preferred.map((tier) => (
            <div
              key={tier.tier}
              className="rounded-xl border border-white/10 bg-[#0A1625]/60 p-4"
            >
              <p className="text-xs font-bold text-emerald-300 uppercase tracking-wide">
                {tier.tier}
              </p>
              <p className="mt-1 text-sm font-semibold text-white/90">{tier.structure}</p>
              <p className="mt-1 text-xs text-white/55">
                <span className="text-white/40">Minimum: </span>
                {tier.minimum}
              </p>
              <p className="mt-1 text-xs text-white/50 italic">{tier.notes}</p>
            </div>
          ))}
        </div>
        <ul className="mt-4 space-y-1.5 text-xs text-white/55 list-disc pl-5">
          {policy.financialStructure.requirements.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </section>

      <SectionBlock section={policy.brandAndDisclosure} />
      <SectionBlock section={policy.memberExperience} />
      <SectionBlock section={policy.exclusions} />
      <SectionBlock section={policy.onboardingSteps} />

      <div className="flex flex-col gap-3 pt-2">
        <a
          href={`mailto:${policy.contactEmail}?subject=${encodeURIComponent(
            policy.slug === 'insurance'
              ? 'Insurance Affiliate — Freedom Paws'
              : 'Telehealth Partner — Freedom Paws'
          )}`}
          className="rounded-2xl bg-amber-400 py-4 text-center text-sm font-bold text-black hover:bg-amber-300 transition"
        >
          Apply to become a partner →
        </a>
        <Link
          href="/wellness/partners"
          className="rounded-2xl border border-white/10 py-3 text-center text-sm font-semibold text-white/70 hover:text-white transition"
        >
          ← All partner standards
        </Link>
      </div>

      <p className="text-[10px] text-white/35 leading-relaxed text-center pt-2">
        These standards are subject to founder approval. Freedom Paws reserves the right to decline
        or remove partners that do not meet wellness-first alignment. Not a binding offer — terms
        finalized in executed affiliate agreement.
      </p>
    </div>
  );
}
