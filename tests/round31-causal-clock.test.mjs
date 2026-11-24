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

test('repeated markers do not postpone committed consequences; explicit reset starts a new date',()=>{
 const {e,p}=setup({age:30});e.applyEffects({flag:'dating'});
 p.age=32;e.applyEffects({setFlags:['dating','receiptOpen']});
 assert.equal(p.flags.dating_since,30);assert.equal(p.flags.receiptOpen_since,32);
 assert.equal(e.getPendingCausalConsequences().find(x=>x.id==='ent263').dueAge,33);
 p.age=33;e.applyEffects({deleteFlag:'dating',flag:'dating'});
 assert.equal(e.getPendingCausalConsequences().find(x=>x.id==='ent263').dueAge,36);
 p.isMarried=true;assert.ok(!hasDue(e,'ent263'));
});
test('missing runtime timestamps are repaired on advance and the date does not drift',()=>{
 const {e,p}=setup({age:34});p.flags.wangDispute=true;
 e._rcy_snapshotAndAdvance(null);
 assert.equal(p.flags.wangDispute_since,34);
 assert.equal(e.getPendingCausalConsequences().find(x=>x.id==='ent285').dueAge,36);
 e._rcy_snapshotAndAdvance(null);assert.equal(e.getPendingCausalConsequences().find(x=>x.id==='ent285').dueAge,36);
});
test('all graduation choices grant the qualification only after three years of study, never downgrade a doctorate',()=>{
 for(const education of ['bachelor','doctor'])for(const finalChoice of [0,1,2]){
  const {e,p,d}=setup({age:32});p.education=education;choose(e,d,'ent232',0);
  assert.equal(advance(e,p)?.id,'ent233');choose(e,d,'ent233',1);
  assert.equal(advance(e,p)?.id,'ent234');choose(e,d,'ent234',0);
  assert.equal(p.education,education);
  assert.equal(e.getPendingCausalConsequences().find(x=>x.id==='ent235').dueAge,37);
  assert.notEqual(advance(e,p)?.id,'ent235');assert.notEqual(advance(e,p)?.id,'ent235');
  assert.equal(advance(e,p)?.id,'ent235');choose(e,d,'ent235',finalChoice);
  assert.equal(p.education,education==='doctor'?'doctor':'master');assert.equal(p.flags.mbaActive,undefined);
 }
});
test('failed entrance examination does not create graduation or stale study obligations',()=>{
 const {e,p,d}=setup();choose(e,d,'ent232',0);choose(e,d,'ent233',0);choose(e,d,'ent234',2);
 assert.equal(p.education,'bachelor');assert.equal(p.flags.mbaActive,undefined);assert.equal(p.flags.mbaApply,undefined);assert.ok(!hasDue(e,'ent235'));
});
test('both relapse recovery choices clear the active gambling counter and a new episode restarts intervention',()=>{
 for(const selected of [0,2]){
  const {e,p,d}=setup({age:40});e.markEventFlag('gamblingAddict');p.flags.gambleStreak=3;
  p.age++;choose(e,d,'e747',1);p.age++;choose(e,d,'e765',selected);
  assert.equal(p.flags.gambleStreak,0);assert.equal(p.flags.gamblingAddict,undefined);assert.equal(p.flags.gamblingRelapse,undefined);
  p.age++;e.markEventFlag('gamblingAddict');assert.equal(p.flags.gamblingAddict_since,p.age);
  assert.ok(!p.seenEvents.includes('e747'));assert.ok(!p.seenEvents.includes('e765'));assert.ok(hasDue(e,'e747'));
 }
});
