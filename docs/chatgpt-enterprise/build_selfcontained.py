#!/usr/bin/env python3
"""
build_selfcontained.py  —  FOR CHATGPT ENTERPRISE

Builds, from the live app source, the upload-ready artefacts in this folder:

  1. COP31-Brief-Buddy_SELF-CONTAINED-mockup_FOR-CHATGPT-ENTERPRISE.html
     One runnable HTML file with the CSS, JavaScript and sample data INLINED
     (no external fetch, no service worker) — so ChatGPT Enterprise's Canvas can
     render the whole mockup at once, and you can preview / edit it there.

  2. APP-SOURCE_FOR-CHATGPT-ENTERPRISE.md
     The real multi-file source (index.html, styles.css, app.js, manifest,
     service-worker) in one labelled document, for faithfully rebuilding the app.

  3. SAMPLE-DATA_FOR-CHATGPT-ENTERPRISE.json
     A copy of the app's data file (the content + schema example).

Re-run after changing the app:  python3 docs/chatgpt-enterprise/build_selfcontained.py

All content is FICTIONAL DUMMY DATA for testing.
"""
import os, re, json

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(os.path.dirname(HERE))

def rd(rel):
    with open(os.path.join(REPO, rel), encoding="utf-8") as f:
        return f.read()

index = rd("index.html")
css = rd("styles.css")
app = rd("app.js")
sw = rd("service-worker.js")
manifest = rd("manifest.webmanifest")
data_raw = rd("data/schedule.sample.json")
data = json.loads(data_raw)

# The brief PDFs are NOT bundled into the single file, so hide the in-app
# "View full brief (PDF)" button in the standalone preview by clearing briefFile
# on the inlined copy. (The live app + SAMPLE-DATA json keep the real paths.)
for _e in data.get("engagements", []):
    _e["briefFile"] = ""

# ---- 1) self-contained HTML -------------------------------------------------
# a) app.js: read data from an inlined global instead of fetch(); disable SW
app_inline = app.replace(
    'fetch("data/schedule.sample.json",{cache:"no-cache"}).then(function(r){return r.json();})',
    'Promise.resolve(window.__BRIEF_DATA__)')
app_inline = app_inline.replace('if("serviceWorker" in navigator){',
                                'if(false){ /* service worker disabled in the single-file build */')
if "__BRIEF_DATA__" not in app_inline:
    raise SystemExit("ERROR: could not patch the fetch() call in app.js — has it changed?")

html = index
# inline stylesheet
html = html.replace('<link rel="stylesheet" href="styles.css" />', "<style>\n" + css + "\n</style>")
# drop external references that don't exist in a single file
for pat in [r'\s*<link rel="manifest"[^>]*/>',
            r'\s*<link rel="icon"[^>]*/>',
            r'\s*<link rel="apple-touch-icon"[^>]*/>']:
    html = re.sub(pat, "", html)
# inline the data + app.js in place of the external script
data_js = json.dumps(data, ensure_ascii=False).replace("</", "<\\/")
inline_scripts = ("<script>window.__BRIEF_DATA__=" + data_js + ";</script>\n"
                  "  <script>\n" + app_inline + "\n</script>")
html = html.replace('<script src="app.js"></script>', inline_scripts)

banner = ("<!--\n  COP31 BRIEF BUDDY — SELF-CONTAINED MOCKUP  ·  FOR CHATGPT ENTERPRISE\n"
          "  Single runnable file: CSS + JS + sample data are all inlined (no fetch, no\n"
          "  service worker). Open it, or paste it into ChatGPT Enterprise Canvas to preview.\n"
          "  ALL CONTENT IS FICTIONAL DUMMY DATA FOR TESTING — not a real government product.\n-->\n")
html = html.replace("<!DOCTYPE html>", "<!DOCTYPE html>\n" + banner, 1)

out_html = os.path.join(HERE, "COP31-Brief-Buddy_SELF-CONTAINED-mockup_FOR-CHATGPT-ENTERPRISE.html")
with open(out_html, "w", encoding="utf-8") as f:
    f.write(html)

# ---- 2) consolidated multi-file source -------------------------------------
def section(title, lang, body):
    return f"## {title}\n\n```{lang}\n{body}\n```\n\n"

src_md = (
    "# COP31 Brief Buddy — app source  ·  FOR CHATGPT ENTERPRISE\n\n"
    "> The real, multi-file source of the mockup (a plain static PWA — no framework, no\n"
    "> build step). Upload this so ChatGPT can rebuild or modify the app faithfully.\n"
    "> For a single runnable file to preview in Canvas, use the SELF-CONTAINED .html instead.\n"
    "> **All content is fictional dummy data for testing.**\n\n"
    "The app is four files: `index.html` (markup), `styles.css` (light/dark theme via\n"
    "`data-theme`), `app.js` (all logic — no framework), and one JSON data file that drives\n"
    "everything. `manifest.webmanifest` + `service-worker.js` add PWA install/offline.\n\n"
    + section("index.html", "html", index)
    + section("styles.css", "css", css)
    + section("app.js", "javascript", app)
    + section("manifest.webmanifest", "json", manifest)
    + section("service-worker.js", "javascript", sw)
)
with open(os.path.join(HERE, "APP-SOURCE_FOR-CHATGPT-ENTERPRISE.md"), "w", encoding="utf-8") as f:
    f.write(src_md)

# ---- 3) sample-data copy ----------------------------------------------------
with open(os.path.join(HERE, "SAMPLE-DATA_FOR-CHATGPT-ENTERPRISE.json"), "w", encoding="utf-8") as f:
    f.write(data_raw)

print("Built for ChatGPT Enterprise:")
print("  - COP31-Brief-Buddy_SELF-CONTAINED-mockup_FOR-CHATGPT-ENTERPRISE.html "
      f"({len(html)//1024} KB, {len(data['engagements'])} engagements inlined)")
print("  - APP-SOURCE_FOR-CHATGPT-ENTERPRISE.md")
print("  - SAMPLE-DATA_FOR-CHATGPT-ENTERPRISE.json")
