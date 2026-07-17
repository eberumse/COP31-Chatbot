#!/usr/bin/env python3
"""
convert.py — the PDF -> app-data converter.

Reads the source PDFs in this folder and writes the app's data file,
../../data/schedule.sample.json:

  - COP31_Ministerial_Programme.pdf : the schedule, parsed as a table (by column
    position, so it works even without ruled cell borders) -> the week's rows,
    including non-briefed logistics.
  - brief_NN_<id>.pdf               : each engagement brief, parsed by its
    labelled template -> a full engagement object.

This is the "converter" step of the pipeline (documents in a folder -> app data).
Re-run it whenever the PDFs change and the app updates to match:
  * delete a brief PDF   -> that engagement disappears from the app
  * edit a brief PDF     -> its content changes in the app
  * add a brief PDF (+ a schedule row) -> a new engagement appears

Run:  python3 docs/sample-source/convert.py

Scope / honesty:
  - Works on TEXT-based PDFs (exported from a system). Scanned/image PDFs would
    need an OCR step first.
  - Expects briefs in the Brief Buddy template layout (see generate_sample.py).
    Free-form briefs would instead go through an AI-extraction step
    (see docs/PREP-PROMPT.md) — same output shape, produced by a model.
"""
import os, re, json, glob, sys

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(os.path.dirname(HERE))
OUT_JSON = os.path.join(REPO, "data", "schedule.sample.json")

MONTHS = {m: i for i, m in enumerate(
    ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], 1)}
DEFAULT_CLASS = "DUMMY — Unclassified sample"

# ---------------------------------------------------------------- utilities
def month_num(abbr):
    return MONTHS[abbr.strip().title()]

def dmy_iso(d, mon, y):
    return f"{int(y):04d}-{month_num(mon):02d}-{int(d):02d}"

def longdate_iso(s):
    # "Tue 10 Nov 2026" -> "2026-11-10"
    m = re.search(r'(\d{1,2})\s+([A-Za-z]{3})\s+(\d{4})', s)
    return dmy_iso(m.group(1), m.group(2), m.group(3)) if m else None

def initials(name):
    n = re.sub(r'(H\.E\.|Hon\.|Mr\.?|Ms\.?|Mrs\.?|Dr\.?)', '', name, flags=re.I).strip()
    words = [w for w in re.split(r'\s+', n) if w and w[0].isalpha()]
    if not words:
        return "?"
    if len(words) == 1:
        return words[0][:2].upper()
    return (words[0][0] + words[-1][0]).upper()

def flag_for(country):
    c = country.lower()
    if "singapore" in c:
        return "🇸🇬"
    if any(w in c for w in ["multilateral", "global", "cross-regional", "international", "grouping", "constituencies"]):
        return "🌐"
    return "🏳️"

# ---------------------------------------------------------------- brief parsing
HEADINGS = ["OBJECTIVE", "TONE", "COUNTERPART", "MAIN TALKING POINTS",
            "WATCH POINT", "IF ASKED", "ANTICIPATED QUESTIONS",
            "INDICATIVE PUBLIC-DOMAIN NOTES"]

def heading_of(line):
    u = line.strip().upper()
    for h in HEADINGS:
        if u.startswith(h):
            return h
    return None

def merge_by(lines, start_pat):
    """Merge wrapped continuation lines: a new logical line begins where
    start_pat matches; other lines append to the previous one."""
    rx = re.compile(start_pat)
    out = []
    for ln in lines:
        s = ln.strip()
        if not s:
            continue
        if rx.match(s) or not out:
            out.append(s)
        else:
            out[-1] += " " + s
    return out

def pages_text(path):
    import pypdf
    return [p.extract_text() or "" for p in pypdf.PdfReader(path).pages]

