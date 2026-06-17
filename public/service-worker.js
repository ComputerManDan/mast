const CACHE_NAME = 'squat-analysis-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/index.css'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  
<<<<<<< HEAD
  // Don't cache media stream requests or camera access
  if (event.request.url.includes('mediaDevices') || 
      event.request.url.includes('getUserMedia') ||
      event.request.destination === 'video' ||
      event.request.destination === 'audio') {
    return;
  }
  
=======
>>>>>>> dacae9a69272962ed31447305702961b3eefa817
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
      .catch(() => caches.match('/index.html'))
  );
});