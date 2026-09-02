// 人脉领域数据：只保存稳定的角色画像和玩法常量，不把具体个人信息写入监控。
// 由 data.js 组装；旧存档仍通过 legacyId/id 兼容。
var gd_network = {
  contactCapacity: 10,
  networkEconomy: {
    minBatchTargets: 2,
    maxBatchTargets: 3,
    // 批量经营节省的是重复流程，不是把高职级关系变成廉价关系。
    batchCostFactors: [1, 0.94, 0.88],
    batchPressureFactors: [1, 0.96, 0.92],
    positionPremium: [0, 2, 4, 7, 10],
    influenceStep: 15,
    baseInfluence: 20
  },
  edgeLimit: 24,
  logLimit: 120,
  scenarioModifiers: {
    classic: { label: '均衡网络', focus: '在拓展与维系之间保持平衡', preferredArchetypes: ['mentor', 'peer', 'bridge'], pressureMultiplier: 1, actionDelta: {} },
    grassroots: { label: '基层网络', focus: '群众反馈、基层干部和下属培养', preferredArchetypes: ['community', 'subordinate', 'bridge'], pressureMultiplier: 1, actionDelta: { collaborate: { workAbility: 1 }, maintain: { peopleReputation: 2 } } },
    midcareer: { label: '转岗重建', focus: '重启旧关系并快速建立新单位协作', preferredArchetypes: ['peer', 'bridge', 'mentor'], pressureMultiplier: 1.1, actionDelta: { cultivate: { mentalPressure: 2 }, collaborate: { workAbility: 2 } } },
    clean: { label: '合规网络', focus: '回避、留痕和可信度优先', preferredArchetypes: ['inspector', 'bridge', 'mentor'], pressureMultiplier: 1.05, actionDelta: { ask: { risk: 2 }, resolveConflict: { integrity: 1 } } },
    network: { label: '边界网络', focus: '在人情债与关系边界之间取舍', preferredArchetypes: ['mentor', 'peer', 'family', 'bridge'], pressureMultiplier: 1.1, actionDelta: { ask: { risk: 2 }, repay: { reputation: 1 } } },
    reform: { label: '改革网络', focus: '跨部门桥接和共同署名', preferredArchetypes: ['bridge', 'community', 'mentor'], pressureMultiplier: 1, actionDelta: { collaborate: { workAbility: 2 }, introduce: { reputation: 1 } } },
    retired: { label: '传承网络', focus: '导师经验、接班人和公开传承', preferredArchetypes: ['mentor', 'subordinate', 'peer'], pressureMultiplier: 0.95, actionDelta: { maintain: { peopleReputation: 2 }, cultivate: { workAbility: 1 } } },
    family: { label: '家庭网络', focus: '家庭时间、异地安排和长期互惠', preferredArchetypes: ['family', 'mentor', 'community'], pressureMultiplier: 1.15, actionDelta: { maintain: { familyPressure: -3 }, collaborate: { familyPressure: 3 } } }
  },
  archetypes: {
    mentor: { label: '导师/前辈', roles: ['mentor', 'sponsor'], influence: 70, positionLevel: 3, system: '党政系统', maintenanceWeight: 1.18, networkWeight: 1.18 },
    peer: { label: '同事/同学', roles: ['peer'], influence: 42, positionLevel: 1, system: '党政系统', maintenanceWeight: 1, networkWeight: 1 },
    bridge: { label: '桥接人', roles: ['bridge'], influence: 58, positionLevel: 2, system: '跨部门', maintenanceWeight: 1.12, networkWeight: 1.16 },
    subordinate: { label: '下属/接班人', roles: ['subordinate'], influence: 38, positionLevel: 0, system: '党政系统', maintenanceWeight: 0.88, networkWeight: 0.86 },
    community: { label: '群众/基层', roles: ['community'], influence: 30, positionLevel: 0, system: '基层', maintenanceWeight: 0.78, networkWeight: 0.72 },
    family: { label: '亲友/同乡', roles: ['family'], influence: 35, positionLevel: 0, system: '社会', maintenanceWeight: 0.86, networkWeight: 0.82 },
    business: { label: '行业/企业', roles: ['bridge'], influence: 52, positionLevel: 1, system: '行业', maintenanceWeight: 1.08, networkWeight: 1.1 },
    inspector: { label: '监督/纪检', roles: ['bridge', 'oversight'], influence: 52, positionLevel: 2, system: '监督系统', maintenanceWeight: 1.16, networkWeight: 1.2 },
    rival: { label: '竞争/冲突', roles: ['rival'], influence: 35, positionLevel: 1, system: '党政系统', maintenanceWeight: 1, networkWeight: 0.92 }
  },
  // 固定剧情人物的旧存档没有分层字段。迁移时只补画像字段，不覆盖关系值和事件兼容 id。
  fixedContactProfiles: {
    crew_boss: { archetype: 'mentor', positionLevel: 2, influence: 64, access: 76, position: '直属处长', system: '党政系统', forceMigration: true },
    crew_colleague: { archetype: 'peer', positionLevel: 1, influence: 38, access: 72, position: '同批入职同事', system: '党政系统', forceMigration: true },
    crew_mentor: { archetype: 'mentor', positionLevel: 2, influence: 56, access: 64, position: '单位老前辈', system: '党政系统', forceMigration: true },
    noble: { archetype: 'mentor', positionLevel: 3, influence: 82, access: 58, position: '省级单位退休领导', system: '党政系统' },
    sizhang: { archetype: 'mentor', positionLevel: 4, influence: 92, access: 42, position: '省厅司局级领导', system: '党政系统' },
    elder: { archetype: 'mentor', positionLevel: 2, influence: 58, access: 55, position: '退休老书记', system: '党政系统' },
    mentor: { archetype: 'mentor', positionLevel: 2, influence: 60, access: 58, position: '退休学者/大学导师', system: '党校/培训' },
    classmate: { archetype: 'business', positionLevel: 2, influence: 62, access: 58, position: '企业负责人', system: '行业' },
    oldClassmate: { archetype: 'business', positionLevel: 1, influence: 48, access: 62, position: '创业者', system: '行业' },
    qingmei: { archetype: 'family', positionLevel: 1, influence: 44, access: 70, position: '医院业务骨干', system: '公共服务' },
    hometown: { archetype: 'family', positionLevel: 1, influence: 46, access: 68, position: '同乡长辈', system: '乡土关系' },
    subordinate: { archetype: 'subordinate', positionLevel: 0, influence: 36, access: 78, position: '得力下属', system: '党政系统' },
    chamber: { archetype: 'business', positionLevel: 2, influence: 68, access: 52, position: '商会会长', system: '行业' },
    veteran: { archetype: 'bridge', positionLevel: 1, influence: 48, access: 70, position: '公安系统战友', system: '公共服务' },
    journalist: { archetype: 'bridge', positionLevel: 1, influence: 54, access: 66, position: '跑口记者', system: '媒体' },
    doctor: { archetype: 'bridge', positionLevel: 2, influence: 52, access: 68, position: '医院主任医师', system: '公共服务' },
    inspector: { archetype: 'inspector', positionLevel: 2, influence: 64, access: 48, position: '纪检组老同志', system: '监督系统' },
    partySchool: { archetype: 'bridge', positionLevel: 2, influence: 60, access: 64, position: '党校青干班同学', system: '党校/培训' },
    roommate: { archetype: 'peer', positionLevel: 0, influence: 30, access: 66, position: '大学室友', system: '社会' },
    cousin: { archetype: 'family', positionLevel: 0, influence: 30, access: 70, position: '亲属', system: '社会' }
  },
  rankLabels: {
    '-1': '社会关系',
    '0': '基层/普通',
    '1': '科级/业务骨干',
    '2': '处级/部门骨干',
    '3': '厅局级/省级',
    '4': '省部级/中央'
  },
  // 随机联系人模板：保留少量固定剧情锚点，同时让每局的人脉网络有不同组合。
  // 模板只描述角色类型和可变范围，具体姓名、单位层级和 uid 由引擎按局生成。
  randomContactTemplates: [
    { archetype: 'mentor', roles: ['mentor'], names: ['周老师', '何主任', '老宋', '钱老师'], positions: ['退休前辈', '业务骨干', '党校导师'], systems: ['党政系统', '党校/培训'], tier: [1, 3], relation: [18, 34], trust: [28, 52], reciprocity: [10, 28], influence: [55, 78] },
    { archetype: 'peer', roles: ['peer'], names: ['小陈', '王科', '李同学', '赵姐'], positions: ['同单位同事', '党校同期同学', '兄弟单位业务骨干'], systems: ['党政系统', '党校/培训', '公共服务'], tier: [0, 3], relation: [12, 30], trust: [22, 45], reciprocity: [8, 25], influence: [32, 58] },
    { archetype: 'bridge', roles: ['bridge', 'peer'], names: ['林处', '顾老师', '许科长', '唐主任'], positions: ['跨部门协作人', '项目联络人', '政策研究同事'], systems: ['跨部门', '党校/培训', '政府部门'], tier: [1, 4], relation: [14, 32], trust: [24, 48], reciprocity: [10, 28], influence: [48, 72] },
    { archetype: 'subordinate', roles: ['subordinate'], names: ['小赵', '小何', '小林', '小唐'], positions: ['年轻同事', '项目骨干', '基层锻炼干部'], systems: ['党政系统', '基层治理'], tier: [0, 2], relation: [16, 34], trust: [24, 48], reciprocity: [12, 32], influence: [28, 48] },
    { archetype: 'community', roles: ['community'], names: ['周社工', '刘大姐', '老杨', '小马'], positions: ['社区工作者', '村干部', '基层服务对象'], systems: ['基层治理', '社区'], tier: [0, 1], relation: [14, 30], trust: [25, 50], reciprocity: [12, 30], influence: [25, 46] },
    { archetype: 'family', roles: ['family'], names: ['老周', '陈叔', '方姐', '小魏'], positions: ['同乡长辈', '老同学家属', '邻里熟人'], systems: ['社会', '乡土关系'], tier: [0, 2], relation: [18, 38], trust: [35, 62], reciprocity: [18, 42], influence: [25, 52] },
    { archetype: 'business', roles: ['bridge'], names: ['孙会长', '陈总', '许老板', '罗经理'], positions: ['行业协会联系人', '企业项目负责人', '商会理事'], systems: ['行业', '企业'], tier: [1, 3], relation: [10, 28], trust: [18, 42], reciprocity: [8, 24], influence: [42, 68] },
    { archetype: 'inspector', roles: ['bridge', 'oversight'], names: ['老宋', '严科', '方组长', '魏主任'], positions: ['监督系统同事', '纪检联络员', '审计业务骨干'], systems: ['监督系统', '审计'], tier: [1, 4], relation: [8, 24], trust: [20, 44], reciprocity: [8, 22], influence: [42, 66] }
  ],
  legacyArchetype: {
    noble: 'mentor', sizhang: 'mentor', elder: 'mentor', mentor: 'mentor',
    crew_boss: 'mentor', crew_mentor: 'mentor', crew_colleague: 'peer',
    classmate: 'peer', oldClassmate: 'peer', roommate: 'peer',
    subordinate: 'subordinate', hometown: 'family', cousin: 'family',
    neighbor: 'community', chamber: 'business', veteran: 'bridge',
    doctor: 'bridge', journalist: 'bridge', inspector: 'inspector', partySchool: 'bridge', qingmei: 'family', oldFriend: 'family'
  },
  actionCosts: {
    cultivate: { slot: 'connection', label: '拓展关系', pressure: 1, cash: 3, remoteCash: 6 },
    collaborate: { slot: 'connection', label: '跨部门协作', pressure: 2, cash: 5, remoteCash: 9 },
    introduce: { slot: 'connection', label: '牵线搭桥', pressure: 1, cash: 4, remoteCash: 7 },
    maintain: { slot: 'stewardship', label: '维系关系', pressure: 1, cash: 4, remoteCash: 8 },
    ask: { slot: 'stewardship', label: '请求帮助', pressure: 2, cash: 2, remoteCash: 4 },
    repay: { slot: 'stewardship', label: '偿还人情', pressure: 0, cash: 4, remoteCash: 7 },
    resolveConflict: { slot: 'stewardship', label: '化解冲突', pressure: 2, cash: 5, remoteCash: 9 }
  }
};
