import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import {resolve} from 'node:path';
const dir=resolve(import.meta.dirname,'..'),page=readFileSync(resolve(dir,'index.html'),'utf8');
const scripts=[...page.matchAll(/<script defer src="([^"]+)/g)].map(x=>x[1].split('?')[0]);
function setup(){
 const store=new Map();const ctx={console,Date,Math,Set,Map,JSON,Array,Object,String,Number,Uint8Array,Int32Array,location:{origin:'http://localhost'},localStorage:{getItem:k=>store.get(k)??null,setItem:(k,v)=>store.set(k,String(v)),removeItem:k=>store.delete(k)},btoa:s=>Buffer.from(s,'binary').toString('base64'),atob:s=>Buffer.from(s,'base64').toString('binary'),escape,unescape,encodeURIComponent,decodeURIComponent};
 for(const f of scripts.filter(f=>f.startsWith('js/data/')||f==='js/data.js'||f.startsWith('js/engine/')||f==='js/engine.js'))runInNewContext(readFileSync(resolve(dir,f),'utf8'),ctx,{filename:f});
 runInNewContext('globalThis.Eng=GameEngine;globalThis.Data=GameData',ctx);
 return {e:new ctx.Eng(),d:ctx.Data,store};
}
function employed(e,d,age=29){const p=e.getPlayer();p.name='路径测试';p.unit=d.units[0];p.unitLevel=0;p.isEmployed=true;p.age=age;p.yearsWorked=age-22;p.leadershipRank=1;p.reputation=50;p.peopleReputation=50;p.political='mass';e.initFinance();e.setPhase('career');return p;}
test('all 1807 event IDs are unique and six excessive choice scenes have concise meaningful decisions',()=>{
 const {d}=setup();assert.equal(d.events.length,1807);assert.equal(new Set(d.events.map(x=>x.id)).size,d.events.length);
 for(const id of ['e018','e093','e094','e237','e257','e663']){const v=d.events.find(x=>x.id===id);assert.ok(v, id);assert.ok(v.choices.length<=5&&v.choices.length>=3,id)}
 for(const id of ['e134','e176'])assert.equal(d.events.some(x=>x.id===id),false);
});
test('event narrative audit has no empty effects, too-short decisions or short scenes at configured thresholds',()=>{
 const {d}=setup();for(const ev of d.events){assert.ok((ev.text||'').length>=33,ev.id+' scene');if(ev.eventType==='choice'){
  assert.ok(ev.choices.length>=2&&ev.choices.length<=5,ev.id);
  for(const c of ev.choices){assert.ok(c.text.length>=6,ev.id+' choice '+c.text);assert.ok(Object.values(c.effects||{}).some(v=>v!==0&&v!==null&&v!==false),ev.id+' no effects')}
 }}
});
test('three old-classmate strategies each lead to a unique 2-year and 5-year continuation',()=>{
 const {e,d}=setup();const entry=d.events.find(v=>v.id==='e094');
 const paths=[['classmateOpen','open'],['classmateFavor','favor'],['classmateBoundaries','boundary']];
 for(let choice=0;choice<paths.length;choice++){
  e.reset();let p=employed(e,d,29);e.getHidden().background=choice===1?55:12;e.randf=()=>0.999;
  e.state.currentEvent=entry;assert.notEqual(e.handleEventChoice(choice),false);
  const [flag,route]=paths[choice];assert.equal(p.flags[flag],true);assert.ok(p.contacts.some(x=>x.id==='oldClassmate'));
  assert.ok(e.saveState(1));e.reset();assert.equal(e.loadState(1),true);p=e.getPlayer();e.randf=()=>0.999;
  p.age+=2;p.yearsWorked+=2;
  e._rcy_annualEventSelection();assert.equal(e.state.currentEvent?.id,`arc_classmate_${route}_2`);
  e.handleEventChoice(0);assert.ok(e.saveState(1));
  p.age+=3;p.yearsWorked+=3;
  e._rcy_annualEventSelection();assert.equal(e.state.currentEvent?.id,`arc_classmate_${route}_3`);
  e.handleEventChoice(0);
  assert.ok(p.careerLog.some(x=>x.event.includes('五年后')));
  assert.equal(p.seenEvents.includes(`arc_classmate_${route}_3`),true);
 }
});
test('already-due causal chain is not replaced by a newly drawn event entry',()=>{
 const {e,d}=setup();const p=employed(e,d,34);
 p.flags.teamShared=true;p.flags.teamShared_since=30;p.yearsWorked=11;
 e.randf=()=>0;
 e._rcy_annualEventSelection();
 assert.equal(e.state.currentEvent?.id,'arc_team_shared_2');
 assert.equal(p.flags.classmateOpen,undefined);
});
test('old save from older version can resume a pending event and migrate new chain timestamp',()=>{
 const {e,d,store}=setup();let p=employed(e,d,34);
 p.flags.classmateOpen=true;p.flags.classmateOpen_since=undefined;
 e.state.currentEvent=d.events.find(v=>v.id==='arc_classmate_open_2');
 e.saveState(2);
 const saved=JSON.parse(store.get('shangan_save_2'));delete saved.player.flags.classmateOpen_since;
 store.set('shangan_save_2',JSON.stringify(saved));e.reset();assert.equal(e.loadState(2),true);
 assert.equal(e.state.currentEvent.id,'arc_classmate_open_2');
 assert.equal(e.getPlayer().flags.classmateOpen_since,34);
});
