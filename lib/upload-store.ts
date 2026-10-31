import { randomUUID } from 'crypto';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';

const BUCKET = 'vit-uploads';
const TTL_MS = 60 * 60 * 1000;

type StoredUpload = {
  mime: string;
  name: string;
  expires: number;
};

function binPath(id: string) {
  return `${id}.bin`;
}

function metaPath(id: string) {
  return `${id}.json`;
}

function adminOrThrow() {
  const admin = createSupabaseAdminClient();
  if (!admin) throw new Error('Upload store is not configured.');
  return admin;
}

/** Save where every Vercel machine can read it. os.tmpdir() is local to one machine. */
export async function saveUpload(bytes: Buffer, mime: string, name: string): Promise<string> {
  const admin = adminOrThrow();
  const id = randomUUID();
  const meta: StoredUpload = {
    mime: mime || 'image/jpeg',
    name: name || 'photo.jpg',
    expires: Date.now() + TTL_MS,
  };

  const photo = await admin.storage.from(BUCKET).upload(binPath(id), new Uint8Array(bytes), {
    contentType: meta.mime,
    upsert: false,
  });
  if (photo.error) throw photo.error;

  const sidecar = await admin.storage
    .from(BUCKET)
    .upload(metaPath(id), new Uint8Array(Buffer.from(JSON.stringify(meta))), {
      contentType: 'application/json',
      upsert: false,
    });
  if (sidecar.error) {
    await admin.storage.from(BUCKET).remove([binPath(id)]);
    throw sidecar.error;
  }

  return id;
}

export async function getUpload(
  id: string
): Promise<{ bytes: Buffer; mime: string; name: string } | null> {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;

  const admin = createSupabaseAdminClient();
  if (!admin) return null;

  try {
    const metaRes = await admin.storage.from(BUCKET).download(metaPath(id));
    if (metaRes.error || !metaRes.data) return null;

    const meta = JSON.parse(await metaRes.data.text()) as StoredUpload;
    if (Date.now() > meta.expires) {
      await deleteUpload(id);
      return null;
    }

    const binRes = await admin.storage.from(BUCKET).download(binPath(id));
    if (binRes.error || !binRes.data) return null;

    const bytes = Buffer.from(await binRes.data.arrayBuffer());
    return { bytes, mime: meta.mime, name: meta.name };
  } catch {
    return null;
  }
}

export async function deleteUpload(id: string) {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return;
  const admin = createSupabaseAdminClient();
  if (!admin) return;
  await admin.storage.from(BUCKET).remove([binPath(id), metaPath(id)]);
}

export function toDataUrl(bytes: Buffer, mime: string): string {
  return `data:${mime};base64,${bytes.toString('base64')}`;
}