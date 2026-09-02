// ===== 新增工作类主题包 =====
// id 范围：enw001~enw172（172条） | 装配：js/data/data.js → GameData.events | v2.1.66 头注释标准化（分类学见 docs/architecture/EVENT-SYSTEM-ARCHITECTURE.md）
// 定位：材料写作/会议/督查等工作子类，文件内以子类注释分组
const gd_events_new_work = [
    // ---------- 材料写作类（15个） ----------
    { id: 'enw001', stage: 'work', eventType: 'choice', weight: 7, title: '领导讲话稿', text: '领导让你起草一个讲话稿，特意交代"要有高度，也要接地气"。你在"高度"和"地气"之间反复弹跳，膝盖先扛不住了。', choices: [
      { text: '翻遍领导近半年讲话，模仿其语言风格', effects: {workAbility: 3, eq: 1, mentalPressure: 2} },
      { text: '找兄弟单位要一份类似稿件作参考', effects: {background: 2, workAbility: 2, risk: 1} },
      { text: '大胆融入新提法，做出辨识度', effects: {iq: 2, positionWeight: 2, risk: 3, mentalPressure: 3} },
      { text: '请老笔杆子帮忙把把关', effects: {eq: 1, workAbility: 2, mentalPressure: -1} },
    ]},
    { id: 'enw002', stage: 'work', eventType: 'choice', weight: 6, title: '汇报材料', text: '一份汇报材料改到第七稿，领导说"方向不对"。你忽然意识到，前六稿改的都是文字，第七稿要改的是方向。', choices: [
      { text: '当面请领导讲清思路再动笔', effects: {eq: 1, workAbility: 2, mentalPressure: 1} },
      { text: '按自己理解重写一版框架', effects: {workAbility: 3, iq: 1, risk: 2, mentalPressure: 3} },
      { text: '找分管副职先对一下思路', effects: {background: 2, eq: 1, mentalPressure: -1} },
    ]},
    { id: 'enw003', stage: 'work', eventType: 'choice', weight: 5, title: '调研报告', text: '一份调研报告要交了，可你只去调研了一天，其中半天在车上。报告得写出"问题导向"和"基层声音"。', choices: [
      { text: '补打电话核实数据，把样本说细一点', effects: {workAbility: 3, integrity: 2, mentalPressure: 3} },
      { text: '把已有素材重新组合，措辞讲究些', effects: {workAbility: 2, iq: 1, risk: 2} },
      { text: '如实说明调研时间有限，建议后续跟进', effects: {integrity: 3, workAbility: 1, risk: -1, positionWeight: -1} },
    ]},
    { id: 'enw004', stage: 'work', eventType: 'choice', weight: 7, title: '年终总结（亮点难寻）', text: '年终总结要写出亮点，可这一年亮点都藏在加班里。你盯着"主要工作"四个字，像盯着一面需要擦亮的镜子。', choices: [
      { text: '把零散成绩梳理成三条主线', effects: {workAbility: 3, iq: 2, mentalPressure: 2} },
      { text: '用数据说话，列一串数字撑场面', effects: {workAbility: 2, positionWeight: 1, risk: 1} },
      { text: '突出个人贡献，让领导记住你', effects: {desire: 3, positionWeight: 2, eq: -1, mentalPressure: 2} },
      { text: '谦虚写法，功劳归集体', effects: {eq: 2, background: 1, mentalPressure: -1} },
    ]},
    { id: 'enw005', stage: 'work', eventType: 'choice', weight: 6, title: '述职报告', text: '述职报告要求"见人见事见思想"。你写了三版，"事"有了，"思想"还在路上堵着。', choices: [
      { text: '挑一件最棘手的事，深挖体会', effects: {workAbility: 3, iq: 1, mentalPressure: 2} },
      { text: '套用模板，四平八稳交差', effects: {mentalPressure: -2, workAbility: 1, risk: 1} },
      { text: '请同事帮忙提提"思想高度"', effects: {eq: 1, workAbility: 2, mentalPressure: -1} },
    ]},
    { id: 'enw006', stage: 'work', eventType: 'choice', weight: 7, title: '信息简报', text: '信息简报要"短实新"，可各科室报上来的素材"长虚旧"。你像在给一团棉花找骨头。', choices: [
      { text: '逐篇精简，只留干货', effects: {workAbility: 3, mentalPressure: 3, body: 1} },
      { text: '合并同类项，提炼三条', effects: {workAbility: 2, iq: 2, mentalPressure: 1} },
      { text: '退回重报，要求各科室补料', effects: {eq: -1, workAbility: 2, risk: 1, mentalPressure: 2} },
    ]},
    { id: 'enw007', stage: 'work', eventType: 'choice', weight: 6, title: '工作方案', text: '一份工作方案，领导说"要细，但别太细"。你揣摩这句禅语，在"细"和"太细"之间画了一条说不清的线。', choices: [
      { text: '按流程节点细化到责任人和时限', effects: {workAbility: 3, mentalPressure: 3, risk: -1} },
      { text: '写清大框架，细节留口头汇报', effects: {eq: 1, workAbility: 1, mentalPressure: -1} },
      { text: '参考往年方案改改用', effects: {mentalPressure: -2, workAbility: 1, risk: 2} },
    ]},
    { id: 'enw008', stage: 'work', eventType: 'choice', weight: 5, title: '整改报告', text: '整改报告要"见筋见骨"，可骨头都是自己科室的。你下笔时手有点抖，像在给自己动手术。', choices: [
      { text: '如实写问题，附上整改清单', effects: {integrity: 3, workAbility: 2, risk: -2, mentalPressure: 3} },
      { text: '问题轻描淡写，措施浓墨重彩', effects: {risk: 3, mentalPressure: 1, positionWeight: 1} },
      { text: '请领导先定整改基调再写', effects: {eq: 1, background: 1, mentalPressure: -1, risk: -1} },
    ]},
    { id: 'enw009', stage: 'work', eventType: 'choice', weight: 4, title: '对照检查材料', text: '对照检查材料要"画准像"。你写了三遍"理论学习不够深入"，第四次开始怀疑自己是不是真的不够深入。', choices: [
      { text: '挑一个真问题深挖，不怕露短', effects: {integrity: 3, workAbility: 2, mentalPressure: 3, positionWeight: -1} },
      { text: '用通用表述，稳妥过关', effects: {mentalPressure: -2, risk: 1, eq: 1} },
      { text: '找同事互相提提意见', effects: {eq: 1, workAbility: 2, mentalPressure: 1} },
    ]},
    { id: 'enw010', stage: 'work', eventType: 'choice', weight: 6, title: '主持词', text: '一场会议的主持词交给你写。领导说"别太长，别太短，别太正式，别太随意"。你点头如捣蒜，心里一团乱麻。', choices: [
      { text: '按往届模板微调，求稳', effects: {workAbility: 2, mentalPressure: -1, risk: 1} },
      { text: '加入几句应景的鲜活话', effects: {eq: 1, workAbility: 2, risk: 2, mentalPressure: 2} },
      { text: '极简风格，只串场不发挥', effects: {workAbility: 1, mentalPressure: -2, positionWeight: -1} },
    ]},
    { id: 'enw011', stage: 'work', eventType: 'choice', weight: 6, title: '新闻通稿', text: '一篇新闻通稿，宣传科要"稳妥"，业务科室要"出彩"。你夹在中间，像一个走钢丝的打字机。', choices: [
      { text: '先求稳妥，出彩留给配图', effects: {risk: -2, mentalPressure: 1, workAbility: 1} },
      { text: '两头平衡，措辞精雕细琢', effects: {workAbility: 3, eq: 1, mentalPressure: 3} },
      { text: '出彩为主，宣传科那边自己沟通', effects: {positionWeight: 2, risk: 2, eq: -1, mentalPressure: 2} },
    ]},
    { id: 'enw012', stage: 'work', eventType: 'choice', weight: 5, title: '经验交流材料', text: '单位要推荐你写一份经验交流材料。你想想自己这一年，经验不多，教训不少。', choices: [
      { text: '把教训包装成"探索"', effects: {workAbility: 2, iq: 2, risk: 2, mentalPressure: 2} },
      { text: '聚焦一件成功案例深挖', effects: {workAbility: 3, positionWeight: 2, mentalPressure: 2} },
      { text: '谦虚风格，多归功团队', effects: {eq: 2, background: 1, mentalPressure: -1} },
    ]},
    { id: 'enw013', stage: 'work', eventType: 'choice', weight: 4, title: '典型案例剖析', text: '一个典型案例要剖析，可这个案例就发生在你隔壁科室。笔尖往下压，人情往上顶。', choices: [
      { text: '就事论事，不点名不影射', effects: {workAbility: 2, eq: 1, risk: 1, mentalPressure: 2} },
      { text: '深入剖析，揭示普遍性问题', effects: {workAbility: 3, iq: 2, risk: 2, mentalPressure: 3} },
      { text: '换一个外部案例来剖析', effects: {mentalPressure: -2, workAbility: 1, eq: 1} },
    ]},
    { id: 'enw014', stage: 'work', eventType: 'choice', weight: 5, title: '作风建设材料', text: '作风建设材料要写出"刀刃向内"的力度。你写了两个晚上，刀刃还没磨利，自己先钝了。', choices: [
      { text: '列具体表现，不绕弯子', effects: {integrity: 3, workAbility: 2, risk: 1, mentalPressure: 3} },
      { text: '宏观表述，点到为止', effects: {mentalPressure: -1, workAbility: 1, risk: -1} },
      { text: '结合身边小事切入，以小见大', effects: {workAbility: 3, iq: 1, mentalPressure: 2} },
    ]},
    { id: 'enw015', stage: 'work', eventType: 'choice', weight: 4, title: '主题教育方案', text: '主题教育方案要"有特色"，可所有特色都被上级方案占完了。你在"自选动作"一栏前发呆。', choices: [
      { text: '结合本单位业务设计自选动作', effects: {workAbility: 3, iq: 2, mentalPressure: 3} },
      { text: '在上级动作上做加法，不另起炉灶', effects: {workAbility: 2, risk: -1, mentalPressure: 1} },
      { text: '请示分管领导再定特色方向', effects: {eq: 1, background: 1, mentalPressure: -1} },
    ]},

    // ---------- 会议活动类（15个） ----------
    { id: 'enw016', stage: 'work', eventType: 'choice', weight: 7, title: '党组会', text: '党组会要上会一个议题，材料得提前三天送。你踩着点送进去，秘书科看你的眼神像看一辆晚点的列车。', choices: [
      { text: '诚恳道歉，加急走流程', effects: {eq: 1, workAbility: 2, mentalPressure: 3} },
      { text: '找分管领导通融一下', effects: {background: 2, risk: 1, mentalPressure: 1} },
      { text: '主动延后到下次会议', effects: {workAbility: 1, mentalPressure: -1, positionWeight: -1} },
    ]},
    { id: 'enw017', stage: 'work', eventType: 'choice', weight: 5, title: '务虚会', text: '务虚会上人人发言，领导说"务虚是为了务实"。你发言时把"虚"和"实"搅在一起，像一碗分不清咸淡的汤。', choices: [
      { text: '提三条思路，留一条后路', effects: {iq: 2, eq: 1, mentalPressure: 2} },
      { text: '附和主要观点，稳妥发言', effects: {mentalPressure: -1, eq: 1, positionWeight: -1} },
      { text: '抛出一个新提法引起讨论', effects: {positionWeight: 2, iq: 2, risk: 2, mentalPressure: 3} },
    ]},
    { id: 'enw018', stage: 'work', eventType: 'choice', weight: 6, title: '座谈会', text: '一场座谈会，来的人各有各的诉求。你主持时像在走一桌麻将，每张牌都想听，每张牌都怕点炮。', choices: [
      { text: '逐个回应，能办的当场表态', effects: {workAbility: 3, eq: 1, risk: 2, mentalPressure: 3} },
      { text: '只听不表态，会后研究', effects: {mentalPressure: -1, risk: -1, eq: 1} },
      { text: '挑重点回应，其余记录在册', effects: {workAbility: 2, eq: 1, mentalPressure: 1} },
    ]},
    { id: 'enw019', stage: 'work', eventType: 'choice', weight: 6, title: '专题会', text: '一个专题会开了两小时还没结论，领导看你一眼："你说说？"全场的目光像聚光灯一样打过来。', choices: [
      { text: '抛出提前准备的方案，推动决策', effects: {workAbility: 3, positionWeight: 2, mentalPressure: 3} },
      { text: '归纳各方意见，梳理分歧点', effects: {eq: 1, workAbility: 2, mentalPressure: 1} },
      { text: '建议再调研一次，不急于拍板', effects: {mentalPressure: -1, risk: -1, positionWeight: -1} },
    ]},
    { id: 'enw020', stage: 'work', eventType: 'choice', weight: 7, title: '协调会', text: '协调会上两个科室为经费争执不下。你夹在中间，像一个既不会游泳又不会划船的艄公。', choices: [
      { text: '提出折中方案，各让一步', effects: {eq: 2, workAbility: 2, mentalPressure: 3} },
      { text: '请上级领导裁定', effects: {background: 1, risk: -1, mentalPressure: 1} },
      { text: '暂缓争议，先推进能推进的部分', effects: {workAbility: 2, mentalPressure: 1, positionWeight: 1} },
    ]},
    { id: 'enw021', stage: 'work', eventType: 'choice', weight: 6, title: '推进会', text: '推进会上要表态进度。你的项目卡在兄弟单位，进度条像一根不肯上涨的温度计。', choices: [
      { text: '如实说明卡点，提出协调请求', effects: {workAbility: 2, eq: 1, risk: -1, mentalPressure: 2} },
      { text: '报喜不报忧，先过这关', effects: {risk: 3, mentalPressure: 2, positionWeight: 1} },
      { text: '当场打电话给对方确认', effects: {workAbility: 2, eq: -1, mentalPressure: 3} },
    ]},
    { id: 'enw022', stage: 'work', eventType: 'choice', weight: 5, title: '动员会', text: '动员会上要"统一思想、凝聚共识"。可台下有人看手机，有人打哈欠，共识还飘在天花板上。', choices: [
      { text: '讲一个身边案例调动情绪', effects: {eq: 1, workAbility: 2, mentalPressure: 2} },
      { text: '按稿子念，稳妥交差', effects: {mentalPressure: -1, workAbility: 1, positionWeight: -1} },
      { text: '现场互动，提问几个关键人', effects: {workAbility: 2, positionWeight: 2, risk: 2, mentalPressure: 3} },
    ]},
    { id: 'enw023', stage: 'work', eventType: 'choice', weight: 6, title: '总结会', text: '总结会上人人要讲"不足"。你准备了三条不足，第一条就是"对不足认识不够深入"——一条递归的不足。', choices: [
      { text: '讲真问题，附整改思路', effects: {integrity: 3, workAbility: 2, mentalPressure: 3} },
      { text: '讲通用不足，不痛不痒', effects: {mentalPressure: -2, eq: 1, risk: 1} },
      { text: '把不足讲成"提升空间"', effects: {eq: 1, workAbility: 1, mentalPressure: 1} },
    ]},
    { id: 'enw024', stage: 'work', eventType: 'choice', weight: 4, title: '表彰会', text: '表彰会名单有你。你上台前照了照镜子，把笑容调整到"既荣幸又谦虚"的刻度。', choices: [
      { text: '发言时多感谢团队', effects: {eq: 2, background: 2, mentalPressure: -1} },
      { text: '简短发言，把舞台让给别人', effects: {eq: 1, positionWeight: 1, mentalPressure: -2} },
      { text: '讲讲背后的艰辛，真情流露', effects: {workAbility: 2, positionWeight: 2, eq: 1, mentalPressure: 2} },
    ]},
    { id: 'enw025', stage: 'work', eventType: 'choice', weight: 4, title: '民主生活会', text: '民主生活会上要相互批评。前面的同事给你提了一条"工作太拼要注意身体"，你分不清这是批评还是表扬。', choices: [
      { text: '回提一条真问题，敢于动真碰硬', effects: {integrity: 3, workAbility: 2, risk: 1, mentalPressure: 3} },
      { text: '也提一条温和的"建议"', effects: {eq: 1, mentalPressure: -1, risk: -1} },
      { text: '提一条共同改进的方向', effects: {eq: 1, workAbility: 1, mentalPressure: 1} },
    ]},
    { id: 'enw026', stage: 'work', eventType: 'choice', weight: 5, title: '组织生活会', text: '组织生活会上要讲党课。你准备了二十页PPT，党员同志们的眼神在第二页开始涣散。', choices: [
      { text: '临时压缩，只讲三个要点', effects: {eq: 1, workAbility: 2, mentalPressure: 2} },
      { text: '增加互动环节，提几个问题', effects: {workAbility: 2, eq: 1, mentalPressure: 3} },
      { text: '按原计划讲完，求完整', effects: {workAbility: 1, mentalPressure: 1, eq: -1} },
    ]},
    { id: 'enw027', stage: 'work', eventType: 'choice', weight: 6, title: '谈心谈话', text: '领导找你谈心谈话，开场是"最近怎么样"。这三个字你听了三年，每次都觉得是另一道考题。', choices: [
      { text: '谈工作为主，适度表露想法', effects: {eq: 1, positionWeight: 1, mentalPressure: 1} },
      { text: '借机汇报一个真实困难', effects: {eq: 1, background: 1, mentalPressure: -2} },
      { text: '只讲好的，不添麻烦', effects: {mentalPressure: 2, risk: -1, eq: 1} },
    ]},
    { id: 'enw028', stage: 'work', eventType: 'choice', weight: 5, title: '中心组学习', text: '中心组学习要发言，主题是"新发展理念"。你翻了一晚上资料，发言稿像一篇还没磨利的刀。', choices: [
      { text: '结合本职工作谈体会', effects: {workAbility: 3, eq: 1, mentalPressure: 2} },
      { text: '引经据典，体现理论功底', effects: {iq: 2, workAbility: 1, mentalPressure: 2} },
      { text: '提一个工作中的困惑，求指点', effects: {eq: 1, background: 1, mentalPressure: -1} },
    ]},
    { id: 'enw029', stage: 'work', eventType: 'choice', weight: 6, title: '三会一课', text: '"三会一课"记录本要补齐。你对着空白页，像对着一片需要播种却忘了季节的地。', choices: [
      { text: '如实补记，附上原始材料', effects: {workAbility: 2, integrity: 2, risk: -1, mentalPressure: 3} },
      { text: '按惯例格式补全', effects: {mentalPressure: -1, risk: 2, workAbility: 1} },
      { text: '请参会同志帮忙核对内容', effects: {eq: 1, workAbility: 1, mentalPressure: 1} },
    ]},
    { id: 'enw030', stage: 'work', eventType: 'choice', weight: 5, title: '主题党日', text: '主题党日活动要"有仪式感"。你设计了重温入党誓词环节，话筒却在关键时刻哑了。', choices: [
      { text: '带头领誓，不用话筒', effects: {eq: 1, workAbility: 2, positionWeight: 1, mentalPressure: 2} },
      { text: '临时调整流程，先进行下一项', effects: {eq: 1, workAbility: 2, mentalPressure: 2} },
      { text: '用手机扩音救场', effects: {iq: 1, eq: 1, mentalPressure: 1} },
    ]},

    // ---------- 检查调研类（15个） ----------
    { id: 'enw031', stage: 'work', eventType: 'choice', weight: 7, title: '上级检查', text: '上级检查明天到，台账今晚得齐。办公室的灯像一盏不灭的香火，照着几个写材料写到出神的信徒。', choices: [
      { text: '通宵整理台账，确保无遗漏', effects: {workAbility: 3, body: -2, mentalPressure: 4} },
      { text: '抓大放小，重点项优先', effects: {workAbility: 2, risk: 2, mentalPressure: 2} },
      { text: '分工到人，分头准备', effects: {eq: 1, workAbility: 2, mentalPressure: 1} },
    ]},
    { id: 'enw032', stage: 'work', eventType: 'choice', weight: 4, title: '巡视巡察', text: '巡视组进驻，要求提供近三年所有会议纪要。你看着那摞落灰的档案，像看着一段被重新翻开的日记。', choices: [
      { text: '逐本核查再提供，不怕慢', effects: {workAbility: 3, integrity: 2, risk: -2, mentalPressure: 4} },
      { text: '原样提供，不提前筛选', effects: {risk: 1, mentalPressure: 2, workAbility: 1} },
      { text: '先自查敏感内容再上报', effects: {workAbility: 2, risk: 2, mentalPressure: 3} },
    ]},
    { id: 'enw033', stage: 'work', eventType: 'choice', weight: 5, title: '审计进点', text: '审计组进点会开了两小时，"实事求是"四个字重复了八遍。你数这个的时候，笔记本上一字未记。', choices: [
      { text: '主动配合，有问题早说明', effects: {integrity: 3, risk: -2, mentalPressure: 3} },
      { text: '按程序提供资料，不多说', effects: {workAbility: 2, risk: 1, mentalPressure: 1} },
      { text: '先内部理清账目再对接', effects: {workAbility: 3, mentalPressure: 3, risk: -1} },
    ]},
    { id: 'enw034', stage: 'work', eventType: 'choice', weight: 5, title: '统计督查', text: '统计督查发现一组数据对不上。你解释了三遍口径，督查员的笔还在那行数字上方悬着。', choices: [
      { text: '出具书面说明，附原始凭证', effects: {workAbility: 3, integrity: 2, mentalPressure: 3} },
      { text: '承认口径有误，承诺整改', effects: {integrity: 3, risk: -1, positionWeight: -1, mentalPressure: 2} },
      { text: '请业务科室当面解释', effects: {eq: 1, workAbility: 1, mentalPressure: 1} },
    ]},
    { id: 'enw035', stage: 'work', eventType: 'choice', weight: 4, title: '专项整治', text: '专项整治要求自查自纠，列问题清单。你写了五条，又被领导划掉两条——"这两条别报，影响形象"。', choices: [
      { text: '坚持如实上报全部问题', effects: {integrity: 4, risk: -1, positionWeight: -2, mentalPressure: 4} },
      { text: '按领导意见，报三条', effects: {eq: 1, risk: 2, mentalPressure: 1} },
      { text: '换一种表述，把问题写"轻"', effects: {workAbility: 2, risk: 1, mentalPressure: 2} },
    ]},
    { id: 'enw036', stage: 'work', eventType: 'choice', weight: 4, title: '明察暗访', text: '有消息说明察暗访组要来。办公室的零食和躺椅被紧急转移，像一场小型搬家。', choices: [
      { text: '该怎样还怎样，不搞突击', effects: {integrity: 2, mentalPressure: -1, risk: -1} },
      { text: '配合氛围，临时规整一下', effects: {eq: 1, mentalPressure: 1, workAbility: 1} },
      { text: '提醒同事注意纪律', effects: {eq: 1, workAbility: 1, mentalPressure: 1} },
    ]},
    { id: 'enw037', stage: 'work', eventType: 'choice', weight: 5, title: '交叉检查', text: '兄弟单位来交叉检查，你既不能太严得罪人，也不能太松显得敷衍。这把尺子的刻度，全靠手感。', choices: [
      { text: '按标准来，问题如实记录', effects: {workAbility: 3, integrity: 2, eq: -1, mentalPressure: 2} },
      { text: '提前沟通口径，互相体谅', effects: {eq: 2, background: 2, risk: 2, mentalPressure: 1} },
      { text: '抓大放小，重点提醒', effects: {workAbility: 2, eq: 1, mentalPressure: 1} },
    ]},
    { id: 'enw038', stage: 'work', eventType: 'choice', weight: 6, title: '年终考核', text: '年终考核指标下来，你分管的那一项权重不高，却是领导最关心的一项。你在"权重"和"关心"之间掂量。', choices: [
      { text: '集中精力抓领导关心项', effects: {positionWeight: 2, workAbility: 2, mentalPressure: 3} },
      { text: '各项均衡推进，不偏科', effects: {workAbility: 3, mentalPressure: 2, risk: -1} },
      { text: '争取调整指标权重', effects: {background: 2, risk: 2, mentalPressure: 2} },
    ]},
    { id: 'enw039', stage: 'work', eventType: 'choice', weight: 5, title: '党建考核（三会一课）', text: '党建考核要看"三会一课"记录。你翻出记录本，发现某次会议的签名栏像一片稀疏的草坪。', choices: [
      { text: '如实说明缺席原因', effects: {integrity: 3, workAbility: 1, risk: -1, mentalPressure: 2} },
      { text: '找当事人补签', effects: {risk: 3, mentalPressure: 2, eq: -1} },
      { text: '附上会议照片佐证', effects: {workAbility: 2, mentalPressure: 1, risk: 1} },
    ]},
    { id: 'enw040', stage: 'work', eventType: 'choice', weight: 5, title: '廉政考核', text: '廉政考核要填报个人事项。有一笔家属收入来源你不太确定，填或不填，都像踩在薄冰上。', choices: [
      { text: '如实填报，不清楚的标注说明', effects: {integrity: 4, risk: -2, mentalPressure: 3} },
      { text: '回家核实清楚再填', effects: {workAbility: 2, integrity: 2, mentalPressure: 2} },
      { text: '按往年数据填报', effects: {risk: 3, mentalPressure: 1, workAbility: 1} },
    ]},
    { id: 'enw041', stage: 'work', eventType: 'choice', weight: 4, title: '文明创建', text: '文明创建检查要来，单位安排全员搞卫生。你拿着抹布站在荣誉墙前，擦掉了一层灰，也擦掉了一个午休。', choices: [
      { text: '认真整理，顺便检查台账', effects: {workAbility: 3, mentalPressure: 2, body: -1} },
      { text: '应付了事，做表面功夫', effects: {mentalPressure: -1, risk: 2, workAbility: 1} },
      { text: '借机建立长效机制', effects: {workAbility: 3, iq: 2, mentalPressure: 3} },
    ]},
    { id: 'enw042', stage: 'work', eventType: 'choice', weight: 6, title: '绩效考核', text: '绩效考核结果关系到年底奖金。你的评分卡在"良好"和"优秀"之间，像一个停在半空的电梯。', choices: [
      { text: '整理一年成绩，主动争取', effects: {desire: 2, positionWeight: 2, workAbility: 2, mentalPressure: 3} },
      { text: '顺其自然，等结果', effects: {mentalPressure: -2, positionWeight: -1, desire: -1} },
      { text: '请同事帮忙评价佐证', effects: {eq: 1, workAbility: 1, mentalPressure: 1} },
    ]},
    { id: 'enw043', stage: 'work', eventType: 'choice', weight: 6, title: '督查督办', text: '督查督办件下来了，限期三天反馈。你打开附件，发现要核实的事项横跨两个科室、三年时间。', choices: [
      { text: '立军令状，三天内交账', effects: {workAbility: 3, positionWeight: 2, mentalPressure: 5, body: -1} },
      { text: '申请延期，确保质量', effects: {workAbility: 2, mentalPressure: 1, positionWeight: -1} },
      { text: '拉专班分工推进', effects: {eq: 1, workAbility: 2, mentalPressure: 2} },
    ]},
    { id: 'enw044', stage: 'work', eventType: 'choice', weight: 5, title: '信访督查', text: '一件信访积案被督查组盯上。当事人三天两头往上跑，你三天两头往下劝，跑道都磨出了包浆。', choices: [
      { text: '当面约见当事人，倾听诉求', effects: {eq: 1, workAbility: 2, mentalPressure: 3} },
      { text: '协调多方资源想办法化解', effects: {workAbility: 3, background: 2, mentalPressure: 3} },
      { text: '依法依规走程序，不兜底', effects: {integrity: 2, workAbility: 1, risk: -1, mentalPressure: 2} },
    ]},
    { id: 'enw045', stage: 'work', eventType: 'choice', weight: 6, title: '安全生产检查', text: '安全生产检查发现一处隐患。负责人说"明天就改"，检查员问"为什么不是现在"。你在中间当翻译。', choices: [
      { text: '现场盯整改，改完再走', effects: {workAbility: 3, integrity: 2, body: -1, mentalPressure: 3} },
      { text: '下达整改通知书，限期完成', effects: {workAbility: 2, risk: 1, mentalPressure: 1} },
      { text: '上报分管领导协调', effects: {background: 1, workAbility: 1, mentalPressure: 1} },
    ]},

    // ---------- 协调沟通类（15个） ----------
    { id: 'enw046', stage: 'work', eventType: 'choice', weight: 7, title: '部门协调', text: '一件事要三个部门会签，第一个部门说"没意见"，第二个部门"再研究"，第三个部门"不归我们管"。', choices: [
      { text: '逐个上门沟通，求共识', effects: {eq: 2, workAbility: 2, mentalPressure: 3} },
      { text: '提请联席会议集体研究', effects: {workAbility: 2, positionWeight: 1, mentalPressure: 2} },
      { text: '请分管领导出面协调', effects: {background: 2, mentalPressure: -1, eq: 1} },
    ]},
    { id: 'enw047', stage: 'work', eventType: 'choice', weight: 6, title: '上下对接', text: '上级处室要数据，口径和你们的不一样。你像在两种语言之间当同声传译，还自带词典。', choices: [
      { text: '按上级口径重新统计', effects: {workAbility: 3, mentalPressure: 3, body: -1} },
      { text: '说明口径差异，附对照表', effects: {workAbility: 2, iq: 2, mentalPressure: 2} },
      { text: '请上级明确口径再报', effects: {eq: 1, mentalPressure: -1, positionWeight: -1} },
    ]},
    { id: 'enw048', stage: 'work', eventType: 'choice', weight: 6, title: '横向沟通', text: '平级单位有项工作需要配合，对方说"我们也很忙"。这句"也很忙"像一道客气的门。', choices: [
      { text: '带上礼物——一份互利方案', effects: {eq: 2, workAbility: 2, mentalPressure: 2} },
      { text: '请共同上级出面牵头', effects: {background: 2, mentalPressure: 1, eq: -1} },
      { text: '等对方忙完再对接', effects: {mentalPressure: -1, positionWeight: -1, workAbility: 1} },
    ]},
    { id: 'enw049', stage: 'work', eventType: 'choice', weight: 5, title: '信访接待（老上访户）', text: '信访接待日，一位老人带着一叠材料来了。材料边角卷起，像被翻过无数遍的经书。', choices: [
      { text: '耐心听完，逐条记录', effects: {eq: 1, workAbility: 2, mentalPressure: 3, integrity: 1} },
      { text: '引导走法定程序', effects: {workAbility: 2, risk: -1, mentalPressure: 1} },
      { text: '现场联系责任科室协调', effects: {workAbility: 3, eq: 1, mentalPressure: 3} },
    ]},
    { id: 'enw050', stage: 'work', eventType: 'choice', weight: 6, title: '群众来访', text: '一位群众闯进办公室，情绪激动。你的同事们都低头看文件，像在参加一场默读比赛。', choices: [
      { text: '主动迎上去，先安抚情绪', effects: {eq: 2, workAbility: 2, mentalPressure: 3} },
      { text: '请到接待室，倒杯水', effects: {eq: 1, workAbility: 1, mentalPressure: 2} },
      { text: '通知保安维持秩序', effects: {risk: 1, mentalPressure: 1, eq: -2} },
    ]},
    { id: 'enw051', stage: 'work', eventType: 'choice', weight: 7, title: '12345热线', text: '12345热线转来一件工单，要求24小时内反馈。可这事归三个部门管，谁都觉得自己只是"协办"。', choices: [
      { text: '牵头召集三方现场办公', effects: {workAbility: 3, eq: 1, mentalPressure: 4} },
      { text: '明确主办方，督促落实', effects: {workAbility: 2, positionWeight: 1, mentalPressure: 2} },
      { text: '先回复群众，再跟进办理', effects: {eq: 1, workAbility: 1, mentalPressure: 2} },
    ]},
    { id: 'enw052', stage: 'work', eventType: 'choice', weight: 4, title: '人大代表建议', text: '一件人大代表建议要答复。代表提的问题实在，可解决起来不实在。你在"答复"和"解决"之间挠头。', choices: [
      { text: '当面拜访代表，说明困难', effects: {eq: 1, workAbility: 2, mentalPressure: 2} },
      { text: '制定分步解决计划再答复', effects: {workAbility: 3, mentalPressure: 3, positionWeight: 1} },
      { text: '按模板答复，态度诚恳', effects: {mentalPressure: -1, risk: 2, workAbility: 1} },
    ]},
    { id: 'enw053', stage: 'work', eventType: 'choice', weight: 4, title: '政协委员提案', text: '一件政协提案涉及你分管领域。委员的调研很扎实，你的压力也很扎实。', choices: [
      { text: '逐条回应，能办的列时间表', effects: {workAbility: 3, eq: 1, mentalPressure: 3} },
      { text: '邀请委员现场调研再答复', effects: {eq: 1, workAbility: 2, mentalPressure: 2} },
      { text: '按惯例格式答复', effects: {mentalPressure: -1, risk: 2, workAbility: 1} },
    ]},
    { id: 'enw054', stage: 'work', eventType: 'choice', weight: 4, title: '媒体采访', text: '一家媒体来采访，问题很尖锐。话筒伸过来的一瞬间，你脑子里闪过十种回答和二十种后果。', choices: [
      { text: '按口径回答，不越界', effects: {risk: -2, mentalPressure: 2, workAbility: 1} },
      { text: '坦诚回应，展现诚意', effects: {eq: 1, positionWeight: 2, risk: 2, mentalPressure: 3} },
      { text: '以需要请示为由婉拒', effects: {mentalPressure: 1, positionWeight: -1, risk: -1} },
    ]},
    { id: 'enw055', stage: 'work', eventType: 'choice', weight: 5, title: '舆情应对', text: '一条舆情在深夜发酵，阅读量过万。你的手机在凌晨两点亮起，像一只不肯闭眼的眼睛。', choices: [
      { text: '连夜起草回应口径', effects: {workAbility: 3, body: -2, mentalPressure: 5} },
      { text: '等天亮后集体研究再回应', effects: {mentalPressure: 2, risk: 3, workAbility: 1} },
      { text: '先核实事实，分级响应', effects: {workAbility: 3, eq: 1, mentalPressure: 3} },
    ]},
    { id: 'enw056', stage: 'work', eventType: 'choice', weight: 5, title: '网络问政', text: '网络问政平台上一条留言火了，问的是一件拖了半年的小事。小事拖成大事，只因没人接电话。', choices: [
      { text: '当天回复，公开承诺时限', effects: {eq: 1, workAbility: 2, mentalPressure: 3} },
      { text: '私下联系当事人解决', effects: {eq: 1, workAbility: 1, mentalPressure: 2} },
      { text: '转交责任科室处理', effects: {workAbility: 1, mentalPressure: 1, eq: -1} },
    ]},
    { id: 'enw057', stage: 'work', eventType: 'choice', weight: 5, title: '公开的两难', text: '政务公开要求"应公开尽公开"。可有些文件公开了怕引发误解，不公开又怕督查通报。', choices: [
      { text: '按规定全面公开，配解读', effects: {workAbility: 3, integrity: 2, mentalPressure: 3} },
      { text: '请示上级明确边界', effects: {background: 1, mentalPressure: 1, risk: -1} },
      { text: '保守公开，稳妥为主', effects: {risk: 1, mentalPressure: -1, workAbility: 1} },
    ]},
    { id: 'enw058', stage: 'work', eventType: 'choice', weight: 6, title: '信息报送', text: '信息报送要"抢头条"。各科室都捂着料，等大事发生才肯松手。你像一个等米的炊事员。', choices: [
      { text: '主动下科室挖掘素材', effects: {workAbility: 3, eq: 1, mentalPressure: 3} },
      { text: '建立信息报送激励机制', effects: {workAbility: 2, positionWeight: 2, mentalPressure: 2} },
      { text: '等科室主动报来再编', effects: {mentalPressure: -1, workAbility: 1, positionWeight: -1} },
    ]},
    { id: 'enw059', stage: 'work', eventType: 'choice', weight: 5, title: '档案检查', text: '档案检查发现一份重要文件归档不及时。档案员说"太忙了忘了"，你看着那个"忘"字，像看着一个洞。', choices: [
      { text: '立即补救归档，建立提醒机制', effects: {workAbility: 3, mentalPressure: 2, risk: -1} },
      { text: '如实记录问题，限期整改', effects: {integrity: 2, workAbility: 2, mentalPressure: 2} },
      { text: '帮忙补上，不上报', effects: {eq: 1, risk: 2, mentalPressure: 1} },
    ]},
    { id: 'enw060', stage: 'work', eventType: 'choice', weight: 5, title: '保密检查（违规文件）', text: '保密检查发现一台电脑存了不该存的文件。你的心漏跳一拍，像踩空了一级台阶。', choices: [
      { text: '立即隔离电脑，上报处置', effects: {integrity: 3, workAbility: 2, risk: -2, mentalPressure: 4} },
      { text: '先自行删除文件', effects: {risk: 5, mentalPressure: 3, integrity: -3} },
      { text: '请保密专员评估处理', effects: {workAbility: 2, mentalPressure: 2, eq: 1} },
    ]},

    // ---------- 业务办理类（20个） ----------
    { id: 'enw061', stage: 'work', eventType: 'choice', weight: 6, title: '审批延期', text: '一项审批临近时限，材料还差一份。申请人天天打电话催，你接电话的手开始比拨号的手还累。', choices: [
      { text: '依法延期，书面告知理由', effects: {workAbility: 2, integrity: 2, risk: -1, mentalPressure: 2} },
      { text: '加班审核，争取按时办结', effects: {workAbility: 3, body: -2, mentalPressure: 3} },
      { text: '请领导协调加快流转', effects: {background: 1, mentalPressure: 1, workAbility: 1} },
    ]},
    { id: 'enw062', stage: 'work', eventType: 'choice', weight: 5, title: '紧急公文', text: '一份紧急公文标注"特急"，要求两小时内传达。可现在是下班时间，群里一片安静。', choices: [
      { text: '逐一电话通知到人', effects: {workAbility: 3, eq: 1, mentalPressure: 4, body: -1} },
      { text: '群发通知，要求回复确认', effects: {workAbility: 2, mentalPressure: 2, risk: 1} },
      { text: '先通知关键岗，再逐级传达', effects: {workAbility: 2, eq: 1, mentalPressure: 2} },
    ]},
    { id: 'enw063', stage: 'work', eventType: 'choice', weight: 5, title: '印章管理', text: '有人急着用印，材料却没走完流程。对方说"先盖章后补手续"，你看着印章，像看着一个烫手的山芋。', choices: [
      { text: '坚持原则，流程走完再盖章', effects: {integrity: 4, workAbility: 1, risk: -2, mentalPressure: 2} },
      { text: '请示领导特批后再用印', effects: {background: 1, risk: -1, mentalPressure: 1} },
      { text: '通融一次，事后补齐', effects: {eq: 1, risk: 4, integrity: -2, mentalPressure: 3} },
    ]},
    { id: 'enw064', stage: 'work', eventType: 'choice', weight: 6, title: '文件流转', text: '一份文件在三个科室之间转了一圈，回到你桌上时签批栏已经写满。可问题还是那个问题。', choices: [
      { text: '梳理签批意见，提出落实方案', effects: {workAbility: 3, iq: 1, mentalPressure: 2} },
      { text: '请最后签批的领导定方向', effects: {background: 1, mentalPressure: 1, workAbility: 1} },
      { text: '退回重走流程，明确责任', effects: {workAbility: 2, eq: -1, risk: 1, mentalPressure: 2} },
    ]},
    { id: 'enw065', stage: 'work', eventType: 'choice', weight: 5, title: '档案归档', text: '年底档案归档，三年的材料堆成小山。你站在山前，像一个面对考古现场的发掘者。', choices: [
      { text: '分类整理，逐盒归档', effects: {workAbility: 3, body: -2, mentalPressure: 3} },
      { text: '请人帮忙集中突击', effects: {eq: 1, workAbility: 2, mentalPressure: 2} },
      { text: '先归重要档案，其余年后再说', effects: {workAbility: 2, risk: 2, mentalPressure: 1} },
    ]},
    { id: 'enw066', stage: 'work', eventType: 'choice', weight: 5, title: '保密审查', text: '一份要公开的材料，保密审查时你发现一处敏感信息。起草人说"这个没事"，可"没事"两个字最让你紧张。', choices: [
      { text: '坚持遮蔽敏感信息再公开', effects: {integrity: 3, workAbility: 2, risk: -2, mentalPressure: 2} },
      { text: '请保密委定性后再处理', effects: {workAbility: 2, background: 1, mentalPressure: 1} },
      { text: '按起草人意见公开', effects: {risk: 4, mentalPressure: 2, integrity: -2} },
    ]},
    { id: 'enw067', stage: 'work', eventType: 'choice', weight: 6, title: '政务值班', text: '轮到你政务值班，偏偏赶上暴雨预警。值班电话像被施了咒，每隔十分钟响一次。', choices: [
      { text: '坚守岗位，及时上报险情', effects: {workAbility: 3, body: -2, mentalPressure: 4, integrity: 1} },
      { text: '联系代班，调整安排', effects: {eq: 1, mentalPressure: 1, positionWeight: -1} },
      { text: '做好记录，等天亮再处置', effects: {workAbility: 1, risk: 3, mentalPressure: 2} },
    ]},
    { id: 'enw068', stage: 'work', eventType: 'choice', weight: 4, title: '应急值守', text: '节假日应急值守，你在空荡荡的办公室听了一晚上的空调声。凌晨三点，一个电话让你彻底清醒。', choices: [
      { text: '立即赶赴现场处置', effects: {workAbility: 4, body: -2, mentalPressure: 5, positionWeight: 2} },
      { text: '电话指挥，派人前往', effects: {workAbility: 2, mentalPressure: 3, eq: 1} },
      { text: '上报值班领导决策', effects: {background: 1, mentalPressure: 1, workAbility: 1} },
    ]},
    { id: 'enw069', stage: 'work', eventType: 'choice', weight: 4, title: '突发事件（紧急上报）', text: '一起突发事件需要第一时间上报。信息还在核实中，上级已经在催"快报"。快和准，像一对冤家。', choices: [
      { text: '先报已知信息，标注待核实', effects: {workAbility: 3, eq: 1, mentalPressure: 3} },
      { text: '核实清楚再报，宁可慢一步', effects: {workAbility: 2, risk: 1, mentalPressure: 2} },
      { text: '口头先报，书面后补', effects: {eq: 1, workAbility: 1, mentalPressure: 2} },
    ]},
    { id: 'enw070', stage: 'work', eventType: 'choice', weight: 4, title: '信访积案', text: '一件信访积案，前任处理过，前前任也处理过。卷宗摞起来比你还高，当事人比卷宗还执着。', choices: [
      { text: '重新梳理案情，寻找突破口', effects: {workAbility: 3, iq: 2, mentalPressure: 4} },
      { text: '约当事人长谈，建立信任', effects: {eq: 2, workAbility: 2, mentalPressure: 3} },
      { text: '请律师和调解员联合介入', effects: {workAbility: 2, eq: 1, mentalPressure: 2} },
    ]},
    { id: 'enw071', stage: 'work', eventType: 'choice', weight: 4, title: '行政复议', text: '一起行政复议案，申请人理由充分，被申请人也不肯让步。你像站在天平中间，两边都怕偏。', choices: [
      { text: '依法审查，该撤销就撤销', effects: {integrity: 3, workAbility: 3, risk: -1, mentalPressure: 3} },
      { text: '组织双方调解', effects: {eq: 2, workAbility: 2, mentalPressure: 3} },
      { text: '请法律顾问把关', effects: {workAbility: 2, mentalPressure: 1, eq: 1} },
    ]},
    { id: 'enw072', stage: 'work', eventType: 'choice', weight: 3, title: '行政诉讼', text: '单位被提起行政诉讼，你是出庭代表。法庭上对方的律师问得很细，你的笔记记得比当年高考还快。', choices: [
      { text: '据理力争，依法答辩', effects: {workAbility: 3, iq: 2, mentalPressure: 5, positionWeight: 1} },
      { text: '承认瑕疵，争取调解', effects: {eq: 1, risk: -1, mentalPressure: 3} },
      { text: '请外聘律师主辩', effects: {workAbility: 1, mentalPressure: 1, background: 1} },
    ]},
    { id: 'enw073', stage: 'work', eventType: 'choice', weight: 5, title: '信息公开申请', text: '一份信息公开申请，要的东西很杂，有些能公开，有些不能。你像在做一道多选题，每选一项都要查依据。', choices: [
      { text: '逐项甄别，分类答复', effects: {workAbility: 3, iq: 1, mentalPressure: 3} },
      { text: '能公开的先公开，其余延期', effects: {workAbility: 2, eq: 1, mentalPressure: 2} },
      { text: '请业务科室协查后再答复', effects: {workAbility: 2, mentalPressure: 1, eq: 1} },
    ]},
    { id: 'enw074', stage: 'work', eventType: 'choice', weight: 4, title: '政府采购', text: '一项政府采购要走程序，预算和需求对不齐。供应商的电话比请示还勤，你不敢接，也不得不接。', choices: [
      { text: '严格按程序走，不留口子', effects: {integrity: 3, workAbility: 2, risk: -2, mentalPressure: 3} },
      { text: '请采购办指导流程', effects: {workAbility: 2, background: 1, mentalPressure: 1} },
      { text: '简化程序，加快进度', effects: {risk: 4, mentalPressure: 2, workAbility: 1} },
    ]},
    { id: 'enw075', stage: 'work', eventType: 'choice', weight: 4, title: '招投标', text: '一个招投标项目评标前夜，有人托关系"打个招呼"。这个招呼像一阵风，吹得你心里七上八下。', choices: [
      { text: '记录在案，按程序评标', effects: {integrity: 4, workAbility: 2, risk: -2, mentalPressure: 3} },
      { text: '报告纪检部门备案', effects: {integrity: 3, risk: -1, mentalPressure: 2, eq: -1} },
      { text: '装作没听见，照章办事', effects: {workAbility: 2, risk: 1, mentalPressure: 2} },
    ]},
    { id: 'enw076', stage: 'work', eventType: 'choice', weight: 5, title: '合同审查', text: '一份合同送来审查，条款密密麻麻。你发现一处不利于单位的表述，对方说"行业惯例都这样"。', choices: [
      { text: '坚持修改，保护单位利益', effects: {workAbility: 3, integrity: 2, risk: -2, mentalPressure: 3} },
      { text: '请法律顾问出具意见', effects: {workAbility: 2, mentalPressure: 1, eq: 1} },
      { text: '附审查意见，让领导定夺', effects: {workAbility: 2, background: 1, mentalPressure: 1} },
    ]},
    { id: 'enw077', stage: 'work', eventType: 'choice', weight: 4, title: '法律顾问', text: '外聘法律顾问的费用一直没拨付，人家委婉地表示"先停一停服务"。你像个欠了债还想借钱的熟人。', choices: [
      { text: '催财务加快拨款', effects: {workAbility: 2, mentalPressure: 2, eq: -1} },
      { text: '向领导说明情况', effects: {background: 1, mentalPressure: 1, workAbility: 1} },
      { text: '先自己顶上法律事务', effects: {workAbility: 3, mentalPressure: 4, risk: 2} },
    ]},
    { id: 'enw078', stage: 'work', eventType: 'choice', weight: 5, title: '规范性文件', text: '一份规范性文件要合法性审查。起草科室觉得你"太较真"，你觉得他们"太随意"。', choices: [
      { text: '逐条审查，出具书面意见', effects: {workAbility: 3, integrity: 2, mentalPressure: 3, eq: -1} },
      { text: '当面沟通，达成一致再改', effects: {eq: 2, workAbility: 2, mentalPressure: 2} },
      { text: '只看大问题，细枝末节放过', effects: {workAbility: 1, risk: 2, mentalPressure: 1} },
    ]},
    { id: 'enw079', stage: 'work', eventType: 'choice', weight: 5, title: '执法监督', text: '一起执法案件被投诉"程序瑕疵"。你调出执法记录仪视频，发现有一段刚好没录上。', choices: [
      { text: '如实记录问题，启动调查', effects: {integrity: 3, workAbility: 2, risk: -1, mentalPressure: 3} },
      { text: '补充书面说明材料', effects: {workAbility: 2, risk: 2, mentalPressure: 2} },
      { text: '约谈执法人员核实情况', effects: {workAbility: 2, eq: 1, mentalPressure: 2} },
    ]},
    { id: 'enw080', stage: 'work', eventType: 'choice', weight: 5, title: '案件办理', text: '一起案件办理期限将至，关键证据还在补充。你在"质量"和"效率"之间，像一个走钢丝的人。', choices: [
      { text: '申请延期，确保质量', effects: {workAbility: 2, integrity: 2, mentalPressure: 2, positionWeight: -1} },
      { text: '加班加点，按时办结', effects: {workAbility: 3, body: -2, mentalPressure: 4} },
      { text: '请示领导协调资源', effects: {background: 1, workAbility: 1, mentalPressure: 1} },
    ]},

    // ---------- 其他工作类（20个） ----------
    { id: 'enw081', stage: 'work', eventType: 'choice', weight: 5, title: '数字化转型', text: '单位推行数字化转型，新系统上线第一天就崩了。老同事说"还是纸质的好"，你夹在新旧之间。', choices: [
      { text: '记录问题，联系技术方修复', effects: {workAbility: 3, iq: 2, mentalPressure: 3} },
      { text: '双轨运行，纸质电子并行', effects: {workAbility: 2, mentalPressure: 2, body: -1} },
      { text: '组织培训，帮老同事上手', effects: {eq: 1, workAbility: 2, mentalPressure: 3} },
    ]},
    { id: 'enw082', stage: 'work', eventType: 'choice', weight: 6, title: '移动办公', text: '移动办公让你随时在线。周末带娃时弹出一条工作消息，孩子的脸和领导的头像在屏幕上交替闪烁。', choices: [
      { text: '立即处理，工作优先', effects: {workAbility: 3, familyPressure: 3, mentalPressure: 3} },
      { text: '告知稍后处理，先陪家人', effects: {familyPressure: -2, mentalPressure: 2, positionWeight: -1} },
      { text: '简单事项手机处理，复杂的延后', effects: {workAbility: 2, mentalPressure: 2, familyPressure: 1} },
    ]},
    { id: 'enw083', stage: 'work', eventType: 'choice', weight: 6, title: '视频会议', text: '一场视频会议，你的画面卡在"正在连接"。领导的脸已经出现在大屏上，你还没来得及整理头发。', choices: [
      { text: '冷静接入，先听后说', effects: {eq: 1, mentalPressure: 2, workAbility: 1} },
      { text: '申请电话接入，规避画面', effects: {mentalPressure: 1, workAbility: 1, risk: 1} },
      { text: '重启设备再接入', effects: {workAbility: 1, mentalPressure: 2, risk: 1} },
    ]},
    { id: 'enw084', stage: 'work', eventType: 'choice', weight: 5, title: '培训学习', text: '一次脱产培训机会，去的话手头工作堆积，不去的话能力原地踏步。你盯着报名表犹豫。', choices: [
      { text: '报名参加，提前安排交接', effects: {iq: 3, workAbility: 2, mentalPressure: 3} },
      { text: '放弃名额，安心工作', effects: {workAbility: 2, mentalPressure: -1, positionWeight: 1} },
      { text: '申请改为线上学习', effects: {iq: 2, workAbility: 1, mentalPressure: 1} },
    ]},
    { id: 'enw085', stage: 'work', eventType: 'choice', weight: 3, title: '挂职锻炼', text: '组织安排你到上级单位挂职一年。新环境新人脉，可原单位的活还得惦记着，像一只脚踩两条船。', choices: [
      { text: '全身心投入挂职，多学多看', effects: {background: 3, workAbility: 3, mentalPressure: 4, positionWeight: 2} },
      { text: '两头兼顾，保持联系', effects: {workAbility: 2, mentalPressure: 5, body: -2} },
      { text: '婉拒，留在原岗位', effects: {mentalPressure: -2, positionWeight: -1, workAbility: 1} },
    ]},
    { id: 'enw086', stage: 'work', eventType: 'choice', weight: 4, title: '跟班学习', text: '到先进地区跟班学习一个月。别人的做法很"先进"，可回来能不能落地，你心里打着鼓。', choices: [
      { text: '边学边记，整理可移植经验', effects: {iq: 3, workAbility: 3, mentalPressure: 2} },
      { text: '重点学思路，不照搬做法', effects: {iq: 2, workAbility: 2, mentalPressure: 1} },
      { text: '多交朋友，建立联系', effects: {background: 3, eq: 1, mentalPressure: 1} },
    ]},
    { id: 'enw087', stage: 'work', eventType: 'choice', weight: 4, title: '轮岗交流', text: '单位内部轮岗，你被调到一个陌生的科室。新科长比你还年轻，你调整心态的速度赶不上调整岗位的速度。', choices: [
      { text: '虚心学习，从头做起', effects: {workAbility: 3, eq: 1, mentalPressure: 3} },
      { text: '发挥原岗位经验，寻找结合点', effects: {iq: 2, workAbility: 2, mentalPressure: 2} },
      { text: '申请换到熟悉的岗位', effects: {mentalPressure: -1, positionWeight: -2, background: 1} },
    ]},
    { id: 'enw088', stage: 'work', eventType: 'choice', weight: 5, title: '下沉基层', requireUnitLevelMin: 2, requireUnitLevelMax: 3, excludeFlags: ['grassrootsActive', 'grassrootsDone'], text: '组织安排下沉基层锻炼。基层的办公室比想象中小，群众的诉求比想象中具体。接受后保留原单位关系，期满根据考核决定返回或调整。', choices: [
      { text: '扎下去，解决几件实事', effects: {workAbility: 3, eq: 2, mentalPressure: 4, positionWeight: 2, flag: 'grassrootsWork', grassrootsDispatch: { duration: 1, reason: '下沉基层锻炼' }} },
      { text: '完成规定动作，平稳度过', effects: {workAbility: 2, mentalPressure: 2, positionWeight: 1, flag: 'grassrootsWork', grassrootsDispatch: { duration: 1, reason: '下沉基层锻炼' }} },
      { text: '利用资源帮基层协调', effects: {background: 2, workAbility: 2, mentalPressure: 3, flag: 'grassrootsWork', grassrootsDispatch: { duration: 1, reason: '下沉基层锻炼' }} },
    ]},
    { id: 'enw089', stage: 'work', eventType: 'choice', weight: 3, title: '驻村帮扶（驻村日常）', requireFlag: 'grassrootsActive', text: '驻村帮扶期间，村里的事比单位的事还琐碎。回城开会时，你发现自己说话带了乡音。', choices: [
      { text: '扎根村里，把产业做起来', effects: {workAbility: 3, eq: 2, mentalPressure: 5, positionWeight: 2, body: -2} },
      { text: '两头跑，兼顾单位事务', effects: {workAbility: 2, mentalPressure: 4, background: 1} },
      { text: '请单位加大支持力度', effects: {background: 2, workAbility: 2, mentalPressure: 2} },
    ]},
    { id: 'enw090', stage: 'work', eventType: 'choice', weight: 4, title: '结对帮扶', text: '结对帮扶一户困难家庭。第一次上门，对方的话不多，你的礼物很重，气氛比想象中微妙。', choices: [
      { text: '常来常往，建立真情', effects: {eq: 2, workAbility: 2, mentalPressure: 2, integrity: 1} },
      { text: '按规定走访，完成任务', effects: {workAbility: 1, mentalPressure: -1, eq: 1} },
      { text: '帮其对接政策资源', effects: {workAbility: 3, eq: 1, mentalPressure: 2} },
    ]},
    { id: 'enw091', stage: 'work', eventType: 'choice', weight: 5, title: '志愿服务', text: '单位组织志愿服务，你被分到交通路口执勤。烈日下一个小时，你体会到"为人民服务"的物理意义。', choices: [
      { text: '认真执勤，全程在岗', effects: {integrity: 2, workAbility: 2, body: -2, mentalPressure: 2} },
      { text: '主动承担更多时段', effects: {eq: 1, positionWeight: 1, body: -2, mentalPressure: 2} },
      { text: '完成任务即可', effects: {workAbility: 1, mentalPressure: 1, body: -1} },
    ]},
    { id: 'enw092', stage: 'work', eventType: 'choice', weight: 4, title: '趣味运动会报名', text: '工会组织趣味运动会。领导参加的项目，报名表总是满的；没人参加的项目，工会主席挨个打电话。', choices: [
      { text: '积极报名，活跃气氛', effects: {eq: 2, mentalPressure: -2, body: 1} },
      { text: '参加冷门项目，补缺', effects: {eq: 1, workAbility: 1, mentalPressure: -1} },
      { text: '当啦啦队，不参赛', effects: {mentalPressure: -2, eq: 1, positionWeight: -1} },
    ]},
    { id: 'enw093', stage: 'work', eventType: 'choice', weight: 4, title: '团建活动（路线之争）', text: '部门团建去爬山。爬到一半，两位同事为走哪条路争执起来，团建眼看要变成"团战"。', choices: [
      { text: '居中调解，提议折中路线', effects: {eq: 2, workAbility: 1, mentalPressure: 2} },
      { text: '支持多数人意见', effects: {eq: 1, mentalPressure: 1} },
      { text: '分开行动，各走各的', effects: {mentalPressure: -1, eq: -1, workAbility: 1} },
    ]},
    { id: 'enw094', stage: 'work', eventType: 'choice', weight: 4, title: '文体活动', text: '单位文艺汇演，你被推选参演一个节目。排练占用午休，演出占用周末，你在"集体荣誉"和"个人休息"间徘徊。', choices: [
      { text: '认真排练，争取出彩', effects: {eq: 1, positionWeight: 2, mentalPressure: 3, body: -1} },
      { text: '混个群演，不丢面子就行', effects: {mentalPressure: 1, eq: 1, workAbility: 1} },
      { text: '以工作忙为由退出', effects: {mentalPressure: -2, eq: -1, positionWeight: -1} },
    ]},
    { id: 'enw095', stage: 'work', eventType: 'choice', weight: 5, title: '读书会', text: '单位读书会要求分享一本书。你选了一本专业书，发现其他人选的都是"心灵鸡汤"。你像个走错场子的客人。', choices: [
      { text: '坚持分享专业内容，讲透一个点', effects: {iq: 3, workAbility: 2, mentalPressure: 2, eq: -1} },
      { text: '临时换一本通俗的书', effects: {eq: 1, mentalPressure: 1, iq: 1} },
      { text: '分享专业书的通俗版本', effects: {iq: 2, eq: 1, workAbility: 1, mentalPressure: 2} },
    ]},
    { id: 'enw096', stage: 'work', eventType: 'choice', weight: 4, title: '业务比武', text: '系统内业务比武，单位要派代表参赛。领导看了你一眼，那一眼里有期待，也有不容拒绝。', choices: [
      { text: '全力备战，为单位争光', effects: {workAbility: 3, positionWeight: 2, mentalPressure: 4, body: -1} },
      { text: '推荐更合适的同事', effects: {eq: 1, mentalPressure: -1, positionWeight: -1} },
      { text: '参赛但目标定为"不垫底"', effects: {workAbility: 1, mentalPressure: 2, eq: 1} },
    ]},
    { id: 'enw097', stage: 'work', eventType: 'choice', weight: 5, title: '岗位练兵', text: '岗位练兵要求"人人过关"。考核题库里有一半是你没接触过的业务，你像复习一场没上过课的考试。', choices: [
      { text: '加班刷题，确保过关', effects: {workAbility: 3, mentalPressure: 4, body: -1, iq: 1} },
      { text: '找业务骨干请教', effects: {eq: 1, workAbility: 2, mentalPressure: 2} },
      { text: '只练重点，及格就行', effects: {workAbility: 1, mentalPressure: 1, risk: 1} },
    ]},
    { id: 'enw098', stage: 'work', eventType: 'choice', weight: 4, title: '技能竞赛（切磋）', text: '一场技能竞赛，你的对手是兄弟单位的"老法师"。你在后台准备时，手心比稿纸还潮。', choices: [
      { text: '稳住心态，发挥正常水平', effects: {workAbility: 3, mentalPressure: 3, positionWeight: 1} },
      { text: '剑走偏锋，用新方法', effects: {iq: 2, workAbility: 2, risk: 3, mentalPressure: 3} },
      { text: '稳中求胜，不求名次', effects: {workAbility: 2, mentalPressure: 1, eq: 1} },
    ]},
    { id: 'enw099', stage: 'work', eventType: 'choice', weight: 4, title: '创新项目', text: '一个创新项目申报，你构思了半年。评审会上评委一句"这事早就有人做过"，像一盆凉水。', choices: [
      { text: '说明本项目的差异和突破', effects: {iq: 2, workAbility: 3, mentalPressure: 3, positionWeight: 1} },
      { text: '接受意见，调整方向再报', effects: {workAbility: 2, mentalPressure: 2, eq: 1} },
      { text: '据理力争，坚持立项', effects: {positionWeight: 2, risk: 2, mentalPressure: 3, eq: -1} },
    ]},
    { id: 'enw100', stage: 'work', eventType: 'choice', weight: 5, title: '课题研究', text: '一个课题研究到了结题节点，数据却支撑不了结论。你在"改数据"和"改结论"之间，脊背发凉。', choices: [
      { text: '如实说明，调整结论', effects: {integrity: 4, workAbility: 2, risk: -2, mentalPressure: 3} },
      { text: '补充调研，完善数据', effects: {workAbility: 3, mentalPressure: 4, body: -1, iq: 1} },
      { text: '请课题组成员共商', effects: {eq: 1, workAbility: 2, mentalPressure: 2} },
    ]},

    // ================= v2.1.9 内容扩充（enw101-enw112）：政府系统/垂管系统专属 + 联系人深度 + 通用 =================
    // ---- 政府系统（办公厅/政府办）专属池 ----
    { id: 'enw101', stage: 'work', eventType: 'choice', weight: 6, title: '领导批示件督办', pools: ['政府系统'], text: '主要领导在一份群众来信上批示"请速办"，批件经你手转到承办处室。三天过去，承办处室的答复还是"正在办理中"。领导问起进度时，你手心微微出汗。', choices: [
      { text: '催办跟踪，汇总进展如实上报', effects: {workAbility: 3, reputation: 1, mentalPressure: 2} },
      { text: '先汇报"已转办"稳住局面', effects: {risk: 2, positionWeight: 1, integrity: -1} },
      { text: '协调承办单位优先办理', effects: {eq: 2, workAbility: 2, background: 1} },
      { text: '把办理时限压力层层传导', effects: {positionWeight: 1, eq: -1, risk: 1} },
    ]},
    { id: 'enw102', stage: 'work', eventType: 'choice', weight: 5, title: '常务会筹备', pools: ['政府系统'], text: '市政府常务会议题材料要提前三天送审。你在会前一夜发现某部门提交的议题数据与统计局口径不一致，明天就要上会。', choices: [
      { text: '连夜核实，会前说明情况', effects: {workAbility: 3, integrity: 2, mentalPressure: 3, body: -1} },
      { text: '联系统计部门核对口径', effects: {workAbility: 2, eq: 1, background: 1} },
      { text: '暂不声张，等会上再说', effects: {risk: 3, mentalPressure: 2, integrity: -1} },
      { text: '请部门补充说明材料', effects: {workAbility: 1, eq: 1, mentalPressure: 1} },
    ]},
    { id: 'enw103', stage: 'work', eventType: 'auto', weight: 4, title: '政务信息上报', pools: ['政府系统'], text: '你编报的一篇政务信息被省政府办公厅采用，还得了领导批示。信息科老同志拍着你肩膀说："第一条鱼上钩了。"你盯着那行批示，忽然觉得熬夜都值了。', effects: {positionWeight: 2, reputation: 2, workAbility: 1} },
    // ---- 垂管系统（税务）专属池 ----
    { id: 'enw104', stage: 'work', eventType: 'choice', weight: 5, title: '税源调查', pools: ['垂管系统'], text: '上级要求摸清辖区税源底数。你带着两名同事跑了三天，发现一家"规上企业"连续半年零申报，老板躲着不见人。', choices: [
      { text: '深入核查，弄清真实经营状况', effects: {workAbility: 3, integrity: 2, risk: 1, mentalPressure: 2} },
      { text: '按台账数据上报', effects: {risk: 2, positionWeight: 1, integrity: -1} },
      { text: '向局里反映疑点，请上级指导', effects: {workAbility: 2, background: 1, eq: 1} },
      { text: '约谈企业负责人', effects: {eq: 1, workAbility: 2, mentalPressure: 2} },
    ]},
    { id: 'enw105', stage: 'work', eventType: 'choice', weight: 4, title: '减税降费督导', pools: ['垂管系统'], text: '减税降费政策落地督导，一家小微企业主握着你的手说"减免的钱够给工人发一个月工资了"。回去的路上，同组的年轻同事问："咱们这工作，到底图啥？"', choices: [
      { text: '说"图企业能活、工人们有饭吃"', effects: {integrity: 2, peopleReputation: 2, eq: 1} },
      { text: '自嘲说"图个饭碗稳定"', effects: {eq: 1, mentalPressure: -1, reputation: 1} },
      { text: '借机给他讲税务系统晋升路径', effects: {desire: 2, workAbility: 1} },
      { text: '沉默，觉得这种话太矫情', effects: {mentalPressure: 1, eq: -1} },
    ]},
    { id: 'enw106', stage: 'work', eventType: 'auto', weight: 4, title: '征管数据核查', pools: ['垂管系统'], text: '金税系统推送的异常数据核查完毕，你发现某纳税人虚列成本。报告写好后，科长看了一遍说"口径要稳"。你明白他的意思，也明白自己该写什么。', effects: {workAbility: 2, risk: 1, mentalPressure: 2, integrity: 1} },
    // ---- 联系人深度：老板（business 线） ----
    { id: 'enw107', stage: 'work', eventType: 'choice', weight: 4, year: [28, 55], requireContact: 'boss', requireContactMin: 50, title: '吴总的饭局', text: '吴总组了个饭局，席间提起他有个项目想"挂靠"到你熟识的部门。他给你夹菜的手很稳，语气却带着试探："都是老朋友了，帮我把把关？"', choices: [
      { text: '直言项目要合规，只谈合法部分', effects: {integrity: 2, eq: 1, risk: 1, contactRelation: { id: 'boss', delta: 5 } } },
      { text: '介绍正规申报流程给他', effects: {workAbility: 2, integrity: 1, contactRelation: { id: 'boss', delta: 10 } } },
      { text: '含糊应承，先看他怎么操作', effects: {risk: 3, integrity: -1, contactRelation: { id: 'boss', delta: 5 } } },
      { text: '以纪律为由婉拒牵线', effects: {integrity: 2, contactRelation: { id: 'boss', delta: -10 } } },
    ]},
    { id: 'enw108', stage: 'work', eventType: 'choice', weight: 3, year: [25, 50], requireContact: 'boss', requireContactMin: 40, title: '吴总的新项目', text: '吴总邀你周末去看他的新项目——城郊一块地，说"先看看，说不定以后有用"。他话里有话，你也听出了言外之意。', choices: [
      { text: '婉拒，说周末要陪家人', effects: {integrity: 2, familyPressure: -1, contactRelation: { id: 'boss', delta: -5 } } },
      { text: '去看，只当开阔眼界', effects: {background: 1, iq: 1, risk: 2, contactRelation: { id: 'boss', delta: 5 } } },
      { text: '带上懂行的朋友同去', effects: {eq: 1, iq: 1, risk: 1, contactRelation: { id: 'boss', delta: 3 } } },
    ]},
    // ---- 联系人深度：导师 ----
    { id: 'enw109', stage: 'work', eventType: 'choice', weight: 4, year: [26, 50], requireContact: 'mentor', requireContactMin: 60, title: '导师的课题', text: '导师受邀牵头一个重大课题，点名让你参与核心章节。课题要脱产半年，单位这边又是用人之际，两难全摆在桌上。', choices: [
      { text: '接课题，向单位申请支持', effects: {iq: 2, workAbility: 2, positionWeight: 1, mentalPressure: 3, contactRelation: { id: 'mentor', delta: 15 } } },
      { text: '边工作边参与，两头兼顾', effects: {workAbility: 2, body: -1, mentalPressure: 3, contactRelation: { id: 'mentor', delta: 5 } } },
      { text: '婉拒，说明单位任务重', effects: {contactRelation: { id: 'mentor', delta: -10 }, mentalPressure: -1} },
      { text: '推荐单位年轻人参与', effects: {eq: 2, workAbility: 1, contactRelation: { id: 'mentor', delta: -5 } } },
    ]},
    // ---- 通用工作主题 ----
    { id: 'enw110', stage: 'work', eventType: 'choice', weight: 4, title: '会务筹备', text: '系统内大型现场会放在你们市召开。会务方案改了五版，领导最后拍板："按第一版来。"你默默把五版打印稿收回文件柜。', choices: [
      { text: '按领导定稿执行，不再纠结', effects: {workAbility: 2, mentalPressure: -1, eq: 1} },
      { text: '私下保留改进建议备用', effects: {iq: 1, workAbility: 1, mentalPressure: 1} },
      { text: '提醒领导第一版有的细节已过时', effects: {integrity: 2, risk: 1, eq: 1} },
      { text: '让会务组自行优化细节', effects: {eq: 1, workAbility: 1, risk: 1} },
    ]},
    { id: 'enw111', stage: 'work', eventType: 'auto', weight: 3, title: '材料大比武', text: '全市办公室系统材料大比武，你代表单位出战。三个小时，手写两千字命题材料。交卷时你手指发酸，但心里有种久违的痛快。', effects: {workAbility: 3, reputation: 2, mentalPressure: -1, desire: 1} },
    { id: 'enw112', stage: 'work', eventType: 'choice', weight: 4, title: '借调函', text: '上级部门发来借调函，想借你过去帮忙一年。原单位领导不放人，借调单位催得紧，你夹在中间，像一块被两头拉扯的橡皮。', choices: [
      { text: '服从原单位安排', effects: {eq: 1, integrity: 1, positionWeight: -1, background: -1} },
      { text: '争取借调机会', effects: {background: 2, positionWeight: 1, mentalPressure: 2, eq: -1} },
      { text: '请两边协调折中方案', effects: {eq: 2, workAbility: 1, mentalPressure: 1} },
      { text: '顺其自然，听组织安排', effects: {mentalPressure: -1, desire: -1} },
    ]},

    { id: 'enw113', stage: 'work', eventType: 'choice', weight: 4, title: '值班带班', text: '周末轮到你带班。晚上十点，值班电话响了：一起突发事件需要马上协调处置。你抓起电话，脑子飞速转着——先报告谁、怎么处置、要不要启动预案。', choices: [
      { text: '按预案逐级报告，冷静处置', effects: {workAbility: 3, positionWeight: 1, mentalPressure: 2, risk: -1} },
      { text: '先问清情况再决定', effects: {iq: 1, workAbility: 1, mentalPressure: 1} },
      { text: '直接打电话给主要领导请示', effects: {eq: 1, risk: 1, background: 1} },
      { text: '压一压，等明天上班再说', effects: {risk: 5, positionWeight: -2, integrity: -2} },
    ]},
    { id: 'enw114', stage: 'work', eventType: 'auto', weight: 3, title: '档案整理', text: '档案室年度整理，你负责的一柜档案被要求全部数字化扫描。两千多页材料，扫描仪嗡嗡响了一整天。下班时老档案员说："年轻人的耐心，都是这样磨出来的。"', effects: {workAbility: 2, mentalPressure: -1, integrity: 1} },

    // ================= v2.1.10 内容扩充（enw115-enw126）：数据/窗口部门池 + 联系人深度 =================
    // ---- 数据部门/技术部门专属池 ----
    { id: 'enw115', stage: 'work', eventType: 'choice', weight: 5, title: '数据质量攻坚', pools: ['数据部门', '技术部门'], text: '跨部门数据归集发现大量脏数据：身份证号缺位、地址格式混乱、历史档案未电子化。领导要求"三个月内完成治理"。你看着几百万条记录，倒吸一口凉气。', choices: [
      { text: '制定分阶段清洗计划，先易后难', effects: {workAbility: 3, iq: 1, mentalPressure: 2} },
      { text: '向上申请增派人手和经费', effects: {background: 2, workAbility: 1, mentalPressure: 1} },
      { text: '先清洗高频使用字段', effects: {workAbility: 2, iq: 2, risk: 1} },
      { text: '外包给技术公司处理', effects: {workAbility: 1, risk: 3, wealth: -20} },
    ]},
    { id: 'enw116', stage: 'work', eventType: 'choice', weight: 4, title: '系统宕机应急', pools: ['数据部门', '技术部门'], text: '周五下班前，核心业务系统突然宕机。大厅排起了长队，电话响个不停。运维同事说"可能是存储扩容引发的问题，需要重启验证"。', choices: [
      { text: '启动应急预案，组织抢修', effects: {workAbility: 3, positionWeight: 1, mentalPressure: 3, body: -1} },
      { text: '先安抚现场，同步排查', effects: {eq: 2, workAbility: 2, mentalPressure: 2} },
      { text: '让运维自行处理，等结果', effects: {risk: 3, positionWeight: -1, workAbility: -1} },
      { text: '上报领导请求统筹支持', effects: {background: 1, workAbility: 1, mentalPressure: 1} },
    ]},
    { id: 'enw117', stage: 'work', eventType: 'auto', weight: 4, title: '数据安全演练', pools: ['数据部门', '技术部门'], text: '网络安全攻防演练结束，你们单位得分 92，全市第二。复盘会上，大家复盘到凌晨——那 8 分丢得心疼，但演练暴露的漏洞都堵上了。', effects: {workAbility: 2, reputation: 2, positionWeight: 1, mentalPressure: -1} },
    // ---- 窗口部门专属池 ----
    { id: 'enw118', stage: 'work', eventType: 'choice', weight: 5, title: '办事高峰应对', pools: ['窗口部门'], text: '每月申报高峰，大厅人山人海。一位大爷排了两个小时队，轮到他却发现材料没带齐，当场急了："你们怎么不早说！"', choices: [
      { text: '耐心解释，告知备齐后可优先办理', effects: {eq: 2, peopleReputation: 2, mentalPressure: 1} },
      { text: '协调同事先帮老人办理', effects: {eq: 2, reputation: 1, workAbility: 1} },
      { text: '按规定告知缺件，让他重新排队', effects: {peopleReputation: -2, eq: -1, workAbility: 1} },
      { text: '建议大厅增设预审导办台', effects: {workAbility: 2, iq: 1, reputation: 1} },
    ]},
    { id: 'enw119', stage: 'work', eventType: 'choice', weight: 4, title: '好差评风波', pools: ['窗口部门'], text: '政务服务"好差评"系统里，你收到一条差评："态度冷漠，业务不熟。"你翻遍记录也没找到是哪位群众——那天窗口确实忙，你确实也只顾着低头办件。', choices: [
      { text: '复盘当天情况，主动改进', effects: {workAbility: 2, eq: 1, reputation: 1} },
      { text: '联系群众了解具体问题', effects: {eq: 2, peopleReputation: 1, mentalPressure: 1} },
      { text: '申诉要求撤销差评', effects: {risk: 1, eq: -1, reputation: -1} },
      { text: '申请调看监控核实', effects: {workAbility: 1, integrity: 1, mentalPressure: 1} },
    ]},
    { id: 'enw120', stage: 'work', eventType: 'auto', weight: 3, title: '跨省通办落地', pools: ['窗口部门'], text: '跨省通办窗口正式挂牌。第一个来办件的群众是位返乡创业者，他在外地办的执照数据几分钟就调过来了。他连声道谢，你第一次觉得"数据多跑路"不是句口号。', effects: {workAbility: 2, reputation: 2, peopleReputation: 2} },
    // ---- 联系人深度：老邻居 / 老中医 / 记者 ----
    { id: 'enw121', stage: 'work', eventType: 'choice', weight: 4, year: [30, 60], requireContact: 'neighbor', requireContactMin: 60, title: '刘大爷的嘱托', text: '退休老干部邻居刘大爷找到你，说他女婿在街道办了个便民食堂，手续卡在了消防验收上。"你在机关认识的人多，帮忙问问流程就行。"', choices: [
      { text: '帮忙打听正规流程，不越线', effects: {eq: 2, integrity: 2, workAbility: 1, contactRelation: { id: 'neighbor', delta: 10 } } },
      { text: '直接引荐给消防部门熟人', effects: {background: 1, risk: 2, contactRelation: { id: 'neighbor', delta: 10 } } },
      { text: '婉拒，让他走正常渠道', effects: {integrity: 2, contactRelation: { id: 'neighbor', delta: -5 } } },
      { text: '建议食堂整改消防隐患', effects: {workAbility: 2, eq: 1, contactRelation: { id: 'neighbor', delta: 5 } } },
    ]},
    { id: 'enw122', stage: 'work', eventType: 'choice', weight: 3, year: [26, 55], requireContact: 'doctor', requireContactMin: 50, title: '医生的建议', text: '老同学王医生提醒你：上次体检的结节该复查了，拖不得。他看你一眼："别拿命换工作。"你嘴上说好，心里却想着下个月的验收。', choices: [
      { text: '听话去复查，身体第一', effects: {body: 2, mentalPressure: -1, workAbility: -1, contactRelation: { id: 'doctor', delta: 5 } } },
      { text: '忙完这阵子就去', effects: {workAbility: 1, mentalPressure: 1, body: -1} },
      { text: '请他帮忙约个专家号', effects: {body: 1, eq: 1, contactRelation: { id: 'doctor', delta: 5 } } },
      { text: '不当回事，觉得他大惊小怪', effects: {body: -1, mentalPressure: -1, contactRelation: { id: 'doctor', delta: -5 } } },
    ]},
    { id: 'enw123', stage: 'work', eventType: 'choice', weight: 4, year: [26, 55], requireContact: 'journalist', requireContactMin: 50, title: '记者的线索', text: '跑口记者小何私下找你："听说你们系统要出个重大政策，给透露点风声呗？我保证不写名字。"她笑得无害，你知道这是职业习惯。', choices: [
      { text: '婉拒，说以官方发布为准', effects: {integrity: 2, contactRelation: { id: 'journalist', delta: -5 } } },
      { text: '只谈已公开的信息', effects: {eq: 1, integrity: 1, contactRelation: { id: 'journalist', delta: 5 } } },
      { text: '含糊透露一点方向', effects: {risk: 3, background: 1, contactRelation: { id: 'journalist', delta: 10 } } },
      { text: '提醒她走正规采访流程', effects: {workAbility: 1, integrity: 1, contactRelation: { id: 'journalist', delta: -3 } } },
    ]},
    // ---- 通用工作主题 ----
    { id: 'enw124', stage: 'work', eventType: 'choice', weight: 4, title: '民主生活会（直言）', text: '民主生活会上，轮到你给领导提意见。大家说了几个不痛不痒的，轮到你时，你想起那个被砍掉的项目和加班的兄弟们。', choices: [
      { text: '委婉提出真实建议', effects: {integrity: 2, risk: 1, positionWeight: 1} },
      { text: '从众，说几句客套话', effects: {risk: -1, eq: 1, integrity: -1} },
      { text: '直言不讳，点名问题', effects: {integrity: 3, risk: 2, eq: -1} },
      { text: '借机反映基层负担问题', effects: {integrity: 2, peopleReputation: 1, risk: 1} },
    ]},
    { id: 'enw125', stage: 'work', eventType: 'auto', weight: 3, title: '三八节活动', text: '单位组织三八节活动，女同事多，工会让你一个男同志负责后勤。你订花订蛋糕订场地，忙得脚不沾地——但看到大家笑得开心，你忽然觉得这事挺值的。', effects: {eq: 2, reputation: 1, mentalPressure: -1} },
    { id: 'enw126', stage: 'work', eventType: 'choice', weight: 4, title: '借调到期', text: '借调期限到了，借调单位想留你，原单位催你回去。两边都给了"口头承诺"，你站在岔路口，谁的保证都不敢全信。', choices: [
      { text: '回原单位，稳扎稳打', effects: {positionWeight: 1, eq: 1, background: -1} },
      { text: '争取留任借调单位', effects: {positionWeight: 2, background: 2, risk: 2} },
      { text: '向两边表达真实意愿', effects: {eq: 2, integrity: 1, mentalPressure: 1} },
      { text: '让组织决定，不主动表态', effects: {mentalPressure: -1, desire: -1} },
    ]},

    // ================= v2.1.11 内容扩充（enw127-enw144）：政法/机关/执法/垂管池 + 联系人深度 =================
    // ---- 垂管系统（税务）专属池 ----
    { id: 'enw127', stage: 'work', eventType: 'choice', weight: 5, title: '发票专项检查', pools: ['垂管系统'], text: '发票专项检查中，你发现一家贸易公司进销项严重不匹配：进的是钢材，销的却是电子元件。老板态度很好："都是老朋友介绍的，帮帮忙。"', choices: [
      { text: '按程序立案核查', effects: {integrity: 3, workAbility: 2, risk: 1, mentalPressure: 2} },
      { text: '先约谈核实情况', effects: {workAbility: 2, eq: 1, mentalPressure: 1} },
      { text: '暗示对方主动补税', effects: {integrity: 1, risk: 2, background: 1} },
      { text: '压住不动，等风声过去', effects: {risk: 4, heat: 3, integrity: -2} },
    ]},
    { id: 'enw128', stage: 'work', eventType: 'auto', weight: 4, title: '纳税服务之星', pools: ['垂管系统'], text: '季度纳税服务之星评选，你以群众满意度第一的成绩当选。办税大厅的墙上贴了你的照片，一位常来办税的老会计看见，竖了个大拇指。', effects: {reputation: 2, peopleReputation: 2, workAbility: 1} },
    { id: 'enw129', stage: 'work', eventType: 'choice', weight: 4, title: '税企座谈会', pools: ['垂管系统'], text: '税企座谈会上，一位企业主直言："现在申报流程是简化了，可每次新政出来，我们都要摸索半天。"他看向你："你们能不能搞个明白人对接？"', choices: [
      { text: '记录诉求，推动建立辅导机制', effects: {workAbility: 2, peopleReputation: 2, reputation: 1} },
      { text: '当场留下联系方式承诺跟进', effects: {eq: 2, workAbility: 1, mentalPressure: 1} },
      { text: '解释政策发布渠道已很完善', effects: {eq: -1, risk: 1} },
      { text: '会后整理成专报上报', effects: {workAbility: 2, positionWeight: 1, background: 1} },
    ]},
    // ---- 政法系统专属池 ----
    { id: 'enw130', stage: 'work', eventType: 'choice', weight: 5, title: '执行难攻坚', pools: ['政法系统'], text: '一起拖欠农民工工资的执行案压了半年：被执行人名下查无财产，申请人天天来院门口等消息。同事说"这案子没办法了"，你翻着卷宗，发现他转移财产的时间线有破绽。', choices: [
      { text: '顺藤摸瓜，深挖转移线索', effects: {workAbility: 3, integrity: 2, mentalPressure: 3} },
      { text: '向领导汇报争取跨部门协查', effects: {background: 2, workAbility: 1, mentalPressure: 1} },
      { text: '走司法救助渠道先解燃眉之急', effects: {eq: 2, peopleReputation: 2, background: -1} },
      { text: '告知申请人执行不能，终结程序', effects: {eq: -2, peopleReputation: -1, workAbility: 1} },
    ]},
    { id: 'enw131', stage: 'work', eventType: 'choice', weight: 4, title: '公益诉讼线索', pools: ['政法系统'], text: '你收到一条公益诉讼线索：城郊某工厂偷排污水，附近的菜地灌溉用水发黑。证据链还不完整，但再拖下去，污染会扩散。', choices: [
      { text: '实地取证，固定证据链', effects: {workAbility: 3, integrity: 2, mentalPressure: 2, body: -1} },
      { text: '联合环保部门同步调查', effects: {workAbility: 2, eq: 1, background: 1} },
      { text: '先发检察建议督促整改', effects: {integrity: 2, workAbility: 1, reputation: 1} },
      { text: '线索移交相关部门处理', effects: {workAbility: 1, eq: 1, mentalPressure: -1} },
    ]},
    { id: 'enw132', stage: 'work', eventType: 'auto', weight: 4, title: '巡回法庭进村', pools: ['政法系统'], text: '巡回法庭把庭审搬到村里，审理一起赡养纠纷。旁听的村民把晒谷场围得水泄不通。宣判后，那位白发老人握着法官的手直说"谢谢"。你坐在书记员席上，第一次觉得这身制服有分量。', effects: {reputation: 2, peopleReputation: 3, integrity: 1} },
    // ---- 机关（人大/政协）专属池 ----
    { id: 'enw133', stage: 'work', eventType: 'choice', weight: 4, title: '代表联络站', pools: ['机关'], text: '人大代表联络站开放日，一位代表提了个建议：政务大厅的老年窗口排队太久，建议增设"爱心专窗"。你负责答复办理。', choices: [
      { text: '实地调研后推动增设专窗', effects: {workAbility: 2, peopleReputation: 2, reputation: 1} },
      { text: '按现行政策说明情况', effects: {workAbility: 1, eq: 1, integrity: 1} },
      { text: '先回复"已研究"，再慢慢办', effects: {risk: 2, reputation: -1} },
      { text: '邀请代表现场体验监督', effects: {eq: 2, workAbility: 1, reputation: 1} },
    ]},
    { id: 'enw134', stage: 'work', eventType: 'auto', weight: 3, title: '专题询问会', pools: ['机关'], text: '人大常委会专题询问会，委员们就老旧小区改造资金使用连珠炮发问。你作为材料组负责人，在台下把每一页数据都翻得滚瓜烂熟——幸好，问到的都有准备。', effects: {workAbility: 3, reputation: 2, mentalPressure: 2} },
    // ---- 执法部门专属池 ----
    { id: 'enw135', stage: 'work', eventType: 'choice', weight: 4, title: '夜市整治', pools: ['执法部门'], text: '夜市整治行动，你带队巡查。一个摆摊的大姐看到你们撒腿就跑，摊子上一锅热汤差点泼到孩子身上。你拦住她，她哭了："孩子学费还差两千。"', choices: [
      { text: '依规处理，但帮忙联系合规摊位', effects: {integrity: 2, eq: 2, peopleReputation: 2} },
      { text: '批评教育后放行', effects: {eq: 2, integrity: 1, risk: 1} },
      { text: '按无证经营从严处罚', effects: {integrity: 2, peopleReputation: -2, eq: -1} },
      { text: '了解困难，协调社区帮扶', effects: {eq: 2, peopleReputation: 2, workAbility: 1} },
    ]},
    { id: 'enw136', stage: 'work', eventType: 'auto', weight: 3, title: '夜查行动', pools: ['执法部门'], text: '凌晨的联合夜查，你在一处出租屋里发现违规存放的危化品。处置完已是天亮，你在执法车里眯了半小时，手机闹钟又响了——白天的例行检查不能误。', effects: {workAbility: 2, integrity: 1, body: -1, mentalPressure: 2} },
    // ---- 党委系统专属池 ----
    { id: 'enw137', stage: 'work', eventType: 'choice', weight: 4, title: '组织生活会（互相批评）', pools: ['党委系统'], text: '支部组织生活会，大家互相提意见。一位老党员直言："你最近工作热情有所减退，群众反映你下基层少了。"你脸上挂不住，但知道他说的不假。', choices: [
      { text: '虚心接受，当场表态整改', effects: {integrity: 2, eq: 1, reputation: 1} },
      { text: '解释近期工作重点转移', effects: {eq: 1, integrity: -1, mentalPressure: 1} },
      { text: '感谢批评，会后反思调整', effects: {integrity: 2, mentalPressure: 1} },
      { text: '反驳说他也好久没下基层了', effects: {eq: -2, integrity: -1, risk: 1} },
    ]},
    { id: 'enw138', stage: 'work', eventType: 'auto', weight: 3, title: '党日活动', pools: ['党委系统'], text: '主题党日活动走进红色教育基地。讲解员讲到那段岁月时，队伍里没人说话。回来的车上，老同志们聊起入党时的情景，你也想起自己攥着申请书的那天。', effects: {integrity: 2, mentalPressure: -1, reputation: 1} },
    // ---- 联系人深度：老友/下属/表亲 ----
    { id: 'enw139', stage: 'work', eventType: 'choice', weight: 4, year: [26, 55], requireContact: 'oldFriend', requireContactMin: 50, title: '老友的仕途', text: '多年好友最近也进了体制，分在隔壁市。他隔三差五打电话请教"机关生存之道"，最近一次欲言又止："有人说我跟领导走得近是拍马屁……"', choices: [
      { text: '劝他守本心，把工作干好', effects: {eq: 2, integrity: 2, contactRelation: { id: 'oldFriend', delta: 10 } } },
      { text: '教他如何应对风言风语', effects: {eq: 1, iq: 1, contactRelation: { id: 'oldFriend', delta: 5 } } },
      { text: '提醒他注意保持距离', effects: {eq: 1, contactRelation: { id: 'oldFriend', delta: 5 } } },
      { text: '敷衍几句，不想掺和', effects: {contactRelation: { id: 'oldFriend', delta: -5 }, mentalPressure: -1} },
    ]},
    { id: 'enw140', stage: 'work', eventType: 'choice', weight: 4, year: [26, 55], requireContact: 'subordinate', requireContactMin: 50, title: '小赵的调动', text: '得力下属小赵提出想调动到业务科室——他能力强，但一直被你留在身边写材料。他低着头说："主任，我想试试业务。"你看着自己案头堆成山的材料，一时语塞。', choices: [
      { text: '支持他发展，帮忙推荐', effects: {eq: 2, integrity: 2, workAbility: -1, contactRelation: { id: 'subordinate', delta: 15 } } },
      { text: '挽留他，承诺明年推荐', effects: {eq: 1, workAbility: 1, contactRelation: { id: 'subordinate', delta: -5 } } },
      { text: '提出条件：带出接班人再走', effects: {eq: 1, workAbility: 1, contactRelation: { id: 'subordinate', delta: 0 } } },
      { text: '同意，但心里不是滋味', effects: {eq: -1, mentalPressure: 1, contactRelation: { id: 'subordinate', delta: 5 } } },
    ]},
    { id: 'enw141', stage: 'work', eventType: 'choice', weight: 3, year: [26, 50], requireContact: 'cousin', requireContactMin: 40, title: '表弟的求助', text: '表弟中专毕业，在工地干了两年，想进你们单位当编外人员。姑姑亲自打电话来："你弟从小就听你的，你给安排安排。"', choices: [
      { text: '说明编外招录流程，让他正常应聘', effects: {integrity: 2, eq: 1, workAbility: 1, contactRelation: { id: 'cousin', delta: 5 } } },
      { text: '帮忙打听有没有合适岗位', effects: {background: 1, risk: 1, contactRelation: { id: 'cousin', delta: 10 } } },
      { text: '直说单位进人规矩严，帮不上', effects: {integrity: 2, contactRelation: { id: 'cousin', delta: -10 } } },
      { text: '让他先考证提升学历再说', effects: {workAbility: 1, iq: 1, contactRelation: { id: 'cousin', delta: 5 } } },
    ]},
    // ---- 通用工作 ----
    { id: 'enw142', stage: 'work', eventType: 'choice', weight: 4, title: '文印室的黄昏', text: '文印室老师傅快退休了，印务、装订、红头文件排版都是他一人扛。领导让你"接好班"。你走进那间油墨味很重的屋子，他正扶着一沓文件教你折页。', choices: [
      { text: '认真学，把这门手艺接下', effects: {workAbility: 2, eq: 1, integrity: 1} },
      { text: '建议推进文印数字化', effects: {iq: 2, workAbility: 1, mentalPressure: 1} },
      { text: '先应付着，等新设备到位', effects: {workAbility: -1, mentalPressure: 1} },
      { text: '跟老师傅请教公文格式细节', effects: {workAbility: 2, eq: 1} },
    ]},
    { id: 'enw143', stage: 'work', eventType: 'choice', weight: 4, title: '调研点安排', text: '上级领导要来调研，你负责踩点。领导行程表上第一个点是个"亮点工程"，但你实地去看，发现停工快半年了——围挡后面是锈迹斑斑的钢筋。', choices: [
      { text: '如实上报，建议调整调研点', effects: {integrity: 3, risk: 2, mentalPressure: 2} },
      { text: '按原计划安排，现场协调遮掩', effects: {risk: 4, positionWeight: 1, integrity: -2} },
      { text: '换个真实有进展的参观点', effects: {workAbility: 2, eq: 1, background: 1} },
      { text: '请示领导后决定', effects: {background: 1, workAbility: 1, mentalPressure: 1} },
    ]},
    { id: 'enw144', stage: 'work', eventType: 'auto', weight: 3, title: '办公软件培训', text: '单位组织办公软件培训，来的多是快退休的老同志。你发现有人悄悄记笔记，把"合并单元格"写了好几遍。培训结束后，那位老同志拦住你："小同志，能再教教我吗？"', effects: {eq: 2, reputation: 1, workAbility: 1} },

    // ================= v2.1.12 内容扩充（enw145-enw164）：政府/民生/技术/数据池 + 联系人深度 =================
    // ---- 政府系统（办公厅）专属池 ----
    { id: 'enw145', stage: 'work', eventType: 'choice', weight: 5, title: '政府工作报告起草', pools: ['政府系统'], text: '政府工作报告起草组又开夜车。你负责"民生保障"章节，手里的数据改了六版：就业指标、医保结余、养老床位……每改一个数，后面都是一串部门的博弈。', choices: [
      { text: '坚持用核实过的数据', effects: {integrity: 3, workAbility: 2, mentalPressure: 2} },
      { text: '按领导意图调整口径', effects: {risk: 2, positionWeight: 1, integrity: -1} },
      { text: '标注存疑数据提请确认', effects: {workAbility: 2, integrity: 2, mentalPressure: 1} },
      { text: '用模糊表述避免争议', effects: {workAbility: 1, risk: 1, integrity: -1} },
    ]},
    { id: 'enw146', stage: 'work', eventType: 'auto', weight: 4, title: '值班室的一夜', pools: ['政府系统'], text: '市政府总值班室的一夜：凌晨两点接报一起高速事故，三点协调医疗救援，五点汇总信息上报。天亮时你把值班记录合上，窗外已是车水马龙。', effects: {workAbility: 2, mentalPressure: 3, body: -1, reputation: 1} },
    { id: 'enw147', stage: 'work', eventType: 'choice', weight: 4, title: '文件会签', pools: ['政府系统'], text: '一份跨部门文件送到你手上会签，涉及财政、住建、发改三个部门。财政说"没钱"，住建说"没地"，发改说"没依据"。文件在三个部门间旅行了两周。', choices: [
      { text: '牵头召开协调会', effects: {workAbility: 3, eq: 1, mentalPressure: 2} },
      { text: '逐部门上门沟通', effects: {eq: 2, workAbility: 2, background: 1} },
      { text: '请分管领导出面协调', effects: {background: 2, workAbility: 1, mentalPressure: 1} },
      { text: '先搁置，等上面催办', effects: {risk: 2, positionWeight: -1} },
    ]},
    // ---- 民生部门专属池 ----
    { id: 'enw148', stage: 'work', eventType: 'choice', weight: 5, title: '低保复核风波', pools: ['民生部门'], text: '低保复核中，你发现一户家庭名下有车但仍在领低保。按规定应取消，但核实后发现那车是儿子跑网约车的营生——取消低保，一家人可能返贫。', choices: [
      { text: '按规定取消，程序正义', effects: {integrity: 2, workAbility: 1, risk: -1} },
      { text: '核实真实收入后酌情处理', effects: {workAbility: 2, eq: 1, peopleReputation: 1} },
      { text: '指导其申请其他救助', effects: {eq: 2, workAbility: 2, peopleReputation: 2} },
      { text: '睁一只眼闭一只眼', effects: {risk: 3, integrity: -2, peopleReputation: -1} },
    ]},
    { id: 'enw149', stage: 'work', eventType: 'auto', weight: 4, title: '养老院检查', pools: ['民生部门'], text: '养老机构专项检查，你在一家民办养老院发现灭火器过期、食堂留样不规范。院长陪着笑脸解释，你指着墙上的安全须知问："这上面写着谁负责？"他沉默了。', effects: {workAbility: 2, integrity: 2, mentalPressure: 2} },
    { id: 'enw150', stage: 'work', eventType: 'choice', weight: 4, title: '困境儿童走访', pools: ['民生部门'], text: '走访困境儿童家庭，一个十岁的小姑娘给你倒水，杯子洗得发亮。她爸爸残疾，妈妈外出打工。临走时她追出来问："阿姨，下学期学费……"', choices: [
      { text: '协调落实教育救助', effects: {peopleReputation: 2, workAbility: 2, eq: 2, integrity: 1} },
      { text: '留下联系方式持续跟进', effects: {eq: 2, workAbility: 1, mentalPressure: 1} },
      { text: '记录情况，转交救助站', effects: {workAbility: 1, mentalPressure: 1} },
      { text: '个人先垫付部分费用', effects: {wealth: -10, eq: 2, familyPressure: 1} },
    ]},
    // ---- 技术/数据部门专属池 ----
    { id: 'enw151', stage: 'work', eventType: 'choice', weight: 4, title: '机房搬迁', pools: ['技术部门', '数据部门'], text: '机房整体搬迁，涉及三个业务系统的无缝切换。凌晨两点是窗口期，你的手机定了一排闹钟。机房工程师说"理论上没问题"，你听出了"理论"两个字的分量。', choices: [
      { text: '全程盯守，演练应急预案', effects: {workAbility: 3, body: -1, mentalPressure: 3} },
      { text: '安排双人值守互为备份', effects: {eq: 1, workAbility: 2, mentalPressure: 1} },
      { text: '白天先做数据备份校验', effects: {workAbility: 2, iq: 1, mentalPressure: 1} },
      { text: '交给运维团队，电话待命', effects: {risk: 2, workAbility: -1} },
    ]},
    { id: 'enw152', stage: 'work', eventType: 'auto', weight: 3, title: '系统升级公告', pools: ['技术部门', '数据部门'], text: '系统升级公告发布，你特意用大白话解释"为什么半夜不能用系统"。留言区有人回："终于有个说人话的公告了。"你截图发给同事，笑得像个孩子。', effects: {workAbility: 2, reputation: 1, eq: 1} },
    // ---- 联系人深度：督察组/党校同学/老总/旧情 ----
    { id: 'enw153', stage: 'work', eventType: 'choice', weight: 4, year: [26, 58], requireContact: 'inspector', requireContactMin: 50, title: '督察组的朋友', text: '在党校认识的那位督察组朋友来你市督查，晚饭时单独约你："你们单位那笔项目资金，流程上是不是有点急？"他问得随意，你听得心惊。', choices: [
      { text: '如实说明情况，不遮掩', effects: {integrity: 3, risk: -2, mentalPressure: 2, contactRelation: { id: 'inspector', delta: 10 } } },
      { text: '先了解他的信息来源', effects: {iq: 1, mentalPressure: 2, contactRelation: { id: 'inspector', delta: 0 } } },
      { text: '暗示他高抬贵手', effects: {risk: 3, integrity: -2, contactRelation: { id: 'inspector', delta: -5 } } },
      { text: '借机自查单位账目', effects: {workAbility: 2, integrity: 2, mentalPressure: 2, contactRelation: { id: 'inspector', delta: 5 } } },
    ]},
    { id: 'enw154', stage: 'work', eventType: 'choice', weight: 3, year: [26, 50], requireContact: 'partySchool', requireContactMin: 50, title: '党校同学的忙', text: '党校同班同学调到邻市发改局，打电话说想组织一次"兄弟城市产业对接考察"，点名要你帮忙对接本地企业。你记得他在党校时人缘极好，也记得他组局总带点别的味道。', choices: [
      { text: '组织正常对接交流', effects: {eq: 2, workAbility: 2, background: 1, contactRelation: { id: 'partySchool', delta: 10 } } },
      { text: '婉拒，说近期工作忙', effects: {eq: -1, contactRelation: { id: 'partySchool', delta: -10 } } },
      { text: '先了解考察目的再定', effects: {iq: 1, contactRelation: { id: 'partySchool', delta: 0 } } },
      { text: '帮忙但明确合规边界', effects: {integrity: 2, eq: 1, contactRelation: { id: 'partySchool', delta: 5 } } },
    ]},
    { id: 'enw155', stage: 'work', eventType: 'choice', weight: 4, year: [28, 55], requireContact: 'boss', requireContactMin: 60, title: '吴总的项目推进', text: '吴总那个挂靠项目推进到关键环节，他送来一份"合作框架协议"，里面有一笔咨询费条款。他说"这是行业惯例"，你看着数字后面那几个零，知道这不是惯例，是试探。', choices: [
      { text: '拒绝签字，说明条款违规', effects: {integrity: 3, risk: -2, contactRelation: { id: 'boss', delta: -10 } } },
      { text: '提出修改条款后再谈', effects: {eq: 1, workAbility: 1, risk: 1, contactRelation: { id: 'boss', delta: 0 } } },
      { text: '签了，先把项目推下去', effects: {risk: 4, heat: 3, integrity: -2, contactRelation: { id: 'boss', delta: 10 } } },
      { text: '上报组织审查协议', effects: {integrity: 3, workAbility: 1, risk: -1, contactRelation: { id: 'boss', delta: -15 } } },
    ]},
    { id: 'enw156', stage: 'work', eventType: 'choice', weight: 3, year: [28, 55], requireContact: 'exBoss', requireContactMin: 40, title: '老东家的饭局', text: '前领导（现在在国企当副总）组局，饭桌上提起"你们系统最近有个项目招标，我们公司也想参与"。他给你夹菜的动作还和从前一样自然。', choices: [
      { text: '提醒他走正规投标流程', effects: {integrity: 2, workAbility: 1, contactRelation: { id: 'exBoss', delta: 5 } } },
      { text: '婉拒聊公事，只叙旧', effects: {eq: 2, contactRelation: { id: 'exBoss', delta: 5 } } },
      { text: '透露点招标信息卖人情', effects: {risk: 4, heat: 3, integrity: -2, contactRelation: { id: 'exBoss', delta: 10 } } },
      { text: '提醒他注意回避制度', effects: {integrity: 2, eq: 1, contactRelation: { id: 'exBoss', delta: 0 } } },
    ]},
    // ---- 通用工作 ----
    { id: 'enw157', stage: 'work', eventType: 'choice', weight: 4, title: '年度考核谈话', text: '年度考核结果出来，你得了"称职"。隔壁科室和你同期入职的小李得了"优秀"。领导找你谈话："你工作扎实，但亮点不足。"你低头，明白这话的潜台词。', choices: [
      { text: '虚心接受，明年争取亮点', effects: {eq: 1, workAbility: 2, mentalPressure: 1} },
      { text: '请领导指出改进方向', effects: {eq: 2, workAbility: 1} },
      { text: '心里不服，但表面平静', effects: {mentalPressure: 2, desire: 1} },
      { text: '找小李请教评优经验', effects: {eq: 2, workAbility: 1} },
    ]},
    { id: 'enw158', stage: 'work', eventType: 'choice', weight: 4, title: '借阅档案', text: '你申请借阅一份三年前的档案，档案员犹豫了一下："按规定要领导签字。"你想起那份档案里有你当年的签字，忽然有点明白她为什么犹豫。', choices: [
      { text: '按流程找领导签字', effects: {workAbility: 1, integrity: 1, mentalPressure: 1} },
      { text: '说明用途，请档案员通融', effects: {eq: 1, risk: 1, integrity: -1} },
      { text: '换个途径查公开信息', effects: {workAbility: 1, iq: 1} },
      { text: '放弃查这份档案', effects: {mentalPressure: -1, workAbility: -1} },
    ]},
    { id: 'enw159', stage: 'work', eventType: 'auto', weight: 3, title: '转业干部培训', text: '单位接收了几名转业干部，你负责岗前培训。有位老营长学公文格式，学得比谁都认真。他笔记本上写着：新战场，新兵蛋子重新练。', effects: {workAbility: 2, eq: 1, reputation: 1} },
    { id: 'enw160', stage: 'work', eventType: 'choice', weight: 4, title: '部门间的推诿', text: '一项工作在你和兄弟科室之间推了两个来回：他们说"不归我们管"，你们说"我们只管受理"。办事群众在走廊里来回跑，最后问了一句："你们到底谁负责？"', choices: [
      { text: '牵头厘清职责边界', effects: {workAbility: 3, eq: 1, background: 1} },
      { text: '先办结再说，别让群众跑', effects: {eq: 2, integrity: 2, workAbility: 1} },
      { text: '写请示让领导裁定', effects: {workAbility: 1, mentalPressure: 1} },
      { text: '按现有分工顶回去', effects: {eq: -2, peopleReputation: -1, workAbility: -1} },
    ]},
    { id: 'enw161', stage: 'work', eventType: 'auto', weight: 3, title: '两会保障', text: '两会期间你在驻地保障服务。凌晨整理材料，白天跟着代表团跑。闭幕那天，代表委员们散去，你瘫在椅子上，忽然觉得这十天比一年都长。', effects: {workAbility: 3, reputation: 2, body: -1, mentalPressure: 2} },
    { id: 'enw162', stage: 'work', eventType: 'choice', weight: 4, title: '材料里的数字', text: '领导讲话稿里的一个数字，你记得和统计局口径不一致。你在"照抄领导说的数"和"改回正确数字"之间犹豫了一下午，稿子快下班才交。', choices: [
      { text: '按正确数字写，附说明', effects: {integrity: 3, workAbility: 2, mentalPressure: 2} },
      { text: '照领导口径写', effects: {positionWeight: 1, integrity: -1, risk: 1} },
      { text: '用模糊表述带过', effects: {workAbility: 1, integrity: -1} },
      { text: '当面和领导核实', effects: {eq: 1, integrity: 2, mentalPressure: 1} },
    ]},
    { id: 'enw163', stage: 'work', eventType: 'choice', weight: 3, title: '新同事的礼物', text: '新来的同事给你带了一盒家乡特产，说是"感谢照顾"。你收也不是，不收也不是——按纪律，这算不算违规？你想起纪检提醒过"小事不小"。', choices: [
      { text: '婉拒，说明纪律要求', effects: {integrity: 3, eq: -1, risk: -1} },
      { text: '收下，回赠等值礼物', effects: {eq: 2, wealth: -5, risk: 1} },
      { text: '收下，表示下不为例', effects: {risk: 1, integrity: -1} },
      { text: '转交办公室公用', effects: {eq: 1, integrity: 2} },
    ]},
    { id: 'enw164', stage: 'work', eventType: 'auto', weight: 3, title: '办公室的绿萝', text: '办公室那盆绿萝快死了，你顺手浇了水、换了土。三个月后它爬满了文件柜。同事说"你救活了一盆绿萝"，你说"它救活了办公室的生气"。', effects: {mentalPressure: -2, eq: 1, workAbility: 1} },

    // ================= v2.1.12 冲刺 1500（enw165-enw172） =================
    { id: 'enw165', stage: 'work', eventType: 'choice', weight: 3, title: '数字档案补录', text: '单位开展数字档案补录攻坚，你的任务是三年积压的 2000 多份材料。同事都在抱怨"这活又累又没功劳"，你翻开第一份材料，忽然看到了自己入职时的签字。', choices: [
      { text: '牵头优化补录流程', effects: {workAbility: 3, iq: 1, positionWeight: 1} },
      { text: '按部就班完成任务', effects: {workAbility: 1, mentalPressure: 1} },
      { text: '申请增加人手分担', effects: {eq: 1, background: 1} },
      { text: '能拖就拖，先忙别的', effects: {workAbility: -1, risk: 2} },
    ]},
    { id: 'enw166', stage: 'work', eventType: 'choice', weight: 3, title: '保密培训考试', text: '保密知识培训考试，你旁边的同事悄悄传纸条，被监考的老科长逮个正着。老科长看了你一眼——你手边的答案纸条还没来得及递出去。', choices: [
      { text: '主动上交纸条，如实说明', effects: {integrity: 3, reputation: 1, risk: -2} },
      { text: '装作无事发生', effects: {risk: 3, integrity: -2} },
      { text: '考后找老科长解释', effects: {eq: 1, integrity: 1} },
      { text: '帮同事说情', effects: {eq: 1, risk: 2, integrity: -1} },
    ]},
    { id: 'enw167', stage: 'work', eventType: 'auto', weight: 3, title: '督查通报', text: '你牵头的一项工作被省督查组通报表扬。办公室的同事们说"都是你的功劳"，你笑着摆手。晚上你翻了翻督查报告，发现被表扬的那几页，确实是加班熬出来的。', effects: {reputation: 3, positionWeight: 2, mentalPressure: -1} },
    { id: 'enw168', stage: 'work', eventType: 'choice', weight: 4, title: '值班电话', text: '周末值班，一通电话打进来："我孩子发烧，社区医院不开门，你们管不管？"你一边安抚对方，一边快速翻找应急预案——社区卫生服务中心的值班电话就在第一页。', choices: [
      { text: '立即协调社区卫生中心', effects: {workAbility: 3, peopleReputation: 2, eq: 1} },
      { text: '记录诉求，周一转办', effects: {workAbility: 1, peopleReputation: -1, risk: 1} },
      { text: '指导对方去市医院', effects: {workAbility: 1, eq: 1} },
      { text: '上报值班领导处置', effects: {background: 1, workAbility: 1} },
    ]},
    { id: 'enw169', stage: 'work', eventType: 'choice', weight: 3, title: '借调同事的告别', text: '借调你单位两年的同事要回原单位了。她走之前请你吃饭，说了句真心话："在这儿两年，就你教我最多。"你忽然觉得，这两年值了。', choices: [
      { text: '回请一顿，好好送别', effects: {eq: 2, wealth: -5, background: 1} },
      { text: '写封推荐信给她', effects: {eq: 2, integrity: 2} },
      { text: '请领导关注她的成长', effects: {eq: 1, background: 1} },
      { text: '客气几句，各自安好', effects: {eq: -1, mentalPressure: -1} },
    ]},
    { id: 'enw170', stage: 'work', eventType: 'auto', weight: 3, title: '办公室的喜糖', text: '同事结婚发喜糖，递到你面前时特意说"这盒给你，双喜的"。你剥开一颗，甜得有点意外。办公室的空气里飘着喜气，你忽然觉得，日复一日的工作也没那么单调。', effects: {eq: 2, mentalPressure: -2, familyPressure: -1} },
    { id: 'enw171', stage: 'work', eventType: 'choice', weight: 4, title: '材料被退', text: '你精心打磨的汇报材料被领导打回来，批注只有两个字："重写"。你盯着那两个字看了很久，不知道是方向错了还是深度不够。', choices: [
      { text: '请领导指点方向再写', effects: {eq: 1, workAbility: 2, mentalPressure: 1} },
      { text: '对照优秀材料找差距', effects: {workAbility: 2, iq: 1} },
      { text: '按自己的理解重写', effects: {workAbility: 2, risk: 1} },
      { text: '找同事帮忙看问题', effects: {eq: 1, workAbility: 1} },
    ]},
    { id: 'enw172', stage: 'work', eventType: 'auto', weight: 3, title: '会前十分钟', text: '会议开始前十分钟，你发现投影仪不亮了。你一边联系后勤，一边把关键数据用白板笔抄在黑板上。会议正常开始，你坐在角落，出了一身汗，却觉得挺有成就感。', effects: {workAbility: 2, eq: 1, mentalPressure: -1} },
];
