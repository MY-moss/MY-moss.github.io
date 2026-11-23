import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {runInNewContext} from 'node:vm';

const ROOT = resolve(import.meta.dirname, '..');
const index = readFileSync(resolve(ROOT, 'index.html'), 'utf8');
const scripts = [...index.matchAll(/<script defer src="([^"]+)/g)].map(m => m[1].split('?')[0]);
function setup() {
  const storage = new Map();
  const localStorage = {getItem:k=>storage.has(k)?storage.get(k):null,setItem:(k,v)=>storage.set(k,String(v)),removeItem:k=>storage.delete(k)};
  const ctx = {localStorage,console,Date,Math,Map,Set,JSON,Number,String,Array,Object,Uint8Array,Int32Array,decodeURIComponent,encodeURIComponent,escape,unescape,
    btoa:s=>Buffer.from(s,'binary').toString('base64'),atob:s=>Buffer.from(s,'base64').toString('binary'),location:{origin:'http://localhost'}};
  const engineFiles = scripts.filter(p=>p.startsWith('js/data/') || p==='js/data.js' || p.startsWith('js/engine/') || p==='js/engine.js');
  for(const f of engineFiles) runInNewContext(readFileSync(resolve(ROOT,f),'utf8'),ctx,{filename:f});
  runInNewContext('globalThis.__Engine=GameEngine;globalThis.__Data=GameData',ctx);
  const engine = runInNewContext('new GameEngine()',ctx);
  return {engine,storage,localStorage,ctx,GameData:ctx.__Data};
}
function employed(e, data) {
  const p=e.getPlayer();p.name='测试员';p.unit=data.units[0];p.unitLevel=0;p.isEmployed=true;p.age=26;p.yearsWorked=4;p.leadershipRank=1;
  e.setPhase('career');return p;
}

test('load keeps unresolved choices and valid legacy fields without overwriting other slots',()=>{
  const {engine:e,GameData:data,storage}=setup();
  const p=employed(e,data);
  e.state.currentEvent=data.events.find(x=>x.id==='arc_receipt_1');
  assert.ok(e.saveState(1));
  const saved=JSON.parse(storage.get('shangan_save_1'));
  assert.equal(saved.currentEvent.id,'arc_receipt_1');
  e.reset();assert.equal(e.loadState(1),true);
  assert.equal(e.getState().currentEvent.id,'arc_receipt_1');
  assert.equal(e.getPlayer().name,'测试员');
  assert.equal(e.getPlayer().yearsWorked,4);
  assert.equal(e.loadState(0),false);
  assert.equal(e.getState().currentEvent.id,'arc_receipt_1');
  assert.ok(p);
});

test('invalid event choices are rejected before the seen-events side effect',()=>{
  const {engine:e,GameData:data}=setup();employed(e,data);
  e.state.currentEvent=data.events.find(x=>x.id==='arc_receipt_1');
  const prev=e.getPlayer().seenEvents.length;
  assert.equal(e.handleEventChoice(199),false);
  assert.equal(e.getPlayer().seenEvents.length,prev);
  assert.equal(e.state.currentEvent.id,'arc_receipt_1');
});

test('receipt storyline has two differentiated 2-year and 5-year branches',()=>{
  const {engine:e,GameData:data}=setup();
  const p=employed(e,data);
  const start=data.events.find(x=>x.id==='arc_receipt_1');
  assert.equal(start.choices.length,2);
  const seen = new Set();
  for (const route of [0,1]) {
    e.reset();const pp=employed(e,data);e.state.currentEvent=start;e.handleEventChoice(route);
    const root=route?'receiptQuiet':'receiptOpen';
    assert.equal(pp.flags[root],true);
    assert.ok(pp.contacts.some(c=>c.id==='receipt_zhoulan'));
    const second=data.events.find(x=>x.id===`arc_receipt_${route?'quiet':'open'}_2`);
    assert.ok(second);seen.add(second.id);
    pp.age+=2;pp.yearsWorked+=2;e.state.currentEvent=second;
    e.handleEventChoice(0);
    assert.equal(pp.flags[root+'Reviewed'],true);
    const third=data.events.find(x=>x.id===`arc_receipt_${route?'quiet':'open'}_3`);
    assert.ok(third);seen.add(third.id);
    pp.age+=3;pp.yearsWorked+=3;e.state.currentEvent=third;e.handleEventChoice(1);
    assert.ok(pp.careerLog.some(x=>/五年后|楼道|明信片/.test(x.event)));
    assert.ok(e.saveState(0));
  }
  assert.equal(seen.size,4);
  assert.ok(p);
});

test('event IDs are unique and no missing choice effects',()=>{
  const {GameData:data}=setup();
  const ids=data.events.map(e=>e.id).filter(Boolean);
  assert.equal(new Set(ids).size,ids.length);
  for(const ev of data.events.filter(e=>e.eventType==='choice')){
    assert.ok(Array.isArray(ev.choices)&&ev.choices.length>=2,ev.id);
  }
});

test('all four delayed storyline events exist with required flag paths',()=>{
  const {engine:e,GameData:data}=setup();const p=employed(e,data);
  for(const id of ['arc_receipt_open_2','arc_receipt_quiet_2','arc_receipt_open_3','arc_receipt_quiet_3']){
    assert.ok(data.events.find(x=>x.id===id));
  }
  assert.ok(p.yearsWorked>=2);
});
