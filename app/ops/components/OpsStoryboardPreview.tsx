'use client';

import { useEffect, useRef, useState } from 'react';
import { removePetBackground } from '@/lib/photobooth/remove-background';
import {
  backgroundById,
  STUDIO_BACKGROUNDS,
  STUDIO_MOTIONS,
  type StoryboardFields,
} from '@/lib/ops/studio-plates';

let cutoutTask: Promise<string> | null = null;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('The preview picture did not load.'));
    image.src = src;
  });
}

function loadCutout(): Promise<string> {
  if (!cutoutTask) {
    cutoutTask = (async () => {
      const res = await fetch('/api/ops/desk/still');
      if (!res.ok) throw new Error('The locked SuperBud still did not load.');
      const blob = await res.blob();
      const cut = await removePetBackground(blob);
      return URL.createObjectURL(cut);
    })().catch((error) => {
      cutoutTask = null;
      throw error;
    });
  }
  return cutoutTask;
}

function cover(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  width: number,
  height: number
) {
  const scale = Math.max(width / image.width, height / image.height);
  const w = image.width * scale;
  const h = image.height * scale;
  ctx.drawImage(image, (width - w) / 2, (height - h) / 2, w, h);
}

function contain(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  width: number,
  height: number
) {
  const scale = Math.min(width / image.width, height / image.height) * 0.92;
  const w = image.width * scale;
  const h = image.height * scale;
  ctx.drawImage(image, (width - w) / 2, (height - h) / 2 + 24, w, h);
}

function bar(
  ctx: CanvasRenderingContext2D,
  text: string,
  y: number,
  width: number,
  fill: string
) {
  ctx.fillStyle = 'rgba(10,20,40,0.78)';
  ctx.fillRect(12, y, width - 24, 64);
  ctx.fillStyle = fill;
  ctx.font = '700 13px sans-serif';
  const words = text.split(/\s+/);
  let line = '';
  let lineY = y + 26;
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width > width - 48) {
      ctx.fillText(line, 22, lineY);
      line = word;
      lineY += 18;
      if (lineY > y + 52) break;
    } else {
      line = next;
    }
  }
  if (line && lineY <= y + 56) ctx.fillText(line, 22, lineY);
}

type Props = {
  script: string;
  onScreenText: string;
  backgroundId: string;
  motionId: string;
  mode: 'preview' | 'edit';
  onChange?: (patch: Partial<StoryboardFields>) => void;
};

export default function OpsStoryboardPreview({
  script,
  onScreenText,
  backgroundId,
  motionId,
  mode,
  onChange,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState<string | null>(null);
  const plate = backgroundById(backgroundId);
  const motion = STUDIO_MOTIONS.find((item) => item.id === motionId) ?? STUDIO_MOTIONS[0];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const surface = canvas;
    let cancel = false;
    const chosen = backgroundById(backgroundId);

    async function paint() {
      const ctx = surface.getContext('2d');
      if (!ctx) return;
      if (chosen.kind !== 'locked') {
        setStatus('Cutting SuperBud off the sky. The first preview loads a model.');
      }
      ctx.fillStyle = chosen.color;
      ctx.fillRect(0, 0, surface.width, surface.height);
      if (chosen.kind === 'image' && chosen.path) {
        const backdrop = await loadImage(chosen.path);
        if (cancel) return;
        cover(ctx, backdrop, surface.width, surface.height);
      }
      const stillSrc = chosen.kind === 'locked' ? '/api/ops/desk/still' : await loadCutout();
      if (cancel) return;
      const still = await loadImage(stillSrc);
      if (cancel) return;
      if (chosen.kind === 'locked') cover(ctx, still, surface.width, surface.height);
      else contain(ctx, still, surface.width, surface.height);
      if (onScreenText.trim()) bar(ctx, onScreenText.trim(), 16, surface.width, '#F5C242');
      const caption = script.replace(/\s+/g, ' ').trim().slice(0, 140);
      if (caption) bar(ctx, caption, surface.height - 80, surface.width, '#FFFFFF');
      if (!cancel) setStatus(null);
    }

    void paint().catch((error) => {
      if (!cancel) setStatus(error instanceof Error ? error.message : 'Preview failed');
    });
    return () => {
      cancel = true;
    };
  }, [backgroundId, onScreenText, script]);

  return (
    <div className="mt-3 grid gap-3 sm:grid-cols-[200px_1fr]">
      <div>
        <canvas
          ref={canvasRef}
          width={200}
          height={356}
          className="w-full rounded-xl border border-white/10 bg-[#0A1428]"
        />
        {status ? <p className="mt-2 text-[11px] text-amber-200">{status}</p> : null}
      </div>
      <div className="space-y-2 text-xs text-white/70">
        <p>
          <span className="text-white/40">Plate. </span>
          {plate.label}
        </p>
        <p>
          <span className="text-white/40">Movement. </span>
          {motion.label}
        </p>
        <p>
          {plate.kind === 'locked'
            ? 'Spoken captions are burned on the finished video. This choice keeps the sky already in the photo, so the title stays on the preview.'
            : 'HeyGen cuts SuperBud off the sky, places him on this plate, prints the title, and burns the spoken captions.'}
        </p>
        {mode === 'preview' ? (
          <>
            <p>
              <span className="text-white/40">Title. </span>
              {onScreenText || 'None'}
            </p>
            <p className="whitespace-pre-wrap">
              <span className="text-white/40">Script. </span>
              {script}
            </p>
          </>
        ) : (
          <>
            <label className="block">
              <span className="text-white/40">On-screen title</span>
              <textarea
                className="mt-1 w-full rounded-xl border border-white/15 bg-[#0A1428] px-3 py-2 text-sm text-white"
                rows={2}
                maxLength={80}
                value={onScreenText}
                onChange={(e) => onChange?.({ onScreenText: e.target.value })}
              />
            </label>
            <label className="block">
              <span className="text-white/40">Spoken script</span>
              <textarea
                className="mt-1 w-full rounded-xl border border-white/15 bg-[#0A1428] px-3 py-2 text-sm text-white"
                rows={5}
                value={script}
                onChange={(e) => onChange?.({ script: e.target.value })}
              />
            </label>
            <div className="flex flex-wrap gap-1">
              {STUDIO_BACKGROUNDS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onChange?.({ backgroundId: item.id })}
                  className={`rounded-full border px-2 py-1 text-[11px] font-bold ${
                    item.id === backgroundId
                      ? 'border-[#F5C242] bg-[#F5C242] text-[#0A1428]'
                      : 'border-white/20 text-white/80'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-1">
              {STUDIO_MOTIONS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onChange?.({ motionId: item.id })}
                  className={`rounded-full border px-2 py-1 text-[11px] font-bold ${
                    item.id === motionId
                      ? 'border-[#F5C242] bg-[#F5C242] text-[#0A1428]'
                      : 'border-white/20 text-white/80'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
