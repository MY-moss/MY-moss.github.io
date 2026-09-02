// ===== 主题事件包（最大池） =====
// id 范围：ent001~ent292（309条） | 装配：js/data/data.js → GameData.events | v2.1.66 头注释标准化（分类学见 docs/architecture/EVENT-SYSTEM-ARCHITECTURE.md）
// 定位：反腐/乡村振兴/数字经济等大主题（旧注释写 50 条系历史值，实际 309）
const gd_events_new_theme = [
    // ---------- 反腐主题（20个） ----------
    { id: 'ent001', stage: 'work', eventType: 'choice', weight: 7, title: '巡视反馈整改', text: '巡视组刚走，留下厚厚一沓反馈意见，你牵头负责整改清单里最棘手的三项。整改报告要"见人见事见处理结果"，你盯着"整改时限"四个字，时间像被按了快进。', choices: [
      { text: '逐条对账销号，建立整改台账', effects: {workAbility: 3, integrity: 3, mentalPressure: 3} },
      { text: '找业务骨干一起研讨整改方案', effects: {eq: 1, workAbility: 2, integrity: 2} },
      { text: '套用往期整改模板先交差', effects: {mentalPressure: -2, risk: 4, integrity: -3} },
      { text: '邀请纪检组提前把关', effects: {background: 2, integrity: 2, mentalPressure: 1} },
    ]},
    { id: 'ent002', stage: 'work', eventType: 'choice', weight: 6, title: '线索初核', text: '一封举报信转到你手里，反映某科室负责人违规收受土特产。线索初核要"快、准、稳"，你摸了摸发凉的后脖颈。', choices: [
      { text: '依规依程序开展初核，调取相关证据', effects: {workAbility: 3, integrity: 3, risk: -1, mentalPressure: 3} },
      { text: '先找当事人谈心提醒', effects: {eq: 1, risk: 3, integrity: -1} },
      { text: '暂缓处置，等风头过去', effects: {mentalPressure: -3, risk: 5, integrity: -4} },
      { text: '上报分管领导集体研究', effects: {background: 2, integrity: 2, mentalPressure: 1} },
    ]},
    { id: 'ent003', stage: 'work', eventType: 'choice', weight: 6, title: '监察调查取证', text: '一起涉嫌职务违法的问题进入监察调查阶段，你负责外围取证。被调查人是谁谁谁的"老关系"，传话的人比取证的人还多。', choices: [
      { text: '严格按程序调取银行流水和合同', effects: {workAbility: 3, integrity: 3, mentalPressure: 3} },
      { text: '走访关键证人固定言词证据', effects: {eq: 1, workAbility: 2, integrity: 2, mentalPressure: 2} },
      { text: '对证人"点到为止"，留点余地', effects: {eq: 1, risk: 4, integrity: -3} },
      { text: '申请技术调查措施协助', effects: {background: 1, workAbility: 2, integrity: 2} },
    ]},
    { id: 'ent004', stage: 'work', eventType: 'choice', weight: 7, title: '廉政提醒谈话', text: '分管领导让你对一名"反映集中"的中层干部开展廉政提醒谈话。谈话对象比你资历老，进门时脸色比窗外天还沉。', choices: [
      { text: '开门见山点问题，红脸出汗', effects: {integrity: 3, workAbility: 2, eq: 1, mentalPressure: 3} },
      { text: '先聊家常再切入正题', effects: {eq: 1, risk: 1, mentalPressure: 1} },
      { text: '走过场念个提醒函了事', effects: {mentalPressure: -2, risk: 3, integrity: -2} },
      { text: '做好谈话记录并签字确认', effects: {workAbility: 2, integrity: 2, mentalPressure: 1} },
    ]},
    { id: 'ent005', stage: 'work', eventType: 'choice', weight: 6, title: '警示教育大会', text: '单位召开警示教育大会，要剖析"身边人身边事"。台上一念通报，台下有人坐立不安，你负责起草剖析材料。', choices: [
      { text: '深挖思想根源，对照岗位职责反思', effects: {integrity: 3, iq: 2, mentalPressure: 2} },
      { text: '用典型案例串联，增强代入感', effects: {workAbility: 2, eq: 1, mentalPressure: 1} },
      { text: '泛泛而谈，避免对号入座', effects: {mentalPressure: -2, risk: 2, integrity: -2} },
      { text: '邀请案中人现身说法', effects: {background: 1, integrity: 2, risk: 1} },
    ]},
    { id: 'ent006', stage: 'work', eventType: 'choice', weight: 6, title: '以案促改方案', text: '上级通报了一起典型案例，要求开展以案促改。你拿着通报反复读，发现案中人和你部门业务流程惊人相似。', choices: [
      { text: '对照案例排查本部门廉政风险点', effects: {workAbility: 3, integrity: 3, mentalPressure: 3} },
      { text: '完善制度漏洞，建立长效机制', effects: {workAbility: 2, iq: 2, integrity: 2} },
      { text: '象征性写份心得交差', effects: {mentalPressure: -2, risk: 3, integrity: -3} },
      { text: '组织专题民主生活会剖析', effects: {eq: 1, integrity: 2, mentalPressure: 2} },
    ]},
    { id: 'ent007', stage: 'work', eventType: 'choice', weight: 7, title: '巡视"回头看"', text: '巡视"回头看"来了，重点是上轮整改"假整改、整改慢"问题。你翻出去年的整改报告，发现有两项"已完成"的事项其实还在原地。', choices: [
      { text: '主动说明情况，重新纳入整改', effects: {integrity: 3, workAbility: 2, mentalPressure: 3} },
      { text: '连夜补材料把"已完成"坐实', effects: {risk: 5, integrity: -4, mentalPressure: 3} },
      { text: '向分管领导如实汇报，研究补救', effects: {background: 2, integrity: 2, mentalPressure: 2} },
      { text: '申请延期，等条件成熟再改', effects: {mentalPressure: -1, risk: 3, integrity: -2} },
    ]},
    { id: 'ent008', stage: 'work', eventType: 'choice', weight: 5, title: '基层巡察整改', text: '基层巡察反馈指出你们"压力传导层层递减"。你负责抓基层整改落实，可越往下，"上面九级风浪、下面纹丝不动"的感觉越明显。', choices: [
      { text: '蹲点督导，逐村逐户看整改', effects: {workAbility: 3, integrity: 2, mentalPressure: 3} },
      { text: '建立整改周报和销号机制', effects: {workAbility: 2, eq: 1, mentalPressure: 2} },
      { text: '通过视频会议部署落实', effects: {workAbility: 1, mentalPressure: 1, risk: 1} },
      { text: '把压力都压给最基层', effects: {mentalPressure: -2, risk: 2, integrity: -2, eq: -2} },
    ]},
    { id: 'ent009', stage: 'work', eventType: 'choice', weight: 6, title: '责任追究', text: '一项工作出了纰漏，上级要求"严肃问责"。被问责对象是你的老下属，平时工作也算勤恳，你拿着问责建议书左右为难。', choices: [
      { text: '依规依纪提出处理建议', effects: {integrity: 3, workAbility: 2, mentalPressure: 3} },
      { text: '考虑一贯表现，建议从轻处理', effects: {eq: 1, risk: 2, integrity: 1} },
      { text: '大事化小，象征性提醒', effects: {mentalPressure: -2, risk: 4, integrity: -3} },
      { text: '集体研究决定，分散压力', effects: {background: 2, integrity: 2, mentalPressure: 1} },
    ]},
    { id: 'ent010', stage: 'work', eventType: 'choice', weight: 5, title: '违纪线索查处', text: '有人反映某干部上班时间打麻将。你带队核查，敲门进去时，麻将桌上的牌还冒着"温热"。', choices: [
      { text: '固定证据，依规立案审查', effects: {integrity: 3, workAbility: 2, mentalPressure: 2} },
      { text: '批评教育，责令书面检查', effects: {eq: 1, risk: 2, integrity: 1} },
      { text: '通报了事，不深究', effects: {mentalPressure: -2, risk: 4, integrity: -3} },
      { text: '移交纪检部门处理', effects: {background: 1, integrity: 2, mentalPressure: 1} },
    ]},
    { id: 'ent011', stage: 'work', eventType: 'choice', weight: 6, title: '中秋礼品', text: '中秋节，一个业务往来单位送来一盒"月饼"，掂量着分量不对。打开一看，月饼下面压着一个厚信封。', choices: [
      { text: '当场退回，并做好记录', effects: {integrity: 3, risk: -1, mentalPressure: 1} },
      { text: '上交廉政账户', effects: {integrity: 3, workAbility: 1, mentalPressure: 1} },
      { text: '暂时收下，"以后再说"', effects: {wealth: 50, risk: 6, integrity: -5, desire: 2} },
      { text: '退回月饼，留下信封"处理业务用"', effects: {risk: 5, integrity: -4, desire: 2} },
    ]},
    { id: 'ent012', stage: 'work', eventType: 'choice', weight: 5, title: '超标接待', text: '上级来调研，接待标准卡在"四菜一汤"。可对方带队的是老熟人，处里有人嘀咕"加两个菜不碍事"。', choices: [
      { text: '严格执行接待标准，不超标', effects: {integrity: 3, workAbility: 1, mentalPressure: 2} },
      { text: '加菜但自掏腰包补差价', effects: {integrity: 2, wealth: -30, eq: 1} },
      { text: '公款超标接待，"热情一点"', effects: {risk: 5, integrity: -4, wealth: -100} },
      { text: '安排工作餐，边吃边谈工作', effects: {workAbility: 2, integrity: 2, mentalPressure: 1} },
    ]},
    { id: 'ent013', stage: 'work', eventType: 'choice', weight: 5, title: '公车钥匙', text: '周末要回老家一趟，单位公车钥匙就挂在值班室。司机说"反正周末也没人用"。', choices: [
      { text: '自己买票坐车回去', effects: {integrity: 3, wealth: -20, mentalPressure: 1} },
      { text: '申请私事用车并缴费', effects: {integrity: 2, wealth: -50, workAbility: 1} },
      { text: '顺手开回去"就这一次"', effects: {risk: 5, integrity: -4, desire: 1} },
      { text: '找朋友拼车回去', effects: {eq: 1, integrity: 2, mentalPressure: 1} },
    ]},
    { id: 'ent014', stage: 'work', eventType: 'choice', weight: 5, title: '办公用房清理', text: '上级要求清理超标办公用房。你那间办公室多出3平米，恰好够放一张小茶几和两把椅子。', choices: [
      { text: '主动腾退超标面积，调整到位', effects: {integrity: 3, workAbility: 1, mentalPressure: 1} },
      { text: '加张桌子"凑合"两人办公', effects: {integrity: 2, eq: 1, mentalPressure: 2} },
      { text: '把门牌换一下"蒙混过关"', effects: {risk: 4, integrity: -3} },
      { text: '拖一拖，等下一批清理', effects: {mentalPressure: -1, risk: 3, integrity: -2} },
    ]},
    { id: 'ent015', stage: 'work', eventType: 'choice', weight: 5, title: '津补贴发放', text: '年底科室有笔结余经费，有人建议"变通一下"给大家发点福利。账怎么走，成了"集体智慧"。', choices: [
      { text: '严格按规矩，不违规发放', effects: {integrity: 3, risk: -1, mentalPressure: 2} },
      { text: '通过工会按规定发放慰问品', effects: {integrity: 2, eq: 1, wealth: -30} },
      { text: '巧立名目发放"加班费"', effects: {risk: 5, integrity: -4, wealth: -100, desire: 2} },
      { text: '留作科室活动经费，账目公开', effects: {workAbility: 2, integrity: 2, mentalPressure: 1} },
    ]},
    { id: 'ent016', stage: 'work', eventType: 'choice', weight: 6, title: '减文减会', text: '上级要求为基层减负，可处里今年发文数不降反增。你盯着"贯彻落实"四个字，发现每份文件都在"贯彻落实"上一份文件。', choices: [
      { text: '梳理整合同类事项，精简文件', effects: {workAbility: 3, iq: 2, integrity: 2} },
      { text: '建立发文必要性审核机制', effects: {workAbility: 2, integrity: 2, mentalPressure: -1} },
      { text: '照旧发文，"多一道保险"', effects: {mentalPressure: -1, risk: 2, integrity: -2} },
      { text: '用会议落实文件，再用文件落实会议', effects: {risk: 3, integrity: -3, mentalPressure: 2} },
    ]},
    { id: 'ent017', stage: 'work', eventType: 'choice', weight: 6, title: '群众来访（老人求助）', text: '一位老人到机关反映问题，跑了三趟都没办成。这次他直接坐在你办公室门口，手里攥着一张发黄的证明。', choices: [
      { text: '主动接待，协调相关部门解决', effects: {integrity: 3, eq: 1, workAbility: 2, mentalPressure: 2} },
      { text: '把问题记下来，限时办结', effects: {workAbility: 2, integrity: 2, mentalPressure: 1} },
      { text: '推给下属"按程序办"', effects: {eq: -2, risk: 2, integrity: -2} },
      { text: '让保安"劝离"', effects: {risk: 4, integrity: -4, eq: -3} },
    ]},
    { id: 'ent018', stage: 'work', eventType: 'choice', weight: 4, title: '公款培训', text: '一次"业务培训"安排在海边度假酒店，培训内容半天就讲完，剩下都是"现场教学"。', choices: [
      { text: '提出调整培训地点和内容', effects: {integrity: 3, workAbility: 1, mentalPressure: 2} },
      { text: '参加培训但自费额外消费', effects: {integrity: 2, wealth: -50, eq: 1} },
      { text: '全程参与"现场教学"，心安理得', effects: {risk: 4, integrity: -3, desire: 2} },
      { text: '借故不参加', effects: {integrity: 2, eq: -1, mentalPressure: 1} },
    ]},
    { id: 'ent019', stage: 'work', eventType: 'choice', weight: 4, title: '同学聚会（高档局）', text: '老同学组织聚会，定在高档会所。有人说"你现在是领导，这单得你签"，包厢里灯光晃得人发懵。', choices: [
      { text: '婉拒参加，建议换个地方', effects: {integrity: 3, eq: 1, mentalPressure: 1} },
      { text: '参加但坚持AA制', effects: {integrity: 2, eq: 1, wealth: -60} }, // v2.58 数值修复：AA 制扣全价（原 -100 与自费 -120 几乎无差，且高于同类聚餐事件 5-10 倍）
      { text: '借公款招待"接待老同学"', effects: {risk: 6, integrity: -5, wealth: -100, desire: 2} },
      { text: '自费请客，撑个场面', effects: {desire: 2, wealth: -120, eq: 2} },
    ]},
    { id: 'ent020', stage: 'work', eventType: 'choice', weight: 6, title: '微腐败整治', text: '群众反映惠民资金"跑冒滴漏"，最后到手的总是"缩水版"。你带队下沉核查，村口围着一圈欲言又止的乡亲。', choices: [
      { text: '逐户走访核对资金到位情况', effects: {workAbility: 3, integrity: 3, mentalPressure: 3} },
      { text: '调取银行流水比对', effects: {workAbility: 2, integrity: 2, mentalPressure: 2, iq: 1} },
      { text: '听取村委会汇报了事', effects: {mentalPressure: -2, risk: 3, integrity: -2} },
      { text: '设立举报箱公开征集线索', effects: {workAbility: 2, integrity: 2, eq: 1} },
    ]},
    // ---------- 乡村振兴主题（15个） ----------
    { id: 'ent021', stage: 'career', eventType: 'choice', weight: 6, title: '驻村第一书记（偏远村）', requireUnitLevelMin: 2, requireUnitLevelMax: 3, excludeFlags: ['grassrootsActive', 'grassrootsDone'], text: '组织选派你到偏远村任驻村第一书记。村部屋顶漏雨，灶台冷清，老乡用怀疑的眼神打量这个"城里来的干部"。接受后保留原单位关系，任期结束根据考核决定去向。', choices: [
      { text: '住下来，先走遍每户人家', effects: {workAbility: 3, desire: 2, integrity: 2, mentalPressure: 3, flag: 'grassrootsWork', grassrootsDispatch: { duration: 2, reason: '驻村第一书记' }} },
      { text: '重点对接村两委班子', effects: {eq: 1, workAbility: 2, mentalPressure: 2, flag: 'grassrootsWork', grassrootsDispatch: { duration: 2, reason: '驻村第一书记' }} },
      { text: '周末回家，平时住村', effects: {workAbility: 2, familyPressure: 2, mentalPressure: 1, flag: 'grassrootsWork', grassrootsDispatch: { duration: 2, reason: '驻村第一书记' }} },
      { text: '走形式，应付了事', effects: {eq: -3, risk: 2, integrity: -3, flag: 'grassrootsWork', grassrootsDispatch: { duration: 2, reason: '驻村第一书记' }} },
    ]},
    { id: 'ent022', stage: 'career', eventType: 'choice', weight: 5, title: '产业项目选择', text: '村里要上乡村产业项目，有人主张种药材，有人主张养牛，还有人想搞光伏。争论三天，意见还是"齐头并进"。', choices: [
      { text: '请农技专家实地论证后再定', effects: {workAbility: 3, iq: 2, desire: 2, mentalPressure: 2} },
      { text: '尊重村民意愿，民主决策', effects: {eq: 1, workAbility: 2, desire: 2} },
      { text: '跟风周边村搞相同项目', effects: {risk: 3, workAbility: 1, mentalPressure: 1, eq: -1} },
      { text: '自己拍板，追求"短平快"', effects: {risk: 4, integrity: -2, desire: 2} },
    ]},
    { id: 'ent023', stage: 'career', eventType: 'choice', weight: 5, title: '农产品滞销（助农）', text: '村里蜜橘丰收却卖不动，果农急得直跺脚。你打开朋友圈，发现"助农"两个字特别好使。', choices: [
      { text: '对接机关食堂和工会集中采购', effects: {workAbility: 3, eq: 1, desire: 2} },
      { text: '发动朋友圈和电商渠道销售', effects: {workAbility: 2, iq: 2, desire: 2} },
      { text: '帮助建立稳定销售渠道', effects: {workAbility: 2, background: 1, mentalPressure: 2} },
      { text: '象征性买几箱自己吃', effects: {eq: -1, risk: 1, mentalPressure: 1} },
    ]},
    { id: 'ent024', stage: 'career', eventType: 'choice', weight: 5, title: '控辍保学', text: '村里有个娃初中没念完就去打工了。家长说"读书无用，早点挣钱"。你看着孩子空荡荡的课桌，心里发堵。', choices: [
      { text: '上门劝说家长，联系学校复学', effects: {workAbility: 3, eq: 1, desire: 2, mentalPressure: 2} },
      { text: '申请教育补助减轻家庭负担', effects: {workAbility: 2, integrity: 2, mentalPressure: 1} },
      { text: '协调企业提供勤工俭学岗位', effects: {workAbility: 2, eq: 1, mentalPressure: 2} },
      { text: '尊重家长选择，不强行干预', effects: {eq: -2, risk: 1, integrity: -1} },
    ]},
    { id: 'ent025', stage: 'career', eventType: 'choice', weight: 5, title: '大病救治', text: '一户脱贫户家中的顶梁柱查出重病，医药费像无底洞。村干部担心这户"因病返贫"，把求助信递到你面前。', choices: [
      { text: '协助申请大病救助和临时救助', effects: {workAbility: 3, integrity: 2, desire: 2, mentalPressure: 2} },
      { text: '发动社会力量众筹', effects: {eq: 1, workAbility: 2, desire: 2} },
      { text: '对接定点医院减免费用', effects: {workAbility: 2, background: 1, mentalPressure: 2} },
      { text: '按政策办，能报多少算多少', effects: {eq: -2, risk: 1, integrity: -1} },
    ]},
    { id: 'ent026', stage: 'career', eventType: 'choice', weight: 4, title: '危房鉴定', text: '一位老人住的土坯房墙裂了缝，下雨天往里灌水。危房鉴定却卡在"差一点点不符合标准"，你站在漏雨的屋檐下犯了难。', choices: [
      { text: '申请复评，争取纳入改造', effects: {workAbility: 3, integrity: 2, desire: 2, mentalPressure: 2} },
      { text: '协调村集体帮助修缮', effects: {eq: 1, workAbility: 2, mentalPressure: 1} },
      { text: '自掏腰包先帮老人修屋顶', effects: {integrity: 3, wealth: -60, desire: 2} },
      { text: '等下批指标再说', effects: {mentalPressure: -1, risk: 2, integrity: -2, eq: -1} },
    ]},
    { id: 'ent027', stage: 'career', eventType: 'choice', weight: 4, title: '山泉引水', text: '山上村民长期喝"望天水"，旱季要翻山去挑。引水管道要穿过两户人家的自留山，"过路费"成了卡脖子的难题。', choices: [
      { text: '反复做工作，讲清集体利益', effects: {eq: 2, workAbility: 2, desire: 2, mentalPressure: 3} },
      { text: '协调置换土地，妥善安置', effects: {workAbility: 2, eq: 1, mentalPressure: 2} },
      { text: '申请项目资金给予补偿', effects: {workAbility: 2, background: 1, mentalPressure: 1} },
      { text: '绕道铺设，多花点钱', effects: {workAbility: 1, wealth: -50, mentalPressure: 1} },
    ]},
    { id: 'ent028', stage: 'career', eventType: 'choice', weight: 5, title: '通组路', text: '"最后一公里"通组路硬化项目卡在资金缺口上。村民天天问"啥时候动工"，你对着账本上的数字叹气。', choices: [
      { text: '申报涉农资金整合解决缺口', effects: {workAbility: 3, integrity: 2, desire: 2, mentalPressure: 2} },
      { text: '发动村民投工投劳降低成本', effects: {eq: 1, workAbility: 2, desire: 2} },
      { text: '争取社会捐资补充', effects: {background: 1, eq: 1, mentalPressure: 2} },
      { text: '等资金全部到位再开工', effects: {mentalPressure: -1, risk: 1, integrity: -1, eq: -1} },
    ]},
    { id: 'ent029', stage: 'career', eventType: 'choice', weight: 5, title: '直播带货', text: '乡里鼓励村干部直播带货。你对着手机镜头，第一次发现"老干部"和"新农人"之间，隔着一道尴尬的屏幕。', choices: [
      { text: '认真学习，亲自上阵直播', effects: {workAbility: 3, iq: 2, desire: 2, mentalPressure: 3} },
      { text: '培养返乡青年做主播', effects: {workAbility: 2, eq: 1, desire: 2} },
      { text: '委托第三方公司运营', effects: {workAbility: 1, risk: 2, mentalPressure: 1} },
      { text: '觉得"不务正业"，搁置不办', effects: {iq: -2, positionWeight: -2, mentalPressure: 1, eq: -1} },
    ]},
    { id: 'ent030', stage: 'career', eventType: 'choice', weight: 4, title: '古村开发', text: '村里有片明清古建筑，开发商想搞旅游开发。可"修旧如旧"和"商业化"之间的平衡，比走钢丝还难。', choices: [
      { text: '聘请专业团队编制保护性规划', effects: {workAbility: 3, iq: 2, desire: 2, mentalPressure: 2} },
      { text: '听取村民和专家双重意见', effects: {eq: 1, workAbility: 2, mentalPressure: 2} },
      { text: '全盘交给开发商运作', effects: {risk: 4, integrity: -2, desire: 2} },
      { text: '暂不开发，维持现状', effects: {integrity: 1, workAbility: 1, mentalPressure: 1} },
    ]},
    { id: 'ent031', stage: 'career', eventType: 'choice', weight: 5, title: '集体资产盘活', text: '村集体有一片闲置厂房，长年"晒太阳"。有人提议低价租给关系户，"反正闲着也是闲着"。', choices: [
      { text: '公开招标出租，阳光运作', effects: {integrity: 3, workAbility: 2, desire: 2, mentalPressure: 2} },
      { text: '引入符合环保要求的产业', effects: {workAbility: 2, eq: 1, mentalPressure: 2} },
      { text: '低价租给"熟人"，收点好处', effects: {risk: 5, integrity: -4, wealth: 50, desire: 2} },
      { text: '维持闲置，避免麻烦', effects: {mentalPressure: -1, risk: 1, integrity: -1, eq: -1} },
    ]},
    { id: 'ent032', stage: 'career', eventType: 'choice', weight: 5, title: '土地流转纠纷', text: '外来大户要连片流转土地种果蔬，可几户"钉子户"死活不签。流转合同摞成一摞，就差最后几个红手印。', choices: [
      { text: '逐户走访，了解顾虑对症下药', effects: {workAbility: 3, eq: 1, desire: 2, mentalPressure: 3} },
      { text: '保障农户流转费和分红权益', effects: {workAbility: 2, integrity: 2, mentalPressure: 2} },
      { text: '提高流转租金，促成签约', effects: {workAbility: 1, wealth: -50, mentalPressure: 1} },
      { text: '强行推进，"为大局着想"', effects: {risk: 4, integrity: -3, eq: -2} },
    ]},
    { id: 'ent033', stage: 'career', eventType: 'choice', weight: 4, title: '合作社规范', text: '村里几家合作社"空壳化"严重，账目混乱，分红成了"糊涂账"。你翻开一本比菜谱还随意的记账本，眉头紧锁。', choices: [
      { text: '开展专项审计，规范财务', effects: {workAbility: 3, integrity: 3, desire: 2, mentalPressure: 3} },
      { text: '建立统一财务管理平台', effects: {workAbility: 2, iq: 2, mentalPressure: 2} },
      { text: '培训合作社负责人', effects: {workAbility: 2, eq: 1, mentalPressure: 1} },
      { text: '睁一只眼闭一只眼', effects: {risk: 3, integrity: -3, mentalPressure: -1, eq: -1} },
    ]},
    { id: 'ent034', stage: 'career', eventType: 'choice', weight: 5, title: '返贫预警', text: '一户脱贫户近期收入骤降，系统亮起"黄色预警"。入户一看，家里的境况比数据更让人揪心。', choices: [
      { text: '纳入重点监测，落实帮扶措施', effects: {workAbility: 3, integrity: 2, desire: 2, mentalPressure: 2} },
      { text: '分析返贫原因，精准施策', effects: {workAbility: 2, iq: 2, mentalPressure: 2} },
      { text: '安排公益岗位兜底', effects: {workAbility: 2, eq: 1, mentalPressure: 1} },
      { text: '等数据"转绿"再说', effects: {mentalPressure: -1, risk: 2, integrity: -2, eq: -1} },
    ]},
    { id: 'ent035', stage: 'career', eventType: 'choice', weight: 5, title: '结对帮扶（脱贫户回访）', text: '你结对帮扶三户脱贫户。一户老人见你就抹眼泪，一户总提"再给点钱"，一户已经开始自己搞养殖。', choices: [
      { text: '因户施策，分类帮扶', effects: {workAbility: 3, eq: 1, desire: 2, mentalPressure: 2} },
      { text: '重点扶持"想干"的那户', effects: {workAbility: 2, positionWeight: 1, mentalPressure: 1} },
      { text: '三户平均用力，雨露均沾', effects: {eq: 1, workAbility: 1, mentalPressure: 2} },
      { text: '自掏腰包"解决问题"', effects: {integrity: 2, wealth: -100, mentalPressure: 1} },
    ]},
    // ---------- 数字经济主题（15个） ----------
    { id: 'ent036', stage: 'work', eventType: 'choice', weight: 6, title: '一网通办（数据打架）', text: '单位推行"一网通办"，可系统之间"数据打架"，同一个数据要填三遍。办事群众在窗口前等得直跺脚。', choices: [
      { text: '推动系统对接，实现数据一次录入', effects: {workAbility: 3, iq: 2, mentalPressure: 3} },
      { text: '优化办事流程，减少重复提交', effects: {workAbility: 2, eq: 1, mentalPressure: 2} },
      { text: '建议上级统筹解决系统壁垒', effects: {background: 1, workAbility: 2, mentalPressure: 1} },
      { text: '维持现状，让群众多跑几趟', effects: {risk: 2, integrity: -2, eq: -2, positionWeight: -2} },
    ]},
    { id: 'ent037', stage: 'work', eventType: 'choice', weight: 5, title: '最多跑一次', text: '"最多跑一次"改革进入深水区，有个高频事项怎么也"跑不下来"。你翻开流程图，发现卡在两个部门"互为前置"。', choices: [
      { text: '协调部门间取消前置条件', effects: {workAbility: 3, iq: 2, mentalPressure: 3} },
      { text: '推行容缺受理，先办后补', effects: {workAbility: 2, integrity: 2, mentalPressure: 2} },
      { text: '申请上级明确牵头部门', effects: {background: 1, workAbility: 2, mentalPressure: 1} },
      { text: '保留现状，"按规定办"', effects: {risk: 1, integrity: -2, mentalPressure: -1, positionWeight: -2} },
    ]},
    { id: 'ent038', stage: 'work', eventType: 'choice', weight: 6, title: '数字政府建设', text: '数字政府建设方案要你牵头起草。技术公司PPT做得天花乱坠，"中台""底座""大脑"一通狂轰滥炸。', choices: [
      { text: '立足业务需求，避免"为数字化而数字化"', effects: {workAbility: 3, iq: 3, mentalPressure: 3} },
      { text: '邀请第三方评估技术方案', effects: {workAbility: 2, iq: 2, mentalPressure: 2} },
      { text: '全盘采纳技术公司方案', effects: {risk: 4, workAbility: 1, mentalPressure: 1} },
      { text: '求稳，先做"小切口"试点', effects: {workAbility: 2, integrity: 2, mentalPressure: 2} },
    ]},
    { id: 'ent039', stage: 'work', eventType: 'choice', weight: 5, title: '城市大脑', text: '"城市大脑"上线运行，可指挥大厅大屏数据滞后严重，"实时"成了"延时"。领导视察前，你盯着那块大屏心慌。', choices: [
      { text: '排查数据链路，解决滞后问题', effects: {workAbility: 3, iq: 2, mentalPressure: 3} },
      { text: '建立数据质量监测机制', effects: {workAbility: 2, iq: 2, mentalPressure: 2} },
      { text: '视察时"美化"数据展示', effects: {risk: 5, integrity: -4, mentalPressure: 2} },
      { text: '实事求是汇报问题和改进计划', effects: {integrity: 3, workAbility: 1, mentalPressure: 2} },
    ]},
    { id: 'ent040', stage: 'work', eventType: 'choice', weight: 5, title: '数据共享壁垒', text: '兄弟部门要共享一份数据，对方以"涉密""隐私"为由推三阻四。你打了八个电话，数据还在原地踏步。', choices: [
      { text: '走正式数据共享协议流程', effects: {workAbility: 3, iq: 2, mentalPressure: 2} },
      { text: '推动建立数据共享清单', effects: {workAbility: 2, iq: 2, mentalPressure: 2} },
      { text: '通过私人关系"通融"', effects: {eq: 1, risk: 3, integrity: -1} },
      { text: '放弃共享，自行采集', effects: {workAbility: 1, mentalPressure: 2, risk: 1} },
    ]},
    { id: 'ent041', stage: 'work', eventType: 'choice', weight: 5, title: '政务公开', text: '上级要求加大政务公开力度，可有些处室"能不公开就不公开"。你催材料催得嘴皮发干，回复永远是"再研究研究"。', choices: [
      { text: '制定公开清单，明确时限', effects: {workAbility: 3, iq: 2, mentalPressure: 2} },
      { text: '纳入绩效考核推动落实', effects: {workAbility: 2, positionWeight: 1, mentalPressure: 2} },
      { text: '尊重处室意见，缓一缓', effects: {mentalPressure: -1, risk: 2, integrity: -2, positionWeight: -2} },
      { text: '只公开"安全"的内容', effects: {risk: 3, integrity: -3, mentalPressure: 1, positionWeight: -2} },
    ]},
    { id: 'ent042', stage: 'work', eventType: 'choice', weight: 4, title: '移动办公APP', text: '单位推广移动办公APP，可系统三天两头崩溃。领导在群里@你："怎么又登不上了？"你盯着加载转圈，手心冒汗。', choices: [
      { text: '协调技术公司限期整改', effects: {workAbility: 3, iq: 2, mentalPressure: 3} },
      { text: '建立问题反馈和快速响应机制', effects: {workAbility: 2, iq: 2, mentalPressure: 2} },
      { text: '让大家"克服一下"，先用纸质', effects: {risk: 2, integrity: -1, mentalPressure: 2, positionWeight: -1} },
      { text: '申请增加带宽和服务器', effects: {workAbility: 1, background: 1, mentalPressure: 1} },
    ]},
    { id: 'ent043', stage: 'work', eventType: 'choice', weight: 5, title: '线上审批', text: '一项审批事项开通线上办理，可老年人不会用手机，到窗口又被告知"请网上办"。大爷大妈堵在门口，情绪激动。', choices: [
      { text: '保留线下窗口，线上线下并行', effects: {workAbility: 3, eq: 1, iq: 2, mentalPressure: 2} },
      { text: '安排专人指导老年人线上操作', effects: {workAbility: 2, eq: 2, mentalPressure: 2} },
      { text: '联合社区开展培训', effects: {workAbility: 2, background: 1, mentalPressure: 2} },
      { text: '坚持线上办，"大势所趋"', effects: {risk: 3, integrity: -2, eq: -3, positionWeight: -2} },
    ]},
    { id: 'ent044', stage: 'work', eventType: 'choice', weight: 4, title: '电子证照', text: '推行电子证照，可群众反映"扫不出来""不认"。你拿着手机在窗口试了五次，二维码红得刺眼。', choices: [
      { text: '协调系统升级，提升识别率', effects: {workAbility: 3, iq: 2, mentalPressure: 3} },
      { text: '建立电子证照应用场景清单', effects: {workAbility: 2, iq: 2, mentalPressure: 2} },
      { text: '暂时并行纸质证照', effects: {workAbility: 1, mentalPressure: 1, risk: 1} },
      { text: '强制使用电子证照', effects: {risk: 3, integrity: -2, eq: -2, positionWeight: -2} },
    ]},
    { id: 'ent045', stage: 'work', eventType: 'choice', weight: 4, title: '电子印章', text: '单位要启用电子印章，可几位老同志"不放心"，认为"盖红章才算数"。印章管理处钥匙攥得紧紧的。', choices: [
      { text: '组织培训，演示技术原理', effects: {workAbility: 3, iq: 2, mentalPressure: 2} },
      { text: '先试点后推广，让大家适应', effects: {workAbility: 2, iq: 2, mentalPressure: 2} },
      { text: '尊重老同志意见，暂缓推进', effects: {mentalPressure: -1, positionWeight: -2, risk: 1} },
      { text: '强制启用，规定时限切换', effects: {risk: 3, eq: -2, mentalPressure: 2} },
    ]},
    { id: 'ent046', stage: 'work', eventType: 'choice', weight: 4, title: '区块链存证', text: '一个区块链存证项目立项，技术方说"上链不可篡改"。可业务处室质疑"上链前数据造假怎么办"，会议室空气突然凝固。', choices: [
      { text: '完善上链前数据审核机制', effects: {workAbility: 3, iq: 3, mentalPressure: 3} },
      { text: '小范围试点验证效果', effects: {workAbility: 2, iq: 2, mentalPressure: 2} },
      { text: '全流程上链，相信技术', effects: {risk: 4, workAbility: 1, mentalPressure: 1} },
      { text: '暂缓推进，等成熟案例', effects: {mentalPressure: -1, positionWeight: -1, risk: 1} },
    ]},
    { id: 'ent047', stage: 'work', eventType: 'choice', weight: 5, title: 'AI辅助决策', text: '引入AI辅助决策系统，可一次输出的建议明显有偏差。领导问你"这AI靠谱吗"，你想起那句"垃圾进、垃圾出"。', choices: [
      { text: '排查数据源，优化算法模型', effects: {workAbility: 3, iq: 3, mentalPressure: 3} },
      { text: '人工复核，AI仅作参考', effects: {workAbility: 2, iq: 2, integrity: 2, mentalPressure: 2} },
      { text: '全盘采纳AI建议', effects: {risk: 5, integrity: -3, mentalPressure: 1} },
      { text: '暂停使用，重新评估', effects: {workAbility: 1, mentalPressure: 2, risk: 1, positionWeight: -1} },
    ]},
    { id: 'ent048', stage: 'work', eventType: 'choice', weight: 5, title: '大数据分析报告', text: '一份大数据分析报告摆上案头，结论与你的判断相左。数据不会说话，但会"讲故事"，你盯着图表反复推敲。', choices: [
      { text: '核实数据来源和分析方法', effects: {workAbility: 3, iq: 3, mentalPressure: 3} },
      { text: '结合一线调研交叉验证', effects: {workAbility: 2, eq: 1, iq: 2, mentalPressure: 2} },
      { text: '相信数据，调整原判断', effects: {iq: 1, risk: 3, mentalPressure: 1} },
      { text: '选择性采纳支持自己观点的部分', effects: {risk: 4, integrity: -3, mentalPressure: 1} },
    ]},
    { id: 'ent049', stage: 'work', eventType: 'choice', weight: 5, title: '互联网+监管', text: '"互联网+监管"要求非现场监管数据实时上传。可企业反映"重复报送""多头要数据"，怨声载道。', choices: [
      { text: '推进监管数据归集，一次采集多方使用', effects: {workAbility: 3, iq: 2, mentalPressure: 3} },
      { text: '建立企业数据报送负面清单', effects: {workAbility: 2, eq: 1, iq: 2, mentalPressure: 2} },
      { text: '听从各业务线要求，多头报送', effects: {risk: 2, integrity: -2, eq: -2, positionWeight: -1} },
      { text: '简化监管流程，减轻企业负担', effects: {workAbility: 2, positionWeight: 1, mentalPressure: 2} },
    ]},
    { id: 'ent050', stage: 'work', eventType: 'choice', weight: 5, title: '数字鸿沟', text: '数字化服务全面铺开，可偏远山区老人连智能手机都不会用。"数字便利"对他们而言，像隔着一座山。', choices: [
      { text: '保留人工服务窗口，兜底保障', effects: {workAbility: 3, iq: 2, integrity: 2, mentalPressure: 2} },
      { text: '组织志愿者下乡指导', effects: {workAbility: 2, eq: 2, desire: 2, mentalPressure: 2} },
      { text: '开发适老化简化版本', effects: {workAbility: 2, iq: 3, mentalPressure: 2} },
      { text: '认为"大势所趋"，让他们自行适应', effects: {risk: 3, integrity: -3, eq: -3, positionWeight: -2} },
    ]},
    // ---------- v2.16 新增：深渊与救赎（打通孤儿 flag 的事件链，共15个） ----------
    // 腐败深渊：furtherCorruption 的后续（此前设置了 flag 却无任何事件消费，"答应继续贪腐"后毫无下文）
    { id: 'ent051', stage: 'work', eventType: 'auto', weight: 8, requireFlag: 'furtherCorruption', excludeFlag: 'corruptionSaved', title: '深渊回望', text: '深夜加班，你盯着电脑屏幕出神。想起那次"答应对方的要求"，一股寒意从脚底升起——有些路，走下去就回不了头了。', effects: {risk: 10, desire: 8, mentalPressure: 6, reputation: -2} },
    { id: 'ent052', stage: 'work', eventType: 'choice', weight: 6, requireFlag: 'furtherCorruption', excludeFlag: 'corruptionSaved', title: '悬崖勒马', text: '单位组织廉政自查，你在"有无利用职权谋取私利"一栏前停了很久。笔尖悬在半空，落下就是另一种人生。', choices: [
      { text: '主动向组织说明情况', effects: {integrity: 10, risk: -8, reputation: 3, mentalPressure: -6, flag: 'corruptionSaved', deleteFlag: 'furtherCorruption'} },
      { text: '继续把事瞒下去', effects: {risk: 8, desire: 5, mentalPressure: 5} },
    ]},
    { id: 'ent053', stage: 'work', eventType: 'auto', weight: 6, requireFlag: 'furtherCorruption', excludeFlag: 'corruptionSaved', title: '风声渐紧', text: '审计组进驻的前一天，你那个"合作伙伴"的电话突然打不通了。你数了数抽屉里没来得及处理的票据，手心全是汗。', effects: {risk: 12, heat: 4, mentalPressure: 8} },
    { id: 'ent054', stage: 'work', eventType: 'auto', weight: 5, requireFlag: 'furtherCorruption', excludeFlag: 'corruptionSaved', title: '专项检查来了', text: '纪委专项检查组进驻单位，谈话名单里有你。走廊里碰到组长，他看了你一眼，那一眼像是看穿了什么。', effects: {risk: 15, heat: 8, integrity: -3, mentalPressure: 10} },
    { id: 'ent055', stage: 'work', eventType: 'choice', weight: 5, requireFlag: 'furtherCorruption', excludeFlag: 'corruptionSaved', title: '最后的坦白', text: '调查组约谈通知到了桌上，明早九点。这一夜你辗转难眠，窗外的路灯亮了一整夜，像一双不肯闭上的眼睛。', choices: [
      { text: '主动投案，交代全部问题', effects: {integrity: 12, risk: -15, reputation: -5, mentalPressure: -10, flag: 'corruptionSaved', deleteFlag: 'furtherCorruption'} },
      { text: '再赌一把，把希望押在"没人查得出来"上', effects: {risk: 10, desire: 8, mentalPressure: 8} },
    ]},
    // 黑料抉择：recordedBlackmail / recordedConspiracy（交出=抽身，留着=沉沦）
    { id: 'ent056', stage: 'life', eventType: 'choice', weight: 6, requireFlag: 'recordedBlackmail', title: '照片的代价', text: '手机里那张照片像块烫手的山芋。你本想拿它自保，可每次点开它，都觉得自己正在变成当初最不齿的那种人。', choices: [
      { text: '匿名把照片交给组织', effects: {integrity: 8, risk: -5, reputation: 2, mentalPressure: -5, deleteFlag: 'recordedBlackmail', flag: 'whistleblower'} },
      { text: '继续握在手里当筹码', effects: {desire: 5, risk: 6, mentalPressure: 3} },
    ]},
    { id: 'ent057', stage: 'life', eventType: 'choice', weight: 6, requireFlag: 'recordedConspiracy', title: '录音的抉择', text: '那段录音躺在加密文件夹里。交出去，你可能得罪一票人；不交，它就像定时炸弹，迟早炸到自己。', choices: [
      { text: '匿名上交录音，抽身而退', effects: {integrity: 10, risk: -8, heat: -5, mentalPressure: -6, deleteFlag: 'recordedConspiracy', flag: 'whistleblower'} },
      { text: '留作自保筹码，谁也不给', effects: {risk: 5, desire: 4, mentalPressure: 4} },
    ]},
    // 资产终局：overseasTransfer / bribedInvestigator
    { id: 'ent058', stage: 'life', eventType: 'auto', weight: 8, requireFlag: 'overseasTransfer', title: '境外账户的回声', text: '海外账户的银行经理发来一封措辞客气的邮件："例行合规审查"。你知道，跨境资金监测系统已经标记了你。', effects: {risk: 15, heat: 5, mentalPressure: 8} },
    { id: 'ent059', stage: 'work', eventType: 'choice', weight: 6, requireFlag: 'bribedInvestigator', title: '最后防线', text: '调查组约谈你时，你发现那位"打过招呼"的办案人员换了人。新来的年轻干部油盐不进，你的心里一沉。', choices: [
      { text: '坦白并配合调查', effects: {risk: -15, integrity: 15, reputation: -3, mentalPressure: -8, deleteFlag: 'bribedInvestigator', flag: 'corruptionSaved'} },
      { text: '试图加码收买', effects: {risk: 10, heat: 6, wealth: -20, desire: 5} },
    ]},
    // 救赎新生：corruptionSaved 之后的正向循环
    { id: 'ent060', stage: 'work', eventType: 'auto', weight: 10, requireFlag: 'corruptionSaved', title: '重新出发', text: '组织给了你改正的机会。处分决定书上盖着鲜红的章，但走出谈话室时，你第一次觉得阳光是干净的。', effects: {integrity: 5, mentalPressure: -8, risk: -5, reputation: 2} },
    { id: 'ent061', stage: 'work', eventType: 'auto', weight: 8, requireFlag: 'corruptionSaved', title: '以案为鉴', text: '警示教育大会上，你坐在台下听自己熟悉的案情被剖析。散会后同事拍了拍你肩膀："走，吃饭去。"你笑了笑，如释重负。', effects: {iq: 1, integrity: 3, mentalPressure: -3} },
    // 书香：bookReader 的后续
    { id: 'ent062', stage: 'life', eventType: 'auto', weight: 8, requireFlag: 'bookReader', title: '读书会友', text: '你读书的习惯坚持了下来。机关读书会上，你引经据典的发言让分管领导多看了你两眼——知识这东西，藏不住。', effects: {iq: 1, reputation: 2, mentalPressure: -2} },
    { id: 'ent063', stage: 'work', eventType: 'choice', weight: 6, requireFlag: 'bookReader', excludeFlag: 'bookPublished', title: '著书立说（编辑约稿）', text: '你积累的笔记已厚厚一摞，出版社编辑偶然看到后连连称赞，说这样的实务专著市面上稀缺。', choices: [
      { text: '整理出版专著', effects: {reputation: 10, wealth: 15, heat: 3, workAbility: 2, flag: 'bookPublished'} },
      { text: '在系统内交流传阅', effects: {iq: 2, reputation: 4, workAbility: 2, flag: 'bookPublished'} },
    ]},
    // 人情：gaveGift 的后续
    { id: 'ent064', stage: 'life', eventType: 'choice', weight: 6, requireFlag: 'gaveGift', title: '礼尚往来', text: '上次那份心意十足的礼物，对方记住了。中秋将至，对方秘书悄悄问你"今年还送吗"，语气熟稔得像老朋友。', choices: [
      { text: '继续维系这份关系', effects: {eq: 1, background: 2, reputation: 1, risk: 2} },
      { text: '点到为止，不再来往', effects: {integrity: 3, risk: -2, eq: 1} },
    ]},
    // 串供余波：conspired 的代价
    { id: 'ent065', stage: 'work', eventType: 'auto', weight: 7, requireFlag: 'conspired', excludeFlag: 'corruptionSaved', title: '串供的余波', text: '你们统一好的口径，在谈话中被办案人员轻描淡写地戳穿了一角。你猛然意识到，对方手里掌握的材料比你们想象的要多得多。', effects: {risk: 10, mentalPressure: 6, familyPressure: 4} },
    // ---------- v2.17 新增：正义的回响（whistleblower / witnessStrong / cleanHero 链，共9个） ----------
    { id: 'ent066', stage: 'work', eventType: 'auto', weight: 8, requireFlag: 'whistleblower', title: '匿名举报的余波', text: '你交出去的材料在系统里转了几天，相关单位开始有人被约谈。没人知道是你递的刀，但你走路时脊背悄悄挺直了一些。', effects: {reputation: 3, risk: -5, mentalPressure: -4, integrity: 3} },
    { id: 'ent067', stage: 'work', eventType: 'choice', weight: 7, requireFlag: 'whistleblower', title: '组织找你谈话', text: '纪检组的同志约你谈话，问得很细："你了解的情况，愿意配合进一步核实吗？"你端起茶杯，水温刚好。', choices: [
      { text: '全力配合，知无不言', effects: {integrity: 8, background: 2, mentalPressure: 2, risk: -3, flag: 'witnessStrong'} },
      { text: '点到为止，不想惹麻烦', effects: {eq: 1, risk: -2, reputation: -1, mentalPressure: -1} },
    ]},
    { id: 'ent068', stage: 'work', eventType: 'auto', weight: 7, requireFlag: 'witnessStrong', title: '正义的回响', text: '专案组成立了，你被点名参加外围取证组。同事们私下嘀咕"这次是动真格的"，你低头整理材料，没接话。', effects: {reputation: 5, integrity: 5, positionWeight: 2, workAbility: 2} },
    { id: 'ent069', stage: 'work', eventType: 'choice', weight: 6, requireFlag: 'witnessStrong', requireRisk: 20, title: '举报人保护', text: '有人在打听专案组外围人员名单。组织找你谈话，提出可以安排轮岗保护，你第一次感到"背后有人"的分量。', choices: [
      { text: '接受组织保护安排', effects: {risk: -15, mentalPressure: -5, eq: 1} },
      { text: '婉拒，照常上下班', effects: {reputation: 2, risk: 5, mentalPressure: 3} },
    ]},
    { id: 'ent070', stage: 'work', eventType: 'auto', weight: 6, requireFlag: 'witnessStrong', title: '风清月明', text: '案子尘埃落定，相关责任人受到处理。你在院子里站了很久，秋天的风很干净，你终于可以睡个安稳觉了。', effects: {reputation: 6, positionWeight: 3, mentalPressure: -8, flag: 'cleanHero'} },
    { id: 'ent074', stage: 'work', eventType: 'auto', weight: 7, requireFlag: 'cleanHero', title: '组织考察', text: '年度考察谈话时，分管领导提到你："关键时刻站得出来，这样的干部要用起来。"你低头记笔记，心里泛起微澜。', effects: {reputation: 4, positionWeight: 2, background: 2} },
    // 著书立说：bookPublished 的后续
    { id: 'ent071', stage: 'life', eventType: 'auto', weight: 8, requireFlag: 'bookPublished', title: '新书签售', text: '你的专著上市了，系统内订了不少。签售那天来了几十个同行，有人拿着书让你签名，你写的是"共勉"二字。', effects: {reputation: 4, wealth: 5, mentalPressure: -2} },
    { id: 'ent072', stage: 'work', eventType: 'choice', weight: 6, requireFlag: 'bookPublished', title: '讲座邀请', text: '党校的讲座邀请函送到桌上，讲你的实务经验。台下坐的都是科处级干部，讲好了是名声，讲砸了也是名声。', choices: [
      { text: '接受邀请，认真备课', effects: {reputation: 6, background: 2, positionWeight: 2, workAbility: 2, mentalPressure: 3} },
      { text: '婉拒，专注本职工作', effects: {integrity: 2, reputation: 2, eq: 1} },
    ]},
    // 健身风尚：fitnessLeader 的后续
    { id: 'ent073', stage: 'life', eventType: 'auto', weight: 7, requireFlag: 'fitnessLeader', title: '健康风尚', text: '你带动的健身风气在单位蔓延，午休时走廊里都是散步的同事。领导在会上表扬了一句，你心想：这比什么团建都实在。', effects: {body: 1, reputation: 2, mentalPressure: -2} },
    // ---------- v2.19 时代剧本专属事件（reform/stable/rectify 各 6 个，era 字段限定） ----------
    // ===== 改革年代 ⚡ =====
    { id: 'ent075', era: ['reform'], stage: 'work', eventType: 'choice', weight: 8, title: '改革试点先行', text: '单位被列为改革试点，任务重、节奏快、没人干过。领导在会上点名："年轻人要多担事。"你的笔记本上画了个圈。', choices: [
      { text: '主动请缨牵头试点', effects: {positionWeight: 3, workAbility: 3, mentalPressure: 5, desire: 2} },
      { text: '先观望，等第一批趟完雷', effects: {risk: -2, mentalPressure: -2, desire: -1} },
      { text: '推荐业务骨干担纲，你做保障', effects: {eq: 1, workAbility: 1, background: 1} },
    ]},
    { id: 'ent076', era: ['reform'], stage: 'work', eventType: 'choice', weight: 7, title: '招商大会战', text: '全县招商引资百日攻坚启动，各局都有指标。你负责的产业链项目，几家目标企业态度暧昧，都在等政策细则。', choices: [
      { text: '带队驻点攻坚，紧盯落地', effects: {workAbility: 3, background: 2, heat: 2, mentalPressure: 4} },
      { text: '吃透政策做足功课，精准对接', effects: {iq: 2, workAbility: 2, reputation: 2} },
      { text: '数字上想办法，报表上见成绩', effects: {risk: 6, integrity: -4, positionWeight: 1} },
    ]},
    { id: 'ent077', era: ['reform'], stage: 'work', eventType: 'auto', weight: 6, title: '机构精简风暴', text: '机构改革方案征求意见稿流出来了，几个科室要合并，岗位要重新竞聘。走廊里的空气突然安静，谁也不知道自己明天在哪个办公室。', effects: {positionWeight: -3, mentalPressure: 8, risk: 3, desire: 3} },
    { id: 'ent078', era: ['reform'], stage: 'life', eventType: 'choice', weight: 6, title: '下海潮', text: '同学聚会成了辞职报告分享会。做外贸的老张说"体制外空气都是自由的"，你算了算房贷，又看了看领导的脸色。', choices: [
      { text: '心动，认真考虑下海', effects: {desire: 6, wealth: 15, mentalPressure: -3, risk: 5} },
      { text: '坚守岗位，体制内也有春天', effects: {integrity: 3, reputation: 2, mentalPressure: 2} },
      { text: '劝老张想清楚，别头脑发热', effects: {eq: 1, reputation: 1} },
    ]},
    { id: 'ent079', era: ['reform'], stage: 'work', eventType: 'auto', weight: 7, title: '数字政府攻坚', text: '全省数字政府建设提速，所有事项要求"一网通办"。你加班到十点，把流程图上最后一个堵点打通了，系统里的绿灯次第亮起。', effects: {workAbility: 3, iq: 2, mentalPressure: 3, background: 1} },
    { id: 'ent080', era: ['reform'], stage: 'work', eventType: 'auto', weight: 6, title: '破格提拔', text: '改革年代能者上，组织开始不拘一格用人才。你的名字出现在后备干部名单上，同事们的目光多了几分深意。', effects: {positionWeight: 4, desire: 4, heat: 2, mentalPressure: 3} },
    // ===== 平稳年代 🕊️ =====
    { id: 'ent081', era: ['stable'], stage: 'life', eventType: 'auto', weight: 8, title: '岁月静好', text: '这一年没什么大事：工作照旧，工资照发，孩子照常上学。你在院子里浇花时想，或许这就是大多数人的一生，也挺好。', effects: {mentalPressure: -5, familyPressure: -3, reputation: 1} },
    { id: 'ent082', year: [35, 65], era: ['stable'], stage: 'work', eventType: 'choice', weight: 7, title: '老同事退休', text: '老科长光荣退休，岗位空缺。按资历你排得上号，但新来的研究生学历更亮眼，组织在斟酌。', choices: [
      { text: '主动向组织汇报想法', effects: {positionWeight: 2, desire: 3, mentalPressure: 2} },
      { text: '认真站好最后一班岗等结果', effects: {workAbility: 2, reputation: 2, integrity: 1} },
      { text: '张罗退休仪式，送老科长体面离场', effects: {eq: 1, reputation: 2, background: 1} },
    ]},
    { id: 'ent083', era: ['stable'], stage: 'work', eventType: 'auto', weight: 6, title: '单位合并传闻', text: '隔壁单位要与你们合并的传闻传了大半年，最后不了了之。大家虚惊一场，照旧喝茶看报，只有你偷偷投出去的简历成了笑话。', effects: {mentalPressure: 4, risk: -1, desire: -2} },
    { id: 'ent084', era: ['stable'], stage: 'life', eventType: 'auto', weight: 7, title: '工间操', text: '单位响应号召恢复工间操，上午十点广播一响，全楼都动起来。你跟着做了半个月，颈椎居然不响了。', effects: {body: 1, mentalPressure: -2, eq: 1} },
    { id: 'ent085', era: ['stable'], stage: 'life', eventType: 'auto', weight: 6, title: '邻里和谐', text: '社区组织邻里节，你带着孩子参加了包饺子大赛。回家路上孩子说"爸爸今天笑得真多"，你愣了一下。', effects: {familyPressure: -3, eq: 1, mentalPressure: -1} },
    { id: 'ent086', era: ['stable'], stage: 'work', eventType: 'auto', weight: 7, title: '温水里的晋升', text: '论资排辈的名单终于轮到你。没有惊喜，没有波折，公示期平静得像什么都没发生。你签完字，把文件归档。', effects: {positionWeight: 2, reputation: 1, desire: -1} },
    // ===== 整顿年代 ⚖️ =====
    { id: 'ent087', era: ['rectify'], stage: 'work', eventType: 'auto', weight: 8, title: '专项巡视进驻', text: '巡视组进驻单位，信访信箱前人头攒动。你路过时看了一眼，那红色的箱子像一只不眨眼的眼睛。', effects: {risk: 8, mentalPressure: 6, desire: -3} },
    { id: 'ent088', era: ['rectify'], stage: 'work', eventType: 'choice', weight: 7, title: '廉政档案建立', text: '组织为每名干部建立廉政档案，要求如实填报个人有关事项。表格最后一栏"有无需要说明的问题"，你停了很久。', choices: [
      { text: '如实填报，心里坦然', effects: {integrity: 5, reputation: 2, mentalPressure: -2} },
      { text: '隐去细节，轻描淡写', effects: {risk: 10, mentalPressure: 5, integrity: -3} },
    ]},
    { id: 'ent089', era: ['rectify'], stage: 'work', eventType: 'choice', weight: 7, title: '主动交代窗口', text: '动员会上，领导念了"惩前毖后、治病救人"八个字：主动交代问题，可以从宽处理。散会后，有人在你身后清了清嗓子。', choices: [
      { text: '主动向组织交代历史问题', effects: {risk: -15, integrity: 8, reputation: -2, mentalPressure: -8, flag: 'corruptionSaved'} },
      { text: '行得正坐得直，没什么可交代', effects: {integrity: 3, reputation: 1, mentalPressure: 2} },
      { text: '观望，看别人怎么处理再说', effects: {risk: 5, mentalPressure: -1} },
    ]},
    { id: 'ent090', era: ['rectify'], stage: 'work', eventType: 'auto', weight: 6, title: '反腐成果展', text: '警示教育基地里，展板上那些曾经意气风发的面孔让你心里发紧。讲解员的声音很平静，你听得后背发凉。', effects: {integrity: 4, mentalPressure: 2, desire: -2} },
    { id: 'ent091', era: ['rectify'], stage: 'work', eventType: 'choice', weight: 6, title: '清风学堂', text: '廉政教育轮训班开班，一周脱产学习。同班的老同学递来眼神："晚上聚聚？"课表上写着：案例研讨、心得交流。', choices: [
      { text: '认真学、认真记、认真写心得', effects: {integrity: 3, workAbility: 1, reputation: 1} },
      { text: '应付了事，混个结业', effects: {risk: 2, mentalPressure: -1} },
      { text: '借机结识各单位同学', effects: {eq: 1, background: 2, risk: 1} },
    ]},
    { id: 'ent092', era: ['rectify'], stage: 'life', eventType: 'auto', weight: 6, title: '举报信箱启用', text: '新的举报渠道上线，手机扫码就能反映问题。办公室里大家心照不宣，聊天都客气了几分，空气里多了一丝微妙的紧张。', effects: {risk: 3, heat: 2, integrity: 2, mentalPressure: 2} },
    // ---------- v2.20 人际网络：联系人互动事件（requireContactMin 关系门槛） ----------
    { id: 'ent093', stage: 'work', eventType: 'auto', weight: 7, requireContact: 'noble', requireContactMin: 40, title: '贵人指点', text: '汇报完工作，领导多留了你几分钟，随口点拨了几句门道。你听完恍然大悟：原来有些事还能这么做。', effects: {workAbility: 2, positionWeight: 2, mentalPressure: -2} },
    { id: 'ent094', stage: 'work', eventType: 'auto', weight: 5, requireContact: 'noble', requireContactMin: 70, title: '贵人提携（考察提名）', text: '组织考察前夕，那位一直看好你的领导在关键场合提了你的名字。有人记在了小本子上，有人记在了心里。', effects: {positionWeight: 4, reputation: 3, heat: 2, mentalPressure: 3} },
    { id: 'ent095', stage: 'work', eventType: 'choice', weight: 6, requireContact: 'noble', requireContactMin: 50, title: '贵人落难', text: '你的贵人在一次人事风波中处境微妙。有人暗示你"站好队"，也有人说"患难见真情"。深夜的办公室里，你对着那份人事任免方案发呆。', choices: [
      { text: '施以援手，为他说话', effects: {eq: 1, background: 3, risk: 3, contactRelation: { id: 'noble', delta: 15} } },
      { text: '明哲保身，避避风头', effects: {reputation: -2, mentalPressure: 2, contactRelation: { id: 'noble', delta: -15} } },
    ]},
    { id: 'ent096', stage: 'work', eventType: 'auto', weight: 7, requireContact: 'neighbor', requireContactMin: 40, title: '老干部指路', text: '退休老干部在楼下下棋时拉你坐了一会儿，聊起他当年在组织部门的经历。那些弯弯绕绕，他说得云淡风轻。', effects: {background: 2, iq: 1, mentalPressure: -2} },
    { id: 'ent097', stage: 'work', eventType: 'auto', weight: 5, requireContact: 'neighbor', requireContactMin: 70, title: '老干部牵线', text: '老干部递给你一张便条，上面是一个名字和一个电话："去见见他，提我的名字就行。"你攥着纸条，手心有点出汗。', effects: {positionWeight: 3, reputation: 2, background: 2} },
    { id: 'ent098', stage: 'life', eventType: 'auto', weight: 7, requireContact: 'classmate', requireContactMin: 30, title: '同学聚会（老友）', text: '体制内的老同学攒了个局，来的都是各单位骨干。酒过三巡，大家交换了联系方式，也交换了心照不宣。', effects: {eq: 1, mentalPressure: -3, background: 1} },
    { id: 'ent099', stage: 'life', eventType: 'choice', weight: 6, requireContact: 'classmate', requireContactMin: 40, title: '同学求助', text: '老同学在基层单位碰上难题，开口向你求助。帮，可能要搭上人情和精力；不帮，多年同窗的情分就淡了。', choices: [
      { text: '尽力帮忙，牵线搭桥', effects: {wealth: -15, eq: 1, reputation: 1, background: 2, contactRelation: { id: 'classmate', delta: 10} } },
      { text: '婉拒，各自保重', effects: {integrity: 1, eq: -1, contactRelation: { id: 'classmate', delta: -8} } },
    ]},
    { id: 'ent100', stage: 'life', eventType: 'auto', weight: 7, requireContact: 'oldFriend', requireContactMin: 20, title: '朋友倾诉', text: '发小约你吃烧烤，两瓶啤酒下肚，你说了很多平时不会说的话。他听着，没插嘴，最后说："走，送你回家。"', effects: {mentalPressure: -6, familyPressure: -2, eq: 1} },
    { id: 'ent101', stage: 'life', eventType: 'choice', weight: 6, requireContact: 'oldFriend', requireContactMin: 30, title: '朋友借钱', text: '老朋友生意周转不开，开口借十万。他说得吞吞吐吐，你知道他是真遇到了难处。', choices: [
      { text: '借他，救人急难', effects: {wealth: -10, eq: 1, reputation: 1, contactRelation: { id: 'oldFriend', delta: 10} } },
      { text: '委婉拒绝，建议他找银行', effects: {integrity: 1, eq: -1, contactRelation: { id: 'oldFriend', delta: -6} } },
    ]},
    { id: 'ent102', stage: 'life', eventType: 'choice', weight: 5, requireContact: 'business', requireContactMin: 30, title: '生意邀约', text: '生意伙伴神秘兮兮地找你喝茶："有个项目，稳赚不赔，就差一个体制内的朋友把关。"茶很香，话里有钩子。', choices: [
      { text: '听他说说，帮忙把关', effects: {wealth: 15, risk: 5, integrity: -2, contactRelation: { id: 'business', delta: 8} } },
      { text: '婉拒，不碰红线', effects: {integrity: 2, reputation: 1, contactRelation: { id: 'business', delta: -5} } },
    ]},
    { id: 'ent103', stage: 'work', eventType: 'auto', weight: 6, requireContact: 'noble', requireContactMin: 60, title: '贵人调任', text: '领导调任他市，临走前专门把你叫到办公室，聊了半小时。他说："好好干，你的路还长。"门关上的一刻，你知道有些路要靠自己走了。', effects: {positionWeight: 2, mentalPressure: -2, reputation: 1, contactRelation: { id: 'noble', delta: -10} } },
    { id: 'ent104', stage: 'work', eventType: 'auto', weight: 6, requireContact: 'classmate', requireContactMin: 50, title: '同学高升', text: '体制内的老同学升任处级，消息在同学群里炸开了锅。你发了条祝贺，他回了句："下次聚，我请。"', effects: {reputation: 2, background: 2, desire: 2} },
    // ---------- v2.22 家庭剧情线（子女成长，requireChildAgeMin 门槛） ----------
    { id: 'ent105', stage: 'life', eventType: 'auto', weight: 8, requireChild: true, requireChildAgeMin: 12, title: '孩子升学（小升初）', text: '孩子小升初，成绩单寄到家里。你在单位忙了一天回来，看见孩子趴在桌上等你签字，试卷上的红勾比你的疲惫更醒目。', effects: {familyPressure: -4, mentalPressure: -2, reputation: 1, eq: 1} },
    { id: 'ent106', stage: 'life', eventType: 'choice', weight: 7, requireChild: true, requireChildAgeMin: 12, requireChildAgeMax: 17, title: '青春期的孩子', text: '孩子进入青春期，锁了房间门，和你说话的次数越来越少。老师来电话说最近上课走神，你才发现自己好久没问过他想要什么。', choices: [
      { text: '放下工作，好好谈一次', effects: {eq: 1, mentalPressure: 2, familyPressure: -3, flag: 'childTalk'} },
      { text: '请老师多费心，严加管教', effects: {familyPressure: 2, risk: 1, mentalPressure: 1} },
      { text: '孩子长大了，随他去吧', effects: {desire: 1, familyPressure: 2, integrity: -1} },
    ]},
    { id: 'ent107', stage: 'life', eventType: 'auto', weight: 6, requireChild: true, requireChildAgeMin: 10, requireFlag: 'childTalk', title: '亲子关系修复', text: '那次深谈之后，孩子愿意跟你分享学校的事了。晚饭桌上他讲同桌的糗事，你笑了，忽然觉得这些年的忙碌都值得。', effects: {familyPressure: -5, eq: 1, mentalPressure: -2, flag: 'childClose'} },
    { id: 'ent108', stage: 'life', eventType: 'auto', weight: 8, requireChild: true, requireChildAgeMin: 18, title: '孩子高考', text: '孩子高考结束，走出考场时冲你比了个"OK"。放榜那天，你比查自己成绩还紧张——录取通知书到的那天，你请了全单位的人吃糖。', effects: {familyPressure: -6, reputation: 3, mentalPressure: -3, flag: 'childCollege'} },
    { id: 'ent109', stage: 'life', eventType: 'auto', weight: 7, requireChild: true, requireChildAgeMin: 22, title: '孩子就业', text: '孩子毕业了。学金融的去了银行，学师范的考了教师编——你嘴上说"尊重孩子的选择"，心里其实偷偷松了一口气。', effects: {familyPressure: -5, reputation: 2, wealth: 5, flag: 'childEmployed'} },
    { id: 'ent110', stage: 'life', eventType: 'auto', weight: 6, requireChild: true, requireChildAgeMin: 20, title: '孩子创业', text: '孩子放弃稳定的offer，要跟同学合伙开公司。你反对过、失眠过，最后还是把攒的钱交到他手里："别赔光就行。"', effects: {wealth: -15, desire: 3, familyPressure: 3, mentalPressure: 3} },
    { id: 'ent111', stage: 'life', eventType: 'auto', weight: 7, requireChild: true, requireChildAgeMin: 8, title: '天伦之乐', text: '周末带孩子回老家，孩子在院子里追鸡赶鸭，老母亲笑得合不拢嘴。你坐在门槛上，觉得这大概就是拼命的全部意义。', effects: {familyPressure: -8, mentalPressure: -5, eq: 1, reputation: 1} },
    { id: 'ent112', stage: 'life', eventType: 'auto', weight: 6, requireChild: true, requireChildAgeMin: 18, title: '孩子独立', text: '孩子收拾行李去外地工作，你送他到车站。他回头挥挥手："爸/妈，走了。"你站在原地很久，突然发现他比你高了。', effects: {familyPressure: -6, mentalPressure: -2, desire: 1, reputation: 1} },
    { id: 'ent114', stage: 'life', eventType: 'auto', weight: 6, requireFlag: 'childClose', requireChildAgeMin: 18, title: '孩子的信', text: '书桌上放着孩子寄来的信，一笔一划还是小时候练字的样子："爸/妈，我在外面挺好的。谢谢你那时候愿意听我说话。"你读了两遍，把信收进抽屉。', effects: {familyPressure: -5, eq: 1, mentalPressure: -2, reputation: 1} },
    // ---------- v2.26 家庭二期：子女职业选择（成年后的人生路口） ----------
    { id: 'ent115', stage: 'life', eventType: 'choice', weight: 10, requireChild: true, requireChildAgeMin: 18, title: '孩子的人生路口', text: '孩子十八岁了，成绩出来，志愿单摆在饭桌上。他/她看着你，等你先说。这一笔，会写进两代人的故事里。', choices: [
      { text: '支持孩子考编，子承父业', effects: {flag: 'childCareerOfficial', familyPressure: -3, reputation: 2, mentalPressure: 1, careerLogNote: '👨‍👩‍👦 孩子选择考编，家里全力支持'} },
      { text: '支持孩子闯一闯，下海经商', effects: {flag: 'childCareerBusiness', wealth: 15, desire: 2, risk: 1, careerLogNote: '👨‍👩‍👦 孩子选择经商，家里给了第一桶金'} },
      { text: '尊重孩子的选择，路自己走', effects: {flag: 'childCareerFree', familyPressure: -4, eq: 1, mentalPressure: -1, careerLogNote: '👨‍👩‍👦 尊重孩子的选择，让他/她自己闯'} },
    ]},
    { id: 'ent116', stage: 'life', eventType: 'auto', weight: 8, requireFlag: 'childCareerOfficial', requireChildAgeMin: 20, title: '孩子入编', text: '孩子考编上岸，报到那天给你发了张单位门口的照片。同事们纷纷道喜："虎父无犬子！"你嘴上说"都是孩子自己努力"，心里比当年自己上岸还高兴。', effects: {familyPressure: -4, reputation: 3, mentalPressure: -2} },
    { id: 'ent117', stage: 'life', eventType: 'auto', weight: 8, requireFlag: 'childCareerBusiness', requireChildAgeMin: 20, title: '孩子生意红火', text: '孩子的小生意做起来了，周末回家给你拎了两瓶好酒。街坊邻居传得风快："老X家孩子发财了。"你笑着摆手，心里却提醒自己：体制内的人，说话做事更得稳着点。', effects: {wealth: 10, desire: 2, heat: 2, familyPressure: -3} },
    { id: 'ent118', stage: 'life', eventType: 'auto', weight: 8, requireFlag: 'childCareerFree', requireChildAgeMin: 20, title: '孩子找到了自己的路', text: '孩子没有考编也没经商，去了一座南方城市做自己热爱的事。视频电话里他/她眼睛亮亮的，给你看出租屋窗台上养的花。你忽然明白：他/她过得开心，就是最好的路。', effects: {familyPressure: -5, mentalPressure: -3, eq: 1} },
    // ---------- v2.35 内容填充：办公室日常微叙事（纯内容，无新 flag） ----------
    { id: 'ent119', stage: 'work', eventType: 'auto', weight: 3, title: '办公室绿植', text: '科室新来的年轻人买了盆绿萝放在窗台，说要给老气横秋的办公室添点生气。一个月后，绿萝长得很好，大家路过都会顺手浇浇水——包括平时最严肃的科长。', effects: {mentalPressure: -2, workAbility: 1, eq: 1} },
    { id: 'ent120', stage: 'life', eventType: 'auto', weight: 3, title: '食堂涨价', text: '食堂窗口贴出涨价通知：荤菜涨一块，素菜涨五毛。中午排队的人骂骂咧咧，但打饭的手没停。你端着餐盘找了半天位置，忽然觉得日子就是这样，骂归骂，饭还是要吃。', effects: {wealth: -2, desire: 1, mentalPressure: -1} },
    { id: 'ent121', year: [40, 65], stage: 'work', eventType: 'auto', weight: 3, title: '退休欢送会', text: '隔壁科室的老王退休了，欢送会上他举着茶杯说了四十分钟，从参加工作讲到孙子满月。散场时他把养了十年的钢笔送给刚来的小李："笔杆子要传下去。"你忽然想，自己退休那天会说些什么。', effects: {reputation: 2, eq: 1, mentalPressure: -1} },
    { id: 'ent122', stage: 'life', eventType: 'choice', weight: 3, title: '同学借钱', text: '毕业后再没联系过的大学同学突然加你微信，寒暄几句后开口借三万，说生意周转，下个月就还。你想起上学时他借过你饭卡，一直没还。', choices: [
      { text: '爽快转账，同学情分在', effects: {wealth: -30, eq: 1, background: 2, familyPressure: 1} },
      { text: '婉拒，说自己手头也紧', effects: {eq: -1, desire: 1, reputation: -1} },
      { text: '先借五千，说清还款时间', effects: {wealth: -5, eq: 2, reputation: 1} },
    ]},
    { id: 'ent123', stage: 'work', eventType: 'auto', weight: 2, title: '文明单位奖金', text: '单位评上"文明单位"，每人发了一笔奖金。财务贴出明细，大家盘算着怎么花。你领到钱，给孩子报了早就想报的兴趣班。', effects: {wealth: 8, reputation: 1, familyPressure: -2} },
    { id: 'ent124', stage: 'work', eventType: 'auto', weight: 2, title: '值班室的除夕', text: '今年除夕轮到你值班。办公室很安静，窗外烟花声远远传来。你泡了杯茶，翻着通讯录，给没法回家的同事发了句"新年好"。零点时，门卫大爷端来一盘饺子："值班的都有份。"', effects: {mentalPressure: -3, reputation: 1, eq: 1} },
    { id: 'ent125', stage: 'life', eventType: 'auto', weight: 2, title: '政务大厅的表扬信', text: '政务大厅的墙上贴了一封表扬信，是办事群众写的，感谢你帮他解决了拖了三年的房产证问题。信的最后一句是："跑了几趟没办成，只有这次，有人真正听我说话。"同事们路过都要看一眼，你看得有点不好意思。', effects: {peopleReputation: 4, reputation: 2, mentalPressure: -1} },
    { id: 'ent126', stage: 'work', eventType: 'choice', weight: 2, title: '单位搬迁', text: '单位要搬到新办公区，装修方案里有一项：你的办公室窗外正对一片工地，要吵至少两年。后勤问你要不要换到北面安静的房间——但那间离领导办公室远，也离"核心圈子"远。', choices: [
      { text: '安静要紧，换到北面', effects: {mentalPressure: -3, positionWeight: -1, body: 1} },
      { text: '忍两年噪音，留在核心圈', effects: {mentalPressure: 2, positionWeight: 1, reputation: 1} },
      { text: '提议给全楼装隔音窗', effects: {workAbility: 1, reputation: 2, positionWeight: -1, risk: 1} },
    ]},
    { id: 'ent127', stage: 'work', eventType: 'auto', weight: 2, title: '防汛值班夜', text: '台风天，你连夜在单位值班盯汛情。凌晨三点，乡里报来一处堤坝渗水，你在电话里一条条确认转移名单。天亮时雨停了，手机里全是未读消息：老婆问"回来吃早饭吗"，同事说"辛苦了"。', effects: {workAbility: 2, reputation: 2, mentalPressure: 2, body: -1} },
    // ---------- v2.22 晋升答辩（promotionCandidate 触发，策略影响下次晋升） ----------
    { id: 'ent113', stage: 'work', eventType: 'choice', weight: 6, requireFlag: 'promotionCandidate', title: '晋升答辩', text: '组织考察通过，进入任职前谈话环节。会议室里坐着三位领导，桌上一杯茶，一支笔，还有你的述职材料——临门一脚，就看这一场。', choices: [
      { text: '精心准备，用数据和实绩说话', effects: {workAbility: 1, mentalPressure: 2, flag: 'promotionPrepared', deleteFlag: 'promotionCandidate', careerLogNote: '晋升答辩：准备充分'} },
      { text: '实事求是，有一说一', effects: {integrity: 2, reputation: 1, flag: 'promotionHonest', deleteFlag: 'promotionCandidate', careerLogNote: '晋升答辩：坦诚务实'} },
      { text: '临场发挥，能过就过', effects: {mentalPressure: -1, risk: 1, flag: 'promotionSloppy', deleteFlag: 'promotionCandidate', careerLogNote: '晋升答辩：敷衍了事'} },
    ]},
    // ================= v2.46 时代专属事件扩充（reform/stable/rectify 各 6→15） =================
    // ---- 改革年代 reform +9 ----
    { id: 'ent128', era: ['reform'], stage: 'work', eventType: 'choice', weight: 5, title: '招商路演', text: '县里组织招商路演，你被点名带队去一线城市。会议室里，对面坐着的是见惯了各地政策的投资团队——拼政策、拼诚意，也拼你这个人。', choices: [
      { text: '主打本地产业链优势，谈配套谈落地', effects: {workAbility: 2, reputation: 2, mentalPressure: 3, positionWeight: 2} },
      { text: '许下超常规的优惠承诺', effects: {reputation: 3, risk: 4, positionWeight: 3, integrity: -2, mentalPressure: 2} },
      { text: '如实说明条件有限，靠诚意打动', effects: {integrity: 2, reputation: 1, mentalPressure: 1, positionWeight: -1} },
    ]},
    { id: 'ent129', era: ['reform'], stage: 'work', eventType: 'auto', weight: 5, title: '职能划转', text: '机构改革进入深水区，你所在的科室职能划转并入新部门。工位搬了、分管变了、连工作微信群都换了一批。新部门的第一场会，领导说："改革没有旁观者。"', effects: {positionWeight: 1, mentalPressure: 3, workAbility: 1, background: 1} },
    { id: 'ent130', era: ['reform'], stage: 'work', eventType: 'choice', weight: 5, title: '绩效试点', text: '单位试行绩效工资差异化分配，"干多干少不一样了"。有人拍手叫好，有人阴阳怪气——谁干得多，谁就得罪人。', choices: [
      { text: '抢着接活，用实绩说话', effects: {workAbility: 3, positionWeight: 2, mentalPressure: 3, risk: 1} },
      { text: '按部就班，不冒头', effects: {mentalPressure: -2, positionWeight: -1, desire: -1} },
      { text: '呼吁考核指标公开透明', effects: {integrity: 2, reputation: 2, positionWeight: 1, mentalPressure: 2} },
    ]},
    { id: 'ent131', era: ['reform'], stage: 'work', eventType: 'auto', weight: 4, title: '容错免责清单', text: '省里出台改革创新容错免责清单：只要程序合规、出于公心，试错不追责。走廊里大家议论纷纷，你心里那点想闯一闯的火苗，又旺了起来。', effects: {risk: -2, mentalPressure: -3, desire: 2, background: 1} },
    { id: 'ent132', era: ['reform'], stage: 'work', eventType: 'choice', weight: 4, title: '涉企检查改革', text: '清理规范涉企检查，部门联查代替多头检查。企业主拍手叫好，可也有老科长嘀咕："以后想借检查摸情况，难了。"', choices: [
      { text: '支持联查，数据共享', effects: {workAbility: 2, reputation: 2, positionWeight: 1, mentalPressure: 1} },
      { text: '保留必要的重点检查', effects: {integrity: 1, risk: 1, reputation: -1} },
      { text: '观望，等上级出细则', effects: {desire: -1, positionWeight: -1, mentalPressure: -1} },
    ]},
    { id: 'ent133', era: ['reform'], stage: 'work', eventType: 'choice', weight: 5, title: '窗口革命', text: '政务服务"综合一窗"改革落地，老同事对着新系统直挠头："我这把年纪，学不会这些新玩意。"你是业务骨干，新系统培训缺人。', choices: [
      { text: '主动接下培训任务', effects: {workAbility: 3, positionWeight: 2, reputation: 1, mentalPressure: 3, body: -1} },
      { text: '帮老同事多盯几天窗口', effects: {eq: 2, reputation: 1, mentalPressure: 2} },
      { text: '建议分批培训过渡', effects: {iq: 1, workAbility: 1, reputation: 1} },
    ]},
    { id: 'ent134', era: ['reform'], stage: 'work', eventType: 'auto', weight: 4, title: '创新案例入围', text: '全市改革创新案例评选，你牵头梳理的"一网通办"经验入围前十。材料是你加了一个月班磨出来的，公布那天，领导在大会上点名表扬。', effects: {reputation: 3, workAbility: 2, positionWeight: 2, mentalPressure: -2} },
    { id: 'ent135', era: ['reform'], stage: 'life', eventType: 'choice', weight: 4, title: '老工业区转型', text: '老工业区转型示范区挂牌，旧厂房改造成文创园。发小老周辞了厂里的工作去开咖啡馆，来问你："要不要合伙？体制内那点死工资，能有什么前途。"', choices: [
      { text: '婉拒，说体制内也有改革舞台', effects: {integrity: 1, positionWeight: 1, reputation: 1} },
      { text: '认真考虑，收集转型政策', effects: {iq: 1, desire: 2, mentalPressure: 1} },
      { text: '心动了，试探单位态度', effects: {desire: 3, risk: 2, positionWeight: -1} },
    ]},
    { id: 'ent136', era: ['reform'], stage: 'life', eventType: 'auto', weight: 4, title: '改革红利', text: '改革见效了。工资普调，食堂破天荒加了道红烧肉，窗口排队的人少了，办事的人笑了。晚饭时你把这事讲给家人听，孩子说："爸爸，你们单位真好。"', effects: {wealth: 8, mentalPressure: -3, familyPressure: -2, reputation: 1} },
    // ---- 平稳年代 stable +9 ----
    { id: 'ent137', era: ['stable'], stage: 'work', eventType: 'auto', weight: 5, title: '按部就班的一年', text: '这一年没什么大事。考核照常、会议照常、年终总结照常。领导在大会上说："稳定压倒一切，今年我们交出了一份平稳的答卷。"你在台下轻轻舒了口气。', effects: {mentalPressure: -2, risk: -2, positionWeight: 1, desire: -1} },
    { id: 'ent138', era: ['stable'], stage: 'work', eventType: 'choice', weight: 5, title: '论资排辈', text: '副职岗位空缺，按惯例要论资排辈。你资历还差两年，老同志已经定了。散会后，有同事替你鸣不平："你干得比他多，凭啥让他上？"', choices: [
      { text: '服从安排，来日方长', effects: {mentalPressure: 2, positionWeight: 1, integrity: 1} },
      { text: '找领导争取，摆出实绩', effects: {positionWeight: 2, risk: 1, mentalPressure: 3, reputation: 1} },
      { text: '向组织建议完善晋升规则', effects: {integrity: 2, positionWeight: 1, risk: 1} },
    ]},
    { id: 'ent139', era: ['stable'], stage: 'work', eventType: 'choice', weight: 5, title: '民生微实事', text: '市里征集民生微实事项目：修路灯、装扶手、建口袋公园……钱不多，但件件是老百姓家门口的事。你负责初筛，选了又选。', choices: [
      { text: '选老旧小区适老化改造', effects: {peopleReputation: 3, reputation: 1, workAbility: 1} },
      { text: '选儿童友好设施', effects: {peopleReputation: 2, eq: 1, reputation: 1} },
      { text: '按领导意图选重点项目', effects: {positionWeight: 1, peopleReputation: -1, integrity: -1} },
    ]},
    { id: 'ent140', era: ['stable'], stage: 'work', eventType: 'auto', weight: 4, title: '档案规范化', text: '档案管理规范化检查来了。你补了三天台账，把五年前的会议记录都翻出来重新编目。检查组的结论是"总体规范，细节加强"。验收通过那天，你觉得自己像个档案学家。', effects: {workAbility: 1, mentalPressure: 2, reputation: 1, desire: -1} },
    { id: 'ent141', era: ['stable'], stage: 'life', eventType: 'choice', weight: 4, title: '社区和事佬', text: '楼下两户因为楼道堆杂物闹到社区，你下班回家被居委会主任拉住："你是机关干部，说话有分量，帮忙劝劝。"', choices: [
      { text: '耐心调解，讲情理也讲规定', effects: {eq: 2, peopleReputation: 2, mentalPressure: 1} },
      { text: '指出这是社区职责，婉拒', effects: {integrity: 1, peopleReputation: -1} },
      { text: '出个主意让他们自己协商', effects: {iq: 1, peopleReputation: 1} },
    ]},
    { id: 'ent142', era: ['stable'], stage: 'work', eventType: 'auto', weight: 4, title: '安全大检查', text: '安全生产大检查，条条框框逐项落实。你在现场盯了一整天，安全帽换了两顶，笔记记了半本。收工前队长说："宁可十防九空，不可失防万一。"', effects: {workAbility: 1, mentalPressure: 2, reputation: 1, risk: -1} },
    { id: 'ent143', era: ['stable'], stage: 'life', eventType: 'auto', weight: 3, title: '书画展', text: '工会办书画展，你随手写的"家和万事兴"被裱起来挂在了活动室。同事路过都要念一遍，说你字里带着日子味。', effects: {familyPressure: -2, mentalPressure: -2, eq: 1} },
    { id: 'ent144', era: ['stable'], stage: 'life', eventType: 'auto', weight: 3, title: '集体生日会', text: '单位给退休老同志办集体生日会。蛋糕是食堂大师傅做的，上面写着"岁月静好"。老张吹蜡烛时说："在单位干了一辈子，值了。"你忽然觉得，安稳也是种福气。', effects: {mentalPressure: -2, eq: 1, reputation: 1} },
    { id: 'ent145', era: ['stable'], stage: 'life', eventType: 'choice', weight: 4, title: '慢生活', text: '今天难得准时下班。你沿着河边走了半小时，看了会儿钓鱼的大爷，又在路边摊买了把青菜。同事发消息说你"太安逸"，你回他一个笑脸——日子是自己的。', choices: [
      { text: '享受慢生活，身体要紧', effects: {body: 1, mentalPressure: -3, desire: -1} },
      { text: '顺手调研一下河边休闲设施', effects: {workAbility: 1, peopleReputation: 1, iq: 1} },
      { text: '觉得自己不上进，回家继续充电', effects: {iq: 1, workAbility: 1, mentalPressure: 2, body: -1} },
    ]},
    // ---- 整顿年代 rectify +9 ----
    { id: 'ent146', era: ['rectify'], stage: 'work', eventType: 'choice', weight: 6, title: '八项规定自查', text: '八项规定执行情况自查开始：办公用房面积、公车使用、公务接待逐一对照。你发现自己办公室超了几平米，接待报销里有一顿存疑的工作餐。', choices: [
      { text: '主动整改，超标的都报上去', effects: {integrity: 3, risk: -3, positionWeight: -1, mentalPressure: 2} },
      { text: '按规定补办手续', effects: {workAbility: 1, risk: -1, integrity: 1} },
      { text: '睁一只眼闭一只眼', effects: {risk: 3, integrity: -2, mentalPressure: 2} },
    ]},
    { id: 'ent147', era: ['rectify'], stage: 'work', eventType: 'auto', weight: 5, title: '廉政档案', text: '单位建立廉政档案，个人事项报告要如实填写：房产、投资、配偶从业……你填到"家庭成员"那栏，笔停了停。填完交上去，纪委的小王说："越如实，越踏实。"', effects: {risk: -2, integrity: 1, mentalPressure: 1} },
    { id: 'ent148', era: ['rectify'], stage: 'work', eventType: 'auto', weight: 5, title: '身边案例警示', text: '警示教育大会，通报的案例里有你认识的人——当年一起培训的老赵，因为收了几次"辛苦费"，如今站在台上作检讨。散场时没人说话，气氛沉得像压了块石头。', effects: {risk: -3, integrity: 2, mentalPressure: 3, desire: -2} },
    { id: 'ent149', era: ['rectify'], stage: 'work', eventType: 'choice', weight: 5, title: '线索移交', text: '巡察组移交的线索里，有一份涉及你带过的老部下。按规定应该原样移交纪检监察部门，可老部下刚找你喝过酒，说"姐夫，多关照"。', choices: [
      { text: '如实移交，不掺杂个人感情', effects: {integrity: 3, reputation: 2, risk: -1, mentalPressure: 3, background: -1} },
      { text: '先侧面提醒他主动交代', effects: {eq: 1, integrity: -1, risk: 2} },
      { text: '压一压，等他来主动说', effects: {risk: 4, integrity: -2, mentalPressure: 3} },
    ]},
    { id: 'ent150', era: ['rectify'], stage: 'work', eventType: 'auto', weight: 4, title: '个人事项核实', text: '个人事项报告抽查结果出来了，有同事因为漏报被谈话。你对照自己的报告又看了一遍，确认每个数字都经得起核查——这大概就是"睡得好觉"的底气。', effects: {risk: -2, integrity: 1, mentalPressure: -1} },
    { id: 'ent151', era: ['rectify'], stage: 'work', eventType: 'choice', weight: 5, title: '作风评议', text: '作风评议大会，群众代表当面对你提意见："办事大厅叫号机老坏，你们修过吗？"全场安静，镜头对着你。', choices: [
      { text: '当场认领问题，承诺限期整改', effects: {peopleReputation: 3, reputation: 2, mentalPressure: 2, workAbility: 1} },
      { text: '说明客观原因，争取理解', effects: {eq: 1, peopleReputation: -1} },
      { text: '会后迅速落实整改', effects: {workAbility: 2, peopleReputation: 1, integrity: 1} },
    ]},
    { id: 'ent152', era: ['rectify'], stage: 'work', eventType: 'auto', weight: 4, title: '清退违规津补贴', text: '违规发放的津补贴要清退。上个月刚到手的那笔"加班费"要退回去，食堂贴出通知，有人骂骂咧咧，有人默默转账。你把钱退了，心里反而踏实。', effects: {wealth: -5, integrity: 2, risk: -1, mentalPressure: 1} },
    { id: 'ent153', era: ['rectify'], stage: 'life', eventType: 'choice', weight: 4, title: '家风建设', text: '纪委倡议家风建设，征集家属廉政寄语。你拿回家，妻子想了想，写了句："家里的饭，最香。"女儿在旁边画了个太阳。', choices: [
      { text: '把寄语贴到办公桌', effects: {integrity: 2, familyPressure: -2, risk: -1} },
      { text: '借机跟家人聊聊底线', effects: {eq: 1, familyPressure: -2, integrity: 1} },
      { text: '觉得形式主义，随手放抽屉', effects: {desire: 1, integrity: -1} },
    ]},
    { id: 'ent154', era: ['rectify'], stage: 'work', eventType: 'auto', weight: 4, title: '澄清正名', text: '被诬告的老科长终于等来澄清正名大会，组织当众为他恢复名誉。他眼眶通红，只说了一句："组织没有辜负干事的人。"台下掌声响了很久。', effects: {integrity: 2, risk: -1, mentalPressure: -2, reputation: 1} },
    // ================= v2.47 联系人链隐藏事件（高关系门槛解锁） =================
    // ---- 贵人链 noble → 中央捷径（centralCandidate 解锁中央遴选 e640） ----
    { id: 'ent155', stage: 'work', eventType: 'choice', weight: 6, requireContact: 'noble', requireContactMin: 80, requireUnitLevelMin: 3, requireUnitLevelMax: 3, requireRankMin: 6, title: '贵人举荐', text: '中组部来省里考察后备干部。一直提携你的老领导把你叫到办公室，问："如果中央要人，你敢不敢去？"窗外下着雨，他的茶凉了半杯。', choices: [
      { text: '表态愿意，接受组织挑选', effects: {positionWeight: 3, reputation: 2, mentalPressure: 4, flag: 'centralCandidate', contactRelation: { id: 'noble', delta: -3} } },
      { text: '感谢抬爱，想留在现岗深耕', effects: {integrity: 1, positionWeight: 1, reputation: 1, contactRelation: { id: 'noble', delta: 3} } },
      { text: '请示具体安排再定', effects: {iq: 1, eq: 1, mentalPressure: 2, flag: 'centralCandidate'} },
    ]},
    { id: 'ent156', stage: 'work', eventType: 'auto', weight: 5, requireContact: 'noble', requireContactMin: 85, title: '贵人托付', text: '老领导正式退休。欢送会上他敬了你一杯酒，只说了句："路自己走，心别丢。"他交给你一个旧笔记本，扉页写着：公生明，廉生威。', effects: {integrity: 3, reputation: 2, positionWeight: 1, mentalPressure: -2, contactRelation: { id: 'noble', delta: -5} } },
    // ---- 邻里链 neighbor → 基层扎根（桑梓情深结局加成） ----
    { id: 'ent157', stage: 'life', eventType: 'choice', weight: 6, requireContact: 'neighbor', requireContactMin: 80, requireUnitLevelMax: 1, title: '巷口托付', text: '巷口的老支书找上门："我在镇上听了你十几年，知道你是个实心眼。咱这条巷子的养老院、幼儿园，想托你牵头张罗。"他身后，几个街坊正隔着门缝往里瞧。', choices: [
      { text: '接下乡里乡亲的托付', effects: {peopleReputation: 5, reputation: 2, positionWeight: 1, mentalPressure: 4, familyPressure: 2} },
      { text: '量力而行，先帮跑审批', effects: {peopleReputation: 3, workAbility: 2, mentalPressure: 2} },
      { text: '婉拒，说单位事多', effects: {eq: -1, peopleReputation: -2} },
    ]},
    { id: 'ent158', stage: 'life', eventType: 'auto', weight: 5, requireContact: 'neighbor', requireContactMin: 75, title: '街坊夜话', text: '夏夜，巷口的槐树下，退休老干部、卖豆腐的王婶、开出租的小李围坐喝茶。有人讲政策，有人讲生计，有人讲家里长短。你听了一晚上，觉得比任何会议都通透。', effects: {peopleReputation: 3, background: 2, eq: 1, mentalPressure: -3} },
    // ---- 同学链 classmate → 平安落地（低风险结局兜底） ----
    { id: 'ent159', year: [30, 65], stage: 'work', eventType: 'choice', weight: 6, requireContact: 'classmate', requireContactMin: 80, requireRisk: 25, title: '老友提点', text: '纪委系统的老同学约你喝茶，聊着聊着忽然压低声音："最近有两条线在查，跟你那边沾边。该收的手，趁早收。"你端着茶杯，指节泛白。', choices: [
      { text: '谢过老友，连夜理清手尾', effects: {risk: -8, integrity: 1, mentalPressure: 3, contactRelation: { id: 'classmate', delta: -2} } },
      { text: '表面应承，暗中观望', effects: {risk: -2, mentalPressure: 2, eq: 1} },
      { text: '矢口否认，觉得他多心', effects: {risk: 3, mentalPressure: 2, eq: -1} },
    ]},
    { id: 'ent160', stage: 'work', eventType: 'auto', weight: 5, requireContact: 'classmate', requireContactMin: 85, requireRisk: 30, title: '多年情分', text: '那笔说不清来路的钱，老同学不知用什么办法替你抹平了。他没说细节，只说"当年我考编住你宿舍，你让我睡床自己打地铺，这份情我记着"。你喉咙发紧，说不出话。', effects: {risk: -8, reputation: 1, mentalPressure: -2, integrity: -1, contactRelation: { id: 'classmate', delta: -8} } },
    // ================= v2.48 口碑×基层选举 + 子女压力曲线 =================
    // ---- 基层评议（口碑高的玩家权重 ×1.5 自动生效：效果含 peopleReputation） ----
    { id: 'ent161', stage: 'work', eventType: 'choice', weight: 6, requireUnitLevelMax: 1, title: '基层评议大会', text: '年底基层评议大会，群众代表现场打分。有人夸你"办实事"，也有人提意见说"办事大厅中午没人值班"。话筒在人群里传着，镜头对准你。', choices: [
      { text: '逐条回应，当场领任务', effects: {peopleReputation: 3, reputation: 1, mentalPressure: 2, positionWeight: 1} },
      { text: '诚恳听取，会后逐项整改', effects: {peopleReputation: 2, workAbility: 1, integrity: 1} },
      { text: '强调客观困难，请求理解', effects: {peopleReputation: -1, eq: 1, mentalPressure: 1} },
    ]},
    // ---- 双轨悲情线：孩子高压培养 ----
    { id: 'ent162', stage: 'life', eventType: 'choice', weight: 5, requireChild: true, requireChildAgeMin: 10, title: '高压培养', text: '孩子的课程表排得比你的日程还满：奥数、英语、编程、书法……晚上十点，孩子趴在桌上睡着了，手里还攥着笔。妻子轻声说："他才十岁。"', choices: [
      { text: '坚持加压，不能输在起跑线', effects: {familyPressure: 5, mentalPressure: 3, childEducation: 1, flag: 'childPressured'} },
      { text: '减掉两个班，让他喘口气', effects: {familyPressure: -3, mentalPressure: -2, childCompany: 1} },
      { text: '和孩子谈谈他想要什么', effects: {eq: 1, familyPressure: -1, mentalPressure: -1, childCompany: 1} },
    ]},
    { id: 'ent163', stage: 'life', eventType: 'choice', weight: 6, requireChild: true, requireChildAgeMin: 11, requireFlag: 'childPressured', title: '孩子崩溃了', text: '月考成绩单下来那天，孩子把自己关在房间哭了很久。老师打电话说最近状态不对，上课总走神。你站在门外，听见他在里面小声说："我是不是让你们失望了？"', choices: [
      { text: '推门进去，告诉他你已经很好了', effects: {familyPressure: -6, mentalPressure: -4, eq: 2, childCompany: 1, deleteFlag: 'childPressured'} },
      { text: '一起分析试卷，找找方法', effects: {familyPressure: -2, mentalPressure: -1, childEducation: 1, childCompany: 1, deleteFlag: 'childPressured'} },
      { text: '让他自己冷静，别惯着', effects: {familyPressure: 6, mentalPressure: 3, integrity: 1, risk: 1} },
    ]},
    { id: 'ent164', stage: 'life', eventType: 'auto', weight: 5, requireChild: true, requireChildAgeMin: 14, title: '顺其自然的欣慰', text: '孩子成绩不算拔尖，但性格开朗，朋友很多。家长会上老师说"这孩子是班里的开心果"。回家路上孩子挽着你的胳膊说："爸，我觉得我挺幸福的。"你愣了一下，笑了。', effects: {familyPressure: -4, mentalPressure: -2, eq: 1, childCompany: 1} },
    // ====== v2.49：孤儿 flag 收尾（childCollege/childEmployed 此前设置后无任何消费） ======
    { id: 'ent165', stage: 'life', eventType: 'auto', weight: 6, requireChild: true, requireFlag: 'childCollege', requireChildAgeMin: 19, title: '孩子出息了', text: '孩子大学成绩优异，还拿了奖学金。电话里他兴奋地跟你讲学校的事，你忽然觉得这些年再苦都值了。', effects: {familyPressure: -4, reputation: 2, mentalPressure: -2} },
    { id: 'ent166', stage: 'life', eventType: 'auto', weight: 5, requireChild: true, requireFlag: 'childEmployed', requireChildAgeMin: 23, title: '孩子自立门户', text: '孩子工作稳定下来了，开始往家里寄钱。你说不用，他坚持："爸妈养我这么多年，该轮到我孝敬你们了。"', effects: {familyPressure: -3, wealth: 5, reputation: 1} },
    // ====== v2.51 负面关系系统：树敌事件（addEnemy effects，选择不留情面分支会结怨） ======
    { id: 'ent167', stage: 'work', eventType: 'choice', weight: 5, title: '当众批评', text: '部门例会上，同事的方案有明显漏洞。你权衡着怎么开口——当众指出来，他以后可能记恨你；但装没看见，出了问题要一起背锅。', choices: [
      { text: '当众指出问题，不留情面', effects: {workAbility: 2, reputation: 2, risk: 2, addEnemy: { id: 'enemy_167', name: '王副科长', position: '同部门同事', description: '曾在例会上被你当众批评，一直耿耿于怀' }} },
      { text: '会后私下提醒，给足面子', effects: {eq: 2, reputation: 1, workAbility: 1} },
      { text: '多一事不如少一事', effects: {eq: -1, mentalPressure: 1} },
    ]},
    { id: 'ent168', stage: 'work', eventType: 'choice', weight: 4, title: '抢功风波', text: '你们小组的项目出了成绩，隔壁组的张处长却在上报时把你的名字排在了后面，功劳大半归了他们组。你攥着原始方案稿，犹豫着要不要找领导说清楚。', choices: [
      { text: '直接找领导对质，还原真相', effects: {reputation: 3, background: 1, addEnemy: { id: 'enemy_168', name: '张处长', position: '隔壁组处长', description: '抢你功劳被你揭穿，结下梁子' }, heat: 1} },
      { text: '把证据递给领导，不正面冲突', effects: {workAbility: 2, reputation: 1, risk: 1} },
      { text: '忍了，下次自己留个心眼', effects: {mentalPressure: 3, reputation: -1} },
    ]},
    // ====== v2.51 敌人事件链：使绊/化解/仇怨（requireContact 走敌人 id，requireContactMin 负值门槛） ======
    { id: 'ent169', stage: 'work', eventType: 'auto', weight: 7, requireContact: 'enemy_111', requireContactMin: -30, title: '打小报告', text: '纪检部门收到一封匿名举报信，内容捕风捉影却指向你。虽然查无实据，但谈话记录还是进了档案。你知道是谁的手笔。', effects: {risk: 5, mentalPressure: 3, reputation: -1} },
    { id: 'ent170', stage: 'work', eventType: 'auto', weight: 6, requireContact: 'enemy_236', requireContactMin: -30, title: '抢功搅局', text: '季度评优公示前，有人把你的项目功劳算到了别人头上。公示栏前围了一圈人，你盯着自己的名字排在最后，血压有点高。', effects: {positionWeight: -1, mentalPressure: 4, reputation: -1} },
    { id: 'ent171', stage: 'work', eventType: 'auto', weight: 6, requireContact: 'enemy_054', requireContactMin: -30, title: '散布谣言', text: '饭桌上有人提起你"办事要打点"的传言，传得有鼻子有眼。你明明没收过一分钱，却百口莫辩。', effects: {reputation: -4, mentalPressure: 6} },
    { id: 'ent172', stage: 'work', eventType: 'choice', weight: 6, requireContact: 'enemy_111', requireContactMin: -30, title: '和解试探', text: '老张托人递话，说想跟你把话说开。他约你在茶楼见面，这些年的事像茶垢一样堆在心里。', choices: [
      { text: '主动伸手，冰释前嫌', effects: {eq: 2, mentalPressure: -3, contactRelation: { id: 'enemy_111', delta: 45 }, reputation: 1} },
      { text: '淡淡聊几句，不深不浅', effects: {eq: 1, contactRelation: { id: 'enemy_111', delta: 15 } } },
      { text: '摔门而去，老死不相往来', effects: {contactRelation: { id: 'enemy_111', delta: -25 }, mentalPressure: 2} },
    ]},
    { id: 'ent173', stage: 'life', eventType: 'choice', weight: 5, requireContact: 'enemy_168', requireContactMin: -30, title: '仇人见面', text: '上级单位组织的座谈会上，你和张处长被分到同一组。他全程没正眼看你，空气里都是火药味。', choices: [
      { text: '主动破冰，谈工作不谈恩怨', effects: {eq: 2, reputation: 1, contactRelation: { id: 'enemy_168', delta: 20 } } },
      { text: '公事公办，不卑不亢', effects: {workAbility: 1, contactRelation: { id: 'enemy_168', delta: 5 } } },
      { text: '当众给他难堪', effects: {reputation: -2, risk: 3, contactRelation: { id: 'enemy_168', delta: -20 } } },
    ]},
    { id: 'ent174', stage: 'work', eventType: 'choice', weight: 4, requireContact: 'enemy_168', requireContactMin: -70, title: '鱼死网破', text: '张处长四处散布你的"黑料"，你忍无可忍。朋友劝你冷处理，但你知道他背后还憋着更大的招。', choices: [
      { text: '整理证据反手举报', effects: {risk: 8, heat: 4, mentalPressure: 6, reputation: -2, integrity: 1, addEnemy: { id: 'enemy_168b', name: '张处长的心腹', position: '张处长一派', description: '你举报张处长后，他身边人盯上了你' }} },
      { text: '找上级领导说明情况', effects: {background: 2, reputation: 1, mentalPressure: 2, risk: 2} },
      { text: '以退为进，申请调岗回避', effects: {mentalPressure: -3, positionWeight: -1, contactRelation: { id: 'enemy_168', delta: 5 } } },
    ]},
    // ====== v2.52 特色人物专属链：恩师郑教授/青梅竹马苏晓/同乡老周/下属小赵 ======
    { id: 'ent175', stage: 'work', eventType: 'auto', weight: 6, requireContact: 'mentor', title: '恩师来访', text: '郑教授来市里参加学术会议，特意来看你。饭桌上他问起你的近况，给你讲了个"做学问如做人"的道理，听得你豁然开朗。', effects: {workAbility: 2, iq: 1, mentalPressure: -2} },
    { id: 'ent176', stage: 'work', eventType: 'choice', weight: 5, requireContact: 'mentor', requireContactMin: 50, title: '恩师引荐', text: '郑教授说他在政策研究所有个老朋友，缺个懂实务的人去讲课，问他推荐谁。他说"你要是愿意，我推荐你去"。', choices: [
      { text: '欣然应允，认真准备', effects: {reputation: 2, workAbility: 2, background: 1, mentalPressure: 2} },
      { text: '婉拒，怕影响本职', effects: {eq: 1, mentalPressure: -1, contactRelation: { id: 'mentor', delta: 5 } } },
      { text: '答应但敷衍了事', effects: {mentalPressure: -1, reputation: -2, contactRelation: { id: 'mentor', delta: -15 } } },
    ]},
    { id: 'ent177', stage: 'life', eventType: 'choice', weight: 4, requireContact: 'mentor', requireContactMin: 70, title: '恩师病重', text: '郑教授住院了。消息传来时你正在忙一个紧急任务。师母在电话里哽咽着说"老师一直念叨你"。', choices: [
      { text: '放下工作连夜赶去探望', effects: {eq: 3, integrity: 2, mentalPressure: 3, reputation: 1} },
      { text: '电话问候并托人送花', effects: {eq: 1, mentalPressure: 1, contactRelation: { id: 'mentor', delta: 5 } } },
      { text: '等忙完这阵子再说', effects: {eq: -2, risk: 1, contactRelation: { id: 'mentor', delta: -20 } } },
    ]},
    { id: 'ent178', stage: 'life', eventType: 'auto', weight: 5, requireContact: 'qingmei', title: '青梅小聚', text: '苏晓约你周末爬山。山风清爽，她笑你还像小时候一样爱较真。多年未见，却一点不生分。', effects: {mentalPressure: -4, familyPressure: -2, eq: 1} },
    { id: 'ent179', stage: 'life', eventType: 'choice', weight: 4, requireContact: 'qingmei', requireContactMin: 60, title: '青梅情愫', text: '苏晓生日，你送了束花。她接过花的时候，沉默了一下，说"你还记得我喜欢向日葵"。空气忽然安静。', choices: [
      { text: '鼓起勇气表明心意', effects: {mentalPressure: 4, eq: 2, risk: 2, contactRelation: { id: 'qingmei', delta: 30 } } },
      { text: '岔开话题聊别的', effects: {eq: 1, mentalPressure: -2} },
      { text: '开玩笑搪塞过去', effects: {eq: -1, mentalPressure: -3, contactRelation: { id: 'qingmei', delta: -10 } } },
    ]},
    { id: 'ent180', stage: 'work', eventType: 'auto', weight: 5, requireContact: 'hometown', requireContactMin: 30, title: '老乡牵线', text: '同乡老周帮你牵线认识了老家县里的实权人物。那人听说你在省城工作，态度格外热络，说"咱们老家人，要多走动"。', effects: {background: 2, peopleReputation: 2, reputation: 1} },
    { id: 'ent181', stage: 'work', eventType: 'auto', weight: 5, requireContact: 'subordinate', requireContactMin: 50, title: '下属成才', text: '小赵在市里的业务竞赛拿了名次。他在发言里专门感谢了你的培养，台下领导多看了你几眼——会带队伍的人，值得托付更大的担子。', effects: {reputation: 2, positionWeight: 1, workAbility: 1} },
    // ====== v2.53 人物生命线：联系人会老去、离开、传承 ======
    { id: 'ent182', stage: 'life', eventType: 'auto', weight: 5, requireContact: 'mentor', requireContactMin: 60, title: '恩师康健', text: '郑教授出院了，精神比想象中好。他拉着你的手说"病一场，反而想开了，学问是做不完的，人是会老的"。你在心里记下了这句话。', effects: {background: 1, workAbility: 1, mentalPressure: -2} },
    { id: 'ent183', stage: 'life', eventType: 'auto', weight: 4, requireContact: 'mentor', requireContactMax: 30, title: '恩师辞世', text: '郑教授走了。消息是师母在电话里哭着告诉你的。你想起上次他说"常来看看我"时，你正忙着赶材料，答应改天——那个改天，再也没有来。', effects: {mentalPressure: 8, background: 2, integrity: 1} },
    { id: 'ent184', stage: 'work', eventType: 'auto', weight: 5, requireContact: 'hometown', requireContactMin: 40, title: '老乡还乡', text: '老周要回老家养老了。临行前他把几个老伙计的联系方式留给你："在省城有什么难处，报我名字。"这份人情，沉甸甸的。', effects: {background: 2, peopleReputation: 2} },
    { id: 'ent185', stage: 'work', eventType: 'choice', weight: 5, requireContact: 'subordinate', requireContactMin: 60, title: '下属调离', text: '上级单位来借调小赵，说是借调，明眼人都知道是机会。小赵来征求你的意见，眼神里有期待也有不舍。', choices: [
      { text: '鼓励他去，给他写了推荐信', effects: {reputation: 2, background: 1, eq: 2, contactRelation: { id: 'subordinate', delta: 15 } } },
      { text: '挽留他，说这边更需要他', effects: {workAbility: 1, mentalPressure: 1, contactRelation: { id: 'subordinate', delta: -10 } } },
      { text: '不表态，让他自己决定', effects: {mentalPressure: -1, eq: 1, contactRelation: { id: 'subordinate', delta: 5 } } },
    ]},
    // ====== v2.53 新特色人物：商会会长孙会长 / 老战友吴哥 ======
    { id: 'ent186', stage: 'work', eventType: 'choice', weight: 5, requireContact: 'chamber', requireContactMin: 30, title: '商会晚宴', text: '孙会长攒了个局，来的人非富即贵。他把你引荐给几位企业老板，席间有人暗示"想给项目投点资"。', choices: [
      { text: '参加晚宴，广结善缘', effects: {background: 2, reputation: 1, wealth: 5, risk: 2} },
      { text: '婉拒投资，只谈工作', effects: {integrity: 2, eq: 1, contactRelation: { id: 'chamber', delta: 5 } } },
      { text: '接受投资，各取所需', effects: {wealth: 15, risk: 8, heat: 4, integrity: -3} },
    ]},
    { id: 'ent187', stage: 'work', eventType: 'choice', weight: 4, requireContact: 'chamber', requireContactMin: 60, title: '商会求助', text: '孙会长深夜来电，说有个项目被卡在审批环节，想请你"打个招呼"。他承诺事成之后"必有重谢"。', choices: [
      { text: '帮忙打招呼，收下心意', effects: {wealth: 20, risk: 10, heat: 6, integrity: -4, background: 2} },
      { text: '如实说明按规定办', effects: {integrity: 4, risk: -2, contactRelation: { id: 'chamber', delta: -10 } } },
      { text: '介绍他按正规流程办', effects: {workAbility: 2, integrity: 2, eq: 1, contactRelation: { id: 'chamber', delta: 5 } } },
    ]},
    { id: 'ent188', stage: 'life', eventType: 'auto', weight: 5, requireContact: 'veteran', title: '战友重逢', text: '吴哥约你周末去老营区看看。营区里梧桐树还是当年的样子，他指着训练场说"当年咱们在这儿摔了多少跤"。两个人谁也没提这些年的不容易。', effects: {mentalPressure: -5, body: 1} },
    { id: 'ent189', stage: 'work', eventType: 'choice', weight: 5, requireContact: 'veteran', requireContactMin: 50, title: '战友遇困', text: '吴哥的儿子想进你们系统的单位，笔试过了，面试差一口气。吴哥从没求过你，这次开了口，说完自己先红了脸。', choices: [
      { text: '尽力帮他运作', effects: {background: 2, reputation: 1, risk: 3, contactRelation: { id: 'veteran', delta: 15 } } },
      { text: '帮忙正常引荐，不越界', effects: {workAbility: 2, integrity: 2, contactRelation: { id: 'veteran', delta: 8 } } },
      { text: '坦言帮不上，请他理解', effects: {eq: 1, mentalPressure: 2, contactRelation: { id: 'veteran', delta: -15 } } },
    ]},
    // ====== v2.54 新特色人物链（钱老/小何/赵大夫）+ 跨联系人互动 + 社交活动 ======
    { id: 'ent190', stage: 'work', eventType: 'auto', weight: 5, requireContact: 'elder', requireContactMin: 30, title: '钱老点拨', text: '钱老在老干部活动室摆开棋盘，跟你下了三盘。落子之间他说"当官如棋，先稳后狠，最忌贪吃"——赢了你三盘，也点醒了你几件事。', effects: {background: 2, integrity: 2, workAbility: 1} },
    { id: 'ent191', stage: 'work', eventType: 'choice', weight: 5, requireContact: 'journalist', requireContactMin: 40, title: '记者专访', text: '小何找上门来做一期基层干部专访。她问得直白："有人说你最近在推进的工作有阻力，你怎么看？"镜头对着你。', choices: [
      { text: '坦诚面对，有一说一', effects: {reputation: 3, peopleReputation: 2, mentalPressure: 2} },
      { text: '避重就轻，点到为止', effects: {reputation: 1, eq: 1, risk: 1} },
      { text: '婉拒专访，低调行事', effects: {reputation: -1, mentalPressure: -2, contactRelation: { id: 'journalist', delta: -10 } } },
    ]},
    { id: 'ent192', stage: 'life', eventType: 'auto', weight: 5, requireContact: 'doctor', requireContactMin: 30, title: '年度体检', text: '赵大夫给你留了体检名额。报告出来，他说"你这血脂有点高，压力不小吧"——又补了一句，"别把身体耗在饭局上"。', effects: {body: 1, mentalPressure: -2} },
    { id: 'ent193', stage: 'work', eventType: 'choice', weight: 4, requireContact: 'mentor', requireContactMin: 50, title: '牵线搭桥（业务对接）', text: '郑教授提到他一个学生在做政策咨询，正好和你的业务沾边。你想起老同学陈总也在找这样的资源——两头都是熟人，牵个线大家都受益。', choices: [
      { text: '牵线介绍，成人之美', effects: {background: 2, reputation: 1, eq: 1, contactRelation: { id: 'mentor', delta: 8 }, contactRelation2: { id: 'classmate', delta: 8 } } },
      { text: '自己先接触，不急着牵线', effects: {workAbility: 2, contactRelation: { id: 'mentor', delta: 3 } } },
      { text: '多一事不如少一事', effects: {mentalPressure: -1, contactRelation: { id: 'mentor', delta: -5 } } },
    ]},
    { id: 'ent194', stage: 'life', eventType: 'choice', weight: 5, title: '社交选择', text: '周末到了。你盘算着怎么安排——体制内的人脉是走出来的，但每一条路都意味着取舍。', choices: [
      { text: '赴一场体制内饭局', effects: {background: 2, mentalPressure: 2, risk: 1, flag: 'socialChoice'} },
      { text: '参加学术讲座充电', effects: {iq: 1, workAbility: 1, mentalPressure: -1} },
      { text: '参加老乡聚会', effects: {peopleReputation: 2, background: 1, contactRelation: { id: 'hometown', delta: 5 } } },
      { text: '宅家休息陪家人', effects: {mentalPressure: -4, familyPressure: -3} },
    ]},
    // ====== v2.55 对立面与同侪：纪检老宋 / 党校同学林处长 ======
    { id: 'ent195', stage: 'work', eventType: 'choice', weight: 4, requireContact: 'inspector', requireContactMin: 30, title: '纪检谈话', text: '老宋约你"随便聊聊"。办公室的茶喝了两轮，他问的都是家常，但句句听着都有弦外之音。', choices: [
      { text: '坦荡应对，该说的都说', effects: {risk: -3, integrity: 2, mentalPressure: 3, contactRelation: { id: 'inspector', delta: 10 } } },
      { text: '滴水不漏，点到为止', effects: {eq: 1, risk: -1, mentalPressure: 2} },
      { text: '紧张得手心冒汗', effects: {risk: 2, mentalPressure: 8, reputation: -1} },
    ]},
    { id: 'ent196', stage: 'work', eventType: 'choice', weight: 5, requireContact: 'partySchool', requireContactMin: 30, title: '同期竞争', text: '系统内有个重要岗位空出来了，你和林处长都在候选人名单上。党校结业时你们还说过"互相照应"。', choices: [
      { text: '公平竞争，凭实力说话', effects: {workAbility: 2, reputation: 1, contactRelation: { id: 'partySchool', delta: 8 } } },
      { text: '主动找组织沟通争取', effects: {background: 2, positionWeight: 1, risk: 2} },
      { text: '私下运作，抢先一步', effects: {positionWeight: 2, risk: 6, heat: 3, contactRelation: { id: 'partySchool', delta: -25 } } },
    ]},
  // ========== v2.56 人脉地域化事件 ==========
  { id: 'ent197', eventType: 'choice', weight: 1, year: [2, 60], stage: 'life', requireFlag: 'hasContact', title: '📦 异地来电',
    text: '深夜十一点，手机屏幕亮起——是许久没联系的老朋友。隔着几百公里，他的声音有些疲惫："最近还好吗？听说你调走了……"',
    choices: [
      { text: '聊到深夜，讲讲各自近况', effects: { contactRelation: { id: 'auto', delta: 4 }, mentalPressure: -5, eq: 1 } },
      { text: '简单寒暄几句，推说太晚了', effects: {mentalPressure: -1,  contactRelation: { id: 'auto', delta: 1 } } },
      { text: '问他是不是有什么事要帮忙', effects: { contactRelation: { id: 'auto', delta: 2 }, integrity: 2, risk: 2 } }
    ] },
  { id: 'ent198', eventType: 'choice', weight: 3, year: [2, 60], stage: 'life', title: '🍻 饭局上的真心话',
    text: '一场普通饭局，酒过三巡，平时稳重老练的同事老张忽然说起真心话："体制内混，靠的是一张越来越大的网。可网越大，能说真心话的人越少。"',
    choices: [
      { text: '深有同感，敬他一杯', effects: { contactRelation: { id: 'auto', delta: 5 }, mentalPressure: -3, reputation: 1 } },
      { text: '笑着岔开话题，官场不谈真心', effects: { contactRelation: { id: 'auto', delta: -2 }, eq: 1 } },
      { text: '反问他：你觉得我这人怎么样', effects: { contactRelation: { id: 'auto', delta: 2 }, eq: -1, mentalPressure: 2 } }
    ] },
  { id: 'ent199', eventType: 'choice', weight: 1, year: [2, 60], stage: 'life', requireFlag: 'hasContact', title: '👥 老朋友的近况',
    text: '翻到通讯录，想起一些人。这些年各自忙各自的，有些人走着走着就远了，有些人一通电话还是当年的味道。',
    choices: [
      { text: '主动约个时间聚一聚', effects: { contactRelation: { id: 'auto', delta: 3 }, mentalPressure: -3 } },
      { text: '发条消息问候一下就好', effects: { contactRelation: { id: 'auto', delta: 1 } } },
      { text: '各人有各人的路，不打扰了', effects: {} }
    ] },
  // ========== v2.60 联系人专属互动（内容扩充：青梅/战友/商会/老书记/记者/医生/下属/处长） ==========
  { id: 'ent200', eventType: 'choice', weight: 3, year: [2, 60], stage: 'life', requireContact: 'qingmei', title: '🏘️ 旧城往事',
    text: '出差路过老家，傍晚在巷口那家老面馆里，竟然遇到了多年不见的青梅竹马。她（他）还是老样子，笑起来眼角的纹路却多了几条。',
    choices: [
      { text: '坐下叙旧，聊聊这些年各自的路', effects: { contactRelation: { id: 'qingmei', delta: 8 }, eq: 2, mentalPressure: -4 } },
      { text: '提起当年没说完的心事', effects: { contactRelation: { id: 'qingmei', delta: 12 }, eq: 1, mentalPressure: 2, familyPressure: 1 } },
      { text: '寒暄几句就匆匆告别', effects: { contactRelation: { id: 'qingmei', delta: -3 }, eq: -1 } }
    ] },
  { id: 'ent201', eventType: 'choice', weight: 3, year: [2, 60], stage: 'life', requireContact: 'veteran', title: '🍺 战友聚会',
    text: '老班长打电话来，说几个老战友约好了周末聚一聚。当年一起摸爬滚打的兄弟，如今散在天南海北，能凑齐一次不容易。',
    choices: [
      { text: '到场畅饮，找回当年的情谊', effects: { contactRelation: { id: 'veteran', delta: 8 }, body: 1, mentalPressure: -4 } },
      { text: '人到了，酒少喝，多听大家讲', effects: { contactRelation: { id: 'veteran', delta: 5 }, eq: 1, mentalPressure: -2 } },
      { text: '推脱说有事，下次一定', effects: { contactRelation: { id: 'veteran', delta: -5 }, mentalPressure: 1 } }
    ] },
  { id: 'ent202', eventType: 'choice', weight: 3, year: [2, 60], stage: 'work', requireContact: 'chamber', title: '🥂 商会酒局',
    text: '孙会长亲自打电话，邀你出席商会年度晚宴，说"好几个老板都想认识你"。商人们捧场，往往醉翁之意不在酒。',
    choices: [
      { text: '出席，广结善缘', effects: { contactRelation: { id: 'chamber', delta: 10 }, background: 2, risk: 2, mentalPressure: 2 } },
      { text: '出席，但只谈风月不谈正事', effects: { contactRelation: { id: 'chamber', delta: 4 }, eq: 1, mentalPressure: 1 } },
      { text: '婉拒，避嫌为上', effects: { contactRelation: { id: 'chamber', delta: -6 }, integrity: 1, mentalPressure: -2 } }
    ] },
  { id: 'ent203', eventType: 'choice', weight: 3, year: [2, 60], stage: 'life', requireContact: 'elder', title: '🍵 宦海请教',
    text: '退休多年的老书记约你傍晚在河堤散步。他说话慢悠悠的，但每一句都像在点你——"小同志，机关里的事，三分做事，七分做人。"',
    choices: [
      { text: '虚心请教，记下每句提点', effects: { contactRelation: { id: 'elder', delta: 10 }, positionWeight: 2, eq: 1 } },
      { text: '聊到兴处，问起他当年的故事', effects: { contactRelation: { id: 'elder', delta: 6 }, background: 1, mentalPressure: -2 } },
      { text: '心不在焉，惦记着单位的事', effects: { contactRelation: { id: 'elder', delta: -8 }, positionWeight: -1 } }
    ] },
  { id: 'ent204', eventType: 'choice', weight: 3, year: [2, 60], stage: 'work', requireContact: 'journalist', title: '📰 采访风波',
    text: '记者小何想做一期你单位的深度报道，找了你三次。稿子还没写，选题已经在系统里传开了——有人捧，也有人等着看你翻车。',
    choices: [
      { text: '安排专访，正面回应', effects: { contactRelation: { id: 'journalist', delta: 10 }, reputation: 3, risk: 2, mentalPressure: 3 } },
      { text: '提供素材，让她自己把握分寸', effects: { contactRelation: { id: 'journalist', delta: 6 }, reputation: 1, risk: 1 } },
      { text: '婉拒采访，多一事不如少一事', effects: { contactRelation: { id: 'journalist', delta: -5 }, integrity: 1 } }
    ] },
  { id: 'ent205', eventType: 'choice', weight: 3, year: [30, 60], stage: 'life', requireContact: 'doctor', title: '🩺 体检报告',
    text: '赵大夫拿着你的体检报告直皱眉："指标不太好看，血脂血压都偏高。你这才多大岁数，应酬那么多干什么？"',
    choices: [
      { text: '遵医嘱调理，戒酒多运动', effects: { contactRelation: { id: 'doctor', delta: 8 }, body: 2, wealth: -10, mentalPressure: -2 } },
      { text: '定期复查，但应酬照旧', effects: { contactRelation: { id: 'doctor', delta: 2 }, risk: 1 } },
      { text: '不当回事，回头再说', effects: { contactRelation: { id: 'doctor', delta: -5 }, body: -1 } }
    ] },
  { id: 'ent206', eventType: 'choice', weight: 3, year: [2, 60], stage: 'work', requireContact: 'subordinate', title: '🤝 下属的委屈',
    text: '小赵闷声不响地跟你汇报工作，末了才挤出一句："领导，这次评优……我干的那摊活，被人记到别人头上了。"他眼里的委屈藏不住。',
    choices: [
      { text: '出面主持公道，还他一个说法', effects: { contactRelation: { id: 'subordinate', delta: 12 }, reputation: 2, risk: 2, mentalPressure: 3 } },
      { text: '私下安抚，让他先忍一忍', effects: { contactRelation: { id: 'subordinate', delta: 4 }, eq: 1 } },
      { text: '公事公办，让他拿证据说话', effects: { contactRelation: { id: 'subordinate', delta: -8 }, integrity: 2 } }
    ] },
  { id: 'ent207', eventType: 'choice', weight: 3, year: [2, 60], stage: 'work', requireContact: 'crew_boss', title: '🍵 处长的茶',
    text: '李处难得请你喝茶。他泡茶的手法很讲究，话却说得漫不经心："最近单位里有些风声，你自己心里要有数。"',
    choices: [
      { text: '坦诚汇报，请他指点迷津', effects: { contactRelation: { id: 'crew_boss', delta: 8 }, positionWeight: 1, eq: 1, mentalPressure: -2 } },
      { text: '试探他话里的意思', effects: { contactRelation: { id: 'crew_boss', delta: 3 }, iq: 1, mentalPressure: 2 } },
      { text: '含糊应付，不想交底', effects: { contactRelation: { id: 'crew_boss', delta: -6 }, integrity: 1 } }
    ] },
  // ========== v2.61 人物扩充：司长（第二条贵人线）+ 大学室友（老友线） ==========
  { id: 'ent208', eventType: 'choice', weight: 8, year: [2, 42], stage: 'work', title: '🎯 司长的青眼', // v2.67 文本一致性：'年轻人'称呼 42 岁后不再出现
    text: '全省系统工作会上，你的一份材料被点名表扬。散会后，省厅的司长专门绕过来跟你握了手："年轻人，材料写得不错，是哪个处室的？"',
    choices: [
      { text: '不卑不亢，汇报自己的工作情况', effects: { contact: { id: 'sizhang', name: '司长', relation: 25, position: '省厅司长', description: '系统工作会认识，对你印象不错' }, background: 3, positionWeight: 2, reputation: 2 } },
      { text: '谦虚几句，把功劳推给单位', effects: { contact: { id: 'sizhang', name: '司长', relation: 15, position: '省厅司长', description: '系统工作会认识' }, eq: 2, reputation: 1 } },
      { text: '趁机多说几句，想给他留个深印象', effects: { contact: { id: 'sizhang', name: '司长', relation: 20, position: '省厅司长', description: '系统工作会认识' }, positionWeight: 1, risk: 1, mentalPressure: 2 } }
    ] },
  { id: 'ent209', eventType: 'choice', weight: 3, year: [2, 55], stage: 'work', requireContact: 'sizhang', title: '📞 司长的电话',
    text: '司长亲自给你打来电话，聊了几句工作，末了说："你们市里最近有个试点，我看名单里没有你，要不要我帮你问一句？"',
    choices: [
      { text: '谢谢司长，说自己愿意多历练', effects: { contactRelation: { id: 'sizhang', delta: 10 }, positionWeight: 3, mentalPressure: 3, familyPressure: 1 } },
      { text: '委婉推辞，说基层工作还没做透', effects: { contactRelation: { id: 'sizhang', delta: -4 }, integrity: 2, positionWeight: -1 } },
      { text: '感谢之余，请他多指点工作', effects: { contactRelation: { id: 'sizhang', delta: 6 }, positionWeight: 1, eq: 1 } }
    ] },
  { id: 'ent210', eventType: 'choice', weight: 3, year: [2, 55], stage: 'work', requireContact: 'sizhang', title: '🎓 司长退休前夜',
    text: '司长要退了。退休前最后一个工作日，他把你叫到办公室，泡了壶好茶："这些年跟过我的人不少，临走前，我想听听你自己的想法。"',
    choices: [
      { text: '说出自己的抱负，感谢他的提携', effects: { contactRelation: { id: 'sizhang', delta: 12 }, positionWeight: 2, mentalPressure: -3, reputation: 1 } },
      { text: '请他为自己的仕途指一条路', effects: { contactRelation: { id: 'sizhang', delta: 8 }, positionWeight: 2, iq: 1 } },
      { text: '客套几句，人走茶凉的道理你懂', effects: { contactRelation: { id: 'sizhang', delta: -6 }, integrity: 1 } }
    ] },
  { id: 'ent211', eventType: 'choice', weight: 6, year: [1, 45], stage: 'life', title: '🍻 室友重逢',
    text: '多年不见的大学室友忽然约你吃饭。当年睡你上铺的兄弟，如今自己开了家公司，混得风生水起。他拍着你的肩膀："老同学，咱们可好久没见了！"',
    choices: [
      { text: '畅聊往事，答应常联系', effects: { contact: { id: 'roommate', name: '大学室友', relation: 30, position: '创业公司老板', description: '大学同寝室友，多年后重逢' }, mentalPressure: -4, eq: 1 } },
      { text: '听他讲讲创业的故事', effects: { contact: { id: 'roommate', name: '大学室友', relation: 20, position: '创业公司老板', description: '大学同寝室友' }, iq: 1, desire: 1 } },
      { text: '寒暄几句，想着以后可能用得上', effects: { contact: { id: 'roommate', name: '大学室友', relation: 10, position: '创业公司老板', description: '大学同寝室友' }, eq: -1 } }
    ] },
  { id: 'ent212', eventType: 'choice', weight: 3, year: [2, 55], stage: 'life', requireContact: 'roommate', title: '💰 室友借钱',
    text: '室友吞吞吐吐地开口："公司现金流出了点问题，想跟你周转二十万，三个月就还。"二十万不是小数，可当年那份情谊……',
    choices: [
      { text: '借给他，兄弟有难处不能看着', effects: { contactRelation: { id: 'roommate', delta: 12 }, wealth: -20, familyPressure: 3, mentalPressure: 2 } },
      { text: '借一半，说自己也有难处', effects: { contactRelation: { id: 'roommate', delta: 5 }, wealth: -10, familyPressure: 1 } },
      { text: '婉拒，建议他找银行', effects: { contactRelation: { id: 'roommate', delta: -8 }, integrity: 1, eq: -1 } }
    ] },
  { id: 'ent213', eventType: 'choice', weight: 3, year: [2, 55], stage: 'life', requireContact: 'roommate', title: '🌊 室友的橄榄枝',
    text: '室友认真地看着你："出来跟我干吧，一年顶你在单位十年。你想清楚，这个机会不是天天有。"体制内的安稳和外面的风浪，摆在你面前。',
    choices: [
      { text: '心动，认真考虑辞职', effects: { contactRelation: { id: 'roommate', delta: 8 }, desire: 3, mentalPressure: 3, risk: 3 } },
      { text: '婉拒，说自己放不下这份工作', effects: { contactRelation: { id: 'roommate', delta: -4 }, integrity: 2, mentalPressure: -2 } },
      { text: '打趣说体制内也未必安稳', effects: { contactRelation: { id: 'roommate', delta: 2 }, eq: 1, risk: 1 } }
    ] },
  // ========== v2.61 现有联系人补全 ==========
  { id: 'ent214', eventType: 'choice', weight: 3, year: [2, 60], stage: 'work', requireContact: 'crew_colleague', title: '🍚 单位聚餐',
    text: '周五下班，几个同事张罗着聚餐。订好的包间里，有人讲段子，有人倒苦水，有人悄悄观察谁跟领导走得近。这种饭局，吃的是菜，品的是人。',
    choices: [
      { text: '放开喝，拉近关系', effects: { contactRelation: { id: 'crew_colleague', delta: 8 }, body: -1, mentalPressure: -3, reputation: 1 } },
      { text: '少喝多说，做个热心听众', effects: { contactRelation: { id: 'crew_colleague', delta: 4 }, eq: 2 } },
      { text: '借口有事，提前离场', effects: { contactRelation: { id: 'crew_colleague', delta: -5 }, mentalPressure: 1, body: 1 } }
    ] },
  { id: 'ent215', eventType: 'choice', weight: 3, year: [2, 60], stage: 'work', requireContact: 'crew_colleague', title: '📋 同事想调岗',
    text: '关系不错的同事私下找你："听说你认识那边的处长，我想调过去，你能帮我递句话吗？"这个忙，帮不帮？',
    choices: [
      { text: '帮他递句话，成人之美', effects: { contactRelation: { id: 'crew_colleague', delta: 10 }, background: 1, risk: 2, mentalPressure: 1 } },
      { text: '教他自己去找门路', effects: { contactRelation: { id: 'crew_colleague', delta: 3 }, iq: 1 } },
      { text: '婉拒，说自己也说不上话', effects: { contactRelation: { id: 'crew_colleague', delta: -6 }, integrity: 1 } }
    ] },
  { id: 'ent216', eventType: 'choice', weight: 3, year: [2, 60], stage: 'work', requireContact: 'crew_mentor', title: '📖 导师的指点',
    text: '带你的老导师把你叫到办公室，指着一份文件说："你看这个材料，问题不在格式，在逻辑。机关里的文字，是写给看的人看的，不是写给自己看的。"',
    choices: [
      { text: '认真听讲，回去反复琢磨', effects: { contactRelation: { id: 'crew_mentor', delta: 8 }, workAbility: 2, positionWeight: 1 } },
      { text: '请他推荐几本材料写作的书', effects: { contactRelation: { id: 'crew_mentor', delta: 6 }, workAbility: 1, iq: 1 } },
      { text: '点头称是，心里觉得不过是老生常谈', effects: { contactRelation: { id: 'crew_mentor', delta: -4 }, workAbility: -1 } }
    ] },
  { id: 'ent217', eventType: 'choice', weight: 3, year: [2, 60], stage: 'work', requireContact: 'crew_mentor', title: '🏥 导师病倒',
    text: '老导师住院了。消息传得很快，病房门口排着来看望的人。有人拎着果篮，有人带着红包，有人只是来看看。你也站在走廊里。',
    choices: [
      { text: '常去陪护，帮衬家里', effects: { contactRelation: { id: 'crew_mentor', delta: 12 }, body: -1, mentalPressure: 2, reputation: 1 } },
      { text: '送点补品，问候一声', effects: { contactRelation: { id: 'crew_mentor', delta: 5 }, wealth: -5 } },
      { text: '托人带句话，自己抽不开身', effects: { contactRelation: { id: 'crew_mentor', delta: -6 }, mentalPressure: 1 } }
    ] },
  { id: 'ent218', eventType: 'choice', weight: 3, year: [2, 60], stage: 'work', requireContact: 'business', title: '🥂 商人的饭局',
    text: '生意人老郑做东，饭桌上推杯换盏："我们公司最近想拿你们那个项目，听说您说话管用？"筷子夹着菜，话里却带着钩子。',
    choices: [
      { text: '打太极，不接他的话茬', effects: { contactRelation: { id: 'business', delta: 4 }, eq: 1, integrity: 1 } },
      { text: '暗示要看合规性，按程序来', effects: { contactRelation: { id: 'business', delta: 2 }, integrity: 2 } },
      { text: '含糊应下，留下想象空间', effects: { contactRelation: { id: 'business', delta: 8 }, risk: 3, mentalPressure: 2 } }
    ] },
  { id: 'ent219', eventType: 'choice', weight: 3, year: [2, 60], stage: 'work', requireContact: 'partySchool', title: '🏫 党校同窗',
    text: '党校培训结束前，同窗们约着聚了一次。大家来自不同单位，聊起来才发现——有些人，是能互相借力的。',
    choices: [
      { text: '互留联系方式，约定常往来', effects: { contactRelation: { id: 'partySchool', delta: 8 }, background: 2, reputation: 1 } },
      { text: '只跟聊得来的几个深交', effects: { contactRelation: { id: 'partySchool', delta: 4 }, eq: 1 } },
      { text: '保持距离，党校同学未必靠得住', effects: { contactRelation: { id: 'partySchool', delta: -5 }, integrity: 1 } }
    ] },
  { id: 'ent220', eventType: 'choice', weight: 3, year: [2, 42], stage: 'work', requireContact: 'inspector', title: '🔍 检查组的规矩', // v2.67 文本一致性：'年轻人'称呼 42 岁后不再出现
    text: '检查组进驻你单位，带队的老同志作风硬朗，谢绝了所有宴请。私底下，他却单独约你散步："年轻人，我看你材料写得实在，多聊聊。"',
    choices: [
      { text: '如实介绍情况，不藏不掖', effects: { contactRelation: { id: 'inspector', delta: 10 }, integrity: 2, reputation: 1, mentalPressure: 2 } },
      { text: '挑着说，拣好听的说', effects: { contactRelation: { id: 'inspector', delta: -6 }, risk: 2, mentalPressure: 3 } },
      { text: '请他对工作多提意见', effects: { contactRelation: { id: 'inspector', delta: 6 }, workAbility: 1, eq: 1 } }
    ] },
  // ========== v2.61 突发事件扩充（sudden） ==========
  { id: 'ent221', stage: 'work', eventType: 'sudden', title: '🌧️ 暴雨内涝', weight: 4, year: [1, 50], text: '暴雨下了三天，城区内涝严重。你负责的片区积水齐腰，群众在朋友圈里骂声一片。', effects: {workAbility: 2, body: -1, mentalPressure: 8, reputation: 1} },
  { id: 'ent222', stage: 'work', eventType: 'sudden', title: '🔥 单位失火', weight: 3, year: [1, 50], text: '凌晨单位档案室失火。火势不大，但烧掉的账本和资料，让几个老同志脸色发白。', effects: {risk: 5, mentalPressure: 8, workAbility: 1} },
  { id: 'ent223', stage: 'life', eventType: 'sudden', title: '🚑 家属急病', weight: 4, year: [1, 50], text: '深夜接到电话：家里老人生病住院了。一边是刚布置的重要任务，一边是病床上的亲人。', effects: {familyPressure: 10, mentalPressure: 8, body: -1} },
  { id: 'ent224', stage: 'work', eventType: 'sudden', title: '💬 谣言四起', weight: 3, year: [1, 50], text: '单位里忽然流传起关于你的谣言，说你要调走，说你跟领导关系不一般。谣言止于智者，可同事们的眼神已经变了。', effects: {reputation: -3, mentalPressure: 8, positionWeight: -2} },
  { id: 'ent225', stage: 'work', eventType: 'sudden', title: '💻 系统瘫痪', weight: 3, year: [1, 50], text: '业务系统突然瘫痪，大厅里排起了长队，办事群众拍着柜台质问。技术部门排查后说：是数据迁移出了问题。', effects: {risk: 5, mentalPressure: 8, workAbility: 2} },
  { id: 'ent226', stage: 'work', eventType: 'sudden', title: '🚪 群众围堵', weight: 3, year: [1, 50], text: '几十名群众围在单位门口，横幅拉起来了，情绪激动。话筒递到你面前，镜头对着你的脸。', effects: {mentalPressure: 10, reputation: 2, risk: 3} },
  // ========== v2.61 生活事件扩充 ==========
  { id: 'ent227', eventType: 'choice', weight: 3, year: [2, 55], stage: 'life', requireContact: 'classmate', title: '🎓 同学会',
    text: '十年同学会，当年的同桌如今开宝马，睡上下铺的兄弟当了处长，也有人还在小县城守着安稳日子。觥筹交错间，有人炫耀，有人沉默。',
    choices: [
      { text: '谈笑风生，不比较不攀比', effects: { contactRelation: { id: 'classmate', delta: 6 }, eq: 2, mentalPressure: -2 } },
      { text: '悄悄打听有用的门路', effects: { contactRelation: { id: 'classmate', delta: 3 }, background: 1, eq: -1 } },
      { text: '提前离场，受不了这种场面', effects: { contactRelation: { id: 'classmate', delta: -4 }, mentalPressure: 3 } }
    ] },
  { id: 'ent228', eventType: 'choice', weight: 3, year: [2, 55], stage: 'life', title: '🧧 随份子',
    text: '同事的儿子结婚，帖子递到手里。份子钱给多了心疼，给少了难看——这可是门学问。',
    choices: [
      { text: '随大流，跟同事们保持一致', effects: { wealth: -8, reputation: 1, mentalPressure: 1 } },
      { text: '多随一点，显得大方', effects: { wealth: -15, reputation: 2, familyPressure: 1 } },
      { text: '人不到，礼金照随', effects: { wealth: -5, reputation: -1 } }
    ] },
  { id: 'ent229', eventType: 'choice', weight: 3, year: [2, 55], stage: 'life', title: '🩻 父母体检',
    text: '父母年纪大了，体检报告上多了几项箭头。医生说问题不大但要复查。你忽然意识到，自己陪他们的时间太少了。',
    choices: [
      { text: '请假陪父母做全面复查', effects: { familyPressure: -8, mentalPressure: -3, reputation: -1, wealth: -10 } },
      { text: '安排他们自己去，多打电话', effects: { familyPressure: -3, mentalPressure: 1 } },
      { text: '工作太忙，让亲戚帮忙照看', effects: { familyPressure: 3, mentalPressure: 2, reputation: -1 } }
    ] },
  { id: 'ent230', eventType: 'choice', weight: 3, year: [2, 50], stage: 'life', title: '🏠 单位分房',
    text: '单位分房的消息终于下来了。按工龄排，你刚好卡在线上——前面的人退了，后面的人盯着。房子就在眼前，规矩也在眼前。',
    choices: [
      { text: '按规矩排队，轮到自己就轮到自己', effects: { integrity: 2, familyPressure: 3, mentalPressure: 2 } },
      { text: '找分管领导说说困难', effects: { background: 1, familyPressure: -2, risk: 2, eq: -1 } },
      { text: '放弃这次，等下一批', effects: { integrity: 1, familyPressure: 2, mentalPressure: -2 } }
    ] },
  { id: 'ent231', eventType: 'choice', weight: 3, year: [1, 45], stage: 'life', title: '💐 相亲饭局',
    text: '朋友介绍了个对象，约在周末见面。对方条件不错，就是话里话外对"体制内"挺好奇。这顿饭，吃的是人，谈的是未来。',
    choices: [
      { text: '坦诚相待，聊自己的工作和生活', effects: { familyPressure: -4, eq: 2, mentalPressure: -2 } },
      { text: '尽量展示自己好的一面', effects: { eq: 1, familyPressure: -2, mentalPressure: 2 } },
      { text: '心不在焉，觉得相亲太现实', effects: { familyPressure: 2, eq: -2 } }
    ] },
  // ========== v2.62 学历提升链（MPA/在职研究生，4 步状态机） ==========
  { id: 'ent232', eventType: 'choice', weight: 5, year: [2, 48], stage: 'work', title: '🎓 在职研究生的念头',
    text: '同办公室的小王考上了 MPA，请客那天桌上的人都恭喜他。晚上你躺在床上翻来覆去：文凭这东西，平时没用，用到的时候真能卡死人。',
    choices: [
      { text: '下定决心报考，周末就去报名', effects: { flag: 'mbaApply', mentalPressure: 4, familyPressure: 2, desire: 1 } },
      { text: '先打听打听学费和政策', effects: { flag: 'mbaApply', mentalPressure: 2, iq: 1 } },
      { text: '算了，一把年纪了折腾不起', effects: { mentalPressure: -2, desire: -1 } }
    ] },
  { id: 'ent233', eventType: 'choice', weight: 4, year: [24, 48], stage: 'work', requireFlag: 'mbaApply', title: '📚 备考的代价', // v2.67 文本一致性：'中年人'写照 24 岁起
    text: '备考的日子比想象中难熬。白天在单位写材料，晚上回家啃书，周末的补习班坐满了和你一样的中年人。妻儿的抱怨声越来越响。',
    choices: [
      { text: '咬牙坚持，考上是硬道理', effects: { flag: 'mbaActive', body: -2, mentalPressure: 8, familyPressure: 4, iq: 2 } },
      { text: '放慢节奏，工作家庭两头顾', effects: { flag: 'mbaActive', body: -1, mentalPressure: 4, workAbility: -1 } },
      { text: '实在撑不住，放弃考试', effects: { deleteFlag: 'mbaApply', mentalPressure: -4, body: 1, desire: -2 } }
    ] },
  { id: 'ent234', eventType: 'choice', weight: 4, year: [2, 48], stage: 'work', requireFlag: 'mbaActive', title: '📝 研究生考试',
    text: '考试那天大雪纷飞。考场里坐满了人，前排的年轻人奋笔疾书，你捏着笔，手心全是汗。这一场考完，人生可能就不一样了。',
    choices: [
      { text: '全力以赴，发挥出自己的水平', effects: { flag: 'mbaDegree', iq: 2, mentalPressure: -6, reputation: 1 } },
      { text: '心态平稳，能考上最好', effects: { flag: 'mbaDegree', mentalPressure: -4 } },
      { text: '发挥失常，辜负了这段时间的苦熬', effects: { deleteFlag: 'mbaActive', mentalPressure: 6, familyPressure: 2, desire: -2 } }
    ] },
  { id: 'ent235', eventType: 'choice', weight: 4, year: [2, 48], stage: 'work', requireFlag: 'mbaDegree', title: '🎓 硕士毕业',
    text: '三年苦读，终于拿到硕士学位。毕业典礼上，校长念到你的名字，台下坐着特意赶来的家人。同事们的眼神里，多了几分敬意。',
    choices: [
      { text: '把文凭转化为职场资本', effects: { education: 'master', positionWeight: 5, reputation: 3, mentalPressure: -3, background: 1 } }, // v2.66 毕业即学历落档（原 education 不更新——结算页学历展示停留在本科）
      { text: '低调回归，学以致用', effects: { positionWeight: 3, workAbility: 2, reputation: 1 } },
      { text: '趁热打铁，准备读博', effects: { flag: 'mbaDegree', positionWeight: 2, mentalPressure: 5, desire: 2 } }
    ] },
  // ========== v2.62 新人物：表姐（亲戚线，固定市级） ==========
  { id: 'ent236', eventType: 'choice', weight: 4, year: [1, 40], stage: 'life', title: '👩 表姐的关心',
    text: '许久没见的表姐忽然打来电话，说路过你所在的城市，想一起吃顿饭。她在市里工作多年，官至副处，是家族里混得最好的一个。',
    choices: [
      { text: '热情赴约，聊聊家常', effects: { contact: { id: 'cousin', name: '表姐', relation: 25, position: '市直单位副处长', description: '家族里体制内的长辈' }, familyPressure: -4, mentalPressure: -2 } },
      { text: '带点礼物去，感谢她一直的关照', effects: { contact: { id: 'cousin', name: '表姐', relation: 20, position: '市直单位副处长', description: '家族里体制内的长辈' }, wealth: -5, eq: 1 } },
      { text: '推说工作忙，改天再说', effects: { contact: { id: 'cousin', name: '表姐', relation: 10, position: '市直单位副处长', description: '家族里体制内的长辈' }, familyPressure: 2 } }
    ] },
  { id: 'ent237', eventType: 'choice', weight: 3, year: [2, 48], stage: 'work', requireContact: 'cousin', title: '🗣️ 表姐的指点',
    text: '表姐在电话里听完你最近的情况，沉默了一会儿："你们单位那个位置，你光埋头干不行。领导要的是能替他分忧的人，不是干得最累的人。"',
    choices: [
      { text: '认真记下，按她说的调整思路', effects: { contactRelation: { id: 'cousin', delta: 8 }, positionWeight: 2, eq: 1 } },
      { text: '请教她具体该怎么跟领导相处', effects: { contactRelation: { id: 'cousin', delta: 6 }, positionWeight: 1, iq: 1 } },
      { text: '心里不以为然，觉得她不懂你的单位', effects: { contactRelation: { id: 'cousin', delta: -4 }, positionWeight: -1 } }
    ] },
  { id: 'ent238', eventType: 'choice', weight: 3, year: [2, 48], stage: 'life', requireContact: 'cousin', title: '🍽️ 表姐的饭局',
    text: '表姐组的局，一桌都是市里有头有脸的人。她把你介绍给大家："这是我表弟，在县里工作，年轻有为。"饭桌上，几道目光在你身上多停了几秒。',
    choices: [
      { text: '落落大方，敬酒寒暄', effects: { contactRelation: { id: 'cousin', delta: 8 }, background: 2, reputation: 1, risk: 1 } },
      { text: '少说多听，记住每个人的面孔', effects: { contactRelation: { id: 'cousin', delta: 4 }, background: 1, eq: 1 } },
      { text: '浑身不自在，借口离席', effects: { contactRelation: { id: 'cousin', delta: -6 }, mentalPressure: -2 } }
    ] },
  // ========== v2.62 现有联系人补全 ==========
  { id: 'ent239', eventType: 'choice', weight: 3, year: [2, 55], stage: 'work', requireContact: 'hometown', title: '🏡 老家来人',
    text: '老家同村的叔伯找到你单位门口，拎着两袋土特产，说侄子想在县里找个工作。他搓着手："你是咱村飞出去的金凤凰，可得帮衬帮衬。"',
    choices: [
      { text: '热情招待，帮忙打听机会', effects: { contactRelation: { id: 'hometown', delta: 8 }, background: 1, risk: 1, mentalPressure: 2 } },
      { text: '实话实说，帮他分析门路', effects: { contactRelation: { id: 'hometown', delta: 4 }, iq: 1, integrity: 1 } },
      { text: '推说单位管得严，爱莫能助', effects: { contactRelation: { id: 'hometown', delta: -6 }, reputation: -1 } }
    ] },
  { id: 'ent240', eventType: 'choice', weight: 3, year: [2, 55], stage: 'work', requireContact: 'journalist', title: '📰 记者的追问',
    text: '记者小何私下找到你，说有人给她递了你们单位的举报材料："内容我不方便说，但跟你的分管领域有关。你给我透个底，我好把握分寸。"',
    choices: [
      { text: '如实说明情况，请她核实后再报', effects: { contactRelation: { id: 'journalist', delta: 10 }, integrity: 2, risk: 2, mentalPressure: 4 } },
      { text: '引导她关注其他正面典型', effects: { contactRelation: { id: 'journalist', delta: -2 }, reputation: 1, risk: 1 } },
      { text: '警告她不要乱写', effects: { contactRelation: { id: 'journalist', delta: -10 }, risk: 4, mentalPressure: 4 } }
    ] },
  { id: 'ent241', eventType: 'choice', weight: 3, year: [2, 55], stage: 'life', requireContact: 'doctor', title: '🛏️ 医院的人情',
    text: '赵大夫打来电话，语气有些为难："我爱人单位有个考核的事，听说你能说得上话？"帮，是欠人情；不帮，以后家里老人生病，床位可不好安排。',
    choices: [
      { text: '尽力去办，还他上次的恩情', effects: { contactRelation: { id: 'doctor', delta: 10 }, background: 1, risk: 1, mentalPressure: 1 } },
      { text: '帮他打听情况，但不过多干预', effects: { contactRelation: { id: 'doctor', delta: 4 }, eq: 1 } },
      { text: '婉拒，说自己说不上话', effects: {mentalPressure: -1,  contactRelation: { id: 'doctor', delta: -8 }, body: -1 } }
    ] },
  { id: 'ent242', eventType: 'choice', weight: 3, year: [3, 60], stage: 'life', requireContact: 'elder', title: '🍂 老书记的告别',
    text: '老书记身体每况愈下，医生让准备后事。他拉着你的手，气息微弱："机关里熬了一辈子，最后记住的，还是那些踏实做事的人。"',
    choices: [
      { text: '守在他身边，听他讲完最后一课', effects: { contactRelation: { id: 'elder', delta: 10 }, positionWeight: 1, mentalPressure: 3, eq: 2 } },
      { text: '帮他处理身后事，送他最后一程', effects: { contactRelation: { id: 'elder', delta: 8 }, reputation: 2, mentalPressure: 3, body: -1 } },
      { text: '托人带话问候，自己不敢面对', effects: { contactRelation: { id: 'elder', delta: -6 }, mentalPressure: 4 } }
    ] },
  { id: 'ent243', eventType: 'choice', weight: 3, year: [2, 55], stage: 'work', requireContact: 'business', title: '🤝 商业合作',
    text: '老郑的公司想承接你们单位的一个服务项目，他带着方案来找你："您放心，流程绝对合规，就是希望您能帮忙在评标时多关照。"',
    choices: [
      { text: '按规矩办事，建议他走正常程序', effects: { contactRelation: { id: 'business', delta: 2 }, integrity: 2, reputation: 1 } },
      { text: '介绍他认识负责招标的同事', effects: { contactRelation: { id: 'business', delta: 6 }, background: 1, risk: 3 } },
      { text: '委婉拒绝，避嫌', effects: { contactRelation: { id: 'business', delta: -6 }, integrity: 1 } }
    ] },
  // ========== v2.63 健康管理链（刚性链：触发后必然推进） ==========
  { id: 'ent244', eventType: 'choice', weight: 5, year: [38, 58], stage: 'life', title: '🩺 体检报告的箭头',
    text: '体检报告出来了。血脂、血压、血糖，三个向上的箭头整整齐齐。医生推了推眼镜："你这个年纪，指标该注意了。再这么应酬下去，身体要找你算账。"',
    choices: [
      { text: '认真对待，戒烟限酒开始调理', effects: { flag: 'healthRisk', body: -2, mentalPressure: 2 } },
      { text: '先观察观察，明年再说', effects: { flag: 'healthRisk', body: -3, mentalPressure: 1 } },
      { text: '不当回事，身体哪有那么脆弱', effects: { flag: 'healthHardhead', body: -4, mentalPressure: -1 } }
    ] },
  { id: 'ent245', eventType: 'choice', weight: 5, year: [38, 60], stage: 'life', requireFlag: 'healthRisk', title: '🚶 调理还是硬扛',
    text: '医生的话还在耳边，单位的工作却一天没少。体检单上的箭头不会骗人，可材料明天就要交——你站在了岔路口。',
    choices: [
      { text: '坚持锻炼，规律作息，推掉应酬', effects: { flag: 'healthCare', body: 2, mentalPressure: -3, familyPressure: -2, positionWeight: -1 } },
      { text: '吃药控制，工作照旧', effects: { flag: 'healthCare', body: 1, mentalPressure: 2, risk: 2 } },
      { text: '硬扛着，等忙完这阵再说', effects: { deleteFlag: 'healthRisk', flag: 'healthHardhead', body: -6, mentalPressure: 3 } }
    ] },
  { id: 'ent246', eventType: 'choice', weight: 5, year: [38, 62], stage: 'life', requireFlag: 'healthCare', title: '🏥 住院治疗',
    text: '某个加班的深夜，你眼前一黑，再醒来已经躺在医院的病床上。心电图上的曲线和病房里的消毒水味，让你第一次认真思考"身体是革命的本钱"这句话。',
    choices: [
      { text: '安心住院，把身体彻底调养好', effects: { flag: 'healthTreated', body: 6, mentalPressure: -5, wealth: -15, positionWeight: -3, reputation: -1 } },
      { text: '边住院边处理工作电话', effects: { flag: 'healthTreated', body: 3, mentalPressure: 2, positionWeight: -2, wealth: -10 } }
    ] },
  { id: 'ent247', eventType: 'choice', weight: 5, year: [38, 64], stage: 'life', requireFlag: 'healthTreated', title: '🌅 康复归来',
    text: '出院那天阳光很好。你站在医院门口，看着来来往往的人群，忽然觉得以前争的那些东西，也没那么要紧。身体好了，路还长。',
    choices: [
      { text: '把健康放在第一位，重新出发', effects: { flag: 'healthStable', body: 6, mentalPressure: -8, familyPressure: -4, positionWeight: 1 } },
      { text: '开始养生，也劝同事注意身体', effects: { flag: 'healthStable', body: 4, mentalPressure: -4, reputation: 2 } }
    ] },
  // ========== v2.63 家庭补全 ==========
  { id: 'ent248', eventType: 'choice', weight: 3, year: [2, 50], stage: 'life', requireMarried: true, title: '🧹 家务分工',
    text: '周末早晨，你还在补觉，外面传来叮叮当当的动静。配偶在打扫卫生，洗好的衣服堆在沙发上。这些年，家务活好像一直是ta在做。',
    choices: [
      { text: '起来帮忙，一起把家收拾利索', effects: { familyPressure: -6, eq: 2, body: -1, mentalPressure: -2 } },
      { text: '请钟点工，给自己放个假', effects: { familyPressure: -3, wealth: -5, body: 1 } },
      { text: '继续睡，ta一个人干得了', effects: { familyPressure: 4, eq: -2, risk: 1 } }
    ] },
  { id: 'ent249', eventType: 'choice', weight: 3, year: [2, 50], stage: 'life', requireMarried: true, title: '💍 结婚纪念日',
    text: '翻开日历你才想起来，今天是结婚纪念日。花店还没关门，手机里的备忘录空空如也。这些年，你欠ta的仪式感太多了。',
    choices: [
      { text: '临时订束花，回家做顿饭', effects: { familyPressure: -6, eq: 2, wealth: -8, mentalPressure: -2 } },
      { text: '补个周末旅行，好好陪陪ta', effects: { familyPressure: -8, eq: 3, wealth: -15, body: -1 } },
      { text: '工作太忙，微信发个红包吧', effects: { familyPressure: 2, eq: -2, wealth: -3 } }
    ] },
  { id: 'ent250', eventType: 'choice', weight: 3, year: [5, 50], stage: 'life', requireMarried: true, requireChild: true, title: '🌉 中年婚姻', // v2.67 补 requireChild（'孩子住校后'需有孩子）
    text: '孩子住校后，家里忽然安静下来。你和配偶坐在餐桌两头，各自刷着手机。不知从什么时候起，你们之间的话，只剩"今晚吃什么"和"孩子生活费打了吗"。',
    choices: [
      { text: '主动破冰，聊聊彼此的近况', effects: { familyPressure: -6, eq: 2, mentalPressure: -2 } },
      { text: '约ta周末出去走走，重找当年的感觉', effects: { familyPressure: -8, eq: 3, wealth: -5, body: 1 } },
      { text: '婚姻就是这么平淡，习惯就好', effects: { familyPressure: 3, eq: -2, mentalPressure: -2 } }
    ] },
  { id: 'ent251', eventType: 'choice', weight: 3, year: [2, 40], stage: 'life', requireChild: true, requireChildAgeMin: 6, title: '📄 孩子的成绩单', // v2.67 补 ageMin（成绩单需学龄儿童）
    text: '孩子的成绩单拿回来了，数学 78 分，语文 85 分。老师在家长群里@了你三次："建议家长多关注孩子学习。"你盯着手机屏幕，不知道说什么好。',
    choices: [
      { text: '每晚抽一小时辅导功课', effects: { body: -2, familyPressure: -3, mentalPressure: 2, wealth: -3 } },
      { text: '给孩子报个辅导班', effects: { wealth: -15, familyPressure: -2, mentalPressure: 1 } },
      { text: '孩子开心就好，别逼太紧', effects: { familyPressure: 2, eq: 1 } }
    ] },
  { id: 'ent252', eventType: 'choice', weight: 3, year: [4, 50], stage: 'life', requireChild: true, requireChildAgeMin: 12, title: '🔒 青春期的秘密', // v2.67 补 ageMin（青春期 12+）
    text: '孩子的房门总是锁着。有天你路过，隐约听见ta在哭，敲了敲门，里面传来一句闷闷的"没事"。你站在门口，进退两难。',
    choices: [
      { text: '轻轻敲门，告诉ta你一直在', effects: { familyPressure: -5, eq: 2, mentalPressure: -1 } },
      { text: '写封信塞进门缝，尊重ta的空间', effects: { familyPressure: -4, eq: 1, iq: 1 } },
      { text: '偷看ta的日记，想弄清楚发生了什么', effects: { familyPressure: 4, eq: -2, risk: 2 } }
    ] },
  // ========== v2.65 作风违纪线（酒驾/收礼/公车私用，配刚性处理链） ==========
  { id: 'ent253', eventType: 'choice', weight: 6, year: [1, 55], stage: 'life', title: '🚗 酒驾被查',
    text: '同学聚会散场，你喝了酒却心存侥幸坐进驾驶座。路口红灯亮起，一辆警车停在旁边——"您好，请配合酒精检测。"',
    choices: [
      { text: '配合检测，认罚接受处理', effects: { flag: 'drinkDrive', wealth: -5, mentalPressure: 5, risk: 4, reputation: -1 } },
      { text: '打电话找熟人疏通', effects: { flag: 'drinkDrive', risk: 8, wealth: -10, mentalPressure: 4, background: 1 } },
      { text: '借口没带证件拖延时间', effects: { flag: 'drinkDrive', risk: 12, mentalPressure: 6, reputation: -2 } }
    ] },
  { id: 'ent254', eventType: 'choice', weight: 4, year: [1, 56], stage: 'life', requireFlag: 'drinkDrive', title: '📋 酒驾处理结果',
    text: '血液检测结果出来了。处理决定下发到单位：党内警告、扣发绩效、通报批评。纪检组的谈话室里，你低头看着自己的检讨书——上面每一个字都在提醒你，那一杯酒值多少钱。',
    choices: [
      { text: '诚恳接受处分，深刻检讨', effects: { deleteFlag: 'drinkDrive', risk: -6, positionWeight: -3, reputation: -2, integrity: 2, mentalPressure: 3 } },
      { text: '找领导说情，争取从轻', effects: { deleteFlag: 'drinkDrive', risk: 3, positionWeight: -2, mentalPressure: 4, background: 1 } }
    ] },
  { id: 'ent255', eventType: 'choice', weight: 5, year: [2, 55], stage: 'life', title: '🧧 收礼的烦恼',
    text: '婚宴上，一个想跟你单位做生意的老板借着酒劲塞给你一个厚信封："一点心意，给孩子买玩具的。"四周觥筹交错，没人注意你们这边。',
    choices: [
      { text: '当场退还，说清楚规矩', effects: { integrity: 3, risk: -3, reputation: 1, eq: -1 } },
      { text: '收下，过后上交纪委', effects: { integrity: 2, risk: -2, mentalPressure: 2 } },
      { text: '收下装进口袋', effects: { wealth: 10, risk: 8, integrity: -3, mentalPressure: 3 } }
    ] },
  { id: 'ent256', eventType: 'choice', weight: 5, year: [1, 55], stage: 'work', title: '🚙 公车私用',
    text: '周末你开着单位的公车去接亲戚，在超市停车场被同系统的同事撞见。对方笑着打招呼，你心里却咯噔一下——公车私用，可大可小。',
    choices: [
      { text: '下不为例，以后严格按规定用车', effects: { integrity: 1, risk: -2, mentalPressure: 1 } },
      { text: '编个理由，说是办公事', effects: { risk: 5, mentalPressure: 3, reputation: -1 } },
      { text: '给同事打个招呼，请他别声张', effects: { risk: 4, background: 1, eq: -1, mentalPressure: 2 } }
    ] },
  // ========== v2.65 购房贷款链（贷款→月供→还清） ==========
  { id: 'ent257', eventType: 'choice', weight: 8, year: [3, 50], stage: 'life', title: '🏠 贷款买房',
    text: '看了一年的房子，终于等到一套合适的。总价不低——公积金贷款加商贷，月供要吃掉你工资的三成。签字的笔，在手里有点沉。',
    choices: [
      { text: '贷款上车，从此有了自己的家', effects: { flag: 'mortgage', wealth: -20, familyPressure: -6, mentalPressure: 3, family: 2 } },
      { text: '凑全款买，一步到位', effects: { wealth: -60, familyPressure: -4, mentalPressure: 1, family: 2 } },
      { text: '再攒几年，先租房', effects: { wealth: -3, familyPressure: 3, mentalPressure: 2 } }
    ] },
  { id: 'ent258', eventType: 'choice', weight: 4, year: [3, 52], stage: 'life', requireFlag: 'mortgage', title: '📆 月供的压力',
    text: '房贷扣款日。工资到账还没捂热，月供就划走了一大笔。你看着账户余额，想起售楼处那句"月供虽多，房子是自己的"——是房子自己的，钱也是银行的了。',
    choices: [
      { text: '精打细算，缩减日常开支', effects: { wealth: -6, familyPressure: -2, mentalPressure: 2, body: -1 } },
      { text: '接点私活补贴月供', effects: { wealth: -2, risk: 3, body: -1, mentalPressure: 2 } },
      { text: '先拖着，实在不行就断供', effects: { deleteFlag: 'mortgage', risk: 6, reputation: -3, mentalPressure: 5, wealth: -5 } }
    ] },
  { id: 'ent259', eventType: 'choice', weight: 4, year: [4, 55], stage: 'life', requireFlag: 'mortgage', title: '💸 提前还贷',
    text: '年终奖到账，加上几年的积蓄，够把剩余贷款一次性还清了。银行柜台的经理笑着问："确定要提前结清？"你深吸一口气——终于要无债一身轻了。',
    choices: [
      { text: '提前还清，卸下这块石头', effects: { deleteFlag: 'mortgage', wealth: -40, mentalPressure: -6, familyPressure: -3 } },
      { text: '留一部分现金应急，继续月供', effects: { mentalPressure: 1, wealth: -10 } }
    ] },
  // ========== v2.65 站队/派系线（站队后 2 年派系风云） ==========
  { id: 'ent260', eventType: 'choice', weight: 3, year: [2, 50], stage: 'work', requireFlag: 'faction_lean', title: '🌪️ 派系风云',
    text: '你当年站的那条线，如今走到了十字路口：一位老领导退居二线，一位新领导强势上位。单位里人心浮动，私下都在猜——这次洗牌，谁会上去，谁会出局。',
    choices: [
      { text: '坚定站在老领导这边，共进退', effects: { flag: 'faction_steadfast', positionWeight: 3, background: 2, risk: 5, mentalPressure: 4 } }, // v2.66 闭环：坚定站队 → 2 年后必然得势（ent261）→ 权力更迭 → 必然清算（ent262）
      { text: '及时转向，向新领导靠拢', effects: { deleteFlag: 'faction_lean', positionWeight: 2, risk: 3, integrity: -1, mentalPressure: 3 } },
      { text: '保持中立，只谈工作不谈站队', effects: { deleteFlag: 'faction_lean', integrity: 2, positionWeight: -1, risk: -2 } }
    ] },
  { id: 'ent261', eventType: 'choice', weight: 3, year: [3, 52], stage: 'work', requireFlag: 'faction_steadfast', title: '📈 派系得势',
    text: '你站的那条线赢了。老领导高升，临走前把你的名字写进了推荐名单。单位里有人开始主动跟你套近乎——当年一起喝酒的人，如今看你的眼神都不一样了。',
    choices: [
      { text: '乘势而上，抓住这波机会', effects: { flag: 'faction_leaned_out', positionWeight: 4, background: 2, reputation: 2, risk: 2 } }, // v2.66 得势后老领导高升=新权力更迭 → 必然清算（ent262）
      { text: '保持低调，专心把事做好', effects: { flag: 'faction_leaned_out', positionWeight: 2, integrity: 1, reputation: 1 } }
    ] },
  { id: 'ent262', eventType: 'choice', weight: 3, year: [3, 52], stage: 'work', requireFlag: 'faction_leaned_out', title: '📉 靠山倒了',
    text: '你站的那条线失势了。老领导被调离，新领导上任第一件事就是"整肃"。有人开始翻旧账，你在走廊里经过，总觉得背后有目光在打量。',
    choices: [
      { text: '主动向组织说明情况，接受安排', effects: { deleteFlag: 'faction_leaned_out', positionWeight: -3, risk: -4, integrity: 2, mentalPressure: 5 } },
      { text: '找新领导表忠心，争取重新开始', effects: { deleteFlag: 'faction_leaned_out', positionWeight: -1, risk: 2, eq: -1, mentalPressure: 4 } },
      { text: '硬扛着，等风头过去', effects: { positionWeight: -5, risk: 4, mentalPressure: -1 } } // v2.66 硬扛不删 flag——ent262 已 seen 链自然终止，flag 残留无消费
    ] },
  // ========== v2.65 恋爱超期决断（恋爱满 3 年必然决断） ==========
  { id: 'ent263', eventType: 'choice', weight: 4, year: [1, 45], stage: 'life', requireFlag: 'dating', title: '💍 恋爱三年',
    text: '你们在一起三年了。从热恋到平淡，从无话不谈到相视无言。朋友的婚礼上，新娘抛出的捧花恰好落在你怀里——全场起哄，你看向ta，心里却有个声音在问：三年了，是继续，还是就此打住？',
    choices: [
      { text: '顺势求婚，给这段感情一个交代', effects: { marry: true, deleteFlag: 'dating', familyPressure: -4, mentalPressure: -3, reputation: 2, eq: 2 } },
      { text: '认真谈一次，决定是否继续', effects: { deleteFlag: 'dating', flag: 'dating', mentalPressure: -2, eq: 1 } },
      { text: '发现彼此并不合适，和平分手', effects: { deleteFlag: 'dating', mentalPressure: 4, familyPressure: 3, eq: -2 } }
    ] },
  // ========== v2.68 联系人互动补全（新人物深度线） ==========
  { id: 'ent264', eventType: 'choice', weight: 4, year: [2, 50], stage: 'work', requireContact: 'sizhang', title: '📨 司长的调令',
    text: '司长托人带话给你：省厅综合处有个位置，他想调你过去。去了就是平台跃升，但县里的老领导刚把你列为重点培养对象——两头都是人情。',
    choices: [
      { text: '接受调令，感谢司长提携', effects: { contactRelation: { id: 'sizhang', delta: 8 }, positionWeight: 3, background: 2, risk: 2, mentalPressure: 3 } },
      { text: '婉拒，说基层工作还没做完', effects: { contactRelation: { id: 'sizhang', delta: -4 }, integrity: 2, positionWeight: 1 } },
      { text: '请司长再给点时间考虑', effects: { contactRelation: { id: 'sizhang', delta: 2 }, mentalPressure: 2, eq: 1 } }
    ] },
  { id: 'ent265', eventType: 'choice', weight: 3, year: [2, 50], stage: 'life', requireContact: 'roommate', title: '💐 室友的婚礼',
    text: '室友要结婚了，请你当证婚人。婚礼前夜他拉着你喝酒："这些年谢谢你了。我这人没什么朋友，你是唯一一个知道我当年有多惨的人。"',
    choices: [
      { text: '答应证婚，见证他的新生活', effects: { contactRelation: { id: 'roommate', delta: 10 }, eq: 2, mentalPressure: -2 } },
      { text: '推辞证婚，但包个大红包', effects: {mentalPressure: -2,  contactRelation: { id: 'roommate', delta: 4 }, wealth: -8 } },
      { text: '说工作忙，人不到礼到', effects: { contactRelation: { id: 'roommate', delta: -5 }, wealth: -4, eq: -1 } }
    ] },
  { id: 'ent266', eventType: 'choice', weight: 3, year: [2, 52], stage: 'life', requireContact: 'cousin', title: '🎒 表姐的求助',
    text: '表姐难得开口求你：她家孩子今年高考，想让你帮忙找个靠谱的辅导老师，顺便给孩子讲讲体制内怎么选专业。',
    choices: [
      { text: '认真帮忙，还她多年的关照', effects: { contactRelation: { id: 'cousin', delta: 10 }, familyPressure: -3, mentalPressure: 2, eq: 1 } },
      { text: '推荐老师，但说自己不太懂', effects: { contactRelation: { id: 'cousin', delta: 4 }, eq: 1 } },
      { text: '推说工作忙，让她自己想办法', effects: { contactRelation: { id: 'cousin', delta: -8 }, familyPressure: 2 } }
    ] },
  { id: 'ent267', eventType: 'choice', weight: 3, year: [2, 58], stage: 'work', requireContact: 'crew_boss', title: '🩻 领导的体检',
    text: '李处把你叫到办公室，关上门，压低声音："体检报告出来了，有点问题，但我不想让组织知道——你去帮我拿报告，别让第二个人看见。"',
    choices: [
      { text: '帮他保密，陪他去看医生', effects: { contactRelation: { id: 'crew_boss', delta: 12 }, positionWeight: 2, risk: 3, mentalPressure: 2 } },
      { text: '劝他如实向组织报告', effects: { contactRelation: { id: 'crew_boss', delta: -2 }, integrity: 2, risk: 1 } },
      { text: '假装没听见，躲开这趟浑水', effects: { contactRelation: { id: 'crew_boss', delta: -8 }, risk: -1 } }
    ] },
  { id: 'ent268', eventType: 'choice', weight: 3, year: [2, 55], stage: 'work', requireContact: 'inspector', title: '🔚 检查组的告别',
    text: '检查组撤走前的最后一晚，带队的老同志单独请你喝茶："你这单位问题不少，但你是个实在人。记住一句话——水至清则无鱼，但浑水摸鱼的人，迟早会被水淹。"',
    choices: [
      { text: '记下他的话，谢谢他的提点', effects: { contactRelation: { id: 'inspector', delta: 10 }, integrity: 2, positionWeight: 1, mentalPressure: -2 } },
      { text: '借机打听检查组结论', effects: { contactRelation: { id: 'inspector', delta: -4 }, risk: 2, mentalPressure: 3 } },
      { text: '客套寒暄，送他上车', effects: { contactRelation: { id: 'inspector', delta: 3 }, eq: 1 } }
    ] },
  { id: 'ent269', eventType: 'choice', weight: 3, year: [2, 55], stage: 'work', requireContact: 'partySchool', title: '🍶 党校同窗的饭局',
    text: '党校同窗老钱做东，请了几个当年培训班的同学。酒过三巡，老钱凑过来："兄弟，听说你们市里有个新项目？咱们互通有无，共赢嘛。"',
    choices: [
      { text: '碰杯应下，但只谈风月不谈公事', effects: { contactRelation: { id: 'partySchool', delta: 6 }, eq: 1, integrity: 1 } },
      { text: '暗示项目还没定，到时候再说', effects: { contactRelation: { id: 'partySchool', delta: 8 }, risk: 2, mentalPressure: 2 } },
      { text: '明说规矩：项目的事按程序来', effects: { contactRelation: { id: 'partySchool', delta: -5 }, integrity: 2 } }
    ] },
  { id: 'ent270', eventType: 'choice', weight: 3, year: [2, 55], stage: 'life', requireContact: 'oldFriend', title: '🌱 老友的创业',
    text: '老友拿着商业计划书来找你："我准备辞职创业了，就做农产品电商。你是懂政策的人，帮我看看补贴怎么申请？"',
    choices: [
      { text: '认真帮他梳理政策，出主意', effects: { contactRelation: { id: 'oldFriend', delta: 8 }, iq: 1, mentalPressure: 2, wealth: -2 } },
      { text: '提醒他创业风险大，劝他谨慎', effects: { contactRelation: { id: 'oldFriend', delta: 3 }, eq: 1, integrity: 1 } },
      { text: '敷衍几句，不想沾这事', effects: { contactRelation: { id: 'oldFriend', delta: -6 }, eq: -1, mentalPressure: -1 } }
    ] },
  // ===== v2.1.3 特殊事件扩充（荣誉/责任/家庭/时代/奇遇） =====
  // ---- 突发荣誉线（sudden 纯效果）----
  { id: 'ent271', stage: 'work', eventType: 'sudden', weight: 6, year: [22, 55], title: '🎖️ 三等功嘉奖', text: '一起跨部门协作的专项任务圆满完成，你在其中的关键贡献被上级点名。表彰大会上，三等功的奖章戴在你胸前——档案里从此多了浓墨重彩的一笔。', effects: { positionWeight: 2, reputation: 2, mentalPressure: -2 } },
  { id: 'ent272', stage: 'work', eventType: 'sudden', weight: 4, year: [30, 58], title: '🏅 劳动模范表彰', text: '市里评选劳动模范，你在单位推荐中高票当选。颁奖典礼上鲜花与掌声簇拥，你的事迹被写进了系统内的宣传简报。', effects: { reputation: 3, background: 1 } },
  { id: 'ent273', stage: 'work', eventType: 'sudden', weight: 6, year: [22, 52], title: '📣 通报表扬', text: '上级对你近期的工作成绩发了通报表扬——红头文件，抄送全市。同事看你的眼神都不一样了。', effects: { integrity: 2, reputation: 1, mentalPressure: -1 } },
  // ---- 时代线（sudden 纯效果）----
  { id: 'ent280', stage: 'work', eventType: 'sudden', weight: 6, year: [22, 60], title: '💰 工资普调', text: '机关事业单位工资普调文件下来了，涨薪部分随当月工资一次性补发到位。大家议论纷纷，说这次涨幅是近十年最大的一次。', effects: { wealth: 15 } },
  { id: 'ent281', stage: 'work', eventType: 'sudden', weight: 6, year: [22, 55], title: '🔒 编制冻结', text: '机构编制委员会发文：即日起冻结全系统新增编制，调动、晋升、遴选全部暂停。想挪窝的同事唉声叹气，你也被困在了原地。', effects: { positionWeight: -1, mentalPressure: 2 } },
  { id: 'ent282', stage: 'work', eventType: 'sudden', weight: 4, year: [22, 58], title: '🏢 单位合并', text: '机构改革方案落地：你所在的单位与另一个部门合并。新单位盘子更大、岗位更多，但也意味着原有格局全部打乱重排。', effects: { positionWeight: 2, mentalPressure: 3, risk: 1 } },
  // ---- 责任处置线（choice 三难抉择）----
  { id: 'ent274', stage: 'work', eventType: 'choice', weight: 5, year: [22, 58], title: '🚨 辖区安全生产事故', text: '凌晨两点，辖区一家小作坊发生火灾，造成财产损失，所幸无人员伤亡。消息天亮前就会传开，处置窗口只有几个小时。', choices: [
    { text: '连夜赶赴现场，组织善后处置', effects: { positionWeight: 2, mentalPressure: 4, reputation: 1 } },
    { text: '如实上报，请求上级支援', effects: { risk: -2, positionWeight: -1, integrity: 2 } },
    { text: '先压住消息，内部处理了再说', effects: { risk: 6, wealth: 10, reputation: -1 } }
  ] },
  { id: 'ent275', stage: 'work', eventType: 'choice', weight: 5, year: [22, 60], title: '🌊 防汛应急', text: '气象台发布暴雨红色预警，辖区有一段老旧堤防。防指要求 24 小时值守，但人力物力都紧张。', choices: [
    { text: '提前部署转移安置，宁可十防九空', effects: { reputation: 2, mentalPressure: -2, familyPressure: 1 } },
    { text: '安排轮班值守，动态观察水位', effects: { workAbility: 1, mentalPressure: 2 } },
    { text: '先忙手头考核材料，汛情来了再说', effects: { risk: 3, mentalPressure: 3, positionWeight: -1 } }
  ] },
  { id: 'ent276', stage: 'work', eventType: 'choice', weight: 5, year: [22, 58], title: '🚪 信访极端事件', text: '一名老上访户爬上信访局楼顶，扬言不给解决就跳下来。楼下围满了人，摄像机已经对准了现场。', choices: [
    { text: '亲自上楼，面对面做工作', effects: { reputation: 2, risk: -2, mentalPressure: 4 } },
    { text: '协调相关部门到场联合处置', effects: { workAbility: 1, risk: -1, mentalPressure: 2 } },
    { text: '让下属先稳着，自己躲开镜头', effects: { risk: 3, positionWeight: -1, reputation: -1 } }
  ] },
  // ---- 家庭大事（choice 重大抉择）----
  { id: 'ent277', stage: 'life', eventType: 'choice', weight: 4, year: [30, 60], title: '🏥 父母病危', text: '老家来电：父亲突发脑梗，正在抢救。你手头正有一个全系统都在盯的重点项目，领导刚在会上点了你的名。', choices: [
    { text: '请假赶回老家，守在病床前', effects: { familyPressure: -5, mentalPressure: 3, background: -1, positionWeight: -1 } },
    { text: '托付家人照料，先把手头项目干完', effects: { background: 1, positionWeight: 1, familyPressure: 8 } },
    { text: '请几天假回去，期间远程盯项目', effects: { familyPressure: -2, mentalPressure: 2, workAbility: 1 } }
  ] },
  { id: 'ent278', stage: 'life', eventType: 'choice', weight: 4, year: [25, 55], title: '💍 配偶升职', text: '你爱人单位宣布了提拔名单，她被任命为部门负责人。晚上她跟你商量：新岗位要经常出差，孩子接送得重新安排。', choices: [
    { text: '全力支持，家务多担一些', effects: { familyPressure: -2, background: 1, eq: 2 } },
    { text: '支持但约法三章，家庭优先', effects: { familyPressure: 1, eq: 1 } },
    { text: '心里不是滋味，嘴上阴阳怪气', effects: { familyPressure: 4, mentalPressure: 2, eq: -2 } }
  ] },
  { id: 'ent279', stage: 'life', eventType: 'choice', weight: 4, year: [35, 60], title: '🏚️ 老宅拆迁', text: '老家传来消息：祖宅所在片区要拆迁了。补偿方案有两档——签字拿钱，或者等政策观望。老宅是爷爷那辈留下的，邻居们都在连夜签协议。', choices: [
    { text: '签字拿钱，落袋为安', effects: { wealth: 40, peopleReputation: -2 } },
    { text: '坚持观望，想多要一点', effects: { wealth: 10, risk: 2, mentalPressure: 2 } },
    { text: '委托堂弟代办，自己不管', effects: { wealth: 20, peopleReputation: -1 } }
  ] },
  // ---- 奇遇（choice 灰色地带）----
  { id: 'ent283', stage: 'work', eventType: 'choice', weight: 5, year: [22, 55], title: '✉️ 匿名信', text: '你的办公桌上出现了一封没有署名的信，里面是单位某位领导收受好处的详细记录，落款写着"一个看不惯的人"。这封信烫手——留也不是，交也不是。', choices: [
    { text: '原封不动上交组织', effects: { integrity: 3, risk: -2, reputation: 1 } },
    { text: '烧掉，当没看见', effects: { mentalPressure: -3, risk: 3 } },
    { text: '自己私下核实一下再说', effects: { iq: 2, risk: 5, mentalPressure: 3 } }
  ] },
  { id: 'ent284', stage: 'life', eventType: 'choice', weight: 4, year: [25, 60], title: '🧑‍⚕️ 江湖老中医', text: '同事介绍了一位"专治疑难杂症"的老中医，诊所在城中村深处，墙上挂满锦旗。你最近确实浑身不舒服，医院又查不出毛病。', choices: [
    { text: '试试偏方，说不定管用', effects: { body: 4, risk: 2, wealth: -3 } },
    { text: '坚持正规医院复查', effects: { body: 2, wealth: -5, mentalPressure: 1 } },
    { text: '半信半疑，只买调理药膳', effects: { body: 2, wealth: -1 } }
  ] },

    // ===== v2.1.5 N2 新特色人物（深度审查）：国企老总 / 信访群众代表 / 居委会主任 =====
    { id: 'e291', stage: 'work', eventType: 'choice', title: '项目合作饭局', weight: 4, pools: ['public'], text: '一个招商引资的项目对接会上，本地国企老总吴总对你的汇报印象深刻。会后他让秘书递了名片，说"改天请你吃饭，聊聊项目的事"。', choices: [
      { text: '应邀赴约，聊聊合作可能', effects: {contact: {id: 'boss', name: '吴总', relation: 25, position: '本地国企老总', description: '项目对接会认识的，对你印象不错'}, background: 1, mentalPressure: 1} },
      { text: '婉拒饭局，但保持工作联系', effects: {contact: {id: 'boss', name: '吴总', relation: 10, position: '本地国企老总', description: '项目对接会认识'}, integrity: 1, eq: 1} },
      { text: '饭局带上同事一起去', effects: {contact: {id: 'boss', name: '吴总', relation: 15, position: '本地国企老总', description: '项目对接会认识'}, background: 1, eq: 1, risk: 1} },
      { text: '婉拒并保持距离', effects: {integrity: 2, background: -1, risk: -1} },
    ]},
    { id: 'e292', stage: 'work', eventType: 'choice', title: '吴总的合作邀约', weight: 5, requireContact: 'boss', text: '吴总托人带话：他公司有个项目想"借你们单位的壳"申报专项补贴，事成之后好处费按比例给。他知道你正缺钱。', choices: [
      { text: '严词拒绝，并提醒他合规', effects: {integrity: 4, risk: -2, reputation: 1, contactRelation: {id: 'boss', delta: -15}} },
      { text: '婉拒但不说破', effects: {integrity: 2, contactRelation: {id: 'boss', delta: -5}, eq: 1} },
      { text: '暗示可以帮忙牵线', effects: {background: 3, risk: 4, desire: 3, contactRelation: {id: 'boss', delta: 15}, flag: 'bossTempt'} },
      { text: '直接谈条件要好处', effects: {wealth: 30, risk: 6, integrity: -4, contactRelation: {id: 'boss', delta: 25}, flag: 'bossTempt'} },
    ]},
    { id: 'e293', stage: 'work', eventType: 'choice', title: '吴总的项目落地', weight: 3, requireFlag: 'bossTempt', text: '吴总的项目在各方"运作"下顺利落地。他兑现承诺时格外大方，还暗示以后"还有更肥的差事"。', choices: [
      { text: '收下好处，继续合作', effects: {wealth: 25, risk: 6, integrity: -3, heat: 8, flag: 'bossKickback'} },
      { text: '只收一半，说是辛苦费', effects: {wealth: 12, risk: 4, integrity: -1, heat: 4, flag: 'bossKickback'} },
      { text: '退还并结束关系', effects: {integrity: 3, risk: -3, reputation: 1, contactRelation: {id: 'boss', delta: -20}} },
      { text: '借机查他的项目底细', effects: {iq: 2, risk: 2, desire: 1, heat: 2, background: 1} },
    ]},
    { id: 'e294', stage: 'work', eventType: 'choice', title: '信访接待日', weight: 4, pools: ['public'], text: '每月信访接待日，你遇到一位连续上访多年的老同志。他脾气倔，但讲起自己家的事条理清楚。同事们都躲着他。', choices: [
      { text: '认真听完并记录诉求', effects: {contact: {id: 'petitioner', name: '老周', relation: 20, position: '信访群众代表', description: '信访接待日认识的倔老头'}, eq: 1, reputation: 1, mentalPressure: 2} },
      { text: '先安抚情绪再了解情况', effects: {contact: {id: 'petitioner', name: '老周', relation: 15, position: '信访群众代表', description: '信访接待日认识'}, eq: 2, mentalPressure: 1} },
      { text: '按流程登记，转交相关科室', effects: {workAbility: 2, integrity: 1, background: 1} },
      { text: '请同事代为接待', effects: {eq: -1, background: 1, mentalPressure: -1} },
    ]},
    { id: 'e295', stage: 'work', eventType: 'choice', title: '老周的信任', weight: 5, requireContact: 'petitioner', text: '老周的事在你协调下有了实质进展。他难得露出笑脸，说"你是第一个真正听我说话的人"。他提出要请你吃饭。', choices: [
      { text: '婉拒饭局，让他安心办正事', effects: {integrity: 2, reputation: 1, eq: 1, contactRelation: {id: 'petitioner', delta: 10}} },
      { text: '接受饭局，了解他的难处', effects: {contactRelation: {id: 'petitioner', delta: 20}, eq: 1, background: 1, risk: 1} },
      { text: '借机宣传政策法规', effects: {workAbility: 2, integrity: 1, eq: 1} },
      { text: '保持距离，公事公办', effects: {integrity: 2, contactRelation: {id: 'petitioner', delta: -5}} },
    ]},
    { id: 'e296', stage: 'work', eventType: 'choice', title: '缠访化解', weight: 3, requireContact: 'petitioner', text: '老周介绍了几位同样情况的群众来反映问题，他们情绪激动，把办公室围住了。有人说"老周都能解决，你们为什么不行"。', choices: [
      { text: '逐一登记诉求，说明办理时限', effects: {workAbility: 3, eq: 2, reputation: 1, mentalPressure: 3} },
      { text: '请老周帮忙劝解安抚', effects: {eq: 2, background: 1, contactRelation: {id: 'petitioner', delta: 10}, mentalPressure: 1} },
      { text: '召集相关科室现场会办', effects: {workAbility: 2, background: 2, integrity: 1} },
      { text: '先报警维持秩序', effects: {eq: -2, risk: 2, reputation: -1} },
    ]},
    { id: 'e297', stage: 'life', eventType: 'choice', title: '社区业委会活动', weight: 3, pools: ['public'], text: '小区业委会组织周末活动，居委会主任张阿姨热情地拉你参加。她说小区里就数你们年轻人"懂政策"，想请你帮忙看看物业合同。', choices: [
      { text: '热心帮忙，参加活动', effects: {contact: {id: 'neighborHead', name: '张阿姨', relation: 20, position: '居委会主任', description: '社区活动认识的热心主任'}, eq: 1, reputation: 1, familyPressure: -1} },
      { text: '婉拒，工作太忙', effects: {mentalPressure: -2, background: -1} },
      { text: '只参加活动，不掺和物业的事', effects: {eq: 1, mentalPressure: -1, contact: {id: 'neighborHead', name: '张阿姨', relation: 10, position: '居委会主任', description: '社区活动认识'}} },
      { text: '帮看合同但要报酬', effects: {wealth: 3, eq: -1, risk: 1} },
    ]},
    { id: 'e298', stage: 'life', eventType: 'choice', title: '邻里互助（独居老人）', weight: 5, requireContact: 'neighborHead', text: '张阿姨找你帮忙：楼上独居老人水管坏了，子女不在身边，物业说今天排不上号。她问你有没有认识的师傅。', choices: [
      { text: '联系认识的师傅加急处理', effects: {background: 1, reputation: 1, eq: 1, contactRelation: {id: 'neighborHead', delta: 10}, familyPressure: -1} },
      { text: '帮老人联系社区志愿者', effects: {eq: 1, reputation: 1, workAbility: 1, contactRelation: {id: 'neighborHead', delta: 5}} },
      { text: '自己上门帮忙看看', effects: {eq: 2, body: -1, reputation: 1, contactRelation: {id: 'neighborHead', delta: 8}} },
      { text: '让她打物业投诉电话催', effects: {eq: -1, background: -1} },
    ]},
    { id: 'e299', stage: 'life', eventType: 'choice', title: '社区选举风波', weight: 3, requireContact: 'neighborHead', text: '业委会换届，有人想把张阿姨挤下去，在群里散布谣言。张阿姨没说什么，但你看到她眼圈红了。你准备怎么办？', choices: [
      { text: '帮她澄清谣言，支持她连任', effects: {integrity: 2, eq: 2, reputation: 1, contactRelation: {id: 'neighborHead', delta: 15}, risk: 1} },
      { text: '私下安慰她，不掺和选举', effects: {eq: 2, mentalPressure: -1, contactRelation: {id: 'neighborHead', delta: 5}} },
      { text: '劝她退出，别趟浑水', effects: {eq: 1, mentalPressure: -1, background: -1, contactRelation: {id: 'neighborHead', delta: -5}} },
      { text: '在群里客观陈述事实', effects: {integrity: 2, workAbility: 1, reputation: 1, risk: 1} },
    ]},

    // ===== v2.1.6 新特色人物：银行理财经理林经理（banker）+ 退休老领导方局长（exBoss）=====
    { id: 'e680', stage: 'life', eventType: 'choice', title: '理财讲座', weight: 4, requireWealth: 100, pools: ['public'], text: '银行在单位附近开了一场"家庭理财讲座"，主讲人是理财经理林经理。他讲资产配置讲得头头是道，散场时特意找到你："您这样的稳定收入群体，最适合做长期规划。"', choices: [
      { text: '留了名片，请他做个方案', effects: {contact: {id: 'banker', name: '林经理', relation: 20, position: '银行理财经理', description: '理财讲座认识的专业人士'}, iq: 1, mentalPressure: 1} },
      { text: '听了讲座，自己回去研究', effects: {iq: 2, wealth: 1} },
      { text: '只是路过听听', effects: {mentalPressure: -1, background: -1} },
      { text: '警惕推销，直接离场', effects: {integrity: 1, risk: -1, background: -1} },
    ]},
    { id: 'e681', stage: 'life', eventType: 'choice', title: '高息理财推荐', weight: 4, requireContact: 'banker', text: '林经理私下告诉你，行里有一款"内部额度"的理财产品，年化比柜台高不少，就是名额有限、不对外。他"看在老客户份上"给你留了一个。', choices: [
      { text: '核实产品备案信息再决定', effects: {iq: 2, workAbility: 1, mentalPressure: 1} },
      { text: '收益高就买，机会难得', effects: {wealth: 12, risk: 4, heat: 2, flag: 'bankerTempt'} },
      { text: '只投一小部分试水', effects: {wealth: 5, risk: 2, iq: 1} },
      { text: '婉拒，只买正规柜台产品', effects: {integrity: 2, risk: -2, background: -1} },
    ]},
    { id: 'e682', stage: 'life', eventType: 'choice', title: '贷款展期', weight: 4, requireContact: 'banker', requireDebt: 80, text: '你的债务让银行风控注意到了。林经理悄悄提醒你：可以申请贷款展期，利息也能谈，但"帮忙"总要有点表示。他看着你，等你表态。', choices: [
      { text: '按正规流程申请展期', effects: {debtRateMul: 0.5, mentalPressure: -2, integrity: 1} },
      { text: '请他"通融"减免部分本金', effects: {debtForgive: 20, risk: 3, heat: 2, flag: 'bankerTempt', contactRelation: {id: 'banker', delta: 5}} },
      { text: '拒绝展期，硬扛着还', effects: {mentalPressure: 3, integrity: 2, risk: -1} },
      { text: '咨询其他银行的置换方案', effects: {iq: 1, background: 1, mentalPressure: 1} },
    ]},
    { id: 'e683', stage: 'life', eventType: 'choice', title: '内部消息（股市）', weight: 3, requireContact: 'banker', requireWealth: 150, text: '林经理在饭局上"喝高了"，透露了一支即将被收购的股票代码，说"跟着买，稳赚不赔，就是千万别声张"。', choices: [
      { text: '认真核实消息来源，谨慎操作', effects: {iq: 2, wealth: 3, mentalPressure: 1} },
      { text: '重仓买入，闷声发财', effects: {wealth: 18, risk: 5, heat: 5, flag: 'bankerTempt', integrity: -1} },
      { text: '只买一点试试水', effects: {wealth: 6, risk: 2} },
      { text: '提醒他内幕交易违法', effects: {integrity: 3, risk: -2, contactRelation: {id: 'banker', delta: -10}} },
    ]},
    { id: 'e684', stage: 'career', eventType: 'choice', title: '退休仪式', weight: 3, year: [45, 60], pools: ['public'], text: '分管领导方局长到了退休年龄，单位办了一场退休仪式。他逐个握手，走到你面前时多停了几秒："你是个干事的人，往后遇到难处，可以来找我。"', choices: [
      { text: '认真道谢，记下这份提携', effects: {contact: {id: 'exBoss', name: '方局长', relation: 25, position: '退休老领导', description: '退休仪式上对你青眼有加'}, background: 1, eq: 1} },
      { text: '当场表态一定常去拜访', effects: {contact: {id: 'exBoss', name: '方局长', relation: 20, position: '退休老领导', description: '退休仪式认识'}, background: 1, mentalPressure: 1} },
      { text: '客套几句，保持距离', effects: {contact: {id: 'exBoss', name: '方局长', relation: 10, position: '退休老领导', description: '退休仪式认识'}, integrity: 1} },
      { text: '只当普通仪式，不放心上', effects: {mentalPressure: -1, background: -1} },
    ]},
    { id: 'e685', stage: 'career', eventType: 'choice', title: '老领导的推荐', weight: 4, requireContact: 'exBoss', text: '新来的分管领导正在物色科室负责人。老领导方局长听说后，主动给新领导打了电话推荐你——他说"这孩子我了解，能扛事"。', choices: [
      { text: '登门道谢，请教新领导风格', effects: {positionWeight: 2, background: 2, eq: 1} },
      { text: '低调表示会加倍努力', effects: {workAbility: 2, integrity: 1, positionWeight: 1} },
      { text: '请老领导多美言几句', effects: {positionWeight: 1, desire: 2, risk: 1} },
      { text: '谢绝推荐，想靠自己', effects: {integrity: 2, positionWeight: -1, workAbility: 1} },
    ]},
    { id: 'e686', stage: 'career', eventType: 'choice', title: '老领导的请托', weight: 4, requireContact: 'exBoss', text: '方局长退下来后开了家咨询公司，想请你帮忙牵线单位的采购项目，说"兄弟单位都这么操作，介绍费不会少你的"。', choices: [
      { text: '婉拒，并提醒他合规经营', effects: {integrity: 3, risk: -2, contactRelation: {id: 'exBoss', delta: -10}} },
      { text: '推说项目都是招投标流程', effects: {integrity: 2, eq: 1, contactRelation: {id: 'exBoss', delta: -5}} },
      { text: '帮他引荐，收介绍费', effects: {wealth: 20, risk: 5, heat: 4, flag: 'exBossTempt'} },
      { text: '先了解他公司资质再说', effects: {iq: 1, background: 1, risk: 1} },
    ]},
    { id: 'e687', stage: 'life', eventType: 'choice', title: '老领导住院', weight: 3, requireContact: 'exBoss', text: '听说方局长住院了，做了个不小的手术。他孩子都在外地，病房里冷冷清清。你知道这件事后……', choices: [
      { text: '抽空去医院探望陪护', effects: {eq: 2, reputation: 1, contactRelation: {id: 'exBoss', delta: 15}, mentalPressure: 1} },
      { text: '托人带话问候，送些水果', effects: {eq: 1, contactRelation: {id: 'exBoss', delta: 5}} },
      { text: '工作忙，先记在心里', effects: {mentalPressure: 1, contactRelation: {id: 'exBoss', delta: -3}} },
      { text: '人走茶凉，不必多事', effects: {eq: -1, background: -1, contactRelation: {id: 'exBoss', delta: -8}} },
    ]},
    // v2.1.6 敌人互动补全：enemy_167（当众批评结怨）/enemy_168b（举报后心腹盯梢）此前只有结识无互动——补消费事件闭环
    { id: 'ent285', stage: 'work', eventType: 'choice', weight: 5, requireContact: 'enemy_167', requireContactMin: -30, title: '陈年旧账', text: '晋升考察谈话时，考察组问起你和王副科长的关系。当年例会上你当众批评过他，如今他在关键节点提起这事，话里话外都是刺。', choices: [
      { text: '坦承分歧，但不评价个人', effects: {integrity: 2, reputation: 1, mentalPressure: 2, contactRelation: { id: 'enemy_167', delta: 10 } } },
      { text: '主动找他叙旧化解', effects: {eq: 2, contactRelation: { id: 'enemy_167', delta: 25 }, mentalPressure: -2} },
      { text: '跟考察组说他能力不行', effects: {reputation: -2, risk: 2, contactRelation: { id: 'enemy_167', delta: -20 } } },
    ]},
    { id: 'ent286', stage: 'work', eventType: 'auto', weight: 5, requireContact: 'enemy_168b', requireContactMin: -30, title: '暗处的眼睛', text: '张处长的心腹似乎盯上了你——你的工作汇报总被提前"解读"，档案室还出现了不该有的借阅记录。你隐隐觉得有人在收集什么。', effects: { mentalPressure: 4, risk: 2, reputation: -1 } },

    // ================= v2.1.8 时代专属事件再扩充（reform/stable/rectify 各 +2 → 17） =================
    // ---- 改革年代 reform +2 ----
    { id: 'ent287', era: ['reform'], stage: 'work', eventType: 'choice', weight: 5, title: '改革先锋表彰会', text: '省里召开改革攻坚表彰大会，你所在的单位有一席之地。名单上有你牵头的那项试点——领导让你准备十分钟发言。台下坐着省委书记，前排还有媒体镜头。', choices: [
      { text: '讲干货，讲试点落地中的真实取舍', effects: {reputation: 3, positionWeight: 2, mentalPressure: 2, workAbility: 1} },
      { text: '讲成绩，突出单位集体功劳', effects: {background: 2, reputation: 1, positionWeight: 1, integrity: -1} },
      { text: '借机反映基层改革遇到的梗阻', effects: {integrity: 3, risk: 2, reputation: 1} },
      { text: '推让给更资深的同事发言', effects: {positionWeight: -1, eq: 1, mentalPressure: -2} },
    ]},
    { id: 'ent288', era: ['reform'], stage: 'life', eventType: 'choice', weight: 4, title: '下海同学聚会', text: '同学聚会，当年一起备考的哥们儿大多下海了，如今有人身家千万，有人负债累累。他们举杯感叹："还是你们铁饭碗稳。"你端起酒杯，一时不知道该怎么接。', choices: [
      { text: '坦然一笑，说自己也有压力', effects: {eq: 1, integrity: 1, mentalPressure: 1} },
      { text: '讲改革机遇，劝他们也回来', effects: {reputation: 1, eq: 1, desire: -1} },
      { text: '心里不是滋味，回家闷头加班', effects: {desire: 2, mentalPressure: 3, workAbility: 1} },
      { text: '认真打听他们行业的机会', effects: {desire: 3, iq: 1, risk: 1} },
    ]},
    // ---- 平稳年代 stable +2 ----
    { id: 'ent289', era: ['stable'], stage: 'work', eventType: 'choice', weight: 5, title: '届中考核谈话', text: '届中考核，组织部门找你谈话。谈话提纲里有一项："对班子的整体评价，有什么意见建议请畅所欲言。"会议室安静得能听见笔尖的沙沙声。', choices: [
      { text: '客观评价班子，指出不足也肯定成绩', effects: {integrity: 2, background: 1, mentalPressure: 1} },
      { text: '多说优点，少提问题', effects: {background: 1, risk: 1, integrity: -1} },
      { text: '借机反映长期想说的真问题', effects: {integrity: 3, risk: 2, reputation: 1} },
      { text: '谨慎措辞，多谈自己工作', effects: {workAbility: 1, mentalPressure: 2, risk: -1} },
    ]},
    { id: 'ent290', era: ['stable'], stage: 'life', eventType: 'auto', weight: 3, title: '工会疗养', text: '工龄满十年的干部可以参加工会组织的疗养。名单公布，你赫然在列。同事说这是"论资排辈排到的福气"，你在日历上圈了日期——终于可以歇几天了。', effects: {body: 2, mentalPressure: -3, workAbility: 1} },
    // ---- 整顿年代 rectify +2 ----
    { id: 'ent291', era: ['rectify'], stage: 'work', eventType: 'choice', weight: 5, title: '廉政谈话提醒', text: '驻组纪检组长找你谈话："组织上收到过一些反映，虽然查无实据，但你要引起重视。"他语气平静，你心里却翻江倒海——这些年，真的干净吗？', choices: [
      { text: '如实说明，感谢组织提醒', effects: {integrity: 2, risk: -2, mentalPressure: 3} },
      { text: '态度诚恳，但只谈工作不谈其他', effects: {eq: 1, mentalPressure: 2, risk: 1} },
      { text: '紧张辩解，反复表忠心', effects: {risk: 2, mentalPressure: 4, integrity: -1} },
      { text: '连夜回忆并处置遗留问题', effects: {risk: -5, heat: -3, mentalPressure: 4, integrity: 1} },
    ]},
    { id: 'ent292', era: ['rectify'], stage: 'life', eventType: 'auto', weight: 4, title: '警示教育片', text: '单位组织观看警示教育片。屏幕上的人你认识——上个月还在一起开过会。片子里他的忏悔清晰又陌生。散场时没人说话，你在门口停了一下，深吸了一口气。', effects: {heat: -3, integrity: 1, mentalPressure: 3, desire: -2} },
];
