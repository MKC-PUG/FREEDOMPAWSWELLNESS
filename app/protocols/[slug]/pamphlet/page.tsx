import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import PageShell from '@/app/components/ui/PageShell';
import {
  DIAGNOSTICS_GREEN_BODY,
  DIAGNOSTICS_GREEN_TITLE,
} from '@/lib/legal/diagnostics-disclaimer';
import { careForSlug } from '@/lib/wellness/care-format';
import { protocols } from '../../protocols';
import PrintPamphletButton from './PrintPamphletButton';

export function generateStaticParams() {
  return protocols.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const care = careForSlug(slug);
  return { title: care ? `${care.pamphletTitle} • Freedom Paws` : 'Plan • Freedom Paws' };
}

export default async function ProtocolPamphletPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const care = careForSlug(slug);
  if (!care) notFound();

  return (
    <PageShell maxWidth="2xl" backLink={{ href: `/protocols/${slug}`, label: 'Back to this plan' }}>
      <article className="mt-6 rounded-3xl border border-white/10 bg-white text-[#1a1a1a] p-8 md:p-10">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8a6a12]">One-page plan</p>
        <h1 className="mt-2 text-3xl font-bold">{care.pamphletTitle}</h1>
        <p className="mt-4 text-base leading-relaxed">
          <span className="font-bold">Seen. </span>
          {care.seen}
        </p>
        <h2 className="mt-6 text-sm font-bold uppercase tracking-wide">Monitor</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed">
          {care.monitor.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        <h2 className="mt-6 text-sm font-bold uppercase tracking-wide">This week at home</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed">
          {care.actions.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        <p className="mt-4 text-sm leading-relaxed">{care.photoNote}</p>
        <div className="mt-6 border border-[#1a1a1a] p-3 text-xs leading-relaxed">
          <p className="font-bold">{DIAGNOSTICS_GREEN_TITLE}</p>
          <p className="mt-1">{DIAGNOSTICS_GREEN_BODY}</p>
        </div>
      </article>
      <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <PrintPamphletButton care={care} />
        <Link href={`/protocols/${slug}`} className="text-sm text-white/60">
          Back to this plan
        </Link>
      </div>
    </PageShell>
  );
}
