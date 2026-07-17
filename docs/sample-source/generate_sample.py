#!/usr/bin/env python3
# Single source of truth for the COP31 Brief Buddy FICTIONAL sample content.
# Run:  python3 docs/sample-source/generate_sample.py
# Emits: (1) the app data file data/schedule.sample.json
#        (2) a schedule PDF + one brief PDF per engagement in docs/sample-source/
# All content is invented dummy data for testing.
import json, os, html, subprocess, shutil, tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(os.path.dirname(HERE))   # docs/sample-source -> repo root
OUT_SRC = HERE
HTML_TMP = tempfile.mkdtemp(prefix="briefgen-")
# Chromium is used to render the HTML briefs to PDF. Point CHROME_BIN at any
# Chrome/Chromium build, or install one on PATH. If none is found, the JSON is
# still written and PDF rendering is skipped.
CHROME = (os.environ.get("CHROME_BIN") or shutil.which("chromium") or
          shutil.which("chromium-browser") or shutil.which("google-chrome") or
          "/opt/pw-browsers/chromium-1194/chrome-linux/chrome")

os.makedirs(OUT_SRC, exist_ok=True)
os.makedirs(HTML_TMP, exist_ok=True)

META = {
    "app": "COP31 Brief Buddy",
    "schemaVersion": 3,
    "isSampleData": True,
    "conference": "COP31 — UN Climate Change Conference",
    "host": "Blue Zone",
    "classification": "DUMMY — Unclassified sample",
    "updatedLabel": "Sample data · 9 Nov 2026, 08:00",
    "principal": {"name": "Minister for Sustainability & Environment", "delegation": "Singapore", "flag": "🇸🇬"},
    "note": "ALL CONTENT IS FICTIONAL DUMMY DATA FOR TESTING. Counterparts are anonymised ('Minister A'). Any avatar is an illustration, not a real person. 'Public' items are indicative placeholders, not real reporting.",
}

# Non-briefed logistics rows (engagementId = null). Briefed rows are added automatically from ENGAGEMENTS.
FILLER = [
    {"date": "2026-11-09", "time": "13:00", "end": "16:00", "title": "Arrival / travel to host city", "venue": "In transit"},
    {"date": "2026-11-10", "time": "08:30", "end": "09:00", "title": "Morning delegation huddle", "venue": "Delegation Office"},
    {"date": "2026-11-10", "time": "13:00", "end": "14:00", "title": "Working lunch", "venue": "Delegates Lounge"},
    {"date": "2026-11-12", "time": "09:00", "end": "09:20", "title": "Delegation huddle", "venue": "Delegation Office"},
    {"date": "2026-11-14", "time": "16:00", "end": "17:00", "title": "Departure", "venue": "In transit"},
]

