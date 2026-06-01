/**
 * Client-side media quality gate for ViT Diagnostics (runs before analyze).
 */

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
  file: File
): VitMediaQuality {
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
  if (shortEdge < MIN_EDGE_HARD_FAIL) {
    issues.push('Resolution is too low for AI vision');
    score -= 45;
    suggestions.push('Move closer or use a higher-resolution photo (at least 320px)');
  } else if (shortEdge < MIN_EDGE_PX) {
    issues.push('Resolution is a bit low');
    score -= 22;
    suggestions.push('A sharper, closer photo helps our AI see coat, eyes, and posture');
  }

  if (metrics.luminance < DARK_LUMINANCE) {
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
  if (score < WARN_SCORE || shortEdge < MIN_EDGE_HARD_FAIL) {
    status = 'fail';
  } else if (score < PASS_SCORE) {
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

/** Assess extracted video frames — uses middle frame + worst score. */
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
