// ==================== v2.1.74 时代纪事与人生仪式补强包（enl191-204 / enw266-275 / enc138-139，26 事件三线） ====================
// v2.1.74 探测结论：1990s-2020s 社会记忆纪事 8/13 词 0 命中（非典/奥运/洪水/高铁/国考等）；
// 中老年仪式与生死终局（空巢/乔迁/学车/葬礼/治丧/自身重病）大面积空白；任免/人事 title 近空白。
// 三线：①时代纪事 ×12（life/work，age 窗口区分群体，era 不绑定跨越三时代）
// ②仪式与生死 ×10（45-75 岁叙事主力）③任免 title 化 ×4。
// 约束：纯事件（无新 flag/机制）、effect 键全部白名单、标题规避既有重复。
const gd_events_new_v2174 = [
  // ---------- 一、时代大事纪事 ×12 ----------
  { id: 'enw266', stage: 'work', eventType: 'choice', weight: 3, year: [22, 40], pools: ['应急'], title: '大洪水里的单位值守', text: '百年不遇的大洪水那年夏天，单位抽调人员二十四小时上堤值守。你分到的堤段是管涌频发段，交接班记录本已经写到第三本。', choices: [
    { text: '主动申请夜间值守最险的一段', effects: { workAbility: 2, peopleReputation: 2, body: -2 }, result: '洪水退去，堤段完好，你晒脱了一层皮' },
    { text: '后方负责物资调度', effects: { workAbility: 1, background: 1 }, result: '物资保障到位，一线念你的好' },
    { text: '轮班科学排布，留足换防人力', effects: { iq: 1, workAbility: 1, mentalPressure: 1 }, result: '排班合理，人人有觉睡' },
    { text: '请假躲过最紧张的一周', effects: { eq: -1, reputation: -2 }, result: '事后没人说，但名单上都记着' }
  ] },
  { id: 'enl191', stage: 'life', eventType: 'choice', weight: 3, year: [22, 40], title: '非典时期的消毒班', text: '非典那阵，单位大门支起了消毒毯，食堂改成一人一桌。你负责早上八点前把整层楼的扶手擦一遍，电梯按钮一天换三次保鲜膜。', choices: [
    { text: '八点前到岗，风雨无阻', effects: { workAbility: 1, eq: 1, body: -1 }, result: '全楼零感染，大家记住了消毒员' },
    { text: '自己也怕，戴双层口罩坚持干', effects: { mentalPressure: 1, integrity: 1 }, result: '怕归怕，班归班' },
    { text: '借机观察谁在认真谁在摸鱼', effects: { iq: 1, eq: -1 }, result: '心里记了本账，日后用得着' },
    { text: '找理由调换到不用扫楼的岗位', effects: { mentalPressure: -1, reputation: -1 }, result: '躲过了消毒，也躲过了观察' }
  ] },
  { id: 'enl192', stage: 'life', eventType: 'choice', weight: 3, year: [22, 40], title: '汶川那天的捐款箱', text: '地震消息传来的下午，单位走廊摆出捐款箱，纸箱上贴着"一方有难八方支援"的毛笔字。有人捐了一百，有人把整月工资塞了进去。', choices: [
    { text: '按一个月生活费捐', effects: { wealth: -8, eq: 2, reputation: 1 }, result: '捐款榜上前几名，单位简报点名' },
    { text: '参加单位组织的献血', effects: { body: -1, eq: 2 }, result: '献血证放在抽屉最上层' },
    { text: '量力而行捐一百', effects: { wealth: -1, eq: 1 }, result: '心意到了，日子照过' },
    { text: '私下转账不留名', effects: { eq: 1, integrity: 1 }, result: '不留名的安静善意' }
  ] },
  { id: 'enl193', stage: 'life', eventType: 'choice', weight: 3, year: [24, 45], title: '奥运开幕式那晚', text: '奥运会开幕式的晚上，单位组织集体观看。大会议室里投影幕布挂起，平日严肃的老科长悄悄把自家电视调成了同一频道。', choices: [
    { text: '和大家一起看，掌声雷动', effects: { eq: 2, peopleReputation: 1 }, result: '那一晚的激动，多年后仍有人提起' },
    { text: '带娃回家看，家国两全', effects: { familyPressure: -1, eq: 1 }, result: '娃记住了五环，你记住了那晚' },
    { text: '守值班室，听着电视声工作', effects: { workAbility: 1, integrity: 1 }, result: '值班室的电视开了一夜' },
    { text: '没看，日子如常', effects: { mentalPressure: -1 }, result: '热闹是他们的，平淡是你的' }
  ] },
  { id: 'enw267', stage: 'work', eventType: 'choice', weight: 3, year: [22, 35], title: '国考热那年上岸', text: '国考报名人数连年翻番那年，你刚拿到录取通知。单位老同志讲起他们当年的"包分配"，语气里全是另一套人生。', choices: [
    { text: '听老同志讲故事，记下差距', effects: { eq: 1, iq: 1 }, result: '两代人的上岸被讲成了段子里的历史' },
    { text: '给备考的学弟学妹回信打气', effects: { eq: 1, peopleReputation: 1 }, result: '回信写了两页，像极当年的自己' },
    { text: '把上岸经验写成共享文档', effects: { workAbility: 1, reputation: 1 }, result: '文档被传了好几轮' },
    { text: '只报喜不报忧，闭口不谈代价', effects: { eq: 1, mentalPressure: -1 }, result: '故事讲了一半' }
  ] },
  { id: 'enw268', stage: 'work', eventType: 'choice', weight: 3, year: [24, 55], title: '高铁开通第一年', text: '首条高铁通车那年，出差从"前一天走"变成"当天回"。处长说单位差旅费标准该改一改了，让你先写个测算。', choices: [
    { text: '认真测算，指出差旅费改革空间', effects: { workAbility: 2, background: 1 }, result: '测算被采纳，你还上了局办公会' },
    { text: '先体验一程再写', effects: { eq: 1, workAbility: 1 }, result: '亲测更准，报告里多了"体感"数据' },
    { text: '按往年数据保守估算', effects: { workAbility: 1, eq: 1 }, result: '保守无过，也没有亮点' },
    { text: '顺路回老家一趟再回来', effects: { familyPressure: -1, background: 1 }, result: '高铁拉近了家，也拉近了心' }
  ] },
  { id: 'enl194', stage: 'life', eventType: 'choice', weight: 3, year: [28, 55], title: '股灾前后的办公室', text: '那阵子办公室午休聊的全是股票，打印纸背面都是K线图。暴跌那天，走廊里静得像没人上班。', choices: [
    { text: '早收手了，看热闹', effects: { luck: 1, eq: 1 }, result: '躲过一劫，办公室把你当"神秘高手"' },
    { text: '被套住，割肉离场', effects: { wealth: -12, mentalPressure: 2 }, result: '学费交完，从此只看基金定投' },
    { text: '补仓摊平，多年后回本', effects: { wealth: -8, iq: 1 }, result: '回本那天，你在打印机上贴了自律便签' },
    { text: '从不碰股票，专心上班', effects: { wealth: 0, mentalPressure: 0 }, result: '没有暴富，也没有暴亏' }
  ] },
  { id: 'enw269', stage: 'work', eventType: 'choice', weight: 3, year: [25, 50], pools: ['基层单位'], title: '电商下乡的村播潮', text: '电商平台下乡那两年，驻村点不少年轻人在做村播卖土特产。村支书拉你出镜十秒，说"干部带货群众更有信心"。', choices: [
    { text: '出镜带货，把土特产讲出故事', effects: { peopleReputation: 2, workAbility: 1 }, result: '视频火了，订单涨了三成' },
    { text: '帮村里搭平台、教选品', effects: { workAbility: 2, iq: 1 }, result: '落地能力比出镜更重要' },
    { text: '先试点两家农户再推开', effects: { eq: 1, workAbility: 1 }, result: '试点见效，推广水到渠成' },
    { text: '婉拒出镜，只做幕后协调', effects: { eq: 1, background: 1 }, result: '幕后稳妥，风头让给年轻人' }
  ] },
  { id: 'enl195', stage: 'life', eventType: 'choice', weight: 3, year: [25, 50], title: '楼市大潮那年买房', text: '房价连涨的年份，单位食堂的话题从工作变成了"你买了吗"。中介的电话比领导还勤快，样板间的灯亮到晚上十点。', choices: [
    { text: '咬牙上车，背二十年贷款', effects: { wealth: -30, familyPressure: 2, mentalPressure: 2 }, result: '房本到手，心里踏实了，月供也压上了' },
    { text: '等回调，先租着', effects: { wealth: -5, luck: -1 }, result: '等来了更高的价' },
    { text: '买在老家的县城，便宜一半', effects: { wealth: -15, familyPressure: -1 }, result: '县城房给父母住，城里的梦继续做' },
    { text: '单位福利房时代的地皮，没赶上', effects: { eq: 1, luck: -1 }, result: '错过就错过，日子照过' }
  ] },
  { id: 'enw270', stage: 'work', eventType: 'choice', weight: 3, year: [22, 58], pools: ['应急'], title: '疫情值守的冬天', text: '那个冬天单位实行轮班值守，进出要查码测温。你值了好几轮夜班，值班室的暖气片只有一侧是热的。', choices: [
    { text: '值夜班时把台账整理得一丝不苟', effects: { workAbility: 2, reputation: 1, body: -1 }, result: '台账清零无差错，值守期零投诉' },
    { text: '组织同事轮流送热汤到岗', effects: { eq: 2, peopleReputation: 2 }, result: '热汤暖了岗，也暖了人心' },
    { text: '申请弹性排班兼顾家里老人', effects: { eq: 1, background: 1 }, result: '组织通融，家里也安顿' },
    { text: '借值守之名躲家里的琐事', effects: { eq: -1, familyPressure: 2 }, result: '值班躲得了一时，躲不了一世' }
  ] },
  { id: 'enl196', stage: 'life', eventType: 'choice', weight: 2, year: [28, 60], title: '入世二十年的老同事们', text: '入世整二十年时，单位组织了一次老同事座谈。当年做外贸的老李讲起第一单出口生意，眼眶泛红——那批货现在还在他家阳台上供着。', choices: [
    { text: '认真听完，把故事记进随笔', effects: { eq: 1, iq: 1 }, result: '随笔后来发了单位内刊' },
    { text: '组织把老故事做成宣传栏', effects: { peopleReputation: 1, workAbility: 1 }, result: '宣传栏前站了一排老同志' },
    { text: '接老李的话，讲自己的入世记忆', effects: { eq: 1, reputation: 1 }, result: '两代人凑齐了一段资本市场史' },
    { text: '签到就走，忙着接娃', effects: { eq: -1, familyPressure: -1 }, result: '错过了一堂民间史课' }
  ] },
  // ---------- 二、仪式与生死终局 ×10 ----------
  { id: 'enl197', stage: 'life', eventType: 'choice', weight: 4, year: [40, 55], title: '空巢第一年', text: '孩子上大学后的第一个周末，家里安静得能听见冰箱的嗡嗡声。你摆好三副碗筷又收回去一副，老伴说"吃饭吧"。', choices: [
    { text: '把周末重新安排成两个人的', effects: { familyPressure: -1, eq: 2 }, result: '空巢第二年，你和老伴学会了散步' },
    { text: '每周固定视频，家书变语音', effects: { familyPressure: -1, eq: 1 }, result: '语音条攒了一抽屉' },
    { text: '把孩子的房间改成书房', effects: { eq: 1, mentalPressure: 1 }, result: '书房用起来了，房门开着' },
    { text: '用工作填满空荡的时间', effects: { workAbility: 1, familyPressure: 2 }, result: '工作满档，家里更空' }
  ] },
  { id: 'enl198', stage: 'life', eventType: 'choice', weight: 4, year: [42, 58], title: '孩子的毕业典礼', text: '孩子大学毕业典礼，你坐在礼堂后排。主席台上叫到他的名字时，你突然想起他一年级入学的第一天，也是这个季节。', choices: [
    { text: '把仪式感做足，订饭店全家庆祝', effects: { wealth: -6, familyPressure: -1, eq: 2 }, result: '全家福拍得又齐又亮' },
    { text: '送一封信，写当年送他上学的早晨', effects: { eq: 2, iq: 1 }, result: '信被孩子收进了行李箱夹层' },
    { text: '和他讨论就业方向到深夜', effects: { iq: 1, familyPressure: 1 }, result: '选择还是他做的，你陪他想透了' },
    { text: '拍张照就赶回去开会', effects: { familyPressure: 2, reputation: 0 }, result: '照片有了，话没有' }
  ] },
  { id: 'enl199', stage: 'life', eventType: 'choice', weight: 4, year: [30, 55], title: '乔迁之喜', text: '新房钥匙到手那天，你跟装修师傅在毛坯房里比划了两个小时。楼下邻居送来一篮苹果，说是"入宅吉利"。', choices: [
    { text: '请靠谱装修队，材料自己盯', effects: { wealth: -18, mentalPressure: 2 }, result: '装修三个月，每一步都看得见' },
    { text: '选精装房拎包入住', effects: { wealth: -25, mentalPressure: -2 }, result: '省心是省心，风格是开发商定的' },
    { text: '旧家具搬过去，添一件新的', effects: { wealth: -8, familyPressure: -1 }, result: '新家带着旧生活的气味' },
    { text: '同事帮忙验房，人情记一笔', effects: { eq: 1, wealth: -2 }, result: '验房省心，改天请饭' }
  ] },
  { id: 'enl200', stage: 'life', eventType: 'choice', weight: 3, year: [28, 55], title: '学车考驾照', text: '周末学车两个月，科目二倒库练到闭眼都会。教练的嘴毒了一路，考试那天你却紧张得手心冒汗。', choices: [
    { text: '一鼓作气四科全过', effects: { iq: 1, luck: 1, body: 1 }, result: '本本到手那周，全家吃火锅庆祝' },
    { text: '科目二挂一次，第二次过', effects: { mentalPressure: 1, eq: 1 }, result: '挂科那晚你复盘到十二点' },
    { text: '练车时和同期学员成朋友', effects: { eq: 1, peopleReputation: 1 }, result: '车友后来的生活里也常有交集' },
    { text: '三年没学完，过期再考', effects: { body: -1, luck: -1 }, result: '第三次报名时，你已经会讲教训了' }
  ] },
  { id: 'enl201', stage: 'life', eventType: 'choice', weight: 4, year: [45, 68], title: '父母八十大寿', text: '父母八十岁生日，你张罗了家宴。母亲说"别铺张"，却提前三天把客厅的布帘换了新的，父亲把压在箱底的旧军装翻了出来。', choices: [
    { text: '全家福加寿宴，亲戚都请', effects: { wealth: -12, familyPressure: -2, eq: 3 }, result: '寿宴热闹，父母眼角的笑纹深了三道' },
    { text: '三桌家宴，只请至亲', effects: { wealth: -4, familyPressure: -2, eq: 2 }, result: '家宴温馨，母亲念叨"这样就够了"' },
    { text: '带二老故地重游拍纪念照', effects: { wealth: -8, eq: 2, body: -1 }, result: '旧地新照，父亲说"这条路我走了六十年"' },
    { text: '加班销假，红包代替', effects: { wealth: -10, familyPressure: 3 }, result: '红包厚，缺席的遗憾也厚' }
  ] },
  { id: 'enl202', stage: 'life', eventType: 'choice', weight: 4, year: [35, 68], title: '同事的葬礼', text: '同科室的老周突然走得急，葬礼安排在周三上午。单位出车去殡仪馆，你负责写挽联和随礼名单。', choices: [
    { text: '认真把后事办得体面周全', effects: { eq: 2, peopleReputation: 2 }, result: '老周家属握着你的手，说了三遍谢谢' },
    { text: '帮忙整理遗物送回老家', effects: { eq: 2, integrity: 1 }, result: '遗物归位，老家的灯又亮了' },
    { text: '悄悄帮老周家渡过难关', effects: { eq: 2, wealth: -4 }, result: '这份情，老周家记下了' },
    { text: '随了礼就赶回去上班', effects: { eq: -1, reputation: -1 }, result: '礼到了，心没到' }
  ] },
  { id: 'enw271', stage: 'work', eventType: 'choice', weight: 4, year: [35, 68], title: '老领导的后事', text: '退休多年的老领导病逝，单位安排治丧。他是把你调进科室的人，讣告上的字要你拟。你坐在办公室，笔尖停了很久。', choices: [
    { text: '把讣告写成他一生的注脚', effects: { workAbility: 2, reputation: 1, mentalPressure: 1 }, result: '讣告被家属保留，悼词里是你写的句子' },
    { text: '主动承担追悼会协调', effects: { workAbility: 2, eq: 1 }, result: '仪式周全，老同事都道谢' },
    { text: '作为代表在告别会上发言', effects: { eq: 2, reputation: 1 }, result: '发言讲到一半，台下有人擦眼泪' },
    { text: '按流程办事，不多说一句', effects: { background: 1, eq: -1 }, result: '流程走了，温度少了' }
  ] },
  { id: 'enl203', stage: 'life', eventType: 'choice', weight: 4, year: [30, 70], title: '告别会那天的沉默', text: '追悼会散场，你在停车场站了一会儿。认识的人三三两两说着"节哀"，然后各自钻进车里回到各自的生活。', choices: [
    { text: '回去的路上给家人打了个电话', effects: { eq: 2, familyPressure: -1 }, result: '电话那头一句"爸，啥时候回来"，让你红了眼圈' },
    { text: '约老同事喝杯茶，聊聊老周', effects: { eq: 2, peopleReputation: 1 }, result: '聊到很晚，把该说的都说了' },
    { text: '把感慨写进随笔', effects: { iq: 1, eq: 1 }, result: '随笔后来被老伴收进抽屉' },
    { text: '把日程翻到明天，正常上班', effects: { mentalPressure: 1 }, result: '日子照旧，心里的土慢慢松' }
  ] },
  { id: 'enl204', stage: 'life', eventType: 'choice', weight: 4, year: [45, 75], title: '大病初愈的清单', text: '一场大病后你出院回家，医生叮嘱"慢慢养"。老伴把你的床头柜收拾得干干净净，你却在夜里写下了一份"想做的事"清单。', choices: [
    { text: '把清单第一项定为陪老伴旅行', effects: { eq: 2, familyPressure: -2, wealth: -8 }, result: '旅行回来，清单划掉一项，人生豁亮' },
    { text: '把没来得及说的话写下来', effects: { eq: 2, iq: 1 }, result: '信写给家人，也写给自己' },
    { text: '把养生当成新事业', effects: { body: 2, mentalPressure: -1 }, result: '半年后复查，指标全绿' },
    { text: '清单锁进抽屉，日子照旧', effects: { body: -1, mentalPressure: 1 }, result: '清单蒙灰，想法也跟着蒙灰' }
  ] },
  { id: 'enl205', stage: 'life', eventType: 'auto', weight: 3, year: [45, 70], title: '楼上的老姐妹', effects: { eq: 1, familyPressure: -1 }, text: '母亲的邻居老姐妹走了。母亲在电话里讲了一晚上她们年轻时的事，末了说"你也要好好的"。窗外路灯亮着，你听着电话，把"嗯"说了很多遍。' },
  // ---------- 三、任免 title 化 ×4 ----------
  { id: 'enl206', stage: 'life', eventType: 'choice', weight: 2, year: [22, 40], title: '非典后的那条街', text: '非典过后那个夏天，街上重新热闹起来。报刊亭挂着"众志成城"的横幅，炸鸡店排起长队。你站在路口，第一次觉得平凡日子这么珍贵。', choices: [
    { text: '把身边的小日子狠狠过了一遍', effects: { eq: 1, familyPressure: -1 }, result: '陪家人的周末，比什么都治愈' },
    { text: '请同事吃一顿解封饭', effects: { eq: 2, peopleReputation: 1, wealth: -3 }, result: '那顿饭像过节，筷子停不下来' },
    { text: '把消毒期间写的随笔整理成文', effects: { iq: 1, eq: 1 }, result: '随笔投了单位内刊，登了出来' },
    { text: '日子照旧，很快忘了那段', effects: { mentalPressure: -1 }, result: '遗忘本身就是福气' }
  ] },
  { id: 'enw272', stage: 'work', eventType: 'choice', weight: 4, year: [32, 55], title: '届中调整谈话', text: '班子届满两年，组织部门启动届中微调谈话。处长问你"有没有什么想法"，语气像是在说"这轮先不动你"。', choices: [
    { text: '如实交底，谈清三年规划', effects: { integrity: 2, background: 1, mentalPressure: 1 }, result: '谈话记录清爽，规划进了档案袋' },
    { text: '暗示愿意动一动', effects: { background: 1, eq: 1 }, result: '话递上去了，桌子那头也有反应' },
    { text: '打听本轮调整名单', effects: { eq: 1, background: -1, risk: 1 }, result: '名单没打听全，风声先漏了' },
    { text: '一切听组织安排', effects: { reputation: 1, background: -1 }, result: '被动稳重，选择权交出去了' }
  ] },
  { id: 'enw273', stage: 'work', eventType: 'choice', weight: 4, year: [30, 58], title: '班子新老交替', text: '一把手到龄，新领导下周到任。单位里有人忙着表现，有人按兵不动。交接期的一份材料交到你手上，两边风格都得照顾。', choices: [
    { text: '按事实写，谁都能接得住', effects: { integrity: 2, workAbility: 1 }, result: '交接材料四平八稳，两任都点头' },
    { text: '突出老班子成绩，给足体面', effects: { eq: 2, background: 1 }, result: '老领导满意，新领导也理解了来龙去脉' },
    { text: '提前了解新领导风格调整写法', effects: { background: 1, iq: 1 }, result: '风格踩准，新领导多看了两眼' },
    { text: '拖到交接前夜再交', effects: { risk: 1, background: -1 }, result: '赶工出活，质量打了折' }
  ] },
  { id: 'enc138', stage: 'career', eventType: 'choice', weight: 5, year: [30, 52], title: '竞争上岗的笔试与演讲', text: '中层岗位竞争上岗，笔试、演讲、答辩三关。你的演讲稿改到第四稿，还在最后一页加了一句"如果组织信任我"。', choices: [
    { text: '三关全力，演讲稿脱稿讲', effects: { workAbility: 2, background: 1, mentalPressure: 3 }, result: '演讲脱稿流畅，答辩对答如流' },
    { text: '请参加过竞岗的同事模拟点评', effects: { eq: 1, workAbility: 1 }, result: '模拟点评帮你砍掉了两处硬伤' },
    { text: '把实绩数据做成可视化一页纸', effects: { iq: 1, workAbility: 1 }, result: '一页纸传阅，评委记住了数字' },
    { text: '顺其自然，能上就上', effects: { mentalPressure: -1, background: -1 }, result: '正常发挥，排名正常' }
  ] },
  { id: 'enc139', stage: 'career', eventType: 'choice', weight: 5, year: [30, 55], title: '任免公示牌前', text: '拟任名单公示的第一天，你路过单位大厅的公示栏。自己的名字在第二行第三个，旁边同事的名字在第四行。', choices: [
    { text: '照常工作，不议论不表态', effects: { eq: 2, integrity: 1 }, result: '公示期平稳，你像没看见一样' },
    { text: '给有异议风险的同事先打预防针', effects: { eq: 2, background: 1 }, result: '风平浪静，公示通过' },
    { text: '逐条准备公示期间可能的问询', effects: { workAbility: 1, mentalPressure: 1 }, result: '问询来时不慌，材料在手' },
    { text: '请客"预热"，提前庆祝', effects: { wealth: -5, eq: -1, risk: 1 }, result: '庆祝早了，公示期有话说' }
  ] }
];