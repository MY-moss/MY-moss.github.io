// v2.1.67 结构重构：740 行单体拆为编排主体 + 11 个顺序子方法（_rcy_* 前缀），行为逐行不变。
// 顺序约束：快照→衰减→流转→人脉→家庭健康→财务→重置资产→死flag→事件→结算→特殊注入。
// 短路语义：_rcy_annualEventSelection 的 aborted（e761 接管）直接终止年度；
//           _rcy_specialEventInjection 返回 true = 已注入等待 UI 的 choice 事件。
GameEngine.prototype.runCareerYear = function() {
    const p = this.state.player;
    if (!p.isEmployed || p.ending || this.state.currentEvent || this.state.pendingPromotion || this.state.pendingTransfer) return false;
    // v2.19 时代剧本：全局机制基调（改革=高压快节奏 / 平稳=岁月静好 / 整顿=廉洁优先）
    const eraEff = this.getEra() ? this.getEra().effects : null;
    const eraId = this.state.era;
    this._rcy_snapshotAndAdvance(eraEff);
    this._rcy_riskHeatDecay(eraId);
    this._rcy_luckFamilyAppearanceFlow();
    this._rcy_talentAndNetworkEvolution();
    this._rcy_familyHealthDynamics();
    this._rcy_financeSettlement();
    this._rcy_annualResetAndAssets();
    this._rcy_deadFlagConsumption();
    const sel = this._rcy_annualEventSelection();
    if (sel.aborted) return true; // e761 逮捕/出逃接管，跳过年度结算（与原实现一致）
    this._rcy_yearEndSettlement(sel.event);
    if (this._rcy_specialEventInjection()) return true; // 入党/返聘/怀孕事件交给 UI
    return true;
  }
// 子方法 1：上一年快照 + 年岁推进 + 单位/性格修正 + 工作能力成长 + 压力恢复
GameEngine.prototype._rcy_snapshotAndAdvance = function(eraEff) {
    const s = this.state; const p = s.player;
    // 记录上一年属性快照（用于UI显示变化来源）- 浅拷贝优化
    p.lastYearHidden = Object.assign({}, s.hidden);
    p.lastYearAttrs = Object.assign({}, this.state.attrs);
    p.lastYearWealth = p.wealth || 0;
    for(const {flag} of this.getCausalChainSteps()){
      if(p.flags[flag] && !(Number(p.flags[flag+'_since'])>0))p.flags[flag+'_since']=p.age;
    }
    s.year++; p.age++; p.yearsWorked++;
    s.pendingMicro = null; // P2：上一年未回应的使绊窗口过期（不回应=维持原状，模拟行为不变）
if (p.unit) { s.hidden.mentalPressure += Math.round(p.unit.stress * 0.05); s.hidden.risk += Math.round(p.unit.riskDensity * 0.03); }
    // 性格修正
    if (p.personality === 'stable') { s.hidden.mentalPressure = Math.max(0, s.hidden.mentalPressure - 1); }
    else if (p.personality === 'ambitious') { s.hidden.mentalPressure += 1; s.hidden.desire = Math.min(100, s.hidden.desire + 1); }
    else if (p.personality === 'smooth') { s.hidden.risk = Math.max(0, s.hidden.risk - 1); }
    else if (p.personality === 'straight') { s.hidden.integrity = Math.min(100, s.hidden.integrity + 1); }
    if (this.state.attrs.body > 2) s.hidden.mentalPressure -= this.rand(0, Math.floor(this.state.attrs.body / 3));
    s.hidden.workAbility += this.rand(0, 2) + Math.max(0, Math.floor(this.state.attrs.body / 3));
    // 专业对口加成：专业与所在单位匹配时，业务能力每年额外积累（匹配度越高成长越快）
    const majorFit = this.getMajorFit(p.unit);
    if (majorFit.matchCount > 0) {
      s.hidden.workAbility += 0.5 + Math.min(majorFit.matchCount, 4) * 0.25;
    }
    if (s.hidden.workAbility > 92) s.hidden.workAbility = 92;
    else if (s.hidden.workAbility > 80) s.hidden.workAbility -= this.rand(0, 1);
    if (s.hidden.mentalPressure > 50) { var recBase = Math.min(3 + Math.floor(s.hidden.mentalPressure / 15), s.hidden.mentalPressure - 10); var familyBlock = Math.floor(s.hidden.familyPressure / 25); s.hidden.mentalPressure -= Math.max(1, recBase - familyBlock); }
    // v2.19 改革年代：高压常态，压力恢复更慢
    if (eraEff && eraEff.stressRecover) s.hidden.mentalPressure += eraEff.stressRecover;
  }
// 子方法 2：风险衰减 / 廉洁恢复 / 体质恢复 / 调查热度衰减 / 家庭压力回落
GameEngine.prototype._rcy_riskHeatDecay = function(eraId) {
    const s = this.state; const p = s.player;
    if (s.hidden.risk > 0) {
      // 腐败玩家风险衰减减半（做过的事不会消失，风险更难洗白）
      const riskDecay = 1 + Math.floor(s.hidden.integrity / 40);
      // v2.19 整顿年代：风险衰减再减半（反腐高压下旧账更难翻篇）
      const decayMult = (eraId === 'rectify') ? 0.5 : 1;
      s.hidden.risk = Math.max(0, s.hidden.risk - (p.flags && this.hasCorruptFlag(p.flags) ? Math.max(0, Math.floor((riskDecay / 2) * decayMult)) : Math.floor(riskDecay * decayMult)));
    }
    if (s.hidden.integrity < 70) s.hidden.integrity += 1.5 + (eraId === 'rectify' ? 1 : 0); // v2.19 整顿年代：廉洁恢复更快
    // 体质自然恢复
    if (this.state.attrs.body < 0) this.state.attrs.body += 0.3;
    // 调查热度自然衰减（更慢，给腐败行为更多暴露风险）
    // 腐败玩家：衰减减半 + 每年 +0.5 发酵（做过的事会被翻出来，热度只涨不落）
    const corruptHeat = (p.flags && this.hasCorruptFlag(p.flags)) ? true : false;
    // v2.19 平稳年代：热度消散更快（风头过了就是过了）
    const heatDecayExtra = (eraId === 'stable') ? 1 : 0;
    if (p.heat > 0) p.heat = Math.max(0, p.heat - (corruptHeat ? this.rand(0, 1) : this.rand(0, 2) + heatDecayExtra));
    if (p.heat > 0 && p.reputation > 70) p.heat = Math.max(0, p.heat - (corruptHeat ? 0 : 1));
    // 形象良好（外貌≥8 且声誉≥60）：负面舆论消散更快（形象好的干部，传闻很难站住脚）；腐败玩家不再享有该豁免
    if (p.heat > 0 && !corruptHeat && this.state.attrs.appearance >= 8 && p.reputation >= 60) p.heat = Math.max(0, p.heat - 1);
    if (corruptHeat && p.heat < 100 && this.randf() < 0.4) p.heat = Math.min(100, p.heat + 1);
    if (s.hidden.familyPressure > 15) s.hidden.familyPressure -= this.rand(0, 1);
    // v2.19 平稳年代：家国两安，家庭压力额外回落
    if (eraId === 'stable' && s.hidden.familyPressure > 0) s.hidden.familyPressure = Math.max(0, s.hidden.familyPressure - 1);
    // 家境殷实（家境≥8）：家里有底气，家庭压力额外回落（不为柴米油盐发愁）
    if (s.hidden.familyPressure > 0 && this.state.attrs.family >= 8) s.hidden.familyPressure = Math.max(0, s.hidden.familyPressure - 1);
    // 拥有住房：安居乐业，家庭压力每年小幅回落
    if (p.flags.hasHouse && s.hidden.familyPressure > 0) s.hidden.familyPressure = Math.max(0, s.hidden.familyPressure - 1);
  }
// 子方法 3：运气流转 / 家境支持 / 外貌人气 / 三属性微互动 / 属性成长与岁月磨损
GameEngine.prototype._rcy_luckFamilyAppearanceFlow = function() {
    const s = this.state; const p = s.player;
    // ===== 运气年度流转（v2.4）：好运年年有，霉运年年防，运气不再是"赌事件" =====
    // 门槛经 100 局模拟校准：luck 终局均值 3.7（最高 6），原门槛 7 永远够不到 → 降为 5
    // v2.4.1：声望/关系分支随职级放大（封顶资源，无通胀风险）；财富分支保持平增（防财富指数通胀）
    const luckNow = this.state.attrs.luck;
    if (luckNow >= 5 && this.randf() < 0.12) {
      const roll = this.randf();
      if (roll < 0.40) {
        const bonus = 3 + this.rand(0, 3);
        this.cashIn(bonus);
        p.careerLog.push({ year: p.age, event: '🍀 碰巧赶上一波行情/活动，意外收入+' + bonus + '（运气使然）' });
      } else if (roll < 0.70) {
        const rep = 2 + Math.floor((p.leadershipRank || 0) / 3);
        p.reputation = Math.min(100, p.reputation + rep);
        p.careerLog.push({ year: p.age, event: '🍀 恰好帮领导解了个小围，风评意外+' + rep + '（运气使然）' });
      } else if (p.contacts && p.contacts.length > 0) {
        const c = p.contacts[this.rand(0, p.contacts.length - 1)];
        const rel = 5 + Math.floor((p.leadershipRank || 0) / 2);
        this.adjustContactRelation(c.id, rel);
        p.careerLog.push({ year: p.age, event: '🍀 机缘巧合又碰见' + (c.name || '朋友') + '，交情更进一步（运气使然）' });
      } else {
        p.reputation = Math.min(100, p.reputation + 1);
        p.careerLog.push({ year: p.age, event: '🍀 机缘巧合，认识了位热心人，声誉+1（运气使然）' });
      }
    } else if (luckNow <= 2 && this.randf() < 0.12) {
      const roll = this.randf();
      if (roll < 0.40) {
        const loss = 2 + this.rand(0, 3);
        // 破财走现金，现金不足差额自动转高利贷负债（该负债多少就负债多少）
        this.cashOut(loss);
        p.careerLog.push({ year: p.age, event: '🍂 突发小破财（车胎/家电/意外开销）-' + loss + '（时运不济）' });
      } else if (roll < 0.70) {
        s.hidden.mentalPressure = Math.min(100, s.hidden.mentalPressure + 2 + this.rand(0, 2));
        p.careerLog.push({ year: p.age, event: '🍂 接连碰壁，心里添堵，心理压力上升（时运不济）' });
      } else {
        p.reputation = Math.max(0, p.reputation - 1);
        p.careerLog.push({ year: p.age, event: '🍂 被人误会了一场，风评-1（时运不济）' });
      }
    }
    // ===== 家境年度支持（v2.4）：家境殷实的家族资源持续兑现（门槛校准：原8→5） =====
    // v2.4.1：背景分支随职级放大；财富分支保持平增
    if (this.state.attrs.family >= 5 && this.randf() < 0.15) {
      const roll = this.randf();
      if (roll < 0.50) {
        const bonus = 2 + this.rand(0, 3);
        this.cashIn(bonus);
        p.careerLog.push({ year: p.age, event: '🏠 家里帮衬了一把（家族资源），财富+' + bonus });
      } else if (roll < 0.80) {
        const bg = 1 + Math.floor((p.leadershipRank || 0) / 4);
        s.hidden.background = Math.min(100, s.hidden.background + bg);
        p.careerLog.push({ year: p.age, event: '🏠 家族长辈的关系走动，背景+' + bg + '（家族资源）' });
      } else {
        s.hidden.familyPressure = Math.max(0, s.hidden.familyPressure - 3);
        p.careerLog.push({ year: p.age, event: '🏠 家里把难处都料理妥了，家庭压力-3（家族资源）' });
      }
    }
    // ===== 外貌年度人气（v2.4）：好形象的人缘是日积月累的（门槛校准：原7→5） =====
    // v2.4.1：人气随职级放大（声望封顶100，无通胀风险）
    if (this.state.attrs.appearance >= 5 && this.randf() < 0.15) {
      const boost = 1 + this.rand(0, 1) + Math.floor((p.leadershipRank || 0) / 5);
      p.reputation = Math.min(100, p.reputation + boost);
      p.careerLog.push({ year: p.age, event: '✨ 形象气度出众，单位内外人缘稳步积累，声誉+' + boost });
    }
    // ===== 三属性微互动（v2.4.1）：属性未达门槛5也有存在感——每年 12% 概率微小反馈，消灭"前期死区" =====
    // 设计：未达标属性走微互动（效果微小且封顶），达标属性走上方强管道，两不叠加
    if (this.state.attrs.luck < 5 && this.randf() < 0.12) {
      p.reputation = Math.min(100, p.reputation + 1);
      p.careerLog.push({ year: p.age, event: '🍀 运气平平，但按部就班的日子也顺顺当当，声誉+1' });
    }
    if (this.state.attrs.family < 5 && this.randf() < 0.12) {
      s.hidden.familyPressure = Math.max(0, s.hidden.familyPressure - 1);
      p.careerLog.push({ year: p.age, event: '🏠 家里虽不宽裕，但日子安稳踏实，家庭压力-1' });
    }
    if (this.state.attrs.appearance < 5 && this.randf() < 0.12) {
      p.reputation = Math.min(100, p.reputation + 1);
      p.careerLog.push({ year: p.age, event: '✨ 形象普通，但待人真诚，人缘也不差，声誉+1' });
    }
    // ===== 属性年度成长（v2.4）：运气/家境/外貌缓慢积累 =====
    // v2.4.1：保底成长只为"够到门槛5"服务（每3年必+1，消除随机死区）；5以上保留5%/年慢速概率成长（封顶10），
    // 天赋玩家的起手优势在终局面板上依然可感（无天赋≈7，单天赋≈8-9，双天赋≈10-11）
    for (const ak of ['luck', 'family', 'appearance']) {
      const av = this.state.attrs[ak];
      if (av < 5 && p.yearsWorked % 3 === 0) {
        this.state.attrs[ak] = Math.min(5, av + 1);
        const label = ak === 'luck' ? '🍀 运气这东西玄，但最近诸事顺遂，运气+1' : ak === 'family' ? '🏠 家里境况渐渐好转，家境+1' : '✨ 注重形象管理、气质沉淀，外貌+1';
        p.careerLog.push({ year: p.age, event: label });
      } else if (av < 10 && this.randf() < 0.05) {
        this.state.attrs[ak] = Math.min(10, av + 1);
        const label = ak === 'luck' ? '🍀 运气这东西玄，但最近诸事顺遂，运气+1' : ak === 'family' ? '🏠 家里境况渐渐好转，家境+1' : '✨ 注重形象管理、气质沉淀，外貌+1';
        p.careerLog.push({ year: p.age, event: label });
      }
    }
    // ===== 属性动态平衡（v2.4.3）：高属性玩家逐年概率小幅回落（岁月磨损） =====
    // 阈值以上才衰减；iq/eq 事件正加成严重失衡（410:3 / 823:49）→ 用递增衰减率（属性越高掉得越快），
    // 其余属性固定概率。与事件加成形成动态平衡：属性不会无限堆高，后期保持中等强度，防数值超模
    const attrDecay = [
      { k: 'iq', threshold: 10, p: 0.06, slope: 0.05, msg: '🧠 长期用脑过度、熬夜加班，记性大不如前，智商-1' },
      // v2.15.1：eq slope 0.12→0.06（原值导致 eq>14 后几乎每年必衰减，属性无法真正达到25上限）
      { k: 'eq', threshold: 12, p: 0.16, slope: 0.06, msg: '🎭 年纪渐长，情绪起伏比以前大，情商-1' },
      { k: 'luck', threshold: 10, p: 0.08, msg: '🍀 好运守恒，一段顺遂之后运势有所回落，运气-1' },
      { k: 'family', threshold: 8, p: 0.06, msg: '🏠 家族资源终有用尽时，家境-1' },
      { k: 'appearance', threshold: 7, p: 0.06, msg: '✨ 岁月不饶人，不刻意打理形象就难免疏漏，外貌-1' },
      { k: 'body', threshold: 9, p: 0.08, msg: '🩹 加班熬夜是常态，身体在慢慢磨损，体质-1' },
    ];
    for (const d of attrDecay) {
      const av = this.state.attrs[d.k];
      if (av >= d.threshold) {
        const pDecay = Math.min(0.8, d.p + (d.slope || 0) * (av - d.threshold));
        if (this.randf() < pDecay) {
          this.state.attrs[d.k] = Math.max(0, av - 1);
          p.careerLog.push({ year: p.age, event: d.msg });
        }
      }
    }
  }
