# Knowledge 页面编辑与协作补齐 TODO

状态：P0-P7 基础能力已实现并通过回归；P8-P13 飞书对标阶段待开发

更新日期：2026-10-20

## 0. 目标

在现有 `domainry-knowledge` 的资料库、成员、文件入库、检索和来源复核能力之上，补齐一套真正可用的知识页面产品：页面树、在线编辑、草稿、发布版本、历史、评论、成员协作、审计与检索。

目标不是复制 XWiki，也不是把文件管理改名成“页面”。需要保留 Domainry 当前更强的模块边界、文件安全、异步索引和来源复核，同时补上 `kb-wiki` 已经具备的日常知识维护体验。

## 1. 调研结论与代码基线

### 1.1 当前已经有的能力

- `internal/application/knowledge/knowledge_library.go` 已有个人库、共享库、成员列表及 `reader / editor / manager` 三种资源角色，并在操作前后重新执行宿主授权。
- `internal/infrastructure/persistence/database/knowledge/knowledge_library_store.go` 已有工作区隔离、实时成员过滤、最后一名 manager 保护和基于 `revision` 的 compare-and-set。
- `internal/application/knowledge/knowledge_document.go` 与 `knowledge_document_worker.go` 已有不可变原件、分片上传、安全扫描、持久任务、索引、重试、重建索引和删除恢复。
- `internal/application/knowledge/knowledge_document_source.go` 已在检索、读取、历史复用时复核当前库权限、文档版本、索引代次和内容摘要。
- `frontend/src/KnowledgeWorkspace.tsx` 已有检索、资料库、知识源、文件和成员页面；`frontend/src/types.ts` 通过 `KnowledgeClient` 保持产品路由、凭证和 UI 包解耦。
- 当前数据库由 `internal/infrastructure/persistence/database/knowledge/migrations.go` 的 fresh schema version 1 一次建立，符合“未上线、直接改最终结构”的前提。

### 1.2 当前真正缺失的能力

- 数据库没有 page、draft、published version、comment、page attachment 或 page access 记录。
- `KnowledgeClient` 没有页面树、编辑、版本、评论、协作者目录或有效权限解释接口。
- 当前成员界面只能手工输入 `user_id`，没有姓名、邮箱、头像、状态或成员搜索。
- 当前 Knowledge 没有 source-owned `ActionDefinition` manifest。库和文档权限仍由 `domainry-agent-sdk/knowledge_library_http.go`、`knowledge_document_http.go` 定义，再由 `domainry-agent/internal/assembly/web/knowledge_libraries.go` 解析 Identity 主体并执行。
- 当前库角色判断散落在 application service 和 store；如果继续为页面逐个增加字符串判断，权限语义会继续分叉。
- 当前远端检索主要使用“每个资料库一个阅读范围”。它还不能安全表达单页例外权限，所以不能先做一个只在前端隐藏页面的“页面 ACL”。
- 当前前端依赖中没有富文本编辑器或 CRDT/实时协同基础设施；多人同时光标、离线合并不能假装已经存在。

### 1.3 `kb-wiki` 能力的准确参照

`kb-wiki/verdent/kb-wiki-verdent-ui/README.md` 明确把页面树、新建、编辑、历史、权限、评论、附件和账号操作交给 XWiki 原生能力；`kb-wiki/verdent/DESIGN.md` 进一步定义了搜索、复制、重命名、删除、页面权限和用户组等完整页面流程。

因此 `kb-wiki` 的页面能力确实更完整，但根本原因是它复用了 XWiki 18.7 的成熟页面引擎，不是 `verdent` 目录重新实现了一个编辑内核。Domainry 当前的差距是页面领域本身不存在，而不是少几个按钮。

需要吸收的产品能力：

- 页面树、面包屑和库内导航；
- 阅读、编辑、历史、复制、移动、归档与恢复；
- 评论、回复、解决状态和成员提及；
- 清楚展示继承权限与直接权限；
- 服务端授权、乐观锁和有效权限解释。

不照搬的部分：

- 不引入 XWiki 页面引用、宏执行、脚本权限或 Wiki 管理概念；
- 不建立第二套账号、角色或组织体系；
- 不把浏览器计算的权限结果当作安全边界；
- 不把页面正文和文件原件混成同一个业务实体。

## 2. 固定架构决策

### 2.1 页面与文件是两个领域实体

- `KnowledgePage` 是可变的知识内容，具有父子层级、草稿、发布版本、评论和协作状态。
- `KnowledgeDocument` 继续表示上传的不可变原文件及其安全扫描、原件存储和索引生命周期。
- 页面发布后生成一个“检索投影”，复用现有文档索引 worker、来源复核和 citation 体系，但页面表仍是页面内容的唯一业务真相。
- 文件不能因为被某页引用就改变所有权；页面附件只保存到现有文档的关系，不复制 bucket key、body ref 或 provider credential。

根本原因：当前文档管线假定原件不可变，并围绕字节数、SHA-256、安全扫描和远端索引状态建模。把每次页面编辑直接写成 `KnowledgeDocument`，会把每次按键变成上传/扫描/索引问题，也无法正确表达草稿和发布历史。

### 2.2 草稿、版本和索引分离

- 自动保存只更新一份当前草稿，使用 `expected_draft_revision` 做 CAS。
- 发布在一个事务中生成不可变版本并更新页面的 `published_version`。
- 恢复历史版本的含义是“复制旧版本为新草稿”，不能修改旧版本。
- 只有发布版本进入检索；草稿、未发布评论和编辑中间态永不进入模型上下文。
- 页面标题、层级和正文的发布快照必须共同版本化，避免历史正文指向当前标题或当前父节点。

### 2.3 第一阶段做可靠异步协作，不先做实时共编

- 第一阶段支持自动保存、CAS 冲突、版本历史、评论、回复、提及和协作活动。
- 同一草稿发生并发修改时返回明确冲突，前端提供“重新载入 / 复制我的内容 / 对比后合并”，禁止最后写入者静默覆盖。
- 多人光标、选区同步、离线合并和 CRDT 放在独立阶段；在当前仓库没有协同协议、状态存储或前端依赖的情况下，不把它混进基础页面模型。
- 即使以后增加 CRDT，发布版本、权限和检索投影仍以服务端页面版本为准，CRDT 只负责编辑会话。

### 2.4 页面首期继承资料库权限

- 首期所有页面继承所在资料库的成员角色，不提供单页例外权限按钮。
- `reader / editor / manager` 是 Knowledge 拥有的资源角色；Identity 角色不是资料库成员关系，二者不能合并成一张表。
- 单页或子树例外权限必须等远端检索权限投影、批量 token 上限和结果复核方案完成后再开放。

