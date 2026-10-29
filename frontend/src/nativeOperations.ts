import { kt, ktf } from "./i18n/runtime.ts";
import type { KnowledgePageContentType, KnowledgePageNativeOperation } from "./types.ts";

type GridEntity = { id: string; [key: string]: unknown };
type GridRecord = GridEntity & { values?: Record<string, unknown> };
type GridContent = { schema_version?: number; fields: GridEntity[]; records: GridRecord[]; views: GridEntity[]; permissions?: unknown; automations?: unknown };
type NativeObject = Record<string, unknown>;
type SpreadsheetWorkbook = NativeObject & { id: string; sheetOrder: string[]; sheets: Record<string, NativeObject>; styles?: Record<string, unknown> };
type SpreadsheetContent = { schema_version: 1; workbook: SpreadsheetWorkbook; charts: GridEntity[]; pivots: GridEntity[]; protected_ranges: GridEntity[] };

function canonicalValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonicalValue);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value as Record<string, unknown>).sort(([left], [right]) => left.localeCompare(right)).map(([key, child]) => [key, canonicalValue(child)]));
  }
  return value;
}

export function stableNativeJSON(value: unknown) {
  return JSON.stringify(canonicalValue(value));
}

export async function nativeValueSHA256(value: unknown) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(stableNativeJSON(value)));
  return [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2, "0")).join("");
}

function parseGridContent(body: string): GridContent {
  const value = JSON.parse(body) as Partial<GridContent>;
  if (!value || !Array.isArray(value.fields) || !Array.isArray(value.records)) throw Error(kt("knowledge.auto.1fc0543c52cd5db7"));
  const entities = (items: unknown[], label: string) => items.map(item => {
    if (!item || typeof item !== "object" || typeof (item as GridEntity).id !== "string" || !(item as GridEntity).id.trim()) throw Error(ktf("knowledge.auto.a90f21eac8628f11", { value0: label }));
    return item as GridEntity;
  });
  return {
    schema_version: value.schema_version,
    fields: entities(value.fields, kt("knowledge.auto.49ecd0e342d6d23b")),
    records: entities(value.records, kt("knowledge.auto.9fad24e2c377ee89")) as GridRecord[],
    views: entities(Array.isArray(value.views) ? value.views : [], kt("knowledge.auto.1c5c067138704dda")),
    permissions: value.permissions,
    automations: value.automations,
  };
}

function entityMap<T extends GridEntity>(items: T[]) {
  return new Map(items.map(item => [item.id, item]));
}

function operationID() {
  return crypto.randomUUID();
}

function objectWithout(value: NativeObject, excluded: string[]) {
  return Object.fromEntries(Object.entries(value).filter(([key]) => !excluded.includes(key)));
}

function valueMap(value: unknown) {
  return value && typeof value === "object" && !Array.isArray(value) ? value as NativeObject : {};
}

async function changedValueOperation(target: KnowledgePageNativeOperation["target"], targetID: string, before: unknown, beforeFound: boolean, after: unknown, afterFound: boolean, parentID?: string): Promise<KnowledgePageNativeOperation | undefined> {
  if (beforeFound === afterFound && (!beforeFound || stableNativeJSON(before) === stableNativeJSON(after))) return undefined;
  if (!afterFound) return { id: operationID(), target, target_id: targetID, parent_id: parentID, action: "delete", expected_hash: await nativeValueSHA256(before) };
  return { id: operationID(), target, target_id: targetID, parent_id: parentID, action: "upsert", expected_hash: beforeFound ? await nativeValueSHA256(before) : "", value: after };
}

