# COP31 Brief Buddy — data model (schema v3)  ·  FOR CHATGPT ENTERPRISE

The entire app is driven by **one JSON file**. This document is the field-by-field spec so
ChatGPT can generate or edit that file correctly. The full worked example is
`SAMPLE-DATA_FOR-CHATGPT-ENTERPRISE.json`.

> **All content is fictional dummy data for testing.**

Top-level shape:

```json
{ "meta": { ... }, "schedule": [ ... ], "engagements": [ ... ] }
```

## `meta`

| Field | Notes |
|---|---|
| `app` | App title, e.g. `"COP31 Brief Buddy"`. |
| `schemaVersion` | `3`. |
| `isSampleData` | `true` shows the "sample" banner and uses a simulated demo clock. Set `false` for real data. |
| `conference` | Shown in the top bar. |
| `host` | e.g. `"Blue Zone"`. |
| `classification` | A cosmetic label shown in the app (e.g. `"RESTRICTED"`) — not a security control. |
| `updatedLabel` | Free text; bump on each re-sync so staff can confirm the latest is loaded. |
| `principal` | `{ "name", "delegation", "flag" }` — your Minister / delegation, shown in the top bar. |
| `note` | Free text disclaimer. |

## `schedule[]` — the week calendar (one row per calendar item)

| Field | Notes |
|---|---|
| `date` | `"YYYY-MM-DD"` — drives the week strip. |
| `time` / `end` | `"HH:MM"` (24h). |
| `title`, `venue` | Text. |
| `engagementId` | The `id` of a briefed engagement, or `null` for items with no brief (travel, lunch…). Linked items are tappable. |

## `engagements[]` — the briefed engagements

| Field | Notes |
|---|---|
| `id` | Unique slug, e.g. `"bilateral-country-a"`. Referenced by `schedule[].engagementId` and deep links. |
| `start` / `end` | Local date-time, **no timezone**: `"2026-11-10T15:00:00"`. Drives "Next". |
| `title`, `type`, `venue` | `type` ∈ `Bilateral` \| `Plenary` \| `Roundtable` \| `Media` \| `Coalition` \| `Internal`. |
| `classification` | Per-engagement cosmetic label. |
| `updated` | Date or date-time; shown as an "Updated …" stamp. |
| `objective` | One-line goal. |
| `tone` | Delivery tone, one line. |
| `flags` | Array of short risk chips (e.g. `"Media-sensitive"`). Words like *sensitive / avoid / no* colour them amber/red. |
| `counterpart` | See below. |
| `sayThis` | The **Main Talking Points** — 3–5 short imperative lines. |
| `watchPoint` | The single most important thing to avoid. |
| `ifAsked` | Fallback line if pressed. |
| `anticipated` | Array of `{ "q", "why", "whyTag", "consider" }`. `whyTag` ∈ `PUBLIC` \| `INTERNAL` \| `BOTH`; `consider` = array of `{ "text", "source" }` where `source` ∈ `PUBLIC` \| `INTERNAL`. |
| `publicInfo` | Array of `{ "keywords", "text" }` — indicative public-domain snippets the Ask box falls back to. Keep `text` tentative. |
| `sources` | Citations, e.g. `"brief.pdf · p.2"`. Mapped one-per-talking-point (falls back to the last). |
| `briefFile` | Optional link/path to the source doc. |

### `counterpart`

| Field | Notes |
|---|---|
| `initials`, `name`, `role`, `country`, `flag` | `initials` are the avatar fallback when there's no `photo`; `flag` is an emoji badge. |
| `portfolio` | Their brief, e.g. `"Climate negotiations · energy transition"`. |
| `photo` | Path/URL/`data:` URI, or `null` to draw an initials avatar. |
| `photoNote` | Shown under the photo, e.g. `"Illustration — not a real person"`. |
| `publicBackground` | Neutral, **factual** open-source info (role, tenure, public appearances) — do **not** characterise negotiating stance. |
| `publicSources` | Array of open-source references. |

## One complete example engagement

```json
{
  "id": "bilateral-country-a",
  "start": "2026-11-10T15:00:00",
  "end": "2026-11-10T15:30:00",
  "title": "Bilateral with Country A",
  "type": "Bilateral",
  "venue": "Bilateral Room 4B, Level 2",
  "classification": "DUMMY — Unclassified sample",
  "updated": "2026-11-10",
  "objective": "Secure Country A's support for balanced finance text and confirm alignment on carbon markets.",
  "tone": "Warm, purposeful, no new concessions.",
  "flags": ["Negotiation-sensitive", "Media-sensitive", "No new concessions"],
  "counterpart": {
    "initials": "MA", "name": "H.E. Minister A", "role": "Minister for Climate and Energy",
    "country": "Country A (major developed economy)", "flag": "🏳️",
    "portfolio": "Climate negotiations · energy transition · finance",
    "photo": null, "photoNote": "",
    "publicBackground": "Country A's Minister for Climate and Energy since 2024; delivered Country A's national statement at the opening of the high-level segment.",
    "publicSources": ["Official ministry biography", "Opening national statement"]
  },
  "sayThis": [
    "Thank Minister A for Country A's constructive role in the coalition this week.",
    "Reaffirm Singapore supports ambition where implementation flexibility is preserved.",
    "Ask Country A to back the balanced finance formulation and not reopen settled text."
  ],
  "watchPoint": "Do not commit to any finance figure or language beyond the approved envelope.",
  "ifAsked": "Officials can continue technical talks, but new language must preserve implementation flexibility.",
  "anticipated": [
    {
      "q": "Would Singapore support a higher collective finance goal if Country A moves first?",
      "why": "Minister A publicly tied ambition to 'predictable finance'; the brief flags finance as the active crunch.",
      "whyTag": "BOTH",
      "consider": [
        { "text": "No new finance commitment beyond the approved envelope.", "source": "INTERNAL" },
        { "text": "Country A has framed ambition as conditional on predictable support (indicative).", "source": "PUBLIC" }
      ]
    }
  ],
  "publicInfo": [
    { "keywords": ["block", "who", "which country"], "text": "Public commentary points to friction over the finance text, but attributions are contested and unconfirmed." }
  ],
  "sources": ["brief_03_bilateral-country-a.pdf · p.1", "brief_03_bilateral-country-a.pdf · p.2"],
  "briefFile": "docs/sample-source/brief_03_bilateral-country-a.pdf"
}
```

## Checklist for valid data

- Valid JSON; every engagement has `id`, `start`, `end`, `title`, `type`, `venue`.
- `start`/`end` are local, **no** timezone suffix.
- Every `schedule[].engagementId` matches an `engagements[].id` (or is `null`).
- `whyTag` ∈ PUBLIC/INTERNAL/BOTH; every `consider[].source` and is PUBLIC or INTERNAL.
