import assert from "node:assert/strict";
import test from "node:test";
import { taskDateTimeInputValue, taskDateTimeISO } from "../src/editors/task.ts";

test("task date-time values round-trip through the browser-local control", () => {
  const source = "2026-10-21T08:30:00.000Z";
  assert.equal(taskDateTimeISO(taskDateTimeInputValue(source)), source);
});

test("task date-time helpers reject empty and invalid values", () => {
  assert.equal(taskDateTimeInputValue(), "");
  assert.equal(taskDateTimeInputValue("not-a-date"), "");
  assert.equal(taskDateTimeISO(""), undefined);
  assert.equal(taskDateTimeISO("not-a-date"), undefined);
});