async function entityOperations(target: "field" | "record" | "view" | "chart" | "pivot" | "protected_range" | "node" | "edge", beforeItems: GridEntity[], afterItems: GridEntity[]) {
  const operations: KnowledgePageNativeOperation[] = [];
  const before = entityMap(beforeItems), after = entityMap(afterItems);
  for (const item of afterItems) {
    const previous = before.get(item.id);
    if (!previous || stableNativeJSON(previous) !== stableNativeJSON(item)) {
      operations.push({ id: operationID(), target, target_id: item.id, action: "upsert", expected_hash: previous ? await nativeValueSHA256(previous) : "", value: item });
    }
  }
  for (const item of beforeItems) {
    if (!after.has(item.id)) operations.push({ id: operationID(), target, target_id: item.id, action: "delete", expected_hash: await nativeValueSHA256(item) });
  }
  return operations;
}

function recordMetadata(record: GridRecord) {
  const { values: _values, ...metadata } = record;
  return metadata;
}

export async function multidimensionalTableOperations(beforeBody: string, afterBody: string): Promise<KnowledgePageNativeOperation[]> {
  const before = parseGridContent(beforeBody), after = parseGridContent(afterBody);
  const beforeRecords = entityMap(before.records), afterRecords = entityMap(after.records);
  const afterFieldIDs = new Set(after.fields.map(field => field.id));
  const operations: KnowledgePageNativeOperation[] = [];

  operations.push(...await entityOperations("field", before.fields, after.fields));
  for (const record of after.records) {
    const previous = beforeRecords.get(record.id);
    if (!previous) {
      operations.push({ id: operationID(), target: "record", target_id: record.id, action: "upsert", expected_hash: "", value: record });
      continue;
    }
    if (stableNativeJSON(recordMetadata(previous)) !== stableNativeJSON(recordMetadata(record))) {
      operations.push({ id: operationID(), target: "record", target_id: record.id, action: "upsert", expected_hash: await nativeValueSHA256(previous), value: record });
      continue;
    }
    const beforeValues = previous.values || {}, afterValues = record.values || {};
    for (const fieldID of Object.keys(afterValues)) {
      if (!afterFieldIDs.has(fieldID)) continue;
      if (!(fieldID in beforeValues) || stableNativeJSON(beforeValues[fieldID]) !== stableNativeJSON(afterValues[fieldID])) {
        operations.push({
          id: operationID(), target: "cell", target_id: record.id, parent_id: fieldID, action: "upsert",
          expected_hash: fieldID in beforeValues ? await nativeValueSHA256(beforeValues[fieldID]) : "", value: afterValues[fieldID],
        });
      }
    }
    for (const fieldID of Object.keys(beforeValues)) {
      if (afterFieldIDs.has(fieldID) && !(fieldID in afterValues)) operations.push({ id: operationID(), target: "cell", target_id: record.id, parent_id: fieldID, action: "delete", expected_hash: await nativeValueSHA256(beforeValues[fieldID]) });
    }
  }
  for (const record of before.records) {
    if (!afterRecords.has(record.id)) operations.push({ id: operationID(), target: "record", target_id: record.id, action: "delete", expected_hash: await nativeValueSHA256(record) });
  }
  operations.push(...await entityOperations("view", before.views, after.views));
  const beforeStructure = { schema_version: before.schema_version, ...(before.permissions === undefined ? {} : { permissions: before.permissions }), ...(before.automations === undefined ? {} : { automations: before.automations }) };
  const afterStructure = { schema_version: after.schema_version, ...(after.permissions === undefined ? {} : { permissions: after.permissions }), ...(after.automations === undefined ? {} : { automations: after.automations }) };
  const structure = await changedValueOperation("table_structure", "table", beforeStructure, true, afterStructure, true);
  if (structure) operations.push(structure);
  return operations;
}

function parseSpreadsheetContent(body: string): SpreadsheetContent {
  const value = JSON.parse(body) as Partial<SpreadsheetContent>;
  const workbook = value.workbook;
  if (!value || value.schema_version !== 1 || !workbook || typeof workbook.id !== "string" || !workbook.id.trim() || !Array.isArray(workbook.sheetOrder) || !workbook.sheets || typeof workbook.sheets !== "object" || Array.isArray(workbook.sheets) || !Array.isArray(value.charts) || !Array.isArray(value.pivots) || !Array.isArray(value.protected_ranges)) throw Error(kt("knowledge.auto.b58fd7af409eeebe"));
  for (const [sheetID, rawSheet] of Object.entries(workbook.sheets)) {
    if (!rawSheet || typeof rawSheet !== "object" || Array.isArray(rawSheet) || (rawSheet as NativeObject).id !== sheetID) throw Error(kt("knowledge.auto.7b50689211af462d"));
  }
  return value as SpreadsheetContent;
}