// 子方法 4：天赋特性 / 人脉地域与演化 / 年度维护与结识 / 敌人使绊（微决策窗口）/ 关系衰减
GameEngine.prototype._rcy_talentAndNetworkEvolution = function() {
    const s = this.state; const p = s.player;
    // v2.59 天赋特性实现：潜龙在渊（压力>60 时蓄势，职级权重+1/年）/ 基层之王（乡镇街道能力成长+1/年）
    const tIds = p.talents || []; // talents 是天赋 id 字符串数组（addTalent push id）
    if (tIds.includes('dragon_fate') && s.hidden.mentalPressure > 60) {
      s.hidden.positionWeight += 1;
    }
    if (tIds.includes('grassroots_king') && p.unitLevel === 0) {
      s.hidden.workAbility = Math.min(100, (s.hidden.workAbility || 0) + 1);
    }
    // v2.56 人脉地域更新（年度调用，幂等：仅 unitLevel 变化时生效）+ 职业演化（3% 概率联系人升职）
    if (this.updateContactRegions) this.updateContactRegions();
    if (this.reconcileNetworkYear) this.reconcileNetworkYear();
    if (p.contacts && p.contacts.length > 0) {
      p.flags.hasContact = true; // v2.56 供地域事件门槛使用
      if (this.randf() < 0.03) {
        const evoPool = p.contacts.filter(c => !c.enemy);
        if (evoPool.length > 0) {
          const c = evoPool[this.rand(0, evoPool.length - 1)];
          const EVO = { classmate: '公司上市，成了行业名人', subordinate: '独当一面，被上级单位看中', chamber: '当选市工商联副主席', qingmei: '升任医院科室主任', veteran: '晋升公安系统领导岗位', doctor: '评上主任医师正高职称', oldClassmate: '创业公司拿到大额融资' };
          if (EVO[c.id] && !c.evolved) {
            c.evolved = true;
            p.careerLog.push({ year: p.age, event: `📈 老友 ${c.name} 事业更上一层楼（${EVO[c.id]}）` });
          }
        }
      }
    }
    // 人脉维护：每年低概率经营人际关系
    // v2.60 数值平衡：免费维护收益 +4~9 → +1~3（原碾压付费维系按钮 +3，主动经营失去意义）
    if (this.randf() < 0.08) {      if (p.contacts && p.contacts.length > 0) {        const crewIds = ['crew_boss', 'crew_colleague', 'crew_mentor'];
        const crewPool = p.contacts.filter(c => crewIds.includes(c.id));
        const pool = crewPool.length > 0 ? crewPool : p.contacts;
        const c = pool[this.rand(0, pool.length - 1)];
        const gain = 1 + this.rand(0, 2) + (c.region === 'remote' ? 0 : 1); // v2.60 本地 +1~3、异地 +1~2（低于维系按钮，主动走动仍是最优）
        this.adjustContactRelation(c.id, gain);
        p.careerLog.push({ year: p.age, event: '逢年过节维护人脉，与' + (c.name || '朋友') + '关系更近一步' });      }
      // v2.1.6 修复：结识分支从维护分支的 else 解耦——原 else if 挂在 contacts.length===0 条件上，
      // 而 crew 群像/开局联系人使 contacts 恒非空，noble/mentor 等 20+ 特色人物与 60+ 专属事件永不可达；
      // 现在有联系人也可结识（每年 8% 主闸内独立 60%，联系人容量统一由 data-network 控制）。
      const contactCapacity = (GameData.network && GameData.network.contactCapacity) || 10;
      if (this.randf() < 0.6 && p.contacts.length < contactCapacity) {
        // 普通年度相识以随机模板为主；固定人物只保留为导师、贵人等关键剧情锚点。
        if (this.randf() < 0.70 && typeof this.createRandomContact === 'function') {
          const randomContact = this.createRandomContact({ source: 'annual_encounter' });
          const added = randomContact && this.addContact(randomContact);
          if (added) p.careerLog.push({ year: p.age, event: `🤝 在工作、培训或日常往来中认识了${added.name}（${added.position}）` });
        } else {
          const namePool = ['老张', '王局', '李处', '陈总', '赵科长', '刘书记', '孙主任', '周老师'];
          // 固定人物只占少数，用于开启有明确出口的专属事件链。
          const roll = this.randf();
          if (roll < 0.10) {
          const noble = { id: 'noble', name: '周主任', relation: 15, position: '省里退下来的老领导', description: '在系统会议上结识的前辈，人脉很广' };
          this.addContact(noble);
          p.careerLog.push({ year: p.age, event: '🤝 结识了省里退下来的老领导周主任，他对你印象不错' });
          } else if (roll < 0.17) {
          const mentor = { id: 'mentor', name: '郑教授', relation: 18, position: '大学恩师，退休学者', description: '你大学时的导师，桃李满天下，看重你这个学生' };
          this.addContact(mentor);
          p.careerLog.push({ year: p.age, event: '🎓 重遇大学恩师郑教授，他退休后仍关心你的发展' });
          } else if (roll < 0.25) {
          const neighbor = { id: 'neighbor', name: '刘大爷', relation: 20, position: '退休老干部邻居', description: '住在你楼上的退休干部，经验丰富' };
          this.addContact(neighbor);
          p.careerLog.push({ year: p.age, event: '🏠 认识了退休老干部邻居刘大爷，为人热心' });
          } else if (roll < 0.33) {
          const classmate = { id: 'classmate', name: '陈总', relation: 15, position: '老同学，生意做得不错', description: '大学同窗，现在是公司老板' };
          this.addContact(classmate);
          p.careerLog.push({ year: p.age, event: '🤝 老同学陈总联系上你，他现在生意做得不错' });
          } else if (roll < 0.40) {
          const hometown = { id: 'hometown', name: '老周', relation: 16, position: '同乡长辈', description: '和你同乡的长辈，在老家县里说话有分量' };
          this.addContact(hometown);
          p.careerLog.push({ year: p.age, event: '🏘️ 老乡老周认了你这个同乡，说以后常走动' });
          } else if (roll < 0.46) {
          const subordinate = { id: 'subordinate', name: '小赵', relation: 18, position: '得力下属', description: '你带出来的年轻人，办事踏实靠得住' };
          this.addContact(subordinate);
          p.careerLog.push({ year: p.age, event: '👥 下属小赵办事得力，你把他当自己人培养' });
          } else if (roll < 0.50) {
          const qingmei = { id: 'qingmei', name: '苏晓', relation: 22, position: '青梅竹马', description: '从小一起长大的发小，如今是市里医院的医生' };
          this.addContact(qingmei);
          p.careerLog.push({ year: p.age, event: '💗 多年不见的青梅竹马苏晓调回市里工作，你们重新联系上' });
          } else if (roll < 0.56) {
          const chamber = { id: 'chamber', name: '孙会长', relation: 14, position: '商会会长', description: '本地商会会长，黑白两道都吃得开' };
          this.addContact(chamber);
          p.careerLog.push({ year: p.age, event: '🥂 商会晚宴上认识了孙会长，他递给你一张烫金名片' });
          } else if (roll < 0.62) {
          const veteran = { id: 'veteran', name: '吴哥', relation: 20, position: '转业战友', description: '一起扛过枪的老战友，转业后在公安系统' };
          this.addContact(veteran);
          p.careerLog.push({ year: p.age, event: '🎖️ 老战友吴哥转业回了本市，约你喝酒叙旧' });
          } else if (roll < 0.68) {
          const elder = { id: 'elder', name: '钱老', relation: 14, position: '退休老书记', description: '当过县委书记的老前辈，德高望重，讲究规矩' };
          this.addContact(elder);
          p.careerLog.push({ year: p.age, event: '📜 老干部活动中心认识了钱老，他说"现在的年轻人啊，浮躁"——但看你顺眼' });
          } else if (roll < 0.74) {
          const journalist = { id: 'journalist', name: '小何', relation: 16, position: '市报记者', description: '跑口记者，消息灵通，笔杆子厉害' };
          this.addContact(journalist);
          p.careerLog.push({ year: p.age, event: '📰 采访现场认识了记者小何，她人很机灵' });
          } else if (roll < 0.80) {
          const doctor = { id: 'doctor', name: '赵大夫', relation: 18, position: '医院老同学', description: '医学院的老同学，现在是市医院主任医师' };
          this.addContact(doctor);
          p.careerLog.push({ year: p.age, event: '🩺 老同学赵大夫在门诊遇到你，说"你们这些当官的，身体最要紧"' });
          } else if (roll < 0.86) {
          const inspector = { id: 'inspector', name: '老宋', relation: 12, position: '纪检组老同志', description: '纪委派驻组的老同志，铁面无私，但分得清公私' };
          this.addContact(inspector);
          p.careerLog.push({ year: p.age, event: '⚖️ 工作接触认识了纪检组老宋，他目光犀利地打量了你几眼' });
          } else if (roll < 0.92) {
          const partySchool = { id: 'partySchool', name: '林处长', relation: 16, position: '党校同学', description: '党校青干班同期同学，现在在市局当处长' };
          this.addContact(partySchool);
          p.careerLog.push({ year: p.age, event: '🎓 党校青干班同学林处长在系统内混得风生水起，你们惺惺相惜' });
          } else {
          const newContact = { id: 'c' + p.contacts.length + '_' + p.age, name: namePool[this.rand(0, namePool.length - 1)], relation: 10 + this.rand(0, 20), position: '体制内相识', description: '在饭局上认识的朋友' };
          this.addContact(newContact);
          p.careerLog.push({ year: p.age, event: '结识了新朋友' + newContact.name });
          }
        }
      }
    }
    // v2.51 敌人使绊：有结怨对象时每年 8% 概率被使绊（与化解链 ent172 配合，树敌越多越危险）
    // P2：伤害照常发生（数值不变），同时记录 pendingMicro，筹划板给玩家一个回应窗口（微决策）
    const enemies = p.contacts.filter(c => c.enemy);
    if (enemies.length > 0 && this.randf() < 0.08) {
      const e = enemies[this.rand(0, enemies.length - 1)];
      const roll = this.randf();
      if (roll < 0.40) {
        const amt = 4 + this.rand(0, 2);
        s.hidden.risk = Math.min(100, s.hidden.risk + amt);
        s.pendingMicro = { kind: 'enemy', enemyName: e.name, hit: 'risk', amount: amt, year: p.age };
        p.careerLog.push({ year: p.age, event: '🕳️ ' + e.name + ' 向上面打了你的小报告，纪检谈话风险上升' });
      } else if (roll < 0.70) {
        const amt = 2 + this.rand(0, 2);
        p.reputation = Math.max(0, p.reputation - amt);
        s.pendingMicro = { kind: 'enemy', enemyName: e.name, hit: 'reputation', amount: amt, year: p.age };
        p.careerLog.push({ year: p.age, event: '🗯️ ' + e.name + ' 在背后散布你的闲话，风评受损' });
      } else {
        const amt = 5 + this.rand(0, 4);
        s.hidden.mentalPressure = Math.min(100, s.hidden.mentalPressure + amt);
        s.pendingMicro = { kind: 'enemy', enemyName: e.name, hit: 'pressure', amount: amt, year: p.age };
        p.careerLog.push({ year: p.age, event: '💢 ' + e.name + ' 暗中使绊让你当众难堪，心里窝火' });
      }
    }
    // v2.52 关系衰减：多年不维护的关系自然疏远（每年 5% 概率对关系 < 40 的非敌人联系人 -2，倒逼定期走动）
    // v2.60 平衡修复：衰减覆盖全部非敌人（原仅 <40 生效——挚友关系建立后永不衰减，'维护'机制对高关系失效）；概率 5%→8%；高关系衰减更慢（≥40 减 1）、泛泛之交减 2、异地额外 -2
    if (p.contacts && p.contacts.length > 0 && this.randf() < 0.08) {
      const pool = p.contacts.filter(c => !c.enemy);
      if (pool.length > 0) {
        const c = pool[this.rand(0, pool.length - 1)];
        const rel = c.relation || 0;
        const base = rel >= 40 ? 1 : 2;
        const decay = base + (c.region === 'remote' ? 2 : 0);
        if (this.applyContactDelta) this.applyContactDelta(c, { relation: -decay, trust: c.region === 'remote' ? -1 : 0, access: c.region === 'remote' ? -1 : 0 }, '年度关系衰减');
        else c.relation = Math.max(-60, rel - decay);
      }
    }
  }
// 子方法 5：家庭小事件 / 子女成长 / 健康与慢性病 / 子女年龄推进
GameEngine.prototype._rcy_familyHealthDynamics = function() {
    const s = this.state; const p = s.player;
    // 家庭年度动态：已婚者低概率触发家庭小事件
    if (p.isMarried && this.randf() < 0.10) {
      const familyEvents = [
        { t: '今天是结婚纪念日，你准备了惊喜', eff: () => { this.state.hidden.familyPressure = Math.max(0, this.state.hidden.familyPressure - 6); this.state.player.reputation = Math.min(100, this.state.player.reputation + 1); }, icon: '💕' },
        { t: '伴侣最近工作不顺，需要你的陪伴', eff: () => { this.state.hidden.familyPressure += 5; this.state.hidden.mentalPressure += 3; }, icon: '🤝' },
        { t: '家里为过年回谁家起了争执', eff: () => { this.state.hidden.familyPressure += 6; this.state.attrs.eq = Math.max(-8, this.state.attrs.eq + 1); }, icon: '🏠' },
        { t: '伴侣提议出去旅游放松心情', eff: () => { this.state.hidden.familyPressure = Math.max(0, this.state.hidden.familyPressure - 5); this.state.hidden.mentalPressure = Math.max(0, this.state.hidden.mentalPressure - 3); }, icon: '✈️' }
      ];
      const fe = familyEvents[this.rand(0, familyEvents.length - 1)];
      fe.eff();
      p.careerLog.push({ year: p.age, event: fe.icon + ' ' + fe.t });
    }
    // 子女成长动态：有子女者低概率触发子女阶段事件
    if (p.hasChildren && this.randf() < 0.08) {
      const kidEvents = [
        { t: '孩子考了不错的成绩，你感到欣慰', eff: () => { this.state.hidden.familyPressure = Math.max(0, this.state.hidden.familyPressure - 4); this.state.player.reputation = Math.min(100, this.state.player.reputation + 1); }, icon: '📚' },
        { t: '孩子身体不舒服，你请假带他去医院', eff: () => { this.state.hidden.familyPressure += 5; this.state.attrs.body = Math.max(-8, this.state.attrs.body - 1); }, icon: '🏥' },
        { t: '孩子进入了青春期，有些叛逆', eff: () => { this.state.hidden.familyPressure += 6; this.state.hidden.mentalPressure += 3; }, icon: '🌱' },
        { t: '你陪孩子过周末，享受亲子时光', eff: () => { this.state.hidden.familyPressure = Math.max(0, this.state.hidden.familyPressure - 6); this.state.attrs.eq = Math.min(15, this.state.attrs.eq + 1); }, icon: '🎈' }
      ];
      const ke = kidEvents[this.rand(0, kidEvents.length - 1)];
      ke.eff();
      p.careerLog.push({ year: p.age, event: ke.icon + ' ' + ke.t });
    }
    // 健康动态：年龄越大、压力越高，越容易积累健康问题
    if (this.randf() < 0.05) {
      if (p.age >= 45 && (s.hidden.mentalPressure > 60 || this.state.attrs.body <= 0)) {
        p.flags.chronicIllness = true;
        s.attrs.body = Math.max(-8, s.attrs.body - 1);
        p.careerLog.push({ year: p.age, event: '🏥 长期高压让身体亮起红灯，医生说要注意休息' });
      } else if (this.state.attrs.body >= 3 && s.hidden.mentalPressure < 50) {
        s.attrs.body = Math.min(10, s.attrs.body + 1);
        if (this.randf() < 0.3) p.careerLog.push({ year: p.age, event: '💪 坚持锻炼，身体状态保持得不错' });
      }
    }
    // 慢性病恶化：带病工作风险
    if (p.flags.chronicIllness && this.randf() < 0.04) {
      s.attrs.body = Math.max(-8, s.attrs.body - 2);
      s.hidden.mentalPressure += 4;
      p.careerLog.push({ year: p.age, event: '🚑 慢性病急性发作，你住了一次院' });
    }
    // 天赋：基层之王（grassroots_king）——基层单位时工作能力与声誉持续加成
    // v2.1.57 校准：分层报告职级Δ+0.9/首次上岸+7.5%——年度触发概率 0.4→0.3
    if ((p.talents || []).includes('grassroots_king') && (p.unitLevel === 0 || p.unitLevel === 1) && this.randf() < 0.3) {
      s.hidden.workAbility += 1;
      p.reputation = Math.min(100, p.reputation + 1);
    }
    if (p.hasChildren && typeof p.childAge === 'number' && p.childAge < 40) p.childAge += 1; // v2.22 子女年龄逐年增长（驱动成才事件链）；v2.58 封顶 40 岁（原无上限，孩子可涨到 40+）
  }
