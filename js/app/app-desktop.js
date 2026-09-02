// 玩家端桌面工作区：导航、检查器和桌面布局状态。
// 复用 App 现有入口，不改变游戏状态模型和移动端流程。
(function () {
  const PHASES = [
    ['intro', '开局档案'], ['background', '出身背景'], ['era', '时代剧本'],
    ['major', '选择专业'], ['talents', '选取天赋'], ['personality', '性格志向'],
    ['attrs', '属性成长'], ['units', '报考单位'], ['written', '笔试'],
    ['interview', '面试'], ['result', '考试结果'], ['career', '职业生涯'],
    ['event', '突发事件'], ['ending', '人生结算']
  ];
  const PHASE_INDEX = PHASES.reduce((map, item, index) => {
    map[item[0]] = index;
    return map;
  }, {});
  const PHASE_LABELS = PHASES.reduce((map, item) => {
    map[item[0]] = item[1];
    return map;
  }, {});
  const JOURNEY_GROUPS = [
    { id: 'preparation', label: '建档准备', phases: ['intro', 'background', 'era', 'major', 'talents', 'personality', 'attrs'] },
    { id: 'exam', label: '上岸考试', phases: ['units', 'written', 'interview', 'result'] },
    { id: 'career', label: '任职发展', phases: ['career', 'event'] },
    { id: 'ending', label: '人生结算', phases: ['ending'] }
  ];
  const JOURNEY_STATUS_LABELS = { done: '已完成', current: '正在处理', upcoming: '尚未开始' };
  const INSPECTOR_TABS = [['summary', '总览'], ['attrs', '属性'], ['career', '职务'], ['network', '人脉']];
  const NAV_GROUPS = [
    { title: '继续处理', items: [
      { id: 'current', label: '当前流程', description: '回到正在进行的选择', icon: 'compass' },
      { id: 'network', label: '人脉网络', description: '经营关系、机会与责任', icon: 'handshake', careerOnly: true }
    ] },
    { title: '案卷与回顾', items: [
      { id: 'codex', label: '事件图鉴', description: '查找事件、前置与路线', icon: 'book-open' },
      { id: 'experience', label: '人生经历', description: '按类别回看全部留痕', icon: 'scroll-text' },
      { id: 'history', label: '人生记录', description: '查看历局与年度轨迹', icon: 'history' }
    ] },
    { title: '帮助与设置', items: [
      { id: 'support', label: '赞赏支持', description: '赞赏码与分享说明', icon: 'heart' },
      { id: 'menu', label: '更多设置', description: '玩法、备份、外观和重开', icon: 'sliders-horizontal' }
    ] }
  ];
  const NAV_ACTIONS = NAV_GROUPS.reduce((all, group) => all.concat(group.items), []);
  function esc(value) {
    return typeof App.escapeHtml === 'function' ? App.escapeHtml(value == null ? '' : String(value)) : String(value == null ? '' : value);
  }
  function num(value, fallback) {
    const n = Number(value);
    return Number.isFinite(n) ? n : (fallback || 0);
  }
  function icon(name, fallback) {
    if (typeof LIcon === 'function') {
      try { return LIcon(name, 17, 'desktop-nav-svg'); } catch (e) {}
    }
    return `<span class="desktop-nav-fallback-icon" aria-hidden="true">${fallback || '•'}</span>`;
  }
  function phaseTitle() {
    return typeof App.getPhaseTitle === 'function' ? App.getPhaseTitle() : (engine.getPhase() || '当前流程');
  }
  function player() {
    return (typeof engine.getPlayer === 'function' && engine.getPlayer()) || {};
  }

  Object.assign(App, {
    _desktopInspectorTab: 'summary',
    _desktopNavOpen: true,
    _desktopJourneyExpanded: false,
    _desktopResizeBound: false,
    _desktopBreakpoint: null,
    _desktopActiveRoute: 'current',
    _desktopOverlayReturnRoute: null,
    isDesktopLayout() {
      return typeof window !== 'undefined' && Number(window.innerWidth || 0) > 800;
    },
    getDesktopBreakpoint(width) {
      const value = Number(width == null && typeof window !== 'undefined' ? window.innerWidth : width) || 0;
      return value <= 800 ? 'mobile' : value < 1024 ? 'drawer' : value < 1440 ? 'compact' : 'wide';
    },
    handleDesktopMenu() {
      if (this.isDesktopLayout() && document.getElementById('desktop-nav')) this.toggleDesktopNav();
      else if (typeof this.showMenu === 'function') this.showMenu();
    },
    bindDesktopResize() {
      if (this._desktopResizeBound || typeof window === 'undefined' || typeof window.addEventListener !== 'function') return;
      this._desktopResizeBound = true;
      let timer = null;
      this._desktopResizeHandler = () => {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => { timer = null; this.syncDesktopBreakpointState(); }, 80);
      };
      window.addEventListener('resize', this._desktopResizeHandler, { passive: true });
      this.syncDesktopBreakpointState();
    },
    restoreDesktopNavFocus(button, activeInsideNav) {
      if (!activeInsideNav || !button || typeof button.focus !== 'function') return;
      try { button.focus({ preventScroll: true }); } catch (e) { button.focus(); }
    },
    setDesktopNavAccessibility(nav, breakpoint, open) {
      if (!nav) return;
      // 抽屉收起时侧栏移出视口，不能继续留在 Tab 顺序里；手机端不渲染侧栏。
      // 宽屏与紧凑布局收起后仍保留可见的图标导航（88px 栏），不能标记为隐藏。
      const hidden = breakpoint === 'mobile' || (breakpoint === 'drawer' && !open);
      nav.setAttribute('aria-hidden', String(hidden));
      if ('inert' in nav) nav.inert = hidden;
      else if (hidden) nav.setAttribute('inert', '');
      else nav.removeAttribute('inert');
    },
    syncDesktopScrollCues() {
      if (typeof document === 'undefined') return;
      const pairs = [
        { host: document.getElementById('desktop-nav'), scroller: document.getElementById('desktop-nav') },
        { host: document.getElementById('side-panel'), scroller: document.getElementById('desktop-inspector-body') }
      ];
      pairs.forEach(({ host, scroller }) => {
        if (!host || !scroller) return;
        const update = () => {
          const threshold = 8;
          const maxScroll = Math.max(0, Number(scroller.scrollHeight) - Number(scroller.clientHeight));
          const scrollable = maxScroll > threshold;
          const atTop = Number(scroller.scrollTop) <= threshold;
          const atBottom = Number(scroller.scrollTop) >= maxScroll - threshold;
          const more = !scrollable ? 'none' : atTop && atBottom ? 'none' : atBottom ? 'up' : atTop ? 'down' : 'both';
          host.dataset.scrollable = String(scrollable);
          host.dataset.scrollMore = more;
        };
        if (!scroller.__desktopScrollCueHandler) {
          scroller.__desktopScrollCueHandler = update;
          scroller.addEventListener('scroll', update, { passive: true });
        }
        scroller.__desktopScrollCueHandler();
      });
    },
    syncDesktopBreakpointState() {
      if (typeof window === 'undefined' || typeof document === 'undefined') return;
      const workspace = document.querySelector('.desktop-workspace');
      if (!workspace) return;
      const nav = document.getElementById('desktop-nav');
      const active = document.activeElement;
      const activeInsideNav = !!(nav && active && typeof nav.contains === 'function' && nav.contains(active));
      const breakpoint = this.getDesktopBreakpoint(window.innerWidth);
      const previous = this._desktopBreakpoint;
      const crossed = previous && previous !== breakpoint;
      if (breakpoint === 'mobile') workspace.classList.add('desktop-nav-collapsed');
      else if (breakpoint === 'drawer') {
        if (!previous || crossed) workspace.classList.add('desktop-nav-collapsed');
      } else if (previous === 'drawer' || previous === 'mobile') workspace.classList.remove('desktop-nav-collapsed');
      const open = breakpoint !== 'mobile' && !workspace.classList.contains('desktop-nav-collapsed');
      this._desktopBreakpoint = breakpoint;
      this._desktopNavOpen = open;
      workspace.dataset.desktopBreakpoint = breakpoint;
      workspace.dataset.desktopNavState = open ? 'open' : 'closed';
      const button = document.getElementById('desktop-nav-toggle');
      if (button) {
        const label = breakpoint === 'drawer' ? (open ? '关闭侧边栏' : '打开侧边栏') : breakpoint === 'mobile' ? '打开菜单' : (open ? '收起侧边栏' : '展开侧边栏');
        button.setAttribute('aria-controls', 'desktop-nav');
        button.setAttribute('aria-expanded', String(open));
        button.setAttribute('aria-label', label);
        button.setAttribute('title', label);
        if (!open) this.restoreDesktopNavFocus(button, activeInsideNav);
      }
      this.setDesktopNavAccessibility(nav, breakpoint, open);
      const scrim = document.getElementById('desktop-nav-scrim');
      const scrimOpen = breakpoint === 'drawer' && open;
      if (scrim) {
        scrim.setAttribute('aria-hidden', String(!scrimOpen));
        scrim.dataset.open = String(scrimOpen);
        scrim.classList.toggle('is-visible', scrimOpen);
      }
      if (document.body && document.body.classList) document.body.classList.toggle('desktop-drawer-open', scrimOpen);
      if (crossed && previous === 'mobile' && breakpoint !== 'mobile') {
        this.syncDesktopWorkspace({ forceNav: true, forceInspector: true });
      }
      this.syncDesktopScrollCues();
    },
    setDesktopRoute(route, options) {
      this._desktopActiveRoute = NAV_ACTIONS.some(item => item.id === route) ? route : 'current';
      this._topBarTitleOverride = '';
      if (typeof this.syncTopBarTitle === 'function') this.syncTopBarTitle();
      if (!options || options.sync !== false) this.syncDesktopWorkspace({ navOnly: true });
    },
    canOpenNetwork() {
      const phase = engine.getPhase();
      const p = player();
      return !!p.unit && (phase === 'career' || phase === 'event' || phase === 'ending');
    },
    getDesktopJourneySummary() {
      const rawPhase = typeof engine.getPhase === 'function' ? engine.getPhase() : 'intro';
      const p = player();
      const phase = p.ending ? 'ending' : (PHASE_INDEX[rawPhase] === undefined ? 'intro' : rawPhase);
      const phaseIndex = PHASE_INDEX[phase] === undefined ? 0 : PHASE_INDEX[phase];
      const currentGroupIndex = Math.max(0, JOURNEY_GROUPS.findIndex(group => group.phases.includes(phase)));
      const currentGroup = JOURNEY_GROUPS[currentGroupIndex] || JOURNEY_GROUPS[0];
      const groups = JOURNEY_GROUPS.map((group, index) => {
        const status = index < currentGroupIndex ? 'done' : index === currentGroupIndex ? 'current' : 'upcoming';
        return { id: group.id, label: group.label, status, statusLabel: JOURNEY_STATUS_LABELS[status], phases: group.phases.slice() };
      });
      return {
        phase,
        phaseIndex,
        phaseLabel: PHASE_LABELS[phase] || phaseTitle(),
        currentGroupId: currentGroup.id,
        currentGroupIndex,
        currentGroupLabel: currentGroup.label,
        recentCompletedLabel: phaseIndex > 0 ? (PHASE_LABELS[PHASES[phaseIndex - 1][0]] || '上一阶段') : '暂无',
        groups
      };
    },
    getDesktopNextAction() {
      const summary = this.getDesktopJourneySummary();
      const phase = summary.phase;
      const p = player();
      const state = typeof engine.getState === 'function' ? (engine.getState() || {}) : {};
      const hidden = typeof engine.getHidden === 'function' ? (engine.getHidden() || {}) : {};
      const task = { status: '进行中', title: summary.phaseLabel || '继续当前流程', next: '完成当前选择后继续。', attention: '' };
      const pendingPromotion = state.pendingPromotion;
      const pendingTransfer = state.pendingTransfer;
      if (phase === 'intro') {
        task.title = '完成开局档案';
        task.next = '填写基本信息，确定这段人生从哪里开始。';
      } else if (phase === 'background') {
        task.title = '选择出身背景';
        task.next = '了解不同出身带来的资源与限制，再做出选择。';
      } else if (phase === 'era') {
        task.title = '选择时代剧本';
        task.next = '选择你想经历的时代环境和主要挑战。';
      } else if (phase === 'major') {
        task.title = '确定专业方向';
        task.next = '专业会影响报考匹配和后续工作机会。';
      } else if (phase === 'talents') {
        task.title = '配置关键天赋';
        task.next = '选择优势，也要为它带来的代价留出余地。';
      } else if (phase === 'personality') {
        task.title = '确定性格志向';
        task.next = '性格会影响事件中的可选策略和长期评价。';
      } else if (phase === 'attrs') {
        task.title = '分配初始属性';
        task.next = '确认属性分配后进入报考单位阶段。';
      } else if (phase === 'units') {
        task.title = '选择报考单位';
        task.next = '比较单位层级、岗位条件和专业匹配后确认。';
      } else if (phase === 'written') {
        task.title = '完成笔试';
        task.next = '按题目作答，提交后会立即保存当前进度。';
      } else if (phase === 'interview') {
        task.title = '完成面试';
        task.next = '用有限的回答展示能力、判断和处事方式。';
      } else if (phase === 'result') {
        task.status = '待处理';
        task.title = '查看考试结果';
        task.next = '确认结果并决定是否进入职业生涯。';
      } else if (phase === 'career' && pendingPromotion) {
        task.status = '待处理';
        task.title = '处理晋升机会';
        task.next = '查看晋升条件，选择接受或放弃这次机会。';
        task.attention = '晋升选择会影响下一阶段的职位路径。';
      } else if ((phase === 'career' || phase === 'event') && pendingTransfer) {
        task.status = '待处理';
        task.title = '处理调任选择';
        task.next = '评估新单位、家庭和发展空间后作出决定。';
        task.attention = '调任会立即改变岗位和关系网络的可达性。';
      } else if (phase === 'event') {
        task.status = '待选择';
        task.title = '处理突发事件';
        task.next = state.currentEvent && state.currentEvent.title ? '围绕“' + state.currentEvent.title + '”选择行动。' : '选择一项行动，确认后继续年度流程。';
      } else if (phase === 'career') {
        task.title = '推进本年度工作';
        task.next = '完成年度安排，留意晋升、调任和人脉机会。';
        const network = typeof engine.getNetworkSummary === 'function' ? (engine.getNetworkSummary() || {}) : null;
        const actions = network && network.actions ? network.actions : {};
        if (network && (!actions.connectionUsed || !actions.stewardshipUsed)) task.attention = '本年度仍有人脉行动可用。';
        else if (Number(hidden.mentalPressure) >= 75) task.attention = '心理压力较高，继续冒险可能增加风险。';
      } else if (phase === 'ending') {
        task.status = '可查看';
        task.title = '查看本局结算';
        task.next = '回看关键选择，或开始下一段人生。';
      }
      if (!task.attention && Number(hidden.risk) >= 80 && (phase === 'career' || phase === 'event')) task.attention = '当前风险较高，建议先查看状态再做决定。';
      return task;
    },
    renderDesktopJourney(summary, task) {
      const expanded = !!this._desktopJourneyExpanded;
      const valueText = '当前处于' + summary.currentGroupLabel + '，正在处理' + summary.phaseLabel;
      const groups = summary.groups.map(group => `<li class="desktop-journey-group ${group.status}"${group.status === 'current' ? ' aria-current="step"' : ''}><span class="desktop-journey-group-mark" aria-hidden="true">${group.status === 'done' ? '✓' : group.status === 'current' ? '●' : '○'}</span><span class="desktop-journey-group-copy"><strong>${esc(group.label)}</strong><small>${esc(group.statusLabel)}</small></span></li>`).join('');
      const details = PHASES.map(item => {
        const index = PHASE_INDEX[item[0]];
        const status = index < summary.phaseIndex ? 'done' : index === summary.phaseIndex ? 'current' : 'upcoming';
        const mark = status === 'done' ? '✓' : status === 'current' ? '●' : '○';
        return `<li class="desktop-phase-step ${status}"${status === 'current' ? ' aria-current="step"' : ''}><span class="desktop-phase-mark" aria-hidden="true">${mark}</span><span class="desktop-phase-label">${esc(item[1])}</span><small>${JOURNEY_STATUS_LABELS[status]}</small></li>`;
      }).join('');
      return `<section class="desktop-journey" aria-labelledby="desktop-journey-title"><div class="desktop-journey-header"><div><span class="desktop-journey-kicker">人生路线</span><h2 id="desktop-journey-title">${esc(summary.currentGroupLabel)}</h2></div><span class="desktop-journey-current">${esc(summary.phaseLabel)}</span></div><div class="desktop-journey-meter" role="progressbar" aria-label="人生路线状态" aria-valuemin="0" aria-valuemax="${JOURNEY_GROUPS.length - 1}" aria-valuenow="${summary.currentGroupIndex}" aria-valuetext="${esc(valueText)}">${summary.groups.map(group => `<i class="${group.status}" aria-hidden="true"></i>`).join('')}</div><ol class="desktop-journey-track" aria-label="人生路线阶段">${groups}</ol><div class="desktop-next-task"><div class="desktop-next-task-header"><span class="desktop-next-task-kicker">当前任务</span><span class="desktop-next-task-state state-${esc(task.status)}">${esc(task.status)}</span></div><h3>${esc(task.title)}</h3><p><strong>下一步</strong>${esc(task.next)}</p>${task.attention ? `<p class="desktop-next-task-attention"><strong>需要注意</strong>${esc(task.attention)}</p>` : ''}</div><button type="button" class="desktop-journey-toggle" data-desktop-journey-toggle="1" aria-controls="desktop-phase-details" aria-expanded="${expanded}" onclick="App.toggleDesktopJourney()">${expanded ? '收起完整流程' : '查看完整流程'}<span aria-hidden="true">${expanded ? '⌃' : '⌄'}</span></button><div class="desktop-phase-details" id="desktop-phase-details"${expanded ? '' : ' hidden'} aria-label="完整流程详情"><ul class="desktop-phase-list">${details}</ul></div></section>`;
    },
    toggleDesktopJourney(expanded) {
      const next = typeof expanded === 'boolean' ? expanded : !this._desktopJourneyExpanded;
      this._desktopJourneyExpanded = next;
      const nav = document.getElementById('desktop-nav');
      const toggle = nav && nav.querySelector ? nav.querySelector('[data-desktop-journey-toggle]') : null;
      const details = nav && nav.querySelector ? nav.querySelector('#desktop-phase-details') : null;
      if (!toggle || !details) {
        if (nav) nav.innerHTML = __h(this.renderDesktopNav());
        this.syncDesktopScrollCues();
        return next;
      }
      toggle.setAttribute('aria-expanded', String(next));
      toggle.innerHTML = __h((next ? '收起完整流程' : '查看完整流程') + `<span aria-hidden="true">${next ? '⌃' : '⌄'}</span>`);
      details.hidden = !next;
      details.setAttribute('aria-hidden', String(!next));
      details.classList.toggle('is-open', next);
      if (!next && typeof toggle.focus === 'function') toggle.focus();
      this.syncDesktopScrollCues();
      return next;
    },
    isDesktopJourneyExpanded() {
      return !!this._desktopJourneyExpanded;
    },
    renderDesktopNav() {
      const p = player();
      const unit = p.unit && p.unit.name ? p.unit.name : '尚未分配单位';
      const journey = this.getDesktopJourneySummary();
      const task = this.getDesktopNextAction();
      const activeRoute = this._desktopActiveRoute || 'current';
      return `
        <div class="desktop-nav-inner">
          <div class="desktop-brand-block"><span class="desktop-brand-seal" aria-hidden="true">岸</span><div class="desktop-brand-copy"><strong>上岸模拟器</strong><small>墨韵官印 · 桌面案头</small></div></div>
          <div class="desktop-nav-profile"><span class="desktop-nav-kicker">当前档案</span><div class="desktop-profile-line"><strong>${esc(p.name || '未命名')}</strong><span class="desktop-profile-age">${num(p.age)}岁</span></div><span class="desktop-profile-unit">${esc(unit)}</span></div>
          <button type="button" class="desktop-current-card" data-desktop-action="current" onclick="App.desktopNavigate('current')" aria-label="现在要处理：${esc(phaseTitle())}" aria-current="${activeRoute === 'current' ? 'page' : 'false'}"><span class="desktop-current-card-mark">${icon('compass', '◎')}</span><span class="desktop-current-card-copy"><small>现在要处理 · ${esc(journey.currentGroupLabel)}</small><strong>${esc(phaseTitle())}</strong><span>${esc(task.next)}</span></span><span class="desktop-current-card-arrow" aria-hidden="true">&#8599;</span></button>
          ${this.renderDesktopJourney(journey, task)}
          <div class="desktop-nav-groups">${NAV_GROUPS.map(group => `<section class="desktop-nav-group" aria-labelledby="desktop-nav-group-${esc(group.title)}"><h2 id="desktop-nav-group-${esc(group.title)}">${esc(group.title)}</h2><nav aria-label="${esc(group.title)}">${group.items.map(item => {
            const disabled = item.careerOnly && !this.canOpenNetwork();
            const active = activeRoute === item.id;
            const reason = disabled ? '进入职业生涯后开放人脉网络' : item.description;
            return `<button type="button" class="desktop-nav-item${active ? ' is-active' : ''}${disabled ? ' is-disabled' : ''}"${disabled ? ' disabled' : ''} data-desktop-action="${item.id}" data-desktop-route="${item.id}" onclick="App.desktopNavigate('${item.id}')" title="${esc(reason)}" aria-label="${esc(item.label)}：${esc(reason)}"${active ? ' aria-current="page"' : ''}${disabled ? ' aria-disabled="true"' : ''}><span class="desktop-nav-icon" aria-hidden="true">${icon(item.icon, '•')}</span><span class="desktop-nav-item-copy"><strong>${esc(item.label)}</strong><small>${esc(item.description)}</small></span><span class="desktop-nav-item-arrow" aria-hidden="true">›</span></button>`;
          }).join('')}</nav></section>`).join('')}</div>
          <div class="desktop-nav-footer" id="desktop-nav-footer">${this.renderDesktopSaveHint()}<span class="desktop-nav-footnote">快捷键：Esc 收起侧栏</span></div>
        </div>
      `;
    },
    renderDesktopSaveHint() {
      const status = typeof this.getPersistenceStatus === 'function' ? this.getPersistenceStatus() : { state: 'unknown' };
      const labels = { saved: '本地已保存', failed: '保存失败 · 请导出备份', saving: '正在保存…', syncing: '等待同步…', unknown: '完成操作后自动保存' };
      return `<span class="desktop-save-hint state-${esc(status.state)}" aria-live="polite"><i aria-hidden="true"></i><span>${labels[status.state] || '仅本地保存'}</span></span>`;
    },
    desktopNavigate(action) {
      if (action === 'network' && !this.canOpenNetwork()) {
        if (typeof this.showToast === 'function') this.showToast('进入职业生涯后，人脉网络才会开放。', 'info');
        return;
      }
      const handlers = {
        current: () => this.renderCurrentPhase(),
        network: () => this.showNetworkPanel && this.showNetworkPanel(),
        codex: () => this.showCodex && this.showCodex(),
        experience: () => this.showExperience && this.showExperience(),
        history: () => this.showHistory && this.showHistory(),
        support: () => this.showSupport && this.showSupport(),
        menu: () => this.showMenu && this.showMenu()
      };
      if (!handlers[action]) return;
      if (action !== 'current' && typeof this.captureViewContext === 'function') this.captureViewContext('desktop-nav');
      if (action === 'menu') this._desktopOverlayReturnRoute = this._desktopActiveRoute || 'current';
      this.setDesktopRoute(action, { sync: false });
      handlers[action]();
      this.syncDesktopWorkspace({ navOnly: true });
    },
    renderCurrentPhase() {
      this._desktopActiveRoute = 'current';
      if (typeof this.restoreCurrentFlow === 'function') return this.restoreCurrentFlow({ fromDesktop: true });
      const phase = engine.getPhase();
      if ((phase === 'career' || phase === 'event') && typeof this.afterCareerStep === 'function') return this.afterCareerStep();
      if ((phase === 'ending' || player().ending) && typeof this.renderEnding === 'function') this.renderContent(this.renderEnding());
      else if (phase === 'background' && typeof this.renderBackground === 'function') {
        const p = player();
        const bg = p.background || (typeof engine.rollBackground === 'function' ? engine.rollBackground() : null);
        this.renderContent(this.renderBackground(bg));
      } else {
        const map = { intro: 'renderIntro', era: 'renderEra', major: 'renderMajor', talents: 'renderTalents', personality: 'renderPersonality', attrs: 'renderAttrs', units: 'renderUnits', written: 'renderWritten', interview: 'renderInterview', result: 'renderResult' };
        const renderer = this[map[phase] || 'renderIntro'];
        if (typeof renderer === 'function') this.renderContent(renderer.call(this));
      }
      if (typeof this.updateStatus === 'function') this.updateStatus();
    },
    toggleDesktopNav(forceOpen) {
      const workspace = document.querySelector('.desktop-workspace');
      if (!workspace) return typeof this.showMenu === 'function' && this.showMenu();
      const breakpoint = workspace.dataset.desktopBreakpoint || this.getDesktopBreakpoint();
      if (breakpoint === 'mobile') return typeof this.showMenu === 'function' && this.showMenu();
      const open = typeof forceOpen === 'boolean' ? forceOpen : workspace.classList.contains('desktop-nav-collapsed');
      workspace.classList.toggle('desktop-nav-collapsed', !open);
      this._desktopNavOpen = open;
      this.syncDesktopBreakpointState();
      const button = document.getElementById('desktop-nav-toggle');
      if (!open && button && typeof button.focus === 'function') button.focus();
      if (open && breakpoint === 'drawer') {
        const nav = document.getElementById('desktop-nav');
        const first = nav && nav.querySelector('[data-desktop-action]');
        if (first && typeof first.focus === 'function') first.focus();
      }
    },
    renderDesktopInspector() {
      const p = player();
      const unit = p.unit && p.unit.name ? p.unit.name : '尚未分配单位';
      const tab = INSPECTOR_TABS.some(item => item[0] === this._desktopInspectorTab) ? this._desktopInspectorTab : 'summary';
      return `<div class="desktop-inspector-inner"><header class="desktop-inspector-header"><div class="desktop-inspector-heading"><span class="desktop-inspector-kicker">状态检查器</span><h2 data-inspector-name>${esc(p.name || '未命名')}</h2><p><span data-inspector-phase>${esc(phaseTitle())}</span><i aria-hidden="true">·</i><span data-inspector-unit>${esc(unit)}</span></p></div><div class="desktop-inspector-age"><strong data-inspector-age>${num(p.age)}</strong><span>岁</span></div></header><div class="desktop-inspector-tabs" role="tablist" aria-label="状态面板">${INSPECTOR_TABS.map(item => `<button type="button" role="tab" id="desktop-inspector-tab-${item[0]}" data-inspector-tab="${item[0]}" aria-controls="desktop-inspector-body" aria-selected="${item[0] === tab ? 'true' : 'false'}" tabindex="${item[0] === tab ? '0' : '-1'}" class="desktop-inspector-tab${item[0] === tab ? ' active' : ''}" onclick="App.setDesktopInspectorTab('${item[0]}')" onkeydown="App.handleInspectorKeydown(event)">${item[1]}</button>`).join('')}</div><div class="desktop-inspector-body" id="desktop-inspector-body" role="tabpanel" aria-live="polite" aria-labelledby="desktop-inspector-tab-${tab}">${this.renderDesktopInspectorTab(tab)}</div><div class="desktop-inspector-persistence" id="desktop-inspector-persistence">${this.renderDesktopSaveHint()}</div></div>`;
    },
    handleInspectorKeydown(event) {
      if (!event || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      const index = INSPECTOR_TABS.findIndex(item => item[0] === this._desktopInspectorTab);
      let next = index;
      if (event.key === 'ArrowLeft') next = (index + INSPECTOR_TABS.length - 1) % INSPECTOR_TABS.length;
      if (event.key === 'ArrowRight') next = (index + 1) % INSPECTOR_TABS.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = INSPECTOR_TABS.length - 1;
      event.preventDefault();
      this.setDesktopInspectorTab(INSPECTOR_TABS[next][0], { focus: true });
    },
    setDesktopInspectorTab(tab, options) {
      if (!INSPECTOR_TABS.some(item => item[0] === tab)) return;
      this._desktopInspectorTab = tab;
      const panel = document.getElementById('side-panel');
      const body = panel && panel.querySelector && panel.querySelector('#desktop-inspector-body');
      if (!body) {
        if (panel) panel.innerHTML = __h(this.renderDesktopInspector());
        this.syncDesktopScrollCues();
        return;
      }
      panel.querySelectorAll('[data-inspector-tab]').forEach(button => {
        const active = button.getAttribute('data-inspector-tab') === tab;
        button.classList.toggle('active', active);
        button.setAttribute('aria-selected', String(active));
        button.setAttribute('tabindex', active ? '0' : '-1');
      });
      body.setAttribute('aria-labelledby', 'desktop-inspector-tab-' + tab);
      const scrollTop = body.scrollTop;
      body.innerHTML = __h(this.renderDesktopInspectorTab(tab));
      body.scrollTop = scrollTop;
      this.syncDesktopScrollCues();
      if (options && options.focus) {
        const target = panel.querySelector('[data-inspector-tab="' + tab + '"]');
        if (target && typeof target.focus === 'function') target.focus();
      }
    },
    updateDesktopInspector() {
      const panel = document.getElementById('side-panel');
      if (!panel) return;
      const body = panel.querySelector && panel.querySelector('#desktop-inspector-body');
      if (!body) {
        panel.innerHTML = __h(this.renderDesktopInspector());
        this.syncDesktopScrollCues();
        return;
      }
      const p = player();
      const unit = p.unit && p.unit.name ? p.unit.name : '尚未分配单位';
      const name = panel.querySelector('[data-inspector-name]');
      const phase = panel.querySelector('[data-inspector-phase]');
      const unitEl = panel.querySelector('[data-inspector-unit]');
      const age = panel.querySelector('[data-inspector-age]');
      if (name) name.textContent = p.name || '未命名';
      if (phase) phase.textContent = phaseTitle();
      if (unitEl) unitEl.textContent = unit;
      if (age) age.textContent = String(num(p.age));
      const tab = INSPECTOR_TABS.some(item => item[0] === this._desktopInspectorTab) ? this._desktopInspectorTab : 'summary';
      panel.querySelectorAll('[data-inspector-tab]').forEach(button => {
        const active = button.getAttribute('data-inspector-tab') === tab;
        button.classList.toggle('active', active);
        button.setAttribute('aria-selected', String(active));
        button.setAttribute('tabindex', active ? '0' : '-1');
      });
      body.setAttribute('aria-labelledby', 'desktop-inspector-tab-' + tab);
      const scrollTop = body.scrollTop;
      body.innerHTML = __h(this.renderDesktopInspectorTab(tab));
      body.scrollTop = scrollTop;
      const persistence = panel.querySelector('#desktop-inspector-persistence');
      if (persistence) persistence.innerHTML = __h(this.renderDesktopSaveHint());
      this.syncDesktopScrollCues();
    },
    renderDesktopInspectorTab(tab) {
      const p = player();
      const h = typeof engine.getHidden === 'function' ? (engine.getHidden() || {}) : {};
      const a = typeof engine.getAttrs === 'function' ? (engine.getAttrs() || {}) : {};
      if (tab === 'attrs') return `<section class="desktop-inspector-section"><div class="desktop-inspector-section-heading"><span>01</span><h3>基础属性</h3></div><div class="desktop-inspector-bars">${this.renderAttrBar('智商', a.iq, -5, 15, '#3b82b5')}${this.renderAttrBar('情商', a.eq, -5, 15, '#4c9065')}${this.renderAttrBar('运气', a.luck, -5, 15, '#c38a31')}${this.renderAttrBar('家境', a.family, -5, 15, '#8067a8')}${this.renderAttrBar('外貌', a.appearance, -5, 15, '#b86d7f')}${this.renderAttrBar('体质', a.body, -5, 15, '#4b9a9b')}</div><div class="desktop-inspector-section-heading is-sub"><span>02</span><h3>隐藏状态</h3></div><div class="desktop-inspector-bars">${this.renderHiddenBar('工作能力', h.workAbility, 0, 100, '#3b82b5', p.lastYearHidden && p.lastYearHidden.workAbility)}${this.renderHiddenBar('心理压力', h.mentalPressure, 0, 100, '#c65b50', p.lastYearHidden && p.lastYearHidden.mentalPressure)}${this.renderHiddenBar('风险', h.risk, 0, 100, '#bd6a42', p.lastYearHidden && p.lastYearHidden.risk)}${this.renderHiddenBar('廉洁', h.integrity, 0, 100, '#4d9166', p.lastYearHidden && p.lastYearHidden.integrity)}${this.renderHiddenBar('背景', h.background, 0, 100, '#8067a8', p.lastYearHidden && p.lastYearHidden.background)}</div></section>`;
      if (tab === 'career') {
        const title = typeof engine.getCurrentPositionTitle === 'function' ? engine.getCurrentPositionTitle() : (p.unit && p.unit.name) || '尚未上岸';
        const rank = typeof engine.getRankLabel === 'function' ? engine.getRankLabel(p.leadershipRank) : String(num(p.leadershipRank)) + '级';
        const cash = p.finance ? num(p.finance.cash) : num(p.wealth);
        const debt = typeof engine.debtTotal === 'function' ? num(engine.debtTotal()) : 0;
        return `<section class="desktop-inspector-section"><div class="desktop-inspector-section-heading"><span>01</span><h3>当前职务</h3></div><div class="desktop-detail-list">${this.desktopDetail('职务', title)}${this.desktopDetail('单位', p.unit ? p.unit.name + '（' + (p.unit.level || '未知') + '）' : '尚未分配')}${this.desktopDetail('职级', rank + '（' + num(p.leadershipRank) + '级）')}${this.desktopDetail('工作年限', num(p.yearsWorked) + '年')}${this.desktopDetail('晋升次数', num(p.promotions) + '次')}${this.desktopDetail('声誉', Math.round(num(p.reputation, 50)))}${this.desktopDetail('群众口碑', Math.round(num(p.peopleReputation, 50)))}${this.desktopDetail('现金', Math.round(cash) + (debt > 0 ? ' · 负债 ' + Math.round(debt) : ''))}</div></section>`;
      }
      if (tab === 'network') {
        const summary = typeof engine.getNetworkSummary === 'function' ? engine.getNetworkSummary() : { total: (p.contacts || []).length, active: 0, remote: 0, rivals: 0, contacts: [], log: [], metrics: {} };
        const contacts = (summary.contacts || []).slice().sort((x, y) => num(y.influence) - num(x.influence)).slice(0, 6);
        const log = (summary.log || []).slice(-3).reverse();
        const available = this.canOpenNetwork();
        const networkAction = available
          ? `<button type="button" class="desktop-inspector-link" onclick="App.desktopNavigate('network')" aria-disabled="false">打开完整人脉页 <span aria-hidden="true">&#8599;</span></button>`
          : `<button type="button" class="desktop-inspector-link is-disabled" disabled aria-disabled="true">职业生涯后开放人脉页</button>`;
        return `<section class="desktop-inspector-section"><div class="desktop-inspector-section-heading"><span>01</span><h3>网络概览</h3></div><div class="desktop-mini-grid">${this.desktopMetric('联系人', num(summary.total) + '/' + num(summary.capacity))}${this.desktopMetric('活跃', num(summary.active))}${this.desktopMetric('异地', num(summary.remote))}${this.desktopMetric('冲突', num(summary.rivals))}</div><div class="desktop-network-list">${contacts.length ? contacts.map(c => `<div class="desktop-network-row"><span><strong>${esc(c.name || '未命名')}</strong><small>${esc(c.position || '普通联系人')}</small></span><b>${Math.round(num(c.relation))}</b></div>`).join('') : '<p class="desktop-empty">进入职业生涯后，这里会显示你的关系网络。</p>'}</div>${log.length ? `<div class="desktop-network-log">${log.map(item => `<p>${esc(item.text || item.event || item.message || '')}</p>`).join('')}</div>` : ''}${networkAction}</section>`;
      }
      const journey = this.getDesktopJourneySummary();
      const task = this.getDesktopNextAction();
      // v2.1.63 总览重构：8 项核心即时指标 + 语义色标；年龄/职级随头部与职务 tab 呈现，不再重复；
      // 存档状态由底部 persistence 区呈现；人脉由人脉 tab 呈现。
      const tone = (value, goodMin, badMax) => value >= goodMin ? 'is-good' : (value <= badMax ? 'is-bad' : 'is-warn');
      const cash = p.finance ? num(p.finance.cash) : num(p.wealth);
      const debt = typeof engine.debtTotal === 'function' ? Math.round(engine.debtTotal()) : 0;
      const rep = Math.round(num(p.reputation, 50));
      const ppRep = Math.round(num(p.peopleReputation, 50));
      const heat = Math.round(num(h.heat));
      const integrity = Math.round(num(h.integrity, 60));
      const ability = Math.round(num(h.workAbility, 50));
      const pressure = Math.round(num(h.mentalPressure, 30));
      const risk = Math.round(num(h.risk, 0));
      return `<section class="desktop-inspector-section"><div class="desktop-inspector-section-heading"><span>概览</span><h3>当前状态</h3></div><div class="desktop-mini-grid">
${this.desktopMetric('声誉', rep, tone(rep, 70, 40), '声誉 = 体制内组织评价，越高越好')}
${this.desktopMetric('群众口碑', ppRep, tone(ppRep, 60, 30), '群众口碑 = 民间风评，影响基层与民生路线')}
${this.desktopMetric('现金', Math.round(cash) + (debt > 0 ? ' ⁄ 负' + debt : ''), debt > 0 ? 'is-bad' : tone(cash, 120, 60), '现金结余；有负债时以红色警示')}
${this.desktopMetric('工作能力', ability, tone(ability, 70, 40), '工作能力 = 晋升与履职的硬通货')}
${this.desktopMetric('廉洁', integrity, tone(integrity, 70, 40), '廉洁 = 底线储备，过低易触发调查')}
${this.desktopMetric('热度', heat, heat >= 70 ? 'is-bad' : (heat >= 40 ? 'is-warn' : ''), '热度 = 纪检关注度，越高越危险')}
${this.desktopMetric('压力', pressure, pressure >= 80 ? 'is-bad' : (pressure >= 60 ? 'is-warn' : ''), '压力 ≥60 可能燃尽，≥80 触发健康事件')}
${this.desktopMetric('风险', risk, risk >= 70 ? 'is-bad' : (risk >= 40 ? 'is-warn' : ''), '风险 = 违纪风险池，越高越可能被查')}
</div><div class="desktop-context-card"><strong>当前人生章节</strong><p>${esc(journey.currentGroupLabel)} · ${esc(journey.phaseLabel)}</p></div><div class="desktop-context-card"><strong>当前任务 · ${esc(task.status)}</strong><p>${esc(task.title)}。${esc(task.next)}</p></div><div class="desktop-context-card"><strong>最近完成</strong><p>${esc(journey.recentCompletedLabel)}</p></div>${task.attention ? `<div class="desktop-context-card desktop-context-card-attention"><strong>需要注意</strong><p>${esc(task.attention)}</p></div>` : ''}<p class="desktop-inspector-legend">数值色标：<span class="is-good">绿</span> 健康线内 · <span class="is-warn">金</span> 临界 · <span class="is-bad">红</span> 危险。悬停指标格可看含义。</p></section>`;
    },
    getDesktopContextText() {
      const task = this.getDesktopNextAction();
      return task.next || '当前阶段的选择会在确认后立即保存，右侧面板用于核对状态。';
    },
    desktopDetail(label, value) {
      return `<div class="desktop-detail-row"><span>${esc(label)}</span><strong>${esc(value)}</strong></div>`;
    },
    desktopMetric(label, value, tone, hint) {
      const cls = tone ? ' ' + tone : '';
      const tip = hint ? ` title="${esc(hint)}"` : '';
      return `<div class="desktop-mini-metric${cls}"${tip}><strong>${esc(value)}</strong><span>${esc(label)}</span></div>`;
    },
    shouldRenderDesktopSidebar(options) {
      const opts = options || {};
      if (opts.forceNav || opts.forceInspector) return true;
      return typeof this.isDesktopLayout !== 'function' || this.isDesktopLayout();
    },
    captureDesktopNavState(nav) {
      if (!nav) return null;
      const active = typeof document !== 'undefined' ? document.activeElement : null;
      const focusAction = active && typeof nav.contains === 'function' && nav.contains(active)
        ? active.getAttribute('data-desktop-action')
        : null;
      return {
        scrollTop: Number(nav.scrollTop) || 0,
        focusAction: focusAction || null
      };
    },
    restoreDesktopNavState(nav, state) {
      if (!nav || !state) return;
      nav.scrollTop = Number(state.scrollTop) || 0;
      if (!state.focusAction || typeof nav.querySelectorAll !== 'function') return;
      const target = Array.from(nav.querySelectorAll('[data-desktop-action]'))
        .find(item => item.getAttribute('data-desktop-action') === state.focusAction);
      if (target && typeof target.focus === 'function') {
        try { target.focus({ preventScroll: true }); } catch (e) { target.focus(); }
      }
    },
    syncDesktopWorkspace(options) {
      const opts = options || {};
      const nav = document.getElementById('desktop-nav');
      const renderNav = !!(nav && !opts.inspectorOnly && this.shouldRenderDesktopSidebar(opts));
      const navState = renderNav ? this.captureDesktopNavState(nav) : null;
      if (renderNav) {
        nav.innerHTML = __h(this.renderDesktopNav());
        this.restoreDesktopNavState(nav, navState);
      }
      const panel = document.getElementById('side-panel');
      const renderInspector = !!(panel && !opts.navOnly && this.shouldRenderDesktopSidebar(opts));
      if (renderInspector) this.updateDesktopInspector();
      const footer = document.getElementById('desktop-nav-footer');
      if (footer) footer.innerHTML = __h(this.renderDesktopSaveHint());
      this.syncDesktopBreakpointState();
      this.syncDesktopScrollCues();
    }
  });
})();
