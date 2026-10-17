import fs from 'fs';
import path from 'path';
import { LOCKED_VOICE_ID, SPOKEN_CLOSER } from '@/lib/ops/studio-catalog';
import { backgroundById, motionById } from '@/lib/ops/studio-plates';
import { readLockedStill } from '@/lib/ops/studio-still';

export { readLockedStill };

export type RenderStart = {
  audioUrl: string | null;
  audioAssetId: string;
  heygenVideoId: string;
};

function heygenKey(): string {
  const key = process.env.HEYGEN_API_KEY?.trim();
  if (!key) throw new Error('HEYGEN_API_KEY is not set. Add it in .env.local and in Vercel, then render again.');
  return key;
}

function elevenKey(): string {
  const key = process.env.ELEVENLABS_API_KEY?.trim();
  if (!key) {
    throw new Error('ELEVENLABS_API_KEY is not set. Add it in .env.local and in Vercel, then render again.');
  }
  return key;
}

export function renderKeysReady(): { elevenlabs: boolean; heygen: boolean } {
  return {
    elevenlabs: Boolean(process.env.ELEVENLABS_API_KEY?.trim()),
    heygen: Boolean(process.env.HEYGEN_API_KEY?.trim()),
  };
}

export function scriptForSpeech(script: string): string {
  const trimmed = script.trim();
  if (/veterinar/i.test(trimmed)) return trimmed;
  return `${trimmed}\n\n${SPOKEN_CLOSER}`;
}