// 子方法 6：工资入账 → 生活支出 → 负债结算（强制还本+付息+兜底豁免+负财富惩罚）
GameEngine.prototype._rcy_financeSettlement = function() {
    const s = this.state; const p = s.player;
    // 家庭财务结算（v2.12 双表）：工资入现金 → 生活支出 → 付息（不足利滚利）→ 工资结余强制还本
    // v2.15.1：基础值8→10，修复rank=1科员已婚有娃玩家年度净现金流为负（12-13=-1）的赤字bug
    const salary = 10 + p.leadershipRank * 4 + Math.floor(p.yearsWorked / 3) + (p.rankTrack || 0); // v2.69 职级待遇：职级 Lv 每级 +1 收入（与领导职务解耦）
    this.cashIn(salary);
    const fin = p.finance;
    // 消费升级负反馈：仅正现金参与计算；/25 强度（v2.4.1 校准：财富300→税24/年，收敛约250-400，
    // 兼顾"正常玩家买得起房、理财有意义"与"p99不超1200哨兵"；此前 /12 过度收敛至150，买房/理财系统名存实亡）
    // v2.1.67 收敛：公式抽至 engine-finance-utils.computeLivingExpense（与 restYear 同一口径）
    const expense = this.computeLivingExpense(p); // v2.66 房贷月供 8→6（原对低职级玩家是'穷人税'：rank≤3 时月供 8 使净现金流转负滑入高利贷螺旋）
    if (p.flags.mortgage) p.careerLog.push({ year: p.age, event: '🏠 房贷月供扣款（-6）' }); // v2.66 月供入日志（原并入生活费无任何记录，玩家只见现金减少）
    this.cashOut(expense); // 现金不足差额自动转高利贷负债
    // 负债处理：先按工资结余强制还本，再按负债表各类型利率付息（现金不足则利滚利并入本金）
    if (this.debtTotal() > 0) {
      // 强制还本（v2.13/v2.15.1/v2.49）+ 付息/利滚利（v2.1.6 封顶挂账）——v2.1.67 收敛至
      // engine-finance-utils.settleDebtInterest（forcedRepay: 工资结余基数 + 工作能力加成 + 5% 滚本封顶）
      const settle = this.settleDebtInterest(fin, { forcedRepay: true, repaySalaryDelta: salary - expense, workAbility: s.hidden.workAbility });
      p.careerLog.push({ year: p.age, event: `💸 强制还贷：还息 ${settle.interestPaid}、还本 ${settle.forcedPaid}，负债压得你喘不过气` });
      if (this.debtTotal() > 50 && fin.cash < 10 && this.randf() < 0.3) {
        s.hidden.familyPressure += 2;
        p.careerLog.push({ year: p.age, event: '💸 债主上门，你东拼西凑才应付过去' });
      }
      // v2.59 负财富惩罚：入不敷出有现实代价（债主上门——声誉/风险/家压逐年恶化，逼玩家出坑而非无感锁死）
      if (p.wealth < 0 && fin.cash < 6) {
        p.reputation = Math.max(0, (p.reputation ?? 50) - 2);
        s.hidden.risk = Math.min(100, (s.hidden.risk || 0) + 2);
        s.hidden.familyPressure = Math.min(100, (s.hidden.familyPressure || 0) + 2);
        p.careerLog.push({ year: p.age, event: '⚠️ 入不敷出，债主天天上门（声誉-2 风险+2 家压+2）' });
      }
      // v2.15.1：债务危机兜底——防永续负债死循环
      // 三档兜底：债务>300时硬上限豁免至300（防指数膨胀失控）；债务>200时10%概率帮还20%
      if (this.debtTotal() > 300) {
        // 硬上限豁免：债务超300时强制豁免至300（极端情况兜底，防数值失控）
        const overflow = this.debtTotal() - 300;
        this.payDebtByForgive(overflow);
        p.careerLog.push({ year: p.age, event: `💸 债务重组：经组织协调豁免了 ${overflow} 元债务，避免了你彻底崩盘` });
      }
      if (this.debtTotal() > 200 && this.randf() < 0.10) {
        const relief = Math.round(this.debtTotal() * 0.20);
        this.payDebtByForgive(relief);
        p.careerLog.push({ year: p.age, event: `💸 家人东拼西凑帮你还了 ${relief} 元本金，总算松了口气` });
      }
    }
  }
// 子方法 7：年度次数重置 / 定期与黄金到期 / 理财天赋 / 财富动态
GameEngine.prototype._resetAnnualActionsAndMatureAssets = function() {
    const p = this.state.player;
    if(this.settleDutyPlan)this.settleDutyPlan();
    if(this.settlePolicyFollowups)this.settlePolicyFollowups();
    // 年度重置：财务规划/人情往来次数归零（每回合限次防膨胀），并清理年度选项缓存（面板选项每年首次打开时重新抽取）
    p.flags.financeUsed = 0;
    if (this.resetNetworkActions) this.resetNetworkActions();
    if (this.resetActionPoints) this.resetActionPoints(); // 年度筹划回合：新一年精力点补满
    p.flags.giftUsed = 0;
    p.flags.visitUsed = 0;        // v2.58 修复：走动/维系/求助次数未清零，导致人脉系统一生只能用 1 次并锁死送礼额度
    p.flags.childRaiseUsed = 0;   // v2.58 修复：子女培养次数未清零，导致培养一生只能用 1 次、培养成就不可达
    delete p.flags.financeOptions;
    delete p.flags.financeOptionsYear;
    delete p.flags.giftOptions;
    delete p.flags.giftOptionsYear;
    // 定期存款到期结算（上一年存的定期，今年返还本息）
    // 定期稳健但不再提供每年 20% 的无风险回报。
    if (p.flags.savingDeposit) {
      this.cashIn(11);
      delete p.flags.savingDeposit;
      p.careerLog.push({ year: p.age, event: '🏦 定期到期，投入10、到账11，实际收益1' });
    }
    // 黄金属于有价格波动的资产，不是无风险固定年息；清晰记录真实盈亏。
    if (p.flags.goldHeld) {
      const r=this.randf();
      const payout=r<0.25?60:r<0.80?74:84;
      this.cashIn(payout);
      delete p.flags.goldHeld;
      p.careerLog.push({ year: p.age, event: `📿 去年购金70，今年售出到账${payout}，净盈亏${payout-70 >= 0 ? '+' : ''}${payout-70}` });
    }
  };
GameEngine.prototype._rcy_annualResetAndAssets = function() {
    const s=this.state, p=s.player, fin=p.finance;
    this._resetAnnualActionsAndMatureAssets();
    // 天赋：财商觉醒（money_sense）——财富按天赋定义固定增长/年（字段驱动，防指数膨胀）
    const moneyTalent = GameData.talents.find(t => t.id === 'money_sense');
    if ((p.talents || []).includes('money_sense')) {
      this.cashIn(Math.max(1, Math.round((moneyTalent && moneyTalent.wealthBonus) || 2)));
    }
    // 天赋：潜龙在渊（dragon_fate）——逆风时工作能力微增（越挫越勇）
    if ((p.talents || []).includes('dragon_fate') && p.leadershipRank <= 4 && p.missedPromotions > 3 && this.randf() < 0.3) {
      s.hidden.workAbility += 1;
      s.hidden.mentalPressure = Math.max(0, s.hidden.mentalPressure - 1);
    }
    if (this.debtTotal() > 10 && fin.cash < 10 && this.randf() < 0.15) {
      s.hidden.familyPressure += 3;
      p.careerLog.push({ year: p.age, event: '💰 家里入不敷出，为钱的事开始发愁' });
    } else if (fin.cash > 30 && this.randf() < 0.10) {
      s.hidden.familyPressure = Math.max(0, s.hidden.familyPressure - 2);
      p.careerLog.push({ year: p.age, event: '💰 手头宽裕了些，家里日子好过不少' });
    }
    // 财富动态：现金积蓄多了之后，被动理财收益/损失（收益上限减半防膨胀；高财富后触发率再降，钱多不折腾）
    if (fin.cash > 80 && this.randf() < (fin.cash > 150 ? 0.08 : 0.12)) {
      if (this.randf() < 0.7) {
        this.cashIn(Math.floor(fin.cash * (0.005 + this.randf() * 0.015)));
        p.careerLog.push({ year: p.age, event: '📈 闲钱买了稳健理财，一年下来小赚一笔' });
      } else {
        // 理财亏损只减现金，不制造负债
        const loss = Math.floor(fin.cash * (0.02 + this.randf() * 0.04));
        fin.cash = Math.max(0, fin.cash - loss);
        this.syncWealth();
        p.careerLog.push({ year: p.age, event: '📉 听信"内部消息"投了一笔，亏了些钱' });
      }
    }
  }
// 子方法 8：死 flag 消费（酗酒/旧债/担当回报）+ 赌瘾发作（30% 弹选择，70% 自动结算）
GameEngine.prototype._rcy_deadFlagConsumption = function() {
    const s = this.state; const p = s.player;
    // 死flag消费：酗酒恶化
    if (p.flags.alcoholDependence && this.randf() < 0.06) {
      s.attrs.body = Math.max(-8, s.attrs.body - 1);
      s.hidden.mentalPressure += 3;
      p.careerLog.push({ year: p.age, event: '🍺 你发现自己越来越离不开酒，身体和状态都在下滑' });
      if (s.hidden.mentalPressure >= 75) { p.flags.alcoholDependence = true; p.careerLog.push({ year: p.age, event: '⚠️ 领导约谈：你因酗酒被通报批评' }); s.hidden.positionWeight = Math.max(0, s.hidden.positionWeight - 2); }
    }
    // 死flag消费：债务危机
    if (p.flags.debtManage && this.randf() < 0.07) {
      s.hidden.familyPressure += 4;
      s.hidden.mentalPressure += 3;
      p.careerLog.push({ year: p.age, event: '💸 村里的旧债又找上门来，你焦头烂额' });
    }
    // 死flag消费：担当回报（主动担责后，组织看在眼里）
    if (p.flags.tookResponsibility && this.randf() < 0.05) {
      p.reputation = Math.min(100, p.reputation + 2);
      s.hidden.positionWeight = Math.min(100, s.hidden.positionWeight + 2);
      p.careerLog.push({ year: p.age, event: '🤝 当年你主动担责的事被上级记住了，换来一句"这同志有担当"' });
      delete p.flags.tookResponsibility;
    }
    // 赌瘾发作（v2.11）：赌博一次后牌局隔几年找上门（轻度赌瘾 3~4 年/次有喘息，重度 streak≥4 才 2~3 年/次缠身）
    // v2.18 修复：不再次次抢占正常事件轮——70% 自动结算（写日志+财富变化，不占 choice 槽，正常事件照常触发），
    // 30% 弹赌博选择（保留成瘾期手动抉择的刺激感）。触发后不终止年度结算。
    // 连续4次不赌则赌瘾慢慢消退（streak 递减，归零戒除）
    const gambleGs = p.flags.gambleStreak || 0;
    if (!p.ending && gambleGs > 0 && !this.state.pendingTransfer && !this.state.pendingPromotion) {
      const gap = p.yearsWorked - (p.flags.gambleLastYear || 0);
      const interval = gambleGs >= 4 ? 2 + this.rand(0, 1) : 3 + this.rand(0, 1); // 重度2~3年/次，轻度3~4年/次
      if (gap >= interval) {
        if ((p.flags.gambleMiss || 0) >= 4) {
          p.flags.gambleStreak = Math.max(0, gambleGs - 1);
          p.flags.gambleMiss = 0;
          p.flags.gambleLastYear = p.yearsWorked;
          if (p.flags.gambleStreak === 0) {
            delete p.flags.gamblingAddict; delete p.flags.gamblingAddict_since;
            p.careerLog.push({ year: p.age, event: '🎲 你终于戒掉了赌瘾，心里那块石头落了地' });
          } else {
            p.careerLog.push({ year: p.age, event: `🎲 赌瘾有所消退（赌欲等级 ${p.flags.gambleStreak}）` });
          }
        } else if (this.randf() < 0.30) {
          // 30%：弹赌博选择（占用本年度 choice 槽）——不 return：下方晋升/降级/历练/年度记录照常执行
          this.triggerGambleEvent();
        } else {
          // 70%：自动结算（不占 choice 槽，正常 choice/auto 事件照常触发）
          this.autoSettleGamble();
        }
      }
    }
  }
