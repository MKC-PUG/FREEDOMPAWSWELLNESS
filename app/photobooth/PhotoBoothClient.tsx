'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import PhotoBoothToast from '@/app/components/PhotoBoothToast';
import PhotoUploadZone from '@/app/components/PhotoUploadZone';
import { clearPhotoFromDb } from '@/lib/photo-db';
import { clearPhotoPreview } from '@/lib/photo-storage';
import { preloadPhotoBoothAssets } from '@/lib/photobooth/preload-themes';
import {
  ACCESSORY_STICKERS,
  DEFAULT_PHOTO_BOOTH_THEME_ID,
  getTheme,
  PHOTO_BOOTH_THEMES,
  pickRandomSurpriseThemeId,
} from '@/lib/photobooth/themes';
import { type FrameStyleId } from '@/lib/photobooth/frames';
import {
  type MeAndMyPupCustomBackgroundId,
  type MeAndMyPupFrameColorId,
  type MeAndMyPupVariant,
  type SlotId,
} from '@/lib/photobooth/me-and-my-pup';
import PhotoBoothUnifiedEditor from './PhotoBoothUnifiedEditor';
import type { MeAndMyPupCanvasHandle } from './MeAndMyPupCanvas';
import type { PhotoBoothCanvasHandle, StickerListItem } from './PhotoBoothCanvas';

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
  const [themeId, setThemeId] = useState(DEFAULT_PHOTO_BOOTH_THEME_ID);
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
  const [themeSparkle, setThemeSparkle] = useState(false);
  const [themePickerExpanded, setThemePickerExpanded] = useState(true);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [cutoutPromptDismissed, setCutoutPromptDismissed] = useState(false);

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
    preloadPhotoBoothAssets();
  }, []);

  const setPhotoUrl = useCallback((url: string | null, options?: { keepEditor?: boolean }) => {
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
    if (!options?.keepEditor) {
      setEditorActive(false);
    }
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
        setCutoutPromptDismissed(false);
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

  useEffect(() => {
    if (!shareMsg) return;
    setToastMsg(shareMsg);
    const t = window.setTimeout(() => setToastMsg(null), 2800);
    return () => window.clearTimeout(t);
  }, [shareMsg]);

  const pickTheme = useCallback((id: string) => {
    if (id === 'me-and-my-pup') {
      const ok = window.confirm(
        'Me & My Pup uses two circles — one for you and one for your pet.\n\nOpen this layout?'
      );
      if (!ok) return;
    }
    setThemeId(id);
    setEditorActive(true);
    setCanvasReady(false);
    setThemePickerExpanded(true);
    setThemeSparkle(true);
    window.setTimeout(() => setThemeSparkle(false), 700);
    if (id === 'me-and-my-pup') {
      setShareMsg('Add your photo · drag each circle to adjust · then Share!');
    } else {
      setShareMsg('Drag to adjust your pet · share below when ready!');
    }
    if (cutoutApplied && id !== 'frame-only') {
      setFrameId('none');
    } else if (id === 'frame-only' && frameId === 'none') {
      setFrameId('walnut');
    }
  }, [frameId, cutoutApplied]);

  const handleSurpriseMe = useCallback(() => {
    pickTheme(pickRandomSurpriseThemeId());
    setShareMsg('🎲 Surprise style! Drag your pet to adjust · share when ready!');
  }, [pickTheme]);

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
    setCutoutPromptDismissed(false);
    setThemeId(DEFAULT_PHOTO_BOOTH_THEME_ID);
    setEditorActive(false);
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
      setThemeId(DEFAULT_PHOTO_BOOTH_THEME_ID);
      setEditorActive(false);
      setShareMsg('Cutout ready — swipe a background below, then add props if you like!');
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
    setPhotoUrl(originalPhotoUrlRef.current, { keepEditor: true });
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
    setShareMsg('Saved to Photos!');
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
  const activeTheme = getTheme(themeId);
  const themePickerCollapsed = editorActive && !themePickerExpanded;

  const themeChip = (theme: (typeof PHOTO_BOOTH_THEMES)[number]) => (
    <button
      key={theme.id}
      type="button"
      onClick={() => pickTheme(theme.id)}
      className={`shrink-0 snap-start flex items-center gap-2 min-h-[40px] rounded-xl px-3 py-2 text-xs font-bold transition touch-manipulation ${
        themeId === theme.id && editorActive
          ? 'bg-amber-400 text-black ring-2 ring-amber-200'
          : 'bg-[#0F1E38] border border-white/15 text-white'
      }`}
    >
      <span className="text-base leading-none">{theme.emoji}</span>
      <span className="whitespace-nowrap">{theme.name}</span>
    </button>
  );

  const themePicker = (
    <section
      ref={themesRef}
      className={
        editorActive
          ? 'sticky z-20 -mx-4 px-4 py-2 mb-3 bg-[#0A1625]/95 backdrop-blur-md border-b border-amber-400/20'
          : 'mt-4 mb-4'
      }
      style={editorActive ? { top: 'var(--nav-total-height)' } : undefined}
    >
      {themePickerCollapsed ? (
        <>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setThemePickerExpanded(true)}
              className="flex-1 flex items-center justify-between min-h-[40px] rounded-xl border border-amber-400/35 bg-[#0F1E38] px-3 py-2 touch-manipulation"
            >
              <span className="flex items-center gap-2 text-sm font-bold text-white">
                <span>{activeTheme.emoji}</span>
                <span>{activeTheme.name}</span>
              </span>
              <span className="text-xs text-amber-400">More styles ▾</span>
            </button>
            {petImageUrl && (
              <button
                type="button"
                onClick={handleSurpriseMe}
                className="shrink-0 min-h-[40px] rounded-xl border border-amber-400/40 bg-amber-400/10 px-3 text-xs font-bold text-amber-300 touch-manipulation"
                title="Random style"
              >
                🎲
              </button>
            )}
          </div>
          <p className="mt-1.5 mb-1.5 text-[10px] text-white/45">Swipe to switch style — no need to re-upload</p>
          <div className="flex gap-2 overflow-x-auto pb-1 snap-x snap-mandatory photobooth-hscroll">
            {PHOTO_BOOTH_THEMES.map(themeChip)}
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center justify-between gap-2 mb-2">
            <p className="text-sm font-bold text-amber-400">
              {editorActive ? 'Change style' : 'Step 2 — Pick a style'}
            </p>
            {editorActive && (
              <button
                type="button"
                onClick={() => setThemePickerExpanded(false)}
                className="text-[10px] font-bold text-white/45 touch-manipulation"
              >
                Collapse ▴
              </button>
            )}
          </div>
          {!editorActive && (
            <p className="text-[10px] text-white/45 mb-2 leading-relaxed">
              Swipe styles → tap one · then adjust your pet below
            </p>
          )}
          {petImageUrl && (
            <button
              type="button"
              onClick={handleSurpriseMe}
              className="mb-2 w-full min-h-[36px] rounded-lg border border-amber-400/35 bg-amber-400/10 text-xs font-bold text-amber-300 touch-manipulation"
            >
              🎲 Surprise Me
            </button>
          )}
          <div className="flex gap-2 overflow-x-auto pb-1 snap-x snap-mandatory photobooth-hscroll">
            {PHOTO_BOOTH_THEMES.map(themeChip)}
          </div>
        </>
      )}
    </section>
  );

  return (
    <div className="min-h-screen bg-[#0A1625] text-white">
      <PhotoBoothToast message={toastMsg} />
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
          Dress up your pet (dog or cat) · pick a style · share in seconds
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

            {!editorActive && !cutoutApplied && !bgRemoving && !cutoutPromptDismissed && (
              <div className="mt-4 rounded-2xl border border-amber-400/35 bg-amber-950/20 p-4 text-center">
                <p className="text-sm font-semibold text-amber-200">Try magic cutout?</p>
                <p className="mt-1 text-xs text-white/55 leading-relaxed">
                  Optional — float your pet on themed backgrounds. Most people pick a style above with
                  the full photo instead.
                </p>
                <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => void handleRemoveBackground()}
                    className="flex-1 min-h-[44px] rounded-xl bg-amber-400 py-2.5 text-sm font-bold text-black touch-manipulation"
                  >
                    ✨ Try cutout
                  </button>
                  <button
                    type="button"
                    onClick={() => setCutoutPromptDismissed(true)}
                    className="flex-1 min-h-[44px] rounded-xl border border-white/20 py-2.5 text-sm text-white/70 touch-manipulation"
                  >
                    Skip — pick a style
                  </button>
                </div>
              </div>
            )}

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

        <div className={`mt-5 ${themeSparkle && editorActive ? 'fp-theme-sparkle' : ''}`}>
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

          {petImageUrl && editorActive && (
            <PhotoBoothUnifiedEditor
              themeId={themeId}
              isDuoMode={themeId === 'me-and-my-pup'}
              petImageUrl={petImageUrl}
              ownerImageUrl={ownerImageUrl}
              ownerInputRef={ownerInputRef}
              canvasRef={canvasRef}
              meMyPupRef={meMyPupRef}
              canvasReady={canvasReady}
              frameId={frameId}
              frameWidth={frameWidth}
              cutoutApplied={cutoutApplied}
              bgRemoving={bgRemoving}
              bgProgress={bgProgress}
              bgError={bgError}
              petSelected={petSelected}
              selectedSlot={selectedSlot}
              selectedStickerId={selectedStickerId}
              canvasStickers={canvasStickers}
              meMyPupVariant={meMyPupVariant}
              meMyPupCustomText={meMyPupCustomText}
              meMyPupFrameColor={meMyPupFrameColor}
              meMyPupCustomBg={meMyPupCustomBg}
              meMyPupHeadlineOffset={meMyPupHeadlineOffset}
              shareMsg={shareMsg}
              onOwnerFile={handleOwnerFile}
              onReadyChange={setCanvasReady}
              onSlotSelectedChange={setSelectedSlot}
              onPetSelectedChange={setPetSelected}
              onStickersChange={handleStickersChange}
              onError={setError}
              onMeMyPupVariant={setMeMyPupVariant}
              onMeMyPupCustomText={setMeMyPupCustomText}
              onMeMyPupFrameColor={setMeMyPupFrameColor}
              onMeMyPupCustomBg={setMeMyPupCustomBg}
              onMeMyPupHeadlineOffset={setMeMyPupHeadlineOffset}
              onFrameStyle={pickFrameStyle}
              onFrameWidth={setFrameWidth}
              onAddAccessory={addAccessory}
              onRemoveBackground={() => void handleRemoveBackground()}
              onRestoreOriginal={handleRestoreOriginal}
              onShare={() => void sharePhoto()}
              onSave={() => void savePhoto()}
            />
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
