/**
 * Client-side media quality gate for ViT Diagnostics (runs before analyze).
 */

import { selectGaitFrames } from '@/lib/vit/extract-video-frames';

export type VitQualityStatus = 'pass' | 'warn' | 'fail';

export type VitMediaQuality = {
  status: VitQualityStatus;
  score: number;
  issues: string[];
  suggestions: string[];
  /** False when status is fail — blocks Get AI Recommendation */
  canAnalyze: boolean;
};

const MIN_EDGE_PX = 320;
const MIN_EDGE_HARD_FAIL = 180;
const PASS_SCORE = 70;
const WARN_SCORE = 55;
const DARK_LUMINANCE = 42;

const EYES_MIN_EDGE = 400;
const EYES_MIN_EDGE_HARD_FAIL = 260;
const EYES_PASS_SCORE = 72;

const FACE_MIN_EDGE = 480;
const FACE_MIN_EDGE_HARD_FAIL = 240;
const FACE_PASS_SCORE = 70;

const GAIT_MIN_EDGE = 360;
const GAIT_MIN_EDGE_HARD_FAIL = 200;
const GAIT_PASS_SCORE = 65;
const GAIT_WARN_SCORE = 50;

type RegionGateOptions = {
  minEdge: number;
  minEdgeHardFail: number;
  passScore?: number;
  warnScore?: number;
  darkLuminance?: number;
};

type ImageMetrics = {
  width: number;
  height: number;
  luminance: number;
};

function loadImageMetrics(file: File): Promise<ImageMetrics | null> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const w = img.width;
      const h = img.height;
      const sampleW = Math.min(64, w);
      const sampleH = Math.min(64, h);
      canvas.width = sampleW;
      canvas.height = sampleH;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        URL.revokeObjectURL(url);
        resolve({ width: w, height: h, luminance: 128 });
        return;
      }
      ctx.drawImage(img, 0, 0, sampleW, sampleH);
      const data = ctx.getImageData(0, 0, sampleW, sampleH).data;
      let sum = 0;
      const pixels = data.length / 4;
      for (let i = 0; i < data.length; i += 4) {
        sum += 0.299 * data[i]! + 0.587 * data[i + 1]! + 0.114 * data[i + 2]!;
      }
      URL.revokeObjectURL(url);
      resolve({ width: w, height: h, luminance: sum / pixels });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(null);
    };
    img.src = url;
  });
}

function scorePhotoMetrics(
  metrics: ImageMetrics | null,
  file: File,
  region?: RegionGateOptions
): VitMediaQuality {
  const minEdgePx = region?.minEdge ?? MIN_EDGE_PX;
  const minEdgeHardFail = region?.minEdgeHardFail ?? MIN_EDGE_HARD_FAIL;
  const passScore = region?.passScore ?? PASS_SCORE;
  const warnScore = region?.warnScore ?? WARN_SCORE;
  const darkLuminance = region?.darkLuminance ?? DARK_LUMINANCE;
  const issues: string[] = [];
  const suggestions: string[] = [];
  let score = 100;

  if (file.size > 12 * 1024 * 1024) {
    issues.push('File is very large');
    score -= 15;
    suggestions.push('Use a photo under 12MB or let us compress automatically');
  }

  if (!metrics) {
    return {
      status: 'fail',
      score: 30,
      issues: ['Could not read image'],
      suggestions: ['Try another photo (JPG or PNG) with the dog clearly visible'],
      canAnalyze: false,
    };
  }

  const shortEdge = Math.min(metrics.width, metrics.height);
  if (shortEdge < minEdgeHardFail) {
    issues.push('Resolution is too low for AI vision');
    score -= 45;
    suggestions.push(`Move closer or use a higher-resolution photo (at least ${minEdgePx}px)`);
  } else if (shortEdge < minEdgePx) {
    issues.push('Resolution is a bit low');
    score -= 22;
    suggestions.push('A sharper, closer photo helps our AI see coat, eyes, and posture');
  }

  if (metrics.luminance < darkLuminance) {
    issues.push('Image appears very dark');
    score -= 28;
    suggestions.push('Retake in brighter light or turn on flash');
  } else if (metrics.luminance < 58) {
    issues.push('Lighting is dim');
    score -= 12;
    suggestions.push('Brighter lighting improves visual analysis');
  }

  score = Math.max(0, Math.min(100, score));

  let status: VitQualityStatus = 'pass';
  if (score < warnScore || shortEdge < minEdgeHardFail) {
    status = 'fail';
  } else if (score < passScore) {
    status = 'warn';
  }

  return {
    status,
    score,
    issues,
    suggestions,
    canAnalyze: status !== 'fail',
  };
}

/** Assess a single photo before ViT analyze. */
export async function assessPhotoForVit(file: File): Promise<VitMediaQuality> {
  const metrics = await loadImageMetrics(file);
  return scorePhotoMetrics(metrics, file);
}