ENGAGEMENTS = [
    {
        "id": "strategy-session", "date": "2026-11-09", "start": "2026-11-09T17:00:00", "end": "2026-11-09T18:00:00",
        "title": "Delegation Strategy Session", "type": "Internal", "venue": "Delegation Office",
        "updated": "2026-11-09T08:00:00",
        "objective": "Align the delegation on red lines, priorities and division of labour before the high-level segment opens.",
        "tone": "Focused, decisive — listen, then direct.",
        "flags": ["Internal", "Sets the week's red lines"],
        "counterpart": {"initials": "SD", "name": "Singapore delegation", "role": "Negotiators & senior officials",
            "country": "Singapore", "flag": "🇸🇬", "portfolio": "Negotiation teams across all tracks", "photo": None,
            "publicBackground": "Internal coordination meeting; not on the public record.", "publicSources": []},
        "sayThis": [
            "Confirm the three priorities: mitigation ambition, Article 6 operational rules, and adaptation support for partners.",
            "Restate the red line: no new quantified finance commitments beyond the approved envelope.",
            "Assign leads for each negotiating track and set the evening report-back time.",
        ],
        "watchPoint": "Don't let the session reopen settled internal positions — this is for direction, not debate.",
        "ifAsked": "Track leads hold delegated authority within the agreed mandate; escalate anything beyond it to the Minister.",
        "anticipated": [
            {"q": "If finance talks stall, is there flexibility on the timing of disbursement language?",
             "why": "Finance is expected to be the week's crunch point and officials will want a fallback; the mandate fixes the envelope but is silent on sequencing.",
             "whyTag": "INTERNAL",
             "consider": [
                 {"text": "Envelope is fixed; sequencing/timing may be explored at officials level without new commitment.", "source": "INTERNAL"},
                 {"text": "Any movement returns to the Minister before it is tabled.", "source": "INTERNAL"}]},
            {"q": "How should the delegation handle media approaches during the week?",
             "why": "High-visibility week; consistent lines prevent mixed messaging across the team.",
             "whyTag": "INTERNAL",
             "consider": [{"text": "All media routed through the approved doorstop lines; no freelancing.", "source": "INTERNAL"}]},
        ],
        "publicInfo": [
            {"keywords": ["agenda", "priorities", "what is singapore focusing on", "focus"],
             "text": "Singapore's public COP31 priorities centre on practical implementation, high-integrity carbon markets and support for the region."}],
    },
    {
        "id": "national-statement", "date": "2026-11-10", "start": "2026-11-10T11:00:00", "end": "2026-11-10T11:15:00",
        "title": "National Statement — High-Level Segment", "type": "Plenary", "venue": "Plenary Hall",
        "updated": "2026-11-10T07:30:00",
        "objective": "Deliver Singapore's national statement: ambitious, implementable, and partnership-focused.",
        "tone": "Statesmanlike, warm, forward-looking.",
        "flags": ["Public remarks", "On the record", "Verbatim where marked"],
        "counterpart": {"initials": "AD", "name": "All delegations", "role": "High-Level Segment audience",
            "country": "Multilateral setting", "flag": "🌐", "portfolio": "Heads of delegation and ministers", "photo": None,
            "publicBackground": "Open, broadcast session; all statements are on the public record.", "publicSources": ["Conference public programme"]},
        "sayThis": [
            "Open by welcoming the presidency's leadership and progress since COP30. (deliver warmly)",
            "State Singapore's commitment to net zero by 2050 and to high-integrity carbon markets. (deliver exactly)",
            "Call for outcomes that are ambitious and implementable for small and developing states.",
            "Reaffirm Singapore's support to regional partners on adaptation and capacity.",
        ],
        "watchPoint": "Do not deviate from the cleared text on the net-zero and carbon-market lines.",
        "ifAsked": "Detailed positions are for the negotiating tracks; the statement reflects Singapore's settled national position.",
        "anticipated": [
            {"q": "Will Singapore raise its 2030 target?",
             "why": "Media and NGOs press all speakers on headline ambition; the statement mentions 2050 but not a revised 2030 figure.",
             "whyTag": "BOTH",
             "consider": [
                 {"text": "Stay with the cleared NDC language; no new target announced here.", "source": "INTERNAL"},
                 {"text": "Public commentary is pushing all parties for stronger 2030 numbers (indicative).", "source": "PUBLIC"}]},
            {"q": "Is Singapore's net-zero pledge conditional?",
             "why": "The credibility of pledges is a running public theme this week.",
             "whyTag": "PUBLIC",
             "consider": [{"text": "Use the cleared framing: firm goal, pragmatic pathway.", "source": "INTERNAL"}]},
        ],
        "publicInfo": [
            {"keywords": ["target", "2030", "ndc", "pledge", "net zero"],
             "text": "Singapore has publicly committed to net zero by 2050; specifics of any updated near-term target should come from cleared statements, not speculation."}],
    },
    {
        "id": "bilateral-country-a", "date": "2026-11-10", "start": "2026-11-10T15:00:00", "end": "2026-11-10T15:30:00",
        "title": "Bilateral with Country A", "type": "Bilateral", "venue": "Bilateral Room 4B, Level 2",
        "updated": "2026-11-10T12:30:00",
        "objective": "Secure Country A's support for balanced finance text and confirm alignment on carbon markets.",
        "tone": "Warm, purposeful, no new concessions.",
        "flags": ["Negotiation-sensitive", "Media-sensitive", "No new concessions"],
        "counterpart": {"initials": "MA", "name": "H.E. Minister A", "role": "Minister for Climate and Energy",
            "country": "Country A (major developed economy)", "flag": "🏳️",
            "portfolio": "Climate negotiations · energy transition · finance",
            "photo": "assets/counterpart-minister-a.svg", "photoNote": "Illustration — not a real person",
            "publicBackground": "Country A's Minister for Climate and Energy since 2024; delivered Country A's national statement at the opening of the high-level segment.",
            "publicSources": ["Official ministry biography", "Opening national statement"]},
        "sayThis": [
            "Thank Minister A for Country A's constructive role in the coalition this week.",
            "Reaffirm Singapore supports ambition where implementation flexibility is preserved.",
            "Ask Country A to back the balanced finance formulation and not reopen settled text.",
            "Confirm both sides want operational Article 6 rules concluded here.",
        ],
        "watchPoint": "Do not commit to any finance figure or language beyond the approved envelope.",
        "ifAsked": "Officials can continue technical talks, but new language must preserve implementation flexibility.",
        "anticipated": [
            {"q": "Would Singapore support a higher collective finance goal if Country A moves first?",
             "why": "Minister A publicly tied ambition to 'predictable finance' in Country A's opening statement; the brief flags finance as the active crunch, so a direct linkage is likely.",
             "whyTag": "BOTH",
             "consider": [
                 {"text": "No new finance commitment beyond the approved envelope.", "source": "INTERNAL"},
                 {"text": "If pressed, officials may continue technical talks preserving flexibility.", "source": "INTERNAL"},
                 {"text": "Country A has framed ambition as conditional on predictable support (indicative).", "source": "PUBLIC"}]},
            {"q": "Can Singapore and Country A issue a joint line on carbon markets?",
             "why": "Both delegations have signalled carbon markets as a priority; a joint signal could add momentum.",
             "whyTag": "BOTH",
             "consider": [{"text": "Openness in principle to a short joint line, subject to clearance — do not agree wording on the spot.", "source": "INTERNAL"}]},
            {"q": "How does Singapore define 'implementation flexibility'?",
             "why": "The phrase recurs in both the cleared brief and Minister A's public remarks, so a clarification request is likely.",
             "whyTag": "BOTH",
             "consider": [{"text": "Use the framing already in the brief; avoid a new definition that could be quoted.", "source": "INTERNAL"}]},
        ],
        "publicInfo": [
            {"keywords": ["block", "blocking", "stall", "who", "which country", "which countries"],
             "text": "Public commentary points to friction between major economies over the finance text, but attributions are contested and unconfirmed."},
            {"keywords": ["profile", "who is minister a", "background", "counterpart"],
             "text": "Minister A has held the Climate and Energy portfolio since 2024 and spoke at the opening — see the Public background panel."}],
    },
    {
        "id": "coalition-hac", "date": "2026-11-11", "start": "2026-11-11T09:30:00", "end": "2026-11-11T10:30:00",
        "title": "High Ambition Coalition Meeting", "type": "Coalition", "venue": "Room Amazonia 1",
        "updated": "2026-11-11T07:45:00",
        "objective": "Coordinate a joint coalition push to hold the line on mitigation ambition in the cover text.",
        "tone": "Collegial, energising, unity-focused.",
        "flags": ["Coalition-sensitive", "Hold the line"],
        "counterpart": {"initials": "HC", "name": "High Ambition Coalition", "role": "Coalition ministers",
            "country": "Cross-regional grouping", "flag": "🤝", "portfolio": "Mitigation ambition · cover decision", "photo": None,
            "publicBackground": "A cross-regional grouping that periodically issues joint ministerial statements; membership and statements are public.",
            "publicSources": ["Coalition joint statements"]},
        "sayThis": [
            "Reaffirm Singapore's commitment to keeping 1.5°C within reach in the cover text.",
            "Propose the coalition speak with one voice against watering down mitigation language.",
            "Offer Singapore to help bridge with implementation-focused parties.",
        ],
        "watchPoint": "Avoid signing onto any collective finance pledge on the coalition's behalf.",
        "ifAsked": "Singapore supports ambition and can help broker, but keeps its own finance envelope.",
        "anticipated": [
            {"q": "Will Singapore co-sign a coalition statement calling for a finance figure?",
             "why": "Coalition statements often bundle mitigation with finance asks; the mandate keeps the two separate.",
             "whyTag": "BOTH",
             "consider": [
                 {"text": "Can co-sign mitigation-ambition language; not a specific finance figure.", "source": "INTERNAL"},
                 {"text": "Coalition partners have publicly pushed headline finance numbers (indicative).", "source": "PUBLIC"}]},
            {"q": "Can Singapore bridge to the parties resisting stronger language?",
             "why": "Singapore's 'ambition + implementation' framing positions it as a natural bridge-builder.",
             "whyTag": "INTERNAL",
             "consider": [{"text": "Offer good offices; report any opening to the delegation lead.", "source": "INTERNAL"}]},
        ],
        "publicInfo": [
            {"keywords": ["coalition", "who is in", "members", "statement"],
             "text": "The High Ambition Coalition periodically issues public joint statements; treat specific membership claims as indicative unless confirmed."}],
    },
    {
        "id": "roundtable-finance", "date": "2026-11-11", "start": "2026-11-11T14:00:00", "end": "2026-11-11T15:00:00",
        "title": "Climate Finance Roundtable", "type": "Roundtable", "venue": "Summit Studio C",
        "updated": "2026-11-11T11:00:00",
        "objective": "Position Singapore as a practical partner for scalable, high-integrity transition finance.",
        "tone": "Pragmatic, partnership-oriented.",
        "flags": ["Finance-sensitive", "Partner ask likely"],
        "counterpart": {"initials": "FP", "name": "Finance ministers & MDBs", "role": "Roundtable participants",
            "country": "Multilateral", "flag": "🏦", "portfolio": "Transition finance · blended finance · MDB reform", "photo": None,
            "publicBackground": "Multilateral development banks and finance ministries publish transition-finance materials and communiqués publicly.",
            "publicSources": ["Partner public communiqués"]},
        "sayThis": [
            "Stress credible taxonomies and high-integrity transition plans as the basis for scaling finance.",
            "Point to regional capacity-building and blended finance as concrete collaboration.",
            "Invite partners into a practical post-COP workplan.",
        ],
        "watchPoint": "Do not announce new funding or quantified commitments.",
        "ifAsked": "Offer officials-level follow-up on specific project pipelines.",
        "anticipated": [
            {"q": "Is Singapore pledging capital today?",
             "why": "The roundtable format and partners' 'mobilisation' calls may invite a quantified pledge.",
             "whyTag": "BOTH",
             "consider": [
                 {"text": "No new funding or numbers today; offer pipeline follow-up.", "source": "INTERNAL"},
                 {"text": "Partners publicly emphasise mobilising investment at scale (indicative).", "source": "PUBLIC"}]},
            {"q": "What makes a transition plan 'credible' to Singapore?",
             "why": "The integrity of transition finance is a repeated public theme.",
             "whyTag": "PUBLIC",
             "consider": [{"text": "Use the brief's language on credible taxonomies and high-integrity plans.", "source": "INTERNAL"}]},
        ],
        "publicInfo": [
            {"keywords": ["how much", "number", "figure", "amount", "pledge", "committed"],
             "text": "Public materials discuss large mobilisation targets in general terms, but no figure is agreed — do not cite a number."}],
    },
    {
        "id": "bilateral-country-b", "date": "2026-11-12", "start": "2026-11-12T10:30:00", "end": "2026-11-12T11:00:00",
        "title": "Bilateral with Country B", "type": "Bilateral", "venue": "Bilateral Room 3A",
        "updated": "2026-11-12T07:30:00",
        "objective": "Deepen practical cooperation with Country B on adaptation and capacity, and hear its priorities for the endgame.",
        "tone": "Friendly, attentive, solutions-focused.",
        "flags": ["Relationship-building", "Adaptation focus"],
        "counterpart": {"initials": "MB", "name": "H.E. Minister B", "role": "Minister for Environment",
            "country": "Country B (regional partner)", "flag": "🏳️", "portfolio": "Adaptation · disaster resilience · capacity building",
            "photo": None, "photoNote": "",
            "publicBackground": "Country B's Minister for Environment; has spoken publicly on adaptation finance and regional resilience.",
            "publicSources": ["Ministry statements", "Regional forum remarks"]},
        "sayThis": [
            "Acknowledge Country B's leadership on adaptation and regional resilience.",
            "Offer to expand Singapore's capacity-building and training cooperation.",
            "Explore where Singapore and Country B can align in the final package.",
        ],
        "watchPoint": "Do not raise expectations of direct bilateral financial transfers.",
        "ifAsked": "Cooperation is through capacity, training and knowledge-sharing, not direct transfers.",
        "anticipated": [
            {"q": "Will Singapore support Country B's call for a dedicated adaptation finance goal?",
             "why": "Minister B has publicly championed adaptation finance; the mandate supports adaptation in principle but not a specific new goal.",
             "whyTag": "BOTH",
             "consider": [
                 {"text": "Support adaptation prominence in the text; no endorsement of a specific new finance goal.", "source": "INTERNAL"},
                 {"text": "Country B has publicly pressed for stronger adaptation finance (indicative).", "source": "PUBLIC"}]},
            {"q": "Can Singapore scale up training programmes for Country B?",
             "why": "Capacity-building is a concrete, low-risk deliverable both sides value.",
             "whyTag": "INTERNAL",
             "consider": [{"text": "Signal willingness to expand existing programmes; specifics via officials.", "source": "INTERNAL"}]},
        ],
        "publicInfo": [
            {"keywords": ["adaptation", "finance", "who is minister b", "background"],
             "text": "Country B has publicly emphasised adaptation and regional resilience — see the Public background panel; treat specifics as indicative."}],
    },
    {
        "id": "media-doorstop", "date": "2026-11-12", "start": "2026-11-12T17:30:00", "end": "2026-11-12T17:45:00",
        "title": "Media Doorstop", "type": "Media", "venue": "Press Zone, Level 1",
        "updated": "2026-11-12T15:00:00",
        "objective": "Keep public messaging disciplined and avoid previewing negotiation trade-offs.",
        "tone": "Clear, calm, non-speculative.",
        "flags": ["Media-sensitive", "Use approved lines"],
        "counterpart": {"initials": "ME", "name": "Accredited media", "role": "Conference press pool",
            "country": "International media", "flag": "🎙️", "portfolio": "Public communications", "photo": None,
            "publicBackground": "Conference press pool; briefings and coverage are publicly available.", "publicSources": ["Conference press schedule"]},
        "sayThis": [
            "Negotiations are active and Singapore is engaging constructively.",
            "A good outcome must be ambitious and implementable.",
            "Singapore will keep working with partners towards consensus.",
        ],
        "watchPoint": "Do not comment on private bilateral discussions.",
        "ifAsked": "You will not characterise other parties' positions while talks are ongoing.",
        "anticipated": [
            {"q": "Which country is blocking the deal?",
             "why": "Media are actively seeking attribution as the conference nears its endgame.",
             "whyTag": "PUBLIC",
             "consider": [
                 {"text": "Do not characterise other parties' positions while talks continue.", "source": "INTERNAL"},
                 {"text": "Reports name various parties, but none is confirmed — don't repeat speculation (indicative).", "source": "PUBLIC"}]},
            {"q": "What will Singapore concede to get a deal?",
             "why": "Trade-offs are live and journalists will probe for a headline.",
             "whyTag": "INTERNAL",
             "consider": [{"text": "Stay on approved lines; do not preview trade-offs.", "source": "INTERNAL"}]},
        ],
        "publicInfo": [
            {"keywords": ["block", "blocking", "which country", "who"],
             "text": "Various parties have been named in public commentary as holding out, but nothing is confirmed — avoid repeating it."}],
    },
    {
        "id": "article6-ministerial", "date": "2026-11-13", "start": "2026-11-13T09:30:00", "end": "2026-11-13T10:30:00",
        "title": "Ministerial Consultation on Article 6", "type": "Roundtable", "venue": "Room Tapajós",
        "updated": "2026-11-13T07:30:00",
        "objective": "Push to conclude operational Article 6 rules with high environmental integrity.",
        "tone": "Technical but accessible, constructive, firm on integrity.",
        "flags": ["Technical", "Integrity red line"],
        "counterpart": {"initials": "A6", "name": "Article 6 co-facilitators & parties", "role": "Ministerial consultation",
            "country": "Multilateral", "flag": "🌍", "portfolio": "Carbon markets · Article 6.2 / 6.4", "photo": None,
            "publicBackground": "Ministerial consultations on Article 6 are convened by the presidency; outcomes are reported publicly.",
            "publicSources": ["Presidency consultation notes"]},
        "sayThis": [
            "Support concluding the Article 6.4 mechanism rules at this COP.",
            "Insist on robust integrity: no double counting, transparent registries.",
            "Offer Singapore's experience with bilateral carbon-credit agreements as a practical model.",
        ],
        "watchPoint": "Do not trade away integrity safeguards for a faster deal.",
        "ifAsked": "Singapore wants an outcome, but only one that protects environmental integrity.",
        "anticipated": [
            {"q": "Will Singapore accept weaker integrity provisions to land a deal?",
             "why": "Endgame pressure to close often targets integrity 'flexibilities'; Singapore's red line is integrity.",
             "whyTag": "BOTH",
             "consider": [
                 {"text": "Integrity safeguards are a red line; no trade for speed.", "source": "INTERNAL"},
                 {"text": "Some parties publicly favour more flexible rules (indicative).", "source": "PUBLIC"}]},
            {"q": "Can Singapore share its bilateral carbon-agreement model?",
             "why": "Singapore has publicly signed several bilateral carbon-credit agreements, making it a credible reference point.",
             "whyTag": "BOTH",
             "consider": [
                 {"text": "Offer to share experience; keep it illustrative, not prescriptive.", "source": "INTERNAL"},
                 {"text": "Singapore's bilateral carbon agreements are matters of public record (indicative).", "source": "PUBLIC"}]},
        ],
        "publicInfo": [
            {"keywords": ["article 6", "carbon markets", "credits", "double counting"],
             "text": "Singapore has publicly pursued high-integrity bilateral carbon-credit agreements; treat specifics of any live text as indicative."}],
    },
    {
        "id": "youth-dialogue", "date": "2026-11-13", "start": "2026-11-13T15:00:00", "end": "2026-11-13T15:45:00",
        "title": "Youth & Civil Society Dialogue", "type": "Roundtable", "venue": "Action Hub",
        "updated": "2026-11-13T12:00:00",
        "objective": "Listen to youth and civil society, and show Singapore takes intergenerational concerns seriously.",
        "tone": "Open, humble, genuine.",
        "flags": ["Public-facing", "Authenticity matters"],
        "counterpart": {"initials": "YC", "name": "Youth & civil society", "role": "YOUNGO & NGO representatives",
            "country": "Global constituencies", "flag": "🌱", "portfolio": "Intergenerational equity · climate justice", "photo": None,
            "publicBackground": "Youth (YOUNGO) and NGO constituencies engage publicly at COP; their asks are on the record.",
            "publicSources": ["Constituency public statements"]},
        "sayThis": [
            "Thank participants and acknowledge the urgency they bring.",
            "Share what Singapore is doing on green jobs and climate education.",
            "Commit to continue engaging youth voices after the conference.",
        ],
        "watchPoint": "Avoid defensive or dismissive language, even if challenged sharply.",
        "ifAsked": "Where Singapore hasn't moved as fast, say so honestly and explain the pathway.",
        "anticipated": [
            {"q": "Why isn't Singapore phasing out fossil fuels faster?",
             "why": "A standard, pointed civil-society challenge; expect it directly.",
             "whyTag": "PUBLIC",
             "consider": [
                 {"text": "Be honest about constraints; point to the credible pathway and carbon markets.", "source": "INTERNAL"},
                 {"text": "Youth groups publicly call for faster fossil phase-out (indicative).", "source": "PUBLIC"}]},
            {"q": "Will you commit to a formal youth seat in the delegation?",
             "why": "Youth constituencies increasingly ask for structural inclusion.",
             "whyTag": "BOTH",
             "consider": [{"text": "No new commitment on the spot; note willingness to explore engagement channels.", "source": "INTERNAL"}]},
        ],
        "publicInfo": [
            {"keywords": ["fossil", "phase out", "youth", "commitment"],
             "text": "Youth and NGO constituencies publicly press for faster action; Singapore's public position stresses a credible, just pathway."}],
    },
    {
        "id": "closing-plenary", "date": "2026-11-14", "start": "2026-11-14T12:00:00", "end": "2026-11-14T12:20:00",
        "title": "Closing Plenary Intervention", "type": "Plenary", "venue": "Plenary Hall",
        "updated": "2026-11-14T09:00:00",
        "objective": "Deliver a closing intervention supporting a balanced final package that is ambitious and implementable.",
        "tone": "Confident, steady, constructive.",
        "flags": ["Public remarks", "High visibility", "Endgame"],
        "counterpart": {"initials": "AD", "name": "All delegations", "role": "Closing plenary",
            "country": "Multilateral setting", "flag": "🌐", "portfolio": "Heads of delegation and ministers", "photo": None,
            "publicBackground": "Closing plenary; all interventions are on the public record and broadcast.", "publicSources": ["Conference public programme"]},
        "sayThis": [
            "Welcome the overnight progress and thank the presidency for bridge-building.",
            "Stress that durable outcomes need practical implementation pathways.",
            "Signal readiness to join consensus on a balanced final package.",
        ],
        "watchPoint": "Avoid naming any delegation as blocking progress.",
        "ifAsked": "Refer drafting detail to negotiators; restate support for a balanced package.",
        "anticipated": [
            {"q": "Are you signalling that ambition should be diluted?",
             "why": "The emphasis on implementation can be read publicly as softening ambition.",
             "whyTag": "PUBLIC",
             "consider": [{"text": "Ambition and implementation are complementary, not a trade-off.", "source": "INTERNAL"}]},
            {"q": "Will Singapore block consensus if the package is weak?",
             "why": "Endgame interventions are scrutinised for veto signals.",
             "whyTag": "BOTH",
             "consider": [
                 {"text": "Emphasise constructive intent; do not signal a veto.", "source": "INTERNAL"},
                 {"text": "Media watch closing statements for blocking signals (indicative).", "source": "PUBLIC"}]},
        ],
        "publicInfo": [
            {"keywords": ["block", "blocking", "veto", "which country", "who"],
             "text": "Commentary speculates about which parties are holding out, but attributions are unverified — avoid repeating them on the record."}],
    },
]

