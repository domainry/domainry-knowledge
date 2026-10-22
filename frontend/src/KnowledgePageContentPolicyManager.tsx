import { useEffect, useState } from "react";
import { Copy, Download, Files, Printer, Save, ShieldAlert, ShieldCheck, Stamp } from "lucide-react";
import { Button } from "./components.tsx";
import type { KnowledgeClient, KnowledgePageContentPolicy } from "./types.ts";

const controls: Array<{ key: keyof Pick<KnowledgePageContentPolicy, "allow_copy" | "allow_download" | "allow_print" | "allow_export" | "allow_duplicate">; label: string; detail: string; icon: typeof Copy }> = [
  { key: "allow_copy", label: "复制正文", detail: "复制选中文本或内容块到剪贴板", icon: Copy },
  { key: "allow_download", label: "下载原文件", detail: "下载文件页面绑定的不可变原件", icon: Download },
  { key: "allow_print", label: "打印页面", detail: "打开系统打印与另存 PDF", icon: Printer },
  { key: "allow_export", label: "导出内容", detail: "导出 Markdown、JSON、CSV、XLSX、图片或演示文稿", icon: Download },
  { key: "allow_duplicate", label: "创建副本", detail: "在当前知识库创建独立草稿副本", icon: Files },
];

export function KnowledgePageContentPolicyManager({ client, libraryID, pageID, formatError, onNotice, onSaved }: { client: KnowledgeClient; libraryID: string; pageID: string; formatError(error: unknown): string; onNotice(message: string): void; onSaved?(): void }) {
  const [policy, setPolicy] = useState<KnowledgePageContentPolicy | null>(null);
  const [busy, setBusy] = useState(false), [error, setError] = useState("");

  useEffect(() => {
    if (!client.getPageContentPolicy) return;
    const abort = new AbortController();
    setPolicy(null); setError("");
    void client.getPageContentPolicy(libraryID, pageID, abort.signal).then(value => {
      if (!abort.signal.aborted) setPolicy(value);
    }).catch(failure => { if (!abort.signal.aborted) setError(formatError(failure)); });
    return () => abort.abort();
  }, [client, formatError, libraryID, pageID]);

  async function save() {
    if (!policy || !client.setPageContentPolicy || busy) return;
    setBusy(true); setError("");
    try {
      const next = await client.setPageContentPolicy(libraryID, pageID, {
        client_id: crypto.randomUUID(), expected_revision: policy.revision, scope: policy.scope,
        allow_copy: policy.allow_copy, allow_download: policy.allow_download, allow_print: policy.allow_print,
        allow_export: policy.allow_export, allow_duplicate: policy.allow_duplicate,
        classification: policy.classification, watermark_mode: policy.watermark_mode, sensitive_content_action: policy.sensitive_content_action,
        require_outbound_approval: policy.require_outbound_approval,
      }, AbortSignal.timeout(30_000));
      setPolicy(next); onNotice("内容保护与分级策略已保存；后续操作会由服务端实时复核。"); onSaved?.();
    } catch (failure) { setError(formatError(failure)); }
    finally { setBusy(false); }
  }

  if (!client.getPageContentPolicy || !client.setPageContentPolicy) return <p className="knowledge-error">当前宿主未启用内容保护策略。</p>;
  return <section className="knowledge-content-policy">
    <header><span><ShieldCheck size={18} /></span><div><h3>内容保护</h3><p>控制页面内容离开工作区的产品入口；每次操作都会重新请求服务端裁决。</p></div></header>
    {error && <p className="knowledge-error" role="alert">{error}</p>}
    {!policy ? <p role="status">正在读取服务端策略…</p> : <>
      <label className="knowledge-content-policy-scope"><span>生效范围</span><select disabled={busy} value={policy.scope} onChange={event => setPolicy(current => current ? { ...current, scope: event.target.value as "page" | "subtree" } : current)}><option value="page">仅当前页面</option><option value="subtree">当前页面与全部子页面</option></select></label>
      {policy.revision === 0 && <p className="knowledge-subtle">当前未保存页面级策略，显示的是最近祖先策略或系统默认值；保存后会建立当前页面的明确策略。</p>}
      <div className="knowledge-content-governance-fields">
        <label><span><ShieldCheck size={15} />密级</span><select disabled={busy} value={policy.classification} onChange={event => setPolicy(current => current ? { ...current, classification: event.target.value as KnowledgePageContentPolicy["classification"] } : current)}><option value="public">公开</option><option value="internal">内部</option><option value="confidential">机密</option><option value="restricted">严格受限</option></select></label>
        <label><span><Stamp size={15} />动态水印</span><select disabled={busy} value={policy.watermark_mode} onChange={event => setPolicy(current => current ? { ...current, watermark_mode: event.target.value as KnowledgePageContentPolicy["watermark_mode"] } : current)}><option value="none">不显示</option><option value="identity">显示当前账号与时间</option></select></label>
        <label><span><ShieldAlert size={15} />敏感内容</span><select disabled={busy} value={policy.sensitive_content_action} onChange={event => setPolicy(current => current ? { ...current, sensitive_content_action: event.target.value as KnowledgePageContentPolicy["sensitive_content_action"] } : current)}><option value="allow">按下方入口策略处理</option><option value="block_outbound">阻止全部复制、下载、打印、导出、副本与分享</option></select></label>
        <label className="knowledge-content-approval"><span><ShieldAlert size={15} />外发审批</span><span><strong>要求宿主审批系统实时放行</strong><small>未接入审批系统、审批失效或审批引用缺失时，服务端拒绝全部外发操作。</small></span><input type="checkbox" checked={policy.require_outbound_approval} disabled={busy} onChange={event => setPolicy(current => current ? { ...current, require_outbound_approval: event.target.checked } : current)} /></label>
      </div>
      <div className="knowledge-content-policy-list">{controls.map(item => { const Icon = item.icon; return <label key={item.key}><span className="knowledge-content-policy-icon"><Icon size={16} /></span><span><strong>{item.label}</strong><small>{item.detail}</small></span><input type="checkbox" checked={policy[item.key]} disabled={busy} onChange={event => setPolicy(current => current ? { ...current, [item.key]: event.target.checked } : current)} /></label>; })}</div>
      <p className="knowledge-subtle">策略 revision {policy.revision || "未建立"}{policy.revision > 0 && policy.updated_at ? ` · 更新于 ${new Date(policy.updated_at).toLocaleString()}` : ""}</p>
      <Button className="primary" disabled={busy} onClick={() => void save()}><Save size={14} />{busy ? "正在保存…" : "保存内容保护"}</Button>
    </>}
  </section>;
}
