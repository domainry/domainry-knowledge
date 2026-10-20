import { useMemo, useRef, useState } from "react";
import { Excalidraw } from "@excalidraw/excalidraw";
import type { AppState, BinaryFiles, ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";
import type { ExcalidrawElement } from "@excalidraw/excalidraw/element/types";
import { Plus, Trash2 } from "lucide-react";
import "@excalidraw/excalidraw/index.css";
import { Button } from "../components.tsx";
import type { KnowledgeEditorProps } from "./types.ts";

type CanvasSnapshot = { nodes: readonly ExcalidrawElement[]; files?: BinaryFiles; appState?: Partial<AppState> };
type Slide = { id: string; title: string; elements: readonly ExcalidrawElement[]; files?: BinaryFiles; appState?: Partial<AppState> };
type PresentationSnapshot = { slides: Slide[] };

function safeParse<T>(body: string, fallback: T): T {
  try { return JSON.parse(body) as T; } catch { return fallback; }
}

function savedAppState(state: AppState): Partial<AppState> {
  return {
    viewBackgroundColor: state.viewBackgroundColor,
    gridSize: state.gridSize,
    gridStep: state.gridStep,
    gridModeEnabled: state.gridModeEnabled,
  };
}

function ExcalidrawCanvas({ snapshot, readOnly, onSnapshot }: { snapshot: CanvasSnapshot; readOnly: boolean; onSnapshot(value: CanvasSnapshot): void }) {
  const initialData = useMemo(() => ({ elements: snapshot.nodes || [], appState: snapshot.appState || {}, files: snapshot.files || {} }), []);
  const emitted = useRef(JSON.stringify({ nodes: snapshot.nodes || [], files: snapshot.files || {} }));
  return <div className="native-canvas-host">
    <Excalidraw
      initialData={initialData}
      viewModeEnabled={readOnly}
      zenModeEnabled={readOnly}
      UIOptions={{ canvasActions: { loadScene: false, saveToActiveFile: false } }}
      onChange={(elements: readonly ExcalidrawElement[], appState: AppState, files: BinaryFiles) => {
        const core = JSON.stringify({ nodes: elements, files });
        if (!readOnly && core !== emitted.current) {
          emitted.current = core;
          onSnapshot({ nodes: elements, files, appState: savedAppState(appState) });
        }
      }}
    />
  </div>;
}

export function WhiteboardEditor({ body, readOnly = false, onChange }: KnowledgeEditorProps) {
  const snapshot = useMemo(() => safeParse<CanvasSnapshot>(body, { nodes: [], files: {} }), [body]);
  return <div className="knowledge-open-editor is-excalidraw"><ExcalidrawCanvas snapshot={snapshot} readOnly={readOnly} onSnapshot={value => onChange(JSON.stringify(value))} /></div>;
}

export function PresentationEditor({ body, readOnly = false, onChange }: KnowledgeEditorProps) {
  const snapshot = useMemo(() => safeParse<PresentationSnapshot>(body, { slides: [] }), [body]);
  const slides = snapshot.slides.length ? snapshot.slides : [{ id: "slide-1", title: "未命名幻灯片", elements: [], files: {} }];
  const [selectedID, setSelectedID] = useState(slides[0].id);
  const selectedIndex = Math.max(0, slides.findIndex(slide => slide.id === selectedID));
  const selected = slides[selectedIndex];
  const commit = (next: Slide[]) => onChange(JSON.stringify({ slides: next }));
  const addSlide = () => {
    const slide: Slide = { id: crypto.randomUUID(), title: `幻灯片 ${slides.length + 1}`, elements: [], files: {} };
    setSelectedID(slide.id);
    commit([...slides, slide]);
  };

  return <div className="knowledge-open-editor is-presentation">
    <aside className="native-slide-list" aria-label="幻灯片列表">
      {slides.map((slide, index) => <button className={slide.id === selected.id ? "is-active" : ""} key={slide.id} onClick={() => setSelectedID(slide.id)}>
        <span>{index + 1}</span><strong>{slide.title || `幻灯片 ${index + 1}`}</strong>
      </button>)}
      {!readOnly && <Button onClick={addSlide}><Plus size={15} />新建幻灯片</Button>}
    </aside>
    <section className="native-slide-stage">
      {!readOnly && <div className="native-editor-actions">
        <input aria-label="幻灯片标题" value={selected.title} onChange={event => commit(slides.map((slide, index) => index === selectedIndex ? { ...slide, title: event.target.value } : slide))} />
        {slides.length > 1 && <Button title="删除当前幻灯片" onClick={() => { const next = slides.filter(slide => slide.id !== selected.id); setSelectedID(next[Math.max(0, selectedIndex - 1)].id); commit(next); }}><Trash2 size={15} /></Button>}
      </div>}
      <ExcalidrawCanvas
        key={selected.id}
        readOnly={readOnly}
        snapshot={{ nodes: selected.elements || [], files: selected.files, appState: selected.appState }}
        onSnapshot={value => commit(slides.map((slide, index) => index === selectedIndex ? { ...slide, elements: value.nodes, files: value.files, appState: value.appState } : slide))}
      />
    </section>
  </div>;
}