export async function synthesizeSuperBud(script: string): Promise<Buffer> {
  const text = scriptForSpeech(script);
  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${LOCKED_VOICE_ID}?output_format=mp3_44100_128`,
    {
      method: 'POST',
      headers: {
        'xi-api-key': elevenKey(),
        'Content-Type': 'application/json',
        Accept: 'audio/mpeg',
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2',
      }),
      signal: AbortSignal.timeout(45_000),
    }
  );
  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`ElevenLabs ${res.status}: ${detail.slice(0, 240)}`);
  }
  return Buffer.from(await res.arrayBuffer());
}

async function uploadAudioAsset(audio: Buffer): Promise<{ id: string; url: string | null }> {
  const form = new FormData();
  form.append('file', new Blob([new Uint8Array(audio)], { type: 'audio/mpeg' }), 'superbud-vo.mp3');
  const res = await fetch('https://api.heygen.com/v3/assets', {
    method: 'POST',
    headers: { 'x-api-key': heygenKey() },
    body: form,
    signal: AbortSignal.timeout(30_000),
  });
  const json = (await res.json().catch(() => ({}))) as {
    data?: { asset_id?: string; id?: string; url?: string };
    error?: { message?: string };
    message?: string;
  };
  if (!res.ok) {
    throw new Error(
      `HeyGen audio upload ${res.status}: ${json.error?.message || json.message || 'upload failed'}`
    );
  }
  const id = json.data?.asset_id || json.data?.id;
  if (!id) throw new Error('HeyGen audio upload did not return an asset id.');
  return { id, url: json.data?.url ?? null };
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const value = hex.replace('#', '');
  return {
    r: Number.parseInt(value.slice(0, 2), 16),
    g: Number.parseInt(value.slice(2, 4), 16),
    b: Number.parseInt(value.slice(4, 6), 16),
  };
}

function titleSvg(text: string): string {
  const lines = text
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 80)
    .split(' ')
    .reduce<string[]>((rows, word) => {
      const last = rows[rows.length - 1] ?? '';
      if (!last || `${last} ${word}`.length > 28) rows.push(word);
      else rows[rows.length - 1] = `${last} ${word}`;
      return rows;
    }, [])
    .slice(0, 2);
  const escaped = lines.map((line) =>
    line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  );
  const body = escaped
    .map(
      (line, index) =>
        `<text x="36" y="${78 + index * 58}" fill="#F5C242" font-size="46" font-family="sans-serif" font-weight="700">${line}</text>`
    )
    .join('');
  return `<svg width="960" height="200" xmlns="http://www.w3.org/2000/svg"><rect width="960" height="200" rx="28" fill="#0A1428" fill-opacity="0.78"/>${body}</svg>`;
}

/** A 9:16 plate with the title printed at the top. HeyGen places SuperBud on this after the cutout. */
export async function renderBackgroundPlate(backgroundId: string, onScreenText: string): Promise<Buffer> {
  const sharp = (await import('sharp')).default;
  const plate = backgroundById(backgroundId);
  const color = hexToRgb(plate.color);
  let image = sharp({
    create: { width: 1080, height: 1920, channels: 3, background: color },
  });
  if (plate.kind === 'image' && plate.path) {
    const file = path.join(
      process.cwd(),
      'public/images/photobooth/backgrounds',
      path.basename(plate.path)
    );
    if (fs.existsSync(file)) {
      const covered = await sharp(file)
        .resize(1080, 1920, { fit: 'cover', position: 'centre' })
        .toBuffer();
      image = sharp(covered);
    }
  }
  const title = onScreenText.trim();
  if (!title) return image.png().toBuffer();
  return image.composite([{ input: Buffer.from(titleSvg(title)), top: 72, left: 60 }]).png().toBuffer();
}

async function uploadImageAsset(png: Buffer): Promise<string> {
  const form = new FormData();
  form.append('file', new Blob([new Uint8Array(png)], { type: 'image/png' }), 'superbud-plate.png');
  const res = await fetch('https://api.heygen.com/v3/assets', {
    method: 'POST',
    headers: { 'x-api-key': heygenKey() },
    body: form,
    signal: AbortSignal.timeout(30_000),
  });
  const json = (await res.json().catch(() => ({}))) as {
    data?: { asset_id?: string; id?: string };
    error?: { message?: string };
    message?: string;
  };
  if (!res.ok) {
    throw new Error(
      `HeyGen plate upload ${res.status}: ${json.error?.message || json.message || 'upload failed'}`
    );
  }
  const id = json.data?.asset_id || json.data?.id;
  if (!id) throw new Error('HeyGen plate upload did not return an asset id.');
  return id;
}

export async function startAvatarRender(input: {
  title: string;
  audio: Buffer;
  backgroundId?: string;
  motionId?: string;
  onScreenText?: string;
}): Promise<RenderStart> {
  const still = readLockedStill();
  const asset = await uploadAudioAsset(input.audio);
  const background = backgroundById(input.backgroundId);
  const motion = motionById(input.motionId);
  const plate =
    background.kind === 'locked'
      ? null
      : { asset_id: await uploadImageAsset(await renderBackgroundPlate(background.id, input.onScreenText || '')) };
  const res = await fetch('https://api.heygen.com/v3/videos', {
    method: 'POST',
    headers: {
      'x-api-key': heygenKey(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      type: 'image',
      image: {
        type: 'base64',
        media_type: 'image/png',
        data: still.toString('base64'),
      },
      audio_asset_id: asset.id,
      title: input.title.slice(0, 80),
      aspect_ratio: '9:16',
      resolution: '1080p',
      expressiveness: 'low',
      engine: { type: 'avatar_iv' },
      motion_prompt: motion.prompt,
      output_format: 'mp4',
      caption: { style: 'default' },
      ...(plate
        ? { remove_background: true, background: plate, fit: 'contain' }
        : {}),
    }),
    signal: AbortSignal.timeout(30_000),
  });
  const json = (await res.json().catch(() => ({}))) as {
    data?: { video_id?: string; id?: string };
    error?: { message?: string };
    message?: string;
  };
  if (!res.ok) {
    throw new Error(
      `HeyGen video ${res.status}: ${json.error?.message || json.message || 'create failed'}`
    );
  }
  const heygenVideoId = json.data?.video_id || json.data?.id;
  if (!heygenVideoId) throw new Error('HeyGen did not return a video id.');
  return {
    audioUrl: asset.url,
    audioAssetId: asset.id,
    heygenVideoId,
  };
}

export async function pollAvatarRender(videoId: string): Promise<{
  status: 'pending' | 'processing' | 'completed' | 'failed';
  videoUrl: string | null;
  failure: string | null;
}> {
  const res = await fetch(`https://api.heygen.com/v3/videos/${encodeURIComponent(videoId)}`, {
    headers: { 'x-api-key': heygenKey() },
    signal: AbortSignal.timeout(15_000),
  });
  const json = (await res.json().catch(() => ({}))) as {
    data?: {
      status?: string;
      video_url?: string | null;
      failure_message?: string | null;
    };
    error?: { message?: string };
  };
  if (!res.ok) {
    throw new Error(`HeyGen status ${res.status}: ${json.error?.message || 'status failed'}`);
  }
  const status = json.data?.status || 'processing';
  const normalized =
    status === 'completed' || status === 'failed' || status === 'pending' || status === 'processing'
      ? status
      : 'processing';
  return {
    status: normalized,
    videoUrl: json.data?.video_url ?? null,
    failure: json.data?.failure_message ?? null,
  };
}
