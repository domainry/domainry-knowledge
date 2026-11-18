import { strFromU8, strToU8, unzipSync, zipSync } from "fflate";

const spreadsheetNamespace = "http://schemas.openxmlformats.org/spreadsheetml/2006/main";
const spreadsheetNamespacePattern = spreadsheetNamespace.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function escapePattern(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizeSpreadsheetXml(xml: string) {
  const declaration = new RegExp(`xmlns:([A-Za-z_][\\w.-]*)=["']${spreadsheetNamespacePattern}["']`, "g");
  const prefixes = [...xml.matchAll(declaration)].map(match => match[1]);
  if (prefixes.length === 0) return xml;

  let normalized = xml;
  for (const prefix of prefixes) {
    const escapedPrefix = escapePattern(prefix);
    const hasDefaultNamespace = new RegExp(`xmlns=["']${spreadsheetNamespacePattern}["']`).test(normalized);
    normalized = normalized.replace(new RegExp(`(<\\/?)${escapedPrefix}:(?=[A-Za-z_])`, "g"), "$1");
    normalized = normalized.replace(
      new RegExp(`\\s+xmlns:${escapedPrefix}=["']${spreadsheetNamespacePattern}["']`),
      hasDefaultNamespace ? "" : ` xmlns="${spreadsheetNamespace}"`,
    );
  }
  return normalized;
}

export function normalizeSpreadsheetOoxml(data: Uint8Array) {
  const files = unzipSync(data);
  let changed = false;
  for (const [name, bytes] of Object.entries(files)) {
    if (!/^xl\/.*\.xml$/i.test(name)) continue;
    const xml = strFromU8(bytes);
    const normalized = normalizeSpreadsheetXml(xml);
    if (normalized === xml) continue;
    files[name] = strToU8(normalized);
    changed = true;
  }
  return changed ? zipSync(files, { level: 6 }) : data;
}
