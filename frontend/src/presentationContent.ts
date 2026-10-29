import { kt, ktf } from "./i18n/runtime.ts";
export const presentationCanvasWidth = 1600;
export const presentationCanvasHeight = 900;

export type PresentationThemeID = "forest" | "midnight" | "sunrise";
export type PresentationLayout = "title" | "section" | "agenda" | "title_content" | "two_column" | "quote" | "image_focus" | "blank";
export type PresentationElementType = "text" | "shape" | "image" | "video" | "table" | "chart" | "formula" | "code";
export const presentationShapeTypes = ["rectangle", "rounded_rectangle", "ellipse", "triangle", "diamond", "hexagon", "star", "arrow_right", "callout", "line"] as const;
export type PresentationShapeType = typeof presentationShapeTypes[number];
export const presentationChartTypes = ["column", "bar", "line", "area", "pie", "donut"] as const;
export type PresentationChartType = typeof presentationChartTypes[number];
export type PresentationTable = { rows: string[][]; header: boolean };
export type PresentationChart = { type: PresentationChartType; categories: string[]; series: Array<{ name: string; values: number[] }> };

export type PresentationMaster = {
  background_color: string;
  text_color: string;
  accent_color: string;
  muted_color: string;
  font_family: string;
  footer: string;
  show_slide_number: boolean;
};

export type PresentationAsset = {
  id: string;
  mime_type: "image/png" | "image/jpeg" | "image/webp" | "image/gif" | "video/mp4" | "video/webm";
  document_ref: string;
  filename: string;
};

export type PresentationElement = {
  id: string;
  type: PresentationElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  text?: string;
  font_size?: number;
  font_weight?: "normal" | "bold";
  color?: string;
  align?: "left" | "center" | "right";
  shape?: PresentationShapeType;
  fill_color?: string;
  stroke_color?: string;
  stroke_width?: number;
  asset_id?: string;
  fit?: "contain" | "cover";
  table?: PresentationTable;
  chart?: PresentationChart;
  formula?: string;
  language?: string;
  source?: string;
};

export type PresentationSlide = {
  id: string;
  title: string;
  layout: PresentationLayout;
  background_color: string;
  notes: string;
  elements: PresentationElement[];
  files: Record<string, PresentationAsset>;
};

export type PresentationContent = {
  schema_version: 1;
  theme: PresentationThemeID;
  master: PresentationMaster;
  slides: PresentationSlide[];
};

export const presentationThemes: Record<PresentationThemeID, { label: string; master: PresentationMaster }> = {
  forest: {
    get label() { return kt("knowledge.auto.6eb9191264eb441d"); },
    master: { background_color: "#FFFFFF", text_color: "#17221C", accent_color: "#176B52", muted_color: "#66746C", font_family: "Arial", footer: "", show_slide_number: true },
  },
  midnight: {
    get label() { return kt("knowledge.auto.30003ad423e4c2ec"); },
    master: { background_color: "#101D19", text_color: "#F5F8F6", accent_color: "#59C89B", muted_color: "#A8B7AF", font_family: "Arial", footer: "", show_slide_number: true },
  },
  sunrise: {
    get label() { return kt("knowledge.auto.e1a205acd9d171cd"); },
    master: { background_color: "#FFF9F1", text_color: "#31271E", accent_color: "#C85D35", muted_color: "#806F61", font_family: "Arial", footer: "", show_slide_number: true },
  },
};

export const presentationLayouts: Array<{ id: PresentationLayout; label: string }> = [
  { id: "title", get label() { return kt("knowledge.auto.21cdeff3c4a2dd46"); } },
  { id: "section", get label() { return kt("knowledge.auto.d3ddf2d8c51afff5"); } },
  { id: "agenda", get label() { return kt("knowledge.auto.0b8046a7206bfca6"); } },
  { id: "title_content", get label() { return kt("knowledge.auto.66d42243c237d121"); } },
  { id: "two_column", get label() { return kt("knowledge.auto.8f1387be20d72938"); } },
  { id: "quote", get label() { return kt("knowledge.auto.0d6040e211a3e177"); } },
  { id: "image_focus", get label() { return kt("knowledge.auto.5e48a0e23879d6d4"); } },
  { id: "blank", get label() { return kt("knowledge.auto.f0bf4574ce25c131"); } },
];

