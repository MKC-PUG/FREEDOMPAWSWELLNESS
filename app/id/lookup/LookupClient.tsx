'use client';

import { useState } from 'react';
import Link from 'next/link';
import BackLink from '@/app/components/BackLink';
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
    <div className="min-h-screen bg-[#0A1625] text-white font-sans">
      <div className="mx-auto max-w-lg px-6 py-10">
        <BackLink href="/id" label="Back to ID hub" />

        <header className="mt-4 mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">
            Track 2 · Registry lookup
          </p>
          <h1 className="mt-2 text-2xl font-bold">AAHA &amp; AVID routing</h1>
          <p className="mt-2 text-sm text-white/65 leading-relaxed">
            Validate a chip ID here, then open the official AAHA Universal Pet Microchip Lookup in a
            new tab. Freedom Paws internal match stays on{' '}
            <Link href="/id/scan" className="text-amber-300 underline">
              /id/scan
            </Link>
            .
          </p>
          <p className="mt-1 text-xs text-white/40">App release {PWA_VERSION}</p>
        </header>

        <div className="mb-6 rounded-2xl border border-amber-500/25 bg-amber-950/15 px-4 py-3 text-sm text-amber-100/90 leading-relaxed">
          Paste or type the chip from your scanner. After validation, copy the ID into AAHA if the
          site does not pre-fill automatically.
        </div>

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
        <button
          type="button"
          disabled={!raw.trim()}
          onClick={onValidate}
          className="mt-3 rounded-xl bg-amber-400 px-4 py-2 text-sm font-bold text-black disabled:opacity-50"
        >
          Validate format
        </button>

        {validation && (
          <div
            className={`mt-6 rounded-2xl border p-4 ${
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
          </div>
        )}

        <section className="mt-8 space-y-3">
          <a
            href={AAHA_MICROCHIP_LOOKUP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`block w-full rounded-2xl py-4 text-center font-bold transition ${
              validation?.ok
                ? 'bg-emerald-500 text-black hover:bg-emerald-400'
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

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/65">
            <p className="font-semibold text-white/85">AVID non-participant chips</p>
            <p className="mt-2 leading-relaxed">
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
          </div>

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
      </div>
    </div>
  );
}
