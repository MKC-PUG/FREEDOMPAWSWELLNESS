'use client';

import { useEffect, useState } from 'react';
import type { CanvaDraft, CanvaKind } from '@/lib/ops/studio-catalog';

const KINDS: { id: CanvaKind; label: string }[] = [
  { id: 'end_card', label: 'End card' },
  { id: 'thumbnail', label: 'Thumbnail' },
  { id: 'one_pager', label: 'One-page sheet' },
];

type Status = {
  clientReady: boolean;
  connected: boolean;
  templates: { id: string; title: string }[];
  saved: Record<CanvaKind, string>;
  listError: string | null;
};

export default function OpsCanvaPanel({
  jobId,
  draft,
  busy,
  onDraft,
  onApprove,
  onReject,
}: {
  jobId: string;
  draft: CanvaDraft | null;
  busy: boolean;
  onDraft: (kind: CanvaKind) => void;
  onApprove: () => void;
  onReject: () => void;
}) {
  const [status, setStatus] = useState<Status | null>(null);
  const [saved, setSaved] = useState<Record<CanvaKind, string>>({
    end_card: '',
    thumbnail: '',
    one_pager: '',
  });
  const [note, setNote] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void fetch('/api/ops/canva/status')
      .then((res) => res.json())
      .then((data: Status & { success?: boolean }) => {
        if (cancelled || !data.success) return;
        setStatus(data);
        setSaved(data.saved);
      })
      .catch(() => {
        if (!cancelled) setNote('Canva status could not be loaded.');
      });
    return () => {
      cancelled = true;
    };
  }, [jobId]);

  async function saveTemplates() {
    setNote(null);
    const res = await fetch('/api/ops/canva/templates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(saved),
    });
    const data = (await res.json()) as { success?: boolean; error?: string };
    setNote(data.success ? 'Templates saved.' : data.error || 'Could not save the templates.');
  }

  return (
    <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-3">
      <p className="text-xs font-bold uppercase tracking-wide text-[#F5C242]">Canva layout</p>
      <p className="mt-1 text-xs text-white/55">
        Fills a brand template you already designed. You approve the file here. It is not sent to
        Buffer.
      </p>

      {!status ? <p className="mt-2 text-xs text-white/45">Checking Canva…</p> : null}

      {status && !status.clientReady ? (
        <p className="mt-2 text-xs text-amber-200">
          Add CANVA_CLIENT_ID and CANVA_CLIENT_SECRET in Vercel. Register the redirect
          https://app.freedompawsinc.com/api/ops/canva/callback on the Canva app. Scopes:
          design content read and write, brand template meta and content read, asset read and
          write.
        </p>
      ) : null}

      {status?.clientReady && !status.connected ? (
        <a
          href="/api/ops/canva/start"
          className="mt-3 inline-block rounded-xl bg-[#F5C242] px-3 py-2 text-xs font-bold text-[#0A1428]"
        >
          Connect Canva
        </a>
      ) : null}

      {status?.connected ? (
        <div className="mt-3 space-y-2">
          {status.listError ? <p className="text-xs text-amber-200">{status.listError}</p> : null}
          {status.templates.length === 0 && !status.listError ? (
            <p className="text-xs text-white/55">
              Publish a brand template in Canva, then refresh. Tag the text fields HEADLINE, CTA,
              and MODULE. Tag BODY on the one-page sheet. Tag STILL as an image when the layout
              uses the locked plate.
            </p>
          ) : null}
          {KINDS.map((kind) => (
            <label key={kind.id} className="block text-xs text-white/60">
              {kind.label}
              <select
                className="mt-1 w-full rounded-xl border border-white/15 bg-[#0A1428] px-3 py-2 text-sm text-white"
                value={saved[kind.id]}
                onChange={(e) => setSaved((prev) => ({ ...prev, [kind.id]: e.target.value }))}
              >
                <option value="">Choose a template</option>
                {status.templates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.title}
                  </option>
                ))}
              </select>
            </label>
          ))}
          <button
            type="button"
            disabled={busy}
            className="rounded-xl border border-white/20 px-3 py-2 text-xs font-bold"
            onClick={() => void saveTemplates()}
          >
            Save templates
          </button>
          <div className="flex flex-wrap gap-2">
            {KINDS.map((kind) => (
              <button
                key={kind.id}
                type="button"
                disabled={busy || !saved[kind.id]}
                className="rounded-xl border border-[#F5C242]/50 px-3 py-2 text-xs font-bold text-[#F5C242] disabled:opacity-40"
                onClick={() => onDraft(kind.id)}
              >
                Make {kind.label.toLowerCase()}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {draft ? (
        <div className="mt-3 rounded-xl border border-white/10 p-3">
          <p className="text-xs text-white/70">
            {draft.status === 'approved'
              ? 'Approved. Hand to SuperBud will attach the link. Buffer does not receive this file.'
              : 'Waiting on you. Nothing was sent.'}
          </p>
          {draft.exportUrl ? (
            draft.exportUrl.endsWith('.pdf') ? (
              <a
                href={draft.exportUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-2 block text-xs text-[#F5C242] underline"
              >
                Open the one-page sheet
              </a>
            ) : (
              <img
                src={draft.exportUrl}
                alt="Canva layout waiting for approval"
                className="mt-2 max-h-64 rounded-lg"
              />
            )
          ) : null}
          <div className="mt-2 flex gap-2">
            {draft.status === 'ready' ? (
              <button
                type="button"
                disabled={busy}
                className="rounded-xl bg-[#F5C242] px-3 py-2 text-xs font-bold text-[#0A1428]"
                onClick={onApprove}
              >
                Approve Canva layout
              </button>
            ) : null}
            <button
              type="button"
              disabled={busy}
              className="rounded-xl border border-white/20 px-3 py-2 text-xs font-bold"
              onClick={onReject}
            >
              Reject
            </button>
          </div>
        </div>
      ) : null}
      {note ? <p className="mt-2 text-xs text-white/70">{note}</p> : null}
    </div>
  );
}
