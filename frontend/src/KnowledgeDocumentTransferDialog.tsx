import { kt } from "./i18n/runtime.ts";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { Button, defaultErrorMessage, Select } from "./components.tsx";
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
        if (existing && existing.clientID !== receipt.clientID) throw Error(kt("knowledge.auto.e765f4e4c77eb250"));
        localStorage.setItem(key, JSON.stringify(receipt));
      };
      if (navigator.locks) await navigator.locks.request(`domainry-knowledge:transfer:${client.scope?.() || "default"}`, persist); else persist();
      signal.throwIfAborted(); setPending(receipt);
      const document = await client.transferDocument({ ...receipt, targetLibraryID: receipt.targetLibraryID, signal });
      if (document.library_id !== receipt.targetLibraryID || document.filename !== source.filename || document.bytes !== source.bytes || document.sha256 !== source.sha256) throw Error(kt("knowledge.auto.5f2ce25d445de0cd"));
      clearReceipt(receipt); setResult(document);
    } catch (failure) { if (!abort.signal.aborted) setError(formatError(failure)); }
    finally { lock.current = false; if (!abort.signal.aborted) setBusy(false); }
  }

  return createPortal(<div className="knowledge-modal-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget && !busy) onClose(); }}><section className="knowledge-transfer-dialog" role="dialog" aria-modal="true" aria-label={kt("knowledge.auto.1c2f74c7cc9ba9e7")}><header><div><h2>{kt("knowledge.auto.1c2f74c7cc9ba9e7")}</h2><p>{kt("knowledge.auto.5c3a7c7a50bb0da6")}</p></div><Button aria-label={kt("knowledge.auto.3fd47edce45b3603")} disabled={busy} onClick={onClose}><X size={17} /></Button></header><p><strong>{source.filename}</strong></p>
    {error && <p role="alert" className="knowledge-error">{error}</p>}
    {result ? <><p role="status">{mode === "move" ? kt("knowledge.auto.593803be7bcb9985") : kt("knowledge.auto.82645bd9703537a0")}{kt("knowledge.auto.074ad796f6651d6a")}{documentLabel(result)}。</p><Button onClick={() => onOpenTarget(result.library_id)}>{kt("knowledge.auto.fc14485014b4d992")}</Button></> : <>
      {pending ? <p className="knowledge-subtle">{kt("knowledge.auto.f664edd9036b794e")}{pending.mode === "move" ? kt("knowledge.auto.fc6bb436b8caf08b") : kt("knowledge.auto.63d90d977348ab1f")}{kt("knowledge.auto.0bbc9cb856092696")}</p> : <><label>{kt("knowledge.auto.2fa505cac3fc19e3")}<Select disabled={busy} value={mode} onChange={event => setMode(event.target.value as "copy" | "move")}><option value="copy">{kt("knowledge.auto.9c1a4a755b445e9d")}</option><option value="move" disabled={!canMove}>{kt("knowledge.auto.1b9f3e83857aba8f")}</option></Select></label>{!canMove && <p className="knowledge-subtle">{kt("knowledge.auto.3b3dd55495dda5f6")}</p>}
        {loading ? <p className="knowledge-subtle">{kt("knowledge.auto.f98b0a5bbacfb1c6")}</p> : <div className="knowledge-transfer-list">{page.items.map(library => <button key={library.id} aria-current={target?.id === library.id ? "true" : undefined} disabled={busy || !usable(library)} onClick={() => setTarget(library)}><strong>{library.name}</strong><small>{library.kind === "personal" ? kt("knowledge.auto.b23f90380cdd9003") : kt("knowledge.auto.07232412b43dde57")}{!usable(library) ? kt("knowledge.auto.04b2791343c64b5b") : ""}</small></button>)}</div>}
        {(cursors.length > 1 || !page.complete) && <div className="knowledge-pagination"><Button disabled={busy || loading || cursors.length === 1} onClick={() => setCursors(value => value.slice(0, -1))}>{kt("knowledge.auto.c9b9ae7a61444ab7")}</Button><Button disabled={busy || loading || !page.next_after} onClick={() => setCursors(value => [...value, page.next_after!])}>{kt("knowledge.auto.8a8542f6964852dc")}</Button></div>}
      </>}
      {target && <div className="knowledge-confirm"><p>{mode === "move" ? kt("knowledge.auto.fc6bb436b8caf08b") : kt("knowledge.auto.63d90d977348ab1f")}“{source.filename}{kt("knowledge.auto.e4dde04ba5e35007")}{target.name}”？{target.kind === "shared" ? kt("knowledge.auto.1a36805477be717a") : kt("knowledge.auto.088709e91827de91")}</p><Button disabled={busy || loading || !usable(target)} onClick={() => void transfer()}>{busy ? kt("knowledge.auto.574ec7517de1474c") : pending ? kt("knowledge.auto.5366ee55ac85f9a1") : mode === "move" ? kt("knowledge.auto.1dbd6de5e72c7f6d") : kt("knowledge.auto.4579f3ddd447a301")}</Button></div>}
      {pending && <Button disabled={busy} onClick={() => { clearReceipt(pending); onClose(); }}>{kt("knowledge.auto.ce6d192079598d5d")}</Button>}
    </>}
  </section></div>, window.document.body);
}