// 单一因果来源：年度调度与玩家的「旧事待办」共用同一组阶段条件，
// 无需复制另一份年度链表（避免显示将要触发但引擎根本不会触发的事件）。
GameEngine.prototype.getCausalChainSteps = function() {
    return [
        { flag: 'mbaApply', next: 'ent233', delay: 1 },
        { flag: 'mbaActive', next: 'ent234', delay: 1 },
        { flag: 'mbaDegree', next: 'ent235', delay: 3 },
        { flag: 'healthRisk', next: 'ent245', delay: 1, unless: ['healthCare','healthTreated','healthStable'] },
        { flag: 'healthHardhead', next: 'arc_health_retry', delay: 2, unless: ['healthCare','healthTreated','healthStable','healthRisk'], allowSeenRisk: true },
        { flag: 'healthCare', next: 'ent246', delay: 1 },
        { flag: 'healthTreated', next: 'ent247', delay: 1 },
        { flag: 'underInvestigation', next: 'e646', delay: 1 },
        { flag: 'fled', next: 'e649', delay: 1 }, // 逃离调查后，追逃与身份核查在下一年兑现
        { flag: 'defied', next: 'e648', delay: 2 }, // 死扛后组织核实、移送司法需时 2 年
        { flag: 'selfSurrender', next: 'e647', delay: 1 }, // 自首后纪律处分流程 1 年
        { flag: 'appliedParty', next: 'e043', delay: 1, unless:['expelledFromParty'], nonMember:true }, // 预备党员 1 年预备期后必然转正讨论
        { flag: 'proj_step1', next: 'e654', delay: 1 }, // 招商专案每年推进一步
        { flag: 'proj_step2', next: 'e655', delay: 1 },
        { flag: 'proj_step3', next: 'e656', delay: 1 },
        { flag: 'proj_done', next: 'e657', delay: 1 },
        { flag: 'whistleblower', next: 'ent066', delay: 2 }, // 举报后组织调查约谈需时 2 年
        { flag: 'drinkDrive', next: 'ent254', delay: 1 }, // v2.65 酒驾被查后必然处理（扣分罚款/单位处分）
        { flag: 'mortgage', next: 'ent258', delay: 1 }, // 贷款买房后必然月供压力
        { flag: 'faction_lean', next: 'ent260', delay: 2 }, // 站队后 2 年派系风云（得势/失势/转向抉择）
        { flag: 'faction_leaned_out', next: 'ent262', delay: 1 }, // 靠山倒台后必然面对清算/转向
        { flag: 'dating', next: 'ent263', delay: 3, singleOnly:true }, // 恋爱满 3 年必然决断（结婚/继续/分手）
        { flag: 'faction_steadfast', next: 'ent261', delay: 2 }, // v2.66 坚定站队 → 2 年后必然得势
        { flag: 'mortgage', next: 'ent259', delay: 4 },
        { flag: 'mortgage', next: 'arc_mortgage_3', delay: 8 }, // v2.66 房贷 4 年后必然可提前还贷（出口保障，原 ent259 池子概率极低）
        // P3 剧本专属事件链：首步两种走法都推进到 002；002 完成后推进到 003（链根 flag 只由剧本事件设置，经典模式不受影响）
        { flag: 'grassrootsBreakthrough', next: 'scn_grassroots_002', delay: 1 },
        { flag: 'grassrootsCautious', next: 'scn_grassroots_002', delay: 1 },
        { flag: 'grassrootsStep2', next: 'scn_grassroots_003', delay: 1 },
        { flag: 'midcareerRebuild', next: 'scn_midcareer_002', delay: 1 },
        { flag: 'midcareerHold', next: 'scn_midcareer_002', delay: 1 },
        { flag: 'midcareerStep2', next: 'scn_midcareer_003', delay: 1 },
        { flag: 'cleanRecord', next: 'scn_clean_002', delay: 1 },
        { flag: 'cleanCompromise', next: 'scn_clean_002', delay: 1 },
        { flag: 'cleanStep2', next: 'scn_clean_003', delay: 1 },
        { flag: 'networkBoundary', next: 'scn_network_002', delay: 1 },
        { flag: 'networkFavor', next: 'scn_network_002', delay: 1 },
        { flag: 'networkStep2', next: 'scn_network_003', delay: 1 },
        { flag: 'reformPilot', next: 'scn_reform_002', delay: 1 },
        { flag: 'reformCautious', next: 'scn_reform_002', delay: 1 },
        { flag: 'reformStep2', next: 'scn_reform_003', delay: 1 },
        { flag: 'retiredMentor', next: 'scn_retired_002', delay: 1 },
        { flag: 'retiredLegacy', next: 'scn_retired_002', delay: 1 },
        { flag: 'retiredStep2', next: 'scn_retired_003', delay: 1 },
        { flag: 'familyBalance', next: 'scn_family_002', delay: 1 },
        { flag: 'familyCareer', next: 'scn_family_002', delay: 1 },
        { flag: 'familyStep2', next: 'scn_family_003', delay: 1 },
        // v2.1.43 事件链系统：反腐链与基层链刚性推进
        { flag: 'reportCorruption', next: 'e802', delay: 1 },
        { flag: 'probeCorruption', next: 'e803', delay: 1 },
        { flag: 'antiCorrStorm', next: 'e804', delay: 1 },
        { flag: 'serveVillage', next: 'e806', delay: 1 },
        { flag: 'villageFirstDone', next: 'e807', delay: 1 },
        { flag: 'villageProjectDone', next: 'e808', delay: 1 },
        // v2.1.68 缺口补充：赡养链 / 理财暴雷链 / 借调链（入口在下方概率注入）
        { flag: 'parentIllness', next: 'ent294', delay: 1 },
        { flag: 'parentCaring', next: 'ent295', delay: 2 },
        { flag: 'parentShared', next: 'enl215', delay: 2 },
        { flag: 'parentCareReviewed', next: 'enl216', delay: 3 },
        { flag: 'leveragedInvest', next: 'ent297', delay: 2 },
        { flag: 'leveragedHeavy', next: 'ent302', delay: 2 },
        { flag: 'investCrash', next: 'ent298', delay: 1 },
        { flag: 'seconded', next: 'ent300', delay: 1 },
        { flag: 'secondReview', next: 'ent301', delay: 1 },
        { flag: 'secondDone', next: 'enw126', delay: 1 },
        // Real qualifications and appointment reviews must never award outcomes before the initiating choice.
        { flag: 'qualificationApplied', next: 'enw246', delay: 1 },
        { flag: 'selectedVillage', next: 'enw249', delay: 1 },
        { flag: 'cadreInquiry', next: 'enc125', delay: 1 },
        { flag: 'cadreDossier', next: 'enc126', delay: 1 },
        { flag: 'cadreOpenReview', next: 'enc127', delay: 1 },
        { flag: 'cadreQuietReview', next: 'enc140', delay: 1 },
        { flag: 'cadreReviewClosed', next: 'enc128', delay: 1 },
        // Remembered people: a choice with an actual named counterpart returns after years.
        { flag: 'wangDispute', next: 'ent285', delay: 2 },
        { flag: 'wangReconciled', next: 'ent304', delay: 2 },
        { flag: 'wangHostility', next: 'ent305', delay: 2 },
        { flag: 'directorDispute', next: 'ent173', delay: 2 },
        { flag: 'directorBoundary', next: 'ent303', delay: 3 },
        { flag: 'directorEscalated', next: 'ent174', delay: 1 },
        { flag: 'directorRetaliation', next: 'ent286', delay: 1 },
        { flag: 'oldZhangPetition', next: 'ent172', delay: 1 },
        { flag: 'mentorMet', next: 'ent175', delay: 1 },
        { flag: 'mentorVisitMemory', next: 'ent176', delay: 1 },
        { flag: 'mentorLecture', next: 'ent307', delay: 1 },
        { flag: 'mentorLetdown', next: 'ent307', delay: 1 },
        { flag: 'mentorCared', next: 'ent182', delay: 2 },
        { flag: 'mentorAbsent', next: 'ent183', delay: 2 },
        { flag: 'mentorRevisited', next: 'ent306', delay: 3 },
        // 财务与廉政风险：接受不当利益、挪用公款和灰色理财均兑现延迟后果。
        { flag: 'bg_tempt_1', next: 'e743', delay: 1 },
        { flag: 'bg_tempt_2', next: 'e744', delay: 1 },
        { flag: 'borrowed', next: 'e748', delay: 2 },
        { flag: 'embezzle', next: 'e756', delay: 1 },
        { flag: 'grayFinance', next: 'e758', delay: 1 },
        { flag: 'tookBribe', next: 'e616', delay: 1 },
        { flag: 'tookKickback', next: 'e617', delay: 1 },
        { flag: 'tookShares', next: 'e618', delay: 1 },
        { flag: 'gamblingAddict', next: 'e747', delay: 1 },
        { flag: 'gamblingRelapse', next: 'e765', delay: 1 },
        // 中间人路线：牵线→调解→举荐→口碑扩散→枢纽取舍。
        { flag: 'hub_bridge', next: 'e728', delay: 1 },
        { flag: 'hub_mediator', next: 'e729', delay: 1 },
        { flag: 'hub_recommend', next: 'e730', delay: 1 },
        { flag: 'hub_spread', next: 'e731', delay: 1 },
        { flag: 'receiptOpen', next: 'arc_receipt_open_2', delay: 2 },
        { flag: 'receiptQuiet', next: 'arc_receipt_quiet_2', delay: 2 },
        { flag: 'receiptOpenReviewed', next: 'arc_receipt_open_3', delay: 3 },
        { flag: 'receiptQuietReviewed', next: 'arc_receipt_quiet_3', delay: 3 },
        { flag: 'receiptThirdResolved', next: 'arc_receipt_legacy_4', delay: 6 },
        { flag: 'teamShared', next: 'arc_team_shared_2', delay: 2 },
        { flag: 'teamDeferred', next: 'arc_team_deferred_2', delay: 2 },
        { flag: 'teamSharedFollowed', next: 'arc_team_shared_3', delay: 3 },
        { flag: 'teamDeferredFollowed', next: 'arc_team_deferred_3', delay: 3 },
        { flag: 'teamThirdResolved', next: 'arc_team_legacy_4', delay: 6 },
        { flag: 'familyClinicPresent', next: 'arc_family_present_2', delay: 2 },
        { flag: 'familyClinicAbsent', next: 'arc_family_absent_2', delay: 2 },
        { flag: 'familyClinicResolved', next: 'arc_family_clinic_3', delay: 3 },
        { flag: 'classmateOpen', next: 'arc_classmate_open_2', delay: 2 },
        { flag: 'classmateFavor', next: 'arc_classmate_favor_2', delay: 2 },
        { flag: 'classmateBoundaries', next: 'arc_classmate_boundary_2', delay: 2 },
        { flag: 'classmateOpenReviewed', next: 'arc_classmate_open_3', delay: 3 },
        { flag: 'classmateFavorReviewed', next: 'arc_classmate_favor_3', delay: 3 },
        { flag: 'classmateBoundaryReviewed', next: 'arc_classmate_boundary_3', delay: 3 },
        { flag: 'classmateThirdResolved', next: 'arc_classmate_legacy_4', delay: 6 },
        { flag: 'crossOpen', next: 'arc_crossroads_open_2', delay: 2 },
        { flag: 'crossPhase', next: 'arc_crossroads_phase_2', delay: 2 },
        { flag: 'crossSeal', next: 'arc_crossroads_seal_2', delay: 2 },
        { flag: 'crossOpenReviewed', next: 'arc_crossroads_open_3', delay: 3 },
        { flag: 'crossPhaseReviewed', next: 'arc_crossroads_phase_3', delay: 3 },
        { flag: 'crossSealReviewed', next: 'arc_crossroads_seal_3', delay: 3 },
        { flag: 'crossResolved', next: 'arc_crossroads_echo', delay: 2 },
        // 私人投资风险后续：当年盈亏已结算，职业合规问题两年后仍需面对。
        { flag: 'ventureStake', next: 'arc_venture_disclosure_1', delay: 2 },
        { flag: 'ventureDeclared', next: 'arc_venture_declared_2', delay: 2 },
        { flag: 'ventureExited', next: 'arc_venture_exited_2', delay: 2 },
        { flag: 'ventureHidden', next: 'arc_venture_hidden_2', delay: 2 },
        { flag: 'lifeCareerLead', next: 'arc_life_career_2', delay: 2 },
        { flag: 'lifeCareerExpert', next: 'arc_life_career_2', delay: 2 },
        { flag: 'lifeCareerReviewed', next: 'arc_life_career_3', delay: 3 },
        { flag: 'lifeIntegrityOpen', next: 'arc_life_integrity_2', delay: 2 },
        { flag: 'lifeIntegrityQuiet', next: 'arc_life_integrity_2', delay: 2 },
        { flag: 'lifeIntegrityReviewed', next: 'arc_life_integrity_3', delay: 3 },
        { flag: 'lifeFamilyPresent', next: 'arc_life_family_2', delay: 2 },
        { flag: 'lifeFamilyCareer', next: 'arc_life_family_2', delay: 2 },
        { flag: 'lifeFamilyReviewed', next: 'arc_life_family_3', delay: 3 },
        { flag: 'lifeNetworkPublic', next: 'arc_life_network_2', delay: 2 },
        { flag: 'lifeNetworkSelective', next: 'arc_life_network_2', delay: 2 },
        { flag: 'lifeNetworkReviewed', next: 'arc_life_network_3', delay: 3 },
        { flag: 'lifeConfluenceOpen', next: 'arc_life_confluence_2', delay: 3 },
        { flag: 'lifeConfluenceFamily', next: 'arc_life_confluence_2', delay: 3 },
        { flag: 'lifeConfluenceDeferred', next: 'arc_life_confluence_2', delay: 3 },
        { flag: 'renewWindowInclusive', next: 'renew_window_2', delay: 2 },
        { flag: 'renewWindowPilot', next: 'renew_window_2', delay: 2 },
        { flag: 'renewWindowExcluded', next: 'renew_window_2', delay: 2 },
        { flag: 'renewWindowReviewed', next: 'renew_window_3', delay: 3 },
        { flag: 'renewRepairMaintain', next: 'renew_repair_2', delay: 2 },
        { flag: 'renewRepairPhased', next: 'renew_repair_2', delay: 2 },
        { flag: 'renewRepairFast', next: 'renew_repair_2', delay: 2 },
        { flag: 'renewRepairReviewed', next: 'renew_repair_3', delay: 3 },
        { flag: 'renewHomeShared', next: 'renew_home_2', delay: 2 },
        { flag: 'renewHomeSupport', next: 'renew_home_2', delay: 2 },
        { flag: 'renewHomeDeferred', next: 'renew_home_2', delay: 2 },
        { flag: 'renewHomeReviewed', next: 'renew_home_3', delay: 3 },
        { flag: 'renewCreditShared', next: 'renew_credit_2', delay: 2 },
        { flag: 'renewCreditInternal', next: 'renew_credit_2', delay: 2 },
        { flag: 'renewCreditTaken', next: 'renew_credit_2', delay: 2 },
        { flag: 'renewCreditReviewed', next: 'renew_credit_3', delay: 3 },
        { flag: 'renewShopGuide', next: 'renew_shop_2', delay: 2 },
        { flag: 'renewShopRefer', next: 'renew_shop_2', delay: 2 },
        { flag: 'renewShopPromise', next: 'renew_shop_2', delay: 2 },
        { flag: 'renewShopReviewed', next: 'renew_shop_3', delay: 3 },
        { flag: 'renewStageRegular', next: 'renew_stage_2', delay: 1 },
        { flag: 'renewStageGuest', next: 'renew_stage_2', delay: 1 },
        { flag: 'renewStageDeclined', next: 'renew_stage_2', delay: 1 },
        { flag: 'renewStageReviewed', next: 'renew_stage_3', delay: 2 },
        { flag: 'renewStageThird', next: 'renew_stage_4', delay: 3 },
        { flag: 'renewRouteDirect', next: 'renew_route_2', delay: 2 },
        { flag: 'renewRouteKeep', next: 'renew_route_2', delay: 2 },
        { flag: 'renewRoutePilot', next: 'renew_route_2', delay: 2 },
        { flag: 'renewRouteReviewed', next: 'renew_route_3', delay: 2 },
        { flag: 'renewRouteThird', next: 'renew_route_4', delay: 3 },
    ];
};
// 只读当前存档：列出真实已解锁、尚未兑现的因果，按应兑现年龄排序。
GameEngine.prototype.getPendingCausalConsequences = function() {
    const p=this.state.player, flags=p.flags||{}, seen=new Set(p.seenEvents||[]);
    const known=new Set((GameData.events||[]).map(e=>e.id));
    const unique=new Map();
    const labels=[
      [/^renew_stage_/,'小剧场 · 罗青'],[/^renew_route_/,'公交变迁 · 顾芸'],[/^renew_credit_/,'成果归属 · 沈宁'],[/^renew_shop_/,'街坊旧事 · 许姨'],[/^renew_window_/,'服务可及性 · 人工入口'],[/^renew_repair_/,'设施维护 · 长期责任'],[/^renew_home_/,'家庭生活 · 时间约定'],[/^arc_receipt_/,'旧城回执 · 周岚'],[/^arc_team_/,'交接本 · 许砚'],
      [/^arc_family_/,'蓝色便签 · 家人'],[/^arc_classmate_/,'老同学的申请书 · 林默'],
      [/^arc_crossroads_/,'三份名单 · 联合会商'],[/^arc_venture_/,'私人投资 · 申报与边界'],
      [/^arc_life_career_/,'仕途发展 · 岗位传承'],[/^arc_life_integrity_/,'原则担当 · 原始记录'],[/^arc_life_family_/,'家庭约定 · 长期陪伴'],[/^arc_life_network_/,'社会连接 · 基层反馈'],[/^arc_life_confluence_/,'人生交汇 · 共同责任'],
      [/^ent2(44|45|46|47)$|^arc_health_retry$/,'健康与康复'],[/^ent2(93|94|95)$|^enl21[56]$/,'父母照护'],
      [/^ent2(96|97|98)$|^ent302$/,'资产与风险'],[/^ent(299|300|301)$|^enw249$/,'借调与考察'],[/^ent(169|17[0-4]|28[56]|30[3-5])$/,'职场分歧 · 当年旧账'],[/^ent(17[5-7]|18[23]|30[6-8])$/,'郑教授 · 多年往来'],[/^enc(125|126|127|128|140)$/,'干部考察 · 异议与复核'],[/^enw246$/,'岗位业务评审'],
      [/^ent23[2345]$/,'学业进修'],[/^scn_/,'人生剧本'],[/^e(646|647|648|649)$/,'调查与责任'],[/^e(805|806|807|808)$/,'基层挂职'],[/^enw126$/,'借调与考察'],[/^e(728|729|730|731)$/,'人脉枢纽'],[/^e(616|617|618|743|744|747|748|756|758|765)$/,'财务与廉政后果'],
      [/^e(654|655|656|657)$/,'招商项目'],[/^ent2(58|59)$|^arc_mortgage_3$/,'房贷与家庭财务']
    ];
    this.getCausalChainSteps().forEach((step,index)=>{
      if(!flags[step.flag]||seen.has(step.next)||!known.has(step.next))return;
      if(step.nonMember && p.political==='cpc')return;
      if(step.singleOnly && p.isMarried)return;
      if(step.unless?.some(k=>flags[k] && !(step.allowSeenRisk && k==='healthRisk' && seen.has('ent245'))))return;
      const since=Number(flags[step.flag+'_since']);
      const dueAge=Number.isFinite(since)&&since>0 ? since+(step.delay||1) : p.age+(step.delay||1);
      const label=labels.find(([re])=>re.test(step.next))?.[1]||'职业与人生旧事';
      const item={id:step.next,flag:step.flag,label,dueAge,waitingYears:Math.max(0,dueAge-p.age),overdue:dueAge<=p.age,index};
      const previous=unique.get(step.next);
      if(!previous||dueAge<previous.dueAge)unique.set(step.next,item);
    });
    return [...unique.values()].sort((a,b)=>a.dueAge-b.dueAge||a.index-b.index);
};
// 与此前决定交错：财务结算是即时的，私人投资是否合规要在两年后检查。
GameEngine.prototype.getVentureReviewEvent = function() {
    const e=GameData.events.find(x=>x.id==='arc_venture_disclosure_1');
    if(!e)return null;
    const f=this.state.player.flags||{};
    const event={...e,choices:e.choices.map(c=>({...c,effects:{...c.effects}}))};
    if(f.classmateFavor){
      event.text+=' 你想起林默当年托你打过的那通电话；同一个名字又出现在关联企业的说明材料里。';
      event.choices[2].effects.risk+=5;
      event.choices[2].effects.contactDelta={target:'oldClassmate',trust:-6,relation:-4};
    } else if(f.classmateBoundaries){
      event.text+=' 林默曾劝你把私人往来和工作审批分开，你在档案袋上看见自己手写的那句提醒。';
      event.choices[0].effects.integrity+=2;
    }
    if(f.crossSeal){
      event.text+=' 旧城项目未经充分复核的事情还未完全过去，这份投资说明更难轻描淡写。';
      event.choices[2].effects.risk+=5;
    }
    return event;
};
// 四条人生线的后续事件按玩家已走过的分支改写；只复制当前事件，不修改全局事件模板。
GameEngine.prototype.getLifePathEvent = function(event) {
  if (!event || !/^(renew_|arc_life_|arc_team_|arc_receipt_|arc_classmate_|arc_family_clinic_3|arc_mortgage_3|enl216|ent259|ent295|ent30[67])/.test(event.id || '')) return event;
  const f=this.state.player.flags||{};
  const out={...event,choices:(event.choices||[]).map(c=>({...c,effects:{...(c.effects||{})}}))};
  const add=(text)=>{out.text=(out.text||'')+' '+text;};
  const bump=(index,changes)=>{const effects=out.choices[index]&&out.choices[index].effects;if(!effects)return;for(const [key,value] of Object.entries(changes))effects[key]=(Number(effects[key])||0)+value;};
  const result=(index,text)=>{if(out.choices[index])out.choices[index].result=text;};
  switch(out.id){
    case 'renew_stage_2':
      if(f.renewStageRegular){add('一年来你已经熟悉自己的角色，节目单上原本印着你的名字。');bump(0,{mentalPressure:-1});}
      else if(f.renewStageGuest){add('你仍只是临时帮忙的人。罗青这次问你能不能替缺席的演员补一场。');out.choices[0].text='接受临时邀请，提前完成工作交接';result(0,'你带着重新熟悉的台词上了台，最后一场终于没有缺人。');}
      else if(f.renewStageDeclined){add('罗青想请你最后读一次那段当年没有接下的台词，你可以拒绝，也可以去补这一场。');out.choices[0].text='接受这次邀请，提前安排次日工作';result(0,'你临时补上了那个角色，这是你在旧剧场唯一的一次演出。');out.choices[1].text='谢绝邀请，让剧团另作安排';result(1,'剧团找到了替补，你留在单位，没有出现在节目单上。');}
      break;
    case 'renew_stage_3':
      if(f.renewStagePlayed)add('书中夹着一张旧节目单，罗青把当晚的角色名字用铅笔圈了起来。');
      else if(f.renewStageMissed){add('书中夹着一张你从未登台的演出照片。那一晚已经结束，不会再原样重演。');bump(0,{mentalPressure:1});}
      else if(f.renewStageAudience)add('照片里的道具你认得，其中一箱是你亲手搬走的。');
      break;
    case 'renew_stage_4':
      if(f.renewStageLetter)add('罗青后来寄来过几次学生演出的照片，彼此的生活已经不再围着同一个剧场转。');
      else if(f.renewStageCreate)add('你后来写过一段自己的小故事，和当年的剧本并不是同一个题材。');
      else if(f.renewStageQuiet)add('旧信仍留在家里，你没有重新建立往来。');
      if(f.renewStageMissed){add('展柜上的名单里没有你的名字，你只能讲演出之前真正经历过的那一部分。');result(0,'你讲了早年的相识和演出前的事，也坦然说出自己并没有参加那场演出。');}
      else if(f.renewStageAudience){result(0,'你讲起搬道具的那天和从观众席看到的演出。');}
      else if(f.renewStagePlayed){result(0,'你记得那句临时改过的台词，也记得谢幕时罗青站在什么地方。');}
      break;
    case 'renew_route_2':
      if(f.renewRouteDirect){add('后来增加的直达班次缩短了许多人的通勤，但旧站点的服务空档也出现了新的投诉。');bump(1,{peopleReputation:1});bump(2,{peopleReputation:-1});}
      else if(f.renewRouteKeep){add('原有线路得以保留，顾芸当年期待的直达便利却始终没有完全实现。');bump(0,{mentalPressure:1});}
      else if(f.renewRoutePilot){add('试运行记录显示不同时段的乘客需求确实不同，但频繁换表也给乘客带来困扰。');bump(0,{workAbility:1});}
      break;
    case 'renew_route_3':
      if(f.renewRouteReopen){add('补充调查保存了调整前后的两套数据，你们不必只用最初的调查解释变化。');bump(0,{mentalPressure:-1});}
      else if(f.renewRouteSupplement){add('补充服务解决了一些具体困难，但后续资源变化让原有安排难以全部维持。');bump(1,{mentalPressure:1});}
      else if(f.renewRouteWait){add('那份保留的意见终于被重新调阅。你知道它在旧评估里一直只是未解决事项。');bump(0,{reputation:-1});}
      break;
    case 'renew_route_4':
      if(f.renewRouteHonest)add('你曾经参与的分阶段评价仍能解释那些年的变化，但不能替今天的乘客发言。');
      else if(f.renewRouteForward)add('现在的班次表已由新团队调整过，你认不全其中的新站名。');
      else if(f.renewRouteHandoff)add('后来几次线路变动你都没有参与，这一次只是普通乘客。');
      if(f.renewRouteWait)add('顾芸仍记得那次等待，不过她现在关注的是下一站的换乘。');
      break;
    case 'renew_credit_2':
      if(f.renewCreditShared){add('两年前署名更正的记录仍在，沈宁愿意讨论新的合作，但更希望工作条件由团队共同确认。');bump(1,{mentalPressure:-1});}
      else if(f.renewCreditInternal){add('那份内部贡献记录后来没有出现在公开交流材料中，沈宁带来了自己保存的原稿。');bump(1,{mentalPressure:1});}
      else if(f.renewCreditTaken){add('你曾经答应的推荐至今没有落实。沈宁把岗位邀请放在桌上：“这次我想自己决定。”');bump(0,{positionWeight:-1});bump(2,{mentalPressure:2});}
      break;
    case 'renew_credit_3':
      if(f.renewCreditRelease)add('沈宁后来在新的岗位承担了独立工作，今天的邀请来自主办方，而非你。');
      else if(f.renewCreditTerms)add('那次公开讨论留下的分工记录，也成为这次交流的材料之一。');
      else if(f.renewCreditDistance){add('你们上次见面停留在交付安排，此后很少有机会谈论个人发展。');bump(0,{mentalPressure:1});}
      if(f.renewCreditTaken){add('原稿与公开署名不一致的问题仍需说明。');bump(0,{reputation:-1});}
      if(f.teamLegacyDocumented){add('许砚的交接记录也提醒你：贡献不能只记在一个人的履历里。');bump(0,{workAbility:1});}
      break;
    case 'renew_shop_2':
      if(f.renewShopGuide){add('许姨保留了你当年写下的咨询渠道，异议材料也是通过那个渠道提交的。');bump(0,{mentalPressure:-1});}
      else if(f.renewShopRefer)add('她知道你没有参与原案审核，这次只是想弄清可以查到什么。');
      else if(f.renewShopPromise){add('她把当时的话理解为办理承诺，而你那时并没有查明主管部门的结论。');bump(2,{mentalPressure:1});bump(0,{reputation:-1});}
      break;
    case 'renew_shop_3':
      if(f.renewShopRecord)add('她把当年取得的办理记录和老店照片放在同一个文件袋里。');
      else if(f.renewShopBoundary)add('后来是否提交异议由她自行决定，你们没有再把私人往来变成公务。');
      else if(f.renewShopApology)add('那次谈话之后，她不再把没有得到的解释算成你一定能兑现的承诺。');
      if(f.renewShopPromise)add('她仍记得你当初那句含糊的答复。');
      if(f.receiptLegacyVerified||f.crossResolved){add('你想起旧城档案复核时留下的待查记录，知道个人经历不能替代正式事实。');bump(1,{workAbility:1});}
      break;
    case 'renew_window_2':
      if(f.renewWindowInclusive){add('当年保留的纸表使一部分缺失申请有据可查，重复录入的工时也有记录。');bump(0,{mentalPressure:-1});}
      else if(f.renewWindowPilot){add('短期辅导台结束后，部分居民仍然需要线下协助。');bump(1,{peopleReputation:1});}
      else if(f.renewWindowExcluded){add('那年取消人工入口后，连纸质申请的原始记录也不完整。');bump(0,{reputation:-1});bump(2,{risk:2});}
      break;
    case 'renew_window_3':
      if(f.renewWindowTruth){add('两年前修订过的覆盖率口径仍留在档案里。');bump(0,{mentalPressure:-1});}
      else if(f.renewWindowPhased){add('分批修复清单里仍有几项超期未结。');bump(0,{mentalPressure:1});}
      else if(f.renewWindowPaperOnly){add('旧报表没有记录的居民仍需补充核查，不能因为大厅换了布置就视作已经解决。');bump(0,{mentalPressure:2});}
      if(f.receiptLegacyVerified||f.crossResolved){add('你记得旧档案复核时使用的证据目录，可以用同样的方法区分已结与未结事项。');bump(0,{workAbility:1});}
      break;
    case 'renew_repair_2':
      if(f.renewRepairMaintain){add('当初的维修责任表仍在，只是有几处配件供应需要更新。');bump(0,{mentalPressure:-1});}
      else if(f.renewRepairPhased){add('分批验收时标出的缺项已经成为复核起点。');bump(1,{workAbility:1});}
      else if(f.renewRepairFast){add('当年未移交的配件清单成了这次追查的难点。');bump(0,{mentalPressure:2});bump(2,{risk:2});}
      break;
    case 'renew_repair_3':
      if(f.renewRepairAccountable){add('两年前梳理出的维修记录能支持本次分类。');bump(0,{mentalPressure:-1});}
      else if(f.renewRepairService){add('先恢复服务的做法解决了部分急需，却没有覆盖所有旧设备。');bump(0,{mentalPressure:1});}
      else if(f.renewRepairOmitted){add('报表上被省略的故障记录现在还没有补齐。');bump(2,{mentalPressure:2});}
      if(f.teamLegacyDocumented){add('许砚曾经整理的交接方法也适用于这批设备的维护记录。');bump(1,{workAbility:1});}
      break;
    case 'renew_home_2':
      if(f.renewHomeShared){add('过去的分工让一部分约定真正落实，但新的日程仍需要协商。');bump(0,{mentalPressure:-1});}
      else if(f.renewHomeSupport){add('外部协助解决了部分事务，却没有代替彼此沟通。');bump(1,{familyPressure:-1});}
      else if(f.renewHomeDeferred){add('家人记得那段独自安排事务的时间，暂时不愿再把计划寄托在一句“忙完再说”上。');bump(2,{mentalPressure:2});}
      break;
    case 'renew_home_3':
      if(f.renewHomePromise)add('旧日历上还有你们写下的明确约定。');
      else if(f.renewHomeSpace)add('各自安排的习惯已经成为日常，这次邀请不是必须参加的任务。');
      else if(f.renewHomeRepair){add('补救承诺并没有抹去所有失约，不过你们终于能够谈论那些事。');bump(2,{eq:1});}
      if(f.familyClinicRepair||f.familyClinicRoutine){add('以前商量过的陪诊安排，也让今天的生活边界更加清楚。');bump(0,{familyPressure:-1});}
      break;
    case 'arc_receipt_open_3':
      if(f.receiptPremature){out.text='老赵寄来一张新住址的明信片。你知道他终于搬进了新房，却不能因此证明其他住户的材料都已齐全。周岚打来电话，提醒你不要把那次先行结项当成完整的验收案例。';bump(0,{integrity:1,mentalPressure:2});}
      else if(f.receiptProof)add('那次延期留下的补证清单，后来成为同事们核查缺页的依据。');
      break;
    case 'arc_receipt_quiet_3':
      if(f.receiptRepair){out.text='五年后，你在旧小区楼梯口遇见老赵。他记得后来逐户核查的工作人员，但新一轮安置还有几户未核清。周岚调往别处后，旧名单仍需有人接手。';bump(0,{mentalPressure:-1});}
      else if(f.receiptContinued){add('周岚当年调离窗口时保留了原名单；那份内部说明并不能替代逐户确认。');bump(0,{mentalPressure:2});}
      break;
    case 'arc_receipt_legacy_4':
      if(f.receiptTeaching)add('当年的培训案例也在档案里，如今需要核对它与实际执行有没有出入。');
      else if(f.receiptHome)add('当年你把周末留给家人，此次也只准备承担可以明确交接的部分。');
      else if(f.receiptReopened)add('你们上次重访后留下的待查名单仍有几项没有反馈。');
      else if(f.receiptFutureRule)add('新项目的逐户登记办法已经写进流程，但旧案仍不能据此视为办结。');
      if(f.receiptPremature||f.receiptContinued){add('过去未完整披露的材料必须单独说明，不能用今天的好评价替代历史证据。');bump(0,{mentalPressure:2});}
      if(f.crossResolved){add('联合会商的责任清单可以作为移交模板。');bump(1,{workAbility:1});}
      if(f.teamLegacyDocumented){add('许砚交接本里的复核方法也派上了用场。');bump(0,{workAbility:1});}
      break;
    case 'arc_classmate_open_3':
      if(f.classmateReportHelp)add('那份经独立审核的报表，至今还保存在企业的公开记录里。');
      else if(f.classmateAccountant)add('他请来的会计建立了新的账务流程，不再事事询问你。');
      break;
    case 'arc_classmate_favor_3':
      if(f.classmateDisclosed){add('你当年已经说明请托并申请回避，此次询问应以那份记录为准。');bump(0,{mentalPressure:-2});}
      else if(f.classmateConcealed){add('前次复核中没有披露的往来仍是问题，新的询问并不意味着旧事已经过去。');bump(1,{risk:3,heat:2});}
      break;
    case 'arc_classmate_boundary_3':
      if(f.classmateMarketInfo)add('他把当年自己比较的服务报价留了下来，后来习惯了独立作决定。');
      else if(f.classmatePrivateOnly)add('那次你没有替他经营企业，他也渐渐习惯把工作和友情分开。');
      break;
    case 'arc_classmate_legacy_4':
      if(f.classmateCaseShared)add('你曾将企业经历写成公开案例，他希望这次不要把私人谈话也变成工作材料。');
      else if(f.classmateFriendship||f.classmateRenewed)add('你们后来把往来留在了生活里，今天也没有新的业务请求。');
      else if(f.classmateLaterDisclosure)add('你曾主动交代旧日请托，相关处理仍应以正式记录为准。');
      else if(f.classmateStillConcealed){add('你们仍有没有说清的往来，这顿饭无法替代正式说明。');bump(0,{mentalPressure:2});bump(1,{risk:2});}
      else if(f.classmateFarewell)add('多年没有联系后，这次见面也不意味着必须恢复过去的亲密关系。');
      if(f.ventureDeclared||f.ventureHidden){add('过去私人投资的申报问题也提醒你，关系与工作必须有可核查的边界。');bump(2,{integrity:1});}
      if(f.crossResolved)add('你记得联合会商时建立的回避和证据规则。');
      break;
    case 'arc_team_shared_3':
      if(f.teamRotationSupported){add('当年外出锻炼留下的工作记录，这次也一并送来了。');bump(0,{workAbility:1});}
      else if(f.teamRotationDeferred){add('那次错过的专项工作没有补回来。许砚后来自己找到了新的学习机会。');bump(0,{mentalPressure:1});}
      break;
    case 'arc_team_deferred_3':
      if(f.teamRosterReformed){out.text='五年后，许砚作为另一单位的业务负责人参加会商。你认出他带来的轮值表：那份曾经核对过的调休制度，后来被他带到了新岗位。他结束会议后留下来，想与你谈谈旧制度的不足。';bump(0,{mentalPressure:-1});}
      else if(f.teamRosterUnchanged){add('那次单独批准的调休没有改变后来新人的处境。他没有忘记这一点。');bump(0,{mentalPressure:1});}
      break;
    case 'arc_team_legacy_4': {
      const p=this.state.player;
      const contact=(p.contacts||[]).find(c=>c.id==='arc_xuyan'||c.legacyId==='arc_xuyan');
      if(f.teamRecommended)add('许砚记得你在推荐表上同时写了成绩和短板。');
      else if(f.teamIndependent)add('你当年没有插手竞聘，他后来凭自己的工作记录通过考察。');
      else if(f.teamReconciled)add('当年的那次谈话没有抹去旧事，却使你们重新有了讨论问题的可能。');
      else if(f.teamDistance)add('你们过去保持的距离仍在，这次联系仅限于业务交接。');
      if(contact&&Number(contact.trust)<35){add('他没有把私人关系当作工作背书，只希望核对有据可查的事实。');bump(0,{mentalPressure:1});}
      if(f.crossResolved){add('联合会商留下的证据和责任清单也可以成为这次交接的参考。');bump(0,{workAbility:1});}
      if(f.familyClinicRoutine||f.familyClinicRepair){add('你也记得，可靠的交接才能让同事按时回家。');bump(1,{familyPressure:-1});}
      break;
    }
    case 'ent259':
    case 'arc_mortgage_3':
      if(f.mortgageBudgeted) add('当年一起做的预算仍放在账本里，你们习惯先留出应急的钱。');
      if(f.mortgageIncomePlan) add('你想起当年核对兼职限制的经历，额外收入不能成为还款计划的唯一支柱。');
      if(f.parentCaring||f.parentShared){add('家里的照护支出也需要预留资金。');bump(0,{mentalPressure:1});}
      break;
    case 'ent295':
      if(f.parentCareSelf){out.text='两年过去，你手机里设置的服药闹钟越来越多。最近一次值班交接时，同事发现你在记录本上写错了日期。父母的照护仍需继续，你也需要恢复自己的生活。';bump(0,{mentalPressure:-1});}
      else if(f.parentCareProfessional){out.text='护工已经来了两年。你每周核对用药记录，但最近收到费用调整通知。照护没有停下来，你们需要重新考虑时间和金钱的分配。';bump(1,{familyPressure:-1});}
      break;
    case 'enl216':
      if(f.parentCareCover){add('那次临时补班之后，大家开始把无法赴约的日期提前标出。');bump(0,{familyPressure:-1});}
      else if(f.parentCareHire){add('当年共同请的护工减轻了体力负担，但各家的支付能力发生了变化。');bump(1,{mentalPressure:-1});}
      else if(f.parentCareRigid){add('那次坚持轮班原约定后，有位亲属很少再主动联系。你意识到制度也需要应对例外。');bump(2,{familyPressure:2});}
      else if(f.parentLongTerm){add('你已经承认照护是长期的事情，不必每次都把自己的生活让给突发安排。');bump(1,{familyPressure:-1});}
      else if(f.parentRecovered){add('你曾经试着逐步找回自己的生活，父母也希望你能留出一些自己的时间。');bump(0,{mentalPressure:-1});}
      if(f.mortgage){add('账本上的住房贷款和照护支出还在争夺同一笔应急金。');bump(2,{mentalPressure:1});}
      if(f.familyClinicRoutine||f.familyClinicRepair){add('过去和伴侣建立的陪诊安排，让你知道如何把责任写进可执行的日程。');bump(0,{eq:1});}
      break;
    case 'arc_family_clinic_3':
      if(f.familyClinicRoutine){
        add('两年前你们选择把共同时间固定下来。多数约定终于兑现，但有时为了守住日程，你也不得不请团队替你承担临时任务。');
        result(0,'你们留下稳定的共同时间，也把可交接的事项真正交给团队，不再临时把重担转嫁给某一个人。');
        bump(0,{workAbility:1,mentalPressure:1});
      }else if(f.familyClinicNegotiated){
        add('两年前你们决定保留弹性。很多时候商量的确奏效，但也有几次事情临头，谁都不愿先提出自己的困难。');
        result(1,'你们约好每次变动都主动确认彼此的安排，不把“弹性”变成由一个人默默承担。');
        bump(1,{familyPressure:-1});
      }else if(f.familyClinicRepair){
        add('你曾连续错过复诊，后来第一次认真请假陪伴。伴侣记得那个转折，也记得修复信任不能靠一次补偿。');
        result(0,'你把持续陪伴和交接工作做到实处，伴侣终于不必通过一张检查单来提醒你记住约定。');
        bump(0,{familyPressure:-1,positionWeight:-1});
      }else if(f.familyClinicRebalanced){
        add('你当年没答应每次陪诊，却开始主动做家务、安排时间。几年下来，分担并不总是对半，但两人都看得见对方的努力。');
        result(1,'你们继续用具体分工讨论生活：有人负责复诊，有人负责接送，也允许必要时交换。');
        bump(1,{eq:1});
      }
      if(f.teamDeferred && !f.teamSharedFollowed && !f.teamDeferredFollowed){
        add('与此同时，科室的值班表仍有空缺；如果你把家庭压力全推给年轻同事，旧矛盾也不会凭空消失。');
        bump(0,{positionWeight:-1,mentalPressure:2});
      }else if(f.teamShared || f.teamSharedFollowed){
        add('你想起当年与许砚一起重排值班表的经历。可靠的交接原来既能保护团队，也能让家里不必一遍遍等你。');
        bump(0,{workAbility:1});
      }
      break;
    case 'ent306':
      if(f.mentorVisited) add('你想起当年赶去病房时，郑教授从枕头下拿出一张写满笔记的纸。你并不知道他后来又读过多少遍。');
      else if(f.mentorCalled) add('你想起那通仓促的电话。虽然没有赶去病房，你还是把当时没能说完的问题记在本子上。');
      else if(f.mentorAbsent) { add('那次你答应改天去，后来一拖再拖。讲义的最后一行字让你明白，有些话不必等对方先开口。');bump(1,{mentalPressure:1}); }
      break;
    case 'ent307':
      if(f.mentorLetdown){
        out.text='你答应郑教授的讲座最后没能认真准备。研究所来信要求你解释几段引用材料的来源。你终于有机会把此前的敷衍补回来，但必须为迟延负责。';
        result(0,'你把未核实的资料标明作废，补交可靠的一手案例，并承认原先准备不足。');
        result(1,'团队一起补证，署名中也写清了最初那次失误。');
        bump(0,{integrity:1,background:-1});
      } else if(f.mentorLecture){
        add('你记得那次讲座结束时，有年轻研究员追着你问了三个具体问题。');
        result(0,'你逐项核实当时被追问的资料，研究所据此修订了公开案例。');
      }
      break;
    case 'arc_life_career_2':
      if(f.lifeCareerLead){add('你当年从重点专班带回来的不只是项目结果，还有一套跨部门协作的办法。新负责人最关心的是：这套办法能不能离开你继续运转。');result(0,'你把专班的协作机制和风险清单一起交给接班人，项目不再只靠你一个人维持。');result(1,'你决定继续盯住最关键的项目节点，但同时明确哪些协调工作必须由团队共同承担。');bump(0,{peopleReputation:1});bump(1,{mentalPressure:1,workAbility:1});}
      else if(f.lifeCareerExpert){add('你留在专业岗位后积累的标准和流程，已经被几个业务科室沿用。新负责人希望知道，哪些判断必须由专业人员把关。');result(0,'你把关键判断标准和常见错误写进交接手册，让后来者能够独立处理大部分业务。');result(1,'你继续把关最复杂的专业问题，同时培养一名能够接手核心工作的同事。');bump(0,{integrity:1,workAbility:1});bump(1,{workAbility:1,mentalPressure:1});}
      break;
    case 'arc_life_career_3':
      if(f.lifeCareerHandoff){add('两年前你选择把方法和风险完整交出去。如今新团队已经能够独立运转，你终于有机会判断：自己的下一段价值是否还必须来自亲自负责。');result(0,'手册经过几轮修订，后来者保留了你的方法，也改掉了其中不再适用的部分。');result(1,'你把更多时间交还给生活，不再把团队的每一个问题都当成自己的责任。');bump(0,{peopleReputation:1});}
      else if(f.lifeCareerContinued){add('两年前你选择继续负责核心部分。项目确实走得更稳，但团队也逐渐习惯了遇到难题就等你拍板。');result(0,'你把多年经验拆成可传授的判断方法，开始让团队在没有你时也能作出决定。');result(1,'你主动退出部分日常决策，把精力留给真正需要专业判断的难题。');bump(0,{workAbility:1});bump(1,{familyPressure:-1,mentalPressure:-1});}
      break;
    case 'arc_life_integrity_2':
      if(f.lifeIntegrityOpen){add('当年的原始材料和差异说明一直在案。审查人员已经看过你当时主动披露的记录，现在更想知道你是否愿意说明决策过程中的不足。');result(0,'你把当时的依据、后续修正和仍未解决的问题放在同一份说明里。');result(1,'你按程序提交完整材料，对暂时无法核实的部分明确保留意见。');bump(0,{peopleReputation:1});}
      else if(f.lifeIntegrityQuiet){add('你当年保留了原始材料，却没有把差异主动推到台前。如今审查人员重新找到那一页，决定从头核对。');result(0,'你不再沿用当年的简略说明，把差异、原始材料和判断过程一并交出。');result(1,'你提交原始记录，并明确说明当年哪些判断尚缺乏充分依据。');bump(0,{mentalPressure:1,integrity:1});}
      break;
    case 'arc_life_integrity_3':
      if(f.lifeIntegrityFullDisclosure){add('两年前你完整解释了判断依据，也承认当时的不足。档案整理人员希望把这段经历作为一次可供后来者复盘的案例。');result(0,'案例同时保留了原始错误、修正过程和责任边界，没有把复盘包装成个人功劳。');result(1,'你把档案交给新团队，并提醒他们可以用新的标准重新审视旧结论。');bump(0,{integrity:1});}
      else if(f.lifeIntegrityPending){add('两年前仍有几项材料没有核清。五年后的档案整理要求你说明：哪些问题已经解决，哪些只是被暂时搁置。');result(0,'你补齐能够核实的证据，并把仍未解决的事项单独列入后续清单。');result(1,'你将未核实事项连同原始材料完整移交，不用一个仓促结论替代事实。');bump(1,{integrity:1});}
      break;
    case 'arc_life_family_2':
      if(f.lifeFamilyPresent){add('你当年守住了那次重要约定。家人记得你确实到场，但也希望这种陪伴不必每次都靠临时协调和同事替班。');result(0,'你们把固定陪伴时间写进日历，并提前安排工作交接，不再等冲突发生后才补救。');result(1,'你们重新分配家务和照护责任，让每个人都有能够兑现的时间。');bump(0,{familyPressure:-1});}
      else if(f.lifeFamilyCareer){add('你当年接受了临时重点任务。任务后来有了结果，但家人更在意的是：下一次冲突出现时，你是否仍然只能说“忙完这一阵”。');result(0,'你与家人重新约定固定时间，并把工作交接提前纳入安排。');result(1,'你们重新分配家庭责任，不再把缺席后的补偿当作长期办法。');bump(0,{familyPressure:-1,mentalPressure:-1});}
      break;
    case 'arc_life_family_3':
      if(f.lifeFamilySchedule){add('两年前你们约定了固定的共同时间。五年后，家人的生活各自展开，真正重要的是这份约定能否随着每个人的变化继续调整。');result(0,'你们保留共同时间，也允许彼此有独立安排，家庭不再依靠某一个人单方面牺牲。');result(1,'你把这些年的变化写下来，提醒自己持续沟通比事后补偿更重要。');bump(0,{eq:1});}
      else if(f.lifeFamilyShared){add('两年前你们重新分配了家庭责任。五年后，分工已经不再是表格上的名字，而是每个人都知道何时该主动补位。');result(0,'你们继续共同安排时间，也尊重彼此的独立生活。');result(1,'你把家庭分工的变化记下来，准备在下一次生活节奏改变时重新协商。');bump(1,{familyPressure:-1});}
      break;
    case 'arc_life_network_2':
      if(f.lifeNetworkPublic){add('你当年组织的公开答疑留下了可查阅的问题清单。基层联络员这次带来的不是一封求助信，而是一份已经尝试过、仍然卡在责任交界处的办理记录。');result(0,'你逐项核对政策变化，公开更新责任窗口和答复时限。');result(1,'你把问题转入正式窗口，并确认后续答复不再依赖私人联系。');bump(0,{peopleReputation:1});}
      else if(f.lifeNetworkSelective){add('你当年建立了部门联络清单。两年后，对方带来的问题显示：知道找谁还不够，还需要知道谁负责答复、多久能够得到结果。');result(0,'你为联络清单增加更新时间、责任人和反馈入口。');result(1,'你把联络机制交给正式窗口，避免一个私人号码成为所有问题的唯一入口。');bump(1,{mentalPressure:-1});}
      break;
    case 'arc_life_network_3':
      if(f.lifeNetworkPublished){add('两年前更新的公开台账已经被多个窗口使用。五年后，新同事接手时，最有价值的不是名单本身，而是每条问题都能找到处理过程。');result(0,'新团队沿用公开反馈机制，并把长期未解决的问题保留在台账中。');result(1,'你保留必要的私人联系，但明确私人关系不能替代公开办理机制。');bump(0,{peopleReputation:1});}
      else if(f.lifeNetworkTransferred){add('两年前你把联络机制交给正式窗口。五年后，名单上的名字换了几轮，问题仍然能够沿着公开流程找到负责人。');result(0,'你把制度移交记录和常见问题一并交给新团队。');result(1,'你保留真诚的私人联系，同时不再替正式制度承担全部责任。');bump(1,{familyPressure:-1});}
      break;
    case 'arc_life_confluence_1': {
      const notes=[];
      if(f.lifeCareerLead)notes.push('你曾在重点专班承担跨部门责任');else if(f.lifeCareerExpert)notes.push('你曾选择深耕专业岗位');
      if(f.lifeIntegrityOpen)notes.push('旧项目的差异曾被你主动公开');else if(f.lifeIntegrityQuiet)notes.push('旧项目的差异曾被暂时留在程序内部');
      if(f.lifeFamilyPresent)notes.push('你曾为家人的重要约定安排工作交接');else if(f.lifeFamilyCareer)notes.push('你曾为临时任务缺席家庭约定');
      if(f.lifeNetworkPublic)notes.push('你曾把基层问题整理成公开答疑');else if(f.lifeNetworkSelective)notes.push('你曾建立跨部门联络清单');
      if(notes.length)add('桌上的材料让你想起此前几次选择：'+notes.join('；')+'。这一次，任何一项责任都不能只靠个人记忆维持。');
      if(f.lifeIntegrityQuiet)bump(0,{mentalPressure:1});
      if(f.lifeFamilyCareer)bump(1,{familyPressure:-1});
      if(f.lifeNetworkSelective)bump(0,{peopleReputation:1});
      break;
    }
    case 'arc_life_confluence_2':
      if(f.lifeConfluenceLegacy){add('你当年选择把分工和复盘方法交给后来者。新团队没有照抄你的结论，而是沿着留下的证据继续推进。');result(0,'清单被归档前，后来者补上了新的责任人和复核日期，旧问题终于不再只属于某一个人。');result(1,'你保留未解决事项的记录，也允许新团队根据新情况重新作出判断。');}
      else if(f.lifeConfluenceUnresolved){add('你当年选择保留未解决事项，没有把暂缓写成结案。三年后，新的负责人带着补充材料回来，要求把旧判断重新放到桌面上。');result(0,'你把复盘方法交给新团队，连同当年没有解决的部分一起说明。');result(1,'你保留证据和未决事项，允许后来者重新判断，而不是替未来写下结论。');}
      break;
  }
  return out;
};
// 四条人生路线画像：只根据已有真实状态计算，不写入存档、不强迫玩家选职业流派。
GameEngine.prototype.getLifePathProfile = function() {
  const p=this.state.player,h=this.state.hidden,a=this.state.attrs,f=p.flags||{};
  const contacts=Array.isArray(p.contacts)?p.contacts:[];
  const trusted=contacts.filter(c=>!c.enemy&&c.status!=='rival'&&Number(c.trust||c.relation||0)>=65).length;
  const bounded = value => Math.round(Math.max(0, Math.min(100, value)));
  const scores={
    career:bounded((p.leadershipRank||0)*5+(p.promotions||0)*4+(p.unitLevel||0)*8+(h.workAbility||0)*0.22+(p.unitUpgrades||0)*3+(f.lifeCareerReviewed?6:0)),
    integrity:bounded((h.integrity||0)*0.55+Math.max(0,80-(h.risk||0))*0.25+(f.refusedBribe?8:0)+(f.reportedOthers?4:0)+(f.tookResponsibility?4:0)+(f.lifeIntegrityReviewed?8:0)+(f.lifeIntegrityOpen?3:0)-(this.hasCorruptFlag(f)?18:0)),
    family:bounded((a.family||0)*3.2+Math.max(0,75-(h.familyPressure||0))*0.48+(p.childEducation||0)*2+(p.childCompany||0)*2+(p.isMarried?8:0)+(p.hasChildren?6:0)+(f.lifeFamilyReviewed?10:0)+(f.lifeFamilyPresent?4:0)-(f.lifeFamilyCareer?3:0)),
    network:bounded(trusted*8+(p.peopleReputation ?? 50)*0.32+(p.reputation ?? 50)*0.12+(f.peopleEventCount||0)*2+(f.lifeNetworkReviewed?8:0)+(f.lifeNetworkPublic?4:0))
  };
  const routes=[
    {id:'career',name:'仕途发展',subtitle:'晋升、历练与组织信任',score:scores.career,detail:scores.career>=70?'已形成持续的职业积累':scores.career>=40?'正在积累岗位经验':'仍有较大的成长空间'},
    {id:'integrity',name:'原则与担当',subtitle:'廉洁、责任与长期声誉',score:scores.integrity,detail:scores.integrity>=70?'原则已成为重要的人生底色':scores.integrity>=40?'仍在关键选择中建立边界':'过去的选择留下了需要面对的代价'},
    {id:'family',name:'家庭经营',subtitle:'陪伴、亲情与共同成长',score:scores.family,detail:scores.family>=70?'家庭关系形成了稳定支撑':scores.family>=40?'家庭与事业仍在寻找平衡':'需要为重要关系留出更多时间'},
    {id:'network',name:'人脉与社会连接',subtitle:'互信、互惠与群众口碑',score:scores.network,detail:scores.network>=70?'已经建立较稳固的社会连接':scores.network>=40?'关系网络正在逐步形成':'值得投入时间建立可靠的关系'}
  ];
  return {scores,routes,dominant:routes.slice().sort((a,b)=>b.score-a.score)[0].id,balanced:Math.max(...Object.values(scores))-Math.min(...Object.values(scores))<=18};
};
// 人生交汇：不是独立随机抽奖，必须由至少两条已走过的人物线共同触发。
GameEngine.prototype.getCrossroadsEvent = function() {
    const p=this.state.player, f=p.flags||{};
    const hasReceipt=!!(f.receiptOpen||f.receiptQuiet);
    const hasTeam=!!(f.teamShared||f.teamDeferred);
    const hasClassmate=!!(f.classmateOpen||f.classmateFavor||f.classmateBoundaries);
    if (!hasReceipt || !(hasTeam || hasClassmate)) return null;
    const origin=GameData.events.find(e=>e.id==='arc_crossroads_1');
    if (!origin) return null;
    const note=[];
    if (f.receiptOpen) note.push('你当年选择公开复核旧回执，其中几页材料至今保留着你的批注');
    else note.push('你当年让旧回执通过内部协调处理，如今有些细节还需要重新解释');
    if (hasTeam) note.push(f.teamShared ? '许砚记得你主动分担值班的那一年' : '许砚记得那份一直拖到很晚才批准的调休单');
    if (hasClassmate) note.push(f.classmateFavor ? '林默曾得到过你的私下关照，你知道这次必须慎重处理关系' : '林默的创业申请也曾让你思考公务与私人友情的界限');
    if (f.familyClinicAbsent) note.push('今晚伴侣还在等你回家，电话屏幕亮了两次');
    else if (f.familyClinicPresent) note.push('你答应过伴侣，不会再让每一次重要约定都让位于加班');
    const records=hasTeam?'许砚交接过的值班记录':'几份跨部门移交记录';
    const project=hasClassmate?'与林默那批企业申报同期的项目材料':'新一轮政策项目的申请材料';
    const scene=origin.text.replace('后来调整的科室值班表和社会机构的申请材料',records+'和'+project);
    const event={...origin,text:scene+' '+note.join('；')+'。',choices:origin.choices.map(c=>({...c,effects:{...c.effects}}))};
    // 上一幕不是装饰：既往隐瞒的旧回执，再次公开承担更高的职业代价；
    // 借私人关系获利的玩家继续遮掩时，调查风险更高。
    if (f.receiptQuiet) {
      Object.assign(event.choices[0].effects,{mentalPressure:9,reputation:-2,risk:-4});
    }
    if (f.classmateFavor) {
      event.choices[2].effects.risk+=5;
      event.choices[2].effects.heat=4;
    }
    if (f.teamShared) {
      event.choices[1].effects.contactDelta={target:'arc_xuyan',trust:4,relation:2};
    }
    if (f.familyClinicAbsent) event.choices[0].effects.familyPressure+=4;
    return event;
};
// 子方法 9：年度事件选择（里程碑/政策项目/入口注入/刚性链/随机池）+ 赌博年分支。
// 返回 { event, aborted }：aborted=true 表示 e761 逮捕/出逃接管，编排主体须立即终止年度。
GameEngine.prototype._rcy_annualEventSelection = function() {
    const s = this.state; const p = s.player;
    // 年度事件（随机事件池抽取，auto/sudden 立即结算）
    // 平静年限流控制：最多连续两年"平静的一年"，第三年强制触发事件
    const quietStreak = (p.flags.quietStreak || 0);
    let event = null;
    if(p.passed && p.yearsWorked===1 && !s.currentEvent && !p.seenEvents.includes('e253'))event=GameData.events.find(x=>x.id==='e253')||null;
    // v2.59 里程碑强制触发：工作满 5/10/15/20/25/30 年必达（原靠事件池 1-2% 概率抽奖，多数玩家错过成长节点）
    const MILESTONE_IDS = { 5: 'e087', 10: 'e088', 15: 'e089', 20: 'e090', 25: 'e091', 30: 'e092' };
    const mid = MILESTONE_IDS[p.yearsWorked];
    if (mid && !this.state.currentEvent && !(p.seenEvents || []).includes(mid)) {
      const me = (GameData.events || []).find(ev => ev && ev.id === mid);
      if (me) { p.seenEvents = p.seenEvents || []; p.seenEvents.push(mid); event = me; }
    }
    // v2.63 刚性因果链：flag 存在 → 次年必然触发 next（非概率——触发即因果，玩家选择推进/终止）
    // 覆盖：学历链（mbaApply→ent233→mbaActive→ent234→mbaDegree→ent235）、健康链（healthRisk→ent245→healthCare→ent246→healthTreated→ent247）、调查链（underInvestigation→e646→defied→e648 / selfSurrender→e647）
    // v2.66 修复：赌博年（currentEvent 被赌博事件占用）跳过全部链注入——原实现注入即 push seenEvents 但不展示，链被永久卡死
    if (!event && !this.state.currentEvent) {
      // 刚性推进：flag 在且延迟到期 → 必然触发下一步（seenEvents 去重保证每步只触发一次）
      // v2.64 延迟机制：delay=N 表示 flag 设置后第 N 年才必然触发（事件更合理：预备期 1 年转正、专案每年推进、调查需要时间）
      const RIGID_CHAINS = this.getCausalChainSteps();
      // 完成待兑现的旧选择后，才抽取今年新的故事入口；避免多年后果被覆盖。
      // 逾期最久的旧后果先兑现，同年待办按已承诺的时间顺序排队；
      // 不抢占此前已经创建的政策/里程碑/当前选择事件。
      if (!event) {
        const due=this.getPendingCausalConsequences().find(x=>x.overdue);
        if(due) {
          const next=GameData.events.find(x=>x.id===due.id);
          const ev=due.id==='arc_venture_disclosure_1'?this.getVentureReviewEvent():this.getLifePathEvent(next);
          if(ev){
            if(ev.eventType==='auto'||ev.eventType==='sudden')p.seenEvents.push(due.id);
            event=ev;
          }
        }
      }
      // 项目仍占用一个年度槽，但不能无限挤压已到期的历史责任。
      if(!event){
        const policyEvent=(this.preparePolicyOpinionCrisisEvent?this.preparePolicyOpinionCrisisEvent():null)||(this.getPolicyProjectDecisionEvent?this.getPolicyProjectDecisionEvent():null);
        if(policyEvent)event=policyEvent;
      }
      // 仅在历史后果兑现后抽取新健康/学历故事，避免覆盖已到期剧情。
      // 健康链入口注入：38 岁后每年 4% 查出体检异常（'遇到'是概率，查出后后续必然）
      // 不当回事/硬扛（healthHardhead）玩家：42 岁后 8%/年身体再次报警（身体会找你算账）
      if (!event && !p.flags.healthHardhead && !p.flags.healthRisk && !p.flags.healthCare && !p.flags.healthTreated && !p.flags.healthStable && p.age >= 38 && p.age <= 58 && !(p.seenEvents || []).includes('ent244') && this.randf() < 0.04) {
        const evH = (GameData.events || []).find(x => x && x.id === 'ent244');
        if (evH) { p.seenEvents = p.seenEvents || []; if (evH.eventType === 'auto' || evH.eventType === 'sudden') p.seenEvents.push('ent244'); event = evH; } // v2.67 choice 不预 push（由 handleEventChoice 完成时 push）——刷新后入口可重新注入
      }
      // 学历链入口注入：35 岁前每年 3% 遇到报考念头（约 1/3 玩家会遇见，选择权在玩家）
      if (!event && !p.flags.mbaApply && !p.flags.mbaActive && !p.flags.mbaDegree && !(p.seenEvents || []).includes('ent232') && p.age < 35 && this.randf() < 0.03) {
        const ev0 = (GameData.events || []).find(x => x && x.id === 'ent232');
        if (ev0) { p.seenEvents = p.seenEvents || []; if (ev0.eventType === 'auto' || ev0.eventType === 'sudden') p.seenEvents.push('ent232'); event = ev0; }
      }
      // 人物故事不是平行孤岛：完成旧回执 + 许砚/林默的任一路线后，
      // 可以在同一件事情里重新相遇；后续 2 年和 5 年兑现，不覆盖其他旧案。
      if (!event && p.age >= 30 && p.age <= 49 && p.yearsWorked >= 7
          && !(p.seenEvents||[]).includes('arc_crossroads_1')
          && !p.flags.crossOpen && !p.flags.crossPhase && !p.flags.crossSeal
          && this.randf() < 0.36) {
        event=this.getCrossroadsEvent();
      }
      // 四条人生路线：仅在年度槽空闲时播种一次，后续由刚性链按年龄推进。
      const lifeSeen=p.seenEvents||[], lifeFlags=p.flags||{};
      if (!event && p.yearsWorked>=3 && p.yearsWorked<=16 && !lifeSeen.includes('arc_life_career_1') && this.randf()<0.09) event=GameData.events.find(x=>x.id==='arc_life_career_1')||null;
      if (!event && p.yearsWorked>=4 && p.yearsWorked<=18 && !lifeSeen.includes('arc_life_integrity_1') && this.randf()<0.09) event=GameData.events.find(x=>x.id==='arc_life_integrity_1')||null;
      if (!event && p.isMarried && p.age>=28 && p.age<=48 && !lifeSeen.includes('arc_life_family_1') && this.randf()<0.10) event=GameData.events.find(x=>x.id==='arc_life_family_1')||null;
      if (!event && p.yearsWorked>=3 && p.yearsWorked<=20 && !lifeSeen.includes('arc_life_network_1') && this.randf()<0.09) event=GameData.events.find(x=>x.id==='arc_life_network_1')||null;
      const completedLifeRoutes=['lifeCareerReviewed','lifeIntegrityReviewed','lifeFamilyReviewed','lifeNetworkReviewed'].filter(k=>lifeFlags[k]).length;
      if (!event && completedLifeRoutes>=2 && p.age>=32 && p.age<=58 && !lifeSeen.includes('arc_life_confluence_1')) event=this.getLifePathEvent(GameData.events.find(x=>x.id==='arc_life_confluence_1'))||null;
      // 档案柜里的回执：基层服务的长期抉择，前 12 年每年有一次进入机会。
      // 同一决策槽不覆盖政策项目/其他刚性事件；开始后结局由 flag 延迟确定。
      if (!event && !p.flags.receiptOpen && !p.flags.receiptQuiet && !(p.seenEvents || []).includes('arc_receipt_1')
          && p.yearsWorked >= 2 && p.yearsWorked <= 12 && this.randf() < 0.15) {
        const first = GameData.events.find(x => x.id === 'arc_receipt_1');
        if (first) event = first;
      }
      // 第二轮：团队交接线（早中期）与伴侣复诊线（婚姻中的长期取舍）。
      // 两条线独立存 flag，只在年度事件槽空闲时进入，后续刚性链不会提前抢占。
      if (!event && !p.flags.teamShared && !p.flags.teamDeferred && !(p.seenEvents || []).includes('arc_team_1')
          && p.age >= 27 && p.age <= 43 && p.yearsWorked >= 3 && this.randf() < 0.12) {
        event = GameData.events.find(x => x.id === 'arc_team_1') || null;
      }
      if (!event && p.isMarried && !p.flags.familyClinicPresent && !p.flags.familyClinicAbsent
          && !(p.seenEvents || []).includes('arc_family_1') && p.age >= 32 && p.age <= 49
          && this.randf() < 0.10) {
        event = GameData.events.find(x => x.id === 'arc_family_1') || null;
      }
      // 林默线：只为尚未遇见的角色增加一次真实机会，不重复刷同一段旧情。
      if (!event && !(p.seenEvents || []).includes('e094') && !p.flags.classmateOpen
          && !p.flags.classmateFavor && !p.flags.classmateBoundaries && p.yearsWorked >= 3
          && p.age >= 26 && p.age <= 45 && this.randf() < 0.08) {
        event = GameData.events.find(x => x.id === 'e094') || null;
      }
      // 可发现的连续人物线：大事件队列空闲时才给玩家遇见重要人物的机会；
      // 不把后续事件直接扔进随机池，不影响已约定的旧事、项目或里程碑。
      // 一局至多引入一位潜在职场对手；是否结怨仍由玩家当下的选择决定。
      const npcSeen=p.seenEvents||[], npcFlags=p.flags||{};
      if (!event && p.isEmployed && p.yearsWorked>=3 && p.yearsWorked<=18 && p.age>=26 && p.age<=48
          && !npcFlags.wangDispute && !npcFlags.directorDispute
          && !npcSeen.includes('ent167') && !npcSeen.includes('ent168') && this.randf()<0.12) {
        event=GameData.events.find(x=>x.id===(this.randf()<0.5?'ent167':'ent168'))||null;
      }
      // 郑教授不是凭空出现的人脉增益：先在公开研讨会结识，再有一年后的重逢。
      if (!event && p.isEmployed && p.yearsWorked>=3 && p.yearsWorked<=18 && p.age>=26 && p.age<=48
          && !npcSeen.includes('ent308') && !npcFlags.mentorMet && !(p.contacts||[]).some(c=>c.id==='mentor'||c.legacyId==='mentor') && this.randf()<0.11) {
        event=GameData.events.find(x=>x.id==='ent308')||null;
      }
      // 旧识成为人生记忆需要时间：五年往来后，偶尔出现一次真实的照护抉择。
      // 只对仍然联系的导师开放，事件本身不宣布生死；终局之前有时间兑现回访。
      if (!event && npcFlags.mentorMet && Number(npcFlags.mentorMet_since)>0
          && p.age>=Math.max(36,Number(npcFlags.mentorMet_since)+5) && p.age<=50
          && !npcSeen.includes('ent177') && !npcFlags.mentorVisited && !npcFlags.mentorCalled && !npcFlags.mentorAbsent
          && (p.contacts||[]).some(c=>(c.id==='mentor'||c.legacyId==='mentor')&&Number(c.relation)>=55)
          && this.randf()<0.10) {
        event=GameData.events.find(x=>x.id==='ent177')||null;
      }
      // v2.66 买房入口注入：28-45 岁每年 2%（买房是重要人生节点——原 weight 8 在 1265 事件池里生涯触发率仅 ~2%）
      if (!event && !p.flags.mortgage && !(p.seenEvents || []).includes('ent257') && p.age >= 28 && p.age <= 45 && this.randf() < 0.02) {
        const evB = (GameData.events || []).find(x => x && x.id === 'ent257');
        if (evB) { p.seenEvents = p.seenEvents || []; if (evB.eventType === 'auto' || evB.eventType === 'sudden') p.seenEvents.push('ent257'); event = evB; }
      }
      // v2.1.68 赡养链入口：50 岁后每年 4% 父母体检出问题（life 50+ 薄档主力内容）
      if (!event && !p.flags.parentIllness && !p.flags.parentCaring && !p.flags.parentRecovered && !p.flags.parentLongTerm && !p.flags.parentShared && !(p.seenEvents || []).includes('ent293') && p.age >= 50 && this.randf() < 0.04) {
        const evP = (GameData.events || []).find(x => x && x.id === 'ent293');
        if (evP) { p.seenEvents = p.seenEvents || []; if (evP.eventType === 'auto' || evP.eventType === 'sudden') p.seenEvents.push('ent293'); event = evP; }
      }
      // v2.1.68 理财暴雷链入口：28 岁后每年 3% 遇到高息理财诱惑
      if (!event && !p.flags.leveragedInvest && !p.flags.leveragedHeavy && !p.flags.investCrash && !p.flags.investLesson && !(p.seenEvents || []).includes('ent296') && p.age >= 28 && this.randf() < 0.03) {
        const evI = (GameData.events || []).find(x => x && x.id === 'ent296');
        if (evI) { p.seenEvents = p.seenEvents || []; if (evI.eventType === 'auto' || evI.eventType === 'sudden') p.seenEvents.push('ent296'); event = evI; }
      }
      // v2.1.68 借调链入口：26-45 岁每年 3% 收到借调函（体制典型上行轨迹）
      if (!event && !p.flags.seconded && !p.flags.secondReview && !p.flags.secondDone && !(p.seenEvents || []).includes('ent299') && p.age >= 26 && p.age <= 45 && this.randf() < 0.03) {
        const evS = (GameData.events || []).find(x => x && x.id === 'ent299');
        if (evS) { p.seenEvents = p.seenEvents || []; if (evS.eventType === 'auto' || evS.eventType === 'sudden') p.seenEvents.push('ent299'); event = evS; }
      }

      // 内容换血后给精修事件有限的展示机会。仅空闲槽，仍复用真实候选池；不绕过门槛或抢占旧事。
      if(!event && !s.currentEvent && this.randf()<0.12){
        const curated=this.getEventPoolSnapshot().filter(x=>x.id.startsWith('renew_'));
        if(curated.length)event=this.weightedPick(curated);
      }
    }
    if (this.state.currentEvent) {
      // 赌博年：choice 槽已被赌博事件占用——普通 auto/sudden 事件照常抽取并立即结算（影响照常发生，不弹窗），
      // 普通 choice 事件跳过（不进 seenEvents，明年仍可抽）；赌博年算"有事件年"
      p.flags.quietStreak = 0;
      const autoEvt = this.generateEvent(this.state.difficulty === 'hardcore'); // v2.70 硬核：赌博年也跳过平静门
      if (autoEvt && (autoEvt.eventType === 'auto' || autoEvt.eventType === 'sudden')) {
        if (this.settleEventOrEscape(autoEvt)) return { event: null, aborted: true }; // e761 交给 UI/模拟器处理
        this.applyEventEffects(autoEvt);
        this.checkEndings();
      }
    } else {
      if (!event) {
        event = this.generateEvent(quietStreak >= (this.state.difficulty === 'hardcore' ? 0 : 2)); // v2.70 硬核：无平静年（每年跳过 50% 平静门，必有事件）
        if (!event && quietStreak >= (this.state.difficulty === 'hardcore' ? 0 : 2)) {
          // 事件池为空时的兜底：一条非平静的叙述事件
          event = { title: '📋 单位组织业务调研，你跟着走访了好几个现场', eventType: 'auto', effects: {} };
        }
        p.flags.quietStreak = event ? 0 : quietStreak + 1;
      } else {
        p.flags.quietStreak = 0; // v2.59 里程碑年算"有事件年"（不累计平静）
      }
      s.currentEvent = event;
      if (event && (event.eventType === 'auto' || event.eventType === 'sudden')) {
        if (this.settleEventOrEscape(event)) return { event: null, aborted: true }; // e761 交给 UI/模拟器处理
        this.applyEventEffects(event);
        s.currentEvent = null; this.checkEndings(); // v2.16 修复：auto/sudden 结算完立即释放 choice 槽，防止后续年份 choice 事件链被永久锁死
      }
    }
    return { event, aborted: false };
  }
