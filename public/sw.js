// Freedom Paws PWA — network-first, Photo Booth / API never cached.
// Bump CACHE_NAME on each deploy that changes static assets.

const CACHE_NAME = 'freedom-paws-v39';

const PRECACHE_URLS = [
  '/manifest.json',
  '/favicon.ico',
  '/images/icon-192.png',
  '/images/icon-512.png',
  '/images/icon-maskable-512.png',
  '/offline.html',
];

/** Routes that must always hit the network (no cache read or write). */
function isNetworkOnly(pathname) {
  return (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/photobooth') ||
    pathname.includes('photobooth-upload') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/diagnostics') ||
    pathname.startsWith('/images/photobooth/')
  );
}

/** Hashed Next.js CSS — network-first so PWA never serves stale styles after deploy. */
function isNextCss(pathname) {
  return pathname.startsWith('/_next/static/css/');
}

/** Hashed Next.js assets and stable public images — safe to cache. */
function isCacheableAsset(pathname) {
  return (
    pathname.startsWith('/_next/static/') ||
    pathname.startsWith('/images/') ||
    pathname.startsWith('/imgly-bg-removal/') ||
    pathname === '/favicon.ico' ||
    pathname === '/manifest.json' ||
    pathname === '/offline.html'
  );
}

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .catch(() => {})
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (isNetworkOnly(url.pathname)) {
    event.respondWith(fetch(request));
    return;
  }

  // HTML navigations — network only; offline shell fallback.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() =>
        caches.match('/offline.html').then((cached) => cached || caches.match('/'))
      )
    );
    return;
  }

  // Next.js CSS — network-first (prevents unstyled nav/pages after updates).
  if (isNextCss(url.pathname)) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            caches
              .open(CACHE_NAME)
              .then((cache) => cache.put(request, response.clone()))
              .catch(() => {});
          }
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Hashed Next.js assets and stable public images — safe to cache.
  if (isCacheableAsset(url.pathname)) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cached = await cache.match(request);
        if (cached) return cached;
        const response = await fetch(request);
        if (response.ok) {
          cache.put(request, response.clone()).catch(() => {});
        }
        return response;
      })
    );
    return;
  }

  // Everything else — network-first, optional cache on success for same-origin GET.
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok && isCacheableAsset(url.pathname)) {
          caches
            .open(CACHE_NAME)
            .then((cache) => cache.put(request, response.clone()))
            .catch(() => {});
        }
        return response;
      })
      .catch(() => caches.match(request))
  );
});
