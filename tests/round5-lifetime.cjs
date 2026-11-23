const {readFileSync}=require('node:fs');
const {runInNewContext}=require('node:vm');
const assert=require('node:assert/strict');
const index=readFileSync('index.html','utf8');
const files=[...index.matchAll(/<script defer src="([^"]+)/g)].map(m=>m[1].split('?')[0]).filter(p=>p.startsWith('js/data/')||p==='js/data.js'||p.startsWith('js/engine/')||p==='js/engine.js');
const local=new Map();const ctx={console,Date,Math,Map,Set,JSON,Number,String,Array,Object,localStorage:{getItem:k=>local.get(k)||null,setItem:(k,v)=>local.set(k,v+'')},location:{origin:'http://localhost'}};
for(const f of files)runInNewContext(readFileSync(f,'utf8'),ctx,{filename:f});
runInNewContext('globalThis.Ctor=GameEngine;globalThis.Data=GameData',ctx);
const e=new ctx.Ctor();const data=ctx.Data;
const N=300;let crossing={start:0,review:0,final:0,echo:0,endedBeforeEcho:0,interruptedAtEnding:0,options:{open:0,phase:0,seal:0}};let entered=0,second=0,third=0,ended=0,years=0,earned=0,net=0,pressure=0,invalid=0;let mentorMemory={illnessStarted:0,legacyReached:0,interruptedByEnding:0};let family=0,team=0,teamLast=0,familySecond=0,familyLast=0,teamRoute={shared:0,deferred:0},familyRoute={present:0,absent:0},classmate={entered:0,second:0,finale:0,branches:{open:0,favor:0,boundary:0}};
const stages={},outcomes={},routes={open:0,quiet:0};
for(let seed=1;seed<=N;seed++){let pcStart=0,pcEcho=0;
 e.reset();
 let x=(seed*2654435761)>>>0;
 const random=()=>{x^=x<<13;x^=x>>>17;x^=x<<5;return (x>>>0)/4294967296};
 e.randf=random;e.rand=(a,b)=>a+Math.floor(random()*(b-a+1));
 const p=e.getPlayer(),h=e.getHidden(),a=e.getAttrs();
 p.name='样本'+seed;p.unit=data.units[seed%data.units.length];p.unitLevel=({乡镇:0,街道:0,县级:1,市级:2,省级:3,中央:4}[p.unit.level]||0);
 p.isEmployed=true;p.leadershipRank=1;p.age=24;p.yearsWorked=1;p.reputation=50;p.peopleReputation=50;
 p.isMarried=seed%2===0;p.political=seed%3===0?'cpc':'mass';p.personality=['stable','ambitious','smooth','straight'][seed%4];
 a.iq=3;a.eq=3;a.body=4;a.luck=2;h.workAbility=30;h.integrity=55;h.mentalPressure=12;h.background=seed%5===0?52:12;
 e.initFinance();
 for(let y=0;y<44;y++){
  if(p.ending)break;
  if(e.state.currentEvent && e.state.currentEvent.choices){let id=e.state.currentEvent.id;stages[id]=(stages[id]||0)+1;
    const pick=Math.floor(random()*e.state.currentEvent.choices.length);
    if(id==='arc_receipt_1'){entered++;routes[pick===0?'open':'quiet']++}
    if(id==='e094')classmate.entered++;
    if(id==='arc_crossroads_1'){pcStart++;crossing.start++;crossing.options[pick===0?'open':pick===1?'phase':'seal']++}
    if(id?.startsWith('arc_crossroads_')&&id.endsWith('_2'))crossing.review++;
    if(id?.startsWith('arc_crossroads_')&&id.endsWith('_3'))crossing.final++;
    if(id==='arc_crossroads_echo'){pcEcho++;crossing.echo++;}
    if(id?.startsWith('arc_classmate_')&&id.endsWith('_2'))classmate.second++;
    if(id?.startsWith('arc_classmate_')&&id.endsWith('_3'))classmate.finale++;
    if(id==='arc_team_1'){team++;teamRoute[pick===0?'shared':'deferred']++}
    if(id==='arc_family_1'){family++;familyRoute[pick===0?'present':'absent']++}
    if(id==='arc_team_shared_3'||id==='arc_team_deferred_3')teamLast++;
    if(id==='arc_family_present_2'||id==='arc_family_absent_2')familySecond++;
    if(id==='arc_family_clinic_3')familyLast++;
    if(id?.startsWith('arc_receipt_') && id?.endsWith('_2'))second++;
    if(id?.startsWith('arc_receipt_') && id?.endsWith('_3'))third++;
    if(!e.isChoiceEnabled(e.state.currentEvent.choices[pick])){const choices=e.state.currentEvent.choices;const i=choices.findIndex(c=>e.isChoiceEnabled(c));if(i>=0)e.handleEventChoice(i);else {invalid++;e.state.currentEvent=null;}}
    else e.handleEventChoice(pick);
    if(id==='e094') { const route=p.flags.classmateOpen?'open':p.flags.classmateFavor?'favor':p.flags.classmateBoundaries?'boundary':null;if(route)classmate.branches[route]++; }
  }
  if(e.state.pendingPromotion){if(typeof e.acceptPromotion==='function')e.acceptPromotion();else e.state.pendingPromotion=null}
  if(e.state.pendingTransfer){if(typeof e.declineTransfer==='function')e.declineTransfer();else e.state.pendingTransfer=null}
  try{e.runCareerYear()}catch(err){console.error('simulation crashed seed',seed,'year',y,err);process.exit(1)}
  years++;
  if(!Number.isFinite(p.wealth)||!Number.isFinite(h.mentalPressure)){console.error('bad stats',seed,y);process.exit(1)}
 }
 if(p.ending){ended++;outcomes[p.ending]=(outcomes[p.ending]||0)+1}
 // A terminal ending can truncate a future-dated epilogue, or interrupt a
 // due choice already queued for the player. Neither is a lost causal node.
 // Any already-due node missing from the current choice slot still fails.
 if(p.ending && pcStart && !pcEcho){
   const seen=p.seenEvents||[];
   const pending=e.getPendingCausalConsequences().filter(x=>x.id.startsWith('arc_crossroads_'));
   assert.ok(pending.length,`seed ${seed}: crossroads starts without a visible terminal or future consequence`);
   const future=pending.filter(x=>x.dueAge>p.age);
   const current=pending.filter(x=>x.dueAge<=p.age&&e.state.currentEvent?.id===x.id);
   assert.ok(future.length+current.length>0,`seed ${seed}: scheduled crossroads consequence missing at age ${p.age}`);
   if(current.length) crossing.interruptedAtEnding++;
   else crossing.endedBeforeEcho++;
 }
 // The mentor's illness must either reach its later-life memory or remain
 // visibly queued at terminal retirement. Never silently consume an unseen node.
 if((p.seenEvents||[]).includes('ent177')){
   mentorMemory.illnessStarted++;
   if((p.seenEvents||[]).includes('ent306')) mentorMemory.legacyReached++;
   else {
     const pending=e.getPendingCausalConsequences().filter(x=>['ent182','ent183','ent306'].includes(x.id));
     assert.ok(pending.length,`seed ${seed}: mentor's remembered illness lost its queued consequences`);
     assert.ok(pending.some(x=>x.dueAge>p.age||e.state.currentEvent?.id===x.id),`seed ${seed}: mentor's due callback lost at age ${p.age}`);
     mentorMemory.interruptedByEnding++;
   }
 }
 earned+=p.promotions;net+=p.wealth;pressure+=h.mentalPressure;
}
const summary={seeds:N,years,marriedStartingSamples:N/2,highBackgroundStartingSamples:N/5,receipt:{opened:entered,second,third,branches:routes},team:{opened:team,finale:teamLast,branches:teamRoute},family:{opened:family,second:familySecond,finale:familyLast,branches:familyRoute},classmate,crossing,mentorMemory,ended,endingCounts:outcomes,avgPromotions:Number((earned/N).toFixed(2)),avgWealth:Number((net/N).toFixed(2)),avgMentalPressure:Number((pressure/N).toFixed(2)),unresolvedBlockedEvents:invalid,arcStageCounts:Object.fromEntries(Object.entries(stages).filter(([id])=>id&&id.startsWith('arc_')))};
console.log(JSON.stringify(summary,null,2));assert.equal(mentorMemory.illnessStarted,mentorMemory.legacyReached+mentorMemory.interruptedByEnding,'mentor story must resolve or be visibly scheduled at the terminal ending');assert.equal(invalid,0,'unexpected unresolvable choice');assert.equal(ended,N,'all long games should reach a terminal outcome');assert.equal(crossing.start,crossing.echo+crossing.endedBeforeEcho+crossing.interruptedAtEnding,'crossroads must finish, await future due age, or be interrupted by its own visible pending choice at terminal ending');
