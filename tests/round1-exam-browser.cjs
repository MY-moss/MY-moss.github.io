const {chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
 const page=await browser.newPage({viewport:{width:390,height:844}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>localStorage.setItem('shangan_tut_done','1'));
 await page.goto('http://127.0.0.1:4174/');
 await page.getByRole('button',{name:/快速开始/}).first().click();
 let stage='';const steps=[];const max=80;
 for(let i=0;i<max;i++){
  const snap=await page.evaluate(()=>({phase:eval('engine').getPhase(),q:eval('engine').getState().currentQuestion,len:eval('engine').getState().examQuestions.length,p:eval('engine').getPlayer().passed,buttons:[...document.querySelectorAll('button')].filter(b=>b.offsetWidth).map(b=>b.textContent.trim().slice(0,35)).filter(Boolean).slice(-12)}));
  if(i===0||i%10===0||snap.phase!==stage)steps.push({i,...snap});
  stage=snap.phase;
  const candidates=page.locator('button[data-answer],button[data-exam-answer],button[data-option],button[data-answer-index]');
  if(await candidates.count()){await candidates.first().click();continue}
  if(snap.phase==='written'){
    const answer=await page.evaluate(()=>eval('engine').getState().examQuestions[eval('engine').getState().currentQuestion].correctLabel);
    await page.locator('button[data-written-answer="'+answer+'"]').click();continue;
  }
  if(snap.phase==='interview'){
    const best=await page.evaluate(()=>{
      const e=eval('engine'),q=e.getState().examQuestions[e.getState().currentQuestion];
      return q.choices.reduce((best,c,i)=> c.score > q.choices[best].score ? i : best,0);
    });
    await page.locator('button[data-interview-answer="'+best+'"]').click();continue;
  }
  const clicked=await page.evaluate(()=>{
   const list=[...document.querySelectorAll('button')].filter(b=>b.offsetWidth&&!b.disabled);
   const b=list.find(b=>/下一题|继续答题|提交答卷|进入面试|查看成绩|下一步|开始面试|入职|继续人生/.test(b.textContent));
   if(b){b.click();return b.textContent.trim().slice(0,40)}return null;
  });
  if(!clicked)break;
 }
 const exam=await page.evaluate(()=>({passed:eval('engine').getPlayer().passed,phase:eval('engine').getPhase()}));
 if(exam.passed){await page.getByRole('button',{name:/开始职业生涯/}).click();await page.waitForTimeout(100);}
 const final=await page.evaluate(()=>({phase:eval('engine').getPhase(),passed:eval('engine').getPlayer().passed,writtenScore:eval('engine').getPlayer().writtenScore,examQuestions:eval('engine').getState().examQuestions.length,save:!!localStorage.getItem('shangan_save')}));
 console.log(JSON.stringify({steps,exam,final,errors},null,2));await browser.close();
})().catch(e=>{console.error(e);process.exit(1)})
