const cacheName = 'game-cache-v2';

const assetsToCache = [
    '/',
    '/index.html',
    '/manifest.json',
    '/TemplateData/style.css',
    '/TemplateData/favicon.ico',

    // Unity Build Files
    '/Build/NewWebBuild.loader.js',
    '/Build/NewWebBuild.data',
    '/Build/NewWebBuild.framework.js',
    '/Build/NewWebBuild.wasm'
];

// インストール時にキャッシュ
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(cacheName)
            .then((cache) => {
                return cache.addAll(assetsToCache);
            })
    );
});

// リクエスト時にキャッシュから返す
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((cached) => {
                return cached || fetch(event.request);
            })
    );
});

// 古いキャッシュを削除
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keyList) =>
            Promise.all(
                keyList.map((key) => {
                    if (key !== cacheName) {
                        return caches.delete(key);
                    }
                })
            )
        )
    );
});