function element(id: string, type: PresentationElementType, values: Omit<PresentationElement, "id" | "type">): PresentationElement {
  return { id, type, ...values };
}

export function presentationLayoutElements(slideID: string, layout: PresentationLayout, master: PresentationMaster): PresentationElement[] {
  const title = (suffix: string, values: Omit<PresentationElement, "id" | "type">) => element(`${slideID}-${suffix}`, "text", values);
  const commonTitle = { x: 112, y: 88, width: 1376, height: 118, rotation: 0, text: kt("knowledge.auto.acab733512504e9b"), font_size: 56, font_weight: "bold" as const, color: master.text_color, align: "left" as const };
  switch (layout) {
    case "title":
      return [
        title("title", { ...commonTitle, x: 168, y: 260, width: 1264, height: 150, font_size: 72, align: "center" }),
        title("subtitle", { x: 260, y: 438, width: 1080, height: 78, rotation: 0, text: kt("knowledge.auto.50a978aaf7b0ad13"), font_size: 28, font_weight: "normal", color: master.muted_color, align: "center" }),
      ];
    case "section":
      return [
        element(`${slideID}-accent`, "shape", { x: 170, y: 242, width: 18, height: 248, rotation: 0, shape: "rounded_rectangle", fill_color: master.accent_color, stroke_color: master.accent_color, stroke_width: 0, text: "", font_size: 18, font_weight: "normal", color: master.background_color, align: "center" }),
        title("eyebrow", { x: 234, y: 245, width: 1120, height: 46, rotation: 0, text: kt("knowledge.auto.76c50841d30b443b"), font_size: 24, font_weight: "bold", color: master.accent_color, align: "left" }),
        title("title", { x: 228, y: 310, width: 1180, height: 160, rotation: 0, text: kt("knowledge.auto.b260439872218651"), font_size: 72, font_weight: "bold", color: master.text_color, align: "left" }),
        title("subtitle", { x: 234, y: 492, width: 980, height: 64, rotation: 0, text: kt("knowledge.auto.2203c7dbec8e8a97"), font_size: 26, font_weight: "normal", color: master.muted_color, align: "left" }),
      ];
    case "agenda":
      return [
        title("title", commonTitle),
        title("agenda", { x: 168, y: 260, width: 1264, height: 420, rotation: 0, text: kt("knowledge.auto.e3054e710d48010e"), font_size: 38, font_weight: "normal", color: master.text_color, align: "left" }),
      ];
    case "two_column":
      return [
        title("title", commonTitle),
        title("left", { x: 112, y: 260, width: 632, height: 450, rotation: 0, text: kt("knowledge.auto.6c4bda71f7e9fe47"), font_size: 30, font_weight: "normal", color: master.text_color, align: "left" }),
        title("right", { x: 856, y: 260, width: 632, height: 450, rotation: 0, text: kt("knowledge.auto.4738b4e180d0ff5e"), font_size: 30, font_weight: "normal", color: master.text_color, align: "left" }),
      ];
    case "image_focus":
      return [
        title("title", commonTitle),
        element(`${slideID}-media-placeholder`, "shape", { x: 112, y: 246, width: 1376, height: 510, rotation: 0, shape: "rectangle", fill_color: master.muted_color, stroke_color: master.accent_color, stroke_width: 2, text: kt("knowledge.auto.e0bede796aa37179"), font_size: 28, font_weight: "normal", color: master.background_color, align: "center" }),
      ];
    case "quote":
      return [
        title("mark", { x: 170, y: 165, width: 180, height: 150, rotation: 0, text: "“", font_size: 160, font_weight: "bold", color: master.accent_color, align: "left" }),
        title("quote", { x: 260, y: 250, width: 1080, height: 270, rotation: 0, text: kt("knowledge.auto.0eb670cc0f021eed"), font_size: 52, font_weight: "bold", color: master.text_color, align: "left" }),
        title("source", { x: 270, y: 590, width: 980, height: 52, rotation: 0, text: kt("knowledge.auto.30080922e0b0cd8d"), font_size: 24, font_weight: "normal", color: master.muted_color, align: "left" }),
      ];
    case "blank":
      return [];
    default:
      return [
        title("title", commonTitle),
        title("content", { x: 112, y: 252, width: 1376, height: 480, rotation: 0, text: kt("knowledge.auto.07c1752da961a84b"), font_size: 32, font_weight: "normal", color: master.text_color, align: "left" }),
      ];
  }
}