function spreadsheetCellMap(sheet: NativeObject) {
  const cells = new Map<string, NativeObject>();
  for (const [rowID, rawRow] of Object.entries(valueMap(sheet.cellData))) {
    for (const [columnID, rawCell] of Object.entries(valueMap(rawRow))) {
      if (rawCell && typeof rawCell === "object" && !Array.isArray(rawCell)) cells.set(`${rowID}:${columnID}`, rawCell as NativeObject);
    }
  }
  return cells;
}

function spreadsheetCellPartitions(cell: NativeObject | undefined) {
  const source = cell || {};
  const base = objectWithout(source, ["f", "si", "s"]);
  const formula = Object.fromEntries(["f", "si"].filter(key => key in source).map(key => [key, source[key]]));
  return {
    base: { value: base, found: Object.keys(base).length > 0 },
    formula: { value: formula, found: Object.keys(formula).length > 0 },
    style: { value: source.s, found: "s" in source },
  };
}

function spreadsheetMergeID(value: unknown) {
  const merge = valueMap(value);
  const keys = ["startRow", "startColumn", "endRow", "endColumn"];
  if (!keys.every(key => key in merge)) return "";
  return keys.map(key => String(merge[key])).join(":");
}

async function spreadsheetMapOperations(target: "style" | "merge" | "asset", before: Map<string, unknown>, after: Map<string, unknown>, parentID?: string) {
  const operations: KnowledgePageNativeOperation[] = [];
  for (const [id, value] of after) {
    const operation = await changedValueOperation(target, id, before.get(id), before.has(id), value, true, parentID);
    if (operation) operations.push(operation);
  }
  for (const [id, value] of before) {
    if (!after.has(id)) operations.push({ id: operationID(), target, target_id: id, parent_id: parentID, action: "delete", expected_hash: await nativeValueSHA256(value) });
  }
  return operations;
}

