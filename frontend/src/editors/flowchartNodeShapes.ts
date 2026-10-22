import LogicFlow, { CircleNode, CircleNodeModel, h, RectNode, RectNodeModel } from "@logicflow/core";
import type { FlowchartNodeType } from "../diagramContent.ts";

const customRuntimeTypes: Partial<Record<FlowchartNodeType, string>> = {
  subprocess: "knowledge-subprocess",
  user_task: "knowledge-user-task",
  service_task: "knowledge-service-task",
  data: "knowledge-data",
  database: "knowledge-database",
  document: "knowledge-document",
  manual_input: "knowledge-manual-input",
  preparation: "knowledge-preparation",
  delay: "knowledge-delay",
  connector: "knowledge-connector",
  annotation: "knowledge-annotation",
};

const builtinRuntimeTypes: Partial<Record<FlowchartNodeType, string>> = {
  start: "ellipse",
  end: "ellipse",
  process: "rect",
  decision: "diamond",
};

export function runtimeFlowchartNodeType(type: FlowchartNodeType) {
  return customRuntimeTypes[type] || builtinRuntimeTypes[type] || "rect";
}

type RectShape = (model: RectNodeModel) => any;

function shapeStyle(model: RectNodeModel) {
  const style = model.getNodeStyle();
  return {
    fill: style.fill,
    stroke: style.stroke,
    strokeWidth: style.strokeWidth,
    strokeLinejoin: "round",
    strokeLinecap: "round",
  };
}

function lineStyle(model: RectNodeModel) {
  const style = shapeStyle(model);
  return { fill: "none", stroke: style.stroke, strokeWidth: style.strokeWidth, strokeLinejoin: "round", strokeLinecap: "round" };
}

function rectShape(model: RectNodeModel) {
  const { x, y, width, height, radius } = model;
  return h("rect", { ...shapeStyle(model), x: x - width / 2, y: y - height / 2, width, height, rx: radius, ry: radius });
}

function rectNode(type: string, shape: RectShape, size: { width?: number; height?: number; radius?: number } = {}) {
  class KnowledgeFlowNodeModel extends RectNodeModel {
    setAttributes() {
      super.setAttributes();
      this.width = size.width || 158;
      this.height = size.height || 72;
      this.radius = size.radius ?? 10;
    }
  }
  class KnowledgeFlowNodeView extends RectNode {
    getShape() { return shape(this.props.model); }
  }
  return { type, view: KnowledgeFlowNodeView, model: KnowledgeFlowNodeModel };
}

const subprocess = rectNode("knowledge-subprocess", model => {
  const { x, y, width, height } = model;
  const inset = 12;
  return h("g", {}, [
    rectShape(model),
    h("line", { ...lineStyle(model), x1: x - width / 2 + inset, y1: y - height / 2, x2: x - width / 2 + inset, y2: y + height / 2 }),
    h("line", { ...lineStyle(model), x1: x + width / 2 - inset, y1: y - height / 2, x2: x + width / 2 - inset, y2: y + height / 2 }),
  ]);
});

const userTask = rectNode("knowledge-user-task", model => {
  const { x, y, width, height } = model;
  const iconX = x - width / 2 + 19;
  const iconY = y - height / 2 + 19;
  return h("g", {}, [
    rectShape(model),
    h("circle", { ...lineStyle(model), cx: iconX, cy: iconY - 4, r: 4 }),
    h("path", { ...lineStyle(model), d: `M ${iconX - 7} ${iconY + 8} Q ${iconX} ${iconY} ${iconX + 7} ${iconY + 8}` }),
  ]);
});

const serviceTask = rectNode("knowledge-service-task", model => {
  const { x, y, width, height } = model;
  const cx = x - width / 2 + 20;
  const cy = y - height / 2 + 20;
  const lines = Array.from({ length: 8 }, (_, index) => {
    const angle = index * Math.PI / 4;
    return h("line", {
      ...lineStyle(model),
      x1: cx + Math.cos(angle) * 7,
      y1: cy + Math.sin(angle) * 7,
      x2: cx + Math.cos(angle) * 11,
      y2: cy + Math.sin(angle) * 11,
    });
  });
  return h("g", {}, [rectShape(model), h("circle", { ...lineStyle(model), cx, cy, r: 6 }), h("circle", { ...shapeStyle(model), cx, cy, r: 2 }), ...lines]);
});

