import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import BackLink from '@/app/components/BackLink';
import { protocolDetailHref } from '../lib/routes';
import TokenShopCheckout from './TokenShopCheckout';
import TokenShopFocus from './TokenShopFocus';
import TokenShopPaidReturn from './TokenShopPaidReturn';
import { SHOP_PRICE, tokenShopItems } from './shop-items';

export const metadata: Metadata = {
  title: 'Token Shop • Freedom Paws Wellness',
  description:
    'Lifetime wellness protocols on XRPL — ViT AI analysis, whole-food diet plans, and educational access via Dynamic NFT or MPT.',
};

function ViewProtocolButton({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      prefetch={false}
      className="mt-5 mx-auto flex w-full max-w-xs min-h-[52px] items-center justify-center rounded-full border-2 border-white bg-transparent px-6 py-3.5 text-base font-bold text-white tracking-wide hover:bg-white hover:text-[#1E3050] active:bg-white/90 transition-colors touch-manipulation"
    >
      {label}
    </Link>
  );
}

function TokenShopCard({ item }: { item: (typeof tokenShopItems)[number] }) {
  const detailHref = protocolDetailHref(item.slug);
  const displayTitle = item.detailTitle ?? item.cardTitle;

  return (
    <article
      id={item.slug}
      className="flex flex-col rounded-3xl overflow-hidden border border-white/10 bg-[#16223C] shadow-xl shadow-black/30 scroll-mt-28 transition-shadow"
    >
      <div className="bg-[#1E3050] px-5 pt-5 pb-6">
        <Link href={detailHref} className="block hover:text-[#F5C242] transition-colors">
          <h2 className="text-center text-lg md:text-xl font-bold leading-snug min-h-[3.25rem] flex items-center justify-center">
            {item.cardTitle}
          </h2>
        </Link>

        <Link href={detailHref} className="mt-4 block rounded-xl overflow-hidden border border-white/10 hover:border-[#F5C242]/40 transition-colors">
          <Image
            src={`/images/protocols/${item.slug}.png`}
            alt={`${item.cardTitle} — protocol artwork`}
            width={700}
            height={415}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 420px"
            className="block w-full h-auto"
          />
        </Link>

        <div className="mt-4 text-center">
          <p className="text-2xl md:text-3xl font-bold text-white">AI - ViT</p>
          <p className="mt-2 text-xl md:text-2xl text-white/80 leading-snug">{item.detect}</p>
        </div>

        <ViewProtocolButton href={detailHref} label="Click Here To View" />
      </div>

      <div className="flex flex-col flex-1 px-5 py-6 border-t border-white/10">
        <h3 className="text-center text-base md:text-lg font-bold leading-snug">{displayTitle}</h3>
        {item.subtitle && (
          <p className="mt-1 text-center text-sm text-white/70">{item.subtitle}</p>
        )}

        <ul className="mt-4 space-y-2.5 text-sm text-white/80 leading-relaxed flex-1">
          {item.features.map((f) => (
            <li key={f} className="flex gap-2">
              <span className="text-[#F5C242] shrink-0">•</span>
              <span>{f}</span>
            </li>
          ))}
        </ul>

        <p className="mt-5 text-center text-[11px] leading-relaxed text-white/50">
          Lifetime access • Educational utility token
          <br />
          Supports no-kill shelters &amp; veteran programs
        </p>

        <TokenShopCheckout slug={item.slug} cardTitle={item.cardTitle} />
      </div>
    </article>
  );
}

export default function TokenShopPage() {
  return (
    <div className="min-h-screen bg-[#0A1428] text-white">
      <Suspense fallback={null}>
        <TokenShopFocus />
        <TokenShopPaidReturn />
      </Suspense>

      <header className="relative overflow-hidden">
        <div className="relative max-w-5xl mx-auto px-6 pt-8 sm:pt-10 pb-10">
          <div className="text-left mb-4">
            <BackLink href="/protocols" label="Back to Protocol Overview" />
          </div>
          <p className="text-sm text-white/50 mb-6">
            <Link href="/protocols" className="hover:text-white transition-colors">
              Protocol Overview
            </Link>
            <span className="mx-2">→</span>
            <span className="text-[#F5C242]">Token Shop</span>
          </p>

          <div className="rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-black/40">
            <Image
              src="/images/token-shop/header.jpg"
              alt="SuperBud and happy dogs by a Tennessee lake with XRP wellness tokens — Wellness, Freedom, Community"
              width={1024}
              height={771}
              priority
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="block w-full h-auto"
            />
          </div>

          <h1 className="sr-only">Token Shop</h1>
          <p className="mt-8 text-2xl md:text-3xl font-bold text-white/95 text-center">
            Lifetime Wellness Protocols
          </p>
          <p className="mt-4 text-sm md:text-base font-semibold tracking-wide text-white/80 text-center">
            AI-Powered • XRPL Tokenized • Natural Holistic Care
          </p>

          <div className="mt-8 space-y-4 text-white/75 leading-relaxed text-sm md:text-base max-w-3xl mx-auto">
            <p>
              Give your dog personalized, natural wellness support with 10 specialized protocols — each
              combining Vision Transformer (ViT) AI analysis, whole-food diet plans, lifestyle guidance,
              and educational resources.
            </p>
            <p>
              Every protocol is delivered as a lifetime-access Dynamic NFT or MPT on the XRPL blockchain.
              Purchase once and own it forever.
            </p>
            <p>
              Every purchase directly funds no-kill animal shelters and patriotic veteran-dog lake meetups.
              Protocols are ${SHOP_PRICE.rlusd}.00 USD each — pay in XRP via Xaman (live conversion at checkout) or by card.
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {tokenShopItems.map((item) => (
            <TokenShopCard key={item.slug} item={item} />
          ))}
        </div>

        <p className="mt-12 text-center text-sm text-white/60">
          New here?{' '}
          <Link href="/protocols" className="text-[#F5C242] font-semibold hover:text-amber-300 transition-colors">
            Browse all protocols
          </Link>{' '}
          to learn more before you purchase.
        </p>
      </div>
    </div>
  );
}
