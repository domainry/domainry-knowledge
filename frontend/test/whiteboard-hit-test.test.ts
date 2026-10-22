import assert from "node:assert/strict";
import test from "node:test";
import type { ExcalidrawElement } from "@excalidraw/excalidraw/element/types";
import { pickWhiteboardElement } from "../src/editors/whiteboardHitTest.ts";

function element(value: Partial<ExcalidrawElement> & Pick<ExcalidrawElement, "id" | "type">) {
  return {
    x: 0, y: 0, width: 100, height: 60, angle: 0, strokeWidth: 2, isDeleted: false,
    ...value,
  } as ExcalidrawElement;
}

test("whiteboard hit test returns the topmost visible element", () => {
  const back = element({ id: "back", type: "rectangle" });
  const front = element({ id: "front", type: "text", x: 20, y: 15, width: 60, height: 30 });
  assert.equal(pickWhiteboardElement([back, front], 50, 30)?.id, "front");
  assert.equal(pickWhiteboardElement([back, { ...front, isDeleted: true }], 50, 30)?.id, "back");
});

test("whiteboard hit test follows rotated and non-rectangular geometry", () => {
  const diamond = element({ id: "diamond", type: "diamond" });
  assert.equal(pickWhiteboardElement([diamond], 50, 30)?.id, "diamond");
  assert.equal(pickWhiteboardElement([diamond], 2, 2), null);
  const rotated = element({ id: "rotated", type: "rectangle", width: 80, height: 20, angle: Math.PI / 2 });
  assert.equal(pickWhiteboardElement([rotated], 40, 50)?.id, "rotated");
  assert.equal(pickWhiteboardElement([rotated], 5, 5), null);
});

test("whiteboard hit test makes thin connectors selectable at every zoom", () => {
  const arrow = element({ id: "arrow", type: "arrow", width: 100, height: 0, points: [[0, 0], [100, 0]] });
  assert.equal(pickWhiteboardElement([arrow], 50, 5, 1)?.id, "arrow");
  assert.equal(pickWhiteboardElement([arrow], 50, 20, 1), null);
});
