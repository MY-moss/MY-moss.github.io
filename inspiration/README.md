# 灵感研究所 · Inspiration Hub

独立静态子站，部署在 `https://my-moss.github.io/inspiration/`。不替换父站首页，不依赖数据库、服务器或模型 API。

## 技术与发布
- 原生 HTML / CSS / JavaScript，静态文件，无构建步骤。
- 内容源：`data/index.json`。
- GitHub Pages 父仓库：`MY-moss/MY-moss.github.io`。
- 父仓库现有 GitHub Actions 会将整个仓库部署到 Pages；提交此目录的变更即可触发部署。
- 子目录有独立 Service Worker，scope 为 `/inspiration/`，避免与父站 PWA 缓存策略混用。
- 收藏保存在访问者本地浏览器，不上传数据。

## 日报数据结构
`data/index.json` 包含：
- `schemaVersion`
- `updatedAt`
- `reports[]`: 每日一期，按日期倒序。
- 每期包含 `channel`、`date`、`title`、`summary`、`theme`、`items[]`，可选 `sections[]` 用于趋势、噪音/信号和后续观察。
- 每个条目包含 `id`、`title`、`creator`、`category`、`url`、`source`、`why`、`method`、`uses`、`tags`、`age`。

## 内容频道\n- `inspiration`：每日灵感采集。\n- `opensource`：每周开源项目雷达。\n\n- 同一天可以存在多个频道报告，唯一键为 `channel + date`。\n\n## 每日自动发布
1. 先生成并核验当天 3–5 个精选条目。
2. 读取当前 `data/index.json`，按 `channel + date` upsert，禁止同一频道同一天重复；不同频道允许同日发布。
3. 写入完整的结构化内容，并更新 `updatedAt`。
4. 通过 GitHub Contents API 更新文件，提交到 `main`。
5. 父仓库 Pages workflow 自动部署。必须以提交成功为发布依据；不能仅凭创建文件就声称网站已更新。
6. 如果写入失败，保留日报并明确报告失败原因，不得伪造发布成功。

## 本地预览
直接打开 `index.html` 可能受浏览器本地文件跨域限制；推荐使用任意静态服务器，例如：
`python -m http.server 8000`
然后访问 `http://localhost:8000/`（从 inspiration 目录启动）。


## Privacy

The personal knowledge-review channel has been permanently excluded from the public site and public publishing workflow. Never publish private chat-derived or user-sensitive information.
