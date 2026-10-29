import { k as a } from "./index-DYsA9s7a.js";
import o from "./katex-DoRnZ_sp.js";
function i(r, e) {
  if (!r.trim()) return {};
  try {
    return {
      html: o.renderToString(r, {
        displayMode: e,
        output: "htmlAndMathml",
        throwOnError: !0,
        strict: "error",
        trust: !1,
        maxExpand: 1e3,
        maxSize: 20
      })
    };
  } catch (t) {
    return { error: t instanceof Error ? t.message : a("knowledge.auto.17646aac0c7362fb") };
  }
}
export {
  i as r
};
