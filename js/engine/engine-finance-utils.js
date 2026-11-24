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

// 两种年度均按实际本金计息；未付息先有限滚本，其余独立挂账，不再凭空消失。
// 先付息，再从现有现金支付还款，保留基本应急金。无额外工资或凭空减债。
GameEngine.prototype.settleDebtInterest = function(fin, opts) {
  const o = opts || {};
  let interestPaid = 0, accruedInterest = 0;
  for (const d of fin.debts.slice().sort((a,b)=>b.rate-a.rate)) {
    const interest = Math.round(d.principal * d.rate);
    accruedInterest += interest;
    const paid = Math.min(fin.cash, interest);
    fin.cash -= paid; interestPaid += paid;
    const short = interest - paid;
    const roll = Math.min(short, Math.round(d.principal * 0.05));
    d.principal += roll;
    if (short > roll) d.unpaidInterest = (d.unpaidInterest || 0) + short - roll;
  }
  let forcedPaid = 0;
  if (o.forcedRepay && this.debtTotal() > 0) {
    const repayBase = Math.max(0, o.repaySalaryDelta || 0);
    const ratio = this.debtTotal() > 100 ? 0.65 : 0.5;
    const target = Math.max(Math.floor(repayBase * ratio), Math.floor(Math.max(0,fin.cash-12)*0.25));
    forcedPaid = this.payDebt(Math.min(target, Math.max(0,fin.cash-6)));
  }
  this.syncWealth(); this.syncDebtFlags();
  return { forcedPaid, interestPaid, accruedInterest };
};
