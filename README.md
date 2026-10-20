# Domainry Knowledge

统一知识库、文件、成果文档和检索，分离文件存储与索引的状态和权限。

- `module/module.go`：稳定的薄公开入口。
- `contract/module.go`、`contract/service.go`：服务、来源授权与装配端口；宿主不需导入 Knowledge 实现。
- `contract/record.go`：结构化记录、不可变版本及仓库端口，不依赖数据库。
- `internal/application/knowledge/`：资料库、文件、索引与清理任务、来源权限复核。
- `internal/infrastructure/persistence/database/knowledge/`：资料库、成员、来源绑定、文档、附件、索引任务、成果版本及导出。
- `internal/infrastructure/persistence/database/record/`：产品结构化记录的 SQLite / MySQL / PostgreSQL ORM 实现；提供 namespace / runtime / workspace / user 隔离、CAS 和幂等回执。
- `internal/infrastructure/{attachmentstorage,artifactstorage,documentstorage}/`：文件实现。
- `internal/infrastructure/filestore/`：不依赖 Agent 会话模型的通用文件能力，产品只持有不透明 `file_id`。
- `internal/infrastructure/{provider,connectortransport}/`：远程资料库 / 附件索引适配和受控传输。
- `artifact`、`extraction`：可公开复用的确定性格式与抽取库，无存储或网络实现。
- `internal/architecture/`：目录与依赖方向检查。

- `internal/assembly/module/`：Factory 校验模块配置、连接资料来源、注册持久来源并创建服务。

## 独立嵌入

使用 `module.SQLBackend{DB, Dialect, Engine}` 创建后端，`module.NewStore(backend, sources, artifacts)` 创建数据仓库。`module.EnsureSchema` 把唯一的 Knowledge `version=1` 新建 schema 交给宿主迁移账本；表统一使用 `_knowledge_*` 命名，新宿主无需创建 Agent 会话表。

`module.NewService(repository, runtimeID, options)` 接受能力组合，不要求实现完整的 Agent ConversationRepository。与会话关联的附件 / 成果通过可选 `ContextReader` 和 `Sources` 接口复核来源；缺失来源能力时拒绝关联操作。

Knowledge 实现不导入 `domainry-agent`。需要与 Agent 宿主协作的会话附件、成果和资料库 DTO 通过 Agent SDK 契约交互；知识库内部没有旧数据库方法或旧表名转发层。涉及宿主执行账本的原子提交仍由 Agent 宿主负责。

独立测试在无 Agent 表的数据库中验证个人资料库、成员隔离、文档版本、业务回执和产品 namespace 隔离。

结构化记录通过 `module.NewRecordStore(ctx, backend, hostMigrations, namespace)` 装配。产品和工具只依赖 `contract.Repository` 与 `contract.Validator`；校验和版本提交仍在一个事务中执行。

Agent 的应用层只引用本模块契约，由 Agent 装配层显式注入 `module.NewFactory()`。纯 Agent 可省略此 Factory；Knowledge 不再是 Agent 应用层的默认实现依赖。

## 前端复用

`frontend/` 提供模块自有的 `@domainry/knowledge-ui` React 入口。它包含知识检索、文档阅读、资料库文档管理、上传下载和受限在线预览，不依赖 Agent 页面、Agent 路由或 Agent 会话状态。宿主只实现公开 `KnowledgeClient`，负责把自身认证后的 HTTP Adapter 映射到模块合同，并把 `KnowledgeWorkspace` 嵌入宿主自己的登录、导航和产品壳。

这样只组合 Knowledge 的产品可以直接复用同一套功能页面；Agent 只是其中一个适配宿主，不再拥有或复制知识库页面源码。

## 文档大小与格式边界

