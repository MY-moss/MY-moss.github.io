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

const batchPaths=['arcs','work','life'].map(x=>'js/data/data-events-renew35-'+x+'.js');
function batch(){
 const ctx={};for(const file of batchPaths)runInNewContext(readFileSync(resolve(root,file),'utf8'),ctx,{filename:file});
 return runInNewContext('[...gd_events_renew35_arcs,...gd_events_renew35_work,...gd_events_renew35_life]',ctx);
}
test('36 removed IDs are absent, all 36 replacement scenes have distinct choices and custom feedback',()=>{
 const {e,p,d}=setup(),retired=JSON.parse(readFileSync(resolve(root,'docs/ROUND35_RETIRED_EVENTS.json'),'utf8')),scenes=batch();
 assert.equal(retired.length,36);assert.equal(scenes.length,36);
 assert.equal(d.events.length,1838);
 assert.equal(new Set(scenes.map(x=>x.id)).size,36);
 assert.equal(scenes.flatMap(x=>x.choices).length,108);
 for(const old of retired)assert.ok(!d.events.some(x=>x.id===old.id),old.id);
 for(const ev of scenes){
  assert.equal(d.events.filter(x=>x.id===ev.id).length,1);
  assert.ok(ev.choices.every(c=>c.result&&c.result.length>12),ev.id);
  assert.equal(new Set(ev.choices.map(c=>c.result)).size,3);
  assert.ok(ev.choices.every(c=>Object.entries(c.effects).filter(([k,v])=>typeof v==='number').every(([k,v])=>Math.abs(v)<=5)),ev.id);
 }
 p.seenEvents.push('e054');e.state.currentEvent={id:'enl094',stage:'life',eventType:'choice',title:'分期买手机',text:'旧存档待选事件',choices:[{text:'买手机',effects:{wealth:-3}},{text:'暂时不用',effects:{mentalPressure:-1}}]};
 assert.ok(e.saveState(1));assert.ok(e.loadState(1));assert.equal(e.state.currentEvent.id,'enl094');e.handleEventChoice(1);
 assert.ok(e.getPlayer().seenEvents.includes('enl094'));assert.ok(!e.getEventPoolSnapshot().some(x=>x.id==='enl094'));
});
test('all 108 complete paths of four five-year stories preserve causal dates and actual decisions',()=>{
 for(const route of ['lesson','room','keepsake','book']){
  const secondTexts=new Set(),thirdTexts=new Set();
  for(let first=0;first<3;first++)for(let middle=0;middle<3;middle++)for(let last=0;last<3;last++){
   const {e,p,d}=setup({age:35,rank:4}),id='renew_'+route;
   assert.ok(eligible(e,id+'_1'),id);assert.ok(!eligible(e,id+'_2'));assert.ok(!eligible(e,id+'_3'));
   choose(e,d,id+'_1',first);
   assert.equal(e.getPendingCausalConsequences().find(x=>x.id===id+'_2').dueAge,37);
   assert.notEqual(advance(e,p)?.id,id+'_2');
   const second=advance(e,p);assert.equal(second.id,id+'_2');secondTexts.add(second.text);
   e.state.currentEvent=second;e.handleEventChoice(middle);
   assert.equal(e.getPendingCausalConsequences().find(x=>x.id===id+'_3').dueAge,40);
   for(let n=0;n<2;n++)assert.notEqual(advance(e,p)?.id,id+'_3');
   const third=advance(e,p);assert.equal(third.id,id+'_3');thirdTexts.add(third.text);
   e.state.currentEvent=third;e.handleEventChoice(last);
   assert.ok(p.seenEvents.includes(id+'_3'));assert.ok(!hasDue(e,id+'_3'));
   assert.equal(!!p.flags['renew'+route[0].toUpperCase()+route.slice(1)+'Legacy'],last===0);
  }
  assert.equal(secondTexts.size,3);assert.equal(thirdTexts.size,3);
 }
});
test('past story crossovers are conditional and templates remain immutable',()=>{
 const {e,p,d}=setup();
 for(const [id,flag,pattern] of [['renew_lesson_2','renewCreditRelease',/沈宁/],['renew_room_2','renewRepairLegacy',/维护责任/],['renew_room_3','renewWindowLegacy',/人工服务入口/],['renew_keepsake_3','renewBookReviewed',/阿岑/],['renew_book_3','renewStageCreate',/旧剧场/],['renew_book_3','renewKeepsakeVoices',/家庭照片/]]){
  const base=d.events.find(x=>x.id===id),raw=JSON.stringify(base);
  assert.doesNotMatch(e.getLifePathEvent(base).text,pattern);
  p.flags[flag]=true;assert.match(e.getLifePathEvent(base).text,pattern);assert.equal(JSON.stringify(base),raw);
  delete p.flags[flag];
 }
});
test('new one-shot scenes are actual eligible pool events and low wealth gates prevent unaffordable options',()=>{
 const {e,p}=setup({age:35,rank:4});e.cashIn(50);
 for(const ev of batch().filter(x=>!/^renew_(lesson|room|keepsake|book)_[23]$/.test(x.id))){
  assert.ok(eligible(e,ev.id),ev.id);
  assert.ok(ev.choices.every(c=>e.isChoiceEnabled(c)),ev.id);
 }
 e.cashOut(e.getPlayer().finance.cash);
 for(const id of ['renew_repair_receipt','renew_small_savings','renew_last_train_ticket'])assert.ok(!eligible(e,id),id);
});
