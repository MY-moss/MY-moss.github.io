// ===== v2.1.55 接待主题包 =====
// id 范围：enw219~enw230（12条） | 装配：js/data/data.js → GameData.events | v2.1.66 头注释标准化（分类学见 docs/architecture/EVENT-SYSTEM-ARCHITECTURE.md）
// 定位：公务接待与会务场景，补足接待类稀缺缺口
// 补足接待类稀缺缺口（v2.1.54 部门化分析：20/1015），覆盖上级检查、同行取经、会务后勤、
// 接待纪律（八项规定 flavor）、媒体接待等场景，pools 复用现有关键词。
const gd_events_new_v2155 = [
  { id: 'enw219', stage: 'work', eventType: 'choice', weight: 4, title: '检查团提前抵达', pools: ['public'], text: '上级检查团临时通知：明早提前一天到。汇报材料还差三分之一，汇报人正在外地出差，接待方案没定稿。', choices: [
    { text: '连夜加班补材料，电话召回汇报人', effects: {workAbility: 3, mentalPressure: 3, body: -1} },
    { text: '按现有进度如实汇报，不赶工', effects: {integrity: 2, mentalPressure: -1, reputation: 1} },
    { text: '先稳住接待方案，材料边陪边补', effects: {eq: 2, workAbility: 2, mentalPressure: 2} },
    { text: '请示延期，走正式流程报备', effects: {background: 1, positionWeight: -1, mentalPressure: -1} },
  ]},
  { id: 'enw220', stage: 'work', eventType: 'choice', weight: 4, title: '同行来取经', pools: ['public'], text: '兄弟单位听说你们改革出了成效，组队前来学习。对方开门见山想要全套制度文本和操作细则，科里有人主张“留一手”。', choices: [
    { text: '倾囊相授，顺带结成对口交流关系', effects: {reputation: 2, eq: 2, background: 1, peopleReputation: 1} },
    { text: '讲思路不给细则，点到为止', effects: {eq: 1, mentalPressure: -1, background: -1} },
    { text: '趁机请对方介绍他们的短板案例，互通有无', effects: {iq: 2, workAbility: 2, eq: 1} },
    { text: '让办公室按标准流程应付', effects: {workAbility: -1, reputation: -1, mentalPressure: -1} },
  ]},
  { id: 'enw221', stage: 'work', eventType: 'choice', weight: 3, title: '会务预算告急', pools: ['public'], text: '全区现场会定在你们单位开，预算却比往年砍了三成。会务公司报价、场地布置、材料印制样样要钱。', choices: [
    { text: '能省则省，一切从简按标准来', effects: {integrity: 3, reputation: 1, mentalPressure: 2} },
    { text: '拉赞助找企业支持，打擦边球', effects: {wealth: 2, risk: 4, integrity: -2} },
    { text: '向财务部门申请专项追加', effects: {workAbility: 1, background: 1, mentalPressure: 1} },
    { text: '压缩规模，砍一半参会人数', effects: {workAbility: 2, peopleReputation: -1, mentalPressure: 1} },
  ]},
  { id: 'enw222', stage: 'work', eventType: 'choice', weight: 4, title: '接待菜单超标', pools: ['public'], text: '上级领导来调研，办公室按惯例订了桌规格偏高的接待餐。你翻到菜单时看到几个菜明显超出公务接待标准。', choices: [
    { text: '当场撤掉超标菜品，按标准重排', effects: {integrity: 3, reputation: 1, risk: -2, mentalPressure: 1} },
    { text: '默不作声，就当没看见', effects: {risk: 3, integrity: -2, mentalPressure: 1} },
    { text: '私下找办公室换成工作餐', effects: {integrity: 2, eq: 1, mentalPressure: -1} },
    { text: '保留菜品，票据做成合规样子', effects: {risk: 5, integrity: -3, heat: 2} },
  ]},
  { id: 'enw223', stage: 'work', eventType: 'choice', weight: 4, title: '下班前的堵门人', pools: ['窗口部门', '民生部门'], text: '临近下班，一位群众情绪激动地堵在门口，反映的问题不属于你们科室管，但他声称“今天不给说法就不走”。', choices: [
    { text: '留下来听完，帮忙指清该找的部门', effects: {peopleReputation: 3, eq: 2, mentalPressure: 2} },
    { text: '按首问负责制登记转办，明早跟进', effects: {workAbility: 2, integrity: 1, peopleReputation: 1} },
    { text: '让他去找对口的单位，指好路', effects: {mentalPressure: -1, peopleReputation: -1} },
    { text: '叫保安劝离，避免影响下班', effects: {peopleReputation: -3, reputation: -1, mentalPressure: -1} },
  ]},
  { id: 'enw224', stage: 'work', eventType: 'choice', weight: 3, title: '经验材料被索要', pools: ['政府系统', '党委系统'], text: '考察团点名要你们“压箱底”的整改台账原件，说回去要好向上级汇报。那份台账里有些数据一旦外传，容易引起误读。', choices: [
    { text: '提供脱敏汇编版，说明保留原因', effects: {integrity: 2, workAbility: 2, eq: 2} },
    { text: '全盘提供，显示坦荡', effects: {reputation: 2, risk: 2, workAbility: -1} },
    { text: '以涉密为由婉拒，只做口头介绍', effects: {integrity: 1, risk: -1, background: -1} },
    { text: '请示分管领导再定，不背责任', effects: {mentalPressure: -1, positionWeight: -1, background: 1} },
  ]},
  { id: 'enw225', stage: 'work', eventType: 'choice', weight: 3, title: '视察动线之争', pools: ['政府系统', '党委系统'], text: '领导来视察的路线方案有两版：一版走“示范点”，干净漂亮；一版走“问题点”，真实但有风险。分管领导让你拿方案。', choices: [
    { text: '走问题点，借视察推动解决', effects: {workAbility: 3, peopleReputation: 2, risk: 2, mentalPressure: 3} },
    { text: '走示范点，稳妥为主', effects: {positionWeight: 1, mentalPressure: -1, peopleReputation: -1} },
    { text: '示范点+问题点各安排一半', effects: {workAbility: 2, eq: 2, mentalPressure: 2} },
    { text: '按领导秘书暗示的路线走', effects: {background: 2, integrity: -1, peopleReputation: -1} },
  ]},
  { id: 'enw226', stage: 'work', eventType: 'choice', weight: 3, title: '接待物资缺口', pools: ['基层单位', '机关'], text: '考察团明天到，会议室的饮用水和纸杯备货不够，镇上商店已关门，财务流程来不及走。', choices: [
    { text: '自掏腰包先垫上，回头补手续', effects: {wealth: -3, peopleReputation: 1, integrity: 1} },
    { text: '向邻站兄弟单位临时借用', effects: {eq: 2, workAbility: 1, background: 1} },
    { text: '调整议程，压缩会务消耗', effects: {workAbility: 2, mentalPressure: 1} },
    { text: '硬撑着不用，反正不算大事', effects: {reputation: -2, mentalPressure: 1} },
  ]},
  { id: 'enw227', stage: 'work', eventType: 'choice', weight: 3, title: '记者突然到访', pools: ['宣传', '窗口部门'], text: '一位记者没打招呼就到了大厅，举着工作证要就群众反映的办事难问题采访一线人员。同事下意识往后躲。', choices: [
    { text: '亮明身份接待，安排宣传口对接', effects: {workAbility: 2, reputation: 2, eq: 1} },
    { text: '请记者走正式采访函流程', effects: {integrity: 1, workAbility: 1, mentalPressure: -1} },
    { text: '自己接受采访，如实说明整改计划', effects: {reputation: 3, risk: 2, eq: 2} },
    { text: '让保安请离，避免节外生枝', effects: {reputation: -3, peopleReputation: -2, risk: 2} },
  ]},
  { id: 'enw228', stage: 'work', eventType: 'choice', weight: 3, title: '盆景式参观点', pools: ['执法部门', '政府部门'], text: '陪同上级实地考察，地方精心布置了“示范点位”，但你沿途看到几个真实问题被围挡挡得严严实实。', choices: [
    { text: '如实向考察组反映围挡外的情况', effects: {integrity: 3, peopleReputation: 3, risk: 3, background: -1} },
    { text: '保留意见，考察后书面报告', effects: {integrity: 2, workAbility: 1, mentalPressure: 1} },
    { text: '照常陪同，完成接待任务', effects: {mentalPressure: -1, positionWeight: 1, integrity: -1} },
    { text: '私下提醒考察组注意路线外情况', effects: {eq: 2, integrity: 1, background: -1} },
  ]},
  { id: 'enw229', stage: 'work', eventType: 'choice', weight: 3, title: '接待票据不全', pools: ['垂管系统', '政府部门'], text: '季度报销时，几张公务接待票据缺少公函和审批单，财务退回。经办同事央求你“通融一下，下次补齐”。', choices: [
    { text: '一律按制度退回补齐，不搞例外', effects: {integrity: 3, reputation: 1, eq: -1} },
    { text: '帮着梳理补正路径，限期整改', effects: {workAbility: 2, eq: 2, integrity: 1} },
    { text: '签个字先过，下不为例', effects: {risk: 4, integrity: -3, mentalPressure: -1} },
    { text: '上报分管领导定夺', effects: {background: 1, positionWeight: -1, mentalPressure: 1} },
  ]},
  { id: 'enw230', stage: 'work', eventType: 'choice', weight: 3, title: '大会材料错页', pools: ['机关', '政府系统'], text: '全区大会开场前二十分钟，发现三分之一的会议材料第 7 页和第 8 页装订颠倒了，与会领导已陆续入场。', choices: [
    { text: '当机立断全场换发，解释情况', effects: {workAbility: 3, mentalPressure: 3, reputation: 1} },
    { text: '只给主席台换，台下说明勘误', effects: {eq: 2, workAbility: 1, mentalPressure: 1} },
    { text: '散会补发勘误页，现场先讲', effects: {workAbility: 1, mentalPressure: -1, reputation: -1} },
    { text: '把责任先算到印厂头上再说', effects: {eq: -2, reputation: -1, mentalPressure: 1} },
  ]},
];