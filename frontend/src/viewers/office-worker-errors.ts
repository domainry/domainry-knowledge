import type { KnowledgeMessageID } from "../i18n/messages.generated.ts";

// This module is intentionally worker-safe: keep it free of React, Lingui,
// browser globals, and any dependency that evaluates process.env.
export const officeWorkerErrors = {
  archiveUnsafe: "knowledge.auto.30654fbcef2bfa6d",
  archiveExpandedTooLarge: "knowledge.auto.0b9cdfc01f22c494",
  archiveInvalid: "knowledge.auto.552c7361d3d8c8cd",
  formulaResultMissing: "knowledge.auto.42913db3d3b5eff0",
  cellTooLong: "knowledge.auto.fedae91efd350957",
  worksheetsTooMany: "knowledge.auto.ee6efc1447299260",
  worksheetTooLarge: "knowledge.auto.55c85d93fc5e34ac",
  cellsTooMany: "knowledge.auto.5bee4cdb427cff1d",
  cellAddressInvalid: "knowledge.auto.709a2e4b711558dc",
	presentationCountInvalid: "knowledge.auto.6a2a8bf8083cdf60",
	presentationTooLarge: "knowledge.auto.989c40af9fa37547",
  unknown: "knowledge.auto.9412956e890013f9",
} as const satisfies Record<string, KnowledgeMessageID>;

export type OfficeWorkerErrorCode = typeof officeWorkerErrors[keyof typeof officeWorkerErrors];

const officeWorkerErrorCodeSet = new Set<string>(Object.values(officeWorkerErrors));

export function isOfficeWorkerErrorCode(value: unknown): value is OfficeWorkerErrorCode {
  return typeof value === "string" && officeWorkerErrorCodeSet.has(value);
}
