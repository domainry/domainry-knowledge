import { kt, ktf } from "../i18n/runtime.ts";
import type { OfficeResult } from "./office-types.ts";
import { isOfficeWorkerErrorCode, officeWorkerErrors } from "./office-worker-errors.ts";

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
    worker.onmessage = event => {
      const errorCode = event.data?.error_code;
      if (errorCode !== undefined) {
        done(Error(kt(isOfficeWorkerErrorCode(errorCode) ? errorCode : officeWorkerErrors.unknown)));
        return;
      }
		const value = event.data as OfficeResult;
		for (const sheet of value.sheets || []) {
			for (const cell of sheet.cells) {
				if (cell.text === officeWorkerErrors.formulaResultMissing) cell.text = kt(officeWorkerErrors.formulaResultMissing);
			}
		}
		for (const slide of value.slides || []) {
			if (!slide.title) slide.title = ktf("knowledge.auto.48df1e72ddb395f6", { value0: slide.number });
		}
		done(undefined, value);
    };
    worker.postMessage({ data, kind }, [data]);
  });
}
