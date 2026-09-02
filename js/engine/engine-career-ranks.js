// 职级、岗位与晋升门槛计算模块。
// 依赖：engine-core.js；通过 GameEngine.prototype 暴露原有 API。
GameEngine.prototype.getRankLabel = function(rank) {
    const labels = ['', '办事员', '科员', '副科级', '正科级', '副处级', '正处级', '副厅级', '正厅级', '副部级', '正部级', '副国级', '正国级'];
    return labels[Math.min(rank, labels.length - 1)] || '正国级';
  }
GameEngine.prototype.getMaxRankForLevel = function(level) {
    const limits = { '乡镇': 3, '街道': 3, '县级': 6, '市级': 8, '省级': 10, '中央': 12 };
    return limits[level] || 3;
  }
GameEngine.prototype.getPositionTitle = function(unit, rank) {
    if (!unit) return '无职务';
    const rl = this.getRankLabel(rank);
    const nm = unit.name, lv = unit.level, sys = unit.system;
    const bn = nm.replace(/^(省|市|县|乡镇)/, ''); // base name
    // 辅助：根据部门后缀生成领导职务
    const lead = (d, r) => {
      const sfx = d.includes('厅') ? '厅' : d.includes('局') ? '局' : d.includes('委') ? '委' : d.includes('办') ? '办' : d.includes('部') ? '部' : d.includes('院') ? '院' : d.includes('所') ? '所' : '';
      if (!sfx) return r <= 7 ? `${d}副主任` : `${d}主任`;
      const stem = d.replace(sfx, '');
      if (sfx === '厅') return r <= 7 ? `${stem}厅副厅长` : `${stem}厅厅长`;
      if (sfx === '局') return r <= 7 ? `${stem}局副局长` : `${stem}局局长`;
      if (sfx === '委') return r <= 7 ? `${stem}委副主任` : `${stem}委主任`;
      if (sfx === '办') return r <= 7 ? `${stem}办副主任` : `${stem}办主任`;
      if (sfx === '部') return r <= 7 ? `${stem}部副部长` : `${stem}部部长`;
      return r <= 7 ? `${d}副${sfx}长` : `${d}${sfx}长`;
    };
    const base = (r, lv) => {
      if (lv === '省级') {
        if (r <= 1) return '办事员'; if (r === 2) return '科员'; if (r === 3) return '副主任科员'; if (r === 4) return '主任科员'; if (r === 5) return '副处长'; return '处长';
      } else if (lv === '市级') {
        if (r <= 1) return '办事员'; if (r === 2) return '科员'; if (r === 3) return '副科长'; return '科长';
      } else {
        if (r <= 1) return '办事员'; if (r === 2) return '科员'; if (r === 3) return '副科长'; return '科长/主任';
      }
    };
    // 法院
    if (bn.includes('法院')) {
      if (rank <= 1) return `${nm}书记员(${rl})`;
      if (rank === 2) return `${nm}五级法官助理(${rl})`;
      if (rank === 3) return `${nm}四级法官助理/审判员(${rl})`;
      if (rank === 4) return `${nm}三级法官/审判员(${rl})`;
      if (rank === 5) return `${nm}副庭长/二级法官(${rl})`;
      if (rank === 6) return `${nm}庭长/一级法官(${rl})`;
      if (rank === 7) return `${nm}审判委员会委员(${rl})`;
      if (rank === 8) return `${nm}副院长/高级法官(${rl})`;
      if (rank === 9) return `${nm}院长/二级大法官(${rl})`;
      return `${nm}院长/一级大法官(${rl})`;
    }
    // 检察院
    if (bn.includes('检察院')) {
      if (rank <= 1) return `${nm}书记员(${rl})`;
      if (rank === 2) return `${nm}五级检察官助理(${rl})`;
      if (rank === 3) return `${nm}四级检察官助理/检察员(${rl})`;
      if (rank === 4) return `${nm}三级检察官/检察员(${rl})`;
      if (rank === 5) return `${nm}副处长/二级检察官(${rl})`;
      if (rank === 6) return `${nm}处长/一级检察官(${rl})`;
      return `${nm}副检察长/高级检察官(${rl})`;
    }
    // 税务
    if (bn.includes('税务')) {
      if (rank <= 2) return `${nm}一级行政执法员(${rl})`;
      if (rank === 3) return `${nm}副科长/四级主办(${rl})`;
      if (rank === 4) return `${nm}科长/三级主办(${rl})`;
      if (rank === 5) return `${nm}副处长/二级主办(${rl})`;
      if (rank === 6) return `${nm}处长/一级主办(${rl})`;
      return `${nm}副局长/督办(${rl})`;
    }
    // 乡镇/街道
    if (lv === '乡镇' || lv === '街道') {
      const pfx = lv === '街道' ? '街道' : '乡镇';
      if (rank <= 1) return `${nm}办事员(${rl})`;
      if (rank === 2) return `${nm}一级科员(${rl})`;
      return `${nm}副${pfx}长/四级主任科员(${rl})`;
    }
    // ── 省级 ──
    if (lv === '省级') {
      if (bn.includes('党委办') || bn.includes('政府办') || bn.includes('组织部')) {
        if (rank <= 4) return `${nm}${base(rank, lv)}(${rl})`;
        if (rank === 5) return `${nm}副处长(${rl})`;
        if (rank === 6) return `${nm}处长(${rl})`;
        if (rank === 7) return bn.includes('组织部') ? `${nm}副部长(${rl})` : `${nm}副主任(${rl})`;
        if (rank === 8) return bn.includes('组织部') ? `${nm}部长/省委常委(${rl})` : `${nm}副秘书长(${rl})`;
        if (rank === 9) return sys === '党委系统' ? '省委副书记(副部级)' : '副省长(副部级)';
        return sys === '党委系统' ? '省委书记(正部级)' : '省长(正部级)';
      }
      if (bn.includes('宣传') || bn.includes('统战') || bn.includes('网信')) {
        if (rank <= 4) return `${nm}${base(rank, lv)}(${rl})`;
        if (rank <= 6) return `${nm}${rank <= 5 ? '副处长' : '处长'}(${rl})`;
        return `${nm}${rank <= 7 ? '副部长/副主任' : '部长/主任'}(${rl})`;
      }
      if (bn.includes('政协')) {
        if (rank <= 4) return `${nm}${base(rank, lv)}(${rl})`;
        if (rank <= 6) return `${nm}${rank <= 5 ? '副处长' : '处长'}(${rl})`;
        if (rank <= 7) return `${nm}副秘书长(${rl})`;
        return `${nm}秘书长/副主席(${rl})`;
      }
      if (bn.includes('发改')) {
        if (rank <= 4) return `${nm}${base(rank, lv)}(${rl})`;
        if (rank <= 6) return `${nm}${rank <= 5 ? '副处长' : '处长'}(${rl})`;
        return `${nm}${rank <= 7 ? '副主任' : '主任'}(${rl})`;
      }
      if (bn.includes('财政')) {
        if (rank <= 4) return `${nm}${base(rank, lv)}(${rl})`;
        if (rank <= 6) return `${nm}${rank <= 5 ? '副处长' : '处长'}(${rl})`;
        return `${nm}${rank <= 7 ? '副厅长' : '厅长'}(${rl})`;
      }
      if (bn.includes('审计')) {
        if (rank <= 4) return `${nm}${base(rank, lv)}(${rl})`;
        if (rank === 5) return `${nm}副处长/审计师(${rl})`;
        if (rank === 6) return `${nm}处长/高级审计师(${rl})`;
        return `${nm}${rank <= 7 ? '副厅长' : '厅长'}(${rl})`;
      }
      if (bn.includes('统计')) {
        if (rank <= 4) return `${nm}${base(rank, lv)}(${rl})`;
        if (rank === 5) return `${nm}副处长/统计师(${rl})`;
        if (rank === 6) return `${nm}处长/高级统计师(${rl})`;
        return `${nm}${rank <= 7 ? '副局长' : '局长'}(${rl})`;
      }
      if (bn.includes('数据')) {
        if (rank <= 4) return `${nm}${base(rank, lv)}(${rl})`;
        if (rank === 5) return `${nm}副处长/工程师(${rl})`;
        if (rank === 6) return `${nm}处长/高级工程师(${rl})`;
        return `${nm}${rank <= 7 ? '副局长' : '局长'}(${rl})`;
      }
      if (bn.includes('市场监管') || bn.includes('市场监督')) {
        if (rank <= 4) return `${nm}${base(rank, lv)}(${rl})`;
        if (rank <= 6) return `${nm}${rank <= 5 ? '副处长' : '处长'}(${rl})`;
        return `${nm}${rank <= 7 ? '副局长/执法稽查专员' : '局长/市场监管总监'}(${rl})`;
      }
      if (bn.includes('水利')) {
        if (rank <= 4) return `${nm}${base(rank, lv)}(${rl})`;
        if (rank === 5) return `${nm}副处长/工程师(${rl})`;
        if (rank === 6) return `${nm}处长/高级工程师(${rl})`;
        return `${nm}${rank <= 7 ? '副厅长' : '厅长'}(${rl})`;
      }
      if (bn.includes('住建') || bn.includes('城乡建设') || bn.includes('交通') || bn.includes('运输') || bn.includes('生态') || bn.includes('环境') || bn.includes('自然资源') || bn.includes('农业农村') || bn.includes('农业') || bn.includes('人社') || bn.includes('民政') || bn.includes('卫健') || bn.includes('医保') || bn.includes('应急') || bn.includes('司法')) {
        if (rank <= 4) return `${nm}${base(rank, lv)}(${rl})`;
        if (rank <= 6) return `${nm}${rank <= 5 ? '副处长' : '处长'}(${rl})`;
        return `${lead(nm, rank)}(${rl})`;
      }
      // 省级通用
      if (rank <= 4) return `${nm}${base(rank, lv)}(${rl})`;
      if (rank <= 6) return `${nm}${rank <= 5 ? '副处长' : '处长'}(${rl})`;
      if (rank <= 8) return `${lead(nm, rank)}(${rl})`;
      if (rank === 9) return `副省长(${rl})`;
      return `省长(${rl})`;
    }
    // ── 市级 ──
    if (lv === '市级') {
      if (bn.includes('党委办') || bn.includes('政府办') || bn.includes('组织部')) {
        if (rank <= 4) return `${nm}${base(rank, lv)}(${rl})`;
        if (rank === 5) return `${nm}副主任(${rl})`;
        if (rank === 6) return `${nm}主任(${rl})`;
        if (rank === 7) return bn.includes('组织部') ? `${nm}副部长(${rl})` : '市委副秘书长(副厅级)';
        return bn.includes('组织部') ? `${nm}部长/市委常委(${rl})` : '市委秘书长/市委常委(正厅级)';
      }
      if (bn.includes('宣传') || bn.includes('统战') || bn.includes('网信')) {
        if (rank <= 4) return `${nm}${base(rank, lv)}(${rl})`;
        return `${nm}${rank <= 5 ? '副部长/副主任' : '部长/主任'}(${rl})`;
      }
      if (bn.includes('政协')) {
        if (rank <= 4) return `${nm}${base(rank, lv)}(${rl})`;
        if (rank <= 6) return `${nm}${rank <= 5 ? '副主任' : '主任/副秘书长'}(${rl})`;
        return `${nm}秘书长/副主席(${rl})`;
      }
      if (bn.includes('发改')) {
        if (rank <= 4) return `${nm}${base(rank, lv)}(${rl})`;
        return `${nm}${rank <= 5 ? '副主任' : '主任'}(${rl})`;
      }
      // 市级通用（局/委/办）
      if (rank <= 4) return `${nm}${base(rank, lv)}(${rl})`;
      if (rank === 5) return `${lead(bn, 7)}(${rl})`;
      if (rank === 6) return `${lead(bn, 8)}(${rl})`;
      if (rank === 7) return `副市长(${rl})`;
      return `市长(${rl})`;
    }
    // ── 县级 ──
    if (lv === '县级') {
      if (bn.includes('党委办') || bn.includes('政府办') || bn.includes('组织部')) {
        if (rank <= 4) return `${nm}${base(rank, lv)}(${rl})`;
        if (rank === 5) return bn.includes('组织部') ? `${nm}副部长(${rl})` : `${nm}副主任(${rl})`;
        return bn.includes('组织部') ? `${nm}部长/县委常委(${rl})` : `县委常委/县委办主任(${rl})`;
      }
      if (bn.includes('宣传') || bn.includes('统战') || bn.includes('网信')) {
        if (rank <= 4) return `${nm}${base(rank, lv)}(${rl})`;
        return `${nm}${rank <= 5 ? '副部长/副主任' : '部长/主任'}(${rl})`;
      }
      if (bn.includes('政协')) {
        if (rank <= 4) return `${nm}${base(rank, lv)}(${rl})`;
        return `${nm}秘书长/副主席(${rl})`;
      }
      if (bn.includes('发改')) {
        if (rank <= 4) return `${nm}${base(rank, lv)}(${rl})`;
        return `${nm}${rank <= 5 ? '副主任' : '主任'}(${rl})`;
      }
      if (bn.includes('审计')) {
        if (rank <= 4) return `${nm}${base(rank, lv)}(${rl})`;
        return `${nm}${rank <= 5 ? '副局长/审计师' : '局长/高级审计师'}(${rl})`;
      }
      if (bn.includes('统计')) {
        if (rank <= 4) return `${nm}${base(rank, lv)}(${rl})`;
        return `${nm}${rank <= 5 ? '副局长/统计师' : '局长'}(${rl})`;
      }
      // 县级通用（局/委/办）
      if (rank <= 4) return `${nm}${base(rank, lv)}(${rl})`;
      if (rank === 5) {
        if (bn.includes('医保') || bn.includes('卫健')) return `${nm}副主任(${rl})`;
        if (bn.includes('数据') || bn.includes('水利') || bn.includes('住建') || bn.includes('交通') || bn.includes('生态') || bn.includes('环境') || bn.includes('自然资源')) return `${nm}副局长/工程师(${rl})`;
        return `${nm}副局长(${rl})`;
      }
      return `${nm}局长/主任(${rl})`;
    }
    // ── 中央 ──
    if (lv === '中央') {
      if (rank <= 2) return `${nm}科员(${rl})`;
      if (rank === 3) return `${nm}副主任科员(${rl})`;
      if (rank === 4) return `${nm}主任科员(${rl})`;
      if (rank === 5) return `${nm}副处长(${rl})`;
      if (rank === 6) return `${nm}处长(${rl})`;
      if (rank === 7) return `${nm}副局长/副主任(${rl})`;
      if (rank === 8) return `${nm}局长/主任(${rl})`;
      if (rank === 9) return `${nm}副秘书长/副主任(${rl})`;
      if (rank === 10) return `${nm}秘书长/主任(${rl})`;
      if (rank === 11) return bn.includes('纪委') ? `${nm}副书记(${rl})` : `副国级领导(${rl})`;
      if (rank >= 12) return bn.includes('办公厅') || bn.includes('国务院') ? `正国级领导(${rl})` : `${nm}主任/部长(${rl})`;
    }
    return `${nm}干部(${rl})`;
  }
