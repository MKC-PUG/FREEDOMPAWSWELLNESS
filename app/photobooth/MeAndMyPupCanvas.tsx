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
  DEFAULT_SLOT_TRANSFORM,
  drawMeAndMyPupFrame,
  getSlotLayout,
  hitTestSlot,
  ME_AND_MY_PUP_LOGO_URL,
  type MeAndMyPupVariant,
  type MeAndMyPupCustomBackgroundId,
  type MeAndMyPupFrameColorId,
  type SlotId,
  type SlotTransform,
  variantBackgroundUrls,
  variantUsesLogo,
} from '@/lib/photobooth/me-and-my-pup';

const PAN_MAX = 1.2;
const SCALE_MIN = 0.5;
const SCALE_MAX = 2.2;

export type MeAndMyPupCanvasHandle = {
  nudgeSelected: (dx: number, dy: number) => void;
  scaleSelected: (factor: number) => void;
  selectSlot: (slot: SlotId) => void;
  clearSelection: () => void;
  exportBlob: () => Promise<Blob | null>;
};

type Props = {
  petImageUrl: string;
  ownerImageUrl: string | null;
  variant: MeAndMyPupVariant;
  customHeadline?: string;
  frameColorId?: MeAndMyPupFrameColorId;
  customBackgroundId?: MeAndMyPupCustomBackgroundId;
  customHeadlineOffsetY?: number;
  onReadyChange?: (ready: boolean) => void;
  onSlotSelectedChange?: (slot: SlotId | null) => void;
  onError?: (message: string) => void;
};

type InteractionMode = {
  kind: 'pan';
  slot: SlotId;
  /** Pointer offset from panned image center at touch start */
  grabDx: number;
  grabDy: number;
};

function canvasSize(containerWidth: number) {
  const width = Math.min(Math.max(containerWidth, 280), 640);
  const height = Math.round(width * 0.75);
  return { width, height };
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
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

function touchDistance(t1: Touch, t2: Touch) {
  return Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
}

function canvasPoint(canvas: HTMLCanvasElement, clientX: number, clientY: number) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (clientX - rect.left) * (canvas.width / rect.width),
    y: (clientY - rect.top) * (canvas.height / rect.height),
  };
}