# ---- helpers ----
MON = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
DOW = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]
import datetime
def fdate(d):  # "2026-11-10" -> "Tue 10 Nov 2026"
    y,m,dd = [int(x) for x in d.split("-")]
    return DOW[datetime.date(y,m,dd).weekday()==6 and 0 or (datetime.date(y,m,dd).weekday()+1)%7] + f" {dd} {MON[m-1]} {y}"
def fdate2(d):
    y,m,dd = [int(x) for x in d.split("-")]
    wd = (datetime.date(y,m,dd).weekday()+1)%7
    return f"{DOW[wd]} {dd} {MON[m-1]} {y}"
def e(s): return html.escape(str(s if s is not None else ""))

def brief_file(eng): return f"docs/sample-source/brief_{IDX[eng['id']]:02d}_{eng['id']}.pdf"
IDX = {eng["id"]: i+1 for i, eng in enumerate(ENGAGEMENTS)}

# ---- 1) build app JSON ----
def build_json():
    schedule = []
    for eng in ENGAGEMENTS:
        schedule.append({"date": eng["date"], "time": eng["start"][11:16], "end": eng["end"][11:16],
                         "title": eng["title"], "venue": eng["venue"], "engagementId": eng["id"]})
    for f in FILLER:
        schedule.append({"date": f["date"], "time": f["time"], "end": f["end"],
                         "title": f["title"], "venue": f["venue"], "engagementId": None})
    schedule.sort(key=lambda r: (r["date"], r["time"]))

    engs = []
    for eng in ENGAGEMENTS:
        idx = IDX[eng["id"]]
        srcs = [f"brief_{idx:02d}_{eng['id']}.pdf · p.1"]
        if len(eng["sayThis"]) > 2:
            srcs.append(f"brief_{idx:02d}_{eng['id']}.pdf · p.2")
        o = {
            "id": eng["id"], "start": eng["start"], "end": eng["end"], "title": eng["title"],
            "type": eng["type"], "venue": eng["venue"], "classification": META["classification"],
            "updated": eng["updated"], "objective": eng["objective"], "tone": eng["tone"], "flags": eng["flags"],
            "counterpart": eng["counterpart"], "sayThis": eng["sayThis"], "watchPoint": eng["watchPoint"],
            "ifAsked": eng["ifAsked"], "anticipated": eng["anticipated"], "publicInfo": eng["publicInfo"],
            "sources": srcs, "briefFile": brief_file(eng),
        }
        engs.append(o)
    data = {"meta": META, "schedule": schedule, "engagements": engs}
    path = os.path.join(REPO, "data", "schedule.sample.json")
    with open(path, "w") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print("wrote", path, "-", len(engs), "engagements,", len(schedule), "schedule rows")
    return data

