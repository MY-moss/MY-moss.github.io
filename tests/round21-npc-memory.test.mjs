import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import {resolve} from 'node:path';
const root=resolve(import.meta.dirname,'..');
const scripts=[...readFileSync(resolve(root,'index.html'),'utf8').matchAll(/<script defer src="([^"]+)/g)]
  .map(x=>x[1].split('?')[0]).filter(f=>f.startsWith('js/data/')||f==='js/data.js'||f.startsWith('js/engine/')||f==='js/engine.js');
function setup(){
 const db=new Map(),ctx={console,Math,Date,Array,Map,Set,Object,String,Number,JSON,Uint8Array,Int32Array,
  localStorage:{getItem:k=>db.get(k)??null,setItem:(k,v)=>db.set(k,String(v)),removeItem:k=>db.delete(k)},
  location:{origin:'http://localhost'},btoa:s=>Buffer.from(s,'binary').toString('base64'),atob:s=>Buffer.from(s,'base64').toString('binary'),
  escape,unescape,encodeURIComponent,decodeURIComponent};
 for(const file of scripts)runInNewContext(readFileSync(resolve(root,file),'utf8'),ctx,{filename:file});
 runInNewContext('globalThis.E=GameEngine;globalThis.D=GameData',ctx);
 const e=new ctx.E(),p=e.getPlayer();
 p.name='人物记忆回归';p.age=34;p.yearsWorked=7;p.isEmployed=true;
 p.unit=ctx.D.units.find(u=>u.level==='市级');p.unitLevel=2;p.leadershipRank=4;
 p.reputation=50;p.peopleReputation=50;p.seenEvents=['e087','e088','e089','e090','e091','e092'];
 e.initFinance();e.setPhase('career');e.rand=()=>0;e.randf=()=>0.999;
 return {e,p,d:ctx.D};
}
function choose(e,d,id,choice){
 e.state.currentEvent=d.events.find(x=>x.id===id);assert.ok(e.state.currentEvent,id);
 e.handleEventChoice(choice);
}
function passYear(e,p,n=1){let event;for(let i=0;i<n;i++){p.age++;p.yearsWorked++;e.state.currentEvent=null;event=e._rcy_annualEventSelection().event;}return event;}
function due(e,id){return e.getPendingCausalConsequences().find(x=>x.id===id);}
function relation(e,id){const c=e.resolveContact(id);return c ? c.relation:null;}
function eligibleGate(e,id,key){const x=e.getEventVisibilityDiagnostics([id]).events[0];return x.gates.find(g=>g.key===key);}
test('negative enemy relation gates keep actual enemies eligible, but not reconciled colleagues',()=>{
 const{e,p,d}=setup();
 choose(e,d,'ent167',0);
 assert.equal(relation(e,'enemy_167'),-30);
 assert.equal(eligibleGate(e,'ent285','contactRelation').passed,true);
 const contact=e.resolveContact('enemy_167');
 contact.relation=-80;
 assert.equal(eligibleGate(e,'ent285','contactRelation').passed,true,'high hostility must not hide the rival');
 contact.relation=12;
 assert.equal(eligibleGate(e,'ent285','contactRelation').passed,false,'a reconciled colleague is no longer a hostile contact');
 for(const id of ['ent169','ent170','ent171','ent172','ent173','ent174','ent285','ent286']){
   const event=d.events.find(x=>x.id===id);
   assert.ok(event.requireContactMax!==undefined,id+' must use a maximum negative relation');
   assert.equal(event.requireContactMin,undefined,id+' previously inverted enemy hostility');
 }
});
test('remembered public criticism of Wang has two-year review, then distinct repair and feud outcomes',()=>{
 for(const [choice,next] of [[1,'ent304'],[2,'ent305']]){
   const{e,p,d}=setup();
   choose(e,d,'ent167',0);
   assert.equal(due(e,'ent285').dueAge,p.age+2);
   assert.notEqual(passYear(e,p)?.id,'ent285');
   assert.equal(passYear(e,p)?.id,'ent285');
   choose(e,d,'ent285',choice);
   const now=e.resolveContact('enemy_167');
   assert.equal(due(e,next).dueAge,p.age+2);
   if(choice===1){assert.equal(now.enemy,false);assert.ok(now.relation>=0);}
   else {assert.equal(now.enemy,true);assert.ok(now.relation<=-45);}
   assert.equal(passYear(e,p,2)?.id,next);
   choose(e,d,next,0);
   assert.equal(due(e,next),undefined);
 }
});
test('a boundary with Director Zhang returns after three years; outright escalation returns next year',()=>{
 for(const [choice,next,delay] of [[0,null,0],[1,'ent303',3],[2,'ent174',1]]){
  const {e,p,d}=setup();
  choose(e,d,'ent168',0);
  assert.equal(relation(e,'enemy_168'),-30);
  assert.equal(passYear(e,p,2)?.id,'ent173');
  choose(e,d,'ent173',choice);
  if(choice===0){
   assert.equal(e.resolveContact('enemy_168').enemy,false);
   assert.equal(due(e,'ent174'),undefined);
   continue;
  }
  assert.equal(due(e,next).dueAge,p.age+delay);
  if(delay>1)assert.notEqual(passYear(e,p,delay-1)?.id,next);
  assert.equal(passYear(e,p)?.id,next);
  if(choice===2){
   choose(e,d,'ent174',0);
   assert.ok(due(e,'ent286'),'official complaint can have a documented workplace retaliation');
   assert.equal(passYear(e,p)?.id,'ent286');
  }else{
   choose(e,d,'ent303',0);
   assert.ok(relation(e,'enemy_168')>-30,'professional cooperation must improve the actual contact');
  }
 }
});
test('Zhang report is not inherently proof of wrongdoing, and its reconciliation resolves real contact hostility',()=>{
 const{e,p,d}=setup();
 e.addEnemy({id:'enemy_111',name:'老张',position:'前同事'});
 const risk=e.getHidden().risk;
 e.applyEventEffects(d.events.find(x=>x.id==='ent169'));
 assert.equal(e.getHidden().risk,risk,'an unproven complaint must not be counted as bribery risk');
 assert.equal(due(e,'ent172').dueAge,p.age+1);
 assert.equal(passYear(e,p)?.id,'ent172');
 choose(e,d,'ent172',0);
 assert.ok(relation(e,'enemy_111')>=0);
 assert.equal(e.resolveContact('enemy_111').enemy,false);
});
test('mentor visit leads to an invitation, but decline does not invent a successful lecture',()=>{
 for(const choice of [0,1,2]){
  const{e,p,d}=setup();
  e.addContact({id:'mentor',name:'郑教授',relation:78,position:'高校教授'});
  e.applyEventEffects(d.events.find(x=>x.id==='ent175'));
  assert.equal(due(e,'ent176').dueAge,p.age+1);
  assert.equal(passYear(e,p)?.id,'ent176');
  choose(e,d,'ent176',choice);
  if(choice===1){
   assert.equal(due(e,'ent307'),undefined);
   continue;
  }
  assert.equal(passYear(e,p)?.id,'ent307');
  const dynamic=e.getLifePathEvent(d.events.find(x=>x.id==='ent307'));
  assert.match(dynamic.text,choice===0?/年轻研究员/:/准备不足|敷衍/);
  assert.equal(d.events.find(x=>x.id==='ent307').text.includes('研究员追着'),false,'dynamic text may not mutate shared templates');
  e.state.currentEvent=dynamic;
  e.handleEventChoice(0);
 }
});
test('mentor illness resolves to coherent nonfatal callbacks; not visiting does not magically cause death',()=>{
 for(const [choice,follow] of [[0,'ent182'],[1,'ent182'],[2,'ent183']]){
  const{e,p,d}=setup();
  e.addContact({id:'mentor',name:'郑教授',relation:85,position:'高校教授'});
  const original=e.resolveContact('mentor').relation;
  choose(e,d,'ent177',choice);
  assert.equal(due(e,follow).dueAge,p.age+2);
  assert.notEqual(passYear(e,p)?.id,follow);
  assert.equal(passYear(e,p)?.id,follow);
  assert.equal(d.events.find(x=>x.id==='ent183').title.includes('辞世'),false,'declining a visit must not automatically kill a person');
  e.applyEventEffects(d.events.find(x=>x.id===follow));
  assert.equal(due(e,'ent306').dueAge,p.age+3);
  const outcome=passYear(e,p,3);
  assert.equal(outcome?.id,'ent306');
  const dynamic=e.getLifePathEvent(outcome);
  assert.match(dynamic.text,choice===0?/病房/:choice===1?/电话/:/一拖再拖/);
  e.state.currentEvent=dynamic;e.handleEventChoice(1);
  assert.equal(due(e,'ent306'),undefined);
  assert.notEqual(e.resolveContact('mentor').relation,null);
 }
});
test('none of the later rival or mentor scenes can spawn randomly without real story history',()=>{
 const{e,d}=setup();
 const ids=['ent303','ent304','ent305','ent306','ent307','ent182','ent183'];
 for(const id of ids){
  const x=e.getEventVisibilityDiagnostics([id]).events[0];
  assert.equal(x.status,'ineligible',id);
  assert.ok(d.events.find(v=>v.id===id),id);
 }
});