export async function spreadsheetOperations(beforeBody: string, afterBody: string): Promise<KnowledgePageNativeOperation[]> {
  const before = parseSpreadsheetContent(beforeBody), after = parseSpreadsheetContent(afterBody);
  const beforeWorkbook = before.workbook, afterWorkbook = after.workbook;
  if (beforeWorkbook.id !== afterWorkbook.id || before.schema_version !== after.schema_version) throw Error(kt("knowledge.auto.a30801eed757a248"));
  const operations: KnowledgePageNativeOperation[] = [];
  for (const [sheetID, sheet] of Object.entries(beforeWorkbook.sheets)) {
    if (!(sheetID in afterWorkbook.sheets)) operations.push({ id: operationID(), target: "sheet", target_id: sheetID, action: "delete", expected_hash: await nativeValueSHA256(sheet) });
  }
  for (const [sheetID, afterSheet] of Object.entries(afterWorkbook.sheets)) {
    const beforeSheet = beforeWorkbook.sheets[sheetID];
    if (!beforeSheet) {
      operations.push({ id: operationID(), target: "sheet", target_id: sheetID, action: "upsert", expected_hash: "", value: afterSheet });
      continue;
    }
    const beforeStructure = objectWithout(beforeSheet, ["cellData", "mergeData"]), afterStructure = objectWithout(afterSheet, ["cellData", "mergeData"]);
    const structure = await changedValueOperation("sheet_structure", sheetID, beforeStructure, true, afterStructure, true);
    if (structure) operations.push(structure);

    const beforeCells = spreadsheetCellMap(beforeSheet), afterCells = spreadsheetCellMap(afterSheet);
    const cellIDs = new Set([...beforeCells.keys(), ...afterCells.keys()]);
    for (const cellID of cellIDs) {
      const previous = spreadsheetCellPartitions(beforeCells.get(cellID)), next = spreadsheetCellPartitions(afterCells.get(cellID));
      const base = await changedValueOperation("cell", cellID, previous.base.value, previous.base.found, next.base.value, next.base.found, sheetID);
      const formula = await changedValueOperation("formula", cellID, previous.formula.value, previous.formula.found, next.formula.value, next.formula.found, sheetID);
      const style = await changedValueOperation("cell_style", cellID, previous.style.value, previous.style.found, next.style.value, next.style.found, sheetID);
      if (base) operations.push(base);
      if (formula) operations.push(formula);
      if (style) operations.push(style);
    }
    const mergeMap = (sheet: NativeObject) => new Map((Array.isArray(sheet.mergeData) ? sheet.mergeData : []).map(merge => [spreadsheetMergeID(merge), merge]).filter(([id]) => Boolean(id)) as [string, unknown][]);
    operations.push(...await spreadsheetMapOperations("merge", mergeMap(beforeSheet), mergeMap(afterSheet), sheetID));
  }
  const beforeStyles = new Map(Object.entries(valueMap(beforeWorkbook.styles))), afterStyles = new Map(Object.entries(valueMap(afterWorkbook.styles)));
  operations.push(...await spreadsheetMapOperations("style", beforeStyles, afterStyles));
  const beforeStructure = objectWithout(beforeWorkbook, ["sheets", "styles"]), afterStructure = objectWithout(afterWorkbook, ["sheets", "styles"]);
  const workbook = await changedValueOperation("workbook_structure", beforeWorkbook.id, beforeStructure, true, afterStructure, true);
  if (workbook) operations.push(workbook);
  operations.push(...await entityOperations("chart", before.charts, after.charts));
  operations.push(...await entityOperations("pivot", before.pivots, after.pivots));
  operations.push(...await entityOperations("protected_range", before.protected_ranges, after.protected_ranges));
  return operations;
}

function parseGraphContent(body: string) {
  const value = JSON.parse(body) as NativeObject;
  if (!value || typeof value !== "object" || Array.isArray(value)) throw Error(kt("knowledge.auto.5098693a4e7eb247"));
  return value;
}

function graphEntities(value: unknown, label: string) {
  if (!Array.isArray(value)) throw Error(ktf("knowledge.auto.75575979923acfa0", { value0: label }));
  return value.map(item => {
    if (!item || typeof item !== "object" || Array.isArray(item) || typeof (item as GridEntity).id !== "string" || !(item as GridEntity).id.trim()) throw Error(ktf("knowledge.auto.a90f21eac8628f11", { value0: label }));
    return item as GridEntity;
  });
}

async function graphStructureOperation(before: NativeObject, after: NativeObject, excluded: string[]) {
  const previous = objectWithout(before, excluded), next = objectWithout(after, excluded);
  return changedValueOperation("graph_structure", "graph", previous, true, next, true);
}

export async function whiteboardOperations(beforeBody: string, afterBody: string) {
  const before = parseGraphContent(beforeBody), after = parseGraphContent(afterBody);
  const beforeElements = graphEntities(before.elements, kt("knowledge.auto.eafe43d688a730d6")), afterElements = graphEntities(after.elements, kt("knowledge.auto.eafe43d688a730d6"));
  const isEdge = (item: GridEntity) => item.type === "arrow" || item.type === "line";
  const operations = [
    ...await entityOperations("node", beforeElements.filter(item => !isEdge(item)), afterElements.filter(item => !isEdge(item))),
    ...await entityOperations("edge", beforeElements.filter(isEdge), afterElements.filter(isEdge)),
  ];
  const structure = await graphStructureOperation(before, after, ["elements"]);
  if (structure) operations.push(structure);
  return operations;
}