根本原因：当前一个资料库使用一个受信阅读范围。若只在页面 UI 上增加“私有”开关，远端检索仍可能按资料库范围召回该页面，形成假权限。首期统一继承库权限是当前代码上唯一完整闭环的做法。

### 2.5 Identity 管功能权限，Knowledge 管资源关系

一次页面请求必须同时通过两道门：

```text
已认证主体
  -> Identity exact Action permission：这个人是否可以执行 pages.update
  -> Knowledge library membership：这个人是否可以编辑这一座资料库
  -> 页面状态/CAS/作者等领域规则
  -> 执行写入、审计，发布时异步生成检索投影
```

- Identity 的 `RoleSchema.Permissions[]` 继续是功能 Action grant 的唯一真相。
- Knowledge 只保存资源成员关系，不复制 Identity PermissionDefinition、角色定义、组织树或账号资料。
- Identity 的 `data_scope` 不用来伪装资料库成员关系；库成员是 Knowledge 自己必须实时读取的领域事实。
- 前端按钮可按能力隐藏，但 application service 必须再次校验，SaaS challenge 和进程内调用语义必须一致。

## 3. 权限体系接入 TODO

### P0.1 收回 Knowledge Action 所有权

- [x] 在 `domainry-knowledge`/`domainry-knowledge-sdk` 定义唯一 `AuthorizationActions()`，canonical owner 固定为 `module:knowledge`。
- [x] 每个 HTTP、SaaS RPC、worker 管理命令都必须有稳定 Action key 和显式 `authenticated` 或 `signed` strategy。
- [x] 角色授权 Action 只携带同 key、同 owner 的 `PermissionDefinition`，不再维护另一份 operation-to-permission map。
- [x] 使用 `domainry-foundation/action.Registry` 和 `modulehttp.ValidateAuthorizationProjection` 校验 manifest、route、handler 与 OpenAPI 一致。
- [x] host 在 ready 前合并 Action、向 Identity reconcile `module:knowledge` 的完整 PermissionDefinition snapshot，成功后才挂载路由。
- [x] 直接删除 `domainry-agent-sdk/knowledge_library_http.go`、`knowledge_document_http.go` 中由 Agent 拥有的 Knowledge 权限定义，并让 Agent 消费 Knowledge manifest；不做 alias、双 grant 或角色迁移。
- [x] 产品 API 统一为 `/knowledge/...` 的 module-owned 路由；产品壳仍可拥有浏览器页面路由，但不能再拥有后端 Knowledge Action 真相。

第一批 Action 至少包括：

| 能力 | exact Action/Permission |
| --- | --- |
| 资料库 | `knowledge.libraries.list/create/get/update/archive/restore` |
| 成员 | `knowledge.library_members.list/set/remove` |
| 页面 | `knowledge.pages.list/get/create/update/move/copy/archive/restore/publish` |
| 版本 | `knowledge.page_versions.list/get/restore` |
| 评论 | `knowledge.page_comments.list/create/update/resolve/delete` |
| 文件 | 将现有 list/get/upload/download/retry/reindex/delete/transfer 收敛到 `knowledge.documents.*` |
| 知识源 | 将现有 list/bind 收敛到 `knowledge.sources.*` |
| 权限解释 | `knowledge.access.explain` |

### P0.2 集中资源角色策略

- [x] 新建一份 code-owned `KnowledgeResourcePolicy`，集中声明每个 Action 所需的最低库角色和附加规则。
- [x] application service 只用 stable Action key 调用授权，不再传 `libraries_update`、`documents_upload` 这类无 namespace 字符串。
- [x] store 只保护数据不变量和 workspace/library membership，不重复解释 Identity 功能权限。
- [x] 每次敏感读取、写入提交前及耗时外部调用后重新验证当前成员与 Identity 主体，保持当前“撤权立即收敛”的行为。
- [x] 统一 403、404、409：无成员关系不泄露资源存在性，Action 被拒绝返回 403，CAS 冲突返回 409。

资源角色矩阵固定为：

| 操作 | reader | editor | manager | 额外领域规则 |
| --- | --- | --- | --- | --- |
| 页面/版本/评论读取、检索 | 是 | 是 | 是 | 页面和库都必须可用 |
| 新建评论、回复 | 是 | 是 | 是 | 还需 exact comment Action |
| 修改/删除评论 | 本人 | 本人 | 任意 | 服务端校验作者或 manager |
| 新建/编辑/移动/复制/发布页面 | 否 | 是 | 是 | archived 库不可写 |
| 归档/恢复页面 | 否 | 是 | 是 | 子树影响必须预检 |
| 上传、重试、重建索引、移动文件 | 否 | 是 | 是 | 维持现有文档状态机限制 |
| 资料库设置、知识源、成员 | 否 | 否 | 是 | 至少保留一名 manager |

### P0.3 有效权限解释

- [x] 后端实现 `knowledge.access.explain`，返回 Identity Action 决策、来源角色、Permission 状态、库成员角色、页面继承来源及最终结论。
- [x] 禁止前端自己拼“为什么有权限”；前端只渲染服务端解释。
- [x] 在 Domainry Admin 现有“角色与权限 / 有效权限工作台”中展示 `module:knowledge` Actions；继续复用当前 Permission catalog 和 RoleSchema 发布流程，不另做 Knowledge 角色配置页。
- [x] Knowledge 管理页增加“访问说明”抽屉，面向普通 manager 展示该用户对当前库/页面的最终能力，不暴露 AccessBundle 原始 JSON。

## 4. 页面领域模型 TODO

### P1.1 SDK 合约先行

- [x] 在 `domainry-knowledge-sdk` 定义 `KnowledgePage`、`KnowledgePageDraft`、`KnowledgePageVersion`、`KnowledgePageComment` 和分页 DTO。
- [x] 所有写入 DTO 包含 `client_id` 或幂等键；更新包含明确的 `expected_revision`。
- [x] 页面 ID 使用稳定随机 ID；URL slug、标题和树路径不是权限身份，也不进入主键。
- [x] 正文 DTO 带 `content_schema_version`、`content`、`content_sha256` 和服务端派生的 `plain_text`/摘要元数据。
- [x] 冻结正文格式前完成编辑器 spike：验证中文输入、表格、代码块、链接、图片、粘贴清洗、撤销、移动端和确定性纯文本导出。
- [x] 正文格式必须由 Knowledge 拥有且经服务端 schema 校验；不接受任意脚本、事件属性、iframe 或未经清洗的 HTML。

### P1.2 Fresh schema