// 子方法 10：晋升/降级/基层/里程碑/人生门槛检查 + 年度日志快照与评价
GameEngine.prototype._rcy_yearEndSettlement = function(event) {
    const s = this.state; const p = s.player;
    // 年度结算（赌博年与正常年均执行，保证晋升/降级/历练/里程碑/记录不被事件吞掉）
    if (!p.ending) {
      // 晋升检查：不自动晋升，而是放入待定
      this.checkPromotion();
      this.checkBreakthroughPromotions();
      this.checkCrossLevelPromotion();
      this.checkEndings();
    }
    if (!p.ending) {
      // 检查是否需要降级/平调
      this.checkDemotion();
      // 检查基层历练是否到期
      this.checkGrassrootsReturn();
    }
    this.checkMilestones();
    this.checkLifeGates();
    this.clampAttrs();
    const yearEventTitle = this.state.currentEvent && this.state.currentEvent.title ? this.state.currentEvent.title : (event ? event.title : '平静的一年');
    p.careerLog.push({ year: p.age, event: yearEventTitle, mentalPressure: Math.round(s.hidden.mentalPressure), risk: Math.round(s.hidden.risk), integrity: Math.round(s.hidden.integrity), positionWeight: Math.round(s.hidden.positionWeight), leadershipRank: p.leadershipRank, unitLevel: p.unitLevel, unitName: (p.unit && p.unit.name) || '', reputation: Math.round(p.reputation ?? 50), peopleReputation: Math.round(p.peopleReputation ?? 50), heat: Math.round(p.heat || 0), attrs: { iq: s.attrs.iq, eq: s.attrs.eq, body: s.attrs.body, luck: s.attrs.luck } }); // v2.18 年度快照；v2.21 补民间口碑；v2.1.17 补四维属性（年鉴曲线图）；v2.1.47 补单位名（人生回顾职业路径）
    // 自动保存（v2.16 修复：先生成年度评价再存档，读档后年鉴不丢"年度评价"）
    const evalText = this.getYearEvaluation(s.hidden, p);
    if (evalText) p.careerLog[p.careerLog.length - 1].evaluation = evalText;
    // v2.71 性能：删年度开头重复存档（:634 年度结算后已全量存档，双写合并为 1 次）
  }
