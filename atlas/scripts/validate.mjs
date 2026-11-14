import {readFileSync,existsSync} from "node:fs";
import vm from "node:vm";
import assert from "node:assert/strict";
const html=readFileSync("atlas/index.html","utf8");
const app=readFileSync("atlas/app.js","utf8");
const css=readFileSync("atlas/styles.css","utf8");
const source=readFileSync("atlas/config.js","utf8");
const manifest=JSON.parse(readFileSync("atlas/manifest.webmanifest","utf8"));
const feed=JSON.parse(readFileSync("inspiration/data/index.json","utf8"));
const box={window:{}}; vm.runInNewContext(source,box,{timeout:1000});
const cfg=box.window.ATLAS_CONFIG;
assert.equal(cfg.feedUrl,"../inspiration/data/index.json");
assert.deepEqual(Array.from(cfg.streams,s=>s.id),["world","reading","opensource","inspiration","knowledge"]);
for(const file of ["styles.css","config.js","app.js","manifest.webmanifest"]){
 assert.ok(existsSync("atlas/"+file));
 assert.ok(html.includes("./"+file));
}
assert.ok(html.includes('content="index,follow"'));
assert.ok(!html.includes('id="login-form"')&&!html.includes('is-locked'));
assert.ok(!app.includes("Bearer ")&&!app.includes("atlas_token"));
assert.ok(app.includes("fetch(new URL(CONFIG.feedUrl"));
assert.ok(css.includes("@media"));
assert.equal(manifest.scope,"/atlas/");
assert.equal(feed.schemaVersion,1);
assert.ok(Array.isArray(feed.reports)&&Array.isArray(feed.channels));
const ids=new Set(cfg.streams.map(s=>s.id));
const seen=new Set();
for(const report of feed.reports){
 assert.ok(ids.has(report.channel),"Unknown channel "+report.channel);
 assert.ok(typeof report.date==="string" && report.date.length===10);
 assert.ok(Array.isArray(report.items));
 const key=report.channel+":"+report.date;
 assert.ok(!seen.has(key),"Duplicate "+key);seen.add(key);
 for(const item of report.items)assert.ok(typeof item.title==="string"&&item.title.trim());
}
assert.ok(!/github_pat_[A-Za-z0-9_]{20,}|gh[pousr]_[A-Za-z0-9]{20,}/.test(JSON.stringify(feed)));
console.log("ATLAS public edition validated: five streams, "+feed.reports.length+" reports, no login.");
