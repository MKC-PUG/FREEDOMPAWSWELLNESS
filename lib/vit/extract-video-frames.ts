/** Extract JPEG frames from a short dog video (browser-only, for ViT Phase 2b). */

export type VideoFrameExtraction = {
  frames: File[];
  durationSec: number;
  posterDataUrl: string;
};

const DEFAULT_MAX_FRAMES = 5;
const DEFAULT_MAX_DURATION_SEC = 15;
const DEFAULT_MAX_WIDTH = 1280;
const JPEG_QUALITY = 0.82;

function loadVideoMetadata(url: string): Promise<HTMLVideoElement> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;
    video.onloadedmetadata = () => resolve(video);
    video.onerror = () => reject(new Error('Could not read video file'));
    video.src = url;
  });
}

function seekVideo(video: HTMLVideoElement, timeSec: number): Promise<void> {
  return new Promise((resolve, reject) => {
    const timeout = window.setTimeout(() => {
      video.removeEventListener('seeked', onSeeked);
      reject(new Error('Video seek timed out'));
    }, 8000);
    const onSeeked = () => {
      window.clearTimeout(timeout);
      video.removeEventListener('seeked', onSeeked);
      resolve();
    };
    video.addEventListener('seeked', onSeeked);
    video.currentTime = Math.min(timeSec, Math.max(0, video.duration - 0.05));
  });
}

function frameToJpegFile(
  video: HTMLVideoElement,
  index: number,
  maxWidth: number
): { file: File; dataUrl: string } | null {
  const scale = Math.min(1, maxWidth / Math.max(video.videoWidth, 1));
  const w = Math.max(1, Math.round(video.videoWidth * scale));
  const h = Math.max(1, Math.round(video.videoHeight * scale));
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  ctx.drawImage(video, 0, 0, w, h);
  const dataUrl = canvas.toDataURL('image/jpeg', JPEG_QUALITY);
  const base64 = dataUrl.split(',')[1] ?? '';
  const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  return {
    file: new File([bytes], `vit-frame-${index + 1}.jpg`, { type: 'image/jpeg' }),
    dataUrl,
  };
}

/**
 * Sample evenly spaced frames from a short clip (max 15s, 5 frames).
 */
export async function extractVideoFrames(
  file: File,
  options?: {
    maxFrames?: number;
    maxDurationSec?: number;
    maxWidth?: number;
  }
): Promise<VideoFrameExtraction> {
  const maxFrames = options?.maxFrames ?? DEFAULT_MAX_FRAMES;
  const maxDurationSec = options?.maxDurationSec ?? DEFAULT_MAX_DURATION_SEC;
  const maxWidth = options?.maxWidth ?? DEFAULT_MAX_WIDTH;

  const url = URL.createObjectURL(file);
  try {
    const video = await loadVideoMetadata(url);
    const duration = Number.isFinite(video.duration) ? video.duration : 0;
    if (duration <= 0) {
      throw new Error('Video has no playable duration');
    }
    if (duration > maxDurationSec + 0.5) {
      throw new Error(`Please use a video ${maxDurationSec} seconds or shorter`);
    }

    const count = Math.min(maxFrames, Math.max(3, Math.ceil(duration)));
    const times: number[] = [];
    for (let i = 0; i < count; i += 1) {
      times.push(count === 1 ? duration * 0.5 : (duration * (i + 0.5)) / count);
    }

    const frames: File[] = [];
    let posterDataUrl = '';
    for (let i = 0; i < times.length; i += 1) {
      await seekVideo(video, times[i]!);
      const captured = frameToJpegFile(video, i, maxWidth);
      if (captured) {
        frames.push(captured.file);
        if (!posterDataUrl || i === Math.floor(times.length / 2)) {
          posterDataUrl = captured.dataUrl;
        }
      }
    }

    if (frames.length === 0) {
      throw new Error('Could not extract frames from video');
    }

    return {
      frames,
      durationSec: duration,
      posterDataUrl,
    };
  } finally {
    URL.revokeObjectURL(url);
  }
}

/**
 * Prefer mid-stride frames from a gait clip (middle 60% of the timeline).
 * Assumes frames were sampled evenly across duration.
 */
export function selectGaitFrames(frames: File[], maxFrames = 5): File[] {
  if (frames.length <= maxFrames) return frames;

  const start = Math.floor(frames.length * 0.2);
  const end = Math.ceil(frames.length * 0.8);
  const pool = frames.slice(start, end);
  if (pool.length <= maxFrames) return pool;

  const selected: File[] = [];
  const step = pool.length / maxFrames;
  for (let i = 0; i < maxFrames; i += 1) {
    selected.push(pool[Math.min(pool.length - 1, Math.floor(i * step + step / 2))]!);
  }
  return selected;
}

export function isValidVitVideoFile(file: File): boolean {
  const type = file.type.toLowerCase();
  const name = file.name.toLowerCase();
  const video =
    type.startsWith('video/') ||
    /\.(mp4|mov|m4v|webm|quicktime)$/i.test(name);
  return video && file.size > 0 && file.size < 25 * 1024 * 1024;
}
