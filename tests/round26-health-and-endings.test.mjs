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

test('ignored medical report schedules a single delayed second chance with actual treatment exit',()=>{
 for(const initial of [0,2]){
  const {e,p,d}=setup({age:42});e.cashIn(60);choose(e,d,'ent244',initial);
  if(initial===0){assert.equal(advance(e,p)?.id,'ent245');choose(e,d,'ent245',2);}
  assert.equal(e.getPendingCausalConsequences().find(x=>x.id==='arc_health_retry').dueAge,p.age+2);
  assert.notEqual(advance(e,p)?.id,'arc_health_retry');assert.equal(advance(e,p)?.id,'arc_health_retry');
  choose(e,d,'arc_health_retry',0);assert.equal(advance(e,p)?.id,'ent246');choose(e,d,'ent246',0);
  assert.equal(advance(e,p)?.id,'ent247');choose(e,d,'ent247',0);
  assert.equal(p.flags.healthStable,true);assert.equal(p.flags.healthHardhead,undefined);assert.equal(p.flags.healthRisk,undefined);
  assert.ok(!e.getPendingCausalConsequences().some(x=>x.label==='健康与康复'));
 }
});
test('old stuck health save receives retry; declining again closes chain with persistent illness',()=>{
 const {e,p,d}=setup({age:50});p.flags.healthHardhead=true;p.flags.healthHardhead_since=45;p.flags.healthRisk=true;p.flags.healthRisk_since=48;p.seenEvents.push('ent244','ent245');
 assert.ok(hasDue(e,'arc_health_retry'));assert.equal(e._rcy_annualEventSelection().event?.id,'arc_health_retry');
 choose(e,d,'arc_health_retry',2);assert.equal(p.flags.chronicIllness,true);assert.equal(p.flags.healthRisk,undefined);assert.ok(!hasDue(e,'arc_health_retry'));
 assert.ok(p.seenEvents.includes('ent245'));assert.equal(eligible(e,'arc_health_retry'),false);
});
test('legacy hardhead without timestamp migrates once; no aging deadline on second chance',()=>{
 const {e,p}=setup({age:61});p.flags.healthHardhead=true;assert.ok(e.migrateState(e.state));assert.equal(p.flags.healthHardhead_since,61);assert.equal(e.getPendingCausalConsequences().find(x=>x.id==='arc_health_retry').dueAge,63);
});
test('expelled or already active applicants do not receive party opportunity fallback',()=>{
 for(const f of ['expelledFromParty','appliedParty']){
  const {e,p}=setup({age:35,yearsWorked:10});p.political='mass';p.flags[f]=true;
  assert.equal(e._rcy_specialEventInjection(),false);assert.notEqual(e.state.currentEvent?.id,'e260');
 }
});
test('party recommendation does not grant membership before scheduled review',()=>{
 const {e,p,d}=setup({age:35,yearsWorked:10});p.political='mass';choose(e,d,'e260',4);assert.equal(p.political,'mass');assert.ok(p.flags.appliedParty);assert.ok(hasDue(e,'e043'));assert.equal(advance(e,p)?.id,'e043');choose(e,d,'e043',0);assert.equal(p.political,'cpc');assert.equal(hasDue(e,'e043'),false);
});
test('already-member and expelled old saves do not queue a false party review',()=>{
 for(const state of ['cpc','expelled']){
  const {e,p}=setup();p.political=state==='cpc'?'cpc':'mass';p.flags.appliedParty=true;p.flags.appliedParty_since=p.age-3;if(state==='expelled')p.flags.expelledFromParty=true;
  assert.equal(hasDue(e,'e043'),false);
 }
});
test('specific story achievements survive high office and clean label excludes corruption',()=>{
 for(const [flag,expected] of [['bookPublished','author_legacy'],['cleanHero','whistleblower_hero']]){
  const {e,p}=setup({age:60,rank:8,yearsWorked:36});p.unitLevel=3;p.promotions=7;p.reputation=85;e.getHidden().workAbility=90;e.getHidden().integrity=90;e.getHidden().risk=5;e.getHidden().desire=20;e.randf=()=>0;p.flags[flag]=true;
  assert.equal(e.determineEnding(),expected);
 }
 const {e,p}=setup({age:60,rank:6,yearsWorked:35});p.reputation=85;p.flags.refusedBribe=true;p.flags.tookBribe=true;e.getHidden().integrity=90;e.getHidden().risk=5;assert.notEqual(e.determineEnding(),'clean');
});