# ---- 2) PDF HTML templates ----
CSS = """
@page { size: A4; margin: 16mm 15mm 18mm 15mm; }
* { box-sizing: border-box; }
body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #1a2230; font-size: 11pt; line-height: 1.45; }
.banner { background: #b3261e; color: #fff; text-align: center; font-weight: 700; font-size: 8.5pt;
  letter-spacing: .06em; padding: 5px; border-radius: 4px; text-transform: uppercase; }
.foot { position: fixed; bottom: -12mm; left: 0; right: 0; text-align: center; color: #8a94a6; font-size: 7.5pt; }
h1 { font-size: 18pt; margin: 14px 0 2px; color: #0b1220; }
.sub { color: #5b6577; font-size: 9.5pt; margin-bottom: 10px; }
.metaline { font-size: 9.5pt; color: #33405a; margin: 2px 0 12px; }
.metaline b { color: #0b1220; }
h2 { font-size: 10.5pt; text-transform: uppercase; letter-spacing: .05em; color: #2b6cb0;
  border-bottom: 1.5px solid #e2e8f0; padding-bottom: 3px; margin: 16px 0 7px; }
.chip { display: inline-block; background: #eef2f7; color: #33405a; border-radius: 10px;
  padding: 2px 9px; font-size: 8.5pt; margin: 0 5px 5px 0; }
.chip.warn { background: #fff4e5; color: #a15c00; }
.chip.red { background: #fde8e6; color: #b3261e; }
ol, ul { margin: 4px 0 4px 18px; padding: 0; }
li { margin: 3px 0; }
.card { background: #f7f9fc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 12px; margin: 6px 0; }
.card .nm { font-weight: 700; color: #0b1220; }
.card .rl { color: #5b6577; font-size: 9.5pt; }
.watch { background: #fde8e6; border-left: 4px solid #b3261e; padding: 8px 12px; border-radius: 4px; }
.ask { background: #eef6ff; border-left: 4px solid #2b6cb0; padding: 8px 12px; border-radius: 4px; }
.q { font-weight: 700; color: #0b1220; margin: 12px 0 2px; }
.why { color: #5b6577; font-size: 9.5pt; font-style: italic; margin: 0 0 4px; }
.tag { font-size: 7.5pt; font-weight: 700; padding: 1px 6px; border-radius: 4px; vertical-align: middle; }
.tag.INTERNAL { background: #e6efe6; color: #2f6b3a; }
.tag.PUBLIC { background: #eae6f7; color: #5b3a9b; }
.tag.BOTH { background: #eef2f7; color: #33405a; }
.src { color: #7a8296; font-size: 8pt; margin-left: 4px; }
table { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 9.5pt; }
th { background: #0b1220; color: #fff; text-align: left; padding: 6px 8px; font-size: 8.5pt; text-transform: uppercase; letter-spacing: .04em; }
td { padding: 6px 8px; border-bottom: 1px solid #e2e8f0; vertical-align: top; }
tr.dayrow td { background: #eef2f7; font-weight: 700; color: #2b6cb0; text-transform: uppercase; font-size: 8.5pt; letter-spacing: .05em; }
.brf { color: #2f6b3a; font-weight: 700; }
.no { color: #b0b7c3; }
"""

