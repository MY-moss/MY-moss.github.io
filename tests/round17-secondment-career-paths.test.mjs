import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import {resolve} from 'node:path';
const root=resolve(import.meta.dirname,'..');
const scripts=[...readFileSync(resolve(root,'index.html'),'utf8').matchAll(/<script defer src="([^"]+)/g)].map(x=>x[1].split('?')[0]).filter(f=>f.startsWith('js/data/')||f==='js/data.js'||f.startsWith('js/engine/')||f==='js/engine.js');
function setup(){const db=new Map(),ctx={console,Math,Date,Array,Map,Set,Object,String,Number,JSON,Uint8Array,Int32Array,localStorage:{getItem:k=>db.get(k)??null,setItem:(k,v)=>db.set(k,String(v)),removeItem:k=>db.delete(k)},location:{origin:'http://localhost'},btoa:s=>Buffer.from(s,'binary').toString('base64'),atob:s=>Buffer.from(s,'base64').toString('binary'),escape,unescape,encodeURIComponent,decodeURIComponent};for(const file of scripts)runInNewContext(readFileSync(resolve(root,file),'utf8'),ctx,{filename:file});runInNewContext('globalThis.E=GameEngine;globalThis.D=GameData',ctx);const e=new ctx.E(),p=e.getPlayer();p.name='借调路线测试';p.age=35;p.yearsWorked=10;p.unit=ctx.D.units.find(u=>u.level==='市级');p.unitLevel=2;p.isEmployed=true;p.leadershipRank=3;p.reputation=50;p.peopleReputation=50;e.initFinance();e.setPhase('career');e.rand=()=>0;e.randf=()=>0.999;return{e,p,d:ctx.D};}
function choose(e,d,id,index){e.state.currentEvent=d.events.find(x=>x.id===id);assert.ok(e.state.currentEvent,id);e.handleEventChoice(index);}
function advance(e,p){p.age+=1;p.yearsWorked+=1;e.state.currentEvent=null;return e._rcy_annualEventSelection().event;}
function pending(e,id){return e.getPendingCausalConsequences().some(x=>x.id===id);}
test('all accepted formal secondment entry points converge on the same assessment chain',()=>{for(const [id,choices] of [['enc005',[0]],['enc006',[0,2]],['e706',[1,3]]])for(const choice of choices){const{e,p,d}=setup();choose(e,d,id,choice);assert.equal(p.flags.seconded,true,id+' choice '+choice);assert.ok(pending(e,'ent300'));assert.equal(advance(e,p)?.id,'ent300');}});
test('declining or postponing secondment does not start the assessment chain',()=>{for(const [id,choice] of [['enc005',1],['enc005',2],['enc006',1],['e706',2]]){const{e,p,d}=setup();choose(e,d,id,choice);assert.equal(p.flags.seconded,undefined,id+' choice '+choice);assert.ok(!pending(e,'ent300'));}});
test('grassroots choice from the multi-route挂职 event still dispatches to a real local unit',()=>{const{e,p,d}=setup();choose(e,d,'e706',0);assert.equal(p.flags.grassrootsActive,true);assert.ok(['乡镇','街道'].includes(p.unit.level));});
test('duplicate secondment invitations are blocked once a route is active',()=>{const{e,p}=setup();p.flags.seconded=true;const rows=e.getEventVisibilityDiagnostics(['enc005','enc006','e706']).events;assert.ok(rows.every(x=>x.status==='ineligible'||x.status==='seen'),JSON.stringify(rows));});
