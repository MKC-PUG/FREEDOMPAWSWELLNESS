import Image from 'next/image';
import Link from 'next/link';
import BackLink from '@/app/components/BackLink';
import { protocolDetailHref, tokenShopHref } from '../lib/routes';
import { protocols } from './protocols';

export default function ProtocolsPage() {
  return (
    <div className="min-h-screen bg-[#0A1428] text-white">
      <div className="max-w-7xl mx-auto px-6 py-8 sm:py-14">
        <BackLink />
        {/* Header */}
        <header className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Our 10 Tokenized Holistic Protocols.
          </h1>
          <p className="mt-3 text-lg md:text-xl text-white/80">
            SuperBud flying above a fresh new era in canine wellness
          </p>
          <p className="mt-1 text-sm font-semibold tracking-wide text-[#F5C242]">
            Powered By The XRP Ledger
          </p>

          <div className="mt-8 rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-black/40 max-w-4xl mx-auto">
            <Image
              src="/images/protocols/header-photo.png"
              alt="SuperBud holding an XRP coin surrounded by a group of happy dogs by a Tennessee lake"
              width={886}
              height={666}
              priority
              sizes="(max-width: 896px) 100vw, 896px"
              className="block w-full h-auto"
            />
          </div>
        </header>

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
          <Link
            href={tokenShopHref()}
            prefetch={false}
            className="inline-flex items-center justify-center min-h-[52px] bg-[#F5C242] hover:bg-amber-300 active:bg-amber-200 text-black text-base font-bold px-10 py-4 rounded-full transition-colors touch-manipulation"
          >
            Visit Token Shop →
          </Link>
        </div>
      </div>
    </div>
  );
}
