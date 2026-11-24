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
function open(e){const ev=e.getPolicyProjectDecisionEvent();assert.ok(ev);e.state.currentEvent=ev;return ev;}
function next(e,p){p.age++;p.yearsWorked++;e.resetActionPoints();}
test('pressure-sensitive project pause remains valid after same-year settlements and reload; no double rewards',()=>{
 const {e,p}=setup({age:38,rank:5});const h=e.getHidden();h.workAbility=60;h.mentalPressure=50;e.cashIn(100);
 assert.ok(e.startPolicyProject('digital_governance'));let ev=open(e);const idx=ev.choices.findIndex(c=>c.policyPause);assert.ok(idx>=0);
 h.mentalPressure=44;h.workAbility=40; // other annual settlements after issue
 const ap=e.getActionPoints(),cash=p.finance.cash;
 assert.ok(e.saveState(1));assert.ok(e.loadState(1));const q=e.getPlayer();
 assert.ok(e.state.currentEvent.choices[idx].policyPause);
 assert.ok(e.handleEventChoice(idx));assert.equal(e.getActionPoints(),ap-1);assert.equal(q.finance.cash,cash);
 assert.equal(e.state.policyProject.stage,0);assert.equal(e.state.policyProject.qualitySamples,0);assert.equal(e.state.policyProject.budget,13);
 assert.equal(e.getHidden().mentalPressure,34);assert.equal(e.state.policyProject.pauses,1);assert.equal(e.getPolicyProjectDecisionEvent(),null);
 assert.equal(e.chooseDutyPlan('pace'),false);
 next(e,q);e.getHidden().mentalPressure=50;ev=open(e);const pause=ev.choices.findIndex(c=>c.policyPause);
 q.actionPoints=0;assert.equal(e.isChoiceEnabled(ev.choices[pause]),false);assert.equal(e.handleEventChoice(pause),false);
 e.resetActionPoints();assert.ok(e.handleEventChoice(pause));assert.equal(e.state.policyProject.pauses,2);assert.equal(e.state.policyProject.stage,0);
 next(e,q);e.getHidden().mentalPressure=50;ev=open(e);assert.ok(ev.choices.every(c=>!c.policyPause));
 assert.ok(e.handleEventChoice(0));assert.equal(e.state.policyProject.stage,1);
});
test('specialist duties respect high workload, recovery consumes the same annual slot and AP',()=>{
 const {e,p,d}=setup({age:38,rank:5});p.unit=d.units.find(u=>u.level==='市级'&&u.tags.includes('tech'));
 const h=e.getHidden();h.mentalPressure=56;h.workAbility=65;e.resetActionPoints();const ap=e.getActionPoints();
 assert.equal(e.chooseDutyPlan('special_tech'),false);assert.ok(e.chooseDutyPlan('pace'));assert.equal(h.mentalPressure,51);assert.equal(e.getActionPoints(),ap-1);
 assert.equal(e.chooseDutyPlan('special_tech'),false);next(e,p);assert.ok(e.settleDutyPlan());assert.equal(h.mentalPressure,49);
 assert.ok(e.startPolicyProject('digital_governance'));assert.equal(e.chooseDutyPlan('special_tech'),false);
 open(e);assert.ok(e.handleEventChoice(0));assert.equal(e.chooseDutyPlan('delegate'),false);
});
test('life endings are earned by real choices in distinct years, not high terminal stats or duplicated same-age choices',()=>{
 const {e,p,d}=setup({age:35,rank:4,yearsWorked:15});const h=e.getHidden();h.workAbility=75;h.risk=0;h.mentalPressure=10;h.integrity=60;p.reputation=60;
 assert.equal(e.getEarnedLifeEnding(),null);
 const work=d.events.filter(ev=>['work','career'].includes(ev.stage)&&ev.choices?.some(c=>c.effects?.workAbility>=2&&c.effects?.mentalPressure>0&&!c.effects?.risk&&!c.requireFlag&&!c.minWealth)).filter(ev=>ev.id.startsWith('renew_')).slice(0,6);
 assert.equal(work.length,6);
 for(const ev of work){
  const idx=ev.choices.findIndex(c=>c.effects?.workAbility>=2&&c.effects?.mentalPressure>0&&!c.effects?.risk&&!c.requireFlag&&!c.minWealth);
  e.state.currentEvent=ev;e.handleEventChoice(idx);
  const n=e.getLifeEvidence().craft.length;assert.equal(e.recordLifeEvidence('craft','重复'),false);assert.equal(e.getLifeEvidence().craft.length,n);next(e,p);
 }
 assert.equal(e.getEarnedLifeEnding(),'steady_professional');
 assert.ok(e.saveState(1));assert.ok(e.loadState(1));assert.equal(e.getLifeEvidence().craft.length,6);assert.equal(e.getEarnedLifeEnding(),'steady_professional');
 e.getPlayer().flags.tookBribe=true;assert.equal(e.getEarnedLifeEnding(),null);
});
test('actual family accompaniment unlocks a separate low-rank ending and cannot duplicate in a year',()=>{
 const {e,p}=setup({age:34,rank:2,yearsWorked:15});p.hasChildren=true;p.childAge=5;p.isMarried=true;const h=e.getHidden();h.workAbility=50;h.mentalPressure=10;h.risk=0;h.integrity=60;
 for(let i=0;i<5;i++){assert.ok(e.raiseChild('company').ok);assert.equal(e.raiseChild('company').ok,false);next(e,p);p.flags.childRaiseUsed=0;p.childAge++;}
 assert.equal(e.getLifeEvidence().care.length,5);assert.equal(e.getEarnedLifeEnding(),'life_companion');assert.equal(e.determineEnding(),'life_companion');
});
test('public service evidence can qualify a low-rank career, while ordinary auto gains cannot',()=>{
 const {e,p,d}=setup({age:34,rank:2,yearsWorked:15}),h=e.getHidden();h.integrity=75;h.risk=0;h.mentalPressure=10;h.workAbility=45;p.peopleReputation=75;
 const scenes=d.events.filter(ev=>ev.id.startsWith('renew_')&&ev.stage==='work'&&ev.choices?.some(c=>c.effects?.peopleReputation>=2&&c.effects?.mentalPressure>0&&!c.effects?.risk&&!c.requireFlag&&!c.minWealth)).slice(0,5);
 assert.equal(scenes.length,5);
 for(const ev of scenes){e.state.currentEvent=ev;e.handleEventChoice(ev.choices.findIndex(c=>c.effects?.peopleReputation>=2&&c.effects?.mentalPressure>0&&!c.effects?.risk&&!c.requireFlag&&!c.minWealth));next(e,p);}
 assert.equal(e.getLifeEvidence().service.length,5);assert.equal(e.getEarnedLifeEnding(),'people_champion');
});
