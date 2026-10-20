import { useEffect, useRef } from "react";
import { createUniver, getSheetsEmptySnapshot, LocaleType, type IWorkbookData } from "@univerjs/presets";
import { UniverSheetsCorePreset } from "@univerjs/preset-sheets-core";
import zhCN from "@univerjs/preset-sheets-core/locales/zh-CN";
import "@univerjs/preset-sheets-core/lib/index.css";
import type { KnowledgeEditorProps } from "./types.ts";

function workbookData(body: string): IWorkbookData {
  try {
    const value = JSON.parse(body) as IWorkbookData;
    if (value && Array.isArray(value.sheetOrder) && value.sheets) return value;
  } catch { /* start with an empty native workbook */ }
  return getSheetsEmptySnapshot("workbook-1", LocaleType.ZH_CN, "工作表");
}

export function SpreadsheetEditor({ body, readOnly = false, onChange }: KnowledgeEditorProps) {
  const host = useRef<HTMLDivElement>(null);
  const initialBody = useRef(body);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    if (!host.current) return;
    const hostElement = host.current;
    const container = document.createElement("div");
    container.className = "native-spreadsheet-instance";
    hostElement.replaceChildren(container);
    const { univer, univerAPI } = createUniver({
      locale: LocaleType.ZH_CN,
      locales: { [LocaleType.ZH_CN]: zhCN },
      presets: [UniverSheetsCorePreset({ container, toolbar: !readOnly, formulaBar: true, footer: readOnly ? false : {} })],
    });
    const workbook = univerAPI.createWorkbook(workbookData(initialBody.current));
    if (workbook.getSheets().length === 0) workbook.insertSheet("工作表 1");
    workbook.setEditable(!readOnly);
    let ready = false;
    const listener = workbook.onCommandExecuted(() => {
      if (ready && !readOnly) onChangeRef.current(JSON.stringify(workbook.save()));
    });
    queueMicrotask(() => { ready = true; });
    return () => {
      listener.dispose();
      container.remove();
      window.setTimeout(() => univer.dispose(), 0);
    };
  }, [readOnly]);

  return <div className="knowledge-open-editor is-univer"><div ref={host} className="native-spreadsheet-host" /></div>;
}
