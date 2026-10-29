import { kt, ktf } from "../i18n/runtime.ts";
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
    }).catch(failure => { if (!abort.signal.aborted) setError(failure instanceof Error ? failure.message : kt("knowledge.auto.f8e748c4ff79ead7")); });
    return () => abort.abort();
  }, [blob, location?.slide]);
  const current = slides[selected];
  return <div className="knowledge-file-viewer">
    <p className="knowledge-subtle">{kt("knowledge.auto.25bd27f008d40e5f")}</p>
    {error && <p role="alert" className="knowledge-error">{error}</p>}
    {!current && !error && <p role="status">{kt("knowledge.auto.642555750931a9e1")}</p>}
    {current && <div className="knowledge-presentation"><nav aria-label={kt("knowledge.auto.5d32c633a3d8db80")}>{slides.map((slide, index) => <button key={slide.number} aria-current={index === selected ? "true" : undefined} onClick={() => setSelected(index)}><span>{slide.number}</span><strong>{slide.title}</strong></button>)}</nav><article aria-label={ktf("knowledge.auto.dd8e9d8aaf45e73d", { value0: current.number })}><small>{kt("knowledge.auto.af50a0fe2a50a3d1")}{current.number} / {slides.length} {kt("knowledge.auto.f56a049fcc23f1eb")}</small><h2>{current.title}</h2>{current.lines.length ? current.lines.map((line, index) => <p key={index}>{line}</p>) : <p className="knowledge-subtle">{kt("knowledge.auto.afd73be5fdd5cc7d")}</p>}</article></div>}
  </div>;
}
