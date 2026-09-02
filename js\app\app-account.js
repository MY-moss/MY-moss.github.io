// 可选账号与云端存档：游客继续使用 localStorage，登录后按白名单同步完整进度。
// 账号工作台只保存会话状态在内存，密码、恢复码和会话令牌不进入 localStorage。
(function () {
  const ACCOUNT_MODES = Object.freeze(['login', 'register', 'recover']);
  const MODE_META = Object.freeze({
    login: { title: '登录账号', submit: '登录并检查云存档', passwordPlaceholder: '密码', confirm: false, recovery: false },
    register: { title: '注册并绑定', submit: '注册并绑定当前存档', passwordPlaceholder: '设置密码（至少 8 位）', confirm: true, recovery: false },
    recover: { title: '恢复账号', submit: '验证恢复码并重置密码', passwordPlaceholder: '设置新密码（至少 8 位）', confirm: true, recovery: true }
  });

  function safeRead(key, fallback) {
    try { const value = localStorage.getItem(key); return value == null ? fallback : JSON.parse(value); } catch (e) { return fallback; }
  }
  function safeWrite(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch (e) { return false; }
  }
  function stableSerialize(value) {
    if (Array.isArray(value)) return '[' + value.map(stableSerialize).join(',') + ']';
    if (value && typeof value === 'object') return '{' + Object.keys(value).sort().map(key => JSON.stringify(key) + ':' + stableSerialize(value[key])).join(',') + '}';
    return JSON.stringify(value);
  }
  function cloudSnapshotFingerprint(snapshot) {
    if (!snapshot || typeof snapshot !== 'object') return '';
    const normalized = {};
    Object.keys(snapshot).forEach(key => {
      if (key !== 'deviceId' && key !== 'baseRevision') normalized[key] = snapshot[key];
    });
    if (normalized.slots && typeof normalized.slots === 'object' && !Array.isArray(normalized.slots)) {
      normalized.slots = {};
      Object.keys(snapshot.slots).forEach(key => {
        const slot = snapshot.slots[key];
        if (!slot || typeof slot !== 'object' || Array.isArray(slot)) { normalized.slots[key] = slot; return; }
        const cleanSlot = {};
        Object.keys(slot).forEach(field => { if (field !== 'updatedAt') cleanSlot[field] = slot[field]; });
        normalized.slots[key] = cleanSlot;
      });
    }
    return stableSerialize(normalized);
  }
  function deviceId() {
    try {
      let id = localStorage.getItem('shanganDeviceId');
      if (!id) {
        id = (typeof crypto !== 'undefined' && crypto.randomUUID)
          ? crypto.randomUUID()
          : 'device_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 14);
        localStorage.setItem('shanganDeviceId', id);
      }
      return id;
    } catch (e) { return 'device_' + Math.random().toString(36).slice(2, 14); }
  }
  function esc(value) {
    return typeof App !== 'undefined' && App.escapeHtml
      ? App.escapeHtml(String(value == null ? '' : value))
      : String(value == null ? '' : value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }
  function replaceOverlay() {
    const old = document.querySelector('.menu-overlay');
    const returnFocus = old && old.__returnFocus ? old.__returnFocus : document.activeElement;
    if (old) old.remove();
    return returnFocus;
  }
  function modeMeta(mode) { return MODE_META[ACCOUNT_MODES.includes(mode) ? mode : 'login']; }
  function statusText(state) {
    return ({
      'local-only': '仅本地保存',
      offline: '网络不可用，仅本地保存',
      'cloud-ready': '已登录，等待同步',
      syncing: '正在同步云端',
      synced: '云端已同步',
      conflict: '存在存档冲突',
      error: '保存失败'
    })[state] || '等待同步';
  }

  Object.assign(App, {
    _account: { user: null, csrfToken: '', syncState: 'local-only', revision: 0, conflict: null, lastSyncedFingerprint: '', uiMode: 'login', formBusy: false },
    _cloudSyncTimer: null,
    _pendingRecoveryCode: '',
    _recoveryConfirmed: false,

    getDeviceId() { return deviceId(); },
    getCloudSnapshotFingerprint(snapshot) { return cloudSnapshotFingerprint(snapshot); },
    hasCloudContent(snapshot) {
      if (!snapshot || typeof snapshot !== 'object') return false;
      const slots = snapshot.slots && typeof snapshot.slots === 'object' ? snapshot.slots : {};
      if (Object.values(slots).some(Boolean)) return true;
      const meaningful = (value, depth) => {
        if (value == null) return false;
        if (Array.isArray(value)) return value.length > 0;
        if (typeof value === 'number') return Number.isFinite(value) && value !== 0;
        if (typeof value === 'string') return value.trim().length > 0;
        if (typeof value === 'boolean') return value;
        if (typeof value !== 'object' || (depth || 0) > 4) return false;
        return Object.keys(value).some(key => meaningful(value[key], (depth || 0) + 1));
      };
      const global = snapshot.global && typeof snapshot.global === 'object' ? snapshot.global : {};
      return meaningful(global.gameHistory, 0)
        || meaningful(global.gameStats, 0)
        || meaningful(global.gameAchievements, 0)
        || meaningful(global.gameCodex, 0)
        || meaningful(global.gameChallenges, 0)
        || Number(global.backgroundPity) > 0;
    },
    getAccountLabel() {
      const user = this._account && this._account.user;
      return user ? '账号：' + user.username : '游客 · 本地存档';
    },
    setAccountState(state, message) {
      this._account = Object.assign({}, this._account || {}, state || {});
      if (message && typeof this.showToast === 'function') this.showToast(message, this._account.syncState === 'error' ? 'error' : 'info');
      if (typeof this.updatePersistenceStatus === 'function') this.updatePersistenceStatus();
      const panel = document.querySelector('[data-account-panel]');
      if (panel) this.updateAccountStatus(panel);
    },
    accountMode() { const mode = this._account && this._account.uiMode; return ACCOUNT_MODES.includes(mode) ? mode : 'login'; },
    setAccountMode(mode) {
      if (!ACCOUNT_MODES.includes(mode)) mode = 'login';
      this._account = Object.assign({}, this._account || {}, { uiMode: mode });
      const panel = document.querySelector('[data-account-panel]');
      if (panel) this.updateAccountModeUI(panel);
      return mode;
    },
    accountFormValues(root) {
      root = root || document;
      const value = name => { const input = root.querySelector('[data-account-field="' + name + '"]'); return input ? String(input.value || '') : ''; };
      return { username: value('username').trim(), password: value('password'), confirmPassword: value('confirmPassword'), recoveryCode: value('recoveryCode').trim() };
    },
    renderAccountFieldErrors(root, errors) {
      root = root || document;
      root.querySelectorAll('[data-account-error]').forEach(node => {
        const field = node.getAttribute('data-account-error');
        const message = errors[field] || '';
        node.textContent = message;
        node.hidden = !message;
        const input = root.querySelector('[data-account-field="' + field + '"]');
        if (input) input.setAttribute('aria-invalid', message ? 'true' : 'false');
      });
    },
    validateAccountForm(mode, root) {
      mode = mode || this.accountMode();
      root = root || document;
      const values = this.accountFormValues(root);
      const errors = {};
      if (!/^[A-Za-z0-9_\-\u4e00-\u9fa5]{3,24}$/.test(values.username)) errors.username = '用户名为 3～24 位中文、字母、数字、下划线或短横线';
      if (values.password.length < 8 || values.password.length > 128) errors.password = '密码长度需为 8～128 位';
      if (mode === 'register' && values.confirmPassword !== values.password) errors.confirmPassword = '两次输入的密码不一致';
      if (mode === 'recover') {
        if (!values.recoveryCode) errors.recoveryCode = '请输入一次性恢复码';
        if (values.confirmPassword !== values.password) errors.confirmPassword = '两次输入的新密码不一致';
      }
      this.renderAccountFieldErrors(root, errors);
      return { ok: Object.keys(errors).length === 0, errors, values };
    },
    setAccountFormStatus(root, message, kind) {
      const node = (root || document).querySelector('[data-account-form-status]');
      if (!node) return;
      node.textContent = message || '';
      node.className = 'account-form-status' + (kind ? ' is-' + kind : '');
      node.hidden = !message;
    },
    setAccountLoading(loading, root) {
      root = root || document;
      this._account = Object.assign({}, this._account || {}, { formBusy: !!loading });
      const form = root.querySelector('[data-account-form]');
      if (form) {
        form.setAttribute('aria-busy', loading ? 'true' : 'false');
        form.querySelectorAll('button, input').forEach(control => { control.disabled = !!loading; });
        const submit = form.querySelector('[data-account-submit]');
        if (submit) submit.textContent = loading ? '处理中…' : modeMeta(this.accountMode()).submit;
      }
    },
    updateAccountModeUI(root) {
      root = root || document.querySelector('[data-account-panel]');
      if (!root) return;
      const mode = this.accountMode();
      const meta = modeMeta(mode);
      root.querySelectorAll('[data-account-mode]').forEach(button => {
        const active = button.getAttribute('data-account-mode') === mode;
        button.classList.toggle('is-active', active);
        button.setAttribute('aria-selected', active ? 'true' : 'false');
        button.setAttribute('tabindex', active ? '0' : '-1');
      });
      root.querySelectorAll('[data-account-section]').forEach(section => {
        const field = section.getAttribute('data-account-section');
        section.hidden = field === 'confirm' ? !meta.confirm : field === 'recovery' ? !meta.recovery : false;
      });
      const formPanel = root.querySelector('#account-form');
      if (formPanel) formPanel.setAttribute('aria-labelledby', 'account-mode-' + mode);
      const title = root.querySelector('[data-account-title]');
      if (title) title.textContent = meta.title;
      const password = root.querySelector('[data-account-field="password"]');
      if (password) {
        password.placeholder = meta.passwordPlaceholder;
        password.autocomplete = mode === 'login' ? 'current-password' : 'new-password';
      }
      const confirmPassword = root.querySelector('[data-account-field="confirmPassword"]');
      if (confirmPassword) confirmPassword.autocomplete = 'new-password';
      const submit = root.querySelector('[data-account-submit]');
      if (submit && !this._account.formBusy) submit.textContent = meta.submit;
      const recoveryHint = root.querySelector('[data-account-recovery-hint]');
      if (recoveryHint) recoveryHint.textContent = meta.recovery ? '恢复码只使用一次，验证成功后会立即轮换。' : '游客可以直接游玩；注册账号后可跨设备保存。';
      this.setAccountFormStatus(root, '', '');
      this.renderAccountFieldErrors(root, {});
    },
    updateAccountStatus(root) {
      root = root || document.querySelector('[data-account-panel]');
      if (!root) return;
      const state = this._account || {};
      const status = root.querySelector('[data-account-sync-status]');
      if (status) {
        status.textContent = statusText(state.syncState);
        status.className = 'account-status-badge account-status-' + String(state.syncState || 'local-only').replace(/[^a-z-]/g, '');
      }
      const revision = root.querySelector('[data-account-revision]');
      if (revision) revision.textContent = state.user ? '云端修订 ' + (state.revision || 0) : '当前为游客存档';
      const conflict = root.querySelector('[data-account-conflict]');
      if (conflict) conflict.hidden = !state.conflict;
    },
    bindAccountForm(root) {
      const form = root.querySelector('[data-account-form]');
      if (!form) return;
      root.addEventListener('click', event => {
        const modeButton = event.target.closest('[data-account-mode]');
        if (modeButton) { event.preventDefault(); this.setAccountMode(modeButton.getAttribute('data-account-mode')); return; }
        const action = event.target.closest('[data-account-action]');
        if (!action) return;
        const name = action.getAttribute('data-account-action');
        if (name === 'close') this.closeMenu();
        if (name === 'sync') this.syncCloudSave({ interactive: true });
        if (name === 'versions') this.showCloudVersions();
        if (name === 'logout') this.accountLogout();
        if (name === 'toggle-password') {
          const input = root.querySelector('[data-account-field="password"]');
          if (input) { input.type = input.type === 'password' ? 'text' : 'password'; action.setAttribute('aria-pressed', input.type === 'text' ? 'true' : 'false'); action.textContent = input.type === 'text' ? '隐藏' : '显示'; }
        }
      });
      root.addEventListener('keydown', event => this.handleAccountModeKeydown(event));
      form.addEventListener('submit', event => {
        event.preventDefault();
        if (this._account.formBusy) return;
        const mode = this.accountMode();
        const result = this.validateAccountForm(mode, root);
        if (!result.ok) { this.setAccountFormStatus(root, '请先修正标红字段', 'error'); return; }
        if (mode === 'login') this.accountLogin(result.values, root);
        if (mode === 'register') this.accountRegister(result.values, root);
        if (mode === 'recover') this.accountRecover(result.values, root);
      });
      form.addEventListener('input', event => {
        if (event.target.matches('[data-account-field]')) this.validateAccountForm(this.accountMode(), root);
      });
      this.updateAccountModeUI(root);
      this.updateAccountStatus(root);
    },
    handleAccountModeKeydown(event) {
      const target = event && event.target && typeof event.target.closest === 'function'
        ? event.target.closest('[data-account-mode]')
        : null;
      if (!target) return;
      const key = event.key;
      if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(key)) return;
      const tablist = target.closest('[role="tablist"]');
      const tabs = tablist ? Array.from(tablist.querySelectorAll('[data-account-mode]')) : [];
      if (!tabs.length) return;
      const current = Math.max(0, tabs.indexOf(target));
      let next = current;
      if (key === 'Home') next = 0;
      else if (key === 'End') next = tabs.length - 1;
      else next = (current + (key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
      event.preventDefault();
      this.setAccountMode(tabs[next].getAttribute('data-account-mode'));
      tabs[next].focus();
    },
    async initAccount() {
      this._account = Object.assign({ user: null, csrfToken: '', syncState: 'local-only', revision: 0, conflict: null, uiMode: 'login', formBusy: false }, this._account || {});
      if ((this.isStaticBuild && this.isStaticBuild()) || typeof fetch !== 'function' || typeof location === 'undefined' || location.protocol === 'file:') {
        this.setAccountState({ syncState: 'local-only' });
        return;
      }
      try {
        const response = await fetch('/api/auth/me', { credentials: 'include', cache: 'no-store' });
        const data = await response.json();
        if (data && data.user) {
          this.setAccountState({ user: data.user, csrfToken: data.csrfToken || '', syncState: 'cloud-ready', revision: data.user.saveRevision || 0 });
          this.syncCloudSave({ interactive: true });
        } else this.setAccountState({ user: null, csrfToken: '', syncState: 'local-only', revision: 0 });
      } catch (e) { this.setAccountState({ syncState: 'offline' }); }
    },
    async accountRequest(url, method, body) {
      const headers = {};
      if (body !== undefined) headers['Content-Type'] = 'application/json';
      if (this._account && this._account.csrfToken && method !== 'GET') headers['X-CSRF-Token'] = this._account.csrfToken;
      const response = await fetch(url, { method: method || 'GET', credentials: 'include', cache: 'no-store', headers, body: body === undefined ? undefined : JSON.stringify(body) });
      let data = {};
      try { data = await response.json(); } catch (e) {}
      if (!response.ok) { const error = new Error(data.msg || '请求失败'); error.data = data; error.status = response.status; throw error; }
      return data;
    },
    async accountLogin(values, root) {
      values = values || this.accountFormValues(root || document);
      this.setAccountLoading(true, root);
      try {
        const data = await this.accountRequest('/api/auth/login', 'POST', { username: values.username, password: values.password });
        this.setAccountState({ user: data.user, csrfToken: data.csrfToken || '', syncState: 'cloud-ready', revision: data.user.saveRevision || 0 });
        this.showToast('登录成功；本地与云端存档不会自动覆盖', 'success');
        this.showAccountPanel();
        this.syncCloudSave({ interactive: true });
      } catch (e) {
        this.setAccountFormStatus(root, (e.data && e.data.msg) || '登录失败，请检查用户名和密码', 'error');
        this.showToast((e.data && e.data.msg) || '登录失败，请稍后重试', 'error');
      } finally { this.setAccountLoading(false, root); }
    },
    async accountRegister(values, root) {
      values = values || this.accountFormValues(root || document);
      this.setAccountLoading(true, root);
      try {
        const data = await this.accountRequest('/api/auth/register', 'POST', { username: values.username, password: values.password });
        this.setAccountState({ user: data.user, csrfToken: data.csrfToken || '', syncState: 'cloud-ready', revision: 0 });
        this.showRecoveryCode(data.recoveryCode, '注册成功。恢复码只显示这一次，丢失后不能无验证找回。');
        this.syncCloudSave({ interactive: true });
      } catch (e) {
        this.setAccountFormStatus(root, (e.data && e.data.msg) || '注册失败，请检查用户名和密码', 'error');
        this.showToast((e.data && e.data.msg) || '注册失败，请检查用户名和密码', 'error');
      } finally { this.setAccountLoading(false, root); }
    },
    async accountRecover(values, root) {
      values = values || this.accountFormValues(root || document);
      this.setAccountLoading(true, root);
      try {
        const data = await this.accountRequest('/api/auth/recover', 'POST', { username: values.username, recoveryCode: values.recoveryCode, newPassword: values.password });
        this.setAccountState({ user: data.user, csrfToken: data.csrfToken || '', syncState: 'cloud-ready', revision: data.user.saveRevision || 0 });
        this.showRecoveryCode(data.recoveryCode, '密码已重置，旧恢复码已失效。');
        this.syncCloudSave({ interactive: true });
      } catch (e) {
        this.setAccountFormStatus(root, (e.data && e.data.msg) || '恢复失败，请检查账号与恢复码', 'error');
        this.showToast((e.data && e.data.msg) || '恢复失败，请检查账号与恢复码', 'error');
      } finally { this.setAccountLoading(false, root); }
    },
    showRecoveryCode(code, message) {
      const returnFocus = replaceOverlay();
      this._pendingRecoveryCode = String(code || '');
      this._recoveryConfirmed = false;
      const next = document.createElement('div');
      next.className = 'menu-overlay';
      next.innerHTML = __h(`<div class="menu-modal account-recovery-card" role="dialog" aria-modal="true" aria-labelledby="recovery-title" data-recovery-panel="1">
        <div class="menu-header"><h2 id="recovery-title">🔐 保存恢复码</h2><button type="button" class="icon-btn" data-recovery-action="close" aria-label="关闭恢复码">✕</button></div>
        <p class="account-helper">${esc(message)}</p>
        <div class="account-recovery-code" aria-label="恢复码">${esc(this._pendingRecoveryCode)}</div>
        <p class="account-warning">恢复码不会再次显示。请复制或下载后，再确认已经安全保存。</p>
        <div class="account-action-row"><button type="button" class="btn btn-secondary" data-recovery-action="copy">复制</button><button type="button" class="btn btn-secondary" data-recovery-action="download">下载</button></div>
        <button type="button" class="btn btn-primary" data-recovery-action="saved">我已安全保存，关闭</button>
      </div>`);
      document.body.appendChild(next);
      next.addEventListener('click', event => {
        const action = event.target.closest('[data-recovery-action]');
        if (!action) return;
        const name = action.getAttribute('data-recovery-action');
        if (name === 'copy') this.copyRecoveryCode();
        if (name === 'download') this.downloadRecoveryCode();
        if (name === 'saved') { this._recoveryConfirmed = true; this.closeRecoveryCode(); }
        if (name === 'close') this.closeRecoveryCode();
      });
      if (typeof this.bindModalOverlay === 'function') this.bindModalOverlay(next, {
        returnFocus,
        focusSelector: '[data-recovery-action="copy"]',
        beforeClose: () => {
          if (!this._recoveryConfirmed) {
            this.showToast('请先复制或下载恢复码，再确认安全保存', 'warning');
            return false;
          }
          this._pendingRecoveryCode = '';
          this._recoveryConfirmed = false;
          return true;
        }
      });
    },
    closeRecoveryCode() {
      if (this._pendingRecoveryCode && !this._recoveryConfirmed) {
        this.showToast('请先复制或下载恢复码，再确认安全保存', 'warning');
        return;
      }
      this._pendingRecoveryCode = '';
      this._recoveryConfirmed = false;
      this.closeMenu();
    },
    async copyRecoveryCode() {
      const code = String(this._pendingRecoveryCode || '');
      if (!code) return;
      let copied = false;
      try {
        if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') { await navigator.clipboard.writeText(code); copied = true; }
      } catch (e) {}
      if (!copied) {
        try { const area = document.createElement('textarea'); area.value = code; area.setAttribute('readonly', ''); area.className = 'account-copy-fallback'; document.body.appendChild(area); area.select(); copied = document.execCommand && document.execCommand('copy'); area.remove(); } catch (e) { copied = false; }
      }
      if (copied) { this._recoveryConfirmed = true; this.showToast('恢复码已复制，请另行保存', 'success'); }
      else this.showToast('复制失败，请改用下载或手动保存', 'warning');
    },
    downloadRecoveryCode() {
      const code = String(this._pendingRecoveryCode || '');
      if (!code) return;
      try {
        const blob = new Blob(['上岸模拟器恢复码\n\n' + code + '\n\n请妥善保管。'], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a'); link.href = url; link.download = 'shangan-recovery-code.txt'; link.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        this._recoveryConfirmed = true;
        this.showToast('恢复码文件已下载，请妥善保管', 'success');
      } catch (e) { this.showToast('下载失败，请手动复制恢复码', 'warning'); }
    },
    showAccountPanel() {
      if (this.isStaticBuild && this.isStaticBuild()) {
        this.showToast('静态版仅支持本地存档；可使用菜单中的备份功能转移进度', 'info');
        return;
      }
      if (typeof this.setDesktopRoute === 'function') this.setDesktopRoute('account', { sync: false });
      const returnFocus = replaceOverlay();
      const overlay = document.createElement('div');
      overlay.className = 'menu-overlay';
      overlay.innerHTML = __h(this._account && this._account.user ? this.renderSignedInAccount() : this.renderGuestAccount());
      document.body.appendChild(overlay);
      if (this._account && this._account.user) {
        overlay.addEventListener('click', event => {
          const action = event.target.closest('[data-account-action]');
          if (!action) return;
          const name = action.getAttribute('data-account-action');
          if (name === 'close') this.closeMenu();
          if (name === 'sync') this.syncCloudSave({ interactive: true });
          if (name === 'versions') this.showCloudVersions();
          if (name === 'logout') this.accountLogout();
        });
      } else this.bindAccountForm(overlay);
      this.updateAccountStatus(overlay);
      if (typeof this.bindModalOverlay === 'function') this.bindModalOverlay(overlay, { returnFocus, focusSelector: this._account && this._account.user ? '[data-account-action="sync"]' : '[data-account-field="username"]' });
    },
    // v2.1.79 首次注册引导：未登录且玩过（或刚完成指引）时，温和提醒一次注册云端存档的好处
    hasAccount() { return !!(this._account && this._account.user); },
    maybePromptAccountSetup(options) {
      try {
        if (this.isStaticBuild && this.isStaticBuild()) return;
        if (this.hasAccount()) return;
        const afterTutorial = !!(options && options.afterTutorial);
        const played = !!(this.stats && this.stats.plays > 0);
        if (!afterTutorial && !played) return;
        if (localStorage.getItem('shangan_account_prompted')) return; // 全局仅提醒一次，避免打扰
        setTimeout(() => this.promptAccountSetup(), afterTutorial ? 400 : 1400);
      } catch (e) {}
    },
    promptAccountSetup() {
      try { localStorage.setItem('shangan_account_prompted', '1'); } catch (e) {}
      const returnFocus = document.activeElement;
      const overlay = document.createElement('div');
      overlay.className = 'menu-overlay';
      overlay.innerHTML = __h(`
        <div class="menu-modal account-workbench account-prompt-modal" role="dialog" aria-modal="true" aria-labelledby="acct-prompt-title" data-account-panel="1">
          <div class="account-workbench-head"><div><p class="account-eyebrow">数据安全</p><h2 id="acct-prompt-title">☁️ 注册账号，存档不丢</h2></div><button type="button" class="icon-btn" data-account-action="close" aria-label="关闭" onclick="App.closeMenu()">✕</button></div>
          <div class="account-prompt-list">
            <div><span>💾</span><p><b>防丢失</b>——清除浏览器缓存、重装系统也不会丢进度</p></div>
            <div><span>🌐</span><p><b>跨设备</b>——手机/电脑随时接着玩，进度云端同步</p></div>
            <div><span>🔑</span><p><b>可找回</b>——忘了密码用一次性恢复码就能找回账号</p></div>
          </div>
          <div class="account-action-stack">
            <button type="button" class="btn btn-primary" onclick="App.closeMenu(); App.setAccountMode('register'); App.showAccountPanel()">☁️ 立即注册并绑定当前存档</button>
            <button type="button" class="btn btn-secondary" onclick="App.closeMenu()">暂不注册，先继续玩</button>
          </div>
          <p class="account-helper">游客也可以正常游玩；注册完全自愿。</p>
        </div>`);
      document.body.appendChild(overlay);
      if (typeof this.bindModalOverlay === 'function') this.bindModalOverlay(overlay, { returnFocus, focusSelector: '[data-account-action="close"]' });
    },
    renderGuestAccount() {
      return `<div class="menu-modal account-workbench" role="dialog" aria-modal="true" aria-labelledby="account-title" data-account-panel="1">
        <div class="account-workbench-head"><div><p class="account-eyebrow">身份与存档</p><h2 id="account-title" data-account-title>登录账号</h2></div><button type="button" class="icon-btn" data-account-action="close" aria-label="关闭账号面板">✕</button></div>
        <p class="account-helper" data-account-recovery-hint>游客可以直接游玩；注册账号后可跨设备保存。</p>
        <div class="account-mode-tabs" role="tablist" aria-label="账号操作模式"><button type="button" role="tab" id="account-mode-login" data-account-mode="login" aria-selected="${this.accountMode() === 'login' ? 'true' : 'false'}" tabindex="${this.accountMode() === 'login' ? '0' : '-1'}" aria-controls="account-form">登录</button><button type="button" role="tab" id="account-mode-register" data-account-mode="register" aria-selected="${this.accountMode() === 'register' ? 'true' : 'false'}" tabindex="${this.accountMode() === 'register' ? '0' : '-1'}" aria-controls="account-form">注册</button><button type="button" role="tab" id="account-mode-recover" data-account-mode="recover" aria-selected="${this.accountMode() === 'recover' ? 'true' : 'false'}" tabindex="${this.accountMode() === 'recover' ? '0' : '-1'}" aria-controls="account-form">恢复密码</button></div>
        <form id="account-form" class="account-form" data-account-form role="tabpanel" aria-labelledby="account-mode-${this.accountMode()}" tabindex="0" novalidate>
          <div id="account-form-status" class="account-form-status" data-account-form-status role="status" aria-live="polite" hidden></div>
          <label class="account-field"><span>用户名</span><input data-account-field="username" aria-label="用户名" autocomplete="username" placeholder="3～24位中文、字母或数字" required><small data-account-error="username" class="account-field-error" hidden></small></label>
          <label class="account-field"><span>密码</span><div class="account-password-wrap"><input data-account-field="password" aria-label="密码" type="password" autocomplete="current-password" placeholder="密码" required><button id="account-password-toggle" type="button" class="account-password-toggle" data-account-action="toggle-password" aria-label="显示或隐藏密码" aria-pressed="false">显示</button></div><small data-account-error="password" class="account-field-error" hidden></small></label>
          <label class="account-field" data-account-section="confirm" hidden><span>确认密码</span><input id="account-confirm-password" data-account-field="confirmPassword" type="password" autocomplete="new-password" aria-label="确认密码" placeholder="再次输入密码"><small data-account-error="confirmPassword" class="account-field-error" hidden></small></label>
          <label class="account-field" data-account-section="recovery" hidden><span>一次性恢复码</span><input id="account-recovery" data-account-field="recoveryCode" autocomplete="off" aria-label="一次性恢复码" placeholder="请输入恢复码"><small data-account-error="recoveryCode" class="account-field-error" hidden></small></label>
          <button type="submit" class="btn btn-primary account-submit" data-account-submit>登录并检查云存档</button>
        </form>
        <div class="account-local-note"><span class="account-note-icon">◌</span><span>游客存档只存在当前浏览器和当前 Origin。登录不会自动覆盖本地或云端进度。</span></div>
      </div>`;
    },
    renderSignedInAccount() {
      const snapshot = this.collectCloudSnapshot();
      const slots = ['0', '1', '2'].map(key => { const item = snapshot.slots[key]; return `<div class="account-slot-card"><span class="account-slot-label">存档 ${Number(key) + 1}</span><strong>${esc(item ? item.name || '未命名' : '空槽位')}</strong><span>${item ? esc((item.age || 0) + ' 岁 · ' + (item.phase || '未开始')) : '可用于新局'}</span></div>`; }).join('');
      return `<div class="menu-modal account-workbench account-signed-in" role="dialog" aria-modal="true" aria-labelledby="account-title" data-account-panel="1">
        <div class="account-workbench-head"><div><p class="account-eyebrow">云端存档工作台</p><h2 id="account-title">${esc(this._account.user.username)}</h2></div><button type="button" class="icon-btn" data-account-action="close" aria-label="关闭账号面板">✕</button></div>
        <div class="account-sync-card"><div><span class="account-sync-label">同步状态</span><strong data-account-sync-status>等待同步</strong></div><span data-account-revision>云端修订 0</span></div>
        <div class="account-conflict-note" data-account-conflict hidden>本地和云端都有更新，请进入冲突处理，不要刷新覆盖。</div>
        <section class="account-section"><div class="account-section-head"><h3>当前设备存档槽</h3><span class="account-helper">白名单同步 3 个槽位</span></div><div class="account-slot-grid">${slots}</div></section>
        <div class="account-action-stack"><button type="button" class="btn btn-primary" data-account-action="sync">🔄 立即同步</button><button type="button" class="btn btn-secondary" data-account-action="versions">🕘 查看历史版本</button><button type="button" class="btn btn-secondary" data-account-action="logout">退出登录（本地存档保留）</button></div>
        <div class="account-local-note"><span class="account-note-icon">✓</span><span>云端只保存明确的游戏进度字段，不保存密码、恢复码或监控数据。</span></div>
      </div>`;
    },
    async accountLogout() {
      try { await this.accountRequest('/api/auth/logout', 'POST', {}); } catch (e) {}
      this.setAccountState({ user: null, csrfToken: '', syncState: 'local-only', revision: 0, conflict: null, uiMode: 'login' });
      if (document.querySelector('.menu-overlay')) this.closeMenu();
      this.showToast('已退出登录，本地存档仍保留', 'success');
    },
    collectCloudSnapshot() {
      const slots = {};
      [0, 1, 2].forEach(slot => {
        const key = engine.getSaveKey(slot);
        try {
          const raw = localStorage.getItem(key);
          const state = raw ? JSON.parse(raw) : null;
          const info = state && state.player ? { name: state.player.name || '未命名', age: state.player.age || 0, phase: state.phase || '', updatedAt: Number(localStorage.getItem(engine.getSaveTimeKey(slot)) || Date.now()) } : null;
          slots[String(slot)] = state ? { payload: state, ...info } : null;
        } catch (e) { slots[String(slot)] = null; }
      });
      return { schemaVersion: 1, deviceId: this.getDeviceId(), baseRevision: this._account.revision || 0, slots, global: { gameHistory: Array.isArray(this.gameHistory) ? this.gameHistory : [], gameStats: this.stats || {}, gameAchievements: Array.isArray(this.achievements) ? this.achievements : [], gameCodex: this.codex || safeRead('gameCodex', {}), gameChallenges: this.challenges || safeRead('gameChallenges', {}), backgroundPity: Number(localStorage.getItem('shangan_bg_pity') || 0) || 0, soundOn: this.soundOn() } };
    },
    applyCloudSnapshot(snapshot) {
      if (!snapshot) return false;
      try {
        [0, 1, 2].forEach(slot => {
          const item = snapshot.slots && snapshot.slots[String(slot)];
          if (!item) { localStorage.removeItem(engine.getSaveKey(slot)); localStorage.removeItem(engine.getSaveTimeKey(slot)); return; }
          localStorage.setItem(engine.getSaveKey(slot), JSON.stringify(item.payload));
          localStorage.setItem(engine.getSaveTimeKey(slot), String(item.updatedAt || Date.now()));
        });
        const global = snapshot.global || {};
        safeWrite('gameHistory', global.gameHistory || []); safeWrite('gameStats', global.gameStats || {}); safeWrite('gameAchievements', global.gameAchievements || []); safeWrite('gameCodex', global.gameCodex || {}); safeWrite('gameChallenges', global.gameChallenges || {});
        localStorage.setItem('shangan_bg_pity', String(global.backgroundPity || 0));
        localStorage.setItem('sound_on', global.soundOn === false ? '0' : '1');
        this.gameHistory = global.gameHistory || []; this.stats = global.gameStats || this.stats; this.achievements = global.gameAchievements || []; this.codex = global.gameCodex || {}; this.challenges = global.gameChallenges || this.challenges || {};
        this.updateStatsDisplay();
        this.refreshAfterCloudApply(snapshot);
        return true;
      } catch (e) { this.showToast('云端存档写入本地失败，请使用文件备份', 'error'); return false; }
    },
    refreshAfterCloudApply(snapshot) {
      try {
        const slot = Number.isInteger(this.currentSlot) ? this.currentSlot : (Number.isInteger(engine.currentSaveSlot) ? engine.currentSaveSlot : 0);
        const current = snapshot.slots && snapshot.slots[String(slot)];
        if (current && typeof this.loadGame === 'function') this.loadGame(slot);
        else if (!current && typeof engine.reset === 'function') { engine.reset(); this.render(); this.updateStatus(); }
      } catch (e) {}
    },
    scheduleCloudSync() {
      if (!this._account || !this._account.user || typeof fetch !== 'function') return;
      if (this._cloudSyncTimer) clearTimeout(this._cloudSyncTimer);
      this._cloudSyncTimer = setTimeout(() => { this._cloudSyncTimer = null; this.syncCloudSave({ background: true }); }, 1800);
    },
    async uploadCloudSnapshot(snapshot, baseRevision, silent, options) {
      options = options || {};
      try {
        const data = await this.accountRequest('/api/account/save', 'PUT', { snapshot, baseRevision });
        this.setAccountState({ revision: data.revision, syncState: 'synced', conflict: null, lastSyncedFingerprint: cloudSnapshotFingerprint(snapshot) });
        if (!silent) this.showToast('云端存档已同步', 'success');
        return data;
      } catch (e) {
        if (e.status === 409 && e.data && e.data.current) {
          this.setAccountState({ syncState: 'conflict', conflict: { current: e.data.current, local: snapshot } });
          if (options && options.interactive) this.showCloudConflict();
        }
        else this.setAccountState({ syncState: 'offline' });
        return null;
      }
    },
    async syncCloudSave(options) {
      options = options || {};
      if (!this._account || !this._account.user) { if (!options.background) this.showToast('请先登录账号', 'warning'); return null; }
      try {
        this.setAccountState({ syncState: 'syncing' });
        const data = await this.accountRequest('/api/account/save', 'GET');
        const local = this.collectCloudSnapshot();
        if (!data.snapshot) return this.uploadCloudSnapshot(local, data.revision || 0, options.background, options);
        const hasLocal = this.hasCloudContent(local);
        if (!hasLocal) {
          this.applyCloudSnapshot(data.snapshot);
          this.setAccountState({ revision: data.revision, syncState: 'synced', conflict: null, lastSyncedFingerprint: cloudSnapshotFingerprint(data.snapshot) });
          if (!options.background) this.showToast('已恢复云端存档', 'success');
          return data;
        }
        const localFingerprint = cloudSnapshotFingerprint(local);
        const remoteFingerprint = cloudSnapshotFingerprint(data.snapshot);
        if (localFingerprint === remoteFingerprint) {
          this.setAccountState({ revision: data.revision, syncState: 'synced', conflict: null, lastSyncedFingerprint: remoteFingerprint });
          return data;
        }
        this.setAccountState({ revision: data.revision, syncState: 'conflict', conflict: { current: data, local } });
        if (options.interactive) this.showCloudConflict();
        return data;
      } catch (e) { this.setAccountState({ syncState: 'offline' }); if (!options.background) this.showToast('当前无法连接云端，仅本地保存', 'warning'); return null; }
    },
    showCloudConflict() {
      const conflict = this._account && this._account.conflict;
      if (!conflict) return;
      const returnFocus = replaceOverlay();
      const overlay = document.createElement('div'); overlay.className = 'menu-overlay';
      overlay.innerHTML = __h(`<div class="menu-modal account-workbench" role="dialog" aria-modal="true" aria-labelledby="conflict-title"><div class="account-workbench-head"><div><p class="account-eyebrow">同步需要确认</p><h2 id="conflict-title">⚖️ 存档冲突</h2></div><button type="button" class="icon-btn" data-account-action="close" aria-label="关闭存档冲突">✕</button></div><p class="account-helper">本地和云端都有更新，系统不会静默覆盖。另一份会先保留在云端历史版本中。</p><div class="account-conflict-grid"><div><span>本地版本</span><strong>${esc(this.cloudSummary(conflict.local))}</strong></div><div><span>云端版本</span><strong>${esc(this.cloudSummary(conflict.current.snapshot || conflict.current))}</strong></div></div><div class="account-action-stack"><button type="button" class="btn btn-primary" data-account-action="conflict-local">保留本地并上传</button><button type="button" class="btn btn-secondary" data-account-action="conflict-remote">使用云端覆盖本地</button></div></div>`);
      document.body.appendChild(overlay);
      overlay.addEventListener('click', event => {
        const action = event.target.closest('[data-account-action]'); if (!action) return;
        const name = action.getAttribute('data-account-action');
        if (name === 'close') this.closeMenu();
        if (name === 'conflict-local') this.resolveCloudConflict('local');
        if (name === 'conflict-remote') this.resolveCloudConflict('remote');
      });
      if (typeof this.bindModalOverlay === 'function') this.bindModalOverlay(overlay, { returnFocus, focusSelector: '[data-account-action="conflict-local"]' });
    },
    cloudSummary(snapshot) { const item = snapshot && snapshot.slots && snapshot.slots['0']; return item ? (item.name || '主线') + ' · ' + (item.age || 0) + '岁 · ' + (item.phase || '未开始') : '暂无存档'; },
    async resolveCloudConflict(choice) {
      const conflict = this._account && this._account.conflict; if (!conflict) return;
      if (document.querySelector('.menu-overlay')) this.closeMenu();
      if (choice === 'remote') {
        const remote = conflict.current.snapshot || conflict.current;
        const preserved = await this.uploadCloudSnapshot(conflict.local, conflict.current.revision, true);
        if (!preserved) { this.showToast('本地版本暂未保留到云端，请勿刷新页面', 'warning'); return; }
        const restored = await this.uploadCloudSnapshot(remote, preserved.revision, true);
        if (!restored) { this.showToast('云端版本恢复失败，当前保留的是本地版本', 'warning'); return; }
        this.applyCloudSnapshot(remote); this.setAccountState({ revision: restored.revision, syncState: 'synced', conflict: null }); this.showToast('已使用云端版本，本地版本已保留在云端历史', 'success'); return;
      }
      await this.uploadCloudSnapshot(conflict.local, conflict.current.revision, false);
    },
    async showCloudVersions() {
      try {
        const data = await this.accountRequest('/api/account/versions', 'GET');
        const rows = (data.versions || []).map(v => `<div class="account-version-row"><span>修订 ${esc(v.revision)} · ${esc(new Date(v.updatedAt || 0).toLocaleString('zh-CN'))}</span><button type="button" class="btn btn-secondary btn-sm" data-account-action="restore-version" data-revision="${esc(v.revision)}">恢复</button></div>`).join('') || '<p class="account-empty">暂无历史版本</p>';
        const returnFocus = replaceOverlay();
        const next = document.createElement('div'); next.className = 'menu-overlay'; next.innerHTML = __h(`<div class="menu-modal account-workbench" role="dialog" aria-modal="true" aria-labelledby="versions-title"><div class="account-workbench-head"><div><p class="account-eyebrow">云端存档</p><h2 id="versions-title">🕘 历史版本</h2></div><button type="button" class="icon-btn" data-account-action="close" aria-label="关闭历史版本">✕</button></div><div class="account-version-list">${rows}</div></div>`); document.body.appendChild(next);
        next.addEventListener('click', event => { const action = event.target.closest('[data-account-action]'); if (!action) return; if (action.getAttribute('data-account-action') === 'close') this.closeMenu(); if (action.getAttribute('data-account-action') === 'restore-version') this.restoreCloudVersion(Number(action.getAttribute('data-revision'))); });
        if (typeof this.bindModalOverlay === 'function') this.bindModalOverlay(next, { returnFocus, focusSelector: '[data-account-action="close"]' });
      } catch (e) { this.showToast('无法读取云端历史', 'error'); }
    },
    async restoreCloudVersion(revision) {
      try { const data = await this.accountRequest('/api/account/restore', 'POST', { revision, baseRevision: this._account.revision }); this.applyCloudSnapshot(data.snapshot); this.setAccountState({ revision: data.revision, syncState: 'synced' }); const overlay = document.querySelector('.menu-overlay'); if (overlay) this.closeMenu(); this.showToast('历史版本已恢复到本地', 'success'); } catch (e) { this.showToast((e.data && e.data.msg) || '恢复失败，可能存在新冲突', 'error'); }
    }
  });
})();
