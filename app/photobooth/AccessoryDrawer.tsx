'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import {
  CARTOON_ACCESSORY_STICKERS,
  PHOTO_PROP_ACCESSORIES,
  stickerCandidates,
  type StickerPlacement,
} from '@/lib/photobooth/themes';

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

function usePropAvailable(src: string): boolean {
  const [available, setAvailable] = useState(false);
  useEffect(() => {
    let cancelled = false;
    const img = new Image();
    img.onload = () => {
      if (!cancelled) setAvailable(true);
    };
    img.onerror = () => {
      if (!cancelled) setAvailable(false);
    };
    img.src = src;
    return () => {
      cancelled = true;
    };
  }, [src]);
  return available;
}

function StickerPickButton({
  sticker,
  onPick,
  onClose,
}: {
  sticker: StickerPlacement;
  onPick: (sticker: StickerPlacement) => void;
  onClose: () => void;
}) {
  return (
    <button
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
  );
}

function PhotoPropButton({
  sticker,
  onPick,
  onClose,
}: {
  sticker: StickerPlacement;
  onPick: (sticker: StickerPlacement) => void;
  onClose: () => void;
}) {
  const available = usePropAvailable(sticker.src);
  if (!available) return null;
  return <StickerPickButton sticker={sticker} onPick={onPick} onClose={onClose} />;
}

function StickerRow({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="mt-4">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-white/40 px-0.5">
        {title}
      </p>
      {hint ? (
        <p className="mt-0.5 text-[10px] text-white/35 leading-relaxed px-0.5">{hint}</p>
      ) : null}
      <div className="mt-2 flex gap-2 overflow-x-auto pb-2 snap-x snap-mandatory photobooth-hscroll">
        {children}
      </div>
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
  const [mounted, setMounted] = useState(false);
  const [propsReady, setPropsReady] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    void Promise.all(
      PHOTO_PROP_ACCESSORIES.map(
        (sticker) =>
          new Promise<boolean>((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = sticker.src;
          })
      )
    ).then((results) => {
      if (!cancelled) setPropsReady(results.some(Boolean));
    });
    return () => {
      cancelled = true;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[250] flex flex-col justify-end pointer-events-auto">
      <button
        type="button"
        aria-label="Close accessories"
        className="absolute inset-0 bg-black/60 touch-manipulation"
        onClick={onClose}
      />
      <div
        className="relative z-10 max-h-[70vh] overflow-y-auto rounded-t-3xl border border-white/10 bg-[#0F1E38] px-4 pt-4 shadow-2xl"
        style={{ paddingBottom: 'calc(2rem + env(safe-area-inset-bottom, 0px))' }}
      >
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-white/20" />
        <h3 className="text-center text-base font-bold text-amber-400">Add accessory</h3>
        <p className="mt-1 text-center text-[10px] text-white/45 leading-relaxed">
          For photoreal costumes on your pet, use{' '}
          <span className="text-amber-400/90">AI Magic Look</span> first. Props are quick extras
          you drag on the photo.
        </p>

        {propsReady ? (
          <StickerRow title="Photo props" hint="Real item cut-outs — drag to fit your pet.">
            {PHOTO_PROP_ACCESSORIES.map((sticker) => (
              <PhotoPropButton
                key={sticker.src}
                sticker={sticker}
                onPick={onPick}
                onClose={onClose}
              />
            ))}
          </StickerRow>
        ) : null}

        <StickerRow title="Fun stickers" hint="Cartoon overlays — swap for PNGs anytime.">
          {CARTOON_ACCESSORY_STICKERS.map((sticker) => (
            <StickerPickButton
              key={sticker.src}
              sticker={sticker}
              onPick={onPick}
              onClose={onClose}
            />
          ))}
        </StickerRow>

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
    </div>,
    document.body
  );
}