export function createPresentationSlide(id: string, index: number, layout: PresentationLayout, master: PresentationMaster): PresentationSlide {
  return {
    id,
    title: index === 0 ? kt("knowledge.auto.acab733512504e9b") : ktf("knowledge.auto.48df1e72ddb395f6", { value0: index + 1 }),
    layout,
    background_color: "",
    notes: "",
    elements: presentationLayoutElements(id, layout, master),
    files: {},
  };
}

export const emptyPresentationContent: PresentationContent = {
  schema_version: 1,
  theme: "forest",
  master: { ...presentationThemes.forest.master },
  slides: [createPresentationSlide("slide-1", 0, "title", presentationThemes.forest.master)],
};

const colorPattern = /^#[0-9a-fA-F]{6}$/;
const documentReferencePattern = /^knowledge-document:kdoc_[a-f0-9]{32}$/;
const stableIDPattern = /^[^\u0000-\u001f\u007f]{1,128}$/;
const layouts = new Set<PresentationLayout>(presentationLayouts.map(item => item.id));
const themes = new Set<PresentationThemeID>(Object.keys(presentationThemes) as PresentationThemeID[]);
const fonts = new Set(["Arial", "Aptos", "Helvetica", "Georgia", "Times New Roman"]);
const mimes = new Set<PresentationAsset["mime_type"]>(["image/png", "image/jpeg", "image/webp", "image/gif", "video/mp4", "video/webm"]);
const shapeTypes = new Set<PresentationShapeType>(presentationShapeTypes);
const chartTypes = new Set<PresentationChartType>(presentationChartTypes);

function isObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function hasOnlyKeys(value: Record<string, unknown>, allowed: readonly string[]) {
  const keys = new Set(allowed);
  return Object.keys(value).every(key => keys.has(key));
}

function finite(value: unknown, minimum: number, maximum: number) {
  return typeof value === "number" && Number.isFinite(value) && value >= minimum && value <= maximum;
}

function validText(value: unknown, maximum: number, required = true): value is string {
  return typeof value === "string" && value.length <= maximum && (!required || value.trim().length > 0) && !value.includes("\u0000");
}

function validMaster(value: unknown): value is PresentationMaster {
  if (!isObject(value) || !hasOnlyKeys(value, ["background_color", "text_color", "accent_color", "muted_color", "font_family", "footer", "show_slide_number"])) return false;
  return colorPattern.test(String(value.background_color)) && colorPattern.test(String(value.text_color)) && colorPattern.test(String(value.accent_color)) && colorPattern.test(String(value.muted_color))
    && typeof value.font_family === "string" && fonts.has(value.font_family) && validText(value.footer, 512, false) && typeof value.show_slide_number === "boolean";
}

function validAsset(value: unknown, key: string): value is PresentationAsset {
  if (!isObject(value) || !hasOnlyKeys(value, ["id", "mime_type", "document_ref", "filename"])) return false;
  return value.id === key && typeof value.id === "string" && stableIDPattern.test(value.id) && typeof value.mime_type === "string" && mimes.has(value.mime_type as PresentationAsset["mime_type"])
    && typeof value.document_ref === "string" && documentReferencePattern.test(value.document_ref) && validText(value.filename, 512);
}

