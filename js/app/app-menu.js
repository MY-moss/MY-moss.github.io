Object.assign(App, {
  // v2.21 组织档案评语：按组织印象（reputation）/民间口碑（peopleReputation）/廉洁/风险组合生成卷宗评语
  renderArchiveComment(p, h) {
    const parts = [];
    if (h.risk >= 60) parts.push('任内多次收到廉政风险提示，谈话记录在册');
    else if (h.risk >= 35) parts.push('曾有过廉政谈话记录，后表现平稳');
    else parts.push('廉洁情况良好，无不良反映');
    if ((p.peopleReputation || 50) >= 75) parts.push('群众口碑深厚，走访时有群众主动提起其名字');
    else if ((p.peopleReputation || 50) <= 30) parts.push('群众反映一般，信访件中偶有提及');
    else parts.push('群众基础尚可');
    if ((p.reputation || 50) >= 75) parts.push('组织评价高，历次考察均为优秀');
    else if ((p.reputation || 50) <= 35) parts.push('组织评价一般，考察中有不同声音');
    if (h.integrity >= 75) parts.push('作风正派，两袖清风');
    return parts.join('；') + '。';
  },
  renderEnding() {
    const p = engine.getPlayer();
    const h = engine.getHidden();
    this.saveRecord(p, h);
    this.mergeCodex(p);
    const endings = {
      entrepreneur: { title: '🚀 下海人生', desc: '你辞去了体制内的职务，把多年积累的见识和人脉投进了商海。', color: '#ef6c00', epilogue: '离开体制那天，你把工牌轻轻放在桌上。后来你在商海里起起落落，偶尔也会想起那些加班的深夜和写过的材料。有人问你后不后悔，你只是笑了笑——体制给了你安稳，而你想要的是另一种可能。' },
      arrest: { title: '⚖️ 被抓', desc: '你曾经熟悉流程，最后也成为流程的一部分。', color: '#ef5350', epilogue: '你的事迹成了警示教育片里的案例。同事们谈起你时都说"可惜了"，语气里带着一丝庆幸。你曾经以为自己是规则的主人，后来才发现自己只是规则的一页注脚。' },
      burnout: { title: '💀 燃尽', desc: '你没有输给考试，而是被长年累月的小事一点点掏空。', color: '#e64a19', epilogue: '你的工位空了。新来的年轻人坐在那里，他不知道这个位置上曾经有人连续加班三百天。桌上的绿植已经枯了，就像你最后的日子。' },
      skyline: { title: '🚀 巅峰人生', desc: '你一路往上走，脚步不算轻，但每一步都有人看见。', color: '#1565C0', epilogue: '退休时，你的办公室里堆满了各种奖状和纪念品。你看着窗外的城市，想起自己年轻时写的第一份材料——那篇被退回三次的稿子。如今你已经是别人口中最懂业务的老领导。' },
      fast: { title: '⭐ 快速晋升', desc: '你升得不慢，身边的人一边祝贺，一边重新计算与你的距离。', color: '#2e7d32', epilogue: '你用了不到十年就走完了别人二十年的路。有人羡慕，有人嫉妒，有人在你背后说"运气好"。只有你自己知道，每一个深夜的灯火都不会说谎。' },
      edge: { title: '📋 边缘化', desc: '你后来被放在一个不太重要的位置上，终于拥有了准时下班的资格。', color: '#ab47bc', epilogue: '你不再参加核心会议，不再签重要文件。你开始准时下班，开始陪孩子写作业，开始养花。有一天你发现，原来生活可以不那么紧绷。' },
      safe: { title: '🛡️ 安稳退休', desc: '你没有成为传奇，也没有成为案例。档案很薄，生活还算完整。', color: '#1565C0', epilogue: '退休那天，你清理办公桌，发现抽屉里还有一盒没拆封的胃药。你笑了笑，把它扔进了垃圾桶。三十年的体制生涯，你最大的成就就是——没有变成自己讨厌的那种人。' },
      ordinary: { title: '📄 平凡人生', desc: '你的人生没有爽文节奏，但有很多现实脚注，每一条都不太轻。', color: '#607d8b', epilogue: '你不是最亮眼的那个，也不是最差的那个。你就像单位里最常见的那个背影——开会时坐在中间，聚餐时负责倒茶，合影时站在第二排。但正是无数个你，撑起了这个系统的日常运转。' },
      central: { title: '🏛️ 中央殿堂', desc: '你最终走到了体制的顶峰——从基层一步步抵达了国家权力的最核心。这是一条比登天还难的路，你走过来了，但每一步都踩在刀尖上。', color: 'var(--grade-s)', epilogue: '你的照片挂在了中南海的墙上。年轻人指着你的名字问"这是谁"，旁边的老同志低声说"一个真正的狠人"。你用一生证明了一件事——在这个体系里，天花板不是用来仰望的，是用来打破的。但你也失去了很多东西：头发、胃、和那些本可以和你一起变老的人。你站在权力的顶端往下看，发现最高处——其实最孤独。' },
      reform: { title: '🚩 改革先锋', desc: '你不甘于按部就班，用一份份改革方案撬动了沉闷的机关。', color: '#2e7d32', epilogue: '《人民日报》报道你的那天，单位楼下宣传栏贴了整整一个月。很多年后，新来的年轻人还会翻出你的旧方案，说你"胆子真大"。你笑了笑，没告诉他们——哪有什么胆子，不过是觉得现状还能更好一点。' },
      digital: { title: '💾 数字先驱', desc: '你在数据与代码间开辟出一条路，让群众办事少跑了一万次腿。', color: '#1565C0', epilogue: '你退休那天，办事大厅的自助机还在刷着你的名字。当年没人看好的"数据共享平台"，如今成了全省标杆。程序员们说这是他们见过最懂业务的领导，你只说了一句：字里行间，都是人心。' },
      grassroots: { title: '🌾 乡土守望', desc: '你本可以回到更高的平台，却选择留在最需要你的地方。', color: '#8d6e63', epilogue: '你退休那天下着雨，镇上的人自发站在街两边。你种的树已经高过院墙，你修的桥还在用，你带出来的年轻干部接过了你的活。有人问你后悔吗，你指了指田埂上跑过的孩子："你看，这就是我的功业。"' },
      clean: { title: '🕊️ 清廉丰碑', desc: '在诱惑遍地的路上，你守住了一生的清白，成为一面旗帜。', color: '#607d8b', epilogue: '纪委的警示教育片里，别人是反面教材，你却是唯一被请上台讲"如何守住底线"的人。你讲得很平淡，台下的人却听得眼眶发红。退休时你的档案薄得可怜，但你的名字，比很多厚档案都重。' },
      grassroots_devotion: { title: '🌾 基层奉献', desc: '扎根基层十五载，你成为百姓口中的好干部。', color: '#8d6e63', epilogue: '镇上的老老少少都认识你。谁家有事第一个想到的就是你，你说的话比红头文件还管用。退休那天，你骑着旧自行车慢慢穿过街巷，两旁的人自发站出来送你。你没有大房子的钥匙，也没有厚厚的存折，但你有满满一墙的锦旗和一肚子好听的故事。' },
      era_reform: { title: '🌊 时代弄潮儿', desc: '在改革年代，你一次次站上浪头，成了那个时代最鲜活的注脚。', color: '#e65100', epilogue: '改革年代风起云涌，你推的方案改了又改、批了又批，最终写进了全省的经验汇编。年轻干部来请教，你翻开泛黄的笔记本，第一页写着当年在班子会上拍的桌子。有人说你赶上了好时候，你摇头——不是赶上，是敢上。' },
      era_rectify: { title: '🧹 清流砥柱', desc: '整顿年代激浊扬清，你成了那股最干净的风。', color: '#2e7d32', epilogue: '整顿年代，多少曾经的"能人"落马，而你安然退休。纪检的同志说，查你查得最省事——账目干净，家风清白。你家的门常年开着，谁都能进来喝杯茶，却没人能递进一张卡。你一辈子没办成什么"大事"，但整个系统都知道：这个人，靠得住。' },
      patron_legacy: { title: '🌳 大树成荫', desc: '贵人提携你至高位，你把这份提携又传给了下一代。', color: '#558b2f', epilogue: '退休欢送会上，你特意请了当年提拔你的老领导。他头发全白了，颤巍巍地给你倒茶："轮到你请我喝茶了。"你接过茶，想起二十年前他递给你的一支笔。后来你也有样学样，给年轻人递过笔。官场人来人往，最难得的，是有人愿意在你身上押注，而你没有让他输。' },
      lifelong_friend: { title: '🍵 莫逆之交', desc: '风风雨雨几十年，老同学还坐在对面和你喝茶。', color: '#8d6e63', epilogue: '退休第二天，你就约了大学室友喝茶。你们聊起当年宿舍夜谈、聊起各自单位里的鸡毛蒜皮、聊起那些差点走错的路。他没有当过你的贵人，你也没帮过他什么大忙，但你们谁也没走散。体制内浮沉几十年，酒桌上的朋友换了一茬又一茬——只有他，从入学喝到了退休。' },
      hometown_net: { title: '🏘️ 桑梓情深', desc: '街坊邻里的家长里短，你记了一辈子，也管了一辈子。', color: '#8d6e63', epilogue: '你在基层干到退休，辖区的街坊几乎都认识你。谁家孩子升学、谁家老人看病、谁家铺子被占道经营——你比他们自己还上心。退休那天，巷口的老太太们凑钱给你买了个保温杯，上面刻着"好干部"。你捧着杯子回家，路过自家门口，邻居家的小孙子喊："爷爷，我妈说你是大好人！"你忽然觉得，这比什么奖状都值。' },
      estranged_hero: { title: '🌧️ 曲高和寡', desc: '群众把你当自家人，组织却始终对你保留着距离。', color: '#6A5ACD', epilogue: '你的名字在巷子里是口碑，在纸面上是编号。群众评议年年高分，可提拔名单里始终没有你——"这个人，群众关系太好，跟组织有距离。"你不服，却也习惯了。退休那天，街坊们自发在社区门口站成两排，你红着眼眶走过去，心里忽然明白：组织没看上的，恰恰是群众最看重的。' },
      tech_backbone: { title: '💾 技术骨干', desc: '在数据与代码间深耕，你成为单位不可或缺的技术骨干。', color: '#1565C0', epilogue: '你写的那套系统跑了十年没出过大错。年轻人遇到难题还是习惯翻你的笔记，你的代码注释比很多文档都详细。领导换了一茬又一茬，但谁都知道——这个系统离不开你。你用技术证明了一件事：在体制内，真正的"不可替代"不是关系，而是本事。' },
      people_champion: { title: '❤️ 群众贴心人', desc: '你被群众亲切地称为"贴心人"，每一次倾听都换来一份信任。', color: '#ef5350', epilogue: '你的办公桌上堆满了群众送来的感谢信，墙上挂满了锦旗。有人大老远跑来就为了和你说说话，有人逢年过节给你寄自家种的土特产。你不是最大的官，但你是群众心里最亲近的人。退休后，还有人打听到你家地址，提着鸡蛋来看你。' },
      reform_pioneer: { title: '🚩 改革旗手', desc: '你参与推动多次改革，成为改革路上的中坚力量。', color: '#2e7d32', epilogue: '你推动的那几项改革，如今已是单位的常规操作。后来者翻看旧档案时，总会看到你的名字出现在关键节点上。有人说你是"刺头"，有人说你是"干将"，你都不在乎——你只知道，有些事不推就永远不动，而你恰好是那个愿意推的人。' },
      whistleblower_hero: { title: '🦅 举报英雄', desc: '在黑暗处递出证据，在阳光里继续前行——你守住了公道的底线。', color: '#1565C0', epilogue: '没人知道那封匿名信是你写的，但案子查实那天，你在走廊里听见处长说"这次多亏了内部有人站出来"。你低头整理文件，没有抬头。多年后，警示教育基地的展板换了一茬又一茬，而你始终记得那个把材料交出去后，手抖得握不住笔的下午。退休时，组织给了你一个"特别贡献"的档案备注——没有写具体事由，只有一句话：关键时刻，站得出来。' },
      author_legacy: { title: '📚 著书立说', desc: '你把几十年的实务经验写成专著，让后来者少走了很多弯路。', color: '#8D6E63', epilogue: '你的专著在系统内成了"人手一册"的实务手册，新入职的年轻人书架上都有它。有人问你怎么舍得把吃饭的本事写出来，你说："我带过那么多徒弟，能教一个是一个，书能教一千个。"签售那天，一位乡镇干部拿着书排队半小时，只为说一句"书里那个案例，救了我一个村"。你退休后最常做的事，是给来信的读者回信，钢笔字一笔一画，像当年写材料一样认真。' },
      rural_star: { title: '🌟 乡村振兴之星', desc: '你把荒村变成了示范村，把留守的老人变成了有收入的手艺人。', color: '#2E7D32', epilogue: '你离开那天，示范村的村民自发送到村口。村支书拉着你的手说："书记，路灯是你争取的，电商是你教的，连广场舞的音响都是你帮着买的。"你回头看了一眼，村口那块"乡村振兴示范村"的牌子在夕阳里发亮。后来你每年都回去看，看到当年那个辍学的姑娘成了村里的电商主播，看到老李家的脐橙卖到了省城——你觉得这辈子在基层这些年，值了。' },
      honest_official: { title: '📜 一代清官', desc: '一生清白，名垂青史，你用二十年证明清官不仅有，还可以走得远。', color: '#757575', epilogue: '你退休时的欢送会上，没有山珍海味，只有一壶清茶。同事们说起你，最常说的一句话是"这个人，干净"。你的一生没有大起大落，也没有惊天动地，但你的档案里没有一笔污点。多年后，地方志里有一行小字记着你——"清廉自守，为一时之表率"。' },
    };
    const ending = endings[p.ending] || endings.ordinary;
    const newAch = this.checkAchievements(p); // v2.1.6：解锁成就返回值现在被消费（结算页展示）
    const newChallenges = typeof this.evaluateChallenges === 'function' ? this.evaluateChallenges(p, h) : []; // v2.1.49 M5.3：结算时推进跨周目挑战
    const unitLevelLabel = engine.getUnitLevelLabel ? engine.getUnitLevelLabel(p.unitLevel) : '';
    const epilogue = ending.epilogue || '';
    // 评分计算
    const finalScore = this.calculateFinalScore(p, h);
    // v2.1.53 L4.3：挑战局结算自动上报（含种子恢复），须在渲染前执行
    if (typeof this.submitChallengeResult === 'function') this.submitChallengeResult(p, h, finalScore);
    const grade = this.getGrade(finalScore);
    const breakdown = this.getScoreBreakdown(p, h);
    const scenarioProgress = typeof engine.getScenarioProgress === 'function' ? engine.getScenarioProgress() : null;
    const scenarioGoalHtml = scenarioProgress && scenarioProgress.scenarioId !== 'classic' ? `
        <div class="ending-summary scenario-ending-goal">
          <h3>🎯 ${App.escapeHtml(scenarioProgress.name)} · ${App.escapeHtml(scenarioProgress.title)} ${scenarioProgress.completed ? '✅' : '⏳'}</h3>
          <p>${App.escapeHtml(scenarioProgress.desc)}</p>
          ${scenarioProgress.steps.length ? `<div class="scenario-goal-steps">${scenarioProgress.steps.map(step => `<span class="${step.done ? 'done' : ''}">${step.done ? '✅' : '❓'} ${App.escapeHtml(step.label)}</span>`).join('')}</div>` : ''}
          <small>${scenarioProgress.endingDone ? '本剧本目标结局已达成。' : scenarioProgress.completed ? '关键选择已完成，继续尝试目标结局。' : '本局尚未完成剧本目标，可在下一局调整关键选择。'}</small>
        </div>` : '';

    return `
      <div class="stage fade-in ending-stage" style="--ending-color: ${ending.color}">
        <div class="ending-icon">${ending.title.split(' ')[0]}</div>
        <h2 class="ending-title" style="color:${ending.color}">${ending.title.split(' ').slice(1).join(' ')}</h2>
        <div class="final-score" style="text-align:center;margin:16px 0">
          <div style="font-size:48px;font-weight:900;color:${grade.color};font-family:var(--font-display);letter-spacing:2px">${grade.label}</div>
          <div style="font-size:14px;color:${grade.color};margin-top:4px;font-weight:600">${grade.text} · ${finalScore}分</div>
          <div style="width:200px;height:6px;background:var(--ivory-dark);border-radius:3px;margin:8px auto;overflow:hidden">
            <div style="height:100%;width:${finalScore}%;background:${grade.color};border-radius:3px;transition:width 1s ease"></div>
          </div>
        </div>
        <div class="ending-summary" style="margin-top:6px">
          <h3>📊 评分构成</h3>
          <div style="font-size:12px;line-height:1.9;color:var(--ink-light);background:var(--parchment-light);border:1px solid var(--parchment-dark);border-radius:10px;padding:10px 14px">
            ${breakdown.items.map(it => `<div style="display:flex;justify-content:space-between;gap:12px"><span>${App.escapeHtml(it.label)}<span style="opacity:.65;margin-left:6px">${App.escapeHtml(it.note)}</span></span><span style="color:${it.v >= 0 ? 'var(--gold-dark)' : 'var(--ui-danger)'};font-weight:700;white-space:nowrap">${it.v > 0 ? '+' : ''}${it.v}</span></div>`).join('')}
            <div style="display:flex;justify-content:space-between;margin-top:6px;padding-top:6px;border-top:1px dashed var(--parchment-dark);color:var(--ink);font-weight:700"><span>合计</span><span>${finalScore}分</span></div>
          </div>
        </div>
        <p class="ending-desc">${App.escapeHtml(ending.desc)}</p>
        ${scenarioGoalHtml}
        ${newAch && newAch.length ? `
        <div class="ending-summary" style="border:1px solid var(--gold);border-radius:10px;padding:10px 14px;background:linear-gradient(135deg, rgba(196,164,74,0.08), rgba(196,164,74,0.02))">
          <h3 style="color:var(--gold-dark)">🏆 新成就解锁</h3>
          <div style="display:grid;gap:6px;margin-top:6px">
            ${newAch.map(a => `
              <div style="font-size:12px;line-height:1.6;color:var(--ink);background:var(--parchment-light);border-radius:8px;padding:6px 10px">
                <span class="tier-${a.tier || 'bronze'}" style="font-weight:700">${a.tier === 'platinum' ? '💎' : a.tier === 'gold' ? '🥇' : a.tier === 'silver' ? '🥈' : '🥉'} ${App.escapeHtml(a.title || '未知成就')}</span>
                <span style="color:var(--ink-light)">：${App.escapeHtml(a.desc || '')}</span>
              </div>`).join('')}
          </div>
        </div>` : ''}
        ${newChallenges && newChallenges.length ? `
        <div class="ending-summary" style="border:1px solid var(--vermilion);border-radius:10px;padding:10px 14px;background:linear-gradient(135deg, rgba(139,29,29,0.08), rgba(139,29,29,0.02))">
          <h3 style="color:var(--vermilion)">🎯 新挑战达成本局推进</h3>
          <div style="display:grid;gap:6px;margin-top:6px">
            ${newChallenges.map(ch => `
              <div style="font-size:12px;line-height:1.6;color:var(--ink);background:var(--parchment-light);border-radius:8px;padding:6px 10px">
                <span style="font-weight:700">${App.escapeHtml(ch.icon || '🎯')} ${App.escapeHtml(ch.title || '未知挑战')}</span>
                <span style="color:var(--ink-light)">：${App.escapeHtml(ch.desc || '')}</span>
              </div>`).join('')}
          </div>
          <button type="button" class="btn btn-secondary" onclick="App.showChallenges()" style="margin-top:8px">查看全部挑战</button>
        </div>` : ''}
        <div class="ending-summary" style="border-left: 3px solid ${ending.color};padding-left:14px;font-style:italic;background:var(--parchment-warm)">
          <p style="font-size:12px;line-height:1.8;color:var(--ink-light)">${epilogue}</p>
        </div>
        <div class="ending-summary">
          <h3>✨ 本周目高光时刻</h3>
          <div style="font-size:12px;line-height:2;color:var(--ink-light);background:var(--parchment-light);border:1px solid var(--parchment-dark);border-radius:10px;padding:10px 14px">
            ${this.renderHighlights(p, h)}
          </div>
        </div>
        <div class="ending-summary">
          <h3>📋 人生总结</h3>
          <div class="summary-grid">
            <div><span>姓名</span><span>${App.escapeHtml(p.name)}</span></div>
            <div><span>性别</span><span>${App.escapeHtml(p.gender)}</span></div>
            <div><span>出身</span><span>${App.escapeHtml(p.background ? p.background.name : '未知')}</span></div>
            <div><span>享年</span><span>${p.age}岁</span></div>
            <div><span>最终评分</span><span style="color:${grade.color};font-weight:700">${grade.label}·${finalScore}分</span></div>
            <div><span>单位</span><span>${App.escapeHtml(p.unit ? p.unit.name : '无')}</span></div>
            <div><span>最终职务</span><span>${App.escapeHtml(engine.getCurrentPositionTitle ? engine.getCurrentPositionTitle() : engine.getRankLabel(p.leadershipRank))}</span></div>
            <div><span>最高职级</span><span>${App.escapeHtml(engine.getRankLabel ? engine.getRankLabel(p.leadershipRank) : p.leadershipRank + '级')}（${p.leadershipRank}级）</span></div>
            <div><span>晋升次数</span><span>${p.promotions}次</span></div>
            <div><span>工作年限</span><span>${p.yearsWorked}年</span></div>
            <div><span>上岸年龄</span><span>${p.ageOnshore}岁</span></div>
            <div><span>最终平台</span><span>${unitLevelLabel}</span></div>
            <div><span>跨级升迁</span><span>${p.unitUpgrades || 0}次</span></div>
          </div>
        </div>
        <div class="ending-summary">
          <h3>🗂️ 组织档案 · 卷宗留痕</h3>
          <div style="font-size:12px;line-height:1.9;color:var(--ink-light);background:var(--parchment-light);border:1px solid var(--parchment-dark);border-radius:10px;padding:10px 14px">
            <p style="font-style:italic;color:var(--ink)">「${App.escapeHtml(this.renderArchiveComment(p, h))}」</p>
            <div style="margin-top:8px;padding-top:8px;border-top:1px dashed var(--parchment-dark)">
              ${(p.careerLog || []).slice(-4).map(l => `<div style="font-size:11px;line-height:1.7">· ${l.year}岁 — ${App.escapeHtml(l.event)}</div>`).join('')}
            </div>
          </div>
        </div>
        <div class="ending-summary">
          <h3>🗺️ 人生大事时间轴</h3>
          <div class="career-timeline" style="max-height:260px;overflow-y:auto">
            ${this.renderLifeTimeline(p)}
          </div>
        </div>
        ${this.renderEndingCollection()}
        ${this.renderEncyclopedia(p)}
        ${this.renderAchievements()}
        <div class="sticky-action">
          <button class="btn btn-primary" onclick="App.playAgain()">再来一局</button>
          <button class="btn btn-secondary" onclick="App.shareEnding()" style="margin-top:8px">📤 生成分享卡</button>
          <button class="btn btn-secondary" onclick="App.exportStaticSharePoster(false)" style="margin-top:8px">🖼️ 下载人生长海报</button>
          <button class="btn btn-secondary" onclick="App.exportStaticSharePoster(true)" style="margin-top:8px">🪪 下载精简分享卡</button>
          <button class="btn btn-secondary" onclick="App.exportShareImage(engine.getPlayer(), engine.getHidden())" style="margin-top:8px">📤 导出分享图</button>
          <button class="btn btn-secondary" onclick="App.copyShareText(engine.getPlayer(), engine.getHidden())" style="margin-top:8px">📋 复制分享文本</button>
          <button class="btn btn-secondary" onclick="App.showHistory()" style="margin-top:8px">查看历史记录</button>
        </div>
      </div>
    `;
  },
  shareEnding() {
    const p = engine.getPlayer();
    const grade = this.getGrade(this.calculateFinalScore(p, engine.getHidden()));
    const endingNames = this.ENDING_NAMES; // v2.1.56 结局名单一来源（App.ENDING_NAMES）
    const unitText = p.unit ? p.unit.name : '无';
    const rankText = engine.getRankLabel ? engine.getRankLabel(p.leadershipRank) : (p.leadershipRank + '级');
    // 图鉴进度水印
    const prog = this.getCodexProgress();
    const achCount = this.achievements ? this.achievements.length : 0;
    const card = [
      '━━━ 🏛️ 上岸模拟器 ━━━',
      `姓名：${p.name}（${p.gender}）`,
      `出身：${p.background ? p.background.name : '未知'}`,
      `结局：${endingNames[p.ending] || p.ending}`,
      `评分：${grade.label} · ${grade.text}（${this.calculateFinalScore(p, engine.getHidden())}分）`,
      `上岸：${p.ageOnshore || '-'}岁 → ${unitText}`,
      `最终：${rankText} · ${unitText}（${p.unit ? p.unit.level : '-'}）`,
      `晋升：${p.promotions || 0}次 | 跨级：${p.unitUpgrades || 0}次 | 工龄：${p.yearsWorked || 0}年`,
      `婚姻：${p.isMarried ? '已婚' : '未婚'}${p.hasChildren ? ' · 有子女' : ''}`,
      `━━━━━━━━━━━━━━━`,
      `📖 图鉴进度：${prog.events}/${prog.total}事件 · ${prog.endings}/${prog.totalEndings}结局 · ${achCount}成就`,
      `🎮 来挑战我的记录？搜索"上岸模拟器"`,
      `你在${p.age}岁走完了这段人生。`
    ].join('\n');
    // v2.1.72 移动端 Web Share 优先：navigator.share 可用（微信/系统分享面板）直接唤起
    if (navigator.share && typeof navigator.canShare === 'function' && navigator.canShare({ text: card })) {
      navigator.share({ title: '上岸模拟器 · 仕途结算', text: card }).catch(() => this.showShareFallback(card));
    } else if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(card).then(() => this.showToast('📤 分享卡已复制', 'success')).catch(() => this.showShareFallback(card));
    } else {
      this.showShareFallback(card);
    }
  },
  showShareFallback(card) {
    const overlay = document.createElement('div');
    overlay.className = 'menu-overlay';
    overlay.innerHTML = __h(`<div class="menu-modal" role="dialog" aria-modal="true" aria-labelledby="share-title" style="text-align:center;max-width:340px">
      <h2 id="share-title" style="margin-bottom:10px">📤 分享卡</h2>
      <pre style="font-family:monospace;font-size:12px;line-height:1.6;background:var(--parchment-light);padding:12px;border-radius:8px;text-align:left;white-space:pre-wrap;word-break:break-all;max-height:300px;overflow-y:auto">${String(card).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}</pre>
      <button type="button" class="btn btn-primary" onclick="App.closeMenu()" style="margin-top:12px">关闭</button>
    </div>`);
    document.body.appendChild(overlay);
    if (typeof this.bindModalOverlay === 'function') this.bindModalOverlay(overlay);
  },
  checkAchievements(p) {
    const h = engine.getHidden();
    const candidates = [];
    const tierOrder = { platinum: 0, gold: 1, silver: 2, bronze: 3 };
    // 基础成就（仅保留有挑战性的）
    if (p.leadershipRank >= 6) candidates.push({ id: 'high_rank', title: '位高权重', desc: '职级达到正处级以上', tier: 'silver' });
    if (p.promotions >= 5) candidates.push({ id: 'fast_rise', title: '火箭晋升', desc: '晋升5次以上', tier: 'silver' });
    if (p.yearsWorked >= 20) candidates.push({ id: 'year_20', title: '二十载春秋', desc: '工作满20年', tier: 'silver' });
    if (p.ending === 'safe') candidates.push({ id: 'safe_retire', title: '安稳着陆', desc: '达成安稳退休结局', tier: 'silver' });
    if (p.unitUpgrades >= 2) candidates.push({ id: 'cross_level', title: '步步高升', desc: '跨级升迁2次以上', tier: 'gold' });
    if (p.ending === 'skyline') candidates.push({ id: 'skyline', title: '巅峰人生', desc: '达成巅峰人生结局', tier: 'gold' });
    if (p.ending === 'fast') candidates.push({ id: 'fast_promo', title: '青云直上', desc: '达成快速晋升结局', tier: 'gold' });
    if (p.leadershipRank >= 8) candidates.push({ id: 'rank_8', title: '封疆大吏', desc: '职级达到厅级以上', tier: 'gold' });
    if (p.promotions >= 8) candidates.push({ id: 'promo_8', title: '八面威风', desc: '晋升8次以上', tier: 'gold' });
    if (p.ageOnshore <= 22 && p.examAttempts === 1 && p.excellentPass && (p.interviewBaseScore || 0) >= 14) candidates.push({ id: 'prodigy', title: '天选之子', desc: '应届一次上岸且笔试面试双满分（22岁）', tier: 'platinum' });
    if (p.leadershipRank >= 10) candidates.push({ id: 'rank_10', title: '一人之下', desc: '职级达到正部级', tier: 'platinum' });
    if (p.promotions >= 10) candidates.push({ id: 'promo_10', title: '十全十美', desc: '晋升10次以上', tier: 'platinum' });
    if (p.yearsWorked >= 35 && p.leadershipRank >= 6) candidates.push({ id: 'year_35', title: '鞠躬尽瘁', desc: '工作满35年且职级达正处级以上', tier: 'platinum' });
    if (p.ending === 'arrest') candidates.push({ id: 'arrest', title: '铁窗泪', desc: '达成被抓结局', tier: 'platinum' });
    if (p.ending === 'burnout') candidates.push({ id: 'burnout', title: '蜡炬成灰', desc: '达成燃尽结局', tier: 'platinum' });
    if (p.ending === 'central') candidates.push({ id: 'central_peak', title: '位极人臣', desc: '达成中央殿堂结局（省级+党员+厅级遴选入京）', tier: 'platinum' });
    if (p.ending === 'reform') candidates.push({ id: 'reform_ending', title: '改革先锋', desc: '达成改革先锋结局', tier: 'gold' });
    if (p.ending === 'digital') candidates.push({ id: 'digital_ending', title: '数字先驱', desc: '达成数字先驱结局', tier: 'gold' });
    if (p.ending === 'grassroots') candidates.push({ id: 'grassroots_ending', title: '乡土守望', desc: '达成乡土守望结局（基层历练后留任扎根）', tier: 'silver' });
    if (p.ending === 'clean') candidates.push({ id: 'clean_ending', title: '清廉丰碑', desc: '达成清廉丰碑结局', tier: 'platinum' });

    // ====== 链式成就（精简，保留最有代表性的）=====
    if (p.flags.grassrootsDone && p.flags.grassrootsChose !== 'stay') candidates.push({ id: 'grassroots_star', title: '基层之星', desc: '完成基层历练并获得提拔', tier: 'silver' });
    if (p.flags.refusedBribe) candidates.push({ id: 'anti_corrupt', title: '反腐斗士', desc: '拒绝利益诱惑坚持原则', tier: 'gold' });
    if (p.flags.helpedCitizen || p.flags.petitionWork) candidates.push({ id: 'people_friend', title: '群众贴心人', desc: '真心实意为群众解决问题', tier: 'silver' });
    if (p.flags.reformProposal) candidates.push({ id: 'reform_pioneer', title: '改革新锐', desc: '提出并推动改革创新', tier: 'gold' });
    if (p.flags.crisisResponse) candidates.push({ id: 'crisis_expert', title: '危机处理专家', desc: '成功化解舆情危机', tier: 'gold' });
    if (p.flags.savedPerson) candidates.push({ id: 'hero', title: '见义勇为', desc: '路遇险情挺身而出', tier: 'gold' });
    if (p.flags.antiGang) candidates.push({ id: 'anti_gang', title: '扫黑英雄', desc: '在扫黑除恶中立功', tier: 'platinum' });
    if (p.flags.resigned) candidates.push({ id: 'resigned', title: '下海弄潮', desc: '辞职离开体制创业', tier: 'platinum' });
    if (p.flags.lawEnforcement) candidates.push({ id: 'law_enforcer', title: '执法标兵', desc: '严格执法不畏权势', tier: 'gold' });
    if (p.flags.dataPlatform) candidates.push({ id: 'digital_pioneer', title: '数字先锋', desc: '推动数字政府建设取得突破', tier: 'gold' });
    if (p.flags.teachJuniors) candidates.push({ id: 'teacher', title: '桃李满园', desc: '培养年轻干部成才', tier: 'silver' });
    if (p.flags.rescueOp) candidates.push({ id: 'emergency_hero', title: '抢险英雄', desc: '在突发灾害和应急抢险中表现突出', tier: 'platinum' });
    if (p.flags.ruralRevitalize) candidates.push({ id: 'rural_expert', title: '乡村振兴能手', desc: '推动乡村振兴示范村建设', tier: 'gold' });
    if (p.flags.provincialInspection) candidates.push({ id: 'inspection_expert', title: '督查专家', desc: '完成省级重大督查任务', tier: 'gold' });
    if (p.flags.housingFair) candidates.push({ id: 'housing_fair', title: '公平使者', desc: '确保保障房公平分配', tier: 'silver' });
    if (p.flags.employmentAid) candidates.push({ id: 'employment_hero', title: '就业帮扶', desc: '帮助困难群众实现就业', tier: 'silver' });
    if (p.flags.fairElection) candidates.push({ id: 'fair_election', title: '公正选举', desc: '确保村级换届风清气正', tier: 'silver' });
    if (p.flags.antiVillageBully) candidates.push({ id: 'village_justice', title: '乡村正义', desc: '铲除村霸为民除害', tier: 'gold' });
    if (p.flags.confrontRival) candidates.push({ id: 'rival_stand', title: '不畏强权', desc: '面对竞争对手暗算坚持底线', tier: 'silver' });
    if (p.flags.endureRival) candidates.push({ id: 'endure_win', title: '忍辱负重', desc: '在政敌打压下最终翻盘', tier: 'gold' });
    if (p.flags.selfReflect) candidates.push({ id: 'self_reflect', title: '知耻后勇', desc: '考核末位后奋起直追', tier: 'silver' });
    if (p.flags.eduBalance) candidates.push({ id: 'edu_pioneer', title: '教育先锋', desc: '推动教育均衡发展', tier: 'silver' });
    if (p.flags.healthcareReform) candidates.push({ id: 'health_reform', title: '医改先锋', desc: '推动医保改革惠及百姓', tier: 'gold' });
    if (p.flags.mergeAdapt) candidates.push({ id: 'merge_adapt', title: '改革应变', desc: '在机构改革中成功融入新团队', tier: 'silver' });
    if (p.flags.acceptRotation) candidates.push({ id: 'rotation_rise', title: '冷板凳逆袭', desc: '在轮岗冷门岗位上做出成绩', tier: 'silver' });
    if (p.flags.selfReport) candidates.push({ id: 'self_report', title: '主动交代', desc: '在风险预警中主动向组织说明', tier: 'bronze' });
    if (p.flags.cooperateInvestigation) candidates.push({ id: 'clear_innocent', title: '清白还我', desc: '配合调查洗清冤屈', tier: 'bronze' });
    if (p.flags.tookResponsibility) candidates.push({ id: 'take_responsibility', title: '敢于担当', desc: '主动承担责任请求处分', tier: 'silver' });

    // ====== v2.7 新系统成就（背景/财务/赌博/逃脱/债务/枢纽） ======
    if (p.flags.hub_recommend) candidates.push({ id: 'network_hub', title: '人脉枢纽', desc: '成为单位公认的"中间人"（背景平衡区枢纽链）', tier: 'silver' });
    // v2.55 人脉成就
    const namedContacts = ['noble', 'neighbor', 'classmate', 'mentor', 'hometown', 'subordinate', 'qingmei', 'chamber', 'veteran', 'elder', 'journalist', 'doctor'].filter(id => p.contacts && p.contacts.some(c => c.id === id));
    if (namedContacts.length >= 8) candidates.push({ id: 'socialite', title: '人脉之王', desc: '结识 8 位以上特色人物', tier: 'gold' });
    if ((p.contacts || []).filter(c => !c.enemy && (c.relation || 0) >= 60).length >= 4) candidates.push({ id: 'bosom_friends', title: '挚友成群', desc: '同时拥有 4 位以上挚友（关系 60+）', tier: 'silver' });
    if (p.flags.enemyEver && !(p.contacts || []).some(c => c.enemy)) candidates.push({ id: 'make_peace', title: '化敌为友', desc: '化解全部仇怨（曾树敌又尽数和解）', tier: 'gold' });
    if (p.flags.socialChoice) candidates.push({ id: 'social_butterfly', title: '社交达人', desc: '主动参加社交活动（社交选择）', tier: 'bronze' });
    if (p.contacts && p.contacts.some(c => c.id === 'subordinate' && (c.relation || 0) >= 80)) candidates.push({ id: 'mentor_teacher', title: '桃李满门', desc: '培养的下属与你交情深厚（关系 80+）', tier: 'silver' });
    if (p.flags.borrowed || p.flags.loanOnline) candidates.push({ id: 'debtor', title: '债台高筑', desc: '身陷债务危机（借贷消费/网络贷款）', tier: 'bronze' });
    if (p.flags.gamblingAddict) candidates.push({ id: 'gambler', title: '赌徒末路', desc: '染上赌瘾，牌局每隔几年就找上你', tier: 'bronze' });
    if (p.flags.escapedOnce) candidates.push({ id: 'escape_artist', title: '绝境脱身', desc: '在被抓边缘成功逃脱制裁', tier: 'gold' });
    if (p.flags.gambleStreak === 0 && !p.flags.gamblingAddict && p.careerLog && p.careerLog.some(l => l.event && l.event.indexOf('戒掉了赌瘾') >= 0)) candidates.push({ id: 'gamble_quit', title: '浪子回头', desc: '连续不赌，终于戒掉了赌瘾', tier: 'silver' });
    if (p.flags.centralDeferred) candidates.push({ id: 'central_deferred', title: '稳扎稳打', desc: '缓调一年后仍获中央调任', tier: 'gold' });

    // ====== v2.8 新增成就（20个） ======
    const a = engine.state.attrs || {};
    if (p.ending === 'grassroots_devotion') candidates.push({ id: 'grassroots_devotion_end', title: '基层奉献', desc: '达成基层奉献结局', tier: 'silver' });
    if (p.ending === 'tech_backbone') candidates.push({ id: 'tech_backbone_end', title: '技术骨干', desc: '达成技术骨干结局', tier: 'gold' });
    if (p.ending === 'people_champion') candidates.push({ id: 'people_champion_end', title: '民心所向', desc: '达成群众贴心人结局', tier: 'gold' });
    if (p.ending === 'reform_pioneer') candidates.push({ id: 'reform_pioneer_end', title: '改革旗手', desc: '达成改革先锋结局', tier: 'gold' });
    if (p.ending === 'honest_official') candidates.push({ id: 'honest_official_end', title: '一代清官', desc: '达成一代清官结局', tier: 'platinum' });
    // ====== v2.1.16 M1.7 新结局成就（举报英雄/著书立说/乡村振兴之星） ======
    if (p.ending === 'whistleblower_hero') candidates.push({ id: 'whistleblower_hero_end', title: '孤勇者', desc: '达成举报英雄结局——关键时刻站得出来', tier: 'platinum' });
    if (p.ending === 'author_legacy') candidates.push({ id: 'author_legacy_end', title: '立言传世', desc: '达成著书立说结局——桃李满园', tier: 'gold' });
    if (p.ending === 'rural_star') candidates.push({ id: 'rural_star_end', title: '田野荣光', desc: '达成乡村振兴之星结局——荒村变示范村', tier: 'gold' });
    // ====== v2.24 时代结局成就 ======
    if (p.ending === 'era_reform') candidates.push({ id: 'era_reform_end', title: '时代弄潮儿', desc: '改革年代达成弄潮儿结局', tier: 'gold' });
    if (p.ending === 'era_rectify') candidates.push({ id: 'era_rectify_end', title: '清流砥柱', desc: '整顿年代达成清流砥柱结局', tier: 'gold' });
    // ====== v2.26 家庭二期成就（子女职业选择与培养） ======
    if ((p.childEducation || 0) >= 4 && (p.childCompany || 0) >= 2) candidates.push({ id: 'child_raising', title: '教子有方', desc: '教育投入4次+陪伴2次以上', tier: 'gold' });
    if (p.flags && p.flags.childCareerOfficial) candidates.push({ id: 'child_official', title: '将门出虎子', desc: '孩子考编上岸，两代体制人', tier: 'gold' });
    if (p.flags && p.flags.childCareerBusiness) candidates.push({ id: 'child_business', title: '商海二代', desc: '孩子下海经商做出成绩', tier: 'silver' });
    if (p.flags && p.flags.childCareerFree) candidates.push({ id: 'child_free', title: '儿孙自有儿孙福', desc: '尊重孩子选择了自己的路', tier: 'silver' });
    if (p.ending === 'patron_legacy') candidates.push({ id: 'patron_legacy_end', title: '大树成荫', desc: '贵人关系深厚且至高位', tier: 'platinum' });
    if (p.ending === 'lifelong_friend') candidates.push({ id: 'lifelong_friend_end', title: '莫逆之交', desc: '老友关系贯穿一生', tier: 'silver' });
    if (p.ending === 'hometown_net') candidates.push({ id: 'hometown_net_end', title: '桑梓情深', desc: '邻里网络扎根基层', tier: 'gold' });
    if (p.ending === 'estranged_hero') candidates.push({ id: 'estranged_hero_end', title: '曲高和寡', desc: '群众爱戴但组织不待见（悲情线）', tier: 'silver' });
    // v2.48 子女成才压力曲线成就
    if ((p.childEducation || 0) >= 5) candidates.push({ id: 'child_edu_5', title: '望子成龙', desc: '教育投入累计5次', tier: 'gold' });
    if ((p.childCompany || 0) >= 5) candidates.push({ id: 'child_company_5', title: '寸草春晖', desc: '陪伴成长累计5次', tier: 'gold' });
    if (p.excellentPass && p.examAttempts === 1) candidates.push({ id: 'perfect_written', title: '笔试满分', desc: '首次考试笔试全部答对', tier: 'gold' });
    if ((p.interviewBaseScore || 0) >= 15) candidates.push({ id: 'perfect_interview', title: '面试满分', desc: '面试三题全部拿到最优答案（基础分15满分）', tier: 'gold' });
    if (p.passed && p.examAttempts === 1) candidates.push({ id: 'first_onshore', title: '首次上岸', desc: '第一次考试即通过', tier: 'silver' });
    if (p.careerLog) {
      const upYears = p.careerLog.filter(l => l.special === 'upgrade').map(l => l.year).sort((x, y) => x - y);
      let maxC = 0, curC = 0, prevY = -1;
      for (const y of upYears) { if (y === prevY + 1) { curC++; if (curC > maxC) maxC = curC; } else { curC = 1; } prevY = y; }
      if (maxC >= 3) candidates.push({ id: 'consecutive_promo3', title: '连续晋升', desc: '连续3年获得晋升', tier: 'gold' });
    }
    if (p.unitLevel === 0 && p.yearsWorked >= 20) candidates.push({ id: 'grassroots_model', title: '基层标兵', desc: '在基层工作满20年', tier: 'silver' });
    if (h.integrity > 80) candidates.push({ id: 'integrity_model', title: '廉洁楷模', desc: '廉洁度保持在80以上', tier: 'gold' });
    if (p.yearsWorked >= 10 && !p.flags.everRested) candidates.push({ id: 'full_attendance', title: '全勤奖', desc: '工作满10年从未休整', tier: 'silver' });
    if (h.background > 50) candidates.push({ id: 'network_master', title: '人脉达人', desc: '人脉背景值超过50', tier: 'silver' });
    if (h.workAbility > 90) candidates.push({ id: 'workaholic', title: '工作狂', desc: '工作能力超过90', tier: 'gold' });
    if (p.flags && p.flags.healthStable) candidates.push({ id: 'health_warrior', title: '战胜病魔', desc: '查出健康问题后调理康复，安然回归', tier: 'bronze' }); // v2.63 健康链完成度成就
    // v2.1.43 事件链系统成就
    if (p.flags && p.flags.resolveCorruption) candidates.push({ id: 'anti_corruption_pioneer', title: '反腐先锋', desc: '实名举报并配合组织查清问题', tier: 'gold' });
    if (p.flags && p.flags.villageLegacy) candidates.push({ id: 'grassroots_rooted', title: '扎根基层', desc: '挂职下乡扎实干事，期满群众认可', tier: 'silver' });
    if (a.iq >= 15) candidates.push({ id: 'scholar', title: '学霸', desc: '智商达到15（满上限）', tier: 'gold' });
    if (a.eq >= 15) candidates.push({ id: 'popularity_king', title: '人气王', desc: '情商达到15（满上限）', tier: 'gold' });
    if (a.body > 10) candidates.push({ id: 'iron_man', title: '铁人', desc: '体质超过10', tier: 'silver' });
    if (a.luck > 12) candidates.push({ id: 'lucky_one', title: '幸运儿', desc: '运气超过12', tier: 'silver' });
    var cashVal = p.finance ? p.finance.cash : (p.wealth || 0);
    if (cashVal >= 250) candidates.push({ id: 'wealthy_100', title: '富甲一方', desc: '现金积累超过250万', tier: 'gold' });
    if (h.positionWeight < 5 && h.workAbility > 80) candidates.push({ id: 'low_profile', title: '低调达人', desc: '职权低但工作能力突出', tier: 'silver' });
    if ((p.flags.reformCount || 0) >= 2) candidates.push({ id: 'reform_master', title: '改革老将', desc: '参与2次以上改革事件', tier: 'gold' });
    if ((p.flags.peopleEventCount || 0) >= 10) candidates.push({ id: 'people_champion_ach', title: '群众信赖', desc: '处理10次以上群众事件', tier: 'gold' });
    if (h.risk < 5 && p.yearsWorked >= 10) candidates.push({ id: 'honest_official_ach', title: '清官', desc: '风险值全程低于5', tier: 'platinum' });
    if (p.unit && (p.unit.system === '技术部门' || p.unit.system === '数据部门') && p.yearsWorked >= 15) candidates.push({ id: 'tech_backbone_ach', title: '技术中坚', desc: '在技术岗工作满15年', tier: 'gold' });
    if (p.passed && p.examAttempts === 1 && p.ageOnshore <= 23) candidates.push({ id: 'sprint_onshore', title: '百日冲刺', desc: '从备考到上岸不超过1年', tier: 'silver' });

    // ====== 多局累计成就 ======
    if (this.stats.plays >= 5) candidates.push({ id: 'plays_5', title: '初出茅庐', desc: '累计玩满5局', tier: 'bronze' });
    if (this.stats.plays >= 20) candidates.push({ id: 'plays_20', title: '轻车熟路', desc: '累计玩满20局', tier: 'silver' });
    if (this.stats.plays >= 50) candidates.push({ id: 'plays_50', title: '体制老手', desc: '累计玩满50局', tier: 'gold' });
    if (this.stats.plays >= 100) candidates.push({ id: 'plays_100', title: '百局达阵', desc: '累计玩满100局', tier: 'platinum' });
    if (this.stats.totalPromos >= 50) candidates.push({ id: 'total_promo_50', title: '厚积薄发', desc: '累计晋升50次', tier: 'silver' });
    if (this.stats.totalPromos >= 200) candidates.push({ id: 'total_promo_200', title: '千锤百炼', desc: '累计晋升200次', tier: 'gold' });
    if (this.stats.totalPromos >= 500) candidates.push({ id: 'total_promo_500', title: '登峰造极', desc: '累计晋升500次', tier: 'platinum' });
    var endingCount = Object.keys(this.stats.endings || {}).length;
    if (endingCount >= 5) candidates.push({ id: 'ending_5', title: '结局收集者', desc: '解锁5种不同结局', tier: 'silver' });
    if (endingCount >= 18) candidates.push({ id: 'ending_18', title: '全结局制霸', desc: '解锁18种不同结局（共27种）', tier: 'platinum' });
    if (endingCount >= 13) candidates.push({ id: 'ending_13', title: '结局大师', desc: '解锁13种不同结局', tier: 'gold' });

    // v2.57 修复：过滤已解锁的（去重），按品质排序——全部入档（此前 slice(0,5) 导致 bronze/silver 成就被截断永久丢失），返回 top5 供弹窗展示
    const seen = new Set(this.achievements.map(x => x.id));
    const newAch = candidates
      .filter(a => a && a.id && !seen.has(a.id))
      .sort((a, b) => tierOrder[a.tier || 'bronze'] - tierOrder[b.tier || 'bronze']);
    for (const a of newAch) {
      if (!a.id || !a.tier || !a.title) continue;
      seen.add(a.id);
      this.achievements.push(a);
      localStorage.setItem('gameAchievements', JSON.stringify(this.achievements));
    }
    return newAch.slice(0, 5); // 弹窗最多展示 5 个（入档不受限）
  },
  getScoreBreakdown(p, h) {
    // v2.1.6 评分构成：计算各分项供结算页「评分构成」展示；calculateFinalScore 委托本方法（总分单点维护）
    const items = [];
    const endingScores = { central: 35, skyline: 25, fast: 20, reform: 20, clean: 22, digital: 18, grassroots: 18, safe: 15, entrepreneur: 12, ordinary: 8, edge: 5, burnout: 0, arrest: -5, grassroots_devotion: 15, tech_backbone: 15, people_champion: 16, reform_pioneer: 18, honest_official: 22, era_reform: 20, era_rectify: 22, patron_legacy: 22, lifelong_friend: 14, hometown_net: 16, estranged_hero: 14, whistleblower_hero: 20, author_legacy: 16, rural_star: 18 };
    const endingNames = { central: '中央殿堂', skyline: '巅峰人生', fast: '快速晋升', reform: '改革先锋', clean: '清廉丰碑', digital: '数字先驱', grassroots: '乡土守望', safe: '安稳退休', entrepreneur: '下海人生', ordinary: '平凡人生', edge: '边缘化', burnout: '燃尽', arrest: '被抓', grassroots_devotion: '基层奉献', tech_backbone: '技术骨干', people_champion: '群众贴心人', reform_pioneer: '改革旗手', honest_official: '清官', era_reform: '弄潮儿', era_rectify: '清流', patron_legacy: '大树成荫', lifelong_friend: '莫逆之交', hometown_net: '桑梓情深', estranged_hero: '孤胆英雄', whistleblower_hero: '举报英雄', author_legacy: '著书立说', rural_star: '乡村振兴之星' };
    let score = 0;
    const add = (label, v, note) => {
      if (v === 0) return;
      items.push({ label, v: Math.round(v * 100) / 100, note: note || '' });
      score += v;
    };
    // 志向达成奖励（+8分）
    if (engine.checkAmbition && engine.checkAmbition() === 'achieved') add('志向达成', 8, '实现人生志向');
    // 职级分（最高30分）
    add('职级', Math.min(p.leadershipRank * 2.5, 30), p.leadershipRank + '级');
    // 晋升分（最高12分）
    add('晋升', Math.min(p.promotions * 2, 12), p.promotions + '次');
    // 跨级分（每次6分，最高30分）
    add('跨级', Math.min((p.unitUpgrades || 0) * 6, 30), (p.unitUpgrades || 0) + '次');
    // 上岸年龄分（最高10分：22岁=10分，27岁=4分，30岁=1.6分）
    if (p.ageOnshore > 0) add('上岸年龄', Math.max(0, 10 - (p.ageOnshore - 22) * 1.2), p.ageOnshore + '岁');
    // 结局分（v2.49e：清廉道德结局 clean/honest_official/era_rectify 20→22，缩小与权力巅峰 skyline 25 的差距、显性化道德回报；skyline 保持 25 保留权力巅峰略高）
    add('结局', endingScores[p.ending] || 8, endingNames[p.ending] || '平凡人生');
    // 廉洁/风险
    if (h.integrity > 60) add('廉洁', 3, '一生清廉');
    if (h.risk > 60) add('风险', -5, '高风险生涯');
    // 背景/人脉
    add('背景', Math.min(h.background / 8, 6), '家族助力');
    // 职权影响
    add('职权', Math.min(h.positionWeight / 8, 6), '权责份量');
    // 声誉
    add('声誉', Math.min(p.reputation / 12, 5), p.reputation + '声望');
    // 人生维度
    if (p.isMarried) add('婚姻', 2, '成家立业');
    if (p.hasChildren) add('子女', 2, '后继有人');
    add('工龄', Math.min(p.yearsWorked / 5, 5), p.yearsWorked + '年');
    // 总分控制在0-100
    const total = Math.max(0, Math.min(100, Math.round(score)));
    return { total, items };
  },
  calculateFinalScore(p, h) {
    return this.getScoreBreakdown(p, h).total;
  },
  getGrade(score) {
    if (score >= 90) return { label: 'S', color: 'var(--grade-s)', text: '一代传奇' };
    if (score >= 75) return { label: 'A', color: 'var(--ui-green)', text: '卓越成就' };
    if (score >= 58) return { label: 'B', color: 'var(--ui-blue)', text: '良好生涯' };
    if (score >= 38) return { label: 'C', color: 'var(--ui-amber)', text: '中规中矩' };
    if (score >= 18) return { label: 'D', color: 'var(--grade-d)', text: '坎坷前行' };
    return { label: 'F', color: 'var(--ui-danger)', text: '蹉跎岁月' };
  },
  renderAchievements() {
    if (!this.achievements || this.achievements.length === 0) return '';
    const tiers = { bronze: '🥉 铜牌', silver: '🥈 银牌', gold: '🥇 金牌', platinum: '💎 铂金' };
    const tierColors = { bronze: '#CD7F32', silver: '#A0A0A0', gold: '#FFD700', platinum: '#E5E4E2' };
    const tierEmoji = { bronze: '🥉', silver: '🥈', gold: '🥇', platinum: '💎' };
    return `
      <div class="achievements">
        <h3>🏆 成就 (${this.achievements.length})</h3>
        ${Object.entries(tiers).map(([tier, label]) => {
          const tierAch = this.achievements.filter(a => a.tier === tier);
          if (tierAch.length === 0) return '';
          return `
            <div style="margin-bottom:8px">
              <p class="tier-${tier}" style="font-size:11px;font-weight:600;margin-bottom:4px">${label}</p>
              <div class="achievement-grid">
                ${tierAch.map(a => `
                  <div class="achievement-badge unlocked" style="border-color:${tierColors[tier]}">
                    <span class="ach-icon">${tierEmoji[tier]}</span>
                    <span class="ach-title">${App.escapeHtml(a.title || '未知成就')}</span>
                    <span class="ach-desc">${App.escapeHtml(a.desc || '')}</span>
                  </div>
                `).join('')}
              </div>
            </div>`;
        }).join('')}
      </div>
    `;
  },
  renderLifeTimeline(p) {
    const log = p.careerLog || [];
    if (log.length === 0) return '<p style="color:var(--ink-lighter);font-size:12px">暂无记录</p>';
    const milestones = [];
    // 上岸
    if (p.ageOnshore) milestones.push({ year: p.ageOnshore, text: '上岸入职 ' + (p.unit ? p.unit.name : ''), icon: '🎓' });
    log.forEach(l => {
      if (!l || !l.event) return;
      const t = l.event;
      let icon = '📋';
      if (l.special === 'upgrade' || /晋升|提拔|转正|调任至中央|突破/.test(t)) icon = '🏆';
      else if (l.special === 'demotion' || /降级|边缘化|排挤/.test(t)) icon = '⚠️';
      else if (/基层|下派|历练/.test(t)) icon = '🌾';
      else if (l.special === 'transfer' || /平调|调任|轮岗|交流/.test(t)) icon = '🔄';
      else if (/结婚|领证|婚/.test(t)) icon = '💍';
      else if (/孩子|生子|喜得贵子|育儿|亲子/.test(t)) icon = '👶';
      else if (/基层|下派|历练/.test(t)) icon = '🌾';
      else if (/面试|笔试|上岸|考/.test(t)) icon = '📝';
      milestones.push({ year: l.year, text: t, icon });
    });
    // 去重&排序（按年份）
    const seen = new Set();
    const unique = milestones.filter(m => {
      const key = m.year + m.text;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }).sort((a, b) => a.year - b.year);
    if (unique.length === 0) return '<p style="color:var(--ink-lighter);font-size:12px">暂无记录</p>';
    // v2.23 修复：此前 slice(-40) 只显示最近 40 条，长生涯（40+ 年）的早期人生大事（上岸/结婚/生子）被截断；容器自带 260px 滚动，全部展示
    return unique.map(m => `
      <div class="timeline-item">
        <span class="timeline-year">${m.year}岁</span>
        <span class="timeline-icon">${m.icon}</span>
        <span class="timeline-event">${App.escapeHtml(m.text)}</span>
      </div>
    `).join('');
  },
  renderEncyclopedia(p) {
    const prog = this.getCodexProgress();
    const total = (typeof GameData !== 'undefined' && GameData.events) ? GameData.events.length : 0;
    if (!total) return '';
    const pct = prog.eventsPct;
    const reward = this.getCodexReward();
    // v2.42 事件图鉴页：过滤 + 已触发高亮
    this._encySeen = new Set((p.seenEvents || []));
    this._ency = this._ency || { stage: 'all', era: 'all' };
    const stageTabs = [['all', '全部'], ['work', '工作'], ['life', '生活'], ['career', '仕途'], ['other', '其他']];
    const eraTabs = [['all', '全部时代'], ['reform', '改革'], ['stable', '平稳'], ['rectify', '整顿']];
    const tabBtn = (key, val, label, kind) => `<button class="btn ${this._ency[kind] === val ? 'btn-primary' : 'btn-secondary'}" style="padding:2px 10px;font-size:11px;margin-right:4px" onclick="App.encyFilter('${kind}', '${val}')">${label}</button>`;
    return `
      <div class="ending-summary">
        <h3>📖 人生见闻图鉴 <span style="font-size:12px;color:var(--ink-lighter);font-weight:normal">累计 ${prog.events} / ${total}（${pct}%）</span></h3>
        <div style="height:8px;background:var(--ivory-dark);border-radius:4px;overflow:hidden">
          <div style="height:100%;width:${pct}%;background:linear-gradient(90deg,var(--ui-blue),var(--vermilion));border-radius:4px;transition:width .6s"></div>
        </div>
        <p style="font-size:11px;color:var(--ink-lighter);margin-top:6px">✅ 已触发 · ❓ 未触发。换个出身、专业与选择，故事截然不同。${reward.bonus > 0 ? `当前图鉴奖励：<strong style="color:var(--vermilion)">${App.escapeHtml(reward.title || '')}</strong>（+${reward.bonus} 天赋点/局）` : ''}</p>
        <div style="margin-top:8px;padding:8px 10px;background:var(--parchment-light);border:1px solid var(--parchment-dark);border-radius:8px">
          <div style="display:flex;align-items:center;gap:4px;flex-wrap:wrap;margin-bottom:4px"><span style="font-size:11px;color:var(--ink-lighter)">阶段</span>${stageTabs.map(([v, l]) => tabBtn('stage', v, l, 'stage')).join('')}</div>
          <div style="display:flex;align-items:center;gap:4px;flex-wrap:wrap"><span style="font-size:11px;color:var(--ink-lighter)">时代</span>${eraTabs.map(([v, l]) => tabBtn('era', v, l, 'era')).join('')}</div>
        </div>
        <div id="ency-body" style="margin-top:10px;max-height:420px;overflow-y:auto;border:1px solid var(--parchment-dark);border-radius:8px;padding:8px">${this.renderEncyBody()}</div>
      </div>
    `;
  },
  // v2.42 图鉴事件列表体（过滤后渲染；expand=true 时渲染全部）
  renderEncyBody(expand) {
    const f = this._ency;
    const all = GameData.events || [];
    const seen = this._encySeen;
    const stOk = (e) => {
      if (f.stage === 'all') return true;
      const st = e.stage || 'life';
      if (f.stage === 'other') return !['work', 'life', 'career', 'spec'].includes(st);
      return st === f.stage;
    };
    const eraOk = (e) => {
      if (f.era === 'all') return true;
      const eras = e.era || (e.pools && e.pools.includes('era_reform') ? ['reform'] : e.pools && e.pools.includes('era_rectify') ? ['rectify'] : e.pools && e.pools.includes('era_stable') ? ['stable'] : null);
      return !!eras && eras.includes(f.era);
    };
    let list = all.filter(e => stOk(e) && eraOk(e));
    const got = list.filter(e => seen.has(e.id)).length;
    const card = (e) => {
      const hit = seen.has(e.id);
      const eraTag = e.era ? `<span style="font-size:10px;color:var(--ui-text-muted);background:var(--parchment);border-radius:4px;padding:0 4px;margin-left:4px">${e.era.includes('reform') ? '改革' : e.era.includes('rectify') ? '整顿' : '平稳'}代</span>` : '';
      return `<div style="padding:5px 8px;margin:3px 0;border-radius:6px;background:${hit ? 'rgba(46,125,50,0.08)' : 'var(--parchment)'};border-left:3px solid ${hit ? 'var(--ui-green)' : 'var(--ui-line-strong)'};font-size:12px;color:${hit ? 'var(--ink)' : 'var(--ink-lighter)'}" title="${App.escapeHtml((e.text || e.title || '').slice(0, 60))}${(e.text || e.title || '').length > 60 ? '…' : ''}">
        <span style="margin-right:6px">${hit ? '✅' : '❓'}</span>${App.escapeHtml(e.title)}${eraTag}<span style="float:right;font-size:10px;color:var(--ink-lighter)">${e.id}</span>
      </div>`;
    };
    if (!list.length) return '<div style="font-size:12px;color:var(--ink-lighter);padding:12px;text-align:center">该分类下暂无事件</div>';
    const sorted = [...list].sort((a, b) => Number(seen.has(b.id)) - Number(seen.has(a.id)));
    const SHOW = 40;
    const visible = expand ? sorted : sorted.slice(0, SHOW);
    const hidden = sorted.length - SHOW;
    const top = `<div style="font-size:11px;color:var(--ink-lighter);margin-bottom:6px">本类 ${list.length} 条 · 已触发 ${got} 条${f.era === 'all' ? '（未触发优先展示）' : ''}</div>`;
    if (hidden <= 0) return top + visible.map(card).join('');
    // v2.42 性能：初始只渲染前 40 条，"展开全部"时再渲染完整列表
    this._encyAll = sorted;
    return top + visible.map(card).join('')
      + `<button class="btn btn-secondary" style="width:100%;padding:4px;font-size:11px;margin-top:6px" onclick="App.encyExpandAll()">展开全部 ${hidden} 条</button>`;
  },
  // v2.42 图鉴过滤切换（点击过滤按钮时只重渲染列表体，不滚动页面）
  encyFilter(kind, val) {
    if (!this._ency) this._ency = { stage: 'all', era: 'all' };
    this._ency[kind] = val;
    const body = document.getElementById('ency-body');
    if (body) body.innerHTML = __h(this.renderEncyBody());
  },
  encyExpandAll() {
    const body = document.getElementById('ency-body');
    if (body && this._encyAll) body.innerHTML = __h(this.renderEncyBody(true));
  },
  renderHighlights(p, h) {
    const lines = [];
    const log = p.careerLog || [];
    // 晋升高光
    const promos = log.filter(l => l.special === 'upgrade');
    if (promos.length > 0) lines.push(`🏆 你一生经历 <b>${promos.length} 次晋升</b>，最近一次在 ${promos[promos.length - 1].year}岁：${promos[promos.length - 1].event}`);
    // 基层历练
    if (p.flags && p.flags.grassrootsDone) lines.push('🌾 你曾下派基层历练，体验过与机关完全不同的烟火气');
    if (p.flags && p.flags.grassrootsChose === 'stay') lines.push('🌾 基层历练后你选择扎根当地，成了那里的主心骨');
    // 婚姻子女
    if (p.isMarried) lines.push('💍 你在体制内找到了携手同行的人，' + (p.hasChildren ? '组建了家庭、迎来新生命' : '结为伴侣'));
    // 廉政
    if (p.flags && p.flags.refusedBribe) lines.push('💪 面对诱惑，你 ' + (p.flags.refusedBribe === true ? '拒绝了' : '拒绝了') + ' 数次请托与利益，守住了底线');
    if (p.flags && p.flags.tookBribe) lines.push('⚠️ 你曾在利益面前动摇，这件事最终成了你人生的一部分');
    // 调查经历
    if (p.flags && p.flags.selfSurrender) lines.push('🕊️ 被调查时你选择坦白自首，保住了最后的体面');
    if (p.flags && p.flags.defied) lines.push('⚖️ 面对调查你选择对抗到底，也选择了自己的结局');
    // 中央
    if (p.unitLevel === 4) lines.push('🏯 你最终进入了国家权力核心，站在了体制的最顶端');
    // 重要成就事件（从 careerLog 关键词）
    const keywords = [
      ['人大代表', '🏛️ 你当选过人大代表'],
      ['先进', '🏅 你多次获评先进工作者'],
      ['优秀', '🏅 你的工作多次获得表彰'],
      ['中央调任', '🏯 你获得中央调任的殊荣'],
      ['下派', '🌾 你经历过下派锻炼'],
      ['调研', '📋 你多次带队深入基层调研'],
      ['驻村', '🌾 你参与过驻村帮扶'],
      ['抗疫', '🦠 你在疫情期间坚守一线'],
      ['见义勇为', '🦸 你曾见义勇为'],
      ['献血', '🩸 你参加过无偿献血'],
      ['著书', '📖 你出版过著作'],
      ['马拉松', '🏃 你跑过马拉松'],
      ['入党', '🚩 你光荣入党']
    ];
    keywords.forEach(([kw, text]) => { if (log.some(l => (l.event || '').includes(kw)) && !lines.some(x => x.includes(text.substring(0, 4)))) lines.push(text); });
    // 最终统计
    lines.push(`📊 你累计工作 <b>${p.yearsWorked} 年</b>，从 ${p.ageOnshore}岁上岸走到 ${p.age}岁收官，${p.promotions}次晋升、${p.unitUpgrades || 0}次跨级`);
    if (p.wealth !== undefined) lines.push(`💰 你一生积累财富 <b>${p.wealth}</b>${p.wealth > 100 ? '，足以安度晚年' : p.wealth > 30 ? '，日子过得安稳' : '，虽不宽裕但也知足'}`);
    // v2.55 人脉概况
    if (p.contacts && p.contacts.length > 0) {
      const friends = p.contacts.filter(c => !c.enemy && (c.relation || 0) >= 60).length;
      const enemies = p.contacts.filter(c => c.enemy).length;
      lines.push(`🤝 你一生结识 <b>${p.contacts.length} 位</b>故交，其中挚友 ${friends} 位${enemies > 0 ? `，结怨对象 ${enemies} 人` : '，无结怨之人'}`);
    }
    return lines.map(l => `<div style="padding:3px 0">${l}</div>`).join('');
  },
  renderEndingCollection() {
    const all = this.ALL_ENDINGS || [];
    const names = { skyline: '巅峰人生', fast: '快速晋升', safe: '安稳退休', ordinary: '平凡人生', edge: '边缘化', arrest: '被抓', burnout: '燃尽', central: '中央殿堂', entrepreneur: '下海人生', reform: '改革先锋', digital: '数字先驱', grassroots: '乡土守望', clean: '清廉丰碑', grassroots_devotion: '基层奉献', tech_backbone: '技术骨干', people_champion: '群众贴心人', reform_pioneer: '改革先锋', honest_official: '一代清官', era_reform: '时代弄潮儿', era_rectify: '清流砥柱', patron_legacy: '大树成荫', lifelong_friend: '莫逆之交', hometown_net: '桑梓情深', estranged_hero: '曲高和寡', whistleblower_hero: '举报英雄', author_legacy: '著书立说', rural_star: '乡村振兴之星' };
    const hints = { skyline: '厅级以上+地市级+高声誉', fast: '晋升快+欲望强', safe: '处级以上+低风险+家庭和睦', ordinary: '随波逐流', edge: '长期未晋升/被边缘化', arrest: '贪腐被查', burnout: '高压燃尽', central: '中央单位+副部级以上+低风险+党员', entrepreneur: '辞职下海', reform: '改革建议被采纳（改革链事件）', digital: '数据平台建成（技术/数据部门）', grassroots: '基层历练后留任扎根', clean: '拒绝贿赂+高廉洁（清廉路线）', grassroots_devotion: '乡镇/街道工作15年以上+廉洁无腐', tech_backbone: '技术/数据岗+工作能力85以上+智商8以上', people_champion: '处理群众事件10次以上+情商8以上+廉洁65以上', reform_pioneer: '参与2次以上改革事件+职务权重15以上', honest_official: '廉洁80以上+风险10以下+工作20年以上+无腐败', era_reform: '改革年代+改革链事件2次以上+厅级以上+高声誉', era_rectify: '整顿年代+廉洁75以上+反腐实绩+处级以上', patron_legacy: '贵人关系85以上+职务厅级以上+低风险', lifelong_friend: '老同学关系80以上+低风险+声誉良好', hometown_net: '邻里关系80以上+基层工作20年以上', estranged_hero: '民间口碑75以上+组织印象40以下+基层（悲情线）', whistleblower_hero: '举报链完整（匿名举报→配合调查→专案外围→风清月明）+廉洁60以上', author_legacy: '著书立说（bookPublished 专著出版）+工作能力55以上', rural_star: '乡村振兴示范村（ruralRevitalize）+基层工作10年以上+口碑60以上' };
    const stats = this.stats && this.stats.endings ? this.stats.endings : {};
    const got = all.filter(e => stats[e] > 0).length;
    const cells = all.map(e => {
      const unlocked = stats[e] > 0;
      return `<div style="flex:1;min-width:70px;padding:6px;border-radius:6px;text-align:center;border:1px solid ${unlocked ? 'var(--vermilion)' : 'var(--parchment-dark)'};background:${unlocked ? 'rgba(139,29,29,0.05)' : 'var(--parchment)'}" title="${hints[e] || ''}">
        <div style="font-size:16px">${unlocked ? '✅' : '❓'}</div>
        <div style="font-size:11px;color:${unlocked ? 'var(--vermilion)' : 'var(--ink-lighter)'};margin-top:2px">${names[e]}</div>
      </div>`;
    }).join('');
    return `
      <div class="ending-summary">
        <h3>🏆 结局收集 <span style="font-size:12px;color:var(--ink-lighter);font-weight:normal">${got}/${all.length}</span></h3>
        <div style="display:flex;flex-wrap:wrap;gap:6px">${cells}</div>
        <p style="font-size:11px;color:var(--ink-lighter);margin-top:6px">悬停查看达成条件，尝试不同的人生选择集齐所有结局。</p>
      </div>
    `;
  },
});

document.addEventListener('DOMContentLoaded', () => App.init());
