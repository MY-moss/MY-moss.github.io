// 全量事件结构与叙事审计：只读数据，不修改游戏/玩家存档。
const {readFileSync,writeFileSync}=require('node:fs');
const {runInNewContext}=require('node:vm');
const {resolve}=require('node:path');
const root=resolve(__dirname,'..');
const html=readFileSync(resolve(root,'index.html'),'utf8');
const sourcePaths=[...html.matchAll(/<script defer src="([^"]+)/g)].map(x=>x[1].split('?')[0]).filter(p=>p.startsWith('js/data/')||p==='js/data.js');
const ctx={console,Math,Date,Set,Map,Number,String,Object,Array,JSON};
for(const p of sourcePaths)runInNewContext(readFileSync(resolve(root,p),'utf8'),ctx,{filename:p});
runInNewContext('globalThis.DATA=GameData',ctx);
const events=ctx.DATA.events;
const orderedSource=sourcePaths.filter(p=>p.startsWith('js/data/')&&(/events/.test(p)||/data-scenarios\.js/.test(p))).map(p=>({path:p,text:readFileSync(resolve(root,p),'utf8')}));
const owner=id=>orderedSource.find(x=>new RegExp("\\bid\\s*:\\s*['\"]"+id.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+"['\"]").test(x.text))?.path||'unknown';
const numeric=o=>Object.fromEntries(Object.entries(o||{}).filter(([k,v])=>typeof v==='number'&&v!==0).sort());
const meaningful=o=>Object.entries(o||{}).filter(([k,v])=>v!==0&&v!==null&&v!==false&&v!==''&&!(typeof v==='object'&&Object.keys(v).length===0));
const keySig=c=>JSON.stringify(meaningful(c.effects).map(([k,v])=>[k,v]).sort(([a],[b])=>a.localeCompare(b)));
const groupBy=(fn)=>{const m=new Map();for(const e of events){const k=fn(e);if(!k)continue;const a=m.get(k)||[];a.push(e);m.set(k,a)}return [...m].filter(([,es])=>es.length>1).sort((a,b)=>b[1].length-a[1].length)};
const groups={title:groupBy(e=>e.title?.trim()),text:groupBy(e=>e.text?.trim()),choices:groupBy(e=>e.eventType==='choice'?e.choices?.map(c=>c.text).join('||'):null)};
const issues=[];const add=(e,code,detail)=>issues.push({id:e.id,file:owner(e.id),title:e.title,code,detail});
const flags=new Set();for(const e of events){const eff=[e.effects,...(e.choices||[]).map(c=>c.effects)];for(const x of eff){for(const f of [x?.flag,...(x?.setFlags||[])])if(typeof f==='string')flags.add(f)}}
// 事件之外，派驻、晋升、返聘、借贷等运行时机制也会产生前置 flag。
// 只认实际源码中显式赋值 true 的 flag，避免把真实的孤儿前置静默豁免。
const scriptFiles=[...html.matchAll(/<script defer src="([^"]+)/g)].map(x=>x[1].split('?')[0]);
const runtimeFlags=new Set();
for(const path of scriptFiles.filter(path=>path.startsWith('js/engine/')||path.startsWith('js/app/'))){
 const text=readFileSync(resolve(root,path),'utf8');
 for(const match of text.matchAll(/\.flags\.([A-Za-z_$][\w$]*)\s*=\s*true\b/g))runtimeFlags.add(match[1]);
 for(const match of text.matchAll(/\.markEventFlag\(['"]([A-Za-z_$][\w$]*)['"]\)/g))runtimeFlags.add(match[1]);
}
for(const f of runtimeFlags)flags.add(f);
const permitted=new Set(['wealth','addDebt','political','education','childEducation','childCompany','reputation','peopleReputation','flag','setFlags','deleteFlag','deleteFlags','marry','child','contact','addEnemy','contactRelation','contactRelation2','contactDelta','contactEvolution','grassrootsDispatch','debtForgive','debtRateMul','heat','leadershipRank','central','grassrootsReturn','grassrootsStay','grassrootsLower','iq','eq','luck','family','appearance','body','desire','familyPressure','integrity','risk','background','workAbility','positionWeight','mentalPressure','careerLogNote','reformCount']);
for(const e of events){
 if(!e.id||!e.title||!e.stage||!e.eventType||!e.text) add(e,'missing_core',Object.keys(e));
 if(e.text?.length<33) add(e,'short_scene',e.text);
 if(e.text?.length>400) add(e,'long_scene',e.text.length);
 if(e.eventType==='choice'){
  if(!Array.isArray(e.choices)||e.choices.length<2)add(e,'missing_choices',e.choices?.length);
  const sigs=new Map();for(const c of e.choices||[]){
   if(!c.text||!c.effects) add(e,'choice_missing',c.text||'unknown');
   const sig=keySig(c);sigs.set(sig,(sigs.get(sig)||0)+1);
   if(!meaningful(c.effects).length)add(e,'choice_no_effect',c.text);
   if(c.text?.length<6)add(e,'short_choice',c.text);
  }
  if([...sigs.values()].some(n=>n>1))add(e,'identical_choice_effects',[...sigs].filter(([,n])=>n>1));
  if(e.choices?.length>5)add(e,'too_many_choices',e.choices.length);
 }
 const eff=[e.effects,...(e.choices||[]).map(c=>c.effects)];for(const x of eff){for(const [k,v]of Object.entries(x||{})){if(!permitted.has(k))add(e,'unknown_effect_key',k)}}
 if(e.requireFlag && !flags.has(e.requireFlag))add(e,'orphan_req_flag',e.requireFlag);
 if(e.requireFlags && e.requireFlags.some(f=>!flags.has(f)))add(e,'orphan_req_flags',e.requireFlags.filter(f=>!flags.has(f)));
 if(e.year && (e.year[1]<22||e.year[0]>70||e.year[0]>e.year[1]))add(e,'bad_age_window',e.year);
 if(e.stage==='life'&&e.pools?.includes('public')===false&&e.pools?.length>0)add(e,'life_special_pool',e.pools);
}
// Review the source as well as the evaluated data: JavaScript silently overwrites
// duplicate object keys such as { flag: 'first', flag: 'second' }.
// Only inspect top-level keys inside each effects object; nested effect payloads
// (e.g. grassrootsDispatch) have their own independent key namespace.
for (const source of orderedSource) {
 const text=source.text;
 for (const match of text.matchAll(/\beffects\s*:\s*\{/g)) {
  const keys=new Set();const duplicates=new Set();
  let level=1,quote=null,escaped=false;
  const start=match.index+match[0].length;
  for(let i=start;i<text.length&&level>0;i++){
   const ch=text[i];
   if(quote){if(escaped){escaped=false;continue;}if(ch==='\\'){escaped=true;continue;}if(ch===quote)quote=null;continue;}
   if(ch==='\''||ch==='"'||ch==='`'){quote=ch;continue;}
   if(ch==='{'){level++;continue;}if(ch==='}'){level--;continue;}
   if(level!==1||!/[A-Za-z_$]/.test(ch))continue;
   let j=i+1;while(j<text.length&&/[A-Za-z0-9_$]/.test(text[j]))j++;
   let next=j;while(next<text.length&&/\s/.test(text[next]))next++;
   if(text[next]===':'){
    const key=text.slice(i,j);
    if(keys.has(key))duplicates.add(key);
    keys.add(key);
   }
   i=j-1;
  }
  if(duplicates.size){
   const eventStart=Math.max(0,text.lastIndexOf('{ id:',match.index));
   const eid=text.slice(eventStart,match.index).match(/\bid\s*:\s*['"]([^'"]+)/)?.[1]||'unknown';
   issues.push({id:eid,file:source.path,code:'duplicate_effect_key',detail:[...duplicates]});
  }
 }
}
const by=(arr,key)=>arr.reduce((m,o)=>(m[o[key]||'unknown']=(m[o[key]||'unknown']||0)+1,m),{});
const stats={count:events.length,stages:by(events,'stage'),types:by(events,'eventType'),sourceFiles:by(events.map(e=>({file:owner(e.id)})),'file'),era:by(events.map(e=>({era:e.era?.join?.(',')||'any'})),'era'),scenarioCount:events.filter(e=>e.scenario).length,hasFlag:events.filter(e=>e.requireFlag||e.requireFlags).length,withYear:events.filter(e=>e.year).length,flagsProduced:flags.size,runtimeFlagsProduced:runtimeFlags.size,issues:by(issues,'code'),duplicateTitles:groups.title.length,duplicateTexts:groups.text.length,duplicateChoiceSets:groups.choices.length};
const report={stats,issues,duplicateTitles:groups.title.map(([k,es])=>({title:k,ids:es.map(e=>e.id),file:owner(es[0].id)})),duplicateTexts:groups.text.map(([k,es])=>({text:k,ids:es.map(e=>e.id)})),duplicateChoiceSets:groups.choices.map(([k,es])=>({ids:es.map(e=>e.id),choices:k.slice(0,200)}))};
writeFileSync('/tmp/shangan-round2-audit.json',JSON.stringify(report,null,2));
writeFileSync('/tmp/shangan-round2-events.json',JSON.stringify(events.map(e=>({ ...e, source:owner(e.id) })),null,2));
// 可选人工验收档案：每个保留事件独立一行，不把规则检查误称为人工通读。
if(process.argv.includes('--write-catalog')){
 const esc=v=>'"'+String(v??'').replace(/"/g,'""')+'"';
 const header=['事件ID','标题','来源文件','阶段','类型','选项数','审核状态','结构问题标记','前置条件','描述字数'];
 const issuesById=new Map();for(const x of issues){const list=issuesById.get(x.id)||[];list.push(x.code);issuesById.set(x.id,list)}
 const rows=events.map(e=>{
   const found=issuesById.get(e.id)||[];
   const needs=found.filter(code=>!['orphan_req_flag','orphan_req_flags'].includes(code));
   const status=needs.length?'待人工叙事复审':'结构审核通过（非人工全文验收）';
   const gates=['year','era','scenario','requireFlag','requireFlags','excludeFlag','excludeFlags','requireChild','requireNoChild','requireChildAgeMin','requireChildAgeMax','requireMarried','requireSingle','requireRankMin','requireRankMax','requireYearsWorkedMin','requireUnitLevelMin','requireUnitLevelMax','requireRisk','requireBodyMax','requireUnitSystem'].filter(k=>e[k]!==undefined).map(k=>k+'='+JSON.stringify(e[k])).join('; ');
   return [e.id,e.title,owner(e.id),e.stage,e.eventType,e.choices?.length||0,status,found.join(';'),gates,e.text?.length||0];
 });
 const csv=[header,...rows].map(r=>r.map(esc).join(',')).join('\n')+'\n';
 const catalog = process.argv.find(arg=>arg.startsWith('--catalog='))?.slice('--catalog='.length) || 'docs/EVENT_CONTENT_AUDIT_ROUND2.csv';
 writeFileSync(resolve(root,catalog),'\uFEFF'+csv);
 console.log('WROTE_CATALOG',rows.length);
}
console.log('STATS',JSON.stringify(stats,null,2));
console.log('EXACT_DUP_TITLES',JSON.stringify(report.duplicateTitles.slice(0,35),null,2));
console.log('SAMPLE_ISSUES',JSON.stringify(issues.filter(x=>['identical_choice_effects','choice_no_effect','orphan_req_flag','missing_core','unknown_effect_key','bad_age_window'].includes(x.code)).slice(0,100),null,2));

if(process.argv.includes('--strict')){
 if(issues.length){
   console.error('STRICT_AUDIT_FAILED',JSON.stringify(issues));
   process.exitCode=1;
 } else console.log('STRICT_AUDIT_PASSED',events.length,'events');
}
