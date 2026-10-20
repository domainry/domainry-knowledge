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

  return <section className="knowledge-sources" aria-label="外部内容连接" data-static-ui-list>
    <div className="knowledge-section-heading"><h3>外部内容连接</h3><Button disabled={blocked || loading} onClick={() => setRefresh(value => value + 1)}><RefreshCw size={14} />刷新</Button></div>
    {error && <p role="alert" className="knowledge-error">{error}</p>}
    {loading ? <p className="knowledge-subtle">正在读取可用知识源…</p> : page && <>
      {page.status === "connected" ? <p className="knowledge-subtle"><Check size={15} className="knowledge-inline" /> 已连接外部内容，可上传资料并建立索引。</p> : page.status === "unavailable" ? <p className="knowledge-subtle">当前连接暂不可用；已保存原文件仍按知识库权限保留。</p> : page.status === "host_managed" ? <p className="knowledge-subtle">此知识库的外部内容连接由宿主管理。</p> : <p className="knowledge-subtle">选择一个外部内容连接到“{library.name}”。</p>}
      {page.status === "unbound" && <>{!page.can_bind && <p className="knowledge-subtle">当前没有连接权限，或资料库已归档。</p>}{page.items.length === 0 ? <p className="knowledge-subtle">暂无可选择的知识源。</p> : <div className="knowledge-source-list">{page.items.map(item => <button key={item.key} aria-current={choice === item.key ? "true" : undefined} disabled={blocked || !!pending || !item.available} onClick={() => setChoice(item.key)}><Link2 size={16} /><span><strong>{item.name}</strong><small>{item.available ? item.description || "可连接" : "暂不可连接"}</small></span></button>)}</div>}</>}
      {(cursors.length > 1 || !page.complete) && <nav className="knowledge-pagination"><Button disabled={blocked || loading || cursors.length === 1} onClick={() => { setChoice(""); setCursors(values => values.slice(0, -1)); }}>上一页</Button><Button disabled={blocked || loading || !page.next_after} onClick={() => { setChoice(""); setCursors(values => [...values, page.next_after!]); }}>下一页</Button></nav>}
      {pending && <p className="knowledge-subtle">上次连接结果待确认；继续时使用同一个知识源，不会重复创建绑定。</p>}
      {(page.status === "unbound" || pending) && <div className="knowledge-actions"><Button disabled={blocked || !page.can_bind || (!pending && !selected)} onClick={() => void bind()}><Link2 size={15} />{busy ? "正在连接…" : pending ? "继续确认连接" : "连接知识源"}</Button>{pending && <Button disabled={blocked} onClick={() => { localStorage.removeItem(storageKey); setPending(null); }}>结束重试</Button>}</div>}
    </>}
  </section>;
}
