import { formatKnowledgeDate, kt, ktf } from "./i18n/runtime.ts";
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
        if (!principal || principal.organization_id !== organizationID || principal.status !== "active") throw Error(kt("knowledge.auto.2cfc9e53262dc568"));
        setOrganizationProfiles(current => ({ ...current, [organizationID]: principal }));
        target = { type: "organization" as const, id: organizationID };
      }
      const expiry = new Date(expiresAt);
      if (!Number.isFinite(expiry.getTime()) || expiry <= new Date()) throw Error(kt("knowledge.auto.bf658e549bdf646a"));
      const share = await client.createPageShare(libraryID, pageID, { client_id: crypto.randomUUID(), kind, target, scope, expires_at: expiry.toISOString(), password: password || undefined }, AbortSignal.timeout(30_000));
      setShares(current => [share, ...current.filter(item => item.id !== share.id)]);
      setPassword(""); setTargetID(""); setTargetQuery(""); setPrincipals([]);
      onNotice(kt("knowledge.auto.4ee877508709bcec"));
    } catch (failure) { setError(formatError(failure)); }
    finally { setBusy(""); }
  }

  async function revoke(share: KnowledgePageShare) {
    if (!client.revokePageShare || share.state !== "active") return;
    setBusy(share.id); setError("");
    try {
      const updated = await client.revokePageShare(libraryID, pageID, share.id, share.revision, AbortSignal.timeout(30_000));
      setShares(current => current.map(item => item.id === updated.id ? updated : item));
      onNotice(kt("knowledge.auto.f377a88d800148b7"));
    } catch (failure) { setError(formatError(failure)); }
    finally { setBusy(""); }
  }

  async function copyLink(share: KnowledgePageShare) {
    try {
      await navigator.clipboard.writeText(createKnowledgePageShareLink(window.location.href, share.id, share.page_id));
      onNotice(kt("knowledge.auto.dcbd94301d2b4c5d"));
    } catch { setError(kt("knowledge.auto.884ad77986e29f9f")); }
  }

  function targetLabel(share: KnowledgePageShare) {
    if (share.kind === "external") return kt("knowledge.auto.a1383ff0a278bced");
    if (share.target?.type === "organization") return organizationProfiles[share.target.id]?.display_name || share.target.id;
    return share.target ? userProfiles[share.target.id]?.display_name || share.target.id : kt("knowledge.auto.a034b3ab77ba7d9b");
  }

  if (!available) return null;
  return <section className="knowledge-share-manager">
    <header className="knowledge-management-panel-header"><span className="knowledge-management-panel-icon"><Share2 size={17} /></span><div><h3>{kt("knowledge.auto.348c903d1b5d1b9c")}</h3><p>{kt("knowledge.auto.28d45d2fae47d9ee")}</p></div><Button aria-label={kt("knowledge.auto.c42cd14d6a672035")} title={kt("knowledge.auto.c42cd14d6a672035")} disabled={!!busy} onClick={() => void load()}><RefreshCw size={14} /></Button></header>
    {!published && <p className="knowledge-access-preview">{kt("knowledge.auto.90c95ed80c99e70c")}</p>}
    <div className="knowledge-share-create">
      <label>{kt("knowledge.auto.49155cd6d0ddcdcf")}<Select value={kind} disabled={!!busy || !published} onChange={event => setKind(event.target.value as KnowledgePageShareKind)}><option value="user">{kt("knowledge.auto.7c1bb92bf6f1ac27")}</option><option value="organization">{kt("knowledge.auto.279fe628f9178480")}</option><option value="external">{kt("knowledge.auto.17aa3d920939f691")}</option></Select></label>
      {kind === "user" && <div className="knowledge-principal-picker"><label>{kt("knowledge.auto.0ebfa23b0d118d7b")}<input value={targetQuery} disabled={!!busy || !published} onChange={event => { setTargetQuery(event.target.value); setTargetID(""); }} placeholder={kt("knowledge.auto.85333d57ff441b5b")} /></label>{principals.length > 0 && <div className="knowledge-principal-results" role="listbox">{principals.map(principal => <button key={principal.user_id} type="button" role="option" aria-selected={targetID === principal.user_id} onClick={() => { setTargetID(principal.user_id); setTargetQuery(principal.display_name || principal.email || principal.user_id); setPrincipals([]); }}><span aria-hidden="true">{(principal.display_name || "?").slice(0, 1)}</span><strong>{principal.display_name || principal.user_id}</strong><small>{principal.email}</small></button>)}</div>}</div>}
      {kind === "organization" && <label>{kt("knowledge.auto.ff76126c1b1ae3b3")}<input value={targetQuery} disabled={!!busy || !published} onChange={event => setTargetQuery(event.target.value)} placeholder={kt("knowledge.auto.7f35c9d5cbc9246a")} /></label>}
      <div className="knowledge-share-options"><label>{kt("knowledge.auto.ae72b532f4b8f09e")}<Select value={scope} disabled={!!busy || !published} onChange={event => setScope(event.target.value as KnowledgePageShareScope)}><option value="page">{kt("knowledge.auto.3427f69175c5c4ab")}</option><option value="subtree">{kt("knowledge.auto.12e1350a507e7acd")}</option></Select></label><label>{kt("knowledge.auto.9c2a28e8f98fb5df")}<input type="datetime-local" value={expiresAt} disabled={!!busy || !published} onChange={event => setExpiresAt(event.target.value)} /></label></div>
      <label>{kt("knowledge.auto.f4f712d5be91721a")}{kind === "external" ? kt("knowledge.auto.a786b68e383dec83") : kt("knowledge.auto.65a53dde23bf7775")}<input type="password" minLength={8} maxLength={72} autoComplete="new-password" value={password} disabled={!!busy || !published} onChange={event => setPassword(event.target.value)} placeholder={kind === "external" ? kt("knowledge.auto.130c9dcadd682b6f") : kt("knowledge.auto.17bf5d4ecb7241fa")} /></label>
      <Button className="primary" disabled={!canCreate} onClick={() => void create()}><Plus size={14} />{busy === "create" ? kt("knowledge.auto.7c0305bc0ce607b2") : kt("knowledge.auto.7f86da84215141c2")}</Button>
    </div>
    {error && <p className="knowledge-error" role="alert">{error}</p>}
    <div className="knowledge-share-list">{shares.map(share => <article key={share.id} className={share.state === "revoked" || new Date(share.expires_at) <= new Date() ? "is-inactive" : undefined}><span className="knowledge-share-icon"><Link2 size={15} /></span><span><strong>{targetLabel(share)}</strong><small>{share.kind === "organization" ? kt("knowledge.auto.b4d203dea5b9121c") : share.kind === "user" ? kt("knowledge.auto.7c1bb92bf6f1ac27") : kt("knowledge.auto.9b453e14eaf707f0")} · {share.scope === "subtree" ? kt("knowledge.auto.384018e4d41d658e") : kt("knowledge.auto.3427f69175c5c4ab")} · {share.password_protected ? kt("knowledge.auto.70285c7765774eed") : kt("knowledge.auto.4a2954e04625da32")}</small><small>{share.state === "revoked" ? kt("knowledge.auto.fef96e34f77b742b") : new Date(share.expires_at) <= new Date() ? kt("knowledge.auto.2fe0e3339ac4d1bb") : ktf("knowledge.auto.10efb3dd6ceed2d2", { value0: formatKnowledgeDate(share.expires_at) })}</small></span><div><Button aria-label={kt("knowledge.auto.5466b8035adc6512")} title={kt("knowledge.auto.5466b8035adc6512")} disabled={share.state !== "active"} onClick={() => void copyLink(share)}><Copy size={14} /></Button>{share.state === "active" && <Button className="danger" aria-label={kt("knowledge.auto.b52e35824750f54a")} title={kt("knowledge.auto.b52e35824750f54a")} disabled={!!busy} onClick={() => void revoke(share)}><X size={14} /></Button>}</div></article>)}{!busy && shares.length === 0 && <p className="knowledge-subtle">{kt("knowledge.auto.20dcaa4827e769b1")}</p>}</div>
    {!complete && nextAfter && <Button disabled={!!busy} onClick={() => void load(nextAfter, true)}>{kt("knowledge.auto.d0c7a5f5b13d6069")}</Button>}
    <footer><ShieldCheck size={14} /><span>{kt("knowledge.auto.83643a5c25e10e7c")}</span></footer>
  </section>;
}
