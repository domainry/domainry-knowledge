import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { Button, defaultErrorMessage } from "./components.tsx";
import { documentCanWrite, documentLabel } from "./document.ts";
import type { KnowledgeClient, KnowledgeDocument, KnowledgeLibrary, KnowledgeLibraryPage, KnowledgeTransferSource } from "./types.ts";

type PendingTransfer = { source: KnowledgeTransferSource; clientID: string; targetLibraryID: string; mode: "copy" | "move" };

function receiptKey(client: KnowledgeClient) { return `domainry-knowledge-transfer:${client.scope?.() || "default"}`; }
function parsePendingTransfer(raw: string | null): PendingTransfer | null {
  if (!raw || raw.length > 4096) return null;
  try {
    const value = JSON.parse(raw) as PendingTransfer, source = value.source;
    if (!source || !source.id || !source.library_id || !value.targetLibraryID || source.library_id === value.targetLibraryID || !/^[a-zA-Z0-9_.:-]{1,96}$/.test(value.clientID) || !["copy", "move"].includes(value.mode) || !/^[a-f0-9]{64}$/.test(source.sha256) || !source.filename || source.filename.length > 255 || !Number.isSafeInteger(source.bytes) || source.bytes < 1 || !Number.isSafeInteger(source.revision) || source.revision < 1) return null;
    return value;
  } catch { return null; }
}
export function loadPendingTransfer(client: KnowledgeClient) {
  try { return parsePendingTransfer(localStorage.getItem(receiptKey(client))); } catch { return null; }
}
export function canTransferToLibrary(library: KnowledgeLibrary, sourceLibraryID: string, pendingTargetID?: string) {
  return library.id !== sourceLibraryID && documentCanWrite(library) && !library.archived && (library.documents_configured === true || pendingTargetID === library.id);
}

