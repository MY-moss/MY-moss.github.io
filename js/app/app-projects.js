// ==================== 政策项目制界面 ====================
Object.assign(App, {
  renderPolicyProjectPanel(p) {
    if (!p || !p.isEmployed) return '';
    const state = engine.getState();
    const active = state.policyProject;
    if (active) {
      const project = engine.getPolicyProjectDefinition(active.id);
      if (!project) return '';
      const stage = Math.min(active.stage || 0, project.duration);
      const progress = Math.min(100, Math.round((stage / project.duration) * 100));
      // v2.1.63 子案进度：当前步归属的子案显示出来
      const curStage = project.stages && project.stages[Math.min(stage, (project.stages || []).length - 1)];
      const subCase = curStage && curStage.subCase && Array.isArray(project.subCases)
        ? project.subCases.find(sc => sc && sc.id === curStage.subCase) : null;
      const subCaseText = subCase ? subCase.name : (project.stages ? `第 ${stage + 1}/${project.duration} 步` : '');
      return `
        <div class="career-card" style="margin-top:10px;border-left:3px solid var(--vermilion)">
          <div class="career-event">
            <p style="font-weight:700;color:var(--vermilion)">${project.icon || '📋'} 政策项目：${App.escapeHtml(project.name)}</p>
            <p style="font-size:12px;color:var(--ink-light);margin-top:4px">${App.escapeHtml(project.summary)}</p>
          </div>
          <div class="career-stats">
            <div class="stat-item"><span>📍 当前子案</span><span>${App.escapeHtml(subCaseText)}</span></div>
            <div class="stat-item"><span>📊 完成度</span><span>${progress}%（${stage}/${project.duration} 决策点）</span></div>
            <div class="stat-item"><span>公共预算</span><span>${active.budget} 点（非个人财富）</span></div>
            <div class="stat-item"><span>调整工期</span><span>${active.pauses||0}/2 次</span></div>
            <div class="stat-item"><span>🔥 舆情危机</span><span>${active.opinionCrises || 0}/1</span></div>
          </div>
          <button class="btn btn-secondary" onclick="App.abandonPolicyProject()" style="margin-top:6px">终止项目</button>
        </div>
      `;
    }
    const projects = engine.getPolicyProjectDefinitions();
    if (!this._policyProjectPickerOpen) {
      return `
        <div class="career-card" style="margin-top:10px;border-left:3px solid var(--ui-gold)">
          <div class="career-event"><p style="font-weight:700">📋 政策项目</p><p style="font-size:12px;color:var(--ink-light);margin-top:4px">主动承接一项长期任务：多个子案、六七个决策点，有职级与年限门槛，做出成果也要面对舆情。</p></div>
          <button class="btn btn-secondary" onclick="App.showPolicyProjectPicker()" style="margin-top:6px">选择项目</button>
        </div>
      `;
    }
    return `
      <div class="career-card" style="margin-top:10px;border-left:3px solid var(--ui-gold)">
        <div class="career-event"><p style="font-weight:700">📋 选择一项政策项目</p><p style="font-size:12px;color:var(--ink-light);margin-top:4px">项目占用本年主要职责；压力较高时可有限调整工期，延期不算交付。</p></div>
        ${projects.map(project => {
          const completed = !!(p.flags && p.flags[`policy_${project.id}_done`]);
          // v2.1.63 门槛：不满足承接条件 → 锁定并列出缺项
          const gate = (typeof engine.getPolicyProjectGate === 'function') ? engine.getPolicyProjectGate(project.id) : { ok: true, missing: [] };
          const locked = !gate.ok;
          const reasonHtml = locked
            ? `<small class="policy-gate">尚未满足承接条件：${gate.missing.map(App.escapeHtml).join('；')}</small>`
            : `<small>${App.escapeHtml(project.desc)}</small>`;
          const optionAttrs = completed || locked
            ? 'aria-disabled="true"'
            : `role="button" tabindex="0" aria-disabled="false" aria-label="承接政策项目：${App.escapeHtml(project.name)}" onclick="App.beginPolicyProject('${project.id}')"`;
          return `<div class="option${completed || locked ? ' disabled' : ''}" ${optionAttrs} data-policy-project="${App.escapeHtml(project.id)}" style="margin-top:8px">
            <span class="option-label">${project.icon || '📋'}</span>
            <span class="option-text"><b>${App.escapeHtml(project.name)}</b>${completed ? ' · 已完成' : (locked ? ' · 条件未达' : '')}<br>${reasonHtml}</span>
          </div>`;
        }).join('')}
        <button class="btn btn-secondary" onclick="App.showPolicyProjectPicker()" style="margin-top:8px">先不承接</button>
      </div>
    `;
  },

  showPolicyProjectPicker() {
    this._policyProjectPickerOpen = !this._policyProjectPickerOpen;
    this.renderContent(this.renderCareer());
  },

  beginPolicyProject(id) {
    this.safeProcess(() => {
      if (!engine.startPolicyProject(id)) {
        this.showToast('当前无法承接该项目，请先处理完手头事务', 'warning');
        return;
      }
      this._policyProjectPickerOpen = false;
      const event = engine.getPolicyProjectDecisionEvent();
      // 先标记待决策再保存；saveState 会清除 currentEvent，但 pendingDecision 会让读档流程恢复它。
      if (typeof this.saveCheckpoint === 'function') this.saveCheckpoint('project-start'); else engine.saveState();
      if (event) {
        engine.getState().currentEvent = event;
        engine.setPhase('event');
        this.renderContent(this.renderEvent());
      } else {
        this.renderContent(this.renderCareer());
      }
      this.updateStatus();
    });
  },

  abandonPolicyProject() {
    if (!window.confirm('终止后本项目不能再次承接，已投入的工作不会退回。确定终止吗？')) return;
    this.safeProcess(() => {
      if (!engine.abandonPolicyProject()) {
        this.showToast('当前无法终止，请先完成手头决策', 'warning');
        return;
      }
      if (typeof this.saveCheckpoint === 'function') this.saveCheckpoint('project-abandon'); else engine.saveState();
      this.showToast('项目已终止，本局不能再次承接', 'info');
      this.renderContent(this.renderCareer());
      this.updateStatus();
    });
  }
});