function validElement(value: unknown, assets: Record<string, PresentationAsset>): value is PresentationElement {
  if (!isObject(value) || !hasOnlyKeys(value, ["id", "type", "x", "y", "width", "height", "rotation", "text", "font_size", "font_weight", "color", "align", "shape", "fill_color", "stroke_color", "stroke_width", "asset_id", "fit", "table", "chart", "formula", "language", "source"])) return false;
  if (typeof value.id !== "string" || !stableIDPattern.test(value.id) || !["text", "shape", "image", "video", "table", "chart", "formula", "code"].includes(String(value.type))) return false;
  if (!finite(value.x, 0, presentationCanvasWidth) || !finite(value.y, 0, presentationCanvasHeight) || !finite(value.width, 1, presentationCanvasWidth) || !finite(value.height, 1, presentationCanvasHeight) || !finite(value.rotation, -360, 360)) return false;
  if (Number(value.x) + Number(value.width) > presentationCanvasWidth || Number(value.y) + Number(value.height) > presentationCanvasHeight) return false;
  if (value.type === "text") {
    return validText(value.text, 32768, false) && finite(value.font_size, 8, 240) && (value.font_weight === "normal" || value.font_weight === "bold") && colorPattern.test(String(value.color)) && ["left", "center", "right"].includes(String(value.align));
  }
  if (value.type === "shape") {
    return typeof value.shape === "string" && shapeTypes.has(value.shape as PresentationShapeType) && colorPattern.test(String(value.fill_color)) && colorPattern.test(String(value.stroke_color)) && finite(value.stroke_width, 0, 24)
      && validText(value.text, 32768, false) && finite(value.font_size, 8, 240) && (value.font_weight === "normal" || value.font_weight === "bold") && colorPattern.test(String(value.color)) && ["left", "center", "right"].includes(String(value.align));
  }
  if (value.type === "table") {
    if (!isObject(value.table) || !hasOnlyKeys(value.table, ["rows", "header"]) || typeof value.table.header !== "boolean" || !Array.isArray(value.table.rows) || value.table.rows.length < 1 || value.table.rows.length > 50) return false;
    const width = Array.isArray(value.table.rows[0]) ? value.table.rows[0].length : 0;
    return width > 0 && width <= 20 && value.table.rows.every(row => Array.isArray(row) && row.length === width && row.every(cell => validText(cell, 2048, false)));
  }
  if (value.type === "chart") {
    if (!isObject(value.chart) || !hasOnlyKeys(value.chart, ["type", "categories", "series"])) return false;
    const chart = value.chart, categories = chart.categories, series = chart.series;
    if (typeof chart.type !== "string" || !chartTypes.has(chart.type as PresentationChartType) || !Array.isArray(categories) || categories.length < 1 || categories.length > 50 || !categories.every(category => validText(category, 256))) return false;
    return Array.isArray(series) && series.length > 0 && series.length <= 12 && series.every(item => isObject(item) && hasOnlyKeys(item, ["name", "values"]) && validText(item.name, 256) && Array.isArray(item.values) && item.values.length === categories.length && item.values.every(value => finite(value, -1e12, 1e12)));
  }
  if (value.type === "formula") return validText(value.formula, 8192) && finite(value.font_size, 8, 240) && colorPattern.test(String(value.color));
  if (value.type === "code") return validText(value.language, 64) && /^[A-Za-z0-9_+#.-]{1,64}$/.test(value.language) && validText(value.source, 32768, false) && finite(value.font_size, 8, 120) && colorPattern.test(String(value.color)) && colorPattern.test(String(value.fill_color));
  const asset = typeof value.asset_id === "string" ? assets[value.asset_id] : undefined;
  return Boolean(asset) && (value.fit === "contain" || value.fit === "cover") && (value.type === "image" ? asset!.mime_type.startsWith("image/") : asset!.mime_type.startsWith("video/"));
}

export function isPresentationContent(value: unknown): value is PresentationContent {
  if (!isObject(value) || !hasOnlyKeys(value, ["schema_version", "theme", "master", "slides"]) || value.schema_version !== 1 || typeof value.theme !== "string" || !themes.has(value.theme as PresentationThemeID) || !validMaster(value.master) || !Array.isArray(value.slides) || value.slides.length < 1 || value.slides.length > 200) return false;
  const slideIDs = new Set<string>();
  for (const rawSlide of value.slides) {
    if (!isObject(rawSlide) || !hasOnlyKeys(rawSlide, ["id", "title", "layout", "background_color", "notes", "elements", "files"])) return false;
    if (typeof rawSlide.id !== "string" || !stableIDPattern.test(rawSlide.id) || slideIDs.has(rawSlide.id) || !validText(rawSlide.title, 512) || typeof rawSlide.layout !== "string" || !layouts.has(rawSlide.layout as PresentationLayout)) return false;
    if (typeof rawSlide.background_color !== "string" || rawSlide.background_color !== "" && !colorPattern.test(rawSlide.background_color) || !validText(rawSlide.notes, 32768, false) || !isObject(rawSlide.files) || Object.keys(rawSlide.files).length > 64 || !Array.isArray(rawSlide.elements) || rawSlide.elements.length > 256) return false;
    const assets: Record<string, PresentationAsset> = {};
    for (const [key, asset] of Object.entries(rawSlide.files)) {
      if (!validAsset(asset, key)) return false;
      assets[key] = asset;
    }
    const elementIDs = new Set<string>();
    for (const rawElement of rawSlide.elements) {
      if (!validElement(rawElement, assets) || elementIDs.has(rawElement.id)) return false;
      elementIDs.add(rawElement.id);
    }
    slideIDs.add(rawSlide.id);
  }
  return true;
}

function cloneEmptyPresentation(): PresentationContent {
  return JSON.parse(JSON.stringify(emptyPresentationContent)) as PresentationContent;
}

export function parsePresentationContent(body: string): PresentationContent {
  try {
    const value: unknown = JSON.parse(body);
    return isPresentationContent(value) ? value : cloneEmptyPresentation();
  } catch {
    return cloneEmptyPresentation();
  }
}

export function canonicalPresentationContent(value: PresentationContent) {
  if (!isPresentationContent(value)) throw Error(kt("knowledge.auto.093c88e77eb07424"));
  return JSON.stringify(value);
}

export function applyPresentationTheme(content: PresentationContent, theme: PresentationThemeID): PresentationContent {
  const nextMaster = { ...presentationThemes[theme].master, footer: content.master.footer, show_slide_number: content.master.show_slide_number };
  return {
    ...content,
    theme,
    master: nextMaster,
    slides: content.slides.map(slide => ({
      ...slide,
      elements: slide.elements.map(item => {
        if (item.type === "text") return { ...item, color: item.color === content.master.muted_color ? nextMaster.muted_color : nextMaster.text_color };
        if (item.type === "shape") return { ...item, fill_color: item.fill_color === content.master.muted_color ? nextMaster.muted_color : item.fill_color, stroke_color: item.stroke_color === content.master.accent_color ? nextMaster.accent_color : item.stroke_color, color: item.color === content.master.background_color ? nextMaster.background_color : nextMaster.text_color };
        if (item.type === "formula" || item.type === "code") return { ...item, color: item.color === content.master.muted_color ? nextMaster.muted_color : nextMaster.text_color, fill_color: item.type === "code" && item.fill_color === content.master.background_color ? nextMaster.background_color : item.fill_color };
        return item;
      }),
    })),
  };
}

export function presentationPlainText(content: PresentationContent) {
  const words: string[] = [content.master.footer];
  for (const slide of content.slides) {
    words.push(slide.title, slide.notes);
    for (const item of slide.elements) {
      if (item.text) words.push(item.text);
      if (item.formula) words.push(item.formula);
      if (item.source) words.push(item.source);
      if (item.table) words.push(...item.table.rows.flat());
      if (item.chart) words.push(...item.chart.categories, ...item.chart.series.map(series => series.name));
    }
    for (const asset of Object.values(slide.files)) words.push(asset.filename);
  }
  return words.join(" ").replace(/\s+/g, " ").trim();
}
