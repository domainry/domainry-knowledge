import { kt, ktf } from "../i18n/runtime.ts";
import { useEffect, useMemo, useRef, useState } from "react";
import { BarChart3, Download, LockKeyhole, Plus, TableProperties, Trash2, Upload } from "lucide-react";
import { createUniver, ICommandService, LocaleType, mergeLocales, type IWorkbookData } from "@univerjs/presets";
import { UniverSheetsCorePreset } from "@univerjs/preset-sheets-core";
import coreArSA from "@univerjs/preset-sheets-core/locales/ar-SA";
import coreDeDE from "@univerjs/preset-sheets-core/locales/de-DE";
import coreEnUS from "@univerjs/preset-sheets-core/locales/en-US";
import coreEsES from "@univerjs/preset-sheets-core/locales/es-ES";
import coreFrFR from "@univerjs/preset-sheets-core/locales/fr-FR";
import coreItIT from "@univerjs/preset-sheets-core/locales/it-IT";
import coreJaJP from "@univerjs/preset-sheets-core/locales/ja-JP";
import coreKoKR from "@univerjs/preset-sheets-core/locales/ko-KR";
import corePtBR from "@univerjs/preset-sheets-core/locales/pt-BR";
import coreZhCN from "@univerjs/preset-sheets-core/locales/zh-CN";
import coreZhTW from "@univerjs/preset-sheets-core/locales/zh-TW";
import { UniverSheetsConditionalFormattingPreset } from "@univerjs/preset-sheets-conditional-formatting";
import conditionalFormattingArSA from "@univerjs/preset-sheets-conditional-formatting/locales/ar-SA";
import conditionalFormattingDeDE from "@univerjs/preset-sheets-conditional-formatting/locales/de-DE";
import conditionalFormattingEnUS from "@univerjs/preset-sheets-conditional-formatting/locales/en-US";
import conditionalFormattingEsES from "@univerjs/preset-sheets-conditional-formatting/locales/es-ES";
import conditionalFormattingFrFR from "@univerjs/preset-sheets-conditional-formatting/locales/fr-FR";
import conditionalFormattingItIT from "@univerjs/preset-sheets-conditional-formatting/locales/it-IT";
import conditionalFormattingJaJP from "@univerjs/preset-sheets-conditional-formatting/locales/ja-JP";
import conditionalFormattingKoKR from "@univerjs/preset-sheets-conditional-formatting/locales/ko-KR";
import conditionalFormattingPtBR from "@univerjs/preset-sheets-conditional-formatting/locales/pt-BR";
import conditionalFormattingZhCN from "@univerjs/preset-sheets-conditional-formatting/locales/zh-CN";
import conditionalFormattingZhTW from "@univerjs/preset-sheets-conditional-formatting/locales/zh-TW";
import { UniverSheetsDataValidationPreset } from "@univerjs/preset-sheets-data-validation";
import dataValidationArSA from "@univerjs/preset-sheets-data-validation/locales/ar-SA";
import dataValidationDeDE from "@univerjs/preset-sheets-data-validation/locales/de-DE";
import dataValidationEnUS from "@univerjs/preset-sheets-data-validation/locales/en-US";
import dataValidationEsES from "@univerjs/preset-sheets-data-validation/locales/es-ES";
import dataValidationFrFR from "@univerjs/preset-sheets-data-validation/locales/fr-FR";
import dataValidationItIT from "@univerjs/preset-sheets-data-validation/locales/it-IT";
import dataValidationJaJP from "@univerjs/preset-sheets-data-validation/locales/ja-JP";
import dataValidationKoKR from "@univerjs/preset-sheets-data-validation/locales/ko-KR";
import dataValidationPtBR from "@univerjs/preset-sheets-data-validation/locales/pt-BR";
import dataValidationZhCN from "@univerjs/preset-sheets-data-validation/locales/zh-CN";
import dataValidationZhTW from "@univerjs/preset-sheets-data-validation/locales/zh-TW";
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
import { useKnowledgeTheme } from "../theme.tsx";
import { useKnowledgeLocale } from "../i18n/runtime.ts";
import { univerLocaleKey } from "../i18n/thirdParty.ts";

