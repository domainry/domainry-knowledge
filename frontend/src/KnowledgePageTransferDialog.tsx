import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { kt } from "./i18n/runtime.ts";
import { Button } from "./components.tsx";
import { canTransferPageToLibrary } from "./pageTransfer.ts";
import type { KnowledgeClient, KnowledgeLibrary, KnowledgeLibraryPage, KnowledgePage, KnowledgePageIdentity, KnowledgePageMoveImpact } from "./types.ts";

export function KnowledgePageTransferDialog({ client, sourceLibrary, page, formatError, onClose, onTransferred }: {
  client: KnowledgeClient;
  sourceLibrary: KnowledgeLibrary;
  page: KnowledgePage;
  formatError(error: unknown): string;
  onClose(): void;
  onTransferred(targetLibrary: KnowledgeLibrary, page: KnowledgePage): void;
}) {
  const [libraries, setLibraries] = useState<KnowledgeLibraryPage>({ items: [], complete: true });
  const [cursors, setCursors] = useState([""]);
  const [target, setTarget] = useState<KnowledgeLibrary | null>(null);
  const [parentQuery, setParentQuery] = useState("");
  const [parentResults, setParentResults] = useState<KnowledgePageIdentity[]>([]);
  const [parent, setParent] = useState<KnowledgePageIdentity | null>(null);
  const [impact, setImpact] = useState<KnowledgePageMoveImpact | null>(null);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const lock = useRef(false);
  const cursor = cursors.at(-1) || "";

  useEffect(() => {
    const abort = new AbortController();
    setLoading(true);
    void client.listLibraries(cursor, 20, AbortSignal.any([abort.signal, AbortSignal.timeout(15_000)]))
      .then(value => { if (!abort.signal.aborted) setLibraries(value); })
      .catch(failure => { if (!abort.signal.aborted) setError(formatError(failure)); })
      .finally(() => { if (!abort.signal.aborted) setLoading(false); });
    return () => abort.abort();
  }, [client, cursor, formatError]);

  useEffect(() => {
    const query = parentQuery.trim();
    if (!target || !query) { setParentResults([]); setSearching(false); return; }
    const abort = new AbortController();
    const timer = window.setTimeout(() => {
      setSearching(true);
      void client.searchPageIdentities(target.id, query, 20, AbortSignal.any([abort.signal, AbortSignal.timeout(15_000)]))
        .then(value => { if (!abort.signal.aborted) setParentResults(value.items); })
        .catch(failure => { if (!abort.signal.aborted) { setParentResults([]); setError(formatError(failure)); } })
        .finally(() => { if (!abort.signal.aborted) setSearching(false); });
    }, 250);
    return () => { window.clearTimeout(timer); abort.abort(); };
  }, [client, formatError, parentQuery, target]);

  function chooseTarget(value: KnowledgeLibrary) {
    setTarget(value); setParent(null); setParentQuery(""); setParentResults([]); setImpact(null); setError("");
  }

  async function preview() {
    if (lock.current || !target || !client.previewPageMove || !canTransferPageToLibrary(target, sourceLibrary.id)) return;
    lock.current = true; setBusy(true); setError("");
    try {
      const value = await client.previewPageMove(sourceLibrary.id, page.id, {
        target_library_id: target.id,
        parent_page_id: parent?.page_id,
        rank: page.rank,
      }, AbortSignal.timeout(30_000));
      setImpact(value);
    } catch (failure) { setError(formatError(failure)); }
    finally { lock.current = false; setBusy(false); }
  }

  async function transfer() {
    if (lock.current || !target || !impact || !canTransferPageToLibrary(target, sourceLibrary.id)) return;
    lock.current = true; setBusy(true); setError("");
    try {
      const moved = await client.movePage(sourceLibrary.id, page.id, {
        client_id: crypto.randomUUID(), expected_revision: page.revision,
        target_library_id: target.id, parent_page_id: parent?.page_id,
        rank: page.rank, access_impact_token: impact.token,
      }, AbortSignal.timeout(60_000));
      onTransferred(target, moved);
    } catch (failure) { setError(formatError(failure)); }
    finally { lock.current = false; setBusy(false); }
  }

  const targetUsable = target && canTransferPageToLibrary(target, sourceLibrary.id);
  return createPortal(<div className="knowledge-modal-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget && !busy) onClose(); }}>
    <section className="knowledge-transfer-dialog" role="dialog" aria-modal="true" aria-label={kt("knowledge.auto.fc6bb436b8caf08b")}>
      <header><div><h2>{kt("knowledge.auto.fc6bb436b8caf08b")} · {page.title}</h2><p>{kt("knowledge.auto.3b3dd55495dda5f6")}</p></div><Button aria-label={kt("knowledge.auto.3fd47edce45b3603")} disabled={busy} onClick={onClose}><X size={17} /></Button></header>
      {error && <p role="alert" className="knowledge-error">{error}</p>}
      {loading ? <p className="knowledge-subtle">{kt("knowledge.auto.f98b0a5bbacfb1c6")}</p> : <div className="knowledge-transfer-list">{libraries.items.map(item => {
        const usable = canTransferPageToLibrary(item, sourceLibrary.id);
        return <button key={item.id} aria-current={target?.id === item.id ? "true" : undefined} disabled={busy || !usable} onClick={() => chooseTarget(item)}><span><strong>{item.name}</strong><small>{item.kind === "shared" ? kt("knowledge.auto.07232412b43dde57") : kt("knowledge.auto.b23f90380cdd9003")}{!usable ? kt("knowledge.auto.04b2791343c64b5b") : ""}</small></span></button>;
      })}</div>}
      {(cursors.length > 1 || !libraries.complete) && <div className="knowledge-pagination"><Button disabled={busy || loading || cursors.length === 1} onClick={() => setCursors(value => value.slice(0, -1))}>{kt("knowledge.auto.c9b9ae7a61444ab7")}</Button><Button disabled={busy || loading || !libraries.next_after} onClick={() => setCursors(value => [...value, libraries.next_after!])}>{kt("knowledge.auto.8a8542f6964852dc")}</Button></div>}
      {targetUsable && <>
        <label>{kt("knowledge.auto.15786e92263d9459")}<input value={parentQuery} maxLength={256} disabled={busy} onChange={event => { setParentQuery(event.target.value); setParent(null); setImpact(null); }} placeholder={kt("knowledge.auto.44ce7ae909bbb28b")} /></label>
        <div className="knowledge-transfer-list"><button aria-current={parent === null ? "true" : undefined} disabled={busy} onClick={() => { setParent(null); setParentQuery(""); setParentResults([]); setImpact(null); }}><span><strong>{kt("knowledge.auto.42ee2863b6d776ff")}</strong><small>{target.name}</small></span></button>{parentResults.map(item => <button key={item.page_id} aria-current={parent?.page_id === item.page_id ? "true" : undefined} disabled={busy} onClick={() => { setParent(item); setParentQuery(item.title); setParentResults([]); setImpact(null); }}><span><strong>{item.title}</strong><small>{item.path.map(segment => segment.title).join(" / ")}</small></span></button>)}</div>
        {searching && <p className="knowledge-subtle">{kt("knowledge.auto.3310a3aff04dec06")}</p>}
        {!impact && <div className="knowledge-actions"><Button className="primary" disabled={busy || searching} onClick={() => void preview()}>{kt("knowledge.auto.15786e92263d9459")}</Button><Button disabled={busy} onClick={onClose}>{kt("knowledge.auto.2cd0f3be8738a86c")}</Button></div>}
      </>}
      {impact && <section className="knowledge-confirm knowledge-move-impact"><h3>{kt("knowledge.auto.abffdaf9fb6ebc33")}</h3><p>{kt("knowledge.auto.d23818fa69418968")}{impact.affected_pages} {kt("knowledge.auto.937a7533bd1edac5")}{impact.changed_subjects.length} {kt("knowledge.auto.93da36b330112475")}</p><div className="knowledge-actions"><Button className="danger" disabled={busy} onClick={() => void transfer()}>{kt("knowledge.auto.53c8cf2dc28cb380")}</Button><Button disabled={busy} onClick={() => setImpact(null)}>{kt("knowledge.auto.80446e210c9863e9")}</Button></div></section>}
    </section>
  </div>, window.document.body);
}
