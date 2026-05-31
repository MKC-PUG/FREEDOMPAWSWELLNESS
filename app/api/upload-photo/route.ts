import { NextRequest, NextResponse } from 'next/server';
import { decodePhotoBase64 } from '@/lib/decode-photo-upload';
import { redirectPath } from '@/lib/request-origin';
import { getUpload, saveUpload } from '@/lib/upload-store';

const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED_KEYS = new Set(['vit-diagnostics', 'photobooth']);

async function bytesFromForm(formData: FormData): Promise<{
  buffer: Buffer;
  mime: string;
  name: string;
} | null> {
  const base64 = formData.get('photoBase64');
  if (typeof base64 === 'string' && base64.length > 0) {
    const decoded = decodePhotoBase64(base64);
    if (decoded && decoded.buffer.length > 0) {
      const name = (formData.get('photoName') || 'photo.jpg').toString();
      return { ...decoded, name };
    }
  }

  const photo = formData.get('photo');
  if (photo instanceof File && photo.size > 0) {
    const mime = photo.type.startsWith('image/') ? photo.type : 'image/jpeg';
    const buffer = Buffer.from(await photo.arrayBuffer());
    return { buffer, mime, name: photo.name || 'photo.jpg' };
  }

  return null;
}

/** Fetch a saved upload by id (keeps large photos out of page HTML). */
export async function GET(request: NextRequest) {
  const id =
    request.nextUrl.searchParams.get('id') ?? request.cookies.get('fp-upload-id')?.value;
  if (!id) {
    return NextResponse.json({ error: 'Missing upload id' }, { status: 400 });
  }

  const stored = await getUpload(id);
  if (!stored) {
    return NextResponse.json({ error: 'Upload not found or expired' }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(stored.bytes), {
    headers: {
      'Content-Type': stored.mime,
      'Cache-Control': 'private, max-age=3600',
    },
  });
}

/**
 * Native HTML form POST — saves photo on server, sets cookie, redirects back.
 * Accepts multipart file OR base64 hidden field (better on iPhone Chrome).
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const storageKey = (formData.get('storageKey') || 'vit-diagnostics').toString();
    let returnTo = (formData.get('returnTo') || '/diagnostics').toString();

    const payload = await bytesFromForm(formData);

    console.log('upload-photo', {
      host: request.headers.get('host'),
      storageKey,
      hasPayload: Boolean(payload),
      bytes: payload?.buffer.length ?? 0,
    });

    if (!payload) {
      return NextResponse.redirect(redirectPath(request, `${returnTo}?uploadError=no-file`), 303);
    }

    if (!ALLOWED_KEYS.has(storageKey)) {
      return NextResponse.redirect(redirectPath(request, `${returnTo}?uploadError=invalid`), 303);
    }

    if (!returnTo.startsWith('/') || returnTo.includes('://')) {
      returnTo = '/diagnostics';
    }

    if (payload.buffer.length > MAX_BYTES) {
      return NextResponse.redirect(redirectPath(request, `${returnTo}?uploadError=too-large`), 303);
    }

    const id = await saveUpload(payload.buffer, payload.mime, payload.name);

    const responseMode = formData.get('response')?.toString();
    if (responseMode === 'json') {
      const response = NextResponse.json({ ok: true, uploadId: id });
      response.cookies.set('fp-upload-id', id, {
        path: '/',
        maxAge: 3600,
        sameSite: 'lax',
        httpOnly: true,
      });
      response.cookies.set('fp-upload-key', storageKey, {
        path: '/',
        maxAge: 3600,
        sameSite: 'lax',
        httpOnly: true,
      });
      return response;
    }

    const redirectUrl = redirectPath(request, returnTo);
    redirectUrl.searchParams.set('uploaded', '1');
    redirectUrl.searchParams.set('uploadId', id);

    const response = NextResponse.redirect(redirectUrl, 303);
    response.cookies.set('fp-upload-id', id, {
      path: '/',
      maxAge: 3600,
      sameSite: 'lax',
      httpOnly: true,
    });
    response.cookies.set('fp-upload-key', storageKey, {
      path: '/',
      maxAge: 3600,
      sameSite: 'lax',
      httpOnly: true,
    });

    return response;
  } catch (error) {
    console.error('upload-photo error:', error);
    return NextResponse.redirect(redirectPath(request, '/diagnostics?uploadError=failed'), 303);
  }
}
