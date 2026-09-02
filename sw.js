// 上岸模拟器 Service Worker（离线缓存核心资源）
// 2.1.79（主题黑白转换与字体排版适配彻底修复）：data-theme 始终由 JS/头部脚本解析设置，
// 暗色组件规则统一迁入 html[data-theme="dark"]，桌面工作台与 JS 内联硬编码色全部令牌化。
// 2.1.78（生活侧时代纪事 + 接待会议/sudden 补件 12 事件）（v2.1.66 事件缺口补充：赡养/理财暴雷/借调三链 + 散事件）：深度结构性整理（engine-social 并入 lifecycle、clampStat/gainAttr 收敛、事件头注释标准化、CHANGELOG 归档）。
// 2.1.65：全项目功能域整理（docs 归域 + 全面同步 + admin 接线）。
// 2.1.58：编辑器加载现有内容（事件/题目目录搜索与改造，admin 数据序列）。
// 2.1.57：天赋数值校准（两段式分层对照，11 nerf + 2 buff）。
// 2.1.56：体验完善与创作闭环（引导刷新/结局名单一来源/canvas 分享图/内容包自动接线）。
// 2.1.55：接待主题内容包（enw219-230，12 事件，补足接待类缺口）。
// 2.1.54：日常事件部门化分析（work 主题分类与防退化护栏）。
// 2.1.53：社交功能（分享文本/本机排行榜/每日相同种子挑战）。
// 2.1.52：行为洞察面板（结局路径矩阵/流失分布/事件链完成率）。
// 2.1.51：平衡性自动分析工具（自动化门禁，五道结构护栏）。
// 2.1.50：题目编辑器（管理后台标签页，双题型表单/校验/片段导出）。
// 2.1.49：项目结局分支（政策项目接入结局备选路径 + 舆情压制负向门）与跨周目挑战长廊。
// 2.1.47：人生回顾职业路径阶梯图（晋升/降级/调任标记）+ 图鉴结局概率卡。
// 2.1.46：career 事件分层校准——仕途场景权重对齐、职级达标引导、平衡报告 career 切片与系统单位 profile。
// 2.1.42：P5 UX 与可视化——暗色模式（夜色卷宗）、人生数据生涯总览、事件阶段插图。
// 2.1.41：P4 娱乐性与平衡——年龄精力衰减（≥55 岁）、天赋精力加成（apBonus），平衡哨兵全绿。
// 2.1.40：P3 世界/剧本深化——三时代背景波按年轮转，七个剧本各扩为三步专属事件链与阶段目标。
// 2.1.39：P2 事件密度——筹划板浮现可追查的机会事件（盲区优先），敌人使绊升级为可回应的微决策。
// 2.1.38：年度筹划回合——精力点（AP）统一行动预算，理财/人脉/子女动作共享一池精力，形成真实取舍。
// 2.1.37：新增日常质感事件包（12个）、无障碍大字号模式、事件阶段标签朱印化。
// 2.1.36：内容可读性收尾——辅助文字对比度全面达标（WCAG AA 4.5:1）、存档位超长元信息省略号截断、8px 小字提升、账号/标签交互态补齐。
// 2.1.35：修复 1024-1439px 中屏侧栏被永久压缩成图标栏的问题——默认显示带文字的完整侧栏，收起时才退为图标栏。
// 2.1.34-ui2：刷新响应式侧栏无障碍状态与移动端数据标签交互缓存。
// 2.1.3：CACHE 名与 index.html 版本号同步；install 时预缓存条目统一追加 ?v= 版本串，
// fetch 匹配用 ignoreSearch —— 修复预缓存与运行时请求（带 query）不匹配、预缓存形同虚设的问题
// UI 刷新后切换缓存名，确保已经打开过旧版本的用户能拿到最新样式与交互逻辑。
const CACHE = 'shangan-pages-3';
const V = '?v=pages-3';
const UI_REV3 = new Set([
  './js/app/app-core.js',
  './js/app/app-history.js',
  './js/app/app-challenges.js',
  './js/app/app-daily-challenge.js'
]);
const UI_REV4 = new Set(['./js/app/app-desktop.js']);
const CORE = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './css/style.css',
  './css/desktop-workspace.css',
  './css/mobile-workspace.css',
  './css/ui-upgrade.css',
  './css/ui-fix-2.1.83.css',
  './js/icons.js',
  './js/static-config.js',
  './js/qrcode-generator.js',
  './js/data/data-core.js',
  './js/data/data-exam.js',
  './js/data/data-events-basic-1.js','./js/data/data-events-basic-2.js','./js/data/data-events-basic-3.js','./js/data/data-events-basic-4.js','./js/data/data-events-basic-5.js',
  './js/data/data-events-ext.js',
  './js/data/data-events-spec.js',
  './js/data/data-events-new-work.js',
  './js/data/data-events-new-life.js',
  './js/data/data-events-new-career.js',
  './js/data/data-events-new-theme.js',
  './js/data/data-events-new-daily.js',
  './js/data/data-events-network.js',
  './js/data/data-events-new-v2144.js',
  './js/data/data-events-new-v2145.js',
  './js/data/data-events-new-v2155.js',
  './js/data/data-events-new-v2161.js',
  './js/data/data-events-new-v2166.js',
  './js/data/data-events-new-v2170.js',
  './js/data/data-events-new-v2172.js',
  './js/data/data-events-new-v2173.js',
  './js/data/data-events-new-v2174.js',
  './js/data/data-events-new-v2175.js',
  './js/data/data-events-new-v2178.js',
  './js/data/data-projects.js',
  './js/data/data-network.js',
  './js/data.js',
  './js/data/data-scenarios.js',
  './js/data/data-flag-categories.js',
  './js/engine/engine-core.js',
  './js/engine/engine-exam.js',
  './js/engine/engine-career.js',
  './js/engine/engine-career-ranks.js',
  './js/engine/engine-career-promotions.js',
  './js/engine/engine-career-lifecycle.js',
  './js/engine/engine-events.js',
  './js/engine/engine-network.js',
  './js/engine/engine-projects.js',
  './js/engine/engine-finance-utils.js',
  './js/engine/engine-planning.js',
  './js/engine.js',
  './js/app.js',
  './js/app/app-core.js',
  './js/app/app-storage.js',
  './js/app/app-history.js',
  './js/app/app-character.js',
  './js/app/app-exam.js',
  './js/app/app-career.js',
  './js/app/app-network.js',
  './js/app/app-planning.js',
  './js/app/app-projects.js',
  './js/app/app-menu.js',
  './js/app/app-codex.js',
  './js/app/app-challenges.js',
  './js/app/app-daily-challenge.js',
  './js/app/app-desktop.js',
  './js/app/app-share.js',
];

