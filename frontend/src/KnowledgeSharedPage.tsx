import { formatKnowledgeDate, kt } from "./i18n/runtime.ts";
import { useEffect, useRef, useState } from "react";
import { Clock3, KeyRound, Link2, ShieldCheck } from "lucide-react";
import { Button } from "./components.tsx";
import { KnowledgeEditor } from "./editors/KnowledgeEditor.tsx";
import { parseKnowledgePageShareLocation } from "./knowledge-share-links.ts";
import { PageTypeIcon, pageTypeMeta } from "./pageTypeRegistry.ts";
import type { KnowledgeClient, KnowledgePageSharedView } from "./types.ts";
import { KnowledgeClassificationBadge, KnowledgeDynamicWatermark } from "./KnowledgePageGovernance.tsx";

function errorCode(error: unknown) {
  return typeof error === "object" && error !== null && "code" in error && typeof (error as { code?: unknown }).code === "string" ? (error as { code: string }).code : "";
}

export function KnowledgeSharedPage({ client, shareID, pageID, formatError }: { client: KnowledgeClient; shareID: string; pageID: string; formatError(error: unknown): string }) {
  const [view, setView] = useState<KnowledgePageSharedView | null>(null), [password, setPassword] = useState("");
  const [busy, setBusy] = useState(true), [passwordRequired, setPasswordRequired] = useState(false), [error, setError] = useState("");
  const printAuthorizationRef = useRef(0);

  async function authorizeContentAction(operation: "copy" | "print" | "export") {
    if (!client.authorizePageShareContentOperation) throw Error(kt("knowledge.auto.6f2abf542cfc601f"));
    await client.authorizePageShareContentOperation(shareID, pageID, operation, AbortSignal.timeout(30_000));
  }

  async function read(signal: AbortSignal) {
    if (!client.readPageShare) throw Error(kt("knowledge.auto.a8495929a809553d"));
    const value = await client.readPageShare(shareID, pageID, signal);
    setView(value); setPasswordRequired(false); setError("");
  }

  async function redeem(secret: string, signal: AbortSignal) {
    if (!client.redeemPageShare) throw Error(kt("knowledge.auto.a0c92f72cd2a04ec"));
    await client.redeemPageShare(shareID, secret, signal);
    await read(signal);
  }

  useEffect(() => {
    const abort = new AbortController();
    const signal = AbortSignal.any([abort.signal, AbortSignal.timeout(30_000)]);
    setBusy(true); setError(""); setView(null); setPasswordRequired(false);
    void read(signal).catch(async failure => {
      if (signal.aborted) return;
      if (errorCode(failure) !== "knowledge.page_share_redeem_required") throw failure;
      try { await redeem("", signal); }
      catch (redeemFailure) {
        if (errorCode(redeemFailure) === "knowledge.page_share_password_invalid") { setPasswordRequired(true); return; }
        throw redeemFailure;
      }
    }).catch(failure => { if (!signal.aborted) setError(formatError(failure)); }).finally(() => { if (!signal.aborted) setBusy(false); });
    return () => abort.abort();
  }, [client, formatError, pageID, shareID]);

  useEffect(() => {
    const beforePrint = () => {
      if (Date.now() <= printAuthorizationRef.current) return;
      document.body.dataset.knowledgePrintBlockedMessage = kt("knowledge.auto.a7952c4e3f72cf58");
      document.body.classList.add("knowledge-print-blocked");
      setError(kt("knowledge.auto.a7952c4e3f72cf58"));
    };
    const afterPrint = () => {
      printAuthorizationRef.current = 0;
      document.body.classList.remove("knowledge-print-blocked");
      delete document.body.dataset.knowledgePrintBlockedMessage;
    };
    const keydown = (event: KeyboardEvent) => {
      if (!(event.ctrlKey || event.metaKey) || event.altKey || event.key.toLowerCase() !== "p" || !view) return;
      event.preventDefault();
      void authorizeContentAction("print").then(() => {
        printAuthorizationRef.current = Date.now() + 5_000;
        window.print();
      }, failure => setError(formatError(failure)));
    };
    window.addEventListener("beforeprint", beforePrint);
    window.addEventListener("afterprint", afterPrint);
    window.addEventListener("keydown", keydown, true);
    return () => {
      window.removeEventListener("beforeprint", beforePrint);
      window.removeEventListener("afterprint", afterPrint);
      window.removeEventListener("keydown", keydown, true);
      document.body.classList.remove("knowledge-print-blocked");
      delete document.body.dataset.knowledgePrintBlockedMessage;
    };
  }, [client, formatError, pageID, shareID, view]);

  async function controlledCopy(event: React.ClipboardEvent<HTMLElement>) {
    const text = window.getSelection()?.toString() || "";
    if (!text) return;
    event.preventDefault();
    try {
      await authorizeContentAction("copy");
      await navigator.clipboard.writeText(text);
    } catch (failure) { setError(formatError(failure)); }
  }

  async function submit() {
    if (!password || busy) return;
    setBusy(true); setError("");
    try { await redeem(password, AbortSignal.timeout(30_000)); }
    catch (failure) { setError(formatError(failure)); }
    finally { setBusy(false); }
  }

  if (busy && !view) return <main className="knowledge-shared-state" role="status"><Link2 size={28} /><h1>{kt("knowledge.auto.76a7b3acb578d6e1")}</h1><p>{kt("knowledge.auto.ecdebe9106969c5e")}</p></main>;
  if (passwordRequired && !view) return <main className="knowledge-shared-state"><KeyRound size={28} /><h1>{kt("knowledge.auto.56d17bed8bde8ac3")}</h1><p>{kt("knowledge.auto.667440f80ed41ff7")}</p><label>{kt("knowledge.auto.f4f712d5be91721a")}<input autoFocus type="password" minLength={8} maxLength={72} value={password} onChange={event => setPassword(event.target.value)} onKeyDown={event => { if (event.key === "Enter") void submit(); }} /></label>{error && <p className="knowledge-error" role="alert">{error}</p>}<Button className="primary" disabled={busy || password.length < 8} onClick={() => void submit()}>{busy ? kt("knowledge.auto.c725500abce15983") : kt("knowledge.auto.2187c463f1cdf72d")}</Button></main>;
  if (!view?.view.published) return <main className="knowledge-shared-state"><ShieldCheck size={28} /><h1>{kt("knowledge.auto.b0af320a2a41ff38")}</h1><p>{error || kt("knowledge.auto.4140376178e8dc19")}</p></main>;

  const published = view.view.published;
  return <main className="knowledge-shared-page">
    <KnowledgeDynamicWatermark governance={view.view.governance} />
    <header><span className="knowledge-shared-page-icon"><PageTypeIcon type={published.content_type} size={20} /></span><div><small>{kt("knowledge.auto.43ed5efc46d882fb")}{pageTypeMeta[published.content_type].label}</small><h1>{published.title}</h1><KnowledgeClassificationBadge governance={view.view.governance} /><p><Clock3 size={13} />{kt("knowledge.auto.5f76b2bf82dd2c5d")}{published.version} {kt("knowledge.auto.9c8b1bf537df251b")}{formatKnowledgeDate(published.published_at)} {kt("knowledge.auto.2fbfff136c75eced")}{formatKnowledgeDate(view.share.expires_at)}</p></div></header>
    <div className="knowledge-shared-security"><ShieldCheck size={15} /><span>{kt("knowledge.auto.1f7edfed01333c4f")}</span></div>
    <article className="knowledge-page-readable typed-readable" onCopyCapture={event => void controlledCopy(event)}><KnowledgeEditor type={published.content_type} body={published.body.content} documentTitle={published.title} readOnly authorizeContentAction={authorizeContentAction} onActionFeedback={setError} onChange={() => undefined} /></article>
  </main>;
}
