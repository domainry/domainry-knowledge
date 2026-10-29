import { kt, ktf } from "../i18n/runtime.ts";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "katex/dist/katex.min.css";
import { AlignCenter, AlignLeft, AlignRight, BarChart3, Braces, ChevronDown, ChevronUp, Copy, FileDown, ImagePlus, Maximize2, MonitorPlay, Plus, RectangleHorizontal, Sigma, Table2, Trash2, Type, Video, X } from "lucide-react";
import { Button, Select } from "../components.tsx";
import { renderSafeLatex } from "../latex.ts";
import {
  applyPresentationTheme,
  canonicalPresentationContent,
  createPresentationSlide,
  parsePresentationContent,
  presentationCanvasHeight,
  presentationCanvasWidth,
  presentationChartTypes,
  presentationLayoutElements,
  presentationLayouts,
  presentationShapeTypes,
  presentationThemes,
} from "../presentationContent.ts";
import type { PresentationAsset, PresentationChart, PresentationChartType, PresentationContent, PresentationElement, PresentationLayout, PresentationMaster, PresentationShapeType, PresentationSlide, PresentationThemeID } from "../presentationContent.ts";
import { safeDocumentFilename } from "./documentTransfer.ts";
import { PageActionPortal } from "./PageActionPortal.tsx";
import type { KnowledgeEditorProps } from "./types.ts";
import type PptxGenJS from "pptxgenjs";

const presentationReferencePattern = /^knowledge-document:kdoc_[a-f0-9]{32}$/;
const presentationShapeLabels: Record<PresentationShapeType, string> = {
  get rectangle() { return kt("knowledge.auto.88b75a101595a23a"); },
  get rounded_rectangle() { return kt("knowledge.auto.ff2a1ce911fc64f1"); },
  get ellipse() { return kt("knowledge.auto.7cd7a8146fca51e0"); },
  get triangle() { return kt("knowledge.auto.3ecb2130838315af"); },
  get diamond() { return kt("knowledge.auto.960748c01415d344"); },
  get hexagon() { return kt("knowledge.auto.8d27753418bad716"); },
  get star() { return kt("knowledge.auto.59983f97d2e08a29"); },
  get arrow_right() { return kt("knowledge.auto.e0ed6e5879472601"); },
  get callout() { return kt("knowledge.auto.be37540cc9d42c17"); },
  get line() { return kt("knowledge.auto.c94b5ebf51692703"); },
};
const presentationChartLabels: Record<PresentationChartType, string> = {
  get column() { return kt("knowledge.auto.8aece403ca0b24e6"); },
  get bar() { return kt("knowledge.auto.a7cdeaf06b1273ad"); },
  get line() { return kt("knowledge.auto.c24656699bd0194b"); },
  get area() { return kt("knowledge.auto.20068d3d65236e97"); },
  get pie() { return kt("knowledge.auto.86f348d657451e11"); },
  get donut() { return kt("knowledge.auto.7777709a84485768"); },
};
const presentationChartColors = ["#00856A", "#4E7FEC", "#F0A93B", "#D45C7D", "#7559C7", "#21A6A1"];

function newID(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}

function hex(value: string) {
  return value.replace(/^#/, "").toUpperCase();
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function uploadedDocumentReference(value: string | Record<string, unknown>) {
  if (typeof value === "string") return presentationReferencePattern.test(value) ? value : "";
  const props = value && typeof value.props === "object" && value.props ? value.props as Record<string, unknown> : {};
  const reference = String(props.url || value.url || "");
  return presentationReferencePattern.test(reference) ? reference : "";
}

async function blobDataURL(blob: Blob) {
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(reader.error || Error(kt("knowledge.auto.249712fb6b44bc47")));
    reader.readAsDataURL(blob);
  });
}

function PresentationAssetView({ asset, readFile, thumbnail = false }: { asset: PresentationAsset; readFile?: (reference: string) => Promise<Blob>; thumbnail?: boolean }) {
  const [url, setURL] = useState("");
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let active = true, objectURL = "";
    if (!readFile) { setFailed(true); return; }
    setFailed(false);
    void readFile(asset.document_ref).then(blob => {
      if (!active) return;
      objectURL = URL.createObjectURL(blob);
      setURL(objectURL);
    }).catch(() => { if (active) setFailed(true); });
    return () => { active = false; if (objectURL) URL.revokeObjectURL(objectURL); };
  }, [asset.document_ref, readFile]);
  if (failed) return <span className="presentation-media-state">{kt("knowledge.auto.726a3a5882878961")}</span>;
  if (!url) return <span className="presentation-media-state">{kt("knowledge.auto.21bd738e0d7191a7")}</span>;
  if (asset.mime_type.startsWith("video/")) return thumbnail ? <span className="presentation-video-thumbnail"><Video size={20} />{kt("knowledge.auto.c20f7618d330a854")}</span> : <video src={url} controls />;
  return <img src={url} alt={asset.filename} draggable={false} />;
}

function elementStyle(element: PresentationElement): React.CSSProperties {
  return {
    left: `${element.x / presentationCanvasWidth * 100}%`,
    top: `${element.y / presentationCanvasHeight * 100}%`,
    width: `${element.width / presentationCanvasWidth * 100}%`,
    height: `${element.height / presentationCanvasHeight * 100}%`,
    transform: `rotate(${element.rotation}deg)`,
  };
}

function PresentationShapeGraphic({ shape, fill, stroke, strokeWidth }: { shape: PresentationShapeType; fill: string; stroke: string; strokeWidth: number }) {
  const common = { fill: shape === "line" ? "none" : fill, stroke, strokeWidth: Math.max(0, strokeWidth), vectorEffect: "non-scaling-stroke" as const };
  return <svg className="presentation-shape-graphic" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
    {shape === "rectangle" && <rect x="2" y="2" width="96" height="96" {...common} />}
    {shape === "rounded_rectangle" && <rect x="2" y="2" width="96" height="96" rx="14" ry="14" {...common} />}
    {shape === "ellipse" && <ellipse cx="50" cy="50" rx="48" ry="48" {...common} />}
    {shape === "triangle" && <polygon points="50,2 98,98 2,98" {...common} />}
    {shape === "diamond" && <polygon points="50,2 98,50 50,98 2,50" {...common} />}
    {shape === "hexagon" && <polygon points="25,2 75,2 98,50 75,98 25,98 2,50" {...common} />}
    {shape === "star" && <polygon points="50,2 61,36 97,36 68,57 79,94 50,72 21,94 32,57 3,36 39,36" {...common} />}
    {shape === "arrow_right" && <polygon points="2,28 62,28 62,6 98,50 62,94 62,72 2,72" {...common} />}
    {shape === "callout" && <polygon points="2,2 98,2 98,76 43,76 24,98 27,76 2,76" {...common} />}
    {shape === "line" && <line x1="2" y1="50" x2="98" y2="50" {...common} />}
  </svg>;
}

