# ATLAS 公开发布协议

唯一内容源：`MY-moss/MY-moss.github.io` 的 `main` 分支，文件 `inspiration/data/index.json`。网站：https://my-moss.github.io/atlas/ 。旧的 `MY-moss/atlas-data` 私人仓库流程已停用。

公开频道仅允许：`world`、`reading`、`inspiration`、`opensource`。严禁将个人每周知识回顾 `knowledge` 写入公开索引。该任务已经暂停。

## 原子发布

1. 研究、核对来源，编写可以公开传播的报告。排除私人上下文、帐号凭据、私人文件、个人学习/阅读记录等隐私数据。
2. 用 GitHub `fetch_file` 读取 `inspiration/data/index.json`，同时取得最新 SHA。文件不存在时报告错误，不要重建丢失历史。
3. 保留 `schemaVersion:1`、`updatedAt`、`channels[]` 和全部现有 `reports[]`。每份报告结构为 `{channel,date,title,summary,items,sections?}`，其中每项至少有 title，尽可能有 url/source/why/tags。
4. 按 `channel + date` 做 upsert，其他报告一律保留。必要时将新频道元数据加入 `channels[]`。按日期降序排序，更新 `updatedAt`。
5. 调用 GitHub `update_file`，提供最新 blob SHA。发生冲突时必须重新读取并合并，不得覆盖别的任务新增的报告。
6. 拿到 commit SHA 才能说“已提交”；网页部署成功或线上实际读取成功才能说“已上线”。失败则完整保留报告并注明原因。

GitHub Pages 前端公开无登录。严禁向公开数据或代码提交个人隐私、GitHub PAT、API 密钥、私人邮件、账号信息和受限材料。每条事实应有可靠可追溯的 HTTPS 来源。

## 私人信息保护

任何源自私人聊天、用户个人信息、未公开项目或个人知识回顾的内容均不得通过公开频道转发或改写发布。提交前确认频道为上述四类，且不含任何私人材料。
