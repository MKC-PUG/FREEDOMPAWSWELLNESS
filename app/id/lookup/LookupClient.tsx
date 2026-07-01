'use client';

import { useState } from 'react';
import Link from 'next/link';
import BackLink from '@/app/components/BackLink';
import PageShell from '@/app/components/ui/PageShell';
import PageHeader from '@/app/components/ui/PageHeader';
import SectionCard from '@/app/components/ui/SectionCard';
import PrimaryButton from '@/app/components/ui/PrimaryButton';
import { validateChipRaw } from '@/lib/id/chip-id';
import {
  AAHA_MICROCHIP_LOOKUP_URL,
  AVID_REGISTRY_CONTACT_URL,
  CHIP_REGISTRY_DISCLAIMER,
} from '@/lib/id/chip-registry';
import type { ChipValidationResult } from '@/lib/id/chip-types';
import { PWA_VERSION } from '@/lib/pwa-version';

export default function LookupClient() {
  const [raw, setRaw] = useState('');
  const [validation, setValidation] = useState<ChipValidationResult | null>(null);

  const onValidate = () => {
    setValidation(validateChipRaw(raw));
  };

  const chipForRegistry = validation?.normalized ?? '';

  return (
    <PageShell maxWidth="lg">
      <BackLink href="/id" label="Back to ID hub" />

      <PageHeader
        eyebrow="Track 2 · Registry lookup"
        eyebrowVariant="emerald"
        title="AAHA & AVID routing"
        subtitle={
          <>
            Validate a chip ID here, then open the official AAHA Universal Pet Microchip Lookup in a
            new tab. Freedom Paws internal match stays on{' '}
            <Link href="/id/scan" className="text-emerald-300 underline">
              /id/scan
            </Link>
            .
            <span className="block mt-1 text-xs text-white/40">App release {PWA_VERSION}</span>
          </>
        }
        className="mt-4 mb-6"
      />

      <SectionCard className="mb-6 border-amber-500/25 bg-amber-950/15 text-sm text-amber-100/90 leading-relaxed">
        Paste or type the chip from your scanner. After validation, copy the ID into AAHA if the
        site does not pre-fill automatically.
      </SectionCard>

      <label className="block text-sm font-semibold text-white/80 mb-2">Chip ID</label>
      <input
        type="text"
        inputMode="numeric"
        autoComplete="off"
        value={raw}
        onChange={(e) => {
          setRaw(e.target.value);
          setValidation(null);
        }}
        placeholder="985141007711681"
        className="w-full rounded-2xl border-2 border-amber-400/40 bg-[#0A1428] px-4 py-4 font-mono text-lg tracking-wide text-amber-100 focus:border-amber-400 focus:outline-none"
      />
      <PrimaryButton
        type="button"
        variant="emerald"
        disabled={!raw.trim()}
        onClick={onValidate}
        className="mt-3 !min-h-[44px] !rounded-xl !px-4 !py-2 !text-sm"
      >
        Validate format
      </PrimaryButton>

      {validation && (
        <SectionCard
          className={`mt-6 ${
            validation.ok
              ? 'border-green-500/40 bg-green-950/20'
              : 'border-red-500/40 bg-red-950/20'
          }`}
        >
          <p className="text-sm font-semibold">
            {validation.ok ? 'Ready for registry lookup' : 'Invalid chip ID'}
          </p>
          {validation.normalized && (
            <p className="mt-2 font-mono text-lg text-amber-200">{validation.normalized}</p>
          )}
          {validation.error && (
            <p className="mt-2 text-xs text-red-300">{validation.error}</p>
          )}
          {validation.warning && (
            <p className="mt-2 text-xs text-amber-200/90">{validation.warning}</p>
          )}
        </SectionCard>
      )}

      <section className="mt-8 space-y-3">
        <a
          href={AAHA_MICROCHIP_LOOKUP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={`block w-full rounded-2xl py-4 text-center font-bold transition ${
            validation?.ok
              ? 'bg-emerald-400 text-black hover:bg-emerald-300'
              : 'bg-white/10 text-white/40 pointer-events-none'
          }`}
          aria-disabled={!validation?.ok}
        >
          Open AAHA Microchip Lookup →
        </a>
        {validation?.ok && chipForRegistry && (
          <p className="text-center text-xs text-white/50">
            Enter <span className="font-mono text-amber-300">{chipForRegistry}</span> on the AAHA
            site if needed.
          </p>
        )}

        <SectionCard>
          <p className="font-semibold text-white/85">AVID non-participant chips</p>
          <p className="mt-2 text-sm text-white/65 leading-relaxed">
            If AAHA does not return a registry for a 9- or 10-digit AVID-format ID, contact AVID
            directly.
          </p>
          <a
            href={AVID_REGISTRY_CONTACT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block text-sm font-semibold text-amber-300 underline"
          >
            AVID Identification Systems →
          </a>
        </SectionCard>

        <Link
          href="/id/scan"
          className="block w-full rounded-2xl border border-white/20 py-3 text-center text-sm text-white/70 hover:bg-white/5"
        >
          Freedom Paws internal match (/id/scan) →
        </Link>
      </section>

      <p className="mt-8 text-center text-[10px] text-white/40 leading-relaxed">
        {CHIP_REGISTRY_DISCLAIMER} In-app AAHA API embed pending partnership approval.
      </p>
    </PageShell>
  );
}
