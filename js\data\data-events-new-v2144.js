// ===== v2.1.44 小系统专属池扩展包 =====
// id 范围：enw173~enw196（24条） | 装配：js/data/data.js → GameData.events | v2.1.66 头注释标准化（分类学见 docs/architecture/EVENT-SYSTEM-ARCHITECTURE.md）
// 定位：政府/垂管/宣传/网信系统专属事件补强
// 重点补充政府系统、垂管系统、宣传系统、网信系统专属事件，提升小系统玩家体验。
const gd_events_new_v2144 = [
  // ---------- 政府系统专属池（6个）----------
  { id: 'enw173', stage: 'work', eventType: 'choice', weight: 5, title: '领导批示件督办（限期办结）', pools: ['政府系统'], text: '市领导对一件久拖不决的民生诉求作出批示，要求限期办结。你负责跟踪督办，牵头单位却以各种理由推迟。', choices: [
    { text: '每日调度，逐项核实进展', effects: {workAbility: 3, reputation: 2, mentalPressure: 3} },
    { text: '发正式督办函，抄送分管领导', effects: {positionWeight: 2, workAbility: 2, risk: 1} },
    { text: '上门蹲点，现场推动办结', effects: {workAbility: 3, peopleReputation: 2, body: -1, mentalPressure: 2} },
    { text: '提醒牵头单位注意时限，留痕即可', effects: {mentalPressure: -1, risk: 2, workAbility: 1} },
  ]},
  { id: 'enw174', stage: 'work', eventType: 'choice', weight: 5, title: '常务会议题协调', pools: ['政府系统'], text: '常务会要审议十多个议题，两个部门因为一个项目的牵头单位争执不下，会议材料到你这里时已晚。', choices: [
    { text: '连夜召集双方协商，争取会前统一', effects: {workAbility: 3, eq: 2, mentalPressure: 4} },
    { text: '按惯例由排序在前的部门牵头', effects: {workAbility: 2, risk: 1, mentalPressure: 1} },
    { text: '建议领导先不分牵头，明确分工即可', effects: {eq: 1, workAbility: 2, mentalPressure: 2} },
    { text: '把争议写进上会说明，请领导定夺', effects: {positionWeight: -1, mentalPressure: -1, risk: -1} },
  ]},
  { id: 'enw175', stage: 'work', eventType: 'choice', weight: 5, title: '政务信息报送', pools: ['政府系统'], text: '上级约稿要求报送本地创新做法，可你手头能写的经验并不多。分管领导说："没有亮点就造一个。"', choices: [
    { text: '把一项常规工作提炼成"试点经验"', effects: {workAbility: 2, positionWeight: 1, risk: 2} },
    { text: '如实报问题，顺便要政策支持', effects: {integrity: 3, background: 2, positionWeight: -1} },
    { text: '找基层要一个真实案例包装', effects: {workAbility: 2, peopleReputation: 1, mentalPressure: 2} },
    { text: '拖延交稿，等兄弟单位稿子参考', effects: {background: 1, mentalPressure: -1, risk: 1} },
  ]},
  { id: 'enw176', stage: 'work', eventType: 'choice', weight: 4, title: '总值班室应急', pools: ['政府系统'], text: '深夜值班，突发一起安全事故的紧急信息。主要领导在外地，值班电话一时联系不上。', choices: [
    { text: '立即按预案启动应急响应，同步上报', effects: {workAbility: 3, reputation: 2, mentalPressure: 3, risk: -2} },
    { text: '先核实情况再报，避免信息反转', effects: {integrity: 2, workAbility: 1, mentalPressure: 2, risk: 1} },
    { text: '等联系上主要领导再作决定', effects: {mentalPressure: -1, risk: 3} },
    { text: '按程序层层报告，不擅自越权', effects: {integrity: 1, positionWeight: -1, risk: 2} },
  ]},
  { id: 'enw177', stage: 'work', eventType: 'choice', weight: 5, title: '文件会签僵局', pools: ['政府系统'], text: '一份政府规范性文件进入会签程序，两个部门对一条款各执一词，会签单在你桌上压了半个月。', choices: [
    { text: '分别约谈两部门负责人，找最大公约数', effects: {eq: 2, workAbility: 3, mentalPressure: 2} },
    { text: '提请分管副秘书长出面协调', effects: {background: 2, mentalPressure: -1, positionWeight: 1} },
    { text: '按多数部门意见定稿，少数意见附注', effects: {workAbility: 2, risk: 1, eq: -1} },
    { text: '继续压一压，等有一方主动让步', effects: {mentalPressure: -2, risk: 2, workAbility: -1} },
  ]},
  { id: 'enw178', stage: 'work', eventType: 'choice', weight: 4, title: '督查督办回访', pools: ['政府系统'], text: '去年督查发现的问题，今年"回头看"发现个别单位整改流于形式。领导让你带队再查。', choices: [
    { text: '逐项对照整改清单，该约谈的约谈', effects: {integrity: 3, workAbility: 3, peopleReputation: -1, mentalPressure: 2} },
    { text: '重点抽查两项，其余写"总体推进中"', effects: {workAbility: 1, mentalPressure: -1, risk: 2} },
    { text: '邀请媒体参与，放大回访效应', effects: {reputation: 3, risk: 2, workAbility: 1} },
    { text: '建议把整改纳入年度考核', effects: {positionWeight: 2, workAbility: 2, background: 1} },
  ]},

  // ---------- 垂管系统专属池（6个）----------
  { id: 'enw179', stage: 'work', eventType: 'choice', weight: 5, title: '出口退税审核', pools: ['垂管系统'], text: '一批出口退税申请存在疑点，企业催得急，上级要求从严审核。你手里的证据链还不完整。', choices: [
    { text: '发函要求企业补充材料，严格把关', effects: {integrity: 3, workAbility: 2, peopleReputation: -1, mentalPressure: 2} },
    { text: '先退一部分，疑点部分暂缓', effects: {workAbility: 2, eq: 1, risk: 1} },
    { text: '提请跨部门协查，查清资金流', effects: {workAbility: 3, background: 1, mentalPressure: 3} },
    { text: '按程序正常退，避免被投诉', effects: {mentalPressure: -1, risk: 2, integrity: -1} },
  ]},
  { id: 'enw180', stage: 'work', eventType: 'choice', weight: 5, title: '发票电子化推广', pools: ['垂管系统'], text: '全面数字化电子发票推广到关键阶段，部分老会计抱怨系统难用，企业抵触情绪明显。', choices: [
    { text: '组织专场培训，手把手教操作', effects: {peopleReputation: 3, workAbility: 2, mentalPressure: 2} },
    { text: '上线咨询热线，分流问题', effects: {eq: 1, workAbility: 2, mentalPressure: 1} },
    { text: '按节点强制切换，不设过渡期', effects: {workAbility: 1, peopleReputation: -2, positionWeight: 1, risk: 2} },
    { text: '申请延期试点，给企业缓冲', effects: {peopleReputation: 2, background: 1, positionWeight: -1} },
  ]},
  { id: 'enw181', stage: 'work', eventType: 'choice', weight: 5, title: '风险纳税人应对', pools: ['垂管系统'], text: '系统预警一户重点企业存在虚开风险，但这家企业是本地纳税大户，关系复杂。', choices: [
    { text: '依法立案检查，不因其身份特殊而放行', effects: {integrity: 4, risk: 3, workAbility: 3, mentalPressure: 3} },
    { text: '先约谈法人，给予自查补税机会', effects: {workAbility: 2, eq: 2, risk: 1} },
    { text: '向上级请示，争取异地稽查', effects: {background: 2, risk: -1, mentalPressure: 1} },
    { text: '以"证据不足"为由暂不移交', effects: {risk: 4, integrity: -3, mentalPressure: -1} },
  ]},
  { id: 'enw182', stage: 'work', eventType: 'choice', weight: 4, title: '系统练兵比武（垂管专场）', pools: ['垂管系统'], text: '垂管系统组织业务练兵比武，成绩挂钩单位和个人评优。你被推荐参赛，但准备时间很短。', choices: [
    { text: '挤出时间集中刷题、模拟演练', effects: {workAbility: 3, iq: 1, mentalPressure: 3, reputation: 2} },
    { text: '平常心参加，不刻意冲刺', effects: {mentalPressure: -1, workAbility: 1} },
    { text: '找往年题库和获奖选手取经', effects: {background: 2, workAbility: 2, mentalPressure: 1} },
    { text: '以工作太忙为由推掉名额', effects: {reputation: -1, mentalPressure: -2} },
  ]},
  { id: 'enw183', stage: 'work', eventType: 'choice', weight: 5, title: '跨区域协查', pools: ['垂管系统'], text: '外省发来协查函，涉及本地一户企业的异常交易。对方要求限时回复，但你这边档案不齐。', choices: [
    { text: '协调征管科室连夜补档案，按期回复', effects: {workAbility: 3, reputation: 2, mentalPressure: 3} },
    { text: '请求延期，说明客观困难', effects: {eq: 1, mentalPressure: -1, reputation: -1} },
    { text: '先按现有材料回复，后续补充', effects: {workAbility: 1, risk: 2, mentalPressure: 1} },
    { text: '请对方提供更多线索再查', effects: {background: 1, workAbility: 1, mentalPressure: -1} },
  ]},
  { id: 'enw184', stage: 'work', eventType: 'choice', weight: 4, title: '垂管新政策培训', pools: ['垂管系统'], text: '总局新征管政策下发，基层分局理解不一。你被抽调去巡回宣讲，要在一周内跑三个县。', choices: [
    { text: '先吃透政策，结合案例讲透难点', effects: {workAbility: 3, iq: 1, reputation: 2, body: -1} },
    { text: '按文件原文念，不加入个人理解', effects: {mentalPressure: -1, workAbility: 1, risk: 1} },
    { text: '制作通俗课件，重点讲操作口径', effects: {workAbility: 2, peopleReputation: 2, mentalPressure: 2} },
    { text: '推给业务骨干去讲，自己负责汇总', effects: {eq: 1, mentalPressure: -2, workAbility: -1} },
  ]},

  // ---------- 宣传系统专属池（6个）----------
  { id: 'enw185', stage: 'work', eventType: 'choice', weight: 5, title: '新媒体运营考核', pools: ['宣传'], text: '单位政务新媒体账号粉丝增长乏力，季度考核排名靠后。领导要求"想办法破圈"。', choices: [
    { text: '策划一期接地气的政策解读短视频', effects: {workAbility: 3, peopleReputation: 2, risk: 1, mentalPressure: 2} },
    { text: '蹭热点但严守口径，小心翼翼', effects: {workAbility: 2, reputation: 1, risk: 2} },
    { text: '购买推广资源，数据先做起来', effects: {background: 1, positionWeight: 1, risk: 2} },
    { text: '坚持内容为王，不刻意追流量', effects: {integrity: 2, workAbility: 1, mentalPressure: -1} },
  ]},
  { id: 'enw186', stage: 'work', eventType: 'choice', weight: 5, title: '理论宣讲下基层（村民提问）', pools: ['宣传'], text: '你被安排到基层宣讲最新理论。台下坐的是村民，有人直接问："讲这些能帮我们多挣多少钱？"', choices: [
    { text: '把理论和惠农政策结合起来讲', effects: {peopleReputation: 3, workAbility: 2, eq: 1, mentalPressure: 2} },
    { text: '按计划讲完，不深究反响', effects: {workAbility: 1, mentalPressure: -1} },
    { text: '请基层干部分享案例，你负责串讲', effects: {eq: 2, workAbility: 2, peopleReputation: 1} },
    { text: '加几个段子活跃气氛', effects: {eq: 1, reputation: 1, risk: 2} },
  ]},
  { id: 'enw187', stage: 'work', eventType: 'choice', weight: 4, title: '形象宣传片拍摄', pools: ['宣传'], text: '上级要求制作一部城市形象宣传片，预算紧、时间更紧。拍摄团队建议"多拍领导镜头"。', choices: [
    { text: '坚持群众和基层场景为主', effects: {peopleReputation: 3, integrity: 2, workAbility: 2} },
    { text: '平衡领导出镜与百姓故事', effects: {workAbility: 2, eq: 2, positionWeight: 1} },
    { text: '按团队建议，领导镜头给足', effects: {positionWeight: 2, risk: 1, peopleReputation: -1} },
    { text: '砍掉外景，用素材剪一版省钱', effects: {mentalPressure: -2, workAbility: -1, risk: 1} },
  ]},
  { id: 'enw188', stage: 'work', eventType: 'choice', weight: 5, title: '重大主题宣传策划', pools: ['宣传'], text: '一个重大主题宣传季即将来临，各部门都在争取版面。宣传口内部也在为谁上首页争论。', choices: [
    { text: '统筹版面，按工作权重科学分配', effects: {workAbility: 3, eq: 1, mentalPressure: 3} },
    { text: '优先报道主要领导活动', effects: {positionWeight: 2, risk: 1, peopleReputation: -1} },
    { text: '多留版面给基层典型', effects: {peopleReputation: 3, integrity: 2, positionWeight: -1} },
    { text: '让各部门各自供稿，按来稿先后排', effects: {mentalPressure: -2, workAbility: 1, risk: 1} },
  ]},
  { id: 'enw189', stage: 'work', eventType: 'choice', weight: 5, title: '舆情处置演练（视频风波）', pools: ['宣传'], text: '网信办组织突发事件舆情处置演练，你所在单位被抽中。演练设定：一段断章取义的视频被大量转发。', choices: [
    { text: '半小时内拿出通报口径和事实核查', effects: {workAbility: 3, reputation: 2, mentalPressure: 2} },
    { text: '先联系平台降热，再慢慢核实', effects: {risk: 2, background: 1, workAbility: 1} },
    { text: '请第三方专家发声，转移焦点', effects: {background: 2, risk: 2, reputation: 1} },
    { text: '按模板写回应，演练走个过场', effects: {mentalPressure: -2, workAbility: -1, risk: 1} },
  ]},
  { id: 'enw190', stage: 'work', eventType: 'choice', weight: 4, title: '对外宣传口径', pools: ['宣传'], text: '一个敏感项目引发外媒关注，上级要求统一对外口径。你起草的通稿被领导批"太硬"。', choices: [
    { text: '加一段背景介绍，把"硬话"包起来', effects: {workAbility: 3, eq: 1, mentalPressure: 2} },
    { text: '请外宣专家把关，调整措辞', effects: {workAbility: 2, background: 2, mentalPressure: 1} },
    { text: '坚持原则表述，不媚外', effects: {integrity: 2, positionWeight: 1, risk: 2} },
    { text: '尽量淡化处理，减少曝光', effects: {risk: 1, mentalPressure: -1, reputation: -1} },
  ]},

  // ---------- 网信系统专属池（6个）----------
  { id: 'enw191', stage: 'work', eventType: 'choice', weight: 5, title: '内容审核尺度', pools: ['网信办'], text: '政务新媒体后台收到一条热门留言，言辞激烈但反映的问题属实。审核员问你放不放。', choices: [
    { text: '放行，但做好线下核实和回应', effects: {peopleReputation: 3, integrity: 2, workAbility: 2, risk: 1} },
    { text: '屏蔽过激词汇后放行', effects: {workAbility: 2, peopleReputation: 1, risk: -1} },
    { text: '暂时隐藏，等事件平息', effects: {risk: 2, peopleReputation: -1, mentalPressure: -1} },
    { text: '转交业务部门私信回复', effects: {eq: 1, workAbility: 1, peopleReputation: 1} },
  ]},
  { id: 'enw192', stage: 'work', eventType: 'choice', weight: 5, title: '网络谣言处置', pools: ['网信办'], text: '一则关于本地公共设施的谣言在微信群扩散，部分群众开始恐慌性抢购。领导要求尽快处置。', choices: [
    { text: '第一时间发布权威通报辟谣', effects: {reputation: 3, workAbility: 3, peopleReputation: 2, mentalPressure: 2} },
    { text: '协调平台限流，同时线下核查', effects: {workAbility: 2, background: 1, risk: 1} },
    { text: '请本地自媒体大V转发辟谣', effects: {background: 2, reputation: 1, risk: 2} },
    { text: '等舆情自然消退，避免二次传播', effects: {risk: 3, reputation: -2, mentalPressure: -1} },
  ]},
  { id: 'enw193', stage: 'work', eventType: 'choice', weight: 4, title: '政务新媒体矩阵', pools: ['网信办'], text: '你要推动各部门政务账号入驻统一矩阵，但不少单位嫌麻烦，只想维持自己的"自留地"。', choices: [
    { text: '纳入年度考核，统一运维培训', effects: {workAbility: 3, positionWeight: 2, eq: -1, mentalPressure: 2} },
    { text: '先试点几个积极性高的单位', effects: {workAbility: 2, eq: 2, peopleReputation: 1} },
    { text: '提供统一内容模板，降低运营成本', effects: {workAbility: 2, background: 1, mentalPressure: 1} },
    { text: '不强求，顺其自然', effects: {mentalPressure: -2, positionWeight: -1} },
  ]},
  { id: 'enw194', stage: 'work', eventType: 'choice', weight: 5, title: '网络安全演练', pools: ['网信办'], text: '网络安全攻防演练中，你所在单位的一个对外系统被发现漏洞。技术科说修补需要停服三天。', choices: [
    { text: '立即协调临时补丁，优先堵住漏洞', effects: {workAbility: 3, risk: -2, reputation: 1, mentalPressure: 3} },
    { text: '安排夜间窗口紧急升级', effects: {workAbility: 2, mentalPressure: 2, risk: -1} },
    { text: '按常规排期修复，先写情况说明', effects: {risk: 2, mentalPressure: -1, workAbility: 1} },
    { text: '要求技术外包团队限期整改', effects: {background: 1, workAbility: 1, mentalPressure: 1} },
  ]},
  { id: 'enw195', stage: 'work', eventType: 'choice', weight: 4, title: '数据泄露预警', pools: ['网信办'], text: '监测发现疑似本地政务数据在暗网流转。信息来源不明，但涉及公民个人信息。', choices: [
    { text: '启动应急预案，通报公安和上级网信', effects: {integrity: 3, workAbility: 3, risk: -2, mentalPressure: 3} },
    { text: '先内部排查，确认泄露范围再上报', effects: {workAbility: 2, risk: 1, mentalPressure: 2} },
    { text: '请第三方安全公司介入溯源', effects: {background: 2, workAbility: 2, mentalPressure: 1} },
    { text: '信息来源不明，暂不惊动领导', effects: {risk: 4, integrity: -2, mentalPressure: -1} },
  ]},
  { id: 'enw196', stage: 'work', eventType: 'choice', weight: 5, title: '短视频平台政务号', pools: ['网信办'], text: '领导要求开通短视频平台政务号，但平台调性偏娱乐，同事担心"掉价"。', choices: [
    { text: '用年轻化表达做政策解读，保持专业性', effects: {workAbility: 3, peopleReputation: 2, risk: 1, mentalPressure: 2} },
    { text: '只做通知类内容，不追热点', effects: {workAbility: 1, integrity: 1, mentalPressure: -1} },
    { text: '外包给MCN机构运营', effects: {background: 1, risk: 3, workAbility: -1} },
    { text: '建议暂缓，等平台政务生态成熟', effects: {positionWeight: -1, mentalPressure: -1, eq: 1} },
  ]},
];
