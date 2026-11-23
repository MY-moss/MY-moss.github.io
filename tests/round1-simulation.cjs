const {readFileSync}=require('node:fs');
const {runInNewContext}=require('node:vm');
const assert=require('node:assert/strict');
const index=readFileSync('index.html','utf8');
const files=[...index.matchAll(/<script defer src="([^"]+)/g)].map(m=>m[1].split('?')[0]).filter(p=>p.startsWith('js/data/')||p==='js/data.js'||p.startsWith('js/engine/')||p==='js/engine.js');
const local=new Map();const ctx={console,Date,Math,Map,Set,JSON,Number,String,Array,Object,localStorage:{getItem:k=>local.get(k)||null,setItem:(k,v)=>local.set(k,v+'')},location:{origin:'http://localhost'}};
for(const f of files)runInNewContext(readFileSync(f,'utf8'),ctx,{filename:f});
runInNewContext('globalThis.Ctor=GameEngine;globalThis.Data=GameData',ctx);
const e=new ctx.Ctor();const data=ctx.Data;
const N=300;let entered=0,second=0,third=0,ended=0,years=0,earned=0,net=0,pressure=0,invalid=0;
const stages={},outcomes={},routes={open:0,quiet:0};
for(let seed=1;seed<=N;seed++){
 e.reset();
 let x=(seed*2654435761)>>>0;
 const random=()=>{x^=x<<13;x^=x>>>17;x^=x<<5;return (x>>>0)/4294967296};
 e.randf=random;e.rand=(a,b)=>a+Math.floor(random()*(b-a+1));
 const p=e.getPlayer(),h=e.getHidden(),a=e.getAttrs();
 p.name='样本'+seed;p.unit=data.units[seed%data.units.length];p.unitLevel=({乡镇:0,街道:0,县级:1,市级:2,省级:3,中央:4}[p.unit.level]||0);
 p.isEmployed=true;p.leadershipRank=1;p.age=24;p.yearsWorked=1;p.reputation=50;p.peopleReputation=50;
 p.political=seed%3===0?'cpc':'mass';p.personality=['stable','ambitious','smooth','straight'][seed%4];
 a.iq=3;a.eq=3;a.body=4;a.luck=2;h.workAbility=30;h.integrity=55;h.mentalPressure=12;h.background=12;
 e.initFinance();
 for(let y=0;y<13;y++){
  if(p.ending)break;
  if(e.state.currentEvent && e.state.currentEvent.choices){let id=e.state.currentEvent.id;stages[id]=(stages[id]||0)+1;
    const pick=Math.floor(random()*e.state.currentEvent.choices.length);
    if(id==='arc_receipt_1'){entered++;routes[pick===0?'open':'quiet']++}
    if(id?.endsWith('_2'))second++;
    if(id?.endsWith('_3'))third++;
    if(!e.isChoiceEnabled(e.state.currentEvent.choices[pick])){const choices=e.state.currentEvent.choices;const i=choices.findIndex(c=>e.isChoiceEnabled(c));if(i>=0)e.handleEventChoice(i);else {invalid++;e.state.currentEvent=null;}}
    else e.handleEventChoice(pick);
  }
  if(e.state.pendingPromotion){if(typeof e.acceptPromotion==='function')e.acceptPromotion();else e.state.pendingPromotion=null}
  if(e.state.pendingTransfer){if(typeof e.declineTransfer==='function')e.declineTransfer();else e.state.pendingTransfer=null}
  try{e.runCareerYear()}catch(err){console.error('simulation crashed seed',seed,'year',y,err);process.exit(1)}
  years++;
  if(!Number.isFinite(p.wealth)||!Number.isFinite(h.mentalPressure)){console.error('bad stats',seed,y);process.exit(1)}
 }
 if(p.ending){ended++;outcomes[p.ending]=(outcomes[p.ending]||0)+1}
 earned+=p.promotions;net+=p.wealth;pressure+=h.mentalPressure;
}
const summary={seeds:N,years,entered,entryRate:Number((entered/N*100).toFixed(1)),second,third,routeCounts:routes,ended,endingCounts:outcomes,avgPromotions:Number((earned/N).toFixed(2)),avgWealth:Number((net/N).toFixed(2)),avgMentalPressure:Number((pressure/N).toFixed(2)),unresolvedBlockedEvents:invalid,arcStageCounts:Object.fromEntries(Object.entries(stages).filter(([id])=>id&&id.startsWith('arc_')))};
console.log(JSON.stringify(summary,null,2));assert.equal(invalid,0,'unexpected unresolvable choice');