def parse_brief(path):
    fname = os.path.basename(path)
    m = re.match(r'brief_(\d+)_(.+)\.pdf$', fname)
    idx, eid = (int(m.group(1)), m.group(2)) if m else (0, os.path.splitext(fname)[0])

    lines = "\n".join(pages_text(path)).splitlines()
    lines = [l for l in lines if l.strip()
             and not l.strip().upper().startswith("FICTIONAL SAMPLE")
             and "not a real government document" not in l.lower()
             and "· Engagement brief ·" not in l]
    if not lines:
        raise ValueError("empty brief")
    title = lines[0].strip()

    # split into preamble (meta + flags) and heading sections
    preamble, sections, cur = [], {}, None
    for ln in lines[1:]:
        h = heading_of(ln)
        if h:
            cur = h
            sections[h] = []
        elif cur is None:
            preamble.append(ln.strip())
        else:
            sections[cur].append(ln.rstrip())

    pre = " ".join(preamble)
    def rx1(p, s, d=""):
        r = re.search(p, s)
        return r.group(1).strip() if r else d

    date_iso = longdate_iso(rx1(r'When:\s*([A-Za-z]{3}\s+\d{1,2}\s+[A-Za-z]{3}\s+\d{4})', pre))
    tm = re.search(r'(\d{2}:\d{2})\s*[–-]\s*(\d{2}:\d{2})', pre)
    start = f"{date_iso}T{tm.group(1)}:00" if (date_iso and tm) else None
    end = f"{date_iso}T{tm.group(2)}:00" if (date_iso and tm) else None
    venue = rx1(r'Where:\s*(.+?)\s*·\s*Type:', pre)
    etype = rx1(r'Type:\s*([A-Za-z]+)', pre)
    updated = longdate_iso(rx1(r'Updated:\s*([A-Za-z]{3}\s+\d{1,2}\s+[A-Za-z]{3}\s+\d{4})', pre))
    flags = [f.strip() for f in rx1(r'Flags:\s*(.+)', pre).split("·") if f.strip()]

    objective = " ".join(sections.get("OBJECTIVE", [])).strip()
    tone = " ".join(sections.get("TONE", [])).strip()
    watch = " ".join(sections.get("WATCH POINT", [])).strip()
    ifasked = " ".join(sections.get("IF ASKED", [])).strip()

    # counterpart
    cpl = [l.strip() for l in sections.get("COUNTERPART", []) if l.strip()]
    cp = {"initials": "", "name": "", "role": "", "country": "", "flag": "",
          "portfolio": "", "photo": None, "photoNote": "",
          "publicBackground": "", "publicSources": []}
    if cpl:
        cp["name"] = cpl[0]
        if len(cpl) > 1 and " · " in cpl[1]:
            cp["role"], cp["country"] = [x.strip() for x in cpl[1].split(" · ", 1)]
        fields = merge_by(cpl[2:], r'^(Portfolio:|Public background:|Public sources:)')
        for f in fields:
            if f.startswith("Portfolio:"):
                cp["portfolio"] = f.split(":", 1)[1].strip()
            elif f.startswith("Public background:"):
                cp["publicBackground"] = f.split(":", 1)[1].strip()
            elif f.startswith("Public sources:"):
                cp["publicSources"] = [x.strip() for x in f.split(":", 1)[1].split(",") if x.strip()]
        cp["initials"] = initials(cp["name"])
        cp["flag"] = flag_for(cp["country"])

    # talking points
    say = [re.sub(r'^\d+\.\s*', '', p).strip()
           for p in merge_by(sections.get("MAIN TALKING POINTS", []), r'^\d+\.\s')]

    # anticipated questions
    anticipated = []
    cur_q = None
    for ln in merge_by(sections.get("ANTICIPATED QUESTIONS", []), r'^(Q\d+\.|Why it may come up:|»)'):
        mq = re.match(r'^Q\d+\.\s*(.*?)\s*\[(BOTH|PUBLIC|INTERNAL)\]\s*$', ln)
        mw = re.match(r'^Why it may come up:\s*(.*)$', ln)
        mc = re.match(r'^»\s*(.*?)\s*\[(INTERNAL|PUBLIC)\]\s*$', ln)
        if mq:
            cur_q = {"q": mq.group(1).strip(), "why": "", "whyTag": mq.group(2), "consider": []}
            anticipated.append(cur_q)
        elif mw and cur_q is not None:
            cur_q["why"] = mw.group(1).strip()
        elif mc and cur_q is not None:
            cur_q["consider"].append({"text": mc.group(1).strip(), "source": mc.group(2)})

    # public-domain notes
    publicInfo = []
    for ln in merge_by(sections.get("INDICATIVE PUBLIC-DOMAIN NOTES", []), r'^»'):
        mp = re.match(r'^»\s*(.*?)\s*\[keywords:\s*(.*?)\]\s*$', ln)
        if mp:
            kws = [k.strip() for k in mp.group(2).split(",") if k.strip()]
            publicInfo.append({"keywords": kws, "text": mp.group(1).strip()})

    sources = [f"{fname} · p.1"] + ([f"{fname} · p.2"] if len(say) > 2 else [])
    return {
        "id": eid, "_idx": idx, "start": start, "end": end, "title": title,
        "type": etype, "venue": venue, "classification": DEFAULT_CLASS,
        "updated": updated, "objective": objective, "tone": tone, "flags": flags,
        "counterpart": cp, "sayThis": say, "watchPoint": watch, "ifAsked": ifasked,
        "anticipated": anticipated, "publicInfo": publicInfo,
        "sources": sources, "briefFile": f"docs/sample-source/{fname}",
    }

