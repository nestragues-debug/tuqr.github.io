// sw.js — TuQR
// Versión del cache. Cambiar SOLO si modificas los assets estáticos (logo, manifest).
// Los archivos HTML NUNCA se cachean — siempre van a la red.
const CACHE_VERSION = 'tuqr-v7';

const STATIC_ASSETS = [
  './TuQRLogo.png',
  './LogoQ_transparent.png',
  './manifest.json'
];

// ── Instalación: precachear solo assets estáticos ──
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then(cache => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// ── Activación: eliminar caches viejos ──
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});
