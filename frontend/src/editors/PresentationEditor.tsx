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
  rectangle: "矩形",
  rounded_rectangle: "圆角矩形",
  ellipse: "椭圆",
  triangle: "三角形",
  diamond: "菱形",
  hexagon: "六边形",
  star: "星形",
  arrow_right: "右箭头",
  callout: "标注气泡",
  line: "直线",
};
const presentationChartLabels: Record<PresentationChartType, string> = { column: "柱状图", bar: "条形图", line: "折线图", area: "面积图", pie: "饼图", donut: "环形图" };
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
    reader.onerror = () => reject(reader.error || Error("媒体读取失败"));
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
  if (failed) return <span className="presentation-media-state">媒体不可用</span>;
  if (!url) return <span className="presentation-media-state">正在加载…</span>;
  if (asset.mime_type.startsWith("video/")) return thumbnail ? <span className="presentation-video-thumbnail"><Video size={20} />视频</span> : <video src={url} controls />;
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
  return ({ text: "文本", shape: "形状", image: "图片", video: "视频", table: "表格", chart: "图表", formula: "公式", code: "代码" } as const)[type];
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
  return asset ? <div className={`presentation-media-element is-${element.fit}`}><PresentationAssetView asset={asset} readFile={readFile} thumbnail={thumbnail} /></div> : <span className="presentation-media-state">媒体引用失效</span>;
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
        : <button type="button" className={`presentation-element is-editable${selectedElementID === element.id ? " is-selected" : ""}`} aria-label={`选择${presentationElementLabel(element.type)}元素`} key={element.id} style={style} onClick={() => onSelectElement?.(element.id)} onPointerDown={event => onElementPointerDown?.(event, element)}>{child}</button>;
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
  if (!context) throw Error("当前浏览器不支持幻灯片导出。");
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
  return createPortal(<div className="presentation-slideshow" role="dialog" aria-modal="true" aria-label="幻灯片放映">
    <div className="presentation-slideshow-slide"><PresentationSlideView content={content} slide={content.slides[index]} readFile={readFile} /></div>
    <div className="presentation-slideshow-controls">
      <Button disabled={index === 0} onClick={() => setIndex(value => value - 1)}><ChevronUp size={16} />上一张</Button>
      <span>{index + 1} / {content.slides.length}</span>
      <Button disabled={index === content.slides.length - 1} onClick={() => setIndex(value => value + 1)}>下一张<ChevronDown size={16} /></Button>
      <Button title="退出放映" aria-label="退出放映" onClick={onClose}><X size={17} /></Button>
    </div>
  </div>, document.body);
}

function MasterInspector({ master, onChange }: { master: PresentationMaster; onChange(value: PresentationMaster): void }) {
  const color = (key: keyof Pick<PresentationMaster, "background_color" | "text_color" | "accent_color" | "muted_color">, label: string) => <label><span>{label}</span><input type="color" value={master[key]} onChange={event => onChange({ ...master, [key]: event.target.value.toUpperCase() })} /></label>;
  return <div className="presentation-master-inspector">
    <h4>母版</h4>
    <p>统一控制整份演示的字体、色彩、页脚和页码。</p>
    {color("background_color", "背景")}{color("text_color", "正文")}{color("accent_color", "强调")}{color("muted_color", "辅助")}
    <label className="is-wide"><span>字体</span><Select value={master.font_family} onChange={event => onChange({ ...master, font_family: event.target.value })}><option>Arial</option><option>Aptos</option><option>Helvetica</option><option>Georgia</option><option>Times New Roman</option></Select></label>
    <label className="is-wide"><span>页脚</span><input maxLength={512} value={master.footer} onChange={event => onChange({ ...master, footer: event.target.value })} /></label>
    <label className="is-check"><input type="checkbox" checked={master.show_slide_number} onChange={event => onChange({ ...master, show_slide_number: event.target.checked })} /><span>显示页码</span></label>
  </div>;
}

