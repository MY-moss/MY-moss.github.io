const {chromium}=require('playwright');const assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true,args:['--no-sandbox']});
for(const viewport of [{width:1440,height:900},{width:390,height:844},{width:360,height:740}]){
 const c=await browser.newContext({viewport,serviceWorkers:'allow',colorScheme:'dark'});await c.addInitScript(()=>localStorage.setItem('shangan_tut_done','1'));
 const page=await c.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(process.env.GAME_URL||'http://127.0.0.1:4299/',{waitUntil:'load'});await page.getByRole('button',{name:/快速开始/}).first().click();
 await page.evaluate(()=>{const e=eval('engine'),p=e.getPlayer(),d=eval('GameData');p.name='人生回顾测试';p.age=63;p.yearsWorked=39;p.gender='男';p.isEmployed=true;p.unit=d.units[0];p.leadershipRank=3;p.flags.retireAsked=true;p.retireAgeExt=63;p.flags.mortgageCleared=true;p.flags.familyClinicResolved=true;p.flags.familyClinicResolved_since=62;e.getHidden().risk=0;e.getHidden().mentalPressure=20;e.setPhase('career');e.checkEndings();window.App.afterCareerStep();});
 const section=page.getByRole('region',{name:'多维人生评价'});await section.waitFor();assert.equal(await section.getByRole('progressbar').count(),6);assert.match(await section.innerText(),/尚未兑现的旧事/);assert.match(await section.innerText(),/住房贷款已经结清/);
 const sizes=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,width:document.documentElement.clientWidth}));assert.ok(sizes.scroll<=sizes.width);assert.deepEqual(errors,[]);console.log(JSON.stringify({viewport,dimensions:6,unfinished:true,errors}));await c.close();
}await browser.close();})().catch(e=>{console.error(e);process.exit(1)});
