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

test('three rank tiers unlock different actions, consume AP once, and settle after promotion',()=>{
 for(const [rank,tier,id] of [[2,'frontline','field'],[5,'manager','delegate'],[8,'leader','audit']]){
  const {e,p}=setup({rank});e.resetActionPoints();const ap=e.getActionPoints();
  assert.equal(e.getDutyPlan().tier,tier);assert.equal(e.chooseDutyPlan('not-an-action'),false);assert.equal(e.chooseDutyPlan(id),true);assert.equal(e.getActionPoints(),ap-1);assert.equal(e.chooseDutyPlan(id),false);assert.equal(e.settleDutyPlan(),false);
  p.age++;p.leadershipRank=Math.min(12,rank+3);assert.equal(e.settleDutyPlan(),true);assert.equal(e.settleDutyPlan(),false);assert.equal(p.dutyPending,undefined);
 }
});
test('rank duty survives save load and rest year, including zero AP and pending slot guards',()=>{
 const {e,p}=setup({rank:5});p.actionPoints=0;assert.equal(e.chooseDutyPlan('delegate'),false);e.resetActionPoints();e.state.pendingPromotion={};assert.equal(e.chooseDutyPlan('delegate'),false);e.state.pendingPromotion=null;
 assert.ok(e.chooseDutyPlan('delegate'));assert.ok(e.saveState(1));assert.ok(e.loadState(1));const q=e.getPlayer();assert.ok(q.dutyPending);assert.ok(e.restYear());assert.equal(q.dutyPending,undefined);assert.ok(q.careerLog.some(x=>x.event.includes('岗位职责回访')));
});
test('project history tracks choices, separates suppression across projects, and settles two callbacks exactly once',()=>{
 const {e,p}=setup({rank:8,yearsWorked:20});e.cashIn(200);
 for(const [id,bad] of [['digital_governance',true],['old_community',false]]){
  assert.ok(e.startPolicyProject(id));const def=e.getPolicyProjectDefinition(id);
  if(bad){p.heat=50;e.state.currentEvent=e.preparePolicyOpinionCrisisEvent();assert.ok(e.resolvePolicyOpinionChoice(2));}
  for(let i=0;i<def.duration;i++){e.state.currentEvent=e.getPolicyProjectDecisionEvent();const choices=e.state.currentEvent.choices;const best=choices.reduce((best,c,j)=>{const f=c.effects||{},score=(f.integrity||0)+(f.workAbility||0)+(f.peopleReputation||0)-(f.risk||0)-(f.heat||0);return score>best.score?{j,score}:best;},{j:0,score:-100});assert.ok(e.resolvePolicyProjectChoice(best.j));}
 }
 assert.equal(p.policyFollowups.length,2);assert.equal(e.hasQualifiedPolicyOutcome('digital_governance'),false);assert.equal(e.hasQualifiedPolicyOutcome('old_community'),true);
 assert.equal(p.flags.policyOpinionSuppressed,true);p.age+=2;e.settlePolicyFollowups();assert.ok(p.policyFollowups.every(x=>x.review2&&!x.review5));assert.ok(e.saveState(1));assert.ok(e.loadState(1));const q=e.getPlayer();q.age+=3;e.settlePolicyFollowups();assert.ok(q.policyFollowups.every(x=>x.review5));const log=q.careerLog.length;e.settlePolicyFollowups();assert.equal(q.careerLog.length,log);
});
test('retirement chapter has three playable years, preserves career result and can resume from a save',()=>{
 const {e,p}=setup({age:60});assert.equal(e.getRetirementChapter(),null);p.ending='ordinary';p.deathReason='retired';
 const before=JSON.stringify({age:p.age,ending:p.ending,wealth:p.wealth,hidden:e.getHidden(),attrs:e.getAttrs()});
 assert.equal(e.chooseRetirementChapter('quiet'),false);assert.ok(e.chooseRetirementChapter('routine'));assert.ok(e.saveState(1));assert.ok(e.loadState(1));const q=e.getPlayer();
 assert.equal(e.getRetirementChapter().age,62);assert.ok(e.chooseRetirementChapter('community'));assert.ok(e.chooseRetirementChapter('quiet'));assert.ok(e.getRetirementChapter().done);assert.equal(e.chooseRetirementChapter('quiet'),false);
 assert.equal(JSON.stringify({age:q.age,ending:q.ending,wealth:q.wealth,hidden:e.getHidden(),attrs:e.getAttrs()}),before);
 q.deathReason='death';assert.equal(e.getRetirementChapter(),null);
});
test('all scheduled chain targets are excluded from random candidate pool',()=>{
 const {e,p}=setup({age:45});for(const step of e.getCausalChainSteps()){p.flags[step.flag]=true;p.flags[step.flag+'_since']=p.age;}
 const pool=new Set(e.getEventPoolSnapshot().map(x=>x.id));assert.ok(e.getCausalChainSteps().every(x=>!pool.has(x.next)));
});
test('annual era wave moderately changes actual eligible weights without bypassing gates',()=>{
 const {e}=setup();const wave=e.getEraWave();assert.ok(wave);
 const a=new Map(e.getEventPoolSnapshot().map(x=>[x.id,x.weight]));
 e.getEraWave=()=>null;const b=e.getEventPoolSnapshot();
 assert.equal(a.size,b.length);let matched=0;
 for(const ev of b){const expected=e._eventMatchesWave(ev,wave)?1.15:1;if(expected>1)matched++;assert.ok(Math.abs(a.get(ev.id)/ev.weight-expected)<1e-8);}
 assert.ok(matched>0);
});
