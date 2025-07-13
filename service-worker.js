const cacheName = 'game-cache-v1';

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
    '/TemplateData/style.css',
    '/TemplateData/favicon.ico'
];

// インストール時にキャッシュ登録
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(cacheName).then((cache) => {
            return cache.addAll(contentToCache);
        })
    );
});

// 有効化と古いキャッシュ削除
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
});

// フェッチイベント：キャッシュ優先
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