test('the mentor has a real introduction and a choice not to form the connection',()=>{
 for(const choice of [0,1,2]){
  const{e,p,d}=setup();
  assert.equal(e.resolveContact('mentor'),null);
  choose(e,d,'ent308',choice);
  if(choice===2){assert.equal(e.resolveContact('mentor'),null);assert.equal(due(e,'ent175'),undefined);continue;}
  assert.ok(e.resolveContact('mentor'),'a conversation must add the named person to the relationship system');
  assert.equal(p.flags.mentorMet,true);
  assert.equal(due(e,'ent175').dueAge,p.age+1);
  assert.equal(passYear(e,p)?.id,'ent175');
  assert.equal(p.flags.mentorVisitMemory,true,'automatic reunion must record a real causal memory');
  assert.equal(passYear(e,p)?.id,'ent176');
  choose(e,d,'ent176',1);
  assert.equal(due(e,'ent307'),undefined,'declining the invitation must stop the lecture route');
 }
});
test('idle years can introduce a workplace rival or mentor without displacing earlier committed stories',()=>{
 const{e,p}=setup();
 p.age=32;p.yearsWorked=4;
 p.seenEvents.push('arc_receipt_1','arc_team_1','arc_life_career_1','arc_life_integrity_1','arc_life_network_1','e094','ent232');
 e.randf=()=>0.02;
 assert.equal(e._rcy_annualEventSelection().event?.id,'ent167');
 e.state.currentEvent=null;
 p.seenEvents.push('ent167');
 assert.equal(e._rcy_annualEventSelection().event?.id,'ent308');
 e.state.currentEvent=null;
 p.flags.wangDispute=true;p.flags.wangDispute_since=p.age;
 assert.equal(due(e,'ent285')?.dueAge,p.age+2,'committed old story has priority over new introductions');
});

test('an existing mentor relationship cannot be overwritten by an introductory meeting',()=>{
 const{e,p}=setup();
 e.addContact({id:'mentor',name:'郑教授',relation:90,position:'原先的导师'});
 const before=relation(e,'mentor');
 const x=e.getEventVisibilityDiagnostics(['ent308']).events[0];
 assert.equal(x.status,'ineligible');
 assert.ok(x.reasonCodes.includes('EXCLUDE_CONTACT'));
 assert.equal(relation(e,'mentor'),before);
});
