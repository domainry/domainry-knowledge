# Query permission ID 上限实测

实测日期：2026-10-20（Asia/Shanghai）

被测服务：`/Users/tiger/Projects/kb-search-api`

被测提交：`4f9eb13147977d44beb4e0a7da0f7ac57a386f76`

工作区状态：clean。

## 结论

- query `permission_ids` 最多接受 **4096 个去重后的 ID**。
- query `permission_ids` 的紧凑 JSON（Python `ensure_ascii=True` 等价编码）最多接受 **131072 字节**。
- 单个 ID 最多 128 UTF-8 字节，并拒绝空值、首尾 Python whitespace、控制字符、非法 UTF-8 和非法 JSON/UTF-16 surrogate。
- 边界值 `4096` 和 `131072` 均接受；第 `4097` 个不同 ID 或 `131073` 字节均拒绝。

这不是从 `kb-wiki` 或调用方配置复制的数字。实测直接执行当前知识检索服务的请求解码与规范化代码；`handler.queryPermissions` 在任何搜索/读取前调用同一个 `permissions.NormalizeQuery`。

## 执行证据

```text
$ go test ./pkg/permissions -run 'TestDistinctAndByteLimits|TestQueryJSONUsesQueryLimits|TestStrictJSON' -count=1 -v
--- PASS: TestStrictJSON
--- PASS: TestDistinctAndByteLimits
--- PASS: TestQueryJSONUsesQueryLimits
PASS
ok github.com/codeck-backend/kb-search-api/pkg/permissions
```

`TestDistinctAndByteLimits` 分别构造精确的数量边界和 ASCII-escaped JSON 字节边界，并验证下一项/下一字节被拒绝；`TestQueryJSONUsesQueryLimits` 通过真实 JSON unmarshal 路径验证 257、4096、4097 三个请求规模。

## Knowledge 侧采用方式

Knowledge provider 以这两个实测上限为每批硬边界，按精确的 ASCII JSON 字节数拆分 page token；每批重复资料库基础 token，所有批次结果再全局去重、按 score 和稳定标识排序、最后执行 TopK。任何 token 都不会被静默截断。
