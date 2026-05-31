import type { NextRequest } from 'next/server';

/** Build redirect origin from the client Host header (not server bind address 0.0.0.0). */
export function requestOrigin(request: NextRequest): string {
  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host');
  if (host) {
    const forwardedProto = request.headers.get('x-forwarded-proto');
    const hostname = host.split(':')[0];
    const isLocal =
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '0.0.0.0' ||
      /^\d{1,3}(\.\d{1,3}){3}$/.test(hostname);
    const protocol = forwardedProto ?? (isLocal ? 'http' : 'https');
    return `${protocol}://${host}`;
  }

  const url = new URL(request.url);
  if (url.hostname === '0.0.0.0') {
    return `http://127.0.0.1${url.port ? `:${url.port}` : ''}`;
  }
  return url.origin;
}

export function redirectPath(request: NextRequest, path: string): URL {
  return new URL(path, requestOrigin(request));
}
