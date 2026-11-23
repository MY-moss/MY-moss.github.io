const {readFileSync}=require('node:fs');
const {runInNewContext}=require('node:vm');
const assert=require('node:assert/strict');
const html=readFileSync('index.html','utf8');
const files=[...html.matchAll(/<script defer src="([^"]+)/g)].map(x=>x[1].split('?')[0]).filter(x=>x.startsWith('js/data/')||x==='js/data.js'||x.startsWith('js/engine/')||x==='js/engine.js');
const ctx={console,Date,Math,Set,Map,JSON,Number,String,Array,Object,Uint8Array,Int32Array,localStorage:{getItem:()=>null,setItem:()=>{},removeItem:()=>{}},location:{origin:'http://localhost'}};
for(const f of files)runInNewContext(readFileSync(f,'utf8'),ctx,{filename:f});
runInNewContext('globalThis.E=GameEngine;globalThis.D=GameData',ctx);
const e=new ctx.E(),data=ctx.D;
let years=0,ended=0,retired=0,arrest=0,burnout=0,invalid=0,overwritten=0;const outcomes={};const N=200;
for(let seed=1;seed<=N;seed++){
  e.reset();let x=(seed*2654435761)>>>0;const random=()=>{x^=x<<13;x^=x>>>17;x^=x<<5;return (x>>>0)/4294967296};e.randf=random;e.rand=(a,b)=>a+Math.floor(random()*(b-a+1));
  const p=e.getPlayer(),h=e.getHidden(),a=e.getAttrs();p.name='退休样本'+seed;p.unit=data.units[seed%data.units.length];p.unitLevel=({乡镇:0,街道:0,县级:1,市级:2,省级:3,中央:4}[p.unit.level]||0);p.isEmployed=true;p.leadershipRank=3;p.age=47;p.yearsWorked=24;p.gender='女';p.isMarried=seed%2===0;p.political=seed%3===0?'cpc':'mass';p.personality=['stable','ambitious','smooth','straight'][seed%4];a.iq=3;a.eq=3;a.body=4;a.luck=2;h.workAbility=66;h.integrity=65;h.mentalPressure=18;h.background=seed%5===0?52:12;e.initFinance();
  for(let y=0;y<21&&!p.ending;y++){
    if(e.state.currentEvent?.choices){let ev=e.state.currentEvent;const can=ev.choices.map((c,i)=>e.isChoiceEnabled(c)?i:null).filter(i=>i!==null);if(!can.length){invalid++;break;}const selected=can[Math.floor(random()*can.length)];e.handleEventChoice(selected);if(e.state.currentEvent===ev)overwritten++;}
    if(e.state.pendingPromotion)e.acceptPromotion();
    if(e.state.pendingTransfer)e.declineTransfer();
    if(p.ending)break;
    try{e.runCareerYear()}catch(err){console.error('CRASH',seed,y,err);process.exit(1)}
    years++;
    for(const n of [p.age,p.wealth,h.mentalPressure,h.risk,p.leadershipRank])assert.ok(Number.isFinite(n),'NaN in seed '+seed);
  }
  if(p.ending){ended++;outcomes[p.ending]=(outcomes[p.ending]||0)+1;}
  if(p.deathReason==='retired'||(p.age>=55&&p.ending&&p.ending!=='arrest'&&p.ending!=='burnout'))retired++;
  if(p.ending==='arrest')arrest++;if(p.ending==='burnout')burnout++;
}
const result={seeds:N,years,ended,retired,arrest,burnout,invalid,overwritten,endingCounts:outcomes};
console.log(JSON.stringify(result,null,2));assert.equal(invalid,0);assert.equal(overwritten,0);assert.ok(ended>150,'retirement should be reachable from 47 for most samples');
