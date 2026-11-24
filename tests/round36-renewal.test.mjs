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

const specs=[
 {route:'grant',branch:['rejected','local','local'],firstDelay:1,lastDelay:4},
 {route:'ferry',branch:['lost','bus','bus'],firstDelay:2,lastDelay:3},
 {route:'duet',branch:['split','independent','independent'],firstDelay:2,lastDelay:3},
 {route:'garden',branch:['closed','pass','pass'],firstDelay:2,lastDelay:3}
];
test('32 retired definitions are absent; 32 new events contain 96 meaningful choice results',()=>{
 const {e,p,d}=setup(),retired=JSON.parse(readFileSync(resolve(root,'docs/ROUND36_RETIRED_EVENTS.json'),'utf8'));
 const ctx={};for(const k of ['arcs','singles'])runInNewContext(readFileSync(resolve(root,'js/data/data-events-renew36-'+k+'.js'),'utf8'),ctx);
 const scenes=runInNewContext('[...gd_events_renew36_arcs,...gd_events_renew36_singles]',ctx);
 assert.equal(retired.length,32);assert.equal(scenes.length,32);assert.equal(d.events.length,1838);
 assert.equal(new Set(scenes.map(x=>x.id)).size,32);assert.equal(scenes.flatMap(x=>x.choices).length,96);
 for(const old of retired)assert.ok(!d.events.some(x=>x.id===old.id),old.id);
 for(const ev of scenes){
  assert.equal(d.events.filter(x=>x.id===ev.id).length,1);
  assert.equal(new Set(ev.choices.map(c=>c.result)).size,3);
  assert.ok(ev.choices.every(c=>c.result?.length>12),ev.id);
  assert.ok(ev.choices.every(c=>Object.values(c.effects).filter(v=>typeof v==='number').every(v=>Math.abs(v)<=5)),ev.id);
 }
 p.seenEvents.push('e331');e.state.currentEvent={id:'enc086',stage:'career',eventType:'choice',title:'旧退休场景',text:'旧存档待处理',choices:[{text:'继续安排工作',effects:{mentalPressure:-2}},{text:'休息',effects:{mentalPressure:-1}}]};
 assert.ok(e.saveState(1));assert.ok(e.loadState(1));assert.equal(e.state.currentEvent.id,'enc086');e.handleEventChoice(0);assert.ok(e.getPlayer().seenEvents.includes('enc086'));
});
test('108 complete paths use mutually exclusive middle nodes and preserve actual outcomes',()=>{
 for(const spec of specs)for(let first=0;first<3;first++)for(let middle=0;middle<3;middle++)for(let last=0;last<3;last++){
  const {e,p,d}=setup({age:38,rank:4}),id='renew_'+spec.route;
  const target=id+'_'+spec.branch[first],other=id+'_'+spec.branch[first===0?1:0],final=id+'_3';
  assert.ok(eligible(e,id+'_1'));assert.ok(!eligible(e,target));assert.ok(!eligible(e,other));assert.ok(!eligible(e,final));
  choose(e,d,id+'_1',first);
  assert.equal(e.getPendingCausalConsequences().find(x=>x.id===target)?.dueAge,38+spec.firstDelay);
  assert.ok(!hasDue(e,other));
  for(let i=1;i<spec.firstDelay;i++)assert.notEqual(advance(e,p)?.id,target);
  const second=advance(e,p);assert.equal(second.id,target);
  e.state.currentEvent=second;e.handleEventChoice(middle);assert.ok(p.seenEvents.includes(target));assert.ok(!p.seenEvents.includes(other));
  assert.equal(e.getPendingCausalConsequences().find(x=>x.id===final)?.dueAge,43);
  for(let i=1;i<spec.lastDelay;i++)assert.notEqual(advance(e,p)?.id,final);
  const third=advance(e,p);assert.equal(third.id,final);
  if(spec.route==='grant')assert.match(third.text,first===0?/未获选/:/没有报名/);
  if(spec.route==='duet')assert.match(third.text,first===0?/文件夹早已关闭/:/从未签署/);
  if(spec.route==='garden')assert.match(third.text,first===0?/曾轮值/:/未长期维护/);
  e.state.currentEvent=third;e.handleEventChoice(last);
  assert.ok(p.seenEvents.includes(final));assert.ok(!hasDue(e,final));assert.ok(!hasDue(e,other));
  assert.equal(!!p.flags['renew'+spec.route[0].toUpperCase()+spec.route.slice(1)+'Legacy'],last===0);
 }
});
test('irreversible missed grant never grants rank, false attendance, or the other branch',()=>{
 const {e,p,d}=setup({age:38,rank:4}),rank=p.leadershipRank;
 choose(e,d,'renew_grant_1',0);const second=advance(e,p);
 assert.equal(second.id,'renew_grant_rejected');assert.match(second.text,/没有获选/);
 e.state.currentEvent=second;e.handleEventChoice(1);assert.equal(p.leadershipRank,rank);
 const final=advance(e,p,4);assert.equal(final.id,'renew_grant_3');assert.match(final.text,/未获选/);
 e.state.currentEvent=final;e.handleEventChoice(0);assert.equal(p.leadershipRank,rank);
 assert.ok(!p.seenEvents.includes('renew_grant_local'));
});
test('cross-story details appear only for actually recorded decisions',()=>{
 const {e,p,d}=setup();
 for(const [id,flag,pattern] of [['renew_grant_rejected','renewLessonRelease',/小梁/],['renew_grant_3','renewCreditLegacy',/沈宁/],['renew_ferry_bus','renewRouteHonest',/公交线路/],['renew_duet_3','renewBookReviewed',/阿岑/],['renew_garden_3','renewStageLegacy',/小剧场/]]){
  const base=d.events.find(x=>x.id===id),raw=JSON.stringify(base);
  assert.doesNotMatch(e.getLifePathEvent(base).text,pattern);p.flags[flag]=true;
  assert.match(e.getLifePathEvent(base).text,pattern);assert.equal(JSON.stringify(base),raw);delete p.flags[flag];
 }
});
