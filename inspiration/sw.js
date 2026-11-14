const CACHE="inspiration-hub-v1";
const CORE=["./","./index.html","./styles.css?v=1","./app.js?v=1","./data/index.json","./manifest.webmanifest","./favicon.svg"];
const scopePath=new URL(self.registration.scope).pathname;
self.addEventListener("install",event=>{
 event.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()));
});
self.addEventListener("activate",event=>{
 event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith("inspiration-hub-")&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener("fetch",event=>{
 const req=event.request,url=new URL(req.url);
 if(req.method!=="GET"||url.origin!==location.origin||!url.pathname.startsWith(scopePath))return;
 if(url.pathname.endsWith("/data/index.json")){
  event.respondWith(fetch(req,{cache:"no-store"}).then(res=>{
   if(res.ok){const copy=res.clone();caches.open(CACHE).then(c=>c.put(req,copy));}
   return res;
  }).catch(()=>caches.match(req).then(hit=>hit||new Response("离线状态下暂时没有缓存这份内容",{status:503,headers:{"Content-Type":"text/plain;charset=utf-8"}}))));
  return;
 }
 event.respondWith(caches.match(req).then(hit=>hit||fetch(req).then(res=>{
  if(res.ok){const copy=res.clone();caches.open(CACHE).then(c=>c.put(req,copy));}
  return res;
 }).catch(()=>req.mode==="navigate"?caches.match("./index.html"):new Response("",{status:503}))));
});