self.addEventListener('install', e => {
  const cacheUrl = u => u === './css/ui-upgrade.css'
    ? u + V + '&rev=ui8'
    : UI_REV4.has(u) ? u + V + '&rev=ui4'
    : UI_REV3.has(u) ? u + V + '&rev=ui3' : u + V;
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE.map(cacheUrl))).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const requestUrl = new URL(e.request.url);
  // 仅缓存同源 GET；API 请求和跨源资源直连
  if (e.request.method !== 'GET' || requestUrl.origin !== self.location.origin || requestUrl.pathname.startsWith('/api/')) return;
  e.respondWith(
    // ignoreSearch：带 ?v= 的运行时请求也能命中预缓存条目（v2.16 修复）
    caches.match(e.request, { ignoreSearch: true }).then(hit => {
      if (hit) return hit;
      return fetch(e.request).then(res => {
        if (res && res.ok) {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone)).catch(() => {});
        }
        return res;
      }).catch(() => {
        // 只有页面导航允许回退首页；脚本、样式和图片失败时返回明确的离线错误，
        // 避免浏览器把 HTML 当作 JS/CSS 解析，产生更难定位的二次错误。
        if (e.request.mode === 'navigate') {
          return caches.match('./index.html', { ignoreSearch: true });
        }
        return new Response('', { status: 503, statusText: 'Offline' });
      });
    })
  );
});