- Knowledge 原件上限为 1 GiB。浏览器按固定 8 MiB 分片上传；HTTP、SDK、本地文件和 S3 路径均按流处理。服务端只在全部分片到齐且整文件 SHA-256 通过后发布原件，原件随后可下载并通过 Range 进行 PDF、音视频预览。
- 当前官方 Knowledge Base Connector 的直接索引入口上限为 10 MiB。根因是现行 `kb-search-api` 推送路由受 API Gateway body 上限约束，并非所有 Builder 解析器都只支持 10 MiB。
- Connector 逐格式暴露 Builder 能力：音视频整文件处理上限 20 MiB、单资产 20 MiB、单图增强 8 MiB、结构化分析产物 16 MiB。只有“整文件处理上限”会参与文件级索引判断；资产、增强和分析产物预算不能反向缩小 PDF、Office、图片或表格的上传上限。
- 因此在现行底层入口不变时，超过 10 MiB 的原件仍可安全保存和查看，但会明确标记为暂不可索引。要让不同格式真正获得大于 10 MiB 的可索引上限，需要底层新增对象引用或分片上传入口，不能只修改前端或 Connector 常量。
- 安全检查本身保持流式：结构门禁使用固定缓冲，ClamAV 使用 `INSTREAM`，S3 Office ZIP 检查使用定长 Range `ReadAt`，不会把 1 GiB 原件整体放进内存。部署 ClamAV 时必须让服务端 `StreamMaxLength`、`MaxFileSize`、`MaxScanSize` 覆盖业务原件上限；服务端返回流大小超限时文档保持隔离并记录 `document_security_size_unsupported`，不会反复重试或误报安全。

## 通用文件与对象存储

独立 Knowledge 服务同时提供 `domainry-knowledge-sdk/files.Service`。上传、读取、下载、
资源绑定和删除都复用 `_artifacts` / `_artifact_bindings` 元数据，不会自动把普通文件加入
知识库或触发索引。IM、Delivery 等产品先完成自己的资源权限校验，再使用 `file_id` 调用
该能力；bucket 和 object key 不进入产品数据库。

二进制存储默认使用 `KNOWLEDGE_STORAGE_PATH` 下的私有本地目录，适合单实例或挂载持久卷的部署；没有 S3 也可以完整使用。生产环境设置
`KNOWLEDGE_FILE_STORAGE_DRIVER=s3` 后，通用文件服务和知识库原件使用
S3-compatible 后端；Knowledge 内部生成的 `artifact-bodies` 目前仍保存在 `KNOWLEDGE_STORAGE_PATH`，所以两种 driver 都必须提供持久本地路径。浏览器上传的每个 8 MiB 分片先进入不可读的暂存区，重复提交会核对分片哈希并返回服务端已连续保存的位置；重新选择同一文件可从该位置继续。本地后端以原子 rename 发布，S3 后端在最后一片到齐后把暂存对象流式合并为 Multipart Upload，长度和整文件 SHA-256 全部核对后才发布，失败会 Abort。读取使用定长 Range
`ReadAt` 和连续 Range GET 支持大文件下载、Office 安全检查、PDF 与媒体预览，不在服务
内存中聚合完整文件。AWS S3 与 MinIO 共用同一适配器：

| 环境变量 | 说明 |
|---|---|
| `KNOWLEDGE_FILE_STORAGE_DRIVER` | `local` 或 `s3`，默认 `local` |
| `KNOWLEDGE_DOCUMENT_UPLOAD_IDLE_TIMEOUT` | 未完成分片上传的空闲保留时间，默认 `24h`，范围 `5m` 到 `720h`；每个成功持久化的分片都会续期 |
| `KNOWLEDGE_S3_REGION` | S3 区域，使用 `s3` 时必填 |
| `KNOWLEDGE_S3_BUCKET` | bucket，使用 `s3` 时必填 |
| `KNOWLEDGE_S3_PREFIX` | 对象前缀，默认 `domainry-knowledge` |
| `KNOWLEDGE_S3_ENDPOINT` | S3-compatible endpoint；MinIO 配置此项 |
| `KNOWLEDGE_S3_FORCE_PATH_STYLE` | MinIO 通常设为 `true` |

访问凭据使用 AWS SDK 默认凭据链，例如 `AWS_ACCESS_KEY_ID` 和
`AWS_SECRET_ACCESS_KEY`。非本机 endpoint 必须使用 HTTPS。

数据库适配使用宿主注入的 `domainry-orm` SQLite / MySQL / PostgreSQL profile，不复制三套业务仓库。结构化记录 schema 以 `knowledge_records` owner 提交至宿主的唯一 `_schema_migrations`；事务重试覆盖序列化、死锁与并发幂等回执冲突。当前仅定义未上线环境所需的新建 schema，不包含旧表迁移或历史兼容。真实三库验收位于 Agent 的 `internal/infrastructure/persistence/webhost/portable_test.go`，同时覆盖独立 Knowledge / Todo 和宿主迁移锁。
