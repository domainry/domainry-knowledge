# Domainry Knowledge

Knowledge 是可独立运行的 SaaS，也是可嵌入其他产品的模块。它拥有资料库、页面、成员、来源绑定、原件、分片上传、索引任务、搜索和阅读能力。

## 依赖关系

独立产品的组合根位于 `internal/assembly/product`：

```text
knowledge-server（产品宿主）
├── Identity module
└── Knowledge module
    └── 可选 Knowledge Base provider
```

Identity 和 Knowledge 是宿主内的并列模块。宿主先初始化 Identity，再把认证后的请求主体注入 Knowledge HTTP Adapter；Knowledge 领域、SDK、存储和前端均不依赖 Agent。权限由 Identity Action 目录和 `knowledge_admin` 产品角色提供，浏览器不能提交或覆盖 `workspace_id`、`user_id`、`role_key` 等权威字段。

宿主拥有一份数据库连接和迁移账本。Identity 与 Knowledge 各自登记自己拥有的表，不会创建 Agent 会话表，也不使用 `go.work`。

## 本地启动

先构建真实产品前端，再启动服务：

```bash
cd frontend
npm install
npm run build:app
cd ..
APP_ENV=development KNOWLEDGE_ADMIN_PASSWORD='Knowledge@2026!' go run ./cmd/knowledge-server
```

默认地址是 `http://127.0.0.1:8092`，默认管理员账号是 `admin@knowledge.local`。生产环境必须显式设置 `KNOWLEDGE_ADMIN_PASSWORD`。

浏览器使用 Identity 的 `/auth/login`、`/auth/refresh` 和 `/auth/logout`。短期 access token 只保存在页面内存，refresh token 只存在 Identity 设置的 HttpOnly Cookie 中。资料库、页面、成员和文档请求全部调用真实的 `/knowledge/*` HTTP Adapter；前端没有内存假数据或模拟上传。

## 作为独立组件运行

业务产品需要把普通附件字节和元数据交给 Knowledge 统一保存时，启动无前端的 `knowledge-saas`。它提供 Knowledge SaaS RPC 和通用文件服务；普通文件上传不会自动加入资料库或触发索引。

本地文件模式：

```bash
KNOWLEDGE_SERVICE_ACCESS_TOKEN='replace-with-a-secret' \
KNOWLEDGE_RUNTIME_ID='facility_ops' \
go run ./cmd/knowledge-saas
```

生产环境必须使用 S3 兼容存储，AWS S3 与 MinIO 使用同一个实现：

```bash
APP_ENV=production \
KNOWLEDGE_SERVICE_ACCESS_TOKEN='replace-with-a-secret' \
KNOWLEDGE_RUNTIME_ID='facility_ops' \
KNOWLEDGE_FILE_STORAGE_DRIVER=s3 \
KNOWLEDGE_S3_REGION=us-east-1 \
KNOWLEDGE_S3_BUCKET=facility-files \
KNOWLEDGE_S3_PREFIX=facility/knowledge \
KNOWLEDGE_S3_ENDPOINT=https://minio.example.com \
KNOWLEDGE_S3_FORCE_PATH_STYLE=true \
go run ./cmd/knowledge-saas
```

S3 凭据使用 AWS SDK 标准凭据链，不放进上述公开配置。`KNOWLEDGE_S3_ENDPOINT` 留空即使用 AWS S3；MinIO 配置 HTTPS Endpoint，并通常启用 path-style。服务默认监听 `127.0.0.1:8093`，健康检查为 `/live` 与 `/ready`。调用方配置相同的 `KNOWLEDGE_RUNTIME_ID`、`KNOWLEDGE_SERVICE_ACCESS_TOKEN`，并把 `DOMAINRY_KNOWLEDGE_ENDPOINT` 指向该服务。

## 核心配置

| 环境变量 | 默认值或说明 |
|---|---|
| `KNOWLEDGE_HTTP_ADDR` | `127.0.0.1:8092` |
| `KNOWLEDGE_ORIGIN` | `http://127.0.0.1:8092`，必须与浏览器访问 Origin 完全一致 |
| `KNOWLEDGE_RUNTIME_ID` | `knowledge` |
| `KNOWLEDGE_WORKSPACE_ID` | `knowledge-workspace` |
| `KNOWLEDGE_APPLICATION_KEY` | `knowledge` |
| `KNOWLEDGE_DATABASE_PATH` | `data/knowledge.db` |
| `KNOWLEDGE_STORAGE_PATH` | `data/knowledge-storage` |
| `KNOWLEDGE_FRONTEND_PATH` | `frontend/app-dist` |
| `KNOWLEDGE_ADMIN_LOGIN` | `admin@knowledge.local` |
| `KNOWLEDGE_ADMIN_NAME` | `Knowledge Admin` |
| `KNOWLEDGE_ADMIN_PASSWORD` | 生产环境必填 |
| `KNOWLEDGE_DOCUMENT_UPLOAD_IDLE_TIMEOUT` | 默认 `24h`，允许 `5m` 到 `720h` |

