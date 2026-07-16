# COP31 Brief Buddy

A phone/iPad app that gives a Minister an **at-a-glance briefing for their next engagement** at
COP31 — time, venue, counterpart, the talking points to deliver, objectives, the one thing to
avoid, and a source-grounded **Ask** — without wading through the full briefing pack.

Installable (PWA), dark theme, and phone-first. Everything here is **fictional sample data** for
testing (Singapore delegation, anonymised "Minister A", an illustrative avatar).

> ⚠️ No real or classified material is stored in this repository. See
> [`docs/SECURITY.md`](docs/SECURITY.md) for how real content is handled.

---

## The tabs

| Tab | What it does |
|---|---|
| **Next** | The immediate engagement as a glanceable hero: countdown, venue, **risk flags**, objective, **Main Talking Points with source citations**, **watch point**, **"if asked"** line, and a counterpart card (illustrated avatar, portfolio, factual **public background**). |
| **Schedule** | The full day's timeline; the current/next item is flagged, briefed items open their brief. |
| **Briefs** | Pick **any** engagement (via **Choose a meeting**), read its full source-grounded brief once — objective, Main Talking Points, watch point, **anticipated questions**, counterpart — then **ask about it** in a free-text box (source-grounded, with a **"not in the approved pack, won't invent"** guardrail). Reading + asking are merged here. |
| **Settings** | Import/export content, simulate a time, install info. |

Deep links for testing: `#next`, `#schedule`, `#briefs`, `#settings`, `#e/<id>`.

---

## How the AI fits (two phases)

This repo is the **Minister-facing front end**. The full picture is two pieces:

1. **AI agent** *(next phase — not built yet)* — points at wherever the cleared documents live
   (a SharePoint folder / ChatGPT Enterprise space) and **summarises the latest cleared docs
   automatically** into the structured brief the app shows. No separate "officer re-runs AI" step
   and no manual review gate — staff just keep the latest cleared document and delete superseded
   ones; the agent always summarises what's currently there.
2. **Brief Buddy** *(this app)* — displays those briefs and provides the source-grounded **Ask**.
   In the current mock, Ask answers from the loaded brief (rules-based); it can later call the same
   enterprise AI.

So the AI does the summarising automatically from the document source; the Minister sees clean output.

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
