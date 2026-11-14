# ATLAS 自动发布协议

本协议供五个 ChatGPT 定时任务共同使用。目标是：任务完成研究和编辑后，将结构化报告写入私有 GitHub 仓库；ATLAS 前端读取该私有仓库并自动显示新内容。

## 唯一内容仓库

- Repository：**MY-moss/atlas-data**
- Visibility：必须是 **Private**
- Branch：**main**
- 前端读取路径：**data/feeds/{stream}/**
- 不需要维护总索引；前端通过 GitHub Contents API 列出目录中的 JSON 文件。
- 不得把报告内容写入公开站点仓库 **MY-moss/MY-moss.github.io**。

## 五条信息流与文件命名

| 自动化任务 | stream | 频率 | 文件路径 |
|---|---|---|---|
| 每日世界新闻简报 | world | 每日 | data/feeds/world/YYYY-MM-DD.json |
| 每日精选阅读 | reading | 每日 | data/feeds/reading/YYYY-MM-DD.json |
| 每日灵感采集 | inspiration | 每日 | data/feeds/inspiration/YYYY-MM-DD.json |
| 每周开源项目雷达 | opensource | 每周六 | data/feeds/opensource/YYYY-Www.json |
| 每周知识回顾 | knowledge | 每周日 | data/feeds/knowledge/YYYY-Www.json |

周文件名使用 ISO week，例如 2026-W46.json。JSON 的 date 字段填写报告生成日期（YYYY-MM-DD），可额外提供 week 字段标记 ISO 周。

## JSON 数据结构

每份报告必须是 UTF-8 JSON 对象，至少包含：

- schema_version: 1
- stream: 上表对应的 ID
- date: 报告生成日期 YYYY-MM-DD
- title: 报告标题
- summary: 适合卡片展示的 1–3 句摘要
- items: 条目数组；每个条目至少包含 title，并尽可能提供 author、source、published_at、url、summary、tags、priority 等字段
- sources: 来源数组，尽可能保留来源名称、原始 URL 和核验时间

详细字段和可选字段以 atlas/report.schema.json 为准。知识回顾可同时提供 highlights、trends、people_projects、saved_sources、next_week 等数组；每个数组中的条目都要有 title，ATLAS 会将这些部分一起展示。开源雷达条目尽量提供 repo_url、language、maturity、risks；灵感条目尽量提供 creator、what_works、takeaways；新闻条目尽量提供 confidence、why_important；阅读条目尽量提供 reading_minutes、access、why_read。

## 必须执行的 GitHub 写入步骤

1. 完成内容研究、事实核验、去重和编辑后，生成完整 JSON 报告。
2. 计算本期确定性路径和文件名。不要使用随机文件名。
3. 使用 GitHub fetch_file 读取目标文件：
   - 如果文件已存在，使用返回的当前 blob SHA 调用 update_file。
   - 如果返回 404，使用 create_file 创建。
   - 不得在没有先读取当前 SHA 的情况下覆盖已有文件。
4. 确认 GitHub 写入成功，且目标仓库确实是 MY-moss/atlas-data。
5. 只有在写入成功后，才可以在任务结果中标记“已发布到 ATLAS”。同时给出文件路径和 commit SHA。
6. 如果仓库尚未创建、GitHub 连接没有该仓库权限、API 限流或写入失败：
   - 不得尝试写入公开仓库或其他私人项目仓库；
   - 在任务结果中保留完整报告；
   - 明确标注“ATLAS 自动发布失败”，说明具体原因；
   - 不得声称已经发布。

## 内容质量与安全规则

- 报告正文、条目、作者信息、来源 URL、发布日期都必须有依据；无法核验的内容明确标注，不得补造。
- 区分事实、分析与推测；重大事实尽量交叉验证。
- 不为了满足数量而降低质量。
- 不得写入 GitHub token、密码或其他凭据。
- 不得将私人笔记、访问令牌或任何个人凭据放入公开仓库。
- 历史报告原则上只新增，不静默覆盖。只有同一日期、同一信息流的更正版本才更新对应文件，并在报告中标明更正说明。
