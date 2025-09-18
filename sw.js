/* Service Worker Social Pet PWA */
const CACHE_NAME = 'socialpet-cache-v1';
const CORE_ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './assets/css/custom.css',
  './assets/js/app.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(CORE_ASSETS);
  })());
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)));
  })());
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);
    if (cached) return cached;
    try {
      const response = await fetch(request);
      if (response.ok && (request.url.startsWith(self.location.origin))) {
        cache.put(request, response.clone());
      }
      return response;
    } catch (e) {
      // Offline fallback simples: retorna index para navegação básica
      if (request.destination === 'document') {
        return cache.match('./index.html');
      }
      return new Response('', { status: 504, statusText: 'Offline' });
    }
  })());
});
