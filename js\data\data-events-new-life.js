// ===== 新增生活社交类主题包 =====
// id 范围：enl001~enl168（168条） | 装配：js/data/data.js → GameData.events | v2.1.66 头注释标准化（分类学见 docs/architecture/EVENT-SYSTEM-ARCHITECTURE.md）
// 定位：家庭/社交/健康等生活类事件
const gd_events_new_life = [
  // ====== 家庭生活类（25个） ======
  { id: 'enl001', stage: 'life', eventType: 'choice', weight: 5, title: '催婚', text: '周末回家吃饭，老妈端上一锅汤后突然叹气："隔壁王阿姨家闺女都生二胎了，你啥时候带个对象回来？"老爸在旁边默默拨弄着遥控器，假装没听见。', choices: [
    { text: '笑着答应明天就去相亲', effects: {eq: 1, familyPressure: -2, mentalPressure: 1} },
    { text: '认真解释自己想先立业', effects: {iq: 1, familyPressure: 2, mentalPressure: 2} },
    { text: '岔开话题聊老爸的钓鱼', effects: {eq: 1, mentalPressure: -1, familyPressure: 1} },
    { text: '低头喝汤装作没听见', effects: {mentalPressure: -2, familyPressure: 2, eq: -1} }
  ]},
  { id: 'enl002', stage: 'life', eventType: 'choice', weight: 4, title: '催生', text: '结婚两年，婆婆突然寄来一箱婴儿用品，还附了张纸条："趁年轻身体好，赶紧要个孩子。"你看着那堆小衣服，表情复杂。', choices: [ // v2.67 人称修复（原'老婆看着'——男女性别通用视角矛盾）
    { text: '和老婆商量顺其自然', effects: {eq: 2, familyPressure: -1, mentalPressure: -1} },
    { text: '决定开始备孕计划', effects: {familyPressure: -3, mentalPressure: 2, wealth: -20, desire: 1} },
    { text: '委婉告诉婆婆还要再等等', effects: {familyPressure: 2, mentalPressure: 2, integrity: 1} },
    { text: '把婴儿用品先收进柜子', effects: {mentalPressure: 2, familyPressure: 1, eq: -1} }
  ]},
  { id: 'enl003', stage: 'life', eventType: 'choice', weight: 6, title: '加班抱怨', text: '连续加班一周，今晚回家发现老婆已经睡了，餐桌上留着一张便条："又加班？我和孩子都快忘了你长啥样了。"旁边是一盘凉透的菜。', choices: [
    { text: '热热菜默默吃完洗好碗', effects: {eq: 1, familyPressure: -2, mentalPressure: 1, integrity: 1} },
    { text: '第二天请假陪家人一天', effects: {eq: 2, familyPressure: -3, workAbility: -1, mentalPressure: -1} },
    { text: '写张回条道歉并承诺补偿', effects: {eq: 1, familyPressure: -1, mentalPressure: -1} },
    { text: '叹口气把便条收进抽屉', effects: {familyPressure: 3, mentalPressure: -1, eq: -2} }
  ]},
  { id: 'enl004', stage: 'life', eventType: 'choice', weight: 5, title: '择校焦虑', text: '孩子马上要上小学了，老婆研究了一圈学校排名，焦虑得睡不着觉："好学校要户籍、要社保、要积分，咱们一样都不占优势。"', choices: [
    { text: '找中介咨询择校方案', effects: {iq: 2, wealth: -30, mentalPressure: 2, familyPressure: -1} },
    { text: '就近入学不折腾孩子', effects: {familyPressure: -2, mentalPressure: -1, integrity: 1, eq: 1} },
    { text: '托朋友打听民办学校', effects: {background: 2, wealth: -50, familyPressure: -1, mentalPressure: 2} },
    { text: '自己研究政策尽力而为', effects: {iq: 2, workAbility: 1, mentalPressure: 3, familyPressure: 1} }
  ]},
  { id: 'enl005', stage: 'life', eventType: 'choice', weight: 4, title: '学区房急售', text: '中介打来电话，说有一套学区房急售，价格比市场低两成，但要求三天内全款。这套房子对应的是全市排名前三的小学。', choices: [
    { text: '东拼西凑也要拿下', effects: {wealth: -100, familyPressure: 3, mentalPressure: 3, desire: 2, eq: 1} },
    { text: '果断放弃超出能力范围', effects: {integrity: 2, mentalPressure: -1, familyPressure: 2, wealth: 0} },
    { text: '找人合伙投资这套房', effects: {background: 2, wealth: -100, risk: 3, mentalPressure: 2} },
    { text: '先付定金拖延时间凑钱', effects: {risk: 4, mentalPressure: -2, wealth: -10, familyPressure: 2} }
  ]},
  { id: 'enl006', stage: 'life', eventType: 'choice', weight: 3, title: '二胎之争', text: '老妈突然提出想让你再生一个，理由是"独生子女太孤单，将来养老压力也大"。老婆听完后默默把电视音量调大了一格。', choices: [
    { text: '认真和老婆讨论二胎利弊', effects: {eq: 2, iq: 2, familyPressure: 1, mentalPressure: 1} },
    { text: '婉拒老妈说经济不允许', effects: {familyPressure: 2, mentalPressure: 1, integrity: 1, wealth: 0} },
    { text: '敷衍说再考虑考虑', effects: {familyPressure: 1, mentalPressure: 0, eq: -1} },
    { text: '支持老妈的想法开始准备', effects: {familyPressure: -2, mentalPressure: 3, wealth: -30, desire: 1} }
  ]},
  { id: 'enl007', stage: 'life', eventType: 'choice', weight: 5, title: '父亲患病', text: '老爸最近总忘事，去医院检查发现是早期阿尔茨海默症前兆。医生建议有人长期陪护，但家里几兄妹都在外地工作。', choices: [
    { text: '把老爸接到自己家照顾', effects: {eq: 1, familyPressure: 3, mentalPressure: 3, integrity: 3, wealth: -30} },
    { text: '请专业护工上门服务', effects: {wealth: -50, mentalPressure: 1, familyPressure: 1, eq: 1} },
    { text: '几兄妹凑钱送养老院', effects: {familyPressure: 2, mentalPressure: 2, wealth: -20, integrity: -1} },
    { text: '轮流回家照顾老人', effects: {integrity: 2, workAbility: -2, mentalPressure: 3, eq: 1} }
  ]},
  { id: 'enl008', stage: 'life', eventType: 'choice', weight: 4, title: '岳父母来访', text: '岳父母说要来住半个月，老婆高兴地开始收拾客房。你想起上次他们来时，岳母对你做饭手艺的评价——"还不如食堂师傅"。', choices: [
    { text: '热情欢迎并提前学几道菜', effects: {eq: 2, mentalPressure: 2, familyPressure: -2, iq: 1} },
    { text: '订个好酒店让他们住得舒服', effects: {wealth: -30, eq: 1, familyPressure: -3, mentalPressure: -1} },
    { text: '主动申请出差避开锋芒', effects: {workAbility: 1, familyPressure: 2, eq: -2, mentalPressure: 1} },
    { text: '硬着头皮接待保持微笑', effects: {eq: 1, mentalPressure: 3, familyPressure: 1, integrity: 1} }
  ]},
  { id: 'enl009', stage: 'life', eventType: 'choice', weight: 4, title: '装修超预算', text: '装修队报价超预算五万，包工头拍着胸脯说"材料都升级了，保你用二十年"。老婆看着银行余额，眼神里写满了怀疑。', choices: [
    { text: '咬牙追加预算保证质量', effects: {wealth: -50, familyPressure: 2, mentalPressure: 2, desire: 1} },
    { text: '坚持按原预算砍掉部分项目', effects: {integrity: 2, wealth: -10, mentalPressure: 2, familyPressure: 1} },
    { text: '换一家装修公司比价', effects: {iq: 2, mentalPressure: 3, wealth: -20} },
    { text: '自己买材料只包清工', effects: {workAbility: 2, mentalPressure: 4, wealth: -15, eq: 1} }
  ]},
  { id: 'enl010', stage: 'life', eventType: 'choice', weight: 3, title: '搬家加价', text: '搬家那天，搬家公司临时加价，说"楼梯房要加楼层费"。你看着堆满走廊的纸箱和汗流浃背的工人，犹豫要不要理论。', choices: [
    { text: '按工人要求付钱息事宁人', effects: {wealth: -20, mentalPressure: 1, eq: 1, familyPressure: 1} },
    { text: '打电话投诉搬家公司', effects: {integrity: 2, mentalPressure: 3, risk: 1, eq: -1} },
    { text: '讨价还价各退一步', effects: {iq: 2, wealth: -10, mentalPressure: 2, eq: 1} },
    { text: '自己动手搬轻的东西', effects: {body: -1, wealth: -10, mentalPressure: 2, integrity: 1} }
  ]},
  { id: 'enl011', stage: 'life', eventType: 'choice', weight: 3, title: '空调维修', text: '家里空调突然罢工，维修师傅上门检查后说："主板烧了，换一个一千五，或者加钱换新机更划算。"', choices: [
    { text: '花一千五换主板继续用', effects: {wealth: -15, mentalPressure: 1, integrity: 1} },
    { text: '直接买新机享受保修', effects: {wealth: -40, desire: 1, mentalPressure: -1, eq: 1} },
    { text: '自己上网买配件动手修', effects: {iq: 2, workAbility: 1, wealth: -5, mentalPressure: 3, body: -1} },
    { text: '先凑合用电风扇顶一阵', effects: {wealth: 0, mentalPressure: 2, body: -1, familyPressure: 1} }
  ]},
  { id: 'enl012', stage: 'life', eventType: 'choice', weight: 4, title: '邻居投诉孩子', text: '楼下邻居投诉你家孩子晚上跑跳影响休息，态度强硬地说"再这样我就报警了"。孩子委屈地说自己只是在玩玩具。', choices: [
    { text: '上门道歉并买点水果表示歉意', effects: {eq: 2, wealth: -10, mentalPressure: -1, reputation: 1} },
    { text: '在家里铺上隔音地垫', effects: {wealth: -20, mentalPressure: 1, familyPressure: -1, eq: 1} },
    { text: '解释孩子小难免有动静', effects: {eq: -1, mentalPressure: 2, risk: 1} },
    { text: '严格限制孩子活动时间', effects: {familyPressure: 2, mentalPressure: 2, eq: 1, integrity: 1} }
  ]},
  { id: 'enl013', stage: 'life', eventType: 'choice', weight: 3, title: '物业费涨', text: '物业突然发通知要涨物业费，理由是"服务升级"。但小区电梯经常坏、绿化也无人打理，业主群里炸开了锅。', choices: [
    { text: '积极加入业主维权群', effects: {eq: 1, mentalPressure: 2, integrity: 2, risk: 1, background: 1} },
    { text: '按时交费避免麻烦', effects: {wealth: -10, mentalPressure: 1, familyPressure: 1, eq: -1} },
    { text: '在业主群里理性表达诉求', effects: {iq: 2, eq: 1, mentalPressure: 1, reputation: 1} },
    { text: '拒绝交费直至服务改善', effects: {risk: 2, mentalPressure: 2, integrity: 1, wealth: 5} }
  ]},
  { id: 'enl014', stage: 'life', eventType: 'choice', weight: 6, contentTier: 'everyday', title: '车位之争', text: '小区车位紧张，你每天下班都要绕几圈才能找到位置。今天发现有人长期占着访客车位不挪走。', choices: [
    { text: '找物业协调处理', effects: {mentalPressure: 1, eq: 1, integrity: 1} },
    { text: '留张纸条提醒对方', effects: {eq: 1, mentalPressure: 1, risk: 1} },
    { text: '租个固定车位一劳永逸', effects: {wealth: -30, mentalPressure: -2, familyPressure: -1, eq: 1} },
    { text: '换新能源车有专属车位', effects: {wealth: -100, desire: 1, mentalPressure: -1, reputation: 1} }
  ]},
  { id: 'enl015', stage: 'life', eventType: 'choice', weight: 3, title: '水管爆裂', text: '半夜被"哗哗"的水声吵醒，发现卫生间管道爆裂，水已经漫到客厅。楼下邻居敲门说他们家天花板在滴水。', choices: [
    { text: '立即联系物业紧急维修', effects: {mentalPressure: 3, wealth: -20, eq: 1, integrity: 1} },
    { text: '先自己关阀门处理再找工人', effects: {iq: 2, workAbility: 1, mentalPressure: 3, body: -1} },
    { text: '赔偿楼下邻居损失息事宁人', effects: {wealth: -40, eq: 1, reputation: 1, mentalPressure: 2} },
    { text: '报保险走家财险理赔', effects: {iq: 1, wealth: -5, mentalPressure: 2} }
  ]},
  { id: 'enl016', stage: 'life', eventType: 'choice', weight: 4, title: '收养流浪猫', text: '孩子放学带回一只流浪猫，眼巴巴地看着你："它好可怜，我们能收养它吗？"老婆在旁边使劲朝你使眼色。', choices: [
    { text: '同意收养并教会孩子负责', effects: {eq: 2, familyPressure: -1, mentalPressure: -1, wealth: -10, desire: 1} },
    { text: '送到动物收容所', effects: {integrity: 2, mentalPressure: 1, familyPressure: 1} },
    { text: '帮它找领养家庭', effects: {eq: 1, background: 1, mentalPressure: 1, integrity: 1} },
    { text: '坚决不同意送走', effects: {familyPressure: 2, mentalPressure: -1, eq: -2, integrity: -1} }
  ]},
  { id: 'enl017', stage: 'life', eventType: 'choice', weight: 4, title: '家庭旅行', text: '难得全家都有空，计划一次家庭旅行。孩子想去迪士尼，老婆想去三亚，你想回老家看父母。', choices: [
    { text: '尊重孩子意愿去迪士尼', effects: {wealth: -50, eq: 1, familyPressure: -2, mentalPressure: -1, desire: 1} },
    { text: '去三亚全家放松', effects: {wealth: -40, eq: 1, body: 1, mentalPressure: -2, familyPressure: -1} },
    { text: '回老家陪伴父母', effects: {eq: 1, familyPressure: -3, integrity: 2, mentalPressure: -1} },
    { text: '折中方案周边自驾游', effects: {wealth: -20, eq: 1, mentalPressure: -1, familyPressure: -1, iq: 1} }
  ]},
  { id: 'enl018', stage: 'life', eventType: 'choice', weight: 5, title: '过年回谁家', text: '过年回谁家又成了话题。老婆说去年去了你家，今年该去她家；老妈打电话说准备了你要吃的菜；丈母娘发来视频说外孙想姥姥了。', choices: [
    { text: '轮流制今年去老婆家', effects: {eq: 2, familyPressure: -2, mentalPressure: 1, integrity: 1} },
    { text: '两边都去赶场过年', effects: {mentalPressure: 4, body: -1, wealth: -20, eq: 1, familyPressure: -1} },
    { text: '接双方父母来自己家', effects: {wealth: -30, eq: 1, mentalPressure: 3, familyPressure: -2} },
    { text: '各回各家各找各妈', effects: {eq: -1, mentalPressure: -1, familyPressure: 2, integrity: -1} }
  ]},
  { id: 'enl019', stage: 'life', eventType: 'choice', weight: 4, title: '亲戚借钱', text: '表哥突然登门，寒暄半天后支支吾吾说想借十万块钱周转生意。老妈之前提过这表哥"做生意不太靠谱"。', choices: [
    { text: '婉拒建议他找银行贷款', effects: {integrity: 2, familyPressure: 2, mentalPressure: 1, risk: -2} },
    { text: '借两万意思意思', effects: {wealth: -20, eq: 1, familyPressure: 1, risk: 2, mentalPressure: 2} },
    { text: '要求写借条并公证', effects: {wealth: -100, mentalPressure: 3, risk: 2, iq: 1, familyPressure: 2} },
    { text: '借口自己也紧张拒绝', effects: {familyPressure: 1, mentalPressure: 1, eq: -1, integrity: 1} }
  ]},
  { id: 'enl020', stage: 'life', eventType: 'choice', weight: 5, title: '家庭攀比', text: '周六家庭聚餐，大姐又开始了"凡尔赛"："我家那个考上重点了。"二姐接话："我们家刚换了别墅。"全桌目光转向你。', choices: [
    { text: '分享自己工作中的小成就', effects: {eq: 1, mentalPressure: 1, reputation: 1, desire: 1} },
    { text: '夸赞侄子侄女活跃气氛', effects: {eq: 2, mentalPressure: -1, familyPressure: -1} },
    { text: '自嘲几句化解尴尬', effects: {eq: 1, mentalPressure: 1, integrity: 1, familyPressure: 1} },
    { text: '埋头吃饭沉默应对', effects: {mentalPressure: -2, familyPressure: 2, eq: -2} }
  ]},
  { id: 'enl021', stage: 'life', eventType: 'choice', weight: 4, title: '父亲大寿', text: '老爸六十大寿，全家商量怎么过。老妈暗示"你爸这辈子没过过像样生日"，大姐说"简单吃顿饭就行"，二姐提议"去饭店办几桌"。', choices: [
    { text: '订高档酒店办寿宴', effects: {wealth: -50, eq: 2, familyPressure: -3, reputation: 2, desire: 1} },
    { text: '全家动手做一桌家宴', effects: {eq: 2, familyPressure: -2, mentalPressure: 2, integrity: 1} },
    { text: '带父母出去旅游过生日', effects: {wealth: -40, eq: 1, familyPressure: -2, body: 1, mentalPressure: -1} },
    { text: '买个金镯子作为寿礼', effects: {wealth: -30, eq: 1, familyPressure: -2, desire: 1} }
  ]},
  { id: 'enl022', stage: 'life', eventType: 'choice', weight: 3, title: '纪念日', text: '结婚纪念日快到了，老婆"无意中"提起同事收到了99朵玫瑰。你看了眼银行卡余额，又看了眼日历。', choices: [
    { text: '订99朵玫瑰制造浪漫', effects: {wealth: -20, eq: 2, familyPressure: -2, desire: 1, mentalPressure: -1} },
    { text: '亲手做一顿烛光晚餐', effects: {eq: 2, wealth: -10, mentalPressure: 1, integrity: 1, familyPressure: -1} },
    { text: '买个小礼物表达心意', effects: {wealth: -15, eq: 1, familyPressure: -1, mentalPressure: -1} },
    { text: '忙忘了赶紧补个红包', effects: {wealth: -20, eq: 1, mentalPressure: 2, familyPressure: 1} }
  ]},
  { id: 'enl023', stage: 'life', eventType: 'choice', weight: 4, title: '体检警报', text: '单位体检报告出来了，几项指标飘红：脂肪肝、血脂偏高、颈椎曲度变直。医生建议"管住嘴迈开腿，否则要吃药了"。', choices: [
    { text: '立即办健身卡开始锻炼', effects: {wealth: -30, body: 2, mentalPressure: -1, desire: 1, familyPressure: -1} },
    { text: '调整饮食戒酒戒夜宵', effects: {body: 2, mentalPressure: 2, integrity: 2, eq: 1} },
    { text: '买保健品调理身体', effects: {wealth: -20, body: 1, mentalPressure: 1, iq: -1} },
    { text: '看完报告继续该吃吃该喝喝', effects: {body: -2, mentalPressure: 1, integrity: -1, risk: 2} }
  ]},
  { id: 'enl024', stage: 'life', eventType: 'choice', weight: 4, title: '父亲手术', text: '老妈打电话说老爸住院了，需要做心脏支架手术。医生说国产支架便宜但进口更稳定，让你尽快决定。', choices: [
    { text: '选进口支架花钱买安心', effects: {wealth: -80, familyPressure: -1, mentalPressure: 3, eq: 1, integrity: 1} },
    { text: '选国产支架性价比高', effects: {wealth: -30, mentalPressure: 2, familyPressure: 1, iq: 1} },
    { text: '多方咨询专家意见', effects: {iq: 2, mentalPressure: 3, background: 1, familyPressure: 1} },
    { text: '用医保范围内最优方案', effects: {iq: 2, wealth: -20, mentalPressure: 2, integrity: 1} }
  ]},
  { id: 'enl025', stage: 'life', eventType: 'choice', weight: 3, title: '请钟点工', text: '工作和家务压得喘不过气，朋友建议请个钟点工阿姨。老婆担心"陌生人进家不安全"，又觉得"花钱请人不如自己干"。', choices: [
    { text: '通过正规公司请阿姨', effects: {wealth: -20, mentalPressure: -3, familyPressure: -2, eq: 1} },
    { text: '请老乡介绍的保姆', effects: {wealth: -15, mentalPressure: -2, risk: 1, background: 1} },
    { text: '和老婆分工做家务', effects: {eq: 1, mentalPressure: 1, familyPressure: -1, integrity: 1} },
    { text: '咬牙自己撑着不请人', effects: {mentalPressure: 3, body: -1, familyPressure: 2, wealth: 0} }
  ]},

  // ====== 社交人情类（25个） ======
  { id: 'enl026', stage: 'life', eventType: 'choice', weight: 5, title: '同事请柬', text: '办公室小张发了请柬，下月结婚。你们关系一般，平时只是点头之交，但同部门的人都收到了请柬。', choices: [
    { text: '随大流包500元红包', effects: {wealth: -5, eq: 1, mentalPressure: 1, reputation: 1} },
    { text: '包200元意思一下', effects: {wealth: -2, eq: 1, mentalPressure: 1} },
    { text: '借口有事不参加', effects: {eq: -1, mentalPressure: 1, reputation: -1, wealth: 0} },
    { text: '包800元搏个好关系', effects: {wealth: -8, eq: 2, background: 1, mentalPressure: 1} }
  ]},
  { id: 'enl027', stage: 'life', eventType: 'choice', weight: 4, title: '同事生二胎', text: '同事小李生二胎了，群里都在发红包祝贺。你刚因为一个项目和小李有过争执，关系有点僵。', choices: [
    { text: '发个大红包修复关系', effects: {wealth: -5, eq: 2, mentalPressure: -1, background: 1} },
    { text: '随群发标准红包', effects: {wealth: -2, eq: 1, mentalPressure: 1} },
    { text: '买份婴儿用品相送', effects: {wealth: -10, eq: 1, integrity: 1, mentalPressure: -1} },
    { text: '只口头祝贺不发红包', effects: {eq: -2, mentalPressure: 1, reputation: -1} }
  ]},
  { id: 'enl028', stage: 'life', eventType: 'choice', weight: 3, title: '同事乔迁', text: '老王乔迁新居，邀请几个同事去暖房。你纠结要不要去，去了要送礼，不去又怕老王记仇。', choices: [
    { text: '带份礼物去捧场', effects: {wealth: -15, eq: 1, background: 1, mentalPressure: 1} },
    { text: '发个红包人不到心意到', effects: {wealth: -5, eq: 1, mentalPressure: -1} },
    { text: '借口有事婉拒', effects: {mentalPressure: 1, eq: -1, wealth: 0} },
    { text: '带瓶好酒和老王喝两杯', effects: {wealth: -20, eq: 2, background: 1, mentalPressure: -1, body: -1} }
  ]},
  { id: 'enl029', stage: 'life', eventType: 'choice', weight: 4, title: '老领导调走', text: '老领导要调走了，办公室商量着凑钱送份礼物。有人说送购物卡实在，有人说送字画有品位，有人提议集体请吃饭。', choices: [
    { text: '提议集体送购物卡', effects: {eq: 1, wealth: -5, background: 1, mentalPressure: 1} },
    { text: '单独送份有品位的礼物', effects: {wealth: -20, background: 2, eq: 1, desire: 1} },
    { text: '参与集体请客吃饭', effects: {wealth: -15, eq: 1, background: 1, mentalPressure: -1} },
    { text: '写封感谢信表达心意', effects: {integrity: 2, eq: 1, mentalPressure: 1, wealth: 0} }
  ]},
  { id: 'enl030', stage: 'life', eventType: 'choice', weight: 5, title: '饭局应酬', text: '今晚有饭局，据说是为了"协调"某个项目。你不想去但又怕得罪人，老婆也抱怨"又喝酒，肝还要不要了"。', choices: [
    { text: '硬着头皮去应酬', effects: {background: 2, body: -1, mentalPressure: 2, eq: 1, familyPressure: 2} },
    { text: '借口身体不适推掉', effects: {familyPressure: -1, mentalPressure: 1, background: -1, integrity: 1} },
    { text: '去但不喝酒以茶代酒', effects: {eq: 1, body: 1, background: 1, mentalPressure: 1} },
    { text: '派下属代为出席', effects: {workAbility: 1, eq: -1, background: 1, risk: 1} }
  ]},
  { id: 'enl031', stage: 'life', eventType: 'choice', weight: 3, title: '酒桌文化', text: '饭局上领导端着酒杯说"感情深一口闷"。你酒量不行，但所有人都看着你，气氛有点尴尬。', choices: [
    { text: '咬牙一口干掉', effects: {body: -2, eq: 1, background: 1, mentalPressure: 1, risk: 2} },
    { text: '以茶代酒真诚解释', effects: {integrity: 2, eq: 1, mentalPressure: 2, background: -1} },
    { text: '小口抿一下意思意思', effects: {eq: 1, mentalPressure: 1, body: -1} },
    { text: '假装接电话暂时离开', effects: {mentalPressure: 2, eq: -1, integrity: -1, risk: 1} }
  ]},
  { id: 'enl032', stage: 'life', eventType: 'choice', weight: 4, title: '同事聚餐', text: '同事提议周末聚餐AA制，人均200。你觉得有点贵，但大家都同意了，你不想做那个"扫兴"的人。', choices: [
    { text: '参加并爽快AA', effects: {wealth: -20, eq: 1, mentalPressure: -1, background: 1} },
    { text: '提议换个便宜点的地方', effects: {eq: 1, wealth: -10, mentalPressure: 1, integrity: 1} },
    { text: '借口有事不去', effects: {wealth: 0, eq: -1, mentalPressure: 1, background: -1} },
    { text: '去但只点便宜的菜', effects: {wealth: -10, eq: 1, mentalPressure: 2, integrity: -1} }
  ]},
  { id: 'enl033', stage: 'life', eventType: 'choice', weight: 3, title: '抢红包起哄', text: '同事群里有人发红包，你抢了一个大的。紧接着就有人起哄"大的请客"，气氛突然热烈起来。', choices: [
    { text: '爽快发个红包回请大家', effects: {wealth: -5, eq: 2, mentalPressure: -1, background: 1} },
    { text: '发个等额红包意思一下', effects: {wealth: -2, eq: 1, mentalPressure: 1} },
    { text: '发个表情包糊弄过去', effects: {eq: 1, mentalPressure: 1, reputation: -1} },
    { text: '潜水装作没看见', effects: {eq: -1, mentalPressure: -2, reputation: -1} }
  ]},
  { id: 'enl034', stage: 'life', eventType: 'choice', weight: 3, title: '人情往来（随礼）', text: '翻开人情往来本，发现今年光随礼就花了小一万。中秋国庆还有三场婚礼，老婆看完直摇头。', choices: [
    { text: '该随的还得随保住人情', effects: {wealth: -30, eq: 1, mentalPressure: 2, familyPressure: 2} },
    { text: '远的关系适当降低标准', effects: {wealth: -15, eq: 1, mentalPressure: 1, integrity: 1} },
    { text: '只随近亲好友的礼', effects: {wealth: -10, eq: -1, mentalPressure: 2, reputation: -1} },
    { text: '记账等以后收回来', effects: {iq: 1, mentalPressure: 1, wealth: -20, integrity: -1} }
  ]},
  { id: 'enl035', stage: 'life', eventType: 'choice', weight: 3, title: '补随礼', text: '多年前帮过你的一位老领导孩子结婚，你没随礼。最近听说老领导到处说你"白眼狼"，心里有点慌。', choices: [
    { text: '登门拜访补上礼金', effects: {wealth: -20, eq: 2, reputation: 2, mentalPressure: -2, background: 1} },
    { text: '托人带话解释当年情况', effects: {eq: 1, mentalPressure: 2, background: 1} },
    { text: '打电话亲自道歉', effects: {eq: 1, integrity: 2, mentalPressure: 1, reputation: 1} },
    { text: '装作不知道避开此事', effects: {reputation: -2, mentalPressure: -1, eq: -2} }
  ]},
  { id: 'enl036', stage: 'life', eventType: 'choice', weight: 3, title: '收礼难题', text: '合作方送来一盒高档茶叶，价值不菲。你想拒绝又怕伤了和气，收下又觉得有违纪之嫌。', choices: [
    { text: '当面婉拒说明纪律', effects: {integrity: 3, mentalPressure: 2, risk: -2, reputation: 1} },
    { text: '收下但回赠等价礼物', effects: {wealth: -20, eq: 1, integrity: 1, mentalPressure: 1} },
    { text: '上交纪检备案', effects: {integrity: 3, mentalPressure: 3, risk: -1, reputation: 1} },
    { text: '转送给其他同事', effects: {eq: 1, integrity: -1, mentalPressure: 1, risk: 1} }
  ]},
  { id: 'enl037', stage: 'life', eventType: 'choice', weight: 3, title: '下属送礼', text: '下属送来两瓶茅台，说是"家乡特产表表心意"。你知道这酒不便宜，收了怕欠人情，不收又怕下属难堪。', choices: [
    { text: '婉拒并感谢其心意', effects: {integrity: 2, eq: 1, mentalPressure: 1, risk: -1} },
    { text: '收下后找机会回礼', effects: {wealth: -15, eq: 1, mentalPressure: 1, risk: 1} },
    { text: '收下后分给办公室同事', effects: {eq: 1, integrity: -1, mentalPressure: 1} },
    { text: '退回并严肃谈话', effects: {integrity: 3, mentalPressure: 3, reputation: 1, eq: -1} }
  ]},
  { id: 'enl038', stage: 'life', eventType: 'choice', weight: 2, title: '退礼技巧', text: '收到一份贵重礼物想退回去，但直接退又显得生分。你搜了一下"退礼技巧"，发现这是一门学问。', choices: [
    { text: '以家人不同意为由退回', effects: {eq: 1, integrity: 2, mentalPressure: 1, risk: -1} },
    { text: '找机会回赠等价礼物', effects: {wealth: -20, eq: 1, mentalPressure: 1, integrity: 1} },
    { text: '用工作理由婉拒', effects: {integrity: 2, mentalPressure: 2, eq: 1} },
    { text: '收下后捐给慈善机构', effects: {integrity: 3, reputation: 1, mentalPressure: 1, eq: 1} }
  ]},
  { id: 'enl039', stage: 'life', eventType: 'choice', weight: 4, title: '同事借钱', text: '同事小赵红着脸找你借三千块应急，说发工资就还。你知道他最近刚被催债，心里有点打鼓。', choices: [
    { text: '借给他不收利息', effects: {wealth: -30, eq: 1, mentalPressure: 2, risk: 2} },
    { text: '借一千应急并说不必还', effects: {wealth: -10, eq: 1, mentalPressure: 1, integrity: 1} },
    { text: '委婉拒绝避免尴尬', effects: {mentalPressure: 1, eq: -1, risk: -1, integrity: 1} },
    { text: '帮他想其他筹钱办法', effects: {iq: 1, eq: 1, mentalPressure: 1, background: 1} }
  ]},
  { id: 'enl040', stage: 'life', eventType: 'choice', weight: 4, title: '朋友创业', text: '老朋友打电话来，说自己创业遇到资金困难，想让你入股"稳赚不赔"的项目，承诺年化20%回报。', choices: [
    { text: '投资两万支持老友', effects: {wealth: -20, risk: 4, desire: 2, mentalPressure: 2, background: 1} },
    { text: '婉拒但请他吃顿饭', effects: {eq: 1, mentalPressure: 1, integrity: 1, risk: -2} },
    { text: '借钱不入股避免纠纷', effects: {wealth: -10, eq: 1, risk: 2, mentalPressure: 1} },
    { text: '仔细研究项目再决定', effects: {iq: 2, mentalPressure: 2, integrity: 1} }
  ]},
  { id: 'enl041', stage: 'life', eventType: 'choice', weight: 4, title: '同学聚会（高中）', text: '高中同学组织毕业20年聚会，每人预交500。你想去见见老同学，又怕被人攀比"现在混得怎么样"。', choices: [
    { text: '报名参加大大方方赴约', effects: {wealth: -5, eq: 2, mentalPressure: 1, background: 1} },
    { text: '参加但低调不攀比', effects: {wealth: -5, eq: 1, integrity: 1, mentalPressure: 1} },
    { text: '借口工作忙不参加', effects: {mentalPressure: -1, eq: -1, wealth: 0} },
    { text: '参加并主动张罗组织', effects: {wealth: -5, eq: 2, background: 2, mentalPressure: 2, reputation: 1} }
  ]},
  { id: 'enl042', stage: 'life', eventType: 'choice', weight: 3, title: '老乡聚会', text: '老乡群组织年度聚会，群主说"咱们老乡要常走动"。你跟这些老乡其实不太熟，但老婆说"多认识人有好处"。', choices: [
    { text: '参加聚会被动社交', effects: {wealth: -3, eq: 1, background: 1, mentalPressure: 2} },
    { text: '积极发言融入圈子', effects: {eq: 1, background: 2, mentalPressure: 1, wealth: -3} },
    { text: '只交份子钱不参加', effects: {wealth: -2, eq: 0, mentalPressure: 1, background: 1} },
    { text: '退群避免后续打扰', effects: {mentalPressure: -1, eq: -1, background: -1} }
  ]},
  { id: 'enl043', stage: 'life', eventType: 'choice', weight: 3, title: '母校校庆', text: '母校校庆邀请你回去参加，说是要"凝聚校友力量"。班主任也亲自打电话希望你去，还能见见老同学。', choices: [
    { text: '回校参加并捐赠一点', effects: {wealth: -20, reputation: 2, background: 2, eq: 1, mentalPressure: 1} },
    { text: '回去参加但不捐款', effects: {wealth: -5, eq: 1, mentalPressure: 1, background: 1} },
    { text: '发条祝福不回去', effects: {mentalPressure: -1, eq: 1, wealth: 0} },
    { text: '回去并主动联系老同学', effects: {eq: 2, background: 2, mentalPressure: 1, wealth: -5} }
  ]},
  { id: 'enl044', stage: 'life', eventType: 'choice', weight: 3, title: '行业协会', text: '行业协会邀请你加入理事单位，年费两万。好处是能认识不少业内人士，坏处是又要花钱又要应酬。', choices: [
    { text: '加入积极拓展人脉', effects: {wealth: -20, background: 3, eq: 1, mentalPressure: 2, reputation: 1} },
    { text: '加入但只参加重要活动', effects: {wealth: -20, background: 2, mentalPressure: 1, eq: 1} },
    { text: '暂不加入观望一段时间', effects: {mentalPressure: -1, wealth: 0, background: -1} },
    { text: '推荐公司其他同事加入', effects: {eq: 1, background: 1, mentalPressure: 1, workAbility: 1} }
  ]},
  { id: 'enl045', stage: 'life', eventType: 'choice', weight: 3, title: '读书会（朋友小聚）', text: '朋友拉你加入一个读书会，每周三晚上聚一次。你最近工作忙得脚不沾地，但又确实需要拓展一下精神生活。', choices: [
    { text: '加入坚持每周参加', effects: {iq: 2, eq: 1, mentalPressure: 2, background: 1} },
    { text: '加入但只参加一半活动', effects: {iq: 1, eq: 1, mentalPressure: 1, background: 1} },
    { text: '等忙过这段时间再加', effects: {mentalPressure: -1, iq: -1, integrity: 1} },
    { text: '推荐其他爱读书的朋友', effects: {eq: 1, background: 1, mentalPressure: -1} }
  ]},
  { id: 'enl046', stage: 'life', eventType: 'choice', weight: 3, title: '健身搭子', text: '健身房认识一个"撸铁搭子"，对方热情邀请你一起请私教课，说"两个人一起更有动力"。私教课不便宜。', choices: [
    { text: '合伙请私教互相监督', effects: {wealth: -40, body: 2, eq: 1, mentalPressure: -1} },
    { text: '只一起练不请私教', effects: {body: 1, eq: 1, mentalPressure: -1, wealth: 0} },
    { text: '婉拒独自锻炼', effects: {body: 1, mentalPressure: -2, eq: -1, wealth: 0} },
    { text: '推荐更便宜的团课', effects: {iq: 1, eq: 1, body: 1, wealth: -10} }
  ]},
  { id: 'enl047', stage: 'life', eventType: 'choice', weight: 3, title: '网约车司机', text: '网约车司机一路抱怨生活不易，最后说能不能加个微信"以后用车方便"。你犹豫要不要给。', choices: [
    { text: '加微信留个联系方式', effects: {background: 1, eq: 1, mentalPressure: 1, risk: 1} },
    { text: '礼貌拒绝说没必要', effects: {integrity: 1, mentalPressure: 1, eq: 0} },
    { text: '给个五星好评安慰一下', effects: {eq: 1, mentalPressure: -1, reputation: 1} },
    { text: '多给点小费帮帮司机', effects: {wealth: -2, eq: 1, integrity: 1, mentalPressure: -1} }
  ]},
  { id: 'enl048', stage: 'life', eventType: 'choice', weight: 3, title: '邻居代收', text: '邻居大姐总帮你代收快递，今天又收了三个。你想表达谢意，但又不想显得太刻意。', choices: [
    { text: '买盒点心送过去感谢', effects: {wealth: -5, eq: 2, mentalPressure: -1, reputation: 1} },
    { text: '逢年过节送个小礼物', effects: {wealth: -10, eq: 1, mentalPressure: -1} },
    { text: '口头上谢谢就好', effects: {eq: 1, mentalPressure: 1, reputation: 0} },
    { text: '也帮对方代收快递', effects: {eq: 1, integrity: 1, mentalPressure: 1} }
  ]},
  { id: 'enl049', stage: 'life', eventType: 'choice', weight: 3, title: '邻里节', text: '社区组织"邻里节"活动，邀请各家做拿手菜分享。老婆说这种活动"又累又没意思"，但你刚搬来不久。', choices: [
    { text: '积极参加融入社区', effects: {eq: 1, background: 2, mentalPressure: 1, reputation: 1} },
    { text: '做道菜意思一下', effects: {eq: 1, mentalPressure: 1, background: 1} },
    { text: '只去品尝不带菜', effects: {eq: 1, mentalPressure: 1, reputation: -1} },
    { text: '借口有事不参加', effects: {mentalPressure: -1, eq: -1, background: -1} }
  ]},
  { id: 'enl050', stage: 'life', eventType: 'choice', weight: 3, title: '业委会换届', text: '小区业委会换届，有人推举你当委员。当委员要处理各种琐事，但也能认识不少邻居、维护自己权益。', choices: [
    { text: '竞选业委会委员', effects: {eq: 1, background: 2, mentalPressure: 3, integrity: 1, reputation: 1} },
    { text: '当个普通业主参与投票', effects: {eq: 1, mentalPressure: 1, integrity: 1} },
    { text: '婉拒避免麻烦', effects: {mentalPressure: -1, eq: -1} },
    { text: '推荐更合适的人选', effects: {eq: 1, background: 1, integrity: 1, mentalPressure: 1} }
  ]},

  // ====== 情感心理类（25个） ======
  { id: 'enl051', stage: 'life', eventType: 'choice', weight: 5, title: '相亲见面', text: '老妈安排的相亲对象约你在咖啡厅见面。你到早了，紧张得手心冒汗，不知道见面第一句话该说什么。', choices: [
    { text: '主动打招呼展现风度', effects: {eq: 2, mentalPressure: 2, desire: 1} },
    { text: '等对方先开口观察一下', effects: {iq: 1, mentalPressure: 2, eq: 1} },
    { text: '聊聊咖啡和环境缓解尴尬', effects: {eq: 1, mentalPressure: 1, iq: 1} },
    { text: '直接问对方基本情况', effects: {iq: 1, mentalPressure: 2, eq: -1} }
  ]},
  { id: 'enl052', stage: 'life', eventType: 'choice', weight: 3, title: '网友见面', text: '交友软件上聊了三个月的网友提出见面。照片很甜美，但你总觉得哪里不对劲——对方从不开视频。', choices: [
    { text: '见面但选在公共场所', effects: {eq: 1, mentalPressure: 2, risk: 2, desire: 1} },
    { text: '坚持视频通话再决定', effects: {iq: 2, mentalPressure: 1, risk: -1, integrity: 1} },
    { text: '直接拉黑避免风险', effects: {integrity: 1, mentalPressure: 1, risk: -3, eq: -1} },
    { text: '继续聊着观察一段时间', effects: {mentalPressure: 1, eq: 1, risk: 1} }
  ]},
  { id: 'enl053', stage: 'life', eventType: 'choice', weight: 4, requireSingle: true, title: '异地恋', text: '异地恋半年了，对象抱怨"你最近不主动联系"。你确实忙，但心里也有点动摇——这样下去能修成正果吗？', choices: [
    { text: '每周末固定视频陪伴', effects: {eq: 2, mentalPressure: 1, familyPressure: -1, desire: 1} },
    { text: '抽空去对方城市看望', effects: {wealth: -30, eq: 2, mentalPressure: -1, body: -1, desire: 1} },
    { text: '认真讨论未来规划', effects: {iq: 2, eq: 1, mentalPressure: 2, familyPressure: 1} },
    { text: '渐渐冷淡让对方主动', effects: {eq: -2, mentalPressure: 2, integrity: -1, familyPressure: 1} }
  ]},
  { id: 'enl054', stage: 'life', eventType: 'choice', weight: 3, requireSingle: true, title: '突然分手', text: '谈了三年的对象提出分手，理由是"性格不合"。你莫名其妙——上周还好好的，怎么突然就"不合"了？', choices: [
    { text: '冷静沟通问清原因', effects: {eq: 1, iq: 2, mentalPressure: 3, integrity: 1, deleteFlag: 'dating'} },
    { text: '体面放手不纠缠', effects: {integrity: 3, mentalPressure: 3, eq: 1, desire: -2, deleteFlag: 'dating'} },
    { text: '极力挽留给对方承诺', effects: {eq: 1, mentalPressure: 4, familyPressure: 2, desire: 1} },
    { text: '独自消化不去联系', effects: {mentalPressure: 4, body: -1, integrity: 1, eq: -1} }
  ]},
  { id: 'enl055', stage: 'life', eventType: 'choice', weight: 3, requireSingle: true, title: '前任联系', text: '前对象突然联系你，说"想你了，能见一面吗"。你已经有了新生活，但心里那根弦还是被拨动了一下。', choices: [
    { text: '果断拒绝不回头', effects: {integrity: 2, mentalPressure: 1, eq: 1} },
    { text: '见一面把话说清楚', effects: {iq: 2, mentalPressure: 3, eq: 1, risk: 1} },
    { text: '约在公共场所简单叙旧', effects: {eq: 1, mentalPressure: 2, risk: 2, desire: 1} },
    { text: '不回复保持沉默', effects: {mentalPressure: 2, integrity: 1, eq: -1} }
  ]},
  { id: 'enl056', stage: 'life', eventType: 'choice', weight: 3, requireSingle: true, title: '办公室暧昧', text: '办公室新来的同事对你格外关心，每天帮你带咖啡。你知道办公室恋情的风险，但对方确实很迷人。', choices: [
    { text: '保持距离只谈工作', effects: {integrity: 2, mentalPressure: 1, workAbility: 1, risk: -2} },
    { text: '低调发展秘密交往', effects: {eq: 1, mentalPressure: 3, risk: 3, desire: 1} },
    { text: '明确表态不发展关系', effects: {integrity: 2, eq: 1, mentalPressure: 2, risk: -1} },
    { text: '调岗避免接触', effects: {workAbility: -1, mentalPressure: 2, risk: -2, integrity: 1} }
  ]},
  { id: 'enl057', stage: 'life', eventType: 'choice', weight: 3, requireSingle: true, title: '暗恋表白', text: '你暗恋同事小林很久了，今天听说有人要给小林介绍对象。心里像压了块石头，要不要表白？', choices: [
    { text: '鼓起勇气约对方表白', effects: {eq: 1, mentalPressure: 3, desire: 2, risk: 2} },
    { text: '试探对方态度再决定', effects: {iq: 2, mentalPressure: 2, eq: 1} },
    { text: '默默祝福把感情藏起来', effects: {mentalPressure: 3, integrity: 1, eq: -1, desire: -1} },
    { text: '通过共同朋友打听', effects: {background: 1, mentalPressure: 1, eq: 1, risk: 1} }
  ]},
  { id: 'enl058', stage: 'life', eventType: 'choice', weight: 3, requireSingle: true, title: '相亲失败', text: '相亲十次全部失败，媒人都开始婉拒介绍。你对着镜子看了半天，开始怀疑是不是自己真的有问题。', choices: [
    { text: '调整心态提升自己', effects: {iq: 2, mentalPressure: 2, body: 1, integrity: 1, desire: 1} },
    { text: '降低标准先接触再说', effects: {mentalPressure: -1, eq: 1, desire: -1} },
    { text: '找朋友复盘相亲过程', effects: {eq: 1, mentalPressure: 1, iq: 1, background: 1} },
    { text: '暂时放弃专心工作', effects: {workAbility: 2, mentalPressure: 1, desire: -2} }
  ]},
  { id: 'enl059', stage: 'life', eventType: 'choice', weight: 4, title: '相亲再见', text: '相亲对象约你再见一面，对方说"想多了解你"。上次聊得确实投机，你心里有点小期待。', choices: [
    { text: '爽快答应好好准备', effects: {eq: 2, mentalPressure: -1, desire: 2, body: 1} },
    { text: '答应但保持理性节奏', effects: {iq: 2, eq: 1, mentalPressure: 1, integrity: 1} },
    { text: '提议换个活动方式约会', effects: {eq: 1, mentalPressure: 1, wealth: -10, desire: 1} },
    { text: '故意推迟几天保持神秘', effects: {mentalPressure: 2, eq: 1, desire: 1, risk: 1} }
  ]},
  { id: 'enl060', stage: 'life', eventType: 'choice', weight: 4, title: '见父母', text: '对象带你回家见父母。准岳母问了一堆问题："工资多少、房子多大、父母干嘛的"，像在面试。', choices: [
    { text: '诚实回答展现真诚', effects: {integrity: 3, eq: 1, mentalPressure: 2, background: 1} },
    { text: '巧妙回避敏感问题', effects: {eq: 1, mentalPressure: 2, iq: 1, integrity: -1} },
    { text: '适当美化自己的情况', effects: {eq: 1, mentalPressure: 2, risk: 2, integrity: -2} },
    { text: '反问对方家庭情况', effects: {iq: 1, eq: -1, mentalPressure: 2, integrity: 1} }
  ]},
  { id: 'enl061', stage: 'life', eventType: 'choice', weight: 3, title: '求婚（钻戒预算）', requireSingle: true, year: [22, 50], text: '恋爱两年，对象暗示"该定下来了"。你想求婚又怕仪式不够隆重，买钻戒又怕超预算。', choices: [
    { text: '精心策划正式求婚', effects: {wealth: -30, eq: 2, desire: 2, mentalPressure: 2, familyPressure: -1} },
    { text: '简单求婚重在心意', effects: {wealth: -10, eq: 2, integrity: 1, mentalPressure: 1} },
    { text: '先订婚再慢慢筹备', effects: {wealth: -20, eq: 1, mentalPressure: 1, familyPressure: -1} },
    { text: '商量后跳过求婚直接登记', effects: {wealth: -5, eq: 1, integrity: 1, mentalPressure: 1} }
  ]},
  { id: 'enl062', stage: 'life', eventType: 'choice', weight: 4, title: '婚庆预算', text: '婚期将近，婚庆公司报了个"豪华套餐"，比预算贵一倍。丈母娘说"闺女就结这一次，要风光"。', choices: [
    { text: '咬牙办豪华婚礼', effects: {wealth: -100, eq: 1, familyPressure: 2, desire: 2, reputation: 2} },
    { text: '简约婚礼省钱过日子', effects: {wealth: -30, integrity: 2, mentalPressure: 2, familyPressure: 1} },
    { text: '旅行结婚另办答谢宴', effects: {wealth: -40, eq: 1, body: 1, mentalPressure: -1, desire: 1} },
    { text: '和双方父母协商折中', effects: {eq: 1, mentalPressure: 2, wealth: -50, familyPressure: -1} }
  ]},
  { id: 'enl063', stage: 'life', eventType: 'choice', weight: 4, title: '新婚磨合', text: '新婚三个月，老婆抱怨你"袜子乱扔、马桶圈不放下来"。你嫌她"事多、爱唠叨"。蜜月期好像过去了。', choices: [
    { text: '主动改掉坏习惯', effects: {eq: 2, familyPressure: -2, integrity: 2, mentalPressure: 1} },
    { text: '坐下来好好沟通分工', effects: {iq: 2, eq: 1, mentalPressure: 1, familyPressure: -1} },
    { text: '各退一步互相包容', effects: {eq: 1, familyPressure: -1, mentalPressure: 1, integrity: 1} },
    { text: '继续我行我素', effects: {familyPressure: 3, mentalPressure: 2, eq: -2, integrity: -1} }
  ]},
  { id: 'enl064', stage: 'life', eventType: 'choice', weight: 3, title: '七年之痒', text: '结婚七年，你和爱人越来越像室友。下班各刷各的手机，话越来越少。朋友提醒"小心七年之痒"。', choices: [
    { text: '策划一次二人世界旅行', effects: {wealth: -30, eq: 2, mentalPressure: -2, body: 1, desire: 1} },
    { text: '每周固定约会时间', effects: {eq: 2, mentalPressure: 1, wealth: -10, familyPressure: -1} },
    { text: '一起培养共同爱好', effects: {eq: 1, mentalPressure: -1, body: 1, integrity: 1} },
    { text: '各自保持独立空间', effects: {mentalPressure: -1, eq: 1, familyPressure: 1, desire: -1} }
  ]},
  { id: 'enl065', stage: 'life', eventType: 'choice', weight: 3, title: '中年危机（深夜）', year: [35, 55], text: '四十岁了，半夜醒来盯着天花板发呆。事业不上不下，房贷还没还完，孩子还要养——这就是中年吗？', choices: [
    { text: '重新规划人生目标', effects: {iq: 2, mentalPressure: 2, desire: 2, integrity: 1} },
    { text: '培养新爱好寻找意义', effects: {mentalPressure: -2, eq: 1, body: 1, desire: 1} },
    { text: '接受平凡学会知足', effects: {mentalPressure: -2, integrity: 2, eq: 1, desire: -1} },
    { text: '拼命工作转移注意力', effects: {workAbility: 2, mentalPressure: 3, body: -1, familyPressure: 2} }
  ]},
  { id: 'enl066', stage: 'life', eventType: 'choice', weight: 4, title: '裁员焦虑', text: '最近总担心被裁员，看到群里讨论"35岁危机"就焦虑。同事小自己五岁的能力强、工资低，自己处境微妙。', choices: [
    { text: '主动学习提升竞争力', effects: {iq: 2, workAbility: 2, mentalPressure: 2, desire: 1} },
    { text: '发展副业对冲风险', effects: {workAbility: 1, wealth: -10, mentalPressure: 3, risk: 1} },
    { text: '和领导沟通明确前景', effects: {eq: 1, mentalPressure: 2, background: 1, integrity: 1} },
    { text: '降低消费存应急资金', effects: {wealth: 10, mentalPressure: 1, desire: -2, familyPressure: 1} }
  ]},
  { id: 'enl067', stage: 'life', eventType: 'choice', weight: 3, title: '容貌焦虑', text: '照镜子发现眼角有了细纹，肚子也鼓了一圈。朋友圈里同龄人状态都很好，自己怎么就老了？', choices: [
    { text: '规律运动科学护肤', effects: {body: 2, mentalPressure: -1, wealth: -15, desire: 1} },
    { text: '医美项目改善外观', effects: {wealth: -40, body: 1, mentalPressure: 2, desire: 2, risk: 1} },
    { text: '接受自然老去的事实', effects: {mentalPressure: -2, integrity: 2, eq: 1, desire: -1} },
    { text: '通过穿搭提升气质', effects: {wealth: -20, eq: 1, mentalPressure: -1, desire: 1} }
  ]},
  { id: 'enl068', stage: 'life', eventType: 'choice', weight: 3, title: '同龄人比较', text: '同学晒出"30岁年薪百万"的帖子，你看了眼自己的工资条，一阵窒息。同龄人都成功了，你还在原地踏步。', choices: [
    { text: '制定职业突破计划', effects: {iq: 2, workAbility: 2, mentalPressure: 3, desire: 2} },
    { text: '减少社交媒体关注', effects: {mentalPressure: -2, integrity: 1, eq: 1, desire: -1} },
    { text: '看到自己的优势不比较', effects: {mentalPressure: -2, eq: 1, integrity: 2, desire: -1} },
    { text: '向成功同学请教经验', effects: {background: 1, mentalPressure: 2, eq: 1, iq: 1} }
  ]},
  { id: 'enl069', stage: 'life', eventType: 'choice', weight: 4, title: '过年攀比', text: '过年回老家，七大姑八大姨轮番比较："你看人家小谁……"。从工资比到房子，从孩子比到老公，你应付得心力交瘁。', choices: [
    { text: '笑而不语不参与攀比', effects: {integrity: 2, mentalPressure: 1, eq: 1, desire: -1} },
    { text: '找借口提前回家', effects: {mentalPressure: -1, eq: -1, familyPressure: 2} },
    { text: '巧妙转移话题', effects: {eq: 1, iq: 1, mentalPressure: 1, integrity: 1} },
    { text: '反向比较让对方闭嘴', effects: {eq: 1, mentalPressure: -1, integrity: -1, risk: 1} }
  ]},
  { id: 'enl070', stage: 'life', eventType: 'choice', weight: 4, title: '买房焦虑', text: '房价又涨了，你盯着楼盘广告算了一个小时，发现首付还是差一截。租房住总觉得"没有家"。', choices: [
    { text: '咬牙凑首付先上车', effects: {wealth: -120, familyPressure: 3, mentalPressure: 3, desire: 2, eq: 1} }, // v2.58 数值收敛：-150 → -120（w4 高频事件，与买房类同类事件对齐）
    { text: '继续租房观望市场', effects: {mentalPressure: 1, wealth: 0, familyPressure: 2, integrity: 1} },
    { text: '考虑买小户型过渡', effects: {wealth: -80, mentalPressure: 2, familyPressure: 1, desire: 1} },
    { text: '到郊区买大房子', effects: {wealth: -100, body: -1, mentalPressure: 2, familyPressure: -1} }
  ]},
  { id: 'enl071', stage: 'life', eventType: 'choice', weight: 3, title: '换车面子', text: '同事都开上了BBA，你还开着五年前的国产车。接送孩子时，孩子问"爸爸咱家为什么不换好车？"', choices: [
    { text: '换辆好车撑场面', effects: {wealth: -100, desire: 2, eq: 1, mentalPressure: 2, familyPressure: 2} },
    { text: '教育孩子实用就好', effects: {integrity: 2, eq: 1, mentalPressure: 1, familyPressure: -1} },
    { text: '换辆性价比高的代步车', effects: {wealth: -50, mentalPressure: -1, desire: 1, familyPressure: -1} },
    { text: '继续开旧车攒钱', effects: {wealth: 10, mentalPressure: 2, desire: -1, integrity: 1} }
  ]},
  { id: 'enl072', stage: 'life', eventType: 'choice', weight: 4, title: '存款焦虑', text: '查了下银行卡余额，又查了下下个月要还的贷款。一阵眩晕——工作了这么多年，存款竟然只有这么点。', choices: [
    { text: '制定严格存钱计划', effects: {wealth: 20, mentalPressure: 2, desire: -2, familyPressure: 1, integrity: 1} },
    { text: '开源找副业增加收入', effects: {workAbility: 1, wealth: -5, mentalPressure: 3, risk: 1} },
    { text: '理性消费减少不必要开支', effects: {wealth: 15, mentalPressure: 1, desire: -1, integrity: 1} },
    { text: '投资理财让钱生钱', effects: {iq: 1, wealth: -10, mentalPressure: 2, risk: 3, desire: 1} }
  ]},
  { id: 'enl073', stage: 'life', eventType: 'choice', weight: 3, title: '健康担忧', text: '同事体检查出甲状腺结节，朋友父亲确诊肺癌。你最近总觉得疲惫，开始担心自己是不是也有什么问题。', choices: [
    { text: '立即预约全面体检', effects: {wealth: -15, body: 1, mentalPressure: 2, integrity: 1, iq: 1} },
    { text: '调整作息注意养生', effects: {body: 2, mentalPressure: -1, integrity: 1, desire: -1} },
    { text: '买份重疾险以防万一', effects: {wealth: -30, mentalPressure: -1, risk: -2, iq: 1} },
    { text: '担心也没用顺其自然', effects: {mentalPressure: -2, body: -1, risk: 2, integrity: -1} }
  ]},
  { id: 'enl074', stage: 'life', eventType: 'choice', weight: 4, title: '失眠困扰', text: '连续两周失眠，凌晨三四点还睁着眼。白天昏昏沉沉，工作效率直线下降，老婆说你"再这样要猝死了"。', choices: [
    { text: '去医院开助眠药物', effects: {wealth: -10, body: 1, mentalPressure: 1, risk: 1} },
    { text: '调整作息戒掉熬夜习惯', effects: {body: 2, mentalPressure: -1, integrity: 2, desire: -1} },
    { text: '运动锻炼改善睡眠', effects: {body: 2, mentalPressure: -2, wealth: -5} },
    { text: '睡前冥想放松心情', effects: {mentalPressure: -2, body: 1, eq: 1, iq: 1} }
  ]},
  { id: 'enl075', stage: 'life', eventType: 'choice', weight: 3, title: '心理咨询（朋友推荐）', text: '朋友推荐了一位心理咨询师，说"聊聊能解压"。你犹豫——去做心理咨询，会不会被人说"有病"？', choices: [
    { text: '勇敢尝试心理咨询', effects: {mentalPressure: -3, eq: 1, integrity: 2, wealth: -20, iq: 1} },
    { text: '先看书自助调节', effects: {mentalPressure: -1, iq: 2, wealth: -5, integrity: 1} },
    { text: '向朋友倾诉释放压力', effects: {mentalPressure: -2, eq: 1, background: 1} },
    { text: '硬扛不愿承认问题', effects: {mentalPressure: -3, body: -1, integrity: -1, risk: 2} }
  ]},

  // ====== 日常消费类（25个） ======
  { id: 'enl076', stage: 'life', eventType: 'choice', weight: 5, title: '买房抉择', text: '看了半年的房子，中介突然说房东急售可以便宜五万。你心动了，但首付还差一点，要借钱才能凑齐。', choices: [
    { text: '四处借钱凑首付拿下', effects: {wealth: -120, familyPressure: 3, mentalPressure: 3, desire: 2, eq: 1} }, // v2.58 数值收敛：-150 → -120（w5 高频事件）
    { text: '再观望等更好的机会', effects: {mentalPressure: 1, wealth: 0, integrity: 1, risk: 1} },
    { text: '和房东砍价再便宜点', effects: {iq: 2, wealth: -140, mentalPressure: 2, desire: 1} },
    { text: '放弃购房继续租房', effects: {mentalPressure: -1, wealth: 0, familyPressure: 2, desire: -1} }
  ]},
  { id: 'enl077', stage: 'life', eventType: 'choice', weight: 3, title: '卖房抉择', text: '有人出价想买你那套老房子，价格比预期低一些，但能快速变现。你正犹豫，中介说"现在市场不好，再等可能更跌"。', choices: [
    { text: '果断出售快速变现', effects: {wealth: 100, mentalPressure: -1, iq: 1, risk: -1} },
    { text: '再挂一段时间看行情', effects: {mentalPressure: 2, risk: 2, wealth: 0, iq: 1} },
    { text: '降价促成交快速脱手', effects: {wealth: 90, mentalPressure: 1, iq: 1} },
    { text: '不卖改租出去', effects: {wealth: 10, mentalPressure: 2, background: 1} }
  ]},
  { id: 'enl078', stage: 'life', eventType: 'choice', weight: 4, title: '房租涨价', text: '房东通知下月房租涨500，理由是"周边都涨了"。你查了一下确实如此，但收入没涨反而压力更大了。', choices: [
    { text: '接受涨价新签合同', effects: {wealth: -30, mentalPressure: 2, familyPressure: 1} },
    { text: '和房东讨价还价', effects: {iq: 2, wealth: -15, mentalPressure: 2, eq: 1} },
    { text: '搬家找更便宜的房子', effects: {wealth: -10, mentalPressure: 4, body: -1} },
    { text: '找人合租分摊房租', effects: {wealth: -10, mentalPressure: 2, eq: 1, risk: 1} }
  ]},
  { id: 'enl079', stage: 'life', eventType: 'choice', weight: 3, title: '房贷利率', text: 'LPR利率下调了，你的房贷每月能少还两百多。银行发短信问要不要"重新约定利率定价周期"。', choices: [
    { text: '选短期定价博取降息红利', effects: {iq: 2, wealth: 10, risk: 2, mentalPressure: 1} },
    { text: '选长期定价锁定低利率', effects: {iq: 1, wealth: 5, mentalPressure: -1, integrity: 1} },
    { text: '保持原合同不变', effects: {mentalPressure: -1, integrity: 1, wealth: 0} },
    { text: '提前还部分本金减负', effects: {wealth: -50, mentalPressure: -2, familyPressure: -1, iq: 1} }
  ]},
  { id: 'enl080', stage: 'life', eventType: 'choice', weight: 3, title: '车贷换新', text: '车贷还剩一年，4S店打电话说有"以旧换新"活动，可以提前还清旧贷款换新车。月供只多300。', choices: [
    { text: '换新车享受新科技', effects: {wealth: -50, desire: 2, mentalPressure: 1, familyPressure: 1} },
    { text: '把旧车贷还完再说', effects: {mentalPressure: -1, integrity: 1, wealth: -5, desire: -1} },
    { text: '提前还款减轻利息', effects: {wealth: -30, mentalPressure: -2, familyPressure: -1, iq: 1} },
    { text: '卖旧车全款买二手车', effects: {wealth: -10, mentalPressure: 2, iq: 1, risk: 2} }
  ]},
  { id: 'enl081', stage: 'life', eventType: 'choice', weight: 3, title: '老车维修', text: '开了八年的车开始频繁出问题，维修费都快赶上月供了。老婆说"换辆新的吧"，你看着存款余额心疼。', choices: [
    { text: '贷款换辆新车省心', effects: {wealth: -80, mentalPressure: 2, desire: 2, familyPressure: 1} },
    { text: '买辆可靠的中古车', effects: {wealth: -40, mentalPressure: 1, iq: 1, risk: 1} },
    { text: '继续维修凑合开', effects: {wealth: -15, mentalPressure: 2, body: -1, risk: 2} },
    { text: '换新能源车享补贴', effects: {wealth: -100, desire: 1, mentalPressure: 1, reputation: 1} }
  ]},
  { id: 'enl082', stage: 'life', eventType: 'choice', weight: 3, title: '摇号中签', text: '摇号三年终于中签了！但指标只有半年有效期。你还没想好买什么车，又怕白白浪费这个难得的指标。', choices: [
    { text: '赶紧买辆代步车保指标', effects: {wealth: -80, mentalPressure: 2, desire: 1, iq: -1} },
    { text: '买辆便宜二手车占指标', effects: {wealth: -20, mentalPressure: 1, iq: 1, risk: 1} },
    { text: '租指标给别人赚差价', effects: {risk: 4, wealth: 10, integrity: -2, mentalPressure: 2} },
    { text: '放弃指标继续等下次', effects: {mentalPressure: 1, integrity: 1, wealth: 0, desire: -1} }
  ]},
  { id: 'enl083', stage: 'life', eventType: 'choice', weight: 3, title: '装修超支', text: '装修预算一超再超，木工说要加钱才能用更好的板材，瓦工说要加钱才能贴异形砖。老婆的眉头越皱越紧。', choices: [
    { text: '关键项目追加预算', effects: {wealth: -30, mentalPressure: 2, desire: 1, familyPressure: 1} },
    { text: '坚持预算砍掉次要项目', effects: {integrity: 2, mentalPressure: 2, familyPressure: 1, wealth: -5} },
    { text: '换便宜材料凑合用', effects: {wealth: 10, mentalPressure: 1, risk: 2, desire: -1} },
    { text: '自己动手做部分项目', effects: {body: -1, mentalPressure: 3, wealth: -10, iq: 1} }
  ]},
  { id: 'enl084', stage: 'life', eventType: 'choice', weight: 3, title: '买家具', text: '家具城搞活动，看中一套实木沙发，原价两万现价一万二。老婆说"打折也要一万多啊"，但你确实心动。', choices: [
    { text: '果断下单趁活动省钱', effects: {wealth: -12, desire: 1, mentalPressure: 1, eq: 1} },
    { text: '再比比价不急一时', effects: {iq: 2, mentalPressure: 1, wealth: 0, integrity: 1} },
    { text: '买便宜点的布艺沙发', effects: {wealth: -5, mentalPressure: -1, desire: -1, integrity: 1} },
    { text: '上网买同款便宜一半', effects: {wealth: -6, risk: 2, mentalPressure: 2, iq: 1} }
  ]},
  { id: 'enl085', stage: 'life', eventType: 'choice', weight: 3, title: '双十一冰箱', text: '双十一家电大促，看中的冰箱比平时便宜800。但家里冰箱还能用，只是款式旧了点、容量小了点。', choices: [
    { text: '趁促销换新冰箱', effects: {wealth: -20, desire: 1, mentalPressure: 1, eq: 1} },
    { text: '旧的能用就不换', effects: {integrity: 2, wealth: 0, mentalPressure: -1, desire: -1} },
    { text: '买个大容量冰柜补充', effects: {wealth: -10, mentalPressure: 1, desire: 1} },
    { text: '等搬家时再一起换', effects: {mentalPressure: -1, wealth: 0, iq: 1, integrity: 1} }
  ]},
  { id: 'enl086', stage: 'life', eventType: 'choice', weight: 4, title: '购物车后悔', text: '双十一购物车塞了五千多的东西，付款时手有点抖。买完后又开始后悔——好像很多东西其实不需要。', choices: [
    { text: '该买的买冲动消费退掉', effects: {integrity: 2, wealth: -20, mentalPressure: 1, iq: 1} },
    { text: '全部留下反正便宜', effects: {wealth: -50, mentalPressure: 2, desire: 2, familyPressure: 1} },
    { text: '认真比价保留必需品', effects: {iq: 2, wealth: -15, mentalPressure: 2, integrity: 1} },
    { text: '明年再说清空购物车', effects: {wealth: 0, mentalPressure: 1, desire: -2, integrity: 1} }
  ]},
  { id: 'enl087', stage: 'life', eventType: 'choice', weight: 3, title: '直播间冲动', text: '直播间主播声嘶力竭地喊"最后30秒！"你被氛围感染，差点下单一个"限定款"手表。理智和冲动在打架。', choices: [
    { text: '冲动下单抢限定款', effects: {wealth: -30, desire: 2, mentalPressure: 2, risk: 1} },
    { text: '冷静三思后放弃', effects: {integrity: 2, mentalPressure: -1, wealth: 0, desire: -1} },
    { text: '截图去其他平台比价', effects: {iq: 2, wealth: -20, mentalPressure: 1} },
    { text: '加购物车等第二天再决定', effects: {mentalPressure: -1, integrity: 1, wealth: 0, iq: 1} }
  ]},
  { id: 'enl088', stage: 'life', eventType: 'choice', weight: 3, title: '理财暴雷', text: '朋友介绍的"高收益理财"暴雷了，平台跑路，你投的五万块打了水漂。朋友也在哭，说"自己也被骗了"。', choices: [
    { text: '立即报警追讨损失', effects: {integrity: 2, mentalPressure: 3, risk: 1, wealth: -50} },
    { text: '联合受害者集体维权', effects: {eq: 1, mentalPressure: 3, background: 1, wealth: -50} },
    { text: '自认倒霉吸取教训', effects: {mentalPressure: 3, iq: 2, wealth: -50, integrity: 1} },
    { text: '找朋友理论要赔偿', effects: {eq: -2, mentalPressure: 3, familyPressure: 1, wealth: -50} }
  ]},
  { id: 'enl089', stage: 'life', eventType: 'choice', weight: 3, title: '基金亏损', text: '买的基金最近一个月亏了20%，账户一片绿。理财群有人说"加仓摊薄成本"，有人说"割肉止损"。', choices: [
    { text: '逆势加仓等待反弹', effects: {wealth: -20, risk: 3, mentalPressure: 3, desire: 1, iq: -1} },
    { text: '果断止损保住本金', effects: {wealth: -20, mentalPressure: 1, integrity: 1, iq: 1} },
    { text: '持有不动等长期回本', effects: {mentalPressure: 2, wealth: -20, risk: 2, integrity: 1} },
    { text: '转换成稳健型基金', effects: {iq: 1, wealth: -20, mentalPressure: 1, risk: -1} }
  ]},
  { id: 'enl090', stage: 'life', eventType: 'choice', weight: 3, title: '股票套牢', text: '持有的股票被套牢两年了，最近涨了一些但还是亏损20%。是卖掉认赔，还是继续等解套？', choices: [
    { text: '逢高减仓降低风险', effects: {wealth: -15, mentalPressure: -1, iq: 1, integrity: 1} },
    { text: '继续持有等解套', effects: {mentalPressure: 2, wealth: -20, risk: 2, desire: 1} },
    { text: '全部清仓认赔离场', effects: {wealth: -20, mentalPressure: -2, integrity: 1, iq: 1} },
    { text: '调仓换股搏一把', effects: {wealth: -20, risk: 3, mentalPressure: 3, desire: 2} }
  ]},
  { id: 'enl091', stage: 'life', eventType: 'choice', weight: 3, title: '保险人情单', text: '老同学做保险了，拉着你说"这款重疾险非常适合你"。产品看起来不错，但保费不便宜，又是人情单。', choices: [
    { text: '碍于情面买一份', effects: {wealth: -40, eq: 1, mentalPressure: 1, risk: -2, integrity: 1} },
    { text: '理性分析后果断拒绝', effects: {integrity: 2, mentalPressure: 2, eq: -1, wealth: 0} },
    { text: '比较其他公司产品再决定', effects: {iq: 2, mentalPressure: 1, wealth: -30, risk: -2} },
    { text: '买便宜点的意外险代替', effects: {wealth: -5, eq: 1, mentalPressure: 1, risk: -1} }
  ]},
  { id: 'enl092', stage: 'life', eventType: 'choice', weight: 3, title: '信用卡账单', text: '信用卡账单出来了，本期应还两万多。最低还款只要两千多，但利息高得吓人。', choices: [
    { text: '全额还款避免利息', effects: {wealth: -20, mentalPressure: 1, integrity: 2, iq: 1} },
    { text: '最低还款先缓一缓', effects: {wealth: -22, mentalPressure: 2, risk: 1, desire: 1} },
    { text: '分期还款减轻压力', effects: {wealth: -21, mentalPressure: 1, risk: 1, iq: 1} },
    { text: '借新还旧拆东墙补西墙', effects: {risk: 4, mentalPressure: 3, wealth: -23, integrity: -2} }
  ]},
  { id: 'enl093', stage: 'life', eventType: 'choice', weight: 3, title: '花呗分期', text: '花呗额度又涨了，这个月用了八千多，账单分12期还。算了一下总利息，吓了一跳。', choices: [
    { text: '提前还款省利息', effects: {wealth: -40, mentalPressure: -1, integrity: 1, iq: 1} },
    { text: '继续分期缓解压力', effects: {wealth: -42, mentalPressure: 1, risk: 1, desire: 1} },
    { text: '关闭花呗避免透支', effects: {integrity: 2, mentalPressure: 1, desire: -2, wealth: -40} },
    { text: '调整额度控制消费', effects: {integrity: 1, mentalPressure: 1, wealth: -41, iq: 1} }
  ]},
  { id: 'enl094', stage: 'life', eventType: 'choice', weight: 3, title: '分期买手机', text: '商场导购热情推荐"零利息分期"购买新款手机，只要付一点手续费。你心动了，旧手机确实该换了。', choices: [
    { text: '分期购买新款手机', effects: {wealth: -30, desire: 2, mentalPressure: 1, risk: 1} },
    { text: '全款购买享受折扣', effects: {wealth: -28, mentalPressure: 1, integrity: 1, desire: 1} },
    { text: '买上一代旗舰更划算', effects: {wealth: -15, iq: 1, mentalPressure: -1, desire: 1} },
    { text: '旧手机再用一年再说', effects: {integrity: 2, wealth: 0, mentalPressure: 1, desire: -1} }
  ]},
  { id: 'enl095', stage: 'life', eventType: 'choice', weight: 3, title: '换手机攀比', text: '同事新换了iPhone，朋友圈晒得风生水起。你看了看自己用了两年的手机，突然觉得"该换了"。', choices: [
    { text: '跟风换最新款', effects: {wealth: -50, desire: 2, mentalPressure: 2, eq: 1} },
    { text: '按需换性价比机型', effects: {wealth: -20, mentalPressure: -1, integrity: 1, iq: 1} },
    { text: '不换手机壳换新颜', effects: {wealth: -2, mentalPressure: -1, integrity: 2, desire: 1} },
    { text: '等促销活动再出手', effects: {mentalPressure: 1, integrity: 1, wealth: 0, iq: 1} }
  ]},
  { id: 'enl096', stage: 'life', eventType: 'choice', weight: 3, title: '极简生活', text: '看完一篇"极简生活"的文章，你被深深触动。看着满屋子的东西，突然想全部清理掉，过简单生活。', choices: [
    { text: '断舍离扔掉多余物品', effects: {mentalPressure: -2, integrity: 2, eq: 1, desire: -2} },
    { text: '闲鱼卖掉闲置回血', effects: {wealth: 10, mentalPressure: 1, iq: 1} },
    { text: '捐赠给有需要的人', effects: {integrity: 3, reputation: 1, mentalPressure: -1, wealth: -5} },
    { text: '只是想想该买还买', effects: {mentalPressure: 1, integrity: -1, desire: 1} }
  ]},
  { id: 'enl097', stage: 'life', eventType: 'choice', weight: 3, title: '名牌包', text: '老婆看中一个名牌包，标价两万。她说"攒了这么久总该犒劳自己一次"，你看着存款数字有些心疼。', choices: [
    { text: '咬牙买下满足老婆心愿', effects: {wealth: -20, eq: 2, familyPressure: -2, desire: 1, mentalPressure: 2} },
    { text: '买A货样子差不多', effects: {wealth: -2, risk: 2, integrity: -2, eq: 1} },
    { text: '建议买轻奢品牌替代', effects: {wealth: -8, eq: 1, iq: 1, mentalPressure: 1} },
    { text: '等纪念日再买作礼物', effects: {mentalPressure: 1, eq: 1, integrity: 1, desire: 1} }
  ]},
  { id: 'enl098', stage: 'life', eventType: 'choice', weight: 3, title: '代购疑虑', text: '朋友圈有人做代购，声称"专柜正品、价格优惠"。你看了下价格确实比专柜便宜三成，但又怕是假货。', choices: [
    { text: '找代购买省钱', effects: {wealth: -15, risk: 3, desire: 1, mentalPressure: 2} },
    { text: '专柜买图个放心', effects: {wealth: -20, integrity: 1, mentalPressure: -1, eq: 1} },
    { text: '让朋友海外带回', effects: {wealth: -15, eq: 1, risk: 1, background: 1} },
    { text: '等免税店活动再买', effects: {mentalPressure: 1, wealth: -16, iq: 1, integrity: 1} }
  ]},
  { id: 'enl099', stage: 'life', eventType: 'choice', weight: 3, title: '闲鱼交易', text: '闲鱼上有人低价卖你想要的相机，描述99新。你私信对方，对方要求先款后货，说"信誉很好放心"。', choices: [
    { text: '走平台担保交易', effects: {wealth: -30, risk: 1, iq: 2, mentalPressure: 1, desire: 1} },
    { text: '直接转账搏个便宜', effects: {wealth: -28, risk: 5, desire: 2, mentalPressure: 3} },
    { text: '同城面交验货再付款', effects: {wealth: -30, risk: -1, body: -1, iq: 1, integrity: 1} },
    { text: '放弃买新的更安心', effects: {wealth: -50, mentalPressure: -1, integrity: 1, desire: 1} }
  ]},
  { id: 'enl100', stage: 'life', eventType: 'choice', weight: 3, title: '奶粉到货', text: '海外代购的奶粉到货了，但包装有挤压痕迹。孩子等着喝，退换货又要等半个月，你左右为难。', choices: [
    { text: '检查无破损继续使用', effects: {wealth: -15, mentalPressure: 1, risk: 1, integrity: 1} },
    { text: '坚决退换货保安全', effects: {wealth: -15, mentalPressure: 2, risk: -2, iq: 1} },
    { text: '找代购理论要求补偿', effects: {eq: 1, mentalPressure: 2, wealth: -10, risk: 1} },
    { text: '先买国产奶粉应急', effects: {wealth: -20, mentalPressure: 1, risk: -1, iq: 1} }
  ]}
,
// ================= v2.1.9 内容扩充（enl101-enl114）：生活场景 + 联系人深度 =================
  { id: 'enl101', stage: 'life', eventType: 'choice', weight: 4, title: '学区房抉择', text: '孩子到了上学年龄，学区房的事被正式提上议程。中介推荐的房子比预算贵四十万，不买又怕耽误孩子。夜里你和伴侣把账算到凌晨。', choices: [
    { text: '咬牙凑首付买下', effects: {wealth: -80, familyPressure: -4, mentalPressure: 3, background: 1} },
    { text: '选择公办学校就近入学', effects: {wealth: -10, mentalPressure: 1, familyPressure: 1} },
    { text: '先租房过渡再观望', effects: {wealth: -20, mentalPressure: 2, familyPressure: 1} },
    { text: '请双方老人帮忙凑首付', effects: {background: 2, familyPressure: 2, mentalPressure: 1} },
  ]},
  { id: 'enl102', year: [30, 65], stage: 'life', eventType: 'choice', weight: 4, title: '父母的养老', text: '父母年纪大了，身体开始出各种小毛病。老家离你所在的城市四小时车程，他们坚持不肯搬来："不能拖累你们。"', choices: [
    { text: '常回去看看，尽量多陪', effects: {familyPressure: -3, mentalPressure: 2, body: -1, eq: 1} },
    { text: '接他们来城里住一段时间', effects: {familyPressure: -2, mentalPressure: 2, wealth: -10} },
    { text: '请老家亲戚帮忙照看', effects: {wealth: -10, familyPressure: -1, mentalPressure: 1} },
    { text: '给父母请个居家护工', effects: {wealth: -20, familyPressure: -2, mentalPressure: -1} },
  ]},
  { id: 'enl103', stage: 'life', eventType: 'choice', weight: 3, title: '体检报告（指标飘红）', text: '单位年度体检报告出来，几项指标飘红：血脂、尿酸、脂肪肝。体检医生看了你一眼："工作再忙，身体是自己的。"', choices: [
    { text: '开始健身，控制饮食', effects: {body: 3, mentalPressure: -2, wealth: -5} },
    { text: '调整作息，减少熬夜', effects: {body: 2, workAbility: -1, mentalPressure: -1} },
    { text: '预约复查，认真对待', effects: {body: 1, mentalPressure: 1, wealth: -10} },
    { text: '不当回事，继续拼命', effects: {body: -1, workAbility: 1, risk: 1} },
  ]},
  { id: 'enl104', stage: 'life', eventType: 'choice', weight: 3, requireSingle: true, year: [26, 45], title: '相亲市场的行情', text: '朋友把一份"相亲简历"发给你看，说帮你挂在了本地相亲平台。简历上你的条件写得不错，但对方特别标注："体制内优先，最好有车有房。"', choices: [
    { text: '认真查看，准备见面', effects: {eq: 1, mentalPressure: 1, desire: 1, flag: 'dating'} },
    { text: '觉得条件交换太直白，反感', effects: {eq: -1, mentalPressure: 1} },
    { text: '先提高自己再考虑相亲', effects: {workAbility: 1, desire: 2, mentalPressure: 1} },
    { text: '让朋友把要求改得更真诚', effects: {eq: 1, integrity: 1} },
  ]},
  { id: 'enl105', stage: 'life', eventType: 'auto', weight: 3, title: '老家的喜事', text: '老家堂哥的儿子考上大学，摆了流水席。你随了份子，席间长辈们说"还是你混得好，进了体制"。你笑了笑，没说自己加班到凌晨的日子。', effects: {familyPressure: -2, background: 1, mentalPressure: -1, eq: 1} },
  { id: 'enl106', stage: 'life', eventType: 'choice', weight: 3, requireContact: 'qingmei', requireContactMin: 30, year: [26, 50], title: '青梅的求助', text: '青梅竹马的苏晓来找你，说她弟弟找工作四处碰壁，想让你"帮忙看看有没有门路"。你们从小一起长大，她很少开口求人。', choices: [
    { text: '帮看正规招聘信息，指导备考', effects: {eq: 2, integrity: 2, workAbility: 1, contactRelation: { id: 'qingmei', delta: 10 } } },
    { text: '托熟人问问有没有机会', effects: {background: 1, risk: 2, eq: 1, contactRelation: { id: 'qingmei', delta: 10 } } },
    { text: '婉拒，说帮不上忙', effects: {eq: -1, contactRelation: { id: 'qingmei', delta: -10 } } },
    { text: '建议她弟弟先考编试试', effects: {workAbility: 1, integrity: 1, contactRelation: { id: 'qingmei', delta: 5 } } },
  ]},
  { id: 'enl107', stage: 'life', eventType: 'choice', weight: 3, requireContact: 'banker', requireContactMin: 40, year: [28, 55], title: '银行行长的茶叙', text: '银行行长约你喝茶，聊起他行里新推的"公务卡增值服务"。你听得出，他想把你发展成"优质客户"。茶很香，话很软。', choices: [
    { text: '婉拒增值服务，保持距离', effects: {integrity: 2, risk: -1, contactRelation: { id: 'banker', delta: -5 } } },
    { text: '了解清楚条款再决定', effects: {iq: 1, workAbility: 1, contactRelation: { id: 'banker', delta: 5 } } },
    { text: '欣然接受，经营人脉', effects: {background: 1, risk: 2, contactRelation: { id: 'banker', delta: 10 } } },
    { text: '借机请教理财知识', effects: {iq: 2, contactRelation: { id: 'banker', delta: 5 } } },
  ]},
  { id: 'enl108', stage: 'life', eventType: 'choice', weight: 4, title: '老同学追悼会', text: '当年一起考公的老同学走了，突发心梗，才四十出头。追悼会现场，同学们沉默着交换眼神——谁都明白，下一个可能是任何人。', choices: [
    { text: '认真告别，回来后调整生活方式', effects: {body: 2, mentalPressure: -2, eq: 1, workAbility: -1} },
    { text: '感叹人生无常，更抓紧工作', effects: {workAbility: 2, desire: 1, mentalPressure: 2, body: -1} },
    { text: '沉默不语，心里堵得慌', effects: {mentalPressure: 3, body: -1} },
    { text: '给老同学家人搭把手', effects: {eq: 2, reputation: 1, mentalPressure: 2} },
  ]},
  { id: 'enl109', stage: 'life', eventType: 'choice', weight: 3, title: '装修那些事', text: '新房装修进入尾声，包工头又打电话来："老板，防水材料得加钱换，不然以后楼下找您麻烦。"你分不清这是真问题还是加价话术。', choices: [
    { text: '亲自去工地核实材料', effects: {iq: 1, wealth: -5, mentalPressure: 1} },
    { text: '同意加钱换好材料', effects: {wealth: -15, mentalPressure: -2, familyPressure: -1} },
    { text: '坚持按合同执行', effects: {eq: -1, mentalPressure: 2, wealth: -5} },
    { text: '请懂行的朋友把关', effects: {eq: 1, iq: 1, wealth: -5} },
  ]},
  { id: 'enl110', stage: 'life', eventType: 'auto', weight: 3, title: '小区里的温暖', text: '楼下的快递驿站老板认出了你，每次取件都多聊两句。有天他塞给你一把自家种的青菜："看你总加班，年轻人要按时吃饭。"你愣在原地，点了点头。', effects: {mentalPressure: -2, eq: 1, peopleReputation: 1} },
  { id: 'enl111', stage: 'life', eventType: 'choice', weight: 4, requireMarried: true, title: '纪念日计划', text: '结婚纪念日快到了，伴侣嘴上说"都老夫老妻了"，可你翻到她收藏夹里那条项链的链接——在购物车里躺了半年。', choices: [
    { text: '悄悄买下项链给她惊喜', effects: {wealth: -20, familyPressure: -3, eq: 2} },
    { text: '订一家好的餐厅重温约会', effects: {wealth: -10, familyPressure: -2, eq: 2} },
    { text: '亲手做一顿饭写封信', effects: {wealth: -3, familyPressure: -2, eq: 2, integrity: 1} },
    { text: '加班太忙，改天补过', effects: {familyPressure: 3, mentalPressure: 1, eq: -1} },
  ]},
  { id: 'enl112', stage: 'life', eventType: 'choice', weight: 3, title: '中年考证热', text: '单位里掀起考证热：法考、注会、经济师。四十岁的老张报了法考，说你"再不考就老了"。你翻开教材，第一页全是陌生的名词。', choices: [
    { text: '报名，逼自己一把', effects: {iq: 2, workAbility: 1, mentalPressure: 3, body: -1} },
    { text: '评估实用性再决定', effects: {iq: 1, mentalPressure: 1} },
    { text: '不考，专注本职工作', effects: {workAbility: 1, mentalPressure: -1, desire: -1} },
    { text: '和同事组队备考互相监督', effects: {iq: 1, eq: 1, mentalPressure: 2} },
  ]},
  { id: 'enl113', stage: 'life', eventType: 'choice', weight: 3, requireSingle: true, year: [28, 45], title: '催婚的电话', text: '母亲的电话又来了，语气从催促变成哀求："隔壁老王的孙子都会打酱油了，你什么时候让妈抱上孙子？"电话那头，她咳了两声。', choices: [
    { text: '耐心听完，说会认真考虑', effects: {eq: 1, familyPressure: 2, mentalPressure: 1} },
    { text: '转移话题，聊她的身体', effects: {eq: 1, familyPressure: -1} },
    { text: '不耐烦地挂断电话', effects: {familyPressure: 3, eq: -1, mentalPressure: 1} },
    { text: '答应她年底前相亲几次', effects: {familyPressure: -2, mentalPressure: 2, desire: 1} },
  ]},
  { id: 'enl114', stage: 'life', eventType: 'auto', weight: 3, title: '单位楼下的煎饼摊', text: '单位楼下的煎饼摊阿姨认识你十年了，看你今天脸色不好，多给你加了个蛋："年轻人，别把啥都扛着。"你低头咬了一口，忽然觉得眼眶有点热。', effects: {mentalPressure: -2, eq: 1, body: 1} },
  // ================= v2.1.10 内容扩充（enl115-enl126）：生活主题 + 联系人深度 =================
  { id: 'enl115', stage: 'life', eventType: 'choice', weight: 4, title: '车位之争（占位风波）', text: '小区车位紧张，你租的车位被人占了。打电话过去，对方是个刚搬来的年轻妈妈，声音带着哭腔："孩子发烧，实在找不到地方停……"', choices: [
    { text: '体谅她，找其他位置停', effects: {eq: 2, mentalPressure: -1, integrity: 1} },
    { text: '让她尽快挪走，语气客气但坚定', effects: {eq: 1, mentalPressure: 1} },
    { text: '拍下占位照片发业主群', effects: {eq: -1, mentalPressure: 1, reputation: -1} },
    { text: '建议物业加装道闸管理', effects: {workAbility: 1, iq: 1, mentalPressure: 1} },
  ]},
  { id: 'enl116', stage: 'life', eventType: 'choice', weight: 3, title: '深夜的便利店', text: '加班到深夜，楼下便利店是你唯一的夜宵据点。店员小哥已经认识你了，今天多问了一句："哥，又加班啊？"你看着货架上的泡面，忽然不知道选哪个口味。', choices: [
    { text: '买份关东煮，暖胃也暖心', effects: {body: 1, mentalPressure: -2, eq: 1} },
    { text: '随便拿桶泡面回去', effects: {body: -1, mentalPressure: 1} },
    { text: '和他聊两句再走', effects: {eq: 1, mentalPressure: -2} },
    { text: '什么都不买，直接回家', effects: {body: -1, mentalPressure: 1} },
  ]},
  { id: 'enl117', stage: 'life', eventType: 'choice', weight: 3, requireContact: 'chamber', requireContactMin: 40, year: [28, 55], title: '商会会长的邀约', text: '商会孙会长打来电话，说周末有个"老乡企业家联谊"，想请你出席。"都是家乡人，帮衬帮衬。"他语气热情，你想起他递名片时那副黑白通吃的做派。', choices: [
    { text: '出席，但只寒暄不谈事', effects: {eq: 1, background: 1, risk: 1, contactRelation: { id: 'chamber', delta: 5 } } },
    { text: '婉拒，说周末有安排', effects: {integrity: 1, contactRelation: { id: 'chamber', delta: -5 } } },
    { text: '出席，借机认识些企业家', effects: {background: 2, desire: 1, risk: 2, contactRelation: { id: 'chamber', delta: 10 } } },
    { text: '带位同事一起出席', effects: {eq: 1, risk: 1, contactRelation: { id: 'chamber', delta: 3 } } },
  ]},
  { id: 'enl118', stage: 'life', eventType: 'choice', weight: 3, requireContact: 'veteran', requireContactMin: 40, year: [28, 55], title: '老兵的家事', text: '老战友吴哥请喝酒，酒过三巡说起儿子复员后工作没着落。"你是体制内的人，帮我看看有没有门路。"他第一次求你，眼神里有为难。', choices: [
    { text: '帮看正规招录信息，指导准备', effects: {eq: 2, integrity: 2, workAbility: 1, contactRelation: { id: 'veteran', delta: 10 } } },
    { text: '托战友圈打听机会', effects: {background: 1, risk: 2, contactRelation: { id: 'veteran', delta: 10 } } },
    { text: '建议走退役军人安置渠道', effects: {workAbility: 1, integrity: 1, contactRelation: { id: 'veteran', delta: 5 } } },
    { text: '推脱说帮不上忙', effects: {eq: -1, contactRelation: { id: 'veteran', delta: -10 } } },
  ]},
  { id: 'enl119', stage: 'life', eventType: 'choice', weight: 3, requireContact: 'elder', requireContactMin: 50, year: [30, 60], title: '钱老的棋局', text: '退休老书记钱老约你下棋。棋盘上他攻势凌厉，嘴上却聊着别的事："听说你们单位最近有动作？我当年在这个位置上的时候……"你听出他想套话。', choices: [
    { text: '专注下棋，聊家常不谈单位事', effects: {eq: 2, integrity: 1, contactRelation: { id: 'elder', delta: 5 } } },
    { text: '陪他聊，拣能说的说', effects: {eq: 1, background: 1, risk: 1, contactRelation: { id: 'elder', delta: 5 } } },
    { text: '借棋局向他请教处世之道', effects: {iq: 1, eq: 1, background: 1, contactRelation: { id: 'elder', delta: 10 } } },
    { text: '推说棋艺不精，改日再约', effects: {contactRelation: { id: 'elder', delta: -5 }, mentalPressure: -1} },
  ]},
  { id: 'enl120', stage: 'life', eventType: 'choice', weight: 4, title: '父亲的电话', text: '父亲打来电话，说了三句话：吃饭了没、最近忙不忙、什么时候回家。挂了电话你才想起来，上次回家已经是三个月前。', choices: [
    { text: '周末买票回家一趟', effects: {familyPressure: -3, wealth: -5, eq: 1, mentalPressure: -2} },
    { text: '多打视频电话常联系', effects: {familyPressure: -2, eq: 1} },
    { text: '寄点保健品回去', effects: {wealth: -10, familyPressure: -1} },
    { text: '忙完这阵子再说', effects: {familyPressure: 2, mentalPressure: 1} },
  ]},
  { id: 'enl121', stage: 'life', eventType: 'auto', weight: 3, title: '菜市场的熟人', text: '菜市场卖菜的大姐认出了你，多塞了两根葱："当干部的也吃人间烟火。"你拎着菜回家，觉得这话比很多讲话稿都实在。', effects: {mentalPressure: -2, eq: 1, peopleReputation: 1} },
  { id: 'enl122', stage: 'life', eventType: 'choice', weight: 4, requireMarried: true, title: '二胎的再讨论', text: '父母又提起二胎："一个孩子太孤单了，趁年轻再生一个。"伴侣低头没说话，你们的经济账和精力账都在心里翻涌。', choices: [
    { text: '和父母坦诚沟通现实压力', effects: {eq: 2, familyPressure: -2, integrity: 1} },
    { text: '顺其自然，不设限', effects: {familyPressure: -1, mentalPressure: 1} },
    { text: '明确表示暂不考虑', effects: {familyPressure: 2, mentalPressure: 1, eq: -1} },
    { text: '和伴侣商量后统一口径', effects: {eq: 2, familyPressure: -1} },
  ]},
  { id: 'enl123', stage: 'life', eventType: 'choice', weight: 3, title: '体检加项', text: '单位体检项目里有几个自费加项：肠胃镜、CT、基因检测。同事说"查了放心"，也有人说"都是割韭菜"。你看着费用清单，有点犹豫。', choices: [
    { text: '做肠胃镜，图个安心', effects: {body: 1, wealth: -15, mentalPressure: -1} },
    { text: '只做基础项目', effects: {wealth: -5, body: -1} },
    { text: '全做，全面排查', effects: {body: 2, wealth: -30, mentalPressure: -2} },
    { text: '问医生哪些有必要', effects: {iq: 1, body: 1, wealth: -10} },
  ]},
  { id: 'enl124', stage: 'life', eventType: 'auto', weight: 3, title: '雨天的顺风车', text: '下班突降暴雨，你在公交站台躲雨，看见同事小李抱着孩子也在等车。你主动说"我送你们一程"。雨很大，车里很暖。', effects: {eq: 2, reputation: 1, familyPressure: -1} },
  { id: 'enl125', stage: 'life', eventType: 'choice', weight: 3, requireSingle: true, year: [24, 45], title: '朋友介绍的相亲', text: '朋友介绍了个对象，条件不错，说是"高知家庭，人也踏实"。你加了好友，对方第一句问的是："你们体制内是不是很闲？"', choices: [
    { text: '幽默回应，约线下见面', effects: {eq: 2, desire: 1, flag: 'dating', mentalPressure: 1} },
    { text: '认真解释体制内的工作强度', effects: {integrity: 2, eq: 1} },
    { text: '觉得对方不了解你，作罢', effects: {mentalPressure: -1, desire: -1} },
    { text: '慢慢聊，不急着见面', effects: {eq: 1, mentalPressure: -1} },
  ]},
  { id: 'enl126', stage: 'life', eventType: 'auto', weight: 3, title: '孩子的作文', text: '孩子写了篇作文《我的爸爸》：爸爸很忙，但他答应我的事都会做到。你翻到结尾，看到一行小字："虽然爸爸很少接我放学，但我还是最喜欢爸爸。"', effects: {familyPressure: -3, mentalPressure: -2, eq: 2, integrity: 1} },
  // ================= v2.1.11 内容扩充（enl127-enl142）：生活主题 + 联系人深度 =================
  { id: 'enl127', stage: 'life', eventType: 'choice', weight: 4, title: '房贷利率调整', text: '房贷利率又要调整的消息传得沸沸扬扬。你查了银行公告，发现可以申请转贷省一笔利息，但手续麻烦、还可能耽误几个月。你算了三遍，发现省下的钱够孩子一年补习费。', choices: [
    { text: '认真办理转贷，能省则省', effects: {wealth: 15, mentalPressure: 2, iq: 1} },
    { text: '嫌麻烦，维持现状', effects: {mentalPressure: -1, wealth: -5} },
    { text: '咨询理财顾问再决定', effects: {iq: 1, wealth: 5, mentalPressure: 1} },
    { text: '先观望政策走向', effects: {mentalPressure: 1, wealth: -3} },
  ]},
  { id: 'enl128', stage: 'life', eventType: 'choice', weight: 3, title: '老家的房子', text: '老家那间老屋屋顶漏雨，父亲打电话说想翻修。你算了下，翻修要五六万，够全家半年生活费。父亲说"不急"，但你知道他每次下雨都睡不踏实。', choices: [
    { text: '汇钱回去翻修', effects: {wealth: -50, familyPressure: -3, mentalPressure: -2, eq: 1} },
    { text: '先寄部分，再想办法', effects: {wealth: -25, familyPressure: -1, mentalPressure: 1} },
    { text: '让父母搬来城里住', effects: {familyPressure: -2, mentalPressure: 2, wealth: -10} },
    { text: '建议村里统一改造政策', effects: {iq: 1, familyPressure: 1} },
  ]},
  { id: 'enl129', stage: 'life', eventType: 'auto', weight: 3, title: '超市的巧遇', text: '超市结账时，前面的大爷掏出一叠皱巴巴的零钱数了半天。收银员不耐烦地啧了一声，你默默把自己的购物车让到一边，帮他数完硬币。他回头朝你笑："小伙子，心善。"', effects: {eq: 2, mentalPressure: -1, peopleReputation: 1} },
  { id: 'enl130', stage: 'life', eventType: 'choice', weight: 3, title: '孩子的兴趣班', text: '孩子说想学编程，你说"以后考个公务员多稳定"。孩子反问："那你自己怎么不去学编程？"你愣住了——是啊，凭什么孩子要替你圆梦。', choices: [
    { text: '支持他报兴趣班', effects: {wealth: -15, familyPressure: -2, eq: 1} },
    { text: '先试听再决定', effects: {wealth: -5, familyPressure: -1, eq: 1} },
    { text: '坚持让他学传统科目', effects: {familyPressure: 2, eq: -1, mentalPressure: 1} },
    { text: '和孩子一起学，共同进步', effects: {iq: 1, eq: 2, familyPressure: -2} },
  ]},
  { id: 'enl131', stage: 'life', eventType: 'choice', weight: 3, requireContact: 'sizhang', requireContactMin: 40, year: [26, 55], title: '司长的电话', text: '曾经的老领导司长打电话来，说他侄女今年毕业，想考你们单位。"你帮看看备考方向。"他语气随意，你听得出分量。', choices: [
    { text: '热情指点备考方向', effects: {eq: 2, background: 2, contactRelation: { id: 'sizhang', delta: 10 } } },
    { text: '客观介绍招考流程', effects: {integrity: 2, workAbility: 1, contactRelation: { id: 'sizhang', delta: 5 } } },
    { text: '避重就轻，不想趟浑水', effects: {risk: -1, contactRelation: { id: 'sizhang', delta: -10 } } },
    { text: '建议她先积累基层经验', effects: {workAbility: 1, integrity: 1, contactRelation: { id: 'sizhang', delta: 5 } } },
  ]},
  { id: 'enl132', stage: 'life', eventType: 'choice', weight: 3, requireContact: 'roommate', requireContactMin: 40, year: [26, 55], title: '室友的婚礼', text: '当年一起租房备考的室友要结婚了，邀请你当伴郎。他媳妇是银行职员，家境殷实，婚礼排场不小。你随份子时，他凑过来小声说："兄弟，份子钱别攀比，来了就行。"', choices: [
    { text: '按心意随份子，祝福为主', effects: {wealth: -10, eq: 2, contactRelation: { id: 'roommate', delta: 5 } } },
    { text: '多随一些，当年他帮过我', effects: {wealth: -20, eq: 1, familyPressure: 1, contactRelation: { id: 'roommate', delta: 10 } } },
    { text: '借机认识他媳妇那边的资源', effects: {background: 1, desire: 1, contactRelation: { id: 'roommate', delta: 0 } } },
    { text: '少随一点，自己日子要紧', effects: {wealth: -5, contactRelation: { id: 'roommate', delta: -5 } } },
  ]},
  { id: 'enl133', stage: 'life', eventType: 'choice', weight: 3, requireContact: 'business', requireContactMin: 40, year: [26, 55], title: '同学的办公室', text: '做生意的老同学约你参观他的新办公室，落地窗、茶台、红木桌。他泡着茶说："你看我这办公室，比你们处长还气派吧？"你笑了笑，没说你们办公室的绿萝比这红木值钱——那是大家一起养的。', choices: [
    { text: '坦然承认各有各的好', effects: {eq: 1, integrity: 1, mentalPressure: -1} },
    { text: '心里不是滋味，回家更拼工作', effects: {desire: 2, mentalPressure: 2, workAbility: 1} },
    { text: '借机聊合作机会', effects: {background: 1, risk: 2, contactRelation: { id: 'business', delta: 10 } } },
    { text: '给他讲体制内的稳定性', effects: {eq: 1, integrity: 1} },
  ]},
  { id: 'enl134', stage: 'life', eventType: 'auto', weight: 3, title: '电梯里的问候', text: '电梯里遇到楼下阿姨，她拎着菜篮子问："小X，好久没见你妈了，她身体还好吧？"你想起上周视频里母亲说膝盖疼，声音忽然有点哽："挺好，谢谢您惦记。"', effects: {familyPressure: 1, eq: 1, mentalPressure: -1} },
  { id: 'enl135', stage: 'life', eventType: 'choice', weight: 3, requireSingle: true, year: [26, 50], title: '健身房的搭讪', text: '健身房更衣室，一位大哥看你练完，递来毛巾："兄弟练得不错，加个微信？我开私教工作室的。"你犹豫了一下——不是每条人脉都该收。', choices: [
    { text: '加微信，多个朋友', effects: {eq: 1, background: 1, body: 1} },
    { text: '婉拒，说不太用社交软件', effects: {eq: -1, mentalPressure: -1} },
    { text: '问问价格，顺便请教动作', effects: {iq: 1, body: 1, wealth: -5} },
    { text: '只当普通聊天的朋友', effects: {eq: 1} },
  ]},
  { id: 'enl136', stage: 'life', eventType: 'choice', weight: 4, title: '小区的宠物', text: '邻居家的狗半夜叫个不停，妻子翻来覆去睡不着。你敲开邻居家门，对方是个独居老人，狗是去世的儿子留下的。他说"对不起，明天就送走"，眼神里满是不舍。', choices: [
    { text: '理解他，建议白天多遛狗', effects: {eq: 2, familyPressure: -2, mentalPressure: -1} },
    { text: '坚持要求解决噪音', effects: {eq: -1, familyPressure: -2} },
    { text: '提议和物业协商养犬规范', effects: {workAbility: 1, eq: 1} },
    { text: '送他一些隔音耳塞应急', effects: {wealth: -2, eq: 2, familyPressure: -1} },
  ]},
  { id: 'enl137', stage: 'life', eventType: 'auto', weight: 3, title: '地铁口的老人', text: '地铁口，一位老人拿着手机拦住你："小伙子，能帮我看看怎么用这个码吗？"你帮他弄好，他连声道谢，说女儿总没时间教他。你想起自己爸妈，教了三遍还是忘。', effects: {eq: 2, mentalPressure: -1, familyPressure: 1} },
  { id: 'enl138', stage: 'life', eventType: 'choice', weight: 3, requireContact: 'petitioner', requireContactMin: 30, year: [28, 58], title: '老上访户的转变', text: '那位你接待过多次的老上访户，今天没带材料来，而是提了一袋自家种的橘子："领导，我那事办下来了，谢谢你一直没躲着我。"你接过橘子，忽然觉得信访工作也不是白干。', choices: [
    { text: '收下橘子，聊几句近况', effects: {eq: 2, peopleReputation: 2, integrity: 1, contactRelation: { id: 'petitioner', delta: 15 } } },
    { text: '婉拒礼物，说这是分内事', effects: {integrity: 2, eq: 1, contactRelation: { id: 'petitioner', delta: 5 } } },
    { text: '提醒他以后按程序反映', effects: {workAbility: 1, integrity: 1, contactRelation: { id: 'petitioner', delta: 0 } } },
    { text: '客套几句，尽快结束', effects: {contactRelation: { id: 'petitioner', delta: -5 }, mentalPressure: -1} },
  ]},
  { id: 'enl139', stage: 'life', eventType: 'choice', weight: 3, requireContact: 'neighborHead', requireContactMin: 40, year: [26, 55], title: '楼长的请求', text: '楼栋长王姐找你帮忙："社区要搞个防诈骗宣传，你是干部，来给邻居们讲讲呗。"她补了一句："大家都信你。"你想起周末本来约了朋友钓鱼。', choices: [
    { text: '答应，认真准备讲稿', effects: {eq: 2, peopleReputation: 2, reputation: 1, familyPressure: -1} },
    { text: '答应但简化准备', effects: {eq: 1, peopleReputation: 1, mentalPressure: 1} },
    { text: '推说周末有事', effects: {eq: -1, peopleReputation: -1} },
    { text: '提议请派出所民警来讲', effects: {workAbility: 1, eq: 1} },
  ]},
  { id: 'enl140', stage: 'life', eventType: 'auto', weight: 3, title: '菜市场的行情', text: '周末逛菜市场，发现白菜从三块涨到五块。卖菜大姐说："今年雨水多，地里减产。"你掂了掂手里的袋子，觉得生活就像这菜价，起起伏伏，但总有口热饭吃。', effects: {mentalPressure: 1, familyPressure: 1, eq: 1} },
  { id: 'enl141', stage: 'life', eventType: 'choice', weight: 4, requireMarried: true, title: '体检报告（伴侣）', text: '伴侣的体检报告出来了，甲状腺结节需要复查。她嘴上说"没事"，晚上却翻来覆去。你握着报告，手心微微出汗。', choices: [
    { text: '立即预约专家号陪她复查', effects: {familyPressure: -3, mentalPressure: 2, wealth: -10, eq: 2} },
    { text: '安慰她，观察一段时间', effects: {familyPressure: -1, mentalPressure: 1} },
    { text: '查资料了解风险再决定', effects: {iq: 1, mentalPressure: 1} },
    { text: '瞒着孩子，先自己扛着', effects: {mentalPressure: 3, eq: -1} },
  ]},
  { id: 'enl142', stage: 'life', eventType: 'auto', weight: 6, contentTier: 'everyday', title: '窗外的晚霞', text: '难得准时下班，走出办公楼时正赶上晚霞。你把照片发到家庭群里，母亲秒回："下班啦？吃饭了没？"你回了个笑脸，忽然觉得这一天的疲惫都值了。', effects: {mentalPressure: -2, eq: 1, familyPressure: -1} },
  // ================= v2.1.12 内容扩充（enl143-enl160）：晚年/家庭/联系人深度 =================
  { id: 'enl143', stage: 'life', eventType: 'choice', weight: 3, title: '父母的老花镜', text: '母亲戴着老花镜缝补衣服，针脚歪歪扭扭。她说"老了，看不清了"。你想起小时候她给你缝书包，针脚密密实实。你拿起手机，下单了一副老花镜。', choices: [
    { text: '买副好眼镜，教她用手机', effects: {wealth: -5, familyPressure: -2, eq: 2} },
    { text: '周末回去陪她住两天', effects: {familyPressure: -3, eq: 2, mentalPressure: -2} },
    { text: '寄些保健品回去', effects: {wealth: -10, familyPressure: -1} },
    { text: '只发个红包让她自己买', effects: {familyPressure: 0, mentalPressure: -1} },
  ]},
  { id: 'enl144', stage: 'life', eventType: 'choice', weight: 3, title: '老同事的告别', text: '单位一位老同事退休，最后一天来办公室收拾东西。他把自己养了三年的君子兰送给你："照顾不好就送人，别让它受委屈。"你忽然意识到，有些告别是静悄悄的。', choices: [
    { text: '认真接下，请他常回来看看', effects: {eq: 2, mentalPressure: -1, reputation: 1} },
    { text: '约他退休后一起钓鱼', effects: {eq: 2, background: 1} },
    { text: '请他讲讲单位的老故事', effects: {iq: 1, eq: 1, background: 1} },
    { text: '客气告别，转头忙工作', effects: {eq: -1, workAbility: 1} },
  ]},
  { id: 'enl145', stage: 'life', eventType: 'choice', weight: 3, title: '体检后的聚餐', text: '老同学聚餐，大家聊起体检报告，一个个数字都成了话题。有人戒了酒，有人开始跑步，有人苦笑着说"医生让我少熬夜，我让医生少吓唬我"。你听着，给自己倒了杯温水。', choices: [
    { text: '跟着大家立健康目标', effects: {body: 1, eq: 1, mentalPressure: -1} },
    { text: '保持现状，顺其自然', effects: {mentalPressure: -1, body: -1} },
    { text: '拉个群互相监督打卡', effects: {body: 2, eq: 2} },
    { text: '劝大家定期体检', effects: {eq: 1, integrity: 1, body: 1} },
  ]},
  { id: 'enl146', stage: 'life', eventType: 'choice', weight: 3, requireContact: 'qingmei', requireContactMin: 50, year: [30, 55], title: '青梅的婚姻', text: '青梅竹马的苏晓约你喝咖啡，说她准备离婚了。她平静地说着财产分割和孩子抚养，你想起小时候她因为一颗糖哭鼻子的样子。窗外雨声渐密。', choices: [
    { text: '倾听陪伴，不评判', effects: {eq: 3, mentalPressure: -2, contactRelation: { id: 'qingmei', delta: 15 } } },
    { text: '帮她想孩子抚养安排', effects: {iq: 1, eq: 2, contactRelation: { id: 'qingmei', delta: 10 } } },
    { text: '劝她再考虑考虑', effects: {eq: 1, contactRelation: { id: 'qingmei', delta: -5 } } },
    { text: '推荐靠谱的律师', effects: {workAbility: 1, eq: 1, contactRelation: { id: 'qingmei', delta: 10 } } },
  ]},
  { id: 'enl147', stage: 'life', eventType: 'choice', weight: 3, requireContact: 'hometown', requireContactMin: 50, year: [30, 60], title: '老乡的喜事', text: '老乡老周的儿子考上公务员了，摆酒请客。酒桌上老周红光满面，举杯敬你："多亏你当初指点他备考。"你笑着应下，想起那小子确实来问过两回申论。', choices: [
    { text: '真心祝贺，叮嘱孩子守本分', effects: {eq: 2, integrity: 2, contactRelation: { id: 'hometown', delta: 10 } } },
    { text: '分享些体制内经验', effects: {eq: 1, workAbility: 1, contactRelation: { id: 'hometown', delta: 5 } } },
    { text: '客气应酬，不多说', effects: {eq: 1, contactRelation: { id: 'hometown', delta: 0 } } },
    { text: '借机提醒他孩子注意纪律', effects: {integrity: 2, eq: 1, contactRelation: { id: 'hometown', delta: 5 } } },
  ]},
  { id: 'enl148', stage: 'life', eventType: 'auto', weight: 3, title: '合唱团的周三', text: '周三晚上是你参加单位合唱团的固定时间。今天排练《歌唱祖国》，你唱到"从此走向繁荣富强"时忽然眼眶发热——不是矫情，是想起父亲年轻时唱这首歌的样子。', effects: {mentalPressure: -3, eq: 2, body: 1} },
  { id: 'enl149', stage: 'life', eventType: 'choice', weight: 3, title: '跑步的清晨', text: '五点半的闹钟响了第三遍。你在"再睡十分钟"和"起床跑五公里"之间挣扎。楼下已经有跑友在喊："老张，就差你了！"', choices: [
    { text: '起床跑步，坚持打卡', effects: {body: 2, mentalPressure: -2, eq: 1} },
    { text: '再睡一会，改晚上跑', effects: {body: -1, mentalPressure: 1} },
    { text: '跑完买早餐犒劳自己', effects: {body: 1, wealth: -3, mentalPressure: -1} },
    { text: '和跑友约周末长跑', effects: {body: 1, eq: 1} },
  ]},
  { id: 'enl150', stage: 'life', eventType: 'auto', weight: 3, title: '旧书摊的邂逅', text: '旧书摊上淘到一本 1984 年版的《现代汉语词典》，扉页上有人用钢笔写着"购于XX师范，1985年春"。你买下来，想着下班后问问谁认识这笔字。', effects: {iq: 1, mentalPressure: -2, eq: 1} },
  { id: 'enl151', stage: 'life', eventType: 'choice', weight: 3, requireContact: 'banker', requireContactMin: 50, year: [30, 58], title: '行长的提醒', text: '银行行长吃饭时提醒你："最近有个理财项目，内部渠道，收益不错。你要是有闲钱，我帮你留个额度。"他压低声音："就我们几个老熟人。"', choices: [
    { text: '婉拒，说闲钱都还房贷了', effects: {integrity: 2, risk: -1, contactRelation: { id: 'banker', delta: -5 } } },
    { text: '了解风险后再考虑', effects: {iq: 1, risk: 1, contactRelation: { id: 'banker', delta: 5 } } },
    { text: '投一笔试试水', effects: {wealth: 10, risk: 3, contactRelation: { id: 'banker', delta: 10 } } },
    { text: '请教正规理财渠道', effects: {iq: 2, contactRelation: { id: 'banker', delta: 5 } } },
  ]},
  { id: 'enl152', stage: 'life', eventType: 'choice', weight: 3, requireContact: 'journalist', requireContactMin: 60, year: [28, 55], title: '记者的采访', text: '记者小何约你做正式采访，话题是"基层干部的日常"。她问："你后悔过选择这条路吗？"你沉默了很久，说："有时候会，但看到事情办成的那一刻，又不后悔了。"', choices: [
    { text: '坦诚回答，接受刊发', effects: {integrity: 2, reputation: 1, risk: 1, contactRelation: { id: 'journalist', delta: 10 } } },
    { text: '要求审稿后再刊发', effects: {eq: 1, workAbility: 1, contactRelation: { id: 'journalist', delta: 5 } } },
    { text: '只说官方口径', effects: {eq: -1, integrity: -1, contactRelation: { id: 'journalist', delta: -5 } } },
    { text: '婉拒采访', effects: {contactRelation: { id: 'journalist', delta: -10 }, mentalPressure: -1} },
  ]},
  { id: 'enl153', stage: 'life', eventType: 'auto', weight: 3, title: '楼下的修鞋摊', text: '楼下修鞋师傅的手艺远近闻名，一双鞋他能修出花来。今天你去取鞋，他没收钱："上次你帮我儿子看了公务员报考指南，这鞋算谢礼。"你想起那是三个月前的事了。', effects: {eq: 2, peopleReputation: 1, mentalPressure: -1} },
  { id: 'enl154', stage: 'life', eventType: 'choice', weight: 4, title: '孩子的家长会', text: '家长会上，老师表扬了孩子，也委婉提醒："家长要多陪陪孩子，他现在话越来越少了。"你坐在小椅子上，忽然想起上次和孩子完整说话，好像是上个月。', choices: [
    { text: '调整作息，保证每周陪伴', effects: {familyPressure: -3, workAbility: -1, eq: 2} },
    { text: '周末带孩子出去玩', effects: {familyPressure: -2, eq: 2, wealth: -5} },
    { text: '每天晚饭后聊十分钟', effects: {familyPressure: -2, eq: 1, workAbility: -1} },
    { text: '请老师多关注孩子', effects: {familyPressure: -1, workAbility: 1} },
  ]},
  { id: 'enl155', stage: 'life', eventType: 'auto', weight: 3, title: '深夜的出租屋', text: '路过老城区，看到那间你刚毕业时住过的出租屋。窗台晾着衣服，像当年的你。你站了一会儿，想起那时的梦想——现在实现了一半，另一半还在路上。', effects: {mentalPressure: -1, desire: 1, eq: 1} },
  { id: 'enl156', stage: 'life', eventType: 'choice', weight: 3, requireSingle: true, year: [26, 45], title: '长辈的介绍', text: '姑姑又给介绍了一个对象，说是"银行的，本科，家里条件好"。照片发过来，人看着挺精神。你想起前两次相亲的尴尬，犹豫着要不要加微信。', choices: [
    { text: '加上聊聊，给彼此机会', effects: {eq: 1, desire: 1, mentalPressure: 1, flag: 'dating'} },
    { text: '先看看照片再说', effects: {mentalPressure: 1} },
    { text: '婉拒，说最近忙', effects: {familyPressure: 1, mentalPressure: -1} },
    { text: '让姑姑先了解一下对方', effects: {eq: 1, familyPressure: -1} },
  ]},
  { id: 'enl157', stage: 'life', eventType: 'choice', weight: 4, requireMarried: true, title: '周末的分工', text: '周末家务分工又起了摩擦：你说"我上周擦了窗户"，她说"我天天做饭"。孩子在一旁看你们拌嘴，忽然说："你们别吵了，我来扫地。"两人都愣住了。', choices: [
    { text: '借台阶和解，全家一起干', effects: {eq: 2, familyPressure: -3, mentalPressure: -1} },
    { text: '制定家务分工表', effects: {workAbility: 1, familyPressure: -2, eq: 1} },
    { text: '请钟点工分担', effects: {wealth: -10, familyPressure: -2} },
    { text: '谁也不让步，各自生闷气', effects: {familyPressure: 3, mentalPressure: 2, eq: -2} },
  ]},
  { id: 'enl158', stage: 'life', eventType: 'auto', weight: 3, title: '晚风里的遛弯', text: '晚饭后和伴侣遛弯，她忽然说："等退休了，咱们去南方住几年吧。"你愣了一下，说"好"。晚风吹过，你忽然觉得，日子这样过着也不错。', effects: {familyPressure: -2, mentalPressure: -2, eq: 2} },
  { id: 'enl159', stage: 'life', eventType: 'choice', weight: 3, title: '阳台上的菜园', text: '妻子在阳台种的小番茄结了果。她摘了半盆，红艳艳的。你忽然想起她说过"以后想有个小院子"，当时你笑她"做梦"，现在你看着这半盆番茄，觉得梦好像也不远。', choices: [
    { text: '帮她买点好土好盆', effects: {wealth: -3, familyPressure: -2, eq: 2} },
    { text: '一起规划个阳台花园', effects: {familyPressure: -2, eq: 2, wealth: -5} },
    { text: '拍照片发朋友圈', effects: {eq: 1, familyPressure: -1} },
    { text: '说还不如买着吃省事', effects: {eq: -1, familyPressure: 1} },
  ]},
  { id: 'enl160', stage: 'life', eventType: 'auto', weight: 3, title: '故乡的月亮', text: '中秋加班，你站在办公室窗前看月亮。家乡的月亮应该也是这么圆。手机亮了，是母亲发来的语音："给你留了月饼，双黄的。"你回了个"好"，把手机贴在心口。', effects: {familyPressure: 1, mentalPressure: -1, eq: 1} },
  // ================= v2.1.12 冲刺 1500（enl161-enl168） =================
  { id: 'enl161', stage: 'life', eventType: 'choice', weight: 3, title: '家里的电话粥', text: '母亲打来电话，聊了四十分钟：邻居家的狗、老家的天气、她新学的广场舞。你一边"嗯嗯"一边看文件，挂电话时她忽然说："儿子，你是不是很忙？那妈挂了。"', choices: [
    { text: '回电话，好好听她说完', effects: {familyPressure: -2, eq: 2, workAbility: -1} },
    { text: '周末回去陪她', effects: {familyPressure: -3, eq: 2, mentalPressure: -2} },
    { text: '教她视频通话，随时见', effects: {familyPressure: -2, eq: 1} },
    { text: '有空再回，先忙工作', effects: {familyPressure: 2, mentalPressure: 1} },
  ]},
  { id: 'enl162', stage: 'life', eventType: 'auto', weight: 6, contentTier: 'everyday', title: '街角的修车铺', text: '电动车链条掉了，街角修车铺的老师傅三分钟修好，只收两块钱。你多给了五块，他追出来塞回来："该多少就多少。"你忽然觉得，这城市里有很多人，活得很有规矩。', effects: {eq: 2, mentalPressure: -1} },
  { id: 'enl163', stage: 'life', eventType: 'choice', weight: 3, requireSingle: true, year: [26, 50], title: '同事的介绍', text: '隔壁科室的同事要给你介绍对象："我表妹，老师，性格好。"你想起上次相亲的尴尬，又想起母亲的电话。你点了点头："行，见一面。"', choices: [
    { text: '认真赴约，坦诚相待', effects: {eq: 2, desire: 1, flag: 'dating'} },
    { text: '先加微信聊聊', effects: {eq: 1, mentalPressure: -1} },
    { text: '约周末咖啡见面', effects: {eq: 1, desire: 1, wealth: -3, flag: 'dating'} },
    { text: '推说最近忙，改天再说', effects: {familyPressure: 1, mentalPressure: -1} },
  ]},
  { id: 'enl164', stage: 'life', eventType: 'choice', weight: 3, title: '书桌的抽屉', text: '整理书桌，抽屉最深处翻出一本泛黄的笔记本。扉页写着大学时的梦想清单：买房、当科长、写本书。前两条都实现了，第三条还躺在抽屉里。', choices: [
    { text: '重新捡起写作的念头', effects: {iq: 1, desire: 1, mentalPressure: 1} },
    { text: '周末开始动笔', effects: {iq: 1, workAbility: 1, mentalPressure: 2} },
    { text: '感叹时光，合上抽屉', effects: {mentalPressure: -1, desire: -1} },
    { text: '报个写作班系统学', effects: {iq: 2, wealth: -10, mentalPressure: 1} },
  ]},
  { id: 'enl165', stage: 'life', eventType: 'auto', weight: 3, title: '雨后的彩虹', text: '下班时雨刚停，天边挂了一道彩虹。你举起手机拍照，发现好几个人都在拍。大家默契地笑了笑——原来疲惫的人，都会抬头看看天。', effects: {mentalPressure: -2, eq: 1} },
  { id: 'enl166', stage: 'life', eventType: 'choice', weight: 3, requireMarried: true, title: '纪念日补过', text: '结婚纪念日因为加班错过了。妻子说"没关系"，但你在她朋友圈看到别人晒的纪念日照片，配文"他记得"。你关掉手机，订了周末的餐厅。', choices: [
    { text: '周末补办纪念日', effects: {familyPressure: -3, eq: 2, wealth: -15} },
    { text: '买份礼物道歉', effects: {wealth: -10, familyPressure: -2, eq: 1} },
    { text: '写封手写信', effects: {eq: 2, integrity: 1, familyPressure: -2} },
    { text: '下次一定记住', effects: {familyPressure: 1, eq: -1} },
  ]},
  { id: 'enl167', stage: 'life', eventType: 'auto', weight: 3, title: '阳台的鸟鸣', text: '周末清晨，阳台上的麻雀叽叽喳喳。你搬了把椅子坐着听，忽然想起小时候外婆家也是这样。你发了会呆，觉得这个周末格外长。', effects: {mentalPressure: -2, eq: 1, body: 1} },
  { id: 'enl168', stage: 'life', eventType: 'choice', weight: 3, title: '父亲的白发', text: '给父亲剪头发时，你看到他后脑勺的白发又多了。他闭着眼说："剪短点，精神。"你握着剪刀，忽然想起小时候他给你剪头发，剪得歪歪扭扭，你还嫌弃。', choices: [
    { text: '慢慢剪，多聊几句', effects: {familyPressure: -2, eq: 2} },
    { text: '提议带他去理发店', effects: {familyPressure: -1, eq: 1, wealth: -3} },
    { text: '学几手剪发手艺', effects: {eq: 1, iq: 1} },
    { text: '剪完发个朋友圈', effects: {eq: 1} },
  ]},
];
