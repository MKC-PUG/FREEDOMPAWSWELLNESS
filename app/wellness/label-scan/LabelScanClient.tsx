'use client';

import { useState } from 'react';
import Link from 'next/link';
import { NOT_A_LAB_TEST, TIER_LABEL, type HazardHit, type LabelCategory } from '@/lib/wellness/not-good-list';

type Result = {
  transcript: string;
  unreadable: boolean;
  hits: HazardHit[];
  source: 'photo' | 'pasted-text';
};

const CATEGORIES: { id: LabelCategory; label: string }[] = [
  { id: 'food', label: 'Dog food' },
  { id: 'treat', label: 'Treat' },
  { id: 'chew', label: 'Chew' },
  { id: 'toy', label: 'Toy or other item' },
];

export default function LabelScanClient() {
  const [category, setCategory] = useState<LabelCategory>('food');
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<Result | null>(null);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError('');
    setResult(null);
    setPending(true);
    try {
      const response = file
        ? await fetch('/api/wellness/labels/read', {
            method: 'POST',
            body: (() => {
              const body = new FormData();
              body.set('category', category);
              body.set('image', file);
              return body;
            })(),
          })
        : await fetch('/api/wellness/labels/read', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ category, text }),
          });
      const data = (await response.json()) as { success?: boolean; error?: string; result?: Result };
      if (!response.ok || !data.success || !data.result) {
        throw new Error(data.error || 'Could not check that label.');
      }
      setResult(data.result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not check that label.');
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <fieldset>
        <legend className="text-sm font-semibold text-white/80">What is in the photo?</legend>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {CATEGORIES.map((item) => (
            <label
              key={item.id}
              className={`rounded-xl border px-3 py-3 text-sm ${
                category === item.id
                  ? 'border-amber-400/70 bg-amber-950/40 text-amber-100'
                  : 'border-white/15 text-white/70'
              }`}
            >
              <input
                type="radio"
                name="category"
                value={item.id}
                checked={category === item.id}
                onChange={() => setCategory(item.id)}
                className="mr-2"
              />
              {item.label}
            </label>
          ))}
        </div>
      </fieldset>

      <label className="block text-sm text-white/80">
        Photo of the ingredient or material panel
        <input
          type="file"
          accept="image/*"
          capture="environment"
          className="mt-2 block w-full text-sm text-white/70"
          onChange={(event) => setFile(event.target.files?.[0] ?? null)}
        />
      </label>

      <label className="block text-sm text-white/80">
        Or paste the panel
        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          rows={5}
          placeholder="Chicken, peas, pea protein, BHA…"
          className="mt-2 w-full rounded-xl border border-white/15 bg-[#0A1428] px-3 py-3 text-sm text-white"
        />
      </label>

      <button
        type="submit"
        disabled={pending || (!file && text.trim().length < 3)}
        className="w-full rounded-2xl bg-[#F5C242] py-4 text-sm font-bold text-black disabled:opacity-50"
      >
        {pending ? 'Reading…' : 'Check against the not-good list'}
      </button>

      {error ? <p className="text-sm text-red-300">{error}</p> : null}

      {result ? <ScanResult result={result} /> : null}

      <p className="text-[11px] leading-relaxed text-white/45">{NOT_A_LAB_TEST}</p>
      <p className="text-[11px] leading-relaxed text-white/45">
        This check does not search FDA recall notices. If you want that, look up the brand on the FDA
        pet-food recall page. A recall is not something a label photo can see.
      </p>
      <p className="text-[11px] text-white/45">
        The full list is on{' '}
        <Link href="/wellness/not-good-list" className="text-amber-300 underline">
          the not-good list
        </Link>
        . Household items that are not pet products are on{' '}
        <Link href="/wellness/household-hazards" className="text-amber-300 underline">
          the household page
        </Link>
        .
      </p>
    </form>
  );
}

function ScanResult({ result }: { result: Result }) {
  if (result.unreadable) {
    return (
      <div className="rounded-2xl border border-amber-400/40 bg-amber-950/30 p-5">
        <h2 className="text-sm font-bold text-amber-200">No pass</h2>
        <p className="mt-2 text-sm leading-relaxed text-white/75">
          The panel could not be read. An unreadable label is not a pass and not a finding that the
          product is fine. Take a closer photo or paste the words.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-white/10 bg-[#0A1428]/60 p-5">
        <h2 className="text-sm font-bold text-white/80">Words read</h2>
        <p className="mt-2 text-sm leading-relaxed text-white/70">{result.transcript}</p>
      </div>
      {result.hits.length === 0 ? (
        <div className="rounded-2xl border border-white/10 p-5">
          <h2 className="text-sm font-bold text-white">No list words in what we could read</h2>
          <p className="mt-2 text-sm leading-relaxed text-white/70">{NOT_A_LAB_TEST}</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {result.hits.map((hit) => (
            <li key={hit.id} className="rounded-2xl border border-amber-400/40 bg-amber-950/20 p-5">
              <p className="text-[11px] font-bold uppercase tracking-wide text-amber-300">
                {TIER_LABEL[hit.tier]}
              </p>
              <h2 className="mt-1 text-base font-bold text-white">{hit.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-white/75">{hit.note}</p>
              <p className="mt-2 text-xs text-white/50">
                Matched: {hit.matchedPhrases.join(', ')}. Source:{' '}
                <a href={hit.sourceUrl} className="text-amber-300 underline" target="_blank" rel="noreferrer">
                  {hit.sourceName}
                </a>
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
