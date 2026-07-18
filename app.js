/* ============================================================
   COP31 Brief Buddy — app logic (vanilla JS, no dependencies)
   Dark theme only. Tabs: Next · Schedule · Briefs · Settings.
   ============================================================ */
(function () {
  "use strict";

  var LS_DATA = "bb:data", LS_DEMO = "bb:demoTime";

  var ICONS = {
    target:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3.2"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></svg>',
    calendar:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4.5" width="18" height="16" rx="3"/><path d="M8 2.5v4M16 2.5v4M3 9.5h18"/></svg>',
    doc:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M7.5 3.5h7l4 4V20A1.5 1.5 0 0 1 17 21.5H7A1.5 1.5 0 0 1 5.5 20V5A1.5 1.5 0 0 1 7.5 3.5Z"/><path d="M14.5 3.5V8h4M9 12.5h6M9 16h6"/></svg>',
    chat:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 12a8.5 8.5 0 0 1-12.6 7.4L3 20.5l1.3-4.4A8.5 8.5 0 1 1 21 12Z"/><path d="M9.2 9.4a3 3 0 0 1 5.5 1.5c0 2.1-2.7 2.3-2.7 4M12 18h.01"/></svg>',
    gear:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3.2"/><path d="M19.4 13a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-2.9 1.2V21a2 2 0 1 1-4 0v-.1A1.7 1.7 0 0 0 6.1 19l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.7 1.7 0 0 0 4.5 13H4.3a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 6 6.1l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.7 1.7 0 0 0 11 4.5V4.3a2 2 0 1 1 4 0v.1A1.7 1.7 0 0 0 17.9 6l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 2.1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z"/></svg>',
    pin:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11Z"/><circle cx="12" cy="10" r="2.5"/></svg>',
    clock:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 7.5V12l3 2"/></svg>',
    shield:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3 5 6v5c0 4.5 2.8 8.4 7 10 4.2-1.6 7-5.5 7-10V6l-7-3Z"/><path d="m9.5 12 1.7 1.7 3.5-4"/></svg>',
    alert:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3 2.8 20h18.4L12 3Z"/><path d="M12 9.5v5M12 17.5h.01"/></svg>',
    challenge:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 14 14 4l6 6-10 10H4v-6Z"/><path d="M13 5l6 6"/></svg>',
    web:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>',
    chevron:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m9 6 6 6-6 6"/></svg>',
    upload:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 15V3m0 0L7.5 7.5M12 3l4.5 4.5"/><path d="M5 15v3.5A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5V15"/></svg>',
    download:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3v12m0 0 4.5-4.5M12 15l-4.5-4.5"/><path d="M5 18.5h14"/></svg>',
    refresh:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20 11a8 8 0 1 0-.8 4.5"/><path d="M20 4v6h-6"/></svg>',
    spark:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3l1.6 5.4L19 10l-5.4 1.6L12 17l-1.6-5.4L5 10l5.4-1.6L12 3Z"/></svg>'
  };

  var state = {
    data: null, isSample: true, view: "next",
    briefId: null, selDate: null,
    demoTime: localStorage.getItem(LS_DEMO) || "", simulated: false
  };

  /* ---------- helpers ---------- */
  function ic(n){ return ICONS[n] || ""; }
  function el(id){ return document.getElementById(id); }
  function esc(s){ return String(s==null?"":s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];}); }
  function pad(n){ return (n<10?"0":"")+n; }
  var MON=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  var DOW=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  function parseDT(s){ if(!s) return null; if(/^\d{4}-\d{2}-\d{2}$/.test(s)){ var p=s.split("-"); return new Date(+p[0],+p[1]-1,+p[2]); } return new Date(s); }
  function fmtClock(d){ return pad(d.getHours())+":"+pad(d.getMinutes()); }
  function fmtDate(s){ var d=parseDT(s); return d? d.getDate()+" "+MON[d.getMonth()]+" "+d.getFullYear() : ""; }
  function fmtDay(d){ return DOW[d.getDay()]+" "+d.getDate()+" "+MON[d.getMonth()]; }

  function engagements(){ return (state.data&&state.data.engagements)||[]; }
  function byId(id){ return engagements().filter(function(e){return e.id===id;})[0]; }
  function ymd(d){ return d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate()); }
  function hms(t){ return (t&&t.length===5)?t+":00":(t||"00:00:00"); }
  function itemDT(it){ return new Date(it.date+"T"+hms(it.time)); }
  function itemEnd(it){ return new Date(it.date+"T"+hms(it.end||it.time)); }
  function scheduleDates(){ var seen={},out=[]; (state.data&&state.data.schedule||[]).forEach(function(it){ if(it.date&&!seen[it.date]){seen[it.date]=1;out.push(it.date);} }); return out.sort(); }

  function effectiveNow(){
    state.simulated=false;
    if(state.demoTime) return new Date(state.demoTime);
    var real=new Date(), eng=engagements();
    if(state.isSample && eng.length){
      var first=new Date(eng[0].start), last=new Date(eng[eng.length-1].end||eng[eng.length-1].start);
      if(real<new Date(first.getTime()-3*3600000) || real>last){ state.simulated=true; return new Date(first.getTime()-10*60000); }
    }
    return real;
  }
  function nextEngagement(){
    var now=effectiveNow(), eng=engagements().slice().sort(function(a,b){return new Date(a.start)-new Date(b.start);});
    var ongoing=null, next=null;
    for(var i=0;i<eng.length;i++){ var s=new Date(eng[i].start), e=new Date(eng[i].end||eng[i].start);
      if(s<=now && now<e && !ongoing) ongoing=eng[i];
      if(s>now && !next) next=eng[i]; }
    return { now:now, hero: ongoing||next||eng[eng.length-1]||null, ongoing:ongoing };
  }
  function countdown(target, now){
    var m=Math.round((target-now)/60000);
    if(m<=0) return "Happening now";
    if(m<60) return "in "+m+" min";
    if(m<12*60) return "in "+Math.floor(m/60)+"h "+(m%60)+"m";
    if(target.toDateString()===now.toDateString()) return "today "+fmtClock(target);
    if(new Date(now.getTime()+864e5).toDateString()===target.toDateString()) return "tomorrow "+fmtClock(target);
    return fmtDay(target)+" "+fmtClock(target);
  }

  /* ---------- data ---------- */
  function normalize(d){ d=d||{}; d.meta=d.meta||{}; d.engagements=(d.engagements||[]).slice().sort(function(a,b){return new Date(a.start)-new Date(b.start);}); d.schedule=d.schedule||[]; return d; }
  function loadData(){
    var stored=localStorage.getItem(LS_DATA);
    if(stored){ try{ var d=JSON.parse(stored); state.data=normalize(d); state.isSample=!!(d.meta&&d.meta.isSampleData); afterLoad(); return Promise.resolve(); }catch(e){} }
    return fetch("data/schedule.sample.json",{cache:"no-cache"}).then(function(r){return r.json();}).then(function(d){
      state.data=normalize(d); state.isSample=!(d.meta&&d.meta.isSampleData===false); afterLoad();
    }).catch(function(){ state.data={meta:{},engagements:[],schedule:[]}; afterLoad(); });
  }
  function afterLoad(){ var f=nextEngagement().hero||engagements()[0]; state.briefId=f?f.id:null; }

  /* ---------- shared brief pieces ---------- */
  function counterpartHTML(e){
    var c=e.counterpart||{}; var media;
    if(c.photo){ media='<div class="cp-photo"><img src="'+esc(c.photo)+'" alt="">'+(c.flag?'<span class="flagbadge">'+esc(c.flag)+'</span>':'')+'</div>'; }
    else { media='<div class="cp-avatar" style="background:linear-gradient(145deg,var(--accent),var(--accent-2))">'+esc(c.initials||"—")+(c.flag?'<span class="flagbadge">'+esc(c.flag)+'</span>':'')+'</div>'; }
    return '<div class="panel card-pad">'
      + '<div class="cp-top">'+media+'<div><div class="cp-name">'+esc(c.name||"")+'</div><div class="cp-role">'+esc(c.role||"")+(c.country?" · "+esc(c.country):"")+'</div>'
      + (c.photo&&c.photoNote?'<div class="photo-note">'+esc(c.photoNote)+'</div>':'')+'</div></div>'
      + '<div class="cp-mini"><div class="mini"><div class="l">Portfolio</div><div class="v">'+esc(c.portfolio||"—")+'</div></div>'
      + '<div class="mini"><div class="l">Setting</div><div class="v">'+esc(c.country||"—")+'</div></div></div>'
      + (c.publicBackground?'<div class="public-ctx"><div class="blocktitle">'+ic("web")+' Public background</div><p>'+esc(c.publicBackground)+'</p>'
        + '<div class="src-row">'+(c.publicSources||[]).map(function(s){return '<span class="src web">'+esc(s)+'</span>';}).join("")+'</div></div>':'')
      + '</div>';
  }
  function talkingHTML(e){
    return '<div class="talk-list">'+(e.sayThis||[]).map(function(line,i){
      var s=e.sources&&e.sources.length?e.sources[Math.min(i,e.sources.length-1)]:null;
      return '<div class="talk"><div class="talk-n">'+(i+1)+'</div><div><div class="talk-c">'+esc(line)+'</div>'
        + (s?'<div class="src-row"><span class="src">'+esc(s)+'</span></div>':'')+'</div></div>';
    }).join("")+'</div>';
  }
  function watchHTML(e){
    return '<div class="callout danger"><div class="blocktitle">'+ic("alert")+' Watch point</div><p>'+esc(e.watchPoint)+'</p></div>';
  }
  function briefFileHTML(e){
    var f=e.briefFile; if(!f || f==="#") return "";
    return '<div class="briefdoc">'
      + '<div class="blocktitle">'+ic("doc")+' Full brief (PDF)</div>'
      + '<p class="briefdoc-sub">The full document this summary was drawn from — open it to refer to the original.</p>'
      + '<div class="btn-row">'
      +   '<button class="btn primary" data-viewpdf="'+esc(f)+'">'+ic("doc")+' <span class="vlbl">View full brief</span></button>'
      +   '<a class="btn ghost" href="'+esc(f)+'" target="_blank" rel="noopener">'+ic("download")+' Open in new tab</a>'
      + '</div>'
      + '<div class="pdf-embed" id="pdfEmbed"></div>'
    + '</div>';
  }
  function togglePdf(btn){
    var slot=el("pdfEmbed"); if(!slot) return;
    var lbl=btn.querySelector(".vlbl");
    if(slot.getAttribute("data-open")==="1"){
      slot.innerHTML=""; slot.removeAttribute("data-open"); if(lbl) lbl.textContent="View full brief";
    } else {
      slot.innerHTML='<iframe class="pdf-frame" src="'+esc(btn.dataset.viewpdf)+'" title="Full brief PDF" loading="lazy"></iframe>';
      slot.setAttribute("data-open","1"); if(lbl) lbl.textContent="Hide full brief";
    }
  }
  function tagCls(t){ return /public/i.test(t)?"pub":(/both/i.test(t)?"both":"int"); }
  function srcTag(t){ return '<span class="src-tag '+tagCls(t)+'">'+esc(t)+'</span>'; }
  function anticipatedHTML(e){
    var items=e.anticipated||[];
    if(!items.length) return "";
    return '<div style="margin-top:24px" class="blocktitle">'+ic("challenge")+' Anticipated questions</div>'
      + '<p class="aq-intro">Questions beyond your brief that could come up — tailored to the counterpart and recent developments. '
      + '<span class="src-tag int">INTERNAL</span> = your cleared brief · <span class="src-tag pub">PUBLIC</span> = indicative, from public sources.</p>'
      + '<div class="aq-list">'+items.map(function(a){
          return '<div class="aq"><div class="aq-q">'+esc(a.q)+'</div>'
            + '<div class="aq-why">'+srcTag(a.whyTag||"INTERNAL")+' <span>'+esc(a.why)+'</span></div>'
            + ((a.consider&&a.consider.length)?'<div class="aq-consider"><div class="aq-clabel">Points to consider</div>'
                + a.consider.map(function(c){ return '<div class="aq-c">'+srcTag(c.source||"INTERNAL")+'<span>'+esc(c.text)+'</span></div>'; }).join("")+'</div>':'')
            + '</div>';
        }).join("")+'</div>';
  }

  /* ---------- NEXT ---------- */
  function renderNext(){
    var n=nextEngagement(), e=n.hero;
    if(!e){ el("next-root").innerHTML='<div class="panel card-pad"><h2>No engagements</h2></div>'; return; }
    var start=new Date(e.start), end=new Date(e.end||e.start);
    var label = n.ongoing===e ? "Happening now" : countdown(start, n.now);
    var flags=(e.flags||[]).map(function(f){ var cls=/no |avoid|sensitive|red/i.test(f)?(/media|public/i.test(f)?"warn":"danger"):""; return '<span class="flag '+cls+'">'+esc(f)+'</span>'; }).join("");

    var main='<div class="panel card-pad hero"><div class="hero-in">'
      + '<div class="kicker"><span class="count-badge">'+ic("clock")+esc(label)+'</span><span class="type-chip">'+ic("shield")+esc(e.type)+'</span></div>'
      + '<div class="hero-time">'+fmtClock(start)+'–'+fmtClock(end)+'</div>'
      + '<div class="hero-when">'+esc(fmtDay(start))+(e.updated?' · Updated '+esc(fmtDate(e.updated)):'')+'</div>'
      + '<div class="hero-title">'+esc(e.title)+'</div>'
      + '<div class="meta-strip"><span class="meta-item">'+ic("pin")+esc(e.venue)+'</span></div>'
      + (flags?'<div class="flag-row">'+flags+'</div>':'')
      + '<div class="objective"><div class="blocktitle">'+ic("target")+' Objective</div><p>'+esc(e.objective)+'</p></div>'
      + '<div style="margin-top:22px" class="blocktitle">'+ic("chat")+' Main talking points</div>'+talkingHTML(e)
      + watchHTML(e)
      + '<div class="btn-row"><button class="btn primary" data-openbrief="'+esc(e.id)+'">'+ic("doc")+' Open full brief</button></div>'
      + '</div></div>';
    var rail='<div class="rail">'+counterpartHTML(e)+'</div>';
    el("next-root").innerHTML='<div class="grid-2">'+main+rail+'</div>';
  }

  /* ---------- SCHEDULE (week calendar) ---------- */
  function renderSchedule(){
    var now=effectiveNow(), dates=scheduleDates(), todayStr=ymd(now);
    if(!state.selDate || dates.indexOf(state.selDate)<0) state.selDate = dates.indexOf(todayStr)>=0?todayStr:(dates[0]||todayStr);
    var nextId=(nextEngagement().hero||{}).id;
    var strip=dates.map(function(d){
      var dt=parseDT(d), count=(state.data.schedule||[]).filter(function(x){return x.date===d;}).length;
      var briefed=(state.data.schedule||[]).some(function(x){return x.date===d && x.engagementId;});
      return '<button class="day-chip'+(d===state.selDate?" sel":"")+(d===todayStr?" today":"")+'" data-day="'+esc(d)+'">'
        + '<span class="dc-dow">'+DOW[dt.getDay()]+'</span><span class="dc-num">'+dt.getDate()+'</span><span class="dc-mon">'+MON[dt.getMonth()]+'</span>'
        + '<span class="dc-meta">'+(count?count+(count===1?" item":" items"):"—")+(briefed?' <b>•</b>':'')+'</span></button>';
    }).join("");
    var items=(state.data.schedule||[]).filter(function(x){return x.date===state.selDate;}).sort(function(a,b){return itemDT(a)-itemDT(b);});
    var rows=items.map(function(it){
      var s=itemDT(it), en=itemEnd(it), link=!!it.engagementId;
      var isNow=s<=now&&now<en, isDone=en<now&&!isNow, isNext=it.engagementId&&it.engagementId===nextId&&!isNow;
      var tag=isNow?'<span class="tag next">Now</span>':isNext?'<span class="tag next">Next</span>':isDone?'<span class="tag completed">Done</span>':'<span class="tag upcoming">Upcoming</span>';
      var sub=link?'<span class="tag">'+esc(engType(it.engagementId))+'</span>'+esc(it.venue):esc(it.venue);
      return '<'+(link?'button':'div')+' class="tl-item'+(link?' linkable':'')+(isNow?' now':'')+(isDone?' done':'')+'"'+(link?' data-openbrief="'+esc(it.engagementId)+'"':'')+'>'
        + '<div class="tl-time">'+esc(it.time)+'<span class="e">'+esc(it.end||"")+'</span></div>'
        + '<div><div class="tl-title">'+esc(it.title)+'</div><div class="tl-sub">'+sub+'</div></div>'
        + '<div>'+tag+(link?'<span class="tl-chev">'+ic("chevron")+'</span>':'')+'</div>'
        + '</'+(link?'button':'div')+'>';
    }).join("") || '<div class="empty-day">Nothing scheduled for this day.</div>';
    el("schedule-root").innerHTML='<div class="field-label">This week <span class="wk-legend">• = has a full brief</span></div><div class="week-strip">'+strip+'</div>'
      + '<div class="section-h"><h2>'+esc(fmtDay(parseDT(state.selDate)))+'</h2><span class="hint">Tap a briefed item for the full brief</span></div>'
      + '<div class="timeline">'+rows+'</div>';
  }
  function engType(id){ var e=byId(id); return e?e.type:""; }

  /* ---------- BRIEFS (merged: read + ask) ---------- */
  var SUGGEST = ["Give me the 20-second version", "Which country is blocking the deal?", "What must I avoid?"];
  function renderBriefs(){
    var e=byId(state.briefId)||engagements()[0];
    if(!e){ el("briefs-root").innerHTML='<div class="panel card-pad">No briefs loaded.</div>'; return; }
    var start=new Date(e.start);
    var opts=engagements().map(function(x){ return '<option value="'+esc(x.id)+'"'+(x.id===e.id?" selected":"")+'>'+esc(x.title)+' — '+esc(x.type)+'</option>'; }).join("");
    var selector='<div class="panel card-pad brief-select"><div class="field-label">Choose a meeting</div><select class="select" id="briefSelect">'+opts+'</select></div>';

    var chips=SUGGEST.map(function(q){ return '<button class="suggest" data-ask="'+esc(q)+'">'+esc(q)+'</button>'; }).join("");
    var main='<div class="panel card-pad">'
      + '<span class="ai-tag">'+ic("spark")+' AI-generated · source-grounded</span>'
      + '<div class="detail-title">'+esc(e.title)+'</div>'
      + '<div class="meta-strip"><span class="meta-item">'+ic("clock")+esc(fmtClock(start))+'–'+esc(fmtClock(new Date(e.end)))+'</span><span class="meta-item">'+ic("pin")+esc(e.venue)+'</span><span class="type-chip">'+esc(e.type)+'</span></div>'
      + (e.updated?'<div class="updated-line">Updated '+esc(fmtDate(e.updated))+'</div>':'')
      + '<div class="objective"><div class="blocktitle">'+ic("target")+' Objective</div><p>'+esc(e.objective)+'</p></div>'
      + briefFileHTML(e)
      + '<div style="margin-top:22px" class="blocktitle">'+ic("chat")+' Main talking points <span style="color:var(--faint);font-weight:600;text-transform:none;letter-spacing:0"> · tone: '+esc(e.tone)+'</span></div>'+talkingHTML(e)
      + watchHTML(e)
      + anticipatedHTML(e)
      + '<div class="ask-block"><div style="margin-top:24px" class="blocktitle">'+ic("chat")+' Ask about this brief</div>'
      + '<p class="aq-intro">Answers come from your cleared brief first; only if it’s not covered will a tentative public note appear.</p>'
      + '<div class="chip-row">'+chips+'</div>'
      + '<div class="ask-box"><input class="ask-input" id="askInput" placeholder="Ask anything about this brief…"><button class="ask-send" id="askSend">Ask</button></div>'
      + '<div id="answer-slot"></div></div>'
      + '</div>';
    var rail='<div class="rail">'+counterpartHTML(e)+'</div>';
    el("briefs-root").innerHTML=selector+'<div class="grid-2">'+main+rail+'</div>';
  }
  function answer(q){
    var e=byId(state.briefId)||engagements()[0]; if(!e) return;
    var lower=(q||"").toLowerCase().trim(); if(!lower) return;
    var cls="", tag="", body="", srcs="";
    // 1) Brief-first: watch point / commitments / numbers -> cleared guardrail
    if(/avoid|watch|risk|careful|red.?line|sensitiv|commit|concession|promise|new (finance|money|fund)|pledge|guarantee|how much|number|figure|announce/.test(lower)){
      tag=srcTag("INTERNAL")+' From your brief';
      body='<p><strong>Watch point:</strong> '+esc(e.watchPoint)+'</p>'+(e.ifAsked?'<p>If pressed, you can say: '+esc(e.ifAsked)+'</p>':'');
      srcs=briefSrcRow(e);
    }
    // 2) Brief-first: summary / talking points / objective
    else if(/summar|gist|20.?sec|short|main point|talking point|what.*(say|convey|tell)|objective|aim|goal|key point/.test(lower)){
      tag=srcTag("INTERNAL")+' From your brief';
      body='<p>'+esc(e.objective)+'</p><ul>'+(e.sayThis||[]).map(function(x){return "<li>"+esc(x)+"</li>";}).join("")+'</ul><p class="basis" style="margin-top:8px">Tone: '+esc(e.tone)+'</p>';
      srcs=briefSrcRow(e);
    }
    else {
      // 3) Out of brief -> tentative public, else not covered
      var pi=(e.publicInfo||[]).filter(function(p){ return (p.keywords||[]).some(function(k){ return lower.indexOf(k)>=0; }); })[0];
      if(pi){ cls="public"; tag=srcTag("PUBLIC")+' Public domain · indicative';
        body='<p><em>Not in your cleared brief.</em> Publicly — and to be treated as indicative only — '+esc(pi.text)+'</p><p class="basis" style="margin-top:8px">Tentative; verify before use and lean on your cleared brief and negotiators.</p>';
      } else { cls="none"; tag=srcTag("INTERNAL")+' Not in your cleared brief';
        body='<p>Your cleared brief doesn’t cover that, and there’s nothing reliable in the loaded public notes.</p><p class="basis" style="margin-top:8px">Check with your negotiators. (In production, your enterprise AI would attempt a fuller, sourced answer here.)</p>';
      }
    }
    var slot=el("answer-slot"); if(slot) slot.innerHTML='<div class="answer '+cls+'"><span class="atag">'+tag+'</span>'+body+srcs+'</div>';
  }
  function briefSrcRow(e){ return '<div class="src-row" style="margin-top:14px">'+(e.sources||[]).map(function(s){return '<span class="src">'+esc(s)+'</span>';}).join("")+'</div>'; }

  /* ---------- SETTINGS ---------- */
  function renderSettings(){
    var m=(state.data&&state.data.meta)||{}, count=engagements().length;
    var standalone=window.navigator.standalone||matchMedia("(display-mode: standalone)").matches;
    var isIOS=/iphone|ipad|ipod/i.test(navigator.userAgent);
    el("settings-root").innerHTML='<div class="set-grid">'
      + '<div class="panel card-pad set-card"><h3>Add to Home Screen</h3>'+(standalone?'<p>✅ Installed — running as an app.</p>':isIOS?'<p>In Safari: <b>Share</b> → <b>Add to Home Screen</b>. Then it opens like an app.</p>':'<p>Use the browser menu → <b>Install app</b> / <b>Add to Home Screen</b>.</p>')+'</div>'
      + '<div class="panel card-pad set-card"><h3>Briefing content</h3><p class="kv"><b>Source:</b> '+(state.isSample?"Sample data (built in)":"Imported file")+'<br><b>Engagements:</b> '+count+(m.updatedLabel?'<br><b>Updated:</b> '+esc(m.updatedLabel):"")+'</p>'
      + '<div class="btn-row"><button class="btn primary" id="btnImport">'+ic("upload")+' Import file</button><button class="btn" id="btnExport">'+ic("download")+' Export</button>'+(state.isSample?"":'<button class="btn ghost" id="btnReset">'+ic("refresh")+' Reset to sample</button>')+'</div></div>'
      + '<div class="panel card-pad set-card"><h3>Simulate a time <span style="color:var(--faint);font-weight:400">(demo)</span></h3><p>Preview any moment of the conference day.</p>'
      + '<input type="datetime-local" class="input-inline" id="demoInput" value="'+esc(toLocalInput(state.demoTime?new Date(state.demoTime):effectiveNow()))+'">'
      + '<div class="btn-row"><button class="btn" id="btnSetTime">Use this time</button>'+(state.demoTime?'<button class="btn ghost" id="btnRealTime">Use real time</button>':"")+'</div></div>'
      + '<div class="panel card-pad set-card"><h3>About</h3><p class="kv">COP31 Brief Buddy · fictional dummy data for testing. Content you import stays in this browser on this device. '+esc(m.classification||"")+'</p></div>'
      + '</div><div class="hintline">COP31 Brief Buddy</div>';
  }
  function toLocalInput(d){ return d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate())+"T"+pad(d.getHours())+":"+pad(d.getMinutes()); }

  /* ---------- chrome / nav ---------- */
  function updateChrome(){
    var m=(state.data&&state.data.meta)||{};
    el("confLabel").textContent = (m.conference||"COP31").split("—")[0].trim();
    el("classLabel").textContent = state.isSample ? "Sample" : "Live";
    el("appTitle").textContent = m.app||"COP31 Brief Buddy";
    var p=m.principal||{};
    el("principalLabel").textContent = p.name ? (p.flag?p.flag+" ":"")+p.name+(p.delegation?" · "+p.delegation:"") : "";
    var msgs=[]; if(state.isSample) msgs.push("⚠︎ Sample data — fictional, for testing"); if(state.demoTime) msgs.push("⏱ Simulated time"); else if(state.simulated) msgs.push("🔬 Preview (simulated time)");
    var b=el("banner"); if(msgs.length){ b.hidden=false; b.textContent=msgs.join("   ·   "); } else b.hidden=true;
    document.querySelectorAll("[data-tab]").forEach(function(btn){ btn.classList.toggle("active", btn.dataset.tab===state.view); });
  }
  function go(view){ state.view=view; document.querySelectorAll(".pane").forEach(function(s){ s.classList.toggle("active", s.id==="tab-"+view); });
    if(view==="next") renderNext(); else if(view==="schedule") renderSchedule(); else if(view==="briefs") renderBriefs(); else if(view==="settings") renderSettings();
    updateChrome(); window.scrollTo(0,0);
  }

  /* ---------- import/export ---------- */
  function importFile(file){ var r=new FileReader(); r.onload=function(){ try{ var d=JSON.parse(r.result); if(!d.engagements||!Array.isArray(d.engagements)) throw new Error("no engagements"); localStorage.setItem(LS_DATA,r.result); state.data=normalize(d); state.isSample=!!(d.meta&&d.meta.isSampleData); state.demoTime=""; localStorage.removeItem(LS_DEMO); afterLoad(); go("next"); }catch(err){ alert("Could not read that file — it must be a Brief Buddy JSON with an \"engagements\" list.\n\n("+err.message+")"); } }; r.readAsText(file); }
  function exportData(){ var t=JSON.stringify(state.data,null,2), b=new Blob([t],{type:"application/json"}), a=document.createElement("a"); a.href=URL.createObjectURL(b); a.download="brief-buddy.json"; document.body.appendChild(a); a.click(); setTimeout(function(){URL.revokeObjectURL(a.href);a.remove();},400); }
  function resetSample(){ localStorage.removeItem(LS_DATA); state.demoTime=""; localStorage.removeItem(LS_DEMO); loadData().then(function(){ go("next"); }); }

  /* ---------- events ---------- */
  document.addEventListener("click", function(ev){
    var t=ev.target;
    var tab=t.closest("[data-tab]"); if(tab){ go(tab.dataset.tab); return; }
    var dc=t.closest("[data-day]"); if(dc){ state.selDate=dc.dataset.day; renderSchedule(); return; }
    var ob=t.closest("[data-openbrief]"); if(ob){ state.briefId=ob.dataset.openbrief; go("briefs"); return; }
    var sg=t.closest("[data-ask]"); if(sg){ var qi=el("askInput"); if(qi) qi.value=sg.dataset.ask; answer(sg.dataset.ask); return; }
    var vp=t.closest("[data-viewpdf]"); if(vp){ togglePdf(vp); return; }
    var id=(t.closest("button")||{}).id;
    if(id==="btnImport") el("fileInput").click();
    else if(id==="btnExport") exportData();
    else if(id==="btnReset"){ if(confirm("Replace current content with the built-in sample?")) resetSample(); }
    else if(id==="btnSetTime"){ var v=el("demoInput").value; if(v){ state.demoTime=new Date(v).toISOString(); localStorage.setItem(LS_DEMO,state.demoTime); go("next"); } }
    else if(id==="btnRealTime"){ state.demoTime=""; localStorage.removeItem(LS_DEMO); go("next"); }
    else if(id==="askSend"){ answer(el("askInput").value); }
  });
  document.addEventListener("change", function(ev){ if(ev.target.id==="briefSelect"){ state.briefId=ev.target.value; renderBriefs(); } });
  document.addEventListener("keydown", function(ev){ if(ev.key==="Enter" && ev.target.id==="askInput"){ answer(ev.target.value); } });
  el("fileInput").addEventListener("change", function(ev){ if(ev.target.files&&ev.target.files[0]) importFile(ev.target.files[0]); ev.target.value=""; });
  window.addEventListener("online", updateChrome); window.addEventListener("offline", updateChrome);
  setInterval(function(){ var c=el("liveClock"); if(c) c.textContent=fmtClock(new Date()); if(state.view==="next"&&!state.demoTime) renderNext(); }, 30000);

  if("serviceWorker" in navigator){
    var _hadCtrl = !!navigator.serviceWorker.controller, _reloading = false;
    navigator.serviceWorker.addEventListener("controllerchange", function(){ if(_reloading || !_hadCtrl) return; _reloading = true; location.reload(); });
    window.addEventListener("load", function(){ navigator.serviceWorker.register("service-worker.js").catch(function(){}); });
  }

  /* ---------- boot ---------- */
  function setupIcons(){ document.querySelectorAll("[data-icon]").forEach(function(n){ n.innerHTML=ic(n.dataset.icon); }); }
  loadData().then(function(){
    setupIcons();
    el("liveClock").textContent=fmtClock(new Date());
    var h=(location.hash||"").replace(/^#/,"");
    if(h==="ask") state.view="briefs";
    else if(["schedule","briefs","settings","next"].indexOf(h)>=0) state.view=h;
    else if(h.indexOf("e/")===0){ state.briefId=h.slice(2); state.view="briefs"; }
    go(state.view);
  });
})();
