# Sample source documents (fictional)

This folder holds the **fictional "source" documents** for the COP31 Brief Buddy demo — the
kind of files that, in a real deployment, would live on **SharePoint** (a ministerial programme
and a set of engagement briefs). They exist so the app can be populated from realistic-looking
source material instead of hand-written JSON.

> ⚠️ **Everything here is invented dummy data for testing.** These are **not** real government
> documents. Counterparts are anonymised ("Minister A", "Country A"). Every page is watermarked
> *"FICTIONAL SAMPLE — NOT A REAL GOVERNMENT DOCUMENT"*.

## What's here

| File | What it is |
|---|---|
| `COP31_Ministerial_Programme.pdf` | The **schedule** — a table of the Minister's week (time · engagement · venue · type · which items have a full brief). |
| `brief_01_strategy-session.pdf` … `brief_10_closing-plenary.pdf` | One **engagement brief** per briefed meeting (objective, tone, counterpart, main talking points, watch point, anticipated questions with INTERNAL/PUBLIC tags). |
| `generate_sample.py` | The generator that produces **both** the PDFs **and** the app's data file from one source, so they can't drift apart. |

## How this maps to the app

The app is driven by a single file, [`../../data/schedule.sample.json`](../../data/schedule.sample.json).
`generate_sample.py` is the single source of truth: it writes that JSON **and** renders these PDFs
from the same content. So each brief PDF corresponds to one engagement in the app, and the app's
source citations (e.g. `brief_03_bilateral-country-a.pdf · p.1`) point back at these files.

```
generate_sample.py ──┬──▶ ../../data/schedule.sample.json   (drives the app)
                      └──▶ *.pdf                              (the "source" briefs)
```

This mirrors the real pipeline described in [`../PREP-PROMPT.md`](../PREP-PROMPT.md): source briefs →
structured app data. In production the conversion step would be done by an AI agent reading the
cleared documents; here it's a deterministic script over fictional content.

## Regenerating

```bash
python3 docs/sample-source/generate_sample.py
```

PDF rendering uses Chromium. Point `CHROME_BIN` at any Chrome/Chromium build, or have one on
`PATH`. If none is found, the JSON is still written and PDF rendering is skipped.

## Using your own content

To load real content instead, prepare a file in the same shape (see
[`../AUTHORING.md`](../AUTHORING.md)), set `meta.isSampleData` to `false`, and use
**Settings → Import** in the app. You never edit app code.
