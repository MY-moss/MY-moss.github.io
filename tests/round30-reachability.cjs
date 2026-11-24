// Construct one or more internally consistent eligibility witnesses per event.
// A synthetic witness demonstrates candidate-pool eligibility, not a playable causal history.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const files=[...fs.readFileSync('index.html','utf8').matchAll(/<script defer src="([^"]+)/g)].map(m=>m[1].split('?')[0]).filter(f=>f.startsWith('js/data/')||f==='js/data.js'||f.startsWith('js/engine/')||f==='js/engine.js');
const ctx={console,Date,Math,Map,Set,JSON,Number,String,Array,Object,localStorage:{getItem:()=>null,setItem:()=>{}},location:{origin:'http://localhost'}};
for(const f of files)vm.runInNewContext(fs.readFileSync(f,'utf8'),ctx,{filename:f});
vm.runInNewContext('globalThis.E=GameEngine;globalThis.D=GameData',ctx);
const e=new ctx.E(),d=ctx.D;
const targets=new Set(e.getCausalChainSteps().map(s=>s.next));
const injected=new Set(['e253','e110','ent299','arc_crossroads_1','arc_life_confluence_1']);
const levels={乡镇:0,街道:0,县级:1,市级:2,省级:3,中央:4};
function matches(ev,u){
 const l=levels[u.level]??0;
 return l>=(ev.requireUnitLevelMin??0)&&l<=(ev.requireUnitLevelMax??4)&&e.getMaxRankForLevel(u.level)>=(ev.requireRankMin??1)&&(!ev.requireUnitSystem||ev.requireUnitSystem===u.system)&&(!ev.pools?.length||ev.pools.some(k=>k==='public'||k===u.system||k===['乡镇/街道','县级','市级','省级','中央'][l]||u.name.includes(k)||(k==='政府部门'&&/税务|财政|审计|统计|发改|国资委/.test(u.name))));
}
function witness(ev,u,age){
 e.reset();const p=e.getPlayer(),h=e.getHidden(),a=e.getAttrs();
 p.isEmployed=true;p.unit=u;p.unitLevel=levels[u.level]??0;p.age=age;p.yearsWorked=age-22;p.gender=ev.requireGender||'男';p.leadershipRank=Math.min(ev.requireRankMax??12,e.getMaxRankForLevel(u.level),Math.max(ev.requireRankMin??1,Math.floor(p.yearsWorked/3)+1));
 p.isMarried=!!ev.requireMarried||!!ev.requireChild;p.hasChildren=!!ev.requireChild||ev.requireChildAgeMin!==undefined;p.childAge=p.hasChildren?Math.max(ev.requireChildAgeMin??0,Math.min(6,ev.requireChildAgeMax??40)):0;if(p.hasChildren&&p.childAge>age-18)return false;
 p.political=ev.requirePolitical||'mass';p.background=d.backgrounds.find(b=>b.id===(ev.requireBackground||'ordinary'));p.talents=ev.requireTalent?[ev.requireTalent]:[];
 p.reputation=Math.min(ev.maxReputation??100,Math.max(65,ev.minReputation??0));p.peopleReputation=Math.min(70,ev.requirePeopleReputationMax??100);
 h.workAbility=65;h.integrity=65;h.background=Math.min(ev.maxBackground??100,Math.max(ev.minBackground??0,40));h.risk=Math.max(10,ev.requireRisk??0,ev.requireHeatOrRisk??0);h.mentalPressure=Math.max(40,ev.requireMentalPressure??0);h.positionWeight=Math.max(10,ev.requirePositionWeight??0);
 a.body=Math.min(ev.requireBodyMax??10,Math.max(5,ev.requireBody??0));a.appearance=Math.max(6,ev.requireAppearance??0);a.family=Math.max(6,ev.requireFamily??0);a.luck=Math.max(6,ev.requireLuck??0);a.iq=8;a.eq=8;p.heat=Math.max(10,ev.requireHeat??0);
 for(const k of [ev.requireFlag,...(ev.requireFlags||[])].filter(Boolean)){p.flags[k]=true;p.flags[k+'_since']=age-2;}
 if(ev.requireContact||ev.requireContactArchetype||ev.requireContactStatus||ev.requireContactMinTrust!==undefined){
 const id=ev.requireContact||'fixture_contact';p.contacts=[{id,uid:id,legacyId:id,name:'测试联系人',archetype:ev.requireContactArchetype||'peer',roles:ev.requireContactArchetype?[ev.requireContactArchetype]:[],relation:Math.min(ev.requireContactMax??100,Math.max(ev.requireContactMin??0,40)),trust:Math.max(40,ev.requireContactMinTrust??0),status:ev.requireContactStatus||'active'}];}
 e.cashIn(Math.max(100,ev.requireWealth??0));if(ev.requireDebt)e.addDebt('personal',ev.requireDebt);if(ev.maxWealth!==undefined&&p.wealth>ev.maxWealth)e.addDebt('personal',p.wealth-ev.maxWealth);
 e.state.era=ev.era?.[0]||'stable';e.state.scenarioId=Array.isArray(ev.scenario)?ev.scenario[0]:ev.scenario||'classic';
 return true;
}
const rows=[];let profiles=0;
for(const ev of d.events){
 if(targets.has(ev.id)||injected.has(ev.id)){rows.push({id:ev.id,title:ev.title,status:targets.has(ev.id)?'scheduled':'injected'});continue;}
 const units=d.units.filter(u=>matches(ev,u));
 const lo=Math.max(22,ev.year?.[0]??22,22+(ev.requireYearsWorkedMin??ev.minYear??0),18+(ev.requireChildAgeMin??0),22+Math.max(0,(ev.requireRankMin??1)-1)*3),hi=Math.min(65,ev.year?.[1]??65);
 let found=null,last=[];
 for(const age of [...new Set([Math.max(lo,35),lo,hi])].filter(a=>a>=lo&&a<=hi)){
  for(const u of units.slice(0,4)){
   if(!witness(ev,u,age))continue;profiles++;
   const result=e.getEventPoolSnapshot().find(x=>x.id===ev.id);
   if(result){found={age,unit:u.name,rank:e.getPlayer().leadershipRank,choices:!result.choices||result.choices.some(c=>e.isChoiceEnabled(c))};break;}
   last=e.getEventVisibilityDiagnostics([ev.id]).events[0].reasons;
  }
  if(found)break;
 }
 rows.push({id:ev.id,title:ev.title,status:found?(found.choices?'witness':'blocked_choices'):'unresolved',witness:found,reasons:found?undefined:units.length?last:['no matching unit/rank']});
}
const counts=rows.reduce((m,r)=>(m[r.status]=(m[r.status]||0)+1,m),{});
console.log(JSON.stringify({profiles,total:rows.length,counts,unresolved:rows.filter(r=>['unresolved','blocked_choices'].includes(r.status))},null,2));
if(process.argv.includes('--write'))fs.writeFileSync('docs/EVENT_REACHABILITY_ROUND30.json',JSON.stringify({method:'synthetic candidate-pool witnesses; scheduled/injected not end-to-end verified',profiles,counts,rows},null,2)+'\n');

assert.equal(rows.filter(r=>["unresolved","blocked_choices"].includes(r.status)).length,0,"unresolved event witnesses");
