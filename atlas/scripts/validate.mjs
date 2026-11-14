import { readFileSync, existsSync } from "node:fs";
import vm from "node:vm";
import assert from "node:assert/strict";

const html = readFileSync("atlas/index.html", "utf8");
const app = readFileSync("atlas/app.js", "utf8");
const css = readFileSync("atlas/styles.css", "utf8");
const configSource = readFileSync("atlas/config.js", "utf8");
const manifest = JSON.parse(readFileSync("atlas/manifest.webmanifest", "utf8"));
const schema = JSON.parse(readFileSync("atlas/report.schema.json", "utf8"));

const sandbox = { window: {} };
vm.runInNewContext(configSource, sandbox, { timeout: 1000 });
const config = sandbox.window.ATLAS_CONFIG;

assert.ok(config, "ATLAS_CONFIG must be defined");
assert.equal(config.owner, "MY-moss");
assert.equal(config.dataRepo, "atlas-data");
assert.equal(config.branch, "main");
assert.deepEqual(Array.from(config.streams, (s) => s.id), [
  "world", "reading", "opensource", "inspiration", "knowledge"
]);
assert.equal(new Set(config.streams.map((s) => s.id)).size, 5, "stream IDs must be unique");

for (const asset of ["styles.css", "config.js", "app.js", "manifest.webmanifest"]) {
  assert.ok(existsSync("atlas/" + asset), "Missing ATLAS asset: " + asset);
  assert.ok(html.includes("./" + asset), "index.html does not reference " + asset);
}
assert.ok(html.includes("noindex,nofollow,noarchive"), "Private shell should discourage indexing");
assert.ok(html.includes("https://api.github.com"), "CSP must allow the GitHub API");
assert.ok(app.includes("sessionStorage"), "Token must be session-scoped");
assert.ok(app.includes("repo.private !== true"), "App must reject a public data repository");
assert.ok(app.includes("identity.login.toLowerCase()"), "App must validate the GitHub owner identity");
assert.ok(app.includes("data/feeds/"), "App must read the five private feed directories");
assert.ok(css.includes("@media"), "Responsive breakpoints are required");
assert.equal(manifest.scope, "/atlas/");
assert.equal(schema.properties.stream.enum.length, 5);
assert.ok(schema.required.includes("schema_version") && schema.required.includes("items"));

// The public Pages repository must never contain private feed payloads.
assert.equal(existsSync("atlas/data/feeds"), false, "Private feed data must not be committed to the public Pages repository");

console.log("ATLAS validation passed: five streams, private-repository gate, assets, manifest, schema, and public-data boundary.");
