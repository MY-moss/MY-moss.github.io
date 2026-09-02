// 财务结算工具模块（v2.1.67 自 engine-career.js 抽取，行为逐字不变）。
// 依赖：engine-core.js（cashIn/cashOut/payDebtDirect/debtTotal/syncWealth）。
// computeLivingExpense：runCareerYear 与 restYear 共用的生活支出公式。
// settleDebtInterest：付息 + 利滚利；强制还本仅在年度结算（forcedRepay: true）。

// 生活支出：基础 6 + 已婚 3 + 有娃 4 + 慢性病 3 + 房贷 6 + 消费升级（正现金 /25 × 2）
// v2.66 房贷月供 8→6（原对低职级玩家是"穷人税"）；消费升级 /25 强度（v2.4.1 校准）
GameEngine.prototype.computeLivingExpense = function(p) {
  const fin = p.finance || { cash: 0 };
  return 6 + (p.isMarried ? 3 : 0) + (p.hasChildren ? 4 : 0) + (p.flags.chronicIllness ? 3 : 0) + (p.flags.mortgage ? 6 : 0) + Math.floor(Math.max(0, fin.cash || 0) / 25) * 2;
};

// 付息与利滚利结算。
// opts.forcedRepay === true  → 年度结算完整逻辑（工资结余基数 + 工作能力加成的强制还本，
//                              现金不足利息按"单笔每年最多滚本 5%"封顶、余额挂账 unpaidInterest）
// opts.forcedRepay !== true  → 休整年简版（现金不足利息全额滚入最高利率债，无封顶）
// 返回 { forcedPaid, interestPaid } 供调用方写日志。
GameEngine.prototype.settleDebtInterest = function(fin, opts) {
  const o = opts || {};
  let forcedPaid = 0;
  if (o.forcedRepay) {
    // 强制还本（v2.13）：工资结余的比例还本金；债务>100 时比例提至 0.5（防永续死循环）
    // v2.49 修复：基数为工资结余（而非付息后现金），保证被动玩家也能出坑
    const repayRatio = this.debtTotal() > 100 ? 0.5 : 0.4;
    // v2.1.5 H1：还本基数加工作能力加成（外快多，出坑更快）
    const repayBase = Math.max(0, o.repaySalaryDelta || 0) + Math.floor((o.workAbility || 0) / 20);
    const forced = Math.min(this.debtTotal(), Math.round(repayBase * repayRatio));
    // v2.1.5 H1：强制还本走 payDebtDirect（直接减本金，不扣现金）——避免还本抽干现金→利息滚本金的死亡螺旋
    if (forced > 0) { forcedPaid = this.payDebtDirect(forced); }
  }
  let interest = 0;
  for (const d of fin.debts) interest += Math.round(d.principal * d.rate);
  interest = Math.max(1, interest);
  let interestPaid = 0;
  if (fin.cash >= interest) {
    fin.cash -= interest;
    interestPaid = interest;
  } else {
    // 现金不足：利息并入利率最高的债（利滚利）
    interestPaid = fin.cash;
    let short = interest - fin.cash;
    fin.cash = 0;
    const top = fin.debts.slice().sort((a, b) => b.rate - a.rate)[0];
    if (top) {
      if (o.forcedRepay) {
        // v2.1.6 利滚利封顶：未付利息单笔每年最多滚入本金 5%（其余挂账不滚本，防债务无限爆炸）
        const cap = Math.max(1, Math.round(top.principal * 0.05));
        const roll = Math.min(short, cap);
        top.principal += roll;
        short -= roll;
        if (short > 0) top.unpaidInterest = (top.unpaidInterest || 0) + short;
      } else {
        top.principal += short;
      }
    }
  }
  this.syncWealth();
  return { forcedPaid, interestPaid };
};
