'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import PhotoUploadZone from '@/app/components/PhotoUploadZone';
import { clearPhotoFromDb } from '@/lib/photo-db';
import { clearPhotoPreview } from '@/lib/photo-storage';
import {
  EXTRA_STICKERS,
  PHOTO_BOOTH_THEMES,
} from '@/lib/photobooth/themes';
import {
  FRAME_STYLES,
  FRAME_WIDTH_MAX,
  FRAME_WIDTH_MIN,
  type FrameStyleId,
} from '@/lib/photobooth/frames';
import type { PhotoBoothCanvasHandle, StickerListItem } from './PhotoBoothCanvas';

const PhotoBoothCanvas = dynamic(() => import('./PhotoBoothCanvas'), {
  ssr: false,
  loading: () => (
    <div className="flex aspect-[4/3] items-center justify-center rounded-2xl border border-white/15 bg-[#0F1E38]/50 text-sm text-amber-300">
      Loading editor…
    </div>
  ),
});

type Props = {
  initialUploadId: string | null;
  uploadError: string | null;
  uploadSuccess: boolean;
};

async function fetchUploadBlob(uploadId: string): Promise<Blob> {
  const res = await fetch(`/api/upload-photo?id=${encodeURIComponent(uploadId)}`);
  if (!res.ok) throw new Error('fetch failed');
  return res.blob();
}

