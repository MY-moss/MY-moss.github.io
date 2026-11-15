import {readFileSync} from "node:fs";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
const read=p=>JSON.parse(readFileSync(p,"utf8"));
const feed=read("inspiration/data/index.json"),feedSchema=read("atlas/feed.schema.json"),reportSchema=read("atlas/report.schema.json");
const ajv=new Ajv2020({allErrors:true,strict:false});addFormats(ajv);ajv.addSchema(reportSchema);
const errors=[],validFeed=ajv.compile(feedSchema),validReport=ajv.compile(reportSchema);
if(!validFeed(feed))errors.push(...validFeed.errors.map(e=>"feed "+e.instancePath+" "+e.message));
for(const [n,report] of feed.reports.entries())if(!validReport(report))errors.push(...validReport.errors.map(e=>"reports["+n+"] "+e.instancePath+" "+e.message));
const allowed=["world","reading","opensource","inspiration"],ids=feed.channels.map(c=>c.id);
if(ids.length!==allowed.length||allowed.some(id=>!ids.includes(id)))errors.push("public channel allow-list must contain exactly world, reading, opensource, inspiration");
if(ids.includes("knowledge")||feed.reports.some(r=>r.channel==="knowledge"))errors.push("private knowledge channel must never be public");
if(new Set(ids).size!==ids.length)errors.push("duplicate channel metadata");
const reportKeys=new Set(),itemKeys=new Set();let previousDate="9999-12-31";
for(const report of feed.reports){
 if(!allowed.includes(report.channel))errors.push("forbidden channel "+report.channel);
 const key=report.channel+":"+report.date;if(reportKeys.has(key))errors.push("duplicate report "+key);reportKeys.add(key);
 if(report.date>previousDate)errors.push("reports must be sorted by date descending at "+key);previousDate=report.date;
 for(const item of report.items||[]){const itemKey=key+":"+item.id;if(itemKeys.has(itemKey))errors.push("duplicate item "+itemKey);itemKeys.add(itemKey);}
}
function scanUrls(value,path="feed"){
 if(Array.isArray(value)){value.forEach((v,i)=>scanUrls(v,path+"["+i+"]"));return;}
 if(!value||typeof value!=="object")return;
 for(const [key,v] of Object.entries(value)){
  if(/(?:^|_)(?:url|uri)$/i.test(key)&&typeof v==="string"&&v&&!/^https:\/\//i.test(v))errors.push("non-HTTPS URL at "+path+"."+key);
  scanUrls(v,path+"."+key);
 }
}
scanUrls(feed);
const channelFields={inspiration:["creator","method","uses"],world:["summary","confidence"],reading:["author","published_at","reading_minutes","access"],opensource:["stack","maturity","difficulty","risks","recommendation","license","uses","project_fit","version","stars","platforms"]};
for(const report of feed.reports)for(const [index,item] of (report.items||[]).entries()){
 for(const field of ["source","why","tags"])if(item[field]===undefined||item[field]===null||item[field]===""||(field==="tags"&&(!Array.isArray(item.tags)||item.tags.length===0)))errors.push("missing common item field "+report.channel+"/"+report.date+"["+index+"] "+field);
 if(!item.url&&!item.repo_url&&!item.website_url)errors.push("missing source URL "+report.channel+"/"+report.date+"["+index+"]");
 for(const field of channelFields[report.channel]||[])if(item[field]===undefined||item[field]===null||item[field]===""||(Array.isArray(item[field])&&item[field].length===0))errors.push("missing channel-specific field "+report.channel+"/"+report.date+"["+index+"] "+field);
 if(report.channel==="reading"&&item.access&&!["free","paid","unknown"].includes(item.access))errors.push("invalid reading access status "+report.date+"["+index+"]");
}
const raw=JSON.stringify(feed);
const checks=[
 ["GitHub token",/\b(?:github_pat_[A-Za-z0-9_]{20,}|gh[pousr]_[A-Za-z0-9]{20,})\b/],
 ["OpenAI API key",/\bsk-(?:proj-)?[A-Za-z0-9_-]{24,}\b/],
 ["Google API key",/\bAIza[0-9A-Za-z_-]{30,}\b/],
 ["AWS access key",/\bAKIA[0-9A-Z]{16}\b/],
 ["Slack token",/\bxox[baprs]-[A-Za-z0-9-]{10,}\b/],
 ["private key",/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/],
 ["Bearer credential",/\bBearer\s+[A-Za-z0-9._~+/-]{24,}={0,2}/i],
 ["email",/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i],
 ["China mobile",/\b1[3-9]\d{9}\b/],
 ["private Windows path",/\b[A-Z]:\\Users\\[^\\]+/i],
 ["private Unix home path",/(?:\/Users\/[^/\s]+\/|\/home\/[^/\s]+\/)/],
 ["private chat",/(?:根据(?:你|用户)(?:之前|过去|个人)|私人聊天记录|聊天记录中提到|用户的个人信息)/i]
];
for(const [name,pattern] of checks)if(pattern.test(raw))errors.push("privacy scan "+name);
if(errors.length){console.error(errors.join("\n"));process.exit(1);}
console.log("ATLAS schema/privacy checks passed: "+feed.reports.length+" reports, "+itemKeys.size+" items, "+ids.length+" public channels.");
