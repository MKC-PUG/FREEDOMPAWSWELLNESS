'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import BackLink from '@/app/components/BackLink';
import PageShell from '@/app/components/ui/PageShell';
import PageHeader from '@/app/components/ui/PageHeader';
import SectionCard from '@/app/components/ui/SectionCard';
import PrimaryButton from '@/app/components/ui/PrimaryButton';
import SecondaryButton from '@/app/components/ui/SecondaryButton';
import { PWA_VERSION } from '@/lib/pwa-version';
import { extractChipDigits, validateChipRaw } from '@/lib/id/chip-id';
import type { ChipScanSource, ChipValidationResult } from '@/lib/id/chip-types';
import { fetchServerPets } from '@/lib/mypets/api';
import type { PetProfile } from '@/lib/mypets/types';

type LookupResult = {
  freedomPawsMatch: boolean;
  petName?: string;
  freedomPawsId?: string;
  qrSlug?: string;
};

type WebSerialPort = {
  open: (options: { baudRate: number }) => Promise<void>;
  close: () => Promise<void>;
  readable: ReadableStream<Uint8Array> | null;
};

declare global {
  interface Navigator {
    serial?: {
      requestPort: () => Promise<WebSerialPort>;
    };
  }
}

type Props = {
  userEmail: string;
};