export async function flowchartOperations(beforeBody: string, afterBody: string) {
  const before = parseGraphContent(beforeBody), after = parseGraphContent(afterBody);
  const operations = [
    ...await entityOperations("node", graphEntities(before.nodes, kt("knowledge.auto.3b48ee9d9e952403")), graphEntities(after.nodes, kt("knowledge.auto.3b48ee9d9e952403"))),
    ...await entityOperations("edge", graphEntities(before.edges, kt("knowledge.auto.39f3b6080baa03b2")), graphEntities(after.edges, kt("knowledge.auto.39f3b6080baa03b2"))),
  ];
  const structure = await graphStructureOperation(before, after, ["nodes", "edges"]);
  if (structure) operations.push(structure);
  return operations;
}

type MindMapNodeState = { node: GridEntity; parent_id: string; index: number };

function mindMapNodes(root: NativeObject) {
  const result: MindMapNodeState[] = [];
  const visit = (raw: unknown, parentID: string, index: number) => {
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) throw Error(kt("knowledge.auto.e149d6350231122b"));
    const value = raw as GridEntity & { children?: unknown[] };
    if (typeof value.id !== "string" || !value.id.trim()) throw Error(kt("knowledge.auto.132d11377fd5d921"));
    const { children = [], ...node } = value;
    if (!Array.isArray(children)) throw Error(kt("knowledge.auto.2e926890dbba7ef5"));
    result.push({ node, parent_id: parentID, index });
    children.forEach((child, childIndex) => visit(child, value.id, childIndex));
  };
  visit(root, "", 0);
  return result;
}

export async function mindMapOperations(beforeBody: string, afterBody: string) {
  const beforeEnvelope = parseGraphContent(beforeBody), afterEnvelope = parseGraphContent(afterBody);
  const before = valueMap(beforeEnvelope.root), after = valueMap(afterEnvelope.root);
  const beforeNodes = mindMapNodes(before), afterNodes = mindMapNodes(after);
  const beforeMap = new Map(beforeNodes.map(state => [state.node.id, state])), afterMap = new Map(afterNodes.map(state => [state.node.id, state]));
  const operations: KnowledgePageNativeOperation[] = [];
  for (const state of afterNodes) {
    const previous = beforeMap.get(state.node.id);
    const operation = await changedValueOperation("node", state.node.id, previous, Boolean(previous), state, true);
    if (operation) operations.push(operation);
  }
  for (const state of beforeNodes) {
    if (afterMap.has(state.node.id)) continue;
    if (state.parent_id && !afterMap.has(state.parent_id)) continue;
    operations.push({ id: operationID(), target: "node", target_id: state.node.id, action: "delete", expected_hash: await nativeValueSHA256(state) });
  }
  operations.push(...await entityOperations("edge", graphEntities(beforeEnvelope.relations, kt("knowledge.auto.a0162de5a91358d2")), graphEntities(afterEnvelope.relations, kt("knowledge.auto.a0162de5a91358d2"))));
  const previousStructure = objectWithout(beforeEnvelope, ["root", "relations"]), nextStructure = objectWithout(afterEnvelope, ["root", "relations"]);
  const structure = await changedValueOperation("graph_structure", "graph", previousStructure, true, nextStructure, true);
  if (structure) operations.push(structure);
  return operations;
}

type PresentationSlide = GridEntity & { elements?: GridEntity[]; files?: Record<string, unknown> };

function presentationSlides(root: NativeObject) {
  return graphEntities(root.slides, kt("knowledge.auto.81574e23e48aec6b")) as PresentationSlide[];
}

function presentationStructure(root: NativeObject, slides: PresentationSlide[]) {
  return { ...objectWithout(root, ["slides"]), slide_order: slides.map(slide => slide.id) };
}