function PresentationChartGraphic({ chart }: { chart: PresentationChart }) {
  const values = chart.series.flatMap(series => series.values);
  const maximum = Math.max(1, ...values.map(value => Math.abs(value)));
  if (chart.type === "pie" || chart.type === "donut") {
    const source = chart.series[0]?.values.map(value => Math.max(0, value)) || [];
    const total = Math.max(1, source.reduce((sum, value) => sum + value, 0));
    let cursor = 0;
    const stops = source.map((value, index) => { const start = cursor; cursor += value / total * 100; return `${presentationChartColors[index % presentationChartColors.length]} ${start}% ${cursor}%`; });
    return <div className="presentation-pie-chart"><i className={chart.type === "donut" ? "is-donut" : ""} style={{ background: `conic-gradient(${stops.join(",")})` }} /><ol>{chart.categories.slice(0, 6).map((category, index) => <li key={`${category}:${index}`}><span style={{ background: presentationChartColors[index % presentationChartColors.length] }} />{category}<b>{source[index] ?? 0}</b></li>)}</ol></div>;
  }
  const width = 1000, height = 480, paddingX = 70, paddingY = 48, plotWidth = width - paddingX * 2, plotHeight = height - paddingY * 2;
  const points = (seriesIndex: number) => chart.series[seriesIndex].values.map((value, index) => ({ x: paddingX + (index + .5) * plotWidth / chart.categories.length, y: paddingY + plotHeight - Math.max(0, value) / maximum * plotHeight }));
  return <svg className={`presentation-chart-graphic is-${chart.type}`} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" aria-label={presentationChartLabels[chart.type]}>
    {[0, 1, 2, 3, 4].map(index => <line key={index} x1={paddingX} x2={width - paddingX} y1={paddingY + plotHeight * index / 4} y2={paddingY + plotHeight * index / 4} stroke="#DDE7E2" strokeWidth="2" />)}
    {chart.type === "column" && chart.series.map((series, seriesIndex) => series.values.map((value, index) => { const groupWidth = plotWidth / chart.categories.length, barWidth = groupWidth * .72 / chart.series.length, x = paddingX + index * groupWidth + groupWidth * .14 + seriesIndex * barWidth, barHeight = Math.max(2, Math.max(0, value) / maximum * plotHeight); return <rect key={`${series.name}:${index}`} x={x} y={paddingY + plotHeight - barHeight} width={barWidth - 3} height={barHeight} rx="3" fill={presentationChartColors[seriesIndex % presentationChartColors.length]} />; }))}
    {chart.type === "bar" && chart.series.slice(0, 1).flatMap(series => series.values.map((value, index) => { const groupHeight = plotHeight / chart.categories.length, barWidth = Math.max(2, Math.max(0, value) / maximum * plotWidth); return <rect key={`${series.name}:${index}`} x={paddingX} y={paddingY + index * groupHeight + groupHeight * .2} width={barWidth} height={groupHeight * .6} rx="3" fill={presentationChartColors[index % presentationChartColors.length]} />; }))}
    {(chart.type === "line" || chart.type === "area") && chart.series.map((series, seriesIndex) => { const seriesPoints = points(seriesIndex), path = seriesPoints.map((point, index) => `${index ? "L" : "M"}${point.x},${point.y}`).join(" "); const areaPath = `${path} L${seriesPoints.at(-1)?.x},${paddingY + plotHeight} L${seriesPoints[0]?.x},${paddingY + plotHeight} Z`; return <g key={series.name}>{chart.type === "area" && <path d={areaPath} fill={presentationChartColors[seriesIndex % presentationChartColors.length]} opacity=".18" />}<path d={path} fill="none" stroke={presentationChartColors[seriesIndex % presentationChartColors.length]} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />{seriesPoints.map((point, index) => <circle key={index} cx={point.x} cy={point.y} r="7" fill={presentationChartColors[seriesIndex % presentationChartColors.length]} />)}</g>; })}
  </svg>;
}

function presentationElementLabel(type: PresentationElement["type"]) {
  return ({ text: kt("knowledge.auto.dd81861811e57bf7"), shape: kt("knowledge.auto.c2f71c1b10ef9d80"), image: kt("knowledge.auto.d24c10d37db0feea"), video: kt("knowledge.auto.c20f7618d330a854"), table: kt("knowledge.auto.22d9e7c54b88cacd"), chart: kt("knowledge.auto.8cb443ab83797881"), formula: kt("knowledge.auto.f3fccedacbcebbfa"), code: kt("knowledge.auto.e6f04ffbaa424001") } as const)[type];
}

function PresentationElementView({ element, asset, readFile, thumbnail = false }: { element: PresentationElement; asset?: PresentationAsset; readFile?: (reference: string) => Promise<Blob>; thumbnail?: boolean }) {
  if (element.type === "text") {
    return <div className="presentation-text-element" style={{ color: element.color, fontSize: `${element.font_size! / presentationCanvasWidth * 100}cqw`, fontWeight: element.font_weight === "bold" ? 750 : 400, textAlign: element.align }}>{element.text}</div>;
  }
  if (element.type === "shape") {
    const shape = element.shape || "rectangle";
    return <div className={`presentation-shape-element is-${shape}`} style={{ color: element.color, fontSize: `${element.font_size! / presentationCanvasWidth * 100}cqw`, fontWeight: element.font_weight === "bold" ? 750 : 400, textAlign: element.align }}>
      <PresentationShapeGraphic shape={shape} fill={element.fill_color || "#FFFFFF"} stroke={element.stroke_color || "#000000"} strokeWidth={element.stroke_width ?? 1} />
      {element.text && <span>{element.text}</span>}
    </div>;
  }
  if (element.type === "table" && element.table) return <div className={`presentation-table-element${element.table.header ? " has-header" : ""}`}><table><tbody>{element.table.rows.map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, columnIndex) => <td key={columnIndex}>{cell}</td>)}</tr>)}</tbody></table></div>;
  if (element.type === "chart" && element.chart) return <div className="presentation-chart-element"><PresentationChartGraphic chart={element.chart} /></div>;
  if (element.type === "formula") { const rendered = renderSafeLatex(element.formula || "", true); return <div className="presentation-formula-element" style={{ color: element.color, fontSize: `${(element.font_size || 40) / presentationCanvasWidth * 100}cqw` }}>{rendered.html ? <span dangerouslySetInnerHTML={{ __html: rendered.html }} /> : <code>{element.formula}</code>}</div>; }
  if (element.type === "code") return <pre className="presentation-code-element" style={{ color: element.color, background: element.fill_color, fontSize: `${(element.font_size || 24) / presentationCanvasWidth * 100}cqw` }}><small>{element.language}</small><code>{element.source}</code></pre>;
  return asset ? <div className={`presentation-media-element is-${element.fit}`}><PresentationAssetView asset={asset} readFile={readFile} thumbnail={thumbnail} /></div> : <span className="presentation-media-state">{kt("knowledge.auto.3883970214374f2b")}</span>;
}

function PresentationSlideView({ content, slide, selectedElementID = "", readOnly = true, thumbnail = false, readFile, onSelectElement, onElementPointerDown }: {
  content: PresentationContent;
  slide: PresentationSlide;
  selectedElementID?: string;
  readOnly?: boolean;
  thumbnail?: boolean;
  readFile?: (reference: string) => Promise<Blob>;
  onSelectElement?(id: string): void;
  onElementPointerDown?(event: React.PointerEvent, element: PresentationElement): void;
}) {
  return <div className={`presentation-slide-canvas${thumbnail ? " is-thumbnail" : ""}`} style={{ background: slide.background_color || content.master.background_color, color: content.master.text_color }}>
    {slide.elements.map(element => {
      const child = <PresentationElementView element={element} asset={element.asset_id ? slide.files[element.asset_id] : undefined} readFile={readFile} thumbnail={thumbnail} />;
      const style = elementStyle(element);
      return readOnly || thumbnail
        ? <div className="presentation-element" key={element.id} style={style}>{child}</div>
        : <button type="button" className={`presentation-element is-editable${selectedElementID === element.id ? " is-selected" : ""}`} aria-label={ktf("knowledge.auto.cc31bdce7d6fa870", { value0: presentationElementLabel(element.type) })} key={element.id} style={style} onClick={() => onSelectElement?.(element.id)} onPointerDown={event => onElementPointerDown?.(event, element)}>{child}</button>;
    })}
    {(content.master.footer || content.master.show_slide_number) && <footer><span>{content.master.footer}</span>{content.master.show_slide_number && <b>{content.slides.findIndex(item => item.id === slide.id) + 1}</b>}</footer>}
  </div>;
}

