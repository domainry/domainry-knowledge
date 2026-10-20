# 知识检索质量评测

`domainry-knowledge-eval` 对一份冻结的 JSON 测试集和同版本检索观测计算
Recall@K、MRR、NDCG@K、引用正确率、越权文档率和发生越权的用例率。它只读取
文件并输出 JSON，不请求模型、不调用知识服务，也不修改资料库。配置阈值后，
任何质量回归或权限泄漏都会令进程返回非零状态，可直接作为 CI 门禁。

```bash
go run ./cmd/domainry-knowledge-eval ./evaluation.json
```

```json
{
  "top_k": 5,
  "cases": [{
    "id": "refund-policy",
    "query": "退款期限是多少",
    "expected_documents": [{"doc_id": "policy-v3", "relevance": 3}],
    "allowed_document_ids": ["policy-v3", "faq-v2"]
  }],
  "observations": [{
    "case_id": "refund-policy",
    "hits": [{"doc_id": "policy-v3", "citation_correct": true}]
  }],
  "thresholds": {
    "minimum_recall_at_k": 0.9,
    "minimum_mrr": 0.8,
    "minimum_ndcg_at_k": 0.8,
    "minimum_citation_correctness": 0.95,
    "minimum_citations_evaluated": 100,
    "maximum_permission_leakage_rate": 0,
    "maximum_permission_leakage_case_rate": 0,
    "maximum_unauthorized_documents": 0
  }
}
```

`allowed_document_ids` 必须按执行评测的真实用户权限生成，且必须显式存在；空数组
表示该用户不应召回任何文档。期望文档必须属于允许集合，否则测试集本身无效。
同一文档的多个 chunk 在检索指标和权限泄漏指标中只算一次，但每条已人工判断的
引用仍独立进入引用正确率。应将测试集、索引版本、Builder 版本和观测文件一起冻结，
避免把数据变化误判成检索回归。

输出始终包含完整 `metrics`、`passed` 和逐项 `failures`。阈值字段都可省略；比例
阈值必须在 0 到 1 之间。建议权限门禁同时设置两个比例上限和绝对越权文档数为 0，
并设置 `minimum_citations_evaluated`，避免仅标注少量容易样本得到虚高引用正确率。
