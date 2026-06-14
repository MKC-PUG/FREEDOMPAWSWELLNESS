'use client';

import { useState, type RefObject } from 'react';
import AccessoryDrawer from './AccessoryDrawer';
import AdjustPhotoPad from './AdjustPhotoPad';
import MeAndMyPupCanvas from './MeAndMyPupCanvas';
import PhotoBoothCanvas from './PhotoBoothCanvas';
import {
  ACCESSORY_STICKERS,
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

type Props = {
  themeId: string;
  isDuoMode: boolean;
  petImageUrl: string;
  ownerImageUrl: string | null;
  ownerInputRef: RefObject<HTMLInputElement | null>;
  canvasRef: RefObject<PhotoBoothCanvasHandle | null>;
  meMyPupRef: RefObject<MeAndMyPupCanvasHandle | null>;
  canvasReady: boolean;
  frameId: FrameStyleId;
  frameWidth: number;
  cutoutApplied: boolean;
  bgRemoving: boolean;
  bgProgress: string;
  bgError: string;
  petSelected: boolean;
  selectedSlot: SlotId | null;
  selectedStickerId: number | null;
  canvasStickers: StickerListItem[];
  meMyPupVariant: MeAndMyPupVariant;
  meMyPupCustomText: string;
  meMyPupFrameColor: MeAndMyPupFrameColorId;
  meMyPupCustomBg: MeAndMyPupCustomBackgroundId;
  meMyPupHeadlineOffset: number;
  shareMsg: string;
  onOwnerFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onReadyChange: (ready: boolean) => void;
  onSlotSelectedChange: (slot: SlotId | null) => void;
  onPetSelectedChange: (selected: boolean) => void;
  onStickersChange: (stickers: StickerListItem[], selectedId: number | null) => void;
  onError: (message: string) => void;
  onMeMyPupVariant: (id: MeAndMyPupVariant) => void;
  onMeMyPupCustomText: (text: string) => void;
  onMeMyPupFrameColor: (id: MeAndMyPupFrameColorId) => void;
  onMeMyPupCustomBg: (id: MeAndMyPupCustomBackgroundId) => void;
  onMeMyPupHeadlineOffset: (offset: number) => void;
  onFrameStyle: (id: FrameStyleId) => void;
  onFrameWidth: (width: number) => void;
  onAddAccessory: (sticker: (typeof ACCESSORY_STICKERS)[number]) => void;
  onRemoveBackground: () => void;
  onRestoreOriginal: () => void;
  onShare: () => void;
  onSave: () => void;
};

export default function PhotoBoothUnifiedEditor({
  themeId,
  isDuoMode,
  petImageUrl,
  ownerImageUrl,
  ownerInputRef,
  canvasRef,
  meMyPupRef,
  canvasReady,
  frameId,
  frameWidth,
  cutoutApplied,
  bgRemoving,
  bgProgress,
  bgError,
  petSelected,
  selectedSlot,
  selectedStickerId,
  canvasStickers,
  meMyPupVariant,
  meMyPupCustomText,
  meMyPupFrameColor,
  meMyPupCustomBg,
  meMyPupHeadlineOffset,
  shareMsg,
  onOwnerFile,
  onReadyChange,
  onSlotSelectedChange,
  onPetSelectedChange,
  onStickersChange,
  onError,
  onMeMyPupVariant,
  onMeMyPupCustomText,
  onMeMyPupFrameColor,
  onMeMyPupCustomBg,
  onMeMyPupHeadlineOffset,
  onFrameStyle,
  onFrameWidth,
  onAddAccessory,
  onRemoveBackground,
  onRestoreOriginal,
  onShare,
  onSave,
}: Props) {
  const [accessoryOpen, setAccessoryOpen] = useState(false);

  return (
    <>
      <input
        ref={ownerInputRef}
        type="file"
        accept="image/*"
        capture="user"
        className="sr-only"
        aria-hidden
        onChange={onOwnerFile}
      />

      <div className="mt-4">
        {isDuoMode ? (
          <MeAndMyPupCanvas
            ref={meMyPupRef}
            petImageUrl={petImageUrl}
            ownerImageUrl={ownerImageUrl}
            variant={meMyPupVariant}
            customHeadline={meMyPupCustomText}
            frameColorId={meMyPupFrameColor}
            customBackgroundId={meMyPupCustomBg}
            customHeadlineOffsetY={meMyPupHeadlineOffset}
            onReadyChange={onReadyChange}
            onSlotSelectedChange={onSlotSelectedChange}
            onError={onError}
          />
        ) : (
          <PhotoBoothCanvas
            ref={canvasRef}
            petImageUrl={petImageUrl}
            themeId={themeId}
            frameId={frameId}
            frameWidth={frameWidth}
            cutoutApplied={cutoutApplied}
            onReadyChange={onReadyChange}
            onStickersChange={onStickersChange}
            onPetSelectedChange={onPetSelectedChange}
            onError={onError}
          />
        )}
      </div>

      {canvasReady && (
        <div className="mt-4 space-y-4">
          <div className="rounded-2xl border border-amber-400/35 bg-[#0F1E38]/90 p-4">
            <p className="text-sm font-bold text-amber-400 mb-2">
              {isDuoMode ? 'Adjust your circles' : 'Adjust your pet'}
            </p>
            {isDuoMode ? (
              <>
                <div className="flex gap-2">
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
                  <div className="mt-3">
                    <AdjustPhotoPad
                      label={`Adjust ${selectedSlot === 'dog' ? 'your pup' : 'your face'} in the circle`}
                      nudgeStep={0.08}
                      onNudge={(dx, dy) => meMyPupRef.current?.nudgeSelected(dx, dy)}
                      onScale={(factor) => meMyPupRef.current?.scaleSelected(factor)}
                    />
                  </div>
                )}
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => canvasRef.current?.selectPet()}
                  className={`w-full min-h-[44px] rounded-xl py-2.5 text-sm font-semibold touch-manipulation ${
                    petSelected
                      ? 'bg-amber-400 text-black'
                      : 'border border-amber-400/50 text-amber-300'
                  }`}
                >
                  {petSelected
                    ? '✓ Pet selected — drag on photo to move'
                    : 'Tap to select your pet & move it'}
                </button>
                {petSelected && (
                  <div className="mt-3">
                    <AdjustPhotoPad
                      label="Drag to pan · pinch or buttons to zoom"
                      onNudge={(dx, dy) => canvasRef.current?.nudgeSelected(dx, dy)}
                      onScale={(factor) => canvasRef.current?.scaleSelected(factor)}
                      zoomOutLabel="− Smaller"
                      zoomInLabel="+ Bigger"
                    />
                    <button
                      type="button"
                      onClick={() => canvasRef.current?.clearSelection()}
                      className="mt-3 w-full rounded-xl border border-amber-400/40 py-2 text-xs font-semibold text-amber-300 touch-manipulation"
                    >
                      Done — hide selection
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {isDuoMode && (
            <>
              <div className="rounded-2xl border border-amber-400/35 bg-[#0F1E38]/90 p-4">
                <p className="text-sm font-bold text-amber-400 mb-2">Add your photo</p>
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

              <div>
                <p className="text-xs font-semibold text-white/60 mb-2">Frame style</p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {ME_AND_MY_PUP_VARIANTS.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => onMeMyPupVariant(v.id)}
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
                <div className="rounded-2xl border border-amber-400/35 bg-[#0F1E38]/90 p-4 space-y-4">
                  <div>
                    <label htmlFor="me-my-pup-headline" className="text-sm font-bold text-amber-400 block mb-2">
                      Your headline
                    </label>
                    <input
                      id="me-my-pup-headline"
                      type="text"
                      value={meMyPupCustomText}
                      maxLength={CUSTOM_HEADLINE_MAX}
                      onChange={(e) => onMeMyPupCustomText(e.target.value)}
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
                          onMeMyPupHeadlineOffset(
                            Math.max(CUSTOM_HEADLINE_OFFSET_MIN, meMyPupHeadlineOffset - CUSTOM_HEADLINE_OFFSET_STEP)
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
                          onMeMyPupHeadlineOffset(
                            Math.min(CUSTOM_HEADLINE_OFFSET_MAX, meMyPupHeadlineOffset + CUSTOM_HEADLINE_OFFSET_STEP)
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
                          onClick={() => onMeMyPupCustomBg(color.id)}
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
                    <p className="text-[10px] text-white/45 mb-2">Photo Booth scenes · swipe for more</p>
                    <div className="flex gap-2 overflow-x-auto pb-2 snap-x snap-mandatory -mx-1 px-1">
                      {ME_AND_MY_PUP_SCENE_BACKGROUNDS.map((scene) => (
                        <button
                          key={scene.id}
                          type="button"
                          onClick={() => onMeMyPupCustomBg(scene.id)}
                          className={`min-h-[72px] min-w-[5.5rem] shrink-0 snap-start rounded-xl px-2 py-2 text-[10px] font-bold touch-manipulation ${
                            meMyPupCustomBg === scene.id
                              ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-[#0F1E38]'
                              : 'border border-white/15'
                          }`}
                        >
                          <span
                            className="block h-10 w-full rounded-md mb-1 border border-white/20 bg-[#0A1625]"
                            style={
                              scene.urls?.[0]
                                ? {
                                    backgroundImage: `url(${scene.urls[0]})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                  }
                                : { background: scene.swatch }
                            }
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
                          onClick={() => onMeMyPupFrameColor(color.id)}
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
            </>
          )}

          {!isDuoMode && (
            <div className="rounded-2xl border border-white/10 bg-[#0F1E38]/60 p-4 space-y-2">
              <p className="text-sm font-semibold text-white/70">Magic cutout (optional)</p>
              {bgRemoving && (
                <div className="rounded-xl border border-amber-400/40 bg-amber-400/10 p-3 text-center">
                  <p className="text-sm font-bold text-amber-400">Working… {bgProgress}</p>
                </div>
              )}
              {bgError && (
                <p className="text-xs text-red-300 leading-relaxed">{bgError}</p>
              )}
              {!cutoutApplied ? (
                <>
                  <p className="text-[10px] text-white/45 leading-relaxed">
                    Skip cutout and adjust your photo above — or try cutout to float your pet on the scene.
                  </p>
                  <button
                    type="button"
                    disabled={bgRemoving}
                    onClick={onRemoveBackground}
                    className="w-full min-h-[44px] rounded-xl border border-white/20 bg-[#1F2A44]/80 py-2.5 text-sm font-semibold text-white/75 disabled:opacity-50 touch-manipulation"
                  >
                    {bgRemoving ? `✨ Cutout… ${bgProgress}` : '✨ Try magic cutout (beta)'}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={onRestoreOriginal}
                  className="w-full min-h-[44px] rounded-xl border border-white/20 py-2.5 text-sm text-white/70 touch-manipulation"
                >
                  ↩ Restore original photo
                </button>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              disabled={isDuoMode && !ownerImageUrl}
              onClick={onShare}
              className="rounded-2xl bg-amber-400 py-4 text-base font-bold text-black touch-manipulation disabled:opacity-40"
            >
              📤 Share
            </button>
            <button
              type="button"
              disabled={isDuoMode && !ownerImageUrl}
              onClick={onSave}
              className="rounded-2xl border border-amber-400/60 py-4 text-base font-bold text-amber-300 touch-manipulation disabled:opacity-40"
            >
              💾 Save
            </button>
          </div>
          {isDuoMode && !ownerImageUrl && (
            <p className="text-center text-xs text-amber-300/80">
              Add your photo below to enable Share &amp; Save
            </p>
          )}
          {!isDuoMode && (
            <>
              <button
                type="button"
                onClick={() => setAccessoryOpen(true)}
                className="w-full min-h-[48px] rounded-2xl border border-amber-400/40 bg-[#0F1E38]/90 py-3 text-sm font-bold text-amber-300 touch-manipulation hover:bg-amber-400/10"
              >
                ✨ Add accessory
                {canvasStickers.length > 0 && (
                  <span className="ml-2 text-white/50 font-normal">
                    ({canvasStickers.length} on photo)
                  </span>
                )}
              </button>
              <p className="text-center text-[10px] text-white/40 -mt-2">
                Hats &amp; glasses snap near your pet&apos;s head zone — drag to fine-tune
              </p>

              {themeId === 'accessories-only' && (
                <p className="text-center text-xs text-white/45">Checkerboard = no background</p>
              )}

              <div className="rounded-2xl border border-white/10 bg-[#0F1E38]/60 p-4">
                <p className="text-sm font-semibold text-white/70 mb-1">Picture frame (optional)</p>
                <p className="text-[10px] text-white/45 mb-3">
                  {cutoutApplied && themeId !== 'frame-only'
                    ? 'After cutout, Frame Only adds mat & border — themes show your pet on the scene.'
                    : 'Works on any theme · drag slider for thin → thick'}
                </p>
                <div className="flex gap-2 overflow-x-auto pb-2 snap-x snap-mandatory">
                  {FRAME_STYLES.map((frame) => (
                    <button
                      key={frame.id}
                      type="button"
                      onClick={() => onFrameStyle(frame.id)}
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
                      onChange={(e) => onFrameWidth(Number(e.target.value))}
                      className="photobooth-frame-slider w-full touch-none"
                      aria-label="Frame thickness"
                    />
                  </div>
                )}
              </div>

              {canvasStickers.length > 0 && (
                <>
                  <div>
                    <p className="mb-2 text-center text-[10px] text-white/45">
                      Tap a name to select ·{' '}
                      <strong className="text-amber-300/90">double-tap</strong> the accessory on the photo to
                      remove it
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
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-[10px] text-white/40">Move &amp; tilt the selected accessory</p>
                    <AdjustPhotoPad
                      label=""
                      onNudge={(dx, dy) => canvasRef.current?.nudgeSelected(dx, dy)}
                      onScale={(factor) => canvasRef.current?.scaleSelected(factor)}
                      zoomOutLabel="− Smaller"
                      zoomInLabel="+ Bigger"
                    />
                    <div className="flex w-full max-w-xs gap-2">
                      <button
                        type="button"
                        aria-label="Tilt left"
                        disabled={selectedStickerId === null}
                        onClick={() => canvasRef.current?.tiltSelected(-1)}
                        className="flex-1 rounded-lg bg-[#0F1E38] border border-white/15 py-2.5 text-sm font-semibold disabled:opacity-30 touch-manipulation"
                      >
                        ↺ Tilt left
                      </button>
                      <button
                        type="button"
                        aria-label="Tilt right"
                        disabled={selectedStickerId === null}
                        onClick={() => canvasRef.current?.tiltSelected(1)}
                        className="flex-1 rounded-lg bg-[#0F1E38] border border-white/15 py-2.5 text-sm font-semibold disabled:opacity-30 touch-manipulation"
                      >
                        Tilt right ↻
                      </button>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      )}

      {!isDuoMode && (
        <AccessoryDrawer
          open={accessoryOpen}
          onClose={() => setAccessoryOpen(false)}
          onPick={onAddAccessory}
          hasSelection={selectedStickerId !== null}
          onRemoveSelected={() => canvasRef.current?.removeSelected()}
        />
      )}
    </>
  );
}
