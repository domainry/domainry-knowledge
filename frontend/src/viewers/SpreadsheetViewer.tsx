import { kt, ktf } from "../i18n/runtime.ts";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import type { FilePreviewLocation } from "../types.ts";
import { loadOffice } from "./office-load.ts";
import type { DisplaySheet } from "./office-types.ts";
import { PreviewToolbar, usePreviewFullscreen } from "./PreviewToolbar.tsx";

function columnName(column: number) {
  let name = "";
  for (; column > 0; column = Math.floor((column - 1) / 26)) name = String.fromCharCode(65 + (column - 1) % 26) + name;
  return name;
}

function parseAddress(value?: string) {
  const match = /^([A-Z]{1,3})([1-9][0-9]{0,5})$/.exec((value || "").toUpperCase());
  if (!match) return undefined;
  return {
    column: [...match[1]].reduce((result, character) => result * 26 + character.charCodeAt(0) - 64, 0),
    row: Number(match[2]),
  };
}

export function SpreadsheetViewer({ blob, location }: { blob: Blob; location?: FilePreviewLocation }) {
  const root = useRef<HTMLDivElement>(null);
  const [sheets, setSheets] = useState<DisplaySheet[]>([]);
  const [sheetIndex, setSheetIndex] = useState(0);
  const [selected, setSelected] = useState("");
  const [error, setError] = useState("");
  const [query, setQuery] = useState(""), [matchIndex, setMatchIndex] = useState(0);
  const [nonEmptyOnly, setNonEmptyOnly] = useState(false);
  const [zoom, setZoom] = useState(1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { fullscreen, toggleFullscreen } = usePreviewFullscreen(root);
  const sheet = sheets[sheetIndex];
  const cells = useMemo(() => new Map(sheet?.cells.map(cell => [`${cell.row}:${cell.col}`, cell])), [sheet]);
  const hiddenRows = useMemo(() => new Set(sheet?.hiddenRows || []), [sheet]);
  const hiddenColumns = useMemo(() => new Set(sheet?.hiddenCols || []), [sheet]);
  const nonEmptyRows = useMemo(() => new Set(sheet?.cells.filter(cell => cell.text || cell.formula).map(cell => cell.row) || []), [sheet]);
  const rows = useMemo(() => sheet ? Array.from({ length: sheet.rows }, (_, index) => index + 1).filter(row => !hiddenRows.has(row) && (!nonEmptyOnly || nonEmptyRows.has(row))) : [], [hiddenRows, nonEmptyOnly, nonEmptyRows, sheet]);
  const columns = useMemo(() => sheet ? Array.from({ length: sheet.cols }, (_, index) => index + 1).filter(column => !hiddenColumns.has(column)) : [], [hiddenColumns, sheet]);
  const spans = useMemo(() => {
    const result = new Map<string, { master: string; rowSpan: number; colSpan: number } | null>();
    for (const merge of sheet?.merges || []) {
      const visibleRows = rows.filter(row => row >= merge.top && row <= merge.bottom);
      const visibleColumns = columns.filter(column => column >= merge.left && column <= merge.right);
      for (const row of visibleRows) for (const column of visibleColumns) {
        result.set(`${row}:${column}`, row === visibleRows[0] && column === visibleColumns[0]
          ? { master: `${merge.top}:${merge.left}`, rowSpan: visibleRows.length, colSpan: visibleColumns.length }
          : null);
      }
    }
    return result;
  }, [columns, rows, sheet]);
  const searchMatches = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    if (!sheet || !normalizedQuery) return [];
    const result: string[] = [], seen = new Set<string>();
    for (const cell of sheet.cells) {
      if (hiddenRows.has(cell.row) || hiddenColumns.has(cell.col)) continue;
      if (!`${cell.text}\n${cell.formula || ""}`.toLocaleLowerCase().includes(normalizedQuery)) continue;
      const merge = sheet.merges.find(item => cell.row >= item.top && cell.row <= item.bottom && cell.col >= item.left && cell.col <= item.right);
      const key = merge ? `${merge.top}:${merge.left}` : `${cell.row}:${cell.col}`;
      if (!seen.has(key)) { seen.add(key); result.push(key); }
    }
    return result;
  }, [hiddenColumns, hiddenRows, query, sheet]);
  const searchMatchSet = useMemo(() => new Set(searchMatches), [searchMatches]);

  const locateCell = useCallback((key: string) => {
    setSelected(key);
    requestAnimationFrame(() => scrollRef.current?.querySelector<HTMLElement>(`[data-cell="${key}"]`)?.scrollIntoView({ block: "center", inline: "center" }));
  }, []);

  useEffect(() => {
    const abort = new AbortController();
    void loadOffice(blob, "xlsx", abort.signal).then(result => {
      if (abort.signal.aborted) return;
      const next = result.sheets || [];
      setSheets(next);
      const requested = next.findIndex(item => item.name === location?.sheet);
      setSheetIndex(requested >= 0 ? requested : 0);
      setSelected("");
      setQuery("");
      setMatchIndex(0);
      setZoom(1);
      setError("");
    }).catch(failure => {
      if (!abort.signal.aborted) setError(failure instanceof Error ? failure.message : kt("knowledge.auto.95a8bd308bcb4562"));
    });
    return () => abort.abort();
  }, [blob, location?.sheet]);

  useEffect(() => {
    if (!sheet || (location?.sheet && sheet.name !== location.sheet)) return;
    const address = parseAddress(location?.cell);
    const row = address?.row || location?.row;
    const column = address?.column || 1;
    if (!row || row > sheet.rows || column > sheet.cols) return;
    const merge = sheet.merges.find(item => row >= item.top && row <= item.bottom && column >= item.left && column <= item.right);
    const target = merge ? `${merge.top}:${merge.left}` : `${row}:${column}`;
    locateCell(target);
  }, [locateCell, location?.cell, location?.row, location?.sheet, sheet]);

  useEffect(() => {
    setMatchIndex(0);
    if (searchMatches[0]) locateCell(searchMatches[0]);
  }, [locateCell, searchMatches]);

  const moveToMatch = (offset: number) => {
    if (searchMatches.length === 0) return;
    const nextIndex = (matchIndex + offset + searchMatches.length) % searchMatches.length;
    setMatchIndex(nextIndex);
    locateCell(searchMatches[nextIndex]);
  };

  return <div ref={root} className="knowledge-file-viewer knowledge-spreadsheet-viewer" data-static-ui-list>
    {error && <p role="alert" className="knowledge-error">{error}</p>}
    {!sheet && !error && <p role="status">{kt("knowledge.auto.8a3d46c1ed6a9c3a")}</p>}
    {sheet && <>
      <PreviewToolbar
        fullscreen={fullscreen}
        label={ktf("knowledge.auto.c26834877dfd9070", { value0: sheet.name })}
        maxZoom={2}
        minZoom={.5}
        onFullscreen={() => void toggleFullscreen()}
        onReset={() => setZoom(1)}
        onZoomChange={setZoom}
        status={<span>{sheet.rows} × {sheet.cols}{query.trim() ? ` · ${searchMatches.length ? matchIndex + 1 : 0} / ${searchMatches.length}` : ""}</span>}
        zoom={zoom}
        zoomStep={.1}
      >
        <form className="knowledge-sheet-search" role="search" onSubmit={event => { event.preventDefault(); moveToMatch(searchMatches.length > 1 ? 1 : 0); }}>
          <Search size={14} aria-hidden="true" />
          <input aria-label={kt("knowledge.auto.44ce7ae909bbb28b")} placeholder={kt("knowledge.auto.44ce7ae909bbb28b")} value={query} onChange={event => setQuery(event.target.value)} />
          <button type="button" aria-label={kt("knowledge.auto.c9b9ae7a61444ab7")} title={kt("knowledge.auto.c9b9ae7a61444ab7")} disabled={searchMatches.length === 0} onClick={() => moveToMatch(-1)}><ChevronUp size={15} /></button>
          <button type="submit" aria-label={kt("knowledge.auto.8a8542f6964852dc")} title={kt("knowledge.auto.8a8542f6964852dc")} disabled={searchMatches.length === 0}><ChevronDown size={15} /></button>
        </form>
        <label className="knowledge-sheet-nonempty-filter" title="只显示包含内容的行"><input type="checkbox" checked={nonEmptyOnly} onChange={event => setNonEmptyOnly(event.target.checked)} /><span>只看非空行</span></label>
      </PreviewToolbar>
      <div ref={scrollRef} className="knowledge-sheet-scroll">
        <table className="knowledge-sheet-zoom" aria-label={ktf("knowledge.auto.c26834877dfd9070", { value0: sheet.name })} style={{ "--knowledge-sheet-zoom": zoom } as CSSProperties}>
          <colgroup><col className="knowledge-sheet-row-number-column" />{columns.map(column => <col key={column} style={{ width: sheet.widths[column] || 103 }} />)}</colgroup>
          <thead><tr><th aria-hidden="true" />{columns.map(column => <th key={column} scope="col">{columnName(column)}</th>)}</tr></thead>
          <tbody>{rows.map(row => <tr key={row} style={{ height: sheet.heights[row] }}>
            <th scope="row">{row}</th>
            {columns.map(column => {
              const key = `${row}:${column}`, span = spans.get(key);
              if (span === null) return null;
              const master = span?.master || key, cell = cells.get(master);
              return <td
                key={column}
                data-cell={master}
                data-match={searchMatchSet.has(master) || undefined}
                data-active-match={searchMatchSet.has(master) && selected === master || undefined}
                data-selected={selected === master}
                rowSpan={span?.rowSpan}
                colSpan={span?.colSpan}
                style={cell?.style}
                title={cell?.text || undefined}
                onClick={() => setSelected(master)}
              >{cell?.text || ""}</td>;
            })}
          </tr>)}</tbody>
        </table>
      </div>
      <nav className="knowledge-sheet-tabs" aria-label={kt("knowledge.auto.b02781ee06c6587e")}>
        {sheets.map((item, index) => <button
          key={`${item.name}:${index}`}
          type="button"
          aria-current={index === sheetIndex ? "page" : undefined}
          onClick={() => { setSheetIndex(index); setSelected(""); setQuery(""); setMatchIndex(0); scrollRef.current?.scrollTo({ top: 0, left: 0 }); }}
        >{item.name}</button>)}
      </nav>
    </>}
  </div>;
}
