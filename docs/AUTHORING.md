# Authoring content (schema v2)

The whole app is driven by **one JSON file**. To use real content, prepare a file in this shape
and load it via **Settings → Import**. You never edit the app code. Start from
[`../data/schedule.sample.json`](../data/schedule.sample.json).

```json
{ "meta": { ... }, "schedule": [ ... ], "engagements": [ ... ] }
```

## `meta`

| Field | Notes |
|---|---|
| `app` | App title, e.g. `"COP31 Brief Buddy"`. |
| `schemaVersion` | `2`. |
| `isSampleData` | **`false`** for real data (turns off the "sample" banner and demo simulated-time). |
| `conference` | Shown in the top bar. |
| `classification` | A label shown in the app, e.g. `"RESTRICTED"` — cosmetic, not a security control. |
| `updatedLabel` | Free text, bump on each re-sync so staff can confirm the latest is loaded. |
| `principal` | `{ "name", "delegation", "flag" }` — your Minister / delegation, shown in the top bar. |

## `schedule[]` — the week timeline (calendar)

One row per calendar item, across as many days as you like — the **Schedule** tab builds a
tappable week strip from the distinct `date`s.

| Field | Notes |
|---|---|
| `date` | `"YYYY-MM-DD"` — which day the item is on (drives the week calendar). |
| `time` / `end` | `"HH:MM"` (24h). |
| `title`, `venue` | Text. |
| `engagementId` | The `id` of a briefed engagement, or `null` for items with no brief (lunch, huddle…). Linked items are tappable and show a "•" on the day. |

## `engagements[]` — the briefed engagements

| Field | Notes |
|---|---|
| `id` | Unique string, e.g. `"bilat-country-a"`. Used by deep links and the schedule. |
| `start` / `end` | Local date-time, no timezone: `"2026-07-16T15:15:00"`. Drives "Next". |
| `title`, `type`, `venue` | `type`: `Bilateral` \| `Plenary` \| `Roundtable` \| `Media` \| `Coalition` \| `Internal`. |
| `updated` | Date or date-time of this brief, e.g. `"2026-07-16T14:42:00"` — shown as an "Updated …" stamp. |
| `objective` | One-line goal. |
| `tone` | Delivery tone, e.g. `"Warm, purposeful, no new concessions."` |
| `flags` | Array of short risk chips (e.g. `"Media-sensitive"`). Words like *sensitive / avoid / no* colour them amber/red. |
| `sayThis` | The **Main Talking Points** (3–5 short lines) — the gist. |
| `sources` | Citations, e.g. `"brief.pdf · v4 · p.2 ¶4"`. Mapped one-per-talking-point (falls back to the last). |
| `watchPoint` | The single most important thing to avoid. |
| `ifAsked` | Fallback line if pressed (used by the Ask box; also fold copies into `anticipated[].consider`). |
| `anticipated` | Array of `{ "q", "why", "whyTag", "consider" }`. `q` = likely question; `why` = why it may come up (tie it to the counterpart's profile + developments); `whyTag` = `PUBLIC` \| `INTERNAL` \| `BOTH`; `consider` = array of `{ "text", "source" }` where `source` = `PUBLIC` \| `INTERNAL`. Shown under **Anticipated questions**. |
| `publicInfo` | Array of `{ "keywords", "text" }` — indicative public-domain snippets the Ask box falls back to when a question isn't answered by the brief. Keep `text` tentative. |
| `briefFile` | Optional link to the source doc (`"#"` in the sample). |

### `counterpart`

| Field | Notes |
|---|---|
| `initials`, `name`, `role`, `country`, `flag` | `initials` are the avatar fallback when there's no `photo`. `flag` is an emoji badge. |
| `portfolio` | Their brief, e.g. `"Climate negotiations · energy transition"`. |
| `photo` | Path/URL/`data:` URI to a portrait, or `null` to show the initials avatar. |
| `photoNote` | Shown under the photo, e.g. `"Illustration — not a real person"`. |
| `publicBackground` | Neutral, **factual** public info about the counterpart (role, tenure, public appearances) — kept **separate** from the internal brief. Avoid characterising their negotiating stance. |
| `publicSources` | Array of public/open-source references. |

## Photos, offline-safe

Reference a file (`"assets/portrait.jpg"`) or, to keep the file self-contained, embed it:

```bash
printf 'data:image/jpeg;base64,'; base64 -w0 portrait.jpg   # resize to ~256px first
```

`null` → the app draws an initials avatar with the country flag. That's fine.

## Checklist

- Valid JSON; every engagement has `id`, `day`, `start`, `end`, `title`, `venue`.
- `start`/`end` are local, no timezone suffix.
- `engagementId`s in `schedule` match `engagements[].id`.
- Then **Settings → Import**.
