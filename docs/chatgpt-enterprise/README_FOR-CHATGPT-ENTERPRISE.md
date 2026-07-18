# COP31 Brief Buddy — kit FOR CHATGPT ENTERPRISE  ·  START HERE

Everything you need to (A) **recreate / preview the mockup app** inside ChatGPT Enterprise,
and (B) use ChatGPT Enterprise as the **AI that summarises reference documents into the app's
content**.

> ⚠️ **All content here is fictional dummy data for testing** — anonymised "Minister A",
> "Country A", illustrative placeholders. Not a real government product, and no real or
> classified material is included.

---

## First, one clarification (it matters)

**The app is not "fed by GitHub."** GitHub only *stores and hosts the code*. The running app
gets its content from a **single data file** (`schedule.sample.json`) that ships with it, or
from a file you load in the app via **Settings → Import**.

And **files you upload into ChatGPT Enterprise become *ChatGPT's* knowledge** — the model
reads them during a chat. They are **not** a web endpoint the app can fetch from. So you don't
"point the app at ChatGPT's uploads." Instead you use ChatGPT to **produce content**, then you
**move that content into the app** (by Import). Keep those two layers separate and everything
below makes sense.

---

## What's in this folder

| File | Use it for |
|---|---|
| `COP31-Brief-Buddy_SELF-CONTAINED-mockup_FOR-CHATGPT-ENTERPRISE.html` | **Preview the whole mockup in one file.** CSS + JS + data inlined — open it in a browser, or paste it into ChatGPT Enterprise **Canvas** to render and edit. |
| `APP-SOURCE_FOR-CHATGPT-ENTERPRISE.md` | The **real multi-file source** (index.html, styles.css, app.js, manifest, service-worker). Upload so ChatGPT can rebuild/modify the app faithfully. |
| `SAMPLE-DATA_FOR-CHATGPT-ENTERPRISE.json` | The app's **data file** — the exact content + shape the app renders. |
| `DATA-MODEL_FOR-CHATGPT-ENTERPRISE.md` | **Field-by-field schema** for that data file, with an example. |
| `AI-SUMMARISER-PROMPT_FOR-CHATGPT-ENTERPRISE.md` | A ready **prompt** that turns a full briefing document into one engagement object in the app's shape. |
| `build_selfcontained.py` | Rebuilds the self-contained HTML + source doc from the live app (re-run after app changes). |

---

## Workflow A — recreate / preview the mockup

**Just look at it:** open
`COP31-Brief-Buddy_SELF-CONTAINED-mockup_FOR-CHATGPT-ENTERPRISE.html` in a browser, or paste
its contents into a **Canvas** in ChatGPT Enterprise — it renders the full app (Next, Schedule,
Briefs, Settings) with the sample data, no server needed.

**Rebuild or modify it with ChatGPT:**
1. Create a **Custom GPT** (or a **Project**) in ChatGPT Enterprise.
2. Upload as knowledge: `APP-SOURCE_FOR-CHATGPT-ENTERPRISE.md`, `SAMPLE-DATA_FOR-CHATGPT-ENTERPRISE.json`, and this README.
3. Suggested GPT instructions:
   > *"You are helping build COP31 Brief Buddy, a phone-first static PWA mockup (no framework,
   > no build step) that shows a Minister at-a-glance briefings. The app is driven entirely by
   > one JSON data file whose schema is in DATA-MODEL. Keep changes framework-free and
   > self-contained. All content is fictional sample data."*
4. Ask it to change the layout, add a tab, restyle, etc. Paste results back into Canvas to see them.

---

## Workflow B — ChatGPT Enterprise as the AI summariser

This is the "AI reads the cleared documents and produces the brief" step.

1. Create a **Custom GPT / Project**.
2. Upload as knowledge: `AI-SUMMARISER-PROMPT_FOR-CHATGPT-ENTERPRISE.md`,
   `DATA-MODEL_FOR-CHATGPT-ENTERPRISE.md`, and `SAMPLE-DATA_FOR-CHATGPT-ENTERPRISE.json` (as a
   worked example).
3. Upload **your reference briefing documents** (the ones you'd normally keep on SharePoint).
4. Ask the GPT (using the summariser prompt) to produce **one engagement object per meeting**
   in the app's JSON shape.
5. Collect the objects into the `engagements` array (+ matching `schedule` rows), set
   `meta.isSampleData` to `false` for real content, and **load it into the app via
   Settings → Import**.

That last step is how ChatGPT's output actually reaches the app — you export the JSON from the
chat and Import it. (The app also has a PDF converter, `docs/sample-source/convert.py`, if your
source is PDFs rather than a chat.)

> **Review before use:** diplomatic wording must be human-checked. Treat the AI output as a
> draft, not cleared text.

---

## Regenerating this kit

If the app changes, refresh the self-contained file and source doc:

```bash
python3 docs/chatgpt-enterprise/build_selfcontained.py
```

## Governance note

Everything here is fictional. The moment **real** briefs are uploaded to ChatGPT Enterprise (or
their summaries loaded into the app), whether that content may live in each place is a
**classification / data-handling question** — confirm it before using real material.