# ---------------------------------------------------------------- schedule table
def parse_schedule(path):
    import pdfplumber
    pdf = pdfplumber.open(path)
    hx = {}
    for w in pdf.pages[0].extract_words():
        if w["text"] in ("TIME", "ENGAGEMENT", "VENUE", "TYPE", "BRIEF"):
            hx.setdefault(w["text"], w["x0"])
    # a word belongs to the rightmost column whose header starts at/left of its
    # left edge (columns are left-aligned, so content can be wider than the label)
    order = [("time", hx["TIME"]), ("title", hx["ENGAGEMENT"]),
             ("venue", hx["VENUE"]), ("type", hx["TYPE"]), ("brief", hx["BRIEF"])]
    def col_of(x0):
        c = order[0][0]
        for nm, sx in order:
            if x0 >= sx - 6:
                c = nm
            else:
                break
        return c

    records, cur_date, cur = [], None, None
    for page in pdf.pages:
        words = sorted(page.extract_words(), key=lambda w: (round(w["top"]), w["x0"]))
        rows = []
        for w in words:
            if rows and abs(w["top"] - rows[-1][0]) < 4:
                rows[-1][1].append(w)
            else:
                rows.append([w["top"], [w]])
        for _, ws in rows:
            cells = {"time": "", "title": "", "venue": "", "type": "", "brief": ""}
            for w in sorted(ws, key=lambda w: w["x0"]):
                c = col_of(w["x0"])
                cells[c] = (cells[c] + " " + w["text"]).strip()
            rowtext = " ".join(cells[c] for c in ("time", "title", "venue", "type", "brief")).strip()
            up = rowtext.upper()
            if (not rowtext or up.startswith("FICTIONAL SAMPLE") or "NOT A REAL GOVERNMENT" in up
                    or "MINISTERIAL PROGRAMME" in up or up.startswith("MINISTER FOR")
                    or up.startswith("TIME ENGAGEMENT")):
                continue
            md = re.match(r'^[A-Z]{3}\s+(\d{1,2})\s+([A-Z]{3})\s+(\d{4})$', rowtext)
            if md:
                cur_date, cur = dmy_iso(md.group(1), md.group(2), md.group(3)), None
                continue
            tc = cells["time"]
            if re.search(r'\d{2}:\d{2}\s*[–-]', tc):          # a start time with a range dash -> new record
                cur = {"date": cur_date, **{k: cells[k] for k in ("time", "title", "venue", "type", "brief")}}
                records.append(cur)
            elif cur is not None:                              # wrapped continuation -> append
                for k in ("time", "title", "venue", "type", "brief"):
                    if cells[k]:
                        cur[k] = (cur[k] + " " + cells[k]).strip()

    out = []
    for r in records:
        tr = re.sub(r'\s+', '', r["time"])
        m = re.match(r'^(\d{2}:\d{2})[–-](\d{2}:\d{2})$', tr)
        if not m:
            continue
        mb = re.search(r'brief_(\d+)', r["brief"])
        out.append({"date": r["date"], "time": m.group(1), "end": m.group(2),
                    "title": r["title"].strip(), "venue": r["venue"].strip(),
                    "brief_ref": int(mb.group(1)) if mb else None})
    return out

