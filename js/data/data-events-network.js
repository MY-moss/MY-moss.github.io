// ===== 人脉专属事件链 =====
// id 范围：net001~net036（36条） | 装配：js/data/data.js → GameData.events | v2.1.66 头注释标准化（分类学见 docs/architecture/EVENT-SYSTEM-ARCHITECTURE.md）
// 定位：导师→桥接→正式推荐→生命周期/回避/传承；仅稳定联系人引用与 contactDelta
// 人脉主玩法首批事件链：导师 → 桥接 → 正式推荐 → 生命周期/回避/传承。
// 事件只使用稳定联系人引用和 contactDelta/contactEvolution，不上传联系人文本到运营端。
var gd_events_network = [
  { id: 'net001', stage: 'work', eventType: 'choice', weight: 7, requireContactArchetype: 'mentor', requireContactMin: 25, title: '导师的边界', text: '那位前辈把你留下来谈了谈：真正能走远的关系，不是逢迎，而是彼此知道什么能帮、什么不能碰。', choices: [
    { text: '认真请教，先把工作做出结果', effects: { workAbility: 2, contactDelta: { target: 'archetype:mentor', relation: 3, trust: 5, reciprocity: 3 }, flag: 'netMentorTrust' } },
    { text: '先打听“有没有更快的路”', effects: { background: 2, contactDelta: { target: 'archetype:mentor', relation: 2, trust: -2, favorDebt: 5 }, flag: 'netMentorShortcut', risk: 2 } },
    { text: '保持距离，按程序办事', effects: { integrity: 2, reputation: 1, contactDelta: { target: 'archetype:mentor', relation: -2, trust: 1 }, flag: 'netMentorBoundary' } }
  ] },
  { id: 'net002', stage: 'work', eventType: 'choice', weight: 7, requireFlag: 'netMentorTrust', title: '跨部门的第一次协作', text: '导师把你介绍给另一个系统的业务骨干。对方手上有信息，你手上有一线经验，谁都不愿意先把底牌亮出来。', choices: [
    { text: '把需求和边界写进协作清单', effects: { contact: { id: 'net_bridge', name: '林处长', relation: 28, trust: 38, reciprocity: 20, influence: 58, access: 60, archetype: 'bridge', roles: ['bridge', 'peer'], position: '跨部门业务骨干', positionLevel: 2, organization: { system: '跨部门', tier: 2, region: 'current' } }, workAbility: 3, reputation: 2, flag: 'netBridgeContact' } },
    { text: '只交换对自己有用的消息', effects: { contact: { id: 'net_bridge', name: '林处长', relation: 20, trust: 25, reciprocity: 8, influence: 55, access: 55, archetype: 'bridge', roles: ['bridge'], position: '跨部门业务骨干', positionLevel: 2, organization: { system: '跨部门', tier: 2, region: 'current' } }, background: 2, risk: 2, flag: 'netBridgeContact' } },
    { text: '婉拒介绍，先把本单位事务做稳', effects: { workAbility: 1, integrity: 1, mentalPressure: -1, flag: 'netBridgeDeclined' } }
  ] },
  { id: 'net003', stage: 'work', eventType: 'choice', weight: 7, requireFlag: 'netBridgeContact', requireContact: 'net_bridge', requireContactMin: 20, title: '桥接关系的第一次考验', text: '两家单位在项目口径上出现分歧。林处长希望你“灵活一点”，但会议纪要和群众诉求都摆在桌面上。', choices: [
    { text: '公开口径、共同署名，按程序推进', effects: { workAbility: 3, reputation: 3, integrity: 2, contactDelta: { target: 'net_bridge', relation: 5, trust: 6, reciprocity: 5 }, flag: 'netBridgeCollaborate' } },
    { text: '先私下协调，把麻烦压下去', effects: { background: 3, mentalPressure: -1, contactDelta: { target: 'net_bridge', relation: 4, trust: -2, favorDebt: 8 }, flag: 'netBridgeShortcut', risk: 4 } },
    { text: '不参与争议，等上级定调', effects: { risk: -1, positionWeight: -1, contactDelta: { target: 'net_bridge', relation: -4, reciprocity: -2 }, flag: 'netBridgeCold' } }
  ] },
  { id: 'net004', stage: 'work', eventType: 'choice', weight: 6, requireFlag: 'netBridgeCollaborate', requireContact: 'net_bridge', requireContactMinTrust: 40, title: '有人愿意推荐你', text: '年度考察前，桥接联系人说可以在正式程序中介绍你的项目成果。推荐能让信息被看见，却不能替你补齐资历和实绩。', choices: [
    { text: '接受正式推荐，材料和程序一项不省', effects: { reputation: 3, positionWeight: 2, contactDelta: { target: 'net_bridge', trust: 4, reciprocity: 3, favorDebt: 3 }, flag: 'netFormalRecommendation' } },
    { text: '请他再多打几个招呼', effects: { background: 5, positionWeight: 3, contactDelta: { target: 'net_bridge', trust: -3, favorDebt: 14 }, risk: 5, flag: 'netPrivateRecommendation' } },
    { text: '谢绝推荐，等自己积累够了再说', effects: { integrity: 2, workAbility: 2, contactDelta: { target: 'net_bridge', relation: -2 }, flag: 'netSelfReliance' } }
  ] },
  { id: 'net005', stage: 'work', eventType: 'choice', weight: 6, requireFlag: 'netFormalRecommendation', requireContact: 'net_bridge', title: '推荐之后的民主评价', text: '考察组分别找同事、服务对象和协作单位谈话。有人记得你的项目，也有人只记得你曾经找谁递过话。', choices: [
    { text: '如实说明推荐关系，接受多方评价', effects: { reputation: 4, peopleReputation: 3, integrity: 3, workAbility: 2, flag: 'netOpenEvaluation' } },
    { text: '把功劳都归到推荐人身上', effects: { background: 2, contactDelta: { target: 'net_bridge', favorDebt: 8, reciprocity: 2 }, mentalPressure: 3, flag: 'netCreditBorrowed' } },
    { text: '担心争议，主动退出这次竞争', effects: { mentalPressure: -2, desire: -2, contactDelta: { target: 'net_bridge', trust: 1 }, flag: 'netWithdrawn' } }
  ] },
  { id: 'net006', stage: 'work', eventType: 'auto', weight: 5, requireFlag: 'netOpenEvaluation', title: '推荐不能替代实绩', text: '组织谈话结束了。推荐让你的项目进入了视野，但最终意见仍写着：看工作实绩、群众认可和廉洁表现。你第一次真正理解了“有人看见”和“能被任用”的区别。', effects: { workAbility: 2, reputation: 2, positionWeight: 1, flag: 'netRecommendationResult' } },
  { id: 'net007', stage: 'work', eventType: 'auto', weight: 5, requireFlag: 'netBridgeCollaborate', requireContact: 'net_bridge', requireContactMin: 35, title: '桥接人升任要职', text: '林处长调任到更重要的岗位。关系并没有自动变成“通行证”：他更忙了，但跨部门信息和正式协作的质量都提高了。', effects: { contactEvolution: { target: 'net_bridge', position: '市级跨部门协调处负责人', positionLevel: 3, influence: 78, access: 48, evolutionStage: 1, addRoles: ['sponsor'], message: '升任跨部门协调处负责人，影响力上升但更难约到' }, contactDelta: { target: 'net_bridge', trust: 3, access: -5 }, flag: 'netBridgePromoted' } },
  { id: 'net008', stage: 'life', eventType: 'choice', weight: 5, requireContactArchetype: 'mentor', requireContactMinTrust: 55, year: [35, 65], title: '前辈的传承请求', text: '前辈年纪大了，手里还压着一套多年积累的工作方法。他问你愿不愿意带年轻人一起做，而不是只把这套东西变成自己的履历。', choices: [
    { text: '带着下属共同完成，留下可传承的制度', effects: { workAbility: 3, reputation: 3, peopleReputation: 3, contactDelta: { target: 'archetype:mentor', reciprocity: 7, trust: 4 }, flag: 'netMentorLegacy' } },
    { text: '先把成果写进自己的材料', effects: { positionWeight: 3, background: 2, contactDelta: { target: 'archetype:mentor', favorDebt: 5, trust: -3 }, flag: 'netMentorCredit' } },
    { text: '婉拒，专注当前岗位', effects: { mentalPressure: -2, contactDelta: { target: 'archetype:mentor', relation: -3 }, flag: 'netMentorDeclined' } }
  ] },
  { id: 'net009', stage: 'life', eventType: 'auto', weight: 4, requireContactArchetype: 'mentor', requireContactStatus: 'active', year: [45, 65], title: '导师退休后的新阶段', text: '那位前辈正式退休了。职位影响力退下去，历史经验和愿意带人的耐心却还在。以后求助不一定能换来一个岗位机会，但可能少走很多弯路。', effects: { contactEvolution: { target: 'archetype:mentor', status: 'retired', position: '退休前辈，参与公益与传承', positionLevel: 1, influence: 42, access: 32, evolutionStage: 2, addRoles: ['mentor'], message: '退休，职位影响力下降但进入传承阶段' }, flag: 'netMentorRetired' } },
  { id: 'net010', stage: 'work', eventType: 'choice', weight: 5, requireContactStatus: 'remote', title: '异地关系还要不要维护', text: '调任以后，过去熟悉的联系人大多只剩下节日问候。维系一段异地关系要占用精力，也可能只是给自己留一个心理安慰。', choices: [
    { text: '主动约一次线上工作交流', effects: { contactDelta: { target: 'auto', relation: 3, trust: 3, access: 2 }, background: 1, mentalPressure: 2, flag: 'netRemoteMaintained' } },
    { text: '把精力放到新单位', effects: { workAbility: 2, mentalPressure: -1, flag: 'netRemoteReleased' } }
  ] },
  { id: 'net011', stage: 'work', eventType: 'choice', weight: 5, requireFlag: 'netPrivateRecommendation', title: '人情债的回声', text: '那位曾经帮你递话的人来找你，希望你在一个并不属于你职责范围的事项上“照顾一下”。这一次，关系不再只是情感，而是边界和责任。', choices: [
    { text: '说明回避边界，建议走公开渠道', effects: { integrity: 4, risk: -3, reputation: 2, contactDelta: { target: 'net_bridge', favorDebt: -6, trust: 2 }, flag: 'netFavorBoundary' } },
    { text: '硬着头皮帮他办', effects: { background: 4, contactDelta: { target: 'net_bridge', favorDebt: 10, trust: -2 }, risk: 8, heat: 3, integrity: -4, flag: 'netFavorOverdrawn' } },
    { text: '彻底切断联系', effects: { reputation: -1, risk: -2, contactDelta: { target: 'net_bridge', status: 'remote', access: -20 }, flag: 'netFavorCut' } }
  ] },
  { id: 'net012', stage: 'work', eventType: 'choice', weight: 5, requireContactArchetype: 'subordinate', requireContactMin: 25, title: '你带出来的人', text: '下属小赵第一次独立负责项目。你可以把每一步都握在手里，也可以让他在可控范围内犯错、成长。', choices: [
    { text: '给目标和边界，放手让他完成', effects: { workAbility: 2, peopleReputation: 3, contactDelta: { target: 'archetype:subordinate', trust: 5, reciprocity: 5, relation: 3 }, flag: 'netSuccession' } },
    { text: '所有关键环节都亲自过手', effects: { workAbility: 1, positionWeight: 2, mentalPressure: 4, contactDelta: { target: 'archetype:subordinate', trust: -2, reciprocity: -2 }, flag: 'netMicromanage' } },
    { text: '让他自己想办法，不提供支持', effects: { mentalPressure: -1, contactDelta: { target: 'archetype:subordinate', relation: -5, trust: -3 }, reputation: -1, flag: 'netSuccessionLost' } }
  ] },
  { id: 'net013', stage: 'work', eventType: 'auto', weight: 5, requireFlag: 'netSuccession', requireContactArchetype: 'subordinate', requireContactMinTrust: 45, title: '接班人的反哺', text: '小赵已经能够独当一面。你去外地参加培训时，他把单位里几个容易出问题的环节提前梳理好，回来时桌上放着一份清单。', effects: { workAbility: 3, mentalPressure: -3, reputation: 3, contactDelta: { target: 'archetype:subordinate', reciprocity: 8, trust: 4 }, flag: 'netSuccessionReturn' } },
  { id: 'net014', stage: 'work', eventType: 'choice', weight: 4, requireContactStatus: 'rival', title: '冲突关系的出口', text: '一位竞争者在公开场合质疑你的方案。你可以把关系继续推向对立，也可以把分歧留在会议纪要里。', choices: [
    { text: '当面澄清事实，保留对方体面', effects: { integrity: 2, reputation: 2, contactDelta: { target: 'auto', status: 'active', relation: 10, trust: 3 }, flag: 'netConflictResolved' } },
    { text: '找机会反击，让他以后不敢再说', effects: { positionWeight: 2, risk: 5, reputation: -2, contactDelta: { target: 'auto', relation: -8 }, flag: 'netConflictEscalated' } },
    { text: '回避争执，把证据留给组织判断', effects: { integrity: 3, risk: -2, mentalPressure: 2, flag: 'netConflictRecorded' } }
  ] },
  { id: 'net015', scenario: 'network', stage: 'work', eventType: 'choice', weight: 8, requireFlag: 'networkBoundary', title: '边界之后的信任', text: '你没有替熟人开后门，但把流程、材料和时间节点讲得很清楚。对方起初失望，后来发现你说到做到。', choices: [
    { text: '继续按流程帮他把材料补齐', effects: { reputation: 3, peopleReputation: 3, contactDelta: { target: 'auto', reciprocity: 4 }, flag: 'netCompliantHelper' } },
    { text: '只做一次说明，后续不再介入', effects: { integrity: 2, mentalPressure: -1, flag: 'netCompliantDistance' } }
  ] },
  { id: 'net016', scenario: 'network', stage: 'life', eventType: 'choice', weight: 7, requireFlag: 'networkFavor', title: '越过边界后的代价', text: '那次“方便”没有立刻出事，反而让更多熟人找上门。你开始发现，人情一旦没有边界，就会把你变成别人的资源。', choices: [
    { text: '主动说明以后只按程序办', effects: { integrity: 4, risk: -4, heat: -2, contactDelta: { target: 'auto', favorDebt: -5, trust: 2 }, flag: 'netFavorStopped' } },
    { text: '继续维持关系，先把眼前事情应付过去', effects: { background: 3, risk: 6, heat: 3, contactDelta: { target: 'auto', favorDebt: 8 }, flag: 'netFavorCycle' } }
  ] },
  { id: 'net017', scenario: ['grassroots', 'reform'], stage: 'work', eventType: 'choice', weight: 5, requireContactArchetype: 'community', title: '基层信息上行', text: '基层联系人告诉你，报表里看不出的困难正在真实发生。把这些话带上去，可能让项目调整，也可能让填表的人不舒服。', choices: [
    { text: '核实后如实上报，并提出解决方案', effects: { workAbility: 3, peopleReputation: 5, reputation: 2, integrity: 2, flag: 'netGrassrootsSignal' } },
    { text: '先不动报表，避免影响考核', effects: { positionWeight: 2, risk: 5, peopleReputation: -3, flag: 'netGrassrootsSilence' } }
  ] },
  { id: 'net018', scenario: ['clean', 'network'], stage: 'work', eventType: 'choice', weight: 5, requireContactArchetype: 'bridge', title: '公务回避', text: '桥接联系人所在单位即将参与一项与你有关的评审。你们关系不错，但程序上已经出现了需要回避的理由。', choices: [
    { text: '主动申请回避并留下记录', effects: { integrity: 5, risk: -4, reputation: 3, contactDelta: { target: 'archetype:bridge', status: 'recused', access: -20 }, flag: 'netRecusal' } },
    { text: '相信彼此，私下把情况说清楚', effects: { background: 2, contactDelta: { target: 'archetype:bridge', trust: 2, favorDebt: 5 }, risk: 6, integrity: -3, flag: 'netHiddenRecusal' } }
  ] },
  { id: 'net019', year: [45, 65], scenario: 'retired', stage: 'work', eventType: 'choice', weight: 6, requireContactStatus: 'retired', title: '退休后的导师', text: '退休后的前辈没有离开公共生活。他愿意帮你看材料、带年轻人，但不再适合被当作某个岗位的“门路”。', choices: [
    { text: '请他指导制度和方法，公开署名', effects: { workAbility: 2, reputation: 3, integrity: 2, contactDelta: { target: 'auto', reciprocity: 5, trust: 3 }, flag: 'netRetiredMentoring' } },
    { text: '仍想让他帮你找关系', effects: { background: 2, contactDelta: { target: 'auto', favorDebt: 8, trust: -3 }, risk: 4, flag: 'netRetiredShortcut' } }
  ] },
  { id: 'net020', scenario: 'family', stage: 'life', eventType: 'choice', weight: 5, requireContactArchetype: 'bridge', requireMarried: true, title: '人脉行动与家庭时间', text: '一次跨部门晚餐能让你认识关键协作方，但孩子的家长会也在同一晚。你第一次把人脉经营的成本看得很具体。', choices: [
    { text: '参加家长会，改用公开工作会面', effects: { familyPressure: -5, peopleReputation: 2, positionWeight: -1, flag: 'netFamilyBoundary' } },
    { text: '参加晚餐，回家后再补偿家人', effects: { background: 3, familyPressure: 5, mentalPressure: 3, flag: 'netFamilyTradeoff' } }
  ] },
  { id: 'net021', stage: 'work', eventType: 'choice', weight: 5, requireContactArchetype: 'bridge', year: [28, 52], title: '党校同窗的桥', text: '一次培训把你和不同地区、不同条线的干部放在同一张桌上。有人愿意交换经验，但真正有价值的不是通讯录，而是以后能否共同完成一件事。', choices: [
    { text: '围绕一个公开课题建立协作小组', effects: { workAbility: 3, reputation: 2, contact: { id: 'net_policy_bridge', name: '顾老师', relation: 30, trust: 36, reciprocity: 25, influence: 52, access: 62, archetype: 'bridge', roles: ['bridge', 'peer'], position: '党校课题协作人', positionLevel: 2, organization: { system: '党校/培训', tier: 2, region: 'current' } }, flag: 'netPolicyBridge' } },
    { text: '只交换联系方式，等以后有需要再说', effects: { background: 1, contact: { id: 'net_policy_bridge', name: '顾老师', relation: 18, trust: 22, reciprocity: 8, influence: 48, access: 50, archetype: 'bridge', roles: ['bridge'], position: '党校同学', positionLevel: 2, organization: { system: '党校/培训', tier: 2, region: 'current' } }, flag: 'netPolicyBridgeWeak' } },
    { text: '把时间留给眼前工作', effects: { workAbility: 2, mentalPressure: -1, flag: 'netPolicyBridgeDeclined' } }
  ] },
  { id: 'net022', stage: 'work', eventType: 'choice', weight: 5, requireFlag: 'netPolicyBridge', requireContact: 'net_policy_bridge', requireContactMinTrust: 30, title: '政策信息的提前量', text: '顾老师告诉你，一个政策窗口可能很快打开。提前知道并不等于可以抢跑，更不意味着可以把未公开材料拿去交换资源。', choices: [
    { text: '只用公开信息做准备，等正式通知', effects: { workAbility: 3, integrity: 3, risk: -2, contactDelta: { target: 'net_policy_bridge', trust: 4, reciprocity: 3 }, flag: 'netPolicyCompliant' } },
    { text: '先把消息告诉最亲近的合作方', effects: { background: 3, positionWeight: 2, contactDelta: { target: 'net_policy_bridge', trust: -4, favorDebt: 8 }, risk: 5, integrity: -3, flag: 'netPolicyLeak' } }
  ] },
  { id: 'net023', scenario: 'clean', stage: 'work', eventType: 'choice', weight: 5, requireContactArchetype: 'inspector', requireContactMin: 20, title: '审计同事的提醒', text: '一位熟悉监督流程的联系人提醒你：很多风险不是因为有人想违法，而是因为大家都觉得“这次可以先例外”。', choices: [
    { text: '把提醒转成流程清单，主动补齐留痕', effects: { integrity: 5, risk: -4, workAbility: 2, contactDelta: { target: 'archetype:inspector', trust: 5, reciprocity: 3 }, flag: 'netAuditChecklist' } },
    { text: '只记在心里，不想让团队觉得你太谨慎', effects: { reputation: 1, positionWeight: 1, risk: 4, contactDelta: { target: 'archetype:inspector', trust: -2 }, flag: 'netAuditSilent' } }
  ] },
  { id: 'net024', stage: 'work', eventType: 'choice', weight: 5, requireContactArchetype: 'subordinate', requireContactMinTrust: 35, year: [30, 58], title: '下属要去更远的地方', text: '小赵获得了一个外派机会。留下他能让你少一个得力的人，放他走却可能是你真正做对的一次培养。', choices: [
    { text: '支持他去外派，并把交接做成制度', effects: { peopleReputation: 4, reputation: 2, workAbility: 2, contactDelta: { target: 'archetype:subordinate', trust: 5, reciprocity: 6, access: -4 }, flag: 'netSubordinateReleased' } },
    { text: '以团队需要为由留下他', effects: { positionWeight: 2, mentalPressure: 3, contactDelta: { target: 'archetype:subordinate', trust: -5, reciprocity: -4 }, flag: 'netSubordinateRetained' } }
  ] },
  { id: 'net025', stage: 'work', eventType: 'choice', weight: 5, requireContactStatus: 'rival', year: [28, 60], title: '竞争也要有边界', text: '同一岗位的竞争进入最后阶段。你们都知道对方的短处，但把短处变成流言，和把分歧放到公开评价里，是两种完全不同的选择。', choices: [
    { text: '只提交可核验的工作事实', effects: { integrity: 4, reputation: 3, risk: -3, contactDelta: { target: 'auto', relation: 5, trust: 2 }, flag: 'netFairCompetition' } },
    { text: '暗示对方曾经的失误', effects: { positionWeight: 2, risk: 6, reputation: -3, contactDelta: { target: 'auto', relation: -6, trust: -4 }, flag: 'netDirtyCompetition' } }
  ] },
  { id: 'net026', scenario: 'family', stage: 'life', eventType: 'choice', weight: 5, requireContactArchetype: 'family', requireMarried: true, title: '家人也是关系网络', text: '你的家庭联系人不提供职位信息，却承担着你每一次临时加班、异地调任和情绪透支的真实成本。', choices: [
    { text: '把调任和工作压力讲清楚，共同做安排', effects: { familyPressure: -6, mentalPressure: -2, peopleReputation: 2, contactDelta: { target: 'archetype:family', trust: 5, reciprocity: 5 }, flag: 'netFamilyNegotiated' } },
    { text: '先瞒着家人，等结果确定再说', effects: { positionWeight: 2, familyPressure: 6, mentalPressure: 4, contactDelta: { target: 'archetype:family', trust: -5, reciprocity: -3 }, flag: 'netFamilyHidden' } }
  ] },
  { id: 'net027', scenario: 'reform', stage: 'work', eventType: 'choice', weight: 5, requireContactArchetype: 'bridge', requireContactMinTrust: 35, title: '改革项目的共同署名', text: '跨部门项目终于有了阶段性成果。有人建议只保留牵头单位的名字，有人坚持让一线和协作单位都被看见。', choices: [
    { text: '按贡献共同署名，公开方法和数据', effects: { workAbility: 3, reputation: 4, peopleReputation: 3, contactDelta: { target: 'archetype:bridge', trust: 5, reciprocity: 5 }, flag: 'netJointCredit' } },
    { text: '把成果集中到自己手里', effects: { positionWeight: 3, background: 2, contactDelta: { target: 'archetype:bridge', trust: -5, reciprocity: -4 }, reputation: -2, flag: 'netCreditCaptured' } }
  ] },
  { id: 'net028', stage: 'life', eventType: 'choice', weight: 5, requireContactStatus: 'remote', year: [35, 62], title: '调任后的第一次回访', text: '你回到曾经工作的地方参加会议。旧同事仍愿意说真话，但你已经不能把过去的熟悉感直接当作当前权限。', choices: [
    { text: '以经验交流为主，不越过现岗位边界', effects: { reputation: 3, integrity: 3, contactDelta: { target: 'auto', relation: 3, trust: 3, access: 2 }, flag: 'netTransferBoundary' } },
    { text: '借旧关系推动原单位替你办事', effects: { background: 3, positionWeight: 2, contactDelta: { target: 'auto', favorDebt: 8, trust: -3 }, risk: 5, flag: 'netTransferOverreach' } }
  ] },
  { id: 'net029', stage: 'work', eventType: 'auto', weight: 4, requireFlag: 'netMentorTrust', requireContactArchetype: 'mentor', requireContactMinTrust: 60, year: [38, 60], title: '导师转到幕后', text: '导师不再站在一线岗位，却开始参与培训、调研和传承工作。影响力换了形态，关系也从“能不能帮我”变成“我能不能把经验接住”。', effects: { contactEvolution: { target: 'archetype:mentor', position: '退居二线的制度顾问', positionLevel: 2, influence: 55, access: 44, evolutionStage: 2, addRoles: ['bridge'], message: '转入制度顾问和传承阶段' }, contactDelta: { target: 'archetype:mentor', reciprocity: 5, trust: 3 }, flag: 'netMentorAdvisor' } },
  { id: 'net030', stage: 'work', eventType: 'choice', weight: 5, requireFlag: 'netBridgePromoted', requireContact: 'net_bridge', title: '新岗位的新规矩', text: '林处长升任后，能提供的信息更重要，但任何非正式请托也更容易留下痕迹。你需要重新学习如何使用这段关系。', choices: [
    { text: '只请求公开渠道和正式协作', effects: { integrity: 4, reputation: 3, contactDelta: { target: 'net_bridge', trust: 5, favorDebt: -3, reciprocity: 3 }, flag: 'netSeniorFormal' } },
    { text: '趁关系还在，多请他帮几次', effects: { background: 4, positionWeight: 2, contactDelta: { target: 'net_bridge', favorDebt: 12, trust: -5 }, risk: 6, flag: 'netSeniorOverdrawn' } }
  ] },
  { id: 'net031', scenario: ['clean', 'network'], stage: 'work', eventType: 'choice', weight: 5, requireContactStatus: 'active', requireContactMinTrust: 45, title: '联系人接受审查', text: '与你关系密切的联系人被纳入一项审查。现在最安全的做法不是证明你们“没关系”，而是把该回避的业务和该保留的记录分开。', choices: [
    { text: '主动回避相关事项，配合核查并保留记录', effects: { integrity: 5, risk: -5, reputation: 2, contactDelta: { target: 'auto', status: 'recused', access: -30 }, flag: 'netContactRecused' } },
    { text: '帮他打听审查进展', effects: { background: 3, contactDelta: { target: 'auto', trust: 2, favorDebt: 8 }, risk: 8, heat: 4, integrity: -4, flag: 'netContactInterfered' } }
  ] },
  { id: 'net032', stage: 'work', eventType: 'auto', weight: 4, requireContactStatus: 'recused', requireFlag: 'netContactRecused', title: '回避关系的修复', text: '审查结束后，联系人重新回到正常工作。你们没有恢复到过去的随意，但都知道边界本身也是一种长期信任。', effects: { contactDelta: { target: 'auto', status: 'active', access: 18, trust: 3, reciprocity: 2 }, integrity: 2, reputation: 2, flag: 'netRecusalResolved' } },
  { id: 'net033', stage: 'life', eventType: 'choice', weight: 5, requireContactStatus: 'remote', year: [40, 65], title: '关系冷却还是重新连接', text: '有一段关系已经很久没有消息。你不确定对方是忙、失望，还是已经进入了完全不同的生活阶段。', choices: [
    { text: '发一封不带请求的近况问候', effects: { mentalPressure: 1, contactDelta: { target: 'auto', relation: 3, trust: 2, access: 5 }, flag: 'netReconnect' } },
    { text: '接受关系自然退出，不再消耗彼此', effects: { mentalPressure: -2, workAbility: 1, contactDelta: { target: 'auto', status: 'lost', access: 0 }, flag: 'netReleased' } }
  ] },
  { id: 'net034', scenario: 'grassroots', stage: 'work', eventType: 'choice', weight: 5, requireContactArchetype: 'community', requireContactMin: 25, title: '不止一个村子的声音', text: '你发现自己最熟悉的联系人只代表一个片区。要判断一项政策是否真的有效，还需要让不同社区、不同群体的反馈进入决策。', choices: [
    { text: '主动建立多个社区反馈来源', effects: { workAbility: 3, peopleReputation: 5, contact: { id: 'net_community_bridge', name: '周社工', relation: 26, trust: 34, reciprocity: 22, influence: 42, access: 62, archetype: 'community', roles: ['community', 'bridge'], position: '社区协作人', positionLevel: 1, organization: { system: '基层治理', tier: 0, region: 'current' } }, flag: 'netCommunityDiversity' } },
    { text: '继续依赖最熟悉的那一个人', effects: { mentalPressure: -1, peopleReputation: 1, flag: 'netCommunityNarrow' } }
  ] },
  { id: 'net035', stage: 'work', eventType: 'choice', weight: 5, requireContactArchetype: 'peer', requireContactMin: 30, year: [27, 55], title: '同僚既是伙伴也是竞争者', text: '平级同事开始承担与你相似的项目。你们可以共享方法，也可以把每一次信息交换都理解成位置竞争。', choices: [
    { text: '明确分工，互相补位并共享成果', effects: { workAbility: 3, reputation: 3, contactDelta: { target: 'archetype:peer', trust: 4, reciprocity: 5, relation: 3 }, flag: 'netPeerCooperate' } },
    { text: '减少信息交换，确保自己的优势', effects: { positionWeight: 2, mentalPressure: 2, contactDelta: { target: 'archetype:peer', trust: -3, reciprocity: -3 }, flag: 'netPeerGuarded' } }
  ] },
  { id: 'net036', stage: 'life', eventType: 'auto', weight: 4, requireFlag: 'netSuccessionReturn', requireContactArchetype: 'subordinate', requireContactMinTrust: 55, year: [45, 65], title: '把位置变成传承', text: '你回头看，最能证明你走得远的并不是通讯录里有多少名字，而是有人因为和你共事而更有能力、更守边界。', effects: { peopleReputation: 6, reputation: 4, integrity: 2, contactDelta: { target: 'archetype:subordinate', reciprocity: 8, trust: 3 }, flag: 'netLegacyComplete' } }
];
