const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const files=[...fs.readFileSync('index.html','utf8').matchAll(/<script defer src="([^"]+)/g)].map(m=>m[1].split('?')[0]).filter(f=>f.startsWith('js/data/')||f==='js/data.js'||f.startsWith('js/engine/')||f==='js/engine.js');
const ctx={console,Date,Math,Map,Set,JSON,Number,String,Array,Object,localStorage:{getItem:()=>null,setItem:()=>{}},location:{origin:'http://localhost'}};
for(const f of files)vm.runInNewContext(fs.readFileSync(f,'utf8'),ctx,{filename:f});
vm.runInNewContext('globalThis.E=GameEngine;globalThis.D=GameData',ctx);
const e=new ctx.E(),d=ctx.D;
const visible=new Set(),scenarioVisible=new Map();let profiles=0,blockedChoices=0;
const level={乡镇:0,街道:0,县级:1,市级:2,省级:3,中央:4};
const units=[...new Map(d.units.map(u=>[u.system+'|'+u.level,u])).values()];
for(const u of units)for(const era of ['stable','reform','rectify'])for(const age of [26,40,54,62]){
 e.reset();const p=e.getPlayer(),h=e.getHidden(),a=e.getAttrs();p.unit=u;p.unitLevel=level[u.level]??0;p.isEmployed=true;p.age=age;p.yearsWorked=age-22;p.gender=profiles%2?'女':'男';p.isMarried=profiles%3!==0;p.hasChildren=p.isMarried;p.childAge=age-26;p.political=profiles%2?'cpc':'mass';p.leadershipRank=Math.min(e.getMaxRankForLevel(u.level),age<30?2:age<50?5:8);p.reputation=65;p.peopleReputation=70;h.workAbility=60;h.integrity=65;h.background=profiles%3*30;h.risk=profiles%4*15;a.eq=6;a.iq=6;a.body=5;e.cashIn(100);e.state.era=era;e.state.scenarioId='classic';
 const pool=e.getEventPoolSnapshot();profiles++;
 for(const ev of pool){visible.add(ev.id);if(ev.choices&&!ev.choices.some(c=>e.isChoiceEnabled(c)))blockedChoices++;}
}
for(const id of Object.keys(d.scenarios).filter(x=>x!=='classic')){
 e.reset();e.state.scenarioId=id;e.applyScenarioSetup();const p=e.getPlayer();p.isEmployed=true;p.unit=d.units[0];p.unitLevel=0;p.age=Math.max(35,p.age);p.yearsWorked=10;
 const pool=e.getEventPoolSnapshot();const own=pool.filter(ev=>ev.scenario===id).map(ev=>ev.id);scenarioVisible.set(id,own);
 assert.ok(own.length,id+' has no scenario entrance in representative profile');
}
const missing=d.events.filter(ev=>!visible.has(ev.id));
console.log(JSON.stringify({profiles,unitSystemLevelPairs:units.length,classicPoolUnion:visible.size,total:d.events.length,notObserved:missing.length,notObservedWithExplicitPrerequisites:missing.filter(ev=>ev.requireFlag||ev.requireFlags||ev.requireContact||ev.requireContactArchetype||ev.scenario).length,blockedChoiceProfilePairs:blockedChoices,scenarioEntrances:Object.fromEntries(scenarioVisible)},null,2));
