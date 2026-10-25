// Offline support for the website: pages are fetched fresh when online (so a new deploy shows up) and served
// from cache when offline; hashed build assets and Google Fonts are cached on first use.
const CACHE = "ai-haebu-v1";

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      for (const key of await caches.keys()) if (key !== CACHE) await caches.delete(key);
      await self.clients.claim();
    })(),
  );
});

const put = (req, res) => caches.open(CACHE).then((c) => c.put(req, res));

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          put(req, res.clone());
          return res;
        })
        .catch(async () => (await caches.match(req)) ?? (await caches.match(self.registration.scope))),
    );
    return;
  }

  const ours = url.origin === self.location.origin;
  const fonts = url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com";
  if (!ours && !fonts) return;
  event.respondWith(
    caches.match(req).then(
      (hit) =>
        hit ??
        fetch(req).then((res) => {
          if (res.ok || res.type === "opaque") put(req, res.clone());
          return res;
        }),
    ),
  );
});