const data = rectNode("knowledge-data", model => {
  const { x, y, width, height } = model;
  const slant = 20;
  return h("path", { ...shapeStyle(model), d: `M ${x - width / 2 + slant} ${y - height / 2} H ${x + width / 2} L ${x + width / 2 - slant} ${y + height / 2} H ${x - width / 2} Z` });
});

const database = rectNode("knowledge-database", model => {
  const { x, y, width, height } = model;
  const left = x - width / 2;
  const right = x + width / 2;
  const top = y - height / 2;
  const bottom = y + height / 2;
  const arc = 14;
  return h("g", {}, [
    h("path", { ...shapeStyle(model), d: `M ${left} ${top + arc} C ${left} ${top - 3}, ${right} ${top - 3}, ${right} ${top + arc} V ${bottom - arc} C ${right} ${bottom + 3}, ${left} ${bottom + 3}, ${left} ${bottom - arc} Z` }),
    h("path", { ...lineStyle(model), d: `M ${left} ${top + arc} C ${left} ${top + arc * 2}, ${right} ${top + arc * 2}, ${right} ${top + arc}` }),
    h("path", { ...lineStyle(model), d: `M ${left} ${bottom - arc} C ${left} ${bottom}, ${right} ${bottom}, ${right} ${bottom - arc}` }),
  ]);
}, { height: 82 });

const document = rectNode("knowledge-document", model => {
  const { x, y, width, height } = model;
  const left = x - width / 2;
  const right = x + width / 2;
  const top = y - height / 2;
  const bottom = y + height / 2;
  return h("path", { ...shapeStyle(model), d: `M ${left} ${top} H ${right} V ${bottom - 12} C ${right - 28} ${bottom + 7}, ${right - 55} ${bottom - 25}, ${x} ${bottom - 10} C ${x - 38} ${bottom + 3}, ${left + 26} ${bottom - 17}, ${left} ${bottom - 7} Z` });
}, { height: 82, radius: 0 });

const manualInput = rectNode("knowledge-manual-input", model => {
  const { x, y, width, height } = model;
  return h("path", { ...shapeStyle(model), d: `M ${x - width / 2 + 20} ${y - height / 2} H ${x + width / 2} V ${y + height / 2} H ${x - width / 2} Z` });
});

const preparation = rectNode("knowledge-preparation", model => {
  const { x, y, width, height } = model;
  const inset = 22;
  return h("path", { ...shapeStyle(model), d: `M ${x - width / 2 + inset} ${y - height / 2} H ${x + width / 2 - inset} L ${x + width / 2} ${y} L ${x + width / 2 - inset} ${y + height / 2} H ${x - width / 2 + inset} L ${x - width / 2} ${y} Z` });
});

const delay = rectNode("knowledge-delay", model => {
  const { x, y, width, height } = model;
  const left = x - width / 2;
  const right = x + width / 2;
  const top = y - height / 2;
  const bottom = y + height / 2;
  return h("path", { ...shapeStyle(model), d: `M ${left} ${top} H ${x + width / 4} C ${right + 12} ${top}, ${right + 12} ${bottom}, ${x + width / 4} ${bottom} H ${left} Z` });
});

const annotation = rectNode("knowledge-annotation", model => {
  const { x, y, width, height } = model;
  const left = x - width / 2;
  const right = x + width / 2;
  const top = y - height / 2;
  const bottom = y + height / 2;
  const fold = 18;
  return h("g", {}, [
    h("path", { ...shapeStyle(model), d: `M ${left} ${top} H ${right - fold} L ${right} ${top + fold} V ${bottom} H ${left} Z` }),
    h("path", { ...lineStyle(model), d: `M ${right - fold} ${top} V ${top + fold} H ${right}` }),
  ]);
}, { width: 172, height: 84, radius: 0 });

class ConnectorModel extends CircleNodeModel {
  setAttributes() {
    super.setAttributes();
    this.r = 31;
  }
}

const connector = { type: "knowledge-connector", view: CircleNode, model: ConnectorModel };

const customNodes = [subprocess, userTask, serviceTask, data, database, document, manualInput, preparation, delay, connector, annotation];

export function registerFlowchartNodeShapes(lf: LogicFlow) {
  customNodes.forEach(node => lf.register(node));
}
