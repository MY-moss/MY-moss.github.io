(function () {
  "use strict";
  var CONFIG = window.ATLAS_CONFIG;
  var state = { token: "", view: "overview", query: "", docs: {}, entries: [], bookmarks: loadStore("atlas_bookmarks", []), read: loadStore("atlas_read", []), lastSync: null, loading: false };
  var labels = { overview: "总览", world: "世界新闻", reading: "精选阅读", opensource: "开源雷达", inspiration: "灵感采集", knowledge: "知识回顾", archive: "历史档案", bookmarks: "我的书架", settings: "设置与连接" };
  function $(id) { return document.getElementById(id); }
  function loadStore(key, fallback) { try { var v = JSON.parse(localStorage.getItem(key)); return Array.isArray(v) ? v : fallback; } catch (_) { return fallback; } }
  function saveStore(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch (_) {} }
  function esc(value) { return String(value == null ? "" : value).replace(/[&<>"']/g, function (c) { return ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" })[c]; }); }
  function safeUrl(value) { try { var u = new URL(value); return u.protocol === "https:" ? u.href : ""; } catch (_) { return ""; } }
  function dateLabel(value) { if (!value) return "日期待核"; var d = new Date(value); return isNaN(d.getTime()) ? esc(value) : d.toLocaleDateString("zh-CN", { year:"numeric", month:"short", day:"numeric" }); }
  function toast(message) { var node = $("toast"); node.textContent = message; node.classList.add("is-visible"); clearTimeout(toast.timer); toast.timer = setTimeout(function(){ node.classList.remove("is-visible"); }, 2400); }
  function setStatus(online, label, detail) { $("sync-indicator").classList.toggle("is-online", !!online); $("sync-label").textContent = label; $("sync-detail").textContent = detail; }
  function repoUrl(path) { return CONFIG.apiBase + "/repos/" + encodeURIComponent(CONFIG.owner) + "/" + encodeURIComponent(CONFIG.dataRepo) + "/contents/" + path.split("/").map(encodeURIComponent).join("/") + "?ref=" + encodeURIComponent(CONFIG.branch); }
  async function api(path) {
    var response = await fetch(repoUrl(path), { headers: { "Accept":"application/vnd.github+json", "Authorization":"Bearer " + state.token, "X-GitHub-Api-Version":"2022-11-28" }, cache:"no-store" });
    if (!response.ok) { var err = new Error("GitHub API " + response.status); err.status = response.status; throw err; }
    return response.json();
  }
  async function validateToken(token) {
    var response = await fetch(CONFIG.apiBase + "/repos/" + CONFIG.owner + "/" + CONFIG.dataRepo, { headers: { "Accept":"application/vnd.github+json", "Authorization":"Bearer " + token, "X-GitHub-Api-Version":"2022-11-28" }, cache:"no-store" });
    if (!response.ok) throw new Error(response.status === 404 ? "无法访问私人仓库。请确认仓库已创建为 Private，并且令牌拥有该仓库的读取权限。" : "GitHub 验证失败（" + response.status + "）。请检查令牌权限或有效期。");
    var repo = await response.json();
    if (repo.full_name.toLowerCase() !== (CONFIG.owner + "/" + CONFIG.dataRepo).toLowerCase() || repo.private !== true) throw new Error("安全检查未通过：数据仓库必须是指定的私人仓库。");
    return repo;
  }
  function decodeContent(encoded) {
    var binary = atob((encoded || "").replace(/\s/g, ""));
    var bytes = new Uint8Array(binary.length);
    for (var i=0;i<binary.length;i++) bytes[i] = binary.charCodeAt(i);
    return new TextDecoder("utf-8").decode(bytes);
  }
  function flattenDoc(doc, stream, fileName) {
    var date = doc.date || doc.published_at || doc.publishedAt || fileName.replace(/\.json$/,"");
    var arrays = stream === "world" ? ["items","stories","top_stories"] :
      stream === "reading" ? ["items","articles","entries"] :
      stream === "opensource" ? ["items","projects","entries"] :
      stream === "inspiration" ? ["items","works","projects","entries"] :
      ["items","highlights","trends","people_projects","saved_sources","next_week","sections"];
    var list = [];
    for (var i=0;i<arrays.length;i++) if (Array.isArray(doc[arrays[i]])) { list = doc[arrays[i]]; break; }
    if (!list.length && (doc.title || doc.name)) list = [doc];
    return list.map(function(item, index) {
      var title = item.title || item.name || item.project || item.headline || item.topic || "未命名条目";
      var url = safeUrl(item.url || item.article_url || item.repo_url || item.website_url || item.link);
      return {
        id: stream + ":" + date + ":" + index + ":" + title,
        stream: stream,
        title: title,
        url: url,
        author: item.author || item.creator || item.team || item.maintainer || "",
        source: item.source || item.publisher || item.media || item.repository || "",
        date: item.published_at || item.publishedAt || item.date || date,
        summary: item.summary || item.description || item.what_happened || item.what_it_is || item.one_line || "",
        why: item.why_read || item.why_worth_reading || item.why_important || item.takeaway || item.why || "",
        priority: item.priority || item.recommendation || "",
        minutes: item.reading_minutes || item.readingMinutes || item.minutes || null,
        tags: Array.isArray(item.tags) ? item.tags : (item.category ? [item.category] : []),
        confidence: item.confidence || item.certainty || "",
        language: item.language || "",
        maturity: item.maturity || "",
        raw: item
      };
    });
  }
  async function loadStream(stream) {
    var dir = "data/feeds/" + stream.id;
    var files;
    try { files = await api(dir); } catch (e) { if (e.status === 404) return []; throw e; }
    if (!Array.isArray(files)) return [];
    files = files.filter(function(f){ return f.type === "file" && f.name.endsWith(".json"); }).sort(function(a,b){ return b.name.localeCompare(a.name); }).slice(0,16);
    var docs = await Promise.all(files.map(async function(file) {
      try {
        var data = await api(dir + "/" + file.name);
        var parsed = JSON.parse(decodeContent(data.content));
        return { stream: stream.id, file: file.name, date: parsed.date || parsed.week || file.name.replace(/\.json$/,""), title: parsed.title || stream.title, summary: parsed.summary || parsed.intro || "", items: flattenDoc(parsed, stream.id, file.name), raw: parsed };
      } catch (e) { return null; }
    }));
    return docs.filter(Boolean);
  }
  async function loadAll() {
    if (state.loading) return;
    state.loading = true; setStatus(true, "正在同步", "读取五条私人信息流");
    try {
      var results = await Promise.all(CONFIG.streams.map(loadStream));
      state.docs = {};
      state.entries = [];
      results.forEach(function(docs, i) { var id = CONFIG.streams[i].id; state.docs[id] = docs; docs.forEach(function(doc){ state.entries = state.entries.concat(doc.items); }); });
      state.entries.sort(function(a,b){ return String(b.date).localeCompare(String(a.date)); });
      state.lastSync = new Date();
      setStatus(true, "私人档案已连接", "同步于 " + state.lastSync.toLocaleTimeString("zh-CN", {hour:"2-digit",minute:"2-digit"}));
      $("workspace").setAttribute("aria-hidden","false");
      render();
    } catch (e) {
      setStatus(false, "同步失败", e.message);
      toast(e.message);
    } finally { state.loading = false; updateBookmarkCount(); }
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
    return '<article class="entry-card"><div class="entry-top"><span class="entry-source">'+esc(source || meta.en)+'</span>'+priority+'</div><h3>'+esc(entry.title)+'</h3><p class="entry-summary">'+esc(entry.summary || entry.why || "暂无摘要，打开原始来源了解详情。")+'</p><div class="entry-meta"><span>'+esc(meta.title)+'</span><span>'+esc(dateLabel(entry.date))+'</span>'+(author?'<span>'+author+'</span>':"")+(minutes?'<span>'+minutes+'</span>':"")+(entry.confidence?'<span>可信度 · '+esc(entry.confidence)+'</span>':"")+'</div>'+(tags?'<div class="entry-tags">'+tags+'</div>':"")+'<div class="entry-actions">'+open+'<button data-action="bookmark" data-id="'+esc(entry.id)+'" class="'+(saved?"is-saved":"")+'">'+(saved?"♥ 已收藏":"♡ 收藏")+'</button><button data-action="read" data-id="'+esc(entry.id)+'">'+(read?"✓ 已读":"标记已读")+'</button></div></article>';
  }
  function empty(title, copy) { return '<div class="feed-empty"><div class="empty-symbol">✳</div><h3>'+esc(title)+'</h3><p>'+esc(copy)+'</p></div>'; }
  function filtered(entries) {
    if (!state.query) return entries;
    var q = state.query.toLowerCase();
    return entries.filter(function(e){ return [e.title,e.summary,e.why,e.author,e.source].concat(e.tags).join(" ").toLowerCase().indexOf(q)>=0; });
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
    var list = latest.length ? latest.map(card).join("") : empty("你的第一份知识档案，正在等待抵达。","连接私人仓库后，五条信息流会在各自的自动化任务完成后陆续出现在这里。");
    return '<section class="hero"><div class="hero-copy"><div class="section-kicker">YOUR PERSONAL INTELLIGENCE LIBRARY</div><h1>让世界的复杂，<br>变成自己的秩序。</h1><p>五条长期信息流，持续采集值得知道、值得阅读、值得保存的内容。不是信息堆积，而是逐渐形成自己的知识地图。</p></div><div class="hero-date"><strong>'+new Date().toLocaleDateString("zh-CN",{month:"long",day:"numeric"})+'</strong><span>'+new Date().toLocaleDateString("en-US",{weekday:"long",year:"numeric"}).toUpperCase()+'</span></div></section><div class="stats-row"><div class="stat-card"><span>已归档期数</span><strong>'+totalDocs+'</strong><small>五条信息流累计</small></div><div class="stat-card"><span>收录条目</span><strong>'+state.entries.length+'</strong><small>文章、项目、观点与作品</small></div><div class="stat-card"><span>我的收藏</span><strong>'+state.bookmarks.length+'</strong><small>保存在当前浏览器</small></div><div class="stat-card"><span>已读标记</span><strong>'+state.read.length+'</strong><small>个人阅读进度</small></div></div><div class="section-heading"><div><div class="section-kicker">FIVE INTELLIGENCE STREAMS</div><h2>五条信息流</h2><p>不同节奏，同一个知识中枢。</p></div><span class="meta-label">01 / STREAMS</span></div><div class="stream-grid">'+cards+'</div><div class="content-columns"><section><div class="section-heading"><div><div class="section-kicker">LATEST ARRIVALS</div><h2>最近收录</h2><p>来自五条信息流的最新内容。</p></div><button class="plain-link" data-view="archive">查看全部 ↗</button></div><div class="entry-list">'+list+'</div></section><aside class="side-column"><div class="side-panel"><h3>今天的节奏</h3><div class="side-list">'+CONFIG.streams.map(function(s){return '<div class="side-list-row"><span class="side-list-mark">'+esc(s.icon)+'</span><div><strong>'+esc(s.title)+'</strong><small>'+esc(s.cadence)+'</small></div></div>';}).join("")+'</div></div><div class="side-panel"><h3>档案原则</h3><p>每一条内容都保留来源、发布日期与原始链接。重要事实区分已确认信息与分析判断。历史内容只追加，不静默覆盖。</p></div></aside></div>';
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
    return pageHeader("CHRONOLOGICAL LIBRARY","历史档案","按日期回看所有已经归档的文章、项目、作品与每周知识回顾。",entries.length+" 条记录")+(html||empty("历史档案尚为空。","新内容会自动按照日期追加保存。"));
  }
  function renderBookmarks() {
    var entries = state.entries.filter(function(e){return isSaved(e.id);});
    return pageHeader("YOUR READING SHELF","我的书架","收藏的文章、项目与灵感。收藏状态保存在当前浏览器。",entries.length+" 条收藏")+(entries.length?'<div class="entry-list">'+entries.map(card).join("")+'</div>':empty("书架还没有收藏。","在任意条目下点击“收藏”，它就会出现在这里。"));
  }
  function renderSettings() {
    return pageHeader("PREFERENCES & CONNECTION","设置与连接","管理私人数据连接、阅读偏好与当前会话。","PRIVATE")+'<div class="settings-grid"><section class="settings-card"><h3>私人数据仓库</h3><span class="status-pill">已通过私人仓库校验</span><p>站点只读取指定私人仓库。自动化任务负责写入新一期，浏览器端令牌仅用于读取。</p><div class="settings-value">'+esc(CONFIG.owner+"/"+CONFIG.dataRepo)+'</div></section><section class="settings-card"><h3>当前会话</h3><p>令牌仅保存在当前标签页的 sessionStorage 中。关闭标签页或退出登录后会清除。</p><button class="button button-quiet" data-action="logout">退出并清除令牌</button></section><section class="settings-card"><h3>自动更新节奏</h3>'+CONFIG.streams.map(function(s){return '<p><strong>'+esc(s.title)+'</strong> · '+esc(s.cadence)+'</p>';}).join("")+'</section><section class="settings-card"><h3>隐私边界</h3><p>GitHub Pages 托管的前端外壳本身可被公开访问；真正的内容数据存放在私人仓库，未通过仓库读取授权时不会加载。此方案不是 GitHub Pages 的 HTTP 层私有发布。</p><p>如需整个站点在网络层就要求 GitHub 登录，需要 GitHub Enterprise Cloud 组织级私有 Pages，或额外的访问代理。</p></section></div>';
  }
  function render() {
    var view = state.view, html;
    $("breadcrumb-current").textContent = labels[view] || "总览";
    document.querySelectorAll("[data-view]").forEach(function(el){el.classList.toggle("is-active",el.getAttribute("data-view")===view);});
    if (view==="overview") html=renderOverview();
    else if (view==="archive") html=renderArchive();
    else if (view==="bookmarks") html=renderBookmarks();
    else if (view==="settings") html=renderSettings();
    else html=renderFeed(view);
    $("page-content").innerHTML = html;
    $("global-search").value = state.query;
    updateBookmarkCount();
  }
  function updateBookmarkCount() { $("bookmark-count").textContent = state.bookmarks.length; }
  async function connect(token) {
    $("login-status").textContent = "正在验证私人仓库权限…";
    $("login-status").className = "form-status";
    try {
      state.token = token;
      await validateToken(token);
      sessionStorage.setItem("atlas_token", token);
      document.body.classList.remove("is-locked");
      $("workspace").setAttribute("aria-hidden","false");
      await loadAll();
      toast("私人档案已连接");
    } catch (e) {
      state.token = "";
      $("login-status").textContent = e.message;
      $("login-status").className = "form-status is-error";
      $("access-token").focus();
    }
  }
  function logout() {
    state.token = ""; sessionStorage.removeItem("atlas_token"); state.docs={}; state.entries=[];
    document.body.classList.add("is-locked"); $("workspace").setAttribute("aria-hidden","true");
    $("access-token").value = ""; $("login-status").textContent = "已退出。令牌已从当前会话清除。";
    setStatus(false,"等待连接","私人数据仓库"); toast("已安全退出");
  }
  document.addEventListener("click",function(event){
    var nav=event.target.closest("[data-view]");
    if(nav){state.view=nav.getAttribute("data-view");render();return;}
    var action=event.target.closest("[data-action]");
    if(!action)return;
    var id=action.getAttribute("data-id"), kind=action.getAttribute("data-action");
    if(kind==="bookmark"){var i=state.bookmarks.indexOf(id);if(i>=0)state.bookmarks.splice(i,1);else state.bookmarks.push(id);saveStore("atlas_bookmarks",state.bookmarks);render();toast(i>=0?"已从书架移除":"已加入书架");}
    if(kind==="read"){var j=state.read.indexOf(id);if(j>=0)state.read.splice(j,1);else state.read.push(id);saveStore("atlas_read",state.read);render();toast(j>=0?"已取消已读标记":"已标记为已读");}
    if(kind==="logout")logout();
  });
  $("login-form").addEventListener("submit",function(e){e.preventDefault();var token=$("access-token").value.trim();if(token)connect(token);});
  $("logout-button").addEventListener("click",logout);
  $("refresh-button").addEventListener("click",loadAll);
  $("top-refresh").addEventListener("click",loadAll);
  $("global-search").addEventListener("input",function(e){state.query=e.target.value.trim();render();});
  $("theme-button").addEventListener("click",function(){var dark=document.documentElement.getAttribute("data-theme")!=="dark";document.documentElement.setAttribute("data-theme",dark?"dark":"light");try{localStorage.setItem("atlas_theme",dark?"dark":"light");}catch(_){}});
  document.addEventListener("keydown",function(e){if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==="k"){e.preventDefault();$("global-search").focus();}if(e.key==="Escape"&&document.activeElement===$("global-search")){$("global-search").blur();}});
  try { var theme=localStorage.getItem("atlas_theme"); if(theme==="dark"||theme==="light")document.documentElement.setAttribute("data-theme",theme); } catch(_){}
  var savedToken="";try{savedToken=sessionStorage.getItem("atlas_token")||"";}catch(_){}
  if(savedToken)connect(savedToken);
})();