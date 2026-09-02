// ===== 渲染兜底（v2.1.4 图标系统）：输出 HTML 中的 emoji 统一转为 Lucide 图标 =====
// 依赖 js/icons.js 的 LConvertEmoji；未加载时原样输出，保证功能不失效
function __h(html) {
  const source = String(html == null ? '' : html);
  if (typeof LConvertEmoji !== 'function') return source.replace(/[—–]/g, '-');
  // v2.1.62 修复：属性值内的 emoji 不得转图标——替换会插入带引号的 <svg> 标签，
  // 炸穿 aria-label/id/title 等属性（报考单位分组标签曾渲染出乱码文本与残缺 svg）。
  // 先遮蔽所有引号包裹的属性值，图标转换后再原样还原。
  const ATTR_RE = /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/g;
  const guards = [];
  const masked = source.replace(ATTR_RE, m => {
    guards.push(m);
    return '\uE000' + (guards.length - 1) + '\uE000';
  });
  let converted = masked;
  try { converted = LConvertEmoji(masked); } catch (error) {}
  return converted.replace(/\uE000(\d+)\uE000/g, (_, n) => guards[Number(n)]).replace(/[—–]/g, '-');
}
// ===== flag 图鉴分类表已剥离至 js/data/data-flag-categories.js（v2.1.67 结构收敛） =====