直接修改 `SchemaMigrations` 的 version 1 和 schema ownership；不新增升级 migration，不做旧数据回填。

- [x] `_knowledge_pages`：`scope_key + page_id` 主键，显式索引 `library_id / parent_page_id / rank / state / revision`，payload 保存完整领域快照。
- [x] `_knowledge_page_drafts`：每页一个当前协作草稿，保存 base published version、draft revision、正文、hash、最后编辑人和时间。
- [x] `_knowledge_page_versions`：不可变发布版本，保存页面标题、父节点、rank、正文、hash、作者、发布时间和发布说明。
- [x] `_knowledge_page_comments`：评论/回复、锚点、引用版本、作者、resolved 状态、revision 和时间。
- [x] `_knowledge_page_attachments`：页面与现有 `KnowledgeDocument` 的关系、标题、排序及创建者；不复制文件内容地址。
- [x] 为库树遍历、同级排序、版本倒序、评论线程和主体删除增加有界索引。
- [x] 把新表加入 `ownership.go`，逐表写清 workspace scope、保留策略、主体擦除及级联删除规则。
- [x] 所有 DDL/DML 使用 `domainry-orm`；SQLite、MySQL、PostgreSQL 从同一 schema 声明渲染。

### P1.3 页面不变量

- [x] page、parent、library 必须属于同一个 `scope_key`；禁止跨库挂父节点。
- [x] 防止把页面移动到自己或自己的后代下面；一次事务内检查并更新。
- [x] 同级 `rank` 使用可重排的稳定排序键；批量重排使用一次 CAS，不逐行无保护更新。
- [x] 库归档后只读；页面归档后从默认树和检索中移除，但保留版本、评论和审计。
- [x] 删除采用归档/保留策略；首期不提供物理删除按钮。
- [x] 标题、正文、评论和发布说明分别设定 UTF-8 与字节上限；服务端拒绝 NUL、非法编码和超限内容。
- [x] 个人库仍只允许所有者；共享库按实时成员关系列页，不向无权用户返回整棵树后再由前端过滤。

## 5. 编辑、版本与检索 TODO

### P2.1 最小页面纵向切片

- [x] 完成 list tree、get page、create page、save draft、publish page 五个后端操作。
- [x] 所有操作按“Identity exact Action -> library role -> page invariant -> CAS”顺序执行。
- [x] 新建页面产生空草稿，不自动产生发布版本或索引内容。
- [x] 自动保存做去抖和串行化；同一客户端重试使用同一幂等键。
- [x] 409 响应携带当前 draft revision、base version 和安全的冲突摘要，不把无权正文带回调用方。
- [x] 发布事务同时写不可变版本、更新 page 指针并持久记录索引意图；索引服务暂时不可用不能丢失发布结果或意图。

### P2.2 发布版本历史

- [x] 版本列表展示版本号、作者、时间、发布说明和内容摘要。
- [x] 版本详情按当下权限读取；曾经能读不代表当前还能读。
- [x] 提供服务端 diff 输入，前端显示标题、层级和正文差异；不在浏览器拉取无界历史后计算。
- [x] “恢复此版本”只创建新草稿；再次发布才形成新版本。
- [x] 当前页面读取默认返回已发布版本；编辑者可显式请求草稿，reader 永远收不到草稿。

### P2.3 页面检索投影

- [x] 为 `KnowledgeDocument` 增加明确的 projection kind/origin，使文件原件和页面发布投影可区分。
- [x] 页面发布将规范正文确定性导出为 UTF-8 索引内容，并记录 page ID、published version、内容 hash 和库权限摘要。
- [x] 复用现有 document job 的 lease、fence、重试、shadow reindex、旧 generation 清理和来源复核；不再造一套无恢复能力的 page worker。
- [x] 扩展 content replacement：新发布版本先生成新 body/hash 和新远端 generation，确认索引后原子切换，再清理旧 generation。
- [x] 文件列表默认只显示用户上传文件；页面检索投影不能冒充附件出现在文件管理页。
- [x] citation 映射回 page ID、page version 和当前可打开的产品页面；读取引用时再次校验当前库成员和发布版本。
- [x] 页面归档、本地撤权或索引版本不一致时，在请求远端前拒绝旧 citation/历史复用。
- [x] 草稿内容绝不进入索引、citation、Agent 历史或搜索片段。

## 6. 用户与协作 TODO

### P3.1 成员体验

- [x] 删除前端手工 `user_id` 输入框，改为宿主注入的 `KnowledgePrincipalDirectory` 搜索接口。
- [x] 搜索结果只返回当前调用者有权查看的 active Identity 用户，展示姓名、邮箱、头像、状态；Knowledge 持久化仍只保存稳定 user ID。
- [x] 成员列表批量解析用户展示信息；Identity 用户不可达时显示“账号不可用”，不把缓存资料当成有效主体。
- [x] 添加成员时继续调用 Identity 实时校验；移除 inactive 用户仍允许，以免坏成员无法清理。
- [x] 增加邀请前权限预览：显示目标用户将得到的库角色、允许动作和影响页面数。
- [x] 成员角色变更、移除和最后 manager 冲突都使用当前 library revision。

首期只做直接用户成员。Identity 当前没有通用“协作群组”实体，且 `domainry-identity/docs/usage/organizations.md` 明确临时项目小组应属于业务域，而不是伪造成组织树。因此：

- [x] 不把 Identity Role 当成员组；Role 只负责功能 Action。
- [x] 不把组织节点自动展开成资料库成员；避免调岗后无意改变内容 ACL。
- [x] 如果后续确需团队成员组，在 Knowledge 内定义团队生命周期和成员关系，或先建立跨产品统一协作组模块，再接入；不得复制 Identity 组织树。

### P3.2 评论、回复、提及

- [x] 评论默认绑定 page ID 与被评论的 published version；块级锚点必须包含稳定 node ID 和版本。
- [x] 页面修改导致锚点失效时标记“原位置已变化”，不悄悄指向新文本。
- [x] reader 可评论；作者可编辑/删除自己的评论，manager 可管理全部评论。
- [x] 支持回复、解决/重新打开和未解决筛选；所有更新使用 comment revision CAS。
- [x] `@` 提及只搜索当前资料库成员，避免借提及框枚举整个工作区账号。
- [x] 评论提交事务只保存 user ID；展示信息实时从 Identity 目录解析。
- [x] 通知在评论事务提交后以稳定事件 ID 发布；重复投递必须幂等，通知失败不能回滚已经提交的评论。
- [x] 被提及者打开通知时重新校验当前库权限；已经移出的成员不能通过旧通知读取页面。

### P3.3 审计与活动

