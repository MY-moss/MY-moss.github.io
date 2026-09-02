// ==================== v2.1.66 事件缺口补充包：赡养链/理财暴雷链/借调链 + 散事件 ====================
// 数据驱动缺口（v2.1.66 审计）：赡养全库仅 1 条且 life 50+ 最薄、暴雷仅 1 条且 life 意外/消费最小、
// 借调 11 条散件无引擎链、sudden 仅 4 条正面。本包补 3 条刚性链（ent293-301）+ 9 个散事件。
// 链模式沿用健康链（ent244-247）：入口概率注入设 flag → RIGID_CHAINS 按延迟注入 next → requireFlag 双保险。
const gd_events_new_v2166 = [
  // ---------- A. 赡养链（life，48-70 岁，补 50+ 薄档） ----------
  { id: 'ent293', stage: 'life', eventType: 'choice', weight: 5, year: [48, 70], title: '父母体检亮起红灯', text: '社区组织的老人免费体检，父母的报告单上同时出现了需要复查的箭头。母亲摆摆手说老毛病，父亲却把单子折了又折塞进口袋。', choices: [
    { text: '放下手头的事，陪他们去大医院复查', effects: { flag: 'parentIllness', eq: 2, familyPressure: 2, mentalPressure: 2 }, result: '复查结果不容乐观，照护成了绕不开的课题' },
    { text: '先挂专家号问清楚，再决定怎么办', effects: { flag: 'parentIllness', iq: 1, familyPressure: 1, mentalPressure: 1 }, result: '诊断下来了，需要长期照护' },
    { text: '把报告拍照发给熟人医生参谋', effects: { flag: 'parentIllness', background: 1, eq: 1 }, result: '熟人给出了中肯的方案，但照护仍需人手' }
  ] },
  { id: 'ent294', stage: 'life', eventType: 'choice', weight: 5, year: [48, 70], requireFlag: 'parentIllness', title: '照护抉择', text: '医生说需要人长期照看。你腾不出整块时间，兄弟姐妹各有各的难处，护工的价钱又年年涨。这张排班表，谁来填？', choices: [
    { text: '自己扛下主要照护，工作往边上排', effects: { flag: 'parentCaring', familyPressure: 3, mentalPressure: 3, positionWeight: -2, body: -2 }, result: '你成了父母的准时闹钟，工作节奏慢了下来' },
    { text: '请专业护工，自己每周探望', effects: { flag: 'parentCaring', wealth: -25, familyPressure: 1, eq: 1 }, result: '护工分担了体力活，账单分担了心理负担' },
    { text: '和兄弟姐妹轮班，签好照护协议', effects: { deleteFlag: 'parentIllness', flag: 'parentShared', eq: 2, familyPressure: -1 }, result: '排班表贴在冰箱上，责任分摊心不散' }
  ] },
  { id: 'ent295', stage: 'life', eventType: 'choice', weight: 5, year: [50, 72], requireFlag: 'parentCaring', title: '漫长照护之后', text: '两年过去了，父母的身体在照护下稳中有降——降压药从三种减到两种。你也在这套节奏里学会了喘息。', choices: [
    { text: '体检指标好转，逐步恢复自己的生活', effects: { flag: 'parentRecovered', mentalPressure: -5, familyPressure: -4, eq: 2 }, result: '雨过天晴，一家人的日子重新向前' },
    { text: '接受长期照护是常态，重新安排人生', effects: { flag: 'parentLongTerm', familyPressure: -2, mentalPressure: -2, eq: 3, body: 1 }, result: '照护成了生活的一部分，你也长出了耐心' }
  ] },

  // ---------- B. 理财暴雷链（life，28-58 岁） ----------
  { id: 'ent296', stage: 'life', eventType: 'choice', weight: 4, year: [28, 58], title: '加杠杆理财的诱惑', text: '老同学拉你进了一个"稳赚"群，年化宣称十八个点，还能加杠杆。他晒出的收益截图红得晃眼。', choices: [
    { text: '小仓位试水，加一点杠杆', effects: { flag: 'leveragedInvest', wealth: -10, desire: 2, luck: 1 }, result: '头两个月确实赚了，你开始心动加仓' },
    { text: 'all in 杠杆，搏一把大的', effects: { flag: 'leveragedInvest', wealth: -20, desire: 3, familyPressure: 2 }, result: '重仓杀入，账户曲线成了心里的大石' },
    { text: '只买底仓不动杠杆', effects: { wealth: -5, iq: 1 }, result: '稳字当头，睡得着觉' },
    { text: '拉黑群聊，当没看见', effects: { mentalPressure: -1, integrity: 1 }, result: '富贵险中求，你选择不求' }
  ] },
  { id: 'ent297', stage: 'life', eventType: 'choice', weight: 5, year: [28, 58], requireFlag: 'leveragedInvest', title: '行情反转', text: '平台公告：标的延期兑付。群里从晒收益变成了维权接龙，你账户里的数字一夜之间缩了大半。', choices: [
    { text: '果断止损，能收回多少是多少', effects: { deleteFlag: 'leveragedInvest', wealth: -30, mentalPressure: -3, iq: 1 }, result: '割肉离场，学费交得肉疼但睡了个好觉' },
    { text: '补仓摊薄成本，等它起死回生', effects: { flag: 'investCrash', wealth: -15, desire: 1, mentalPressure: 3 }, result: '越陷越深，窟窿肉眼可见地扩大' },
    { text: '装死不动，假装没这回事', effects: { flag: 'investCrash', mentalPressure: 2, familyPressure: 2 }, result: '眼不见心不烦，账不会自己消失' }
  ] },
  { id: 'ent298', stage: 'life', eventType: 'choice', weight: 5, year: [28, 60], requireFlag: 'investCrash', title: '暴雷处置', text: '平台正式暴雷，经侦介入登记。群里流传着各种回款比例的小道消息，家庭开支也开始受影响。', choices: [
    { text: '认赔离场，从此只碰存款和国债', effects: { flag: 'investLesson', wealth: -35, mentalPressure: -4, integrity: 1 }, result: '血泪一课：年化超过六的都要打问号' },
    { text: '借钱补窟窿，先把家里稳住', effects: { flag: 'investLesson', wealth: -10, risk: 3, familyPressure: 3 }, result: '拆东墙补西墙，压力后移并未消失' },
    { text: '走法律程序慢慢等清退', effects: { flag: 'investLesson', wealth: -20, mentalPressure: 2, iq: 1 }, result: '维权路漫长，你学会了和不确定性共处' }
  ] },

  // ---------- C. 借调上行链（work，26-45 岁） ----------
  { id: 'ent299', stage: 'work', eventType: 'choice', weight: 4, year: [26, 45], title: '一纸借调函', text: '上级机关点名借调你去帮忙半年，原单位领导嘴上说支持，眼神里却写着"人手本来就紧"。', choices: [
    { text: '接下借调，把机会握在手里', effects: { flag: 'seconded', workAbility: 1, background: 1, mentalPressure: 2 }, result: '收拾工位那天，两种目光都落在你背上' },
    { text: '和领导交底后接下，留好退路', effects: { flag: 'seconded', eq: 2, background: 2, mentalPressure: 1 }, result: '谈开了再走，两边都念你的好' },
    { text: '婉拒借调，守好现有一亩三分地', effects: { peopleReputation: 1, positionWeight: 1, background: -1 }, result: '留下有留下的稳当' }
  ] },
  { id: 'ent300', stage: 'work', eventType: 'choice', weight: 5, year: [26, 46], requireFlag: 'seconded', title: '借调考核期', text: '借调半年期满在即，带你的处长话里有话："小伙子踏实，就是不知道原单位放不放。"考核表就在他抽屉里。', choices: [
    { text: '埋头把收尾材料做成样板', effects: { flag: 'secondReview', workAbility: 3, reputation: 1, mentalPressure: 2 }, result: '材料成了处里的模板，考核表写得满满当当' },
    { text: '工作之余把处里上下关系理顺', effects: { flag: 'secondReview', eq: 3, background: 1 }, result: '人熟了，话就好说了' },
    { text: '一边干一边悄悄打听遴选消息', effects: { flag: 'secondReview', iq: 1, background: 1, mentalPressure: 2 }, result: '退路和出路都摸清了' }
  ] },
  { id: 'ent301', stage: 'work', eventType: 'choice', weight: 5, year: [26, 48], requireFlag: 'secondReview', title: '去留抉择', text: '上级机关想留你，原单位催你回去主持科室工作。一边是更大的平台，一边是更近的家。', choices: [
    { text: '争取留任，平台就是加速度', effects: { flag: 'secondDone', background: 3, positionWeight: 2, mentalPressure: 3, familyPressure: 2 }, result: '留任手续批了下来，人生换了个赛道' },
    { text: '回原单位，把借调经历变现', effects: { flag: 'secondDone', reputation: 2, peopleReputation: 1, familyPressure: -2, workAbility: 1 }, result: '衣锦还乡式的回归，科室等你掌舵' }
  ] },

  // ---------- D. 散事件（life 养老/意外/消费 + work 职称/遴选） ----------
  { id: 'enl169', stage: 'life', eventType: 'choice', weight: 5, year: [40, 70], title: '父母金婚宴', text: '父母结婚五十年，亲戚张罗着办一场金婚宴。老人嘴上说不折腾，却提前一周把那件的确良衬衫熨了三遍。', choices: [
    { text: '包下饭店隆重操办，请齐亲朋', effects: { wealth: -15, peopleReputation: 2, eq: 2 }, result: '金婚宴上父亲致辞哽咽，全村都记着这份体面' },
    { text: '家里摆三桌，只请至亲', effects: { wealth: -5, familyPressure: -3, eq: 1 }, result: '家宴温情，父母念着省钱又暖心' },
    { text: '操办从简，带二老补拍婚纱照', effects: { wealth: -8, eq: 3 }, result: '照片裱在堂屋，母亲逢人就讲' },
    { text: '工作太忙，红包表示', effects: { wealth: -10, familyPressure: 3, peopleReputation: -1 }, result: '红包厚，遗憾也厚' }
  ] },
  { id: 'enl170', stage: 'life', eventType: 'choice', weight: 5, year: [35, 70], title: '陪父母体检', text: '单位发的家属体检卡快到期了，母亲嫌浪费钱不肯去，父亲的腰椎已经疼了半年。', choices: [
    { text: '请半天假硬陪着去', effects: { eq: 2, familyPressure: -2, body: -1 }, result: '查出早期问题及时干预，值了' },
    { text: '把体检项目讲清楚再哄', effects: { iq: 1, eq: 1, familyPressure: -1 }, result: '母亲被你说动，还带动老邻居一起体检' },
    { text: '委托表妹陪去，你报销费用', effects: { wealth: -5, familyPressure: 1 }, result: '体检做了，老人念叨你没露面' },
    { text: '过期就过期吧，太忙了', effects: { familyPressure: 3, mentalPressure: 1 }, result: '卡过期那天，母亲说"不查更好"' }
  ] },
  { id: 'enl171', stage: 'life', eventType: 'choice', weight: 5, year: [30, 65], title: '老宅漏水风波', text: '老家来电话：连日暴雨，老屋房顶漏了，父母的卧室摆满了接水的脸盆。', choices: [
    { text: '出钱请人全面翻修', effects: { wealth: -20, familyPressure: -3, eq: 2 }, result: '翻新后的老屋，父母睡了个踏实觉' },
    { text: '先应急补漏，缓一缓再大修', effects: { wealth: -6, familyPressure: 1 }, result: '补漏管了一时，心里记着这笔账' },
    { text: '接父母进城同住', effects: { familyPressure: 2, eq: 2, mentalPressure: 2 }, result: '一家三代挤但热乎，老屋先空着' },
    { text: '托村里亲戚帮忙照看', effects: { wealth: -3, peopleReputation: 1, familyPressure: 2 }, result: '人情欠下，屋还漏着' }
  ] },
  { id: 'enl172', stage: 'life', eventType: 'choice', weight: 5, year: [26, 60], title: '邻里噪音纠纷', text: '楼上新搬来的住户每晚十点后还在拖椅子、跳绳，交涉三次无果，你第二天还要开大会。', choices: [
    { text: '找社区调解，走正规渠道', effects: { eq: 1, mentalPressure: -2, peopleReputation: 1 }, result: '社区出面约定静音时段，清净了' },
    { text: '上门硬刚，当面锣对面鼓', effects: { eq: -1, mentalPressure: 2, luck: -1 }, result: '吵赢了道理，结下了梁子' },
    { text: '买耳塞和白噪音机自救', effects: { wealth: -2, mentalPressure: -1 }, result: '物理隔音，相安无事' },
    { text: '以牙还牙，早上六点放广场舞神曲', effects: { mentalPressure: 2, peopleReputation: -2, risk: 1 }, result: '战争升级，两败俱伤' }
  ] },
  { id: 'enl173', stage: 'life', eventType: 'choice', weight: 5, year: [26, 62], title: '大件家电以旧换新', text: '用了八年的冰箱开始半夜嗡嗡作响，正赶上政府以旧换新补贴百分之二十。', choices: [
    { text: '趁补贴换新的，一步到位', effects: { wealth: -12, familyPressure: -2, eq: 1 }, result: '新冰箱安静省电，补贴到账真香' },
    { text: '修一修再战三年', effects: { wealth: -3, luck: -1 }, result: '修完安静了两个月，又响了' },
    { text: '全家开会表决买什么牌子', effects: { eq: 2, familyPressure: -1 }, result: '民主决策，孩子投的牌子意外好用' },
    { text: '等等看，说不定补贴延续', effects: { luck: 1, familyPressure: 1 }, result: '冰箱又撑了一季，补贴没等到' }
  ] },
  { id: 'enl174', stage: 'life', eventType: 'choice', weight: 5, year: [24, 55], title: '直播间冲动下单', text: '深夜刷手机，主播一句"最后三单"让你差点付掉半个月工资——购物车里躺着一台按摩椅。', choices: [
    { text: '冷静退出，把APP卸了', effects: { mentalPressure: -1, integrity: 1 }, result: '第二天醒来，庆幸自己守住了钱包' },
    { text: '买！生活需要奖励自己', effects: { wealth: -15, familyPressure: 2, luck: 1 }, result: '按摩椅成了全家的最爱，钱包在哭' },
    { text: '先加购物车，观察七天再说', effects: { iq: 1, eq: 1 }, result: '七天后热情消退，钱保住了' },
    { text: '和爱人商量着来', effects: { eq: 2, familyPressure: 1 }, result: '爱人拍板买了小巧款，全家满意' }
  ] },
  { id: 'enw245', stage: 'work', eventType: 'choice', weight: 5, pools: ['public'], title: '职称评审材料', text: '职称评审窗口下周截止，业绩材料还差近三年的成果证明——而你的获奖证书压在搬家纸箱的最底层。', choices: [
    { text: '连夜翻箱倒柜整理材料', effects: { workAbility: 2, mentalPressure: 2, body: -1 }, result: '材料齐了，盖章跑到腿软' },
    { text: '请同事帮忙补齐佐证', effects: { eq: 2, peopleReputation: 1 }, result: '同事仗义，材料一次过审' },
    { text: '突出重点重新撰写业务总结', effects: { iq: 1, workAbility: 1 }, result: '总结写得漂亮，评审组印象深刻' },
    { text: '今年赶不上就明年再来', effects: { mentalPressure: -1, positionWeight: -1 }, result: '明年政策可能就变了' }
  ] },
  { id: 'enw246', stage: 'work', eventType: 'auto', weight: 5, pools: ['public'], title: '职称兑现', effects: { workAbility: 2, positionWeight: 2, wealth: 3, reputation: 1 }, text: '职称批文下来了，工资条上多了一栏"专业技术职务津贴"。办公室同事轮着道贺，你把批文复印了一份寄回家。' },
  { id: 'enw247', stage: 'work', eventType: 'choice', weight: 4, pools: ['public'], year: [26, 40], title: '遴选笔试通知', text: '公告栏贴出上级机关公开遴选公告：笔试时间就在两周后，不限报名人数。办公室瞬间安静了几秒。', choices: [
    { text: '立即报名，工作之余闭关刷题', effects: { iq: 1, workAbility: 1, mentalPressure: 3, luck: 1 }, result: '两周魔鬼刷题，考场上手心里全是字' },
    { text: '和领导通气后低调备考', effects: { background: 1, iq: 1, mentalPressure: 1 }, result: '领导点头放行，备考少了后顾之忧' },
    { text: '纠结名单公示的目光，放弃报名', effects: { mentalPressure: 1, background: -1 }, result: '机会年年有，心气却难再来' }
  ] },
  { id: 'enl175', stage: 'life', eventType: 'choice', weight: 5, year: [24, 65], title: '街头表彰', text: '你在路口扶起摔倒的老人并送到医院，家属寻到单位送来锦旗——市文明办要在街头开展现场表彰。', choices: [
    { text: '大方接受表彰，讲讲当时想法', effects: { peopleReputation: 3, reputation: 1, eq: 1 }, result: '本地媒体进行了报道，母亲把报纸存进了相册' },
    { text: '低调谢绝，举手之劳而已', effects: { integrity: 2, peopleReputation: 1 }, result: '谢绝了镜头，锦旗还是寄到了单位' },
    { text: '借势倡导互助风气的倡议', effects: { eq: 2, peopleReputation: 2, mentalPressure: 1 }, result: '倡议书贴满了社区宣传栏' }
  ] }
];