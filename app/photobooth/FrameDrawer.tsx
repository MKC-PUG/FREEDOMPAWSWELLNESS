'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  FRAME_STYLES,
  FRAME_WIDTH_MAX,
  FRAME_WIDTH_MIN,
  getFrameStyle,
  type FrameStyleId,
} from '@/lib/photobooth/frames';

type Props = {
  open: boolean;
  onClose: () => void;
  frameId: FrameStyleId;
  frameWidth: number;
  cutoutApplied: boolean;
  themeId: string;
  onFrameStyle: (id: FrameStyleId) => void;
  onFrameWidth: (width: number) => void;
};

export default function FrameDrawer({
  open,
  onClose,
  frameId,
  frameWidth,
  cutoutApplied,
  themeId,
  onFrameStyle,
  onFrameWidth,
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

  const activeFrame = getFrameStyle(frameId);

  return createPortal(
    <div className="fixed inset-0 z-[250] flex flex-col justify-end pointer-events-auto">
      <button
        type="button"
        aria-label="Close frame picker"
        className="absolute inset-0 bg-black/60 touch-manipulation"
        onClick={onClose}
      />
      <div
        className="relative z-10 max-h-[70vh] rounded-t-3xl border border-white/10 bg-[#0F1E38] px-4 pt-4 shadow-2xl"
        style={{ paddingBottom: 'calc(2rem + env(safe-area-inset-bottom, 0px))' }}
      >
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-white/20" />
        <h3 className="text-center text-base font-bold text-amber-400">Picture frame</h3>
        <p className="mt-1 text-center text-[10px] text-white/45 leading-relaxed">
          {cutoutApplied && themeId !== 'frame-only'
            ? 'Optional mat & border on top of your scene'
            : 'Works on any style · drag slider for thin → thick'}
        </p>
        <div className="mt-4 flex gap-2 overflow-x-auto pb-2 snap-x snap-mandatory photobooth-hscroll">
          {FRAME_STYLES.map((frame) => (
            <button
              key={frame.id}
              type="button"
              onClick={() => onFrameStyle(frame.id)}
              className={`shrink-0 snap-start flex flex-col items-center gap-1.5 rounded-xl px-3 py-2.5 min-w-[4.25rem] touch-manipulation ${
                frameId === frame.id
                  ? 'bg-amber-400/15 border-2 border-amber-400'
                  : 'bg-black/30 border border-white/10'
              }`}
            >
              <span
                className="block h-8 w-8 rounded-md border border-white/25 shadow-inner"
                style={{
                  background:
                    frame.id === 'none'
                      ? 'linear-gradient(135deg, #3d4554 50%, #2c3442 50%)'
                      : frame.swatch,
                }}
              />
              <span className="text-[10px] font-semibold text-white/90">{frame.name}</span>
            </button>
          ))}
        </div>
        {frameId !== 'none' && (
          <div className="mt-4">
            <div className="flex justify-between text-[10px] text-white/45 mb-1.5">
              <span>Thin</span>
              <span className="text-amber-300/80">{activeFrame.name} thickness</span>
              <span>Thick</span>
            </div>
            <input
              type="range"
              min={FRAME_WIDTH_MIN}
              max={FRAME_WIDTH_MAX}
              step={0.02}
              value={frameWidth}
              onChange={(e) => onFrameWidth(Number(e.target.value))}
              className="photobooth-frame-slider w-full touch-none"
              aria-label="Frame thickness"
            />
          </div>
        )}
        <button
          type="button"
          onClick={onClose}
          className="mt-4 w-full min-h-[44px] rounded-xl bg-amber-400 py-2.5 text-sm font-bold text-black touch-manipulation"
        >
          Done
        </button>
      </div>
    </div>,
    document.body
  );
}
