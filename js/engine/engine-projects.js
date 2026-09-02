// ==================== 政策项目制与舆情危机 ====================
// 项目状态只保存轻量引用，具体文案和效果来自 GameData，兼容旧存档并避免重复存储数据。
(function() {
  function activeProject(engine) {
    const st = engine.state.policyProject;
    if (!st || typeof st !== 'object' || !st.id) return null;
    const def = engine.getPolicyProjectDefinition(st.id);
    return def ? { state: st, def: def } : null;
  }

  GameEngine.prototype.getPolicyProjectDefinitions = function() {
    return Array.isArray(GameData.policyProjects) ? GameData.policyProjects : [];
  };

  GameEngine.prototype.getPolicyProjectDefinition = function(id) {
    return this.getPolicyProjectDefinitions().find(project => project && project.id === id) || null;
  };

  GameEngine.prototype.getPolicyProjectGate = function(id) {
    // v2.1.63 承接门槛明细：面板据此显示锁定态与缺项（返回 { ok, missing[] }）
    const def = this.getPolicyProjectDefinition(id);
    if (!def) return { ok: false, missing: ['项目不存在'] };
    const p = this.state.player;
    if (!p || !p.isEmployed) return { ok: false, missing: ['需要先上岸入职'] };
    const missing = [];
    const rankOk = !def.requireRankMin || (p.leadershipRank || 0) >= def.requireRankMin;
    if (!rankOk) missing.push('职级 ≥ ' + def.requireRankMin + ' 级（当前 ' + (p.leadershipRank || 0) + ' 级）');
    const levelOk = !def.requireUnitLevelMin || (p.unitLevel || 0) >= def.requireUnitLevelMin;
    if (!levelOk) missing.push('单位层级 ≥ ' + ({ 0: '乡镇', 1: '县级', 2: '市级', 3: '省级', 4: '中央' }[def.requireUnitLevelMin] || def.requireUnitLevelMin));
    const yearsOk = !def.requireYearsWorked || (p.yearsWorked || 0) >= def.requireYearsWorked;
    if (!yearsOk) missing.push('工作年限 ≥ ' + def.requireYearsWorked + ' 年（当前 ' + (p.yearsWorked || 0) + ' 年）');
    if (this.state.policyProject) missing.push('已有进行中的项目');
    if (p.flags && p.flags[`policy_${def.id}_done`]) missing.push('本项目已完成');
    return { ok: missing.length === 0, missing: missing };
  };

  GameEngine.prototype.startPolicyProject = function(id) {
    const p = this.state.player;
    if (!p || !p.isEmployed || this.state.policyProject || this.state.currentEvent || this.state.pendingPromotion || this.state.pendingTransfer) return false;
    const def = this.getPolicyProjectDefinition(id);
    if (!def || !Array.isArray(def.stages) || def.stages.length !== def.duration || (p.flags && p.flags[`policy_${def.id}_done`])) return false;
    // v2.1.63 承接门槛：职级/单位层级/工作年限不满足则拒绝（不随意触发）
    if (!this.getPolicyProjectGate(id).ok) return false;
    p.flags = p.flags || {};
    this.state.policyProject = {
      id: def.id,
      stage: 0,
      startedYear: p.yearsWorked || 0,
      progress: 0,
      opinionCrises: 0,
      pendingDecision: null // { type: 'stage'|'opinion', stage }
    };
    p.flags.policyProjectActive = true;
    p.careerLog = p.careerLog || [];
    p.careerLog.push({ year: p.age, event: `${def.icon || '📋'} 承接政策项目「${def.name}」` });
    return true;
  };

  GameEngine.prototype.getPolicyProjectDecisionEvent = function() {
    const current = activeProject(this);
    if (!current || this.state.currentEvent || this.state.pendingPromotion || this.state.pendingTransfer) return null;
    const pending = current.state.pendingDecision;
    if (pending && pending.type && pending.type !== 'stage') return null;
    const requestedStage = pending && pending.type === 'stage' && Number.isInteger(pending.stage) ? pending.stage : current.state.stage;
    const stageIndex = Math.max(0, Math.min(Number.isInteger(requestedStage) ? requestedStage : 0, current.def.stages.length - 1));
    const stage = current.def.stages[stageIndex];
    if (!stage || !Array.isArray(stage.choices) || stage.choices.length === 0) return null;
    if (!pending) current.state.pendingDecision = { type: 'stage', stage: stageIndex };
    // v2.1.63 子案标注：决策点归属的子案名进标题（无子案引用时退回第 N 步）
    const subCase = stage.subCase && Array.isArray(current.def.subCases)
      ? current.def.subCases.find(sc => sc && sc.id === stage.subCase) : null;
    const stageLabel = subCase ? subCase.name : `第${stageIndex + 1}步`;
    return {
      title: `${current.def.icon || '📋'} ${current.def.name} · ${stageLabel}：${stage.title || ''}`,
      stage: 'work',
      eventType: 'choice',
      projectEvent: true,
      text: stage.text,
      choices: stage.choices
    };
  };

  GameEngine.prototype.resolvePolicyProjectChoice = function(index) {
    const current = activeProject(this);
    const event = this.state.currentEvent;
    if (!current || (event && !event.projectEvent)) return false;
    const stageIndex = current.state.stage || 0;
    const stage = current.def.stages[stageIndex];
    const choice = stage && stage.choices ? stage.choices[index] : null;
    if (!choice || (typeof this.isChoiceEnabled === 'function' && !this.isChoiceEnabled(choice))) return false;

    this.applyEffects(choice.effects || {});
    this.clampAttrs();
    current.state.progress = (current.state.progress || 0) + (choice.progress || 1);
    current.state.stage = stageIndex + 1;
    current.state.pendingDecision = null;
    const p = this.state.player;
    p.careerLog = p.careerLog || [];
    p.careerLog.push({ year: p.age, event: `${current.def.icon || '📋'} ${current.def.name}：${choice.result || choice.text}` });

    if (current.state.stage >= current.def.duration) {
      this.applyEffects(current.def.completionEffects || {});
      p.flags = p.flags || {};
      p.flags.policyProjectCount = (p.flags.policyProjectCount || 0) + 1;
      p.flags[`policy_${current.def.id}_done`] = true;
      p.flags.lastPolicyProject = current.def.id;
      delete p.flags.policyProjectActive;
      p.careerLog.push({ year: p.age, event: `${current.def.icon || '📋'} 政策项目「${current.def.name}」完成，成果通过验收` });
      this.state.policyProject = null;
    }
    this.state.currentEvent = null;
    this.checkEndings();
    return true;
  };

  GameEngine.prototype.abandonPolicyProject = function() {
    const current = activeProject(this);
    if (!current) return false;
    const p = this.state.player;
    p.flags = p.flags || {};
    delete p.flags.policyProjectActive;
    p.flags.policyProjectAbandoned = (p.flags.policyProjectAbandoned || 0) + 1;
    p.careerLog = p.careerLog || [];
    p.careerLog.push({ year: p.age, event: `📋 政策项目「${current.def.name}」中途搁置` });
    this.state.policyProject = null;
    this.state.currentEvent = null;
    return true;
  };

  GameEngine.prototype.preparePolicyOpinionCrisisEvent = function() {
    const current = activeProject(this);
    const p = this.state.player;
    if (!current || this.state.currentEvent || !p || (current.state.opinionCrises || 0) >= 1) return null;
    const pending = current.state.pendingDecision;
    if (pending && pending.type === 'stage') return null;
    // 已经写入存档的危机必须可恢复，不再依赖当前热度阈值（热度可能被迁移/修复逻辑调整）。
    if ((!pending || pending.type !== 'opinion') && (p.heat || 0) < 40) return null;
    if (pending && pending.type !== 'opinion') current.state.pendingDecision = null;
    if (!current.state.pendingDecision) current.state.pendingDecision = { type: 'opinion', stage: current.state.stage };
    return {
      title: `🔥 ${current.def.name} · 舆情危机`,
      stage: 'work',
      eventType: 'choice',
      opinionCrisis: true,
      text: `项目热度已经超过安全线，网上开始出现对「${current.def.name}」的质疑。你准备如何回应？`,
      choices: [
        { text: '公开回应：说明问题、公布进度和整改时间', effects: { heat: -18, peopleReputation: 4, reputation: 1, workAbility: 1 } },
        { text: '稳妥处置：先核查口径，再逐步释放信息', effects: { heat: -6, peopleReputation: 1, mentalPressure: 2 } },
        { text: '压制扩散：删帖控评，先确保项目验收', effects: { heat: 8, peopleReputation: -6, reputation: -2, risk: 4, integrity: -1, flag: 'policyOpinionSuppressed' } }
      ]
    };
  };

  GameEngine.prototype.resolvePolicyOpinionChoice = function(index) {
    const current = activeProject(this);
    const event = this.state.currentEvent;
    if (!current || (event && !event.opinionCrisis)) return false;
    if ((current.state.opinionCrises || 0) >= 1) return false;
    const crisis = (event && event.opinionCrisis) ? event : this.preparePolicyOpinionCrisisEvent();
    const choice = crisis && crisis.choices[index];
    if (!choice || (typeof this.isChoiceEnabled === 'function' && !this.isChoiceEnabled(choice))) return false;
    this.applyEffects(choice.effects || {});
    this.clampAttrs();
    current.state.opinionCrises = (current.state.opinionCrises || 0) + 1;
    current.state.pendingDecision = null;
    const p = this.state.player;
    p.careerLog = p.careerLog || [];
    p.careerLog.push({ year: p.age, event: `🔥 舆情危机处置：${choice.text}` });
    this.state.currentEvent = null;
    this.checkEndings();
    return true;
  };

  // 读档后恢复 saveState 主动清除的 currentEvent；只恢复本模块已明确标记的待决策。
  GameEngine.prototype.getPolicyProjectPendingEvent = function() {
    const current = activeProject(this);
    if (!current || this.state.currentEvent) return null;
    const pending = current.state.pendingDecision;
    if (!pending || !pending.type) return null;
    if (pending.type === 'stage') return this.getPolicyProjectDecisionEvent();
    if (pending.type === 'opinion') return this.preparePolicyOpinionCrisisEvent();
    return null;
  };
})();
