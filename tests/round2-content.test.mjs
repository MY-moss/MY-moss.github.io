import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import {resolve} from 'node:path';
const ROOT=resolve(import.meta.dirname,'..');
const index=readFileSync(resolve(ROOT,'index.html'),'utf8');
const scriptFiles=[...index.matchAll(/<script defer src="([^"]+)/g)].map(m=>m[1].split('?')[0]);
function setup(){
 const db=new Map(),ctx={console,Math,Date,Map,Set,JSON,Number,Array,Object,String,Uint8Array,Int32Array,location:{origin:'http://localhost'},localStorage:{getItem:key=>db.get(key)||null,setItem:(key,value)=>db.set(key,String(value)),removeItem:key=>db.delete(key)},btoa:s=>Buffer.from(s,'binary').toString('base64'),atob:s=>Buffer.from(s,'base64').toString('binary'),unescape,escape,decodeURIComponent,encodeURIComponent};
 for(const f of scriptFiles.filter(p=>p.startsWith('js/data/')||p==='js/data.js'||p.startsWith('js/engine/')||p==='js/engine.js'))runInNewContext(readFileSync(resolve(ROOT,f),'utf8'),ctx,{filename:f});
 runInNewContext('globalThis.Ctor=GameEngine;globalThis.Data=GameData',ctx);
 return {e:new ctx.Ctor(),data:ctx.Data,db};
}
function hired(e,data,age=30){const p=e.getPlayer();p.name='测试';p.unit=data.units[0];p.unitLevel=0;p.isEmployed=true;p.age=age;p.yearsWorked=age-22;p.leadershipRank=1;p.reputation=50;p.peopleReputation=50;e.initFinance();e.setPhase('career');return p;}
const removed=['e275','e276','e278','e279','e282','e283','enc026','enc027','enc033','enc039','enc040','enl173','enl174','enl186','enl191','enl192','enl193','enl196','enl200','enl206'];
test('pruned low-value and unanchored historical events are absent and referenced anchors retained',()=>{
 const {data}=setup(),map=new Map(data.events.map(x=>[x.id,x]));
 assert.equal(data.events.length,1799);
 assert.equal(new Set(map.keys()).size,data.events.length);
 for(const id of removed)assert.equal(map.has(id),false,id);
 for(const id of ['e051','e071','e110','e237','ent293','ent299','arc_receipt_1','arc_team_1','arc_family_1'])assert.equal(map.has(id),true,id);
});
test('all choice events have at least 2 choices, nonempty effects, and distinct mechanical outcomes',()=>{
 const {data}=setup();
 for(const ev of data.events.filter(e=>e.eventType==='choice')){
  assert.ok(ev.choices.length>=2,ev.id);
  for(const c of ev.choices)assert.ok(Object.values(c.effects||{}).some(x=>x!==0&&x!==null&&x!==false),ev.id+': '+c.text);
  const signatures=ev.choices.map(c=>JSON.stringify(Object.entries(c.effects||{}).sort((a,b)=>a[0].localeCompare(b[0]))));
  assert.equal(new Set(signatures).size,signatures.length,'duplicate effects '+ev.id);
 }
});
test('second bribery approach requires a prior refused bribe, not a fresh player',()=>{
 const {e,data}=setup();const p=hired(e,data);
 const ev=data.events.find(x=>x.id==='e071');assert.equal(ev.requireFlag,'refusedBribe');
 assert.equal(ev.choices.length,4);
 assert.equal(p.flags.refusedBribe,undefined);
 e.state.currentEvent=ev;e.handleEventChoice(0);
 assert.equal(p.flags.refusedBribe,true);assert.ok(p.careerLog.some(x=>x.event.includes('纪检备案')));
});
test('family events are excluded until child and adulthood requirements are met',()=>{
 const {e,data}=setup();const p=hired(e,data,47);
 for(const id of ['enl197','enl198','enl210','enl177']){
  const v=data.events.find(x=>x.id===id);assert.equal(v.requireChild,true,id);
 }
 assert.equal(data.events.find(x=>x.id==='enl197').requireChildAgeMin,18);
 assert.equal(data.events.find(x=>x.id==='enl198').requireChildAgeMin,20);
 assert.equal(data.events.find(x=>x.id==='enl177').requireChildAgeMin,18);
 assert.ok(p);
});
test('team storyline supports two different routes and delayed endings; all choices yield resumable save',()=>{
 const {e,data}=setup(),start=data.events.find(x=>x.id==='arc_team_1');
 for(const [i,route] of [[0,'shared'],[1,'deferred']]){
  e.reset();const p=hired(e,data,29);e.state.currentEvent=start;e.handleEventChoice(i);
  assert.equal(p.flags[i?'teamDeferred':'teamShared'],true);
  assert.ok(p.contacts.some(x=>x.id==='arc_xuyan'));
  assert.ok(e.saveState(1));assert.equal(e.loadState(1),true);
  const pp=e.getPlayer();assert.ok(pp.careerLog.some(x=>x.event.includes('交接本上的空格')));
  pp.age+=2;pp.yearsWorked+=2;
  const second=data.events.find(x=>x.id===`arc_team_${route}_2`);assert.ok(second);
  e.state.currentEvent=second;e.handleEventChoice(0);
  assert.equal(pp.flags[i?'teamDeferredFollowed':'teamSharedFollowed'],true);
  pp.age+=3;pp.yearsWorked+=3;
  const last=data.events.find(x=>x.id===`arc_team_${route}_3`);assert.ok(last);e.state.currentEvent=last;
  e.handleEventChoice(1);assert.ok(pp.careerLog.some(x=>x.event.includes('五年后')));
 }
});
test('partner health storyline changes the tradeoff and remains compatible with existing saves',()=>{
 const {e,data}=setup();const start=data.events.find(x=>x.id==='arc_family_1');
 assert.equal(start.requireMarried,true);
 for(const [i,ending] of [[0,'present'],[1,'absent']]){
  e.reset();const p=hired(e,data,36);p.isMarried=true;
  e.getHidden().familyPressure=18;const before=e.getHidden().familyPressure;
  e.state.currentEvent=start;e.handleEventChoice(i);
  assert.equal(p.flags[i?'familyClinicAbsent':'familyClinicPresent'],true);
  assert.notEqual(e.getHidden().familyPressure,before);
  p.age+=2;p.yearsWorked+=2;
  const next=data.events.find(x=>x.id===`arc_family_${ending}_2`);
  assert.ok(next);e.state.currentEvent=next;e.handleEventChoice(0);
  assert.equal(p.flags.familyClinicResolved,true);
  assert.ok(e.saveState(2));e.reset();assert.equal(e.loadState(2),true);
  assert.equal(e.getPlayer().flags.familyClinicResolved,true);
 }
});
test('result prose from existing events becomes an immediate career-log consequence',()=>{
 const {e,data}=setup();const p=hired(e,data);const event=data.events.find(x=>x.id==='enl194');
 assert.ok(event.choices.some(c=>c.result));e.state.currentEvent=event;
 const expected=event.choices[0].result;
 e.handleEventChoice(0);
 assert.ok(p.careerLog.some(x=>x.event.includes(expected)));
});
