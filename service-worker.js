/* Service worker — NETWORK-FIRST so new deploys show up immediately when online,
   with a cached copy as offline fallback. Bump CACHE on each shell change. */
var CACHE = "briefbuddy-v3";
var SHELL = [
  ".",
  "index.html",
  "styles.css",
  "app.js",
  "manifest.webmanifest",
  "data/schedule.sample.json",
  "assets/counterpart-minister-a.svg",
  "icons/icon.svg"
];

self.addEventListener("install", function (e) {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(function (c) {
    return Promise.all(SHELL.map(function (u) {
      return c.add(new Request(u, { cache: "no-cache" })).catch(function () {});
    }));
  }));
});

self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.map(function (k) { return k === CACHE ? null : caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;
  if (new URL(req.url).origin !== self.location.origin) return; // let cross-origin pass through
  // Network-first: always try the network, cache the fresh copy, fall back to cache offline.
  e.respondWith(
    fetch(req).then(function (r) {
      if (r && r.status === 200) {
        var copy = r.clone();
        caches.open(CACHE).then(function (c) { c.put(req, copy); });
      }
      return r;
    }).catch(function () {
      return caches.match(req).then(function (hit) { return hit || caches.match("index.html"); });
    })
  );
});
