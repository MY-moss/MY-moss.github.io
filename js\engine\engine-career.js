// v2.1.67 结构重构：740 行单体拆为编排主体 + 11 个顺序子方法（_rcy_* 前缀），行为逐行不变。
// 顺序约束：快照→衰减→流转→人脉→家庭健康→财务→重置资产→死flag→事件→结算→特殊注入。
// 短路语义：_rcy_annualEventSelection 的 aborted（e761 接管）直接终止年度；
//           _rcy_specialEventInjection 返回 true = 已注入等待 UI 的 choice 事件。
GameEngine.prototype.runCareerYear = function() {
    const p = this.state.player;
    if (!p.isEmployed) return false;
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
      if ((fin.cash || 0) < 0) {
        p.reputation = Math.max(0, (p.reputation || 50) - 2);
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
GameEngine.prototype._rcy_annualResetAndAssets = function() {
    const s = this.state; const p = s.player;
    const fin = p.finance;
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
    // v2.49b 修复：原实现只返还利息 2（本金 10 蒸发，存定期净亏 8，违背『本息到账』文案与现实逻辑）——改为本金+利息 12
    if (p.flags.savingDeposit) {
      this.cashIn(12);
      delete p.flags.savingDeposit;
      p.careerLog.push({ year: p.age, event: '🏦 去年的定期存款到期，本息到账（+12）' });
    }
    // 黄金增值结算（上一年购置的黄金，今年增值出手）
    // v2.49b 修复：原实现只返还增值 14（本金 70 蒸发，买黄金净亏 56，文案却说『小赚』）——改为本金+增值
    // v2.59 黄金增值 14→10（与风险投资修正后的期望形成层次：定期 20% 安全 / 黄金 14% 中档 / 基金定投副业 19-24% 高方差）
    if (p.flags.goldHeld) {
      this.cashIn(80);
      delete p.flags.goldHeld;
      p.careerLog.push({ year: p.age, event: '📿 压箱底的黄金增值出手，本息到账（+80）' });
    }
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
            delete p.flags.gamblingAddict;
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
// 子方法 9：年度事件选择（里程碑/政策项目/入口注入/刚性链/随机池）+ 赌博年分支。
// 返回 { event, aborted }：aborted=true 表示 e761 逮捕/出逃接管，编排主体须立即终止年度。
GameEngine.prototype._rcy_annualEventSelection = function() {
    const s = this.state; const p = s.player;
    // 年度事件（随机事件池抽取，auto/sudden 立即结算）
    // 平静年限流控制：最多连续两年"平静的一年"，第三年强制触发事件
    const quietStreak = (p.flags.quietStreak || 0);
    let event = null;
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
      // 主动承接的政策项目优先占用年度决策槽；项目中的高热度舆情危机优先级更高。
      const policyEvent = (typeof this.preparePolicyOpinionCrisisEvent === 'function' ? this.preparePolicyOpinionCrisisEvent() : null)
        || (typeof this.getPolicyProjectDecisionEvent === 'function' ? this.getPolicyProjectDecisionEvent() : null);
      if (policyEvent) event = policyEvent;
    }
    if (!event && !this.state.currentEvent) {
      // 健康链入口注入：38 岁后每年 4% 查出体检异常（'遇到'是概率，查出后后续必然）
      // 不当回事/硬扛（healthHardhead）玩家：42 岁后 8%/年身体再次报警（身体会找你算账）
      const hardhead = !!p.flags.healthHardhead;
      if (!p.flags.healthRisk && !p.flags.healthCare && !p.flags.healthTreated && !p.flags.healthStable && p.age >= (hardhead ? 42 : 38) && this.randf() < (hardhead ? 0.08 : 0.04) && (hardhead || !(p.seenEvents || []).includes('ent244'))) {
        const evH = (GameData.events || []).find(x => x && x.id === 'ent244');
        if (evH) { p.seenEvents = p.seenEvents || []; if (evH.eventType === 'auto' || evH.eventType === 'sudden') p.seenEvents.push('ent244'); event = evH; } // v2.67 choice 不预 push（由 handleEventChoice 完成时 push）——刷新后入口可重新注入
      }
      // 学历链入口注入：35 岁前每年 3% 遇到报考念头（约 1/3 玩家会遇见，选择权在玩家）
      if (!event && !p.flags.mbaApply && !p.flags.mbaActive && !p.flags.mbaDegree && !(p.seenEvents || []).includes('ent232') && p.age < 35 && this.randf() < 0.03) {
        const ev0 = (GameData.events || []).find(x => x && x.id === 'ent232');
        if (ev0) { p.seenEvents = p.seenEvents || []; if (ev0.eventType === 'auto' || ev0.eventType === 'sudden') p.seenEvents.push('ent232'); event = ev0; }
      }
      // 刚性推进：flag 在且延迟到期 → 必然触发下一步（seenEvents 去重保证每步只触发一次）
      // v2.64 延迟机制：delay=N 表示 flag 设置后第 N 年才必然触发（事件更合理：预备期 1 年转正、专案每年推进、调查需要时间）
      const RIGID_CHAINS = [
        { flag: 'mbaApply', next: 'ent233', delay: 1 },
        { flag: 'mbaActive', next: 'ent234', delay: 1 },
        { flag: 'mbaDegree', next: 'ent235', delay: 1 },
        { flag: 'healthRisk', next: 'ent245', delay: 1 },
        { flag: 'healthCare', next: 'ent246', delay: 1 },
        { flag: 'healthTreated', next: 'ent247', delay: 1 },
        { flag: 'underInvestigation', next: 'e646', delay: 1 },
        { flag: 'defied', next: 'e648', delay: 2 }, // 死扛后组织核实、移送司法需时 2 年
        { flag: 'selfSurrender', next: 'e647', delay: 1 }, // 自首后纪律处分流程 1 年
        { flag: 'appliedParty', next: 'e043', delay: 1 }, // 预备党员 1 年预备期后必然转正讨论
        { flag: 'proj_step1', next: 'e654', delay: 1 }, // 招商专案每年推进一步
        { flag: 'proj_step2', next: 'e655', delay: 1 },
        { flag: 'proj_step3', next: 'e656', delay: 1 },
        { flag: 'proj_done', next: 'e657', delay: 1 },
        { flag: 'whistleblower', next: 'ent066', delay: 2 }, // 举报后组织调查约谈需时 2 年
        { flag: 'drinkDrive', next: 'ent254', delay: 1 }, // v2.65 酒驾被查后必然处理（扣分罚款/单位处分）
        { flag: 'mortgage', next: 'ent258', delay: 1 }, // 贷款买房后必然月供压力
        { flag: 'faction_lean', next: 'ent260', delay: 2 }, // 站队后 2 年派系风云（得势/失势/转向抉择）
        { flag: 'faction_leaned_out', next: 'ent262', delay: 1 }, // 靠山倒台后必然面对清算/转向
        { flag: 'dating', next: 'ent263', delay: 3 }, // 恋爱满 3 年必然决断（结婚/继续/分手）
        { flag: 'faction_steadfast', next: 'ent261', delay: 2 }, // v2.66 坚定站队 → 2 年后必然得势
        { flag: 'mortgage', next: 'ent259', delay: 4 }, // v2.66 房贷 4 年后必然可提前还贷（出口保障，原 ent259 池子概率极低）
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
        { flag: 'villageDoorToDoor', next: 'e807', delay: 1 },
        { flag: 'villageSolid', next: 'e808', delay: 1 },
        // v2.1.68 缺口补充：赡养链 / 理财暴雷链 / 借调链（入口在下方概率注入）
        { flag: 'parentIllness', next: 'ent294', delay: 1 },
        { flag: 'parentCaring', next: 'ent295', delay: 2 },
        { flag: 'leveragedInvest', next: 'ent297', delay: 2 },
        { flag: 'investCrash', next: 'ent298', delay: 1 },
        { flag: 'seconded', next: 'ent300', delay: 1 },
        { flag: 'secondReview', next: 'ent301', delay: 1 }
      ];
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
      if (!event && !p.flags.leveragedInvest && !p.flags.investCrash && !p.flags.investLesson && !(p.seenEvents || []).includes('ent296') && p.age >= 28 && this.randf() < 0.03) {
        const evI = (GameData.events || []).find(x => x && x.id === 'ent296');
        if (evI) { p.seenEvents = p.seenEvents || []; if (evI.eventType === 'auto' || evI.eventType === 'sudden') p.seenEvents.push('ent296'); event = evI; }
      }
      // v2.1.68 借调链入口：26-45 岁每年 3% 收到借调函（体制典型上行轨迹）
      if (!event && !p.flags.seconded && !p.flags.secondReview && !p.flags.secondDone && !(p.seenEvents || []).includes('ent299') && p.age >= 26 && p.age <= 45 && this.randf() < 0.03) {
        const evS = (GameData.events || []).find(x => x && x.id === 'ent299');
        if (evS) { p.seenEvents = p.seenEvents || []; if (evS.eventType === 'auto' || evS.eventType === 'sudden') p.seenEvents.push('ent299'); event = evS; }
      }
      for (const step of RIGID_CHAINS) {
        if (p.flags[step.flag] && !(p.seenEvents || []).includes(step.next)) {
          const since = p.flags[step.flag + '_since'] || 0;
          const delay = step.delay || 1;
          if (p.age < since + delay) continue; // 延迟未到期：等一等（该年不触发，也跳过后续匹配）
          const ev2 = (GameData.events || []).find(x => x && x.id === step.next);
          if (ev2) { p.seenEvents = p.seenEvents || []; if (ev2.eventType === 'auto' || ev2.eventType === 'sudden') p.seenEvents.push(step.next); event = ev2; } // v2.67 修复刷新丢档：choice 不预 push seen（由 handleEventChoice 完成时 push）——事件年刷新后链可重新注入
          break;
        }
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
        this.applyEventEffects(event); this.checkEndings();
        s.currentEvent = null; // v2.16 修复：auto/sudden 结算完立即释放 choice 槽，防止后续年份 choice 事件链被永久锁死
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
    p.careerLog.push({ year: p.age, event: yearEventTitle, mentalPressure: Math.round(s.hidden.mentalPressure), risk: Math.round(s.hidden.risk), integrity: Math.round(s.hidden.integrity), positionWeight: Math.round(s.hidden.positionWeight), leadershipRank: p.leadershipRank, unitLevel: p.unitLevel, unitName: (p.unit && p.unit.name) || '', reputation: Math.round(p.reputation || 50), peopleReputation: Math.round(p.peopleReputation || 50), heat: Math.round(p.heat || 0), attrs: { iq: s.attrs.iq, eq: s.attrs.eq, body: s.attrs.body, luck: s.attrs.luck } }); // v2.18 年度快照；v2.21 补民间口碑；v2.1.17 补四维属性（年鉴曲线图）；v2.1.47 补单位名（人生回顾职业路径）
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
    if (!p.ending && p.yearsWorked >= 8 && p.political !== 'cpc' && !p.flags.partyAsked && !this.state.currentEvent && !this.state.pendingTransfer && !this.state.pendingPromotion) {
      p.flags.partyAsked = true;
      const partyEv = [GameData.events.find(x => x.id === 'e042'), GameData.events.find(x => x.id === 'e260')].filter(Boolean).find(x => !p.seenEvents.includes(x.id));
      if (partyEv) {
        s.currentEvent = { ...partyEv };
        return true; // 入党机会事件交给 UI 处理
      }
    }
    // 返聘老年线：返聘期间优先触发老年事件（传帮带/著书立说/余热生辉）
    const elderGate = p.flags.elderLineDone ? this.randf() < 0.25 : this.randf() < 0.6;
    if (!p.ending && p.flags.rehired && elderGate) {
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
      p.flags.gamblingAddict = true;
    } else {
      // 忍住了：连续 4 次不赌 → 赌瘾消退（streak 递减，归零戒除）
      p.flags.gambleMiss = (p.flags.gambleMiss || 0) + 1;
      p.careerLog.push({ year: p.age, event: `🎲 牌局又开了，你咬咬牙转身离开（连续 ${p.flags.gambleMiss} 次不赌，赌瘾开始消退）` });
      if ((p.flags.gambleMiss || 0) >= 4) {
        p.flags.gambleStreak = Math.max(0, gs - 1);
        p.flags.gambleMiss = 0;
        if (p.flags.gambleStreak === 0) {
          delete p.flags.gamblingAddict;
          p.careerLog.push({ year: p.age, event: '🎲 你终于戒掉了赌瘾，心里那块石头落了地' });
        } else {
          p.careerLog.push({ year: p.age, event: `🎲 赌瘾有所消退（赌欲等级 ${p.flags.gambleStreak}）` });
        }
      }
    }
  }
GameEngine.prototype.restYear = function() {
    const s = this.state; const p = s.player;
    if (!p.isEmployed) return false;
    // v2.49：休整限 3 次/局——此前无次数限制且不扣支出不付息，负债玩家可连续休整至退休规避全部债务惩罚（白嫖漏洞）
    if ((p.flags.restCount || 0) >= 3) { p.careerLog.push({ year: p.age, event: '你申请休整，但组织认为长期离岗不妥，没有批准' }); return false; }
    p.flags.everRested = true;
    p.flags.restCount = (p.flags.restCount || 0) + 1;
    s.year++; p.age++; p.yearsWorked++;
    if (this.resetActionPoints) this.resetActionPoints(); // 年度筹划回合：休整年同样进入新一年，精力补满
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
