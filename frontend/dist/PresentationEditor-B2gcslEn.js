import { jsxs as d, jsx as a, Fragment as q } from "react/jsx-runtime";
import { d as Ee, P as $e, B as E, k as i, S as I, e as Fe, f as Le, g as Re, h as de, a as O, i as ne, j as De, l as je, n as z, o as D, q as Ae } from "./index-DX1MhiVi.js";
import { useMemo as Ue, useState as A, useRef as J, useEffect as K } from "react";
import { createPortal as We } from "react-dom";
import { r as Ie } from "./katex.min-Cuw_RM0m.js";
import { FileDown as He, Maximize2 as Be, Type as Xe, RectangleHorizontal as Ge, ChevronDown as Q, Table2 as Ye, BarChart3 as qe, Sigma as Oe, Braces as Ke, ImagePlus as Ve, MonitorPlay as Je, Plus as Qe, ChevronUp as ce, Copy as Ze, Trash2 as ue, AlignLeft as et, AlignCenter as tt, AlignRight as at, X as ot, Video as it } from "lucide-react";
import { s as he } from "./documentTransfer-CcKmwcrB.js";
const se = /^knowledge-document:kdoc_[a-f0-9]{32}$/, Z = {
  get rectangle() {
    return i("knowledge.auto.88b75a101595a23a");
  },
  get rounded_rectangle() {
    return i("knowledge.auto.ff2a1ce911fc64f1");
  },
  get ellipse() {
    return i("knowledge.auto.7cd7a8146fca51e0");
  },
  get triangle() {
    return i("knowledge.auto.3ecb2130838315af");
  },
  get diamond() {
    return i("knowledge.auto.960748c01415d344");
  },
  get hexagon() {
    return i("knowledge.auto.8d27753418bad716");
  },
  get star() {
    return i("knowledge.auto.59983f97d2e08a29");
  },
  get arrow_right() {
    return i("knowledge.auto.e0ed6e5879472601");
  },
  get callout() {
    return i("knowledge.auto.be37540cc9d42c17");
  },
  get line() {
    return i("knowledge.auto.c94b5ebf51692703");
  }
}, pe = {
  get column() {
    return i("knowledge.auto.8aece403ca0b24e6");
  },
  get bar() {
    return i("knowledge.auto.a7cdeaf06b1273ad");
  },
  get line() {
    return i("knowledge.auto.c24656699bd0194b");
  },
  get area() {
    return i("knowledge.auto.20068d3d65236e97");
  },
  get pie() {
    return i("knowledge.auto.86f348d657451e11");
  },
  get donut() {
    return i("knowledge.auto.7777709a84485768");
  }
}, N = ["#00856A", "#4E7FEC", "#F0A93B", "#D45C7D", "#7559C7", "#21A6A1"];
function F(e) {
  return `${e}-${crypto.randomUUID()}`;
}
function C(e) {
  return e.replace(/^#/, "").toUpperCase();
}
function lt(e) {
  if (typeof e == "string") return se.test(e) ? e : "";
  const u = e && typeof e.props == "object" && e.props ? e.props : {}, h = String(u.url || e.url || "");
  return se.test(h) ? h : "";
}
async function rt(e) {
  return await new Promise((u, h) => {
    const s = new FileReader();
    s.onload = () => u(String(s.result || "")), s.onerror = () => h(s.error || Error(i("knowledge.auto.249712fb6b44bc47"))), s.readAsDataURL(e);
  });
}
function nt({ asset: e, readFile: u, thumbnail: h = !1 }) {
  const [s, t] = A(""), [w, p] = A(!1);
  return K(() => {
    let o = !0, n = "";
    if (!u) {
      p(!0);
      return;
    }
    return p(!1), u(e.document_ref).then((r) => {
      o && (n = URL.createObjectURL(r), t(n));
    }).catch(() => {
      o && p(!0);
    }), () => {
      o = !1, n && URL.revokeObjectURL(n);
    };
  }, [e.document_ref, u]), w ? /* @__PURE__ */ a("span", { className: "presentation-media-state", children: i("knowledge.auto.726a3a5882878961") }) : s ? e.mime_type.startsWith("video/") ? h ? /* @__PURE__ */ d("span", { className: "presentation-video-thumbnail", children: [
    /* @__PURE__ */ a(it, { size: 20 }),
    i("knowledge.auto.c20f7618d330a854")
  ] }) : /* @__PURE__ */ a("video", { src: s, controls: !0 }) : /* @__PURE__ */ a("img", { src: s, alt: e.filename, draggable: !1 }) : /* @__PURE__ */ a("span", { className: "presentation-media-state", children: i("knowledge.auto.21bd738e0d7191a7") });
}
function st(e) {
  return {
    left: `${e.x / z * 100}%`,
    top: `${e.y / D * 100}%`,
    width: `${e.width / z * 100}%`,
    height: `${e.height / D * 100}%`,
    transform: `rotate(${e.rotation}deg)`
  };
}
function fe({ shape: e, fill: u, stroke: h, strokeWidth: s }) {
  const t = { fill: e === "line" ? "none" : u, stroke: h, strokeWidth: Math.max(0, s), vectorEffect: "non-scaling-stroke" };
  return /* @__PURE__ */ d("svg", { className: "presentation-shape-graphic", viewBox: "0 0 100 100", preserveAspectRatio: "none", "aria-hidden": "true", children: [
    e === "rectangle" && /* @__PURE__ */ a("rect", { x: "2", y: "2", width: "96", height: "96", ...t }),
    e === "rounded_rectangle" && /* @__PURE__ */ a("rect", { x: "2", y: "2", width: "96", height: "96", rx: "14", ry: "14", ...t }),
    e === "ellipse" && /* @__PURE__ */ a("ellipse", { cx: "50", cy: "50", rx: "48", ry: "48", ...t }),
    e === "triangle" && /* @__PURE__ */ a("polygon", { points: "50,2 98,98 2,98", ...t }),
    e === "diamond" && /* @__PURE__ */ a("polygon", { points: "50,2 98,50 50,98 2,50", ...t }),
    e === "hexagon" && /* @__PURE__ */ a("polygon", { points: "25,2 75,2 98,50 75,98 25,98 2,50", ...t }),
    e === "star" && /* @__PURE__ */ a("polygon", { points: "50,2 61,36 97,36 68,57 79,94 50,72 21,94 32,57 3,36 39,36", ...t }),
    e === "arrow_right" && /* @__PURE__ */ a("polygon", { points: "2,28 62,28 62,6 98,50 62,94 62,72 2,72", ...t }),
    e === "callout" && /* @__PURE__ */ a("polygon", { points: "2,2 98,2 98,76 43,76 24,98 27,76 2,76", ...t }),
    e === "line" && /* @__PURE__ */ a("line", { x1: "2", y1: "50", x2: "98", y2: "50", ...t })
  ] });
}
function dt({ chart: e }) {
  const u = e.series.flatMap((f) => f.values), h = Math.max(1, ...u.map((f) => Math.abs(f)));
  if (e.type === "pie" || e.type === "donut") {
    const f = e.series[0]?.values.map((m) => Math.max(0, m)) || [], g = Math.max(1, f.reduce((m, v) => m + v, 0));
    let c = 0;
    const k = f.map((m, v) => {
      const y = c;
      return c += m / g * 100, `${N[v % N.length]} ${y}% ${c}%`;
    });
    return /* @__PURE__ */ d("div", { className: "presentation-pie-chart", children: [
      /* @__PURE__ */ a("i", { className: e.type === "donut" ? "is-donut" : "", style: { background: `conic-gradient(${k.join(",")})` } }),
      /* @__PURE__ */ a("ol", { children: e.categories.slice(0, 6).map((m, v) => /* @__PURE__ */ d("li", { children: [
        /* @__PURE__ */ a("span", { style: { background: N[v % N.length] } }),
        m,
        /* @__PURE__ */ a("b", { children: f[v] ?? 0 })
      ] }, `${m}:${v}`)) })
    ] });
  }
  const s = 1e3, t = 480, w = 70, p = 48, o = s - w * 2, n = t - p * 2, r = (f) => e.series[f].values.map((g, c) => ({ x: w + (c + 0.5) * o / e.categories.length, y: p + n - Math.max(0, g) / h * n }));
  return /* @__PURE__ */ d("svg", { className: `presentation-chart-graphic is-${e.type}`, viewBox: `0 0 ${s} ${t}`, preserveAspectRatio: "none", "aria-label": pe[e.type], children: [
    [0, 1, 2, 3, 4].map((f) => /* @__PURE__ */ a("line", { x1: w, x2: s - w, y1: p + n * f / 4, y2: p + n * f / 4, stroke: "#DDE7E2", strokeWidth: "2" }, f)),
    e.type === "column" && e.series.map((f, g) => f.values.map((c, k) => {
      const m = o / e.categories.length, v = m * 0.72 / e.series.length, y = w + k * m + m * 0.14 + g * v, S = Math.max(2, Math.max(0, c) / h * n);
      return /* @__PURE__ */ a("rect", { x: y, y: p + n - S, width: v - 3, height: S, rx: "3", fill: N[g % N.length] }, `${f.name}:${k}`);
    })),
    e.type === "bar" && e.series.slice(0, 1).flatMap((f) => f.values.map((g, c) => {
      const k = n / e.categories.length, m = Math.max(2, Math.max(0, g) / h * o);
      return /* @__PURE__ */ a("rect", { x: w, y: p + c * k + k * 0.2, width: m, height: k * 0.6, rx: "3", fill: N[c % N.length] }, `${f.name}:${c}`);
    })),
    (e.type === "line" || e.type === "area") && e.series.map((f, g) => {
      const c = r(g), k = c.map((v, y) => `${y ? "L" : "M"}${v.x},${v.y}`).join(" "), m = `${k} L${c.at(-1)?.x},${p + n} L${c[0]?.x},${p + n} Z`;
      return /* @__PURE__ */ d("g", { children: [
        e.type === "area" && /* @__PURE__ */ a("path", { d: m, fill: N[g % N.length], opacity: ".18" }),
        /* @__PURE__ */ a("path", { d: k, fill: "none", stroke: N[g % N.length], strokeWidth: "8", strokeLinecap: "round", strokeLinejoin: "round" }),
        c.map((v, y) => /* @__PURE__ */ a("circle", { cx: v.x, cy: v.y, r: "7", fill: N[g % N.length] }, y))
      ] }, f.name);
    })
  ] });
}
function ge(e) {
  return { text: i("knowledge.auto.dd81861811e57bf7"), shape: i("knowledge.auto.c2f71c1b10ef9d80"), image: i("knowledge.auto.d24c10d37db0feea"), video: i("knowledge.auto.c20f7618d330a854"), table: i("knowledge.auto.22d9e7c54b88cacd"), chart: i("knowledge.auto.8cb443ab83797881"), formula: i("knowledge.auto.f3fccedacbcebbfa"), code: i("knowledge.auto.e6f04ffbaa424001") }[e];
}
function ct({ element: e, asset: u, readFile: h, thumbnail: s = !1 }) {
  if (e.type === "text")
    return /* @__PURE__ */ a("div", { className: "presentation-text-element", style: { color: e.color, fontSize: `${e.font_size / z * 100}cqw`, fontWeight: e.font_weight === "bold" ? 750 : 400, textAlign: e.align }, children: e.text });
  if (e.type === "shape") {
    const t = e.shape || "rectangle";
    return /* @__PURE__ */ d("div", { className: `presentation-shape-element is-${t}`, style: { color: e.color, fontSize: `${e.font_size / z * 100}cqw`, fontWeight: e.font_weight === "bold" ? 750 : 400, textAlign: e.align }, children: [
      /* @__PURE__ */ a(fe, { shape: t, fill: e.fill_color || "#FFFFFF", stroke: e.stroke_color || "#000000", strokeWidth: e.stroke_width ?? 1 }),
      e.text && /* @__PURE__ */ a("span", { children: e.text })
    ] });
  }
  if (e.type === "table" && e.table) return /* @__PURE__ */ a("div", { className: `presentation-table-element${e.table.header ? " has-header" : ""}`, children: /* @__PURE__ */ a("table", { children: /* @__PURE__ */ a("tbody", { children: e.table.rows.map((t, w) => /* @__PURE__ */ a("tr", { children: t.map((p, o) => /* @__PURE__ */ a("td", { children: p }, o)) }, w)) }) }) });
  if (e.type === "chart" && e.chart) return /* @__PURE__ */ a("div", { className: "presentation-chart-element", children: /* @__PURE__ */ a(dt, { chart: e.chart }) });
  if (e.type === "formula") {
    const t = Ie(e.formula || "", !0);
    return /* @__PURE__ */ a("div", { className: "presentation-formula-element", style: { color: e.color, fontSize: `${(e.font_size || 40) / z * 100}cqw` }, children: t.html ? /* @__PURE__ */ a("span", { dangerouslySetInnerHTML: { __html: t.html } }) : /* @__PURE__ */ a("code", { children: e.formula }) });
  }
  return e.type === "code" ? /* @__PURE__ */ d("pre", { className: "presentation-code-element", style: { color: e.color, background: e.fill_color, fontSize: `${(e.font_size || 24) / z * 100}cqw` }, children: [
    /* @__PURE__ */ a("small", { children: e.language }),
    /* @__PURE__ */ a("code", { children: e.source })
  ] }) : u ? /* @__PURE__ */ a("div", { className: `presentation-media-element is-${e.fit}`, children: /* @__PURE__ */ a(nt, { asset: u, readFile: h, thumbnail: s }) }) : /* @__PURE__ */ a("span", { className: "presentation-media-state", children: i("knowledge.auto.3883970214374f2b") });
}
function ee({ content: e, slide: u, selectedElementID: h = "", readOnly: s = !0, thumbnail: t = !1, readFile: w, onSelectElement: p, onElementPointerDown: o }) {
  return /* @__PURE__ */ d("div", { className: `presentation-slide-canvas${t ? " is-thumbnail" : ""}`, style: { background: u.background_color || e.master.background_color, color: e.master.text_color }, children: [
    u.elements.map((n) => {
      const r = /* @__PURE__ */ a(ct, { element: n, asset: n.asset_id ? u.files[n.asset_id] : void 0, readFile: w, thumbnail: t }), f = st(n);
      return s || t ? /* @__PURE__ */ a("div", { className: "presentation-element", style: f, children: r }, n.id) : /* @__PURE__ */ a("button", { type: "button", className: `presentation-element is-editable${h === n.id ? " is-selected" : ""}`, "aria-label": O("knowledge.auto.cc31bdce7d6fa870", { value0: ge(n.type) }), style: f, onClick: () => p?.(n.id), onPointerDown: (g) => o?.(g, n), children: r }, n.id);
    }),
    (e.master.footer || e.master.show_slide_number) && /* @__PURE__ */ d("footer", { children: [
      /* @__PURE__ */ a("span", { children: e.master.footer }),
      e.master.show_slide_number && /* @__PURE__ */ a("b", { children: e.slides.findIndex((n) => n.id === u.id) + 1 })
    ] })
  ] });
}
function ut(e, u, h, s) {
  switch (e.beginPath(), u) {
    case "rounded_rectangle": {
      const t = Math.min(h, s) * 0.14;
      e.roundRect(0, 0, h, s, t);
      break;
    }
    case "ellipse":
      e.ellipse(h / 2, s / 2, h / 2, s / 2, 0, 0, Math.PI * 2);
      break;
    case "triangle":
      e.moveTo(h / 2, 0), e.lineTo(h, s), e.lineTo(0, s), e.closePath();
      break;
    case "diamond":
      e.moveTo(h / 2, 0), e.lineTo(h, s / 2), e.lineTo(h / 2, s), e.lineTo(0, s / 2), e.closePath();
      break;
    case "hexagon":
      e.moveTo(h * 0.25, 0), e.lineTo(h * 0.75, 0), e.lineTo(h, s / 2), e.lineTo(h * 0.75, s), e.lineTo(h * 0.25, s), e.lineTo(0, s / 2), e.closePath();
      break;
    case "star": {
      const t = Math.min(h, s) / 2, w = t * 0.42;
      for (let p = 0; p < 10; p++) {
        const o = p % 2 ? w : t, n = -Math.PI / 2 + p * Math.PI / 5, r = h / 2 + Math.cos(n) * o, f = s / 2 + Math.sin(n) * o;
        p === 0 ? e.moveTo(r, f) : e.lineTo(r, f);
      }
      e.closePath();
      break;
    }
    case "arrow_right":
      e.moveTo(0, s * 0.28), e.lineTo(h * 0.62, s * 0.28), e.lineTo(h * 0.62, s * 0.06), e.lineTo(h, s / 2), e.lineTo(h * 0.62, s * 0.94), e.lineTo(h * 0.62, s * 0.72), e.lineTo(0, s * 0.72), e.closePath();
      break;
    case "callout":
      e.moveTo(0, 0), e.lineTo(h, 0), e.lineTo(h, s * 0.76), e.lineTo(h * 0.43, s * 0.76), e.lineTo(h * 0.24, s), e.lineTo(h * 0.27, s * 0.76), e.lineTo(0, s * 0.76), e.closePath();
      break;
    case "line":
      e.moveTo(0, s / 2), e.lineTo(h, s / 2);
      break;
    default:
      e.rect(0, 0, h, s);
  }
}
async function ht(e, u, h) {
  const s = document.createElement("canvas");
  s.width = z, s.height = D;
  const t = s.getContext("2d");
  if (!t) throw Error(i("knowledge.auto.1463416239d49ea2"));
  t.fillStyle = u.background_color || e.master.background_color, t.fillRect(0, 0, s.width, s.height);
  const w = (o, n) => {
    t.save(), t.translate(n.x + n.width / 2, n.y + n.height / 2), t.rotate(n.rotation * Math.PI / 180), t.translate(-n.width / 2, -n.height / 2), t.fillStyle = n.color || e.master.text_color, t.font = `${n.font_weight === "bold" ? "700" : "400"} ${n.font_size || 28}px ${e.master.font_family}`, t.textBaseline = "top", t.textAlign = n.align || "left";
    const r = n.align === "center" ? n.width / 2 : n.align === "right" ? n.width : 0, f = (n.font_size || 28) * 1.25;
    let g = 0;
    for (const c of o.split(`
`)) {
      const k = [...c];
      let m = "";
      for (const v of k) {
        const y = m + v;
        m && t.measureText(y).width > n.width ? (t.fillText(m, r, g, n.width), m = v, g += f) : m = y;
      }
      if (t.fillText(m, r, g, n.width), g += f, g > n.height) break;
    }
    t.restore();
  }, p = (o, n) => {
    const r = n.series.flatMap((m) => m.values), f = Math.max(1, ...r.map((m) => Math.abs(m)));
    t.save(), t.translate(o.x, o.y);
    const g = 42, c = o.width - g * 2, k = o.height - g * 2;
    if (n.type === "pie" || n.type === "donut") {
      const m = n.series[0]?.values.map((S) => Math.max(0, S)) || [], v = Math.max(1, m.reduce((S, T) => S + T, 0));
      let y = -Math.PI / 2;
      m.forEach((S, T) => {
        const P = y + S / v * Math.PI * 2;
        t.beginPath(), t.moveTo(o.width / 2, o.height / 2), t.arc(o.width / 2, o.height / 2, Math.min(c, k) * 0.42, y, P), t.closePath(), t.fillStyle = N[T % N.length], t.fill(), y = P;
      }), n.type === "donut" && (t.beginPath(), t.arc(o.width / 2, o.height / 2, Math.min(c, k) * 0.2, 0, Math.PI * 2), t.fillStyle = u.background_color || e.master.background_color, t.fill());
    } else n.type === "column" ? n.series.forEach((m, v) => m.values.forEach((y, S) => {
      const T = c / n.categories.length, P = T * 0.72 / n.series.length, H = Math.max(2, Math.max(0, y) / f * k);
      t.fillStyle = N[v % N.length], t.fillRect(g + S * T + T * 0.14 + v * P, g + k - H, Math.max(2, P - 3), H);
    })) : n.type === "bar" ? n.series[0]?.values.forEach((m, v) => {
      const y = k / n.categories.length;
      t.fillStyle = N[v % N.length], t.fillRect(g, g + v * y + y * 0.2, Math.max(2, Math.max(0, m) / f * c), y * 0.6);
    }) : n.series.forEach((m, v) => {
      t.beginPath(), m.values.forEach((y, S) => {
        const T = g + (S + 0.5) * c / n.categories.length, P = g + k - Math.max(0, y) / f * k;
        S ? t.lineTo(T, P) : t.moveTo(T, P);
      }), n.type === "area" && (t.lineTo(g + c - c / n.categories.length / 2, g + k), t.lineTo(g + c / n.categories.length / 2, g + k), t.closePath(), t.globalAlpha = 0.18, t.fillStyle = N[v % N.length], t.fill(), t.globalAlpha = 1), t.strokeStyle = N[v % N.length], t.lineWidth = 6, t.stroke();
    });
    t.restore();
  };
  for (const o of u.elements) {
    if (o.type === "text") {
      w(o.text || "", o);
      continue;
    }
    if (o.type === "shape") {
      t.save(), t.translate(o.x + o.width / 2, o.y + o.height / 2), t.rotate(o.rotation * Math.PI / 180), t.translate(-o.width / 2, -o.height / 2), t.fillStyle = o.fill_color || "#FFFFFF", t.strokeStyle = o.stroke_color || "#000000", t.lineWidth = o.stroke_width ?? 1, ut(t, o.shape || "rectangle", o.width, o.height), o.shape !== "line" && t.fill(), t.stroke(), t.restore(), o.text && w(o.text, o);
      continue;
    }
    if (o.type === "table" && o.table) {
      t.save(), t.translate(o.x, o.y);
      const y = o.table.rows, S = o.height / y.length, T = y[0].length, P = o.width / T;
      t.font = `400 ${Math.max(14, Math.min(28, S * 0.35))}px ${e.master.font_family}`, t.textBaseline = "middle", y.forEach((H, R) => H.forEach((X, G) => {
        t.fillStyle = o.table.header && R === 0 ? e.master.accent_color : "#FFFFFF", t.fillRect(G * P, R * S, P, S), t.strokeStyle = e.master.muted_color, t.strokeRect(G * P, R * S, P, S), t.fillStyle = o.table.header && R === 0 ? e.master.background_color : e.master.text_color, t.fillText(X, G * P + 10, R * S + S / 2, P - 20);
      })), t.restore();
      continue;
    }
    if (o.type === "chart" && o.chart) {
      p(o, o.chart);
      continue;
    }
    if (o.type === "formula") {
      w(o.formula || "", { ...o, text: o.formula, font_weight: "normal", align: "center" });
      continue;
    }
    if (o.type === "code") {
      t.fillStyle = o.fill_color || "#101D19", t.fillRect(o.x, o.y, o.width, o.height), w(`${o.language || "text"}
${o.source || ""}`, { ...o, text: o.source, font_weight: "normal", align: "left" });
      continue;
    }
    const n = o.asset_id ? u.files[o.asset_id] : void 0;
    if (!n || !h) continue;
    if (o.type === "video") {
      t.fillStyle = "#17221C", t.fillRect(o.x, o.y, o.width, o.height), t.fillStyle = "#FFFFFF", t.font = "700 30px Arial", t.textAlign = "center", t.fillText(`▶ ${n.filename}`, o.x + o.width / 2, o.y + o.height / 2, o.width - 40);
      continue;
    }
    const r = await createImageBitmap(await h(n.document_ref)), f = r.width / r.height, g = o.width / o.height;
    let c = o.width, k = o.height, m = o.x, v = o.y;
    if (o.fit === "contain")
      f > g ? (k = c / f, v += (o.height - k) / 2) : (c = k * f, m += (o.width - c) / 2);
    else if (f > g) {
      const y = r.height * g, S = (r.width - y) / 2;
      t.drawImage(r, S, 0, y, r.height, m, v, c, k), r.close();
      continue;
    } else {
      const y = r.width / g, S = (r.height - y) / 2;
      t.drawImage(r, 0, S, r.width, y, m, v, c, k), r.close();
      continue;
    }
    t.drawImage(r, m, v, c, k), r.close();
  }
  return e.master.footer && (t.fillStyle = e.master.muted_color, t.font = `400 18px ${e.master.font_family}`, t.textAlign = "left", t.fillText(e.master.footer, 64, 854, 1200)), e.master.show_slide_number && (t.fillStyle = e.master.muted_color, t.font = `700 18px ${e.master.font_family}`, t.textAlign = "right", t.fillText(String(e.slides.findIndex((o) => o.id === u.id) + 1), 1536, 854)), s;
}
async function pt(e, u, h) {
  const { jsPDF: s } = await import("./jspdf.es.min-DncSk1NJ.js").then((w) => w.j), t = new s({ orientation: "landscape", unit: "px", format: [z, D], hotfixes: ["px_scaling"] });
  for (let w = 0; w < e.slides.length; w++) {
    w && t.addPage([z, D], "landscape");
    const p = await ht(e, e.slides[w], h);
    t.addImage(p.toDataURL("image/png"), "PNG", 0, 0, z, D, void 0, "FAST");
  }
  t.save(he(u, "pdf"));
}
async function ft(e, u, h) {
  const { default: s } = await import("./pptxgen.es-CLAffxe5.js"), t = new s();
  t.layout = "LAYOUT_WIDE", t.author = "Domainry Knowledge", t.company = "Domainry", t.subject = "Knowledge presentation", t.title = u;
  const w = [];
  e.master.footer && w.push({ text: { text: e.master.footer, options: { x: 0.55, y: 7.12, w: 10.8, h: 0.2, fontFace: e.master.font_family, fontSize: 9, color: C(e.master.muted_color), margin: 0 } } }), t.defineSlideMaster({
    title: "KNOWLEDGE_MASTER",
    background: { color: C(e.master.background_color) },
    objects: w,
    slideNumber: e.master.show_slide_number ? { x: 12.25, y: 7.08, w: 0.5, h: 0.22, fontFace: e.master.font_family, fontSize: 9, color: C(e.master.muted_color), align: "right", margin: 0 } : void 0
  });
  const p = 120;
  for (const o of e.slides) {
    const n = t.addSlide({ masterName: "KNOWLEDGE_MASTER" });
    o.background_color && (n.background = { color: C(o.background_color) });
    for (const r of o.elements) {
      const f = { x: r.x / p, y: r.y / p, w: r.width / p, h: r.height / p, rotate: r.rotation };
      if (r.type === "text")
        n.addText(r.text || "", { ...f, fontFace: e.master.font_family, fontSize: (r.font_size || 28) * 0.75, bold: r.font_weight === "bold", color: C(r.color || e.master.text_color), align: r.align, valign: "middle", margin: 0, breakLine: !1 });
      else if (r.type === "shape") {
        const g = r.shape === "rounded_rectangle" ? t.ShapeType.roundRect : r.shape === "ellipse" ? t.ShapeType.ellipse : r.shape === "triangle" ? t.ShapeType.triangle : r.shape === "diamond" ? t.ShapeType.diamond : r.shape === "hexagon" ? t.ShapeType.hexagon : r.shape === "star" ? t.ShapeType.star5 : r.shape === "arrow_right" ? t.ShapeType.rightArrow : r.shape === "callout" ? t.ShapeType.wedgeRectCallout : r.shape === "line" ? t.ShapeType.line : t.ShapeType.rect;
        n.addShape(g, { ...f, fill: { color: C(r.fill_color || "#FFFFFF"), transparency: r.shape === "line" ? 100 : 0 }, line: { color: C(r.stroke_color || "#000000"), width: r.stroke_width ?? 1 } }), r.text && n.addText(r.text, { ...f, fontFace: e.master.font_family, fontSize: (r.font_size || 28) * 0.75, bold: r.font_weight === "bold", color: C(r.color || e.master.text_color), align: r.align, valign: "middle", margin: 4 });
      } else if (r.type === "table" && r.table) {
        const g = r.table.rows.map((c) => c.map((k) => ({ text: k })));
        n.addTable(g, { ...f, border: { type: "solid", color: C(e.master.muted_color), pt: 1 }, fill: { color: C(o.background_color || e.master.background_color) }, color: C(e.master.text_color), fontFace: e.master.font_family, fontSize: 14, bold: !1, margin: 0.06, autoPage: !1, rowH: f.h / r.table.rows.length }), r.table.header && n.addTable([g[0]], { ...f, h: f.h / r.table.rows.length, border: { type: "solid", color: C(e.master.accent_color), pt: 1 }, fill: { color: C(e.master.accent_color) }, color: C(e.master.background_color), fontFace: e.master.font_family, fontSize: 14, bold: !0, margin: 0.06, autoPage: !1 });
      } else if (r.type === "chart" && r.chart) {
        const g = r.chart.type === "donut" ? t.ChartType.doughnut : r.chart.type === "pie" ? t.ChartType.pie : r.chart.type === "line" ? t.ChartType.line : r.chart.type === "area" ? t.ChartType.area : t.ChartType.bar;
        n.addChart(g, r.chart.series.map((c) => ({ name: c.name, labels: r.chart.categories, values: c.values })), { ...f, showLegend: r.chart.series.length > 1, showTitle: !1, showValue: r.chart.type === "pie" || r.chart.type === "donut", showSerName: r.chart.type === "pie" || r.chart.type === "donut", chartColors: N.map(C), ...r.chart.type === "column" ? { barDir: "col" } : r.chart.type === "bar" ? { barDir: "bar" } : {} });
      } else if (r.type === "formula")
        n.addText(r.formula || "", { ...f, fontFace: "Georgia", fontSize: (r.font_size || 40) * 0.75, italic: !0, color: C(r.color || e.master.text_color), align: "center", valign: "middle", margin: 0.08 });
      else if (r.type === "code")
        n.addText(`${r.language || "text"}
${r.source || ""}`, { ...f, fontFace: "Courier New", fontSize: (r.font_size || 24) * 0.75, color: C(r.color || "#FFFFFF"), fill: { color: C(r.fill_color || "#101D19") }, margin: 0.12, breakLine: !1, valign: "top" });
      else {
        const g = r.asset_id ? o.files[r.asset_id] : void 0;
        if (!g || !h) continue;
        const c = await rt(await h(g.document_ref));
        r.type === "image" ? n.addImage({ data: c, sizing: { type: r.fit === "contain" ? "contain" : "cover", x: f.x, y: f.y, w: f.w, h: f.h }, rotate: r.rotation }) : n.addMedia({ type: "video", data: c, extn: g.mime_type === "video/webm" ? "webm" : "mp4", ...f });
      }
    }
    o.notes.trim() && n.addNotes(o.notes);
  }
  await t.writeFile({ fileName: he(u, "pptx"), compression: !0 });
}
function gt({ content: e, initial: u, readFile: h, onClose: s }) {
  const [t, w] = A(u);
  return K(() => {
    const p = (o) => {
      o.key === "Escape" && s(), (o.key === "ArrowRight" || o.key === "PageDown") && w((n) => Math.min(e.slides.length - 1, n + 1)), (o.key === "ArrowLeft" || o.key === "PageUp") && w((n) => Math.max(0, n - 1));
    };
    return window.addEventListener("keydown", p), () => window.removeEventListener("keydown", p);
  }, [e.slides.length, s]), We(/* @__PURE__ */ d("div", { className: "presentation-slideshow", role: "dialog", "aria-modal": "true", "aria-label": i("knowledge.auto.1bc0e44d9e0e1acc"), children: [
    /* @__PURE__ */ a("div", { className: "presentation-slideshow-slide", children: /* @__PURE__ */ a(ee, { content: e, slide: e.slides[t], readFile: h }) }),
    /* @__PURE__ */ d("div", { className: "presentation-slideshow-controls", children: [
      /* @__PURE__ */ d(E, { disabled: t === 0, onClick: () => w((p) => p - 1), children: [
        /* @__PURE__ */ a(ce, { size: 16 }),
        i("knowledge.auto.bcf200709dbc7ff4")
      ] }),
      /* @__PURE__ */ d("span", { children: [
        t + 1,
        " / ",
        e.slides.length
      ] }),
      /* @__PURE__ */ d(E, { disabled: t === e.slides.length - 1, onClick: () => w((p) => p + 1), children: [
        i("knowledge.auto.dcd4eb0273699416"),
        /* @__PURE__ */ a(Q, { size: 16 })
      ] }),
      /* @__PURE__ */ a(E, { title: i("knowledge.auto.7b8c90c6914c5c0d"), "aria-label": i("knowledge.auto.7b8c90c6914c5c0d"), onClick: s, children: /* @__PURE__ */ a(ot, { size: 17 }) })
    ] })
  ] }), document.body);
}
function bt({ master: e, onChange: u }) {
  const h = (s, t) => /* @__PURE__ */ d("label", { children: [
    /* @__PURE__ */ a("span", { children: t }),
    /* @__PURE__ */ a("input", { type: "color", value: e[s], onChange: (w) => u({ ...e, [s]: w.target.value.toUpperCase() }) })
  ] });
  return /* @__PURE__ */ d("div", { className: "presentation-master-inspector", children: [
    /* @__PURE__ */ a("h4", { children: i("knowledge.auto.3d1e4467afcece19") }),
    /* @__PURE__ */ a("p", { children: i("knowledge.auto.bcea48901a4853c7") }),
    h("background_color", i("knowledge.auto.f4b669c55756180e")),
    h("text_color", i("knowledge.auto.d661c3d96d53ebc0")),
    h("accent_color", i("knowledge.auto.d5ae79edec852f2d")),
    h("muted_color", i("knowledge.auto.40d33aa115c4504d")),
    /* @__PURE__ */ d("label", { className: "is-wide", children: [
      /* @__PURE__ */ a("span", { children: i("knowledge.auto.078838da4218490b") }),
      /* @__PURE__ */ d(I, { value: e.font_family, onChange: (s) => u({ ...e, font_family: s.target.value }), children: [
        /* @__PURE__ */ a("option", { children: "Arial" }),
        /* @__PURE__ */ a("option", { children: "Aptos" }),
        /* @__PURE__ */ a("option", { children: "Helvetica" }),
        /* @__PURE__ */ a("option", { children: "Georgia" }),
        /* @__PURE__ */ a("option", { children: "Times New Roman" })
      ] })
    ] }),
    /* @__PURE__ */ d("label", { className: "is-wide", children: [
      /* @__PURE__ */ a("span", { children: i("knowledge.auto.db7eeb8de478f255") }),
      /* @__PURE__ */ a("input", { maxLength: 512, value: e.footer, onChange: (s) => u({ ...e, footer: s.target.value }) })
    ] }),
    /* @__PURE__ */ d("label", { className: "is-check", children: [
      /* @__PURE__ */ a("input", { type: "checkbox", checked: e.show_slide_number, onChange: (s) => u({ ...e, show_slide_number: s.target.checked }) }),
      /* @__PURE__ */ a("span", { children: i("knowledge.auto.239369850b80b20c") })
    ] })
  ] });
}
function mt({ element: e, onChange: u, onDelete: h }) {
  const s = (t, w, p, o) => /* @__PURE__ */ d("label", { children: [
    /* @__PURE__ */ a("span", { children: w }),
    /* @__PURE__ */ a("input", { type: "number", min: p, max: o, value: e[t], onChange: (n) => u({ ...e, [t]: Math.max(p, Math.min(o, Number(n.target.value) || 0)) }) })
  ] });
  return /* @__PURE__ */ d("div", { className: "presentation-element-inspector", children: [
    /* @__PURE__ */ d("header", { children: [
      /* @__PURE__ */ d("div", { children: [
        /* @__PURE__ */ a("h4", { children: i("knowledge.auto.a1c1675f5df836a8") }),
        /* @__PURE__ */ a("small", { children: ge(e.type) })
      ] }),
      /* @__PURE__ */ a("button", { type: "button", title: i("knowledge.auto.2c98462c114e82b8"), onClick: h, children: /* @__PURE__ */ a(ue, { size: 15 }) })
    ] }),
    /* @__PURE__ */ d("div", { className: "presentation-inspector-grid", children: [
      s("x", "X", 0, z),
      s("y", "Y", 0, D),
      s("width", i("knowledge.auto.8dd966ad496e83c7"), 1, z),
      s("height", i("knowledge.auto.b1c27820fec23edb"), 1, D),
      s("rotation", i("knowledge.auto.68eb90fa809e72cc"), -360, 360)
    ] }),
    (e.type === "text" || e.type === "shape") && /* @__PURE__ */ d(q, { children: [
      /* @__PURE__ */ d("label", { className: "is-wide", children: [
        /* @__PURE__ */ a("span", { children: i("knowledge.auto.7a688306423bec17") }),
        /* @__PURE__ */ a("textarea", { value: e.text || "", onChange: (t) => u({ ...e, text: t.target.value }) })
      ] }),
      /* @__PURE__ */ d("div", { className: "presentation-inspector-grid", children: [
        /* @__PURE__ */ d("label", { children: [
          /* @__PURE__ */ a("span", { children: i("knowledge.auto.f71561b5af0abced") }),
          /* @__PURE__ */ a("input", { type: "number", min: 8, max: 240, value: e.font_size, onChange: (t) => u({ ...e, font_size: Number(t.target.value) || 8 }) })
        ] }),
        /* @__PURE__ */ d("label", { children: [
          /* @__PURE__ */ a("span", { children: i("knowledge.auto.c69ead895a515fc9") }),
          /* @__PURE__ */ d(I, { value: e.font_weight, onChange: (t) => u({ ...e, font_weight: t.target.value }), children: [
            /* @__PURE__ */ a("option", { value: "normal", children: i("knowledge.auto.40fae00b7c6d8ac0") }),
            /* @__PURE__ */ a("option", { value: "bold", children: i("knowledge.auto.5ceac65ed8ee2ca6") })
          ] })
        ] }),
        /* @__PURE__ */ d("label", { children: [
          /* @__PURE__ */ a("span", { children: i("knowledge.auto.a12ecd7f96912af0") }),
          /* @__PURE__ */ a("input", { type: "color", value: e.color, onChange: (t) => u({ ...e, color: t.target.value.toUpperCase() }) })
        ] })
      ] }),
      /* @__PURE__ */ d("div", { className: "presentation-align-control", role: "group", "aria-label": i("knowledge.auto.2527727872202c15"), children: [
        /* @__PURE__ */ a("button", { type: "button", "aria-pressed": e.align === "left", onClick: () => u({ ...e, align: "left" }), children: /* @__PURE__ */ a(et, { size: 15 }) }),
        /* @__PURE__ */ a("button", { type: "button", "aria-pressed": e.align === "center", onClick: () => u({ ...e, align: "center" }), children: /* @__PURE__ */ a(tt, { size: 15 }) }),
        /* @__PURE__ */ a("button", { type: "button", "aria-pressed": e.align === "right", onClick: () => u({ ...e, align: "right" }), children: /* @__PURE__ */ a(at, { size: 15 }) })
      ] })
    ] }),
    e.type === "shape" && /* @__PURE__ */ d("div", { className: "presentation-inspector-grid", children: [
      /* @__PURE__ */ d("label", { children: [
        /* @__PURE__ */ a("span", { children: i("knowledge.auto.c2f71c1b10ef9d80") }),
        /* @__PURE__ */ a(I, { value: e.shape, onChange: (t) => u({ ...e, shape: t.target.value }), children: de.map((t) => /* @__PURE__ */ a("option", { value: t, children: Z[t] }, t)) })
      ] }),
      /* @__PURE__ */ d("label", { children: [
        /* @__PURE__ */ a("span", { children: i("knowledge.auto.05fb7cba476bd2e9") }),
        /* @__PURE__ */ a("input", { type: "color", value: e.fill_color, onChange: (t) => u({ ...e, fill_color: t.target.value.toUpperCase() }) })
      ] }),
      /* @__PURE__ */ d("label", { children: [
        /* @__PURE__ */ a("span", { children: i("knowledge.auto.0053783298298e9d") }),
        /* @__PURE__ */ a("input", { type: "color", value: e.stroke_color, onChange: (t) => u({ ...e, stroke_color: t.target.value.toUpperCase() }) })
      ] })
    ] }),
    (e.type === "image" || e.type === "video") && /* @__PURE__ */ d("label", { className: "is-wide", children: [
      /* @__PURE__ */ a("span", { children: i("knowledge.auto.7905e49e2e8b65a5") }),
      /* @__PURE__ */ d(I, { value: e.fit, onChange: (t) => u({ ...e, fit: t.target.value }), children: [
        /* @__PURE__ */ a("option", { value: "contain", children: i("knowledge.auto.530aa02103692b72") }),
        /* @__PURE__ */ a("option", { value: "cover", children: i("knowledge.auto.60d08aa3cb50cb8a") })
      ] })
    ] }),
    e.type === "table" && e.table && /* @__PURE__ */ d(q, { children: [
      /* @__PURE__ */ d("label", { className: "is-check", children: [
        /* @__PURE__ */ a("input", { type: "checkbox", checked: e.table.header, onChange: (t) => u({ ...e, table: { ...e.table, header: t.target.checked } }) }),
        /* @__PURE__ */ a("span", { children: i("knowledge.auto.cd1e78750ab5a443") })
      ] }),
      /* @__PURE__ */ d("label", { className: "is-wide", children: [
        /* @__PURE__ */ a("span", { children: i("knowledge.auto.062d5a6d84726d8b") }),
        /* @__PURE__ */ a("textarea", { rows: 10, value: e.table.rows.map((t) => t.join("	")).join(`
`), onChange: (t) => {
          const w = t.target.value.split(`
`).slice(0, 50).map((o) => o.split("	").slice(0, 20)), p = Math.max(1, ...w.map((o) => o.length));
          u({ ...e, table: { ...e.table, rows: w.map((o) => [...o, ...Array(Math.max(0, p - o.length)).fill("")]) } });
        } })
      ] })
    ] }),
    e.type === "chart" && e.chart && /* @__PURE__ */ d(q, { children: [
      /* @__PURE__ */ d("label", { className: "is-wide", children: [
        /* @__PURE__ */ a("span", { children: i("knowledge.auto.52fe98551232b10f") }),
        /* @__PURE__ */ a(I, { value: e.chart.type, onChange: (t) => u({ ...e, chart: { ...e.chart, type: t.target.value } }), children: Ae.map((t) => /* @__PURE__ */ a("option", { value: t, children: pe[t] }, t)) })
      ] }),
      /* @__PURE__ */ d("label", { className: "is-wide", children: [
        /* @__PURE__ */ a("span", { children: i("knowledge.auto.cbfa8a7b7cee0c9c") }),
        /* @__PURE__ */ a("input", { value: e.chart.categories.join(","), onChange: (t) => {
          const w = t.target.value.split(",").map((p) => p.trim()).filter(Boolean).slice(0, 50);
          u({ ...e, chart: { ...e.chart, categories: w, series: e.chart.series.map((p) => ({ ...p, values: w.map((o, n) => p.values[n] || 0) })) } });
        } })
      ] }),
      /* @__PURE__ */ d("label", { className: "is-wide", children: [
        /* @__PURE__ */ a("span", { children: i("knowledge.auto.94e051b68419f74e") }),
        /* @__PURE__ */ a("textarea", { rows: 8, value: e.chart.series.map((t) => `${t.name}:${t.values.join(",")}`).join(`
`), onChange: (t) => {
          const w = t.target.value.split(`
`).slice(0, 12).map((p, o) => {
            const n = p.indexOf(":"), r = (n >= 0 ? p.slice(0, n) : O("knowledge.auto.8fac7b189e32a496", { value0: o + 1 })).trim() || O("knowledge.auto.8fac7b189e32a496", { value0: o + 1 }), f = n >= 0 ? p.slice(n + 1) : p;
            return { name: r, values: e.chart.categories.map((g, c) => {
              const k = Number(f.split(",")[c]?.trim() || 0);
              return Number.isFinite(k) ? k : 0;
            }) };
          }).filter((p) => p.name);
          u({ ...e, chart: { ...e.chart, series: w.length ? w : [{ name: i("knowledge.auto.34b3cfaa3c77e987"), values: e.chart.categories.map(() => 0) }] } });
        } })
      ] })
    ] }),
    e.type === "formula" && /* @__PURE__ */ d(q, { children: [
      /* @__PURE__ */ d("label", { className: "is-wide", children: [
        /* @__PURE__ */ a("span", { children: i("knowledge.auto.7e202a3add63fbb1") }),
        /* @__PURE__ */ a("textarea", { rows: 6, value: e.formula || "", onChange: (t) => u({ ...e, formula: t.target.value }) })
      ] }),
      /* @__PURE__ */ d("div", { className: "presentation-inspector-grid", children: [
        /* @__PURE__ */ d("label", { children: [
          /* @__PURE__ */ a("span", { children: i("knowledge.auto.f71561b5af0abced") }),
          /* @__PURE__ */ a("input", { type: "number", min: 8, max: 240, value: e.font_size, onChange: (t) => u({ ...e, font_size: Number(t.target.value) || 8 }) })
        ] }),
        /* @__PURE__ */ d("label", { children: [
          /* @__PURE__ */ a("span", { children: i("knowledge.auto.070a8016fcc3dffb") }),
          /* @__PURE__ */ a("input", { type: "color", value: e.color, onChange: (t) => u({ ...e, color: t.target.value.toUpperCase() }) })
        ] })
      ] })
    ] }),
    e.type === "code" && /* @__PURE__ */ d(q, { children: [
      /* @__PURE__ */ d("div", { className: "presentation-inspector-grid", children: [
        /* @__PURE__ */ d("label", { children: [
          /* @__PURE__ */ a("span", { children: i("knowledge.auto.9f6fee1aba17a565") }),
          /* @__PURE__ */ d(I, { value: e.language, onChange: (t) => u({ ...e, language: t.target.value }), children: [
            /* @__PURE__ */ a("option", { value: "javascript", children: "JavaScript" }),
            /* @__PURE__ */ a("option", { value: "typescript", children: "TypeScript" }),
            /* @__PURE__ */ a("option", { value: "python", children: "Python" }),
            /* @__PURE__ */ a("option", { value: "go", children: "Go" }),
            /* @__PURE__ */ a("option", { value: "java", children: "Java" }),
            /* @__PURE__ */ a("option", { value: "sql", children: "SQL" }),
            /* @__PURE__ */ a("option", { value: "shell", children: "Shell" }),
            /* @__PURE__ */ a("option", { value: "json", children: "JSON" })
          ] })
        ] }),
        /* @__PURE__ */ d("label", { children: [
          /* @__PURE__ */ a("span", { children: i("knowledge.auto.f71561b5af0abced") }),
          /* @__PURE__ */ a("input", { type: "number", min: 8, max: 120, value: e.font_size, onChange: (t) => u({ ...e, font_size: Number(t.target.value) || 8 }) })
        ] }),
        /* @__PURE__ */ d("label", { children: [
          /* @__PURE__ */ a("span", { children: i("knowledge.auto.f4b669c55756180e") }),
          /* @__PURE__ */ a("input", { type: "color", value: e.fill_color, onChange: (t) => u({ ...e, fill_color: t.target.value.toUpperCase() }) })
        ] })
      ] }),
      /* @__PURE__ */ d("label", { className: "is-wide", children: [
        /* @__PURE__ */ a("span", { children: i("knowledge.auto.e6f04ffbaa424001") }),
        /* @__PURE__ */ a("textarea", { rows: 12, value: e.source || "", onChange: (t) => u({ ...e, source: t.target.value }) })
      ] })
    ] })
  ] });
}
function St({ body: e, readOnly: u = !1, documentTitle: h = i("knowledge.auto.dc0e764313122d2d"), initialBlockID: s, uploadFile: t, fileUploadsEnabled: w, readFile: p, pageActionHost: o, authorizeContentAction: n, onActionFeedback: r, onChange: f }) {
  const g = Ue(() => Ee(e), [e]), [c, k] = A(g), m = J(c), [v, y] = A(g.slides[0].id), [S, T] = A(""), [P, H] = A(!1), [R, X] = A(!1), [G, te] = A(""), ae = J(null), V = J(null);
  K(() => {
    k(g), m.current = g, y((l) => g.slides.some((b) => b.id === l) ? l : g.slides[0].id);
  }, [g]), K(() => {
    if (!s) return;
    const l = m.current.slides.find((b) => b.id === s);
    if (l) {
      y(l.id), T("");
      return;
    }
    for (const b of m.current.slides)
      if (b.elements.some((x) => x.id === s)) {
        y(b.id), T(s);
        return;
      }
  }, [s]), K(() => {
    if (!R) return;
    const l = (x) => {
      ae.current?.contains(x.target) || X(!1);
    }, b = (x) => {
      x.key === "Escape" && X(!1);
    };
    return document.addEventListener("pointerdown", l), document.addEventListener("keydown", b), () => {
      document.removeEventListener("pointerdown", l), document.removeEventListener("keydown", b);
    };
  }, [R]);
  const U = Math.max(0, c.slides.findIndex((l) => l.id === v)), _ = c.slides[U], Y = _.elements.find((l) => l.id === S), B = (l, b = !0) => {
    m.current = l, k(l), b && f(ne(l));
  }, $ = (l, b = !0) => B({ ...m.current, slides: m.current.slides.map((x) => x.id === l.id ? l : x) }, b), oe = (l, b = !0) => $({ ..._, elements: _.elements.map((x) => x.id === l.id ? l : x) }, b), be = () => {
    const l = F("slide"), b = je(l, c.slides.length, "title_content", c.master);
    y(l), T(""), B({ ...c, slides: [...c.slides, b] });
  }, me = () => {
    const l = F("slide"), b = /* @__PURE__ */ new Map(), x = Object.fromEntries(Object.values(_.files).map((L) => {
      const j = F("asset");
      return b.set(L.id, j), [j, { ...L, id: j }];
    })), M = { ..._, id: l, title: O("knowledge.auto.6a5e2aa1a875c415", { value0: _.title }), files: x, elements: _.elements.map((L) => ({ ...L, id: F("element"), asset_id: L.asset_id ? b.get(L.asset_id) : void 0 })) }, W = [...c.slides];
    W.splice(U + 1, 0, M), y(l), T(""), B({ ...c, slides: W });
  }, we = () => {
    if (c.slides.length === 1) return;
    const l = c.slides.filter((x) => x.id !== _.id), b = Math.max(0, U - 1);
    y(l[b].id), T(""), B({ ...c, slides: l });
  }, ie = (l) => {
    const b = U + l;
    if (b < 0 || b >= c.slides.length) return;
    const x = [...c.slides], [M] = x.splice(U, 1);
    x.splice(b, 0, M), B({ ...c, slides: x });
  }, ye = (l) => {
    _.elements.length && !window.confirm(i("knowledge.auto.4764a7a7713b4879")) || (T(""), $({ ..._, layout: l, files: {}, elements: De(_.id, l, c.master) }));
  }, ke = () => {
    const l = { id: F("text"), type: "text", x: 220, y: 270, width: 1160, height: 180, rotation: 0, text: i("knowledge.auto.22d0f8c8ee913aa7"), font_size: 42, font_weight: "normal", color: c.master.text_color, align: "left" };
    T(l.id), $({ ..._, elements: [..._.elements, l] });
  }, ve = (l) => {
    const b = l === "line", x = { id: F("shape"), type: "shape", x: 520, y: b ? 420 : 300, width: 560, height: b ? 40 : 260, rotation: 0, shape: l, fill_color: c.master.accent_color, stroke_color: c.master.accent_color, stroke_width: 2, text: "", font_size: 32, font_weight: "normal", color: c.master.background_color, align: "center" };
    X(!1), T(x.id), $({ ..._, elements: [..._.elements, x] });
  }, _e = () => {
    const l = { id: F("table"), type: "table", x: 260, y: 230, width: 1080, height: 430, rotation: 0, table: { header: !0, rows: [[i("knowledge.auto.79f326be4409d51f"), i("knowledge.auto.a525346277ed54bd"), i("knowledge.auto.6320b4a8722a851f")], [i("knowledge.auto.a3952e8c36ca4cef"), "Alice", i("knowledge.auto.dc9591e56d502b43")], [i("knowledge.auto.b28b284d5bf8053c"), "Bob", i("knowledge.auto.5b715411b1f99742")]] } };
    T(l.id), $({ ..._, elements: [..._.elements, l] });
  }, xe = () => {
    const l = { id: F("chart"), type: "chart", x: 260, y: 210, width: 1080, height: 500, rotation: 0, chart: { type: "column", categories: [i("knowledge.auto.5fbab6f796a2917a"), i("knowledge.auto.0a64cbfe42ef0598"), i("knowledge.auto.d13a5e854192559f"), i("knowledge.auto.687468619f6ba3ac")], series: [{ name: i("knowledge.auto.57060c88a36bf3d0"), values: [42, 58, 66, 82] }, { name: i("knowledge.auto.e0ae9a3c77ae781d"), values: [38, 61, 72, 88] }] } };
    T(l.id), $({ ..._, elements: [..._.elements, l] });
  }, Te = () => {
    const l = { id: F("formula"), type: "formula", x: 330, y: 310, width: 940, height: 250, rotation: 0, formula: "E = mc^2", font_size: 56, color: c.master.text_color };
    T(l.id), $({ ..._, elements: [..._.elements, l] });
  }, Se = () => {
    const l = { id: F("code"), type: "code", x: 260, y: 190, width: 1080, height: 530, rotation: 0, language: "typescript", source: `const insight = data.map(analyze);
return insight.filter(Boolean);`, font_size: 24, color: "#E9F5EF", fill_color: "#101D19" };
    T(l.id), $({ ..._, elements: [..._.elements, l] });
  }, Ne = async (l) => {
    if (!t || !w) {
      r?.(i("knowledge.auto.afcc18d93c9ee1d0"));
      return;
    }
    const b = l.type === "image/png" || l.type === "image/jpeg" || l.type === "image/webp" || l.type === "image/gif", x = l.type === "video/mp4" || l.type === "video/webm";
    if (!b && !x) {
      r?.(i("knowledge.auto.a6962e9cf730492d"));
      return;
    }
    try {
      const M = lt(await t(l));
      if (!M) throw Error(i("knowledge.auto.8572e3553882d66f"));
      const W = F("asset"), L = F(b ? "image" : "video"), j = { id: W, mime_type: l.type, document_ref: M, filename: l.name }, ze = { id: L, type: b ? "image" : "video", x: 240, y: 210, width: 1120, height: 560, rotation: 0, asset_id: W, fit: "contain" };
      T(L), $({ ..._, files: { ..._.files, [W]: j }, elements: [..._.elements, ze] });
    } catch (M) {
      r?.(M instanceof Error ? M.message : i("knowledge.auto.511c04e3a3a785fb"));
    }
  }, Ce = () => {
    if (!Y) return;
    const l = { ..._.files };
    Y.asset_id && delete l[Y.asset_id], $({ ..._, files: l, elements: _.elements.filter((b) => b.id !== Y.id) }), T("");
  }, le = async (l) => {
    te(l);
    try {
      if (!n) throw Error(i("knowledge.auto.5838a06d4990c165"));
      await n(l === "pdf" ? "print" : "export"), l === "pdf" ? await pt(m.current, h, p) : await ft(m.current, h, p), r?.(O("knowledge.auto.5f6eb852de0a1889", { value0: l.toUpperCase() }));
    } catch (b) {
      r?.(b instanceof Error ? b.message : i("knowledge.auto.fa82812de07b5215"));
    } finally {
      te("");
    }
  }, Pe = (l, b) => {
    if (u || l.button !== 0) return;
    l.currentTarget.setPointerCapture(l.pointerId);
    const x = l.currentTarget.parentElement?.getBoundingClientRect();
    x && (T(b.id), V.current = { id: b.id, startX: l.clientX, startY: l.clientY, x: b.x, y: b.y, stageWidth: x.width, stageHeight: x.height });
  }, Me = (l) => {
    const b = V.current;
    if (!b) return;
    const x = m.current.slides.find((j) => j.id === v), M = x?.elements.find((j) => j.id === b.id);
    if (!x || !M) return;
    const W = Math.max(0, Math.min(z - M.width, b.x + (l.clientX - b.startX) / b.stageWidth * z)), L = Math.max(0, Math.min(D - M.height, b.y + (l.clientY - b.startY) / b.stageHeight * D));
    oe({ ...M, x: Math.round(W), y: Math.round(L) }, !1);
  }, re = () => {
    V.current && (V.current = null, f(ne(m.current)));
  };
  return /* @__PURE__ */ d("div", { className: "knowledge-open-editor knowledge-presentation-editor", children: [
    n && /* @__PURE__ */ d($e, { host: o, children: [
      /* @__PURE__ */ d(E, { title: i("knowledge.auto.e42c8735ec9f56e3"), disabled: !!G, onClick: () => {
        le("pdf");
      }, children: [
        /* @__PURE__ */ a(He, { size: 15 }),
        "PDF"
      ] }),
      /* @__PURE__ */ d(E, { title: i("knowledge.auto.ed957a48cd8bee1b"), disabled: !!G, onClick: () => {
        le("pptx");
      }, children: [
        /* @__PURE__ */ a(Be, { size: 15 }),
        "PPTX"
      ] })
    ] }),
    /* @__PURE__ */ d("div", { className: "presentation-toolbar", "aria-label": i("knowledge.auto.b33080b4902a6b47"), children: [
      !u && /* @__PURE__ */ d(q, { children: [
        /* @__PURE__ */ d("label", { children: [
          /* @__PURE__ */ a("span", { children: i("knowledge.auto.788db1cfec2a3db5") }),
          /* @__PURE__ */ a(I, { value: c.theme, onChange: (l) => B(Le(c, l.target.value)), children: Object.entries(Fe).map(([l, b]) => /* @__PURE__ */ a("option", { value: l, children: b.label }, l)) })
        ] }),
        /* @__PURE__ */ d("label", { children: [
          /* @__PURE__ */ a("span", { children: i("knowledge.auto.d9c446642799abb0") }),
          /* @__PURE__ */ a(I, { value: _.layout, onChange: (l) => ye(l.target.value), children: Re.map((l) => /* @__PURE__ */ a("option", { value: l.id, children: l.label }, l.id)) })
        ] }),
        /* @__PURE__ */ a("span", { className: "presentation-toolbar-divider" }),
        /* @__PURE__ */ d(E, { title: i("knowledge.auto.44f709e7d4df39ec"), onClick: ke, children: [
          /* @__PURE__ */ a(Xe, { size: 15 }),
          i("knowledge.auto.dd81861811e57bf7")
        ] }),
        /* @__PURE__ */ d("div", { className: "presentation-shape-picker", ref: ae, children: [
          /* @__PURE__ */ d(E, { title: i("knowledge.auto.972334a1bbb66c44"), "aria-expanded": R, "aria-haspopup": "menu", onClick: () => X((l) => !l), children: [
            /* @__PURE__ */ a(Ge, { size: 15 }),
            i("knowledge.auto.c2f71c1b10ef9d80"),
            /* @__PURE__ */ a(Q, { size: 13 })
          ] }),
          R && /* @__PURE__ */ a("div", { className: "presentation-shape-menu", role: "menu", "aria-label": i("knowledge.auto.9372c61e98b06a84"), children: de.map((l) => /* @__PURE__ */ d("button", { type: "button", role: "menuitem", title: O("knowledge.auto.b4740513958cc42d", { value0: Z[l] }), onClick: () => ve(l), children: [
            /* @__PURE__ */ a("span", { children: /* @__PURE__ */ a(fe, { shape: l, fill: "var(--knowledge-surface-tint)", stroke: "currentColor", strokeWidth: 2 }) }),
            /* @__PURE__ */ a("b", { children: Z[l] })
          ] }, l)) })
        ] }),
        /* @__PURE__ */ d(E, { title: i("knowledge.auto.43f006bd439207c4"), onClick: _e, children: [
          /* @__PURE__ */ a(Ye, { size: 15 }),
          i("knowledge.auto.22d9e7c54b88cacd")
        ] }),
        /* @__PURE__ */ d(E, { title: i("knowledge.auto.8c2492d08f1a6bcb"), onClick: xe, children: [
          /* @__PURE__ */ a(qe, { size: 15 }),
          i("knowledge.auto.8cb443ab83797881")
        ] }),
        /* @__PURE__ */ d(E, { title: i("knowledge.auto.85fbe03102bdb89f"), onClick: Te, children: [
          /* @__PURE__ */ a(Oe, { size: 15 }),
          i("knowledge.auto.f3fccedacbcebbfa")
        ] }),
        /* @__PURE__ */ d(E, { title: i("knowledge.auto.ebd11b2cabe9972c"), onClick: Se, children: [
          /* @__PURE__ */ a(Ke, { size: 15 }),
          i("knowledge.auto.e6f04ffbaa424001")
        ] }),
        /* @__PURE__ */ d("label", { className: "knowledge-button presentation-upload", children: [
          /* @__PURE__ */ a(Ve, { size: 15 }),
          i("knowledge.auto.fa33e10009759859"),
          /* @__PURE__ */ a("input", { type: "file", accept: "image/png,image/jpeg,image/webp,image/gif,video/mp4,video/webm", onChange: (l) => {
            const b = l.target.files?.[0];
            l.currentTarget.value = "", b && Ne(b);
          } })
        ] })
      ] }),
      /* @__PURE__ */ a("span", { className: "presentation-toolbar-spacer" }),
      /* @__PURE__ */ d(E, { title: i("knowledge.auto.d4cfe0d759e70a47"), onClick: () => H(!0), children: [
        /* @__PURE__ */ a(Je, { size: 15 }),
        i("knowledge.auto.d4cfe0d759e70a47")
      ] })
    ] }),
    /* @__PURE__ */ d("div", { className: `presentation-workspace${u ? " is-readonly" : ""}`, children: [
      /* @__PURE__ */ d("aside", { className: "presentation-slide-list", "aria-label": i("knowledge.auto.5d32c633a3d8db80"), children: [
        c.slides.map((l, b) => /* @__PURE__ */ d("button", { type: "button", "aria-current": l.id === _.id ? "true" : void 0, onClick: () => {
          y(l.id), T("");
        }, children: [
          /* @__PURE__ */ a("span", { children: b + 1 }),
          /* @__PURE__ */ d("div", { children: [
            /* @__PURE__ */ a(ee, { content: c, slide: l, readFile: p, thumbnail: !0 }),
            /* @__PURE__ */ a("strong", { children: l.title })
          ] })
        ] }, l.id)),
        !u && /* @__PURE__ */ d(E, { className: "presentation-add-slide", onClick: be, children: [
          /* @__PURE__ */ a(Qe, { size: 15 }),
          i("knowledge.auto.1f20b204fc730c48")
        ] })
      ] }),
      /* @__PURE__ */ d("main", { className: "presentation-stage-column", children: [
        !u && /* @__PURE__ */ d("div", { className: "presentation-slide-meta", children: [
          /* @__PURE__ */ a("input", { "aria-label": i("knowledge.auto.0061a4445f629e6a"), maxLength: 512, value: _.title, onChange: (l) => $({ ..._, title: l.target.value || i("knowledge.auto.dc0e764313122d2d") }) }),
          /* @__PURE__ */ d("div", { children: [
            /* @__PURE__ */ a("button", { type: "button", title: i("knowledge.auto.31c0ffad904b4d78"), disabled: U === 0, onClick: () => ie(-1), children: /* @__PURE__ */ a(ce, { size: 15 }) }),
            /* @__PURE__ */ a("button", { type: "button", title: i("knowledge.auto.9751d0cd0e5275c4"), disabled: U === c.slides.length - 1, onClick: () => ie(1), children: /* @__PURE__ */ a(Q, { size: 15 }) }),
            /* @__PURE__ */ a("button", { type: "button", title: i("knowledge.auto.7ff515869fd0fe78"), onClick: me, children: /* @__PURE__ */ a(Ze, { size: 15 }) }),
            /* @__PURE__ */ a("button", { type: "button", title: i("knowledge.auto.0f2b14d9932a519c"), disabled: c.slides.length === 1, onClick: we, children: /* @__PURE__ */ a(ue, { size: 15 }) })
          ] })
        ] }),
        /* @__PURE__ */ a("div", { className: "presentation-stage", onPointerMove: Me, onPointerUp: re, onPointerCancel: re, children: /* @__PURE__ */ a(ee, { content: c, slide: _, selectedElementID: S, readOnly: u, readFile: p, onSelectElement: T, onElementPointerDown: Pe }) }),
        !u && /* @__PURE__ */ d("label", { className: "presentation-speaker-notes", children: [
          /* @__PURE__ */ a("span", { children: i("knowledge.auto.2b02cdb32d5f6500") }),
          /* @__PURE__ */ a("textarea", { placeholder: i("knowledge.auto.b45200c0e6f7f0c0"), value: _.notes, onChange: (l) => $({ ..._, notes: l.target.value }) })
        ] })
      ] }),
      !u && /* @__PURE__ */ a("aside", { className: "presentation-inspector", children: Y ? /* @__PURE__ */ a(mt, { element: Y, onChange: oe, onDelete: Ce }) : /* @__PURE__ */ a(bt, { master: c.master, onChange: (l) => B({ ...c, master: l }) }) })
    ] }),
    P && /* @__PURE__ */ a(gt, { content: c, initial: U, readFile: p, onClose: () => H(!1) })
  ] });
}
export {
  St as PresentationEditor,
  St as default
};