def flag_class(f):
    fl = f.lower()
    if any(w in fl for w in ["sensitive","avoid","no ","red line","endgame"]): return "red"
    if any(w in fl for w in ["media","public","visibility","approved","hold"]): return "warn"
    return ""

def brief_html(eng):
    idx = IDX[eng["id"]]
    cp = eng["counterpart"]
    parts = []
    parts.append('<div class="banner">Fictional sample — not a real government document · dummy data for testing</div>')
    parts.append(f'<h1>{e(eng["title"])}</h1>')
    parts.append(f'<div class="sub">COP31 Brief Buddy · Engagement brief · {e(META["principal"]["delegation"])} delegation</div>')
    parts.append('<div class="metaline">'
                 f'<b>When:</b> {e(fdate2(eng["date"]))}, {e(eng["start"][11:16])}–{e(eng["end"][11:16])} &nbsp;·&nbsp; '
                 f'<b>Where:</b> {e(eng["venue"])} &nbsp;·&nbsp; <b>Type:</b> {e(eng["type"])} &nbsp;·&nbsp; '
                 f'<b>Updated:</b> {e(fdate2(eng["updated"][:10]))}</div>')
    # flags
    if eng["flags"]:
        chips = "".join(f'<span class="chip {flag_class(f)}">{e(f)}</span>' for f in eng["flags"])
        parts.append(f'<div>{chips}</div>')
    parts.append(f'<h2>Objective</h2><div>{e(eng["objective"])}</div>')
    parts.append(f'<h2>Tone</h2><div>{e(eng["tone"])}</div>')
    # counterpart
    parts.append('<h2>Counterpart</h2><div class="card">'
                 f'<div class="nm">{e(cp["name"])}</div>'
                 f'<div class="rl">{e(cp["role"])} · {e(cp["country"])}</div>'
                 f'<div class="rl">Portfolio: {e(cp["portfolio"])}</div>'
                 f'<div style="margin-top:6px"><b>Public background:</b> {e(cp["publicBackground"])}</div>'
                 + (f'<div class="rl" style="margin-top:4px">Public sources: {e(", ".join(cp["publicSources"]))}</div>' if cp.get("publicSources") else "")
                 + '</div>')
    # say this
    parts.append('<h2>Main talking points</h2><ol>' + "".join(f'<li>{e(s)}</li>' for s in eng["sayThis"]) + '</ol>')
    # watch
    parts.append(f'<h2>Watch point — the one thing to avoid</h2><div class="watch">{e(eng["watchPoint"])}</div>')
    parts.append(f'<h2>If asked / pressed</h2><div class="ask">{e(eng["ifAsked"])}</div>')
    # anticipated
    parts.append('<h2>Anticipated questions</h2>')
    for a in eng["anticipated"]:
        parts.append(f'<div class="q">{e(a["q"])} <span class="tag {e(a["whyTag"])}">{e(a["whyTag"])}</span></div>')
        parts.append(f'<div class="why">Why it may come up: {e(a["why"])}</div>')
        parts.append('<ul>' + "".join(
            f'<li>{e(c["text"])} <span class="tag {e(c["source"])}">{e(c["source"])}</span></li>' for c in a["consider"]) + '</ul>')
    # public info
    if eng.get("publicInfo"):
        parts.append('<h2>Indicative public-domain notes <span class="src">(tentative — for the Ask fallback)</span></h2><ul>')
        for p in eng["publicInfo"]:
            parts.append(f'<li>{e(p["text"])}</li>')
        parts.append('</ul>')
    parts.append(f'<div class="foot">FICTIONAL SAMPLE · COP31 Brief Buddy · brief_{idx:02d}_{e(eng["id"])} · not a real government document</div>')
    return "<!doctype html><html><head><meta charset='utf-8'><style>" + CSS + "</style></head><body>" + "".join(parts) + "</body></html>"

