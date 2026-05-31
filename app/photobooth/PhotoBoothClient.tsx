'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import PhotoUploadZone from '@/app/components/PhotoUploadZone';
import { clearPhotoFromDb } from '@/lib/photo-db';
import { clearPhotoPreview } from '@/lib/photo-storage';
import {
  ACCESSORY_STICKERS,
  PHOTO_BOOTH_THEMES,
} from '@/lib/photobooth/themes';
import {
  FRAME_STYLES,
  FRAME_WIDTH_MAX,
  FRAME_WIDTH_MIN,
  type FrameStyleId,
} from '@/lib/photobooth/frames';
import {
  CUSTOM_HEADLINE_MAX,
  CUSTOM_HEADLINE_OFFSET_MAX,
  CUSTOM_HEADLINE_OFFSET_MIN,
  CUSTOM_HEADLINE_OFFSET_STEP,
  ME_AND_MY_PUP_FRAME_COLORS,
  ME_AND_MY_PUP_SCENE_BACKGROUNDS,
  ME_AND_MY_PUP_VARIANTS,
  type MeAndMyPupCustomBackgroundId,
  type MeAndMyPupFrameColorId,
  type MeAndMyPupVariant,
  type SlotId,
} from '@/lib/photobooth/me-and-my-pup';
import type { MeAndMyPupCanvasHandle } from './MeAndMyPupCanvas';
import type { PhotoBoothCanvasHandle, StickerListItem } from './PhotoBoothCanvas';

const PhotoBoothCanvas = dynamic(() => import('./PhotoBoothCanvas'), {
  ssr: false,
  loading: () => (
    <div className="flex aspect-[4/3] items-center justify-center rounded-2xl border border-white/15 bg-[#0F1E38]/50 text-sm text-amber-300">
      Loading editor…
    </div>
  ),
});

