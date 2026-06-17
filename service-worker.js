const CACHE_NAME = "mochilao-europa-v1";
const APP_SHELL = [
  "./",
  "./index.html",
  "./assets/css/style.css",
  "./assets/js/app.js",
  "./assets/js/core/storage.js",
  "./assets/js/core/dom.js",
  "./assets/js/core/europe-cities.js",
  "./assets/js/modules/dashboard.js",
  "./assets/js/modules/planner.js",
  "./assets/js/modules/map.js",
  "./assets/js/modules/budget.js",
  "./assets/js/modules/checklist.js",
  "./assets/js/modules/diary.js",
  "./assets/js/modules/settings.js",
  "./assets/js/modules/pdf.js",
  "./manifest.json",
  "./assets/icons/icon.svg"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request).then(response => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy)).catch(()=>{});
        return response;
      }).catch(() => caches.match("./index.html"));
    })
  );
});