- [x] 为 Audit SDK 注册 Knowledge-owned event family，或先完成平台认可的 owner 接入；不把 Knowledge 事件塞进不属于它的 Identity family。
- [x] module host 提供窄 `AuditAppender`，SaaS 通过受信 service boundary 写审计；Knowledge 不直接持有 Audit store。
- [x] 审计至少覆盖：库设置、成员变更、页面创建/移动/归档/恢复/发布、版本恢复、评论管理、知识源和文件管理。
- [x] 审计记录 actor、workspace、library/page/version、request/idempotency、before/after 摘要；正文和评论全文不进入审计 metadata。
- [x] 普通“页面活动”由版本与评论投影生成；治理审计由 Audit 查询，不新增第三份 activity 真相。

## 7. 前端页面体系 TODO

保持 `@domainry/knowledge-ui` 产品无关：宿主负责认证、产品路由和 Identity 目录，组件负责知识功能页面。

### P4.1 信息架构

- [x] 将当前“检索 / 我的资料库”两页扩展为：知识首页、资料库页面树、页面阅读、页面编辑、版本历史、评论、文件、成员与设置。
- [x] 左侧为资料库与页面树；中间为阅读/编辑主区；右侧按需展示大纲、评论、活动或访问说明。
- [x] 页面树只加载已授权节点，支持分页/懒加载、展开状态、拖动移动和键盘导航。
- [x] 面包屑由 page ID 链路生成；slug 或标题变化不破坏页面身份。
- [x] 全局搜索与当前资料库局部筛选分开，局部筛选不能冒充服务端全文检索。
- [x] 建立明确的空、加载、保存中、已保存、发布中、索引中、冲突、无权、归档和失败状态。

### P4.2 阅读与编辑

- [x] 阅读页包含标题、正文、作者、发布时间、版本、面包屑和可执行动作。
- [x] 编辑器支持标题、正文、自动保存、手动发布、退出保护和冲突处理。
- [x] 图片粘贴/附件上传必须走现有受权文件接口，禁止 data URL 或外部任意 HTML 直接进入正文。
- [x] 保存状态基于服务端 revision，不用“请求已发出”冒充“已保存”。
- [x] 发布后显示索引状态；页面可立即阅读，但索引未确认前不宣称可搜索。
- [x] 历史页支持版本列表、双版本对比、查看旧版本和恢复为草稿。

### P4.3 协作与权限界面

- [x] 成员抽屉使用 Identity 用户搜索和头像/名称，不再要求管理员复制用户 ID。
- [x] 评论抽屉支持线程、提及、解决状态和版本锚点。
- [x] 访问说明清楚区分“Identity 功能权限”和“资料库成员角色”，展示最终结果与失败层级。
- [x] manager 能看到成员变更影响；普通成员不能获取完整成员目录或权限配置。
- [x] 所有隐藏按钮只用于体验优化；服务端拒绝必须有可读错误状态。

## 8. 页面级权限阶段

P0-P4 已完成，当前继续实现本阶段。

### P5.1 权限模型

- [x] 页面访问模式只允许 `inherit` 或 `restricted`，不引入任意 allow/deny 表达式。
- [x] `inherit` 完全继承资料库角色；`restricted` 只允许 manager 和获得 page/subtree grant 的资料库成员。
- [x] grant 只保存 Knowledge 资源角色与稳定 user ID，scope 只允许 `page` 或 `subtree`。
- [x] manager 始终保留治理访问，防止页面成为无人可管理的孤岛。
- [x] 移动子树前计算权限影响并二次确认；移动与权限继承更新在同一事务提交。
- [x] 提供服务端 effective access 解释，明确直接 grant、祖先 grant、库角色和 Identity Action 的来源。

### P5.2 检索安全前置条件

- [x] 为每个发布页面生成基于稳定 page ID 的非空权限 token；ACL 变化不能改变页面身份。
- [x] 真实测量当前知识服务的 query permission ID 数量/字节上限，不能照搬 `kb-wiki` 文档数字或沿用当前配置上限作猜测。
- [x] 选择并验收“大库”策略：受权 token 分批检索并全局合并排序，或使用独立安全分区；禁止截断 token 后继续查询。
- [x] search/fetch/history/citation 全部重新计算当前页面权限，并核对命中 page ID、版本和 token。
- [x] ACL 收紧本地立即生效；远端权限投影未确认期间页面不得进入搜索结果。
- [x] 页面权限 UI 只能在以上链路通过真实撤权、并发和故障验收后开放。

## 9. 实时共编阶段

### P6.1 协同协议验证

- [x] 选型前先验证编辑器文档模型与服务端 canonical content 可无损互转。
- [x] 设计 collaboration session、连接鉴权、心跳、presence、断线恢复、快照压缩和更新保留上限。
- [x] 每次建立/恢复连接都重新校验 Identity Action 与当前库角色；成员移除后主动断开连接。
- [x] CRDT 更新只形成草稿，不能直接生成发布版本、索引内容或审计中的正文。
- [x] 发布仍由一个受权用户发起，基于冻结的协同快照产生不可变版本。
- [x] 覆盖双人同时输入、离线重连、乱序包、服务重启、撤权断连、超大文档和恶意更新测试。

### P7.1 原生知识类型与编辑器

- [x] 页面创建协议持久化不可变 `content_type`，新增条目直接成为当前选中节点的子项，并立即选中、进入对应编辑器、聚焦标题。
- [x] 支持文档、多维表格、表格、幻灯片、问卷、思维笔记、画板、思维导图、流程图九种原生类型；上传及导入继续生成独立文件知识条目。
- [x] 每种结构化内容都有服务端 schema 根节点校验、大小/深度/节点数量边界、内容哈希和确定性纯文本抽取。
- [x] 结构化草稿沿用 CAS 自动保存、不可变发布版本、历史恢复、评论、权限和索引投影；检索只接收服务端抽取的纯文本，不索引原始 JSON。
- [x] 普通文档使用 Block JSON 作为唯一 canonical content，BlockNote 绑定 Y.Doc、Yjs 合并块树与富文本节点；服务端串行确认时钟、校验 schema/hash 并持久化检查点。其它原生编辑器继续使用整草稿 CAS，服务端只为 document 建立协作会话。
- [x] 覆盖八种结构化类型的创建、默认内容、保存、纯文本抽取和发布测试，并在浏览器逐项验证编辑器分发与子节点交互。

## 10. 开发顺序

必须按以下顺序推进，避免 UI 先于安全与数据真相：

