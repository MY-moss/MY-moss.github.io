import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import {resolve} from 'node:path';

const root=resolve(import.meta.dirname,'..');
const scripts=[...readFileSync(resolve(root,'index.html'),'utf8').matchAll(/<script defer src="([^"]+)/g)]
  .map(x=>x[1].split('?')[0])
  .filter(f=>f.startsWith('js/data/')||f==='js/data.js'||f.startsWith('js/engine/')||f==='js/engine.js');

function setup({age=40,rank=5,yearsWorked=14}={}){
  const db=new Map();
  const ctx={console,Math,Date,Array,Map,Set,Object,String,Number,JSON,Uint8Array,Int32Array,
    localStorage:{getItem:k=>db.get(k)??null,setItem:(k,v)=>db.set(k,String(v)),removeItem:k=>db.delete(k)},
    location:{origin:'http://localhost'},btoa:s=>Buffer.from(s,'binary').toString('base64'),
    atob:s=>Buffer.from(s,'base64').toString('binary'),escape,unescape,encodeURIComponent,decodeURIComponent};
  for(const file of scripts)runInNewContext(readFileSync(resolve(root,file),'utf8'),ctx,{filename:file});
  runInNewContext('globalThis.E=GameEngine;globalThis.D=GameData',ctx);
  const e=new ctx.E(),p=e.getPlayer();
  p.name='命运与流程审计';
  p.age=age;p.yearsWorked=yearsWorked;
  p.unit=ctx.D.units.find(u=>u.level==='市级');p.unitLevel=2;
  p.isEmployed=true;p.leadershipRank=rank;p.reputation=50;p.peopleReputation=50;
  // Milestones are independently tested; exclude them here to isolate due-year story ordering.
  p.seenEvents=['e087','e088','e089','e090','e091','e092'];
  e.initFinance();e.setPhase('career');e.rand=()=>0;e.randf=()=>0.999;
  return{e,p,d:ctx.D};
}
function choose(e,d,id,choice){
  e.state.currentEvent=d.events.find(ev=>ev.id===id);
  assert.ok(e.state.currentEvent,'missing event '+id);
  assert.ok(e.isChoiceEnabled(e.state.currentEvent.choices[choice]),id+' choice '+choice);
  e.handleEventChoice(choice);
}
function advance(e,p,years=1){
  let result;
  for(let i=0;i<years;i++){
    p.age++;p.yearsWorked++;e.state.currentEvent=null;
    result=e._rcy_annualEventSelection().event;
  }
  return result;
}
const hasDue=(e,id)=>e.getPendingCausalConsequences().some(item=>item.id===id);
function eligible(e,id){
  const row=e.getEventVisibilityDiagnostics([id]).events[0];
  return row.status==='eligible'||row.status==='low_weight';
}

test('third renewal removes ten redundant events, retains old serialized choice and adds ten new scenes',()=>{
 const {e,p,d}=setup();
 const retired=JSON.parse(readFileSync(resolve(root,'docs/ROUND34_RETIRED_EVENTS.json'),'utf8'));
 assert.equal(retired.length,10);
 for(const old of retired)assert.ok(!d.events.some(x=>x.id===old.id),old.id);
 const scenes=d.events.filter(x=>/^renew_(stage_|route_|box$|wrong_number$)/.test(x.id));
 assert.equal(scenes.length,10);assert.equal(scenes.flatMap(x=>x.choices).length,30);
 assert.ok(scenes.every(x=>x.choices.every(c=>c.result&&c.result.length>12)));
 p.seenEvents.push('e052');e.state.currentEvent={id:'e277',stage:'life',eventType:'choice',title:'看电影',text:'旧存档待选事件',choices:[{text:'去加班',effects:{mentalPressure:2}},{text:'看电影',effects:{mentalPressure:-2}}]};
 assert.ok(e.saveState(1));assert.ok(e.loadState(1));assert.equal(e.state.currentEvent.id,'e277');e.handleEventChoice(1);
 assert.ok(e.getPlayer().seenEvents.includes('e277'));
});
test('all 162 complete four-act paths preserve the scheduled dates and finish with actual choices',()=>{
 for(const [route,delays] of [['stage',[1,2,3]],['route',[2,2,3]]]){
  const secondTexts=new Set(),thirdTexts=new Set(),fourthTexts=new Set();
  for(let a=0;a<3;a++)for(let b=0;b<3;b++)for(let c=0;c<3;c++)for(let last=0;last<3;last++){
   const {e,p,d}=setup({age:32,rank:4}),id='renew_'+route;
   assert.ok(eligible(e,id+'_1'));for(let n=2;n<=4;n++)assert.ok(!eligible(e,id+'_'+n));
   choose(e,d,id+'_1',a);
   for(let n=2;n<=4;n++){
    const target=id+'_'+n,delay=delays[n-2];
    assert.equal(e.getPendingCausalConsequences().find(x=>x.id===target).dueAge,p.age+delay);
    for(let i=1;i<delay;i++)assert.notEqual(advance(e,p)?.id,target);
    const event=advance(e,p);assert.equal(event.id,target);
    [secondTexts,thirdTexts,fourthTexts][n-2].add(event.text);
    e.state.currentEvent=event;e.handleEventChoice([b,c,last][n-2]);
    assert.ok(p.seenEvents.includes(target));assert.ok(!hasDue(e,target));
   }
   assert.equal(p.age,32+delays.reduce((a,b)=>a+b,0));
   assert.equal(!!p.flags[route==='stage'?'renewStageLegacy':'renewRouteLegacy'],last===0);
  }
  assert.equal(secondTexts.size,3);assert.equal(thirdTexts.size,3);assert.ok(fourthTexts.size>=3);
 }
});
test('a missed performance cannot be retrospectively treated as a played performance',()=>{
 const {e,p,d}=setup({age:32});
 choose(e,d,'renew_stage_1',0);const second=advance(e,p);assert.equal(second.id,'renew_stage_2');
 e.state.currentEvent=second;e.handleEventChoice(1);
 const third=advance(e,p,2);assert.match(third.text,/从未登台/);
 e.state.currentEvent=third;e.handleEventChoice(0);
 const fourth=advance(e,p,3);assert.match(fourth.text,/名单里没有你的名字/);assert.match(fourth.choices[0].result,/并没有参加/);
 const raw=JSON.stringify(d.events.find(x=>x.id==='renew_stage_4'));e.state.currentEvent=fourth;e.handleEventChoice(0);
 assert.ok(p.careerLog.some(x=>x.event.includes('并没有参加')));
 assert.equal(JSON.stringify(d.events.find(x=>x.id==='renew_stage_4')),raw);
});
