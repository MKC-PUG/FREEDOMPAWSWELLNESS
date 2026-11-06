'use client';

import { useState } from 'react';
import Link from 'next/link';
import OptionalSupportiveProducts from '@/app/components/wellness/OptionalSupportiveProducts';
import {
  DIAGNOSTICS_GREEN_BODY,
  DIAGNOSTICS_GREEN_TITLE,
  DIAGNOSTICS_RED_DEFAULT,
  DIAGNOSTICS_RED_TITLE,
} from '@/lib/legal/diagnostics-disclaimer';
import ConsultShareButton from '@/app/components/mypets/ConsultShareButton';
import { saveGaitVideoToPetRecord } from '@/lib/mypets/save-gait-record';
import type { CareFormat } from '@/lib/wellness/care-format';
import { escapeHtml, listHtml, openPrintDocument } from '@/lib/wellness/print-document';

type Props = {
  care: CareFormat;
  seen: string;
  urgent: boolean;
  alsoSeenHref?: string | null;
  alsoSeenLabel?: string | null;
  petId?: string | null;
  petName?: string | null;
  gaitFile?: File | null;
};

export default function CareCheckIn({
  care,
  seen,
  urgent,
  alsoSeenHref,
  alsoSeenLabel,
  petId,
  petName,
  gaitFile,
}: Props) {
  const [saveNote, setSaveNote] = useState('');
  const [saving, setSaving] = useState(false);

  const printHome = () => {
    const html = `
      <h1>${escapeHtml(care.pamphletTitle)}</h1>
      <p><strong>Seen.</strong> ${escapeHtml(seen)}</p>
      <h2>Monitor</h2>
      ${listHtml(care.monitor)}
      <h2>This week at home</h2>
      ${listHtml(care.actions)}
      <p>${escapeHtml(care.photoNote)}</p>
      <div class="banner"><strong>${escapeHtml(DIAGNOSTICS_GREEN_TITLE)}</strong>${escapeHtml(DIAGNOSTICS_GREEN_BODY)}</div>
    `;
    openPrintDocument(care.pamphletTitle, html);
  };

  const printVet = () => {
    const today = new Date().toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const html = `
      <h1>Note for your veterinarian</h1>
      <p>${escapeHtml(petName ? petName : 'Your dog')} · ${escapeHtml(today)}</p>
      <p><strong>Seen.</strong> ${escapeHtml(seen)}</p>
      <p>${escapeHtml(care.photoNote)}</p>
      <div class="banner"><strong>${escapeHtml(DIAGNOSTICS_RED_TITLE)}</strong>${escapeHtml(DIAGNOSTICS_RED_DEFAULT)}</div>
    `;
    openPrintDocument('Note for your veterinarian', html);
  };

  const saveVideo = async () => {
    if (!petId || !gaitFile) return;
    setSaving(true);
    setSaveNote('');
    try {
      const where = await saveGaitVideoToPetRecord({ petId, file: gaitFile, seen });
      setSaveNote(
        where === 'vault'
          ? 'Saved. Create the veterinarian link below so the visit can play this video with the notes and pictures.'
          : 'Saved on this phone. Sign in to put the video, notes, and pictures on a link your veterinarian can open.'
      );
    } catch {
      setSaveNote('Could not save the video. Try again from My Pets.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="rounded-2xl border border-white/15 bg-[#0A1428]/50 p-5 space-y-5">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-wide text-white/45">Seen</p>
        <p className="mt-1 text-lg font-semibold leading-snug text-white">{seen}</p>
      </div>

      {alsoSeenHref && alsoSeenLabel ? (
        <p className="text-sm text-white/60">
          Also seen:{' '}
          <Link href={alsoSeenHref} className="font-semibold text-[#F5C242] underline underline-offset-2">
            {alsoSeenLabel}
          </Link>
        </p>
      ) : null}

      {urgent ? (
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={printVet}
            className="min-h-[48px] rounded-full border border-white/20 px-5 text-sm font-bold"
          >
            Print a note for your veterinarian
          </button>
        </div>
      ) : (
        <>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wide text-white/45">Monitor</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-white/80">
              {care.monitor.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wide text-white/45">At home</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-white/80">
              {care.actions.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
          <button
            type="button"
            onClick={printHome}
            className="min-h-[48px] rounded-full border border-[#F5C242]/50 px-5 text-sm font-bold text-[#F5C242]"
          >
            Print this page
          </button>
        </>
      )}

      {petId ? <ConsultShareButton petId={petId} /> : null}

      {care.saveGaitVideo && !urgent ? (
        <div className="rounded-2xl border border-white/10 p-4">
          <p className="text-sm font-bold">Gait video on the pet record</p>
          <p className="mt-1 text-sm text-white/60">
            A 10–15 second walk, toward you and away, saved with this finding.
          </p>
          {petId && gaitFile ? (
            <button
              type="button"
              disabled={saving}
              onClick={() => void saveVideo()}
              className="mt-3 min-h-[44px] rounded-full bg-[#F5C242] px-5 text-sm font-bold text-black disabled:opacity-60"
            >
              {saving ? 'Saving…' : `Save video${petName ? ` to ${petName}` : ''}`}
            </button>
          ) : (
            <p className="mt-3 text-sm text-white/60">
              {petId ? (
                'Record a short walking video on this check-in, then save it here.'
              ) : (
                <>
                  Add the dog in{' '}
                  <Link href="/mypets" className="font-semibold text-[#F5C242] underline">
                    My Pets
                  </Link>
                  , then save the walking video on their record.
                </>
              )}
            </p>
          )}
          {saveNote ? <p className="mt-2 text-sm text-emerald-300">{saveNote}</p> : null}
        </div>
      ) : null}

      <OptionalSupportiveProducts care={care} showProducts={!urgent} />
    </section>
  );
}
