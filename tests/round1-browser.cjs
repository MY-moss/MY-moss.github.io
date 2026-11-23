const {chromium}=require('playwright');
(async()=>{
const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true,args:['--no-sandbox']});
const results=[];
for(const size of [{width:1440,height:900},{width:390,height:844},{width:360,height:740}]){
 const ctx=await browser.newContext({viewport:size,serviceWorkers:'allow'});
 await ctx.addInitScript(()=>localStorage.setItem('shangan_tut_done','1'));
 const page=await ctx.newPage();const errors=[];const failed=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)failed.push(r.status()+' '+r.url())});
 await page.goto((process.env.GAME_URL || 'http://127.0.0.1:4176/'),{waitUntil:'load'});await page.locator('.game-container').waitFor();
 const intro=await page.locator('h1').first().innerText();
 await page.getByRole('button',{name:/快速开始/}).first().click();
 const after=await page.locator('h1').first().innerText();
 // Inject a completed career checkpoint, showing a choice in the regular App UI.
 const injected=await page.evaluate(()=>{
   const e=eval('engine');const p=e.getPlayer();const d=eval('GameData');
   p.isEmployed=true;p.name='浏览器测试';p.unit=d.units[0];p.leadershipRank=1;p.age=28;p.yearsWorked=5;
   e.setPhase('event');e.state.currentEvent=d.events.find(x=>x.id==='arc_receipt_1');
   window.App.currentSlot=2;
   window.App.saveCheckpoint('browser-test');window.App.afterCareerStep();
   return {choices:document.querySelectorAll('[data-event-choice]').length,save:!!localStorage.getItem('shangan_save_2')};
 });
 const beforeReload=await page.getByText('档案柜里的回执').count();
 await page.reload();await page.locator('.game-container').waitFor();
 await page.getByRole('button',{name:/读取第3个存档/}).first().click();
 const restored=await page.getByText('档案柜里的回执').count();
 const first=page.locator('button[data-event-choice="0"]');
 await first.click();
 const afterChoice=await page.evaluate(()=>({flag:eval('engine').getPlayer().flags.receiptOpen,seen:eval('engine').getPlayer().seenEvents.includes('arc_receipt_1'),event:eval('engine').getState().currentEvent}));
 const overflow=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,client:document.documentElement.clientWidth}));
 const cached=await page.evaluate(async()=>({controller:!!navigator.serviceWorker.controller,caches:await caches.keys()}));
 results.push({size,intro,after,injected,beforeReload,restored,afterChoice,overflow,cached,errors,failed});
 if(size.width===390){await ctx.setOffline(true);await page.reload();results.at(-1).offline=await page.locator('.game-container').count();}
 await ctx.close();
}
console.log(JSON.stringify(results,null,2));await browser.close();
})().catch(err=>{console.error(err);process.exit(1)})
