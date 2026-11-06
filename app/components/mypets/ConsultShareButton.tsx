'use client';

import { useState } from 'react';

type Props = {
  petId: string;
};

export default function ConsultShareButton({ petId }: Props) {
  const [path, setPath] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const createLink = async () => {
    setBusy(true);
    setError('');
    setCopied(false);
    try {
      const res = await fetch(`/api/pets/${encodeURIComponent(petId)}/vault/consult`, {
        method: 'POST',
        credentials: 'include',
      });
      const data = (await res.json()) as { success?: boolean; path?: string; error?: string };
      if (!res.ok || !data.success || !data.path) {
        throw new Error(data.error || 'Could not create the link.');
      }
      setPath(data.path);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create the link.');
    } finally {
      setBusy(false);
    }
  };

  const url = path && typeof window !== 'undefined' ? `${window.location.origin}${path}` : path;

  return (
    <div className="rounded-2xl border border-white/10 bg-[#16223C] p-4">
      <p className="text-sm font-bold">For your veterinarian</p>
      <p className="mt-1 text-sm leading-relaxed text-white/65">
        One link opens this dog’s notes, pictures, and walking videos. It works in the exam room
        and on a virtual visit, and it lasts 14 days.
      </p>
      <button
        type="button"
        disabled={busy}
        onClick={() => void createLink()}
        className="mt-3 min-h-[44px] rounded-full bg-[#F5C242] px-5 text-sm font-bold text-black disabled:opacity-60"
      >
        {busy ? 'Preparing…' : 'Create veterinarian link'}
      </button>
      {url ? (
        <div className="mt-3">
          <p className="break-all text-sm text-[#F5C242]">{url}</p>
          <button
            type="button"
            onClick={() => {
              void navigator.clipboard.writeText(url).then(() => setCopied(true));
            }}
            className="mt-2 text-sm font-bold text-white"
          >
            {copied ? 'Copied' : 'Copy link'}
          </button>
        </div>
      ) : null}
      {error ? <p className="mt-2 text-sm text-red-300">{error}</p> : null}
    </div>
  );
}
