import Image from 'next/image';
import Link from 'next/link';
import PageShell from '@/app/components/ui/PageShell';
import PageHeader from '@/app/components/ui/PageHeader';
import PrimaryButton from '@/app/components/ui/PrimaryButton';
import PwaNavLink from '@/app/components/PwaNavLink';
import { protocolDetailHref, tokenShopHref } from '../lib/routes';
import { protocols } from './protocols';

export default function ProtocolsPage() {
  return (
    <PageShell maxWidth="7xl" innerClassName="sm:py-14">
        {/* Header — image first, then title */}
        <PageHeader
          center
          eyebrow="Powered By The XRP Ledger"
          eyebrowVariant="gold"
          title="Our 10 Tokenized Holistic Protocols"
          subtitle="SuperBud flying above a fresh new era in canine wellness"
          className="mb-10"
        />
        <div className="rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-black/40 max-w-4xl mx-auto mb-10">
          <Image
            src="/images/protocols/superbud-10-protocols.png"
            alt="SuperBud and friends — 10 protocols to stay healthy"
            width={1024}
            height={687}
            priority
            sizes="(max-width: 896px) 100vw, 896px"
            className="block w-full h-auto"
          />
        </div>

        {/* Protocol cards */}
        <div className="flex flex-wrap justify-center gap-6">
          {protocols.map((p) => (
            <Link
              key={p.slug}
              href={protocolDetailHref(p.slug)}
              prefetch={false}
              className="group relative z-10 w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)] bg-[#16223C] rounded-3xl p-5 border border-white/10 hover:border-[#F5C242]/40 hover:bg-[#1B2A47] active:border-[#F5C242]/60 transition-colors flex flex-col touch-manipulation min-h-[320px]"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <div className="rounded-xl overflow-hidden">
                <Image
                  src={`/images/protocols/${p.slug}.png`}
                  alt={`${p.title} — SuperBud illustration`}
                  width={700}
                  height={415}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="block w-full h-auto transition-transform duration-300 group-hover:scale-[1.03]"
                />
              </div>

              <h2 className="mt-6 flex items-center justify-center text-center text-xl md:text-2xl font-bold leading-snug min-h-[3.5rem] md:min-h-[4.25rem]">
                {p.title}
              </h2>

              <p className="mt-3 text-center text-sm md:text-base text-white/70 leading-relaxed">
                <span className="font-bold text-[#F5C242]">AI-ViT</span> {p.detect}
              </p>

              <div className="mt-auto pt-5 text-center text-sm md:text-base font-semibold text-[#F5C242]">
                XRPL Protocol Token
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-14 text-center">
          <p className="text-white/70 mb-4">Ready to purchase lifetime access?</p>
          <PwaNavLink href={tokenShopHref()} className="inline-block">
            <PrimaryButton variant="gold" size="lg" className="!rounded-full">
              Visit Token Shop →
            </PrimaryButton>
          </PwaNavLink>
        </div>
    </PageShell>
  );
}
