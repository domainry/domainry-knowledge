# 2026-10-23 全页面类型与文档块 Computer Use 验收

## 验收口径

- 使用 Chrome 直接操作 `http://127.0.0.1:8092`，不是只调用接口或读取代码。
- 每个原生页面至少完成一次真实编辑/业务操作、草稿保存、浏览器刷新回读。
- 10 种页面类型均已生成已发布版本，并在阅读态回读核心内容。
- 文档页按注册表逐项核对 29 种块类型，并额外覆盖列布局、4 种行内提及与行内公式。
- 服务端使用测试数据库 `/private/tmp/domainry-knowledge-layout-check.db`。

## 页面类型结果

| 页面类型 | 页面 ID | 实际验收路径 | 已发布版本 | 证据 |
| --- | --- | --- | ---: | --- |
| 文档 | `kpage_de12d5dd86525fb17b809e40b385f79a` | 29 种块、列布局、行内公式与提及、投票、任务、图片/音频/视频/文件、发布后阅读态回读 | 3 | [发布后阅读态](../../.codex-artifacts/cua-acceptance/document-published-read-roundtrip.jpg)、[布局与提及](../../.codex-artifacts/cua-acceptance/document-layout-inline-mentions.png)、[投票](../../.codex-artifacts/cua-acceptance/document-poll-vote-roundtrip.png)、[媒体](../../.codex-artifacts/cua-acceptance/document-media-blocks-visible.jpg) |
| 多维表格 | `kpage_b18215e2a5be02bebdc75f88fa3520de` | 新增字段与记录、保存、刷新回读、阅读态 | 2 | [多维表格回读](../../.codex-artifacts/cua-acceptance/multidimensional-table-roundtrip.png) |
| 表格 | `kpage_866d700e091c6b5121335f9734e7de57` | 单元格值、公式/合计、保存、刷新稳定性、阅读态 | 2 | [保存后](../../.codex-artifacts/cua-acceptance/spreadsheet-stable-after-save.png)、[刷新后](../../.codex-artifacts/cua-acceptance/spreadsheet-stable-after-reload-latest.png) |
| 幻灯片 | `kpage_93e2e290d1ae037083de2b8c79745960` | 形状下拉、形状/表格/图表/公式、保存、刷新回读、阅读态 | 2 | [幻灯片形状回读](../../.codex-artifacts/cua-acceptance/presentation-shape-roundtrip.png) |
| 问卷 | `kpage_48ad76ce09ba005bc97029bc6e52a7d6` | 真实提交答卷、评分统计、保存与统计回读 | 4 | [提交与统计](../../.codex-artifacts/cua-acceptance/form-submit-statistics.png) |
| 思维笔记 | `kpage_08a37314a65fcfb882e725b9276fa613` | 三级层级、完成状态、刷新回读、发布后阅读态 | 1 | [思维笔记回读](../../.codex-artifacts/cua-acceptance/mind-note-roundtrip.png) |
| 画板 | `kpage_d4e43179ce48d41dfb851d46d168e645` | 图形与连接关系、刷新回读、发布后阅读态 | 1 | [画板回读](../../.codex-artifacts/cua-acceptance/whiteboard-roundtrip.png) |
| 思维导图 | `kpage_8bab299860647c4c4aab23ad3c289191` | SWOT 模板、标签/备注/链接、刷新回读、发布后阅读态 | 1 | [思维导图回读](../../.codex-artifacts/cua-acceptance/mind-map-roundtrip.png) |
| 流程图 | `kpage_27202eb8d43abe89242367c0fe311654` | 节点、判断与连线、模板、刷新回读、发布后阅读态 | 1 | [流程图模板回读](../../.codex-artifacts/cua-acceptance/flowchart-template-roundtrip.png)、[发布后阅读态](../../.codex-artifacts/cua-acceptance/flowchart-published-read-roundtrip.jpg) |
| 文件页面 | `kpage_179b4011256c7d29f5a9d7aa05a70a3f` | 上传、扫描、预览、下载入口、刷新回读、发布 | 1 | [文件页回读](../../.codex-artifacts/cua-acceptance/file-page-upload-preview-roundtrip.png) |

新增下拉菜单已在真实页面展开核对，完整包含上述 10 类入口：[新增菜单](../../.codex-artifacts/cua-acceptance/create-menu-all-page-types.jpg)。

## 文档块覆盖

当前发布版本 3 在页面 DOM 中实存以下 29 种注册块类型：

`applicationCard`、`audio`、`bookmark`、`bulletListItem`、`button`、`callout`、`checkListItem`、`codeBlock`、`divider`、`externalEmbed`、`file`、`formula`、`heading`、`image`、`informationCollection`、`knowledgeActivity`、`knowledgePoll`、`knowledgeReference`、`knowledgeTask`、`numberedListItem`、`paragraph`、`personCard`、`quote`、`subpageList`、`syncedBlock`、`table`、`tableOfContents`、`toggleListItem`、`video`。

补充结构和行内类型：

- `columnList` 与 2 个 `column` 节点；
- 行内公式 `a^2+b^2=c^2`；
- 人员提及、日期提及、页面提及、内容块提及；
- 投票实际产生 1 张选票，发布后仍显示“通过 1 票、100%”；
- 图片、音频、视频、普通文件在刷新及发布后的阅读态均存在；
- 网页应用卡片能解析 HTTPS 地址；本地 YouTube 嵌入受平台限制时显示明确的平台播放入口，不再展示无反馈的黑屏。

## 根因与处理

### `knowledge.origin_required`

服务端在 `internal/assembly/saas/product/handler.go` 对浏览器 `Origin` 与配置的 `KNOWLEDGE_ORIGIN` 做严格同源校验。此前服务配置为 `http://localhost:8092`，浏览器实际打开 `http://127.0.0.1:8092`；两者虽然指向同一台机器，但属于不同 Origin，所以协作请求被拒绝。运行配置已统一为 `http://127.0.0.1:8092`，无须刷新即可自动重连，证据见 [协作自动重连](../../.codex-artifacts/cua-acceptance/collaboration-auto-reconnect-no-refresh.png)。

### 应用卡片无法解析

前端已经暴露“网页应用”类型，但独立产品的后端 `ApplicationCardProviders` 注册表没有默认 provider，导致引用只能进入不可用分支。当前代码在 `internal/infrastructure/applicationcardprovider/web.go` 提供只接受 HTTPS、且不抓取第三方内容的 `web` provider，并在 `internal/assembly/saas/product/host.go` 组装时补入默认 provider；前端默认 provider 同步设为 `web`。证据见 [应用卡片回读](../../.codex-artifacts/cua-acceptance/document-application-card-after-restart.jpg)。

### 一次图片安全拒绝不是产品故障

Computer Use 截图返回的是 JPEG 字节，最初测试时故意以 `image/png` 上传，文件结构门禁按内容签名识别到 MIME/字节不一致并正确拒绝，错误为 `document_type_mismatch`。改用正确的 `image/jpeg` 后，上传、渲染、刷新和发布回读全部成功。该路径证明文件安全门禁没有被前端声明类型绕过。

## 自动化校验

- 前端：`npm test`，115/115 通过。
- 前端库构建：`npm run build` 通过。
- 独立应用构建与初始包预算：`npm run build:app` 通过。
- Go：`go test ./...` 全仓通过。

构建日志只有第三方依赖的 `use client` 与大懒加载块提示，没有类型错误、测试失败或预算失败。
