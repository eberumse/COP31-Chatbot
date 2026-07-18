# AI summariser prompt — briefing document → app engagement  ·  FOR CHATGPT ENTERPRISE

Use this in ChatGPT Enterprise (a Custom GPT / Project with your reference documents uploaded)
to condense a full briefing pack into **one engagement object** in COP31 Brief Buddy's shape
(schema v3 — see `DATA-MODEL_FOR-CHATGPT-ENTERPRISE.md`). Paste the prompt, then point it at (or
paste) the brief. **Review every output** — diplomatic wording must be human-checked before use.

> **All content is fictional dummy data for testing.** Do not enter real classified material
> unless your ChatGPT Enterprise workspace is cleared for it.

---

## The prompt

```
You produce a concise, glanceable ministerial briefing card from the full briefing material I
give you (uploaded documents or pasted text). Return ONE JSON object in EXACTLY this shape
(COP31 Brief Buddy, schema v3):

{
  "id": "",                          // short slug, e.g. "bilateral-country-a"
  "start": "YYYY-MM-DDTHH:MM:SS",    // local time, no timezone
  "end": "YYYY-MM-DDTHH:MM:SS",
  "title": "",                       // e.g. "Bilateral with Country A"
  "type": "Bilateral",               // Bilateral | Plenary | Roundtable | Media | Coalition | Internal
  "venue": "",
  "classification": "",              // cosmetic label, e.g. "RESTRICTED"
  "updated": "YYYY-MM-DD",           // date of this brief
  "objective": "",                   // one line
  "tone": "",                        // delivery tone, one line
  "flags": [],                       // short risk chips, e.g. "Media-sensitive"
  "counterpart": {
    "initials": "", "name": "", "role": "", "country": "", "flag": "",
    "portfolio": "",
    "photo": null, "photoNote": "",
    "publicBackground": "",          // NEUTRAL, FACTUAL public info (role, tenure, public appearances) — no stance
    "publicSources": []
  },
  "sayThis": [],                     // 3-5 short Main Talking Points the Minister must convey
  "watchPoint": "",                  // the single most important thing to AVOID
  "ifAsked": "",                     // fallback line if pressed
  "anticipated": [                   // questions BEYOND the brief that could come up
    { "q": "", "why": "",            // why it may arise — tie to the counterpart profile + developments
      "whyTag": "BOTH",              // PUBLIC | INTERNAL | BOTH
      "consider": [ { "text": "", "source": "INTERNAL" } ] }   // points to consider; source: PUBLIC | INTERNAL
  ],
  "publicInfo": [ { "keywords": [], "text": "" } ],  // indicative public snippets for the Ask fallback (tentative)
  "sources": [],                     // one citation per talking point, e.g. "brief.pdf · p.2"
  "briefFile": ""                    // link/path to the source doc, or ""
}

Rules:
- Be faithful to the source. Never invent facts, numbers, names, commitments or positions. If
  something isn't in the material, leave the field empty rather than guessing.
- "sayThis" lines are short and scannable — imperative phrases, not paragraphs.
- "publicBackground" holds ONLY neutral, factual public info — do NOT characterise their
  negotiating stance. Keep it separate from the internal brief.
- Preserve exact figures and any wording that must be delivered verbatim; note "(deliver exactly)".
- "anticipated" = questions BEYOND the brief the counterpart/media might raise; for each, explain
  why (tie to the counterpart's profile + recent developments) and give "points to consider"
  (not cleared one-liners). Tag every element PUBLIC (indicative/open) or INTERNAL (cleared).
- "publicInfo" holds only indicative, clearly-tentative public snippets, used when a question
  isn't answered by the brief. Never state public info as fact.
- Output ONLY the JSON object.

Here is the briefing material:
[POINT TO THE UPLOADED DOCUMENT, OR PASTE THE FULL BRIEF HERE]
```

---

## Assembling the app data file

1. Run the prompt once per meeting → collect the objects into the `engagements` array.
2. Add a matching `schedule` row for each (and `engagementId: null` rows for logistics like
   travel/lunch). See `DATA-MODEL_FOR-CHATGPT-ENTERPRISE.md`.
3. Fill in `meta` (set `isSampleData` to `false` for real content).
4. In the app: **Settings → Import** the finished JSON file.

Tip: if talking points come back long, ask *"Cut sayThis to the 3 most important, each under 15
words."* The value is the short refresher, not a re-run of the pack.

## How this reaches the app

ChatGPT's answer lives in the chat — the app can't read it directly. You **copy the JSON out and
Import it** into the app (Settings → Import). If instead your sources are PDFs, the repo's
`docs/sample-source/convert.py` can parse them into the same JSON automatically.