const MeAndMyPupCanvas = dynamic(() => import('./MeAndMyPupCanvas'), {
  ssr: false,
  loading: () => (
    <div className="flex aspect-[4/3] items-center justify-center rounded-2xl border border-amber-400/30 bg-[#0F1E38]/50 text-sm text-amber-300">
      Loading Me &amp; My Pup…
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
  const meMyPupRef = useRef<MeAndMyPupCanvasHandle>(null);
  const ownerInputRef = useRef<HTMLInputElement>(null);
  const ownerBlobUrlRef = useRef<string | null>(null);
  const blobUrlRef = useRef<string | null>(null);
  const originalPhotoUrlRef = useRef<string | null>(null);
  const themesRef = useRef<HTMLElement>(null);

  const [petImageUrl, setPetImageUrl] = useState<string | null>(null);
  const [loadingPhoto, setLoadingPhoto] = useState(Boolean(initialUploadId));
  const [editorActive, setEditorActive] = useState(false);
  const [themeId, setThemeId] = useState(PHOTO_BOOTH_THEMES[0].id);
  const [canvasReady, setCanvasReady] = useState(false);
  const [error, setError] = useState('');
  const [localUploadError, setLocalUploadError] = useState('');
  const [shareMsg, setShareMsg] = useState('');
  const [canvasStickers, setCanvasStickers] = useState<StickerListItem[]>([]);
  const [selectedStickerId, setSelectedStickerId] = useState<number | null>(null);
  const [frameId, setFrameId] = useState<FrameStyleId>('walnut');
  const [frameWidth, setFrameWidth] = useState(0.5);
  const [bgRemoving, setBgRemoving] = useState(false);
  const [bgProgress, setBgProgress] = useState('');
  const [bgError, setBgError] = useState('');
  const [cutoutApplied, setCutoutApplied] = useState(false);
  const [petSelected, setPetSelected] = useState(false);
  const [ownerImageUrl, setOwnerImageUrl] = useState<string | null>(null);
  const [meMyPupVariant, setMeMyPupVariant] = useState<MeAndMyPupVariant>('classic');
  const [meMyPupCustomText, setMeMyPupCustomText] = useState('Me & My Pup');
  const [meMyPupFrameColor, setMeMyPupFrameColor] = useState<MeAndMyPupFrameColorId>('navy');
  const [meMyPupCustomBg, setMeMyPupCustomBg] = useState<MeAndMyPupCustomBackgroundId>('navy');
  const [meMyPupHeadlineOffset, setMeMyPupHeadlineOffset] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState<SlotId | null>('dog');

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
    if (
      blobUrlRef.current?.startsWith('blob:') &&
      blobUrlRef.current !== originalPhotoUrlRef.current
    ) {
      URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = null;
    }
    if (url?.startsWith('blob:')) {
      blobUrlRef.current = url;
    }
    setPetImageUrl(url);
    setEditorActive(false);
    setCanvasReady(false);
  }, []);

  const loadUploadById = useCallback(
    async (uploadId: string) => {
      setLoadingPhoto(true);
      setLocalUploadError('');
      try {
        const blob = await fetchUploadBlob(uploadId);
        const url = URL.createObjectURL(blob);
        originalPhotoUrlRef.current = url;
        setCutoutApplied(false);
        setPhotoUrl(url);
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
    if (id === 'me-and-my-pup') {
      setShareMsg('Add your photo · drag each circle to adjust · then Share!');
    } else {
      setShareMsg('Looking good! Share below — or add an accessory if you want.');
    }
    if (cutoutApplied && id !== 'frame-only') {
      setFrameId('none');
    } else if (id === 'frame-only' && frameId === 'none') {
      setFrameId('walnut');
    }
  }, [frameId, cutoutApplied]);

  const handleOwnerFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (ownerBlobUrlRef.current?.startsWith('blob:')) {
      URL.revokeObjectURL(ownerBlobUrlRef.current);
    }
    const url = URL.createObjectURL(file);
    ownerBlobUrlRef.current = url;
    setOwnerImageUrl(url);
    setShareMsg('Your photo added — drag the ME circle to fit your face!');
    setSelectedSlot('owner');
  }, []);

  const pickFrameStyle = useCallback((id: FrameStyleId) => {
    setFrameId(id);
    if (!editorActive) {
      setThemeId('frame-only');
      setEditorActive(true);
      setCanvasReady(false);
    }
  }, [editorActive]);

  const addAccessory = useCallback((sticker: (typeof ACCESSORY_STICKERS)[number]) => {
    void canvasRef.current?.addSticker(sticker);
  }, []);

  const clearPhoto = useCallback(async () => {
    await fetch('/api/clear-upload', { method: 'POST' }).catch(() => {});
    if (
      blobUrlRef.current?.startsWith('blob:') &&
      blobUrlRef.current !== originalPhotoUrlRef.current
    ) {
      URL.revokeObjectURL(blobUrlRef.current);
    }
    if (originalPhotoUrlRef.current?.startsWith('blob:')) {
      URL.revokeObjectURL(originalPhotoUrlRef.current);
    }
    if (ownerBlobUrlRef.current?.startsWith('blob:')) {
      URL.revokeObjectURL(ownerBlobUrlRef.current);
    }
    originalPhotoUrlRef.current = null;
    ownerBlobUrlRef.current = null;
    setOwnerImageUrl(null);
    blobUrlRef.current = null;
    setPhotoUrl(null);
    setCutoutApplied(false);
    setBgRemoving(false);
    setBgProgress('');
    setBgError('');
    setShareMsg('');
    setLocalUploadError('');
    setLoadingPhoto(false);
    window.history.replaceState({}, '', '/photobooth');
  }, [setPhotoUrl]);

  const handleRemoveBackground = useCallback(async () => {
    if (!petImageUrl || bgRemoving) return;
    setBgRemoving(true);
    setBgProgress('Starting…');
    setBgError('');
    setError('');
    setShareMsg('');
    try {
      const sourceBlob = petImageUrl.startsWith('blob:')
        ? await fetch(petImageUrl).then((r) => {
            if (!r.ok) throw new Error('Could not read photo');
            return r.blob();
          })
        : await fetch(petImageUrl).then((r) => {
            if (!r.ok) throw new Error('Could not read photo');
            return r.blob();
          });

      const { removePetBackground } = await import('@/lib/photobooth/remove-background');
      const cutout = await removePetBackground(sourceBlob, (p) => {
        setBgProgress(p.percent > 0 ? `${p.percent}%` : 'Loading AI model…');
      });
      if (!originalPhotoUrlRef.current) {
        originalPhotoUrlRef.current = petImageUrl;
      }
      setPhotoUrl(URL.createObjectURL(cutout));
      setCutoutApplied(true);
      setFrameId('none');
      setShareMsg('Cutout ready — tap your pet on the photo to move and resize!');
      requestAnimationFrame(() => {
        themesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    } catch (e) {
      const msg =
        e instanceof Error ? e.message : 'Background removal failed';
      setBgError(
        `${msg}. Pick a background above with your original photo — that works great without cutout.`
      );
    } finally {
      setBgRemoving(false);
      setBgProgress('');
    }
  }, [petImageUrl, bgRemoving, setPhotoUrl]);

  const handleRestoreOriginal = useCallback(() => {
    if (!originalPhotoUrlRef.current) return;
    setPhotoUrl(originalPhotoUrlRef.current);
    setCutoutApplied(false);
    setShareMsg('Original photo restored.');
  }, [setPhotoUrl]);

  const savePhoto = useCallback(async () => {
    const isDuo = themeId === 'me-and-my-pup';
    if (isDuo) {
      meMyPupRef.current?.clearSelection();
      const blob = await meMyPupRef.current?.exportBlob();
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'freedom-paws-me-and-my-pup.png';
      link.click();
      URL.revokeObjectURL(url);
    } else {
      canvasRef.current?.clearSelection();
      const blob = await canvasRef.current?.exportBlob();
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'freedom-paws-superbud.png';
      link.click();
      URL.revokeObjectURL(url);
    }
    setShareMsg('Saved to your device!');
  }, [themeId]);

  const sharePhoto = useCallback(async () => {
    const isDuo = themeId === 'me-and-my-pup';
    let blob: Blob | null = null;
    if (isDuo) {
      meMyPupRef.current?.clearSelection();
      blob = await meMyPupRef.current?.exportBlob() ?? null;
    } else {
      canvasRef.current?.clearSelection();
      blob = await canvasRef.current?.exportBlob() ?? null;
    }
    if (!blob) return;

    const file = new File(
      [blob],
      isDuo ? 'freedom-paws-me-and-my-pup.png' : 'freedom-paws-superbud.png',
      { type: 'image/png' }
    );
    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({
          title: isDuo ? 'Me & My Pup — Freedom Paws' : 'SuperBud Photo Booth',
          text: isDuo
            ? 'Me and my best friend! 🐾💞'
            : 'Look at my pet in the Freedom Paws Photo Booth! 🐾',
          files: [file],
        });
        setShareMsg('Shared!');
        return;
      } catch {
        /* user cancelled */
      }
    }
    await savePhoto();
  }, [savePhoto, themeId]);

  const displayError = uploadError && !petImageUrl && !loadingPhoto ? uploadError : localUploadError;

  const themePicker = (
    <section
      ref={themesRef}
      className={
        editorActive
          ? 'sticky z-20 -mx-4 px-4 py-3 mb-4 bg-[#0A1625]/95 backdrop-blur-md border-b border-amber-400/20'
          : 'mt-4 mb-4'
      }
      style={editorActive ? { top: 'var(--nav-total-height)' } : undefined}
    >
      <p className="text-base font-bold text-amber-400 mb-1">
        {editorActive && themeId === 'me-and-my-pup'
          ? 'Me & My Pup frame'
          : editorActive
            ? 'Change background'
            : 'Step 2 — Pick a style'}
      </p>
      <p className="text-[11px] text-white/45 mb-3 leading-relaxed">
        {editorActive && themeId === 'me-and-my-pup'
          ? 'You + your pup in gold circles — great for sharing with family.'
          : 'Tap a background — your full photo looks great. Try 💞 Me & My Pup for a duo card.'}
      </p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {PHOTO_BOOTH_THEMES.map((theme) => (
          <button
            key={theme.id}
            type="button"
            onClick={() => pickTheme(theme.id)}
            className={`min-h-[56px] rounded-xl px-2 py-2.5 text-xs font-bold transition touch-manipulation ${
              themeId === theme.id && editorActive
                ? 'bg-amber-400 text-black ring-2 ring-amber-200'
                : 'bg-[#0F1E38] border border-white/15 text-white'
            }`}
          >
            <span className="text-xl block mb-0.5">{theme.emoji}</span>
            {theme.name}
          </button>
        ))}
      </div>
    </section>
  );

  return (
    <div className="min-h-screen bg-[#0A1625] text-white">
      <div className="max-w-lg mx-auto px-4 py-6 pb-16">
        <Link
          href="/"
          className="inline-block mb-3 text-xs font-bold tracking-wider text-amber-400"
        >
          ← BACK TO HOME
        </Link>

        <div className="relative mb-1">
          <Link
            href="/photobooth/help"
            className="absolute right-0 top-0 flex h-9 w-9 items-center justify-center rounded-full border border-amber-400/50 bg-[#0F1E38] text-sm font-bold text-amber-300 touch-manipulation hover:bg-amber-400/15 active:bg-amber-400/25"
            aria-label="Photo Booth how-to instructions"
            title="How to use Photo Booth"
          >
            ?
          </Link>
          <h1 className="text-3xl font-bold text-center pr-10">SuperBud Photo Booth</h1>
        </div>
        <p className="mt-2 text-center text-sm text-white/60">
          Upload · pick a background · share in seconds
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
              Then pick a <strong className="text-amber-300">background</strong> — no cutout needed.
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
            {themePicker}

            {uploadSuccess && (
              <div className="rounded-2xl border border-green-500/40 bg-green-900/20 p-3 text-center text-sm text-green-400">
                ✓ Photo ready — choose a background above
              </div>
            )}

            <button
              type="button"
              onClick={() => void clearPhoto()}
              className="mt-4 w-full rounded-xl border border-white/20 py-2.5 text-sm text-white/70"
            >
              Upload a different photo
            </button>

            {!editorActive && (
              <div className="mt-4 space-y-2">
                {bgRemoving && (
                  <div className="rounded-2xl border border-amber-400/40 bg-amber-400/10 p-4 text-center">
                    <p className="text-base font-bold text-amber-400">Magic cutout working…</p>
                    <p className="mt-2 text-sm text-white/70">{bgProgress || 'Please wait'}</p>
                    <p className="mt-2 text-xs text-white/45">First time downloads ~80MB on Wi‑Fi (30–60 sec)</p>
                  </div>
                )}
                {bgError && (
                  <div className="rounded-2xl border border-red-500/50 bg-red-950/40 p-4 text-sm text-red-300 leading-relaxed">
                    {bgError}
                  </div>
                )}
                {!cutoutApplied ? (
                  <>
                    <p className="text-center text-[11px] text-white/50 leading-relaxed px-1">
                      <strong className="text-amber-300/90">Tip:</strong> Most people skip cutout and pick a
                      background — your full photo still looks amazing.
                    </p>
                    <button
                      type="button"
                      disabled={bgRemoving}
                      onClick={() => void handleRemoveBackground()}
                      className="w-full min-h-[48px] rounded-xl border border-white/20 bg-[#1F2A44]/80 py-2.5 text-sm font-semibold text-white/75 disabled:opacity-50 touch-manipulation"
                      style={{ WebkitTapHighlightColor: 'transparent' }}
                    >
                      {bgRemoving ? `✨ Cutout… ${bgProgress}` : '✨ Optional: try magic cutout (beta)'}
                    </button>
                    <p className="text-center text-[10px] text-white/40 leading-relaxed px-2">
                      Best with one pet on a plain background. Busy photos? Pick a theme above instead.
                    </p>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={handleRestoreOriginal}
                    className="w-full min-h-[48px] rounded-xl border border-white/20 py-2.5 text-sm text-white/70 touch-manipulation"
                  >
                    ↩ Restore original photo
                  </button>
                )}
              </div>
            )}
          </>
        )}

        <div className="mt-5">
          {petImageUrl && !editorActive && (
            <div className="overflow-hidden rounded-2xl border border-white/15 bg-[#0F1E38]/60">
              <div
                className={`flex aspect-[4/3] items-center justify-center p-2 ${
                  cutoutApplied
                    ? 'bg-[length:16px_16px] bg-[position:0_0,8px_8px] bg-[image:linear-gradient(45deg,#1a2a44_25%,transparent_25%),linear-gradient(-45deg,#1a2a44_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#1a2a44_75%),linear-gradient(-45deg,transparent_75%,#1a2a44_75%)]'
                    : ''
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={petImageUrl}
                  alt="Your pet"
                  className="max-h-full max-w-full object-contain rounded-xl"
                />
              </div>
              <p className="border-t border-white/10 py-3 text-center text-xs text-amber-300/90">
                ↑ Your pet · pick a <strong>background</strong> above · share anytime
              </p>
            </div>
          )}

          {petImageUrl && editorActive && themeId === 'me-and-my-pup' && (
            <>
              <input
                ref={ownerInputRef}
                type="file"
                accept="image/*"
                capture="user"
                className="sr-only"
                aria-hidden
                onChange={handleOwnerFile}
              />
              <div className="mt-4 rounded-2xl border border-amber-400/35 bg-[#0F1E38]/90 p-4">
                <p className="text-sm font-bold text-amber-400 mb-2">Step 1 — Add your photo</p>
                <button
                  type="button"
                  onClick={() => ownerInputRef.current?.click()}
                  className="w-full min-h-[52px] rounded-xl bg-amber-400 py-3 text-sm font-bold text-black touch-manipulation"
                >
                  {ownerImageUrl ? '📷 Change my photo' : '📷 Add my photo (selfie)'}
                </button>
                <p className="mt-2 text-[10px] text-white/45 text-center">
                  Stays on your phone until you share — not uploaded to our server.
                </p>
              </div>

              <div className="mt-4">
                <p className="text-xs font-semibold text-white/60 mb-2">Frame style</p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {ME_AND_MY_PUP_VARIANTS.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setMeMyPupVariant(v.id)}
                      className={`min-h-[44px] rounded-xl px-2 py-2 text-xs font-bold touch-manipulation ${
                        meMyPupVariant === v.id
                          ? 'bg-amber-400 text-black'
                          : 'bg-[#0F1E38] border border-white/15 text-white'
                      }`}
                    >
                      <span className="text-lg block">{v.emoji}</span>
                      {v.name}
                    </button>
                  ))}
                </div>
              </div>

              {meMyPupVariant === 'custom' && (
                <div className="mt-4 rounded-2xl border border-amber-400/35 bg-[#0F1E38]/90 p-4 space-y-4">
                  <div>
                    <label htmlFor="me-my-pup-headline" className="text-sm font-bold text-amber-400 block mb-2">
                      Your headline
                    </label>
                    <input
                      id="me-my-pup-headline"
                      type="text"
                      value={meMyPupCustomText}
                      maxLength={CUSTOM_HEADLINE_MAX}
                      onChange={(e) => setMeMyPupCustomText(e.target.value)}
                      placeholder="Me & My Pup"
                      className="w-full min-h-[48px] rounded-xl border border-white/20 bg-[#0A1625] px-4 py-3 text-base text-white placeholder:text-white/35 touch-manipulation"
                    />
                    <p className="mt-1.5 text-[10px] text-white/45 text-center">
                      Shows above your photos · {meMyPupCustomText.length}/{CUSTOM_HEADLINE_MAX}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-amber-400 mb-2">Headline position</p>
                    <div className="flex items-center justify-center gap-3">
                      <button
                        type="button"
                        aria-label="Move headline up"
                        disabled={meMyPupHeadlineOffset <= CUSTOM_HEADLINE_OFFSET_MIN}
                        onClick={() =>
                          setMeMyPupHeadlineOffset((y) =>
                            Math.max(CUSTOM_HEADLINE_OFFSET_MIN, y - CUSTOM_HEADLINE_OFFSET_STEP)
                          )
                        }
                        className="min-h-[44px] min-w-[52px] rounded-xl border border-white/20 bg-[#0A1625] text-lg font-bold disabled:opacity-30 touch-manipulation"
                      >
                        ↑
                      </button>
                      <span className="text-xs text-white/55 min-w-[5.5rem] text-center">
                        {meMyPupHeadlineOffset === 0
                          ? 'Default'
                          : meMyPupHeadlineOffset < 0
                            ? 'Higher'
                            : 'Lower'}
                      </span>
                      <button
                        type="button"
                        aria-label="Move headline down"
                        disabled={meMyPupHeadlineOffset >= CUSTOM_HEADLINE_OFFSET_MAX}
                        onClick={() =>
                          setMeMyPupHeadlineOffset((y) =>
                            Math.min(CUSTOM_HEADLINE_OFFSET_MAX, y + CUSTOM_HEADLINE_OFFSET_STEP)
                          )
                        }
                        className="min-h-[44px] min-w-[52px] rounded-xl border border-white/20 bg-[#0A1625] text-lg font-bold disabled:opacity-30 touch-manipulation"
                      >
                        ↓
                      </button>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-amber-400 mb-2">Background</p>
                    <p className="text-[10px] text-white/45 mb-2">Solid colors</p>
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {ME_AND_MY_PUP_FRAME_COLORS.map((color) => (
                        <button
                          key={color.id}
                          type="button"
                          onClick={() => setMeMyPupCustomBg(color.id)}
                          className={`min-h-[44px] rounded-xl px-2 py-2 text-[10px] font-bold touch-manipulation ${
                            meMyPupCustomBg === color.id
                              ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-[#0F1E38]'
                              : 'border border-white/15'
                          }`}
                        >
                          <span
                            className="block h-6 w-full rounded-md mb-1 border border-white/20"
                            style={{ background: color.swatch }}
                          />
                          {color.name}
                        </button>
                      ))}
                    </div>
                    <p className="text-[10px] text-white/45 mb-2">Photo Booth scenes</p>
                    <div className="grid grid-cols-3 gap-2">
                      {ME_AND_MY_PUP_SCENE_BACKGROUNDS.map((scene) => (
                        <button
                          key={scene.id}
                          type="button"
                          onClick={() => setMeMyPupCustomBg(scene.id)}
                          className={`min-h-[44px] rounded-xl px-2 py-2 text-[10px] font-bold touch-manipulation ${
                            meMyPupCustomBg === scene.id
                              ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-[#0F1E38]'
                              : 'border border-white/15'
                          }`}
                        >
                          <span
                            className="block h-6 w-full rounded-md mb-1 border border-white/20"
                            style={{ background: scene.swatch }}
                          />
                          <span className="text-sm block">{scene.emoji}</span>
                          {scene.name}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-amber-400 mb-2">Ring &amp; text color</p>
                    <div className="grid grid-cols-3 gap-2">
                      {ME_AND_MY_PUP_FRAME_COLORS.map((color) => (
                        <button
                          key={color.id}
                          type="button"
                          onClick={() => setMeMyPupFrameColor(color.id)}
                          className={`min-h-[44px] rounded-xl px-2 py-2 text-[10px] font-bold touch-manipulation ${
                            meMyPupFrameColor === color.id
                              ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-[#0F1E38]'
                              : 'border border-white/15'
                          }`}
                        >
                          <span
                            className="block h-6 w-full rounded-md mb-1 border border-white/20"
                            style={{ background: color.swatch }}
                          />
                          {color.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <MeAndMyPupCanvas
                ref={meMyPupRef}
                petImageUrl={petImageUrl}
                ownerImageUrl={ownerImageUrl}
                variant={meMyPupVariant}
                customHeadline={meMyPupCustomText}
                frameColorId={meMyPupFrameColor}
                customBackgroundId={meMyPupCustomBg}
                customHeadlineOffsetY={meMyPupHeadlineOffset}
                onReadyChange={setCanvasReady}
                onSlotSelectedChange={setSelectedSlot}
                onError={setError}
              />

              {canvasReady && (
                <>
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => meMyPupRef.current?.selectSlot('dog')}
                      className={`flex-1 min-h-[44px] rounded-xl py-2 text-xs font-bold touch-manipulation ${
                        selectedSlot === 'dog'
                          ? 'bg-amber-400 text-black'
                          : 'border border-white/20 text-white/80'
                      }`}
                    >
                      🐾 MY PUP
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!ownerImageUrl) {
                          ownerInputRef.current?.click();
                          return;
                        }
                        meMyPupRef.current?.selectSlot('owner');
                      }}
                      className={`flex-1 min-h-[44px] rounded-xl py-2 text-xs font-bold touch-manipulation ${
                        selectedSlot === 'owner'
                          ? 'bg-amber-400 text-black'
                          : 'border border-white/20 text-white/80'
                      }`}
                    >
                      🙂 ME
                    </button>
                  </div>

                  {selectedSlot && (
                    <div className="mt-3 flex flex-col items-center gap-2">
                      <p className="text-[10px] text-white/40">
                        Adjust {selectedSlot === 'dog' ? 'your pup' : 'your face'} in the circle
                      </p>
                      <div className="grid grid-cols-3 gap-1">
                        <span />
                        <button
                          type="button"
                          onClick={() => meMyPupRef.current?.nudgeSelected(0, -0.08)}
                          className="rounded-lg bg-[#0F1E38] border border-white/15 px-4 py-2 text-sm"
                        >
                          ↑
                        </button>
                        <span />
                        <button
                          type="button"
                          onClick={() => meMyPupRef.current?.nudgeSelected(-0.08, 0)}
                          className="rounded-lg bg-[#0F1E38] border border-white/15 px-4 py-2 text-sm"
                        >
                          ←
                        </button>
                        <button
                          type="button"
                          onClick={() => meMyPupRef.current?.nudgeSelected(0, 0.08)}
                          className="rounded-lg bg-[#0F1E38] border border-white/15 px-4 py-2 text-sm"
                        >
                          ↓
                        </button>
                        <button
                          type="button"
                          onClick={() => meMyPupRef.current?.nudgeSelected(0.08, 0)}
                          className="rounded-lg bg-[#0F1E38] border border-white/15 px-4 py-2 text-sm"
                        >
                          →
                        </button>
                      </div>
                      <div className="flex w-full max-w-xs gap-2">
                        <button
                          type="button"
                          onClick={() => meMyPupRef.current?.scaleSelected(0.9)}
                          className="flex-1 rounded-lg bg-[#0F1E38] border border-white/15 py-2.5 text-sm font-semibold"
                        >
                          − Zoom out
                        </button>
                        <button
                          type="button"
                          onClick={() => meMyPupRef.current?.scaleSelected(1.1)}
                          className="flex-1 rounded-lg bg-[#0F1E38] border border-white/15 py-2.5 text-sm font-semibold"
                        >
                          + Zoom in
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      disabled={!ownerImageUrl}
                      onClick={() => void sharePhoto()}
                      className="rounded-2xl bg-amber-400 py-4 text-base font-bold text-black touch-manipulation disabled:opacity-40"
                    >
                      📤 Share
                    </button>
                    <button
                      type="button"
                      disabled={!ownerImageUrl}
                      onClick={() => void savePhoto()}
                      className="rounded-2xl border border-amber-400/60 py-4 text-base font-bold text-amber-300 touch-manipulation disabled:opacity-40"
                    >
                      💾 Save
                    </button>
                  </div>
                  {!ownerImageUrl && (
                    <p className="mt-2 text-center text-xs text-amber-300/80">
                      Add your photo above to enable Share &amp; Save
                    </p>
                  )}
                  {shareMsg && (
                    <p className="mt-2 text-center text-sm text-green-400">{shareMsg}</p>
                  )}
                </>
              )}
            </>
          )}

          {petImageUrl && editorActive && themeId !== 'me-and-my-pup' && (
            <>
              <PhotoBoothCanvas
                ref={canvasRef}
                petImageUrl={petImageUrl}
                themeId={themeId}
                frameId={frameId}
                frameWidth={frameWidth}
                cutoutApplied={cutoutApplied}
                onReadyChange={setCanvasReady}
                onStickersChange={handleStickersChange}
                onPetSelectedChange={setPetSelected}
                onError={setError}
              />
              {canvasReady && cutoutApplied && (
                <div className="mt-3">
                  <button
                    type="button"
                    onClick={() => canvasRef.current?.selectPet()}
                    className={`w-full min-h-[44px] rounded-xl py-2.5 text-sm font-semibold touch-manipulation ${
                      petSelected
                        ? 'bg-amber-400 text-black'
                        : 'border border-amber-400/50 text-amber-300'
                    }`}
                  >
                    {petSelected ? '✓ Your pet selected — drag on photo to move' : 'Tap to select your pet & move it'}
                  </button>
                  {petSelected && (
                    <div className="mt-3 flex flex-col items-center gap-2">
                      <p className="text-[10px] text-white/40">Move &amp; resize your pet</p>
                      <div className="grid grid-cols-3 gap-1">
                        <span />
                        <button
                          type="button"
                          aria-label="Nudge pet up"
                          onClick={() => canvasRef.current?.nudgeSelected(0, -0.03)}
                          className="rounded-lg bg-[#0F1E38] border border-white/15 px-4 py-2 text-sm"
                        >
                          ↑
                        </button>
                        <span />
                        <button
                          type="button"
                          aria-label="Nudge pet left"
                          onClick={() => canvasRef.current?.nudgeSelected(-0.03, 0)}
                          className="rounded-lg bg-[#0F1E38] border border-white/15 px-4 py-2 text-sm"
                        >
                          ←
                        </button>
                        <button
                          type="button"
                          aria-label="Nudge pet down"
                          onClick={() => canvasRef.current?.nudgeSelected(0, 0.03)}
                          className="rounded-lg bg-[#0F1E38] border border-white/15 px-4 py-2 text-sm"
                        >
                          ↓
                        </button>
                        <button
                          type="button"
                          aria-label="Nudge pet right"
                          onClick={() => canvasRef.current?.nudgeSelected(0.03, 0)}
                          className="rounded-lg bg-[#0F1E38] border border-white/15 px-4 py-2 text-sm"
                        >
                          →
                        </button>
                      </div>
                      <div className="flex w-full max-w-xs gap-2">
                        <button
                          type="button"
                          onClick={() => canvasRef.current?.scaleSelected(0.9)}
                          className="flex-1 rounded-lg bg-[#0F1E38] border border-white/15 py-2.5 text-sm font-semibold"
                        >
                          − Smaller
                        </button>
                        <button
                          type="button"
                          onClick={() => canvasRef.current?.scaleSelected(1.1)}
                          className="flex-1 rounded-lg bg-[#0F1E38] border border-white/15 py-2.5 text-sm font-semibold"
                        >
                          + Bigger
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => canvasRef.current?.clearSelection()}
                        className="w-full rounded-xl border border-amber-400/40 py-2 text-xs font-semibold text-amber-300"
                      >
                        Done — hide selection
                      </button>
                    </div>
                  )}
                </div>
              )}
              {canvasReady && editorActive && (
                <>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => void sharePhoto()}
                      className="rounded-2xl bg-amber-400 py-4 text-base font-bold text-black touch-manipulation"
                    >
                      📤 Share
                    </button>
                    <button
                      type="button"
                      onClick={() => void savePhoto()}
                      className="rounded-2xl border border-amber-400/60 py-4 text-base font-bold text-amber-300 touch-manipulation"
                    >
                      💾 Save
                    </button>
                  </div>
                  {shareMsg && (
                    <p className="mt-2 text-center text-sm text-green-400">{shareMsg}</p>
                  )}

                  <div className="mt-4 rounded-2xl border border-white/15 bg-[#0F1E38]/90 p-4">
                    <p className="text-sm font-bold text-amber-400 mb-1">Add accessory (optional)</p>
                    <p className="text-[10px] text-white/45 mb-3 leading-relaxed">
                      Tap to add · drag on photo to move · gold corners to resize · double-tap to remove
                    </p>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {ACCESSORY_STICKERS.map((sticker) => (
                        <button
                          key={sticker.src}
                          type="button"
                          onClick={() => addAccessory(sticker)}
                          className="min-h-[44px] rounded-xl bg-black/30 border border-white/15 py-2.5 px-2 text-xs font-semibold leading-tight touch-manipulation hover:border-amber-400/50 active:bg-amber-400/10"
                        >
                          + {sticker.label}
                        </button>
                      ))}
                    </div>
                    {canvasStickers.length > 0 && (
                      <button
                        type="button"
                        onClick={() => canvasRef.current?.removeSelected()}
                        className="mt-3 w-full min-h-[44px] rounded-xl border border-red-500/40 py-2.5 text-sm text-red-300 touch-manipulation"
                      >
                        Remove selected accessory
                      </button>
                    )}
                  </div>

                  {themeId === 'accessories-only' && (
                    <p className="mt-2 text-center text-xs text-white/45">
                      Checkerboard = no background
                    </p>
                  )}
                </>
              )}
              {canvasReady && (
                <div className="mt-4 rounded-2xl border border-white/10 bg-[#0F1E38]/60 p-4">
                  <p className="text-sm font-semibold text-white/70 mb-1">Picture frame (optional)</p>
                  <p className="text-[10px] text-white/45 mb-3">
                    {cutoutApplied && themeId !== 'frame-only'
                      ? 'After background removal, use Frame Only for a mat & border — themes show your pet directly on the scene.'
                      : 'Works on any theme · drag slider for thin → thick'}
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
                    Tap a name to select · <strong className="text-amber-300/90">double-tap</strong>{' '}
                    the accessory on the photo to remove it
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
                      aria-label="Smaller"
                      disabled={selectedStickerId === null}
                      onClick={() => canvasRef.current?.scaleSelected(0.9)}
                      className="flex-1 rounded-lg bg-[#0F1E38] border border-white/15 py-2.5 text-sm font-semibold disabled:opacity-30"
                    >
                      − Smaller
                    </button>
                    <button
                      type="button"
                      aria-label="Bigger"
                      disabled={selectedStickerId === null}
                      onClick={() => canvasRef.current?.scaleSelected(1.1)}
                      className="flex-1 rounded-lg bg-[#0F1E38] border border-white/15 py-2.5 text-sm font-semibold disabled:opacity-30"
                    >
                      + Bigger
                    </button>
                  </div>
                  <p className="text-[10px] text-white/40 text-center leading-relaxed">
                    Drag the <strong className="text-amber-300/90">gold corner dots</strong> to push
                    or pull bigger/smaller · or pinch with two fingers
                  </p>
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

        {error && <p className="mt-4 text-center text-sm text-red-400">{error}</p>}
      </div>
    </div>
  );
}
