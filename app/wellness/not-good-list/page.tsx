import type { Metadata } from 'next';
import Link from 'next/link';
import PageShell from '@/app/components/ui/PageShell';
import PageHeader from '@/app/components/ui/PageHeader';
import { listForReading, NOT_A_LAB_TEST, TIER_LABEL } from '@/lib/wellness/not-good-list';

export const metadata: Metadata = {
  title: 'Not-good list • Freedom Paws',
  description: 'The fixed list a Freedom Paws label check can name.',
};

export default function NotGoodListPage() {
  const entries = listForReading();
  return (
    <PageShell maxWidth="lg" backLink={{ href: '/wellness', label: 'Back to Wellness' }}>
      <PageHeader
        eyebrow="Not-good list"
        title="What a label check is allowed to name"
        subtitle="A result names an item only when the printed words match. Cancer notes cite a human toxicology listing. They are not a finding that a bag causes cancer in a dog."
      />
      <p className="mb-6 text-sm leading-relaxed text-white/60">{NOT_A_LAB_TEST}</p>
      <ul className="space-y-4">
        {entries.map((entry) => (
          <li key={entry.id} className="rounded-2xl border border-white/10 p-5">
            <p className="text-[11px] font-bold uppercase tracking-wide text-amber-300">
              {TIER_LABEL[entry.tier]}
            </p>
            <h2 className="mt-1 font-bold text-white">{entry.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-white/70">{entry.note}</p>
            <a href={entry.sourceUrl} className="mt-2 inline-block text-xs text-amber-300 underline">
              {entry.sourceName}
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-8 text-sm">
        <Link href="/wellness/label-scan" className="text-amber-300 underline">
          Check a label
        </Link>
      </p>
    </PageShell>
  );
}