function tracePresentationShape(context: CanvasRenderingContext2D, shape: PresentationShapeType, width: number, height: number) {
  context.beginPath();
  switch (shape) {
    case "rounded_rectangle": {
      const radius = Math.min(width, height) * .14;
      context.roundRect(0, 0, width, height, radius);
      break;
    }
    case "ellipse":
      context.ellipse(width / 2, height / 2, width / 2, height / 2, 0, 0, Math.PI * 2);
      break;
    case "triangle":
      context.moveTo(width / 2, 0); context.lineTo(width, height); context.lineTo(0, height); context.closePath();
      break;
    case "diamond":
      context.moveTo(width / 2, 0); context.lineTo(width, height / 2); context.lineTo(width / 2, height); context.lineTo(0, height / 2); context.closePath();
      break;
    case "hexagon":
      context.moveTo(width * .25, 0); context.lineTo(width * .75, 0); context.lineTo(width, height / 2); context.lineTo(width * .75, height); context.lineTo(width * .25, height); context.lineTo(0, height / 2); context.closePath();
      break;
    case "star": {
      const outer = Math.min(width, height) / 2, inner = outer * .42;
      for (let index = 0; index < 10; index++) {
        const radius = index % 2 ? inner : outer, angle = -Math.PI / 2 + index * Math.PI / 5;
        const x = width / 2 + Math.cos(angle) * radius, y = height / 2 + Math.sin(angle) * radius;
        if (index === 0) context.moveTo(x, y); else context.lineTo(x, y);
      }
      context.closePath();
      break;
    }
    case "arrow_right":
      context.moveTo(0, height * .28); context.lineTo(width * .62, height * .28); context.lineTo(width * .62, height * .06); context.lineTo(width, height / 2); context.lineTo(width * .62, height * .94); context.lineTo(width * .62, height * .72); context.lineTo(0, height * .72); context.closePath();
      break;
    case "callout":
      context.moveTo(0, 0); context.lineTo(width, 0); context.lineTo(width, height * .76); context.lineTo(width * .43, height * .76); context.lineTo(width * .24, height); context.lineTo(width * .27, height * .76); context.lineTo(0, height * .76); context.closePath();
      break;
    case "line":
      context.moveTo(0, height / 2); context.lineTo(width, height / 2);
      break;
    default:
      context.rect(0, 0, width, height);
  }
}

async function renderSlideCanvas(content: PresentationContent, slide: PresentationSlide, readFile?: (reference: string) => Promise<Blob>) {
  const canvas = document.createElement("canvas");
  canvas.width = presentationCanvasWidth;
  canvas.height = presentationCanvasHeight;
  const context = canvas.getContext("2d");
  if (!context) throw Error(kt("knowledge.auto.1463416239d49ea2"));
  context.fillStyle = slide.background_color || content.master.background_color;
  context.fillRect(0, 0, canvas.width, canvas.height);
  const drawText = (text: string, element: PresentationElement) => {
    context.save();
    context.translate(element.x + element.width / 2, element.y + element.height / 2);
    context.rotate(element.rotation * Math.PI / 180);
    context.translate(-element.width / 2, -element.height / 2);
    context.fillStyle = element.color || content.master.text_color;
    context.font = `${element.font_weight === "bold" ? "700" : "400"} ${element.font_size || 28}px ${content.master.font_family}`;
    context.textBaseline = "top";
    context.textAlign = element.align || "left";
    const anchorX = element.align === "center" ? element.width / 2 : element.align === "right" ? element.width : 0;
    const lineHeight = (element.font_size || 28) * 1.25;
    let y = 0;
    for (const paragraph of text.split("\n")) {
      const words = [...paragraph];
      let line = "";
      for (const word of words) {
        const candidate = line + word;
        if (line && context.measureText(candidate).width > element.width) {
          context.fillText(line, anchorX, y, element.width);
          line = word;
          y += lineHeight;
        } else line = candidate;
      }
      context.fillText(line, anchorX, y, element.width);
      y += lineHeight;
      if (y > element.height) break;
    }
    context.restore();
  };
  const drawChart = (element: PresentationElement, chart: PresentationChart) => {
    const values = chart.series.flatMap(series => series.values), maximum = Math.max(1, ...values.map(value => Math.abs(value)));
    context.save();
    context.translate(element.x, element.y);
    const padding = 42, width = element.width - padding * 2, height = element.height - padding * 2;
    if (chart.type === "pie" || chart.type === "donut") {
      const source = chart.series[0]?.values.map(value => Math.max(0, value)) || [], total = Math.max(1, source.reduce((sum, value) => sum + value, 0));
      let angle = -Math.PI / 2;
      source.forEach((value, index) => { const end = angle + value / total * Math.PI * 2; context.beginPath(); context.moveTo(element.width / 2, element.height / 2); context.arc(element.width / 2, element.height / 2, Math.min(width, height) * .42, angle, end); context.closePath(); context.fillStyle = presentationChartColors[index % presentationChartColors.length]; context.fill(); angle = end; });
      if (chart.type === "donut") { context.beginPath(); context.arc(element.width / 2, element.height / 2, Math.min(width, height) * .2, 0, Math.PI * 2); context.fillStyle = slide.background_color || content.master.background_color; context.fill(); }
    } else if (chart.type === "column") {
      chart.series.forEach((series, seriesIndex) => series.values.forEach((value, index) => { const group = width / chart.categories.length, bar = group * .72 / chart.series.length, barHeight = Math.max(2, Math.max(0, value) / maximum * height); context.fillStyle = presentationChartColors[seriesIndex % presentationChartColors.length]; context.fillRect(padding + index * group + group * .14 + seriesIndex * bar, padding + height - barHeight, Math.max(2, bar - 3), barHeight); }));
    } else if (chart.type === "bar") {
      chart.series[0]?.values.forEach((value, index) => { const row = height / chart.categories.length; context.fillStyle = presentationChartColors[index % presentationChartColors.length]; context.fillRect(padding, padding + index * row + row * .2, Math.max(2, Math.max(0, value) / maximum * width), row * .6); });
    } else {
      chart.series.forEach((series, seriesIndex) => { context.beginPath(); series.values.forEach((value, index) => { const x = padding + (index + .5) * width / chart.categories.length, y = padding + height - Math.max(0, value) / maximum * height; if (!index) context.moveTo(x, y); else context.lineTo(x, y); }); if (chart.type === "area") { context.lineTo(padding + width - width / chart.categories.length / 2, padding + height); context.lineTo(padding + width / chart.categories.length / 2, padding + height); context.closePath(); context.globalAlpha = .18; context.fillStyle = presentationChartColors[seriesIndex % presentationChartColors.length]; context.fill(); context.globalAlpha = 1; } context.strokeStyle = presentationChartColors[seriesIndex % presentationChartColors.length]; context.lineWidth = 6; context.stroke(); });
    }
    context.restore();
  };
  for (const element of slide.elements) {
    if (element.type === "text") { drawText(element.text || "", element); continue; }
    if (element.type === "shape") {
      context.save();
      context.translate(element.x + element.width / 2, element.y + element.height / 2);
      context.rotate(element.rotation * Math.PI / 180);
      context.translate(-element.width / 2, -element.height / 2);
      context.fillStyle = element.fill_color || "#FFFFFF";
      context.strokeStyle = element.stroke_color || "#000000";
      context.lineWidth = element.stroke_width ?? 1;
      tracePresentationShape(context, element.shape || "rectangle", element.width, element.height);
      if (element.shape !== "line") context.fill();
      context.stroke();
      context.restore();
      if (element.text) drawText(element.text, element);
      continue;
    }
    if (element.type === "table" && element.table) {
      context.save(); context.translate(element.x, element.y); const rows = element.table.rows, rowHeight = element.height / rows.length, columns = rows[0].length, columnWidth = element.width / columns;
      context.font = `400 ${Math.max(14, Math.min(28, rowHeight * .35))}px ${content.master.font_family}`; context.textBaseline = "middle";
      rows.forEach((row, rowIndex) => row.forEach((cell, columnIndex) => { context.fillStyle = element.table!.header && rowIndex === 0 ? content.master.accent_color : "#FFFFFF"; context.fillRect(columnIndex * columnWidth, rowIndex * rowHeight, columnWidth, rowHeight); context.strokeStyle = content.master.muted_color; context.strokeRect(columnIndex * columnWidth, rowIndex * rowHeight, columnWidth, rowHeight); context.fillStyle = element.table!.header && rowIndex === 0 ? content.master.background_color : content.master.text_color; context.fillText(cell, columnIndex * columnWidth + 10, rowIndex * rowHeight + rowHeight / 2, columnWidth - 20); })); context.restore(); continue;
    }
    if (element.type === "chart" && element.chart) { drawChart(element, element.chart); continue; }
    if (element.type === "formula") { drawText(element.formula || "", { ...element, text: element.formula, font_weight: "normal", align: "center" }); continue; }
    if (element.type === "code") {
      context.fillStyle = element.fill_color || "#101D19"; context.fillRect(element.x, element.y, element.width, element.height);
      drawText(`${element.language || "text"}\n${element.source || ""}`, { ...element, text: element.source, font_weight: "normal", align: "left" }); continue;
    }
    const asset = element.asset_id ? slide.files[element.asset_id] : undefined;
    if (!asset || !readFile) continue;
    if (element.type === "video") {
      context.fillStyle = "#17221C";
      context.fillRect(element.x, element.y, element.width, element.height);
      context.fillStyle = "#FFFFFF";
      context.font = "700 30px Arial";
      context.textAlign = "center";
      context.fillText(`▶ ${asset.filename}`, element.x + element.width / 2, element.y + element.height / 2, element.width - 40);
      continue;
    }
    const bitmap = await createImageBitmap(await readFile(asset.document_ref));
    const sourceRatio = bitmap.width / bitmap.height, targetRatio = element.width / element.height;
    let width = element.width, height = element.height, x = element.x, y = element.y;
    if (element.fit === "contain") {
      if (sourceRatio > targetRatio) { height = width / sourceRatio; y += (element.height - height) / 2; }
      else { width = height * sourceRatio; x += (element.width - width) / 2; }
    } else if (sourceRatio > targetRatio) {
      const sourceWidth = bitmap.height * targetRatio, sourceX = (bitmap.width - sourceWidth) / 2;
      context.drawImage(bitmap, sourceX, 0, sourceWidth, bitmap.height, x, y, width, height);
      bitmap.close();
      continue;
    } else {
      const sourceHeight = bitmap.width / targetRatio, sourceY = (bitmap.height - sourceHeight) / 2;
      context.drawImage(bitmap, 0, sourceY, bitmap.width, sourceHeight, x, y, width, height);
      bitmap.close();
      continue;
    }
    context.drawImage(bitmap, x, y, width, height);
    bitmap.close();
  }
  if (content.master.footer) {
    context.fillStyle = content.master.muted_color;
    context.font = `400 18px ${content.master.font_family}`;
    context.textAlign = "left";
    context.fillText(content.master.footer, 64, 854, 1200);
  }
  if (content.master.show_slide_number) {
    context.fillStyle = content.master.muted_color;
    context.font = `700 18px ${content.master.font_family}`;
    context.textAlign = "right";
    context.fillText(String(content.slides.findIndex(item => item.id === slide.id) + 1), 1536, 854);
  }
  return canvas;
}

