import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {runInNewContext} from 'node:vm';

const root=resolve(import.meta.dirname,'..');
const html=readFileSync(resolve(root,'index.html'),'utf8');
const scripts=[...html.matchAll(/<script defer src="([^"]+)/g)].map(x=>x[1].split('?')[0])
  .filter(x=>x.startsWith('js/data/')||x==='js/data.js'||x.startsWith('js/engine/')||x==='js/engine.js');
function setup(){
  const store=new Map();
  const ctx={console,Math,Date,Array,Map,Set,Object,String,Number,JSON,Uint8Array,Int32Array,
    localStorage:{getItem:k=>store.get(k)??null,setItem:(k,v)=>store.set(k,String(v)),removeItem:k=>store.delete(k)},
    location:{origin:'http://localhost'},btoa:s=>Buffer.from(s,'binary').toString('base64'),
    atob:s=>Buffer.from(s,'base64').toString('binary'),escape,unescape,encodeURIComponent,decodeURIComponent};
  for(const file of scripts) runInNewContext(readFileSync(resolve(root,file),'utf8'),ctx,{filename:file});
  runInNewContext('globalThis.E=GameEngine;globalThis.D=GameData',ctx);
  const engine=new ctx.E(),player=engine.getPlayer();
  player.name='回归测试';player.age=34;player.yearsWorked=7;player.isEmployed=true;
  player.unit=ctx.D.units.find(u=>u.level==='市级');player.unitLevel=2;
  player.leadershipRank=4;player.reputation=50;player.peopleReputation=50;
  player.seenEvents=['e087','e088','e089','e090','e091','e092'];
  player.isMarried=true;
  engine.initFinance();engine.setPhase('career');
  engine.randf=()=>0.999;
  return {e:engine,p:player,d:ctx.D,store};
}
function choose(e,d,id,index){
  const event=d.events.find(x=>x.id===id);
  assert.ok(event,id);
  e.state.currentEvent=event;
  e.handleEventChoice(index);
}
function tick(e,p,years=1){
  let event;
  for(let i=0;i<years;i++){
    p.age++;p.yearsWorked++;e.state.currentEvent=null;
    event=e._rcy_annualEventSelection().event;
  }
  return event;
}

test('legacy migration backfills the actual complete causal chain, including recent NPC and cadre flags',()=>{
  const {e,p,d}=setup();
  const legacy=JSON.parse(JSON.stringify(e.state));
  for(const flag of ['wangDispute','directorDispute','mentorMet','mentorCared','cadreInquiry','parentCareReviewed','familyClinicResolved']){
    assert.ok(e.getCausalChainSteps().some(x=>x.flag===flag),'real chain: '+flag);
    legacy.player.flags[flag]=true;
  }
  legacy.player.flags.wangDispute_since=26;
  legacy.player.flags.mentorCared_since=null;
  assert.equal(e.migrateState(legacy),true);
  const flags=legacy.player.flags;
  for(const flag of ['directorDispute','mentorMet','mentorCared','cadreInquiry','parentCareReviewed','familyClinicResolved']){
    assert.equal(flags[flag+'_since'],34,flag+' must not slide forever when loaded');
  }
  assert.equal(flags.wangDispute_since,26,'an existing meaningful timestamp is immutable');
  assert.equal(legacy.player.seenEvents.length,p.seenEvents.length,'migration must preserve the original event record');
  e.state=legacy;
  const due=e.getPendingCausalConsequences().find(x=>x.id==='ent285');
  assert.equal(due.dueAge,28);
  assert.equal(due.overdue,true);
  assert.equal(d.events.length,1840);
});

test('new family chapter uses the same rigid scheduling and never leaks into the random event pool',()=>{
  const {e,p,d}=setup();
  const last=d.events.find(x=>x.id==='arc_family_clinic_3');
  assert.ok(last);
  assert.equal(e.getCausalChainSteps().find(x=>x.next===last.id).delay,3);
  const pool=e.generateEvent(true);
  assert.notEqual(pool?.id,last.id);
  choose(e,d,'arc_family_1',0);
  assert.equal(e.getPendingCausalConsequences().find(x=>x.id==='arc_family_present_2').dueAge,36);
  assert.notEqual(tick(e,p)?.id,'arc_family_present_2');
  assert.equal(tick(e,p)?.id,'arc_family_present_2');
  choose(e,d,'arc_family_present_2',0);
  assert.equal(p.flags.familyClinicResolved,true);
  assert.equal(p.flags.familyClinicRoutine,true);
  assert.equal(e.getPendingCausalConsequences().find(x=>x.id===last.id).dueAge,39);
  assert.notEqual(tick(e,p,2)?.id,last.id);
  assert.equal(tick(e,p)?.id,last.id);
  e.state.currentEvent=e.getLifePathEvent(last);
  e.handleEventChoice(0);
  assert.ok(p.seenEvents.includes(last.id));
  assert.equal(e.getPendingCausalConsequences().some(x=>x.id===last.id),false);
});

