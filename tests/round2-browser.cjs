const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true,args:['--no-sandbox']});
 const results=[];
 for(const size of [{width:1440,height:900},{width:390,height:844},{width:360,height:740}]){
  const context=await browser.newContext({viewport:size,serviceWorkers:'allow',colorScheme:'dark'});
  await context.addInitScript(()=>localStorage.setItem('shangan_tut_done','1'));
  const page=await context.newPage(),errors=[],assets=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)assets.push(`${r.status()} ${r.url()}`)});
  await page.goto(process.env.GAME_URL||'http://127.0.0.1:4176/',{waitUntil:'load'});
  await page.locator('.game-container').waitFor();
  await page.getByRole('button',{name:/快速开始/}).first().click();
  const initial=await page.evaluate(()=>{
   const e=eval('engine'),p=e.getPlayer(),d=eval('GameData');
   p.isEmployed=true;p.name='手机验收';p.isMarried=true;p.unit=d.units[0];p.leadershipRank=1;p.age=36;p.yearsWorked=8;
   e.setPhase('event');e.state.currentEvent=d.events.find(x=>x.id==='arc_team_1');
   window.App.currentSlot=1;window.App.saveCheckpoint('round2-browser');window.App.afterCareerStep();
   return {save:!!localStorage.getItem('shangan_save_1'),choices:document.querySelectorAll('[data-event-choice]').length};
  });
  assert.equal(initial.choices,2);assert.ok(initial.save);
  const option=page.locator('button[data-event-choice="0"]');await option.click();
  const feedback=await page.evaluate(()=>({
   flag:eval('engine').getPlayer().flags.teamShared,
   log:eval('engine').getPlayer().careerLog.at(-1)?.event,
   story:document.querySelector('.thread-title')?.textContent,
   width:document.documentElement.scrollWidth,
   client:document.documentElement.clientWidth,
   theme:document.documentElement.dataset.theme
  }));
  assert.equal(feedback.flag,true);assert.match(feedback.log,/周末八点/);assert.equal(feedback.story,'交接本上的空格');
  assert.ok(feedback.width<=feedback.client);assert.equal(feedback.theme,'dark');
  await page.reload();await page.locator('.game-container').waitFor();
  await page.getByRole('button',{name:/读取第2个存档/}).click();
  const restored=await page.evaluate(()=>eval('engine').getPlayer().flags.teamShared);
  assert.equal(restored,true);
  const cache=await page.evaluate(async()=>({keys:await caches.keys(),controller:!!navigator.serviceWorker.controller}));
  assert.ok(cache.keys.includes('shangan-pages-29'));assert.ok(cache.controller);
  let offline='not tried';
  if(size.width===390){await context.setOffline(true);await page.reload();await page.locator('.game-container').waitFor();offline='loaded';}
  assert.deepEqual(errors,[]);assert.deepEqual(assets,[]);
  results.push({size,initial,feedback,restored,cache,offline,errors,assets});
  await context.close();
 }
 await browser.close();console.log(JSON.stringify(results,null,2));
})().catch(e=>{console.error(e);process.exit(1)});
