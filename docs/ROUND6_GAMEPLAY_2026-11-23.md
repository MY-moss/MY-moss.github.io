# 《上岸模拟器》v2.1.89：旧事待办、因果公平调度与私人投资后果

开发基线：正式 main `66b80ce1b9b80b49553608c6f2757edb0a24cdc7`（v2.1.88）。本轮在原生 JavaScript、现有 `GameData.events`、`GameEngine`、UI 与 Service Worker 内增量实现；未恢复 ATLAS/日报，未创建账号或 AI API 依赖，未主动清空 localStorage。

## 实际问题与修复

| 优先级 | 审计发现 | 实际修改 |
|---|---|---|
| P1 | 原 `RIGID_CHAINS` 依固定数组顺序检查；多条旧事同时到期时，较早承诺却排在后面的因果被后来的事件插队 | 提取 `getCausalChainSteps()`，在有空位时根据到期年龄升序处理，稳定次序为原定义顺序；政策项目、里程碑和当前事件仍优先 |
| P1 | 玩家不清楚哪些旧事正在等待；剧情可能因年度槽位争用而迟到 | `getPendingCausalConsequences()` 只读真实 flags、`seenEvents`、原调度表，列出 dueAge、到期/等待状态；新 `旧事待办` 界面显示已承诺结果、不给未知情节剧透 |
| P1 | `私人项目投资` 只有即刻收益与亏损，不承接公职身份的利益冲突 | 投资后设置 `ventureStake` 并于两年后进入材料申报；如实申报、退出、隐瞒分别触发另外两年后的复核，影响廉洁、风险、组织评价与家庭压力；旧林默请托/旧城封档会加重隐瞒风险 |
| P2 | 旧链的 UI 与实际年度调度分开维护容易产生解释偏差 | 待办与推进共用同一套因果步骤，且检查事件是否存在/是否已完成、去重排列。不对不存在的故事展示“待兑现”承诺 |

## 新内容

新故事《账本里没写的那一栏》包括 4 个新节点：`arc_venture_disclosure_1`、`arc_venture_declared_2`、`arc_venture_exited_2`、`arc_venture_hidden_2`。不是四段独立随机事件：玩家必须通过年度财务规划真正投过项目才可能开始。玩家的旧关系和治理选择会改变文本、信任与风险增减。**不能把财务立即获得的收益等同于投资关系不存在职业后果。** 旧存档不会凭空获得新旗标。

新面板 `旧事待办` 不展示未遇到的角色故事，不给出剧透结果。已到期但因项目/其它剧情被占用的旧事标注“等待事件槽空闲”；推进时保持旧档因果时间记录。

## 真实执行验证

执行命令：

```bash
node --test tests/game-smoke.test.mjs tests/round1-engine.test.mjs tests/round2-content.test.mjs tests/round3-content.test.mjs tests/round4-regressions.test.mjs tests/round5-causal.test.mjs tests/round6-causal-inbox.test.mjs
node tests/round5-simulation.cjs
node tests/round5-lifetime.cjs
node tests/round4-lifecycle.cjs
node tests/round5-balance.cjs
node tests/event-content-audit.cjs --write-catalog --catalog=docs/EVENT_CONTENT_AUDIT_ROUND6.csv
# 使用本地 HTTP 服务器与 Chrome + Playwright
GAME_URL=http://127.0.0.1:4219/ node tests/round6-browser.cjs
GAME_URL=http://127.0.0.1:4219/ node tests/round1-exam-browser.cjs
```

- Node 37/37 测试通过：新旧事件兼容、唯一 ID、队列优先级、不变更读取、旧存档保存/恢复、三条投资后果、家庭与林默相关文本/风险、退休和旧事件流程回归。
- 500 个固定种子、7,989 个职业年度：交汇入口 123、二年复核 84、五年段 33、回声 2；未出现不可选择事件死锁；平均晋升 2.33、平均净财富 115.63、末期心理压力 51.42。随机策略不同于玩家最优策略。
- 300 个固定种子、11,348 个职业年度长局：交汇 159，二年/五年/制度回声均 159，300 局结束、0 无选项死锁，末期平均晋升 6.79、净财富 367.78、压力 50.83；长局样本不能直接当作最佳策略平衡报告。
- 200 个退休固定种子、1,892 个职业年度：结束 200，剧情抢占 0、无可执行选择死锁 0。
- 3,000 次黄金结算分布保持上一轮结果（亏损 741、小赚 1650、大赚 609），用于财务回归，而非投资策略胜率测试。
- 浏览器：1440×900、390×844、360×740，旧事待办与线路图点击、实际执行投资后增加可见待办、存档读取、深色模式、离线（390px）以及上岸考试流程；无 JS 页面错误、请求 4xx 或页面级横向溢出。
- 全事件结构目录为 1,811 条；结构检查未发现无效效果键/短文本/无效选择，本轮静态来源检查仍存在 20 项 flag 候选（可能由引擎而非事件直接写入）。结构审核不是逐条文学人工验收。

## 保留的限制

一个职业年度仍只有一个主要事件槽；队列减少迟到事件被长期插队的现象，但退休时仍可能有因果未兑现。没有人工逐键验收全部 1,811 条内容，也没有证明所有职业策略不存在最优套路。后续更应进行家庭/职业/治理/财务的对照策略统计及退休前因果收束，而不是盲目扩大事件池。

发布状态需要以 GitHub 正式工作流、Pages 和线上浏览器最终结果为准。
