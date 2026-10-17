import fs from 'fs';
import path from 'path';
import {
  LOCKED_STILL_RELATIVE,
  LOCKED_VOICE_ID,
  SPOKEN_CLOSER,
} from '@/lib/ops/studio-catalog';

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

export function readLockedStill(): Buffer {
  const file = path.join(process.cwd(), LOCKED_STILL_RELATIVE);
  if (!fs.existsSync(file)) {
    throw new Error(`Locked still missing at ${LOCKED_STILL_RELATIVE}.`);
  }
  return fs.readFileSync(file);
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

export async function startAvatarRender(input: {
  title: string;
  audio: Buffer;
}): Promise<RenderStart> {
  const still = readLockedStill();
  const asset = await uploadAudioAsset(input.audio);
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
      motion_prompt:
        'Subtle speaking motion. Preserve the pug face, grey mask, ears, muzzle, and costume exactly.',
      output_format: 'mp4',
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
