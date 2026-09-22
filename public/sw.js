/**
 * MyAnchor service worker.
 *
 * Hand-written on purpose: `next-pwa` is a webpack plugin and Next 16 builds
 * with Turbopack, so a generated worker never reaches the browser. Bump
 * VERSION whenever the caching rules below change — the activate handler drops
 * every cache that doesn't match it.
 */
const VERSION = "v1";
const CACHE = `myanchor-${VERSION}`;
const OFFLINE_URL = "/offline.html";

/** Cache-first paths: content-hashed or otherwise immutable assets. */
const STATIC_PATHS = /^\/(_next\/static|icons|illustration)\//;

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll([OFFLINE_URL]))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Never touch cross-origin requests or anything server-rendered per user.
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/api/")) return;

  // Navigations: network-first, offline page as the fallback. Pages are
  // server-rendered and user-specific, so they are deliberately not cached.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() =>
        caches.match(OFFLINE_URL).then((cached) => cached ?? Response.error()),
      ),
    );
    return;
  }

  if (!STATIC_PATHS.test(url.pathname)) return;

  event.respondWith(
    caches.match(request).then(
      (cached) =>
        cached ??
        fetch(request).then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        }),
    ),
  );
});

/**
 * Push handlers. Subscriptions are not wired up yet (no backend storing them),
 * so these stay dormant until the web-push endpoints land.
 */
self.addEventListener("push", (event) => {
  if (!event.data) return;

  let payload;
  try {
    payload = event.data.json();
  } catch {
    payload = { title: "MyAnchor", body: event.data.text() };
  }

  event.waitUntil(
    self.registration.showNotification(payload.title ?? "MyAnchor", {
      body: payload.body,
      icon: "/icons/web-app-manifest-192x192.png",
      badge: "/icons/favicon-96x96.png",
      data: { url: payload.url ?? "/" },
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const target = event.notification.data?.url ?? "/";

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if ("focus" in client) return client.focus();
        }
        return self.clients.openWindow(target);
      }),
  );
});
