import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPublicPetCard } from '@/lib/id/public-card';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const card = await getPublicPetCard(slug);
  if (!card) {
    return { title: 'Pet card not found • Freedom Paws ID' };
  }
  return {
    title: `${card.petName} • Freedom Paws ID`,
    description: `Freedom Paws ID ${card.freedomPawsId} — biometric enrollment card.`,
  };
}

export default async function PublicPetCardPage({ params }: Props) {
  const { slug } = await params;
  const card = await getPublicPetCard(slug);
  if (!card) notFound();

  const enrolledDate = new Date(card.enrolledAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim() || '';
  const cardUrl = appUrl ? `${appUrl}/id/p/${slug}` : `/id/p/${slug}`;

  return (
    <div className="min-h-screen bg-[#0A1625] text-white font-sans">
      <div className="mx-auto max-w-md px-6 py-12">
        <div className="rounded-3xl border-2 border-emerald-500/40 bg-gradient-to-b from-[#1F2A44] to-[#0A1625] p-8 text-center shadow-xl">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-400">
            Freedom Paws ID
          </p>
          <h1 className="mt-4 text-3xl font-bold">{card.petName}</h1>
          {card.breed && <p className="mt-1 text-white/60">{card.breed}</p>}

          <div className="mt-8 rounded-2xl border border-white/10 bg-black/30 px-6 py-5">
            <p className="text-[10px] uppercase tracking-widest text-white/45">ID number</p>
            <p className="mt-1 text-2xl font-mono font-bold text-amber-400">{card.freedomPawsId}</p>
          </div>

          <p className="mt-6 text-xs text-white/50">Enrolled {enrolledDate}</p>

          <div className="mt-8 flex justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(cardUrl)}`}
              alt={`QR code for ${card.petName} Freedom Paws ID`}
              width={220}
              height={220}
              className="rounded-xl bg-white p-2"
            />
          </div>

          <p className="mt-4 text-[10px] leading-relaxed text-white/40 px-2">
            Biometric identity on file for lost-dog matching. Not a government license.
            Owner contact requires verified match review.
          </p>
        </div>

        <Link
          href="/id"
          className="mt-8 block text-center text-sm font-semibold text-amber-400 hover:text-amber-300"
        >
          Freedom Paws ID hub →
        </Link>
      </div>
    </div>
  );
}
