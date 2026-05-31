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
} from '@/lib/photobooth/frames';

const WATERMARK = 'Made with Freedom Paws';
const PET_MAX_DIM = 640;
/** ~6° per tap */
const TILT_STEP_RAD = Math.PI / 30;
const TILT_MAX_RAD = Math.PI / 2;

export type StickerListItem = { id: number; label: string };

export type PhotoBoothCanvasHandle = {
  addSticker: (placement: StickerPlacement) => Promise<void>;
  removeSelected: () => void;
  nudgeSelected: (dx: number, dy: number) => void;
  tiltSelected: (direction: -1 | 1) => void;
  scaleSelected: (factor: number) => void;
  selectSticker: (id: number) => void;
  clearSelection: () => void;
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
  onReadyChange?: (ready: boolean) => void;
  onStickersChange?: (stickers: StickerListItem[], selectedId: number | null) => void;
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

function stickerBounds(layer: StickerLayer, cw: number, ch: number) {
  const { targetW, targetH } = stickerSize(layer, cw);
  const cx = cw * layer.x;
  const cy = ch * layer.y;
  const hw = targetW / 2;
  const hh = targetH / 2;
  const cos = Math.cos(layer.rotation);
  const sin = Math.sin(layer.rotation);
  const corners = [
    [-hw, -hh],
    [hw, -hh],
    [hw, hh],
    [-hw, hh],
  ].map(([x, y]) => ({
    x: cx + x * cos - y * sin,
    y: cy + x * sin + y * cos,
  }));
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
    onReadyChange,
    onStickersChange,
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
  const dragRef = useRef<{ index: number; grabDx: number; grabDy: number } | null>(null);
  const pinchRef = useRef<{ initialDistance: number; initialScale: number } | null>(null);
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

  const setSelected = useCallback(
    (id: number | null) => {
      selectedIdRef.current = id;
      notifyStickers();
    },
    [notifyStickers]
  );

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
    } else if (!usesPhotoBackground(activeThemeIdRef.current)) {
      drawThemeBackground(ctx, activeThemeIdRef.current, cw, ch);
    } else if (bgRef.current) {
      drawCover(ctx, bgRef.current, cw, ch);
    } else {
      ctx.fillStyle = '#0A1625';
      ctx.fillRect(0, 0, cw, ch);
    }

    let frameLayout: ReturnType<typeof computeFrameRects> | null = null;

    if (petRef.current) {
      const maxW = frameOnlyRef.current || accessoriesOnlyRef.current ? 0.82 : 0.88;
      const maxH = frameOnlyRef.current || accessoriesOnlyRef.current ? 0.85 : 0.9;
      const photo = computePetRect(petRef.current, cw, ch, maxW, maxH, 0.54);
      const styleId = frameIdRef.current;
      const widthNorm = frameWidthRef.current;

      // Cutout PNGs must composite directly on the theme — opaque mat/shadow reads as a black box.
      const floatCutout =
        cutoutAppliedRef.current && !frameOnlyRef.current && !accessoriesOnlyRef.current;
      const drawFrameBacking = styleId !== 'none' && !floatCutout;

      if (drawFrameBacking) {
        frameLayout = computeFrameRects(photo, widthNorm, cw, ch);
        drawFrameShadow(ctx, photo, frameLayout.framePx, frameLayout.matPx);
        drawFrameMat(ctx, frameLayout.mat);
      }

      ctx.drawImage(petRef.current, photo.left, photo.top, photo.width, photo.height);
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
      }
    }

    const floatCutout =
      cutoutAppliedRef.current && !frameOnlyRef.current && !accessoriesOnlyRef.current;
    if (frameLayout && frameIdRef.current !== 'none' && !floatCutout) {
      drawFrameBorder(ctx, frameLayout.outer, frameLayout.mat, frameIdRef.current);
    }

    if (showWatermark) {
      const fontSize = Math.max(10, cw * 0.028);
      ctx.font = `${fontSize}px system-ui, sans-serif`;
      ctx.fillStyle = 'rgba(255,255,255,0.55)';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'bottom';
      ctx.fillText(WATERMARK, cw - 8, ch - 8);
    }
  }, [showWatermark]);

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

  const beginDrag = useCallback(
    (clientX: number, clientY: number): boolean => {
      const canvas = canvasRef.current;
      if (!canvas || busyRef.current) return false;
      const pt = canvasPoint(canvas, clientX, clientY);
      const index = hitTestSticker(pt.x, pt.y);
      if (index === null) {
        setSelected(null);
        paintRef.current();
        return false;
      }
      const layer = stickersRef.current[index];
      const { width: cw, height: ch } = dimsRef.current;
      setSelected(layer.id);
      dragRef.current = {
        index,
        grabDx: pt.x - cw * layer.x,
        grabDy: pt.y - ch * layer.y,
      };
      paintRef.current();
      return true;
    },
    [hitTestSticker, setSelected]
  );

  const moveDrag = useCallback(
    (clientX: number, clientY: number) => {
      if (!dragRef.current) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const pt = canvasPoint(canvas, clientX, clientY);
      const { width: cw, height: ch } = dimsRef.current;
      const layer = stickersRef.current[dragRef.current.index];
      layer.x = Math.min(1.05, Math.max(-0.05, (pt.x - dragRef.current.grabDx) / cw));
      layer.y = Math.min(1.05, Math.max(-0.05, (pt.y - dragRef.current.grabDy) / ch));
      paintRef.current();
    },
    []
  );

  const endDrag = useCallback(() => {
    dragRef.current = null;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2 && selectedIdRef.current !== null) {
        const layer = stickersRef.current.find((s) => s.id === selectedIdRef.current);
        if (layer) {
          pinchRef.current = {
            initialDistance: touchDistance(e.touches[0], e.touches[1]),
            initialScale: layer.scale,
          };
          dragRef.current = null;
          e.preventDefault();
          return;
        }
      }
      pinchRef.current = null;
      const touch = e.touches[0];
      if (!touch) return;
      if (beginDrag(touch.clientX, touch.clientY)) {
        e.preventDefault();
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && pinchRef.current && selectedIdRef.current !== null) {
        const layer = stickersRef.current.find((s) => s.id === selectedIdRef.current);
        if (layer) {
          const dist = touchDistance(e.touches[0], e.touches[1]);
          const ratio = dist / pinchRef.current.initialDistance;
          layer.scale = Math.min(0.95, Math.max(0.06, pinchRef.current.initialScale * ratio));
          paintRef.current();
          e.preventDefault();
        }
        return;
      }
      if (!dragRef.current) return;
      const touch = e.touches[0];
      if (!touch) return;
      moveDrag(touch.clientX, touch.clientY);
      e.preventDefault();
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (e.touches.length < 2) pinchRef.current = null;
      if (e.touches.length === 0) endDrag();
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
  }, [beginDrag, moveDrag, endDrag]);

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (e.pointerType === 'touch') return;
      if (beginDrag(e.clientX, e.clientY)) {
        canvasRef.current?.setPointerCapture(e.pointerId);
        e.preventDefault();
      }
    },
    [beginDrag]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (e.pointerType === 'touch') return;
      if (!dragRef.current) return;
      moveDrag(e.clientX, e.clientY);
      e.preventDefault();
    },
    [moveDrag]
  );

  const onPointerUp = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    if (e.pointerType === 'touch') return;
    endDrag();
    canvasRef.current?.releasePointerCapture(e.pointerId);
  }, [endDrag]);

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

      paintRef.current();
      notifyStickers();
      setBusy(false);
      onReadyChange?.(true);
    },
    [loadCachedPet, onReadyChange, onError, notifyStickers]
  );

  useEffect(() => {
    if (!petImageUrl) {
      petCacheRef.current = null;
      petRef.current = null;
      bgRef.current = null;
      stickersRef.current = [];
      selectedIdRef.current = null;
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
    paintRef.current();
  }, [frameId, frameWidth, cutoutApplied, petImageUrl, busy]);

  const addSticker = useCallback(
    async (placement: StickerPlacement) => {
      try {
        const img = await loadFirstImage(stickerCandidates(placement.src));
        stickerIdRef.current += 1;
        const layer = makeLayer(placement, img, stickerIdRef.current);
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
        stickersRef.current.splice(idx, 1);
        setSelected(null);
        paintRef.current();
        return;
      }
    }
    stickersRef.current.pop();
    setSelected(null);
    paintRef.current();
  }, [setSelected]);

  const nudgeSelected = useCallback((dx: number, dy: number) => {
    const selectedId = selectedIdRef.current;
    if (selectedId === null) return;
    const layer = stickersRef.current.find((s) => s.id === selectedId);
    if (!layer) return;
    layer.x = Math.min(1.05, Math.max(-0.05, layer.x + dx));
    layer.y = Math.min(1.05, Math.max(-0.05, layer.y + dy));
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

  const scaleSelected = useCallback((factor: number) => {
    const selectedId = selectedIdRef.current;
    if (selectedId === null) return;
    const layer = stickersRef.current.find((s) => s.id === selectedId);
    if (!layer) return;
    layer.scale = Math.min(0.95, Math.max(0.06, layer.scale * factor));
    paintRef.current();
  }, []);

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
    if (selectedIdRef.current === null) return;
    setSelected(null);
    paintRef.current();
  }, [setSelected]);

  const listStickers = useCallback((): StickerListItem[] => {
    return stickersRef.current.map((s) => ({ id: s.id, label: s.placement.label }));
  }, []);

  const exportBlob = useCallback(async (): Promise<Blob | null> => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const hadSelection = selectedIdRef.current !== null;
    if (hadSelection) {
      selectedIdRef.current = null;
      paintRef.current();
    }
    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((b) => resolve(b), 'image/png', 0.92);
    });
    if (hadSelection) {
      notifyStickers();
    }
    return blob;
  }, [notifyStickers]);

  useImperativeHandle(
    ref,
    () => ({
      addSticker,
      removeSelected,
      nudgeSelected,
      tiltSelected,
      scaleSelected,
      selectSticker,
      clearSelection,
      listStickers,
      exportBlob,
    }),
    [addSticker, removeSelected, nudgeSelected, tiltSelected, scaleSelected, selectSticker, clearSelection, listStickers, exportBlob]
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
      <p className="mb-2 text-center text-[11px] text-amber-300/80">
        Select a sticker · move with arrows · tilt ↺ ↻
      </p>
      <canvas
        ref={canvasRef}
        className="w-full touch-none rounded-2xl border border-white/15 shadow-xl select-none"
        style={{ WebkitTouchCallout: 'none', WebkitUserSelect: 'none' }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      />
    </div>
  );
});

export default PhotoBoothCanvas;
