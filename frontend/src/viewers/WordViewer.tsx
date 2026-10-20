import { useEffect, useRef, useState } from "react";
import { renderAsync } from "docx-preview";
import { loadOffice } from "./office-load.ts";

const frameHTML = `<!doctype html><html><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src data: blob:; font-src data: blob:; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'"><style>body{margin:0;background:#f5f6f4;color:#25332e}.docx-wrapper{padding:16px!important}a{pointer-events:none}img{max-width:100%}@media(max-width:600px){.docx-wrapper{padding:8px!important}section.docx{padding:24px!important;width:auto!important;min-width:0!important}table{max-width:100%}}</style></head><body><main id="document"></main></body></html>`;

export function WordViewer({ blob }: { blob: Blob }) {
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
    }).catch(failure => { if (!abort.signal.aborted) { setError(failure instanceof Error ? failure.message : "Word 文件无法预览。"); setLoading(false); } });
    return () => { abort.abort(); frame.current?.contentDocument?.getElementById("document")?.replaceChildren(); };
  }, [blob, ready]);
  return <div className="knowledge-file-viewer"><p className="knowledge-subtle">Word 只读预览 · 复杂排版可能与桌面 Word 有差异。</p>{loading && <p role="status">正在排版文档…</p>}{error && <p role="alert" className="knowledge-error">{error}</p>}<iframe className="knowledge-word-frame" title="Word 原文件预览" ref={frame} sandbox="allow-same-origin" srcDoc={frameHTML} onLoad={() => setReady(true)} aria-busy={loading} /></div>;
}
