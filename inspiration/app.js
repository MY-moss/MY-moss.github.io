const DATA_URL="./data/index.json";
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const main=$("#main"),searchInput=$("#searchInput");
let db={reports:[],channels:[]},query="",activeCategory="全部",saved=new Set();
try{saved=new Set(JSON.parse(localStorage.getItem("ih-saved")||"[]"));}catch{}
const channelNames={inspiration:"灵感采集",opensource:"开源项目雷达",knowledge:"每周知识回顾",all:"全部内容"};
const glyphs={"交互与网站":"↗","品牌视觉":"✳","字体与排版":"Aa","游戏与像素":"▦","动态与影像":"▶","数字艺术":"◌","插画与出版":"▤","摄影与叙事":"◉","创意工具":"⌘","声音与音乐":"♫","展览与研究":"✷","产品设计":"◇","AI / Agent":"⌘","开发工具":"⌁","知识与趋势":"◈"};
const artClass=c=>({"交互与网站":"art-motion","品牌视觉":"art-brand","字体与排版":"art-type","游戏与像素":"art-game","动态与影像":"art-motion","数字艺术":"art-art","插画与出版":"art-photo","摄影与叙事":"art-photo","创意工具":"art-tool","声音与音乐":"art-sound","展览与研究":"art-type","产品设计":"art-game","AI / Agent":"art-tool","开发工具":"art-motion","知识与趋势":"art-art"}[c]||"art-art");
const channelOf=r=>r.channel||"inspiration";
const reportsFor=ch=>db.reports.filter(r=>ch==="all"||channelOf(r)===ch).sort((a,b)=>b.date.localeCompare(a.date));
const itemsFor=ch=>reportsFor(ch).flatMap(r=>r.items.map((i,n)=>({...i,channel:channelOf(r),reportDate:r.date,reportTitle:r.title,number:n+1})));
const allItems=()=>itemsFor("all");
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const fmt=d=>{const [y,m,day]=d.split("-");return y+"."+m+"."+day;};
const channelLabel=ch=>db.channels.find(c=>c.id===ch)?.label||channelNames[ch]||"灵感采集";
function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.classList.remove("show"),1800);}
function updateHeader(view,ch){
 $$("[data-view]").forEach(a=>a.classList.toggle("active",a.dataset.view===view));
 $$("[data-channel]").forEach(a=>a.classList.toggle("active",a.dataset.channel===ch));
 $("#savedCount").textContent=saved.size;
}
function art(item,n=0){return '<div class="card-art '+artClass(item.category)+'"><span class="art-code">'+String(n+1).padStart(2,"0")+' / FIELD NOTE</span><span class="art-glyph">'+(glyphs[item.category]||"✳")+'</span></div>';}
function card(item,n=0){
 const isSaved=saved.has(item.id),ch=item.channel||"inspiration";
 return '<article class="item-card">'+art(item,n)+'<div class="card-body"><div class="card-top"><span class="category-label">'+esc(item.category)+'</span><span class="age-label">'+esc(item.age||channelLabel(ch))+'</span></div><h3>'+esc(item.title)+'</h3><div class="creator">'+esc(item.creator)+'</div><p class="card-summary">'+esc(item.why)+'</p><div class="card-foot"><a href="?channel='+encodeURIComponent(ch)+'&date='+encodeURIComponent(item.reportDate)+'#item-'+encodeURIComponent(item.id)+'">研究方法 ↗</a><button class="bookmark '+(isSaved?"saved":"")+'" data-action="bookmark" data-id="'+esc(item.id)+'" aria-label="'+(isSaved?"取消收藏":"收藏")+'">'+(isSaved?"★":"☆")+'</button></div></div></article>';
}
function reportRow(r){
 const ch=channelOf(r);
 return '<a class="report-row" href="?channel='+encodeURIComponent(ch)+'&date='+encodeURIComponent(r.date)+'"><span class="report-date">'+fmt(r.date)+'</span><span><small class="row-channel">'+esc(channelLabel(ch))+'</small><h3>'+esc(r.title)+'</h3><p>'+esc(r.summary)+'</p></span><span class="report-count">'+r.items.length+' PICKS ↗</span></a>';
}
function sectionHead(kicker,title,link="",label="查看全部 →"){return '<div class="section-head"><div><span class="eyebrow">'+kicker+'</span><h2>'+title+'</h2></div>'+(link?'<a href="'+link+'">'+label+'</a>':"")+'</div>';}
function categoryChips(ch="all"){
 const cats=["全部",...new Set(itemsFor(ch).map(i=>i.category))];
 return '<div class="category-strip">'+cats.map(c=>'<button class="chip '+(activeCategory===c?"active":"")+'" data-category="'+esc(c)+'">'+esc(c)+'</button>').join("")+'</div>';
}
function channelTiles(){
 return '<div class="channel-grid">'+(db.channels||[]).map(c=>{
  const n=reportsFor(c.id).length,count=itemsFor(c.id).length;
  return '<a class="channel-card '+(c.id==="inspiration"?"channel-featured":"")+'" href="?channel='+encodeURIComponent(c.id)+'"><span class="eyebrow">'+esc(c.kicker||"CHANNEL")+'</span><strong>'+esc(c.label)+'</strong><p>'+esc(c.description)+'</p><small>'+(n?n+" 期 · "+count+" 条":"已建立频道 · 等待首期发布")+'　↗</small></a>';
 }).join("")+'</div>';
}
function renderHome(){
 const list=reportsFor("inspiration"),latest=list[0],recent=itemsFor("inspiration").slice(0,6);
 if(!latest){main.innerHTML='<div class="empty-state"><strong>灵感频道正在准备</strong>下一期内容发布后会显示在这里。</div>';return;}
 main.innerHTML='<section class="hero"><div class="hero-copy"><span class="eyebrow">THE DAILY FIELD NOTES · VOL. 01</span><h1>把灵感<br><em>变成方法。</em></h1><p>每天发现值得研究的设计、网站、交互与视觉实验。这里不只收藏好看的作品，更拆解它们背后的规则、技术与创作思路。</p><div class="hero-actions"><a class="button-primary" href="?channel=inspiration&view=archive">浏览全部日报 <span>↗</span></a><a class="button-quiet" href="?channel=inspiration&view=topics">按主题探索</a></div></div><div class="hero-art"><span class="art-index">IH / 001</span><div class="hero-orb"></div><span class="orbit-dot"></span><span class="orbit-dot two"></span><span class="art-label">COLLECT · CONNECT · CREATE</span><span class="hero-stat">'+list.length+' ISSUES / '+itemsFor("inspiration").length+' IDEAS</span></div></section>'+
 sectionHead("01 / LATEST ISSUE","最新一期","?channel=inspiration&date="+latest.date,"打开完整日报 ↗")+
 '<section class="latest-issue"><a class="latest-visual" href="?channel=inspiration&date='+latest.date+'"><span class="visual-date">'+fmt(latest.date)+' / DAILY RESEARCH</span><span class="visual-word">Field<br>notes.</span></a><div class="latest-copy"><span class="eyebrow">'+esc(latest.theme)+'</span><h3>'+esc(latest.title)+'</h3><p>'+esc(latest.summary)+'</p><a class="latest-link" href="?channel=inspiration&date='+latest.date+'">阅读本期内容 <span>→</span></a></div></section>'+
 sectionHead("02 / CONTENT CHANNELS","内容频道")+
 channelTiles()+
 sectionHead("03 / EXPLORE BY METHOD","从方法开始探索","?channel=inspiration&view=topics")+
 categoryChips("inspiration")+
 sectionHead("04 / RECENT PICKS","最近收录","?channel=inspiration&view=archive")+
 '<div class="card-grid">'+recent.map(card).join("")+'</div>'+
 sectionHead("05 / ARCHIVE","过往日报","?channel=inspiration&view=archive")+
 '<div class="report-list">'+list.slice(0,5).map(reportRow).join("")+'</div>';
}
function renderChannel(ch){
 if(ch==="inspiration"){renderHome();return;}
 const meta=(db.channels||[]).find(c=>c.id===ch)||{label:channelNames[ch]||"内容频道",description:"持续更新的研究与精选内容。"};
 const list=reportsFor(ch);
 main.innerHTML='<section class="page-intro"><span class="eyebrow">CHANNEL / '+esc((ch||"").toUpperCase())+'</span><h1>'+esc(meta.label)+'</h1><p>'+esc(meta.description)+'</p><div class="hero-actions"><a class="button-quiet" href="?channel='+encodeURIComponent(ch)+'&view=archive">浏览频道档案 ↗</a><a class="button-quiet" href="?channel=all&view=archive">查看全部内容</a></div></section>'+
 (list.length?'<div class="report-list">'+list.map(reportRow).join("")+'</div>':'<div class="empty-state"><strong>频道已建立，内容正在接入</strong>下一次定时研究完成并成功发布后，这里就会出现新内容。<br><small>自动发布会保留原始来源、分析和可执行建议。</small></div>');
}
function filterItems(items){const q=query.trim().toLowerCase();return items.filter(i=>(activeCategory==="全部"||i.category===activeCategory)&&(!q||[i.title,i.creator,i.category,i.why,i.method,i.uses,...(i.tags||[])].join(" ").toLowerCase().includes(q)));}
function renderArchive(ch){
 const items=filterItems(itemsFor(ch)),list=reportsFor(ch),title=ch==="all"?"全部内容档案":channelLabel(ch)+"档案";
 main.innerHTML='<section class="page-intro"><span class="eyebrow">ARCHIVE / '+String(list.length).padStart(3,"0")+' ISSUES</span><h1>'+esc(title)+'</h1><p>按日期回看内容，也可以搜索作品、作者、设计方法与应用方向。所有条目保留原始来源，方便继续研究。</p></section><div class="toolbar"><span class="result-count">'+items.length+' ITEMS FOUND · '+list.length+' ISSUES</span>'+categoryChips(ch)+'</div>'+(items.length?'<div class="card-grid">'+items.map(card).join("")+'</div>':'<div class="empty-state"><strong>这个频道暂时没有匹配条目</strong>可以清除筛选，或查看其他内容频道。</div>')+'<div style="height:44px"></div>'+sectionHead("ISSUE HISTORY","按日期浏览")+'<div class="report-list">'+list.map(reportRow).join("")+'</div>';
}
function renderTopics(ch){
 const items=itemsFor(ch),counts={};items.forEach(i=>counts[i.category]=(counts[i.category]||0)+1);
 const topics=Object.entries(counts).sort((a,b)=>b[1]-a[1]);
 main.innerHTML='<section class="page-intro"><span class="eyebrow">TAXONOMY / METHODS</span><h1>主题索引</h1><p>从创作问题出发，而不只是按作品类型浏览。选择一个方向，查看相关案例和可迁移的方法。</p></section><div class="topic-grid">'+topics.map(([c,n])=>'<button class="topic-card" data-topic="'+esc(c)+'"><span class="eyebrow">'+esc(glyphs[c]||"✳")+' / TOPIC</span><strong>'+esc(c)+'</strong><small>'+n+' IDEAS · EXPLORE ↗</small></button>').join("")+'</div>';
}
function detailItem(i,n){
 const extras=[["技术栈",i.stack],["成熟度",i.maturity],["上手难度",i.difficulty],["许可证",i.license],["风险与限制",i.risks],["推荐等级",i.recommendation]].filter(x=>x[1]);
 return '<article class="detail-card" id="item-'+esc(i.id)+'"><div class="detail-head"><div><span class="category-label">'+esc(i.category)+' · '+esc(i.age||"参考案例")+'</span><h2>'+esc(i.title)+'</h2><p>'+esc(i.creator)+'</p></div><span class="detail-number">'+String(n+1).padStart(2,"0")+' / '+String(allItems().length).padStart(2,"0")+'</span></div><div class="detail-grid"><section class="detail-cell"><span class="eyebrow">01 / WHY IT MATTERS</span><p>'+esc(i.why)+'</p></section><section class="detail-cell"><span class="eyebrow">02 / TAKEAWAY</span><p>'+esc(i.method)+'</p></section><section class="detail-cell"><span class="eyebrow">03 / WHERE TO USE</span><p>'+esc(i.uses)+'</p></section></div>'+(extras.length?'<div class="extra-grid">'+extras.map(x=>'<div><small>'+esc(x[0])+'</small><p>'+esc(x[1])+'</p></div>').join("")+'</div>':"")+'<div class="detail-footer"><div class="tag-list">'+(i.tags||[]).map(t=>'<span class="tag">'+esc(t)+'</span>').join("")+'</div><div style="display:flex;gap:15px;align-items:center"><button class="bookmark '+(saved.has(i.id)?"saved":"")+'" data-action="bookmark" data-id="'+esc(i.id)+'">'+(saved.has(i.id)?"★ 已收藏":"☆ 收藏")+'</button><a class="source-link" href="'+esc(i.url)+'" target="_blank" rel="noopener noreferrer">打开原始来源 ↗</a></div></div></article>';
}
function getReport(date,ch){return db.reports.find(r=>r.date===date&&channelOf(r)===ch)||db.reports.find(r=>r.date===date);}
function renderReport(date,ch){
 const r=getReport(date,ch);
 if(!r){main.innerHTML='<div class="empty-state"><strong>没有找到这期内容</strong><a class="back-link" href="?channel='+encodeURIComponent(ch)+'&view=archive">返回频道档案 →</a></div>';return;}
 const channel=channelOf(r);
 main.innerHTML='<section class="report-hero"><a class="back-link" href="?channel='+encodeURIComponent(channel)+'&view=archive">← 返回'+esc(channelLabel(channel))+'</a><div class="report-meta" style="margin-top:24px"><span>'+fmt(r.date)+'</span><span>'+esc(channelLabel(channel))+'</span><span>'+r.items.length+' PICKS</span><span>'+esc(r.theme||"")+'</span></div><h1>'+esc(r.title)+'</h1><p>'+esc(r.summary)+'</p><div class="hero-actions"><button class="button-quiet" data-action="copy-page">复制本期链接 ↗</button><a class="button-quiet" href="?channel=all&view=archive">浏览全部内容</a></div></section><div class="detail-items">'+r.items.map(detailItem).join("")+'</div>';
 if(location.hash){requestAnimationFrame(()=>{const el=document.querySelector(location.hash);if(el)el.scrollIntoView({behavior:"smooth",block:"start"});});}
}
function renderSaved(){
 const items=allItems().filter(i=>saved.has(i.id));
 main.innerHTML='<section class="page-intro"><span class="eyebrow">YOUR LIBRARY / BOOKMARKS</span><h1>我的收藏</h1><p>收藏值得反复研究的作品与方法。收藏仅保存在当前浏览器，不需要账号，也不会上传数据。</p></section>'+(items.length?'<div class="card-grid">'+items.map(card).join("")+'</div>':'<div class="empty-state"><strong>收藏夹还是空的</strong>在作品卡片或日报详情中点击 ☆，把值得留下的灵感收进来。</div>');
}
function renderSearch(){
 const items=filterItems(allItems());
 main.innerHTML='<section class="page-intro"><span class="eyebrow">SEARCH / DISCOVER</span><h1>搜索灵感</h1><p>搜索作品名称、作者、类别、设计原理、标签或适用项目。</p></section><div class="toolbar"><span class="result-count">'+items.length+' RESULTS</span>'+categoryChips("all")+'</div>'+(items.length?'<div class="card-grid">'+items.map(card).join("")+'</div>':'<div class="empty-state"><strong>没有找到匹配内容</strong>换个关键词试试。</div>');
}
function render(){
 const p=new URLSearchParams(location.search),date=p.get("date"),view=p.get("view")||"home",ch=p.get("channel")||"inspiration";
 updateHeader(view,ch);
 if(date){renderReport(date,ch);return;}
 if(query){renderSearch();return;}
 if(view==="archive")renderArchive(ch);
 else if(view==="topics")renderTopics(ch);
 else if(view==="saved")renderSaved();
 else renderChannel(ch);
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
 if(topic){activeCategory=topic.dataset.topic;const p=new URLSearchParams(location.search);p.set("view","archive");history.pushState(null,"","?"+p.toString());render();return;}
});
searchInput.addEventListener("input",e=>{query=e.target.value;render();});
searchInput.addEventListener("keydown",e=>{if(e.key==="Escape"){searchInput.value="";query="";render();searchInput.blur();}});
document.addEventListener("keydown",e=>{if(e.key==="/"&&document.activeElement!==searchInput&&!["INPUT","TEXTAREA"].includes(document.activeElement.tagName)){e.preventDefault();searchInput.focus();}});
$("#themeToggle").addEventListener("click",()=>{const next=document.documentElement.dataset.theme==="dark"?"light":"dark";document.documentElement.dataset.theme=next;localStorage.setItem("ih-theme",next);});
window.addEventListener("popstate",render);
(async()=>{
 const theme=localStorage.getItem("ih-theme");if(theme)document.documentElement.dataset.theme=theme;
 try{const res=await fetch(DATA_URL,{cache:"no-store"});if(!res.ok)throw new Error("内容加载失败");db=await res.json();db.reports.sort((a,b)=>b.date.localeCompare(a.date));$("#footerMeta").textContent="更新于 "+db.updatedAt+" · "+db.reports.length+" 期内容 · "+allItems().length+" 个条目";render();}
 catch(err){main.innerHTML='<div class="empty-state"><strong>内容暂时无法加载</strong>请检查网络连接后刷新页面。<br><small>'+esc(err.message)+'</small></div>';}
 if("serviceWorker" in navigator){navigator.serviceWorker.register("./sw.js",{scope:"./"}).catch(()=>{});}
})();