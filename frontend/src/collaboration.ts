import * as Y from "yjs";

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

export function encodeKnowledgeYjsState(document: Y.Doc) {
  return encodeCollaborationBinary(Y.encodeStateAsUpdate(document));
}

export async function collaborationContentSHA256(content: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(content));
  return [...new Uint8Array(digest)].map(value => value.toString(16).padStart(2, "0")).join("");
}
