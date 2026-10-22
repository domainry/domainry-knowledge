import { jsxs as c, Fragment as B, jsx as a } from "react/jsx-runtime";
import { useMemo as Ne, useState as D, useRef as ee, useEffect as O } from "react";
import { createPortal as Pe } from "react-dom";
import { r as Me } from "./latex-Ces3EuFF.js";
import { Type as Ce, RectangleHorizontal as $e, ChevronDown as q, Table2 as ze, BarChart3 as Ee, Sigma as Fe, Braces as Le, ImagePlus as Re, MonitorPlay as De, FileDown as je, Maximize2 as Ae, Plus as Ue, ChevronUp as ie, Copy as We, Trash2 as re, AlignLeft as Ie, AlignCenter as He, AlignRight as Xe, X as Be, Video as Ge } from "lucide-react";
import { b as Ye, d as Oe, e as qe, f as Je, B as $, g as oe, h as te, i as Ve, j as Ke, k as C, l as L, n as Qe } from "./index-xTnnSBIQ.js";
import { s as le } from "./documentTransfer-EuLogqx3.js";
const ae = /^knowledge-document:kdoc_[a-f0-9]{32}$/, se = {
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
}, ne = { column: "柱状图", bar: "条形图", line: "折线图", area: "面积图", pie: "饼图", donut: "环形图" }, T = ["#00856A", "#4E7FEC", "#F0A93B", "#D45C7D", "#7559C7", "#21A6A1"];
function E(e) {
  return `${e}-${crypto.randomUUID()}`;
}
function N(e) {
  return e.replace(/^#/, "").toUpperCase();
}
function Ze(e) {
  if (typeof e == "string") return ae.test(e) ? e : "";
  const d = e && typeof e.props == "object" && e.props ? e.props : {}, h = String(d.url || e.url || "");
  return ae.test(h) ? h : "";
}
async function et(e) {
  return await new Promise((d, h) => {
    const s = new FileReader();
    s.onload = () => d(String(s.result || "")), s.onerror = () => h(s.error || Error("媒体读取失败")), s.readAsDataURL(e);
  });
}
function tt({ asset: e, readFile: d, thumbnail: h = !1 }) {
  const [s, t] = D(""), [g, u] = D(!1);
  return O(() => {
    let i = !0, o = "";
    if (!d) {
      u(!0);
      return;
    }
    return u(!1), d(e.document_ref).then((l) => {
      i && (o = URL.createObjectURL(l), t(o));
    }).catch(() => {
      i && u(!0);
    }), () => {
      i = !1, o && URL.revokeObjectURL(o);
    };
  }, [e.document_ref, d]), g ? /* @__PURE__ */ a("span", { className: "presentation-media-state", children: "媒体不可用" }) : s ? e.mime_type.startsWith("video/") ? h ? /* @__PURE__ */ c("span", { className: "presentation-video-thumbnail", children: [
    /* @__PURE__ */ a(Ge, { size: 20 }),
    "视频"
  ] }) : /* @__PURE__ */ a("video", { src: s, controls: !0 }) : /* @__PURE__ */ a("img", { src: s, alt: e.filename, draggable: !1 }) : /* @__PURE__ */ a("span", { className: "presentation-media-state", children: "正在加载…" });
}
function at(e) {
  return {
    left: `${e.x / C * 100}%`,
    top: `${e.y / L * 100}%`,
    width: `${e.width / C * 100}%`,
    height: `${e.height / L * 100}%`,
    transform: `rotate(${e.rotation}deg)`
  };
}
function ce({ shape: e, fill: d, stroke: h, strokeWidth: s }) {
  const t = { fill: e === "line" ? "none" : d, stroke: h, strokeWidth: Math.max(0, s), vectorEffect: "non-scaling-stroke" };
  return /* @__PURE__ */ c("svg", { className: "presentation-shape-graphic", viewBox: "0 0 100 100", preserveAspectRatio: "none", "aria-hidden": "true", children: [
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
function it({ chart: e }) {
  const d = e.series.flatMap((p) => p.values), h = Math.max(1, ...d.map((p) => Math.abs(p)));
  if (e.type === "pie" || e.type === "donut") {
    const p = e.series[0]?.values.map((b) => Math.max(0, b)) || [], n = Math.max(1, p.reduce((b, v) => b + v, 0));
    let m = 0;
    const y = p.map((b, v) => {
      const x = m;
      return m += b / n * 100, `${T[v % T.length]} ${x}% ${m}%`;
    });
    return /* @__PURE__ */ c("div", { className: "presentation-pie-chart", children: [
      /* @__PURE__ */ a("i", { className: e.type === "donut" ? "is-donut" : "", style: { background: `conic-gradient(${y.join(",")})` } }),
      /* @__PURE__ */ a("ol", { children: e.categories.slice(0, 6).map((b, v) => /* @__PURE__ */ c("li", { children: [
        /* @__PURE__ */ a("span", { style: { background: T[v % T.length] } }),
        b,
        /* @__PURE__ */ a("b", { children: p[v] ?? 0 })
      ] }, `${b}:${v}`)) })
    ] });
  }
  const s = 1e3, t = 480, g = 70, u = 48, i = s - g * 2, o = t - u * 2, l = (p) => e.series[p].values.map((n, m) => ({ x: g + (m + 0.5) * i / e.categories.length, y: u + o - Math.max(0, n) / h * o }));
  return /* @__PURE__ */ c("svg", { className: `presentation-chart-graphic is-${e.type}`, viewBox: `0 0 ${s} ${t}`, preserveAspectRatio: "none", "aria-label": ne[e.type], children: [
    [0, 1, 2, 3, 4].map((p) => /* @__PURE__ */ a("line", { x1: g, x2: s - g, y1: u + o * p / 4, y2: u + o * p / 4, stroke: "#DDE7E2", strokeWidth: "2" }, p)),
    e.type === "column" && e.series.map((p, n) => p.values.map((m, y) => {
      const b = i / e.categories.length, v = b * 0.72 / e.series.length, x = g + y * b + b * 0.14 + n * v, w = Math.max(2, Math.max(0, m) / h * o);
      return /* @__PURE__ */ a("rect", { x, y: u + o - w, width: v - 3, height: w, rx: "3", fill: T[n % T.length] }, `${p.name}:${y}`);
    })),
    e.type === "bar" && e.series.slice(0, 1).flatMap((p) => p.values.map((n, m) => {
      const y = o / e.categories.length, b = Math.max(2, Math.max(0, n) / h * i);
      return /* @__PURE__ */ a("rect", { x: g, y: u + m * y + y * 0.2, width: b, height: y * 0.6, rx: "3", fill: T[m % T.length] }, `${p.name}:${m}`);
    })),
    (e.type === "line" || e.type === "area") && e.series.map((p, n) => {
      const m = l(n), y = m.map((v, x) => `${x ? "L" : "M"}${v.x},${v.y}`).join(" "), b = `${y} L${m.at(-1)?.x},${u + o} L${m[0]?.x},${u + o} Z`;
      return /* @__PURE__ */ c("g", { children: [
        e.type === "area" && /* @__PURE__ */ a("path", { d: b, fill: T[n % T.length], opacity: ".18" }),
        /* @__PURE__ */ a("path", { d: y, fill: "none", stroke: T[n % T.length], strokeWidth: "8", strokeLinecap: "round", strokeLinejoin: "round" }),
        m.map((v, x) => /* @__PURE__ */ a("circle", { cx: v.x, cy: v.y, r: "7", fill: T[n % T.length] }, x))
      ] }, p.name);
    })
  ] });
}
function de(e) {
  return { text: "文本", shape: "形状", image: "图片", video: "视频", table: "表格", chart: "图表", formula: "公式", code: "代码" }[e];
}
function rt({ element: e, asset: d, readFile: h, thumbnail: s = !1 }) {
  if (e.type === "text")
    return /* @__PURE__ */ a("div", { className: "presentation-text-element", style: { color: e.color, fontSize: `${e.font_size / C * 100}cqw`, fontWeight: e.font_weight === "bold" ? 750 : 400, textAlign: e.align }, children: e.text });
  if (e.type === "shape") {
    const t = e.shape || "rectangle";
    return /* @__PURE__ */ c("div", { className: `presentation-shape-element is-${t}`, style: { color: e.color, fontSize: `${e.font_size / C * 100}cqw`, fontWeight: e.font_weight === "bold" ? 750 : 400, textAlign: e.align }, children: [
      /* @__PURE__ */ a(ce, { shape: t, fill: e.fill_color || "#FFFFFF", stroke: e.stroke_color || "#000000", strokeWidth: e.stroke_width ?? 1 }),
      e.text && /* @__PURE__ */ a("span", { children: e.text })
    ] });
  }
  if (e.type === "table" && e.table) return /* @__PURE__ */ a("div", { className: `presentation-table-element${e.table.header ? " has-header" : ""}`, children: /* @__PURE__ */ a("table", { children: /* @__PURE__ */ a("tbody", { children: e.table.rows.map((t, g) => /* @__PURE__ */ a("tr", { children: t.map((u, i) => /* @__PURE__ */ a("td", { children: u }, i)) }, g)) }) }) });
  if (e.type === "chart" && e.chart) return /* @__PURE__ */ a("div", { className: "presentation-chart-element", children: /* @__PURE__ */ a(it, { chart: e.chart }) });
  if (e.type === "formula") {
    const t = Me(e.formula || "", !0);
    return /* @__PURE__ */ a("div", { className: "presentation-formula-element", style: { color: e.color, fontSize: `${(e.font_size || 40) / C * 100}cqw` }, children: t.html ? /* @__PURE__ */ a("span", { dangerouslySetInnerHTML: { __html: t.html } }) : /* @__PURE__ */ a("code", { children: e.formula }) });
  }
  return e.type === "code" ? /* @__PURE__ */ c("pre", { className: "presentation-code-element", style: { color: e.color, background: e.fill_color, fontSize: `${(e.font_size || 24) / C * 100}cqw` }, children: [
    /* @__PURE__ */ a("small", { children: e.language }),
    /* @__PURE__ */ a("code", { children: e.source })
  ] }) : d ? /* @__PURE__ */ a("div", { className: `presentation-media-element is-${e.fit}`, children: /* @__PURE__ */ a(tt, { asset: d, readFile: h, thumbnail: s }) }) : /* @__PURE__ */ a("span", { className: "presentation-media-state", children: "媒体引用失效" });
}
function J({ content: e, slide: d, selectedElementID: h = "", readOnly: s = !0, thumbnail: t = !1, readFile: g, onSelectElement: u, onElementPointerDown: i }) {
  return /* @__PURE__ */ c("div", { className: `presentation-slide-canvas${t ? " is-thumbnail" : ""}`, style: { background: d.background_color || e.master.background_color, color: e.master.text_color }, children: [
    d.elements.map((o) => {
      const l = /* @__PURE__ */ a(rt, { element: o, asset: o.asset_id ? d.files[o.asset_id] : void 0, readFile: g, thumbnail: t }), p = at(o);
      return s || t ? /* @__PURE__ */ a("div", { className: "presentation-element", style: p, children: l }, o.id) : /* @__PURE__ */ a("button", { type: "button", className: `presentation-element is-editable${h === o.id ? " is-selected" : ""}`, "aria-label": `选择${de(o.type)}元素`, style: p, onClick: () => u?.(o.id), onPointerDown: (n) => i?.(n, o), children: l }, o.id);
    }),
    (e.master.footer || e.master.show_slide_number) && /* @__PURE__ */ c("footer", { children: [
      /* @__PURE__ */ a("span", { children: e.master.footer }),
      e.master.show_slide_number && /* @__PURE__ */ a("b", { children: e.slides.findIndex((o) => o.id === d.id) + 1 })
    ] })
  ] });
}
function ot(e, d, h, s) {
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
      const t = Math.min(h, s) / 2, g = t * 0.42;
      for (let u = 0; u < 10; u++) {
        const i = u % 2 ? g : t, o = -Math.PI / 2 + u * Math.PI / 5, l = h / 2 + Math.cos(o) * i, p = s / 2 + Math.sin(o) * i;
        u === 0 ? e.moveTo(l, p) : e.lineTo(l, p);
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
async function lt(e, d, h) {
  const s = document.createElement("canvas");
  s.width = C, s.height = L;
  const t = s.getContext("2d");
  if (!t) throw Error("当前浏览器不支持幻灯片导出。");
  t.fillStyle = d.background_color || e.master.background_color, t.fillRect(0, 0, s.width, s.height);
  const g = (i, o) => {
    t.save(), t.translate(o.x + o.width / 2, o.y + o.height / 2), t.rotate(o.rotation * Math.PI / 180), t.translate(-o.width / 2, -o.height / 2), t.fillStyle = o.color || e.master.text_color, t.font = `${o.font_weight === "bold" ? "700" : "400"} ${o.font_size || 28}px ${e.master.font_family}`, t.textBaseline = "top", t.textAlign = o.align || "left";
    const l = o.align === "center" ? o.width / 2 : o.align === "right" ? o.width : 0, p = (o.font_size || 28) * 1.25;
    let n = 0;
    for (const m of i.split(`
`)) {
      const y = [...m];
      let b = "";
      for (const v of y) {
        const x = b + v;
        b && t.measureText(x).width > o.width ? (t.fillText(b, l, n, o.width), b = v, n += p) : b = x;
      }
      if (t.fillText(b, l, n, o.width), n += p, n > o.height) break;
    }
    t.restore();
  }, u = (i, o) => {
    const l = o.series.flatMap((b) => b.values), p = Math.max(1, ...l.map((b) => Math.abs(b)));
    t.save(), t.translate(i.x, i.y);
    const n = 42, m = i.width - n * 2, y = i.height - n * 2;
    if (o.type === "pie" || o.type === "donut") {
      const b = o.series[0]?.values.map((w) => Math.max(0, w)) || [], v = Math.max(1, b.reduce((w, P) => w + P, 0));
      let x = -Math.PI / 2;
      b.forEach((w, P) => {
        const S = x + w / v * Math.PI * 2;
        t.beginPath(), t.moveTo(i.width / 2, i.height / 2), t.arc(i.width / 2, i.height / 2, Math.min(m, y) * 0.42, x, S), t.closePath(), t.fillStyle = T[P % T.length], t.fill(), x = S;
      }), o.type === "donut" && (t.beginPath(), t.arc(i.width / 2, i.height / 2, Math.min(m, y) * 0.2, 0, Math.PI * 2), t.fillStyle = d.background_color || e.master.background_color, t.fill());
    } else o.type === "column" ? o.series.forEach((b, v) => b.values.forEach((x, w) => {
      const P = m / o.categories.length, S = P * 0.72 / o.series.length, W = Math.max(2, Math.max(0, x) / p * y);
      t.fillStyle = T[v % T.length], t.fillRect(n + w * P + P * 0.14 + v * S, n + y - W, Math.max(2, S - 3), W);
    })) : o.type === "bar" ? o.series[0]?.values.forEach((b, v) => {
      const x = y / o.categories.length;
      t.fillStyle = T[v % T.length], t.fillRect(n, n + v * x + x * 0.2, Math.max(2, Math.max(0, b) / p * m), x * 0.6);
    }) : o.series.forEach((b, v) => {
      t.beginPath(), b.values.forEach((x, w) => {
        const P = n + (w + 0.5) * m / o.categories.length, S = n + y - Math.max(0, x) / p * y;
        w ? t.lineTo(P, S) : t.moveTo(P, S);
      }), o.type === "area" && (t.lineTo(n + m - m / o.categories.length / 2, n + y), t.lineTo(n + m / o.categories.length / 2, n + y), t.closePath(), t.globalAlpha = 0.18, t.fillStyle = T[v % T.length], t.fill(), t.globalAlpha = 1), t.strokeStyle = T[v % T.length], t.lineWidth = 6, t.stroke();
    });
    t.restore();
  };
  for (const i of d.elements) {
    if (i.type === "text") {
      g(i.text || "", i);
      continue;
    }
    if (i.type === "shape") {
      t.save(), t.translate(i.x + i.width / 2, i.y + i.height / 2), t.rotate(i.rotation * Math.PI / 180), t.translate(-i.width / 2, -i.height / 2), t.fillStyle = i.fill_color || "#FFFFFF", t.strokeStyle = i.stroke_color || "#000000", t.lineWidth = i.stroke_width ?? 1, ot(t, i.shape || "rectangle", i.width, i.height), i.shape !== "line" && t.fill(), t.stroke(), t.restore(), i.text && g(i.text, i);
      continue;
    }
    if (i.type === "table" && i.table) {
      t.save(), t.translate(i.x, i.y);
      const x = i.table.rows, w = i.height / x.length, P = x[0].length, S = i.width / P;
      t.font = `400 ${Math.max(14, Math.min(28, w * 0.35))}px ${e.master.font_family}`, t.textBaseline = "middle", x.forEach((W, j) => W.forEach((G, H) => {
        t.fillStyle = i.table.header && j === 0 ? e.master.accent_color : "#FFFFFF", t.fillRect(H * S, j * w, S, w), t.strokeStyle = e.master.muted_color, t.strokeRect(H * S, j * w, S, w), t.fillStyle = i.table.header && j === 0 ? e.master.background_color : e.master.text_color, t.fillText(G, H * S + 10, j * w + w / 2, S - 20);
      })), t.restore();
      continue;
    }
    if (i.type === "chart" && i.chart) {
      u(i, i.chart);
      continue;
    }
    if (i.type === "formula") {
      g(i.formula || "", { ...i, text: i.formula, font_weight: "normal", align: "center" });
      continue;
    }
    if (i.type === "code") {
      t.fillStyle = i.fill_color || "#101D19", t.fillRect(i.x, i.y, i.width, i.height), g(`${i.language || "text"}
${i.source || ""}`, { ...i, text: i.source, font_weight: "normal", align: "left" });
      continue;
    }
    const o = i.asset_id ? d.files[i.asset_id] : void 0;
    if (!o || !h) continue;
    if (i.type === "video") {
      t.fillStyle = "#17221C", t.fillRect(i.x, i.y, i.width, i.height), t.fillStyle = "#FFFFFF", t.font = "700 30px Arial", t.textAlign = "center", t.fillText(`▶ ${o.filename}`, i.x + i.width / 2, i.y + i.height / 2, i.width - 40);
      continue;
    }
    const l = await createImageBitmap(await h(o.document_ref)), p = l.width / l.height, n = i.width / i.height;
    let m = i.width, y = i.height, b = i.x, v = i.y;
    if (i.fit === "contain")
      p > n ? (y = m / p, v += (i.height - y) / 2) : (m = y * p, b += (i.width - m) / 2);
    else if (p > n) {
      const x = l.height * n, w = (l.width - x) / 2;
      t.drawImage(l, w, 0, x, l.height, b, v, m, y), l.close();
      continue;
    } else {
      const x = l.width / n, w = (l.height - x) / 2;
      t.drawImage(l, 0, w, l.width, x, b, v, m, y), l.close();
      continue;
    }
    t.drawImage(l, b, v, m, y), l.close();
  }
  return e.master.footer && (t.fillStyle = e.master.muted_color, t.font = `400 18px ${e.master.font_family}`, t.textAlign = "left", t.fillText(e.master.footer, 64, 854, 1200)), e.master.show_slide_number && (t.fillStyle = e.master.muted_color, t.font = `700 18px ${e.master.font_family}`, t.textAlign = "right", t.fillText(String(e.slides.findIndex((i) => i.id === d.id) + 1), 1536, 854)), s;
}
async function st(e, d, h) {
  const { jsPDF: s } = await import("./jspdf.es.min-nJDCAoZu.js").then((g) => g.j), t = new s({ orientation: "landscape", unit: "px", format: [C, L], hotfixes: ["px_scaling"] });
  for (let g = 0; g < e.slides.length; g++) {
    g && t.addPage([C, L], "landscape");
    const u = await lt(e, e.slides[g], h);
    t.addImage(u.toDataURL("image/png"), "PNG", 0, 0, C, L, void 0, "FAST");
  }
  t.save(le(d, "pdf"));
}
async function nt(e, d, h) {
  const { default: s } = await import("./pptxgen.es-GXYM2ya0.js"), t = new s();
  t.layout = "LAYOUT_WIDE", t.author = "Domainry Knowledge", t.company = "Domainry", t.subject = "Knowledge presentation", t.title = d;
  const g = [];
  e.master.footer && g.push({ text: { text: e.master.footer, options: { x: 0.55, y: 7.12, w: 10.8, h: 0.2, fontFace: e.master.font_family, fontSize: 9, color: N(e.master.muted_color), margin: 0 } } }), t.defineSlideMaster({
    title: "KNOWLEDGE_MASTER",
    background: { color: N(e.master.background_color) },
    objects: g,
    slideNumber: e.master.show_slide_number ? { x: 12.25, y: 7.08, w: 0.5, h: 0.22, fontFace: e.master.font_family, fontSize: 9, color: N(e.master.muted_color), align: "right", margin: 0 } : void 0
  });
  const u = 120;
  for (const i of e.slides) {
    const o = t.addSlide({ masterName: "KNOWLEDGE_MASTER" });
    i.background_color && (o.background = { color: N(i.background_color) });
    for (const l of i.elements) {
      const p = { x: l.x / u, y: l.y / u, w: l.width / u, h: l.height / u, rotate: l.rotation };
      if (l.type === "text")
        o.addText(l.text || "", { ...p, fontFace: e.master.font_family, fontSize: (l.font_size || 28) * 0.75, bold: l.font_weight === "bold", color: N(l.color || e.master.text_color), align: l.align, valign: "middle", margin: 0, breakLine: !1 });
      else if (l.type === "shape") {
        const n = l.shape === "rounded_rectangle" ? t.ShapeType.roundRect : l.shape === "ellipse" ? t.ShapeType.ellipse : l.shape === "triangle" ? t.ShapeType.triangle : l.shape === "diamond" ? t.ShapeType.diamond : l.shape === "hexagon" ? t.ShapeType.hexagon : l.shape === "star" ? t.ShapeType.star5 : l.shape === "arrow_right" ? t.ShapeType.rightArrow : l.shape === "callout" ? t.ShapeType.wedgeRectCallout : l.shape === "line" ? t.ShapeType.line : t.ShapeType.rect;
        o.addShape(n, { ...p, fill: { color: N(l.fill_color || "#FFFFFF"), transparency: l.shape === "line" ? 100 : 0 }, line: { color: N(l.stroke_color || "#000000"), width: l.stroke_width ?? 1 } }), l.text && o.addText(l.text, { ...p, fontFace: e.master.font_family, fontSize: (l.font_size || 28) * 0.75, bold: l.font_weight === "bold", color: N(l.color || e.master.text_color), align: l.align, valign: "middle", margin: 4 });
      } else if (l.type === "table" && l.table) {
        const n = l.table.rows.map((m) => m.map((y) => ({ text: y })));
        o.addTable(n, { ...p, border: { type: "solid", color: N(e.master.muted_color), pt: 1 }, fill: { color: N(i.background_color || e.master.background_color) }, color: N(e.master.text_color), fontFace: e.master.font_family, fontSize: 14, bold: !1, margin: 0.06, autoPage: !1, rowH: p.h / l.table.rows.length }), l.table.header && o.addTable([n[0]], { ...p, h: p.h / l.table.rows.length, border: { type: "solid", color: N(e.master.accent_color), pt: 1 }, fill: { color: N(e.master.accent_color) }, color: N(e.master.background_color), fontFace: e.master.font_family, fontSize: 14, bold: !0, margin: 0.06, autoPage: !1 });
      } else if (l.type === "chart" && l.chart) {
        const n = l.chart.type === "donut" ? t.ChartType.doughnut : l.chart.type === "pie" ? t.ChartType.pie : l.chart.type === "line" ? t.ChartType.line : l.chart.type === "area" ? t.ChartType.area : t.ChartType.bar;
        o.addChart(n, l.chart.series.map((m) => ({ name: m.name, labels: l.chart.categories, values: m.values })), { ...p, showLegend: l.chart.series.length > 1, showTitle: !1, showValue: l.chart.type === "pie" || l.chart.type === "donut", showSerName: l.chart.type === "pie" || l.chart.type === "donut", chartColors: T.map(N), ...l.chart.type === "column" ? { barDir: "col" } : l.chart.type === "bar" ? { barDir: "bar" } : {} });
      } else if (l.type === "formula")
        o.addText(l.formula || "", { ...p, fontFace: "Georgia", fontSize: (l.font_size || 40) * 0.75, italic: !0, color: N(l.color || e.master.text_color), align: "center", valign: "middle", margin: 0.08 });
      else if (l.type === "code")
        o.addText(`${l.language || "text"}
${l.source || ""}`, { ...p, fontFace: "Courier New", fontSize: (l.font_size || 24) * 0.75, color: N(l.color || "#FFFFFF"), fill: { color: N(l.fill_color || "#101D19") }, margin: 0.12, breakLine: !1, valign: "top" });
      else {
        const n = l.asset_id ? i.files[l.asset_id] : void 0;
        if (!n || !h) continue;
        const m = await et(await h(n.document_ref));
        l.type === "image" ? o.addImage({ data: m, sizing: { type: l.fit === "contain" ? "contain" : "cover", x: p.x, y: p.y, w: p.w, h: p.h }, rotate: l.rotation }) : o.addMedia({ type: "video", data: m, extn: n.mime_type === "video/webm" ? "webm" : "mp4", ...p });
      }
    }
    i.notes.trim() && o.addNotes(i.notes);
  }
  await t.writeFile({ fileName: le(d, "pptx"), compression: !0 });
}
function ct({ content: e, initial: d, readFile: h, onClose: s }) {
  const [t, g] = D(d);
  return O(() => {
    const u = (i) => {
      i.key === "Escape" && s(), (i.key === "ArrowRight" || i.key === "PageDown") && g((o) => Math.min(e.slides.length - 1, o + 1)), (i.key === "ArrowLeft" || i.key === "PageUp") && g((o) => Math.max(0, o - 1));
    };
    return window.addEventListener("keydown", u), () => window.removeEventListener("keydown", u);
  }, [e.slides.length, s]), Pe(/* @__PURE__ */ c("div", { className: "presentation-slideshow", role: "dialog", "aria-modal": "true", "aria-label": "幻灯片放映", children: [
    /* @__PURE__ */ a("div", { className: "presentation-slideshow-slide", children: /* @__PURE__ */ a(J, { content: e, slide: e.slides[t], readFile: h }) }),
    /* @__PURE__ */ c("div", { className: "presentation-slideshow-controls", children: [
      /* @__PURE__ */ c($, { disabled: t === 0, onClick: () => g((u) => u - 1), children: [
        /* @__PURE__ */ a(ie, { size: 16 }),
        "上一张"
      ] }),
      /* @__PURE__ */ c("span", { children: [
        t + 1,
        " / ",
        e.slides.length
      ] }),
      /* @__PURE__ */ c($, { disabled: t === e.slides.length - 1, onClick: () => g((u) => u + 1), children: [
        "下一张",
        /* @__PURE__ */ a(q, { size: 16 })
      ] }),
      /* @__PURE__ */ a($, { title: "退出放映", "aria-label": "退出放映", onClick: s, children: /* @__PURE__ */ a(Be, { size: 17 }) })
    ] })
  ] }), document.body);
}
function dt({ master: e, onChange: d }) {
  const h = (s, t) => /* @__PURE__ */ c("label", { children: [
    /* @__PURE__ */ a("span", { children: t }),
    /* @__PURE__ */ a("input", { type: "color", value: e[s], onChange: (g) => d({ ...e, [s]: g.target.value.toUpperCase() }) })
  ] });
  return /* @__PURE__ */ c("div", { className: "presentation-master-inspector", children: [
    /* @__PURE__ */ a("h4", { children: "母版" }),
    /* @__PURE__ */ a("p", { children: "统一控制整份演示的字体、色彩、页脚和页码。" }),
    h("background_color", "背景"),
    h("text_color", "正文"),
    h("accent_color", "强调"),
    h("muted_color", "辅助"),
    /* @__PURE__ */ c("label", { className: "is-wide", children: [
      /* @__PURE__ */ a("span", { children: "字体" }),
      /* @__PURE__ */ c("select", { value: e.font_family, onChange: (s) => d({ ...e, font_family: s.target.value }), children: [
        /* @__PURE__ */ a("option", { children: "Arial" }),
        /* @__PURE__ */ a("option", { children: "Aptos" }),
        /* @__PURE__ */ a("option", { children: "Helvetica" }),
        /* @__PURE__ */ a("option", { children: "Georgia" }),
        /* @__PURE__ */ a("option", { children: "Times New Roman" })
      ] })
    ] }),
    /* @__PURE__ */ c("label", { className: "is-wide", children: [
      /* @__PURE__ */ a("span", { children: "页脚" }),
      /* @__PURE__ */ a("input", { maxLength: 512, value: e.footer, onChange: (s) => d({ ...e, footer: s.target.value }) })
    ] }),
    /* @__PURE__ */ c("label", { className: "is-check", children: [
      /* @__PURE__ */ a("input", { type: "checkbox", checked: e.show_slide_number, onChange: (s) => d({ ...e, show_slide_number: s.target.checked }) }),
      /* @__PURE__ */ a("span", { children: "显示页码" })
    ] })
  ] });
}
function ht({ element: e, onChange: d, onDelete: h }) {
  const s = (t, g, u, i) => /* @__PURE__ */ c("label", { children: [
    /* @__PURE__ */ a("span", { children: g }),
    /* @__PURE__ */ a("input", { type: "number", min: u, max: i, value: e[t], onChange: (o) => d({ ...e, [t]: Math.max(u, Math.min(i, Number(o.target.value) || 0)) }) })
  ] });
  return /* @__PURE__ */ c("div", { className: "presentation-element-inspector", children: [
    /* @__PURE__ */ c("header", { children: [
      /* @__PURE__ */ c("div", { children: [
        /* @__PURE__ */ a("h4", { children: "元素" }),
        /* @__PURE__ */ a("small", { children: de(e.type) })
      ] }),
      /* @__PURE__ */ a("button", { type: "button", title: "删除元素", onClick: h, children: /* @__PURE__ */ a(re, { size: 15 }) })
    ] }),
    /* @__PURE__ */ c("div", { className: "presentation-inspector-grid", children: [
      s("x", "X", 0, C),
      s("y", "Y", 0, L),
      s("width", "宽", 1, C),
      s("height", "高", 1, L),
      s("rotation", "旋转", -360, 360)
    ] }),
    (e.type === "text" || e.type === "shape") && /* @__PURE__ */ c(B, { children: [
      /* @__PURE__ */ c("label", { className: "is-wide", children: [
        /* @__PURE__ */ a("span", { children: "内容" }),
        /* @__PURE__ */ a("textarea", { value: e.text || "", onChange: (t) => d({ ...e, text: t.target.value }) })
      ] }),
      /* @__PURE__ */ c("div", { className: "presentation-inspector-grid", children: [
        /* @__PURE__ */ c("label", { children: [
          /* @__PURE__ */ a("span", { children: "字号" }),
          /* @__PURE__ */ a("input", { type: "number", min: 8, max: 240, value: e.font_size, onChange: (t) => d({ ...e, font_size: Number(t.target.value) || 8 }) })
        ] }),
        /* @__PURE__ */ c("label", { children: [
          /* @__PURE__ */ a("span", { children: "字重" }),
          /* @__PURE__ */ c("select", { value: e.font_weight, onChange: (t) => d({ ...e, font_weight: t.target.value }), children: [
            /* @__PURE__ */ a("option", { value: "normal", children: "常规" }),
            /* @__PURE__ */ a("option", { value: "bold", children: "加粗" })
          ] })
        ] }),
        /* @__PURE__ */ c("label", { children: [
          /* @__PURE__ */ a("span", { children: "文字色" }),
          /* @__PURE__ */ a("input", { type: "color", value: e.color, onChange: (t) => d({ ...e, color: t.target.value.toUpperCase() }) })
        ] })
      ] }),
      /* @__PURE__ */ c("div", { className: "presentation-align-control", role: "group", "aria-label": "文本对齐", children: [
        /* @__PURE__ */ a("button", { type: "button", "aria-pressed": e.align === "left", onClick: () => d({ ...e, align: "left" }), children: /* @__PURE__ */ a(Ie, { size: 15 }) }),
        /* @__PURE__ */ a("button", { type: "button", "aria-pressed": e.align === "center", onClick: () => d({ ...e, align: "center" }), children: /* @__PURE__ */ a(He, { size: 15 }) }),
        /* @__PURE__ */ a("button", { type: "button", "aria-pressed": e.align === "right", onClick: () => d({ ...e, align: "right" }), children: /* @__PURE__ */ a(Xe, { size: 15 }) })
      ] })
    ] }),
    e.type === "shape" && /* @__PURE__ */ c("div", { className: "presentation-inspector-grid", children: [
      /* @__PURE__ */ c("label", { children: [
        /* @__PURE__ */ a("span", { children: "形状" }),
        /* @__PURE__ */ a("select", { value: e.shape, onChange: (t) => d({ ...e, shape: t.target.value }), children: oe.map((t) => /* @__PURE__ */ a("option", { value: t, children: se[t] }, t)) })
      ] }),
      /* @__PURE__ */ c("label", { children: [
        /* @__PURE__ */ a("span", { children: "填充" }),
        /* @__PURE__ */ a("input", { type: "color", value: e.fill_color, onChange: (t) => d({ ...e, fill_color: t.target.value.toUpperCase() }) })
      ] }),
      /* @__PURE__ */ c("label", { children: [
        /* @__PURE__ */ a("span", { children: "边框" }),
        /* @__PURE__ */ a("input", { type: "color", value: e.stroke_color, onChange: (t) => d({ ...e, stroke_color: t.target.value.toUpperCase() }) })
      ] })
    ] }),
    (e.type === "image" || e.type === "video") && /* @__PURE__ */ c("label", { className: "is-wide", children: [
      /* @__PURE__ */ a("span", { children: "适应方式" }),
      /* @__PURE__ */ c("select", { value: e.fit, onChange: (t) => d({ ...e, fit: t.target.value }), children: [
        /* @__PURE__ */ a("option", { value: "contain", children: "完整显示" }),
        /* @__PURE__ */ a("option", { value: "cover", children: "铺满裁剪" })
      ] })
    ] }),
    e.type === "table" && e.table && /* @__PURE__ */ c(B, { children: [
      /* @__PURE__ */ c("label", { className: "is-check", children: [
        /* @__PURE__ */ a("input", { type: "checkbox", checked: e.table.header, onChange: (t) => d({ ...e, table: { ...e.table, header: t.target.checked } }) }),
        /* @__PURE__ */ a("span", { children: "首行为表头" })
      ] }),
      /* @__PURE__ */ c("label", { className: "is-wide", children: [
        /* @__PURE__ */ a("span", { children: "表格内容（Tab 分列、换行分行）" }),
        /* @__PURE__ */ a("textarea", { rows: 10, value: e.table.rows.map((t) => t.join("	")).join(`
`), onChange: (t) => {
          const g = t.target.value.split(`
`).slice(0, 50).map((i) => i.split("	").slice(0, 20)), u = Math.max(1, ...g.map((i) => i.length));
          d({ ...e, table: { ...e.table, rows: g.map((i) => [...i, ...Array(Math.max(0, u - i.length)).fill("")]) } });
        } })
      ] })
    ] }),
    e.type === "chart" && e.chart && /* @__PURE__ */ c(B, { children: [
      /* @__PURE__ */ c("label", { className: "is-wide", children: [
        /* @__PURE__ */ a("span", { children: "图表类型" }),
        /* @__PURE__ */ a("select", { value: e.chart.type, onChange: (t) => d({ ...e, chart: { ...e.chart, type: t.target.value } }), children: Qe.map((t) => /* @__PURE__ */ a("option", { value: t, children: ne[t] }, t)) })
      ] }),
      /* @__PURE__ */ c("label", { className: "is-wide", children: [
        /* @__PURE__ */ a("span", { children: "分类（逗号分隔）" }),
        /* @__PURE__ */ a("input", { value: e.chart.categories.join(","), onChange: (t) => {
          const g = t.target.value.split(",").map((u) => u.trim()).filter(Boolean).slice(0, 50);
          d({ ...e, chart: { ...e.chart, categories: g, series: e.chart.series.map((u) => ({ ...u, values: g.map((i, o) => u.values[o] || 0) })) } });
        } })
      ] }),
      /* @__PURE__ */ c("label", { className: "is-wide", children: [
        /* @__PURE__ */ a("span", { children: "数据系列（每行“名称:1,2,3”）" }),
        /* @__PURE__ */ a("textarea", { rows: 8, value: e.chart.series.map((t) => `${t.name}:${t.values.join(",")}`).join(`
`), onChange: (t) => {
          const g = t.target.value.split(`
`).slice(0, 12).map((u, i) => {
            const o = u.indexOf(":"), l = (o >= 0 ? u.slice(0, o) : `系列 ${i + 1}`).trim() || `系列 ${i + 1}`, p = o >= 0 ? u.slice(o + 1) : u;
            return { name: l, values: e.chart.categories.map((n, m) => {
              const y = Number(p.split(",")[m]?.trim() || 0);
              return Number.isFinite(y) ? y : 0;
            }) };
          }).filter((u) => u.name);
          d({ ...e, chart: { ...e.chart, series: g.length ? g : [{ name: "系列 1", values: e.chart.categories.map(() => 0) }] } });
        } })
      ] })
    ] }),
    e.type === "formula" && /* @__PURE__ */ c(B, { children: [
      /* @__PURE__ */ c("label", { className: "is-wide", children: [
        /* @__PURE__ */ a("span", { children: "LaTeX 公式" }),
        /* @__PURE__ */ a("textarea", { rows: 6, value: e.formula || "", onChange: (t) => d({ ...e, formula: t.target.value }) })
      ] }),
      /* @__PURE__ */ c("div", { className: "presentation-inspector-grid", children: [
        /* @__PURE__ */ c("label", { children: [
          /* @__PURE__ */ a("span", { children: "字号" }),
          /* @__PURE__ */ a("input", { type: "number", min: 8, max: 240, value: e.font_size, onChange: (t) => d({ ...e, font_size: Number(t.target.value) || 8 }) })
        ] }),
        /* @__PURE__ */ c("label", { children: [
          /* @__PURE__ */ a("span", { children: "颜色" }),
          /* @__PURE__ */ a("input", { type: "color", value: e.color, onChange: (t) => d({ ...e, color: t.target.value.toUpperCase() }) })
        ] })
      ] })
    ] }),
    e.type === "code" && /* @__PURE__ */ c(B, { children: [
      /* @__PURE__ */ c("div", { className: "presentation-inspector-grid", children: [
        /* @__PURE__ */ c("label", { children: [
          /* @__PURE__ */ a("span", { children: "语言" }),
          /* @__PURE__ */ c("select", { value: e.language, onChange: (t) => d({ ...e, language: t.target.value }), children: [
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
        /* @__PURE__ */ c("label", { children: [
          /* @__PURE__ */ a("span", { children: "字号" }),
          /* @__PURE__ */ a("input", { type: "number", min: 8, max: 120, value: e.font_size, onChange: (t) => d({ ...e, font_size: Number(t.target.value) || 8 }) })
        ] }),
        /* @__PURE__ */ c("label", { children: [
          /* @__PURE__ */ a("span", { children: "背景" }),
          /* @__PURE__ */ a("input", { type: "color", value: e.fill_color, onChange: (t) => d({ ...e, fill_color: t.target.value.toUpperCase() }) })
        ] })
      ] }),
      /* @__PURE__ */ c("label", { className: "is-wide", children: [
        /* @__PURE__ */ a("span", { children: "代码" }),
        /* @__PURE__ */ a("textarea", { rows: 12, value: e.source || "", onChange: (t) => d({ ...e, source: t.target.value }) })
      ] })
    ] })
  ] });
}
function vt({ body: e, readOnly: d = !1, documentTitle: h = "未命名幻灯片", initialBlockID: s, uploadFile: t, fileUploadsEnabled: g, readFile: u, authorizeContentAction: i, onActionFeedback: o, onChange: l }) {
  const p = Ne(() => Ye(e), [e]), [n, m] = D(p), y = ee(n), [b, v] = D(p.slides[0].id), [x, w] = D(""), [P, S] = D(!1), [W, j] = D(!1), [G, H] = D(""), Y = ee(null);
  O(() => {
    m(p), y.current = p, v((r) => p.slides.some((f) => f.id === r) ? r : p.slides[0].id);
  }, [p]), O(() => {
    if (!s) return;
    const r = y.current.slides.find((f) => f.id === s);
    if (r) {
      v(r.id), w("");
      return;
    }
    for (const f of y.current.slides)
      if (f.elements.some((k) => k.id === s)) {
        v(f.id), w(s);
        return;
      }
  }, [s]);
  const A = Math.max(0, n.slides.findIndex((r) => r.id === b)), _ = n.slides[A], X = _.elements.find((r) => r.id === x), I = (r, f = !0) => {
    y.current = r, m(r), f && l(te(r));
  }, z = (r, f = !0) => I({ ...y.current, slides: y.current.slides.map((k) => k.id === r.id ? r : k) }, f), V = (r, f = !0) => z({ ..._, elements: _.elements.map((k) => k.id === r.id ? r : k) }, f), he = () => {
    const r = E("slide"), f = Ke(r, n.slides.length, "title_content", n.master);
    v(r), w(""), I({ ...n, slides: [...n.slides, f] });
  }, pe = () => {
    const r = E("slide"), f = /* @__PURE__ */ new Map(), k = Object.fromEntries(Object.values(_.files).map((F) => {
      const R = E("asset");
      return f.set(F.id, R), [R, { ...F, id: R }];
    })), M = { ..._, id: r, title: `${_.title} 副本`, files: k, elements: _.elements.map((F) => ({ ...F, id: E("element"), asset_id: F.asset_id ? f.get(F.asset_id) : void 0 })) }, U = [...n.slides];
    U.splice(A + 1, 0, M), v(r), w(""), I({ ...n, slides: U });
  }, ue = () => {
    if (n.slides.length === 1) return;
    const r = n.slides.filter((k) => k.id !== _.id), f = Math.max(0, A - 1);
    v(r[f].id), w(""), I({ ...n, slides: r });
  }, K = (r) => {
    const f = A + r;
    if (f < 0 || f >= n.slides.length) return;
    const k = [...n.slides], [M] = k.splice(A, 1);
    k.splice(f, 0, M), I({ ...n, slides: k });
  }, fe = (r) => {
    _.elements.length && !window.confirm("切换版式会重置当前页元素，继续吗？") || (w(""), z({ ..._, layout: r, files: {}, elements: Ve(_.id, r, n.master) }));
  }, ge = () => {
    const r = { id: E("text"), type: "text", x: 220, y: 270, width: 1160, height: 180, rotation: 0, text: "输入文本", font_size: 42, font_weight: "normal", color: n.master.text_color, align: "left" };
    w(r.id), z({ ..._, elements: [..._.elements, r] });
  }, me = (r) => {
    const f = r === "line", k = { id: E("shape"), type: "shape", x: 520, y: f ? 420 : 300, width: 560, height: f ? 40 : 260, rotation: 0, shape: r, fill_color: n.master.accent_color, stroke_color: n.master.accent_color, stroke_width: 2, text: "", font_size: 32, font_weight: "normal", color: n.master.background_color, align: "center" };
    j(!1), w(k.id), z({ ..._, elements: [..._.elements, k] });
  }, ye = () => {
    const r = { id: E("table"), type: "table", x: 260, y: 230, width: 1080, height: 430, rotation: 0, table: { header: !0, rows: [["项目", "负责人", "状态"], ["方案设计", "Alice", "进行中"], ["开发验收", "Bob", "待开始"]] } };
    w(r.id), z({ ..._, elements: [..._.elements, r] });
  }, be = () => {
    const r = { id: E("chart"), type: "chart", x: 260, y: 210, width: 1080, height: 500, rotation: 0, chart: { type: "column", categories: ["第一季度", "第二季度", "第三季度", "第四季度"], series: [{ name: "目标", values: [42, 58, 66, 82] }, { name: "实际", values: [38, 61, 72, 88] }] } };
    w(r.id), z({ ..._, elements: [..._.elements, r] });
  }, ve = () => {
    const r = { id: E("formula"), type: "formula", x: 330, y: 310, width: 940, height: 250, rotation: 0, formula: "E = mc^2", font_size: 56, color: n.master.text_color };
    w(r.id), z({ ..._, elements: [..._.elements, r] });
  }, we = () => {
    const r = { id: E("code"), type: "code", x: 260, y: 190, width: 1080, height: 530, rotation: 0, language: "typescript", source: `const insight = data.map(analyze);
return insight.filter(Boolean);`, font_size: 24, color: "#E9F5EF", fill_color: "#101D19" };
    w(r.id), z({ ..._, elements: [..._.elements, r] });
  }, _e = async (r) => {
    if (!t || !g) {
      o?.("当前知识库未配置受权文件存储，不能插入媒体。");
      return;
    }
    const f = r.type === "image/png" || r.type === "image/jpeg" || r.type === "image/webp" || r.type === "image/gif", k = r.type === "video/mp4" || r.type === "video/webm";
    if (!f && !k) {
      o?.("仅支持 PNG、JPEG、WebP、GIF、MP4 或 WebM。");
      return;
    }
    try {
      const M = Ze(await t(r));
      if (!M) throw Error("媒体上传没有返回受权文档引用。");
      const U = E("asset"), F = E(f ? "image" : "video"), R = { id: U, mime_type: r.type, document_ref: M, filename: r.name }, Se = { id: F, type: f ? "image" : "video", x: 240, y: 210, width: 1120, height: 560, rotation: 0, asset_id: U, fit: "contain" };
      w(F), z({ ..._, files: { ..._.files, [U]: R }, elements: [..._.elements, Se] });
    } catch (M) {
      o?.(M instanceof Error ? M.message : "媒体上传失败");
    }
  }, xe = () => {
    if (!X) return;
    const r = { ..._.files };
    X.asset_id && delete r[X.asset_id], z({ ..._, files: r, elements: _.elements.filter((f) => f.id !== X.id) }), w("");
  }, Q = async (r) => {
    H(r);
    try {
      if (!i) throw Error("当前页面禁止导出内容。");
      await i(r === "pdf" ? "print" : "export"), r === "pdf" ? await st(y.current, h, u) : await nt(y.current, h, u), o?.(`已导出 ${r.toUpperCase()}。`);
    } catch (f) {
      o?.(f instanceof Error ? f.message : "幻灯片导出失败");
    } finally {
      H("");
    }
  }, ke = (r, f) => {
    if (d || r.button !== 0) return;
    r.currentTarget.setPointerCapture(r.pointerId);
    const k = r.currentTarget.parentElement?.getBoundingClientRect();
    k && (w(f.id), Y.current = { id: f.id, startX: r.clientX, startY: r.clientY, x: f.x, y: f.y, stageWidth: k.width, stageHeight: k.height });
  }, Te = (r) => {
    const f = Y.current;
    if (!f) return;
    const k = y.current.slides.find((R) => R.id === b), M = k?.elements.find((R) => R.id === f.id);
    if (!k || !M) return;
    const U = Math.max(0, Math.min(C - M.width, f.x + (r.clientX - f.startX) / f.stageWidth * C)), F = Math.max(0, Math.min(L - M.height, f.y + (r.clientY - f.startY) / f.stageHeight * L));
    V({ ...M, x: Math.round(U), y: Math.round(F) }, !1);
  }, Z = () => {
    Y.current && (Y.current = null, l(te(y.current)));
  };
  return /* @__PURE__ */ c("div", { className: "knowledge-open-editor knowledge-presentation-editor", children: [
    /* @__PURE__ */ c("div", { className: "presentation-toolbar", "aria-label": "幻灯片工具栏", children: [
      !d && /* @__PURE__ */ c(B, { children: [
        /* @__PURE__ */ c("label", { children: [
          /* @__PURE__ */ a("span", { children: "主题" }),
          /* @__PURE__ */ a("select", { value: n.theme, onChange: (r) => I(qe(n, r.target.value)), children: Object.entries(Oe).map(([r, f]) => /* @__PURE__ */ a("option", { value: r, children: f.label }, r)) })
        ] }),
        /* @__PURE__ */ c("label", { children: [
          /* @__PURE__ */ a("span", { children: "版式" }),
          /* @__PURE__ */ a("select", { value: _.layout, onChange: (r) => fe(r.target.value), children: Je.map((r) => /* @__PURE__ */ a("option", { value: r.id, children: r.label }, r.id)) })
        ] }),
        /* @__PURE__ */ a("span", { className: "presentation-toolbar-divider" }),
        /* @__PURE__ */ c($, { title: "插入文本", onClick: ge, children: [
          /* @__PURE__ */ a(Ce, { size: 15 }),
          "文本"
        ] }),
        /* @__PURE__ */ c("div", { className: "presentation-shape-picker", children: [
          /* @__PURE__ */ c($, { title: "插入形状", "aria-expanded": W, onClick: () => j((r) => !r), children: [
            /* @__PURE__ */ a($e, { size: 15 }),
            "形状",
            /* @__PURE__ */ a(q, { size: 13 })
          ] }),
          W && /* @__PURE__ */ a("div", { className: "presentation-shape-menu", role: "menu", "aria-label": "选择形状", children: oe.map((r) => /* @__PURE__ */ c("button", { type: "button", role: "menuitem", onClick: () => me(r), children: [
            /* @__PURE__ */ a("span", { children: /* @__PURE__ */ a(ce, { shape: r, fill: n.master.accent_color, stroke: n.master.accent_color, strokeWidth: 2 }) }),
            /* @__PURE__ */ a("b", { children: se[r] })
          ] }, r)) })
        ] }),
        /* @__PURE__ */ c($, { title: "插入表格", onClick: ye, children: [
          /* @__PURE__ */ a(ze, { size: 15 }),
          "表格"
        ] }),
        /* @__PURE__ */ c($, { title: "插入图表", onClick: be, children: [
          /* @__PURE__ */ a(Ee, { size: 15 }),
          "图表"
        ] }),
        /* @__PURE__ */ c($, { title: "插入公式", onClick: ve, children: [
          /* @__PURE__ */ a(Fe, { size: 15 }),
          "公式"
        ] }),
        /* @__PURE__ */ c($, { title: "插入代码", onClick: we, children: [
          /* @__PURE__ */ a(Le, { size: 15 }),
          "代码"
        ] }),
        /* @__PURE__ */ c("label", { className: "knowledge-button presentation-upload", children: [
          /* @__PURE__ */ a(Re, { size: 15 }),
          "媒体",
          /* @__PURE__ */ a("input", { type: "file", accept: "image/png,image/jpeg,image/webp,image/gif,video/mp4,video/webm", onChange: (r) => {
            const f = r.target.files?.[0];
            r.currentTarget.value = "", f && _e(f);
          } })
        ] })
      ] }),
      /* @__PURE__ */ a("span", { className: "presentation-toolbar-spacer" }),
      /* @__PURE__ */ c($, { title: "放映", onClick: () => S(!0), children: [
        /* @__PURE__ */ a(De, { size: 15 }),
        "放映"
      ] }),
      i && /* @__PURE__ */ c($, { title: "导出 PDF", disabled: !!G, onClick: () => {
        Q("pdf");
      }, children: [
        /* @__PURE__ */ a(je, { size: 15 }),
        "PDF"
      ] }),
      i && /* @__PURE__ */ c($, { title: "导出 PPTX", disabled: !!G, onClick: () => {
        Q("pptx");
      }, children: [
        /* @__PURE__ */ a(Ae, { size: 15 }),
        "PPTX"
      ] })
    ] }),
    /* @__PURE__ */ c("div", { className: `presentation-workspace${d ? " is-readonly" : ""}`, children: [
      /* @__PURE__ */ c("aside", { className: "presentation-slide-list", "aria-label": "幻灯片列表", children: [
        n.slides.map((r, f) => /* @__PURE__ */ c("button", { type: "button", "aria-current": r.id === _.id ? "true" : void 0, onClick: () => {
          v(r.id), w("");
        }, children: [
          /* @__PURE__ */ a("span", { children: f + 1 }),
          /* @__PURE__ */ c("div", { children: [
            /* @__PURE__ */ a(J, { content: n, slide: r, readFile: u, thumbnail: !0 }),
            /* @__PURE__ */ a("strong", { children: r.title })
          ] })
        ] }, r.id)),
        !d && /* @__PURE__ */ c($, { className: "presentation-add-slide", onClick: he, children: [
          /* @__PURE__ */ a(Ue, { size: 15 }),
          "新建幻灯片"
        ] })
      ] }),
      /* @__PURE__ */ c("main", { className: "presentation-stage-column", children: [
        !d && /* @__PURE__ */ c("div", { className: "presentation-slide-meta", children: [
          /* @__PURE__ */ a("input", { "aria-label": "幻灯片标题", maxLength: 512, value: _.title, onChange: (r) => z({ ..._, title: r.target.value || "未命名幻灯片" }) }),
          /* @__PURE__ */ c("div", { children: [
            /* @__PURE__ */ a("button", { type: "button", title: "上移幻灯片", disabled: A === 0, onClick: () => K(-1), children: /* @__PURE__ */ a(ie, { size: 15 }) }),
            /* @__PURE__ */ a("button", { type: "button", title: "下移幻灯片", disabled: A === n.slides.length - 1, onClick: () => K(1), children: /* @__PURE__ */ a(q, { size: 15 }) }),
            /* @__PURE__ */ a("button", { type: "button", title: "复制幻灯片", onClick: pe, children: /* @__PURE__ */ a(We, { size: 15 }) }),
            /* @__PURE__ */ a("button", { type: "button", title: "删除幻灯片", disabled: n.slides.length === 1, onClick: ue, children: /* @__PURE__ */ a(re, { size: 15 }) })
          ] })
        ] }),
        /* @__PURE__ */ a("div", { className: "presentation-stage", onPointerMove: Te, onPointerUp: Z, onPointerCancel: Z, children: /* @__PURE__ */ a(J, { content: n, slide: _, selectedElementID: x, readOnly: d, readFile: u, onSelectElement: w, onElementPointerDown: ke }) }),
        !d && /* @__PURE__ */ c("label", { className: "presentation-speaker-notes", children: [
          /* @__PURE__ */ a("span", { children: "演讲者备注" }),
          /* @__PURE__ */ a("textarea", { placeholder: "仅演讲者可见的提示、引用和讲述节奏…", value: _.notes, onChange: (r) => z({ ..._, notes: r.target.value }) })
        ] })
      ] }),
      !d && /* @__PURE__ */ a("aside", { className: "presentation-inspector", children: X ? /* @__PURE__ */ a(ht, { element: X, onChange: V, onDelete: xe }) : /* @__PURE__ */ a(dt, { master: n.master, onChange: (r) => I({ ...n, master: r }) }) })
    ] }),
    P && /* @__PURE__ */ a(ct, { content: n, initial: A, readFile: u, onClose: () => S(!1) })
  ] });
}
export {
  vt as PresentationEditor,
  vt as default
};
