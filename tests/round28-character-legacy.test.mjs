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

test('Zhou Lan four second-stage choices persist and change third scene; six-year return evolves contact',()=>{
 const scenes=[];
 for(const initial of [0,1])for(const second of [0,1]){
  const {e,p,d}=setup({age:30});choose(e,d,'arc_receipt_1',initial);
  const route=initial?'quiet':'open';p.age+=2;choose(e,d,'arc_receipt_'+route+'_2',second);p.age+=3;
  const template=d.events.find(x=>x.id==='arc_receipt_'+route+'_3'),raw=JSON.stringify(template);
  const ev=e.getLifePathEvent(template);scenes.push(ev.text);assert.equal(JSON.stringify(template),raw);
  e.state.currentEvent=ev;e.handleEventChoice(second);assert.equal(e.resolveContact('receipt_zhoulan').position,'群众事务业务骨干');
  assert.equal(e.getPendingCausalConsequences().find(x=>x.id==='arc_receipt_legacy_4').dueAge,41);
  p.age=41;p.flags.crossResolved=true;p.flags.teamLegacyDocumented=true;
  const legacy=e.getLifePathEvent(d.events.find(x=>x.id==='arc_receipt_legacy_4'));assert.match(legacy.text,/联合会商/);assert.match(legacy.text,/许砚/);
  e.state.currentEvent=legacy;e.handleEventChoice(0);assert.equal(e.resolveContact('receipt_zhoulan').position,'档案交接协调人');assert.equal(hasDue(e,'arc_receipt_legacy_4'),false);
 }
 assert.equal(new Set(scenes).size,4);
});
test('Lin Mo six middle choices and all third branches create persistent later choices',()=>{
 const scenes=[];
 for(const initial of [0,1,2])for(const second of [0,1]){
  const {e,p,d}=setup({age:32});e.getHidden().background=55;choose(e,d,'e094',initial);
  const route=['open','favor','boundary'][initial];p.age+=2;choose(e,d,'arc_classmate_'+route+'_2',second);p.age+=3;
  const template=d.events.find(x=>x.id==='arc_classmate_'+route+'_3'),raw=JSON.stringify(template);
  const ev=e.getLifePathEvent(template);scenes.push(ev.text);assert.equal(JSON.stringify(template),raw);
  e.state.currentEvent=ev;e.handleEventChoice(second);assert.ok(e.resolveContact('oldClassmate').position.includes('企业'));
  assert.equal(e.getPendingCausalConsequences().find(x=>x.id==='arc_classmate_legacy_4').dueAge,43);
  p.age=43;p.flags.ventureDeclared=true;const legacy=e.getLifePathEvent(d.events.find(x=>x.id==='arc_classmate_legacy_4'));assert.match(legacy.text,/私人投资/);
  if(initial===1&&second===1)assert.equal(legacy.choices[1].effects.risk,2);
  e.state.currentEvent=legacy;e.handleEventChoice(2);assert.equal(e.resolveContact('oldClassmate').position,'企业交接筹备者');assert.ok(!hasDue(e,'arc_classmate_legacy_4'));
 }
 assert.equal(new Set(scenes).size,6);
});
test('legacy migration recovers known third dates without fabricating decisions',()=>{
 const {e,p}=setup({age:50});p.seenEvents.push('arc_receipt_quiet_3','arc_classmate_boundary_3');p.careerLog.push({year:38,event:'五年后的楼道：已完成'},{year:40,event:'五年后的同学会：已完成'});
 assert.ok(e.migrateState(e.state));assert.equal(p.flags.receiptThirdResolved_since,38);assert.equal(p.flags.classmateThirdResolved_since,40);assert.equal(p.flags.receiptReopened,undefined);assert.equal(p.flags.classmateRenewed,undefined);
 assert.equal(e.getPendingCausalConsequences().find(x=>x.id==='arc_receipt_legacy_4').dueAge,44);assert.equal(e.getPendingCausalConsequences().find(x=>x.id==='arc_classmate_legacy_4').dueAge,46);
});
test('retirement resolves all due legacy handoffs in order without aging or prematurely resolving future events',()=>{
 const {e,p}=setup({age:60});p.gender='男';p.flags.retireAsked=true;p.flags.receiptThirdResolved=true;p.flags.receiptThirdResolved_since=50;p.flags.classmateThirdResolved=true;p.flags.classmateThirdResolved_since=52;p.flags.teamThirdResolved=true;p.flags.teamThirdResolved_since=59;
 e.getHidden().risk=0;e.getHidden().mentalPressure=20;e.checkEndings();assert.equal(e.state.currentEvent?.id,'arc_receipt_legacy_4');e.handleEventChoice(1);assert.equal(e.state.currentEvent?.id,'arc_classmate_legacy_4');e.handleEventChoice(1);assert.equal(p.age,60);assert.ok(p.ending);assert.ok(hasDue(e,'arc_team_legacy_4'));
});