Object.assign(App, {
  // v2.24 结局全集（图鉴分母与渲染共用；新增结局需同步此处）
  ALL_ENDINGS: ['skyline', 'fast', 'safe', 'ordinary', 'edge', 'arrest', 'burnout', 'central', 'entrepreneur', 'reform', 'digital', 'grassroots', 'clean', 'grassroots_devotion', 'tech_backbone', 'people_champion', 'reform_pioneer', 'honest_official', 'era_reform', 'era_rectify', 'patron_legacy', 'lifelong_friend', 'hometown_net', 'estranged_hero', 'whistleblower_hero', 'author_legacy', 'rural_star'],
  // v2.1.56 结局中文名单一来源（结算页/分享/排行榜/统计共用；exam_fail 供历史记录兜底）
  ENDING_NAMES: { skyline: '巅峰人生', fast: '快速晋升', safe: '安稳退休', ordinary: '平凡人生', edge: '边缘化', arrest: '被抓', burnout: '燃尽', central: '中央殿堂', entrepreneur: '下海人生', reform: '改革先锋', digital: '数字先驱', grassroots: '乡土守望', clean: '清廉丰碑', grassroots_devotion: '基层奉献', tech_backbone: '技术骨干', people_champion: '群众贴心人', reform_pioneer: '改革旗手', honest_official: '一代清官', era_reform: '时代弄潮儿', era_rectify: '清流砥柱', patron_legacy: '大树成荫', lifelong_friend: '莫逆之交', hometown_net: '桑梓情深', estranged_hero: '曲高和寡', whistleblower_hero: '举报英雄', author_legacy: '著书立说', rural_star: '乡村振兴之星', exam_fail: '落榜' },
  init() {
    if (this._initialized) return;
    this._initialized = true;
    try {
      this.render();
      this.bindEvents();
      this.applyFontPreference();
      this.applyThemePreference();
      this.initThemeWatcher();
      // 兜底：个别嵌入式 webview 的 localStorage 水合晚于页面脚本，load 完成后重解析一次主题（幂等）
      window.addEventListener('load', () => this.applyThemePreference());
      if (typeof this.bindDesktopResize === 'function') this.bindDesktopResize();
      this.updateStatsDisplay();
    } catch (error) {
      this.renderFatalError(error);
      return;
    }
    if (!this.isStaticBuild || !this.isStaticBuild()) {
      try { this.checkBroadcast(); } catch (error) { this.showToast('公告暂时无法加载，本地游戏不受影响', 'warning'); }
    }
    try {
      if (typeof this.initAccount === 'function') this.initAccount();
    } catch (error) {
      this.showToast('账号服务暂不可用，本地存档仍可使用', 'warning');
    }
    // 音效激活：首次用户手势后解锁 AudioContext（移动端要求）
    const unlock = () => {
      try { this.ensureAudio(); } catch (error) {}
      document.removeEventListener('pointerdown', unlock);
      document.removeEventListener('keydown', unlock);
    };
    document.addEventListener('pointerdown', unlock);
    document.addEventListener('keydown', unlock);
    // 新人引导：首次打开显示
    setTimeout(() => {
      try {
        if (!localStorage.getItem('shangan_tut_done') && this.stats.plays === 0) this.showTutorial();
      } catch(e) {}
    }, 600);
    // v2.1.79 首次注册引导：玩过一局的游客温和提醒一次（内部自带防重复与延迟）
    setTimeout(() => {
      try { if (typeof this.maybePromptAccountSetup === 'function') this.maybePromptAccountSetup(); } catch(e) {}
    }, 1800);
  },
  renderFatalError(error) {
    this._bootError = error || null;
    const app = document.getElementById('app');
    if (!app) return;
    app.innerHTML = __h(`
      <section class="app-fatal" role="alert" aria-live="assertive">
        <div class="app-fatal-mark" aria-hidden="true">!</div>
        <h1>页面没有完整加载</h1>
        <p>界面初始化没有完成，本地存档不会因此被删除。</p>
        <p class="app-fatal-hint">请重新加载一次；如果仍然失败，可清除本网站缓存后再试。</p>
        <button type="button" class="btn btn-primary" data-boot-retry>重新加载</button>
      </section>
    `);
    const retry = app.querySelector('[data-boot-retry]');
    if (retry) retry.addEventListener('click', () => window.location.reload());
  },
  // 🎓 新人引导（首次游玩分页引导，可跳过；v2.1.79 改步进式降低首屏认知负担）
  showTutorial() {
    // v2.1.56：事件/结局计数动态引用（不再锁死具体数字，内容包扩充后自动同步）
    const eventCount = (typeof GameData !== 'undefined' && GameData.events && GameData.events.length) || 0;
    const endingCount = (this.ALL_ENDINGS || []).length;
    const steps = [
      { icon: '📋', title: '先建档', desc: '选出身、专业、天赋和单位——它们决定你的起点。天赋可加属性点，单位难度影响上岸成功率。' },
      { icon: '📝', title: '考公上岸', desc: '笔试靠知识，面试靠选择。答题正确率与属性（智商/情商）相关，落榜可以来年再战。' },
      { icon: '💼', title: '职业生涯', desc: '晋升靠工作能力、声誉和职务权重；压力过高会燃尽，风险过高会落马。每年可以休整减压；也可在生涯页承接有门槛的政策项目。' },
      { icon: '⚖️', title: '年度筹划', desc: '每年有一池精力（AP），在人脉经营、财务规划、子女培养之间自由取舍——用完即止。低权重事件会以"机会"形式浮现，花精力可主动追查。' },
      { icon: '🏆', title: '结局多样', desc: '安稳退休、巅峰人生、中央殿堂、清廉丰碑……图鉴里藏着全部' + endingCount + '种结局和' + eventCount + '个事件，多周目收集吧！' },
      { icon: '🎯', title: '挑战与回顾', desc: '"今日挑战"每天发同一个随机种子，和所有玩家比同一份命运；"人生回顾"能看职业路径图。每局结算页可一键生成分享卡。' },
      { icon: '💖', title: '支持与反馈', desc: '菜单里有赞赏码和支持渠道；有建议可直接留言，制作组会在管理后台回复你。' }
    ];
    const overlay = document.createElement('div');
    overlay.className = 'menu-overlay';
    overlay.innerHTML = __h(`
      <div class="menu-modal" role="dialog" aria-modal="true" aria-labelledby="tutorial-title" style="max-width:400px;padding:22px" data-tutorial-wrap>
        <div class="menu-header">
          <h2 id="tutorial-title">🎓 新手指引 <span style="font-size:11px;color:var(--ink-lighter);font-weight:normal" data-tutorial-count></span></h2>
          <button type="button" class="icon-btn" onclick="App.closeMenu()" aria-label="跳过引导" style="color:var(--ink)">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>
        <div data-tutorial-step style="margin:14px 0 6px"></div>
        <div data-tutorial-dots style="display:flex;gap:6px;justify-content:center;margin:12px 0"></div>
        <div style="display:flex;gap:8px">
          <button type="button" class="btn btn-secondary" data-tutorial-prev style="flex:0 0 76px">上一步</button>
          <button type="button" class="btn btn-primary" data-tutorial-next style="flex:1">下一步</button>
        </div>
        <p style="text-align:center;margin-top:10px"><button type="button" class="text-btn" data-tutorial-skip style="font-size:11px;color:var(--ink-lighter);background:none;border:none;cursor:pointer;text-decoration:underline">跳过引导，直接开始</button></p>
      </div>
    `);
    overlay.dataset.tutorialIndex = '0';
    const paint = () => {
      const idx = Number(overlay.dataset.tutorialIndex || 0);
      const step = steps[idx];
      const el = overlay.querySelector('[data-tutorial-step]');
      if (el) el.innerHTML = __h('<div style="text-align:center"><span style="font-size:44px;display:block;margin-bottom:6px">' + step.icon + '</span><p style="font-size:15px;font-weight:700;color:var(--vermilion)">' + step.title + '</p><p style="font-size:12.5px;color:var(--ink-light);line-height:1.8;margin-top:8px;text-align:left">' + step.desc + '</p></div>');
      const dots = overlay.querySelector('[data-tutorial-dots]');
      if (dots) dots.innerHTML = __h(steps.map((_, i) => '<span style="width:7px;height:7px;border-radius:50%;background:' + (i === idx ? 'var(--vermilion)' : 'var(--parchment-dark)') + ';transition:background .2s" aria-hidden="true"></span>').join(''));
      const count = overlay.querySelector('[data-tutorial-count]');
      if (count) count.textContent = (idx + 1) + ' / ' + steps.length;
      const prev = overlay.querySelector('[data-tutorial-prev]');
      const next = overlay.querySelector('[data-tutorial-next]');
      if (prev) prev.disabled = idx === 0;
      if (next) next.textContent = idx === steps.length - 1 ? '开始游戏，我明白了' : '下一步';
    };
    const go = delta => {
      const idx = Number(overlay.dataset.tutorialIndex || 0) + delta;
      if (idx < 0) return;
      if (idx >= steps.length) { this.finishTutorial(overlay); return; }
      overlay.dataset.tutorialIndex = String(idx);
      paint();
    };
    overlay.querySelector('[data-tutorial-prev]').onclick = () => go(-1);
    overlay.querySelector('[data-tutorial-next]').onclick = () => go(1);
    overlay.querySelector('[data-tutorial-skip]').onclick = () => this.finishTutorial(overlay);
    document.body.appendChild(overlay);
    paint();
    if (typeof this.bindModalOverlay === 'function') this.bindModalOverlay(overlay);
  },
  finishTutorial(btn) {
    try { localStorage.setItem('shangan_tut_done', '1'); } catch(e) {}
    if (btn && btn.closest('.menu-overlay')) this.closeMenu();
    this.showToast('祝仕途顺遂！', 'success');
    // v2.1.79 指引结束后紧接一次注册提示（未注册时；内部防重复）
    try { if (typeof this.maybePromptAccountSetup === 'function') this.maybePromptAccountSetup({ afterTutorial: true }); } catch(e) {}
  },
  // 📖 玩法说明（v2.1.59 帮助中心：随时可看的全系统说明，菜单入口）
  HELP_TOPICS: [
    { icon: '📋', title: '建档与开局', desc: '出身、专业、天赋、单位四项决定起点。天赋分 UR/SSR/SR/R 四档（开局 8 选 4），单位和专业影响考试与晋升。存款为零也可以上岸，心态别崩。' },
    { icon: '📝', title: '考试系统', desc: '笔试看四类知识题（言语/判断/数字/常识），面试看选项取舍。正确率与智商/情商相关；35 岁前可反复报考。' },
    { icon: '💼', title: '职业生涯', desc: '晋升看工作能力、声誉（组织印象）与职务权重；民主测评与答辩是关键节点。压力过高会燃尽，风险过高会被查，腐败会积累"热度"。' },
    { icon: '⚖️', title: '年度筹划（精力点）', desc: '每年一池精力（AP，默认 3 点，体质/天赋/年龄会浮动）：人脉经营、财务规划、子女培养共用这池精力。低权重事件会以"机会"卡片浮现，花 1 点精力可主动追查。' },
    { icon: '🤝', title: '人脉经营', desc: '拓展槽与责任槽并行：拓展认识新联系人，责任维系老关系。关系有信任、互惠、人情债与地域可达性；求助会欠人情，还人情能恢复。' },
    { icon: '🏘️', title: '政策项目与舆情', desc: '生涯页可承接政策项目（5 项目，每项目多个子案与 6-7 个决策点）；承接有职级/单位层级/工作年限门槛，未达标项目锁定并显示缺项。项目期间热度 ≥40 会触发舆情危机——公开回应、稳妥处置或压制扩散，各有代价；完成写入结局分支。' },
    { icon: '💰', title: '财务双表', desc: '现金与负债分账管理：借贷/网贷/博彩各有限额与利率，强制还本防利滚利。投资有正期望也有波动，财富影响结局与家庭压力。' },
    { icon: '👨‍👩‍👧', title: '家庭与子女', desc: '恋爱、结婚、生子走各自事件链；子女可教育投入/陪伴/放养，影响成才结局。家庭压力过高会拖垮事业。' },
    { icon: '🔁', title: '挑战长廊', desc: '九项跨周目执行性目标（清廉系/基层系结局累计、中央殿堂、硬核上岸、清官连胜等），每局结算自动推进；连胜中断即归零，进度随云存档同步。' },
    { icon: '🎯', title: '今日挑战', desc: '每天一个固定随机种子，所有玩家同一命运开局：同样的天赋候选、同样的单位、同样的事件序列——比的是经营水平。结算自动上报公开榜单。' },
    { icon: '🏆', title: '排行榜', desc: '本机历史局按总分排行（前三有奖牌标识）；每日种子挑战另有公开榜单，在"今日挑战"页查看。' },
    { icon: '📖', title: '图鉴与概率', desc: '图鉴记录见过的全部事件/flag/结局，完成度换天赋点与属性点奖励（多周目继承）；"结局概率"展示本机真实结局分布。' },
    { icon: '📜', title: '人生经历与状态总览', desc: '"人生经历"把全部留痕按仕途/处分/家庭/财务/人脉/项目/健康/考试分类归档，可筛选回看；右侧总览以绿/金/红三色标注声誉、口碑、现金、能力、廉洁、热度、压力、风险八项核心指标，悬停可见含义，超限项一目了然。' },
    { icon: '⛓️', title: '事件链与人生节点', desc: '部分事件是"刚性链"：关键选择落下标记后，延迟若干年必然触发下一步（如 50 岁后父母体检、28 岁后高息理财诱惑、26-45 岁一纸借调函），想退出需在节点上做显式选择。链节点不会从随机池提前抽出，遇到即是因果。' },
    { icon: '🧭', title: '人生回顾', desc: '职级阶梯图（X 轴年龄、Y 轴职级）标记晋升/降级/调任节点，附单位变动时间轴——退休后回看一生的起落。' },
    { icon: '🎨', title: '外观主题', desc: '设置菜单（更多设置）里可随时切换界面主题：浅色（素纸）、深色（夜色卷宗）或跟随系统。选择会保存，下次打开自动生效；跟随系统时随操作系统明暗实时变化。' }
  ],
  showHelp() {
    if (typeof this.setDesktopRoute === 'function') this.setDesktopRoute('menu', { sync: false });
    this.setTopBarTitle('玩法说明');
    const overlay = document.createElement('div');
    overlay.className = 'menu-overlay';
    const eventCount = (typeof GameData !== 'undefined' && GameData.events && GameData.events.length) || 0;
    // v2.1.79 帮助中心折叠：16 个主题改手风琴，默认首条展开；顶部提供"全部展开/收起"
    overlay.innerHTML = __h(`
      <div class="menu-modal" role="dialog" aria-modal="true" aria-labelledby="help-title" style="max-width:460px;padding:22px">
        <div class="menu-header">
          <h2 id="help-title">📖 玩法说明</h2>
          <button type="button" class="icon-btn" onclick="App.closeMenu()" aria-label="关闭" style="color:var(--ink)">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>
        <div style="display:flex;gap:8px;margin:6px 0 10px">
          <button type="button" class="btn btn-secondary" style="flex:1;padding:6px 8px;font-size:11px" onclick="App.toggleAllHelpTopics(true)">⊞ 全部展开</button>
          <button type="button" class="btn btn-secondary" style="flex:1;padding:6px 8px;font-size:11px" onclick="App.toggleAllHelpTopics(false)">⊟ 全部收起</button>
        </div>
        <div style="margin:0 0 10px;max-height:56vh;overflow-y:auto" data-help-accordion>
          ${this.HELP_TOPICS.map((s, i) => `
            <details class="help-topic"${i === 0 ? ' open' : ''}>
              <summary>${s.icon} ${s.title}</summary>
              <p>${s.desc}</p>
            </details>`).join('')}
          <p style="font-size:11px;color:var(--ink-lighter);margin-top:10px">数据规模：${eventCount} 个事件 · ${(this.ALL_ENDINGS || []).length} 种结局，持续扩充中。</p>
        </div>
        <button class="btn btn-primary" style="width:100%" onclick="App.closeMenu()">我知道了</button>
      </div>
    `);
    document.body.appendChild(overlay);
    if (typeof this.bindModalOverlay === 'function') this.bindModalOverlay(overlay);
  },
  toggleAllHelpTopics(open) {
    const host = document.querySelector('[data-help-accordion]');
    if (!host) return;
    host.querySelectorAll('details.help-topic').forEach(d => { d.open = open; });
  },
  // 📢 服务器广播公告（管理后台发布，热更新通知）
  checkBroadcast() {
    try {
      fetch('/api/broadcast')
        .then(r => r.json())
        .then(b => {
          if (!b) { this.hideBroadcastBanner(); return; }
          this.showBroadcastBanner(b);
        })
        .catch(() => {});
    } catch(e) {}
  },
  showBroadcastBanner(b) {
    let banner = document.getElementById('bcast-banner');
    if (!banner) {
      banner = document.createElement('div');
      banner.id = 'bcast-banner';
      banner.className = 'bcast-banner';
      document.querySelector('.phone-shell') ? document.querySelector('.phone-shell').prepend(banner) : document.body.prepend(banner);
    }
    // v2.1.81 区分全服公告与定向私信：定向消息以私信样式呈现，避免与运营公告混淆
    const isDirect = !!(b && b.targets && b.targets.length);
    const timeStr = (b.endAt ? ' · 预计' + new Date(b.endAt).toLocaleString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) + '结束' : '');
    const title = this.escapeHtml(b.title || '服务器公告');
    const content = this.escapeHtml(b.content || '').replace(/\n/g, '<br>');
    banner.innerHTML = __h(`
      <div class="bcast-icon">${isDirect ? '📨' : '📢'}</div>
      <div class="bcast-body">
        <div class="bcast-title">${isDirect ? '<span class="bcast-tag bcast-tag-direct">私信</span>' : '<span class="bcast-tag">公告</span>'} ${title}${timeStr}</div>
        <div class="bcast-content">${content}</div>
      </div>
      <button type="button" class="bcast-close" onclick="document.getElementById('bcast-banner').remove()" title="关闭" aria-label="关闭消息">✕</button>
    `);
  },
  hideBroadcastBanner() {
    const banner = document.getElementById('bcast-banner');
    if (banner) banner.remove();
  },
  render() {
    const app = document.getElementById('app');
    if (!app) throw new Error('应用容器不存在');
    const desktopLayout = typeof this.isDesktopLayout === 'function' && this.isDesktopLayout();
    const compactDesktop = desktopLayout && typeof window !== 'undefined' && Number(window.innerWidth || 0) < 1024;
    app.innerHTML = __h(`
      <div class="game-container desktop-workspace${compactDesktop ? ' desktop-nav-collapsed' : ''}">
        <aside class="desktop-nav" id="desktop-nav" aria-label="游戏导航">
          ${this.renderDesktopNav ? this.renderDesktopNav() : ''}
        </aside>
        <div class="desktop-nav-scrim" id="desktop-nav-scrim" aria-hidden="true" onclick="App.toggleDesktopNav(false)"></div>
        <main class="phone-shell desktop-main-panel">
          ${this.renderTopBar()}
          ${this.renderStatus()}
          ${this.renderMobileDataDrawer()}
          <div class="content" id="game-content" tabindex="-1">
            ${this.renderIntro()}
          </div>
        </main>
        <div class="side-panel" id="side-panel">
          ${this.renderDesktopInspector ? this.renderDesktopInspector() : this.renderSidePanel()}
        </div>
      </div>
    `);
    this.enhanceKeyboardTargets(app);
  },
  renderTopBar() {
    const width = typeof window !== 'undefined' ? Number(window.innerWidth || 0) : 0;
    const desktop = !!(this.isDesktopLayout && width > 800);
    const navOpen = desktop && width >= 1024;
    const navLabel = desktop ? (width < 1024 ? '打开侧栏' : '收起侧栏') : '打开菜单';
    return `
      <header class="topbar">
        <div>
          <p class="brand">上岸模拟器 · 墨韵官印</p>
          <h1 id="phase-title">${this.getTopBarTitle()}</h1>
        </div>
        <button type="button" class="icon-btn" id="desktop-nav-toggle" onclick="App.handleDesktopMenu ? App.handleDesktopMenu() : App.showMenu()" title="${navLabel}" aria-label="${navLabel}" aria-controls="desktop-nav" aria-expanded="${navOpen ? 'true' : 'false'}">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
        </button>
      </header>
    `;
  },
  getPhaseTitle() {
    const phases = {
      intro: '开局档案', background: '出身背景', era: '时代剧本', major: '选择专业', talents: '选取天赋', personality: '性格与志向',
      attrs: '属性成长', units: '报考单位', written: '笔试',
      interview: '面试', result: '考试结果', career: '职业生涯',
      event: '突发事件', ending: '人生结算', menu: '菜单',
    };
    return phases[engine.getPhase()] || '上岸模拟器';
  },
  getTopBarTitle() {
    if (this._topBarTitleOverride) return this._topBarTitleOverride;
    const routeTitles = {
      codex: '事件图鉴',
      experience: '人生经历',
      history: '人生记录',
      support: '支持与反馈',
      account: '账号与存档',
      network: '人脉网络',
      menu: '菜单',
    };
    const route = this._desktopActiveRoute;
    return routeTitles[route] || this.getPhaseTitle();
  },
  setTopBarTitle(title) {
    this._topBarTitleOverride = title ? String(title) : '';
    this.syncTopBarTitle();
  },
  syncTopBarTitle() {
    const header = document.getElementById('phase-title') || document.querySelector('.topbar h1');
    if (header) header.textContent = this.getTopBarTitle();
  },
  // v2.29 提示可见性：时代标签与民间口碑动态描述
  getEraLabel() {
    const era = engine.getState().era;
    const labels = { reform: '改革年代', stable: '平稳年代', rectify: '整顿年代' };
    return labels[era] || '平稳年代';
  },
  getPeoplePhrase() {
    const r = (engine.getPlayer().peopleReputation || 50);
    if (r >= 80) return '群众交口称赞';
    if (r >= 60) return '群众认可有加';
    if (r >= 40) return '群众印象平平';
    return '群众颇有意见';
  },
  renderStatus() {
    const p = engine.getPlayer() || {};
    return `
      <section class="status">
        <div><strong>${p.age || 0}</strong><span>年龄</span></div>
        <div><strong>${this.escapeHtml(p.name) || '未命名'}</strong><span>${this.escapeHtml(p.gender || '男')}</span></div>
        <div><strong>${this.getEducationLabel(p.education)}</strong><span>${this.getPoliticalLabel(p.political)}</span></div>
        <div><strong>${p.isEmployed ? '在职' : '备考'}</strong><span>${p.isEmployed ? '已上岸' : '未上岸'}</span></div>
        <div><strong>${this.getEraLabel()}</strong><span>${this.getPeoplePhrase()}</span></div>
        <div id="persistence-status" data-state="unknown" style="font-size:10px;color:var(--ink-lighter)"><strong>💾</strong><span>本地存档</span></div>
      </section>
    `;
  },
  // 手机端数据卷宗：滑动标签切换数据面板（属性/隐藏/职务/人脉）
  renderMobileDataDrawer() {
    const a = engine.getAttrs();
    const h = engine.getHidden();
    const p = engine.getPlayer();
    const lyH = p.lastYearHidden || {};
    const isActive = engine.getPhase() === 'career' || engine.getPhase() === 'event';
    const validTabs = ['overview', 'attrs', 'hidden', 'career', 'contact'];
    const activeTab = validTabs.includes(this._mobileActiveTab) ? this._mobileActiveTab : 'overview';

    // v2.1.70 移动总览：8 项核心指标 + 绿/金/红语义色标（与桌面 inspector 同口径，独立渲染）
    const mTone = (value, goodMin, badMax) => value >= goodMin ? 'is-good' : (value <= badMax ? 'is-bad' : 'is-warn');
    const mRep = Math.round(p.reputation || 50);
    const mPp = Math.round(p.peopleReputation || 50);
    const mCash = p.finance ? Math.round(p.finance.cash) : Math.round(p.wealth || 0);
    const mDebt = p.finance && typeof engine.debtTotal === 'function' ? Math.round(engine.debtTotal()) : 0;
    const mHeat = Math.round(p.heat || 0);
    const overviewPanel = `
      <div class="m-drawer-panel" id="mobile-panel-overview" role="tabpanel" aria-labelledby="mobile-tab-overview" data-panel="overview"${activeTab === 'overview' ? '' : ' hidden'}>
        <div class="m-overview-grid">
          <div class="m-overview-metric ${mTone(mRep, 70, 40)}" title="声誉（组织印象）"><strong>${mRep}</strong><span>声誉</span></div>
          <div class="m-overview-metric ${mTone(mPp, 60, 30)}" title="口碑（民间口碑）"><strong>${mPp}</strong><span>口碑</span></div>
          <div class="m-overview-metric ${mDebt > 0 ? 'is-bad' : mTone(mCash, 120, 60)}" title="现金结余（负债红色警示）"><strong>${mCash}${mDebt > 0 ? ' ⁄负' + mDebt : ''}</strong><span>现金</span></div>
          <div class="m-overview-metric ${mTone(Math.round(h.workAbility || 0), 70, 40)}" title="工作能力"><strong>${Math.round(h.workAbility || 0)}</strong><span>能力</span></div>
          <div class="m-overview-metric ${mTone(Math.round(h.integrity || 0), 70, 40)}" title="廉洁（底线储备）"><strong>${Math.round(h.integrity || 0)}</strong><span>廉洁</span></div>
          <div class="m-overview-metric ${mHeat >= 70 ? 'is-bad' : (mHeat >= 40 ? 'is-warn' : '')}" title="热度（纪检关注度）"><strong>${mHeat}</strong><span>热度</span></div>
          <div class="m-overview-metric ${Math.round(h.mentalPressure || 0) >= 80 ? 'is-bad' : (Math.round(h.mentalPressure || 0) >= 60 ? 'is-warn' : '')}" title="心理压力"><strong>${Math.round(h.mentalPressure || 0)}</strong><span>压力</span></div>
          <div class="m-overview-metric ${Math.round(h.risk || 0) >= 70 ? 'is-bad' : (Math.round(h.risk || 0) >= 40 ? 'is-warn' : '')}" title="违纪风险池"><strong>${Math.round(h.risk || 0)}</strong><span>风险</span></div>
        </div>
        <p class="m-overview-legend"><span class="is-good">绿</span> 健康线内 · <span class="is-warn">金</span> 临界 · <span class="is-bad">红</span> 危险</p>
        <button type="button" class="btn btn-secondary" onclick="App.showExperience()" style="width:100%;margin-top:6px">📜 人生经历（分类回看留痕）</button>
      </div>`;

    const attrPanel = `
      <div class="m-drawer-panel" id="mobile-panel-attrs" role="tabpanel" aria-labelledby="mobile-tab-attrs" data-panel="attrs"${activeTab === 'attrs' ? '' : ' hidden'}>
        <div class="attr-grid">
          ${this.renderAttrGrid(a)}
        </div>
      </div>`;
    const hiddenPanel = `
      <div class="m-drawer-panel" id="mobile-panel-hidden" role="tabpanel" aria-labelledby="mobile-tab-hidden" data-panel="hidden"${activeTab === 'hidden' ? '' : ' hidden'}>
        <div class="hidden-grid">
          ${this.renderHiddenGrid(h, lyH)}
        </div>
      </div>`;
    const careerPanel = `
      <div class="m-drawer-panel" id="mobile-panel-career" role="tabpanel" aria-labelledby="mobile-tab-career" data-panel="career"${activeTab === 'career' ? '' : ' hidden'}>
        <div class="career-meta">
          <p>🏛 职务: ${this.escapeHtml(engine.getCurrentPositionTitle ? engine.getCurrentPositionTitle() : (p.unit ? p.unit.name : '无'))}</p>
          <p>📍 单位: ${this.escapeHtml(p.unit ? p.unit.name : '无')}（${this.escapeHtml(p.unit ? p.unit.level : '无')}）</p>
          <p>📅 工作 ${p.yearsWorked || 0} 年</p>
          <p>⭐ 职级: ${engine.getRankLabel ? engine.getRankLabel(p.leadershipRank) : p.leadershipRank + '级'}（${p.leadershipRank}级）</p>
          <p>🏆 晋升 ${p.promotions || 0} 次</p>
          <p>⭐ 声誉: ${Math.round(p.reputation || 50)} ${(p.reputation || 50) > 70 ? '🟢' : (p.reputation || 50) < 30 ? '🔴' : '🟡'}</p>
          <p>🤝 口碑: ${Math.round(p.peopleReputation || 50)} ${(p.peopleReputation || 50) > 70 ? '🟢' : (p.peopleReputation || 50) < 30 ? '🔴' : '🟡'} · ${this.getPeoplePhrase()}</p>
          <p>🏛️ 时代: ${this.getEraLabel()}${engine.getState().era === 'rectify' ? '（廉洁优先，腐败严查）' : engine.getState().era === 'reform' ? '（晋升更快，改革浪潮）' : '（安稳为主，论资排辈）'}</p>
          <p>🔥 热度: ${Math.round(p.heat || 0)} ${(p.heat || 0) > 60 ? '🔴' : (p.heat || 0) > 30 ? '🟡' : '🟢'}</p>
          ${p.wealth !== undefined ? `<p>💰 现金: ${p.finance ? p.finance.cash : p.wealth}${p.finance && engine.debtTotal() > 0 ? ' · 负债: ' + Math.round(engine.debtTotal()) : ''}</p>` : ''}
        </div>
      </div>`;
    const contactPanel = `
      <div class="m-drawer-panel" id="mobile-panel-contact" role="tabpanel" aria-labelledby="mobile-tab-contact" data-panel="contact"${activeTab === 'contact' ? '' : ' hidden'}>
        ${p.contacts && p.contacts.length > 0 ? `
          <div class="career-meta">
            <p style="font-size:11px;font-weight:600;color:var(--ink-lighter);margin-bottom:4px">🤝 人脉 (${p.contacts.length})</p>
            ${p.contacts.slice(0, 6).map(c => `
              <p style="font-size:11px;color:var(--ink-light)">${this.escapeHtml(c.name)} · ${c.relation > 30 ? '🟢' : c.relation > 0 ? '🟡' : '🔴'} ${Math.round(Number(c.relation) || 0)}${c.position ? ' · ' + this.escapeHtml(c.position) : ''}</p>
            `).join('')}
            ${p.contacts.length > 6 ? `<p style="font-size:10px;color:var(--ink-lighter)">+${p.contacts.length - 6}人…</p>` : ''}
          </div>` : '<p style="font-size:11px;color:var(--ink-lighter);padding:10px">暂无联系人</p>'}
      </div>`;

    return `
      <div class="m-drawer" id="mobile-drawer">
        <div class="m-drawer-tabs" role="tablist" aria-label="移动数据面板">
          <button type="button" role="tab" id="mobile-tab-overview" class="m-tab${activeTab === 'overview' ? ' active' : ''}" data-tab="overview" aria-controls="mobile-panel-overview" aria-selected="${activeTab === 'overview'}" tabindex="${activeTab === 'overview' ? '0' : '-1'}" onclick="App.switchMobileTab('overview')" onkeydown="App.handleMobileTabKeydown(event)">📊 总览</button>
          <button type="button" role="tab" id="mobile-tab-attrs" class="m-tab${activeTab === 'attrs' ? ' active' : ''}" data-tab="attrs" aria-controls="mobile-panel-attrs" aria-selected="${activeTab === 'attrs'}" tabindex="${activeTab === 'attrs' ? '0' : '-1'}" onclick="App.switchMobileTab('attrs')" onkeydown="App.handleMobileTabKeydown(event)">📊 属性</button>
          <button type="button" role="tab" id="mobile-tab-hidden" class="m-tab${activeTab === 'hidden' ? ' active' : ''}" data-tab="hidden" aria-controls="mobile-panel-hidden" aria-selected="${activeTab === 'hidden'}" tabindex="${activeTab === 'hidden' ? '0' : '-1'}" onclick="App.switchMobileTab('hidden')" onkeydown="App.handleMobileTabKeydown(event)">🔍 隐藏</button>
          <button type="button" role="tab" id="mobile-tab-career" class="m-tab${activeTab === 'career' ? ' active' : ''}" data-tab="career" aria-controls="mobile-panel-career" aria-selected="${activeTab === 'career'}" tabindex="${activeTab === 'career' ? '0' : '-1'}" onclick="App.switchMobileTab('career')" onkeydown="App.handleMobileTabKeydown(event)">🏛 职务</button>
          <button type="button" role="tab" id="mobile-tab-contact" class="m-tab${activeTab === 'contact' ? ' active' : ''}" data-tab="contact" aria-controls="mobile-panel-contact" aria-selected="${activeTab === 'contact'}" tabindex="${activeTab === 'contact' ? '0' : '-1'}" onclick="App.switchMobileTab('contact')" onkeydown="App.handleMobileTabKeydown(event)">🤝 人脉</button>
        </div>
        <div class="m-drawer-body">
          ${overviewPanel}${attrPanel}${hiddenPanel}${careerPanel}${contactPanel}
        </div>
      </div>
    `;
  },
  switchMobileTab(tab) {
    const drawer = document.getElementById('mobile-drawer');
    if (!drawer) return;
    const validTabs = ['overview', 'attrs', 'hidden', 'career', 'contact'];
    if (!validTabs.includes(tab)) return;
    this._mobileActiveTab = tab;
    drawer.querySelectorAll('.m-tab').forEach(t => {
      const active = t.dataset.tab === tab;
      t.classList.toggle('active', active);
      t.setAttribute('aria-selected', String(active));
      t.setAttribute('tabindex', active ? '0' : '-1');
    });
    drawer.querySelectorAll('.m-drawer-panel').forEach(panel => {
      panel.hidden = panel.dataset.panel !== tab;
    });
  },
  handleMobileTabKeydown(event) {
    if (!event || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    const drawer = document.getElementById('mobile-drawer');
    const tabs = drawer ? Array.from(drawer.querySelectorAll('[role="tab"]')) : [];
    if (!tabs.length) return;
    const current = tabs.indexOf(event.currentTarget);
    const index = current >= 0 ? current : 0;
    let next = index;
    if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    event.preventDefault();
    const tab = tabs[next];
    if (!tab) return;
    this.switchMobileTab(tab.dataset.tab);
    if (typeof tab.focus === 'function') tab.focus();
  },
  getEducationLabel(e) { return { bachelor: '本科', master: '硕士', doctor: '博士' }[e] || '本科'; },
  getPoliticalLabel(p) { return { mass: '群众', cpc: '党员', democratic: '民主党派' }[p] || '群众'; },
  renderSidePanel() {
    const a = engine.getAttrs();
    const h = engine.getHidden();
    const p = engine.getPlayer();
    const lyH = p.lastYearHidden || {};
    const isActive = engine.getPhase() === 'career' || engine.getPhase() === 'event';

    return `
      <div class="panel-section">
        <h3>📊 属性面板</h3>
        <div class="attr-grid">
          ${this.renderAttrGrid(a)}
        </div>
        <h3 style="margin-top:12px">🔍 隐藏属性</h3>
        <div class="hidden-grid">
          ${this.renderHiddenGrid(h, lyH)}
        </div>
        ${isActive ? `
          <div class="career-meta">
            <p>🏛 职务: ${this.escapeHtml(engine.getCurrentPositionTitle ? engine.getCurrentPositionTitle() : (p.unit ? p.unit.name : '无'))}</p>
            <p>📍 单位: ${this.escapeHtml(p.unit ? p.unit.name : '无')}（${this.escapeHtml(p.unit ? p.unit.level : '无')}）</p>
            <p>📅 工作 ${p.yearsWorked || 0} 年</p>
            <p>⭐ 职级: ${engine.getRankLabel ? engine.getRankLabel(p.leadershipRank) : p.leadershipRank + '级'}（${p.leadershipRank}级）</p>
            <p>🏆 晋升 ${p.promotions || 0} 次</p>
            <p>⭐ 声誉: ${Math.round(p.reputation || 50)} ${(p.reputation || 50) > 70 ? '🟢' : (p.reputation || 50) < 30 ? '🔴' : '🟡'}</p>
            <p>🤝 口碑: ${Math.round(p.peopleReputation || 50)} ${(p.peopleReputation || 50) > 70 ? '🟢' : (p.peopleReputation || 50) < 30 ? '🔴' : '🟡'}</p>
            <p>🔥 热度: ${Math.round(p.heat || 0)} ${(p.heat || 0) > 60 ? '🔴' : (p.heat || 0) > 30 ? '🟡' : '🟢'}</p>
            <p>💰 现金: ${p.finance ? p.finance.cash : (p.wealth || 0)}${p.finance && engine.debtTotal() > 0 ? ' · 负债: <span style="color:var(--ui-danger)">' + Math.round(engine.debtTotal()) + '</span>' : ''}</p>
          </div>
          ${p.contacts && p.contacts.length > 0 ? `
          <div class="career-meta" style="margin-top:8px">
            <p style="font-size:11px;font-weight:600;color:var(--ink-lighter);margin-bottom:4px">🤝 人脉 (${p.contacts.length})</p>
            ${p.contacts.slice(0, 3).map(c => `
              <p style="font-size:10px;color:var(--ink-light)">${this.escapeHtml(c.name)} · ${c.relation > 30 ? '🟢' : c.relation > 0 ? '🟡' : '🔴'} ${Math.round(Number(c.relation) || 0)}</p>
            `).join('')}
            ${p.contacts.length > 3 ? `<p style="font-size:10px;color:var(--ink-lighter)">+${p.contacts.length - 3}人…</p>` : ''}
          </div>` : ''}
        ` : ''}
      </div>
    `;
  },
  renderAttrBar(label, val, min, max, color) {
    const numericVal = Number.isFinite(Number(val)) ? Number(val) : min;
    const pct = ((numericVal - min) / Math.max(1, max - min)) * 100;
    return `
      <div class="attr-item">
        <span class="attr-label">${label}</span>
        <div class="bar-track">
          <div class="bar-fill" style="width:${Math.max(0, Math.min(100, pct))}%;background:${color}"></div>
        </div>
        <span class="attr-value">${numericVal}</span>
      </div>
    `;
  },
  renderHiddenBar(label, val, min, max, color, lastVal) {
    const numericVal = Number.isFinite(Number(val)) ? Number(val) : min;
    const pct = ((numericVal - min) / Math.max(1, max - min)) * 100;
    const warning = numericVal > 80 ? '⚠️' : numericVal > 60 ? '⚡' : '';
    let delta = '';
    if (lastVal !== undefined && lastVal !== null && numericVal !== Number(lastVal)) {
      const diff = Math.round(numericVal - Number(lastVal));
      delta = diff > 0 ? `<span style="color:var(--ui-danger);font-size:10px">▲${diff}</span>` : `<span style="color:var(--ui-green);font-size:10px">▼${Math.abs(diff)}</span>`;
    }
    return `
      <div class="attr-item">
        <span class="attr-label">${label}</span>
        <div class="bar-track">
          <div class="bar-fill" style="width:${Math.max(0, Math.min(100, pct))}%;background:${color}"></div>
        </div>
        <span class="attr-value">${numericVal}${warning}${delta}</span>
      </div>
    `;
  },
  // v2.1.67 结构收敛：属性网格与隐藏属性网格的 innerHTML 片段（移动端抽屉与桌面侧栏共用）
  renderAttrGrid(a) {
    return `
      ${this.renderAttrBar('智商', a.iq, -5, 15, 'var(--ui-blue)')}
      ${this.renderAttrBar('情商', a.eq, -5, 15, 'var(--ui-green)')}
      ${this.renderAttrBar('运气', a.luck, -5, 15, 'var(--ui-gold)')}
      ${this.renderAttrBar('家境', a.family, -5, 15, 'var(--grade-d)')}
      ${this.renderAttrBar('外貌', a.appearance, -5, 15, '#EC407A')}
      ${this.renderAttrBar('体质', a.body, -5, 15, '#26C6DA')}
    `;
  },
  renderHiddenGrid(h, lyH) {
    return `
      ${this.renderHiddenBar('工作能力', h.workAbility, 0, 100, 'var(--ui-blue)', lyH.workAbility)}
      ${this.renderHiddenBar('心理压力', h.mentalPressure, 0, 100, 'var(--ui-danger)', lyH.mentalPressure)}
      ${this.renderHiddenBar('风险', h.risk, 0, 100, '#F4511E', lyH.risk)}
      ${this.renderHiddenBar('廉洁', h.integrity, 0, 100, '#43A047', lyH.integrity)}
      ${this.renderHiddenBar('背景', h.background, 0, 100, '#8E24AA', lyH.background)}
      ${this.renderHiddenBar('欲望', h.desire, 0, 100, '#FB8C00', lyH.desire)}
      ${this.renderHiddenBar('家庭压力', h.familyPressure, 0, 100, '#E53935', lyH.familyPressure)}
      ${this.renderHiddenBar('职务权重', h.positionWeight, 0, 100, '#1E88E5', lyH.positionWeight)}
    `;
  },
  enhanceKeyboardTargets(root) {
    const scope = root && typeof root.querySelectorAll === 'function' ? root : document;
    const nativeTags = new Set(['BUTTON', 'A', 'INPUT', 'SELECT', 'TEXTAREA', 'SUMMARY']);
    scope.querySelectorAll('[onclick]').forEach(el => {
      if (nativeTags.has(el.tagName) || el.dataset.keyboardBound === '1') return;
      if (!String(el.getAttribute('onclick') || '').trim() || el.classList.contains('disabled') || el.getAttribute('aria-disabled') === 'true' || el.getAttribute('aria-hidden') === 'true' || el.hasAttribute('inert')) return;
      el.dataset.keyboardBound = '1';
      if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '0');
      if (!el.hasAttribute('role')) el.setAttribute('role', 'button');
      el.addEventListener('keydown', event => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        el.click();
      });
    });
  },
  bindContentActions() {
    if (this._contentActionsBound || typeof document === 'undefined' || typeof document.addEventListener !== 'function') return;
    this._contentActionsBound = true;
    document.addEventListener('click', event => {
      const origin = event && event.target;
      const target = origin && typeof origin.closest === 'function'
        ? origin.closest('[data-written-answer], [data-interview-answer], [data-event-choice], [data-defense-answer]')
        : null;
      const content = document.getElementById('game-content');
      if (!target || !content || typeof content.contains !== 'function' || !content.contains(target)) return;
      if (target.disabled || target.getAttribute('aria-disabled') === 'true') return;
      event.preventDefault();
      if (target.hasAttribute('data-event-choice')) {
        this.handleEventChoice(Number(target.getAttribute('data-event-choice')));
        return;
      }
      if (target.hasAttribute('data-defense-answer')) {
        this.defenseAnswer(Number(target.getAttribute('data-defense-answer')));
        return;
      }
      this.safeProcess(() => {
        if (target.hasAttribute('data-written-answer')) this.answerWritten(target.getAttribute('data-written-answer'));
        else if (target.hasAttribute('data-interview-answer')) this.answerInterview(Number(target.getAttribute('data-interview-answer')));
      });
    });
  },
  captureTextFieldState(id) {
    const field = document.getElementById(id);
    if (!field || document.activeElement !== field) return null;
    return {
      id,
      start: typeof field.selectionStart === 'number' ? field.selectionStart : null,
      end: typeof field.selectionEnd === 'number' ? field.selectionEnd : null,
      direction: field.selectionDirection || 'none'
    };
  },
  restoreTextFieldState(state) {
    if (!state || !state.id) return;
    const field = document.getElementById(state.id);
    if (!field || typeof field.focus !== 'function') return;
    try { field.focus({ preventScroll: true }); } catch (e) { field.focus(); }
    if (state.start !== null && typeof field.setSelectionRange === 'function') {
      const max = String(field.value || '').length;
      const start = Math.min(max, Math.max(0, state.start));
      const end = Math.min(max, Math.max(start, state.end == null ? start : state.end));
      try { field.setSelectionRange(start, end, state.direction || 'none'); } catch (e) { field.setSelectionRange(start, end); }
    }
  },
  bindModalOverlay(overlay, options) {
    if (!overlay) return overlay;
    const opts = options || {};
    if (document.body && document.body.classList) document.body.classList.add('modal-open');
    overlay.__returnFocus = opts.returnFocus || document.activeElement;
    if (overlay.__modalKeydown) overlay.removeEventListener('keydown', overlay.__modalKeydown);
    const requestClose = () => {
      if (typeof opts.beforeClose === 'function' && opts.beforeClose() === false) return false;
      this.closeMenu();
      return true;
    };
    overlay.__modalRequestClose = requestClose;
    if (opts.closeOnBackdrop !== false) {
      overlay.addEventListener('click', event => {
        if (event.target === overlay) requestClose();
      });
    }
    overlay.__modalKeydown = event => {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        requestClose();
        return;
      }
      if (event.key !== 'Tab') return;
      const focusable = Array.from(overlay.querySelectorAll('button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'))
        .filter(node => node.offsetParent !== null || node === document.activeElement);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && (document.activeElement === first || !overlay.contains(document.activeElement))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !overlay.contains(document.activeElement))) {
        event.preventDefault();
        first.focus();
      }
    };
    overlay.addEventListener('keydown', overlay.__modalKeydown);
    this.enhanceKeyboardTargets(overlay);
    const focusTarget = overlay.querySelector(opts.focusSelector || '[data-autofocus], .menu-header .icon-btn, button, input, select, textarea');
    if (focusTarget && typeof focusTarget.focus === 'function') focusTarget.focus();
    return overlay;
  },
  renderContent(html) {
    const content = document.getElementById('game-content');
    if (!content) return;
    content.innerHTML = __h(html);
    this.syncTopBarTitle();
    this.enhanceKeyboardTargets(content);
    this.resetContentScroll();
  },
  resetContentScroll() {
    const content = document.querySelector('.content');
    const gameContent = document.getElementById('game-content');
    [content, gameContent].forEach(element => {
      if (!element) return;
      if (typeof element.scrollTo === 'function') {
        try { element.scrollTo({ left: 0, top: 0, behavior: 'auto' }); } catch (e) { element.scrollTop = 0; element.scrollLeft = 0; }
      } else {
        element.scrollTop = 0;
        element.scrollLeft = 0;
      }
    });
    const scrollingElement = typeof document !== 'undefined' ? (document.scrollingElement || document.documentElement) : null;
    if (scrollingElement) {
      scrollingElement.scrollTop = 0;
      scrollingElement.scrollLeft = 0;
    }
    if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
      try { window.scrollTo({ left: 0, top: 0, behavior: 'auto' }); } catch (e) { window.scrollTo(0, 0); }
    }
  },
  updateStatus() {
    const header = document.querySelector('.topbar h1');
    if (header) header.textContent = this.getTopBarTitle();
    const statusBar = document.querySelector('.status');
    if (statusBar) statusBar.outerHTML = __h(this.renderStatus());
    const drawer = document.getElementById('mobile-drawer');
    if (drawer) drawer.outerHTML = __h(this.renderMobileDataDrawer());
    const sidePanel = document.getElementById('side-panel');
    const desktopSidebarVisible = typeof this.isDesktopLayout !== 'function' || this.isDesktopLayout();
    if (sidePanel && desktopSidebarVisible) {
      if (typeof this.updateDesktopInspector === 'function') this.updateDesktopInspector();
      else sidePanel.innerHTML = __h(this.renderSidePanel());
    }
    if (typeof this.syncDesktopWorkspace === 'function') this.syncDesktopWorkspace({ navOnly: true });
    if (typeof this.updatePersistenceStatus === 'function') this.updatePersistenceStatus();
  },
  updateStatsDisplay() {
    const el = document.getElementById('stats-display');
    if (!el) return;
    el.textContent = `总局:${this.stats.plays} 上岸:${this.stats.passes} 最高:${this.stats.bestScore}`;
  },
  safeProcess(fn) {
    if (this.isProcessing) return;
    this.isProcessing = true;
    try {
      if (typeof fn === 'function') fn();
    } catch(e) {
      const message = e && e.message ? e.message : '请稍后重试';
      this.showToast('操作出错：' + message, 'error');
    }
    finally { this.isProcessing = false; }
  },
  soundOn() { try { return localStorage.getItem('sound_on') !== '0'; } catch(e) { return true; } },
  toggleSound() {
    const on = !this.soundOn();
    try { localStorage.setItem('sound_on', on ? '1' : '0'); } catch(e) {}
    this.showToast(on ? '🔊 音效已开启' : '🔇 音效已关闭', 'info');
    return on;
  },
  // v2.1.37 无障碍大字号模式：正文与选项文字整体放大一档，偏好持久化并随页面初始化生效
  fontLargeOn() { try { return localStorage.getItem('font_large') === '1'; } catch(e) { return false; } },
  applyFontPreference() {
    if (document.body && document.body.classList) document.body.classList.toggle('font-large', this.fontLargeOn());
  },
  toggleFontLarge() {
    const on = !this.fontLargeOn();
    try { localStorage.setItem('font_large', on ? '1' : '0'); } catch(e) {}
    this.applyFontPreference();
    this.showToast(on ? '🔍 大字号已开启' : '🔍 大字号已关闭', 'info');
    return on;
  },
  // v2.1.75 UI 主题三态：浅色 / 深色 / 跟随系统（默认 system，沿用既有暗色令牌体系）
  // v2.1.79 主题解析统一：system 态也解析为 light/dark 并总是设置 data-theme，
  // 使所有暗色组件规则只依赖 html[data-theme]，消除"系统深色+用户选浅色"时
  // 媒体查询组件规则与浅色变量混搭的黑白转换错乱（index.html 头部引导脚本同源）。
  themePref() { try { const v = localStorage.getItem('ui_theme'); return (v === 'light' || v === 'dark') ? v : 'system'; } catch(e) { return 'system'; } },
  systemPrefersDark() { return !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches); },
  applyThemePreference() {
    const root = document.documentElement;
    if (!root) return;
    const pref = this.themePref();
    const dark = pref === 'dark' || (pref === 'system' && this.systemPrefersDark());
    root.setAttribute('data-theme', dark ? 'dark' : 'light');
  },
  // 跟随系统档实时性：OS 明暗切换时立即重解析 data-theme（仅 system 偏好下响应）
  initThemeWatcher() {
    if (!window.matchMedia) return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => { if (this.themePref() === 'system') this.applyThemePreference(); };
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else if (mq.addListener) mq.addListener(onChange);
  },
  THEME_LABELS: { light: '☀️ 浅色', dark: '🌙 深色', system: '🖥️ 跟随系统' },
  cycleTheme() {
    const next = { 'system': 'light', 'light': 'dark', 'dark': 'system' }[this.themePref()];
    try { localStorage.setItem('ui_theme', next); } catch(e) {}
    this.applyThemePreference();
    this.showToast('🎨 主题已切换为' + (this.THEME_LABELS[next] || next), 'info');
    return next;
  },
  // 音效引擎：AudioContext 全局复用（只创建一次），首次用户手势后激活
  _audioCtx: null,
  _audioMaster: null,
  getAudioCtx() {
    if (this._audioCtx) return this._audioCtx;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      this._audioCtx = new AC();
      this._audioMaster = this._audioCtx.createGain();
      this._audioMaster.gain.value = 0.5;
      this._audioMaster.connect(this._audioCtx.destination);
    } catch(e) { return null; }
    return this._audioCtx;
  },
  ensureAudio() {
    const ctx = this.getAudioCtx();
    if (ctx && ctx.state === 'suspended') { ctx.resume().catch(() => {}); }
    return ctx;
  },
  playSound(type) {
    if (!this.soundOn()) return;
    const ctx = this.ensureAudio();
    if (!ctx) return;
    try {
      // 触觉反馈（移动端）
      if (navigator.vibrate) { try { navigator.vibrate(type === 'promote' ? [30, 40, 30] : type === 'arrest' ? [60] : 15); } catch(e) {} }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(this._audioMaster || ctx.destination);
      const now = ctx.currentTime;
      // 简单音色：三角波更柔和
      osc.type = 'triangle';
      if (type === 'promote') { osc.frequency.setValueAtTime(523, now); osc.frequency.setValueAtTime(659, now + 0.12); osc.frequency.setValueAtTime(784, now + 0.24); gain.gain.setValueAtTime(0.15, now); gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5); osc.start(now); osc.stop(now + 0.5); }
      else if (type === 'arrest') { osc.frequency.setValueAtTime(196, now); osc.frequency.setValueAtTime(185, now + 0.15); osc.frequency.setValueAtTime(175, now + 0.3); gain.gain.setValueAtTime(0.2, now); gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6); osc.start(now); osc.stop(now + 0.6); }
      else if (type === 'marry') { osc.frequency.setValueAtTime(659, now); osc.frequency.setValueAtTime(784, now + 0.1); osc.frequency.setValueAtTime(1046, now + 0.2); gain.gain.setValueAtTime(0.12, now); gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6); osc.start(now); osc.stop(now + 0.6); }
      else if (type === 'demote') { osc.frequency.setValueAtTime(330, now); osc.frequency.setValueAtTime(294, now + 0.15); gain.gain.setValueAtTime(0.15, now); gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4); osc.start(now); osc.stop(now + 0.4); }
      else if (type === 'click') { osc.frequency.setValueAtTime(880, now); gain.gain.setValueAtTime(0.05, now); gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08); osc.start(now); osc.stop(now + 0.08); }
      else if (type === 'coin') { osc.frequency.setValueAtTime(1046, now); osc.frequency.setValueAtTime(1318, now + 0.08); gain.gain.setValueAtTime(0.1, now); gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25); osc.start(now); osc.stop(now + 0.25); }
    } catch(e) {}
  },
  showToast(msg, type = 'info', duration = 2500) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    const tone = ['info', 'success', 'warning', 'error'].includes(type) ? type : 'info';
    toast.className = `toast toast-${tone}`;
    toast.setAttribute('role', tone === 'error' ? 'alert' : 'status');
    toast.setAttribute('aria-live', 'polite');
    // v2.1.4：emoji → Lucide 图标（先 escapeHtml 防注入，再 LConvertEmoji 转图标）
    toast.innerHTML = __h(this.escapeHtml(String(msg)));
    document.body.appendChild(toast);
    setTimeout(() => { if (toast.parentNode) toast.remove(); }, duration);
  },
  // v2.1.6 即时成就提示：晋升/里程碑时展示新解锁成就（toast 组合）
  showAchievementToast(newAch) {
    if (!newAch || !newAch.length) return;
    const icon = { platinum: '💎', gold: '🥇', silver: '🥈', bronze: '🥉' };
    const names = newAch.map(a => (icon[a.tier] || '🏆') + ' ' + a.title).join('、');
    this.showToast('🏆 新成就解锁：' + names, 'success', 4000);
  },
  confirmAction(msg, yesCallback) {
    const returnFocus = document.activeElement;
    const overlay = document.createElement('div');
    overlay.className = 'menu-overlay';
    overlay.innerHTML = __h(`
      <div class="menu-modal" role="dialog" aria-modal="true" aria-labelledby="confirm-title" style="text-align:center">
        <p id="confirm-title" style="font-size:14px;margin-bottom:16px;line-height:1.6">${this.escapeHtml(msg)}</p>
        <button type="button" class="btn btn-primary" id="confirm-yes">确认</button>
        <button type="button" class="btn btn-secondary" id="confirm-no" style="margin-top:8px">取消</button>
      </div>`);
    document.body.appendChild(overlay);
    this.bindModalOverlay(overlay, { returnFocus, focusSelector: '#confirm-yes' });
    const yes = overlay.querySelector('#confirm-yes');
    const no = overlay.querySelector('#confirm-no');
    if (yes) yes.onclick = () => { this.closeMenu(); if (typeof yesCallback === 'function') yesCallback(); };
    if (no) no.onclick = () => this.closeMenu();
  },
  playAgain() {
    if (typeof this.setDesktopRoute === 'function') this.setDesktopRoute('current', { sync: false });
    engine.reset();
    this._recordedRun = false;
    this._codexMerged = false;
    this.render();
    this.updateStatus();
  },
  captureViewContext(source) {
    const phase = engine.getPhase();
    if (!this._navigationContext || this._navigationContext.phase !== phase) {
      this._navigationContext = { phase, source: source || 'menu', slot: this.currentSlot || 0, at: Date.now() };
    }
    return this._navigationContext;
  },
  clearViewContext() {
    this._navigationContext = null;
  },
  restoreCurrentFlow() {
    const phase = engine.getPhase();
    const p = engine.getPlayer();
    this.clearViewContext();
    if (typeof this.setDesktopRoute === 'function') this.setDesktopRoute('current', { sync: false });
    if (phase === 'career' || phase === 'event') {
      if (typeof this.afterCareerStep === 'function') this.afterCareerStep();
    } else if ((phase === 'ending' || p.ending) && typeof this.renderEnding === 'function') {
      this.renderContent(this.renderEnding());
      this.updateStatus();
    } else if (phase === 'background' && typeof this.renderBackground === 'function') {
      const bg = p.background || (typeof engine.rollBackground === 'function' ? engine.rollBackground() : null);
      this.renderContent(this.renderBackground(bg));
      this.updateStatus();
    } else {
      const renderers = {
        intro: 'renderIntro', era: 'renderEra', major: 'renderMajor', talents: 'renderTalents',
        personality: 'renderPersonality', attrs: 'renderAttrs', units: 'renderUnits',
        written: 'renderWritten', interview: 'renderInterview', result: 'renderResult'
      };
      const renderer = this[renderers[phase] || 'renderIntro'];
      if (typeof renderer === 'function') this.renderContent(renderer.call(this));
      this.updateStatus();
    }
    const content = document.getElementById('game-content');
    if (content && typeof content.focus === 'function') {
      try { content.focus({ preventScroll: true }); } catch (e) { content.focus(); }
    }
  },
  returnToCurrentFlow() {
    if (document.querySelector('.menu-overlay')) this.closeMenu();
    this.restoreCurrentFlow();
  },
  showMenu() {
    if (document.querySelector('.menu-overlay')) return;
    if (typeof this.captureViewContext === 'function') this.captureViewContext('menu');
    this._menuReturnFocus = document.activeElement;
    const overlay = document.createElement('div');
    overlay.className = 'menu-overlay';
    const isPlaying = engine.getPhase() !== 'intro' && engine.getPhase() !== 'menu';
    // v2.1.79 菜单分组：把 18 项按钮按"身份/进度/内容/设置"归档，组标题+留白降噪，命令台不滚动堆叠
    const groupTitle = t => `<p class="menu-command-group-title" aria-hidden="true">${t}</p>`;
    overlay.innerHTML = __h(`
      <div class="menu-modal menu-command-panel" role="dialog" aria-modal="true" aria-labelledby="menu-title" tabindex="-1" style="max-height:min(86vh,760px);display:flex;flex-direction:column">
        <div class="menu-header">
          <h2 id="menu-title">📋 菜单</h2>
          <button type="button" class="icon-btn" onclick="App.closeMenu()" aria-label="关闭菜单" style="color:var(--ink)">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>
        <div class="menu-command-scroll" style="overflow-y:auto;flex:1;min-height:0;padding:2px 4px">
          ${isPlaying ? groupTitle('进度 — 先存档再说') + '<button class="btn btn-primary" onclick="App.closeMenu(); App.saveAndContinue()">💾 保存游戏</button>' : ''}
          ${groupTitle('身份 — 存档安全')}
          <button class="btn btn-primary" onclick="App.closeMenu(); App.showAccountPanel()">☁️ ${this.getAccountLabel ? this.getAccountLabel() : '账号与云存档'}${this.hasAccount ? (this.hasAccount() ? '' : ' <span class="acc-badge">建议注册</span>') : ''}</button>
          ${groupTitle('进度 — 回看一局')}
          <button class="btn btn-primary" onclick="App.closeMenu(); App.showHistory()">📊 历史记录</button>
          ${isPlaying ? '<button class="btn btn-primary" onclick="App.closeMenu(); App.showYearbook()">📖 人生年鉴</button>' : ''}
          ${isPlaying ? '<button class="btn btn-primary" onclick="App.closeMenu(); App.showLifeReview()">🧭 人生回顾</button>' : ''}
          ${isPlaying ? '<button class="btn btn-primary" onclick="App.closeMenu(); App.showExperience()">📜 人生经历</button>' : ''}
          ${groupTitle('内容 — 收集与榜单')}
          <button class="btn btn-primary" onclick="App.closeMenu(); App.showAchievements()">🏆 成就</button>
          <button class="btn btn-primary" onclick="App.closeMenu(); App.showLeaderboard()">🥇 排行榜</button>
          <button class="btn btn-primary" onclick="App.closeMenu(); App.showDailyChallenge()">🎯 今日挑战</button>
          <button class="btn btn-primary" onclick="App.closeMenu(); App.showStats()">📈 统计</button>
          <button class="btn btn-primary" onclick="App.closeMenu(); App.showCodex()">📖 图鉴</button>
          <button class="btn btn-primary" onclick="App.closeMenu(); App.showChallenges()">🎯 挑战长廊</button>
          ${groupTitle('学习与支持')}
          <button class="btn btn-primary" onclick="App.closeMenu(); App.showHelp()">📖 玩法说明</button>
          <button class="btn btn-primary" onclick="App.closeMenu(); App.showSupport()">💖 支持与反馈</button>
          ${groupTitle('设置 — 数据与外观')}
          <button class="btn btn-secondary" onclick="App.closeMenu(); App.exportAll()">📦 备份数据（下载文件）</button>
          <button class="btn btn-secondary" onclick="App.closeMenu(); App.importAll()">🔄 恢复数据（选择备份文件）</button>
          <button class="btn btn-secondary" onclick="App.closeMenu(); App.showChangelog()">📦 版本更新日志</button>
          <button class="btn btn-secondary" onclick="App.closeMenu(); App.toggleSound()">${App.soundOn() ? '🔊 音效：开' : '🔇 音效：关'}</button>
          <button class="btn btn-secondary" onclick="App.closeMenu(); App.toggleFontLarge()">${App.fontLargeOn() ? '🔍 大字号：开' : '🔍 大字号：关'}</button>
          <button class="btn btn-secondary" onclick="App.closeMenu(); App.cycleTheme()">🎨 主题：${App.THEME_LABELS[App.themePref()] || App.THEME_LABELS.system}</button>
        </div>
        <div class="menu-command-foot" style="border-top:1px solid var(--ui-line);padding-top:10px;margin-top:8px">
          <button class="btn btn-primary" onclick="App.closeMenu()">继续游戏</button>
          <button class="btn btn-danger" onclick="App.closeMenu(); App.confirmAction('确定要重新开始吗？当前进度将丢失。', function(){ App.playAgain() })">重新开始</button>
        </div>
      </div>
    `);
    document.body.appendChild(overlay);
    this.bindModalOverlay(overlay, { returnFocus: this._menuReturnFocus, focusSelector: '.menu-header .icon-btn' });
  },
  saveAndContinue() {
    if ((this.saveCheckpoint ? this.saveCheckpoint('manual-save') : engine.saveState())) {
      this.showToast('💾 游戏已保存', 'success');
    } else {
      this.showToast('保存失败', 'error');
    }
  },
  closeMenu() {
    const overlay = document.querySelector('.menu-overlay');
    const overlayReturnFocus = overlay && overlay.__returnFocus;
    if (overlay) overlay.remove();
    if (!document.querySelector('.menu-overlay') && document.body && document.body.classList) document.body.classList.remove('modal-open');
    if ((this._desktopActiveRoute === 'menu' || this._desktopActiveRoute === 'account') && typeof this.setDesktopRoute === 'function') {
      const returnRoute = this._desktopOverlayReturnRoute || 'current';
      this._desktopOverlayReturnRoute = null;
      this.setDesktopRoute(returnRoute, { sync: false });
      if (typeof this.syncDesktopWorkspace === 'function') this.syncDesktopWorkspace({ navOnly: true });
    }
    const returnFocus = overlayReturnFocus || this._menuReturnFocus;
    this._menuReturnFocus = null;
    const toggle = document.getElementById('desktop-nav-toggle');
    if (returnFocus && typeof returnFocus.focus === 'function' && returnFocus.isConnected !== false) returnFocus.focus();
    else if (toggle && typeof toggle.focus === 'function') toggle.focus();
  },
  // 💖 支持与反馈：赞赏码 + 意见反馈（可与制作组来回留言）
  showSupport() {
    if (typeof this.setDesktopRoute === 'function') this.setDesktopRoute('support', { sync: false });
    this.renderContent(`
      <div class="stage fade-in">
        <div class="lead"><span>💖</span><p>支持与反馈</p></div>

        <div class="event-card" style="margin-bottom:14px">
          <p class="event-text">觉得游戏好玩？欢迎打赏支持开发！你的每一份心意都是我们继续打磨的动力。</p>
          <div style="text-align:center;margin:14px 0 6px">
            <img src="reward-qrcode.png" alt="赞赏码" style="width:170px;height:170px;border-radius:12px;border:2px solid var(--gold);box-shadow:0 4px 20px var(--shadow-gold)" onerror="this.style.display='none'">
            <p style="font-size:10px;color:var(--ink-lighter);margin-top:6px">长按识别二维码 · 随心赞赏</p>
            <button type="button" class="btn btn-secondary" onclick="App.saveRewardQr()" style="margin-top:8px">保存赞赏码</button>
          </div>
        </div>

        <div class="event-card" style="margin-bottom:14px">
          <p class="event-text">有意见或建议？遇到问题想反馈？留言告诉我们，制作组会在后台查看并回复你，也可以继续追问交流。</p>
          <div class="field" style="margin-top:10px">
            <select id="fb-type" class="fb-input" aria-label="反馈类型" style="width:100%;padding:10px;border:1px solid var(--parchment-dark);border-radius:8px;font-size:13px;margin-bottom:8px;background:var(--parchment-light)">
              <option value="suggestion">💡 玩法建议</option>
              <option value="bug">🐛 问题反馈</option>
              <option value="praise">👍 赞美鼓励</option>
              <option value="other">📝 其他</option>
            </select>
            <textarea id="fb-content" aria-label="留言内容" maxlength="2000" placeholder="写下你的想法…（支持多次留言，制作组会逐一回复）" style="width:100%;min-height:90px;padding:10px;border:1px solid var(--parchment-dark);border-radius:8px;font-size:13px;resize:vertical;background:var(--parchment-light);font-family:var(--font-body)"></textarea>
          </div>
          <div class="sticky-action" style="position:static;padding:10px 0 0">
            <button type="button" class="btn btn-primary feedback-submit" data-feedback-submit="1" onclick="App.submitFeedback()">📨 提交留言</button>
          </div>
        </div>

        <div class="event-card">
          <p class="event-text" style="font-weight:600">💬 我的留言记录</p>
          <div id="fb-history" style="margin-top:8px"><p style="text-align:center;color:var(--ink-lighter);padding:16px;font-size:12px">加载中…</p></div>
        </div>

        <div class="sticky-action">
          <button class="btn btn-primary" onclick="App.returnToCurrentFlow()">返回当前流程</button>
        </div>
      </div>
    `);
    this.loadMyFeedback();
  },
  escapeHtml(str) {
    return String(str == null ? '' : str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  },
  // 📦 版本与更新日志
  showChangelog() {
    if (typeof this.setDesktopRoute === 'function') this.setDesktopRoute('menu', { sync: false });
    this.setTopBarTitle('版本更新日志');
    const logs = [
      { ver: 'v2.1.34', date: '2026-08', items: ['🖥️ 桌面工作台重构：三栏布局、阶段导航、状态检查器和键盘焦点支持', '💾 存档与账号体验收束：操作检查点、云端同步提示和恢复入口更清晰', '🤝 人脉经营升级：随机联系人、分层职级、动态费用和一次经营2～3人', '📖 图鉴与历史页补充搜索、筛选、路线和返回当前流程入口'] },
      { ver: 'v2.1.30', date: '2026-08', items: ['📊 运营平衡分析：结局达成率、事件触发热度、流失年龄和天赋/策略完成率', '🎭 特殊剧本包：七条独立路线、专属事件、剧本目标与结算提示'] },
      { ver: 'v2.1.31', date: '2026-08', items: ['🤝 人脉主玩法：分层关系、双槽位行动、联系人生命周期和升迁联动', '🧭 人脉事件覆盖按年龄、单位、策略、剧本拆分，并接入匿名网络指标'] },
      { ver: 'v2.1.29', date: '2026-08', items: ['🧭 图鉴探索器：支持事件搜索、已触发/未触发、阶段/时代/类型筛选', '事件详情补充结构化前置条件、关键 flag 前后置关系和人生路线图'] },
      { ver: 'v2.1.28', date: '2026-08', items: ['⚡ 首屏加载优化：34 个外部脚本改为 defer，减少 HTML 解析阻塞', '静态资源缓存优化：版本化资源启用长期 immutable 缓存，入口 HTML 保持及时更新'] },
      { ver: 'v2.1.27', date: '2026-08', items: ['📖 图鉴同步：结局全集由 24 补齐至 27，新增举报英雄/著书立说/乡村振兴之星的结局收集与解锁提示', '结算页结局收集列表与图鉴分母统一，避免新增结局已可达但无法计入收集进度'] },
{ ver: 'v2.1.26', date: '2026-08', items: ['🛠 大文件模块拆分：职级、社交、历史、反馈职责独立，保留原有 API 与玩法行为'] },
      { ver: 'v2.1.20', date: '2026-08', items: ['⚖️ 天赋平衡（T1.3）：人间清醒 欲望 -8→-4（全库唯一负欲望 SSR；bench 生涯质量优但通关率受 -2.4% 晋升拖累，温和化保留清廉定位）'] },
      { ver: 'v2.1.19', date: '2026-08', items: ['📱 触屏体验优化（M2.3）：24 处 hover 效果触屏去粘滞（@media hover:none 重置），保留按压反馈', '触控目标 ≥44px（按钮/选项/卡片/图标按钮触屏放大）'] },
      { ver: 'v2.1.18', date: '2026-08', items: ['🗓️ 事件历史回看（M2.5）：历史记录保存压缩年度轨迹（年份/事件/职级/压力/声誉），详情页可回看人生', '关键节点高亮（晋升/调任/处分/结婚/生子/退休等）+ 压力警示 + 职级徽章', '旧记录无轨迹数据时优雅降级'] },
      { ver: 'v2.1.17', date: '2026-08', items: ['📖 人生年鉴（M2.6）：本局年度属性曲线图（声誉/口碑/压力/风险/廉洁/智力/情商/体质/权重 9 条 SVG 曲线）+ 大事时间轴', '引擎年度快照补四维属性（iq/eq/body/luck）——曲线数据源', '按年份去重 + 快照优先（每年多条记录时取年度结算条目）'] },
      { ver: 'v2.1.16', date: '2026-08', items: ['🎉 结局扩充 +3（24→27，M1.7 达成）：举报英雄（反腐链完整）/ 著书立说（专著出版）/ 乡村振兴之星（示范村建设）', '结局链 flag 闭环：whistleblower→witnessStrong→cleanHero 举报链、bookPublished 著书链、ruralRevitalize 振兴链全部有来源可触发', '结局图鉴/评分/提示全接入（app-menu/app-core 4 处名称映射）'] },
      { ver: 'v2.1.15', date: '2026-08', items: ['🎉 笔试题突破 500（M1.6 里程碑：442→500，+58）', '四大题型均衡（言语135/判断125/数字120/常识120），难度 1:125/2:153/3:222', '新题主题：政务服务下沉/错时共享停车/时间银行/局长坐窗口/枫桥经验等'] },
      { ver: 'v2.1.14', date: '2026-08', items: ['笔试题再扩充 +60（382→442）：言语/判断/数字/常识 各 +15，M1.6 推进（目标 500）', '新题主题：基层治理/依法行政/公文规范/政务改革/数字推理（引擎运行时选项洗牌，answer 静态分布无碍）'] },
      { ver: 'v2.1.13', date: '2026-08', items: ['笔试题扩充 +60（322→382）：言语/判断/数字/常识 各 +15，难度均衡 1:88/2:112/3:182', '新题聚焦基层治理/依法行政/公文规范/政务改革主题（M1.6 推进）'] },
      { ver: 'v2.1.12', date: '2026-08', items: ['🎉 事件总量突破 1500（M1.5 里程碑：1438→1500，本轮 +62）', '政府/民生/技术/数据部门池扩充（低保复核/机房搬迁/政府工作报告等）', '联系人深度：督察组/党校同学/老总/旧情/青梅/老乡/行长/记者 8 类', '仕途场景 +8（接任讲话/竞争上岗/下属越级汇报/单位合并等）', '生活主题 +18（父母老花镜/家长会/阳台菜园/纪念日补过等）'] },
      { ver: 'v2.1.11', date: '2026-08', items: ['内容扩充 34 个（enw127-144/enl127-142）：政法/机关/执法/垂管/党委部门池 + 8 类联系人深度事件', '垂管系统池 4→7、政法系统池 19→22——税务/法院/人大政协差异化体验加深', '生活主题（房贷/老家房子/兴趣班/宠物/上访户转变等）'] },
      { ver: 'v2.1.10', date: '2026-08', items: ['内容扩充 24 个（enw115-126/enl115-126）：数据/技术/窗口部门专属池 + 6 类联系人深度事件 + 生活主题', '联系人事件可见性修复：requireContact 事件 ×6 加权（此前高关系解锁的深度互动被 1400+ 池稀释）', '生活主题（车位/深夜便利店/父亲电话/二胎讨论/体检加项等）'] },
      { ver: 'v2.1.9', date: '2026-08', items: ['内容扩充 28 个（enw101-114/enl101-114）：政府系统/垂管系统部门专属池补齐（此前政府系统 0 事件）+ boss/qingmei/banker/mentor 联系人深度 + 生活主题', '政府系统池 0→3、垂管系统池 1→4，部门差异体验补全', '生活场景（学区房/养老/体检/相亲/纪念日/考证/催婚等）+ 时代触感（煎饼摊/老同学追悼会）'] },
      { ver: 'v2.1.8', date: '2026-08', items: ['生命周期结构化门槛（B4）：相亲/恋爱/求婚/生子/育儿/婚姻/退休 25 个 title 过滤事件全部补 requireSingle/requireMarried/requireChild/requireNoChild/year，引擎 title 链降级为兜底', '时代专属事件 +6（改革×2/平稳×2/整顿×2 → 17/时代），era_bench 自动覆盖', '中后期挑战事件 +6（e771-e776：站岗/离任审计/退休前人情/中青班/旧账风波/退居二线，45+ 加权 ×8）', '无障碍补丁（菜单关闭按钮 aria-label）'] },
      { ver: 'v2.1.7', date: '2026-08', items: ['事件标题重复清零（孩子升学/求婚/婚姻危机等 6 组差异化副标题+引擎过滤同步）', '仕途场景扩充 21 个新事件（民主生活会/述职述廉/任前公示/经济审计等，e700-e720）', '部门特色事件（政法/技术/民生/执法/垂管/窗口 6 类专属池）', '联系人深度事件（老同学/同乡/导师 3 类，含合规边界选择）', 'era_bench 升级：全量 45 个时代专属事件跟踪+200 局采样（消除抽样误报）'] },
      { ver: 'v2.1.6', date: '2026-08', items: ['硬核模式入口打通（难度按钮+4题笔试）', '负债出坑通道修复（高利贷利率15%→12%+强制还本+还贷80）', '理财投资本金返还修复（基金/定投/副业正期望）', '送礼破冰加成（低关系×1.6封顶50）', '结算页评分构成展示', '成就分档平衡（year_35/wealthy_100/考试类）', '旧档迁移兜底（6字段+超龄护栏）', '晋升答辩诚实奖励打通', '敌人互动闭环（ent285/286）', '诱惑留痕判腐（exBossTempt）'] },
      { ver: 'v2.1.5', date: '2026-07', items: ['考试/职业/生活事件链全面扩充与修复', '财务双表（现金/负债）平衡校准', '面试梯度抽题与高难度单位匹配', '人脉系统地域化与收益递减', 'New Game+ 属性点奖励', '刚性因果链与延迟判定'] },
      { ver: 'v2.13', date: '2026-08', items: ['财务系统全面重构（资产/负债双表）：①财富拆分为"现金+负债表"（类型化利率：网贷20%/借贷10%/其他5%），存档自动迁移 ②赌博/破财/超支"该负债多少就负债多少"——现金不足差额按真实金额转高利贷负债，废除-60封底（财富绞肉机名副其实）③强制还款：年结自动付息+工资结余全额还本，欠债期间攒不下钱、还清后可正常积累 ④利滚利：现金不足付息时利息并入本金 ⑤腐败救赎：负债越重，铤而走险的腐败收益加成越高（最高3倍），给深陷债务的玩家一条回正的血路（配合原有"负债深→腐败诱惑事件加权"闭环）⑥理财亏损只减现金不制造负债；房贷/送礼/消费需现金，欠债时面板出现还贷选项——新增 test_debt.js 重写（9项全过，含50局×30年生存+全程双表恒等）'] },
      { ver: 'v2.7', date: '2026-08', items: ['背景事件化（三档制+人脉枢纽链）；专业对口考试与晋升加成；财务联动（31个消费选项、债务链、负债利息）','腐败闭环（负债+热度驱动，一次腐败诱惑×4）；被抓需热度≥60+自救机制；赌博成瘾链（破产率82%）','中央线重做；属性衰减防超模；13结局专属成就补齐','修复监控SSE连接泄漏（断线重连双开累积40+连接）——面板单连接管理+心跳保活+每IP限3连接兜底+定期清理','修复中央玩家"晋升/调任去乡镇"bug：遴选晋升 levelOrder 缺"中央"导致 indexOf=-1 落到乡镇（主因）；中央单位不再被安排下派基层历练；排挤降级目标排除中央——新增中央玩家回归测试（300局×25年 0违规）','赌博/负债/借债全面审计修复：①"提前还贷"是死选项（need:debt 仅负债玩家可见 + cost:30 要求 wealth≥30，负债玩家永远被拦）→ 改免费还贷（-50/次，无套利）②-60 财富封底形同虚设：动态赌博借钱赌（最大250）、事件扣款（e758 爆雷-60等）、借债/网贷全部无封底可跌至-300+ → 全路径统一封底 ③动态赌博事件 id e763 与出身事件"父母的心意"冲突互吞 → 改用 e766——新增 test_debt.js 回归（8项全过）','赌博平衡重构：牌局不再吞年——①赌博年晋升/降级/历练/年度记录照常执行（旧版 return true 直接跳过整年结算，赌瘾玩家晋升停滞、人生轨迹缺年）②赌博年普通 auto 事件照常发生（仅 choice 槽被占用，明年再抽）③频率与赌瘾挂钩：轻度 3~4 年/次有喘息，重度才 2~3 年/次缠身 ④消退阈值 5→4 次（配合降频）——新增 test_gamble.js 回归（5项全过）'] },
      { ver: 'v2.4.1', date: '2026-08', items: ['三属性时间轴补强（保底成长+微互动+管道随职级放大）；分数线梯度优惠（全对-10%/≥95%-5%/≥90%-3%）','天赋强度平衡18项（workAbility倒挂修复）；新增4个专属路线结局（改革先锋/数字先驱/乡土守望/清廉丰碑）','全量备份恢复（文件方式）；出身补齐（三属性出身加成+3个专属事件）'] },
      { ver: 'v2.4', date: '2026-08', items: ['属性生态位重平衡（外貌/家境/运气各司其职）；职务权重实权化；热度风险分化','腐败收益回调+清官加强；理财转正；压力死亡线修正','三属性持续作用系统（≥5每年12-15%好运/接济/人气）+共鸣加权+专属事件；新增家族后盾天赋'] },
      { ver: 'v2.3', date: '2026-08', items: ['退休返聘时限修正；笔试难度加权+题库去重','出身概率重平衡（富裕12%/权贵8%）+15局保底；基层历练多维评估与分级返回','入党链修复（党员率84%）；财富系统平衡（理财/购房/医疗支出）','事件选项效果全显示，决策更透明'] },
      { ver: 'v2.2', date: '2026-08', items: ['修复低难度单位面试空池、休整年越龄、中央调任重复触发等20+处bug','面试选项洗牌；免试改用面试基础分；新增18道面试题','事件触发率提升至45%；修复40+处事件矛盾与flag断链；专业匹配改进'] },
      { ver: 'v2.1', date: '2026-08', items: ['快速开始一键随机档案；图鉴补全引导；高光时刻故事化总结','经济系统（买房/理财/教育金）；存档导出/导入；多步骤专案系统；人情往来送礼','音效重构+PWA离线；服务器广播；玩家反馈留言；字体本地化'] },
      { ver: 'v2.0', date: '2026-07', items: ['墨韵官印主题美化；性格/志向系统；图鉴系统','里程碑人生关卡；下派历练分级返回；中央殿堂隐藏结局','管理后台（实时监控/反馈/广播）；移动端数据卷宗'] },
      { ver: 'v1.x', date: '2026-06', items: ['公务员考试（笔试/面试题库）；职业生涯（晋升/调动/事件）','8种多结局；成就系统；三槽存档'] }
    ];
    this.renderContent(`
      <div class="stage fade-in">
        <div class="lead"><span>📦</span><p>版本与更新日志</p></div>
        ${logs.map(l => `
          <div class="event-card" style="margin-bottom:10px">
            <p style="font-weight:700;color:var(--vermilion);font-size:14px">${l.ver} <span style="font-size:10px;color:var(--ink-lighter);font-weight:400">${l.date}</span></p>
            <ul style="margin-top:6px;padding-left:18px;font-size:12px;color:var(--ink-light);line-height:2">
              ${l.items.map(i => `<li>${i}</li>`).join('')}
            </ul>
          </div>`).join('')}
        <div class="sticky-action">
          <button class="btn btn-primary" onclick="App.returnToCurrentFlow()">返回当前流程</button>
        </div>
      </div>
    `);
  },
  showAchievements() {
    if (typeof this.setDesktopRoute === 'function') this.setDesktopRoute('menu', { sync: false });
    this.setTopBarTitle('成就');
    const tiers = { bronze: '🥉 铜牌', silver: '🥈 银牌', gold: '🥇 金牌', platinum: '💎 铂金' };
    const tierColors = { bronze: '#CD7F32', silver: '#A0A0A0', gold: '#FFD700', platinum: '#E5E4E2' };
    const grouped = { bronze: [], silver: [], gold: [], platinum: [] };
    this.achievements.forEach(a => { if (grouped[a.tier]) grouped[a.tier].push(a); });
    this.renderContent(`
      <div class="stage fade-in">
        <div class="lead"><span>🏆</span><p>已解锁成就 (${this.achievements.length})</p></div>
        <div class="stats-card" style="margin-bottom:16px;background:var(--parchment-light);padding:12px;border-radius:12px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;text-align:center">
          <div><span style="font-size:18px;font-weight:700">${this.stats.plays}</span><br><span style="font-size:11px;color:var(--ink-light)">总局数</span></div>
          <div><span style="font-size:18px;font-weight:700">${this.stats.bestScore}</span><br><span style="font-size:11px;color:var(--ink-light)">最高分</span></div>
          <div><span style="font-size:18px;font-weight:700">${this.stats.totalPromos}</span><br><span style="font-size:11px;color:var(--ink-light)">总晋升</span></div>
          <div><span style="font-size:18px;font-weight:700">${this.stats.passes}</span><br><span style="font-size:11px;color:var(--ink-light)">上岸数</span></div>
          <div><span style="font-size:18px;font-weight:700">${Object.keys(this.stats.endings).length}/${(App.ALL_ENDINGS || []).length}</span><br><span style="font-size:11px;color:var(--ink-light)">结局收集</span></div>
          <div><span style="font-size:18px;font-weight:700">${this.stats.plays > 0 ? (this.stats.passes / this.stats.plays * 100).toFixed(0) : 0}%</span><br><span style="font-size:11px;color:var(--ink-light)">上岸率</span></div>
        </div>
        ${this.achievements.length === 0 ? '<p style="text-align:center;padding:40px;color:var(--ink-lighter)">暂无成就，多玩几局解锁吧</p>' : 
          Object.entries(tiers).map(([tier, label]) => {
            const list = grouped[tier] || [];
            if (list.length === 0) return '';
            return `
              <div style="margin-bottom:10px">
                <p class="tier-${tier}" style="font-size:12px;font-weight:600;margin-bottom:6px">${label} (${list.length})</p>
                <div class="achievement-grid">
                  ${list.map(a => `
                    <div class="achievement-badge unlocked" style="border-color:${tierColors[tier]}">
                      <span class="ach-icon">${tier === 'bronze' ? '🥉' : tier === 'silver' ? '🥈' : tier === 'gold' ? '🥇' : '💎'}</span>
                      <span class="ach-title">${this.escapeHtml(a.title || '未知成就')}</span>
                      <span class="ach-desc">${this.escapeHtml(a.desc || '')}</span>
                    </div>
                  `).join('')}
                </div>
              </div>`;
          }).join('')
        }
        <div class="sticky-action">
          <button class="btn btn-primary" onclick="App.returnToCurrentFlow()">返回当前流程</button>
          <button type="button" class="btn btn-secondary" onclick="App.copyShareText(engine.getPlayer(), engine.getHidden())" style="margin-top:8px">📋 复制分享文本</button>
        </div>
      </div>
    `);
  },
  showStats() {
    if (typeof this.setDesktopRoute === 'function') this.setDesktopRoute('menu', { sync: false });
    this.setTopBarTitle('游戏统计');
    this.renderContent(`
      <div class="stage fade-in">
        <div class="lead"><span>📈</span><p>游戏统计</p></div>
        <div class="stats-card">
          <div class="stat-item"><span>总游戏局数</span><span>${this.stats.plays}</span></div>
          <div class="stat-item"><span>上岸次数</span><span>${this.stats.passes}</span></div>
          <div class="stat-item"><span>上岸率</span><span>${this.stats.plays > 0 ? (this.stats.passes / this.stats.plays * 100).toFixed(1) : 0}%</span></div>
          <div class="stat-item"><span>最高总分</span><span>${this.stats.bestScore}</span></div>
          <div class="stat-item"><span>成就数量</span><span>${this.achievements.length}</span></div>
        </div>
        <div class="stats-card" style="margin-top:12px">
          <h3 style="font-size:14px;margin-bottom:8px">🧬 人生画像（基于历史记录）</h3>
          ${(() => {
            const h = this.gameHistory || [];
            if (h.length === 0) return '<p style="font-size:12px;color:var(--ink-lighter)">暂无历史记录，先完成一局吧</p>';
            const avgAgeOnshore = h.filter(r => r.ageOnshore > 0).reduce((s, r) => s + r.ageOnshore, 0) / Math.max(1, h.filter(r => r.ageOnshore > 0).length);
            const avgPromos = h.reduce((s, r) => s + (r.promotions || 0), 0) / h.length;
            const endingCounts = {};
            h.forEach(r => { if (r.ending) endingCounts[r.ending] = (endingCounts[r.ending] || 0) + 1; });
            const topEnding = Object.keys(endingCounts).sort((a, b) => endingCounts[b] - endingCounts[a])[0];
            const endingNames = this.ENDING_NAMES; // v2.1.56 结局名单一来源
            const bgCounts = {};
            h.forEach(r => { if (r.background) bgCounts[r.background] = (bgCounts[r.background] || 0) + 1; });
            const topBg = Object.keys(bgCounts).sort((a, b) => bgCounts[b] - bgCounts[a])[0] || '未知';
            return `
              <div class="stat-item"><span>平均上岸年龄</span><span>${avgAgeOnshore.toFixed(1)}岁</span></div>
              <div class="stat-item"><span>平均晋升次数</span><span>${avgPromos.toFixed(1)}次/局</span></div>
              <div class="stat-item"><span>最常见结局</span><span>${endingNames[topEnding] || topEnding || '无'}</span></div>
              <div class="stat-item"><span>最爱出身</span><span>${topBg}</span></div>
              <div class="stat-item"><span>历史局数</span><span>${h.length}局</span></div>`;
          })()}
        </div>
        <div class="sticky-action">
          <button class="btn btn-primary" onclick="App.returnToCurrentFlow()">返回当前流程</button>
          <button type="button" class="btn btn-secondary" onclick="App.copyShareText(engine.getPlayer(), engine.getHidden())" style="margin-top:8px">📋 复制分享文本</button>
          <button type="button" class="btn btn-secondary" onclick="App.exportShareImage(engine.getPlayer(), engine.getHidden())" style="margin-top:8px">📤 导出分享图</button>
        </div>
      </div>
    `);
  },
goToIntro() {
    this.clearViewContext();
    if (typeof this.setDesktopRoute === 'function') this.setDesktopRoute('current', { sync: false });
    engine.setPhase('intro');
    this.render();
    this.updateStatus();
  },
  bindEvents() {
    this.bindContentActions();
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        const overlay = document.querySelector('.menu-overlay');
        if (overlay) {
          this.closeMenu();
          return;
        }
        const workspace = document.querySelector('.desktop-workspace');
        if (workspace && typeof this.isDesktopLayout === 'function' && this.isDesktopLayout() && !workspace.classList.contains('desktop-nav-collapsed') && typeof this.toggleDesktopNav === 'function') {
          if (typeof this.isDesktopJourneyExpanded === 'function' && this.isDesktopJourneyExpanded() && typeof this.toggleDesktopJourney === 'function') {
            this.toggleDesktopJourney(false);
            return;
          }
          this.toggleDesktopNav(false);
        }
        return;
      }
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        App.confirmAction('确定要重新开始吗？当前进度将丢失。', () => this.playAgain());
      }
      // v2.1.6 D4 键盘导航：事件界面按 1-5 快速选择选项
      if (/^[1-5]$/.test(e.key) && engine.getPhase() === 'event') {
        const ev = engine.getState().currentEvent;
        if (ev && ev.choices) {
          const idx = parseInt(e.key, 10) - 1;
          const choice = ev.choices[idx];
          if (choice && engine.isChoiceEnabled(choice)) {
            e.preventDefault();
            App.handleEventChoice(idx);
          }
        }
      }
      // v2.1.6 键盘导航：笔试按 A-D 选择答案、面试按 1-5 选择
      if (engine.getPhase() === 'written' && /^[a-dA-D]$/.test(e.key)) {
        e.preventDefault();
        App.answerWritten(e.key.toUpperCase());
      }
      if (engine.getPhase() === 'interview' && /^[1-5]$/.test(e.key)) {
        const idx = parseInt(e.key, 10) - 1;
        const qs = engine.getState().examQuestions;
        if (qs && qs[engine.getState().currentQuestion] && qs[engine.getState().currentQuestion].choices && qs[engine.getState().currentQuestion].choices[idx]) {
          e.preventDefault();
          App.answerInterview(idx);
        }
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        this.saveAndContinue();
      }
    });
  }
});
