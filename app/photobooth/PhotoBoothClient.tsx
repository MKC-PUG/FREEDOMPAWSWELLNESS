'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import BackLink from '@/app/components/BackLink';
import PageShell from '@/app/components/ui/PageShell';
import PageHeader from '@/app/components/ui/PageHeader';
import PhotoBoothToast from '@/app/components/PhotoBoothToast';
import TaskProgressBar from '@/app/components/ui/TaskProgressBar';
import PhotoUploadZone from '@/app/components/PhotoUploadZone';
import { clearPhotoFromDb } from '@/lib/photo-db';
import { clearPhotoPreview } from '@/lib/photo-storage';
import { preloadPhotoBoothAssets } from '@/lib/photobooth/preload-themes';
import {
  ACCESSORY_STICKERS,
  DEFAULT_PHOTO_BOOTH_THEME_ID,
  pickRandomSurpriseThemeId,
} from '@/lib/photobooth/themes';
import { getFrameStyle, type FrameStyleId } from '@/lib/photobooth/frames';
import {
  type MeAndMyPupCustomBackgroundId,
  type MeAndMyPupFrameColorId,
  type MeAndMyPupVariant,
  type SlotId,
} from '@/lib/photobooth/me-and-my-pup';
import {
  getAiCostume,
  type AiCostumeId,
} from '@/lib/photobooth/ai-costumes';
import PhotoBoothFlowHint from './PhotoBoothFlowHint';
import { trimPetCutoutBlob } from '@/lib/photobooth/trim-pet-alpha';
import {
  createMonotonicProgress,
  startSimulatedProgress,
  type TaskProgressSnapshot,
} from '@/lib/photobooth/task-progress';
import FrameDrawer from './FrameDrawer';
import ExportDrawer from './ExportDrawer';
import AiCostumeDrawer from './AiCostumeDrawer';
import PhotoBoothThemeBar from './PhotoBoothThemeBar';
import PhotoBoothUnifiedEditor from './PhotoBoothUnifiedEditor';
import type { ExportPhotoPayload } from '@/lib/photobooth/export-photo';
import { getPhotoBoothAffiliatesData } from '@/lib/photobooth/affiliates';
import {
  saveToPhotoLibrary,
  shareToSocial,
  shareViaEmail,
} from '@/lib/photobooth/export-photo';
import { aiCreditFetchInit } from '@/lib/photobooth/guest-session';
import type { MeAndMyPupCanvasHandle } from './MeAndMyPupCanvas';
import type { PhotoBoothCanvasHandle, StickerListItem } from './PhotoBoothCanvas';

