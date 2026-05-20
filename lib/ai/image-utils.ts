// lib/ai/image-utils.ts
// Freedom Paws Wellness – Image Quality & Preprocessing Utilities
// Version: May 19, 2026

import { ImageQuality } from './types';

export async function assessImageQuality(file: File): Promise<ImageQuality> {
  const issues: string[] = [];
  const suggestions: string[] = [];
  let score = 100;

  // Check file size (max 10MB recommended for GPT-4o)
  if (file.size > 10 * 1024 * 1024) {
    issues.push("Image is very large");
    score -= 20;
    suggestions.push("Please use a smaller image under 10MB");
  }

  // Check file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    issues.push("Unsupported image format");
    score -= 30;
    suggestions.push("Please upload JPG, PNG, or WebP");
  }

  // Basic resolution check (via dimensions if possible)
  if (file.type.startsWith('image/')) {
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    await new Promise<void>((resolve) => {
      img.onload = () => {
        if (img.width < 200 || img.height < 200) {
          issues.push("Image resolution too low");
          score -= 25;
          suggestions.push("Please use a clearer, higher-resolution photo");
        }
        URL.revokeObjectURL(url);
        resolve();
      };
      img.src = url;
    });
  }

  const isValid = score >= 60 && issues.length < 3;

  return {
    isValid,
    issues,
    score: Math.max(0, score),
    suggestions
  };
}

/** Simple helper to validate file before sending to AI */
export function isValidImageFile(file: File): boolean {
  return file.type.startsWith('image/') && file.size < 15 * 1024 * 1024;
}