const cacheName = 'game-cache-v3';

const assetsToCache = [
    '/', // ルートパスでインストールされたとき用
    '/index.html',
    '/manifest.json',
    '/icon-192.png',
    '/icon-512.png',
    '/.nojekyll',

    // Unity Build
    '/Build/NewWebBuild.loader.js',
    '/Build/NewWebBuild.data',
    '/Build/NewWebBuild.framework.js',
    '/Build/NewWebBuild.wasm',

    // TemplateData
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
    '/TemplateData/webmemd-icon.png',
];

// install: 初回キャッシュ登録
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(cacheName).then((cache) => {
            return cache.addAll(assetsToCache);
        })
    );
});

// activate: 古いキャッシュ削除
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(
                keyList.map((key) => {
                    if (key !== cacheName) {
                        return caches.delete(key);
                    }
                })
            );
        })
    );
});

// fetch: キャッシュ優先でレスポンス
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
