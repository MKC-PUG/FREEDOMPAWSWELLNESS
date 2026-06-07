'use client';

import { useState } from 'react';
import { ACCESSORY_STICKERS, stickerCandidates, type StickerPlacement } from '@/lib/photobooth/themes';

type Props = {
  open: boolean;
  onClose: () => void;
  onPick: (sticker: StickerPlacement) => void;
  hasSelection: boolean;
  onRemoveSelected: () => void;
};

function StickerThumb({ src }: { src: string }) {
  const [url, setUrl] = useState(stickerCandidates(src)[0]);
  const candidates = stickerCandidates(src);
  const tryNext = () => {
    const idx = candidates.indexOf(url);
    if (idx >= 0 && idx < candidates.length - 1) {
      setUrl(candidates[idx + 1]);
    }
  };

  return (
    <div className="h-10 w-10 shrink-0 rounded-lg border border-white/15 bg-black/40 overflow-hidden flex items-center justify-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url}
        alt=""
        className="max-h-full max-w-full object-contain p-0.5"
        onError={tryNext}
      />
    </div>
  );
}

export default function AccessoryDrawer({
  open,
  onClose,
  onPick,
  hasSelection,
  onRemoveSelected,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[110] flex flex-col justify-end">
      <button
        type="button"
        aria-label="Close accessories"
        className="absolute inset-0 bg-black/60 touch-manipulation"
        onClick={onClose}
      />
      <div className="relative z-10 max-h-[70vh] rounded-t-3xl border border-white/10 bg-[#0F1E38] px-4 pt-4 pb-8 shadow-2xl">
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-white/20" />
        <h3 className="text-center text-base font-bold text-amber-400">Add accessory</h3>
        <p className="mt-1 text-center text-[10px] text-white/45 leading-relaxed">
          Tap to add · drag on photo · resize corners · double-tap to remove
        </p>
        <div className="mt-4 flex gap-2 overflow-x-auto pb-2 snap-x snap-mandatory photobooth-hscroll">
          {ACCESSORY_STICKERS.map((sticker) => (
            <button
              key={sticker.src}
              type="button"
              onClick={() => {
                onPick(sticker);
                onClose();
              }}
              className="shrink-0 snap-start flex items-center gap-2 min-h-[44px] max-w-[9rem] rounded-xl border border-white/15 bg-black/30 px-2.5 py-2 touch-manipulation hover:border-amber-400/50 active:bg-amber-400/10"
            >
              <StickerThumb src={sticker.src} />
              <span className="text-[11px] font-semibold text-left leading-tight text-white/90">
                {sticker.label}
              </span>
            </button>
          ))}
        </div>
        {hasSelection && (
          <button
            type="button"
            onClick={() => {
              onRemoveSelected();
              onClose();
            }}
            className="mt-4 w-full min-h-[44px] rounded-xl border border-red-500/40 py-2.5 text-sm text-red-300 touch-manipulation"
          >
            Remove selected accessory
          </button>
        )}
        <button
          type="button"
          onClick={onClose}
          className="mt-3 w-full min-h-[40px] text-sm text-white/50 touch-manipulation"
        >
          Done
        </button>
      </div>
    </div>
  );
}