GameEngine.prototype.getCurrentPositionTitle = function() {
    const p = this.state.player;
    if (!p.unit || !p.isEmployed) return '待入职';
    return this.getPositionTitle(p.unit, p.leadershipRank);
  }
GameEngine.prototype.getSystemAffinity = function(fromSystem, toSystem) {
    if (!fromSystem || !toSystem) return 0;
    if (fromSystem === toSystem) return 0.05;
    const groups = {
      '党委系统': ['党委系统', '政府系统', '政府部门'],
      '政府系统': ['党委系统', '政府系统', '政府部门'],
      '政府部门': ['党委系统', '政府系统', '政府部门', '民生部门'],
      '政法系统': ['政法系统', '执法部门', '垂管系统'],
      '执法部门': ['政法系统', '执法部门'],
      '垂管系统': ['政法系统', '垂管系统', '政府部门'],
      '民生部门': ['民生部门', '政府部门', '窗口部门'],
      '窗口部门': ['民生部门', '窗口部门'],
      '技术部门': ['技术部门', '数据部门'],
      '数据部门': ['技术部门', '数据部门'],
      '机关': ['机关', '党委系统'],
      '基层单位': ['基层单位', '民生部门'],
    };
    const family = groups[fromSystem] || [fromSystem];
    if (family.includes(toSystem)) return 0.03;
    return -0.03;
  }
