const cacheName = 'game-cache-v3';
const assetsToCache = [
    './',
    './index.html',
    './manifest.json',
    './icon-192.png',
    './icon-512.png',

    // Build
    './Build/NewWebBuild.loader.js',
    './Build/NewWebBuild.framework.js',
    './Build/NewWebBuild.data',
    './Build/NewWebBuild.wasm',

    // StreamingAssets
    './StreamingAssets/UnityServicesProjectConfiguration.json',

    // TemplateData
    './TemplateData/style.css',
    './TemplateData/favicon.ico',
    './TemplateData/fullscreen-button.png',
    './TemplateData/MemoryProfiler.png',
    './TemplateData/progress-bar-empty-dark.png',
    './TemplateData/progress-bar-empty-light.png',
    './TemplateData/progress-bar-full-dark.png',
    './TemplateData/progress-bar-full-light.png',
    './TemplateData/unity-logo-dark.png',
    './TemplateData/unity-logo-light.png',
    './TemplateData/unity-logo-title-footer.png',
    './TemplateData/webmemd-icon.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(cacheName).then(cache =>
            Promise.all(assetsToCache.map(url =>
                fetch(url).then(resp => {
                    if (!resp.ok) throw new Error(`Failed: ${url}`);
                    return cache.put(url, resp.clone());
                }).catch(err => {
                    console.warn(`❌ キャッシュ失敗: ${url}`, err);
                })
            ))
        )
    );
    self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            return cachedResponse || fetch(event.request).catch(() => {
                if (event.request.destination === 'document') {
                    return caches.match('./index.html');
                }
            });
        })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.map(key => {
                    if (key !== cacheName) {
                        return caches.delete(key);
                    }
                })
            )
        )
    );
    self.clients.claim();
});