function ElementInspector({ element, onChange, onDelete }: { element: PresentationElement; onChange(value: PresentationElement): void; onDelete(): void }) {
  const number = (key: "x" | "y" | "width" | "height" | "rotation", label: string, min: number, max: number) => <label><span>{label}</span><input type="number" min={min} max={max} value={element[key]} onChange={event => onChange({ ...element, [key]: Math.max(min, Math.min(max, Number(event.target.value) || 0)) })} /></label>;
  return <div className="presentation-element-inspector">
    <header><div><h4>元素</h4><small>{presentationElementLabel(element.type)}</small></div><button type="button" title="删除元素" onClick={onDelete}><Trash2 size={15} /></button></header>
    <div className="presentation-inspector-grid">{number("x", "X", 0, presentationCanvasWidth)}{number("y", "Y", 0, presentationCanvasHeight)}{number("width", "宽", 1, presentationCanvasWidth)}{number("height", "高", 1, presentationCanvasHeight)}{number("rotation", "旋转", -360, 360)}</div>
    {(element.type === "text" || element.type === "shape") && <>
      <label className="is-wide"><span>内容</span><textarea value={element.text || ""} onChange={event => onChange({ ...element, text: event.target.value })} /></label>
      <div className="presentation-inspector-grid"><label><span>字号</span><input type="number" min={8} max={240} value={element.font_size} onChange={event => onChange({ ...element, font_size: Number(event.target.value) || 8 })} /></label><label><span>字重</span><Select value={element.font_weight} onChange={event => onChange({ ...element, font_weight: event.target.value as "normal" | "bold" })}><option value="normal">常规</option><option value="bold">加粗</option></Select></label><label><span>文字色</span><input type="color" value={element.color} onChange={event => onChange({ ...element, color: event.target.value.toUpperCase() })} /></label></div>
      <div className="presentation-align-control" role="group" aria-label="文本对齐"><button type="button" aria-pressed={element.align === "left"} onClick={() => onChange({ ...element, align: "left" })}><AlignLeft size={15} /></button><button type="button" aria-pressed={element.align === "center"} onClick={() => onChange({ ...element, align: "center" })}><AlignCenter size={15} /></button><button type="button" aria-pressed={element.align === "right"} onClick={() => onChange({ ...element, align: "right" })}><AlignRight size={15} /></button></div>
    </>}
    {element.type === "shape" && <div className="presentation-inspector-grid"><label><span>形状</span><Select value={element.shape} onChange={event => onChange({ ...element, shape: event.target.value as PresentationShapeType })}>{presentationShapeTypes.map(shape => <option key={shape} value={shape}>{presentationShapeLabels[shape]}</option>)}</Select></label><label><span>填充</span><input type="color" value={element.fill_color} onChange={event => onChange({ ...element, fill_color: event.target.value.toUpperCase() })} /></label><label><span>边框</span><input type="color" value={element.stroke_color} onChange={event => onChange({ ...element, stroke_color: event.target.value.toUpperCase() })} /></label></div>}
    {(element.type === "image" || element.type === "video") && <label className="is-wide"><span>适应方式</span><Select value={element.fit} onChange={event => onChange({ ...element, fit: event.target.value as "contain" | "cover" })}><option value="contain">完整显示</option><option value="cover">铺满裁剪</option></Select></label>}
    {element.type === "table" && element.table && <><label className="is-check"><input type="checkbox" checked={element.table.header} onChange={event => onChange({ ...element, table: { ...element.table!, header: event.target.checked } })} /><span>首行为表头</span></label><label className="is-wide"><span>表格内容（Tab 分列、换行分行）</span><textarea rows={10} value={element.table.rows.map(row => row.join("\t")).join("\n")} onChange={event => { const rows = event.target.value.split("\n").slice(0, 50).map(row => row.split("\t").slice(0, 20)), width = Math.max(1, ...rows.map(row => row.length)); onChange({ ...element, table: { ...element.table!, rows: rows.map(row => [...row, ...Array(Math.max(0, width - row.length)).fill("")]) } }); }} /></label></>}
    {element.type === "chart" && element.chart && <><label className="is-wide"><span>图表类型</span><Select value={element.chart.type} onChange={event => onChange({ ...element, chart: { ...element.chart!, type: event.target.value as PresentationChartType } })}>{presentationChartTypes.map(type => <option key={type} value={type}>{presentationChartLabels[type]}</option>)}</Select></label><label className="is-wide"><span>分类（逗号分隔）</span><input value={element.chart.categories.join(",")} onChange={event => { const categories = event.target.value.split(",").map(value => value.trim()).filter(Boolean).slice(0, 50); onChange({ ...element, chart: { ...element.chart!, categories, series: element.chart!.series.map(series => ({ ...series, values: categories.map((_, index) => series.values[index] || 0) })) } }); }} /></label><label className="is-wide"><span>数据系列（每行“名称:1,2,3”）</span><textarea rows={8} value={element.chart.series.map(series => `${series.name}:${series.values.join(",")}`).join("\n")} onChange={event => { const series = event.target.value.split("\n").slice(0, 12).map((row, index) => { const separator = row.indexOf(":"); const name = (separator >= 0 ? row.slice(0, separator) : `系列 ${index + 1}`).trim() || `系列 ${index + 1}`, raw = separator >= 0 ? row.slice(separator + 1) : row; return { name, values: element.chart!.categories.map((_, valueIndex) => { const value = Number(raw.split(",")[valueIndex]?.trim() || 0); return Number.isFinite(value) ? value : 0; }) }; }).filter(item => item.name); onChange({ ...element, chart: { ...element.chart!, series: series.length ? series : [{ name: "系列 1", values: element.chart!.categories.map(() => 0) }] } }); }} /></label></>}
    {element.type === "formula" && <><label className="is-wide"><span>LaTeX 公式</span><textarea rows={6} value={element.formula || ""} onChange={event => onChange({ ...element, formula: event.target.value })} /></label><div className="presentation-inspector-grid"><label><span>字号</span><input type="number" min={8} max={240} value={element.font_size} onChange={event => onChange({ ...element, font_size: Number(event.target.value) || 8 })} /></label><label><span>颜色</span><input type="color" value={element.color} onChange={event => onChange({ ...element, color: event.target.value.toUpperCase() })} /></label></div></>}
    {element.type === "code" && <><div className="presentation-inspector-grid"><label><span>语言</span><Select value={element.language} onChange={event => onChange({ ...element, language: event.target.value })}><option value="javascript">JavaScript</option><option value="typescript">TypeScript</option><option value="python">Python</option><option value="go">Go</option><option value="java">Java</option><option value="sql">SQL</option><option value="shell">Shell</option><option value="json">JSON</option></Select></label><label><span>字号</span><input type="number" min={8} max={120} value={element.font_size} onChange={event => onChange({ ...element, font_size: Number(event.target.value) || 8 })} /></label><label><span>背景</span><input type="color" value={element.fill_color} onChange={event => onChange({ ...element, fill_color: event.target.value.toUpperCase() })} /></label></div><label className="is-wide"><span>代码</span><textarea rows={12} value={element.source || ""} onChange={event => onChange({ ...element, source: event.target.value })} /></label></>}
  </div>;
}

