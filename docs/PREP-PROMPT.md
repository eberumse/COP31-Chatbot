# Prep prompt — turn a full brief into a Brief Buddy engagement

Use this in your **approved enterprise AI** (e.g. ChatGPT Enterprise, or another model cleared for
the material) to condense a full briefing pack into one engagement object in the app's v2 shape.
Paste the prompt, then the brief. **Review the output** before loading it — diplomatic wording must
be human-checked.

```
You produce a concise, glanceable ministerial briefing card from the full briefing material I give
you. Return ONE JSON object in EXACTLY this shape (COP31 Brief Buddy, schema v2):

{
  "id": "",                       // short slug, e.g. "bilat-country-a"
  "day": 1,
  "start": "YYYY-MM-DDTHH:MM:SS",  // local time, no timezone
  "end": "YYYY-MM-DDTHH:MM:SS",
  "title": "",                    // e.g. "Bilateral with Minister A"
  "type": "Bilateral",            // Bilateral | Plenary | Roundtable | Media | Coalition | Internal
  "venue": "",
  "updated": "YYYY-MM-DDTHH:MM:SS",  // date/time of this brief
  "objective": "",                // one line
  "tone": "",                     // delivery tone, one line
  "flags": [],                    // short risk chips, e.g. "Media-sensitive"
  "counterpart": {
    "initials": "", "name": "", "role": "", "country": "", "flag": "",
    "portfolio": "",
    "photo": null, "photoNote": "",
    "publicBackground": "",       // NEUTRAL, FACTUAL public info (role, tenure, public appearances) — no stance
    "publicSources": []
  },
  "sayThis": [],                  // 3-5 short Main Talking Points the Minister must convey
  "sources": [],                  // one citation per talking point, e.g. "brief.pdf · v4 · p.2 ¶4"
  "watchPoint": "",               // the single most important thing to AVOID
  "ifAsked": "",                  // fallback line if pressed
  "anticipated": [                // questions BEYOND the brief that could come up
    { "q": "", "why": "",         // why it may arise — tie to the counterpart profile + developments
      "whyTag": "BOTH",           // PUBLIC | INTERNAL | BOTH
      "consider": [ { "text": "", "source": "INTERNAL" } ] }  // points to consider; source: PUBLIC | INTERNAL
  ],
  "publicInfo": [ { "keywords": [], "text": "" } ]  // indicative public snippets for the Ask fallback (tentative)
}

Rules:
- Be faithful to the source. Never invent facts, numbers, names, commitments or positions. If
  something isn't in the material, leave the field empty rather than guessing.
- "sayThis" lines are short and scannable — imperative phrases, not paragraphs.
- "publicBackground" holds ONLY neutral, factual public info (open sources) — do NOT characterise
  their negotiating stance. Keep it separate from the internal brief.
- Preserve exact figures and any wording that must be delivered verbatim; note "(deliver exactly)".
- "anticipated" = questions BEYOND the brief the counterpart/media might raise; for each, explain why
  (tie to the counterpart's profile + recent developments) and give "points to consider" (not cleared
  one-liners). Tag every element PUBLIC (indicative/open sources) or INTERNAL (cleared brief).
- "publicInfo" holds only indicative, clearly-tentative public snippets, used when a question isn't
  answered by the brief. Never state public info as fact.
- Output ONLY the JSON object.

Here is the briefing material:
[PASTE THE FULL BRIEF HERE]
```

Collect the objects into the `engagements` array (see [`AUTHORING.md`](AUTHORING.md)), add matching
`schedule` rows, set `"isSampleData": false`, and **Import** on the device.

Tip: if the talking points come back long, ask: *"Cut sayThis to the 3 most important, each under 15
words."* The value is the short refresher, not a re-run of the pack.
