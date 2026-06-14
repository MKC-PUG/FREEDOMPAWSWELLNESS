'use client';

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {
  backgroundCandidates,
  getTheme,
  stickerCandidates,
  type PhotoBoothTheme,
  type StickerPlacement,
} from '@/lib/photobooth/themes';
import { drawThemeBackground, usesPhotoBackground } from '@/lib/photobooth/draw-theme-background';
import {
  computeFrameRects,
  drawFrameBorder,
  drawFrameMat,
  drawFrameOnlyBackground,
  drawFrameShadow,
} from '@/lib/photobooth/draw-frame';
import {
  computePetRect,
  type FrameStyleId,
  type PetRect,
} from '@/lib/photobooth/frames';
import { smartStickerPlacement } from '@/lib/photobooth/smart-placement';
import { drawPhotoBoothWatermark } from '@/lib/photobooth/watermark';

const PET_MAX_DIM = 640;
/** ~6° per tap */
const TILT_STEP_RAD = Math.PI / 30;
const TILT_MAX_RAD = Math.PI / 2;
/** Double-tap accessory on canvas to remove it */
const DOUBLE_TAP_MS = 400;
const DOUBLE_TAP_MAX_DIST_PX = 40;
const PET_SCALE_MIN = 0.12;
const PET_SCALE_MAX = 1.05;

type PetTransform = { x: number; y: number; scale: number };

export type StickerListItem = { id: number; label: string };

export type PhotoBoothCanvasHandle = {
  addSticker: (placement: StickerPlacement) => Promise<void>;
  removeSelected: () => void;
  nudgeSelected: (dx: number, dy: number) => void;
  tiltSelected: (direction: -1 | 1) => void;
  scaleSelected: (factor: number) => void;
  selectSticker: (id: number) => void;
  clearSelection: () => void;
  selectPet: () => void;
  listStickers: () => StickerListItem[];
  exportBlob: () => Promise<Blob | null>;
};

type Props = {
  petImageUrl: string | null;
  themeId: string;
  frameId?: FrameStyleId;
  frameWidth?: number;
  /** True after AI background removal — pet PNG has alpha; skip opaque mat/shadow on themes. */
  cutoutApplied?: boolean;
  showWatermark?: boolean;
  /** Hide tip line when move controls are shown below the canvas. */
  hideHint?: boolean;
  onReadyChange?: (ready: boolean) => void;
  onStickersChange?: (stickers: StickerListItem[], selectedId: number | null) => void;
  onPetSelectedChange?: (selected: boolean) => void;
  onError?: (message: string) => void;
};

type StickerLayer = {
  id: number;
  placement: StickerPlacement;
  img: HTMLImageElement;
  x: number;
  y: number;
  scale: number;
  /** Radians, 0 = upright; negative = tilt left */
  rotation: number;
};

function canvasSize(containerWidth: number) {
  const width = Math.min(Math.max(containerWidth, 280), 640);
  const height = Math.round(width * 0.75);
  return { width, height };
}