async function exportPresentationPDF(content: PresentationContent, title: string, readFile?: (reference: string) => Promise<Blob>) {
  const { jsPDF } = await import("jspdf");
  const pdf = new jsPDF({ orientation: "landscape", unit: "px", format: [presentationCanvasWidth, presentationCanvasHeight], hotfixes: ["px_scaling"] });
  for (let index = 0; index < content.slides.length; index++) {
    if (index) pdf.addPage([presentationCanvasWidth, presentationCanvasHeight], "landscape");
    const canvas = await renderSlideCanvas(content, content.slides[index], readFile);
    pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, presentationCanvasWidth, presentationCanvasHeight, undefined, "FAST");
  }
  pdf.save(safeDocumentFilename(title, "pdf"));
}

async function exportPresentationPPTX(content: PresentationContent, title: string, readFile?: (reference: string) => Promise<Blob>) {
  const { default: PptxGenJS } = await import("pptxgenjs");
  const pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_WIDE";
  pptx.author = "Domainry Knowledge";
  pptx.company = "Domainry";
  pptx.subject = "Knowledge presentation";
  pptx.title = title;
  const masterObjects: NonNullable<Parameters<PptxGenJS["defineSlideMaster"]>[0]["objects"]> = [];
  if (content.master.footer) masterObjects.push({ text: { text: content.master.footer, options: { x: .55, y: 7.12, w: 10.8, h: .2, fontFace: content.master.font_family, fontSize: 9, color: hex(content.master.muted_color), margin: 0 } } });
  pptx.defineSlideMaster({
    title: "KNOWLEDGE_MASTER",
    background: { color: hex(content.master.background_color) },
    objects: masterObjects,
    slideNumber: content.master.show_slide_number ? { x: 12.25, y: 7.08, w: .5, h: .22, fontFace: content.master.font_family, fontSize: 9, color: hex(content.master.muted_color), align: "right", margin: 0 } : undefined,
  });
  const scale = 120;
  for (const source of content.slides) {
    const slide = pptx.addSlide({ masterName: "KNOWLEDGE_MASTER" });
    if (source.background_color) slide.background = { color: hex(source.background_color) };
    for (const item of source.elements) {
      const position = { x: item.x / scale, y: item.y / scale, w: item.width / scale, h: item.height / scale, rotate: item.rotation };
      if (item.type === "text") {
        slide.addText(item.text || "", { ...position, fontFace: content.master.font_family, fontSize: (item.font_size || 28) * .75, bold: item.font_weight === "bold", color: hex(item.color || content.master.text_color), align: item.align, valign: "middle", margin: 0, breakLine: false });
      } else if (item.type === "shape") {
        const shape = item.shape === "rounded_rectangle" ? pptx.ShapeType.roundRect
          : item.shape === "ellipse" ? pptx.ShapeType.ellipse
            : item.shape === "triangle" ? pptx.ShapeType.triangle
              : item.shape === "diamond" ? pptx.ShapeType.diamond
                : item.shape === "hexagon" ? pptx.ShapeType.hexagon
                  : item.shape === "star" ? pptx.ShapeType.star5
                    : item.shape === "arrow_right" ? pptx.ShapeType.rightArrow
                      : item.shape === "callout" ? pptx.ShapeType.wedgeRectCallout
                        : item.shape === "line" ? pptx.ShapeType.line
                          : pptx.ShapeType.rect;
        slide.addShape(shape, { ...position, fill: { color: hex(item.fill_color || "#FFFFFF"), transparency: item.shape === "line" ? 100 : 0 }, line: { color: hex(item.stroke_color || "#000000"), width: item.stroke_width ?? 1 } });
        if (item.text) slide.addText(item.text, { ...position, fontFace: content.master.font_family, fontSize: (item.font_size || 28) * .75, bold: item.font_weight === "bold", color: hex(item.color || content.master.text_color), align: item.align, valign: "middle", margin: 4 });
      } else if (item.type === "table" && item.table) {
        const rows = item.table.rows.map(row => row.map(text => ({ text })));
        slide.addTable(rows, { ...position, border: { type: "solid", color: hex(content.master.muted_color), pt: 1 }, fill: { color: hex(source.background_color || content.master.background_color) }, color: hex(content.master.text_color), fontFace: content.master.font_family, fontSize: 14, bold: false, margin: 0.06, autoPage: false, rowH: position.h / item.table.rows.length });
        if (item.table.header) slide.addTable([rows[0]], { ...position, h: position.h / item.table.rows.length, border: { type: "solid", color: hex(content.master.accent_color), pt: 1 }, fill: { color: hex(content.master.accent_color) }, color: hex(content.master.background_color), fontFace: content.master.font_family, fontSize: 14, bold: true, margin: 0.06, autoPage: false });
      } else if (item.type === "chart" && item.chart) {
        const type = item.chart.type === "donut" ? pptx.ChartType.doughnut : item.chart.type === "pie" ? pptx.ChartType.pie : item.chart.type === "line" ? pptx.ChartType.line : item.chart.type === "area" ? pptx.ChartType.area : pptx.ChartType.bar;
        slide.addChart(type, item.chart.series.map(series => ({ name: series.name, labels: item.chart!.categories, values: series.values })), { ...position, showLegend: item.chart.series.length > 1, showTitle: false, showValue: item.chart.type === "pie" || item.chart.type === "donut", showSerName: item.chart.type === "pie" || item.chart.type === "donut", chartColors: presentationChartColors.map(hex), ...(item.chart.type === "column" ? { barDir: "col" as const } : item.chart.type === "bar" ? { barDir: "bar" as const } : {}) });
      } else if (item.type === "formula") {
        slide.addText(item.formula || "", { ...position, fontFace: "Georgia", fontSize: (item.font_size || 40) * .75, italic: true, color: hex(item.color || content.master.text_color), align: "center", valign: "middle", margin: 0.08 });
      } else if (item.type === "code") {
        slide.addText(`${item.language || "text"}\n${item.source || ""}`, { ...position, fontFace: "Courier New", fontSize: (item.font_size || 24) * .75, color: hex(item.color || "#FFFFFF"), fill: { color: hex(item.fill_color || "#101D19") }, margin: 0.12, breakLine: false, valign: "top" });
      } else {
        const asset = item.asset_id ? source.files[item.asset_id] : undefined;
        if (!asset || !readFile) continue;
        const data = await blobDataURL(await readFile(asset.document_ref));
        if (item.type === "image") slide.addImage({ data, sizing: { type: item.fit === "contain" ? "contain" : "cover", x: position.x, y: position.y, w: position.w, h: position.h }, rotate: item.rotation });
        else slide.addMedia({ type: "video", data, extn: asset.mime_type === "video/webm" ? "webm" : "mp4", ...position });
      }
    }
    if (source.notes.trim()) slide.addNotes(source.notes);
  }
  await pptx.writeFile({ fileName: safeDocumentFilename(title, "pptx"), compression: true });
}

