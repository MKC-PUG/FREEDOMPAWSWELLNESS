// public/sw.js - Service Worker for Freedom Paws PWA
// Network-first strategy: always try the network so users get fresh
// content, and fall back to the cache only when offline. This avoids the
// stale-HTML / missing-CSS problem caused by caching hashed Next.js assets.

const CACHE_NAME = 'freedom-paws-v3';

// Only pre-cache small, stable files. Never pre-cache "/" or hashed assets.
const PRECACHE_URLS = ['/manifest.json', '/favicon.ico'];

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

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  event.respondWith(
    fetch(request)
      .then((response) => {
        // Keep a copy of successful same-origin responses for offline fallback.
        if (response.ok && new URL(request.url).origin === self.location.origin) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy)).catch(() => {});
        }
        return response;
      })
      .catch(() => caches.match(request))
  );
});
