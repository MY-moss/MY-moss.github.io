import {readFile,writeFile} from "node:fs/promises";
const version=(process.env.GITHUB_SHA||"local-build").slice(0,12);
const files=[
 ["atlas/index.html",/\?v=3/g,"?v="+version],
 ["atlas/app.js",/\?v=3/g,"?v="+version],
 ["atlas/sw.js",/\?v=3/g,"?v="+version],
 ["atlas/sw.js",/atlas-public-v3-20261115/g,"atlas-public-"+version],
 ["inspiration/index.html",/\?v=2/g,"?v="+version],
 ["inspiration/app.js",/register\(["']\.\/sw\.js["']/g,'register("./sw.js?v='+version+'"'],
 ["inspiration/sw.js",/\?v=2/g,"?v="+version],
 ["inspiration/sw.js",/inspiration-hub-v2-20261115/g,"inspiration-hub-"+version]
];
for(const [path,pattern,replacement] of files){const content=await readFile(path,"utf8");await writeFile(path,content.replace(pattern,replacement));}
console.log("Release assets versioned with "+version);
