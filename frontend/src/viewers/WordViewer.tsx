import { kt } from "../i18n/runtime.ts";
import { useEffect, useRef, useState } from "react";
import { renderAsync } from "docx-preview";
import { loadOffice } from "./office-load.ts";
import { useKnowledgeTheme } from "../theme.tsx";

const frameHTML = `<!doctype html><html><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src data: blob:; font-src data: blob:; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'"><style>html{color-scheme:light dark}body{margin:0;background:transparent;color:CanvasText}.docx-wrapper{padding:16px!important}a{pointer-events:none}img{max-width:100%}@media(max-width:600px){.docx-wrapper{padding:8px!important}section.docx{padding:24px!important;width:auto!important;min-width:0!important}table{max-width:100%}}</style></head><body><main id="document"></main></body></html>`;

export function WordViewer({ blob }: { blob: Blob }) {
  const theme = useKnowledgeTheme();
  const frame = useRef<HTMLIFrameElement>(null);
  const [ready, setReady] = useState(false), [loading, setLoading] = useState(true), [error, setError] = useState("");
  useEffect(() => {
    if (!ready) return;
    const abort = new AbortController();
    void loadOffice(blob, "docx", abort.signal).then(async () => {
      const host = frame.current?.contentDocument?.getElementById("document");
      if (abort.signal.aborted || !host) return;
      await renderAsync(blob, host, host, { useBase64URL: true, renderAltChunks: false, renderComments: false, breakPages: true, ignoreLastRenderedPageBreak: false });
      if (abort.signal.aborted) return;
      host.querySelectorAll("a").forEach(link => { link.removeAttribute("href"); link.removeAttribute("target"); });
      setLoading(false);
    }).catch(failure => { if (!abort.signal.aborted) { setError(failure instanceof Error ? failure.message : kt("knowledge.auto.04b3bd363ea7d303")); setLoading(false); } });
    return () => { abort.abort(); frame.current?.contentDocument?.getElementById("document")?.replaceChildren(); };
  }, [blob, ready]);
  useEffect(() => {
    const root = frame.current?.contentDocument?.documentElement;
    if (root) root.style.colorScheme = theme;
  }, [ready, theme]);
  return <div className="knowledge-file-viewer"><p className="knowledge-subtle">{kt("knowledge.auto.b53712c347d64a60")}</p>{loading && <p role="status">{kt("knowledge.auto.50555eb1f1d070f3")}</p>}{error && <p role="alert" className="knowledge-error">{error}</p>}<iframe className="knowledge-word-frame" title={kt("knowledge.auto.b985a1352b2a7ee1")} ref={frame} sandbox="allow-same-origin" srcDoc={frameHTML} onLoad={() => setReady(true)} aria-busy={loading} /></div>;
}
