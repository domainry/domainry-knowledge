# 页面 ACL 与实时共编验收证据

日期：2026-10-20（Asia/Shanghai）

## P5 页面权限

- `knowledge_page_access_store_test.go`
  - 只接受 `inherit` / `restricted`、`page` / `subtree` 和稳定 user ID。
  - 验证 manager 治理访问、当前成员约束、资料库角色上限、直接 grant、祖先 grant、移除成员清理 grant。
  - 验证 inherit 与 restricted 发布页均生成基于 page ID 的稳定非空 token，ACL revision 变化不改变页面身份。
  - 验证 ACL 收紧立即撤权，投影为 queued 时搜索 token 为空；仅 page ID、version、ACL revision、token 全部精确匹配且远端投影 ready 后才可读取。
  - 验证移动子树权限影响、二次确认 token、并发 ACL 变化导致旧确认失效，以及移动与动态继承结果同事务提交。
- `knowledge_page_authorization_test.go`
  - 验证 effective access 同时给出 Identity Action、资料库角色、直接/祖先页面来源和最终结论，并在返回前复核 exact Action。
- `knowledge_document_permissions_test.go`
  - 用 5000 个 page token 验证按实测边界分批、每批重复基础 token、不丢 token、跨批去重与全局排序后再 TopK。
  - 用长 token 验证 131072 ASCII JSON 字节边界，不按调用方配置猜测。
- 当前知识检索服务的数量/字节实测见 `2026-10-20-query-permission-limits.md`。
- `KnowledgePagesPanel.tsx`
  - 服务端 ACL 读取/CAS 保存、当前库成员搜索、page/subtree grant、投影确认中 fail-closed 提示。
  - 拖动移动先调用服务端影响预览；有影响时展示页面数和成员并要求二次确认 token。

## P6 实时共编

- `knowledge_page_realtime_store_test.go`
  - Block JSON canonical content、Yjs 检查点和 draft revision 经服务重启保持不变。
  - 服务端按 exact server clock 串行确认；过期写入不覆盖新状态，客户端合并 Yjs 检查点后重提 canonical Block JSON。
  - 心跳续租、block cursor/selection、用户编辑块数、事件作者、256 条更新保留窗口和窗口外完整检查点回退。
  - CRDT 更新只增加 draft revision，不创建版本或索引意图；受权 publish 冻结快照，后续更新不改变不可变版本。
  - 成员移除和普通草稿替换会持久撤销旧 session；重连从当前 canonical draft 开始。
  - 非法 base64、非法 Block JSON、hash 不一致和外部媒体 URL 被拒绝且事务回滚。
- `knowledge_realtime_test.go`
  - connect/sync 在仓储调用前后使用 exact Identity Action；首轮 Identity 拒绝不会进入仓储写入。
  - 协同审计仅包含 server clock、base64 update 字节数、编辑块数和 applied 状态，不包含正文、Block ID 或 Yjs payload。
- `frontend/test/collaboration.test.ts`
  - 大 Yjs update 的 base64 编解码无损。
  - 两个客户端以不同顺序合并并发 Yjs state 后得到相同结果。
  - canonical Block JSON 的 SHA-256 计算确定。

## 已执行回归

```text
go test ./...  # domainry-knowledge
go test ./...  # domainry-knowledge-sdk
npm test       # domainry-knowledge/frontend
npm run build  # domainry-knowledge/frontend
```

以上命令全部通过。浏览器还实际验收了：进入编辑模式、Y.Doc 初始检查点写入、斜杠菜单、菜单分组、自定义高亮提示块插入、在线人数以及按用户统计的编辑块数。
