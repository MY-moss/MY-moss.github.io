const DATA_URL = "./data/index.json";
const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const main = $("#main");
const searchInput = $("#searchInput");
let db = {reports:[]};
let query = "";
let activeCategory = "全部";
let saved = new Set();
try { saved = new Set(JSON.parse(localStorage.getItem("ih-saved") || "[]")); } catch {}
const categoryGlyph = {
  "交互与网站":"↗","品牌视觉":"✳","字体与排版":"Aa","游戏与像素":"▦","动态与影像":"▶",
  "数字艺术":"◌","插画与出版":"▤","摄影与叙事":"◉","创意工具":"⌘","声音与音乐":"♫","展览与研究":"✷","产品设计":"◇"
};
const artClass = c => ({
  "交互与网站":"art-motion","品牌视觉":"art-brand","字体与排版":"art-type","游戏与像素":"art-game",
  "动态与影像":"art-motion","数字艺术":"art-art","插画与出版":"art-photo","摄影与叙事":"art-photo",
  "创意工具":"art-tool","声音与音乐":"art-sound","展览与研究":"art-type","产品设计":"art-game"
}[c] || "art-art");
const allItems = () => db.reports.flatMap(r => r.items.map((i,n)=>({...i,reportDate:r.date,reportTitle:r.title,number:n+1})));
const esc = s => String(s ?? "").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const fmt = d => { const [y,m,day]=d.split("-"); return y+"."+m+"."+day; };
const getReport = d => db.reports.find(r=>r.date===d);
function toast(message){const t=$("#toast");t.textContent=message;t.classList.add("show");clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.classList.remove("show"),1800);}
function updateHeader(view){
  $$("[data-view]").forEach(a=>a.classList.toggle("active",a.dataset.view===view));
  $("#savedCount").textContent=saved.size;
}
function art(item,n=0){
  const glyph = categoryGlyph[item.category] || "✳";
  return '<div class="card-art '+artClass(item.category)+'"><span class="art-code">'+String(n+1).padStart(2,"0")+' / FIELD NOTE</span><span class="art-glyph">'+glyph+'</span></div>';
}
function card(item,n=0){
  const isSaved=saved.has(item.id);
  return '<article class="item-card">'+art(item,n)+'<div class="card-body"><div class="card-top"><span class="category-label">'+esc(item.category)+'</span><span class="age-label">'+esc(item.age||"参考案例")+'</span></div><h3>'+esc(item.title)+'</h3><div class="creator">'+esc(item.creator)+'</div><p class="card-summary">'+esc(item.why)+'</p><div class="card-foot"><a href="?date='+encodeURIComponent(item.reportDate)+'#item-'+encodeURIComponent(item.id)+'">研究方法 ↗</a><button class="bookmark '+(isSaved?"saved":"")+'" data-action="bookmark" data-id="'+esc(item.id)+'" aria-label="'+(isSaved?"取消收藏":"收藏")+'">'+(isSaved?"★":"☆")+'</button></div></div></article>';
}
function reportRow(r){
 return '<a class="report-row" href="?date='+r.date+'"><span class="report-date">'+fmt(r.date)+'</span><span><h3>'+esc(r.title)+'</h3><p>'+esc(r.summary)+'</p></span><span class="report-count">'+r.items.length+' PICKS ↗</span></a>';
}
function sectionHead(kicker,title,link="",label="查看全部 →"){
 return '<div class="section-head"><div><span class="eyebrow">'+kicker+'</span><h2>'+title+'</h2></div>'+(link?'<a href="'+link+'">'+label+'</a>':"")+'</div>';
}
function categoryChips(){
 const cats=["全部",...new Set(allItems().map(i=>i.category))];
 return '<div class="category-strip">'+cats.map(c=>'<button class="chip '+(activeCategory===c?"active":"")+'" data-category="'+esc(c)+'">'+esc(c)+'</button>').join("")+'</div>';
}
function renderHome(){
 const latest=db.reports[0], recent=allItems().slice(0,6);
 main.innerHTML='<section class="hero"><div class="hero-copy"><span class="eyebrow">THE DAILY FIELD NOTES · VOL. 01</span><h1>把灵感<br><em>变成方法。</em></h1><p>每天发现值得研究的设计、网站、交互与视觉实验。这里不只收藏好看的作品，更拆解它们背后的规则、技术与创作思路。</p><div class="hero-actions"><a class="button-primary" href="?view=archive">浏览全部日报 <span>↗</span></a><a class="button-quiet" href="?view=topics">按主题探索</a></div></div><div class="hero-art"><span class="art-index">IH / 001</span><div class="hero-orb"></div><span class="orbit-dot"></span><span class="orbit-dot two"></span><span class="art-label">COLLECT · CONNECT · CREATE</span><span class="hero-stat">'+db.reports.length+' ISSUES / '+allItems().length+' IDEAS</span></div></section>'+
 sectionHead("01 / LATEST ISSUE","最新一期","?date="+latest.date,"打开完整日报 ↗")+
 '<section class="latest-issue"><a class="latest-visual" href="?date='+latest.date+'"><span class="visual-date">'+fmt(latest.date)+' / DAILY RESEARCH</span><span class="visual-word">Field<br>notes.</span></a><div class="latest-copy"><span class="eyebrow">'+esc(latest.theme)+'</span><h3>'+esc(latest.title)+'</h3><p>'+esc(latest.summary)+'</p><a class="latest-link" href="?date='+latest.date+'">阅读本期内容 <span>→</span></a></div></section>'+
 sectionHead("02 / EXPLORE BY METHOD","从方法开始探索","?view=topics")+
 categoryChips()+
 sectionHead("03 / RECENT PICKS","最近收录","?view=archive")+
 '<div class="card-grid">'+recent.map(card).join("")+'</div>'+
 sectionHead("04 / ARCHIVE","过往日报","?view=archive")+
 '<div class="report-list">'+db.reports.slice(0,5).map(reportRow).join("")+'</div>';
}
function filterItems(items){
 const q=query.trim().toLowerCase();
 return items.filter(i=>(activeCategory==="全部"||i.category===activeCategory)&&(!q||[i.title,i.creator,i.category,i.why,i.method,i.uses,...(i.tags||[])].join(" ").toLowerCase().includes(q)));
}
function renderArchive(){
 const items=filterItems(allItems());
 const reportsFiltered=db.reports.filter(r=>!query||[r.title,r.summary,r.theme].join(" ").toLowerCase().includes(query.toLowerCase()));
 main.innerHTML='<section class="page-intro"><span class="eyebrow">THE ARCHIVE / 001—'+String(db.reports.length).padStart(3,"0")+'</span><h1>灵感档案</h1><p>按日期回看每日精选，也可以用关键词搜索作品、创作者、设计方法与应用方向。所有条目保留原始来源，方便继续研究。</p></section><div class="toolbar"><span class="result-count">'+items.length+' ITEMS FOUND · '+reportsFiltered.length+' ISSUES</span>'+categoryChips()+'</div><div class="card-grid">'+items.map(card).join("")+'</div><div style="height:44px"></div>'+sectionHead("DAILY ISSUES","按日期浏览")+'<div class="report-list">'+reportsFiltered.map(reportRow).join("")+'</div>';
 if(!items.length&&!reportsFiltered.length) main.innerHTML+='<div class="empty-state"><strong>没有找到匹配内容</strong>试试更短的关键词，或清除分类筛选。</div>';
}
function renderTopics(){
 const counts={};allItems().forEach(i=>counts[i.category]=(counts[i.category]||0)+1);
 const topics=Object.entries(counts).sort((a,b)=>b[1]-a[1]);
 main.innerHTML='<section class="page-intro"><span class="eyebrow">TAXONOMY / METHODS</span><h1>主题索引</h1><p>从创作问题出发，而不只是按作品类型浏览。选择一个方向，查看相关案例和可迁移的方法。</p></section><div class="topic-grid">'+topics.map(([c,n])=>'<button class="topic-card" data-topic="'+esc(c)+'"><span class="eyebrow">'+esc(categoryGlyph[c]||"✳")+' / TOPIC</span><strong>'+esc(c)+'</strong><small>'+n+' IDEAS · EXPLORE ↗</small></button>').join("")+'</div>';
}
function detailItem(i,n){
 return '<article class="detail-card" id="item-'+esc(i.id)+'"><div class="detail-head"><div><span class="category-label">'+esc(i.category)+' · '+esc(i.age||"参考案例")+'</span><h2>'+esc(i.title)+'</h2><p>'+esc(i.creator)+'</p></div><span class="detail-number">'+String(n+1).padStart(2,"0")+' / '+String(allItems().length).padStart(2,"0")+'</span></div><div class="detail-grid"><section class="detail-cell"><span class="eyebrow">01 / WHY IT WORKS</span><p>'+esc(i.why)+'</p></section><section class="detail-cell"><span class="eyebrow">02 / TAKEAWAY</span><p>'+esc(i.method)+'</p></section><section class="detail-cell"><span class="eyebrow">03 / USE CASES</span><p>'+esc(i.uses)+'</p></section></div><div class="detail-footer"><div class="tag-list">'+(i.tags||[]).map(t=>'<span class="tag">'+esc(t)+'</span>').join("")+'</div><div style="display:flex;gap:15px;align-items:center"><button class="bookmark '+(saved.has(i.id)?"saved":"")+'" data-action="bookmark" data-id="'+esc(i.id)+'">'+(saved.has(i.id)?"★ 已收藏":"☆ 收藏")+'</button><a class="source-link" href="'+esc(i.url)+'" target="_blank" rel="noopener noreferrer">打开原始来源 ↗</a></div></div></article>';
}
function renderReport(date){
 const r=getReport(date);
 if(!r){main.innerHTML='<div class="empty-state"><strong>没有找到这期日报</strong><a class="back-link" href="?view=archive">返回日报档案 →</a></div>';return;}
 main.innerHTML='<section class="report-hero"><a class="back-link" href="?view=archive">← 返回档案</a><div class="report-meta" style="margin-top:24px"><span>'+fmt(r.date)+'</span><span>DAILY INSPIRATION</span><span>'+r.items.length+' PICKS</span><span>'+esc(r.theme)+'</span></div><h1>'+esc(r.title)+'</h1><p>'+esc(r.summary)+'</p><div class="hero-actions"><button class="button-quiet" data-action="copy-page">复制本期链接 ↗</button><a class="button-quiet" href="?view=archive">浏览其他日报</a></div></section><div class="detail-items">'+r.items.map(detailItem).join("")+'</div>';
 if(location.hash){requestAnimationFrame(()=>{const el=document.querySelector(location.hash);if(el)el.scrollIntoView({behavior:"smooth",block:"start"});});}
}
function renderSaved(){
 const items=allItems().filter(i=>saved.has(i.id));
 main.innerHTML='<section class="page-intro"><span class="eyebrow">YOUR LIBRARY / BOOKMARKS</span><h1>我的收藏</h1><p>收藏值得反复研究的作品与方法。收藏仅保存在当前浏览器，不需要账号，也不会上传到服务器。</p></section>'+(items.length?'<div class="card-grid">'+items.map(card).join("")+'</div>':'<div class="empty-state"><strong>收藏夹还是空的</strong>在作品卡片或日报详情中点击 ☆，把值得留下的灵感收进来。</div>');
}
function renderSearch(){
 const items=filterItems(allItems());
 main.innerHTML='<section class="page-intro"><span class="eyebrow">SEARCH / DISCOVER</span><h1>搜索灵感</h1><p>搜索作品名称、作者、类别、设计原理、标签或适用项目。</p></section><div class="toolbar"><span class="result-count">'+items.length+' RESULTS</span>'+categoryChips()+'</div>'+(items.length?'<div class="card-grid">'+items.map(card).join("")+'</div>':'<div class="empty-state"><strong>没有找到匹配内容</strong>换个关键词试试。</div>');
}
function render(){
 const params=new URLSearchParams(location.search);
 const date=params.get("date");
 const view=params.get("view")||"home";
 updateHeader(date?"":view);
 if(date){renderReport(date);return;}
 if(query){renderSearch();return;}
 if(view==="archive")renderArchive();
 else if(view==="topics")renderTopics();
 else if(view==="saved")renderSaved();
 else renderHome();
}
function saveState(){localStorage.setItem("ih-saved",JSON.stringify([...saved]));$("#savedCount").textContent=saved.size;}
document.addEventListener("click",e=>{
 const b=e.target.closest("[data-action]");
 if(b){
  if(b.dataset.action==="bookmark"){const id=b.dataset.id;saved.has(id)?saved.delete(id):saved.add(id);saveState();render();toast(saved.has(id)?"已加入收藏":"已取消收藏");}
  if(b.dataset.action==="copy-page"){navigator.clipboard?.writeText(location.href).then(()=>toast("本期链接已复制")).catch(()=>toast("复制失败，请手动复制地址"));}
  return;
 }
 const cat=e.target.closest("[data-category]");
 if(cat){activeCategory=cat.dataset.category;const p=new URLSearchParams(location.search);p.set("view","archive");history.pushState(null,"","?"+p.toString());render();return;}
 const topic=e.target.closest("[data-topic]");
 if(topic){activeCategory=topic.dataset.topic;history.pushState(null,"","?view=archive");render();return;}
});
searchInput.addEventListener("input",e=>{query=e.target.value;render();});
searchInput.addEventListener("keydown",e=>{if(e.key==="Escape"){searchInput.value="";query="";render();searchInput.blur();}});
document.addEventListener("keydown",e=>{if(e.key==="/"&&document.activeElement!==searchInput&&!["INPUT","TEXTAREA"].includes(document.activeElement.tagName)){e.preventDefault();searchInput.focus();}});
$("#themeToggle").addEventListener("click",()=>{const next=document.documentElement.dataset.theme==="dark"?"light":"dark";document.documentElement.dataset.theme=next;localStorage.setItem("ih-theme",next);});
window.addEventListener("popstate",render);
(async()=>{
 const theme=localStorage.getItem("ih-theme");if(theme)document.documentElement.dataset.theme=theme;
 try{const res=await fetch(DATA_URL,{cache:"no-store"});if(!res.ok)throw new Error("内容加载失败");db=await res.json();db.reports.sort((a,b)=>b.date.localeCompare(a.date));$("#footerMeta").textContent="更新于 "+db.updatedAt+" · "+db.reports.length+" 期日报 · "+allItems().length+" 个灵感条目";render();}
 catch(err){main.innerHTML='<div class="empty-state"><strong>内容暂时无法加载</strong>请检查网络连接后刷新页面。<br><small>'+esc(err.message)+'</small></div>';}
 if("serviceWorker" in navigator){navigator.serviceWorker.register("./sw.js",{scope:"./"}).catch(()=>{});}
})();