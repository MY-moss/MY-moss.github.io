// 财务选择不是一个孤立的收益骰子：投资收益与公职履历在多年后交汇。
const gd_events_arc_venture = [
  {
    id:'arc_venture_disclosure_1', stage:'career', eventType:'choice', title:'账本里没写的那一栏',
    text:'两年前，你以为朋友介绍的投资项目只是账本上的一次浮动。今天，单位组织填报个人事项，材料清单里多了一栏对外投资和关联关系。会计把表推过来，指尖停在签名处：“收益多少是一回事，怎么说清楚又是另一回事。”你还记得当年汇款的具体日期。',
    choices:[
      {text:'如实申报资金来源和关系，接受必要的岗位回避', effects:{flag:'ventureDeclared', integrity:4,risk:-4,positionWeight:-3,mentalPressure:5,workAbility:1,careerLogNote:'主动申报此前的私人投资及关联关系，并接受回避审查。'},result:'整理银行流水花了整整一个周末。组织没有立刻给出结论，你却第一次把每笔钱的来处说清楚了。'},
      {text:'办理退出，向有关部门说明已终止的投资关系', effects:{flag:'ventureExited',integrity:3,risk:-2,positionWeight:-1,mentalPressure:3,familyPressure:2,careerLogNote:'退出有潜在利益冲突的投资，提交结算与退出记录。'},result:'退出手续比加入时复杂得多。朋友没有当场劝阻，只问你是否还愿意在下班后一起吃饭。'},
      {text:'只填写已实现收益，隐去与熟人之间的资金往来', effects:{flag:'ventureHidden',positionWeight:4,integrity:-5,risk:11,heat:3,mentalPressure:-2,careerLogNote:'对过往私人投资选择不完整申报，留下需要解释的材料缺口。'},result:'材料当天就递交了上去。你把存款凭证塞进抽屉深处，却没有因此忘掉它。'}
    ]
  },
  {
    id:'arc_venture_declared_2',stage:'career',eventType:'choice',title:'两年后，回避名单',
    text:'两年后的项目会审前，你被通知暂时不参加一家相关公司的评估。办公室里有人觉得这很可惜，也有人说你当初说明白了反而省下许多麻烦。新同事把回避名单递过来，询问是否需要代你说明此前整理的资料。',
    choices:[
      {text:'完整移交业务资料，让没有利益冲突的同事接手',effects:{flag:'ventureClosed',workAbility:2,integrity:2,peopleReputation:2,positionWeight:-2,careerLogNote:'两年后严格履行投资关系回避，并完成项目资料移交。'},result:'会审如期进行，会议纪要没有你的名字，资料却清楚地列着当年遗漏过的风险。'},
      {text:'只说明业务背景，避免继续介入具体评估事项',effects:{flag:'ventureClosed',integrity:1,mentalPressure:-3,positionWeight:1,careerLogNote:'投资关系申报后保持职业边界，仅提供一般业务背景。'},result:'你留下简要交接说明，转身去了另一场与这家公司无关的工作会议。'}
    ]
  },
  {
    id:'arc_venture_exited_2',stage:'career',eventType:'choice',title:'两年后，熟人的新名片',
    text:'两年后，曾经介绍投资的朋友换了家公司，再次给你递来名片。饭桌上他没提钱，倒先问起你的工作是否顺利。你想起退出时填过的几页表格，也知道所谓“朋友之间没关系”，并不总能替代明确的边界。',
    choices:[
      {text:'仍作为普通朋友来往，明确不讨论具体审批与投资',effects:{flag:'ventureClosed',integrity:2,mentalPressure:-2,peopleReputation:1,careerLogNote:'两年后与旧投资熟人保持私交，但明确避开业务和资金往来。'},result:'你们聊了孩子和近况。离席前，他把名片收了回去，说以后可以只约散步。'},
      {text:'保留名片但减少往来，把主要精力交还家庭和本职',effects:{flag:'ventureClosed',familyPressure:-4,mentalPressure:-3,positionWeight:-1,careerLogNote:'与旧投资人减少不必要往来，重新安排事业之外的生活。'},result:'这一年你少参加了几场饭局，周末反而变得不那么难安排。'}
    ]
  },
  {
    id:'arc_venture_hidden_2',stage:'career',eventType:'choice',title:'两年后，退回的说明表',
    text:'两年后，财务核对人员带来一份退回的说明表：两笔资金的时间与当年申报信息对不上。你认识的老同事没有多问，只把银行流水、原始申报表和签名栏放在你面前。“今天可以补材料，”他说，“但不能再当它不存在。”',
    choices:[
      {text:'补齐原始记录，主动承认之前的不完整申报',effects:{flag:'ventureClosed',integrity:4,risk:-3,reputation:-3,mentalPressure:7,careerLogNote:'面对旧投资材料核对，主动补正遗漏并接受组织处理。'},result:'谈话持续到下班以后。你没能免去所有后果，但至少让事实重新完整。'},
      {text:'沿用原来的解释，寄希望于核查不会继续深入',effects:{flag:'ventureClosed',integrity:-5,risk:12,heat:6,positionWeight:2,careerLogNote:'旧投资材料已出现缺口，仍拒绝完整补正，职业风险进一步增加。'},result:'表格又递交了一次。你离开办公室时，看见门口已经换上新的审查通知。'}
    ]
  }
];