1. P0：Knowledge Action manifest、Identity reconcile、集中资源角色策略、有效权限解释。
2. P1：SDK DTO、正文格式决策、fresh schema 和页面不变量。
3. P2：页面树/草稿/发布最小纵向切片，再接版本和现有检索 worker。
4. P3：Identity 用户目录、成员 UX、评论/提及、通知和审计。
5. P4：完整阅读、编辑、历史和协作页面体系。
6. P5：有真实检索权限闭环后再开放页面/子树例外权限。
7. P6：最后评估并实现实时共编。
8. P7：在稳定的页面版本链上增加原生类型协议、编辑器分发和类型化索引文本抽取。

跨仓依赖顺序：

```text
domainry-foundation / identity-sdk / audit-sdk（仅缺失契约时）
  -> domainry-knowledge-sdk
  -> domainry-knowledge backend/module/SaaS
  -> @domainry/knowledge-ui
  -> domainry-agent 与其它宿主接入
  -> domainry-plane 管理端权限投影
```

## 11. 验收矩阵

### 11.1 权限

- [x] 没有 exact Action Permission，即使是库 manager 也不能执行对应动作。
- [x] 有 exact Action Permission 但不是库成员，不能确认库或页面是否存在。
- [x] reader、editor、manager 的所有允许/拒绝组合与矩阵一致。
- [x] 角色权限停用、库成员移除、角色降级后，新请求立即拒绝；旧 citation、历史和通知链接也不能绕过。
- [x] embedded 与 SaaS 对同一主体、Action 和资源事实返回相同结论。
- [x] 前端直接伪造 role、user ID、page ID、library ID 或 revision 不得扩权。

### 11.2 编辑与版本

- [x] 两个编辑者基于同一 revision 保存时，只有一个成功，另一个得到可恢复的冲突结果。
- [x] 自动保存不生成发布版本，不触发索引。
- [x] 发布产生不可变版本；恢复旧版本不会改写历史。
- [x] 页面移动防止循环，跨库移动被拒绝。
- [x] 库/页面归档后只读且不再进入默认检索。
- [x] 服务重启后草稿、版本、索引意图和冲突语义不变。

### 11.3 检索与来源

- [x] 只索引发布版本，检索引用能回到正确 page/version。
- [x] 新版本未索引完成时旧版本是否继续可搜必须有明确状态；不能把“已发布”描述成“已索引”。
- [x] generation 切换、响应丢失、重试、乱序回执和旧 generation 清理不泄露错误版本。
- [x] 页面撤权、归档或删除后，在请求远端和把内容交给模型之前拒绝访问。
- [x] 页面投影不出现在文件列表，文件原件也不会被误当成可编辑页面。

### 11.4 协作与用户

- [x] 成员搜索只显示调用者可见的 active 用户，目标不可用时不能添加。
- [x] inactive/已删除成员仍可被 manager 移除。
- [x] 评论作者、manager 和普通成员的更新/删除边界正确。
- [x] 提及对象仅限当前可见成员，重复通知幂等，旧通知重新鉴权。
- [x] 审计不保存正文、评论全文、凭证或原件内容。

### 11.5 前端

- [x] 桌面与窄屏均能完成：建页、编辑、自动保存、发布、查历史、恢复、评论、成员管理。
- [x] 键盘导航、焦点恢复、编辑器可访问性和未保存离开提示通过。
- [x] 所有操作具有 loading/empty/error/denied/conflict/indexing 状态，不出现无响应按钮。
- [x] 浏览器不保存 provider credential、Identity AccessBundle 或自算权限缓存。

## 12. 飞书对标差距结论

P0-P7 完成的是 Knowledge 页面、权限、版本、检索与原生编辑器的基础纵向链路，不代表已经达到飞书产品深度。当前代码的主要差距不是缺少更多菜单名称，而是以下能力尚未形成统一闭环：

- `frontend/src/pageTypeRegistry.ts`、`frontend/src/editors/KnowledgeEditor.tsx` 和 `frontend/src/editors/documentBlocks.tsx` 分别硬编码页面类型、编辑器和内容块；新增类型仍需修改多处代码，没有统一注册协议。
- 上传文件仍属于独立 `KnowledgeDocument` 列表，不是页面树中的正式节点，不能自然成为当前页面的子知识条目。
- `knowledgeReference` 和 `syncedBlock` 只保存手工输入的 page/block ID；没有选择器、真实内容解析、内嵌编辑或来源订阅。
- 文档协作已经使用 Yjs，但传输仍是 2 秒 HTTP 轮询，并且每次提交完整 Yjs state；第一阶段需要改成“HTTP POST 上行 + SSE 下行”，随后补 Awareness 光标、离线持久队列、增量快照压缩和多实例通知。
- 协作会话只支持 `document`；其它原生编辑器继续整份 JSON CAS 保存。
- 评论后端具备 anchor 字段，但前端当前提交空锚点，尚不能针对选区或内容块评论并定位。
- 多维表格目前只有基础文本字段和行列编辑；其它原生编辑器主要保存第三方组件快照，尚未形成 Knowledge 自己拥有的领域协议。
- 原生类型服务端主要校验根字段、大小和深度；尚未逐类型校验字段、视图、公式、关系、引用等业务不变量。
- 搜索只有查询词和知识库范围，没有类型、作者、时间、标签、路径等筛选，也不能稳定跳转到命中的页面 Block。

飞书对标阶段必须解决这些结构性问题，禁止继续通过增加静态 Slash 菜单项伪装成功能完成。

## 13. 飞书对标开发 TODO

### P8.1 统一知识树与文件页面

- [ ] 在 `domainry-knowledge-sdk` 增加正式的 `file` 页面内容类型，正文只保存稳定 `document_id`、展示模式和标题等引用元数据。
- [ ] 上传及导入必须在当前选中页面下创建子页面；没有选中页面时才创建根节点。
- [ ] 保留现有 `KnowledgeDocument` 作为不可变原件、安全扫描、解析、索引和下载的领域真相；页面只能受权引用，不复制原件或下载地址。
- [ ] 文件页面与其它页面统一支持树排序、移动、复制、归档、权限、评论、版本、搜索和面包屑。
- [ ] 删除左侧树中“独立文件列表 + 页面树”双轨渲染，统一由页面树返回并渲染全部知识条目。
- [ ] 文件页面支持 PDF、Office、图片、音频和视频预览；每次预览和下载继续实时鉴权。
- [ ] 文件被删除、隔离、扫描失败或撤权时，引用页面显示明确状态，不保留可绕过安全检查的缓存 URL。

验收：在任意页面上点击“上传及导入”，文件成为该页面的子节点；刷新、移动、搜索、授权和归档后的行为与普通页面一致。

### P8.2 PageType 与 Block 注册表

