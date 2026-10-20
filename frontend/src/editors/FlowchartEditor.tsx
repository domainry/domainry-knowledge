import { useEffect, useRef } from "react";
import LogicFlow from "@logicflow/core";
import "@logicflow/core/dist/index.css";
import { Circle, Diamond, Plus, Square } from "lucide-react";
import { Button } from "../components.tsx";
import type { KnowledgeEditorProps } from "./types.ts";

type FlowData = { nodes: any[]; edges: any[] };

function parseFlow(body: string): FlowData {
  try {
    const value = JSON.parse(body) as FlowData;
    if (Array.isArray(value.nodes) && Array.isArray(value.edges)) return value;
  } catch { /* use a blank graph */ }
  return { nodes: [], edges: [] };
}

export function FlowchartEditor({ body, readOnly = false, onChange }: KnowledgeEditorProps) {
  const host = useRef<HTMLDivElement>(null);
  const logic = useRef<LogicFlow | null>(null);
  const initialBody = useRef(body);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    if (!host.current) return;
    const lf = new LogicFlow({ container: host.current, grid: true, keyboard: { enabled: !readOnly }, isSilentMode: readOnly });
    lf.setTheme({ rect: { stroke: "#739187", radius: 10 }, ellipse: { stroke: "#00856a" }, diamond: { stroke: "#b7791f" }, polyline: { stroke: "#789087" } });
    lf.render(parseFlow(initialBody.current));
    logic.current = lf;
    const events = "node:add,node:delete,node:drop,edge:add,edge:delete,edge:adjust,text:update";
    const sync = () => { if (!readOnly) onChangeRef.current(JSON.stringify(lf.getGraphRawData())); };
    lf.on(events, sync);
    return () => {
      lf.off(events, sync);
      logic.current = null;
      if (host.current) host.current.replaceChildren();
    };
  }, [readOnly]);

  const add = (type: "rect" | "ellipse" | "diamond", text: string) => {
    const lf = logic.current;
    if (!lf) return;
    lf.addNode({ type, x: 220 + Math.random() * 220, y: 130 + Math.random() * 220, text });
  };

  return <div className="knowledge-open-editor is-logicflow">
    {!readOnly && <div className="native-editor-actions">
      <Button onClick={() => add("ellipse", "开始/结束")}><Circle size={15} />起止</Button>
      <Button onClick={() => add("rect", "处理步骤")}><Square size={15} />步骤</Button>
      <Button onClick={() => add("diamond", "判断条件")}><Diamond size={15} />判断</Button>
      <span><Plus size={14} />拖动节点锚点即可连线</span>
    </div>}
    <div ref={host} className="native-flowchart-host" />
  </div>;
}
