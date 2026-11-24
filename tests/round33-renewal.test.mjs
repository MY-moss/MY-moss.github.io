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

test('second renewal removes 12 weak scenes without reusing IDs and keeps 12 complete new scenes',()=>{
 const {e,d,p}=setup();const retired=JSON.parse(readFileSync(resolve(root,'docs/ROUND33_RETIRED_EVENTS.json'),'utf8'));
 assert.equal(retired.length,12);assert.ok(retired.every(x=>!d.events.some(y=>y.id===x.id)));
 const scenes=d.events.filter(x=>/^renew_(credit|shop|reform|stable|rectify)_/.test(x.id));
 assert.equal(scenes.length,12);assert.equal(scenes.flatMap(x=>x.choices).length,36);
 assert.ok(scenes.every(x=>x.choices.every(c=>c.result&&c.result.length>12)));
 p.seenEvents.push('e157');e.state.currentEvent={id:'enw163',stage:'work',eventType:'choice',title:'新同事的礼物',text:'旧存档待选事件',choices:[{text:'婉拒',effects:{integrity:3}},{text:'收下',effects:{risk:1}}]};
 assert.ok(e.saveState(1));assert.ok(e.loadState(1));assert.equal(e.state.currentEvent.id,'enw163');e.handleEventChoice(0);
 assert.ok(e.getPlayer().seenEvents.includes('enw163'));
});
test('all 54 complete three-choice paths of the two new five-year arcs resolve with correct timing',()=>{
 for(const route of ['credit','shop']){
  const secondTexts=new Set(),thirdTexts=new Set();
  for(let first=0;first<3;first++)for(let middle=0;middle<3;middle++)for(let last=0;last<3;last++){
   const {e,p,d}=setup({age:32,rank:4}),id='renew_'+route;
   assert.ok(eligible(e,id+'_1'));assert.ok(!eligible(e,id+'_2'));assert.ok(!eligible(e,id+'_3'));
   choose(e,d,id+'_1',first);
   assert.equal(e.getPendingCausalConsequences().find(x=>x.id===id+'_2').dueAge,34);
   assert.notEqual(advance(e,p)?.id,id+'_2');
   const second=advance(e,p);assert.equal(second.id,id+'_2');secondTexts.add(second.text);
   e.state.currentEvent=second;e.handleEventChoice(middle);
   assert.equal(e.getPendingCausalConsequences().find(x=>x.id===id+'_3').dueAge,37);
   assert.notEqual(advance(e,p)?.id,id+'_3');assert.notEqual(advance(e,p)?.id,id+'_3');
   const third=advance(e,p);assert.equal(third.id,id+'_3');thirdTexts.add(third.text);
   e.state.currentEvent=third;e.handleEventChoice(last);assert.ok(p.seenEvents.includes(id+'_3'));assert.ok(!hasDue(e,id+'_3'));
  }
  assert.equal(secondTexts.size,3);assert.ok(thirdTexts.size>=3);
 }
});
test('six era stories obey era gates across all three eras; crossovers use actual memories',()=>{
 const {e,p,d}=setup({age:35,rank:4});
 for(const era of ['reform','stable','rectify']){
  e.state.era=era;const pool=e.getEventPoolSnapshot();
  for(const event of d.events.filter(x=>/^renew_(reform|stable|rectify)_/.test(x.id))){
   assert.equal(pool.some(x=>x.id===event.id),event.era.includes(era),event.id+' in '+era);
  }
 }
 for(const [id,flag,pattern] of [['renew_credit_3','teamLegacyDocumented',/许砚/],['renew_shop_3','receiptLegacyVerified',/旧城档案/]]){
  const base=d.events.find(x=>x.id===id),raw=JSON.stringify(base);p.flags[flag]=true;assert.match(e.getLifePathEvent(base).text,pattern);assert.equal(JSON.stringify(base),raw);
 }
});
