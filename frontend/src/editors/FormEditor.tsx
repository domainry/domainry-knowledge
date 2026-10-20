import { useEffect, useRef } from "react";
import { Formio } from "@formio/js";
import bootstrapCSS from "bootstrap/dist/css/bootstrap.min.css?inline";
import formioCSS from "@formio/js/dist/formio.full.min.css?inline";
import type { KnowledgeEditorProps } from "./types.ts";

type FormSchema = { display?: string; components: unknown[] };

function parseForm(body: string): FormSchema {
  try {
    const value = JSON.parse(body) as FormSchema;
    if (Array.isArray(value.components)) return value;
  } catch { /* use an empty native form */ }
  return { display: "form", components: [] };
}

export function FormEditor({ body, readOnly = false, onChange }: KnowledgeEditorProps) {
  const host = useRef<HTMLDivElement>(null);
  const initialBody = useRef(body);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    if (!host.current) return;
    const shadow = host.current.shadowRoot || host.current.attachShadow({ mode: "open" });
    shadow.replaceChildren();
    const style = document.createElement("style");
    style.textContent = `${bootstrapCSS}\n${formioCSS}\n
      :host{container-type:inline-size;display:block;color:#1e2c25;font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC",sans-serif}
      .formbuilder{min-height:620px}
      .btn-primary{--bs-btn-bg:#00856a;--bs-btn-border-color:#00856a;--bs-btn-hover-bg:#006f59;--bs-btn-hover-border-color:#006f59}
      @container (max-width:720px){
        .formbuilder{display:block!important;margin:0!important}
        .formbuilder>.formcomponents,.formbuilder>.formarea{width:100%!important;max-width:none!important;flex:none!important}
        .builder-sidebar_scroll{max-height:300px!important;margin-bottom:18px;overflow:auto}
        .builder-sidebar [ref="sidebar-container"]{grid-template-columns:repeat(2,minmax(0,1fr))}
      }`;
    const mount = document.createElement("div");
    shadow.append(style, mount);
    let active = true;
    let instance: any;
    const schema = parseForm(initialBody.current);
    const promise = readOnly
      ? Formio.createForm(mount, schema, { readOnly: true })
      : Formio.builder(mount, schema, { noDefaultSubmitButton: true });
    void promise.then((created: any) => {
      if (!active) { created.destroy?.(true); return; }
      instance = created;
      if (!readOnly) created.on("change", () => onChangeRef.current(JSON.stringify(created.schema)));
    });
    return () => {
      active = false;
      instance?.destroy?.(true);
      shadow.replaceChildren();
    };
  }, [readOnly]);

  return <div className="knowledge-open-editor is-formio"><div ref={host} className="native-form-host" /></div>;
}
