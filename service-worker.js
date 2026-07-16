/* Service worker — precache the app shell so it works fully offline.
   Bump CACHE when you change any shell file. Briefing content is stored
   separately in localStorage on the device, not in this cache. */
var CACHE = "briefbuddy-v2";
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
    // Add individually so one missing optional asset (e.g. a PNG) can't fail the whole install.
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
  // Network-first for the sample data (so edits show up), cache fallback offline.
  if (req.url.indexOf("schedule.sample.json") > -1) {
    e.respondWith(fetch(req).then(function (r) {
      var copy = r.clone(); caches.open(CACHE).then(function (c) { c.put(req, copy); });
      return r;
    }).catch(function () { return caches.match(req); }));
    return;
  }
  // Cache-first for everything else in the shell.
  e.respondWith(caches.match(req).then(function (hit) {
    return hit || fetch(req).then(function (r) {
      if (r && r.status === 200 && r.type === "basic") {
        var copy = r.clone(); caches.open(CACHE).then(function (c) { c.put(req, copy); });
      }
      return r;
    }).catch(function () { return caches.match("index.html"); });
  }));
});
