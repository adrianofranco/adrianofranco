const CACHE_NAME = 'xxx-3';
const urlsToCache = [
    '/',
    '/index.html',
    '/public/js/htmx.min.js',
    '/public/js/main.js',
    '/public/styles/main.css',
    '/public/fonts/A2BYn5pb0QgtVEPFnlYOnYLw.woff2',
    '/public/fonts/H4cnBX2MkcfEngTr4gEa7Q.woff2',
    '/public/fonts/Linearicons-Free.woff2',
    '/public/fonts/Linearicons-Free.eot',
    '/public/fonts/Linearicons-Free.svg',
    '/public/fonts/Linearicons-Free.ttf',
    '/android-chrome-192x192.png',
    '/android-chrome-512x512.png',
    '/apple-touch-icon.png',
    '/favicon.ico',
    '/favicon-32x32.png',
    '/favicon-16x16.png',
    '/manifest.webmanifest',
];


const addResourcesToCache = async (resources) => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(resources);
};


self.addEventListener("install", (event) => {
    event.waitUntil(
      addResourcesToCache(urlsToCache),
    );
  });


self.addEventListener("fetch", (event) => {

    const noCacheUrls = ['/ascii-art'];

    if (noCacheUrls.some(url => event.request.url.includes(url))) {

        delete event.request
        //event.respondWith(fetch(event.request));
        return;
    }

    event.respondWith(
        (async () => {
            try {

               

                const cachedResponse = await caches.match(event.request);
                if (cachedResponse) {
                    return cachedResponse;
                }
                const response = await fetch(event.request);
                if (!response || response.status !== 200 || response.type !== 'basic') {
                    return response;
                }
                const cache = await caches.open(CACHE_NAME);
                cache.put(event.request, response.clone());
                return response;
            } catch (error) {
                console.error('Error in fetch handler:', error);
                throw error;
            }
        })()
    );
});