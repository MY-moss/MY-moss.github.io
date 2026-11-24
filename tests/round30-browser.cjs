const {chromium}=require('playwright'),assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true,args:['--no-sandbox']});
 for(const viewport of [{width:1440,height:900},{width:390,height:844},{width:360,height:740}]){
  const c=await browser.newContext({viewport});await c.addInitScript(()=>localStorage.setItem('shangan_tut_done','1'));
  const page=await c.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(process.env.GAME_URL||'http://127.0.0.1:4304/',{waitUntil:'load'});
  await page.getByRole('button',{name:/快速开始/}).first().click();
  await page.evaluate(()=>{const e=eval('engine'),p=e.getPlayer(),d=eval('GameData');p.age=23;p.yearsWorked=1;p.ageOnshore=22;p.passed=true;p.isEmployed=true;p.unit=d.units[0];p.leadershipRank=1;e.initFinance();e.setPhase('career');e._rcy_annualEventSelection();window.App.afterCareerStep();});
  assert.equal(await page.evaluate(()=>eval('engine').state.currentEvent.id),'e253');
  await page.getByText('默默入职低调做人',{exact:false}).first().click();
  await page.waitForFunction(()=>eval('engine').getPlayer().seenEvents.includes('e253'));
  assert.equal(await page.evaluate(()=>eval('engine').state.currentEvent),null);
  await page.evaluate(()=>{const e=eval('engine'),p=e.getPlayer();p.age=60;p.gender='男';p.flags.retireAsked=true;p.flags.teamThirdResolved=true;p.flags.teamThirdResolved_since=50;p.flags.receiptThirdResolved=true;p.flags.receiptThirdResolved_since=52;e.getHidden().risk=0;e.getHidden().mentalPressure=10;e.checkEndings();window.App.afterCareerStep();});
  assert.equal(await page.evaluate(()=>eval('engine').state.currentEvent.id),'arc_team_legacy_4');
  await page.locator('[data-event-choice="1"]').click();
  await page.waitForFunction(()=>eval('engine').state.currentEvent?.id==='arc_receipt_legacy_4');
  await page.locator('[data-event-choice="1"]').click();
  await page.waitForFunction(()=>eval('engine').getPlayer().ending);
  assert.equal(await page.evaluate(()=>eval('engine').getPlayer().age),60);
  assert.deepEqual(errors,[]);console.log(JSON.stringify({viewport,onboarding:true,consecutiveRetirementChoices:true,errors}));await c.close();
 }
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
