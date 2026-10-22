import n from "./katex-DoRnZ_sp.js";
function o(r, e) {
  if (!r.trim()) return {};
  try {
    return {
      html: n.renderToString(r, {
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
    return { error: t instanceof Error ? t.message : "公式语法无效" };
  }
}
export {
  o as r
};
