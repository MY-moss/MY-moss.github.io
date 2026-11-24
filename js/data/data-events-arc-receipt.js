// 首轮新增连续叙事：档案柜里的回执。选择决定 2 年后的工作困境、再 3 年后的余波。
// 与旧存档兼容：所有新增状态仅存 player.flags、contacts、careerLog。
const gd_events_arc_receipt = [
  {
    id: 'arc_receipt_1', stage: 'work', eventType: 'choice', weight: 10,
    minYear: 2, title: '档案柜里的回执',
    text: '窗口快下班时，周岚把一沓发黄的受理回执放在你桌上。三年前的安置申请，几户人家至今没有收到答复。她在街道干了八年，知道一旦翻出旧账，整个科室都得加班。她没有催你，只问：“这事，我们还查吗？”',
    choices: [
      { text: '和周岚逐户核对，公开办理进度；这段时间恐怕无法兼顾其他考核',
        effects: { flag: 'receiptOpen', workAbility: 2, peopleReputation: 3, mentalPressure: 7, positionWeight: -2,
          contact: { id: 'receipt_zhoulan', name: '周岚', relation: 24, trust: 35, archetype: 'peer', description: '负责群众事务的老同事，重视每一张回执' },
          careerLogNote: '与周岚一起重新核对积压的安置回执；放缓其他工作，把问题公开摆上桌面。' },
        result: '窗口外排着队；晚上九点，第一份补录表才签完。' },
      { text: '先做好内部说明，争取让各科室分批消化，不急于公示',
        effects: { flag: 'receiptQuiet', background: 3, reputation: 2, mentalPressure: -2, peopleReputation: -2,
          contact: { id: 'receipt_zhoulan', name: '周岚', relation: 4, trust: 15, archetype: 'peer', description: '负责群众事务的老同事，重视每一张回执' },
          careerLogNote: '决定内部处理积压回执，组织评价暂时稳定；周岚保留了自己的意见。' },
        result: '会议纪要很快写好了。周岚把文件夹锁进柜子，没有附和。' }
    ]
  },
  {
    id: 'arc_receipt_open_2', stage: 'work', eventType: 'choice', title: '两年后的复核',
    text: '你和周岚整理的台账被上级抽中复核。大部分申请有了结果，唯独老赵家的原始附件缺了一页。周岚把自己的复印件递给你，说这是当年加班时留下的。承认缺页，项目验收会推迟；不说，眼下就能过关。',
    choices: [
      { text: '如实补报缺页，请求延长验收期限', effects: { setFlags: ['receiptOpenReviewed','receiptProof'], integrity: 4, risk: -3, workAbility: 2, mentalPressure: 4, positionWeight: -2, contactDelta: { target: 'receipt_zhoulan', relation: 8, trust: 12 }, careerLogNote: '回执复核承认原始材料缺页；验收延期，周岚留下来一起补证。' } },
      { text: '先行结项，随后私下补齐材料', effects: { setFlags: ['receiptOpenReviewed','receiptPremature'], risk: 9, integrity: -5, reputation: 3, mentalPressure: -2, contactDelta: { target: 'receipt_zhoulan', relation: -12, trust: -18 }, careerLogNote: '回执项目先行结项后补材料；周岚没有在验收单上签字。' } }
    ]
  },
  {
    id: 'arc_receipt_quiet_2', stage: 'work', eventType: 'choice', title: '信封里的旧名单',
    text: '两年后，群众服务中心收到一封没有署名的信，附着那批安置申请的名单。周岚说，她一直担心内部协调会让几户人被忘掉。领导希望尽快平息议论，却不愿让项目重新开卷。你可以主持复查，也可以坚持既定口径。',
    choices: [
      { text: '把旧名单逐人核验，向当事人说明补救安排', effects: { setFlags: ['receiptQuietReviewed','receiptRepair'], peopleReputation: 5, workAbility: 2, mentalPressure: 7, reputation: -2, contactDelta: { target: 'receipt_zhoulan', relation: 10, trust: 10 }, careerLogNote: '旧名单曝光后主动启动复查；周岚重新参与协调，验收进度延后。' } },
      { text: '沿用原说明，让各科室继续内部处理', effects: { setFlags: ['receiptQuietReviewed','receiptContinued'], reputation: 3, background: 2, peopleReputation: -6, risk: 6, contactDelta: { target: 'receipt_zhoulan', relation: -15, trust: -20 }, careerLogNote: '旧名单被继续列入内部处理；周岚申请调离窗口，未再参与后续复核。' } }
    ]
  },
  {
    id: 'arc_receipt_open_3', stage: 'life', eventType: 'choice', title: '五年后的一张明信片',
    text: '老赵搬进新房后寄来一张明信片。信纸上只写了地址和一句“辛苦你们了”。周岚从另一个部门打来电话，问你是否愿意把当年的台账方法交给新来的同事。你又想起那几年迟到的晚饭。',
    choices: [
      { text: '请周岚回来讲一次案例，把做法留给后来的人', effects: { setFlags:['receiptThirdResolved','receiptTeaching'], peopleReputation: 4, workAbility: 2, familyPressure: 2, contactDelta: { target: 'receipt_zhoulan', relation: 7, trust: 8 }, careerLogNote: '五年后把回执台账变成培训案例，与周岚共同完成了交接。' } },
      { text: '把明信片收进抽屉，这个周末准时回家', effects: { setFlags:['receiptThirdResolved','receiptHome'], familyPressure: -8, mentalPressure: -5, peopleReputation: 1, careerLogNote: '收到旧案当事人的明信片；你决定不再为每件事缺席家人的周末。' } }
    ]
  },
  {
    id: 'arc_receipt_quiet_3', stage: 'life', eventType: 'choice', title: '五年后的楼道',
    text: '五年后，你在老旧小区的楼梯口遇到当年等待安置的老赵。他没认出你，扶着栏杆慢慢上楼。那批回执的问题早已从年度报表里消失，周岚也去了别的单位。你站在楼下，看着那扇迟迟没有关上的门。',
    choices: [
      { text: '联系周岚，重新核查遗漏的家庭，哪怕如今已不属于你分管', effects: { setFlags:['receiptThirdResolved','receiptReopened'], peopleReputation: 4, mentalPressure: 5, workAbility: 1, contactDelta: { target: 'receipt_zhoulan', relation: 6, trust: 8 }, careerLogNote: '五年后重访安置旧案，与周岚重新联系，尝试补齐当年的缺口。' } },
      { text: '记住这件事，在以后经手的项目里坚持给每户留回执', effects: { setFlags:['receiptThirdResolved','receiptFutureRule'], integrity: 3, mentalPressure: -2, peopleReputation: 1, careerLogNote: '楼道里与老赵擦肩而过后，你开始要求新项目必须逐户登记回执。' } }
    ]
  },
  {
    id:'arc_receipt_legacy_4',stage:'career',eventType:'choice',title:'旧址上的新窗口',
    text:'多年后，旧城服务中心迁到了新址。周岚正在整理迁移前的档案，发现一批旧回执只有处理意见，没有当事人确认的记录。她邀请你一起核对历史材料。新窗口的取号机还没有拆封，柜台上已经摆着一摞新表格。',
    choices:[
      {text:'区分已办结与未核实事项，将遗留清单交给现任负责人',effects:{setFlags:['receiptLegacyResolved','receiptLegacyVerified'],workAbility:2,integrity:2,mentalPressure:3,peopleReputation:2,contactDelta:{target:'receipt_zhoulan',trust:6,relation:3}},result:'新的负责人接过待核清单和证据目录，明确了后续责任。'},
      {text:'提供自己的历史记录，由现任工作人员独立复核',effects:{setFlags:['receiptLegacyResolved','receiptLegacyTransferred'],integrity:1,mentalPressure:-2,contactDelta:{target:'receipt_zhoulan',trust:3}},result:'周岚把你的说明放入档案袋，现任工作人员自行核对，而不是照搬旧结论。'},
      {text:'仅确认自己经手的部分，不替无法核实的材料作保证',effects:{setFlags:['receiptLegacyResolved','receiptLegacyLimited'],integrity:2,eq:1,positionWeight:-1},result:'你在签名旁注明证据范围，那些缺口被留在待查目录中。'}
    ]
  }
];
