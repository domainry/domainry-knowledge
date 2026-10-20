import { useEffect, useMemo, useState } from "react";
import { Button } from "../components.tsx";
import type { FilePreviewLocation } from "../types.ts";
import { loadOffice } from "./office-load.ts";
import type { DisplaySheet } from "./office-types.ts";

const rowsPerPage = 50;
const columnsPerPage = 16;

function columnName(column: number) {
  let name = "";
  for (; column > 0; column = Math.floor((column - 1) / 26)) name = String.fromCharCode(65 + (column - 1) % 26) + name;
  return name;
}

export function SpreadsheetViewer({ blob, location }: { blob: Blob; location?: FilePreviewLocation }) {
  const [sheets, setSheets] = useState<DisplaySheet[]>([]);
  const [sheetIndex, setSheetIndex] = useState(0), [rowPage, setRowPage] = useState(0), [columnPage, setColumnPage] = useState(0);
  const [address, setAddress] = useState(location?.cell || ""), [selected, setSelected] = useState(""), [error, setError] = useState("");
  const sheet = sheets[sheetIndex];
  const cells = useMemo(() => new Map(sheet?.cells.map(cell => [`${cell.row}:${cell.col}`, cell])), [sheet]);

  function jump(value: string) {
    const match = /^([A-Z]{1,3})([1-9][0-9]{0,5})$/.exec(value.toUpperCase());
    if (!match || !sheet) { setError("请输入有效单元格，例如 B12。"); return; }
    const column = [...match[1]].reduce((result, character) => result * 26 + character.charCodeAt(0) - 64, 0), row = Number(match[2]);
    if (row > sheet.rows || column > sheet.cols) { setError("该位置超出当前工作表范围。"); return; }
    setError(""); setRowPage(Math.floor((row - 1) / rowsPerPage)); setColumnPage(Math.floor((column - 1) / columnsPerPage)); setSelected(`${row}:${column}`);
  }

  useEffect(() => {
    const abort = new AbortController();
    void loadOffice(blob, "xlsx", abort.signal).then(result => {
      if (abort.signal.aborted) return;
      const next = result.sheets || [];
      setSheets(next);
      const requested = next.findIndex(item => item.name === location?.sheet);
      if (requested >= 0) setSheetIndex(requested);
    }).catch(failure => { if (!abort.signal.aborted) setError(failure instanceof Error ? failure.message : "Excel 文件无法预览。"); });
    return () => abort.abort();
  }, [blob, location?.sheet]);

  useEffect(() => {
    if (!sheet || sheet.name !== location?.sheet) return;
    if (location.cell) jump(location.cell);
    else if (location.row && location.row <= sheet.rows) setRowPage(Math.floor((location.row - 1) / rowsPerPage));
  }, [sheet, location?.cell, location?.row, location?.sheet]);

  const rows = sheet ? Array.from({ length: Math.min(rowsPerPage, Math.max(0, sheet.rows - rowPage * rowsPerPage)) }, (_, index) => rowPage * rowsPerPage + index + 1).filter(row => !sheet.hiddenRows.includes(row)) : [];
  const columns = sheet ? Array.from({ length: Math.min(columnsPerPage, Math.max(0, sheet.cols - columnPage * columnsPerPage)) }, (_, index) => columnPage * columnsPerPage + index + 1).filter(column => !sheet.hiddenCols.includes(column)) : [];
  const spans = new Map<string, { master: string; rowSpan: number; colSpan: number } | null>();
  for (const merge of sheet?.merges || []) {
    const visibleRows = rows.filter(row => row >= merge.top && row <= merge.bottom), visibleColumns = columns.filter(column => column >= merge.left && column <= merge.right);
    for (const row of visibleRows) for (const column of visibleColumns) spans.set(`${row}:${column}`, row === visibleRows[0] && column === visibleColumns[0] ? { master: `${merge.top}:${merge.left}`, rowSpan: visibleRows.length, colSpan: visibleColumns.length } : null);
  }
  const current = cells.get(selected);

  return <div className="knowledge-file-viewer" data-static-ui-list>
    {error && <p role="alert" className="knowledge-error">{error}</p>}
    {!sheet && !error && <p role="status">正在打开工作簿…</p>}
    {sheet && <>
      <div className="knowledge-file-toolbar"><label>工作表 <select aria-label="工作表" value={sheetIndex} onChange={event => { setSheetIndex(Number(event.target.value)); setRowPage(0); setColumnPage(0); setSelected(""); setError(""); }}>{sheets.map((item, index) => <option value={index} key={index}>{item.name}</option>)}</select></label><form onSubmit={event => { event.preventDefault(); jump(address); }}><label>定位单元格 <input value={address} onChange={event => setAddress(event.target.value)} placeholder="B12" maxLength={10} /></label><Button type="submit">定位</Button></form></div>
      <p className="knowledge-subtle">{sheet.rows} 行 × {sheet.cols} 列 · 只读预览，公式显示文件保存的结果；图表与嵌入对象请下载查看。</p>
      {current && <p className="knowledge-spreadsheet-value"><strong>{columnName(current.col)}{current.row}</strong> {current.formula ? `=${current.formula} → ` : ""}{current.text}</p>}
      <div className="knowledge-sheet-scroll"><table aria-label={`${sheet.name} 工作表`}><colgroup><col style={{ width: 50 }} />{columns.map(column => <col key={column} style={{ width: sheet.widths[column] || 110 }} />)}</colgroup><thead><tr><th scope="col">行</th>{columns.map(column => <th key={column} scope="col">{columnName(column)}</th>)}</tr></thead><tbody>{rows.map(row => <tr key={row} style={{ height: sheet.heights[row] }}><th scope="row">{row}</th>{columns.map(column => { const key = `${row}:${column}`, span = spans.get(key); if (span === null) return null; const cell = cells.get(span?.master || key); return <td key={column} rowSpan={span?.rowSpan} colSpan={span?.colSpan} style={cell?.style} data-selected={selected === (span?.master || key)} onClick={() => { setSelected(span?.master || key); setAddress(`${columnName(cell?.col || column)}${cell?.row || row}`); }}>{cell?.text || ""}</td>; })}</tr>)}</tbody></table></div>
      <nav className="knowledge-file-toolbar" aria-label="工作表行分页" data-static-ui-pagination><Button disabled={rowPage === 0} onClick={() => setRowPage(value => value - 1)}>上一页行</Button><span>第 {rowPage + 1} / {Math.max(1, Math.ceil(sheet.rows / rowsPerPage))} 页</span><Button disabled={(rowPage + 1) * rowsPerPage >= sheet.rows} onClick={() => setRowPage(value => value + 1)}>下一页行</Button><Button disabled={columnPage === 0} onClick={() => setColumnPage(value => value - 1)}>前一组列</Button><span>{columnName(columnPage * columnsPerPage + 1)}–{columnName(Math.max(1, Math.min(sheet.cols, (columnPage + 1) * columnsPerPage)))}</span><Button disabled={(columnPage + 1) * columnsPerPage >= sheet.cols} onClick={() => setColumnPage(value => value + 1)}>后一组列</Button></nav>
    </>}
  </div>;
}
