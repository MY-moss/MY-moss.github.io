(function () {
  "use strict";
  var CONFIG = window.ATLAS_CONFIG;
  var state = { view: "overview", previousView: "overview", selectedId: null, query: "", docs: {}, entries: [], errors: [], refreshTimer: null, bookmarks: loadStore("atlas_bookmarks", []), read: loadStore("atlas_read", []), lastSync: null, loading: false };
  var labels = { overview: "总览", world: "世界新闻", reading: "精选阅读", opensource: "开源雷达", inspiration: "灵感采集", archive: "历史档案", bookmarks: "我的书架", settings: "设置与连接", detail: "内容详情" };
  function $(id) { return document.getElementById(id); }
  function loadStore(key, fallback) { try { var v = JSON.parse(localStorage.getItem(key)); return Array.isArray(v) ? v : fallback; } catch (_) { return fallback; } }
  function saveStore(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch (_) {} }
  function loadObject(key) { try { var v=JSON.parse(localStorage.getItem(key)); return v && typeof v === "object" ? v : null; } catch (_) { return null; } }
  function esc(value) { return String(value == null ? "" : value).replace(/[&<>"']/g, function (c) { return ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" })[c]; }); }
  function safeUrl(value) { try { var u = new URL(value); return u.protocol === "https:" ? u.href : ""; } catch (_) { return ""; } }
  function dateLabel(value) { if (!value) return "日期待核"; var d = new Date(value); return isNaN(d.getTime()) ? esc(value) : d.toLocaleDateString("zh-CN", { year:"numeric", month:"short", day:"numeric" }); }
  function toast(message) { var node = $("toast"); node.textContent = message; node.classList.add("is-visible"); clearTimeout(toast.timer); toast.timer = setTimeout(function(){ node.classList.remove("is-visible"); }, 2400); }
  function setStatus(online, label, detail) { $("sync-indicator").classList.toggle("is-online", !!online); $("sync-label").textContent = label; $("sync-detail").textContent = detail; }
  function flattenDoc(doc, stream, fileName) {
    var date=doc.date || doc.published_at || doc.publishedAt || fileName.replace(/\.json$/,"");
    var candidates=stream==="world"?["items","stories","top_stories"]:
      stream==="reading"?["items","articles","entries"]:
      stream==="opensource"?["items","projects","entries"]:
      ["items","works","projects","entries"];
    var list=[];
    for(var i=0;i<candidates.length;i++){
      if(Array.isArray(doc[candidates[i]])&&doc[candidates[i]].length){list=doc[candidates[i]];break;}
    }
    if(!list.length&&(doc.title||doc.name))list=[doc];
    return list.map(function(item,index){
      item=typeof item==="string"?{title:item}:(item||{});
      var title=item.title||item.name||item.project||item.headline||item.topic||"未命名条目";
      var url=safeUrl(item.url||item.article_url||item.repo_url||item.repository_url||item.website_url||item.link);
      var tags=Array.isArray(item.tags)?item.tags.slice():(item.category?[item.category]:[]);
      return {
        id:stream+":"+date+":"+(item.id||(index+":"+title)),stream:stream,
        title:title,url:url,
        author:item.author||item.creator||item.team||item.maintainer||"",
        source:item.source||item.publisher||item.media||item.repository||"",
        date:item.published_at||item.publishedAt||item.date||date,
        summary:item.summary||item.description||item.what_happened||item.what_it_is||item.one_line||item.body||item.analysis||item.why||item.detail||"",
        why:item.why_read||item.why_worth_reading||item.why_important||item.takeaway||item.why||item.implication||item.method||item.uses||"",
        priority:item.priority||item.recommendation||"",
        minutes:item.reading_minutes||item.readingMinutes||item.minutes||null,
        tags:tags,
        confidence:item.confidence||item.certainty||"",
        language:item.language||"",
        maturity:item.maturity||item.project_maturity||"",
        stack:item.stack||item.tech_stack||item.technology||item.dependencies||"",
        difficulty:item.difficulty||item.setup_difficulty||item.onboarding_difficulty||"",
        license:item.license||item.licence||item.license_name||"",
        risks:item.risks||item.limitations||item.risk||"",
        recommendation:item.recommendation||item.recommendation_level||item.priority||"",
        uses:item.uses||item.use_cases||item.how_to_try||item.play_with||"",
        projectFit:item.project_fit||item.suitability||item.reuse_value||"",
        version:item.version||item.latest_version||"",
        stars:item.stars||item.star_count||"",
        platforms:item.platforms||item.platform_support||item.supported_platforms||"",
        homeUrl:safeUrl(item.website_url||item.homepage||""),
        docsUrl:safeUrl(item.docs_url||item.documentation_url||""),
        raw:item
      };
    });
  }
  async function loadAll() {
    if (state.loading) return;
    state.loading = true;
    setStatus(true, "正在同步", "获取公开内容索引");
    try {
      state.errors = [];
      var response = await fetch(new URL(CONFIG.feedUrl, window.location.href).href, {cache:"no-store"});
      if (!response.ok) throw new Error("内容读取失败（HTTP " + response.status + "）");
      var feed = await response.json();
      if (!feed || !Array.isArray(feed.reports)) throw new Error("内容索引不是有效的报告列表");
      if ((feed.channels||[]).some(function(c){return c.id==="knowledge";}) || feed.reports.some(function(r){return r.channel==="knowledge";})) throw new Error("检测到禁止公开的私人知识回顾频道，已停止加载。");
      var known = new Set(CONFIG.streams.map(function(s){ return s.id; }));
      var seen = new Set();
      state.docs = {};
      state.entries = [];
      CONFIG.streams.forEach(function(s){state.docs[s.id]=[];});
      feed.reports.forEach(function(report){
        if (!report || !known.has(report.channel) || !Array.isArray(report.items)) return;
        var date = String(report.date || "").slice(0,10);
        if (date.length !== 10 || date.charAt(4) !== "-" || date.charAt(7) !== "-") {
          state.errors.push("日期格式异常：" + String(report.title || "未命名报告"));
          return;
        }
        var key=report.channel+":"+date;
        if (seen.has(key)) {state.errors.push("重复报告："+key);return;}
        seen.add(key);
        var doc={stream:report.channel,file:key,date:date,title:report.title||"未命名报告",summary:report.summary||"",items:flattenDoc(report,report.channel,key),raw:report};
        state.docs[report.channel].push(doc);
        state.entries=state.entries.concat(doc.items);
      });
      CONFIG.streams.forEach(function(s){state.docs[s.id].sort(function(a,b){return b.date.localeCompare(a.date);});});
      state.entries.sort(function(a,b){return String(b.date).localeCompare(String(a.date));});
      saveStore("atlas_feed_cache",{cachedAt:new Date().toISOString(),feed:feed});
      state.lastSync=new Date();
      setStatus(true,state.errors.length?"已同步（有异常）":"公开档案已更新","同步于 "+state.lastSync.toLocaleTimeString("zh-CN",{hour:"2-digit",minute:"2-digit"})+(state.errors.length?" · "+state.errors.length+" 条异常":" · 四条信息流"));
      $("workspace").setAttribute("aria-hidden","false");
      render();
      if(state.errors.length)toast(state.errors.length+" 条内容异常，请检查源文件");
    } catch(e) {
      var cached=loadObject("atlas_feed_cache");
      if(cached&&cached.feed&&Array.isArray(cached.feed.reports)) {
        try {
          if(cached.feed.reports.some(function(r){return r.channel==="knowledge";}) || (cached.feed.channels||[]).some(function(c){return c.id==="knowledge";})) throw new Error("缓存中包含禁止公开的私人频道");
          state.docs={};state.entries=[];CONFIG.streams.forEach(function(s){state.docs[s.id]=[];});
          cached.feed.reports.forEach(function(report){if(!CONFIG.streams.some(function(s){return s.id===report.channel;}))return;var key=report.channel+":"+report.date;var doc={stream:report.channel,file:key,date:report.date,title:report.title||"未命名报告",summary:report.summary||"",items:flattenDoc(report,report.channel,key),raw:report};state.docs[report.channel].push(doc);state.entries=state.entries.concat(doc.items);});
          CONFIG.streams.forEach(function(s){state.docs[s.id].sort(function(a,b){return b.date.localeCompare(a.date);});});state.entries.sort(function(a,b){return String(b.date).localeCompare(String(a.date));});
          setStatus(false,"离线缓存","最近成功同步于 "+dateLabel(cached.cachedAt));render();
        } catch(cacheError) { setStatus(false,"缓存校验失败",cacheError.message);toast(cacheError.message); }
      } else {setStatus(false,"同步失败",e.message);toast(e.message);}
    } finally {state.loading=false;updateBookmarkCount();}
  }
  function streamMeta(id) { return CONFIG.streams.find(function(s){return s.id===id;}) || CONFIG.streams[0]; }
  function isSaved(id) { return state.bookmarks.indexOf(id) >= 0; }
  function card(entry) {
    var meta = streamMeta(entry.stream);
    var saved = isSaved(entry.id);
    var read = state.read.indexOf(entry.id) >= 0;
    var tags = entry.tags.slice(0,5).map(function(t){return '<span class="tag">'+esc(t)+'</span>';}).join("");
    var author = entry.author ? "作者 · " + esc(entry.author) : "";
    var source = entry.source || meta.en;
    var priority = entry.priority ? '<span class="entry-priority">'+esc(entry.priority)+'</span>' : "";
    var minutes = entry.minutes ? "约 " + esc(entry.minutes) + " 分钟" : "";
    var open = entry.url ? '<a href="'+esc(entry.url)+'" target="_blank" rel="noopener noreferrer">打开原始来源 ↗</a>' : "";
    return '<article class="entry-card"><div class="entry-top"><span class="entry-source">'+esc(source || meta.en)+'</span>'+priority+'</div><h3><button class="entry-title-button" data-open-entry="'+esc(entry.id)+'">'+esc(entry.title)+'</button></h3><p class="entry-summary">'+esc(entry.summary || entry.why || "暂无摘要，打开原始来源了解详情。")+'</p><div class="entry-meta"><span>'+esc(meta.title)+'</span><span>'+esc(dateLabel(entry.date))+'</span>'+(author?'<span>'+author+'</span>':"")+(minutes?'<span>'+minutes+'</span>':"")+(entry.confidence?'<span>可信度 · '+esc(entry.confidence)+'</span>':"")+'</div>'+(tags?'<div class="entry-tags">'+tags+'</div>':"")+'<div class="entry-actions">'+open+'<button data-action="bookmark" data-id="'+esc(entry.id)+'" class="'+(saved?"is-saved":"")+'">'+(saved?"♥ 已收藏":"♡ 收藏")+'</button><button data-action="read" data-id="'+esc(entry.id)+'">'+(read?"✓ 已读":"标记已读")+'</button></div></article>';
  }
  function empty(title, copy) { return '<div class="feed-empty"><div class="empty-symbol">✳</div><h3>'+esc(title)+'</h3><p>'+esc(copy)+'</p></div>'; }
  function filtered(entries) {
    if (!state.query) return entries;
    var q = state.query.toLowerCase();
    return entries.filter(function(e){ return [e.title,e.summary,e.why,e.author,e.source,e.stack,e.maturity,e.difficulty,e.license,e.risks,e.recommendation,e.uses,e.projectFit,e.version,e.platforms].concat(e.tags).join(" ").toLowerCase().indexOf(q)>=0; });
  }
  function pageHeader(kicker,title,copy,mark) {
    return '<div class="page-title-row"><div><div class="page-title-mark">'+esc(kicker)+'</div><h1>'+esc(title)+'</h1><p>'+esc(copy)+'</p></div>'+(mark?'<span class="status-pill">'+esc(mark)+'</span>':"")+'</div>';
  }
  function renderOverview() {
    var latest = filtered(state.entries).slice(0,6);
    var totalDocs = Object.keys(state.docs).reduce(function(sum,k){return sum+(state.docs[k]||[]).length;},0);
    var cards = CONFIG.streams.map(function(s){
      var count = (state.docs[s.id]||[]).length;
      return '<button class="stream-card" data-view="'+s.id+'"><span class="stream-icon">'+esc(s.icon)+'</span><h3>'+esc(s.title)+'</h3><p>'+esc(s.description)+'</p><div class="stream-bottom"><span>'+esc(s.cadence)+'</span><strong>'+count+' 期 ↗</strong></div></button>';
    }).join("");
    var list = latest.length ? latest.map(card).join("") : empty("你的第一份知识档案，正在等待抵达。","已发布的内容可直接浏览；其余频道将随新一期报告陆续更新。");
    return '<section class="hero"><div class="hero-copy"><div class="section-kicker">YOUR PERSONAL INTELLIGENCE LIBRARY</div><h1>让世界的复杂，<br>变成自己的秩序。</h1><p>四条公开信息流，持续采集值得知道、值得阅读、值得保存的内容。不是信息堆积，而是逐渐形成自己的知识地图。</p></div><div class="hero-date"><strong>'+new Date().toLocaleDateString("zh-CN",{month:"long",day:"numeric"})+'</strong><span>'+new Date().toLocaleDateString("en-US",{weekday:"long",year:"numeric"}).toUpperCase()+'</span></div></section><div class="stats-row"><div class="stat-card"><span>已归档期数</span><strong>'+totalDocs+'</strong><small>四条信息流累计</small></div><div class="stat-card"><span>收录条目</span><strong>'+state.entries.length+'</strong><small>文章、项目、观点与作品</small></div><div class="stat-card"><span>我的收藏</span><strong>'+state.bookmarks.length+'</strong><small>保存在当前浏览器</small></div><div class="stat-card"><span>已读标记</span><strong>'+state.read.length+'</strong><small>个人阅读进度</small></div></div><div class="section-heading"><div><div class="section-kicker">FOUR INTELLIGENCE STREAMS</div><h2>四条信息流</h2><p>不同节奏，同一个知识中枢。</p></div><span class="meta-label">01 / STREAMS</span></div><div class="stream-grid">'+cards+'</div><div class="content-columns"><section><div class="section-heading"><div><div class="section-kicker">LATEST ARRIVALS</div><h2>最近收录</h2><p>来自四条信息流的最新内容。</p></div><button class="plain-link" data-view="archive">查看全部 ↗</button></div><div class="entry-list">'+list+'</div></section><aside class="side-column"><div class="side-panel"><h3>今天的节奏</h3><div class="side-list">'+CONFIG.streams.map(function(s){return '<div class="side-list-row"><span class="side-list-mark">'+esc(s.icon)+'</span><div><strong>'+esc(s.title)+'</strong><small>'+esc(s.cadence)+'</small></div></div>';}).join("")+'</div></div><div class="side-panel"><h3>档案原则</h3><p>每一条内容都保留来源、发布日期与原始链接。重要事实区分已确认信息与分析判断。历史内容只追加，不静默覆盖。</p></div></aside></div>';
  }
  function renderFeed(id) {
    var meta = streamMeta(id), docs = state.docs[id] || [], entries = filtered(state.entries.filter(function(e){return e.stream===id;}));
    var latestDoc = docs[0];
    var intro = latestDoc && latestDoc.summary ? latestDoc.summary : meta.description;
    return pageHeader(meta.en,meta.title,intro,docs.length+" 期已归档") + (entries.length ? '<div class="entry-list">'+entries.map(card).join("")+'</div>' : empty("这条信息流还没有内容。","自动发布连接完成后，新一期会按日期归档到这里。当前节奏："+meta.cadence+"。"));
  }
  function renderArchive() {
    var entries = filtered(state.entries);
    var grouped = {};
    entries.forEach(function(e){var key=String(e.date||"日期待核").slice(0,10);(grouped[key]||(grouped[key]=[])).push(e);});
    var html = Object.keys(grouped).sort().reverse().map(function(day){return '<div class="section-heading"><div><div class="section-kicker">ARCHIVE DATE</div><h2>'+esc(day)+'</h2></div><span class="meta-label">'+grouped[day].length+' ITEMS</span></div><div class="entry-list">'+grouped[day].map(card).join("")+'</div>';}).join("");
    return pageHeader("CHRONOLOGICAL LIBRARY","历史档案","按日期回看所有已经归档的文章、项目、作品。",entries.length+" 条记录")+(html||empty("历史档案尚为空。","新内容会自动按照日期追加保存。"));
  }
  function renderBookmarks() {
    var entries = state.entries.filter(function(e){return isSaved(e.id);});
    return pageHeader("YOUR READING SHELF","我的书架","收藏的文章、项目与灵感。收藏状态保存在当前浏览器。",entries.length+" 条收藏")+(entries.length?'<div class="entry-list">'+entries.map(card).join("")+'</div>':empty("书架还没有收藏。","在任意条目下点击“收藏”，它就会出现在这里。"));
  }
  function renderDetail() {
    var entry=state.entries.find(function(e){return e.id===state.selectedId;});
    if(!entry)return pageHeader("CONTENT DETAIL","内容详情","这条内容可能已更新或移除。","")+empty("没有找到这条内容。","返回频道或历史档案继续浏览。");
    var project=entry.stream==="opensource";
    var fields=project?[["核心用途",entry.summary],["技术栈 / 关键依赖",entry.stack],["项目成熟度",entry.maturity],["上手难度",entry.difficulty],["许可证",entry.license],["潜在风险 / 限制",entry.risks],["推荐等级",entry.recommendation],["可以怎么玩",entry.uses],["适合复用到自己的项目",entry.projectFit],["版本",entry.version],["Star 数",entry.stars],["平台支持",entry.platforms]]:[["核心内容",entry.summary],["值得关注的原因",entry.why],["作者 / 团队",entry.author],["来源",entry.source],["分类",entry.category],["标签",entry.tags]];
    function field(label,value){var text=Array.isArray(value)?value.join("、"):String(value||"未提供 / 未核实");return '<div class="detail-cell"><span class="eyebrow">'+esc(label)+'</span><p>'+esc(text)+'</p></div>';}
    var links=[["GitHub / 原始项目",entry.url],["官方网站",entry.homeUrl],["文档",entry.docsUrl]].filter(function(x,i,a){return x[1]&&a.findIndex(function(y){return y[1]===x[1];})===i;});
    return pageHeader(project?"OPEN SOURCE PROJECT":streamMeta(entry.stream).en,entry.title,entry.summary||entry.why,entry.recommendation||"")+
      '<div class="detail-layout"><section class="detail-panel"><div class="detail-grid">'+fields.map(function(x){return field(x[0],x[1]);}).join("")+'</div><div class="detail-actions">'+links.map(function(x){return '<a href="'+esc(x[1])+'" target="_blank" rel="noopener noreferrer">'+esc(x[0])+' ↗</a>';}).join("")+'</div></section>'+
      '<aside class="detail-aside"><div class="side-panel"><h3>研究判断</h3><p>'+esc(entry.why||"未提供 / 未核实")+'</p></div><div class="side-panel"><h3>记录信息</h3><p>所属频道：'+esc(streamMeta(entry.stream).title)+'</p><p>报告日期：'+esc(dateLabel(entry.date))+'</p></div><div class="side-panel"><button class="button button-quiet" data-action="bookmark" data-id="'+esc(entry.id)+'">'+(isSaved(entry.id)?"♥ 已收藏":"♡ 收藏")+'</button> <button class="button button-quiet" data-action="read" data-id="'+esc(entry.id)+'">'+(state.read.indexOf(entry.id)>=0?"✓ 已读":"标记已读")+'</button></div></aside></div><button class="plain-link detail-back" data-action="back">← 返回上一页</button>';
  }
  function renderSettings() {
    return pageHeader("ABOUT & PREFERENCES","关于 ATLAS","开放的知识与创意研究档案，无需登录。","PUBLIC")+
      '<div class="settings-grid"><section class="settings-card"><h3>公开内容来源</h3><span class="status-pill">无需登录</span><p>ATLAS 读取同域公开 JSON 索引；四条信息流会通过 GitHub Actions 重新部署并自动刷新。</p><div class="settings-value">'+esc(CONFIG.feedUrl)+'</div></section>'+
      '<section class="settings-card"><h3>我的书架</h3><p>收藏、已读记录和主题只保存在当前浏览器，不提交到公共数据源，也不会跨设备自动同步。</p></section>'+
      '<section class="settings-card"><h3>更新节奏</h3>'+CONFIG.streams.map(function(s){return '<p><strong>'+esc(s.title)+'</strong> · '+esc(s.cadence)+'</p>';}).join("")+'</section>'+
      '<section class="settings-card"><h3>内容原则</h3><p>公开内容仅包含可以公开分享的来源、分析和研究结果；不应包含密钥、个人笔记及私密资料。</p></section></div>';
  }
  function render() {
    var view = state.view, html;
    $("breadcrumb-current").textContent = labels[view] || "总览";
    document.querySelectorAll("[data-view]").forEach(function(el){el.classList.toggle("is-active",el.getAttribute("data-view")===view);});
    if (view==="overview") html=renderOverview();
    else if (view==="archive") html=renderArchive();
    else if (view==="bookmarks") html=renderBookmarks();
    else if (view==="settings") html=renderSettings();
    else if (view==="detail") html=renderDetail();
    else html=renderFeed(view);
    $("page-content").innerHTML = html;
    $("global-search").value = state.query;
    updateBookmarkCount();
    var banner=$("network-banner"); if(banner){banner.hidden=!!navigator.onLine;banner.textContent=navigator.onLine?"":"当前离线：正在使用最近一次成功缓存的内容。";}
  }
  function updateBookmarkCount() { $("bookmark-count").textContent = state.bookmarks.length; }
  document.addEventListener("click",function(event){
    var nav=event.target.closest("[data-view]");
    if(nav){state.previousView=state.view;state.view=nav.getAttribute("data-view");render();return;}
    var open=event.target.closest("[data-open-entry]");
    if(open){state.previousView=state.view;state.selectedId=open.getAttribute("data-open-entry");state.view="detail";render();return;}
    var action=event.target.closest("[data-action]");
    if(!action)return;
    var id=action.getAttribute("data-id"), kind=action.getAttribute("data-action");
    if(kind==="bookmark"){var i=state.bookmarks.indexOf(id);if(i>=0)state.bookmarks.splice(i,1);else state.bookmarks.push(id);saveStore("atlas_bookmarks",state.bookmarks);render();toast(i>=0?"已从书架移除":"已加入书架");}
    if(kind==="read"){var j=state.read.indexOf(id);if(j>=0)state.read.splice(j,1);else state.read.push(id);saveStore("atlas_read",state.read);render();toast(j>=0?"已取消已读标记":"已标记为已读");}
    if(kind==="back"){state.view=state.previousView||"overview";render();}
  });
  $("refresh-button").addEventListener("click",loadAll);
  $("top-refresh").addEventListener("click",loadAll);
  $("global-search").addEventListener("input",function(e){state.query=e.target.value.trim();render();});
  $("theme-button").addEventListener("click",function(){var dark=document.documentElement.getAttribute("data-theme")!=="dark";document.documentElement.setAttribute("data-theme",dark?"dark":"light");try{localStorage.setItem("atlas_theme",dark?"dark":"light");}catch(_){}});
  document.addEventListener("keydown",function(e){if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==="k"){e.preventDefault();$("global-search").focus();}if(e.key==="Escape"&&document.activeElement===$("global-search")){$("global-search").blur();}});
  try { var theme=localStorage.getItem("atlas_theme"); if(theme==="dark"||theme==="light")document.documentElement.setAttribute("data-theme",theme); } catch(_){}
  if ("serviceWorker" in navigator) navigator.serviceWorker.register("./sw.js?v=3",{scope:"./",updateViaCache:"none"}).then(function(registration){return registration.update();}).catch(function(){});
  window.addEventListener("online",function(){var banner=$("network-banner");if(banner)banner.hidden=true;loadAll();});
  window.addEventListener("offline",function(){var banner=$("network-banner");if(banner){banner.hidden=false;banner.textContent="当前离线：正在使用最近一次成功缓存的内容。";}});
  loadAll();
  window.setInterval(function(){if(!state.loading&&navigator.onLine)loadAll();},CONFIG.refreshIntervalMs||300000);
})();