type AiCreditsClient = {
  configured: boolean;
  remaining: number;
  monthlyAllowance: number;
  dailyCap: number;
  dailyUsed: number;
  tier: string;
  allowanceResetAt: string | null;
  packs: { code: string; name: string; credits: number; priceUsd: number }[];
};

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
  const preAiCostumeUrlRef = useRef<string | null>(null);
  const themesRef = useRef<HTMLDivElement>(null);

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
  const [frameHeadline, setFrameHeadline] = useState('');
  const [frameHeadlineOffset, setFrameHeadlineOffset] = useState(0);
  const [bgRemoving, setBgRemoving] = useState(false);
  const [bgProgress, setBgProgress] = useState<TaskProgressSnapshot | null>(null);
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
  const [frameOpen, setFrameOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [exportBusy, setExportBusy] = useState(false);
  const [aiCostumeOpen, setAiCostumeOpen] = useState(false);
  const [aiCostumeBusy, setAiCostumeBusy] = useState(false);
  const [aiCostumeProgress, setAiCostumeProgress] = useState<TaskProgressSnapshot | null>(null);
  const [aiCostumeConfigured, setAiCostumeConfigured] = useState(false);
  const [aiCostumeApplied, setAiCostumeApplied] = useState(false);
  const [aiCredits, setAiCredits] = useState<AiCreditsClient | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const refreshAiCredits = useCallback(async () => {
    try {
      const res = await fetch('/api/photobooth/ai-credits', aiCreditFetchInit());
      if (!res.ok) return;
      const data = (await res.json()) as AiCreditsClient;
      setAiCredits(data);
    } catch {
      /* non-fatal */
    }
  }, []);

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
    void fetch('/api/photobooth/ai-costume', aiCreditFetchInit())
      .then((r) => r.json())
      .then((data: { configured?: boolean; credits?: AiCreditsClient }) => {
        setAiCostumeConfigured(Boolean(data.configured));
        if (data.credits) setAiCredits(data.credits);
      })
      .catch(() => setAiCostumeConfigured(false));
    void refreshAiCredits();
  }, [refreshAiCredits]);

  const setPhotoUrl = useCallback((url: string | null, options?: { keepEditor?: boolean }) => {
    if (
      blobUrlRef.current?.startsWith('blob:') &&
      blobUrlRef.current !== originalPhotoUrlRef.current &&
      blobUrlRef.current !== preAiCostumeUrlRef.current
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
    if (
      preAiCostumeUrlRef.current?.startsWith('blob:') &&
      preAiCostumeUrlRef.current !== originalPhotoUrlRef.current
    ) {
      URL.revokeObjectURL(preAiCostumeUrlRef.current);
    }
    originalPhotoUrlRef.current = null;
    preAiCostumeUrlRef.current = null;
    ownerBlobUrlRef.current = null;
    setOwnerImageUrl(null);
    blobUrlRef.current = null;
    setAiCostumeApplied(false);
    setAiCostumeOpen(false);
    setAiCostumeBusy(false);
    setAiCostumeProgress(null);
    setThemeId(DEFAULT_PHOTO_BOOTH_THEME_ID);
    setEditorActive(false);
    setPhotoUrl(null);
    setCutoutApplied(false);
    setBgRemoving(false);
    setBgProgress(null);
    setBgError('');
    setShareMsg('');
    setLocalUploadError('');
    setLoadingPhoto(false);
    window.history.replaceState({}, '', '/photobooth');
  }, [setPhotoUrl]);

  const handleRemoveBackground = useCallback(async () => {
    if (!petImageUrl || bgRemoving) return;
    setBgRemoving(true);
    setBgError('');
    setError('');
    setShareMsg('');
    const progress = createMonotonicProgress(setBgProgress);
    progress.emit(1, 'Starting magic cutout…');
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

      progress.emit(4, 'Preparing photo…');
      const { removePetBackground } = await import('@/lib/photobooth/remove-background');
      const cutout = await removePetBackground(
        sourceBlob,
        (p) => progress.emit(p.percent, p.label),
        { rangeStart: 6, rangeEnd: 88 }
      );
      progress.emit(90, 'Tightening edges…');
      const trimmed = await trimPetCutoutBlob(cutout);
      progress.complete('Cutout ready');
      if (!originalPhotoUrlRef.current) {
        originalPhotoUrlRef.current = petImageUrl;
      }
      setPhotoUrl(URL.createObjectURL(trimmed));
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
      setBgProgress(null);
    }
  }, [petImageUrl, bgRemoving, setPhotoUrl]);

  const captureExportPayload = useCallback(async (): Promise<ExportPhotoPayload | null> => {
    const isDuo = themeId === 'me-and-my-pup';
    if (isDuo) {
      meMyPupRef.current?.clearSelection();
      const blob = await meMyPupRef.current?.exportBlob();
      if (!blob) return null;
      return {
        blob,
        filename: 'freedom-paws-me-and-my-pup.png',
        title: 'Me & My Pup — Freedom Paws Wellness',
        shareText: 'Me and my best friend! 🐾💞',
      };
    }
    canvasRef.current?.clearSelection();
    const blob = await canvasRef.current?.exportBlob();
    if (!blob) return null;
    return {
      blob,
      filename: 'freedom-paws-superbud.png',
      title: 'SuperBud Photo Booth — Freedom Paws Wellness',
      shareText: 'Look at my pet in the Freedom Paws Photo Booth! 🐾',
    };
  }, [themeId]);

  const runExport = useCallback(
    async (action: (payload: ExportPhotoPayload) => Promise<unknown>) => {
      setExportBusy(true);
      try {
        const payload = await captureExportPayload();
        if (!payload) {
          setShareMsg('Could not prepare your photo — try again.');
          return;
        }
        await action(payload);
        setExportOpen(false);
      } catch (e) {
        if (e instanceof Error && e.name === 'AbortError') return;
        setShareMsg('Something went wrong — try again or use Save to Photos.');
      } finally {
        setExportBusy(false);
      }
    },
    [captureExportPayload]
  );

  const handleSaveToPhotos = useCallback(() => {
    void runExport(async (payload) => {
      const result = await saveToPhotoLibrary(payload);
      setShareMsg(
        result === 'shared'
          ? 'Choose Save Image in the share sheet to add to Photos'
          : 'Saved — check your Downloads or Files app'
      );
    });
  }, [runExport]);

  const handleShareSocial = useCallback(() => {
    void runExport(async (payload) => {
      await shareToSocial(payload);
      setShareMsg('Shared!');
    });
  }, [runExport]);

  const handleShareEmail = useCallback(() => {
    void runExport(async (payload) => {
      const result = await shareViaEmail(payload);
      setShareMsg(
        result === 'shared'
          ? 'Pick Mail in the share sheet to send your photo'
          : 'Email opened — attach the saved image if needed'
      );
    });
  }, [runExport]);

  const handleApplyAiCostume = useCallback(
    async (costumeId: AiCostumeId) => {
      if (!petImageUrl || aiCostumeBusy) return;
      const costume = getAiCostume(costumeId);
      if (!costume) return;

      setAiCostumeOpen(false);
      setAiCostumeBusy(true);
      const progress = createMonotonicProgress(setAiCostumeProgress);
      progress.emit(2, 'Uploading your pet photo…');
      setShareMsg('✨ Creating Magic Look — please wait 15–30 sec…');

      let stopSim: (() => void) | null = null;
      try {
        const sourceBlob = await fetch(petImageUrl).then((r) => {
          if (!r.ok) throw new Error('Could not read pet photo');
          return r.blob();
        });
        const fd = new FormData();
        fd.append('image', sourceBlob, 'pet.jpg');
        fd.append('costumeId', costumeId);

        progress.emit(8, 'Sending to AI…');
        stopSim = startSimulatedProgress(
          (pct) => progress.emit(pct, 'AI is creating your holiday look…'),
          { from: 10, to: 68, durationMs: 32000 }
        );

        const controller = new AbortController();
        const timeoutId = window.setTimeout(() => controller.abort(), 90000);
        let res: Response;
        try {
          res = await fetch('/api/photobooth/ai-costume', {
            ...aiCreditFetchInit(),
            method: 'POST',
            body: fd,
            signal: controller.signal,
          });
        } finally {
          window.clearTimeout(timeoutId);
          stopSim?.();
          stopSim = null;
        }

        progress.emit(70, 'Receiving your look…');

        const data = (await res.json()) as {
          success?: boolean;
          error?: string;
          errorCode?: string;
          imageDataUrl?: string;
          credits?: AiCreditsClient;
        };
        if (data.credits) setAiCredits(data.credits);
        else void refreshAiCredits();

        if (!res.ok || !data.success || !data.imageDataUrl) {
          const raw = data.error || 'AI Magic Look failed';
          if (data.errorCode === 'no_credits') {
            throw new Error(raw);
          }
          if (/402|insufficient credit|payment required/i.test(raw)) {
            throw new Error(
              'AI Magic Look needs Replicate billing credit — add funds at replicate.com/account/billing, then try again.'
            );
          }
          throw new Error(raw);
        }

        progress.emit(74, 'Loading AI image…');
        const outBlob = await fetch(data.imageDataUrl).then((r) => {
          if (!r.ok) throw new Error('Could not read AI image');
          return r.blob();
        });

        if (!preAiCostumeUrlRef.current) {
          if (petImageUrl.startsWith('blob:')) {
            const restoreBlob = await fetch(petImageUrl).then((r) => {
              if (!r.ok) throw new Error('Could not read pet photo');
              return r.blob();
            });
            preAiCostumeUrlRef.current = URL.createObjectURL(restoreBlob);
          } else {
            preAiCostumeUrlRef.current = petImageUrl;
          }
        }

        progress.emit(78, 'Cleaning Magic Look edges…');
        let finalBlob = outBlob;
        try {
          const { removePetBackground } = await import('@/lib/photobooth/remove-background');
          const cutout = await removePetBackground(
            outBlob,
            (p) => progress.emit(p.percent, p.label.replace('Tracing your pet', 'Cleaning edges')),
            { rangeStart: 78, rangeEnd: 96 }
          );
          progress.emit(97, 'Final polish…');
          finalBlob = await trimPetCutoutBlob(cutout);
        } catch {
          /* use AI output if second cutout fails */
        }

        const outUrl = URL.createObjectURL(finalBlob);
        progress.complete('Magic Look ready');

        if (!editorActive) {
          setThemeId(costume.themeId);
          setEditorActive(true);
        }
        setFrameId('none');
        setPhotoUrl(outUrl, { keepEditor: true });
        setAiCostumeApplied(true);
        setCutoutApplied(true);
        setShareMsg(`✨ ${costume.name} — Magic Look applied!`);
      } catch (e) {
        stopSim?.();
        if (e instanceof Error && e.name === 'AbortError') {
          setShareMsg('AI Magic Look timed out — try again in a moment.');
        } else {
          setShareMsg(e instanceof Error ? e.message : 'AI Magic Look failed');
        }
      } finally {
        setAiCostumeBusy(false);
        setAiCostumeProgress(null);
      }
    },
    [aiCostumeBusy, editorActive, petImageUrl, refreshAiCredits, setPhotoUrl]
  );

  const handleRestoreAiCostume = useCallback(() => {
    if (!preAiCostumeUrlRef.current) return;
    setError('');
    setPhotoUrl(preAiCostumeUrlRef.current, { keepEditor: true });
    preAiCostumeUrlRef.current = null;
    setAiCostumeApplied(false);
    setShareMsg('Removed AI costume — your cutout pet is back on this background.');
  }, [setPhotoUrl]);

  const handleRestoreOriginal = useCallback(() => {
    if (!originalPhotoUrlRef.current) return;
    preAiCostumeUrlRef.current = null;
    setAiCostumeApplied(false);
    setPhotoUrl(originalPhotoUrlRef.current);
    setCutoutApplied(false);
    setThemeId(DEFAULT_PHOTO_BOOTH_THEME_ID);
    setEditorActive(false);
    setFrameId('walnut');
    setShareMsg('Original photo restored — try cutout or pick a background.');
    requestAnimationFrame(() => {
      themesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, [setPhotoUrl]);

  const handleBackToBackgrounds = useCallback(() => {
    setEditorActive(false);
    setShareMsg('Pick a different background above.');
    requestAnimationFrame(() => {
      themesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, []);

  const displayError = uploadError && !petImageUrl && !loadingPhoto ? uploadError : localUploadError;
  const isDuoMode = themeId === 'me-and-my-pup';
  const activeFrame = getFrameStyle(frameId);
  const flowStep = !petImageUrl
    ? 0
    : editorActive
      ? 3
      : cutoutApplied
        ? 2
        : 1;
  const photoAffiliates = getPhotoBoothAffiliatesData();

  return (
    <PageShell maxWidth="lg" innerClassName="!px-4">
      <PhotoBoothToast message={toastMsg} />
      <BackLink href="/" label="Back to Home" />

      <div className="relative mb-1 mt-2">
        <Link
          href="/photobooth/help"
          className="absolute right-0 top-0 flex h-9 w-9 items-center justify-center rounded-full border border-amber-400/50 bg-[#0F1E38] text-sm font-bold text-amber-300 touch-manipulation hover:bg-amber-400/15 active:bg-amber-400/25"
          aria-label="Photo Booth how-to instructions"
          title="How to use Photo Booth"
        >
          ?
        </Link>
        <PageHeader
          center
          eyebrow="SuperBud Photo Booth"
          eyebrowVariant="gold"
          title="Dress up your pet"
          subtitle="Pick a style · share in seconds — dogs and cats welcome"
          className="!mb-2 pr-10"
        />
      </div>

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
              Optional <strong className="text-amber-300">magic cutout</strong> first, then pick a background.
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
          <div
            ref={themesRef}
            className={`mt-4 ${themeSparkle && editorActive ? 'fp-theme-sparkle' : ''}`}
          >
            <PhotoBoothFlowHint activeStep={flowStep} />

            {aiCostumeBusy && aiCostumeProgress && (
              <div className="mb-3 rounded-2xl border border-violet-400/45 bg-violet-950/40 p-4">
                <p className="text-center text-sm font-bold text-violet-200 mb-3">
                  ✨ AI Magic Look working…
                </p>
                <TaskProgressBar
                  percent={aiCostumeProgress.percent}
                  label={aiCostumeProgress.label}
                  variant="violet"
                />
                <p className="mt-2 text-center text-[10px] text-white/45">
                  Usually 15–30 seconds — app is not frozen
                </p>
              </div>
            )}

            {uploadSuccess && (
              <div className="mb-3 rounded-2xl border border-green-500/40 bg-green-900/20 p-3 text-center text-sm text-green-400">
                ✓ Photo ready — try magic cutout or pick a background below
              </div>
            )}

            {!editorActive && (
              <div className="mb-3 space-y-2">
                {bgRemoving && bgProgress ? (
                  <div className="rounded-2xl border border-amber-400/40 bg-amber-400/10 p-4">
                    <p className="text-center text-base font-bold text-amber-400 mb-3">
                      Magic cutout working…
                    </p>
                    <TaskProgressBar
                      percent={bgProgress.percent}
                      label={bgProgress.label}
                      variant="amber"
                    />
                  </div>
                ) : (
                  <>
                    {!cutoutApplied && (
                      <button
                        type="button"
                        disabled={bgRemoving}
                        onClick={() => void handleRemoveBackground()}
                        className="w-full min-h-[48px] rounded-xl bg-amber-400 py-3 text-sm font-bold text-black touch-manipulation disabled:opacity-50"
                      >
                        ✨ Magic cutout (optional — do this before background)
                      </button>
                    )}
                    {cutoutApplied && (
                      <button
                        type="button"
                        onClick={handleRestoreOriginal}
                        className="w-full min-h-[44px] rounded-xl border border-white/20 py-2.5 text-sm text-white/75 touch-manipulation"
                      >
                        ↩ Restore original photo (remove cutout)
                      </button>
                    )}
                  </>
                )}
                {bgError && (
                  <div className="rounded-2xl border border-red-500/50 bg-red-950/40 p-4 text-sm text-red-300 leading-relaxed">
                    {bgError}
                  </div>
                )}
              </div>
            )}

            <PhotoBoothThemeBar
              themeId={themeId}
              editorActive={editorActive}
              onPickTheme={pickTheme}
              onSurpriseMe={handleSurpriseMe}
            />

            {editorActive && !isDuoMode && (
              <button
                type="button"
                onClick={() => setFrameOpen(true)}
                className="mb-3 w-full min-h-[40px] rounded-xl border border-white/15 bg-[#0F1E38]/90 px-3 py-2 text-xs font-bold text-white/85 touch-manipulation flex items-center justify-between"
              >
                <span>🖼️ Picture frame (optional)</span>
                <span className="text-amber-300/90">
                  {frameId === 'none'
                    ? 'Tap to choose ▾'
                    : frameHeadline.trim()
                      ? `${activeFrame.name} · caption`
                      : activeFrame.name}
                </span>
              </button>
            )}

            {!editorActive ? (
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
                  Your pet · pick a <strong>background</strong> above
                </p>
              </div>
            ) : (
              <PhotoBoothUnifiedEditor
                themeId={themeId}
                isDuoMode={isDuoMode}
                petImageUrl={petImageUrl}
                ownerImageUrl={ownerImageUrl}
                ownerInputRef={ownerInputRef}
                canvasRef={canvasRef}
                meMyPupRef={meMyPupRef}
                canvasReady={canvasReady}
                frameId={frameId}
                frameWidth={frameWidth}
                frameHeadline={frameHeadline}
                frameHeadlineOffset={frameHeadlineOffset}
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
                onAddAccessory={addAccessory}
                onRemoveBackground={() => void handleRemoveBackground()}
                onRestoreOriginal={handleRestoreOriginal}
                onBackToBackgrounds={handleBackToBackgrounds}
                onRestoreAiCostume={handleRestoreAiCostume}
                aiCostumeApplied={aiCostumeApplied}
                aiCostumeBusy={aiCostumeBusy}
                aiCostumeConfigured={aiCostumeConfigured}
                aiCreditsRemaining={aiCredits?.remaining}
                onOpenAiCostume={() => {
                  void refreshAiCredits();
                  setAiCostumeOpen(true);
                }}
                onExport={() => setExportOpen(true)}
                photoAffiliates={photoAffiliates}
              />
            )}

            <button
              type="button"
              onClick={() => void clearPhoto()}
              className="mt-4 w-full rounded-xl border border-white/15 py-2 text-xs text-white/50 touch-manipulation"
            >
              Upload a different photo
            </button>

            <FrameDrawer
              open={frameOpen}
              onClose={() => setFrameOpen(false)}
              frameId={frameId}
              frameWidth={frameWidth}
              frameHeadline={frameHeadline}
              frameHeadlineOffset={frameHeadlineOffset}
              cutoutApplied={cutoutApplied}
              themeId={themeId}
              onFrameStyle={pickFrameStyle}
              onFrameWidth={setFrameWidth}
              onFrameHeadline={setFrameHeadline}
              onFrameHeadlineOffset={setFrameHeadlineOffset}
            />

            <ExportDrawer
              open={exportOpen}
              busy={exportBusy}
              photoAffiliates={photoAffiliates}
              onClose={() => setExportOpen(false)}
              onSaveToPhotos={handleSaveToPhotos}
              onShareSocial={handleShareSocial}
              onShareEmail={handleShareEmail}
            />

            <AiCostumeDrawer
              open={aiCostumeOpen}
              busy={aiCostumeBusy}
              configured={aiCostumeConfigured}
              progress={aiCostumeProgress}
              credits={aiCredits}
              onClose={() => setAiCostumeOpen(false)}
              onPick={(id) => void handleApplyAiCostume(id)}
            />
          </div>
        )}

        {!petImageUrl && !loadingPhoto && (
          <div className="mt-6 flex aspect-[4/3] items-center justify-center rounded-2xl border border-dashed border-white/15 bg-[#0F1E38]/40 px-4 text-center text-xs text-white/40">
            Your dressed-up pet appears here after upload
          </div>
        )}

        {error && <p className="mt-4 text-center text-sm text-red-400">{error}</p>}
    </PageShell>
  );
}
