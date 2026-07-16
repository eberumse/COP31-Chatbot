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
  "walkTime": "",                 // e.g. "6 min walk" if known, else ""
  "version": "v1",
  "initialBriefDate": "YYYY-MM-DD",
  "currentBriefDate": "YYYY-MM-DD",
  "objective": "",                // one line
  "tone": "",                     // delivery tone, one line
  "flags": [],                    // short risk chips, e.g. "Media-sensitive"
  "counterpart": {
    "initials": "", "name": "", "role": "", "country": "", "flag": "",
    "portfolio": "",
    "photo": null, "photoNote": "",
    "publicContext": "",          // their PUBLIC line only (open sources), kept separate
    "publicSources": []
  },
  "sayThis": [],                  // 3-5 short talking points the Minister must convey
  "sources": [],                  // one citation per talking point, e.g. "brief.pdf · v4 · p.2 ¶4"
  "watchPoint": "",               // the single most important thing to AVOID
  "ifAsked": "",                  // fallback line if pressed
  "changed": [],                  // what changed since the previous version (empty if v1)
  "redTeam": [ { "q": "", "basis": "" } ]   // likely/hostile questions + why
}

Rules:
- Be faithful to the source. Never invent facts, numbers, names, commitments or positions. If
  something isn't in the material, leave the field empty rather than guessing.
- "sayThis" lines are short and scannable — imperative phrases, not paragraphs.
- Put ONLY public/open-source information in "publicContext"/"publicSources"; keep it separate from
  the internal brief.
- Preserve exact figures and any wording that must be delivered verbatim; note "(deliver exactly)".
- "redTeam" = questions the COUNTERPART or media might put to the Minister, each with a short basis.
- Output ONLY the JSON object.

Here is the briefing material:
[PASTE THE FULL BRIEF HERE]
```

Collect the objects into the `engagements` array (see [`AUTHORING.md`](AUTHORING.md)), add matching
`schedule` rows, set `"isSampleData": false`, and **Import** on the device.

Tip: if the talking points come back long, ask: *"Cut sayThis to the 3 most important, each under 15
words."* The value is the short refresher, not a re-run of the pack.
