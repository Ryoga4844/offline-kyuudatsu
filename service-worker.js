const cacheName = 'game-cache-v1';

// キャッシュ対象のすべてのファイル
const contentToCache = [
    '/',
    '/index.html',
    '/manifest.json',
    '/icon-192.png',
    '/icon-512.png',
    '/Build/NewWebBuild.data',
    '/Build/NewWebBuild.framework.js',
    '/Build/NewWebBuild.loader.js',
    '/Build/NewWebBuild.wasm',
    '/Build/boot.config', // 存在しない場合は無視されるのでOK
    '/StreamingAssets/UnityServicesProjectConfiguration.json',
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

// インストール処理（キャッシュ登録）
self.addEventListener('install', (event) => {
    self.skipWaiting(); // 即時適用
    event.waitUntil(
        caches.open(cacheName).then((cache) => {
            return cache.addAll(contentToCache);
        })
    );
});

// 有効化処理（古いキャッシュ削除）
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys.map((key) => {
                    if (key !== cacheName) {
                        return caches.delete(key);
                    }
                })
            )
        )
    );
    return self.clients.claim();
});

// fetch処理（キャッシュ優先）
self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            return cachedResponse || fetch(event.request);
        })
    );
});
