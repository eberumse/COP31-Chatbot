# Minister's Briefing — COP31

A phone/iPad app that gives the Minister a **glanceable refresher right before each
engagement**: the time, venue, who they're meeting, the key talking points, objectives,
red lines to avoid, and the desired outcome — without wading through the full briefing pack.

It is a **Progressive Web App (PWA)**: it installs to the home screen, opens like a normal
app, and **works fully offline**. There is **no server and no login**. All briefing content
lives **only on the device**.

> ⚠️ **The content in this repository is 100% fictional sample data** (a made-up country,
> "Republic of Meridia", and invented counterparts) so the app can be built and tested in
> the open. **No real or sensitive briefing material is stored here.** See
> [`docs/SECURITY.md`](docs/SECURITY.md) for how real data is kept off GitHub.

---

## What it looks like

| Next engagement | Agenda | Full briefing |
|---|---|---|
| Opens straight to the next meeting with a countdown ("in 10 min"), counterpart, talking points, objectives, red lines. | The full day, tab by tab, with the current/next meeting flagged. | Tap any engagement for the complete card. |

Three tabs: **Next** · **Agenda** · **Settings**.

---

## The idea in one line

> The AI does the summarising **during preparation** — condensing your long briefs into a
> short gist — and only that finished gist is loaded into the app. In the meeting, the app
> just **displays** it. Nothing is sent anywhere, and there is no risk of an AI improvising a
> talking point live in front of a counterpart.

You still get "AI summarises the key points" — it just happens at prep time, not meeting
time. See [`docs/PREP-PROMPT.md`](docs/PREP-PROMPT.md) for a ready-made prompt that turns a
full brief into the app's format using whatever AI tool your office is cleared to use.

---

## Try it now (2 minutes)

You need any static web server (because service workers don't run from `file://`).

```bash
# from the project folder:
python3 -m http.server 8137
# then open http://localhost:8137 in a browser
```

Because the sample conference dates may be in the past/future relative to today, the app
shows a **simulated "Day 1, 09:20"** so you always see a live "next engagement". Go to
**Settings → Simulate a time** to jump to any moment, or **Reset to sample data** to start over.

## Put it on the Minister's phone or iPad

1. Publish the app shell once (e.g. **GitHub Pages** — see [`docs/DEPLOY.md`](docs/DEPLOY.md)).
   The shell contains only code + sample data, so hosting it publicly is fine.
2. On the phone, open the link in **Safari (iPhone/iPad)** or **Chrome (Android)**.
3. **Add to Home Screen** (Safari: Share → *Add to Home Screen*).
4. Open it from the home screen — it now runs like an app and works offline.
5. To load the **real** schedule, use **Settings → Import briefing file** and pick the JSON
   file you prepared. That file stays on the device; it never touches GitHub.

Works on **any modern phone** — an iPad is not required.

---

## Replacing the sample data with your own

The whole app is driven by one file: [`data/schedule.sample.json`](data/schedule.sample.json).
You don't edit code — you just prepare a JSON file in the same shape and import it.

- **How to author it:** [`docs/AUTHORING.md`](docs/AUTHORING.md) (the data model, field by field).
- **How to generate it from full briefs with AI:** [`docs/PREP-PROMPT.md`](docs/PREP-PROMPT.md).
- **How to keep real data off GitHub:** [`docs/SECURITY.md`](docs/SECURITY.md).

"Easy re-sync": when the schedule changes mid-conference, prepare an updated file and
**Import** it again — the app refreshes and keeps working offline.

---

## How it's built (for whoever maintains it)

Plain HTML/CSS/JavaScript — **no frameworks, no build step, no dependencies**. That keeps it
easy to audit (important for a security-conscious office) and trivial to host.

| File | Purpose |
|---|---|
| `index.html` | App shell (markup only). |
| `styles.css` | All styling; light + automatic dark mode. |
| `app.js` | All logic: next-engagement, agenda, detail, import/export, offline. |
| `data/schedule.sample.json` | Fictional sample content. Replace via **Import** (not by committing real data). |
| `manifest.webmanifest` | PWA metadata (name, icons, home-screen behaviour). |
| `service-worker.js` | Offline cache of the app shell. |
| `icons/` | App icons. |
| `docs/` | Deploy / authoring / security / prep-prompt guides. |

Deep links for testing: `#agenda`, `#settings`, `#e/<engagement-id>`.

---

## Privacy & security summary

- **No sensitive data in this repo** — only fictional sample content.
- **Real briefings never leave the device** — they're imported locally and stored on the
  device only; nothing is uploaded.
- **No network at runtime** — after first load the app is fully offline.
- **No AI in the meeting** — summaries are prepared in advance and only displayed.

Full detail: [`docs/SECURITY.md`](docs/SECURITY.md).