function PresentationSlideshow({ content, initial, readFile, onClose }: { content: PresentationContent; initial: number; readFile?: (reference: string) => Promise<Blob>; onClose(): void }) {
  const [index, setIndex] = useState(initial);
  useEffect(() => {
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight" || event.key === "PageDown") setIndex(value => Math.min(content.slides.length - 1, value + 1));
      if (event.key === "ArrowLeft" || event.key === "PageUp") setIndex(value => Math.max(0, value - 1));
    };
    window.addEventListener("keydown", keydown);
    return () => window.removeEventListener("keydown", keydown);
  }, [content.slides.length, onClose]);
  return createPortal(<div className="presentation-slideshow" role="dialog" aria-modal="true" aria-label={kt("knowledge.auto.1bc0e44d9e0e1acc")}>
    <div className="presentation-slideshow-slide"><PresentationSlideView content={content} slide={content.slides[index]} readFile={readFile} /></div>
    <div className="presentation-slideshow-controls">
      <Button disabled={index === 0} onClick={() => setIndex(value => value - 1)}><ChevronUp size={16} />{kt("knowledge.auto.bcf200709dbc7ff4")}</Button>
      <span>{index + 1} / {content.slides.length}</span>
      <Button disabled={index === content.slides.length - 1} onClick={() => setIndex(value => value + 1)}>{kt("knowledge.auto.dcd4eb0273699416")}<ChevronDown size={16} /></Button>
      <Button title={kt("knowledge.auto.7b8c90c6914c5c0d")} aria-label={kt("knowledge.auto.7b8c90c6914c5c0d")} onClick={onClose}><X size={17} /></Button>
    </div>
  </div>, document.body);
}

function MasterInspector({ master, onChange }: { master: PresentationMaster; onChange(value: PresentationMaster): void }) {
  const color = (key: keyof Pick<PresentationMaster, "background_color" | "text_color" | "accent_color" | "muted_color">, label: string) => <label><span>{label}</span><input type="color" value={master[key]} onChange={event => onChange({ ...master, [key]: event.target.value.toUpperCase() })} /></label>;
  return <div className="presentation-master-inspector">
    <h4>{kt("knowledge.auto.3d1e4467afcece19")}</h4>
    <p>{kt("knowledge.auto.bcea48901a4853c7")}</p>
    {color("background_color", kt("knowledge.auto.f4b669c55756180e"))}{color("text_color", kt("knowledge.auto.d661c3d96d53ebc0"))}{color("accent_color", kt("knowledge.auto.d5ae79edec852f2d"))}{color("muted_color", kt("knowledge.auto.40d33aa115c4504d"))}
    <label className="is-wide"><span>{kt("knowledge.auto.078838da4218490b")}</span><Select value={master.font_family} onChange={event => onChange({ ...master, font_family: event.target.value })}><option>Arial</option><option>Aptos</option><option>Helvetica</option><option>Georgia</option><option>Times New Roman</option></Select></label>
    <label className="is-wide"><span>{kt("knowledge.auto.db7eeb8de478f255")}</span><input maxLength={512} value={master.footer} onChange={event => onChange({ ...master, footer: event.target.value })} /></label>
    <label className="is-check"><input type="checkbox" checked={master.show_slide_number} onChange={event => onChange({ ...master, show_slide_number: event.target.checked })} /><span>{kt("knowledge.auto.239369850b80b20c")}</span></label>
  </div>;
}

