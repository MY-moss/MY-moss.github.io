const fs=require('node:fs'),vm=require('node:vm');
const files=[...fs.readFileSync('index.html','utf8').matchAll(/<script defer src="([^"]+)/g)].map(m=>m[1].split('?')[0]).filter(p=>p.startsWith('js/data/')||p==='js/data.js'||p.startsWith('js/engine/')||p==='js/engine.js');
const ctx={console,Date,Math,Map,Set,JSON,Number,String,Array,Object,Uint8Array,Int32Array,localStorage:{getItem:()=>null,setItem:()=>{},removeItem:()=>{}},location:{origin:'http://localhost'}};
for(const f of files)vm.runInNewContext(fs.readFileSync(f,'utf8'),ctx,{filename:f});vm.runInNewContext('globalThis.E=GameEngine;globalThis.D=GameData',ctx);
const e=new ctx.E(),d=ctx.D;
function init(seed,age=24,rank=1){
 e.reset();e.state.era=['stable','reform','rectify'][seed%3];let x=(seed*2654435761)>>>0;
 e.randf=()=>{x^=x<<13;x^=x>>>17;x^=x<<5;return (x>>>0)/4294967296};e.rand=(a,b)=>a+Math.floor(e.randf()*(b-a+1));
 const p=e.getPlayer(),h=e.getHidden(),a=e.getAttrs();Object.assign(p,{age,leadershipRank:rank,yearsWorked:age-23,isEmployed:true,unit:d.units[seed%d.units.length],reputation:50,peopleReputation:50,isMarried:seed%2===0,political:seed%3===0?'cpc':'mass',personality:['stable','ambitious','smooth','straight'][seed%4]});p.unitLevel=({乡镇:0,街道:0,县级:1,市级:2,省级:3,中央:4}[p.unit.level]||0);Object.assign(h,{workAbility:30,integrity:55,mentalPressure:12,background:12});Object.assign(a,{iq:3,eq:3,body:4,luck:2});e.initFinance();return p;
}
const modes={random:null,career:{positionWeight:3,workAbility:2,reputation:2,background:1,desire:1,risk:-.5,mentalPressure:-.4},integrity:{integrity:3,risk:-3,heat:-2,peopleReputation:1,mentalPressure:-.5},life:{familyPressure:-3,mentalPressure:-2,body:3,wealth:.1,positionWeight:-.3,risk:-1},risk:{wealth:.3,positionWeight:3,background:2,risk:1,integrity:-1,desire:1},professional:{workAbility:3,peopleReputation:2,integrity:1,risk:-2,mentalPressure:-1}};
const N=Number(process.env.SAMPLES)||60,results={};
for(const [mode,weights] of Object.entries(modes)){
 let outcomes={},sums={},coverage=new Set(),runs=0,blocked=0,cap={};const totals=['rank','wealth','risk','integrity','workAbility','reputation','pressure','familyPressure','promotions'];
 for(let seed=1;seed<=N;seed++){
  const p=init(seed),h=e.getHidden();
  for(let i=0;i<70&&!p.ending;i++){
   let guard=0;
   while(!p.ending&&(e.state.currentEvent||e.state.pendingPromotion||e.state.pendingTransfer)&&guard++<15){
    if(e.state.currentEvent){const ev=e.state.currentEvent,cs=(ev.choices||[]).map((c,i)=>({c,i})).filter(({c})=>e.isChoiceEnabled(c));if(!cs.length){blocked++;break}
     if(ev.id)coverage.add(ev.id);
     const score=({c})=>Object.entries(c.effects||{}).reduce((a,[k,v])=>a+(typeof v==='number'?v*(weights?.[k]||0):0),0);
     let choice=weights?cs.sort((a,b)=>score(b)-score(a))[0]:cs[Math.floor(e.randf()*cs.length)];
     e.handleEventChoice(choice.i);
    }else if(e.state.pendingPromotion)e.acceptPromotion();else e.declineTransfer();
   }
   if(p.ending)break;if(e.state.currentEvent||e.state.pendingPromotion||e.state.pendingTransfer)break;
   if(mode!=='random'){const plan=e.getDutyPlan(),id=mode==='professional'?plan.actions.at(-1).id:mode==='career'?plan.actions[0].id:mode==='integrity'?plan.actions[1].id:mode==='life'?(plan.actions.find(x=>x.id==='delegate')||plan.actions[1]).id:plan.actions[0].id;e.chooseDutyPlan(id);}
   if(mode==='professional'&&!e.state.policyProject&&h.mentalPressure<45){
    const def=e.getPolicyProjectDefinitions().find(d=>e.getPolicyProjectGate(d.id).ok);
    if(def&&e.startPolicyProject(def.id)){
      e.state.currentEvent=e.getPolicyProjectDecisionEvent();
      if(e.state.currentEvent)continue;
    }
   }
   if(mode==='life'&&h.mentalPressure>55&&(p.flags.restCount||0)<3)e.restYear();else e.runCareerYear();
  }
  if(p.ending)runs++;outcomes[p.ending||'unfinished']=(outcomes[p.ending||'unfinished']||0)+1;
  let stats={rank:p.leadershipRank,wealth:p.wealth,risk:h.risk,integrity:h.integrity,workAbility:h.workAbility,reputation:p.reputation,pressure:h.mentalPressure,familyPressure:h.familyPressure,promotions:p.promotions};
  for(const k of totals)sums[k]=(sums[k]||0)+stats[k];for(const k of ['integrity','workAbility','reputation'])if(stats[k]>=100)cap[k]=(cap[k]||0)+1;
 }
 results[mode]={ended:runs,blocked,coverage:coverage.size,outcomes,mean:Object.fromEntries(Object.entries(sums).map(([k,v])=>[k,Math.round(v/N*10)/10])),cap};
}
console.log(JSON.stringify(results,null,2));for(const [mode,r] of Object.entries(results))if(r.ended!==N||r.blocked)throw Error(mode+' unresolved simulation');