export default function ScanClient({ userEmail }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const serialRef = useRef<WebSerialPort | null>(null);
  const serialAbortRef = useRef<AbortController | null>(null);

  const [raw, setRaw] = useState('');
  const [pets, setPets] = useState<PetProfile[]>([]);
  const [petId, setPetId] = useState('');
  const [validation, setValidation] = useState<ChipValidationResult | null>(null);
  const [lookup, setLookup] = useState<LookupResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [linked, setLinked] = useState(false);
  const [serialStatus, setSerialStatus] = useState<'off' | 'connecting' | 'on'>('off');
  const [webSerialSupported] = useState(
    () => typeof window !== 'undefined' && 'serial' in navigator
  );

  const loadPets = useCallback(async () => {
    try {
      const list = await fetchServerPets();
      setPets(list ?? []);
      if (list?.[0] && !petId) setPetId(list[0].id);
    } catch {
      setError('Could not load pets.');
    }
  }, [petId]);

  useEffect(() => {
    void loadPets();
    inputRef.current?.focus();
  }, [loadPets]);

  useEffect(() => {
    return () => {
      serialAbortRef.current?.abort();
      void serialRef.current?.close().catch(() => {});
    };
  }, []);

  const runScanPipeline = async (rawInput: string, source: ChipScanSource) => {
    const trimmed = rawInput.trim();
    if (!trimmed) return;

    setBusy(true);
    setError('');
    setLinked(false);

    const local = validateChipRaw(trimmed);
    setValidation(local);

    try {
      const res = await fetch('/api/id/chip/scan-event', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ raw: trimmed, source }),
      });
      const data = await res.json();
      if (data.validation) setValidation(data.validation as ChipValidationResult);
      if (data.success) {
        setLookup((data.lookup ?? null) as LookupResult | null);
      } else {
        setLookup(null);
        setError(data.error || 'Scan could not be processed.');
      }
    } catch {
      setError('Connection error.');
      setLookup(null);
    } finally {
      setBusy(false);
    }
  };

  const onInputChange = (value: string) => {
    setRaw(value);
    setLinked(false);
    if (value.includes('\n') || value.includes('\r')) {
      const cleaned = value.replace(/[\r\n]+/g, ' ').trim();
      setRaw(cleaned);
      void runScanPipeline(cleaned, 'hid');
      return;
    }
    const digits = extractChipDigits(value);
    if (digits && [9, 10, 15].includes(digits.length) && value.replace(/\D/g, '').length >= digits.length) {
      void runScanPipeline(value, 'hid');
    }
  };

  const linkToPet = async () => {
    if (!petId) {
      setError('Select a pet to link this chip.');
      return;
    }
    if (!raw.trim()) {
      setError('Scan or paste a chip ID first.');
      return;
    }

    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/id/chip/link', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ petId, raw }),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.error || 'Link failed.');
        if (data.validation) setValidation(data.validation as ChipValidationResult);
        return;
      }
      setValidation(data.validation as ChipValidationResult);
      setLookup((data.lookup ?? null) as LookupResult | null);
      setLinked(true);
    } catch {
      setError('Connection error.');
    } finally {
      setBusy(false);
    }
  };

  const connectWebSerial = async () => {
    if (!webSerialSupported) {
      setError('Web Serial requires Chrome or Edge on desktop.');
      return;
    }

    setError('');
    setSerialStatus('connecting');

    try {
      serialAbortRef.current?.abort();
      if (serialRef.current) {
        await serialRef.current.close().catch(() => {});
        serialRef.current = null;
      }

      const port = await navigator.serial!.requestPort();
      await port.open({ baudRate: 9600 });
      serialRef.current = port;
      setSerialStatus('on');

      const abort = new AbortController();
      serialAbortRef.current = abort;

      void (async () => {
        const reader = port.readable?.getReader();
        if (!reader) return;
        const decoder = new TextDecoder();
        let buffer = '';

        try {
          while (!abort.signal.aborted) {
            const { value, done } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            const parts = buffer.split(/\r\n|\n|\r/);
            buffer = parts.pop() ?? '';
            for (const line of parts) {
              const trimmed = line.trim();
              if (!trimmed) continue;
              setRaw(trimmed);
              await runScanPipeline(trimmed, 'web_serial');
            }
          }
        } catch {
          if (!abort.signal.aborted) setSerialStatus('off');
        } finally {
          reader.releaseLock();
        }
      })();
    } catch (err) {
      setSerialStatus('off');
      if (err instanceof DOMException && err.name === 'NotFoundError') {
        setError('No serial port selected.');
      } else {
        setError('Could not open scanner port — use wedge into the field below.');
      }
    }
  };

  const disconnectWebSerial = async () => {
    serialAbortRef.current?.abort();
    await serialRef.current?.close().catch(() => {});
    serialRef.current = null;
    setSerialStatus('off');
  };

  return (
    <PageShell maxWidth="lg">
      <BackLink href="/id" label="Back to ID hub" />

      <PageHeader
        eyebrow="Track 2 · Microchip scan"
        eyebrowVariant="emerald"
        title="Link chip to Freedom Paws ID"
        subtitle={
          <>
            Signed in as {userEmail}
            <span className="block mt-1 text-xs text-white/40">App release {PWA_VERSION}</span>
          </>
        }
        className="mt-4 mb-6"
      />

      <SectionCard className="mb-6 border-amber-500/25 bg-amber-950/15 text-sm text-amber-100/90 leading-relaxed">
        Focus this field, scan with your WorldScan (virtual keyboard), or paste the 15-digit ID.
        Extra text like <span className="font-mono text-amber-200">Temp below range</span> is stripped
        automatically.
      </SectionCard>

        {error && (
          <p className="mb-4 rounded-xl border border-red-500/40 bg-red-950/30 px-4 py-3 text-sm text-red-300">
            {error}
          </p>
        )}

        {linked && (
          <p className="mb-4 rounded-xl border border-green-500/40 bg-green-950/30 px-4 py-3 text-sm text-green-300">
            Chip linked to your pet profile.
          </p>
        )}

        <label className="block text-sm font-semibold text-white/80 mb-2">
          Chip ID (scan types here)
        </label>
        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          value={raw}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder="985141007711681"
          className="w-full rounded-2xl border-2 border-amber-400/40 bg-[#0A1428] px-4 py-4 font-mono text-lg tracking-wide text-amber-100 focus:border-amber-400 focus:outline-none"
        />

        <div className="mt-3 flex flex-wrap gap-2">
          <PrimaryButton
            type="button"
            variant="emerald"
            disabled={busy || !raw.trim()}
            onClick={() => void runScanPipeline(raw, 'manual')}
            className="!min-h-[44px] !rounded-xl !px-4 !py-2 !text-sm"
          >
            Validate scan
          </PrimaryButton>
          {webSerialSupported ? (
            serialStatus === 'on' ? (
              <SecondaryButton
                type="button"
                variant="neutral"
                onClick={() => void disconnectWebSerial()}
                className="!min-h-[44px] !rounded-xl !px-4 !py-2 !text-sm"
              >
                Disconnect USB serial
              </SecondaryButton>
            ) : (
              <SecondaryButton
                type="button"
                variant="emerald"
                onClick={() => void connectWebSerial()}
                className="!min-h-[44px] !rounded-xl !px-4 !py-2 !text-sm"
              >
                {serialStatus === 'connecting' ? 'Connecting…' : 'Connect USB serial (Chrome)'}
              </SecondaryButton>
            )
          ) : null}
        </div>

        {validation && (
          <SectionCard
            className={`mt-6 ${
              !validation.ok
                ? 'border-red-500/40 bg-red-950/20'
                : validation.status === 'checksum_fail'
                  ? 'border-amber-500/40 bg-amber-950/20'
                  : 'border-green-500/40 bg-green-950/20'
            }`}
          >
            <p className="text-sm font-semibold">
              {!validation.ok
                ? 'Validation issue'
                : validation.status === 'checksum_fail'
                  ? 'Valid chip ID (checksum warning)'
                  : 'Valid chip ID'}
            </p>
            {validation.normalized && (
              <p className="mt-2 font-mono text-lg text-amber-200">{validation.normalized}</p>
            )}
            <p className="mt-2 text-xs text-white/55">
              {validation.digitCount} digits · {validation.format}
              {validation.checksumOk === true ? ' · ISO checksum OK' : ''}
              {validation.checksumOk === false ? ' · ISO checksum not verified' : ''}
            </p>
            {validation.warning && (
              <p className="mt-2 text-xs text-amber-200/90 leading-relaxed">{validation.warning}</p>
            )}
            {validation.error && !validation.ok && (
              <p className="mt-2 text-xs text-red-300">{validation.error}</p>
            )}
          </SectionCard>
        )}

        {lookup?.freedomPawsMatch && (
          <SectionCard className="mt-4 border-emerald-500/35 bg-emerald-950/20">
            <p className="text-sm font-semibold text-emerald-300">Freedom Paws match</p>
            <p className="mt-1 text-sm text-white/85">
              {lookup.petName}
              {lookup.freedomPawsId ? (
                <>
                  {' '}
                  · <span className="font-mono text-amber-300">{lookup.freedomPawsId}</span>
                </>
              ) : null}
            </p>
            <p className="mt-2 text-xs text-white/55 leading-relaxed">
              This chip is linked to a Freedom Paws biometric profile. To link a different pet, use
              a new chip ID — each chip can only attach to one pet.
            </p>
            {lookup.qrSlug ? (
              <Link
                href={`/id/p/${lookup.qrSlug}`}
                className="mt-3 inline-block text-sm font-semibold text-emerald-300 underline"
              >
                Open QR pet card →
              </Link>
            ) : null}
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href="/id/settings"
                className="rounded-lg border border-white/20 px-3 py-1.5 text-xs font-semibold text-white/70"
              >
                ID settings →
              </Link>
              <Link
                href="/id/lookup"
                className="rounded-lg border border-amber-500/30 px-3 py-1.5 text-xs font-semibold text-amber-300"
              >
                AAHA registry lookup →
              </Link>
            </div>
          </SectionCard>
        )}

        {validation?.ok && !lookup?.freedomPawsMatch && (
          <SectionCard className="mt-6 space-y-3">
            <label className="block text-sm font-semibold text-white/80">Link to your pet</label>
            <select
              value={petId}
              onChange={(e) => setPetId(e.target.value)}
              className="w-full rounded-xl bg-[#0A1428] border border-white/20 px-3 py-3 text-sm"
            >
              {pets.length === 0 ? (
                <option value="">Add a pet in My Pets first</option>
              ) : (
                pets.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))
              )}
            </select>
            <PrimaryButton
              type="button"
              variant="emerald"
              fullWidth
              disabled={busy || !petId || pets.length === 0}
              onClick={() => void linkToPet()}
            >
              Save chip to pet profile
            </PrimaryButton>
          </SectionCard>
        )}

        <p className="mt-8 text-center text-[10px] text-white/40 leading-relaxed">
          External registry (AAHA / AVID):{' '}
          <Link href="/id/lookup" className="underline">
            /id/lookup
          </Link>
          . This page stores Freedom Paws internal chip ↔ biometric links only.
        </p>
    </PageShell>
  );
}
