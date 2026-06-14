'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  AI_COSTUME_GROUPS,
  AI_COSTUMES,
  type AiCostumeId,
} from '@/lib/photobooth/ai-costumes';

type Props = {
  open: boolean;
  busy: boolean;
  configured: boolean;
  progress: string;
  onClose: () => void;
  onPick: (costumeId: AiCostumeId) => void;
};

export default function AiCostumeDrawer({
  open,
  busy,
  configured,
  progress,
  onClose,
  onPick,
}: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open || !mounted) return null;

  const costumeById = Object.fromEntries(AI_COSTUMES.map((c) => [c.id, c]));

  return createPortal(
    <div className="fixed inset-0 z-[260] flex flex-col justify-end pointer-events-auto">
      <button
        type="button"
        aria-label="Close AI costumes"
        className="absolute inset-0 bg-black/60 touch-manipulation"
        onClick={onClose}
      />
      <div
        className="relative z-10 max-h-[82vh] rounded-t-3xl border border-white/10 bg-[#0F1E38] px-4 pt-4 shadow-2xl overflow-y-auto"
        style={{ paddingBottom: 'calc(2rem + env(safe-area-inset-bottom, 0px))' }}
      >
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-white/20" />
        <h3 className="text-center text-base font-bold text-amber-400">AI Magic Look ✨</h3>
        <p className="mt-1 text-center text-[10px] text-white/50 leading-relaxed px-2">
          Photorealistic holiday costumes powered by AI (~15–30 sec). Best after{' '}
          <strong className="text-amber-300/90">magic cutout</strong>.
        </p>
        <p className="mt-2 text-center text-[10px] text-white/40 leading-relaxed px-1">
          <strong className="text-white/55">Live AR</strong> (real-time camera tracking) is on our
          roadmap — browsers can&apos;t reliably track pet faces yet. AI Magic Look is our Phase 3
          answer for now.
        </p>

        {!configured && (
          <div className="mt-3 rounded-xl border border-amber-400/35 bg-amber-950/30 p-3 text-center text-xs text-amber-200/90">
            AI engine is being connected — holiday backgrounds below work today. Check back soon!
          </div>
        )}

        {busy && (
          <div className="mt-3 rounded-xl border border-amber-400/40 bg-amber-400/10 p-3 text-center">
            <p className="text-sm font-bold text-amber-300">Creating your look…</p>
            <p className="mt-1 text-xs text-white/60">{progress || 'Please wait'}</p>
          </div>
        )}

        <div className="mt-4 space-y-4">
          {AI_COSTUME_GROUPS.map((group) => (
            <div key={group.label}>
              <p className="text-[10px] font-bold uppercase tracking-wider text-white/45 mb-2">
                {group.label}
              </p>
              <div className="flex flex-wrap gap-2">
                {group.costumeIds.map((id) => {
                  const costume = costumeById[id];
                  if (!costume) return null;
                  return (
                    <button
                      key={id}
                      type="button"
                      disabled={busy || !configured}
                      onClick={() => onPick(id)}
                      className="min-h-[44px] rounded-xl border border-white/15 bg-[#0A1625] px-3 py-2 text-left text-xs font-bold text-white touch-manipulation disabled:opacity-40"
                    >
                      <span className="text-lg mr-1.5">{costume.emoji}</span>
                      {costume.name}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          disabled={busy}
          onClick={onClose}
          className="mt-4 w-full min-h-[40px] text-sm text-white/50 touch-manipulation"
        >
          Cancel
        </button>
      </div>
    </div>,
    document.body
  );
}