- [ ] 在 SDK 定义稳定的页面类型 ID、能力位和 canonical content 合约；禁止前端自行发明未注册类型。
- [ ] 后端建立 code-owned `PageTypeRegistry`，每个类型注册空内容、严格校验器、纯文本抽取器、摘要抽取器、引用扫描器和发布前检查。
- [ ] 前端建立 `PageTypeDefinition` 注册表，统一注册图标、名称、创建动作、编辑器、只读渲染器、预览器、导入器和能力提示。
- [ ] 建立 `BlockDefinition` 注册表，统一注册 BlockNote spec、Slash 菜单、只读渲染、服务端校验标识、纯文本抽取规则和所需权限。
- [ ] `KnowledgeEditor`、新建菜单、Slash 菜单和服务端类型分发全部从注册表生成，不再维护平行硬编码数组。
- [ ] 注册表只允许编译期可信实现，不执行正文携带的脚本、HTML、iframe 或动态插件代码。
- [ ] 为重复类型 ID、缺失 validator/renderer/extractor、前后端能力不一致增加启动失败和契约测试。

验收：新增一个测试页面类型或测试 Block 时，只需注册定义和实现，不需要修改工作台、树、新建菜单、编辑器 switch 或索引 worker。

### P9.1 富文档基础块

- [ ] 支持正文、H1-H3、有序/无序/任务列表、引用、分割线、代码块、折叠块、分栏、目录和高亮块。
- [ ] 代码块支持语言选择、语法高亮、复制和换行设置。
- [ ] 公式使用安全的 KaTeX/MathJax 渲染，支持行内公式和独立公式块，不再只显示 LaTeX 源码。
- [ ] 表格支持增删行列、拖动调整、合并单元格、对齐、表头、背景色和复制粘贴。
- [ ] 支持图片、视频、音频和文件 Block；上传必须走现有受权文件接口，禁止外部任意资源 URL 和 data URL 入库。
- [ ] 图片支持说明、替代文本、缩放、对齐、裁剪、替换和预览。
- [ ] 支持网页书签卡片、知识页面卡片、人员卡片和受控外部嵌入；服务端执行 URL allowlist 与元数据清洗。
- [ ] 支持人员、日期、页面和 Block 的行内 Mention；Mention 使用稳定 ID，展示资料实时解析。
- [ ] 支持 Block 多选、拖动、复制、剪切、复制链接、转换类型、折叠和批量删除。
- [ ] 支持 Markdown、纯文本、Office 内容粘贴清洗，以及 Block JSON/Markdown/PDF 导出。
- [ ] Slash 菜单支持分组、搜索、最近使用、键盘导航、Hover、二级菜单和权限禁用说明。

### P9.2 任务、模板与业务内容块

- [ ] 建立 Knowledge-owned 任务块协议：状态、负责人、截止时间、提醒、优先级和来源 Block ID。
- [ ] 任务状态更新与文档版本解耦，但必须保留权限、审计和幂等事件。
- [ ] 支持按钮、日期提醒、投票、信息收集、子页面列表、页面目录和知识库动态等业务块。
- [ ] 建立文档模板协议和模板库，支持从模板创建页面、保存当前页面为模板及模板版本管理。
- [ ] 模板实例创建后拥有独立内容身份；模板更新不得静默覆盖现有页面。
- [ ] 第一阶段不复制飞书全部应用条目；没有真实领域服务的菜单项不得上线。

验收：任务块能指派当前知识库成员并触发幂等通知；模板能创建完整子树；页面内媒体、表格、公式和目录在发布版本、历史恢复和搜索中保持一致。

### P10.1 HTTP POST 上行 + SSE 下行

- [x] 保留现有 `connect / sync / close / publish` 服务语义；客户端编辑继续通过受权 HTTP POST 提交，SSE 只负责服务端到客户端的实时事件推送。
- [x] 新增 `GET /knowledge/libraries/{libraryID}/pages/{pageID}/collaboration/{sessionID}/events` 事件流接口。
- [x] SSE 事件至少包括 `update`、`snapshot`、`presence`、`revoked` 和 `heartbeat`；事件 envelope 使用现有 collaboration DTO，不再定义第二套更新真相。
- [x] SSE `id` 使用单调递增的 `server_clock`；客户端重连携带 `Last-Event-ID`，服务端从对应 clock 继续发送。
- [x] 如果 `Last-Event-ID` 仍在有界 update log 中，按顺序补发缺失 update；如果已经超过保留窗口，发送当前 durable snapshot 后从新 clock 继续。
- [x] 每次建立事件流都重新校验当前 Identity Action、资料库角色、页面权限、session 归属和有效期；无权用户不能根据 page/session ID 判断资源是否存在。
- [x] 权限撤销、成员移除、页面归档或 session 失效时发送 `revoked` 并立即关闭事件流；后续重连继续拒绝。
- [x] 如果浏览器认证依赖自定义 Header，使用 `fetch()` 读取 `text/event-stream`，或由 `connect` 签发一次性短期 stream token；禁止把长期凭证或 AccessBundle 放进 SSE URL。
- [x] 设置正确的 `Content-Type: text/event-stream`、禁用代理缓冲，并定期发送注释 heartbeat，避免网关和负载均衡器静默断开长连接。
- [x] 服务端从 durable event store 按 clock 读取事件；进程内 notifier 只负责唤醒等待中的流，不作为事件真相，丢失唤醒不能导致事件丢失。
- [x] 前端删除当前 2 秒 `sync` 轮询；SSE 断开时进入明确的 reconnecting 状态并自动退避重连，不允许后台同时保留第二套轮询循环。
- [x] 正文 POST、光标 POST 和空闲心跳分开节流：正文批量合并发送，光标/选区高频但可丢弃，空闲 session 只做低频续租。
- [x] 发布仍冻结服务端已确认的 collaboration snapshot；SSE 消息本身不能直接发布、建索引或修改不可变版本。

实现与验收记录（2026-10-21）：上行继续使用受权 POST，下行改为基于 durable clock/update log 的认证 SSE；完成 update 补发、snapshot 回退、presence、heartbeat、撤权关闭、退避重连和独立节流。单元/契约/架构测试、主仓库与 SDK 全量 Go 测试、前端类型检查及两种生产构建均通过；真实双窗口验证远端正文即时出现，SSE 重连瞬间的本地编辑不丢失，重新加入后从 durable snapshot 恢复。

验收：两个浏览器同时打开文档时，远端更新不等待 2 秒轮询即可出现；断流重连能按 `Last-Event-ID` 补发，事件缺口能回退到 snapshot；撤权后已有流立即关闭且无法重连。

