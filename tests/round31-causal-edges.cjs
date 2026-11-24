// Construct one or more internally consistent eligibility witnesses per event.
// A synthetic witness demonstrates candidate-pool eligibility, not a playable causal history.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const files=[...fs.readFileSync('index.html','utf8').matchAll(/<script defer src="([^"]+)/g)].map(m=>m[1].split('?')[0]).filter(f=>f.startsWith('js/data/')||f==='js/data.js'||f.startsWith('js/engine/')||f==='js/engine.js');
const ctx={console,Date,Math,Map,Set,JSON,Number,String,Array,Object,localStorage:{getItem:()=>null,setItem:()=>{}},location:{origin:'http://localhost'}};
for(const f of files)vm.runInNewContext(fs.readFileSync(f,'utf8'),ctx,{filename:f});
vm.runInNewContext('globalThis.E=GameEngine;globalThis.D=GameData',ctx);
const e=new ctx.E(),d=ctx.D;
// Isolate a scheduled transition after exercising a real producer when available.
// This verifies each edge, not the natural probability or full playthrough of every source.
const steps=e.getCausalChainSteps(),rows=[];
const flagKeys=x=>[x?.flag,...(x?.setFlags||[])].filter(Boolean);
const milestones=['e087','e088','e089','e090','e091','e092'];
function init(age){
 e.reset();const p=e.getPlayer(),h=e.getHidden(),a=e.getAttrs();p.age=age;p.yearsWorked=age-22;p.isEmployed=true;p.unit=d.units.find(u=>u.level==='市级');p.unitLevel=2;p.leadershipRank=5;p.seenEvents=[...milestones];p.reputation=60;p.peopleReputation=60;
 h.workAbility=70;h.integrity=65;h.background=60;h.risk=0;h.mentalPressure=10;a.body=8;a.eq=8;a.iq=8;e.initFinance();e.cashIn(500);e.randf=()=>0.999;e.rand=(a,b)=>a;return p;
}
for(const step of steps){
 const target=d.events.find(x=>x.id===step.next);assert.ok(target,step.next);
 const source=d.events.flatMap(ev=>ev.id===step.next?[]:ev.choices?ev.choices.map((c,i)=>({ev,c,i,fx:c.effects})): [{ev,fx:ev.effects}]).find(x=>flagKeys(x.fx).includes(step.flag));
 const age=35;
 let p=init(age),mode='runtime fixture';
 if(source){
   mode='event producer';
   if(source.c?.minBackground!==undefined)e.getHidden().background=source.c.minBackground;
   if(source.c?.maxBackground!==undefined)e.getHidden().background=Math.min(e.getHidden().background,source.c.maxBackground);
   if(source.c?.requireFlag)p.flags[source.c.requireFlag]=true;
   if(source.c?.maxWealth!==undefined)e.cashOut(Math.max(0,p.finance.cash-source.c.maxWealth));
   if(source.c?.minWealth!==undefined)e.cashIn(source.c.minWealth);
   if(source.c){
     assert.ok(e.isChoiceEnabled(source.c),step.flag+' producer choice disabled');
     e.state.currentEvent=source.ev;e.handleEventChoice(source.i);
   }else e.applyEventEffects(source.ev);
 }else if(step.flag==='gamblingAddict'){
   mode='runtime gambling producer';
 }
 if(!source&&step.flag==='gamblingAddict'){
   e.autoSettleGamble=ctx.E.prototype.autoSettleGamble;e.randf=()=>0.1;e.autoSettleGamble();
 }else if(!source&&step.flag==='ventureStake'){
   mode='runtime investment flag fixture';e.markEventFlag(step.flag);
 }
 assert.ok(p.flags[step.flag],step.flag+' source failed');
 assert.equal(p.flags[step.flag+'_since'],age,step.flag+' missing timestamp');
 // Preserve the produced flag and timestamp; isolate other queued obligations to test this edge deterministically.
 p.flags={[step.flag]:true,[step.flag+'_since']:p.flags[step.flag+'_since']};p.ending=null;p.isEmployed=true;p.isMarried=false;p.political='mass';p.seenEvents=[...milestones,...steps.filter(x=>x.flag===step.flag&&x.delay<step.delay).map(x=>x.next)];e.state.currentEvent=null;e.state.pendingPromotion=null;e.state.pendingTransfer=null;e.state.policyProject=null;e.randf=()=>0.999;e.rand=(a,b)=>a;
 p.age=age+step.delay-1;p.yearsWorked=p.age-22;
 const pending=e.getPendingCausalConsequences().find(x=>x.id===step.next);
 assert.equal(pending?.dueAge,age+step.delay,step.flag+' date');
 assert.equal(pending.overdue,false,step.flag+' early');
 const pool=e.getEventPoolSnapshot();assert.ok(!pool.some(ev=>ev.id===step.next),step.next+' random leak');
 p.age++;p.yearsWorked++;
 assert.equal(e.getPendingCausalConsequences().find(x=>x.id===step.next)?.overdue,true);
 const result=e._rcy_annualEventSelection().event;assert.equal(result?.id,step.next,step.flag+' scheduler');
 const choices=result.choices||[];
 assert.ok(!choices.length||choices.some(c=>e.isChoiceEnabled(c)),step.next+' no available option');
 if(choices.length){
   const choice=choices.findIndex(c=>e.isChoiceEnabled(c));e.handleEventChoice(choice);
 }
 assert.ok(p.seenEvents.includes(step.next),step.next+' not recorded');
 rows.push({flag:step.flag,target:step.next,delay:step.delay,source:source?.ev.id||mode});
}
console.log(JSON.stringify({edges:rows.length,targets:new Set(rows.map(r=>r.target)).size,eventProducerEdges:rows.filter(r=>r.source.startsWith('runtime')===false).length,runtimeEdges:rows.filter(r=>r.source.startsWith('runtime')).length,rows},null,2));
