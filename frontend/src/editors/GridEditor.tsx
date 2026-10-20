import { useMemo } from "react";
import { AllCommunityModule, themeQuartz, type ColDef, type CellValueChangedEvent } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "../components.tsx";
import type { KnowledgeEditorProps } from "./types.ts";

type Field = { id: string; name: string; type: string };
type RecordRow = { id: string; values: Record<string, unknown> };
type GridData = { fields: Field[]; records: RecordRow[] };

function parseGrid(body: string): GridData {
  try {
    const value = JSON.parse(body) as GridData;
    return { fields: Array.isArray(value.fields) ? value.fields : [], records: Array.isArray(value.records) ? value.records : [] };
  } catch {
    return { fields: [], records: [] };
  }
}

const knowledgeGridTheme = themeQuartz.withParams({
  accentColor: "#00856a",
  borderColor: "#d9e4df",
  fontFamily: "inherit",
  headerBackgroundColor: "#f3f8f5",
  rowHoverColor: "#eef8f3",
  selectedRowBackgroundColor: "#e4f5ed",
});

export function GridEditor({ body, readOnly = false, onChange }: KnowledgeEditorProps) {
  const data = useMemo(() => parseGrid(body), [body]);
  const rows = useMemo(() => data.records.map(record => ({ id: record.id, ...record.values })), [data.records]);
  const columns = useMemo<ColDef[]>(() => data.fields.map(field => ({
    field: field.id,
    headerName: field.name,
    editable: !readOnly,
    flex: 1,
    minWidth: 150,
  })), [data.fields, readOnly]);
  const commit = (next: GridData) => onChange(JSON.stringify(next));

  return <div className="knowledge-open-editor is-ag-grid">
    {!readOnly && <div className="native-editor-actions">
      <Button onClick={() => commit({ ...data, records: [...data.records, { id: crypto.randomUUID(), values: {} }] })}><Plus size={15} />添加记录</Button>
      <Button onClick={() => commit({ ...data, fields: [...data.fields, { id: `field_${crypto.randomUUID().slice(0, 8)}`, name: `字段 ${data.fields.length + 1}`, type: "text" }] })}><Plus size={15} />添加字段</Button>
      {data.records.length > 0 && <Button onClick={() => commit({ ...data, records: data.records.slice(0, -1) })}><Trash2 size={15} />删除末行</Button>}
    </div>}
    <div className="native-grid-host">
      <AgGridReact
        modules={[AllCommunityModule]}
        theme={knowledgeGridTheme}
        rowData={rows}
        columnDefs={columns}
        getRowId={params => params.data.id}
        defaultColDef={{ sortable: true, filter: true, resizable: true }}
        onCellValueChanged={(event: CellValueChangedEvent) => {
          const next = data.records.map(record => record.id === event.data.id
            ? { ...record, values: { ...record.values, [event.colDef.field!]: event.newValue } }
            : record);
          commit({ ...data, records: next });
        }}
      />
    </div>
  </div>;
}
