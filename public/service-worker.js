
// Service Worker for Offline Notes App

const CACHE_NAME = "offline-notes-cache-v3";

// Install the service worker
self.addEventListener("install", (event) => {
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      await cache.add("/");
      await cache.add("/index.html");
    })
  );
});

// Activate the service worker and remove old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();

      await Promise.all(
        cacheNames
          .filter(
            (name) =>
              name.startsWith("offline-notes-cache-") &&
              name !== CACHE_NAME
          )
          .map((name) => caches.delete(name))
      );

      await self.clients.claim();
    })()
  );
});

// Serve cached resources when offline
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  event.respondWith(
    (async () => {
      try {
        const response = await fetch(event.request);

        if (response.ok && response.type === "basic") {
          const cache = await caches.open(CACHE_NAME);
          await cache.put(event.request, response.clone());
        }

        return response;
      } catch (error) {
        const cachedResponse = await caches.match(event.request);

        if (cachedResponse) {
          return cachedResponse;
        }

        if (event.request.mode === "navigate") {
          return (
            (await caches.match("/index.html")) ||
            Response.error()
          );
        }

        return Response.error();
      }
    })()
  );
});
