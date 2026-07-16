/* ============================================================
   COP31 Brief Buddy — app logic (vanilla JS, no dependencies)
   ============================================================ */
(function () {
  "use strict";

  var LS_DATA = "bb:data", LS_THEME = "bb:theme", LS_DEMO = "bb:demoTime";

  var ICONS = {
    spark:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 2l1.7 6.1L20 10l-6.3 1.9L12 18l-1.7-6.1L4 10l6.3-1.9L12 2Z"/></svg>',
    target:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3.2"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></svg>',
    calendar:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4.5" width="18" height="16" rx="3"/><path d="M8 2.5v4M16 2.5v4M3 9.5h18"/></svg>',
    doc:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M7.5 3.5h7l4 4V20A1.5 1.5 0 0 1 17 21.5H7A1.5 1.5 0 0 1 5.5 20V5A1.5 1.5 0 0 1 7.5 3.5Z"/><path d="M14.5 3.5V8h4M9 12.5h6M9 16h6"/></svg>',
    chat:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 12a8.5 8.5 0 0 1-12.6 7.4L3 20.5l1.3-4.4A8.5 8.5 0 1 1 21 12Z"/><path d="M9.2 9.4a3 3 0 0 1 5.5 1.5c0 2.1-2.7 2.3-2.7 4M12 18h.01"/></svg>',
    gear:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3.2"/><path d="M19.4 13a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-2.9 1.2V21a2 2 0 1 1-4 0v-.1A1.7 1.7 0 0 0 6.1 19l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.7 1.7 0 0 0 4.5 13H4.3a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 6 6.1l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.7 1.7 0 0 0 11 4.5V4.3a2 2 0 1 1 4 0v.1A1.7 1.7 0 0 0 17.9 6l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 2.1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z"/></svg>',
    sun:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="4.2"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.6 4.6l1.8 1.8M17.6 17.6l1.8 1.8M19.4 4.6l-1.8 1.8M6.4 17.6l-1.8 1.8"/></svg>',
    moon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.6 6.6 0 0 0 9.8 9.8Z"/></svg>',
    pin:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11Z"/><circle cx="12" cy="10" r="2.5"/></svg>',
    clock:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 7.5V12l3 2"/></svg>',
    walk:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="13" cy="4.5" r="1.6"/><path d="M11 22l1.5-6-2.5-2 1-5 3 2 2 1M8.5 22l2-5"/></svg>',
    shield:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3 5 6v5c0 4.5 2.8 8.4 7 10 4.2-1.6 7-5.5 7-10V6l-7-3Z"/><path d="m9.5 12 1.7 1.7 3.5-4"/></svg>',
    alert:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3 2.8 20h18.4L12 3Z"/><path d="M12 9.5v5M12 17.5h.01"/></svg>',
    challenge:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 14 14 4l6 6-10 10H4v-6Z"/><path d="M13 5l6 6"/></svg>',
    web:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>',
    arrow:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    chevron:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m9 6 6 6-6 6"/></svg>',
    check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m5 12.5 4.5 4.5L19 6.5"/></svg>',
    upload:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 15V3m0 0L7.5 7.5M12 3l4.5 4.5"/><path d="M5 15v3.5A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5V15"/></svg>',
    download:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3v12m0 0 4.5-4.5M12 15l-4.5-4.5"/><path d="M5 18.5h14"/></svg>',
    refresh:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20 11a8 8 0 1 0-.8 4.5"/><path d="M20 4v6h-6"/></svg>',
    spark2:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3l1.6 5.4L19 10l-5.4 1.6L12 17l-1.6-5.4L5 10l5.4-1.6L12 3Z"/></svg>'
  };

  var state = {
    data: null, isSample: true, view: "next",
    briefId: null, askId: null, askMode: "brief",
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
  function confDate(){ var e=engagements()[0]; return e? parseDT(e.start.slice(0,10)) : new Date(); }
  function schedDate(hhmm){ var d=confDate(), p=hhmm.split(":"); var x=new Date(d.getFullYear(),d.getMonth(),d.getDate(),+p[0],+p[1]); return x; }

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
  function afterLoad(){ var n=nextEngagement(); var f=n.hero||engagements()[0]; state.briefId=f?f.id:null; state.askId=f?f.id:null; }

  /* ---------- theme ---------- */
  function currentTheme(){ return document.documentElement.getAttribute("data-theme")||"light"; }
  function applyTheme(mode){
    var t=mode;
    if(mode==="system"){ localStorage.removeItem(LS_THEME); t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"; }
    else localStorage.setItem(LS_THEME, mode);
    document.documentElement.setAttribute("data-theme", t);
    updateThemeIcons();
    if(state.view==="settings") renderSettings();
  }
  function toggleTheme(){ applyTheme(currentTheme()==="dark"?"light":"dark"); }
  function updateThemeIcons(){
    var name=currentTheme()==="dark"?"sun":"moon";
    ["themeBtn","themeBtnTop"].forEach(function(id){ var b=el(id); if(b) b.querySelector("[data-icon]").innerHTML=ic(name); });
  }

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
      + (c.publicContext?'<div class="public-ctx"><div class="blocktitle">'+ic("web")+' Public context</div><p>'+esc(c.publicContext)+'</p>'
        + '<div class="src-row">'+(c.publicSources||[]).map(function(s){return '<span class="src web">'+esc(s)+'</span>';}).join("")+'</div></div>':'')
      + '</div>';
  }
  function talkingHTML(e){
    return '<div class="talk-list">'+e.sayThis.map(function(line,i){
      var s=e.sources&&e.sources.length?e.sources[Math.min(i,e.sources.length-1)]:null;
      return '<div class="talk"><div class="talk-n">'+(i+1)+'</div><div><div class="talk-c">'+esc(line)+'</div>'
        + (s?'<div class="src-row"><span class="src">'+esc(s)+'</span></div>':'')+'</div></div>';
    }).join("")+'</div>';
  }
  function changedHTML(e){
    var head='<div class="changed-head"><span class="date-chip">'+esc(fmtDate(e.initialBriefDate))+'</span>'+ic("arrow")
      +'<span class="date-chip">'+esc(fmtDate(e.currentBriefDate))+'</span><span>· '+esc(e.version||"")+'</span></div>';
    return head+'<ul class="change-list">'+(e.changed||[]).map(function(x){return '<li>'+esc(x)+'</li>';}).join("")+'</ul>';
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
      + '<div class="hero-when">'+esc(fmtDay(start))+'</div>'
      + '<div class="hero-title">'+esc(e.title)+'</div>'
      + '<div class="meta-strip"><span class="meta-item">'+ic("pin")+esc(e.venue)+'</span>'+(e.walkTime?'<span class="meta-item">'+ic("walk")+esc(e.walkTime)+'</span>':'')+'</div>'
      + (flags?'<div class="flag-row">'+flags+'</div>':'')
      + '<div class="objective"><div class="blocktitle">'+ic("target")+' Objective</div><p>'+esc(e.objective)+'</p></div>'
      + '<div style="margin-top:22px" class="blocktitle">'+ic("chat")+' Say this</div>'+talkingHTML(e)
      + '<div class="callout danger"><div class="blocktitle">'+ic("alert")+' Watch point</div><p>'+esc(e.watchPoint)+'</p></div>'
      + '<div class="callout warn"><div class="blocktitle">'+ic("shield")+' If asked</div><p>'+esc(e.ifAsked)+'</p></div>'
      + '<div class="btn-row"><button class="btn primary" data-openbrief="'+esc(e.id)+'">'+ic("doc")+' Full brief</button>'
      + '<button class="btn" data-goask="'+esc(e.id)+'">'+ic("challenge")+' Prep likely questions</button></div>'
      + '</div></div>';

    var rail='<div class="rail">'+counterpartHTML(e)
      + '<div class="panel card-pad"><div class="blocktitle">'+ic("spark2")+' What changed</div>'+changedHTML(e)+'</div></div>';

    el("next-root").innerHTML='<div class="grid-2">'+main+rail+'</div>';
  }

  /* ---------- SCHEDULE ---------- */
  function renderSchedule(){
    var now=effectiveNow(), sch=state.data.schedule||[], nextId=(nextEngagement().hero||{}).id;
    var rows=sch.map(function(it){
      var s=schedDate(it.time), en=schedDate(it.end||it.time), link=!!it.engagementId;
      var isNow=s<=now&&now<en, isDone=en<now&&!isNow, isNext=it.engagementId&&it.engagementId===nextId&&!isNow;
      var tag=isNow?'<span class="tag next">Now</span>':isNext?'<span class="tag next">Next</span>':isDone?'<span class="tag completed">Done</span>':'<span class="tag upcoming">Upcoming</span>';
      var sub=link?'<span class="tag">'+esc(engType(it.engagementId))+'</span>'+esc(it.venue):esc(it.venue);
      return '<'+(link?'button':'div')+' class="tl-item'+(link?' linkable':'')+(isNow?' now':'')+(isDone?' done':'')+'"'+(link?' data-openbrief="'+esc(it.engagementId)+'"':'')+'>'
        + '<div class="tl-time">'+esc(it.time)+'<span class="e">'+esc(it.end||"")+'</span></div>'
        + '<div><div class="tl-title">'+esc(it.title)+'</div><div class="tl-sub">'+sub+'</div></div>'
        + '<div>'+tag+(link?'<span class="tl-chev">'+ic("chevron")+'</span>':'')+'</div>'
        + '</'+(link?'button':'div')+'>';
    }).join("");
    el("schedule-root").innerHTML='<div class="section-h"><h2>'+esc(fmtDay(confDate()))+'</h2><span class="hint">Tap a briefed item for the full brief</span></div><div class="timeline">'+rows+'</div>';
  }
  function engType(id){ var e=byId(id); return e?e.type:""; }

  /* ---------- BRIEFS ---------- */
  function renderBriefs(){
    var list=engagements().map(function(e){
      return '<button class="pick'+(e.id===state.briefId?' active':'')+'" data-pick="'+esc(e.id)+'"><div class="row"><span class="t">'+esc(e.title)+'</span><span class="tag">'+esc(e.type)+'</span></div>'
        + '<div class="m">'+esc(e.counterpart.name)+' · updated '+esc(fmtDate(e.currentBriefDate))+' · '+esc(e.version)+'</div></button>';
    }).join("");
    var e=byId(state.briefId)||engagements()[0];
    var detail=e ? briefDetailHTML(e) : '<div class="panel card-pad">No brief selected.</div>';
    el("briefs-root").innerHTML='<div class="split"><div><div class="field-label">Briefs</div><div class="pick-list">'+list+'</div></div><div>'+detail+'</div></div>';
  }
  function briefDetailHTML(e){
    var start=new Date(e.start);
    return '<div class="rail">'
      + '<div class="panel card-pad">'
      + '<span class="ai-tag">'+ic("spark2")+' AI-generated · source-grounded</span>'
      + '<div class="detail-title">'+esc(e.title)+'</div>'
      + '<div class="meta-strip"><span class="meta-item">'+ic("clock")+esc(fmtClock(start))+'–'+esc(fmtClock(new Date(e.end)))+'</span><span class="meta-item">'+ic("pin")+esc(e.venue)+'</span><span class="type-chip">'+esc(e.type)+'</span></div>'
      + '<div class="objective"><div class="blocktitle">'+ic("target")+' One-line objective</div><p>'+esc(e.objective)+'</p></div>'
      + '<div style="margin-top:20px" class="blocktitle">'+ic("chat")+' Say this <span style="color:var(--faint);font-weight:600;text-transform:none;letter-spacing:0"> · tone: '+esc(e.tone)+'</span></div>'+talkingHTML(e)
      + '<div class="callout danger"><div class="blocktitle">'+ic("alert")+' Watch point</div><p>'+esc(e.watchPoint)+'</p></div>'
      + '<div class="btn-row"><button class="btn primary" data-goask="'+esc(e.id)+'">'+ic("chat")+' Ask about this brief</button></div>'
      + '</div>'
      + '<div class="panel card-pad"><div class="blocktitle">'+ic("spark2")+' What changed</div>'+changedHTML(e)+'</div>'
      + counterpartHTML(e)
      + '</div>';
  }

  /* ---------- ASK ---------- */
  var MODES=[
    {k:"brief", label:"60-sec brief"},
    {k:"redteam", label:"Anticipated questions"},
    {k:"changed", label:"What changed"},
    {k:"trace", label:"Source trace"},
    {k:"watch", label:"Watch point"}
  ];
  function renderAsk(){
    var opts=engagements().map(function(e){ return '<option value="'+esc(e.id)+'"'+(e.id===state.askId?" selected":"")+'>'+esc(e.title)+' — '+esc(e.type)+'</option>'; }).join("");
    var modes=MODES.map(function(m){ return '<button class="mode'+(m.k===state.askMode?' active':'')+'" data-mode="'+m.k+'">'+esc(m.label)+'</button>'; }).join("");
    var left='<div class="panel card-pad">'
      + '<div class="field-label">Which brief?</div><select class="select" id="askSelect">'+opts+'</select>'
      + '<div class="explain"><b>Red-team</b> surfaces questions your counterpart is likely to put to <i>you</i>. <b>Ask</b> looks up anything inside this approved brief — you always get a source-grounded answer, or a clear “not in the pack”.</div>'
      + '<div class="field-label" style="margin-top:16px">Quick modes</div><div class="mode-row">'+modes+'</div>'
      + '<div class="ask-box"><input class="ask-input" id="askInput" placeholder="Ask about this brief…"><button class="ask-send" id="askSend">Ask</button></div>'
      + '</div>';
    el("ask-root").innerHTML='<div class="ask-wrap">'+left+'<div id="answer-slot"></div></div>';
    answer(state.askMode);
  }
  function answer(mode, q){
    var e=byId(state.askId)||engagements()[0]; if(!e){ return; }
    var cls="", tag="", body="";
    var lower=(q||"").toLowerCase();
    if(q){
      if(/anticipat|red.?team|challeng|question|hostile/.test(lower)) mode="redteam";
      else if(/chang|updat|differ|new/.test(lower)) mode="changed";
      else if(/source|trace|cite|where|proof/.test(lower)) mode="trace";
      else if(/avoid|watch|risk|careful/.test(lower)) mode="watch";
      else if(/commit|concession|promise|new (finance|money|fund)|number|figure|guarantee/.test(lower)) mode="unsupported";
      else mode="brief";
    }
    if(mode==="redteam"){ tag=ic("challenge")+" Red-team — likely questions"; body='<div class="qa-list">'+e.redTeam.map(function(x){return '<div class="qa"><strong>'+esc(x.q)+'</strong><span>Basis: '+esc(x.basis)+'</span></div>';}).join("")+'</div><p style="margin-top:12px" class="basis">Use public context only to <i>anticipate</i> the question — the answer the Minister gives should still come from the approved brief.</p>'; }
    else if(mode==="changed"){ tag=ic("spark2")+" What changed"; body=changedHTML(e); }
    else if(mode==="trace"){ tag=ic("doc")+" Source trace"; body='<p>The objective and talking points are supported by:</p><ul>'+e.sources.map(function(s){return "<li>"+esc(s)+"</li>";}).join("")+'</ul><p class="basis">Counterpart context is labelled separately as public web context and does not override the approved internal brief.</p>'; }
    else if(mode==="watch"){ tag=ic("alert")+" Watch point"; body='<p><strong>'+esc(e.watchPoint)+'</strong></p><p>If pressed: '+esc(e.ifAsked)+'</p>'; }
    else if(mode==="unsupported"){ cls="unsupported"; tag=ic("alert")+" Not in the approved pack"; body='<p><strong>That isn’t covered by the approved brief.</strong></p><p>The pack offers no line beyond: “'+esc(e.ifAsked)+'”. Brief Buddy will not invent a new commitment or position — check with your negotiators.</p>'; }
    else { tag=ic("spark2")+" 60-second brief"; body='<ul>'+e.sayThis.map(function(x){return "<li>"+esc(x)+"</li>";}).join("")+'</ul><p style="margin-top:10px" class="basis">Tone: '+esc(e.tone)+'</p>'; }

    var srcs='<div class="src-row" style="margin-top:14px">'+e.sources.map(function(s){return '<span class="src">'+esc(s)+'</span>';}).join("")+'</div>';
    var slot=el("answer-slot"); if(slot) slot.innerHTML='<div class="answer '+cls+'"><span class="atag">'+tag+'</span>'+body+srcs+'</div>';
    if(!q){ state.askMode=mode; document.querySelectorAll(".mode").forEach(function(b){ b.classList.toggle("active", b.dataset.mode===mode); }); }
  }

  /* ---------- SETTINGS ---------- */
  function renderSettings(){
    var m=(state.data&&state.data.meta)||{}, count=engagements().length;
    var stored=localStorage.getItem(LS_THEME); var themeMode=stored||"system";
    var standalone=window.navigator.standalone||matchMedia("(display-mode: standalone)").matches;
    var isIOS=/iphone|ipad|ipod/i.test(navigator.userAgent);
    function seg(v,l){ return '<button class="'+(themeMode===v?"on":"")+'" data-settheme="'+v+'">'+l+'</button>'; }
    el("settings-root").innerHTML='<div class="set-grid">'
      + '<div class="panel card-pad set-card"><h3>Appearance</h3><p>Switch the look. Light suits a bright plenary hall; dark suits the console feel.</p>'
      + '<div class="seg">'+seg("light","Light")+seg("dark","Dark")+seg("system","System")+'</div></div>'
      + '<div class="panel card-pad set-card"><h3>Add to Home Screen</h3>'+(standalone?'<p>✅ Installed — running as an app.</p>':isIOS?'<p>In Safari: <b>Share</b> → <b>Add to Home Screen</b>. Then it opens like an app.</p>':'<p>Use the browser menu → <b>Install app</b> / <b>Add to Home Screen</b>.</p>')+'</div>'
      + '<div class="panel card-pad set-card"><h3>Briefing content</h3><p class="kv"><b>Source:</b> '+(state.isSample?"Sample data (built in)":"Imported file")+'<br><b>Engagements:</b> '+count+(m.updatedLabel?'<br><b>Updated:</b> '+esc(m.updatedLabel):"")+'</p>'
      + '<div class="btn-row"><button class="btn primary" id="btnImport">'+ic("upload")+' Import file</button><button class="btn" id="btnExport">'+ic("download")+' Export</button>'+(state.isSample?"":'<button class="btn ghost" id="btnReset">'+ic("refresh")+' Reset to sample</button>')+'</div></div>'
      + '<div class="panel card-pad set-card"><h3>Simulate a time <span style="color:var(--faint);font-weight:400">(demo)</span></h3><p>Preview any moment of the conference day.</p>'
      + '<input type="datetime-local" class="input-inline" id="demoInput" value="'+esc(toLocalInput(state.demoTime?new Date(state.demoTime):effectiveNow()))+'">'
      + '<div class="btn-row"><button class="btn" id="btnSetTime">Use this time</button>'+(state.demoTime?'<button class="btn ghost" id="btnRealTime">Use real time</button>':"")+'</div></div>'
      + '<div class="panel card-pad set-card" style="grid-column:1/-1"><h3>About</h3><p class="kv">COP31 Brief Buddy · fictional dummy data for testing. Content you import stays in this browser on this device. '+esc(m.classification||"")+'</p></div>'
      + '</div><div class="hintline">COP31 Brief Buddy · v2</div>';
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
    if(view==="next") renderNext(); else if(view==="schedule") renderSchedule(); else if(view==="briefs") renderBriefs(); else if(view==="ask") renderAsk(); else if(view==="settings") renderSettings();
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
    var ob=t.closest("[data-openbrief]"); if(ob){ state.briefId=ob.dataset.openbrief; go("briefs"); return; }
    var ga=t.closest("[data-goask]"); if(ga){ state.askId=ga.dataset.goask; state.askMode="redteam"; go("ask"); return; }
    var pk=t.closest("[data-pick]"); if(pk){ state.briefId=pk.dataset.pick; renderBriefs(); return; }
    var md=t.closest("[data-mode]"); if(md){ state.askMode=md.dataset.mode; answer(state.askMode); document.querySelectorAll(".mode").forEach(function(b){b.classList.toggle("active",b===md);}); return; }
    var st=t.closest("[data-settheme]"); if(st){ applyTheme(st.dataset.settheme); return; }
    var id=(t.closest("button")||{}).id;
    if(id==="themeBtn"||id==="themeBtnTop") toggleTheme();
    else if(id==="btnImport") el("fileInput").click();
    else if(id==="btnExport") exportData();
    else if(id==="btnReset"){ if(confirm("Replace current content with the built-in sample?")) resetSample(); }
    else if(id==="btnSetTime"){ var v=el("demoInput").value; if(v){ state.demoTime=new Date(v).toISOString(); localStorage.setItem(LS_DEMO,state.demoTime); go("next"); } }
    else if(id==="btnRealTime"){ state.demoTime=""; localStorage.removeItem(LS_DEMO); go("next"); }
    else if(id==="askSend"){ answer(null, el("askInput").value||"brief"); }
  });
  document.addEventListener("change", function(ev){ if(ev.target.id==="askSelect"){ state.askId=ev.target.value; answer(state.askMode); } });
  document.addEventListener("keydown", function(ev){ if(ev.key==="Enter" && ev.target.id==="askInput"){ answer(null, ev.target.value||"brief"); } });
  el("fileInput").addEventListener("change", function(ev){ if(ev.target.files&&ev.target.files[0]) importFile(ev.target.files[0]); ev.target.value=""; });
  matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function(){ if(!localStorage.getItem(LS_THEME)) applyTheme("system"); });
  window.addEventListener("online", updateChrome); window.addEventListener("offline", updateChrome);
  setInterval(function(){ var c=el("liveClock"); if(c) c.textContent=fmtClock(new Date()); if(state.view==="next"&&!state.demoTime) renderNext(); }, 30000);

  if("serviceWorker" in navigator){ window.addEventListener("load", function(){ navigator.serviceWorker.register("service-worker.js").catch(function(){}); }); }

  /* ---------- boot ---------- */
  function setupIcons(){ document.querySelectorAll("[data-icon]").forEach(function(n){ n.innerHTML=ic(n.dataset.icon); }); }
  loadData().then(function(){
    setupIcons(); updateThemeIcons();
    el("liveClock").textContent=fmtClock(new Date());
    var h=(location.hash||"").replace(/^#/,"");
    if(["schedule","briefs","ask","settings","next"].indexOf(h)>=0) state.view=h;
    else if(h.indexOf("e/")===0){ state.briefId=h.slice(2); state.view="briefs"; }
    go(state.view);
  });
})();
