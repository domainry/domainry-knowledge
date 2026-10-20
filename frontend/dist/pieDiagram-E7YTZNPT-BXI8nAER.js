import { p as at } from "./chunk-JWPE2WC7-12CjCDKo.js";
import { $ as T, R as G, b6 as rt, g as nt, s as it, a as ot, b as st, x as lt, v as ct, _ as g, l as B, c as ut, K as dt, N as gt, a6 as pt, d as ht, C as ft, L as mt } from "./index-DrZk70qY.js";
import { p as vt } from "./cynefin-OW5HDTMX-B9bwJKt_.js";
import { d as Z } from "./arc-CpK599Xk.js";
import { o as xt } from "./ordinal-B6-f3MAq.js";
function St(t, n) {
  return n < t ? -1 : n > t ? 1 : n >= t ? 0 : NaN;
}
function yt(t) {
  return t;
}
function wt() {
  var t = yt, n = St, y = null, b = T(0), l = T(G), p = T(0);
  function i(e) {
    var r, s = (e = rt(e)).length, h, w, $ = 0, f = new Array(s), o = new Array(s), D = +b.apply(this, arguments), E = Math.min(G, Math.max(-G, l.apply(this, arguments) - D)), k, L = Math.min(Math.abs(E) / s, p.apply(this, arguments)), u = L * (E < 0 ? -1 : 1), A;
    for (r = 0; r < s; ++r)
      (A = o[f[r] = r] = +t(e[r], r, e)) > 0 && ($ += A);
    for (n != null ? f.sort(function(M, m) {
      return n(o[M], o[m]);
    }) : y != null && f.sort(function(M, m) {
      return y(e[M], e[m]);
    }), r = 0, w = $ ? (E - s * u) / $ : 0; r < s; ++r, D = k)
      h = f[r], A = o[h], k = D + (A > 0 ? A * w : 0) + u, o[h] = {
        data: e[h],
        index: r,
        value: A,
        startAngle: D,
        endAngle: k,
        padAngle: L
      };
    return o;
  }
  return i.value = function(e) {
    return arguments.length ? (t = typeof e == "function" ? e : T(+e), i) : t;
  }, i.sortValues = function(e) {
    return arguments.length ? (n = e, y = null, i) : n;
  }, i.sort = function(e) {
    return arguments.length ? (y = e, n = null, i) : y;
  }, i.startAngle = function(e) {
    return arguments.length ? (b = typeof e == "function" ? e : T(+e), i) : b;
  }, i.endAngle = function(e) {
    return arguments.length ? (l = typeof e == "function" ? e : T(+e), i) : l;
  }, i.padAngle = function(e) {
    return arguments.length ? (p = typeof e == "function" ? e : T(+e), i) : p;
  }, i;
}
var At = mt.pie, I = {
  sections: /* @__PURE__ */ new Map(),
  showData: !1
}, _ = I.sections, V = I.showData, Ct = structuredClone(At), $t = /* @__PURE__ */ g(() => structuredClone(Ct), "getConfig"), Dt = /* @__PURE__ */ g(() => {
  _ = /* @__PURE__ */ new Map(), V = I.showData, ft();
}, "clear"), Tt = /* @__PURE__ */ g(({ label: t, value: n }) => {
  if (n < 0)
    throw new Error(
      `"${t}" has invalid value: ${n}. Negative values are not allowed in pie charts. All slice values must be >= 0.`
    );
  _.has(t) || (_.set(t, n), B.debug(`added new section: ${t}, with value: ${n}`));
}, "addSection"), bt = /* @__PURE__ */ g(() => _, "getSections"), kt = /* @__PURE__ */ g((t) => {
  V = t;
}, "setShowData"), zt = /* @__PURE__ */ g(() => V, "getShowData"), q = {
  getConfig: $t,
  clear: Dt,
  setDiagramTitle: ct,
  getDiagramTitle: lt,
  setAccTitle: st,
  getAccTitle: ot,
  setAccDescription: it,
  getAccDescription: nt,
  addSection: Tt,
  getSections: bt,
  setShowData: kt,
  getShowData: zt
}, Et = /* @__PURE__ */ g((t, n) => {
  at(t, n), n.setShowData(t.showData), t.sections.map(n.addSection);
}, "populateDb"), Mt = {
  parse: /* @__PURE__ */ g(async (t) => {
    const n = await vt("pie", t);
    B.debug(n), Et(n, q);
  }, "parse")
}, Rt = /* @__PURE__ */ g((t) => `
  .pieCircle{
    stroke: ${t.pieStrokeColor};
    stroke-width : ${t.pieStrokeWidth};
    opacity : ${t.pieOpacity};
  }
  .pieCircle.highlighted{
    scale: 1.05;
    opacity: 1;
  }
  .pieCircle.highlightedOnHover:hover{
    transition-duration: 250ms;
    scale: 1.05;
    opacity: 1;
  }
  .pieOuterCircle{
    stroke: ${t.pieOuterStrokeColor};
    stroke-width: ${t.pieOuterStrokeWidth};
    fill: none;
  }
  .pieTitleText {
    text-anchor: middle;
    font-size: ${t.pieTitleTextSize};
    fill: ${t.pieTitleTextColor};
    font-family: ${t.fontFamily};
  }
  .slice {
    font-family: ${t.fontFamily};
    fill: ${t.pieSectionTextColor};
    font-size:${t.pieSectionTextSize};
    // fill: white;
  }
  .legend text {
    fill: ${t.pieLegendTextColor};
    font-family: ${t.fontFamily};
    font-size: ${t.pieLegendTextSize};
  }
`, "getStyles"), Lt = Rt, Nt = /* @__PURE__ */ g((t) => {
  const n = [...t.values()].reduce((l, p) => l + p, 0), y = [...t.entries()].map(([l, p]) => ({ label: l, value: p })).filter((l) => l.value / n * 100 >= 1);
  return wt().value((l) => l.value).sort(null)(y);
}, "createPieArcs"), Wt = /* @__PURE__ */ g((t, n, y, b) => {
  B.debug(`rendering pie chart
` + t);
  const l = b.db, p = ut(), i = dt(l.getConfig(), p.pie), e = 40, r = 18, s = 4, h = 450, w = h, $ = gt(n), f = $.append("g");
  f.attr("transform", "translate(" + w / 2 + "," + h / 2 + ")");
  const { themeVariables: o } = p;
  let [D] = pt(o.pieOuterStrokeWidth);
  D ??= 2;
  const E = i.legendPosition, k = i.textPosition, L = i.donutHole > 0 && i.donutHole <= 0.9 ? i.donutHole : 0, u = Math.min(w, h) / 2 - e, A = Z().innerRadius(L * u).outerRadius(u), M = Z().innerRadius(u * k).outerRadius(u * k), m = f.append("g");
  m.append("circle").attr("cx", 0).attr("cy", 0).attr("r", u + D / 2).attr("class", "pieOuterCircle");
  const N = l.getSections(), J = Nt(N), Q = [
    o.pie1,
    o.pie2,
    o.pie3,
    o.pie4,
    o.pie5,
    o.pie6,
    o.pie7,
    o.pie8,
    o.pie9,
    o.pie10,
    o.pie11,
    o.pie12
  ];
  let F = 0;
  N.forEach((a) => {
    F += a;
  });
  const U = J.filter((a) => (a.data.value / F * 100).toFixed(0) !== "0"), H = xt(Q).domain([
    ...N.keys()
  ]);
  m.selectAll("mySlices").data(U).enter().append("path").attr("d", A).attr("fill", (a) => H(a.data.label)).attr("class", (a) => {
    let c = "pieCircle";
    return i.highlightSlice === "hover" ? c += " highlightedOnHover" : i.highlightSlice === a.data.label && (c += " highlighted"), c;
  }), m.selectAll("mySlices").data(U).enter().append("text").text((a) => (a.data.value / F * 100).toFixed(0) + "%").attr("transform", (a) => "translate(" + M.centroid(a) + ")").style("text-anchor", "middle").attr("class", "slice");
  const Y = f.append("text").text(l.getDiagramTitle()).attr("x", 0).attr("y", -400 / 2).attr("class", "pieTitleText"), R = [...N.entries()].map(([a, c]) => ({
    label: a,
    value: c
  })), C = f.selectAll(".legend").data(R).enter().append("g").attr("class", "legend");
  C.append("rect").attr("width", r).attr("height", r).style("fill", (a) => H(a.label)).style("stroke", (a) => H(a.label)), C.append("text").attr("x", r + s).attr("y", r - s).text((a) => l.getShowData() ? `${a.label} [${a.value}]` : a.label);
  const z = Math.max(
    ...C.selectAll("text").nodes().map((a) => a?.getBoundingClientRect().width ?? 0)
  );
  let W = h, O = w + e;
  const d = r + s, P = R.length * d;
  switch (E) {
    case "center":
      C.attr("transform", (a, c) => {
        const v = d * R.length / 2, x = -z / 2 - (r + s), S = c * d - v;
        return "translate(" + x + "," + S + ")";
      });
      break;
    case "top":
      W += P, C.attr("transform", (a, c) => {
        const v = u, x = -z / 2 - (r + s), S = c * d - v;
        return `translate(${x}, ${S})`;
      }), m.attr("transform", () => `translate(0, ${P + d})`);
      break;
    case "bottom":
      W += P, C.attr("transform", (a, c) => {
        const v = -u - d, x = -z / 2 - (r + s), S = c * d - v;
        return "translate(" + x + "," + S + ")";
      });
      break;
    case "left":
      O += r + s + z, C.attr("transform", (a, c) => {
        const v = d * R.length / 2, x = -u - (r + s), S = c * d - v;
        return "translate(" + x + "," + S + ")";
      }), m.attr("transform", () => `translate(${z + r + s}, 0)`);
      break;
    default:
      O += r + s + z, C.attr("transform", (a, c) => {
        const v = d * R.length / 2, x = 12 * r, S = c * d - v;
        return "translate(" + x + "," + S + ")";
      });
      break;
  }
  const j = Y.node()?.getBoundingClientRect().width ?? 0, tt = w / 2 - j / 2, et = w / 2 + j / 2, K = Math.min(0, tt), X = Math.max(O, et) - K;
  $.attr("viewBox", `${K} 0 ${X} ${W}`), ht($, W, X, i.useMaxWidth);
}, "draw"), _t = { draw: Wt }, It = {
  parser: Mt,
  db: q,
  renderer: _t,
  styles: Lt
};
export {
  It as diagram
};
