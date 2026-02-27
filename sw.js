const CACHE = 'tuqr-v1';
const PRECACHE = [
  './app.html',
  './TuQRLogo.png',
  'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js',
  'https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&display=swap'
];

// Instala y cachea recursos estáticos
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // data.json siempre desde la red (datos frescos)
  if(url.pathname.endsWith('data.json')){
    e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
    return;
  }

  // Todo lo demás: cache primero, red como fallback
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
