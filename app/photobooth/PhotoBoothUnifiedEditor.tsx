'use client';

import { useState, type RefObject } from 'react';
import AccessoryDrawer from './AccessoryDrawer';
import AdjustPhotoPad from './AdjustPhotoPad';
import PhotoBoothAffiliatePicks from '@/app/components/photobooth/PhotoBoothAffiliatePicks';
import MeAndMyPupCanvas from './MeAndMyPupCanvas';
import PhotoBoothCanvas from './PhotoBoothCanvas';
import { ACCESSORY_STICKERS } from '@/lib/photobooth/themes';
import { type FrameStyleId } from '@/lib/photobooth/frames';
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
import type { PhotoBoothAffiliatesData } from '@/lib/photobooth/affiliates';

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
  frameHeadline: string;
  frameHeadlineOffset: number;
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
  onAddAccessory: (sticker: (typeof ACCESSORY_STICKERS)[number]) => void;
  onRemoveBackground: () => void;
  onRestoreOriginal: () => void;
  onBackToBackgrounds: () => void;
  onRestoreAiCostume: () => void;
  aiCostumeApplied: boolean;
  aiCostumeBusy: boolean;
  aiCostumeConfigured: boolean;
  aiCreditsRemaining?: number;
  onOpenAiCostume: () => void;
  onExport: () => void;
  photoAffiliates: PhotoBoothAffiliatesData;
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
  frameHeadline,
  frameHeadlineOffset,
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
  onAddAccessory,
  onRemoveBackground,
  onRestoreOriginal,
  onBackToBackgrounds,
  onRestoreAiCostume,
  aiCostumeApplied,
  aiCostumeBusy,
  aiCostumeConfigured,
  aiCreditsRemaining,
  onOpenAiCostume,
  onExport,
  photoAffiliates,
}: Props) {
  const [accessoryOpen, setAccessoryOpen] = useState(false);

  const adjustingSticker = !isDuoMode && selectedStickerId !== null;
  const adjustingPet = !isDuoMode && petSelected && selectedStickerId === null;
  const showAdjustPad = adjustingSticker || adjustingPet;

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

      {/* Image — controls always render below, never on top */}
      <div>
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
            frameHeadline={frameHeadline}
            frameHeadlineOffset={frameHeadlineOffset}
            cutoutApplied={cutoutApplied}
            hideHint={showAdjustPad}
            onReadyChange={onReadyChange}
            onStickersChange={onStickersChange}
            onPetSelectedChange={onPetSelectedChange}
            onError={onError}
          />
        )}
      </div>

      {canvasReady && (
        <div className="mt-3 space-y-3">
          {/* Tools directly below image */}
          {!isDuoMode ? (
            <div className="rounded-2xl border border-amber-400/35 bg-[#0F1E38]/90 p-3 space-y-3">
              <button
                type="button"
                disabled={aiCostumeBusy || (aiCreditsRemaining !== undefined && aiCreditsRemaining < 1)}
                onClick={onOpenAiCostume}
                className="w-full min-h-[44px] rounded-xl border border-violet-400/45 bg-violet-500/15 py-2.5 text-xs font-bold text-violet-200 touch-manipulation disabled:opacity-40"
              >
                ✨ AI Magic Look — photoreal costumes
                {aiCreditsRemaining !== undefined && (
                  <span className="ml-1 font-normal text-white/55">
                    ({aiCreditsRemaining} left this month)
                  </span>
                )}
                {!aiCostumeConfigured && (
                  <span className="ml-1 font-normal text-white/45">(backgrounds ready)</span>
                )}
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setAccessoryOpen(true)}
                  className="min-h-[44px] rounded-xl border border-amber-400/40 bg-amber-400/10 py-2.5 text-xs font-bold text-amber-300 touch-manipulation"
                >
                  ✨ Add accessory
                  {canvasStickers.length > 0 && (
                    <span className="ml-1 font-normal text-white/50">({canvasStickers.length})</span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => canvasRef.current?.selectPet()}
                  className={`min-h-[44px] rounded-xl py-2.5 text-xs font-bold touch-manipulation ${
                    petSelected
                      ? 'bg-amber-400 text-black'
                      : 'border border-white/20 text-white/80'
                  }`}
                >
                  {petSelected ? '✓ Pet selected' : '🐾 Move pet'}
                </button>
              </div>

              {canvasStickers.length > 0 && (
                <div>
                  <p className="mb-1.5 text-center text-[10px] text-white/45">
                    Tap to select · double-tap on photo to remove
                  </p>
                  <div className="flex flex-wrap justify-center gap-1.5">
                    {canvasStickers.map((sticker) => (
                      <button
                        key={sticker.id}
                        type="button"
                        onClick={() => canvasRef.current?.selectSticker(sticker.id)}
                        className={`rounded-full px-2.5 py-1 text-[11px] font-semibold touch-manipulation ${
                          selectedStickerId === sticker.id
                            ? 'bg-amber-400 text-black'
                            : 'bg-[#0A1625] border border-white/15 text-white/80'
                        }`}
                      >
                        {sticker.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {showAdjustPad && (
                <AdjustPhotoPad
                  label={
                    adjustingSticker
                      ? 'Move accessory — controls below photo'
                      : 'Move your pet — controls below photo'
                  }
                  onNudge={(dx, dy) => canvasRef.current?.nudgeSelected(dx, dy)}
                  onScale={(factor) => canvasRef.current?.scaleSelected(factor)}
                  zoomOutLabel="−"
                  zoomInLabel="+"
                  showTilt={adjustingSticker}
                  onTilt={(dir) => canvasRef.current?.tiltSelected(dir)}
                  onDone={() => canvasRef.current?.clearSelection()}
                />
              )}

              {themeId === 'accessories-only' && (
                <p className="text-center text-[10px] text-white/45">Checkerboard = no background</p>
              )}
            </div>
          ) : (
            <div className="rounded-2xl border border-amber-400/35 bg-[#0F1E38]/90 p-3 space-y-3">
              <p className="text-sm font-bold text-amber-400">Adjust your circles</p>
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
                <AdjustPhotoPad
                  label={`Adjust ${selectedSlot === 'dog' ? 'your pup' : 'your face'}`}
                  nudgeStep={0.08}
                  onNudge={(dx, dy) => meMyPupRef.current?.nudgeSelected(dx, dy)}
                  onScale={(factor) => meMyPupRef.current?.scaleSelected(factor)}
                />
              )}
            </div>
          )}

          {isDuoMode && (
            <>
              <div className="rounded-2xl border border-amber-400/35 bg-[#0F1E38]/90 p-3">
                <button
                  type="button"
                  onClick={() => ownerInputRef.current?.click()}
                  className="w-full min-h-[48px] rounded-xl bg-amber-400 py-3 text-sm font-bold text-black touch-manipulation"
                >
                  {ownerImageUrl ? '📷 Change my photo' : '📷 Add my photo (selfie)'}
                </button>
                <p className="mt-2 text-[10px] text-white/45 text-center">
                  Stays on your phone until you share
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
                    <div className="flex gap-2 overflow-x-auto pb-2 snap-x snap-mandatory">
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
            <div className="rounded-xl border border-white/10 bg-[#0F1E38]/40 px-3 py-2 space-y-1">
              <button
                type="button"
                onClick={onBackToBackgrounds}
                className="w-full min-h-[40px] py-2 text-xs font-semibold text-amber-300/90 touch-manipulation"
              >
                ↩ Change background
              </button>
              {aiCostumeApplied && (
                <button
                  type="button"
                  onClick={onRestoreAiCostume}
                  className="w-full py-2 text-xs text-violet-300/90 touch-manipulation"
                >
                  ↩ Remove AI costume
                </button>
              )}
              {bgRemoving ? (
                <p className="text-center text-xs font-bold text-amber-400">✨ Cutout… {bgProgress}</p>
              ) : bgError ? (
                <p className="text-xs text-red-300">{bgError}</p>
              ) : cutoutApplied ? (
                <button
                  type="button"
                  onClick={onRestoreOriginal}
                  className="w-full py-2 text-xs text-white/70 touch-manipulation"
                >
                  ↩ Restore original photo (remove cutout &amp; restart)
                </button>
              ) : (
                <button
                  type="button"
                  disabled={bgRemoving}
                  onClick={onRemoveBackground}
                  className="w-full py-2 text-xs text-white/55 touch-manipulation disabled:opacity-50"
                >
                  ✨ Magic cutout (optional)
                </button>
              )}
            </div>
          )}

          {/* Share / Save at bottom */}
          <button
            type="button"
            disabled={isDuoMode && !ownerImageUrl}
            onClick={onExport}
            className="w-full rounded-2xl bg-amber-400 py-4 text-base font-bold text-black touch-manipulation disabled:opacity-40"
          >
            📤 Share / Save
          </button>
          {isDuoMode && !ownerImageUrl && (
            <p className="text-center text-xs text-amber-300/80 -mt-1">
              Add your photo to enable Share / Save
            </p>
          )}

          {!isDuoMode && <PhotoBoothAffiliatePicks data={photoAffiliates} variant="full" />}
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