test('all four family repair styles produce different memories, coherent callbacks, and real tradeoffs',()=>{
  const variants=[
    ['arc_family_present_2',0,'familyClinicRoutine','固定','重担转嫁'],
    ['arc_family_present_2',1,'familyClinicNegotiated','弹性','主动确认彼此'],
    ['arc_family_absent_2',0,'familyClinicRepair','连续错过','持续陪伴'],
    ['arc_family_absent_2',1,'familyClinicRebalanced','主动做家务','具体分工']
  ];
  for(const [id,choice,flag,story,ending] of variants){
    const {e,p,d}=setup();
    choose(e,d,'arc_family_1',id.includes('present')?0:1);
    p.age=36;p.yearsWorked=9;
    choose(e,d,id,choice);
    assert.equal(p.flags.familyClinicResolved,true);
    assert.equal(p.flags[flag],true);
    assert.equal(p.flags[flag+'_since'],36);
    const template=d.events.find(x=>x.id==='arc_family_clinic_3');
    const original=JSON.stringify(template);
    const callback=e.getLifePathEvent(template);
    assert.ok(callback.text.includes(story),flag);
    assert.ok(callback.choices.some(c=>c.result.includes(ending)),flag);
    assert.equal(JSON.stringify(template),original,'must not permanently mutate the shared event data');
    e.state.currentEvent=callback;
    e.handleEventChoice(0);
    assert.ok(p.seenEvents.includes(template.id));
  }
});

test('family and Xu Yan team choice cross in text and bounded numerical consequence',()=>{
  const {e,p,d}=setup();
  p.flags.familyClinicRepair=true;
  p.flags.teamDeferred=true;
  let ev=e.getLifePathEvent(d.events.find(x=>x.id==='arc_family_clinic_3'));
  assert.match(ev.text,/许砚|值班表/);
  assert.equal(ev.choices[0].effects.positionWeight,-4);
  assert.equal(ev.choices[0].effects.mentalPressure,4);
  p.flags.teamDeferred=false;p.flags.teamShared=true;
  ev=e.getLifePathEvent(d.events.find(x=>x.id==='arc_family_clinic_3'));
  assert.match(ev.text,/许砚|交接/);
  assert.equal(ev.choices[0].effects.workAbility,1);
  assert.equal(ev.choices[0].effects.positionWeight,-3);
});

test('newest family chapter counts as the actual ending in the life map, with offline cache updated',()=>{
  const ui=readFileSync(resolve(root,'js/app/app-career.js'),'utf8');
  assert.match(ui,/const complete = seen\.includes\('arc_family_clinic_3'\)/);
  assert.match(ui,/finished:seen\.includes\('arc_family_clinic_3'\)/);
  assert.match(ui,/familyClinicResolved_since/);
  const sw=readFileSync(resolve(root,'sw.js'),'utf8');
  assert.match(sw,/shangan-pages-27/);
  assert.match(sw,/data-events-arc-revision\.js/);
  assert.match(html,/上岸模拟器 2\.1\.105/);
});

test('real loadState and importSave paths resume old flags rather than silently losing their callbacks',()=>{
  for(const mode of ['load','import']){
    const {e,p,store}=setup();
    const saved=JSON.parse(JSON.stringify(e.state));
    saved.player.flags.cadreInquiry=true;
    saved.player.flags.mentorMet=true;
    saved.player.flags.familyClinicResolved=true;
    saved.player.flags.familyClinicRoutine=true;
    delete saved.player.flags.cadreInquiry_since;
    delete saved.player.flags.mentorMet_since;
    delete saved.player.flags.familyClinicResolved_since;
    if(mode==='load'){
      store.set(e.getSaveKey(0),JSON.stringify(saved));
      assert.equal(e.loadState(0),true);
    }else{
      const b64=Buffer.from(JSON.stringify({v:2,time:0,slot:0,state:saved}),'utf8').toString('base64');
      assert.equal(e.importSave(b64,0).ok,true);
    }
    const f=e.state.player.flags;
    for(const k of ['cadreInquiry','mentorMet','familyClinicResolved'])assert.equal(f[k+'_since'],p.age,k);
    for(const id of ['enc125','ent175','arc_family_clinic_3']){
      const row=e.getPendingCausalConsequences().find(x=>x.id===id);
      assert.ok(row,mode+' must queue '+id);
      assert.ok(row.dueAge>e.state.player.age,mode+' must not create an already missed callback');
    }
    assert.equal(e.getPlayer().name,'回归测试');
  }
});