function ElementInspector({ element, onChange, onDelete }: { element: PresentationElement; onChange(value: PresentationElement): void; onDelete(): void }) {
  const number = (key: "x" | "y" | "width" | "height" | "rotation", label: string, min: number, max: number) => <label><span>{label}</span><input type="number" min={min} max={max} value={element[key]} onChange={event => onChange({ ...element, [key]: Math.max(min, Math.min(max, Number(event.target.value) || 0)) })} /></label>;
  return <div className="presentation-element-inspector">
    <header><div><h4>{kt("knowledge.auto.a1c1675f5df836a8")}</h4><small>{presentationElementLabel(element.type)}</small></div><button type="button" title={kt("knowledge.auto.2c98462c114e82b8")} onClick={onDelete}><Trash2 size={15} /></button></header>
    <div className="presentation-inspector-grid">{number("x", "X", 0, presentationCanvasWidth)}{number("y", "Y", 0, presentationCanvasHeight)}{number("width", kt("knowledge.auto.8dd966ad496e83c7"), 1, presentationCanvasWidth)}{number("height", kt("knowledge.auto.b1c27820fec23edb"), 1, presentationCanvasHeight)}{number("rotation", kt("knowledge.auto.68eb90fa809e72cc"), -360, 360)}</div>
    {(element.type === "text" || element.type === "shape") && <>
      <label className="is-wide"><span>{kt("knowledge.auto.7a688306423bec17")}</span><textarea value={element.text || ""} onChange={event => onChange({ ...element, text: event.target.value })} /></label>
      <div className="presentation-inspector-grid"><label><span>{kt("knowledge.auto.f71561b5af0abced")}</span><input type="number" min={8} max={240} value={element.font_size} onChange={event => onChange({ ...element, font_size: Number(event.target.value) || 8 })} /></label><label><span>{kt("knowledge.auto.c69ead895a515fc9")}</span><Select value={element.font_weight} onChange={event => onChange({ ...element, font_weight: event.target.value as "normal" | "bold" })}><option value="normal">{kt("knowledge.auto.40fae00b7c6d8ac0")}</option><option value="bold">{kt("knowledge.auto.5ceac65ed8ee2ca6")}</option></Select></label><label><span>{kt("knowledge.auto.a12ecd7f96912af0")}</span><input type="color" value={element.color} onChange={event => onChange({ ...element, color: event.target.value.toUpperCase() })} /></label></div>
      <div className="presentation-align-control" role="group" aria-label={kt("knowledge.auto.2527727872202c15")}><button type="button" aria-pressed={element.align === "left"} onClick={() => onChange({ ...element, align: "left" })}><AlignLeft size={15} /></button><button type="button" aria-pressed={element.align === "center"} onClick={() => onChange({ ...element, align: "center" })}><AlignCenter size={15} /></button><button type="button" aria-pressed={element.align === "right"} onClick={() => onChange({ ...element, align: "right" })}><AlignRight size={15} /></button></div>
    </>}
    {element.type === "shape" && <div className="presentation-inspector-grid"><label><span>{kt("knowledge.auto.c2f71c1b10ef9d80")}</span><Select value={element.shape} onChange={event => onChange({ ...element, shape: event.target.value as PresentationShapeType })}>{presentationShapeTypes.map(shape => <option key={shape} value={shape}>{presentationShapeLabels[shape]}</option>)}</Select></label><label><span>{kt("knowledge.auto.05fb7cba476bd2e9")}</span><input type="color" value={element.fill_color} onChange={event => onChange({ ...element, fill_color: event.target.value.toUpperCase() })} /></label><label><span>{kt("knowledge.auto.0053783298298e9d")}</span><input type="color" value={element.stroke_color} onChange={event => onChange({ ...element, stroke_color: event.target.value.toUpperCase() })} /></label></div>}
    {(element.type === "image" || element.type === "video") && <label className="is-wide"><span>{kt("knowledge.auto.7905e49e2e8b65a5")}</span><Select value={element.fit} onChange={event => onChange({ ...element, fit: event.target.value as "contain" | "cover" })}><option value="contain">{kt("knowledge.auto.530aa02103692b72")}</option><option value="cover">{kt("knowledge.auto.60d08aa3cb50cb8a")}</option></Select></label>}
    {element.type === "table" && element.table && <><label className="is-check"><input type="checkbox" checked={element.table.header} onChange={event => onChange({ ...element, table: { ...element.table!, header: event.target.checked } })} /><span>{kt("knowledge.auto.cd1e78750ab5a443")}</span></label><label className="is-wide"><span>{kt("knowledge.auto.062d5a6d84726d8b")}</span><textarea rows={10} value={element.table.rows.map(row => row.join("\t")).join("\n")} onChange={event => { const rows = event.target.value.split("\n").slice(0, 50).map(row => row.split("\t").slice(0, 20)), width = Math.max(1, ...rows.map(row => row.length)); onChange({ ...element, table: { ...element.table!, rows: rows.map(row => [...row, ...Array(Math.max(0, width - row.length)).fill("")]) } }); }} /></label></>}
    {element.type === "chart" && element.chart && <><label className="is-wide"><span>{kt("knowledge.auto.52fe98551232b10f")}</span><Select value={element.chart.type} onChange={event => onChange({ ...element, chart: { ...element.chart!, type: event.target.value as PresentationChartType } })}>{presentationChartTypes.map(type => <option key={type} value={type}>{presentationChartLabels[type]}</option>)}</Select></label><label className="is-wide"><span>{kt("knowledge.auto.cbfa8a7b7cee0c9c")}</span><input value={element.chart.categories.join(",")} onChange={event => { const categories = event.target.value.split(",").map(value => value.trim()).filter(Boolean).slice(0, 50); onChange({ ...element, chart: { ...element.chart!, categories, series: element.chart!.series.map(series => ({ ...series, values: categories.map((_, index) => series.values[index] || 0) })) } }); }} /></label><label className="is-wide"><span>{kt("knowledge.auto.94e051b68419f74e")}</span><textarea rows={8} value={element.chart.series.map(series => `${series.name}:${series.values.join(",")}`).join("\n")} onChange={event => { const series = event.target.value.split("\n").slice(0, 12).map((row, index) => { const separator = row.indexOf(":"); const name = (separator >= 0 ? row.slice(0, separator) : ktf("knowledge.auto.8fac7b189e32a496", { value0: index + 1 })).trim() || ktf("knowledge.auto.8fac7b189e32a496", { value0: index + 1 }), raw = separator >= 0 ? row.slice(separator + 1) : row; return { name, values: element.chart!.categories.map((_, valueIndex) => { const value = Number(raw.split(",")[valueIndex]?.trim() || 0); return Number.isFinite(value) ? value : 0; }) }; }).filter(item => item.name); onChange({ ...element, chart: { ...element.chart!, series: series.length ? series : [{ name: kt("knowledge.auto.34b3cfaa3c77e987"), values: element.chart!.categories.map(() => 0) }] } }); }} /></label></>}
    {element.type === "formula" && <><label className="is-wide"><span>{kt("knowledge.auto.7e202a3add63fbb1")}</span><textarea rows={6} value={element.formula || ""} onChange={event => onChange({ ...element, formula: event.target.value })} /></label><div className="presentation-inspector-grid"><label><span>{kt("knowledge.auto.f71561b5af0abced")}</span><input type="number" min={8} max={240} value={element.font_size} onChange={event => onChange({ ...element, font_size: Number(event.target.value) || 8 })} /></label><label><span>{kt("knowledge.auto.070a8016fcc3dffb")}</span><input type="color" value={element.color} onChange={event => onChange({ ...element, color: event.target.value.toUpperCase() })} /></label></div></>}
    {element.type === "code" && <><div className="presentation-inspector-grid"><label><span>{kt("knowledge.auto.9f6fee1aba17a565")}</span><Select value={element.language} onChange={event => onChange({ ...element, language: event.target.value })}><option value="javascript">JavaScript</option><option value="typescript">TypeScript</option><option value="python">Python</option><option value="go">Go</option><option value="java">Java</option><option value="sql">SQL</option><option value="shell">Shell</option><option value="json">JSON</option></Select></label><label><span>{kt("knowledge.auto.f71561b5af0abced")}</span><input type="number" min={8} max={120} value={element.font_size} onChange={event => onChange({ ...element, font_size: Number(event.target.value) || 8 })} /></label><label><span>{kt("knowledge.auto.f4b669c55756180e")}</span><input type="color" value={element.fill_color} onChange={event => onChange({ ...element, fill_color: event.target.value.toUpperCase() })} /></label></div><label className="is-wide"><span>{kt("knowledge.auto.e6f04ffbaa424001")}</span><textarea rows={12} value={element.source || ""} onChange={event => onChange({ ...element, source: event.target.value })} /></label></>}
  </div>;
}

