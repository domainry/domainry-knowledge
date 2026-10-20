import { useMemo, useState } from "react";
import { Button } from "../components.tsx";
import type { PreviewText } from "../file-preview.ts";

const rowsPerPage = 50;
const maxRenderCharacters = 200_000;
const maxRows = 2_000;
const maxColumns = 100;

function parseDelimited(text: string, separator: string) {
  const rows: string[][] = [];
  let row: string[] = [], field = "", quoted = false, limited = false;
  for (let index = 0; index < text.length; index++) {
    const character = text[index];
    if (quoted) {
      if (character === '"' && text[index + 1] === '"') { field += '"'; index++; }
      else if (character === '"') quoted = false;
      else field += character;
      continue;
    }
    if (character === '"' && field === "") { quoted = true; continue; }
    if (character === separator) { if (row.length < maxColumns) row.push(field); else limited = true; field = ""; continue; }
    if (character === "\n") {
      if (row.length < maxColumns) row.push(field.replace(/\r$/, "")); else limited = true;
      rows.push(row); row = []; field = "";
      if (rows.length >= maxRows) { limited = true; break; }
      continue;
    }
    field += character;
  }
  if ((field || row.length) && rows.length < maxRows) { if (row.length < maxColumns) row.push(field.replace(/\r$/, "")); rows.push(row); }
  return { rows, limited };
}

export function TextViewer({ file }: { file: PreviewText }) {
  const [page, setPage] = useState(0);
  const table = useMemo(() => file.format === "csv" || file.format === "tsv" ? parseDelimited(file.text, file.format === "tsv" ? "\t" : ",") : null, [file]);
  const display = useMemo(() => {
    if (file.format !== "json" || file.truncated) return file.text.slice(0, maxRenderCharacters);
    try { return JSON.stringify(JSON.parse(file.text), null, 2).slice(0, maxRenderCharacters); }
    catch { return file.text.slice(0, maxRenderCharacters); }
  }, [file]);
  const limited = file.truncated || file.text.length > maxRenderCharacters || !!table?.limited;
  if (table) {
    const start = page * rowsPerPage, rows = table.rows.slice(start, start + rowsPerPage);
    const columns = Math.max(0, ...rows.map(row => row.length));
    return <div className="knowledge-file-viewer"><p className="knowledge-subtle">表格文本只读预览{limited ? " · 已限制展示量" : ""}</p><div className="knowledge-sheet-scroll"><table><thead><tr><th>行</th>{Array.from({ length: columns }, (_, index) => <th key={index}>{index + 1}</th>)}</tr></thead><tbody>{rows.map((row, rowIndex) => <tr key={start + rowIndex}><th>{start + rowIndex + 1}</th>{Array.from({ length: columns }, (_, column) => <td key={column}>{row[column] || ""}</td>)}</tr>)}</tbody></table></div><nav className="knowledge-file-toolbar"><Button disabled={page === 0} onClick={() => setPage(value => value - 1)}>上一页</Button><span>{table.rows.length ? `${start + 1}–${Math.min(start + rowsPerPage, table.rows.length)} / ${table.rows.length}` : "无数据"}</span><Button disabled={start + rowsPerPage >= table.rows.length} onClick={() => setPage(value => value + 1)}>下一页</Button></nav></div>;
  }
  return <div className="knowledge-file-viewer"><p className="knowledge-subtle">{file.format === "md" ? "Markdown 源文" : file.format === "json" ? "JSON" : "文本"}只读预览{limited ? " · 仅展示开头" : ""}</p><pre className="knowledge-text-preview">{display}</pre></div>;
}
