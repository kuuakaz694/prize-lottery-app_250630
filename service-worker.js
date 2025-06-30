const CACHE_NAME = 'lottery-app-cache-v1';
const urlsToCache = [
    './', // index.html
    'index.html',
    'style.css',
    'script.js',
    'manifest.json',
    'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.17.0/xlsx.full.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.9.4/lottie.min.js',
    // 画像
    'images/keihin_T.png',
    'images/keihin_A.png',
    'images/keihin_B.png',
    'images/keihin_C.png',
    'images/keihin_Z.png',
    'images/title_001.png',
    'images/footer_001.png',
    'images/img_0.png',
    // アニメーション (実際のアニメーションファイル名に合わせて追加)
    'animation/TOP_screen_001.json',
    'animation/fishing_dog_T.json',
    'animation/fishing_dog_A.json',
    'animation/fishing_dog_B.json',
    'animation/fishing_dog_C.json',
    'animation/fishing_dog_Z.json',
    // サウンド (実際のサウンドファイル名に合わせて追加)
    'sound/fishing-dog_T.mp3',
    'sound/fishing-dog_A.mp3',
    'sound/fishing-dog_B.mp3',
    'sound/fishing-dog_C.mp3',
    'sound/fishing-dog_Z.mp3',
    // アイコン
    'icon/icon-192.png',
    'icon/icon-512.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
                // 全ての重要なアセットをキャッシュに追加
                return cache.addAll(urlsToCache.map(url => new Request(url, {credentials: 'omit'})));
            })
            .catch(error => {
                console.error('Failed to cache:', error);
            })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // キャッシュにリソースがあればそれを使用
                if (response) {
                    return response;
                }
                // キャッシュになければネットワークから取得し、キャッシュに追加
                return fetch(event.request).then(
                    (response) => {
                        // 有効なレスポンスかチェック
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // レスポンスをクローンしてキャッシュに保存
                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });
                        return response;
                    }
                );
            })
    );
});

self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