/** Eyes region — close-up, catchlights; stricter resolution. */
export async function gateEyes(file: File): Promise<VitMediaQuality> {
  const metrics = await loadImageMetrics(file);
  const result = scorePhotoMetrics(metrics, file, {
    minEdge: EYES_MIN_EDGE,
    minEdgeHardFail: EYES_MIN_EDGE_HARD_FAIL,
    passScore: EYES_PASS_SCORE,
    darkLuminance: 48,
  });
  if (result.status !== 'fail' && metrics && metrics.luminance < 52) {
    return {
      ...result,
      suggestions: [
        ...result.suggestions,
        'For dark-coated dogs, use bright room light or flash so catchlights show on the eyes',
      ],
    };
  }
  return result;
}

/** Face region — muzzle and markings; higher min resolution. */
export async function gateFace(file: File): Promise<VitMediaQuality> {
  const metrics = await loadImageMetrics(file);
  return scorePhotoMetrics(metrics, file, {
    minEdge: FACE_MIN_EDGE,
    minEdgeHardFail: FACE_MIN_EDGE_HARD_FAIL,
    passScore: FACE_PASS_SCORE,
  });
}

/** Gait region — video frames; tolerates motion blur, prefers mid-stride samples. */
export async function gateGait(frames: File[]): Promise<VitMediaQuality> {
  if (frames.length === 0) {
    return {
      status: 'fail',
      score: 0,
      issues: ['No video frames captured'],
      suggestions: ['Record 3–8 seconds with the dog walking in frame'],
      canAnalyze: false,
    };
  }

  const gaitFrames = selectGaitFrames(frames);
  const sampleIndexes = [
    0,
    Math.floor(gaitFrames.length / 2),
    gaitFrames.length - 1,
  ].filter((v, i, a) => a.indexOf(v) === i);

  const results: VitMediaQuality[] = [];
  for (const idx of sampleIndexes) {
    const metrics = await loadImageMetrics(gaitFrames[idx]!);
    results.push(
      scorePhotoMetrics(metrics, gaitFrames[idx]!, {
        minEdge: GAIT_MIN_EDGE,
        minEdgeHardFail: GAIT_MIN_EDGE_HARD_FAIL,
        passScore: GAIT_PASS_SCORE,
        warnScore: GAIT_WARN_SCORE,
      })
    );
  }

  const worst = results.reduce((a, b) => (a.score <= b.score ? a : b));
  const avgScore = Math.round(
    results.reduce((sum, r) => sum + r.score, 0) / results.length
  );

  const issues = [...new Set(results.flatMap((r) => r.issues))];
  const suggestions = [
    ...new Set([
      ...results.flatMap((r) => r.suggestions),
      'Film the dog walking toward or across the camera for 3–8 seconds',
    ]),
  ];

  let status: VitQualityStatus = 'pass';
  if (worst.status === 'fail' || avgScore < GAIT_WARN_SCORE) {
    status = 'fail';
  } else if (worst.status === 'warn' || avgScore < GAIT_PASS_SCORE) {
    status = 'warn';
  }

  return {
    status,
    score: avgScore,
    issues,
    suggestions,
    canAnalyze: status !== 'fail',
  };
}

/** Assess extracted video frames — wellness video (general). */
export async function assessVideoFramesForVit(frames: File[]): Promise<VitMediaQuality> {
  if (frames.length === 0) {
    return {
      status: 'fail',
      score: 0,
      issues: ['No video frames captured'],
      suggestions: ['Try a shorter clip (10–15 sec) with the dog in frame'],
      canAnalyze: false,
    };
  }

  const sampleIndexes = [
    0,
    Math.floor(frames.length / 2),
    frames.length - 1,
  ].filter((v, i, a) => a.indexOf(v) === i);

  const results: VitMediaQuality[] = [];
  for (const idx of sampleIndexes) {
    results.push(await assessPhotoForVit(frames[idx]!));
  }

  const worst = results.reduce((a, b) => (a.score <= b.score ? a : b));
  const avgScore = Math.round(
    results.reduce((sum, r) => sum + r.score, 0) / results.length
  );

  const issues = [...new Set(results.flatMap((r) => r.issues))];
  const suggestions = [...new Set(results.flatMap((r) => r.suggestions))];

  let status: VitQualityStatus = 'pass';
  if (worst.status === 'fail' || avgScore < WARN_SCORE) {
    status = 'fail';
  } else if (worst.status === 'warn' || avgScore < PASS_SCORE) {
    status = 'warn';
  }

  return {
    status,
    score: avgScore,
    issues,
    suggestions,
    canAnalyze: status !== 'fail',
  };
}

export function qualityStatusLabel(status: VitQualityStatus): string {
  if (status === 'pass') return 'Good for AI analysis';
  if (status === 'warn') return 'Usable — better photo recommended';
  return 'Needs a clearer photo or video';
}
