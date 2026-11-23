const {readFileSync}=require('node:fs');
const {runInNewContext}=require('node:vm');
const assert=require('node:assert/strict');
const files=[...readFileSync('index.html','utf8').matchAll(/<script defer src="([^"]+)/g)].map(x=>x[1].split('?')[0]).filter(x=>x.startsWith('js/data/')||x==='js/data.js'||x.startsWith('js/engine/')||x==='js/engine.js');
const ctx={console,Date,Math,Map,Set,JSON,Number,String,Array,Object,Uint8Array,Int32Array,localStorage:{getItem:()=>null,setItem:()=>{},removeItem:()=>{}},location:{origin:'http://localhost'}};
for(const file of files)runInNewContext(readFileSync(file,'utf8'),ctx,{filename:file});
runInNewContext('globalThis.Engine=GameEngine;globalThis.Data=GameData',ctx);
const e=new ctx.Engine(),p=e.getPlayer();p.unit=ctx.Data.units[0];p.isEmployed=true;p.age=30;p.yearsWorked=8;p.leadershipRank=2;e.initFinance();
let seed=0x5544ffee;const random=()=>{seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;return(seed>>>0)/4294967296};e.randf=random;e.rand=(a,b)=>a+Math.floor(random()*(b-a+1));
const count={loss:0,smallGain:0,largeGain:0},N=3000;let goldProfit=0,depositProfit=0;
for(let i=0;i<N;i++){
 p.finance.cash=0;e.syncWealth();p.flags.goldHeld=true;
 const logStart=p.careerLog.length;e._rcy_annualResetAndAssets();
 const line=p.careerLog.slice(logStart).find(x=>x.event.startsWith('📿'))?.event;
 assert.ok(line,'gold entry not recorded');const match=line.match(/到账(\d+)/);assert.ok(match);
 const payout=Number(match[1]);assert.ok([60,74,84].includes(payout));
 goldProfit+=payout-70;count[payout===60?'loss':payout===74?'smallGain':'largeGain']++;
 assert.equal(p.flags.goldHeld,undefined);
 p.finance.cash=0;e.syncWealth();p.flags.savingDeposit=true;
 const start=p.careerLog.length;e._rcy_annualResetAndAssets();
 const bank=p.careerLog.slice(start).find(x=>x.event.includes('定期到期'));
 assert.ok(bank);assert.equal(p.flags.savingDeposit,undefined);
 depositProfit+=1;
}
const stats={fixedSeeds:N,goldCount:count,meanGoldProfit:Number((goldProfit/N).toFixed(3)),meanDepositProfit:Number((depositProfit/N).toFixed(3)),goldObservedLossFrequency:Number((count.loss/N*100).toFixed(2)),cashDoublePayouts:0};
assert.ok(stats.meanGoldProfit>-1&&stats.meanGoldProfit<6,JSON.stringify(stats));assert.ok(count.loss>0&&count.smallGain>0&&count.largeGain>0);assert.equal(stats.meanDepositProfit,1);
console.log(JSON.stringify(stats,null,2));
