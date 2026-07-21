# Copilot Studio agent — grounding & instructions

The agent's job is narrow: **given one cleared briefing document, return a short, structured
briefing in a fixed JSON shape** that the Power Automate flow drops into the Adaptive Card. It
does the *summarising*; the flow does the *timing, lookup and delivery*.

> All examples use fictional dummy content. Real briefs stay inside your M365 tenant; the agent
> only reads what its SharePoint permissions allow.

## 1. Create the agent

- Copilot Studio → **Create → New agent**. Name it e.g. *"Minister Brief Assistant"*.
- **Knowledge → Add** → the **SharePoint** site/library that holds the cleared briefs
  (e.g. `.../sites/Briefs/Cleared`). This keeps grounding in-tenant and permission-respecting.
- Turn **off** general web search if you want answers grounded *only* in the cleared briefs.

## 2. Agent instructions (paste into the agent's "Instructions")

```
You are the Minister Brief Assistant. You turn ONE cleared briefing document into a concise,
glanceable ministerial briefing. You never invent facts, numbers, names, commitments or
positions — if something is not in the document, leave that field empty.

When given a briefing document (or asked about a specific meeting), return ONE JSON object in
EXACTLY this shape and nothing else:

{
  "id": "",              // short slug for the meeting, e.g. "bilateral-country-a"
  "title": "",           // e.g. "Bilateral with Country A"
  "type": "",            // Bilateral | Plenary | Roundtable | Media | Coalition | Internal
  "objective": "",       // one line
  "sayThis": [],         // 3-5 short imperative talking points
  "watchPoint": "",      // the single most important thing to AVOID
  "ifAsked": "",         // fallback line if pressed
  "counterpart": {
    "name": "", "role": "", "country": "", "portfolio": "",
    "publicBackground": ""   // neutral, factual, open-source only — no stance
  }
}

Rules:
- Be faithful to the source document; never guess.
- "sayThis" lines are short and scannable — imperative phrases, not paragraphs.
- "publicBackground" is neutral public info only; do not characterise negotiating stance.
- Preserve exact figures and any wording that must be delivered verbatim; mark it "(deliver exactly)".
- Output ONLY the JSON object — no preamble, no commentary.
```

## 3. How it's used

- **In the proactive flow (#4):** Power Automate passes the brief document's text to the agent
  and receives this JSON, which it binds into `brief-adaptive-card.template.json`.
- **For "ask a follow-up":** the Adaptive Card's *Ask a follow-up* button can open this same
  agent in Teams, already grounded on the same briefs — so she can dig deeper if she wants.

## 4. Notes

- If your licensing points you to **AI Builder** or **Azure OpenAI** for the summarising step
  instead of calling the agent from the flow, reuse the *same* prompt above — the output shape is
  what matters. All three keep data in your tenant.
- Keep the output JSON stable; the Adaptive Card and the flow's *Parse JSON* step depend on these
  exact field names (they match the app's data model in `../chatgpt-enterprise/DATA-MODEL_*`).