// 子方法 11：入党保底 / 返聘老年线 / 新婚备孕注入。返回 true = 已注入等待 UI 的 choice 事件。
GameEngine.prototype._rcy_specialEventInjection = function() {
    const s = this.state; const p = s.player;
    // ====== 年度结算完成后再处理特殊事件（避免跳过晋升/里程碑/日志/存档） ======
    // 入党保底：工作满 8 年仍非党员，必定获得一次入党机会（组织主动谈话——防止生涯错过入党导致晋升/结局卡死）
    // 防重复：已触发过的入党事件不再重复出现（e042 已 seen 则改用 e260，都 seen 则放弃保底）
    if (!p.ending && p.yearsWorked >= 8 && p.political !== 'cpc' && !p.flags.appliedParty && !p.flags.expelledFromParty && !p.flags.partyAsked && !this.state.currentEvent && !this.state.pendingTransfer && !this.state.pendingPromotion) {
      p.flags.partyAsked = true;
      const partyEv = [GameData.events.find(x => x.id === 'e042'), GameData.events.find(x => x.id === 'e260')].filter(Boolean).find(x => !p.seenEvents.includes(x.id) && !this.getLegacyEventBlockReason(x,p));
      if (partyEv) {
        s.currentEvent = { ...partyEv };
        return true; // 入党机会事件交给 UI 处理
      }
    }
    // 返聘老年线：返聘期间优先触发老年事件（传帮带/著书立说/余热生辉）
    const elderGate = p.flags.elderLineDone ? this.randf() < 0.25 : this.randf() < 0.6;
    if (!p.ending && !s.currentEvent && !s.pendingPromotion && !s.pendingTransfer && p.flags.rehired && elderGate) {
      const elderCandidates = ['e642', 'e643', 'e644'].filter(id => !p.seenEvents.includes(id));
      if (elderCandidates.length > 0) {
        const elderEv = GameData.events.find(x => x.id === elderCandidates[this.rand(0, elderCandidates.length - 1)]);
        if (elderEv) {
          p.flags.elderLineDone = true;
          if (elderEv.eventType === 'auto') {
            s.currentEvent = { ...elderEv };
            this.applyEventEffects(s.currentEvent);
            this.checkEndings();
            s.currentEvent = null;
          } else {
            s.currentEvent = { ...elderEv };
            return true; // choice 事件交给 UI 处理
          }
        }
      }
    }
    // 新婚备孕：已婚未育且适龄（≤42岁）玩家，每年高概率自然怀孕（保证生子不拖到晚年）
    // 男性触发"伴侣怀孕"（e288），女性触发"有孕在身"（e666，自身怀孕）
    if (!p.ending && p.isMarried && !p.hasChildren && p.age <= 42 && this.randf() < 0.35) {
      const pregId = p.gender === '女' ? 'e666' : 'e288';
      const preg = GameData.events.find(x => x.id === pregId);
      if (preg && !p.seenEvents.includes(pregId) && !this.state.currentEvent && !this.state.pendingTransfer && !this.state.pendingPromotion) {
        s.currentEvent = { ...preg };
        return true; // 怀孕事件交给 UI/模拟器处理
      }
    }
    return false; // 无特殊注入：编排主体照常返回 true（年度完成）
  }
