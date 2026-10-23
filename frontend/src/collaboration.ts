import * as Y from "yjs";
import type { KnowledgeCollaborationPresence } from "./types.ts";

export function collaborationPresenceUserIDs(presence: readonly KnowledgeCollaborationPresence[]) {
  return [...new Set(presence.map(item => item.user_id).filter(Boolean))].sort();
}

export function collaborationPositionChanged(current: { cursor: string; selection: string }, cursorBlockID?: string, selectionBlockID?: string) {
  return current.cursor !== (cursorBlockID || "") || current.selection !== (selectionBlockID || "");
}

export function encodeCollaborationBinary(value: Uint8Array) {
  let binary = "";
  const chunkSize = 0x8000;
  for (let offset = 0; offset < value.length; offset += chunkSize) {
    binary += String.fromCharCode(...value.subarray(offset, offset + chunkSize));
  }
  return btoa(binary);
}

export function decodeCollaborationBinary(value: string) {
  const binary = atob(value);
  const decoded = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index++) decoded[index] = binary.charCodeAt(index);
  return decoded;
}

export function applyKnowledgeYjsState(document: Y.Doc, encodedState?: string) {
  if (!encodedState) return false;
  Y.applyUpdate(document, decodeCollaborationBinary(encodedState), "knowledge-remote");
  return true;
}

export function applyKnowledgeYjsUpdate(document: Y.Doc, encodedUpdate?: string) {
  if (!encodedUpdate) return false;
  Y.applyUpdate(document, decodeCollaborationBinary(encodedUpdate), "knowledge-remote");
  return true;
}

export function mergeKnowledgeYjsUpdates(updates: Uint8Array[]) {
  if (updates.length === 0) return "";
  return encodeCollaborationBinary(updates.length === 1 ? updates[0] : Y.mergeUpdates(updates));
}

export function encodeKnowledgeYjsState(document: Y.Doc) {
  return encodeCollaborationBinary(Y.encodeStateAsUpdate(document));
}

export async function collaborationContentSHA256(content: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(content));
  return [...new Uint8Array(digest)].map(value => value.toString(16).padStart(2, "0")).join("");
}
