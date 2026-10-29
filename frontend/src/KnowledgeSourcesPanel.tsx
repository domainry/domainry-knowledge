import { kt } from "./i18n/runtime.ts";
import { useEffect, useRef, useState } from "react";
import { Check, Link2, RefreshCw } from "lucide-react";
import { Button, defaultErrorMessage } from "./components.tsx";
import type { KnowledgeClient, KnowledgeLibrary, KnowledgeLibrarySources } from "./types.ts";

type PendingSource = { datasourceKey: string; expectedRevision: number };
const sourceKey = /^[a-zA-Z0-9][a-zA-Z0-9_.:-]{0,95}$/;

function pendingSource(raw: string | null): PendingSource | null {
  if (!raw || raw.length > 1024) return null;
  try {
    const value = JSON.parse(raw) as PendingSource;
    return sourceKey.test(value?.datasourceKey || "") && Number.isSafeInteger(value?.expectedRevision) && value.expectedRevision > 0 ? value : null;
  } catch { return null; }
}

export function KnowledgeSourcesPanel({ client, library, disabled, formatError = defaultErrorMessage, onBusyChange, onBound }: { client: KnowledgeClient; library: KnowledgeLibrary; disabled: boolean; formatError?: (error: unknown) => string; onBusyChange?: (busy: boolean) => void; onBound: (library: KnowledgeLibrary) => void }) {
  const storageKey = `domainry-knowledge-source:${client.scope?.() || "default"}:${library.id}`;
  const [pending, setPending] = useState<PendingSource | null>(() => pendingSource(localStorage.getItem(storageKey)));
  const [page, setPage] = useState<KnowledgeLibrarySources | null>(null), [cursors, setCursors] = useState([""]), [refresh, setRefresh] = useState(0);
  const [choice, setChoice] = useState(""), [busy, setBusy] = useState(false), [loading, setLoading] = useState(true), [error, setError] = useState("");
  const lock = useRef(false), active = useRef<AbortController | null>(null);
  const cursor = cursors.at(-1) || "";

  useEffect(() => {
    const abort = new AbortController(); setLoading(true); setPage(null);
    void client.listSources(library.id, cursor, 10, abort.signal).then(value => {
      if (abort.signal.aborted) return;
      setPage(value); setError("");
      if (value.current_key) {
        const saved = pendingSource(localStorage.getItem(storageKey));
        if (saved?.datasourceKey === value.current_key && value.status === "connected") { localStorage.removeItem(storageKey); setPending(null); }
      }
    }).catch(failure => { if (!abort.signal.aborted) { setPage(null); setError(formatError(failure)); } }).finally(() => { if (!abort.signal.aborted) setLoading(false); });
    return () => abort.abort();
  }, [client, cursor, formatError, library.id, refresh, storageKey]);
  useEffect(() => () => { active.current?.abort(); onBusyChange?.(false); }, [onBusyChange]);

  const blocked = disabled || busy;
  const selected = page?.items.find(item => item.key === choice && item.available);
  async function bind() {
    if (lock.current || disabled || !page?.can_bind || (!pending && !selected)) return;
    lock.current = true; setBusy(true); onBusyChange?.(true); setError("");
    const abort = new AbortController(); active.current = abort;
    try {
      const input = pending || { datasourceKey: choice, expectedRevision: page.revision };
      localStorage.setItem(storageKey, JSON.stringify(input)); setPending(input);
      const result = await client.bindSource(library.id, input.datasourceKey, input.expectedRevision, AbortSignal.any([abort.signal, AbortSignal.timeout(30_000)]));
      if (abort.signal.aborted) return;
      localStorage.removeItem(storageKey); setPending(null); setChoice(""); onBound(result); setRefresh(value => value + 1);
    } catch (failure) { if (!abort.signal.aborted) setError(formatError(failure)); }
    finally { lock.current = false; if (!abort.signal.aborted) { setBusy(false); onBusyChange?.(false); } }
  }

  return <section className="knowledge-sources" aria-label={kt("knowledge.auto.4a743a713f81ecb4")} data-static-ui-list>
    <div className="knowledge-section-heading"><h3>{kt("knowledge.auto.4a743a713f81ecb4")}</h3><Button disabled={blocked || loading} onClick={() => setRefresh(value => value + 1)}><RefreshCw size={14} />{kt("knowledge.auto.aee88743413144a2")}</Button></div>
    {error && <p role="alert" className="knowledge-error">{error}</p>}
    {loading ? <p className="knowledge-subtle">{kt("knowledge.auto.af1e224014f013ab")}</p> : page && <>
      {page.status === "connected" ? <p className="knowledge-subtle"><Check size={15} className="knowledge-inline" /> {kt("knowledge.auto.d05bf8f0ad665222")}</p> : page.status === "unavailable" ? <p className="knowledge-subtle">{kt("knowledge.auto.cf410d5f0e84bf17")}</p> : page.status === "host_managed" ? <p className="knowledge-subtle">{kt("knowledge.auto.f730482320da7b65")}</p> : <p className="knowledge-subtle">{kt("knowledge.auto.dc0a715fb079016a")}{library.name}”。</p>}
      {page.status === "unbound" && <>{!page.can_bind && <p className="knowledge-subtle">{kt("knowledge.auto.293e2c49f6456e48")}</p>}{page.items.length === 0 ? <p className="knowledge-subtle">{kt("knowledge.auto.514984fb05f79bdc")}</p> : <div className="knowledge-source-list">{page.items.map(item => <button key={item.key} aria-current={choice === item.key ? "true" : undefined} disabled={blocked || !!pending || !item.available} onClick={() => setChoice(item.key)}><Link2 size={16} /><span><strong>{item.name}</strong><small>{item.available ? item.description || kt("knowledge.auto.6043b97c2ec8bd36") : kt("knowledge.auto.1e4822e0f8d08591")}</small></span></button>)}</div>}</>}
      {(cursors.length > 1 || !page.complete) && <nav className="knowledge-pagination"><Button disabled={blocked || loading || cursors.length === 1} onClick={() => { setChoice(""); setCursors(values => values.slice(0, -1)); }}>{kt("knowledge.auto.c9b9ae7a61444ab7")}</Button><Button disabled={blocked || loading || !page.next_after} onClick={() => { setChoice(""); setCursors(values => [...values, page.next_after!]); }}>{kt("knowledge.auto.8a8542f6964852dc")}</Button></nav>}
      {pending && <p className="knowledge-subtle">{kt("knowledge.auto.32d0db2efc9a7187")}</p>}
      {(page.status === "unbound" || pending) && <div className="knowledge-actions"><Button disabled={blocked || !page.can_bind || (!pending && !selected)} onClick={() => void bind()}><Link2 size={15} />{busy ? kt("knowledge.auto.8be0ea36a9bba286") : pending ? kt("knowledge.auto.a72730dcbb0a8d1a") : kt("knowledge.auto.b6602cb5523115ca")}</Button>{pending && <Button disabled={blocked} onClick={() => { localStorage.removeItem(storageKey); setPending(null); }}>{kt("knowledge.auto.5392ae0c4c271561")}</Button>}</div>}
    </>}
  </section>;
}