const univerLocaleTypes = {
  "en-US": LocaleType.EN_US, "zh-CN": LocaleType.ZH_CN, "zh-TW": LocaleType.ZH_TW,
  "ja-JP": LocaleType.JA_JP, "ko-KR": LocaleType.KO_KR, "es-ES": LocaleType.ES_ES,
  "pt-BR": LocaleType.PT_BR, "fr-FR": LocaleType.FR_FR, "de-DE": LocaleType.DE_DE,
  "it-IT": LocaleType.IT_IT, "ar-SA": LocaleType.AR_SA,
} as const;

const univerLocales = {
  [LocaleType.EN_US]: mergeLocales(coreEnUS, conditionalFormattingEnUS, dataValidationEnUS),
  [LocaleType.ZH_CN]: mergeLocales(coreZhCN, conditionalFormattingZhCN, dataValidationZhCN),
  [LocaleType.ZH_TW]: mergeLocales(coreZhTW, conditionalFormattingZhTW, dataValidationZhTW),
  [LocaleType.JA_JP]: mergeLocales(coreJaJP, conditionalFormattingJaJP, dataValidationJaJP),
  [LocaleType.KO_KR]: mergeLocales(coreKoKR, conditionalFormattingKoKR, dataValidationKoKR),
  [LocaleType.ES_ES]: mergeLocales(coreEsES, conditionalFormattingEsES, dataValidationEsES),
  [LocaleType.PT_BR]: mergeLocales(corePtBR, conditionalFormattingPtBR, dataValidationPtBR),
  [LocaleType.FR_FR]: mergeLocales(coreFrFR, conditionalFormattingFrFR, dataValidationFrFR),
  [LocaleType.DE_DE]: mergeLocales(coreDeDE, conditionalFormattingDeDE, dataValidationDeDE),
  [LocaleType.IT_IT]: mergeLocales(coreItIT, conditionalFormattingItIT, dataValidationItIT),
  [LocaleType.AR_SA]: mergeLocales(coreArSA, conditionalFormattingArSA, dataValidationArSA),
};

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
  if (data.length === 0) return <p className="knowledge-subtle">{kt("knowledge.auto.9c6d0cd26b8b01a7")}</p>;
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
  const aggregateLabel = { sum: kt("knowledge.auto.e009c148d1890dac"), count: kt("knowledge.auto.21179deb9a747f5f"), average: kt("knowledge.auto.db7538b96322d441"), min: kt("knowledge.auto.b2dcdcfabb6af2a8"), max: kt("knowledge.auto.1e7a2282076889b8") }[pivot.aggregate];
  return rows.length === 0 ? <p className="knowledge-subtle">{kt("knowledge.auto.eb0fcedb9063f2fd")}</p> : <table className="native-sheet-pivot"><thead><tr><th>{kt("knowledge.auto.399ee69347726cee")}</th><th>{aggregateLabel}</th></tr></thead><tbody>{rows.map(row => <tr key={row.label}><td>{row.label}</td><td>{Number(row.value.toFixed(4))}</td></tr>)}</tbody></table>;
}

