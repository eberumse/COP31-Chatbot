/* ============================================================
   Minister's Briefing — COP31
   Vanilla JS. No frameworks, no network calls except loading
   the local briefing file. All data stays on the device.
   ============================================================ */
(function () {
  "use strict";

  var LS_DATA = "briefing:data";       // imported briefing JSON (string)
  var LS_DEMOTIME = "briefing:demoTime"; // user-set simulated time (ISO) or ""

  var state = {
    data: null,
    isSample: true,
    view: "next",
    prevView: "next",
    selectedId: null,
    agendaDay: null,
    demoTime: localStorage.getItem(LS_DEMOTIME) || "",
    simulatedForDemo: false,
    deferredInstall: null
  };

  var viewEl = document.getElementById("view");
  var bannerEl = document.getElementById("banner");

  /* ---------- Helpers ---------- */
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function fmtTime(d) { return pad(d.getHours()) + ":" + pad(d.getMinutes()); }
  var DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  var MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  function fmtDate(d) { return DOW[d.getDay()] + " " + d.getDate() + " " + MON[d.getMonth()]; }
  function parse(s) { return new Date(s); }

  var HONORIFICS = { "dr": 1, "mr": 1, "mrs": 1, "ms": 1, "sr": 1, "hon": 1, "rt": 1, "shri": 1, "ibu": 1, "mx": 1, "sir": 1, "dame": 1, "commissioner": 1, "mp": 1 };
  function initials(name) {
    var toks = String(name || "").trim().split(/\s+/).filter(function (t) {
      return !HONORIFICS[t.toLowerCase().replace(/\./g, "")];
    });
    return ((toks[0] ? toks[0][0] : "") + (toks[1] ? toks[1][0] : "")).toUpperCase() || "•";
  }
  var AV_COLORS = ["#16624a", "#1d4ed8", "#7c3aed", "#b45309", "#0e7490", "#9d174d", "#3f6212", "#a16207"];
  function avColor(name) {
    var h = 0, s = String(name || "");
    for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    return AV_COLORS[h % AV_COLORS.length];
  }

  var TYPE_LABEL = { bilateral: "Bilateral", coalition: "Coalition", roundtable: "Roundtable", plenary: "Plenary", press: "Press", internal: "Internal", side_event: "Side event" };
  var TYPE_CLASS = { press: "t-press", internal: "t-internal", plenary: "t-plenary" };
  function typeLabel(t) { return TYPE_LABEL[t] || "Meeting"; }
  function typeClass(t) { return TYPE_CLASS[t] || ""; }

  /* ---------- Data loading ---------- */
  function loadData() {
    var stored = localStorage.getItem(LS_DATA);
    if (stored) {
      try {
        var d = JSON.parse(stored);
        state.data = normalize(d);
        state.isSample = !!(d.meta && d.meta.isSampleData);
        afterLoad();
        return Promise.resolve();
      } catch (e) { /* fall through to sample */ }
    }
    return fetch("data/schedule.sample.json", { cache: "no-cache" })
      .then(function (r) { return r.json(); })
      .then(function (d) {
        state.data = normalize(d);
        state.isSample = !(d.meta && d.meta.isSampleData === false);
        afterLoad();
      })
      .catch(function () {
        state.data = { meta: {}, engagements: [] };
        state.isSample = true;
        afterLoad();
      });
  }
  function normalize(d) {
    d = d || {};
    d.meta = d.meta || {};
    d.engagements = (d.engagements || []).slice().sort(function (a, b) {
      return parse(a.start) - parse(b.start);
    });
    return d;
  }
  function afterLoad() {
    // Default agenda day = day of the current/next engagement.
    var cn = currentAndNext();
    var focus = cn.ongoing || cn.next || state.data.engagements[0];
    state.agendaDay = focus ? focus.day : (state.data.engagements[0] ? state.data.engagements[0].day : 1);
  }

  /* ---------- Time ---------- */
  function conferenceWindow() {
    var eng = state.data.engagements;
    if (!eng.length) return null;
    return { start: parse(eng[0].start), end: parse(eng[eng.length - 1].end || eng[eng.length - 1].start) };
  }
  function effectiveNow() {
    state.simulatedForDemo = false;
    if (state.demoTime) return new Date(state.demoTime);
    var real = new Date();
    // For the sample data only, if the real clock is outside the conference
    // window, simulate a lively moment on Day 1 so the demo always shows something.
    if (state.isSample) {
      var w = conferenceWindow();
      if (w && (real < w.start || real > w.end)) {
        state.simulatedForDemo = true;
        return new Date(w.start.getTime() + 50 * 60000); // ~09:20 on Day 1
      }
    }
    return real;
  }
  function currentAndNext() {
    var now = effectiveNow();
    var eng = state.data ? state.data.engagements : [];
    var ongoing = null, next = null, upcoming = [];
    for (var i = 0; i < eng.length; i++) {
      var s = parse(eng[i].start), e = parse(eng[i].end || eng[i].start);
      if (s <= now && now < e && !ongoing) ongoing = eng[i];
      if (s > now) upcoming.push(eng[i]);
    }
    next = upcoming[0] || null;
    return { now: now, ongoing: ongoing, next: next, upcoming: upcoming };
  }
  function countdown(target, now) {
    var ms = target - now, min = Math.round(ms / 60000);
    if (min <= 0) return "Now";
    if (min < 60) return "in " + min + " min";
    if (min < 12 * 60) return "in " + Math.floor(min / 60) + "h " + (min % 60) + "m";
    var sameDay = target.toDateString() === now.toDateString();
    var tomorrow = new Date(now.getTime() + 86400000).toDateString() === target.toDateString();
    if (sameDay) return "today " + fmtTime(target);
    if (tomorrow) return "tomorrow " + fmtTime(target);
    return fmtDate(target) + " " + fmtTime(target);
  }

  /* ---------- Rendering ---------- */
  function render() {
    updateChrome();
    if (state.view === "next") renderNext();
    else if (state.view === "agenda") renderAgenda();
    else if (state.view === "settings") renderSettings();
    else if (state.view === "detail") renderDetail();
  }

  function updateChrome() {
    var m = (state.data && state.data.meta) || {};
    document.getElementById("confName").textContent = m.conference ? shortConf(m.conference) : "COP31";
    var min = m.minister || {};
    document.getElementById("ministerName").textContent = min.name || "Minister's Briefing";
    // Banner
    var msgs = [];
    if (state.isSample) msgs.push("⚠︎ Sample data — for testing only");
    if (state.demoTime) msgs.push("⏱ Simulated time");
    else if (state.simulatedForDemo) msgs.push("🔬 Preview (simulated time)");
    if (msgs.length) { bannerEl.hidden = false; bannerEl.textContent = msgs.join("   ·   "); }
    else bannerEl.hidden = true;
    // Tabs
    ["next", "agenda", "settings"].forEach(function (v) {
      var t = document.getElementById("tab" + v[0].toUpperCase() + v.slice(1));
      if (t) t.classList.toggle("is-active", state.view === v || (state.view === "detail" && v === state.prevView));
    });
    // Back button
    document.getElementById("btnBack").hidden = state.view !== "detail";
  }
  function shortConf(s) { return s.split("—")[0].trim().split("-")[0].trim(); }

  function renderNext() {
    var cn = currentAndNext();
    var hero = cn.ongoing || cn.next;
    if (!hero) {
      viewEl.innerHTML =
        '<div class="empty"><div class="big">🎉</div><strong>All engagements complete</strong>' +
        '<p>There are no more scheduled engagements.<br>Tap <b>Agenda</b> to review the full schedule.</p></div>';
      return;
    }
    var isOngoing = hero === cn.ongoing;
    var start = parse(hero.start), end = parse(hero.end || hero.start);
    var label = isOngoing ? "Happening now" : countdown(start, cn.now);
    var upNext = cn.upcoming.slice(isOngoing ? 0 : 1, isOngoing ? 3 : 4);

    var html = '<div class="hero">';
    html += '<div class="hero-top">';
    html += '<div class="hero-when"><span class="hero-countdown">' + esc(label) + '</span>';
    html += '<span class="chip">' + esc(typeLabel(hero.type)) + '</span></div>';
    html += '<div class="hero-time">' + fmtTime(start) + " – " + fmtTime(end) + '</div>';
    html += '<div class="hero-daymeta">' + fmtDate(start) + " · Day " + esc(hero.day) + '</div>';
    html += '<div class="hero-title">' + esc(hero.title) + '</div>';
    html += '<div class="hero-venue"><span class="pin">📍</span><span>' + esc(hero.venue) + '</span></div>';
    html += '</div>';

    html += counterpartBlock(hero.counterpart);
    html += pointsBlock("is-points", "🗣 Talking points", hero.talkingPoints);
    html += pointsBlock("is-objectives", "🎯 Key objectives", hero.objectives);
    if (hero.desiredOutcome) {
      html += '<div class="block is-outcome"><div class="block-h"><span class="dot"></span>Desired outcome</div>' +
        '<div class="outcome-text">' + esc(hero.desiredOutcome) + '</div></div>';
    }
    html += pointsBlock("is-redlines", "⛔ Red lines — avoid", hero.redLines);
    if (hero.staffContact) html += '<div class="staff">👤 Staff: ' + esc(hero.staffContact) + '</div>';
    html += '</div>'; // hero

    if (upNext.length) {
      html += '<div class="upnext"><div class="section-label">Up next</div>';
      upNext.forEach(function (e) { html += miniRow(e); });
      html += '</div>';
    }
    html += '<div class="hint">Tap any engagement for the full briefing. Data stays on this device.</div>';
    viewEl.innerHTML = html;
  }

  function counterpartBlock(cp) {
    if (!cp) return "";
    var av;
    if (cp.photo) {
      av = '<span class="avatar"><img src="' + esc(cp.photo) + '" alt="">' +
        (cp.flag ? '<span class="flag">' + esc(cp.flag) + "</span>" : "") + "</span>";
    } else {
      av = '<span class="avatar" style="background:' + avColor(cp.name) + '">' + esc(initials(cp.name)) +
        (cp.flag ? '<span class="flag">' + esc(cp.flag) + "</span>" : "") + "</span>";
    }
    return '<div class="counterpart">' + av + '<div class="cp-meta">' +
      '<div class="cp-name">' + esc(cp.name) + '</div>' +
      '<div class="cp-title">' + esc(cp.title) + (cp.country ? " · " + esc(cp.country) : "") + '</div>' +
      (cp.profile ? '<div class="cp-profile">' + esc(cp.profile) + '</div>' : "") +
      '</div></div>';
  }
  function pointsBlock(cls, heading, items) {
    if (!items || !items.length) return "";
    var h = '<div class="block ' + cls + '"><div class="block-h"><span class="dot"></span>' + esc(heading) + '</div><ul class="points">';
    items.forEach(function (it) { h += "<li>" + esc(it) + "</li>"; });
    return h + "</ul></div>";
  }
  function miniRow(e) {
    var s = parse(e.start);
    var sub = (e.counterpart && e.counterpart.flag ? e.counterpart.flag + " " : "") +
      (e.counterpart ? e.counterpart.country : e.venue);
    return '<button class="mini" data-open="' + esc(e.id) + '">' +
      '<span class="mini-time">' + fmtTime(s) + '</span>' +
      '<span class="mini-body"><span class="mini-title">' + esc(e.title) + '</span>' +
      '<span class="mini-sub">' + esc(sub) + '</span></span>' +
      '<span class="mini-chev">›</span></button>';
  }

  function renderAgenda() {
    var eng = state.data.engagements;
    if (!eng.length) { viewEl.innerHTML = '<div class="empty"><div class="big">🗓️</div><strong>No schedule loaded</strong></div>'; return; }
    var days = [];
    eng.forEach(function (e) { if (days.indexOf(e.day) < 0) days.push(e.day); });
    if (days.indexOf(state.agendaDay) < 0) state.agendaDay = days[0];

    var cn = currentAndNext();
    var nowId = cn.ongoing ? cn.ongoing.id : null;
    var nextId = cn.next ? cn.next.id : null;

    var html = '<div class="daytabs">';
    days.forEach(function (d) {
      var first = eng.filter(function (e) { return e.day === d; })[0];
      var dd = parse(first.start);
      html += '<button class="daytab' + (d === state.agendaDay ? " is-active" : "") + '" data-day="' + esc(d) + '">Day ' + esc(d) + ' · ' + fmtDate(dd) + '</button>';
    });
    html += '</div>';

    var dayEng = eng.filter(function (e) { return e.day === state.agendaDay; });
    dayEng.forEach(function (e) {
      var s = parse(e.start), en = parse(e.end || e.start);
      var isNow = e.id === nowId, isNext = e.id === nextId;
      var isPast = en < cn.now && !isNow;
      var sub = e.counterpart
        ? '<span class="ag-flag">' + esc(e.counterpart.flag || "") + '</span>' + esc(e.counterpart.country || e.counterpart.name)
        : esc(e.venue);
      html += '<button class="agenda-item' + (isNow ? " is-now" : "") + (isPast ? " is-past" : "") + '" data-open="' + esc(e.id) + '">';
      if (isNow) html += '<span class="nowtag">NOW</span>';
      else if (isNext) html += '<span class="nowtag" style="background:var(--blue)">NEXT</span>';
      html += '<span class="ag-time"><span class="ag-start">' + fmtTime(s) + '</span><br><span class="ag-end">' + fmtTime(en) + '</span></span>';
      html += '<span class="ag-body"><span class="ag-title">' + esc(e.title) + '</span>' +
        '<span class="ag-sub"><span class="type-tag ' + typeClass(e.type) + '">' + esc(typeLabel(e.type)) + '</span>' + sub + '</span></span>';
      html += '</button>';
    });
    viewEl.innerHTML = html;
  }

  function renderDetail() {
    var e = state.data.engagements.filter(function (x) { return x.id === state.selectedId; })[0];
    if (!e) { state.view = "next"; return render(); }
    var s = parse(e.start), en = parse(e.end || e.start);
    var html = '<div class="detail-when"><span class="type-tag ' + typeClass(e.type) + '">' + esc(typeLabel(e.type)) + '</span>' +
      fmtDate(s) + ' · Day ' + esc(e.day) + '</div>';
    html += '<div class="detail-title">' + esc(e.title) + '</div>';
    html += '<div class="detail-when" style="font-size:16px;color:var(--ink)"><strong>' + fmtTime(s) + " – " + fmtTime(en) + '</strong></div>';
    html += '<div class="detail-venue">📍 ' + esc(e.venue) + '</div>';

    html += '<div class="card">';
    html += counterpartBlock(e.counterpart);
    html += pointsBlock("is-points", "🗣 Talking points", e.talkingPoints);
    html += pointsBlock("is-objectives", "🎯 Key objectives", e.objectives);
    if (e.desiredOutcome) {
      html += '<div class="block is-outcome"><div class="block-h"><span class="dot"></span>Desired outcome</div>' +
        '<div class="outcome-text">' + esc(e.desiredOutcome) + '</div></div>';
    }
    html += pointsBlock("is-redlines", "⛔ Red lines — avoid", e.redLines);
    if (e.staffContact) html += '<div class="staff">👤 Staff: ' + esc(e.staffContact) + '</div>';
    html += '</div>';
    viewEl.innerHTML = html;
    window.scrollTo(0, 0);
  }

  function renderSettings() {
    var m = (state.data && state.data.meta) || {};
    var count = state.data ? state.data.engagements.length : 0;
    var online = navigator.onLine;
    var standalone = window.navigator.standalone || matchMedia("(display-mode: standalone)").matches;
    var isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);

    var html = "";

    // Install
    html += '<div class="setting"><h3>Add to Home Screen</h3>';
    if (standalone) {
      html += '<p>✅ Installed. This is running as an app.</p>';
    } else if (state.deferredInstall) {
      html += '<p>Install this briefing as an app for one-tap access.</p><button class="btn" id="btnInstall">📲 Install app</button>';
    } else if (isIOS) {
      html += '<p>In Safari, tap the <b>Share</b> icon (□↑) then <b>“Add to Home Screen”</b>. It will then open like a normal app and work offline.</p>';
    } else {
      html += '<p>Open the browser menu and choose <b>“Install app”</b> / <b>“Add to Home Screen”</b>.</p>';
    }
    html += "</div>";

    // Data / re-sync
    html += '<div class="setting"><h3>Briefing content</h3>';
    html += '<p class="kv"><b>Source:</b> ' + (state.isSample ? "Sample data (built in)" : "Imported file") +
      '<br><b>Engagements:</b> ' + count +
      (m.updatedLabel ? '<br><b>Updated:</b> ' + esc(m.updatedLabel) : "") + '</p>';
    html += '<button class="btn" id="btnImport2">📥 Import / update briefing file</button>';
    html += '<div style="height:8px"></div>';
    html += '<button class="btn secondary" id="btnExport">⬇︎ Save current data as file</button>';
    if (!state.isSample) {
      html += '<div style="height:8px"></div><button class="btn danger" id="btnReset2">♻️ Reset to sample data</button>';
    }
    html += "</div>";

    // Demo time
    html += '<div class="setting"><h3>Simulate a time <span style="font-weight:400;color:var(--ink-faint)">(demo)</span></h3>';
    html += '<p>Preview how the app behaves at any moment during the conference.</p>';
    html += '<input type="datetime-local" id="demoInput" value="' + esc(toLocalInput(state.demoTime ? new Date(state.demoTime) : effectiveNow())) + '" style="width:100%;padding:11px;border:1px solid var(--line);border-radius:11px;font-size:15px;background:var(--card);color:var(--ink)">';
    html += '<div style="height:8px"></div><button class="btn secondary" id="btnSetTime">Use this time</button>';
    if (state.demoTime) html += '<div style="height:8px"></div><button class="btn secondary" id="btnRealTime">↩︎ Use real (current) time</button>';
    html += "</div>";

    // Privacy / offline
    html += '<div class="setting"><h3>Privacy &amp; offline</h3>';
    html += '<p>🔒 All briefing content stays on <b>this device only</b>. Nothing is uploaded or sent to any server.<br>' +
      '📶 Status: ' + (online ? "online" : "offline") + ' — the app works fully offline once loaded.</p></div>';

    html += '<div class="hint">Minister\'s Briefing · offline PWA · v1.0</div>';
    viewEl.innerHTML = html;
  }
  function toLocalInput(d) {
    return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()) + "T" + pad(d.getHours()) + ":" + pad(d.getMinutes());
  }

  /* ---------- Navigation ---------- */
  function go(view) {
    if (view !== "detail" && state.view !== "detail") state.prevView = state.view;
    state.view = view;
    render();
    window.scrollTo(0, 0);
  }
  function openDetail(id) {
    if (state.view !== "detail") state.prevView = state.view;
    state.selectedId = id; state.view = "detail"; render();
  }

  /* ---------- Import / export ---------- */
  function importFile(file) {
    var reader = new FileReader();
    reader.onload = function () {
      try {
        var d = JSON.parse(reader.result);
        if (!d.engagements || !Array.isArray(d.engagements)) throw new Error("No 'engagements' array");
        localStorage.setItem(LS_DATA, reader.result);
        state.data = normalize(d);
        state.isSample = !!(d.meta && d.meta.isSampleData);
        state.demoTime = ""; localStorage.removeItem(LS_DEMOTIME);
        afterLoad();
        go("next");
        flash("✅ Briefing updated — " + state.data.engagements.length + " engagements");
      } catch (err) {
        alert("Could not read that file.\n\nIt must be a briefing JSON file with an \"engagements\" list.\n\n(" + err.message + ")");
      }
    };
    reader.readAsText(file);
  }
  function exportData() {
    var text = JSON.stringify(state.data, null, 2);
    var blob = new Blob([text], { type: "application/json" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "briefing.json";
    document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }
  function resetToSample() {
    localStorage.removeItem(LS_DATA);
    state.demoTime = ""; localStorage.removeItem(LS_DEMOTIME);
    loadData().then(function () { go("next"); flash("Reset to sample data"); });
  }
  function flash(msg) {
    bannerEl.hidden = false; bannerEl.textContent = msg;
    setTimeout(updateChrome, 2200);
  }

  /* ---------- Event wiring ---------- */
  function openSheet() { document.getElementById("sheet").hidden = false; }
  function closeSheet() { document.getElementById("sheet").hidden = true; }

  document.addEventListener("click", function (ev) {
    var t = ev.target.closest("[data-open]");
    if (t) { openDetail(t.getAttribute("data-open")); return; }
    var day = ev.target.closest("[data-day]");
    if (day) { state.agendaDay = parseInt(day.getAttribute("data-day"), 10); renderAgenda(); updateChrome(); return; }
    var tab = ev.target.closest(".tab");
    if (tab) { go(tab.getAttribute("data-view")); return; }
    if (ev.target.closest("[data-close-sheet]")) { closeSheet(); return; }

    switch (ev.target.id || (ev.target.closest("button") || {}).id) {
      case "btnMenu": openSheet(); break;
      case "btnBack": go(state.prevView || "next"); break;
      case "miImport": case "btnImport2": closeSheet(); document.getElementById("fileInput").click(); break;
      case "miReset": case "btnReset2": closeSheet(); if (confirm("Replace current content with the built-in sample data?")) resetToSample(); break;
      case "btnExport": exportData(); break;
      case "miTime": closeSheet(); go("settings"); break;
      case "miAbout": closeSheet(); go("settings"); break;
      case "btnInstall":
        if (state.deferredInstall) { state.deferredInstall.prompt(); state.deferredInstall = null; }
        break;
      case "btnSetTime": {
        var v = document.getElementById("demoInput").value;
        if (v) { state.demoTime = new Date(v).toISOString(); localStorage.setItem(LS_DEMOTIME, state.demoTime); go("next"); }
        break;
      }
      case "btnRealTime": state.demoTime = ""; localStorage.removeItem(LS_DEMOTIME); go("next"); break;
    }
  });

  document.getElementById("fileInput").addEventListener("change", function (ev) {
    if (ev.target.files && ev.target.files[0]) importFile(ev.target.files[0]);
    ev.target.value = "";
  });

  window.addEventListener("beforeinstallprompt", function (e) {
    e.preventDefault(); state.deferredInstall = e;
    if (state.view === "settings") renderSettings();
  });
  window.addEventListener("online", updateChrome);
  window.addEventListener("offline", updateChrome);

  // Refresh the "Next" countdown periodically (real time only).
  setInterval(function () { if (state.view === "next" && !state.demoTime) renderNext(); }, 30000);

  /* ---------- Service worker ---------- */
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("service-worker.js").catch(function () {});
    });
  }

  /* ---------- Go ---------- */
  loadData().then(function () {
    // Optional deep-link on first load: #agenda, #settings, or #e/<id>
    var h = (location.hash || "").replace(/^#/, "");
    if (h === "agenda" || h === "settings" || h === "next") state.view = h;
    else if (h.indexOf("e/") === 0) { state.selectedId = h.slice(2); state.prevView = "agenda"; state.view = "detail"; }
    render();
  });
})();
