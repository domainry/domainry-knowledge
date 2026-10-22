type UnknownObject = Record<string, unknown>;

export type KnowledgeWhiteboardBinding = {
  element_id: string;
  focus: number;
  gap: number;
  fixed_point?: [number, number];
};

export type KnowledgeWhiteboardElement = {
  id: string;
  type: "rectangle" | "diamond" | "ellipse" | "line" | "arrow" | "freedraw" | "text" | "image" | "frame";
  x: number;
  y: number;
  width: number;
  height: number;
  angle: number;
  stroke_color: string;
  background_color: string;
  fill_style: "hachure" | "cross-hatch" | "solid" | "zigzag";
  stroke_width: number;
  stroke_style: "solid" | "dashed" | "dotted";
  roughness: number;
  opacity: number;
  group_ids?: string[];
  frame_id?: string;
  roundness?: number;
  bound_elements?: { id: string; type: "text" | "arrow" }[];
  link?: string;
  locked?: boolean;
  custom_kind?: "sticky_note" | "template_heading";
  text?: string;
  original_text?: string;
  font_size?: number;
  font_family?: number;
  text_align?: "left" | "center" | "right";
  vertical_align?: "top" | "middle" | "bottom";
  container_id?: string;
  line_height?: number;
  auto_resize?: boolean;
  points?: [number, number][];
  pressures?: number[];
  simulate_pressure?: boolean;
  start_binding?: KnowledgeWhiteboardBinding;
  end_binding?: KnowledgeWhiteboardBinding;
  start_arrowhead?: string;
  end_arrowhead?: string;
  elbowed?: boolean;
  file_id?: string;
  scale?: [number, number];
  crop?: { x: number; y: number; width: number; height: number; natural_width: number; natural_height: number };
  name?: string;
};

export type KnowledgeWhiteboardAsset = {
  id: string;
  mime_type: "image/png" | "image/jpeg" | "image/gif" | "image/webp";
  data_url: string;
  created_at: number;
};

export type KnowledgeWhiteboardContent = {
  schema_version: 1;
  elements: KnowledgeWhiteboardElement[];
  assets: Record<string, KnowledgeWhiteboardAsset>;
  settings: {
    background_color: string;
    grid_size: number;
    grid_enabled: boolean;
  };
};

export const emptyWhiteboardContent: KnowledgeWhiteboardContent = {
  schema_version: 1,
  elements: [],
  assets: {},
  settings: { background_color: "#ffffff", grid_size: 20, grid_enabled: false },
};

const elementTypes = new Set<KnowledgeWhiteboardElement["type"]>(["rectangle", "diamond", "ellipse", "line", "arrow", "freedraw", "text", "image", "frame"]);
const fillStyles = new Set<KnowledgeWhiteboardElement["fill_style"]>(["hachure", "cross-hatch", "solid", "zigzag"]);
const strokeStyles = new Set<KnowledgeWhiteboardElement["stroke_style"]>(["solid", "dashed", "dotted"]);
const imageMimes = new Set<KnowledgeWhiteboardAsset["mime_type"]>(["image/png", "image/jpeg", "image/gif", "image/webp"]);

function object(value: unknown): UnknownObject | null {
  return value !== null && typeof value === "object" && !Array.isArray(value) ? value as UnknownObject : null;
}

