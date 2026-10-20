import { C as t, N as r } from "./chunk-EIO257PC-DHYLl5Up.js";
import "./CanvasEditor-Bb1W3S-x.js";
var m = import.meta.url ? new URL(import.meta.url) : void 0;
typeof window > "u" && typeof self < "u" && (self.onmessage = async (a) => {
  if (a.data.command === t.Subset) {
    let e = await r(a.data.arrayBuffer, a.data.codePoints);
    self.postMessage(e, { transfer: [e] });
  }
});
export {
  m as WorkerUrl
};