const MeAndMyPupCanvas = forwardRef<MeAndMyPupCanvasHandle, Props>(function MeAndMyPupCanvas(
  {
    petImageUrl,
    ownerImageUrl,
    variant,
    customHeadline = '',
    frameColorId = 'navy',
    customBackgroundId = 'navy',
    customHeadlineOffsetY = 0,
    onReadyChange,
    onSlotSelectedChange,
    onError,
  },
  ref
) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dogRef = useRef<HTMLImageElement | null>(null);
  const ownerRef = useRef<HTMLImageElement | null>(null);
  const bgRef = useRef<HTMLImageElement | null>(null);
  const logoRef = useRef<HTMLImageElement | null>(null);
  const dogTransformRef = useRef<SlotTransform>({ ...DEFAULT_SLOT_TRANSFORM });
  const ownerTransformRef = useRef<SlotTransform>({ ...DEFAULT_SLOT_TRANSFORM });
  const selectedSlotRef = useRef<SlotId | null>('dog');
  const interactionRef = useRef<InteractionMode | null>(null);
  const pinchRef = useRef<{ initialDistance: number; initialScale: number; slot: SlotId } | null>(
    null
  );
  const dimsRef = useRef({ width: 360, height: 270 });
  const variantRef = useRef(variant);
  const customHeadlineRef = useRef(customHeadline);
  const frameColorIdRef = useRef(frameColorId);
  const customBackgroundIdRef = useRef(customBackgroundId);
  const customHeadlineOffsetYRef = useRef(customHeadlineOffsetY);
  const loadGenRef = useRef(0);
  const [busy, setBusy] = useState(true);

  variantRef.current = variant;
  customHeadlineRef.current = customHeadline;
  frameColorIdRef.current = frameColorId;
  customBackgroundIdRef.current = customBackgroundId;
  customHeadlineOffsetYRef.current = customHeadlineOffsetY;

  const getTransform = (slot: SlotId) =>
    slot === 'dog' ? dogTransformRef.current : ownerTransformRef.current;

  const setSelected = useCallback(
    (slot: SlotId | null) => {
      selectedSlotRef.current = slot;
      onSlotSelectedChange?.(slot);
    },
    [onSlotSelectedChange]
  );

  const paint = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { width: cw, height: ch } = dimsRef.current;
    canvas.width = cw;
    canvas.height = ch;

    drawMeAndMyPupFrame({
      ctx,
      cw,
      ch,
      variant: variantRef.current,
      photoBg: bgRef.current,
      logoImg: logoRef.current,
      customHeadline: customHeadlineRef.current,
      frameColorId: frameColorIdRef.current,
      customBackgroundId: customBackgroundIdRef.current,
      customHeadlineOffsetY: customHeadlineOffsetYRef.current,
      dogImg: dogRef.current,
      ownerImg: ownerRef.current,
      dogTransform: dogTransformRef.current,
      ownerTransform: ownerTransformRef.current,
      selectedSlot: selectedSlotRef.current,
      showWatermark: true,
    });
  }, []);

  const paintRef = useRef(paint);
  paintRef.current = paint;

  const loadAssets = useCallback(async () => {
    const gen = ++loadGenRef.current;
    setBusy(true);
    onReadyChange?.(false);
    try {
      const dog = await loadImage(petImageUrl);
      if (gen !== loadGenRef.current) return;
      dogRef.current = dog;
      ownerRef.current = ownerImageUrl ? await loadImage(ownerImageUrl) : null;
      if (gen !== loadGenRef.current) return;

      logoRef.current = null;
      if (variantUsesLogo(variantRef.current)) {
        try {
          logoRef.current = await loadImage(ME_AND_MY_PUP_LOGO_URL);
        } catch {
          /* logo optional */
        }
      }
      if (gen !== loadGenRef.current) return;

      bgRef.current = null;
      for (const url of variantBackgroundUrls(
        variantRef.current,
        customBackgroundIdRef.current
      )) {
        try {
          bgRef.current = await loadImage(url);
          break;
        } catch {
          /* try next */
        }
      }
      if (gen !== loadGenRef.current) return;

      dogTransformRef.current = { ...DEFAULT_SLOT_TRANSFORM };
      ownerTransformRef.current = { ...DEFAULT_SLOT_TRANSFORM };
      selectedSlotRef.current = 'dog';
      onSlotSelectedChange?.('dog');
      paintRef.current();
      setBusy(false);
      onReadyChange?.(true);
    } catch {
      if (gen !== loadGenRef.current) return;
      onError?.('Could not load photos for Me & My Pup frame.');
      setBusy(false);
      onReadyChange?.(false);
    }
  }, [petImageUrl, ownerImageUrl, onReadyChange, onError, onSlotSelectedChange]);

  useEffect(() => {
    void loadAssets();
  }, [loadAssets]);

  useEffect(() => {
    if (busy) return;
    let cancelled = false;
    const reloadBg = async () => {
      bgRef.current = null;
      for (const url of variantBackgroundUrls(variant, customBackgroundId)) {
        try {
          bgRef.current = await loadImage(url);
          break;
        } catch {
          /* try next */
        }
      }
      if (variantUsesLogo(variant)) {
        try {
          logoRef.current = await loadImage(ME_AND_MY_PUP_LOGO_URL);
        } catch {
          logoRef.current = null;
        }
      } else {
        logoRef.current = null;
      }
      if (!cancelled) paintRef.current();
    };
    void reloadBg();
    return () => {
      cancelled = true;
    };
  }, [variant, customBackgroundId, busy]);

  useEffect(() => {
    if (!busy) paintRef.current();
  }, [customHeadline, frameColorId, customHeadlineOffsetY, busy]);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const sync = () => {
      dimsRef.current = canvasSize(wrap.clientWidth);
      paintRef.current();
    };
    const ro = new ResizeObserver(sync);
    ro.observe(wrap);
    sync();
    return () => ro.disconnect();
  }, []);

  const beginInteraction = useCallback(
    (clientX: number, clientY: number): boolean => {
      const canvas = canvasRef.current;
      if (!canvas || busy) return false;
      const pt = canvasPoint(canvas, clientX, clientY);
      const { width: cw, height: ch } = dimsRef.current;
      const slot = hitTestSlot(pt.x, pt.y, cw, ch, variantRef.current);
      if (!slot) {
        setSelected(null);
        paintRef.current();
        return false;
      }
      setSelected(slot);
      const layout = getSlotLayout(cw, ch, variantRef.current)[slot];
      const t = getTransform(slot);
      const imgCx = layout.cx + t.panX * layout.radius;
      const imgCy = layout.cy + t.panY * layout.radius;
      interactionRef.current = {
        kind: 'pan',
        slot,
        grabDx: pt.x - imgCx,
        grabDy: pt.y - imgCy,
      };
      paintRef.current();
      return true;
    },
    [busy, setSelected]
  );

  const moveInteraction = useCallback((clientX: number, clientY: number) => {
    const mode = interactionRef.current;
    if (!mode) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const pt = canvasPoint(canvas, clientX, clientY);
    const { width: cw, height: ch } = dimsRef.current;
    const layout = getSlotLayout(cw, ch, variantRef.current)[mode.slot];
    const t = getTransform(mode.slot);
    t.panX = Math.min(
      PAN_MAX,
      Math.max(-PAN_MAX, (pt.x - mode.grabDx - layout.cx) / layout.radius)
    );
    t.panY = Math.min(
      PAN_MAX,
      Math.max(-PAN_MAX, (pt.y - mode.grabDy - layout.cy) / layout.radius)
    );
    paintRef.current();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2 && selectedSlotRef.current) {
        const slot = selectedSlotRef.current;
        const t = getTransform(slot);
        pinchRef.current = {
          initialDistance: touchDistance(e.touches[0], e.touches[1]),
          initialScale: t.scale,
          slot,
        };
        interactionRef.current = null;
        e.preventDefault();
        return;
      }
      pinchRef.current = null;
      const touch = e.touches[0];
      if (!touch) return;
      if (beginInteraction(touch.clientX, touch.clientY)) e.preventDefault();
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && pinchRef.current) {
        const t = getTransform(pinchRef.current.slot);
        const dist = touchDistance(e.touches[0], e.touches[1]);
        const ratio = dist / pinchRef.current.initialDistance;
        t.scale = Math.min(SCALE_MAX, Math.max(SCALE_MIN, pinchRef.current.initialScale * ratio));
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
      if (e.touches.length === 0) interactionRef.current = null;
    };

    canvas.addEventListener('touchstart', onTouchStart, { passive: false });
    canvas.addEventListener('touchmove', onTouchMove, { passive: false });
    canvas.addEventListener('touchend', onTouchEnd, { passive: false });
    canvas.addEventListener('touchcancel', onTouchEnd, { passive: false });

    return () => {
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchmove', onTouchMove);
      canvas.removeEventListener('touchend', onTouchEnd);
      canvas.removeEventListener('touchcancel', onTouchEnd);
    };
  }, [beginInteraction, moveInteraction]);

  const nudgeSelected = useCallback((dx: number, dy: number) => {
    const slot = selectedSlotRef.current;
    if (!slot) return;
    const t = getTransform(slot);
    t.panX = Math.min(PAN_MAX, Math.max(-PAN_MAX, t.panX + dx));
    t.panY = Math.min(PAN_MAX, Math.max(-PAN_MAX, t.panY + dy));
    paintRef.current();
  }, []);

  const scaleSelected = useCallback((factor: number) => {
    const slot = selectedSlotRef.current;
    if (!slot) return;
    const t = getTransform(slot);
    t.scale = Math.min(SCALE_MAX, Math.max(SCALE_MIN, t.scale * factor));
    paintRef.current();
  }, []);

  const selectSlot = useCallback(
    (slot: SlotId) => {
      setSelected(slot);
      paintRef.current();
    },
    [setSelected]
  );

  const clearSelection = useCallback(() => {
    setSelected(null);
    paintRef.current();
  }, [setSelected]);

  const exportBlob = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const prev = selectedSlotRef.current;
    selectedSlotRef.current = null;
    paintRef.current();
    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((b) => resolve(b), 'image/png', 0.92);
    });
    selectedSlotRef.current = prev;
    paintRef.current();
    return blob;
  }, []);

  useImperativeHandle(
    ref,
    () => ({ nudgeSelected, scaleSelected, selectSlot, clearSelection, exportBlob }),
    [nudgeSelected, scaleSelected, selectSlot, clearSelection, exportBlob]
  );

  return (
    <div ref={wrapRef} className="photobooth-editor relative w-full select-none">
      {busy && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-black/40 text-sm text-amber-300">
          Building your frame…
        </div>
      )}
      <p className="mb-2 text-center text-[11px] text-amber-300/80 leading-relaxed">
        Tap <strong className="text-amber-200">MY PUP</strong> or{' '}
        <strong className="text-amber-200">ME</strong> · drag to pan · pinch or ± to zoom
      </p>
      <canvas
        ref={canvasRef}
        className="w-full touch-none rounded-2xl border border-amber-400/30 shadow-xl"
        style={{ WebkitTouchCallout: 'none' }}
      />
    </div>
  );
});

export default MeAndMyPupCanvas;
