import Image from 'next/image';
import Link from 'next/link';
import ConnectWithUs from '@/app/components/ConnectWithUs';

const cards = [
  {
    icon: '📸',
    title: 'ViT Diagnostics',
    desc: 'Upload a photo + symptoms for instant holistic protocol recommendations',
    cta: 'LAUNCH →',
    href: '/diagnostics',
  },
  {
    icon: '🛡️',
    title: 'Freedom Paws ID',
    desc: 'Biometric pet identity — enroll eyes, face & gait for lost-dog matching (CA/TN pilot)',
    cta: 'OPEN ID HUB →',
    href: '/id',
  },
  {
    icon: '🐾',
    title: 'My Pets',
    desc: 'Manage your pets, wellness notes & unlocked protocols',
    cta: 'MANAGE →',
    href: '/mypets',
  },
  {
    icon: '🌿',
    title: 'Wellness Partners',
    desc: 'Holistic telehealth, insurance affiliates & natural-care education — prevention over crisis',
    cta: 'EXPLORE →',
    href: '/wellness',
  },
  {
    icon: '📋',
    title: 'Protocol Overview',
    desc: 'Browse all 10 tokenized holistic wellness protocols',
    cta: 'VIEW ALL →',
    href: '/protocols',
  },
  {
    icon: '🪙',
    title: 'Token Shop',
    desc: 'Purchase lifetime protocol access on XRPL — supports shelters & veteran programs',
    cta: 'SHOP →',
    href: '/token-shop',
  },
  {
    icon: '🎨',
    title: 'SuperBud Photo Booth',
    desc: 'One-tap themes — dress up your pet and share in seconds',
    cta: 'OPEN →',
    href: '/photobooth',
  },
  {
    icon: '📡',
    title: 'Monitor My Dog',
    desc: 'Room camera live view while you\'re away — Wyze & off-the-shelf setup',
    cta: 'OPEN →',
    href: '/monitor',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0A1625] text-white font-sans">
      {/* Lake background spans hero + cards */}
      <div className="relative">
        <Image
          src="/images/tn-lake-bg.jpg"
          alt="Tennessee Lake"
          fill
          priority
          quality={90}
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A1625]/60 via-[#0A1625]/70 to-[#0A1625]/90" />

        <div className="relative z-10">
          {/* Hero */}
          <section className="px-6 pt-16 pb-12 text-center">
            <div className="flex justify-center mb-8">
              <div className="rounded-2xl border-2 border-amber-400 overflow-hidden shadow-2xl shadow-black/50">
                <Image
                  src="/images/welcome-hero.png"
                  alt="SuperBud in a patriotic cape with happy dogs in a mountain valley — Wellness, Freedom, Community"
                  width={1024}
                  height={587}
                  quality={85}
                  sizes="(max-width: 768px) 100vw, 720px"
                  priority
                  className="block h-auto w-full max-w-[420px] md:max-w-[720px]"
                />
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05]">
              Welcome To<br />Freedom Paws Wellness
            </h1>
            <p className="mt-6 text-base md:text-lg text-amber-200/90">
              Tokenized Holistic Wellness on XRPL &amp; Inspired by Buddy&apos;s Miracle
            </p>
          </section>

          {/* Feature cards */}
          <section className="px-6 pb-20">
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {cards.map((c) => (
                <Link
                  key={c.title}
                  href={c.href}
                  prefetch={false}
                  className="bg-[#0F1E38]/85 backdrop-blur-sm rounded-3xl p-7 min-h-[260px] flex flex-col border border-white/10 hover:border-amber-400/40 hover:bg-[#132A4F]/90 active:border-amber-400/60 transition-all touch-manipulation relative z-10"
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  <div className="text-3xl mb-6">{c.icon}</div>
                  <h2 className="text-xl font-bold mb-3 leading-snug">{c.title}</h2>
                  <p className="text-sm text-white/60 flex-1 leading-relaxed">{c.desc}</p>
                  <span className="mt-6 text-xs font-bold tracking-wider text-amber-400">{c.cta}</span>
                </Link>
              ))}
            </div>
          </section>

          <section className="px-6 pb-16 text-center">
            <ConnectWithUs variant="prominent" />
          </section>
        </div>
      </div>
    </div>
  );
}
