import type { Metadata } from 'next';
import Link from 'next/link';
import PageShell from '@/app/components/ui/PageShell';
import PageHeader from '@/app/components/ui/PageHeader';
import { HAZARD_ENTRIES, HOUSEHOLD_ONLY, TIER_LABEL } from '@/lib/wellness/not-good-list';

export const metadata: Metadata = {
  title: 'Household hazards • Freedom Paws',
  description: 'People foods and household items that are hard on dogs, with the public source for each.',
};

export default function HouseholdHazardsPage() {
  const peopleFoods = HAZARD_ENTRIES.filter((entry) => entry.categories.includes('household'));
  const items = [...peopleFoods, ...HOUSEHOLD_ONLY];
  return (
    <PageShell maxWidth="lg" backLink={{ href: '/wellness', label: 'Back to Wellness' }}>
      <PageHeader
        eyebrow="Household"
        title="Things in the house that are not pet products"
        subtitle="Chocolate, gum, grapes, human pain tablets, and antifreeze do not come with a dog-food label. This page is the reference. If your dog ate one, call your veterinarian or a poison-control line and say what and how much."
      />
      <ul className="space-y-4">
        {items.map((entry) => (
          <li key={entry.id} className="rounded-2xl border border-white/10 p-5">
            <p className="text-[11px] font-bold uppercase tracking-wide text-amber-300">
              {TIER_LABEL[entry.tier]}
            </p>
            <h2 className="mt-1 font-bold">{entry.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-white/70">{entry.note}</p>
            <a href={entry.sourceUrl} className="mt-2 inline-block text-xs text-amber-300 underline">
              {entry.sourceName}
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-8 text-sm text-white/60">
        ASPCA Poison Control: (888) 426-4435. A fee may apply.{' '}
        <Link href="/wellness/label-scan" className="text-amber-300 underline">
          Check a pet-product label
        </Link>
        .
      </p>
    </PageShell>
  );
}
