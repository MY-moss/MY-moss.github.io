import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import {resolve} from 'node:path';
const ROOT=resolve(import.meta.dirname,'..');
const index=readFileSync(resolve(ROOT,'index.html'),'utf8');
const js=[...index.matchAll(/<script defer src="([^"]+)/g)].map(m=>m[1].split('?')[0]).filter(s=>s.startsWith('js/data/')||s.startsWith('js/engine/')||s==='js/data.js'||s==='js/engine.js');
function game(){
  const db=new Map();
  const ctx={console,Date,Math,Set,Map,JSON,Number,String,Array,Object,Uint8Array,Int32Array,localStorage:{getItem:k=>db.get(k)||null,setItem:(k,v)=>db.set(k,String(v)),removeItem:k=>db.delete(k)},location:{origin:'http://localhost'},btoa:s=>Buffer.from(s,'binary').toString('base64'),atob:s=>Buffer.from(s,'base64').toString('binary'),escape,unescape,encodeURIComponent,decodeURIComponent};
  for(const f of js)runInNewContext(readFileSync(resolve(ROOT,f),'utf8'),ctx,{filename:f});
  runInNewContext('globalThis.Engine=GameEngine;globalThis.Data=GameData',ctx);
  const engine=new ctx.Engine();return {engine,data:ctx.Data,db};
}
function init(engine,data,age=30){const p=engine.getPlayer();p.name='回归';p.age=age;p.yearsWorked=age-22;p.gender='女';p.unit=data.units[0];p.unitLevel=0;p.leadershipRank=2;p.isEmployed=true;p.reputation=50;p.peopleReputation=50;p.seenEvents=p.seenEvents||[];engine.initFinance();engine.setPhase('career');return p;}
test('retirement window cannot discard an already selected narrative choice',()=>{
  const {engine,data}=game(),p=init(engine,data,55);const e=data.events.find(x=>x.id==='arc_classmate_open_2');
  p.flags.classmateOpen=true;p.flags.classmateOpen_since=50;
  engine.state.currentEvent=e;engine.randf=()=>0;engine.checkEndings();
  assert.equal(engine.state.currentEvent.id,e.id);
  assert.equal(p.flags.retireAsked,undefined);assert.ok(!p.ending);
});
test('rehire elder-line injection cannot overwrite annual decision',()=>{
  const {engine,data}=game(),p=init(engine,data,61);p.flags.rehired=true;p.flags.retireAsked=true;p.retireAgeExt=65;
  const e=data.events.find(x=>x.id==='arc_classmate_open_2');engine.state.currentEvent=e;engine.randf=()=>0;
  engine._rcy_specialEventInjection();assert.equal(engine.state.currentEvent.id,e.id);
});
test('leadership eligibility uses tenure since actual last promotion, not lifetime years minus promotions',()=>{
  const {engine,data}=game(),p=init(engine,data,42);p.leadershipRank=4;p.promotions=1;
  p.careerLog.push({year:41,event:'晋升为副科级',special:'upgrade'});
  const status=engine.getPromotionReadiness();
  assert.equal(status.yearsAtRank,1);assert.equal(status.minYears,3);
  assert.equal(status.eligible,false);assert.ok(status.blockers.some(x=>x.includes('还需')));
});
test('leadership eligibility is compatible with empty old career logs and rank limits',()=>{
  const {engine,data}=game(),p=init(engine,data,32);
  p.leadershipRank=2;p.careerLog=[];p.promotions=0;
  const status=engine.getPromotionReadiness();assert.equal(status.yearsAtRank,10);assert.equal(status.eligible,true);
  p.leadershipRank=engine.getMaxRankForLevel(p.unit.level);assert.equal(engine.getPromotionReadiness().eligible,false);
});
