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
    if (!client.authorizePageShareContentOperation) throw Error("当前前端未启用受控分享内容保护。");
    await client.authorizePageShareContentOperation(shareID, pageID, operation, AbortSignal.timeout(30_000));
  }

  async function read(signal: AbortSignal) {
    if (!client.readPageShare) throw Error("当前前端未启用受控分享读取能力。");
    const value = await client.readPageShare(shareID, pageID, signal);
    setView(value); setPasswordRequired(false); setError("");
  }

  async function redeem(secret: string, signal: AbortSignal) {
    if (!client.redeemPageShare) throw Error("当前前端未启用受控分享兑换能力。");
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
      document.body.classList.add("knowledge-print-blocked");
      setError("请使用 Ctrl/⌘ + P，由服务端重新校验分享与打印策略后再打印。");
    };
    const afterPrint = () => {
      printAuthorizationRef.current = 0;
      document.body.classList.remove("knowledge-print-blocked");
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

  if (busy && !view) return <main className="knowledge-shared-state" role="status"><Link2 size={28} /><h1>正在核对分享权限…</h1><p>服务端正在确认登录身份、分享状态和有效期。</p></main>;
  if (passwordRequired && !view) return <main className="knowledge-shared-state"><KeyRound size={28} /><h1>此分享需要访问密码</h1><p>密码只用于本次登录账号的服务端兑换，不会写入分享链接。</p><label>访问密码<input autoFocus type="password" minLength={8} maxLength={72} value={password} onChange={event => setPassword(event.target.value)} onKeyDown={event => { if (event.key === "Enter") void submit(); }} /></label>{error && <p className="knowledge-error" role="alert">{error}</p>}<Button className="primary" disabled={busy || password.length < 8} onClick={() => void submit()}>{busy ? "正在验证…" : "验证并打开"}</Button></main>;
  if (!view?.view.published) return <main className="knowledge-shared-state"><ShieldCheck size={28} /><h1>分享当前不可访问</h1><p>{error || "分享已撤销、已过期、账号不在允许范围，或页面不再发布。"}</p></main>;

  const published = view.view.published;
  return <main className="knowledge-shared-page">
    <KnowledgeDynamicWatermark governance={view.view.governance} />
    <header><span className="knowledge-shared-page-icon"><PageTypeIcon type={published.content_type} size={20} /></span><div><small>受控分享 · {pageTypeMeta[published.content_type].label}</small><h1>{published.title}</h1><KnowledgeClassificationBadge governance={view.view.governance} /><p><Clock3 size={13} />版本 {published.version} · 发布于 {new Date(published.published_at).toLocaleString()} · 分享有效至 {new Date(view.share.expires_at).toLocaleString()}</p></div></header>
    <div className="knowledge-shared-security"><ShieldCheck size={15} /><span>只读的已发布版本；每次打开都会重新核对账号、分享范围、有效期与撤销状态。</span></div>
    <article className="knowledge-page-readable typed-readable" onCopyCapture={event => void controlledCopy(event)}><KnowledgeEditor type={published.content_type} body={published.body.content} documentTitle={published.title} readOnly authorizeContentAction={authorizeContentAction} onActionFeedback={setError} onChange={() => undefined} /></article>
  </main>;
}
