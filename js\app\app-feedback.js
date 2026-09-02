// 玩家反馈模块。
// 依赖：app-core.js 提供 escapeHtml 与 showToast。
Object.assign(App, {
  _feedbackTime(value) {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? '时间未知' : date.toLocaleString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  },
  loadMyFeedback() {
    const el = document.getElementById('fb-history');
    if (!el) return;
    if (this.isStaticBuild && this.isStaticBuild()) {
      el.innerHTML = '<p class="empty-state">静态版暂不提供在线反馈，请通过项目主页联系作者。</p>';
      return;
    }
    fetch('/api/feedback/mine')
      .then(async response => {
        const payload = await response.json();
        if (!response.ok) throw new Error('FEEDBACK_LOAD_FAILED');
        const rows = Array.isArray(payload) ? payload : (Array.isArray(payload.feedback) ? payload.feedback : []);
        return rows.filter(item => item && typeof item === 'object');
      })
      .then(list => {
        if (!list || list.length === 0) {
          el.innerHTML = __h('<p class="fb-empty" role="status">还没有留言，说说你的想法吧！</p>');
          return;
        }
        const typeNames = { suggestion: '💡 建议', bug: '🐛 问题', praise: '👍 鼓励', other: '📝 其他' };
        const statusNames = { pending: '⏳ 待处理', planned: '📋 已采纳', done: '✅ 已实现', rejected: '🙅 暂不考虑' };
        const statusClasses = { pending: 'pending', planned: 'planned', done: 'done', rejected: 'rejected' };
        el.innerHTML = __h(list.map(f => `
          <article class="fb-item">
            <div class="fb-item-header">
              <span class="fb-item-type">${this.escapeHtml(typeNames[f.type] || f.type || '📝 其他')} · ${this._feedbackTime(f.time)}</span>
              <span class="fb-status fb-status-${statusClasses[f.status] || 'unknown'}" role="status">${this.escapeHtml(statusNames[f.status] || '处理中')}</span>
            </div>
            <p class="fb-item-content">${this.escapeHtml(f.content || '')}</p>
            ${Array.isArray(f.replies) && f.replies.length > 0 ? f.replies.map(r => `
              <div class="fb-reply">
                <span class="fb-reply-label">🎮 制作组回复 · ${this._feedbackTime(r.time)}</span>
                <p>${this.escapeHtml(r.content || '')}</p>
              </div>`).join('') : ''}
          </article>
        `).join(''));
      })
      .catch(() => { el.innerHTML = __h('<p class="fb-empty" role="status">无法加载留言记录（需通过本地服务器访问）</p>'); });
  },
  submitFeedback() {
    if (this.isStaticBuild && this.isStaticBuild()) {
      this.showToast && this.showToast('静态版暂不提供在线反馈', 'info');
      return;
    }
    const content = document.getElementById('fb-content');
    const type = document.getElementById('fb-type');
    if (!content || !content.value.trim()) { this.showToast('请先写下你的想法', 'warning'); return; }
    if (this._feedbackSubmitting) return;
    const submit = document.querySelector('[data-feedback-submit]');
    this._feedbackSubmitting = true;
    if (submit) { submit.disabled = true; submit.setAttribute('aria-busy', 'true'); }
    fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: content.value.trim(), type: type ? type.value : 'suggestion' })
    }).then(async response => {
      const res = await response.json();
      if (!response.ok) throw Object.assign(new Error('FEEDBACK_SUBMIT_FAILED'), { data: res });
      return res;
    }).then(res => {
      if (res.ok) {
        this.showToast('留言已提交，感谢反馈！', 'success');
        content.value = '';
        this.loadMyFeedback();
      } else {
        this.showToast(res.msg || '提交失败', 'error');
      }
    }).catch(error => this.showToast((error.data && error.data.msg) || '提交失败，请确认通过服务器访问', 'error'))
      .finally(() => {
        this._feedbackSubmitting = false;
        if (submit) { submit.disabled = false; submit.removeAttribute('aria-busy'); }
      });
  }
});