export function PresentationEditor({ body, readOnly = false, documentTitle = "未命名幻灯片", initialBlockID, uploadFile, fileUploadsEnabled, readFile, pageActionHost, authorizeContentAction, onActionFeedback, onChange }: KnowledgeEditorProps) {
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
    const clone: PresentationSlide = { ...selectedSlide, id, title: `${selectedSlide.title} 副本`, files, elements: selectedSlide.elements.map(item => ({ ...item, id: newID("element"), asset_id: item.asset_id ? assetIDs.get(item.asset_id) : undefined })) };
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
    if (selectedSlide.elements.length && !window.confirm("切换版式会重置当前页元素，继续吗？")) return;
    setSelectedElementID(""); updateSlide({ ...selectedSlide, layout, files: {}, elements: presentationLayoutElements(selectedSlide.id, layout, content.master) });
  };
  const addText = () => {
    const item: PresentationElement = { id: newID("text"), type: "text", x: 220, y: 270, width: 1160, height: 180, rotation: 0, text: "输入文本", font_size: 42, font_weight: "normal", color: content.master.text_color, align: "left" };
    setSelectedElementID(item.id); updateSlide({ ...selectedSlide, elements: [...selectedSlide.elements, item] });
  };
  const addShape = (shape: PresentationShapeType) => {
    const line = shape === "line";
    const item: PresentationElement = { id: newID("shape"), type: "shape", x: 520, y: line ? 420 : 300, width: 560, height: line ? 40 : 260, rotation: 0, shape, fill_color: content.master.accent_color, stroke_color: content.master.accent_color, stroke_width: 2, text: "", font_size: 32, font_weight: "normal", color: content.master.background_color, align: "center" };
    setShapeMenuOpen(false);
    setSelectedElementID(item.id); updateSlide({ ...selectedSlide, elements: [...selectedSlide.elements, item] });
  };
  const addTable = () => {
    const item: PresentationElement = { id: newID("table"), type: "table", x: 260, y: 230, width: 1080, height: 430, rotation: 0, table: { header: true, rows: [["项目", "负责人", "状态"], ["方案设计", "Alice", "进行中"], ["开发验收", "Bob", "待开始"]] } };
    setSelectedElementID(item.id); updateSlide({ ...selectedSlide, elements: [...selectedSlide.elements, item] });
  };
  const addChart = () => {
    const item: PresentationElement = { id: newID("chart"), type: "chart", x: 260, y: 210, width: 1080, height: 500, rotation: 0, chart: { type: "column", categories: ["第一季度", "第二季度", "第三季度", "第四季度"], series: [{ name: "目标", values: [42, 58, 66, 82] }, { name: "实际", values: [38, 61, 72, 88] }] } };
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
    if (!uploadFile || !fileUploadsEnabled) { onActionFeedback?.("当前知识库未配置受权文件存储，不能插入媒体。"); return; }
    const image = file.type === "image/png" || file.type === "image/jpeg" || file.type === "image/webp" || file.type === "image/gif";
    const video = file.type === "video/mp4" || file.type === "video/webm";
    if (!image && !video) { onActionFeedback?.("仅支持 PNG、JPEG、WebP、GIF、MP4 或 WebM。"); return; }
    try {
      const reference = uploadedDocumentReference(await uploadFile(file));
      if (!reference) throw Error("媒体上传没有返回受权文档引用。");
      const assetID = newID("asset"), elementID = newID(image ? "image" : "video");
      const asset: PresentationAsset = { id: assetID, mime_type: file.type as PresentationAsset["mime_type"], document_ref: reference, filename: file.name };
      const item: PresentationElement = { id: elementID, type: image ? "image" : "video", x: 240, y: 210, width: 1120, height: 560, rotation: 0, asset_id: assetID, fit: "contain" };
      setSelectedElementID(elementID); updateSlide({ ...selectedSlide, files: { ...selectedSlide.files, [assetID]: asset }, elements: [...selectedSlide.elements, item] });
    } catch (failure) { onActionFeedback?.(failure instanceof Error ? failure.message : "媒体上传失败"); }
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
      if (!authorizeContentAction) throw Error("当前页面禁止导出内容。");
      await authorizeContentAction(kind === "pdf" ? "print" : "export");
      if (kind === "pdf") await exportPresentationPDF(contentRef.current, documentTitle, readFile);
      else await exportPresentationPPTX(contentRef.current, documentTitle, readFile);
      onActionFeedback?.(`已导出 ${kind.toUpperCase()}。`);
    } catch (failure) { onActionFeedback?.(failure instanceof Error ? failure.message : "幻灯片导出失败"); }
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
      <Button title="导出 PDF" disabled={Boolean(exporting)} onClick={() => void exportFile("pdf")}><FileDown size={15} />PDF</Button>
      <Button title="导出 PPTX" disabled={Boolean(exporting)} onClick={() => void exportFile("pptx")}><Maximize2 size={15} />PPTX</Button>
    </PageActionPortal>}
    <div className="presentation-toolbar" aria-label="幻灯片工具栏">
      {!readOnly && <>
        <label><span>主题</span><Select value={content.theme} onChange={event => apply(applyPresentationTheme(content, event.target.value as PresentationThemeID))}>{Object.entries(presentationThemes).map(([id, theme]) => <option key={id} value={id}>{theme.label}</option>)}</Select></label>
        <label><span>版式</span><Select value={selectedSlide.layout} onChange={event => setLayout(event.target.value as PresentationLayout)}>{presentationLayouts.map(layout => <option key={layout.id} value={layout.id}>{layout.label}</option>)}</Select></label>
        <span className="presentation-toolbar-divider" />
        <Button title="插入文本" onClick={addText}><Type size={15} />文本</Button>
        <div className="presentation-shape-picker" ref={shapePickerRef}>
          <Button title="插入形状" aria-expanded={shapeMenuOpen} aria-haspopup="menu" onClick={() => setShapeMenuOpen(value => !value)}><RectangleHorizontal size={15} />形状<ChevronDown size={13} /></Button>
          {shapeMenuOpen && <div className="presentation-shape-menu" role="menu" aria-label="选择形状">
            {presentationShapeTypes.map(shape => <button type="button" role="menuitem" title={`插入${presentationShapeLabels[shape]}`} key={shape} onClick={() => addShape(shape)}><span><PresentationShapeGraphic shape={shape} fill="var(--knowledge-surface-tint)" stroke="currentColor" strokeWidth={2} /></span><b>{presentationShapeLabels[shape]}</b></button>)}
          </div>}
        </div>
        <Button title="插入表格" onClick={addTable}><Table2 size={15} />表格</Button>
        <Button title="插入图表" onClick={addChart}><BarChart3 size={15} />图表</Button>
        <Button title="插入公式" onClick={addFormula}><Sigma size={15} />公式</Button>
        <Button title="插入代码" onClick={addCode}><Braces size={15} />代码</Button>
        <label className="knowledge-button presentation-upload"><ImagePlus size={15} />媒体<input type="file" accept="image/png,image/jpeg,image/webp,image/gif,video/mp4,video/webm" onChange={event => { const file = event.target.files?.[0]; event.currentTarget.value = ""; if (file) void addMedia(file); }} /></label>
      </>}
      <span className="presentation-toolbar-spacer" />
      <Button title="放映" onClick={() => setSlideshow(true)}><MonitorPlay size={15} />放映</Button>
    </div>
    <div className={`presentation-workspace${readOnly ? " is-readonly" : ""}`}>
      <aside className="presentation-slide-list" aria-label="幻灯片列表">
        {content.slides.map((slide, index) => <button type="button" aria-current={slide.id === selectedSlide.id ? "true" : undefined} key={slide.id} onClick={() => { setSelectedSlideID(slide.id); setSelectedElementID(""); }}><span>{index + 1}</span><div><PresentationSlideView content={content} slide={slide} readFile={readFile} thumbnail /><strong>{slide.title}</strong></div></button>)}
        {!readOnly && <Button className="presentation-add-slide" onClick={addSlide}><Plus size={15} />新建幻灯片</Button>}
      </aside>
      <main className="presentation-stage-column">
        {!readOnly && <div className="presentation-slide-meta"><input aria-label="幻灯片标题" maxLength={512} value={selectedSlide.title} onChange={event => updateSlide({ ...selectedSlide, title: event.target.value || "未命名幻灯片" })} /><div><button type="button" title="上移幻灯片" disabled={selectedIndex === 0} onClick={() => moveSlide(-1)}><ChevronUp size={15} /></button><button type="button" title="下移幻灯片" disabled={selectedIndex === content.slides.length - 1} onClick={() => moveSlide(1)}><ChevronDown size={15} /></button><button type="button" title="复制幻灯片" onClick={duplicateSlide}><Copy size={15} /></button><button type="button" title="删除幻灯片" disabled={content.slides.length === 1} onClick={removeSlide}><Trash2 size={15} /></button></div></div>}
        <div className="presentation-stage" onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerCancel={handlePointerUp}><PresentationSlideView content={content} slide={selectedSlide} selectedElementID={selectedElementID} readOnly={readOnly} readFile={readFile} onSelectElement={setSelectedElementID} onElementPointerDown={handleElementPointerDown} /></div>
        {!readOnly && <label className="presentation-speaker-notes"><span>演讲者备注</span><textarea placeholder="仅演讲者可见的提示、引用和讲述节奏…" value={selectedSlide.notes} onChange={event => updateSlide({ ...selectedSlide, notes: event.target.value })} /></label>}
      </main>
      {!readOnly && <aside className="presentation-inspector">{selectedElement ? <ElementInspector element={selectedElement} onChange={updateElement} onDelete={removeElement} /> : <MasterInspector master={content.master} onChange={master => apply({ ...content, master })} />}</aside>}
    </div>
    {slideshow && <PresentationSlideshow content={content} initial={selectedIndex} readFile={readFile} onClose={() => setSlideshow(false)} />}
  </div>;
}

export default PresentationEditor;