独立组件还使用以下配置：

| 环境变量 | 默认值或说明 |
|---|---|
| `KNOWLEDGE_SAAS_HTTP_ADDR` | `127.0.0.1:8093` |
| `KNOWLEDGE_SERVICE_ACCESS_TOKEN` | 必填；调用方与服务共享的服务凭据 |
| `KNOWLEDGE_FILE_STORAGE_DRIVER` | 本地默认 `local`；生产必须为 `s3` |
| `KNOWLEDGE_S3_REGION` / `KNOWLEDGE_S3_BUCKET` | S3 模式必填 |
| `KNOWLEDGE_S3_PREFIX` | 可选对象键前缀，默认 `domainry-knowledge` |
| `KNOWLEDGE_S3_ENDPOINT` | MinIO 等 S3 兼容服务的 HTTPS Endpoint；AWS S3 留空 |
| `KNOWLEDGE_S3_FORCE_PATH_STYLE` | MinIO 常用 `true`，默认 `false` |

Identity 模块自身的项目配置仍使用 `IDENTITY_MODULE_*` 环境变量；数据库连接由产品宿主直接注入，Identity 不另开数据库。

## 真实检索和文档索引后端

未配置 provider 时，资料库和页面功能仍可使用，但不会伪装成已经具备远程检索或文档索引能力。配置下列变量后，产品会暴露名为 `primary` 的真实数据源，管理员先把资料库绑定到该来源，再上传文档：

| 环境变量 | 说明 |
|---|---|
| `KNOWLEDGE_PROVIDER_BASE_URL` | Knowledge Base API 的 HTTPS Origin |
| `KNOWLEDGE_PROVIDER_API_KEY` | 服务端凭据，不会下发浏览器 |
| `KNOWLEDGE_PROVIDER_TEAM_ID` | 上游团队 ID |
| `KNOWLEDGE_PROVIDER_KB_ID` | 上游知识库 ID |
| `KNOWLEDGE_PROVIDER_WORKSPACE_ID` | 可省略；默认使用 `KNOWLEDGE_WORKSPACE_ID` |
| `KNOWLEDGE_PROVIDER_DOCUMENT_MANAGEMENT` | 启用上传、索引和删除时设为 `true` |
| `KNOWLEDGE_PROVIDER_DOCUMENT_PERMISSION_IDS` | 服务端持有的文档权限 ID JSON 数组 |
| `KNOWLEDGE_PROVIDER_READ_PERMISSION_IDS` | 检索权限 ID JSON 数组 |
| `KNOWLEDGE_PROVIDER_TOP_K` | 检索条数，允许 1–20 |
| `KNOWLEDGE_PROVIDER_SEARCH_MODE` | `hybrid`、`dense` 或 `sparse` |
| `KNOWLEDGE_PROVIDER_RERANK` | 是否启用 rerank |
| `KNOWLEDGE_PROVIDER_RECORD_KINDS` | record kind JSON 数组 |
| `KNOWLEDGE_PROVIDER_RESPONSE_MAPPING` | search/fetch 响应到 citation 的严格 JSON 映射 |
| `KNOWLEDGE_PROVIDER_ANALYSIS_DOCUMENT_IDS` | 可参与结构化分析的文档 ID JSON 数组 |

文档原件上限是 1 GiB，浏览器和 HTTP Adapter 固定按 8 MiB 分片。每片及整文件都校验 SHA-256，全部分片完成前原件不可读。原件先写入 `KNOWLEDGE_STORAGE_PATH/documents`，随后由后台任务推送到绑定的 provider；远端索引状态和原件保存状态分开记录。

当前官方 Knowledge Base Connector 的直接索引入口上限是 10 MiB。超过该上限的原件仍可保存、下载和预览，但不会被错误标记为已索引。支持格式和更细的 Builder 限额以 provider 返回的能力为准，不由前端硬编码。

## 模块嵌入

公共契约位于 `domainry-knowledge-sdk`。宿主通过 `module.NewFactory().OpenModule(...)` 打开模块，并提供 `modulehost.Host` 的数据库、方言、ORM profile 和迁移登记器。HTTP 路由来自 SDK 的 ActionDefinition 清单；模块 Adapter 从 Identity 请求上下文构造 `knowledgesdk.Authority`。

`frontend/` 同时发布 `@domainry/knowledge-ui` 组件库。`frontend/app` 是独立 Knowledge 产品壳，负责 Identity 会话和真实 HTTP client；可复用 UI 本身不持有认证、路由或 provider 密钥。

## 验证

```bash
go test ./...
cd ../domainry-knowledge-sdk && go test ./...
cd ../domainry-knowledge/frontend && npm run check:app && npm test
```

产品集成测试覆盖真实的 HTTP 边界：Identity 登录、读取会话、创建资料库、绑定 datasource、带 `Content-Range` 与双 SHA-256 的文档分片上传，以及数据库重开后的会话和数据可用性。
