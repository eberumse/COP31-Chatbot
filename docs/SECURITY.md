# Security & privacy model

This app is designed so that **sensitive briefing material never has to be uploaded anywhere** —
not to GitHub, not to Claude, not to any server.

## The core idea: separate the *code* from the *content*

| | Where it lives | Sensitive? |
|---|---|---|
| **App shell** (`index.html`, `app.js`, `styles.css`, icons, service worker) | GitHub + wherever you host it | No — it's just code. |
| **Sample content** (`data/schedule.sample.json`) | GitHub | No — it's fictional. |
| **Real briefings** | **Only on the Minister's device**, loaded via *Import* | Yes — and it stays on the device. |

Because the shell contains no secrets, you can host it on a public service (e.g. GitHub Pages)
for convenience. The real schedule is a separate file that is **side-loaded on the device** and
stored locally in the browser. It is never committed, never uploaded, never transmitted.

## What happens at runtime

- After the first load, the app runs **entirely offline** (a service worker caches the shell).
- Imported content is stored in the browser's local storage **on that device only**.
- The app makes **no network requests** for your content and has **no analytics or telemetry**.
- There is **no AI call at runtime** — the Minister only ever sees text that was prepared and
  approved in advance.

## Preparing the real content securely

The summarising ("turn the full brief into a short gist") is a **preparation task**, done in
your own environment with a tool cleared for that material:

1. Use your office's **approved AI tool** (whatever is authorised for the classification level)
   with the prompt in [`PREP-PROMPT.md`](PREP-PROMPT.md) to condense each brief into the app's
   JSON format. If no AI tool is cleared for the material, a staffer condenses it by hand — the
   app works the same either way.
2. A human **reviews and approves** the wording (essential for diplomatic accuracy).
3. Save the result as a JSON file and get it to the device through your **normal secure
   channel** (the same way you'd send any restricted document).
4. On the device: **Settings → Import briefing file**.

At no point does the real content go through this GitHub repository or any public AI service.

## Keeping real data out of the repository

A [`.gitignore`](../.gitignore) is included that ignores common "real data" filenames
(`*.private.json`, `data/real*.json`, `briefing.json`, etc.) as a safety net. Still:

- **Never** commit a real schedule file.
- Keep `isSampleData` as `false` **only** in files you import on the device — not in anything
  you push to GitHub.
- If you fork/clone this for real use, consider making the repository **private** regardless,
  since even venue/timing patterns can be sensitive.

## Threat-model notes (worth a conversation with your IT/security team)

- **Device security matters most.** Since content lives on the device, rely on the device's
  passcode/biometric lock and mobile-device-management policy.
- **Clearing data:** *Settings → Reset to sample data* removes imported content from the
  device. Removing the web app / clearing site data also wipes it.
- **Shoulder-surfing:** the app is designed to be glanced at; be mindful of who can see the
  screen in a plenary hall.
- **Hosting:** if even the *existence* of the shell is sensitive, host it on an internal/private
  server instead of a public one — the app doesn't care where it's served from.
