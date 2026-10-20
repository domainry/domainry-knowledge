import { useEffect, useState } from "react";
import type { FilePreviewLocation } from "../types.ts";
import { loadOffice } from "./office-load.ts";
import type { DisplaySlide } from "./office-types.ts";

export function PresentationViewer({ blob, location }: { blob: Blob; location?: FilePreviewLocation }) {
  const [slides, setSlides] = useState<DisplaySlide[]>([]), [selected, setSelected] = useState(0), [error, setError] = useState("");
  useEffect(() => {
    const abort = new AbortController();
    void loadOffice(blob, "pptx", abort.signal).then(result => {
      if (abort.signal.aborted) return;
      const next = result.slides || [];
      setSlides(next);
      const requested = next.findIndex(slide => slide.number === location?.slide);
      setSelected(requested >= 0 ? requested : 0);
    }).catch(failure => { if (!abort.signal.aborted) setError(failure instanceof Error ? failure.message : "PowerPoint 文件无法预览。"); });
    return () => abort.abort();
  }, [blob, location?.slide]);
  const current = slides[selected];
  return <div className="knowledge-file-viewer">
    <p className="knowledge-subtle">PowerPoint 只读文本预览 · 保留幻灯片顺序和文字；版式、图片、图表、动画与备注请下载原文件查看。</p>
    {error && <p role="alert" className="knowledge-error">{error}</p>}
    {!current && !error && <p role="status">正在读取幻灯片…</p>}
    {current && <div className="knowledge-presentation"><nav aria-label="幻灯片列表">{slides.map((slide, index) => <button key={slide.number} aria-current={index === selected ? "true" : undefined} onClick={() => setSelected(index)}><span>{slide.number}</span><strong>{slide.title}</strong></button>)}</nav><article aria-label={`第 ${current.number} 张幻灯片`}><small>第 {current.number} / {slides.length} 张</small><h2>{current.title}</h2>{current.lines.length ? current.lines.map((line, index) => <p key={index}>{line}</p>) : <p className="knowledge-subtle">这张幻灯片没有可提取的正文文字。</p>}</article></div>}
  </div>;
}