def parse_meta(schedule_pdf):
    meta = {"app": "COP31 Brief Buddy", "schemaVersion": 3, "isSampleData": True,
            "conference": "COP31 — UN Climate Change Conference", "host": "Blue Zone",
            "classification": DEFAULT_CLASS,
            "updatedLabel": "Sample data · generated from source PDFs by convert.py",
            "principal": {"name": "Minister for Sustainability & Environment",
                          "delegation": "Singapore", "flag": "🇸🇬"},
            "note": ("ALL CONTENT IS FICTIONAL DUMMY DATA FOR TESTING. Counterparts are "
                     "anonymised ('Minister A'). Generated from the source PDFs in "
                     "docs/sample-source/ by convert.py.")}
    for l in "\n".join(pages_text(schedule_pdf)).splitlines():
        if l.strip().startswith("Minister for") and "·" in l:
            parts = [p.strip() for p in l.split("·")]
            meta["principal"]["name"] = parts[0]
            if len(parts) > 1:
                meta["principal"]["delegation"] = parts[1].replace(" delegation", "").strip()
            if len(parts) > 2:
                meta["conference"] = parts[2].strip()
            break
    return meta

# ---------------------------------------------------------------- assemble
def main():
    sched_pdf = os.path.join(HERE, "COP31_Ministerial_Programme.pdf")
    brief_pdfs = sorted(glob.glob(os.path.join(HERE, "brief_*.pdf")))

    engagements, failures = [], []
    for p in brief_pdfs:
        try:
            engagements.append(parse_brief(p))
        except Exception as ex:
            failures.append((os.path.basename(p), str(ex)))
    idmap = {e["_idx"]: e["id"] for e in engagements}

    engmap = {e["id"]: e for e in engagements}
    schedule = []
    if os.path.exists(sched_pdf):
        for r in parse_schedule(sched_pdf):
            eid = idmap.get(r["brief_ref"]) if r["brief_ref"] else None
            if eid:   # briefed row: take clean title/venue/time from the brief itself
                e = engmap[eid]
                schedule.append({"date": e["start"][:10], "time": e["start"][11:16],
                                 "end": e["end"][11:16], "title": e["title"],
                                 "venue": e["venue"], "engagementId": eid})
            else:     # logistics row: only the schedule PDF has it
                schedule.append({"date": r["date"], "time": r["time"], "end": r["end"],
                                 "title": r["title"], "venue": r["venue"], "engagementId": None})
    else:
        failures.append(("COP31_Ministerial_Programme.pdf", "missing"))

    # any briefed engagement not already represented in the schedule -> add a row
    in_sched = {s["engagementId"] for s in schedule if s["engagementId"]}
    for e in engagements:
        if e["id"] not in in_sched and e["start"]:
            schedule.append({"date": e["start"][:10], "time": e["start"][11:16],
                             "end": e["end"][11:16], "title": e["title"],
                             "venue": e["venue"], "engagementId": e["id"]})
    schedule.sort(key=lambda r: (r["date"] or "", r["time"] or ""))

    for e in engagements:
        e.pop("_idx", None)
    engagements.sort(key=lambda e: e["start"] or "")

    data = {"meta": parse_meta(sched_pdf), "schedule": schedule, "engagements": engagements}
    with open(OUT_JSON, "w") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"convert.py: {len(engagements)} engagements, {len(schedule)} schedule rows -> {os.path.relpath(OUT_JSON, REPO)}")
    if failures:
        print("  WARNINGS:")
        for name, why in failures:
            print(f"   - {name}: {why}")
    return 0

if __name__ == "__main__":
    sys.exit(main())
