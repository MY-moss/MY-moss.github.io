# 上岸模拟器 · GitHub Pages 静态版

这是从主项目复制出来的独立静态发布版本，不包含 Node 服务端、账号数据或运营数据。

## 发布

1. 将本目录单独复制或推送到 GitHub 仓库。
2. 在仓库 Settings → Pages 中选择 GitHub Actions。
3. 工作流会自动发布当前目录。

## 配置二维码地址

编辑 `js/static-config.js` 中的 `gameUrl`：

- 留空：自动使用当前页面地址。
- 填写完整 `https://...` 地址：本地生成海报时也会指向线上游戏。

海报包含游戏二维码和 `reward-qrcode.png` 赞赏码。海报数据只在本地 Canvas 中生成，不会上传存档。

## 第一轮升级（历史开发记录）

参见 [审计与测试报告](docs/ROUND1_AUDIT_2026-11-23.md)。运行 `node --test tests/game-smoke.test.mjs tests/round1-engine.test.mjs` 与 `node tests/round1-simulation.cjs` 可以在无服务端的环境下验证核心脚本和剧情模拟。浏览器交互测试需单独安装 Playwright。此次修改不包含任何 ATLAS 或日报系统。

## 第二轮：全事件结构审计与内容精修（历史开发记录）

参见 [第二轮审计与验证报告](docs/ROUND2_CONTENT_AUDIT_2026-11-23.md)、[全部保留事件检查目录](docs/EVENT_CONTENT_AUDIT_ROUND2.csv) 和 [更新日志](docs/CHANGELOG_ROUND2.md)。未修改线上主分支。

## 正式版 v2.1.86 — 剧情与事件质量升级

本版本继承第一、第二轮修复，并新增林默创业求助的三路线、两年及五年后果；优化了全部标记的高优先级文案和过长选项；修复跨年事件可能覆盖已到期事件链的问题。浏览器存档保持本地，更新不会删除存档。

- [第三轮质量审计、真实模拟及发布记录](docs/ROUND3_RELEASE_2026-11-23.md)
- [第三轮 1,799 个事件逐项结构目录](docs/EVENT_CONTENT_AUDIT_ROUND3.csv)
- [第三轮更新日志](docs/CHANGELOG_ROUND3.md)
- 验证：`node --test tests/game-smoke.test.mjs tests/round1-engine.test.mjs tests/round2-content.test.mjs tests/round3-content.test.mjs`、`node tests/round3-simulation.cjs`。

## v2.1.87 · 生命周期/晋升规则修复

参见 [第四轮审计与长局统计](docs/ROUND4_AUDIT_2026-11-23.md) 与 [更新日志](docs/CHANGELOG_ROUND4.md)。修复在退休年龄附近有剧情时可能丢失决策、返聘事件抢占剧情，以及晋升资格误用累计工龄的问题；不重置存档。
