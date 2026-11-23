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

test('the qualification result is impossible without submitting an application',()=>{
  const {e,p,d}=setup();
  assert.equal(eligible(e,'enw246'),false,'unearned qualification must not be in the random pool');
  choose(e,d,'enw245',3);
  assert.equal(p.flags.qualificationApplied,undefined);
  assert.equal(hasDue(e,'enw246'),false);
  for(const choice of [0,1,2]){
    const x=setup();
    const before=x.p.wealth;
    choose(x.e,x.d,'enw245',choice);
    assert.equal(x.p.flags.qualificationApplied,true);
    const due=x.e.getPendingCausalConsequences().find(item=>item.id==='enw246');
    assert.equal(due.dueAge,x.p.age+1);
    assert.equal(advance(x.e,x.p)?.id,'enw246');
    assert.equal(x.p.flags.qualificationRecognized,undefined,'submitting a review must not automatically award the qualification');
    choose(x.e,x.d,'enw246',choice);
    assert.equal(x.p.flags.qualificationRecognized,choice===2?undefined:true,'followup choice has a real outcome');
    assert.equal(x.p.wealth,before,'ordinary civil-service review must not invent a new stipend');
    assert.equal(hasDue(x.e,'enw246'),false,'earned review may only fire once');
  }
});

test('the open and quiet appointment review routes remain distinct and reunite in a non-guaranteed assessment',()=>{
  for(const reviewChoice of [0,1,2,3]){
    const {e,p,d}=setup();
    const originalRank=p.leadershipRank;
    assert.equal(eligible(e,'enc125'),false,'a second interview must await the first');
    choose(e,d,'enc117',reviewChoice);
    assert.ok(hasDue(e,'enc125'));
    assert.equal(advance(e,p)?.id,'enc125');
    choose(e,d,'enc125',reviewChoice);
    assert.equal(advance(e,p)?.id,'enc126');
    choose(e,d,'enc126',reviewChoice);
    const follow=reviewChoice<=1?'enc127':'enc140';
    const blocked=reviewChoice<=1?'enc140':'enc127';
    assert.ok(hasDue(e,follow));
    assert.ok(!hasDue(e,blocked));
    assert.equal(advance(e,p)?.id,follow);
    choose(e,d,follow,reviewChoice<=1?0:2);
    assert.ok(hasDue(e,'enc128'));
    assert.equal(advance(e,p)?.id,'enc128');
    choose(e,d,'enc128',reviewChoice%4);
    assert.equal(p.leadershipRank,originalRank,'review cannot magically promote without a real promotion check');
    assert.ok(!hasDue(e,'enc128'));
  }
});

test('quiet inquiry imposes a measurable integrity and risk opportunity cost',()=>{
  const open=setup(),quiet=setup();
  for(const x of [open,quiet]){
    choose(x.e,x.d,'enc117',0);advance(x.e,x.p);
    choose(x.e,x.d,'enc125',0);advance(x.e,x.p);
  }
  choose(open.e,open.d,'enc126',0);
  choose(quiet.e,quiet.d,'enc126',3);
  advance(open.e,open.p);advance(quiet.e,quiet.p);
  choose(open.e,open.d,'enc127',0);
  choose(quiet.e,quiet.d,'enc140',2);
  assert.ok(quiet.e.getHidden().risk>open.e.getHidden().risk,'concealment should add risk');
  assert.ok(quiet.e.getHidden().integrity<open.e.getHidden().integrity,'concealment should reduce integrity');
});

test('shared family caregiving produces a two-year coordination crisis and a later life echo',()=>{
  for(const response of [0,1,2]){
    const {e,p,d}=setup({age:52,rank:4,yearsWorked:28});
    e.cashIn(50);
    choose(e,d,'ent293',0);
    assert.equal(advance(e,p)?.id,'ent294');
    choose(e,d,'ent294',2);
    assert.equal(p.flags.parentShared,true);
    assert.equal(p.flags.parentCaring,undefined);
    assert.equal(hasDue(e,'ent295'),false);
    assert.ok(hasDue(e,'enl215'));
    assert.notEqual(advance(e,p)?.id,'enl215','shared-care scheduling must not mature after one year');
    assert.equal(advance(e,p)?.id,'enl215');
    const before=p.wealth;
    choose(e,d,'enl215',response);
    assert.equal(p.flags.parentCareReviewed,true);
    if(response===1)assert.ok(p.wealth<before);
    assert.equal(e.getPendingCausalConsequences().find(item=>item.id==='enl216').dueAge,p.age+3);
    assert.notEqual(advance(e,p,2)?.id,'enl216');
    assert.equal(advance(e,p)?.id,'enl216');
    choose(e,d,'enl216',0);
    assert.equal(hasDue(e,'enl216'),false);
  }
});

test('direct and professional care routes retain their original flags while unlocking the five-year callback',()=>{
  for(const [choice,finalChoice,originalFlag] of [[0,0,'parentRecovered'],[0,1,'parentLongTerm'],[1,0,'parentRecovered'],[1,1,'parentLongTerm']]){
    const {e,p,d}=setup({age:53,rank:4,yearsWorked:29});
    e.cashIn(80);
    choose(e,d,'ent293',1);
    assert.equal(advance(e,p)?.id,'ent294');
    choose(e,d,'ent294',choice);
    assert.equal(advance(e,p,2)?.id,'ent295');
    choose(e,d,'ent295',finalChoice);
    assert.equal(p.flags[originalFlag],true,'new follow-up must preserve the old save flag');
    assert.equal(p.flags.parentCareReviewed,true);
    assert.equal(advance(e,p,3)?.id,'enl216');
  }
});

test('youth secondment actually posts to a township and schedules the next field scene',()=>{
  for(const choice of [0,1,2,3]){
    const {e,p,d}=setup({age:26,rank:2,yearsWorked:2});
    const oldUnitId=p.unit.id;
    assert.equal(eligible(e,'enw249'),false);
    assert.equal(eligible(e,'enw248'),true);
    choose(e,d,'enw248',choice);
    if(choice===0){
      assert.equal(p.flags.selectedVillage,true);
      assert.equal(p.flags.grassrootsActive,true);
      assert.equal(p.flags.grassrootsDuration,2);
      assert.notEqual(p.unit.id,oldUnitId);
      assert.equal(p.unitLevel,0);
      assert.ok(hasDue(e,'enw249'));
      assert.equal(advance(e,p)?.id,'enw249');
      choose(e,d,'enw249',0);
      assert.equal(hasDue(e,'enw249'),false);
    }else{
      assert.equal(p.flags.selectedVillage,undefined);
      assert.equal(p.flags.grassrootsActive,undefined);
      assert.equal(p.unit.id,oldUnitId);
      assert.equal(hasDue(e,'enw249'),false);
    }
  }
});

test('youth selection and cadre followup gates prevent random accidental spoilers',()=>{
  const {e,p}=setup({age:27,rank:5,yearsWorked:5});
  assert.equal(eligible(e,'enw248'),false,'senior cadres are not newly selected youth cadres');
  for(const id of ['enc125','enc126','enc127','enc128','enc140','enl215','enl216']){
    assert.equal(eligible(e,id),false,id+' may not appear without story prerequisites');
  }
  p.leadershipRank=2;p.age=36;
  assert.equal(eligible(e,'enw248'),false,'the youth assignment has a bounded age window');
});
