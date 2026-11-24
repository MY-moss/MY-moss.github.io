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

function open(e){
 const ev=e.getPolicyProjectDecisionEvent();assert.ok(ev);e.state.currentEvent=ev;return ev;
}
test('policy rewards cannot be farmed by restarting, direct calls, or multiple decisions in one year',()=>{
 const {e,p}=setup({age:38,rank:5});const id='digital_governance';
 assert.ok(e.startPolicyProject(id));assert.equal(e.resolvePolicyProjectChoice(0),false);
 open(e);assert.ok(e.resolvePolicyProjectChoice(0));const before=JSON.stringify(e.state);
 assert.equal(e.getPolicyProjectDecisionEvent(),null);assert.equal(e.resolvePolicyProjectChoice(0),false);assert.equal(JSON.stringify(e.state),before);
 assert.ok(e.abandonPolicyProject());assert.equal(e.startPolicyProject(id),false);assert.equal(e.startPolicyProject('old_community'),false);
 p.age++;p.yearsWorked++;assert.equal(e.startPolicyProject(id),false);assert.ok(e.startPolicyProject('old_community'));
});
test('abandon cannot discard an unrelated event or pending promotion; saved project retains its exact step',()=>{
 const {e,p,d}=setup({rank:5});assert.ok(e.startPolicyProject('digital_governance'));
 e.state.currentEvent=d.events.find(x=>x.id==='renew_grant_1');const before=JSON.stringify(e.state);
 assert.equal(e.abandonPolicyProject(),false);assert.equal(JSON.stringify(e.state),before);
 e.state.currentEvent=null;open(e);
 e.state.pendingPromotion={type:'open',source:'测试'};
 assert.equal(e.abandonPolicyProject(),false);
 e.state.pendingPromotion=null;assert.ok(e.saveState(1));assert.ok(e.loadState(1));
 assert.equal(e.state.currentEvent.projectId,'digital_governance');assert.ok(e.resolvePolicyProjectChoice(0));
 assert.equal(e.state.policyProject.stage,1);assert.ok(e.saveState(1));assert.ok(e.loadState(1));assert.equal(e.getPolicyProjectDecisionEvent(),null);
});
test('all five public project budgets are isolated from personal finance, and maximum available spending remains feasible',()=>{
 const {e,p,d}=setup({age:25,rank:8,yearsWorked:10});p.retireAgeExt=90;p.flags.retireAsked=true;e.cashIn(100);
 for(const def of d.policyProjects){
  if(p.policyDecisionAge===p.age){p.age++;p.yearsWorked++;}
  assert.ok(e.startPolicyProject(def.id),def.id);
  let budget=14;
  for(let i=0;i<def.duration;i++){
   const ev=open(e),cash=p.finance.cash,wealth=p.wealth,debt=e.debtTotal();
   const choices=ev.choices.map((c,i)=>({c,i})).sort((a,b)=>(a.c.effects.projectBudget||0)-(b.c.effects.projectBudget||0));
   const pick=choices.find(x=>e.isChoiceEnabled(x.c));assert.ok(pick);
   assert.ok(ev.choices.every(c=>!Object.hasOwn(c.effects,'wealth')));
   budget+=pick.c.effects.projectBudget||0;assert.ok(e.resolvePolicyProjectChoice(pick.i));
   assert.equal(p.finance.cash,cash);assert.equal(p.wealth,wealth);assert.equal(e.debtTotal(),debt);
   if(i+1<def.duration){assert.equal(e.state.policyProject.budget,budget);p.age++;p.yearsWorked++;}
  }
  assert.equal(p.policyFollowups.at(-1).budget,budget);
 }
});
test('old in-progress decision migrates to canonical budget and one-year guard',()=>{
 const {e,p}=setup({age:38,rank:5});assert.ok(e.startPolicyProject('digital_governance'));
 const ev=open(e);delete ev.projectId;delete ev.projectStage;delete e.state.policyProject.budget;delete e.state.policyProject.lastDecisionAge;
 ev.choices[3].effects={wealth:-1,iq:1};const cash=p.finance.cash;
 assert.ok(e.saveState(1));assert.ok(e.loadState(1));
 assert.equal(e.state.policyProject.budget,14);assert.equal(e.state.currentEvent.projectId,'digital_governance');
 assert.ok(e.resolvePolicyProjectChoice(3));assert.equal(e.getPlayer().finance.cash,cash);assert.equal(e.state.policyProject.budget,13);
 assert.equal(e.getPolicyProjectDecisionEvent(),null);
});
test('professional duties reflect departments, use AP, require real verification, and decline in marginal reward',()=>{
 const {e,p,d}=setup({rank:5});const h=e.getHidden();
 for(const [system,id] of [['技术部门','special_tech'],['政法系统','special_law'],['民生部门','special_service']]){
  p.unit=d.units.find(x=>x.system===system);assert.ok(e.getDutyPlan().actions.some(a=>a.id===id),system);
 }
 p.unit=d.units.find(x=>x.tags?.includes('audit'));const id='special_finance';
 assert.ok(e.getDutyPlan().actions.some(a=>a.id===id));h.integrity=10;h.risk=60;e.resetActionPoints();
 assert.ok(e.chooseDutyPlan(id));assert.equal(e.getActionPoints(),e.getMaxActionPoints()-1);p.age++;assert.ok(e.settleDutyPlan());assert.equal(p.dutyVerified?.[id]||0,0);
 h.integrity=85;h.risk=20;e.resetActionPoints();assert.ok(e.chooseDutyPlan(id));p.age++;assert.ok(e.settleDutyPlan());assert.equal(p.dutyVerified[id],1);
 assert.ok(Math.abs(e.getDutyPlan().actions.find(a=>a.id===id).later.risk)<3);
});
test('high-rank endings require actual contributions and low-rank stable career is not automatically failure',()=>{
 const {e,p,d}=setup({age:60,rank:8,yearsWorked:36});const h=e.getHidden();
 p.reputation=90;p.promotions=7;h.workAbility=90;h.integrity=50;h.risk=5;h.mentalPressure=40;h.desire=0;
 assert.notEqual(e.determineEnding(),'skyline');p.dutyVerified={special_coordination:5};assert.equal(e.determineEnding(),'skyline');
 p.leadershipRank=2;p.dutyVerified={};p.unitLevel=1;p.reputation=70;h.mentalPressure=35;h.familyPressure=5;assert.notEqual(e.determineEnding(),'edge');
 p.flags.renewHomeLegacy=true;assert.equal(e.determineEnding(),'safe');
});
test('due renewed story at retirement remains playable before terminal evaluation',()=>{
 const {e,p}=setup({age:60,rank:5,yearsWorked:36});p.gender='男';p.flags.retireAsked=true;
 e.getHidden().risk=0;e.getHidden().mentalPressure=20;p.flags.renewBookReviewed=true;p.flags.renewBookReviewed_since=55;
 e.checkEndings();assert.equal(e.state.currentEvent.id,'renew_book_3');assert.ok(!p.ending);
 e.handleEventChoice(0);assert.ok(p.ending);assert.equal(p.age,60);
});