function loadImageElement(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    // crossOrigin only for true cross-origin URLs — setting it on same-origin
    // /images/ paths breaks loading in PWA standalone when no CORS header is sent.
    if (/^https?:\/\//i.test(url)) {
      try {
        const resolved = new URL(url);
        if (typeof window !== 'undefined' && resolved.origin !== window.location.origin) {
          img.crossOrigin = 'anonymous';
        }
      } catch {
        img.crossOrigin = 'anonymous';
      }
    }
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load ${url}`));
    img.src = url;
  });
}

async function loadFirstImage(urls: string[]): Promise<HTMLImageElement> {
  for (const url of urls) {
    try {
      return await loadImageElement(url);
    } catch {
      /* try next */
    }
  }
  throw new Error('Image not found');
}

/** Sample pixels — JPEG export destroys alpha from background-removal PNGs. */
function canvasHasAlpha(ctx: CanvasRenderingContext2D, w: number, h: number): boolean {
  const { data } = ctx.getImageData(0, 0, w, h);
  const stride = Math.max(4, Math.floor((w * h) / 4096) * 4);
  for (let i = 3; i < data.length; i += stride) {
    if (data[i] < 252) return true;
  }
  return false;
}

async function loadPetImage(url: string): Promise<HTMLImageElement> {
  const img = await loadImageElement(url);
  const maxSide = Math.max(img.naturalWidth || img.width, img.naturalHeight || img.height);
  if (maxSide <= PET_MAX_DIM) return img;

  const scale = PET_MAX_DIM / maxSide;
  const w = Math.max(1, Math.round((img.naturalWidth || img.width) * scale));
  const h = Math.max(1, Math.round((img.naturalHeight || img.height) * scale));
  const scratch = document.createElement('canvas');
  scratch.width = w;
  scratch.height = h;
  const ctx = scratch.getContext('2d', { willReadFrequently: true });
  if (!ctx) return img;
  ctx.drawImage(img, 0, 0, w, h);
  const hasAlpha = canvasHasAlpha(ctx, w, h);
  const dataUrl = hasAlpha
    ? scratch.toDataURL('image/png')
    : scratch.toDataURL('image/jpeg', 0.88);
  return loadImageElement(dataUrl);
}

function drawCheckerboard(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const tile = 16;
  const patternCanvas = document.createElement('canvas');
  patternCanvas.width = tile * 2;
  patternCanvas.height = tile * 2;
  const pCtx = patternCanvas.getContext('2d');
  if (!pCtx) {
    ctx.fillStyle = '#0A1625';
    ctx.fillRect(0, 0, w, h);
    return;
  }
  pCtx.fillStyle = '#1a2a44';
  pCtx.fillRect(0, 0, tile * 2, tile * 2);
  pCtx.fillStyle = '#121f35';
  pCtx.fillRect(0, 0, tile, tile);
  pCtx.fillRect(tile, tile, tile, tile);
  const pattern = ctx.createPattern(patternCanvas, 'repeat');
  if (pattern) {
    ctx.fillStyle = pattern;
    ctx.fillRect(0, 0, w, h);
  }
}

function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  cw: number,
  ch: number
) {
  const iw = img.naturalWidth || img.width;
  const ih = img.naturalHeight || img.height;
  const scale = Math.max(cw / iw, ch / ih);
  const dw = iw * scale;
  const dh = ih * scale;
  ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
}

function stickerSize(layer: StickerLayer, cw: number) {
  const iw = layer.img.naturalWidth || layer.img.width;
  const ih = layer.img.naturalHeight || layer.img.height;
  const targetW = cw * layer.scale;
  const targetH = ih * (targetW / iw);
  return { targetW, targetH };
}

function getStickerCorners(layer: StickerLayer, cw: number, ch: number) {
  const { targetW, targetH } = stickerSize(layer, cw);
  const cx = cw * layer.x;
  const cy = ch * layer.y;
  const hw = targetW / 2;
  const hh = targetH / 2;
  const cos = Math.cos(layer.rotation);
  const sin = Math.sin(layer.rotation);
  return [
    [-hw, -hh],
    [hw, -hh],
    [hw, hh],
    [-hw, hh],
  ].map(([x, y]) => ({
    x: cx + x * cos - y * sin,
    y: cy + x * sin + y * cos,
  }));
}

function stickerBounds(layer: StickerLayer, cw: number, ch: number) {
  const corners = getStickerCorners(layer, cw, ch);
  const xs = corners.map((c) => c.x);
  const ys = corners.map((c) => c.y);
  const left = Math.min(...xs);
  const top = Math.min(...ys);
  return {
    left,
    top,
    width: Math.max(...xs) - left,
    height: Math.max(...ys) - top,
  };
}

/** ~44px on screen — comfortable for large fingers on iPhone. */
function handleHitRadius(canvas: HTMLCanvasElement) {
  const rect = canvas.getBoundingClientRect();
  const minScreenPx = 44;
  return minScreenPx * (canvas.width / Math.max(rect.width, 1));
}

function drawCornerHandles(
  ctx: CanvasRenderingContext2D,
  corners: { x: number; y: number }[],
  cw: number
) {
  const visualR = Math.max(10, cw * 0.024);
  for (const c of corners) {
    ctx.fillStyle = '#F5C242';
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = Math.max(2, cw * 0.005);
    ctx.beginPath();
    ctx.arc(c.x, c.y, visualR, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#0A1625';
    ctx.beginPath();
    ctx.arc(c.x, c.y, visualR * 0.35, 0, Math.PI * 2);
    ctx.fill();
  }
}

type InteractionMode =
  | { kind: 'move'; index: number; grabDx: number; grabDy: number }
  | { kind: 'resize'; index: number; initialDist: number; initialScale: number }
  | { kind: 'move-pet'; grabDx: number; grabDy: number }
  | { kind: 'resize-pet'; initialDist: number; initialScale: number };

function petRectFromTransform(
  t: PetTransform,
  img: HTMLImageElement,
  cw: number,
  ch: number
): PetRect {
  const iw = img.naturalWidth || img.width;
  const ih = img.naturalHeight || img.height;
  const width = cw * t.scale;
  const height = ih * (width / iw);
  return {
    left: cw * t.x - width / 2,
    top: ch * t.y - height / 2,
    width,
    height,
  };
}

function petCornersFromRect(photo: PetRect) {
  return [
    { x: photo.left, y: photo.top },
    { x: photo.left + photo.width, y: photo.top },
    { x: photo.left + photo.width, y: photo.top + photo.height },
    { x: photo.left, y: photo.top + photo.height },
  ];
}

function hitTestRect(px: number, py: number, r: PetRect) {
  return px >= r.left && px <= r.left + r.width && py >= r.top && py <= r.top + r.height;
}

function drawCenteredWidth(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  cx: number,
  cy: number,
  targetW: number,
  rotation = 0
) {
  const iw = img.naturalWidth || img.width;
  const ih = img.naturalHeight || img.height;
  const scale = targetW / iw;
  const dw = targetW;
  const dh = ih * scale;
  ctx.save();
  ctx.translate(cx, cy);
  if (rotation !== 0) ctx.rotate(rotation);
  ctx.drawImage(img, -dw / 2, -dh / 2, dw, dh);
  ctx.restore();
}

function touchDistance(t1: Touch, t2: Touch) {
  const dx = t1.clientX - t2.clientX;
  const dy = t1.clientY - t2.clientY;
  return Math.hypot(dx, dy);
}

function canvasPoint(canvas: HTMLCanvasElement, clientX: number, clientY: number) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  return {
    x: (clientX - rect.left) * scaleX,
    y: (clientY - rect.top) * scaleY,
  };
}

function makeLayer(placement: StickerPlacement, img: HTMLImageElement, id: number): StickerLayer {
  return {
    id,
    placement,
    img,
    x: placement.x,
    y: placement.y,
    scale: placement.scale,
    rotation: 0,
  };
}

const PhotoBoothCanvas = forwardRef<PhotoBoothCanvasHandle, Props>(function PhotoBoothCanvas(
  {
    petImageUrl,
    themeId,
    frameId = 'none',
    frameWidth = 0.45,
    cutoutApplied = false,
    showWatermark = true,
    hideHint = false,
    onReadyChange,
    onStickersChange,
    onPetSelectedChange,
    onError,
  },
  ref
) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const petCacheRef = useRef<{ url: string; img: HTMLImageElement } | null>(null);
  const bgRef = useRef<HTMLImageElement | null>(null);
  const stickersRef = useRef<StickerLayer[]>([]);
  const petRef = useRef<HTMLImageElement | null>(null);
  const accessoriesOnlyRef = useRef(false);
  const frameOnlyRef = useRef(false);
  const activeThemeIdRef = useRef('');
  const stickerIdRef = useRef(0);
  const applyGenRef = useRef(0);
  const dimsRef = useRef({ width: 360, height: 270 });
  const interactionRef = useRef<InteractionMode | null>(null);
  const lastTapRef = useRef<{ time: number; stickerIndex: number; x: number; y: number } | null>(
    null
  );
  const petTransformRef = useRef<PetTransform>({ x: 0.5, y: 0.54, scale: 0.75 });
  const petSelectedRef = useRef(false);
  const pinchRef = useRef<{
    initialDistance: number;
    initialScale: number;
    target: 'sticker' | 'pet';
  } | null>(null);
  const busyRef = useRef(false);
  const selectedIdRef = useRef<number | null>(null);
  const frameIdRef = useRef<FrameStyleId>(frameId);
  const frameWidthRef = useRef(frameWidth);
  const cutoutAppliedRef = useRef(cutoutApplied);
  const [busy, setBusy] = useState(false);

  frameIdRef.current = frameId;
  frameWidthRef.current = frameWidth;
  cutoutAppliedRef.current = cutoutApplied;

  busyRef.current = busy;

  const notifyStickers = useCallback(() => {
    const list = stickersRef.current.map((s) => ({ id: s.id, label: s.placement.label }));
    onStickersChange?.(list, selectedIdRef.current);
  }, [onStickersChange]);

  const setPetSelected = useCallback(
    (selected: boolean) => {
      petSelectedRef.current = selected;
      if (selected) {
        selectedIdRef.current = null;
        notifyStickers();
      }
      onPetSelectedChange?.(selected);
    },
    [notifyStickers, onPetSelectedChange]
  );

  const setSelected = useCallback(
    (id: number | null) => {
      selectedIdRef.current = id;
      if (id !== null) {
        petSelectedRef.current = false;
        onPetSelectedChange?.(false);
      }
      notifyStickers();
    },
    [notifyStickers, onPetSelectedChange]
  );

  const syncPetTransformFromFit = useCallback(() => {
    if (!petRef.current) return;
    const { width: cw, height: ch } = dimsRef.current;
    const maxW = frameOnlyRef.current || accessoriesOnlyRef.current ? 0.82 : 0.88;
    const maxH = frameOnlyRef.current || accessoriesOnlyRef.current ? 0.85 : 0.9;
    const photo = computePetRect(petRef.current, cw, ch, maxW, maxH, 0.54);
    petTransformRef.current = {
      x: (photo.left + photo.width / 2) / cw,
      y: (photo.top + photo.height / 2) / ch,
      scale: photo.width / cw,
    };
  }, []);

  const getCurrentPetRect = useCallback((): PetRect | null => {
    if (!petRef.current) return null;
    const { width: cw, height: ch } = dimsRef.current;
    return petRectFromTransform(petTransformRef.current, petRef.current, cw, ch);
  }, []);

  const paint = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width: cw, height: ch } = dimsRef.current;
    canvas.width = cw;
    canvas.height = ch;

    if (frameOnlyRef.current) {
      drawFrameOnlyBackground(ctx, cw, ch);
    } else if (accessoriesOnlyRef.current) {
      drawCheckerboard(ctx, cw, ch);
    } else if (usesPhotoBackground(activeThemeIdRef.current)) {
      if (bgRef.current) {
        drawCover(ctx, bgRef.current, cw, ch);
      } else {
        drawThemeBackground(ctx, activeThemeIdRef.current, cw, ch);
      }
    } else {
      drawThemeBackground(ctx, activeThemeIdRef.current, cw, ch);
    }

    let frameLayout: ReturnType<typeof computeFrameRects> | null = null;

    if (petRef.current) {
      const photo = getCurrentPetRect()!;
      const styleId = frameIdRef.current;
      const widthNorm = frameWidthRef.current;

      const floatCutout =
        cutoutAppliedRef.current && !frameOnlyRef.current && !accessoriesOnlyRef.current;
      const drawFrameBacking = styleId !== 'none' && !floatCutout;

      if (drawFrameBacking) {
        frameLayout = computeFrameRects(photo, widthNorm, cw, ch);
        drawFrameShadow(ctx, photo, frameLayout.framePx, frameLayout.matPx);
        drawFrameMat(ctx, frameLayout.mat);
      }

      ctx.drawImage(petRef.current, photo.left, photo.top, photo.width, photo.height);

      if (petSelectedRef.current) {
        ctx.strokeStyle = '#F5C242';
        ctx.lineWidth = Math.max(2, cw * 0.006);
        ctx.setLineDash([6, 4]);
        ctx.strokeRect(photo.left - 2, photo.top - 2, photo.width + 4, photo.height + 4);
        ctx.setLineDash([]);
        drawCornerHandles(ctx, petCornersFromRect(photo), cw);
      }
    }

    for (const layer of stickersRef.current) {
      drawCenteredWidth(
        ctx,
        layer.img,
        cw * layer.x,
        ch * layer.y,
        cw * layer.scale,
        layer.rotation
      );
      if (layer.id === selectedIdRef.current) {
        const b = stickerBounds(layer, cw, ch);
        ctx.strokeStyle = '#F5C242';
        ctx.lineWidth = Math.max(2, cw * 0.006);
        ctx.setLineDash([6, 4]);
        ctx.strokeRect(b.left - 2, b.top - 2, b.width + 4, b.height + 4);
        ctx.setLineDash([]);
        drawCornerHandles(ctx, getStickerCorners(layer, cw, ch), cw);
      }
    }

    const floatCutout =
      cutoutAppliedRef.current && !frameOnlyRef.current && !accessoriesOnlyRef.current;
    if (frameLayout && frameIdRef.current !== 'none' && !floatCutout) {
      drawFrameBorder(ctx, frameLayout.outer, frameLayout.mat, frameIdRef.current);
    }

    if (showWatermark) {
      drawPhotoBoothWatermark(ctx, cw, ch);
    }
  }, [showWatermark, getCurrentPetRect]);

  const paintRef = useRef(paint);
  paintRef.current = paint;

  const syncCanvasSize = useCallback(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    dimsRef.current = canvasSize(wrap.clientWidth);
    paintRef.current();
  }, []);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const ro = new ResizeObserver(() => syncCanvasSize());
    ro.observe(wrap);
    syncCanvasSize();
    return () => ro.disconnect();
  }, [syncCanvasSize]);

  const hitTestSticker = useCallback((px: number, py: number) => {
    const { width: cw, height: ch } = dimsRef.current;
    for (let i = stickersRef.current.length - 1; i >= 0; i -= 1) {
      const b = stickerBounds(stickersRef.current[i], cw, ch);
      if (px >= b.left && px <= b.left + b.width && py >= b.top && py <= b.top + b.height) {
        return i;
      }
    }
    return null;
  }, []);

  const removeStickerAt = useCallback(
    (index: number) => {
      if (index < 0 || index >= stickersRef.current.length) return;
      stickersRef.current.splice(index, 1);
      lastTapRef.current = null;
      interactionRef.current = null;
      setSelected(null);
      paintRef.current();
      notifyStickers();
    },
    [setSelected, notifyStickers]
  );

  const beginInteraction = useCallback(
    (clientX: number, clientY: number): boolean => {
      const canvas = canvasRef.current;
      if (!canvas || busyRef.current) return false;
      const pt = canvasPoint(canvas, clientX, clientY);
      const { width: cw, height: ch } = dimsRef.current;
      const hitR = handleHitRadius(canvas);

      if (petSelectedRef.current) {
        const photo = getCurrentPetRect();
        if (photo) {
          for (const c of petCornersFromRect(photo)) {
            if (Math.hypot(pt.x - c.x, pt.y - c.y) <= hitR) {
              lastTapRef.current = null;
              const cx = cw * petTransformRef.current.x;
              const cy = ch * petTransformRef.current.y;
              interactionRef.current = {
                kind: 'resize-pet',
                initialDist: Math.max(24, Math.hypot(pt.x - cx, pt.y - cy)),
                initialScale: petTransformRef.current.scale,
              };
              paintRef.current();
              return true;
            }
          }
        }
      }

      const selectedId = selectedIdRef.current;
      if (selectedId !== null) {
        const selIndex = stickersRef.current.findIndex((s) => s.id === selectedId);
        if (selIndex >= 0) {
          const layer = stickersRef.current[selIndex];
          const corners = getStickerCorners(layer, cw, ch);
          for (const c of corners) {
            if (Math.hypot(pt.x - c.x, pt.y - c.y) <= hitR) {
              lastTapRef.current = null;
              const cx = cw * layer.x;
              const cy = ch * layer.y;
              interactionRef.current = {
                kind: 'resize',
                index: selIndex,
                initialDist: Math.max(24, Math.hypot(pt.x - cx, pt.y - cy)),
                initialScale: layer.scale,
              };
              paintRef.current();
              return true;
            }
          }
        }
      }

      const index = hitTestSticker(pt.x, pt.y);
      if (index !== null) {
        const now = Date.now();
        const last = lastTapRef.current;
        if (
          last &&
          last.stickerIndex === index &&
          now - last.time < DOUBLE_TAP_MS &&
          Math.hypot(clientX - last.x, clientY - last.y) < DOUBLE_TAP_MAX_DIST_PX
        ) {
          removeStickerAt(index);
          return true;
        }
        lastTapRef.current = { time: now, stickerIndex: index, x: clientX, y: clientY };

        const layer = stickersRef.current[index];
        setSelected(layer.id);
        interactionRef.current = {
          kind: 'move',
          index,
          grabDx: pt.x - cw * layer.x,
          grabDy: pt.y - ch * layer.y,
        };
        paintRef.current();
        return true;
      }

      if (petRef.current) {
        const photo = getCurrentPetRect();
        if (photo && hitTestRect(pt.x, pt.y, photo)) {
          lastTapRef.current = null;
          setPetSelected(true);
          interactionRef.current = {
            kind: 'move-pet',
            grabDx: pt.x - cw * petTransformRef.current.x,
            grabDy: pt.y - ch * petTransformRef.current.y,
          };
          paintRef.current();
          return true;
        }
      }

      lastTapRef.current = null;
      setSelected(null);
      setPetSelected(false);
      paintRef.current();
      return false;
    },
    [hitTestSticker, setSelected, setPetSelected, removeStickerAt, getCurrentPetRect]
  );

  const moveInteraction = useCallback(
    (clientX: number, clientY: number) => {
      const mode = interactionRef.current;
      if (!mode) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const pt = canvasPoint(canvas, clientX, clientY);
      const { width: cw, height: ch } = dimsRef.current;

      if (mode.kind === 'move-pet') {
        petTransformRef.current.x = Math.min(
          1.15,
          Math.max(-0.15, (pt.x - mode.grabDx) / cw)
        );
        petTransformRef.current.y = Math.min(
          1.15,
          Math.max(-0.15, (pt.y - mode.grabDy) / ch)
        );
        paintRef.current();
        return;
      }

      if (mode.kind === 'resize-pet') {
        const cx = cw * petTransformRef.current.x;
        const cy = ch * petTransformRef.current.y;
        const dist = Math.hypot(pt.x - cx, pt.y - cy);
        const ratio = dist / mode.initialDist;
        petTransformRef.current.scale = Math.min(
          PET_SCALE_MAX,
          Math.max(PET_SCALE_MIN, mode.initialScale * ratio)
        );
        paintRef.current();
        return;
      }

      const layer = stickersRef.current[mode.index];
      if (!layer) return;

      if (mode.kind === 'resize') {
        const cx = cw * layer.x;
        const cy = ch * layer.y;
        const dist = Math.hypot(pt.x - cx, pt.y - cy);
        const ratio = dist / mode.initialDist;
        layer.scale = Math.min(0.95, Math.max(0.06, mode.initialScale * ratio));
      } else {
        layer.x = Math.min(1.05, Math.max(-0.05, (pt.x - mode.grabDx) / cw));
        layer.y = Math.min(1.05, Math.max(-0.05, (pt.y - mode.grabDy) / ch));
      }
      paintRef.current();
    },
    []
  );

  const endInteraction = useCallback(() => {
    interactionRef.current = null;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        if (petSelectedRef.current) {
          pinchRef.current = {
            initialDistance: touchDistance(e.touches[0], e.touches[1]),
            initialScale: petTransformRef.current.scale,
            target: 'pet',
          };
          interactionRef.current = null;
          e.preventDefault();
          return;
        }
        if (selectedIdRef.current !== null) {
          const layer = stickersRef.current.find((s) => s.id === selectedIdRef.current);
          if (layer) {
            pinchRef.current = {
              initialDistance: touchDistance(e.touches[0], e.touches[1]),
              initialScale: layer.scale,
              target: 'sticker',
            };
            interactionRef.current = null;
            e.preventDefault();
            return;
          }
        }
      }
      pinchRef.current = null;
      const touch = e.touches[0];
      if (!touch) return;
      if (beginInteraction(touch.clientX, touch.clientY)) {
        e.preventDefault();
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && pinchRef.current) {
        const dist = touchDistance(e.touches[0], e.touches[1]);
        const ratio = dist / pinchRef.current.initialDistance;
        if (pinchRef.current.target === 'pet') {
          petTransformRef.current.scale = Math.min(
            PET_SCALE_MAX,
            Math.max(PET_SCALE_MIN, pinchRef.current.initialScale * ratio)
          );
        } else {
          const layer = stickersRef.current.find((s) => s.id === selectedIdRef.current);
          if (layer) {
            layer.scale = Math.min(0.95, Math.max(0.06, pinchRef.current.initialScale * ratio));
          }
        }
        paintRef.current();
        e.preventDefault();
        return;
      }
      if (!interactionRef.current) return;
      const touch = e.touches[0];
      if (!touch) return;
      moveInteraction(touch.clientX, touch.clientY);
      e.preventDefault();
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (e.touches.length < 2) pinchRef.current = null;
      if (e.touches.length === 0) endInteraction();
    };

    const blockContextMenu = (e: Event) => e.preventDefault();
    const blockSelect = (e: Event) => e.preventDefault();

    canvas.addEventListener('touchstart', onTouchStart, { passive: false });
    canvas.addEventListener('touchmove', onTouchMove, { passive: false });
    canvas.addEventListener('touchend', onTouchEnd, { passive: false });
    canvas.addEventListener('touchcancel', onTouchEnd, { passive: false });
    canvas.addEventListener('contextmenu', blockContextMenu);
    wrap.addEventListener('contextmenu', blockContextMenu);
    wrap.addEventListener('selectstart', blockSelect);

    return () => {
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchmove', onTouchMove);
      canvas.removeEventListener('touchend', onTouchEnd);
      canvas.removeEventListener('touchcancel', onTouchEnd);
      canvas.removeEventListener('contextmenu', blockContextMenu);
      wrap.removeEventListener('contextmenu', blockContextMenu);
      wrap.removeEventListener('selectstart', blockSelect);
    };
  }, [beginInteraction, moveInteraction, endInteraction]);

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (e.pointerType === 'touch') return;
      if (beginInteraction(e.clientX, e.clientY)) {
        canvasRef.current?.setPointerCapture(e.pointerId);
        e.preventDefault();
      }
    },
    [beginInteraction]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (e.pointerType === 'touch') return;
      if (!interactionRef.current) return;
      moveInteraction(e.clientX, e.clientY);
      e.preventDefault();
    },
    [moveInteraction]
  );

  const onPointerUp = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (e.pointerType === 'touch') return;
      endInteraction();
      canvasRef.current?.releasePointerCapture(e.pointerId);
    },
    [endInteraction]
  );

  const loadCachedPet = useCallback(async (petUrl: string) => {
    if (petCacheRef.current?.url === petUrl) {
      return petCacheRef.current.img;
    }
    const img = await loadPetImage(petUrl);
    petCacheRef.current = { url: petUrl, img };
    return img;
  }, []);

  const applyTheme = useCallback(
    async (theme: PhotoBoothTheme, petUrl: string) => {
      const generation = ++applyGenRef.current;
      setBusy(true);
      onReadyChange?.(false);
      selectedIdRef.current = null;

      frameOnlyRef.current = theme.id === 'frame-only';
      accessoriesOnlyRef.current = theme.id === 'accessories-only';
      activeThemeIdRef.current = theme.id;
      bgRef.current = null;
      stickersRef.current = [];

      if (!accessoriesOnlyRef.current && usesPhotoBackground(theme.id)) {
        const bgCandidates = backgroundCandidates(theme);
        if (bgCandidates.length > 0) {
          try {
            bgRef.current = await loadFirstImage(bgCandidates);
          } catch {
            /* programmatic or solid fallback in paint */
          }
        }
      }

      if (generation !== applyGenRef.current) return;

      try {
        petRef.current = await loadCachedPet(petUrl);
      } catch {
        if (generation !== applyGenRef.current) return;
        onError?.('Could not load your pet photo on the canvas.');
        setBusy(false);
        onReadyChange?.(false);
        return;
      }

      if (generation !== applyGenRef.current) return;

      for (const sticker of theme.stickers) {
        try {
          const img = await loadFirstImage(stickerCandidates(sticker.src));
          if (generation !== applyGenRef.current) return;
          stickerIdRef.current += 1;
          stickersRef.current.push(makeLayer(sticker, img, stickerIdRef.current));
        } catch {
          /* skip missing sticker */
        }
      }

      if (generation !== applyGenRef.current) return;

      syncPetTransformFromFit();
      setPetSelected(true);

      paintRef.current();
      notifyStickers();
      setBusy(false);
      onReadyChange?.(true);
    },
    [loadCachedPet, onReadyChange, onError, notifyStickers, syncPetTransformFromFit, setPetSelected]
  );

  useEffect(() => {
    if (!petImageUrl) {
      petCacheRef.current = null;
      petRef.current = null;
      bgRef.current = null;
      stickersRef.current = [];
      selectedIdRef.current = null;
      petSelectedRef.current = false;
      onPetSelectedChange?.(false);
      onReadyChange?.(false);
      onStickersChange?.([], null);
      paintRef.current();
      return;
    }
    void applyTheme(getTheme(themeId), petImageUrl);
    // Only re-apply when photo or theme changes — not when selection/paint updates.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [petImageUrl, themeId]);

  useEffect(() => {
    if (!petImageUrl || busy) return;
    if (petRef.current) syncPetTransformFromFit();
    paintRef.current();
  }, [frameId, frameWidth, cutoutApplied, petImageUrl, busy, syncPetTransformFromFit]);

  const addSticker = useCallback(
    async (placement: StickerPlacement) => {
      try {
        const img = await loadFirstImage(stickerCandidates(placement.src));
        stickerIdRef.current += 1;
        const { width: cw, height: ch } = dimsRef.current;
        const petRect = petRef.current
          ? petRectFromTransform(petTransformRef.current, petRef.current, cw, ch)
          : null;
        const resolved = smartStickerPlacement(placement, petRect, cw, ch);
        const layer = makeLayer(resolved, img, stickerIdRef.current);
        stickersRef.current.push(layer);
        setSelected(layer.id);
        paintRef.current();
      } catch {
        onError?.(`Missing sticker file: ${placement.src.split('/').pop()}`);
      }
    },
    [onError, setSelected]
  );

  const removeSelected = useCallback(() => {
    if (stickersRef.current.length === 0) return;
    const selectedId = selectedIdRef.current;
    if (selectedId !== null) {
      const idx = stickersRef.current.findIndex((s) => s.id === selectedId);
      if (idx >= 0) {
        removeStickerAt(idx);
        return;
      }
    }
    removeStickerAt(stickersRef.current.length - 1);
  }, [removeStickerAt]);

  const onCanvasDoubleClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas || busyRef.current) return;
      const pt = canvasPoint(canvas, e.clientX, e.clientY);
      const index = hitTestSticker(pt.x, pt.y);
      if (index !== null) {
        removeStickerAt(index);
        e.preventDefault();
      }
    },
    [hitTestSticker, removeStickerAt]
  );

  const nudgeSelected = useCallback((dx: number, dy: number) => {
    if (petSelectedRef.current) {
      petTransformRef.current.x = Math.min(
        1.15,
        Math.max(-0.15, petTransformRef.current.x + dx)
      );
      petTransformRef.current.y = Math.min(
        1.15,
        Math.max(-0.15, petTransformRef.current.y + dy)
      );
      paintRef.current();
      return;
    }
    const selectedId = selectedIdRef.current;
    if (selectedId === null) return;
    const layer = stickersRef.current.find((s) => s.id === selectedId);
    if (!layer) return;
    layer.x = Math.min(1.05, Math.max(-0.05, layer.x + dx));
    layer.y = Math.min(1.05, Math.max(-0.05, layer.y + dy));
    paintRef.current();
  }, []);

  const scaleSelected = useCallback((factor: number) => {
    if (petSelectedRef.current) {
      petTransformRef.current.scale = Math.min(
        PET_SCALE_MAX,
        Math.max(PET_SCALE_MIN, petTransformRef.current.scale * factor)
      );
      paintRef.current();
      return;
    }
    const selectedId = selectedIdRef.current;
    if (selectedId === null) return;
    const layer = stickersRef.current.find((s) => s.id === selectedId);
    if (!layer) return;
    layer.scale = Math.min(0.95, Math.max(0.06, layer.scale * factor));
    paintRef.current();
  }, []);

  const tiltSelected = useCallback((direction: -1 | 1) => {
    const selectedId = selectedIdRef.current;
    if (selectedId === null) return;
    const layer = stickersRef.current.find((s) => s.id === selectedId);
    if (!layer) return;
    layer.rotation = Math.min(
      TILT_MAX_RAD,
      Math.max(-TILT_MAX_RAD, layer.rotation + direction * TILT_STEP_RAD)
    );
    paintRef.current();
  }, []);

  const selectPet = useCallback(() => {
    if (!petRef.current) return;
    if (petSelectedRef.current) {
      setPetSelected(false);
    } else {
      setPetSelected(true);
    }
    paintRef.current();
  }, [setPetSelected]);

  const selectSticker = useCallback(
    (id: number) => {
      if (!stickersRef.current.some((s) => s.id === id)) return;
      if (selectedIdRef.current === id) {
        setSelected(null);
      } else {
        setSelected(id);
      }
      paintRef.current();
    },
    [setSelected]
  );

  const clearSelection = useCallback(() => {
    if (selectedIdRef.current === null && !petSelectedRef.current) return;
    setSelected(null);
    setPetSelected(false);
    paintRef.current();
  }, [setSelected, setPetSelected]);

  const listStickers = useCallback((): StickerListItem[] => {
    return stickersRef.current.map((s) => ({ id: s.id, label: s.placement.label }));
  }, []);

  const exportBlob = useCallback(async (): Promise<Blob | null> => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const hadStickerSelection = selectedIdRef.current !== null;
    const hadPetSelection = petSelectedRef.current;
    if (hadStickerSelection || hadPetSelection) {
      selectedIdRef.current = null;
      petSelectedRef.current = false;
      paintRef.current();
    }
    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((b) => resolve(b), 'image/png', 0.92);
    });
    if (hadStickerSelection || hadPetSelection) {
      notifyStickers();
      onPetSelectedChange?.(petSelectedRef.current);
    }
    return blob;
  }, [notifyStickers, onPetSelectedChange]);

  useImperativeHandle(
    ref,
    () => ({
      addSticker,
      removeSelected,
      nudgeSelected,
      tiltSelected,
      scaleSelected,
      selectSticker,
      selectPet,
      clearSelection,
      listStickers,
      exportBlob,
    }),
    [addSticker, removeSelected, nudgeSelected, tiltSelected, scaleSelected, selectSticker, selectPet, clearSelection, listStickers, exportBlob]
  );

  return (
    <div
      ref={wrapRef}
      className="photobooth-editor relative w-full select-none"
      onContextMenu={(e) => e.preventDefault()}
    >
      {busy && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-black/40 text-sm text-amber-300">
          Applying theme…
        </div>
      )}
      {!hideHint && (
        <p className="mb-2 text-center text-[11px] text-amber-300/80 leading-relaxed">
          Tap your pet to move · pinch or ± to zoom · double-tap accessories to remove
        </p>
      )}
      <canvas
        ref={canvasRef}
        className="w-full touch-none rounded-2xl border border-white/15 shadow-xl select-none"
        style={{ WebkitTouchCallout: 'none', WebkitUserSelect: 'none' }}
        onDoubleClick={onCanvasDoubleClick}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      />
    </div>
  );
});

export default PhotoBoothCanvas;
