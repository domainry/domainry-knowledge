import { useEffect, useMemo, useRef, useState } from "react";
import { Excalidraw, convertToExcalidrawElements, exportToBlob, exportToCanvas, viewportCoordsToSceneCoords } from "@excalidraw/excalidraw";
import type { AppState, BinaryFiles, ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";
import type { ExcalidrawElement } from "@excalidraw/excalidraw/element/types";
import type { ExcalidrawElementSkeleton } from "@excalidraw/excalidraw/data/transform";
import { ArrowDown, ArrowUp, ChevronsDown, ChevronsUp, FileDown, ImageDown, Layers3, StickyNote } from "lucide-react";
import "@excalidraw/excalidraw/index.css";
import { Button, Select } from "../components.tsx";
import { canonicalWhiteboardContent, parseWhiteboardContent, whiteboardElementQuote, whiteboardScene } from "./whiteboardContent.ts";
import { safeDocumentFilename } from "./documentTransfer.ts";
import { PageActionPortal } from "./PageActionPortal.tsx";
import type { KnowledgeEditorProps } from "./types.ts";
import { pickWhiteboardElement } from "./whiteboardHitTest.ts";

type CanvasSnapshot = { nodes: readonly ExcalidrawElement[]; files?: BinaryFiles; appState?: Partial<AppState> };
type LayerAction = "front" | "forward" | "backward" | "back";

function savedAppState(state: AppState): Partial<AppState> {
  return {
    viewBackgroundColor: state.viewBackgroundColor,
    gridSize: state.gridSize,
    gridStep: state.gridStep,
    gridModeEnabled: state.gridModeEnabled,
  };
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob), anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function ExcalidrawCanvas({ snapshot, readOnly, onSnapshot, onPresence, onSelectionChange, onElementHit, onAPI }: {
  snapshot: CanvasSnapshot;
  readOnly: boolean;
  onSnapshot(value: CanvasSnapshot): void;
  onPresence?(cursorID?: string, selectionID?: string): void;
  onSelectionChange?(ids: string[]): void;
  onElementHit?(element: ExcalidrawElement | null): void;
  onAPI?(api: ExcalidrawImperativeAPI): void;
}) {
  const initialData = useMemo(() => ({ elements: snapshot.nodes || [], appState: snapshot.appState || {}, files: snapshot.files || {} }), []);
  const emitted = useRef(JSON.stringify({ nodes: snapshot.nodes || [], files: snapshot.files || {} }));
  const selected = useRef("");
  const apiRef = useRef<ExcalidrawImperativeAPI | null>(null);
  const registerAPI = (api: ExcalidrawImperativeAPI) => {
    apiRef.current = api;
    onAPI?.(api);
  };
  return <div className="native-canvas-host" onPointerDownCapture={event => {
    if (!readOnly || !onElementHit || event.button !== 0) return;
    const api = apiRef.current;
    if (!api) return;
    const state = api.getAppState();
    const point = viewportCoordsToSceneCoords(event, state);
    onElementHit(pickWhiteboardElement(api.getSceneElements(), point.x, point.y, state.zoom.value));
  }}>
    <Excalidraw
      excalidrawAPI={registerAPI}
      initialData={initialData}
      viewModeEnabled={readOnly}
      zenModeEnabled={readOnly}
      UIOptions={{ canvasActions: { loadScene: false, saveToActiveFile: false } }}
      onPointerDown={(_, pointer) => onElementHit?.(pointer.hit.element)}
      onChange={(elements: readonly ExcalidrawElement[], appState: AppState, files: BinaryFiles) => {
        const selectedIDs = Object.keys(appState.selectedElementIds || {}).filter(id => appState.selectedElementIds[id]).sort();
        const selection = selectedIDs.join(":");
        if (selection !== selected.current) {
          selected.current = selection;
          onSelectionChange?.(selectedIDs);
          onPresence?.(selectedIDs[0], selectedIDs.length > 1 ? selectedIDs[selectedIDs.length - 1] : undefined);
        }
        const core = JSON.stringify({ nodes: elements, files });
        if (!readOnly && core !== emitted.current) {
          emitted.current = core;
          onSnapshot({ nodes: elements, files, appState: savedAppState(appState) });
        }
      }}
    />
  </div>;
}
function templateSkeletons(template: string): ExcalidrawElementSkeleton[] {
  const common = { strokeColor: "#2f493b", strokeWidth: 2, roughness: 1, fillStyle: "solid" as const };
  if (template === "brainstorm") return [
    { type: "text", x: 80, y: 45, text: "头脑风暴", fontSize: 30, strokeColor: "#183d2e", customData: { knowledgeKind: "template_heading" } },
    { type: "rectangle", x: 60, y: 110, width: 220, height: 130, backgroundColor: "#fff3bf", ...common, customData: { knowledgeKind: "sticky_note" }, label: { text: "想法一", fontSize: 22 } },
    { type: "rectangle", x: 320, y: 110, width: 220, height: 130, backgroundColor: "#d3f9d8", ...common, customData: { knowledgeKind: "sticky_note" }, label: { text: "想法二", fontSize: 22 } },
    { type: "rectangle", x: 580, y: 110, width: 220, height: 130, backgroundColor: "#d0ebff", ...common, customData: { knowledgeKind: "sticky_note" }, label: { text: "想法三", fontSize: 22 } },
  ] as ExcalidrawElementSkeleton[];
  if (template === "flow") return [
    { type: "text", x: 80, y: 45, text: "流程梳理", fontSize: 30, strokeColor: "#183d2e", customData: { knowledgeKind: "template_heading" } },
    { type: "ellipse", x: 70, y: 130, width: 150, height: 80, backgroundColor: "#d3f9d8", ...common, label: { text: "开始", fontSize: 20 } },
    { type: "rectangle", x: 340, y: 120, width: 180, height: 100, backgroundColor: "#d0ebff", ...common, label: { text: "处理步骤", fontSize: 20 } },
    { type: "diamond", x: 650, y: 115, width: 130, height: 110, backgroundColor: "#fff3bf", ...common, label: { text: "判断", fontSize: 18 } },
    { type: "arrow", x: 220, y: 170, width: 120, height: 0, strokeColor: "#2f493b", strokeWidth: 2, endArrowhead: "arrow" },
    { type: "arrow", x: 520, y: 170, width: 130, height: 0, strokeColor: "#2f493b", strokeWidth: 2, endArrowhead: "arrow" },
  ] as ExcalidrawElementSkeleton[];
  if (template === "retro") return [
    { type: "text", x: 70, y: 40, text: "团队复盘", fontSize: 30, strokeColor: "#183d2e", customData: { knowledgeKind: "template_heading" } },
    { type: "frame", x: 50, y: 100, width: 240, height: 360, name: "做得好", children: [] },
    { type: "frame", x: 320, y: 100, width: 240, height: 360, name: "待改进", children: [] },
    { type: "frame", x: 590, y: 100, width: 240, height: 360, name: "下一步", children: [] },
    { type: "rectangle", x: 75, y: 150, width: 190, height: 100, backgroundColor: "#d3f9d8", ...common, customData: { knowledgeKind: "sticky_note" }, label: { text: "记录亮点", fontSize: 20 } },
    { type: "rectangle", x: 345, y: 150, width: 190, height: 100, backgroundColor: "#ffe3e3", ...common, customData: { knowledgeKind: "sticky_note" }, label: { text: "记录问题", fontSize: 20 } },
    { type: "rectangle", x: 615, y: 150, width: 190, height: 100, backgroundColor: "#d0ebff", ...common, customData: { knowledgeKind: "sticky_note" }, label: { text: "明确行动", fontSize: 20 } },
  ] as ExcalidrawElementSkeleton[];
  return [];
}

function moveLayer(elements: readonly ExcalidrawElement[], selectedIDs: Set<string>, action: LayerAction) {
  if (!selectedIDs.size) return [...elements];
  if (action === "front") return [...elements.filter(element => !selectedIDs.has(element.id)), ...elements.filter(element => selectedIDs.has(element.id))];
  if (action === "back") return [...elements.filter(element => selectedIDs.has(element.id)), ...elements.filter(element => !selectedIDs.has(element.id))];
  const next = [...elements];
  if (action === "forward") {
    for (let index = next.length - 2; index >= 0; index--) if (selectedIDs.has(next[index].id) && !selectedIDs.has(next[index + 1].id)) [next[index], next[index + 1]] = [next[index + 1], next[index]];
  } else {
    for (let index = 1; index < next.length; index++) if (selectedIDs.has(next[index].id) && !selectedIDs.has(next[index - 1].id)) [next[index], next[index - 1]] = [next[index - 1], next[index]];
  }
  return next;
}

export function WhiteboardEditor({ body, readOnly = false, documentTitle = "画板", onChange, onPresence, onCommentAnchor, initialBlockID, blockHighlightRevision, pageActionHost, authorizeContentAction, onActionFeedback }: KnowledgeEditorProps) {
  const content = useMemo(() => parseWhiteboardContent(body), [body]);
  const scene = useMemo(() => whiteboardScene(content), [content]);
  const canonicalBody = useMemo(() => JSON.stringify(content), [content]);
  const apiRef = useRef<ExcalidrawImperativeAPI | null>(null);
  const [selectedIDs, setSelectedIDs] = useState<string[]>([]);
  const [exporting, setExporting] = useState("");
  const selectedSet = useMemo(() => new Set(selectedIDs), [selectedIDs]);

  const commitScene = (value: CanvasSnapshot) => {
    const nextBody = JSON.stringify(canonicalWhiteboardContent(value.nodes, value.files || {}, value.appState || {}));
    if (nextBody !== canonicalBody) onChange(nextBody);
  };
  const addElements = (skeletons: ExcalidrawElementSkeleton[]) => {
    const api = apiRef.current;
    if (!api || !skeletons.length) return;
    const existing = api.getSceneElements();
    const created = convertToExcalidrawElements(skeletons, { regenerateIds: true });
    const offset = existing.length ? 48 + Math.min(320, existing.length * 8) : 0;
    const moved = created.map(element => ({ ...element, x: element.x + offset, y: element.y + offset }));
    api.updateScene({ elements: [...existing, ...moved], appState: { selectedElementIds: Object.fromEntries(moved.map(element => [element.id, true])) } });
    window.setTimeout(() => api.scrollToContent(moved, { fitToContent: true, animate: true }), 0);
  };
  const addSticky = () => addElements([{ type: "rectangle", x: 100, y: 100, width: 220, height: 130, strokeColor: "#5f4b00", backgroundColor: "#fff3bf", fillStyle: "solid", strokeWidth: 2, roughness: 1, roundness: { type: 3 }, customData: { knowledgeKind: "sticky_note" }, label: { text: "新便签", fontSize: 22 } } as ExcalidrawElementSkeleton]);
  const applyLayer = (action: LayerAction) => {
    const api = apiRef.current;
    if (!api || !selectedSet.size) return;
    api.updateScene({ elements: moveLayer(api.getSceneElements(), selectedSet, action) });
  };
  const exportBoard = async (format: "png" | "pdf") => {
    const api = apiRef.current;
    if (!api) return;
    const elements = api.getSceneElements().filter(element => !element.isDeleted);
    if (!elements.length) { onActionFeedback?.("画板为空，暂无可导出的内容。"); return; }
    setExporting(format);
    try {
      if (!authorizeContentAction) throw Error("当前页面禁止导出内容。");
      await authorizeContentAction(format === "pdf" ? "print" : "export");
      const options = { elements, files: api.getFiles(), appState: { ...api.getAppState(), exportBackground: true, exportWithDarkMode: false } };
      if (format === "png") {
        const blob = await exportToBlob({ ...options, mimeType: "image/png", exportPadding: 32 });
        downloadBlob(blob, safeDocumentFilename(documentTitle, "png"));
      } else {
        const canvas = await exportToCanvas({ ...options, exportPadding: 32, getDimensions: (width: number, height: number) => ({ width, height, scale: Math.min(2, 4096 / Math.max(width, height)) }) });
        const { jsPDF } = await import("jspdf");
        const pdf = new jsPDF({ orientation: canvas.width >= canvas.height ? "landscape" : "portrait", unit: "px", format: [canvas.width, canvas.height], hotfixes: ["px_scaling"], compress: true });
        pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, canvas.width, canvas.height, undefined, "FAST");
        pdf.save(safeDocumentFilename(documentTitle, "pdf"));
      }
      onActionFeedback?.(`已导出${format === "png" ? " PNG 图片" : " PDF 文档"}。`);
    } catch (failure) {
      onActionFeedback?.(failure instanceof Error ? failure.message : "画板导出失败");
    } finally {
      setExporting("");
    }
  };
  const selectCommentAnchor = (element: ExcalidrawElement | null) => {
    if (!onCommentAnchor) return;
    if (!element) { onCommentAnchor(undefined); return; }
    const canonical = canonicalWhiteboardContent([element], {}, {}).elements[0];
    onCommentAnchor(canonical ? { nodeID: canonical.id, quote: whiteboardElementQuote(canonical) } : undefined);
  };

  useEffect(() => {
    const api = apiRef.current;
    if (!api || !initialBlockID) return;
    const target = api.getSceneElements().find(element => element.id === initialBlockID);
    if (target) api.scrollToContent(target, { fitToContent: true, animate: true });
  }, [initialBlockID, blockHighlightRevision]);

  return <div className="knowledge-open-editor is-excalidraw is-whiteboard">
    {authorizeContentAction && <PageActionPortal host={pageActionHost}>
      <Button title="导出 PNG" disabled={!!exporting} onClick={() => void exportBoard("png")}><ImageDown size={15} />PNG</Button>
      <Button title="导出 PDF" disabled={!!exporting} onClick={() => void exportBoard("pdf")}><FileDown size={15} />PDF</Button>
    </PageActionPortal>}
    {!readOnly && <div className="native-whiteboard-toolbar" aria-label="画板工具">
      <Button title="添加便签" onClick={addSticky}><StickyNote size={15} />便签</Button>
      <label><Layers3 size={15} /><Select aria-label="插入画板模板" defaultValue="" onChange={event => { const value = event.target.value; event.target.value = ""; if (value) addElements(templateSkeletons(value)); }}><option value="">插入模板</option><option value="brainstorm">头脑风暴</option><option value="flow">流程梳理</option><option value="retro">团队复盘</option></Select></label>
      <span className="native-whiteboard-toolbar-divider" />
      <Button title="置于顶层" disabled={!selectedIDs.length} onClick={() => applyLayer("front")}><ChevronsUp size={15} /></Button>
      <Button title="上移一层" disabled={!selectedIDs.length} onClick={() => applyLayer("forward")}><ArrowUp size={15} /></Button>
      <Button title="下移一层" disabled={!selectedIDs.length} onClick={() => applyLayer("backward")}><ArrowDown size={15} /></Button>
      <Button title="置于底层" disabled={!selectedIDs.length} onClick={() => applyLayer("back")}><ChevronsDown size={15} /></Button>
    </div>}
    <ExcalidrawCanvas
      snapshot={{ nodes: scene.elements as unknown as readonly ExcalidrawElement[], files: scene.files as unknown as BinaryFiles, appState: scene.appState as Partial<AppState> }}
      readOnly={readOnly}
      onSnapshot={commitScene}
      onPresence={onPresence}
      onSelectionChange={setSelectedIDs}
      onElementHit={selectCommentAnchor}
      onAPI={api => { apiRef.current = api; }}
    />
  </div>;
}
