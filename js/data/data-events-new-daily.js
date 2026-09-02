// ===== 日常质感小事件 =====
// id 范围：edl001~edl012（12条） | 装配：js/data/data.js → GameData.events | v2.1.66 头注释标准化（分类学见 docs/architecture/EVENT-SYSTEM-ARCHITECTURE.md）
// 定位：办公室/通勤/账单等细碎日常，contentTier=everyday 加权露出
// v2.1.37 日常质感补充包：填充工作与生活中的细碎日常，让年份之间的颗粒感更真实。
// 约定：contentTier: 'everyday' 仅用于 life 阶段（校验器约定），由引擎统一 ×6 权重补偿露出
// （v2.1.34 起），不再叠加事件 ID 特判；标题避开 TITLE_GATE_LIST 旧标题，门槛一律走结构化字段。
const gd_events_new_daily = [
  // ====== 工作日常（5个） ======
  { id: 'edl001', stage: 'work', eventType: 'choice', weight: 6, year: [1, 40], title: '卡纸的打印机', text: '下午要交材料，办公室那台老打印机偏偏卡了纸。前盖打开后齿轮卡死，拽也拽不出来，同事们围在旁边出主意。', choices: [
    { text: '上网查教程自己拆修', effects: {iq: 2, workAbility: 1, mentalPressure: 1} },
    { text: '打电话叫维修师傅', effects: {wealth: -5, mentalPressure: -1} },
    { text: '去隔壁科室借打印机', effects: {eq: 2, background: 1} },
    { text: '手动重抄一份应急', effects: {workAbility: 1, body: -1, mentalPressure: 2} }
  ]},
  { id: 'edl002', stage: 'work', eventType: 'choice', weight: 6, year: [1, 38], title: '电梯里的三十秒', text: '早高峰电梯门快关上时，处长侧身挤了进来，就站在你旁边。三十秒的上升时间里，楼层数字一格一格地跳，谁都没说话。', choices: [
    { text: '点头问好聊句天气', effects: {eq: 2, positionWeight: 1} },
    { text: '顺便汇报昨天的工作进展', effects: {workAbility: 2, positionWeight: 2, mentalPressure: 1} },
    { text: '安静站着目视前方', effects: {mentalPressure: 0, eq: 0, integrity: 1} },
    { text: '帮处长按住开门键送出门', effects: {eq: 1, positionWeight: 1} }
  ]},
  { id: 'edl003', stage: 'work', eventType: 'choice', weight: 6, year: [1, 40], title: '食堂阿姨的手', text: '食堂打菜窗口前，阿姨的手勺悬在半空看了你一眼。同样的菜，隔壁同事碗里明显多了两块排骨——他昨天刚给阿姨带了老家的特产。', choices: [
    { text: '笑着说“阿姨手别抖”', effects: {eq: 2, mentalPressure: -1} },
    { text: '下次也带点老家特产', effects: {eq: 1, wealth: -10, positionWeight: 1} },
    { text: '吃多少打多少不比较', effects: {integrity: 1, mentalPressure: -1} },
    { text: '干脆去外面吃换口味', effects: {wealth: -20, mentalPressure: -2} }
  ]},
  { id: 'edl004', stage: 'work', eventType: 'choice', weight: 5, year: [2, 40], title: '柜子深处的旧卷宗', text: '整理档案柜时在最底层翻出一盒落灰的旧卷宗，标签是十年前一场专项整治的材料。带你的老科长路过瞥了一眼：“别乱动，那是历史遗留问题。”', choices: [
    { text: '原样放回不去碰', effects: {integrity: 1, workAbility: 1} },
    { text: '按流程登记归档', effects: {workAbility: 2, integrity: 2, mentalPressure: 1} },
    { text: '好奇翻两页再放回去', effects: {iq: 1, risk: 1} },
    { text: '问问老科长当年的故事', effects: {iq: 2, eq: 1, background: 1} }
  ]},
  { id: 'edl005', stage: 'work', eventType: 'choice', weight: 6, year: [1, 40], title: '深夜工作群', text: '晚上十点，工作群里处长发了条长消息布置任务，末尾没有句号。群里安静了三分钟，有人开始排队回复“收到”。', choices: [
    { text: '第一个回复收到', effects: {positionWeight: 2, eq: -1, mentalPressure: 1} },
    { text: '认真回一段执行思路', effects: {workAbility: 2, positionWeight: 1, mentalPressure: 2} },
    { text: '等到明天上班再回复', effects: {mentalPressure: -2, positionWeight: -1, integrity: 1} },
    { text: '只回一个“收到”不多说', effects: {mentalPressure: 0, eq: 1} }
  ]},
  // ====== 生活日常（7个） ======
  { id: 'edl006', stage: 'life', eventType: 'choice', weight: 6, contentTier: 'everyday', year: [1, 40], title: '早高峰的地铁', text: '早高峰的地铁挤得像沙丁鱼罐头，你面前坐着的年轻人低头刷着手机打瞌睡。到站前他突然抬头看了你一眼，又把头低了下去。', choices: [
    { text: '侧过身给下车的人让路', effects: {eq: 1, mentalPressure: -1} },
    { text: '闭目养神背今天议程', effects: {workAbility: 1, mentalPressure: 1} },
    { text: '戴上耳机听新闻联播', effects: {iq: 1, mentalPressure: -1} },
    { text: '改骑共享单车通勤锻炼', effects: {body: 2, wealth: -5, mentalPressure: -2} }
  ]},
  { id: 'edl007', stage: 'life', eventType: 'choice', weight: 6, contentTier: 'everyday', year: [1, 40], title: '楼下的早餐摊', text: '楼下摆了八年的早餐摊突然贴出告示：城管划定新经营区，下周就要搬走。摊主老陈一边煎饼一边叹气，说新位置偏了一公里。', choices: [
    { text: '多买几根油条支持老陈', effects: {wealth: -5, peopleReputation: 2, mentalPressure: -1} },
    { text: '帮他在业主群里发新地址', effects: {eq: 2, peopleReputation: 3} },
    { text: '惋惜两天后换别家吃', effects: {mentalPressure: 1} },
    { text: '向社区建议设便民早餐点', effects: {eq: 1, peopleReputation: 4, workAbility: 1} }
  ]},
  { id: 'edl008', stage: 'life', eventType: 'choice', weight: 5, contentTier: 'everyday', year: [2, 35], title: '加班后的末班车', text: '加班到十点半，冲出办公楼时末班车还有三分钟进站。站台上零星几个同样神色疲惫的人，车门打开时暖黄的灯光洒了出来。', choices: [
    { text: '买份关东煮慢慢吃完', effects: {mentalPressure: -3, wealth: -8, body: 1} },
    { text: '只买瓶水赶紧回家睡', effects: {body: 1, mentalPressure: -1} },
    { text: '给家里带一份热食', effects: {wealth: -12, familyPressure: -2, eq: 1} },
    { text: '站在门口抽支烟再上楼', effects: {mentalPressure: -2, body: -1} }
  ]},
  { id: 'edl009', stage: 'life', eventType: 'choice', weight: 5, contentTier: 'everyday', year: [3, 35], title: '老同学的红色炸弹', text: '十年没联系的老同学突然发来婚礼请帖，地点在五星级酒店。你俩当年关系一般，毕业后连面都没见过，但请帖末尾写着“一定要来啊”。', choices: [
    { text: '包个厚红包准时赴宴', effects: {wealth: -60, eq: 2, background: 2} },
    { text: '随大众份子人不到场', effects: {wealth: -30, mentalPressure: -1} },
    { text: '找借口婉拒不参加', effects: {wealth: 0, eq: -1, mentalPressure: 1} },
    { text: '借机约老同学叙旧', effects: {eq: 3, mentalPressure: -2, background: 1} }
  ]},
  { id: 'edl010', stage: 'life', eventType: 'choice', weight: 6, contentTier: 'everyday', year: [5, 40], title: '体检报告上的箭头', text: '单位组织年度体检，报告发下来，几项指标后面跟着向上的小箭头。医生在总结栏写道：轻度脂肪肝，建议规律作息、控制饮食、加强锻炼。', choices: [
    { text: '办健身卡每周去三次', effects: {wealth: -40, body: 3, mentalPressure: -2} },
    { text: '戒掉宵夜每天走一万步', effects: {body: 2, mentalPressure: -1, workAbility: 1} },
    { text: '报告塞抽屉该干嘛干嘛', effects: {body: -2, mentalPressure: -1} },
    { text: '买一堆保健品图心安', effects: {wealth: -60, body: 1, eq: -1} }
  ]},
  { id: 'edl011', stage: 'life', eventType: 'choice', weight: 5, contentTier: 'everyday', requireMarried: true, year: [2, 40], title: '账单日', text: '月底对账，房贷、水电、物业、孩子的补习费摊了一桌子。爱人按着计算器算了三遍，抬头问：“这个月怎么又超了？”', choices: [
    { text: '一起重新做预算表', effects: {iq: 2, familyPressure: -2, wealth: 10} },
    { text: '主动削减自己的开销', effects: {familyPressure: -3, mentalPressure: 2, integrity: 1} },
    { text: '“下个月一定改”先认错', effects: {familyPressure: 1, eq: 1, mentalPressure: 1} },
    { text: '接点私活补贴家用', effects: {wealth: 30, body: -1, mentalPressure: 3, risk: 2} }
  ]},
  { id: 'edl012', stage: 'life', eventType: 'choice', weight: 6, contentTier: 'everyday', year: [1, 40], title: '小区里的流浪猫', text: '小区里有只三花流浪猫，见谁都躲，唯独会在你下班路过时从车底探出头。物业在群里发通知：近期将集中清理流浪动物。', choices: [
    { text: '在业主群提议科学救助', effects: {eq: 2, peopleReputation: 3, mentalPressure: 1} },
    { text: '悄悄喂到清理那天', effects: {mentalPressure: -2, peopleReputation: 1} },
    { text: '带回家收养登记', effects: {wealth: -30, mentalPressure: -3, familyPressure: 1, body: 1} },
    { text: '帮它找领养发朋友圈', effects: {eq: 3, peopleReputation: 2, mentalPressure: -1} }
  ]}
];
