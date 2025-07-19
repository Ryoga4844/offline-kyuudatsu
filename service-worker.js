const CACHE_NAME = 'game-cache-v1';
const ASSETS = [
    /* ルート */
    '/', '/index.html', '/manifest.json', '/icon-192.png', '/icon-512.png',
    /* Unity ビルド */
    '/Build/NewWebBuild.loader.js',
    '/Build/NewWebBuild.framework.js',
    '/Build/NewWebBuild.data',
    '/Build/NewWebBuild.wasm',
    /* StreamingAssets */
    '/StreamingAssets/UnityServicesProjectConfiguration.json',
    /* TemplateData */
    '/TemplateData/style.css',
    '/TemplateData/favicon.ico',
    '/TemplateData/fullscreen-button.png',
    '/TemplateData/MemoryProfiler.png',
    '/TemplateData/progress-bar-empty-dark.png',
    '/TemplateData/progress-bar-empty-light.png',
    '/TemplateData/progress-bar-full-dark.png',
    '/TemplateData/progress-bar-full-light.png',
    '/TemplateData/unity-logo-dark.png',
    '/TemplateData/unity-logo-light.png',
    '/TemplateData/unity-logo-title-footer.png',
    '/TemplateData/webmemd-icon.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.map(key => key !== CACHE_NAME ? caches.delete(key) : null)
            )
        ).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', event => {
    // GET リクエストのみ
    if (event.request.method !== 'GET') return;

    event.respondWith(
        caches.match(event.request).then(cached => {
            return cached || fetch(event.request).catch(() => {
                // オフライン時、HTML は index.html を返す
                if (event.request.destination === 'document') {
                    return caches.match('/index.html');
                }
            });
        })
    );
});
