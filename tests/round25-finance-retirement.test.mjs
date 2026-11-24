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

test('annual debt settlement conserves wealth minus actual interest',()=>{
 const {e,p}=setup();e.cashIn(20);e.addDebt('personal',10);
 const before=p.wealth;const r=e.settleDebtInterest(p.finance,{forcedRepay:true,repaySalaryDelta:25});
 assert.equal(r.forcedPaid,10);assert.equal(r.interestPaid,1);assert.equal(p.finance.cash,9);assert.equal(e.debtTotal(),0);assert.equal(p.wealth,before-1);
});
test('unpaid interest is visible, noncompounding and repaid before principal',()=>{
 for(const forcedRepay of [true,false]){
  const {e,p}=setup();e.addDebt('online',100);e.settleDebtInterest(p.finance,{forcedRepay,repaySalaryDelta:0});
  assert.equal(e.debtTotal(),112);assert.equal(p.finance.debts[0].principal,105);assert.equal(p.finance.debts[0].unpaidInterest,7);
  e.cashIn(200);e.payDebt(7);assert.equal(e.debtTotal(),105);assert.equal(p.finance.debts[0].principal,105);assert.equal(p.finance.debts[0].unpaidInterest,0);
  e.payDebt(105);assert.equal(p.finance.cash,88);assert.equal(e.debtTotal(),0);
 }
});
test('legacy interest survives ledger initialization, repayment and selective forgiveness',()=>{
 const {e,p}=setup();p.finance={cash:20,debts:[{type:'online',principal:30,rate:0.12,unpaidInterest:8},{type:'personal',principal:4,rate:0.1,unpaidInterest:2}]};e.initFinance();
 assert.equal(e.debtTotal(),44);assert.equal(p.wealth,-24);e.payDebtByForgive(8);assert.equal(e.debtTypeTotal('online'),30);assert.equal(e.debtTypeTotal('personal'),6);e.settleBorrowDebt('personal');assert.equal(p.finance.cash,14);assert.equal(e.debtTotal(),30);
});
test('100 debt cases conserve wealth and preserve a recovery path under positive cash flow',()=>{
 for(let i=1;i<=100;i++){
  const {e,p}=setup();e.addDebt('online',i);e.addDebt('personal',i%17);e.cashIn(i%12);
  const before=p.wealth;const r=e.settleDebtInterest(p.finance,{forcedRepay:true,repaySalaryDelta:18});
  assert.equal(p.wealth,before-r.accruedInterest);assert.ok(p.finance.cash>=0);
  for(let y=0;y<25&&e.debtTotal()>0;y++){e.cashIn(20);e.settleDebtInterest(p.finance,{forcedRepay:true,repaySalaryDelta:20});}
  assert.equal(e.debtTotal(),0,'recoverable debt '+i);
 }
});
test('rest year resets finance actions and settles assets once, not passive salary',()=>{
 const {e,p}=setup();e.cashIn(100);p.flags.savingDeposit=true;p.flags.goldHeld=true;p.flags.financeUsed=1;p.flags.giftUsed=1;p.flags.childRaiseUsed=1;p.flags.financeOptions=['save'];
 const before=p.finance.cash;assert.equal(e.restYear(),true);assert.equal(p.flags.savingDeposit,undefined);assert.equal(p.flags.goldHeld,undefined);assert.equal(p.flags.financeUsed,0);assert.equal(p.flags.childRaiseUsed,0);assert.equal(p.flags.financeOptions,undefined);assert.equal(p.flags.giftUsed,0);
 const expense=e.computeLivingExpense({...p,finance:{cash:before+95}});assert.equal(p.finance.cash,before+95-expense);
});
test('retirement at extension end preserves active narrative choice and then resolves',()=>{
 const {e,p,d}=setup({age:63});p.gender='男';p.retireAgeExt=63;p.flags.retireAsked=true;
 p.flags.familyClinicResolved=true;p.flags.familyClinicResolved_since=60;e.getHidden().risk=0;e.getHidden().mentalPressure=20;
 e.state.currentEvent=e.getLifePathEvent(d.events.find(x=>x.id==='arc_family_clinic_3'));e.checkEndings();assert.ok(!p.ending);assert.equal(e.state.currentEvent.id,'arc_family_clinic_3');assert.equal(e.restYear(),false);e.handleEventChoice(0);assert.ok(p.ending);assert.equal(p.deathReason,'retired');assert.ok(p.seenEvents.includes('arc_family_clinic_3'));
});
test('accepting or declining actual rehire is processed before terminal retirement check',()=>{
 for(const choice of [0,1,2,3,4]){
  const {e,p,d}=setup({age:60});p.gender='男';e.getHidden().risk=0;e.getHidden().mentalPressure=20;p.flags.retireAsked=true;
  choose(e,d,'e110',choice);
  if([1,3].includes(choice)){assert.ok(p.ending);assert.equal(p.deathReason,'retired');}
  else {assert.ok(!p.ending);assert.equal(p.retireAgeExt,63);assert.equal(p.flags.rehired,true);}
 }
});
test('rehire invitation cannot be randomly encountered before retirement',()=>{
 const {e,p}=setup({age:52});p.gender='男';assert.equal(eligible(e,'e110'),false);
 p.age=60;let rolls=0;e.randf=()=>{rolls++;return 0.99;};e.checkEndings();e.checkEndings();assert.equal(rolls,1);assert.ok(!p.ending);
});
test('life evaluation is deterministic, bounded, read-only, and labels unfinished stories',()=>{
 const {e,p}=setup();p.flags.familyClinicResolved=true;p.flags.familyClinicResolved_since=p.age;p.flags.mortgageCleared=true;
 const before=JSON.stringify(e.state);const r=e.getLifeEvaluation();assert.equal(r.dimensions.length,6);assert.ok(r.dimensions.every(d=>Number.isFinite(d.score)&&d.score>=0&&d.score<=100));assert.ok(r.unfinished.some(x=>x.id==='arc_family_clinic_3'));assert.ok(r.memories.some(x=>x.includes('贷款')));assert.equal(JSON.stringify(e.state),before);assert.equal(JSON.stringify(r),JSON.stringify(e.getLifeEvaluation()));
});
