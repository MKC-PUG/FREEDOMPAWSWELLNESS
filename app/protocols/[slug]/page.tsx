import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import BackLink from '@/app/components/BackLink';
import ProtocolAffiliatePicks from '@/app/components/protocols/ProtocolAffiliatePicks';
import { getProtocolAffiliateSection } from '@/lib/protocols/affiliates';
import { protocols } from '../protocols';
import { protocolDetails, type Block, type DetailSection } from '../details';
import { protocolOverviewHref, tokenShopHref } from '../../lib/routes';

export function generateStaticParams() {
  return protocols.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = protocols.find((x) => x.slug === slug);
  return {
    title: p ? `${p.title} • Freedom Paws Wellness` : 'Protocol • Freedom Paws Wellness',
  };
}

function Blocks({ body }: { body: Block[] }) {
  return (
    <>
      {body.map((b, i) => {
        if ('p' in b) {
          return (
            <p key={i} className="text-white/80 leading-relaxed mb-3">
              {b.p}
            </p>
          );
        }
        if ('ul' in b) {
          return (
            <ul key={i} className="list-disc list-inside space-y-1.5 text-white/80 leading-relaxed mb-3">
              {b.ul.map((t, j) => (
                <li key={j}>{t}</li>
              ))}
            </ul>
          );
        }
        return (
          <ol key={i} className="list-decimal list-inside space-y-2 text-white/85 leading-relaxed mb-3">
            {b.ol.map((t, j) => (
              <li key={j}>{t}</li>
            ))}
          </ol>
        );
      })}
    </>
  );
}

function Section({ s }: { s: DetailSection }) {
  const hasImage = Boolean(s.image);

  const text = (
    <div>
      {s.heading && <h2 className="text-2xl md:text-3xl font-bold mb-4">{s.heading}</h2>}
      <Blocks body={s.body} />
    </div>
  );

  if (!hasImage) {
    return (
      <section className="bg-[#16223C] rounded-3xl p-7 md:p-10 border border-white/10">{text}</section>
    );
  }

  const img = (
    <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-white/10">
      <Image
        src={s.image!}
        alt={s.imageAlt ?? ''}
        fill
        sizes="(max-width: 768px) 100vw, 420px"
        className="object-cover"
      />
    </div>
  );

  return (
    <section className="bg-[#16223C] rounded-3xl p-6 md:p-8 border border-white/10">
      <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center">
        {s.imageSide === 'left' ? (
          <>
            {img}
            <div>{text}</div>
          </>
        ) : (
          <>
            <div>{text}</div>
            {img}
          </>
        )}
      </div>
    </section>
  );
}

export default async function ProtocolDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const protocol = protocols.find((p) => p.slug === slug);
  if (!protocol) notFound();

  const detail = protocolDetails[slug];
  const affiliateSection = getProtocolAffiliateSection(slug, protocol.title);

  return (
    <div className="min-h-screen bg-[#0A1428] text-white">
      <div className="max-w-5xl mx-auto px-6 py-8 sm:py-12">
        <BackLink href={protocolOverviewHref()} label="Back to Protocol Overview" />

        <nav aria-label="Breadcrumb" className="mt-2 text-sm text-white/50">
          <Link href={protocolOverviewHref()} className="hover:text-white transition-colors">
            Protocol Overview
          </Link>
          <span className="mx-2">→</span>
          <span className="text-white/80">{protocol.title}</span>
        </nav>

        {/* Hero */}
        <header className="text-center mt-8">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">{protocol.title}</h1>
          {detail && <p className="mt-2 text-lg text-white/70">{detail.subtitle}</p>}
        </header>

        <div className="mt-8 rounded-2xl overflow-hidden border border-[#F5C242]/30 shadow-2xl shadow-black/40">
          <Image
            src={`/images/protocols/${protocol.slug}.png`}
            alt={`${protocol.title} — SuperBud illustration`}
            width={700}
            height={415}
            priority
            sizes="(max-width: 1024px) 100vw, 1024px"
            className="block w-full h-auto"
          />
        </div>

        {!detail ? (
          <p className="mt-10 text-center text-white/60">Full protocol details coming soon.</p>
        ) : (
          <>
            {/* Intro */}
            <div className={detail.introHeading ? 'mt-10 max-w-3xl mx-auto' : 'mt-8 max-w-3xl mx-auto text-center'}>
              {detail.introHeading && (
                <h2 className="text-2xl md:text-3xl font-bold mb-4">{detail.introHeading}</h2>
              )}
              <div className="space-y-4 text-white/80 leading-relaxed">
                {detail.intro.map((t, i) => (
                  <p key={i}>{t}</p>
                ))}
              </div>
            </div>

            {/* Content sections */}
            <div className="mt-12 space-y-6">
              {detail.sections.map((s, i) => (
                <Section key={i} s={s} />
              ))}
            </div>

            {/* How to access */}
            <section className="mt-8 bg-[#16223C] rounded-3xl p-7 md:p-10 border border-white/10">
              <h2 className="text-2xl md:text-3xl font-bold">{detail.access.heading}</h2>
              <ol className="mt-5 list-decimal list-inside space-y-2 text-white/85 leading-relaxed">
                {detail.access.steps.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ol>
              {detail.access.notes.map((t, i) => (
                <p key={i} className="mt-4 font-semibold text-white/90">
                  {t}
                </p>
              ))}
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href={tokenShopHref(slug)}
                  className="bg-[#F5C242] hover:bg-amber-300 text-black text-lg font-bold px-12 py-4 rounded-full transition-colors"
                >
                  {detail.access.buyLabel}
                </Link>
                <Link
                  href={protocolOverviewHref()}
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  ← Back to Protocol Overview
                </Link>
              </div>
            </section>

            {affiliateSection && <ProtocolAffiliatePicks section={affiliateSection} />}

            {/* Disclaimer */}
            <p className="mt-8 text-center text-xs leading-relaxed text-white/45 max-w-3xl mx-auto">
              {detail.disclaimer}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