export async function presentationOperations(beforeBody: string, afterBody: string) {
  const beforeRoot = parseGraphContent(beforeBody), afterRoot = parseGraphContent(afterBody);
  const before = presentationSlides(beforeRoot), after = presentationSlides(afterRoot);
  const beforeMap = entityMap(before), afterMap = entityMap(after);
  const operations: KnowledgePageNativeOperation[] = [];
  for (const slide of before) {
    if (!afterMap.has(slide.id)) operations.push({ id: operationID(), target: "slide", target_id: slide.id, action: "delete", expected_hash: await nativeValueSHA256(slide) });
  }
  for (const slide of after) {
    const previous = beforeMap.get(slide.id);
    if (!previous) {
      operations.push({ id: operationID(), target: "slide", target_id: slide.id, action: "upsert", expected_hash: "", value: slide });
      continue;
    }
    const previousMeta = objectWithout(previous, ["elements", "files"]), nextMeta = objectWithout(slide, ["elements", "files"]);
    const metadata = await changedValueOperation("slide", slide.id, previousMeta, true, nextMeta, true);
    if (metadata) operations.push(metadata);
    const elementOps = await entityOperations("node", graphEntities(Array.isArray(previous.elements) ? previous.elements : [], kt("knowledge.auto.9907f68b8bba694d")), graphEntities(Array.isArray(slide.elements) ? slide.elements : [], kt("knowledge.auto.9907f68b8bba694d")));
    operations.push(...elementOps.map(operation => ({ ...operation, target: "element" as const, parent_id: slide.id })));
    operations.push(...await spreadsheetMapOperations("asset", new Map(Object.entries(valueMap(previous.files))), new Map(Object.entries(valueMap(slide.files))), slide.id));
  }
  const previousStructure = presentationStructure(beforeRoot, before), nextStructure = presentationStructure(afterRoot, after);
  const structure = await changedValueOperation("presentation_structure", "presentation", previousStructure, true, nextStructure, true);
  if (structure) operations.push(structure);
  return operations;
}

function formComponents(root: NativeObject) {
  if (!Array.isArray(root.components)) throw Error(kt("knowledge.auto.c91dc6c1e7916956"));
  return root.components.map(item => {
    if (!item || typeof item !== "object" || Array.isArray(item) || typeof (item as NativeObject).key !== "string" || !(item as NativeObject).key) throw Error(kt("knowledge.auto.5ab1aa88248018de"));
    return item as NativeObject & { key: string };
  });
}

function formStructure(root: NativeObject, components: Array<NativeObject & { key: string }>) {
  return { ...objectWithout(root, ["components"]), component_order: components.map(component => component.key) };
}

export async function formOperations(beforeBody: string, afterBody: string) {
  const beforeRoot = parseGraphContent(beforeBody), afterRoot = parseGraphContent(afterBody);
  const before = formComponents(beforeRoot), after = formComponents(afterRoot);
  const beforeMap = new Map(before.map(component => [component.key, component])), afterMap = new Map(after.map(component => [component.key, component]));
  const operations: KnowledgePageNativeOperation[] = [];
  for (const component of after) {
    const operation = await changedValueOperation("component", component.key, beforeMap.get(component.key), beforeMap.has(component.key), component, true);
    if (operation) operations.push(operation);
  }
  for (const component of before) {
    if (!afterMap.has(component.key)) operations.push({ id: operationID(), target: "component", target_id: component.key, action: "delete", expected_hash: await nativeValueSHA256(component) });
  }
  const previousStructure = formStructure(beforeRoot, before), nextStructure = formStructure(afterRoot, after);
  const structure = await changedValueOperation("form_structure", "form", previousStructure, true, nextStructure, true);
  if (structure) operations.push(structure);
  return operations;
}

export async function nativePageOperations(contentType: KnowledgePageContentType, beforeBody: string, afterBody: string) {
  switch (contentType) {
    case "multidimensional_table": return multidimensionalTableOperations(beforeBody, afterBody);
    case "spreadsheet": return spreadsheetOperations(beforeBody, afterBody);
    case "whiteboard": return whiteboardOperations(beforeBody, afterBody);
    case "mind_map": return mindMapOperations(beforeBody, afterBody);
    case "flowchart": return flowchartOperations(beforeBody, afterBody);
    case "presentation": return presentationOperations(beforeBody, afterBody);
    case "form": return formOperations(beforeBody, afterBody);
    default: return undefined;
  }
}
