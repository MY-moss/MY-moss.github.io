Object.assign(App, {
  renderIntro() {
    const p = engine.getPlayer();
    const scenarios = (typeof GameData !== 'undefined' && GameData.scenarios) ? Object.values(GameData.scenarios) : [];
    const scenarioId = engine.getState().scenarioId || 'classic';
    const ageNote = p.minExamAge !== 22 ? `（当前年龄: ${p.age}岁，受天赋影响）` : '';
    const pity = (() => { try { return parseInt(localStorage.getItem('shangan_bg_pity') || '0', 10) || 0; } catch(e) { return 0; } })();
    const pityNote = pity >= 15
      ? '<p style="font-size:11px;color:var(--vermilion);font-weight:600;margin-top:6px">🎲 保底已就绪：下一局必为富裕家庭或权贵之家出身！</p>'
      : pity > 0
        ? `<p style="font-size:11px;color:var(--ui-text-muted);margin-top:6px">🎲 稀有出身保底进度：${pity}/15 局（连续未抽到富裕/权贵）</p>`
        : '';
    const saveSlots = [0, 1, 2].map(slot => {
      const info = engine.getSaveInfo(slot);
      if (!info) return `<div class="save-slot empty" role="group" aria-label="第${slot + 1}个空存档位"><button type="button" class="save-load" onclick="App.useSlot(${slot})" aria-label="使用第${slot + 1}个空存档位"><span style="font-size:22px">＋</span><span style="font-size:11px;color:var(--ink-lighter)">空存档位</span></button></div>`;
      const timeStr = info.time ? new Date(info.time).toLocaleString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '';
      const phaseNames = { intro: '开局', background: '出身', era: '时代', major: '专业', talents: '天赋', personality: '性格', attrs: '属性', units: '报考', written: '笔试', interview: '面试', result: '结果', career: '生涯', event: '事件' };
      return `<div class="save-slot" role="group" aria-label="第${slot + 1}个存档位">
        <button type="button" class="save-load" onclick="App.loadGame(${slot})" aria-label="读取第${slot + 1}个存档：${App.escapeHtml(info.name || '未命名')}">
          <span style="font-weight:700;color:var(--ui-green)">${App.escapeHtml(info.name)}</span>
          <span style="font-size:11px;color:var(--ink-light)">${info.age}岁 · ${App.escapeHtml(phaseNames[info.phase] || info.phase || '未知阶段')}${info.rank && info.rank > 0 ? ' · ' + info.rank + '级' : ''}${info.unit ? ' · ' + App.escapeHtml(info.unit) : ''}</span>
          <span style="font-size:10px;color:var(--ink-lighter)">${timeStr}</span>
        </button>
        <button type="button" class="save-delete" onclick="App.confirmDeleteSave(${slot})" title="删除存档" aria-label="删除第${slot + 1}个存档位">✕</button>
      </div>`;
    }).join('');
    return `
      <div class="stage fade-in intro-stage">
        <div class="intro-brand" style="text-align:center;margin-bottom:20px">
          <div class="intro-seal" style="display:inline-block;width:74px;height:74px;border-radius:8px;background:linear-gradient(145deg,#B02A2A,#7A1515);display:flex;align-items:center;justify-content:center;box-shadow:0 8px 24px rgba(139,29,29,0.4),inset 0 0 0 2px rgba(232,212,139,0.4),inset 0 0 12px rgba(0,0,0,0.2);transform:rotate(-3deg);animation:sealStamp 1.2s cubic-bezier(0.2,1.4,0.4,1)">
            <span style="font-family:'STKaiti','KaiTi','Kaiti SC',cursive;font-size:44px;color:#F5E9C8;text-shadow:0 2px 4px rgba(0,0,0,0.4)">岸</span>
          </div>
          <p style="font-family:'STKaiti','KaiTi','Kaiti SC',cursive;font-size:26px;color:var(--vermilion);margin-top:12px;letter-spacing:8px">上岸模拟器</p>
          <p style="font-size:11px;color:var(--ui-text-muted);letter-spacing:3px;margin-top:2px">『 仕途浮沉 · 一朝登岸 』</p>
        </div>
        <div class="lead">
          <span>📋</span>
          <p>先填档案袋封面。名字和性别不会决定命运，但会决定别人怎么催你。${ageNote}</p>
        </div>
        ${pityNote}
        <div class="field intro-saves" style="margin-bottom:12px">
          <span style="display:block;font-size:13px;font-weight:600;margin-bottom:6px;color:var(--ink-light)">💾 存档位（点击继续）</span>
          <div style="display:flex;gap:8px;flex-wrap:wrap">${saveSlots}          </div>
          <div class="intro-backup-actions" style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap">
            <button onclick="App.exportSave()" type="button" style="flex:1;min-width:88px;padding:8px 12px;background:var(--parchment-warm);border:1px solid var(--gold);border-radius:8px;font-size:11px;color:var(--vermilion);cursor:pointer">📤 导出存档（备份）</button>
            <button onclick="App.importSave()" type="button" style="flex:1;min-width:88px;padding:8px 12px;background:var(--parchment-warm);border:1px solid var(--gold);border-radius:8px;font-size:11px;color:var(--vermilion);cursor:pointer">📥 导入存档</button>
          </div>
        </div>
        <label class="field">
          <span>姓名</span>
          <div class="input-row">
            <input id="name-input" type="text" autocomplete="name" inputmode="text" aria-label="姓名" placeholder="输入姓名" maxlength="6" value="${App.escapeHtml(p.name || '')}">
            <button onclick="App.randomName()" type="button">随机</button>
          </div>
        </label>
        <div class="segmented">
          <button class="${p.gender === '男' ? 'active' : ''}" onclick="App.selectGender('男')" type="button">男</button>
          <button class="${p.gender === '女' ? 'active' : ''}" onclick="App.selectGender('女')" type="button">女</button>
        </div>
        <div class="field" style="background:var(--parchment-warm);padding:10px 14px;border-radius:10px;font-size:12px;color:var(--ink-light)">
          <span>💡 退休年龄按本局规则计算；选择天赋后会自动更新可报考年龄。</span>
        </div>
        <div class="field" style="margin-top:12px">
          <span style="display:block;font-size:13px;font-weight:600;margin-bottom:6px;color:var(--ink-light)">游戏模式</span>
          <div class="difficulty-selector" role="radiogroup" aria-label="游戏模式">
            <div class="diff-option" role="radio" aria-checked="${engine.getState().difficulty === 'speedrun' ? 'true' : 'false'}" onclick="App.selectDifficulty('speedrun')" data-diff="speedrun">
              <div class="diff-icon">🚀</div>
              <div class="diff-name">速通模式</div>
              <div class="diff-desc">跳过全部考试，直接分配单位开始职业生涯</div>
            </div>
            <div class="diff-option" role="radio" aria-checked="${engine.getState().difficulty === 'easy' ? 'true' : 'false'}" onclick="App.selectDifficulty('easy')" data-diff="easy">
              <div class="diff-icon">🌱</div>
              <div class="diff-name">简单模式</div>
              <div class="diff-desc">1道笔试+1道面试，题目简单，分数线低</div>
            </div>
            <div class="diff-option${engine.getState().difficulty === 'standard' ? ' selected' : ''}" role="radio" aria-checked="${engine.getState().difficulty === 'standard' ? 'true' : 'false'}" onclick="App.selectDifficulty('standard')" data-diff="standard">
              <div class="diff-icon">⚔️</div>
              <div class="diff-name">标准模式</div>
              <div class="diff-desc">3道笔试+3道面试，完整游戏体验</div>
            </div>
            <div class="diff-option" role="radio" aria-checked="${engine.getState().difficulty === 'hardcore' ? 'true' : 'false'}" onclick="App.selectDifficulty('hardcore')" data-diff="hardcore">
              <div class="diff-icon">☠️</div>
              <div class="diff-name">硬核模式</div>
              <div class="diff-desc">4道笔试+一次机会+无平静年+晋升更难</div>
            </div>
          </div>
        </div>
        <div class="field scenario-picker">
          <span style="display:block;font-size:13px;font-weight:600;margin-bottom:6px;color:var(--ink-light)">特殊剧本</span>
          <div class="scenario-grid" role="radiogroup" aria-label="特殊剧本">
            ${scenarios.map(s => `
              <div class="scenario-option ${s.id === scenarioId ? 'selected' : ''}" role="radio" aria-checked="${s.id === scenarioId ? 'true' : 'false'}" onclick="App.selectScenario('${s.id}')" data-scenario="${s.id}">
                <div class="scenario-title"><span>${s.icon || '📖'}</span><b>${App.escapeHtml(s.name)}</b></div>
                <div class="scenario-short">${App.escapeHtml(s.short || '')}</div>
                <div class="scenario-desc">${App.escapeHtml(s.desc || '')}</div>
                ${s.goal ? `<div class="scenario-goal"><span>🎯 ${App.escapeHtml(s.goal.title || '剧本目标')}</span><small>${App.escapeHtml(s.goal.desc || '')}</small></div>` : ''}
              </div>
            `).join('')}
          </div>
          <p class="scenario-note">剧本会改变起始状态与专属事件，经典模式保持原有平衡。</p>
        </div>
        <div class="sticky-action intro-actions">
          <button class="btn btn-primary" onclick="App.startGame()" type="button">开启上岸之旅</button>
          <button class="btn btn-secondary" onclick="App.quickStart()" type="button" style="margin-top:8px">⚡ 快速开始（一键随机档案）</button>
        </div>
      </div>
    `;
  },
  // ⚡ 快速开始：随机生成完整档案直接进入游戏
  quickStart() {
    try {
      const male = Math.random() < 0.5;
      const selectedScenario = engine.getState().scenarioId || 'classic';
      engine.reset();
      this._recordedRun = false;
    this._codexMerged = false;
      engine.setDifficulty('standard');
      engine.setScenario(selectedScenario);
      engine.setName(this.genRealName(male));
      engine.setGender(male ? '男' : '女');
      engine.rollBackground();
      engine.applyScenarioSetup();
      const p = engine.getPlayer();
      engine.rollMajors();
      const majors = engine.getState().randomMajors;
      if (majors && majors.length > 0) engine.setMajor(majors[Math.floor(Math.random() * majors.length)].id);
      // 图鉴完成度奖励：额外天赋点 + 属性点（v2.1.6 修复：原在 addTalent 之后发放，天赋点已被用光，talentPoints===4 恒 false 导致快速开始路径天赋奖励永久丢失）
      const reward = this.getCodexReward();
      if (reward.bonus > 0 && engine.getState().talentPoints === 4) {
        engine.getState().talentPoints += reward.bonus;
      }
      if (reward.attrBonus > 0 && engine.getState().attrPoints < 15) engine.getState().attrPoints = Math.min(15, engine.getState().attrPoints + reward.attrBonus); // v2.69 属性点奖励（v2.72 修复：原两行重复双倍发放；上限 15 防多周目膨胀）
      engine.rollTalents();
      const talents = engine.getState().randomTalents;
      if (talents) {
        // 随机抽4个不同天赋（addTalent 会处理 exclusive 冲突；奖励后的多余点数保留供后续分配）
        const shuffled = talents.slice();
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        for (let i = 0; i < Math.min(4, shuffled.length) && engine.getState().talentPoints > 0; i++) {
          engine.addTalent(shuffled[i].id);
        }
      }
      const attrKeys = Object.keys(engine.getAttrs());
      for (let i = 0; i < 10; i++) engine.addAttr(attrKeys[Math.floor(Math.random() * attrKeys.length)]);
      // 随机性格与志向
      const persos = ['stable', 'ambitious', 'smooth', 'straight'];
      const ambits = ['minister', 'central', 'retire', 'upright'];
      p.personality = persos[Math.floor(Math.random() * persos.length)];
      p.ambition = ambits[Math.floor(Math.random() * ambits.length)];
      engine.rollUnits();
      const units = engine.getState().randomUnits;
      const all = (units.easy || []).concat(units.medium || [], units.hard || []);
      if (all.length > 0) engine.setUnit(all[Math.floor(Math.random() * all.length)].id);
      // 直接进入笔试（跳过建档/选专业/天赋/单位等所有表单）
      engine.generateWrittenExam();
      engine.setPhase('written');
      if (typeof this.saveCheckpoint === 'function') this.saveCheckpoint('quick-start'); else engine.saveState();
      this.renderContent(this.renderWritten());
      this.updateStatus();
      this.showToast('⚡ 已生成随机档案，开始考试！', 'success');
    } catch(e) {
      this.showToast('快速开始出错: ' + e.message, 'error');
    }
  },
  renderPersonality() {
    const p = engine.getPlayer();
    const personalities = [
      { id: 'stable', icon: '🛡️', name: '稳健', desc: '性格沉稳、步步为营', effects: ['压力每年 -1', '晋升 +0.5%'] },
      { id: 'ambitious', icon: '🔥', name: '进取', desc: '锐意进取、不甘人后', effects: ['晋升 +3%', '压力每年 +1，欲望 +1'] },
      { id: 'smooth', icon: '🤝', name: '圆滑', desc: '八面玲珑、长袖善舞', effects: ['风险每年 -1', '晋升 +1.5%'] },
      { id: 'straight', icon: '⚖️', name: '耿直', desc: '刚正不阿、不徇私情', effects: ['廉洁每年 +1', '晋升 -1.5%'] }
    ];
    const ambitions = [
      { id: 'minister', icon: '🏛️', name: '当处长', desc: '职级达到正处级（6级）' },
      { id: 'central', icon: '🏯', name: '进中央', desc: '调入中央机关（副部级以上，单位中央级）' },
      { id: 'retire', icon: '🛡️', name: '安稳退休', desc: '安稳或平凡地走完一生' },
      { id: 'upright', icon: '🪷', name: '两袖清风', desc: '一生清廉，名垂青史' }
    ];
    const ppSel = p.personality;
    const amSel = p.ambition;
    return `
      <div class="stage fade-in">
        <div class="lead"><span>🧭</span><p>人各有志，也各有秉性。你的性格底色将伴随整个仕途，个人志向则是你为之奋斗的方向。</p></div>
        <div class="field">
          <span style="display:block;font-size:13px;font-weight:700;margin-bottom:8px;color:var(--vermilion)">一 · 性格底色（影响职业生涯走向）</span>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px" role="radiogroup" aria-label="性格底色">
            ${personalities.map(pp => `
              <div class="talent-card ${ppSel === pp.id ? 'selected' : ''}" role="radio" aria-checked="${ppSel === pp.id ? 'true' : 'false'}" onclick="App.selectPersonality('${pp.id}')" data-personality="${pp.id}" style="cursor:pointer">
                <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
                  <span style="font-size:20px">${pp.icon}</span>
                  <span style="font-weight:700;font-size:14px">${App.escapeHtml(pp.name)}</span>
                </div>
                <div style="font-size:11px;color:var(--ink-light);margin-bottom:6px">${App.escapeHtml(pp.desc)}</div>
                <div style="font-size:10px;color:var(--vermilion)">${App.escapeHtml((pp.effects || []).join(' · '))}</div>
              </div>`).join('')}
          </div>
        </div>
        <div class="field" style="margin-top:16px">
          <span style="display:block;font-size:13px;font-weight:700;margin-bottom:8px;color:var(--vermilion)">二 · 个人志向（结局时判定达成，+8分）</span>
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px" role="radiogroup" aria-label="个人志向">
            ${ambitions.map(am => `
              <div class="talent-card ${amSel === am.id ? 'selected' : ''}" role="radio" aria-checked="${amSel === am.id ? 'true' : 'false'}" onclick="App.selectAmbition('${am.id}')" data-ambition="${am.id}" style="cursor:pointer;text-align:center">
                <div style="font-size:20px;margin-bottom:4px">${am.icon}</div>
                <div style="font-weight:700;font-size:13px">${App.escapeHtml(am.name)}</div>
                <div style="font-size:10px;color:var(--ink-light);margin-top:4px">${App.escapeHtml(am.desc)}</div>
              </div>`).join('')}
          </div>
        </div>
        <div class="sticky-action">
          <button class="btn btn-primary" onclick="App.confirmPersonality()">确认性格与志向</button>
        </div>
      </div>
    `;
  },
  confirmPersonality() {
    const p = engine.getPlayer();
    if (!p.personality) { this.showToast('请先选择性格底色', 'warning'); return; }
    if (!p.ambition) { this.showToast('请先选择个人志向', 'warning'); return; }
    engine.setPhase('attrs');
    if (typeof this.saveCheckpoint === 'function') this.saveCheckpoint('personality'); else engine.saveState();
    this.renderContent(this.renderAttrs());
    this.updateStatus();
  },
  selectDifficulty(diff) {
    engine.setDifficulty(diff);
    document.querySelectorAll('.diff-option').forEach(d => {
      const selected = d.dataset.diff === String(diff);
      d.classList.toggle('selected', selected);
      d.setAttribute('aria-checked', selected ? 'true' : 'false');
    });
  },
  selectScenario(id) {
    if (!engine.setScenario(id)) { this.showToast('无效的剧本', 'warning'); return; }
    document.querySelectorAll('.scenario-option').forEach(el => {
      const selected = el.dataset.scenario === String(id);
      el.classList.toggle('selected', selected);
      el.setAttribute('aria-checked', selected ? 'true' : 'false');
    });
    // 退休返聘剧本使用速通进入职业后段；其余剧本沿用玩家当前难度。
    const difficulty = engine.getState().difficulty;
    document.querySelectorAll('.diff-option').forEach(el => {
      const selected = el.dataset.diff === difficulty;
      el.classList.toggle('selected', selected);
      el.setAttribute('aria-checked', selected ? 'true' : 'false');
    });
  },
  randomName() {
    const male = engine.getPlayer().gender === '男';
    const name = this.genRealName(male);
    document.getElementById('name-input').value = name;
    engine.setName(name);
  },
  // 生成真实感中文姓名（按性别区分）
  genRealName(male) {
    const maleSurnames = ['张','李','王','赵','陈','刘','周','吴','郑','孙','林','黄','何','马','高','梁','宋','唐','许','邓','冯','韩','曹','彭','苏','蒋','蔡','贾','丁','魏','薛','叶','余','潘','杜','戴','夏','钟','汪','田','任','姜','范','方','石','姚','谭','廖','邹','熊','金','陆','郝','孔','白','崔','康','毛','邱','秦','江','史','顾','侯','邵','孟','龙','万','段','雷','钱','汤','尹','黎','易','常','武','乔','贺','赖','龚','文'];
    const femaleSurnames = ['李','王','张','刘','陈','杨','赵','黄','周','吴','徐','孙','马','朱','胡','郭','何','高','林','罗','郑','梁','谢','宋','唐','许','韩','冯','邓','曹','彭','曾','肖','田','董','袁','潘','蒋','蔡','余','杜','叶','程','苏','魏','吕','丁','任','沈','姚','卢','姜','崔','钟','谭','陆','汪','范','金','石','廖','贾','夏','韦','傅','方','白','邹','孟','熊','秦','邱','江','尹','薛','闫','段','雷','侯','龙','史','陶','黎','贺','顾','毛','郝','龚','邵','万','钱','严','覃','武','戴','莫','孔','向','汤'];
    const maleNames = ['伟','强','磊','军','洋','勇','杰','涛','斌','鹏','飞','宇','轩','浩','然','博','文','昊','超','明','建国','志强','立','国','健','平','刚','鑫','波','辉','建华','国庆','德','凯','磊','宏','毅','俊','峰','东','成','辉','俊杰','志远','子墨','一鸣','启明','书豪','浩然','铭泽','承宇','睿','泽','宸','曜','烨','远航','立轩','景行','明轩','浩宇'];
    const femaleNames = ['芳','娜','敏','静','丽','艳','娟','萍','红','琳','霞','婷','燕','雪','晶','露','丹','洁','梅','慧','静怡','文静','诗涵','欣怡','雨桐','梦瑶','思颖','雅琪','若曦','语嫣','梓萱','芷若','婉清','梦洁','晓晓','静怡','雅静','惠敏','丽华','淑芬','桂英','玉兰','秀英','春梅','秋月','晓梅','紫涵','雨欣','子萱','萱萱','悦','诺','涵','菲','颖','茜','蕾','萌','媛','青','怡','璐','璇','芮','芷','芸','珊','姗'];
    const sur = (male ? maleSurnames : femaleSurnames)[this.rand(0, (male ? maleSurnames : femaleSurnames).length - 1)];
    const given = (male ? maleNames : femaleNames)[this.rand(0, (male ? maleNames : femaleNames).length - 1)];
    return sur + given;
  },
  rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; },
  selectGender(g) {
    engine.setGender(g);
    document.querySelectorAll('.segmented button').forEach(b => {
      b.className = b.textContent === g ? 'active' : '';
    });
  },
  selectPersonality(pp) {
    engine.setPersonality(pp);
    document.querySelectorAll('[data-personality]').forEach(el => {
      const selected = el.dataset.personality === String(pp);
      el.classList.toggle('selected', selected);
      el.setAttribute('aria-checked', selected ? 'true' : 'false');
    });
  },
  selectAmbition(am) {
    engine.setAmbition(am);
    document.querySelectorAll('[data-ambition]').forEach(el => {
      const selected = el.dataset.ambition === String(am);
      el.classList.toggle('selected', selected);
      el.setAttribute('aria-checked', selected ? 'true' : 'false');
    });
  },
    startGame() {
    const name = document.getElementById('name-input').value.trim();
    if (!name) { this.showToast('请输入姓名', 'warning'); return; }
    engine.setName(name);
    this._recordedRun = false;
    this._codexMerged = false;
    // 图鉴完成度奖励：额外天赋点 + 属性点
    const reward = this.getCodexReward();
    if (reward.bonus > 0 && engine.getState().talentPoints === 4) {
      engine.getState().talentPoints += reward.bonus;
    }
    if (reward.attrBonus > 0 && engine.getState().attrPoints < 15) { // v2.72 修复：手动建档漏发属性点（原仅快速开始路径发放）；上限 15 防多周目膨胀
      engine.getState().attrPoints = Math.min(15, engine.getState().attrPoints + reward.attrBonus);
    }
    const bg = engine.rollBackground();
    engine.applyScenarioSetup();
    engine.setPhase('background');
    if (typeof this.saveCheckpoint === 'function') this.saveCheckpoint('background'); else engine.saveState();
    this.renderContent(this.renderBackground(bg));
    this.updateStatus();
  },
  renderBackground(bg) {
    return `
      <div class="stage fade-in">
        <div class="lead"><span>🏠</span><p>命运决定了你的出身，你无法选择。</p></div>
        <div class="bg-card selected" style="cursor:default">
          <div class="bg-name">${App.escapeHtml(bg.name)}</div>
          <div class="bg-desc">${App.escapeHtml(bg.desc)}</div>
          <div class="bg-flavor">${App.escapeHtml(bg.flavor)}</div>
          <div class="bg-effects">
            ${Object.entries(bg.effects).filter(([,v]) => v !== 0).map(([k, v]) => {
              const labels = { background: '背景', desire: '欲望', workAbility: '工作能力', familyPressure: '家庭压力', integrity: '廉洁', risk: '风险', body: '体质', eq: '情商', positionWeight: '职务权重', mentalPressure: '心理压力', reputation: '声誉', heat: '热度', appearance: '外貌', luck: '运气', iq: '智商', political: '政治面貌', family: '家境' };
              return `<span class="effect ${v > 0 ? 'pos' : 'neg'}">${labels[k] || k}${v > 0 ? '+' : ''}${v}</span>`;
            }).join('')}
          </div>
        </div>
        <div class="sticky-action">
          <button class="btn btn-primary" onclick="App.goToEra()" type="button">接受命运，继续</button>
        </div>
      </div>
    `;
  },
  // v2.19 时代剧本：开局选择时代（背景之后、专业之前）
  goToEra() {
    engine.setPhase('era');
    if (typeof this.saveCheckpoint === 'function') this.saveCheckpoint('era'); else engine.saveState();
    this.renderContent(this.renderEra());
    this.updateStatus();
  },
  renderEra() {
    const eras = (GameData.eras) ? Object.values(GameData.eras) : [];
    const selectedEra = engine.getState().era;
    return `
      <div class="stage fade-in">
        <div class="lead"><span>🗓️</span><p>时代背景——你出生于哪个年代？这决定了你的仕途基调。</p></div>
        <div style="display:flex;flex-direction:column;gap:10px" role="radiogroup" aria-label="时代剧本">
          ${eras.map(e => `
            <div class="option" role="radio" aria-checked="${selectedEra === e.id ? 'true' : 'false'}" onclick="App.selectEra('${e.id}')" style="cursor:pointer">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
                <span style="font-weight:700;color:var(--ink)">${e.icon} ${App.escapeHtml(e.name)}</span>
              </div>
              <div style="font-size:12px;color:var(--ink-light);line-height:1.7">${App.escapeHtml(e.desc)}</div>
            </div>
          `).join('')}
        </div>
        <p style="font-size:10px;color:var(--ink-lighter);margin-top:10px;text-align:center">选错不要紧——人生没有重来，但可以再来一局。</p>
      </div>
    `;
  },
  selectEra(eraId) {
    if (!engine.setEra(eraId)) { this.showToast('无效的时代', 'warning'); return; }
    this.goToMajor();
  },
  goToMajor() {
    engine.rollMajors();
    engine.setPhase('major');
    this.renderContent(this.renderMajor());
    this.updateStatus();
  },
  renderMajor() {
    const majors = engine.getState().randomMajors;
    const selectedMajor = engine.getPlayer().major;
    return `
      <div class="stage fade-in">
        <div class="lead"><span>🎓</span><p>选一个吧。十八岁以为这是热爱，后来发现它也可能是报考条件。</p></div>
        <div class="card-grid" id="major-grid" role="radiogroup" aria-label="专业选择">
          ${majors.map(m => `
            <div class="card${selectedMajor === m.id ? ' selected' : ''}" role="radio" aria-checked="${selectedMajor === m.id ? 'true' : 'false'}" onclick="App.selectMajor('${m.id}')" data-id="${m.id}">
              <div class="card-title">${App.escapeHtml(m.name)}</div>
              <div class="card-sub">${App.escapeHtml(m.category)}</div>
              <div class="card-desc">${App.escapeHtml(String(m.desc || '').substring(0, 30))}...</div>
              <div class="card-bias">适配：${App.escapeHtml((m.jobBias || []).slice(0, 5).join('、'))}${m.jobBias.length > 5 ? '…' : ''}</div>
            </div>
          `).join('')}
        </div>
        <div class="sticky-action">
          <button class="btn btn-primary" onclick="App.confirmMajor()" type="button">确认选择</button>
        </div>
      </div>
    `;
  },
  selectMajor(id) {
    engine.setMajor(id);
    document.querySelectorAll('#major-grid .card').forEach(c => {
      const selected = c.dataset.id === String(id);
      c.classList.toggle('selected', selected);
      c.setAttribute('aria-checked', selected ? 'true' : 'false');
    });
  },
  confirmMajor() {
    if (!engine.getPlayer().major) { this.showToast('请选择一个专业', 'warning'); return; }
    engine.rollTalents();
    engine.setPhase('talents');
    if (typeof this.saveCheckpoint === 'function') this.saveCheckpoint('major'); else engine.saveState();
    this.renderContent(this.renderTalents());
    this.updateStatus();
  },
  renderTalents() {
    const selected = engine.getPlayer().talents;
    const p = engine.getPlayer();
    const talents = engine.getState().randomTalents;
    const sorted = [...talents].sort((a, b) => ({UR:0,SSR:1,SR:2,R:3}[a.rarity]) - ({UR:0,SSR:1,SR:2,R:3}[b.rarity]));
    return `
      <div class="stage fade-in">
        <div class="lead"><span>⭐</span><p>从以下8个天赋中选4个（${engine.getState().talentPoints}/4）。当前年龄: <strong>${p.age}岁</strong></p></div>
        ${this.getCodexReward().bonus > 0 ? `<div style="background:var(--parchment-warm);border:1px solid var(--gold);padding:8px 12px;border-radius:8px;font-size:12px;color:var(--gold-dark);margin-bottom:10px">📖 图鉴奖励：${App.escapeHtml(this.getCodexReward().title)}（额外 +${this.getCodexReward().bonus} 点天赋，共 ${engine.getState().talentPoints} 点）</div>` : ''}
        <div class="talent-grid">
          <div class="talent-cards" role="group" aria-label="天赋选择">
            ${sorted.map(t => `
              <div class="talent-card rarity-${t.rarity.toLowerCase()} ${selected.includes(t.id) ? 'selected' : ''}" 
                   role="checkbox" aria-checked="${selected.includes(t.id) ? 'true' : 'false'}" onclick="App.toggleTalent('${t.id}')" data-id="${t.id}">
                <div class="talent-name">${App.escapeHtml(t.name)}</div>
                <div class="talent-rarity">${App.escapeHtml(t.rarity)}</div>
                <div class="talent-desc">${App.escapeHtml(String(t.desc || '').substring(0, 25))}...</div>
                <div class="talent-effects">
                  ${Object.entries(t.effects).filter(([k]) => !['education','political','minExamAge','minExamAgeAdd','maxExamAge'].includes(k)).map(([k, v]) => {
                    if (v <= 0) return ''; // 只展示正面增益，负面变化隐藏（盲盒玩法）
                    const labels = { iq: '智商', eq: '情商', luck: '运气', body: '体质', mentalPressure: '心理压力', workAbility: '工作能力', desire: '欲望', risk: '风险', integrity: '廉洁', background: '背景', familyPressure: '家庭压力', positionWeight: '职务权重', appearance: '外貌', reputation: '声誉', heat: '热度', family: '家境' };
                    return `<span class="effect pos">${App.escapeHtml(labels[k] || k)}+${v}</span>`;
                  }).join('')}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
        <div class="sticky-action">
          <button class="btn btn-primary" onclick="App.confirmTalents()" type="button">确认选择 (${engine.getState().talentPoints}/4)</button>
        </div>
      </div>
    `;
  },
  toggleTalent(id) {
    const selected = engine.getPlayer().talents;
    if (selected.includes(id)) { engine.removeTalent(id); }
    else { engine.addTalent(id); }
    this.renderContent(this.renderTalents());
    this.updateStatus();
  },
  confirmTalents() {
    const goNext = () => {
      engine.setPhase('personality');
      if (typeof this.saveCheckpoint === 'function') this.saveCheckpoint('talents'); else engine.saveState();
      this.renderContent(this.renderPersonality());
      this.updateStatus();
    };
    if (engine.getState().talentPoints > 0) {
      App.confirmAction(`还有 ${engine.getState().talentPoints} 点天赋未分配，确定继续吗？`, goNext);
      return;
    }
    goNext();
  },
  renderAttrs() {
    const a = engine.getAttrs();
    const points = engine.getState().attrPoints;
    return `
      <div class="stage fade-in">
        <div class="lead"><span>📈</span><p>分配属性点（剩余 ${points} 点）。智商管笔试、情商管面试，运气/家境/外貌/体质影响职业生涯的方方面面。</p></div>
        <div class="attr-allocate">
          ${Object.entries({ iq: ['智商', '笔试正确率、技术岗晋升'], eq: ['情商', '面试表现、群众路线'], luck: ['运气', '晋升运势、随机事件'], family: ['家境', '家庭压力、子女教育'], appearance: ['外貌', '面试印象、社交好感'], body: ['体质', '健康、抗压恢复'] }).map(([key, [label, desc]]) => `
            <div class="attr-row">
              <span class="attr-name">${label}</span>
              <button class="btn-sm" onclick="App.removeAttr('${key}')" ${a[key] <= -5 ? 'disabled' : ''}>-</button>
              <span class="attr-val">${a[key]}</span>
              <button class="btn-sm" onclick="App.addAttr('${key}')" ${points <= 0 ? 'disabled' : ''}>+</button>
              <div class="attr-bar-mini">
                <div class="bar-fill" style="width:${((a[key] + 5) / 15) * 100}%;background:var(--ui-blue)"></div>
              </div>
              <span class="attr-desc" style="font-size:10px;color:var(--ink-light);margin-left:8px;flex:1">${desc}</span>
            </div>
          `).join('')}
        </div>
        <div class="sticky-action">
          <button class="btn btn-primary" onclick="App.confirmAttrs()" type="button">确认分配 (${points}/10)</button>
        </div>
      </div>
    `;
  },
  addAttr(key) { engine.addAttr(key); this.renderContent(this.renderAttrs()); this.updateStatus(); },
  removeAttr(key) { engine.removeAttr(key); this.renderContent(this.renderAttrs()); this.updateStatus(); },
  confirmAttrs() {
    engine.setPhase('units');
    if (typeof this.saveCheckpoint === 'function') this.saveCheckpoint('attrs'); else engine.saveState();
    this.renderContent(this.renderUnits());
    this.updateStatus();
  },
});
