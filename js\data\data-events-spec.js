// ===== 系统/部门专属池 =====
// id 范围：e561~e808（183条） | 装配：js/data/data.js → GameData.events | v2.1.66 头注释标准化（分类学见 docs/architecture/EVENT-SYSTEM-ARCHITECTURE.md）
// 定位：窗口服务/应急/网信/住建等弱池补强，按部门章节分组
const gd_events_spec = [
    // =====================================================================
    // 第九批：补足弱池事件（窗口/应急/网信/住建/民政/卫健/医保/人社）
    // =====================================================================

    // === 窗口部门（原有2 → 目标12） ===
    { id: 'e561', stage: 'work', eventType: 'choice', title: '窗口服务（老年证）', weight: 5, text: '你在政务服务大厅窗口工作，每天面对各种群众。今天一位大爷来办老年证，但材料不齐。后面排队的人开始不耐烦，大爷也急得满头大汗。', pools: ['窗口部门', '民生部门'], choices: [
      { text: '先收下材料容缺受理后期补齐', effects: {workAbility: 3, eq: 1, reputation: 2, mentalPressure: 1, flag: 'windowService2'} },
      { text: '耐心跟大爷解释需要哪些材料', effects: {eq: 2, mentalPressure: 1, reputation: 1, integrity: 2} },
      { text: '按规定办材料不齐不能受理', effects: {integrity: 3, risk: -1, reputation: -1, mentalPressure: 1} },
      { text: '帮大爷填写容缺受理承诺书', effects: {integrity: 2, eq: 1, workAbility: 2, reputation: 2, flag: 'windowService2'} },
      { text: '让大爷在旁边先坐着慢慢理材料', effects: {eq: 1, mentalPressure: 1, reputation: 1} },
    ]},
    { id: 'e562', stage: 'work', eventType: 'auto', title: '服务之星', weight: 5, text: '季度服务评比中你被评为"服务之星"！你窗口的满意度评价达到了99.8%。一位受过你帮助的大妈专门写了感谢信，说她跑了三趟才遇到你这么一个"热心肠"。', requireFlag: 'windowService2', pools: ['窗口部门', '民生部门'], effects: {reputation: 4, positionWeight: 2, eq: 1, mentalPressure: -2, integrity: 1} },
    { id: 'e563', stage: 'work', eventType: 'choice', title: '排队长龙', weight: 5, text: '周一上午，政务服务大厅排起了长队。有群众等了一个小时还没轮到，开始拍桌子骂人。你是值班组长，必须立刻处理。', pools: ['窗口部门', '民生部门'], choices: [
      { text: '增开临时窗口分流人群', effects: {workAbility: 3, eq: 1, mentalPressure: 3, reputation: 2, flag: 'queueManage'} },
      { text: '引导群众使用自助终端办理', effects: {iq: 2, workAbility: 2, mentalPressure: 2, reputation: 1} },
      { text: '先安抚情绪最激动的群众', effects: {eq: 2, mentalPressure: 2, reputation: 1} },
      { text: '按顺序办理爱等等不等拉倒', effects: {risk: 1, reputation: -3, mentalPressure: -1} },
      { text: '汇报领导申请增加人手', effects: {background: 2, workAbility: 1, mentalPressure: 2} },
    ]},
    { id: 'e564', stage: 'work', eventType: 'auto', title: '窗口模范', weight: 5, text: '你的排队分流方案被写进了大厅管理手册！群众满意度大幅提升，市里通过你的经验在全市政务服务系统推广了"潮汐窗口"制度。', requireFlag: 'queueManage', pools: ['窗口部门', '民生部门'], effects: {reputation: 4, positionWeight: 3, workAbility: 2, mentalPressure: -2} },
    { id: 'e565', stage: 'work', eventType: 'choice', title: '自助终端', weight: 5, text: '大厅新安装了自助服务终端，但大部分群众不会用，还是习惯在窗口排队。领导让你想办法提高自助终端的使用率。', pools: ['窗口部门', '技术部门'], choices: [
      { text: '培训导办员引导群众使用自助终端', effects: {workAbility: 3, eq: 1, mentalPressure: 3, reputation: 2, flag: 'selfService'} },
      { text: '制作简单易懂的操作视频教程', effects: {iq: 2, workAbility: 2, mentalPressure: 1, reputation: 1} },
      { text: '自己先学会然后手把手教同事', effects: {eq: 1, workAbility: 2, mentalPressure: 2, flag: 'selfService', desire: 2} },
      { text: '既然群众不用就把终端搬角落', effects: {body:1, mentalPressure:-1, workAbility:-2, reputation:-2, desire:-1} },
      { text: '在自助区设置志愿者服务岗', effects: {eq: 2, background: 1, mentalPressure: 2, reputation: 2} },
    ]},
    { id: 'e566', stage: 'work', eventType: 'auto', title: '智慧大厅', weight: 5, text: '你推动的自助终端使用率从不到10%提升到了60%！省大数据局来调研时把你的做法作为"智慧政务"典型案例。领导说"这个干部有想法有办法"。', requireFlag: 'selfService', pools: ['窗口部门', '技术部门'], effects: {reputation: 4, positionWeight: 3, workAbility: 2, iq: 2, mentalPressure: -2} },
    { id: 'e567', stage: 'work', eventType: 'choice', title: '延时服务', weight: 5, text: '下午五点下班铃响了，窗口还有三位群众在等。按规定你可以下班了，但他们都着急地说"从外地赶来的，明天就要回去"。', pools: ['窗口部门', '民生部门'], choices: [
      { text: '主动延长服务时间帮他们办完', effects: {integrity: 3, reputation: 3, mentalPressure: 2, eq: 1, body: -1} },
      { text: '做完手头的就让后面明天再来', effects: {mentalPressure: -1, risk: -1, reputation: -2, desire: 1} },
      { text: '留下一个窗口加班其他人正常下班', effects: {workAbility: 2, eq: 1, mentalPressure: 1, reputation: 1} },
      { text: '记录下他们的情况第二天优先处理', effects: {eq: 1, workAbility: 2, mentalPressure: 1} },
      { text: '在App上帮他们预约明天的号', effects: {iq: 2, workAbility: 1, mentalPressure: 1, reputation: 1} },
    ]},

    // === 应急管理（原有2 → 目标12） ===
    { id: 'e568', stage: 'work', eventType: 'choice', title: '应急预案', weight: 5, text: '上级要求修订突发事件应急预案，你负责执笔。预案涉及几十个部门和单位，各自的职责划分纠缠不清，有的部门说"这不该我管"。', pools: ['执法部门', '应急'], choices: [
      { text: '逐部门对接明确各自职责', effects: {workAbility: 3, eq: 1, mentalPressure: 4, reputation: 2, flag: 'emergencyPlan'} },
      { text: '参考先进地区的预案模板', effects: {iq: 2, workAbility: 2, mentalPressure: 2, reputation: 1} },
      { text: '召开专题会议集中讨论定稿', effects: {eq: 2, background: 2, mentalPressure: 3, positionWeight: 2, flag: 'emergencyPlan'} },
      { text: '按期交差不管漏洞', effects: {risk: 3, mentalPressure: -1, reputation: -2} },
      { text: '组织桌面推演测试预案可行性', effects: {iq: 3, workAbility: 2, mentalPressure: 3, reputation: 2} },
    ]},
    { id: 'e569', stage: 'work', eventType: 'auto', title: '预案通过', weight: 5, text: '你编制的应急预案在专家评审中获得了高分！省应急管理厅将你的预案作为范本在全省推广。厅长说"这才是一份能打仗的预案"。', requireFlag: 'emergencyPlan', pools: ['执法部门', '应急'], effects: {reputation: 5, positionWeight: 3, workAbility: 3, mentalPressure: -2} },
    { id: 'e570', stage: 'work', eventType: 'sudden', title: '突发事件', weight: 5, text: '凌晨三点，你被电话吵醒：某地发生重大安全事故，市委要求立即启动应急响应。你穿上衣服就往外跑，家人在后面问你"几点回来"。', pools: ['执法部门', '应急'], effects: {mentalPressure: 7, workAbility: 2, body: -2, risk: 3} },
    { id: 'e571', stage: 'work', eventType: 'choice', title: '夜间值班', weight: 5, text: '轮到你在应急指挥中心值夜班。凌晨两点电话响了——某镇报告发生山洪险情，情况不明。你是今晚的值班长，必须做出判断。', pools: ['执法部门', '应急'], choices: [
      { text: '按预案立即启动处置程序', effects: {workAbility: 3, integrity: 2, mentalPressure: 4, reputation: 2, flag: 'nightDuty'} },
      { text: '先核实现场情况再决策', effects: {iq: 2, workAbility: 2, mentalPressure: 2, risk: -1} },
      { text: '请示带班领导再做决定', effects: {background: 2, mentalPressure: 1, positionWeight: 1, desire: 2} },
      { text: '认为没那么严重继续睡觉', effects: {body: 2, mentalPressure: -3, risk: 5, integrity: -3, reputation: -3} },
      { text: '一边调集救援力量一边向上汇报', effects: {workAbility: 2, integrity: 2, mentalPressure: 3, flag: 'nightDuty'} },
    ]},
    { id: 'e572', stage: 'work', eventType: 'auto', title: '处突先锋', weight: 5, text: '你在夜班期间冷静果断的处置得到了市委主要领导表扬！事后复盘证明你的决策完全正确，避免了一场可能的大灾难。', requireFlag: 'nightDuty', pools: ['执法部门', '应急'], effects: {reputation: 5, positionWeight: 3, workAbility: 2, mentalPressure: -3} },
    { id: 'e573', stage: 'work', eventType: 'choice', title: '安全检查', weight: 5, text: '你带队到一家化工企业进行安全生产检查，发现多处隐患。企业负责人把你拉到一边说："这些都是小问题，领导也是老朋友了，抬抬手。"', pools: ['执法部门', '应急'], choices: [
      { text: '依法下达整改通知限期纠正', effects: {integrity: 5, workAbility: 3, risk: 2, mentalPressure: 3, reputation: 2} },
      { text: '先口头警告下次复查', effects: {eq: 1, workAbility: 1, risk: 3, integrity: -2} },
      { text: '上报局里按程序处理', effects: {background: 2, integrity: 3, mentalPressure: 2, positionWeight: 1, desire: 2} },
      { text: '约谈并制定整改计划', effects: {eq: 1, workAbility: 2, integrity: 2, risk: -1} },
      { text: '联合多部门开展专项整治', effects: {workAbility: 2, eq: 1, mentalPressure: 3, background: 1} },
    ]},
    { id: 'e574', stage: 'work', eventType: 'choice', title: '应急物资', weight: 5, text: '上级检查发现应急物资储备严重不足——有的物资已经过期，有的账实不符。领导让你限期整改，不然后果很严重。', pools: ['执法部门', '应急'], choices: [
      { text: '全面清查建立台账管理制度', effects: {workAbility: 3, integrity: 3, mentalPressure: 3, reputation: 2} },
      { text: '申请专项资金补充储备', effects: {background: 2, mentalPressure: 2, workAbility: 1} },
      { text: '先把账做平应付检查', effects: {risk: 5, integrity: -4, mentalPressure: 2, reputation: -2} },
      { text: '请专家评估物资缺口', effects: {iq: 2, workAbility: 2, mentalPressure: 2, reputation: 1} },
      { text: '建立物资动态管理信息系统', effects: {iq: 2, workAbility: 2, mentalPressure: 2, risk: -1} },
    ]},

    // === 网信办（原有2 → 目标10） ===
    { id: 'e575', stage: 'work', eventType: 'choice', title: '网络舆情', weight: 5, text: '一条涉及你所在领域的不实信息在短视频平台快速传播，已经上了热搜。评论区有人在骂，有人跟风，有人半信半疑。你负责舆情处置。', pools: ['网信办', '技术部门', '党委系统'], choices: [
      { text: '第一时间核实事实发布权威回应', effects: {workAbility: 3, integrity: 2, mentalPressure: 4, reputation: 2, flag: 'netRumor'} },
      { text: '协调平台方降低热度', effects: {background: 2, mentalPressure: 2, risk: 2} },
      { text: '冷处理等待自然降温', effects: {risk: 3, mentalPressure: 1, reputation: -2} },
      { text: '正面发声的同时走法律程序', effects: {integrity: 3, workAbility: 2, mentalPressure: 3, flag: 'netRumor'} },
      { text: '组织网评员引导舆论走向', effects: {eq: 1, workAbility: 2, mentalPressure: 2, background: 1} },
    ]},
    { id: 'e576', stage: 'work', eventType: 'auto', title: '谣言平息', weight: 5, text: '你及时有力的回应平息了谣言！网信办把你的处置流程作为"网络舆情快速响应"范本。发布方主动删除了不实内容并公开道歉。', requireFlag: 'netRumor', pools: ['网信办', '技术部门', '党委系统'], effects: {reputation: 4, positionWeight: 3, workAbility: 2, mentalPressure: -2} },
    { id: 'e577', stage: 'work', eventType: 'choice', title: '新媒体运营', weight: 5, text: '单位让你负责运营政务新媒体账号。现在是"酒香也怕巷子深"的时代——你发的内容如果没人看，就等于白做。有人在后台提议"搞个搞笑视频引流"。', pools: ['网信办', '宣传', '党委系统'], choices: [
      { text: '用接地气的方式做政策解读', effects: {iq: 2, workAbility: 3, reputation: 2, mentalPressure: 2, flag: 'newMedia'} },
      { text: '学习爆款账号的运营技巧', effects: {iq: 2, workAbility: 2, mentalPressure: 2, desire: 1} },
      { text: '搞个段子合集吸引关注', effects: {risk: 2, reputation: -1, mentalPressure: 1, desire: 2} },
      { text: '保持严肃风格，政务号就该正经', effects: {integrity: 2, mentalPressure: -1, reputation: -1} },
      { text: '和网上的政务大V合作推广', effects: {eq: 1, background: 2, mentalPressure: 2, reputation: 1, flag: 'newMedia'} },
    ]},
    { id: 'e578', stage: 'work', eventType: 'auto', title: '网红政务号', weight: 5, text: '你的政务新媒体账号做到了十万粉丝！一条政策解读视频被人民日报转发了。粉丝们说"原来政策可以这样看"，领导也夸你"新媒体时代就得这么干"。', requireFlag: 'newMedia', pools: ['网信办', '宣传', '党委系统'], effects: {reputation: 5, positionWeight: 3, workAbility: 2, iq: 2, mentalPressure: -2, appearance: 1} },
    { id: 'e579', stage: 'work', eventType: 'choice', title: '数据安全（防患）', weight: 5, text: '你发现单位的官网存在安全漏洞，有被黑客攻击的风险。技术部说"没出过事修什么修"，你知道一旦出事就是大事。', pools: ['网信办', '技术部门'], choices: [
      { text: '写专题报告呈送主要领导', effects: {workAbility: 3, integrity: 3, mentalPressure: 3, reputation: 2} },
      { text: '找网安公司做安全评估', effects: {iq: 2, workAbility: 2, mentalPressure: 2, background: 1} },
      { text: '技术部说没问题我就不管了', effects: {risk: 3, integrity: -2, mentalPressure: -1} },
      { text: '自己做一次简单渗透测试', effects: {iq: 3, workAbility: 2, mentalPressure: 3, risk: 1} },
      { text: '组织网络安全应急演练', effects: {workAbility: 2, iq: 2, mentalPressure: 2, reputation: 2} },
    ]},

    // === 住建（原有2 → 目标10） ===
    { id: 'e580', stage: 'work', eventType: 'choice', title: '老旧小区', weight: 5, text: '市里启动老旧小区改造工程，你负责的一个小区居民意见分歧很大——有人想装电梯，低层住户嫌"挡光"；有人想修停车场，老年人说"广场没了"。', pools: ['住建', '政府部门', '民生部门'], choices: [
      { text: '逐户走访收集意见寻找共识', effects: {eq: 2, workAbility: 2, mentalPressure: 4, reputation: 2, flag: 'oldCommunity'} },
      { text: '提出几套方案让居民投票选择', effects: {workAbility: 2, eq: 1, mentalPressure: 2, reputation: 2, flag: 'oldCommunity'} },
      { text: '听街道办事处的按多数意见办', effects: {workAbility: 1, mentalPressure: 1, risk: -1} },
      { text: '先做样板楼让大家看到效果', effects: {iq: 2, workAbility: 2, mentalPressure: 3, reputation: 2} },
      { text: '组织居民去改造成功的小区参观', effects: {eq: 1, workAbility: 2, mentalPressure: 2, background: 1} },
    ]},
    { id: 'e581', stage: 'work', eventType: 'auto', title: '改造竣工', weight: 5, text: '老旧小区改造竣工了！居民们在新修的广场上跳舞庆祝。一位八十岁的老奶奶拉着你的手说"住了三十年终于有电梯了"。报纸上刊登了改造前后的对比照。', requireFlag: 'oldCommunity', pools: ['住建', '政府部门', '民生部门'], effects: {reputation: 5, positionWeight: 3, workAbility: 2, eq: 1, mentalPressure: -3} },
    { id: 'e582', stage: 'work', eventType: 'choice', title: '保障房建设', weight: 5, text: '你负责的保障房项目建设工期紧张，雨季施工影响了进度。施工方提出"适当简化一些工序"赶工期，但你知道这可能影响房屋质量。', pools: ['住建', '政府部门', '民生部门'], choices: [
      { text: '宁可延期也要保证质量', effects: {integrity: 4, workAbility: 2, risk: -1, mentalPressure: 3, reputation: 2} },
      { text: '在保证安全前提下优化施工方案', effects: {iq: 2, workAbility: 3, mentalPressure: 2, risk: -1} },
      { text: '默许简化反正验收能过就行', effects: {risk: 6, integrity: -4, mentalPressure: 2, reputation: -3} },
      { text: '申请增加施工力量抢回进度', effects: {background: 2, workAbility: 2, mentalPressure: 3, flag: 'housingBuild'} },
      { text: '倒排工期加班加点赶工', effects: {workAbility: 3, body: -2, mentalPressure: 4, desire: 2} },
    ]},
    { id: 'e583', stage: 'work', eventType: 'auto', title: '如期交付', weight: 5, text: '保障房项目如期竣工交付！四百多户住房困难家庭拿到了钥匙。交付仪式上市长说"你们给老百姓建的是家，不是房子"。', requireFlag: 'housingBuild', pools: ['住建', '政府部门', '民生部门'], effects: {reputation: 5, positionWeight: 3, workAbility: 3, mentalPressure: -3} },
    { id: 'e584', stage: 'work', eventType: 'choice', title: '城市更新', weight: 5, text: '你参与的城市更新项目涉及一片老街区——有历史风貌要保护，有危房要拆改，有居民要安置，还有开发商想拿地。各方的诉求拧成了一团乱麻。', pools: ['住建', '政府部门', '民生部门'], choices: [
      { text: '制定兼顾保护与发展的方案', effects: {iq: 3, workAbility: 3, mentalPressure: 4, reputation: 2, flag: 'cityRenewal'} },
      { text: '请规划设计院做专业评估', effects: {iq: 2, workAbility: 2, mentalPressure: 2, background: 1} },
      { text: '优先考虑开发商的利益', effects: {risk: 4, integrity: -3, desire: 2, mentalPressure: 2} },
      { text: '重点保护历史风貌街区的完整性', effects: {integrity: 3, reputation: 2, mentalPressure: 2, positionWeight: 1} },
      { text: '组织居民听证会协商方案', effects: {eq: 2, workAbility: 2, mentalPressure: 3, reputation: 2, flag: 'cityRenewal'} },
    ]},
    { id: 'e585', stage: 'work', eventType: 'auto', title: '老街新生', weight: 5, text: '城市更新项目获得了国家住建部"历史文化街区保护范例"奖！央视来拍了纪录片，你的名字出现在了片尾的感谢名单里。', requireFlag: 'cityRenewal', pools: ['住建', '政府部门', '民生部门'], effects: {reputation: 6, positionWeight: 3, workAbility: 3, iq: 2, mentalPressure: -3} },

    // === 民政（原有6 → 目标14） ===
    { id: 'e586', stage: 'work', eventType: 'choice', title: '慈善募捐', weight: 5, text: '市里组织了一场慈善募捐活动，你负责协调各单位的参与。企业老板纷纷表态，但有的想借机做广告，有的捐款后要"表彰"。', pools: ['民政', '民生部门'], choices: [
      { text: '制定规则确保捐赠纯粹性', effects: {integrity: 3, workAbility: 2, mentalPressure: 3, reputation: 2, flag: 'charity1'} },
      { text: '顺势而为接受各种形式的捐赠', effects: {background: 2, desire: 2, mentalPressure: 2, risk: 1} },
      { text: '重点劝阻带附加条件的捐款', effects: {integrity: 2, eq: 1, mentalPressure: 2, workAbility: 1} },
      { text: '把善款专项用于最困难的群体', effects: {integrity: 3, reputation: 2, mentalPressure: 1, flag: 'charity1'} },
      { text: '邀请媒体监督捐款全过程', effects: {integrity: 2, reputation: 2, mentalPressure: 3, workAbility: 1} },
    ]},
    { id: 'e587', stage: 'work', eventType: 'auto', title: '慈善之星', weight: 5, text: '你组织的慈善募捐活动募集到了三百多万元！资金全部用于山区贫困学生助学。省民政厅授予你"慈善之星"荣誉称号。', requireFlag: 'charity1', pools: ['民政', '民生部门'], effects: {reputation: 5, positionWeight: 3, integrity: 2, mentalPressure: -2} },
    { id: 'e588', stage: 'work', eventType: 'choice', title: '婚登窗口', weight: 5, text: '你在婚姻登记处工作。今天来了很多对新人——七夕嘛。有一对新人兴奋得忘了带户口本，女方急得差点哭出来。马上要下班了。', pools: ['民政', '民生部门', '窗口部门'], choices: [
      { text: '帮他们想一个合法的变通方案', effects: {eq: 1, workAbility: 2, mentalPressure: 2, reputation: 2} },
      { text: '告诉他们没有户口本确实不能办', effects: {integrity: 2, mentalPressure: -1, reputation: -1} },
      { text: '让他们派家人送户口本来', effects: {workAbility: 1, mentalPressure: 1, reputation: 1} },
      { text: '先给他们准备好其他手续拿着号等', effects: {eq: 2, workAbility: 2, mentalPressure: 1, reputation: 2} },
      { text: '在电子户籍系统中查证核实', effects: {iq: 2, workAbility: 2, mentalPressure: 2, integrity: 2} },
    ]},
    { id: 'e589', stage: 'work', eventType: 'choice', title: '困境儿童', weight: 5, text: '你排查到一个特殊困境儿童——父母双亡，跟着七十岁的奶奶生活，没有任何经济来源。孩子的眼神让你心疼，但现有的救助政策覆盖不全。', pools: ['民政', '民生部门'], choices: [
      { text: '启动临时救助程序先解决问题', effects: {integrity: 4, workAbility: 3, reputation: 3, mentalPressure: 3, flag: 'childAid'} },
      { text: '对接慈善组织点对点帮扶', effects: {eq: 1, background: 2, mentalPressure: 2, reputation: 2} },
      { text: '按现有政策能帮多少帮多少', effects: {workAbility: 1, mentalPressure: 1, integrity: 1} },
      { text: '自掏腰包先给孩子买学习用品', effects: {integrity: 2, reputation: 2, familyPressure: 2, mentalPressure: 1} },
      { text: '写专题报告建议完善救助政策', effects: {workAbility: 2, iq: 2, mentalPressure: 2, reputation: 2, flag: 'childAid'} },
    ]},
    { id: 'e590', stage: 'work', eventType: 'auto', title: '护苗天使', weight: 5, text: '你推动的困境儿童救助方案被市里采纳了！三十多个孩子得到了长效帮扶。妇联给你送来了"护苗天使"的锦旗，孩子们画的蜡笔画贴满了你的办公室。', requireFlag: 'childAid', pools: ['民政', '民生部门'], effects: {reputation: 5, positionWeight: 3, integrity: 3, mentalPressure: -3} },

    // === 卫健（原有4 → 目标12） ===
    { id: 'e591', stage: 'work', eventType: 'choice', title: '传染病防控', weight: 5, text: '春季传染病高发期来了，你负责全市的传染病监测和防控工作。学校报告了多例聚集性病例，家长们打电话到卫健委问"要不要停课"。', pools: ['卫健', '民生部门'], choices: [
      { text: '启动应急预案科学评估风险', effects: {workAbility: 3, iq: 2, mentalPressure: 4, reputation: 2, flag: 'diseaseControl'} },
      { text: '先通知学校加强晨检', effects: {workAbility: 2, mentalPressure: 2, reputation: 2} },
      { text: '为了稳定人心暂不对外公告', effects: {risk: 3, mentalPressure: 1, reputation: -2} },
      { text: '组织专家组制定防控方案', effects: {iq: 2, workAbility: 2, mentalPressure: 3, flag: 'diseaseControl'} },
      { text: '通过媒体做好科普宣传', effects: {eq: 1, workAbility: 2, mentalPressure: 2, reputation: 2} },
    ]},
    { id: 'e592', stage: 'work', eventType: 'auto', title: '防控得力', weight: 5, text: '传染病防控工作取得了明显成效——疫情被控制在局部没有扩散。省卫健委领导在防控总结会上表扬了你"科学决策、处置果断"。', requireFlag: 'diseaseControl', pools: ['卫健', '民生部门'], effects: {reputation: 5, positionWeight: 3, workAbility: 3, mentalPressure: -2} },
    { id: 'e593', stage: 'work', eventType: 'choice', title: '基层医疗', weight: 5, text: '全市基层医疗卫生机构条件参差不齐，有的乡镇卫生院连基本的检查设备都没有。你被安排负责推进基层医疗能力提升工程。', pools: ['卫健', '民生部门'], choices: [
      { text: '制定分期分批的设备配置方案', effects: {workAbility: 3, iq: 2, mentalPressure: 3, reputation: 2, flag: 'ruralHealth'} },
      { text: '向上级争取专项资金支持', effects: {background: 2, workAbility: 2, mentalPressure: 2, reputation: 1} },
      { text: '先抓几个示范点逐步推开', effects: {iq: 2, workAbility: 2, mentalPressure: 2, risk: -1, flag: 'ruralHealth'} },
      { text: '把城区的旧设备调拨给乡镇', effects: {workAbility: 1, mentalPressure: 1, reputation: -1} },
      { text: '安排大医院对口支援', effects: {eq: 1, background: 2, mentalPressure: 2, reputation: 2} },
    ]},
    { id: 'e594', stage: 'work', eventType: 'auto', title: '强基达标', weight: 5, text: '基层医疗能力提升工程效果显著！乡镇卫生院都有了基本的检查设备，老百姓在家门口就能做B超和血常规了。', requireFlag: 'ruralHealth', pools: ['卫健', '民生部门'], effects: {reputation: 4, positionWeight: 3, workAbility: 2, mentalPressure: -2} },

    // === 医保（原有4 → 目标12） ===
    { id: 'e595', stage: 'work', eventType: 'choice', title: '骗保调查', weight: 5, text: '大数据筛查发现某民营医院涉嫌骗保——挂床住院、虚构检查项目，涉及金额近百万元。领导让你牵头调查，但这家医院的老板"水很深"。', pools: ['医保', '民生部门'], choices: [
      { text: '依法查处追回医保基金', effects: {integrity: 5, workAbility: 3, risk: 3, mentalPressure: 4, reputation: 2, flag: 'insuranceFraud'} },
      { text: '先约谈医院负责人警告', effects: {eq: 1, mentalPressure: 2, risk: 2, integrity: 2} },
      { text: '高高举起轻轻放下', effects: {risk: 4, integrity: -3, mentalPressure: 1, reputation: -2} },
      { text: '联合公安和卫生健康部门协查', effects: {workAbility: 2, integrity: 3, mentalPressure: 3, flag: 'insuranceFraud'} },
      { text: '上报局里请求增派人手', effects: {background: 2, integrity: 2, mentalPressure: 2, positionWeight: 1} },
    ]},
    { id: 'e596', stage: 'work', eventType: 'auto', title: '查处骗保', weight: 5, text: '骗保案成功查处！追回了大量医保基金，涉事医院被吊销定点资格，负责人被移送司法机关。你成了全市医保系统的"打假英雄"。', requireFlag: 'insuranceFraud', pools: ['医保', '民生部门'], effects: {reputation: 6, positionWeight: 3, integrity: 4, workAbility: 2, mentalPressure: -3} },
    { id: 'e597', stage: 'work', eventType: 'choice', title: '医保报销', weight: 5, text: '你发现很多群众反映门诊医保报销流程复杂、等待时间长。有人为了报几十块钱的药费在医院和医保中心之间来回跑了好几趟。', pools: ['医保', '民生部门', '窗口部门'], choices: [
      { text: '推动实现一站式即时结算', effects: {workAbility: 3, iq: 2, mentalPressure: 3, reputation: 2, flag: 'quickReimburse'} },
      { text: '简化报销材料减少办事环节', effects: {workAbility: 2, eq: 1, mentalPressure: 2, flag: 'quickReimburse'} },
      { text: '多开几个报销窗口', effects: {workAbility: 1, mentalPressure: 1, reputation: 1} },
      { text: '告诉大家线上办理门诊报销', effects: {iq: 1, workAbility: 1, eq: 1, mentalPressure: 2, reputation: 1} },
      { text: '写个流程指南贴在墙上', effects: {workAbility: 1, mentalPressure: 1} },
    ]},
    { id: 'e598', stage: 'work', eventType: 'auto', title: '报销提速', weight: 5, text: '一站式即时结算系统上线后门诊报销从跑三趟变成了刷一次卡。群众满意度从60%飙升到了95%。省医保局把你的经验在全省推广。', requireFlag: 'quickReimburse', pools: ['医保', '民生部门', '窗口部门'], effects: {reputation: 5, positionWeight: 3, workAbility: 3, mentalPressure: -2} },

    // === 人社（原有4 → 目标12） ===
    { id: 'e599', stage: 'work', eventType: 'choice', title: '技能培训', weight: 5, text: '你负责组织失业人员技能培训工作，但报名的人积极性不高——有人说"学了也没用"，有人说"不包分配浪费钱"，还有人觉得"年纪大了学不会"。', pools: ['人社', '民生部门'], choices: [
      { text: '与企业合作开展定向培训推荐就业', effects: {workAbility: 3, eq: 1, mentalPressure: 3, reputation: 2, flag: 'skillTrain'} },
      { text: '先做几个成功案例带动其他人', effects: {iq: 2, workAbility: 2, mentalPressure: 2, reputation: 2, flag: 'skillTrain'} },
      { text: '按上级下达的指标完成就行', effects: {workAbility: 1, mentalPressure: 1, reputation: -1} },
      { text: '请之前的培训学员来现身说法', effects: {eq: 2, background: 1, mentalPressure: 2, reputation: 2} },
      { text: '根据市场需求调整培训课程', effects: {iq: 2, workAbility: 2, mentalPressure: 2, reputation: 1} },
    ]},
    { id: 'e600', stage: 'work', eventType: 'auto', title: '培训见效', weight: 5, text: '你的技能培训项目结业了！80%的学员找到了工作，有人从月薪三千变成了月薪八千。电视台来采访时，一位大姐抹着眼泪说"要不是人社局，我这辈子就是个废人"。', requireFlag: 'skillTrain', pools: ['人社', '民生部门'], effects: {reputation: 5, positionWeight: 3, workAbility: 3, mentalPressure: -2} },
    { id: 'e601', stage: 'work', eventType: 'choice', title: '劳动仲裁', weight: 5, text: '你负责一起劳动仲裁案件——一个农民工在工地上摔断了腿，包工头说"不是我的工人"。他没有合同、没有工资条、没有任何证明。', pools: ['人社', '民生部门', '执法部门'], choices: [
      { text: '多方走访收集证据帮他维权', effects: {integrity: 4, workAbility: 3, reputation: 3, mentalPressure: 3, flag: 'laborRights'} },
      { text: '调解包工头和企业协商赔偿', effects: {eq: 2, workAbility: 2, mentalPressure: 2, reputation: 2} },
      { text: '没有证据我也爱莫能助', effects: {mentalPressure: -2, integrity: -2, reputation: -2, desire: 1} },
      { text: '帮他联系法律援助律师', effects: {integrity: 2, eq: 1, workAbility: 2, reputation: 2, flag: 'laborRights'} },
      { text: '责令企业提供用工记录', effects: {workAbility: 2, integrity: 3, mentalPressure: 2, positionWeight: 1} },
    ]},
    { id: 'e602', stage: 'work', eventType: 'auto', title: '维权成功', weight: 5, text: '农民工拿到了赔偿款！他拄着拐杖来办公室感谢你，说什么都要给你跪下。你赶紧扶住他说"这是我应该做的"。那之后你更加坚定了在人社系统工作的意义。', requireFlag: 'laborRights', pools: ['人社', '民生部门', '执法部门'], effects: {reputation: 5, positionWeight: 3, integrity: 3, workAbility: 2, mentalPressure: -2} },
    { id: 'e603', stage: 'work', eventType: 'choice', title: '人才引进', weight: 5, text: '市里推出"人才新政"——博士补贴20万、硕士10万，还有人才公寓。你是人才服务中心的负责人，有人质疑"花这么多钱值不值得"。', pools: ['人社', '民生部门'], choices: [
      { text: '用数据说话计算人才投入产出比', effects: {iq: 2, workAbility: 3, mentalPressure: 2, reputation: 2} },
      { text: '办好第一届人才交流大会', effects: {workAbility: 2, eq: 1, mentalPressure: 2, background: 1} },
      { text: '先引进几个重点人才做标杆', effects: {desire: 2, workAbility: 2, mentalPressure: 2, reputation: 1} },
      { text: '降降补贴标准不要太显眼', effects: {mentalPressure: -1, risk: -1, reputation: -1, desire: 1} },
      { text: '建立人才服务绿色通道', effects: {workAbility: 2, iq: 2, mentalPressure: 2, reputation: 2} },
    ]},

    // === 补足剩余池（应急/人社/卫健/医保/住建/网信/宣传/疾控） ===
    { id: 'e604', stage: 'work', eventType: 'choice', title: '救灾物资', weight: 5, text: '一批救灾物资需要紧急调拨到受灾县。时间紧迫，但出库手续繁杂。仓库管理员说"流程没走完我不能放"，受灾县的电话已经打了三遍。', pools: ['应急', '执法部门'], choices: [
      { text: '协调走绿色通道先发货后补手续', effects: {workAbility: 3, iq: 2, mentalPressure: 3, reputation: 2} },
      { text: '按规定办事流程不能乱', effects: {integrity: 2, risk: -1, mentalPressure: 1, reputation: -1} },
      { text: '自己垫钱叫车先把物资送过去', effects: {integrity: 3, reputation: 2, familyPressure: 2, mentalPressure: 2} },
      { text: '联系当地武警协助运输', effects: {background: 2, workAbility: 2, mentalPressure: 2, flag: 'disasterRelief'} },
      { text: '一边发货一边请领导电话授权', effects: {eq: 1, background: 2, mentalPressure: 2, workAbility: 1} },
    ]},
    { id: 'e605', stage: 'work', eventType: 'auto', title: '救灾先锋', weight: 5, text: '物资及时送到了受灾群众手中！灾民在寒风中分到棉被的那一刻，你觉得自己做的一切都值了。县领导说"这份情谊我们记着"。', requireFlag: 'disasterRelief', pools: ['应急', '执法部门'], effects: {reputation: 4, positionWeight: 3, workAbility: 2, mentalPressure: -2} },
    { id: 'e606', stage: 'work', eventType: 'choice', title: '社保扩面', weight: 5, text: '你负责推进灵活就业人员参加社保的工作。外卖骑手、网约车司机这些人没有固定单位，参保意愿不强，觉得"交钱没用"。', pools: ['人社', '民生部门'], choices: [
      { text: '开发线上参保简化流程', effects: {iq: 2, workAbility: 3, mentalPressure: 3, reputation: 2} },
      { text: '深入平台企业宣传社保政策', effects: {eq: 2, workAbility: 2, mentalPressure: 3, reputation: 1} },
      { text: '完成指标就行不去强求', effects: {workAbility: 1, mentalPressure: -1, reputation: -1} },
      { text: '研究对灵活就业人员的补贴方案', effects: {iq: 2, workAbility: 2, mentalPressure: 2, reputation: 2} },
      { text: '联合工商部门合力推进', effects: {background: 2, workAbility: 2, mentalPressure: 2} },
    ]},
    { id: 'e607', stage: 'work', eventType: 'choice', title: '疫苗接种', weight: 5, text: '流感季来临前要组织大规模疫苗接种。但群众对疫苗的安全性有疑虑，网上传了一些负面信息。你需要想办法提高接种率。', pools: ['卫健', '民生部门', '宣传'], choices: [
      { text: '以身作则先接种做表率', effects: {integrity: 3, reputation: 2, mentalPressure: 2, body: 1} },
      { text: '请专家做科普直播', effects: {iq: 2, workAbility: 2, mentalPressure: 2, reputation: 2} },
      { text: '发个通知要求大家来接种', effects: {workAbility: 1, mentalPressure: 1, reputation: -1} },
      { text: '组织医护团队进社区服务', effects: {eq: 2, workAbility: 2, mentalPressure: 3, reputation: 2} },
      { text: '在公众号上发疫苗知识问答', effects: {iq: 2, workAbility: 2, mentalPressure: 1, reputation: 1} },
    ]},
    { id: 'e608', stage: 'work', eventType: 'choice', title: '异地结算', weight: 5, text: '你负责推进异地就医直接结算工作。系统对接总是出问题——A省的系统传不到B省，患者还是得先垫付再报销。群众等不了磨合期。', pools: ['医保', '民生部门'], choices: [
      { text: '协调技术团队加班解决接口问题', effects: {workAbility: 3, mentalPressure: 4, reputation: 2, iq: 2} },
      { text: '先开放几个省份的试点', effects: {iq: 2, workAbility: 2, mentalPressure: 2, risk: -1} },
      { text: '等系统完善再推广不急', effects: {mentalPressure: -1, workAbility: -1, reputation: -1, desire: 1} },
      { text: '直接给患者开通人工结算通道', effects: {integrity: 2, workAbility: 2, mentalPressure: 2} },
      { text: '召开技术协调会解决卡点', effects: {eq: 1, workAbility: 2, mentalPressure: 2, background: 1} },
    ]},
    { id: 'e609', stage: 'work', eventType: 'choice', title: '工程质量', weight: 5, text: '你发现一个在建项目使用了不合格的建材。施工方说"这是供应商的问题我们也是受害者"，监理方说"检测报告是合格的"。明显有人在说谎。', pools: ['住建', '政府部门', '民生部门'], choices: [
      { text: '叫停施工全面检测所有材料', effects: {integrity: 4, workAbility: 3, risk: 2, mentalPressure: 3, reputation: 2} },
      { text: '取样送第三方检测机构', effects: {iq: 2, workAbility: 2, mentalPressure: 2, reputation: 1} },
      { text: '睁一只眼闭一只眼', effects: {risk: 6, integrity: -4, mentalPressure: 2, reputation: -3} },
      { text: '约谈施工单位限期整改', effects: {eq: 1, workAbility: 2, integrity: 2, mentalPressure: 2} },
      { text: '向上级主管部门报告', effects: {integrity: 3, background: 2, mentalPressure: 2, positionWeight: 1} },
    ]},
    { id: 'e610', stage: 'work', eventType: 'choice', title: '内容审核', weight: 5, text: '你负责审核政务平台上的用户评论，有人发布了敏感内容。按规定应当删除，但对方提出抗议说"合理的批评也是言论自由"。', pools: ['网信办', '宣传', '党委系统'], choices: [
      { text: '依法依规进行内容管理', effects: {integrity: 3, workAbility: 2, mentalPressure: 3, reputation: 1} },
      { text: '在回复中引导理性讨论', effects: {eq: 2, workAbility: 2, mentalPressure: 2, reputation: 2} },
      { text: '一律删除简单省事', effects: {risk: 2, reputation: -2, integrity: -1, mentalPressure: -1} },
      { text: '下沉部分评论到后台展示', effects: {iq: 2, workAbility: 1, mentalPressure: 1, risk: -1} },
      { text: '建立分级的评论审核标准', effects: {workAbility: 2, iq: 2, mentalPressure: 2, integrity: 2} },
    ]},
    { id: 'e611', stage: 'work', eventType: 'choice', title: '政治宣传', weight: 5, text: '重大节日临近，你要策划一组宣传活动。领导说"要有高度有深度有新意"，同事说"就是把去年的PPT改改年份"。你看着去年的"喜迎国庆"PPT沉默了三秒。', pools: ['宣传', '党委系统'], choices: [
      { text: '挖掘一线感人事迹做真实叙事', effects: {workAbility: 3, integrity: 2, mentalPressure: 3, reputation: 2} },
      { text: '用新媒体形式吸引年轻人关注', effects: {iq: 2, workAbility: 2, mentalPressure: 2, desire: 1} },
      { text: '把去年的方案改改交差', effects: {mentalPressure: -1, workAbility: -1, reputation: -2} },
      { text: '联合媒体策划系列报道', effects: {eq: 1, background: 2, mentalPressure: 2, reputation: 2} },
      { text: '多做几组方案让领导选', effects: {workAbility: 2, mentalPressure: 3, desire: 1, iq: 1} },
    ]},
    { id: 'e612', stage: 'work', eventType: 'choice', title: '疫控监测', weight: 5, text: '春季流感监测数据显示异常——今年流感样病例比去年同期高了40%，而且重症比例偏高。你作为疾控中心的工作人员，需要分析数据并提出建议。', pools: ['卫健', '民生部门'], choices: [
      { text: '发布预警开展针对性防控', effects: {workAbility: 3, iq: 2, mentalPressure: 3, reputation: 2} },
      { text: '先核实数据再上报', effects: {iq: 2, workAbility: 2, mentalPressure: 2, risk: -1} },
      { text: '可能只是统计偏差再观察', effects: {risk: 3, mentalPressure: 1, reputation: -1} },
      { text: '组织专家进行风险评估', effects: {iq: 2, workAbility: 2, mentalPressure: 2, reputation: 2} },
      { text: '向国家疾控中心报告请求指导', effects: {background: 2, workAbility: 2, mentalPressure: 2, integrity: 2} },
    ]},
    { id: 'e613', stage: 'work', eventType: 'choice', title: '费用审核', weight: 5, text: '你负责审核一笔大额医保报销——患者做了心脏手术，花了几十万。材料基本齐全但有两张发票模糊不清，按规定应当退回。但患者家属说老人还在ICU不能等。', pools: ['医保', '民生部门'], choices: [
      { text: '启动紧急审核程序加快处理', effects: {workAbility: 3, integrity: 2, mentalPressure: 3, reputation: 2} },
      { text: '先按已有材料结算看患者情况', effects: {eq: 1, workAbility: 2, mentalPressure: 2, risk: -1} },
      { text: '按规矩必须补齐材料', effects: {integrity: 2, mentalPressure: 1, reputation: -1} },
      { text: '亲自去医院核实病情', effects: {integrity: 3, eq: 1, body: -1, mentalPressure: 2} },
      { text: '请科室会议集体研讨决定', effects: {eq: 1, background: 1, mentalPressure: 1, workAbility: 1} },
    ]},
    { id: 'e614', stage: 'work', eventType: 'choice', title: '拆迁协调', weight: 5, text: '一片旧城改造项目涉及几百户居民拆迁。大多数签约了，还剩几户"钉子户"——不是想多要补偿就是故土难离。施工单位催得很急。', pools: ['住建', '政府部门', '民生部门'], choices: [
      { text: '逐户耐心沟通了解真实诉求', effects: {eq: 2, workAbility: 2, mentalPressure: 4, reputation: 2} },
      { text: '在法律框架内给予合理补偿', effects: {integrity: 3, workAbility: 2, mentalPressure: 2, reputation: 1} },
      { text: '动用强制手段清场', effects: {risk: 5, integrity: -4, reputation: -5, mentalPressure: 3} },
      { text: '请社区和街道出面做工作', effects: {background: 2, eq: 1, mentalPressure: 2, workAbility: 1} },
      { text: '调整规划方案尽量保留原有格局', effects: {iq: 2, workAbility: 2, mentalPressure: 3, reputation: 2} },
    ]},
    { id: 'e615', stage: 'work', eventType: 'choice', title: '实名认证', weight: 5, text: '上级要求所有网络平台用户必须实名认证，但有用户投诉这侵犯隐私。作为网信办工作人员，你需要在保护隐私和网络安全之间找到平衡。', pools: ['网信办', '技术部门', '党委系统'], choices: [
      { text: '制定分层的实名认证标准', effects: {iq: 2, workAbility: 3, mentalPressure: 3, reputation: 2} },
      { text: '先做政策解读消除公众疑虑', effects: {eq: 1, workAbility: 2, mentalPressure: 2, reputation: 1} },
      { text: '严格执行按文件要求来', effects: {integrity: 2, mentalPressure: 1, risk: -1} },
      { text: '学习先进地区的实名认证经验', effects: {iq: 2, workAbility: 2, mentalPressure: 2, desire: 1} },
      { text: '在技术上做最小化信息采集', effects: {iq: 2, workAbility: 2, mentalPressure: 2, integrity: 2} },
    ]},

    // =====================================================================
    // 第十批：腐败得利中间事件（腐败≠立刻被抓，有短期好处）
    // =====================================================================
    { id: 'e616', stage: 'work', eventType: 'auto', title: '利益兑现', weight: 5, text: '你帮人办了事，对方果然信守承诺——信封里装着一张银行卡，里面的数字让你心跳加速。你存了钱、换了车、家里不说"没钱"了。但每次接电话你都心慌——怕是纪委的。', pools: ['public'], requireFlag: 'tookBribe', effects: {familyPressure: -4, background: 3, desire: 3, mentalPressure: 6, heat: 8, risk: 4, reputation: 1} },
    { id: 'e617', stage: 'work', eventType: 'auto', title: '人脉拓展', weight: 5, text: '有了"利益共享"的关系，几个老板把你当自己人，带你加入了一个"高端圈子"。饭局上认识了不少有头有脸的人物，他们看你的眼神让你自信爆棚。但你也知道——这些人能捧你，也能摔你。', pools: ['public'], requireFlag: 'tookKickback', effects: {background: 6, positionWeight: 2, desire: 3, mentalPressure: 4, heat: 8, risk: 3, reputation: 2} },
    { id: 'e618', stage: 'work', eventType: 'auto', title: '权力膨胀', weight: 5, text: '干股分红到账了——比你想的还要多。你发现自己现在说话有底气了，花钱不看价签了，单位里不知情的同事还以为你的能力得到了"特殊认可"。你享受着这种前所未有的掌控感。', pools: ['public'], requireFlag: 'tookShares', effects: {familyPressure: -3, background: 4, positionWeight: 3, desire: 4, mentalPressure: 5, heat: 8, risk: 4, reputation: 1} },

    // =====================================================================
    // 第十一批：中央专属事件池（仅中央单位触发）
    // =====================================================================
    { id: 'e619', stage: 'work', eventType: 'choice', title: '国策研讨', weight: 5, text: '你参与了国务院召开的宏观经济形势分析会。各部委一把手围坐一圈，你作为新人坐在后排旁听。讨论到关键议题时，主持人突然点你的名："新来的同志，你来说说看法。"', pools: ['中央','省级','市级'], choices: [
      { text: '条理清晰说出自己的分析', effects: {iq: 3, workAbility: 3, reputation: 3, mentalPressure: 4, positionWeight: 2, flag: 'policyVoice'} },
      { text: '谦虚说自己还在学习中', effects: {eq: 1, mentalPressure: 1, reputation: 1} },
      { text: '引用前面的材料表达赞同', effects: {workAbility: 1, mentalPressure: 1, reputation: -1} },
      { text: '拿出准备好的数据展示', effects: {iq: 2, workAbility: 2, reputation: 2, mentalPressure: 3, flag: 'policyVoice'} },
      { text: '提出一个有价值的建议', effects: {iq: 3, reputation: 3, positionWeight: 2, mentalPressure: 3} },
    ]},
    { id: 'e620', stage: 'work', eventType: 'auto', title: '高层赏识', weight: 5, text: '你的发言引起了部长的注意。会后他把你叫到办公室，说"年轻人有想法，以后每周的专题会你也来听听"。这意味着你已经进入了核心智囊圈的视野。', requireFlag: 'policyVoice', pools: ['中央','省级','市级'], effects: {positionWeight: 5, reputation: 4, background: 4, mentalPressure: 2, desire: 3} },
    { id: 'e621', stage: 'work', eventType: 'choice', title: '重大改革', weight: 5, text: '你被抽调参加了某项全国性重大改革的方案起草工作。这关系到数亿人的切身利益，每一个字都可能成为历史。你看着文件上密密麻麻的批注，感受到了前所未有的压力。', pools: ['中央','省级','市级'], choices: [ // v2.59 pools 加市级（reformCount≥2 的 reform_pioneer 结局原对市级及以下玩家不可达）
      { text: '深入调研确保方案可行性', effects: {workAbility: 3, iq: 3, reputation: 3, mentalPressure: 5, body: -1, flag: 'reformDraft'} },
      { text: '征求各部委和地方意见', effects: {eq: 2, background: 3, mentalPressure: 3, reputation: 2} },
      { text: '参考国际先进经验', effects: {iq: 3, workAbility: 2, mentalPressure: 2, reputation: 1} },
      { text: '按领导意思起草不求创新', effects: {workAbility: 1, mentalPressure: 1, reputation: -2} },
      { text: '昼夜奋战把方案打磨到完美', effects: {workAbility: 4, body: -3, mentalPressure: 6, reputation: 3, flag: 'reformDraft'} },
    ]},
    { id: 'e622', stage: 'work', eventType: 'auto', title: '改革落地', weight: 5, text: '你参与起草的改革方案经国务院常务会议审议通过，正式发布了！新华社全文播发，人民日报头版评论。你看着那篇自己熬夜写出来的文件变成了铅字，手有些抖。', requireFlag: 'reformDraft', pools: ['中央','省级','市级'], effects: {reputation: 8, positionWeight: 5, workAbility: 3, mentalPressure: -4, iq: 2} },
    { id: 'e623', stage: 'work', eventType: 'choice', title: '国际谈判', weight: 5, text: '你被派往日内瓦参加一项国际贸易协定的谈判。对方代表咄咄逼人，不断施压要求我方做出更多让步。你是中方代表团的青年骨干，需要在会议上表态。', pools: ['中央','省级','市级'], choices: [
      { text: '据理力争保护核心利益', effects: {iq: 3, integrity: 3, reputation: 4, mentalPressure: 5, positionWeight: 2, flag: 'diplomat'} },
      { text: '在关键条款上提出折中方案', effects: {eq: 2, iq: 2, mentalPressure: 3, reputation: 2} },
      { text: '请示上级等候指示', effects: {background: 1, mentalPressure: 1, positionWeight: 1} },
      { text: '利用谈判间隙做对方工作', effects: {eq: 2, background: 2, mentalPressure: 3, flag: 'diplomat'} },
      { text: '态度强硬寸步不让', effects: {integrity: 4, desire: 3, mentalPressure: 5, reputation: 3} },
    ]},
    { id: 'e624', stage: 'work', eventType: 'auto', title: '外交之星', weight: 5, text: '谈判取得重大突破！中方代表团团长在总结会上说"这次谈判最大的亮点是我们有了能独当一面的年轻人"。外交部点名表扬，你的名字开始在涉外圈子里流传。', requireFlag: 'diplomat', pools: ['中央','省级','市级'], effects: {reputation: 6, positionWeight: 4, background: 4, mentalPressure: -3} },
    { id: 'e625', stage: 'work', eventType: 'choice', title: '巡视全国', weight: 5, text: '你被抽调参加中央巡视组，赴某省开展为期两个月的巡视工作。你查到了一些蛛丝马迹，但背后涉及的人位高权重。同组的老同志提醒你"点到为止"。', pools: ['中央','省级','市级'], choices: [
      { text: '坚持彻查到底如实上报', effects: {integrity: 5, workAbility: 3, reputation: 3, risk: 4, mentalPressure: 5, flag: 'inspectNation'} },
      { text: '和组内同志一起商量尺度', effects: {eq: 1, background: 2, mentalPressure: 2, integrity: 2} },
      { text: '把查到的问题写成内部专报', effects: {workAbility: 2, integrity: 3, mentalPressure: 3, flag: 'inspectNation'} },
      { text: '服从组长的意见不越权', effects: {background: 1, mentalPressure: 1, integrity: 2} },
      { text: '掌握尺度不要让地方难堪', effects: {mentalPressure: -1, risk: -1, integrity: -3, reputation: -2, desire: 1} },
    ]},
    { id: 'e626', stage: 'work', eventType: 'auto', title: '利剑出鞘', weight: 5, text: '中央巡视报告引起高层震动！你查出的问题被写进了向政治局常委会的汇报材料。几个落马官员的名单里，都有你发现的第一条线索。但你也收到了匿名威胁。', requireFlag: 'inspectNation', pools: ['中央','省级','市级'], effects: {reputation: 7, positionWeight: 5, integrity: 4, mentalPressure: 6, risk: 5, background: 3} },
    { id: 'e627', stage: 'work', eventType: 'choice', title: '卸任安排', weight: 3, text: '你已经到了从一线退下来的年龄。组织找你谈话，希望你继续发挥余热——可以担任全国人大或政协的职务，也可以去重要智库做顾问。你站在长安街上望着天安门城楼，百感交集。', minYear: 30, pools: ['中央','省级','市级'], choices: [
      { text: '接受安排继续发光发热', effects: {reputation: 3, positionWeight: 2, mentalPressure: -2, desire: -1, integrity: 2} },
      { text: '选择去高校当客座教授', effects: {iq: 2, reputation: 3, mentalPressure: -3, desire: -2} },
      { text: '彻底退休回家享受生活', effects: {mentalPressure: -5, familyPressure: -3, body: 2, desire: -3} },
      { text: '写一本回忆录总结这些年的经验', effects: {reputation: 4, workAbility: 2, mentalPressure: -1, iq: 2} },
      { text: '留在中央做政策顾问', effects: {reputation: 3, background: 2, mentalPressure: 1} },
    ]},
    { id: 'e628', stage: 'work', eventType: 'auto', title: '中南海岁月', weight: 3, text: '今天你在中南海的走廊里遇到了你年轻时在省里见过的领导。他已经满头白发，你也两鬓斑白。他认出了你，拍了拍你的肩膀说"小同志，没想到你也到这儿来了"。你们相视而笑，眼角都有些湿润。', minYear: 30, pools: ['中央','省级','市级'], effects: {mentalPressure: -3, reputation: 2, body: 1, background: 2, eq: 1} },

    // =====================================================================
    // 第十二批：婚姻/子女系统扩展
    // =====================================================================
    // 恋爱→结婚链
    { id: 'e629', stage: 'life', eventType: 'choice', title: '恋爱初遇', weight: 5, text: '在一次朋友聚会上，你认识了一个人。对方谈吐不凡、兴趣相投，你们聊得很投机。临走时对方主动加了你的微信。', pools: ['public'], requireSingle: true, year: [22, 45], choices: [
      { text: '主动约对方周末喝咖啡', effects: {eq: 1, mentalPressure: 1, familyPressure: -1, flag: 'dating', desire: 1} },
      { text: '在微信上保持联系慢慢了解', effects: {eq: 1, mentalPressure: -1, background: 1, flag: 'dating'} },
      { text: '顺其自然看缘分', effects: {mentalPressure: -1, desire: -1, integrity: 1} },
      { text: '约对方一起参加户外活动', effects: {body: 1, eq: 1, mentalPressure: 1, flag: 'dating', reputation: 1} },
      { text: '觉得不太合适减少联系', effects: {mentalPressure: -1, familyPressure: -1, eq: -1, reputation: 1} },
    ]},
    { id: 'e630', stage: 'life', eventType: 'auto', title: '感情升温', weight: 5, requireSingle: true, year: [22, 45], text: '你们的关系在不知不觉中升温了。从偶尔聊天到每天问候，从周末约饭到彼此想念。你知道这不是普通的友谊——你恋爱了。', pools: ['public'], requireFlag: 'dating', effects: {familyPressure: -2, mentalPressure: -2, eq: 1, reputation: 1, appearance: 1} },
    { id: 'e631', stage: 'life', eventType: 'choice', title: '见家长', weight: 5, requireSingle: true, year: [22, 45], text: '恋爱到了见家长的阶段。你紧张得连领带都系了三次——不是怕对方父母不满意，而是"万一对方父母是体制内的老前辈怎么办"。', pools: ['public'], requireFlag: 'dating', requireGender: '男', choices: [
      { text: '带礼物上门表现真诚', effects: {eq: 2, reputation: 2, mentalPressure: 1, familyPressure: -1, integrity: 1, flag: 'engaged'} },
      { text: '自然大方展示真实自己', effects: {integrity: 2, eq: 1, mentalPressure: -1, reputation: 1, flag: 'engaged'} },
      { text: '先打听一下对方家庭情况', effects: {background: 2, iq: 1, mentalPressure: 1} },
      { text: '和对方商量好对策再上门', effects: {eq: 1, mentalPressure: 1, background: 1, flag: 'engaged'} },
      { text: '紧张到不知道该说什么', effects: {mentalPressure: 3, reputation: -1, eq: -1} },
    ]},

    // 育儿→成长链
    { id: 'e632', stage: 'life', eventType: 'choice', title: '育儿焦虑', weight: 5, text: '孩子半夜发烧了，你抱着滚烫的小身体心急如焚。去医院的路上你一直在想——工作请假多了会不会影响前途，但孩子生病了不管又怎么算父母。', pools: ['public'], requireChild: true, choices: [
      { text: '请假陪孩子看病', effects: {familyPressure: -3, mentalPressure: 2, eq: 1, reputation: 1, workAbility: -1, flag: 'parenting', appearance: 1} },
      { text: '请父母帮忙带孩子去医院', effects: {familyPressure: -1, mentalPressure: 1, background: 1, workAbility: 1, flag: 'parenting'} },
      { text: '白天上班晚上陪护', effects: {body: -2, mentalPressure: 4, workAbility: 2, familyPressure: 1} },
      { text: '和同事换班照顾孩子', effects: {eq: 1, background: 1, mentalPressure: 2, familyPressure: -1, flag: 'parenting'} },
      { text: '让伴侣请假自己不耽误工作', effects: {workAbility: 2, mentalPressure: 2, familyPressure: 2, reputation: -1, eq: -1} },
    ]},
    { id: 'e633', stage: 'life', eventType: 'auto', title: '亲子时光', weight: 5, text: '孩子的病好了，搂着你的脖子说"爸爸/妈妈我最喜欢你了"。那一刻你觉得所有的疲惫都值得了。你发现自己变得更柔软了——也更有力量了。', pools: ['public'], requireFlag: 'parenting', effects: {familyPressure: -3, mentalPressure: -3, eq: 1, reputation: 1, integrity: 1} },
    { id: 'e634', stage: 'life', eventType: 'choice', title: '孩子入学', weight: 5, text: '孩子到了上小学的年龄。你跑了几个学校，学区房太贵、私立太远、公办又怕教学质量不够好。当父母的焦虑在这一刻集中爆发。', pools: ['public'], requireChild: true, choices: [
      { text: '努力攒钱买学区房', effects: {familyPressure: 5, mentalPressure: 3, desire: 2, workAbility: 1, reputation: 1} },
      { text: '相信公办学校的教育质量', effects: {integrity: 2, mentalPressure: -1, familyPressure: 1, reputation: 1} },
      { text: '在家附近找一所口碑好的学校', effects: {workAbility: 1, mentalPressure: 1, familyPressure: 1, eq: 1} },
      { text: '提前开始辅导孩子学习', effects: {iq: 2, workAbility: 1, mentalPressure: 2, familyPressure: 1, body: -1} },
      { text: '找关系托人帮忙进好学校', effects: {background: 2, risk: 3, integrity: -2, mentalPressure: 2, familyPressure: -2} },
    ]},
    { id: 'e635', stage: 'life', eventType: 'choice', title: '家长会', weight: 5, text: '班主任打电话说要你去学校一趟——你心里咯噔一下。到了办公室，老师说你孩子在学校打架了。你看着站在墙角低着头的小身影，不知道该先骂还是先问。', pools: ['public'], requireChild: true, choices: [
      { text: '先了解原因再和孩子沟通', effects: {eq: 2, integrity: 2, mentalPressure: 2, familyPressure: -1, reputation: 1, flag: 'parenting2'} },
      { text: '严厉批评孩子不能动手', effects: {integrity: 2, familyPressure: 2, mentalPressure: 2, reputation: 1} },
      { text: '替孩子向老师道歉', effects: {eq: 1, mentalPressure: 1, reputation: 1, familyPressure: 1} },
      { text: '回家和孩子好好谈谈', effects: {eq: 1, familyPressure: -2, mentalPressure: 1, integrity: 2, flag: 'parenting2'} },
      { text: '觉得孩子打人也有理', effects: {integrity: -2, risk: 2, reputation: -1, eq: -1} },
    ]},
    { id: 'e636', stage: 'life', eventType: 'auto', title: '教育心得', weight: 5, text: '经过这件事，你意识到教育孩子不能只靠说教。你开始看育儿书、和别的家长交流经验。孩子和你的关系反而更亲密了。', pools: ['public'], requireFlag: 'parenting2', effects: {eq: 1, mentalPressure: -2, familyPressure: -2, reputation: 1, integrity: 1} },

    // 婚姻危机→修复链
    { id: 'e637', stage: 'life', eventType: 'choice', title: '婚姻危机（修复契机）', weight: 5, text: '最近你们夫妻俩吵架的次数越来越多了。你加班多、回来晚，对方抱怨你"把家当旅馆"。冷战第三天，你意识到不能再这样下去了。', pools: ['public'], requireMarried: true, choices: [
      { text: '主动道歉沟通', effects: {eq: 2, familyPressure: -3, mentalPressure: -1, reputation: 1, flag: 'marriageFix'} },
      { text: '申请减少加班多陪家人', effects: {body: 1, eq: 1, familyPressure: -4, mentalPressure: -2, positionWeight: -2, workAbility: -1, flag: 'marriageFix'} },
      { text: '送礼物哄对方开心', effects: {eq: 1, familyPressure: -2, mentalPressure: 1, reputation: 1} },
      { text: '冷战到底等对方先服软', effects: {familyPressure: 3, mentalPressure: 3, eq: -2, reputation: -1} },
      { text: '带对方出去旅行散心', effects: {eq: 1, familyPressure: -3, mentalPressure: -3, reputation: 1, flag: 'marriageFix'} },
    ]},
    { id: 'e638', stage: 'life', eventType: 'auto', title: '重归于好', weight: 5, text: '你主动走出了一步，对方也哭了。你们聊了一整夜——从最初的认识到现在的疲惫，从各自的不满到对未来的期待。天亮的时候，你们重新牵了手。', pools: ['public'], requireFlag: 'marriageFix', effects: {familyPressure: -5, mentalPressure: -4, eq: 2, reputation: 1, integrity: 1} },

    // ==================== 女性视角婚姻链（第十三批：性别视角拆分） ====================
    // 男性视角事件（求婚/见家长/伴侣怀孕）仅男性触发；以下为女性对应事件
    // e664：被求婚（女性对应 e255 求婚）
    { id: 'e664', stage: 'life', eventType: 'choice', title: '被求婚', weight: 5, requireSingle: true, year: [22, 50], text: '你和男友感情稳定，到了谈婚论嫁的阶段。他郑重地单膝跪地，向你求婚——你看着手里的戒指，心里既甜蜜又纠结：答应了，事业和家庭的平衡怎么把握？', pools: ['public'], requireGender: '女', choices: [
      { text: '感动落泪，接受求婚', effects: {eq: 2, marry: true, familyPressure: -2, mentalPressure: 2, reputation: 2} },
      { text: '简单真诚地答应', effects: {eq: 1, marry: true, familyPressure: -1, mentalPressure: 1, integrity: 2} },
      { text: '和对方商量结婚计划', effects: {eq: 1, marry: true, familyPressure: -2, mentalPressure: 1, background: 1} },
      { text: '先见双方父母再做决定', effects: {eq: 1, familyPressure: 1, mentalPressure: 1, background: 2, reputation: 1} },
      { text: '想先拼两年事业再结婚', effects: {mentalPressure: -1, familyPressure: 1, desire: 2, eq: -1} },
    ]},
    // e665：上门见家长（女性对应 e631 见家长）
    { id: 'e665', stage: 'life', eventType: 'choice', title: '上门见家长', weight: 5, requireSingle: true, year: [22, 45], text: '恋爱到了见家长的阶段。你紧张得把口红补了三次——不是怕对方父母不满意，而是"万一对方父母是体制内的老前辈怎么办"。', pools: ['public'], requireFlag: 'dating', requireGender: '女', choices: [
      { text: '带礼物上门表现真诚', effects: {eq: 2, reputation: 2, mentalPressure: 1, familyPressure: -1, integrity: 1, flag: 'engaged'} },
      { text: '自然大方展示真实自己', effects: {integrity: 2, eq: 1, mentalPressure: -1, reputation: 1, flag: 'engaged'} },
      { text: '先打听一下对方家庭情况', effects: {background: 2, iq: 1, mentalPressure: 1} },
      { text: '和对方商量好对策再上门', effects: {eq: 1, mentalPressure: 1, background: 1, flag: 'engaged'} },
      { text: '紧张到不知道该说什么', effects: {mentalPressure: 3, reputation: -1, eq: -1} },
    ]},
    // e666：有孕在身（女性对应 e085/e288 伴侣怀孕）
    { id: 'e666', stage: 'life', eventType: 'choice', title: '有孕在身', weight: 8, year: [22, 45], text: '你惊喜地发现自己怀孕了！初为人母的期待与忐忑一起涌上心头——孕期的身体负担、单位的工作安排，还有孩子到来后更多的责任和开销。这是人生最踏实的幸福，也是最需要规划的时刻。', pools: ['public'], requireMarried: true, requireNoChild: true, requireGender: '女', choices: [
      { text: '请产假安心养胎', effects: {body: 1, eq: 1, child: true, familyPressure: 3, mentalPressure: 3, workAbility: -2, positionWeight: -1} },
      { text: '请父母帮忙照顾', effects: {child: true, familyPressure: 2, background: 1, mentalPressure: 2, workAbility: -1} },
      { text: '请保姆减轻负担', effects: {child: true, familyPressure: 2, mentalPressure: 2, workAbility: 1} },
      { text: '减少工作量多休息', effects: {body: 1, eq: 1, integrity: 1, child: true, familyPressure: 2, mentalPressure: 2, positionWeight: -2, workAbility: -1} },
      { text: '工作和家庭各占一半', effects: {child: true, body: -1, mentalPressure: 1, workAbility: 1, familyPressure: 2} },
    ]},

    // ==================== 中央选拔链（省级专属特殊通道） ====================
    // e639：中央遴选考察（省级+党员+厅级(职级≥6)，choice 事件，玩家可选是否争取）
    { id: 'e639', stage: 'work', eventType: 'choice', title: '中央遴选考察', weight: 4, text: '中组部干部考察组来到你所在的省调研后备干部情况。你的名字出现在了推荐名单上——这是进入中央的重要机会，但考察极其严格，一旦进入视野也将承受巨大压力。', pools: ['public'], requireUnitLevelMin: 3, requireUnitLevelMax: 3, requirePolitical: 'cpc', requireRankMin: 6, choices: [
      { text: '全力争取，精心准备汇报材料', effects: {mentalPressure: 6, workAbility: 2, reputation: 2, positionWeight: 3, background: 2, flag: 'centralCandidate'} },
      { text: '低调配合考察，顺其自然', effects: {mentalPressure: 2, reputation: 1, eq: 1, positionWeight: 1, flag: 'centralCandidate'} },
      { text: '主动请辞推荐，专注本省工作', effects: {mentalPressure: -2, reputation: 1, eq: 1, positionWeight: -1} },
      { text: '向考察组展示最亮眼的政绩', effects: {positionWeight: 3, desire: 2, mentalPressure: 5, reputation: 2, risk: 2, flag: 'centralCandidate'} },
    ]},
    // e640：中央考察结果（需要 centralCandidate flag + 省级；缓调一年后由 e759 落实进京，不再重复本事件）
    { id: 'e640', stage: 'work', eventType: 'choice', title: '进京履新', weight: 8, text: '考察组对你的评价很高！中组部正式向你发出调任通知：拟调任你到中央机关任职。这是无数体制内人梦寐以求的机会——进入国家最高权力核心，职级天花板将提升到12级。', pools: ['public'], requireUnitLevelMin: 3, requireUnitLevelMax: 3, requireFlag: 'centralCandidate', choices: [
      { text: '接受调任，进京履新', effects: {central: true, mentalPressure: 5, reputation: 6, risk: 2, eq: 1} },
      { text: '接受调任，主动请缨攻坚任务', effects: {central: true, workAbility: 2, mentalPressure: 4, reputation: 4, risk: 1} },
      { text: '婉拒调任，留在本省深耕', effects: {mentalPressure: -3, reputation: 3, positionWeight: 2, background: 2, integrity: 2, deleteFlag: 'centralCandidate'} },
      { text: '申请缓调一年做好准备', effects: {mentalPressure: 2, background: 2, risk: 1, positionWeight: 2, deleteFlag: 'centralCandidate', flag: 'centralDeferred'} },
    ]},
    // e759：缓调落实（缓调一年后中组部再次调任——修正"缓调后永远错过进京"的断链）
    { id: 'e759', stage: 'work', eventType: 'choice', title: '缓调落实', weight: 8, text: '一年前你申请缓调，把手头工作交接清楚。如今中组部再次发来调任通知——这次，没有再缓的余地了。', pools: ['public'], requireUnitLevelMin: 3, requireUnitLevelMax: 3, requireFlag: 'centralDeferred', choices: [
      { text: '接受调任，进京履新', effects: {central: true, mentalPressure: 5, reputation: 6, risk: 2, eq: 1} },
      { text: '婉拒调任，留在本省深耕', effects: {mentalPressure: -3, reputation: 2, positionWeight: 2, background: 1, integrity: 2, deleteFlag: 'centralDeferred'} },
    ]},
    // e641：中央任职后的适应期（进入中央后的后续事件）
    { id: 'e641', stage: 'work', eventType: 'choice', title: '中央任职适应', weight: 6, text: '初到中央机关，你发现这里的节奏远超想象——文件、会议、批示层层叠叠，身边都是各路精英。你需要在全新的环境中站稳脚跟。', pools: ['public'], requireUnitLevelMin: 4, choices: [
      { text: '加班加点熟悉业务，尽快进入角色', effects: {workAbility: 4, mentalPressure: 6, body: -1, positionWeight: 3, reputation: 1} },
      { text: '多向老同志请教学习', effects: {workAbility: 2, eq: 2, mentalPressure: 2, background: 2} },
      { text: '发挥省级工作经验优势', effects: {workAbility: 3, reputation: 2, background: 1, mentalPressure: 3, positionWeight: 2} },
      { text: '低调行事，先观察再行动', effects: {eq: 1, mentalPressure: -1, positionWeight: 1, background: 1} },
    ]},

    // ==================== 返聘老年线（e110 返聘后触发） ====================
    // e642：传帮带（返聘后带新人）
    { id: 'e642', stage: 'work', eventType: 'choice', title: '传帮带', weight: 6, text: '返聘期间，组织安排了一批年轻干部跟你学习。你看着这些充满干劲的年轻人，想起自己刚入职时的样子。带好他们，是你现在最重要的工作。', pools: ['public'], requireFlag: 'rehired', year: [52, 68], choices: [
      { text: '倾囊相授，把毕生经验教给他们', effects: {workAbility: 3, reputation: 3, integrity: 2, background: 2, mentalPressure: 1, flag: 'mentorMode'} },
      { text: '重点培养最有悟性的那个', effects: {eq: 1, background: 2, reputation: 2, workAbility: 1, iq: 1} },
      { text: '带他们熟悉业务，但不交核心', effects: {positionWeight: 2, workAbility: 1, reputation: -1, mentalPressure: 1} },
      { text: '让他们自己摸索，只做指导', effects: {workAbility: 1, mentalPressure: -1, reputation: 1, eq: 1} },
    ]},
    // e643：著书立说（返聘后写书留名）
    { id: 'e643', stage: 'work', eventType: 'choice', title: '著书立说', weight: 5, text: '有人建议你把几十年的工作经验整理成书。你犹豫了——写书要花大量时间，但如果不写，这些经验就会随你退休而消失。', pools: ['public'], requireFlag: 'rehired', year: [52, 68], choices: [
      { text: '动笔写书，把经验留给后人', effects: {iq: 3, reputation: 3, background: 2, mentalPressure: 3, body: -1, flag: 'author'} },
      { text: '整理成内部培训教材', effects: {workAbility: 2, reputation: 2, mentalPressure: 2, background: 1} },
      { text: '请年轻同事帮忙记录整理', effects: {eq: 1, background: 1, mentalPressure: 1, reputation: 1} },
      { text: '算了，还是留点时间休息', effects: {body: 1, mentalPressure: -2, reputation: -1} },
    ]},
    // e644：余热生辉（返聘期表现受表彰）
    { id: 'e644', stage: 'work', eventType: 'auto', title: '余热生辉', weight: 4, text: '返聘期间你兢兢业业，用几十年的经验解决了几个困扰单位多年的老问题。领导在大会上表扬你"老骥伏枥，志在千里"。', pools: ['public'], requireFlag: 'rehired', effects: {reputation: 4, background: 2, positionWeight: 2, mentalPressure: -2, workAbility: 2} },
    // e645：著书问世（写书完成后，名声大振）
    { id: 'e645', stage: 'work', eventType: 'auto', title: '著书问世', weight: 8, text: '你的著作正式出版了！几十年的体制内智慧凝结成文字，在系统内广受好评。不少年轻干部把它当作"机关生存手册"，你成了圈内的"活教材"。', pools: ['public'], requireFlag: 'author', effects: {reputation: 6, background: 4, iq: 2, mentalPressure: -3, desire: -2} },

    // ==================== 调查结果链（e237 选择后的终局） ====================
    // e646：调查结果（被调查后按 flag 判定结局）
    { id: 'e646', stage: 'work', eventType: 'choice', title: '调查结果', weight: 10, text: '调查组对你的问题做出了初步结论。你坐在纪委的谈话室里，等待着命运的宣判——是坦白从宽，还是死扛到底？', pools: ['public'], requireRisk: 15, requireFlag: 'underInvestigation', choices: [ // v2.59 断链修复：e646 需先经历 e237 调查（引擎设 underInvestigation），不再独立刷出
      { text: '接受组织处理，积极退赃', effects: {heat: -15, risk: -10, mentalPressure: 5, reputation: 2, integrity: 3, positionWeight: -4} },
      { text: '申诉辩解，争取从轻', effects: {risk: -3, heat: -3, mentalPressure: 4, positionWeight: -2, reputation: -1} },
      { text: '拒绝配合调查', effects: {wealth: 10, risk: 10, heat: 10, mentalPressure: 8, integrity: -5, reputation: -4, flag: 'defied'} },
      { text: '接受调查组建议，主动自首', effects: {heat: -20, risk: -15, mentalPressure: -3, reputation: 3, integrity: 5, positionWeight: -6, flag: 'selfSurrender'} },
    ]},
    // e647：处理结果——退赃从宽（不抓人，但仕途受损）
    { id: 'e647', stage: 'work', eventType: 'auto', title: '纪律处分', weight: 8, text: '鉴于你认错态度良好并积极退赃，组织决定给予严重警告处分，降职使用。你的仕途蒙上了阴影，但至少保住了工作。', pools: ['public'], requireFlag: 'selfSurrender', effects: {risk: -20, heat: -15, mentalPressure: -5, positionWeight: -6, reputation: -3, integrity: 3} },
    // e648：死扛到底 → 被抓（终局）
    { id: 'e648', stage: 'work', eventType: 'auto', title: '锒铛入狱', weight: 8, text: '你拒不配合调查，组织决定依法将你移送司法机关。当手铐铐上手腕的那一刻，你想起多年前入职时宣读的誓言，一切都结束了。', pools: ['public'], requireFlag: 'defied', effects: {risk: 30, heat: 30, mentalPressure: 15, reputation: -20, integrity: -10}, terminal: 'arrest' },
    // e649：跑路 → 亡命天涯（终局）
    { id: 'e649', stage: 'work', eventType: 'auto', title: '亡命天涯', weight: 8, text: '你连夜出逃，换掉了手机号，躲进了千里之外的县城出租屋。你以为能逃过一切，但通缉令已经贴满了全国。从此，你只能在阴影里活着。', pools: ['public'], requireFlag: 'fled', effects: {risk: 30, heat: 30, mentalPressure: 15, reputation: -25, integrity: -10}, terminal: 'arrest' },


    // ==================== 多步骤专案系统（v2.1） ====================
    // 招商专案：4步链（考察→谈判→落地→评估），每步通过 flags 记录进度
    // e653 专案启动：考察
    { id: 'e653', stage: 'work', eventType: 'choice', title: '招商专案·考察', weight: 3, text: '市里把"东部新城招商专案"交给你牵头。第一步是赴外地考察几家目标企业。这是你第一次独立带队的重大项目，干得好前途无量，干砸了……还是别想干砸的事了。', pools: ['public'], choices: [
      { text: '认真考察，做详实调研报告', effects: {workAbility: 3, iq: 2, mentalPressure: 3, reputation: 1, flag: 'proj_step1'} },
      { text: '走马观花，应付差事', effects: {mentalPressure: -1, workAbility: 1, risk: 2, reputation: -2, positionWeight: -1} },
      { text: '重点考察最有潜力的两家', effects: {iq: 2, workAbility: 2, mentalPressure: 2, background: 1, flag: 'proj_step1'} },
    ]},
    // e654 专案谈判
    { id: 'e654', stage: 'work', eventType: 'choice', title: '招商专案·谈判', weight: 4, text: '考察结束，企业方对你们的新城规划感兴趣，进入实质性谈判。对方要求税收优惠和土地补贴，这超出了你的权限范围。', pools: ['public'], requireFlag: 'proj_step1', choices: [
      { text: '据实上报，争取政策支持', effects: {integrity: 3, workAbility: 2, mentalPressure: 2, background: 2, reputation: 1, flag: 'proj_step2'} },
      { text: '当场拍板承诺优惠', effects: {positionWeight: 2, risk: 4, integrity: -2, mentalPressure: 3, background: 2, flag: 'proj_step2'} },
      { text: '先拖一拖，观察对方诚意', effects: {mentalPressure: -1, reputation: -2, risk: 2} },
    ]},
    // e655 专案落地
    { id: 'e655', stage: 'work', eventType: 'choice', title: '招商专案·落地', weight: 4, text: '协议签了！但项目落地远比想象复杂——征地、环评、施工许可，一环扣一环。施工单位催进度，群众有顾虑，你焦头烂额。', pools: ['public'], requireFlag: 'proj_step2', choices: [
      { text: '协调各方资源，稳步推进', effects: {workAbility: 3, eq: 1, mentalPressure: 3, reputation: 2, background: 1, flag: 'proj_step3'} },
      { text: '高压推进，缩短工期', effects: {positionWeight: 2, risk: 3, mentalPressure: 4, reputation: -1, body: -1, flag: 'proj_step3'} },
      { text: '向上级申请延期', effects: {mentalPressure: -2, positionWeight: -2, reputation: -2, risk: 2} },
    ]},
    // e656 专案评估（终章：奖励/追责）
    { id: 'e656', stage: 'work', eventType: 'choice', title: '招商专案·评估', weight: 6, text: '新城一期完工！市里组织评估组验收你的专案成果。如果顺利，这将是写入你履历的浓墨重彩的一笔；如果有问题，问责也随之而来。', pools: ['public'], requireFlag: 'proj_step3', choices: [
      { text: '如实汇报成绩与不足', effects: {integrity: 3, reputation: 3, positionWeight: 3, background: 2, mentalPressure: -2, flag: 'proj_done'} },
      { text: '夸大成绩，粉饰问题', effects: {positionWeight: 4, risk: 4, integrity: -3, reputation: 1, mentalPressure: 2, flag: 'proj_done'} },
      { text: '请评估组多关照', effects: {background: 2, risk: 4, integrity: -3, reputation: -2, mentalPressure: 2} },
    ]},
    // e657 专案功成（auto 终章奖励，requireFlag proj_done）
    { id: 'e657', stage: 'work', eventType: 'auto', title: '专案功成', weight: 6, text: '招商专案圆满收官！东部新城首批企业入驻，你的事迹登上了市报头版。领导在大会上点名表扬你——"有担当、有能力、能成事"。这份履历，让你的仕途又上了一个台阶。', pools: ['public'], requireFlag: 'proj_done', effects: {reputation: 8, positionWeight: 5, background: 4, workAbility: 3, mentalPressure: -4} },

    // ==================== 好运事件链（v2.1 运气决定，高运气玩家可触发） ====================
    // 这些事件通过引擎 luckEvents 机制触发：运气高 → 概率大幅提升
    // e658 天降奇遇
    { id: 'e658', stage: 'work', eventType: 'auto', title: '天降奇遇', weight: 3, text: '你临时顶替同事参加的一场座谈会上，恰好遇到部里下来调研的领导。你随口提的一个建议被领导当场记下，并点名让你写专题报告。', pools: ['public'], luckEvent: true, effects: {reputation: 8, positionWeight: 4, background: 5, workAbility: 3, mentalPressure: -3} },
    // e659 捡漏机会
    { id: 'e659', stage: 'work', eventType: 'auto', title: '捡漏机会', weight: 3, text: '上级临时增加一个赴京培训名额，原定人选因故去不了，你因为刚好在场被点名顶上。这次培训让你结识了不少部委的同志。', pools: ['public'], luckEvent: true, effects: {background: 8, positionWeight: 4, iq: 2, workAbility: 3, mentalPressure: -2} },
    // e660 伯乐一顾
    { id: 'e660', stage: 'work', eventType: 'auto', title: '伯乐一顾', weight: 3, text: '一位即将退休的老领导看了你的材料，评价极高，主动向组织推荐了你。他说"这样的年轻人，值得被看见"。', pools: ['public'], luckEvent: true, effects: {background: 10, positionWeight: 4, reputation: 5, mentalPressure: -4} },
    // e661 无心插柳
    { id: 'e661', stage: 'life', eventType: 'auto', title: '无心插柳', weight: 3, text: '你随手买的一张彩票中了小奖，更神奇的是，同一天你收到一封信：一笔多年前的旧账意外追回，钱到了你名下。', pools: ['public'], luckEvent: true, effects: {wealth: 25, luck: 1, familyPressure: -3, mentalPressure: -2} },
    // e662 时来运转
    { id: 'e662', stage: 'work', eventType: 'auto', title: '时来运转', weight: 3, text: '单位竞争最激烈的那个岗位，报名者临考弃考，你以黑马之姿顺利上位。有人说你运气好，只有你知道，你为这一天准备了很久。', pools: ['public'], luckEvent: true, effects: {positionWeight: 5, reputation: 4, desire: 3, mentalPressure: -5, luck: 1} },
    // ==================== 财富支出事件（v2.3 财富系统平衡） ====================
    // e663 突发医疗支出：有积蓄玩家可能遭遇意外支出，让财富有意外压力
    { id: 'e663', stage: 'life', eventType: 'choice', title: '突发医疗', weight: 4, text: '家里有人突然住院，医保报销后仍需自付一笔不小的费用。医生说情况不严重，但钱的事让人发愁——积蓄见底的感觉，比生病本身更难受。', pools: ['public'], requireWealth: 40, choices: [
      { text: '全额支付，钱没了可以再挣', effects: {wealth: -45, familyPressure: -3, mentalPressure: 3, reputation: 1, integrity: 1} },
      { text: '动用定期存款和应急金', effects: {wealth: -35, familyPressure: -2, mentalPressure: 2} },
      { text: '向亲友先借一部分', effects: {wealth: -20, familyPressure: 3, mentalPressure: 4, background: 1} },
      { text: '申请医疗救助和慈善援助', effects: {wealth: -25, familyPressure: -1, mentalPressure: 2, integrity: 2, eq: 1} },
      { text: '拖一拖，等凑齐了再交', effects: {familyPressure: 5, mentalPressure: 6, body: -1, risk: 2} },
      { text: '办信用卡透支垫付', effects: {wealth: -20, mentalPressure: 2, flag: 'borrowed'}, maxWealth: 40 },
    ]},

    // =====================================================================
    // 第十二批：属性赋活事件（外貌/家境/职级权重专属玩法）
    // =====================================================================
    // e667：相亲初印象（外貌驱动：第一印象决定姻缘走向）
    { id: 'e667', stage: 'life', eventType: 'choice', title: '相亲初印象', weight: 3, requireAppearance: 3, requireSingle: true, year: [22, 45], text: '朋友给你介绍了一个条件不错的对象。相亲那天，对方比你想象中更看重"眼缘"。你的一举一动、穿着打扮，都在被悄悄打分——第一印象，往往决定后续故事。', pools: ['public'], choices: [
      { text: '精心打理形象赴约', effects: {appearance: 1, eq: 1, reputation: 1, mentalPressure: 1} },
      { text: '邋里邋遢随性赴约', effects: {appearance: -1, eq: -1, reputation: -1} },
      { text: '带朋友一起去把关', effects: {eq: 1, mentalPressure: 1} },
      { text: '视频相亲省时省力', effects: {appearance: -1, eq: 1, mentalPressure: -1} },
    ]},
    // e668：形象岗轮值（外貌驱动：形象岗/舆情发言人是体制内"门面"）
    { id: 'e668', stage: 'work', eventType: 'choice', title: '形象岗轮值', weight: 3, requireAppearance: 5, text: '单位缺一个对外形象岗的人选——接待来宾、出镜讲解、新闻发言。领导物色了一圈，觉得你是"拿得出手"的那个。形象岗露脸多、机会多，但也更被关注。', pools: ['public'], choices: [
      { text: '主动报名，抓住露脸机会', effects: {appearance: 1, reputation: 3, positionWeight: 3, mentalPressure: 3, heat: 2} },
      { text: '认真准备每次出镜', effects: {appearance: 1, workAbility: 2, reputation: 2, mentalPressure: 1} },
      { text: '婉拒，避免出风头', effects: {integrity: 1, mentalPressure: -1} },
      { text: '借机经营个人形象', effects: {reputation: 4, heat: 4, risk: 2, desire: 2, appearance: 1} },
    ]},
    // e669：父母养老帮扶（家境驱动：家里有底气，养老路更宽）
    { id: 'e669', stage: 'life', eventType: 'choice', title: '父母帮扶', weight: 3, requireFamily: 2, text: '父母年纪渐长，养老成了绕不开的话题。你家里条件还算殷实——但钱能解决的事，往往是最容易的事；难的是既尽孝又不耽误工作。', pools: ['public'], choices: [
      { text: '请父母搬来同住，互相照应', effects: {family: 1, familyPressure: -4, mentalPressure: 2, wealth: -3, eq: 1} },
      { text: '出钱请专业护工', effects: {family: 1, familyPressure: -3, wealth: -10, reputation: 1} },
      { text: '送回老家让亲戚照应', effects: {family: -1, familyPressure: 2, reputation: -1, mentalPressure: 1} },
      { text: '申请社区养老服务', effects: {familyPressure: -2, reputation: 1, integrity: 1} },
    ]},
    // e670：专案组组长（职级权重驱动：实权岗位正直线第一环）
    { id: 'e670', stage: 'work', eventType: 'choice', title: '专案组组长', weight: 3, requirePositionWeight: 45, text: '一桩多年悬而未决的积案压在你案头。组织决定成立专案组，由你牵头。这是实打实的实权——统筹各方、调动资源、督办进度。办成了是亮眼政绩，办砸了就是你的责任。', pools: ['public'], choices: [
      { text: '挑重担，啃最硬的骨头', effects: {positionWeight: 4, workAbility: 4, reputation: 5, mentalPressure: 6, body: -1, risk: 1} },
      { text: '稳妥推进，不求有功但求无过', effects: {workAbility: 1, reputation: 1, mentalPressure: 1} },
      { text: '借专案之机拓展人脉', effects: {background: 4, positionWeight: 2, mentalPressure: 2, risk: 2} },
      { text: '拉队伍共享成果', effects: {eq: 2, reputation: 2, positionWeight: 3, mentalPressure: 3, background: 2} },
    ]},
    // e671：跨单位协调（职级权重驱动：实权岗位正直线第二环）
    { id: 'e671', stage: 'work', eventType: 'choice', title: '跨单位协调', weight: 3, requirePositionWeight: 40, text: '一项工作牵涉多个部门，僵局已久。你被点名牵头协调——这需要调动别家资源、平衡各方利益。协调得动，是你实权的证明；协调不动，也别怪别人看笑话。', pools: ['public'], choices: [
      { text: '主动牵头，破局者得先机', effects: {background: 4, positionWeight: 4, reputation: 3, mentalPressure: 4} },
      { text: '做好分内事，把机会让给别人', effects: {workAbility: 2, integrity: 2, mentalPressure: -1} },
      { text: '借协调之机广结善缘', effects: {eq: 2, background: 3, mentalPressure: 2, reputation: 1} },
      { text: '借机向对方透露己方底牌换取让步', effects: {background: 5, positionWeight: 2, risk: 3, heat: 2, integrity: -2} },
    ]},
    // e672：带队攻坚（职级权重驱动：实权岗位正直线第三环）
    { id: 'e672', stage: 'work', eventType: 'choice', title: '带队攻坚', weight: 3, requirePositionWeight: 55, text: '重大任务进入攻坚期，时间紧、任务重、关注度高。你带着一支队伍日夜奋战。这一仗打下来，你在这条战线上的分量就彻底立住了。', pools: ['public'], choices: [
      { text: '身先士卒，带头冲锋', effects: {positionWeight: 5, reputation: 5, workAbility: 4, body: -2, mentalPressure: 8} },
      { text: '科学分工，排兵布阵', effects: {workAbility: 3, positionWeight: 3, reputation: 3, eq: 1, mentalPressure: 4} },
      { text: '雁过拔毛，趁机揩油', effects: {wealth: 15, risk: 10, heat: 6, integrity: -5, desire: 5, positionWeight: -2} },
      { text: '向上汇报，争取资源支持', effects: {background: 3, positionWeight: 2, reputation: 2, mentalPressure: 2} },
    ]},

    // =====================================================================
    // 第十三批：背景属性赋活（背景低=拖累 / 平衡区=枢纽 / 背景高=红利）
    // 触发机制：事件级 minBackground/maxBackground 区间过滤 + 区间内权重×6
    // 选项机制：选项级 minBackground/maxBackground，不满足区间时 UI 灰置、引擎拦截
    // =====================================================================
    // ---- 低档（背景 [0,39]）：拖累型事件 ----
    { id: 'e721', stage: 'work', eventType: 'auto', title: '消息闭塞', weight: 3, maxBackground: 39, text: '单位里几个关键会议和人事动向，你总是最后一个知道。等你在群里看到通知时，材料已经交了三轮。想找个人问问风向，翻遍通讯录也不知道该问谁。', pools: ['public'], effects: {mentalPressure: 4, risk: 2, background: 1} },
    { id: 'e722', stage: 'life', eventType: 'choice', title: '请托无门', weight: 3, maxBackground: 39, text: '家里亲戚想让孩子转个学，托你找教育局的人说说。你这才发现——自己在这个系统里，竟然一个能说上话的人都没有。', pools: ['public'], choices: [
      { text: '如实告诉亲戚帮不上忙', effects: {integrity: 2, eq: 1, familyPressure: 2, mentalPressure: 1} },
      { text: '硬着头皮去问认识的同事', effects: {background: 1, mentalPressure: 3, reputation: -1} },
      { text: '帮亲戚查正规渠道自己办', effects: {workAbility: 1, eq: 1, integrity: 1, background: 1} },
    ]},
    { id: 'e723', stage: 'work', eventType: 'choice', title: '被边缘化', weight: 3, maxBackground: 39, text: '科室聚餐、重要活动，你总是最后一个被通知。同事们热络地聊着共同认识的人，你插不上话——你觉得自己像个局外人。', pools: ['public'], choices: [
      { text: '主动参加集体活动刷存在感', effects: {eq: 1, background: 2, mentalPressure: 2} },
      { text: '用工作成绩说话，不搞这些', effects: {workAbility: 2, integrity: 1, background: -1} },
      { text: '找老同事请教融入之道', effects: {eq: 1, background: 1, mentalPressure: 1} },
    ]},
    { id: 'e724', stage: 'work', eventType: 'auto', title: '错失晋升信息', weight: 3, maxBackground: 39, text: '遴选公告发出来三天后你才知道。报名窗口只剩两天，材料还缺两份证明——没有熟人提前提醒，也没有人帮你把材料补齐。', pools: ['public'], effects: {mentalPressure: 5, desire: 3, background: -1} },
    { id: 'e725', stage: 'work', eventType: 'choice', title: '担保无门', weight: 3, maxBackground: 39, text: '想参加竞岗，需要单位两名同事联名推荐。你数了数，居然凑不齐两个愿意为你签字的人。', pools: ['public'], choices: [
      { text: '平时多帮同事的忙，攒人情', effects: {eq: 1, background: 3, workAbility: 1} },
      { text: '厚着脸皮逐个去说', effects: {mentalPressure: 3, eq: 1, background: 1} },
      { text: '放弃这次机会，下次再说', effects: {desire: -2, mentalPressure: -1} },
    ]},
    { id: 'e726', stage: 'life', eventType: 'auto', title: '应酬被冷落', weight: 3, maxBackground: 39, text: '饭局上大家觥筹交错，你举杯时只有自己喝。没有人给你引荐，也没有人记得你的名字——你开始明白，有些场合不是你在场，就算你在了。', pools: ['public'], effects: {mentalPressure: 3, desire: 1, background: 1} }, // v2.67 语病修复（'不是你在，就算你在了'→'不是你在场'）

    // ---- 平衡区（背景 [40,70]）：被信赖的中间人·枢纽链 ----
    { id: 'e727', stage: 'work', eventType: 'choice', title: '牵线搭桥', weight: 4, minBackground: 40, maxBackground: 70, text: '你在单位内外都认识不少人。今天两个互不相识的人都想找对方——你随口一提，两边都来了精神："你牵个线？"', pools: ['public'], choices: [
      { text: '热心牵线，成人之美', effects: {eq: 2, background: 3, reputation: 2, mentalPressure: 1, flag: 'hub_bridge'} },
      { text: '帮忙对接，但不掺和细节', effects: {eq: 1, background: 2, reputation: 1, flag: 'hub_bridge'} },
      { text: '婉拒，怕惹麻烦', effects: {mentalPressure: -1, background: -1} },
    ]},
    { id: 'e728', stage: 'work', eventType: 'choice', title: '化解矛盾', weight: 4, requireFlag: 'hub_bridge', text: '上次你牵线促成的合作出了点小摩擦，两边都来找你评理。你成了他们默认的"中间人"——这个位置，站好了是口碑，站歪了是两头得罪。', pools: ['public'], choices: [
      { text: '居中调解，各退一步', effects: {eq: 2, background: 3, reputation: 3, flag: 'hub_mediator'} },
      { text: '请双方领导出面协调', effects: {background: 2, positionWeight: 1, reputation: 1, flag: 'hub_mediator'} },
      { text: '抽身不管，让他们自己解决', effects: {eq: -2, background: -1, reputation: -1, mentalPressure: -2} },
    ]},
    { id: 'e729', stage: 'work', eventType: 'choice', title: '被举荐', weight: 4, requireFlag: 'hub_mediator', text: '你居中调停的名声传到了上面。一次干部考察中，几个不同条线的人都提到了你的名字——"那个年轻人，大家都信他。"', pools: ['public'], choices: [
      { text: '借势而上，主动汇报工作', effects: {positionWeight: 3, background: 3, reputation: 2, flag: 'hub_recommend'} },
      { text: '保持低调，继续积累口碑', effects: {eq: 1, background: 2, reputation: 2, integrity: 1, flag: 'hub_recommend'} },
    ]},
    { id: 'e730', stage: 'life', eventType: 'auto', title: '口碑传播', weight: 4, requireFlag: 'hub_recommend', text: '"有事找小X"成了单位里的一句口头禅。从司机班到领导层，都知道你是个"靠谱的中间人"——信息在你这里汇聚，资源经你调配。', pools: ['public'], effects: {reputation: 4, background: 4, positionWeight: 2, mentalPressure: -2} },
    { id: 'e731', stage: 'work', eventType: 'choice', title: '枢纽地位', weight: 4, requireFlag: 'hub_recommend', text: '你几乎成了单位默认的"枢纽"——矛盾到你这里化解，事情经你这里办成。但这也意味着，你开始被各方"惦记"。', pools: ['public'], choices: [
      { text: '甘当枢纽，继续服务大家', effects: {background: 3, reputation: 3, eq: 1, mentalPressure: 3} },
      { text: '适当收一收，专注本职工作', effects: {workAbility: 2, background: 1, mentalPressure: -2, integrity: 2} },
      { text: '把这些人望用到仕途上', effects: {positionWeight: 4, risk: 3, desire: 3, background: 2} },
    ]},
    // 平衡区杂项
    { id: 'e732', stage: 'work', eventType: 'choice', title: '调解评优矛盾', weight: 3, minBackground: 40, maxBackground: 70, text: '年底评优，两个科室为一个名额争得面红耳赤，都把材料递到你这里想让你帮忙说话——你人缘好，两边都把你当自己人。', pools: ['public'], choices: [
      { text: '按实绩评判，不偏不倚', effects: {integrity: 3, reputation: 2, background: 2} },
      { text: '两边都不得罪，建议加名额', effects: {eq: 2, background: 2, reputation: 1, risk: 1} },
      { text: '倾向关系更近的一边', effects: {background: 2, eq: -1, integrity: -2, risk: 2} },
    ]},
    { id: 'e733', stage: 'work', eventType: 'choice', title: '跨部门借调', weight: 3, minBackground: 40, maxBackground: 70, text: '隔壁单位临时缺人，点名想借调你——因为"你两边都熟"。借调是机会，也是人情。', pools: ['public'], choices: [
      { text: '欣然前往，积累跨部门人脉', effects: {background: 3, workAbility: 2, positionWeight: 1, mentalPressure: 2} },
      { text: '婉拒，安心本职工作', effects: {workAbility: 1, mentalPressure: -1, background: -1} },
    ]},
    { id: 'e734', stage: 'work', eventType: 'choice', title: '领导私下询问', weight: 3, minBackground: 40, maxBackground: 70, text: '一位领导私下找你了解另一个部门的情况。你知道他醉翁之意不在酒，但也知道说错一句话的代价——你人缘好，意味着知道的事也多。', pools: ['public'], choices: [
      { text: '如实客观陈述，不带情绪', effects: {integrity: 2, background: 2, eq: 1} },
      { text: '点到为止，暗示自己不想掺和', effects: {eq: 1, background: 1, mentalPressure: 1} },
      { text: '顺着领导想听的讲', effects: {background: 3, risk: 3, integrity: -2, desire: 2} },
    ]},
    { id: 'e735', stage: 'work', eventType: 'auto', title: '两边都找你', weight: 3, minBackground: 40, maxBackground: 70, text: '同一个下午，两个立场不同的人都来找你牵线——他们恰好互相不对付。你夹在中间，忽然明白了"枢纽"这两个字的重量。', pools: ['public'], effects: {mentalPressure: 3, background: 2, eq: 1} },

    // ---- 高档（背景 [71,100]）：人脉红利（高风险高收益） ----
    { id: 'e736', stage: 'life', eventType: 'choice', title: '请托变现', weight: 4, minBackground: 71, text: '找你办事的人越来越多，有人开始"懂规矩"——信封、购物卡、饭局邀请。你手里的人脉，第一次变成了看得见的"价格"。', pools: ['public'], choices: [
      { text: '严词拒绝，划清界限', effects: {integrity: 3, risk: -3, reputation: 1, background: -1} },
      { text: '小事收下，大事推掉', effects: {wealth: 10, background: 3, risk: 5, heat: 3, integrity: -3, desire: 3, flag: 'bg_tempt_1'} },
      { text: '照单全收，来者不拒', effects: {background: 5, wealth: 30, risk: 8, heat: 6, integrity: -6, desire: 5, flag: 'bg_tempt_1'} },
    ]},
    { id: 'e737', stage: 'work', eventType: 'choice', title: '内部消息', weight: 4, minBackground: 71, text: '你总能比别人早半天听到风声——人事调整、政策方向、检查重点。提前知道，就是提前布局；用错消息，就是给自己埋雷。', pools: ['public'], choices: [
      { text: '利用消息差早做准备', effects: {positionWeight: 3, background: 2, risk: 2, desire: 2} },
      { text: '只当谈资，不轻易行动', effects: {eq: 1, background: 1, integrity: 1} },
      { text: '把消息透露给领导示好', effects: {background: 3, positionWeight: 2, risk: 2, integrity: -1} },
    ]},
    { id: 'e738', stage: 'work', eventType: 'auto', title: '贵人抬举', weight: 4, minBackground: 71, text: '你认识的人开始互相推荐你——"小X不错，我认识。"一句随口的肯定，让几个平时够不着的门，对你虚掩了一条缝。', pools: ['public'], effects: {background: 4, positionWeight: 3, reputation: 3, mentalPressure: 2} },
    { id: 'e739', stage: 'life', eventType: 'choice', title: '利益诱惑（牵线费）', weight: 4, minBackground: 71, text: '一位老板请你"帮忙牵个线"，报酬是一笔你几年工资都挣不来的"介绍费"。他笑着说这只是"辛苦费"，你心里清楚这叫什么。', pools: ['public'], choices: [
      { text: '拒绝，介绍他走正规渠道', effects: {integrity: 3, risk: -2, reputation: 1} },
      { text: '帮忙牵线但不收钱', effects: {background: 2, risk: 2, integrity: 1, eq: 1, flag: 'bg_tempt_2'} },
      { text: '收下介绍费', effects: {wealth: 40, background: 2, risk: 8, heat: 8, integrity: -5, desire: 4, flag: 'bg_tempt_2'} },
    ]},
    { id: 'e740', stage: 'life', eventType: 'auto', title: '圈子饭局', weight: 3, minBackground: 71, text: '你的名字开始出现在一些"高端圈子"的饭局名单上。桌上的人非富即贵，每个人都递给你一张名片——你知道这些人能捧你，也能摔你。', pools: ['public'], effects: {background: 5, reputation: 2, risk: 3, mentalPressure: 3, desire: 3} },
    { id: 'e741', stage: 'work', eventType: 'choice', title: '托付办事', weight: 3, minBackground: 71, text: '一位老领导托你照顾他的亲戚——不算违规，但属于"灰色地带"。办成了，你在他那里记一分；办砸了，你也在他那里记一分。', pools: ['public'], choices: [
      { text: '在不违规前提下尽量帮忙', effects: {background: 3, eq: 1, risk: 2} },
      { text: '把话说明白，能帮多少帮多少', effects: {integrity: 2, eq: 1, background: 2} },
      { text: '直接婉拒，公事公办', effects: {integrity: 3, background: -2, reputation: -1} },
    ]},
    { id: 'e742', stage: 'work', eventType: 'auto', title: '树大招风', weight: 3, minBackground: 71, text: '你的人脉广到一定程度，开始有人盯着你了——纪检谈话名单上出现你名字的概率，和你的通讯录长度成正比。', pools: ['public'], effects: {risk: 5, heat: 4, mentalPressure: 4, background: 1} },
    // 诱惑链收尾（消费 bg_tempt_1 / bg_tempt_2，形成"高风险"闭环）
    { id: 'e743', stage: 'work', eventType: 'auto', title: '纪委关注', weight: 6, requireFlag: 'bg_tempt_1', text: '你收下的那些"心意"，有一笔被举报了。纪检组找你谈话时，你庆幸自己推掉过几单大的——但这次，没那么容易过关。', pools: ['public'], effects: {risk: 8, heat: 10, mentalPressure: 8, integrity: -3} },
    { id: 'e744', stage: 'work', eventType: 'auto', title: '风声收紧', weight: 6, requireFlag: 'bg_tempt_2', text: '介绍费那件事的风声，不知怎么就传开了。饭局上有人意味深长地问你"最近手头宽裕？"——你后背一凉。', pools: ['public'], effects: {risk: 6, heat: 6, mentalPressure: 6, reputation: -2} },
    { id: 'e673', stage: 'life', eventType: 'auto', title: '彩票中奖', weight: 3, text: '下班路过彩票站，你随手买了一张——结果中了！钱不多，但够全家下馆子搓一顿。同事们都说你手气旺，你心想：运气这东西，还真得信。', pools: ['public'], requireLuck: 6, luckEvent: true, effects: {wealth: 9, familyPressure: -2, reputation: 1} },
    { id: 'e674', stage: 'work', eventType: 'auto', title: '贵人提携', weight: 3, text: '分管领导要调走，临走前单独找你谈话："你在我手下这几年，踏实、聪明、运气也好，我向上面推荐了你。"你没想到，一次偶然的工作交集竟成了仕途的敲门砖。', pools: ['public'], requireLuck: 7, luckEvent: true, effects: {positionWeight: 3, reputation: 2, background: 1, mentalPressure: -2} },
    { id: 'e675', stage: 'work', eventType: 'auto', title: '逢凶化吉', weight: 3, text: '一笔重要材料出了纰漏，眼看要背处分——偏偏你上个月随手多留了一份底稿，还标注了修改过程。核查组看完直点头：程序完整、经得起查。事后你出了一身冷汗：这运气，躲过一劫。', pools: ['public'], requireLuck: 5, luckEvent: true, effects: {risk: -3, mentalPressure: 2, workAbility: 1, reputation: 1} },
    { id: 'e676', stage: 'life', eventType: 'auto', title: '家族人脉', weight: 3, text: '家族里有位长辈在某部门颇有威望。逢年过节，他带着你走动了一圈，饭桌上替你说了不少好话。席间他拍拍你的肩："年轻人，好好干。"你忽然明白，家族这两个字的分量。', pools: ['public'], requireFamily: 6, effects: {background: 2, reputation: 1, familyPressure: -2} },
    { id: 'e677', stage: 'work', eventType: 'choice', title: '气质发言', weight: 3, text: '全系统大会，你临时被点名上台汇报。台下坐着几百号人，还有不少领导。你深吸一口气走上台——多年的仪态和谈吐在这一刻派上了用场。', pools: ['public'], requireAppearance: 4, choices: [
      { text: '沉稳低调，条理清晰地汇报', effects: {reputation: 2, positionWeight: 1, eq: 1, mentalPressure: -2} },
      { text: '锋芒外露，语出惊人展示才华', effects: {reputation: 3, positionWeight: 2, iq: 1, heat: 2, mentalPressure: 1} }
    ] },

    // =====================================================================
    // 第十四批：财务事件池（财务规划↔事件双向联动 + 债务/腐败闭环）
    // 触发：事件级 requireWealth(下限)/maxWealth(上限) + 债务flag；负债越深腐败诱惑概率越高（引擎函数增长）
    // =====================================================================
    // ---- 债务链：借贷消费→催收→摊牌 / 网贷→危机 / 博彩→戒断 ----
    { id: 'e745', stage: 'life', eventType: 'auto', title: '债务催收', weight: 6, requireFlag: 'borrowed', maxWealth: -1, text: '催收电话开始打到你单位了。对方说话客气，但每一句都在提醒你——这笔钱，躲是躲不掉的。同事的目光，也多了些说不清的东西。', pools: ['public'], effects: {mentalPressure: 8, risk: 4, familyPressure: 4, reputation: -2} },
    { id: 'e746', stage: 'life', eventType: 'auto', title: '债务危机', weight: 6, requireFlag: 'loanOnline', maxWealth: -5, text: '网贷的利息像雪球一样滚起来了。你算了一笔账，发现靠工资这辈子都还不完。催收的人找到了你单位门口，领导已经找你谈过话了。', pools: ['public'], effects: {mentalPressure: 10, risk: 6, familyPressure: 5, reputation: -3} },
    { id: 'e747', stage: 'life', eventType: 'choice', title: '赌博戒断', weight: 6, requireFlag: 'gamblingAddict', text: '家人发现了你买彩票、打牌的记录，摊在桌上。母亲红着眼眶说："咱家不指望你发财，只指望你别走歪了。"你攥着手机，手心全是汗。', pools: ['public'], choices: [
      { text: '下决心戒赌，工资卡交给家人', effects: {deleteFlag: 'gamblingAddict', integrity: 2, familyPressure: 3, eq: 1} },
      { text: '再赌最后一次翻本', effects: {wealth: -20, desire: 3, risk: 3, mentalPressure: 4} },
      { text: '找单位工会谈心求助', effects: {deleteFlag: 'gamblingAddict', mentalPressure: -3, background: 1, reputation: 1} },
    ]},
    { id: 'e748', stage: 'life', eventType: 'choice', title: '债务摊牌', weight: 5, requireFlag: 'borrowed', text: '债越滚越大，瞒不住了。你决定和家人摊牌——要么一起想办法，要么一起沉下去。', pools: ['public'], choices: [
      { text: '向父母坦白，借家里的钱还清', effects: {wealth: 25, familyPressure: 8, background: -3, mentalPressure: 3, integrity: 1, deleteFlag: 'borrowed'} },
      { text: '拆东墙补西墙，先拖一阵', effects: {wealth: -10, risk: 4, mentalPressure: 3} },
      { text: '申请单位的困难补助', effects: {deleteFlag: 'borrowed', wealth: 15, reputation: -2, positionWeight: -3, heat: 3, mentalPressure: 2} },
    ]},
    // ---- 财务困境→腐败入口（负债越深，诱惑事件概率越高，由引擎函数加权） ----
    { id: 'e749', stage: 'work', eventType: 'choice', title: '伸手解困', weight: 6, maxWealth: 20, text: '一个生意人"恰巧"知道了你的难处。他说朋友有难处，自己愿意搭把手——"三十万，先拿去用，不用急着还。"你当然知道，这世上没有白拿的钱。', pools: ['public'], choices: [
      { text: '接受"资助"，先把债还了', effects: {flag: 'tookBribe', wealth: 45, risk: 8, heat: 5, integrity: -5, mentalPressure: -6} },
      { text: '婉拒，自己想办法', effects: {mentalPressure: 3, integrity: 3, risk: -1} },
      { text: '先向同事借钱周转', effects: {eq: 1, familyPressure: 2, wealth: 15, mentalPressure: 1} },
    ]},
    { id: 'e755', stage: 'work', eventType: 'choice', title: '挪用公款诱惑', weight: 5, maxWealth: 30, text: '月底对账，你经手的账上有一笔"暂时没人发现"的钱。差这么一笔，你所有的债就都能还上——只要下个月补回去，就神不知鬼不觉。你盯着那个数字，看了很久。', pools: ['public'], choices: [
      { text: '鬼使神差挪了一笔，先填窟窿', effects: {flag: 'embezzle', wealth: 50, risk: 12, heat: 8, integrity: -8, mentalPressure: 5} },
      { text: '如实上报，坦白困境', effects: {integrity: 4, mentalPressure: 3, reputation: 1} },
      { text: '再想别的办法，不动公款', effects: {mentalPressure: 4, desire: 2} },
    ]},
    { id: 'e756', stage: 'work', eventType: 'auto', title: '挪用败露（审计发现）', weight: 8, requireFlag: 'embezzle', text: '年底审计，账上的窟窿被发现了。纪委找你谈话的那天，你在走廊里遇见了当初"资助"你的那个生意人——他看你的眼神，像看一张用过的发票。', pools: ['public'], effects: {risk: 15, heat: 15, mentalPressure: 10, integrity: -5, reputation: -5} },
    // ---- 资金紧张与意外之财 ----
    { id: 'e750', stage: 'life', eventType: 'auto', title: '手头吃紧', weight: 4, maxWealth: 25, text: '月底还没到，钱包已经空了。同事约饭你找借口推掉，孩子想要个玩具你犹豫半天。穷，有时候不是一种状态，是一种难堪。', pools: ['public'], effects: {mentalPressure: 4, desire: 3, familyPressure: 2} },
    { id: 'e753', stage: 'life', eventType: 'auto', title: '物价上涨', weight: 4, maxWealth: 35, text: '菜价涨了，油价涨了，连楼下的包子都涨了五毛。工资没涨，日子却肉眼可见地变紧巴了。', pools: ['public'], effects: {wealth: -8, mentalPressure: 3, familyPressure: 2} },
    { id: 'e754', stage: 'work', eventType: 'auto', title: '年终奖', weight: 3, minYear: 3, text: '年底考核优秀，年终奖比去年厚了一截。你看着银行卡余额，忽然觉得这一年没白干。', pools: ['public'], effects: {wealth: 12, mentalPressure: -3} },
    { id: 'e752', stage: 'work', eventType: 'auto', title: '工资改革', weight: 3, minYear: 10, text: '工资改革落地，工龄工资上调。你算了算，一年能多出一笔不小的数目——老同志开玩笑说"熬年头还是有用的"。', pools: ['public'], effects: {wealth: 15, mentalPressure: -2, desire: 1} },
    // ---- 大额资产与灰色理财 ----
    { id: 'e751', stage: 'life', eventType: 'choice', title: '理财顾问', weight: 4, requireWealth: 100, text: '你手里有了些积蓄，银行理财顾问热情地约你喝茶。他口中的收益率让你心动，但你总觉得，天下没有白捡的利息。', pools: ['public'], choices: [
      { text: '听顾问的，分散配置', effects: {wealth: 8, iq: 1, mentalPressure: -1} },
      { text: '自己研究，不交智商税', effects: {iq: 2, wealth: 3} },
      { text: '大额投入高收益项目', effects: {wealth: 20, risk: 5, integrity: -1} },
    ]},
    { id: 'e757', stage: 'life', eventType: 'choice', title: '灰色理财', weight: 4, requireWealth: 80, text: '一个朋友的朋友介绍你一个"内部理财项目"，月息高得吓人。他说名额有限，只信得过你。你算了算利息，又看了看他的眼睛。', pools: ['public'], choices: [
      { text: '投了，利息真香', effects: {flag: 'grayFinance', wealth: 30, risk: 6, desire: 3} },
      { text: '觉得不靠谱，还是银行稳', effects: {integrity: 2, risk: -1, wealth: 2} },
    ]},
    { id: 'e758', stage: 'life', eventType: 'auto', title: '集资爆雷', weight: 8, requireFlag: 'grayFinance', text: '那个"内部理财项目"的老板失联了。群里炸了锅，有人说他跑路去了国外。你看着账户里缩水一大截的数字，手在发抖——那里面有孩子明年的学费。', pools: ['public'], effects: {wealth: -60, mentalPressure: 8, familyPressure: 4, risk: 3} },

    // =====================================================================
    // 第十五批：风控与逃脱（被抓前给玩家自救机会）
    // =====================================================================
    // e760：高危风控预警（热度≥50 时概率触发，玩家可收敛降温，避免滑向被抓）
    { id: 'e760', stage: 'work', eventType: 'choice', title: '风控预警', weight: 6, requireHeat: 50, text: '一位体制内的老友约你喝茶，欲言又止了半天："最近……上面有人在翻你经手的东西，风声不太对。有些事，能收就收了吧。"你端着茶杯，后背有些发凉。', pools: ['public'], choices: [
      { text: '收手收敛，低调一段时间', effects: {heat: -20, risk: -8, mentalPressure: -2, background: -1} },
      { text: '花钱打点，把动静压下去', effects: {wealth: -30, heat: -15, risk: -5, integrity: -2}, minWealth: 50 },
      { text: '找老关系出面说情', effects: {background: -15, heat: -20, risk: -5}, minBackground: 50 },
      { text: '主动向组织说清问题', effects: {heat: -30, integrity: 4, risk: -8, reputation: -3} },
      { text: '不当回事，继续按部就班', effects: {heat: 5, mentalPressure: 3} },
    ]},
    // e761：最后的挣扎（引擎在首次被抓判定时直接设置，60% 概率出现；逃脱后不再有第二次机会）
    // 注意：requireHeat 50 防止正常事件池误抽（引擎直接设置时不受过滤影响）
    { id: 'e761', stage: 'work', eventType: 'choice', title: '最后的挣扎', weight: 10, requireHeat: 50, text: '风声还是没压住。纪委的人已经在路上了，留给你的时间不多了。茶凉了很久，你盯着杯中的倒影——是认命，还是再搏一次？', pools: ['public'], choices: [
      { text: '动用全部关系摆平', effects: {heat: -40, risk: -15, background: -15, mentalPressure: 5, flag: 'escapedOnce'}, minBackground: 60 },
      { text: '花钱上下打点', effects: {heat: -35, risk: -15, wealth: -40, flag: 'escapedOnce'}, minWealth: 80 },
      { text: '连夜销毁证据，死不认账', effects: {heat: -30, risk: -15, integrity: -5, flag: 'escapedOnce'} },
      { text: '坦白从宽，争取从轻', effects: {heat: -60, risk: -20, flag: 'selfSurrender', mentalPressure: -10, reputation: -2} }, // v2.59 修复：原无 risk 削减，risk 型抓捕下自首零收益（heat-60 后仍被 risk 判定抓）
      { text: '认命，接受调查', effects: {mentalPressure: 5, integrity: 1} },
    ]},
    // ====== v2.49：孤儿 flag 收尾（mentorMode 传帮带此前设置后无任何消费） ======
    { id: 'e678', stage: 'work', eventType: 'auto', weight: 4, requireFlag: 'mentorMode', title: '桃李满门', text: '你带出来的年轻同志开始独当一面。看着他们在台上介绍工作成果，你想起当年自己也是这样一步步走过来的。', effects: {reputation: 3, positionWeight: 1, mentalPressure: -2, workAbility: 1} },
    // ====== v2.49d：D4 机会通道剧情（重点培养考察谈话，requireFlag keyTalent，不 delete flag——考察通过与否由晋升判定决定） ======
    { id: 'e679', stage: 'work', eventType: 'choice', weight: 8, requireFlag: 'keyTalent', title: '考察谈话', text: '组织部门找你谈话，考察期到了关键节点。谈话很温和，但每个问题都直指要害：你能扛起更大的担子吗？', choices: [
      { text: '坦诚汇报成绩与不足，展现担当', effects: {reputation: 3, positionWeight: 2, mentalPressure: -3, background: 2, workAbility: 1} },
      { text: '重点强调实绩，弱化短板', effects: {reputation: 2, positionWeight: 1, eq: 1, risk: 1, mentalPressure: -1} },
      { text: '紧张得语无伦次', effects: {reputation: -2, mentalPressure: 8, background: -1} },
    ]},
    // ================= v2.1.22 薄弱池事件扩充（宣传/政府系统/垂管系统/网信办/卫健/医保/人社/住建/中央/应急/民政/基层） =================
    { id: 'e783', stage: 'work', eventType: 'choice', title: '形象宣传片', weight: 3, text: '上级要求各部门制作形象宣传片参加全市展演。你负责牵头，但素材少、预算紧、时间更紧，同事私下说"宣传片就是给领导看的"。', pools: ['宣传'], choices: [
      { text: '聚焦一线真实故事，用小切口讲大主题', effects: {workAbility: 3, eq: 1, reputation: 2, mentalPressure: 2} },
      { text: '借用已有素材拼剪，按模板快速交片', effects: {workAbility: 1, mentalPressure: -1, reputation: -1} },
      { text: '请专业团队外包制作', effects: {background: 1, wealth: -10, reputation: 2, mentalPressure: -1} },
      { text: '发动同事自编自演，突出参与感', effects: {eq: 2, workAbility: 2, reputation: 1, mentalPressure: 2} },
      { text: '直接放弃，等上级来催再应付', effects: {risk: 2, reputation: -2, integrity: -1} },
    ]},
    { id: 'e784', stage: 'work', eventType: 'choice', title: '理论宣讲下基层', weight: 3, text: '市里组织理论宣讲团到基层宣讲，你被选为宣讲员。一位老农当场提问："政策好是好，可我们村的路啥时候修？"现场气氛一滞。', pools: ['宣传'], choices: [
      { text: '坦诚说明政策落地需要过程，现场记录诉求', effects: {integrity: 3, eq: 2, reputation: 2, peopleReputation: 3} },
      { text: '强调政策意义，暂不回应具体问题', effects: {workAbility: 1, eq: -1, peopleReputation: -1} },
      { text: '当场联系相关部门了解推进情况', effects: {workAbility: 3, eq: 1, reputation: 2, mentalPressure: 2} },
      { text: '会后单独留下详细解答', effects: {eq: 3, integrity: 1, peopleReputation: 2} },
      { text: '顾左右而言他，转移话题', effects: {eq: -1, integrity: -2, reputation: -1} },
    ]},
    { id: 'e785', stage: 'work', eventType: 'choice', title: '舆情处置演练', weight: 3, text: '网信办组织突发事件舆情处置实战演练，你所在单位被抽中。演练设定：一段断章取义的视频被大量转发，要求半小时内给出处置方案。', pools: ['宣传','网信办'], choices: [
      { text: '立即核实事实，同步准备通稿和回应口径', effects: {workAbility: 3, iq: 2, mentalPressure: 3, reputation: 2} },
      { text: '先请示领导再行动', effects: {background: 1, mentalPressure: 1, workAbility: 1} },
      { text: '安排专人监测舆情走势，再定策略', effects: {iq: 2, workAbility: 2, mentalPressure: 1} },
      { text: '冷处理，等热度自然消退', effects: {risk: 2, reputation: -1, integrity: -1} },
      { text: '按演练标准流程照本宣科', effects: {workAbility: 1, eq: -1, reputation: -1} },
    ]},
    { id: 'e786', stage: 'work', eventType: 'auto', title: '宣传之星', weight: 3, text: '你的宣传创新做法被上级肯定，相关经验在全市推广，单位宣传成绩从倒数跃居中上游。', pools: ['宣传'], effects: {reputation: 4, positionWeight: 2, workAbility: 2, mentalPressure: -2} },
    { id: 'e787', stage: 'work', eventType: 'choice', title: '报告攻坚夜', weight: 4, text: '政府工作报告初稿完成，领导改了三遍仍不满意，指出"亮点不足、数据不实、表述平淡"。距定稿只剩两天，你负责统筹文字组。', pools: ['政府系统'], choices: [
      { text: '沉下心来逐部门核对数据，打磨亮点表述', effects: {workAbility: 3, iq: 2, mentalPressure: 4, reputation: 2} },
      { text: '组织部门负责人集体改稿，集中民智', effects: {eq: 2, workAbility: 2, mentalPressure: 2, reputation: 1} },
      { text: '模仿上级报告框架，快速成稿', effects: {workAbility: 1, mentalPressure: -1, reputation: -1, risk: 1} },
      { text: '先请示领导明确重点方向再改', effects: {background: 2, workAbility: 2, mentalPressure: 1} },
      { text: '请笔杆子同事代劳，自己躲清闲', effects: {risk: 2, reputation: -2, integrity: -1, mentalPressure: -1} },
    ]},
    { id: 'e788', stage: 'work', eventType: 'choice', title: '民生实事征集', weight: 3, text: '市政府启动明年民生实事项目征集，群众反映最多的是停车难和加装电梯。发改委与住建部门方案有分歧，会议陷入僵局，你负责协调。', pools: ['政府系统'], choices: [
      { text: '梳理两部门方案利弊，提出折中整合意见', effects: {iq: 3, workAbility: 2, eq: 1, mentalPressure: 3} },
      { text: '先听取专家和群众代表意见', effects: {eq: 2, workAbility: 2, integrity: 1} },
      { text: '请分管领导拍板决策', effects: {background: 2, mentalPressure: -1, positionWeight: 1} },
      { text: '按"谁困难大谁优先"原则排序列入', effects: {iq: 2, workAbility: 2, eq: 1} },
      { text: '搁置争议，等下季度再议', effects: {risk: 2, reputation: -1, positionWeight: -1} },
    ]},
    { id: 'e789', stage: 'work', eventType: 'choice', title: '系统练兵比武', weight: 3, text: '垂管系统组织全国业务练兵比武，你单位派你参赛。比武项目多、竞争对手强，同时单位日常业务不能停。', pools: ['垂管系统'], choices: [
      { text: '制定训练计划，工作之余全力备战', effects: {workAbility: 3, body: -1, mentalPressure: 3, reputation: 1} },
      { text: '合理分配时间，业务备赛两不误', effects: {iq: 2, workAbility: 2, eq: 1, mentalPressure: 1} },
      { text: '重点突击易得分项目', effects: {iq: 2, workAbility: 1, risk: 1} },
      { text: '以业务忙为由推脱参赛', effects: {risk: 1, reputation: -2, positionWeight: -1} },
      { text: '找题库突击刷题', effects: {iq: 1, workAbility: 1, desire: 1} },
    ]},
    { id: 'e790', stage: 'work', eventType: 'auto', title: '比武凯旋', weight: 3, text: '你在系统练兵比武中取得优异成绩，为单位争得荣誉，垂直条线内名气大涨。', pools: ['垂管系统'], effects: {reputation: 5, positionWeight: 2, workAbility: 3, background: 2} },
    { id: 'e791', stage: 'work', eventType: 'choice', title: '网络谣言治理', weight: 4, text: '辖区一则"某市场食品不合格"的谣言在短视频平台疯传，商户损失惨重。你负责处置，谣言源头指向外地，跨区域协查流程复杂。', pools: ['网信办'], choices: [
      { text: '及时辟谣+溯源处置，协调平台下架谣言视频', effects: {workAbility: 3, iq: 2, integrity: 2, mentalPressure: 3} },
      { text: '发布官方辟谣信息，稳定市场秩序', effects: {workAbility: 2, integrity: 2, reputation: 1} },
      { text: '约谈传播企业，追责造谣者', effects: {integrity: 3, workAbility: 2, risk: 2} },
      { text: '联动市场监管部门开展联合检查背书', effects: {background: 2, workAbility: 2, reputation: 1} },
      { text: '冷处理，等待谣言自然消散', effects: {risk: 2, reputation: -1, peopleReputation: -2} },
    ]},
    { id: 'e792', stage: 'work', eventType: 'choice', title: '个人信息保护检查', weight: 3, text: '上级部署App违法违规收集个人信息专项整治。你检查发现辖区内一家医院App违规收集患者敏感信息，医院称"数据用于科研"。', pools: ['网信办'], choices: [
      { text: '依法责令整改并通报，明确科研用途也需合规', effects: {integrity: 3, workAbility: 2, risk: 2, reputation: 1} },
      { text: '先约谈医院负责人，限期整改', effects: {workAbility: 2, eq: 1, risk: 1} },
      { text: '现场核查数据用途，依法取证', effects: {iq: 2, integrity: 2, workAbility: 2} },
      { text: '考虑医院实际困难，从轻处理', effects: {eq: 1, risk: 2, integrity: -1} },
      { text: '只发文要求自查，不做检查', effects: {risk: 2, integrity: -2, reputation: -1} },
    ]},
    { id: 'e793', stage: 'work', eventType: 'choice', title: '基层医疗帮扶', weight: 3, text: '卫健委组织优质医疗资源下沉，你负责协调三甲医院医生到乡镇卫生院坐诊。乡镇条件简陋，医生积极性不高，群众又盼着专家来。', pools: ['卫健'], choices: [
      { text: '改善支援条件，落实补贴和轮换机制', effects: {workAbility: 3, eq: 2, background: 1, mentalPressure: 2} },
      { text: '先摸底乡镇需求，精准匹配科室', effects: {iq: 2, workAbility: 2, eq: 1} },
      { text: '动员年轻医生踊跃报名', effects: {eq: 2, workAbility: 1, reputation: 1} },
      { text: '安排远程会诊作为补充', effects: {iq: 2, workAbility: 2, mentalPressure: 1} },
      { text: '开会部署了事，不抓落实', effects: {risk: 2, reputation: -2, integrity: -1} },
    ]},
    { id: 'e794', stage: 'work', eventType: 'choice', title: '集采落地观察', weight: 3, text: '国家药品集采政策落地，辖区内一家医院反映部分集采药品供应不稳、群众有意见。你负责政策执行监测。', pools: ['医保'], choices: [
      { text: '核实供应环节问题，协调配送企业保障供应', effects: {workAbility: 3, integrity: 2, eq: 1, mentalPressure: 2} },
      { text: '约谈医院和配送企业，压实保供责任', effects: {workAbility: 2, eq: 1, risk: 1} },
      { text: '监测集采药品使用数据，研判供应缺口', effects: {iq: 2, workAbility: 2} },
      { text: '向群众解释政策，疏导情绪', effects: {eq: 2, workAbility: 1, reputation: 1} },
      { text: '以政策统一执行为由不予协调', effects: {eq: -1, risk: 1, reputation: -2} },
    ]},
    { id: 'e795', stage: 'work', eventType: 'choice', title: '新就业形态保障', weight: 3, text: '辖区外卖骑手、网约车司机等新就业形态劳动者反映劳动保障缺失，部分平台企业不愿参加社保。上级要求探索权益保障试点。', pools: ['人社'], choices: [
      { text: '深入调研新业态群体诉求，制定分类保障方案', effects: {workAbility: 3, iq: 2, integrity: 1, mentalPressure: 3} },
      { text: '约谈平台企业，宣讲社保政策', effects: {workAbility: 2, eq: 1, risk: 1} },
      { text: '先小范围试点灵活参保办法', effects: {iq: 2, workAbility: 2, reputation: 1} },
      { text: '组织人社服务进驿站，现场答疑', effects: {eq: 2, peopleReputation: 2, workAbility: 1} },
      { text: '以情况复杂为由暂缓推进', effects: {risk: 2, reputation: -1, positionWeight: -1} },
    ]},
    { id: 'e796', stage: 'work', eventType: 'choice', title: '加装电梯僵局', weight: 4, text: '老旧小区加装电梯推进中，一二楼住户坚决反对（采光/噪音/补偿），高楼层住户强烈要求开工。双方在协调会上激烈争吵，项目停滞半年。', pools: ['住建'], choices: [
      { text: '组织小范围恳谈，逐一化解低层顾虑并完善补偿方案', effects: {eq: 3, workAbility: 2, mentalPressure: 3} },
      { text: '引入第三方调解和专业评估', effects: {iq: 2, eq: 2, workAbility: 1} },
      { text: '按多数意见先行开工', effects: {risk: 3, reputation: -2, eq: -1} },
      { text: '暂缓项目，先协调其他楼栋', effects: {workAbility: 1, risk: 1, mentalPressure: -1} },
      { text: '请人大代表政协委员介入协调', effects: {background: 2, reputation: 1, eq: 1} },
    ]},
    { id: 'e797', stage: 'work', eventType: 'choice', title: '政策研究课题', weight: 4, text: '上级给你布置一项政策研究课题：区域协同发展中的堵点与对策。时间紧、涉面广，需要大量调研和数据支撑，其他部门配合积极性一般。', pools: ['中央'], choices: [
      { text: '制定调研方案，带队深入一线摸实情', effects: {iq: 3, workAbility: 3, mentalPressure: 4, integrity: 1} },
      { text: '先梳理现行政策文件，再聚焦短板', effects: {iq: 2, workAbility: 2, mentalPressure: 2} },
      { text: '请专家智库参与论证', effects: {background: 2, iq: 2, workAbility: 1} },
      { text: '协调相关部门共享数据', effects: {eq: 2, background: 1, workAbility: 2} },
      { text: '参照他人成果拼凑成文', effects: {risk: 3, integrity: -2, reputation: -2} },
    ]},
    { id: 'e798', stage: 'work', eventType: 'choice', title: '汛期值守决策', weight: 4, text: '主汛期夜间，气象预警升级为红色，通知要求组织可能受威胁群众转移。但转移涉及多个乡镇数千人，部分群众不愿离开，你作为应急值班负责人如何决策？', pools: ['应急'], choices: [
      { text: '按预案果断组织应转尽转，逐户劝离', effects: {integrity: 3, workAbility: 3, mentalPressure: 5, reputation: 2} },
      { text: '先核实雨情水情再决定转移范围', effects: {iq: 2, workAbility: 2, risk: 1} },
      { text: '协调乡镇和村组干部包户转移', effects: {workAbility: 2, eq: 2, background: 1} },
      { text: '请示上级明确指示后行动', effects: {background: 2, risk: 1, positionWeight: 1} },
      { text: '认为红色预警常有，等天亮再说', effects: {risk: 5, integrity: -3, reputation: -3} },
    ]},
    { id: 'e799', stage: 'work', eventType: 'choice', title: '婚俗改革试点', weight: 3, text: '民政部推进婚俗改革试点，你所在县被列为试点。有乡镇反映"零彩礼"倡议遇冷，婚介机构以"服务费"变相收取高额彩礼，群众意见不一。', pools: ['民政'], choices: [
      { text: '深入调研婚介乱象，依法规范婚介市场', effects: {integrity: 3, workAbility: 2, eq: 1, mentalPressure: 2} },
      { text: '组织集体婚礼等文明新风活动示范引领', effects: {eq: 2, workAbility: 2, peopleReputation: 2} },
      { text: '完善红白理事会章程，引导村民自治', effects: {workAbility: 2, eq: 2, background: 1} },
      { text: '先宣传倡导，再抓典型整治', effects: {workAbility: 2, reputation: 1, risk: 1} },
      { text: '试点工作走形式，交差了事', effects: {risk: 2, reputation: -2, integrity: -1} },
    ]},
    { id: 'e800', stage: 'work', eventType: 'choice', title: '基层减负观察', weight: 3, text: '督查发现部分村（社区）挂牌多、报表多、留痕要求高，基层干部疲于应付。上级部署整治形式主义为基层减负，你负责牵头抓落实。', pools: ['民政','基层单位'], choices: [
      { text: '清单化清理挂牌和报表，明确"凡无依据一律不得摊派"', effects: {integrity: 3, workAbility: 3, peopleReputation: 3, mentalPressure: 2} },
      { text: '深入基层暗访，掌握真实负担情况', effects: {workAbility: 2, eq: 1, reputation: 1} },
      { text: '协调部门精简考核指标，合并报表', effects: {workAbility: 2, iq: 2, background: 1} },
      { text: '树立减负正面典型，通报反面案例', effects: {reputation: 2, workAbility: 2, risk: 1} },
      { text: '发文要求减负，实际照旧', effects: {risk: 2, integrity: -2, reputation: -1} },
    ]},
    // ==================== v2.1.43 事件链系统：反腐链（4事件）====================
    { id: 'e801', stage: 'work', eventType: 'choice', title: '档案室里的异常', weight: 4, year: [28, 55], requireRankMin: 3, pools: ['public'], text: '你在整理旧档案时发现一摞未归入正常目录的票据复印件，涉及一位现任领导经手的采购项目。金额不大，但流程明显缺了几道签字。档案室老同事凑过来看了一眼，没说话，轻轻把门带上了。', choices: [
      { text: '整理后向纪委实名反映', effects: {integrity: 4, reputation: 1, risk: 5, mentalPressure: 3, flag: 'reportCorruption'} },
      { text: '先找当事人私下提醒，给彼此留余地', effects: {eq: 2, risk: 2, mentalPressure: 1, flag: 'warnCorruption'} },
      { text: '放回原处，就当从没见过', effects: {integrity: -3, mentalPressure: -2, risk: 1} },
    ]},
    { id: 'e802', stage: 'work', eventType: 'choice', title: '组织的问询', weight: 6, requireFlag: 'reportCorruption', pools: ['public'], text: '纪委的同志约你到一间小会议室。桌上摆着复印件，对方问得很客气："这些材料，你了解多少？愿意配合核实吗？"窗外走廊传来脚步声，你意识到这件事已经进了程序。', choices: [
      { text: '知无不言，配合组织调查', effects: {integrity: 5, reputation: 2, risk: 3, mentalPressure: 2, flag: 'probeCorruption'} },
      { text: '只说材料上看得见的内容', effects: {integrity: 2, reputation: 1, risk: 1, mentalPressure: 1, flag: 'probeCorruptionWeak'} },
      { text: '开始退缩，改口称记不清了', effects: {integrity: -4, reputation: -3, risk: 6, mentalPressure: 4} },
    ]},
    { id: 'e803', stage: 'work', eventType: 'auto', title: '风暴眼中的坚持', weight: 6, requireFlag: 'probeCorruption', pools: ['public'], text: '调查范围在扩大，被举报人通过各种渠道放出话来，说"有人想整人"。你的办公室电话突然多了起来，有些是打听消息的，有些是"关心"你前程的。你明白，自己已经站在了风口上。', effects: {mentalPressure: 5, risk: 4, reputation: 3, integrity: 2, flag: 'antiCorrStorm'} },
    { id: 'e804', stage: 'work', eventType: 'auto', title: '尘埃落定', weight: 6, requireFlag: 'antiCorrStorm', pools: ['public'], text: '案件终于查清，相关责任人受到组织处理。内部通报中特别提到"有关同志积极配合组织调查，体现了党员干部应有的觉悟"。你没有声张，但院里再开会时，你的位置悄悄往前挪了一排。', effects: {reputation: 6, integrity: 4, positionWeight: 3, mentalPressure: -6, flag: 'resolveCorruption'} },
    // ==================== v2.1.43 事件链系统：基层链（4事件）====================
    { id: 'e805', stage: 'work', eventType: 'choice', title: '选派下乡', weight: 5, year: [25, 45], pools: ['public'], text: '组织部下发挂职锻炼名单，你的名字在列——去一个偏远的乡镇挂职两年。同事有的羡慕"镀金"，有的同情"流放"，你看着窗外的梧桐树，知道这两年不会轻松。', choices: [
      { text: '主动请缨，把基层当课堂', effects: {workAbility: 3, reputation: 2, mentalPressure: 3, body: -1, flag: 'serveVillage'} },
      { text: '服从安排，平常心对待', effects: {workAbility: 2, mentalPressure: 2, flag: 'serveVillageReluctant'} },
      { text: '设法托人调去条件好一点的岗位', effects: {integrity: -2, reputation: -1, background: 1, mentalPressure: -1} },
    ]},
    { id: 'e806', stage: 'work', eventType: 'choice', title: '驻村第一难', weight: 6, requireFlag: 'serveVillage', pools: ['基层单位'], text: '到任不久，村里一桩征地遗留问题爆发。十几户村民堵在镇政府门口，要求重新补偿。前任干部留下的台账不全，镇领导看着你："你是市里派来的，这事你牵头。"', choices: [
      { text: '挨家挨户走访，把诉求一条条记下来', effects: {peopleReputation: 4, workAbility: 2, mentalPressure: 3, flag: 'villageDoorToDoor'} },
      { text: '争取上级政策支持，从资金缺口入手', effects: {background: 2, reputation: 2, workAbility: 1, flag: 'villagePolicy'} },
      { text: '先做稳控，承诺"研究研究"', effects: {risk: 2, reputation: -1, mentalPressure: -1} },
    ]},
    { id: 'e807', stage: 'work', eventType: 'choice', title: '村里的产业项目', weight: 6, requireFlag: 'villageDoorToDoor', pools: ['基层单位'], text: '村里要上一个特色种植项目，有人主张"大干快上、一季见效"，有人担心市场不稳、技术跟不上。村支书把方案推到你面前："你是挂职干部，你定。"', choices: [
      { text: '稳扎稳打，先小范围试点', effects: {peopleReputation: 3, workAbility: 2, integrity: 2, flag: 'villageSolid'} },
      { text: '树典型造亮点，争取上级观摩', effects: {reputation: 3, positionWeight: 2, risk: 2, flag: 'villageShowcase'} },
      { text: '按老规矩推进，出事再说不迟', effects: {integrity: -2, risk: 1, workAbility: -1} },
    ]},
    { id: 'e808', stage: 'work', eventType: 'auto', title: '归程与扎根', weight: 6, requireFlag: 'villageSolid', pools: ['基层单位'], text: '挂职期满，组织鉴定写得实在："能沉下心、敢碰硬事、群众认可度较高。"离任那天，几位老乡特意到路口送行，塞给你一兜自家种的菜。你推辞不过，接过来时心里一热。', effects: {peopleReputation: 5, reputation: 3, positionWeight: 2, background: 3, mentalPressure: -3, flag: 'villageLegacy'} },
];