// 赌博事件：动态生成（赌注随 streak 递增，选项随 streak 增多）
GameEngine.prototype.triggerGambleEvent = function() {
    const p = this.state.player;
    const gs = p.flags.gambleStreak || 1;
    const stake = Math.min(200, Math.round(10 * Math.pow(1.6, gs - 1))); // 10, 16, 26, 41, 66, 106, 169, 200
    const small = Math.round(stake * 0.6), big = stake, huge = Math.round(stake * 1.6), allIn = Math.round(stake * 2.5);
    const choices = [
      { text: `忍住不赌，转身离开`, effect: 'skip' },
      { text: `小注一把（${small}）`, effect: 'bet', stake: small, win: Math.round(small * 1.5) },
    ];
    if (gs >= 2) choices.push({ text: `中注一搏（${big}）`, effect: 'bet', stake: big, win: Math.round(big * 1.5) });
    if (gs >= 4) choices.push({ text: `大注押上（${huge}）`, effect: 'bet', stake: huge, win: Math.round(huge * 1.5) });
    if (gs >= 6) choices.push({ text: `梭哈！全部押上（${allIn}）`, effect: 'bet', stake: allIn, win: Math.round(allIn * 1.5) });
    this.state.currentEvent = {
      id: 'e766', title: '赌瘾发作', stage: 'life', eventType: 'choice',
      text: `牌局又开了。你口袋里揣着钱，手痒得厉害——上回的输赢还在脑子里打转。庄家冲你笑了笑，拍了拍空位。这局，赌不赌？（赌欲等级 ${gs}，赌注逐级加码）`,
      choices,
      gambleDynamic: true
    };
    return true;
  }
