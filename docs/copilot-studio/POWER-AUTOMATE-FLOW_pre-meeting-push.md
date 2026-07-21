# Power Automate flow — proactive pre-meeting brief push (#4)

This is the "she does nothing" path: ~15 minutes before each meeting, a flow finds the cleared
brief, summarises it, and posts a glanceable card to the Minister in **Teams**. No typing, no
opening a chatbot.

```
Outlook: event starting soon  →  find the brief in SharePoint  →  summarise (agent/AI)
   →  build the Adaptive Card  →  post it to the Minister in Teams
```

> Everything runs inside your M365 tenant. The flow should run as an account whose permissions
> are appropriate for the cleared briefs. All content here is fictional.

## Prerequisites

- Power Automate + the Minister's mailbox/calendar access; **Teams**; the SharePoint briefs library.
- A summarising capability — one of: the **Copilot Studio agent** (see `AGENT-INSTRUCTIONS_*`),
  **AI Builder** ("Create text with GPT"), or an **Azure OpenAI** deployment. (Licensing decides which.)

## The meeting → brief mapping (do this first)

The flow needs to know *which* brief goes with *which* calendar event. Pick one convention:

- **Recommended — an ID on the event:** put a tag in the event, e.g. a category or a line in the
  body like `brief:bilateral-country-a`. Name the SharePoint file to match
  (`brief_03_bilateral-country-a.pdf`). Reliable and explicit.
- **Or a mapping list:** a small SharePoint list of `event subject → brief file`.
- **Or search by subject/counterpart:** search the library for the event's subject; least
  reliable (fuzzy matches).

## Build the flow

1. **Trigger — Office 365 Outlook: _"When an upcoming event is starting soon"_**
   - Calendar: the Minister's. This fires per event, near its start (drives the ~15-min timing).

2. **Compose — derive the brief ID** from the event (read the category / parse `brief:<id>` from
   the body, or look it up in the mapping list).

3. **SharePoint — _Get files (properties only)_** on the Cleared library, filtered to the file
   for that ID (or **_Get file content_** once you have the item).

4. **_Get file content_ / extract text** — for a PDF/Word source, get its text (SharePoint returns
   file content; use a text-extraction step if needed, or point the agent's knowledge at the file).

5. **Summarise — call your chosen engine** with the agent instructions/prompt, passing the brief
   text. Expect back the **JSON** object (id, title, type, objective, sayThis, watchPoint, ifAsked,
   counterpart).

6. **_Parse JSON_** — schema = the object in `AGENT-INSTRUCTIONS_*` — so later steps can use each field.

7. **Compose — the card data** — build the object in `brief-adaptive-card.data.json`: the parsed
   fields **plus** `minutesUntil`, `startTime`/`endTime` (from the event), and `briefUrl` (the
   SharePoint link to the PDF).

8. **Compose — the card** — take `brief-adaptive-card.template.json` and bind the data (either use
   Adaptive Card templating, or build the final JSON directly from dynamic content).

9. **Teams — _Post card in a chat or channel_** → posted by **Flow bot** → recipient **the Minister**
   (a private chat). This is the proactive message that lands before the meeting.

## Optional niceties

- **Quiet hours / opt-out:** add a condition so it doesn't fire outside conference days.
- **"Ask a follow-up":** the card's Submit button can hand off to the Copilot Studio agent for a
  deeper question — chat only *if she wants it*, never required.
- **Fallback:** if no brief is found for an event, post a lighter card ("No cleared brief loaded
  for this meeting") instead of failing silently.

## Honest caveats

- **Mapping is the fiddly part** — invest in the event-ID convention (step above); fuzzy subject
  matching will misfire.
- **Summariser accuracy** — treat output as a draft; the card footer says "review before use".
  Diplomatic wording should be human-checked.
- **Timing** — the Outlook "starting soon" trigger fires near the event start; if you need a firm
  "15 min before", a scheduled flow that looks ahead 15 min on the calendar is an alternative.
- **Permissions** — the flow reads the calendar and the cleared library; run it under an account
  cleared for that content, and confirm your tenant's Copilot/AI data-handling terms for the
  summarising step.
