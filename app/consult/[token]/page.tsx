import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { loadConsult } from '@/lib/mypets/consult';
import { VAULT_KIND_LABELS } from '@/lib/mypets/vault-types';

type Params = { params: Promise<{ token: string }> };

export const metadata: Metadata = {
  title: 'Visit packet • Freedom Paws',
  robots: { index: false, follow: false, nocache: true },
};

function formatDate(value: string | null): string | null {
  if (!value) return null;
  const parsed = new Date(`${value.slice(0, 10)}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
}

export default async function ConsultPage({ params }: Params) {
  const { token } = await params;
  const packet = await loadConsult(token);
  if (!packet) notFound();

  const videos = packet.entries.filter((entry) => entry.videoUrl);
  const pictures = packet.entries.filter((entry) => entry.imageUrl);
  const notes = packet.entries.filter((entry) => entry.note && !entry.videoUrl && !entry.imageUrl);

  return (
    <main className="min-h-screen bg-[#f6f3ec] text-[#1c1915] px-5 py-10">
      <article className="mx-auto max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8a6a12]">
          Shared for a veterinary visit
        </p>
        <h1 className="mt-2 text-3xl font-bold">{packet.petName}</h1>
        <p className="mt-3 text-sm leading-relaxed">
          The owner shared this dog’s notes, pictures, and walking videos. Open it in the exam
          room or on a virtual visit. This page is informational. It is not a diagnosis.
        </p>
        <p className="mt-2 text-xs text-[#5c564e]">
          Link ends {formatDate(packet.expiresAt.slice(0, 10))}.
        </p>

        <section className="mt-8">
          <h2 className="text-sm font-bold uppercase tracking-wide">Walking videos</h2>
          {videos.length === 0 ? (
            <p className="mt-2 text-sm text-[#5c564e]">No walking video has been stored for this visit yet.</p>
          ) : (
            <ul className="mt-3 space-y-4">
              {videos.map((entry) => (
                <li key={entry.id} className="rounded-2xl border border-[#e4dccb] bg-white p-4">
                  <p className="font-bold">{entry.title}</p>
                  {entry.recordDate ? (
                    <p className="text-xs text-[#5c564e]">{formatDate(entry.recordDate)}</p>
                  ) : null}
                  {entry.note ? <p className="mt-2 text-sm leading-relaxed">{entry.note}</p> : null}
                  <video src={entry.videoUrl!} controls playsInline className="mt-3 w-full rounded-xl bg-black" />
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="mt-8">
          <h2 className="text-sm font-bold uppercase tracking-wide">Pictures</h2>
          {pictures.length === 0 ? (
            <p className="mt-2 text-sm text-[#5c564e]">No pictures are on this record.</p>
          ) : (
            <ul className="mt-3 space-y-4">
              {pictures.map((entry) => (
                <li key={entry.id} className="rounded-2xl border border-[#e4dccb] bg-white p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-[#8a6a12]">
                    {VAULT_KIND_LABELS[entry.kind].label}
                  </p>
                  <p className="mt-1 font-bold">{entry.title}</p>
                  {entry.recordDate ? (
                    <p className="text-xs text-[#5c564e]">{formatDate(entry.recordDate)}</p>
                  ) : null}
                  {entry.note ? <p className="mt-2 text-sm leading-relaxed">{entry.note}</p> : null}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={entry.imageUrl!} alt="" className="mt-3 w-full rounded-xl" />
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="mt-8">
          <h2 className="text-sm font-bold uppercase tracking-wide">Owner notes</h2>
          {notes.length === 0 ? (
            <p className="mt-2 text-sm text-[#5c564e]">No separate notes are on this record.</p>
          ) : (
            <ul className="mt-3 space-y-3">
              {notes.map((entry) => (
                <li key={entry.id} className="rounded-2xl border border-[#e4dccb] bg-white p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-[#8a6a12]">
                    {VAULT_KIND_LABELS[entry.kind].label}
                  </p>
                  <p className="mt-1 font-bold">{entry.title}</p>
                  {entry.recordDate ? (
                    <p className="text-xs text-[#5c564e]">{formatDate(entry.recordDate)}</p>
                  ) : null}
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">{entry.note}</p>
                  {entry.fileName ? (
                    <p className="mt-2 text-xs text-[#5c564e]">File name on the owner’s record: {entry.fileName}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </section>
      </article>
    </main>
  );
}