### P10.2 Yjs 增量、Awareness、离线恢复与传输升级

- [ ] 从 `Y.Doc` 的 update 事件收集真正的 Yjs 增量 update；日常编辑不得继续把完整 `YjsState` 同时冒充 update 和 checkpoint 上传。
- [ ] 客户端合并短时间内产生的增量并批量 POST；服务端按 update ID 幂等写入有界 update log，按大小和数量阈值合并 durable snapshot。
- [ ] Awareness 只保存短期光标、选区、当前 Block 和客户端状态，不进入不可变版本、正文、搜索索引或治理审计。
- [ ] 编辑器内显示不同用户的真实光标、选区、姓名和颜色；右侧在线列表只作为补充视图。
- [ ] 支持断线自动重连、指数退避、离线 IndexedDB 草稿、待发送队列和页面关闭前安全落盘。
- [ ] 权限撤销、成员移除、页面归档后清理服务端 session、SSE 流、客户端待发送队列和 Awareness。
- [ ] 标题使用独立 Yjs 字段或明确的版本冲突策略，不再仅按服务端到达顺序覆盖。
- [ ] 加入快照大小、增量大小、更新速率、在线人数、端到端延迟、SSE 重连次数、事件补发量和压缩耗时指标。
- [ ] 为 notifier 定义独立接口；多实例部署接入 Pub/Sub 唤醒对应页面事件流，durable event store 仍是断线补发和恢复真相。
- [ ] 前端 collaboration transport 与 Yjs 文档绑定解耦，后续切换 WebSocket 时不修改 Block JSON、Yjs 文档、发布版本和权限协议。
- [ ] 只有当高频光标/画板拖动、二进制传输、连接规模或延迟 SLO 无法由 POST + SSE 满足时，才把 transport 升级为 WebSocket。
- [ ] 升级 WebSocket 后也继续复用 session、server clock、update log、snapshot、发布和鉴权边界，不建立第三套协作协议。

验收：日常更新发送增量而非完整 state；断网编辑后自动合并；服务重启、跨实例通知、撤权和乱序更新不丢内容、不越权。传输层替换测试证明 SSE/WebSocket 不改变 canonical content 和发布结果。

### P10.3 评论、修订与编辑归属

- [ ] 选中文字或 Block 时可创建评论，提交稳定 `node_id`、quote 和发布版本。
- [ ] 点击评论定位并高亮原位置；原 Block 删除或内容变化时明确显示锚点失效。
- [ ] 评论支持回复、解决、重新打开、表情回应、提及和任务指派。
- [ ] 增加修订模式，支持建议插入、建议删除、评论、接受、拒绝和撤回。
- [ ] 增加连续编辑历史和 Block 级 Diff，展示谁在什么时间修改了哪些 Block；发布版本历史继续保持不可变。
- [ ] 在线编辑统计从“累计编辑过几个 Block”升级为当前光标位置、当前选区和最近活动；不得把统计当成权限或审计真相。

### P10.4 原生编辑器协作

- [ ] 为多维表格定义字段、记录、视图和单元格粒度的协作操作，不再整份 JSON CAS。
- [ ] 为电子表格评估并接入 Univer 的协作协议或建立受控操作日志，覆盖单元格、样式、公式、合并和工作表结构。
- [ ] 为画板、思维导图和流程图定义 node/edge 粒度操作与 Awareness。
- [ ] 幻灯片按 slide/element 粒度保存和合并；问卷按 component 粒度保存和合并。
- [ ] 所有类型继续使用统一发布快照和不可变版本，不允许编辑器绕过 Knowledge 发布边界。

### P11.1 多维表格产品化

- [ ] 字段支持文本、数字、单选、多选、人员、日期、附件、复选框、进度、评分、公式、关联和查找引用。
- [ ] 支持表格、看板、甘特、画册和表单视图；所有视图共享同一数据源。
- [ ] 支持筛选、排序、分组、冻结、字段隐藏、行高、颜色规则和视图分享。
- [ ] 公式和关联由后端 canonical 协议校验，禁止把 AG Grid 临时状态直接当业务真相。
- [ ] 支持记录详情页、批量操作、CSV/XLSX 导入导出和附件字段。
- [ ] 支持表单收集、仪表盘和基础自动化；自动化必须经过独立 Action 授权和幂等执行。
- [ ] 支持表级、视图级、字段级和记录级权限；搜索和导出必须遵守相同数据权限。

验收：同一份数据能在至少表格、看板、甘特和表单四种视图之间切换，字段类型、公式、关联、权限和实时协作全部由后端契约约束。

### P11.2 其它原生应用产品化

- [ ] 电子表格补充图表、数据验证、条件格式、透视表、保护范围、导入导出和多人协作。
- [ ] 幻灯片补充主题、版式、母版、文本与媒体元素、演讲者备注、放映和 PDF/PPTX 导出；不能继续把 Excalidraw 画布等同于完整幻灯片产品。
- [ ] 问卷补充发布链接、提交权限、答卷存储、条件逻辑、截止时间、防重复提交、统计分析和导出。
- [ ] 画板补充便签、形状、连接线、图层、框选、模板、评论、协作和图片/PDF 导出。
- [ ] 思维笔记补充折叠、缩进、聚焦、完成状态和文档互转。
- [ ] 思维导图与流程图补充主题、布局、样式、模板、导入导出、评论和协作。
- [ ] 每个类型建立 Knowledge-owned canonical schema；第三方编辑器快照只能作为实现细节，不能成为无法解释的长期公共协议。

### P11.3 原生应用真实内嵌

- [ ] Slash 菜单选择原生应用后，在同一事务中创建当前页面的子页面并插入引用 Block。
- [ ] 引用 Block 不允许手填原始 Page ID；提供有权限页面选择器和新建流程。
- [ ] 卡片模式展示标题、类型、状态、更新时间和权限状态；内嵌模式加载对应只读或可编辑视图。
- [ ] 内嵌编辑复用目标页面权限、版本和协作会话，不复制内容到父文档。
- [ ] 支持固定版本引用与实时引用；固定版本必须明确显示版本号，实时引用撤权后立即关闭。
- [ ] 防止循环内嵌和超深嵌套，服务端维护引用图并设置深度与节点上限。

验收：在文档输入 `/多维表格` 后无需输入 ID，即可创建子页面并直接编辑；刷新、复制、移动、撤权和删除后引用状态正确。

### P12.1 知识组织与发现