def schedule_html(data):
    parts = []
    parts.append('<div class="banner">Fictional sample — not a real government document · dummy data for testing</div>')
    parts.append('<h1>COP31 — Ministerial Programme</h1>')
    parts.append(f'<div class="sub">{e(META["principal"]["name"])} · {e(META["principal"]["delegation"])} delegation · {e(META["conference"])}</div>')
    parts.append('<table><thead><tr><th>Time</th><th>Engagement</th><th>Venue</th><th>Type</th><th>Brief</th></tr></thead><tbody>')
    last = None
    # order engagements by id for type lookup
    typ = {en["id"]: en["type"] for en in ENGAGEMENTS}
    for r in data["schedule"]:
        if r["date"] != last:
            parts.append(f'<tr class="dayrow"><td colspan="5">{e(fdate2(r["date"]))}</td></tr>')
            last = r["date"]
        t = typ.get(r["engagementId"], "—") if r["engagementId"] else "—"
        brf = f'<span class="brf">✓ brief_{IDX[r["engagementId"]]:02d}</span>' if r["engagementId"] else '<span class="no">—</span>'
        parts.append(f'<tr><td>{e(r["time"])}–{e(r["end"])}</td><td>{e(r["title"])}</td>'
                     f'<td>{e(r["venue"])}</td><td>{e(t)}</td><td>{brf}</td></tr>')
    parts.append('</tbody></table>')
    parts.append('<div class="foot">FICTIONAL SAMPLE · COP31 Ministerial Programme · not a real government document</div>')
    return "<!doctype html><html><head><meta charset='utf-8'><style>" + CSS + "</style></head><body>" + "".join(parts) + "</body></html>"

def render_pdf(htmlstr, name):
    hp = os.path.join(HTML_TMP, name + ".html")
    pp = os.path.join(OUT_SRC, name + ".pdf")
    with open(hp, "w") as f:
        f.write(htmlstr)
    if not (os.path.exists(CHROME) and os.access(CHROME, os.X_OK)):
        print("  ! chrome not found at", CHROME, "- set CHROME_BIN to render PDFs; JSON still written")
        return None
    subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--no-sandbox",
                    "--no-pdf-header-footer", "--print-to-pdf=" + pp, hp],
                   check=True, capture_output=True)
    return pp

if __name__ == "__main__":
    data = build_json()
    p = render_pdf(schedule_html(data), "COP31_Ministerial_Programme")
    if p: print("wrote", p)
    for eng in ENGAGEMENTS:
        idx = IDX[eng["id"]]
        p = render_pdf(brief_html(eng), f"brief_{idx:02d}_{eng['id']}")
        if p: print("wrote", p)
    print("DONE")
