import { jsxs as n, jsx as a, Fragment as Y } from "react/jsx-runtime";
import { useMemo as Me, useState as j, useRef as J, useEffect as O } from "react";
import { createPortal as $e } from "react-dom";
import { r as ze } from "./katex.min-Ces3EuFF.js";
import { FileDown as Ee, Maximize2 as Fe, Type as Le, RectangleHorizontal as Re, ChevronDown as K, Table2 as De, BarChart3 as je, Sigma as Ae, Braces as We, ImagePlus as Ue, MonitorPlay as Ie, Plus as He, ChevronUp as se, Copy as Xe, Trash2 as ne, AlignLeft as Be, AlignCenter as Ge, AlignRight as Ye, X as Oe, Video as qe } from "lucide-react";
import { b as Je, P as Ke, B as $, S as U, d as Ve, e as Qe, f as Ze, g as ce, h as oe, i as et, j as tt, k as M, l as R, n as at } from "./index-BHTb83zb.js";
import { s as de } from "./documentTransfer-EuLogqx3.js";
const le = /^knowledge-document:kdoc_[a-f0-9]{32}$/, V = {
  rectangle: "矩形",
  rounded_rectangle: "圆角矩形",
  ellipse: "椭圆",
  triangle: "三角形",
  diamond: "菱形",
  hexagon: "六边形",
  star: "星形",
  arrow_right: "右箭头",
  callout: "标注气泡",
  line: "直线"
}, he = { column: "柱状图", bar: "条形图", line: "折线图", area: "面积图", pie: "饼图", donut: "环形图" }, S = ["#00856A", "#4E7FEC", "#F0A93B", "#D45C7D", "#7559C7", "#21A6A1"];
function E(e) {
  return `${e}-${crypto.randomUUID()}`;
}
function P(e) {
  return e.replace(/^#/, "").toUpperCase();
}
function it(e) {
  if (typeof e == "string") return le.test(e) ? e : "";
  const d = e && typeof e.props == "object" && e.props ? e.props : {}, h = String(d.url || e.url || "");
  return le.test(h) ? h : "";
}
async function rt(e) {
  return await new Promise((d, h) => {
    const s = new FileReader();
    s.onload = () => d(String(s.result || "")), s.onerror = () => h(s.error || Error("媒体读取失败")), s.readAsDataURL(e);
  });
}
function ot({ asset: e, readFile: d, thumbnail: h = !1 }) {
  const [s, t] = j(""), [y, p] = j(!1);
  return O(() => {
    let i = !0, l = "";
    if (!d) {
      p(!0);
      return;
    }
    return p(!1), d(e.document_ref).then((o) => {
      i && (l = URL.createObjectURL(o), t(l));
    }).catch(() => {
      i && p(!0);
    }), () => {
      i = !1, l && URL.revokeObjectURL(l);
    };
  }, [e.document_ref, d]), y ? /* @__PURE__ */ a("span", { className: "presentation-media-state", children: "媒体不可用" }) : s ? e.mime_type.startsWith("video/") ? h ? /* @__PURE__ */ n("span", { className: "presentation-video-thumbnail", children: [
    /* @__PURE__ */ a(qe, { size: 20 }),
    "视频"
  ] }) : /* @__PURE__ */ a("video", { src: s, controls: !0 }) : /* @__PURE__ */ a("img", { src: s, alt: e.filename, draggable: !1 }) : /* @__PURE__ */ a("span", { className: "presentation-media-state", children: "正在加载…" });
}
function lt(e) {
  return {
    left: `${e.x / M * 100}%`,
    top: `${e.y / R * 100}%`,
    width: `${e.width / M * 100}%`,
    height: `${e.height / R * 100}%`,
    transform: `rotate(${e.rotation}deg)`
  };
}
function pe({ shape: e, fill: d, stroke: h, strokeWidth: s }) {
  const t = { fill: e === "line" ? "none" : d, stroke: h, strokeWidth: Math.max(0, s), vectorEffect: "non-scaling-stroke" };
  return /* @__PURE__ */ n("svg", { className: "presentation-shape-graphic", viewBox: "0 0 100 100", preserveAspectRatio: "none", "aria-hidden": "true", children: [
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
function st({ chart: e }) {
  const d = e.series.flatMap((u) => u.values), h = Math.max(1, ...d.map((u) => Math.abs(u)));
  if (e.type === "pie" || e.type === "donut") {
    const u = e.series[0]?.values.map((m) => Math.max(0, m)) || [], f = Math.max(1, u.reduce((m, w) => m + w, 0));
    let c = 0;
    const v = u.map((m, w) => {
      const b = c;
      return c += m / f * 100, `${S[w % S.length]} ${b}% ${c}%`;
    });
    return /* @__PURE__ */ n("div", { className: "presentation-pie-chart", children: [
      /* @__PURE__ */ a("i", { className: e.type === "donut" ? "is-donut" : "", style: { background: `conic-gradient(${v.join(",")})` } }),
      /* @__PURE__ */ a("ol", { children: e.categories.slice(0, 6).map((m, w) => /* @__PURE__ */ n("li", { children: [
        /* @__PURE__ */ a("span", { style: { background: S[w % S.length] } }),
        m,
        /* @__PURE__ */ a("b", { children: u[w] ?? 0 })
      ] }, `${m}:${w}`)) })
    ] });
  }
  const s = 1e3, t = 480, y = 70, p = 48, i = s - y * 2, l = t - p * 2, o = (u) => e.series[u].values.map((f, c) => ({ x: y + (c + 0.5) * i / e.categories.length, y: p + l - Math.max(0, f) / h * l }));
  return /* @__PURE__ */ n("svg", { className: `presentation-chart-graphic is-${e.type}`, viewBox: `0 0 ${s} ${t}`, preserveAspectRatio: "none", "aria-label": he[e.type], children: [
    [0, 1, 2, 3, 4].map((u) => /* @__PURE__ */ a("line", { x1: y, x2: s - y, y1: p + l * u / 4, y2: p + l * u / 4, stroke: "#DDE7E2", strokeWidth: "2" }, u)),
    e.type === "column" && e.series.map((u, f) => u.values.map((c, v) => {
      const m = i / e.categories.length, w = m * 0.72 / e.series.length, b = y + v * m + m * 0.14 + f * w, T = Math.max(2, Math.max(0, c) / h * l);
      return /* @__PURE__ */ a("rect", { x: b, y: p + l - T, width: w - 3, height: T, rx: "3", fill: S[f % S.length] }, `${u.name}:${v}`);
    })),
    e.type === "bar" && e.series.slice(0, 1).flatMap((u) => u.values.map((f, c) => {
      const v = l / e.categories.length, m = Math.max(2, Math.max(0, f) / h * i);
      return /* @__PURE__ */ a("rect", { x: y, y: p + c * v + v * 0.2, width: m, height: v * 0.6, rx: "3", fill: S[c % S.length] }, `${u.name}:${c}`);
    })),
    (e.type === "line" || e.type === "area") && e.series.map((u, f) => {
      const c = o(f), v = c.map((w, b) => `${b ? "L" : "M"}${w.x},${w.y}`).join(" "), m = `${v} L${c.at(-1)?.x},${p + l} L${c[0]?.x},${p + l} Z`;
      return /* @__PURE__ */ n("g", { children: [
        e.type === "area" && /* @__PURE__ */ a("path", { d: m, fill: S[f % S.length], opacity: ".18" }),
        /* @__PURE__ */ a("path", { d: v, fill: "none", stroke: S[f % S.length], strokeWidth: "8", strokeLinecap: "round", strokeLinejoin: "round" }),
        c.map((w, b) => /* @__PURE__ */ a("circle", { cx: w.x, cy: w.y, r: "7", fill: S[f % S.length] }, b))
      ] }, u.name);
    })
  ] });
}
function ue(e) {
  return { text: "文本", shape: "形状", image: "图片", video: "视频", table: "表格", chart: "图表", formula: "公式", code: "代码" }[e];
}
function nt({ element: e, asset: d, readFile: h, thumbnail: s = !1 }) {
  if (e.type === "text")
    return /* @__PURE__ */ a("div", { className: "presentation-text-element", style: { color: e.color, fontSize: `${e.font_size / M * 100}cqw`, fontWeight: e.font_weight === "bold" ? 750 : 400, textAlign: e.align }, children: e.text });
  if (e.type === "shape") {
    const t = e.shape || "rectangle";
    return /* @__PURE__ */ n("div", { className: `presentation-shape-element is-${t}`, style: { color: e.color, fontSize: `${e.font_size / M * 100}cqw`, fontWeight: e.font_weight === "bold" ? 750 : 400, textAlign: e.align }, children: [
      /* @__PURE__ */ a(pe, { shape: t, fill: e.fill_color || "#FFFFFF", stroke: e.stroke_color || "#000000", strokeWidth: e.stroke_width ?? 1 }),
      e.text && /* @__PURE__ */ a("span", { children: e.text })
    ] });
  }
  if (e.type === "table" && e.table) return /* @__PURE__ */ a("div", { className: `presentation-table-element${e.table.header ? " has-header" : ""}`, children: /* @__PURE__ */ a("table", { children: /* @__PURE__ */ a("tbody", { children: e.table.rows.map((t, y) => /* @__PURE__ */ a("tr", { children: t.map((p, i) => /* @__PURE__ */ a("td", { children: p }, i)) }, y)) }) }) });
  if (e.type === "chart" && e.chart) return /* @__PURE__ */ a("div", { className: "presentation-chart-element", children: /* @__PURE__ */ a(st, { chart: e.chart }) });
  if (e.type === "formula") {
    const t = ze(e.formula || "", !0);
    return /* @__PURE__ */ a("div", { className: "presentation-formula-element", style: { color: e.color, fontSize: `${(e.font_size || 40) / M * 100}cqw` }, children: t.html ? /* @__PURE__ */ a("span", { dangerouslySetInnerHTML: { __html: t.html } }) : /* @__PURE__ */ a("code", { children: e.formula }) });
  }
  return e.type === "code" ? /* @__PURE__ */ n("pre", { className: "presentation-code-element", style: { color: e.color, background: e.fill_color, fontSize: `${(e.font_size || 24) / M * 100}cqw` }, children: [
    /* @__PURE__ */ a("small", { children: e.language }),
    /* @__PURE__ */ a("code", { children: e.source })
  ] }) : d ? /* @__PURE__ */ a("div", { className: `presentation-media-element is-${e.fit}`, children: /* @__PURE__ */ a(ot, { asset: d, readFile: h, thumbnail: s }) }) : /* @__PURE__ */ a("span", { className: "presentation-media-state", children: "媒体引用失效" });
}
function Q({ content: e, slide: d, selectedElementID: h = "", readOnly: s = !0, thumbnail: t = !1, readFile: y, onSelectElement: p, onElementPointerDown: i }) {
  return /* @__PURE__ */ n("div", { className: `presentation-slide-canvas${t ? " is-thumbnail" : ""}`, style: { background: d.background_color || e.master.background_color, color: e.master.text_color }, children: [
    d.elements.map((l) => {
      const o = /* @__PURE__ */ a(nt, { element: l, asset: l.asset_id ? d.files[l.asset_id] : void 0, readFile: y, thumbnail: t }), u = lt(l);
      return s || t ? /* @__PURE__ */ a("div", { className: "presentation-element", style: u, children: o }, l.id) : /* @__PURE__ */ a("button", { type: "button", className: `presentation-element is-editable${h === l.id ? " is-selected" : ""}`, "aria-label": `选择${ue(l.type)}元素`, style: u, onClick: () => p?.(l.id), onPointerDown: (f) => i?.(f, l), children: o }, l.id);
    }),
    (e.master.footer || e.master.show_slide_number) && /* @__PURE__ */ n("footer", { children: [
      /* @__PURE__ */ a("span", { children: e.master.footer }),
      e.master.show_slide_number && /* @__PURE__ */ a("b", { children: e.slides.findIndex((l) => l.id === d.id) + 1 })
    ] })
  ] });
}
function ct(e, d, h, s) {
  switch (e.beginPath(), d) {
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
      const t = Math.min(h, s) / 2, y = t * 0.42;
      for (let p = 0; p < 10; p++) {
        const i = p % 2 ? y : t, l = -Math.PI / 2 + p * Math.PI / 5, o = h / 2 + Math.cos(l) * i, u = s / 2 + Math.sin(l) * i;
        p === 0 ? e.moveTo(o, u) : e.lineTo(o, u);
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
async function dt(e, d, h) {
  const s = document.createElement("canvas");
  s.width = M, s.height = R;
  const t = s.getContext("2d");
  if (!t) throw Error("当前浏览器不支持幻灯片导出。");
  t.fillStyle = d.background_color || e.master.background_color, t.fillRect(0, 0, s.width, s.height);
  const y = (i, l) => {
    t.save(), t.translate(l.x + l.width / 2, l.y + l.height / 2), t.rotate(l.rotation * Math.PI / 180), t.translate(-l.width / 2, -l.height / 2), t.fillStyle = l.color || e.master.text_color, t.font = `${l.font_weight === "bold" ? "700" : "400"} ${l.font_size || 28}px ${e.master.font_family}`, t.textBaseline = "top", t.textAlign = l.align || "left";
    const o = l.align === "center" ? l.width / 2 : l.align === "right" ? l.width : 0, u = (l.font_size || 28) * 1.25;
    let f = 0;
    for (const c of i.split(`
`)) {
      const v = [...c];
      let m = "";
      for (const w of v) {
        const b = m + w;
        m && t.measureText(b).width > l.width ? (t.fillText(m, o, f, l.width), m = w, f += u) : m = b;
      }
      if (t.fillText(m, o, f, l.width), f += u, f > l.height) break;
    }
    t.restore();
  }, p = (i, l) => {
    const o = l.series.flatMap((m) => m.values), u = Math.max(1, ...o.map((m) => Math.abs(m)));
    t.save(), t.translate(i.x, i.y);
    const f = 42, c = i.width - f * 2, v = i.height - f * 2;
    if (l.type === "pie" || l.type === "donut") {
      const m = l.series[0]?.values.map((T) => Math.max(0, T)) || [], w = Math.max(1, m.reduce((T, k) => T + k, 0));
      let b = -Math.PI / 2;
      m.forEach((T, k) => {
        const N = b + T / w * Math.PI * 2;
        t.beginPath(), t.moveTo(i.width / 2, i.height / 2), t.arc(i.width / 2, i.height / 2, Math.min(c, v) * 0.42, b, N), t.closePath(), t.fillStyle = S[k % S.length], t.fill(), b = N;
      }), l.type === "donut" && (t.beginPath(), t.arc(i.width / 2, i.height / 2, Math.min(c, v) * 0.2, 0, Math.PI * 2), t.fillStyle = d.background_color || e.master.background_color, t.fill());
    } else l.type === "column" ? l.series.forEach((m, w) => m.values.forEach((b, T) => {
      const k = c / l.categories.length, N = k * 0.72 / l.series.length, I = Math.max(2, Math.max(0, b) / u * v);
      t.fillStyle = S[w % S.length], t.fillRect(f + T * k + k * 0.14 + w * N, f + v - I, Math.max(2, N - 3), I);
    })) : l.type === "bar" ? l.series[0]?.values.forEach((m, w) => {
      const b = v / l.categories.length;
      t.fillStyle = S[w % S.length], t.fillRect(f, f + w * b + b * 0.2, Math.max(2, Math.max(0, m) / u * c), b * 0.6);
    }) : l.series.forEach((m, w) => {
      t.beginPath(), m.values.forEach((b, T) => {
        const k = f + (T + 0.5) * c / l.categories.length, N = f + v - Math.max(0, b) / u * v;
        T ? t.lineTo(k, N) : t.moveTo(k, N);
      }), l.type === "area" && (t.lineTo(f + c - c / l.categories.length / 2, f + v), t.lineTo(f + c / l.categories.length / 2, f + v), t.closePath(), t.globalAlpha = 0.18, t.fillStyle = S[w % S.length], t.fill(), t.globalAlpha = 1), t.strokeStyle = S[w % S.length], t.lineWidth = 6, t.stroke();
    });
    t.restore();
  };
  for (const i of d.elements) {
    if (i.type === "text") {
      y(i.text || "", i);
      continue;
    }
    if (i.type === "shape") {
      t.save(), t.translate(i.x + i.width / 2, i.y + i.height / 2), t.rotate(i.rotation * Math.PI / 180), t.translate(-i.width / 2, -i.height / 2), t.fillStyle = i.fill_color || "#FFFFFF", t.strokeStyle = i.stroke_color || "#000000", t.lineWidth = i.stroke_width ?? 1, ct(t, i.shape || "rectangle", i.width, i.height), i.shape !== "line" && t.fill(), t.stroke(), t.restore(), i.text && y(i.text, i);
      continue;
    }
    if (i.type === "table" && i.table) {
      t.save(), t.translate(i.x, i.y);
      const b = i.table.rows, T = i.height / b.length, k = b[0].length, N = i.width / k;
      t.font = `400 ${Math.max(14, Math.min(28, T * 0.35))}px ${e.master.font_family}`, t.textBaseline = "middle", b.forEach((I, L) => I.forEach((X, B) => {
        t.fillStyle = i.table.header && L === 0 ? e.master.accent_color : "#FFFFFF", t.fillRect(B * N, L * T, N, T), t.strokeStyle = e.master.muted_color, t.strokeRect(B * N, L * T, N, T), t.fillStyle = i.table.header && L === 0 ? e.master.background_color : e.master.text_color, t.fillText(X, B * N + 10, L * T + T / 2, N - 20);
      })), t.restore();
      continue;
    }
    if (i.type === "chart" && i.chart) {
      p(i, i.chart);
      continue;
    }
    if (i.type === "formula") {
      y(i.formula || "", { ...i, text: i.formula, font_weight: "normal", align: "center" });
      continue;
    }
    if (i.type === "code") {
      t.fillStyle = i.fill_color || "#101D19", t.fillRect(i.x, i.y, i.width, i.height), y(`${i.language || "text"}
${i.source || ""}`, { ...i, text: i.source, font_weight: "normal", align: "left" });
      continue;
    }
    const l = i.asset_id ? d.files[i.asset_id] : void 0;
    if (!l || !h) continue;
    if (i.type === "video") {
      t.fillStyle = "#17221C", t.fillRect(i.x, i.y, i.width, i.height), t.fillStyle = "#FFFFFF", t.font = "700 30px Arial", t.textAlign = "center", t.fillText(`▶ ${l.filename}`, i.x + i.width / 2, i.y + i.height / 2, i.width - 40);
      continue;
    }
    const o = await createImageBitmap(await h(l.document_ref)), u = o.width / o.height, f = i.width / i.height;
    let c = i.width, v = i.height, m = i.x, w = i.y;
    if (i.fit === "contain")
      u > f ? (v = c / u, w += (i.height - v) / 2) : (c = v * u, m += (i.width - c) / 2);
    else if (u > f) {
      const b = o.height * f, T = (o.width - b) / 2;
      t.drawImage(o, T, 0, b, o.height, m, w, c, v), o.close();
      continue;
    } else {
      const b = o.width / f, T = (o.height - b) / 2;
      t.drawImage(o, 0, T, o.width, b, m, w, c, v), o.close();
      continue;
    }
    t.drawImage(o, m, w, c, v), o.close();
  }
  return e.master.footer && (t.fillStyle = e.master.muted_color, t.font = `400 18px ${e.master.font_family}`, t.textAlign = "left", t.fillText(e.master.footer, 64, 854, 1200)), e.master.show_slide_number && (t.fillStyle = e.master.muted_color, t.font = `700 18px ${e.master.font_family}`, t.textAlign = "right", t.fillText(String(e.slides.findIndex((i) => i.id === d.id) + 1), 1536, 854)), s;
}
async function ht(e, d, h) {
  const { jsPDF: s } = await import("./jspdf.es.min-DZt4NB26.js").then((y) => y.j), t = new s({ orientation: "landscape", unit: "px", format: [M, R], hotfixes: ["px_scaling"] });
  for (let y = 0; y < e.slides.length; y++) {
    y && t.addPage([M, R], "landscape");
    const p = await dt(e, e.slides[y], h);
    t.addImage(p.toDataURL("image/png"), "PNG", 0, 0, M, R, void 0, "FAST");
  }
  t.save(de(d, "pdf"));
}
async function pt(e, d, h) {
  const { default: s } = await import("./pptxgen.es-CbWrvK_a.js"), t = new s();
  t.layout = "LAYOUT_WIDE", t.author = "Domainry Knowledge", t.company = "Domainry", t.subject = "Knowledge presentation", t.title = d;
  const y = [];
  e.master.footer && y.push({ text: { text: e.master.footer, options: { x: 0.55, y: 7.12, w: 10.8, h: 0.2, fontFace: e.master.font_family, fontSize: 9, color: P(e.master.muted_color), margin: 0 } } }), t.defineSlideMaster({
    title: "KNOWLEDGE_MASTER",
    background: { color: P(e.master.background_color) },
    objects: y,
    slideNumber: e.master.show_slide_number ? { x: 12.25, y: 7.08, w: 0.5, h: 0.22, fontFace: e.master.font_family, fontSize: 9, color: P(e.master.muted_color), align: "right", margin: 0 } : void 0
  });
  const p = 120;
  for (const i of e.slides) {
    const l = t.addSlide({ masterName: "KNOWLEDGE_MASTER" });
    i.background_color && (l.background = { color: P(i.background_color) });
    for (const o of i.elements) {
      const u = { x: o.x / p, y: o.y / p, w: o.width / p, h: o.height / p, rotate: o.rotation };
      if (o.type === "text")
        l.addText(o.text || "", { ...u, fontFace: e.master.font_family, fontSize: (o.font_size || 28) * 0.75, bold: o.font_weight === "bold", color: P(o.color || e.master.text_color), align: o.align, valign: "middle", margin: 0, breakLine: !1 });
      else if (o.type === "shape") {
        const f = o.shape === "rounded_rectangle" ? t.ShapeType.roundRect : o.shape === "ellipse" ? t.ShapeType.ellipse : o.shape === "triangle" ? t.ShapeType.triangle : o.shape === "diamond" ? t.ShapeType.diamond : o.shape === "hexagon" ? t.ShapeType.hexagon : o.shape === "star" ? t.ShapeType.star5 : o.shape === "arrow_right" ? t.ShapeType.rightArrow : o.shape === "callout" ? t.ShapeType.wedgeRectCallout : o.shape === "line" ? t.ShapeType.line : t.ShapeType.rect;
        l.addShape(f, { ...u, fill: { color: P(o.fill_color || "#FFFFFF"), transparency: o.shape === "line" ? 100 : 0 }, line: { color: P(o.stroke_color || "#000000"), width: o.stroke_width ?? 1 } }), o.text && l.addText(o.text, { ...u, fontFace: e.master.font_family, fontSize: (o.font_size || 28) * 0.75, bold: o.font_weight === "bold", color: P(o.color || e.master.text_color), align: o.align, valign: "middle", margin: 4 });
      } else if (o.type === "table" && o.table) {
        const f = o.table.rows.map((c) => c.map((v) => ({ text: v })));
        l.addTable(f, { ...u, border: { type: "solid", color: P(e.master.muted_color), pt: 1 }, fill: { color: P(i.background_color || e.master.background_color) }, color: P(e.master.text_color), fontFace: e.master.font_family, fontSize: 14, bold: !1, margin: 0.06, autoPage: !1, rowH: u.h / o.table.rows.length }), o.table.header && l.addTable([f[0]], { ...u, h: u.h / o.table.rows.length, border: { type: "solid", color: P(e.master.accent_color), pt: 1 }, fill: { color: P(e.master.accent_color) }, color: P(e.master.background_color), fontFace: e.master.font_family, fontSize: 14, bold: !0, margin: 0.06, autoPage: !1 });
      } else if (o.type === "chart" && o.chart) {
        const f = o.chart.type === "donut" ? t.ChartType.doughnut : o.chart.type === "pie" ? t.ChartType.pie : o.chart.type === "line" ? t.ChartType.line : o.chart.type === "area" ? t.ChartType.area : t.ChartType.bar;
        l.addChart(f, o.chart.series.map((c) => ({ name: c.name, labels: o.chart.categories, values: c.values })), { ...u, showLegend: o.chart.series.length > 1, showTitle: !1, showValue: o.chart.type === "pie" || o.chart.type === "donut", showSerName: o.chart.type === "pie" || o.chart.type === "donut", chartColors: S.map(P), ...o.chart.type === "column" ? { barDir: "col" } : o.chart.type === "bar" ? { barDir: "bar" } : {} });
      } else if (o.type === "formula")
        l.addText(o.formula || "", { ...u, fontFace: "Georgia", fontSize: (o.font_size || 40) * 0.75, italic: !0, color: P(o.color || e.master.text_color), align: "center", valign: "middle", margin: 0.08 });
      else if (o.type === "code")
        l.addText(`${o.language || "text"}
${o.source || ""}`, { ...u, fontFace: "Courier New", fontSize: (o.font_size || 24) * 0.75, color: P(o.color || "#FFFFFF"), fill: { color: P(o.fill_color || "#101D19") }, margin: 0.12, breakLine: !1, valign: "top" });
      else {
        const f = o.asset_id ? i.files[o.asset_id] : void 0;
        if (!f || !h) continue;
        const c = await rt(await h(f.document_ref));
        o.type === "image" ? l.addImage({ data: c, sizing: { type: o.fit === "contain" ? "contain" : "cover", x: u.x, y: u.y, w: u.w, h: u.h }, rotate: o.rotation }) : l.addMedia({ type: "video", data: c, extn: f.mime_type === "video/webm" ? "webm" : "mp4", ...u });
      }
    }
    i.notes.trim() && l.addNotes(i.notes);
  }
  await t.writeFile({ fileName: de(d, "pptx"), compression: !0 });
}
function ut({ content: e, initial: d, readFile: h, onClose: s }) {
  const [t, y] = j(d);
  return O(() => {
    const p = (i) => {
      i.key === "Escape" && s(), (i.key === "ArrowRight" || i.key === "PageDown") && y((l) => Math.min(e.slides.length - 1, l + 1)), (i.key === "ArrowLeft" || i.key === "PageUp") && y((l) => Math.max(0, l - 1));
    };
    return window.addEventListener("keydown", p), () => window.removeEventListener("keydown", p);
  }, [e.slides.length, s]), $e(/* @__PURE__ */ n("div", { className: "presentation-slideshow", role: "dialog", "aria-modal": "true", "aria-label": "幻灯片放映", children: [
    /* @__PURE__ */ a("div", { className: "presentation-slideshow-slide", children: /* @__PURE__ */ a(Q, { content: e, slide: e.slides[t], readFile: h }) }),
    /* @__PURE__ */ n("div", { className: "presentation-slideshow-controls", children: [
      /* @__PURE__ */ n($, { disabled: t === 0, onClick: () => y((p) => p - 1), children: [
        /* @__PURE__ */ a(se, { size: 16 }),
        "上一张"
      ] }),
      /* @__PURE__ */ n("span", { children: [
        t + 1,
        " / ",
        e.slides.length
      ] }),
      /* @__PURE__ */ n($, { disabled: t === e.slides.length - 1, onClick: () => y((p) => p + 1), children: [
        "下一张",
        /* @__PURE__ */ a(K, { size: 16 })
      ] }),
      /* @__PURE__ */ a($, { title: "退出放映", "aria-label": "退出放映", onClick: s, children: /* @__PURE__ */ a(Oe, { size: 17 }) })
    ] })
  ] }), document.body);
}
function ft({ master: e, onChange: d }) {
  const h = (s, t) => /* @__PURE__ */ n("label", { children: [
    /* @__PURE__ */ a("span", { children: t }),
    /* @__PURE__ */ a("input", { type: "color", value: e[s], onChange: (y) => d({ ...e, [s]: y.target.value.toUpperCase() }) })
  ] });
  return /* @__PURE__ */ n("div", { className: "presentation-master-inspector", children: [
    /* @__PURE__ */ a("h4", { children: "母版" }),
    /* @__PURE__ */ a("p", { children: "统一控制整份演示的字体、色彩、页脚和页码。" }),
    h("background_color", "背景"),
    h("text_color", "正文"),
    h("accent_color", "强调"),
    h("muted_color", "辅助"),
    /* @__PURE__ */ n("label", { className: "is-wide", children: [
      /* @__PURE__ */ a("span", { children: "字体" }),
      /* @__PURE__ */ n(U, { value: e.font_family, onChange: (s) => d({ ...e, font_family: s.target.value }), children: [
        /* @__PURE__ */ a("option", { children: "Arial" }),
        /* @__PURE__ */ a("option", { children: "Aptos" }),
        /* @__PURE__ */ a("option", { children: "Helvetica" }),
        /* @__PURE__ */ a("option", { children: "Georgia" }),
        /* @__PURE__ */ a("option", { children: "Times New Roman" })
      ] })
    ] }),
    /* @__PURE__ */ n("label", { className: "is-wide", children: [
      /* @__PURE__ */ a("span", { children: "页脚" }),
      /* @__PURE__ */ a("input", { maxLength: 512, value: e.footer, onChange: (s) => d({ ...e, footer: s.target.value }) })
    ] }),
    /* @__PURE__ */ n("label", { className: "is-check", children: [
      /* @__PURE__ */ a("input", { type: "checkbox", checked: e.show_slide_number, onChange: (s) => d({ ...e, show_slide_number: s.target.checked }) }),
      /* @__PURE__ */ a("span", { children: "显示页码" })
    ] })
  ] });
}
function gt({ element: e, onChange: d, onDelete: h }) {
  const s = (t, y, p, i) => /* @__PURE__ */ n("label", { children: [
    /* @__PURE__ */ a("span", { children: y }),
    /* @__PURE__ */ a("input", { type: "number", min: p, max: i, value: e[t], onChange: (l) => d({ ...e, [t]: Math.max(p, Math.min(i, Number(l.target.value) || 0)) }) })
  ] });
  return /* @__PURE__ */ n("div", { className: "presentation-element-inspector", children: [
    /* @__PURE__ */ n("header", { children: [
      /* @__PURE__ */ n("div", { children: [
        /* @__PURE__ */ a("h4", { children: "元素" }),
        /* @__PURE__ */ a("small", { children: ue(e.type) })
      ] }),
      /* @__PURE__ */ a("button", { type: "button", title: "删除元素", onClick: h, children: /* @__PURE__ */ a(ne, { size: 15 }) })
    ] }),
    /* @__PURE__ */ n("div", { className: "presentation-inspector-grid", children: [
      s("x", "X", 0, M),
      s("y", "Y", 0, R),
      s("width", "宽", 1, M),
      s("height", "高", 1, R),
      s("rotation", "旋转", -360, 360)
    ] }),
    (e.type === "text" || e.type === "shape") && /* @__PURE__ */ n(Y, { children: [
      /* @__PURE__ */ n("label", { className: "is-wide", children: [
        /* @__PURE__ */ a("span", { children: "内容" }),
        /* @__PURE__ */ a("textarea", { value: e.text || "", onChange: (t) => d({ ...e, text: t.target.value }) })
      ] }),
      /* @__PURE__ */ n("div", { className: "presentation-inspector-grid", children: [
        /* @__PURE__ */ n("label", { children: [
          /* @__PURE__ */ a("span", { children: "字号" }),
          /* @__PURE__ */ a("input", { type: "number", min: 8, max: 240, value: e.font_size, onChange: (t) => d({ ...e, font_size: Number(t.target.value) || 8 }) })
        ] }),
        /* @__PURE__ */ n("label", { children: [
          /* @__PURE__ */ a("span", { children: "字重" }),
          /* @__PURE__ */ n(U, { value: e.font_weight, onChange: (t) => d({ ...e, font_weight: t.target.value }), children: [
            /* @__PURE__ */ a("option", { value: "normal", children: "常规" }),
            /* @__PURE__ */ a("option", { value: "bold", children: "加粗" })
          ] })
        ] }),
        /* @__PURE__ */ n("label", { children: [
          /* @__PURE__ */ a("span", { children: "文字色" }),
          /* @__PURE__ */ a("input", { type: "color", value: e.color, onChange: (t) => d({ ...e, color: t.target.value.toUpperCase() }) })
        ] })
      ] }),
      /* @__PURE__ */ n("div", { className: "presentation-align-control", role: "group", "aria-label": "文本对齐", children: [
        /* @__PURE__ */ a("button", { type: "button", "aria-pressed": e.align === "left", onClick: () => d({ ...e, align: "left" }), children: /* @__PURE__ */ a(Be, { size: 15 }) }),
        /* @__PURE__ */ a("button", { type: "button", "aria-pressed": e.align === "center", onClick: () => d({ ...e, align: "center" }), children: /* @__PURE__ */ a(Ge, { size: 15 }) }),
        /* @__PURE__ */ a("button", { type: "button", "aria-pressed": e.align === "right", onClick: () => d({ ...e, align: "right" }), children: /* @__PURE__ */ a(Ye, { size: 15 }) })
      ] })
    ] }),
    e.type === "shape" && /* @__PURE__ */ n("div", { className: "presentation-inspector-grid", children: [
      /* @__PURE__ */ n("label", { children: [
        /* @__PURE__ */ a("span", { children: "形状" }),
        /* @__PURE__ */ a(U, { value: e.shape, onChange: (t) => d({ ...e, shape: t.target.value }), children: ce.map((t) => /* @__PURE__ */ a("option", { value: t, children: V[t] }, t)) })
      ] }),
      /* @__PURE__ */ n("label", { children: [
        /* @__PURE__ */ a("span", { children: "填充" }),
        /* @__PURE__ */ a("input", { type: "color", value: e.fill_color, onChange: (t) => d({ ...e, fill_color: t.target.value.toUpperCase() }) })
      ] }),
      /* @__PURE__ */ n("label", { children: [
        /* @__PURE__ */ a("span", { children: "边框" }),
        /* @__PURE__ */ a("input", { type: "color", value: e.stroke_color, onChange: (t) => d({ ...e, stroke_color: t.target.value.toUpperCase() }) })
      ] })
    ] }),
    (e.type === "image" || e.type === "video") && /* @__PURE__ */ n("label", { className: "is-wide", children: [
      /* @__PURE__ */ a("span", { children: "适应方式" }),
      /* @__PURE__ */ n(U, { value: e.fit, onChange: (t) => d({ ...e, fit: t.target.value }), children: [
        /* @__PURE__ */ a("option", { value: "contain", children: "完整显示" }),
        /* @__PURE__ */ a("option", { value: "cover", children: "铺满裁剪" })
      ] })
    ] }),
    e.type === "table" && e.table && /* @__PURE__ */ n(Y, { children: [
      /* @__PURE__ */ n("label", { className: "is-check", children: [
        /* @__PURE__ */ a("input", { type: "checkbox", checked: e.table.header, onChange: (t) => d({ ...e, table: { ...e.table, header: t.target.checked } }) }),
        /* @__PURE__ */ a("span", { children: "首行为表头" })
      ] }),
      /* @__PURE__ */ n("label", { className: "is-wide", children: [
        /* @__PURE__ */ a("span", { children: "表格内容（Tab 分列、换行分行）" }),
        /* @__PURE__ */ a("textarea", { rows: 10, value: e.table.rows.map((t) => t.join("	")).join(`
`), onChange: (t) => {
          const y = t.target.value.split(`
`).slice(0, 50).map((i) => i.split("	").slice(0, 20)), p = Math.max(1, ...y.map((i) => i.length));
          d({ ...e, table: { ...e.table, rows: y.map((i) => [...i, ...Array(Math.max(0, p - i.length)).fill("")]) } });
        } })
      ] })
    ] }),
    e.type === "chart" && e.chart && /* @__PURE__ */ n(Y, { children: [
      /* @__PURE__ */ n("label", { className: "is-wide", children: [
        /* @__PURE__ */ a("span", { children: "图表类型" }),
        /* @__PURE__ */ a(U, { value: e.chart.type, onChange: (t) => d({ ...e, chart: { ...e.chart, type: t.target.value } }), children: at.map((t) => /* @__PURE__ */ a("option", { value: t, children: he[t] }, t)) })
      ] }),
      /* @__PURE__ */ n("label", { className: "is-wide", children: [
        /* @__PURE__ */ a("span", { children: "分类（逗号分隔）" }),
        /* @__PURE__ */ a("input", { value: e.chart.categories.join(","), onChange: (t) => {
          const y = t.target.value.split(",").map((p) => p.trim()).filter(Boolean).slice(0, 50);
          d({ ...e, chart: { ...e.chart, categories: y, series: e.chart.series.map((p) => ({ ...p, values: y.map((i, l) => p.values[l] || 0) })) } });
        } })
      ] }),
      /* @__PURE__ */ n("label", { className: "is-wide", children: [
        /* @__PURE__ */ a("span", { children: "数据系列（每行“名称:1,2,3”）" }),
        /* @__PURE__ */ a("textarea", { rows: 8, value: e.chart.series.map((t) => `${t.name}:${t.values.join(",")}`).join(`
`), onChange: (t) => {
          const y = t.target.value.split(`
`).slice(0, 12).map((p, i) => {
            const l = p.indexOf(":"), o = (l >= 0 ? p.slice(0, l) : `系列 ${i + 1}`).trim() || `系列 ${i + 1}`, u = l >= 0 ? p.slice(l + 1) : p;
            return { name: o, values: e.chart.categories.map((f, c) => {
              const v = Number(u.split(",")[c]?.trim() || 0);
              return Number.isFinite(v) ? v : 0;
            }) };
          }).filter((p) => p.name);
          d({ ...e, chart: { ...e.chart, series: y.length ? y : [{ name: "系列 1", values: e.chart.categories.map(() => 0) }] } });
        } })
      ] })
    ] }),
    e.type === "formula" && /* @__PURE__ */ n(Y, { children: [
      /* @__PURE__ */ n("label", { className: "is-wide", children: [
        /* @__PURE__ */ a("span", { children: "LaTeX 公式" }),
        /* @__PURE__ */ a("textarea", { rows: 6, value: e.formula || "", onChange: (t) => d({ ...e, formula: t.target.value }) })
      ] }),
      /* @__PURE__ */ n("div", { className: "presentation-inspector-grid", children: [
        /* @__PURE__ */ n("label", { children: [
          /* @__PURE__ */ a("span", { children: "字号" }),
          /* @__PURE__ */ a("input", { type: "number", min: 8, max: 240, value: e.font_size, onChange: (t) => d({ ...e, font_size: Number(t.target.value) || 8 }) })
        ] }),
        /* @__PURE__ */ n("label", { children: [
          /* @__PURE__ */ a("span", { children: "颜色" }),
          /* @__PURE__ */ a("input", { type: "color", value: e.color, onChange: (t) => d({ ...e, color: t.target.value.toUpperCase() }) })
        ] })
      ] })
    ] }),
    e.type === "code" && /* @__PURE__ */ n(Y, { children: [
      /* @__PURE__ */ n("div", { className: "presentation-inspector-grid", children: [
        /* @__PURE__ */ n("label", { children: [
          /* @__PURE__ */ a("span", { children: "语言" }),
          /* @__PURE__ */ n(U, { value: e.language, onChange: (t) => d({ ...e, language: t.target.value }), children: [
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
        /* @__PURE__ */ n("label", { children: [
          /* @__PURE__ */ a("span", { children: "字号" }),
          /* @__PURE__ */ a("input", { type: "number", min: 8, max: 120, value: e.font_size, onChange: (t) => d({ ...e, font_size: Number(t.target.value) || 8 }) })
        ] }),
        /* @__PURE__ */ n("label", { children: [
          /* @__PURE__ */ a("span", { children: "背景" }),
          /* @__PURE__ */ a("input", { type: "color", value: e.fill_color, onChange: (t) => d({ ...e, fill_color: t.target.value.toUpperCase() }) })
        ] })
      ] }),
      /* @__PURE__ */ n("label", { className: "is-wide", children: [
        /* @__PURE__ */ a("span", { children: "代码" }),
        /* @__PURE__ */ a("textarea", { rows: 12, value: e.source || "", onChange: (t) => d({ ...e, source: t.target.value }) })
      ] })
    ] })
  ] });
}
function kt({ body: e, readOnly: d = !1, documentTitle: h = "未命名幻灯片", initialBlockID: s, uploadFile: t, fileUploadsEnabled: y, readFile: p, pageActionHost: i, authorizeContentAction: l, onActionFeedback: o, onChange: u }) {
  const f = Me(() => Je(e), [e]), [c, v] = j(f), m = J(c), [w, b] = j(f.slides[0].id), [T, k] = j(""), [N, I] = j(!1), [L, X] = j(!1), [B, Z] = j(""), ee = J(null), q = J(null);
  O(() => {
    v(f), m.current = f, b((r) => f.slides.some((g) => g.id === r) ? r : f.slides[0].id);
  }, [f]), O(() => {
    if (!s) return;
    const r = m.current.slides.find((g) => g.id === s);
    if (r) {
      b(r.id), k("");
      return;
    }
    for (const g of m.current.slides)
      if (g.elements.some((x) => x.id === s)) {
        b(g.id), k(s);
        return;
      }
  }, [s]), O(() => {
    if (!L) return;
    const r = (x) => {
      ee.current?.contains(x.target) || X(!1);
    }, g = (x) => {
      x.key === "Escape" && X(!1);
    };
    return document.addEventListener("pointerdown", r), document.addEventListener("keydown", g), () => {
      document.removeEventListener("pointerdown", r), document.removeEventListener("keydown", g);
    };
  }, [L]);
  const A = Math.max(0, c.slides.findIndex((r) => r.id === w)), _ = c.slides[A], G = _.elements.find((r) => r.id === T), H = (r, g = !0) => {
    m.current = r, v(r), g && u(oe(r));
  }, z = (r, g = !0) => H({ ...m.current, slides: m.current.slides.map((x) => x.id === r.id ? r : x) }, g), te = (r, g = !0) => z({ ..._, elements: _.elements.map((x) => x.id === r.id ? r : x) }, g), fe = () => {
    const r = E("slide"), g = tt(r, c.slides.length, "title_content", c.master);
    b(r), k(""), H({ ...c, slides: [...c.slides, g] });
  }, ge = () => {
    const r = E("slide"), g = /* @__PURE__ */ new Map(), x = Object.fromEntries(Object.values(_.files).map((F) => {
      const D = E("asset");
      return g.set(F.id, D), [D, { ...F, id: D }];
    })), C = { ..._, id: r, title: `${_.title} 副本`, files: x, elements: _.elements.map((F) => ({ ...F, id: E("element"), asset_id: F.asset_id ? g.get(F.asset_id) : void 0 })) }, W = [...c.slides];
    W.splice(A + 1, 0, C), b(r), k(""), H({ ...c, slides: W });
  }, me = () => {
    if (c.slides.length === 1) return;
    const r = c.slides.filter((x) => x.id !== _.id), g = Math.max(0, A - 1);
    b(r[g].id), k(""), H({ ...c, slides: r });
  }, ae = (r) => {
    const g = A + r;
    if (g < 0 || g >= c.slides.length) return;
    const x = [...c.slides], [C] = x.splice(A, 1);
    x.splice(g, 0, C), H({ ...c, slides: x });
  }, ye = (r) => {
    _.elements.length && !window.confirm("切换版式会重置当前页元素，继续吗？") || (k(""), z({ ..._, layout: r, files: {}, elements: et(_.id, r, c.master) }));
  }, be = () => {
    const r = { id: E("text"), type: "text", x: 220, y: 270, width: 1160, height: 180, rotation: 0, text: "输入文本", font_size: 42, font_weight: "normal", color: c.master.text_color, align: "left" };
    k(r.id), z({ ..._, elements: [..._.elements, r] });
  }, ve = (r) => {
    const g = r === "line", x = { id: E("shape"), type: "shape", x: 520, y: g ? 420 : 300, width: 560, height: g ? 40 : 260, rotation: 0, shape: r, fill_color: c.master.accent_color, stroke_color: c.master.accent_color, stroke_width: 2, text: "", font_size: 32, font_weight: "normal", color: c.master.background_color, align: "center" };
    X(!1), k(x.id), z({ ..._, elements: [..._.elements, x] });
  }, we = () => {
    const r = { id: E("table"), type: "table", x: 260, y: 230, width: 1080, height: 430, rotation: 0, table: { header: !0, rows: [["项目", "负责人", "状态"], ["方案设计", "Alice", "进行中"], ["开发验收", "Bob", "待开始"]] } };
    k(r.id), z({ ..._, elements: [..._.elements, r] });
  }, _e = () => {
    const r = { id: E("chart"), type: "chart", x: 260, y: 210, width: 1080, height: 500, rotation: 0, chart: { type: "column", categories: ["第一季度", "第二季度", "第三季度", "第四季度"], series: [{ name: "目标", values: [42, 58, 66, 82] }, { name: "实际", values: [38, 61, 72, 88] }] } };
    k(r.id), z({ ..._, elements: [..._.elements, r] });
  }, xe = () => {
    const r = { id: E("formula"), type: "formula", x: 330, y: 310, width: 940, height: 250, rotation: 0, formula: "E = mc^2", font_size: 56, color: c.master.text_color };
    k(r.id), z({ ..._, elements: [..._.elements, r] });
  }, ke = () => {
    const r = { id: E("code"), type: "code", x: 260, y: 190, width: 1080, height: 530, rotation: 0, language: "typescript", source: `const insight = data.map(analyze);
return insight.filter(Boolean);`, font_size: 24, color: "#E9F5EF", fill_color: "#101D19" };
    k(r.id), z({ ..._, elements: [..._.elements, r] });
  }, Te = async (r) => {
    if (!t || !y) {
      o?.("当前知识库未配置受权文件存储，不能插入媒体。");
      return;
    }
    const g = r.type === "image/png" || r.type === "image/jpeg" || r.type === "image/webp" || r.type === "image/gif", x = r.type === "video/mp4" || r.type === "video/webm";
    if (!g && !x) {
      o?.("仅支持 PNG、JPEG、WebP、GIF、MP4 或 WebM。");
      return;
    }
    try {
      const C = it(await t(r));
      if (!C) throw Error("媒体上传没有返回受权文档引用。");
      const W = E("asset"), F = E(g ? "image" : "video"), D = { id: W, mime_type: r.type, document_ref: C, filename: r.name }, Ce = { id: F, type: g ? "image" : "video", x: 240, y: 210, width: 1120, height: 560, rotation: 0, asset_id: W, fit: "contain" };
      k(F), z({ ..._, files: { ..._.files, [W]: D }, elements: [..._.elements, Ce] });
    } catch (C) {
      o?.(C instanceof Error ? C.message : "媒体上传失败");
    }
  }, Se = () => {
    if (!G) return;
    const r = { ..._.files };
    G.asset_id && delete r[G.asset_id], z({ ..._, files: r, elements: _.elements.filter((g) => g.id !== G.id) }), k("");
  }, ie = async (r) => {
    Z(r);
    try {
      if (!l) throw Error("当前页面禁止导出内容。");
      await l(r === "pdf" ? "print" : "export"), r === "pdf" ? await ht(m.current, h, p) : await pt(m.current, h, p), o?.(`已导出 ${r.toUpperCase()}。`);
    } catch (g) {
      o?.(g instanceof Error ? g.message : "幻灯片导出失败");
    } finally {
      Z("");
    }
  }, Pe = (r, g) => {
    if (d || r.button !== 0) return;
    r.currentTarget.setPointerCapture(r.pointerId);
    const x = r.currentTarget.parentElement?.getBoundingClientRect();
    x && (k(g.id), q.current = { id: g.id, startX: r.clientX, startY: r.clientY, x: g.x, y: g.y, stageWidth: x.width, stageHeight: x.height });
  }, Ne = (r) => {
    const g = q.current;
    if (!g) return;
    const x = m.current.slides.find((D) => D.id === w), C = x?.elements.find((D) => D.id === g.id);
    if (!x || !C) return;
    const W = Math.max(0, Math.min(M - C.width, g.x + (r.clientX - g.startX) / g.stageWidth * M)), F = Math.max(0, Math.min(R - C.height, g.y + (r.clientY - g.startY) / g.stageHeight * R));
    te({ ...C, x: Math.round(W), y: Math.round(F) }, !1);
  }, re = () => {
    q.current && (q.current = null, u(oe(m.current)));
  };
  return /* @__PURE__ */ n("div", { className: "knowledge-open-editor knowledge-presentation-editor", children: [
    l && /* @__PURE__ */ n(Ke, { host: i, children: [
      /* @__PURE__ */ n($, { title: "导出 PDF", disabled: !!B, onClick: () => {
        ie("pdf");
      }, children: [
        /* @__PURE__ */ a(Ee, { size: 15 }),
        "PDF"
      ] }),
      /* @__PURE__ */ n($, { title: "导出 PPTX", disabled: !!B, onClick: () => {
        ie("pptx");
      }, children: [
        /* @__PURE__ */ a(Fe, { size: 15 }),
        "PPTX"
      ] })
    ] }),
    /* @__PURE__ */ n("div", { className: "presentation-toolbar", "aria-label": "幻灯片工具栏", children: [
      !d && /* @__PURE__ */ n(Y, { children: [
        /* @__PURE__ */ n("label", { children: [
          /* @__PURE__ */ a("span", { children: "主题" }),
          /* @__PURE__ */ a(U, { value: c.theme, onChange: (r) => H(Qe(c, r.target.value)), children: Object.entries(Ve).map(([r, g]) => /* @__PURE__ */ a("option", { value: r, children: g.label }, r)) })
        ] }),
        /* @__PURE__ */ n("label", { children: [
          /* @__PURE__ */ a("span", { children: "版式" }),
          /* @__PURE__ */ a(U, { value: _.layout, onChange: (r) => ye(r.target.value), children: Ze.map((r) => /* @__PURE__ */ a("option", { value: r.id, children: r.label }, r.id)) })
        ] }),
        /* @__PURE__ */ a("span", { className: "presentation-toolbar-divider" }),
        /* @__PURE__ */ n($, { title: "插入文本", onClick: be, children: [
          /* @__PURE__ */ a(Le, { size: 15 }),
          "文本"
        ] }),
        /* @__PURE__ */ n("div", { className: "presentation-shape-picker", ref: ee, children: [
          /* @__PURE__ */ n($, { title: "插入形状", "aria-expanded": L, "aria-haspopup": "menu", onClick: () => X((r) => !r), children: [
            /* @__PURE__ */ a(Re, { size: 15 }),
            "形状",
            /* @__PURE__ */ a(K, { size: 13 })
          ] }),
          L && /* @__PURE__ */ a("div", { className: "presentation-shape-menu", role: "menu", "aria-label": "选择形状", children: ce.map((r) => /* @__PURE__ */ n("button", { type: "button", role: "menuitem", title: `插入${V[r]}`, onClick: () => ve(r), children: [
            /* @__PURE__ */ a("span", { children: /* @__PURE__ */ a(pe, { shape: r, fill: "var(--knowledge-surface-tint)", stroke: "currentColor", strokeWidth: 2 }) }),
            /* @__PURE__ */ a("b", { children: V[r] })
          ] }, r)) })
        ] }),
        /* @__PURE__ */ n($, { title: "插入表格", onClick: we, children: [
          /* @__PURE__ */ a(De, { size: 15 }),
          "表格"
        ] }),
        /* @__PURE__ */ n($, { title: "插入图表", onClick: _e, children: [
          /* @__PURE__ */ a(je, { size: 15 }),
          "图表"
        ] }),
        /* @__PURE__ */ n($, { title: "插入公式", onClick: xe, children: [
          /* @__PURE__ */ a(Ae, { size: 15 }),
          "公式"
        ] }),
        /* @__PURE__ */ n($, { title: "插入代码", onClick: ke, children: [
          /* @__PURE__ */ a(We, { size: 15 }),
          "代码"
        ] }),
        /* @__PURE__ */ n("label", { className: "knowledge-button presentation-upload", children: [
          /* @__PURE__ */ a(Ue, { size: 15 }),
          "媒体",
          /* @__PURE__ */ a("input", { type: "file", accept: "image/png,image/jpeg,image/webp,image/gif,video/mp4,video/webm", onChange: (r) => {
            const g = r.target.files?.[0];
            r.currentTarget.value = "", g && Te(g);
          } })
        ] })
      ] }),
      /* @__PURE__ */ a("span", { className: "presentation-toolbar-spacer" }),
      /* @__PURE__ */ n($, { title: "放映", onClick: () => I(!0), children: [
        /* @__PURE__ */ a(Ie, { size: 15 }),
        "放映"
      ] })
    ] }),
    /* @__PURE__ */ n("div", { className: `presentation-workspace${d ? " is-readonly" : ""}`, children: [
      /* @__PURE__ */ n("aside", { className: "presentation-slide-list", "aria-label": "幻灯片列表", children: [
        c.slides.map((r, g) => /* @__PURE__ */ n("button", { type: "button", "aria-current": r.id === _.id ? "true" : void 0, onClick: () => {
          b(r.id), k("");
        }, children: [
          /* @__PURE__ */ a("span", { children: g + 1 }),
          /* @__PURE__ */ n("div", { children: [
            /* @__PURE__ */ a(Q, { content: c, slide: r, readFile: p, thumbnail: !0 }),
            /* @__PURE__ */ a("strong", { children: r.title })
          ] })
        ] }, r.id)),
        !d && /* @__PURE__ */ n($, { className: "presentation-add-slide", onClick: fe, children: [
          /* @__PURE__ */ a(He, { size: 15 }),
          "新建幻灯片"
        ] })
      ] }),
      /* @__PURE__ */ n("main", { className: "presentation-stage-column", children: [
        !d && /* @__PURE__ */ n("div", { className: "presentation-slide-meta", children: [
          /* @__PURE__ */ a("input", { "aria-label": "幻灯片标题", maxLength: 512, value: _.title, onChange: (r) => z({ ..._, title: r.target.value || "未命名幻灯片" }) }),
          /* @__PURE__ */ n("div", { children: [
            /* @__PURE__ */ a("button", { type: "button", title: "上移幻灯片", disabled: A === 0, onClick: () => ae(-1), children: /* @__PURE__ */ a(se, { size: 15 }) }),
            /* @__PURE__ */ a("button", { type: "button", title: "下移幻灯片", disabled: A === c.slides.length - 1, onClick: () => ae(1), children: /* @__PURE__ */ a(K, { size: 15 }) }),
            /* @__PURE__ */ a("button", { type: "button", title: "复制幻灯片", onClick: ge, children: /* @__PURE__ */ a(Xe, { size: 15 }) }),
            /* @__PURE__ */ a("button", { type: "button", title: "删除幻灯片", disabled: c.slides.length === 1, onClick: me, children: /* @__PURE__ */ a(ne, { size: 15 }) })
          ] })
        ] }),
        /* @__PURE__ */ a("div", { className: "presentation-stage", onPointerMove: Ne, onPointerUp: re, onPointerCancel: re, children: /* @__PURE__ */ a(Q, { content: c, slide: _, selectedElementID: T, readOnly: d, readFile: p, onSelectElement: k, onElementPointerDown: Pe }) }),
        !d && /* @__PURE__ */ n("label", { className: "presentation-speaker-notes", children: [
          /* @__PURE__ */ a("span", { children: "演讲者备注" }),
          /* @__PURE__ */ a("textarea", { placeholder: "仅演讲者可见的提示、引用和讲述节奏…", value: _.notes, onChange: (r) => z({ ..._, notes: r.target.value }) })
        ] })
      ] }),
      !d && /* @__PURE__ */ a("aside", { className: "presentation-inspector", children: G ? /* @__PURE__ */ a(gt, { element: G, onChange: te, onDelete: Se }) : /* @__PURE__ */ a(ft, { master: c.master, onChange: (r) => H({ ...c, master: r }) }) })
    ] }),
    N && /* @__PURE__ */ a(ut, { content: c, initial: A, readFile: p, onClose: () => I(!1) })
  ] });
}
export {
  kt as PresentationEditor,
  kt as default
};
