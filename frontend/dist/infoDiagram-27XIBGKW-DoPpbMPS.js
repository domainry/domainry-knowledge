import { _ as e, l as s, M as o, d as i } from "./index-CI5LPyFC.js";
import { p as g } from "./cynefin-OW5HDTMX-B9bwJKt_.js";
var d = {
  parse: /* @__PURE__ */ e(async (r) => {
    const a = await g("info", r);
    s.debug(a);
  }, "parse")
}, p = {
  version: "11.17.2"
}, v = /* @__PURE__ */ e(() => p.version, "getVersion"), m = {
  getVersion: v
}, c = /* @__PURE__ */ e((r, a, n) => {
  s.debug(`rendering info diagram
` + r);
  const t = o(a);
  i(t, 100, 400, !0), t.append("g").append("text").attr("x", 100).attr("y", 40).attr("class", "version").attr("font-size", 32).style("text-anchor", "middle").text(`v${n}`);
}, "draw"), l = { draw: c }, _ = {
  parser: d,
  db: m,
  renderer: l
};
export {
  _ as diagram
};
