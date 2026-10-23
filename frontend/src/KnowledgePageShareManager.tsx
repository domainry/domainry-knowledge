import { useEffect, useMemo, useState } from "react";
import { Copy, Link2, Plus, RefreshCw, Share2, ShieldCheck, X } from "lucide-react";
import { Button, Select } from "./components.tsx";
import { createKnowledgePageShareLink } from "./knowledge-share-links.ts";
import type { KnowledgeClient, KnowledgeOrganizationPrincipal, KnowledgePageShare, KnowledgePageShareKind, KnowledgePageShareScope, KnowledgePrincipal } from "./types.ts";

function localDateTime(hours = 24 * 7) {
  const date = new Date(Date.now() + hours * 60 * 60 * 1000);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 16);
}

export function KnowledgePageShareManager({ client, libraryID, pageID, published, formatError, onNotice }: { client: KnowledgeClient; libraryID: string; pageID: string; published: boolean; formatError(error: unknown): string; onNotice(message: string): void }) {
  const [shares, setShares] = useState<KnowledgePageShare[]>([]), [nextAfter, setNextAfter] = useState(""), [complete, setComplete] = useState(true);
  const [kind, setKind] = useState<KnowledgePageShareKind>("user"), [scope, setScope] = useState<KnowledgePageShareScope>("page");
  const [targetQuery, setTargetQuery] = useState(""), [targetID, setTargetID] = useState(""), [password, setPassword] = useState(""), [expiresAt, setExpiresAt] = useState(() => localDateTime());
  const [principals, setPrincipals] = useState<KnowledgePrincipal[]>([]), [userProfiles, setUserProfiles] = useState<Record<string, KnowledgePrincipal>>({}), [organizationProfiles, setOrganizationProfiles] = useState<Record<string, KnowledgeOrganizationPrincipal>>({});
  const [busy, setBusy] = useState(""), [error, setError] = useState("");
  const available = !!(client.listPageShares && client.createPageShare && client.revokePageShare);

  async function resolveLabels(items: KnowledgePageShare[], signal: AbortSignal) {
    const userIDs = [...new Set(items.filter(item => item.target?.type === "user").map(item => item.target!.id))];
    const organizationIDs = [...new Set(items.filter(item => item.target?.type === "organization").map(item => item.target!.id))];
    if (userIDs.length) void client.resolvePrincipals(userIDs, signal).then(values => setUserProfiles(current => ({ ...current, ...Object.fromEntries(values.map(value => [value.user_id, value])) }))).catch(() => undefined);
    if (organizationIDs.length) void client.resolveOrganizationPrincipals(organizationIDs, signal).then(values => setOrganizationProfiles(current => ({ ...current, ...Object.fromEntries(values.map(value => [value.organization_id, value])) }))).catch(() => undefined);
  }

  async function load(after = "", append = false, signal = AbortSignal.timeout(30_000)) {
    if (!client.listPageShares) return;
    setBusy(append ? "more" : "list"); setError("");
    try {
      const result = await client.listPageShares(libraryID, pageID, after, 100, signal);
      setShares(current => append ? [...current, ...result.items.filter(item => !current.some(saved => saved.id === item.id))] : result.items);
      setNextAfter(result.next_after || ""); setComplete(result.complete);
      await resolveLabels(result.items, signal);
    } catch (failure) { if (!signal.aborted) setError(formatError(failure)); }
    finally { if (!signal.aborted) setBusy(""); }
  }

  useEffect(() => {
    if (!available) return;
    const abort = new AbortController();
    void load("", false, abort.signal);
    return () => abort.abort();
  }, [available, client, libraryID, pageID]);

  useEffect(() => {
    if (kind !== "user" || !targetQuery.trim()) { setPrincipals([]); return; }
    const abort = new AbortController();
    const timer = window.setTimeout(() => void client.searchPrincipals(targetQuery.trim(), "", 20, abort.signal).then(result => {
      if (abort.signal.aborted) return;
      setPrincipals(result.items);
      setUserProfiles(current => ({ ...current, ...Object.fromEntries(result.items.map(value => [value.user_id, value])) }));
    }).catch(failure => { if (!abort.signal.aborted) setError(formatError(failure)); }), 200);
    return () => { window.clearTimeout(timer); abort.abort(); };
  }, [client, formatError, kind, targetQuery]);

  useEffect(() => { setTargetID(""); setTargetQuery(""); setPrincipals([]); if (kind !== "external") setPassword(""); }, [kind]);

  const canCreate = useMemo(() => published && !busy && !!expiresAt && (kind === "external" ? password.length >= 8 : !!targetID || kind === "organization" && !!targetQuery.trim()), [busy, expiresAt, kind, password.length, published, targetID, targetQuery]);

  async function create() {
    if (!client.createPageShare || !canCreate) return;
    setBusy("create"); setError("");
    try {
      let target = undefined;
      if (kind === "user") target = { type: "user" as const, id: targetID };
      if (kind === "organization") {
        const organizationID = targetQuery.trim();
        const [principal] = await client.resolveOrganizationPrincipals([organizationID], AbortSignal.timeout(30_000));
        if (!principal || principal.organization_id !== organizationID || principal.status !== "active") throw Error("组织不存在或已停用。请输入 Identity 中的有效组织 ID。");
        setOrganizationProfiles(current => ({ ...current, [organizationID]: principal }));
        target = { type: "organization" as const, id: organizationID };
      }
      const expiry = new Date(expiresAt);
      if (!Number.isFinite(expiry.getTime()) || expiry <= new Date()) throw Error("分享有效期必须晚于当前时间。");
      const share = await client.createPageShare(libraryID, pageID, { client_id: crypto.randomUUID(), kind, target, scope, expires_at: expiry.toISOString(), password: password || undefined }, AbortSignal.timeout(30_000));
      setShares(current => [share, ...current.filter(item => item.id !== share.id)]);
      setPassword(""); setTargetID(""); setTargetQuery(""); setPrincipals([]);
      onNotice("受控分享已创建。访问者仍需登录，服务端会在每次阅读时重新核对身份、有效期与撤销状态。");
    } catch (failure) { setError(formatError(failure)); }
    finally { setBusy(""); }
  }

  async function revoke(share: KnowledgePageShare) {
    if (!client.revokePageShare || share.state !== "active") return;
    setBusy(share.id); setError("");
    try {
      const updated = await client.revokePageShare(libraryID, pageID, share.id, share.revision, AbortSignal.timeout(30_000));
      setShares(current => current.map(item => item.id === updated.id ? updated : item));
      onNotice("分享已撤销，已有兑换记录也已立即失效。");
    } catch (failure) { setError(formatError(failure)); }
    finally { setBusy(""); }
  }

  async function copyLink(share: KnowledgePageShare) {
    try {
      await navigator.clipboard.writeText(createKnowledgePageShareLink(window.location.href, share.id, share.page_id));
      onNotice("分享链接已复制。链接只含非密钥定位符，不能绕过登录和服务端权限校验。");
    } catch { setError("浏览器未允许复制，请在地址栏手动复制分享链接。"); }
  }

  function targetLabel(share: KnowledgePageShare) {
    if (share.kind === "external") return "工作区外部用户";
    if (share.target?.type === "organization") return organizationProfiles[share.target.id]?.display_name || share.target.id;
    return share.target ? userProfiles[share.target.id]?.display_name || share.target.id : "未知主体";
  }

  if (!available) return null;
  return <section className="knowledge-share-manager">
    <header className="knowledge-management-panel-header"><span className="knowledge-management-panel-icon"><Share2 size={17} /></span><div><h3>受控分享</h3><p>创建限定对象、范围和有效期的只读入口；分享链接本身不是登录凭证。</p></div><Button aria-label="刷新分享" title="刷新分享" disabled={!!busy} onClick={() => void load()}><RefreshCw size={14} /></Button></header>
    {!published && <p className="knowledge-access-preview">当前页面尚未发布，不能创建分享。发布后只读分享不会暴露草稿。</p>}
    <div className="knowledge-share-create">
      <label>分享对象<Select value={kind} disabled={!!busy || !published} onChange={event => setKind(event.target.value as KnowledgePageShareKind)}><option value="user">指定用户</option><option value="organization">指定组织</option><option value="external">外部用户</option></Select></label>
      {kind === "user" && <div className="knowledge-principal-picker"><label>查找工作区用户<input value={targetQuery} disabled={!!busy || !published} onChange={event => { setTargetQuery(event.target.value); setTargetID(""); }} placeholder="输入姓名或邮箱" /></label>{principals.length > 0 && <div className="knowledge-principal-results" role="listbox">{principals.map(principal => <button key={principal.user_id} type="button" role="option" aria-selected={targetID === principal.user_id} onClick={() => { setTargetID(principal.user_id); setTargetQuery(principal.display_name || principal.email || principal.user_id); setPrincipals([]); }}><span aria-hidden="true">{(principal.display_name || "?").slice(0, 1)}</span><strong>{principal.display_name || principal.user_id}</strong><small>{principal.email}</small></button>)}</div>}</div>}
      {kind === "organization" && <label>Identity 组织 ID<input value={targetQuery} disabled={!!busy || !published} onChange={event => setTargetQuery(event.target.value)} placeholder="输入准确的组织 ID" /></label>}
      <div className="knowledge-share-options"><label>范围<Select value={scope} disabled={!!busy || !published} onChange={event => setScope(event.target.value as KnowledgePageShareScope)}><option value="page">仅此页面</option><option value="subtree">页面与已发布子树</option></Select></label><label>有效期<input type="datetime-local" value={expiresAt} disabled={!!busy || !published} onChange={event => setExpiresAt(event.target.value)} /></label></div>
      <label>访问密码{kind === "external" ? "（必填，至少 8 位）" : "（可选，至少 8 位）"}<input type="password" minLength={8} maxLength={72} autoComplete="new-password" value={password} disabled={!!busy || !published} onChange={event => setPassword(event.target.value)} placeholder={kind === "external" ? "外部分享必须设置密码" : "需要二次验证时设置"} /></label>
      <Button className="primary" disabled={!canCreate} onClick={() => void create()}><Plus size={14} />{busy === "create" ? "正在创建…" : "创建分享"}</Button>
    </div>
    {error && <p className="knowledge-error" role="alert">{error}</p>}
    <div className="knowledge-share-list">{shares.map(share => <article key={share.id} className={share.state === "revoked" || new Date(share.expires_at) <= new Date() ? "is-inactive" : undefined}><span className="knowledge-share-icon"><Link2 size={15} /></span><span><strong>{targetLabel(share)}</strong><small>{share.kind === "organization" ? "组织" : share.kind === "user" ? "指定用户" : "受控外部访问"} · {share.scope === "subtree" ? "页面与子树" : "仅此页面"} · {share.password_protected ? "有密码" : "无密码"}</small><small>{share.state === "revoked" ? "已撤销" : new Date(share.expires_at) <= new Date() ? "已过期" : `有效至 ${new Date(share.expires_at).toLocaleString()}`}</small></span><div><Button aria-label="复制分享链接" title="复制分享链接" disabled={share.state !== "active"} onClick={() => void copyLink(share)}><Copy size={14} /></Button>{share.state === "active" && <Button className="danger" aria-label="撤销分享" title="撤销分享" disabled={!!busy} onClick={() => void revoke(share)}><X size={14} /></Button>}</div></article>)}{!busy && shares.length === 0 && <p className="knowledge-subtle">尚未创建受控分享。</p>}</div>
    {!complete && nextAfter && <Button disabled={!!busy} onClick={() => void load(nextAfter, true)}>加载更多分享</Button>}
    <footer><ShieldCheck size={14} /><span>组织归属、用户状态、撤销状态和有效期均在每次阅读时重新核对。</span></footer>
  </section>;
}
