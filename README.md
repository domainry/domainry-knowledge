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

使用 `module.SQLBackend{DB, Dialect, Engine}` 创建后端，`module.NewStore(backend, sources)` 创建数据仓库。`module.LegacyMigrations(dialect)` 返回保留原 SQL 的迁移历史；宿主拥有迁移账本。新宿主无需创建 Agent 会话表。

`module.NewService(repository, runtimeID, options)` 接受能力组合，不要求实现完整的 Agent ConversationRepository。与会话关联的附件 / 成果通过可选 `ContextReader` 和 `Sources` 接口复核来源；缺失来源能力时拒绝关联操作。

当前公共文件 / 资料库 DTO 仍沿用 Agent SDK 中已发布的兼容契约名称，以避免同时破坏既有调用方；Knowledge 实现不导入 `domainry-agent`。旧 Agent 路由和数据库方法是兼容转发，既有执行账本中的原子提交仍由 Agent 宿主负责。

独立测试在无 Agent 表的数据库中验证个人资料库、成员隔离、文档版本、业务回执和产品 namespace 隔离。

结构化记录通过 `module.NewRecordStore(ctx, backend, hostMigrations, namespace)` 装配。产品和工具只依赖 `contract.Repository` 与 `contract.Validator`；校验和版本提交仍在一个事务中执行。

Agent 的应用层只引用本模块契约，由 Agent 装配层显式注入 `module.NewFactory()`。纯 Agent 可省略此 Factory；Knowledge 不再是 Agent 应用层的默认实现依赖。

## 通用文件与对象存储

独立 Knowledge 服务同时提供 `domainry-knowledge-sdk/files.Service`。上传、读取、下载、
资源绑定和删除都复用 `_artifacts` / `_artifact_bindings` 元数据，不会自动把普通文件加入
知识库或触发索引。IM、Delivery 等产品先完成自己的资源权限校验，再使用 `file_id` 调用
该能力；bucket 和 object key 不进入产品数据库。

二进制存储默认使用 `KNOWLEDGE_STORAGE_PATH/shared-artifacts`。生产环境设置
`KNOWLEDGE_FILE_STORAGE_DRIVER=s3` 后使用 S3-compatible 后端，AWS S3 与 MinIO 共用同一
适配器：

| 环境变量 | 说明 |
|---|---|
| `KNOWLEDGE_FILE_STORAGE_DRIVER` | `local` 或 `s3`，默认 `local` |
| `KNOWLEDGE_S3_REGION` | S3 区域，使用 `s3` 时必填 |
| `KNOWLEDGE_S3_BUCKET` | bucket，使用 `s3` 时必填 |
| `KNOWLEDGE_S3_PREFIX` | 对象前缀，默认 `domainry-knowledge` |
| `KNOWLEDGE_S3_ENDPOINT` | S3-compatible endpoint；MinIO 配置此项 |
| `KNOWLEDGE_S3_FORCE_PATH_STYLE` | MinIO 通常设为 `true` |

访问凭据使用 AWS SDK 默认凭据链，例如 `AWS_ACCESS_KEY_ID` 和
`AWS_SECRET_ACCESS_KEY`。非本机 endpoint 必须使用 HTTPS。

数据库适配使用宿主注入的 `domainry-orm` SQLite / MySQL / PostgreSQL profile，不复制三套业务仓库。结构化记录迁移以 `knowledge_records` owner 提交至宿主的唯一 `_schema_migrations`；事务重试覆盖序列化、死锁与并发幂等回执冲突。旧 SQLite TEXT/BLOB 表和历史版本兼容保留。真实三库验收位于 Agent 的 `internal/infrastructure/persistence/webhost/portable_test.go`，同时覆盖独立 Knowledge / Todo 和宿主迁移锁。
