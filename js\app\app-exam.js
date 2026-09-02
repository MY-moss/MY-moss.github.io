function examEscape(value) {
  if (typeof App !== 'undefined' && typeof App.escapeHtml === 'function') return App.escapeHtml(value);
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatExamScore(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return '—';
  return String(Number(number.toFixed(1)));
}

Object.assign(App, {
  getWrittenQuestionLimit() {
    const diff = engine.getState().difficulty;
    return diff === 'easy' ? 1 : (diff === 'hardcore' ? 4 : 3);
  },
  isWrittenQuestion(question) {
    return !!(question
      && typeof question.question === 'string'
      && question.question.trim()
      && question.options
      && typeof question.options === 'object'
      && !Array.isArray(question.options)
      && Object.keys(question.options).length >= 2);
  },
  enterInterviewFromWritten(reason, options) {
    engine.generateInterview();
    engine.setPhase('interview');
    if (typeof this.saveCheckpoint === 'function') {
      this.saveCheckpoint(reason || 'written-complete', { silent: !!(options && options.silent) });
    } else if (typeof engine.saveState === 'function') {
      engine.saveState();
    }
  },
  renderUnits() {
    const savedUnits = engine.getState().randomUnits;
    const hasSavedUnits = savedUnits && ['easy', 'medium', 'hard'].some(key => Array.isArray(savedUnits[key]) && savedUnits[key].length > 0);
    const units = hasSavedUnits ? savedUnits : engine.rollUnits();
    // v2.1.6 修复：hardcore 分组原空列表（rollUnits 只产 easy/medium/hard）——hardcore 难度提升在引擎侧
    //（笔试题 4 道+难度+10、无重考、无平静年、晋升×0.85），单位选择仍用普通三档
    const tiers = [
      { key: 'easy', label: '🌟 简单（难度<65）', color: 'var(--ui-green)' },
      { key: 'medium', label: '⚡ 中等（难度65-79）', color: 'var(--ui-amber)' },
      { key: 'hard', label: '🔥 困难（难度≥80）', color: 'var(--ui-danger)' }
    ];
    const levelStyles = { '省级': 'level-province', '市级': 'level-city', '县级': 'level-county', '乡镇': 'level-township', '街道': 'level-street' };
    // v2.1.6 修复：原 hardcore 分组空列表（rollUnits 只产 easy/medium/hard）误导玩家——
    // hardcore 难度提升在引擎侧（笔试题 4 道+难度+10、无重考、无平静年、晋升×0.85），单位选择沿用普通三档，分组上方标注硬核说明
    if (engine.getState().difficulty === 'hardcore') {
      return `
      <div class="stage fade-in">
        <div class="lead"><span>🏢</span><p>☠️ 硬核模式：笔试 4 道、一次机会、无平静年、晋升更难——从以下报考单位中选择。</p></div>
        <div class="unit-list">
          ${tiers.map(tier => `
            <div class="unit-group">
              <h3 class="level-tag" style="background:color-mix(in srgb, ${tier.color} 10%, transparent);color:${tier.color}">${tier.label}</h3>
              <div class="unit-cards" role="radiogroup" aria-label="${tier.label}报考单位">
                ${(units[tier.key] || []).map(u => `
                  <div class="unit-card${engine.getPlayer().unit && engine.getPlayer().unit.id === u.id ? ' selected' : ''}" onclick="App.selectUnit('${u.id}')" data-id="${u.id}" role="radio" tabindex="0" aria-checked="${engine.getPlayer().unit && engine.getPlayer().unit.id === u.id ? 'true' : 'false'}" aria-label="${examEscape(u.name)}，${examEscape(u.level)}，${examEscape(u.system)}">
                    <div class="unit-name">${examEscape(u.name)}${engine.getMajorFit(u).matchCount > 0 ? ' <span class="tag fit-tag">🎯 专业对口</span>' : ''}</div>
                    <div class="unit-meta">
                      <span>难度: ${u.difficulty}</span>
                      <span>压力: ${u.stress}</span>
                      <span>晋升: ${u.promotionSpace}</span>
                    </div>
                    <div class="unit-tags">
                      <span class="tag ${levelStyles[u.level] || ''}">${examEscape(u.level)}</span>
                      <span class="tag">${examEscape(u.system)}</span>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>
        <div class="sticky-action">
          <button class="btn btn-primary" onclick="App.confirmUnit()" type="button">确认报考</button>
        </div>
      </div>
    `;
    }
    return `
      <div class="stage fade-in">
        <div class="lead"><span>🏢</span><p>从以下报考单位中选择一个。难度越高分数线越高，但晋升空间也更大。</p></div>
        <div class="unit-list">
          ${tiers.map(tier => `
            <div class="unit-group">
              <h3 class="level-tag" style="background:color-mix(in srgb, ${tier.color} 10%, transparent);color:${tier.color}">${tier.label}</h3>
              <div class="unit-cards" role="radiogroup" aria-label="${tier.label}报考单位">
                ${(units[tier.key] || []).map(u => `
                  <div class="unit-card${engine.getPlayer().unit && engine.getPlayer().unit.id === u.id ? ' selected' : ''}" onclick="App.selectUnit('${u.id}')" data-id="${u.id}" role="radio" tabindex="0" aria-checked="${engine.getPlayer().unit && engine.getPlayer().unit.id === u.id ? 'true' : 'false'}" aria-label="${examEscape(u.name)}，${examEscape(u.level)}，${examEscape(u.system)}">
                    <div class="unit-name">${examEscape(u.name)}${engine.getMajorFit(u).matchCount > 0 ? ' <span class="tag fit-tag">🎯 专业对口</span>' : ''}</div>
                    <div class="unit-meta">
                      <span>难度: ${u.difficulty}</span>
                      <span>压力: ${u.stress}</span>
                      <span>晋升: ${u.promotionSpace}</span>
                    </div>
                    <div class="unit-tags">
                      <span class="tag ${levelStyles[u.level] || ''}">${examEscape(u.level)}</span>
                      <span class="tag">${examEscape(u.system)}</span>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>
        <div class="sticky-action">
          <button class="btn btn-primary" onclick="App.confirmUnit()" type="button">确认报考</button>
        </div>
      </div>
    `;
  },
  selectUnit(id) {
    engine.setUnit(id);
    document.querySelectorAll('.unit-card').forEach(c => {
      const selected = c.dataset.id === String(id);
      c.classList.toggle('selected', selected);
      c.setAttribute('aria-checked', selected ? 'true' : 'false');
    });
  },
  confirmUnit() {
    if (!engine.getPlayer().unit) { this.showToast('请选择一个报考单位', 'warning'); return; }
    // v2.1.63 经历里程碑：档案阶段完成 → 报考留痕（category 供展示层分类）
    const p0 = engine.getPlayer();
    const u0 = p0.unit;
    p0.careerLog = p0.careerLog || [];
    p0.careerLog.push({ year: p0.age, event: '报考' + (u0 && u0.name ? u0.name : '报考单位') + '，开启备考', category: 'exam', special: 'signup' });
    engine.generateWrittenExam();
    const diff = engine.getState().difficulty;
    const saveExamCheckpoint = () => {
      if (typeof this.saveCheckpoint === 'function') this.saveCheckpoint('unit-confirmed');
      else engine.saveState();
    };
    if (diff === 'speedrun') {
      // 速通模式：跳过笔试和面试，直接出结果
      engine.state.player.interviewScore = 40 + engine.rand(0, 20);
      engine.calculateResult();
      engine.setPhase('result');
      saveExamCheckpoint();
      this.renderContent(this.renderResult());
      this.updateStatus();
    } else if (diff === 'easy') {
      // 简单模式：1道笔试
      engine.setPhase('written');
      saveExamCheckpoint();
      this.renderContent(this.renderWritten());
      this.updateStatus();
    } else {
      engine.setPhase('written');
      saveExamCheckpoint();
      this.renderContent(this.renderWritten());
      this.updateStatus();
    }
  },
  renderWritten() {
    const state = engine.getState();
    let questions = Array.isArray(state.examQuestions) ? state.examQuestions : [];
    const currentQuestion = Number.isInteger(state.currentQuestion) ? state.currentQuestion : 0;
    state.currentQuestion = currentQuestion;
    let q = questions[currentQuestion];
    // Bug-17 fix: guard against missing unit
    if (!engine.getPlayer().unit) {
      engine.setPhase('units');
      return this.renderUnits();
    }

    const limit = this.getWrittenQuestionLimit();
    const cachedQuestions = Array.isArray(state.writtenQuestionsCache) ? state.writtenQuestionsCache : [];
    if (!this.isWrittenQuestion(q) && this.isWrittenQuestion(cachedQuestions[currentQuestion])) {
      state.examQuestions = cachedQuestions;
      questions = cachedQuestions;
      q = questions[currentQuestion];
    }
    // 旧存档可能在最后一道题回答后、切换面试前被中断。
    // 只有明确完成了全部笔试题，才允许恢复到面试；不能把空题/错题状态当成笔试完成。
    if (currentQuestion >= limit && questions.length >= limit && questions.slice(0, limit).every(item => this.isWrittenQuestion(item))) {
      this.enterInterviewFromWritten('written-recovered', { silent: true });
      return this.renderInterview();
    }

    // 坏档、旧版本存档或题目被面试题覆盖时，重新生成笔试题并留在笔试阶段。
    if (!this.isWrittenQuestion(q)) {
      engine.generateWrittenExam();
      state.currentQuestion = 0;
      q = Array.isArray(state.examQuestions) ? state.examQuestions[0] : null;
      if (this.isWrittenQuestion(q)) {
        if (typeof this.saveCheckpoint === 'function') this.saveCheckpoint('written-recovered', { silent: true });
        else if (typeof engine.saveState === 'function') engine.saveState();
      }
    }
    if (!this.isWrittenQuestion(q)) {
      return '<div class="stage fade-in"><div class="lead"><span>📝</span><p>笔试题暂时没有加载成功，请重试。</p></div><div class="event-card"><p class="event-text">题库仍然可用，但当前考试状态不完整。点击重试会重新生成本次笔试题，不会重置你的档案。</p></div><div class="sticky-action"><button class="btn btn-primary" type="button" onclick="App.retryWrittenExam()">重新加载笔试题</button></div></div>';
    }
    return `
      <div class="stage fade-in">
        <div class="lead"><span>📝</span><p>笔试第 ${engine.getState().currentQuestion + 1} 题（共${engine.getState().examQuestions.length}题）</p></div>
        <div class="question-card">
          <div class="q-type">${this.escapeHtml(q.type)} · 难度${q.difficulty}</div>
          <div class="q-text">${this.escapeHtml(q.question)}</div>
          <div class="q-options">
            ${Object.entries(q.options).map(([k, v]) => `
              <button type="button" class="option" data-written-answer="${this.escapeHtml(k)}" aria-label="选择 ${this.escapeHtml(k)}：${this.escapeHtml(v)}">
                <span class="option-label">${this.escapeHtml(k)}</span>
                <span class="option-text">${this.escapeHtml(v)}</span>
              </button>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  },
  answerWritten(answer) {
    engine.answerWrittenQuestion(answer);
    const limit = this.getWrittenQuestionLimit();
    if (engine.getState().currentQuestion >= limit) {
      // 先切换阶段，再保存最终状态，避免刷新恢复到“笔试题号已越界”的中间快照。
      this.enterInterviewFromWritten('written-complete');
      this.renderContent(this.renderInterview());
      this.updateStatus();
    } else {
      this.saveCheckpoint('written-answer');
      this.renderContent(this.renderWritten());
    }
  },
  retryWrittenExam() {
    const state = engine.getState();
    if (!engine.getPlayer().unit) {
      engine.setPhase('units');
      this.renderContent(this.renderUnits());
      this.updateStatus();
      return;
    }
    engine.generateWrittenExam();
    engine.setPhase('written');
    if (typeof this.saveCheckpoint === 'function') this.saveCheckpoint('written-retry');
    this.renderContent(this.renderWritten());
    this.updateStatus();
  },
  renderInterview() {
    const questions = engine.getState().examQuestions;
    const q = questions[engine.getState().currentQuestion];
    if (!q || !Array.isArray(q.choices)) {
      const passed = engine.calculateResult();
      engine.setPhase('result');
      return this.renderResult();
    }
    return `
      <div class="stage fade-in">
        <div class="lead"><span>🎤</span><p>面试第 ${engine.getState().currentQuestion + 1} 题（共${engine.getState().examQuestions.length}题）</p></div>
        <div class="question-card">
          <div class="q-type">${this.escapeHtml(GameData.interviewPoolNames[q.pool] || '综合能力')} · ${this.escapeHtml(q.scenario)} · 难度${q.difficulty}</div>
          <div class="q-text">${this.escapeHtml(q.question)}</div>
          <div class="q-options">
            ${q.choices.map((c, i) => `
              <button type="button" class="option" data-interview-answer="${i}" aria-label="选择 ${this.escapeHtml(c.label)}：${this.escapeHtml(c.text)}">
                <span class="option-label">${this.escapeHtml(c.label)}</span>
                <span class="option-text">${this.escapeHtml(c.text)}</span>
              </button>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  },
  answerInterview(idx) {
    engine.answerInterviewQuestion(idx);
    const diff = engine.getState().difficulty;
    const limit = diff === 'easy' ? 1 : 3;
    if (engine.getState().currentQuestion >= limit) {
      const passed = engine.calculateResult();
      engine.setPhase('result');
      this.saveCheckpoint('exam-result');
      this.renderContent(this.renderResult());
      this.updateStatus();
    } else {
      this.saveCheckpoint('interview-answer');
      this.renderContent(this.renderInterview());
    }
  },
  renderResult() {
    const p = engine.getPlayer();
    const unit = p.unit || {};
    const totalScore = formatExamScore(p.totalScore);
    const writtenScore = formatExamScore(p.writtenScore);
    const interviewScore = formatExamScore(p.interviewScore);
    const passingLine = p.passingLine !== undefined && p.passingLine !== null ? formatExamScore(p.passingLine) : '';
    // 统计统一由结局结算(saveRecord)记录，这里不再重复计数，避免一局算两局

    if (p.passed) {
      const excellent = p.excellentPass;
      const iqMax = (engine.getState().difficulty === 'easy' ? 1 : 3) * 5;
      // v2.58 文案修复：补充属性加成说明（每题另有至多 +7 属性加成，实际单题上限 12）
      return `
        <div class="stage fade-in result-pass">
          <div class="result-icon">${excellent ? '🏆' : '🎉'}</div>
          <h2>${excellent ? '笔试全对 · 实力超群！' : '恭喜上岸！'}</h2>
          <div class="result-details">
            <p>📌 单位: ${this.escapeHtml(unit.name || '未知')}</p>
            ${excellent ? '<p style="color:var(--vermilion);font-weight:700">⭐ 笔试全对：获得大幅加分与分数线优惠，含金量十足！</p>' : ''}
            <p>📊 总分: ${totalScore}${passingLine ? ' / 线 ' + passingLine : ''}</p>
            <p>👥 报考人数: ${p.signupCount}人</p>
            <p>📈 笔试: ${writtenScore}分</p>
            <p>🎤 面试: ${interviewScore}分（基础满分${iqMax}，另有属性加成）</p>
            <p>🎂 上岸年龄: ${p.ageOnshore}岁</p>
          </div>
          <div class="sticky-action">
            <button class="btn btn-primary" onclick="App.startCareer()">开始职业生涯</button>
            <button class="btn btn-secondary" onclick="App.playAgain()" style="margin-top:8px">再来一局</button>
          </div>
        </div>
      `;
    }
    const diff = Number(p.passingLine) - Number(p.totalScore);
    const displayDiff = formatExamScore(diff);
    return `
      <div class="stage fade-in result-fail">
        <div class="result-icon">😔</div>
        <h2>本次未上岸</h2>
        <div class="result-details">
          <p>📌 单位: ${this.escapeHtml(unit.name || '未知')}</p>
          <p>📊 总分: ${totalScore}${passingLine ? ' / 线 ' + passingLine : ''}</p>
          ${diff > 0 ? `<p style="color:var(--ui-danger)">📉 距分数线还差 ${displayDiff} 分</p>` : ''}
          <p>👥 报考人数: ${p.signupCount}人</p>
          <p>📈 排名: 第${p.writtenRank}名</p>
          <p>📅 第${p.examAttempts || 1}次考试</p>
          ${p.age >= p.maxExamAge ? '<p style="color:var(--ui-danger);font-weight:600">⚠️ 已达到报考年龄上限，无法再考</p>' : ''}
          ${diff > 0 ? '<p style="font-size:11px;color:var(--ink-lighter)">💡 提升智商/运气属性、选对口的专业与单位，都有助于提高总分</p>' : ''}
        </div>
        <div class="sticky-action">
          ${p.age < p.maxExamAge ? '<button class="btn btn-primary" onclick="App.retryExam()">📚 明年再战（当前' + (p.age + 1) + '岁）</button>' : ''}
          <button class="btn btn-secondary" onclick="App.playAgain()" style="margin-top:8px">放弃考试</button>
        </div>
      </div>
    `;
  },
  startCareer() {
    engine.setPhase('career');
    engine.runCareerYear();
    if (typeof this.saveCheckpoint === 'function') this.saveCheckpoint('career-start'); else engine.saveState();
    this.afterCareerStep();
  },
  retryExam() {
    engine.retryExam();
    if (engine.getState().difficulty === 'speedrun') {
      // v2.58 修复：速通二战直接出结果（原实现进入 written 阶段后因题空被拽入完整面试流程）
      engine.state.player.interviewScore = 40 + engine.rand(0, 20);
      engine.calculateResult();
      engine.setPhase('result');
      this.renderContent(this.renderResult());
      this.updateStatus();
      return;
    }
    engine.setPhase('written');
    if (typeof this.saveCheckpoint === 'function') this.saveCheckpoint('exam-retry'); else engine.saveState();
    this.renderContent(this.renderWritten());
    this.updateStatus();
  },
});
