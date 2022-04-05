importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

const { setDefaultHandler, registerRoute, setCatchHandler } = workbox.routing;
const { CacheFirst, StaleWhileRevalidate } = workbox.strategies;
const { CacheableResponse } = workbox.cacheableResponse;
const { ExpirationPlugin } = workbox.expiration;

registerRoute(
    ({ request }) => request.destination === 'css',
    new StaleWhileRevalidate({
        cacheName: 'css-cache',
    })
);
registerRoute(
    ({ request }) => request.destination === "/",
    new StaleWhileRevalidate({
        cacheName: "home-cache",
    })
);

registerRoute(({ request }) => request.destination === 'images',
    new CacheFirst({
        cacheName: 'image-cache',
        plugins: [
            new ExpirationPlugin({
                maxEntries: 1000,
                maxAgeSeconds: 15 * 24 * 60 * 60,
            })
        ],
    })
);
registerRoute(({ request }) => request.destination === 'slider',
    new CacheFirst({
        cacheName: 'slides-cache',
        plugins: [
            new ExpirationPlugin({
                maxEntries: 1000,
                maxAgeSeconds: 15 * 24 * 60 * 60,
            })
        ],
    })
);
registerRoute(
    ({ request }) => request.destination === 'js',
    new StaleWhileRevalidate({
        cacheName: 'js-cache',
    })
);