export default function PhotoBoothClient({
  initialUploadId,
  uploadError,
  uploadSuccess,
}: Props) {
  const canvasRef = useRef<PhotoBoothCanvasHandle>(null);
  const blobUrlRef = useRef<string | null>(null);

  const [petImageUrl, setPetImageUrl] = useState<string | null>(null);
  const [loadingPhoto, setLoadingPhoto] = useState(Boolean(initialUploadId));
  const [editorActive, setEditorActive] = useState(false);
  const [themeId, setThemeId] = useState(PHOTO_BOOTH_THEMES[0].id);
  const [canvasReady, setCanvasReady] = useState(false);
  const [error, setError] = useState('');
  const [localUploadError, setLocalUploadError] = useState('');
  const [customizeOpen, setCustomizeOpen] = useState(false);
  const [shareMsg, setShareMsg] = useState('');
  const [canvasStickers, setCanvasStickers] = useState<StickerListItem[]>([]);
  const [selectedStickerId, setSelectedStickerId] = useState<number | null>(null);
  const [frameId, setFrameId] = useState<FrameStyleId>('walnut');
  const [frameWidth, setFrameWidth] = useState(0.5);

  const handleStickersChange = useCallback(
    (stickers: StickerListItem[], selectedId: number | null) => {
      setCanvasStickers(stickers);
      setSelectedStickerId(selectedId);
    },
    []
  );

  useEffect(() => {
    clearPhotoPreview('photobooth');
    void clearPhotoFromDb('photobooth');
  }, []);

  const setPhotoUrl = useCallback((url: string | null) => {
    if (blobUrlRef.current?.startsWith('blob:')) {
      URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = null;
    }
    if (url?.startsWith('blob:')) {
      blobUrlRef.current = url;
    }
    setPetImageUrl(url);
    setEditorActive(false);
    setCanvasReady(false);
    setCustomizeOpen(false);
  }, []);

  const loadUploadById = useCallback(
    async (uploadId: string) => {
      setLoadingPhoto(true);
      setLocalUploadError('');
      try {
        const blob = await fetchUploadBlob(uploadId);
        setPhotoUrl(URL.createObjectURL(blob));
      } catch {
        setLocalUploadError('Could not load saved photo. Please upload again.');
      } finally {
        setLoadingPhoto(false);
      }
    },
    [setPhotoUrl]
  );

  useEffect(() => {
    if (!initialUploadId) return;
    void loadUploadById(initialUploadId);
    if (typeof window !== 'undefined' && window.location.search) {
      window.history.replaceState({}, '', '/photobooth');
    }
  }, [initialUploadId, loadUploadById]);

  const handleUploadId = useCallback(
    (uploadId: string) => {
      void loadUploadById(uploadId);
      if (typeof window !== 'undefined' && window.location.search) {
        window.history.replaceState({}, '', '/photobooth');
      }
    },
    [loadUploadById]
  );

  const pickTheme = useCallback((id: string) => {
    setThemeId(id);
    setEditorActive(true);
    setCanvasReady(false);
    if (id === 'frame-only' && frameId === 'none') {
      setFrameId('walnut');
    }
    if (id === 'accessories-only') {
      setCustomizeOpen(true);
    }
  }, [frameId]);

  const pickFrameStyle = useCallback((id: FrameStyleId) => {
    setFrameId(id);
    if (!editorActive) {
      setThemeId('frame-only');
      setEditorActive(true);
      setCanvasReady(false);
    }
  }, [editorActive]);

  const startFrameOnly = useCallback(() => {
    setThemeId('frame-only');
    setEditorActive(true);
    setCanvasReady(false);
    if (frameId === 'none') setFrameId('walnut');
  }, [frameId]);

  const clearPhoto = useCallback(async () => {
    await fetch('/api/clear-upload', { method: 'POST' }).catch(() => {});
    setPhotoUrl(null);
    setShareMsg('');
    setLocalUploadError('');
    setLoadingPhoto(false);
    window.history.replaceState({}, '', '/photobooth');
  }, [setPhotoUrl]);

  const savePhoto = useCallback(async () => {
    canvasRef.current?.clearSelection();
    const blob = await canvasRef.current?.exportBlob();
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'freedom-paws-superbud.png';
    link.click();
    URL.revokeObjectURL(url);
    setShareMsg('Saved to your device!');
  }, []);

  const sharePhoto = useCallback(async () => {
    canvasRef.current?.clearSelection();
    const blob = await canvasRef.current?.exportBlob();
    if (!blob) return;

    const file = new File([blob], 'freedom-paws-superbud.png', { type: 'image/png' });
    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({
          title: 'SuperBud Photo Booth',
          text: 'Look at my pet in the Freedom Paws Photo Booth! 🐾',
          files: [file],
        });
        setShareMsg('Shared!');
        return;
      } catch {
        /* user cancelled */
      }
    }
    await savePhoto();
  }, [savePhoto]);

  const displayError = uploadError && !petImageUrl && !loadingPhoto ? uploadError : localUploadError;

  return (
    <div className="min-h-screen bg-[#0A1625] text-white">
      <div className="max-w-lg mx-auto px-4 py-6 pb-16">
        <Link
          href="/"
          className="inline-block mb-3 text-xs font-bold tracking-wider text-amber-400"
        >
          ← BACK TO HOME
        </Link>

        <h1 className="text-3xl font-bold text-center">SuperBud Photo Booth</h1>
        <p className="mt-2 text-center text-sm text-white/60">
          Upload · add a frame or theme · dress up your pet
        </p>

        {displayError && (
          <div className="mt-4 rounded-2xl border border-red-500/50 bg-red-950/40 p-3 text-center text-sm text-red-300">
            {displayError}
          </div>
        )}

        {loadingPhoto && (
          <div className="mt-6 rounded-2xl border border-amber-400/30 bg-[#0F1E38]/80 p-4 text-center text-sm text-amber-300">
            Loading your photo…
          </div>
        )}

        {!petImageUrl && !loadingPhoto && (
          <div className="mt-6">
            <p className="mb-3 text-center text-xs text-white/50 leading-relaxed">
              Tap <strong className="text-white">Choose Photo</strong> below — upload starts automatically.
              <br />
              After upload, tap <strong className="text-amber-300">Frame Only</strong> or a theme below.
            </p>
            <PhotoUploadZone
              onSelect={() => {}}
              onUploadId={handleUploadId}
              onClear={() => void clearPhoto()}
              onError={setLocalUploadError}
              storageKey="photobooth"
              returnTo="/photobooth"
              backupUploadHref="/photobooth-upload.html"
              restoreOnLoad={false}
              useFetchUpload
            />
          </div>
        )}

        {petImageUrl && (
          <>
            {uploadSuccess && (
              <div className="mt-4 rounded-2xl border border-green-500/40 bg-green-900/20 p-3 text-center text-sm text-green-400">
                ✓ Photo ready — tap a theme below
              </div>
            )}

            <button
              type="button"
              onClick={() => void clearPhoto()}
              className="mt-4 w-full rounded-xl border border-white/20 py-2.5 text-sm text-white/70"
            >
              Upload a different photo
            </button>
          </>
        )}

        <div className="mt-5">
          {petImageUrl && !editorActive && (
            <div className="overflow-hidden rounded-2xl border border-white/15 bg-[#0F1E38]/60">
              <div className="flex aspect-[4/3] items-center justify-center p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={petImageUrl}
                  alt="Your pet"
                  className="max-h-full max-w-full object-contain rounded-xl"
                />
              </div>
              <p className="border-t border-white/10 py-3 text-center text-xs text-amber-300/90">
                ↑ Your photo · Tap <strong>Frame Only</strong> or a theme below
              </p>
              <button
                type="button"
                onClick={startFrameOnly}
                className="mx-4 mb-4 w-[calc(100%-2rem)] rounded-xl bg-amber-400 py-3 text-sm font-bold text-black"
              >
                🖼️ Frame Only — no background theme
              </button>
            </div>
          )}

          {petImageUrl && editorActive && (
            <>
              <PhotoBoothCanvas
                ref={canvasRef}
                petImageUrl={petImageUrl}
                themeId={themeId}
                frameId={frameId}
                frameWidth={frameWidth}
                onReadyChange={setCanvasReady}
                onStickersChange={handleStickersChange}
                onError={setError}
              />
              {canvasReady && (
                <div className="mt-4 rounded-2xl border border-amber-400/25 bg-[#0F1E38]/90 p-4">
                  <p className="text-sm font-semibold text-amber-400 mb-1">Picture frame</p>
                  <p className="text-[10px] text-white/45 mb-3">
                    Works on any theme · drag slider for thin → thick
                  </p>
                  <div className="flex gap-2 overflow-x-auto pb-2 snap-x snap-mandatory">
                    {FRAME_STYLES.map((frame) => (
                      <button
                        key={frame.id}
                        type="button"
                        onClick={() => pickFrameStyle(frame.id)}
                        className={`shrink-0 snap-start flex flex-col items-center gap-1.5 rounded-xl px-3 py-2.5 min-w-[4.25rem] transition ${
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
                        <span className="text-amber-300/80">Thickness</span>
                        <span>Thick</span>
                      </div>
                      <input
                        type="range"
                        min={FRAME_WIDTH_MIN}
                        max={FRAME_WIDTH_MAX}
                        step={0.02}
                        value={frameWidth}
                        onChange={(e) => setFrameWidth(Number(e.target.value))}
                        className="photobooth-frame-slider w-full touch-none"
                        aria-label="Frame thickness"
                      />
                    </div>
                  )}
                </div>
              )}
              {canvasReady && canvasStickers.length > 0 && (
                <div className="mt-3">
                  <p className="mb-2 text-center text-[10px] text-white/45">
                    Tap a name to select · tap again or Done to hide the gold box
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {canvasStickers.map((sticker) => (
                      <button
                        key={sticker.id}
                        type="button"
                        onClick={() => canvasRef.current?.selectSticker(sticker.id)}
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                          selectedStickerId === sticker.id
                            ? 'bg-amber-400 text-black'
                            : 'bg-[#0F1E38] border border-white/15 text-white/80'
                        }`}
                      >
                        {sticker.label}
                      </button>
                    ))}
                  </div>
                  {selectedStickerId !== null && (
                    <button
                      type="button"
                      onClick={() => canvasRef.current?.clearSelection()}
                      className="mt-2 w-full rounded-xl border border-amber-400/40 py-2 text-xs font-semibold text-amber-300"
                    >
                      Done — hide selection frame
                    </button>
                  )}
                </div>
              )}
              {canvasReady && canvasStickers.length > 0 && (
                <div className="mt-3 flex flex-col items-center gap-2">
                  <p className="text-[10px] text-white/40">Move &amp; tilt the selected accessory</p>
                  <div className="grid grid-cols-3 gap-1">
                    <span />
                    <button
                      type="button"
                      aria-label="Nudge up"
                      disabled={selectedStickerId === null}
                      onClick={() => canvasRef.current?.nudgeSelected(0, -0.03)}
                      className="rounded-lg bg-[#0F1E38] border border-white/15 px-4 py-2 text-sm disabled:opacity-30"
                    >
                      ↑
                    </button>
                    <span />
                    <button
                      type="button"
                      aria-label="Nudge left"
                      disabled={selectedStickerId === null}
                      onClick={() => canvasRef.current?.nudgeSelected(-0.03, 0)}
                      className="rounded-lg bg-[#0F1E38] border border-white/15 px-4 py-2 text-sm disabled:opacity-30"
                    >
                      ←
                    </button>
                    <button
                      type="button"
                      aria-label="Nudge down"
                      disabled={selectedStickerId === null}
                      onClick={() => canvasRef.current?.nudgeSelected(0, 0.03)}
                      className="rounded-lg bg-[#0F1E38] border border-white/15 px-4 py-2 text-sm disabled:opacity-30"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      aria-label="Nudge right"
                      disabled={selectedStickerId === null}
                      onClick={() => canvasRef.current?.nudgeSelected(0.03, 0)}
                      className="rounded-lg bg-[#0F1E38] border border-white/15 px-4 py-2 text-sm disabled:opacity-30"
                    >
                      →
                    </button>
                  </div>
                  <div className="flex w-full max-w-xs gap-2">
                    <button
                      type="button"
                      aria-label="Tilt left"
                      disabled={selectedStickerId === null}
                      onClick={() => canvasRef.current?.tiltSelected(-1)}
                      className="flex-1 rounded-lg bg-[#0F1E38] border border-white/15 py-2.5 text-sm font-semibold disabled:opacity-30"
                    >
                      ↺ Tilt left
                    </button>
                    <button
                      type="button"
                      aria-label="Tilt right"
                      disabled={selectedStickerId === null}
                      onClick={() => canvasRef.current?.tiltSelected(1)}
                      className="flex-1 rounded-lg bg-[#0F1E38] border border-white/15 py-2.5 text-sm font-semibold disabled:opacity-30"
                    >
                      Tilt right ↻
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {!petImageUrl && (
            <div className="flex aspect-[4/3] items-center justify-center rounded-2xl border border-dashed border-white/15 bg-[#0F1E38]/40 px-4 text-center text-xs text-white/40">
              {loadingPhoto ? 'Preparing preview…' : 'Your dressed-up pet appears here after upload'}
            </div>
          )}
        </div>

        {petImageUrl && (
          <>
            <p className="mt-6 mb-3 text-sm font-semibold text-amber-400">Choose a theme</p>
            <div className="flex gap-2 overflow-x-auto pb-2 snap-x snap-mandatory">
              {PHOTO_BOOTH_THEMES.map((theme) => (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => pickTheme(theme.id)}
                  className={`shrink-0 snap-start rounded-2xl px-4 py-3 text-sm font-bold transition ${
                    themeId === theme.id && editorActive
                      ? 'bg-amber-400 text-black'
                      : 'bg-[#0F1E38] border border-white/15 text-white'
                  }`}
                >
                  <span className="text-xl block mb-1">{theme.emoji}</span>
                  {theme.name}
                </button>
              ))}
            </div>

            {editorActive && themeId === 'frame-only' && (
              <p className="mt-2 text-center text-xs text-white/45">
                Plain studio backdrop · pick a frame above the canvas · no stickers required
              </p>
            )}

            {editorActive && themeId === 'accessories-only' && (
              <p className="mt-2 text-center text-xs text-white/45">
                Checkerboard = no background. Tap <strong className="text-amber-300">Customize</strong> below to add hats &amp; glasses.
              </p>
            )}

            {editorActive && themeId !== 'accessories-only' && (
              <p className="mt-2 text-center text-xs text-white/45">
                Tap a sticker name below, then drag or use arrow buttons.
              </p>
            )}

            {!editorActive && (
              <p className="mt-3 text-center text-xs text-white/45">
                Tap a theme — lightweight editor (no heavy app download).
              </p>
            )}

            {editorActive && (
              <>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    disabled={!canvasReady}
                    onClick={() => void sharePhoto()}
                    className="rounded-2xl bg-amber-400 py-4 font-bold text-black disabled:opacity-40"
                  >
                    📤 Share
                  </button>
                  <button
                    type="button"
                    disabled={!canvasReady}
                    onClick={() => void savePhoto()}
                    className="rounded-2xl border border-amber-400/60 py-4 font-bold text-amber-300 disabled:opacity-40"
                  >
                    💾 Save
                  </button>
                </div>

                {shareMsg && (
                  <p className="mt-3 text-center text-sm text-green-400">{shareMsg}</p>
                )}

                <button
                  type="button"
                  onClick={() => setCustomizeOpen((o) => !o)}
                  className="mt-4 w-full text-sm text-white/50 underline"
                >
                  {customizeOpen ? 'Hide customize' : 'Customize — add or remove stickers'}
                </button>

                {customizeOpen && (
                  <div className="mt-4 rounded-2xl border border-white/10 bg-[#0F1E38]/80 p-4">
                <p className="text-xs text-white/50 mb-3">
                  Tap a sticker to add · touch &amp; drag on photo to move · gold box = selected
                </p>
                    <div className="grid grid-cols-4 gap-2">
                      {EXTRA_STICKERS.map((sticker) => (
                        <button
                          key={sticker.src}
                          type="button"
                          onClick={() => void canvasRef.current?.addSticker(sticker)}
                          className="rounded-xl bg-black/30 border border-white/10 py-2 px-1 text-[10px] leading-tight hover:border-amber-400/40"
                        >
                          {sticker.label}
                        </button>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => canvasRef.current?.removeSelected()}
                      className="mt-3 w-full rounded-xl border border-red-500/40 py-2 text-sm text-red-300"
                    >
                      Remove selected sticker
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {error && <p className="mt-4 text-center text-sm text-red-400">{error}</p>}
      </div>
    </div>
  );
}
