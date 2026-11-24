const {chromium}=require('playwright');const assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true,args:['--no-sandbox']});const result=[];
for(const viewport of [{width:1440,height:900},{width:390,height:844},{width:360,height:740}]){
 const c=await browser.newContext({viewport,serviceWorkers:'allow'});await c.addInitScript(()=>localStorage.setItem('shangan_tut_done','1'));
 const page=await c.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(process.env.GAME_URL||'http://127.0.0.1:4313/',{waitUntil:'load'});
 await page.getByRole('button',{name:/快速开始/}).first().click();
 await page.evaluate(()=>{const e=eval('engine'),d=eval('GameData'),p=e.getPlayer();p.age=38;p.yearsWorked=14;p.unit=d.units.find(u=>u.level==='市级'&&u.tags.includes('tech'));p.unitLevel=2;p.leadershipRank=5;p.isEmployed=true;p.reputation=65;e.getHidden().workAbility=65;e.getHidden().mentalPressure=56;p.flags={};e.initFinance();e.cashIn(100);e.resetActionPoints();e.state.currentEvent=null;e.state.pendingPromotion=null;e.state.pendingTransfer=null;e.setPhase('career');App.currentSlot=1;App.saveCheckpoint('round38');App.afterCareerStep();});
 assert.equal(await page.getByRole('button',{name:/验证系统与故障复盘/}).isDisabled(),true);
 await page.getByRole('button',{name:/调整工作节奏/}).click();
 assert.equal(await page.evaluate(()=>eval('engine').getHidden().mentalPressure),51);
 await page.getByRole('button',{name:'选择项目'}).click();
 await page.getByRole('button',{name:'承接政策项目：数字政务升级'}).click();
 const before=await page.evaluate(()=>({cash:eval('engine').getPlayer().finance.cash,ap:eval('engine').getActionPoints(),age:eval('engine').getPlayer().age}));
 await page.getByRole('button',{name:/调整工期，暂停本年交付/}).click();
 const after=await page.evaluate(()=>{const e=eval('engine');return{cash:e.getPlayer().finance.cash,ap:e.getActionPoints(),age:e.getPlayer().age,pressure:e.getHidden().mentalPressure,budget:e.state.policyProject.budget,stage:e.state.policyProject.stage,pauses:e.state.policyProject.pauses}});
 assert.equal(after.cash,before.cash);assert.equal(after.age,before.age);assert.equal(after.ap,before.ap-1);assert.equal(after.pressure,41);assert.equal(after.budget,13);assert.equal(after.stage,0);assert.equal(after.pauses,1);
 assert.equal(await page.getByRole('button',{name:/验证系统与故障复盘/}).isDisabled(),true);
 assert.match(await page.locator('[aria-label="人生选择履历"]').innerText(),/专业投入/);
 await page.reload();await page.getByRole('button',{name:/读取第2个存档/}).click();
 assert.equal(await page.evaluate(()=>eval('engine').state.policyProject.pauses),1);
 const width=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,viewport:document.documentElement.clientWidth}));
 assert.ok(width.scroll<=width.viewport);
 // Fixture isolates the new ending screen; eligibility is covered by actual-choice engine tests.
 for(const [ending,title] of [['steady_professional','专业长跑'],['life_companion','生活有岸']]){
  await page.evaluate(ending=>{const e=eval('engine'),p=e.getPlayer();p.ending=ending;p.deathReason='retired';p.age=60;e.state.policyProject=null;e.state.currentEvent=null;App.afterCareerStep()},ending);
  assert.match(await page.locator('.stage').innerText(),new RegExp(title));
 }
 assert.deepEqual(errors,[]);
 result.push({viewport,after,saveReload:true,workloadGuard:true,newEndings:2,width,errors});await c.close();
}await browser.close();console.log(JSON.stringify(result,null,2))})().catch(e=>{console.error(e);process.exit(1)});
