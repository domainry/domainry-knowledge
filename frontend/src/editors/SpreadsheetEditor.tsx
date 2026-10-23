import { useEffect, useMemo, useRef, useState } from "react";
import { BarChart3, Download, LockKeyhole, Plus, TableProperties, Trash2, Upload } from "lucide-react";
import { createUniver, ICommandService, LocaleType, mergeLocales, type IWorkbookData } from "@univerjs/presets";
import { UniverSheetsCorePreset } from "@univerjs/preset-sheets-core";
import coreZhCN from "@univerjs/preset-sheets-core/locales/zh-CN";
import { UniverSheetsConditionalFormattingPreset } from "@univerjs/preset-sheets-conditional-formatting";
import conditionalFormattingZhCN from "@univerjs/preset-sheets-conditional-formatting/locales/zh-CN";
import { UniverSheetsDataValidationPreset } from "@univerjs/preset-sheets-data-validation";
import dataValidationZhCN from "@univerjs/preset-sheets-data-validation/locales/zh-CN";
import "@univerjs/preset-sheets-core/lib/index.css";
import "@univerjs/preset-sheets-conditional-formatting/lib/index.css";
import "@univerjs/preset-sheets-data-validation/lib/index.css";
import { Button, Select } from "../components.tsx";
import { stableNativeJSON } from "../nativeOperations.ts";
import { PageActionPortal } from "./PageActionPortal.tsx";
import {
  emptyKnowledgeSpreadsheet,
  exportKnowledgeSpreadsheetXLSX,
  formatSpreadsheetRange,
  importKnowledgeSpreadsheetXLSX,
  parseKnowledgeSpreadsheet,
  parseSpreadsheetRange,
  sanitizeSpreadsheetWorkbook,
  spreadsheetChartData,
  spreadsheetID,
  spreadsheetPivotData,
  type KnowledgeSpreadsheetContent,
  type SpreadsheetChart,
  type SpreadsheetPivot,
} from "../spreadsheetContent.ts";
import type { KnowledgeEditorProps } from "./types.ts";

type AnalysisPanel = "charts" | "pivots" | "protection" | null;

function initialContent(body: string) {
  try { return parseKnowledgeSpreadsheet(body); }
  catch { return emptyKnowledgeSpreadsheet(); }
}