export function KnowledgeDocumentTransferDialog({ client, source: initialSource, canMove, formatError = defaultErrorMessage, onClose, onOpenTarget }: { client: KnowledgeClient; source: KnowledgeTransferSource; canMove: boolean; formatError?: (error: unknown) => string; onClose(): void; onOpenTarget(libraryID: string): void }) {
  const [pending, setPending] = useState(() => loadPendingTransfer(client));
  const source = pending?.source || initialSource, key = receiptKey(client);
  const [mode, setMode] = useState<"copy" | "move">(pending?.mode || "copy");
  const [page, setPage] = useState<KnowledgeLibraryPage>({ items: [], complete: true }), [cursors, setCursors] = useState([""]);
  const [target, setTarget] = useState<KnowledgeLibrary | null>(null), [result, setResult] = useState<KnowledgeDocument | null>(null);
  const [loading, setLoading] = useState(true), [busy, setBusy] = useState(false), [error, setError] = useState("");
  const lock = useRef(false), action = useRef<AbortController | null>(null), cursor = cursors.at(-1) || "";
  useEffect(() => () => action.current?.abort(), []);
  useEffect(() => {
    const abort = new AbortController(); setLoading(true);
    const signal = AbortSignal.any([abort.signal, AbortSignal.timeout(15_000)]);
    void Promise.all([client.listLibraries(cursor, 20, signal), pending ? client.getLibrary(pending.targetLibraryID, signal) : Promise.resolve(null)]).then(([value, previous]) => {
      if (!abort.signal.aborted) { setPage(value); if (previous) setTarget(previous); }
    }).catch(failure => { if (!abort.signal.aborted) { setTarget(null); setPage({ items: [], complete: true }); setError(formatError(failure)); } }).finally(() => { if (!abort.signal.aborted) setLoading(false); });
    return () => abort.abort();
  }, [client, cursor, formatError, pending]);
  const usable = (library: KnowledgeLibrary) => canTransferToLibrary(library, source.library_id, pending?.targetLibraryID);
  function clearReceipt(receipt: PendingTransfer) {
    if (parsePendingTransfer(localStorage.getItem(key))?.clientID === receipt.clientID) localStorage.removeItem(key);
    setPending(null);
  }
  async function transfer() {
    if (lock.current || !target || !usable(target)) return;
    lock.current = true; setBusy(true); setError("");
    const abort = new AbortController(); action.current = abort;
    const signal = AbortSignal.any([abort.signal, AbortSignal.timeout(60_000)]);
    try {
      const receipt = pending || { source, targetLibraryID: target.id, mode, clientID: crypto.randomUUID() };
      const persist = () => {
        const existing = parsePendingTransfer(localStorage.getItem(key));
        if (existing && existing.clientID !== receipt.clientID) throw Error("另一项文档复制或移动仍待确认，请先处理。 ");
        localStorage.setItem(key, JSON.stringify(receipt));
      };
      if (navigator.locks) await navigator.locks.request(`domainry-knowledge:transfer:${client.scope?.() || "default"}`, persist); else persist();
      signal.throwIfAborted(); setPending(receipt);
      const document = await client.transferDocument({ ...receipt, targetLibraryID: receipt.targetLibraryID, signal });
      if (document.library_id !== receipt.targetLibraryID || document.filename !== source.filename || document.bytes !== source.bytes || document.sha256 !== source.sha256) throw Error("目标文档与本次操作不一致，请刷新核对。");
      clearReceipt(receipt); setResult(document);
    } catch (failure) { if (!abort.signal.aborted) setError(formatError(failure)); }
    finally { lock.current = false; if (!abort.signal.aborted) setBusy(false); }
  }

  return createPortal(<div className="knowledge-modal-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget && !busy) onClose(); }}><section className="knowledge-transfer-dialog" role="dialog" aria-modal="true" aria-label="复制或移动文档"><header><div><h2>复制或移动文档</h2><p>选择目标资料库并确认可见范围；目标保存独立原文件，索引由后台处理。</p></div><Button aria-label="关闭" disabled={busy} onClick={onClose}><X size={17} /></Button></header><p><strong>{source.filename}</strong></p>
    {error && <p role="alert" className="knowledge-error">{error}</p>}
    {result ? <><p role="status">{mode === "move" ? "目标原文件已保存，原位置已停止访问。" : "独立副本已保存，原位置保留。"}当前目标状态：{documentLabel(result)}。</p><Button onClick={() => onOpenTarget(result.library_id)}>查看目标资料库</Button></> : <>
      {pending ? <p className="knowledge-subtle">上次{pending.mode === "move" ? "移动" : "复制"}结果待确认；继续会使用原请求编号，不会重复创建目标文档。</p> : <><label>操作方式 <select disabled={busy} value={mode} onChange={event => setMode(event.target.value as "copy" | "move")}><option value="copy">复制，保留原文档</option><option value="move" disabled={!canMove}>移动，原位置停止访问</option></select></label>{!canMove && <p className="knowledge-subtle">移动需要原资料库的编辑或管理权限。</p>}
        {loading ? <p className="knowledge-subtle">正在读取目标知识库…</p> : <div className="knowledge-transfer-list">{page.items.map(library => <button key={library.id} aria-current={target?.id === library.id ? "true" : undefined} disabled={busy || !usable(library)} onClick={() => setTarget(library)}><strong>{library.name}</strong><small>{library.kind === "personal" ? "个人知识库 · 仅自己可见" : "团队知识库 · 阅读成员可见"}{!usable(library) ? " · 不可选择" : ""}</small></button>)}</div>}
        {(cursors.length > 1 || !page.complete) && <div className="knowledge-pagination"><Button disabled={busy || loading || cursors.length === 1} onClick={() => setCursors(value => value.slice(0, -1))}>上一页</Button><Button disabled={busy || loading || !page.next_after} onClick={() => setCursors(value => [...value, page.next_after!])}>下一页</Button></div>}
      </>}
      {target && <div className="knowledge-confirm"><p>{mode === "move" ? "移动" : "复制"}“{source.filename}”到“{target.name}”？{target.kind === "shared" ? "目标资料库的所有阅读成员都能访问该文件。" : "目标文件仅自己可见。"}</p><Button disabled={busy || loading || !usable(target)} onClick={() => void transfer()}>{busy ? "正在处理…" : pending ? "继续核对上次操作" : mode === "move" ? "确认移动文档" : "确认复制文档"}</Button></div>}
      {pending && <Button disabled={busy} onClick={() => { clearReceipt(pending); onClose(); }}>结束重试，不撤销已受理操作</Button>}
    </>}
  </section></div>, window.document.body);
}