GameEngine.prototype.getCityTier = function(order) {
    if (order === undefined || order === null) return 99;
    if (order <= 3) return 1;   // 核心机关：党委办/组织部/政府办
    if (order <= 8) return 2;   // 要害部门：发改委/财政/税务/法院/检察院
    if (order <= 15) return 3;  // 业务部门：网信/宣传/统战/住建/自然资源/交通/审计
    if (order <= 21) return 4;  // 民生部门：卫健/人社/民政/司法/应急/市场
    return 5;                    // 一般部门：生态/农业/水利/统计/医保/数据/审批/政协
  }
GameEngine.prototype.getProvinceTier = function(order) {
    if (order === undefined || order === null) return 99;
    if (order <= 3) return 1;   // 核心：党委办/组织部/政府办
    if (order <= 7) return 2;   // 要害：发改委/财政/法院/检察院
    if (order <= 12) return 3;  // 要部：宣传/审计/自然资源/网信/住建
    if (order <= 20) return 4;  // 业务：税务/应急/卫健/水利/农业农村/市场/司法/交通
    return 5;                    // 一般：人社/医保/统计/生态/统战/数据/民政/政协
  }
GameEngine.prototype.getCountyTier = function(order) {
    if (order === undefined || order === null) return 99;
    if (order <= 3) return 1;   // 核心：党委办/组织部/政府办
    if (order <= 7) return 2;   // 要害：发改委/财政/法院/检察院
    if (order <= 13) return 3;  // 要部：审计/自然资源/网信/宣传/住建/税务
    if (order <= 20) return 4;  // 民生：人社/市场/医保/卫健/应急/数据/司法
    return 5;                    // 一般：农业农村/民政/生态/统计/水利/交通/统战/审批/政协
  }
GameEngine.prototype.getMinYearsForRank = function(rank) {
    if (rank <= 1) return 0;
    if (rank === 2) return 3;
    if (rank === 3) return 2;
    if (rank === 4) return 3;
    if (rank === 5) return 2;
    if (rank === 6) return 3;
    if (rank === 7) return 2;
    if (rank === 8) return 3;
    if (rank === 9) return 5;
    // v2.15.1：rank10 正部→副国 8→5年（与《公务员职务与职级并行规定》正部5年可晋副国一致）
    if (rank === 10) return 5;
    return 10; // 副国级/正国级至少10年
  }
GameEngine.prototype.getPoliticalReq = function(rank) {
    if (rank >= 6) return 'cpc';
    return 'any';
  }
GameEngine.prototype.getAgeLimit = function(rank) {
    if (rank <= 2) return 45;
    if (rank <= 4) return 50;
    if (rank <= 6) return 55;
    if (rank <= 8) return 58;
    return 60;
  }
