# Copilot Studio build-kit — proactive pre-meeting brief (#4)  ·  START HERE

Everything needed to hand to whoever configures this in your **Microsoft 365 tenant**. The goal:
**~15 minutes before each meeting, the Minister receives a glanceable brief in Teams — no typing,
no chatbot to open.** The summary is produced from the cleared briefs on SharePoint, entirely
inside your tenant.

> ⚠️ All content here is **fictional dummy data for testing**. These are build instructions +
> templates, not a running system — the agent and flow are created in your Microsoft portal
> (which can't be reached from the code side).

## Why this route

Copilot Studio + Power Automate keep everything **inside your M365 security boundary** and
**respect SharePoint permissions**, and Copilot can **read the briefs directly** — so there's no
external hosting and no separate convert-to-JSON pipeline. This is the classified-safe path.

## How it works

```
Outlook: "event starting soon"          (timing — the Minister's calendar)
      │
      ▼
Find the cleared brief in SharePoint     (mapping — an ID on the event)
      │
      ▼
Copilot Studio agent summarises it       (grounded, in-tenant → structured JSON)
      │
      ▼
Build the Adaptive Card                  (glanceable — objective, points, watch point)
      │
      ▼
Post to the Minister in Teams            (proactive — she opens nothing)
```

## What's in this folder

| File | What it is |
|---|---|
| `AGENT-INSTRUCTIONS_COPILOT-STUDIO.md` | How to create the agent + the exact **instructions/prompt** to paste in (produces the structured brief). |
| `POWER-AUTOMATE-FLOW_pre-meeting-push.md` | The **flow**, step by step: trigger → find brief → summarise → card → post to Teams. |
| `brief-adaptive-card.template.json` | The **Adaptive Card** (Brief Buddy layout) with `${…}` placeholders — the card she receives. |
| `brief-adaptive-card.data.json` | The **data object** the flow must produce to fill the card (also lets you preview template + data). |
| `brief-adaptive-card.sample.json` | A **fully-populated** card — paste into the designer to see the end result immediately. |

## Do it in this order

1. **Preview the card.** Open <https://adaptivecards.io/designer>, choose host app **Microsoft
   Teams**, paste `brief-adaptive-card.sample.json`. That's what lands in Teams — tweak styling here.
2. **Set the mapping convention** (put `brief:<id>` on each calendar event; name SharePoint files
   to match). See the flow doc.
3. **Create the agent** and paste its instructions. Point its knowledge at the cleared briefs library.
4. **Build the flow** per `POWER-AUTOMATE-FLOW_*` — trigger, lookup, summarise, card, post.
5. **Test** with a dummy calendar event + a fictional brief before anything real.

## Prerequisites (check with IT)

- Licences: **Copilot Studio**, **Power Automate**, Teams, SharePoint; and an AI capability for the
  summarising step (the agent, **AI Builder**, or **Azure OpenAI** — whichever you're licensed for).
- An account for the flow with permission to the Minister's calendar and the cleared briefs library.

## Honest scoping

- The **mapping** (meeting → correct brief) is the part to get right — use the event-ID convention.
- Treat AI summaries as **drafts**; the card says "review before use", and diplomatic wording should
  be human-checked.
- Confirm your tenant's **Copilot/AI data-handling** terms before real cleared content flows through.

## What carries over from the app work

The Adaptive Card mirrors **Brief Buddy's** layout, and the agent's output shape matches the app's
**data model** (`../chatgpt-enterprise/DATA-MODEL_FOR-CHATGPT-ENTERPRISE.md`). So the design and the
summariser prompt you already have transfer directly — the web app can stay as the fuller,
tap-to-explore view, while this push is the zero-effort nudge before each meeting.