export function PresentationEditor({ body, readOnly = false, documentTitle = kt("knowledge.auto.dc0e764313122d2d"), initialBlockID, uploadFile, fileUploadsEnabled, readFile, pageActionHost, authorizeContentAction, onActionFeedback, onChange }: KnowledgeEditorProps) {
  const parsed = useMemo(() => parsePresentationContent(body), [body]);
  const [content, setContent] = useState(parsed);
  const contentRef = useRef(content);
  const [selectedSlideID, setSelectedSlideID] = useState(parsed.slides[0].id);
  const [selectedElementID, setSelectedElementID] = useState("");
  const [slideshow, setSlideshow] = useState(false);
  const [shapeMenuOpen, setShapeMenuOpen] = useState(false);
  const [exporting, setExporting] = useState("");
  const shapePickerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ id: string; startX: number; startY: number; x: number; y: number; stageWidth: number; stageHeight: number } | null>(null);
  useEffect(() => {
    setContent(parsed);
    contentRef.current = parsed;
    setSelectedSlideID(currentSlideID => parsed.slides.some(item => item.id === currentSlideID) ? currentSlideID : parsed.slides[0].id);
  }, [parsed]);
  useEffect(() => {
    if (!initialBlockID) return;
    const slide = contentRef.current.slides.find(item => item.id === initialBlockID);
    if (slide) {
      setSelectedSlideID(slide.id);
      setSelectedElementID("");
      return;
    }
    for (const item of contentRef.current.slides) {
      if (!item.elements.some(element => element.id === initialBlockID)) continue;
      setSelectedSlideID(item.id);
      setSelectedElementID(initialBlockID);
      return;
    }
  }, [initialBlockID]);
  useEffect(() => {
    if (!shapeMenuOpen) return;
    const dismiss = (event: PointerEvent) => {
      if (!shapePickerRef.current?.contains(event.target as Node)) setShapeMenuOpen(false);
    };
    const dismissWithKeyboard = (event: KeyboardEvent) => {
      if (event.key === "Escape") setShapeMenuOpen(false);
    };
    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("keydown", dismissWithKeyboard);
    return () => {
      document.removeEventListener("pointerdown", dismiss);
      document.removeEventListener("keydown", dismissWithKeyboard);
    };
  }, [shapeMenuOpen]);
  const selectedIndex = Math.max(0, content.slides.findIndex(item => item.id === selectedSlideID));
  const selectedSlide = content.slides[selectedIndex];
  const selectedElement = selectedSlide.elements.find(item => item.id === selectedElementID);
  const apply = (next: PresentationContent, persist = true) => {
    contentRef.current = next;
    setContent(next);
    if (persist) onChange(canonicalPresentationContent(next));
  };
  const updateSlide = (nextSlide: PresentationSlide, persist = true) => apply({ ...contentRef.current, slides: contentRef.current.slides.map(item => item.id === nextSlide.id ? nextSlide : item) }, persist);
  const updateElement = (nextElement: PresentationElement, persist = true) => updateSlide({ ...selectedSlide, elements: selectedSlide.elements.map(item => item.id === nextElement.id ? nextElement : item) }, persist);
  const addSlide = () => {
    const id = newID("slide"), next = createPresentationSlide(id, content.slides.length, "title_content", content.master);
    setSelectedSlideID(id); setSelectedElementID(""); apply({ ...content, slides: [...content.slides, next] });
  };
  const duplicateSlide = () => {
    const id = newID("slide"), assetIDs = new Map<string, string>();
    const files = Object.fromEntries(Object.values(selectedSlide.files).map(asset => { const nextID = newID("asset"); assetIDs.set(asset.id, nextID); return [nextID, { ...asset, id: nextID }]; }));
    const clone: PresentationSlide = { ...selectedSlide, id, title: ktf("knowledge.auto.6a5e2aa1a875c415", { value0: selectedSlide.title }), files, elements: selectedSlide.elements.map(item => ({ ...item, id: newID("element"), asset_id: item.asset_id ? assetIDs.get(item.asset_id) : undefined })) };
    const slides = [...content.slides]; slides.splice(selectedIndex + 1, 0, clone); setSelectedSlideID(id); setSelectedElementID(""); apply({ ...content, slides });
  };
  const removeSlide = () => {
    if (content.slides.length === 1) return;
    const slides = content.slides.filter(item => item.id !== selectedSlide.id), nextIndex = Math.max(0, selectedIndex - 1);
    setSelectedSlideID(slides[nextIndex].id); setSelectedElementID(""); apply({ ...content, slides });
  };
  const moveSlide = (offset: number) => {
    const nextIndex = selectedIndex + offset;
    if (nextIndex < 0 || nextIndex >= content.slides.length) return;
    const slides = [...content.slides], [slide] = slides.splice(selectedIndex, 1); slides.splice(nextIndex, 0, slide); apply({ ...content, slides });
  };
  const setLayout = (layout: PresentationLayout) => {
    if (selectedSlide.elements.length && !window.confirm(kt("knowledge.auto.4764a7a7713b4879"))) return;
    setSelectedElementID(""); updateSlide({ ...selectedSlide, layout, files: {}, elements: presentationLayoutElements(selectedSlide.id, layout, content.master) });
  };
  const addText = () => {
    const item: PresentationElement = { id: newID("text"), type: "text", x: 220, y: 270, width: 1160, height: 180, rotation: 0, text: kt("knowledge.auto.22d0f8c8ee913aa7"), font_size: 42, font_weight: "normal", color: content.master.text_color, align: "left" };
    setSelectedElementID(item.id); updateSlide({ ...selectedSlide, elements: [...selectedSlide.elements, item] });
  };
  const addShape = (shape: PresentationShapeType) => {
    const line = shape === "line";
    const item: PresentationElement = { id: newID("shape"), type: "shape", x: 520, y: line ? 420 : 300, width: 560, height: line ? 40 : 260, rotation: 0, shape, fill_color: content.master.accent_color, stroke_color: content.master.accent_color, stroke_width: 2, text: "", font_size: 32, font_weight: "normal", color: content.master.background_color, align: "center" };
    setShapeMenuOpen(false);
    setSelectedElementID(item.id); updateSlide({ ...selectedSlide, elements: [...selectedSlide.elements, item] });
  };
  const addTable = () => {
    const item: PresentationElement = { id: newID("table"), type: "table", x: 260, y: 230, width: 1080, height: 430, rotation: 0, table: { header: true, rows: [[kt("knowledge.auto.79f326be4409d51f"), kt("knowledge.auto.a525346277ed54bd"), kt("knowledge.auto.6320b4a8722a851f")], [kt("knowledge.auto.a3952e8c36ca4cef"), "Alice", kt("knowledge.auto.dc9591e56d502b43")], [kt("knowledge.auto.b28b284d5bf8053c"), "Bob", kt("knowledge.auto.5b715411b1f99742")]] } };
    setSelectedElementID(item.id); updateSlide({ ...selectedSlide, elements: [...selectedSlide.elements, item] });
  };
  const addChart = () => {
    const item: PresentationElement = { id: newID("chart"), type: "chart", x: 260, y: 210, width: 1080, height: 500, rotation: 0, chart: { type: "column", categories: [kt("knowledge.auto.5fbab6f796a2917a"), kt("knowledge.auto.0a64cbfe42ef0598"), kt("knowledge.auto.d13a5e854192559f"), kt("knowledge.auto.687468619f6ba3ac")], series: [{ name: kt("knowledge.auto.57060c88a36bf3d0"), values: [42, 58, 66, 82] }, { name: kt("knowledge.auto.e0ae9a3c77ae781d"), values: [38, 61, 72, 88] }] } };
    setSelectedElementID(item.id); updateSlide({ ...selectedSlide, elements: [...selectedSlide.elements, item] });
  };
  const addFormula = () => {
    const item: PresentationElement = { id: newID("formula"), type: "formula", x: 330, y: 310, width: 940, height: 250, rotation: 0, formula: "E = mc^2", font_size: 56, color: content.master.text_color };
    setSelectedElementID(item.id); updateSlide({ ...selectedSlide, elements: [...selectedSlide.elements, item] });
  };
  const addCode = () => {
    const item: PresentationElement = { id: newID("code"), type: "code", x: 260, y: 190, width: 1080, height: 530, rotation: 0, language: "typescript", source: "const insight = data.map(analyze);\nreturn insight.filter(Boolean);", font_size: 24, color: "#E9F5EF", fill_color: "#101D19" };
    setSelectedElementID(item.id); updateSlide({ ...selectedSlide, elements: [...selectedSlide.elements, item] });
  };
  const addMedia = async (file: File) => {
    if (!uploadFile || !fileUploadsEnabled) { onActionFeedback?.(kt("knowledge.auto.afcc18d93c9ee1d0")); return; }
    const image = file.type === "image/png" || file.type === "image/jpeg" || file.type === "image/webp" || file.type === "image/gif";
    const video = file.type === "video/mp4" || file.type === "video/webm";
    if (!image && !video) { onActionFeedback?.(kt("knowledge.auto.a6962e9cf730492d")); return; }
    try {
      const reference = uploadedDocumentReference(await uploadFile(file));
      if (!reference) throw Error(kt("knowledge.auto.8572e3553882d66f"));
      const assetID = newID("asset"), elementID = newID(image ? "image" : "video");
      const asset: PresentationAsset = { id: assetID, mime_type: file.type as PresentationAsset["mime_type"], document_ref: reference, filename: file.name };
      const item: PresentationElement = { id: elementID, type: image ? "image" : "video", x: 240, y: 210, width: 1120, height: 560, rotation: 0, asset_id: assetID, fit: "contain" };
      setSelectedElementID(elementID); updateSlide({ ...selectedSlide, files: { ...selectedSlide.files, [assetID]: asset }, elements: [...selectedSlide.elements, item] });
    } catch (failure) { onActionFeedback?.(failure instanceof Error ? failure.message : kt("knowledge.auto.511c04e3a3a785fb")); }
  };
  const removeElement = () => {
    if (!selectedElement) return;
    const files = { ...selectedSlide.files };
    if (selectedElement.asset_id) delete files[selectedElement.asset_id];
    updateSlide({ ...selectedSlide, files, elements: selectedSlide.elements.filter(item => item.id !== selectedElement.id) });
    setSelectedElementID("");
  };
  const exportFile = async (kind: "pdf" | "pptx") => {
    setExporting(kind);
    try {
      if (!authorizeContentAction) throw Error(kt("knowledge.auto.5838a06d4990c165"));
      await authorizeContentAction(kind === "pdf" ? "print" : "export");
      if (kind === "pdf") await exportPresentationPDF(contentRef.current, documentTitle, readFile);
      else await exportPresentationPPTX(contentRef.current, documentTitle, readFile);
      onActionFeedback?.(ktf("knowledge.auto.5f6eb852de0a1889", { value0: kind.toUpperCase() }));
    } catch (failure) { onActionFeedback?.(failure instanceof Error ? failure.message : kt("knowledge.auto.fa82812de07b5215")); }
    finally { setExporting(""); }
  };
  const handleElementPointerDown = (event: React.PointerEvent, element: PresentationElement) => {
    if (readOnly || event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    const stage = event.currentTarget.parentElement?.getBoundingClientRect();
    if (!stage) return;
    setSelectedElementID(element.id);
    dragRef.current = { id: element.id, startX: event.clientX, startY: event.clientY, x: element.x, y: element.y, stageWidth: stage.width, stageHeight: stage.height };
  };
  const handlePointerMove = (event: React.PointerEvent) => {
    const drag = dragRef.current;
    if (!drag) return;
    const currentSlide = contentRef.current.slides.find(item => item.id === selectedSlideID);
    const item = currentSlide?.elements.find(child => child.id === drag.id);
    if (!currentSlide || !item) return;
    const x = Math.max(0, Math.min(presentationCanvasWidth - item.width, drag.x + (event.clientX - drag.startX) / drag.stageWidth * presentationCanvasWidth));
    const y = Math.max(0, Math.min(presentationCanvasHeight - item.height, drag.y + (event.clientY - drag.startY) / drag.stageHeight * presentationCanvasHeight));
    updateElement({ ...item, x: Math.round(x), y: Math.round(y) }, false);
  };
  const handlePointerUp = () => {
    if (!dragRef.current) return;
    dragRef.current = null;
    onChange(canonicalPresentationContent(contentRef.current));
  };

  return <div className="knowledge-open-editor knowledge-presentation-editor">
    {authorizeContentAction && <PageActionPortal host={pageActionHost}>
      <Button title={kt("knowledge.auto.e42c8735ec9f56e3")} disabled={Boolean(exporting)} onClick={() => void exportFile("pdf")}><FileDown size={15} />PDF</Button>
      <Button title={kt("knowledge.auto.ed957a48cd8bee1b")} disabled={Boolean(exporting)} onClick={() => void exportFile("pptx")}><Maximize2 size={15} />PPTX</Button>
    </PageActionPortal>}
    <div className="presentation-toolbar" aria-label={kt("knowledge.auto.b33080b4902a6b47")}>
      {!readOnly && <>
        <label><span>{kt("knowledge.auto.788db1cfec2a3db5")}</span><Select value={content.theme} onChange={event => apply(applyPresentationTheme(content, event.target.value as PresentationThemeID))}>{Object.entries(presentationThemes).map(([id, theme]) => <option key={id} value={id}>{theme.label}</option>)}</Select></label>
        <label><span>{kt("knowledge.auto.d9c446642799abb0")}</span><Select value={selectedSlide.layout} onChange={event => setLayout(event.target.value as PresentationLayout)}>{presentationLayouts.map(layout => <option key={layout.id} value={layout.id}>{layout.label}</option>)}</Select></label>
        <span className="presentation-toolbar-divider" />
        <Button title={kt("knowledge.auto.44f709e7d4df39ec")} onClick={addText}><Type size={15} />{kt("knowledge.auto.dd81861811e57bf7")}</Button>
        <div className="presentation-shape-picker" ref={shapePickerRef}>
          <Button title={kt("knowledge.auto.972334a1bbb66c44")} aria-expanded={shapeMenuOpen} aria-haspopup="menu" onClick={() => setShapeMenuOpen(value => !value)}><RectangleHorizontal size={15} />{kt("knowledge.auto.c2f71c1b10ef9d80")}<ChevronDown size={13} /></Button>
          {shapeMenuOpen && <div className="presentation-shape-menu" role="menu" aria-label={kt("knowledge.auto.9372c61e98b06a84")}>
            {presentationShapeTypes.map(shape => <button type="button" role="menuitem" title={ktf("knowledge.auto.b4740513958cc42d", { value0: presentationShapeLabels[shape] })} key={shape} onClick={() => addShape(shape)}><span><PresentationShapeGraphic shape={shape} fill="var(--knowledge-surface-tint)" stroke="currentColor" strokeWidth={2} /></span><b>{presentationShapeLabels[shape]}</b></button>)}
          </div>}
        </div>
        <Button title={kt("knowledge.auto.43f006bd439207c4")} onClick={addTable}><Table2 size={15} />{kt("knowledge.auto.22d9e7c54b88cacd")}</Button>
        <Button title={kt("knowledge.auto.8c2492d08f1a6bcb")} onClick={addChart}><BarChart3 size={15} />{kt("knowledge.auto.8cb443ab83797881")}</Button>
        <Button title={kt("knowledge.auto.85fbe03102bdb89f")} onClick={addFormula}><Sigma size={15} />{kt("knowledge.auto.f3fccedacbcebbfa")}</Button>
        <Button title={kt("knowledge.auto.ebd11b2cabe9972c")} onClick={addCode}><Braces size={15} />{kt("knowledge.auto.e6f04ffbaa424001")}</Button>
        <label className="knowledge-button presentation-upload"><ImagePlus size={15} />{kt("knowledge.auto.fa33e10009759859")}<input type="file" accept="image/png,image/jpeg,image/webp,image/gif,video/mp4,video/webm" onChange={event => { const file = event.target.files?.[0]; event.currentTarget.value = ""; if (file) void addMedia(file); }} /></label>
      </>}
      <span className="presentation-toolbar-spacer" />
      <Button title={kt("knowledge.auto.d4cfe0d759e70a47")} onClick={() => setSlideshow(true)}><MonitorPlay size={15} />{kt("knowledge.auto.d4cfe0d759e70a47")}</Button>
    </div>
    <div className={`presentation-workspace${readOnly ? " is-readonly" : ""}`}>
      <aside className="presentation-slide-list" aria-label={kt("knowledge.auto.5d32c633a3d8db80")}>
        {content.slides.map((slide, index) => <button type="button" aria-current={slide.id === selectedSlide.id ? "true" : undefined} key={slide.id} onClick={() => { setSelectedSlideID(slide.id); setSelectedElementID(""); }}><span>{index + 1}</span><div><PresentationSlideView content={content} slide={slide} readFile={readFile} thumbnail /><strong>{slide.title}</strong></div></button>)}
        {!readOnly && <Button className="presentation-add-slide" onClick={addSlide}><Plus size={15} />{kt("knowledge.auto.1f20b204fc730c48")}</Button>}
      </aside>
      <main className="presentation-stage-column">
        {!readOnly && <div className="presentation-slide-meta"><input aria-label={kt("knowledge.auto.0061a4445f629e6a")} maxLength={512} value={selectedSlide.title} onChange={event => updateSlide({ ...selectedSlide, title: event.target.value || kt("knowledge.auto.dc0e764313122d2d") })} /><div><button type="button" title={kt("knowledge.auto.31c0ffad904b4d78")} disabled={selectedIndex === 0} onClick={() => moveSlide(-1)}><ChevronUp size={15} /></button><button type="button" title={kt("knowledge.auto.9751d0cd0e5275c4")} disabled={selectedIndex === content.slides.length - 1} onClick={() => moveSlide(1)}><ChevronDown size={15} /></button><button type="button" title={kt("knowledge.auto.7ff515869fd0fe78")} onClick={duplicateSlide}><Copy size={15} /></button><button type="button" title={kt("knowledge.auto.0f2b14d9932a519c")} disabled={content.slides.length === 1} onClick={removeSlide}><Trash2 size={15} /></button></div></div>}
        <div className="presentation-stage" onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerCancel={handlePointerUp}><PresentationSlideView content={content} slide={selectedSlide} selectedElementID={selectedElementID} readOnly={readOnly} readFile={readFile} onSelectElement={setSelectedElementID} onElementPointerDown={handleElementPointerDown} /></div>
        {!readOnly && <label className="presentation-speaker-notes"><span>{kt("knowledge.auto.2b02cdb32d5f6500")}</span><textarea placeholder={kt("knowledge.auto.b45200c0e6f7f0c0")} value={selectedSlide.notes} onChange={event => updateSlide({ ...selectedSlide, notes: event.target.value })} /></label>}
      </main>
      {!readOnly && <aside className="presentation-inspector">{selectedElement ? <ElementInspector element={selectedElement} onChange={updateElement} onDelete={removeElement} /> : <MasterInspector master={content.master} onChange={master => apply({ ...content, master })} />}</aside>}
    </div>
    {slideshow && <PresentationSlideshow content={content} initial={selectedIndex} readFile={readFile} onClose={() => setSlideshow(false)} />}
  </div>;
}

export default PresentationEditor;