export function SpreadsheetEditor({ body, readOnly = false, canManage = false, documentTitle = kt("knowledge.auto.4ec5b26015f27485"), initialSearchLocation, pageActionHost, authorizeContentAction, onActionFeedback, onChange }: KnowledgeEditorProps) {
  const knowledgeTheme = useKnowledgeTheme();
  const knowledgeLocale = useKnowledgeLocale();
  const univerLocale = univerLocaleTypes[univerLocaleKey[knowledgeLocale]];
  const host = useRef<HTMLDivElement>(null);
  const importRef = useRef<HTMLInputElement>(null);
  const onChangeRef = useRef(onChange);
  const [content, setContent] = useState(() => initialContent(body));
  const contentRef = useRef(content);
  const bodyRef = useRef(body);
  const workbookRef = useRef<{ save(): IWorkbookData } | null>(null);
  const univerThemeRef = useRef<{
    toggleDarkMode(value: boolean): void;
    setLocale(locale: string): void;
    setDirection(direction: "ltr" | "rtl"): void;
  } | null>(null);
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
      darkMode: knowledgeTheme === "dark",
      locale: univerLocale,
      locales: univerLocales,
      direction: knowledgeLocale === "ar" ? "rtl" : "ltr",
      presets: [
        UniverSheetsCorePreset({ container, toolbar: !readOnly, formulaBar: true, footer: readOnly ? false : {} }),
        UniverSheetsDataValidationPreset(),
        UniverSheetsConditionalFormattingPreset(),
      ],
    });
    univerThemeRef.current = univerAPI;
    const workbook = univerAPI.createWorkbook(structuredClone(contentRef.current.workbook));
    workbookRef.current = workbook;
    if (workbook.getSheets().length === 0) workbook.insertSheet(kt("knowledge.auto.345cc0e777c05058"));
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
      mutationListener.dispose(); workbookRef.current = null; univerThemeRef.current = null; container.remove();
      window.setTimeout(() => univer.dispose(), 0);
    };
  }, [canManage, initialSearchLocation, instanceRevision, readOnly]);

  useEffect(() => { univerThemeRef.current?.toggleDarkMode(knowledgeTheme === "dark"); }, [knowledgeTheme]);
  useEffect(() => {
    univerThemeRef.current?.setLocale(univerLocale);
    univerThemeRef.current?.setDirection(knowledgeLocale === "ar" ? "rtl" : "ltr");
  }, [knowledgeLocale, univerLocale]);

  const selectedSheetExists = content.workbook.sheetOrder.includes(sheetID);
  useEffect(() => { if (!selectedSheetExists) setSheetID(content.workbook.sheetOrder[0] || ""); }, [content.workbook.sheetOrder, selectedSheetExists]);
  const sheetOptions = useMemo(() => content.workbook.sheetOrder.map(id => ({ id, name: String((content.workbook.sheets[id] as { name?: string } | undefined)?.name || id) })), [content.workbook.sheetOrder, content.workbook.sheets]);

  const parsedRange = () => {
    const value = parseSpreadsheetRange(rangeText);
    if (!value) throw Error(kt("knowledge.auto.a06c644626da429e"));
    const sheet = contentRef.current.workbook.sheets[sheetID] as { rowCount?: number; columnCount?: number } | undefined;
    if (!sheet || value.end_row >= Number(sheet.rowCount || 0) || value.end_column >= Number(sheet.columnCount || 0)) throw Error(kt("knowledge.auto.0b0ab232fd67ea04"));
    return value;
  };

  const addChart = () => {
    try { commit({ ...contentRef.current, charts: [...contentRef.current.charts, { id: spreadsheetID("chart"), name: name.trim() || kt("knowledge.auto.21c2e2d524f3bd00"), sheet_id: sheetID, type: chartType, range: parsedRange() }] }); setName(""); }
    catch (failure) { onActionFeedback?.(failure instanceof Error ? failure.message : kt("knowledge.auto.1a4f9c02d357a0b2")); }
  };
  const addPivot = () => {
    try { commit({ ...contentRef.current, pivots: [...contentRef.current.pivots, { id: spreadsheetID("pivot"), name: name.trim() || kt("knowledge.auto.1b9da3d38228c745"), sheet_id: sheetID, aggregate, source_range: parsedRange() }] }); setName(""); }
    catch (failure) { onActionFeedback?.(failure instanceof Error ? failure.message : kt("knowledge.auto.253a7fdf15052a86")); }
  };
  const addProtection = () => {
    if (!canManage) return;
    try { commit({ ...contentRef.current, protected_ranges: [...contentRef.current.protected_ranges, { id: spreadsheetID("protection"), name: name.trim() || kt("knowledge.auto.ecc5009acbc9bff0"), sheet_id: sheetID, range: parsedRange(), minimum_role: "manager" }] }); setName(""); setInstanceRevision(value => value + 1); }
    catch (failure) { onActionFeedback?.(failure instanceof Error ? failure.message : kt("knowledge.auto.645eb5b9053aacae")); }
  };
  const removeFeature = (kind: "charts" | "pivots" | "protected_ranges", id: string) => {
    if (kind === "protected_ranges" && !canManage) return;
    commit({ ...contentRef.current, [kind]: contentRef.current[kind].filter(item => item.id !== id) });
    if (kind === "protected_ranges") setInstanceRevision(value => value + 1);
  };
  const exportXLSX = async () => {
    if (!authorizeContentAction) throw Error(kt("knowledge.auto.5838a06d4990c165"));
    await authorizeContentAction("export");
    const value = { ...contentRef.current, workbook: sanitizeSpreadsheetWorkbook(workbookRef.current?.save() || contentRef.current.workbook) };
    const buffer = await exportKnowledgeSpreadsheetXLSX(value);
    downloadBlob(new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }), `${documentTitle || kt("knowledge.auto.4ec5b26015f27485")}.xlsx`);
    onActionFeedback?.(kt("knowledge.auto.951630ead9a30342"));
  };
  const importXLSX = async (file: File) => {
    const value = await importKnowledgeSpreadsheetXLSX(await file.arrayBuffer());
    const serialized = JSON.stringify(value);
    bodyRef.current = serialized; contentRef.current = value; setContent(value); setSheetID(value.workbook.sheetOrder[0] || ""); onChangeRef.current(serialized); setInstanceRevision(current => current + 1);
    onActionFeedback?.(ktf("knowledge.auto.92eca7aebb70b6fc", { value0: file.name, value1: value.workbook.sheetOrder.length }));
  };

  return <div className="knowledge-open-editor is-univer native-spreadsheet-product">
    {authorizeContentAction && <PageActionPortal host={pageActionHost}><Button onClick={() => void exportXLSX().catch(failure => onActionFeedback?.(failure instanceof Error ? failure.message : kt("knowledge.auto.f7862b83251f2349")))}><Download size={15} />XLSX</Button></PageActionPortal>}
    <div className="native-sheet-toolbar">
      <div><Button aria-pressed={panel === "charts"} onClick={() => setPanel(value => value === "charts" ? null : "charts")}><BarChart3 size={15} />{kt("knowledge.auto.8cb443ab83797881")}</Button><Button aria-pressed={panel === "pivots"} onClick={() => setPanel(value => value === "pivots" ? null : "pivots")}><TableProperties size={15} />{kt("knowledge.auto.b2c47bafe303b596")}</Button>{canManage && !readOnly && <Button aria-pressed={panel === "protection"} onClick={() => setPanel(value => value === "protection" ? null : "protection")}><LockKeyhole size={15} />{kt("knowledge.auto.92e5720b9aa5a9ef")}</Button>}</div>
      <span>{kt("knowledge.auto.1a837c925e222cd4")}</span>
      <div>{!readOnly && <><Button onClick={() => importRef.current?.click()}><Upload size={15} />{kt("knowledge.auto.576d81bb0631b165")}</Button><input ref={importRef} hidden type="file" accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" onChange={event => { const file = event.target.files?.[0]; if (file) void importXLSX(file).catch(failure => onActionFeedback?.(failure instanceof Error ? failure.message : kt("knowledge.auto.d5d4ca58693603db"))); event.currentTarget.value = ""; }} /></>}</div>
    </div>
    {panel && <aside className="native-sheet-analysis" aria-label={panel === "charts" ? kt("knowledge.auto.8cb443ab83797881") : panel === "pivots" ? kt("knowledge.auto.b2c47bafe303b596") : kt("knowledge.auto.92e5720b9aa5a9ef")}>
      <header><div><strong>{panel === "charts" ? kt("knowledge.auto.8cb443ab83797881") : panel === "pivots" ? kt("knowledge.auto.b2c47bafe303b596") : kt("knowledge.auto.92e5720b9aa5a9ef")}</strong><p>{panel === "charts" ? kt("knowledge.auto.8c4bfddf6e7be247") : panel === "pivots" ? kt("knowledge.auto.6fb641f2da1e8f8a") : kt("knowledge.auto.ae87ceeb79853ef8")}</p></div></header>
      {!readOnly && (panel !== "protection" || canManage) && <div className="native-sheet-feature-form"><input aria-label={kt("knowledge.auto.d44e9b3d3b31d37b")} value={name} onChange={event => setName(event.target.value)} placeholder={kt("knowledge.auto.d44e9b3d3b31d37b")} maxLength={128} /><Select aria-label={kt("knowledge.auto.b02781ee06c6587e")} value={sheetID} onChange={event => setSheetID(event.target.value)}>{sheetOptions.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</Select><input aria-label={kt("knowledge.auto.3382870bc4ada94e")} value={rangeText} onChange={event => setRangeText(event.target.value)} placeholder="A1:B10" />{panel === "charts" && <Select aria-label={kt("knowledge.auto.52fe98551232b10f")} value={chartType} onChange={event => setChartType(event.target.value as SpreadsheetChart["type"])}><option value="column">{kt("knowledge.auto.8aece403ca0b24e6")}</option><option value="bar">{kt("knowledge.auto.a7cdeaf06b1273ad")}</option><option value="line">{kt("knowledge.auto.c24656699bd0194b")}</option><option value="area">{kt("knowledge.auto.20068d3d65236e97")}</option><option value="pie">{kt("knowledge.auto.86f348d657451e11")}</option><option value="donut">{kt("knowledge.auto.7777709a84485768")}</option><option value="scatter">{kt("knowledge.auto.c062f5c0bb71d902")}</option><option value="radar">{kt("knowledge.auto.1107fe308f214801")}</option><option value="funnel">{kt("knowledge.auto.715aae7a0b8f4194")}</option><option value="waterfall">{kt("knowledge.auto.c4a5d4f05b97ac71")}</option></Select>}{panel === "pivots" && <Select aria-label={kt("knowledge.auto.d64dc053a5773bad")} value={aggregate} onChange={event => setAggregate(event.target.value as SpreadsheetPivot["aggregate"])}><option value="sum">{kt("knowledge.auto.e009c148d1890dac")}</option><option value="count">{kt("knowledge.auto.21179deb9a747f5f")}</option><option value="average">{kt("knowledge.auto.db7538b96322d441")}</option><option value="min">{kt("knowledge.auto.b2dcdcfabb6af2a8")}</option><option value="max">{kt("knowledge.auto.1e7a2282076889b8")}</option></Select>}<Button className="primary" onClick={panel === "charts" ? addChart : panel === "pivots" ? addPivot : addProtection}><Plus size={15} />{kt("knowledge.auto.cde2cd071d25bbab")}</Button></div>}
      <div className="native-sheet-feature-list">{panel === "charts" ? content.charts.map(chart => <article key={chart.id}><header><div><strong>{chart.name}</strong><span>{sheetOptions.find(item => item.id === chart.sheet_id)?.name || chart.sheet_id} · {formatSpreadsheetRange(chart.range)}</span></div>{!readOnly && <Button title={kt("knowledge.auto.60d6145c0a1da027")} onClick={() => removeFeature("charts", chart.id)}><Trash2 size={14} /></Button>}</header><ChartPreview content={content} chart={chart} /></article>) : panel === "pivots" ? content.pivots.map(pivot => <article key={pivot.id}><header><div><strong>{pivot.name}</strong><span>{sheetOptions.find(item => item.id === pivot.sheet_id)?.name || pivot.sheet_id} · {formatSpreadsheetRange(pivot.source_range)}</span></div>{!readOnly && <Button title={kt("knowledge.auto.4ff18336585a3066")} onClick={() => removeFeature("pivots", pivot.id)}><Trash2 size={14} /></Button>}</header><PivotPreview content={content} pivot={pivot} /></article>) : content.protected_ranges.map(item => <article key={item.id}><header><div><strong>{item.name}</strong><span>{sheetOptions.find(option => option.id === item.sheet_id)?.name || item.sheet_id} · {formatSpreadsheetRange(item.range)} {kt("knowledge.auto.6cedc49dd5acfb7a")}</span></div>{canManage && !readOnly && <Button title={kt("knowledge.auto.ed3184ab190e9ac9")} onClick={() => removeFeature("protected_ranges", item.id)}><Trash2 size={14} /></Button>}</header></article>)}</div>
    </aside>}
    <div ref={host} className="native-spreadsheet-host" />
  </div>;
}
