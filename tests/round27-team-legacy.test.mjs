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

test('all four middle choices leave distinct memories and advance Xu Yan into independent leadership',()=>{
 const scenes=[];
 for(const first of [0,1])for(const middle of [0,1]){
  const {e,p,d}=setup({age:30});choose(e,d,'arc_team_1',first);
  p.age+=2;const route=first?'deferred':'shared';
  choose(e,d,'arc_team_'+route+'_2',middle);p.age+=3;
  const original=d.events.find(x=>x.id==='arc_team_'+route+'_3'),before=JSON.stringify(original);
  const ev=e.getLifePathEvent(original);scenes.push(ev.text);assert.equal(JSON.stringify(original),before);
  e.state.currentEvent=ev;e.handleEventChoice(middle);
  assert.equal(p.flags.teamThirdResolved_since,35);assert.equal(e.resolveContact('arc_xuyan').position,first?'跨部门业务负责人':'业务骨干');
  const due=e.getPendingCausalConsequences().find(x=>x.id==='arc_team_legacy_4');assert.equal(due.dueAge,41);
  p.age=41;p.flags.crossResolved=true;p.flags.familyClinicRepair=true;
  const later=e.getLifePathEvent(d.events.find(x=>x.id==='arc_team_legacy_4'));
  assert.match(later.text,/联合会商/);assert.match(later.text,/按时回家/);
  e.state.currentEvent=later;e.handleEventChoice(0);assert.equal(e.resolveContact('arc_xuyan').position,'团队负责人');assert.equal(e.resolveContact('arc_xuyan').evolutionStage,3);assert.equal(hasDue(e,'arc_team_legacy_4'),false);
 }
 assert.equal(new Set(scenes).size,4);
});
test('legacy completed team save recovers actual log age without inventing choice history',()=>{
 const {e,p}=setup({age:48});p.seenEvents.push('arc_team_shared_3');p.flags.teamShared=true;p.careerLog.push({year:38,event:'五年后的推荐表：已完成'});
 assert.ok(e.migrateState(e.state));assert.equal(p.flags.teamThirdResolved_since,38);assert.equal(p.flags.teamRecommended,undefined);assert.equal(e.getPendingCausalConsequences().find(x=>x.id==='arc_team_legacy_4').dueAge,44);
});
test('retirement resolves due handoff in the same year but does not accelerate a future story',()=>{
 for(const due of [true,false]){
 const {e,p}=setup({age:60});p.gender='男';p.flags.retireAsked=true;p.flags.teamThirdResolved=true;p.flags.teamThirdResolved_since=due?54:58;
 e.getHidden().risk=0;e.getHidden().mentalPressure=20;e.checkEndings();
 if(due){assert.equal(e.state.currentEvent?.id,'arc_team_legacy_4');assert.ok(!p.ending);e.handleEventChoice(1);assert.equal(p.age,60);assert.ok(p.ending);assert.equal(p.deathReason,'retired');}
 else{assert.ok(p.ending);assert.equal(e.state.currentEvent,null);assert.ok(hasDue(e,'arc_team_legacy_4'));}
 }
});
test('duplicate triggers to one consequence preserve earliest promised date',()=>{
 const {e,p}=setup({age:45});p.flags.lifeFamilyPresent=true;p.flags.lifeFamilyPresent_since=44;p.flags.lifeFamilyCareer=true;p.flags.lifeFamilyCareer_since=38;
 const matches=e.getPendingCausalConsequences().filter(x=>x.id==='arc_life_family_2');assert.equal(matches.length,1);assert.equal(matches[0].dueAge,40);assert.equal(matches[0].flag,'lifeFamilyCareer');
});
test('zero reputation is preserved by migration and actual reputation effects',()=>{
 const {e,p}=setup();p.reputation=0;p.peopleReputation=0;assert.ok(e.migrateState(e.state));assert.equal(p.reputation,0);assert.equal(p.peopleReputation,0);
 e.applyEffects({peopleReputation:2,reputation:3});assert.equal(p.peopleReputation,2);assert.equal(p.reputation,3);
});
