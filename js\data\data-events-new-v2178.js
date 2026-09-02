// ==================== v2.1.78 生活侧时代纪事补件（enl207-214 + enw282-285，12 事件四线） ====================
// 四线：①era life ×6（reform/stable/rectify 各 2——era 生活侧最薄：reform life 4 / rectify life 3）
// ②接待 ×2（31→33，主题垫底回升）③会议 ×2（38→40）④life sudden ×2（7→9）。
const gd_events_new_v2178 = [
  // ---------- ① era life ×6 ----------
  { id: 'enl207', stage: 'life', eventType: 'choice', weight: 3, era: ['reform'], year: [24, 45], title: '隔壁邻居的下岗再就业', text: '改革深化的年份，隔壁单元的老吴下岗了。他在楼道里蹲了一下午，第二天背起工具包去学了门手艺——家电维修。', choices: [
    { text: '介绍他接单位宿舍的维修活', effects: { eq: 2, peopleReputation: 2, wealth: 2 }, result: '手艺有了销路，老吴说你是贵人' },
    { text: '帮他把孩子转学到离家近的学校', effects: { eq: 1, background: 1 }, result: '安顿好后路，老吴专心学手艺' },
    { text: '鼓励他参加再就业培训', effects: { iq: 1, eq: 1 }, result: '培训他学了两项，成了抢手师傅' },
    { text: '各忙各的，不添麻烦', effects: { mentalPressure: 1, peopleReputation: -1 }, result: '人情淡了，楼道也安静了' }
  ] },
  { id: 'enl208', stage: 'life', eventType: 'choice', weight: 3, era: ['reform'], year: [26, 50], title: '单位集资建房的风波', text: '单位集资建房的方案贴出来第三天，就被顶了回去：楼层分配、面积差补、工龄折算，没一条能让大家同时满意。', choices: [
    { text: '主动帮工会梳理方案矛盾点', effects: { workAbility: 2, eq: 1, mentalPressure: 2 }, result: '矛盾点说清，方案改了两轮通过' },
    { text: '替大家争取更透明的分配规则', effects: { integrity: 2, peopleReputation: 2 }, result: '透明规则立住，分房不再打架' },
    { text: '私下打听哪层"留得好"', effects: { eq: 1, background: 1 }, result: '信息到手，落点却不如意' },
    { text: '能轮到就行，不争不抢', effects: { mentalPressure: -1, wealth: -2 }, result: '谦让的结果是排号靠后' }
  ] },
  { id: 'enl209', stage: 'life', eventType: 'choice', weight: 3, era: ['stable'], year: [24, 55], title: '单位年会的老三样', text: '平稳年代的年会还是老三样：领导讲话、先进表彰、抽奖。今年从三甲医院退休的老张也被请回来，坐上了主桌。', choices: [
    { text: '认真给老张斟茶，听老一辈讲故事', effects: { eq: 2, peopleReputation: 1 }, result: '老张拉着你的手说了半宿单位往事' },
    { text: '组织年轻同事给老张敬酒', effects: { eq: 1, background: 1 }, result: '热闹有了，传承也有了' },
    { text: '等抽奖环节，中个安慰奖也好', effects: { luck: 1, eq: -1 }, result: '中了个电饭煲，年前饭后半场缺席' },
    { text: '提前离场，陪家人吃晚饭', effects: { familyPressure: -1, background: -1 }, result: '家人高兴，单位少了你一个背影' }
  ] },
  { id: 'enl210', stage: 'life', eventType: 'choice', weight: 3, era: ['stable'], year: [26, 52], title: '孩子的转学手续', text: '因工作调动孩子要转学，平稳年代的转学手续按部就班：户口、学籍、接收函，一样不能少，一样不着急。', choices: [
    { text: '提前两周把材料备齐', effects: { iq: 1, workAbility: 1, familyPressure: -1 }, result: '材料一次过审，孩子无缝衔接' },
    { text: '先和新学校班主任见一面', effects: { eq: 2, familyPressure: -1 }, result: '班主任了解孩子情况，接得顺' },
    { text: '托熟人加快办理', effects: { background: 1, eq: -1 }, result: '快了两天，欠下人情' },
    { text: '按流程慢慢走，不急', effects: { mentalPressure: -1, familyPressure: 1 }, result: '孩子空窗了半个月，急的是他' }
  ] },
  { id: 'enl211', stage: 'life', eventType: 'choice', weight: 3, era: ['rectify'], year: [28, 58], title: '家属院的廉洁之风', text: '整改年代，家属院楼下贴了廉政公约，小区门口多了两个监督电话的牌子。退休老教师的儿子在纪委上班，邻居都心里有数。', choices: [
    { text: '主动带头遵守公约，遇事摊开说', effects: { integrity: 2, peopleReputation: 2 }, result: '家风正了，楼里风气也正了' },
    { text: '把家里收的礼盒悄悄退回去', effects: { integrity: 2, familyPressure: -1 }, result: '退礼那天心里没底，几天后反而踏实' },
    { text: '加入楼道廉政宣传队', effects: { eq: 1, peopleReputation: 1 }, result: '宣传队忙而不乱，邻居都配合' },
    { text: '事不关己，照常过日子', effects: { mentalPressure: -1, risk: 1 }, result: '不掺和，不代表没眼睛看着' }
  ] },
  { id: 'enl212', stage: 'life', eventType: 'choice', weight: 3, era: ['rectify'], year: [28, 56], title: '老伴劝退购物卡', text: '整改专题报道刷屏后，老伴把抽屉里几张没动过的购物卡放在茶几上，就说了三个字："处理掉。"', choices: [
    { text: '当场写退卡函，交代途径', effects: { integrity: 3, familyPressure: -1, mentalPressure: -1 }, result: '退得干脆，心里那块石头也没了' },
    { text: '交到单位纪检备案', effects: { integrity: 2, background: 1 }, result: '备案留痕，风评反而涨了' },
    { text: '捐给社区老人活动站', effects: { eq: 2, peopleReputation: 1, wealth: -1 }, result: '卡捐得其所，邻居给了赞' },
    { text: '先用掉再说，没人知道', effects: { wealth: 1, risk: 3, integrity: -2 }, result: '用了卡，心里的结也打了' }
  ] },
  // ---------- ④ life sudden ×2 ----------
  { id: 'enl213', stage: 'life', eventType: 'sudden', weight: 3, year: [26, 70], title: '清晨的物业停暖', effects: { mentalPressure: 3, familyPressure: 2, wealth: -2 }, text: '深冬清晨六点，暖气管道爆裂停暖，全楼在业主群里吵成一团。你披着羽绒服下楼帮着物业找阀门，楼道里的水已经没到脚踝。' },
  { id: 'enl214', stage: 'life', eventType: 'sudden', weight: 3, year: [24, 62], title: '老家亲戚突然到访', effects: { familyPressure: 2, mentalPressure: 2, wealth: -2 }, text: '周末早上九点，老家堂哥带着两个提包突然出现在你家门口，说"来城里看看你"。厨房里只有昨晚的剩菜，你一边切菜一边想今晚睡哪。' },
  // ---------- ② 接待 ×2 ----------
  { id: 'enw282', stage: 'work', eventType: 'choice', weight: 4, pools: ['public'], title: '接待住宿的安排', text: '上级检查组住宿要安排，宾馆只剩两种房型：标准的标间和超标准的套房。接待标准红头文件在抽屉里躺着，上面划痕清晰。', choices: [
    { text: '按标准标间安排，如实说明房型', effects: { integrity: 2, workAbility: 1, mentalPressure: 1 }, result: '检查组长说"住标准间踏实"' },
    { text: '请示办公室再定', effects: { background: 1, eq: 1 }, result: '请示过了，标准没变' },
    { text: '订两间套房备用，看情况安排', effects: { wealth: -2, risk: 2 }, result: '套房空着没人住，账要自圆其说' },
    { text: '让宾馆出"协议价"规避标准', effects: { risk: 3, integrity: -2 }, result: '协议价也是价，账在民心' }
  ] },
  { id: 'enw283', stage: 'work', eventType: 'choice', weight: 4, pools: ['public'], title: '接待用餐的陪餐', text: '接待用餐只剩两个陪餐名额，处长安排名单时扫了你一眼。餐桌上的话题从工作聊到人脉，你在心里记下了菜价。', choices: [
    { text: '控制陪餐人数，按一主一陪执行', effects: { integrity: 2, workAbility: 1 }, result: '接待从简，主宾都自在' },
    { text: '借用餐谈正事，把话题带回来', effects: { eq: 1, workAbility: 2 }, result: '酒桌谈正事，效率高于气氛' },
    { text: '安排食堂自助餐替代桌餐', effects: { integrity: 1, peopleReputation: 1 }, result: '自助餐质朴，宾主尽欢' },
    { text: '多凑两人"热闹"，大方一回', effects: { wealth: -3, background: 1, risk: 1 }, result: '热闹了，账单也显眼了' }
  ] },
  // ---------- ③ 会议 ×2 ----------
  { id: 'enw284', stage: 'work', eventType: 'choice', weight: 4, pools: ['public'], title: '视频会议的调试事故', text: '全系统视频会议开场前十分钟，主会场的投影突然无声。技术人员满头大汗重启两次，领导和参会单位都盯着屏幕。', choices: [
    { text: '从容切到备用信道，稳住场面', effects: { workAbility: 2, eq: 1, mentalPressure: 2 }, result: '切换顺利，会议按时开场' },
    { text: '先播一条语音公告缓冲', effects: { eq: 1, workAbility: 1 }, result: '缓冲插曲，会务组松了口气' },
    { text: '手把手和分会场逐路确认', effects: { workAbility: 2, mentalPressure: 2 }, result: '确认一路花一路时间，开场晚十分钟' },
    { text: '推责给技术供应商', effects: { eq: -1, background: -1, risk: 1 }, result: '责任推出去了，印象也丢了一分' }
  ] },
  { id: 'enw285', stage: 'work', eventType: 'choice', weight: 4, pools: ['public'], title: '座谈会的座次', text: '上级调研座谈会，座次牌摆了两轮仍有人觉得不对劲。会议通知里没写座次规则，你临时被叫去"把座次理顺"。', choices: [
    { text: '按职务与主宾次序重排并留痕', effects: { workAbility: 2, eq: 1 }, result: '座次理顺，主宾和领导都舒服' },
    { text: '先请教会议主持人再动', effects: { background: 1, eq: 1 }, result: '主持人拍板，谁都没意见' },
    { text: '按老规矩来，不动', effects: { integrity: 1, mentalPressure: 1 }, result: '老规矩偶有撞车' },
    { text: '让各单位自行落座', effects: { eq: -1, background: -1 }, result: '自由落座看似随和，实则散了' }
  ] }
];