import { useEffect, useRef } from "react";
import MindElixir, { type MindElixirData } from "mind-elixir";
import { zh_CN } from "mind-elixir/i18n";
import "mind-elixir/style.css";
import type { KnowledgeEditorProps } from "./types.ts";

function parseMindMap(body: string): MindElixirData {
  try {
    const value = JSON.parse(body) as { root?: MindElixirData };
    if (value.root?.nodeData) return value.root;
  } catch { /* use a native blank map */ }
  return MindElixir.new("中心主题");
}

export function MindMapEditor({ body, readOnly = false, onChange }: KnowledgeEditorProps) {
  const host = useRef<HTMLDivElement>(null);
  const initialBody = useRef(body);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    if (!host.current) return;
    const mind = new MindElixir({
      el: host.current,
      direction: MindElixir.SIDE,
      editable: !readOnly,
      contextMenu: readOnly ? false : { locale: zh_CN, focus: true, link: true },
      toolBar: !readOnly,
      keypress: !readOnly,
      overflowHidden: true,
      compact: true,
      theme: {
        ...MindElixir.THEME,
        name: "Knowledge",
        palette: ["#00856a", "#2b8f75", "#5aa58f", "#83bbaa", "#a8d0c3", "#d4e7df"],
        cssVar: {
          ...MindElixir.THEME.cssVar,
          "--accent-color": "#00856a",
          "--root-bgcolor": "#00856a",
          "--root-color": "#ffffff",
          "--selected": "#d7eee5",
          "--panel-bgcolor": "#ffffff",
          "--panel-border-color": "#d9e4df",
        },
      },
    });
    mind.init(parseMindMap(initialBody.current));
    const sync = () => { if (!readOnly) onChangeRef.current(JSON.stringify({ root: mind.getData() })); };
    mind.bus.addListener("operation", sync);
    return () => mind.destroy();
  }, [readOnly]);

  return <div className="knowledge-open-editor is-mind-elixir"><div ref={host} className="native-mindmap-host" /></div>;
}
