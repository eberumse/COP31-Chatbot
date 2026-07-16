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

## `schedule[]` — the full day timeline

| Field | Notes |
|---|---|
| `time` / `end` | `"HH:MM"` (24h). |
| `title`, `venue` | Text. |
| `status` | `Completed` \| `Next` \| `Upcoming` (the app also recomputes from the clock). |
| `engagementId` | The `id` of a briefed engagement, or `null` for items with no brief (lunch, huddle…). Linked items are tappable. |

## `engagements[]` — the briefed engagements

| Field | Notes |
|---|---|
| `id` | Unique string, e.g. `"bilat-country-a"`. Used by deep links and the schedule. |
| `day` | Integer day number. |
| `start` / `end` | Local date-time, no timezone: `"2026-07-16T15:15:00"`. Drives "Next". |
| `title`, `type`, `venue` | `type`: `Bilateral` \| `Plenary` \| `Roundtable` \| `Media` \| `Coalition` \| `Internal`. |
| `walkTime` | e.g. `"6 min walk"`. |
| `version` | e.g. `"v4"`. |
| `initialBriefDate` | `"YYYY-MM-DD"` — when the brief was first issued (shown in **What changed**). |
| `currentBriefDate` | date or date-time of the current version (shown in **What changed**). |
| `objective` | One-line goal. |
| `tone` | Delivery tone, e.g. `"Warm, purposeful, no new concessions."` |
| `flags` | Array of short risk chips (e.g. `"Media-sensitive"`). Words like *sensitive / avoid / no* colour them amber/red. |
| `sayThis` | The talking points (3–5 short lines) — **the gist**. |
| `sources` | Citations, e.g. `"brief.pdf · v4 · p.2 ¶4"`. Mapped one-per-talking-point (falls back to the last). |
| `watchPoint` | The single most important thing to avoid. |
| `ifAsked` | Fallback line if pressed. |
| `changed` | Array of changes since the previous version. |
| `redTeam` | Array of `{ "q", "basis" }` — anticipated questions + why (shown under **Ask → Anticipated questions**). |
| `briefFile` | Optional link to the source doc (`"#"` in the sample). |

### `counterpart`

| Field | Notes |
|---|---|
| `initials`, `name`, `role`, `country`, `flag` | `initials` are the avatar fallback when there's no `photo`. `flag` is an emoji badge. |
| `portfolio` | Their brief, e.g. `"Climate negotiations · energy transition"`. |
| `photo` | Path/URL/`data:` URI to a portrait, or `null` to show the initials avatar. |
| `photoNote` | Shown under the photo, e.g. `"Illustrative placeholder — not a real person"`. |
| `publicContext` | Their public line (kept **separate** from the internal brief). |
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
