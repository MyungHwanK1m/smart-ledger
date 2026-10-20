const CACHE_NAME = 'smart-ledger-cache-v3';

const PRECACHE_URLS = [
  './',
  './index.html',
  './manifest.json',
  './icon.png',
  './pwa-192x192.png',
  './pwa-512x512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 성공한 응답을 캐시에 복사해 둔다 (오프라인 대비)
function putInCache(request, response) {
  if (response && response.ok) {
    const copy = response.clone();
    caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
  }
  return response;
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Supabase API, 외부 CDN 등 다른 출처 요청과 GET 이외 요청은 브라우저에 맡김
  if (request.method !== 'GET' || url.origin !== self.location.origin) {
    return;
  }

  // 페이지(index.html): 네트워크 우선 → 새 배포가 즉시 반영되고, 오프라인일 때만 캐시 사용
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => putInCache(request, response))
        .catch(() =>
          caches.match(request).then((cached) => cached || caches.match('./index.html'))
        )
    );
    return;
  }

  // 빌드 산출물(assets/파일명-해시.js 등): 파일명이 내용마다 바뀌므로 캐시 우선 + 런타임 캐싱
  if (url.pathname.includes('/assets/')) {
    event.respondWith(
      caches.match(request).then(
        (cached) => cached || fetch(request).then((response) => putInCache(request, response))
      )
    );
    return;
  }

  // 그 외 정적 파일(아이콘, manifest 등): 네트워크 우선, 실패 시 캐시
  event.respondWith(
    fetch(request)
      .then((response) => putInCache(request, response))
      .catch(() => caches.match(request))
  );
});
