import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import {resolve} from 'node:path';
const root=resolve(import.meta.dirname,'..');
const scripts=[...readFileSync(resolve(root,'index.html'),'utf8').matchAll(/<script defer src="([^"]+)/g)].map(x=>x[1].split('?')[0]);
function setup(){const db=new Map(),ctx={console,Math,Date,Array,Map,Set,Object,String,Number,JSON,Uint8Array,Int32Array,localStorage:{getItem:k=>db.get(k)??null,setItem:(k,v)=>db.set(k,String(v)),removeItem:k=>db.delete(k)},location:{origin:'http://localhost'},btoa:s=>Buffer.from(s,'binary').toString('base64'),atob:s=>Buffer.from(s,'base64').toString('binary'),escape,unescape,encodeURIComponent,decodeURIComponent};for(const file of scripts.filter(x=>x.startsWith('js/data/')||x==='js/data.js'||x.startsWith('js/engine/')||x==='js/engine.js'))runInNewContext(readFileSync(resolve(root,file),'utf8'),ctx,{filename:file});runInNewContext('globalThis.E=GameEngine;globalThis.D=GameData',ctx);return {e:new ctx.E(),d:ctx.D,db};}
function hired(e,d,age=35){const p=e.getPlayer();p.name='因果测试';p.age=age;p.yearsWorked=age-22;p.unit=d.units[0];p.unitLevel=0;p.isEmployed=true;p.leadershipRank=2;p.reputation=50;p.peopleReputation=50;e.initFinance();e.setPhase('career');return p;}
test('1807 events: crossroads crossover contains one origin, three intermediate, three final outcomes and one return echo',()=>{const {d}=setup();assert.equal(d.events.length,1807);assert.equal(new Set(d.events.map(x=>x.id)).size,d.events.length);for(const x of ['arc_crossroads_1','arc_crossroads_open_2','arc_crossroads_phase_2','arc_crossroads_seal_2','arc_crossroads_open_3','arc_crossroads_phase_3','arc_crossroads_seal_3','arc_crossroads_echo'])assert.ok(d.events.some(e=>e.id===x),x);});
test('crossroads requires prior receipt and team/classmate; adds distinct conditional dialogue and effects',()=>{const {e,d}=setup(),p=hired(e,d);assert.equal(e.getCrossroadsEvent(),null);p.flags.receiptQuiet=true;assert.equal(e.getCrossroadsEvent(),null);p.flags.teamShared=true;const first=e.getCrossroadsEvent();assert.ok(first);assert.match(first.text,/许砚/);assert.match(first.text,/内部协调/);p.flags.classmateFavor=true;p.flags.familyClinicAbsent=true;const changed=e.getCrossroadsEvent();assert.match(changed.text,/林默/);assert.match(changed.text,/伴侣/);assert.equal(changed.choices[2].effects.risk,first.choices[2].effects.risk+5);assert.ok(changed.choices[0].effects.familyPressure>first.choices[0].effects.familyPressure);});
test('three crossroads paths have different outcomes, keep the save, then reach their 2y and 5y callbacks',()=>{
 const {e,d}=setup();for(const [choice,route] of [[0,'open'],[1,'phase'],[2,'seal']]){
  e.reset();const p=hired(e,d,36);p.flags.receiptOpen=true;p.flags.teamDeferred=true;p.seenEvents.push('arc_receipt_open_2','arc_receipt_open_3','arc_team_deferred_2','arc_team_deferred_3');
  e.state.currentEvent=e.getCrossroadsEvent();assert.ok(e.state.currentEvent);e.handleEventChoice(choice);
  const flag='cross'+route[0].toUpperCase()+route.slice(1);assert.equal(p.flags[flag],true);assert.equal(p.flags[flag+'_since'],36);
  assert.ok(e.saveState(1));e.reset();assert.equal(e.loadState(1),true);
  let q=e.getPlayer();e.randf=()=>0.999;q.age+=2;q.yearsWorked+=2;
  e._rcy_annualEventSelection();assert.equal(e.state.currentEvent?.id,'arc_crossroads_'+route+'_2');e.handleEventChoice(0);
  assert.equal(q.flags[flag+'Reviewed'],true);q.age+=3;q.yearsWorked+=3;
  e._rcy_annualEventSelection();assert.equal(e.state.currentEvent?.id,'arc_crossroads_'+route+'_3');e.handleEventChoice(0);
  assert.equal(q.flags.crossResolved,true);assert.ok(q.careerLog.some(x=>x.event.includes('五年后')));
  q.age+=2;q.yearsWorked+=2;e._rcy_annualEventSelection();
  assert.equal(e.state.currentEvent?.id,'arc_crossroads_echo');e.handleEventChoice(0);
  assert.equal(q.flags.crossLegacyTeaching,true);
  assert.equal(q.seenEvents.includes('arc_crossroads_echo'),true);
 }
});
test('crossroads is not scheduled when unrelated, and never overrides older due event chains',()=>{const {e,d}=setup(),p=hired(e,d,35);e.randf=()=>0;p.flags.receiptOpen=true;p.flags.receiptOpen_since=29;p.flags.teamShared=true;p.flags.teamShared_since=30;e._rcy_annualEventSelection();assert.equal(e.state.currentEvent?.id,'arc_receipt_open_2');assert.equal(p.flags.crossOpen,undefined);});
test('gold has bounded upside and loss and deposit is exactly 10+1; effects do not create money repeatedly',()=>{const {e,d}=setup(),p=hired(e,d);let r=0.01;e.randf=()=>r;e.cashIn(200);let before=p.wealth;p.flags.goldHeld=true;e._rcy_annualResetAndAssets();assert.equal(p.flags.goldHeld,undefined);assert.ok(p.wealth>=before+60);r=0.99;before=p.wealth;p.flags.goldHeld=true;e._rcy_annualResetAndAssets();assert.ok(p.wealth>=before+84);p.flags.savingDeposit=true;before=p.wealth;e._rcy_annualResetAndAssets();assert.ok(p.wealth>=before+11);assert.equal(p.flags.savingDeposit,undefined);});