// v2.18 赌瘾自动结算：赌瘾发作年 70% 走此路径——不占 choice 槽，正常事件照常触发。
// 赌的概率随赌欲等级提高（轻度约 6 成、重度约 8 成），输赢影响财富并写入生涯日志；
// "忍住"累计 4 次触发消退（与手动选择路径共用同一消退阈值）。
GameEngine.prototype.autoSettleGamble = function() {
    const p = this.state.player;
    const gs = p.flags.gambleStreak || 1;
    const stake = Math.min(200, Math.round(10 * Math.pow(1.6, gs - 1)));
    p.flags.gambleLastYear = p.yearsWorked;
    const betChance = Math.min(0.8, 0.50 + gs * 0.05); // v2.1.6 戒赌可达：0.55→0.50（1级:0.55/4级:0.7/6级+:0.8）——原轻度 0.6 赌概率使连续 4 次忍住概率仅 2.6%，戒除几乎不可达
    if (this.randf() < betChance) {
      // 赌了：现金不足差额转高利贷负债（与手动赌博同链路）
      this.cashOut(stake);
      const won = this.randf() < 0.20;
      if (won) {
        this.cashIn(Math.round(stake * 1.5));
        p.careerLog.push({ year: p.age, event: `🎲 牌局又开了，你鬼使神差地押了上去，居然赢了（净赚 ${Math.round(stake * 0.5)}）——你更离不开牌桌了` });
      } else {
        p.careerLog.push({ year: p.age, event: `🎲 牌局又开了，你没能管住自己的手（-${stake}）——钱没了，瘾却更深了` });
      }
      p.flags.gambleStreak = gs + 1;
      p.flags.gambleMiss = 0;
      this.markEventFlag('gamblingAddict');
    } else {
      // 忍住了：连续 4 次不赌 → 赌瘾消退（streak 递减，归零戒除）
      p.flags.gambleMiss = (p.flags.gambleMiss || 0) + 1;
      p.careerLog.push({ year: p.age, event: `🎲 牌局又开了，你咬咬牙转身离开（连续 ${p.flags.gambleMiss} 次不赌，赌瘾开始消退）` });
      if ((p.flags.gambleMiss || 0) >= 4) {
        p.flags.gambleStreak = Math.max(0, gs - 1);
        p.flags.gambleMiss = 0;
        if (p.flags.gambleStreak === 0) {
          delete p.flags.gamblingAddict; delete p.flags.gamblingAddict_since;
          p.careerLog.push({ year: p.age, event: '🎲 你终于戒掉了赌瘾，心里那块石头落了地' });
        } else {
          p.careerLog.push({ year: p.age, event: `🎲 赌瘾有所消退（赌欲等级 ${p.flags.gambleStreak}）` });
        }
      }
    }
  }
GameEngine.prototype.restYear = function() {
    const s = this.state; const p = s.player;
    if (!p.isEmployed || p.ending || s.currentEvent || s.pendingPromotion || s.pendingTransfer) return false;
    // v2.49：休整限 3 次/局——此前无次数限制且不扣支出不付息，负债玩家可连续休整至退休规避全部债务惩罚（白嫖漏洞）
    if ((p.flags.restCount || 0) >= 3) { p.careerLog.push({ year: p.age, event: '你申请休整，但组织认为长期离岗不妥，没有批准' }); return false; }
    p.flags.everRested = true;
    p.flags.restCount = (p.flags.restCount || 0) + 1;
    s.year++; p.age++; p.yearsWorked++;
    this._resetAnnualActionsAndMatureAssets();
    s.pendingMicro = null; // P2：休整年同样让上一年未回应的使绊窗口过期
    s.hidden.mentalPressure = Math.max(5, s.hidden.mentalPressure - 20 - this.rand(0, 15));
    s.hidden.familyPressure = Math.max(0, s.hidden.familyPressure - 8 - this.rand(0, 7));
    s.hidden.risk = Math.max(0, s.hidden.risk - 8 - this.rand(0, 7));
    s.attrs.body = Math.min(10, s.attrs.body + 2);
    s.hidden.integrity = Math.min(85, s.hidden.integrity + 3);
    s.hidden.workAbility += 1 + Math.max(0, Math.floor(s.attrs.body / 4));
    // v2.49：休整年补记生活支出与负债利息（不强制还本）——此前免支出免利息，负债玩家可无限休整避债
    // v2.1.67 收敛：公式与付息逻辑抽至 engine-finance-utils（与年度结算同一口径，简版无封顶滚本）
    const fin = p.finance;
    const expense = this.computeLivingExpense(p); // v2.66 房贷月供 8→6（原对低职级玩家是'穷人税'：rank≤3 时月供 8 使净现金流转负滑入高利贷螺旋）
    if (p.flags.mortgage) p.careerLog.push({ year: p.age, event: '🏠 房贷月供扣款（-6）' }); // v2.66 月供入日志（原并入生活费无任何记录，玩家只见现金减少）
    this.cashOut(expense);
    if (this.debtTotal() > 0) {
      this.settleDebtInterest(fin, { forcedRepay: false });
      p.careerLog.push({ year: p.age, event: `💸 休整期间仍要还息，负债 ${this.debtTotal().toFixed(0)} 缠身难以安心` });
    }
    if (this.debtTotal() > 300) {
      const relief=this.payDebtByForgive(this.debtTotal()-300);
      p.careerLog.push({year:p.age,event:'休整期间债务重组，明确减免 '+relief+' 单位债务'});
    }
    p.careerLog.push({ year: p.age, event: '休整一年，状态大幅恢复', mentalPressure: Math.round(s.hidden.mentalPressure), risk: Math.round(s.hidden.risk), integrity: Math.round(s.hidden.integrity), positionWeight: Math.round(s.hidden.positionWeight), leadershipRank: p.leadershipRank, unitLevel: p.unitLevel });
    // 休整年同样检查退休/结局，防止无限休整越过退休年龄不结算
    this.checkEndings();
    this.clampAttrs();
    return true;
  }

  // 提前退休：在排挤/降级处境下选择急流勇退
  GameEngine.prototype.retireEarly = function() {
    const p = this.state.player;
    if (!p) return;
    const h = this.state.hidden;
    p.flags.retiredEarly = true;
    // 提前退休结局判定：职级高+声誉好 → 安稳退休；否则平凡
    if (p.leadershipRank >= 5 && p.reputation > 50 && h.risk < 50) {
      p.ending = 'safe';
    } else {
      p.ending = 'ordinary';
    }
    p.deathReason = 'retired';
    p.careerLog.push({ year: p.age, event: '选择提前退休，离开体制内的纷争', special: 'retire' });
    this.state.pendingTransfer = null;
    this.state.currentEvent = null;
  }

// 六维画像与真实经历只读汇总，不参与主结局评分。
GameEngine.prototype.getLifeEvaluation = function() {
  const p=this.state.player,h=this.state.hidden,a=this.state.attrs,f=p.flags||{};
  const bounded=x=>Math.max(0,Math.min(100,Math.round(x)));
  const n=x=>Number(x)||0;
  const dimensions=[
    ['事业成就',n(h.workAbility)*0.45+n(p.leadershipRank)*3.5+n(p.promotions)*2,'能力、职级和晋升经历'],
    ['家庭关系',this.getLifePathProfile().routes.find(r=>r.id==='family')?.score||0,'家庭压力、陪伴与共同生活'],
    ['社会贡献',n(p.peopleReputation)*0.75+Math.min(25,n(f.peopleEventCount)*2.5),'民间口碑与群众工作记录'],
    ['身心健康',n(a.body)*5+(100-n(h.mentalPressure))*0.5,'体质与当前精神压力'],
    ['经济状况',50+n(p.wealth)*0.15-(f.mortgage?8:0),'净财富与未结清住房贷款'],
    ['个人原则',n(h.integrity)*0.8+(100-n(h.risk))*0.2-(this.hasCorruptFlag(f)?20:0),'廉洁、风险及腐败记录']
  ].map(([name,score,detail])=>({name,score:bounded(score),detail}));
  const seen=new Set(p.seenEvents||[]),memories=[];
  for(const r of this.getPolicyFollowups())memories.push(r.name+'：'+r.label);
  if(f.renewStageLegacy)memories.push('小剧场重新开放后，你留下了真正属于自己的那部分回忆。');
  if(f.renewRouteLegacy)memories.push('你和顾芸多年后以普通乘客的身份再次相遇。');
  if(f.renewCreditLegacy)memories.push('你和沈宁在多年后核对了共同工作的真实贡献。');
  if(f.renewShopLegacy)memories.push('许姨在新店里讲完自己的搬迁经历，你们没有再把它变成人情账。');
  if(f.renewWindowLegacy)memories.push('人工服务入口的复核记录随岗位完成移交。');
  if(f.renewRepairLegacy)memories.push('旧设备维护记录进入下一轮预算评审。');
  if(f.renewHomeLegacy)memories.push('你兑现了家庭日历上的长期约定。');
  if(seen.has('arc_receipt_legacy_4'))memories.push('旧城回执的历史材料已交由新窗口核查，未决事项没有被视为自动办结。');
  if(seen.has('arc_classmate_legacy_4'))memories.push('多年后与林默重谈旧事，留下了新的关系边界。');
  if(seen.has('arc_team_legacy_4'))memories.push('许砚的交接本进入新团队，你完成了多年后的经验移交。');
  if(seen.has('arc_family_clinic_3'))memories.push('蓝色便签的五年回访已经完成。');
  if(seen.has('enl216'))memories.push('父母照护经历已完成多年后的家庭复盘。');
  if(f.mortgageCleared)memories.push('住房贷款已经结清。');
  if(f.mortgageRestructured)memories.push('住房贷款曾重组为普通债务。');
  if(seen.has('arc_crossroads_echo'))memories.push('旧城联合会商的经验已经交给后来者。');
  if(seen.has('ent306'))memories.push('你完成了与郑教授有关的多年回访。');
  if(seen.has('arc_life_confluence_2'))memories.push('多条人生路线的共同责任已经复盘。');
  const sorted=dimensions.slice().sort((a,b)=>b.score-a.score);
  return {dimensions,memories,summary:'本局记录中，'+sorted[0].name+'是相对突出的一面，'+sorted.at(-1).name+'则仍有改善空间。各项评价不代表人生价值的高低。',unfinished:this.getPendingCausalConsequences()};
};
