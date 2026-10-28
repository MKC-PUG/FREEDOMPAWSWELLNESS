'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import type { CeoCardState, CeoCardView } from '@/lib/ops/ceo-desk';
import { OpsCard, OpsSection } from './OpsUi';

type Props = {
  initialCards: CeoCardView[];
  emergencyStop: boolean;
};

const STATE_LABEL: Record<CeoCardState, string> = {
  open: 'Open',
  approved: 'Draft accepted',
  held: 'Held',
  ready: 'Ready for you',
};

export default function OpsCeoDesk({ initialCards, emergencyStop }: Props) {
  const router = useRouter();
  const [cards, setCards] = useState(initialCards);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const priority = useMemo(() => cards.filter((card) => card.lane === 'priority'), [cards]);
  const overflow = useMemo(() => cards.filter((card) => card.lane === 'overflow'), [cards]);
  const openPriority = priority.filter((card) => card.state === 'open').length;

  async function patch(id: string, body: Record<string, unknown>) {
    setSavingId(id);
    setError(null);
    try {
      const res = await fetch('/api/ops/ceo', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...body }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Save failed');
      setCards(data.cards);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSavingId(null);
    }
  }

  async function markReady(card: CeoCardView) {
    if (card.id === 'email-info' && card.draft.trim()) {
      try {
        await navigator.clipboard.writeText(card.draft);
        setCopiedId(card.id);
      } catch {
        setCopiedId(null);
      }
    }
    await patch(card.id, { state: 'ready', draft: card.draft, note: card.note });
  }

  return (
    <div className="mb-10">
      <OpsSection title="Today">
        <div className="mb-4 rounded-2xl border border-emerald-500/40 bg-emerald-950/30 px-4 py-3 text-sm text-emerald-50">
          <strong>L5 posting gate cleared October 28, 2026.</strong> Bass October 26 Terms and
          Privacy are final for the Tennessee pilot. They are not an approval letter. Agents
          draft. You send, pay, and publish. This page does not send email, place a call, submit
          a grant, or paste the Terms into the app.
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          <Strip label="Five boxes still open" value={String(openPriority)} />
          <Strip label="Overflow" value={String(overflow.length)} />
          <Strip label="Public mode" value="Off" />
          <Strip label="Emergency stop" value={emergencyStop ? 'On' : 'Off'} />
        </div>
        <p className="text-xs text-white/45">
          Budget about 30–45 minutes. Work the five cards. Overflow waits. info@ and (629)
          206-4430 are live; this desk does not log into either one.
        </p>
      </OpsSection>

      {error ? (
        <div className="mb-4 rounded-xl border border-rose-500/40 bg-rose-950/30 px-4 py-3 text-sm text-rose-200">
          {error}
        </div>
      ) : null}

      <OpsSection title="Five boxes">
        <div className="space-y-4">
          {priority.map((card) => (
            <CardEditor
              key={card.id}
              card={card}
              saving={savingId === card.id}
              copied={copiedId === card.id}
              onDraft={(draft) =>
                setCards((current) => current.map((item) => (item.id === card.id ? { ...item, draft } : item)))
              }
              onNote={(note) =>
                setCards((current) => current.map((item) => (item.id === card.id ? { ...item, note } : item)))
              }
              onApprove={() => patch(card.id, { state: 'approved', draft: card.draft, note: card.note })}
              onHold={() => patch(card.id, { state: 'held', draft: card.draft, note: card.note })}
              onReady={() => markReady(card)}
              onReopen={() => patch(card.id, { state: 'open', draft: card.draft, note: card.note })}
            />
          ))}
        </div>
      </OpsSection>

      <OpsSection title="Overflow">
        <div className="space-y-4">
          {overflow.map((card) => (
            <CardEditor
              key={card.id}
              card={card}
              saving={savingId === card.id}
              copied={copiedId === card.id}
              onDraft={(draft) =>
                setCards((current) => current.map((item) => (item.id === card.id ? { ...item, draft } : item)))
              }
              onNote={(note) =>
                setCards((current) => current.map((item) => (item.id === card.id ? { ...item, note } : item)))
              }
              onApprove={() => patch(card.id, { state: 'approved', draft: card.draft, note: card.note })}
              onHold={() => patch(card.id, { state: 'held', draft: card.draft, note: card.note })}
              onReady={() => markReady(card)}
              onReopen={() => patch(card.id, { state: 'open', draft: card.draft, note: card.note })}
            />
          ))}
        </div>
      </OpsSection>
    </div>
  );
}

function Strip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
      <p className="text-[10px] uppercase tracking-wide text-white/45">{label}</p>
      <p className="mt-1 text-lg font-bold">{value}</p>
    </div>
  );
}

function CardEditor({
  card,
  saving,
  copied,
  onDraft,
  onNote,
  onApprove,
  onHold,
  onReady,
  onReopen,
}: {
  card: CeoCardView;
  saving: boolean;
  copied: boolean;
  onDraft: (value: string) => void;
  onNote: (value: string) => void;
  onApprove: () => void;
  onHold: () => void;
  onReady: () => void;
  onReopen: () => void;
}) {
  return (
    <OpsCard>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[10px] font-bold uppercase tracking-wide text-[#F5C242]">{card.seatLabel}</p>
        <span className="text-[10px] uppercase tracking-wide text-white/50">{STATE_LABEL[card.state]}</span>
      </div>
      <h3 className="mt-2 font-bold">{card.title}</h3>
      <label className="mt-3 block text-xs text-white/50">
        Draft
        <textarea
          value={card.draft}
          onChange={(e) => onDraft(e.target.value)}
          rows={card.lane === 'priority' ? 6 : 4}
          className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white/90"
        />
      </label>
      <p className="mt-2 text-xs text-rose-200/80">{card.doNot}</p>
      <p className="mt-1 text-xs text-white/45">Done when: {card.doneWhen}</p>
      {card.blockedReason ? <p className="mt-1 text-xs text-amber-200/80">{card.blockedReason}</p> : null}
      <label className="mt-3 block text-xs text-white/50">
        {card.noteLabel}
        <textarea
          value={card.note}
          onChange={(e) => onNote(e.target.value)}
          rows={2}
          className="mt-1 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white/90"
        />
      </label>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {card.state === 'open' ? (
          <button
            type="button"
            disabled={saving}
            onClick={onApprove}
            className="rounded-lg bg-[#F5C242] px-3 py-2 text-xs font-bold text-[#0A1428] disabled:opacity-50"
          >
            Accept draft
          </button>
        ) : (
          <button
            type="button"
            disabled={saving}
            onClick={onReopen}
            className="rounded-lg border border-white/15 px-3 py-2 text-xs font-bold text-white/80 disabled:opacity-50"
          >
            Reopen
          </button>
        )}
        <button
          type="button"
          disabled={saving}
          onClick={onHold}
          className="rounded-lg border border-white/15 px-3 py-2 text-xs font-bold text-white/80 disabled:opacity-50"
        >
          Hold
        </button>
        {card.readyLabel ? (
          <button
            type="button"
            disabled={saving}
            onClick={onReady}
            className="rounded-lg border border-[#F5C242]/40 px-3 py-2 text-xs font-bold text-[#F5C242] disabled:opacity-50"
          >
            {card.readyLabel}
          </button>
        ) : null}
        {card.href && card.hrefLabel ? (
          <Link href={card.href} className="text-xs font-bold text-[#F5C242] hover:underline">
            {card.hrefLabel} →
          </Link>
        ) : null}
        {copied ? <span className="text-xs text-emerald-300">Reply copied. Send it from info@.</span> : null}
      </div>
    </OpsCard>
  );
}
