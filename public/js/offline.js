const CACHE_NAME = 'meu-cache-v1';
const urlsToCache = [
    '/',
    '/public/js/htmx.min.js',
    '/public/js/main.js',
    '/public/styles/main.css',
    '/ascii-art/offline.txt',
    '/android-chrome-192x192.png',
    '/android-chrome-512x512.png',
    '/apple-touch-icon.png',
    '/favicon.ico',
    '/favicon-32x32.png',
    '/favicon-16x16.png',
    '/site.webmanifest',
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Cached');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});