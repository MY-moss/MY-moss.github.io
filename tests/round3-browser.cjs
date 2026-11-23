const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{
 const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true,args:['--no-sandbox']});
 const report=[];
 for(const viewport of [{width:1440,height:900},{width:390,height:844},{width:360,height:740}]) {
  const cx=await b.newContext({viewport,colorScheme:'light',serviceWorkers:'allow'});
  await cx.addInitScript(()=>localStorage.setItem('shangan_tut_done','1'));
  const page=await cx.newPage(),errors=[],requests=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)requests.push(r.status()+' '+r.url())});
  await page.goto(process.env.GAME_URL||'http://127.0.0.1:4176/',{waitUntil:'load'});
  await page.getByRole('button',{name:/快速开始/}).first().click();
  const choices=await page.evaluate(()=>{
   const e=eval('engine'),d=eval('GameData'),p=e.getPlayer();
   p.name='手机端测试';p.unit=d.units[0];p.isEmployed=true;p.age=29;p.yearsWorked=7;p.leadershipRank=1;
   e.setPhase('event');e.state.currentEvent=d.events.find(x=>x.id==='e094');
   window.App.currentSlot=2;window.App.saveCheckpoint('round3-branch');window.App.afterCareerStep();
   return [...document.querySelectorAll('button[data-event-choice]')].map(x=>({label:x.textContent.trim().slice(0,80),disabled:x.disabled}));
  });
  assert.equal(choices.length,3);
  await page.locator('button[data-event-choice="0"]').click();
  const after=await page.evaluate(()=>({
    title:document.querySelector('.thread-title')?.textContent,
    flag:eval('engine').getPlayer().flags.classmateOpen,
    hasResult:eval('engine').getPlayer().careerLog.some(x=>x.event.includes('公开申请')||x.event.includes('没有给任何一个审批人')),
    scroll:document.documentElement.scrollWidth,client:document.documentElement.clientWidth
  }));
  assert.equal(after.title,'老同学的申请书');assert.equal(after.flag,true);assert.ok(after.hasResult);
  assert.ok(after.scroll<=after.client);
  await page.reload();await page.getByRole('button',{name:/读取第3个存档/}).click();
  const restored=await page.evaluate(()=>eval('engine').getPlayer().flags.classmateOpen);
  assert.equal(restored,true);
  const worker=await page.evaluate(async()=>({controller:!!navigator.serviceWorker.controller,keys:await caches.keys()}));
  assert.ok(worker.controller&&worker.keys.includes('shangan-pages-10'));
  let offline='not checked';
  if(viewport.width===390){await cx.setOffline(true);await page.reload();await page.locator('.game-container').waitFor();offline='page loaded';}
  assert.deepEqual(errors,[]);assert.deepEqual(requests,[]);
  report.push({viewport,choices,after,restored,worker,offline,errors,requests});await cx.close();
 }
 await b.close();console.log(JSON.stringify(report,null,2));
})().catch(e=>{console.error(e);process.exit(1)});
