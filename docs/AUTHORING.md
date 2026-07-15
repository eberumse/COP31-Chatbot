# Authoring the briefing content

The entire app is driven by **one JSON file**. To use real content you prepare a file in the
same shape and load it with **Settings → Import briefing file**. You never edit the app code.

Start from [`../data/schedule.sample.json`](../data/schedule.sample.json) — copy it, delete the
sample engagements, and fill in your own.

---

## Top-level shape

```json
{
  "meta": { ... },
  "engagements": [ { ... }, { ... } ]
}
```

### `meta`

| Field | Required | Notes |
|---|---|---|
| `schemaVersion` | yes | Keep as `1`. |
| `isSampleData` | yes | Set to **`false`** for real data. (When `false`, the "sample data" warning banner and the demo simulated-time both switch off.) |
| `conference` | yes | e.g. `"COP31 — UN Climate Change Conference"`. Shown in the app bar. |
| `host` | no | e.g. `"Belém, Brazil"`. |
| `updatedLabel` | no | Free text shown in Settings, e.g. `"Updated 15 Nov, 18:30"`. Bump it each re-sync so staff can confirm the Minister has the latest. |
| `minister` | no | `{ "name", "title", "country", "flag" }`. `name` shows in the app bar. |

### `engagements[]`

One object per meeting/event. **Order doesn't matter** — the app sorts by `start` time.

| Field | Required | Notes |
|---|---|---|
| `id` | yes | Any unique string, e.g. `"d1-04"`. Used for deep links. |
| `day` | yes | Integer day number (`1`, `2`, `3`…). Groups the Agenda tabs. |
| `start` | yes | Local date-time **without timezone**, `"YYYY-MM-DDTHH:MM:SS"`, e.g. `"2026-11-15T09:30:00"`. Drives "next engagement". |
| `end` | yes | Same format. |
| `title` | yes | Short title, e.g. `"Bilateral: Germany"`. |
| `type` | no | One of `bilateral`, `coalition`, `roundtable`, `plenary`, `press`, `internal`, `side_event`. Controls the coloured tag. Anything else shows as "Meeting". |
| `venue` | yes | e.g. `"Bilateral Room 4B, Blue Zone"`. |
| `counterpart` | no | `null` for internal/press events, otherwise an object (below). |
| `objectives` | no | Array of short strings — the key things to achieve. |
| `talkingPoints` | no | Array of short strings — **the gist**. Keep to 3–5 punchy lines. |
| `redLines` | no | Array — things to avoid / sensitivities. Shown in red. |
| `desiredOutcome` | no | One line — what success looks like / the "ask". |
| `staffContact` | no | Who to turn to for this meeting. |

### `counterpart`

| Field | Required | Notes |
|---|---|---|
| `name` | yes | e.g. `"Dr. Klara Böhm"`. |
| `title` | no | e.g. `"Federal Minister for Economic Affairs & Climate Action"`. |
| `country` | no | e.g. `"Germany"`. |
| `flag` | no | An emoji flag, e.g. `"🇩🇪"`. Shown as a badge on the avatar and in the agenda. |
| `profile` | no | 2–3 sentences: style, priorities, rapport — what helps in the room. |
| `photo` | no | See below. Omit or `null` to show a coloured initials avatar (e.g. "KB") instead. |

---

## Adding a counterpart photo (keep it offline)

To stay fully offline, **embed the photo inside the JSON** as a data URI rather than linking
to a web address. Then the file is self-contained and no image is ever fetched from the
internet.

```json
"photo": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQ...=="
```

To make a data URI from an image file:

```bash
# prints a ready-to-paste data URI (crop/resize to ~200px square first to keep it small)
printf 'data:image/jpeg;base64,'; base64 -w0 counterpart.jpg
```

If you leave `photo` out, the app draws a clean initials avatar with the country flag — that
is perfectly fine and keeps files small.

---

## Copy-paste template for one engagement

```json
{
  "id": "d1-09",
  "day": 1,
  "start": "2026-11-15T16:30:00",
  "end": "2026-11-15T17:15:00",
  "title": "Bilateral: <Country>",
  "type": "bilateral",
  "venue": "<Room, Zone>",
  "counterpart": {
    "name": "<Name>",
    "title": "<Their title>",
    "country": "<Country>",
    "flag": "🏳️",
    "profile": "<Style, priorities, rapport in 2–3 sentences>",
    "photo": null
  },
  "objectives": ["<Objective 1>", "<Objective 2>"],
  "talkingPoints": ["<Point 1>", "<Point 2>", "<Point 3>"],
  "redLines": ["<Thing to avoid>"],
  "desiredOutcome": "<What success looks like in one line>",
  "staffContact": "<Name / role>"
}
```

## Checking your file before you import it

- It must be **valid JSON**. Paste it into any JSON validator, or the app will tell you if it
  can't read it.
- Every engagement needs `id`, `day`, `start`, `end`, `title`, `venue`.
- Times are **local to the conference** and have **no timezone suffix**.

Then: **Settings → Import briefing file → pick your file.** Done.
