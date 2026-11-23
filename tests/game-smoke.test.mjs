import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, existsSync, readdirSync} from 'node:fs';
import {join, dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {Script} from 'node:vm';
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = p => readFileSync(join(ROOT,p),'utf8');
const index = read('index.html');
function listFiles(dir){return readdirSync(join(ROOT,dir),{withFileTypes:true}).flatMap(x=>x.isDirectory()?listFiles(dir+'/'+x.name):[dir+'/'+x.name]);}
test('game entrypoint stays the homepage',()=>{
 assert.match(index,/<title>上岸模拟器/);
 assert.match(index,/id="app"/);
 assert.ok(!index.includes('atlas/data/index.json'));
});
test('every referenced game script and stylesheet exists',()=>{
 const refs=[...index.matchAll(/<(?:script|link)\b[^>]*(?:src|href)="(\.?\.?\/[^"?#]+|(?:js|css)\/[^"?#]+)[^"#]*"/g)].map(x=>x[1]);
 assert.ok(refs.length>=65,'Expected script and CSS dependencies, found '+refs.length);
 for(const p of refs)assert.ok(existsSync(join(ROOT,p)),'Missing referenced asset: '+p);
});
test('all game JavaScript is syntactically valid',()=>{
 const files=listFiles('js').filter(p=>p.endsWith('.js'));
 assert.ok(files.length>=60);
 for(const p of files)assert.doesNotThrow(()=>new Script(read(p),{filename:p}),'Bad syntax: '+p);
});
test('manifest has valid local icons and game start URL',()=>{
 const m=JSON.parse(read('manifest.json'));
 assert.equal(m.start_url,'./index.html');
 assert.equal(m.name,'上岸模拟器');
 assert.ok(m.icons.length>=2);
 for(const icon of m.icons.filter(x=>!x.src.startsWith('data:')))assert.ok(existsSync(join(ROOT,icon.src)),'Missing icon '+icon.src);
});
test('offline precache lists existing game files',()=>{
 const sw=read('sw.js');
 new Script(sw,{filename:'sw.js'});
 const match=sw.match(/const CORE = \[([\s\S]*?)\];/);
 assert.ok(match,'Expected CORE cache list');
 const urls=[...match[1].matchAll(/'\.\/([^']+)'/g)].map(x=>x[1]);
 assert.ok(urls.length>=60);
 for(const p of urls)assert.ok(existsSync(join(ROOT,p)),'Missing offline cached asset '+p);
});
test('new service worker only clears old game caches',()=>{
 const sw=read('sw.js');
 assert.match(sw,/shangan-pages-7/);
 assert.match(sw,/k\.startsWith\('shangan-pages-'\)/);
});
