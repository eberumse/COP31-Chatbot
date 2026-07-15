# Prep prompt — turn a full brief into the app's format with AI

This is the step where **the AI does the summarising** — during preparation, in your own
secure environment, using whatever AI tool your office is cleared to use for the material.
It never involves this GitHub repo or any public service.

## How to use it

1. Open your **approved** AI tool (the one authorised for this classification of material).
2. Paste the prompt below.
3. Paste **one engagement's full briefing pack** after it (or several, one after another).
4. The AI returns a JSON object in the app's shape.
5. **Read it and fix anything** — wording in a diplomatic setting must be human-approved.
6. Collect the objects into the `engagements` array of your briefing file (see
   [`AUTHORING.md`](AUTHORING.md)), set `"isSampleData": false`, and import it on the device.

---

## The prompt (copy everything in the box)

```
You are helping prepare a concise, glanceable briefing card for a Minister to read in the
30 seconds before walking into a meeting at an international conference. Read the full
briefing material I provide and condense it into a single JSON object in EXACTLY this shape:

{
  "id": "",                     // leave "" — I will assign it
  "day": 1,                     // conference day number if known, else 1
  "start": "YYYY-MM-DDTHH:MM:SS",// local time, no timezone; use the briefing's time
  "end": "YYYY-MM-DDTHH:MM:SS",
  "title": "",                  // short, e.g. "Bilateral: Germany"
  "type": "bilateral",          // bilateral | coalition | roundtable | plenary | press | internal | side_event
  "venue": "",
  "counterpart": {              // null if there is no single counterpart (e.g. internal/press)
    "name": "",
    "title": "",
    "country": "",
    "flag": "",                 // emoji flag if known, else ""
    "profile": "",              // 2-3 sentences: their style, priorities, and any rapport
    "photo": null
  },
  "objectives": [],             // 2-3 KEY objectives to achieve
  "talkingPoints": [],          // 3-5 punchy lines — the gist the Minister must convey
  "redLines": [],               // things to avoid / sensitivities
  "desiredOutcome": "",         // one line: what success looks like
  "staffContact": ""            // supporting staffer if named
}

Rules:
- Be faithful to the source. Do NOT invent facts, numbers, names, commitments, or positions.
  If something isn't in the material, leave the field empty rather than guessing.
- Talking points must be short enough to scan at a glance — imperative phrases, not paragraphs.
- Preserve exact figures and any wording the Minister must deliver verbatim; note "(deliver
  exactly)" where the source says a line is agreed/cleared.
- Keep red lines blunt and specific.
- Output ONLY the JSON object, nothing else.

Here is the briefing material:
[PASTE THE FULL BRIEF HERE]
```

---

## Why this design is safer than a live chatbot

- The AI runs **once, during prep**, where a human can check every word — not live in the room.
- The Minister only ever sees **approved** text, so there's no chance of an AI improvising a
  wrong figure or an off-message line in front of a counterpart.
- Nothing sensitive is sent anywhere at meeting time; the app is offline.

## Tip: keep the gist short

If a talking-points list comes back long, ask the AI: *"Cut these talking points to the 3 most
important, each under 15 words."* The value of this app is the **short refresher**, not a
re-run of the full pack.
