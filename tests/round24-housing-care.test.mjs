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

test('housing purchase requires funds, renting remains available',()=>{
 const {e,p,d}=setup();const ev=d.events.find(x=>x.id==='ent257');
 p.finance.cash=0;e.syncWealth();assert.equal(e.isChoiceEnabled(ev.choices[0]),false);assert.equal(e.isChoiceEnabled(ev.choices[1]),false);assert.equal(e.isChoiceEnabled(ev.choices[2]),true);
 choose(e,d,'ent257',2);assert.equal(e.debtTotal(),0);
});
test('mortgage has scheduled first, fourth and eighth year callbacks without double charging',()=>{
 const {e,p,d}=setup({age:38});e.cashIn(100);choose(e,d,'ent257',0);
 assert.equal(advance(e,p)?.id,'ent258');const cash=p.finance.cash;choose(e,d,'ent258',0);assert.equal(p.finance.cash,cash);
 assert.equal(advance(e,p,3)?.id,'ent259');choose(e,d,'ent259',1);assert.equal(p.finance.cash,cash);
 assert.equal(e.getPendingCausalConsequences().find(x=>x.id==='arc_mortgage_3').dueAge,46);
 assert.equal(advance(e,p,4)?.id,'arc_mortgage_3');const before=e.computeLivingExpense(p);choose(e,d,'arc_mortgage_3',0);
 assert.equal(p.flags.mortgage,undefined);assert.equal(p.flags.mortgageCleared,true);assert.equal(p.finance.cash,cash-16);assert.ok(e.computeLivingExpense(p)<=before-6);assert.equal(hasDue(e,'arc_mortgage_3'),false);
});
test('older mortgage saves retain the final callback; insufficient funds have two alternatives',()=>{
 for(const choice of [1,2]){
  const {e,p,d}=setup({age:52});p.flags.mortgage=true;p.flags.mortgage_since=44;p.seenEvents.push('ent257','ent258','ent259');p.finance.cash=0;e.syncWealth();
  const ev=e._rcy_annualEventSelection().event;assert.equal(ev.id,'arc_mortgage_3');assert.equal(e.isChoiceEnabled(ev.choices[0]),false);assert.equal(e.isChoiceEnabled(ev.choices[choice]),true);
  choose(e,d,'arc_mortgage_3',choice);assert.equal(p.flags.mortgage,undefined);assert.equal(e.debtTotal(),choice===1?16:0);assert.equal(hasDue(e,'arc_mortgage_3'),false);
 }
});
test('early repayment cancels future mortgage callbacks without clearing unrelated debt',()=>{
 const {e,p,d}=setup();e.cashIn(120);e.addDebt('personal',7);choose(e,d,'ent257',0);choose(e,d,'ent258',0);choose(e,d,'ent259',0);
 assert.equal(e.debtTotal(),7);assert.equal(hasDue(e,'arc_mortgage_3'),false);assert.equal(p.flags.mortgageCleared,true);
});
test('self and professional care have distinct callbacks, shared care remembers earlier response',()=>{
 const direct=[];
 for(const c of [0,1]){const {e,p,d}=setup({age:52});e.cashIn(100);choose(e,d,'ent293',0);choose(e,d,'ent294',c);direct.push(e.getLifePathEvent(d.events.find(x=>x.id==='ent295')).text);}
 assert.notEqual(direct[0],direct[1]);
 const texts=[];
 for(const c of [0,1,2]){const {e,p,d}=setup({age:52});e.cashIn(100);choose(e,d,'ent293',0);choose(e,d,'ent294',2);choose(e,d,'enl215',c);const original=d.events.find(x=>x.id==='enl216');const copy=JSON.stringify(original);p.flags.mortgage=true;p.flags.familyClinicRepair=true;
 const out=e.getLifePathEvent(original);texts.push(out.text);assert.match(out.text,/应急金/);assert.match(out.text,/陪诊安排/);assert.equal(JSON.stringify(original),copy);assert.equal(out.choices[0].effects.eq,3);}
 assert.equal(new Set(texts).size,3);
});
