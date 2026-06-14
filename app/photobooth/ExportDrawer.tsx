'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

type Props = {
  open: boolean;
  busy: boolean;
  onClose: () => void;
  onSaveToPhotos: () => void;
  onShareSocial: () => void;
  onShareEmail: () => void;
};

export default function ExportDrawer({
  open,
  busy,
  onClose,
  onSaveToPhotos,
  onShareSocial,
  onShareEmail,
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

  const btn =
    'w-full min-h-[52px] rounded-xl py-3 text-sm font-bold touch-manipulation disabled:opacity-50';

  return createPortal(
    <div className="fixed inset-0 z-[260] flex flex-col justify-end pointer-events-auto">
      <button
        type="button"
        aria-label="Close export options"
        className="absolute inset-0 bg-black/60 touch-manipulation"
        onClick={onClose}
      />
      <div
        className="relative z-10 rounded-t-3xl border border-white/10 bg-[#0F1E38] px-4 pt-4 shadow-2xl"
        style={{ paddingBottom: 'calc(2rem + env(safe-area-inset-bottom, 0px))' }}
      >
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-white/20" />
        <h3 className="text-center text-base font-bold text-amber-400">Share / Save your photo</h3>
        <p className="mt-1 text-center text-[10px] text-white/45 leading-relaxed">
          Every export includes a small Freedom Paws Wellness credit at the bottom
        </p>

        <div className="mt-4 space-y-2">
          <button
            type="button"
            disabled={busy}
            onClick={onSaveToPhotos}
            className={`${btn} bg-amber-400 text-black`}
          >
            {busy ? 'Preparing…' : '📷 Save to photo library'}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={onShareSocial}
            className={`${btn} border border-amber-400/50 bg-amber-400/10 text-amber-200`}
          >
            {busy ? 'Preparing…' : '📱 Post to social media'}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={onShareEmail}
            className={`${btn} border border-white/20 text-white/85`}
          >
            {busy ? 'Preparing…' : '✉️ Email'}
          </button>
        </div>

        <button
          type="button"
          disabled={busy}
          onClick={onClose}
          className="mt-3 w-full min-h-[40px] text-sm text-white/50 touch-manipulation"
        >
          Cancel
        </button>
      </div>
    </div>,
    document.body
  );
}
