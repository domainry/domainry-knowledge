import { formatKnowledgeDate, kt, ktf } from "./i18n/runtime.ts";
import { useEffect, useState } from "react";
import { Copy, Download, Files, Printer, Save, ShieldAlert, ShieldCheck, Stamp } from "lucide-react";
import { Button, Select } from "./components.tsx";
import type { KnowledgeClient, KnowledgePageContentPolicy } from "./types.ts";

const controls: Array<{ key: keyof Pick<KnowledgePageContentPolicy, "allow_copy" | "allow_download" | "allow_print" | "allow_export" | "allow_duplicate">; label: string; detail: string; icon: typeof Copy }> = [
  { key: "allow_copy", get label() { return kt("knowledge.auto.a1c7d3d4a7639a49"); }, get detail() { return kt("knowledge.auto.30d9b61f1b78ede2"); }, icon: Copy },
  { key: "allow_download", get label() { return kt("knowledge.auto.aa1d4263667a8086"); }, get detail() { return kt("knowledge.auto.c13ed97cb904ff6e"); }, icon: Download },
  { key: "allow_print", get label() { return kt("knowledge.auto.9a83289af3083a21"); }, get detail() { return kt("knowledge.auto.9368f9367a9505d0"); }, icon: Printer },
  { key: "allow_export", get label() { return kt("knowledge.auto.2584921cf7cd62c9"); }, get detail() { return kt("knowledge.auto.a82660b9c889dc57"); }, icon: Download },
  { key: "allow_duplicate", get label() { return kt("knowledge.auto.f6825f1e73a1c6d8"); }, get detail() { return kt("knowledge.auto.099f6565ee480734"); }, icon: Files },
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
      setPolicy(next); onNotice(kt("knowledge.auto.8b93554889ba2818")); onSaved?.();
    } catch (failure) { setError(formatError(failure)); }
    finally { setBusy(false); }
  }

  if (!client.getPageContentPolicy || !client.setPageContentPolicy) return <p className="knowledge-error">{kt("knowledge.auto.92128a2283d68892")}</p>;
  return <section className="knowledge-content-policy">
    <header><span><ShieldCheck size={18} /></span><div><h3>{kt("knowledge.auto.7b910947962141e2")}</h3><p>{kt("knowledge.auto.f5622d371b727cbb")}</p></div></header>
    {error && <p className="knowledge-error" role="alert">{error}</p>}
    {!policy ? <p role="status">{kt("knowledge.auto.936018e4788cc70b")}</p> : <>
      <label className="knowledge-content-policy-scope"><span>{kt("knowledge.auto.72db5c129fd3df4c")}</span><Select disabled={busy} value={policy.scope} onChange={event => setPolicy(current => current ? { ...current, scope: event.target.value as "page" | "subtree" } : current)}><option value="page">{kt("knowledge.auto.813d257c1a6dc324")}</option><option value="subtree">{kt("knowledge.auto.ef5423ad827245f0")}</option></Select></label>
      {policy.revision === 0 && <p className="knowledge-subtle">{kt("knowledge.auto.06fe488d41701fdb")}</p>}
      <div className="knowledge-content-governance-fields">
        <label><span><ShieldCheck size={15} />{kt("knowledge.auto.9b624793817ef8ec")}</span><Select disabled={busy} value={policy.classification} onChange={event => setPolicy(current => current ? { ...current, classification: event.target.value as KnowledgePageContentPolicy["classification"] } : current)}><option value="public">{kt("knowledge.auto.7a73baf0ce9abe54")}</option><option value="internal">{kt("knowledge.auto.6f225eb36d6d4e6a")}</option><option value="confidential">{kt("knowledge.auto.3fcc476715c11fd7")}</option><option value="restricted">{kt("knowledge.auto.ff93825419f899a5")}</option></Select></label>
        <label><span><Stamp size={15} />{kt("knowledge.auto.d2e9b50f02cf3a94")}</span><Select disabled={busy} value={policy.watermark_mode} onChange={event => setPolicy(current => current ? { ...current, watermark_mode: event.target.value as KnowledgePageContentPolicy["watermark_mode"] } : current)}><option value="none">{kt("knowledge.auto.fc3ffd80c40afb11")}</option><option value="identity">{kt("knowledge.auto.16fbc4730484e78a")}</option></Select></label>
        <label><span><ShieldAlert size={15} />{kt("knowledge.auto.f68e7a25fa5e8e85")}</span><Select disabled={busy} value={policy.sensitive_content_action} onChange={event => setPolicy(current => current ? { ...current, sensitive_content_action: event.target.value as KnowledgePageContentPolicy["sensitive_content_action"] } : current)}><option value="allow">{kt("knowledge.auto.4f7e322288b41033")}</option><option value="block_outbound">{kt("knowledge.auto.be9c589cf36ce4b5")}</option></Select></label>
        <label className="knowledge-content-approval"><span><ShieldAlert size={15} />{kt("knowledge.auto.29bc2bff6cd9f5e8")}</span><span><strong>{kt("knowledge.auto.e8dd802c3e4bd445")}</strong><small>{kt("knowledge.auto.0434212dee8c7b63")}</small></span><input type="checkbox" checked={policy.require_outbound_approval} disabled={busy} onChange={event => setPolicy(current => current ? { ...current, require_outbound_approval: event.target.checked } : current)} /></label>
      </div>
      <div className="knowledge-content-policy-list">{controls.map(item => { const Icon = item.icon; return <label key={item.key}><span className="knowledge-content-policy-icon"><Icon size={16} /></span><span><strong>{item.label}</strong><small>{item.detail}</small></span><input type="checkbox" checked={policy[item.key]} disabled={busy} onChange={event => setPolicy(current => current ? { ...current, [item.key]: event.target.checked } : current)} /></label>; })}</div>
      <p className="knowledge-subtle">{kt("knowledge.auto.df7ba01214fad326")}{policy.revision || kt("knowledge.auto.fde87c657d007eab")}{policy.revision > 0 && policy.updated_at ? ktf("knowledge.auto.a59392c17e5d6f2a", { value0: formatKnowledgeDate(policy.updated_at) }) : ""}</p>
      <Button className="primary" disabled={busy} onClick={() => void save()}><Save size={14} />{busy ? kt("knowledge.auto.6bdb4435095e5d28") : kt("knowledge.auto.9131442695f20cfb")}</Button>
    </>}
  </section>;
}