- [ ] 增加页面收藏、最近访问、最近编辑、订阅、快捷入口和回收站。
- [ ] 增加页面标签、负责人、状态、自定义属性和定期复核时间。
- [ ] 建立页面引用与反向链接索引，展示“引用了谁”和“被谁引用”。
- [ ] 支持关联页面、同名消歧、页面别名和知识关系图；稳定 page ID 仍是唯一身份。
- [ ] 增加子页面列表、目录导航和知识库动态 Block。
- [ ] 页面移动、重命名、归档或撤权后同步更新引用状态，不通过复制标题维持假关联。

### P12.2 搜索体验

- [ ] 全文搜索支持知识库、内容类型、作者、更新时间、标签、页面路径和发布状态筛选。
- [ ] 搜索结果区分页面、文件和原生应用，展示命中 Block、路径、类型、作者、版本与索引状态。
- [ ] 点击结果必须打开原页面并定位命中 Block/单元格/节点，而不是只展示索引片段。
- [ ] 增加当前页面内查找、当前子树搜索、最近搜索和键盘快速打开。
- [ ] 搜索建议与结果继续执行实时 ACL，撤权后缓存建议和旧结果均不能读取内容。
- [ ] 为中文分词、标题权重、路径权重、标签权重、同义词和拼写纠正建立可回归相关性测试集。

### P13.1 企业权限与内容治理

- [ ] 在现有直接用户成员之外接入受控协作组或组织/部门主体；不得在 Knowledge 内复制 Identity 组织树。
- [ ] 支持组织内链接分享、指定成员分享和受控外部分享，并提供过期时间、密码和访问撤销。
- [ ] 增加复制、下载、打印、导出和创建副本策略，所有入口由服务端强制执行。
- [ ] 增加密级、动态水印、敏感内容策略和外发审批挂钩能力。
- [ ] 增加页面所有者、内容管理员、归档保留期、定期复核和治理审计查询。
- [ ] 权限继续维持 Identity Action、知识库角色、页面/子树 ACL 三层计算；任何分享能力不得绕过当前 `access.explain` 真相。

### P13.2 开放能力、集成与 AI

- [ ] 提供页面树、页面内容、评论、任务、多维表格和搜索的受权 OpenAPI。
- [ ] 提供页面发布、评论提及、任务变化、权限变化和索引完成 Webhook；事件必须幂等、可重放并重新鉴权。
- [ ] 建立受信应用注册和 EmbedProvider 接口，再逐步接入日程、会议、群卡片、任务系统、Jira 和外部网页卡片。
- [ ] AI 写作、总结、翻译、改写和问答只能读取当前有权的已发布内容；草稿辅助必须在当前编辑会话内显式触发。
- [ ] AI 生成内容必须显示来源与执行状态，写回正文前由用户确认，不允许后台静默改写页面。
- [ ] Agent 引用必须回到稳定 page/version/block，继续复核当前权限、版本和内容 hash。

## 14. 飞书对标实施顺序与发布门槛

开发顺序固定为：

1. P8：统一文件页面、真实子页面引用和注册表，先消除当前模型与交互双轨。
2. P9 + P10：补齐富文档核心块，先实现 POST 上行 + SSE 下行，再补 Yjs 增量、Awareness、离线恢复、选区评论和修订能力；达到明确升级门槛后再引入 WebSocket。
3. P11：优先做深多维表格，再依次补电子表格、问卷、画板、思维导图、流程图和幻灯片。
4. P12：在稳定页面和引用模型上增加反向链接、元数据、收藏订阅和高级搜索。
5. P13：最后开放企业分享治理、应用集成、OpenAPI 和 AI 能力。

每个阶段必须满足以下发布门槛：

- [ ] 功能拥有真实后端领域模型、权限检查、持久化和失败状态，不能只有前端菜单或静态卡片。
- [ ] canonical content、编辑器运行时和索引纯文本可确定性互转，发布后能完整恢复。
- [ ] 阅读、编辑、历史、复制、移动、归档、权限、搜索和协作对该类型的行为一致。
- [ ] 服务重启、双客户端并发、撤权、超限、恶意内容、断网重连和索引失败测试通过。
- [ ] 浏览器实测桌面端、窄屏、键盘操作、Hover、焦点、空状态、加载状态和错误状态。
- [ ] 大型依赖按页面类型懒加载，构建产物设置体积预算；不得让电子表格或画板拖慢知识工作台首屏。

明确不采用的实施方式：

- [ ] 不平均扩充九个编辑器；先完成“文档 + 多维表格 + 文件 + 实时协作”闭环。
- [ ] 不继续向硬编码数组堆 Slash 菜单项。
- [ ] 不把第三方编辑器私有 JSON 未经约束地升级为 Domainry 公共协议。
- [ ] 不把 SSE 描述成双向协议：编辑更新固定通过受权 POST 上行，SSE 只负责服务端事件下行。
- [ ] 不在 URL 中携带长期凭证、Identity AccessBundle 或可重放的永久 stream token。
- [ ] 不在缺少指标和压测结论时提前引入 WebSocket；达到高频交互、二进制传输、连接规模或延迟门槛后再升级。
- [ ] 不为了外观对标而跳过权限、版本、索引、安全扫描和来源复核。

## 15. 对标参考

- 飞书云文档实时协作、任务、同步块与业务卡片：<https://www.feishu.cn/product/docs-inapp>
- 飞书知识库企业、知识库、页面三层权限：<https://www.feishu.cn/hc/zh-CN/articles/821998241087-%E5%BF%AB%E9%80%9F%E4%BA%86%E8%A7%A3%E7%9F%A5%E8%AF%86%E5%BA%93%E6%9D%83%E9%99%90>
- 飞书多维表格字段、视图和模板能力：<https://www.feishu.cn/content/article/7574713887522639055>
- 飞书文档修订模式：<https://www.feishu.cn/hc/zh-CN/articles/364198000460-%E4%BD%BF%E7%94%A8%E6%96%87%E6%A1%A3%E7%9A%84%E4%BF%AE%E8%AE%A2%E6%A8%A1%E5%BC%8F>

## 16. 明确不做

- [x] 不使用 Domainry Builder。
- [x] 不创建 worktree、新分支或 `go.work`。
- [x] 不做旧表迁移、兼容 endpoint、旧 permission alias 或双轨 DTO；代码未上线，直接修改 fresh schema 和当前调用方。
- [x] 不先实现实时多人光标再补版本/权限。
- [x] 不把 Identity Role、Organization Unit、Permission Set 当作资料库协作组。
- [x] 不允许浏览器提交任意 permission ID、远端 ACL、provider credential 或有效权限结论。
- [x] 不索引草稿，不在审计/通知中复制正文全文。
- [x] 不因页面能力建设削弱现有文件安全扫描、来源复核、worker fence、删除恢复或工作区隔离。
