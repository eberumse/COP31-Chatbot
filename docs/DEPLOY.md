# Deploying & installing

The app is just static files, so it can be hosted almost anywhere. Below is the easiest route
(GitHub Pages) plus how to install it on a phone and how to push updates.

## Option A — GitHub Pages (free, easiest)

The app shell contains only code and fictional sample data, so publishing it is safe.

1. Push this project to a GitHub repository.
2. In the repo: **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **Deploy from a branch**.
4. Select your branch and the **`/ (root)`** folder, then **Save**.
5. Wait ~1 minute. GitHub gives you a URL like
   `https://<you>.github.io/<repo>/`.
6. Open that URL — you should see the app.

> If even the shell should not be public, host it on an internal/private web server instead.
> Any static host works (Netlify, Cloudflare Pages, an office intranet server, etc.).

## Option B — Serve locally (for testing)

```bash
python3 -m http.server 8137
# open http://localhost:8137
```

A service worker (offline support) needs `http(s)://`, so opening `index.html` directly as a
`file://` won't enable offline mode — use a server.

## Installing on the Minister's phone / iPad

**iPhone / iPad (Safari):**
1. Open the app URL in **Safari**.
2. Tap the **Share** icon (□ with ↑).
3. Tap **Add to Home Screen** → **Add**.
4. Launch it from the new home-screen icon. It now runs full-screen and works offline.

**Android (Chrome):**
1. Open the app URL in **Chrome**.
2. Tap the **⋮** menu → **Install app** / **Add to Home Screen**.

Then load the real schedule once: **Settings → Import briefing file**.

## Pushing an update to the app itself (not the content)

If you change the code (`app.js`, `styles.css`, `index.html`, icons):

1. Bump the cache name in [`../service-worker.js`](../service-worker.js): change
   `var CACHE = "briefing-v1"` to `"briefing-v2"`, etc. This tells installed devices to fetch
   the new version.
2. Re-deploy (push to GitHub / your host).
3. On the device, open the app **while online** once — it updates in the background; the next
   launch runs the new version.

> Updating **content** is different and does **not** need a redeploy — just import a new
> briefing file on the device (**Settings → Import**).

## Troubleshooting

- **Icon looks generic after install:** open the app online once so the manifest + icons cache,
  then reinstall.
- **Offline not working:** confirm you opened it over `http(s)://` (not `file://`) and loaded it
  online at least once.
- **"Next" shows a simulated time:** that only happens with **sample data** when today's date is
  outside the sample conference dates. Real data (`isSampleData: false`) always uses the real clock.
