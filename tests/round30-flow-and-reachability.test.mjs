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

test('successful onboarding is a real first-year event, not a random late-career or pre-employment event',()=>{
 const {e,p}=setup({age:23,rank:1,yearsWorked:1});p.passed=true;p.ageOnshore=22;
 assert.equal(e._rcy_annualEventSelection().event.id,'e253');
 assert.ok(!e.getEventPoolSnapshot().some(x=>x.id==='e253'));
 e.handleEventChoice(1);assert.ok(p.seenEvents.includes('e253'));
 assert.notEqual(e._rcy_annualEventSelection().event?.id,'e253');
 const q=setup({age:23,rank:1,yearsWorked:1});q.p.passed=false;
 assert.notEqual(q.e._rcy_annualEventSelection().event?.id,'e253');
});
test('annual advance cannot consume time or overwrite pending choices or terminal state',()=>{
 for(const slot of ['currentEvent','pendingPromotion','pendingTransfer']){
  const {e,p}=setup();e.state[slot]={id:'test'};const before=JSON.stringify(e.state);
  assert.equal(e.runCareerYear(),false);assert.equal(JSON.stringify(e.state),before);
 }
 const {e,p}=setup();p.ending='safe';const before=JSON.stringify(e.state);assert.equal(e.runCareerYear(),false);assert.equal(JSON.stringify(e.state),before);
});
test('due causal decision precedes new policy stage; project resumes after older choice',()=>{
 const {e,p}=setup({rank:8,yearsWorked:16});assert.ok(e.startPolicyProject('digital_governance'));
 p.flags.teamThirdResolved=true;p.flags.teamThirdResolved_since=p.age-6;
 assert.equal(e._rcy_annualEventSelection().event.id,'arc_team_legacy_4');e.handleEventChoice(0);
 assert.equal(e.state.policyProject.stage,0);
 p.age++;p.yearsWorked++;assert.ok(e._rcy_annualEventSelection().event.projectEvent);
});
test('declining the last pending promotion at retirement completes same-year retirement',()=>{
 const {e,p}=setup({age:60,rank:5,yearsWorked:36});p.gender='男';p.flags.retireAsked=true;e.getHidden().risk=0;e.getHidden().mentalPressure=10;
 e.state.pendingPromotion={source:'测试晋升'};e.checkEndings();assert.ok(!p.ending);
 e.declinePromotion();assert.ok(p.ending);assert.equal(p.age,60);assert.equal(p.deathReason,'retired');
});
test('declining the last pending transfer at retirement completes same-year retirement',()=>{
 const {e,p}=setup({age:60,rank:5,yearsWorked:36});p.gender='男';p.flags.retireAsked=true;e.getHidden().risk=0;e.getHidden().mentalPressure=10;
 e.state.pendingTransfer={type:'lateral'};e.checkEndings();assert.ok(!p.ending);
 e.declineTransfer();assert.ok(p.ending);assert.equal(p.age,60);assert.equal(p.deathReason,'retired');
});
