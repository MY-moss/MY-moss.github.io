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

## 第一轮升级（未正式发布）

参见 [审计与测试报告](docs/ROUND1_AUDIT_2026-11-23.md)。运行 `node --test tests/game-smoke.test.mjs tests/round1-engine.test.mjs` 与 `node tests/round1-simulation.cjs` 可以在无服务端的环境下验证核心脚本和剧情模拟。浏览器交互测试需单独安装 Playwright。此次修改不包含任何 ATLAS 或日报系统。
