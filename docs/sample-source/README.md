# Sample source documents + the PDF → app converter (fictional)

This folder demonstrates the **real pipeline** the app is meant to use: **source PDFs
(like those on SharePoint) → a converter → the app's data file → the app.**

> ⚠️ **Everything here is invented dummy data for testing.** These are **not** real
> government documents. Counterparts are anonymised ("Minister A", "Country A"), and every
> page is watermarked *"FICTIONAL SAMPLE — NOT A REAL GOVERNMENT DOCUMENT"*.

## The pipeline

```
generate_sample.py ──▶  *.pdf  (the fictional "source" documents)
                                 │
                        convert.py ──▶  ../../data/schedule.sample.json ──▶  the app
```

1. **`generate_sample.py`** — *stands in for whoever writes the briefs.* It produces the
   fictional source PDFs (a schedule + 10 engagement briefs). In real life these come from
   SharePoint; here we fabricate them.
2. **`convert.py`** — **the converter.** It reads the PDFs in this folder and writes the
   app's data file. This is the piece that matters for real use.

## What's here

| File | What it is |
|---|---|
| `COP31_Ministerial_Programme.pdf` | The **schedule** — a table (time · engagement · venue · type · which items have a brief). |
| `brief_01_…` … `brief_10_….pdf` | One **engagement brief** per briefed meeting. |
| `convert.py` | **The converter**: PDFs → `../../data/schedule.sample.json`. |
| `generate_sample.py` | Generates the fictional source PDFs (the fake SharePoint docs). |
| `requirements.txt` | Python deps for `convert.py` (`pypdf`, `pdfplumber`). |

## Does editing the PDFs update the app? — Yes, via the converter.

Re-run the converter and the app reflects whatever PDFs are currently in the folder:

```bash
pip install -r docs/sample-source/requirements.txt   # once
python3 docs/sample-source/convert.py                # after any PDF change
```

- **Delete a brief PDF** → its engagement disappears from the app (the meeting stays on the
  calendar, just without a tappable brief).
- **Edit a brief PDF** → its content changes in the app.
- **Add a brief PDF** (and a schedule row) → a new engagement appears.

The converter always regenerates from the *whole current folder*, so replacing an old brief
with a revised one "just works" — no stale content is left behind. Wire the converter to run
automatically on a SharePoint change (e.g. Power Automate) and point the app at the resulting
JSON, and the update becomes hands-off.

## How the converter reads a PDF

- **Schedule** (`COP31_Ministerial_Programme.pdf`): read as a table by **column position**
  (works even without ruled cell borders). Gives the week's rows, including non-briefed logistics.
- **Briefs** (`brief_*.pdf`): read by their **labelled template** — headings (`OBJECTIVE`,
  `MAIN TALKING POINTS`, …), `Flags:`, numbered talking points, `Q1. … [BOTH]`,
  `» point [INTERNAL]`, `» note [keywords: …]` — into a full engagement object.

## Honest limitations

- Works on **text-based** PDFs (exported from a system). **Scanned/image** PDFs need an OCR
  step first.
- The brief parser expects the **Brief Buddy template layout**. Real, free-form briefs would
  instead go through an **AI-extraction** step (see [`../PREP-PROMPT.md`](../PREP-PROMPT.md)) —
  same output shape, produced by a model rather than by fixed rules — and diplomatic wording
  should be **human-reviewed** before it goes live.
- A couple of fields that aren't printed in a brief (e.g. a counterpart photo) can't be
  recovered and fall back to defaults (an initials avatar).

## Using your own content

Either follow the same brief template and re-run `convert.py`, or prepare the JSON directly
(see [`../AUTHORING.md`](../AUTHORING.md)), set `meta.isSampleData` to `false`, and use
**Settings → Import** in the app.