function text(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function finite(value: unknown, fallback = 0) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function boolean(value: unknown, fallback = false) {
  return typeof value === "boolean" ? value : fallback;
}

function stringList(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function normalizePoint(value: unknown): [number, number] | null {
  return Array.isArray(value) && value.length === 2 && value.every(item => typeof item === "number" && Number.isFinite(item))
    ? [value[0] as number, value[1] as number]
    : null;
}

function normalizeBinding(value: unknown): KnowledgeWhiteboardBinding | undefined {
  const raw = object(value);
  if (!raw || typeof raw.elementId !== "string") return undefined;
  const binding: KnowledgeWhiteboardBinding = { element_id: raw.elementId, focus: finite(raw.focus), gap: finite(raw.gap) };
  const fixed = normalizePoint(raw.fixedPoint);
  if (fixed) binding.fixed_point = fixed;
  return binding;
}

function normalizeElement(value: unknown): KnowledgeWhiteboardElement | null {
  const raw = object(value);
  const type = raw?.type;
  if (!raw || typeof raw.id !== "string" || !elementTypes.has(type as KnowledgeWhiteboardElement["type"]) || raw.isDeleted === true) return null;
  const element: KnowledgeWhiteboardElement = {
    id: raw.id,
    type: type as KnowledgeWhiteboardElement["type"],
    x: finite(raw.x), y: finite(raw.y), width: Math.max(0, finite(raw.width)), height: Math.max(0, finite(raw.height)), angle: finite(raw.angle),
    stroke_color: text(raw.strokeColor, "#1b1b1f"), background_color: text(raw.backgroundColor, "transparent"),
    fill_style: fillStyles.has(raw.fillStyle as KnowledgeWhiteboardElement["fill_style"]) ? raw.fillStyle as KnowledgeWhiteboardElement["fill_style"] : "hachure",
    stroke_width: Math.max(0.5, finite(raw.strokeWidth, 1)),
    stroke_style: strokeStyles.has(raw.strokeStyle as KnowledgeWhiteboardElement["stroke_style"]) ? raw.strokeStyle as KnowledgeWhiteboardElement["stroke_style"] : "solid",
    roughness: Math.max(0, finite(raw.roughness, 1)), opacity: Math.max(0, Math.min(100, finite(raw.opacity, 100))),
  };
  const groups = stringList(raw.groupIds);
  if (groups.length) element.group_ids = groups;
  if (typeof raw.frameId === "string" && raw.frameId) element.frame_id = raw.frameId;
  const roundness = object(raw.roundness);
  if (roundness && Number.isInteger(roundness.type)) element.roundness = finite(roundness.type);
  if (Array.isArray(raw.boundElements)) {
    const bound: Array<{ id: string; type: "text" | "arrow" }> = raw.boundElements.flatMap(item => {
      const candidate = object(item);
      return candidate && typeof candidate.id === "string" && (candidate.type === "text" || candidate.type === "arrow")
        ? [{ id: candidate.id, type: candidate.type } as const]
        : [];
    });
    if (bound.length) element.bound_elements = bound;
  }
  if (typeof raw.link === "string" && raw.link) element.link = raw.link;
  if (raw.locked === true) element.locked = true;
  const customData = object(raw.customData);
  if (customData?.knowledgeKind === "sticky_note" || customData?.knowledgeKind === "template_heading") element.custom_kind = customData.knowledgeKind;
  if (element.type === "text") {
    element.text = text(raw.text);
    element.original_text = text(raw.originalText, element.text);
    element.font_size = Math.max(1, finite(raw.fontSize, 20));
    element.font_family = Math.max(1, finite(raw.fontFamily, 5));
    element.text_align = raw.textAlign === "center" || raw.textAlign === "right" ? raw.textAlign : "left";
    element.vertical_align = raw.verticalAlign === "middle" || raw.verticalAlign === "bottom" ? raw.verticalAlign : "top";
    if (typeof raw.containerId === "string" && raw.containerId) element.container_id = raw.containerId;
    element.line_height = Math.max(0.5, finite(raw.lineHeight, 1.25));
    element.auto_resize = boolean(raw.autoResize, true);
  }
  if (element.type === "line" || element.type === "arrow" || element.type === "freedraw") {
    const points = Array.isArray(raw.points) ? raw.points.map(normalizePoint).filter((point): point is [number, number] => point !== null) : [];
    element.points = points.length >= 2 ? points : [[0, 0], [Math.max(1, element.width), Math.max(1, element.height)]];
  }
  if (element.type === "line" || element.type === "arrow") {
    const start = normalizeBinding(raw.startBinding), end = normalizeBinding(raw.endBinding);
    if (start) element.start_binding = start;
    if (end) element.end_binding = end;
    if (typeof raw.startArrowhead === "string") element.start_arrowhead = raw.startArrowhead;
    if (typeof raw.endArrowhead === "string") element.end_arrowhead = raw.endArrowhead;
    if (raw.elbowed === true) element.elbowed = true;
  }
  if (element.type === "freedraw") {
    if (Array.isArray(raw.pressures)) element.pressures = raw.pressures.filter((item): item is number => typeof item === "number" && Number.isFinite(item));
    element.simulate_pressure = boolean(raw.simulatePressure, true);
  }
  if (element.type === "image") {
    if (typeof raw.fileId === "string") element.file_id = raw.fileId;
    const scale = normalizePoint(raw.scale);
    element.scale = scale || [1, 1];
    const crop = object(raw.crop);
    if (crop) element.crop = { x: finite(crop.x), y: finite(crop.y), width: finite(crop.width), height: finite(crop.height), natural_width: finite(crop.naturalWidth), natural_height: finite(crop.naturalHeight) };
  }
  if (element.type === "frame" && typeof raw.name === "string" && raw.name) element.name = raw.name;
  return element;
}

function normalizeAssets(files: unknown, referenced: Set<string>): Record<string, KnowledgeWhiteboardAsset> {
  const rawFiles = object(files) || {};
  const result: Record<string, KnowledgeWhiteboardAsset> = {};
  for (const [id, value] of Object.entries(rawFiles)) {
    const raw = object(value), mime = raw?.mimeType;
    if (!raw || !referenced.has(id) || raw.id !== id || typeof raw.dataURL !== "string" || !imageMimes.has(mime as KnowledgeWhiteboardAsset["mime_type"])) continue;
    result[id] = { id, mime_type: mime as KnowledgeWhiteboardAsset["mime_type"], data_url: raw.dataURL, created_at: Math.max(0, finite(raw.created)) };
  }
  return result;
}

export function canonicalWhiteboardContent(elements: readonly unknown[], files: unknown, appState: unknown): KnowledgeWhiteboardContent {
  const normalizedElements = elements.map(normalizeElement).filter((element): element is KnowledgeWhiteboardElement => element !== null);
  const referencedAssets = new Set(normalizedElements.flatMap(element => element.type === "image" && element.file_id ? [element.file_id] : []));
  const state = object(appState) || {};
  return {
    schema_version: 1,
    elements: normalizedElements,
    assets: normalizeAssets(files, referencedAssets),
    settings: {
      background_color: text(state.viewBackgroundColor, "#ffffff"),
      grid_size: Math.max(1, Math.min(100, finite(state.gridSize, 20))),
      grid_enabled: boolean(state.gridModeEnabled),
    },
  };
}

function bindingToScene(binding?: KnowledgeWhiteboardBinding) {
  return binding ? { elementId: binding.element_id, focus: binding.focus, gap: binding.gap, ...(binding.fixed_point ? { fixedPoint: binding.fixed_point } : {}) } : null;
}

function deterministicSeed(id: string) {
  let seed = 2166136261;
  for (const character of id) seed = Math.imul(seed ^ character.charCodeAt(0), 16777619);
  return seed >>> 0 || 1;
}

export function whiteboardScene(content: KnowledgeWhiteboardContent) {
  const elements = content.elements.map((element, order) => ({
    id: element.id, type: element.type, x: element.x, y: element.y, width: element.width, height: element.height, angle: element.angle,
    strokeColor: element.stroke_color, backgroundColor: element.background_color, fillStyle: element.fill_style, strokeWidth: element.stroke_width,
    strokeStyle: element.stroke_style, roughness: element.roughness, opacity: element.opacity, groupIds: element.group_ids || [], frameId: element.frame_id || null,
    roundness: element.roundness ? { type: element.roundness } : null, boundElements: element.bound_elements || null, link: element.link || null, locked: element.locked || false,
    customData: element.custom_kind ? { knowledgeKind: element.custom_kind } : undefined,
    text: element.text, originalText: element.original_text, fontSize: element.font_size, fontFamily: element.font_family, textAlign: element.text_align,
    verticalAlign: element.vertical_align, containerId: element.container_id || null, lineHeight: element.line_height, autoResize: element.auto_resize,
    points: element.points, pressures: element.pressures, simulatePressure: element.simulate_pressure,
    startBinding: bindingToScene(element.start_binding), endBinding: bindingToScene(element.end_binding), startArrowhead: element.start_arrowhead || null,
    endArrowhead: element.end_arrowhead || null, elbowed: element.elbowed || false,
    fileId: element.file_id || null, scale: element.scale || ([1, 1] as [number, number]), crop: element.crop ? { x: element.crop.x, y: element.crop.y, width: element.crop.width, height: element.crop.height, naturalWidth: element.crop.natural_width, naturalHeight: element.crop.natural_height } : null,
    name: element.name || null,
    seed: deterministicSeed(element.id), version: 1, versionNonce: deterministicSeed(`${element.id}:version`), isDeleted: false, updated: 1, index: `a${order.toString(36).padStart(7, "0")}`,
  }));
  const files = Object.fromEntries(Object.entries(content.assets).map(([id, asset]) => [id, { id, mimeType: asset.mime_type, dataURL: asset.data_url, created: asset.created_at }]));
  return {
    elements,
    files,
    appState: { viewBackgroundColor: content.settings.background_color, gridSize: content.settings.grid_size, gridStep: 5, gridModeEnabled: content.settings.grid_enabled },
  };
}

export function parseWhiteboardContent(body: string): KnowledgeWhiteboardContent {
  try {
    const root = object(JSON.parse(body));
    if (!root || root.schema_version !== 1 || !Array.isArray(root.elements) || !object(root.assets) || !object(root.settings)) return emptyWhiteboardContent;
    const sceneElements = root.elements.map(value => {
      const raw = object(value);
      if (!raw) return null;
      return {
        ...raw,
        strokeColor: raw.stroke_color, backgroundColor: raw.background_color, fillStyle: raw.fill_style, strokeWidth: raw.stroke_width, strokeStyle: raw.stroke_style,
        groupIds: raw.group_ids, frameId: raw.frame_id, roundness: raw.roundness ? { type: raw.roundness } : null, boundElements: raw.bound_elements,
        customData: raw.custom_kind ? { knowledgeKind: raw.custom_kind } : undefined,
        originalText: raw.original_text, fontSize: raw.font_size, fontFamily: raw.font_family, textAlign: raw.text_align, verticalAlign: raw.vertical_align,
        containerId: raw.container_id, lineHeight: raw.line_height, autoResize: raw.auto_resize, simulatePressure: raw.simulate_pressure,
        startBinding: raw.start_binding ? { elementId: object(raw.start_binding)?.element_id, focus: object(raw.start_binding)?.focus, gap: object(raw.start_binding)?.gap, fixedPoint: object(raw.start_binding)?.fixed_point } : null,
        endBinding: raw.end_binding ? { elementId: object(raw.end_binding)?.element_id, focus: object(raw.end_binding)?.focus, gap: object(raw.end_binding)?.gap, fixedPoint: object(raw.end_binding)?.fixed_point } : null,
        startArrowhead: raw.start_arrowhead, endArrowhead: raw.end_arrowhead, fileId: raw.file_id,
        crop: raw.crop ? { ...object(raw.crop), naturalWidth: object(raw.crop)?.natural_width, naturalHeight: object(raw.crop)?.natural_height } : null,
      };
    }).filter(Boolean);
    const assets = Object.fromEntries(Object.entries(root.assets as UnknownObject).map(([id, value]) => {
      const asset = object(value);
      return [id, { id, mimeType: asset?.mime_type, dataURL: asset?.data_url, created: asset?.created_at }];
    }));
    const settings = root.settings as UnknownObject;
    return canonicalWhiteboardContent(sceneElements, assets, { viewBackgroundColor: settings.background_color, gridSize: settings.grid_size, gridModeEnabled: settings.grid_enabled });
  } catch {
    return emptyWhiteboardContent;
  }
}

export function whiteboardElementQuote(element: KnowledgeWhiteboardElement) {
  const explicit = element.text?.trim() || element.name?.trim();
  if (explicit) return explicit.slice(0, 1024);
  if (element.custom_kind === "sticky_note") return "便签";
  return ({ rectangle: "矩形", diamond: "菱形", ellipse: "椭圆", line: "线条", arrow: "连接线", freedraw: "自由绘制", image: "图片", frame: "画板区域", text: "文本" } as const)[element.type];
}
