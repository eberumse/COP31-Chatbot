# COP31 Brief Buddy

A phone/iPad app that gives a Minister an **at-a-glance briefing for their next engagement** at
COP31 — time, venue, counterpart, the talking points to deliver, objectives, the one thing to
avoid, and a source-grounded **Ask** — without wading through the full briefing pack.

Installable (PWA), **switchable light/dark**, and phone-first. Everything here is **fictional
sample data** for testing (Singapore delegation, anonymised "Minister A", a placeholder portrait).

> ⚠️ No real or classified material is stored in this repository. See
> [`docs/SECURITY.md`](docs/SECURITY.md) for how real content is handled.

---

## The four tabs

| Tab | What it does |
|---|---|
| **Next** | The immediate engagement as a glanceable hero: countdown, venue, walk time, **risk flags**, objective, **talking points with source citations**, **watch point**, **"if asked"** line, counterpart card (photo, portfolio, **public context**), and **what changed**. |
| **Schedule** | The full day's timeline; the current/next item is flagged, briefed items open their brief. |
| **Briefs** | Pick **any** engagement and read its full AI-generated, source-grounded brief. |
| **Ask** | Pick **any** brief and ask about it. Quick modes (60-sec brief, **anticipated questions**, what changed, source trace, watch point) plus free text — with a **"not in the approved pack, won't invent"** guardrail. |

Deep links for testing: `#next`, `#schedule`, `#briefs`, `#ask`, `#settings`, `#e/<id>`, and `?theme=dark|light`.

---

## How the AI fits (two phases)

This repo is the **Minister-facing front end**. The full picture is two pieces:

1. **Staff console** *(next phase — not built yet)* — where staff upload the full briefs and an
   **approved enterprise AI** (e.g. ChatGPT Enterprise / a cleared model) summarises them into the
   structured brief the app shows, with a review/approve step.
2. **Brief Buddy** *(this app)* — displays the approved briefs and provides the source-grounded
   **Ask**. In the current mock, Ask answers from the loaded brief (rules-based); it can later call
   the same enterprise AI.

So the AI does the heavy summarising once, at prep time; the Minister sees clean, approved output.

---

## Try it

```bash
python3 -m http.server 8140      # then open http://localhost:8140
```

Because the sample dates may not match today, the app shows a **simulated "≈15:05"** so "Next"
always has something live. Use **Settings → Simulate a time** to move around the day, or the theme
control to switch **light/dark**.

**On a phone:** publish once (GitHub Pages — see [`docs/DEPLOY.md`](docs/DEPLOY.md)), open the link,
and **Add to Home Screen**.

---

## Using your own content

The app is driven by one file: [`data/schedule.sample.json`](data/schedule.sample.json). You don't
edit code — you prepare a file in the same shape and **Settings → Import** it.

- **Data model, field by field:** [`docs/AUTHORING.md`](docs/AUTHORING.md)
- **Generate it from full briefs with AI:** [`docs/PREP-PROMPT.md`](docs/PREP-PROMPT.md)
- **Security model:** [`docs/SECURITY.md`](docs/SECURITY.md)

---

## Files

| File | Purpose |
|---|---|
| `index.html` · `styles.css` · `app.js` | The app (no framework, no build step). |
| `styles.css` | Light + dark themes via `data-theme`. |
| `data/schedule.sample.json` | Fictional sample content (schema v2). |
| `assets/counterpart-minister-a.svg` | Placeholder counterpart portrait (illustrative — not a real person). |
| `manifest.webmanifest` · `service-worker.js` | PWA install + offline shell. |
| `icons/` · `docs/` | App icons · deploy / authoring / security / prep-prompt guides. |

Built as a front-end mock with fictional data. Renamed from the earlier "Minister's Briefing"
prototype; enhanced with ideas from the ChatGPT-assisted mock-up (rich brief model, source
citations, red-team questions, the Ask tab, and the command-console dark theme).
