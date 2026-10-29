import { kt } from "../i18n/runtime.ts";
import type { OfficeResult } from "./office-types.ts";

export async function loadOffice(blob: Blob, kind: "docx" | "xlsx" | "pptx", signal: AbortSignal): Promise<OfficeResult> {
  const data = await blob.arrayBuffer();
  signal.throwIfAborted();
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL("./office-worker.ts", import.meta.url), { type: "module" });
    const done = (error?: Error, value?: OfficeResult) => {
      clearTimeout(timer);
      worker.terminate();
      signal.removeEventListener("abort", abort);
      if (error) reject(error); else resolve(value!);
    };
    const abort = () => done(new DOMException("Aborted", "AbortError"));
    const timer = setTimeout(() => done(Error(kt("knowledge.auto.e82f90dc589b343a"))), 20_000);
    signal.addEventListener("abort", abort, { once: true });
    worker.onerror = () => done(Error(kt("knowledge.auto.827d729c9e25b65d")));
    worker.onmessage = event => event.data.error ? done(Error(event.data.error)) : done(undefined, event.data);
    worker.postMessage({ data, kind }, [data]);
  });
}