function sameSpreadsheetContent(left: KnowledgeSpreadsheetContent, right: KnowledgeSpreadsheetContent) {
  return stableNativeJSON(left) === stableNativeJSON(right);
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url; anchor.download = filename; anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

function ChartPreview({ content, chart }: { content: KnowledgeSpreadsheetContent; chart: SpreadsheetChart }) {
  const data = spreadsheetChartData(content, chart).slice(0, 24);
  const maximum = Math.max(1, ...data.map(item => Math.abs(item.value)));
  if (data.length === 0) return <p className="knowledge-subtle">该区域没有可绘制的数值。</p>;
  if (chart.type === "pie" || chart.type === "donut") {
    const total = data.reduce((sum, item) => sum + Math.max(0, item.value), 0) || 1;
    let angle = 0;
    const colors = ["#0b8f72", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#14b8a6"];
    const stops = data.map((item, index) => { const start = angle; angle += Math.max(0, item.value) / total * 360; return `${colors[index % colors.length]} ${start}deg ${angle}deg`; });
    return <div className={`native-sheet-pie${chart.type === "pie" ? " is-solid" : ""}`}><span style={{ background: `conic-gradient(${stops.join(",")})` }} /><ol>{data.map((item, index) => <li key={`${item.label}-${index}`}><i style={{ background: colors[index % colors.length] }} />{item.label}<b>{item.value}</b></li>)}</ol></div>;
  }
  const width = 560, height = 220;
  if (chart.type === "bar") {
    const gap = height / data.length;
    return <svg className="native-sheet-chart is-horizontal" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={chart.name}>{data.map((item, index) => <g key={`${item.label}-${index}`}><text x="0" y={index * gap + gap * .65}>{item.label.slice(0, 10)}</text><rect x="82" y={index * gap + 3} width={Math.max(1, Math.max(0, item.value) / maximum * (width - 110))} height={Math.max(4, gap - 6)} rx="4" /><text x={Math.min(width - 24, 88 + Math.max(0, item.value) / maximum * (width - 110))} y={index * gap + gap * .65}>{item.value}</text></g>)}</svg>;
  }
  if (chart.type === "funnel") {
    const rowHeight = height / data.length;
    const widths = data.map(item => Math.max(28, Math.max(0, item.value) / maximum * (width - 180)));
    return <svg className="native-sheet-chart is-funnel" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={chart.name}>{data.map((item, index) => { const current = widths[index], next = widths[index + 1] ?? Math.max(18, current * .72), top = index * rowHeight + 2; return <g key={`${item.label}-${index}`}><polygon points={`${(width - current) / 2},${top} ${(width + current) / 2},${top} ${(width + next) / 2},${top + rowHeight - 3} ${(width - next) / 2},${top + rowHeight - 3}`} /><text x={width / 2} y={top + rowHeight * .58} textAnchor="middle">{item.label.slice(0, 10)} · {item.value}</text></g>; })}</svg>;
  }
  if (chart.type === "radar") {
    const centerX = width / 2, centerY = height / 2, radius = Math.min(width, height) * .38;
    const point = (index: number, scale: number) => { const angle = -Math.PI / 2 + Math.PI * 2 * index / data.length; return { x: centerX + Math.cos(angle) * radius * scale, y: centerY + Math.sin(angle) * radius * scale }; };
    const polygon = data.map((item, index) => { const value = point(index, Math.abs(item.value) / maximum); return `${value.x},${value.y}`; }).join(" ");
    return <svg className="native-sheet-chart is-radar" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={chart.name}>{[.25, .5, .75, 1].map(scale => <polygon key={scale} className="native-sheet-radar-grid" points={data.map((_, index) => { const value = point(index, scale); return `${value.x},${value.y}`; }).join(" ")} />)}{data.map((item, index) => { const end = point(index, 1), label = point(index, 1.12); return <g key={`${item.label}-${index}`}><line x1={centerX} y1={centerY} x2={end.x} y2={end.y} /><text x={label.x} y={label.y} textAnchor="middle">{item.label.slice(0, 8)}</text></g>; })}<polygon className="native-sheet-radar-value" points={polygon} /></svg>;
  }
  if (chart.type === "waterfall") {
    const totals: number[] = [0]; data.forEach(item => totals.push(totals[totals.length - 1] + item.value));
    const minimumTotal = Math.min(0, ...totals), maximumTotal = Math.max(1, ...totals), span = maximumTotal - minimumTotal || 1;
    const y = (value: number) => height - 24 - (value - minimumTotal) / span * (height - 40), gap = width / data.length;
    return <svg className="native-sheet-chart is-waterfall" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={chart.name}><line className="native-sheet-waterfall-zero" x1="0" y1={y(0)} x2={width} y2={y(0)} />{data.map((item, index) => { const before = totals[index], after = totals[index + 1], top = Math.min(y(before), y(after)), barHeight = Math.max(2, Math.abs(y(before) - y(after))); return <g key={`${item.label}-${index}`} className={item.value >= 0 ? "is-positive" : "is-negative"}><rect x={index * gap + 6} y={top} width={Math.max(5, gap - 12)} height={barHeight} rx="3" /><line x1={index * gap + gap - 6} y1={y(after)} x2={(index + 1) * gap + 6} y2={y(after)} /><text x={index * gap + gap / 2} y={height - 7} textAnchor="middle">{item.label.slice(0, 8)}</text></g>; })}</svg>;
  }
  const gap = width / Math.max(1, data.length);
  const pointValues = data.map((item, index) => ({ x: index * gap + gap / 2, y: height - Math.max(0, item.value) / maximum * (height - 30) }));
  const points = pointValues.map(point => `${point.x},${point.y}`).join(" ");
  const areaPath = pointValues.length ? `M ${pointValues[0].x} ${height - 20} L ${points.replaceAll(",", " ")} L ${pointValues[pointValues.length - 1].x} ${height - 20} Z` : "";
  return <svg className="native-sheet-chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={chart.name}>
    {chart.type === "area" && <path className="native-sheet-area" d={areaPath} />}
    {(chart.type === "line" || chart.type === "area") && <polyline points={points} fill="none" stroke="currentColor" strokeWidth="4" />}
    {(chart.type === "line" || chart.type === "area" || chart.type === "scatter") && pointValues.map((point, index) => <circle key={index} cx={point.x} cy={point.y} r={chart.type === "scatter" ? 6 : 4} />)}
    {chart.type === "column" && data.map((item, index) => <rect key={index} x={index * gap + 4} y={height - Math.max(0, item.value) / maximum * (height - 30)} width={Math.max(4, gap - 8)} height={Math.max(1, Math.max(0, item.value) / maximum * (height - 30))} rx="4" />)}
    {data.map((item, index) => <text key={`label-${index}`} x={index * gap + gap / 2} y={height - 6} textAnchor="middle">{item.label.slice(0, 8)}</text>)}
  </svg>;
}

function PivotPreview({ content, pivot }: { content: KnowledgeSpreadsheetContent; pivot: SpreadsheetPivot }) {
  const rows = spreadsheetPivotData(content, pivot);
  const aggregateLabel = { sum: "合计", count: "计数", average: "平均值", min: "最小值", max: "最大值" }[pivot.aggregate];
  return rows.length === 0 ? <p className="knowledge-subtle">该区域没有可汇总的数据。</p> : <table className="native-sheet-pivot"><thead><tr><th>分组</th><th>{aggregateLabel}</th></tr></thead><tbody>{rows.map(row => <tr key={row.label}><td>{row.label}</td><td>{Number(row.value.toFixed(4))}</td></tr>)}</tbody></table>;
}

export function SpreadsheetEditor({ body, readOnly = false, canManage = false, documentTitle = "电子表格", initialSearchLocation, pageActionHost, authorizeContentAction, onActionFeedback, onChange }: KnowledgeEditorProps) {
  const host = useRef<HTMLDivElement>(null);
  const importRef = useRef<HTMLInputElement>(null);
  const onChangeRef = useRef(onChange);
  const [content, setContent] = useState(() => initialContent(body));
  const contentRef = useRef(content);
  const bodyRef = useRef(body);
  const workbookRef = useRef<{ save(): IWorkbookData } | null>(null);
  const [instanceRevision, setInstanceRevision] = useState(0);
  const [panel, setPanel] = useState<AnalysisPanel>(null);
  const [name, setName] = useState("");
  const [rangeText, setRangeText] = useState("A1:B10");
  const [sheetID, setSheetID] = useState(content.workbook.sheetOrder[0] || "");
  const [chartType, setChartType] = useState<SpreadsheetChart["type"]>("column");
  const [aggregate, setAggregate] = useState<SpreadsheetPivot["aggregate"]>("sum");
  onChangeRef.current = onChange;

  const commit = (next: KnowledgeSpreadsheetContent, workbook = workbookRef.current?.save()) => {
    const value = { ...next, workbook: sanitizeSpreadsheetWorkbook(workbook || next.workbook) };
    if (sameSpreadsheetContent(value, contentRef.current)) return;
    const serialized = JSON.stringify(value);
    contentRef.current = value; bodyRef.current = serialized; setContent(value); onChangeRef.current(serialized);
  };

  useEffect(() => {
    if (body === bodyRef.current) return;
    const value = initialContent(body);
    if (sameSpreadsheetContent(value, contentRef.current)) {
      bodyRef.current = body;
      return;
    }
    bodyRef.current = body; contentRef.current = value; setContent(value); setSheetID(value.workbook.sheetOrder[0] || ""); setInstanceRevision(current => current + 1);
  }, [body]);

  useEffect(() => {
    if (!host.current) return;
    const hostElement = host.current;
    const container = document.createElement("div");
    container.className = "native-spreadsheet-instance";
    hostElement.replaceChildren(container);
    const { univer, univerAPI } = createUniver({
      locale: LocaleType.ZH_CN,
      locales: { [LocaleType.ZH_CN]: mergeLocales(coreZhCN, conditionalFormattingZhCN, dataValidationZhCN) },
      presets: [
        UniverSheetsCorePreset({ container, toolbar: !readOnly, formulaBar: true, footer: readOnly ? false : {} }),
        UniverSheetsDataValidationPreset(),
        UniverSheetsConditionalFormattingPreset(),
      ],
    });
    const workbook = univerAPI.createWorkbook(structuredClone(contentRef.current.workbook));
    workbookRef.current = workbook;
    if (workbook.getSheets().length === 0) workbook.insertSheet("工作表 1");
    workbook.setEditable(!readOnly);
    let ready = false;
    let commitTimer: number | undefined;
    const scheduleCommit = () => {
      if (!ready || readOnly) return;
      if (commitTimer !== undefined) window.clearTimeout(commitTimer);
      commitTimer = window.setTimeout(() => {
        commitTimer = undefined;
        commit(contentRef.current, workbook.save());
      }, 40);
    };
    const mutationListener = univer.__getInjector().get(ICommandService).onMutationExecutedForCollab(scheduleCommit);
    const scheduleCommitFromUI = () => scheduleCommit();
    // Univer renders the workbook, formula bar, and sheet toolbar inside this
    // host. Listening on ownerDocument made every click elsewhere in the page
    // serialize the entire workbook, which presented as a constant refresh on
    // larger sheets even though the semantic equality guard skipped the save.
    const eventTarget = hostElement;
    for (const eventName of ["input", "change", "keyup", "paste", "cut", "pointerup"] as const) {
      eventTarget.addEventListener(eventName, scheduleCommitFromUI, true);
    }
    const applyProtections = async () => {
      if (!readOnly && !canManage) {
        for (const item of contentRef.current.protected_ranges) {
          const worksheet = workbook.getSheetBySheetId(item.sheet_id);
          if (!worksheet) continue;
          await worksheet.getRange({ startRow: item.range.start_row, endRow: item.range.end_row, startColumn: item.range.start_column, endColumn: item.range.end_column }).getRangePermission().protect({ name: item.name, allowedUsers: ["knowledge-manager"], allowViewByOthers: true });
        }
      }
      ready = true;
      if (initialSearchLocation?.kind === "cell" && initialSearchLocation.sheet_id && initialSearchLocation.cell) {
        const worksheet = workbook.getSheetBySheetId(initialSearchLocation.sheet_id);
        if (worksheet) {
          workbook.setActiveSheet(worksheet);
          worksheet.getRange(initialSearchLocation.cell).activate();
          setSheetID(initialSearchLocation.sheet_id);
        }
      }
    };
    void applyProtections().catch(() => { ready = true; });
    return () => {
      if (commitTimer !== undefined) window.clearTimeout(commitTimer);
      for (const eventName of ["input", "change", "keyup", "paste", "cut", "pointerup"] as const) {
        eventTarget.removeEventListener(eventName, scheduleCommitFromUI, true);
      }
      mutationListener.dispose(); workbookRef.current = null; container.remove();
      window.setTimeout(() => univer.dispose(), 0);
    };
  }, [canManage, initialSearchLocation, instanceRevision, readOnly]);

  const selectedSheetExists = content.workbook.sheetOrder.includes(sheetID);
  useEffect(() => { if (!selectedSheetExists) setSheetID(content.workbook.sheetOrder[0] || ""); }, [content.workbook.sheetOrder, selectedSheetExists]);
  const sheetOptions = useMemo(() => content.workbook.sheetOrder.map(id => ({ id, name: String((content.workbook.sheets[id] as { name?: string } | undefined)?.name || id) })), [content.workbook.sheetOrder, content.workbook.sheets]);

  const parsedRange = () => {
    const value = parseSpreadsheetRange(rangeText);
    if (!value) throw Error("请输入类似 A1:B10 的有效区域。");
    const sheet = contentRef.current.workbook.sheets[sheetID] as { rowCount?: number; columnCount?: number } | undefined;
    if (!sheet || value.end_row >= Number(sheet.rowCount || 0) || value.end_column >= Number(sheet.columnCount || 0)) throw Error("所选区域超出工作表范围。");
    return value;
  };

  const addChart = () => {
    try { commit({ ...contentRef.current, charts: [...contentRef.current.charts, { id: spreadsheetID("chart"), name: name.trim() || "新图表", sheet_id: sheetID, type: chartType, range: parsedRange() }] }); setName(""); }
    catch (failure) { onActionFeedback?.(failure instanceof Error ? failure.message : "图表创建失败。"); }
  };
  const addPivot = () => {
    try { commit({ ...contentRef.current, pivots: [...contentRef.current.pivots, { id: spreadsheetID("pivot"), name: name.trim() || "新透视表", sheet_id: sheetID, aggregate, source_range: parsedRange() }] }); setName(""); }
    catch (failure) { onActionFeedback?.(failure instanceof Error ? failure.message : "透视表创建失败。"); }
  };
  const addProtection = () => {
    if (!canManage) return;
    try { commit({ ...contentRef.current, protected_ranges: [...contentRef.current.protected_ranges, { id: spreadsheetID("protection"), name: name.trim() || "受保护区域", sheet_id: sheetID, range: parsedRange(), minimum_role: "manager" }] }); setName(""); setInstanceRevision(value => value + 1); }
    catch (failure) { onActionFeedback?.(failure instanceof Error ? failure.message : "保护范围创建失败。"); }
  };
  const removeFeature = (kind: "charts" | "pivots" | "protected_ranges", id: string) => {
    if (kind === "protected_ranges" && !canManage) return;
    commit({ ...contentRef.current, [kind]: contentRef.current[kind].filter(item => item.id !== id) });
    if (kind === "protected_ranges") setInstanceRevision(value => value + 1);
  };
  const exportXLSX = async () => {
    if (!authorizeContentAction) throw Error("当前页面禁止导出内容。");
    await authorizeContentAction("export");
    const value = { ...contentRef.current, workbook: sanitizeSpreadsheetWorkbook(workbookRef.current?.save() || contentRef.current.workbook) };
    const buffer = await exportKnowledgeSpreadsheetXLSX(value);
    downloadBlob(new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }), `${documentTitle || "电子表格"}.xlsx`);
    onActionFeedback?.("电子表格已导出为 XLSX。");
  };
  const importXLSX = async (file: File) => {
    const value = await importKnowledgeSpreadsheetXLSX(await file.arrayBuffer());
    const serialized = JSON.stringify(value);
    bodyRef.current = serialized; contentRef.current = value; setContent(value); setSheetID(value.workbook.sheetOrder[0] || ""); onChangeRef.current(serialized); setInstanceRevision(current => current + 1);
    onActionFeedback?.(`已从“${file.name}”导入 ${value.workbook.sheetOrder.length} 个工作表。`);
  };

  return <div className="knowledge-open-editor is-univer native-spreadsheet-product">
    {authorizeContentAction && <PageActionPortal host={pageActionHost}><Button onClick={() => void exportXLSX().catch(failure => onActionFeedback?.(failure instanceof Error ? failure.message : "导出失败。"))}><Download size={15} />XLSX</Button></PageActionPortal>}
    <div className="native-sheet-toolbar">
      <div><Button aria-pressed={panel === "charts"} onClick={() => setPanel(value => value === "charts" ? null : "charts")}><BarChart3 size={15} />图表</Button><Button aria-pressed={panel === "pivots"} onClick={() => setPanel(value => value === "pivots" ? null : "pivots")}><TableProperties size={15} />透视表</Button>{canManage && !readOnly && <Button aria-pressed={panel === "protection"} onClick={() => setPanel(value => value === "protection" ? null : "protection")}><LockKeyhole size={15} />保护范围</Button>}</div>
      <span>数据验证与条件格式位于表格工具栏</span>
      <div>{!readOnly && <><Button onClick={() => importRef.current?.click()}><Upload size={15} />导入</Button><input ref={importRef} hidden type="file" accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" onChange={event => { const file = event.target.files?.[0]; if (file) void importXLSX(file).catch(failure => onActionFeedback?.(failure instanceof Error ? failure.message : "导入失败。")); event.currentTarget.value = ""; }} /></>}</div>
    </div>
    {panel && <aside className="native-sheet-analysis" aria-label={panel === "charts" ? "图表" : panel === "pivots" ? "透视表" : "保护范围"}>
      <header><div><strong>{panel === "charts" ? "图表" : panel === "pivots" ? "透视表" : "保护范围"}</strong><p>{panel === "charts" ? "首列作为分类、第二列作为数值。" : panel === "pivots" ? "首列分组、第二列汇总。" : "保护范围仅知识库管理员可以修改。"}</p></div></header>
      {!readOnly && (panel !== "protection" || canManage) && <div className="native-sheet-feature-form"><input aria-label="名称" value={name} onChange={event => setName(event.target.value)} placeholder="名称" maxLength={128} /><Select aria-label="工作表" value={sheetID} onChange={event => setSheetID(event.target.value)}>{sheetOptions.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</Select><input aria-label="区域" value={rangeText} onChange={event => setRangeText(event.target.value)} placeholder="A1:B10" />{panel === "charts" && <Select aria-label="图表类型" value={chartType} onChange={event => setChartType(event.target.value as SpreadsheetChart["type"])}><option value="column">柱状图</option><option value="bar">条形图</option><option value="line">折线图</option><option value="area">面积图</option><option value="pie">饼图</option><option value="donut">环形图</option><option value="scatter">散点图</option><option value="radar">雷达图</option><option value="funnel">漏斗图</option><option value="waterfall">瀑布图</option></Select>}{panel === "pivots" && <Select aria-label="汇总方式" value={aggregate} onChange={event => setAggregate(event.target.value as SpreadsheetPivot["aggregate"])}><option value="sum">合计</option><option value="count">计数</option><option value="average">平均值</option><option value="min">最小值</option><option value="max">最大值</option></Select>}<Button className="primary" onClick={panel === "charts" ? addChart : panel === "pivots" ? addPivot : addProtection}><Plus size={15} />创建</Button></div>}
      <div className="native-sheet-feature-list">{panel === "charts" ? content.charts.map(chart => <article key={chart.id}><header><div><strong>{chart.name}</strong><span>{sheetOptions.find(item => item.id === chart.sheet_id)?.name || chart.sheet_id} · {formatSpreadsheetRange(chart.range)}</span></div>{!readOnly && <Button title="删除图表" onClick={() => removeFeature("charts", chart.id)}><Trash2 size={14} /></Button>}</header><ChartPreview content={content} chart={chart} /></article>) : panel === "pivots" ? content.pivots.map(pivot => <article key={pivot.id}><header><div><strong>{pivot.name}</strong><span>{sheetOptions.find(item => item.id === pivot.sheet_id)?.name || pivot.sheet_id} · {formatSpreadsheetRange(pivot.source_range)}</span></div>{!readOnly && <Button title="删除透视表" onClick={() => removeFeature("pivots", pivot.id)}><Trash2 size={14} /></Button>}</header><PivotPreview content={content} pivot={pivot} /></article>) : content.protected_ranges.map(item => <article key={item.id}><header><div><strong>{item.name}</strong><span>{sheetOptions.find(option => option.id === item.sheet_id)?.name || item.sheet_id} · {formatSpreadsheetRange(item.range)} · 仅管理员可编辑</span></div>{canManage && !readOnly && <Button title="删除保护范围" onClick={() => removeFeature("protected_ranges", item.id)}><Trash2 size={14} /></Button>}</header></article>)}</div>
    </aside>}
    <div ref={host} className="native-spreadsheet-host" />
  </div>;
}
