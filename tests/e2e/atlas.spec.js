import {test,expect} from "@playwright/test";
test("four public channels load and private knowledge review is absent",async({page})=>{
 await page.goto("/atlas/");await expect(page.getByRole("heading",{name:"四条信息流"})).toBeVisible();
 for(const id of ["world","reading","opensource","inspiration"])await expect(page.locator('[data-view="'+id+'"]').first()).toBeVisible();
 await expect(page.getByText("知识回顾",{exact:true})).toHaveCount(0);
 await expect(page.locator("#sync-label")).toContainText("公开档案已更新");
});
test("search opens a detail page",async({page})=>{
 await page.goto("/atlas/");const first=page.locator(".entry-title-button").first();await expect(first).toBeVisible();const title=await first.innerText();
 await page.locator("#global-search").fill(title.slice(0,Math.min(7,title.length)));await expect(page.locator(".entry-title-button").first()).toContainText(title);
 await page.locator(".entry-title-button").first().click();await expect(page.locator(".detail-layout")).toBeVisible();await expect(page.locator(".detail-back")).toBeVisible();
});
test("bookmarks and read markers persist locally",async({page})=>{
 await page.goto("/atlas/");const title=await page.locator(".entry-title-button").first().innerText();
 await page.locator('[data-action="bookmark"]').first().click();await page.locator('[data-action="read"]').first().click();
 await page.locator('[data-view="bookmarks"]').first().click();await expect(page.locator(".entry-title-button").filter({hasText:title})).toBeVisible();
 await page.reload();await page.locator('[data-view="bookmarks"]').first().click();await expect(page.locator(".entry-title-button").filter({hasText:title})).toBeVisible();
});
test("project details show known metadata and explicit unknown values",async({page})=>{
 const response=await page.request.get("/atlas/data/index.json"),feed=await response.json();
 feed.reports.unshift({channel:"opensource",date:"2026-11-16",title:"E2E 项目详情测试",summary:"仅用于自动化测试的模拟数据。",
 items:[{id:"e2e-project",title:"ATLAS Demo Project",summary:"示例项目用途",url:"https://github.com/example/demo",
 stack:["TypeScript","WebAssembly"],maturity:"活跃维护（测试值）",difficulty:"中等（测试值）",license:"MIT",
 risks:"依赖升级频率需要检查",recommendation:"值得关注",uses:"尝试制作一个最小原型",project_fit:"适合用作前端原型"}]});
 await page.route("**/atlas/data/index.json",route=>route.fulfill({status:200,contentType:"application/json",body:JSON.stringify(feed)}));
 await page.goto("/atlas/");await page.locator('[data-view="opensource"]').first().click();await page.getByRole("button",{name:"ATLAS Demo Project"}).click();
 await expect(page.locator(".detail-grid")).toContainText("TypeScript");await expect(page.locator(".detail-grid")).toContainText("MIT");
 await expect(page.locator(".detail-grid")).toContainText("值得关注");await expect(page.locator(".detail-grid")).toContainText("未提供 / 未核实");
});
test("reading details include date, reading time and access status; unsafe HTML and URLs are inert",async({page})=>{
 const response=await page.request.get("/atlas/data/index.json"),feed=await response.json();
 feed.reports.unshift({channel:"reading",date:"2026-11-16",title:"E2E 阅读详情测试",summary:"测试报告。",
 items:[{id:"e2e-reading",title:"ATLAS Reading Detail",summary:"<img src=x onerror=alert(1)>",author:"Test Author",source:"Test Journal",
 url:"javascript:alert(1)",published_at:"2026-11-15",reading_minutes:12,access:"free",tags:["文学","研究"]}]});
 await page.route("**/atlas/data/index.json",route=>route.fulfill({status:200,contentType:"application/json",body:JSON.stringify(feed)}));
 await page.goto("/atlas/");await page.locator('[data-view="reading"]').first().click();await page.getByRole("button",{name:"ATLAS Reading Detail"}).click();
 await expect(page.locator(".detail-grid")).toContainText("2026-11-15");await expect(page.locator(".detail-grid")).toContainText("12 分钟");
 await expect(page.locator(".detail-grid")).toContainText("免费全文");await expect(page.locator(".detail-grid")).toContainText("<img src=x onerror=alert(1)>");
 await expect(page.locator(".detail-grid img")).toHaveCount(0);await expect(page.locator(".detail-actions a")).toHaveCount(0);
});
test("mobile layout has two columns and no horizontal overflow",async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto("/atlas/");await expect(page.locator(".mobile-nav")).toBeVisible();
 const x=await page.locator(".stream-grid").evaluate(e=>({cols:getComputedStyle(e).gridTemplateColumns.split(" ").length,width:document.documentElement.scrollWidth,viewport:innerWidth}));
 expect(x.cols).toBe(2);expect(x.width).toBeLessThanOrEqual(x.viewport);
});
test("theme preference persists after reload",async({page})=>{
 await page.goto("/atlas/");await page.locator("#theme-button").click();await expect(page.locator("html")).toHaveAttribute("data-theme","dark");
 await page.reload();await expect(page.locator("html")).toHaveAttribute("data-theme","dark");
});
test("cached content remains available offline",async({page,context})=>{
 await page.goto("/atlas/");await expect(page.locator("#sync-label")).toContainText("公开档案已更新");
 await page.evaluate(async()=>{await navigator.serviceWorker.ready;if(!navigator.serviceWorker.controller)await new Promise(resolve=>navigator.serviceWorker.addEventListener("controllerchange",resolve,{once:true}));});
 await context.setOffline(true);await page.reload();await expect(page.locator(".entry-title-button").first()).toBeVisible();await expect(page.locator("#network-banner")).toBeVisible();
});
test("existing landing page and inspiration sub-site still load",async({page})=>{
 await page.goto("/");await expect(page).toHaveTitle(/上岸模拟器/);await expect(page.locator("#app")).toBeVisible();
 await page.goto("/inspiration/");await expect(page).toHaveTitle(/灵感研究所/);await expect(page.locator("#main")).toBeVisible();
 await expect(page.getByText("知识回顾",{exact:true})).toHaveCount(0);
});
test("empty public channels show a clear no-content state instead of fabricated entries",async({page})=>{
 await page.goto("/atlas/");await page.locator('[data-view="reading"]').first().click();
 await expect(page.getByText("这条信息流还没有内容。",{exact:true})).toBeVisible();
});
