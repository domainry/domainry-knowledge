import { g as Zl } from "./index-CChAJr3y.js";
import { r as Nx } from "./dayjs.min-Bqm5tm0Y.js";
import { n as qx, B as Wx, f as zx, p as Hx, F as xo, s as qc } from "./isArrayLikeObject-22lj2fKO.js";
import { p as Yx, f as Ux, d as Xx, u as jx, k as Qr, S as rn, v as Bf, s as Gx, w as Vx, x as Kx, b as Zx, m as Gr, n as Li, r as Qx, t as Wc } from "./reduce-BdL4HU--.js";
function Jx(e, t) {
  var r = e == null ? 0 : e.length;
  return !!r && Yx(e, t, 0) > -1;
}
function tC(e, t) {
  var r = [];
  return Ux(e, function(i, s, o) {
    t(i, s, o) && r.push(i);
  }), r;
}
function Co(e, t) {
  var r = qx(e) ? jx : tC;
  return r(e, Xx(t));
}
function eC(e, t) {
  return Wx(t, function(r) {
    return e[r];
  });
}
function sn(e) {
  return e == null ? [] : eC(e, Qr(e));
}
var rC = 1 / 0, iC = rn && 1 / Bf(new rn([, -0]))[1] == rC ? function(e) {
  return new rn(e);
} : Gx, sC = 200;
function oC(e, t, r) {
  var i = -1, s = Jx, o = e.length, a = !0, n = [], l = n;
  if (o >= sC) {
    var c = iC(e);
    if (c)
      return Bf(c);
    a = !1, s = Kx, l = new Vx();
  } else
    l = n;
  t:
    for (; ++i < o; ) {
      var h = e[i], u = h;
      if (h = h !== 0 ? h : 0, a && u === u) {
        for (var d = l.length; d--; )
          if (l[d] === u)
            continue t;
        n.push(h);
      } else s(l, u, r) || (l !== n && l.push(u), n.push(h));
    }
  return n;
}
var aC = zx(function(e) {
  return oC(Zx(e, 1, Hx, !0));
});
const ro = 20, nC = {
  rect: "rectangle",
  circle: "ellipse"
}, bo = {
  startOnLoad: !1,
  flowchart: { curve: "linear" },
  themeVariables: {
    fontSize: `${ro}px`
  },
  maxEdges: 500,
  maxTextSize: 5e4
};
class ns {
  constructor({ converter: t }) {
    this.convert = (r, i) => this.converter(r, {
      ...i,
      fontSize: i.fontSize || ro
    }), this.converter = t;
  }
}
var qr;
(function(e) {
  e.ROUND = "round", e.STADIUM = "stadium", e.DOUBLECIRCLE = "doublecircle", e.CIRCLE = "circle", e.DIAMOND = "diamond", e.CYLINDER = "cylinder";
})(qr || (qr = {}));
var be;
(function(e) {
  e.COLOR = "color";
})(be || (be = {}));
var qt;
(function(e) {
  e.FILL = "fill", e.STROKE = "stroke", e.STROKE_WIDTH = "stroke-width", e.STROKE_DASHARRAY = "stroke-dasharray";
})(qt || (qt = {}));
var ys = {}, zc;
function lC() {
  if (zc) return ys;
  zc = 1, Object.defineProperty(ys, "__esModule", { value: !0 }), ys.removeMarkdown = void 0;
  var e = function(t, r) {
    r === void 0 && (r = {
      listUnicodeChar: ""
    }), r = r || {}, r.listUnicodeChar = r.hasOwnProperty("listUnicodeChar") ? r.listUnicodeChar : !1, r.stripListLeaders = r.hasOwnProperty("stripListLeaders") ? r.stripListLeaders : !0, r.gfm = r.hasOwnProperty("gfm") ? r.gfm : !0, r.useImgAltText = r.hasOwnProperty("useImgAltText") ? r.useImgAltText : !0, r.preserveLinks = r.hasOwnProperty("preserveLinks") ? r.preserveLinks : !1;
    var i = t || "";
    i = i.replace(/^(-\s*?|\*\s*?|_\s*?){3,}\s*$/gm, "");
    try {
      r.stripListLeaders && (r.listUnicodeChar ? i = i.replace(/^([\s\t]*)([\*\-\+]|\d+\.)\s+/gm, r.listUnicodeChar + " $1") : i = i.replace(/^([\s\t]*)([\*\-\+]|\d+\.)\s+/gm, "$1")), r.gfm && (i = i.replace(/\n={2,}/g, `
`).replace(/~{3}.*\n/g, "").replace(/~~/g, "").replace(/`{3}.*\n/g, "")), r.preserveLinks && (i = i.replace(/\[(.*?)\][\[\(](.*?)[\]\)]/g, "$1 ($2)")), i = i.replace(/<[^>]*>/g, "").replace(/^[=\-]{2,}\s*$/g, "").replace(/\[\^.+?\](\: .*?$)?/g, "").replace(/\s{0,2}\[.*?\]: .*?$/g, "").replace(/\!\[(.*?)\][\[\(].*?[\]\)]/g, r.useImgAltText ? "$1" : "").replace(/\[(.*?)\][\[\(].*?[\]\)]/g, "$1").replace(/^\s{0,3}>\s?/g, "").replace(/(^|\n)\s{0,3}>\s?/g, `

`).replace(/^\s{1,2}\[(.*?)\]: (\S+)( ".*?")?\s*$/g, "").replace(/^(\n)?\s{0,}#{1,6}\s+| {0,}(\n)?\s{0,}#{0,} {0,}(\n)?\s{0,}$/gm, "$1$2$3").replace(/([\*_]{1,3})(\S.*?\S{0,1})\1/g, "$2").replace(/([\*_]{1,3})(\S.*?\S{0,1})\1/g, "$2").replace(/(`{3,})(.*?)\1/gm, "$2").replace(/`(.+?)`/g, "$1").replace(/\n{2,}/g, `

`);
    } catch (s) {
      return console.error(s), t;
    }
    return i;
  };
  return ys.removeMarkdown = e, ys;
}
var hC = lC();
const cC = {
  arrow_circle: {
    endArrowhead: "circle"
  },
  arrow_cross: {
    endArrowhead: "bar"
  },
  arrow_open: {
    endArrowhead: null,
    startArrowhead: null
  },
  double_arrow_circle: {
    endArrowhead: "circle",
    startArrowhead: "circle"
  },
  double_arrow_cross: {
    endArrowhead: "bar",
    startArrowhead: "bar"
  },
  double_arrow_point: {
    endArrowhead: "arrow",
    startArrowhead: "arrow"
  }
}, uC = (e) => cC[e], on = (e) => {
  let t = e.text;
  return e.labelType === "markdown" && (t = hC.removeMarkdown(e.text)), dC(t);
}, dC = (e) => {
  const t = /\s?(fa|fab):[a-zA-Z0-9-]+/g;
  return e.replace(t, "");
}, Xs = (e) => {
  const t = {};
  return Object.keys(e).forEach((r) => {
    switch (r) {
      case qt.FILL: {
        t.backgroundColor = e[r], t.fillStyle = "solid";
        break;
      }
      case qt.STROKE: {
        t.strokeColor = e[r];
        break;
      }
      case qt.STROKE_WIDTH: {
        t.strokeWidth = Number(e[r]?.split("px")[0]);
        break;
      }
      case qt.STROKE_DASHARRAY: {
        t.strokeStyle = "dashed";
        break;
      }
    }
  }), t;
}, ol = (e) => {
  const t = {};
  return Object.keys(e).forEach((r) => {
    r === be.COLOR && (t.strokeColor = e[r]);
  }), t;
}, fC = (e, t) => [e, t], pC = 32, vf = 0.62, gC = 12, mC = 12, Lf = (e, t) => Math.max(20, Math.ceil(e.length * t * vf)), yC = (e, t, r, i) => {
  const s = i || ro;
  if (e !== qr.CYLINDER || !t || t.includes(`
`))
    return s;
  const o = Math.max(20, r - gC);
  return Lf(t, s) <= o ? s : Math.max(mC, Math.floor(o / (t.length * vf)));
}, xC = (e) => {
  const t = {};
  e.subGraphs.map((i) => {
    i.nodeIds.forEach((s) => {
      t[i.id] = {
        id: i.id,
        parent: null,
        isLeaf: !1
      }, t[s] = {
        id: s,
        parent: i.id,
        isLeaf: e.vertices[s] !== void 0
      };
    });
  });
  const r = {};
  return [...Object.keys(e.vertices), ...e.subGraphs.map((i) => i.id)].forEach((i) => {
    if (!t[i])
      return;
    let s = t[i];
    const o = [];
    for (s.isLeaf || o.push(`subgraph_group_${s.id}`); s.parent; )
      o.push(`subgraph_group_${s.parent}`), s = t[s.parent];
    r[i] = o;
  }), {
    getGroupIds: (i) => r[i] || [],
    getParentId: (i) => t[i] ? t[i].parent : null
  };
}, CC = new ns({
  converter: (e, t) => {
    const r = [], i = t.fontSize, { getGroupIds: s, getParentId: o } = xC(e);
    return e.subGraphs.reverse().forEach((a) => {
      const n = s(a.id), l = on(a), u = Lf(l, i || 16) + pC * 2, d = Math.max(a.width, u), f = a.x - (d - a.width) / 2, m = Xs(a.containerStyle), y = ol(a.labelStyle), x = {
        id: a.id,
        type: "rectangle",
        groupIds: n,
        x: f,
        y: a.y,
        width: d,
        height: a.height,
        label: {
          groupIds: n,
          text: l,
          fontSize: i,
          verticalAlign: "top",
          ...y
        },
        ...m
      };
      r.push(x);
    }), Object.values(e.vertices).forEach((a) => {
      if (!a)
        return;
      const n = s(a.id), l = on(a), c = yC(a.type, l, a.width, i), h = Xs(a.containerStyle), u = ol(a.labelStyle);
      let d = {
        id: a.id,
        type: "rectangle",
        groupIds: n,
        x: a.x,
        y: a.y,
        width: a.width,
        height: a.height,
        strokeWidth: 2,
        label: {
          groupIds: n,
          text: l,
          fontSize: c,
          ...u
        },
        link: a.link || null,
        ...h
      };
      switch (a.type) {
        case qr.STADIUM: {
          d = { ...d, roundness: { type: 3 } };
          break;
        }
        case qr.ROUND: {
          d = { ...d, roundness: { type: 3 } };
          break;
        }
        case qr.DOUBLECIRCLE: {
          n.push(`doublecircle_${a.id}}`);
          const m = {
            type: "ellipse",
            groupIds: n,
            x: a.x + 5,
            y: a.y + 5,
            width: a.width - 10,
            height: a.height - 10,
            strokeWidth: 2,
            roundness: { type: 3 },
            label: {
              groupIds: n,
              text: l,
              fontSize: c,
              ...u
            }
          };
          d = { ...d, groupIds: n, type: "ellipse" }, r.push(m);
          break;
        }
        case qr.CIRCLE: {
          d.type = "ellipse";
          break;
        }
        case qr.DIAMOND: {
          d.type = "diamond";
          break;
        }
      }
      r.push(d);
    }), e.edges.forEach((a) => {
      let n = [];
      const l = o(a.start), c = o(a.end);
      l && l === c && (n = s(l));
      const { startX: h, startY: u, reflectionPoints: d } = a, f = d.map((w) => fC(w.x - d[0].x, w.y - d[0].y)), m = uC(a.type || "arrow_point"), y = r.find((w) => w.id === a.start), x = r.find((w) => w.id === a.end);
      if (!y || !x)
        return;
      const b = {
        id: `${a.start}_${a.end}`,
        type: "arrow",
        groupIds: n,
        x: h,
        y: u,
        // 4 and 2 are the Excalidraw's stroke width of thick and thin respectively
        // TODO: use constant exported from Excalidraw package
        strokeWidth: a.stroke === "thick" ? 4 : 2,
        strokeStyle: a.stroke === "dotted" ? "dashed" : void 0,
        points: f,
        ...a.text ? { label: { text: on(a), fontSize: i, groupIds: n } } : {},
        roundness: {
          type: 2
        },
        ...m,
        start: {
          id: y.id || ""
        },
        end: {
          id: x.id || ""
        }
      };
      r.push(b);
    }), {
      elements: r
    };
  }
});
let Re = (e = 21) => crypto.getRandomValues(new Uint8Array(e)).reduce((t, r) => (r &= 63, r < 36 ? t += r.toString(36) : r < 62 ? t += (r - 26).toString(36).toUpperCase() : r > 62 ? t += "-" : t += "_", t), "");
const bC = new ns({
  converter: (e) => {
    const t = Re(), { width: r, height: i } = e, s = {
      type: "image",
      x: 0,
      y: 0,
      width: r,
      height: i,
      status: "saved",
      fileId: t
    };
    return { files: {
      [t]: {
        id: t,
        mimeType: e.mimeType,
        dataURL: e.dataURL
      }
    }, elements: [s] };
  }
}), Ns = (e, t) => [e, t], Ql = (e) => e.replace(/\\n/g, `
`), oi = (e) => {
  const t = {
    type: "line",
    x: e.startX,
    y: e.startY,
    points: [
      Ns(0, 0),
      Ns(e.endX - e.startX, e.endY - e.startY)
    ],
    width: e.endX - e.startX,
    height: e.endY - e.startY,
    strokeStyle: e.strokeStyle || "solid",
    strokeColor: e.strokeColor || "#000",
    strokeWidth: e.strokeWidth || 1
  };
  return e.groupId && Object.assign(t, { groupIds: [e.groupId] }), e.id && Object.assign(t, { id: e.id }), t;
}, ai = (e) => {
  const t = {
    type: "text",
    x: e.x,
    y: e.y,
    width: e.width,
    height: e.height,
    text: Ql(e.text) || "",
    fontSize: e.fontSize,
    verticalAlign: "top",
    strokeColor: e.color
  };
  return e.groupId && Object.assign(t, { groupIds: [e.groupId] }), e.id && Object.assign(t, { id: e.id }), t;
}, Mi = (e) => {
  const t = {
    text: Ql(e?.label?.text || ""),
    fontSize: e?.label?.fontSize,
    textAlign: e.label?.textAlign,
    verticalAlign: e.label?.verticalAlign || "middle",
    strokeColor: e.label?.color || "#000",
    ...e.groupId ? { groupIds: [e.groupId] } : {}
  };
  let r = {};
  e.type === "rectangle" && e.subtype === "activation" && (r = {
    backgroundColor: "#e9ecef",
    fillStyle: "solid"
  });
  const i = {
    id: e.id,
    type: e.type,
    x: e.x,
    y: e.y,
    width: e.width,
    height: e.height,
    label: t,
    strokeStyle: e?.strokeStyle,
    strokeWidth: e?.strokeWidth,
    strokeColor: e?.strokeColor,
    backgroundColor: e?.bgColor,
    fillStyle: "solid",
    ...r
  };
  return e.groupId && Object.assign(i, { groupIds: [e.groupId] }), i;
}, Jl = (e) => {
  const t = {
    type: "arrow",
    x: e.startX,
    y: e.startY,
    points: e.points?.map(([r, i]) => Ns(r, i)) || [
      Ns(0, 0),
      Ns(e.endX - e.startX, e.endY - e.startY)
    ],
    width: e.endX - e.startX,
    height: e.endY - e.startY,
    strokeStyle: e?.strokeStyle || "solid",
    endArrowhead: e?.endArrowhead || null,
    startArrowhead: e?.startArrowhead || null,
    label: {
      text: Ql(e?.label?.text || ""),
      fontSize: 16,
      textAlign: e?.label?.textAlign,
      verticalAlign: e?.label?.verticalAlign
    },
    roundness: {
      type: 2
    },
    start: e.start,
    end: e.end
  };
  return e.groupId && Object.assign(t, { groupIds: [e.groupId] }), t;
}, ko = 10, an = 16, kC = 24, wC = 4, SC = (e) => {
  if (!e)
    return !0;
  const t = e.trim().toLowerCase();
  return t === "transparent" || t === "none" || t === "rgba(0,0,0,0)" || t === "rgba(0, 0, 0, 0)";
}, TC = (e, t) => Math.max(20, Math.round(e.length * t * 0.6)), Hc = (e, t, r = !0) => {
  const i = e, s = i.groupIds ?? [];
  if (s.includes(t) || (i.groupIds = [...s, t]), !r || !i.label)
    return;
  const o = i.label.groupIds ?? [];
  o.includes(t) || (i.label.groupIds = [...o, t]);
}, _C = new ns({
  converter: (e) => {
    const t = [], r = [];
    if (Object.values(e.nodes).forEach((i) => {
      !i || !i.length || i.forEach((s) => {
        let o;
        switch (s.type) {
          case "line":
            o = oi(s);
            break;
          case "rectangle":
          case "ellipse":
            o = Mi(s);
            break;
          case "text":
            o = ai(s);
            break;
          default:
            throw `unknown type ${s.type}`;
        }
        s.type === "rectangle" && s?.subtype === "activation" ? r.push(o) : t.push(o);
      });
    }), Object.values(e.lines).forEach((i) => {
      i && t.push(oi(i));
    }), Object.values(e.arrows).forEach((i) => {
      i && (t.push(Jl(i)), i.sequenceNumber && t.push(Mi(i.sequenceNumber)));
    }), t.push(...r), e.loops) {
      const { lines: i, texts: s, nodes: o } = e.loops;
      i.forEach((a) => {
        t.push(oi(a));
      }), s.forEach((a) => {
        t.push(ai(a));
      }), o.forEach((a) => {
        t.push(Mi(a));
      });
    }
    return e.groups && e.groups.forEach((i) => {
      const { actorKeys: s, name: o } = i;
      let a = 1 / 0, n = 1 / 0, l = 0, c = 0;
      if (!s.length)
        return;
      const h = t.filter((b) => {
        if (b.id) {
          const w = b.id.indexOf("-"), _ = b.id.substring(0, w);
          return s.includes(_);
        }
        return !1;
      });
      if (!h.length || (h.forEach((b) => {
        b.x === void 0 || b.y === void 0 || b.width === void 0 || b.height === void 0 || (a = Math.min(a, b.x), n = Math.min(n, b.y), l = Math.max(l, b.x + b.width), c = Math.max(c, b.y + b.height));
      }), !Number.isFinite(a) || !Number.isFinite(n) || !Number.isFinite(l) || !Number.isFinite(c)))
        return;
      const u = a - ko, d = n - ko, f = l - a + ko * 2, m = c - n + ko * 2, y = Re(), x = Re(), C = Mi({
        type: "rectangle",
        x: u,
        y: d,
        width: f,
        height: m,
        bgColor: SC(i.fill) ? void 0 : i.fill,
        strokeColor: "#1f1f1f",
        strokeWidth: 1,
        id: y,
        groupId: x
      });
      if (t.unshift(C), t.forEach((b) => {
        b.id !== y && (b.x === void 0 || b.y === void 0 || b.width === void 0 || b.height === void 0 || b.x >= a && b.x + b.width <= l && b.y >= n && b.y + b.height <= c && Hc(b, x));
      }), o) {
        const b = ai({
          id: Re(),
          text: o,
          x: u + wC,
          y: d - kC,
          width: TC(o, an),
          height: an + 8,
          fontSize: an,
          color: "#1f1f1f",
          groupId: x
        });
        Hc(b, x, !1), t.push(b);
      }
    }), { elements: t };
  }
}), BC = new ns({
  converter: (e) => {
    const t = [];
    return e.nodes.forEach((r) => {
      !r || !r.length || r.forEach((i) => {
        let s;
        switch (i.type) {
          case "line":
            s = oi(i);
            break;
          case "rectangle":
          case "ellipse":
            s = Mi(i);
            break;
          case "text":
            s = ai(i);
            break;
          default:
            throw `unknown type ${i.type}`;
        }
        t.push(s);
      });
    }), Object.values(e.lines).forEach((r) => {
      r && t.push(oi(r));
    }), Object.values(e.arrows).forEach((r) => {
      if (!r)
        return;
      const i = Jl(r);
      t.push(i);
    }), Object.values(e.text).forEach((r) => {
      const i = ai(r);
      t.push(i);
    }), Object.values(e.namespaces).forEach((r) => {
      const i = Object.keys(r.classes), s = [...i], o = [...e.lines, ...e.arrows, ...e.text];
      i.forEach((n) => {
        const l = o.filter((c) => c.metadata && c.metadata.classId === n).map((c) => c.id);
        l.length && s.push(...l);
      });
      const a = {
        type: "frame",
        id: Re(),
        name: r.id,
        children: s
      };
      t.push(a);
    }), { elements: t };
  }
}), vC = new ns({
  converter: (e) => {
    const t = [];
    return e.nodes.forEach((r) => {
      !r || !r.length || r.forEach((i) => {
        let s;
        switch (i.type) {
          case "line":
            s = oi(i);
            break;
          case "rectangle":
          case "ellipse":
            s = Mi(i);
            break;
          case "text":
            s = ai(i);
            break;
          default:
            throw `unknown type ${i.type}`;
        }
        t.push(s);
      });
    }), e.lines.forEach((r) => {
      t.push(oi(r));
    }), e.arrows.forEach((r) => {
      t.push(Jl(r));
    }), e.text.forEach((r) => {
      t.push(ai(r));
    }), { elements: t };
  }
}), Go = (e, t) => [e, t], As = 16, Af = 14, LC = 1, al = "#000000", Ef = 5, AC = Ef * 2, EC = Ef * 2, FC = 1.25, Ff = /* @__PURE__ */ new Set([
  "choice",
  "fork",
  "join",
  "stateStart",
  "stateEnd",
  "divider"
]), nl = (e) => e.shape === "stateEnd" ? [`state_end_group_${e.id}`] : void 0, Mf = (e) => e.shape === "rectWithTitle" && e.description.length ? [e.text, ...e.description].join(`
`) : e.text;
let Vr;
const MC = () => {
  if (Vr !== void 0)
    return Vr;
  if (typeof document > "u")
    return Vr = null, Vr;
  try {
    Vr = document.createElement("canvas").getContext("2d");
  } catch {
    Vr = null;
  }
  return Vr;
}, Ji = (e, t) => {
  const r = MC();
  return r ? (r.font = `${t}px Excalifont, sans-serif`, r.measureText(e).width) : e.length * t * 0.6;
}, OC = (e, t, r) => {
  if (Ji(e, t) <= r)
    return [e];
  const i = [];
  let s = "";
  for (const o of e) {
    const a = `${s}${o}`;
    if (s && Ji(a, t) > r) {
      i.push(s), s = o;
      continue;
    }
    s = a;
  }
  return s && i.push(s), i;
}, $C = (e, t, r) => {
  if (!e.trim() || Ji(e, t) <= r)
    return e;
  const i = e.split(/\s+/).filter(Boolean), s = [];
  let o = "";
  for (const a of i) {
    const n = OC(a, t, r);
    for (const [l, c] of n.entries()) {
      const u = o ? `${o}${o && l === 0 ? " " : ""}${c}` : c;
      if (Ji(u, t) <= r) {
        o = u;
        continue;
      }
      o && s.push(o), o = c;
    }
    n.length > 1;
  }
  return s.push(o), s.join(`
`);
}, IC = (e, t, r) => {
  const s = e.map((n) => $C(n, t, r)).join(`
`).split(`
`), o = Math.max(...s.map((n) => Ji(n, t))), a = s.length * t * FC;
  return {
    width: o,
    height: a
  };
}, DC = (e, t, r, i) => {
  const s = e.split(`
`);
  for (let o = As; o >= Af; o -= LC) {
    const { height: a } = IC(s, o, t);
    if (a <= r)
      return o;
  }
  return i;
}, RC = (e) => {
  const t = Mf(e);
  if (!t || Ff.has(e.shape))
    return As;
  const r = Math.max(1, e.width - AC), i = Math.max(1, e.height - EC), s = t.split(`
`);
  return s.length > 1 && Math.max(...s.map((a) => Ji(a, As))) <= r ? As : DC(t, r, i, s.length === 1 ? As : Af);
}, PC = (e) => {
  if (Ff.has(e.shape))
    return;
  const t = Mf(e);
  if (t)
    return {
      text: t,
      fontSize: RC(e),
      verticalAlign: e.shape === "rectWithTitle" || e.shape === "roundedWithTitle" ? "top" : "middle",
      ...ol(e.labelStyle)
    };
}, NC = (e) => {
  const t = Xs(e.containerStyle), r = PC(e), i = e.shape === "choice" ? "diamond" : e.shape === "stateStart" || e.shape === "stateEnd" ? "ellipse" : "rectangle", s = e.shape === "rect" || e.shape === "rectWithTitle" || e.shape === "roundedWithTitle", o = e.shape === "stateStart" || e.shape === "fork" || e.shape === "join", a = t.backgroundColor || t.strokeColor || al, n = t.strokeColor || t.backgroundColor || al;
  return {
    id: e.id,
    type: i,
    ...nl(e) ? { groupIds: nl(e) } : {},
    x: e.x,
    y: e.y,
    width: e.width,
    height: e.height,
    ...r ? { label: r } : {},
    ...t,
    ...s ? { roundness: { type: 3 } } : {},
    ...o ? {
      backgroundColor: a,
      strokeColor: n,
      fillStyle: "solid"
    } : {}
  };
}, qC = (e) => {
  if (!e.dividerLine)
    return null;
  const t = Xs(e.containerStyle);
  return {
    id: `${e.id}__divider`,
    type: "line",
    x: e.dividerLine.startX,
    y: e.dividerLine.startY,
    width: e.dividerLine.endX - e.dividerLine.startX,
    height: e.dividerLine.endY - e.dividerLine.startY,
    points: [
      Go(0, 0),
      Go(e.dividerLine.endX - e.dividerLine.startX, e.dividerLine.endY - e.dividerLine.startY)
    ],
    strokeColor: t.strokeColor || "#000",
    strokeWidth: t.strokeWidth || 1
  };
}, WC = (e) => {
  const t = Xs(e.containerStyle), r = Math.max(2, Math.min(e.width, e.height) * 0.32), i = e.endInnerColor || t.strokeColor || t.backgroundColor || al;
  return {
    id: `${e.id}__inner`,
    type: "ellipse",
    groupIds: nl(e),
    x: e.x + r,
    y: e.y + r,
    width: Math.max(1, e.width - r * 2),
    height: Math.max(1, e.height - r * 2),
    backgroundColor: i,
    strokeColor: i,
    fillStyle: "solid",
    strokeWidth: 1
  };
}, zC = (e) => {
  const t = e.reflectionPoints.map((r, i, s) => {
    const o = s[0];
    return i === 0 ? Go(0, 0) : Go(r.x - o.x, r.y - o.y);
  });
  return {
    id: e.id,
    type: "arrow",
    x: e.startX,
    y: e.startY,
    width: e.endX - e.startX,
    height: e.endY - e.startY,
    points: t,
    strokeColor: e.strokeColor || "#000",
    strokeWidth: e.strokeWidth || 2,
    strokeStyle: e.strokeStyle || "solid",
    endArrowhead: e.isNoteEdge ? null : "triangle",
    roundness: { type: 2 },
    start: { id: e.start },
    end: { id: e.end },
    ...e.text ? {
      label: {
        text: e.text,
        fontSize: 16
      }
    } : {}
  };
}, HC = new ns({
  converter: (e) => {
    const t = [];
    return e.nodes.forEach((r) => {
      if (!r.isRenderable)
        return;
      const i = NC(r);
      t.push(i);
      const s = qC(r);
      s && t.push(s), r.shape === "stateEnd" && t.push(WC(r));
    }), e.edges.forEach((r) => {
      t.push(zC(r));
    }), { elements: t };
  }
}), Ae = (e) => {
  e = UC(e);
  const t = e.replace(/#(\d+);/g, "&#$1;").replace(/#([a-z]+);/g, "&$1;"), r = document.createElement("textarea");
  return r.innerHTML = t, r.value;
}, ni = (e) => {
  const r = e.getAttribute("transform")?.match(/translate\(([ \d.-]+),\s*([\d.-]+)\)/);
  let i = 0, s = 0;
  return r && (i = Number(r[1]), s = Number(r[2])), { transformX: i, transformY: s };
}, YC = (e) => {
  let t = e;
  return t = t.replace(/style.*:\S*#.*;/g, (r) => r.substring(0, r.length - 1)), t = t.replace(/classDef.*:\S*#.*;/g, (r) => r.substring(0, r.length - 1)), t = t.replace(/#\w+;/g, (r) => {
    const i = r.substring(1, r.length - 1);
    return /^\+?\d+$/.test(i) ? `ﬂ°°${i}¶ß` : `ﬂ°${i}¶ß`;
  }), t;
}, UC = function(e) {
  return e.replace(/ﬂ°°/g, "#").replace(/ﬂ°/g, "&").replace(/¶ß/g, ";");
}, XC = 0.5, th = (e, t = XC) => {
  const r = [];
  return e.forEach((i) => {
    const s = r[r.length - 1];
    if (!s) {
      r.push(i);
      return;
    }
    Math.hypot(i[0] - s[0], i[1] - s[1]) <= t || r.push(i);
  }), r;
}, eh = (e) => {
  const t = e.getAttribute("d");
  if (!t)
    return null;
  const r = Array.from(t.matchAll(/-?\d*\.?\d+(?:e[-+]?\d+)?/gi), (i) => Number(i[0]));
  return r.length < 4 ? null : {
    startX: r[0],
    startY: r[1],
    endX: r[r.length - 2],
    endY: r[r.length - 1]
  };
}, Of = (e) => {
  const t = e.getAttribute("data-points");
  if (!t) {
    const r = eh(e);
    return r ? [
      { x: r.startX, y: r.startY },
      { x: r.endX, y: r.endY }
    ] : [];
  }
  try {
    const r = atob(t), i = JSON.parse(r);
    return Array.isArray(i) ? i.filter((s) => s && typeof s.x == "number" && typeof s.y == "number" && Number.isFinite(s.x) && Number.isFinite(s.y)) : [];
  } catch {
    return [];
  }
}, $f = (e, t = { x: 0, y: 0 }, r = "LM") => {
  if (e.tagName.toLowerCase() !== "path")
    throw new Error(`Invalid input: Expected an HTMLElement of tag "path", got ${e.tagName}`);
  const i = e.getAttribute("d");
  if (!i)
    throw new Error('Path element does not contain a "d" attribute');
  const s = i.split(new RegExp(`(?=[${r}])`)), o = s[0].substring(1).split(",").map((l) => parseFloat(l)), a = s[s.length - 1].substring(1).split(",").map((l) => parseFloat(l)), n = s.map((l) => {
    const c = l[0], h = l.substring(1).split(",").map((u) => parseFloat(u));
    return c === "C" ? {
      x: h[4],
      y: h[5],
      command: c
    } : { x: h[0], y: h[1], command: c };
  }).filter((l, c, h) => {
    if (c === 0 || c === h.length - 1)
      return !0;
    if (l.x === h[c - 1].x && l.y === h[c - 1].y || c === h.length - 2 && l.command === "C")
      return !1;
    if (c === h.length - 2 && (h[c - 1].x === l.x || h[c - 1].y === l.y)) {
      const u = h[h.length - 1];
      return Math.hypot(u.x - l.x, u.y - l.y) > 20;
    }
    return l.x !== h[c - 1].x || l.y !== h[c - 1].y;
  }).map((l) => ({
    x: l.x + t.x,
    y: l.y + t.y
  }));
  return {
    startX: o[0] + t.x,
    startY: o[1] + t.y,
    endX: a[0] + t.x,
    endY: a[1] + t.y,
    reflectionPoints: n
  };
}, jC = (e) => ({
  ...e,
  elements: e.elements.map((t) => {
    if (!("points" in t) || !Array.isArray(t.points))
      return t;
    const r = t.points;
    if (r.length < 2)
      return t;
    const i = th(r);
    return i.length === r.length ? t : {
      ...t,
      points: i
    };
  })
}), GC = (e, t = {}) => {
  const r = (() => {
    switch (e.type) {
      case "graphImage":
        return bC.convert(e, t);
      case "flowchart":
        return CC.convert(e, t);
      case "sequence":
        return _C.convert(e, t);
      case "class":
        return BC.convert(e, t);
      case "erd":
        return vC.convert(e, t);
      case "state":
        return HC.convert(e, t);
      default:
        throw new Error(`graphToExcalidraw: unknown graph type "${e.type}, only flowcharts are supported!"`);
    }
  })();
  return jC(r);
};
var If = Object.defineProperty, p = (e, t) => If(e, "name", { value: t, configurable: !0 }), VC = (e, t) => {
  for (var r in t)
    If(e, r, { get: t[r], enumerable: !0 });
}, KC = Nx();
const ZC = /* @__PURE__ */ Zl(KC);
var xr = {
  trace: 0,
  debug: 1,
  info: 2,
  warn: 3,
  error: 4,
  fatal: 5
}, $ = {
  trace: /* @__PURE__ */ p((...e) => {
  }, "trace"),
  debug: /* @__PURE__ */ p((...e) => {
  }, "debug"),
  info: /* @__PURE__ */ p((...e) => {
  }, "info"),
  warn: /* @__PURE__ */ p((...e) => {
  }, "warn"),
  error: /* @__PURE__ */ p((...e) => {
  }, "error"),
  fatal: /* @__PURE__ */ p((...e) => {
  }, "fatal")
}, rh = /* @__PURE__ */ p(function(e = "fatal") {
  let t = xr.fatal;
  typeof e == "string" ? e.toLowerCase() in xr && (t = xr[e]) : typeof e == "number" && (t = e), $.trace = () => {
  }, $.debug = () => {
  }, $.info = () => {
  }, $.warn = () => {
  }, $.error = () => {
  }, $.fatal = () => {
  }, t <= xr.fatal && ($.fatal = console.error ? console.error.bind(console, Ie("FATAL"), "color: orange") : console.log.bind(console, "\x1B[35m", Ie("FATAL"))), t <= xr.error && ($.error = console.error ? console.error.bind(console, Ie("ERROR"), "color: orange") : console.log.bind(console, "\x1B[31m", Ie("ERROR"))), t <= xr.warn && ($.warn = console.warn ? console.warn.bind(console, Ie("WARN"), "color: orange") : console.log.bind(console, "\x1B[33m", Ie("WARN"))), t <= xr.info && ($.info = console.info ? console.info.bind(console, Ie("INFO"), "color: lightblue") : console.log.bind(console, "\x1B[34m", Ie("INFO"))), t <= xr.debug && ($.debug = console.debug ? console.debug.bind(console, Ie("DEBUG"), "color: lightgreen") : console.log.bind(console, "\x1B[32m", Ie("DEBUG"))), t <= xr.trace && ($.trace = console.debug ? console.debug.bind(console, Ie("TRACE"), "color: lightgreen") : console.log.bind(console, "\x1B[32m", Ie("TRACE")));
}, "setLogLevel"), Ie = /* @__PURE__ */ p((e) => `%c${ZC().format("ss.SSS")} : ${e} : `, "format");
const Do = {
  /* CLAMP */
  min: {
    r: 0,
    g: 0,
    b: 0,
    s: 0,
    l: 0,
    a: 0
  },
  max: {
    r: 255,
    g: 255,
    b: 255,
    h: 360,
    s: 100,
    l: 100,
    a: 1
  },
  clamp: {
    r: (e) => e >= 255 ? 255 : e < 0 ? 0 : e,
    g: (e) => e >= 255 ? 255 : e < 0 ? 0 : e,
    b: (e) => e >= 255 ? 255 : e < 0 ? 0 : e,
    h: (e) => e % 360,
    s: (e) => e >= 100 ? 100 : e < 0 ? 0 : e,
    l: (e) => e >= 100 ? 100 : e < 0 ? 0 : e,
    a: (e) => e >= 1 ? 1 : e < 0 ? 0 : e
  },
  /* CONVERSION */
  //SOURCE: https://planetcalc.com/7779
  toLinear: (e) => {
    const t = e / 255;
    return e > 0.03928 ? Math.pow((t + 0.055) / 1.055, 2.4) : t / 12.92;
  },
  //SOURCE: https://gist.github.com/mjackson/5311256
  hue2rgb: (e, t, r) => (r < 0 && (r += 1), r > 1 && (r -= 1), r < 1 / 6 ? e + (t - e) * 6 * r : r < 1 / 2 ? t : r < 2 / 3 ? e + (t - e) * (2 / 3 - r) * 6 : e),
  hsl2rgb: ({ h: e, s: t, l: r }, i) => {
    if (!t)
      return r * 2.55;
    e /= 360, t /= 100, r /= 100;
    const s = r < 0.5 ? r * (1 + t) : r + t - r * t, o = 2 * r - s;
    switch (i) {
      case "r":
        return Do.hue2rgb(o, s, e + 1 / 3) * 255;
      case "g":
        return Do.hue2rgb(o, s, e) * 255;
      case "b":
        return Do.hue2rgb(o, s, e - 1 / 3) * 255;
    }
  },
  rgb2hsl: ({ r: e, g: t, b: r }, i) => {
    e /= 255, t /= 255, r /= 255;
    const s = Math.max(e, t, r), o = Math.min(e, t, r), a = (s + o) / 2;
    if (i === "l")
      return a * 100;
    if (s === o)
      return 0;
    const n = s - o, l = a > 0.5 ? n / (2 - s - o) : n / (s + o);
    if (i === "s")
      return l * 100;
    switch (s) {
      case e:
        return ((t - r) / n + (t < r ? 6 : 0)) * 60;
      case t:
        return ((r - e) / n + 2) * 60;
      case r:
        return ((e - t) / n + 4) * 60;
      default:
        return -1;
    }
  }
}, QC = {
  /* API */
  clamp: (e, t, r) => t > r ? Math.min(t, Math.max(r, e)) : Math.min(r, Math.max(t, e)),
  round: (e) => Math.round(e * 1e10) / 1e10
}, JC = {
  /* API */
  dec2hex: (e) => {
    const t = Math.round(e).toString(16);
    return t.length > 1 ? t : `0${t}`;
  }
}, Tt = {
  channel: Do,
  lang: QC,
  unit: JC
}, Pr = {};
for (let e = 0; e <= 255; e++)
  Pr[e] = Tt.unit.dec2hex(e);
const pe = {
  ALL: 0,
  RGB: 1,
  HSL: 2
};
let tb = class {
  constructor() {
    this.type = pe.ALL;
  }
  /* API */
  get() {
    return this.type;
  }
  set(t) {
    if (this.type && this.type !== t)
      throw new Error("Cannot change both RGB and HSL channels at the same time");
    this.type = t;
  }
  reset() {
    this.type = pe.ALL;
  }
  is(t) {
    return this.type === t;
  }
};
class eb {
  /* CONSTRUCTOR */
  constructor(t, r) {
    this.color = r, this.changed = !1, this.data = t, this.type = new tb();
  }
  /* API */
  set(t, r) {
    return this.color = r, this.changed = !1, this.data = t, this.type.type = pe.ALL, this;
  }
  /* HELPERS */
  _ensureHSL() {
    const t = this.data, { h: r, s: i, l: s } = t;
    r === void 0 && (t.h = Tt.channel.rgb2hsl(t, "h")), i === void 0 && (t.s = Tt.channel.rgb2hsl(t, "s")), s === void 0 && (t.l = Tt.channel.rgb2hsl(t, "l"));
  }
  _ensureRGB() {
    const t = this.data, { r, g: i, b: s } = t;
    r === void 0 && (t.r = Tt.channel.hsl2rgb(t, "r")), i === void 0 && (t.g = Tt.channel.hsl2rgb(t, "g")), s === void 0 && (t.b = Tt.channel.hsl2rgb(t, "b"));
  }
  /* GETTERS */
  get r() {
    const t = this.data, r = t.r;
    return !this.type.is(pe.HSL) && r !== void 0 ? r : (this._ensureHSL(), Tt.channel.hsl2rgb(t, "r"));
  }
  get g() {
    const t = this.data, r = t.g;
    return !this.type.is(pe.HSL) && r !== void 0 ? r : (this._ensureHSL(), Tt.channel.hsl2rgb(t, "g"));
  }
  get b() {
    const t = this.data, r = t.b;
    return !this.type.is(pe.HSL) && r !== void 0 ? r : (this._ensureHSL(), Tt.channel.hsl2rgb(t, "b"));
  }
  get h() {
    const t = this.data, r = t.h;
    return !this.type.is(pe.RGB) && r !== void 0 ? r : (this._ensureRGB(), Tt.channel.rgb2hsl(t, "h"));
  }
  get s() {
    const t = this.data, r = t.s;
    return !this.type.is(pe.RGB) && r !== void 0 ? r : (this._ensureRGB(), Tt.channel.rgb2hsl(t, "s"));
  }
  get l() {
    const t = this.data, r = t.l;
    return !this.type.is(pe.RGB) && r !== void 0 ? r : (this._ensureRGB(), Tt.channel.rgb2hsl(t, "l"));
  }
  get a() {
    return this.data.a;
  }
  /* SETTERS */
  set r(t) {
    this.type.set(pe.RGB), this.changed = !0, this.data.r = t;
  }
  set g(t) {
    this.type.set(pe.RGB), this.changed = !0, this.data.g = t;
  }
  set b(t) {
    this.type.set(pe.RGB), this.changed = !0, this.data.b = t;
  }
  set h(t) {
    this.type.set(pe.HSL), this.changed = !0, this.data.h = t;
  }
  set s(t) {
    this.type.set(pe.HSL), this.changed = !0, this.data.s = t;
  }
  set l(t) {
    this.type.set(pe.HSL), this.changed = !0, this.data.l = t;
  }
  set a(t) {
    this.changed = !0, this.data.a = t;
  }
}
const Sa = new eb({ r: 0, g: 0, b: 0, a: 0 }, "transparent"), $i = {
  /* VARIABLES */
  re: /^#((?:[a-f0-9]{2}){2,4}|[a-f0-9]{3})$/i,
  /* API */
  parse: (e) => {
    if (e.charCodeAt(0) !== 35)
      return;
    const t = e.match($i.re);
    if (!t)
      return;
    const r = t[1], i = parseInt(r, 16), s = r.length, o = s % 4 === 0, a = s > 4, n = a ? 1 : 17, l = a ? 8 : 4, c = o ? 0 : -1, h = a ? 255 : 15;
    return Sa.set({
      r: (i >> l * (c + 3) & h) * n,
      g: (i >> l * (c + 2) & h) * n,
      b: (i >> l * (c + 1) & h) * n,
      a: o ? (i & h) * n / 255 : 1
    }, e);
  },
  stringify: (e) => {
    const { r: t, g: r, b: i, a: s } = e;
    return s < 1 ? `#${Pr[Math.round(t)]}${Pr[Math.round(r)]}${Pr[Math.round(i)]}${Pr[Math.round(s * 255)]}` : `#${Pr[Math.round(t)]}${Pr[Math.round(r)]}${Pr[Math.round(i)]}`;
  }
}, ri = {
  /* VARIABLES */
  re: /^hsla?\(\s*?(-?(?:\d+(?:\.\d+)?|(?:\.\d+))(?:e-?\d+)?(?:deg|grad|rad|turn)?)\s*?(?:,|\s)\s*?(-?(?:\d+(?:\.\d+)?|(?:\.\d+))(?:e-?\d+)?%)\s*?(?:,|\s)\s*?(-?(?:\d+(?:\.\d+)?|(?:\.\d+))(?:e-?\d+)?%)(?:\s*?(?:,|\/)\s*?\+?(-?(?:\d+(?:\.\d+)?|(?:\.\d+))(?:e-?\d+)?(%)?))?\s*?\)$/i,
  hueRe: /^(.+?)(deg|grad|rad|turn)$/i,
  /* HELPERS */
  _hue2deg: (e) => {
    const t = e.match(ri.hueRe);
    if (t) {
      const [, r, i] = t;
      switch (i) {
        case "grad":
          return Tt.channel.clamp.h(parseFloat(r) * 0.9);
        case "rad":
          return Tt.channel.clamp.h(parseFloat(r) * 180 / Math.PI);
        case "turn":
          return Tt.channel.clamp.h(parseFloat(r) * 360);
      }
    }
    return Tt.channel.clamp.h(parseFloat(e));
  },
  /* API */
  parse: (e) => {
    const t = e.charCodeAt(0);
    if (t !== 104 && t !== 72)
      return;
    const r = e.match(ri.re);
    if (!r)
      return;
    const [, i, s, o, a, n] = r;
    return Sa.set({
      h: ri._hue2deg(i),
      s: Tt.channel.clamp.s(parseFloat(s)),
      l: Tt.channel.clamp.l(parseFloat(o)),
      a: a ? Tt.channel.clamp.a(n ? parseFloat(a) / 100 : parseFloat(a)) : 1
    }, e);
  },
  stringify: (e) => {
    const { h: t, s: r, l: i, a: s } = e;
    return s < 1 ? `hsla(${Tt.lang.round(t)}, ${Tt.lang.round(r)}%, ${Tt.lang.round(i)}%, ${s})` : `hsl(${Tt.lang.round(t)}, ${Tt.lang.round(r)}%, ${Tt.lang.round(i)}%)`;
  }
}, qs = {
  /* VARIABLES */
  colors: {
    aliceblue: "#f0f8ff",
    antiquewhite: "#faebd7",
    aqua: "#00ffff",
    aquamarine: "#7fffd4",
    azure: "#f0ffff",
    beige: "#f5f5dc",
    bisque: "#ffe4c4",
    black: "#000000",
    blanchedalmond: "#ffebcd",
    blue: "#0000ff",
    blueviolet: "#8a2be2",
    brown: "#a52a2a",
    burlywood: "#deb887",
    cadetblue: "#5f9ea0",
    chartreuse: "#7fff00",
    chocolate: "#d2691e",
    coral: "#ff7f50",
    cornflowerblue: "#6495ed",
    cornsilk: "#fff8dc",
    crimson: "#dc143c",
    cyanaqua: "#00ffff",
    darkblue: "#00008b",
    darkcyan: "#008b8b",
    darkgoldenrod: "#b8860b",
    darkgray: "#a9a9a9",
    darkgreen: "#006400",
    darkgrey: "#a9a9a9",
    darkkhaki: "#bdb76b",
    darkmagenta: "#8b008b",
    darkolivegreen: "#556b2f",
    darkorange: "#ff8c00",
    darkorchid: "#9932cc",
    darkred: "#8b0000",
    darksalmon: "#e9967a",
    darkseagreen: "#8fbc8f",
    darkslateblue: "#483d8b",
    darkslategray: "#2f4f4f",
    darkslategrey: "#2f4f4f",
    darkturquoise: "#00ced1",
    darkviolet: "#9400d3",
    deeppink: "#ff1493",
    deepskyblue: "#00bfff",
    dimgray: "#696969",
    dimgrey: "#696969",
    dodgerblue: "#1e90ff",
    firebrick: "#b22222",
    floralwhite: "#fffaf0",
    forestgreen: "#228b22",
    fuchsia: "#ff00ff",
    gainsboro: "#dcdcdc",
    ghostwhite: "#f8f8ff",
    gold: "#ffd700",
    goldenrod: "#daa520",
    gray: "#808080",
    green: "#008000",
    greenyellow: "#adff2f",
    grey: "#808080",
    honeydew: "#f0fff0",
    hotpink: "#ff69b4",
    indianred: "#cd5c5c",
    indigo: "#4b0082",
    ivory: "#fffff0",
    khaki: "#f0e68c",
    lavender: "#e6e6fa",
    lavenderblush: "#fff0f5",
    lawngreen: "#7cfc00",
    lemonchiffon: "#fffacd",
    lightblue: "#add8e6",
    lightcoral: "#f08080",
    lightcyan: "#e0ffff",
    lightgoldenrodyellow: "#fafad2",
    lightgray: "#d3d3d3",
    lightgreen: "#90ee90",
    lightgrey: "#d3d3d3",
    lightpink: "#ffb6c1",
    lightsalmon: "#ffa07a",
    lightseagreen: "#20b2aa",
    lightskyblue: "#87cefa",
    lightslategray: "#778899",
    lightslategrey: "#778899",
    lightsteelblue: "#b0c4de",
    lightyellow: "#ffffe0",
    lime: "#00ff00",
    limegreen: "#32cd32",
    linen: "#faf0e6",
    magenta: "#ff00ff",
    maroon: "#800000",
    mediumaquamarine: "#66cdaa",
    mediumblue: "#0000cd",
    mediumorchid: "#ba55d3",
    mediumpurple: "#9370db",
    mediumseagreen: "#3cb371",
    mediumslateblue: "#7b68ee",
    mediumspringgreen: "#00fa9a",
    mediumturquoise: "#48d1cc",
    mediumvioletred: "#c71585",
    midnightblue: "#191970",
    mintcream: "#f5fffa",
    mistyrose: "#ffe4e1",
    moccasin: "#ffe4b5",
    navajowhite: "#ffdead",
    navy: "#000080",
    oldlace: "#fdf5e6",
    olive: "#808000",
    olivedrab: "#6b8e23",
    orange: "#ffa500",
    orangered: "#ff4500",
    orchid: "#da70d6",
    palegoldenrod: "#eee8aa",
    palegreen: "#98fb98",
    paleturquoise: "#afeeee",
    palevioletred: "#db7093",
    papayawhip: "#ffefd5",
    peachpuff: "#ffdab9",
    peru: "#cd853f",
    pink: "#ffc0cb",
    plum: "#dda0dd",
    powderblue: "#b0e0e6",
    purple: "#800080",
    rebeccapurple: "#663399",
    red: "#ff0000",
    rosybrown: "#bc8f8f",
    royalblue: "#4169e1",
    saddlebrown: "#8b4513",
    salmon: "#fa8072",
    sandybrown: "#f4a460",
    seagreen: "#2e8b57",
    seashell: "#fff5ee",
    sienna: "#a0522d",
    silver: "#c0c0c0",
    skyblue: "#87ceeb",
    slateblue: "#6a5acd",
    slategray: "#708090",
    slategrey: "#708090",
    snow: "#fffafa",
    springgreen: "#00ff7f",
    tan: "#d2b48c",
    teal: "#008080",
    thistle: "#d8bfd8",
    transparent: "#00000000",
    turquoise: "#40e0d0",
    violet: "#ee82ee",
    wheat: "#f5deb3",
    white: "#ffffff",
    whitesmoke: "#f5f5f5",
    yellow: "#ffff00",
    yellowgreen: "#9acd32"
  },
  /* API */
  parse: (e) => {
    e = e.toLowerCase();
    const t = qs.colors[e];
    if (t)
      return $i.parse(t);
  },
  stringify: (e) => {
    const t = $i.stringify(e);
    for (const r in qs.colors)
      if (qs.colors[r] === t)
        return r;
  }
}, Es = {
  /* VARIABLES */
  re: /^rgba?\(\s*?(-?(?:\d+(?:\.\d+)?|(?:\.\d+))(?:e\d+)?(%?))\s*?(?:,|\s)\s*?(-?(?:\d+(?:\.\d+)?|(?:\.\d+))(?:e\d+)?(%?))\s*?(?:,|\s)\s*?(-?(?:\d+(?:\.\d+)?|(?:\.\d+))(?:e\d+)?(%?))(?:\s*?(?:,|\/)\s*?\+?(-?(?:\d+(?:\.\d+)?|(?:\.\d+))(?:e\d+)?(%?)))?\s*?\)$/i,
  /* API */
  parse: (e) => {
    const t = e.charCodeAt(0);
    if (t !== 114 && t !== 82)
      return;
    const r = e.match(Es.re);
    if (!r)
      return;
    const [, i, s, o, a, n, l, c, h] = r;
    return Sa.set({
      r: Tt.channel.clamp.r(s ? parseFloat(i) * 2.55 : parseFloat(i)),
      g: Tt.channel.clamp.g(a ? parseFloat(o) * 2.55 : parseFloat(o)),
      b: Tt.channel.clamp.b(l ? parseFloat(n) * 2.55 : parseFloat(n)),
      a: c ? Tt.channel.clamp.a(h ? parseFloat(c) / 100 : parseFloat(c)) : 1
    }, e);
  },
  stringify: (e) => {
    const { r: t, g: r, b: i, a: s } = e;
    return s < 1 ? `rgba(${Tt.lang.round(t)}, ${Tt.lang.round(r)}, ${Tt.lang.round(i)}, ${Tt.lang.round(s)})` : `rgb(${Tt.lang.round(t)}, ${Tt.lang.round(r)}, ${Tt.lang.round(i)})`;
  }
}, lr = {
  /* VARIABLES */
  format: {
    keyword: qs,
    hex: $i,
    rgb: Es,
    rgba: Es,
    hsl: ri,
    hsla: ri
  },
  /* API */
  parse: (e) => {
    if (typeof e != "string")
      return e;
    const t = $i.parse(e) || Es.parse(e) || ri.parse(e) || qs.parse(e);
    if (t)
      return t;
    throw new Error(`Unsupported color format: "${e}"`);
  },
  stringify: (e) => !e.changed && e.color ? e.color : e.type.is(pe.HSL) || e.data.r === void 0 ? ri.stringify(e) : e.a < 1 || !Number.isInteger(e.r) || !Number.isInteger(e.g) || !Number.isInteger(e.b) ? Es.stringify(e) : $i.stringify(e)
}, Df = (e, t) => {
  const r = lr.parse(e);
  for (const i in t)
    r[i] = Tt.channel.clamp[i](t[i]);
  return lr.stringify(r);
}, Hr = (e, t, r = 0, i = 1) => {
  if (typeof e != "number")
    return Df(e, { a: t });
  const s = Sa.set({
    r: Tt.channel.clamp.r(e),
    g: Tt.channel.clamp.g(t),
    b: Tt.channel.clamp.b(r),
    a: Tt.channel.clamp.a(i)
  });
  return lr.stringify(s);
}, rb = (e) => {
  const { r: t, g: r, b: i } = lr.parse(e), s = 0.2126 * Tt.channel.toLinear(t) + 0.7152 * Tt.channel.toLinear(r) + 0.0722 * Tt.channel.toLinear(i);
  return Tt.lang.round(s);
}, ib = (e) => rb(e) >= 0.5, Ke = (e) => !ib(e), Rf = (e, t, r) => {
  const i = lr.parse(e), s = i[t], o = Tt.channel.clamp[t](s + r);
  return s !== o && (i[t] = o), lr.stringify(i);
}, R = (e, t) => Rf(e, "l", t), P = (e, t) => Rf(e, "l", -t), k = (e, t) => {
  const r = lr.parse(e), i = {};
  for (const s in t)
    t[s] && (i[s] = r[s] + t[s]);
  return Df(e, i);
}, sb = (e, t, r = 50) => {
  const { r: i, g: s, b: o, a } = lr.parse(e), { r: n, g: l, b: c, a: h } = lr.parse(t), u = r / 100, d = u * 2 - 1, f = a - h, y = ((d * f === -1 ? d : (d + f) / (1 + d * f)) + 1) / 2, x = 1 - y, C = i * y + n * x, b = s * y + l * x, w = o * y + c * x, _ = a * u + h * (1 - u);
  return Hr(C, b, w, _);
}, F = (e, t = 100) => {
  const r = lr.parse(e);
  return r.r = 255 - r.r, r.g = 255 - r.g, r.b = 255 - r.b, sb(r, e, t);
};
function Yc(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var r = 0, i = Array(t); r < t; r++) i[r] = e[r];
  return i;
}
function ob(e) {
  if (Array.isArray(e)) return e;
}
function ab(e, t) {
  var r = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (r != null) {
    var i, s, o, a, n = [], l = !0, c = !1;
    try {
      if (o = (r = r.call(e)).next, t !== 0) for (; !(l = (i = o.call(r)).done) && (n.push(i.value), n.length !== t); l = !0) ;
    } catch (h) {
      c = !0, s = h;
    } finally {
      try {
        if (!l && r.return != null && (a = r.return(), Object(a) !== a)) return;
      } finally {
        if (c) throw s;
      }
    }
    return n;
  }
}
function nb() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function lb(e, t) {
  return ob(e) || ab(e, t) || hb(e, t) || nb();
}
function hb(e, t) {
  if (e) {
    if (typeof e == "string") return Yc(e, t);
    var r = {}.toString.call(e).slice(8, -1);
    return r === "Object" && e.constructor && (r = e.constructor.name), r === "Map" || r === "Set" ? Array.from(e) : r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? Yc(e, t) : void 0;
  }
}
const Pf = Object.entries, Uc = Object.setPrototypeOf, cb = Object.isFrozen, Nf = Object.getPrototypeOf, qf = Object.getOwnPropertyDescriptor;
let ne = Object.freeze, de = Object.seal, Ai = Object.create, Wf = typeof Reflect < "u" && Reflect, ll = Wf.apply, hl = Wf.construct;
ne || (ne = function(t) {
  return t;
});
de || (de = function(t) {
  return t;
});
ll || (ll = function(t, r) {
  for (var i = arguments.length, s = new Array(i > 2 ? i - 2 : 0), o = 2; o < i; o++) s[o - 2] = arguments[o];
  return t.apply(r, s);
});
hl || (hl = function(t) {
  for (var r = arguments.length, i = new Array(r > 1 ? r - 1 : 0), s = 1; s < r; s++) i[s - 1] = arguments[s];
  return new t(...i);
});
const Cr = Gt(Array.prototype.forEach), ub = Gt(Array.prototype.lastIndexOf), Xc = Gt(Array.prototype.pop), xs = Gt(Array.prototype.push), db = Gt(Array.prototype.slice), fb = Gt(Array.prototype.splice), Ii = Array.isArray, nn = zf(Set), ln = Gt(Set.prototype.add), Cs = Gt(Set.prototype.has), Jr = Gt(String.prototype.toLowerCase), hn = Gt(String.prototype.toString), jc = Gt(String.prototype.match), bs = Gt(String.prototype.replace), Gc = Gt(String.prototype.indexOf), pb = Gt(String.prototype.trim), gb = Gt(Number.prototype.toString), mb = Gt(Boolean.prototype.toString), Vc = typeof BigInt > "u" ? null : Gt(BigInt.prototype.toString), Kc = typeof Symbol > "u" ? null : Gt(Symbol.prototype.toString), Be = Gt(Object.prototype.hasOwnProperty), ks = Gt(Object.prototype.toString), ce = Gt(RegExp.prototype.test), br = zf(TypeError);
function Gt(e) {
  return function(t) {
    t instanceof RegExp && (t.lastIndex = 0);
    for (var r = arguments.length, i = new Array(r > 1 ? r - 1 : 0), s = 1; s < r; s++) i[s - 1] = arguments[s];
    return ll(e, t, i);
  };
}
function zf(e) {
  return function() {
    for (var t = arguments.length, r = new Array(t), i = 0; i < t; i++) r[i] = arguments[i];
    return hl(e, r);
  };
}
function Pt(e, t) {
  let r = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : Jr;
  if (Uc && Uc(e, null), !Ii(t)) return e;
  let i = t.length;
  for (; i--; ) {
    let s = t[i];
    if (typeof s == "string") {
      const o = r(s);
      o !== s && (cb(t) || (t[i] = o), s = o);
    }
    e[s] = !0;
  }
  return e;
}
function yb(e) {
  for (let t = 0; t < e.length; t++) Be(e, t) || (e[t] = null);
  return e;
}
function Fe(e) {
  const t = Ai(null);
  for (const i of Pf(e)) {
    var r = lb(i, 2);
    const s = r[0], o = r[1];
    Be(e, s) && (Ii(o) ? t[s] = yb(o) : o && typeof o == "object" && o.constructor === Object ? t[s] = Fe(o) : t[s] = o);
  }
  return t;
}
function xb(e) {
  switch (typeof e) {
    case "string":
      return e;
    case "number":
      return gb(e);
    case "boolean":
      return mb(e);
    case "bigint":
      return Vc ? Vc(e) : "0";
    case "symbol":
      return Kc ? Kc(e) : "Symbol()";
    case "undefined":
      return ks(e);
    case "function":
    case "object": {
      if (e === null) return ks(e);
      const t = e, r = De(t, "toString");
      if (typeof r == "function") {
        const i = r(t);
        return typeof i == "string" ? i : ks(i);
      }
      return ks(e);
    }
    default:
      return ks(e);
  }
}
function De(e, t) {
  for (; e !== null; ) {
    const i = qf(e, t);
    if (i) {
      if (i.get) return Gt(i.get);
      if (typeof i.value == "function") return Gt(i.value);
    }
    e = Nf(e);
  }
  function r() {
    return null;
  }
  return r;
}
function Cb(e, t) {
  for (; e !== null; ) {
    const r = qf(e, t);
    if (r) return r.get ? Gt(r.get) : null;
    e = Nf(e);
  }
  return null;
}
function bb(e) {
  try {
    return ce(e, ""), !0;
  } catch {
    return !1;
  }
}
const Zc = ne([
  "a",
  "abbr",
  "acronym",
  "address",
  "area",
  "article",
  "aside",
  "audio",
  "b",
  "bdi",
  "bdo",
  "big",
  "blink",
  "blockquote",
  "body",
  "br",
  "button",
  "canvas",
  "caption",
  "center",
  "cite",
  "code",
  "col",
  "colgroup",
  "content",
  "data",
  "datalist",
  "dd",
  "decorator",
  "del",
  "details",
  "dfn",
  "dialog",
  "dir",
  "div",
  "dl",
  "dt",
  "element",
  "em",
  "fieldset",
  "figcaption",
  "figure",
  "font",
  "footer",
  "form",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "head",
  "header",
  "hgroup",
  "hr",
  "html",
  "i",
  "img",
  "input",
  "ins",
  "kbd",
  "label",
  "legend",
  "li",
  "main",
  "map",
  "mark",
  "marquee",
  "menu",
  "menuitem",
  "meter",
  "nav",
  "nobr",
  "ol",
  "optgroup",
  "option",
  "output",
  "p",
  "picture",
  "pre",
  "progress",
  "q",
  "rp",
  "rt",
  "ruby",
  "s",
  "samp",
  "search",
  "section",
  "select",
  "shadow",
  "slot",
  "small",
  "source",
  "spacer",
  "span",
  "strike",
  "strong",
  "style",
  "sub",
  "summary",
  "sup",
  "table",
  "tbody",
  "td",
  "template",
  "textarea",
  "tfoot",
  "th",
  "thead",
  "time",
  "tr",
  "track",
  "tt",
  "u",
  "ul",
  "var",
  "video",
  "wbr"
]), cn = ne([
  "svg",
  "a",
  "altglyph",
  "altglyphdef",
  "altglyphitem",
  "animatecolor",
  "animatemotion",
  "animatetransform",
  "circle",
  "clippath",
  "defs",
  "desc",
  "ellipse",
  "enterkeyhint",
  "exportparts",
  "filter",
  "font",
  "g",
  "glyph",
  "glyphref",
  "hkern",
  "image",
  "inputmode",
  "line",
  "lineargradient",
  "marker",
  "mask",
  "metadata",
  "mpath",
  "part",
  "path",
  "pattern",
  "polygon",
  "polyline",
  "radialgradient",
  "rect",
  "stop",
  "style",
  "switch",
  "symbol",
  "text",
  "textpath",
  "title",
  "tref",
  "tspan",
  "view",
  "vkern"
]), un = ne([
  "feBlend",
  "feColorMatrix",
  "feComponentTransfer",
  "feComposite",
  "feConvolveMatrix",
  "feDiffuseLighting",
  "feDisplacementMap",
  "feDistantLight",
  "feDropShadow",
  "feFlood",
  "feFuncA",
  "feFuncB",
  "feFuncG",
  "feFuncR",
  "feGaussianBlur",
  "feImage",
  "feMerge",
  "feMergeNode",
  "feMorphology",
  "feOffset",
  "fePointLight",
  "feSpecularLighting",
  "feSpotLight",
  "feTile",
  "feTurbulence"
]), kb = ne([
  "animate",
  "color-profile",
  "cursor",
  "discard",
  "font-face",
  "font-face-format",
  "font-face-name",
  "font-face-src",
  "font-face-uri",
  "foreignobject",
  "hatch",
  "hatchpath",
  "mesh",
  "meshgradient",
  "meshpatch",
  "meshrow",
  "missing-glyph",
  "script",
  "set",
  "solidcolor",
  "unknown",
  "use"
]), dn = ne([
  "math",
  "menclose",
  "merror",
  "mfenced",
  "mfrac",
  "mglyph",
  "mi",
  "mlabeledtr",
  "mmultiscripts",
  "mn",
  "mo",
  "mover",
  "mpadded",
  "mphantom",
  "mroot",
  "mrow",
  "ms",
  "mspace",
  "msqrt",
  "mstyle",
  "msub",
  "msup",
  "msubsup",
  "mtable",
  "mtd",
  "mtext",
  "mtr",
  "munder",
  "munderover",
  "mprescripts"
]), wb = ne([
  "maction",
  "maligngroup",
  "malignmark",
  "mlongdiv",
  "mscarries",
  "mscarry",
  "msgroup",
  "mstack",
  "msline",
  "msrow",
  "semantics",
  "annotation",
  "annotation-xml",
  "mprescripts",
  "none"
]), Qc = ne(["#text"]), Jc = ne([
  "accept",
  "action",
  "align",
  "alt",
  "autocapitalize",
  "autocomplete",
  "autopictureinpicture",
  "autoplay",
  "background",
  "bgcolor",
  "border",
  "capture",
  "cellpadding",
  "cellspacing",
  "checked",
  "cite",
  "class",
  "clear",
  "color",
  "cols",
  "colspan",
  "command",
  "commandfor",
  "controls",
  "controlslist",
  "coords",
  "crossorigin",
  "datetime",
  "decoding",
  "default",
  "dir",
  "disabled",
  "disablepictureinpicture",
  "disableremoteplayback",
  "download",
  "draggable",
  "enctype",
  "enterkeyhint",
  "exportparts",
  "face",
  "for",
  "headers",
  "height",
  "hidden",
  "high",
  "href",
  "hreflang",
  "id",
  "inert",
  "inputmode",
  "integrity",
  "ismap",
  "kind",
  "label",
  "lang",
  "list",
  "loading",
  "loop",
  "low",
  "max",
  "maxlength",
  "media",
  "method",
  "min",
  "minlength",
  "multiple",
  "muted",
  "name",
  "nonce",
  "noshade",
  "novalidate",
  "nowrap",
  "open",
  "optimum",
  "part",
  "pattern",
  "placeholder",
  "playsinline",
  "popover",
  "popovertarget",
  "popovertargetaction",
  "poster",
  "preload",
  "pubdate",
  "radiogroup",
  "readonly",
  "rel",
  "required",
  "rev",
  "reversed",
  "role",
  "rows",
  "rowspan",
  "spellcheck",
  "scope",
  "selected",
  "shape",
  "size",
  "sizes",
  "slot",
  "span",
  "srclang",
  "start",
  "src",
  "srcset",
  "step",
  "style",
  "summary",
  "tabindex",
  "title",
  "translate",
  "type",
  "usemap",
  "valign",
  "value",
  "width",
  "wrap",
  "xmlns"
]), fn = ne([
  "accent-height",
  "accumulate",
  "additive",
  "alignment-baseline",
  "amplitude",
  "ascent",
  "attributename",
  "attributetype",
  "azimuth",
  "basefrequency",
  "baseline-shift",
  "begin",
  "bias",
  "by",
  "class",
  "clip",
  "clippathunits",
  "clip-path",
  "clip-rule",
  "color",
  "color-interpolation",
  "color-interpolation-filters",
  "color-profile",
  "color-rendering",
  "cx",
  "cy",
  "d",
  "dx",
  "dy",
  "diffuseconstant",
  "direction",
  "display",
  "divisor",
  "dominant-baseline",
  "dur",
  "edgemode",
  "elevation",
  "end",
  "exponent",
  "fill",
  "fill-opacity",
  "fill-rule",
  "filter",
  "filterunits",
  "flood-color",
  "flood-opacity",
  "font-family",
  "font-size",
  "font-size-adjust",
  "font-stretch",
  "font-style",
  "font-variant",
  "font-weight",
  "fx",
  "fy",
  "g1",
  "g2",
  "glyph-name",
  "glyphref",
  "gradientunits",
  "gradienttransform",
  "height",
  "href",
  "id",
  "image-rendering",
  "in",
  "in2",
  "intercept",
  "k",
  "k1",
  "k2",
  "k3",
  "k4",
  "kerning",
  "keypoints",
  "keysplines",
  "keytimes",
  "lang",
  "lengthadjust",
  "letter-spacing",
  "kernelmatrix",
  "kernelunitlength",
  "lighting-color",
  "local",
  "marker-end",
  "marker-mid",
  "marker-start",
  "markerheight",
  "markerunits",
  "markerwidth",
  "maskcontentunits",
  "maskunits",
  "max",
  "mask",
  "mask-type",
  "media",
  "method",
  "mode",
  "min",
  "name",
  "numoctaves",
  "offset",
  "operator",
  "opacity",
  "order",
  "orient",
  "orientation",
  "origin",
  "overflow",
  "paint-order",
  "path",
  "pathlength",
  "patterncontentunits",
  "patterntransform",
  "patternunits",
  "pointer-events",
  "points",
  "preservealpha",
  "preserveaspectratio",
  "primitiveunits",
  "r",
  "rx",
  "ry",
  "radius",
  "refx",
  "refy",
  "repeatcount",
  "repeatdur",
  "restart",
  "result",
  "rotate",
  "scale",
  "seed",
  "shape-rendering",
  "slope",
  "specularconstant",
  "specularexponent",
  "spreadmethod",
  "startoffset",
  "stddeviation",
  "stitchtiles",
  "stop-color",
  "stop-opacity",
  "stroke-dasharray",
  "stroke-dashoffset",
  "stroke-linecap",
  "stroke-linejoin",
  "stroke-miterlimit",
  "stroke-opacity",
  "stroke",
  "stroke-width",
  "style",
  "surfacescale",
  "systemlanguage",
  "tabindex",
  "tablevalues",
  "targetx",
  "targety",
  "transform",
  "transform-origin",
  "text-anchor",
  "text-decoration",
  "text-orientation",
  "text-rendering",
  "textlength",
  "type",
  "u1",
  "u2",
  "unicode",
  "values",
  "vector-effect",
  "viewbox",
  "visibility",
  "version",
  "vert-adv-y",
  "vert-origin-x",
  "vert-origin-y",
  "width",
  "word-spacing",
  "wrap",
  "writing-mode",
  "xchannelselector",
  "ychannelselector",
  "x",
  "x1",
  "x2",
  "xmlns",
  "y",
  "y1",
  "y2",
  "z",
  "zoomandpan"
]), tu = ne([
  "accent",
  "accentunder",
  "align",
  "bevelled",
  "close",
  "columnalign",
  "columnlines",
  "columnspacing",
  "columnspan",
  "denomalign",
  "depth",
  "dir",
  "display",
  "displaystyle",
  "encoding",
  "fence",
  "frame",
  "height",
  "href",
  "id",
  "largeop",
  "length",
  "linethickness",
  "lquote",
  "lspace",
  "mathbackground",
  "mathcolor",
  "mathsize",
  "mathvariant",
  "maxsize",
  "minsize",
  "movablelimits",
  "notation",
  "numalign",
  "open",
  "rowalign",
  "rowlines",
  "rowspacing",
  "rowspan",
  "rspace",
  "rquote",
  "scriptlevel",
  "scriptminsize",
  "scriptsizemultiplier",
  "selection",
  "separator",
  "separators",
  "stretchy",
  "subscriptshift",
  "supscriptshift",
  "symmetric",
  "voffset",
  "width",
  "xmlns"
]), wo = ne([
  "xlink:href",
  "xml:id",
  "xlink:title",
  "xml:space",
  "xmlns:xlink"
]), Sb = de(/{{[\w\W]*|^[\w\W]*}}/g), Tb = de(/<%[\w\W]*|^[\w\W]*%>/g), _b = de(/\${[\w\W]*/g), Bb = de(/^data-[\-\w.\u00B7-\uFFFF]+$/), vb = de(/^aria-[\-\w]+$/), eu = de(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i), Lb = de(/^(?:\w+script|data):/i), Ab = de(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g), Eb = de(/^html$/i), Fb = de(/^[a-z][.\w]*(-[.\w]+)+$/i), pn = de(/<[/\w!]/g), ru = de(/<[/\w]/g), Mb = de(/<\/no(script|embed|frames)/i), iu = de(/\/>/i), te = {
  element: 1,
  attribute: 2,
  text: 3,
  cdataSection: 4,
  entityReference: 5,
  entityNode: 6,
  processingInstruction: 7,
  comment: 8,
  document: 9,
  documentType: 10,
  documentFragment: 11,
  notation: 12
}, Ob = ne(Pt({}, [
  "style",
  "script",
  "xmp",
  "iframe",
  "noembed",
  "noframes",
  "plaintext",
  "noscript"
])), $b = function() {
  return typeof window > "u" ? null : window;
}, Ib = function(t, r) {
  if (typeof t != "object" || typeof t.createPolicy != "function") return null;
  let i = null;
  const s = "data-tt-policy-suffix";
  r && r.hasAttribute(s) && (i = r.getAttribute(s));
  const o = "dompurify" + (i ? "#" + i : "");
  try {
    return t.createPolicy(o, {
      createHTML(a) {
        return a;
      },
      createScriptURL(a) {
        return a;
      }
    });
  } catch {
    return console.warn("TrustedTypes policy " + o + " could not be created."), null;
  }
}, su = function() {
  return {
    afterSanitizeAttributes: [],
    afterSanitizeElements: [],
    afterSanitizeShadowDOM: [],
    beforeSanitizeAttributes: [],
    beforeSanitizeElements: [],
    beforeSanitizeShadowDOM: [],
    uponSanitizeAttribute: [],
    uponSanitizeElement: [],
    uponSanitizeShadowNode: []
  };
}, Dr = function(t, r, i, s) {
  return Be(t, r) && Ii(t[r]) ? Pt(s.base ? Fe(s.base) : {}, t[r], s.transform) : i;
}, gn = function(t, r, i) {
  const s = Be(t, r) ? t[r] : void 0;
  return s && typeof s == "object" ? Fe(s) : i();
};
function Hf() {
  let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : $b();
  const t = (et) => Hf(et);
  if (t.version = "3.4.17", t.removed = [], !e || !e.document || e.document.nodeType !== te.document || !e.Element)
    return t.isSupported = !1, t;
  let r = e.document;
  const i = r, s = i.currentScript;
  e.DocumentFragment;
  const o = e.HTMLTemplateElement, a = e.Node, n = e.Element, l = e.NodeFilter;
  e.NamedNodeMap === void 0 && (e.NamedNodeMap || e.MozNamedAttrMap), e.HTMLFormElement;
  const c = e.DOMParser, h = e.trustedTypes, u = n.prototype, d = De(u, "cloneNode"), f = De(u, "remove"), m = De(u, "removeAttributeNode"), y = De(u, "nextSibling"), x = De(u, "childNodes"), C = De(u, "parentNode"), b = De(u, "shadowRoot"), w = De(u, "attributes"), _ = a && a.prototype ? De(a.prototype, "nodeType") : null, B = a && a.prototype ? De(a.prototype, "nodeName") : null, A = a && a.prototype ? De(a.prototype, "ownerDocument") : null, v = function(T) {
    return _ ? _(T) : T.nodeType;
  }, L = function(T) {
    return B ? B(T) : T.nodeName;
  }, W = Cb(u, "namespaceURI"), H = function(T) {
    return W ? W(T) : T.namespaceURI;
  };
  if (typeof o == "function") {
    const et = r.createElement("template");
    et.content && et.content.ownerDocument && (r = et.content.ownerDocument);
  }
  let D, st = "", Y, U = !1, Q = 0;
  const I = function() {
    if (Q > 0) throw br('A configured TRUSTED_TYPES_POLICY callback (createHTML or createScriptURL) must not call DOMPurify.sanitize, as that causes infinite recursion. Do not pass a policy whose callbacks wrap DOMPurify as TRUSTED_TYPES_POLICY; see the "DOMPurify and Trusted Types" section of the README.');
  }, N = function(T) {
    I(), Q++;
    try {
      return D.createHTML(T);
    } finally {
      Q--;
    }
  }, X = function(T) {
    I(), Q++;
    try {
      return D.createScriptURL(T);
    } finally {
      Q--;
    }
  }, gt = function() {
    return U || (Y = Ib(h, s), U = !0), Y;
  }, lt = r, St = lt.implementation, It = lt.createNodeIterator, _t = lt.createDocumentFragment, Et = lt.getElementsByTagName, Bt = i.importNode;
  let ot = su();
  t.isSupported = typeof Pf == "function" && typeof C == "function" && St && St.createHTMLDocument !== void 0;
  const Lt = Sb, Nt = Tb, Ft = _b, oe = Bb, Vt = vb, He = Lb, pr = Ab, Oe = Fb;
  let Ar = eu, Ht = null;
  const we = Pt({}, [
    ...Zc,
    ...cn,
    ...un,
    ...dn,
    ...Qc
  ]);
  let zt = null;
  const gr = Pt({}, [
    ...Jc,
    ...fn,
    ...tu,
    ...wo
  ]);
  let le = Object.seal(Ai(null, {
    tagNameCheck: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: null
    },
    attributeNameCheck: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: null
    },
    allowCustomizedBuiltInElements: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: !1
    }
  })), $e = null, Er = null;
  const Jt = Object.seal(Ai(null, {
    tagCheck: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: null
    },
    attributeCheck: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: null
    }
  }));
  let Fr = !0, Je = !0, mr = !1, yr = !0, g = !1, M = !0, z = !1, G = !1, q = null, it = null, S = !1, O = !1, J = !1, j = !1, V = !0, rt = !1;
  const tt = "user-content-";
  let ut = !0, nt = !1, pt = null, mt = {}, At = null;
  const Ut = Pt({}, [
    "annotation-xml",
    "audio",
    "colgroup",
    "desc",
    "foreignobject",
    "head",
    "iframe",
    "math",
    "mi",
    "mn",
    "mo",
    "ms",
    "mtext",
    "noembed",
    "noframes",
    "noscript",
    "plaintext",
    "script",
    "selectedcontent",
    "style",
    "svg",
    "template",
    "thead",
    "title",
    "video",
    "xmp"
  ]);
  let fs = null;
  const Mr = Pt({}, [
    "audio",
    "video",
    "img",
    "source",
    "image",
    "track"
  ]);
  let Or = null;
  const Sc = Pt({}, [
    "alt",
    "class",
    "for",
    "id",
    "label",
    "name",
    "pattern",
    "placeholder",
    "role",
    "summary",
    "title",
    "value",
    "style",
    "xmlns"
  ]), fo = "http://www.w3.org/1998/Math/MathML", po = "http://www.w3.org/2000/svg", tr = "http://www.w3.org/1999/xhtml";
  let Ci = tr, za = !1, Ha = null;
  const Cx = Pt({}, [
    fo,
    po,
    tr
  ], hn), Tc = ne([
    "mi",
    "mo",
    "mn",
    "ms",
    "mtext"
  ]);
  let Ya = Pt({}, Tc);
  const _c = ne(["annotation-xml"]);
  let Ua = Pt({}, _c);
  const bx = Pt({}, [
    "title",
    "style",
    "font",
    "a",
    "script"
  ]);
  let ps = null;
  const kx = ["application/xhtml+xml", "text/html"], wx = "text/html";
  let Zt = null, bi = null;
  const Sx = r.createElement("form"), Bc = function(T) {
    return T instanceof RegExp || T instanceof Function;
  }, Xa = function() {
    let T = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    if (bi && bi === T) return;
    (!T || typeof T != "object") && (T = {}), T = Fe(T), ps = kx.indexOf(T.PARSER_MEDIA_TYPE) === -1 ? wx : T.PARSER_MEDIA_TYPE, Zt = ps === "application/xhtml+xml" ? hn : Jr, Ht = Dr(T, "ALLOWED_TAGS", we, { transform: Zt }), zt = Dr(T, "ALLOWED_ATTR", gr, { transform: Zt }), Ha = Dr(T, "ALLOWED_NAMESPACES", Cx, { transform: hn }), Or = Dr(T, "ADD_URI_SAFE_ATTR", Sc, {
      transform: Zt,
      base: Sc
    }), fs = Dr(T, "ADD_DATA_URI_TAGS", Mr, {
      transform: Zt,
      base: Mr
    }), At = Dr(T, "FORBID_CONTENTS", Ut, { transform: Zt }), $e = Dr(T, "FORBID_TAGS", Fe({}), { transform: Zt }), Er = Dr(T, "FORBID_ATTR", Fe({}), { transform: Zt }), mt = Be(T, "USE_PROFILES") ? T.USE_PROFILES && typeof T.USE_PROFILES == "object" ? Fe(T.USE_PROFILES) : T.USE_PROFILES : !1, Fr = T.ALLOW_ARIA_ATTR !== !1, Je = T.ALLOW_DATA_ATTR !== !1, mr = T.ALLOW_UNKNOWN_PROTOCOLS || !1, yr = T.ALLOW_SELF_CLOSE_IN_ATTR !== !1, g = T.SAFE_FOR_TEMPLATES || !1, M = T.SAFE_FOR_XML !== !1, z = T.WHOLE_DOCUMENT || !1, O = T.RETURN_DOM || !1, J = T.RETURN_DOM_FRAGMENT || !1, j = T.RETURN_TRUSTED_TYPE || !1, S = T.FORCE_BODY || !1, V = T.SANITIZE_DOM !== !1, rt = T.SANITIZE_NAMED_PROPS || !1, ut = T.KEEP_CONTENT !== !1, nt = T.IN_PLACE || !1, Ar = bb(T.ALLOWED_URI_REGEXP) ? T.ALLOWED_URI_REGEXP : eu, Ci = typeof T.NAMESPACE == "string" ? T.NAMESPACE : tr, Ya = gn(T, "MATHML_TEXT_INTEGRATION_POINTS", () => Pt({}, Tc)), Ua = gn(T, "HTML_INTEGRATION_POINTS", () => Pt({}, _c));
    const E = gn(T, "CUSTOM_ELEMENT_HANDLING", () => Ai(null));
    if (le = Ai(null), Be(E, "tagNameCheck") && Bc(E.tagNameCheck) && (le.tagNameCheck = E.tagNameCheck), Be(E, "attributeNameCheck") && Bc(E.attributeNameCheck) && (le.attributeNameCheck = E.attributeNameCheck), Be(E, "allowCustomizedBuiltInElements") && typeof E.allowCustomizedBuiltInElements == "boolean" && (le.allowCustomizedBuiltInElements = E.allowCustomizedBuiltInElements), de(le), g && (Je = !1), J && (O = !0), mt && (Ht = Pt({}, Qc), zt = Ai(null), mt.html === !0 && (Pt(Ht, Zc), Pt(zt, Jc)), mt.svg === !0 && (Pt(Ht, cn), Pt(zt, fn), Pt(zt, wo)), mt.svgFilters === !0 && (Pt(Ht, un), Pt(zt, fn), Pt(zt, wo)), mt.mathMl === !0 && (Pt(Ht, dn), Pt(zt, tu), Pt(zt, wo))), Jt.tagCheck = null, Jt.attributeCheck = null, Be(T, "ADD_TAGS") && (typeof T.ADD_TAGS == "function" ? Jt.tagCheck = T.ADD_TAGS : Ii(T.ADD_TAGS) && (Ht === we && (Ht = Fe(Ht)), Pt(Ht, T.ADD_TAGS, Zt))), Be(T, "ADD_ATTR") && (typeof T.ADD_ATTR == "function" ? Jt.attributeCheck = T.ADD_ATTR : Ii(T.ADD_ATTR) && (zt === gr && (zt = Fe(zt)), Pt(zt, T.ADD_ATTR, Zt))), Be(T, "ADD_FORBID_CONTENTS") && Ii(T.ADD_FORBID_CONTENTS) && (At === Ut && (At = Fe(At)), Pt(At, T.ADD_FORBID_CONTENTS, Zt)), ut && (Ht["#text"] = !0), z && Pt(Ht, [
      "html",
      "head",
      "body"
    ]), Ht.table && (Pt(Ht, ["tbody"]), delete $e.tbody), T.TRUSTED_TYPES_POLICY) {
      if (typeof T.TRUSTED_TYPES_POLICY.createHTML != "function") throw br('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');
      if (typeof T.TRUSTED_TYPES_POLICY.createScriptURL != "function") throw br('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');
      const K = D;
      D = T.TRUSTED_TYPES_POLICY;
      try {
        st = N("");
      } catch (Z) {
        throw D = K, Z;
      }
    } else T.TRUSTED_TYPES_POLICY === null ? (D = void 0, st = "") : (D === void 0 && (D = gt()), D && typeof st == "string" && (st = N("")));
    ne && ne(T), bi = T;
  }, vc = Pt({}, [
    ...cn,
    ...un,
    ...kb
  ]), Lc = Pt({}, [...dn, ...wb]), Tx = function(T, E, K) {
    return E.namespaceURI === tr ? T === "svg" : E.namespaceURI === fo ? T === "svg" && (K === "annotation-xml" || Ya[K]) : !!vc[T];
  }, _x = function(T, E, K) {
    return E.namespaceURI === tr ? T === "math" : E.namespaceURI === po ? T === "math" && Ua[K] : !!Lc[T];
  }, Bx = function(T, E, K) {
    return E.namespaceURI === po && !Ua[K] || E.namespaceURI === fo && !Ya[K] ? !1 : !Lc[T] && (bx[T] || !vc[T]);
  }, vx = function(T) {
    const E = H(T), K = Jr(L(T)), Z = C(T);
    let Ct, wt;
    return Z && v(Z) === te.element ? (Ct = { namespaceURI: H(Z) }, wt = Jr(L(Z))) : (Ct = { namespaceURI: Ci }, wt = "template"), Ha[E] ? E === po ? Tx(K, Ct, wt) : E === fo ? _x(K, Ct, wt) : E === tr ? Bx(K, Ct, wt) : !!(ps === "application/xhtml+xml" && Ha[E]) : !1;
  }, $r = function(T) {
    xs(t.removed, { element: T });
    try {
      C(T).removeChild(T);
    } catch {
      if (f(T), !C(T)) throw br("a node selected for removal could not be detached from its tree and cannot be safely returned; refusing to sanitize in place");
    }
  }, Ac = function(T, E, K) {
    try {
      m(T, E);
    } catch {
      try {
        T.removeAttribute(K);
      } catch {
      }
    }
  }, ja = function(T) {
    Va(T);
    const E = x(T);
    E && Cr(db(E), (Z) => {
      try {
        f(Z);
      } catch {
      }
    });
    const K = v(T) === te.element ? w(T) : null;
    if (K) for (let Z = K.length - 1; Z >= 0; --Z) {
      const Ct = K[Z], wt = Ct && Ct.name;
      typeof wt == "string" && Ac(T, Ct, wt);
    }
  }, ki = function(T, E, K) {
    if (!K) try {
      K = E.getAttributeNode(T);
    } catch {
      K = null;
    }
    xs(t.removed, {
      attribute: K || null,
      from: E
    });
    try {
      K ? m(E, K) : E.removeAttribute(T);
    } catch {
      try {
        E.removeAttribute(T);
      } catch {
      }
    }
    if (T === "is")
      if (O || J) try {
        $r(E);
      } catch {
      }
      else try {
        E.setAttribute(T, "");
      } catch {
      }
  }, Ec = function(T) {
    const E = w(T);
    if (E)
      for (let K = E.length - 1; K >= 0; --K) {
        const Z = E[K], Ct = Z && Z.name;
        typeof Ct != "string" || zt[Zt(Ct)] || Ac(T, Z, Ct);
      }
  }, Ga = function(T, E) {
    let K = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : !1;
    const Z = [T];
    for (; Z.length > 0; ) {
      const Ct = Z.pop();
      if (E(Ct) === !1) continue;
      if (K && v(Ct) === te.element) {
        const Ot = b(Ct);
        Ir(Ot) && Z.push(Ot);
      }
      const wt = x(Ct);
      if (wt) for (let Ot = wt.length - 1; Ot >= 0; --Ot) Z.push(wt[Ot]);
    }
  }, Va = function(T) {
    Ga(T, (E) => {
      v(E) === te.element && Ec(E);
    });
  }, Ka = function(T) {
    const E = [];
    return Ga(T, (K) => {
      E.push(K);
    }, !0), E;
  }, Lx = function(T, E) {
    const K = nn();
    Cr(Ka(T), (Z) => {
      v(Z) === te.element && ln(K, Z);
    }), Cr(E, (Z) => {
      v(Z) === te.element && !Cs(K, Z) && Ec(Z);
    });
  }, Fc = function(T, E) {
    let K = !1;
    return Cr(t.removed, (Z) => {
      Z.element && (K = K || Z.element === T, Va(Z.element));
    }), Lx(T, E), K;
  }, Ax = 8, Ex = function(T, E) {
    const K = pt;
    let Z = null;
    const Ct = () => (Z || (Z = nn(), Cr(E, (wt) => {
      ln(Z, wt);
    })), Z);
    for (let wt = 0; ; wt++) {
      const Ot = Ka(T), ie = [T];
      let er = !1;
      if (Cr(Ot, (Ce) => {
        v(Ce) === te.documentFragment ? xs(ie, Ce) : !er && !Cs(K, Ce) && (er = Cs(Ct(), Ce));
      }), !er) return;
      if (wt >= Ax) throw br("the tree kept changing during in-place sanitization; refusing to return it");
      Cr(ie, (Ce, Se) => {
        Fx(Ce, Se > 0, T, Ct());
      });
    }
  }, Fx = function(T, E, K, Z) {
    const Ct = Za(T);
    let wt;
    for (; wt = Ct.nextNode(); )
      !Cs(Z, wt) || Cs(pt, wt) || (E && Ye(ot.uponSanitizeShadowNode, wt, null), Ja(wt, K), tn(wt, K), Ir(wt.content) && ms(wt.content));
  }, Mx = function(T) {
    pt && ln(pt, T);
  }, Mc = function(T, E) {
    return M ? T === "patchsrc" ? !0 : T === "for" && E !== "label" && E !== "output" : !1;
  }, Ox = function(T) {
    M && Ga(T, (E) => {
      const K = v(E);
      if (K === te.processingInstruction || K === te.comment && ce(ru, E.data)) {
        try {
          f(E);
        } catch {
        }
        return !1;
      }
      if (K === te.element) {
        const Z = E, Ct = Zt(L(E));
        try {
          Z.hasAttribute && Z.hasAttribute("patchsrc") && Z.removeAttribute("patchsrc"), Z.hasAttribute && Z.hasAttribute("for") && Mc("for", Ct) && Z.removeAttribute("for");
        } catch {
        }
      }
      return !0;
    });
  }, Oc = function(T) {
    let E = null, K = null;
    if (S) T = "<remove></remove>" + T;
    else {
      const wt = jc(T, /^[\r\n\t ]+/);
      K = wt && wt[0];
    }
    ps === "application/xhtml+xml" && Ci === tr && (T = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + T + "</body></html>");
    const Z = D ? N(T) : T;
    if (Ci === tr) try {
      E = new c().parseFromString(Z, ps);
    } catch {
    }
    if (!E || !E.documentElement) {
      E = St.createDocument(Ci, "template", null);
      try {
        E.documentElement.innerHTML = za ? st : Z;
      } catch {
      }
    }
    const Ct = E.body || E.documentElement;
    return T && K && Ct.insertBefore(r.createTextNode(K), Ct.childNodes[0] || null), Ci === tr ? Et.call(E, z ? "html" : "body")[0] : z ? E.documentElement : Ct;
  }, Za = function(T) {
    const E = A ? A(T) : T.ownerDocument;
    return It.call(E || T, T, l.SHOW_ELEMENT | l.SHOW_COMMENT | l.SHOW_TEXT | l.SHOW_PROCESSING_INSTRUCTION | l.SHOW_CDATA_SECTION, null);
  }, go = function(T) {
    return T = bs(T, Lt, " "), T = bs(T, Nt, " "), T = bs(T, Ft, " "), T;
  }, Qa = function(T) {
    var E;
    $c(T);
    const K = (E = T.querySelectorAll) === null || E === void 0 ? void 0 : E.call(T, "template");
    K && Cr(K, (Z) => {
      Ir(Z.content) && Qa(Z.content);
    });
  }, $c = function(T) {
    T.normalize();
    const E = A ? A(T) : T.ownerDocument, K = It.call(E || T, T, l.SHOW_TEXT | l.SHOW_COMMENT | l.SHOW_CDATA_SECTION | l.SHOW_PROCESSING_INSTRUCTION, null);
    let Z = K.nextNode();
    for (; Z; )
      Z.data = go(Z.data), Z = K.nextNode();
  }, mo = function(T) {
    const E = B ? B(T) : null;
    return typeof E != "string" || Zt(E) !== "form" ? !1 : typeof T.nodeName != "string" || typeof T.textContent != "string" || typeof T.removeChild != "function" || T.attributes !== w(T) || typeof T.removeAttribute != "function" || typeof T.removeAttributeNode != "function" || typeof T.getAttributeNode != "function" || typeof T.setAttribute != "function" || typeof T.namespaceURI != "string" || typeof T.insertBefore != "function" || typeof T.hasChildNodes != "function" || T.nodeType !== _(T) || T.childNodes !== x(T);
  }, Ir = function(T) {
    if (!_ || typeof T != "object" || T === null) return !1;
    try {
      return _(T) === te.documentFragment;
    } catch {
      return !1;
    }
  }, gs = function(T) {
    if (!_ || typeof T != "object" || T === null) return !1;
    try {
      return typeof _(T) == "number";
    } catch {
      return !1;
    }
  };
  function Ye(et, T, E) {
    et.length !== 0 && Cr(et, (K) => {
      K.call(t, T, E, bi);
    });
  }
  const $x = function(T, E) {
    return !!(M && T.hasChildNodes() && !gs(T.firstElementChild) && ce(pn, T.textContent) && ce(pn, T.innerHTML) || M && Ob[E] && v(T) === te.element && H(T) === tr && (gs(T.firstElementChild) || typeof T.textContent == "string" && ce(pn, T.textContent)) || T.nodeType === te.processingInstruction || M && T.nodeType === te.comment && ce(ru, T.data));
  }, yo = function(T, E) {
    if (T instanceof RegExp) return ce(T, E);
    if (T instanceof Function) {
      for (var K = arguments.length, Z = new Array(K > 2 ? K - 2 : 0), Ct = 2; Ct < K; Ct++) Z[Ct - 2] = arguments[Ct];
      return !!T(E, ...Z);
    }
    return !1;
  }, Ix = function(T, E, K) {
    if (!$e[E] && Rc(E) && yo(le.tagNameCheck, E)) return !1;
    if (ut && !At[E] && !At[Jr(E)]) {
      const Z = C(T), Ct = x(T);
      if (Ct && Z) {
        const wt = Ct.length;
        for (let Ot = wt - 1; Ot >= 0; --Ot) {
          const ie = T === K ? d(Ct[Ot], !0) : Ct[Ot];
          Z.insertBefore(ie, y(T));
        }
      }
    }
    return $r(T), !0;
  }, Ic = function(T, E, K, Z) {
    return T.length === 0 ? E : E === K || E === Z ? Fe(E) : E;
  }, wi = function(T, E) {
    return T === E || C(T) !== null ? !1 : (nt && Va(T), !0);
  }, Ja = function(T, E) {
    if (Mx(T), Ye(ot.beforeSanitizeElements, T, null), wi(T, E)) return !0;
    if (mo(T))
      return $r(T), !0;
    const K = Zt(L(T));
    if (Ht = Ic(ot.uponSanitizeElement, Ht, we, q), Ye(ot.uponSanitizeElement, T, {
      tagName: K,
      allowedTags: Ht
    }), wi(T, E)) return !0;
    if ($x(T, K))
      return $r(T), !0;
    if ($e[K] || !(Jt.tagCheck instanceof Function && Jt.tagCheck(K)) && !Ht[K]) {
      const Z = Ix(T, K, E);
      return Z === !1 && (Ye(ot.afterSanitizeElements, T, null), wi(T, E)) ? !0 : Z;
    }
    if (v(T) === te.element && !vx(T) || (K === "noscript" || K === "noembed" || K === "noframes") && ce(Mb, T.innerHTML))
      return $r(T), !0;
    if (g && T.nodeType === te.text) {
      const Z = go(T.textContent);
      T.textContent !== Z && (xs(t.removed, { element: T.cloneNode() }), T.textContent = Z);
    }
    return Ye(ot.afterSanitizeElements, T, null), wi(T, E);
  }, Dc = function(T, E, K) {
    if (Er[E] || Mc(E, T) || V && (E === "id" || E === "name") && (K in r || K in Sx)) return !1;
    const Z = zt[E] || Jt.attributeCheck instanceof Function && Jt.attributeCheck(E, T);
    return Je && ce(oe, E) || Fr && ce(Vt, E) ? !0 : Z ? Or[E] || ce(Ar, bs(K, pr, "")) || (E === "src" || E === "xlink:href" || E === "href") && T !== "script" && Gc(K, "data:") === 0 && fs[T] || mr && !ce(He, bs(K, pr, "")) ? !0 : !K : Rc(T) && yo(le.tagNameCheck, T) && yo(le.attributeNameCheck, E, T) || E === "is" && le.allowCustomizedBuiltInElements && yo(le.tagNameCheck, K);
  }, Dx = Pt({}, [
    "annotation-xml",
    "color-profile",
    "font-face",
    "font-face-format",
    "font-face-name",
    "font-face-src",
    "font-face-uri",
    "missing-glyph"
  ]), Rc = function(T) {
    return !Dx[Jr(T)] && ce(Oe, T);
  }, Rx = function(T, E, K, Z) {
    if (D && typeof h == "object" && typeof h.getAttributeType == "function" && !K) switch (h.getAttributeType(T, E)) {
      case "TrustedHTML":
        return N(Z);
      case "TrustedScriptURL":
        return X(Z);
    }
    return Z;
  }, Px = function(T, E, K, Z) {
    try {
      return K ? T.setAttributeNS(K, E, Z) : T.setAttribute(E, Z), mo(T) ? ($r(T), !1) : !0;
    } catch {
      return ki(E, T), !1;
    }
  }, Pc = function(T, E) {
    return M && ce(/((--!?|])>)|<\/(style|script|title|xmp|textarea|noscript|iframe|noembed|noframes)/i, E) ? !0 : Jr(T) === "attributename" && jc(E, "href") !== null;
  }, tn = function(T, E) {
    if (Ye(ot.beforeSanitizeAttributes, T, null), wi(T, E)) return;
    const K = T.attributes;
    if (!K || mo(T)) return;
    zt = Ic(ot.uponSanitizeAttribute, zt, gr, it);
    const Z = {
      attrName: "",
      attrValue: "",
      keepAttr: !0,
      allowedAttributes: zt,
      forceKeepAttr: void 0
    };
    let Ct = K.length;
    const wt = Zt(T.nodeName);
    for (; Ct--; ) {
      const Ot = K[Ct], ie = Ot.name, er = Ot.namespaceURI, Ce = Ot.value, Se = Zt(ie), Si = Ce;
      let Te = ie === "value" ? Si : pb(Si), Nc = !1;
      if (Z.attrName = Se, Z.attrValue = Te, Z.keepAttr = !0, Z.forceKeepAttr = void 0, Ye(ot.uponSanitizeAttribute, T, Z), Te = Z.attrValue, rt && (Se === "id" || Se === "name") && Gc(Te, tt) !== 0 && (ki(ie, T, Ot), Te = tt + Te, Nc = !0), Pc(ie, Te)) {
        ki(ie, T, Ot);
        continue;
      }
      if (!Z.forceKeepAttr) {
        if (!Z.keepAttr) {
          ki(ie, T, Ot);
          continue;
        }
        if (!yr && ce(iu, Te)) {
          ki(ie, T, Ot);
          continue;
        }
        if (g && (Te = go(Te)), !Dc(wt, Se, Te)) {
          ki(ie, T, Ot);
          continue;
        }
        Te = Rx(wt, Se, er, Te), Te !== Si && Px(T, ie, er, Te) && Nc && Xc(t.removed);
      }
    }
    Ye(ot.afterSanitizeAttributes, T, null), wi(T, E);
  }, ms = function(T) {
    let E = null;
    const K = Za(T);
    for (Ye(ot.beforeSanitizeShadowDOM, T, null); E = K.nextNode(); )
      if (Ye(ot.uponSanitizeShadowNode, E, null), Ja(E, T), tn(E, T), Ir(E.content) && ms(E.content), v(E) === te.element) {
        const Z = b(E);
        Ir(Z) && (en(Z), ms(Z));
      }
    g && $c(T), Ye(ot.afterSanitizeShadowDOM, T, null);
  }, en = function(T) {
    const E = [{
      node: T,
      shadow: null
    }];
    for (; E.length > 0; ) {
      const K = E.pop();
      if (K.shadow) {
        ms(K.shadow);
        continue;
      }
      const Z = K.node, Ct = v(Z) === te.element, wt = x(Z);
      if (wt) for (let Ot = wt.length - 1; Ot >= 0; --Ot) E.push({
        node: wt[Ot],
        shadow: null
      });
      if (Ct) {
        const Ot = B ? B(Z) : null;
        if (typeof Ot == "string" && Zt(Ot) === "template") {
          const ie = Z.content;
          Ir(ie) && E.push({
            node: ie,
            shadow: null
          });
        }
      }
      if (Ct) {
        const Ot = b(Z);
        Ir(Ot) && E.push({
          node: null,
          shadow: Ot
        }, {
          node: Ot,
          shadow: null
        });
      }
    }
  };
  return t.sanitize = function(et) {
    let T = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, E = null, K = null, Z = null, Ct = null;
    if (za = !et, za && (et = "<!-->"), typeof et != "string" && !gs(et) && (et = xb(et), typeof et != "string"))
      throw br("dirty is not a string, aborting");
    if (!t.isSupported) return et;
    G ? (Ht = q, zt = it) : Xa(T), (ot.uponSanitizeElement.length > 0 || ot.uponSanitizeAttribute.length > 0) && (Ht = Fe(Ht)), ot.uponSanitizeAttribute.length > 0 && (zt = Fe(zt)), t.removed = [];
    const wt = nt && typeof et != "string" && gs(et);
    let Ot = [];
    const ie = pt;
    if (wt) {
      Ox(et);
      const Se = L(et);
      if (typeof Se == "string") {
        const Si = Zt(Se);
        if (!Ht[Si] || $e[Si])
          throw ja(et), br("root node is forbidden and cannot be sanitized in-place");
      }
      if (mo(et))
        throw ja(et), br("root node is clobbered and cannot be sanitized in-place");
      Ot = Ka(et), pt = nn();
    } else if (gs(et))
      E = Oc("<!---->"), K = E.ownerDocument.importNode(et, !0), K.nodeType === te.element && K.nodeName === "BODY" || K.nodeName === "HTML" ? E = K : E.appendChild(K), en(E);
    else {
      if (!O && !g && !z && et.indexOf("<") === -1) return D && j ? N(et) : et;
      if (E = Oc(et), !E) return O ? null : j ? st : "";
    }
    E && S && $r(E.firstChild);
    const er = wt ? et : E;
    try {
      wt && en(et);
      const Se = Za(er);
      for (; Z = Se.nextNode(); )
        Ja(Z, er), tn(Z, er), Ir(Z.content) && ms(Z.content);
      wt && Ex(et, Ot);
    } catch (Se) {
      throw wt && (ja(et), Fc(et, Ot)), Se;
    } finally {
      pt = ie;
    }
    if (wt) {
      if (Fc(et, Ot)) throw br("a node selected for removal could not be safely returned; refusing to sanitize in place");
      return g && Qa(et), et;
    }
    if (O) {
      if (g && Qa(E), J)
        for (Ct = _t.call(E.ownerDocument); E.firstChild; ) Ct.appendChild(E.firstChild);
      else Ct = E;
      return (zt.shadowroot || zt.shadowrootmode) && (Ct = Bt.call(i, Ct, !0)), Ct;
    }
    let Ce = z ? E.outerHTML : E.innerHTML;
    return z && Ht["!doctype"] && E.ownerDocument && E.ownerDocument.doctype && E.ownerDocument.doctype.name && ce(Eb, E.ownerDocument.doctype.name) && (Ce = "<!DOCTYPE " + E.ownerDocument.doctype.name + `>
` + Ce), g && (Ce = go(Ce)), D && j ? N(Ce) : Ce;
  }, t.setConfig = function() {
    let et = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    Xa(et), G = !0, q = Ht, it = zt;
  }, t.clearConfig = function() {
    bi = null, G = !1, q = null, it = null, D = Y, st = "";
  }, t.isValidAttribute = function(et, T, E) {
    bi || Xa({});
    const K = Zt(et), Z = Zt(T);
    return typeof E == "string" && (Pc(T, E) || !yr && ce(iu, E)) ? !1 : Dc(K, Z, E);
  }, t.addHook = function(et, T) {
    typeof T == "function" && Be(ot, et) && xs(ot[et], T);
  }, t.removeHook = function(et, T) {
    if (Be(ot, et)) {
      if (T !== void 0) {
        const E = ub(ot[et], T);
        return E === -1 ? void 0 : fb(ot[et], E, 1)[0];
      }
      return Xc(ot[et]);
    }
  }, t.removeHooks = function(et) {
    Be(ot, et) && (ot[et] = []);
  }, t.removeAllHooks = function() {
    ot = su();
  }, t;
}
var ts = Hf(), cl = /* @__PURE__ */ p((e, t, { depth: r = 2 } = {}) => {
  const i = { depth: r };
  if (Array.isArray(t) && !Array.isArray(e))
    return t.forEach((s) => cl(e, s, i)), e;
  if (Array.isArray(t) && Array.isArray(e))
    return t.forEach((s) => {
      e.includes(s) || e.push(s);
    }), e;
  if (e == null || r <= 0)
    return e != null && typeof e == "object" && typeof t == "object" ? Object.assign(e, t) : t;
  if (t != null && typeof e == "object" && typeof t == "object") {
    const s = e;
    Object.entries(t).forEach(([o, a]) => {
      if (typeof a == "object") {
        if (a === null)
          return;
        Object.hasOwn(e, o) || Object.defineProperty(e, o, {
          value: void 0,
          writable: !0,
          enumerable: !0,
          configurable: !0
        }), s[o] === void 0 && (s[o] = Array.isArray(a) ? [] : {}), typeof s[o] == "object" && (s[o] = cl(s[o], a, { depth: r - 1 }));
      } else typeof s[o] != "object" && (Object.hasOwn(e, o) ? s[o] = a : Object.defineProperty(e, o, {
        value: a,
        writable: !0,
        enumerable: !0,
        configurable: !0
      }));
    });
  }
  return e;
}, "assignWithDepth"), ae = cl, hr = "#ffffff", cr = "#f2f2f2", kt = /* @__PURE__ */ p((e, t) => t ? k(e, { s: -40, l: 10 }) : k(e, { s: -40, l: -10 }), "mkBorder"), Pi, Db = (Pi = class {
  constructor() {
    this.background = "#f4f4f4", this.primaryColor = "#fff4dd", this.noteBkgColor = "#fff5ad", this.noteTextColor = "#333", this.THEME_COLOR_LIMIT = 12, this.radius = 5, this.strokeWidth = 1, this.fontFamily = '"trebuchet ms", verdana, arial, sans-serif', this.fontSize = "16px", this.useGradient = !0, this.dropShadow = "drop-shadow( 1px 2px 2px rgba(185,185,185,1))";
  }
  updateColors() {
    if (this.primaryTextColor = this.primaryTextColor || (this.darkMode ? "#eee" : "#333"), this.secondaryColor = this.secondaryColor || k(this.primaryColor, { h: -120 }), this.tertiaryColor = this.tertiaryColor || k(this.primaryColor, { h: 180, l: 5 }), this.primaryBorderColor = this.primaryBorderColor || kt(this.primaryColor, this.darkMode), this.secondaryBorderColor = this.secondaryBorderColor || kt(this.secondaryColor, this.darkMode), this.tertiaryBorderColor = this.tertiaryBorderColor || kt(this.tertiaryColor, this.darkMode), this.noteBorderColor = this.noteBorderColor || kt(this.noteBkgColor, this.darkMode), this.noteBkgColor = this.noteBkgColor || "#fff5ad", this.noteTextColor = this.noteTextColor || "#333", this.secondaryTextColor = this.secondaryTextColor || F(this.secondaryColor), this.tertiaryTextColor = this.tertiaryTextColor || F(this.tertiaryColor), this.lineColor = this.lineColor || F(this.background), this.arrowheadColor = this.arrowheadColor || F(this.background), this.textColor = this.textColor || this.primaryTextColor, this.border2 = this.border2 || this.tertiaryBorderColor, this.nodeBkg = this.nodeBkg || this.primaryColor, this.mainBkg = this.mainBkg || this.primaryColor, this.nodeBorder = this.nodeBorder || this.primaryBorderColor, this.clusterBkg = this.clusterBkg || this.tertiaryColor, this.clusterBorder = this.clusterBorder || this.tertiaryBorderColor, this.defaultLinkColor = this.defaultLinkColor || this.lineColor, this.titleColor = this.titleColor || this.tertiaryTextColor, this.edgeLabelBackground = this.edgeLabelBackground || (this.darkMode ? P(this.secondaryColor, 30) : this.secondaryColor), this.nodeTextColor = this.nodeTextColor || this.primaryTextColor, this.actorBorder = this.actorBorder || this.primaryBorderColor, this.actorBkg = this.actorBkg || this.mainBkg, this.actorTextColor = this.actorTextColor || this.primaryTextColor, this.actorLineColor = this.actorLineColor || this.actorBorder, this.labelBoxBkgColor = this.labelBoxBkgColor || this.actorBkg, this.signalColor = this.signalColor || this.textColor, this.signalTextColor = this.signalTextColor || this.textColor, this.labelBoxBorderColor = this.labelBoxBorderColor || this.actorBorder, this.labelTextColor = this.labelTextColor || this.actorTextColor, this.loopTextColor = this.loopTextColor || this.actorTextColor, this.activationBorderColor = this.activationBorderColor || P(this.secondaryColor, 10), this.activationBkgColor = this.activationBkgColor || this.secondaryColor, this.sequenceNumberColor = this.sequenceNumberColor || F(this.lineColor), this.rectBkgColor = this.rectBkgColor || this.tertiaryColor, this.sectionBkgColor = this.sectionBkgColor || this.tertiaryColor, this.altSectionBkgColor = this.altSectionBkgColor || "white", this.sectionBkgColor = this.sectionBkgColor || this.secondaryColor, this.sectionBkgColor2 = this.sectionBkgColor2 || this.primaryColor, this.excludeBkgColor = this.excludeBkgColor || "#eeeeee", this.taskBorderColor = this.taskBorderColor || this.primaryBorderColor, this.taskBkgColor = this.taskBkgColor || this.primaryColor, this.activeTaskBorderColor = this.activeTaskBorderColor || this.primaryColor, this.activeTaskBkgColor = this.activeTaskBkgColor || R(this.primaryColor, 23), this.gridColor = this.gridColor || "lightgrey", this.doneTaskBkgColor = this.doneTaskBkgColor || "lightgrey", this.doneTaskBorderColor = this.doneTaskBorderColor || "grey", this.critBorderColor = this.critBorderColor || "#ff8888", this.critBkgColor = this.critBkgColor || "red", this.todayLineColor = this.todayLineColor || "red", this.vertLineColor = this.vertLineColor || "navy", this.taskTextColor = this.taskTextColor || this.textColor, this.taskTextOutsideColor = this.taskTextOutsideColor || this.textColor, this.taskTextLightColor = this.taskTextLightColor || this.textColor, this.taskTextColor = this.taskTextColor || this.primaryTextColor, this.taskTextDarkColor = this.taskTextDarkColor || this.textColor, this.taskTextClickableColor = this.taskTextClickableColor || "#003163", this.noteFontWeight = this.noteFontWeight || "normal", this.fontWeight = this.fontWeight || "normal", this.personBorder = this.personBorder || this.primaryBorderColor, this.personBkg = this.personBkg || this.mainBkg, this.darkMode ? (this.rowOdd = this.rowOdd || P(this.mainBkg, 5) || "#ffffff", this.rowEven = this.rowEven || P(this.mainBkg, 10)) : (this.rowOdd = this.rowOdd || R(this.mainBkg, 75) || "#ffffff", this.rowEven = this.rowEven || R(this.mainBkg, 5)), this.transitionColor = this.transitionColor || this.lineColor, this.transitionLabelColor = this.transitionLabelColor || this.textColor, this.stateLabelColor = this.stateLabelColor || this.stateBkg || this.primaryTextColor, this.stateBkg = this.stateBkg || this.mainBkg, this.labelBackgroundColor = this.labelBackgroundColor || this.stateBkg, this.compositeBackground = this.compositeBackground || this.background || this.tertiaryColor, this.altBackground = this.altBackground || this.tertiaryColor, this.compositeTitleBackground = this.compositeTitleBackground || this.mainBkg, this.compositeBorder = this.compositeBorder || this.nodeBorder, this.innerEndBackground = this.nodeBorder, this.errorBkgColor = this.errorBkgColor || this.tertiaryColor, this.errorTextColor = this.errorTextColor || this.tertiaryTextColor, this.transitionColor = this.transitionColor || this.lineColor, this.specialStateColor = this.lineColor, this.cScale0 = this.cScale0 || this.primaryColor, this.cScale1 = this.cScale1 || this.secondaryColor, this.cScale2 = this.cScale2 || this.tertiaryColor, this.cScale3 = this.cScale3 || k(this.primaryColor, { h: 30 }), this.cScale4 = this.cScale4 || k(this.primaryColor, { h: 60 }), this.cScale5 = this.cScale5 || k(this.primaryColor, { h: 90 }), this.cScale6 = this.cScale6 || k(this.primaryColor, { h: 120 }), this.cScale7 = this.cScale7 || k(this.primaryColor, { h: 150 }), this.cScale8 = this.cScale8 || k(this.primaryColor, { h: 210, l: 150 }), this.cScale9 = this.cScale9 || k(this.primaryColor, { h: 270 }), this.cScale10 = this.cScale10 || k(this.primaryColor, { h: 300 }), this.cScale11 = this.cScale11 || k(this.primaryColor, { h: 330 }), this.darkMode)
      for (let r = 0; r < this.THEME_COLOR_LIMIT; r++)
        this["cScale" + r] = P(this["cScale" + r], 75);
    else
      for (let r = 0; r < this.THEME_COLOR_LIMIT; r++)
        this["cScale" + r] = P(this["cScale" + r], 25);
    for (let r = 0; r < this.THEME_COLOR_LIMIT; r++)
      this["cScaleInv" + r] = this["cScaleInv" + r] || F(this["cScale" + r]);
    for (let r = 0; r < this.THEME_COLOR_LIMIT; r++)
      this.darkMode ? this["cScalePeer" + r] = this["cScalePeer" + r] || R(this["cScale" + r], 10) : this["cScalePeer" + r] = this["cScalePeer" + r] || P(this["cScale" + r], 10);
    this.scaleLabelColor = this.scaleLabelColor || this.labelTextColor;
    for (let r = 0; r < this.THEME_COLOR_LIMIT; r++)
      this["cScaleLabel" + r] = this["cScaleLabel" + r] || this.scaleLabelColor;
    const t = this.darkMode ? -4 : -1;
    for (let r = 0; r < 5; r++)
      this["surface" + r] = this["surface" + r] || k(this.mainBkg, { h: 180, s: -15, l: t * (5 + r * 3) }), this["surfacePeer" + r] = this["surfacePeer" + r] || k(this.mainBkg, { h: 180, s: -15, l: t * (8 + r * 3) });
    this.classText = this.classText || this.textColor, this.fillType0 = this.fillType0 || this.primaryColor, this.fillType1 = this.fillType1 || this.secondaryColor, this.fillType2 = this.fillType2 || k(this.primaryColor, { h: 64 }), this.fillType3 = this.fillType3 || k(this.secondaryColor, { h: 64 }), this.fillType4 = this.fillType4 || k(this.primaryColor, { h: -64 }), this.fillType5 = this.fillType5 || k(this.secondaryColor, { h: -64 }), this.fillType6 = this.fillType6 || k(this.primaryColor, { h: 128 }), this.fillType7 = this.fillType7 || k(this.secondaryColor, { h: 128 }), this.pie1 = this.pie1 || this.primaryColor, this.pie2 = this.pie2 || this.secondaryColor, this.pie3 = this.pie3 || this.tertiaryColor, this.pie4 = this.pie4 || k(this.primaryColor, { l: -10 }), this.pie5 = this.pie5 || k(this.secondaryColor, { l: -10 }), this.pie6 = this.pie6 || k(this.tertiaryColor, { l: -10 }), this.pie7 = this.pie7 || k(this.primaryColor, { h: 60, l: -10 }), this.pie8 = this.pie8 || k(this.primaryColor, { h: -60, l: -10 }), this.pie9 = this.pie9 || k(this.primaryColor, { h: 120, l: 0 }), this.pie10 = this.pie10 || k(this.primaryColor, { h: 60, l: -20 }), this.pie11 = this.pie11 || k(this.primaryColor, { h: -60, l: -20 }), this.pie12 = this.pie12 || k(this.primaryColor, { h: 120, l: -10 }), this.pieTitleTextSize = this.pieTitleTextSize || "25px", this.pieTitleTextColor = this.pieTitleTextColor || this.taskTextDarkColor, this.pieSectionTextSize = this.pieSectionTextSize || "17px", this.pieSectionTextColor = this.pieSectionTextColor || this.textColor, this.pieLegendTextSize = this.pieLegendTextSize || "17px", this.pieLegendTextColor = this.pieLegendTextColor || this.taskTextDarkColor, this.pieStrokeColor = this.pieStrokeColor || "black", this.pieStrokeWidth = this.pieStrokeWidth || "2px", this.pieOuterStrokeWidth = this.pieOuterStrokeWidth || "2px", this.pieOuterStrokeColor = this.pieOuterStrokeColor || "black", this.pieOpacity = this.pieOpacity || "0.7", this.venn1 = this.venn1 ?? k(this.primaryColor, { l: -30 }), this.venn2 = this.venn2 ?? k(this.secondaryColor, { l: -30 }), this.venn3 = this.venn3 ?? k(this.tertiaryColor, { l: -30 }), this.venn4 = this.venn4 ?? k(this.primaryColor, { h: 60, l: -30 }), this.venn5 = this.venn5 ?? k(this.primaryColor, { h: -60, l: -30 }), this.venn6 = this.venn6 ?? k(this.secondaryColor, { h: 60, l: -30 }), this.venn7 = this.venn7 ?? k(this.primaryColor, { h: 120, l: -30 }), this.venn8 = this.venn8 ?? k(this.secondaryColor, { h: 120, l: -30 }), this.vennTitleTextColor = this.vennTitleTextColor ?? this.titleColor, this.vennSetTextColor = this.vennSetTextColor ?? this.textColor, this.cynefin = {
      domainFontSize: this.cynefin?.domainFontSize || 16,
      itemFontSize: this.cynefin?.itemFontSize || 12,
      boundaryColor: this.cynefin?.boundaryColor || this.lineColor,
      boundaryWidth: this.cynefin?.boundaryWidth || 2,
      cliffColor: this.cynefin?.cliffColor || "#8B0000",
      cliffWidth: this.cynefin?.cliffWidth || 4,
      arrowColor: this.cynefin?.arrowColor || this.lineColor,
      arrowWidth: this.cynefin?.arrowWidth || 2,
      complexBg: this.cynefin?.complexBg || "#E8F5E9",
      complicatedBg: this.cynefin?.complicatedBg || "#E3F2FD",
      chaoticBg: this.cynefin?.chaoticBg || "#FBE9E7",
      clearBg: this.cynefin?.clearBg || "#FFF8E1",
      confusionBg: this.cynefin?.confusionBg || "#F3E5F5",
      textColor: this.cynefin?.textColor || this.textColor,
      labelColor: this.cynefin?.labelColor || this.primaryTextColor
    }, this.radar = {
      axisColor: this.radar?.axisColor || this.lineColor,
      axisStrokeWidth: this.radar?.axisStrokeWidth || 2,
      axisLabelFontSize: this.radar?.axisLabelFontSize || 12,
      curveOpacity: this.radar?.curveOpacity || 0.5,
      curveStrokeWidth: this.radar?.curveStrokeWidth || 2,
      graticuleColor: this.radar?.graticuleColor || "#DEDEDE",
      graticuleStrokeWidth: this.radar?.graticuleStrokeWidth || 1,
      graticuleOpacity: this.radar?.graticuleOpacity || 0.3,
      legendBoxSize: this.radar?.legendBoxSize || 12,
      legendFontSize: this.radar?.legendFontSize || 12
    }, this.wardleyEvolutionColor = this.wardleyEvolutionColor || "#dc3545", this.wardley = {
      backgroundColor: this.wardley?.backgroundColor || this.background,
      axisColor: this.wardley?.axisColor || this.lineColor,
      axisTextColor: this.wardley?.axisTextColor || this.primaryTextColor,
      gridColor: this.wardley?.gridColor || this.gridColor,
      componentFill: this.wardley?.componentFill || this.background,
      componentStroke: this.wardley?.componentStroke || this.lineColor,
      componentLabelColor: this.wardley?.componentLabelColor || this.primaryTextColor,
      linkStroke: this.wardley?.linkStroke || this.lineColor,
      evolutionStroke: this.wardley?.evolutionStroke || this.wardleyEvolutionColor,
      annotationStroke: this.wardley?.annotationStroke || this.lineColor,
      annotationTextColor: this.wardley?.annotationTextColor || this.primaryTextColor,
      annotationFill: this.wardley?.annotationFill || this.background
    }, this.archEdgeColor = this.archEdgeColor || "#777", this.archEdgeArrowColor = this.archEdgeArrowColor || "#777", this.archEdgeWidth = this.archEdgeWidth || "3", this.archGroupBorderColor = this.archGroupBorderColor || "#000", this.archGroupBorderWidth = this.archGroupBorderWidth || "2px", this.quadrant1Fill = this.quadrant1Fill || this.primaryColor, this.quadrant2Fill = this.quadrant2Fill || k(this.primaryColor, { r: 5, g: 5, b: 5 }), this.quadrant3Fill = this.quadrant3Fill || k(this.primaryColor, { r: 10, g: 10, b: 10 }), this.quadrant4Fill = this.quadrant4Fill || k(this.primaryColor, { r: 15, g: 15, b: 15 }), this.quadrant1TextFill = this.quadrant1TextFill || this.primaryTextColor, this.quadrant2TextFill = this.quadrant2TextFill || k(this.primaryTextColor, { r: -5, g: -5, b: -5 }), this.quadrant3TextFill = this.quadrant3TextFill || k(this.primaryTextColor, { r: -10, g: -10, b: -10 }), this.quadrant4TextFill = this.quadrant4TextFill || k(this.primaryTextColor, { r: -15, g: -15, b: -15 }), this.quadrantPointFill = this.quadrantPointFill || Ke(this.quadrant1Fill) ? R(this.quadrant1Fill) : P(this.quadrant1Fill), this.quadrantPointTextFill = this.quadrantPointTextFill || this.primaryTextColor, this.quadrantXAxisTextFill = this.quadrantXAxisTextFill || this.primaryTextColor, this.quadrantYAxisTextFill = this.quadrantYAxisTextFill || this.primaryTextColor, this.quadrantInternalBorderStrokeFill = this.quadrantInternalBorderStrokeFill || this.primaryBorderColor, this.quadrantExternalBorderStrokeFill = this.quadrantExternalBorderStrokeFill || this.primaryBorderColor, this.quadrantTitleFill = this.quadrantTitleFill || this.primaryTextColor, this.xyChart = {
      backgroundColor: this.xyChart?.backgroundColor || this.background,
      titleColor: this.xyChart?.titleColor || this.primaryTextColor,
      dataLabelColor: this.xyChart?.dataLabelColor || this.primaryTextColor,
      legendTextColor: this.xyChart?.legendTextColor || this.primaryTextColor,
      xAxisTitleColor: this.xyChart?.xAxisTitleColor || this.primaryTextColor,
      xAxisLabelColor: this.xyChart?.xAxisLabelColor || this.primaryTextColor,
      xAxisTickColor: this.xyChart?.xAxisTickColor || this.primaryTextColor,
      xAxisLineColor: this.xyChart?.xAxisLineColor || this.primaryTextColor,
      yAxisTitleColor: this.xyChart?.yAxisTitleColor || this.primaryTextColor,
      yAxisLabelColor: this.xyChart?.yAxisLabelColor || this.primaryTextColor,
      yAxisTickColor: this.xyChart?.yAxisTickColor || this.primaryTextColor,
      yAxisLineColor: this.xyChart?.yAxisLineColor || this.primaryTextColor,
      plotColorPalette: this.xyChart?.plotColorPalette || "#FFF4DD,#FFD8B1,#FFA07A,#ECEFF1,#D6DBDF,#C3E0A8,#FFB6A4,#FFD74D,#738FA7,#FFFFF0"
    }, this.requirementBackground = this.requirementBackground || this.primaryColor, this.requirementBorderColor = this.requirementBorderColor || this.primaryBorderColor, this.requirementBorderSize = this.requirementBorderSize || "1", this.requirementTextColor = this.requirementTextColor || this.primaryTextColor, this.relationColor = this.relationColor || this.lineColor, this.relationLabelBackground = this.relationLabelBackground || (this.darkMode ? P(this.secondaryColor, 30) : this.secondaryColor), this.relationLabelColor = this.relationLabelColor || this.actorTextColor, this.git0 = this.git0 || this.primaryColor, this.git1 = this.git1 || this.secondaryColor, this.git2 = this.git2 || this.tertiaryColor, this.git3 = this.git3 || k(this.primaryColor, { h: -30 }), this.git4 = this.git4 || k(this.primaryColor, { h: -60 }), this.git5 = this.git5 || k(this.primaryColor, { h: -90 }), this.git6 = this.git6 || k(this.primaryColor, { h: 60 }), this.git7 = this.git7 || k(this.primaryColor, { h: 120 }), this.darkMode ? (this.git0 = R(this.git0, 25), this.git1 = R(this.git1, 25), this.git2 = R(this.git2, 25), this.git3 = R(this.git3, 25), this.git4 = R(this.git4, 25), this.git5 = R(this.git5, 25), this.git6 = R(this.git6, 25), this.git7 = R(this.git7, 25)) : (this.git0 = P(this.git0, 25), this.git1 = P(this.git1, 25), this.git2 = P(this.git2, 25), this.git3 = P(this.git3, 25), this.git4 = P(this.git4, 25), this.git5 = P(this.git5, 25), this.git6 = P(this.git6, 25), this.git7 = P(this.git7, 25)), this.gitInv0 = this.gitInv0 || F(this.git0), this.gitInv1 = this.gitInv1 || F(this.git1), this.gitInv2 = this.gitInv2 || F(this.git2), this.gitInv3 = this.gitInv3 || F(this.git3), this.gitInv4 = this.gitInv4 || F(this.git4), this.gitInv5 = this.gitInv5 || F(this.git5), this.gitInv6 = this.gitInv6 || F(this.git6), this.gitInv7 = this.gitInv7 || F(this.git7), this.branchLabelColor = this.branchLabelColor || (this.darkMode ? "black" : this.labelTextColor), this.gitBranchLabel0 = this.gitBranchLabel0 || this.branchLabelColor, this.gitBranchLabel1 = this.gitBranchLabel1 || this.branchLabelColor, this.gitBranchLabel2 = this.gitBranchLabel2 || this.branchLabelColor, this.gitBranchLabel3 = this.gitBranchLabel3 || this.branchLabelColor, this.gitBranchLabel4 = this.gitBranchLabel4 || this.branchLabelColor, this.gitBranchLabel5 = this.gitBranchLabel5 || this.branchLabelColor, this.gitBranchLabel6 = this.gitBranchLabel6 || this.branchLabelColor, this.gitBranchLabel7 = this.gitBranchLabel7 || this.branchLabelColor, this.tagLabelColor = this.tagLabelColor || this.primaryTextColor, this.tagLabelBackground = this.tagLabelBackground || this.primaryColor, this.tagLabelBorder = this.tagBorder || this.primaryBorderColor, this.tagLabelFontSize = this.tagLabelFontSize || "10px", this.commitLabelColor = this.commitLabelColor || this.secondaryTextColor, this.commitLabelBackground = this.commitLabelBackground || this.secondaryColor, this.commitLabelFontSize = this.commitLabelFontSize || "10px", this.emUiFill = this.emUiFill || "white", this.emUiStroke = this.emUiStroke || "#dbdada", this.emProcessorFill = this.emProcessorFill || "#edb3f6", this.emProcessorStroke = this.emProcessorStroke || "#b88cbf", this.emReadModelFill = this.emReadModelFill || "#d3f1a2", this.emReadModelStroke = this.emReadModelStroke || "#a3b732", this.emCommandFill = this.emCommandFill || "#bcd6fe", this.emCommandStroke = this.emCommandStroke || "#679ac3", this.emEventFill = this.emEventFill || "#ffb778", this.emEventStroke = this.emEventStroke || "#c19a0f", this.emSwimlaneBackgroundOdd = this.emSwimlaneBackgroundOdd || "rgb(250,250,250)", this.emSwimlaneBackgroundStroke = this.emSwimlaneBackgroundStroke || "rgb(240,240,240)", this.emArrowhead = this.emArrowhead || this.lineColor, this.emRelationStroke = this.emRelationStroke || this.lineColor, this.attributeBackgroundColorOdd = this.attributeBackgroundColorOdd || hr, this.attributeBackgroundColorEven = this.attributeBackgroundColorEven || cr, this.gradientStart = this.primaryBorderColor, this.gradientStop = this.secondaryBorderColor;
  }
  calculate(t) {
    if (typeof t != "object") {
      this.updateColors();
      return;
    }
    const r = Object.keys(t);
    r.forEach((i) => {
      this[i] = t[i];
    }), this.updateColors(), r.forEach((i) => {
      this[i] = t[i];
    });
  }
}, p(Pi, "Theme"), Pi), Rb = /* @__PURE__ */ p((e) => {
  const t = new Db();
  return t.calculate(e), t;
}, "getThemeVariables"), Ni, Pb = (Ni = class {
  constructor() {
    this.background = "#333", this.primaryColor = "#1f2020", this.secondaryColor = R(this.primaryColor, 16), this.tertiaryColor = k(this.primaryColor, { h: -160 }), this.primaryBorderColor = F(this.background), this.secondaryBorderColor = kt(this.secondaryColor, this.darkMode), this.tertiaryBorderColor = kt(this.tertiaryColor, this.darkMode), this.primaryTextColor = F(this.primaryColor), this.secondaryTextColor = F(this.secondaryColor), this.tertiaryTextColor = F(this.tertiaryColor), this.lineColor = F(this.background), this.textColor = F(this.background), this.mainBkg = "#1f2020", this.secondBkg = "calculated", this.mainContrastColor = "lightgrey", this.darkTextColor = R(F("#323D47"), 10), this.lineColor = "calculated", this.border1 = "#ccc", this.border2 = Hr(255, 255, 255, 0.25), this.arrowheadColor = "calculated", this.fontFamily = '"trebuchet ms", verdana, arial, sans-serif', this.fontSize = "16px", this.labelBackground = "#181818", this.textColor = "#ccc", this.THEME_COLOR_LIMIT = 12, this.radius = 5, this.strokeWidth = 1, this.nodeBkg = "calculated", this.nodeBorder = "calculated", this.clusterBkg = "calculated", this.clusterBorder = "calculated", this.defaultLinkColor = "calculated", this.titleColor = "#F9FFFE", this.edgeLabelBackground = "calculated", this.actorBorder = "calculated", this.actorBkg = "calculated", this.actorTextColor = "calculated", this.actorLineColor = "calculated", this.signalColor = "calculated", this.signalTextColor = "calculated", this.labelBoxBkgColor = "calculated", this.labelBoxBorderColor = "calculated", this.labelTextColor = "calculated", this.loopTextColor = "calculated", this.noteBorderColor = "calculated", this.noteBkgColor = "#fff5ad", this.noteTextColor = "calculated", this.activationBorderColor = "calculated", this.activationBkgColor = "calculated", this.sequenceNumberColor = "black", this.clusterBkg = "#302F3D", this.sectionBkgColor = P("#EAE8D9", 30), this.altSectionBkgColor = "calculated", this.sectionBkgColor2 = "#EAE8D9", this.excludeBkgColor = P(this.sectionBkgColor, 10), this.taskBorderColor = Hr(255, 255, 255, 70), this.taskBkgColor = "calculated", this.taskTextColor = "calculated", this.taskTextLightColor = "calculated", this.taskTextOutsideColor = "calculated", this.taskTextClickableColor = "#003163", this.activeTaskBorderColor = Hr(255, 255, 255, 50), this.activeTaskBkgColor = "#81B1DB", this.gridColor = "calculated", this.doneTaskBkgColor = "calculated", this.doneTaskBorderColor = "grey", this.critBorderColor = "#E83737", this.critBkgColor = "#E83737", this.taskTextDarkColor = "calculated", this.todayLineColor = "#DB5757", this.vertLineColor = "#00BFFF", this.personBorder = this.primaryBorderColor, this.personBkg = this.mainBkg, this.archEdgeColor = "calculated", this.archEdgeArrowColor = "calculated", this.archEdgeWidth = "3", this.archGroupBorderColor = this.primaryBorderColor, this.archGroupBorderWidth = "2px", this.rowOdd = this.rowOdd || R(this.mainBkg, 5) || "#ffffff", this.rowEven = this.rowEven || P(this.mainBkg, 10), this.labelColor = "calculated", this.errorBkgColor = "#a44141", this.errorTextColor = "#ddd", this.useGradient = !0, this.gradientStart = this.primaryBorderColor, this.gradientStop = this.secondaryBorderColor, this.dropShadow = "drop-shadow( 1px 2px 2px rgba(185,185,185,1))", this.noteFontWeight = this.noteFontWeight || "normal", this.fontWeight = this.fontWeight || "normal";
  }
  updateColors() {
    this.secondBkg = R(this.mainBkg, 16), this.lineColor = this.mainContrastColor, this.arrowheadColor = this.mainContrastColor, this.nodeBkg = this.mainBkg, this.nodeBorder = this.border1, this.clusterBkg = this.secondBkg, this.clusterBorder = this.border2, this.defaultLinkColor = this.lineColor, this.edgeLabelBackground = R(this.labelBackground, 25), this.actorBorder = this.border1, this.actorBkg = this.mainBkg, this.actorTextColor = this.mainContrastColor, this.actorLineColor = this.actorBorder, this.signalColor = this.mainContrastColor, this.signalTextColor = this.mainContrastColor, this.labelBoxBkgColor = this.actorBkg, this.labelBoxBorderColor = this.actorBorder, this.labelTextColor = this.mainContrastColor, this.loopTextColor = this.mainContrastColor, this.noteBorderColor = this.secondaryBorderColor, this.noteBkgColor = this.secondBkg, this.noteTextColor = this.secondaryTextColor, this.activationBorderColor = this.border1, this.activationBkgColor = this.secondBkg, this.rectBkgColor = this.rectBkgColor || this.tertiaryColor, this.altSectionBkgColor = this.background, this.taskBkgColor = R(this.mainBkg, 23), this.taskTextColor = this.darkTextColor, this.taskTextLightColor = this.mainContrastColor, this.taskTextOutsideColor = this.taskTextLightColor, this.gridColor = this.mainContrastColor, this.doneTaskBkgColor = this.mainContrastColor, this.taskTextDarkColor = F(this.doneTaskBkgColor), this.archEdgeColor = this.lineColor, this.archEdgeArrowColor = this.lineColor, this.transitionColor = this.transitionColor || this.lineColor, this.transitionLabelColor = this.transitionLabelColor || this.textColor, this.stateLabelColor = this.stateLabelColor || this.stateBkg || this.primaryTextColor, this.stateBkg = this.stateBkg || this.mainBkg, this.labelBackgroundColor = this.labelBackgroundColor || this.stateBkg, this.compositeBackground = this.compositeBackground || this.background || this.tertiaryColor, this.altBackground = this.altBackground || "#555", this.compositeTitleBackground = this.compositeTitleBackground || this.mainBkg, this.compositeBorder = this.compositeBorder || this.nodeBorder, this.innerEndBackground = this.primaryBorderColor, this.specialStateColor = "#f4f4f4", this.errorBkgColor = this.errorBkgColor || this.tertiaryColor, this.errorTextColor = this.errorTextColor || this.tertiaryTextColor, this.fillType0 = this.primaryColor, this.fillType1 = this.secondaryColor, this.fillType2 = k(this.primaryColor, { h: 64 }), this.fillType3 = k(this.secondaryColor, { h: 64 }), this.fillType4 = k(this.primaryColor, { h: -64 }), this.fillType5 = k(this.secondaryColor, { h: -64 }), this.fillType6 = k(this.primaryColor, { h: 128 }), this.fillType7 = k(this.secondaryColor, { h: 128 }), this.cScale1 = this.cScale1 || "#0b0000", this.cScale2 = this.cScale2 || "#4d1037", this.cScale3 = this.cScale3 || "#3f5258", this.cScale4 = this.cScale4 || "#4f2f1b", this.cScale5 = this.cScale5 || "#6e0a0a", this.cScale6 = this.cScale6 || "#3b0048", this.cScale7 = this.cScale7 || "#995a01", this.cScale8 = this.cScale8 || "#154706", this.cScale9 = this.cScale9 || "#161722", this.cScale10 = this.cScale10 || "#00296f", this.cScale11 = this.cScale11 || "#01629c", this.cScale12 = this.cScale12 || "#010029", this.cScale0 = this.cScale0 || this.primaryColor, this.cScale1 = this.cScale1 || this.secondaryColor, this.cScale2 = this.cScale2 || this.tertiaryColor, this.cScale3 = this.cScale3 || k(this.primaryColor, { h: 30 }), this.cScale4 = this.cScale4 || k(this.primaryColor, { h: 60 }), this.cScale5 = this.cScale5 || k(this.primaryColor, { h: 90 }), this.cScale6 = this.cScale6 || k(this.primaryColor, { h: 120 }), this.cScale7 = this.cScale7 || k(this.primaryColor, { h: 150 }), this.cScale8 = this.cScale8 || k(this.primaryColor, { h: 210 }), this.cScale9 = this.cScale9 || k(this.primaryColor, { h: 270 }), this.cScale10 = this.cScale10 || k(this.primaryColor, { h: 300 }), this.cScale11 = this.cScale11 || k(this.primaryColor, { h: 330 });
    for (let t = 0; t < this.THEME_COLOR_LIMIT; t++)
      this["cScaleInv" + t] = this["cScaleInv" + t] || F(this["cScale" + t]);
    for (let t = 0; t < this.THEME_COLOR_LIMIT; t++)
      this["cScalePeer" + t] = this["cScalePeer" + t] || R(this["cScale" + t], 10);
    for (let t = 0; t < 5; t++)
      this["surface" + t] = this["surface" + t] || k(this.mainBkg, { h: 30, s: -30, l: -(-10 + t * 4) }), this["surfacePeer" + t] = this["surfacePeer" + t] || k(this.mainBkg, { h: 30, s: -30, l: -(-7 + t * 4) });
    this.scaleLabelColor = this.scaleLabelColor || (this.darkMode ? "black" : this.labelTextColor);
    for (let t = 0; t < this.THEME_COLOR_LIMIT; t++)
      this["cScaleLabel" + t] = this["cScaleLabel" + t] || this.scaleLabelColor;
    for (let t = 0; t < this.THEME_COLOR_LIMIT; t++)
      this["pie" + t] = this["cScale" + t];
    this.pieTitleTextSize = this.pieTitleTextSize || "25px", this.pieTitleTextColor = this.pieTitleTextColor || this.mainContrastColor, this.pieSectionTextSize = this.pieSectionTextSize || "17px", this.pieSectionTextColor = this.pieSectionTextColor || this.textColor, this.pieLegendTextSize = this.pieLegendTextSize || "17px", this.pieLegendTextColor = this.pieLegendTextColor || this.mainContrastColor, this.pieStrokeColor = this.pieStrokeColor || "black", this.pieStrokeWidth = this.pieStrokeWidth || "2px", this.pieOuterStrokeWidth = this.pieOuterStrokeWidth || "2px", this.pieOuterStrokeColor = this.pieOuterStrokeColor || "black", this.pieOpacity = this.pieOpacity || "0.7";
    for (let t = 0; t < 8; t++)
      this["venn" + (t + 1)] = this["venn" + (t + 1)] ?? R(this["cScale" + t], 30);
    this.vennTitleTextColor = this.vennTitleTextColor ?? this.titleColor, this.vennSetTextColor = this.vennSetTextColor ?? this.textColor, this.cynefin = {
      domainFontSize: this.cynefin?.domainFontSize || 16,
      itemFontSize: this.cynefin?.itemFontSize || 12,
      boundaryColor: this.cynefin?.boundaryColor || this.lineColor,
      boundaryWidth: this.cynefin?.boundaryWidth || 2,
      cliffColor: this.cynefin?.cliffColor || "#FF6B6B",
      cliffWidth: this.cynefin?.cliffWidth || 4,
      arrowColor: this.cynefin?.arrowColor || this.lineColor,
      arrowWidth: this.cynefin?.arrowWidth || 2,
      complexBg: this.cynefin?.complexBg || "#1B5E20",
      complicatedBg: this.cynefin?.complicatedBg || "#0D47A1",
      chaoticBg: this.cynefin?.chaoticBg || "#BF360C",
      clearBg: this.cynefin?.clearBg || "#F57F17",
      confusionBg: this.cynefin?.confusionBg || "#4A148C",
      textColor: this.cynefin?.textColor || this.textColor,
      labelColor: this.cynefin?.labelColor || this.primaryTextColor
    }, this.quadrant1Fill = this.quadrant1Fill || this.primaryColor, this.quadrant2Fill = this.quadrant2Fill || k(this.primaryColor, { r: 5, g: 5, b: 5 }), this.quadrant3Fill = this.quadrant3Fill || k(this.primaryColor, { r: 10, g: 10, b: 10 }), this.quadrant4Fill = this.quadrant4Fill || k(this.primaryColor, { r: 15, g: 15, b: 15 }), this.quadrant1TextFill = this.quadrant1TextFill || this.primaryTextColor, this.quadrant2TextFill = this.quadrant2TextFill || k(this.primaryTextColor, { r: -5, g: -5, b: -5 }), this.quadrant3TextFill = this.quadrant3TextFill || k(this.primaryTextColor, { r: -10, g: -10, b: -10 }), this.quadrant4TextFill = this.quadrant4TextFill || k(this.primaryTextColor, { r: -15, g: -15, b: -15 }), this.quadrantPointFill = this.quadrantPointFill || Ke(this.quadrant1Fill) ? R(this.quadrant1Fill) : P(this.quadrant1Fill), this.quadrantPointTextFill = this.quadrantPointTextFill || this.primaryTextColor, this.quadrantXAxisTextFill = this.quadrantXAxisTextFill || this.primaryTextColor, this.quadrantYAxisTextFill = this.quadrantYAxisTextFill || this.primaryTextColor, this.quadrantInternalBorderStrokeFill = this.quadrantInternalBorderStrokeFill || this.primaryBorderColor, this.quadrantExternalBorderStrokeFill = this.quadrantExternalBorderStrokeFill || this.primaryBorderColor, this.quadrantTitleFill = this.quadrantTitleFill || this.primaryTextColor, this.xyChart = {
      backgroundColor: this.xyChart?.backgroundColor || this.background,
      titleColor: this.xyChart?.titleColor || this.primaryTextColor,
      dataLabelColor: this.xyChart?.dataLabelColor || this.primaryTextColor,
      legendTextColor: this.xyChart?.legendTextColor || this.primaryTextColor,
      xAxisTitleColor: this.xyChart?.xAxisTitleColor || this.primaryTextColor,
      xAxisLabelColor: this.xyChart?.xAxisLabelColor || this.primaryTextColor,
      xAxisTickColor: this.xyChart?.xAxisTickColor || this.primaryTextColor,
      xAxisLineColor: this.xyChart?.xAxisLineColor || this.primaryTextColor,
      yAxisTitleColor: this.xyChart?.yAxisTitleColor || this.primaryTextColor,
      yAxisLabelColor: this.xyChart?.yAxisLabelColor || this.primaryTextColor,
      yAxisTickColor: this.xyChart?.yAxisTickColor || this.primaryTextColor,
      yAxisLineColor: this.xyChart?.yAxisLineColor || this.primaryTextColor,
      plotColorPalette: this.xyChart?.plotColorPalette || "#3498db,#2ecc71,#e74c3c,#f1c40f,#bdc3c7,#ffffff,#34495e,#9b59b6,#1abc9c,#e67e22"
    }, this.packet = {
      startByteColor: this.primaryTextColor,
      endByteColor: this.primaryTextColor,
      labelColor: this.primaryTextColor,
      titleColor: this.primaryTextColor,
      blockStrokeColor: this.primaryTextColor,
      blockFillColor: this.background
    }, this.radar = {
      axisColor: this.radar?.axisColor || this.lineColor,
      axisStrokeWidth: this.radar?.axisStrokeWidth || 2,
      axisLabelFontSize: this.radar?.axisLabelFontSize || 12,
      curveOpacity: this.radar?.curveOpacity || 0.5,
      curveStrokeWidth: this.radar?.curveStrokeWidth || 2,
      graticuleColor: this.radar?.graticuleColor || "#DEDEDE",
      graticuleStrokeWidth: this.radar?.graticuleStrokeWidth || 1,
      graticuleOpacity: this.radar?.graticuleOpacity || 0.3,
      legendBoxSize: this.radar?.legendBoxSize || 12,
      legendFontSize: this.radar?.legendFontSize || 12
    }, this.wardleyEvolutionColor = this.wardleyEvolutionColor || "#ff6b6b", this.wardley = {
      backgroundColor: this.wardley?.backgroundColor || this.background,
      axisColor: this.wardley?.axisColor || this.lineColor,
      axisTextColor: this.wardley?.axisTextColor || this.primaryTextColor,
      gridColor: this.wardley?.gridColor || this.gridColor,
      componentFill: this.wardley?.componentFill || this.mainBkg,
      componentStroke: this.wardley?.componentStroke || this.lineColor,
      componentLabelColor: this.wardley?.componentLabelColor || this.primaryTextColor,
      linkStroke: this.wardley?.linkStroke || this.lineColor,
      evolutionStroke: this.wardley?.evolutionStroke || this.wardleyEvolutionColor,
      annotationStroke: this.wardley?.annotationStroke || this.lineColor,
      annotationTextColor: this.wardley?.annotationTextColor || this.primaryTextColor,
      annotationFill: this.wardley?.annotationFill || this.mainBkg
    }, this.classText = this.primaryTextColor, this.requirementBackground = this.requirementBackground || this.primaryColor, this.requirementBorderColor = this.requirementBorderColor || this.primaryBorderColor, this.requirementBorderSize = this.requirementBorderSize || "1", this.requirementTextColor = this.requirementTextColor || this.primaryTextColor, this.relationColor = this.relationColor || this.lineColor, this.relationLabelBackground = this.relationLabelBackground || (this.darkMode ? P(this.secondaryColor, 30) : this.secondaryColor), this.relationLabelColor = this.relationLabelColor || this.actorTextColor, this.git0 = R(this.secondaryColor, 20), this.git1 = R(this.pie2 || this.secondaryColor, 20), this.git2 = R(this.pie3 || this.tertiaryColor, 20), this.git3 = R(this.pie4 || k(this.primaryColor, { h: -30 }), 20), this.git4 = R(this.pie5 || k(this.primaryColor, { h: -60 }), 20), this.git5 = R(this.pie6 || k(this.primaryColor, { h: -90 }), 10), this.git6 = R(this.pie7 || k(this.primaryColor, { h: 60 }), 10), this.git7 = R(this.pie8 || k(this.primaryColor, { h: 120 }), 20), this.gitInv0 = this.gitInv0 || F(this.git0), this.gitInv1 = this.gitInv1 || F(this.git1), this.gitInv2 = this.gitInv2 || F(this.git2), this.gitInv3 = this.gitInv3 || F(this.git3), this.gitInv4 = this.gitInv4 || F(this.git4), this.gitInv5 = this.gitInv5 || F(this.git5), this.gitInv6 = this.gitInv6 || F(this.git6), this.gitInv7 = this.gitInv7 || F(this.git7), this.gitBranchLabel0 = this.gitBranchLabel0 || F(this.labelTextColor), this.gitBranchLabel1 = this.gitBranchLabel1 || this.labelTextColor, this.gitBranchLabel2 = this.gitBranchLabel2 || this.labelTextColor, this.gitBranchLabel3 = this.gitBranchLabel3 || F(this.labelTextColor), this.gitBranchLabel4 = this.gitBranchLabel4 || this.labelTextColor, this.gitBranchLabel5 = this.gitBranchLabel5 || this.labelTextColor, this.gitBranchLabel6 = this.gitBranchLabel6 || this.labelTextColor, this.gitBranchLabel7 = this.gitBranchLabel7 || this.labelTextColor, this.tagLabelColor = this.tagLabelColor || this.primaryTextColor, this.tagLabelBackground = this.tagLabelBackground || this.primaryColor, this.tagLabelBorder = this.tagBorder || this.primaryBorderColor, this.tagLabelFontSize = this.tagLabelFontSize || "10px", this.commitLabelColor = this.commitLabelColor || this.secondaryTextColor, this.commitLabelBackground = this.commitLabelBackground || this.secondaryColor, this.commitLabelFontSize = this.commitLabelFontSize || "10px", this.emUiFill = this.emUiFill || "#2d2d2d", this.emUiStroke = this.emUiStroke || "#555", this.emProcessorFill = this.emProcessorFill || R("#5a3d5c", 10), this.emProcessorStroke = this.emProcessorStroke || "#8a6d8c", this.emReadModelFill = this.emReadModelFill || R("#3d5a2d", 10), this.emReadModelStroke = this.emReadModelStroke || "#6d8c5c", this.emCommandFill = this.emCommandFill || R("#2d3d5a", 10), this.emCommandStroke = this.emCommandStroke || "#5c6d8c", this.emEventFill = this.emEventFill || R("#5a452d", 10), this.emEventStroke = this.emEventStroke || "#8c755c", this.emSwimlaneBackgroundOdd = this.emSwimlaneBackgroundOdd || R(this.background, 5), this.emSwimlaneBackgroundStroke = this.emSwimlaneBackgroundStroke || R(this.background, 12), this.emArrowhead = this.emArrowhead || this.lineColor, this.emRelationStroke = this.emRelationStroke || this.lineColor, this.attributeBackgroundColorOdd = this.attributeBackgroundColorOdd || R(this.background, 12), this.attributeBackgroundColorEven = this.attributeBackgroundColorEven || R(this.background, 2), this.nodeBorder = this.nodeBorder || "#999";
  }
  calculate(t) {
    if (typeof t != "object") {
      this.updateColors();
      return;
    }
    const r = Object.keys(t);
    r.forEach((i) => {
      this[i] = t[i];
    }), this.updateColors(), r.forEach((i) => {
      this[i] = t[i];
    });
  }
}, p(Ni, "Theme"), Ni), Nb = /* @__PURE__ */ p((e) => {
  const t = new Pb();
  return t.calculate(e), t;
}, "getThemeVariables"), qi, qb = (qi = class {
  constructor() {
    this.background = "#f4f4f4", this.primaryColor = "#ECECFF", this.secondaryColor = k(this.primaryColor, { h: 120 }), this.secondaryColor = "#ffffde", this.tertiaryColor = k(this.primaryColor, { h: -160 }), this.primaryBorderColor = kt(this.primaryColor, this.darkMode), this.secondaryBorderColor = kt(this.secondaryColor, this.darkMode), this.tertiaryBorderColor = kt(this.tertiaryColor, this.darkMode), this.primaryTextColor = F(this.primaryColor), this.secondaryTextColor = F(this.secondaryColor), this.tertiaryTextColor = F(this.tertiaryColor), this.lineColor = F(this.background), this.textColor = F(this.background), this.background = "white", this.mainBkg = "#ECECFF", this.secondBkg = "#ffffde", this.lineColor = "#333333", this.border1 = "#9370DB", this.primaryBorderColor = kt(this.primaryColor, this.darkMode), this.border2 = "#aaaa33", this.arrowheadColor = "#333333", this.fontFamily = '"trebuchet ms", verdana, arial, sans-serif', this.fontSize = "16px", this.labelBackground = "rgba(232,232,232, 0.8)", this.textColor = "#333", this.THEME_COLOR_LIMIT = 12, this.radius = 5, this.strokeWidth = 1, this.nodeBkg = "calculated", this.nodeBorder = "calculated", this.clusterBkg = "calculated", this.clusterBorder = "calculated", this.defaultLinkColor = "calculated", this.titleColor = "calculated", this.edgeLabelBackground = "calculated", this.actorBorder = "calculated", this.actorBkg = "calculated", this.actorTextColor = "black", this.actorLineColor = "calculated", this.signalColor = "calculated", this.signalTextColor = "calculated", this.labelBoxBkgColor = "calculated", this.labelBoxBorderColor = "calculated", this.labelTextColor = "calculated", this.loopTextColor = "calculated", this.noteBorderColor = "calculated", this.noteBkgColor = "#fff5ad", this.noteTextColor = "calculated", this.activationBorderColor = "#666", this.activationBkgColor = "#f4f4f4", this.sequenceNumberColor = "white", this.clusterBkg = "#FBFBFF", this.sectionBkgColor = "calculated", this.altSectionBkgColor = "calculated", this.sectionBkgColor2 = "calculated", this.excludeBkgColor = "#eeeeee", this.taskBorderColor = "calculated", this.taskBkgColor = "calculated", this.taskTextLightColor = "calculated", this.taskTextColor = this.taskTextLightColor, this.taskTextDarkColor = "calculated", this.taskTextOutsideColor = this.taskTextDarkColor, this.taskTextClickableColor = "calculated", this.activeTaskBorderColor = "calculated", this.activeTaskBkgColor = "calculated", this.gridColor = "calculated", this.doneTaskBkgColor = "calculated", this.doneTaskBorderColor = "calculated", this.critBorderColor = "calculated", this.critBkgColor = "calculated", this.todayLineColor = "calculated", this.vertLineColor = "calculated", this.sectionBkgColor = Hr(102, 102, 255, 0.49), this.altSectionBkgColor = "white", this.sectionBkgColor2 = "#fff400", this.taskBorderColor = "#534fbc", this.taskBkgColor = "#8a90dd", this.taskTextLightColor = "white", this.taskTextColor = "calculated", this.taskTextDarkColor = "black", this.taskTextOutsideColor = "calculated", this.taskTextClickableColor = "#003163", this.activeTaskBorderColor = "#534fbc", this.activeTaskBkgColor = "#bfc7ff", this.gridColor = "lightgrey", this.doneTaskBkgColor = "lightgrey", this.doneTaskBorderColor = "grey", this.critBorderColor = "#ff8888", this.critBkgColor = "red", this.todayLineColor = "red", this.vertLineColor = "navy", this.noteFontWeight = this.noteFontWeight || "normal", this.fontWeight = this.fontWeight || "normal", this.personBorder = this.primaryBorderColor, this.personBkg = this.mainBkg, this.archEdgeColor = "calculated", this.archEdgeArrowColor = "calculated", this.archEdgeWidth = "3", this.archGroupBorderColor = this.primaryBorderColor, this.archGroupBorderWidth = "2px", this.rowOdd = "calculated", this.rowEven = "calculated", this.labelColor = "black", this.errorBkgColor = "#552222", this.errorTextColor = "#552222", this.useGradient = !1, this.gradientStart = this.primaryBorderColor, this.gradientStop = this.secondaryBorderColor, this.dropShadow = "drop-shadow(1px 2px 2px rgba(185, 185, 185, 1))", this.updateColors();
  }
  updateColors() {
    this.cScale0 = this.cScale0 || this.primaryColor, this.cScale1 = this.cScale1 || this.secondaryColor, this.cScale2 = this.cScale2 || this.tertiaryColor, this.cScale3 = this.cScale3 || k(this.primaryColor, { h: 30 }), this.cScale4 = this.cScale4 || k(this.primaryColor, { h: 60 }), this.cScale5 = this.cScale5 || k(this.primaryColor, { h: 90 }), this.cScale6 = this.cScale6 || k(this.primaryColor, { h: 120 }), this.cScale7 = this.cScale7 || k(this.primaryColor, { h: 150 }), this.cScale8 = this.cScale8 || k(this.primaryColor, { h: 210 }), this.cScale9 = this.cScale9 || k(this.primaryColor, { h: 270 }), this.cScale10 = this.cScale10 || k(this.primaryColor, { h: 300 }), this.cScale11 = this.cScale11 || k(this.primaryColor, { h: 330 }), this.cScalePeer1 = this.cScalePeer1 || P(this.secondaryColor, 45), this.cScalePeer2 = this.cScalePeer2 || P(this.tertiaryColor, 40);
    for (let t = 0; t < this.THEME_COLOR_LIMIT; t++)
      this["cScale" + t] = P(this["cScale" + t], 10), this["cScalePeer" + t] = this["cScalePeer" + t] || P(this["cScale" + t], 25);
    for (let t = 0; t < this.THEME_COLOR_LIMIT; t++)
      this["cScaleInv" + t] = this["cScaleInv" + t] || k(this["cScale" + t], { h: 180 });
    for (let t = 0; t < 5; t++)
      this["surface" + t] = this["surface" + t] || k(this.mainBkg, { h: 30, l: -(5 + t * 5) }), this["surfacePeer" + t] = this["surfacePeer" + t] || k(this.mainBkg, { h: 30, l: -(7 + t * 5) });
    if (this.scaleLabelColor = this.scaleLabelColor !== "calculated" && this.scaleLabelColor ? this.scaleLabelColor : this.labelTextColor, this.labelTextColor !== "calculated") {
      this.cScaleLabel0 = this.cScaleLabel0 || F(this.labelTextColor), this.cScaleLabel3 = this.cScaleLabel3 || F(this.labelTextColor);
      for (let t = 0; t < this.THEME_COLOR_LIMIT; t++)
        this["cScaleLabel" + t] = this["cScaleLabel" + t] || this.labelTextColor;
    }
    this.nodeBkg = this.mainBkg, this.nodeBorder = this.border1, this.clusterBkg = this.secondBkg, this.clusterBorder = this.border2, this.defaultLinkColor = this.lineColor, this.titleColor = this.textColor, this.edgeLabelBackground = this.labelBackground, this.actorBorder = this.border1, this.actorBkg = this.mainBkg, this.labelBoxBkgColor = this.actorBkg, this.signalColor = this.textColor, this.signalTextColor = this.textColor, this.labelBoxBorderColor = this.actorBorder, this.labelTextColor = this.actorTextColor, this.loopTextColor = this.actorTextColor, this.noteBorderColor = this.border2, this.noteTextColor = this.actorTextColor, this.actorLineColor = this.actorBorder, this.rectBkgColor = this.rectBkgColor || this.tertiaryColor, this.taskTextColor = this.taskTextLightColor, this.taskTextOutsideColor = this.taskTextDarkColor, this.archEdgeColor = this.lineColor, this.archEdgeArrowColor = this.lineColor, this.rowOdd = this.rowOdd || R(this.primaryColor, 75) || "#ffffff", this.rowEven = this.rowEven || R(this.primaryColor, 1), this.transitionColor = this.transitionColor || this.lineColor, this.transitionLabelColor = this.transitionLabelColor || this.textColor, this.stateLabelColor = this.stateLabelColor || this.stateBkg || this.primaryTextColor, this.stateBkg = this.stateBkg || this.mainBkg, this.labelBackgroundColor = this.labelBackgroundColor || this.stateBkg, this.compositeBackground = this.compositeBackground || this.background || this.tertiaryColor, this.altBackground = this.altBackground || "#f0f0f0", this.compositeTitleBackground = this.compositeTitleBackground || this.mainBkg, this.compositeBorder = this.compositeBorder || this.nodeBorder, this.innerEndBackground = this.nodeBorder, this.specialStateColor = this.lineColor, this.errorBkgColor = this.errorBkgColor || this.tertiaryColor, this.errorTextColor = this.errorTextColor || this.tertiaryTextColor, this.transitionColor = this.transitionColor || this.lineColor, this.classText = this.primaryTextColor, this.fillType0 = this.primaryColor, this.fillType1 = this.secondaryColor, this.fillType2 = k(this.primaryColor, { h: 64 }), this.fillType3 = k(this.secondaryColor, { h: 64 }), this.fillType4 = k(this.primaryColor, { h: -64 }), this.fillType5 = k(this.secondaryColor, { h: -64 }), this.fillType6 = k(this.primaryColor, { h: 128 }), this.fillType7 = k(this.secondaryColor, { h: 128 }), this.pie1 = this.pie1 || this.primaryColor, this.pie2 = this.pie2 || this.secondaryColor, this.pie3 = this.pie3 || k(this.tertiaryColor, { l: -40 }), this.pie4 = this.pie4 || k(this.primaryColor, { l: -10 }), this.pie5 = this.pie5 || k(this.secondaryColor, { l: -30 }), this.pie6 = this.pie6 || k(this.tertiaryColor, { l: -20 }), this.pie7 = this.pie7 || k(this.primaryColor, { h: 60, l: -20 }), this.pie8 = this.pie8 || k(this.primaryColor, { h: -60, l: -40 }), this.pie9 = this.pie9 || k(this.primaryColor, { h: 120, l: -40 }), this.pie10 = this.pie10 || k(this.primaryColor, { h: 60, l: -40 }), this.pie11 = this.pie11 || k(this.primaryColor, { h: -90, l: -40 }), this.pie12 = this.pie12 || k(this.primaryColor, { h: 120, l: -30 }), this.pieTitleTextSize = this.pieTitleTextSize || "25px", this.pieTitleTextColor = this.pieTitleTextColor || this.taskTextDarkColor, this.pieSectionTextSize = this.pieSectionTextSize || "17px", this.pieSectionTextColor = this.pieSectionTextColor || this.textColor, this.pieLegendTextSize = this.pieLegendTextSize || "17px", this.pieLegendTextColor = this.pieLegendTextColor || this.taskTextDarkColor, this.pieStrokeColor = this.pieStrokeColor || "black", this.pieStrokeWidth = this.pieStrokeWidth || "2px", this.pieOuterStrokeWidth = this.pieOuterStrokeWidth || "2px", this.pieOuterStrokeColor = this.pieOuterStrokeColor || "black", this.pieOpacity = this.pieOpacity || "0.7", this.venn1 = this.venn1 ?? k(this.primaryColor, { l: -30 }), this.venn2 = this.venn2 ?? k(this.secondaryColor, { l: -30 }), this.venn3 = this.venn3 ?? k(this.tertiaryColor, { l: -40 }), this.venn4 = this.venn4 ?? k(this.primaryColor, { h: 60, l: -30 }), this.venn5 = this.venn5 ?? k(this.primaryColor, { h: -60, l: -30 }), this.venn6 = this.venn6 ?? k(this.secondaryColor, { h: 60, l: -30 }), this.venn7 = this.venn7 ?? k(this.primaryColor, { h: 120, l: -30 }), this.venn8 = this.venn8 ?? k(this.secondaryColor, { h: 120, l: -30 }), this.vennTitleTextColor = this.vennTitleTextColor ?? this.titleColor, this.vennSetTextColor = this.vennSetTextColor ?? this.textColor, this.cynefin = {
      domainFontSize: this.cynefin?.domainFontSize || 16,
      itemFontSize: this.cynefin?.itemFontSize || 12,
      boundaryColor: this.cynefin?.boundaryColor || this.lineColor,
      boundaryWidth: this.cynefin?.boundaryWidth || 2,
      cliffColor: this.cynefin?.cliffColor || "#8B0000",
      cliffWidth: this.cynefin?.cliffWidth || 4,
      arrowColor: this.cynefin?.arrowColor || this.lineColor,
      arrowWidth: this.cynefin?.arrowWidth || 2,
      complexBg: this.cynefin?.complexBg || "#E8F5E9",
      complicatedBg: this.cynefin?.complicatedBg || "#E3F2FD",
      chaoticBg: this.cynefin?.chaoticBg || "#FBE9E7",
      clearBg: this.cynefin?.clearBg || "#FFF8E1",
      confusionBg: this.cynefin?.confusionBg || "#F3E5F5",
      textColor: this.cynefin?.textColor || this.textColor,
      labelColor: this.cynefin?.labelColor || this.primaryTextColor
    }, this.quadrant1Fill = this.quadrant1Fill || this.primaryColor, this.quadrant2Fill = this.quadrant2Fill || k(this.primaryColor, { r: 5, g: 5, b: 5 }), this.quadrant3Fill = this.quadrant3Fill || k(this.primaryColor, { r: 10, g: 10, b: 10 }), this.quadrant4Fill = this.quadrant4Fill || k(this.primaryColor, { r: 15, g: 15, b: 15 }), this.quadrant1TextFill = this.quadrant1TextFill || this.primaryTextColor, this.quadrant2TextFill = this.quadrant2TextFill || k(this.primaryTextColor, { r: -5, g: -5, b: -5 }), this.quadrant3TextFill = this.quadrant3TextFill || k(this.primaryTextColor, { r: -10, g: -10, b: -10 }), this.quadrant4TextFill = this.quadrant4TextFill || k(this.primaryTextColor, { r: -15, g: -15, b: -15 }), this.quadrantPointFill = this.quadrantPointFill || Ke(this.quadrant1Fill) ? R(this.quadrant1Fill) : P(this.quadrant1Fill), this.quadrantPointTextFill = this.quadrantPointTextFill || this.primaryTextColor, this.quadrantXAxisTextFill = this.quadrantXAxisTextFill || this.primaryTextColor, this.quadrantYAxisTextFill = this.quadrantYAxisTextFill || this.primaryTextColor, this.quadrantInternalBorderStrokeFill = this.quadrantInternalBorderStrokeFill || this.primaryBorderColor, this.quadrantExternalBorderStrokeFill = this.quadrantExternalBorderStrokeFill || this.primaryBorderColor, this.quadrantTitleFill = this.quadrantTitleFill || this.primaryTextColor, this.radar = {
      axisColor: this.radar?.axisColor || this.lineColor,
      axisStrokeWidth: this.radar?.axisStrokeWidth || 2,
      axisLabelFontSize: this.radar?.axisLabelFontSize || 12,
      curveOpacity: this.radar?.curveOpacity || 0.5,
      curveStrokeWidth: this.radar?.curveStrokeWidth || 2,
      graticuleColor: this.radar?.graticuleColor || "#DEDEDE",
      graticuleStrokeWidth: this.radar?.graticuleStrokeWidth || 1,
      graticuleOpacity: this.radar?.graticuleOpacity || 0.3,
      legendBoxSize: this.radar?.legendBoxSize || 12,
      legendFontSize: this.radar?.legendFontSize || 12
    }, this.wardleyEvolutionColor = this.wardleyEvolutionColor || "#dc3545", this.wardley = {
      backgroundColor: this.wardley?.backgroundColor || this.background,
      axisColor: this.wardley?.axisColor || this.lineColor,
      axisTextColor: this.wardley?.axisTextColor || this.primaryTextColor,
      gridColor: this.wardley?.gridColor || this.gridColor,
      componentFill: this.wardley?.componentFill || this.background,
      componentStroke: this.wardley?.componentStroke || this.lineColor,
      componentLabelColor: this.wardley?.componentLabelColor || this.primaryTextColor,
      linkStroke: this.wardley?.linkStroke || this.lineColor,
      evolutionStroke: this.wardley?.evolutionStroke || this.wardleyEvolutionColor,
      annotationStroke: this.wardley?.annotationStroke || this.lineColor,
      annotationTextColor: this.wardley?.annotationTextColor || this.primaryTextColor,
      annotationFill: this.wardley?.annotationFill || this.background
    }, this.xyChart = {
      backgroundColor: this.xyChart?.backgroundColor || this.background,
      titleColor: this.xyChart?.titleColor || this.primaryTextColor,
      dataLabelColor: this.xyChart?.dataLabelColor || this.primaryTextColor,
      legendTextColor: this.xyChart?.legendTextColor || this.primaryTextColor,
      xAxisTitleColor: this.xyChart?.xAxisTitleColor || this.primaryTextColor,
      xAxisLabelColor: this.xyChart?.xAxisLabelColor || this.primaryTextColor,
      xAxisTickColor: this.xyChart?.xAxisTickColor || this.primaryTextColor,
      xAxisLineColor: this.xyChart?.xAxisLineColor || this.primaryTextColor,
      yAxisTitleColor: this.xyChart?.yAxisTitleColor || this.primaryTextColor,
      yAxisLabelColor: this.xyChart?.yAxisLabelColor || this.primaryTextColor,
      yAxisTickColor: this.xyChart?.yAxisTickColor || this.primaryTextColor,
      yAxisLineColor: this.xyChart?.yAxisLineColor || this.primaryTextColor,
      plotColorPalette: this.xyChart?.plotColorPalette || "#ECECFF,#8493A6,#FFC3A0,#DCDDE1,#B8E994,#D1A36F,#C3CDE6,#FFB6C1,#496078,#F8F3E3"
    }, this.requirementBackground = this.requirementBackground || this.primaryColor, this.requirementBorderColor = this.requirementBorderColor || this.primaryBorderColor, this.requirementBorderSize = this.requirementBorderSize || "1", this.requirementTextColor = this.requirementTextColor || this.primaryTextColor, this.relationColor = this.relationColor || this.lineColor, this.relationLabelBackground = this.relationLabelBackground || this.labelBackground, this.relationLabelColor = this.relationLabelColor || this.actorTextColor, this.git0 = this.git0 || this.primaryColor, this.git1 = this.git1 || this.secondaryColor, this.git2 = this.git2 || this.tertiaryColor, this.git3 = this.git3 || k(this.primaryColor, { h: -30 }), this.git4 = this.git4 || k(this.primaryColor, { h: -60 }), this.git5 = this.git5 || k(this.primaryColor, { h: -90 }), this.git6 = this.git6 || k(this.primaryColor, { h: 60 }), this.git7 = this.git7 || k(this.primaryColor, { h: 120 }), this.darkMode ? (this.git0 = R(this.git0, 25), this.git1 = R(this.git1, 25), this.git2 = R(this.git2, 25), this.git3 = R(this.git3, 25), this.git4 = R(this.git4, 25), this.git5 = R(this.git5, 25), this.git6 = R(this.git6, 25), this.git7 = R(this.git7, 25)) : (this.git0 = P(this.git0, 25), this.git1 = P(this.git1, 25), this.git2 = P(this.git2, 25), this.git3 = P(this.git3, 25), this.git4 = P(this.git4, 25), this.git5 = P(this.git5, 25), this.git6 = P(this.git6, 25), this.git7 = P(this.git7, 25)), this.gitInv0 = this.gitInv0 || P(F(this.git0), 25), this.gitInv1 = this.gitInv1 || F(this.git1), this.gitInv2 = this.gitInv2 || F(this.git2), this.gitInv3 = this.gitInv3 || F(this.git3), this.gitInv4 = this.gitInv4 || F(this.git4), this.gitInv5 = this.gitInv5 || F(this.git5), this.gitInv6 = this.gitInv6 || F(this.git6), this.gitInv7 = this.gitInv7 || F(this.git7), this.gitBranchLabel0 = this.gitBranchLabel0 || F(this.labelTextColor), this.gitBranchLabel1 = this.gitBranchLabel1 || this.labelTextColor, this.gitBranchLabel2 = this.gitBranchLabel2 || this.labelTextColor, this.gitBranchLabel3 = this.gitBranchLabel3 || F(this.labelTextColor), this.gitBranchLabel4 = this.gitBranchLabel4 || this.labelTextColor, this.gitBranchLabel5 = this.gitBranchLabel5 || this.labelTextColor, this.gitBranchLabel6 = this.gitBranchLabel6 || this.labelTextColor, this.gitBranchLabel7 = this.gitBranchLabel7 || this.labelTextColor, this.tagLabelColor = this.tagLabelColor || this.primaryTextColor, this.tagLabelBackground = this.tagLabelBackground || this.primaryColor, this.tagLabelBorder = this.tagBorder || this.primaryBorderColor, this.tagLabelFontSize = this.tagLabelFontSize || "10px", this.commitLabelColor = this.commitLabelColor || this.secondaryTextColor, this.commitLabelBackground = this.commitLabelBackground || this.secondaryColor, this.commitLabelFontSize = this.commitLabelFontSize || "10px", this.emUiFill = this.emUiFill || "white", this.emUiStroke = this.emUiStroke || "#dbdada", this.emProcessorFill = this.emProcessorFill || "#edb3f6", this.emProcessorStroke = this.emProcessorStroke || "#b88cbf", this.emReadModelFill = this.emReadModelFill || "#d3f1a2", this.emReadModelStroke = this.emReadModelStroke || "#a3b732", this.emCommandFill = this.emCommandFill || "#bcd6fe", this.emCommandStroke = this.emCommandStroke || "#679ac3", this.emEventFill = this.emEventFill || "#ffb778", this.emEventStroke = this.emEventStroke || "#c19a0f", this.emSwimlaneBackgroundOdd = this.emSwimlaneBackgroundOdd || "rgb(250,250,250)", this.emSwimlaneBackgroundStroke = this.emSwimlaneBackgroundStroke || "rgb(240,240,240)", this.emArrowhead = this.emArrowhead || this.lineColor, this.emRelationStroke = this.emRelationStroke || this.lineColor, this.attributeBackgroundColorOdd = this.attributeBackgroundColorOdd || hr, this.attributeBackgroundColorEven = this.attributeBackgroundColorEven || cr;
  }
  calculate(t) {
    if (Object.keys(this).forEach((i) => {
      this[i] === "calculated" && (this[i] = void 0);
    }), typeof t != "object") {
      this.updateColors();
      return;
    }
    const r = Object.keys(t);
    r.forEach((i) => {
      this[i] = t[i];
    }), this.updateColors(), r.forEach((i) => {
      this[i] = t[i];
    });
  }
}, p(qi, "Theme"), qi), Wb = /* @__PURE__ */ p((e) => {
  const t = new qb();
  return t.calculate(e), t;
}, "getThemeVariables"), Wi, zb = (Wi = class {
  constructor() {
    this.background = "#f4f4f4", this.primaryColor = "#cde498", this.secondaryColor = "#cdffb2", this.background = "white", this.mainBkg = "#cde498", this.secondBkg = "#cdffb2", this.lineColor = "green", this.border1 = "#13540c", this.border2 = "#6eaa49", this.arrowheadColor = "green", this.fontFamily = '"trebuchet ms", verdana, arial, sans-serif', this.fontSize = "16px", this.tertiaryColor = R("#cde498", 10), this.primaryBorderColor = kt(this.primaryColor, this.darkMode), this.secondaryBorderColor = kt(this.secondaryColor, this.darkMode), this.tertiaryBorderColor = kt(this.tertiaryColor, this.darkMode), this.primaryTextColor = F(this.primaryColor), this.secondaryTextColor = F(this.secondaryColor), this.tertiaryTextColor = F(this.primaryColor), this.lineColor = F(this.background), this.textColor = F(this.background), this.THEME_COLOR_LIMIT = 12, this.radius = 5, this.strokeWidth = 1, this.nodeBkg = "calculated", this.nodeBorder = "calculated", this.clusterBkg = "calculated", this.clusterBorder = "calculated", this.defaultLinkColor = "calculated", this.titleColor = "#333", this.edgeLabelBackground = "#e8e8e8", this.actorBorder = "calculated", this.actorBkg = "calculated", this.actorTextColor = "black", this.actorLineColor = "calculated", this.signalColor = "#333", this.signalTextColor = "#333", this.labelBoxBkgColor = "calculated", this.labelBoxBorderColor = "#326932", this.labelTextColor = "calculated", this.loopTextColor = "calculated", this.noteBorderColor = "calculated", this.noteBkgColor = "#fff5ad", this.noteTextColor = "calculated", this.activationBorderColor = "#666", this.activationBkgColor = "#f4f4f4", this.sequenceNumberColor = "white", this.sectionBkgColor = "#6eaa49", this.altSectionBkgColor = "white", this.sectionBkgColor2 = "#6eaa49", this.excludeBkgColor = "#eeeeee", this.taskBorderColor = "calculated", this.taskBkgColor = "#487e3a", this.taskTextLightColor = "white", this.taskTextColor = "calculated", this.taskTextDarkColor = "black", this.taskTextOutsideColor = "calculated", this.taskTextClickableColor = "#003163", this.activeTaskBorderColor = "calculated", this.activeTaskBkgColor = "calculated", this.gridColor = "lightgrey", this.doneTaskBkgColor = "lightgrey", this.doneTaskBorderColor = "grey", this.critBorderColor = "#ff8888", this.critBkgColor = "red", this.todayLineColor = "red", this.vertLineColor = "#00BFFF", this.personBorder = this.primaryBorderColor, this.personBkg = this.mainBkg, this.archEdgeColor = "calculated", this.archEdgeArrowColor = "calculated", this.archEdgeWidth = "3", this.archGroupBorderColor = this.primaryBorderColor, this.archGroupBorderWidth = "2px", this.noteFontWeight = "normal", this.fontWeight = "normal", this.labelColor = "black", this.errorBkgColor = "#552222", this.errorTextColor = "#552222", this.useGradient = !0, this.gradientStart = this.primaryBorderColor, this.gradientStop = this.secondaryBorderColor, this.dropShadow = "drop-shadow( 1px 2px 2px rgba(185,185,185,0.5))";
  }
  updateColors() {
    this.actorBorder = P(this.mainBkg, 20), this.actorBkg = this.mainBkg, this.labelBoxBkgColor = this.actorBkg, this.labelTextColor = this.actorTextColor, this.loopTextColor = this.actorTextColor, this.noteBorderColor = this.border2, this.noteTextColor = this.actorTextColor, this.actorLineColor = this.actorBorder, this.rectBkgColor = this.rectBkgColor || this.tertiaryColor, this.cScale0 = this.cScale0 || this.primaryColor, this.cScale1 = this.cScale1 || this.secondaryColor, this.cScale2 = this.cScale2 || this.tertiaryColor, this.cScale3 = this.cScale3 || k(this.primaryColor, { h: 30 }), this.cScale4 = this.cScale4 || k(this.primaryColor, { h: 60 }), this.cScale5 = this.cScale5 || k(this.primaryColor, { h: 90 }), this.cScale6 = this.cScale6 || k(this.primaryColor, { h: 120 }), this.cScale7 = this.cScale7 || k(this.primaryColor, { h: 150 }), this.cScale8 = this.cScale8 || k(this.primaryColor, { h: 210 }), this.cScale9 = this.cScale9 || k(this.primaryColor, { h: 270 }), this.cScale10 = this.cScale10 || k(this.primaryColor, { h: 300 }), this.cScale11 = this.cScale11 || k(this.primaryColor, { h: 330 }), this.cScalePeer1 = this.cScalePeer1 || P(this.secondaryColor, 45), this.cScalePeer2 = this.cScalePeer2 || P(this.tertiaryColor, 40);
    for (let t = 0; t < this.THEME_COLOR_LIMIT; t++)
      this["cScale" + t] = P(this["cScale" + t], 10), this["cScalePeer" + t] = this["cScalePeer" + t] || P(this["cScale" + t], 25);
    for (let t = 0; t < this.THEME_COLOR_LIMIT; t++)
      this["cScaleInv" + t] = this["cScaleInv" + t] || k(this["cScale" + t], { h: 180 });
    this.scaleLabelColor = this.scaleLabelColor !== "calculated" && this.scaleLabelColor ? this.scaleLabelColor : this.labelTextColor;
    for (let t = 0; t < this.THEME_COLOR_LIMIT; t++)
      this["cScaleLabel" + t] = this["cScaleLabel" + t] || this.scaleLabelColor;
    for (let t = 0; t < 5; t++)
      this["surface" + t] = this["surface" + t] || k(this.mainBkg, { h: 30, s: -30, l: -(5 + t * 5) }), this["surfacePeer" + t] = this["surfacePeer" + t] || k(this.mainBkg, { h: 30, s: -30, l: -(8 + t * 5) });
    this.nodeBkg = this.mainBkg, this.nodeBorder = this.border1, this.clusterBkg = this.secondBkg, this.clusterBorder = this.border2, this.defaultLinkColor = this.lineColor, this.taskBorderColor = this.border1, this.taskTextColor = this.taskTextLightColor, this.taskTextOutsideColor = this.taskTextDarkColor, this.activeTaskBorderColor = this.taskBorderColor, this.activeTaskBkgColor = this.mainBkg, this.archEdgeColor = this.lineColor, this.archEdgeArrowColor = this.lineColor, this.rowOdd = this.rowOdd || R(this.mainBkg, 75) || "#ffffff", this.rowEven = this.rowEven || R(this.mainBkg, 20), this.transitionColor = this.transitionColor || this.lineColor, this.transitionLabelColor = this.transitionLabelColor || this.textColor, this.stateLabelColor = this.stateLabelColor || this.stateBkg || this.primaryTextColor, this.stateBkg = this.stateBkg || this.mainBkg, this.labelBackgroundColor = this.labelBackgroundColor || this.stateBkg, this.compositeBackground = this.compositeBackground || this.background || this.tertiaryColor, this.altBackground = this.altBackground || "#f0f0f0", this.compositeTitleBackground = this.compositeTitleBackground || this.mainBkg, this.compositeBorder = this.compositeBorder || this.nodeBorder, this.innerEndBackground = this.primaryBorderColor, this.specialStateColor = this.lineColor, this.errorBkgColor = this.errorBkgColor || this.tertiaryColor, this.errorTextColor = this.errorTextColor || this.tertiaryTextColor, this.transitionColor = this.transitionColor || this.lineColor, this.classText = this.primaryTextColor, this.fillType0 = this.primaryColor, this.fillType1 = this.secondaryColor, this.fillType2 = k(this.primaryColor, { h: 64 }), this.fillType3 = k(this.secondaryColor, { h: 64 }), this.fillType4 = k(this.primaryColor, { h: -64 }), this.fillType5 = k(this.secondaryColor, { h: -64 }), this.fillType6 = k(this.primaryColor, { h: 128 }), this.fillType7 = k(this.secondaryColor, { h: 128 }), this.pie1 = this.pie1 || this.primaryColor, this.pie2 = this.pie2 || this.secondaryColor, this.pie3 = this.pie3 || this.tertiaryColor, this.pie4 = this.pie4 || k(this.primaryColor, { l: -30 }), this.pie5 = this.pie5 || k(this.secondaryColor, { l: -30 }), this.pie6 = this.pie6 || k(this.tertiaryColor, { h: 40, l: -40 }), this.pie7 = this.pie7 || k(this.primaryColor, { h: 60, l: -10 }), this.pie8 = this.pie8 || k(this.primaryColor, { h: -60, l: -10 }), this.pie9 = this.pie9 || k(this.primaryColor, { h: 120, l: 0 }), this.pie10 = this.pie10 || k(this.primaryColor, { h: 60, l: -50 }), this.pie11 = this.pie11 || k(this.primaryColor, { h: -60, l: -50 }), this.pie12 = this.pie12 || k(this.primaryColor, { h: 120, l: -50 }), this.pieTitleTextSize = this.pieTitleTextSize || "25px", this.pieTitleTextColor = this.pieTitleTextColor || this.taskTextDarkColor, this.pieSectionTextSize = this.pieSectionTextSize || "17px", this.pieSectionTextColor = this.pieSectionTextColor || this.textColor, this.pieLegendTextSize = this.pieLegendTextSize || "17px", this.pieLegendTextColor = this.pieLegendTextColor || this.taskTextDarkColor, this.pieStrokeColor = this.pieStrokeColor || "black", this.pieStrokeWidth = this.pieStrokeWidth || "2px", this.pieOuterStrokeWidth = this.pieOuterStrokeWidth || "2px", this.pieOuterStrokeColor = this.pieOuterStrokeColor || "black", this.pieOpacity = this.pieOpacity || "0.7", this.venn1 = this.venn1 ?? k(this.primaryColor, { l: -30 }), this.venn2 = this.venn2 ?? k(this.secondaryColor, { l: -30 }), this.venn3 = this.venn3 ?? k(this.tertiaryColor, { l: -30 }), this.venn4 = this.venn4 ?? k(this.primaryColor, { h: 60, l: -30 }), this.venn5 = this.venn5 ?? k(this.primaryColor, { h: -60, l: -30 }), this.venn6 = this.venn6 ?? k(this.secondaryColor, { h: 60, l: -30 }), this.venn7 = this.venn7 ?? k(this.primaryColor, { h: 120, l: -30 }), this.venn8 = this.venn8 ?? k(this.secondaryColor, { h: 120, l: -30 }), this.vennTitleTextColor = this.vennTitleTextColor ?? this.titleColor, this.vennSetTextColor = this.vennSetTextColor ?? this.textColor, this.cynefin = {
      domainFontSize: this.cynefin?.domainFontSize || 16,
      itemFontSize: this.cynefin?.itemFontSize || 12,
      boundaryColor: this.cynefin?.boundaryColor || this.lineColor,
      boundaryWidth: this.cynefin?.boundaryWidth || 2,
      cliffColor: this.cynefin?.cliffColor || "#8B4513",
      cliffWidth: this.cynefin?.cliffWidth || 4,
      arrowColor: this.cynefin?.arrowColor || this.lineColor,
      arrowWidth: this.cynefin?.arrowWidth || 2,
      complexBg: this.cynefin?.complexBg || "#C8E6C9",
      complicatedBg: this.cynefin?.complicatedBg || "#DCEDC8",
      chaoticBg: this.cynefin?.chaoticBg || "#FFE0B2",
      clearBg: this.cynefin?.clearBg || "#FFF9C4",
      confusionBg: this.cynefin?.confusionBg || "#D7CCC8",
      textColor: this.cynefin?.textColor || this.textColor,
      labelColor: this.cynefin?.labelColor || this.primaryTextColor
    }, this.quadrant1Fill = this.quadrant1Fill || this.primaryColor, this.quadrant2Fill = this.quadrant2Fill || k(this.primaryColor, { r: 5, g: 5, b: 5 }), this.quadrant3Fill = this.quadrant3Fill || k(this.primaryColor, { r: 10, g: 10, b: 10 }), this.quadrant4Fill = this.quadrant4Fill || k(this.primaryColor, { r: 15, g: 15, b: 15 }), this.quadrant1TextFill = this.quadrant1TextFill || this.primaryTextColor, this.quadrant2TextFill = this.quadrant2TextFill || k(this.primaryTextColor, { r: -5, g: -5, b: -5 }), this.quadrant3TextFill = this.quadrant3TextFill || k(this.primaryTextColor, { r: -10, g: -10, b: -10 }), this.quadrant4TextFill = this.quadrant4TextFill || k(this.primaryTextColor, { r: -15, g: -15, b: -15 }), this.quadrantPointFill = this.quadrantPointFill || Ke(this.quadrant1Fill) ? R(this.quadrant1Fill) : P(this.quadrant1Fill), this.quadrantPointTextFill = this.quadrantPointTextFill || this.primaryTextColor, this.quadrantXAxisTextFill = this.quadrantXAxisTextFill || this.primaryTextColor, this.quadrantYAxisTextFill = this.quadrantYAxisTextFill || this.primaryTextColor, this.quadrantInternalBorderStrokeFill = this.quadrantInternalBorderStrokeFill || this.primaryBorderColor, this.quadrantExternalBorderStrokeFill = this.quadrantExternalBorderStrokeFill || this.primaryBorderColor, this.quadrantTitleFill = this.quadrantTitleFill || this.primaryTextColor, this.packet = {
      startByteColor: this.primaryTextColor,
      endByteColor: this.primaryTextColor,
      labelColor: this.primaryTextColor,
      titleColor: this.primaryTextColor,
      blockStrokeColor: this.primaryTextColor,
      blockFillColor: this.mainBkg
    }, this.radar = {
      axisColor: this.radar?.axisColor || this.lineColor,
      axisStrokeWidth: this.radar?.axisStrokeWidth || 2,
      axisLabelFontSize: this.radar?.axisLabelFontSize || 12,
      curveOpacity: this.radar?.curveOpacity || 0.5,
      curveStrokeWidth: this.radar?.curveStrokeWidth || 2,
      graticuleColor: this.radar?.graticuleColor || "#DEDEDE",
      graticuleStrokeWidth: this.radar?.graticuleStrokeWidth || 1,
      graticuleOpacity: this.radar?.graticuleOpacity || 0.3,
      legendBoxSize: this.radar?.legendBoxSize || 12,
      legendFontSize: this.radar?.legendFontSize || 12
    }, this.wardleyEvolutionColor = this.wardleyEvolutionColor || "#dc3545", this.wardley = {
      backgroundColor: this.wardley?.backgroundColor || this.background,
      axisColor: this.wardley?.axisColor || this.lineColor,
      axisTextColor: this.wardley?.axisTextColor || this.primaryTextColor,
      gridColor: this.wardley?.gridColor || this.gridColor,
      componentFill: this.wardley?.componentFill || this.background,
      componentStroke: this.wardley?.componentStroke || this.lineColor,
      componentLabelColor: this.wardley?.componentLabelColor || this.primaryTextColor,
      linkStroke: this.wardley?.linkStroke || this.lineColor,
      evolutionStroke: this.wardley?.evolutionStroke || this.wardleyEvolutionColor,
      annotationStroke: this.wardley?.annotationStroke || this.lineColor,
      annotationTextColor: this.wardley?.annotationTextColor || this.primaryTextColor,
      annotationFill: this.wardley?.annotationFill || this.background
    }, this.xyChart = {
      backgroundColor: this.xyChart?.backgroundColor || this.background,
      titleColor: this.xyChart?.titleColor || this.primaryTextColor,
      dataLabelColor: this.xyChart?.dataLabelColor || this.primaryTextColor,
      legendTextColor: this.xyChart?.legendTextColor || this.primaryTextColor,
      xAxisTitleColor: this.xyChart?.xAxisTitleColor || this.primaryTextColor,
      xAxisLabelColor: this.xyChart?.xAxisLabelColor || this.primaryTextColor,
      xAxisTickColor: this.xyChart?.xAxisTickColor || this.primaryTextColor,
      xAxisLineColor: this.xyChart?.xAxisLineColor || this.primaryTextColor,
      yAxisTitleColor: this.xyChart?.yAxisTitleColor || this.primaryTextColor,
      yAxisLabelColor: this.xyChart?.yAxisLabelColor || this.primaryTextColor,
      yAxisTickColor: this.xyChart?.yAxisTickColor || this.primaryTextColor,
      yAxisLineColor: this.xyChart?.yAxisLineColor || this.primaryTextColor,
      plotColorPalette: this.xyChart?.plotColorPalette || "#CDE498,#FF6B6B,#A0D2DB,#D7BDE2,#F0F0F0,#FFC3A0,#7FD8BE,#FF9A8B,#FAF3E0,#FFF176"
    }, this.requirementBackground = this.requirementBackground || this.primaryColor, this.requirementBorderColor = this.requirementBorderColor || this.primaryBorderColor, this.requirementBorderSize = this.requirementBorderSize || "1", this.requirementTextColor = this.requirementTextColor || this.primaryTextColor, this.relationColor = this.relationColor || this.lineColor, this.relationLabelBackground = this.relationLabelBackground || this.edgeLabelBackground, this.relationLabelColor = this.relationLabelColor || this.actorTextColor, this.git0 = this.git0 || this.primaryColor, this.git1 = this.git1 || this.secondaryColor, this.git2 = this.git2 || this.tertiaryColor, this.git3 = this.git3 || k(this.primaryColor, { h: -30 }), this.git4 = this.git4 || k(this.primaryColor, { h: -60 }), this.git5 = this.git5 || k(this.primaryColor, { h: -90 }), this.git6 = this.git6 || k(this.primaryColor, { h: 60 }), this.git7 = this.git7 || k(this.primaryColor, { h: 120 }), this.darkMode ? (this.git0 = R(this.git0, 25), this.git1 = R(this.git1, 25), this.git2 = R(this.git2, 25), this.git3 = R(this.git3, 25), this.git4 = R(this.git4, 25), this.git5 = R(this.git5, 25), this.git6 = R(this.git6, 25), this.git7 = R(this.git7, 25)) : (this.git0 = P(this.git0, 25), this.git1 = P(this.git1, 25), this.git2 = P(this.git2, 25), this.git3 = P(this.git3, 25), this.git4 = P(this.git4, 25), this.git5 = P(this.git5, 25), this.git6 = P(this.git6, 25), this.git7 = P(this.git7, 25)), this.gitInv0 = this.gitInv0 || F(this.git0), this.gitInv1 = this.gitInv1 || F(this.git1), this.gitInv2 = this.gitInv2 || F(this.git2), this.gitInv3 = this.gitInv3 || F(this.git3), this.gitInv4 = this.gitInv4 || F(this.git4), this.gitInv5 = this.gitInv5 || F(this.git5), this.gitInv6 = this.gitInv6 || F(this.git6), this.gitInv7 = this.gitInv7 || F(this.git7), this.gitBranchLabel0 = this.gitBranchLabel0 || F(this.labelTextColor), this.gitBranchLabel1 = this.gitBranchLabel1 || this.labelTextColor, this.gitBranchLabel2 = this.gitBranchLabel2 || this.labelTextColor, this.gitBranchLabel3 = this.gitBranchLabel3 || F(this.labelTextColor), this.gitBranchLabel4 = this.gitBranchLabel4 || this.labelTextColor, this.gitBranchLabel5 = this.gitBranchLabel5 || this.labelTextColor, this.gitBranchLabel6 = this.gitBranchLabel6 || this.labelTextColor, this.gitBranchLabel7 = this.gitBranchLabel7 || this.labelTextColor, this.tagLabelColor = this.tagLabelColor || this.primaryTextColor, this.tagLabelBackground = this.tagLabelBackground || this.primaryColor, this.tagLabelBorder = this.tagBorder || this.primaryBorderColor, this.tagLabelFontSize = this.tagLabelFontSize || "10px", this.commitLabelColor = this.commitLabelColor || this.secondaryTextColor, this.commitLabelBackground = this.commitLabelBackground || this.secondaryColor, this.commitLabelFontSize = this.commitLabelFontSize || "10px", this.emUiFill = this.emUiFill || "white", this.emUiStroke = this.emUiStroke || "#dbdada", this.emProcessorFill = this.emProcessorFill || "#edb3f6", this.emProcessorStroke = this.emProcessorStroke || "#b88cbf", this.emReadModelFill = this.emReadModelFill || "#d3f1a2", this.emReadModelStroke = this.emReadModelStroke || "#a3b732", this.emCommandFill = this.emCommandFill || "#bcd6fe", this.emCommandStroke = this.emCommandStroke || "#679ac3", this.emEventFill = this.emEventFill || "#ffb778", this.emEventStroke = this.emEventStroke || "#c19a0f", this.emSwimlaneBackgroundOdd = this.emSwimlaneBackgroundOdd || "rgb(250,250,250)", this.emSwimlaneBackgroundStroke = this.emSwimlaneBackgroundStroke || "rgb(240,240,240)", this.emArrowhead = this.emArrowhead || this.lineColor, this.emRelationStroke = this.emRelationStroke || this.lineColor, this.attributeBackgroundColorOdd = this.attributeBackgroundColorOdd || hr, this.attributeBackgroundColorEven = this.attributeBackgroundColorEven || cr;
  }
  calculate(t) {
    if (typeof t != "object") {
      this.updateColors();
      return;
    }
    const r = Object.keys(t);
    r.forEach((i) => {
      this[i] = t[i];
    }), this.updateColors(), r.forEach((i) => {
      this[i] = t[i];
    });
  }
}, p(Wi, "Theme"), Wi), Hb = /* @__PURE__ */ p((e) => {
  const t = new zb();
  return t.calculate(e), t;
}, "getThemeVariables"), zi, Yb = (zi = class {
  constructor() {
    this.primaryColor = "#eee", this.contrast = "#707070", this.secondaryColor = R(this.contrast, 55), this.background = "#ffffff", this.tertiaryColor = k(this.primaryColor, { h: -160 }), this.primaryBorderColor = kt(this.primaryColor, this.darkMode), this.secondaryBorderColor = kt(this.secondaryColor, this.darkMode), this.tertiaryBorderColor = kt(this.tertiaryColor, this.darkMode), this.primaryTextColor = F(this.primaryColor), this.secondaryTextColor = F(this.secondaryColor), this.tertiaryTextColor = F(this.tertiaryColor), this.lineColor = F(this.background), this.textColor = F(this.background), this.mainBkg = "#eee", this.secondBkg = "calculated", this.lineColor = "#666", this.border1 = "#999", this.border2 = "calculated", this.note = "#ffa", this.text = "#333", this.critical = "#d42", this.done = "#bbb", this.arrowheadColor = "#333333", this.fontFamily = '"trebuchet ms", verdana, arial, sans-serif', this.fontSize = "16px", this.THEME_COLOR_LIMIT = 12, this.radius = 5, this.strokeWidth = 1, this.nodeBkg = "calculated", this.nodeBorder = "calculated", this.clusterBkg = "calculated", this.clusterBorder = "calculated", this.defaultLinkColor = "calculated", this.titleColor = "calculated", this.edgeLabelBackground = "white", this.actorBorder = "calculated", this.actorBkg = "calculated", this.actorTextColor = "calculated", this.actorLineColor = this.actorBorder, this.signalColor = "calculated", this.signalTextColor = "calculated", this.labelBoxBkgColor = "calculated", this.labelBoxBorderColor = "calculated", this.labelTextColor = "calculated", this.loopTextColor = "calculated", this.noteBorderColor = "calculated", this.noteBkgColor = "calculated", this.noteTextColor = "calculated", this.activationBorderColor = "#666", this.activationBkgColor = "#f4f4f4", this.sequenceNumberColor = "white", this.sectionBkgColor = "calculated", this.altSectionBkgColor = "white", this.sectionBkgColor2 = "calculated", this.excludeBkgColor = "#eeeeee", this.taskBorderColor = "calculated", this.taskBkgColor = "calculated", this.taskTextLightColor = "white", this.taskTextColor = "calculated", this.taskTextDarkColor = "calculated", this.taskTextOutsideColor = "calculated", this.taskTextClickableColor = "#003163", this.activeTaskBorderColor = "calculated", this.activeTaskBkgColor = "calculated", this.gridColor = "calculated", this.doneTaskBkgColor = "calculated", this.doneTaskBorderColor = "calculated", this.critBkgColor = "calculated", this.critBorderColor = "calculated", this.todayLineColor = "calculated", this.vertLineColor = "calculated", this.personBorder = this.primaryBorderColor, this.personBkg = this.mainBkg, this.archEdgeColor = "calculated", this.archEdgeArrowColor = "calculated", this.archEdgeWidth = "3", this.archGroupBorderColor = this.primaryBorderColor, this.archGroupBorderWidth = "2px", this.noteFontWeight = "normal", this.fontWeight = "normal", this.rowOdd = this.rowOdd || R(this.mainBkg, 75) || "#ffffff", this.rowEven = this.rowEven || "#f4f4f4", this.labelColor = "black", this.errorBkgColor = "#552222", this.errorTextColor = "#552222", this.useGradient = !0, this.gradientStart = this.primaryBorderColor, this.gradientStop = this.secondaryBorderColor, this.dropShadow = "drop-shadow( 1px 2px 2px rgba(185,185,185,1))";
  }
  updateColors() {
    this.secondBkg = R(this.contrast, 55), this.border2 = this.contrast, this.actorBorder = R(this.border1, 23), this.actorBkg = this.mainBkg, this.actorTextColor = this.text, this.actorLineColor = this.actorBorder, this.rectBkgColor = this.rectBkgColor || this.tertiaryColor, this.signalColor = this.text, this.signalTextColor = this.text, this.labelBoxBkgColor = this.actorBkg, this.labelBoxBorderColor = this.actorBorder, this.labelTextColor = this.text, this.loopTextColor = this.text, this.noteBorderColor = "#999", this.noteBkgColor = "#666", this.noteTextColor = "#fff", this.cScale0 = this.cScale0 || "#555", this.cScale1 = this.cScale1 || "#F4F4F4", this.cScale2 = this.cScale2 || "#555", this.cScale3 = this.cScale3 || "#BBB", this.cScale4 = this.cScale4 || "#777", this.cScale5 = this.cScale5 || "#999", this.cScale6 = this.cScale6 || "#DDD", this.cScale7 = this.cScale7 || "#FFF", this.cScale8 = this.cScale8 || "#DDD", this.cScale9 = this.cScale9 || "#BBB", this.cScale10 = this.cScale10 || "#999", this.cScale11 = this.cScale11 || "#777";
    for (let t = 0; t < this.THEME_COLOR_LIMIT; t++)
      this["cScaleInv" + t] = this["cScaleInv" + t] || F(this["cScale" + t]);
    for (let t = 0; t < this.THEME_COLOR_LIMIT; t++)
      this.darkMode ? this["cScalePeer" + t] = this["cScalePeer" + t] || R(this["cScale" + t], 10) : this["cScalePeer" + t] = this["cScalePeer" + t] || P(this["cScale" + t], 10);
    this.scaleLabelColor = this.scaleLabelColor || (this.darkMode ? "black" : this.labelTextColor), this.cScaleLabel0 = this.cScaleLabel0 || this.cScale1, this.cScaleLabel2 = this.cScaleLabel2 || this.cScale1;
    for (let t = 0; t < this.THEME_COLOR_LIMIT; t++)
      this["cScaleLabel" + t] = this["cScaleLabel" + t] || this.scaleLabelColor;
    for (let t = 0; t < 5; t++)
      this["surface" + t] = this["surface" + t] || k(this.mainBkg, { l: -(5 + t * 5) }), this["surfacePeer" + t] = this["surfacePeer" + t] || k(this.mainBkg, { l: -(8 + t * 5) });
    this.nodeBkg = this.mainBkg, this.nodeBorder = this.border1, this.clusterBkg = this.secondBkg, this.clusterBorder = this.border2, this.defaultLinkColor = this.lineColor, this.titleColor = this.text, this.sectionBkgColor = R(this.contrast, 30), this.sectionBkgColor2 = R(this.contrast, 30), this.taskBorderColor = P(this.contrast, 10), this.taskBkgColor = this.contrast, this.taskTextColor = this.taskTextLightColor, this.taskTextDarkColor = this.text, this.taskTextOutsideColor = this.taskTextDarkColor, this.activeTaskBorderColor = this.taskBorderColor, this.activeTaskBkgColor = this.mainBkg, this.gridColor = R(this.border1, 30), this.doneTaskBkgColor = this.done, this.doneTaskBorderColor = this.lineColor, this.critBkgColor = this.critical, this.critBorderColor = P(this.critBkgColor, 10), this.todayLineColor = this.critBkgColor, this.vertLineColor = this.critBkgColor, this.archEdgeColor = this.lineColor, this.archEdgeArrowColor = this.lineColor, this.transitionColor = this.transitionColor || "#000", this.transitionLabelColor = this.transitionLabelColor || this.textColor, this.stateLabelColor = this.stateLabelColor || this.stateBkg || this.primaryTextColor, this.stateBkg = this.stateBkg || this.mainBkg, this.labelBackgroundColor = this.labelBackgroundColor || this.stateBkg, this.compositeBackground = this.compositeBackground || this.background || this.tertiaryColor, this.altBackground = this.altBackground || "#f4f4f4", this.compositeTitleBackground = this.compositeTitleBackground || this.mainBkg, this.stateBorder = this.stateBorder || "#000", this.innerEndBackground = this.primaryBorderColor, this.specialStateColor = "#222", this.errorBkgColor = this.errorBkgColor || this.tertiaryColor, this.errorTextColor = this.errorTextColor || this.tertiaryTextColor, this.classText = this.primaryTextColor, this.fillType0 = this.primaryColor, this.fillType1 = this.secondaryColor, this.fillType2 = k(this.primaryColor, { h: 64 }), this.fillType3 = k(this.secondaryColor, { h: 64 }), this.fillType4 = k(this.primaryColor, { h: -64 }), this.fillType5 = k(this.secondaryColor, { h: -64 }), this.fillType6 = k(this.primaryColor, { h: 128 }), this.fillType7 = k(this.secondaryColor, { h: 128 });
    for (let t = 0; t < this.THEME_COLOR_LIMIT; t++)
      this["pie" + t] = this["cScale" + t];
    this.pie12 = this.pie0, this.pieTitleTextSize = this.pieTitleTextSize || "25px", this.pieTitleTextColor = this.pieTitleTextColor || this.taskTextDarkColor, this.pieSectionTextSize = this.pieSectionTextSize || "17px", this.pieSectionTextColor = this.pieSectionTextColor || this.textColor, this.pieLegendTextSize = this.pieLegendTextSize || "17px", this.pieLegendTextColor = this.pieLegendTextColor || this.taskTextDarkColor, this.pieStrokeColor = this.pieStrokeColor || "black", this.pieStrokeWidth = this.pieStrokeWidth || "2px", this.pieOuterStrokeWidth = this.pieOuterStrokeWidth || "2px", this.pieOuterStrokeColor = this.pieOuterStrokeColor || "black", this.pieOpacity = this.pieOpacity || "0.7";
    for (let t = 0; t < 8; t++)
      this["venn" + (t + 1)] = this["venn" + (t + 1)] ?? this["cScale" + t];
    this.vennTitleTextColor = this.vennTitleTextColor ?? this.titleColor, this.vennSetTextColor = this.vennSetTextColor ?? this.textColor, this.cynefin = {
      domainFontSize: this.cynefin?.domainFontSize || 16,
      itemFontSize: this.cynefin?.itemFontSize || 12,
      boundaryColor: this.cynefin?.boundaryColor || this.lineColor,
      boundaryWidth: this.cynefin?.boundaryWidth || 2,
      cliffColor: this.cynefin?.cliffColor || "#8B0000",
      cliffWidth: this.cynefin?.cliffWidth || 4,
      arrowColor: this.cynefin?.arrowColor || this.lineColor,
      arrowWidth: this.cynefin?.arrowWidth || 2,
      complexBg: this.cynefin?.complexBg || "#E8F5E9",
      complicatedBg: this.cynefin?.complicatedBg || "#E3F2FD",
      chaoticBg: this.cynefin?.chaoticBg || "#FBE9E7",
      clearBg: this.cynefin?.clearBg || "#FFF8E1",
      confusionBg: this.cynefin?.confusionBg || "#F3E5F5",
      textColor: this.cynefin?.textColor || this.textColor,
      labelColor: this.cynefin?.labelColor || this.primaryTextColor
    }, this.quadrant1Fill = this.quadrant1Fill || this.primaryColor, this.quadrant2Fill = this.quadrant2Fill || k(this.primaryColor, { r: 5, g: 5, b: 5 }), this.quadrant3Fill = this.quadrant3Fill || k(this.primaryColor, { r: 10, g: 10, b: 10 }), this.quadrant4Fill = this.quadrant4Fill || k(this.primaryColor, { r: 15, g: 15, b: 15 }), this.quadrant1TextFill = this.quadrant1TextFill || this.primaryTextColor, this.quadrant2TextFill = this.quadrant2TextFill || k(this.primaryTextColor, { r: -5, g: -5, b: -5 }), this.quadrant3TextFill = this.quadrant3TextFill || k(this.primaryTextColor, { r: -10, g: -10, b: -10 }), this.quadrant4TextFill = this.quadrant4TextFill || k(this.primaryTextColor, { r: -15, g: -15, b: -15 }), this.quadrantPointFill = this.quadrantPointFill || Ke(this.quadrant1Fill) ? R(this.quadrant1Fill) : P(this.quadrant1Fill), this.quadrantPointTextFill = this.quadrantPointTextFill || this.primaryTextColor, this.quadrantXAxisTextFill = this.quadrantXAxisTextFill || this.primaryTextColor, this.quadrantYAxisTextFill = this.quadrantYAxisTextFill || this.primaryTextColor, this.quadrantInternalBorderStrokeFill = this.quadrantInternalBorderStrokeFill || this.primaryBorderColor, this.quadrantExternalBorderStrokeFill = this.quadrantExternalBorderStrokeFill || this.primaryBorderColor, this.quadrantTitleFill = this.quadrantTitleFill || this.primaryTextColor, this.xyChart = {
      backgroundColor: this.xyChart?.backgroundColor || this.background,
      titleColor: this.xyChart?.titleColor || this.primaryTextColor,
      dataLabelColor: this.xyChart?.dataLabelColor || this.primaryTextColor,
      legendTextColor: this.xyChart?.legendTextColor || this.primaryTextColor,
      xAxisTitleColor: this.xyChart?.xAxisTitleColor || this.primaryTextColor,
      xAxisLabelColor: this.xyChart?.xAxisLabelColor || this.primaryTextColor,
      xAxisTickColor: this.xyChart?.xAxisTickColor || this.primaryTextColor,
      xAxisLineColor: this.xyChart?.xAxisLineColor || this.primaryTextColor,
      yAxisTitleColor: this.xyChart?.yAxisTitleColor || this.primaryTextColor,
      yAxisLabelColor: this.xyChart?.yAxisLabelColor || this.primaryTextColor,
      yAxisTickColor: this.xyChart?.yAxisTickColor || this.primaryTextColor,
      yAxisLineColor: this.xyChart?.yAxisLineColor || this.primaryTextColor,
      plotColorPalette: this.xyChart?.plotColorPalette || "#EEE,#6BB8E4,#8ACB88,#C7ACD6,#E8DCC2,#FFB2A8,#FFF380,#7E8D91,#FFD8B1,#FAF3E0"
    }, this.radar = {
      axisColor: this.radar?.axisColor || this.lineColor,
      axisStrokeWidth: this.radar?.axisStrokeWidth || 2,
      axisLabelFontSize: this.radar?.axisLabelFontSize || 12,
      curveOpacity: this.radar?.curveOpacity || 0.5,
      curveStrokeWidth: this.radar?.curveStrokeWidth || 2,
      graticuleColor: this.radar?.graticuleColor || "#DEDEDE",
      graticuleStrokeWidth: this.radar?.graticuleStrokeWidth || 1,
      graticuleOpacity: this.radar?.graticuleOpacity || 0.3,
      legendBoxSize: this.radar?.legendBoxSize || 12,
      legendFontSize: this.radar?.legendFontSize || 12
    }, this.wardleyEvolutionColor = this.wardleyEvolutionColor || "#dc3545", this.wardley = {
      backgroundColor: this.wardley?.backgroundColor || this.background,
      axisColor: this.wardley?.axisColor || this.lineColor,
      axisTextColor: this.wardley?.axisTextColor || this.primaryTextColor,
      gridColor: this.wardley?.gridColor || this.gridColor,
      componentFill: this.wardley?.componentFill || this.background,
      componentStroke: this.wardley?.componentStroke || this.lineColor,
      componentLabelColor: this.wardley?.componentLabelColor || this.primaryTextColor,
      linkStroke: this.wardley?.linkStroke || this.lineColor,
      evolutionStroke: this.wardley?.evolutionStroke || this.wardleyEvolutionColor,
      annotationStroke: this.wardley?.annotationStroke || this.lineColor,
      annotationTextColor: this.wardley?.annotationTextColor || this.primaryTextColor,
      annotationFill: this.wardley?.annotationFill || this.background
    }, this.requirementBackground = this.requirementBackground || this.primaryColor, this.requirementBorderColor = this.requirementBorderColor || this.primaryBorderColor, this.requirementBorderSize = this.requirementBorderSize || "1", this.requirementTextColor = this.requirementTextColor || this.primaryTextColor, this.relationColor = this.relationColor || this.lineColor, this.relationLabelBackground = this.relationLabelBackground || this.edgeLabelBackground, this.relationLabelColor = this.relationLabelColor || this.actorTextColor, this.git0 = P(this.pie1, 25) || this.primaryColor, this.git1 = this.pie2 || this.secondaryColor, this.git2 = this.pie3 || this.tertiaryColor, this.git3 = this.pie4 || k(this.primaryColor, { h: -30 }), this.git4 = this.pie5 || k(this.primaryColor, { h: -60 }), this.git5 = this.pie6 || k(this.primaryColor, { h: -90 }), this.git6 = this.pie7 || k(this.primaryColor, { h: 60 }), this.git7 = this.pie8 || k(this.primaryColor, { h: 120 }), this.gitInv0 = this.gitInv0 || F(this.git0), this.gitInv1 = this.gitInv1 || F(this.git1), this.gitInv2 = this.gitInv2 || F(this.git2), this.gitInv3 = this.gitInv3 || F(this.git3), this.gitInv4 = this.gitInv4 || F(this.git4), this.gitInv5 = this.gitInv5 || F(this.git5), this.gitInv6 = this.gitInv6 || F(this.git6), this.gitInv7 = this.gitInv7 || F(this.git7), this.branchLabelColor = this.branchLabelColor || this.labelTextColor, this.gitBranchLabel0 = this.branchLabelColor, this.gitBranchLabel1 = "white", this.gitBranchLabel2 = this.branchLabelColor, this.gitBranchLabel3 = "white", this.gitBranchLabel4 = this.branchLabelColor, this.gitBranchLabel5 = this.branchLabelColor, this.gitBranchLabel6 = this.branchLabelColor, this.gitBranchLabel7 = this.branchLabelColor, this.tagLabelColor = this.tagLabelColor || this.primaryTextColor, this.tagLabelBackground = this.tagLabelBackground || this.primaryColor, this.tagLabelBorder = this.tagBorder || this.primaryBorderColor, this.tagLabelFontSize = this.tagLabelFontSize || "10px", this.commitLabelColor = this.commitLabelColor || this.secondaryTextColor, this.commitLabelBackground = this.commitLabelBackground || this.secondaryColor, this.commitLabelFontSize = this.commitLabelFontSize || "10px", this.emUiFill = this.emUiFill || "white", this.emUiStroke = this.emUiStroke || "#dbdada", this.emProcessorFill = this.emProcessorFill || "#edb3f6", this.emProcessorStroke = this.emProcessorStroke || "#b88cbf", this.emReadModelFill = this.emReadModelFill || "#d3f1a2", this.emReadModelStroke = this.emReadModelStroke || "#a3b732", this.emCommandFill = this.emCommandFill || "#bcd6fe", this.emCommandStroke = this.emCommandStroke || "#679ac3", this.emEventFill = this.emEventFill || "#ffb778", this.emEventStroke = this.emEventStroke || "#c19a0f", this.emSwimlaneBackgroundOdd = this.emSwimlaneBackgroundOdd || "rgb(250,250,250)", this.emSwimlaneBackgroundStroke = this.emSwimlaneBackgroundStroke || "rgb(240,240,240)", this.emArrowhead = this.emArrowhead || this.lineColor, this.emRelationStroke = this.emRelationStroke || this.lineColor, this.attributeBackgroundColorOdd = this.attributeBackgroundColorOdd || hr, this.attributeBackgroundColorEven = this.attributeBackgroundColorEven || cr;
  }
  calculate(t) {
    if (typeof t != "object") {
      this.updateColors();
      return;
    }
    const r = Object.keys(t);
    r.forEach((i) => {
      this[i] = t[i];
    }), this.updateColors(), r.forEach((i) => {
      this[i] = t[i];
    });
  }
}, p(zi, "Theme"), zi), Ub = /* @__PURE__ */ p((e) => {
  const t = new Yb();
  return t.calculate(e), t;
}, "getThemeVariables"), Hi, Xb = (Hi = class {
  constructor() {
    this.background = "#ffffff", this.primaryColor = "#cccccc", this.mainBkg = "#ffffff", this.noteBkgColor = "#fff5ad", this.noteTextColor = "#333", this.THEME_COLOR_LIMIT = 12, this.radius = 3, this.strokeWidth = 2, this.primaryBorderColor = kt(this.primaryColor, this.darkMode), this.fontFamily = "arial, sans-serif", this.fontSize = "14px", this.nodeBorder = "#000000", this.stateBorder = "#000000", this.useGradient = !0, this.gradientStart = "#0042eb", this.gradientStop = "#eb0042", this.dropShadow = "drop-shadow( 0px 1px 2px rgba(0, 0, 0, 0.25));", this.tertiaryColor = "#ffffff", this.archEdgeColor = "calculated", this.archEdgeArrowColor = "calculated", this.archEdgeWidth = "3", this.archGroupBorderColor = this.primaryBorderColor, this.archGroupBorderWidth = "2px", this.noteFontWeight = "normal", this.fontWeight = "normal";
  }
  updateColors() {
    this.primaryTextColor = this.primaryTextColor || (this.darkMode ? "#eee" : "#333"), this.secondaryColor = this.secondaryColor || k(this.primaryColor, { h: -120 }), this.tertiaryColor = this.tertiaryColor || k(this.primaryColor, { h: 180, l: 5 }), this.primaryBorderColor = this.primaryBorderColor || kt(this.primaryColor, this.darkMode), this.secondaryBorderColor = this.secondaryBorderColor || kt(this.secondaryColor, this.darkMode), this.tertiaryBorderColor = this.tertiaryBorderColor || kt(this.tertiaryColor, this.darkMode), this.noteBorderColor = this.noteBorderColor || kt(this.noteBkgColor, this.darkMode), this.noteBkgColor = this.noteBkgColor || "#fff5ad", this.noteTextColor = this.noteTextColor || "#333", this.secondaryTextColor = this.secondaryTextColor || F(this.secondaryColor), this.tertiaryTextColor = this.tertiaryTextColor || F(this.tertiaryColor), this.lineColor = this.lineColor || F(this.background), this.arrowheadColor = this.arrowheadColor || F(this.background), this.textColor = this.textColor || this.primaryTextColor, this.border2 = this.border2 || this.tertiaryBorderColor, this.nodeBkg = this.nodeBkg || this.primaryColor, this.mainBkg = this.mainBkg || this.primaryColor, this.nodeBorder = this.nodeBorder || this.primaryBorderColor, this.clusterBkg = this.clusterBkg || this.tertiaryColor, this.clusterBorder = this.clusterBorder || this.tertiaryBorderColor, this.defaultLinkColor = this.defaultLinkColor || this.lineColor, this.titleColor = this.titleColor || this.tertiaryTextColor, this.edgeLabelBackground = this.edgeLabelBackground || (this.darkMode ? P(this.secondaryColor, 30) : this.secondaryColor), this.nodeTextColor = this.nodeTextColor || this.primaryTextColor, this.actorBorder = this.actorBorder || this.primaryBorderColor, this.actorBkg = this.actorBkg || this.mainBkg, this.actorTextColor = this.actorTextColor || this.primaryTextColor, this.actorLineColor = this.actorLineColor || this.actorBorder, this.labelBoxBkgColor = this.labelBoxBkgColor || this.actorBkg, this.signalColor = this.signalColor || this.textColor, this.signalTextColor = this.signalTextColor || this.textColor, this.labelBoxBorderColor = this.labelBoxBorderColor || this.actorBorder, this.labelTextColor = this.labelTextColor || this.actorTextColor, this.loopTextColor = this.loopTextColor || this.actorTextColor, this.activationBorderColor = this.activationBorderColor || P(this.secondaryColor, 10), this.activationBkgColor = this.activationBkgColor || this.secondaryColor, this.sequenceNumberColor = this.sequenceNumberColor || F(this.lineColor), this.rectBkgColor = this.rectBkgColor || this.tertiaryColor;
    const t = "#ECECFE", r = "#E9E9F1", i = k(t, { h: 180, l: 5 });
    if (this.sectionBkgColor = this.sectionBkgColor || i, this.altSectionBkgColor = this.altSectionBkgColor || "white", this.sectionBkgColor = this.sectionBkgColor || r, this.sectionBkgColor2 = this.sectionBkgColor2 || t, this.excludeBkgColor = this.excludeBkgColor || "#eeeeee", this.taskBorderColor = this.taskBorderColor || this.primaryBorderColor, this.taskBkgColor = this.taskBkgColor || t, this.activeTaskBorderColor = this.activeTaskBorderColor || t, this.activeTaskBkgColor = this.activeTaskBkgColor || R(t, 23), this.gridColor = this.gridColor || "lightgrey", this.doneTaskBkgColor = this.doneTaskBkgColor || "lightgrey", this.doneTaskBorderColor = this.doneTaskBorderColor || "grey", this.critBorderColor = this.critBorderColor || "#ff8888", this.critBkgColor = this.critBkgColor || "red", this.todayLineColor = this.todayLineColor || "red", this.taskTextColor = this.taskTextColor || this.textColor, this.taskTextOutsideColor = this.taskTextOutsideColor || this.textColor, this.vertLineColor = this.vertLineColor || this.primaryBorderColor, this.taskTextLightColor = this.taskTextLightColor || this.textColor, this.taskTextColor = this.taskTextColor || this.primaryTextColor, this.taskTextDarkColor = this.taskTextDarkColor || this.textColor, this.taskTextClickableColor = this.taskTextClickableColor || "#003163", this.archEdgeColor = this.lineColor, this.archEdgeArrowColor = this.lineColor, this.personBorder = this.personBorder || this.primaryBorderColor, this.personBkg = this.personBkg || this.mainBkg, this.transitionColor = this.transitionColor || this.lineColor, this.transitionLabelColor = this.transitionLabelColor || this.textColor, this.stateLabelColor = this.stateLabelColor || this.stateBkg || this.primaryTextColor, this.stateBkg = this.stateBkg || this.mainBkg, this.labelBackgroundColor = this.labelBackgroundColor || this.stateBkg, this.compositeBackground = this.compositeBackground || this.background || this.tertiaryColor, this.altBackground = this.altBackground || "#f0f0f0", this.compositeTitleBackground = this.compositeTitleBackground || this.mainBkg, this.compositeBorder = this.compositeBorder || this.nodeBorder, this.innerEndBackground = this.nodeBorder, this.errorBkgColor = this.errorBkgColor || this.tertiaryColor, this.errorTextColor = this.errorTextColor || this.tertiaryTextColor, this.transitionColor = this.transitionColor || this.lineColor, this.specialStateColor = this.lineColor, this.cScale0 = this.cScale0 || t, this.cScale1 = this.cScale1 || r, this.cScale2 = this.cScale2 || i, this.cScale3 = this.cScale3 || k(t, { h: 30 }), this.cScale4 = this.cScale4 || k(t, { h: 60 }), this.cScale5 = this.cScale5 || k(t, { h: 90 }), this.cScale6 = this.cScale6 || k(t, { h: 120 }), this.cScale7 = this.cScale7 || k(t, { h: 150 }), this.cScale8 = this.cScale8 || k(t, { h: 210, l: 150 }), this.cScale9 = this.cScale9 || k(t, { h: 270 }), this.cScale10 = this.cScale10 || k(t, { h: 300 }), this.cScale11 = this.cScale11 || k(t, { h: 330 }), this.darkMode)
      for (let o = 0; o < this.THEME_COLOR_LIMIT; o++)
        this["cScale" + o] = P(this["cScale" + o], 75);
    else
      for (let o = 0; o < this.THEME_COLOR_LIMIT; o++)
        this["cScale" + o] = P(this["cScale" + o], 25);
    for (let o = 0; o < this.THEME_COLOR_LIMIT; o++)
      this["cScaleInv" + o] = this["cScaleInv" + o] || F(this["cScale" + o]);
    for (let o = 0; o < this.THEME_COLOR_LIMIT; o++)
      this.darkMode ? this["cScalePeer" + o] = this["cScalePeer" + o] || R(this["cScale" + o], 10) : this["cScalePeer" + o] = this["cScalePeer" + o] || P(this["cScale" + o], 10);
    this.scaleLabelColor = this.scaleLabelColor || this.labelTextColor;
    for (let o = 0; o < this.THEME_COLOR_LIMIT; o++)
      this["cScaleLabel" + o] = this["cScaleLabel" + o] || this.scaleLabelColor;
    const s = this.darkMode ? -4 : -1;
    for (let o = 0; o < 5; o++)
      this["surface" + o] = this["surface" + o] || k(this.mainBkg, { h: 180, s: -15, l: s * (5 + o * 3) }), this["surfacePeer" + o] = this["surfacePeer" + o] || k(this.mainBkg, { h: 180, s: -15, l: s * (8 + o * 3) });
    this.classText = this.classText || this.textColor, this.fillType0 = this.fillType0 || t, this.fillType1 = this.fillType1 || r, this.fillType2 = this.fillType2 || k(t, { h: 64 }), this.fillType3 = this.fillType3 || k(r, { h: 64 }), this.fillType4 = this.fillType4 || k(t, { h: -64 }), this.fillType5 = this.fillType5 || k(r, { h: -64 }), this.fillType6 = this.fillType6 || k(t, { h: 128 }), this.fillType7 = this.fillType7 || k(r, { h: 128 }), this.pie1 = this.pie1 || t, this.pie2 = this.pie2 || r, this.pie3 = this.pie3 || i, this.pie4 = this.pie4 || k(t, { l: -10 }), this.pie5 = this.pie5 || k(r, { l: -10 }), this.pie6 = this.pie6 || k(i, { l: -10 }), this.pie7 = this.pie7 || k(t, { h: 60, l: -10 }), this.pie8 = this.pie8 || k(t, { h: -60, l: -10 }), this.pie9 = this.pie9 || k(t, { h: 120, l: 0 }), this.pie10 = this.pie10 || k(t, { h: 60, l: -20 }), this.pie11 = this.pie11 || k(t, { h: -60, l: -20 }), this.pie12 = this.pie12 || k(t, { h: 120, l: -10 }), this.pieTitleTextSize = this.pieTitleTextSize || "25px", this.pieTitleTextColor = this.pieTitleTextColor || this.taskTextDarkColor, this.pieSectionTextSize = this.pieSectionTextSize || "17px", this.pieSectionTextColor = this.pieSectionTextColor || this.textColor, this.pieLegendTextSize = this.pieLegendTextSize || "17px", this.pieLegendTextColor = this.pieLegendTextColor || this.taskTextDarkColor, this.pieStrokeColor = this.pieStrokeColor || "black", this.pieStrokeWidth = this.pieStrokeWidth || "2px", this.pieOuterStrokeWidth = this.pieOuterStrokeWidth || "2px", this.pieOuterStrokeColor = this.pieOuterStrokeColor || "black", this.pieOpacity = this.pieOpacity || "0.7", this.vennTitleTextColor = this.vennTitleTextColor ?? this.titleColor, this.vennSetTextColor = this.vennSetTextColor ?? this.textColor, this.quadrant1Fill = this.quadrant1Fill || t, this.quadrant2Fill = this.quadrant2Fill || k(t, { r: 5, g: 5, b: 5 }), this.quadrant3Fill = this.quadrant3Fill || k(t, { r: 10, g: 10, b: 10 }), this.quadrant4Fill = this.quadrant4Fill || k(t, { r: 15, g: 15, b: 15 }), this.quadrant1TextFill = this.quadrant1TextFill || this.primaryTextColor, this.quadrant2TextFill = this.quadrant2TextFill || k(this.primaryTextColor, { r: -5, g: -5, b: -5 }), this.quadrant3TextFill = this.quadrant3TextFill || k(this.primaryTextColor, { r: -10, g: -10, b: -10 }), this.quadrant4TextFill = this.quadrant4TextFill || k(this.primaryTextColor, { r: -15, g: -15, b: -15 }), this.quadrantPointFill = this.quadrantPointFill || Ke(this.quadrant1Fill) ? R(this.quadrant1Fill) : P(this.quadrant1Fill), this.quadrantPointTextFill = this.quadrantPointTextFill || this.primaryTextColor, this.quadrantXAxisTextFill = this.quadrantXAxisTextFill || this.primaryTextColor, this.quadrantYAxisTextFill = this.quadrantYAxisTextFill || this.primaryTextColor, this.quadrantInternalBorderStrokeFill = this.quadrantInternalBorderStrokeFill || this.primaryBorderColor, this.quadrantExternalBorderStrokeFill = this.quadrantExternalBorderStrokeFill || this.primaryBorderColor, this.quadrantTitleFill = this.quadrantTitleFill || this.primaryTextColor, this.xyChart = {
      backgroundColor: this.xyChart?.backgroundColor || this.background,
      titleColor: this.xyChart?.titleColor || this.primaryTextColor,
      legendTextColor: this.xyChart?.legendTextColor || this.primaryTextColor,
      xAxisTitleColor: this.xyChart?.xAxisTitleColor || this.primaryTextColor,
      xAxisLabelColor: this.xyChart?.xAxisLabelColor || this.primaryTextColor,
      xAxisTickColor: this.xyChart?.xAxisTickColor || this.primaryTextColor,
      xAxisLineColor: this.xyChart?.xAxisLineColor || this.primaryTextColor,
      yAxisTitleColor: this.xyChart?.yAxisTitleColor || this.primaryTextColor,
      yAxisLabelColor: this.xyChart?.yAxisLabelColor || this.primaryTextColor,
      yAxisTickColor: this.xyChart?.yAxisTickColor || this.primaryTextColor,
      yAxisLineColor: this.xyChart?.yAxisLineColor || this.primaryTextColor,
      plotColorPalette: this.xyChart?.plotColorPalette || "#FFF4DD,#FFD8B1,#FFA07A,#ECEFF1,#D6DBDF,#C3E0A8,#FFB6A4,#FFD74D,#738FA7,#FFFFF0"
    }, this.requirementBackground = this.requirementBackground || t, this.requirementBorderColor = this.requirementBorderColor || this.primaryBorderColor, this.requirementBorderSize = this.requirementBorderSize || "1", this.requirementTextColor = this.requirementTextColor || this.primaryTextColor, this.relationColor = this.relationColor || this.lineColor, this.relationLabelBackground = this.relationLabelBackground || (this.darkMode ? P(this.secondaryColor, 30) : this.secondaryColor), this.relationLabelColor = this.relationLabelColor || this.actorTextColor, this.git0 = this.git0 || t, this.git1 = this.git1 || r, this.git2 = this.git2 || i, this.git3 = this.git3 || k(t, { h: -30 }), this.git4 = this.git4 || k(t, { h: -60 }), this.git5 = this.git5 || k(t, { h: -90 }), this.git6 = this.git6 || k(t, { h: 60 }), this.git7 = this.git7 || k(t, { h: 120 }), this.darkMode ? (this.git0 = R(this.git0, 25), this.git1 = R(this.git1, 25), this.git2 = R(this.git2, 25), this.git3 = R(this.git3, 25), this.git4 = R(this.git4, 25), this.git5 = R(this.git5, 25), this.git6 = R(this.git6, 25), this.git7 = R(this.git7, 25)) : (this.git0 = P(this.git0, 25), this.git1 = P(this.git1, 25), this.git2 = P(this.git2, 25), this.git3 = P(this.git3, 25), this.git4 = P(this.git4, 25), this.git5 = P(this.git5, 25), this.git6 = P(this.git6, 25), this.git7 = P(this.git7, 25)), this.gitInv0 = this.gitInv0 || F(this.git0), this.gitInv1 = this.gitInv1 || F(this.git1), this.gitInv2 = this.gitInv2 || F(this.git2), this.gitInv3 = this.gitInv3 || F(this.git3), this.gitInv4 = this.gitInv4 || F(this.git4), this.gitInv5 = this.gitInv5 || F(this.git5), this.gitInv6 = this.gitInv6 || F(this.git6), this.gitInv7 = this.gitInv7 || F(this.git7), this.branchLabelColor = this.branchLabelColor || (this.darkMode ? "black" : this.labelTextColor), this.gitBranchLabel0 = this.gitBranchLabel0 || this.branchLabelColor, this.gitBranchLabel1 = this.gitBranchLabel1 || this.branchLabelColor, this.gitBranchLabel2 = this.gitBranchLabel2 || this.branchLabelColor, this.gitBranchLabel3 = this.gitBranchLabel3 || this.branchLabelColor, this.gitBranchLabel4 = this.gitBranchLabel4 || this.branchLabelColor, this.gitBranchLabel5 = this.gitBranchLabel5 || this.branchLabelColor, this.gitBranchLabel6 = this.gitBranchLabel6 || this.branchLabelColor, this.gitBranchLabel7 = this.gitBranchLabel7 || this.branchLabelColor, this.tagLabelColor = this.tagLabelColor || this.primaryTextColor, this.tagLabelBackground = this.tagLabelBackground || this.primaryColor, this.tagLabelBorder = this.tagBorder || this.primaryBorderColor, this.tagLabelFontSize = this.tagLabelFontSize || "10px", this.commitLabelColor = this.commitLabelColor || this.secondaryTextColor, this.commitLabelBackground = this.commitLabelBackground || this.secondaryColor, this.commitLabelFontSize = this.commitLabelFontSize || "10px", this.attributeBackgroundColorOdd = this.attributeBackgroundColorOdd || hr, this.attributeBackgroundColorEven = this.attributeBackgroundColorEven || cr;
  }
  calculate(t) {
    if (typeof t != "object") {
      this.updateColors();
      return;
    }
    const r = Object.keys(t);
    r.forEach((i) => {
      this[i] = t[i];
    }), this.updateColors(), r.forEach((i) => {
      this[i] = t[i];
    });
  }
}, p(Hi, "Theme"), Hi), jb = /* @__PURE__ */ p((e) => {
  const t = new Xb();
  return t.calculate(e), t;
}, "getThemeVariables"), Yi, Gb = (Yi = class {
  constructor() {
    this.background = "#333", this.primaryColor = "#1f2020", this.secondaryColor = R(this.primaryColor, 16), this.tertiaryColor = k(this.primaryColor, { h: -160 }), this.primaryBorderColor = F(this.background), this.secondaryBorderColor = kt(this.secondaryColor, this.darkMode), this.tertiaryBorderColor = kt(this.tertiaryColor, this.darkMode), this.primaryTextColor = F(this.primaryColor), this.secondaryTextColor = F(this.secondaryColor), this.tertiaryTextColor = F(this.tertiaryColor), this.mainBkg = "#2a2020", this.secondBkg = "calculated", this.mainContrastColor = "lightgrey", this.darkTextColor = R(F("#323D47"), 10), this.border1 = "#ccc", this.border2 = Hr(255, 255, 255, 0.25), this.arrowheadColor = F(this.background), this.fontFamily = "arial, sans-serif", this.fontSize = "14px", this.labelBackground = "#181818", this.textColor = "#ccc", this.THEME_COLOR_LIMIT = 12, this.radius = 3, this.strokeWidth = 1, this.noteBkgColor = "#fff5ad", this.noteTextColor = "#333", this.THEME_COLOR_LIMIT = 12, this.fontFamily = "arial, sans-serif", this.fontSize = "14px", this.useGradient = !0, this.gradientStart = "#0042eb", this.gradientStop = "#eb0042", this.dropShadow = "drop-shadow( 1px 2px 2px rgba(185,185,185,0.2))", this.archEdgeColor = "calculated", this.archEdgeArrowColor = "calculated", this.archEdgeWidth = "3", this.archGroupBorderColor = this.primaryBorderColor, this.archGroupBorderWidth = "2px", this.noteFontWeight = "normal", this.fontWeight = "normal";
  }
  updateColors() {
    if (this.primaryTextColor = this.primaryTextColor || (this.darkMode ? "#eee" : "#333"), this.secondaryColor = this.secondaryColor || k(this.primaryColor, { h: -120 }), this.tertiaryColor = this.tertiaryColor || k(this.primaryColor, { h: 180, l: 5 }), this.primaryBorderColor = this.primaryBorderColor || kt(this.primaryColor, this.darkMode), this.secondaryBorderColor = this.secondaryBorderColor || kt(this.secondaryColor, this.darkMode), this.tertiaryBorderColor = this.tertiaryBorderColor || kt(this.tertiaryColor, this.darkMode), this.noteBorderColor = this.noteBorderColor || kt(this.noteBkgColor, this.darkMode), this.noteBkgColor = this.noteBkgColor || "#fff5ad", this.noteTextColor = this.noteTextColor || "#333", this.secondaryTextColor = this.secondaryTextColor || F(this.secondaryColor), this.tertiaryTextColor = this.tertiaryTextColor || F(this.tertiaryColor), this.lineColor = this.lineColor || F(this.background), this.arrowheadColor = this.arrowheadColor || F(this.background), this.textColor = this.textColor || this.primaryTextColor, this.border2 = this.border2 || this.tertiaryBorderColor, this.nodeBkg = this.nodeBkg || this.primaryColor, this.mainBkg = this.mainBkg || this.primaryColor, this.nodeBorder = this.nodeBorder || this.border1, this.clusterBkg = this.clusterBkg || this.tertiaryColor, this.clusterBorder = this.clusterBorder || this.tertiaryBorderColor, this.defaultLinkColor = this.defaultLinkColor || this.lineColor, this.titleColor = this.titleColor || this.tertiaryTextColor, this.edgeLabelBackground = this.edgeLabelBackground || (this.darkMode ? P(this.secondaryColor, 30) : this.secondaryColor), this.nodeTextColor = this.nodeTextColor || this.primaryTextColor, this.actorBorder = this.actorBorder || this.primaryBorderColor, this.actorBkg = this.actorBkg || this.mainBkg, this.actorTextColor = this.actorTextColor || this.primaryTextColor, this.actorLineColor = this.actorLineColor || this.actorBorder, this.labelBoxBkgColor = this.labelBoxBkgColor || this.actorBkg, this.signalColor = this.signalColor || this.textColor, this.signalTextColor = this.signalTextColor || this.textColor, this.labelBoxBorderColor = this.labelBoxBorderColor || this.actorBorder, this.labelTextColor = this.labelTextColor || this.actorTextColor, this.loopTextColor = this.loopTextColor || this.actorTextColor, this.activationBorderColor = this.activationBorderColor || P(this.secondaryColor, 10), this.activationBkgColor = this.activationBkgColor || this.secondaryColor, this.sequenceNumberColor = this.sequenceNumberColor || F(this.lineColor), this.rectBkgColor = this.rectBkgColor || this.tertiaryColor, this.sectionBkgColor = this.sectionBkgColor || this.tertiaryColor, this.altSectionBkgColor = this.altSectionBkgColor || "white", this.sectionBkgColor = this.sectionBkgColor || this.secondaryColor, this.sectionBkgColor2 = this.sectionBkgColor2 || this.primaryColor, this.excludeBkgColor = this.excludeBkgColor || "#eeeeee", this.taskBorderColor = this.taskBorderColor || this.primaryBorderColor, this.taskBkgColor = this.taskBkgColor || this.primaryColor, this.activeTaskBorderColor = this.activeTaskBorderColor || this.primaryColor, this.activeTaskBkgColor = this.activeTaskBkgColor || R(this.primaryColor, 23), this.gridColor = this.gridColor || "lightgrey", this.doneTaskBkgColor = this.doneTaskBkgColor || "lightgrey", this.doneTaskBorderColor = this.doneTaskBorderColor || "grey", this.critBorderColor = this.critBorderColor || "#ff8888", this.critBkgColor = this.critBkgColor || "red", this.todayLineColor = this.todayLineColor || "red", this.vertLineColor = this.vertLineColor || this.primaryBorderColor, this.taskTextColor = this.taskTextColor || this.textColor, this.taskTextOutsideColor = this.taskTextOutsideColor || this.textColor, this.taskTextLightColor = this.taskTextLightColor || this.textColor, this.taskTextColor = this.taskTextColor || this.primaryTextColor, this.taskTextDarkColor = this.taskTextDarkColor || this.textColor, this.taskTextClickableColor = this.taskTextClickableColor || "#003163", this.archEdgeColor = this.lineColor, this.archEdgeArrowColor = this.lineColor, this.personBorder = this.personBorder || this.primaryBorderColor, this.personBkg = this.personBkg || this.mainBkg, this.transitionColor = this.transitionColor || this.lineColor, this.transitionLabelColor = this.transitionLabelColor || this.textColor, this.stateLabelColor = this.stateLabelColor || this.stateBkg || this.primaryTextColor, this.stateBkg = this.stateBkg || this.mainBkg, this.labelBackgroundColor = this.labelBackgroundColor || this.stateBkg, this.compositeBackground = this.compositeBackground || this.background || this.tertiaryColor, this.altBackground = this.altBackground || "#f0f0f0", this.compositeTitleBackground = this.compositeTitleBackground || this.mainBkg, this.compositeBorder = this.compositeBorder || this.nodeBorder, this.innerEndBackground = this.nodeBorder, this.errorBkgColor = this.errorBkgColor || this.tertiaryColor, this.errorTextColor = this.errorTextColor || this.tertiaryTextColor, this.transitionColor = this.transitionColor || this.lineColor, this.specialStateColor = this.lineColor, this.cScale0 = this.cScale0 || this.primaryColor, this.cScale1 = this.cScale1 || this.secondaryColor, this.cScale2 = this.cScale2 || this.tertiaryColor, this.cScale3 = this.cScale3 || k(this.primaryColor, { h: 30 }), this.cScale4 = this.cScale4 || k(this.primaryColor, { h: 60 }), this.cScale5 = this.cScale5 || k(this.primaryColor, { h: 90 }), this.cScale6 = this.cScale6 || k(this.primaryColor, { h: 120 }), this.cScale7 = this.cScale7 || k(this.primaryColor, { h: 150 }), this.cScale8 = this.cScale8 || k(this.primaryColor, { h: 210, l: 150 }), this.cScale9 = this.cScale9 || k(this.primaryColor, { h: 270 }), this.cScale10 = this.cScale10 || k(this.primaryColor, { h: 300 }), this.cScale11 = this.cScale11 || k(this.primaryColor, { h: 330 }), this.darkMode)
      for (let r = 0; r < this.THEME_COLOR_LIMIT; r++)
        this["cScale" + r] = P(this["cScale" + r], 75);
    else
      for (let r = 0; r < this.THEME_COLOR_LIMIT; r++)
        this["cScale" + r] = P(this["cScale" + r], 25);
    for (let r = 0; r < this.THEME_COLOR_LIMIT; r++)
      this["cScaleInv" + r] = this["cScaleInv" + r] || F(this["cScale" + r]);
    for (let r = 0; r < this.THEME_COLOR_LIMIT; r++)
      this.darkMode ? this["cScalePeer" + r] = this["cScalePeer" + r] || R(this["cScale" + r], 10) : this["cScalePeer" + r] = this["cScalePeer" + r] || P(this["cScale" + r], 10);
    this.scaleLabelColor = this.scaleLabelColor || this.labelTextColor;
    for (let r = 0; r < this.THEME_COLOR_LIMIT; r++)
      this["cScaleLabel" + r] = this["cScaleLabel" + r] || this.scaleLabelColor;
    const t = this.darkMode ? -4 : -1;
    for (let r = 0; r < 5; r++)
      this["surface" + r] = this["surface" + r] || k(this.mainBkg, { h: 180, s: -15, l: t * (5 + r * 3) }), this["surfacePeer" + r] = this["surfacePeer" + r] || k(this.mainBkg, { h: 180, s: -15, l: t * (8 + r * 3) });
    this.classText = this.classText || this.textColor, this.fillType0 = this.fillType0 || this.primaryColor, this.fillType1 = this.fillType1 || this.secondaryColor, this.fillType2 = this.fillType2 || k(this.primaryColor, { h: 64 }), this.fillType3 = this.fillType3 || k(this.secondaryColor, { h: 64 }), this.fillType4 = this.fillType4 || k(this.primaryColor, { h: -64 }), this.fillType5 = this.fillType5 || k(this.secondaryColor, { h: -64 }), this.fillType6 = this.fillType6 || k(this.primaryColor, { h: 128 }), this.fillType7 = this.fillType7 || k(this.secondaryColor, { h: 128 }), this.pie1 = this.pie1 || this.primaryColor, this.pie2 = this.pie2 || this.secondaryColor, this.pie3 = this.pie3 || this.tertiaryColor, this.pie4 = this.pie4 || k(this.primaryColor, { l: -10 }), this.pie5 = this.pie5 || k(this.secondaryColor, { l: -10 }), this.pie6 = this.pie6 || k(this.tertiaryColor, { l: -10 }), this.pie7 = this.pie7 || k(this.primaryColor, { h: 60, l: -10 }), this.pie8 = this.pie8 || k(this.primaryColor, { h: -60, l: -10 }), this.pie9 = this.pie9 || k(this.primaryColor, { h: 120, l: 0 }), this.pie10 = this.pie10 || k(this.primaryColor, { h: 60, l: -20 }), this.pie11 = this.pie11 || k(this.primaryColor, { h: -60, l: -20 }), this.pie12 = this.pie12 || k(this.primaryColor, { h: 120, l: -10 }), this.pieTitleTextSize = this.pieTitleTextSize || "25px", this.pieTitleTextColor = this.pieTitleTextColor || this.taskTextDarkColor, this.pieSectionTextSize = this.pieSectionTextSize || "17px", this.pieSectionTextColor = this.pieSectionTextColor || this.textColor, this.pieLegendTextSize = this.pieLegendTextSize || "17px", this.pieLegendTextColor = this.pieLegendTextColor || this.taskTextDarkColor, this.pieStrokeColor = this.pieStrokeColor || "black", this.pieStrokeWidth = this.pieStrokeWidth || "2px", this.pieOuterStrokeWidth = this.pieOuterStrokeWidth || "2px", this.pieOuterStrokeColor = this.pieOuterStrokeColor || "black", this.pieOpacity = this.pieOpacity || "0.7", this.vennTitleTextColor = this.vennTitleTextColor ?? this.titleColor, this.vennSetTextColor = this.vennSetTextColor ?? this.textColor, this.quadrant1Fill = this.quadrant1Fill || this.primaryColor, this.quadrant2Fill = this.quadrant2Fill || k(this.primaryColor, { r: 5, g: 5, b: 5 }), this.quadrant3Fill = this.quadrant3Fill || k(this.primaryColor, { r: 10, g: 10, b: 10 }), this.quadrant4Fill = this.quadrant4Fill || k(this.primaryColor, { r: 15, g: 15, b: 15 }), this.quadrant1TextFill = this.quadrant1TextFill || this.primaryTextColor, this.quadrant2TextFill = this.quadrant2TextFill || k(this.primaryTextColor, { r: -5, g: -5, b: -5 }), this.quadrant3TextFill = this.quadrant3TextFill || k(this.primaryTextColor, { r: -10, g: -10, b: -10 }), this.quadrant4TextFill = this.quadrant4TextFill || k(this.primaryTextColor, { r: -15, g: -15, b: -15 }), this.quadrantPointFill = this.quadrantPointFill || Ke(this.quadrant1Fill) ? R(this.quadrant1Fill) : P(this.quadrant1Fill), this.quadrantPointTextFill = this.quadrantPointTextFill || this.primaryTextColor, this.quadrantXAxisTextFill = this.quadrantXAxisTextFill || this.primaryTextColor, this.quadrantYAxisTextFill = this.quadrantYAxisTextFill || this.primaryTextColor, this.quadrantInternalBorderStrokeFill = this.quadrantInternalBorderStrokeFill || this.primaryBorderColor, this.quadrantExternalBorderStrokeFill = this.quadrantExternalBorderStrokeFill || this.primaryBorderColor, this.quadrantTitleFill = this.quadrantTitleFill || this.primaryTextColor, this.xyChart = {
      backgroundColor: this.xyChart?.backgroundColor || this.background,
      titleColor: this.xyChart?.titleColor || this.primaryTextColor,
      legendTextColor: this.xyChart?.legendTextColor || this.primaryTextColor,
      xAxisTitleColor: this.xyChart?.xAxisTitleColor || this.primaryTextColor,
      xAxisLabelColor: this.xyChart?.xAxisLabelColor || this.primaryTextColor,
      xAxisTickColor: this.xyChart?.xAxisTickColor || this.primaryTextColor,
      xAxisLineColor: this.xyChart?.xAxisLineColor || this.primaryTextColor,
      yAxisTitleColor: this.xyChart?.yAxisTitleColor || this.primaryTextColor,
      yAxisLabelColor: this.xyChart?.yAxisLabelColor || this.primaryTextColor,
      yAxisTickColor: this.xyChart?.yAxisTickColor || this.primaryTextColor,
      yAxisLineColor: this.xyChart?.yAxisLineColor || this.primaryTextColor,
      plotColorPalette: this.xyChart?.plotColorPalette || "#FFF4DD,#FFD8B1,#FFA07A,#ECEFF1,#D6DBDF,#C3E0A8,#FFB6A4,#FFD74D,#738FA7,#FFFFF0"
    }, this.requirementBackground = this.requirementBackground || this.primaryColor, this.requirementBorderColor = this.requirementBorderColor || this.primaryBorderColor, this.requirementBorderSize = this.requirementBorderSize || "1", this.requirementTextColor = this.requirementTextColor || this.primaryTextColor, this.relationColor = this.relationColor || this.lineColor, this.relationLabelBackground = this.relationLabelBackground || (this.darkMode ? P(this.secondaryColor, 30) : this.secondaryColor), this.relationLabelColor = this.relationLabelColor || this.actorTextColor, this.git0 = this.git0 || "#0b0000", this.git1 = this.git1 || "#4d1037", this.git2 = this.git2 || "#3f5258", this.git3 = this.git3 || "#4f2f1b", this.git4 = this.git4 || "#6e0a0a", this.git5 = this.git5 || "#3b0048", this.git6 = this.git6 || "#995a01", this.git7 = this.git7 || "#154706", this.gitDarkMode = !0, this.gitDarkMode ? (this.git0 = R(this.git0, 25), this.git1 = R(this.git1, 25), this.git2 = R(this.git2, 25), this.git3 = R(this.git3, 25), this.git4 = R(this.git4, 25), this.git5 = R(this.git5, 25), this.git6 = R(this.git6, 25), this.git7 = R(this.git7, 25)) : (this.git0 = P(this.git0, 25), this.git1 = P(this.git1, 25), this.git2 = P(this.git2, 25), this.git3 = P(this.git3, 25), this.git4 = P(this.git4, 25), this.git5 = P(this.git5, 25), this.git6 = P(this.git6, 25), this.git7 = P(this.git7, 25)), this.gitInv0 = this.gitInv0 || F(this.git0), this.gitInv1 = this.gitInv1 || F(this.git1), this.gitInv2 = this.gitInv2 || F(this.git2), this.gitInv3 = this.gitInv3 || F(this.git3), this.gitInv4 = this.gitInv4 || F(this.git4), this.gitInv5 = this.gitInv5 || F(this.git5), this.gitInv6 = this.gitInv6 || F(this.git6), this.gitInv7 = this.gitInv7 || F(this.git7), this.branchLabelColor = this.branchLabelColor || (this.darkMode ? "black" : this.labelTextColor), this.gitBranchLabel0 = this.gitBranchLabel0 || this.branchLabelColor, this.gitBranchLabel1 = this.gitBranchLabel1 || this.branchLabelColor, this.gitBranchLabel2 = this.gitBranchLabel2 || this.branchLabelColor, this.gitBranchLabel3 = this.gitBranchLabel3 || this.branchLabelColor, this.gitBranchLabel4 = this.gitBranchLabel4 || this.branchLabelColor, this.gitBranchLabel5 = this.gitBranchLabel5 || this.branchLabelColor, this.gitBranchLabel6 = this.gitBranchLabel6 || this.branchLabelColor, this.gitBranchLabel7 = this.gitBranchLabel7 || this.branchLabelColor, this.tagLabelColor = this.tagLabelColor || this.primaryTextColor, this.tagLabelBackground = this.tagLabelBackground || this.primaryColor, this.tagLabelBorder = this.tagBorder || this.primaryBorderColor, this.tagLabelFontSize = this.tagLabelFontSize || "10px", this.commitLabelColor = this.commitLabelColor || this.secondaryTextColor, this.commitLabelBackground = this.commitLabelBackground || this.secondaryColor, this.commitLabelFontSize = this.commitLabelFontSize || "10px", this.attributeBackgroundColorOdd = this.attributeBackgroundColorOdd || hr, this.attributeBackgroundColorEven = this.attributeBackgroundColorEven || cr;
  }
  calculate(t) {
    if (typeof t != "object") {
      this.updateColors();
      return;
    }
    const r = Object.keys(t);
    r.forEach((i) => {
      this[i] = t[i];
    }), this.updateColors(), r.forEach((i) => {
      this[i] = t[i];
    });
  }
}, p(Yi, "Theme"), Yi), Vb = /* @__PURE__ */ p((e) => {
  const t = new Gb();
  return t.calculate(e), t;
}, "getThemeVariables"), Ui, Kb = (Ui = class {
  constructor() {
    this.background = "#ffffff", this.primaryColor = "#cccccc", this.mainBkg = "#ffffff", this.noteBkgColor = "#fff5ad", this.noteTextColor = "#28253D", this.THEME_COLOR_LIMIT = 12, this.radius = 12, this.strokeWidth = 2, this.primaryBorderColor = kt("#28253D", this.darkMode), this.fontFamily = '"Recursive Variable", arial, sans-serif', this.fontSize = "14px", this.nodeBorder = "#28253D", this.stateBorder = "#28253D", this.useGradient = !1, this.gradientStart = "#0042eb", this.gradientStop = "#eb0042", this.dropShadow = "url(#drop-shadow)", this.nodeShadow = !0, this.tertiaryColor = "#ffffff", this.clusterBkg = "#F9F9FB", this.clusterBorder = "#BDBCCC", this.noteBorderColor = "#FACC15", this.archEdgeColor = "calculated", this.archEdgeArrowColor = "calculated", this.archEdgeWidth = "3", this.archGroupBorderColor = this.primaryBorderColor, this.archGroupBorderWidth = "2px", this.actorBorder = "#28253D", this.filterColor = "#000000";
  }
  updateColors() {
    this.primaryTextColor = this.primaryTextColor || (this.darkMode ? "#eee" : "#28253D"), this.secondaryColor = this.secondaryColor || k(this.primaryColor, { h: -120 }), this.tertiaryColor = this.tertiaryColor || k(this.primaryColor, { h: 180, l: 5 }), this.primaryBorderColor = this.primaryBorderColor || kt(this.primaryColor, this.darkMode), this.secondaryBorderColor = this.secondaryBorderColor || kt(this.secondaryColor, this.darkMode), this.tertiaryBorderColor = this.tertiaryBorderColor || kt(this.tertiaryColor, this.darkMode), this.noteBorderColor = this.noteBorderColor || kt(this.noteBkgColor, this.darkMode), this.noteBkgColor = this.noteBkgColor || "#FEF9C3", this.noteTextColor = this.noteTextColor || "#28253D", this.secondaryTextColor = this.secondaryTextColor || F(this.secondaryColor), this.tertiaryTextColor = this.tertiaryTextColor || F(this.tertiaryColor), this.lineColor = this.lineColor || F(this.background), this.arrowheadColor = this.arrowheadColor || F(this.background), this.textColor = this.textColor || this.primaryTextColor, this.border2 = this.border2 || this.tertiaryBorderColor, this.nodeBkg = this.nodeBkg || this.primaryColor, this.mainBkg = this.mainBkg || this.primaryColor, this.nodeBorder = this.nodeBorder || this.primaryBorderColor, this.clusterBkg = this.clusterBkg || this.tertiaryColor, this.clusterBorder = this.clusterBorder || this.tertiaryBorderColor, this.defaultLinkColor = this.defaultLinkColor || this.lineColor, this.titleColor = this.titleColor || this.tertiaryTextColor, this.edgeLabelBackground = this.edgeLabelBackground || (this.darkMode ? P(this.secondaryColor, 30) : this.secondaryColor), this.nodeTextColor = this.nodeTextColor || this.primaryTextColor, this.noteFontWeight = 600, this.actorBorder = this.actorBorder || this.primaryBorderColor, this.actorBkg = this.actorBkg || this.mainBkg, this.actorTextColor = this.actorTextColor || this.primaryTextColor, this.actorLineColor = this.actorLineColor || this.actorBorder, this.labelBoxBkgColor = this.labelBoxBkgColor || this.actorBkg, this.signalColor = this.signalColor || this.textColor, this.signalTextColor = this.signalTextColor || this.textColor, this.labelBoxBorderColor = this.labelBoxBorderColor || this.actorBorder, this.labelTextColor = this.labelTextColor || this.actorTextColor, this.loopTextColor = this.loopTextColor || this.actorTextColor, this.activationBorderColor = this.activationBorderColor || P(this.secondaryColor, 10), this.activationBkgColor = this.activationBkgColor || this.secondaryColor, this.sequenceNumberColor = this.sequenceNumberColor || F(this.lineColor), this.rectBkgColor = this.rectBkgColor || this.tertiaryColor;
    const t = "#ECECFE", r = "#E9E9F1", i = k(t, { h: 180, l: 5 });
    this.sectionBkgColor = this.sectionBkgColor || i, this.altSectionBkgColor = this.altSectionBkgColor || "white", this.sectionBkgColor = this.sectionBkgColor || r, this.sectionBkgColor2 = this.sectionBkgColor2 || t, this.excludeBkgColor = this.excludeBkgColor || "#eeeeee", this.taskBorderColor = this.taskBorderColor || this.primaryBorderColor, this.taskBkgColor = this.taskBkgColor || t, this.activeTaskBorderColor = this.activeTaskBorderColor || t, this.activeTaskBkgColor = this.activeTaskBkgColor || R(t, 23), this.gridColor = this.gridColor || "lightgrey", this.doneTaskBkgColor = this.doneTaskBkgColor || "lightgrey", this.doneTaskBorderColor = this.doneTaskBorderColor || "grey", this.critBorderColor = this.critBorderColor || "#ff8888", this.critBkgColor = this.critBkgColor || "red", this.todayLineColor = this.todayLineColor || "red", this.taskTextColor = this.taskTextColor || this.textColor, this.vertLineColor = this.vertLineColor || this.primaryBorderColor, this.taskTextOutsideColor = this.taskTextOutsideColor || this.textColor, this.taskTextLightColor = this.taskTextLightColor || this.textColor, this.taskTextColor = this.taskTextColor || this.primaryTextColor, this.taskTextDarkColor = this.taskTextDarkColor || this.textColor, this.taskTextClickableColor = this.taskTextClickableColor || "#003163", this.archEdgeColor = this.lineColor, this.archEdgeArrowColor = this.lineColor, this.personBorder = this.personBorder || this.primaryBorderColor, this.personBkg = this.personBkg || this.mainBkg, this.transitionColor = this.transitionColor || this.lineColor, this.transitionLabelColor = this.transitionLabelColor || this.textColor, this.stateLabelColor = this.stateLabelColor || this.stateBkg || this.primaryTextColor, this.compositeTitleBackground = "#F9F9FB", this.altBackground = "#F9F9FB", this.stateEdgeLabelBackground = "#FFFFFF", this.fontWeight = 600, this.stateBkg = this.stateBkg || this.mainBkg, this.labelBackgroundColor = this.labelBackgroundColor || this.stateBkg, this.compositeBackground = this.compositeBackground || this.background || this.tertiaryColor, this.altBackground = this.altBackground || "#f0f0f0", this.compositeTitleBackground = this.compositeTitleBackground || this.mainBkg, this.compositeBorder = this.compositeBorder || this.nodeBorder, this.innerEndBackground = this.nodeBorder, this.errorBkgColor = this.errorBkgColor || this.tertiaryColor, this.errorTextColor = this.errorTextColor || this.tertiaryTextColor, this.transitionColor = this.transitionColor || this.lineColor, this.specialStateColor = this.lineColor;
    for (let o = 0; o < this.THEME_COLOR_LIMIT; o++)
      this["cScale" + o] = this.mainBkg;
    if (this.darkMode)
      for (let o = 0; o < this.THEME_COLOR_LIMIT; o++)
        this["cScale" + o] = P(this["cScale" + o], 75);
    else
      for (let o = 0; o < this.THEME_COLOR_LIMIT; o++)
        this["cScale" + o] = P(this["cScale" + o], 25);
    for (let o = 0; o < this.THEME_COLOR_LIMIT; o++)
      this["cScaleInv" + o] = this["cScaleInv" + o] || F(this["cScale" + o]);
    for (let o = 0; o < this.THEME_COLOR_LIMIT; o++)
      this.darkMode ? this["cScalePeer" + o] = this["cScalePeer" + o] || R(this["cScale" + o], 10) : this["cScalePeer" + o] = this["cScalePeer" + o] || P(this["cScale" + o], 10);
    this.scaleLabelColor = this.scaleLabelColor || this.labelTextColor;
    for (let o = 0; o < this.THEME_COLOR_LIMIT; o++)
      this["cScaleLabel" + o] = this["cScaleLabel" + o] || this.scaleLabelColor;
    const s = this.darkMode ? -4 : -1;
    for (let o = 0; o < 5; o++)
      this["surface" + o] = this["surface" + o] || k(this.mainBkg, { h: 180, s: -15, l: s * (5 + o * 3) }), this["surfacePeer" + o] = this["surfacePeer" + o] || k(this.mainBkg, { h: 180, s: -15, l: s * (8 + o * 3) });
    this.classText = this.classText || this.textColor, this.fillType0 = this.fillType0 || t, this.fillType1 = this.fillType1 || r, this.fillType2 = this.fillType2 || k(t, { h: 64 }), this.fillType3 = this.fillType3 || k(r, { h: 64 }), this.fillType4 = this.fillType4 || k(t, { h: -64 }), this.fillType5 = this.fillType5 || k(r, { h: -64 }), this.fillType6 = this.fillType6 || k(t, { h: 128 }), this.fillType7 = this.fillType7 || k(r, { h: 128 }), this.pie1 = this.pie1 || t, this.pie2 = this.pie2 || r, this.pie3 = this.pie3 || i, this.pie4 = this.pie4 || k(t, { l: -10 }), this.pie5 = this.pie5 || k(r, { l: -10 }), this.pie6 = this.pie6 || k(i, { l: -10 }), this.pie7 = this.pie7 || k(t, { h: 60, l: -10 }), this.pie8 = this.pie8 || k(t, { h: -60, l: -10 }), this.pie9 = this.pie9 || k(t, { h: 120, l: 0 }), this.pie10 = this.pie10 || k(t, { h: 60, l: -20 }), this.pie11 = this.pie11 || k(t, { h: -60, l: -20 }), this.pie12 = this.pie12 || k(t, { h: 120, l: -10 }), this.pieTitleTextSize = this.pieTitleTextSize || "25px", this.pieTitleTextColor = this.pieTitleTextColor || this.taskTextDarkColor, this.pieSectionTextSize = this.pieSectionTextSize || "17px", this.pieSectionTextColor = this.pieSectionTextColor || this.textColor, this.pieLegendTextSize = this.pieLegendTextSize || "17px", this.pieLegendTextColor = this.pieLegendTextColor || this.taskTextDarkColor, this.pieStrokeColor = this.pieStrokeColor || "black", this.pieStrokeWidth = this.pieStrokeWidth || "2px", this.pieOuterStrokeWidth = this.pieOuterStrokeWidth || "2px", this.pieOuterStrokeColor = this.pieOuterStrokeColor || "black", this.pieOpacity = this.pieOpacity || "0.7", this.vennTitleTextColor = this.vennTitleTextColor ?? this.titleColor, this.vennSetTextColor = this.vennSetTextColor ?? this.textColor, this.quadrant1Fill = this.quadrant1Fill || t, this.quadrant2Fill = this.quadrant2Fill || k(t, { r: 5, g: 5, b: 5 }), this.quadrant3Fill = this.quadrant3Fill || k(t, { r: 10, g: 10, b: 10 }), this.quadrant4Fill = this.quadrant4Fill || k(t, { r: 15, g: 15, b: 15 }), this.quadrant1TextFill = this.quadrant1TextFill || this.primaryTextColor, this.quadrant2TextFill = this.quadrant2TextFill || k(this.primaryTextColor, { r: -5, g: -5, b: -5 }), this.quadrant3TextFill = this.quadrant3TextFill || k(this.primaryTextColor, { r: -10, g: -10, b: -10 }), this.quadrant4TextFill = this.quadrant4TextFill || k(this.primaryTextColor, { r: -15, g: -15, b: -15 }), this.quadrantPointFill = this.quadrantPointFill || Ke(this.quadrant1Fill) ? R(this.quadrant1Fill) : P(this.quadrant1Fill), this.quadrantPointTextFill = this.quadrantPointTextFill || this.primaryTextColor, this.quadrantXAxisTextFill = this.quadrantXAxisTextFill || this.primaryTextColor, this.quadrantYAxisTextFill = this.quadrantYAxisTextFill || this.primaryTextColor, this.quadrantInternalBorderStrokeFill = this.quadrantInternalBorderStrokeFill || this.primaryBorderColor, this.quadrantExternalBorderStrokeFill = this.quadrantExternalBorderStrokeFill || this.primaryBorderColor, this.quadrantTitleFill = this.quadrantTitleFill || this.primaryTextColor, this.xyChart = {
      backgroundColor: this.xyChart?.backgroundColor || this.background,
      titleColor: this.xyChart?.titleColor || this.primaryTextColor,
      legendTextColor: this.xyChart?.legendTextColor || this.primaryTextColor,
      xAxisTitleColor: this.xyChart?.xAxisTitleColor || this.primaryTextColor,
      xAxisLabelColor: this.xyChart?.xAxisLabelColor || this.primaryTextColor,
      xAxisTickColor: this.xyChart?.xAxisTickColor || this.primaryTextColor,
      xAxisLineColor: this.xyChart?.xAxisLineColor || this.primaryTextColor,
      yAxisTitleColor: this.xyChart?.yAxisTitleColor || this.primaryTextColor,
      yAxisLabelColor: this.xyChart?.yAxisLabelColor || this.primaryTextColor,
      yAxisTickColor: this.xyChart?.yAxisTickColor || this.primaryTextColor,
      yAxisLineColor: this.xyChart?.yAxisLineColor || this.primaryTextColor,
      plotColorPalette: this.xyChart?.plotColorPalette || "#FFF4DD,#FFD8B1,#FFA07A,#ECEFF1,#D6DBDF,#C3E0A8,#FFB6A4,#FFD74D,#738FA7,#FFFFF0"
    }, this.requirementBackground = this.requirementBackground || t, this.requirementBorderColor = this.requirementBorderColor || this.primaryBorderColor, this.requirementBorderSize = this.requirementBorderSize || "1", this.requirementTextColor = this.requirementTextColor || this.primaryTextColor, this.relationColor = this.relationColor || this.lineColor, this.relationLabelBackground = this.relationLabelBackground || (this.darkMode ? P(this.secondaryColor, 30) : this.secondaryColor), this.relationLabelColor = this.relationLabelColor || this.actorTextColor, this.requirementEdgeLabelBackground = "#FFFFFF", this.git0 = this.git0 || t, this.git1 = this.git1 || r, this.git2 = this.git2 || i, this.git3 = this.git3 || k(t, { h: -30 }), this.git4 = this.git4 || k(t, { h: -60 }), this.git5 = this.git5 || k(t, { h: -90 }), this.git6 = this.git6 || k(t, { h: 60 }), this.git7 = this.git7 || k(t, { h: 120 }), this.darkMode ? (this.git0 = R(this.git0, 25), this.git1 = R(this.git1, 25), this.git2 = R(this.git2, 25), this.git3 = R(this.git3, 25), this.git4 = R(this.git4, 25), this.git5 = R(this.git5, 25), this.git6 = R(this.git6, 25), this.git7 = R(this.git7, 25)) : (this.git0 = P(this.git0, 25), this.git1 = P(this.git1, 25), this.git2 = P(this.git2, 25), this.git3 = P(this.git3, 25), this.git4 = P(this.git4, 25), this.git5 = P(this.git5, 25), this.git6 = P(this.git6, 25), this.git7 = P(this.git7, 25)), this.gitInv0 = this.gitInv0 || F(this.git0), this.gitInv1 = this.gitInv1 || F(this.git1), this.gitInv2 = this.gitInv2 || F(this.git2), this.gitInv3 = this.gitInv3 || F(this.git3), this.gitInv4 = this.gitInv4 || F(this.git4), this.gitInv5 = this.gitInv5 || F(this.git5), this.gitInv6 = this.gitInv6 || F(this.git6), this.gitInv7 = this.gitInv7 || F(this.git7), this.branchLabelColor = this.branchLabelColor || (this.darkMode ? "black" : this.labelTextColor), this.gitBranchLabel0 = this.gitBranchLabel0 || this.branchLabelColor, this.gitBranchLabel1 = this.gitBranchLabel1 || this.branchLabelColor, this.gitBranchLabel2 = this.gitBranchLabel2 || this.branchLabelColor, this.gitBranchLabel3 = this.gitBranchLabel3 || this.branchLabelColor, this.gitBranchLabel4 = this.gitBranchLabel4 || this.branchLabelColor, this.gitBranchLabel5 = this.gitBranchLabel5 || this.branchLabelColor, this.gitBranchLabel6 = this.gitBranchLabel6 || this.branchLabelColor, this.gitBranchLabel7 = this.gitBranchLabel7 || this.branchLabelColor, this.tagLabelColor = this.tagLabelColor || this.primaryTextColor, this.tagLabelBackground = this.tagLabelBackground || this.primaryColor, this.tagLabelBorder = this.tagBorder || this.primaryBorderColor, this.tagLabelFontSize = this.tagLabelFontSize || "10px", this.commitLabelColor = this.commitLabelColor || this.secondaryTextColor, this.commitLabelBackground = this.commitLabelBackground || this.secondaryColor, this.commitLabelFontSize = this.commitLabelFontSize || "10px", this.commitLineColor = this.commitLineColor ?? "#BDBCCC", this.erEdgeLabelBackground = "#FFFFFF", this.attributeBackgroundColorOdd = this.attributeBackgroundColorOdd || hr, this.attributeBackgroundColorEven = this.attributeBackgroundColorEven || cr;
  }
  calculate(t) {
    if (typeof t != "object") {
      this.updateColors();
      return;
    }
    const r = Object.keys(t);
    r.forEach((i) => {
      this[i] = t[i];
    }), this.updateColors(), r.forEach((i) => {
      this[i] = t[i];
    });
  }
}, p(Ui, "Theme"), Ui), Zb = /* @__PURE__ */ p((e) => {
  const t = new Kb();
  return t.calculate(e), t;
}, "getThemeVariables"), Xi, Qb = (Xi = class {
  constructor() {
    this.background = "#333", this.primaryColor = "#1f2020", this.secondaryColor = R(this.primaryColor, 16), this.tertiaryColor = k(this.primaryColor, { h: -160 }), this.primaryBorderColor = F(this.background), this.secondaryBorderColor = kt(this.secondaryColor, this.darkMode), this.tertiaryBorderColor = kt(this.tertiaryColor, this.darkMode), this.primaryTextColor = F(this.primaryColor), this.secondaryTextColor = F(this.secondaryColor), this.tertiaryTextColor = F(this.tertiaryColor), this.mainBkg = "#111113", this.secondBkg = "calculated", this.mainContrastColor = "lightgrey", this.darkTextColor = R(F("#323D47"), 10), this.border1 = "#ccc", this.border2 = Hr(255, 255, 255, 0.25), this.arrowheadColor = F(this.background), this.fontFamily = '"Recursive Variable", arial, sans-serif', this.fontSize = "14px", this.labelBackground = "#111113", this.textColor = "#ccc", this.THEME_COLOR_LIMIT = 12, this.radius = 12, this.strokeWidth = 2, this.noteBkgColor = this.noteBkgColor ?? "#FEF9C3", this.noteTextColor = this.noteTextColor ?? "#28253D", this.THEME_COLOR_LIMIT = 12, this.fontFamily = '"Recursive Variable", arial, sans-serif', this.fontSize = "14px", this.nodeBorder = "#FFFFFF", this.stateBorder = "#FFFFFF", this.useGradient = !1, this.gradientStart = "#0042eb", this.gradientStop = "#eb0042", this.dropShadow = "url(#drop-shadow)", this.nodeShadow = !0, this.archEdgeColor = "calculated", this.archEdgeArrowColor = "calculated", this.archEdgeWidth = "3", this.archGroupBorderColor = this.primaryBorderColor, this.archGroupBorderWidth = "2px", this.clusterBkg = "#1E1A2E", this.clusterBorder = "#BDBCCC", this.noteBorderColor = "#FACC15", this.noteFontWeight = 600, this.filterColor = "#FFFFFF";
  }
  updateColors() {
    if (this.primaryTextColor = this.primaryTextColor || (this.darkMode ? "#eee" : "#FFFFFF"), this.secondaryColor = this.secondaryColor || k(this.primaryColor, { h: -120 }), this.tertiaryColor = this.tertiaryColor || k(this.primaryColor, { h: 180, l: 5 }), this.primaryBorderColor = this.primaryBorderColor || kt(this.primaryColor, this.darkMode), this.secondaryBorderColor = this.secondaryBorderColor || kt(this.secondaryColor, this.darkMode), this.tertiaryBorderColor = this.tertiaryBorderColor || kt(this.tertiaryColor, this.darkMode), this.noteBorderColor = this.noteBorderColor || kt(this.noteBkgColor, this.darkMode), this.noteBkgColor = this.noteBkgColor || "#fff5ad", this.noteTextColor = this.noteTextColor || "#FFFFFF", this.secondaryTextColor = this.secondaryTextColor || F(this.secondaryColor), this.tertiaryTextColor = this.tertiaryTextColor || F(this.tertiaryColor), this.lineColor = this.lineColor || F(this.background), this.arrowheadColor = this.arrowheadColor || F(this.background), this.textColor = this.textColor || this.primaryTextColor, this.border2 = this.border2 || this.tertiaryBorderColor, this.nodeBkg = this.nodeBkg || this.primaryColor, this.mainBkg = this.mainBkg || this.primaryColor, this.nodeBorder = this.nodeBorder || this.border1, this.clusterBkg = this.clusterBkg || this.tertiaryColor, this.clusterBorder = this.clusterBorder || this.tertiaryBorderColor, this.defaultLinkColor = this.defaultLinkColor || this.lineColor, this.titleColor = this.titleColor || this.tertiaryTextColor, this.edgeLabelBackground = this.edgeLabelBackground || (this.darkMode ? P(this.secondaryColor, 30) : this.secondaryColor), this.nodeTextColor = this.nodeTextColor || this.primaryTextColor, this.actorBorder = "#FFFFFF", this.signalColor = "#FFFFFF", this.labelBoxBorderColor = "#BDBCCC", this.actorBorder = this.actorBorder || this.primaryBorderColor, this.actorBkg = this.actorBkg || this.mainBkg, this.actorTextColor = this.actorTextColor || this.primaryTextColor, this.actorLineColor = this.actorLineColor || this.actorBorder, this.labelBoxBkgColor = this.labelBoxBkgColor || this.actorBkg, this.signalColor = this.signalColor || this.textColor, this.signalTextColor = this.signalTextColor || this.textColor, this.labelBoxBorderColor = this.labelBoxBorderColor || this.actorBorder, this.labelTextColor = this.labelTextColor || this.actorTextColor, this.loopTextColor = this.loopTextColor || this.actorTextColor, this.activationBorderColor = this.activationBorderColor || P(this.secondaryColor, 10), this.activationBkgColor = this.activationBkgColor || this.secondaryColor, this.sequenceNumberColor = this.sequenceNumberColor || F(this.lineColor), this.rectBkgColor = this.rectBkgColor || this.tertiaryColor, this.sectionBkgColor = this.sectionBkgColor || this.tertiaryColor, this.altSectionBkgColor = this.altSectionBkgColor || "white", this.sectionBkgColor = this.sectionBkgColor || this.secondaryColor, this.sectionBkgColor2 = this.sectionBkgColor2 || this.primaryColor, this.excludeBkgColor = this.excludeBkgColor || "#eeeeee", this.taskBorderColor = this.taskBorderColor || this.primaryBorderColor, this.taskBkgColor = this.taskBkgColor || this.primaryColor, this.activeTaskBorderColor = this.activeTaskBorderColor || this.primaryColor, this.activeTaskBkgColor = this.activeTaskBkgColor || R(this.primaryColor, 23), this.gridColor = this.gridColor || "lightgrey", this.doneTaskBkgColor = this.doneTaskBkgColor || "lightgrey", this.doneTaskBorderColor = this.doneTaskBorderColor || "grey", this.critBorderColor = this.critBorderColor || "#ff8888", this.critBkgColor = this.critBkgColor || "red", this.todayLineColor = this.todayLineColor || "red", this.taskTextColor = this.taskTextColor || this.textColor, this.taskTextOutsideColor = this.taskTextOutsideColor || this.textColor, this.taskTextLightColor = this.taskTextLightColor || this.textColor, this.taskTextColor = this.taskTextColor || this.primaryTextColor, this.taskTextDarkColor = this.taskTextDarkColor || this.textColor, this.taskTextClickableColor = this.taskTextClickableColor || "#003163", this.archEdgeColor = this.lineColor, this.archEdgeArrowColor = this.lineColor, this.personBorder = this.personBorder || this.primaryBorderColor, this.personBkg = this.personBkg || this.mainBkg, this.transitionColor = this.transitionColor || this.lineColor, this.transitionLabelColor = this.transitionLabelColor || this.textColor, this.stateLabelColor = this.stateLabelColor || this.stateBkg || this.primaryTextColor, this.vertLineColor = this.vertLineColor || this.primaryBorderColor, this.compositeBackground = "#16141F", this.altBackground = "#16141F", this.compositeTitleBackground = "#16141F", this.stateEdgeLabelBackground = "#16141F", this.fontWeight = 600, this.stateBkg = this.stateBkg || this.mainBkg, this.labelBackgroundColor = this.labelBackgroundColor || this.stateBkg, this.compositeBackground = this.compositeBackground || this.background || this.tertiaryColor, this.altBackground = this.altBackground || "#f0f0f0", this.compositeTitleBackground = this.compositeTitleBackground || this.mainBkg, this.compositeBorder = this.compositeBorder || this.nodeBorder, this.innerEndBackground = this.nodeBorder, this.errorBkgColor = this.errorBkgColor || this.tertiaryColor, this.errorTextColor = this.errorTextColor || this.tertiaryTextColor, this.transitionColor = this.transitionColor || this.lineColor, this.specialStateColor = this.lineColor, this.cScale0 = this.cScale0 || this.primaryColor, this.cScale1 = this.cScale1 || this.secondaryColor, this.cScale2 = this.cScale2 || this.tertiaryColor, this.cScale3 = this.cScale3 || k(this.primaryColor, { h: 30 }), this.cScale4 = this.cScale4 || k(this.primaryColor, { h: 60 }), this.cScale5 = this.cScale5 || k(this.primaryColor, { h: 90 }), this.cScale6 = this.cScale6 || k(this.primaryColor, { h: 120 }), this.cScale7 = this.cScale7 || k(this.primaryColor, { h: 150 }), this.cScale8 = this.cScale8 || k(this.primaryColor, { h: 210, l: 150 }), this.cScale9 = this.cScale9 || k(this.primaryColor, { h: 270 }), this.cScale10 = this.cScale10 || k(this.primaryColor, { h: 300 }), this.cScale11 = this.cScale11 || k(this.primaryColor, { h: 330 }), this.darkMode)
      for (let r = 0; r < this.THEME_COLOR_LIMIT; r++)
        this["cScale" + r] = P(this["cScale" + r], 75);
    else
      for (let r = 0; r < this.THEME_COLOR_LIMIT; r++)
        this["cScale" + r] = P(this["cScale" + r], 25);
    for (let r = 0; r < this.THEME_COLOR_LIMIT; r++)
      this["cScaleInv" + r] = this["cScaleInv" + r] || F(this["cScale" + r]);
    for (let r = 0; r < this.THEME_COLOR_LIMIT; r++)
      this.darkMode ? this["cScalePeer" + r] = this["cScalePeer" + r] || R(this["cScale" + r], 10) : this["cScalePeer" + r] = this["cScalePeer" + r] || P(this["cScale" + r], 10);
    this.scaleLabelColor = this.scaleLabelColor || this.labelTextColor;
    for (let r = 0; r < this.THEME_COLOR_LIMIT; r++)
      this["cScaleLabel" + r] = this["cScaleLabel" + r] || this.scaleLabelColor;
    const t = this.darkMode ? -4 : -1;
    for (let r = 0; r < 5; r++)
      this["surface" + r] = this["surface" + r] || k(this.mainBkg, { h: 180, s: -15, l: t * (5 + r * 3) }), this["surfacePeer" + r] = this["surfacePeer" + r] || k(this.mainBkg, { h: 180, s: -15, l: t * (8 + r * 3) });
    this.classText = this.classText || this.textColor, this.fillType0 = this.fillType0 || this.primaryColor, this.fillType1 = this.fillType1 || this.secondaryColor, this.fillType2 = this.fillType2 || k(this.primaryColor, { h: 64 }), this.fillType3 = this.fillType3 || k(this.secondaryColor, { h: 64 }), this.fillType4 = this.fillType4 || k(this.primaryColor, { h: -64 }), this.fillType5 = this.fillType5 || k(this.secondaryColor, { h: -64 }), this.fillType6 = this.fillType6 || k(this.primaryColor, { h: 128 }), this.fillType7 = this.fillType7 || k(this.secondaryColor, { h: 128 }), this.pie1 = this.pie1 || this.primaryColor, this.pie2 = this.pie2 || this.secondaryColor, this.pie3 = this.pie3 || this.tertiaryColor, this.pie4 = this.pie4 || k(this.primaryColor, { l: -10 }), this.pie5 = this.pie5 || k(this.secondaryColor, { l: -10 }), this.pie6 = this.pie6 || k(this.tertiaryColor, { l: -10 }), this.pie7 = this.pie7 || k(this.primaryColor, { h: 60, l: -10 }), this.pie8 = this.pie8 || k(this.primaryColor, { h: -60, l: -10 }), this.pie9 = this.pie9 || k(this.primaryColor, { h: 120, l: 0 }), this.pie10 = this.pie10 || k(this.primaryColor, { h: 60, l: -20 }), this.pie11 = this.pie11 || k(this.primaryColor, { h: -60, l: -20 }), this.pie12 = this.pie12 || k(this.primaryColor, { h: 120, l: -10 }), this.pieTitleTextSize = this.pieTitleTextSize || "25px", this.pieTitleTextColor = this.pieTitleTextColor || this.taskTextDarkColor, this.pieSectionTextSize = this.pieSectionTextSize || "17px", this.pieSectionTextColor = this.pieSectionTextColor || this.textColor, this.pieLegendTextSize = this.pieLegendTextSize || "17px", this.pieLegendTextColor = this.pieLegendTextColor || this.taskTextDarkColor, this.pieStrokeColor = this.pieStrokeColor || "black", this.pieStrokeWidth = this.pieStrokeWidth || "2px", this.pieOuterStrokeWidth = this.pieOuterStrokeWidth || "2px", this.pieOuterStrokeColor = this.pieOuterStrokeColor || "black", this.pieOpacity = this.pieOpacity || "0.7", this.vennTitleTextColor = this.vennTitleTextColor ?? this.titleColor, this.vennSetTextColor = this.vennSetTextColor ?? this.textColor, this.quadrant1Fill = this.quadrant1Fill || this.primaryColor, this.quadrant2Fill = this.quadrant2Fill || k(this.primaryColor, { r: 5, g: 5, b: 5 }), this.quadrant3Fill = this.quadrant3Fill || k(this.primaryColor, { r: 10, g: 10, b: 10 }), this.quadrant4Fill = this.quadrant4Fill || k(this.primaryColor, { r: 15, g: 15, b: 15 }), this.quadrant1TextFill = this.quadrant1TextFill || this.primaryTextColor, this.quadrant2TextFill = this.quadrant2TextFill || k(this.primaryTextColor, { r: -5, g: -5, b: -5 }), this.quadrant3TextFill = this.quadrant3TextFill || k(this.primaryTextColor, { r: -10, g: -10, b: -10 }), this.quadrant4TextFill = this.quadrant4TextFill || k(this.primaryTextColor, { r: -15, g: -15, b: -15 }), this.quadrantPointFill = this.quadrantPointFill || Ke(this.quadrant1Fill) ? R(this.quadrant1Fill) : P(this.quadrant1Fill), this.quadrantPointTextFill = this.quadrantPointTextFill || this.primaryTextColor, this.quadrantXAxisTextFill = this.quadrantXAxisTextFill || this.primaryTextColor, this.quadrantYAxisTextFill = this.quadrantYAxisTextFill || this.primaryTextColor, this.quadrantInternalBorderStrokeFill = this.quadrantInternalBorderStrokeFill || this.primaryBorderColor, this.quadrantExternalBorderStrokeFill = this.quadrantExternalBorderStrokeFill || this.primaryBorderColor, this.quadrantTitleFill = this.quadrantTitleFill || this.primaryTextColor, this.xyChart = {
      backgroundColor: this.xyChart?.backgroundColor || this.background,
      titleColor: this.xyChart?.titleColor || this.primaryTextColor,
      legendTextColor: this.xyChart?.legendTextColor || this.primaryTextColor,
      xAxisTitleColor: this.xyChart?.xAxisTitleColor || this.primaryTextColor,
      xAxisLabelColor: this.xyChart?.xAxisLabelColor || this.primaryTextColor,
      xAxisTickColor: this.xyChart?.xAxisTickColor || this.primaryTextColor,
      xAxisLineColor: this.xyChart?.xAxisLineColor || this.primaryTextColor,
      yAxisTitleColor: this.xyChart?.yAxisTitleColor || this.primaryTextColor,
      yAxisLabelColor: this.xyChart?.yAxisLabelColor || this.primaryTextColor,
      yAxisTickColor: this.xyChart?.yAxisTickColor || this.primaryTextColor,
      yAxisLineColor: this.xyChart?.yAxisLineColor || this.primaryTextColor,
      plotColorPalette: this.xyChart?.plotColorPalette || "#FFF4DD,#FFD8B1,#FFA07A,#ECEFF1,#D6DBDF,#C3E0A8,#FFB6A4,#FFD74D,#738FA7,#FFFFF0"
    }, this.requirementBackground = this.requirementBackground || this.primaryColor, this.requirementBorderColor = this.requirementBorderColor || this.primaryBorderColor, this.requirementBorderSize = this.requirementBorderSize || "1", this.requirementTextColor = this.requirementTextColor || this.primaryTextColor, this.relationColor = this.relationColor || this.lineColor, this.relationLabelBackground = this.relationLabelBackground || (this.darkMode ? P(this.secondaryColor, 30) : this.secondaryColor), this.relationLabelColor = this.relationLabelColor || this.actorTextColor, this.requirementEdgeLabelBackground = "#16141F", this.git0 = this.git0 || this.primaryColor, this.git1 = this.git1 || this.secondaryColor, this.git2 = this.git2 || this.tertiaryColor, this.git3 = this.git3 || k(this.primaryColor, { h: -30 }), this.git4 = this.git4 || k(this.primaryColor, { h: -60 }), this.git5 = this.git5 || k(this.primaryColor, { h: -90 }), this.git6 = this.git6 || k(this.primaryColor, { h: 60 }), this.git7 = this.git7 || k(this.primaryColor, { h: 120 }), this.darkMode ? (this.git0 = R(this.git0, 25), this.git1 = R(this.git1, 25), this.git2 = R(this.git2, 25), this.git3 = R(this.git3, 25), this.git4 = R(this.git4, 25), this.git5 = R(this.git5, 25), this.git6 = R(this.git6, 25), this.git7 = R(this.git7, 25)) : (this.git0 = P(this.git0, 25), this.git1 = P(this.git1, 25), this.git2 = P(this.git2, 25), this.git3 = P(this.git3, 25), this.git4 = P(this.git4, 25), this.git5 = P(this.git5, 25), this.git6 = P(this.git6, 25), this.git7 = P(this.git7, 25)), this.gitInv0 = this.gitInv0 || F(this.git0), this.gitInv1 = this.gitInv1 || F(this.git1), this.gitInv2 = this.gitInv2 || F(this.git2), this.gitInv3 = this.gitInv3 || F(this.git3), this.gitInv4 = this.gitInv4 || F(this.git4), this.gitInv5 = this.gitInv5 || F(this.git5), this.gitInv6 = this.gitInv6 || F(this.git6), this.gitInv7 = this.gitInv7 || F(this.git7), this.branchLabelColor = this.branchLabelColor || (this.darkMode ? "black" : this.labelTextColor), this.gitBranchLabel0 = this.gitBranchLabel0 || this.branchLabelColor, this.gitBranchLabel1 = this.gitBranchLabel1 || this.branchLabelColor, this.gitBranchLabel2 = this.gitBranchLabel2 || this.branchLabelColor, this.gitBranchLabel3 = this.gitBranchLabel3 || this.branchLabelColor, this.gitBranchLabel4 = this.gitBranchLabel4 || this.branchLabelColor, this.gitBranchLabel5 = this.gitBranchLabel5 || this.branchLabelColor, this.gitBranchLabel6 = this.gitBranchLabel6 || this.branchLabelColor, this.gitBranchLabel7 = this.gitBranchLabel7 || this.branchLabelColor, this.tagLabelColor = this.tagLabelColor || this.primaryTextColor, this.tagLabelBackground = this.tagLabelBackground || this.primaryColor, this.tagLabelBorder = this.tagBorder || this.primaryBorderColor, this.tagLabelFontSize = this.tagLabelFontSize || "10px", this.commitLabelColor = this.commitLabelColor || this.secondaryTextColor, this.commitLabelBackground = this.commitLabelBackground || this.secondaryColor, this.commitLabelFontSize = this.commitLabelFontSize || "10px", this.commitLineColor = this.commitLineColor ?? "#BDBCCC", this.erEdgeLabelBackground = "#16141F", this.attributeBackgroundColorOdd = this.attributeBackgroundColorOdd || hr, this.attributeBackgroundColorEven = this.attributeBackgroundColorEven || cr;
  }
  calculate(t) {
    if (typeof t != "object") {
      this.updateColors();
      return;
    }
    const r = Object.keys(t);
    r.forEach((i) => {
      this[i] = t[i];
    }), this.updateColors(), r.forEach((i) => {
      this[i] = t[i];
    });
  }
}, p(Xi, "Theme"), Xi), Jb = /* @__PURE__ */ p((e) => {
  const t = new Qb();
  return t.calculate(e), t;
}, "getThemeVariables"), ji, tk = (ji = class {
  constructor() {
    this.background = "#ffffff", this.primaryColor = "#cccccc", this.mainBkg = "#ffffff", this.noteBkgColor = "#fff5ad", this.noteTextColor = "#28253D", this.THEME_COLOR_LIMIT = 12, this.radius = 12, this.strokeWidth = 2, this.primaryBorderColor = kt(this.primaryColor, this.darkMode), this.fontFamily = '"Recursive Variable", arial, sans-serif', this.fontSize = "14px", this.nodeBorder = "#28253D", this.stateBorder = "#28253D", this.useGradient = !1, this.gradientStart = "#0042eb", this.gradientStop = "#eb0042", this.dropShadow = "url(#drop-shadow)", this.nodeShadow = !0, this.tertiaryColor = "#ffffff", this.archEdgeColor = "calculated", this.archEdgeArrowColor = "calculated", this.archEdgeWidth = "3", this.archGroupBorderColor = this.primaryBorderColor, this.archGroupBorderWidth = "2px", this.actorBorder = "#28253D", this.noteBorderColor = "#FACC15", this.noteFontWeight = 600, this.borderColorArray = [
      "#E879F9",
      //Fuchsia-400
      "#2DD4BF",
      //Teal-400
      "#FB923C",
      //Orange-400
      "#22D3EE",
      // Cyan-400
      "#4ADE80",
      // Green-400
      "#A78BFA",
      //Violet-400
      "#F87171",
      //red-400
      "#FACC15",
      //yellow-400
      "#818CF8",
      //indigo-400
      "#A3E635 ",
      //Lime-400
      "#38BDF8",
      //Sky-400
      "#FB7185"
      //Rose-400
    ], this.bkgColorArray = [
      "#FDF4FF",
      //Fuchsia-50
      "#F0FDFA",
      //Teal-50
      "#FFF7ED",
      //Orange-50
      "#ECFEFF",
      // Cyan-50
      "#F0FDF4",
      // Green-50
      "#F5F3FF",
      //Violet-50
      "#FEF2F2",
      //red-50
      "#FEFCE8",
      //yellow-50
      "#EEF2FF",
      //indigo-50
      "#F7FEE7",
      //Lime-50
      "#F0F9FF",
      //Sky-50
      "#FFF1F2"
      //Rose-50
    ], this.filterColor = "#000000";
  }
  updateColors() {
    this.primaryTextColor = this.primaryTextColor || (this.darkMode ? "#eee" : "#28253D"), this.secondaryColor = this.secondaryColor || k(this.primaryColor, { h: -120 }), this.tertiaryColor = this.tertiaryColor || k(this.primaryColor, { h: 180, l: 5 }), this.primaryBorderColor = this.primaryBorderColor || kt(this.primaryColor, this.darkMode), this.secondaryBorderColor = this.secondaryBorderColor || kt(this.secondaryColor, this.darkMode), this.tertiaryBorderColor = this.tertiaryBorderColor || kt(this.tertiaryColor, this.darkMode), this.noteBorderColor = this.noteBorderColor || kt(this.noteBkgColor, this.darkMode), this.noteBkgColor = this.noteBkgColor || "#fff5ad", this.noteTextColor = this.noteTextColor || "#28253D", this.secondaryTextColor = this.secondaryTextColor || F(this.secondaryColor), this.tertiaryTextColor = this.tertiaryTextColor || F(this.tertiaryColor), this.lineColor = this.lineColor || F(this.background), this.arrowheadColor = this.arrowheadColor || F(this.background), this.textColor = this.textColor || this.primaryTextColor, this.border2 = this.border2 || this.tertiaryBorderColor, this.nodeBkg = this.nodeBkg || this.primaryColor, this.mainBkg = this.mainBkg || this.primaryColor, this.nodeBorder = this.nodeBorder || this.primaryBorderColor, this.clusterBkg = this.clusterBkg || this.tertiaryColor, this.clusterBorder = this.clusterBorder || this.tertiaryBorderColor, this.defaultLinkColor = this.defaultLinkColor || this.lineColor, this.titleColor = this.titleColor || this.tertiaryTextColor, this.edgeLabelBackground = this.edgeLabelBackground || (this.darkMode ? P(this.secondaryColor, 30) : this.secondaryColor), this.nodeTextColor = this.nodeTextColor || this.primaryTextColor, this.actorBorder = this.actorBorder || this.primaryBorderColor, this.actorBkg = this.actorBkg || this.mainBkg, this.actorTextColor = this.actorTextColor || this.primaryTextColor, this.actorLineColor = this.actorLineColor || this.actorBorder, this.labelBoxBkgColor = this.labelBoxBkgColor || this.actorBkg, this.signalColor = this.signalColor || this.textColor, this.signalTextColor = this.signalTextColor || this.textColor, this.labelBoxBorderColor = this.labelBoxBorderColor || this.actorBorder, this.labelTextColor = this.labelTextColor || this.actorTextColor, this.loopTextColor = this.loopTextColor || this.actorTextColor, this.activationBorderColor = this.activationBorderColor || P(this.secondaryColor, 10), this.activationBkgColor = this.activationBkgColor || this.secondaryColor, this.sequenceNumberColor = this.sequenceNumberColor || F(this.lineColor), this.rectBkgColor = this.rectBkgColor || this.tertiaryColor;
    const t = "#ECECFE", r = "#E9E9F1", i = k(t, { h: 180, l: 5 });
    this.sectionBkgColor = this.sectionBkgColor || i, this.altSectionBkgColor = this.altSectionBkgColor || "white", this.sectionBkgColor = this.sectionBkgColor || r, this.sectionBkgColor2 = this.sectionBkgColor2 || t, this.excludeBkgColor = this.excludeBkgColor || "#eeeeee", this.taskBorderColor = this.taskBorderColor || this.primaryBorderColor, this.taskBkgColor = this.taskBkgColor || t, this.activeTaskBorderColor = this.activeTaskBorderColor || t, this.activeTaskBkgColor = this.activeTaskBkgColor || R(t, 23), this.gridColor = this.gridColor || "lightgrey", this.doneTaskBkgColor = this.doneTaskBkgColor || "lightgrey", this.doneTaskBorderColor = this.doneTaskBorderColor || "grey", this.critBorderColor = this.critBorderColor || "#ff8888", this.critBkgColor = this.critBkgColor || "red", this.todayLineColor = this.todayLineColor || "red", this.taskTextColor = this.taskTextColor || this.textColor, this.vertLineColor = this.vertLineColor || this.primaryBorderColor, this.taskTextOutsideColor = this.taskTextOutsideColor || this.textColor, this.taskTextLightColor = this.taskTextLightColor || this.textColor, this.taskTextColor = this.taskTextColor || this.primaryTextColor, this.taskTextDarkColor = this.taskTextDarkColor || this.textColor, this.taskTextClickableColor = this.taskTextClickableColor || "#003163", this.archEdgeColor = this.lineColor, this.archEdgeArrowColor = this.lineColor, this.personBorder = this.personBorder || this.primaryBorderColor, this.personBkg = this.personBkg || this.mainBkg, this.transitionColor = this.transitionColor || this.lineColor, this.transitionLabelColor = this.transitionLabelColor || this.textColor, this.stateLabelColor = this.stateLabelColor || this.stateBkg || this.primaryTextColor, this.stateBkg = this.stateBkg || this.mainBkg, this.labelBackgroundColor = this.labelBackgroundColor || this.stateBkg, this.compositeBackground = this.compositeBackground || this.background || this.tertiaryColor, this.altBackground = this.altBackground || "#f0f0f0", this.compositeTitleBackground = this.compositeTitleBackground || this.mainBkg, this.compositeBorder = this.compositeBorder || this.nodeBorder, this.innerEndBackground = this.nodeBorder, this.errorBkgColor = this.errorBkgColor || this.tertiaryColor, this.errorTextColor = this.errorTextColor || this.tertiaryTextColor, this.transitionColor = this.transitionColor || this.lineColor, this.specialStateColor = this.lineColor, this.cScale0 = this.cScale0 || "#f4a8ff", this.cScale1 = this.cScale1 || "#46ecd5", this.cScale2 = this.cScale2 || "#ffb86a", this.cScale3 = this.cScale3 || "#dab2ff", this.cScale4 = this.cScale4 || "#7bf1a8", this.cScale5 = this.cScale5 || "#c4b4ff", this.cScale6 = this.cScale6 || "#ffa2a2", this.cScale7 = this.cScale7 || "#ffdf20", this.cScale8 = this.cScale8 || "#a3b3ff", this.cScale9 = this.cScale9 || "#bbf451", this.cScale10 = this.cScale10 || "#74d4ff", this.cScale11 = this.cScale11 || "#ffa1ad";
    for (let o = 0; o < this.THEME_COLOR_LIMIT; o++)
      this["cScaleInv" + o] = this["cScaleInv" + o] || F(this["cScale" + o]);
    for (let o = 0; o < this.THEME_COLOR_LIMIT; o++)
      this.darkMode ? this["cScalePeer" + o] = this["cScalePeer" + o] || R(this["cScale" + o], 10) : this["cScalePeer" + o] = this["cScalePeer" + o] || P(this["cScale" + o], 10);
    this.scaleLabelColor = this.scaleLabelColor || this.labelTextColor;
    for (let o = 0; o < this.THEME_COLOR_LIMIT; o++)
      this["cScaleLabel" + o] = this["cScaleLabel" + o] || this.scaleLabelColor;
    const s = this.darkMode ? -4 : -1;
    for (let o = 0; o < 5; o++)
      this["surface" + o] = this["surface" + o] || k(this.mainBkg, { h: 180, s: -15, l: s * (5 + o * 3) }), this["surfacePeer" + o] = this["surfacePeer" + o] || k(this.mainBkg, { h: 180, s: -15, l: s * (8 + o * 3) });
    this.classText = this.classText || this.textColor, this.fillType0 = this.fillType0 || t, this.fillType1 = this.fillType1 || r, this.fillType2 = this.fillType2 || k(t, { h: 64 }), this.fillType3 = this.fillType3 || k(r, { h: 64 }), this.fillType4 = this.fillType4 || k(t, { h: -64 }), this.fillType5 = this.fillType5 || k(r, { h: -64 }), this.fillType6 = this.fillType6 || k(t, { h: 128 }), this.fillType7 = this.fillType7 || k(r, { h: 128 }), this.pie1 = this.pie1 || t, this.pie2 = this.pie2 || r, this.pie3 = this.pie3 || i, this.pie4 = this.pie4 || k(t, { l: -10 }), this.pie5 = this.pie5 || k(r, { l: -10 }), this.pie6 = this.pie6 || k(i, { l: -10 }), this.pie7 = this.pie7 || k(t, { h: 60, l: -10 }), this.pie8 = this.pie8 || k(t, { h: -60, l: -10 }), this.pie9 = this.pie9 || k(t, { h: 120, l: 0 }), this.pie10 = this.pie10 || k(t, { h: 60, l: -20 }), this.pie11 = this.pie11 || k(t, { h: -60, l: -20 }), this.pie12 = this.pie12 || k(t, { h: 120, l: -10 }), this.pieTitleTextSize = this.pieTitleTextSize || "25px", this.pieTitleTextColor = this.pieTitleTextColor || this.taskTextDarkColor, this.pieSectionTextSize = this.pieSectionTextSize || "17px", this.pieSectionTextColor = this.pieSectionTextColor || this.textColor, this.pieLegendTextSize = this.pieLegendTextSize || "17px", this.pieLegendTextColor = this.pieLegendTextColor || this.taskTextDarkColor, this.pieStrokeColor = this.pieStrokeColor || "black", this.pieStrokeWidth = this.pieStrokeWidth || "2px", this.pieOuterStrokeWidth = this.pieOuterStrokeWidth || "2px", this.pieOuterStrokeColor = this.pieOuterStrokeColor || "black", this.pieOpacity = this.pieOpacity || "0.7", this.vennTitleTextColor = this.vennTitleTextColor ?? this.titleColor, this.vennSetTextColor = this.vennSetTextColor ?? this.textColor, this.quadrant1Fill = this.quadrant1Fill || t, this.quadrant2Fill = this.quadrant2Fill || k(t, { r: 5, g: 5, b: 5 }), this.quadrant3Fill = this.quadrant3Fill || k(t, { r: 10, g: 10, b: 10 }), this.quadrant4Fill = this.quadrant4Fill || k(t, { r: 15, g: 15, b: 15 }), this.quadrant1TextFill = this.quadrant1TextFill || this.primaryTextColor, this.quadrant2TextFill = this.quadrant2TextFill || k(this.primaryTextColor, { r: -5, g: -5, b: -5 }), this.quadrant3TextFill = this.quadrant3TextFill || k(this.primaryTextColor, { r: -10, g: -10, b: -10 }), this.quadrant4TextFill = this.quadrant4TextFill || k(this.primaryTextColor, { r: -15, g: -15, b: -15 }), this.quadrantPointFill = this.quadrantPointFill || Ke(this.quadrant1Fill) ? R(this.quadrant1Fill) : P(this.quadrant1Fill), this.quadrantPointTextFill = this.quadrantPointTextFill || this.primaryTextColor, this.quadrantXAxisTextFill = this.quadrantXAxisTextFill || this.primaryTextColor, this.quadrantYAxisTextFill = this.quadrantYAxisTextFill || this.primaryTextColor, this.quadrantInternalBorderStrokeFill = this.quadrantInternalBorderStrokeFill || this.primaryBorderColor, this.quadrantExternalBorderStrokeFill = this.quadrantExternalBorderStrokeFill || this.primaryBorderColor, this.quadrantTitleFill = this.quadrantTitleFill || this.primaryTextColor, this.xyChart = {
      backgroundColor: this.xyChart?.backgroundColor || this.background,
      titleColor: this.xyChart?.titleColor || this.primaryTextColor,
      legendTextColor: this.xyChart?.legendTextColor || this.primaryTextColor,
      xAxisTitleColor: this.xyChart?.xAxisTitleColor || this.primaryTextColor,
      xAxisLabelColor: this.xyChart?.xAxisLabelColor || this.primaryTextColor,
      xAxisTickColor: this.xyChart?.xAxisTickColor || this.primaryTextColor,
      xAxisLineColor: this.xyChart?.xAxisLineColor || this.primaryTextColor,
      yAxisTitleColor: this.xyChart?.yAxisTitleColor || this.primaryTextColor,
      yAxisLabelColor: this.xyChart?.yAxisLabelColor || this.primaryTextColor,
      yAxisTickColor: this.xyChart?.yAxisTickColor || this.primaryTextColor,
      yAxisLineColor: this.xyChart?.yAxisLineColor || this.primaryTextColor,
      plotColorPalette: this.xyChart?.plotColorPalette || "#FFF4DD,#FFD8B1,#FFA07A,#ECEFF1,#D6DBDF,#C3E0A8,#FFB6A4,#FFD74D,#738FA7,#FFFFF0"
    }, this.requirementBackground = this.requirementBackground || t, this.requirementBorderColor = this.requirementBorderColor || this.primaryBorderColor, this.requirementBorderSize = this.requirementBorderSize || "1", this.requirementTextColor = this.requirementTextColor || this.primaryTextColor, this.relationColor = this.relationColor || this.lineColor, this.relationLabelBackground = this.relationLabelBackground || (this.darkMode ? P(this.secondaryColor, 30) : this.secondaryColor), this.relationLabelColor = this.relationLabelColor || this.actorTextColor, this.git0 = this.git0 || t, this.git1 = this.git1 || r, this.git2 = this.git2 || i, this.git3 = this.git3 || k(t, { h: -30 }), this.git4 = this.git4 || k(t, { h: -60 }), this.git5 = this.git5 || k(t, { h: -90 }), this.git6 = this.git6 || k(t, { h: 60 }), this.git7 = this.git7 || k(t, { h: 120 }), this.darkMode ? (this.git0 = R(this.git0, 25), this.git1 = R(this.git1, 25), this.git2 = R(this.git2, 25), this.git3 = R(this.git3, 25), this.git4 = R(this.git4, 25), this.git5 = R(this.git5, 25), this.git6 = R(this.git6, 25), this.git7 = R(this.git7, 25)) : (this.git0 = P(this.git0, 25), this.git1 = P(this.git1, 25), this.git2 = P(this.git2, 25), this.git3 = P(this.git3, 25), this.git4 = P(this.git4, 25), this.git5 = P(this.git5, 25), this.git6 = P(this.git6, 25), this.git7 = P(this.git7, 25)), this.gitInv0 = this.gitInv0 || F(this.git0), this.gitInv1 = this.gitInv1 || F(this.git1), this.gitInv2 = this.gitInv2 || F(this.git2), this.gitInv3 = this.gitInv3 || F(this.git3), this.gitInv4 = this.gitInv4 || F(this.git4), this.gitInv5 = this.gitInv5 || F(this.git5), this.gitInv6 = this.gitInv6 || F(this.git6), this.gitInv7 = this.gitInv7 || F(this.git7), this.branchLabelColor = this.branchLabelColor || (this.darkMode ? "black" : this.labelTextColor), this.gitBranchLabel0 = this.gitBranchLabel0 || this.branchLabelColor, this.gitBranchLabel1 = this.gitBranchLabel1 || this.branchLabelColor, this.gitBranchLabel2 = this.gitBranchLabel2 || this.branchLabelColor, this.gitBranchLabel3 = this.gitBranchLabel3 || this.branchLabelColor, this.gitBranchLabel4 = this.gitBranchLabel4 || this.branchLabelColor, this.gitBranchLabel5 = this.gitBranchLabel5 || this.branchLabelColor, this.gitBranchLabel6 = this.gitBranchLabel6 || this.branchLabelColor, this.gitBranchLabel7 = this.gitBranchLabel7 || this.branchLabelColor, this.tagLabelColor = this.tagLabelColor || this.primaryTextColor, this.tagLabelBackground = this.tagLabelBackground || this.primaryColor, this.tagLabelBorder = this.tagBorder || this.primaryBorderColor, this.tagLabelFontSize = this.tagLabelFontSize || "10px", this.commitLabelColor = this.commitLabelColor || this.secondaryTextColor, this.commitLabelBackground = this.commitLabelBackground || this.secondaryColor, this.commitLineColor = this.commitLineColor ?? "#BDBCCC", this.commitLabelFontSize = this.commitLabelFontSize || "10px", this.fontWeight = 600, this.erEdgeLabelBackground = "#FFFFFF", this.attributeBackgroundColorOdd = this.attributeBackgroundColorOdd || hr, this.attributeBackgroundColorEven = this.attributeBackgroundColorEven || cr;
  }
  calculate(t) {
    if (typeof t != "object") {
      this.updateColors();
      return;
    }
    const r = Object.keys(t);
    r.forEach((i) => {
      this[i] = t[i];
    }), this.updateColors(), r.forEach((i) => {
      this[i] = t[i];
    });
  }
}, p(ji, "Theme"), ji), ek = /* @__PURE__ */ p((e) => {
  const t = new tk();
  return t.calculate(e), t;
}, "getThemeVariables"), Gi, rk = (Gi = class {
  constructor() {
    this.background = "#333", this.primaryColor = "#1f2020", this.secondaryColor = R(this.primaryColor, 16), this.tertiaryColor = k(this.primaryColor, { h: -160 }), this.primaryBorderColor = F(this.background), this.secondaryBorderColor = kt(this.secondaryColor, this.darkMode), this.tertiaryBorderColor = kt(this.tertiaryColor, this.darkMode), this.primaryTextColor = F(this.primaryColor), this.secondaryTextColor = F(this.secondaryColor), this.tertiaryTextColor = F(this.tertiaryColor), this.mainBkg = "#111113", this.secondBkg = "calculated", this.mainContrastColor = "lightgrey", this.darkTextColor = R(F("#323D47"), 10), this.border1 = "#ccc", this.border2 = Hr(255, 255, 255, 0.25), this.arrowheadColor = F(this.background), this.fontFamily = '"Recursive Variable", arial, sans-serif', this.fontSize = "14px", this.labelBackground = "#111113", this.textColor = "#ccc", this.THEME_COLOR_LIMIT = 12, this.radius = 12, this.strokeWidth = 2, this.noteBkgColor = this.noteBkgColor ?? "#FEF9C3", this.noteTextColor = this.noteTextColor ?? "#28253D", this.THEME_COLOR_LIMIT = 12, this.fontFamily = '"Recursive Variable", arial, sans-serif', this.fontSize = "14px", this.nodeBorder = "#FFFFFF", this.stateBorder = "#FFFFFF", this.useGradient = !1, this.gradientStart = "#0042eb", this.gradientStop = "#eb0042", this.dropShadow = "url(#drop-shadow)", this.nodeShadow = !0, this.archEdgeColor = "calculated", this.archEdgeArrowColor = "calculated", this.archEdgeWidth = "3", this.archGroupBorderColor = this.primaryBorderColor, this.archGroupBorderWidth = "2px", this.clusterBkg = "#1E1A2E", this.clusterBorder = "#BDBCCC", this.noteBorderColor = "#FACC15", this.noteFontWeight = 600, this.borderColorArray = [
      "#E879F9",
      //Fuchsia-400
      "#2DD4BF",
      //Teal-400
      "#FB923C",
      //Orange-400
      "#22D3EE",
      // Cyan-400
      "#4ADE80",
      // Green-400
      "#A78BFA",
      //Violet-400
      "#F87171",
      //red-400
      "#FACC15",
      //yellow-400
      "#818CF8",
      //indigo-400
      "#A3E635 ",
      //Lime-400
      "#38BDF8",
      //Sky-400
      "#FB7185"
      //Rose-400
    ], this.bkgColorArray = [], this.filterColor = "#FFFFFF";
  }
  updateColors() {
    this.primaryTextColor = this.primaryTextColor || (this.darkMode ? "#eee" : "#FFFFFF"), this.secondaryColor = this.secondaryColor || k(this.primaryColor, { h: -120 }), this.tertiaryColor = this.tertiaryColor || k(this.primaryColor, { h: 180, l: 5 }), this.primaryBorderColor = this.primaryBorderColor || kt(this.primaryColor, this.darkMode), this.secondaryBorderColor = this.secondaryBorderColor || kt(this.secondaryColor, this.darkMode), this.tertiaryBorderColor = this.tertiaryBorderColor || kt(this.tertiaryColor, this.darkMode), this.noteBorderColor = this.noteBorderColor || kt(this.noteBkgColor, this.darkMode), this.noteBkgColor = this.noteBkgColor || "#fff5ad", this.noteTextColor = this.noteTextColor || "#FFFFFF", this.secondaryTextColor = this.secondaryTextColor || F(this.secondaryColor), this.tertiaryTextColor = this.tertiaryTextColor || F(this.tertiaryColor), this.lineColor = this.lineColor || F(this.background), this.arrowheadColor = this.arrowheadColor || F(this.background), this.textColor = this.textColor || this.primaryTextColor, this.border2 = this.border2 || this.tertiaryBorderColor, this.nodeBkg = this.nodeBkg || this.primaryColor, this.mainBkg = this.mainBkg || this.primaryColor, this.nodeBorder = this.nodeBorder || this.border1, this.clusterBkg = this.clusterBkg || this.tertiaryColor, this.clusterBorder = this.clusterBorder || this.tertiaryBorderColor, this.defaultLinkColor = this.defaultLinkColor || this.lineColor, this.titleColor = this.titleColor || this.tertiaryTextColor, this.edgeLabelBackground = this.edgeLabelBackground || (this.darkMode ? P(this.secondaryColor, 30) : this.secondaryColor), this.nodeTextColor = this.nodeTextColor || this.primaryTextColor, this.actorBorder = "#FFFFFF", this.signalColor = "#FFFFFF", this.labelBoxBorderColor = "#BDBCCC", this.actorBorder = this.actorBorder || this.primaryBorderColor, this.actorBkg = this.actorBkg || this.mainBkg, this.actorTextColor = this.actorTextColor || this.primaryTextColor, this.actorLineColor = this.actorLineColor || this.actorBorder, this.labelBoxBkgColor = this.labelBoxBkgColor || this.actorBkg, this.signalColor = this.signalColor || this.textColor, this.signalTextColor = this.signalTextColor || this.textColor, this.labelBoxBorderColor = this.labelBoxBorderColor || this.actorBorder, this.labelTextColor = this.labelTextColor || this.actorTextColor, this.loopTextColor = this.loopTextColor || this.actorTextColor, this.activationBorderColor = this.activationBorderColor || P(this.secondaryColor, 10), this.activationBkgColor = this.activationBkgColor || this.secondaryColor, this.sequenceNumberColor = this.sequenceNumberColor || F(this.lineColor), this.rectBkgColor = this.rectBkgColor || this.tertiaryColor, this.rootLabelColor = "#FFFFFF", this.sectionBkgColor = this.sectionBkgColor || this.tertiaryColor, this.altSectionBkgColor = this.altSectionBkgColor || "white", this.sectionBkgColor = this.sectionBkgColor || this.secondaryColor, this.sectionBkgColor2 = this.sectionBkgColor2 || this.primaryColor, this.excludeBkgColor = this.excludeBkgColor || "#eeeeee", this.taskBorderColor = this.taskBorderColor || this.primaryBorderColor, this.taskBkgColor = this.taskBkgColor || this.primaryColor, this.activeTaskBorderColor = this.activeTaskBorderColor || this.primaryColor, this.activeTaskBkgColor = this.activeTaskBkgColor || R(this.primaryColor, 23), this.gridColor = this.gridColor || "lightgrey", this.doneTaskBkgColor = this.doneTaskBkgColor || "lightgrey", this.doneTaskBorderColor = this.doneTaskBorderColor || "grey", this.critBorderColor = this.critBorderColor || "#ff8888", this.critBkgColor = this.critBkgColor || "red", this.todayLineColor = this.todayLineColor || "red", this.taskTextColor = this.taskTextColor || this.textColor, this.vertLineColor = this.vertLineColor || this.primaryBorderColor, this.taskTextOutsideColor = this.taskTextOutsideColor || this.textColor, this.taskTextLightColor = this.taskTextLightColor || this.textColor, this.taskTextColor = this.taskTextColor || this.primaryTextColor, this.taskTextDarkColor = this.taskTextDarkColor || this.textColor, this.taskTextClickableColor = this.taskTextClickableColor || "#003163", this.archEdgeColor = this.lineColor, this.archEdgeArrowColor = this.lineColor, this.personBorder = this.personBorder || this.primaryBorderColor, this.personBkg = this.personBkg || this.mainBkg, this.transitionColor = this.transitionColor || this.lineColor, this.transitionLabelColor = this.transitionLabelColor || this.textColor, this.stateLabelColor = this.stateLabelColor || this.stateBkg || this.primaryTextColor, this.stateBkg = this.stateBkg || this.mainBkg, this.labelBackgroundColor = this.labelBackgroundColor || this.stateBkg, this.compositeBackground = this.compositeBackground || this.background || this.tertiaryColor, this.altBackground = this.altBackground || "#f0f0f0", this.compositeTitleBackground = this.compositeTitleBackground || this.mainBkg, this.compositeBorder = this.compositeBorder || this.nodeBorder, this.innerEndBackground = this.nodeBorder, this.errorBkgColor = this.errorBkgColor || this.tertiaryColor, this.errorTextColor = this.errorTextColor || this.tertiaryTextColor, this.transitionColor = this.transitionColor || this.lineColor, this.specialStateColor = this.lineColor, this.cScale0 = this.cScale0 || "#f4a8ff", this.cScale1 = this.cScale1 || "#46ecd5", this.cScale2 = this.cScale2 || "#ffb86a", this.cScale3 = this.cScale3 || "#dab2ff", this.cScale4 = this.cScale4 || "#7bf1a8", this.cScale5 = this.cScale5 || "#c4b4ff", this.cScale6 = this.cScale6 || "#ffa2a2", this.cScale7 = this.cScale7 || "#ffdf20", this.cScale8 = this.cScale8 || "#a3b3ff", this.cScale9 = this.cScale9 || "#bbf451", this.cScale10 = this.cScale10 || "#74d4ff", this.cScale11 = this.cScale11 || "#ffa1ad";
    for (let r = 0; r < this.THEME_COLOR_LIMIT; r++)
      this["cScaleInv" + r] = this["cScaleInv" + r] || F(this["cScale" + r]);
    for (let r = 0; r < this.THEME_COLOR_LIMIT; r++)
      this.darkMode ? this["cScalePeer" + r] = this["cScalePeer" + r] || R(this["cScale" + r], 10) : this["cScalePeer" + r] = this["cScalePeer" + r] || P(this["cScale" + r], 10);
    this.scaleLabelColor = this.scaleLabelColor || this.labelTextColor;
    for (let r = 0; r < this.THEME_COLOR_LIMIT; r++)
      this["cScaleLabel" + r] = P(this["cScale" + r], 75);
    const t = this.darkMode ? -4 : -1;
    for (let r = 0; r < 5; r++)
      this["surface" + r] = this["surface" + r] || k(this.mainBkg, { h: 180, s: -15, l: t * (5 + r * 3) }), this["surfacePeer" + r] = this["surfacePeer" + r] || k(this.mainBkg, { h: 180, s: -15, l: t * (8 + r * 3) });
    this.classText = this.classText || this.textColor, this.fillType0 = this.fillType0 || this.primaryColor, this.fillType1 = this.fillType1 || this.secondaryColor, this.fillType2 = this.fillType2 || k(this.primaryColor, { h: 64 }), this.fillType3 = this.fillType3 || k(this.secondaryColor, { h: 64 }), this.fillType4 = this.fillType4 || k(this.primaryColor, { h: -64 }), this.fillType5 = this.fillType5 || k(this.secondaryColor, { h: -64 }), this.fillType6 = this.fillType6 || k(this.primaryColor, { h: 128 }), this.fillType7 = this.fillType7 || k(this.secondaryColor, { h: 128 }), this.pie1 = this.pie1 || this.primaryColor, this.pie2 = this.pie2 || this.secondaryColor, this.pie3 = this.pie3 || this.tertiaryColor, this.pie4 = this.pie4 || k(this.primaryColor, { l: -10 }), this.pie5 = this.pie5 || k(this.secondaryColor, { l: -10 }), this.pie6 = this.pie6 || k(this.tertiaryColor, { l: -10 }), this.pie7 = this.pie7 || k(this.primaryColor, { h: 60, l: -10 }), this.pie8 = this.pie8 || k(this.primaryColor, { h: -60, l: -10 }), this.pie9 = this.pie9 || k(this.primaryColor, { h: 120, l: 0 }), this.pie10 = this.pie10 || k(this.primaryColor, { h: 60, l: -20 }), this.pie11 = this.pie11 || k(this.primaryColor, { h: -60, l: -20 }), this.pie12 = this.pie12 || k(this.primaryColor, { h: 120, l: -10 }), this.pieTitleTextSize = this.pieTitleTextSize || "25px", this.pieTitleTextColor = this.pieTitleTextColor || this.taskTextDarkColor, this.pieSectionTextSize = this.pieSectionTextSize || "17px", this.pieSectionTextColor = this.pieSectionTextColor || this.textColor, this.pieLegendTextSize = this.pieLegendTextSize || "17px", this.pieLegendTextColor = this.pieLegendTextColor || this.taskTextDarkColor, this.pieStrokeColor = this.pieStrokeColor || "black", this.pieStrokeWidth = this.pieStrokeWidth || "2px", this.pieOuterStrokeWidth = this.pieOuterStrokeWidth || "2px", this.pieOuterStrokeColor = this.pieOuterStrokeColor || "black", this.pieOpacity = this.pieOpacity || "0.7", this.vennTitleTextColor = this.vennTitleTextColor ?? this.titleColor, this.vennSetTextColor = this.vennSetTextColor ?? this.textColor, this.quadrant1Fill = this.quadrant1Fill || this.primaryColor, this.quadrant2Fill = this.quadrant2Fill || k(this.primaryColor, { r: 5, g: 5, b: 5 }), this.quadrant3Fill = this.quadrant3Fill || k(this.primaryColor, { r: 10, g: 10, b: 10 }), this.quadrant4Fill = this.quadrant4Fill || k(this.primaryColor, { r: 15, g: 15, b: 15 }), this.quadrant1TextFill = this.quadrant1TextFill || this.primaryTextColor, this.quadrant2TextFill = this.quadrant2TextFill || k(this.primaryTextColor, { r: -5, g: -5, b: -5 }), this.quadrant3TextFill = this.quadrant3TextFill || k(this.primaryTextColor, { r: -10, g: -10, b: -10 }), this.quadrant4TextFill = this.quadrant4TextFill || k(this.primaryTextColor, { r: -15, g: -15, b: -15 }), this.quadrantPointFill = this.quadrantPointFill || Ke(this.quadrant1Fill) ? R(this.quadrant1Fill) : P(this.quadrant1Fill), this.quadrantPointTextFill = this.quadrantPointTextFill || this.primaryTextColor, this.quadrantXAxisTextFill = this.quadrantXAxisTextFill || this.primaryTextColor, this.quadrantYAxisTextFill = this.quadrantYAxisTextFill || this.primaryTextColor, this.quadrantInternalBorderStrokeFill = this.quadrantInternalBorderStrokeFill || this.primaryBorderColor, this.quadrantExternalBorderStrokeFill = this.quadrantExternalBorderStrokeFill || this.primaryBorderColor, this.quadrantTitleFill = this.quadrantTitleFill || this.primaryTextColor, this.xyChart = {
      backgroundColor: this.xyChart?.backgroundColor || this.background,
      titleColor: this.xyChart?.titleColor || this.primaryTextColor,
      legendTextColor: this.xyChart?.legendTextColor || this.primaryTextColor,
      xAxisTitleColor: this.xyChart?.xAxisTitleColor || this.primaryTextColor,
      xAxisLabelColor: this.xyChart?.xAxisLabelColor || this.primaryTextColor,
      xAxisTickColor: this.xyChart?.xAxisTickColor || this.primaryTextColor,
      xAxisLineColor: this.xyChart?.xAxisLineColor || this.primaryTextColor,
      yAxisTitleColor: this.xyChart?.yAxisTitleColor || this.primaryTextColor,
      yAxisLabelColor: this.xyChart?.yAxisLabelColor || this.primaryTextColor,
      yAxisTickColor: this.xyChart?.yAxisTickColor || this.primaryTextColor,
      yAxisLineColor: this.xyChart?.yAxisLineColor || this.primaryTextColor,
      plotColorPalette: this.xyChart?.plotColorPalette || "#FFF4DD,#FFD8B1,#FFA07A,#ECEFF1,#D6DBDF,#C3E0A8,#FFB6A4,#FFD74D,#738FA7,#FFFFF0"
    }, this.requirementBackground = this.requirementBackground || this.primaryColor, this.requirementBorderColor = this.requirementBorderColor || this.primaryBorderColor, this.requirementBorderSize = this.requirementBorderSize || "1", this.requirementTextColor = this.requirementTextColor || this.primaryTextColor, this.relationColor = this.relationColor || this.lineColor, this.relationLabelBackground = this.relationLabelBackground || (this.darkMode ? P(this.secondaryColor, 30) : this.secondaryColor), this.relationLabelColor = this.relationLabelColor || this.actorTextColor, this.git0 = this.git0 || this.primaryColor, this.git1 = this.git1 || this.secondaryColor, this.git2 = this.git2 || this.tertiaryColor, this.git3 = this.git3 || k(this.primaryColor, { h: -30 }), this.git4 = this.git4 || k(this.primaryColor, { h: -60 }), this.git5 = this.git5 || k(this.primaryColor, { h: -90 }), this.git6 = this.git6 || k(this.primaryColor, { h: 60 }), this.git7 = this.git7 || k(this.primaryColor, { h: 120 }), this.darkMode ? (this.git0 = R(this.git0, 25), this.git1 = R(this.git1, 25), this.git2 = R(this.git2, 25), this.git3 = R(this.git3, 25), this.git4 = R(this.git4, 25), this.git5 = R(this.git5, 25), this.git6 = R(this.git6, 25), this.git7 = R(this.git7, 25)) : (this.git0 = P(this.git0, 25), this.git1 = P(this.git1, 25), this.git2 = P(this.git2, 25), this.git3 = P(this.git3, 25), this.git4 = P(this.git4, 25), this.git5 = P(this.git5, 25), this.git6 = P(this.git6, 25), this.git7 = P(this.git7, 25)), this.gitInv0 = this.gitInv0 || F(this.git0), this.gitInv1 = this.gitInv1 || F(this.git1), this.gitInv2 = this.gitInv2 || F(this.git2), this.gitInv3 = this.gitInv3 || F(this.git3), this.gitInv4 = this.gitInv4 || F(this.git4), this.gitInv5 = this.gitInv5 || F(this.git5), this.gitInv6 = this.gitInv6 || F(this.git6), this.gitInv7 = this.gitInv7 || F(this.git7), this.branchLabelColor = this.branchLabelColor || (this.darkMode ? "black" : this.labelTextColor), this.gitBranchLabel0 = this.gitBranchLabel0 || this.branchLabelColor, this.gitBranchLabel1 = this.gitBranchLabel1 || this.branchLabelColor, this.gitBranchLabel2 = this.gitBranchLabel2 || this.branchLabelColor, this.gitBranchLabel3 = this.gitBranchLabel3 || this.branchLabelColor, this.gitBranchLabel4 = this.gitBranchLabel4 || this.branchLabelColor, this.gitBranchLabel5 = this.gitBranchLabel5 || this.branchLabelColor, this.gitBranchLabel6 = this.gitBranchLabel6 || this.branchLabelColor, this.gitBranchLabel7 = this.gitBranchLabel7 || this.branchLabelColor, this.tagLabelColor = this.tagLabelColor || this.primaryTextColor, this.tagLabelBackground = this.tagLabelBackground || this.primaryColor, this.tagLabelBorder = this.tagBorder || this.primaryBorderColor, this.tagLabelFontSize = this.tagLabelFontSize || "10px", this.commitLabelColor = this.commitLabelColor || this.secondaryTextColor, this.commitLabelBackground = this.commitLabelBackground || this.secondaryColor, this.commitLabelFontSize = this.commitLabelFontSize || "10px", this.commitLineColor = this.commitLineColor ?? "#BDBCCC", this.fontWeight = 600, this.erEdgeLabelBackground = "#16141F", this.attributeBackgroundColorOdd = this.attributeBackgroundColorOdd || hr, this.attributeBackgroundColorEven = this.attributeBackgroundColorEven || cr;
  }
  calculate(t) {
    if (typeof t != "object") {
      this.updateColors();
      return;
    }
    const r = Object.keys(t);
    r.forEach((i) => {
      this[i] = t[i];
    }), this.updateColors(), r.forEach((i) => {
      this[i] = t[i];
    });
  }
}, p(Gi, "Theme"), Gi), ik = /* @__PURE__ */ p((e) => {
  const t = new rk();
  return t.calculate(e), t;
}, "getThemeVariables"), Tr = {
  base: {
    getThemeVariables: Rb
  },
  dark: {
    getThemeVariables: Nb
  },
  default: {
    getThemeVariables: Wb
  },
  forest: {
    getThemeVariables: Hb
  },
  neutral: {
    getThemeVariables: Ub
  },
  neo: {
    getThemeVariables: jb
  },
  "neo-dark": {
    getThemeVariables: Vb
  },
  redux: {
    getThemeVariables: Zb
  },
  "redux-dark": {
    getThemeVariables: Jb
  },
  "redux-color": {
    getThemeVariables: ek
  },
  "redux-dark-color": {
    getThemeVariables: ik
  }
}, he = {
  flowchart: {
    useMaxWidth: !0,
    titleTopMargin: 25,
    subGraphTitleMargin: {
      top: 0,
      bottom: 0
    },
    diagramPadding: 8,
    htmlLabels: null,
    nodeSpacing: 50,
    rankSpacing: 50,
    curve: "basis",
    padding: 15,
    defaultRenderer: "dagre-wrapper",
    wrappingWidth: 200,
    inheritDir: !1
  },
  swimlane: {
    useMaxWidth: !0,
    lineHops: "arc",
    ignoreCrossLaneEdges: !0,
    optimizeRanksByCrossings: !0,
    automaticLaneOrdering: !1
  },
  sequence: {
    useMaxWidth: !0,
    hideUnusedParticipants: !1,
    activationWidth: 10,
    diagramMarginX: 50,
    diagramMarginY: 10,
    actorMargin: 50,
    width: 150,
    height: 65,
    boxMargin: 10,
    boxTextMargin: 5,
    noteMargin: 10,
    messageMargin: 35,
    messageAlign: "center",
    mirrorActors: !0,
    forceMenus: !1,
    bottomMarginAdj: 1,
    rightAngles: !1,
    showSequenceNumbers: !1,
    actorFontSize: 14,
    actorFontFamily: '"Open Sans", sans-serif',
    actorFontWeight: 400,
    noteFontSize: 14,
    noteFontFamily: '"trebuchet ms", verdana, arial, sans-serif',
    noteFontWeight: 400,
    noteAlign: "center",
    messageFontSize: 16,
    messageFontFamily: '"trebuchet ms", verdana, arial, sans-serif',
    messageFontWeight: 400,
    wrap: !1,
    wrapPadding: 10,
    labelBoxWidth: 50,
    labelBoxHeight: 20
  },
  gantt: {
    useMaxWidth: !0,
    titleTopMargin: 25,
    barHeight: 20,
    barGap: 4,
    topPadding: 50,
    rightPadding: 75,
    leftPadding: 75,
    gridLineStartPadding: 35,
    fontSize: 11,
    sectionFontSize: 11,
    numberSectionStyles: 4,
    axisFormat: "%Y-%m-%d",
    topAxis: !1,
    displayMode: "",
    weekday: "sunday"
  },
  journey: {
    useMaxWidth: !0,
    diagramMarginX: 50,
    diagramMarginY: 10,
    leftMargin: 150,
    maxLabelWidth: 360,
    width: 150,
    height: 50,
    boxMargin: 10,
    boxTextMargin: 5,
    noteMargin: 10,
    messageMargin: 35,
    messageAlign: "center",
    bottomMarginAdj: 1,
    rightAngles: !1,
    taskFontSize: 14,
    taskFontFamily: '"Open Sans", sans-serif',
    taskMargin: 50,
    activationWidth: 10,
    textPlacement: "fo",
    actorColours: [
      "#8FBC8F",
      "#7CFC00",
      "#00FFFF",
      "#20B2AA",
      "#B0E0E6",
      "#FFFFE0"
    ],
    sectionFills: [
      "#191970",
      "#8B008B",
      "#4B0082",
      "#2F4F4F",
      "#800000",
      "#8B4513",
      "#00008B"
    ],
    sectionColours: [
      "#fff"
    ],
    titleColor: "",
    titleFontFamily: '"trebuchet ms", verdana, arial, sans-serif',
    titleFontSize: "4ex"
  },
  class: {
    useMaxWidth: !0,
    titleTopMargin: 25,
    arrowMarkerAbsolute: !1,
    dividerMargin: 10,
    padding: 5,
    textHeight: 10,
    defaultRenderer: "dagre-wrapper",
    htmlLabels: !1,
    hideEmptyMembersBox: !1,
    hierarchicalNamespaces: !0
  },
  state: {
    useMaxWidth: !0,
    titleTopMargin: 25,
    dividerMargin: 10,
    sizeUnit: 5,
    padding: 8,
    textHeight: 10,
    titleShift: -15,
    noteMargin: 10,
    forkWidth: 70,
    forkHeight: 7,
    miniPadding: 2,
    fontSizeFactor: 5.02,
    fontSize: 24,
    labelHeight: 16,
    edgeLengthFactor: "20",
    compositTitleSize: 35,
    radius: 5,
    defaultRenderer: "dagre-wrapper"
  },
  er: {
    useMaxWidth: !0,
    titleTopMargin: 25,
    diagramPadding: 20,
    layoutDirection: "TB",
    minEntityWidth: 100,
    minEntityHeight: 75,
    entityPadding: 15,
    nodeSpacing: 140,
    rankSpacing: 80,
    stroke: "gray",
    fill: "honeydew",
    fontSize: 12
  },
  pie: {
    useMaxWidth: !0,
    textPosition: 0.75,
    donutHole: 0,
    legendPosition: "right",
    highlightSlice: ""
  },
  quadrantChart: {
    useMaxWidth: !0,
    chartWidth: 500,
    chartHeight: 500,
    titleFontSize: 20,
    titlePadding: 10,
    quadrantPadding: 5,
    xAxisLabelPadding: 5,
    yAxisLabelPadding: 5,
    xAxisLabelFontSize: 16,
    yAxisLabelFontSize: 16,
    quadrantLabelFontSize: 16,
    quadrantTextTopPadding: 5,
    pointTextPadding: 5,
    pointLabelFontSize: 12,
    pointRadius: 5,
    xAxisPosition: "top",
    yAxisPosition: "left",
    quadrantInternalBorderStrokeWidth: 1,
    quadrantExternalBorderStrokeWidth: 2
  },
  xyChart: {
    useMaxWidth: !0,
    width: 700,
    height: 500,
    titleFontSize: 20,
    titlePadding: 10,
    showDataLabel: !1,
    showDataLabelOutsideBar: !1,
    showTitle: !0,
    showLegend: !0,
    legendFontSize: 14,
    legendPadding: 10,
    xAxis: {
      $ref: "#/$defs/XYChartAxisConfig",
      showLabel: !0,
      labelFontSize: 14,
      labelPadding: 5,
      showTitle: !0,
      titleFontSize: 16,
      titlePadding: 5,
      showTick: !0,
      tickLength: 5,
      tickWidth: 2,
      showAxisLine: !0,
      axisLineWidth: 2,
      labelRotation: 0
    },
    yAxis: {
      $ref: "#/$defs/XYChartAxisConfig",
      showLabel: !0,
      labelFontSize: 14,
      labelPadding: 5,
      showTitle: !0,
      titleFontSize: 16,
      titlePadding: 5,
      showTick: !0,
      tickLength: 5,
      tickWidth: 2,
      showAxisLine: !0,
      axisLineWidth: 2,
      labelRotation: 0
    },
    chartOrientation: "vertical",
    plotReservedSpacePercent: 50
  },
  requirement: {
    useMaxWidth: !0,
    rect_fill: "#f9f9f9",
    text_color: "#333",
    rect_border_size: "0.5px",
    rect_border_color: "#bbb",
    rect_min_width: 200,
    rect_min_height: 200,
    fontSize: 14,
    rect_padding: 10,
    line_height: 20
  },
  mindmap: {
    useMaxWidth: !0,
    padding: 10,
    maxNodeWidth: 200,
    layoutAlgorithm: "cose-bilkent"
  },
  ishikawa: {
    useMaxWidth: !0,
    diagramPadding: 20
  },
  kanban: {
    useMaxWidth: !0,
    padding: 8,
    sectionWidth: 200,
    ticketBaseUrl: ""
  },
  timeline: {
    useMaxWidth: !0,
    diagramMarginX: 50,
    diagramMarginY: 10,
    leftMargin: 150,
    width: 150,
    height: 50,
    boxMargin: 10,
    boxTextMargin: 5,
    noteMargin: 10,
    messageMargin: 35,
    messageAlign: "center",
    bottomMarginAdj: 1,
    rightAngles: !1,
    taskFontSize: 14,
    taskFontFamily: '"Open Sans", sans-serif',
    taskMargin: 50,
    activationWidth: 10,
    textPlacement: "fo",
    actorColours: [
      "#8FBC8F",
      "#7CFC00",
      "#00FFFF",
      "#20B2AA",
      "#B0E0E6",
      "#FFFFE0"
    ],
    sectionFills: [
      "#191970",
      "#8B008B",
      "#4B0082",
      "#2F4F4F",
      "#800000",
      "#8B4513",
      "#00008B"
    ],
    sectionColours: [
      "#fff"
    ],
    disableMulticolor: !1
  },
  gitGraph: {
    useMaxWidth: !0,
    titleTopMargin: 25,
    diagramPadding: 8,
    nodeLabel: {
      width: 75,
      height: 100,
      x: -25,
      y: 0
    },
    mainBranchName: "main",
    mainBranchOrder: 0,
    showCommitLabel: !0,
    showBranches: !0,
    rotateCommitLabel: !0,
    parallelCommits: !1,
    arrowMarkerAbsolute: !1
  },
  c4: {
    useMaxWidth: !0,
    diagramMarginX: 50,
    diagramMarginY: 10,
    c4ShapeMargin: 50,
    c4ShapePadding: 20,
    width: 216,
    height: 60,
    boxMargin: 10,
    c4ShapeInRow: 4,
    nextLinePaddingX: 0,
    c4BoundaryInRow: 2,
    personFontSize: 14,
    personFontFamily: '"Open Sans", sans-serif',
    personFontWeight: "normal",
    external_personFontSize: 14,
    external_personFontFamily: '"Open Sans", sans-serif',
    external_personFontWeight: "normal",
    systemFontSize: 14,
    systemFontFamily: '"Open Sans", sans-serif',
    systemFontWeight: "normal",
    external_systemFontSize: 14,
    external_systemFontFamily: '"Open Sans", sans-serif',
    external_systemFontWeight: "normal",
    system_dbFontSize: 14,
    system_dbFontFamily: '"Open Sans", sans-serif',
    system_dbFontWeight: "normal",
    external_system_dbFontSize: 14,
    external_system_dbFontFamily: '"Open Sans", sans-serif',
    external_system_dbFontWeight: "normal",
    system_queueFontSize: 14,
    system_queueFontFamily: '"Open Sans", sans-serif',
    system_queueFontWeight: "normal",
    external_system_queueFontSize: 14,
    external_system_queueFontFamily: '"Open Sans", sans-serif',
    external_system_queueFontWeight: "normal",
    boundaryFontSize: 14,
    boundaryFontFamily: '"Open Sans", sans-serif',
    boundaryFontWeight: "normal",
    messageFontSize: 12,
    messageFontFamily: '"Open Sans", sans-serif',
    messageFontWeight: "normal",
    containerFontSize: 14,
    containerFontFamily: '"Open Sans", sans-serif',
    containerFontWeight: "normal",
    external_containerFontSize: 14,
    external_containerFontFamily: '"Open Sans", sans-serif',
    external_containerFontWeight: "normal",
    container_dbFontSize: 14,
    container_dbFontFamily: '"Open Sans", sans-serif',
    container_dbFontWeight: "normal",
    external_container_dbFontSize: 14,
    external_container_dbFontFamily: '"Open Sans", sans-serif',
    external_container_dbFontWeight: "normal",
    container_queueFontSize: 14,
    container_queueFontFamily: '"Open Sans", sans-serif',
    container_queueFontWeight: "normal",
    external_container_queueFontSize: 14,
    external_container_queueFontFamily: '"Open Sans", sans-serif',
    external_container_queueFontWeight: "normal",
    componentFontSize: 14,
    componentFontFamily: '"Open Sans", sans-serif',
    componentFontWeight: "normal",
    external_componentFontSize: 14,
    external_componentFontFamily: '"Open Sans", sans-serif',
    external_componentFontWeight: "normal",
    component_dbFontSize: 14,
    component_dbFontFamily: '"Open Sans", sans-serif',
    component_dbFontWeight: "normal",
    external_component_dbFontSize: 14,
    external_component_dbFontFamily: '"Open Sans", sans-serif',
    external_component_dbFontWeight: "normal",
    component_queueFontSize: 14,
    component_queueFontFamily: '"Open Sans", sans-serif',
    component_queueFontWeight: "normal",
    external_component_queueFontSize: 14,
    external_component_queueFontFamily: '"Open Sans", sans-serif',
    external_component_queueFontWeight: "normal",
    wrap: !0,
    wrapPadding: 10,
    person_bg_color: "#08427B",
    person_border_color: "#073B6F",
    external_person_bg_color: "#686868",
    external_person_border_color: "#8A8A8A",
    system_bg_color: "#1168BD",
    system_border_color: "#3C7FC0",
    system_db_bg_color: "#1168BD",
    system_db_border_color: "#3C7FC0",
    system_queue_bg_color: "#1168BD",
    system_queue_border_color: "#3C7FC0",
    external_system_bg_color: "#999999",
    external_system_border_color: "#8A8A8A",
    external_system_db_bg_color: "#999999",
    external_system_db_border_color: "#8A8A8A",
    external_system_queue_bg_color: "#999999",
    external_system_queue_border_color: "#8A8A8A",
    container_bg_color: "#438DD5",
    container_border_color: "#3C7FC0",
    container_db_bg_color: "#438DD5",
    container_db_border_color: "#3C7FC0",
    container_queue_bg_color: "#438DD5",
    container_queue_border_color: "#3C7FC0",
    external_container_bg_color: "#B3B3B3",
    external_container_border_color: "#A6A6A6",
    external_container_db_bg_color: "#B3B3B3",
    external_container_db_border_color: "#A6A6A6",
    external_container_queue_bg_color: "#B3B3B3",
    external_container_queue_border_color: "#A6A6A6",
    component_bg_color: "#85BBF0",
    component_border_color: "#78A8D8",
    component_db_bg_color: "#85BBF0",
    component_db_border_color: "#78A8D8",
    component_queue_bg_color: "#85BBF0",
    component_queue_border_color: "#78A8D8",
    external_component_bg_color: "#CCCCCC",
    external_component_border_color: "#BFBFBF",
    external_component_db_bg_color: "#CCCCCC",
    external_component_db_border_color: "#BFBFBF",
    external_component_queue_bg_color: "#CCCCCC",
    external_component_queue_border_color: "#BFBFBF"
  },
  sankey: {
    useMaxWidth: !0,
    width: 600,
    height: 400,
    linkColor: "gradient",
    nodeAlignment: "justify",
    showValues: !0,
    prefix: "",
    suffix: "",
    nodeWidth: 10,
    nodePadding: 12,
    labelStyle: "legacy"
  },
  block: {
    useMaxWidth: !0,
    padding: 8
  },
  packet: {
    useMaxWidth: !0,
    rowHeight: 32,
    bitWidth: 32,
    bitsPerRow: 32,
    showBits: !0,
    paddingX: 5,
    paddingY: 5
  },
  treeView: {
    useMaxWidth: !0,
    rowIndent: 10,
    paddingX: 5,
    paddingY: 5,
    lineThickness: 1,
    showIcons: !1,
    defaultIconPack: "",
    filenameIcons: {},
    extensionIcons: {}
  },
  architecture: {
    useMaxWidth: !0,
    padding: 40,
    iconSize: 80,
    fontSize: 16,
    randomize: !1,
    nodeSeparation: 75,
    idealEdgeLengthMultiplier: 1.5,
    edgeElasticity: 0.45,
    numIter: 2500,
    seed: 1
  },
  eventmodeling: {
    useMaxWidth: !0,
    padding: 30,
    rowHeight: 32
  },
  radar: {
    useMaxWidth: !0,
    width: 600,
    height: 600,
    marginTop: 50,
    marginRight: 50,
    marginBottom: 50,
    marginLeft: 50,
    axisScaleFactor: 1,
    axisLabelFactor: 1.05,
    curveTension: 0.17
  },
  venn: {
    useMaxWidth: !0,
    width: 800,
    height: 450,
    padding: 8,
    useDebugLayout: !1
  },
  cynefin: {
    useMaxWidth: !0,
    width: 800,
    height: 600,
    padding: 40,
    showDomainDescriptions: !0,
    boundaryAmplitude: 8,
    seed: 0
  },
  theme: "default",
  look: "classic",
  handDrawnSeed: 0,
  layout: "dagre",
  maxTextSize: 5e4,
  maxEdges: 500,
  darkMode: !1,
  fontFamily: '"trebuchet ms", verdana, arial, sans-serif;',
  logLevel: 5,
  securityLevel: "strict",
  startOnLoad: !0,
  arrowMarkerAbsolute: !1,
  secure: [
    "secure",
    "securityLevel",
    "startOnLoad",
    "maxTextSize",
    "suppressErrorRendering",
    "maxEdges"
  ],
  legacyMathML: !1,
  forceLegacyMathML: !1,
  deterministicIds: !1,
  fontSize: 16,
  markdownAutoWrap: !0,
  suppressErrorRendering: !1
}, Yf = {
  ...he,
  // Set, even though they're `undefined` so that `configKeys` finds these keys
  // TODO: Should we replace these with `null` so that they can go in the JSON Schema?
  deterministicIDSeed: void 0,
  elk: {
    // mergeEdges is needed here to be considered
    mergeEdges: !1,
    nodePlacementStrategy: "BRANDES_KOEPF",
    nodePlacementAlignment: "NONE",
    forceNodeModelOrder: !1,
    considerModelOrder: "NODES_AND_EDGES",
    keepEntryNodeOnTop: !1
  },
  themeCSS: void 0,
  // add non-JSON default config values
  themeVariables: Tr.default.getThemeVariables(),
  sequence: {
    ...he.sequence,
    messageFont: /* @__PURE__ */ p(function() {
      return {
        fontFamily: this.messageFontFamily,
        fontSize: this.messageFontSize,
        fontWeight: this.messageFontWeight
      };
    }, "messageFont"),
    noteFont: /* @__PURE__ */ p(function() {
      return {
        fontFamily: this.noteFontFamily,
        fontSize: this.noteFontSize,
        fontWeight: this.noteFontWeight
      };
    }, "noteFont"),
    actorFont: /* @__PURE__ */ p(function() {
      return {
        fontFamily: this.actorFontFamily,
        fontSize: this.actorFontSize,
        fontWeight: this.actorFontWeight
      };
    }, "actorFont")
  },
  class: {
    defaultRenderer: "dagre-wrapper",
    hideEmptyMembersBox: !1,
    hierarchicalNamespaces: !0
    // `padding` is intentionally left undefined so the unified (v2) renderer keeps
    // its own node sizing — setting the schema default of 5 here would change class
    // node dimensions.
  },
  gantt: {
    ...he.gantt,
    tickInterval: void 0,
    useWidth: void 0
    // can probably be removed since `configKeys` already includes this
  },
  c4: {
    ...he.c4,
    useWidth: void 0,
    personFont: /* @__PURE__ */ p(function() {
      return {
        fontFamily: this.personFontFamily,
        fontSize: this.personFontSize,
        fontWeight: this.personFontWeight
      };
    }, "personFont"),
    flowchart: {
      ...he.flowchart,
      inheritDir: !1
      // default to legacy behavior
    },
    external_personFont: /* @__PURE__ */ p(function() {
      return {
        fontFamily: this.external_personFontFamily,
        fontSize: this.external_personFontSize,
        fontWeight: this.external_personFontWeight
      };
    }, "external_personFont"),
    systemFont: /* @__PURE__ */ p(function() {
      return {
        fontFamily: this.systemFontFamily,
        fontSize: this.systemFontSize,
        fontWeight: this.systemFontWeight
      };
    }, "systemFont"),
    external_systemFont: /* @__PURE__ */ p(function() {
      return {
        fontFamily: this.external_systemFontFamily,
        fontSize: this.external_systemFontSize,
        fontWeight: this.external_systemFontWeight
      };
    }, "external_systemFont"),
    system_dbFont: /* @__PURE__ */ p(function() {
      return {
        fontFamily: this.system_dbFontFamily,
        fontSize: this.system_dbFontSize,
        fontWeight: this.system_dbFontWeight
      };
    }, "system_dbFont"),
    external_system_dbFont: /* @__PURE__ */ p(function() {
      return {
        fontFamily: this.external_system_dbFontFamily,
        fontSize: this.external_system_dbFontSize,
        fontWeight: this.external_system_dbFontWeight
      };
    }, "external_system_dbFont"),
    system_queueFont: /* @__PURE__ */ p(function() {
      return {
        fontFamily: this.system_queueFontFamily,
        fontSize: this.system_queueFontSize,
        fontWeight: this.system_queueFontWeight
      };
    }, "system_queueFont"),
    external_system_queueFont: /* @__PURE__ */ p(function() {
      return {
        fontFamily: this.external_system_queueFontFamily,
        fontSize: this.external_system_queueFontSize,
        fontWeight: this.external_system_queueFontWeight
      };
    }, "external_system_queueFont"),
    containerFont: /* @__PURE__ */ p(function() {
      return {
        fontFamily: this.containerFontFamily,
        fontSize: this.containerFontSize,
        fontWeight: this.containerFontWeight
      };
    }, "containerFont"),
    external_containerFont: /* @__PURE__ */ p(function() {
      return {
        fontFamily: this.external_containerFontFamily,
        fontSize: this.external_containerFontSize,
        fontWeight: this.external_containerFontWeight
      };
    }, "external_containerFont"),
    container_dbFont: /* @__PURE__ */ p(function() {
      return {
        fontFamily: this.container_dbFontFamily,
        fontSize: this.container_dbFontSize,
        fontWeight: this.container_dbFontWeight
      };
    }, "container_dbFont"),
    external_container_dbFont: /* @__PURE__ */ p(function() {
      return {
        fontFamily: this.external_container_dbFontFamily,
        fontSize: this.external_container_dbFontSize,
        fontWeight: this.external_container_dbFontWeight
      };
    }, "external_container_dbFont"),
    container_queueFont: /* @__PURE__ */ p(function() {
      return {
        fontFamily: this.container_queueFontFamily,
        fontSize: this.container_queueFontSize,
        fontWeight: this.container_queueFontWeight
      };
    }, "container_queueFont"),
    external_container_queueFont: /* @__PURE__ */ p(function() {
      return {
        fontFamily: this.external_container_queueFontFamily,
        fontSize: this.external_container_queueFontSize,
        fontWeight: this.external_container_queueFontWeight
      };
    }, "external_container_queueFont"),
    componentFont: /* @__PURE__ */ p(function() {
      return {
        fontFamily: this.componentFontFamily,
        fontSize: this.componentFontSize,
        fontWeight: this.componentFontWeight
      };
    }, "componentFont"),
    external_componentFont: /* @__PURE__ */ p(function() {
      return {
        fontFamily: this.external_componentFontFamily,
        fontSize: this.external_componentFontSize,
        fontWeight: this.external_componentFontWeight
      };
    }, "external_componentFont"),
    component_dbFont: /* @__PURE__ */ p(function() {
      return {
        fontFamily: this.component_dbFontFamily,
        fontSize: this.component_dbFontSize,
        fontWeight: this.component_dbFontWeight
      };
    }, "component_dbFont"),
    external_component_dbFont: /* @__PURE__ */ p(function() {
      return {
        fontFamily: this.external_component_dbFontFamily,
        fontSize: this.external_component_dbFontSize,
        fontWeight: this.external_component_dbFontWeight
      };
    }, "external_component_dbFont"),
    component_queueFont: /* @__PURE__ */ p(function() {
      return {
        fontFamily: this.component_queueFontFamily,
        fontSize: this.component_queueFontSize,
        fontWeight: this.component_queueFontWeight
      };
    }, "component_queueFont"),
    external_component_queueFont: /* @__PURE__ */ p(function() {
      return {
        fontFamily: this.external_component_queueFontFamily,
        fontSize: this.external_component_queueFontSize,
        fontWeight: this.external_component_queueFontWeight
      };
    }, "external_component_queueFont"),
    boundaryFont: /* @__PURE__ */ p(function() {
      return {
        fontFamily: this.boundaryFontFamily,
        fontSize: this.boundaryFontSize,
        fontWeight: this.boundaryFontWeight
      };
    }, "boundaryFont"),
    messageFont: /* @__PURE__ */ p(function() {
      return {
        fontFamily: this.messageFontFamily,
        fontSize: this.messageFontSize,
        fontWeight: this.messageFontWeight
      };
    }, "messageFont")
  },
  pie: {
    ...he.pie,
    useWidth: 984
  },
  xyChart: {
    ...he.xyChart,
    useWidth: void 0
  },
  requirement: {
    ...he.requirement,
    useWidth: void 0
  },
  packet: {
    ...he.packet
  },
  eventmodeling: {
    ...he.eventmodeling
  },
  treeView: {
    ...he.treeView,
    useWidth: void 0
  },
  radar: {
    ...he.radar
  },
  railroad: {
    ...he.railroad,
    // Railroad colors and typography derive from the active theme unless explicitly overridden.
    fontSize: void 0,
    fontFamily: void 0,
    terminalFill: void 0,
    terminalStroke: void 0,
    terminalTextColor: void 0,
    nonTerminalFill: void 0,
    nonTerminalStroke: void 0,
    nonTerminalTextColor: void 0,
    lineColor: void 0,
    markerFill: void 0,
    commentFill: void 0,
    commentStroke: void 0,
    commentTextColor: void 0,
    specialFill: void 0,
    specialStroke: void 0,
    ruleNameColor: void 0
  },
  ishikawa: {
    ...he.ishikawa
  },
  sankey: {
    ...he.sankey,
    // Set so that `configKeys` includes this key for sanitizeDirective
    nodeColors: void 0
  },
  treemap: {
    useMaxWidth: !0,
    padding: 10,
    diagramPadding: 8,
    showValues: !0,
    nodeWidth: 100,
    nodeHeight: 40,
    borderWidth: 1,
    valueFontSize: 12,
    labelFontSize: 14,
    valueFormat: ","
  },
  venn: {
    ...he.venn
  },
  cynefin: {
    ...he.cynefin
  }
}, Uf = /* @__PURE__ */ p((e, t = "") => Object.keys(e).reduce((r, i) => Array.isArray(e[i]) ? r : typeof e[i] == "object" && e[i] !== null ? [...r, t + i, ...Uf(e[i], "")] : [...r, t + i], []), "keyify"), sk = new Set(Uf(Yf, "")), Xf = Yf, ok = {
  // CSS colors (sankey)
  nodeColors: /^#[\da-f]{3,8}$|^rgb\([\d\s%,.]+\)$|^hsl\([\d\s%,.]+\)$|^[a-z]+$/i,
  // iconify icon references (treeView filenameIcons/extensionIcons)
  filenameIcons: /^[\w-]+(?::[\w-]+)?$/,
  extensionIcons: /^[\w-]+(?::[\w-]+)?$/
}, ak = /* @__PURE__ */ p((e, t) => {
  for (const r of Object.keys(e)) {
    const i = e[r];
    (r.startsWith("__") || r.includes("proto") || r.includes("constr") || typeof i != "string" || !t.test(i)) && ($.debug("sanitize deleting dictionary entry:", r, i), delete e[r]);
  }
}, "sanitizeDictionaryConfig"), Vo = /* @__PURE__ */ p((e) => {
  if ($.debug("sanitizeDirective called with", e), !(typeof e != "object" || e == null)) {
    if (Array.isArray(e)) {
      e.forEach((t) => Vo(t));
      return;
    }
    for (const t of Object.keys(e)) {
      if ($.debug("Checking key", t), t.startsWith("__") || t.includes("proto") || t.includes("constr") || !sk.has(t) || e[t] == null) {
        $.debug("sanitize deleting key: ", t), delete e[t];
        continue;
      }
      if (typeof e[t] == "object") {
        const i = ok[t];
        i ? ak(e[t], i) : ($.debug("sanitizing object", t), Vo(e[t]));
        continue;
      }
      const r = ["themeCSS", "fontFamily", "altFontFamily"];
      for (const i of r)
        t.includes(i) && ($.debug("sanitizing css option", t), e[t] = jf(e[t]));
    }
    if (e.themeVariables)
      for (const t of Object.keys(e.themeVariables)) {
        const r = e.themeVariables[t];
        r?.match && !r.match(/^[\d "#%(),.;A-Za-z]+$/) && (e.themeVariables[t] = "");
      }
    $.debug("After sanitization", e);
  }
}, "sanitizeDirective"), jf = /* @__PURE__ */ p((e) => {
  let t = 0, r = 0;
  for (const i of e) {
    if (t < r)
      return "{ /* ERROR: Unbalanced CSS */ }";
    i === "{" ? t++ : i === "}" && r++;
  }
  return t !== r ? "{ /* ERROR: Unbalanced CSS */ }" : e;
}, "sanitizeCss"), es = Object.freeze(Xf), ur = /* @__PURE__ */ p((e) => !(e === !1 || ["false", "null", "0"].includes(String(e).trim().toLowerCase())), "evaluate"), ve = ae({}, es), Ko, ci = [], Ws = ae({}, es), io = /* @__PURE__ */ p((e, t) => {
  let r = ae({}, e), i = {};
  for (const s of t)
    Kf(s), i = ae(i, s);
  if (r = ae(r, i), i.theme && i.theme in Tr) {
    const s = ae({}, Ko), o = ae(
      s.themeVariables || {},
      i.themeVariables
    );
    r.theme && r.theme in Tr && (r.themeVariables = Tr[r.theme].getThemeVariables(o));
  }
  return Ws = r, dk(Ws), Ws;
}, "updateCurrentConfig"), nk = /* @__PURE__ */ p((e) => (ve = ae({}, es), ve = ae(ve, e), e.theme && Tr[e.theme] && (ve.themeVariables = Tr[e.theme].getThemeVariables(e.themeVariables)), io(ve, ci), ve), "setSiteConfig"), lk = /* @__PURE__ */ p((e) => {
  Ko = ae({}, e);
}, "saveConfigFromInitialize"), hk = /* @__PURE__ */ p((e) => (ve = ae(ve, e), io(ve, ci), ve), "updateSiteConfig"), Gf = /* @__PURE__ */ p(() => ae({}, ve), "getSiteConfig"), Vf = /* @__PURE__ */ p((e) => (io(Ws, [e]), jt()), "setConfig"), jt = /* @__PURE__ */ p(() => ae({}, Ws), "getConfig"), Kf = /* @__PURE__ */ p((e) => {
  e && (["secure", ...ve.secure ?? []].forEach((t) => {
    Object.hasOwn(e, t) && ($.debug(`Denied attempt to modify a secure key ${t}`, e[t]), delete e[t]);
  }), Object.keys(e).forEach((t) => {
    t.startsWith("__") && delete e[t];
  }), Object.keys(e).forEach((t) => {
    typeof e[t] == "string" && (e[t].includes("<") || e[t].includes(">") || e[t].includes("url(data:")) && delete e[t], typeof e[t] == "object" && Kf(e[t]);
  }));
}, "sanitize"), ck = /* @__PURE__ */ p((e) => {
  Vo(e), e.fontFamily && !e.themeVariables?.fontFamily && (e.themeVariables = {
    ...e.themeVariables,
    fontFamily: e.fontFamily
  }), ci.push(e), io(ve, ci);
}, "addDirective"), Zo = /* @__PURE__ */ p((e = ve) => {
  ci = [], io(e, ci);
}, "reset"), uk = {
  LAZY_LOAD_DEPRECATED: "The configuration options lazyLoadedDiagrams and loadExternalDiagramsAtStartup are deprecated. Please use registerExternalDiagrams instead.",
  FLOWCHART_HTML_LABELS_DEPRECATED: "flowchart.htmlLabels is deprecated. Please use global htmlLabels instead."
}, ou = {}, Zf = /* @__PURE__ */ p((e) => {
  ou[e] || ($.warn(uk[e]), ou[e] = !0);
}, "issueWarning"), dk = /* @__PURE__ */ p((e) => {
  e && (e.lazyLoadedDiagrams || e.loadExternalDiagramsAtStartup) && Zf("LAZY_LOAD_DEPRECATED");
}, "checkConfig"), MM = /* @__PURE__ */ p(() => {
  let e = {};
  Ko && (e = ae(e, Ko));
  for (const t of ci)
    e = ae(e, t);
  return e;
}, "getUserDefinedConfig"), ye = /* @__PURE__ */ p((e) => (e.flowchart?.htmlLabels != null && Zf("FLOWCHART_HTML_LABELS_DEPRECATED"), ur(e.htmlLabels ?? e.flowchart?.htmlLabels ?? !0)), "getEffectiveHtmlLabels"), Qf = /^([^\S\n\r]*)-{3}\s*[\n\r](.*?)[\n\r]\1-{3}\s*[\n\r]+/s, zs = /%{2}{\s*(?:(\w+)\s*:|(\w+))\s*(?:(\w+)|((?:(?!}%{2}).|\r?\n)*))?\s*(?:}%{2})?/gi, fk = /\s*%%.*\n/gm, Vi, Jf = (Vi = class extends Error {
  constructor(t) {
    super(t), this.name = "UnknownDiagramError";
  }
}, p(Vi, "UnknownDiagramError"), Vi), ui = {}, ih = /* @__PURE__ */ p(function(e, t) {
  e = e.replace(Qf, "").replace(zs, "").replace(fk, `
`);
  for (const [r, { detector: i }] of Object.entries(ui))
    if (i(e, t))
      return r;
  throw new Jf(
    `No diagram type detected matching given configuration for text: ${e}`
  );
}, "detectType"), ul = /* @__PURE__ */ p((...e) => {
  for (const { id: t, detector: r, loader: i } of e)
    tp(t, r, i);
}, "registerLazyLoadedDiagrams"), tp = /* @__PURE__ */ p((e, t, r) => {
  ui[e] && $.warn(`Detector with key ${e} already exists. Overwriting.`), ui[e] = { detector: t, loader: r }, $.debug(`Detector with key ${e} added${r ? " with loader" : ""}`);
}, "addDetector"), pk = /* @__PURE__ */ p((e) => ui[e].loader, "getDiagramLoader"), so = /<br\s*\/?>/gi, gk = /* @__PURE__ */ p((e) => e ? ip(e).replace(/\\n/g, "#br#").split("#br#") : [""], "getRows"), mk = /* @__PURE__ */ (() => {
  let e = !1;
  return () => {
    e || (ep(), e = !0);
  };
})();
function ep() {
  const e = "data-temp-href-target";
  ts.addHook("beforeSanitizeAttributes", (t) => {
    t.tagName === "A" && t.hasAttribute("target") && t.setAttribute(e, t.getAttribute("target") ?? "");
  }), ts.addHook("afterSanitizeAttributes", (t) => {
    t.tagName === "A" && t.hasAttribute(e) && (t.setAttribute("target", t.getAttribute(e) ?? ""), t.removeAttribute(e), t.getAttribute("target") === "_blank" && t.setAttribute("rel", "noopener"));
  });
}
p(ep, "setupDompurifyHooks");
var rp = /* @__PURE__ */ p((e) => (mk(), ts.sanitize(e)), "removeScript"), au = /* @__PURE__ */ p((e, t) => {
  if (ye(t)) {
    const r = t.securityLevel;
    r === "antiscript" || r === "strict" || r === "sandbox" ? e = rp(e) : r !== "loose" && (e = ip(e), e = e.replace(/</g, "&lt;").replace(/>/g, "&gt;"), e = e.replace(/=/g, "&equals;"), e = bk(e));
  }
  return e;
}, "sanitizeMore"), Pe = /* @__PURE__ */ p((e, t) => e && (t.dompurifyConfig ? e = ts.sanitize(au(e, t), t.dompurifyConfig).toString() : e = ts.sanitize(au(e, t), {
  FORBID_TAGS: ["style"]
}).toString(), e), "sanitizeText"), yk = /* @__PURE__ */ p((e, t) => typeof e == "string" ? Pe(e, t) : e.flat().map((r) => Pe(r, t)), "sanitizeTextOrArray"), xk = /* @__PURE__ */ p((e) => so.test(e), "hasBreaks"), Ck = /* @__PURE__ */ p((e) => e.split(so), "splitBreaks"), bk = /* @__PURE__ */ p((e) => e.replace(/#br#/g, "<br/>"), "placeholderToBreak"), ip = /* @__PURE__ */ p((e) => e.replace(so, "#br#"), "breakToPlaceholder"), kk = /* @__PURE__ */ p((e) => {
  let t = "";
  return e && (t = window.location.protocol + "//" + window.location.host + window.location.pathname + window.location.search, t = CSS.escape(t)), t;
}, "getUrl"), wk = /* @__PURE__ */ p(function(...e) {
  const t = e.filter((r) => !isNaN(r));
  return Math.max(...t);
}, "getMax"), Sk = /* @__PURE__ */ p(function(...e) {
  const t = e.filter((r) => !isNaN(r));
  return Math.min(...t);
}, "getMin"), nu = /* @__PURE__ */ p(function(e) {
  const t = e.split(/(,)/), r = [];
  for (let i = 0; i < t.length; i++) {
    let s = t[i];
    if (s === "," && i > 0 && i + 1 < t.length) {
      const o = t[i - 1], a = t[i + 1];
      Tk(o, a) && (s = o + "," + a, i++, r.pop());
    }
    r.push(_k(s));
  }
  return r.join("");
}, "parseGenericTypes"), dl = /* @__PURE__ */ p((e, t) => Math.max(0, e.split(t).length - 1), "countOccurrence"), Tk = /* @__PURE__ */ p((e, t) => {
  const r = dl(e, "~"), i = dl(t, "~");
  return r === 1 && i === 1;
}, "shouldCombineSets"), _k = /* @__PURE__ */ p((e) => {
  const t = dl(e, "~");
  let r = !1;
  if (t <= 1)
    return e;
  t % 2 !== 0 && e.startsWith("~") && (e = e.substring(1), r = !0);
  const i = [...e];
  let s = i.indexOf("~"), o = i.lastIndexOf("~");
  for (; s !== -1 && o !== -1 && s !== o; )
    i[s] = "<", i[o] = ">", s = i.indexOf("~"), o = i.lastIndexOf("~");
  return r && i.unshift("~"), i.join("");
}, "processSet"), lu = /* @__PURE__ */ p(() => window.MathMLElement !== void 0, "isMathMLSupported"), fl = /\$\$(.*?)\$\$/g, js = /* @__PURE__ */ p((e) => (e.match(fl)?.length ?? 0) > 0, "hasKatex"), OM = /* @__PURE__ */ p(async (e, t) => {
  const r = document.createElement("div");
  r.innerHTML = await sp(e, t), r.id = "katex-temp", r.style.visibility = "hidden", r.style.position = "absolute", r.style.top = "0", document.querySelector("body")?.insertAdjacentElement("beforeend", r);
  const s = { width: r.clientWidth, height: r.clientHeight };
  return r.remove(), s;
}, "calculateMathMLDimensions"), Bk = /* @__PURE__ */ p(async (e, t) => {
  if (!js(e))
    return e;
  if (!(lu() || t.legacyMathML || t.forceLegacyMathML))
    return e.replace(fl, "MathML is unsupported in this environment.");
  {
    const { default: r } = await import("./katex-DoRnZ_sp.js"), i = t.forceLegacyMathML || !lu() && t.legacyMathML ? "htmlAndMathml" : "mathml";
    return e.split(so).map(
      (s) => js(s) ? `<div style="display: flex; align-items: center; justify-content: center; white-space: nowrap;">${s}</div>` : `<div>${s}</div>`
    ).join("").replace(
      fl,
      (s, o) => r.renderToString(o, {
        throwOnError: !0,
        displayMode: !0,
        output: i
      }).replace(/\n/g, " ").replace(/<annotation.*<\/annotation>/g, "")
    );
  }
}, "renderKatexUnsanitized"), sp = /* @__PURE__ */ p(async (e, t) => Pe(await Bk(e, t), t), "renderKatexSanitized"), oo = {
  getRows: gk,
  sanitizeText: Pe,
  sanitizeTextOrArray: yk,
  hasBreaks: xk,
  splitBreaks: Ck,
  lineBreakRegex: so,
  removeScript: rp,
  getUrl: kk,
  evaluate: ur,
  getMax: wk,
  getMin: Sk
}, vk = /* @__PURE__ */ p(function(e, t) {
  for (let r of t)
    e.attr(r[0], r[1]);
}, "d3Attrs"), Lk = /* @__PURE__ */ p(function(e, t, r) {
  let i = /* @__PURE__ */ new Map();
  return r ? (i.set("width", "100%"), i.set("style", `max-width: ${t}px;`)) : (i.set("height", e), i.set("width", t)), i;
}, "calculateSvgSizeAttrs"), op = /* @__PURE__ */ p(function(e, t, r, i) {
  const s = Lk(t, r, i);
  vk(e, s);
}, "configureSvgSize"), Ak = /* @__PURE__ */ p(function(e, t, r, i) {
  const s = t.node().getBBox(), o = s.width, a = s.height;
  $.info(`SVG bounds: ${o}x${a}`, s);
  let n = 0, l = 0;
  $.info(`Graph bounds: ${n}x${l}`, e), n = o + r * 2, l = a + r * 2, $.info(`Calculated bounds: ${n}x${l}`), op(t, l, n, i);
  const c = `${s.x - r} ${s.y - r} ${s.width + 2 * r} ${s.height + 2 * r}`;
  t.attr("viewBox", c);
}, "setupGraphViewbox"), Ro = {};
function pl(e) {
  return [...e.cssRules].map((t) => t.cssText).join(`
`);
}
p(pl, "cssStyleSheetToString");
var Ek = /* @__PURE__ */ p((e, t, r, i) => {
  let s = "";
  return e in Ro && Ro[e] ? s = Ro[e]({ ...r, svgId: i }) : $.warn(`No theme found for ${e}`), `& {
    font-family: ${r.fontFamily};
    font-size: ${r.fontSize};
    fill: ${r.textColor}
  }
  @keyframes edge-animation-frame {
    from {
      stroke-dashoffset: 0;
    }
  }
  @keyframes dash {
    to {
      stroke-dashoffset: 0;
    }
  }
  & .edge-animation-slow {
    stroke-dasharray: 9,5 !important;
    stroke-dashoffset: 900;
    animation: dash 50s linear infinite;
    stroke-linecap: round;
  }
  & .edge-animation-fast {
    stroke-dasharray: 9,5 !important;
    stroke-dashoffset: 900;
    animation: dash 20s linear infinite;
    stroke-linecap: round;
  }
  /* Classes common for multiple diagrams */

  & .error-icon {
    fill: ${r.errorBkgColor};
  }
  & .error-text {
    fill: ${r.errorTextColor};
    stroke: ${r.errorTextColor};
  }

  & .edge-thickness-normal {
    stroke-width: ${r.strokeWidth ?? 1}px;
  }
  & .edge-thickness-thick {
    stroke-width: 3.5px
  }
  & .edge-pattern-solid {
    stroke-dasharray: 0;
  }
  & .edge-thickness-invisible {
    stroke-width: 0;
    fill: none;
  }
  & .edge-pattern-dashed{
    stroke-dasharray: 3;
  }
  .edge-pattern-dotted {
    stroke-dasharray: 2;
  }

  & .marker {
    fill: ${r.lineColor};
    stroke: ${r.lineColor};
  }
  & .marker.cross {
    stroke: ${r.lineColor};
  }

  & svg {
    font-family: ${r.fontFamily};
    font-size: ${r.fontSize};
  }
   & p {
    margin: 0
   }

  ${s}
  .node .neo-node {
    stroke: ${r.nodeBorder};
  }

  [data-look="neo"].node rect, [data-look="neo"].cluster rect, [data-look="neo"].node polygon {
    stroke: ${r.useGradient ? "url(" + i + "-gradient)" : r.nodeBorder};
    filter: ${r.dropShadow ? r.dropShadow.replace("url(#drop-shadow)", `url(${i}-drop-shadow)`) : "none"};
  }
  [data-look="neo"].swimlane.cluster rect {
    filter: none;
  }


  [data-look="neo"].node path {
    stroke: ${r.useGradient ? "url(" + i + "-gradient)" : r.nodeBorder};
    stroke-width: ${r.strokeWidth ?? 1}px;
  }

  [data-look="neo"].node .outer-path {
    filter: ${r.dropShadow ? r.dropShadow.replace("url(#drop-shadow)", `url(${i}-drop-shadow)`) : "none"};
  }

  [data-look="neo"].node .neo-line path {
    stroke: ${r.nodeBorder};
    filter: none;
  }

  [data-look="neo"].node circle{
    stroke: ${r.useGradient ? "url(" + i + "-gradient)" : r.nodeBorder};
    filter: ${r.dropShadow ? r.dropShadow.replace("url(#drop-shadow)", `url(${i}-drop-shadow)`) : "none"};
  }

  [data-look="neo"].node circle .state-start{
    fill: #000000;
  }

  [data-look="neo"].icon-shape .icon {
    fill: ${r.useGradient ? "url(" + i + "-gradient)" : r.nodeBorder};
    filter: ${r.dropShadow ? r.dropShadow.replace("url(#drop-shadow)", `url(${i}-drop-shadow)`) : "none"};
  }

    [data-look="neo"].icon-shape .icon-neo path {
    stroke: ${r.useGradient ? "url(" + i + "-gradient)" : r.nodeBorder};
    filter: ${r.dropShadow ? r.dropShadow.replace("url(#drop-shadow)", `url(${i}-drop-shadow)`) : "none"};
  }

  ${t}
`;
}, "getStyles"), Fk = /* @__PURE__ */ p((e, t) => {
  t !== void 0 && (Ro[e] = t);
}, "addStylesForDiagram"), Mk = Ek, ap = {};
VC(ap, {
  clear: () => Ok,
  getAccDescription: () => Rk,
  getAccTitle: () => Ik,
  getDiagramTitle: () => Nk,
  setAccDescription: () => Dk,
  setAccTitle: () => $k,
  setDiagramTitle: () => Pk
});
var sh = "", oh = "", ah = "", nh = /* @__PURE__ */ p((e) => Pe(e, jt()), "sanitizeText"), Ok = /* @__PURE__ */ p(() => {
  sh = "", ah = "", oh = "";
}, "clear"), $k = /* @__PURE__ */ p((e) => {
  sh = nh(e).replace(/^\s+/g, "");
}, "setAccTitle"), Ik = /* @__PURE__ */ p(() => sh, "getAccTitle"), Dk = /* @__PURE__ */ p((e) => {
  ah = nh(e).replace(/\n\s+/g, `
`);
}, "setAccDescription"), Rk = /* @__PURE__ */ p(() => ah, "getAccDescription"), Pk = /* @__PURE__ */ p((e) => {
  oh = nh(e);
}, "setDiagramTitle"), Nk = /* @__PURE__ */ p(() => oh, "getDiagramTitle"), hu = $, qk = rh, $t = jt, $M = Vf, IM = es, lh = /* @__PURE__ */ p((e) => Pe(e, $t()), "sanitizeText"), Wk = Ak, zk = /* @__PURE__ */ p(() => ap, "getCommonDb"), Qo = {}, Jo = /* @__PURE__ */ p((e, t, r) => {
  Qo[e] && hu.warn(`Diagram with id ${e} already registered. Overwriting.`), Qo[e] = t, r && tp(e, r), Fk(e, t.styles), t.injectUtils?.(
    hu,
    qk,
    $t,
    lh,
    Wk,
    zk(),
    () => {
    }
  );
}, "registerDiagram"), gl = /* @__PURE__ */ p((e) => {
  if (e in Qo)
    return Qo[e];
  throw new Hk(e);
}, "getDiagram"), Ki, Hk = (Ki = class extends Error {
  constructor(t) {
    super(`Diagram ${t} not found.`);
  }
}, p(Ki, "DiagramNotFoundError"), Ki), Yk = { value: () => {
} };
function np() {
  for (var e = 0, t = arguments.length, r = {}, i; e < t; ++e) {
    if (!(i = arguments[e] + "") || i in r || /[\s.]/.test(i)) throw new Error("illegal type: " + i);
    r[i] = [];
  }
  return new Po(r);
}
function Po(e) {
  this._ = e;
}
function Uk(e, t) {
  return e.trim().split(/^|\s+/).map(function(r) {
    var i = "", s = r.indexOf(".");
    if (s >= 0 && (i = r.slice(s + 1), r = r.slice(0, s)), r && !t.hasOwnProperty(r)) throw new Error("unknown type: " + r);
    return { type: r, name: i };
  });
}
Po.prototype = np.prototype = {
  constructor: Po,
  on: function(e, t) {
    var r = this._, i = Uk(e + "", r), s, o = -1, a = i.length;
    if (arguments.length < 2) {
      for (; ++o < a; ) if ((s = (e = i[o]).type) && (s = Xk(r[s], e.name))) return s;
      return;
    }
    if (t != null && typeof t != "function") throw new Error("invalid callback: " + t);
    for (; ++o < a; )
      if (s = (e = i[o]).type) r[s] = cu(r[s], e.name, t);
      else if (t == null) for (s in r) r[s] = cu(r[s], e.name, null);
    return this;
  },
  copy: function() {
    var e = {}, t = this._;
    for (var r in t) e[r] = t[r].slice();
    return new Po(e);
  },
  call: function(e, t) {
    if ((s = arguments.length - 2) > 0) for (var r = new Array(s), i = 0, s, o; i < s; ++i) r[i] = arguments[i + 2];
    if (!this._.hasOwnProperty(e)) throw new Error("unknown type: " + e);
    for (o = this._[e], i = 0, s = o.length; i < s; ++i) o[i].value.apply(t, r);
  },
  apply: function(e, t, r) {
    if (!this._.hasOwnProperty(e)) throw new Error("unknown type: " + e);
    for (var i = this._[e], s = 0, o = i.length; s < o; ++s) i[s].value.apply(t, r);
  }
};
function Xk(e, t) {
  for (var r = 0, i = e.length, s; r < i; ++r)
    if ((s = e[r]).name === t)
      return s.value;
}
function cu(e, t, r) {
  for (var i = 0, s = e.length; i < s; ++i)
    if (e[i].name === t) {
      e[i] = Yk, e = e.slice(0, i).concat(e.slice(i + 1));
      break;
    }
  return r != null && e.push({ name: t, value: r }), e;
}
var ml = "http://www.w3.org/1999/xhtml";
const uu = {
  svg: "http://www.w3.org/2000/svg",
  xhtml: ml,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};
function Ta(e) {
  var t = e += "", r = t.indexOf(":");
  return r >= 0 && (t = e.slice(0, r)) !== "xmlns" && (e = e.slice(r + 1)), uu.hasOwnProperty(t) ? { space: uu[t], local: e } : e;
}
function jk(e) {
  return function() {
    var t = this.ownerDocument, r = this.namespaceURI;
    return r === ml && t.documentElement.namespaceURI === ml ? t.createElement(e) : t.createElementNS(r, e);
  };
}
function Gk(e) {
  return function() {
    return this.ownerDocument.createElementNS(e.space, e.local);
  };
}
function lp(e) {
  var t = Ta(e);
  return (t.local ? Gk : jk)(t);
}
function Vk() {
}
function hh(e) {
  return e == null ? Vk : function() {
    return this.querySelector(e);
  };
}
function Kk(e) {
  typeof e != "function" && (e = hh(e));
  for (var t = this._groups, r = t.length, i = new Array(r), s = 0; s < r; ++s)
    for (var o = t[s], a = o.length, n = i[s] = new Array(a), l, c, h = 0; h < a; ++h)
      (l = o[h]) && (c = e.call(l, l.__data__, h, o)) && ("__data__" in l && (c.__data__ = l.__data__), n[h] = c);
  return new Me(i, this._parents);
}
function Zk(e) {
  return e == null ? [] : Array.isArray(e) ? e : Array.from(e);
}
function Qk() {
  return [];
}
function hp(e) {
  return e == null ? Qk : function() {
    return this.querySelectorAll(e);
  };
}
function Jk(e) {
  return function() {
    return Zk(e.apply(this, arguments));
  };
}
function t1(e) {
  typeof e == "function" ? e = Jk(e) : e = hp(e);
  for (var t = this._groups, r = t.length, i = [], s = [], o = 0; o < r; ++o)
    for (var a = t[o], n = a.length, l, c = 0; c < n; ++c)
      (l = a[c]) && (i.push(e.call(l, l.__data__, c, a)), s.push(l));
  return new Me(i, s);
}
function cp(e) {
  return function() {
    return this.matches(e);
  };
}
function up(e) {
  return function(t) {
    return t.matches(e);
  };
}
var e1 = Array.prototype.find;
function r1(e) {
  return function() {
    return e1.call(this.children, e);
  };
}
function i1() {
  return this.firstElementChild;
}
function s1(e) {
  return this.select(e == null ? i1 : r1(typeof e == "function" ? e : up(e)));
}
var o1 = Array.prototype.filter;
function a1() {
  return Array.from(this.children);
}
function n1(e) {
  return function() {
    return o1.call(this.children, e);
  };
}
function l1(e) {
  return this.selectAll(e == null ? a1 : n1(typeof e == "function" ? e : up(e)));
}
function h1(e) {
  typeof e != "function" && (e = cp(e));
  for (var t = this._groups, r = t.length, i = new Array(r), s = 0; s < r; ++s)
    for (var o = t[s], a = o.length, n = i[s] = [], l, c = 0; c < a; ++c)
      (l = o[c]) && e.call(l, l.__data__, c, o) && n.push(l);
  return new Me(i, this._parents);
}
function dp(e) {
  return new Array(e.length);
}
function c1() {
  return new Me(this._enter || this._groups.map(dp), this._parents);
}
function ta(e, t) {
  this.ownerDocument = e.ownerDocument, this.namespaceURI = e.namespaceURI, this._next = null, this._parent = e, this.__data__ = t;
}
ta.prototype = {
  constructor: ta,
  appendChild: function(e) {
    return this._parent.insertBefore(e, this._next);
  },
  insertBefore: function(e, t) {
    return this._parent.insertBefore(e, t);
  },
  querySelector: function(e) {
    return this._parent.querySelector(e);
  },
  querySelectorAll: function(e) {
    return this._parent.querySelectorAll(e);
  }
};
function u1(e) {
  return function() {
    return e;
  };
}
function d1(e, t, r, i, s, o) {
  for (var a = 0, n, l = t.length, c = o.length; a < c; ++a)
    (n = t[a]) ? (n.__data__ = o[a], i[a] = n) : r[a] = new ta(e, o[a]);
  for (; a < l; ++a)
    (n = t[a]) && (s[a] = n);
}
function f1(e, t, r, i, s, o, a) {
  var n, l, c = /* @__PURE__ */ new Map(), h = t.length, u = o.length, d = new Array(h), f;
  for (n = 0; n < h; ++n)
    (l = t[n]) && (d[n] = f = a.call(l, l.__data__, n, t) + "", c.has(f) ? s[n] = l : c.set(f, l));
  for (n = 0; n < u; ++n)
    f = a.call(e, o[n], n, o) + "", (l = c.get(f)) ? (i[n] = l, l.__data__ = o[n], c.delete(f)) : r[n] = new ta(e, o[n]);
  for (n = 0; n < h; ++n)
    (l = t[n]) && c.get(d[n]) === l && (s[n] = l);
}
function p1(e) {
  return e.__data__;
}
function g1(e, t) {
  if (!arguments.length) return Array.from(this, p1);
  var r = t ? f1 : d1, i = this._parents, s = this._groups;
  typeof e != "function" && (e = u1(e));
  for (var o = s.length, a = new Array(o), n = new Array(o), l = new Array(o), c = 0; c < o; ++c) {
    var h = i[c], u = s[c], d = u.length, f = m1(e.call(h, h && h.__data__, c, i)), m = f.length, y = n[c] = new Array(m), x = a[c] = new Array(m), C = l[c] = new Array(d);
    r(h, u, y, x, C, f, t);
    for (var b = 0, w = 0, _, B; b < m; ++b)
      if (_ = y[b]) {
        for (b >= w && (w = b + 1); !(B = x[w]) && ++w < m; ) ;
        _._next = B || null;
      }
  }
  return a = new Me(a, i), a._enter = n, a._exit = l, a;
}
function m1(e) {
  return typeof e == "object" && "length" in e ? e : Array.from(e);
}
function y1() {
  return new Me(this._exit || this._groups.map(dp), this._parents);
}
function x1(e, t, r) {
  var i = this.enter(), s = this, o = this.exit();
  return typeof e == "function" ? (i = e(i), i && (i = i.selection())) : i = i.append(e + ""), t != null && (s = t(s), s && (s = s.selection())), r == null ? o.remove() : r(o), i && s ? i.merge(s).order() : s;
}
function C1(e) {
  for (var t = e.selection ? e.selection() : e, r = this._groups, i = t._groups, s = r.length, o = i.length, a = Math.min(s, o), n = new Array(s), l = 0; l < a; ++l)
    for (var c = r[l], h = i[l], u = c.length, d = n[l] = new Array(u), f, m = 0; m < u; ++m)
      (f = c[m] || h[m]) && (d[m] = f);
  for (; l < s; ++l)
    n[l] = r[l];
  return new Me(n, this._parents);
}
function b1() {
  for (var e = this._groups, t = -1, r = e.length; ++t < r; )
    for (var i = e[t], s = i.length - 1, o = i[s], a; --s >= 0; )
      (a = i[s]) && (o && a.compareDocumentPosition(o) ^ 4 && o.parentNode.insertBefore(a, o), o = a);
  return this;
}
function k1(e) {
  e || (e = w1);
  function t(u, d) {
    return u && d ? e(u.__data__, d.__data__) : !u - !d;
  }
  for (var r = this._groups, i = r.length, s = new Array(i), o = 0; o < i; ++o) {
    for (var a = r[o], n = a.length, l = s[o] = new Array(n), c, h = 0; h < n; ++h)
      (c = a[h]) && (l[h] = c);
    l.sort(t);
  }
  return new Me(s, this._parents).order();
}
function w1(e, t) {
  return e < t ? -1 : e > t ? 1 : e >= t ? 0 : NaN;
}
function S1() {
  var e = arguments[0];
  return arguments[0] = this, e.apply(null, arguments), this;
}
function T1() {
  return Array.from(this);
}
function _1() {
  for (var e = this._groups, t = 0, r = e.length; t < r; ++t)
    for (var i = e[t], s = 0, o = i.length; s < o; ++s) {
      var a = i[s];
      if (a) return a;
    }
  return null;
}
function B1() {
  let e = 0;
  for (const t of this) ++e;
  return e;
}
function v1() {
  return !this.node();
}
function L1(e) {
  for (var t = this._groups, r = 0, i = t.length; r < i; ++r)
    for (var s = t[r], o = 0, a = s.length, n; o < a; ++o)
      (n = s[o]) && e.call(n, n.__data__, o, s);
  return this;
}
function A1(e) {
  return function() {
    this.removeAttribute(e);
  };
}
function E1(e) {
  return function() {
    this.removeAttributeNS(e.space, e.local);
  };
}
function F1(e, t) {
  return function() {
    this.setAttribute(e, t);
  };
}
function M1(e, t) {
  return function() {
    this.setAttributeNS(e.space, e.local, t);
  };
}
function O1(e, t) {
  return function() {
    var r = t.apply(this, arguments);
    r == null ? this.removeAttribute(e) : this.setAttribute(e, r);
  };
}
function $1(e, t) {
  return function() {
    var r = t.apply(this, arguments);
    r == null ? this.removeAttributeNS(e.space, e.local) : this.setAttributeNS(e.space, e.local, r);
  };
}
function I1(e, t) {
  var r = Ta(e);
  if (arguments.length < 2) {
    var i = this.node();
    return r.local ? i.getAttributeNS(r.space, r.local) : i.getAttribute(r);
  }
  return this.each((t == null ? r.local ? E1 : A1 : typeof t == "function" ? r.local ? $1 : O1 : r.local ? M1 : F1)(r, t));
}
function fp(e) {
  return e.ownerDocument && e.ownerDocument.defaultView || e.document && e || e.defaultView;
}
function D1(e) {
  return function() {
    this.style.removeProperty(e);
  };
}
function R1(e, t, r) {
  return function() {
    this.style.setProperty(e, t, r);
  };
}
function P1(e, t, r) {
  return function() {
    var i = t.apply(this, arguments);
    i == null ? this.style.removeProperty(e) : this.style.setProperty(e, i, r);
  };
}
function N1(e, t, r) {
  return arguments.length > 1 ? this.each((t == null ? D1 : typeof t == "function" ? P1 : R1)(e, t, r ?? "")) : rs(this.node(), e);
}
function rs(e, t) {
  return e.style.getPropertyValue(t) || fp(e).getComputedStyle(e, null).getPropertyValue(t);
}
function q1(e) {
  return function() {
    delete this[e];
  };
}
function W1(e, t) {
  return function() {
    this[e] = t;
  };
}
function z1(e, t) {
  return function() {
    var r = t.apply(this, arguments);
    r == null ? delete this[e] : this[e] = r;
  };
}
function H1(e, t) {
  return arguments.length > 1 ? this.each((t == null ? q1 : typeof t == "function" ? z1 : W1)(e, t)) : this.node()[e];
}
function pp(e) {
  return e.trim().split(/^|\s+/);
}
function ch(e) {
  return e.classList || new gp(e);
}
function gp(e) {
  this._node = e, this._names = pp(e.getAttribute("class") || "");
}
gp.prototype = {
  add: function(e) {
    var t = this._names.indexOf(e);
    t < 0 && (this._names.push(e), this._node.setAttribute("class", this._names.join(" ")));
  },
  remove: function(e) {
    var t = this._names.indexOf(e);
    t >= 0 && (this._names.splice(t, 1), this._node.setAttribute("class", this._names.join(" ")));
  },
  contains: function(e) {
    return this._names.indexOf(e) >= 0;
  }
};
function mp(e, t) {
  for (var r = ch(e), i = -1, s = t.length; ++i < s; ) r.add(t[i]);
}
function yp(e, t) {
  for (var r = ch(e), i = -1, s = t.length; ++i < s; ) r.remove(t[i]);
}
function Y1(e) {
  return function() {
    mp(this, e);
  };
}
function U1(e) {
  return function() {
    yp(this, e);
  };
}
function X1(e, t) {
  return function() {
    (t.apply(this, arguments) ? mp : yp)(this, e);
  };
}
function j1(e, t) {
  var r = pp(e + "");
  if (arguments.length < 2) {
    for (var i = ch(this.node()), s = -1, o = r.length; ++s < o; ) if (!i.contains(r[s])) return !1;
    return !0;
  }
  return this.each((typeof t == "function" ? X1 : t ? Y1 : U1)(r, t));
}
function G1() {
  this.textContent = "";
}
function V1(e) {
  return function() {
    this.textContent = e;
  };
}
function K1(e) {
  return function() {
    var t = e.apply(this, arguments);
    this.textContent = t ?? "";
  };
}
function Z1(e) {
  return arguments.length ? this.each(e == null ? G1 : (typeof e == "function" ? K1 : V1)(e)) : this.node().textContent;
}
function Q1() {
  this.innerHTML = "";
}
function J1(e) {
  return function() {
    this.innerHTML = e;
  };
}
function t2(e) {
  return function() {
    var t = e.apply(this, arguments);
    this.innerHTML = t ?? "";
  };
}
function e2(e) {
  return arguments.length ? this.each(e == null ? Q1 : (typeof e == "function" ? t2 : J1)(e)) : this.node().innerHTML;
}
function r2() {
  this.nextSibling && this.parentNode.appendChild(this);
}
function i2() {
  return this.each(r2);
}
function s2() {
  this.previousSibling && this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function o2() {
  return this.each(s2);
}
function a2(e) {
  var t = typeof e == "function" ? e : lp(e);
  return this.select(function() {
    return this.appendChild(t.apply(this, arguments));
  });
}
function n2() {
  return null;
}
function l2(e, t) {
  var r = typeof e == "function" ? e : lp(e), i = t == null ? n2 : typeof t == "function" ? t : hh(t);
  return this.select(function() {
    return this.insertBefore(r.apply(this, arguments), i.apply(this, arguments) || null);
  });
}
function h2() {
  var e = this.parentNode;
  e && e.removeChild(this);
}
function c2() {
  return this.each(h2);
}
function u2() {
  var e = this.cloneNode(!1), t = this.parentNode;
  return t ? t.insertBefore(e, this.nextSibling) : e;
}
function d2() {
  var e = this.cloneNode(!0), t = this.parentNode;
  return t ? t.insertBefore(e, this.nextSibling) : e;
}
function f2(e) {
  return this.select(e ? d2 : u2);
}
function p2(e) {
  return arguments.length ? this.property("__data__", e) : this.node().__data__;
}
function g2(e) {
  return function(t) {
    e.call(this, t, this.__data__);
  };
}
function m2(e) {
  return e.trim().split(/^|\s+/).map(function(t) {
    var r = "", i = t.indexOf(".");
    return i >= 0 && (r = t.slice(i + 1), t = t.slice(0, i)), { type: t, name: r };
  });
}
function y2(e) {
  return function() {
    var t = this.__on;
    if (t) {
      for (var r = 0, i = -1, s = t.length, o; r < s; ++r)
        o = t[r], (!e.type || o.type === e.type) && o.name === e.name ? this.removeEventListener(o.type, o.listener, o.options) : t[++i] = o;
      ++i ? t.length = i : delete this.__on;
    }
  };
}
function x2(e, t, r) {
  return function() {
    var i = this.__on, s, o = g2(t);
    if (i) {
      for (var a = 0, n = i.length; a < n; ++a)
        if ((s = i[a]).type === e.type && s.name === e.name) {
          this.removeEventListener(s.type, s.listener, s.options), this.addEventListener(s.type, s.listener = o, s.options = r), s.value = t;
          return;
        }
    }
    this.addEventListener(e.type, o, r), s = { type: e.type, name: e.name, value: t, listener: o, options: r }, i ? i.push(s) : this.__on = [s];
  };
}
function C2(e, t, r) {
  var i = m2(e + ""), s, o = i.length, a;
  if (arguments.length < 2) {
    var n = this.node().__on;
    if (n) {
      for (var l = 0, c = n.length, h; l < c; ++l)
        for (s = 0, h = n[l]; s < o; ++s)
          if ((a = i[s]).type === h.type && a.name === h.name)
            return h.value;
    }
    return;
  }
  for (n = t ? x2 : y2, s = 0; s < o; ++s) this.each(n(i[s], t, r));
  return this;
}
function xp(e, t, r) {
  var i = fp(e), s = i.CustomEvent;
  typeof s == "function" ? s = new s(t, r) : (s = i.document.createEvent("Event"), r ? (s.initEvent(t, r.bubbles, r.cancelable), s.detail = r.detail) : s.initEvent(t, !1, !1)), e.dispatchEvent(s);
}
function b2(e, t) {
  return function() {
    return xp(this, e, t);
  };
}
function k2(e, t) {
  return function() {
    return xp(this, e, t.apply(this, arguments));
  };
}
function w2(e, t) {
  return this.each((typeof t == "function" ? k2 : b2)(e, t));
}
function* S2() {
  for (var e = this._groups, t = 0, r = e.length; t < r; ++t)
    for (var i = e[t], s = 0, o = i.length, a; s < o; ++s)
      (a = i[s]) && (yield a);
}
var Cp = [null];
function Me(e, t) {
  this._groups = e, this._parents = t;
}
function ao() {
  return new Me([[document.documentElement]], Cp);
}
function T2() {
  return this;
}
Me.prototype = ao.prototype = {
  constructor: Me,
  select: Kk,
  selectAll: t1,
  selectChild: s1,
  selectChildren: l1,
  filter: h1,
  data: g1,
  enter: c1,
  exit: y1,
  join: x1,
  merge: C1,
  selection: T2,
  order: b1,
  sort: k1,
  call: S1,
  nodes: T1,
  node: _1,
  size: B1,
  empty: v1,
  each: L1,
  attr: I1,
  style: N1,
  property: H1,
  classed: j1,
  text: Z1,
  html: e2,
  raise: i2,
  lower: o2,
  append: a2,
  insert: l2,
  remove: c2,
  clone: f2,
  datum: p2,
  on: C2,
  dispatch: w2,
  [Symbol.iterator]: S2
};
function vt(e) {
  return typeof e == "string" ? new Me([[document.querySelector(e)]], [document.documentElement]) : new Me([[e]], Cp);
}
function uh(e, t, r) {
  e.prototype = t.prototype = r, r.constructor = e;
}
function bp(e, t) {
  var r = Object.create(e.prototype);
  for (var i in t) r[i] = t[i];
  return r;
}
function no() {
}
var Gs = 0.7, ea = 1 / Gs, Di = "\\s*([+-]?\\d+)\\s*", Vs = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*", nr = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*", _2 = /^#([0-9a-f]{3,8})$/, B2 = new RegExp(`^rgb\\(${Di},${Di},${Di}\\)$`), v2 = new RegExp(`^rgb\\(${nr},${nr},${nr}\\)$`), L2 = new RegExp(`^rgba\\(${Di},${Di},${Di},${Vs}\\)$`), A2 = new RegExp(`^rgba\\(${nr},${nr},${nr},${Vs}\\)$`), E2 = new RegExp(`^hsl\\(${Vs},${nr},${nr}\\)$`), F2 = new RegExp(`^hsla\\(${Vs},${nr},${nr},${Vs}\\)$`), du = {
  aliceblue: 15792383,
  antiquewhite: 16444375,
  aqua: 65535,
  aquamarine: 8388564,
  azure: 15794175,
  beige: 16119260,
  bisque: 16770244,
  black: 0,
  blanchedalmond: 16772045,
  blue: 255,
  blueviolet: 9055202,
  brown: 10824234,
  burlywood: 14596231,
  cadetblue: 6266528,
  chartreuse: 8388352,
  chocolate: 13789470,
  coral: 16744272,
  cornflowerblue: 6591981,
  cornsilk: 16775388,
  crimson: 14423100,
  cyan: 65535,
  darkblue: 139,
  darkcyan: 35723,
  darkgoldenrod: 12092939,
  darkgray: 11119017,
  darkgreen: 25600,
  darkgrey: 11119017,
  darkkhaki: 12433259,
  darkmagenta: 9109643,
  darkolivegreen: 5597999,
  darkorange: 16747520,
  darkorchid: 10040012,
  darkred: 9109504,
  darksalmon: 15308410,
  darkseagreen: 9419919,
  darkslateblue: 4734347,
  darkslategray: 3100495,
  darkslategrey: 3100495,
  darkturquoise: 52945,
  darkviolet: 9699539,
  deeppink: 16716947,
  deepskyblue: 49151,
  dimgray: 6908265,
  dimgrey: 6908265,
  dodgerblue: 2003199,
  firebrick: 11674146,
  floralwhite: 16775920,
  forestgreen: 2263842,
  fuchsia: 16711935,
  gainsboro: 14474460,
  ghostwhite: 16316671,
  gold: 16766720,
  goldenrod: 14329120,
  gray: 8421504,
  green: 32768,
  greenyellow: 11403055,
  grey: 8421504,
  honeydew: 15794160,
  hotpink: 16738740,
  indianred: 13458524,
  indigo: 4915330,
  ivory: 16777200,
  khaki: 15787660,
  lavender: 15132410,
  lavenderblush: 16773365,
  lawngreen: 8190976,
  lemonchiffon: 16775885,
  lightblue: 11393254,
  lightcoral: 15761536,
  lightcyan: 14745599,
  lightgoldenrodyellow: 16448210,
  lightgray: 13882323,
  lightgreen: 9498256,
  lightgrey: 13882323,
  lightpink: 16758465,
  lightsalmon: 16752762,
  lightseagreen: 2142890,
  lightskyblue: 8900346,
  lightslategray: 7833753,
  lightslategrey: 7833753,
  lightsteelblue: 11584734,
  lightyellow: 16777184,
  lime: 65280,
  limegreen: 3329330,
  linen: 16445670,
  magenta: 16711935,
  maroon: 8388608,
  mediumaquamarine: 6737322,
  mediumblue: 205,
  mediumorchid: 12211667,
  mediumpurple: 9662683,
  mediumseagreen: 3978097,
  mediumslateblue: 8087790,
  mediumspringgreen: 64154,
  mediumturquoise: 4772300,
  mediumvioletred: 13047173,
  midnightblue: 1644912,
  mintcream: 16121850,
  mistyrose: 16770273,
  moccasin: 16770229,
  navajowhite: 16768685,
  navy: 128,
  oldlace: 16643558,
  olive: 8421376,
  olivedrab: 7048739,
  orange: 16753920,
  orangered: 16729344,
  orchid: 14315734,
  palegoldenrod: 15657130,
  palegreen: 10025880,
  paleturquoise: 11529966,
  palevioletred: 14381203,
  papayawhip: 16773077,
  peachpuff: 16767673,
  peru: 13468991,
  pink: 16761035,
  plum: 14524637,
  powderblue: 11591910,
  purple: 8388736,
  rebeccapurple: 6697881,
  red: 16711680,
  rosybrown: 12357519,
  royalblue: 4286945,
  saddlebrown: 9127187,
  salmon: 16416882,
  sandybrown: 16032864,
  seagreen: 3050327,
  seashell: 16774638,
  sienna: 10506797,
  silver: 12632256,
  skyblue: 8900331,
  slateblue: 6970061,
  slategray: 7372944,
  slategrey: 7372944,
  snow: 16775930,
  springgreen: 65407,
  steelblue: 4620980,
  tan: 13808780,
  teal: 32896,
  thistle: 14204888,
  tomato: 16737095,
  turquoise: 4251856,
  violet: 15631086,
  wheat: 16113331,
  white: 16777215,
  whitesmoke: 16119285,
  yellow: 16776960,
  yellowgreen: 10145074
};
uh(no, Ks, {
  copy(e) {
    return Object.assign(new this.constructor(), this, e);
  },
  displayable() {
    return this.rgb().displayable();
  },
  hex: fu,
  // Deprecated! Use color.formatHex.
  formatHex: fu,
  formatHex8: M2,
  formatHsl: O2,
  formatRgb: pu,
  toString: pu
});
function fu() {
  return this.rgb().formatHex();
}
function M2() {
  return this.rgb().formatHex8();
}
function O2() {
  return kp(this).formatHsl();
}
function pu() {
  return this.rgb().formatRgb();
}
function Ks(e) {
  var t, r;
  return e = (e + "").trim().toLowerCase(), (t = _2.exec(e)) ? (r = t[1].length, t = parseInt(t[1], 16), r === 6 ? gu(t) : r === 3 ? new Le(t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, (t & 15) << 4 | t & 15, 1) : r === 8 ? So(t >> 24 & 255, t >> 16 & 255, t >> 8 & 255, (t & 255) / 255) : r === 4 ? So(t >> 12 & 15 | t >> 8 & 240, t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, ((t & 15) << 4 | t & 15) / 255) : null) : (t = B2.exec(e)) ? new Le(t[1], t[2], t[3], 1) : (t = v2.exec(e)) ? new Le(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, 1) : (t = L2.exec(e)) ? So(t[1], t[2], t[3], t[4]) : (t = A2.exec(e)) ? So(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, t[4]) : (t = E2.exec(e)) ? xu(t[1], t[2] / 100, t[3] / 100, 1) : (t = F2.exec(e)) ? xu(t[1], t[2] / 100, t[3] / 100, t[4]) : du.hasOwnProperty(e) ? gu(du[e]) : e === "transparent" ? new Le(NaN, NaN, NaN, 0) : null;
}
function gu(e) {
  return new Le(e >> 16 & 255, e >> 8 & 255, e & 255, 1);
}
function So(e, t, r, i) {
  return i <= 0 && (e = t = r = NaN), new Le(e, t, r, i);
}
function $2(e) {
  return e instanceof no || (e = Ks(e)), e ? (e = e.rgb(), new Le(e.r, e.g, e.b, e.opacity)) : new Le();
}
function yl(e, t, r, i) {
  return arguments.length === 1 ? $2(e) : new Le(e, t, r, i ?? 1);
}
function Le(e, t, r, i) {
  this.r = +e, this.g = +t, this.b = +r, this.opacity = +i;
}
uh(Le, yl, bp(no, {
  brighter(e) {
    return e = e == null ? ea : Math.pow(ea, e), new Le(this.r * e, this.g * e, this.b * e, this.opacity);
  },
  darker(e) {
    return e = e == null ? Gs : Math.pow(Gs, e), new Le(this.r * e, this.g * e, this.b * e, this.opacity);
  },
  rgb() {
    return this;
  },
  clamp() {
    return new Le(li(this.r), li(this.g), li(this.b), ra(this.opacity));
  },
  displayable() {
    return -0.5 <= this.r && this.r < 255.5 && -0.5 <= this.g && this.g < 255.5 && -0.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
  },
  hex: mu,
  // Deprecated! Use color.formatHex.
  formatHex: mu,
  formatHex8: I2,
  formatRgb: yu,
  toString: yu
}));
function mu() {
  return `#${ii(this.r)}${ii(this.g)}${ii(this.b)}`;
}
function I2() {
  return `#${ii(this.r)}${ii(this.g)}${ii(this.b)}${ii((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function yu() {
  const e = ra(this.opacity);
  return `${e === 1 ? "rgb(" : "rgba("}${li(this.r)}, ${li(this.g)}, ${li(this.b)}${e === 1 ? ")" : `, ${e})`}`;
}
function ra(e) {
  return isNaN(e) ? 1 : Math.max(0, Math.min(1, e));
}
function li(e) {
  return Math.max(0, Math.min(255, Math.round(e) || 0));
}
function ii(e) {
  return e = li(e), (e < 16 ? "0" : "") + e.toString(16);
}
function xu(e, t, r, i) {
  return i <= 0 ? e = t = r = NaN : r <= 0 || r >= 1 ? e = t = NaN : t <= 0 && (e = NaN), new Ge(e, t, r, i);
}
function kp(e) {
  if (e instanceof Ge) return new Ge(e.h, e.s, e.l, e.opacity);
  if (e instanceof no || (e = Ks(e)), !e) return new Ge();
  if (e instanceof Ge) return e;
  e = e.rgb();
  var t = e.r / 255, r = e.g / 255, i = e.b / 255, s = Math.min(t, r, i), o = Math.max(t, r, i), a = NaN, n = o - s, l = (o + s) / 2;
  return n ? (t === o ? a = (r - i) / n + (r < i) * 6 : r === o ? a = (i - t) / n + 2 : a = (t - r) / n + 4, n /= l < 0.5 ? o + s : 2 - o - s, a *= 60) : n = l > 0 && l < 1 ? 0 : a, new Ge(a, n, l, e.opacity);
}
function D2(e, t, r, i) {
  return arguments.length === 1 ? kp(e) : new Ge(e, t, r, i ?? 1);
}
function Ge(e, t, r, i) {
  this.h = +e, this.s = +t, this.l = +r, this.opacity = +i;
}
uh(Ge, D2, bp(no, {
  brighter(e) {
    return e = e == null ? ea : Math.pow(ea, e), new Ge(this.h, this.s, this.l * e, this.opacity);
  },
  darker(e) {
    return e = e == null ? Gs : Math.pow(Gs, e), new Ge(this.h, this.s, this.l * e, this.opacity);
  },
  rgb() {
    var e = this.h % 360 + (this.h < 0) * 360, t = isNaN(e) || isNaN(this.s) ? 0 : this.s, r = this.l, i = r + (r < 0.5 ? r : 1 - r) * t, s = 2 * r - i;
    return new Le(
      mn(e >= 240 ? e - 240 : e + 120, s, i),
      mn(e, s, i),
      mn(e < 120 ? e + 240 : e - 120, s, i),
      this.opacity
    );
  },
  clamp() {
    return new Ge(Cu(this.h), To(this.s), To(this.l), ra(this.opacity));
  },
  displayable() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
  },
  formatHsl() {
    const e = ra(this.opacity);
    return `${e === 1 ? "hsl(" : "hsla("}${Cu(this.h)}, ${To(this.s) * 100}%, ${To(this.l) * 100}%${e === 1 ? ")" : `, ${e})`}`;
  }
}));
function Cu(e) {
  return e = (e || 0) % 360, e < 0 ? e + 360 : e;
}
function To(e) {
  return Math.max(0, Math.min(1, e || 0));
}
function mn(e, t, r) {
  return (e < 60 ? t + (r - t) * e / 60 : e < 180 ? r : e < 240 ? t + (r - t) * (240 - e) / 60 : t) * 255;
}
const dh = (e) => () => e;
function wp(e, t) {
  return function(r) {
    return e + r * t;
  };
}
function R2(e, t, r) {
  return e = Math.pow(e, r), t = Math.pow(t, r) - e, r = 1 / r, function(i) {
    return Math.pow(e + i * t, r);
  };
}
function DM(e, t) {
  var r = t - e;
  return r ? wp(e, r > 180 || r < -180 ? r - 360 * Math.round(r / 360) : r) : dh(isNaN(e) ? t : e);
}
function P2(e) {
  return (e = +e) == 1 ? Sp : function(t, r) {
    return r - t ? R2(t, r, e) : dh(isNaN(t) ? r : t);
  };
}
function Sp(e, t) {
  var r = t - e;
  return r ? wp(e, r) : dh(isNaN(e) ? t : e);
}
const bu = (function e(t) {
  var r = P2(t);
  function i(s, o) {
    var a = r((s = yl(s)).r, (o = yl(o)).r), n = r(s.g, o.g), l = r(s.b, o.b), c = Sp(s.opacity, o.opacity);
    return function(h) {
      return s.r = a(h), s.g = n(h), s.b = l(h), s.opacity = c(h), s + "";
    };
  }
  return i.gamma = e, i;
})(1);
function Nr(e, t) {
  return e = +e, t = +t, function(r) {
    return e * (1 - r) + t * r;
  };
}
var xl = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, yn = new RegExp(xl.source, "g");
function N2(e) {
  return function() {
    return e;
  };
}
function q2(e) {
  return function(t) {
    return e(t) + "";
  };
}
function W2(e, t) {
  var r = xl.lastIndex = yn.lastIndex = 0, i, s, o, a = -1, n = [], l = [];
  for (e = e + "", t = t + ""; (i = xl.exec(e)) && (s = yn.exec(t)); )
    (o = s.index) > r && (o = t.slice(r, o), n[a] ? n[a] += o : n[++a] = o), (i = i[0]) === (s = s[0]) ? n[a] ? n[a] += s : n[++a] = s : (n[++a] = null, l.push({ i: a, x: Nr(i, s) })), r = yn.lastIndex;
  return r < t.length && (o = t.slice(r), n[a] ? n[a] += o : n[++a] = o), n.length < 2 ? l[0] ? q2(l[0].x) : N2(t) : (t = l.length, function(c) {
    for (var h = 0, u; h < t; ++h) n[(u = l[h]).i] = u.x(c);
    return n.join("");
  });
}
var ku = 180 / Math.PI, Cl = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  skewX: 0,
  scaleX: 1,
  scaleY: 1
};
function Tp(e, t, r, i, s, o) {
  var a, n, l;
  return (a = Math.sqrt(e * e + t * t)) && (e /= a, t /= a), (l = e * r + t * i) && (r -= e * l, i -= t * l), (n = Math.sqrt(r * r + i * i)) && (r /= n, i /= n, l /= n), e * i < t * r && (e = -e, t = -t, l = -l, a = -a), {
    translateX: s,
    translateY: o,
    rotate: Math.atan2(t, e) * ku,
    skewX: Math.atan(l) * ku,
    scaleX: a,
    scaleY: n
  };
}
var _o;
function z2(e) {
  const t = new (typeof DOMMatrix == "function" ? DOMMatrix : WebKitCSSMatrix)(e + "");
  return t.isIdentity ? Cl : Tp(t.a, t.b, t.c, t.d, t.e, t.f);
}
function H2(e) {
  return e == null || (_o || (_o = document.createElementNS("http://www.w3.org/2000/svg", "g")), _o.setAttribute("transform", e), !(e = _o.transform.baseVal.consolidate())) ? Cl : (e = e.matrix, Tp(e.a, e.b, e.c, e.d, e.e, e.f));
}
function _p(e, t, r, i) {
  function s(c) {
    return c.length ? c.pop() + " " : "";
  }
  function o(c, h, u, d, f, m) {
    if (c !== u || h !== d) {
      var y = f.push("translate(", null, t, null, r);
      m.push({ i: y - 4, x: Nr(c, u) }, { i: y - 2, x: Nr(h, d) });
    } else (u || d) && f.push("translate(" + u + t + d + r);
  }
  function a(c, h, u, d) {
    c !== h ? (c - h > 180 ? h += 360 : h - c > 180 && (c += 360), d.push({ i: u.push(s(u) + "rotate(", null, i) - 2, x: Nr(c, h) })) : h && u.push(s(u) + "rotate(" + h + i);
  }
  function n(c, h, u, d) {
    c !== h ? d.push({ i: u.push(s(u) + "skewX(", null, i) - 2, x: Nr(c, h) }) : h && u.push(s(u) + "skewX(" + h + i);
  }
  function l(c, h, u, d, f, m) {
    if (c !== u || h !== d) {
      var y = f.push(s(f) + "scale(", null, ",", null, ")");
      m.push({ i: y - 4, x: Nr(c, u) }, { i: y - 2, x: Nr(h, d) });
    } else (u !== 1 || d !== 1) && f.push(s(f) + "scale(" + u + "," + d + ")");
  }
  return function(c, h) {
    var u = [], d = [];
    return c = e(c), h = e(h), o(c.translateX, c.translateY, h.translateX, h.translateY, u, d), a(c.rotate, h.rotate, u, d), n(c.skewX, h.skewX, u, d), l(c.scaleX, c.scaleY, h.scaleX, h.scaleY, u, d), c = h = null, function(f) {
      for (var m = -1, y = d.length, x; ++m < y; ) u[(x = d[m]).i] = x.x(f);
      return u.join("");
    };
  };
}
var Y2 = _p(z2, "px, ", "px)", "deg)"), U2 = _p(H2, ", ", ")", ")"), is = 0, Fs = 0, ws = 0, Bp = 1e3, ia, Ms, sa = 0, di = 0, _a = 0, Zs = typeof performance == "object" && performance.now ? performance : Date, vp = typeof window == "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(e) {
  setTimeout(e, 17);
};
function fh() {
  return di || (vp(X2), di = Zs.now() + _a);
}
function X2() {
  di = 0;
}
function oa() {
  this._call = this._time = this._next = null;
}
oa.prototype = Lp.prototype = {
  constructor: oa,
  restart: function(e, t, r) {
    if (typeof e != "function") throw new TypeError("callback is not a function");
    r = (r == null ? fh() : +r) + (t == null ? 0 : +t), !this._next && Ms !== this && (Ms ? Ms._next = this : ia = this, Ms = this), this._call = e, this._time = r, bl();
  },
  stop: function() {
    this._call && (this._call = null, this._time = 1 / 0, bl());
  }
};
function Lp(e, t, r) {
  var i = new oa();
  return i.restart(e, t, r), i;
}
function j2() {
  fh(), ++is;
  for (var e = ia, t; e; )
    (t = di - e._time) >= 0 && e._call.call(void 0, t), e = e._next;
  --is;
}
function wu() {
  di = (sa = Zs.now()) + _a, is = Fs = 0;
  try {
    j2();
  } finally {
    is = 0, V2(), di = 0;
  }
}
function G2() {
  var e = Zs.now(), t = e - sa;
  t > Bp && (_a -= t, sa = e);
}
function V2() {
  for (var e, t = ia, r, i = 1 / 0; t; )
    t._call ? (i > t._time && (i = t._time), e = t, t = t._next) : (r = t._next, t._next = null, t = e ? e._next = r : ia = r);
  Ms = e, bl(i);
}
function bl(e) {
  if (!is) {
    Fs && (Fs = clearTimeout(Fs));
    var t = e - di;
    t > 24 ? (e < 1 / 0 && (Fs = setTimeout(wu, e - Zs.now() - _a)), ws && (ws = clearInterval(ws))) : (ws || (sa = Zs.now(), ws = setInterval(G2, Bp)), is = 1, vp(wu));
  }
}
function Su(e, t, r) {
  var i = new oa();
  return t = t == null ? 0 : +t, i.restart((s) => {
    i.stop(), e(s + t);
  }, t, r), i;
}
var K2 = np("start", "end", "cancel", "interrupt"), Z2 = [], Ap = 0, Tu = 1, kl = 2, No = 3, _u = 4, wl = 5, qo = 6;
function Ba(e, t, r, i, s, o) {
  var a = e.__transition;
  if (!a) e.__transition = {};
  else if (r in a) return;
  Q2(e, r, {
    name: t,
    index: i,
    // For context during callback.
    group: s,
    // For context during callback.
    on: K2,
    tween: Z2,
    time: o.time,
    delay: o.delay,
    duration: o.duration,
    ease: o.ease,
    timer: null,
    state: Ap
  });
}
function ph(e, t) {
  var r = Ze(e, t);
  if (r.state > Ap) throw new Error("too late; already scheduled");
  return r;
}
function dr(e, t) {
  var r = Ze(e, t);
  if (r.state > No) throw new Error("too late; already running");
  return r;
}
function Ze(e, t) {
  var r = e.__transition;
  if (!r || !(r = r[t])) throw new Error("transition not found");
  return r;
}
function Q2(e, t, r) {
  var i = e.__transition, s;
  i[t] = r, r.timer = Lp(o, 0, r.time);
  function o(c) {
    r.state = Tu, r.timer.restart(a, r.delay, r.time), r.delay <= c && a(c - r.delay);
  }
  function a(c) {
    var h, u, d, f;
    if (r.state !== Tu) return l();
    for (h in i)
      if (f = i[h], f.name === r.name) {
        if (f.state === No) return Su(a);
        f.state === _u ? (f.state = qo, f.timer.stop(), f.on.call("interrupt", e, e.__data__, f.index, f.group), delete i[h]) : +h < t && (f.state = qo, f.timer.stop(), f.on.call("cancel", e, e.__data__, f.index, f.group), delete i[h]);
      }
    if (Su(function() {
      r.state === No && (r.state = _u, r.timer.restart(n, r.delay, r.time), n(c));
    }), r.state = kl, r.on.call("start", e, e.__data__, r.index, r.group), r.state === kl) {
      for (r.state = No, s = new Array(d = r.tween.length), h = 0, u = -1; h < d; ++h)
        (f = r.tween[h].value.call(e, e.__data__, r.index, r.group)) && (s[++u] = f);
      s.length = u + 1;
    }
  }
  function n(c) {
    for (var h = c < r.duration ? r.ease.call(null, c / r.duration) : (r.timer.restart(l), r.state = wl, 1), u = -1, d = s.length; ++u < d; )
      s[u].call(e, h);
    r.state === wl && (r.on.call("end", e, e.__data__, r.index, r.group), l());
  }
  function l() {
    r.state = qo, r.timer.stop(), delete i[t];
    for (var c in i) return;
    delete e.__transition;
  }
}
function J2(e, t) {
  var r = e.__transition, i, s, o = !0, a;
  if (r) {
    t = t == null ? null : t + "";
    for (a in r) {
      if ((i = r[a]).name !== t) {
        o = !1;
        continue;
      }
      s = i.state > kl && i.state < wl, i.state = qo, i.timer.stop(), i.on.call(s ? "interrupt" : "cancel", e, e.__data__, i.index, i.group), delete r[a];
    }
    o && delete e.__transition;
  }
}
function tw(e) {
  return this.each(function() {
    J2(this, e);
  });
}
function ew(e, t) {
  var r, i;
  return function() {
    var s = dr(this, e), o = s.tween;
    if (o !== r) {
      i = r = o;
      for (var a = 0, n = i.length; a < n; ++a)
        if (i[a].name === t) {
          i = i.slice(), i.splice(a, 1);
          break;
        }
    }
    s.tween = i;
  };
}
function rw(e, t, r) {
  var i, s;
  if (typeof r != "function") throw new Error();
  return function() {
    var o = dr(this, e), a = o.tween;
    if (a !== i) {
      s = (i = a).slice();
      for (var n = { name: t, value: r }, l = 0, c = s.length; l < c; ++l)
        if (s[l].name === t) {
          s[l] = n;
          break;
        }
      l === c && s.push(n);
    }
    o.tween = s;
  };
}
function iw(e, t) {
  var r = this._id;
  if (e += "", arguments.length < 2) {
    for (var i = Ze(this.node(), r).tween, s = 0, o = i.length, a; s < o; ++s)
      if ((a = i[s]).name === e)
        return a.value;
    return null;
  }
  return this.each((t == null ? ew : rw)(r, e, t));
}
function gh(e, t, r) {
  var i = e._id;
  return e.each(function() {
    var s = dr(this, i);
    (s.value || (s.value = {}))[t] = r.apply(this, arguments);
  }), function(s) {
    return Ze(s, i).value[t];
  };
}
function Ep(e, t) {
  var r;
  return (typeof t == "number" ? Nr : t instanceof Ks ? bu : (r = Ks(t)) ? (t = r, bu) : W2)(e, t);
}
function sw(e) {
  return function() {
    this.removeAttribute(e);
  };
}
function ow(e) {
  return function() {
    this.removeAttributeNS(e.space, e.local);
  };
}
function aw(e, t, r) {
  var i, s = r + "", o;
  return function() {
    var a = this.getAttribute(e);
    return a === s ? null : a === i ? o : o = t(i = a, r);
  };
}
function nw(e, t, r) {
  var i, s = r + "", o;
  return function() {
    var a = this.getAttributeNS(e.space, e.local);
    return a === s ? null : a === i ? o : o = t(i = a, r);
  };
}
function lw(e, t, r) {
  var i, s, o;
  return function() {
    var a, n = r(this), l;
    return n == null ? void this.removeAttribute(e) : (a = this.getAttribute(e), l = n + "", a === l ? null : a === i && l === s ? o : (s = l, o = t(i = a, n)));
  };
}
function hw(e, t, r) {
  var i, s, o;
  return function() {
    var a, n = r(this), l;
    return n == null ? void this.removeAttributeNS(e.space, e.local) : (a = this.getAttributeNS(e.space, e.local), l = n + "", a === l ? null : a === i && l === s ? o : (s = l, o = t(i = a, n)));
  };
}
function cw(e, t) {
  var r = Ta(e), i = r === "transform" ? U2 : Ep;
  return this.attrTween(e, typeof t == "function" ? (r.local ? hw : lw)(r, i, gh(this, "attr." + e, t)) : t == null ? (r.local ? ow : sw)(r) : (r.local ? nw : aw)(r, i, t));
}
function uw(e, t) {
  return function(r) {
    this.setAttribute(e, t.call(this, r));
  };
}
function dw(e, t) {
  return function(r) {
    this.setAttributeNS(e.space, e.local, t.call(this, r));
  };
}
function fw(e, t) {
  var r, i;
  function s() {
    var o = t.apply(this, arguments);
    return o !== i && (r = (i = o) && dw(e, o)), r;
  }
  return s._value = t, s;
}
function pw(e, t) {
  var r, i;
  function s() {
    var o = t.apply(this, arguments);
    return o !== i && (r = (i = o) && uw(e, o)), r;
  }
  return s._value = t, s;
}
function gw(e, t) {
  var r = "attr." + e;
  if (arguments.length < 2) return (r = this.tween(r)) && r._value;
  if (t == null) return this.tween(r, null);
  if (typeof t != "function") throw new Error();
  var i = Ta(e);
  return this.tween(r, (i.local ? fw : pw)(i, t));
}
function mw(e, t) {
  return function() {
    ph(this, e).delay = +t.apply(this, arguments);
  };
}
function yw(e, t) {
  return t = +t, function() {
    ph(this, e).delay = t;
  };
}
function xw(e) {
  var t = this._id;
  return arguments.length ? this.each((typeof e == "function" ? mw : yw)(t, e)) : Ze(this.node(), t).delay;
}
function Cw(e, t) {
  return function() {
    dr(this, e).duration = +t.apply(this, arguments);
  };
}
function bw(e, t) {
  return t = +t, function() {
    dr(this, e).duration = t;
  };
}
function kw(e) {
  var t = this._id;
  return arguments.length ? this.each((typeof e == "function" ? Cw : bw)(t, e)) : Ze(this.node(), t).duration;
}
function ww(e, t) {
  if (typeof t != "function") throw new Error();
  return function() {
    dr(this, e).ease = t;
  };
}
function Sw(e) {
  var t = this._id;
  return arguments.length ? this.each(ww(t, e)) : Ze(this.node(), t).ease;
}
function Tw(e, t) {
  return function() {
    var r = t.apply(this, arguments);
    if (typeof r != "function") throw new Error();
    dr(this, e).ease = r;
  };
}
function _w(e) {
  if (typeof e != "function") throw new Error();
  return this.each(Tw(this._id, e));
}
function Bw(e) {
  typeof e != "function" && (e = cp(e));
  for (var t = this._groups, r = t.length, i = new Array(r), s = 0; s < r; ++s)
    for (var o = t[s], a = o.length, n = i[s] = [], l, c = 0; c < a; ++c)
      (l = o[c]) && e.call(l, l.__data__, c, o) && n.push(l);
  return new _r(i, this._parents, this._name, this._id);
}
function vw(e) {
  if (e._id !== this._id) throw new Error();
  for (var t = this._groups, r = e._groups, i = t.length, s = r.length, o = Math.min(i, s), a = new Array(i), n = 0; n < o; ++n)
    for (var l = t[n], c = r[n], h = l.length, u = a[n] = new Array(h), d, f = 0; f < h; ++f)
      (d = l[f] || c[f]) && (u[f] = d);
  for (; n < i; ++n)
    a[n] = t[n];
  return new _r(a, this._parents, this._name, this._id);
}
function Lw(e) {
  return (e + "").trim().split(/^|\s+/).every(function(t) {
    var r = t.indexOf(".");
    return r >= 0 && (t = t.slice(0, r)), !t || t === "start";
  });
}
function Aw(e, t, r) {
  var i, s, o = Lw(t) ? ph : dr;
  return function() {
    var a = o(this, e), n = a.on;
    n !== i && (s = (i = n).copy()).on(t, r), a.on = s;
  };
}
function Ew(e, t) {
  var r = this._id;
  return arguments.length < 2 ? Ze(this.node(), r).on.on(e) : this.each(Aw(r, e, t));
}
function Fw(e) {
  return function() {
    var t = this.parentNode;
    for (var r in this.__transition) if (+r !== e) return;
    t && t.removeChild(this);
  };
}
function Mw() {
  return this.on("end.remove", Fw(this._id));
}
function Ow(e) {
  var t = this._name, r = this._id;
  typeof e != "function" && (e = hh(e));
  for (var i = this._groups, s = i.length, o = new Array(s), a = 0; a < s; ++a)
    for (var n = i[a], l = n.length, c = o[a] = new Array(l), h, u, d = 0; d < l; ++d)
      (h = n[d]) && (u = e.call(h, h.__data__, d, n)) && ("__data__" in h && (u.__data__ = h.__data__), c[d] = u, Ba(c[d], t, r, d, c, Ze(h, r)));
  return new _r(o, this._parents, t, r);
}
function $w(e) {
  var t = this._name, r = this._id;
  typeof e != "function" && (e = hp(e));
  for (var i = this._groups, s = i.length, o = [], a = [], n = 0; n < s; ++n)
    for (var l = i[n], c = l.length, h, u = 0; u < c; ++u)
      if (h = l[u]) {
        for (var d = e.call(h, h.__data__, u, l), f, m = Ze(h, r), y = 0, x = d.length; y < x; ++y)
          (f = d[y]) && Ba(f, t, r, y, d, m);
        o.push(d), a.push(h);
      }
  return new _r(o, a, t, r);
}
var Iw = ao.prototype.constructor;
function Dw() {
  return new Iw(this._groups, this._parents);
}
function Rw(e, t) {
  var r, i, s;
  return function() {
    var o = rs(this, e), a = (this.style.removeProperty(e), rs(this, e));
    return o === a ? null : o === r && a === i ? s : s = t(r = o, i = a);
  };
}
function Fp(e) {
  return function() {
    this.style.removeProperty(e);
  };
}
function Pw(e, t, r) {
  var i, s = r + "", o;
  return function() {
    var a = rs(this, e);
    return a === s ? null : a === i ? o : o = t(i = a, r);
  };
}
function Nw(e, t, r) {
  var i, s, o;
  return function() {
    var a = rs(this, e), n = r(this), l = n + "";
    return n == null && (l = n = (this.style.removeProperty(e), rs(this, e))), a === l ? null : a === i && l === s ? o : (s = l, o = t(i = a, n));
  };
}
function qw(e, t) {
  var r, i, s, o = "style." + t, a = "end." + o, n;
  return function() {
    var l = dr(this, e), c = l.on, h = l.value[o] == null ? n || (n = Fp(t)) : void 0;
    (c !== r || s !== h) && (i = (r = c).copy()).on(a, s = h), l.on = i;
  };
}
function Ww(e, t, r) {
  var i = (e += "") == "transform" ? Y2 : Ep;
  return t == null ? this.styleTween(e, Rw(e, i)).on("end.style." + e, Fp(e)) : typeof t == "function" ? this.styleTween(e, Nw(e, i, gh(this, "style." + e, t))).each(qw(this._id, e)) : this.styleTween(e, Pw(e, i, t), r).on("end.style." + e, null);
}
function zw(e, t, r) {
  return function(i) {
    this.style.setProperty(e, t.call(this, i), r);
  };
}
function Hw(e, t, r) {
  var i, s;
  function o() {
    var a = t.apply(this, arguments);
    return a !== s && (i = (s = a) && zw(e, a, r)), i;
  }
  return o._value = t, o;
}
function Yw(e, t, r) {
  var i = "style." + (e += "");
  if (arguments.length < 2) return (i = this.tween(i)) && i._value;
  if (t == null) return this.tween(i, null);
  if (typeof t != "function") throw new Error();
  return this.tween(i, Hw(e, t, r ?? ""));
}
function Uw(e) {
  return function() {
    this.textContent = e;
  };
}
function Xw(e) {
  return function() {
    var t = e(this);
    this.textContent = t ?? "";
  };
}
function jw(e) {
  return this.tween("text", typeof e == "function" ? Xw(gh(this, "text", e)) : Uw(e == null ? "" : e + ""));
}
function Gw(e) {
  return function(t) {
    this.textContent = e.call(this, t);
  };
}
function Vw(e) {
  var t, r;
  function i() {
    var s = e.apply(this, arguments);
    return s !== r && (t = (r = s) && Gw(s)), t;
  }
  return i._value = e, i;
}
function Kw(e) {
  var t = "text";
  if (arguments.length < 1) return (t = this.tween(t)) && t._value;
  if (e == null) return this.tween(t, null);
  if (typeof e != "function") throw new Error();
  return this.tween(t, Vw(e));
}
function Zw() {
  for (var e = this._name, t = this._id, r = Mp(), i = this._groups, s = i.length, o = 0; o < s; ++o)
    for (var a = i[o], n = a.length, l, c = 0; c < n; ++c)
      if (l = a[c]) {
        var h = Ze(l, t);
        Ba(l, e, r, c, a, {
          time: h.time + h.delay + h.duration,
          delay: 0,
          duration: h.duration,
          ease: h.ease
        });
      }
  return new _r(i, this._parents, e, r);
}
function Qw() {
  var e, t, r = this, i = r._id, s = r.size();
  return new Promise(function(o, a) {
    var n = { value: a }, l = { value: function() {
      --s === 0 && o();
    } };
    r.each(function() {
      var c = dr(this, i), h = c.on;
      h !== e && (t = (e = h).copy(), t._.cancel.push(n), t._.interrupt.push(n), t._.end.push(l)), c.on = t;
    }), s === 0 && o();
  });
}
var Jw = 0;
function _r(e, t, r, i) {
  this._groups = e, this._parents = t, this._name = r, this._id = i;
}
function Mp() {
  return ++Jw;
}
var kr = ao.prototype;
_r.prototype = {
  constructor: _r,
  select: Ow,
  selectAll: $w,
  selectChild: kr.selectChild,
  selectChildren: kr.selectChildren,
  filter: Bw,
  merge: vw,
  selection: Dw,
  transition: Zw,
  call: kr.call,
  nodes: kr.nodes,
  node: kr.node,
  size: kr.size,
  empty: kr.empty,
  each: kr.each,
  on: Ew,
  attr: cw,
  attrTween: gw,
  style: Ww,
  styleTween: Yw,
  text: jw,
  textTween: Kw,
  remove: Mw,
  tween: iw,
  delay: xw,
  duration: kw,
  ease: Sw,
  easeVarying: _w,
  end: Qw,
  [Symbol.iterator]: kr[Symbol.iterator]
};
function tS(e) {
  return ((e *= 2) <= 1 ? e * e * e : (e -= 2) * e * e + 2) / 2;
}
var eS = {
  time: null,
  // Set on use.
  delay: 0,
  duration: 250,
  ease: tS
};
function rS(e, t) {
  for (var r; !(r = e.__transition) || !(r = r[t]); )
    if (!(e = e.parentNode))
      throw new Error(`transition ${t} not found`);
  return r;
}
function iS(e) {
  var t, r;
  e instanceof _r ? (t = e._id, e = e._name) : (t = Mp(), (r = eS).time = fh(), e = e == null ? null : e + "");
  for (var i = this._groups, s = i.length, o = 0; o < s; ++o)
    for (var a = i[o], n = a.length, l, c = 0; c < n; ++c)
      (l = a[c]) && Ba(l, e, t, c, a, r || rS(l, t));
  return new _r(i, this._parents, e, t);
}
ao.prototype.interrupt = tw;
ao.prototype.transition = iS;
const Sl = Math.PI, Tl = 2 * Sl, ti = 1e-6, sS = Tl - ti;
function Op(e) {
  this._ += e[0];
  for (let t = 1, r = e.length; t < r; ++t)
    this._ += arguments[t] + e[t];
}
function oS(e) {
  let t = Math.floor(e);
  if (!(t >= 0)) throw new Error(`invalid digits: ${e}`);
  if (t > 15) return Op;
  const r = 10 ** t;
  return function(i) {
    this._ += i[0];
    for (let s = 1, o = i.length; s < o; ++s)
      this._ += Math.round(arguments[s] * r) / r + i[s];
  };
}
class aS {
  constructor(t) {
    this._x0 = this._y0 = // start of current subpath
    this._x1 = this._y1 = null, this._ = "", this._append = t == null ? Op : oS(t);
  }
  moveTo(t, r) {
    this._append`M${this._x0 = this._x1 = +t},${this._y0 = this._y1 = +r}`;
  }
  closePath() {
    this._x1 !== null && (this._x1 = this._x0, this._y1 = this._y0, this._append`Z`);
  }
  lineTo(t, r) {
    this._append`L${this._x1 = +t},${this._y1 = +r}`;
  }
  quadraticCurveTo(t, r, i, s) {
    this._append`Q${+t},${+r},${this._x1 = +i},${this._y1 = +s}`;
  }
  bezierCurveTo(t, r, i, s, o, a) {
    this._append`C${+t},${+r},${+i},${+s},${this._x1 = +o},${this._y1 = +a}`;
  }
  arcTo(t, r, i, s, o) {
    if (t = +t, r = +r, i = +i, s = +s, o = +o, o < 0) throw new Error(`negative radius: ${o}`);
    let a = this._x1, n = this._y1, l = i - t, c = s - r, h = a - t, u = n - r, d = h * h + u * u;
    if (this._x1 === null)
      this._append`M${this._x1 = t},${this._y1 = r}`;
    else if (d > ti) if (!(Math.abs(u * l - c * h) > ti) || !o)
      this._append`L${this._x1 = t},${this._y1 = r}`;
    else {
      let f = i - a, m = s - n, y = l * l + c * c, x = f * f + m * m, C = Math.sqrt(y), b = Math.sqrt(d), w = o * Math.tan((Sl - Math.acos((y + d - x) / (2 * C * b))) / 2), _ = w / b, B = w / C;
      Math.abs(_ - 1) > ti && this._append`L${t + _ * h},${r + _ * u}`, this._append`A${o},${o},0,0,${+(u * f > h * m)},${this._x1 = t + B * l},${this._y1 = r + B * c}`;
    }
  }
  arc(t, r, i, s, o, a) {
    if (t = +t, r = +r, i = +i, a = !!a, i < 0) throw new Error(`negative radius: ${i}`);
    let n = i * Math.cos(s), l = i * Math.sin(s), c = t + n, h = r + l, u = 1 ^ a, d = a ? s - o : o - s;
    this._x1 === null ? this._append`M${c},${h}` : (Math.abs(this._x1 - c) > ti || Math.abs(this._y1 - h) > ti) && this._append`L${c},${h}`, i && (d < 0 && (d = d % Tl + Tl), d > sS ? this._append`A${i},${i},0,1,${u},${t - n},${r - l}A${i},${i},0,1,${u},${this._x1 = c},${this._y1 = h}` : d > ti && this._append`A${i},${i},0,${+(d >= Sl)},${u},${this._x1 = t + i * Math.cos(o)},${this._y1 = r + i * Math.sin(o)}`);
  }
  rect(t, r, i, s) {
    this._append`M${this._x0 = this._x1 = +t},${this._y0 = this._y1 = +r}h${i = +i}v${+s}h${-i}Z`;
  }
  toString() {
    return this._;
  }
}
function Ti(e) {
  return function() {
    return e;
  };
}
const RM = Math.abs, PM = Math.atan2, NM = Math.cos, qM = Math.max, WM = Math.min, zM = Math.sin, HM = Math.sqrt, Bu = 1e-12, mh = Math.PI, vu = mh / 2, YM = 2 * mh;
function UM(e) {
  return e > 1 ? 0 : e < -1 ? mh : Math.acos(e);
}
function XM(e) {
  return e >= 1 ? vu : e <= -1 ? -vu : Math.asin(e);
}
function nS(e) {
  let t = 3;
  return e.digits = function(r) {
    if (!arguments.length) return t;
    if (r == null)
      t = null;
    else {
      const i = Math.floor(r);
      if (!(i >= 0)) throw new RangeError(`invalid digits: ${r}`);
      t = i;
    }
    return e;
  }, () => new aS(t);
}
function lS(e) {
  return typeof e == "object" && "length" in e ? e : Array.from(e);
}
function $p(e) {
  this._context = e;
}
$p.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._point = 0;
  },
  lineEnd: function() {
    (this._line || this._line !== 0 && this._point === 1) && this._context.closePath(), this._line = 1 - this._line;
  },
  point: function(e, t) {
    switch (e = +e, t = +t, this._point) {
      case 0:
        this._point = 1, this._line ? this._context.lineTo(e, t) : this._context.moveTo(e, t);
        break;
      case 1:
        this._point = 2;
      // falls through
      default:
        this._context.lineTo(e, t);
        break;
    }
  }
};
function Hs(e) {
  return new $p(e);
}
function hS(e) {
  return e[0];
}
function cS(e) {
  return e[1];
}
function uS(e, t) {
  var r = Ti(!0), i = null, s = Hs, o = null, a = nS(n);
  e = typeof e == "function" ? e : e === void 0 ? hS : Ti(e), t = typeof t == "function" ? t : t === void 0 ? cS : Ti(t);
  function n(l) {
    var c, h = (l = lS(l)).length, u, d = !1, f;
    for (i == null && (o = s(f = a())), c = 0; c <= h; ++c)
      !(c < h && r(u = l[c], c, l)) === d && ((d = !d) ? o.lineStart() : o.lineEnd()), d && o.point(+e(u, c, l), +t(u, c, l));
    if (f) return o = null, f + "" || null;
  }
  return n.x = function(l) {
    return arguments.length ? (e = typeof l == "function" ? l : Ti(+l), n) : e;
  }, n.y = function(l) {
    return arguments.length ? (t = typeof l == "function" ? l : Ti(+l), n) : t;
  }, n.defined = function(l) {
    return arguments.length ? (r = typeof l == "function" ? l : Ti(!!l), n) : r;
  }, n.curve = function(l) {
    return arguments.length ? (s = l, i != null && (o = s(i)), n) : s;
  }, n.context = function(l) {
    return arguments.length ? (l == null ? i = o = null : o = s(i = l), n) : i;
  }, n;
}
class Ip {
  constructor(t, r) {
    this._context = t, this._x = r;
  }
  areaStart() {
    this._line = 0;
  }
  areaEnd() {
    this._line = NaN;
  }
  lineStart() {
    this._point = 0;
  }
  lineEnd() {
    (this._line || this._line !== 0 && this._point === 1) && this._context.closePath(), this._line = 1 - this._line;
  }
  point(t, r) {
    switch (t = +t, r = +r, this._point) {
      case 0: {
        this._point = 1, this._line ? this._context.lineTo(t, r) : this._context.moveTo(t, r);
        break;
      }
      case 1:
        this._point = 2;
      // falls through
      default: {
        this._x ? this._context.bezierCurveTo(this._x0 = (this._x0 + t) / 2, this._y0, this._x0, r, t, r) : this._context.bezierCurveTo(this._x0, this._y0 = (this._y0 + r) / 2, t, this._y0, t, r);
        break;
      }
    }
    this._x0 = t, this._y0 = r;
  }
}
function Dp(e) {
  return new Ip(e, !0);
}
function Rp(e) {
  return new Ip(e, !1);
}
function Yr() {
}
function aa(e, t, r) {
  e._context.bezierCurveTo(
    (2 * e._x0 + e._x1) / 3,
    (2 * e._y0 + e._y1) / 3,
    (e._x0 + 2 * e._x1) / 3,
    (e._y0 + 2 * e._y1) / 3,
    (e._x0 + 4 * e._x1 + t) / 6,
    (e._y0 + 4 * e._y1 + r) / 6
  );
}
function va(e) {
  this._context = e;
}
va.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x0 = this._x1 = this._y0 = this._y1 = NaN, this._point = 0;
  },
  lineEnd: function() {
    switch (this._point) {
      case 3:
        aa(this, this._x1, this._y1);
      // falls through
      case 2:
        this._context.lineTo(this._x1, this._y1);
        break;
    }
    (this._line || this._line !== 0 && this._point === 1) && this._context.closePath(), this._line = 1 - this._line;
  },
  point: function(e, t) {
    switch (e = +e, t = +t, this._point) {
      case 0:
        this._point = 1, this._line ? this._context.lineTo(e, t) : this._context.moveTo(e, t);
        break;
      case 1:
        this._point = 2;
        break;
      case 2:
        this._point = 3, this._context.lineTo((5 * this._x0 + this._x1) / 6, (5 * this._y0 + this._y1) / 6);
      // falls through
      default:
        aa(this, e, t);
        break;
    }
    this._x0 = this._x1, this._x1 = e, this._y0 = this._y1, this._y1 = t;
  }
};
function _l(e) {
  return new va(e);
}
function Pp(e) {
  this._context = e;
}
Pp.prototype = {
  areaStart: Yr,
  areaEnd: Yr,
  lineStart: function() {
    this._x0 = this._x1 = this._x2 = this._x3 = this._x4 = this._y0 = this._y1 = this._y2 = this._y3 = this._y4 = NaN, this._point = 0;
  },
  lineEnd: function() {
    switch (this._point) {
      case 1: {
        this._context.moveTo(this._x2, this._y2), this._context.closePath();
        break;
      }
      case 2: {
        this._context.moveTo((this._x2 + 2 * this._x3) / 3, (this._y2 + 2 * this._y3) / 3), this._context.lineTo((this._x3 + 2 * this._x2) / 3, (this._y3 + 2 * this._y2) / 3), this._context.closePath();
        break;
      }
      case 3: {
        this.point(this._x2, this._y2), this.point(this._x3, this._y3), this.point(this._x4, this._y4);
        break;
      }
    }
  },
  point: function(e, t) {
    switch (e = +e, t = +t, this._point) {
      case 0:
        this._point = 1, this._x2 = e, this._y2 = t;
        break;
      case 1:
        this._point = 2, this._x3 = e, this._y3 = t;
        break;
      case 2:
        this._point = 3, this._x4 = e, this._y4 = t, this._context.moveTo((this._x0 + 4 * this._x1 + e) / 6, (this._y0 + 4 * this._y1 + t) / 6);
        break;
      default:
        aa(this, e, t);
        break;
    }
    this._x0 = this._x1, this._x1 = e, this._y0 = this._y1, this._y1 = t;
  }
};
function dS(e) {
  return new Pp(e);
}
function Np(e) {
  this._context = e;
}
Np.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x0 = this._x1 = this._y0 = this._y1 = NaN, this._point = 0;
  },
  lineEnd: function() {
    (this._line || this._line !== 0 && this._point === 3) && this._context.closePath(), this._line = 1 - this._line;
  },
  point: function(e, t) {
    switch (e = +e, t = +t, this._point) {
      case 0:
        this._point = 1;
        break;
      case 1:
        this._point = 2;
        break;
      case 2:
        this._point = 3;
        var r = (this._x0 + 4 * this._x1 + e) / 6, i = (this._y0 + 4 * this._y1 + t) / 6;
        this._line ? this._context.lineTo(r, i) : this._context.moveTo(r, i);
        break;
      case 3:
        this._point = 4;
      // falls through
      default:
        aa(this, e, t);
        break;
    }
    this._x0 = this._x1, this._x1 = e, this._y0 = this._y1, this._y1 = t;
  }
};
function fS(e) {
  return new Np(e);
}
function qp(e, t) {
  this._basis = new va(e), this._beta = t;
}
qp.prototype = {
  lineStart: function() {
    this._x = [], this._y = [], this._basis.lineStart();
  },
  lineEnd: function() {
    var e = this._x, t = this._y, r = e.length - 1;
    if (r > 0)
      for (var i = e[0], s = t[0], o = e[r] - i, a = t[r] - s, n = -1, l; ++n <= r; )
        l = n / r, this._basis.point(
          this._beta * e[n] + (1 - this._beta) * (i + l * o),
          this._beta * t[n] + (1 - this._beta) * (s + l * a)
        );
    this._x = this._y = null, this._basis.lineEnd();
  },
  point: function(e, t) {
    this._x.push(+e), this._y.push(+t);
  }
};
const pS = (function e(t) {
  function r(i) {
    return t === 1 ? new va(i) : new qp(i, t);
  }
  return r.beta = function(i) {
    return e(+i);
  }, r;
})(0.85);
function na(e, t, r) {
  e._context.bezierCurveTo(
    e._x1 + e._k * (e._x2 - e._x0),
    e._y1 + e._k * (e._y2 - e._y0),
    e._x2 + e._k * (e._x1 - t),
    e._y2 + e._k * (e._y1 - r),
    e._x2,
    e._y2
  );
}
function yh(e, t) {
  this._context = e, this._k = (1 - t) / 6;
}
yh.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x0 = this._x1 = this._x2 = this._y0 = this._y1 = this._y2 = NaN, this._point = 0;
  },
  lineEnd: function() {
    switch (this._point) {
      case 2:
        this._context.lineTo(this._x2, this._y2);
        break;
      case 3:
        na(this, this._x1, this._y1);
        break;
    }
    (this._line || this._line !== 0 && this._point === 1) && this._context.closePath(), this._line = 1 - this._line;
  },
  point: function(e, t) {
    switch (e = +e, t = +t, this._point) {
      case 0:
        this._point = 1, this._line ? this._context.lineTo(e, t) : this._context.moveTo(e, t);
        break;
      case 1:
        this._point = 2, this._x1 = e, this._y1 = t;
        break;
      case 2:
        this._point = 3;
      // falls through
      default:
        na(this, e, t);
        break;
    }
    this._x0 = this._x1, this._x1 = this._x2, this._x2 = e, this._y0 = this._y1, this._y1 = this._y2, this._y2 = t;
  }
};
const Wp = (function e(t) {
  function r(i) {
    return new yh(i, t);
  }
  return r.tension = function(i) {
    return e(+i);
  }, r;
})(0);
function xh(e, t) {
  this._context = e, this._k = (1 - t) / 6;
}
xh.prototype = {
  areaStart: Yr,
  areaEnd: Yr,
  lineStart: function() {
    this._x0 = this._x1 = this._x2 = this._x3 = this._x4 = this._x5 = this._y0 = this._y1 = this._y2 = this._y3 = this._y4 = this._y5 = NaN, this._point = 0;
  },
  lineEnd: function() {
    switch (this._point) {
      case 1: {
        this._context.moveTo(this._x3, this._y3), this._context.closePath();
        break;
      }
      case 2: {
        this._context.lineTo(this._x3, this._y3), this._context.closePath();
        break;
      }
      case 3: {
        this.point(this._x3, this._y3), this.point(this._x4, this._y4), this.point(this._x5, this._y5);
        break;
      }
    }
  },
  point: function(e, t) {
    switch (e = +e, t = +t, this._point) {
      case 0:
        this._point = 1, this._x3 = e, this._y3 = t;
        break;
      case 1:
        this._point = 2, this._context.moveTo(this._x4 = e, this._y4 = t);
        break;
      case 2:
        this._point = 3, this._x5 = e, this._y5 = t;
        break;
      default:
        na(this, e, t);
        break;
    }
    this._x0 = this._x1, this._x1 = this._x2, this._x2 = e, this._y0 = this._y1, this._y1 = this._y2, this._y2 = t;
  }
};
const gS = (function e(t) {
  function r(i) {
    return new xh(i, t);
  }
  return r.tension = function(i) {
    return e(+i);
  }, r;
})(0);
function Ch(e, t) {
  this._context = e, this._k = (1 - t) / 6;
}
Ch.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x0 = this._x1 = this._x2 = this._y0 = this._y1 = this._y2 = NaN, this._point = 0;
  },
  lineEnd: function() {
    (this._line || this._line !== 0 && this._point === 3) && this._context.closePath(), this._line = 1 - this._line;
  },
  point: function(e, t) {
    switch (e = +e, t = +t, this._point) {
      case 0:
        this._point = 1;
        break;
      case 1:
        this._point = 2;
        break;
      case 2:
        this._point = 3, this._line ? this._context.lineTo(this._x2, this._y2) : this._context.moveTo(this._x2, this._y2);
        break;
      case 3:
        this._point = 4;
      // falls through
      default:
        na(this, e, t);
        break;
    }
    this._x0 = this._x1, this._x1 = this._x2, this._x2 = e, this._y0 = this._y1, this._y1 = this._y2, this._y2 = t;
  }
};
const mS = (function e(t) {
  function r(i) {
    return new Ch(i, t);
  }
  return r.tension = function(i) {
    return e(+i);
  }, r;
})(0);
function bh(e, t, r) {
  var i = e._x1, s = e._y1, o = e._x2, a = e._y2;
  if (e._l01_a > Bu) {
    var n = 2 * e._l01_2a + 3 * e._l01_a * e._l12_a + e._l12_2a, l = 3 * e._l01_a * (e._l01_a + e._l12_a);
    i = (i * n - e._x0 * e._l12_2a + e._x2 * e._l01_2a) / l, s = (s * n - e._y0 * e._l12_2a + e._y2 * e._l01_2a) / l;
  }
  if (e._l23_a > Bu) {
    var c = 2 * e._l23_2a + 3 * e._l23_a * e._l12_a + e._l12_2a, h = 3 * e._l23_a * (e._l23_a + e._l12_a);
    o = (o * c + e._x1 * e._l23_2a - t * e._l12_2a) / h, a = (a * c + e._y1 * e._l23_2a - r * e._l12_2a) / h;
  }
  e._context.bezierCurveTo(i, s, o, a, e._x2, e._y2);
}
function zp(e, t) {
  this._context = e, this._alpha = t;
}
zp.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x0 = this._x1 = this._x2 = this._y0 = this._y1 = this._y2 = NaN, this._l01_a = this._l12_a = this._l23_a = this._l01_2a = this._l12_2a = this._l23_2a = this._point = 0;
  },
  lineEnd: function() {
    switch (this._point) {
      case 2:
        this._context.lineTo(this._x2, this._y2);
        break;
      case 3:
        this.point(this._x2, this._y2);
        break;
    }
    (this._line || this._line !== 0 && this._point === 1) && this._context.closePath(), this._line = 1 - this._line;
  },
  point: function(e, t) {
    if (e = +e, t = +t, this._point) {
      var r = this._x2 - e, i = this._y2 - t;
      this._l23_a = Math.sqrt(this._l23_2a = Math.pow(r * r + i * i, this._alpha));
    }
    switch (this._point) {
      case 0:
        this._point = 1, this._line ? this._context.lineTo(e, t) : this._context.moveTo(e, t);
        break;
      case 1:
        this._point = 2;
        break;
      case 2:
        this._point = 3;
      // falls through
      default:
        bh(this, e, t);
        break;
    }
    this._l01_a = this._l12_a, this._l12_a = this._l23_a, this._l01_2a = this._l12_2a, this._l12_2a = this._l23_2a, this._x0 = this._x1, this._x1 = this._x2, this._x2 = e, this._y0 = this._y1, this._y1 = this._y2, this._y2 = t;
  }
};
const Hp = (function e(t) {
  function r(i) {
    return t ? new zp(i, t) : new yh(i, 0);
  }
  return r.alpha = function(i) {
    return e(+i);
  }, r;
})(0.5);
function Yp(e, t) {
  this._context = e, this._alpha = t;
}
Yp.prototype = {
  areaStart: Yr,
  areaEnd: Yr,
  lineStart: function() {
    this._x0 = this._x1 = this._x2 = this._x3 = this._x4 = this._x5 = this._y0 = this._y1 = this._y2 = this._y3 = this._y4 = this._y5 = NaN, this._l01_a = this._l12_a = this._l23_a = this._l01_2a = this._l12_2a = this._l23_2a = this._point = 0;
  },
  lineEnd: function() {
    switch (this._point) {
      case 1: {
        this._context.moveTo(this._x3, this._y3), this._context.closePath();
        break;
      }
      case 2: {
        this._context.lineTo(this._x3, this._y3), this._context.closePath();
        break;
      }
      case 3: {
        this.point(this._x3, this._y3), this.point(this._x4, this._y4), this.point(this._x5, this._y5);
        break;
      }
    }
  },
  point: function(e, t) {
    if (e = +e, t = +t, this._point) {
      var r = this._x2 - e, i = this._y2 - t;
      this._l23_a = Math.sqrt(this._l23_2a = Math.pow(r * r + i * i, this._alpha));
    }
    switch (this._point) {
      case 0:
        this._point = 1, this._x3 = e, this._y3 = t;
        break;
      case 1:
        this._point = 2, this._context.moveTo(this._x4 = e, this._y4 = t);
        break;
      case 2:
        this._point = 3, this._x5 = e, this._y5 = t;
        break;
      default:
        bh(this, e, t);
        break;
    }
    this._l01_a = this._l12_a, this._l12_a = this._l23_a, this._l01_2a = this._l12_2a, this._l12_2a = this._l23_2a, this._x0 = this._x1, this._x1 = this._x2, this._x2 = e, this._y0 = this._y1, this._y1 = this._y2, this._y2 = t;
  }
};
const yS = (function e(t) {
  function r(i) {
    return t ? new Yp(i, t) : new xh(i, 0);
  }
  return r.alpha = function(i) {
    return e(+i);
  }, r;
})(0.5);
function Up(e, t) {
  this._context = e, this._alpha = t;
}
Up.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x0 = this._x1 = this._x2 = this._y0 = this._y1 = this._y2 = NaN, this._l01_a = this._l12_a = this._l23_a = this._l01_2a = this._l12_2a = this._l23_2a = this._point = 0;
  },
  lineEnd: function() {
    (this._line || this._line !== 0 && this._point === 3) && this._context.closePath(), this._line = 1 - this._line;
  },
  point: function(e, t) {
    if (e = +e, t = +t, this._point) {
      var r = this._x2 - e, i = this._y2 - t;
      this._l23_a = Math.sqrt(this._l23_2a = Math.pow(r * r + i * i, this._alpha));
    }
    switch (this._point) {
      case 0:
        this._point = 1;
        break;
      case 1:
        this._point = 2;
        break;
      case 2:
        this._point = 3, this._line ? this._context.lineTo(this._x2, this._y2) : this._context.moveTo(this._x2, this._y2);
        break;
      case 3:
        this._point = 4;
      // falls through
      default:
        bh(this, e, t);
        break;
    }
    this._l01_a = this._l12_a, this._l12_a = this._l23_a, this._l01_2a = this._l12_2a, this._l12_2a = this._l23_2a, this._x0 = this._x1, this._x1 = this._x2, this._x2 = e, this._y0 = this._y1, this._y1 = this._y2, this._y2 = t;
  }
};
const xS = (function e(t) {
  function r(i) {
    return t ? new Up(i, t) : new Ch(i, 0);
  }
  return r.alpha = function(i) {
    return e(+i);
  }, r;
})(0.5);
function Xp(e) {
  this._context = e;
}
Xp.prototype = {
  areaStart: Yr,
  areaEnd: Yr,
  lineStart: function() {
    this._point = 0;
  },
  lineEnd: function() {
    this._point && this._context.closePath();
  },
  point: function(e, t) {
    e = +e, t = +t, this._point ? this._context.lineTo(e, t) : (this._point = 1, this._context.moveTo(e, t));
  }
};
function CS(e) {
  return new Xp(e);
}
function Lu(e) {
  return e < 0 ? -1 : 1;
}
function Au(e, t, r) {
  var i = e._x1 - e._x0, s = t - e._x1, o = (e._y1 - e._y0) / (i || s < 0 && -0), a = (r - e._y1) / (s || i < 0 && -0), n = (o * s + a * i) / (i + s);
  return (Lu(o) + Lu(a)) * Math.min(Math.abs(o), Math.abs(a), 0.5 * Math.abs(n)) || 0;
}
function Eu(e, t) {
  var r = e._x1 - e._x0;
  return r ? (3 * (e._y1 - e._y0) / r - t) / 2 : t;
}
function xn(e, t, r) {
  var i = e._x0, s = e._y0, o = e._x1, a = e._y1, n = (o - i) / 3;
  e._context.bezierCurveTo(i + n, s + n * t, o - n, a - n * r, o, a);
}
function la(e) {
  this._context = e;
}
la.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x0 = this._x1 = this._y0 = this._y1 = this._t0 = NaN, this._point = 0;
  },
  lineEnd: function() {
    switch (this._point) {
      case 2:
        this._context.lineTo(this._x1, this._y1);
        break;
      case 3:
        xn(this, this._t0, Eu(this, this._t0));
        break;
    }
    (this._line || this._line !== 0 && this._point === 1) && this._context.closePath(), this._line = 1 - this._line;
  },
  point: function(e, t) {
    var r = NaN;
    if (e = +e, t = +t, !(e === this._x1 && t === this._y1)) {
      switch (this._point) {
        case 0:
          this._point = 1, this._line ? this._context.lineTo(e, t) : this._context.moveTo(e, t);
          break;
        case 1:
          this._point = 2;
          break;
        case 2:
          this._point = 3, xn(this, Eu(this, r = Au(this, e, t)), r);
          break;
        default:
          xn(this, this._t0, r = Au(this, e, t));
          break;
      }
      this._x0 = this._x1, this._x1 = e, this._y0 = this._y1, this._y1 = t, this._t0 = r;
    }
  }
};
function jp(e) {
  this._context = new Gp(e);
}
(jp.prototype = Object.create(la.prototype)).point = function(e, t) {
  la.prototype.point.call(this, t, e);
};
function Gp(e) {
  this._context = e;
}
Gp.prototype = {
  moveTo: function(e, t) {
    this._context.moveTo(t, e);
  },
  closePath: function() {
    this._context.closePath();
  },
  lineTo: function(e, t) {
    this._context.lineTo(t, e);
  },
  bezierCurveTo: function(e, t, r, i, s, o) {
    this._context.bezierCurveTo(t, e, i, r, o, s);
  }
};
function Vp(e) {
  return new la(e);
}
function Kp(e) {
  return new jp(e);
}
function Zp(e) {
  this._context = e;
}
Zp.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x = [], this._y = [];
  },
  lineEnd: function() {
    var e = this._x, t = this._y, r = e.length;
    if (r)
      if (this._line ? this._context.lineTo(e[0], t[0]) : this._context.moveTo(e[0], t[0]), r === 2)
        this._context.lineTo(e[1], t[1]);
      else
        for (var i = Fu(e), s = Fu(t), o = 0, a = 1; a < r; ++o, ++a)
          this._context.bezierCurveTo(i[0][o], s[0][o], i[1][o], s[1][o], e[a], t[a]);
    (this._line || this._line !== 0 && r === 1) && this._context.closePath(), this._line = 1 - this._line, this._x = this._y = null;
  },
  point: function(e, t) {
    this._x.push(+e), this._y.push(+t);
  }
};
function Fu(e) {
  var t, r = e.length - 1, i, s = new Array(r), o = new Array(r), a = new Array(r);
  for (s[0] = 0, o[0] = 2, a[0] = e[0] + 2 * e[1], t = 1; t < r - 1; ++t) s[t] = 1, o[t] = 4, a[t] = 4 * e[t] + 2 * e[t + 1];
  for (s[r - 1] = 2, o[r - 1] = 7, a[r - 1] = 8 * e[r - 1] + e[r], t = 1; t < r; ++t) i = s[t] / o[t - 1], o[t] -= i, a[t] -= i * a[t - 1];
  for (s[r - 1] = a[r - 1] / o[r - 1], t = r - 2; t >= 0; --t) s[t] = (a[t] - s[t + 1]) / o[t];
  for (o[r - 1] = (e[r] + s[r - 1]) / 2, t = 0; t < r - 1; ++t) o[t] = 2 * e[t + 1] - s[t + 1];
  return [s, o];
}
function Qp(e) {
  return new Zp(e);
}
function La(e, t) {
  this._context = e, this._t = t;
}
La.prototype = {
  areaStart: function() {
    this._line = 0;
  },
  areaEnd: function() {
    this._line = NaN;
  },
  lineStart: function() {
    this._x = this._y = NaN, this._point = 0;
  },
  lineEnd: function() {
    0 < this._t && this._t < 1 && this._point === 2 && this._context.lineTo(this._x, this._y), (this._line || this._line !== 0 && this._point === 1) && this._context.closePath(), this._line >= 0 && (this._t = 1 - this._t, this._line = 1 - this._line);
  },
  point: function(e, t) {
    switch (e = +e, t = +t, this._point) {
      case 0:
        this._point = 1, this._line ? this._context.lineTo(e, t) : this._context.moveTo(e, t);
        break;
      case 1:
        this._point = 2;
      // falls through
      default: {
        if (this._t <= 0)
          this._context.lineTo(this._x, t), this._context.lineTo(e, t);
        else {
          var r = this._x * (1 - this._t) + e * this._t;
          this._context.lineTo(r, this._y), this._context.lineTo(r, t);
        }
        break;
      }
    }
    this._x = e, this._y = t;
  }
};
function Jp(e) {
  return new La(e, 0.5);
}
function tg(e) {
  return new La(e, 0);
}
function eg(e) {
  return new La(e, 1);
}
function Os(e, t, r) {
  this.k = e, this.x = t, this.y = r;
}
Os.prototype = {
  constructor: Os,
  scale: function(e) {
    return e === 1 ? this : new Os(this.k * e, this.x, this.y);
  },
  translate: function(e, t) {
    return e === 0 & t === 0 ? this : new Os(this.k, this.x + this.k * e, this.y + this.k * t);
  },
  apply: function(e) {
    return [e[0] * this.k + this.x, e[1] * this.k + this.y];
  },
  applyX: function(e) {
    return e * this.k + this.x;
  },
  applyY: function(e) {
    return e * this.k + this.y;
  },
  invert: function(e) {
    return [(e[0] - this.x) / this.k, (e[1] - this.y) / this.k];
  },
  invertX: function(e) {
    return (e - this.x) / this.k;
  },
  invertY: function(e) {
    return (e - this.y) / this.k;
  },
  rescaleX: function(e) {
    return e.copy().domain(e.range().map(this.invertX, this).map(e.invert, e));
  },
  rescaleY: function(e) {
    return e.copy().domain(e.range().map(this.invertY, this).map(e.invert, e));
  },
  toString: function() {
    return "translate(" + this.x + "," + this.y + ") scale(" + this.k + ")";
  }
};
Os.prototype;
var bS = /* @__PURE__ */ p((e) => {
  const { securityLevel: t } = $t();
  let r = vt("body");
  if (t === "sandbox") {
    const o = vt(`#i${e}`).node()?.contentDocument ?? document;
    r = vt(o.body);
  }
  return r.select(`#${e}`);
}, "selectSvgElement"), kS = /* @__PURE__ */ p((e) => {
  const { handDrawnSeed: t } = $t();
  return {
    fill: e,
    hachureAngle: 120,
    // angle of hachure,
    hachureGap: 4,
    fillWeight: 2,
    roughness: 0.7,
    stroke: e,
    seed: t
  };
}, "solidStateFill"), wS = /* @__PURE__ */ p((e) => Array.isArray(e) ? e : e ? e.split(";").map((t) => t.trim()).filter(Boolean) : [], "normalizeStyleList"), ls = /* @__PURE__ */ p((e) => {
  const t = SS([
    ...e.cssCompiledStyles || [],
    ...e.cssStyles || [],
    ...wS(e.labelStyle)
  ]);
  return { stylesMap: t, stylesArray: [...t] };
}, "compileStyles"), SS = /* @__PURE__ */ p((e) => {
  const t = /* @__PURE__ */ new Map();
  return e.forEach((r) => {
    const [i, s] = r.split(":");
    t.set(i.trim(), s?.trim());
  }), t;
}, "styles2Map"), rg = /* @__PURE__ */ p((e) => e === "color" || e === "font-size" || e === "font-family" || e === "font-weight" || e === "font-style" || e === "text-decoration" || e === "text-align" || e === "text-transform" || e === "line-height" || e === "letter-spacing" || e === "word-spacing" || e === "text-shadow" || e === "text-overflow" || e === "white-space" || e === "word-wrap" || e === "word-break" || e === "overflow-wrap" || e === "hyphens", "isLabelStyle"), ft = /* @__PURE__ */ p((e) => {
  const { stylesArray: t } = ls(e), r = [], i = [], s = [], o = [];
  return t.forEach((a) => {
    const n = a[0];
    rg(n) ? r.push(a.join(":") + " !important") : (i.push(a.join(":") + " !important"), n.includes("stroke") && s.push(a.join(":") + " !important"), n === "fill" && o.push(a.join(":") + " !important"));
  }), {
    labelStyles: r.join(";"),
    nodeStyles: i.join(";"),
    stylesArray: t,
    borderStyles: s,
    backgroundStyles: o
  };
}, "styles2String"), ht = /* @__PURE__ */ p((e, t) => {
  const { themeVariables: r, handDrawnSeed: i } = $t(), { nodeBorder: s, mainBkg: o } = r, { stylesMap: a } = ls(e);
  return Object.assign(
    {
      roughness: 0.7,
      fill: a.get("fill") || o,
      fillStyle: "hachure",
      // solid fill
      fillWeight: 4,
      hachureGap: 5.2,
      stroke: a.get("stroke") || s,
      seed: i,
      strokeWidth: a.get("stroke-width")?.replace("px", "") || 1.3,
      fillLineDash: [0, 0],
      strokeLineDash: TS(a.get("stroke-dasharray"))
    },
    t
  );
}, "userNodeOverrides"), TS = /* @__PURE__ */ p((e) => {
  if (!e)
    return [0, 0];
  const t = e.trim().split(/\s+/).map(Number);
  if (t.length === 1) {
    const s = isNaN(t[0]) ? 0 : t[0];
    return [s, s];
  }
  const r = isNaN(t[0]) ? 0 : t[0], i = isNaN(t[1]) ? 0 : t[1];
  return [r, i];
}, "getStrokeDashArray");
const _S = Object.freeze({
  left: 0,
  top: 0,
  width: 16,
  height: 16
}), ha = Object.freeze({
  rotate: 0,
  vFlip: !1,
  hFlip: !1
}), ig = Object.freeze({
  ..._S,
  ...ha
}), BS = Object.freeze({
  ...ig,
  body: "",
  hidden: !1
}), vS = Object.freeze({
  width: null,
  height: null
}), LS = Object.freeze({
  ...vS,
  ...ha
}), AS = (e, t, r, i = "") => {
  const s = e.split(":");
  if (e.slice(0, 1) === "@") {
    if (s.length < 2 || s.length > 3) return null;
    i = s.shift().slice(1);
  }
  if (s.length > 3 || !s.length) return null;
  if (s.length > 1) {
    const n = s.pop(), l = s.pop(), c = {
      provider: s.length > 0 ? s[0] : i,
      prefix: l,
      name: n
    };
    return Cn(c) ? c : null;
  }
  const o = s[0], a = o.split("-");
  if (a.length > 1) {
    const n = {
      provider: i,
      prefix: a.shift(),
      name: a.join("-")
    };
    return Cn(n) ? n : null;
  }
  if (r && i === "") {
    const n = {
      provider: i,
      prefix: "",
      name: o
    };
    return Cn(n, r) ? n : null;
  }
  return null;
}, Cn = (e, t) => e ? !!((t && e.prefix === "" || e.prefix) && e.name) : !1;
function ES(e, t) {
  const r = {};
  !e.hFlip != !t.hFlip && (r.hFlip = !0), !e.vFlip != !t.vFlip && (r.vFlip = !0);
  const i = ((e.rotate || 0) + (t.rotate || 0)) % 4;
  return i && (r.rotate = i), r;
}
function Mu(e, t) {
  const r = ES(e, t);
  for (const i in BS) i in ha ? i in e && !(i in r) && (r[i] = ha[i]) : i in t ? r[i] = t[i] : i in e && (r[i] = e[i]);
  return r;
}
function FS(e, t) {
  const r = e.icons, i = e.aliases || /* @__PURE__ */ Object.create(null), s = /* @__PURE__ */ Object.create(null);
  function o(a) {
    if (r[a]) return s[a] = [];
    if (!(a in s)) {
      s[a] = null;
      const n = i[a] && i[a].parent, l = n && o(n);
      l && (s[a] = [n].concat(l));
    }
    return s[a];
  }
  return (t || Object.keys(r).concat(Object.keys(i))).forEach(o), s;
}
function Ou(e, t, r) {
  const i = e.icons, s = e.aliases || /* @__PURE__ */ Object.create(null);
  let o = {};
  function a(n) {
    o = Mu(i[n] || s[n], o);
  }
  return a(t), r.forEach(a), Mu(e, o);
}
function MS(e, t) {
  if (e.icons[t]) return Ou(e, t, []);
  const r = FS(e, [t])[t];
  return r ? Ou(e, t, r) : null;
}
const OS = /(-?[0-9.]*[0-9]+[0-9.]*)/g, $S = /^-?[0-9.]*[0-9]+[0-9.]*$/g;
function $u(e, t, r) {
  if (t === 1) return e;
  if (r = r || 100, typeof e == "number") return Math.ceil(e * t * r) / r;
  if (typeof e != "string") return e;
  const i = e.split(OS);
  if (i === null || !i.length) return e;
  const s = [];
  let o = i.shift(), a = $S.test(o);
  for (; ; ) {
    if (a) {
      const n = parseFloat(o);
      isNaN(n) ? s.push(o) : s.push(Math.ceil(n * t * r) / r);
    } else s.push(o);
    if (o = i.shift(), o === void 0) return s.join("");
    a = !a;
  }
}
function IS(e, t = "defs") {
  let r = "";
  const i = e.indexOf("<" + t);
  for (; i >= 0; ) {
    const s = e.indexOf(">", i), o = e.indexOf("</" + t);
    if (s === -1 || o === -1) break;
    const a = e.indexOf(">", o);
    if (a === -1) break;
    r += e.slice(s + 1, o).trim(), e = e.slice(0, i).trim() + e.slice(a + 1);
  }
  return {
    defs: r,
    content: e
  };
}
function DS(e, t) {
  return e ? "<defs>" + e + "</defs>" + t : t;
}
function RS(e, t, r) {
  const i = IS(e);
  return DS(i.defs, t + i.content + r);
}
const PS = (e) => e === "unset" || e === "undefined" || e === "none";
function NS(e, t) {
  const r = {
    ...ig,
    ...e
  }, i = {
    ...LS,
    ...t
  }, s = {
    left: r.left,
    top: r.top,
    width: r.width,
    height: r.height
  };
  let o = r.body;
  [r, i].forEach((y) => {
    const x = [], C = y.hFlip, b = y.vFlip;
    let w = y.rotate;
    C ? b ? w += 2 : (x.push("translate(" + (s.width + s.left).toString() + " " + (0 - s.top).toString() + ")"), x.push("scale(-1 1)"), s.top = s.left = 0) : b && (x.push("translate(" + (0 - s.left).toString() + " " + (s.height + s.top).toString() + ")"), x.push("scale(1 -1)"), s.top = s.left = 0);
    let _;
    switch (w < 0 && (w -= Math.floor(w / 4) * 4), w = w % 4, w) {
      case 1:
        _ = s.height / 2 + s.top, x.unshift("rotate(90 " + _.toString() + " " + _.toString() + ")");
        break;
      case 2:
        x.unshift("rotate(180 " + (s.width / 2 + s.left).toString() + " " + (s.height / 2 + s.top).toString() + ")");
        break;
      case 3:
        _ = s.width / 2 + s.left, x.unshift("rotate(-90 " + _.toString() + " " + _.toString() + ")");
    }
    w % 2 === 1 && (s.left !== s.top && (_ = s.left, s.left = s.top, s.top = _), s.width !== s.height && (_ = s.width, s.width = s.height, s.height = _)), x.length && (o = RS(o, '<g transform="' + x.join(" ") + '">', "</g>"));
  });
  const a = i.width, n = i.height, l = s.width, c = s.height;
  let h, u;
  a === null ? (u = n === null ? "1em" : n === "auto" ? c : n, h = $u(u, l / c)) : (h = a === "auto" ? l : a, u = n === null ? $u(h, c / l) : n === "auto" ? c : n);
  const d = {}, f = (y, x) => {
    PS(x) || (d[y] = x.toString());
  };
  f("width", h), f("height", u);
  const m = [
    s.left,
    s.top,
    l,
    c
  ];
  return d.viewBox = m.join(" "), {
    attributes: d,
    viewBox: m,
    body: o
  };
}
const qS = /\sid="(\S+)"/g, Iu = /* @__PURE__ */ new Map();
function WS(e) {
  e = e.replace(/[0-9]+$/, "") || "a";
  const t = Iu.get(e) || 0;
  return Iu.set(e, t + 1), t ? `${e}${t}` : e;
}
function zS(e) {
  const t = [];
  let r;
  for (; r = qS.exec(e); ) t.push(r[1]);
  if (!t.length) return e;
  const i = "suffix" + (Math.random() * 16777216 | Date.now()).toString(16);
  return t.forEach((s) => {
    const o = WS(s), a = s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    e = e.replace(new RegExp('([#;"])(' + a + ')([")]|\\.[a-z])', "g"), "$1" + o + i + "$3");
  }), e = e.replace(new RegExp(i, "g"), ""), e;
}
function HS(e, t) {
  let r = e.indexOf("xlink:") === -1 ? "" : ' xmlns:xlink="http://www.w3.org/1999/xlink"';
  for (const i in t) r += " " + i + '="' + t[i] + '"';
  return '<svg xmlns="http://www.w3.org/2000/svg"' + r + ">" + e + "</svg>";
}
var YS = {
  body: '<g><rect width="80" height="80" style="fill: #087ebf; stroke-width: 0px;"/><text transform="translate(21.16 64.67)" style="fill: #fff; font-family: ArialMT, Arial; font-size: 67.75px;"><tspan x="0" y="0">?</tspan></text></g>',
  height: 80,
  width: 80
}, Bl = /* @__PURE__ */ new Map(), sg = /* @__PURE__ */ new Map(), US = /* @__PURE__ */ p((e) => {
  for (const t of e) {
    if (!t.name)
      throw new Error(
        'Invalid icon loader. Must have a "name" property with non-empty string value.'
      );
    if ($.debug("Registering icon pack:", t.name), "loader" in t)
      sg.set(t.name, t.loader);
    else if ("icons" in t)
      Bl.set(t.name, t.icons);
    else
      throw $.error("Invalid icon loader:", t), new Error('Invalid icon loader. Must have either "icons" or "loader" property.');
  }
}, "registerIconPacks"), og = /* @__PURE__ */ p(async (e, t) => {
  const r = AS(e, !0, t !== void 0);
  if (!r)
    throw new Error(`Invalid icon name: ${e}`);
  const i = r.prefix || t;
  if (!i)
    throw new Error(`Icon name must contain a prefix: ${e}`);
  let s = Bl.get(i);
  if (!s) {
    const a = sg.get(i);
    if (!a)
      throw new Error(`Icon set not found: ${r.prefix}`);
    try {
      s = { ...await a(), prefix: i }, Bl.set(i, s);
    } catch (n) {
      throw $.error(n), new Error(`Failed to load icon set: ${r.prefix}`);
    }
  }
  const o = MS(s, r.name);
  if (!o)
    throw new Error(`Icon not found: ${e}`);
  return o;
}, "getRegisteredIconData"), XS = /* @__PURE__ */ p(async (e) => {
  try {
    return await og(e), !0;
  } catch {
    return !1;
  }
}, "isIconAvailable"), lo = /* @__PURE__ */ p(async (e, t, r) => {
  let i;
  try {
    i = await og(e, t?.fallbackPrefix);
  } catch (a) {
    $.error(a), i = YS;
  }
  const s = NS(i, t), o = HS(zS(s.body), {
    ...s.attributes,
    ...r
  });
  return Pe(o, jt());
}, "getIconSVG"), Bo = {}, se = {}, Du;
function jS() {
  return Du || (Du = 1, Object.defineProperty(se, "__esModule", { value: !0 }), se.BLANK_URL = se.relativeFirstCharacters = se.whitespaceEscapeCharsRegex = se.urlSchemeRegex = se.ctrlCharactersRegex = se.htmlCtrlEntityRegex = se.htmlEntitiesRegex = se.invalidProtocolRegex = void 0, se.invalidProtocolRegex = /^([^\w]*)(javascript|data|vbscript)/im, se.htmlEntitiesRegex = /&#(\w+)(^\w|;)?/g, se.htmlCtrlEntityRegex = /&(newline|tab);/gi, se.ctrlCharactersRegex = /[\u0000-\u001F\u007F-\u009F\u2000-\u200D\uFEFF]/gim, se.urlSchemeRegex = /^.+(:|&colon;)/gim, se.whitespaceEscapeCharsRegex = /(\\|%5[cC])((%(6[eE]|72|74))|[nrt])/g, se.relativeFirstCharacters = [".", "/"], se.BLANK_URL = "about:blank"), se;
}
var Ru;
function GS() {
  if (Ru) return Bo;
  Ru = 1, Object.defineProperty(Bo, "__esModule", { value: !0 }), Bo.sanitizeUrl = o;
  var e = jS();
  function t(a) {
    return e.relativeFirstCharacters.indexOf(a[0]) > -1;
  }
  function r(a) {
    var n = a.replace(e.ctrlCharactersRegex, "");
    return n.replace(e.htmlEntitiesRegex, function(l, c) {
      return String.fromCharCode(c);
    });
  }
  function i(a) {
    return URL.canParse(a);
  }
  function s(a) {
    try {
      return decodeURIComponent(a);
    } catch {
      return a;
    }
  }
  function o(a) {
    if (!a)
      return e.BLANK_URL;
    var n, l = s(a.trim());
    do
      l = r(l).replace(e.htmlCtrlEntityRegex, "").replace(e.ctrlCharactersRegex, "").replace(e.whitespaceEscapeCharsRegex, "").trim(), l = s(l), n = l.match(e.ctrlCharactersRegex) || l.match(e.htmlEntitiesRegex) || l.match(e.htmlCtrlEntityRegex) || l.match(e.whitespaceEscapeCharsRegex);
    while (n && n.length > 0);
    var c = l;
    if (!c)
      return e.BLANK_URL;
    if (t(c))
      return c;
    var h = c.trimStart(), u = h.match(e.urlSchemeRegex);
    if (!u)
      return c;
    var d = u[0].toLowerCase().trim();
    if (e.invalidProtocolRegex.test(d))
      return e.BLANK_URL;
    var f = h.replace(/\\/g, "/");
    if (d === "mailto:" || d.includes("://"))
      return f;
    if (d === "http:" || d === "https:") {
      if (!i(f))
        return e.BLANK_URL;
      var m = new URL(f);
      return m.protocol = m.protocol.toLowerCase(), m.hostname = m.hostname.toLowerCase(), m.toString();
    }
    return f;
  }
  return Bo;
}
var VS = GS();
function bn(e) {
  if (typeof e != "object" || e == null) return !1;
  if (Object.getPrototypeOf(e) === null) return !0;
  if (Object.prototype.toString.call(e) !== "[object Object]") {
    const r = e[Symbol.toStringTag];
    return r == null || !Object.getOwnPropertyDescriptor(e, Symbol.toStringTag)?.writable ? !1 : e.toString() === `[object ${r}]`;
  }
  let t = e;
  for (; Object.getPrototypeOf(t) !== null; ) t = Object.getPrototypeOf(t);
  return Object.getPrototypeOf(e) === t;
}
function KS() {
}
function ag(e) {
  return Object.getOwnPropertySymbols(e).filter((t) => Object.prototype.propertyIsEnumerable.call(e, t));
}
function kh(e) {
  return e == null ? e === void 0 ? "[object Undefined]" : "[object Null]" : Object.prototype.toString.call(e);
}
const ZS = "[object RegExp]", ng = "[object String]", lg = "[object Number]", hg = "[object Boolean]", cg = "[object Arguments]", QS = "[object Symbol]", JS = "[object Date]", tT = "[object Map]", eT = "[object Set]", rT = "[object Array]", iT = "[object ArrayBuffer]", sT = "[object Object]", oT = "[object DataView]", aT = "[object Uint8Array]", nT = "[object Uint8ClampedArray]", lT = "[object Uint16Array]", hT = "[object Uint32Array]", cT = "[object Int8Array]", uT = "[object Int16Array]", dT = "[object Int32Array]", fT = "[object Float32Array]", pT = "[object Float64Array]", Pu = typeof globalThis == "object" && globalThis || typeof window == "object" && window || typeof self == "object" && self || typeof global == "object" && global || /* @__PURE__ */ (function() {
  return this;
})();
function wh(e) {
  return typeof Pu.Buffer < "u" && Pu.Buffer.isBuffer(e);
}
function gT(e) {
  return Number.isSafeInteger(e) && e >= 0;
}
function ug(e) {
  return e != null && typeof e != "function" && gT(e.length);
}
function mT(e) {
  return e === "__proto__";
}
function Sh(e) {
  return e == null || typeof e != "object" && typeof e != "function";
}
function Th(e) {
  return ArrayBuffer.isView(e) && !(e instanceof DataView);
}
function yT(e, t) {
  return Oi(e, void 0, e, /* @__PURE__ */ new Map(), t);
}
function Oi(e, t, r, i = /* @__PURE__ */ new Map(), s = void 0) {
  const o = s?.(e, t, r, i);
  if (o !== void 0) return o;
  if (Sh(e)) return e;
  if (i.has(e)) return i.get(e);
  if (Array.isArray(e)) {
    const a = new Array(e.length);
    i.set(e, a);
    for (let n = 0; n < e.length; n++) a[n] = Oi(e[n], n, r, i, s);
    return Object.hasOwn(e, "index") && (a.index = e.index), Object.hasOwn(e, "input") && (a.input = e.input), a;
  }
  if (e instanceof Date) return new Date(e.getTime());
  if (e instanceof RegExp) {
    const a = new RegExp(e.source, e.flags);
    return a.lastIndex = e.lastIndex, a;
  }
  if (e instanceof Map) {
    const a = /* @__PURE__ */ new Map();
    i.set(e, a);
    for (const [n, l] of e) a.set(n, Oi(l, n, r, i, s));
    return a;
  }
  if (e instanceof Set) {
    const a = /* @__PURE__ */ new Set();
    i.set(e, a);
    for (const n of e) a.add(Oi(n, void 0, r, i, s));
    return a;
  }
  if (wh(e)) return e.subarray();
  if (Th(e)) {
    const a = new (Object.getPrototypeOf(e)).constructor(e.length);
    i.set(e, a);
    for (let n = 0; n < e.length; n++) a[n] = Oi(e[n], n, r, i, s);
    return a;
  }
  if (e instanceof ArrayBuffer || typeof SharedArrayBuffer < "u" && e instanceof SharedArrayBuffer) return e.slice(0);
  if (e instanceof DataView) {
    const a = new DataView(e.buffer.slice(0), e.byteOffset, e.byteLength);
    return i.set(e, a), Ue(a, e, r, i, s), a;
  }
  if (typeof File < "u" && e instanceof File) {
    const a = new File([e], e.name, { type: e.type });
    return i.set(e, a), Ue(a, e, r, i, s), a;
  }
  if (typeof Blob < "u" && e instanceof Blob) {
    const a = new Blob([e], { type: e.type });
    return i.set(e, a), Ue(a, e, r, i, s), a;
  }
  if (e instanceof Error) {
    const a = structuredClone(e);
    return i.set(e, a), a.message = e.message, a.name = e.name, a.stack = e.stack, a.cause = e.cause, a.constructor = e.constructor, Ue(a, e, r, i, s), a;
  }
  if (e instanceof Boolean) {
    const a = new Boolean(e.valueOf());
    return i.set(e, a), Ue(a, e, r, i, s), a;
  }
  if (e instanceof Number) {
    const a = new Number(e.valueOf());
    return i.set(e, a), Ue(a, e, r, i, s), a;
  }
  if (e instanceof String) {
    const a = new String(e.valueOf());
    return i.set(e, a), Ue(a, e, r, i, s), a;
  }
  if (typeof e == "object" && xT(e)) {
    const a = Object.create(Object.getPrototypeOf(e));
    return i.set(e, a), Ue(a, e, r, i, s), a;
  }
  return e;
}
function Ue(e, t, r = e, i, s) {
  const o = [...Object.keys(t), ...ag(t)];
  for (let a = 0; a < o.length; a++) {
    const n = o[a], l = Object.getOwnPropertyDescriptor(e, n);
    (l == null || l.writable) && (e[n] = Oi(t[n], n, r, i, s));
  }
}
function xT(e) {
  switch (kh(e)) {
    case cg:
    case rT:
    case iT:
    case oT:
    case hg:
    case JS:
    case fT:
    case pT:
    case cT:
    case uT:
    case dT:
    case tT:
    case lg:
    case sT:
    case ZS:
    case eT:
    case ng:
    case QS:
    case aT:
    case nT:
    case lT:
    case hT:
      return !0;
    default:
      return !1;
  }
}
function CT(e, t) {
  return yT(e, (r, i, s, o) => {
    if (typeof e == "object") {
      if (kh(e) === "[object Object]" && typeof e.constructor != "function") {
        const a = {};
        return o.set(e, a), Ue(a, e, s, o), a;
      }
      switch (Object.prototype.toString.call(e)) {
        case lg:
        case ng:
        case hg: {
          const a = new e.constructor(e?.valueOf());
          return Ue(a, e), a;
        }
        case cg: {
          const a = {};
          return Ue(a, e), a.length = e.length, a[Symbol.iterator] = e[Symbol.iterator], a;
        }
        default:
          return;
      }
    }
  });
}
function Nu(e) {
  return CT(e);
}
function vl(e) {
  return e !== null && typeof e == "object" && kh(e) === "[object Arguments]";
}
function Ll(e) {
  return typeof e == "object" && e !== null;
}
function bT(e) {
  return Ll(e) && ug(e);
}
function Wo(e) {
  return Th(e);
}
function kT(e) {
  const t = e?.constructor;
  return e === (typeof t == "function" ? t.prototype : Object.prototype);
}
function ho(e, t) {
  if (typeof e != "function" || t != null && typeof t != "function") throw new TypeError("Expected a function");
  const r = function(...i) {
    const s = t ? t.apply(this, i) : i[0], o = r.cache;
    if (o.has(s)) return o.get(s);
    const a = e.apply(this, i);
    return r.cache = o.set(s, a) || o, a;
  };
  return r.cache = new (ho.Cache || Map)(), r;
}
ho.Cache = Map;
function wT(e) {
  if (Sh(e)) return e;
  if (Array.isArray(e) || Th(e) || e instanceof ArrayBuffer || typeof SharedArrayBuffer < "u" && e instanceof SharedArrayBuffer) return e.slice(0);
  const t = Object.getPrototypeOf(e);
  if (t == null) return Object.assign(Object.create(t), e);
  const r = t.constructor;
  if (e instanceof Date || e instanceof Map || e instanceof Set) return new r(e);
  if (e instanceof RegExp) {
    const i = new r(e);
    return i.lastIndex = e.lastIndex, i;
  }
  if (e instanceof DataView) return new r(e.buffer.slice(0));
  if (e instanceof Error) {
    let i;
    return e instanceof AggregateError ? i = new r(e.errors, e.message, { cause: e.cause }) : i = new r(e.message, { cause: e.cause }), i.stack = e.stack, Object.assign(i, e), i;
  }
  return typeof File < "u" && e instanceof File ? new r([e], e.name, {
    type: e.type,
    lastModified: e.lastModified
  }) : typeof e == "object" ? Object.assign(Object.create(t), e) : e;
}
function ST(e, ...t) {
  const r = t.slice(0, -1), i = t[t.length - 1];
  let s = e;
  for (let o = 0; o < r.length; o++) {
    const a = r[o];
    s = zo(s, a, i, /* @__PURE__ */ new Map());
  }
  return s;
}
function zo(e, t, r, i) {
  if (Sh(e) && (e = Object(e)), t == null || typeof t != "object") return e;
  if (i.has(t)) return wT(i.get(t));
  if (i.set(t, e), Array.isArray(t)) {
    t = t.slice();
    for (let o = 0; o < t.length; o++) o in t || (t[o] = void 0);
  }
  const s = [...Object.keys(t), ...ag(t)];
  for (let o = 0; o < s.length; o++) {
    const a = s[o];
    if (mT(a)) continue;
    let n = t[a], l = e[a];
    if (vl(n) && (n = { ...n }), vl(l) && (l = { ...l }), wh(n) && (n = Nu(n)), Array.isArray(n)) if (Array.isArray(l)) {
      const h = [], u = Reflect.ownKeys(l);
      for (let d = 0; d < u.length; d++) {
        const f = u[d];
        h[f] = l[f];
      }
      l = h;
    } else if (bT(l)) {
      const h = [];
      for (let u = 0; u < l.length; u++) h[u] = l[u];
      l = h;
    } else l = [];
    const c = r(l, n, a, e, t, i);
    c !== void 0 ? e[a] = c : Array.isArray(n) || Ll(l) && Ll(n) && (bn(l) || bn(n) || Wo(l) || Wo(n)) ? e[a] = zo(l, n, r, i) : l == null && bn(n) ? e[a] = zo({}, n, r, i) : l == null && Wo(n) ? e[a] = Nu(n) : (l === void 0 || n !== void 0) && (e[a] = n);
  }
  return e;
}
function TT(e, ...t) {
  return ST(e, ...t, KS);
}
function qu(e) {
  if (e == null) return !0;
  if (ug(e))
    return typeof e.splice != "function" && typeof e != "string" && !wh(e) && !Wo(e) && !vl(e) ? !1 : e.length === 0;
  if (typeof e == "object" || typeof e == "function") {
    if (e instanceof Map || e instanceof Set) return e.size === 0;
    const t = Object.keys(e);
    return kT(e) ? t.filter((r) => r !== "constructor").length === 0 : t.length === 0;
  }
  return !0;
}
var _T = "​", BT = {
  curveBasis: _l,
  curveBasisClosed: dS,
  curveBasisOpen: fS,
  curveBumpX: Dp,
  curveBumpY: Rp,
  curveBundle: pS,
  curveCardinalClosed: gS,
  curveCardinalOpen: mS,
  curveCardinal: Wp,
  curveCatmullRomClosed: yS,
  curveCatmullRomOpen: xS,
  curveCatmullRom: Hp,
  curveLinear: Hs,
  curveLinearClosed: CS,
  curveMonotoneX: Vp,
  curveMonotoneY: Kp,
  curveNatural: Qp,
  curveStep: Jp,
  curveStepAfter: eg,
  curveStepBefore: tg
}, vT = /\s*(?:(\w+)(?=:):|(\w+))\s*(?:(\w+)|((?:(?!}%{2}).|\r?\n)*))?\s*(?:}%{2})?/gi, LT = /* @__PURE__ */ p(function(e, t) {
  const r = dg(e, /(?:init\b)|(?:initialize\b)/);
  let i = {};
  if (Array.isArray(r)) {
    const a = r.map((n) => n.args);
    Vo(a), i = ae(i, [...a]);
  } else
    i = r.args;
  if (!i)
    return;
  let s = ih(e, t);
  const o = "config";
  return i[o] !== void 0 && (s === "flowchart-v2" && (s = "flowchart"), i[s] = i[o], delete i[o]), i;
}, "detectInit"), dg = /* @__PURE__ */ p(function(e, t = null) {
  try {
    const r = new RegExp(
      `[%]{2}(?![{]${vT.source})(?=[}][%]{2}).*
`,
      "ig"
    );
    e = e.trim().replace(r, "").replace(/'/gm, '"'), $.debug(
      `Detecting diagram directive${t !== null ? " type:" + t : ""} based on the text:${e}`
    );
    let i;
    const s = [];
    for (; (i = zs.exec(e)) !== null; )
      if (i.index === zs.lastIndex && zs.lastIndex++, i && !t || t && i[1]?.match(t) || t && i[2]?.match(t)) {
        const o = i[1] ? i[1] : i[2], a = i[3] ? i[3].trim() : i[4] ? JSON.parse(i[4].trim()) : null;
        s.push({ type: o, args: a });
      }
    return s.length === 0 ? { type: e, args: null } : s.length === 1 ? s[0] : s;
  } catch (r) {
    return $.error(
      `ERROR: ${r.message} - Unable to parse directive type: '${t}' based on the text: '${e}'`
    ), { type: void 0, args: null };
  }
}, "detectDirective"), AT = /* @__PURE__ */ p(function(e) {
  return e.replace(zs, "");
}, "removeDirectives"), ET = /* @__PURE__ */ p(function(e, t) {
  for (const [r, i] of t.entries())
    if (i.match(e))
      return r;
  return -1;
}, "isSubstringInArray");
function _h(e, t) {
  if (!e)
    return t;
  const r = `curve${e.charAt(0).toUpperCase() + e.slice(1)}`;
  return BT[r] ?? t;
}
p(_h, "interpolateToCurve");
function fg(e, t) {
  const r = e.trim();
  if (r)
    return t.securityLevel !== "loose" ? VS.sanitizeUrl(r) : r;
}
p(fg, "formatUrl");
var FT = /* @__PURE__ */ p((e, ...t) => {
  const r = e.split("."), i = r.length - 1, s = r[i];
  let o = window;
  for (let a = 0; a < i; a++)
    if (o = o[r[a]], !o) {
      $.error(`Function name: ${e} not found in window`);
      return;
    }
  o[s](...t);
}, "runFunc");
function Bh(e, t) {
  return !e || !t ? 0 : Math.sqrt(Math.pow(t.x - e.x, 2) + Math.pow(t.y - e.y, 2));
}
p(Bh, "distance");
function pg(e) {
  let t, r = 0;
  e.forEach((s) => {
    r += Bh(s, t), t = s;
  });
  const i = r / 2;
  return vh(e, i);
}
p(pg, "traverseEdge");
function gg(e) {
  return e.length === 1 ? e[0] : pg(e);
}
p(gg, "calcLabelPosition");
var Wu = /* @__PURE__ */ p((e, t = 2) => {
  const r = Math.pow(10, t);
  return Math.round(e * r) / r;
}, "roundNumber"), vh = /* @__PURE__ */ p((e, t) => {
  let r, i = t;
  for (const s of e) {
    if (r) {
      const o = Bh(s, r);
      if (o === 0)
        return r;
      if (o < i)
        i -= o;
      else {
        const a = i / o;
        if (a <= 0)
          return r;
        if (a >= 1)
          return { x: s.x, y: s.y };
        if (a > 0 && a < 1)
          return {
            x: Wu((1 - a) * r.x + a * s.x, 5),
            y: Wu((1 - a) * r.y + a * s.y, 5)
          };
      }
    }
    r = s;
  }
  throw new Error("Could not find a suitable point for the given distance");
}, "calculatePoint"), MT = /* @__PURE__ */ p((e, t, r) => {
  $.info(`our points ${JSON.stringify(t)}`), t[0] !== r && (t = t.reverse());
  const s = vh(t, 25), o = e ? 10 : 5, a = Math.atan2(t[0].y - s.y, t[0].x - s.x), n = { x: 0, y: 0 };
  return n.x = Math.sin(a) * o + (t[0].x + s.x) / 2, n.y = -Math.cos(a) * o + (t[0].y + s.y) / 2, n;
}, "calcCardinalityPosition");
function mg(e, t, r) {
  const i = structuredClone(r);
  $.info("our points", i), t !== "start_left" && t !== "start_right" && i.reverse();
  const s = 25 + e, o = vh(i, s), a = 10 + e * 0.5, n = Math.atan2(i[0].y - o.y, i[0].x - o.x), l = { x: 0, y: 0 };
  return t === "start_left" ? (l.x = Math.sin(n + Math.PI) * a + (i[0].x + o.x) / 2, l.y = -Math.cos(n + Math.PI) * a + (i[0].y + o.y) / 2) : t === "end_right" ? (l.x = Math.sin(n - Math.PI) * a + (i[0].x + o.x) / 2 - 5, l.y = -Math.cos(n - Math.PI) * a + (i[0].y + o.y) / 2 - 5) : t === "end_left" ? (l.x = Math.sin(n) * a + (i[0].x + o.x) / 2 - 5, l.y = -Math.cos(n) * a + (i[0].y + o.y) / 2 - 5) : (l.x = Math.sin(n) * a + (i[0].x + o.x) / 2, l.y = -Math.cos(n) * a + (i[0].y + o.y) / 2), l;
}
p(mg, "calcTerminalLabelPosition");
function yg(e) {
  let t = "", r = "";
  for (const i of e)
    i !== void 0 && (i.startsWith("color:") || i.startsWith("text-align:") ? r = r + i + ";" : t = t + i + ";");
  return { style: t, labelStyle: r };
}
p(yg, "getStylesFromArray");
var zu = 0, OT = /* @__PURE__ */ p(() => (zu++, "id-" + Math.random().toString(36).substr(2, 12) + "-" + zu), "generateId");
function xg(e) {
  let t = "";
  const r = "0123456789abcdef", i = r.length;
  for (let s = 0; s < e; s++)
    t += r.charAt(Math.floor(Math.random() * i));
  return t;
}
p(xg, "makeRandomHex");
var $T = /* @__PURE__ */ p((e) => xg(e.length), "random"), IT = /* @__PURE__ */ p(function() {
  return {
    x: 0,
    y: 0,
    fill: void 0,
    anchor: "start",
    style: "#666",
    width: 100,
    height: 100,
    textMargin: 0,
    rx: 0,
    ry: 0,
    valign: void 0,
    text: ""
  };
}, "getTextObj"), DT = /* @__PURE__ */ p(function(e, t) {
  const r = t.text.replace(oo.lineBreakRegex, " "), [, i] = Aa(t.fontSize), s = e.append("text");
  s.attr("x", t.x), s.attr("y", t.y), s.style("text-anchor", t.anchor), s.style("font-family", t.fontFamily), s.style("font-size", i), s.style("font-weight", t.fontWeight), s.attr("fill", t.fill), t.class !== void 0 && s.attr("class", t.class);
  const o = s.append("tspan");
  return o.attr("x", t.x + t.textMargin * 2), o.attr("fill", t.fill), o.text(r), s;
}, "drawSimpleText"), RT = ho(
  (e, t, r) => {
    if (!e || (r = Object.assign(
      { fontSize: 12, fontWeight: 400, fontFamily: "Arial", joinWith: "<br/>" },
      r
    ), oo.lineBreakRegex.test(e)))
      return e;
    const i = e.split(" ").filter(Boolean), s = [];
    let o = "";
    return i.forEach((a, n) => {
      const l = Br(`${a} `, r), c = Br(o, r);
      if (l > t) {
        const { hyphenatedStrings: d, remainingWord: f } = PT(a, t, "-", r);
        s.push(o, ...d), o = f;
      } else c + l >= t ? (s.push(o), o = a) : o = [o, a].filter(Boolean).join(" ");
      n + 1 === i.length && s.push(o);
    }), s.filter((a) => a !== "").join(r.joinWith);
  },
  (e, t, r) => `${e}${t}${r.fontSize}${r.fontWeight}${r.fontFamily}${r.joinWith}`
), PT = ho(
  (e, t, r = "-", i) => {
    i = Object.assign(
      { fontSize: 12, fontWeight: 400, fontFamily: "Arial", margin: 0 },
      i
    );
    const s = [...e], o = [];
    let a = "";
    return s.forEach((n, l) => {
      const c = `${a}${n}`;
      if (Br(c, i) >= t) {
        const u = l + 1, d = s.length === u, f = `${c}${r}`;
        o.push(d ? c : f), a = "";
      } else
        a = c;
    }), { hyphenatedStrings: o, remainingWord: a };
  },
  (e, t, r = "-", i) => `${e}${t}${r}${i.fontSize}${i.fontWeight}${i.fontFamily}`
);
function Cg(e, t) {
  return Lh(e, t).height;
}
p(Cg, "calculateTextHeight");
function Br(e, t) {
  return Lh(e, t).width;
}
p(Br, "calculateTextWidth");
var Lh = ho(
  (e, t) => {
    const { fontSize: r = 12, fontFamily: i = "Arial", fontWeight: s = 400 } = t;
    if (!e)
      return { width: 0, height: 0 };
    const [, o] = Aa(r), a = ["sans-serif", i], n = e.split(oo.lineBreakRegex), l = [], c = vt("body");
    if (!c.remove)
      return { width: 0, height: 0, lineHeight: 0 };
    const h = c.append("svg");
    for (const d of a) {
      let f = 0;
      const m = { width: 0, height: 0, lineHeight: 0 };
      for (const y of n) {
        const x = IT();
        x.text = y || _T;
        const C = DT(h, x).style("font-size", o).style("font-weight", s).style("font-family", d), b = (C._groups || C)[0][0].getBBox();
        if (b.width === 0 && b.height === 0)
          throw new Error("svg element not in render tree");
        m.width = Math.round(Math.max(m.width, b.width)), f = Math.round(b.height), m.height += f, m.lineHeight = Math.round(Math.max(m.lineHeight, f));
      }
      l.push(m);
    }
    h.remove();
    const u = isNaN(l[1].height) || isNaN(l[1].width) || isNaN(l[1].lineHeight) || l[0].height > l[1].height && l[0].width > l[1].width && l[0].lineHeight > l[1].lineHeight ? 0 : 1;
    return l[u];
  },
  (e, t) => `${e}${t.fontSize}${t.fontWeight}${t.fontFamily}`
), Zi, NT = (Zi = class {
  constructor(t = !1, r) {
    this.count = 0, this.count = r ? r.length : 0, this.next = t ? () => this.count++ : () => Date.now();
  }
}, p(Zi, "InitIDGenerator"), Zi), vo, qT = /* @__PURE__ */ p(function(e) {
  return vo = vo || document.createElement("div"), e = escape(e).replace(/%26/g, "&").replace(/%23/g, "#").replace(/%3B/g, ";"), vo.innerHTML = e, unescape(vo.textContent);
}, "entityDecode");
function Ah(e) {
  return "str" in e;
}
p(Ah, "isDetailedError");
var WT = /* @__PURE__ */ p((e, t, r, i) => {
  if (!i)
    return;
  const s = e.node()?.getBBox();
  s && e.append("text").text(i).attr("text-anchor", "middle").attr("x", s.x + s.width / 2).attr("y", -r).attr("class", t);
}, "insertTitle"), Aa = /* @__PURE__ */ p((e) => {
  if (typeof e == "number")
    return [e, e + "px"];
  const t = parseInt(e ?? "", 10);
  return Number.isNaN(t) ? [void 0, void 0] : e === String(t) ? [t, e + "px"] : [t, e];
}, "parseFontSize");
function Eh(e, t) {
  return TT({}, e, t);
}
p(Eh, "cleanAndMerge");
var me = {
  assignWithDepth: ae,
  wrapLabel: RT,
  calculateTextHeight: Cg,
  calculateTextWidth: Br,
  calculateTextDimensions: Lh,
  cleanAndMerge: Eh,
  detectInit: LT,
  detectDirective: dg,
  isSubstringInArray: ET,
  interpolateToCurve: _h,
  calcLabelPosition: gg,
  calcCardinalityPosition: MT,
  calcTerminalLabelPosition: mg,
  formatUrl: fg,
  getStylesFromArray: yg,
  generateId: OT,
  random: $T,
  runFunc: FT,
  entityDecode: qT,
  insertTitle: WT,
  isLabelCoordinateInPath: bg,
  parseFontSize: Aa,
  InitIDGenerator: NT
}, zT = /* @__PURE__ */ p(function(e) {
  let t = e;
  return t = t.replace(/style.*:\S*#.*;/g, function(r) {
    return r.substring(0, r.length - 1);
  }), t = t.replace(/classDef.*:\S*#.*;/g, function(r) {
    return r.substring(0, r.length - 1);
  }), t = t.replace(/#\w+;/g, function(r) {
    const i = r.substring(1, r.length - 1);
    return /^\+?\d+$/.test(i) ? "ﬂ°°" + i + "¶ß" : "ﬂ°" + i + "¶ß";
  }), t;
}, "encodeEntities"), Ur = /* @__PURE__ */ p(function(e) {
  return e.replace(/ﬂ°°/g, "&#").replace(/ﬂ°/g, "&").replace(/¶ß/g, ";");
}, "decodeEntities"), jM = /* @__PURE__ */ p((e, t, {
  counter: r = 0,
  prefix: i,
  suffix: s
}, o) => o || `${i ? `${i}_` : ""}${e}_${t}_${r}${s ? `_${s}` : ""}`, "getEdgeId");
function re(e) {
  return e ?? null;
}
p(re, "handleUndefinedAttr");
function bg(e, t) {
  const r = Math.round(e.x), i = Math.round(e.y), s = t.replace(
    /(\d+\.\d+)/g,
    (o) => Math.round(parseFloat(o)).toString()
  );
  return s.includes(r.toString()) || s.includes(i.toString());
}
p(bg, "isLabelCoordinateInPath");
var Ho = { exports: {} }, Hu = Ho.exports, Yu;
function HT() {
  return Yu || (Yu = 1, (function(e) {
    (function(t) {
      var r = function() {
      }, i = t.requestAnimationFrame || t.webkitRequestAnimationFrame || t.mozRequestAnimationFrame || t.msRequestAnimationFrame || function(h) {
        return setTimeout(h, 16);
      };
      function s() {
        var h = this;
        h.reads = [], h.writes = [], h.raf = i.bind(t);
      }
      s.prototype = {
        constructor: s,
        /**
         * We run this inside a try catch
         * so that if any jobs error, we
         * are able to recover and continue
         * to flush the batch until it's empty.
         *
         * @param {Array} tasks
         */
        runTasks: function(h) {
          for (var u; u = h.shift(); ) u();
        },
        /**
         * Adds a job to the read batch and
         * schedules a new frame if need be.
         *
         * @param  {Function} fn
         * @param  {Object} ctx the context to be bound to `fn` (optional).
         * @public
         */
        measure: function(h, u) {
          var d = u ? h.bind(u) : h;
          return this.reads.push(d), o(this), d;
        },
        /**
         * Adds a job to the
         * write batch and schedules
         * a new frame if need be.
         *
         * @param  {Function} fn
         * @param  {Object} ctx the context to be bound to `fn` (optional).
         * @public
         */
        mutate: function(h, u) {
          var d = u ? h.bind(u) : h;
          return this.writes.push(d), o(this), d;
        },
        /**
         * Clears a scheduled 'read' or 'write' task.
         *
         * @param {Object} task
         * @return {Boolean} success
         * @public
         */
        clear: function(h) {
          return n(this.reads, h) || n(this.writes, h);
        },
        /**
         * Extend this FastDom with some
         * custom functionality.
         *
         * Because fastdom must *always* be a
         * singleton, we're actually extending
         * the fastdom instance. This means tasks
         * scheduled by an extension still enter
         * fastdom's global task queue.
         *
         * The 'super' instance can be accessed
         * from `this.fastdom`.
         *
         * @example
         *
         * var myFastdom = fastdom.extend({
         *   initialize: function() {
         *     // runs on creation
         *   },
         *
         *   // override a method
         *   measure: function(fn) {
         *     // do extra stuff ...
         *
         *     // then call the original
         *     return this.fastdom.measure(fn);
         *   },
         *
         *   ...
         * });
         *
         * @param  {Object} props  properties to mixin
         * @return {FastDom}
         */
        extend: function(h) {
          if (typeof h != "object") throw new Error("expected object");
          var u = Object.create(this);
          return l(u, h), u.fastdom = this, u.initialize && u.initialize(), u;
        },
        // override this with a function
        // to prevent Errors in console
        // when tasks throw
        catch: null
      };
      function o(h) {
        h.scheduled || (h.scheduled = !0, h.raf(a.bind(null, h)));
      }
      function a(h) {
        var u = h.writes, d = h.reads, f;
        try {
          r("flushing reads", d.length), h.runTasks(d), r("flushing writes", u.length), h.runTasks(u);
        } catch (m) {
          f = m;
        }
        if (h.scheduled = !1, (d.length || u.length) && o(h), f)
          if (r("task errored", f.message), h.catch) h.catch(f);
          else throw f;
      }
      function n(h, u) {
        var d = h.indexOf(u);
        return !!~d && !!h.splice(d, 1);
      }
      function l(h, u) {
        for (var d in u)
          u.hasOwnProperty(d) && (h[d] = u[d]);
      }
      var c = t.fastdom = t.fastdom || new s();
      e.exports = c;
    })(typeof window < "u" ? window : typeof Hu < "u" ? Hu : globalThis);
  })(Ho)), Ho.exports;
}
var YT = HT();
const UT = /* @__PURE__ */ Zl(YT);
var kn = { exports: {} }, Uu;
function XT() {
  return Uu || (Uu = 1, (function(e) {
    (function() {
      var t = {
        initialize: function() {
          this._tasks = /* @__PURE__ */ new Map();
        },
        mutate: function(i, s) {
          return r(this, "mutate", i, s);
        },
        measure: function(i, s) {
          return r(this, "measure", i, s);
        },
        clear: function(i) {
          var s = this._tasks, o = s.get(i);
          this.fastdom.clear(o), s.delete(i);
        }
      };
      function r(i, s, o, a) {
        var n = i._tasks, l = i.fastdom, c, h = new Promise(function(u, d) {
          c = l[s](function() {
            n.delete(h);
            try {
              u(a ? o.call(a) : o());
            } catch (f) {
              d(f);
            }
          }, a);
        });
        return n.set(h, c), h;
      }
      e.exports = t;
    })();
  })(kn)), kn.exports;
}
var jT = XT();
const GT = /* @__PURE__ */ Zl(jT);
function Fh() {
  return { async: !1, breaks: !1, extensions: null, gfm: !0, hooks: null, pedantic: !1, renderer: null, silent: !1, tokenizer: null, walkTokens: null };
}
var yi = Fh();
function kg(e) {
  yi = e;
}
var Ys = { exec: () => null };
function Wt(e, t = "") {
  let r = typeof e == "string" ? e : e.source, i = { replace: (s, o) => {
    let a = typeof o == "string" ? o : o.source;
    return a = a.replace(ke.caret, "$1"), r = r.replace(s, a), i;
  }, getRegex: () => new RegExp(r, t) };
  return i;
}
var VT = (() => {
  try {
    return !!new RegExp("(?<=1)(?<!1)");
  } catch {
    return !1;
  }
})(), ke = { codeRemoveIndent: /^(?: {1,4}| {0,3}\t)/gm, outputLinkReplace: /\\([\[\]])/g, indentCodeCompensation: /^(\s+)(?:```)/, beginningSpace: /^\s+/, endingHash: /#$/, startingSpaceChar: /^ /, endingSpaceChar: / $/, nonSpaceChar: /[^ ]/, newLineCharGlobal: /\n/g, tabCharGlobal: /\t/g, multipleSpaceGlobal: /\s+/g, blankLine: /^[ \t]*$/, doubleBlankLine: /\n[ \t]*\n[ \t]*$/, blockquoteStart: /^ {0,3}>/, blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g, blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm, listReplaceTabs: /^\t+/, listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g, listIsTask: /^\[[ xX]\] /, listReplaceTask: /^\[[ xX]\] +/, anyLine: /\n.*\n/, hrefBrackets: /^<(.*)>$/, tableDelimiter: /[:|]/, tableAlignChars: /^\||\| *$/g, tableRowBlankLine: /\n[ \t]*$/, tableAlignRight: /^ *-+: *$/, tableAlignCenter: /^ *:-+: *$/, tableAlignLeft: /^ *:-+ *$/, startATag: /^<a /i, endATag: /^<\/a>/i, startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i, endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i, startAngleBracket: /^</, endAngleBracket: />$/, pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/, unicodeAlphaNumeric: /[\p{L}\p{N}]/u, escapeTest: /[&<>"']/, escapeReplace: /[&<>"']/g, escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/, escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g, unescapeTest: /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig, caret: /(^|[^\[])\^/g, percentDecode: /%25/g, findPipe: /\|/g, splitPipe: / \|/, slashPipe: /\\\|/g, carriageReturn: /\r\n|\r/g, spaceLine: /^ +$/gm, notSpaceStart: /^\S*/, endingNewline: /\n$/, listItemRegex: (e) => new RegExp(`^( {0,3}${e})((?:[	 ][^\\n]*)?(?:\\n|$))`), nextBulletRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`), hrRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`), fencesBeginRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}(?:\`\`\`|~~~)`), headingBeginRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}#`), htmlBeginRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}<(?:[a-z].*>|!--)`, "i") }, KT = /^(?:[ \t]*(?:\n|$))+/, ZT = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, QT = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, co = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, JT = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, Mh = /(?:[*+-]|\d{1,9}[.)])/, wg = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/, Sg = Wt(wg).replace(/bull/g, Mh).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex(), t_ = Wt(wg).replace(/bull/g, Mh).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(), Oh = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/, e_ = /^[^\n]+/, $h = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/, r_ = Wt(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", $h).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), i_ = Wt(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, Mh).getRegex(), Ea = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", Ih = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, s_ = Wt("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))", "i").replace("comment", Ih).replace("tag", Ea).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), Tg = Wt(Oh).replace("hr", co).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Ea).getRegex(), o_ = Wt(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", Tg).getRegex(), Dh = { blockquote: o_, code: ZT, def: r_, fences: QT, heading: JT, hr: co, html: s_, lheading: Sg, list: i_, newline: KT, paragraph: Tg, table: Ys, text: e_ }, Xu = Wt("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", co).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Ea).getRegex(), a_ = { ...Dh, lheading: t_, table: Xu, paragraph: Wt(Oh).replace("hr", co).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", Xu).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Ea).getRegex() }, n_ = { ...Dh, html: Wt(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", Ih).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(), def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/, heading: /^(#{1,6})(.*)(?:\n+|$)/, fences: Ys, lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/, paragraph: Wt(Oh).replace("hr", co).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", Sg).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex() }, l_ = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, h_ = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, _g = /^( {2,}|\\)\n(?!\s*$)/, c_ = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, Fa = /[\p{P}\p{S}]/u, Rh = /[\s\p{P}\p{S}]/u, Bg = /[^\s\p{P}\p{S}]/u, u_ = Wt(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, Rh).getRegex(), vg = /(?!~)[\p{P}\p{S}]/u, d_ = /(?!~)[\s\p{P}\p{S}]/u, f_ = /(?:[^\s\p{P}\p{S}]|~)/u, p_ = Wt(/link|precode-code|html/, "g").replace("link", /\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-", VT ? "(?<!`)()" : "(^^|[^`])").replace("code", /(?<b>`+)[^`]+\k<b>(?!`)/).replace("html", /<(?! )[^<>]*?>/).getRegex(), Lg = /^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/, g_ = Wt(Lg, "u").replace(/punct/g, Fa).getRegex(), m_ = Wt(Lg, "u").replace(/punct/g, vg).getRegex(), Ag = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)", y_ = Wt(Ag, "gu").replace(/notPunctSpace/g, Bg).replace(/punctSpace/g, Rh).replace(/punct/g, Fa).getRegex(), x_ = Wt(Ag, "gu").replace(/notPunctSpace/g, f_).replace(/punctSpace/g, d_).replace(/punct/g, vg).getRegex(), C_ = Wt("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, Bg).replace(/punctSpace/g, Rh).replace(/punct/g, Fa).getRegex(), b_ = Wt(/\\(punct)/, "gu").replace(/punct/g, Fa).getRegex(), k_ = Wt(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), w_ = Wt(Ih).replace("(?:-->|$)", "-->").getRegex(), S_ = Wt("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", w_).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), ca = /(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+[^`]*?`+(?!`)|[^\[\]\\`])*?/, T_ = Wt(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]*(?:\n[ \t]*)?)(title))?\s*\)/).replace("label", ca).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), Eg = Wt(/^!?\[(label)\]\[(ref)\]/).replace("label", ca).replace("ref", $h).getRegex(), Fg = Wt(/^!?\[(ref)\](?:\[\])?/).replace("ref", $h).getRegex(), __ = Wt("reflink|nolink(?!\\()", "g").replace("reflink", Eg).replace("nolink", Fg).getRegex(), ju = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/, Ph = { _backpedal: Ys, anyPunctuation: b_, autolink: k_, blockSkip: p_, br: _g, code: h_, del: Ys, emStrongLDelim: g_, emStrongRDelimAst: y_, emStrongRDelimUnd: C_, escape: l_, link: T_, nolink: Fg, punctuation: u_, reflink: Eg, reflinkSearch: __, tag: S_, text: c_, url: Ys }, B_ = { ...Ph, link: Wt(/^!?\[(label)\]\((.*?)\)/).replace("label", ca).getRegex(), reflink: Wt(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", ca).getRegex() }, Al = { ...Ph, emStrongRDelimAst: x_, emStrongLDelim: m_, url: Wt(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol", ju).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(), _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/, del: /^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/, text: Wt(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol", ju).getRegex() }, v_ = { ...Al, br: Wt(_g).replace("{2,}", "*").getRegex(), text: Wt(Al.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex() }, Lo = { normal: Dh, gfm: a_, pedantic: n_ }, Ss = { normal: Ph, gfm: Al, breaks: v_, pedantic: B_ }, L_ = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }, Gu = (e) => L_[e];
function rr(e, t) {
  if (t) {
    if (ke.escapeTest.test(e)) return e.replace(ke.escapeReplace, Gu);
  } else if (ke.escapeTestNoEncode.test(e)) return e.replace(ke.escapeReplaceNoEncode, Gu);
  return e;
}
function Vu(e) {
  try {
    e = encodeURI(e).replace(ke.percentDecode, "%");
  } catch {
    return null;
  }
  return e;
}
function Ku(e, t) {
  let r = e.replace(ke.findPipe, (o, a, n) => {
    let l = !1, c = a;
    for (; --c >= 0 && n[c] === "\\"; ) l = !l;
    return l ? "|" : " |";
  }), i = r.split(ke.splitPipe), s = 0;
  if (i[0].trim() || i.shift(), i.length > 0 && !i.at(-1)?.trim() && i.pop(), t) if (i.length > t) i.splice(t);
  else for (; i.length < t; ) i.push("");
  for (; s < i.length; s++) i[s] = i[s].trim().replace(ke.slashPipe, "|");
  return i;
}
function Ts(e, t, r) {
  let i = e.length;
  if (i === 0) return "";
  let s = 0;
  for (; s < i && e.charAt(i - s - 1) === t; )
    s++;
  return e.slice(0, i - s);
}
function A_(e, t) {
  if (e.indexOf(t[1]) === -1) return -1;
  let r = 0;
  for (let i = 0; i < e.length; i++) if (e[i] === "\\") i++;
  else if (e[i] === t[0]) r++;
  else if (e[i] === t[1] && (r--, r < 0)) return i;
  return r > 0 ? -2 : -1;
}
function Zu(e, t, r, i, s) {
  let o = t.href, a = t.title || null, n = e[1].replace(s.other.outputLinkReplace, "$1");
  i.state.inLink = !0;
  let l = { type: e[0].charAt(0) === "!" ? "image" : "link", raw: r, href: o, title: a, text: n, tokens: i.inlineTokens(n) };
  return i.state.inLink = !1, l;
}
function E_(e, t, r) {
  let i = e.match(r.other.indentCodeCompensation);
  if (i === null) return t;
  let s = i[1];
  return t.split(`
`).map((o) => {
    let a = o.match(r.other.beginningSpace);
    if (a === null) return o;
    let [n] = a;
    return n.length >= s.length ? o.slice(s.length) : o;
  }).join(`
`);
}
var ua = class {
  options;
  rules;
  lexer;
  constructor(t) {
    this.options = t || yi;
  }
  space(t) {
    let r = this.rules.block.newline.exec(t);
    if (r && r[0].length > 0) return { type: "space", raw: r[0] };
  }
  code(t) {
    let r = this.rules.block.code.exec(t);
    if (r) {
      let i = r[0].replace(this.rules.other.codeRemoveIndent, "");
      return { type: "code", raw: r[0], codeBlockStyle: "indented", text: this.options.pedantic ? i : Ts(i, `
`) };
    }
  }
  fences(t) {
    let r = this.rules.block.fences.exec(t);
    if (r) {
      let i = r[0], s = E_(i, r[3] || "", this.rules);
      return { type: "code", raw: i, lang: r[2] ? r[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : r[2], text: s };
    }
  }
  heading(t) {
    let r = this.rules.block.heading.exec(t);
    if (r) {
      let i = r[2].trim();
      if (this.rules.other.endingHash.test(i)) {
        let s = Ts(i, "#");
        (this.options.pedantic || !s || this.rules.other.endingSpaceChar.test(s)) && (i = s.trim());
      }
      return { type: "heading", raw: r[0], depth: r[1].length, text: i, tokens: this.lexer.inline(i) };
    }
  }
  hr(t) {
    let r = this.rules.block.hr.exec(t);
    if (r) return { type: "hr", raw: Ts(r[0], `
`) };
  }
  blockquote(t) {
    let r = this.rules.block.blockquote.exec(t);
    if (r) {
      let i = Ts(r[0], `
`).split(`
`), s = "", o = "", a = [];
      for (; i.length > 0; ) {
        let n = !1, l = [], c;
        for (c = 0; c < i.length; c++) if (this.rules.other.blockquoteStart.test(i[c])) l.push(i[c]), n = !0;
        else if (!n) l.push(i[c]);
        else break;
        i = i.slice(c);
        let h = l.join(`
`), u = h.replace(this.rules.other.blockquoteSetextReplace, `
    $1`).replace(this.rules.other.blockquoteSetextReplace2, "");
        s = s ? `${s}
${h}` : h, o = o ? `${o}
${u}` : u;
        let d = this.lexer.state.top;
        if (this.lexer.state.top = !0, this.lexer.blockTokens(u, a, !0), this.lexer.state.top = d, i.length === 0) break;
        let f = a.at(-1);
        if (f?.type === "code") break;
        if (f?.type === "blockquote") {
          let m = f, y = m.raw + `
` + i.join(`
`), x = this.blockquote(y);
          a[a.length - 1] = x, s = s.substring(0, s.length - m.raw.length) + x.raw, o = o.substring(0, o.length - m.text.length) + x.text;
          break;
        } else if (f?.type === "list") {
          let m = f, y = m.raw + `
` + i.join(`
`), x = this.list(y);
          a[a.length - 1] = x, s = s.substring(0, s.length - f.raw.length) + x.raw, o = o.substring(0, o.length - m.raw.length) + x.raw, i = y.substring(a.at(-1).raw.length).split(`
`);
          continue;
        }
      }
      return { type: "blockquote", raw: s, tokens: a, text: o };
    }
  }
  list(t) {
    let r = this.rules.block.list.exec(t);
    if (r) {
      let i = r[1].trim(), s = i.length > 1, o = { type: "list", raw: "", ordered: s, start: s ? +i.slice(0, -1) : "", loose: !1, items: [] };
      i = s ? `\\d{1,9}\\${i.slice(-1)}` : `\\${i}`, this.options.pedantic && (i = s ? i : "[*+-]");
      let a = this.rules.other.listItemRegex(i), n = !1;
      for (; t; ) {
        let c = !1, h = "", u = "";
        if (!(r = a.exec(t)) || this.rules.block.hr.test(t)) break;
        h = r[0], t = t.substring(h.length);
        let d = r[2].split(`
`, 1)[0].replace(this.rules.other.listReplaceTabs, (b) => " ".repeat(3 * b.length)), f = t.split(`
`, 1)[0], m = !d.trim(), y = 0;
        if (this.options.pedantic ? (y = 2, u = d.trimStart()) : m ? y = r[1].length + 1 : (y = r[2].search(this.rules.other.nonSpaceChar), y = y > 4 ? 1 : y, u = d.slice(y), y += r[1].length), m && this.rules.other.blankLine.test(f) && (h += f + `
`, t = t.substring(f.length + 1), c = !0), !c) {
          let b = this.rules.other.nextBulletRegex(y), w = this.rules.other.hrRegex(y), _ = this.rules.other.fencesBeginRegex(y), B = this.rules.other.headingBeginRegex(y), A = this.rules.other.htmlBeginRegex(y);
          for (; t; ) {
            let v = t.split(`
`, 1)[0], L;
            if (f = v, this.options.pedantic ? (f = f.replace(this.rules.other.listReplaceNesting, "  "), L = f) : L = f.replace(this.rules.other.tabCharGlobal, "    "), _.test(f) || B.test(f) || A.test(f) || b.test(f) || w.test(f)) break;
            if (L.search(this.rules.other.nonSpaceChar) >= y || !f.trim()) u += `
` + L.slice(y);
            else {
              if (m || d.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || _.test(d) || B.test(d) || w.test(d)) break;
              u += `
` + f;
            }
            !m && !f.trim() && (m = !0), h += v + `
`, t = t.substring(v.length + 1), d = L.slice(y);
          }
        }
        o.loose || (n ? o.loose = !0 : this.rules.other.doubleBlankLine.test(h) && (n = !0));
        let x = null, C;
        this.options.gfm && (x = this.rules.other.listIsTask.exec(u), x && (C = x[0] !== "[ ] ", u = u.replace(this.rules.other.listReplaceTask, ""))), o.items.push({ type: "list_item", raw: h, task: !!x, checked: C, loose: !1, text: u, tokens: [] }), o.raw += h;
      }
      let l = o.items.at(-1);
      if (l) l.raw = l.raw.trimEnd(), l.text = l.text.trimEnd();
      else return;
      o.raw = o.raw.trimEnd();
      for (let c = 0; c < o.items.length; c++) if (this.lexer.state.top = !1, o.items[c].tokens = this.lexer.blockTokens(o.items[c].text, []), !o.loose) {
        let h = o.items[c].tokens.filter((d) => d.type === "space"), u = h.length > 0 && h.some((d) => this.rules.other.anyLine.test(d.raw));
        o.loose = u;
      }
      if (o.loose) for (let c = 0; c < o.items.length; c++) o.items[c].loose = !0;
      return o;
    }
  }
  html(t) {
    let r = this.rules.block.html.exec(t);
    if (r) return { type: "html", block: !0, raw: r[0], pre: r[1] === "pre" || r[1] === "script" || r[1] === "style", text: r[0] };
  }
  def(t) {
    let r = this.rules.block.def.exec(t);
    if (r) {
      let i = r[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal, " "), s = r[2] ? r[2].replace(this.rules.other.hrefBrackets, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "", o = r[3] ? r[3].substring(1, r[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : r[3];
      return { type: "def", tag: i, raw: r[0], href: s, title: o };
    }
  }
  table(t) {
    let r = this.rules.block.table.exec(t);
    if (!r || !this.rules.other.tableDelimiter.test(r[2])) return;
    let i = Ku(r[1]), s = r[2].replace(this.rules.other.tableAlignChars, "").split("|"), o = r[3]?.trim() ? r[3].replace(this.rules.other.tableRowBlankLine, "").split(`
`) : [], a = { type: "table", raw: r[0], header: [], align: [], rows: [] };
    if (i.length === s.length) {
      for (let n of s) this.rules.other.tableAlignRight.test(n) ? a.align.push("right") : this.rules.other.tableAlignCenter.test(n) ? a.align.push("center") : this.rules.other.tableAlignLeft.test(n) ? a.align.push("left") : a.align.push(null);
      for (let n = 0; n < i.length; n++) a.header.push({ text: i[n], tokens: this.lexer.inline(i[n]), header: !0, align: a.align[n] });
      for (let n of o) a.rows.push(Ku(n, a.header.length).map((l, c) => ({ text: l, tokens: this.lexer.inline(l), header: !1, align: a.align[c] })));
      return a;
    }
  }
  lheading(t) {
    let r = this.rules.block.lheading.exec(t);
    if (r) return { type: "heading", raw: r[0], depth: r[2].charAt(0) === "=" ? 1 : 2, text: r[1], tokens: this.lexer.inline(r[1]) };
  }
  paragraph(t) {
    let r = this.rules.block.paragraph.exec(t);
    if (r) {
      let i = r[1].charAt(r[1].length - 1) === `
` ? r[1].slice(0, -1) : r[1];
      return { type: "paragraph", raw: r[0], text: i, tokens: this.lexer.inline(i) };
    }
  }
  text(t) {
    let r = this.rules.block.text.exec(t);
    if (r) return { type: "text", raw: r[0], text: r[0], tokens: this.lexer.inline(r[0]) };
  }
  escape(t) {
    let r = this.rules.inline.escape.exec(t);
    if (r) return { type: "escape", raw: r[0], text: r[1] };
  }
  tag(t) {
    let r = this.rules.inline.tag.exec(t);
    if (r) return !this.lexer.state.inLink && this.rules.other.startATag.test(r[0]) ? this.lexer.state.inLink = !0 : this.lexer.state.inLink && this.rules.other.endATag.test(r[0]) && (this.lexer.state.inLink = !1), !this.lexer.state.inRawBlock && this.rules.other.startPreScriptTag.test(r[0]) ? this.lexer.state.inRawBlock = !0 : this.lexer.state.inRawBlock && this.rules.other.endPreScriptTag.test(r[0]) && (this.lexer.state.inRawBlock = !1), { type: "html", raw: r[0], inLink: this.lexer.state.inLink, inRawBlock: this.lexer.state.inRawBlock, block: !1, text: r[0] };
  }
  link(t) {
    let r = this.rules.inline.link.exec(t);
    if (r) {
      let i = r[2].trim();
      if (!this.options.pedantic && this.rules.other.startAngleBracket.test(i)) {
        if (!this.rules.other.endAngleBracket.test(i)) return;
        let a = Ts(i.slice(0, -1), "\\");
        if ((i.length - a.length) % 2 === 0) return;
      } else {
        let a = A_(r[2], "()");
        if (a === -2) return;
        if (a > -1) {
          let n = (r[0].indexOf("!") === 0 ? 5 : 4) + r[1].length + a;
          r[2] = r[2].substring(0, a), r[0] = r[0].substring(0, n).trim(), r[3] = "";
        }
      }
      let s = r[2], o = "";
      if (this.options.pedantic) {
        let a = this.rules.other.pedanticHrefTitle.exec(s);
        a && (s = a[1], o = a[3]);
      } else o = r[3] ? r[3].slice(1, -1) : "";
      return s = s.trim(), this.rules.other.startAngleBracket.test(s) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(i) ? s = s.slice(1) : s = s.slice(1, -1)), Zu(r, { href: s && s.replace(this.rules.inline.anyPunctuation, "$1"), title: o && o.replace(this.rules.inline.anyPunctuation, "$1") }, r[0], this.lexer, this.rules);
    }
  }
  reflink(t, r) {
    let i;
    if ((i = this.rules.inline.reflink.exec(t)) || (i = this.rules.inline.nolink.exec(t))) {
      let s = (i[2] || i[1]).replace(this.rules.other.multipleSpaceGlobal, " "), o = r[s.toLowerCase()];
      if (!o) {
        let a = i[0].charAt(0);
        return { type: "text", raw: a, text: a };
      }
      return Zu(i, o, i[0], this.lexer, this.rules);
    }
  }
  emStrong(t, r, i = "") {
    let s = this.rules.inline.emStrongLDelim.exec(t);
    if (!(!s || s[3] && i.match(this.rules.other.unicodeAlphaNumeric)) && (!(s[1] || s[2]) || !i || this.rules.inline.punctuation.exec(i))) {
      let o = [...s[0]].length - 1, a, n, l = o, c = 0, h = s[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
      for (h.lastIndex = 0, r = r.slice(-1 * t.length + o); (s = h.exec(r)) != null; ) {
        if (a = s[1] || s[2] || s[3] || s[4] || s[5] || s[6], !a) continue;
        if (n = [...a].length, s[3] || s[4]) {
          l += n;
          continue;
        } else if ((s[5] || s[6]) && o % 3 && !((o + n) % 3)) {
          c += n;
          continue;
        }
        if (l -= n, l > 0) continue;
        n = Math.min(n, n + l + c);
        let u = [...s[0]][0].length, d = t.slice(0, o + s.index + u + n);
        if (Math.min(o, n) % 2) {
          let m = d.slice(1, -1);
          return { type: "em", raw: d, text: m, tokens: this.lexer.inlineTokens(m) };
        }
        let f = d.slice(2, -2);
        return { type: "strong", raw: d, text: f, tokens: this.lexer.inlineTokens(f) };
      }
    }
  }
  codespan(t) {
    let r = this.rules.inline.code.exec(t);
    if (r) {
      let i = r[2].replace(this.rules.other.newLineCharGlobal, " "), s = this.rules.other.nonSpaceChar.test(i), o = this.rules.other.startingSpaceChar.test(i) && this.rules.other.endingSpaceChar.test(i);
      return s && o && (i = i.substring(1, i.length - 1)), { type: "codespan", raw: r[0], text: i };
    }
  }
  br(t) {
    let r = this.rules.inline.br.exec(t);
    if (r) return { type: "br", raw: r[0] };
  }
  del(t) {
    let r = this.rules.inline.del.exec(t);
    if (r) return { type: "del", raw: r[0], text: r[2], tokens: this.lexer.inlineTokens(r[2]) };
  }
  autolink(t) {
    let r = this.rules.inline.autolink.exec(t);
    if (r) {
      let i, s;
      return r[2] === "@" ? (i = r[1], s = "mailto:" + i) : (i = r[1], s = i), { type: "link", raw: r[0], text: i, href: s, tokens: [{ type: "text", raw: i, text: i }] };
    }
  }
  url(t) {
    let r;
    if (r = this.rules.inline.url.exec(t)) {
      let i, s;
      if (r[2] === "@") i = r[0], s = "mailto:" + i;
      else {
        let o;
        do
          o = r[0], r[0] = this.rules.inline._backpedal.exec(r[0])?.[0] ?? "";
        while (o !== r[0]);
        i = r[0], r[1] === "www." ? s = "http://" + r[0] : s = r[0];
      }
      return { type: "link", raw: r[0], text: i, href: s, tokens: [{ type: "text", raw: i, text: i }] };
    }
  }
  inlineText(t) {
    let r = this.rules.inline.text.exec(t);
    if (r) {
      let i = this.lexer.state.inRawBlock;
      return { type: "text", raw: r[0], text: r[0], escaped: i };
    }
  }
}, Xe = class El {
  tokens;
  options;
  state;
  tokenizer;
  inlineQueue;
  constructor(t) {
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = t || yi, this.options.tokenizer = this.options.tokenizer || new ua(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = { inLink: !1, inRawBlock: !1, top: !0 };
    let r = { other: ke, block: Lo.normal, inline: Ss.normal };
    this.options.pedantic ? (r.block = Lo.pedantic, r.inline = Ss.pedantic) : this.options.gfm && (r.block = Lo.gfm, this.options.breaks ? r.inline = Ss.breaks : r.inline = Ss.gfm), this.tokenizer.rules = r;
  }
  static get rules() {
    return { block: Lo, inline: Ss };
  }
  static lex(t, r) {
    return new El(r).lex(t);
  }
  static lexInline(t, r) {
    return new El(r).inlineTokens(t);
  }
  lex(t) {
    t = t.replace(ke.carriageReturn, `
`), this.blockTokens(t, this.tokens);
    for (let r = 0; r < this.inlineQueue.length; r++) {
      let i = this.inlineQueue[r];
      this.inlineTokens(i.src, i.tokens);
    }
    return this.inlineQueue = [], this.tokens;
  }
  blockTokens(t, r = [], i = !1) {
    for (this.options.pedantic && (t = t.replace(ke.tabCharGlobal, "    ").replace(ke.spaceLine, "")); t; ) {
      let s;
      if (this.options.extensions?.block?.some((a) => (s = a.call({ lexer: this }, t, r)) ? (t = t.substring(s.raw.length), r.push(s), !0) : !1)) continue;
      if (s = this.tokenizer.space(t)) {
        t = t.substring(s.raw.length);
        let a = r.at(-1);
        s.raw.length === 1 && a !== void 0 ? a.raw += `
` : r.push(s);
        continue;
      }
      if (s = this.tokenizer.code(t)) {
        t = t.substring(s.raw.length);
        let a = r.at(-1);
        a?.type === "paragraph" || a?.type === "text" ? (a.raw += (a.raw.endsWith(`
`) ? "" : `
`) + s.raw, a.text += `
` + s.text, this.inlineQueue.at(-1).src = a.text) : r.push(s);
        continue;
      }
      if (s = this.tokenizer.fences(t)) {
        t = t.substring(s.raw.length), r.push(s);
        continue;
      }
      if (s = this.tokenizer.heading(t)) {
        t = t.substring(s.raw.length), r.push(s);
        continue;
      }
      if (s = this.tokenizer.hr(t)) {
        t = t.substring(s.raw.length), r.push(s);
        continue;
      }
      if (s = this.tokenizer.blockquote(t)) {
        t = t.substring(s.raw.length), r.push(s);
        continue;
      }
      if (s = this.tokenizer.list(t)) {
        t = t.substring(s.raw.length), r.push(s);
        continue;
      }
      if (s = this.tokenizer.html(t)) {
        t = t.substring(s.raw.length), r.push(s);
        continue;
      }
      if (s = this.tokenizer.def(t)) {
        t = t.substring(s.raw.length);
        let a = r.at(-1);
        a?.type === "paragraph" || a?.type === "text" ? (a.raw += (a.raw.endsWith(`
`) ? "" : `
`) + s.raw, a.text += `
` + s.raw, this.inlineQueue.at(-1).src = a.text) : this.tokens.links[s.tag] || (this.tokens.links[s.tag] = { href: s.href, title: s.title }, r.push(s));
        continue;
      }
      if (s = this.tokenizer.table(t)) {
        t = t.substring(s.raw.length), r.push(s);
        continue;
      }
      if (s = this.tokenizer.lheading(t)) {
        t = t.substring(s.raw.length), r.push(s);
        continue;
      }
      let o = t;
      if (this.options.extensions?.startBlock) {
        let a = 1 / 0, n = t.slice(1), l;
        this.options.extensions.startBlock.forEach((c) => {
          l = c.call({ lexer: this }, n), typeof l == "number" && l >= 0 && (a = Math.min(a, l));
        }), a < 1 / 0 && a >= 0 && (o = t.substring(0, a + 1));
      }
      if (this.state.top && (s = this.tokenizer.paragraph(o))) {
        let a = r.at(-1);
        i && a?.type === "paragraph" ? (a.raw += (a.raw.endsWith(`
`) ? "" : `
`) + s.raw, a.text += `
` + s.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = a.text) : r.push(s), i = o.length !== t.length, t = t.substring(s.raw.length);
        continue;
      }
      if (s = this.tokenizer.text(t)) {
        t = t.substring(s.raw.length);
        let a = r.at(-1);
        a?.type === "text" ? (a.raw += (a.raw.endsWith(`
`) ? "" : `
`) + s.raw, a.text += `
` + s.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = a.text) : r.push(s);
        continue;
      }
      if (t) {
        let a = "Infinite loop on byte: " + t.charCodeAt(0);
        if (this.options.silent) {
          console.error(a);
          break;
        } else throw new Error(a);
      }
    }
    return this.state.top = !0, r;
  }
  inline(t, r = []) {
    return this.inlineQueue.push({ src: t, tokens: r }), r;
  }
  inlineTokens(t, r = []) {
    let i = t, s = null;
    if (this.tokens.links) {
      let l = Object.keys(this.tokens.links);
      if (l.length > 0) for (; (s = this.tokenizer.rules.inline.reflinkSearch.exec(i)) != null; ) l.includes(s[0].slice(s[0].lastIndexOf("[") + 1, -1)) && (i = i.slice(0, s.index) + "[" + "a".repeat(s[0].length - 2) + "]" + i.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex));
    }
    for (; (s = this.tokenizer.rules.inline.anyPunctuation.exec(i)) != null; ) i = i.slice(0, s.index) + "++" + i.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);
    let o;
    for (; (s = this.tokenizer.rules.inline.blockSkip.exec(i)) != null; ) o = s[2] ? s[2].length : 0, i = i.slice(0, s.index + o) + "[" + "a".repeat(s[0].length - o - 2) + "]" + i.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
    i = this.options.hooks?.emStrongMask?.call({ lexer: this }, i) ?? i;
    let a = !1, n = "";
    for (; t; ) {
      a || (n = ""), a = !1;
      let l;
      if (this.options.extensions?.inline?.some((h) => (l = h.call({ lexer: this }, t, r)) ? (t = t.substring(l.raw.length), r.push(l), !0) : !1)) continue;
      if (l = this.tokenizer.escape(t)) {
        t = t.substring(l.raw.length), r.push(l);
        continue;
      }
      if (l = this.tokenizer.tag(t)) {
        t = t.substring(l.raw.length), r.push(l);
        continue;
      }
      if (l = this.tokenizer.link(t)) {
        t = t.substring(l.raw.length), r.push(l);
        continue;
      }
      if (l = this.tokenizer.reflink(t, this.tokens.links)) {
        t = t.substring(l.raw.length);
        let h = r.at(-1);
        l.type === "text" && h?.type === "text" ? (h.raw += l.raw, h.text += l.text) : r.push(l);
        continue;
      }
      if (l = this.tokenizer.emStrong(t, i, n)) {
        t = t.substring(l.raw.length), r.push(l);
        continue;
      }
      if (l = this.tokenizer.codespan(t)) {
        t = t.substring(l.raw.length), r.push(l);
        continue;
      }
      if (l = this.tokenizer.br(t)) {
        t = t.substring(l.raw.length), r.push(l);
        continue;
      }
      if (l = this.tokenizer.del(t)) {
        t = t.substring(l.raw.length), r.push(l);
        continue;
      }
      if (l = this.tokenizer.autolink(t)) {
        t = t.substring(l.raw.length), r.push(l);
        continue;
      }
      if (!this.state.inLink && (l = this.tokenizer.url(t))) {
        t = t.substring(l.raw.length), r.push(l);
        continue;
      }
      let c = t;
      if (this.options.extensions?.startInline) {
        let h = 1 / 0, u = t.slice(1), d;
        this.options.extensions.startInline.forEach((f) => {
          d = f.call({ lexer: this }, u), typeof d == "number" && d >= 0 && (h = Math.min(h, d));
        }), h < 1 / 0 && h >= 0 && (c = t.substring(0, h + 1));
      }
      if (l = this.tokenizer.inlineText(c)) {
        t = t.substring(l.raw.length), l.raw.slice(-1) !== "_" && (n = l.raw.slice(-1)), a = !0;
        let h = r.at(-1);
        h?.type === "text" ? (h.raw += l.raw, h.text += l.text) : r.push(l);
        continue;
      }
      if (t) {
        let h = "Infinite loop on byte: " + t.charCodeAt(0);
        if (this.options.silent) {
          console.error(h);
          break;
        } else throw new Error(h);
      }
    }
    return r;
  }
}, da = class {
  options;
  parser;
  constructor(t) {
    this.options = t || yi;
  }
  space(t) {
    return "";
  }
  code({ text: t, lang: r, escaped: i }) {
    let s = (r || "").match(ke.notSpaceStart)?.[0], o = t.replace(ke.endingNewline, "") + `
`;
    return s ? '<pre><code class="language-' + rr(s) + '">' + (i ? o : rr(o, !0)) + `</code></pre>
` : "<pre><code>" + (i ? o : rr(o, !0)) + `</code></pre>
`;
  }
  blockquote({ tokens: t }) {
    return `<blockquote>
${this.parser.parse(t)}</blockquote>
`;
  }
  html({ text: t }) {
    return t;
  }
  def(t) {
    return "";
  }
  heading({ tokens: t, depth: r }) {
    return `<h${r}>${this.parser.parseInline(t)}</h${r}>
`;
  }
  hr(t) {
    return `<hr>
`;
  }
  list(t) {
    let r = t.ordered, i = t.start, s = "";
    for (let n = 0; n < t.items.length; n++) {
      let l = t.items[n];
      s += this.listitem(l);
    }
    let o = r ? "ol" : "ul", a = r && i !== 1 ? ' start="' + i + '"' : "";
    return "<" + o + a + `>
` + s + "</" + o + `>
`;
  }
  listitem(t) {
    let r = "";
    if (t.task) {
      let i = this.checkbox({ checked: !!t.checked });
      t.loose ? t.tokens[0]?.type === "paragraph" ? (t.tokens[0].text = i + " " + t.tokens[0].text, t.tokens[0].tokens && t.tokens[0].tokens.length > 0 && t.tokens[0].tokens[0].type === "text" && (t.tokens[0].tokens[0].text = i + " " + rr(t.tokens[0].tokens[0].text), t.tokens[0].tokens[0].escaped = !0)) : t.tokens.unshift({ type: "text", raw: i + " ", text: i + " ", escaped: !0 }) : r += i + " ";
    }
    return r += this.parser.parse(t.tokens, !!t.loose), `<li>${r}</li>
`;
  }
  checkbox({ checked: t }) {
    return "<input " + (t ? 'checked="" ' : "") + 'disabled="" type="checkbox">';
  }
  paragraph({ tokens: t }) {
    return `<p>${this.parser.parseInline(t)}</p>
`;
  }
  table(t) {
    let r = "", i = "";
    for (let o = 0; o < t.header.length; o++) i += this.tablecell(t.header[o]);
    r += this.tablerow({ text: i });
    let s = "";
    for (let o = 0; o < t.rows.length; o++) {
      let a = t.rows[o];
      i = "";
      for (let n = 0; n < a.length; n++) i += this.tablecell(a[n]);
      s += this.tablerow({ text: i });
    }
    return s && (s = `<tbody>${s}</tbody>`), `<table>
<thead>
` + r + `</thead>
` + s + `</table>
`;
  }
  tablerow({ text: t }) {
    return `<tr>
${t}</tr>
`;
  }
  tablecell(t) {
    let r = this.parser.parseInline(t.tokens), i = t.header ? "th" : "td";
    return (t.align ? `<${i} align="${t.align}">` : `<${i}>`) + r + `</${i}>
`;
  }
  strong({ tokens: t }) {
    return `<strong>${this.parser.parseInline(t)}</strong>`;
  }
  em({ tokens: t }) {
    return `<em>${this.parser.parseInline(t)}</em>`;
  }
  codespan({ text: t }) {
    return `<code>${rr(t, !0)}</code>`;
  }
  br(t) {
    return "<br>";
  }
  del({ tokens: t }) {
    return `<del>${this.parser.parseInline(t)}</del>`;
  }
  link({ href: t, title: r, tokens: i }) {
    let s = this.parser.parseInline(i), o = Vu(t);
    if (o === null) return s;
    t = o;
    let a = '<a href="' + t + '"';
    return r && (a += ' title="' + rr(r) + '"'), a += ">" + s + "</a>", a;
  }
  image({ href: t, title: r, text: i, tokens: s }) {
    s && (i = this.parser.parseInline(s, this.parser.textRenderer));
    let o = Vu(t);
    if (o === null) return rr(i);
    t = o;
    let a = `<img src="${t}" alt="${i}"`;
    return r && (a += ` title="${rr(r)}"`), a += ">", a;
  }
  text(t) {
    return "tokens" in t && t.tokens ? this.parser.parseInline(t.tokens) : "escaped" in t && t.escaped ? t.text : rr(t.text);
  }
}, Nh = class {
  strong({ text: t }) {
    return t;
  }
  em({ text: t }) {
    return t;
  }
  codespan({ text: t }) {
    return t;
  }
  del({ text: t }) {
    return t;
  }
  html({ text: t }) {
    return t;
  }
  text({ text: t }) {
    return t;
  }
  link({ text: t }) {
    return "" + t;
  }
  image({ text: t }) {
    return "" + t;
  }
  br() {
    return "";
  }
}, je = class Fl {
  options;
  renderer;
  textRenderer;
  constructor(t) {
    this.options = t || yi, this.options.renderer = this.options.renderer || new da(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new Nh();
  }
  static parse(t, r) {
    return new Fl(r).parse(t);
  }
  static parseInline(t, r) {
    return new Fl(r).parseInline(t);
  }
  parse(t, r = !0) {
    let i = "";
    for (let s = 0; s < t.length; s++) {
      let o = t[s];
      if (this.options.extensions?.renderers?.[o.type]) {
        let n = o, l = this.options.extensions.renderers[n.type].call({ parser: this }, n);
        if (l !== !1 || !["space", "hr", "heading", "code", "table", "blockquote", "list", "html", "def", "paragraph", "text"].includes(n.type)) {
          i += l || "";
          continue;
        }
      }
      let a = o;
      switch (a.type) {
        case "space": {
          i += this.renderer.space(a);
          continue;
        }
        case "hr": {
          i += this.renderer.hr(a);
          continue;
        }
        case "heading": {
          i += this.renderer.heading(a);
          continue;
        }
        case "code": {
          i += this.renderer.code(a);
          continue;
        }
        case "table": {
          i += this.renderer.table(a);
          continue;
        }
        case "blockquote": {
          i += this.renderer.blockquote(a);
          continue;
        }
        case "list": {
          i += this.renderer.list(a);
          continue;
        }
        case "html": {
          i += this.renderer.html(a);
          continue;
        }
        case "def": {
          i += this.renderer.def(a);
          continue;
        }
        case "paragraph": {
          i += this.renderer.paragraph(a);
          continue;
        }
        case "text": {
          let n = a, l = this.renderer.text(n);
          for (; s + 1 < t.length && t[s + 1].type === "text"; ) n = t[++s], l += `
` + this.renderer.text(n);
          r ? i += this.renderer.paragraph({ type: "paragraph", raw: l, text: l, tokens: [{ type: "text", raw: l, text: l, escaped: !0 }] }) : i += l;
          continue;
        }
        default: {
          let n = 'Token with "' + a.type + '" type was not found.';
          if (this.options.silent) return console.error(n), "";
          throw new Error(n);
        }
      }
    }
    return i;
  }
  parseInline(t, r = this.renderer) {
    let i = "";
    for (let s = 0; s < t.length; s++) {
      let o = t[s];
      if (this.options.extensions?.renderers?.[o.type]) {
        let n = this.options.extensions.renderers[o.type].call({ parser: this }, o);
        if (n !== !1 || !["escape", "html", "link", "image", "strong", "em", "codespan", "br", "del", "text"].includes(o.type)) {
          i += n || "";
          continue;
        }
      }
      let a = o;
      switch (a.type) {
        case "escape": {
          i += r.text(a);
          break;
        }
        case "html": {
          i += r.html(a);
          break;
        }
        case "link": {
          i += r.link(a);
          break;
        }
        case "image": {
          i += r.image(a);
          break;
        }
        case "strong": {
          i += r.strong(a);
          break;
        }
        case "em": {
          i += r.em(a);
          break;
        }
        case "codespan": {
          i += r.codespan(a);
          break;
        }
        case "br": {
          i += r.br(a);
          break;
        }
        case "del": {
          i += r.del(a);
          break;
        }
        case "text": {
          i += r.text(a);
          break;
        }
        default: {
          let n = 'Token with "' + a.type + '" type was not found.';
          if (this.options.silent) return console.error(n), "";
          throw new Error(n);
        }
      }
    }
    return i;
  }
}, $s = class {
  options;
  block;
  constructor(t) {
    this.options = t || yi;
  }
  static passThroughHooks = /* @__PURE__ */ new Set(["preprocess", "postprocess", "processAllTokens", "emStrongMask"]);
  static passThroughHooksRespectAsync = /* @__PURE__ */ new Set(["preprocess", "postprocess", "processAllTokens"]);
  preprocess(t) {
    return t;
  }
  postprocess(t) {
    return t;
  }
  processAllTokens(t) {
    return t;
  }
  emStrongMask(t) {
    return t;
  }
  provideLexer() {
    return this.block ? Xe.lex : Xe.lexInline;
  }
  provideParser() {
    return this.block ? je.parse : je.parseInline;
  }
}, F_ = class {
  defaults = Fh();
  options = this.setOptions;
  parse = this.parseMarkdown(!0);
  parseInline = this.parseMarkdown(!1);
  Parser = je;
  Renderer = da;
  TextRenderer = Nh;
  Lexer = Xe;
  Tokenizer = ua;
  Hooks = $s;
  constructor(...t) {
    this.use(...t);
  }
  walkTokens(t, r) {
    let i = [];
    for (let s of t) switch (i = i.concat(r.call(this, s)), s.type) {
      case "table": {
        let o = s;
        for (let a of o.header) i = i.concat(this.walkTokens(a.tokens, r));
        for (let a of o.rows) for (let n of a) i = i.concat(this.walkTokens(n.tokens, r));
        break;
      }
      case "list": {
        let o = s;
        i = i.concat(this.walkTokens(o.items, r));
        break;
      }
      default: {
        let o = s;
        this.defaults.extensions?.childTokens?.[o.type] ? this.defaults.extensions.childTokens[o.type].forEach((a) => {
          let n = o[a].flat(1 / 0);
          i = i.concat(this.walkTokens(n, r));
        }) : o.tokens && (i = i.concat(this.walkTokens(o.tokens, r)));
      }
    }
    return i;
  }
  use(...t) {
    let r = this.defaults.extensions || { renderers: {}, childTokens: {} };
    return t.forEach((i) => {
      let s = { ...i };
      if (s.async = this.defaults.async || s.async || !1, i.extensions && (i.extensions.forEach((o) => {
        if (!o.name) throw new Error("extension name required");
        if ("renderer" in o) {
          let a = r.renderers[o.name];
          a ? r.renderers[o.name] = function(...n) {
            let l = o.renderer.apply(this, n);
            return l === !1 && (l = a.apply(this, n)), l;
          } : r.renderers[o.name] = o.renderer;
        }
        if ("tokenizer" in o) {
          if (!o.level || o.level !== "block" && o.level !== "inline") throw new Error("extension level must be 'block' or 'inline'");
          let a = r[o.level];
          a ? a.unshift(o.tokenizer) : r[o.level] = [o.tokenizer], o.start && (o.level === "block" ? r.startBlock ? r.startBlock.push(o.start) : r.startBlock = [o.start] : o.level === "inline" && (r.startInline ? r.startInline.push(o.start) : r.startInline = [o.start]));
        }
        "childTokens" in o && o.childTokens && (r.childTokens[o.name] = o.childTokens);
      }), s.extensions = r), i.renderer) {
        let o = this.defaults.renderer || new da(this.defaults);
        for (let a in i.renderer) {
          if (!(a in o)) throw new Error(`renderer '${a}' does not exist`);
          if (["options", "parser"].includes(a)) continue;
          let n = a, l = i.renderer[n], c = o[n];
          o[n] = (...h) => {
            let u = l.apply(o, h);
            return u === !1 && (u = c.apply(o, h)), u || "";
          };
        }
        s.renderer = o;
      }
      if (i.tokenizer) {
        let o = this.defaults.tokenizer || new ua(this.defaults);
        for (let a in i.tokenizer) {
          if (!(a in o)) throw new Error(`tokenizer '${a}' does not exist`);
          if (["options", "rules", "lexer"].includes(a)) continue;
          let n = a, l = i.tokenizer[n], c = o[n];
          o[n] = (...h) => {
            let u = l.apply(o, h);
            return u === !1 && (u = c.apply(o, h)), u;
          };
        }
        s.tokenizer = o;
      }
      if (i.hooks) {
        let o = this.defaults.hooks || new $s();
        for (let a in i.hooks) {
          if (!(a in o)) throw new Error(`hook '${a}' does not exist`);
          if (["options", "block"].includes(a)) continue;
          let n = a, l = i.hooks[n], c = o[n];
          $s.passThroughHooks.has(a) ? o[n] = (h) => {
            if (this.defaults.async && $s.passThroughHooksRespectAsync.has(a)) return (async () => {
              let d = await l.call(o, h);
              return c.call(o, d);
            })();
            let u = l.call(o, h);
            return c.call(o, u);
          } : o[n] = (...h) => {
            if (this.defaults.async) return (async () => {
              let d = await l.apply(o, h);
              return d === !1 && (d = await c.apply(o, h)), d;
            })();
            let u = l.apply(o, h);
            return u === !1 && (u = c.apply(o, h)), u;
          };
        }
        s.hooks = o;
      }
      if (i.walkTokens) {
        let o = this.defaults.walkTokens, a = i.walkTokens;
        s.walkTokens = function(n) {
          let l = [];
          return l.push(a.call(this, n)), o && (l = l.concat(o.call(this, n))), l;
        };
      }
      this.defaults = { ...this.defaults, ...s };
    }), this;
  }
  setOptions(t) {
    return this.defaults = { ...this.defaults, ...t }, this;
  }
  lexer(t, r) {
    return Xe.lex(t, r ?? this.defaults);
  }
  parser(t, r) {
    return je.parse(t, r ?? this.defaults);
  }
  parseMarkdown(t) {
    return (r, i) => {
      let s = { ...i }, o = { ...this.defaults, ...s }, a = this.onError(!!o.silent, !!o.async);
      if (this.defaults.async === !0 && s.async === !1) return a(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
      if (typeof r > "u" || r === null) return a(new Error("marked(): input parameter is undefined or null"));
      if (typeof r != "string") return a(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(r) + ", string expected"));
      if (o.hooks && (o.hooks.options = o, o.hooks.block = t), o.async) return (async () => {
        let n = o.hooks ? await o.hooks.preprocess(r) : r, l = await (o.hooks ? await o.hooks.provideLexer() : t ? Xe.lex : Xe.lexInline)(n, o), c = o.hooks ? await o.hooks.processAllTokens(l) : l;
        o.walkTokens && await Promise.all(this.walkTokens(c, o.walkTokens));
        let h = await (o.hooks ? await o.hooks.provideParser() : t ? je.parse : je.parseInline)(c, o);
        return o.hooks ? await o.hooks.postprocess(h) : h;
      })().catch(a);
      try {
        o.hooks && (r = o.hooks.preprocess(r));
        let n = (o.hooks ? o.hooks.provideLexer() : t ? Xe.lex : Xe.lexInline)(r, o);
        o.hooks && (n = o.hooks.processAllTokens(n)), o.walkTokens && this.walkTokens(n, o.walkTokens);
        let l = (o.hooks ? o.hooks.provideParser() : t ? je.parse : je.parseInline)(n, o);
        return o.hooks && (l = o.hooks.postprocess(l)), l;
      } catch (n) {
        return a(n);
      }
    };
  }
  onError(t, r) {
    return (i) => {
      if (i.message += `
Please report this to https://github.com/markedjs/marked.`, t) {
        let s = "<p>An error occurred:</p><pre>" + rr(i.message + "", !0) + "</pre>";
        return r ? Promise.resolve(s) : s;
      }
      if (r) return Promise.reject(i);
      throw i;
    };
  }
}, fi = new F_();
function Yt(e, t) {
  return fi.parse(e, t);
}
Yt.options = Yt.setOptions = function(e) {
  return fi.setOptions(e), Yt.defaults = fi.defaults, kg(Yt.defaults), Yt;
};
Yt.getDefaults = Fh;
Yt.defaults = yi;
Yt.use = function(...e) {
  return fi.use(...e), Yt.defaults = fi.defaults, kg(Yt.defaults), Yt;
};
Yt.walkTokens = function(e, t) {
  return fi.walkTokens(e, t);
};
Yt.parseInline = fi.parseInline;
Yt.Parser = je;
Yt.parser = je.parse;
Yt.Renderer = da;
Yt.TextRenderer = Nh;
Yt.Lexer = Xe;
Yt.lexer = Xe.lex;
Yt.Tokenizer = ua;
Yt.Hooks = $s;
Yt.parse = Yt;
Yt.options;
Yt.setOptions;
Yt.use;
Yt.walkTokens;
Yt.parseInline;
je.parse;
Xe.lex;
function Mg(e) {
  for (var t = [], r = 1; r < arguments.length; r++)
    t[r - 1] = arguments[r];
  var i = Array.from(typeof e == "string" ? [e] : e);
  i[i.length - 1] = i[i.length - 1].replace(/\r?\n([\t ]*)$/, "");
  var s = i.reduce(function(n, l) {
    var c = l.match(/\n([\t ]+|(?!\s).)/g);
    return c ? n.concat(c.map(function(h) {
      var u, d;
      return (d = (u = h.match(/[\t ]/g)) === null || u === void 0 ? void 0 : u.length) !== null && d !== void 0 ? d : 0;
    })) : n;
  }, []);
  if (s.length) {
    var o = new RegExp(`
[	 ]{`.concat(Math.min.apply(Math, s), "}"), "g");
    i = i.map(function(n) {
      return n.replace(o, `
`);
    });
  }
  i[0] = i[0].replace(/^\r?\n/, "");
  var a = i[0];
  return t.forEach(function(n, l) {
    var c = a.match(/(?:^|\n)( *)$/), h = c ? c[1] : "", u = n;
    typeof n == "string" && n.includes(`
`) && (u = String(n).split(`
`).map(function(d, f) {
      return f === 0 ? d : "".concat(h).concat(d);
    }).join(`
`)), a += u + i[l + 1];
  }), a;
}
var Ml = typeof performance < "u" && typeof performance.now == "function", _i = /* @__PURE__ */ p(() => Ml ? performance.now() : 0, "now"), wn = "🧜 ", M_ = "Mermaid render", O_ = "Mermaid", $_ = {
  parse: "tertiary",
  prepare: "secondary",
  measure: "primary",
  layout: "primary-dark",
  layoutCore: "error",
  draw: "primary-light",
  paint: "secondary-dark",
  serialize: "tertiary-dark",
  render: "primary-light"
}, Qi;
Qi = class {
  constructor() {
    this.enabled = !1, this.autoPrint = !0, this.records = [], this.maxRecords = 200, this.roots = [], this.stack = [], this.buckets = {};
  }
  enable() {
    return this.enabled = !0, this;
  }
  disable() {
    return this.enabled = !1, this;
  }
  /** Begin a new top-level measurement (one per diagram render). */
  start(t) {
    this.enabled && (this.roots = [], this.stack = [], this.buckets = {}, this.begin(t));
  }
  /**
   * Accumulate the wall-clock of a synchronous sub-operation into a named bucket,
   * summed over every call within the render — for hot operations that run too
   * often to be individual tree spans (e.g. per-node `getBBox`). Returns the
   * function's result. No-op (just calls `fn`) unless enabled.
   */
  tickSync(t, r) {
    if (!this.enabled)
      return r();
    const i = _i();
    try {
      return r();
    } finally {
      this.buckets[t] = (this.buckets[t] ?? 0) + (_i() - i);
    }
  }
  /**
   * Async variant of {@link tickSync}. WARNING: only meaningful for operations
   * that run one-at-a-time. Do NOT use it for calls awaited concurrently (e.g.
   * `Promise.all(nodes.map(...))`) — their wall-clocks overlap and the summed
   * bucket balloons far past the real elapsed time. For concurrent CPU
   * attribution use a DevTools CPU profile instead.
   */
  async tick(t, r) {
    if (!this.enabled)
      return r();
    const i = _i();
    try {
      return await r();
    } finally {
      this.buckets[t] = (this.buckets[t] ?? 0) + (_i() - i);
    }
  }
  /** End the current top-level measurement and optionally print a summary. */
  stop() {
    if (!this.enabled)
      return;
    for (; this.stack.length > 0; )
      this.end();
    const t = this.roots.at(-1), r = this.runLabel ?? t?.name;
    return t && (this.records.push({ label: r ?? t.name, tree: t, buckets: { ...this.buckets } }), this.records.length > this.maxRecords && this.records.splice(0, this.records.length - this.maxRecords), this.autoPrint && this.printSummary(t, r)), this.runLabel = void 0, t;
  }
  /** Open a child span. Pair with {@link end}. No-op unless enabled. */
  begin(t) {
    if (!this.enabled)
      return;
    const r = { name: t, start: _i(), duration: -1, children: [] }, i = this.stack.at(-1);
    if (i ? i.children.push(r) : this.roots.push(r), this.stack.push(r), Ml && typeof performance.mark == "function")
      try {
        performance.mark(`${wn}${t} ▶`);
      } catch {
      }
  }
  /** Close the most recently opened span. No-op unless enabled. */
  end() {
    if (!this.enabled)
      return;
    const t = this.stack.pop();
    if (!t)
      return;
    const r = _i();
    if (t.duration = r - t.start, Ml && typeof performance.measure == "function")
      try {
        performance.measure(`${wn}${t.name}`, {
          start: t.start,
          end: r,
          detail: {
            devtools: {
              dataType: "track-entry",
              track: M_,
              trackGroup: O_,
              color: $_[t.name] ?? "primary",
              tooltipText: `${t.name} — ${t.duration.toFixed(1)} ms`
            }
          }
        });
      } catch {
      }
  }
  /**
   * Measure an async phase. Returns the wrapped function's result and rethrows
   * any error after closing the span, so instrumentation never swallows
   * failures or leaks an open span. No measurement overhead unless enabled.
   */
  async span(t, r) {
    if (!this.enabled)
      return r();
    this.begin(t);
    try {
      return await r();
    } finally {
      this.end();
    }
  }
  /** The most recent completed render tree, or `undefined`. */
  report() {
    return this.records.at(-1)?.tree ?? this.roots.at(-1);
  }
  /** Drop all collected records and any in-progress spans. */
  clear() {
    this.records.length = 0, this.roots = [], this.stack = [], this.runLabel = void 0;
  }
  reset() {
    this.roots = [], this.stack = [];
  }
  printSummary(t = this.report(), r) {
    if (!t)
      return;
    const i = t.duration, s = r && r !== t.name ? `${t.name} [${r}]` : t.name, o = ["ms        %    phase"], a = /* @__PURE__ */ p((l, c) => {
      const h = "  ".repeat(c), u = l.duration.toFixed(1).padStart(8), d = i > 0 ? `${(l.duration / i * 100).toFixed(0).padStart(3)}%` : "   -";
      o.push(`${u}  ${d}  ${h}${l.name}`);
      for (const f of l.children)
        a(f, c + 1);
      if (l.children.length > 0) {
        const f = l.children.reduce((y, x) => y + x.duration, 0), m = l.duration - f;
        if (m > 0.5) {
          const y = m.toFixed(1).padStart(8);
          o.push(`${y}       ${h}  (self)`);
        }
      }
    }, "walk");
    a(t, 0);
    const n = Object.keys(this.buckets);
    if (n.length > 0) {
      o.push("—— buckets (summed) ——");
      for (const l of n)
        o.push(`${this.buckets[l].toFixed(1).padStart(8)}       ${l}`);
    }
    console.log(`${wn}mermaid render profile · ${s}
${o.join(`
`)}`);
  }
}, p(Qi, "Profiler");
globalThis.injected ??= {
  includeLargeFeatures: !0,
  profiling: !1,
  version: "0.0.0"
};
var I_ = (
  // @ts-expect-error -- fastdom types aren't yet ESM-compatible, we need this hack
  UT.extend({
    /**
     * `requestAnimationFrame` is too slow compared to `queueMicrotask`.
     */
    raf(e) {
      typeof queueMicrotask == "function" ? queueMicrotask(e) : setTimeout(e, 0);
    }
  }).extend(GT)
), pi = I_;
function Og(e, { markdownAutoWrap: t }) {
  const i = e.replace(/<br\/>/g, `
`).replace(/\n{2,}/g, `
`);
  return Mg(i);
}
p(Og, "preprocessMarkdown");
function $g(e) {
  return e.split(/\\n|\n|<br\s*\/?>/gi).map(
    (t) => t.trim().match(/<[^>]+>|[^\s<>]+/g)?.map((r) => ({ content: r, type: "normal" })) ?? []
  );
}
p($g, "nonMarkdownToLines");
function Ig(e, t = {}) {
  const r = Og(e, t), i = Yt.lexer(r), s = [[]];
  let o = 0;
  function a(n, l = "normal") {
    n.type === "text" ? n.text.split(`
`).forEach((h, u) => {
      u !== 0 && (o++, s.push([])), h.split(" ").forEach((d) => {
        d = d.replace(/&#39;/g, "'"), d && s[o].push({ content: d, type: l });
      });
    }) : n.type === "strong" || n.type === "em" ? n.tokens.forEach((c) => {
      a(c, n.type);
    }) : n.type === "html" && s[o].push({ content: n.text, type: "normal" });
  }
  return p(a, "processNode"), i.forEach((n) => {
    n.type === "paragraph" ? n.tokens?.forEach((l) => {
      a(l);
    }) : n.type === "html" ? s[o].push({ content: n.text, type: "normal" }) : s[o].push({ content: n.raw, type: "normal" });
  }), s;
}
p(Ig, "markdownToLines");
function Dg(e) {
  return e ? `<p>${/**
  * Replace new lines with <br /> tags.
  *
  * Unlike in markdown text, `\n` sequences are treated as line breaks here.
  */
  e.replace(/\\n|\n/g, "<br />")}</p>` : "";
}
p(Dg, "nonMarkdownToHTML");
function Rg(e, { markdownAutoWrap: t } = {}) {
  const r = Yt.lexer(e);
  function i(s) {
    return s.type === "text" ? t === !1 ? s.text.replace(/\n */g, "<br/>").replace(/ /g, "&nbsp;") : s.text.replace(/\n */g, "<br/>") : s.type === "strong" ? `<strong>${s.tokens?.map(i).join("")}</strong>` : s.type === "em" ? `<em>${s.tokens?.map(i).join("")}</em>` : s.type === "paragraph" ? `<p>${s.tokens?.map(i).join("")}</p>` : s.type === "space" ? "" : s.type === "html" ? `${s.text}` : s.type === "escape" ? s.text : ($.warn(`Unsupported markdown: ${s.type}`), s.raw);
  }
  return p(i, "output"), r.map(i).join("");
}
p(Rg, "markdownToHTML");
function Pg(e) {
  return Intl.Segmenter ? [...new Intl.Segmenter().segment(e)].map((t) => t.segment) : [...e];
}
p(Pg, "splitTextToChars");
function Ng(e, t) {
  const r = Pg(t.content);
  return qh(e, [], r, t.type);
}
p(Ng, "splitWordToFitWidth");
function qh(e, t, r, i) {
  if (r.length === 0)
    return [
      { content: t.join(""), type: i },
      { content: "", type: i }
    ];
  const [s, ...o] = r, a = [...t, s];
  return e([{ content: a.join(""), type: i }]) ? qh(e, a, o, i) : (t.length === 0 && s && (t.push(s), r.shift()), [
    { content: t.join(""), type: i },
    { content: r.join(""), type: i }
  ]);
}
p(qh, "splitWordToFitWidthRecursion");
function qg(e, t) {
  if (e.some(({ content: r }) => r.includes(`
`)))
    throw new Error("splitLineToFitWidth does not support newlines in the line");
  return fa(e, t);
}
p(qg, "splitLineToFitWidth");
function fa(e, t, r = [], i = []) {
  if (e.length === 0)
    return i.length > 0 && r.push(i), r.length > 0 ? r : [];
  let s = "";
  e[0].content === " " && (s = " ", e.shift());
  const o = e.shift() ?? { content: " ", type: "normal" }, a = [...i];
  if (s !== "" && a.push({ content: s, type: "normal" }), a.push(o), t(a))
    return fa(e, t, r, a);
  if (i.length > 0)
    r.push(i), e.unshift(o);
  else if (o.content) {
    const [n, l] = Ng(t, o);
    r.push([n]), l.content && e.unshift(l);
  }
  return fa(e, t, r);
}
p(fa, "splitLineToFitWidthRecursion");
function Ol(e, t) {
  t && e.attr("style", t);
}
p(Ol, "applyStyle");
var Qu = 16384;
async function Wg(e, t, r, i, s = !1, o = jt()) {
  const a = e.append("foreignObject");
  a.attr("width", `${Math.min(10 * r, Qu)}px`), a.attr("height", `${Math.min(10 * r, Qu)}px`);
  const n = a.append("xhtml:div"), l = js(t.label) ? await sp(t.label.replace(oo.lineBreakRegex, `
`), o) : Pe(t.label, o), c = t.isNode ? "nodeLabel" : "edgeLabel", h = n.append("span");
  return h.html(l), Ol(h, t.labelStyle), h.attr("class", `${c} ${i}`), Ol(n, t.labelStyle), n.style("display", "table-cell"), n.style("white-space", "nowrap"), n.style("line-height", "1.5"), r !== Number.POSITIVE_INFINITY && (n.style("max-width", r + "px"), n.style("text-align", "center")), n.attr("xmlns", "http://www.w3.org/1999/xhtml"), s && n.attr("class", "labelBkg"), (await pi.measure(() => n.node().getBoundingClientRect())).width === r && (n.style("display", "table"), n.style("white-space", "break-spaces"), n.style("width", r + "px")), a.node();
}
p(Wg, "addHtmlSpan");
function Ma(e, t, r, i = !1) {
  const s = e.append("tspan").attr("class", "text-outer-tspan").attr("x", 0).attr("y", t * r - 0.1 + "em").attr("dy", r + "em");
  return i && s.attr("text-anchor", "middle"), s;
}
p(Ma, "createTspan");
function zg(e, t, r) {
  const i = e.append("text"), s = Ma(i, 1, t);
  Oa(s, r);
  const o = s.node().getComputedTextLength();
  return i.remove(), o;
}
p(zg, "computeWidthOfText");
function D_(e, t, r) {
  const i = e.append("text"), s = Ma(i, 1, t);
  Oa(s, [{ content: r, type: "normal" }]);
  const o = s.node()?.getBoundingClientRect();
  return o && i.remove(), o;
}
p(D_, "computeDimensionOfText");
function Hg(e, t, r, i = !1, s = !1) {
  const a = t.append("g"), n = a.insert("rect").attr("class", "background").attr("style", "stroke: none"), l = a.append("text").attr("y", "-10.1");
  s && l.attr("text-anchor", "middle");
  let c = 0;
  for (const h of r) {
    const u = /* @__PURE__ */ p((f) => zg(a, 1.1, f) <= e, "checkWidth"), d = u(h) ? [h] : qg(h, u);
    for (const f of d) {
      const m = Ma(l, c, 1.1, s);
      Oa(m, f), c++;
    }
  }
  if (i) {
    const h = l.node().getBBox(), u = 2;
    return n.attr("x", h.x - u).attr("y", h.y - u).attr("width", h.width + 2 * u).attr("height", h.height + 2 * u), a.node();
  } else
    return l.node();
}
p(Hg, "createFormattedText");
function $l(e) {
  const t = /&(amp|lt|gt);/g;
  return e.replace(t, (r, i) => {
    switch (i) {
      case "amp":
        return "&";
      case "lt":
        return "<";
      case "gt":
        return ">";
      default:
        return r;
    }
  });
}
p($l, "decodeHTMLEntities");
function Oa(e, t) {
  e.text(""), t.forEach((r, i) => {
    const s = e.append("tspan").attr("font-style", r.type === "em" ? "italic" : "normal").attr("class", "text-inner-tspan").attr("font-weight", r.type === "strong" ? "bold" : "normal");
    i === 0 ? s.text($l(r.content)) : s.text(" " + $l(r.content));
  });
}
p(Oa, "updateTextContentAndStyles");
async function Yg(e, t = {}) {
  const r = [];
  e.replace(/(fa[bklrs]?):fa-([\w-]+)/g, (s, o, a) => (r.push(
    (async () => {
      const n = `${o}:${a}`;
      return await XS(n) ? await lo(n, void 0, { class: "label-icon" }) : `<i class='${Pe(s, t).replace(":", " ")}'></i>`;
    })()
  ), s));
  const i = await Promise.all(r);
  return e.replace(/(fa[bklrs]?):fa-([\w-]+)/g, () => i.shift() ?? "");
}
p(Yg, "replaceIconSubstring");
var Qe = /* @__PURE__ */ p(async (e, t = "", {
  style: r = "",
  isTitle: i = !1,
  classes: s = "",
  useHtmlLabels: o = !0,
  markdown: a = !0,
  isNode: n = !0,
  /**
   * The width to wrap the text within. Set to `Number.POSITIVE_INFINITY` for no wrapping.
   */
  width: l = 200,
  addSvgBackground: c = !1
} = {}, h) => {
  if ($.debug(
    "XYZ createText",
    t,
    r,
    i,
    s,
    o,
    n,
    "addSvgBackground: ",
    c
  ), o) {
    const u = a ? Rg(t, h) : Dg(t), d = await Yg(Ur(u), h), f = t.replace(/\\\\/g, "\\"), m = {
      isNode: n,
      label: js(t) ? f : d,
      labelStyle: r.replace("fill:", "color:")
    };
    return await Wg(e, m, l, s, c, h);
  } else {
    const u = Ur(t.replace(/<br\s*\/?>/g, "<br/>")), d = a ? Ig(u.replace("<br>", "<br/>"), h) : $g(u), f = Hg(
      l,
      e,
      d,
      t ? c : !1,
      !n
    );
    if (n) {
      /stroke:/.exec(r) && (r = r.replace("stroke:", "lineColor:"));
      const m = r.replace(/stroke:[^;]+;?/g, "").replace(/stroke-width:[^;]+;?/g, "").replace(/fill:[^;]+;?/g, "").replace(/color:/g, "fill:");
      vt(f).attr("style", m);
    } else {
      const m = r.replace(/stroke:[^;]+;?/g, "").replace(/stroke-width:[^;]+;?/g, "").replace(/fill:[^;]+;?/g, "").replace(/background:/g, "fill:");
      vt(f).select("rect").attr("style", m.replace(/background:/g, "fill:"));
      const y = r.replace(/stroke:[^;]+;?/g, "").replace(/stroke-width:[^;]+;?/g, "").replace(/fill:[^;]+;?/g, "").replace(/color:/g, "fill:");
      vt(f).select("text").attr("style", y);
    }
    return i ? vt(f).selectAll("tspan.text-outer-tspan").classed("title-row", !0) : vt(f).selectAll("tspan.text-outer-tspan").classed("row", !0), f;
  }
}, "createText");
function Sn(e, t, r) {
  if (e && e.length) {
    const [i, s] = t, o = Math.PI / 180 * r, a = Math.cos(o), n = Math.sin(o);
    for (const l of e) {
      const [c, h] = l;
      l[0] = (c - i) * a - (h - s) * n + i, l[1] = (c - i) * n + (h - s) * a + s;
    }
  }
}
function R_(e, t) {
  return e[0] === t[0] && e[1] === t[1];
}
function P_(e, t, r, i = 1) {
  const s = r, o = Math.max(t, 0.1), a = e[0] && e[0][0] && typeof e[0][0] == "number" ? [e] : e, n = [0, 0];
  if (s) for (const c of a) Sn(c, n, s);
  const l = (function(c, h, u) {
    const d = [];
    for (const b of c) {
      const w = [...b];
      R_(w[0], w[w.length - 1]) || w.push([w[0][0], w[0][1]]), w.length > 2 && d.push(w);
    }
    const f = [];
    h = Math.max(h, 0.1);
    const m = [];
    for (const b of d) for (let w = 0; w < b.length - 1; w++) {
      const _ = b[w], B = b[w + 1];
      if (_[1] !== B[1]) {
        const A = Math.min(_[1], B[1]);
        m.push({ ymin: A, ymax: Math.max(_[1], B[1]), x: A === _[1] ? _[0] : B[0], islope: (B[0] - _[0]) / (B[1] - _[1]) });
      }
    }
    if (m.sort(((b, w) => b.ymin < w.ymin ? -1 : b.ymin > w.ymin ? 1 : b.x < w.x ? -1 : b.x > w.x ? 1 : b.ymax === w.ymax ? 0 : (b.ymax - w.ymax) / Math.abs(b.ymax - w.ymax))), !m.length) return f;
    let y = [], x = m[0].ymin, C = 0;
    for (; y.length || m.length; ) {
      if (m.length) {
        let b = -1;
        for (let w = 0; w < m.length && !(m[w].ymin > x); w++) b = w;
        m.splice(0, b + 1).forEach(((w) => {
          y.push({ s: x, edge: w });
        }));
      }
      if (y = y.filter(((b) => !(b.edge.ymax <= x))), y.sort(((b, w) => b.edge.x === w.edge.x ? 0 : (b.edge.x - w.edge.x) / Math.abs(b.edge.x - w.edge.x))), (u !== 1 || C % h == 0) && y.length > 1) for (let b = 0; b < y.length; b += 2) {
        const w = b + 1;
        if (w >= y.length) break;
        const _ = y[b].edge, B = y[w].edge;
        f.push([[Math.round(_.x), x], [Math.round(B.x), x]]);
      }
      x += u, y.forEach(((b) => {
        b.edge.x = b.edge.x + u * b.edge.islope;
      })), C++;
    }
    return f;
  })(a, o, i);
  if (s) {
    for (const c of a) Sn(c, n, -s);
    (function(c, h, u) {
      const d = [];
      c.forEach(((f) => d.push(...f))), Sn(d, h, u);
    })(l, n, -s);
  }
  return l;
}
function uo(e, t) {
  var r;
  const i = t.hachureAngle + 90;
  let s = t.hachureGap;
  s < 0 && (s = 4 * t.strokeWidth), s = Math.round(Math.max(s, 0.1));
  let o = 1;
  return t.roughness >= 1 && (((r = t.randomizer) === null || r === void 0 ? void 0 : r.next()) || Math.random()) > 0.7 && (o = s), P_(e, s, i, o || 1);
}
class Wh {
  constructor(t) {
    this.helper = t;
  }
  fillPolygons(t, r) {
    return this._fillPolygons(t, r);
  }
  _fillPolygons(t, r) {
    const i = uo(t, r);
    return { type: "fillSketch", ops: this.renderLines(i, r) };
  }
  renderLines(t, r) {
    const i = [];
    for (const s of t) i.push(...this.helper.doubleLineOps(s[0][0], s[0][1], s[1][0], s[1][1], r));
    return i;
  }
}
function $a(e) {
  const t = e[0], r = e[1];
  return Math.sqrt(Math.pow(t[0] - r[0], 2) + Math.pow(t[1] - r[1], 2));
}
class N_ extends Wh {
  fillPolygons(t, r) {
    let i = r.hachureGap;
    i < 0 && (i = 4 * r.strokeWidth), i = Math.max(i, 0.1);
    const s = uo(t, Object.assign({}, r, { hachureGap: i })), o = Math.PI / 180 * r.hachureAngle, a = [], n = 0.5 * i * Math.cos(o), l = 0.5 * i * Math.sin(o);
    for (const [c, h] of s) $a([c, h]) && a.push([[c[0] - n, c[1] + l], [...h]], [[c[0] + n, c[1] - l], [...h]]);
    return { type: "fillSketch", ops: this.renderLines(a, r) };
  }
}
class q_ extends Wh {
  fillPolygons(t, r) {
    const i = this._fillPolygons(t, r), s = Object.assign({}, r, { hachureAngle: r.hachureAngle + 90 }), o = this._fillPolygons(t, s);
    return i.ops = i.ops.concat(o.ops), i;
  }
}
class W_ {
  constructor(t) {
    this.helper = t;
  }
  fillPolygons(t, r) {
    const i = uo(t, r = Object.assign({}, r, { hachureAngle: 0 }));
    return this.dotsOnLines(i, r);
  }
  dotsOnLines(t, r) {
    const i = [];
    let s = r.hachureGap;
    s < 0 && (s = 4 * r.strokeWidth), s = Math.max(s, 0.1);
    let o = r.fillWeight;
    o < 0 && (o = r.strokeWidth / 2);
    const a = s / 4;
    for (const n of t) {
      const l = $a(n), c = l / s, h = Math.ceil(c) - 1, u = l - h * s, d = (n[0][0] + n[1][0]) / 2 - s / 4, f = Math.min(n[0][1], n[1][1]);
      for (let m = 0; m < h; m++) {
        const y = f + u + m * s, x = d - a + 2 * Math.random() * a, C = y - a + 2 * Math.random() * a, b = this.helper.ellipse(x, C, o, o, r);
        i.push(...b.ops);
      }
    }
    return { type: "fillSketch", ops: i };
  }
}
class z_ {
  constructor(t) {
    this.helper = t;
  }
  fillPolygons(t, r) {
    const i = uo(t, r);
    return { type: "fillSketch", ops: this.dashedLine(i, r) };
  }
  dashedLine(t, r) {
    const i = r.dashOffset < 0 ? r.hachureGap < 0 ? 4 * r.strokeWidth : r.hachureGap : r.dashOffset, s = r.dashGap < 0 ? r.hachureGap < 0 ? 4 * r.strokeWidth : r.hachureGap : r.dashGap, o = [];
    return t.forEach(((a) => {
      const n = $a(a), l = Math.floor(n / (i + s)), c = (n + s - l * (i + s)) / 2;
      let h = a[0], u = a[1];
      h[0] > u[0] && (h = a[1], u = a[0]);
      const d = Math.atan((u[1] - h[1]) / (u[0] - h[0]));
      for (let f = 0; f < l; f++) {
        const m = f * (i + s), y = m + i, x = [h[0] + m * Math.cos(d) + c * Math.cos(d), h[1] + m * Math.sin(d) + c * Math.sin(d)], C = [h[0] + y * Math.cos(d) + c * Math.cos(d), h[1] + y * Math.sin(d) + c * Math.sin(d)];
        o.push(...this.helper.doubleLineOps(x[0], x[1], C[0], C[1], r));
      }
    })), o;
  }
}
class H_ {
  constructor(t) {
    this.helper = t;
  }
  fillPolygons(t, r) {
    const i = r.hachureGap < 0 ? 4 * r.strokeWidth : r.hachureGap, s = r.zigzagOffset < 0 ? i : r.zigzagOffset, o = uo(t, r = Object.assign({}, r, { hachureGap: i + s }));
    return { type: "fillSketch", ops: this.zigzagLines(o, s, r) };
  }
  zigzagLines(t, r, i) {
    const s = [];
    return t.forEach(((o) => {
      const a = $a(o), n = Math.round(a / (2 * r));
      let l = o[0], c = o[1];
      l[0] > c[0] && (l = o[1], c = o[0]);
      const h = Math.atan((c[1] - l[1]) / (c[0] - l[0]));
      for (let u = 0; u < n; u++) {
        const d = 2 * u * r, f = 2 * (u + 1) * r, m = Math.sqrt(2 * Math.pow(r, 2)), y = [l[0] + d * Math.cos(h), l[1] + d * Math.sin(h)], x = [l[0] + f * Math.cos(h), l[1] + f * Math.sin(h)], C = [y[0] + m * Math.cos(h + Math.PI / 4), y[1] + m * Math.sin(h + Math.PI / 4)];
        s.push(...this.helper.doubleLineOps(y[0], y[1], C[0], C[1], i), ...this.helper.doubleLineOps(C[0], C[1], x[0], x[1], i));
      }
    })), s;
  }
}
const _e = {};
class Y_ {
  constructor(t) {
    this.seed = t;
  }
  next() {
    return this.seed ? (2 ** 31 - 1 & (this.seed = Math.imul(48271, this.seed))) / 2 ** 31 : Math.random();
  }
}
const U_ = 0, Tn = 1, Ju = 2, Ao = { A: 7, a: 7, C: 6, c: 6, H: 1, h: 1, L: 2, l: 2, M: 2, m: 2, Q: 4, q: 4, S: 4, s: 4, T: 2, t: 2, V: 1, v: 1, Z: 0, z: 0 };
function _n(e, t) {
  return e.type === t;
}
function zh(e) {
  const t = [], r = (function(a) {
    const n = new Array();
    for (; a !== ""; ) if (a.match(/^([ \t\r\n,]+)/)) a = a.substr(RegExp.$1.length);
    else if (a.match(/^([aAcChHlLmMqQsStTvVzZ])/)) n[n.length] = { type: U_, text: RegExp.$1 }, a = a.substr(RegExp.$1.length);
    else {
      if (!a.match(/^(([-+]?[0-9]+(\.[0-9]*)?|[-+]?\.[0-9]+)([eE][-+]?[0-9]+)?)/)) return [];
      n[n.length] = { type: Tn, text: `${parseFloat(RegExp.$1)}` }, a = a.substr(RegExp.$1.length);
    }
    return n[n.length] = { type: Ju, text: "" }, n;
  })(e);
  let i = "BOD", s = 0, o = r[s];
  for (; !_n(o, Ju); ) {
    let a = 0;
    const n = [];
    if (i === "BOD") {
      if (o.text !== "M" && o.text !== "m") return zh("M0,0" + e);
      s++, a = Ao[o.text], i = o.text;
    } else _n(o, Tn) ? a = Ao[i] : (s++, a = Ao[o.text], i = o.text);
    if (!(s + a < r.length)) throw new Error("Path data ended short");
    for (let l = s; l < s + a; l++) {
      const c = r[l];
      if (!_n(c, Tn)) throw new Error("Param not a number: " + i + "," + c.text);
      n[n.length] = +c.text;
    }
    if (typeof Ao[i] != "number") throw new Error("Bad segment: " + i);
    {
      const l = { key: i, data: n };
      t.push(l), s += a, o = r[s], i === "M" && (i = "L"), i === "m" && (i = "l");
    }
  }
  return t;
}
function Ug(e) {
  let t = 0, r = 0, i = 0, s = 0;
  const o = [];
  for (const { key: a, data: n } of e) switch (a) {
    case "M":
      o.push({ key: "M", data: [...n] }), [t, r] = n, [i, s] = n;
      break;
    case "m":
      t += n[0], r += n[1], o.push({ key: "M", data: [t, r] }), i = t, s = r;
      break;
    case "L":
      o.push({ key: "L", data: [...n] }), [t, r] = n;
      break;
    case "l":
      t += n[0], r += n[1], o.push({ key: "L", data: [t, r] });
      break;
    case "C":
      o.push({ key: "C", data: [...n] }), t = n[4], r = n[5];
      break;
    case "c": {
      const l = n.map(((c, h) => h % 2 ? c + r : c + t));
      o.push({ key: "C", data: l }), t = l[4], r = l[5];
      break;
    }
    case "Q":
      o.push({ key: "Q", data: [...n] }), t = n[2], r = n[3];
      break;
    case "q": {
      const l = n.map(((c, h) => h % 2 ? c + r : c + t));
      o.push({ key: "Q", data: l }), t = l[2], r = l[3];
      break;
    }
    case "A":
      o.push({ key: "A", data: [...n] }), t = n[5], r = n[6];
      break;
    case "a":
      t += n[5], r += n[6], o.push({ key: "A", data: [n[0], n[1], n[2], n[3], n[4], t, r] });
      break;
    case "H":
      o.push({ key: "H", data: [...n] }), t = n[0];
      break;
    case "h":
      t += n[0], o.push({ key: "H", data: [t] });
      break;
    case "V":
      o.push({ key: "V", data: [...n] }), r = n[0];
      break;
    case "v":
      r += n[0], o.push({ key: "V", data: [r] });
      break;
    case "S":
      o.push({ key: "S", data: [...n] }), t = n[2], r = n[3];
      break;
    case "s": {
      const l = n.map(((c, h) => h % 2 ? c + r : c + t));
      o.push({ key: "S", data: l }), t = l[2], r = l[3];
      break;
    }
    case "T":
      o.push({ key: "T", data: [...n] }), t = n[0], r = n[1];
      break;
    case "t":
      t += n[0], r += n[1], o.push({ key: "T", data: [t, r] });
      break;
    case "Z":
    case "z":
      o.push({ key: "Z", data: [] }), t = i, r = s;
  }
  return o;
}
function Xg(e) {
  const t = [];
  let r = "", i = 0, s = 0, o = 0, a = 0, n = 0, l = 0;
  for (const { key: c, data: h } of e) {
    switch (c) {
      case "M":
        t.push({ key: "M", data: [...h] }), [i, s] = h, [o, a] = h;
        break;
      case "C":
        t.push({ key: "C", data: [...h] }), i = h[4], s = h[5], n = h[2], l = h[3];
        break;
      case "L":
        t.push({ key: "L", data: [...h] }), [i, s] = h;
        break;
      case "H":
        i = h[0], t.push({ key: "L", data: [i, s] });
        break;
      case "V":
        s = h[0], t.push({ key: "L", data: [i, s] });
        break;
      case "S": {
        let u = 0, d = 0;
        r === "C" || r === "S" ? (u = i + (i - n), d = s + (s - l)) : (u = i, d = s), t.push({ key: "C", data: [u, d, ...h] }), n = h[0], l = h[1], i = h[2], s = h[3];
        break;
      }
      case "T": {
        const [u, d] = h;
        let f = 0, m = 0;
        r === "Q" || r === "T" ? (f = i + (i - n), m = s + (s - l)) : (f = i, m = s);
        const y = i + 2 * (f - i) / 3, x = s + 2 * (m - s) / 3, C = u + 2 * (f - u) / 3, b = d + 2 * (m - d) / 3;
        t.push({ key: "C", data: [y, x, C, b, u, d] }), n = f, l = m, i = u, s = d;
        break;
      }
      case "Q": {
        const [u, d, f, m] = h, y = i + 2 * (u - i) / 3, x = s + 2 * (d - s) / 3, C = f + 2 * (u - f) / 3, b = m + 2 * (d - m) / 3;
        t.push({ key: "C", data: [y, x, C, b, f, m] }), n = u, l = d, i = f, s = m;
        break;
      }
      case "A": {
        const u = Math.abs(h[0]), d = Math.abs(h[1]), f = h[2], m = h[3], y = h[4], x = h[5], C = h[6];
        u === 0 || d === 0 ? (t.push({ key: "C", data: [i, s, x, C, x, C] }), i = x, s = C) : (i !== x || s !== C) && (jg(i, s, x, C, u, d, f, m, y).forEach((function(b) {
          t.push({ key: "C", data: b });
        })), i = x, s = C);
        break;
      }
      case "Z":
        t.push({ key: "Z", data: [] }), i = o, s = a;
    }
    r = c;
  }
  return t;
}
function _s(e, t, r) {
  return [e * Math.cos(r) - t * Math.sin(r), e * Math.sin(r) + t * Math.cos(r)];
}
function jg(e, t, r, i, s, o, a, n, l, c) {
  const h = (u = a, Math.PI * u / 180);
  var u;
  let d = [], f = 0, m = 0, y = 0, x = 0;
  if (c) [f, m, y, x] = c;
  else {
    [e, t] = _s(e, t, -h), [r, i] = _s(r, i, -h);
    const Y = (e - r) / 2, U = (t - i) / 2;
    let Q = Y * Y / (s * s) + U * U / (o * o);
    Q > 1 && (Q = Math.sqrt(Q), s *= Q, o *= Q);
    const I = s * s, N = o * o, X = I * N - I * U * U - N * Y * Y, gt = I * U * U + N * Y * Y, lt = (n === l ? -1 : 1) * Math.sqrt(Math.abs(X / gt));
    y = lt * s * U / o + (e + r) / 2, x = lt * -o * Y / s + (t + i) / 2, f = Math.asin(parseFloat(((t - x) / o).toFixed(9))), m = Math.asin(parseFloat(((i - x) / o).toFixed(9))), e < y && (f = Math.PI - f), r < y && (m = Math.PI - m), f < 0 && (f = 2 * Math.PI + f), m < 0 && (m = 2 * Math.PI + m), l && f > m && (f -= 2 * Math.PI), !l && m > f && (m -= 2 * Math.PI);
  }
  let C = m - f;
  if (Math.abs(C) > 120 * Math.PI / 180) {
    const Y = m, U = r, Q = i;
    m = l && m > f ? f + 120 * Math.PI / 180 * 1 : f + 120 * Math.PI / 180 * -1, d = jg(r = y + s * Math.cos(m), i = x + o * Math.sin(m), U, Q, s, o, a, 0, l, [m, Y, y, x]);
  }
  C = m - f;
  const b = Math.cos(f), w = Math.sin(f), _ = Math.cos(m), B = Math.sin(m), A = Math.tan(C / 4), v = 4 / 3 * s * A, L = 4 / 3 * o * A, W = [e, t], H = [e + v * w, t - L * b], D = [r + v * B, i - L * _], st = [r, i];
  if (H[0] = 2 * W[0] - H[0], H[1] = 2 * W[1] - H[1], c) return [H, D, st].concat(d);
  {
    d = [H, D, st].concat(d);
    const Y = [];
    for (let U = 0; U < d.length; U += 3) {
      const Q = _s(d[U][0], d[U][1], h), I = _s(d[U + 1][0], d[U + 1][1], h), N = _s(d[U + 2][0], d[U + 2][1], h);
      Y.push([Q[0], Q[1], I[0], I[1], N[0], N[1]]);
    }
    return Y;
  }
}
const X_ = { randOffset: function(e, t) {
  return bt(e, t);
}, randOffsetWithRange: function(e, t, r) {
  return pa(e, t, r);
}, ellipse: function(e, t, r, i, s) {
  const o = Vg(r, i, s);
  return Il(e, t, s, o).opset;
}, doubleLineOps: function(e, t, r, i, s) {
  return Xr(e, t, r, i, s, !0);
} };
function Gg(e, t, r, i, s) {
  return { type: "path", ops: Xr(e, t, r, i, s) };
}
function Yo(e, t, r) {
  const i = (e || []).length;
  if (i > 2) {
    const s = [];
    for (let o = 0; o < i - 1; o++) s.push(...Xr(e[o][0], e[o][1], e[o + 1][0], e[o + 1][1], r));
    return t && s.push(...Xr(e[i - 1][0], e[i - 1][1], e[0][0], e[0][1], r)), { type: "path", ops: s };
  }
  return i === 2 ? Gg(e[0][0], e[0][1], e[1][0], e[1][1], r) : { type: "path", ops: [] };
}
function j_(e, t, r, i, s) {
  return (function(o, a) {
    return Yo(o, !0, a);
  })([[e, t], [e + r, t], [e + r, t + i], [e, t + i]], s);
}
function td(e, t) {
  if (e.length) {
    const r = typeof e[0][0] == "number" ? [e] : e, i = Eo(r[0], 1 * (1 + 0.2 * t.roughness), t), s = t.disableMultiStroke ? [] : Eo(r[0], 1.5 * (1 + 0.22 * t.roughness), id(t));
    for (let o = 1; o < r.length; o++) {
      const a = r[o];
      if (a.length) {
        const n = Eo(a, 1 * (1 + 0.2 * t.roughness), t), l = t.disableMultiStroke ? [] : Eo(a, 1.5 * (1 + 0.22 * t.roughness), id(t));
        for (const c of n) c.op !== "move" && i.push(c);
        for (const c of l) c.op !== "move" && s.push(c);
      }
    }
    return { type: "path", ops: i.concat(s) };
  }
  return { type: "path", ops: [] };
}
function Vg(e, t, r) {
  const i = Math.sqrt(2 * Math.PI * Math.sqrt((Math.pow(e / 2, 2) + Math.pow(t / 2, 2)) / 2)), s = Math.ceil(Math.max(r.curveStepCount, r.curveStepCount / Math.sqrt(200) * i)), o = 2 * Math.PI / s;
  let a = Math.abs(e / 2), n = Math.abs(t / 2);
  const l = 1 - r.curveFitting;
  return a += bt(a * l, r), n += bt(n * l, r), { increment: o, rx: a, ry: n };
}
function Il(e, t, r, i) {
  const [s, o] = sd(i.increment, e, t, i.rx, i.ry, 1, i.increment * pa(0.1, pa(0.4, 1, r), r), r);
  let a = ga(s, null, r);
  if (!r.disableMultiStroke && r.roughness !== 0) {
    const [n] = sd(i.increment, e, t, i.rx, i.ry, 1.5, 0, r), l = ga(n, null, r);
    a = a.concat(l);
  }
  return { estimatedPoints: o, opset: { type: "path", ops: a } };
}
function ed(e, t, r, i, s, o, a, n, l) {
  const c = e, h = t;
  let u = Math.abs(r / 2), d = Math.abs(i / 2);
  u += bt(0.01 * u, l), d += bt(0.01 * d, l);
  let f = s, m = o;
  for (; f < 0; ) f += 2 * Math.PI, m += 2 * Math.PI;
  m - f > 2 * Math.PI && (f = 0, m = 2 * Math.PI);
  const y = 2 * Math.PI / l.curveStepCount, x = Math.min(y / 2, (m - f) / 2), C = od(x, c, h, u, d, f, m, 1, l);
  if (!l.disableMultiStroke) {
    const b = od(x, c, h, u, d, f, m, 1.5, l);
    C.push(...b);
  }
  return a && (n ? C.push(...Xr(c, h, c + u * Math.cos(f), h + d * Math.sin(f), l), ...Xr(c, h, c + u * Math.cos(m), h + d * Math.sin(m), l)) : C.push({ op: "lineTo", data: [c, h] }, { op: "lineTo", data: [c + u * Math.cos(f), h + d * Math.sin(f)] })), { type: "path", ops: C };
}
function rd(e, t) {
  const r = Xg(Ug(zh(e))), i = [];
  let s = [0, 0], o = [0, 0];
  for (const { key: a, data: n } of r) switch (a) {
    case "M":
      o = [n[0], n[1]], s = [n[0], n[1]];
      break;
    case "L":
      i.push(...Xr(o[0], o[1], n[0], n[1], t)), o = [n[0], n[1]];
      break;
    case "C": {
      const [l, c, h, u, d, f] = n;
      i.push(...G_(l, c, h, u, d, f, o, t)), o = [d, f];
      break;
    }
    case "Z":
      i.push(...Xr(o[0], o[1], s[0], s[1], t)), o = [s[0], s[1]];
  }
  return { type: "path", ops: i };
}
function Bn(e, t) {
  const r = [];
  for (const i of e) if (i.length) {
    const s = t.maxRandomnessOffset || 0, o = i.length;
    if (o > 2) {
      r.push({ op: "move", data: [i[0][0] + bt(s, t), i[0][1] + bt(s, t)] });
      for (let a = 1; a < o; a++) r.push({ op: "lineTo", data: [i[a][0] + bt(s, t), i[a][1] + bt(s, t)] });
    }
  }
  return { type: "fillPath", ops: r };
}
function Bi(e, t) {
  return (function(r, i) {
    let s = r.fillStyle || "hachure";
    if (!_e[s]) switch (s) {
      case "zigzag":
        _e[s] || (_e[s] = new N_(i));
        break;
      case "cross-hatch":
        _e[s] || (_e[s] = new q_(i));
        break;
      case "dots":
        _e[s] || (_e[s] = new W_(i));
        break;
      case "dashed":
        _e[s] || (_e[s] = new z_(i));
        break;
      case "zigzag-line":
        _e[s] || (_e[s] = new H_(i));
        break;
      default:
        s = "hachure", _e[s] || (_e[s] = new Wh(i));
    }
    return _e[s];
  })(t, X_).fillPolygons(e, t);
}
function id(e) {
  const t = Object.assign({}, e);
  return t.randomizer = void 0, e.seed && (t.seed = e.seed + 1), t;
}
function Kg(e) {
  return e.randomizer || (e.randomizer = new Y_(e.seed || 0)), e.randomizer.next();
}
function pa(e, t, r, i = 1) {
  return r.roughness * i * (Kg(r) * (t - e) + e);
}
function bt(e, t, r = 1) {
  return pa(-e, e, t, r);
}
function Xr(e, t, r, i, s, o = !1) {
  const a = o ? s.disableMultiStrokeFill : s.disableMultiStroke, n = Dl(e, t, r, i, s, !0, !1);
  if (a) return n;
  const l = Dl(e, t, r, i, s, !0, !0);
  return n.concat(l);
}
function Dl(e, t, r, i, s, o, a) {
  const n = Math.pow(e - r, 2) + Math.pow(t - i, 2), l = Math.sqrt(n);
  let c = 1;
  c = l < 200 ? 1 : l > 500 ? 0.4 : -16668e-7 * l + 1.233334;
  let h = s.maxRandomnessOffset || 0;
  h * h * 100 > n && (h = l / 10);
  const u = h / 2, d = 0.2 + 0.2 * Kg(s);
  let f = s.bowing * s.maxRandomnessOffset * (i - t) / 200, m = s.bowing * s.maxRandomnessOffset * (e - r) / 200;
  f = bt(f, s, c), m = bt(m, s, c);
  const y = [], x = () => bt(u, s, c), C = () => bt(h, s, c), b = s.preserveVertices;
  return a ? y.push({ op: "move", data: [e + (b ? 0 : x()), t + (b ? 0 : x())] }) : y.push({ op: "move", data: [e + (b ? 0 : bt(h, s, c)), t + (b ? 0 : bt(h, s, c))] }), a ? y.push({ op: "bcurveTo", data: [f + e + (r - e) * d + x(), m + t + (i - t) * d + x(), f + e + 2 * (r - e) * d + x(), m + t + 2 * (i - t) * d + x(), r + (b ? 0 : x()), i + (b ? 0 : x())] }) : y.push({ op: "bcurveTo", data: [f + e + (r - e) * d + C(), m + t + (i - t) * d + C(), f + e + 2 * (r - e) * d + C(), m + t + 2 * (i - t) * d + C(), r + (b ? 0 : C()), i + (b ? 0 : C())] }), y;
}
function Eo(e, t, r) {
  if (!e.length) return [];
  const i = [];
  i.push([e[0][0] + bt(t, r), e[0][1] + bt(t, r)]), i.push([e[0][0] + bt(t, r), e[0][1] + bt(t, r)]);
  for (let s = 1; s < e.length; s++) i.push([e[s][0] + bt(t, r), e[s][1] + bt(t, r)]), s === e.length - 1 && i.push([e[s][0] + bt(t, r), e[s][1] + bt(t, r)]);
  return ga(i, null, r);
}
function ga(e, t, r) {
  const i = e.length, s = [];
  if (i > 3) {
    const o = [], a = 1 - r.curveTightness;
    s.push({ op: "move", data: [e[1][0], e[1][1]] });
    for (let n = 1; n + 2 < i; n++) {
      const l = e[n];
      o[0] = [l[0], l[1]], o[1] = [l[0] + (a * e[n + 1][0] - a * e[n - 1][0]) / 6, l[1] + (a * e[n + 1][1] - a * e[n - 1][1]) / 6], o[2] = [e[n + 1][0] + (a * e[n][0] - a * e[n + 2][0]) / 6, e[n + 1][1] + (a * e[n][1] - a * e[n + 2][1]) / 6], o[3] = [e[n + 1][0], e[n + 1][1]], s.push({ op: "bcurveTo", data: [o[1][0], o[1][1], o[2][0], o[2][1], o[3][0], o[3][1]] });
    }
  } else i === 3 ? (s.push({ op: "move", data: [e[1][0], e[1][1]] }), s.push({ op: "bcurveTo", data: [e[1][0], e[1][1], e[2][0], e[2][1], e[2][0], e[2][1]] })) : i === 2 && s.push(...Dl(e[0][0], e[0][1], e[1][0], e[1][1], r, !0, !0));
  return s;
}
function sd(e, t, r, i, s, o, a, n) {
  const l = [], c = [];
  if (n.roughness === 0) {
    e /= 4, c.push([t + i * Math.cos(-e), r + s * Math.sin(-e)]);
    for (let h = 0; h <= 2 * Math.PI; h += e) {
      const u = [t + i * Math.cos(h), r + s * Math.sin(h)];
      l.push(u), c.push(u);
    }
    c.push([t + i * Math.cos(0), r + s * Math.sin(0)]), c.push([t + i * Math.cos(e), r + s * Math.sin(e)]);
  } else {
    const h = bt(0.5, n) - Math.PI / 2;
    c.push([bt(o, n) + t + 0.9 * i * Math.cos(h - e), bt(o, n) + r + 0.9 * s * Math.sin(h - e)]);
    const u = 2 * Math.PI + h - 0.01;
    for (let d = h; d < u; d += e) {
      const f = [bt(o, n) + t + i * Math.cos(d), bt(o, n) + r + s * Math.sin(d)];
      l.push(f), c.push(f);
    }
    c.push([bt(o, n) + t + i * Math.cos(h + 2 * Math.PI + 0.5 * a), bt(o, n) + r + s * Math.sin(h + 2 * Math.PI + 0.5 * a)]), c.push([bt(o, n) + t + 0.98 * i * Math.cos(h + a), bt(o, n) + r + 0.98 * s * Math.sin(h + a)]), c.push([bt(o, n) + t + 0.9 * i * Math.cos(h + 0.5 * a), bt(o, n) + r + 0.9 * s * Math.sin(h + 0.5 * a)]);
  }
  return [c, l];
}
function od(e, t, r, i, s, o, a, n, l) {
  const c = o + bt(0.1, l), h = [];
  h.push([bt(n, l) + t + 0.9 * i * Math.cos(c - e), bt(n, l) + r + 0.9 * s * Math.sin(c - e)]);
  for (let u = c; u <= a; u += e) h.push([bt(n, l) + t + i * Math.cos(u), bt(n, l) + r + s * Math.sin(u)]);
  return h.push([t + i * Math.cos(a), r + s * Math.sin(a)]), h.push([t + i * Math.cos(a), r + s * Math.sin(a)]), ga(h, null, l);
}
function G_(e, t, r, i, s, o, a, n) {
  const l = [], c = [n.maxRandomnessOffset || 1, (n.maxRandomnessOffset || 1) + 0.3];
  let h = [0, 0];
  const u = n.disableMultiStroke ? 1 : 2, d = n.preserveVertices;
  for (let f = 0; f < u; f++) f === 0 ? l.push({ op: "move", data: [a[0], a[1]] }) : l.push({ op: "move", data: [a[0] + (d ? 0 : bt(c[0], n)), a[1] + (d ? 0 : bt(c[0], n))] }), h = d ? [s, o] : [s + bt(c[f], n), o + bt(c[f], n)], l.push({ op: "bcurveTo", data: [e + bt(c[f], n), t + bt(c[f], n), r + bt(c[f], n), i + bt(c[f], n), h[0], h[1]] });
  return l;
}
function Bs(e) {
  return [...e];
}
function ad(e, t = 0) {
  const r = e.length;
  if (r < 3) throw new Error("A curve must have at least three points.");
  const i = [];
  if (r === 3) i.push(Bs(e[0]), Bs(e[1]), Bs(e[2]), Bs(e[2]));
  else {
    const s = [];
    s.push(e[0], e[0]);
    for (let n = 1; n < e.length; n++) s.push(e[n]), n === e.length - 1 && s.push(e[n]);
    const o = [], a = 1 - t;
    i.push(Bs(s[0]));
    for (let n = 1; n + 2 < s.length; n++) {
      const l = s[n];
      o[0] = [l[0], l[1]], o[1] = [l[0] + (a * s[n + 1][0] - a * s[n - 1][0]) / 6, l[1] + (a * s[n + 1][1] - a * s[n - 1][1]) / 6], o[2] = [s[n + 1][0] + (a * s[n][0] - a * s[n + 2][0]) / 6, s[n + 1][1] + (a * s[n][1] - a * s[n + 2][1]) / 6], o[3] = [s[n + 1][0], s[n + 1][1]], i.push(o[1], o[2], o[3]);
    }
  }
  return i;
}
function Uo(e, t) {
  return Math.pow(e[0] - t[0], 2) + Math.pow(e[1] - t[1], 2);
}
function V_(e, t, r) {
  const i = Uo(t, r);
  if (i === 0) return Uo(e, t);
  let s = ((e[0] - t[0]) * (r[0] - t[0]) + (e[1] - t[1]) * (r[1] - t[1])) / i;
  return s = Math.max(0, Math.min(1, s)), Uo(e, ei(t, r, s));
}
function ei(e, t, r) {
  return [e[0] + (t[0] - e[0]) * r, e[1] + (t[1] - e[1]) * r];
}
function Rl(e, t, r, i) {
  const s = i || [];
  if ((function(n, l) {
    const c = n[l + 0], h = n[l + 1], u = n[l + 2], d = n[l + 3];
    let f = 3 * h[0] - 2 * c[0] - d[0];
    f *= f;
    let m = 3 * h[1] - 2 * c[1] - d[1];
    m *= m;
    let y = 3 * u[0] - 2 * d[0] - c[0];
    y *= y;
    let x = 3 * u[1] - 2 * d[1] - c[1];
    return x *= x, f < y && (f = y), m < x && (m = x), f + m;
  })(e, t) < r) {
    const n = e[t + 0];
    s.length ? (o = s[s.length - 1], a = n, Math.sqrt(Uo(o, a)) > 1 && s.push(n)) : s.push(n), s.push(e[t + 3]);
  } else {
    const l = e[t + 0], c = e[t + 1], h = e[t + 2], u = e[t + 3], d = ei(l, c, 0.5), f = ei(c, h, 0.5), m = ei(h, u, 0.5), y = ei(d, f, 0.5), x = ei(f, m, 0.5), C = ei(y, x, 0.5);
    Rl([l, d, y, C], 0, r, s), Rl([C, x, m, u], 0, r, s);
  }
  var o, a;
  return s;
}
function K_(e, t) {
  return ma(e, 0, e.length, t);
}
function ma(e, t, r, i, s) {
  const o = s || [], a = e[t], n = e[r - 1];
  let l = 0, c = 1;
  for (let h = t + 1; h < r - 1; ++h) {
    const u = V_(e[h], a, n);
    u > l && (l = u, c = h);
  }
  return Math.sqrt(l) > i ? (ma(e, t, c + 1, i, o), ma(e, c, r, i, o)) : (o.length || o.push(a), o.push(n)), o;
}
function vn(e, t = 0.15, r) {
  const i = [], s = (e.length - 1) / 3;
  for (let o = 0; o < s; o++)
    Rl(e, 3 * o, t, i);
  return r && r > 0 ? ma(i, 0, i.length, r) : i;
}
const Ee = "none";
class ya {
  constructor(t) {
    this.defaultOptions = { maxRandomnessOffset: 2, roughness: 1, bowing: 1, stroke: "#000", strokeWidth: 1, curveTightness: 0, curveFitting: 0.95, curveStepCount: 9, fillStyle: "hachure", fillWeight: -1, hachureAngle: -41, hachureGap: -1, dashOffset: -1, dashGap: -1, zigzagOffset: -1, seed: 0, disableMultiStroke: !1, disableMultiStrokeFill: !1, preserveVertices: !1, fillShapeRoughnessGain: 0.8 }, this.config = t || {}, this.config.options && (this.defaultOptions = this._o(this.config.options));
  }
  static newSeed() {
    return Math.floor(Math.random() * 2 ** 31);
  }
  _o(t) {
    return t ? Object.assign({}, this.defaultOptions, t) : this.defaultOptions;
  }
  _d(t, r, i) {
    return { shape: t, sets: r || [], options: i || this.defaultOptions };
  }
  line(t, r, i, s, o) {
    const a = this._o(o);
    return this._d("line", [Gg(t, r, i, s, a)], a);
  }
  rectangle(t, r, i, s, o) {
    const a = this._o(o), n = [], l = j_(t, r, i, s, a);
    if (a.fill) {
      const c = [[t, r], [t + i, r], [t + i, r + s], [t, r + s]];
      a.fillStyle === "solid" ? n.push(Bn([c], a)) : n.push(Bi([c], a));
    }
    return a.stroke !== Ee && n.push(l), this._d("rectangle", n, a);
  }
  ellipse(t, r, i, s, o) {
    const a = this._o(o), n = [], l = Vg(i, s, a), c = Il(t, r, a, l);
    if (a.fill) if (a.fillStyle === "solid") {
      const h = Il(t, r, a, l).opset;
      h.type = "fillPath", n.push(h);
    } else n.push(Bi([c.estimatedPoints], a));
    return a.stroke !== Ee && n.push(c.opset), this._d("ellipse", n, a);
  }
  circle(t, r, i, s) {
    const o = this.ellipse(t, r, i, i, s);
    return o.shape = "circle", o;
  }
  linearPath(t, r) {
    const i = this._o(r);
    return this._d("linearPath", [Yo(t, !1, i)], i);
  }
  arc(t, r, i, s, o, a, n = !1, l) {
    const c = this._o(l), h = [], u = ed(t, r, i, s, o, a, n, !0, c);
    if (n && c.fill) if (c.fillStyle === "solid") {
      const d = Object.assign({}, c);
      d.disableMultiStroke = !0;
      const f = ed(t, r, i, s, o, a, !0, !1, d);
      f.type = "fillPath", h.push(f);
    } else h.push((function(d, f, m, y, x, C, b) {
      const w = d, _ = f;
      let B = Math.abs(m / 2), A = Math.abs(y / 2);
      B += bt(0.01 * B, b), A += bt(0.01 * A, b);
      let v = x, L = C;
      for (; v < 0; ) v += 2 * Math.PI, L += 2 * Math.PI;
      L - v > 2 * Math.PI && (v = 0, L = 2 * Math.PI);
      const W = (L - v) / b.curveStepCount, H = [];
      for (let D = v; D <= L; D += W) H.push([w + B * Math.cos(D), _ + A * Math.sin(D)]);
      return H.push([w + B * Math.cos(L), _ + A * Math.sin(L)]), H.push([w, _]), Bi([H], b);
    })(t, r, i, s, o, a, c));
    return c.stroke !== Ee && h.push(u), this._d("arc", h, c);
  }
  curve(t, r) {
    const i = this._o(r), s = [], o = td(t, i);
    if (i.fill && i.fill !== Ee) if (i.fillStyle === "solid") {
      const a = td(t, Object.assign(Object.assign({}, i), { disableMultiStroke: !0, roughness: i.roughness ? i.roughness + i.fillShapeRoughnessGain : 0 }));
      s.push({ type: "fillPath", ops: this._mergedShape(a.ops) });
    } else {
      const a = [], n = t;
      if (n.length) {
        const l = typeof n[0][0] == "number" ? [n] : n;
        for (const c of l) c.length < 3 ? a.push(...c) : c.length === 3 ? a.push(...vn(ad([c[0], c[0], c[1], c[2]]), 10, (1 + i.roughness) / 2)) : a.push(...vn(ad(c), 10, (1 + i.roughness) / 2));
      }
      a.length && s.push(Bi([a], i));
    }
    return i.stroke !== Ee && s.push(o), this._d("curve", s, i);
  }
  polygon(t, r) {
    const i = this._o(r), s = [], o = Yo(t, !0, i);
    return i.fill && (i.fillStyle === "solid" ? s.push(Bn([t], i)) : s.push(Bi([t], i))), i.stroke !== Ee && s.push(o), this._d("polygon", s, i);
  }
  path(t, r) {
    const i = this._o(r), s = [];
    if (!t) return this._d("path", s, i);
    t = (t || "").replace(/\n/g, " ").replace(/(-\s)/g, "-").replace("/(ss)/g", " ");
    const o = i.fill && i.fill !== "transparent" && i.fill !== Ee, a = i.stroke !== Ee, n = !!(i.simplification && i.simplification < 1), l = (function(h, u, d) {
      const f = Xg(Ug(zh(h))), m = [];
      let y = [], x = [0, 0], C = [];
      const b = () => {
        C.length >= 4 && y.push(...vn(C, u)), C = [];
      }, w = () => {
        b(), y.length && (m.push(y), y = []);
      };
      for (const { key: B, data: A } of f) switch (B) {
        case "M":
          w(), x = [A[0], A[1]], y.push(x);
          break;
        case "L":
          b(), y.push([A[0], A[1]]);
          break;
        case "C":
          if (!C.length) {
            const v = y.length ? y[y.length - 1] : x;
            C.push([v[0], v[1]]);
          }
          C.push([A[0], A[1]]), C.push([A[2], A[3]]), C.push([A[4], A[5]]);
          break;
        case "Z":
          b(), y.push([x[0], x[1]]);
      }
      if (w(), !d) return m;
      const _ = [];
      for (const B of m) {
        const A = K_(B, d);
        A.length && _.push(A);
      }
      return _;
    })(t, 1, n ? 4 - 4 * (i.simplification || 1) : (1 + i.roughness) / 2), c = rd(t, i);
    if (o) if (i.fillStyle === "solid") if (l.length === 1) {
      const h = rd(t, Object.assign(Object.assign({}, i), { disableMultiStroke: !0, roughness: i.roughness ? i.roughness + i.fillShapeRoughnessGain : 0 }));
      s.push({ type: "fillPath", ops: this._mergedShape(h.ops) });
    } else s.push(Bn(l, i));
    else s.push(Bi(l, i));
    return a && (n ? l.forEach(((h) => {
      s.push(Yo(h, !1, i));
    })) : s.push(c)), this._d("path", s, i);
  }
  opsToPath(t, r) {
    let i = "";
    for (const s of t.ops) {
      const o = typeof r == "number" && r >= 0 ? s.data.map(((a) => +a.toFixed(r))) : s.data;
      switch (s.op) {
        case "move":
          i += `M${o[0]} ${o[1]} `;
          break;
        case "bcurveTo":
          i += `C${o[0]} ${o[1]}, ${o[2]} ${o[3]}, ${o[4]} ${o[5]} `;
          break;
        case "lineTo":
          i += `L${o[0]} ${o[1]} `;
      }
    }
    return i.trim();
  }
  toPaths(t) {
    const r = t.sets || [], i = t.options || this.defaultOptions, s = [];
    for (const o of r) {
      let a = null;
      switch (o.type) {
        case "path":
          a = { d: this.opsToPath(o), stroke: i.stroke, strokeWidth: i.strokeWidth, fill: Ee };
          break;
        case "fillPath":
          a = { d: this.opsToPath(o), stroke: Ee, strokeWidth: 0, fill: i.fill || Ee };
          break;
        case "fillSketch":
          a = this.fillSketch(o, i);
      }
      a && s.push(a);
    }
    return s;
  }
  fillSketch(t, r) {
    let i = r.fillWeight;
    return i < 0 && (i = r.strokeWidth / 2), { d: this.opsToPath(t), stroke: r.fill || Ee, strokeWidth: i, fill: Ee };
  }
  _mergedShape(t) {
    return t.filter(((r, i) => i === 0 || r.op !== "move"));
  }
}
class Z_ {
  constructor(t, r) {
    this.canvas = t, this.ctx = this.canvas.getContext("2d"), this.gen = new ya(r);
  }
  draw(t) {
    const r = t.sets || [], i = t.options || this.getDefaultOptions(), s = this.ctx, o = t.options.fixedDecimalPlaceDigits;
    for (const a of r) switch (a.type) {
      case "path":
        s.save(), s.strokeStyle = i.stroke === "none" ? "transparent" : i.stroke, s.lineWidth = i.strokeWidth, i.strokeLineDash && s.setLineDash(i.strokeLineDash), i.strokeLineDashOffset && (s.lineDashOffset = i.strokeLineDashOffset), this._drawToContext(s, a, o), s.restore();
        break;
      case "fillPath": {
        s.save(), s.fillStyle = i.fill || "";
        const n = t.shape === "curve" || t.shape === "polygon" || t.shape === "path" ? "evenodd" : "nonzero";
        this._drawToContext(s, a, o, n), s.restore();
        break;
      }
      case "fillSketch":
        this.fillSketch(s, a, i);
    }
  }
  fillSketch(t, r, i) {
    let s = i.fillWeight;
    s < 0 && (s = i.strokeWidth / 2), t.save(), i.fillLineDash && t.setLineDash(i.fillLineDash), i.fillLineDashOffset && (t.lineDashOffset = i.fillLineDashOffset), t.strokeStyle = i.fill || "", t.lineWidth = s, this._drawToContext(t, r, i.fixedDecimalPlaceDigits), t.restore();
  }
  _drawToContext(t, r, i, s = "nonzero") {
    t.beginPath();
    for (const o of r.ops) {
      const a = typeof i == "number" && i >= 0 ? o.data.map(((n) => +n.toFixed(i))) : o.data;
      switch (o.op) {
        case "move":
          t.moveTo(a[0], a[1]);
          break;
        case "bcurveTo":
          t.bezierCurveTo(a[0], a[1], a[2], a[3], a[4], a[5]);
          break;
        case "lineTo":
          t.lineTo(a[0], a[1]);
      }
    }
    r.type === "fillPath" ? t.fill(s) : t.stroke();
  }
  get generator() {
    return this.gen;
  }
  getDefaultOptions() {
    return this.gen.defaultOptions;
  }
  line(t, r, i, s, o) {
    const a = this.gen.line(t, r, i, s, o);
    return this.draw(a), a;
  }
  rectangle(t, r, i, s, o) {
    const a = this.gen.rectangle(t, r, i, s, o);
    return this.draw(a), a;
  }
  ellipse(t, r, i, s, o) {
    const a = this.gen.ellipse(t, r, i, s, o);
    return this.draw(a), a;
  }
  circle(t, r, i, s) {
    const o = this.gen.circle(t, r, i, s);
    return this.draw(o), o;
  }
  linearPath(t, r) {
    const i = this.gen.linearPath(t, r);
    return this.draw(i), i;
  }
  polygon(t, r) {
    const i = this.gen.polygon(t, r);
    return this.draw(i), i;
  }
  arc(t, r, i, s, o, a, n = !1, l) {
    const c = this.gen.arc(t, r, i, s, o, a, n, l);
    return this.draw(c), c;
  }
  curve(t, r) {
    const i = this.gen.curve(t, r);
    return this.draw(i), i;
  }
  path(t, r) {
    const i = this.gen.path(t, r);
    return this.draw(i), i;
  }
}
const Fo = "http://www.w3.org/2000/svg";
class Q_ {
  constructor(t, r) {
    this.svg = t, this.gen = new ya(r);
  }
  draw(t) {
    const r = t.sets || [], i = t.options || this.getDefaultOptions(), s = this.svg.ownerDocument || window.document, o = s.createElementNS(Fo, "g"), a = t.options.fixedDecimalPlaceDigits;
    for (const n of r) {
      let l = null;
      switch (n.type) {
        case "path":
          l = s.createElementNS(Fo, "path"), l.setAttribute("d", this.opsToPath(n, a)), l.setAttribute("stroke", i.stroke), l.setAttribute("stroke-width", i.strokeWidth + ""), l.setAttribute("fill", "none"), i.strokeLineDash && l.setAttribute("stroke-dasharray", i.strokeLineDash.join(" ").trim()), i.strokeLineDashOffset && l.setAttribute("stroke-dashoffset", `${i.strokeLineDashOffset}`);
          break;
        case "fillPath":
          l = s.createElementNS(Fo, "path"), l.setAttribute("d", this.opsToPath(n, a)), l.setAttribute("stroke", "none"), l.setAttribute("stroke-width", "0"), l.setAttribute("fill", i.fill || ""), t.shape !== "curve" && t.shape !== "polygon" || l.setAttribute("fill-rule", "evenodd");
          break;
        case "fillSketch":
          l = this.fillSketch(s, n, i);
      }
      l && o.appendChild(l);
    }
    return o;
  }
  fillSketch(t, r, i) {
    let s = i.fillWeight;
    s < 0 && (s = i.strokeWidth / 2);
    const o = t.createElementNS(Fo, "path");
    return o.setAttribute("d", this.opsToPath(r, i.fixedDecimalPlaceDigits)), o.setAttribute("stroke", i.fill || ""), o.setAttribute("stroke-width", s + ""), o.setAttribute("fill", "none"), i.fillLineDash && o.setAttribute("stroke-dasharray", i.fillLineDash.join(" ").trim()), i.fillLineDashOffset && o.setAttribute("stroke-dashoffset", `${i.fillLineDashOffset}`), o;
  }
  get generator() {
    return this.gen;
  }
  getDefaultOptions() {
    return this.gen.defaultOptions;
  }
  opsToPath(t, r) {
    return this.gen.opsToPath(t, r);
  }
  line(t, r, i, s, o) {
    const a = this.gen.line(t, r, i, s, o);
    return this.draw(a);
  }
  rectangle(t, r, i, s, o) {
    const a = this.gen.rectangle(t, r, i, s, o);
    return this.draw(a);
  }
  ellipse(t, r, i, s, o) {
    const a = this.gen.ellipse(t, r, i, s, o);
    return this.draw(a);
  }
  circle(t, r, i, s) {
    const o = this.gen.circle(t, r, i, s);
    return this.draw(o);
  }
  linearPath(t, r) {
    const i = this.gen.linearPath(t, r);
    return this.draw(i);
  }
  polygon(t, r) {
    const i = this.gen.polygon(t, r);
    return this.draw(i);
  }
  arc(t, r, i, s, o, a, n = !1, l) {
    const c = this.gen.arc(t, r, i, s, o, a, n, l);
    return this.draw(c);
  }
  curve(t, r) {
    const i = this.gen.curve(t, r);
    return this.draw(i);
  }
  path(t, r) {
    const i = this.gen.path(t, r);
    return this.draw(i);
  }
}
var ct = { canvas: (e, t) => new Z_(e, t), svg: (e, t) => new Q_(e, t), generator: (e) => new ya(e), newSeed: () => ya.newSeed() }, J_ = 1, tB = 3;
async function Hh(e) {
  const t = e.getElementsByTagName("img");
  if (!t || t.length === 0)
    return;
  const r = !Yh(e);
  await Promise.all(
    [...t].map(
      (i) => new Promise((s) => {
        function o() {
          if (i.style.display = "flex", i.style.flexDirection = "column", r) {
            const a = $t().fontSize ? $t().fontSize : window.getComputedStyle(document.body).fontSize, n = 5, [l = Xf.fontSize] = Aa(a), c = l * n + "px";
            i.style.minWidth = c, i.style.maxWidth = c;
          } else
            i.style.width = "100%";
          s(i);
        }
        p(o, "setupImage"), setTimeout(() => {
          i.complete && o();
        }), i.addEventListener("error", o), i.addEventListener("load", o);
      })
    )
  );
}
p(Hh, "configureLabelImages");
function Yh(e) {
  return e.nodeType === tB ? e.textContent?.trim() !== "" : e.nodeType !== J_ || e.tagName.toLowerCase() === "img" ? !1 : [...e.childNodes].some(Yh);
}
p(Yh, "hasTextBesidesImages");
var nd = 3, eB = 32, rB = /* @__PURE__ */ p(async (e, t, r) => {
  const i = $t(), s = e.insert("g").attr("class", r ?? "node default").attr("id", t.domId || t.id), o = s.insert("g").attr("class", "label").attr("style", re(t.labelStyle)), n = [
    { text: typeof t.label == "string" ? t.label : t.label?.[0] ?? "", cssClass: "c4-name" },
    { text: t.stereotype, cssClass: "c4-type" },
    ...(t.description ?? []).map((C) => ({ text: C, cssClass: "c4-descr" }))
  ].filter((C) => C.text), l = t.width ? Math.max(t.width - 2 * (t.padding ?? 0), eB) : $t().flowchart?.wrappingWidth ?? 200, h = i.c4?.wrap ?? !0 ? l : Number.POSITIVE_INFINITY, u = await Promise.all(
    n.map(async (C) => {
      const b = o.append("g").attr("class", C.cssClass), w = await Qe(
        b,
        Pe(Ur(C.text ?? ""), i),
        {
          useHtmlLabels: !1,
          markdown: !1,
          isNode: !0,
          width: h,
          style: t.labelStyle
        },
        i
      );
      return vt(w).selectAll("tspan.text-outer-tspan").attr("text-anchor", "middle"), vt(w).selectAll("tspan.text-inner-tspan").attr("font-weight", null).attr("font-style", null), { el: b, box: b.node().getBBox() };
    })
  ), d = Math.max(...u.map(({ box: C }) => C.width), 0);
  let f = 0;
  for (const { el: C, box: b } of u)
    C.attr("transform", `translate(${d / 2 - b.x - b.width / 2}, ${f - b.y})`), f += b.height + nd;
  const m = u.length > 0 ? f - nd : 0;
  o.insert("rect", ":first-child"), o.attr("transform", `translate(${-d / 2}, ${-m / 2})`);
  const y = o.node().getBBox(), x = (t.padding ?? 0) / 2;
  return { shapeSvg: s, bbox: y, halfPadding: x, label: o };
}, "c4LabelHelper"), yt = /* @__PURE__ */ p(async (e, t, r) => {
  if (t.stereotype !== void 0)
    return rB(e, t, r);
  let i;
  const s = t.useHtmlLabels || ur($t()?.htmlLabels);
  r ? i = r : i = "node default";
  const o = e.insert("g").attr("class", i).attr("id", t.domId || t.id), a = o.insert("g").attr("class", "label").attr("style", re(t.labelStyle));
  let n;
  t.label === void 0 ? n = "" : n = typeof t.label == "string" ? t.label : t.label[0];
  const l = !!t.icon || !!t.img, c = t.labelType === "markdown", h = await Qe(
    a,
    Pe(Ur(n), $t()),
    {
      useHtmlLabels: s,
      width: t.width || t.wrappingWidth || $t().flowchart?.wrappingWidth,
      classes: c ? "markdown-node-label" : "",
      style: t.labelStyle,
      addSvgBackground: l,
      markdown: c
    },
    $t()
  ), u = (t?.padding ?? 0) / 2;
  let d;
  if (s) {
    const f = h.children[0], m = vt(h);
    await Hh(f), d = await pi.measure(
      () => f.getBoundingClientRect()
    ), m.attr("width", d.width), m.attr("height", d.height);
  } else
    d = await pi.measure(
      () => h.getBBox()
    );
  return s ? a.attr("transform", "translate(" + -d.width / 2 + ", " + -d.height / 2 + ")") : a.attr("transform", "translate(0, " + -d.height / 2 + ")"), t.centerLabel && a.attr("transform", "translate(" + -d.width / 2 + ", " + -d.height / 2 + ")"), a.insert("rect", ":first-child"), { shapeSvg: o, bbox: d, halfPadding: u, label: a };
}, "labelHelper"), Ln = /* @__PURE__ */ p(async (e, t, r) => {
  const i = r.useHtmlLabels ?? ye($t()), s = e.insert("g").attr("class", "label").attr("style", r.labelStyle || ""), o = await Qe(s, Pe(Ur(t), $t()), {
    useHtmlLabels: i,
    width: r.width || $t()?.flowchart?.wrappingWidth,
    style: r.labelStyle,
    addSvgBackground: !!r.icon || !!r.img
  }), a = r.padding / 2;
  let n;
  if (ye($t())) {
    const l = o.children[0], c = vt(o);
    n = await pi.measure(
      () => l.getBoundingClientRect()
    ), c.attr("width", n.width), c.attr("height", n.height);
  } else
    n = await pi.measure(
      () => o.getBBox()
    );
  return i ? s.attr("transform", "translate(" + -n.width / 2 + ", " + -n.height / 2 + ")") : s.attr("transform", "translate(0, " + -n.height / 2 + ")"), r.centerLabel && s.attr("transform", "translate(" + -n.width / 2 + ", " + -n.height / 2 + ")"), s.insert("rect", ":first-child"), { shapeSvg: e, bbox: n, halfPadding: a, label: s };
}, "insertLabel"), dt = /* @__PURE__ */ p((e, t, r) => {
  if (r) {
    e.width = r.width, e.height = r.height;
    return;
  }
  const i = t.node().getBBox();
  e.width = i.width, e.height = i.height;
}, "updateNodeBounds"), xt = /* @__PURE__ */ p((e, t) => (e.look === "handDrawn" ? "rough-node" : "node") + " " + e.cssClasses + " " + (t || ""), "getNodeClasses");
function Rt(e) {
  const t = e.map((r, i) => `${i === 0 ? "M" : "L"}${r.x},${r.y}`);
  return t.push("Z"), t.join(" ");
}
p(Rt, "createPathFromPoints");
function jr(e, t, r, i, s, o) {
  const a = [], l = r - e, c = i - t, h = l / o, u = 2 * Math.PI / h, d = t + c / 2;
  for (let f = 0; f <= 50; f++) {
    const m = f / 50, y = e + m * l, x = d + s * Math.sin(u * (y - e));
    a.push({ x: y, y: x });
  }
  return a;
}
p(jr, "generateFullSineWavePoints");
function ar(e, t, r, i, s, o) {
  const a = [], n = s * Math.PI / 180, h = (o * Math.PI / 180 - n) / (i - 1);
  for (let u = 0; u < i; u++) {
    const d = n + u * h, f = e + r * Math.cos(d), m = t + r * Math.sin(d);
    a.push({ x: -f, y: -m });
  }
  return a;
}
p(ar, "generateCirclePoints");
function Pl(e) {
  const t = Array.from(e.childNodes).filter(
    (l) => l.tagName === "path"
  ), r = document.createElementNS("http://www.w3.org/2000/svg", "path"), i = t.map((l) => l.getAttribute("d")).filter((l) => l !== null).join(" ");
  r.setAttribute("d", i);
  const s = t.find((l) => l.getAttribute("fill") !== "none"), o = t.find((l) => l.getAttribute("stroke") !== "none"), a = /* @__PURE__ */ p((l, c) => l?.getAttribute(c) ?? void 0, "getAttr");
  if (s) {
    const l = {
      fill: a(s, "fill"),
      "fill-opacity": a(s, "fill-opacity") ?? "1"
    };
    Object.entries(l).forEach(([c, h]) => {
      h && r.setAttribute(c, h);
    });
  }
  if (o) {
    const l = {
      stroke: a(o, "stroke"),
      "stroke-width": a(o, "stroke-width") ?? "1",
      "stroke-opacity": a(o, "stroke-opacity") ?? "1"
    };
    Object.entries(l).forEach(([c, h]) => {
      h && r.setAttribute(c, h);
    });
  }
  const n = document.createElementNS("http://www.w3.org/2000/svg", "g");
  return n.appendChild(r), n;
}
p(Pl, "mergePaths");
var iB = /* @__PURE__ */ p((e, t) => {
  var r = e.x, i = e.y, s = t.x - r, o = t.y - i, a = e.width / 2, n = e.height / 2, l, c;
  return Math.abs(o) * a > Math.abs(s) * n ? (o < 0 && (n = -n), l = o === 0 ? 0 : n * s / o, c = n) : (s < 0 && (a = -a), l = a, c = s === 0 ? 0 : a * o / s), { x: r + l, y: i + c };
}, "intersectRect"), xi = iB, ze = /* @__PURE__ */ p((e, t, r, i, s) => [
  "M",
  e + s,
  t,
  // Move to the first point
  "H",
  e + r - s,
  // Draw horizontal line to the beginning of the right corner
  "A",
  s,
  s,
  0,
  0,
  1,
  e + r,
  t + s,
  // Draw arc to the right top corner
  "V",
  t + i - s,
  // Draw vertical line down to the beginning of the right bottom corner
  "A",
  s,
  s,
  0,
  0,
  1,
  e + r - s,
  t + i,
  // Draw arc to the right bottom corner
  "H",
  e + s,
  // Draw horizontal line to the beginning of the left bottom corner
  "A",
  s,
  s,
  0,
  0,
  1,
  e,
  t + i - s,
  // Draw arc to the left bottom corner
  "V",
  t + s,
  // Draw vertical line up to the beginning of the left top corner
  "A",
  s,
  s,
  0,
  0,
  1,
  e + s,
  t,
  // Draw arc to the left top corner
  "Z"
  // Close the path
].join(" "), "createRoundedRectPathD"), sB = /* @__PURE__ */ p(async (e, t, r, i = !1, s = !1) => {
  let o = t || "";
  typeof o == "object" && (o = o[0]);
  const a = $t(), n = ye(a);
  return await Qe(
    e,
    o,
    {
      style: r,
      isTitle: i,
      useHtmlLabels: n,
      markdown: !1,
      isNode: s,
      width: Number.POSITIVE_INFINITY
    },
    a
  );
}, "createLabel"), Wr = sB;
function Zg(e, t) {
  return e.intersect(t);
}
p(Zg, "intersectNode");
var oB = Zg;
function Qg(e, t, r, i) {
  var s = e.x, o = e.y, a = s - i.x, n = o - i.y, l = Math.sqrt(t * t * n * n + r * r * a * a), c = Math.abs(t * r * a / l);
  i.x < s && (c = -c);
  var h = Math.abs(t * r * n / l);
  return i.y < o && (h = -h), { x: s + c, y: o + h };
}
p(Qg, "intersectEllipse");
var Jg = Qg;
function tm(e, t, r) {
  return Jg(e, t, t, r);
}
p(tm, "intersectCircle");
var aB = tm;
function em(e, t, r, i) {
  {
    const s = t.y - e.y, o = e.x - t.x, a = t.x * e.y - e.x * t.y, n = s * r.x + o * r.y + a, l = s * i.x + o * i.y + a, c = 1e-6;
    if (n !== 0 && l !== 0 && Nl(n, l))
      return;
    const h = i.y - r.y, u = r.x - i.x, d = i.x * r.y - r.x * i.y, f = h * e.x + u * e.y + d, m = h * t.x + u * t.y + d;
    if (Math.abs(f) < c && Math.abs(m) < c && Nl(f, m))
      return;
    const y = s * u - h * o;
    if (y === 0)
      return;
    const x = Math.abs(y / 2);
    let C = o * d - u * a;
    const b = C < 0 ? (C - x) / y : (C + x) / y;
    C = h * a - s * d;
    const w = C < 0 ? (C - x) / y : (C + x) / y;
    return { x: b, y: w };
  }
}
p(em, "intersectLine");
function Nl(e, t) {
  return e * t > 0;
}
p(Nl, "sameSign");
var nB = em;
function rm(e, t, r) {
  let i = e.x, s = e.y, o = [], a = Number.POSITIVE_INFINITY, n = Number.POSITIVE_INFINITY;
  typeof t.forEach == "function" ? t.forEach(function(h) {
    a = Math.min(a, h.x), n = Math.min(n, h.y);
  }) : (a = Math.min(a, t.x), n = Math.min(n, t.y));
  let l = i - e.width / 2 - a, c = s - e.height / 2 - n;
  for (let h = 0; h < t.length; h++) {
    let u = t[h], d = t[h < t.length - 1 ? h + 1 : 0], f = nB(
      e,
      r,
      { x: l + u.x, y: c + u.y },
      { x: l + d.x, y: c + d.y }
    );
    f && o.push(f);
  }
  return o.length ? (o.length > 1 && o.sort(function(h, u) {
    let d = h.x - r.x, f = h.y - r.y, m = Math.sqrt(d * d + f * f), y = u.x - r.x, x = u.y - r.y, C = Math.sqrt(y * y + x * x);
    return m < C ? -1 : m === C ? 0 : 1;
  }), o[0]) : e;
}
p(rm, "intersectPolygon");
var lB = rm, at = {
  node: oB,
  circle: aB,
  ellipse: Jg,
  polygon: lB,
  rect: xi
};
function im(e, t) {
  const { labelStyles: r } = ft(t);
  t.labelStyle = r;
  const i = xt(t);
  let s = i;
  i || (s = "anchor");
  const o = e.insert("g").attr("class", s).attr("id", t.domId || t.id), a = 1, { cssStyles: n } = t, l = ct.svg(o), c = ht(t, { fill: "black", stroke: "none", fillStyle: "solid" });
  t.look !== "handDrawn" && (c.roughness = 0);
  const h = l.circle(0, 0, a * 2, c), u = o.insert(() => h, ":first-child");
  return u.attr("class", "anchor").attr("style", re(n)), dt(t, u), t.intersect = function(d) {
    return $.info("Circle intersect", t, a, d), at.circle(t, a, d);
  }, o;
}
p(im, "anchor");
function ql(e, t, r, i, s, o, a) {
  const l = (e + r) / 2, c = (t + i) / 2, h = Math.atan2(i - t, r - e), u = (r - e) / 2, d = (i - t) / 2, f = u / s, m = d / o, y = Math.sqrt(f ** 2 + m ** 2);
  if (y > 1)
    throw new Error("The given radii are too small to create an arc between the points.");
  const x = Math.sqrt(1 - y ** 2), C = l + x * o * Math.sin(h) * (a ? -1 : 1), b = c - x * s * Math.cos(h) * (a ? -1 : 1), w = Math.atan2((t - b) / o, (e - C) / s);
  let B = Math.atan2((i - b) / o, (r - C) / s) - w;
  a && B < 0 && (B += 2 * Math.PI), !a && B > 0 && (B -= 2 * Math.PI);
  const A = [];
  for (let v = 0; v < 20; v++) {
    const L = v / 19, W = w + L * B, H = C + s * Math.cos(W), D = b + o * Math.sin(W);
    A.push({ x: H, y: D });
  }
  return A;
}
p(ql, "generateArcPoints");
function sm(e, t, r) {
  const [i, s] = [t, r].sort((o, a) => a - o);
  return s * (1 - Math.sqrt(1 - (e / i / 2) ** 2));
}
p(sm, "calculateArcSagitta");
async function om(e, t) {
  const { labelStyles: r, nodeStyles: i } = ft(t);
  t.labelStyle = r;
  const s = t.padding ?? 0, o = t.look === "neo" ? 16 : s, a = t.look === "neo" ? 12 : s, n = /* @__PURE__ */ p((W) => W + a, "calcTotalHeight"), l = /* @__PURE__ */ p((W) => {
    const H = W / 2;
    return [H / (2.5 + W / 50), H];
  }, "calcEllipseRadius"), { shapeSvg: c, bbox: h } = await yt(e, t, xt(t)), u = n(t?.height ? t?.height : h.height), [d, f] = l(u), m = sm(u, d, f), x = (t?.width ? t?.width : h.width) + o * 2 + m - m, C = u, { cssStyles: b } = t, w = [
    { x: x / 2, y: -C / 2 },
    { x: -x / 2, y: -C / 2 },
    ...ql(-x / 2, -C / 2, -x / 2, C / 2, d, f, !1),
    { x: x / 2, y: C / 2 },
    ...ql(x / 2, C / 2, x / 2, -C / 2, d, f, !0)
  ], _ = ct.svg(c), B = ht(t, {});
  t.look !== "handDrawn" && (B.roughness = 0, B.fillStyle = "solid");
  const A = Rt(w), v = _.path(A, B), L = c.insert(() => v, ":first-child");
  return L.attr("class", "basic label-container outer-path"), b && t.look !== "handDrawn" && L.selectAll("path").attr("style", b), i && t.look !== "handDrawn" && L.selectAll("path").attr("style", i), L.attr("transform", `translate(${d / 2}, 0)`), dt(t, L), t.intersect = function(W) {
    return at.polygon(t, w, W);
  }, c;
}
p(om, "bowTieRect");
async function am(e, t, { config: { themeVariables: r } }) {
  const { labelStyles: i, nodeStyles: s } = ft(t);
  t.labelStyle = i;
  const { shapeSvg: o, bbox: a, label: n } = await yt(e, t, xt(t)), l = r?.nodeBorder ?? r?.lineColor ?? "currentColor", c = t.padding ?? 12, h = Math.max(a.width + c * 2, t.width ?? 0, 80), u = Math.max(Math.min(h * 0.08, 12), 5), d = Math.max(a.height + c * 2 + u, t.height ?? 0), f = -d / 2 + u, m = d / 2, y = h * 0.72, x = [
    `M${-h / 2},${f}`,
    `L${-y / 2},${m}`,
    `A${y / 2},${u} 0 0 0 ${y / 2},${m}`,
    `L${h / 2},${f}`,
    `A${h / 2},${u} 0 0 0 ${-h / 2},${f}`,
    "Z"
  ].join(" "), { cssStyles: C } = t, b = o.insert("g", ":first-child").attr("class", "basic label-container");
  if (t.look === "handDrawn") {
    const L = ct.svg(o).path(x, ht(t, {}));
    b.node()?.appendChild(L), C && b.attr("style", C);
  } else
    b.append("path").attr("d", x).attr("style", s);
  b.append("ellipse").attr("cx", 0).attr("cy", f).attr("rx", h / 2).attr("ry", u).attr("style", `fill:none;stroke:${l};stroke-width:1px`), dt(t, b);
  const w = f + (m - f) / 2;
  n.attr(
    "transform",
    `translate(${-(a.width / 2) - (a.x - (a.left ?? 0))}, ${w - a.height / 2 - (a.y - (a.top ?? 0))})`
  );
  const _ = 12, B = /* @__PURE__ */ p((v, L, W) => Array.from({ length: _ + 1 }, (H, D) => {
    const st = Math.PI - D * Math.PI / _;
    return { x: v * Math.cos(st), y: L + W * u * Math.sin(st) };
  }), "arc"), A = [...B(h / 2, f, -1), ...B(y / 2, m, 1).reverse()];
  return t.intersect = function(v) {
    return at.polygon(t, A, v);
  }, o;
}
p(am, "bucket");
var ld = 20, hd = 8, hB = 80, An = 8;
async function nm(e, t) {
  const { themeVariables: r } = $t(), i = r.clusterBkg, s = r.clusterBorder, { nodeStyles: o } = ft(t), { shapeSvg: a, bbox: n } = await yt(e, t, xt(t)), l = t.padding ?? 8, c = n.height, h = Math.max(n.width + l * 2, hB, t?.width ?? 0), u = Math.max(
    c + hd + ld + l * 2,
    t?.height ?? 0
  ), d = -h / 2, f = -u / 2, m = -28 / 2, y = a.select(".label");
  y && (t.useHtmlLabels ?? ye($t()) ? y.attr("transform", `translate(${-n.width / 2}, ${-n.height / 2 + m})`) : y.attr("transform", `translate(0, ${-n.height / 2 + m})`));
  let x;
  if (t.look === "handDrawn") {
    const B = ct.svg(a), A = ht(t, {
      fill: i,
      stroke: s,
      fillStyle: "solid"
    }), v = B.path(
      ze(d, f, h, u, An),
      A
    );
    x = a.insert(() => v, ":first-child"), x.attr("class", "basic label-container collapsed-group").attr("style", re(t.cssStyles));
  } else
    x = a.insert("rect", ":first-child"), x.attr("class", "basic label-container collapsed-group").attr("style", o).attr("rx", An).attr("ry", An).attr("x", d).attr("y", f).attr("width", h).attr("height", u).attr("fill", i).attr("stroke", s);
  const C = f + l + c + hd;
  a.append("line").attr("class", "collapsed-separator").attr("x1", d + 8).attr("y1", C).attr("x2", d + h - 8).attr("y2", C).attr("stroke", s).attr("stroke-dasharray", "3, 3");
  const b = C + ld / 2, w = 2.5, _ = 10;
  for (let B = -1; B <= 1; B++)
    a.append("circle").attr("class", "collapsed-indicator").attr("cx", B * _).attr("cy", b).attr("r", w).attr("fill", s);
  return dt(t, x), t.calcIntersect = function(B, A) {
    return at.rect(B, A);
  }, t.intersect = function(B) {
    return at.rect(t, B);
  }, a;
}
p(nm, "collapsedGroup");
function fr(e, t, r, i) {
  return e.insert("polygon", ":first-child").attr(
    "points",
    i.map(function(s) {
      return s.x + "," + s.y;
    }).join(" ")
  ).attr("class", "label-container").attr("transform", "translate(" + -t / 2 + "," + r / 2 + ")");
}
p(fr, "insertPolygonShape");
var cB = ["right", "left", "up", "down"], Uh = "point", uB = /* @__PURE__ */ p((e) => {
  const t = /* @__PURE__ */ new Set();
  for (const r of e)
    switch (r) {
      case "x":
        t.add("right"), t.add("left");
        break;
      case "y":
        t.add("up"), t.add("down");
        break;
      default:
        t.add(r);
        break;
    }
  return t;
}, "expandAndDeduplicateDirections"), dB = /* @__PURE__ */ p((e) => cB.filter((t) => e.has(t)).join("|") || Uh, "getDirectionKey"), cd = {
  "right|left|up|down": /* @__PURE__ */ p(({ height: e, midpoint: t, padding: r, width: i }) => [
    { x: 0, y: 0 },
    { x: t, y: 0 },
    { x: i / 2, y: 2 * r },
    { x: i - t, y: 0 },
    { x: i, y: 0 },
    { x: i, y: -e / 3 },
    { x: i + 2 * r, y: -e / 2 },
    { x: i, y: -2 * e / 3 },
    { x: i, y: -e },
    { x: i - t, y: -e },
    { x: i / 2, y: -e - 2 * r },
    { x: t, y: -e },
    { x: 0, y: -e },
    { x: 0, y: -2 * e / 3 },
    { x: -2 * r, y: -e / 2 },
    { x: 0, y: -e / 3 }
  ], "right|left|up|down"),
  "right|left|up": /* @__PURE__ */ p(({ height: e, midpoint: t, width: r }) => [
    { x: t, y: 0 },
    { x: r - t, y: 0 },
    { x: r, y: -e / 2 },
    { x: r - t, y: -e },
    { x: t, y: -e },
    { x: 0, y: -e / 2 }
  ], "right|left|up"),
  "right|left|down": /* @__PURE__ */ p(({ height: e, midpoint: t, width: r }) => [
    { x: 0, y: 0 },
    { x: t, y: -e },
    { x: r - t, y: -e },
    { x: r, y: 0 }
  ], "right|left|down"),
  "right|up|down": /* @__PURE__ */ p(({ height: e, midpoint: t, width: r }) => [
    { x: 0, y: 0 },
    { x: r, y: -t },
    { x: r, y: -e + t },
    { x: 0, y: -e }
  ], "right|up|down"),
  "left|up|down": /* @__PURE__ */ p(({ height: e, midpoint: t, width: r }) => [
    { x: r, y: 0 },
    { x: 0, y: -t },
    { x: 0, y: -e + t },
    { x: r, y: -e }
  ], "left|up|down"),
  "right|left": /* @__PURE__ */ p(({ height: e, midpoint: t, padding: r, width: i }) => [
    { x: t, y: 0 },
    { x: t, y: -r },
    { x: i - t, y: -r },
    { x: i - t, y: 0 },
    { x: i, y: -e / 2 },
    { x: i - t, y: -e },
    { x: i - t, y: -e + r },
    { x: t, y: -e + r },
    { x: t, y: -e },
    { x: 0, y: -e / 2 }
  ], "right|left"),
  "up|down": /* @__PURE__ */ p(({ height: e, midpoint: t, padding: r, width: i }) => [
    { x: i / 2, y: 0 },
    { x: 0, y: -r },
    { x: t, y: -r },
    { x: t, y: -e + r },
    { x: 0, y: -e + r },
    { x: i / 2, y: -e },
    { x: i, y: -e + r },
    { x: i - t, y: -e + r },
    { x: i - t, y: -r },
    { x: i, y: -r }
  ], "up|down"),
  "right|up": /* @__PURE__ */ p(({ height: e, midpoint: t, width: r }) => [
    { x: 0, y: 0 },
    { x: r, y: -t },
    { x: 0, y: -e }
  ], "right|up"),
  "right|down": /* @__PURE__ */ p(({ height: e, width: t }) => [
    { x: 0, y: 0 },
    { x: t, y: 0 },
    { x: 0, y: -e }
  ], "right|down"),
  "left|up": /* @__PURE__ */ p(({ height: e, midpoint: t, width: r }) => [
    { x: r, y: 0 },
    { x: 0, y: -t },
    { x: r, y: -e }
  ], "left|up"),
  "left|down": /* @__PURE__ */ p(({ height: e, width: t }) => [
    { x: t, y: 0 },
    { x: 0, y: 0 },
    { x: t, y: -e }
  ], "left|down"),
  right: /* @__PURE__ */ p(({ height: e, midpoint: t, padding: r, width: i }) => [
    { x: t, y: -r },
    { x: t, y: -r },
    { x: i - t, y: -r },
    { x: i - t, y: 0 },
    { x: i, y: -e / 2 },
    { x: i - t, y: -e },
    { x: i - t, y: -e + r },
    { x: t, y: -e + r },
    { x: t, y: -e + r }
  ], "right"),
  left: /* @__PURE__ */ p(({ height: e, midpoint: t, padding: r, width: i }) => [
    { x: t, y: 0 },
    { x: t, y: -r },
    { x: i - t, y: -r },
    { x: i - t, y: -e + r },
    { x: t, y: -e + r },
    { x: t, y: -e },
    { x: 0, y: -e / 2 }
  ], "left"),
  up: /* @__PURE__ */ p(({ height: e, midpoint: t, padding: r, width: i }) => [
    { x: t, y: -r },
    { x: t, y: -e + r },
    { x: 0, y: -e + r },
    { x: i / 2, y: -e },
    { x: i, y: -e + r },
    { x: i - t, y: -e + r },
    { x: i - t, y: -r }
  ], "up"),
  down: /* @__PURE__ */ p(({ height: e, midpoint: t, padding: r, width: i }) => [
    { x: i / 2, y: 0 },
    { x: 0, y: -r },
    { x: t, y: -r },
    { x: t, y: -e + r },
    { x: i - t, y: -e + r },
    { x: i - t, y: -r },
    { x: i, y: -r }
  ], "down"),
  [Uh]: () => [{ x: 0, y: 0 }]
}, fB = /* @__PURE__ */ p((e, t, r, i) => {
  const s = uB(e), o = (r.padding ?? 0) / 2, a = t.height + 4 * o, n = a / 2, l = i ?? t.width + 2 * n + 2 * o, c = dB(s);
  return (cd[c] ?? cd[Uh])({ height: a, midpoint: n, padding: o, width: l });
}, "getArrowPoints");
async function lm(e, t) {
  const r = t, { shapeSvg: i, bbox: s } = await yt(e, r, xt(r)), o = r.padding ?? 0, a = s.height + 2 * o, n = a / 2, l = s.width + 2 * n + o, c = r.width ?? 0, u = r.positioned && (r.widthInColumns ?? 1) > 1 && c > l ? c : l, d = fB(r.directions ?? [], s, r, u), f = fr(i, u, a, d);
  return f.attr("style", r.style ?? null), dt(r, f), r.intersect = function(m) {
    return at.polygon(r, d, m);
  }, i;
}
p(lm, "block_arrow");
async function hm(e, t, { config: { themeVariables: r } }) {
  const { labelStyles: i, nodeStyles: s } = ft(t);
  t.labelStyle = i;
  const { shapeSvg: o, bbox: a, label: n } = await yt(e, t, xt(t)), l = r?.nodeBorder ?? r?.lineColor ?? "currentColor", c = t.padding ?? 12, h = 18, u = 12, d = Math.max(a.width + c * 2, t.width ?? 0, 90), f = Math.max(a.height + c * 2 + h, t.height ?? 0), m = -f / 2, { cssStyles: y } = t, x = o.insert("g", ":first-child").attr("class", "basic label-container");
  if (t.look === "handDrawn") {
    const w = ct.svg(o).path(
      ze(-d / 2, m, d, f, u),
      ht(t, {})
    );
    x.node()?.appendChild(w), y && x.attr("style", y);
  } else
    x.append("rect").attr("x", -d / 2).attr("y", m).attr("width", d).attr("height", f).attr("rx", u).attr("ry", u).attr("style", s);
  x.append("line").attr("x1", -d / 2).attr("y1", m + h).attr("x2", d / 2).attr("y2", m + h).attr("style", `stroke:${l};stroke-width:1px`);
  for (let b = 0; b < 3; b++)
    x.append("circle").attr("cx", -d / 2 + 12 + b * 9).attr("cy", m + h / 2).attr("r", 2.5).attr("style", `fill:${l};stroke:none`);
  x.append("rect").attr("class", "browser-address-bar").attr("x", -d / 2 + 44).attr("y", m + 4).attr("width", Math.max(d - 56, 10)).attr("height", h - 8).attr("rx", 3).attr("ry", 3).attr("style", `fill:none;stroke:${l};stroke-width:1px;opacity:0.6`), dt(t, x);
  const C = m + h + (f - h) / 2;
  return n.attr(
    "transform",
    `translate(${-(a.width / 2) - (a.x - (a.left ?? 0))}, ${C - a.height / 2 - (a.y - (a.top ?? 0))})`
  ), t.intersect = function(b) {
    return at.rect(t, b);
  }, o;
}
p(hm, "browser");
var Mo = 12;
async function cm(e, t) {
  const { labelStyles: r, nodeStyles: i } = ft(t);
  t.labelStyle = r;
  const s = t.padding ?? 0, o = t.look === "neo" ? 28 : s, a = t.look === "neo" ? 24 : s, { shapeSvg: n, bbox: l } = await yt(e, t, xt(t)), c = (t?.width ?? l.width) + (t.look === "neo" ? o * 2 : o + Mo), h = (t?.height ?? l.height) + (t.look === "neo" ? a * 2 : a), u = 0, d = c, f = -h, m = 0, y = [
    { x: u + Mo, y: f },
    { x: d, y: f },
    { x: d, y: m },
    { x: u, y: m },
    { x: u, y: f + Mo },
    { x: u + Mo, y: f }
  ];
  let x;
  const { cssStyles: C } = t;
  if (t.look === "handDrawn") {
    const b = ct.svg(n), w = ht(t, {}), _ = Rt(y), B = b.path(_, w);
    x = n.insert(() => B, ":first-child").attr("transform", `translate(${-c / 2}, ${h / 2})`), C && x.attr("style", C);
  } else
    x = fr(n, c, h, y);
  return i && x.attr("style", i), dt(t, x), t.intersect = function(b) {
    return at.polygon(t, y, b);
  }, n;
}
p(cm, "card");
function um(e, t) {
  const { nodeStyles: r } = ft(t);
  t.label = "";
  const i = e.insert("g").attr("class", xt(t)).attr("id", t.domId ?? t.id), { cssStyles: s } = t, o = Math.max(28, t.width ?? 0), a = [
    { x: 0, y: o / 2 },
    { x: o / 2, y: 0 },
    { x: 0, y: -o / 2 },
    { x: -o / 2, y: 0 }
  ], n = ct.svg(i), l = ht(t, {});
  t.look !== "handDrawn" && (l.roughness = 0, l.fillStyle = "solid");
  const c = Rt(a), h = n.path(c, l), u = i.insert(() => h, ":first-child");
  return s && t.look !== "handDrawn" && u.selectAll("path").attr("style", s), r && t.look !== "handDrawn" && u.selectAll("path").attr("style", r), t.width = 28, t.height = 28, t.intersect = function(d) {
    return at.polygon(t, a, d);
  }, i;
}
p(um, "choice");
async function Xh(e, t, r) {
  const { labelStyles: i, nodeStyles: s } = ft(t);
  t.labelStyle = i;
  const { shapeSvg: o, bbox: a, halfPadding: n } = await yt(e, t, xt(t)), l = 16, c = r?.padding ?? n, h = t.look === "neo" ? a.width / 2 + l * 2 : a.width / 2 + c;
  let u;
  const { cssStyles: d } = t;
  if (t.look === "handDrawn") {
    const f = ct.svg(o), m = ht(t, {}), y = f.circle(0, 0, h * 2, m);
    u = o.insert(() => y, ":first-child"), u.attr("class", "basic label-container").attr("style", re(d));
  } else
    u = o.insert("circle", ":first-child").attr("class", "basic label-container").attr("style", s).attr("r", h).attr("cx", 0).attr("cy", 0);
  return dt(t, u), t.calcIntersect = function(f, m) {
    const y = f.width / 2;
    return at.circle(f, y, m);
  }, t.intersect = function(f) {
    return $.info("Circle intersect", t, h, f), at.circle(t, h, f);
  }, o;
}
p(Xh, "circle");
async function dm(e, t) {
  const r = t, i = ["node", r.cssClasses, r.class].filter(Boolean).join(" "), { shapeSvg: s, bbox: o, halfPadding: a } = await yt(e, r, i), n = s.insert("rect", ":first-child"), l = r.padding ?? 0, c = r.positioned ? r.width ?? 0 : o.width + l, h = r.positioned ? r.height ?? 0 : o.height + l, u = r.positioned ? -c / 2 : -o.width / 2 - a, d = r.positioned ? -h / 2 : -o.height / 2 - a;
  return n.attr("class", "basic cluster composite label-container").attr("style", r.style ?? null).attr("rx", r.rx ?? null).attr("ry", r.ry ?? null).attr("x", u).attr("y", d).attr("width", c).attr("height", h), dt(r, n), r.intersect = function(f) {
    return at.rect(r, f);
  }, s;
}
p(dm, "composite");
async function fm(e, t, { config: { themeVariables: r } }) {
  const { labelStyles: i, nodeStyles: s } = ft(t);
  t.labelStyle = i;
  const { shapeSvg: o, bbox: a, label: n } = await yt(e, t, xt(t)), l = r?.nodeBorder ?? r?.lineColor ?? "currentColor", c = t.padding ?? 12, h = 20, u = 12, d = Math.max(a.width + c * 2, t.width ?? 0, 90), f = Math.max(a.height + c * 2 + h, t.height ?? 0), m = -f / 2, { cssStyles: y } = t, x = o.insert("g", ":first-child").attr("class", "basic label-container");
  if (t.look === "handDrawn") {
    const w = ct.svg(o).path(
      ze(-d / 2, m, d, f, u),
      ht(t, {})
    );
    x.node()?.appendChild(w), y && x.attr("style", y);
  } else
    x.append("rect").attr("x", -d / 2).attr("y", m).attr("width", d).attr("height", f).attr("rx", u).attr("ry", u).attr("style", s);
  x.append("text").attr("x", -d / 2 + 12).attr("y", m + 16).attr("class", "console-glyph").attr("style", `font-family:monospace;font-weight:bold;font-size:14px;fill:${l}`).text(">_"), dt(t, x);
  const C = m + h + (f - h) / 2;
  return n.attr(
    "transform",
    `translate(${-(a.width / 2) - (a.x - (a.left ?? 0))}, ${C - a.height / 2 - (a.y - (a.top ?? 0))})`
  ), t.intersect = function(b) {
    return at.rect(t, b);
  }, o;
}
p(fm, "consoleWindow");
function pm(e) {
  const t = Math.cos(Math.PI / 4), r = Math.sin(Math.PI / 4), i = e * 2, s = { x: i / 2 * t, y: i / 2 * r }, o = { x: -(i / 2) * t, y: i / 2 * r }, a = { x: -(i / 2) * t, y: -(i / 2) * r }, n = { x: i / 2 * t, y: -(i / 2) * r };
  return `M ${o.x},${o.y} L ${n.x},${n.y}
                   M ${s.x},${s.y} L ${a.x},${a.y}`;
}
p(pm, "createLine");
function gm(e, t) {
  const { labelStyles: r, nodeStyles: i } = ft(t);
  t.labelStyle = r, t.label = "";
  const s = e.insert("g").attr("class", xt(t)).attr("id", t.domId ?? t.id), o = Math.max(30, t?.width ?? 0), { cssStyles: a } = t, n = ct.svg(s), l = ht(t, {});
  t.look !== "handDrawn" && (l.roughness = 0, l.fillStyle = "solid");
  const c = n.circle(0, 0, o * 2, l), h = pm(o), u = n.path(h, l), d = s.insert(() => c, ":first-child");
  return d.insert(() => u), d.attr("class", "outer-path"), a && t.look !== "handDrawn" && d.selectAll("path").attr("style", a), i && t.look !== "handDrawn" && d.selectAll("path").attr("style", i), dt(t, d), t.intersect = function(f) {
    return $.info("crossedCircle intersect", t, { radius: o, point: f }), at.circle(t, o, f);
  }, s;
}
p(gm, "crossedCircle");
function wr(e, t, r, i = 100, s = 0, o = 180) {
  const a = [], n = s * Math.PI / 180, h = (o * Math.PI / 180 - n) / (i - 1);
  for (let u = 0; u < i; u++) {
    const d = n + u * h, f = e + r * Math.cos(d), m = t + r * Math.sin(d);
    a.push({ x: -f, y: -m });
  }
  return a;
}
p(wr, "generateCirclePoints");
async function mm(e, t) {
  const { labelStyles: r, nodeStyles: i } = ft(t);
  t.labelStyle = r;
  const { shapeSvg: s, bbox: o, label: a } = await yt(e, t, xt(t)), n = t.look === "neo" ? 18 : t.padding ?? 0, l = t.look === "neo" ? 12 : t.padding ?? 0, c = o.width + n, h = o.height + l, u = Math.max(5, h * 0.1), { cssStyles: d } = t, f = [
    ...wr(c / 2, -h / 2, u, 30, -90, 0),
    { x: -c / 2 - u, y: u },
    ...wr(c / 2 + u * 2, -u, u, 20, -180, -270),
    ...wr(c / 2 + u * 2, u, u, 20, -90, -180),
    { x: -c / 2 - u, y: -h / 2 },
    ...wr(c / 2, h / 2, u, 20, 0, 90)
  ], m = [
    { x: c / 2, y: -h / 2 - u },
    { x: -c / 2, y: -h / 2 - u },
    ...wr(c / 2, -h / 2, u, 20, -90, 0),
    { x: -c / 2 - u, y: -u },
    ...wr(c / 2 + c * 0.1, -u, u, 20, -180, -270),
    ...wr(c / 2 + c * 0.1, u, u, 20, -90, -180),
    { x: -c / 2 - u, y: h / 2 },
    ...wr(c / 2, h / 2, u, 20, 0, 90),
    { x: -c / 2, y: h / 2 + u },
    { x: c / 2, y: h / 2 + u }
  ], y = ct.svg(s), x = ht(t, { fill: "none" });
  t.look !== "handDrawn" && (x.roughness = 0, x.fillStyle = "solid");
  const b = Rt(f).replace("Z", ""), w = y.path(b, x), _ = Rt(m), B = y.path(_, { ...x }), A = s.insert("g", ":first-child");
  return A.insert(() => B, ":first-child").attr("stroke-opacity", 0), A.insert(() => w, ":first-child"), A.attr("class", "text"), d && t.look !== "handDrawn" && A.selectAll("path").attr("style", d), i && t.look !== "handDrawn" && A.selectAll("path").attr("style", i), A.attr("transform", `translate(${u}, 0)`), a.attr(
    "transform",
    `translate(${-c / 2 + u - (o.x - (o.left ?? 0))},${-h / 2 + (t.padding ?? 0) / 2 - (o.y - (o.top ?? 0))})`
  ), dt(t, A), t.intersect = function(v) {
    return at.polygon(t, m, v);
  }, s;
}
p(mm, "curlyBraceLeft");
function Sr(e, t, r, i = 100, s = 0, o = 180) {
  const a = [], n = s * Math.PI / 180, h = (o * Math.PI / 180 - n) / (i - 1);
  for (let u = 0; u < i; u++) {
    const d = n + u * h, f = e + r * Math.cos(d), m = t + r * Math.sin(d);
    a.push({ x: f, y: m });
  }
  return a;
}
p(Sr, "generateCirclePoints");
async function ym(e, t) {
  const { labelStyles: r, nodeStyles: i } = ft(t);
  t.labelStyle = r;
  const { shapeSvg: s, bbox: o, label: a } = await yt(e, t, xt(t)), n = t.look === "neo" ? 18 : t.padding ?? 0, l = t.look === "neo" ? 12 : t.padding ?? 0, c = o.width + (t.look === "neo" ? n * 2 : n), h = o.height + (t.look === "neo" ? l * 2 : l), u = Math.max(5, h * 0.1), { cssStyles: d } = t, f = [
    ...Sr(c / 2, -h / 2, u, 20, -90, 0),
    { x: c / 2 + u, y: -u },
    ...Sr(c / 2 + u * 2, -u, u, 20, -180, -270),
    ...Sr(c / 2 + u * 2, u, u, 20, -90, -180),
    { x: c / 2 + u, y: h / 2 },
    ...Sr(c / 2, h / 2, u, 20, 0, 90)
  ], m = [
    { x: -c / 2, y: -h / 2 - u },
    { x: c / 2, y: -h / 2 - u },
    ...Sr(c / 2, -h / 2, u, 20, -90, 0),
    { x: c / 2 + u, y: -u },
    ...Sr(c / 2 + u * 2, -u, u, 20, -180, -270),
    ...Sr(c / 2 + u * 2, u, u, 20, -90, -180),
    { x: c / 2 + u, y: h / 2 },
    ...Sr(c / 2, h / 2, u, 20, 0, 90),
    { x: c / 2, y: h / 2 + u },
    { x: -c / 2, y: h / 2 + u }
  ], y = ct.svg(s), x = ht(t, { fill: "none" });
  t.look !== "handDrawn" && (x.roughness = 0, x.fillStyle = "solid");
  const b = Rt(f).replace("Z", ""), w = y.path(b, x), _ = Rt(m), B = y.path(_, { ...x }), A = s.insert("g", ":first-child");
  return A.insert(() => B, ":first-child").attr("stroke-opacity", 0), A.insert(() => w, ":first-child"), A.attr("class", "text"), d && t.look !== "handDrawn" && A.selectAll("path").attr("style", d), i && t.look !== "handDrawn" && A.selectAll("path").attr("style", i), A.attr("transform", `translate(${-u}, 0)`), a.attr(
    "transform",
    `translate(${-c / 2 + (t.padding ?? 0) / 2 - (o.x - (o.left ?? 0))},${-h / 2 + (t.padding ?? 0) / 2 - (o.y - (o.top ?? 0))})`
  ), dt(t, A), t.intersect = function(v) {
    return at.polygon(t, m, v);
  }, s;
}
p(ym, "curlyBraceRight");
function ue(e, t, r, i = 100, s = 0, o = 180) {
  const a = [], n = s * Math.PI / 180, h = (o * Math.PI / 180 - n) / (i - 1);
  for (let u = 0; u < i; u++) {
    const d = n + u * h, f = e + r * Math.cos(d), m = t + r * Math.sin(d);
    a.push({ x: -f, y: -m });
  }
  return a;
}
p(ue, "generateCirclePoints");
async function xm(e, t) {
  const { labelStyles: r, nodeStyles: i } = ft(t);
  t.labelStyle = r;
  const { shapeSvg: s, bbox: o, label: a } = await yt(e, t, xt(t)), n = t.look === "neo" ? 18 : t.padding ?? 0, l = t.look === "neo" ? 12 : t.padding ?? 0, c = o.width + (t.look === "neo" ? n * 2 : n), h = o.height + (t.look === "neo" ? l * 2 : l), u = Math.max(5, h * 0.1), { cssStyles: d } = t, f = [
    ...ue(c / 2, -h / 2, u, 30, -90, 0),
    { x: -c / 2 - u, y: u },
    ...ue(c / 2 + u * 2, -u, u, 20, -180, -270),
    ...ue(c / 2 + u * 2, u, u, 20, -90, -180),
    { x: -c / 2 - u, y: -h / 2 },
    ...ue(c / 2, h / 2, u, 20, 0, 90)
  ], m = [
    ...ue(-c / 2 + u + u / 2, -h / 2, u, 20, -90, -180),
    { x: c / 2 - u / 2, y: u },
    ...ue(-c / 2 - u / 2, -u, u, 20, 0, 90),
    ...ue(-c / 2 - u / 2, u, u, 20, -90, 0),
    { x: c / 2 - u / 2, y: -u },
    ...ue(-c / 2 + u + u / 2, h / 2, u, 30, -180, -270)
  ], y = [
    { x: c / 2, y: -h / 2 - u },
    { x: -c / 2, y: -h / 2 - u },
    ...ue(c / 2, -h / 2, u, 20, -90, 0),
    { x: -c / 2 - u, y: -u },
    ...ue(c / 2 + u * 2, -u, u, 20, -180, -270),
    ...ue(c / 2 + u * 2, u, u, 20, -90, -180),
    { x: -c / 2 - u, y: h / 2 },
    ...ue(c / 2, h / 2, u, 20, 0, 90),
    { x: -c / 2, y: h / 2 + u },
    { x: c / 2 - u - u / 2, y: h / 2 + u },
    ...ue(-c / 2 + u + u / 2, -h / 2, u, 20, -90, -180),
    { x: c / 2 - u / 2, y: u },
    ...ue(-c / 2 - u / 2, -u, u, 20, 0, 90),
    ...ue(-c / 2 - u / 2, u, u, 20, -90, 0),
    { x: c / 2 - u / 2, y: -u },
    ...ue(-c / 2 + u + u / 2, h / 2, u, 30, -180, -270)
  ], x = ct.svg(s), C = ht(t, { fill: "none" });
  t.look !== "handDrawn" && (C.roughness = 0, C.fillStyle = "solid");
  const w = Rt(f).replace("Z", ""), _ = x.path(w, C), A = Rt(m).replace("Z", ""), v = x.path(A, C), L = Rt(y), W = x.path(L, { ...C }), H = s.insert("g", ":first-child");
  return H.insert(() => W, ":first-child").attr("stroke-opacity", 0), H.insert(() => _, ":first-child"), H.insert(() => v, ":first-child"), H.attr("class", "text"), d && t.look !== "handDrawn" && H.selectAll("path").attr("style", d), i && t.look !== "handDrawn" && H.selectAll("path").attr("style", i), H.attr("transform", `translate(${u - u / 4}, 0)`), a.attr(
    "transform",
    `translate(${-c / 2 + (t.padding ?? 0) / 2 - (o.x - (o.left ?? 0))},${-h / 2 + (t.padding ?? 0) / 2 - (o.y - (o.top ?? 0))})`
  ), dt(t, H), t.intersect = function(D) {
    return at.polygon(t, y, D);
  }, s;
}
p(xm, "curlyBraces");
async function Cm(e, t) {
  const { labelStyles: r, nodeStyles: i } = ft(t);
  t.labelStyle = r;
  const s = t.padding ?? 0, o = t.look === "neo" ? 16 : s, a = t.look === "neo" ? 12 : s, n = 20, l = 5, { shapeSvg: c, bbox: h } = await yt(e, t, xt(t)), u = Math.max(n, (h.width + o * 2) * 1.25, t?.width ?? 0), d = Math.max(l, h.height + a * 2, t?.height ?? 0), f = d / 2, { cssStyles: m } = t, y = ct.svg(c), x = ht(t, {});
  t.look !== "handDrawn" && (x.roughness = 0, x.fillStyle = "solid");
  const C = u, b = d, w = C - f, _ = b / 4, B = [
    { x: w, y: 0 },
    { x: _, y: 0 },
    { x: 0, y: b / 2 },
    { x: _, y: b },
    { x: w, y: b },
    ...ar(-w, -b / 2, f, 50, 270, 90)
  ], A = Rt(B), v = y.path(A, x), L = c.insert(() => v, ":first-child");
  return L.attr("class", "basic label-container outer-path"), m && t.look !== "handDrawn" && L.selectChildren("path").attr("style", m), i && t.look !== "handDrawn" && L.selectChildren("path").attr("style", i), L.attr("transform", `translate(${-u / 2}, ${-d / 2})`), dt(t, L), t.intersect = function(W) {
    return at.polygon(t, B, W);
  }, c;
}
p(Cm, "curvedTrapezoid");
async function bm(e, t) {
  const { labelStyles: r, nodeStyles: i } = ft(t);
  t.labelStyle = r;
  const { shapeSvg: s, bbox: o, label: a } = await yt(e, t, xt(t)), n = t.padding ?? 20, l = Math.max(o.width + n * 2, t.width ?? 0, 100), c = Math.min(Math.max(l * 0.23, 16), 56), h = c * 0.27, u = Math.max(
    o.height + n * 2,
    t.height ? t.height - (2 * c - h) : 0
  ), d = Math.min(l * 0.177, u * 0.45), f = u + 2 * c - h, m = -f / 2, y = m + 2 * c - h, x = s.insert("g", ":first-child").attr("class", "basic label-container"), { cssStyles: C } = t;
  if (t.look === "handDrawn") {
    const L = ct.svg(s), W = ht(t, {}), H = L.path(
      ze(-l / 2, y, l, u, d),
      W
    ), D = L.circle(0, m + c, c * 2, W);
    x.insert(() => D, ":first-child"), x.insert(() => H, ":first-child"), C && x.attr("style", C);
  } else
    x.append("rect").attr("x", -l / 2).attr("y", y).attr("width", l).attr("height", u).attr("rx", d).attr("ry", d).attr("style", i), x.append("circle").attr("cx", 0).attr("cy", m + c).attr("r", c).attr("style", i);
  dt(t, x);
  const b = y + u / 2;
  a.attr(
    "transform",
    `translate(${-(o.width / 2) - (o.x - (o.left ?? 0))}, ${b - o.height / 2 - (o.y - (o.top ?? 0))})`
  );
  const w = m + c, _ = Math.asin(Math.min(1, (y - w) / c)) * 180 / Math.PI, v = [
    ...ar(
      0,
      -w,
      c,
      24,
      180 + _,
      -_
    ),
    ...ar(-(-l / 2 + d), -(y + d), d, 12, 90, 0),
    ...ar(
      -(-l / 2 + d),
      -(f / 2 - d),
      d,
      12,
      360,
      270
    ),
    ...ar(
      -(l / 2 - d),
      -(f / 2 - d),
      d,
      12,
      270,
      180
    ),
    ...ar(
      -(l / 2 - d),
      -(y + d),
      d,
      12,
      180,
      90
    )
  ];
  return t.intersect = function(L) {
    return at.polygon(t, v, L);
  }, s;
}
p(bm, "person");
var pB = /* @__PURE__ */ p((e, t, r, i, s, o) => [
  `M${e},${t + o}`,
  `a${s},${o} 0,0,0 ${r},0`,
  `a${s},${o} 0,0,0 ${-r},0`,
  `l0,${i}`,
  `a${s},${o} 0,0,0 ${r},0`,
  `l0,${-i}`
].join(" "), "createCylinderPathD"), gB = /* @__PURE__ */ p((e, t, r, i, s, o) => [
  `M${e},${t + o}`,
  `M${e + r},${t + o}`,
  `a${s},${o} 0,0,0 ${-r},0`,
  `l0,${i}`,
  `a${s},${o} 0,0,0 ${r},0`,
  `l0,${-i}`
].join(" "), "createOuterCylinderPathD"), mB = /* @__PURE__ */ p((e, t, r, i, s, o) => [`M${e - r / 2},${-i / 2}`, `a${s},${o} 0,0,0 ${r},0`].join(" "), "createInnerCylinderPathD"), ud = 8, dd = 8;
async function km(e, t) {
  const { labelStyles: r, nodeStyles: i } = ft(t);
  t.labelStyle = r;
  const s = t.padding ?? 0, o = t.look === "neo" ? 24 : s, a = t.look === "neo" ? 24 : s, n = t.width ?? 0;
  if (t.width && (t.width = t.width - a, t.width < dd && (t.width = dd)), t.height) {
    const b = n / 2 / (2.5 + n / 50);
    t.height = t.height - o - b * 3, t.height < ud && (t.height = ud);
  }
  const { shapeSvg: l, bbox: c, label: h } = await yt(e, t, xt(t)), u = Math.max(t.width ?? 0, c.width) + a, d = u / 2, f = d / (2.5 + u / 50), m = Math.max(t.height ?? 0, c.height) + o + f;
  let y;
  const { cssStyles: x } = t;
  if (t.look === "handDrawn") {
    const C = ct.svg(l), b = gB(0, 0, u, m, d, f), w = mB(0, f, u, m, d, f), _ = ht(t, {}), B = C.path(b, _), A = C.path(w, ht(t, { fill: "none" }));
    y = l.insert(() => A, ":first-child"), y = l.insert(() => B, ":first-child"), y.attr("class", "basic label-container"), x && y.attr("style", x);
  } else {
    const C = pB(0, 0, u, m, d, f);
    y = l.insert("path", ":first-child").attr("d", C).attr("class", "basic label-container outer-path").attr("style", re(x)).attr("style", i);
  }
  return y.attr("label-offset-y", f), y.attr("transform", `translate(${-u / 2}, ${-(m / 2 + f)})`), dt(t, y), h.attr(
    "transform",
    `translate(${-(c.width / 2) - (c.x - (c.left ?? 0))}, ${-(c.height / 2) + (t.padding ?? 0) / 1.5 - (c.y - (c.top ?? 0))})`
  ), t.intersect = function(C) {
    const b = at.rect(t, C), w = b.x - (t.x ?? 0);
    if (d != 0 && (Math.abs(w) < (t.width ?? 0) / 2 || Math.abs(w) == (t.width ?? 0) / 2 && Math.abs(b.y - (t.y ?? 0)) > (t.height ?? 0) / 2 - f)) {
      let _ = f * f * (1 - w * w / (d * d));
      _ > 0 && (_ = Math.sqrt(_)), _ = f - _, C.y - (t.y ?? 0) > 0 && (_ = -_), b.y += _;
    }
    return b;
  }, l;
}
p(km, "cylinder");
async function hs(e, t, r) {
  const { labelStyles: i, nodeStyles: s } = ft(t);
  t.labelStyle = i;
  const { shapeSvg: o, bbox: a } = await yt(e, t, xt(t)), n = Math.max(a.width + r.labelPaddingX * 2, t?.width || 0), l = Math.max(a.height + r.labelPaddingY * 2, t?.height || 0), c = -n / 2, h = -l / 2;
  let u, { rx: d, ry: f } = t;
  const { cssStyles: m } = t;
  if (r?.rx && r.ry && (d = r.rx, f = r.ry), t.look === "handDrawn") {
    const y = ct.svg(o), x = ht(t, {}), C = d || f ? y.path(ze(c, h, n, l, d || 0), x) : y.rectangle(c, h, n, l, x);
    u = o.insert(() => C, ":first-child"), u.attr("class", "basic label-container").attr("style", re(m));
  } else
    u = o.insert("rect", ":first-child"), u.attr("class", "basic label-container").attr("style", s).attr("rx", re(d)).attr("ry", re(f)).attr("x", c).attr("y", h).attr("width", n).attr("height", l);
  return dt(
    t,
    u,
    t.look === "handDrawn" ? void 0 : { width: n, height: l }
  ), t.calcIntersect = function(y, x) {
    return at.rect(y, x);
  }, t.intersect = function(y) {
    return at.rect(t, y);
  }, o;
}
p(hs, "drawRect");
async function wm(e, t) {
  const { cssClasses: r, labelPaddingX: i, labelPaddingY: s, padding: o, width: a, height: n } = t, l = {
    rx: 0,
    ry: 0,
    labelPaddingX: i ?? (o ?? 0) * 2,
    labelPaddingY: s ?? o ?? 0
  }, c = await hs(e, t, l);
  if (t.look === "handDrawn") {
    const f = ct.svg(c), m = ht(t, {}), y = c.select(".basic.label-container > path:nth-child(2)"), x = y.node();
    if (!x)
      return c;
    let C = null;
    if (x instanceof SVGGraphicsElement)
      C = x.getBBox();
    else
      return c;
    return c.insert(
      () => f.line(C.x, C.y, C.x + C.width, C.y, m),
      ".basic.label-container g.label"
    ), c.insert(
      () => f.line(
        C.x,
        C.y + C.height,
        C.x + C.width,
        C.y + C.height,
        m
      ),
      ".basic.label-container g.label"
    ), y.remove(), c;
  }
  const h = c.select(".basic.label-container"), u = (Number(h.attr("width")) || a) ?? 0, d = (Number(h.attr("height")) || n) ?? 0;
  return u > 0 && d > 0 && h.attr("stroke-dasharray", `${u} ${d}`), c;
}
p(wm, "datastore");
async function Sm(e, t) {
  const { labelStyles: r, nodeStyles: i } = ft(t);
  t.labelStyle = r;
  const s = t.look === "neo" ? 16 : t.padding ?? 0, o = t.look === "neo" ? 16 : t.padding ?? 0, { shapeSvg: a, bbox: n, label: l } = await yt(e, t, xt(t)), c = n.width + s, h = n.height + o, u = h * 0.2, d = -c / 2, f = -h / 2 - u / 2, { cssStyles: m } = t, y = ct.svg(a), x = ht(t, {});
  t.look !== "handDrawn" && (x.roughness = 0, x.fillStyle = "solid");
  const C = [
    { x: d, y: f + u },
    { x: -d, y: f + u },
    { x: -d, y: -f },
    { x: d, y: -f },
    { x: d, y: f },
    { x: -d, y: f },
    { x: -d, y: f + u }
  ], b = y.polygon(
    C.map((_) => [_.x, _.y]),
    x
  ), w = a.insert(() => b, ":first-child");
  return w.attr("class", "basic label-container outer-path"), m && t.look !== "handDrawn" && w.selectAll("path").attr("style", m), i && t.look !== "handDrawn" && w.selectAll("path").attr("style", i), l.attr(
    "transform",
    `translate(${d + (t.padding ?? 0) / 2 - (n.x - (n.left ?? 0))}, ${f + u + (t.padding ?? 0) / 2 - (n.y - (n.top ?? 0))})`
  ), dt(t, w), t.intersect = function(_) {
    return at.rect(t, _);
  }, a;
}
p(Sm, "dividedRectangle");
async function Tm(e, t) {
  const { labelStyles: r, nodeStyles: i } = ft(t), s = t.look === "neo" ? 12 : 5;
  t.labelStyle = r;
  const o = t.padding ?? 0, a = t.look === "neo" ? 16 : o, { shapeSvg: n, bbox: l } = await yt(e, t, xt(t)), c = (t?.width ? t?.width / 2 : l.width / 2) + (a ?? 0), h = c - s;
  let u;
  const { cssStyles: d } = t;
  if (t.look === "handDrawn") {
    const f = ct.svg(n), m = ht(t, { roughness: 0.2, strokeWidth: 2.5 }), y = ht(t, { roughness: 0.2, strokeWidth: 1.5 }), x = f.circle(0, 0, c * 2, m), C = f.circle(0, 0, h * 2, y);
    u = n.insert("g", ":first-child"), u.attr("class", re(t.cssClasses)).attr("style", re(d)), u.node()?.appendChild(x), u.node()?.appendChild(C);
  } else {
    u = n.insert("g", ":first-child");
    const f = u.insert("circle", ":first-child"), m = u.insert("circle");
    u.attr("class", "basic label-container").attr("style", i), f.attr("class", "outer-circle").attr("style", i).attr("r", c).attr("cx", 0).attr("cy", 0), m.attr("class", "inner-circle").attr("style", i).attr("r", h).attr("cx", 0).attr("cy", 0);
  }
  return dt(t, u), t.intersect = function(f) {
    return $.info("DoubleCircle intersect", t, c, f), at.circle(t, c, f);
  }, n;
}
p(Tm, "doublecircle");
function _m(e, t, { config: { themeVariables: r } }) {
  const { labelStyles: i, nodeStyles: s } = ft(t);
  t.label = "", t.labelStyle = i;
  const o = e.insert("g").attr("class", xt(t)).attr("id", t.domId ?? t.id), a = 7, { cssStyles: n } = t, l = ct.svg(o), { nodeBorder: c } = r, h = ht(t, { fillStyle: "solid" });
  t.look !== "handDrawn" && (h.roughness = 0);
  const u = l.circle(0, 0, a * 2, h), d = o.insert(() => u, ":first-child");
  return d.selectAll("path").attr("style", `fill: ${c} !important;`), n && n.length > 0 && t.look !== "handDrawn" && d.selectAll("path").attr("style", n), s && t.look !== "handDrawn" && d.selectAll("path").attr("style", s), dt(t, d), t.intersect = function(f) {
    return $.info("filledCircle intersect", t, { radius: a, point: f }), at.circle(t, a, f);
  }, o;
}
p(_m, "filledCircle");
var fd = 10, pd = 10;
async function Bm(e, t) {
  const { labelStyles: r, nodeStyles: i } = ft(t);
  t.labelStyle = r;
  const s = t.padding ?? 0, o = t.look === "neo" ? s * 2 : s;
  (t.width || t.height) && (t.height = t?.height ?? 0, t.height < fd && (t.height = fd), t.width = (t?.width ?? 0) - o - o / 2, t.width < pd && (t.width = pd));
  const { shapeSvg: a, bbox: n, label: l } = await yt(e, t, xt(t)), c = (t?.width ? t?.width : n.width) + (o ?? 0), h = t?.height ? t?.height : c + n.height, u = h, d = [
    { x: 0, y: -h },
    { x: u, y: -h },
    { x: u / 2, y: 0 }
  ], { cssStyles: f } = t, m = ct.svg(a), y = ht(t, {});
  t.look !== "handDrawn" && (y.roughness = 0, y.fillStyle = "solid");
  const x = Rt(d), C = m.path(x, y), b = a.insert(() => C, ":first-child").attr("transform", `translate(${-h / 2}, ${h / 2})`).attr("class", "outer-path");
  return f && t.look !== "handDrawn" && b.selectChildren("path").attr("style", f), i && t.look !== "handDrawn" && b.selectChildren("path").attr("style", i), t.width = c, t.height = h, dt(t, b), l.attr(
    "transform",
    `translate(${-n.width / 2 - (n.x - (n.left ?? 0))}, ${-h / 2 + (t.padding ?? 0) / 2 + (n.y - (n.top ?? 0))})`
  ), t.intersect = function(w) {
    return $.info("Triangle intersect", t, d, w), at.polygon(t, d, w);
  }, a;
}
p(Bm, "flippedTriangle");
async function vm(e, t) {
  const { labelStyles: r, nodeStyles: i } = ft(t);
  t.labelStyle = r;
  const { shapeSvg: s, bbox: o, label: a } = await yt(e, t, xt(t)), n = t.padding ?? 12, l = Math.max(o.width + n * 2, t.width ?? 0, 90), c = o.height + n * 2, h = Math.max(Math.min(c * 0.16, 14), 8), u = Math.max(c + h, t.height ?? 0), d = u - h, f = Math.max(l * 0.38, 28), m = -u / 2, y = [
    { x: -l / 2, y: m },
    { x: -l / 2 + f, y: m },
    { x: -l / 2 + f, y: m + h },
    { x: l / 2, y: m + h },
    { x: l / 2, y: u / 2 },
    { x: -l / 2, y: u / 2 }
  ], x = [
    `M${y[0].x},${y[0].y}`,
    ...y.slice(1).map((_) => `L${_.x},${_.y}`),
    "Z"
  ].join(" "), { cssStyles: C } = t;
  let b;
  if (t.look === "handDrawn") {
    const B = ct.svg(s).path(x, ht(t, {}));
    b = s.insert(() => B, ":first-child").attr("class", "basic label-container"), C && b.attr("style", C);
  } else
    b = s.insert("path", ":first-child").attr("d", x).attr("class", "basic label-container").attr("style", i);
  t.look === "handDrawn" ? dt(t, b) : dt(t, b, { width: l, height: u });
  const w = m + h + d / 2;
  return a.attr(
    "transform",
    `translate(${-(o.width / 2) - (o.x - (o.left ?? 0))}, ${w - o.height / 2 - (o.y - (o.top ?? 0))})`
  ), t.intersect = function(_) {
    return at.polygon(t, y, _);
  }, s;
}
p(vm, "folder");
function Lm(e, t, { dir: r, config: { state: i, themeVariables: s } }) {
  const { nodeStyles: o } = ft(t);
  t.label = "";
  const a = e.insert("g").attr("class", xt(t)).attr("id", t.domId ?? t.id), { cssStyles: n } = t;
  let l = Math.max(70, t?.width ?? 0), c = Math.max(10, t?.height ?? 0);
  r === "LR" && (l = Math.max(10, t?.width ?? 0), c = Math.max(70, t?.height ?? 0));
  const h = -1 * l / 2, u = -1 * c / 2, d = ct.svg(a), f = ht(t, {
    stroke: s.lineColor,
    fill: s.lineColor
  });
  t.look !== "handDrawn" && (f.roughness = 0, f.fillStyle = "solid");
  const m = d.rectangle(h, u, l, c, f), y = a.insert(() => m, ":first-child");
  n && t.look !== "handDrawn" && y.selectAll("path").attr("style", n), o && t.look !== "handDrawn" && y.selectAll("path").attr("style", o), dt(t, y);
  const x = i?.padding ?? 0;
  return t.width && t.height && (t.width += x / 2 || 0, t.height += x / 2 || 0), t.intersect = function(C) {
    return at.rect(t, C);
  }, a;
}
p(Lm, "forkJoin");
async function Am(e, t) {
  const { labelStyles: r, nodeStyles: i } = ft(t);
  t.labelStyle = r;
  const s = 15, o = 10, a = t.look === "neo" ? 16 : t.padding ?? 0, n = t.look === "neo" ? 12 : t.padding ?? 0;
  (t.width || t.height) && (t.height = (t?.height ?? 0) - n * 2, t.height < o && (t.height = o), t.width = (t?.width ?? 0) - a * 2, t.width < s && (t.width = s));
  const { shapeSvg: l, bbox: c } = await yt(e, t, xt(t)), h = (t?.width ? t?.width : Math.max(s, c.width)) + a * 2, u = (t?.height ? t?.height : Math.max(o, c.height)) + n * 2, d = u / 2, { cssStyles: f } = t, m = ct.svg(l), y = ht(t, {});
  t.look !== "handDrawn" && (y.roughness = 0, y.fillStyle = "solid");
  const x = [
    { x: -h / 2, y: -u / 2 },
    { x: h / 2 - d, y: -u / 2 },
    ...ar(-h / 2 + d, 0, d, 50, 90, 270),
    { x: h / 2 - d, y: u / 2 },
    { x: -h / 2, y: u / 2 }
  ], C = Rt(x), b = m.path(C, y), w = l.insert(() => b, ":first-child");
  return w.attr("class", "basic label-container outer-path"), f && t.look !== "handDrawn" && w.selectChildren("path").attr("style", f), i && t.look !== "handDrawn" && w.selectChildren("path").attr("style", i), dt(t, w), t.intersect = function(_) {
    return $.info("Pill intersect", t, { radius: d, point: _ }), at.polygon(t, x, _);
  }, l;
}
p(Am, "halfRoundedRectangle");
var yB = /* @__PURE__ */ p((e, t, r, i, s) => [
  `M${e + s},${t}`,
  `L${e + r - s},${t}`,
  `L${e + r},${t - i / 2}`,
  `L${e + r - s},${t - i}`,
  `L${e + s},${t - i}`,
  `L${e},${t - i / 2}`,
  "Z"
].join(" "), "createHexagonPathD");
async function Em(e, t) {
  const { labelStyles: r, nodeStyles: i } = ft(t), s = t.look === "neo" ? 3.5 : 4;
  t.labelStyle = r;
  const o = t.padding ?? 0, a = 70, n = 32, l = t.look === "neo" ? a : o, c = t.look === "neo" ? n : o;
  if (t.width || t.height) {
    const w = (t.height ?? 0) / s;
    t.width = (t?.width ?? 0) - 2 * w - c, t.height = (t.height ?? 0) - l;
  }
  const { shapeSvg: h, bbox: u } = await yt(e, t, xt(t)), d = (t?.height ? t?.height : u.height) + l, f = d / s, m = (t?.width ? t?.width : u.width) + 2 * f + c, y = [
    { x: f, y: 0 },
    { x: m - f, y: 0 },
    { x: m, y: -d / 2 },
    { x: m - f, y: -d },
    { x: f, y: -d },
    { x: 0, y: -d / 2 }
  ];
  let x;
  const { cssStyles: C } = t;
  if (t.look === "handDrawn") {
    const b = ct.svg(h), w = ht(t, {}), _ = yB(0, 0, m, d, f), B = b.path(_, w);
    x = h.insert(() => B, ":first-child").attr("transform", `translate(${-m / 2}, ${d / 2})`), C && x.attr("style", C);
  } else
    x = fr(h, m, d, y);
  return i && x.attr("style", i), t.width = m, t.height = d, dt(t, x), t.intersect = function(b) {
    return at.polygon(t, y, b);
  }, h;
}
p(Em, "hexagon");
async function Fm(e, t) {
  const { labelStyles: r, nodeStyles: i } = ft(t);
  t.label = "", t.labelStyle = r;
  const { shapeSvg: s } = await yt(e, t, xt(t)), o = Math.max(30, t?.width ?? 0), a = Math.max(30, t?.height ?? 0), { cssStyles: n } = t, l = ct.svg(s), c = ht(t, {});
  t.look !== "handDrawn" && (c.roughness = 0, c.fillStyle = "solid");
  const h = [
    { x: 0, y: 0 },
    { x: o, y: 0 },
    { x: 0, y: a },
    { x: o, y: a }
  ], u = Rt(h), d = l.path(u, c), f = s.insert(() => d, ":first-child");
  return f.attr("class", "basic label-container outer-path"), n && t.look !== "handDrawn" && f.selectChildren("path").attr("style", n), i && t.look !== "handDrawn" && f.selectChildren("path").attr("style", i), f.attr("transform", `translate(${-o / 2}, ${-a / 2})`), dt(t, f), t.intersect = function(m) {
    return $.info("Pill intersect", t, { points: h }), at.polygon(t, h, m);
  }, s;
}
p(Fm, "hourglass");
async function Mm(e, t, { config: { themeVariables: r, flowchart: i } }) {
  const { labelStyles: s } = ft(t);
  t.labelStyle = s;
  const o = t.assetHeight ?? 48, a = t.assetWidth ?? 48, n = Math.max(o, a), l = i?.wrappingWidth;
  t.width = Math.max(n, l ?? 0);
  const { shapeSvg: c, bbox: h, label: u } = await yt(e, t, "icon-shape default"), d = t.pos === "t", f = n, m = n, { nodeBorder: y } = r, { stylesMap: x } = ls(t), C = -m / 2, b = -f / 2, w = t.label ? 8 : 0, _ = ct.svg(c), B = ht(t, { stroke: "none", fill: "none" });
  t.look !== "handDrawn" && (B.roughness = 0, B.fillStyle = "solid");
  const A = _.rectangle(C, b, m, f, B), v = Math.max(m, h.width), L = f + h.height + w, W = _.rectangle(-v / 2, -L / 2, v, L, {
    ...B,
    fill: "transparent",
    stroke: "none"
  }), H = c.insert(() => A, ":first-child"), D = c.insert(() => W);
  if (t.icon) {
    const st = c.append("g");
    st.html(
      `<g>${await lo(t.icon, {
        height: n,
        width: n,
        fallbackPrefix: ""
      })}</g>`
    );
    const Y = st.node().getBBox(), U = Y.width, Q = Y.height, I = Y.x, N = Y.y;
    st.attr(
      "transform",
      `translate(${-U / 2 - I},${d ? h.height / 2 + w / 2 - Q / 2 - N : -h.height / 2 - w / 2 - Q / 2 - N})`
    ), st.attr("style", `color: ${x.get("stroke") ?? y};`);
  }
  return u.attr(
    "transform",
    `translate(${-h.width / 2 - (h.x - (h.left ?? 0))},${d ? -L / 2 : L / 2 - h.height})`
  ), H.attr(
    "transform",
    `translate(0,${d ? h.height / 2 + w / 2 : -h.height / 2 - w / 2})`
  ), dt(t, D), t.intersect = function(st) {
    if ($.info("iconSquare intersect", t, st), !t.label)
      return at.rect(t, st);
    const Y = t.x ?? 0, U = t.y ?? 0, Q = t.height ?? 0;
    let I = [];
    return d ? I = [
      { x: Y - h.width / 2, y: U - Q / 2 },
      { x: Y + h.width / 2, y: U - Q / 2 },
      { x: Y + h.width / 2, y: U - Q / 2 + h.height + w },
      { x: Y + m / 2, y: U - Q / 2 + h.height + w },
      { x: Y + m / 2, y: U + Q / 2 },
      { x: Y - m / 2, y: U + Q / 2 },
      { x: Y - m / 2, y: U - Q / 2 + h.height + w },
      { x: Y - h.width / 2, y: U - Q / 2 + h.height + w }
    ] : I = [
      { x: Y - m / 2, y: U - Q / 2 },
      { x: Y + m / 2, y: U - Q / 2 },
      { x: Y + m / 2, y: U - Q / 2 + f },
      { x: Y + h.width / 2, y: U - Q / 2 + f },
      { x: Y + h.width / 2 / 2, y: U + Q / 2 },
      { x: Y - h.width / 2, y: U + Q / 2 },
      { x: Y - h.width / 2, y: U - Q / 2 + f },
      { x: Y - m / 2, y: U - Q / 2 + f }
    ], at.polygon(t, I, st);
  }, c;
}
p(Mm, "icon");
async function Om(e, t, { config: { themeVariables: r, flowchart: i } }) {
  const { labelStyles: s } = ft(t);
  t.labelStyle = s;
  const o = t.assetHeight ?? 48, a = t.assetWidth ?? 48, n = Math.max(o, a), l = i?.wrappingWidth;
  t.width = Math.max(n, l ?? 0);
  const { shapeSvg: c, bbox: h, label: u } = await yt(e, t, "icon-shape default"), d = 20, f = t.label ? 8 : 0, m = t.pos === "t", { nodeBorder: y, mainBkg: x } = r, { stylesMap: C } = ls(t), b = ct.svg(c), w = ht(t, {});
  t.look !== "handDrawn" && (w.roughness = 0, w.fillStyle = "solid");
  const _ = C.get("fill");
  w.stroke = _ ?? x;
  const B = c.append("g");
  t.icon && B.html(
    `<g>${await lo(t.icon, {
      height: n,
      width: n,
      fallbackPrefix: ""
    })}</g>`
  );
  const A = B.node().getBBox(), v = A.width, L = A.height, W = A.x, H = A.y, D = Math.max(v, L) * Math.SQRT2 + d * 2, st = b.circle(0, 0, D, w), Y = Math.max(D, h.width), U = D + h.height + f, Q = b.rectangle(-Y / 2, -U / 2, Y, U, {
    ...w,
    fill: "transparent",
    stroke: "none"
  }), I = c.insert(() => st, ":first-child"), N = c.insert(() => Q);
  return B.attr(
    "transform",
    `translate(${-v / 2 - W},${m ? h.height / 2 + f / 2 - L / 2 - H : -h.height / 2 - f / 2 - L / 2 - H})`
  ), B.attr("style", `color: ${C.get("stroke") ?? y};`), u.attr(
    "transform",
    `translate(${-h.width / 2 - (h.x - (h.left ?? 0))},${m ? -U / 2 : U / 2 - h.height})`
  ), I.attr(
    "transform",
    `translate(0,${m ? h.height / 2 + f / 2 : -h.height / 2 - f / 2})`
  ), dt(t, N), t.intersect = function(X) {
    return $.info("iconSquare intersect", t, X), at.rect(t, X);
  }, c;
}
p(Om, "iconCircle");
async function $m(e, t, { config: { themeVariables: r, flowchart: i } }) {
  const { labelStyles: s } = ft(t);
  t.labelStyle = s;
  const o = t.assetHeight ?? 48, a = t.assetWidth ?? 48, n = Math.max(o, a), l = i?.wrappingWidth;
  t.width = Math.max(n, l ?? 0);
  const { shapeSvg: c, bbox: h, halfPadding: u, label: d } = await yt(
    e,
    t,
    "icon-shape default"
  ), f = t.pos === "t", m = n + u * 2, y = n + u * 2, { nodeBorder: x, mainBkg: C } = r, { stylesMap: b } = ls(t), w = -y / 2, _ = -m / 2, B = t.label ? 8 : 0, A = ct.svg(c), v = ht(t, {});
  t.look !== "handDrawn" && (v.roughness = 0, v.fillStyle = "solid");
  const L = b.get("fill");
  v.stroke = L ?? C;
  const W = A.path(ze(w, _, y, m, 5), v), H = Math.max(y, h.width), D = m + h.height + B, st = A.rectangle(-H / 2, -D / 2, H, D, {
    ...v,
    fill: "transparent",
    stroke: "none"
  }), Y = c.insert(() => W, ":first-child").attr("class", "icon-shape2"), U = c.insert(() => st);
  if (t.icon) {
    const Q = c.append("g");
    Q.html(
      `<g>${await lo(t.icon, {
        height: n,
        width: n,
        fallbackPrefix: ""
      })}</g>`
    );
    const I = Q.node().getBBox(), N = I.width, X = I.height, gt = I.x, lt = I.y;
    Q.attr(
      "transform",
      `translate(${-N / 2 - gt},${f ? h.height / 2 + B / 2 - X / 2 - lt : -h.height / 2 - B / 2 - X / 2 - lt})`
    ), Q.attr("style", `color: ${b.get("stroke") ?? x};`);
  }
  return d.attr(
    "transform",
    `translate(${-h.width / 2 - (h.x - (h.left ?? 0))},${f ? -D / 2 : D / 2 - h.height})`
  ), Y.attr(
    "transform",
    `translate(0,${f ? h.height / 2 + B / 2 : -h.height / 2 - B / 2})`
  ), dt(t, U), t.intersect = function(Q) {
    if ($.info("iconSquare intersect", t, Q), !t.label)
      return at.rect(t, Q);
    const I = t.x ?? 0, N = t.y ?? 0, X = t.height ?? 0;
    let gt = [];
    return f ? gt = [
      { x: I - h.width / 2, y: N - X / 2 },
      { x: I + h.width / 2, y: N - X / 2 },
      { x: I + h.width / 2, y: N - X / 2 + h.height + B },
      { x: I + y / 2, y: N - X / 2 + h.height + B },
      { x: I + y / 2, y: N + X / 2 },
      { x: I - y / 2, y: N + X / 2 },
      { x: I - y / 2, y: N - X / 2 + h.height + B },
      { x: I - h.width / 2, y: N - X / 2 + h.height + B }
    ] : gt = [
      { x: I - y / 2, y: N - X / 2 },
      { x: I + y / 2, y: N - X / 2 },
      { x: I + y / 2, y: N - X / 2 + m },
      { x: I + h.width / 2, y: N - X / 2 + m },
      { x: I + h.width / 2 / 2, y: N + X / 2 },
      { x: I - h.width / 2, y: N + X / 2 },
      { x: I - h.width / 2, y: N - X / 2 + m },
      { x: I - y / 2, y: N - X / 2 + m }
    ], at.polygon(t, gt, Q);
  }, c;
}
p($m, "iconRounded");
async function Im(e, t, { config: { themeVariables: r, flowchart: i } }) {
  const { labelStyles: s } = ft(t);
  t.labelStyle = s;
  const o = t.assetHeight ?? 48, a = t.assetWidth ?? 48, n = Math.max(o, a), l = i?.wrappingWidth;
  t.width = Math.max(n, l ?? 0);
  const { shapeSvg: c, bbox: h, halfPadding: u, label: d } = await yt(
    e,
    t,
    "icon-shape default"
  ), f = t.pos === "t", m = n + u * 2, y = n + u * 2, { nodeBorder: x, mainBkg: C } = r, { stylesMap: b } = ls(t), w = -y / 2, _ = -m / 2, B = t.label ? 8 : 0, A = ct.svg(c), v = ht(t, {});
  t.look !== "handDrawn" && (v.roughness = 0, v.fillStyle = "solid");
  const L = b.get("fill");
  v.stroke = L ?? C;
  const W = A.path(ze(w, _, y, m, 0.1), v), H = Math.max(y, h.width), D = m + h.height + B, st = A.rectangle(-H / 2, -D / 2, H, D, {
    ...v,
    fill: "transparent",
    stroke: "none"
  }), Y = c.insert(() => W, ":first-child"), U = c.insert(() => st);
  if (t.icon) {
    const Q = c.append("g");
    Q.html(
      `<g>${await lo(t.icon, {
        height: n,
        width: n,
        fallbackPrefix: ""
      })}</g>`
    );
    const I = Q.node().getBBox(), N = I.width, X = I.height, gt = I.x, lt = I.y;
    Q.attr(
      "transform",
      `translate(${-N / 2 - gt},${f ? h.height / 2 + B / 2 - X / 2 - lt : -h.height / 2 - B / 2 - X / 2 - lt})`
    ), Q.attr("style", `color: ${b.get("stroke") ?? x};`);
  }
  return d.attr(
    "transform",
    `translate(${-h.width / 2 - (h.x - (h.left ?? 0))},${f ? -D / 2 : D / 2 - h.height})`
  ), Y.attr(
    "transform",
    `translate(0,${f ? h.height / 2 + B / 2 : -h.height / 2 - B / 2})`
  ), dt(t, U), t.intersect = function(Q) {
    if ($.info("iconSquare intersect", t, Q), !t.label)
      return at.rect(t, Q);
    const I = t.x ?? 0, N = t.y ?? 0, X = t.height ?? 0;
    let gt = [];
    return f ? gt = [
      { x: I - h.width / 2, y: N - X / 2 },
      { x: I + h.width / 2, y: N - X / 2 },
      { x: I + h.width / 2, y: N - X / 2 + h.height + B },
      { x: I + y / 2, y: N - X / 2 + h.height + B },
      { x: I + y / 2, y: N + X / 2 },
      { x: I - y / 2, y: N + X / 2 },
      { x: I - y / 2, y: N - X / 2 + h.height + B },
      { x: I - h.width / 2, y: N - X / 2 + h.height + B }
    ] : gt = [
      { x: I - y / 2, y: N - X / 2 },
      { x: I + y / 2, y: N - X / 2 },
      { x: I + y / 2, y: N - X / 2 + m },
      { x: I + h.width / 2, y: N - X / 2 + m },
      { x: I + h.width / 2 / 2, y: N + X / 2 },
      { x: I - h.width / 2, y: N + X / 2 },
      { x: I - h.width / 2, y: N - X / 2 + m },
      { x: I - y / 2, y: N - X / 2 + m }
    ], at.polygon(t, gt, Q);
  }, c;
}
p(Im, "iconSquare");
async function Dm(e, t, { config: { flowchart: r } }) {
  const i = new Image();
  i.src = t?.img ?? "", await i.decode();
  const s = Number(i.naturalWidth.toString().replace("px", "")), o = Number(i.naturalHeight.toString().replace("px", ""));
  t.imageAspectRatio = s / o;
  const { labelStyles: a } = ft(t);
  t.labelStyle = a;
  const n = r?.wrappingWidth;
  t.defaultWidth = r?.wrappingWidth;
  const l = Math.max(
    t.label ? n ?? 0 : 0,
    t?.assetWidth ?? s
  ), c = t.constraint === "on" && t?.assetHeight ? t.assetHeight * t.imageAspectRatio : l, h = t.constraint === "on" ? c / t.imageAspectRatio : t?.assetHeight ?? o;
  t.width = Math.max(c, n ?? 0);
  const { shapeSvg: u, bbox: d, label: f } = await yt(e, t, "image-shape default"), m = t.pos === "t", y = -c / 2, x = -h / 2, C = t.label ? 8 : 0, b = ct.svg(u), w = ht(t, {});
  t.look !== "handDrawn" && (w.roughness = 0, w.fillStyle = "solid");
  const _ = b.rectangle(y, x, c, h, w), B = Math.max(c, d.width), A = h + d.height + C, v = b.rectangle(-B / 2, -A / 2, B, A, {
    ...w,
    fill: "none",
    stroke: "none"
  }), L = u.insert(() => _, ":first-child"), W = u.insert(() => v);
  if (t.img) {
    const H = u.append("image");
    H.attr("href", t.img), H.attr("width", c), H.attr("height", h), H.attr("preserveAspectRatio", "none"), H.attr(
      "transform",
      `translate(${-c / 2},${m ? A / 2 - h : -A / 2})`
    );
  }
  return f.attr(
    "transform",
    `translate(${-d.width / 2 - (d.x - (d.left ?? 0))},${m ? -h / 2 - d.height / 2 - C / 2 : h / 2 - d.height / 2 + C / 2})`
  ), L.attr(
    "transform",
    `translate(0,${m ? d.height / 2 + C / 2 : -d.height / 2 - C / 2})`
  ), dt(t, W), t.intersect = function(H) {
    if ($.info("iconSquare intersect", t, H), !t.label)
      return at.rect(t, H);
    const D = t.x ?? 0, st = t.y ?? 0, Y = t.height ?? 0;
    let U = [];
    return m ? U = [
      { x: D - d.width / 2, y: st - Y / 2 },
      { x: D + d.width / 2, y: st - Y / 2 },
      { x: D + d.width / 2, y: st - Y / 2 + d.height + C },
      { x: D + c / 2, y: st - Y / 2 + d.height + C },
      { x: D + c / 2, y: st + Y / 2 },
      { x: D - c / 2, y: st + Y / 2 },
      { x: D - c / 2, y: st - Y / 2 + d.height + C },
      { x: D - d.width / 2, y: st - Y / 2 + d.height + C }
    ] : U = [
      { x: D - c / 2, y: st - Y / 2 },
      { x: D + c / 2, y: st - Y / 2 },
      { x: D + c / 2, y: st - Y / 2 + h },
      { x: D + d.width / 2, y: st - Y / 2 + h },
      { x: D + d.width / 2 / 2, y: st + Y / 2 },
      { x: D - d.width / 2, y: st + Y / 2 },
      { x: D - d.width / 2, y: st - Y / 2 + h },
      { x: D - c / 2, y: st - Y / 2 + h }
    ], at.polygon(t, U, H);
  }, u;
}
p(Dm, "imageSquare");
async function Rm(e, t) {
  const { labelStyles: r, nodeStyles: i } = ft(t);
  t.labelStyle = r;
  const s = t.padding ?? 0, o = s, a = t.look === "neo" ? s * 2 : s, { shapeSvg: n, bbox: l } = await yt(e, t, xt(t)), c = Math.max(l.height + o * 2, t.height ?? 0), h = Math.max(l.width + a * 2, (t.width ?? 0) - c), u = [
    { x: 0, y: 0 },
    { x: h, y: 0 },
    { x: h + 3 * c / 6, y: -c },
    { x: -3 * c / 6, y: -c }
  ];
  let d;
  const { cssStyles: f } = t;
  if (t.look === "handDrawn") {
    const m = ct.svg(n), y = ht(t, {}), x = Rt(u), C = m.path(x, y);
    d = n.insert(() => C, ":first-child").attr("transform", `translate(${-h / 2}, ${c / 2})`), f && d.attr("style", f);
  } else
    d = fr(n, h, c, u);
  return i && d.attr("style", i), t.width = h, t.height = c, dt(t, d), t.intersect = function(m) {
    return at.polygon(t, u, m);
  }, n;
}
p(Rm, "inv_trapezoid");
async function Pm(e, t) {
  const { shapeSvg: r, bbox: i, label: s } = await yt(e, t, "label"), o = r.insert("rect", ":first-child");
  return o.attr("width", 0.1).attr("height", 0.1), r.attr("class", "label edgeLabel"), s.attr(
    "transform",
    `translate(${-(i.width / 2) - (i.x - (i.left ?? 0))}, ${-(i.height / 2) - (i.y - (i.top ?? 0))})`
  ), dt(t, o), t.intersect = function(l) {
    return at.rect(t, l);
  }, r;
}
p(Pm, "labelRect");
async function Nm(e, t) {
  const { labelStyles: r, nodeStyles: i } = ft(t);
  t.labelStyle = r;
  const s = t.padding ?? 0, o = s, a = t.look === "neo" ? s * 2 : s, { shapeSvg: n, bbox: l } = await yt(e, t, xt(t)), c = Math.max(l.height + o, t.height ?? 0), h = Math.max(l.width + a, (t.width ?? 0) - c), u = [
    { x: 0, y: 0 },
    { x: h + 3 * c / 6, y: 0 },
    { x: h, y: -c },
    { x: -(3 * c) / 6, y: -c }
  ];
  let d;
  const { cssStyles: f } = t;
  if (t.look === "handDrawn") {
    const m = ct.svg(n), y = ht(t, {}), x = Rt(u), C = m.path(x, y);
    d = n.insert(() => C, ":first-child").attr("transform", `translate(${-h / 2}, ${c / 2})`), f && d.attr("style", f);
  } else
    d = fr(n, h, c, u);
  return i && d.attr("style", i), t.width = h, t.height = c, dt(t, d), t.intersect = function(m) {
    return at.polygon(t, u, m);
  }, n;
}
p(Nm, "lean_left");
async function qm(e, t) {
  const { labelStyles: r, nodeStyles: i } = ft(t);
  t.labelStyle = r;
  const s = t.padding ?? 0, o = s, a = t.look === "neo" ? s * 2 : s, { shapeSvg: n, bbox: l } = await yt(e, t, xt(t)), c = Math.max(l.height + o, t.height ?? 0), h = Math.max(l.width + a, (t.width ?? 0) - c), u = [
    { x: -3 * c / 6, y: 0 },
    { x: h, y: 0 },
    { x: h + 3 * c / 6, y: -c },
    { x: 0, y: -c }
  ];
  let d;
  const { cssStyles: f } = t;
  if (t.look === "handDrawn") {
    const m = ct.svg(n), y = ht(t, {}), x = Rt(u), C = m.path(x, y);
    d = n.insert(() => C, ":first-child").attr("transform", `translate(${-h / 2}, ${c / 2})`), f && d.attr("style", f);
  } else
    d = fr(n, h, c, u);
  return i && d.attr("style", i), t.width = h, t.height = c, dt(t, d), t.intersect = function(m) {
    return at.polygon(t, u, m);
  }, n;
}
p(qm, "lean_right");
function Wm(e, t) {
  const { labelStyles: r, nodeStyles: i } = ft(t);
  t.label = "", t.labelStyle = r;
  const s = e.insert("g").attr("class", xt(t)).attr("id", t.domId ?? t.id), { cssStyles: o } = t, a = Math.max(35, t?.width ?? 0), n = Math.max(35, t?.height ?? 0), l = 7, c = [
    { x: a, y: 0 },
    { x: 0, y: n + l / 2 },
    { x: a - 2 * l, y: n + l / 2 },
    { x: 0, y: 2 * n },
    { x: a, y: n - l / 2 },
    { x: 2 * l, y: n - l / 2 }
  ], h = ct.svg(s), u = ht(t, {});
  t.look !== "handDrawn" && (u.roughness = 0, u.fillStyle = "solid");
  const d = Rt(c), f = h.path(d, u), m = s.insert(() => f, ":first-child");
  return m.attr("class", "outer-path"), o && t.look !== "handDrawn" && m.selectAll("path").attr("style", o), i && t.look !== "handDrawn" && m.selectAll("path").attr("style", i), m.attr("transform", `translate(-${a / 2},${-n})`), dt(t, m), t.intersect = function(y) {
    return $.info("lightningBolt intersect", t, y), at.polygon(t, c, y);
  }, s;
}
p(Wm, "lightningBolt");
var xB = /* @__PURE__ */ p((e, t, r, i, s, o, a) => [
  `M${e},${t + o}`,
  `a${s},${o} 0,0,0 ${r},0`,
  `a${s},${o} 0,0,0 ${-r},0`,
  `l0,${i}`,
  `a${s},${o} 0,0,0 ${r},0`,
  `l0,${-i}`,
  `M${e},${t + o + a}`,
  `a${s},${o} 0,0,0 ${r},0`
].join(" "), "createCylinderPathD"), CB = /* @__PURE__ */ p((e, t, r, i, s, o, a) => [
  `M${e},${t + o}`,
  `M${e + r},${t + o}`,
  `a${s},${o} 0,0,0 ${-r},0`,
  `l0,${i}`,
  `a${s},${o} 0,0,0 ${r},0`,
  `l0,${-i}`,
  `M${e},${t + o + a}`,
  `a${s},${o} 0,0,0 ${r},0`
].join(" "), "createOuterCylinderPathD"), bB = /* @__PURE__ */ p((e, t, r, i, s, o) => [`M${e - r / 2},${-i / 2}`, `a${s},${o} 0,0,0 ${r},0`].join(" "), "createInnerCylinderPathD"), gd = 10, md = 10;
async function zm(e, t) {
  const { labelStyles: r, nodeStyles: i } = ft(t);
  t.labelStyle = r;
  const s = t.padding ?? 0, o = t.look === "neo" ? 16 : s, a = t.look === "neo" ? 24 : s;
  if (t.width || t.height) {
    const C = t.width ?? 0;
    t.width = (t.width ?? 0) - o, t.width < md && (t.width = md);
    const w = C / 2 / (2.5 + C / 50);
    t.height = (t.height ?? 0) - a - w * 3, t.height < gd && (t.height = gd);
  }
  const { shapeSvg: n, bbox: l, label: c } = await yt(e, t, xt(t)), h = (t?.width ? t?.width : l.width) + o * 2, u = h / 2, d = u / (2.5 + h / 50), f = (t?.height ? t?.height : l.height) + d + a * 2, m = f * 0.1;
  let y;
  const { cssStyles: x } = t;
  if (t.look === "handDrawn") {
    const C = ct.svg(n), b = CB(0, 0, h, f, u, d, m), w = bB(0, d, h, f, u, d), _ = ht(t, {}), B = C.path(b, _), A = C.path(w, _);
    n.insert(() => A, ":first-child").attr("class", "line"), y = n.insert(() => B, ":first-child"), y.attr("class", "basic label-container"), x && y.attr("style", x);
  } else {
    const C = xB(0, 0, h, f, u, d, m);
    y = n.insert("path", ":first-child").attr("d", C).attr("class", "basic label-container outer-path").attr("style", re(x)).attr("style", i);
  }
  return y.attr("label-offset-y", d), y.attr("transform", `translate(${-h / 2}, ${-(f / 2 + d)})`), dt(t, y), c.attr(
    "transform",
    `translate(${-(l.width / 2) - (l.x - (l.left ?? 0))}, ${-(l.height / 2) + d - (l.y - (l.top ?? 0))})`
  ), t.intersect = function(C) {
    const b = at.rect(t, C), w = b.x - (t.x ?? 0);
    if (u != 0 && (Math.abs(w) < (t.width ?? 0) / 2 || Math.abs(w) == (t.width ?? 0) / 2 && Math.abs(b.y - (t.y ?? 0)) > (t.height ?? 0) / 2 - d)) {
      let _ = d * d * (1 - w * w / (u * u));
      _ > 0 && (_ = Math.sqrt(_)), _ = d - _, C.y - (t.y ?? 0) > 0 && (_ = -_), b.y += _;
    }
    return b;
  }, n;
}
p(zm, "linedCylinder");
async function Hm(e, t) {
  const { labelStyles: r, nodeStyles: i } = ft(t);
  t.labelStyle = r;
  const s = t.padding ?? 0, o = t.look === "neo" ? 16 : s, a = t.look === "neo" ? 12 : s;
  if (t.width || t.height) {
    const _ = t.width;
    t.width = (_ ?? 0) * 10 / 11 - o * 2, t.width < 10 && (t.width = 10), t.height = (t?.height ?? 0) - a * 2, t.height < 10 && (t.height = 10);
  }
  const { shapeSvg: n, bbox: l, label: c } = await yt(e, t, xt(t)), h = (t?.width ? t?.width : l.width) + (o ?? 0) * 2, u = (t?.height ? t?.height : l.height) + (a ?? 0) * 2, d = t.look === "neo" ? u / 4 : u / 8, f = u + d, { cssStyles: m } = t, y = ct.svg(n), x = ht(t, {});
  t.look !== "handDrawn" && (x.roughness = 0, x.fillStyle = "solid");
  const C = [
    { x: -h / 2 - h / 2 * 0.1, y: -f / 2 },
    { x: -h / 2 - h / 2 * 0.1, y: f / 2 },
    ...jr(
      -h / 2 - h / 2 * 0.1,
      f / 2,
      h / 2 + h / 2 * 0.1,
      f / 2,
      d,
      0.8
    ),
    { x: h / 2 + h / 2 * 0.1, y: -f / 2 },
    { x: -h / 2 - h / 2 * 0.1, y: -f / 2 },
    { x: -h / 2, y: -f / 2 },
    { x: -h / 2, y: f / 2 * 1.1 },
    { x: -h / 2, y: -f / 2 }
  ], b = y.polygon(
    C.map((_) => [_.x, _.y]),
    x
  ), w = n.insert(() => b, ":first-child");
  return w.attr("class", "basic label-container outer-path"), m && t.look !== "handDrawn" && w.selectAll("path").attr("style", m), i && t.look !== "handDrawn" && w.selectAll("path").attr("style", i), w.attr("transform", `translate(0,${-d / 2})`), c.attr(
    "transform",
    `translate(${-h / 2 + (t.padding ?? 0) + h / 2 * 0.1 / 2 - (l.x - (l.left ?? 0))},${-u / 2 + (t.padding ?? 0) - d / 2 - (l.y - (l.top ?? 0))})`
  ), dt(t, w), t.intersect = function(_) {
    return at.polygon(t, C, _);
  }, n;
}
p(Hm, "linedWaveEdgedRect");
async function Ym(e, t) {
  const { labelStyles: r, nodeStyles: i } = ft(t);
  t.labelStyle = r;
  const s = t.padding ?? 0, o = t.look === "neo" ? 16 : s, a = t.look === "neo" ? 12 : s, n = t.look === "neo" ? 10 : 5;
  (t.width || t.height) && (t.width = Math.max((t?.width ?? 0) - o * 2 - 2 * n, 10), t.height = Math.max((t?.height ?? 0) - a * 2 - 2 * n, 10));
  const { shapeSvg: l, bbox: c, label: h } = await yt(e, t, xt(t)), u = (t?.width ? t?.width : c.width) + o * 2 + 2 * n, d = (t?.height ? t?.height : c.height) + a * 2 + 2 * n, f = u - 2 * n, m = d - 2 * n, y = -f / 2, x = -m / 2, { cssStyles: C } = t, b = ct.svg(l), w = ht(t, {}), _ = [
    { x: y - n, y: x + n },
    { x: y - n, y: x + m + n },
    { x: y + f - n, y: x + m + n },
    { x: y + f - n, y: x + m },
    { x: y + f, y: x + m },
    { x: y + f, y: x + m - n },
    { x: y + f + n, y: x + m - n },
    { x: y + f + n, y: x - n },
    { x: y + n, y: x - n },
    { x: y + n, y: x },
    { x: y, y: x },
    { x: y, y: x + n }
  ], B = [
    { x: y, y: x + n },
    { x: y + f - n, y: x + n },
    { x: y + f - n, y: x + m },
    { x: y + f, y: x + m },
    { x: y + f, y: x },
    { x: y, y: x }
  ];
  t.look !== "handDrawn" && (w.roughness = 0, w.fillStyle = "solid");
  const A = Rt(_);
  let v = b.path(A, w);
  const L = Rt(B);
  let W = b.path(L, w);
  t.look !== "handDrawn" && (v = Pl(v), W = Pl(W));
  const H = l.insert("g", ":first-child");
  return H.insert(() => v), H.insert(() => W), H.attr("class", "basic label-container outer-path"), C && t.look !== "handDrawn" && H.selectAll("path").attr("style", C), i && t.look !== "handDrawn" && H.selectAll("path").attr("style", i), h.attr(
    "transform",
    `translate(${-(c.width / 2) - n - (c.x - (c.left ?? 0))}, ${-(c.height / 2) + n - (c.y - (c.top ?? 0))})`
  ), dt(t, H), t.intersect = function(D) {
    return at.polygon(t, _, D);
  }, l;
}
p(Ym, "multiRect");
async function Um(e, t) {
  const { labelStyles: r, nodeStyles: i } = ft(t);
  t.labelStyle = r;
  const { shapeSvg: s, bbox: o, label: a } = await yt(e, t, xt(t)), n = t.padding ?? 0, l = t.look === "neo" ? 16 : n, c = t.look === "neo" ? 12 : n;
  let h = !0;
  (t.width || t.height) && (h = !1, t.width = (t?.width ?? 0) - l * 2, t.height = (t?.height ?? 0) - c * 3);
  const u = Math.max(o.width, t?.width ?? 0) + l * 2, d = Math.max(o.height, t?.height ?? 0) + c * 3, f = t.look === "neo" ? d / 4 : d / 8, m = d + (h ? f / 2 : -f / 2), y = -u / 2, x = -m / 2, C = 10, { cssStyles: b } = t, w = jr(
    y - C,
    x + m + C,
    y + u - C,
    x + m + C,
    f,
    0.8
  ), _ = w?.[w.length - 1], B = [
    { x: y - C, y: x + C },
    { x: y - C, y: x + m + C },
    ...w,
    { x: y + u - C, y: _.y - C },
    { x: y + u, y: _.y - C },
    { x: y + u, y: _.y - 2 * C },
    { x: y + u + C, y: _.y - 2 * C },
    { x: y + u + C, y: x - C },
    { x: y + C, y: x - C },
    { x: y + C, y: x },
    { x: y, y: x },
    { x: y, y: x + C }
  ], A = [
    { x: y, y: x + C },
    { x: y + u - C, y: x + C },
    { x: y + u - C, y: _.y - C },
    { x: y + u, y: _.y - C },
    { x: y + u, y: x },
    { x: y, y: x }
  ], v = ct.svg(s), L = ht(t, {});
  t.look !== "handDrawn" && (L.roughness = 0, L.fillStyle = "solid");
  const W = Rt(B), H = v.path(W, L), D = Rt(A), st = v.path(D, L), Y = s.insert(() => H, ":first-child");
  return Y.insert(() => st), Y.attr("class", "basic label-container outer-path"), b && t.look !== "handDrawn" && Y.selectAll("path").attr("style", b), i && t.look !== "handDrawn" && Y.selectAll("path").attr("style", i), Y.attr("transform", `translate(0,${-f / 2})`), a.attr(
    "transform",
    `translate(${-(o.width / 2) - C - (o.x - (o.left ?? 0))}, ${-(o.height / 2) + C - f / 2 - (o.y - (o.top ?? 0))})`
  ), dt(t, Y), t.intersect = function(U) {
    return at.polygon(t, B, U);
  }, s;
}
p(Um, "multiWaveEdgedRectangle");
async function Xm(e, t, { config: { themeVariables: r } }) {
  const { labelStyles: i, nodeStyles: s } = ft(t);
  t.labelStyle = i, t.useHtmlLabels || ye(jt()) || (t.centerLabel = !0);
  const { shapeSvg: a, bbox: n, label: l } = await yt(e, t, xt(t)), c = Math.max(n.width + (t.padding ?? 0) * 2, t?.width ?? 0), h = Math.max(n.height + (t.padding ?? 0) * 2, t?.height ?? 0), u = -c / 2, d = -h / 2, { cssStyles: f } = t, m = ct.svg(a), y = ht(t, {
    fill: r.noteBkgColor,
    stroke: r.noteBorderColor
  });
  t.look !== "handDrawn" && (y.roughness = 0, y.fillStyle = "solid");
  const x = m.rectangle(u, d, c, h, y), C = a.insert(() => x, ":first-child");
  return C.attr("class", "basic label-container outer-path"), l.attr("class", "label noteLabel"), f && t.look !== "handDrawn" && C.selectAll("path").attr("style", f), s && t.look !== "handDrawn" && C.selectAll("path").attr("style", s), l.attr(
    "transform",
    `translate(${-n.width / 2 - (n.x - (n.left ?? 0))}, ${-(n.height / 2) - (n.y - (n.top ?? 0))})`
  ), dt(t, C), t.intersect = function(b) {
    return at.rect(t, b);
  }, a;
}
p(Xm, "note");
var kB = /* @__PURE__ */ p((e, t, r) => [
  `M${e + r / 2},${t}`,
  `L${e + r},${t - r / 2}`,
  `L${e + r / 2},${t - r}`,
  `L${e},${t - r / 2}`,
  "Z"
].join(" "), "createDecisionBoxPathD");
async function jm(e, t) {
  const { labelStyles: r, nodeStyles: i } = ft(t);
  t.labelStyle = r;
  const { shapeSvg: s, bbox: o } = await yt(e, t, xt(t)), a = o.width + (t.padding ?? 0), n = o.height + (t.padding ?? 0), l = a + n, c = 0.5, h = [
    { x: l / 2, y: 0 },
    { x: l, y: -l / 2 },
    { x: l / 2, y: -l },
    { x: 0, y: -l / 2 }
  ];
  let u;
  const { cssStyles: d } = t;
  if (t.look === "handDrawn") {
    const f = ct.svg(s), m = ht(t, {}), y = kB(0, 0, l), x = f.path(y, m);
    u = s.insert(() => x, ":first-child").attr("transform", `translate(${-l / 2 + c}, ${l / 2})`), d && u.attr("style", d);
  } else
    u = fr(s, l, l, h), u.attr("transform", `translate(${-l / 2 + c}, ${l / 2})`);
  return i && u.attr("style", i), dt(t, u), t.calcIntersect = function(f, m) {
    const y = f.width, x = [
      { x: y / 2, y: 0 },
      { x: y, y: -y / 2 },
      { x: y / 2, y: -y },
      { x: 0, y: -y / 2 }
    ], C = at.polygon(f, x, m);
    return { x: C.x - 0.5, y: C.y - 0.5 };
  }, t.intersect = function(f) {
    return this.calcIntersect(t, f);
  }, s;
}
p(jm, "question");
async function Gm(e, t) {
  const { labelStyles: r, nodeStyles: i } = ft(t);
  t.labelStyle = r;
  const s = t.padding ?? 0, o = t.look === "neo" ? 21 : s ?? 0, a = t.look === "neo" ? 12 : s ?? 0, { shapeSvg: n, bbox: l, label: c } = await yt(e, t, xt(t)), h = l.width + (t.look === "neo" ? o * 2 : o), u = Math.max(
    l.height + (t.look === "neo" ? a * 2 : a),
    t.height ?? 0
  ), d = u / 4, m = -Math.max(h, (t.width ?? 0) - d) / 2, y = -u / 2, x = y / 2, C = [
    { x: m + x, y },
    { x: m, y: 0 },
    { x: m + x, y: -y },
    { x: -m, y: -y },
    { x: -m, y }
  ], { cssStyles: b } = t, w = ct.svg(n), _ = ht(t, {});
  t.look !== "handDrawn" && (_.roughness = 0, _.fillStyle = "solid");
  const B = Rt(C), A = w.path(B, _), v = n.insert(() => A, ":first-child");
  return v.attr("class", "basic label-container outer-path"), b && t.look !== "handDrawn" && v.selectAll("path").attr("style", b), i && t.look !== "handDrawn" && v.selectAll("path").attr("style", i), v.attr("transform", `translate(${-x / 2},0)`), c.attr(
    "transform",
    `translate(${-x / 2 - l.width / 2 - (l.x - (l.left ?? 0))}, ${-(l.height / 2) - (l.y - (l.top ?? 0))})`
  ), dt(t, v), t.intersect = function(L) {
    return at.polygon(t, C, L);
  }, n;
}
p(Gm, "rect_left_inv_arrow");
async function Vm(e, t) {
  const { labelStyles: r, nodeStyles: i } = ft(t);
  t.labelStyle = r;
  let s;
  t.cssClasses ? s = "node " + t.cssClasses : s = "node default";
  const o = e.insert("g").attr("class", s).attr("id", t.domId || t.id), a = o.insert("g"), n = o.insert("g").attr("class", "label").attr("style", i), l = t.description, c = t.label, h = await Wr(n, c, t.labelStyle, !0, !0);
  let u = { width: 0, height: 0 };
  if (ye($t())) {
    const L = h.children[0], W = vt(h);
    u = L.getBoundingClientRect(), W.attr("width", u.width), W.attr("height", u.height);
  }
  $.info("Text 2", l);
  const d = l || [], f = h.getBBox(), m = await Wr(
    n,
    Array.isArray(d) ? d.join("<br/>") : d,
    t.labelStyle,
    !0,
    !0
  ), y = m.children[0], x = vt(m);
  u = y.getBoundingClientRect(), x.attr("width", u.width), x.attr("height", u.height);
  const C = (t.padding || 0) / 2;
  vt(m).attr(
    "transform",
    "translate( " + (u.width > f.width ? 0 : (f.width - u.width) / 2) + ", " + (f.height + C + 5) + ")"
  ), vt(h).attr(
    "transform",
    "translate( " + (u.width < f.width ? 0 : -(f.width - u.width) / 2) + ", 0)"
  ), u = n.node().getBBox(), n.attr(
    "transform",
    "translate(" + -u.width / 2 + ", " + (-u.height / 2 - C + 3) + ")"
  );
  const b = u.width + (t.padding || 0), w = u.height + (t.padding || 0), _ = -u.width / 2 - C, B = -u.height / 2 - C;
  let A, v;
  if (t.look === "handDrawn") {
    const L = ct.svg(o), W = ht(t, {}), H = L.path(
      ze(_, B, b, w, t.rx || 0),
      W
    ), D = L.line(
      -u.width / 2 - C,
      -u.height / 2 - C + f.height + C,
      u.width / 2 + C,
      -u.height / 2 - C + f.height + C,
      W
    );
    v = o.insert(() => ($.debug("Rough node insert CXC", H), D), ":first-child"), A = o.insert(() => ($.debug("Rough node insert CXC", H), H), ":first-child");
  } else
    A = a.insert("rect", ":first-child"), v = a.insert("line"), A.attr("class", "outer title-state").attr("style", i).attr("x", -u.width / 2 - C).attr("y", -u.height / 2 - C).attr("width", u.width + (t.padding || 0)).attr("height", u.height + (t.padding || 0)), v.attr("class", "divider").attr("x1", -u.width / 2 - C).attr("x2", u.width / 2 + C).attr("y1", -u.height / 2 - C + f.height + C).attr("y2", -u.height / 2 - C + f.height + C);
  return dt(t, A), t.intersect = function(L) {
    return at.rect(t, L);
  }, o;
}
p(Vm, "rectWithTitle");
async function Km(e, t, { config: { themeVariables: r } }) {
  const i = r?.radius ?? 5, s = {
    rx: i,
    ry: i,
    labelPaddingX: (t?.padding ?? 0) * 1,
    labelPaddingY: (t?.padding ?? 0) * 1
  };
  return hs(e, t, s);
}
p(Km, "roundedRect");
var Kr = 8;
async function Zm(e, t) {
  const { labelStyles: r, nodeStyles: i } = ft(t);
  t.labelStyle = r;
  const s = t.look === "neo" ? 16 : t.padding ?? 0, o = t.look === "neo" ? 12 : t.padding ?? 0, { shapeSvg: a, bbox: n, label: l } = await yt(e, t, xt(t)), c = (t?.width ?? n.width) + s * 2 + (t.look === "neo" ? Kr : Kr * 2), h = (t?.height ?? n.height) + o * 2, u = c - Kr, d = h, f = Kr - c / 2, m = -h / 2, { cssStyles: y } = t, x = ct.svg(a), C = ht(t, {});
  t.look !== "handDrawn" && (C.roughness = 0, C.fillStyle = "solid");
  const b = [
    { x: f, y: m },
    { x: f + u, y: m },
    { x: f + u, y: m + d },
    { x: f - Kr, y: m + d },
    { x: f - Kr, y: m },
    { x: f, y: m },
    { x: f, y: m + d }
  ], w = x.polygon(
    b.map((B) => [B.x, B.y]),
    C
  ), _ = a.insert(() => w, ":first-child");
  return _.attr("class", "basic label-container outer-path").attr("style", re(y)), i && t.look !== "handDrawn" && _.selectAll("path").attr("style", i), y && t.look !== "handDrawn" && _.selectAll("path").attr("style", i), l.attr(
    "transform",
    `translate(${Kr / 2 - n.width / 2 - (n.x - (n.left ?? 0))}, ${-(n.height / 2) - (n.y - (n.top ?? 0))})`
  ), dt(t, _), t.intersect = function(B) {
    return at.rect(t, B);
  }, a;
}
p(Zm, "shadedProcess");
async function Qm(e, t) {
  const { labelStyles: r, nodeStyles: i } = ft(t);
  t.labelStyle = r;
  const s = t.padding ?? 0, o = t.look === "neo" ? 16 : s, a = t.look === "neo" ? 12 : s;
  (t.width || t.height) && (t.width = Math.max((t?.width ?? 0) - o * 2, 10), t.height = Math.max((t?.height ?? 0) / 1.5 - a * 2, 10));
  const { shapeSvg: n, bbox: l, label: c } = await yt(e, t, xt(t)), h = (t?.width ? t?.width : l.width) + o * 2, u = ((t?.height ? t?.height : l.height) + a * 2) * 1.5, d = h, f = u / 1.5, m = -d / 2, y = -f / 2, { cssStyles: x } = t, C = ct.svg(n), b = ht(t, {});
  t.look !== "handDrawn" && (b.roughness = 0, b.fillStyle = "solid");
  const w = [
    { x: m, y },
    { x: m, y: y + f },
    { x: m + d, y: y + f },
    { x: m + d, y: y - f / 2 }
  ], _ = Rt(w), B = C.path(_, b), A = n.insert(() => B, ":first-child");
  return A.attr("class", "basic label-container  outer-path"), x && t.look !== "handDrawn" && A.selectChildren("path").attr("style", x), i && t.look !== "handDrawn" && A.selectChildren("path").attr("style", i), A.attr("transform", `translate(0, ${f / 4})`), c.attr(
    "transform",
    `translate(${-d / 2 + (t.padding ?? 0) - (l.x - (l.left ?? 0))}, ${-f / 4 + (t.padding ?? 0) - (l.y - (l.top ?? 0))})`
  ), dt(t, A), t.intersect = function(v) {
    return at.polygon(t, w, v);
  }, n;
}
p(Qm, "slopedRect");
async function Jm(e, t) {
  const r = t.padding ?? 0, i = t.look === "neo" ? 16 : r * 2, s = t.look === "neo" ? 12 : r, o = {
    rx: 0,
    ry: 0,
    labelPaddingX: t.labelPaddingX ?? i,
    labelPaddingY: s
  };
  return hs(e, t, o);
}
p(Jm, "squareRect");
async function ty(e, t) {
  const { labelStyles: r, nodeStyles: i } = ft(t);
  t.labelStyle = r;
  const s = t.padding ?? 0, o = t.look === "neo" ? 20 : s, a = t.look === "neo" ? 12 : s, { shapeSvg: n, bbox: l } = await yt(e, t, xt(t)), c = l.height + (t.look === "neo" ? a * 2 : a), h = l.width + c / 4 + (t.look === "neo" ? o * 2 : o), u = c / 2, { cssStyles: d } = t, f = ct.svg(n), m = ht(t, {});
  t.look !== "handDrawn" && (m.roughness = 0, m.fillStyle = "solid");
  const y = [
    { x: -h / 2 + u, y: -c / 2 },
    { x: h / 2 - u, y: -c / 2 },
    ...ar(-h / 2 + u, 0, u, 50, 90, 270),
    { x: h / 2 - u, y: c / 2 },
    ...ar(h / 2 - u, 0, u, 50, 270, 450)
  ], x = Rt(y), C = f.path(x, m), b = n.insert(() => C, ":first-child");
  return b.attr("class", "basic label-container outer-path"), d && t.look !== "handDrawn" && b.selectChildren("path").attr("style", d), i && t.look !== "handDrawn" && b.selectChildren("path").attr("style", i), dt(t, b), t.intersect = function(w) {
    return at.polygon(t, y, w);
  }, n;
}
p(ty, "stadium");
async function ey(e, t) {
  const r = {
    rx: t.look === "neo" ? 3 : 5,
    ry: t.look === "neo" ? 3 : 5
  };
  return hs(e, t, r);
}
p(ey, "state");
function ry(e, t, { config: { themeVariables: r } }) {
  const { labelStyles: i, nodeStyles: s } = ft(t);
  t.labelStyle = i;
  const { cssStyles: o } = t, { lineColor: a, stateBorder: n, nodeBorder: l, nodeShadow: c } = r;
  (t.width || t.height) && ((t.width ?? 0) < 14 && (t.width = 14), (t.height ?? 0) < 14 && (t.height = 14)), t.width || (t.width = 14), t.height || (t.height = 14);
  const h = e.insert("g").attr("class", "node default").attr("id", t.domId ?? t.id), u = ct.svg(h), d = ht(t, {});
  t.look !== "handDrawn" && (d.roughness = 0, d.fillStyle = "solid");
  const f = u.circle(0, 0, t.width, {
    ...d,
    stroke: a,
    strokeWidth: 2
  }), m = n ?? l, y = (t.width ?? 0) * 5 / 14, x = u.circle(0, 0, y, {
    ...d,
    fill: m,
    stroke: m,
    strokeWidth: 2,
    fillStyle: "solid"
  }), C = h.insert(() => f, ":first-child");
  if (C.insert(() => x), t.look !== "handDrawn" && C.attr("class", "outer-path"), o && C.selectAll("path").attr("style", o), s && C.selectAll("path").attr("style", s), t.width < 25 && c && t.look !== "handDrawn") {
    const b = e.node()?.ownerSVGElement?.id ?? "", w = b ? `${b}-drop-shadow-small` : "drop-shadow-small";
    C.attr("style", `filter:url(#${w})`);
  }
  return dt(t, C), t.intersect = function(b) {
    return at.circle(t, (t.width ?? 0) / 2, b);
  }, h;
}
p(ry, "stateEnd");
function iy(e, t, { config: { themeVariables: r } }) {
  const { lineColor: i, nodeShadow: s } = r;
  (t.width || t.height) && ((t.width ?? 0) < 14 && (t.width = 14), (t.height ?? 0) < 14 && (t.height = 14)), t.width || (t.width = 14), t.height || (t.height = 14);
  const o = e.insert("g").attr("class", "node default").attr("id", t.domId || t.id);
  let a;
  if (t.look === "handDrawn") {
    const l = ct.svg(o).circle(0, 0, t.width, kS(i));
    a = o.insert(() => l), a.attr("class", "state-start").attr("r", (t.width ?? 7) / 2).attr("width", t.width ?? 14).attr("height", t.height ?? 14);
  } else
    a = o.insert("circle", ":first-child"), a.attr("class", "state-start").attr("r", (t.width ?? 7) / 2).attr("width", t.width ?? 14).attr("height", t.height ?? 14);
  if (t.width < 25 && s && t.look !== "handDrawn") {
    const n = e.node()?.ownerSVGElement?.id ?? "", l = n ? `${n}-drop-shadow-small` : "drop-shadow-small";
    a.attr("style", `filter:url(#${l})`);
  }
  return dt(t, a), t.intersect = function(n) {
    return at.circle(t, (t.width ?? 7) / 2, n);
  }, o;
}
p(iy, "stateStart");
var vi = 8;
async function sy(e, t) {
  const { labelStyles: r, nodeStyles: i } = ft(t);
  t.labelStyle = r;
  const s = t?.padding ?? 8, o = t.look === "neo" ? 28 : s, a = t.look === "neo" ? 12 : s, { shapeSvg: n, bbox: l } = await yt(e, t, xt(t)), c = Math.max(l.width + 2 * vi + o, t.width ?? 0), h = Math.max(l.height + a, t.height ?? 0), u = c - 2 * vi, d = h, f = -c / 2, m = -h / 2, y = [
    { x: 0, y: 0 },
    { x: u, y: 0 },
    { x: u, y: -d },
    { x: 0, y: -d },
    { x: 0, y: 0 },
    { x: -8, y: 0 },
    { x: u + 8, y: 0 },
    { x: u + 8, y: -d },
    { x: -8, y: -d },
    { x: -8, y: 0 }
  ];
  if (t.look === "handDrawn") {
    const x = ct.svg(n), C = ht(t, {}), b = x.rectangle(f, m, u + 16, d, C), w = x.line(f + vi, m, f + vi, m + d, C), _ = x.line(f + vi + u, m, f + vi + u, m + d, C);
    n.insert(() => w, ":first-child"), n.insert(() => _, ":first-child");
    const B = n.insert(() => b, ":first-child"), { cssStyles: A } = t;
    B.attr("class", "basic label-container").attr("style", re(A)), dt(t, B);
  } else {
    const x = fr(n, u, d, y);
    i && x.attr("style", i), dt(t, x);
  }
  return t.intersect = function(x) {
    return at.polygon(t, y, x);
  }, n;
}
p(sy, "subroutine");
var En = 0.2;
async function oy(e, t) {
  const { labelStyles: r, nodeStyles: i } = ft(t);
  t.labelStyle = r;
  const s = t.padding ?? 0, o = t.look === "neo" ? 16 : s, a = t.look === "neo" ? 12 : s;
  (t.width || t.height) && (t.height = Math.max((t?.height ?? 0) - a * 2, 10), t.width = Math.max(
    (t?.width ?? 0) - o * 2 - En * (t.height + a * 2),
    10
  ));
  const { shapeSvg: n, bbox: l } = await yt(e, t, xt(t)), c = (t?.height ? t?.height : l.height) + a * 2, h = En * c, u = En * c, f = (t?.width ? t?.width : l.width) + o * 2 + h - h, m = c, y = -f / 2, x = -m / 2, { cssStyles: C } = t, b = ct.svg(n), w = ht(t, {}), _ = [
    { x: y - h / 2, y: x },
    { x: y + f + h / 2, y: x },
    { x: y + f + h / 2, y: x + m },
    { x: y - h / 2, y: x + m }
  ], B = [
    { x: y + f - h / 2, y: x + m },
    { x: y + f + h / 2, y: x + m },
    { x: y + f + h / 2, y: x + m - u }
  ];
  t.look !== "handDrawn" && (w.roughness = 0, w.fillStyle = "solid");
  const A = Rt(_), v = b.path(A, w), L = Rt(B), W = b.path(L, { ...w, fillStyle: "solid" }), H = n.insert(() => W, ":first-child");
  return H.insert(() => v, ":first-child"), H.attr("class", "basic label-container outer-path"), C && t.look !== "handDrawn" && H.selectAll("path").attr("style", C), i && t.look !== "handDrawn" && H.selectAll("path").attr("style", i), dt(t, H), t.intersect = function(D) {
    return at.polygon(t, _, D);
  }, n;
}
p(oy, "taggedRect");
async function ay(e, t) {
  const { labelStyles: r, nodeStyles: i } = ft(t);
  t.labelStyle = r;
  const { shapeSvg: s, bbox: o, label: a } = await yt(e, t, xt(t)), n = Math.max(o.width + (t.padding ?? 0) * 2, t?.width ?? 0), l = Math.max(o.height + (t.padding ?? 0) * 2, t?.height ?? 0), c = l / 8, h = 0.2 * n, u = 0.2 * l, d = l + c, { cssStyles: f } = t, m = ct.svg(s), y = ht(t, {});
  t.look !== "handDrawn" && (y.roughness = 0, y.fillStyle = "solid");
  const x = [
    { x: -n / 2 - n / 2 * 0.1, y: d / 2 },
    ...jr(
      -n / 2 - n / 2 * 0.1,
      d / 2,
      n / 2 + n / 2 * 0.1,
      d / 2,
      c,
      0.8
    ),
    { x: n / 2 + n / 2 * 0.1, y: -d / 2 },
    { x: -n / 2 - n / 2 * 0.1, y: -d / 2 }
  ], C = -n / 2 + n / 2 * 0.1, b = -d / 2 - u * 0.4, w = [
    { x: C + n - h, y: (b + l) * 1.3 },
    { x: C + n, y: b + l - u },
    { x: C + n, y: (b + l) * 0.9 },
    ...jr(
      C + n,
      (b + l) * 1.25,
      C + n - h,
      (b + l) * 1.3,
      -l * 0.02,
      0.5
    )
  ], _ = Rt(x), B = m.path(_, y), A = Rt(w), v = m.path(A, {
    ...y,
    fillStyle: "solid"
  }), L = s.insert(() => v, ":first-child");
  return L.insert(() => B, ":first-child"), L.attr("class", "basic label-container outer-path"), f && t.look !== "handDrawn" && L.selectAll("path").attr("style", f), i && t.look !== "handDrawn" && L.selectAll("path").attr("style", i), L.attr("transform", `translate(0,${-c / 2})`), a.attr(
    "transform",
    `translate(${-n / 2 + (t.padding ?? 0) - (o.x - (o.left ?? 0))},${-l / 2 + (t.padding ?? 0) - c / 2 - (o.y - (o.top ?? 0))})`
  ), dt(t, L), t.intersect = function(W) {
    return at.polygon(t, x, W);
  }, s;
}
p(ay, "taggedWaveEdgedRectangle");
async function ny(e, t) {
  const { labelStyles: r, nodeStyles: i } = ft(t);
  t.labelStyle = r;
  const { shapeSvg: s, bbox: o } = await yt(e, t, xt(t)), a = Math.max(o.width + (t.padding ?? 0), t?.width || 0), n = Math.max(o.height + (t.padding ?? 0), t?.height || 0), l = -a / 2, c = -n / 2, h = s.insert("rect", ":first-child");
  return h.attr("class", "text").attr("style", i).attr("rx", 0).attr("ry", 0).attr("x", l).attr("y", c).attr("width", a).attr("height", n), dt(t, h), t.intersect = function(u) {
    return at.rect(t, u);
  }, s;
}
p(ny, "text");
var wB = /* @__PURE__ */ p((e, t, r, i, s, o) => `M${e},${t}
    a${s},${o} 0,0,1 0,${-i}
    l${r},0
    a${s},${o} 0,0,1 0,${i}
    M${r},${-i}
    a${s},${o} 0,0,0 0,${i}
    l${-r},0`, "createCylinderPathD"), SB = /* @__PURE__ */ p((e, t, r, i, s, o) => [
  `M${e},${t}`,
  `M${e + r},${t}`,
  `a${s},${o} 0,0,0 0,${-i}`,
  `l${-r},0`,
  `a${s},${o} 0,0,0 0,${i}`,
  `l${r},0`
].join(" "), "createOuterCylinderPathD"), TB = /* @__PURE__ */ p((e, t, r, i, s, o) => [`M${e + r / 2},${-i / 2}`, `a${s},${o} 0,0,0 0,${i}`].join(" "), "createInnerCylinderPathD"), yd = 5, xd = 10;
async function ly(e, t) {
  const { labelStyles: r, nodeStyles: i } = ft(t);
  t.labelStyle = r;
  const s = t.padding ?? 0, o = t.look === "neo" ? 12 : s / 2, a = t.height ?? 0;
  if (t.height && (t.height = t.height - o, t.height < yd && (t.height = yd)), t.width) {
    const C = a / 2 / (2.5 + a / 50);
    t.width = t.width - o - C * 3, t.width < xd && (t.width = xd);
  }
  const { shapeSvg: n, bbox: l, label: c } = await yt(e, t, xt(t)), h = Math.max(t.height ?? 0, l.height) + o, u = h / 2, d = u / (2.5 + h / 50), f = Math.max(t.width ?? 0, l.width) + d + o, { cssStyles: m } = t;
  let y;
  if (t.look === "handDrawn") {
    const x = ct.svg(n), C = SB(0, 0, f, h, d, u), b = TB(0, 0, f, h, d, u), w = x.path(C, ht(t, {})), _ = x.path(b, ht(t, { fill: "none" }));
    y = n.insert(() => _, ":first-child"), y = n.insert(() => w, ":first-child"), y.attr("class", "basic label-container"), m && y.attr("style", m);
  } else {
    const x = wB(0, 0, f, h, d, u);
    y = n.insert("path", ":first-child").attr("d", x).attr("class", "basic label-container").attr("style", re(m)).attr("style", i), y.attr("class", "basic label-container outer-path"), m && y.selectAll("path").attr("style", m), i && y.selectAll("path").attr("style", i);
  }
  return y.attr("label-offset-x", d), y.attr("transform", `translate(${-f / 2}, ${h / 2} )`), c.attr(
    "transform",
    `translate(${-(l.width / 2) - d - (l.x - (l.left ?? 0))}, ${-(l.height / 2) - (l.y - (l.top ?? 0))})`
  ), dt(t, y), t.intersect = function(x) {
    const C = at.rect(t, x), b = C.y - (t.y ?? 0);
    if (u != 0 && (Math.abs(b) < (t.height ?? 0) / 2 || Math.abs(b) == (t.height ?? 0) / 2 && Math.abs(C.x - (t.x ?? 0)) > (t.width ?? 0) / 2 - d)) {
      let w = d * d * (1 - b * b / (u * u));
      w != 0 && (w = Math.sqrt(Math.abs(w))), w = d - w, x.x - (t.x ?? 0) > 0 && (w = -w), C.x += w;
    }
    return C;
  }, n;
}
p(ly, "tiltedCylinder");
async function hy(e, t) {
  const { labelStyles: r, nodeStyles: i } = ft(t);
  t.labelStyle = r;
  const s = t.padding ?? 0, o = (t.look === "neo", s), a = t.look === "neo" ? s * 2 : s, { shapeSvg: n, bbox: l } = await yt(e, t, xt(t)), c = Math.max(l.height + o, t.height ?? 0), h = Math.max(l.width + a, (t.width ?? 0) - c), u = [
    { x: -3 * c / 6, y: 0 },
    { x: h + 3 * c / 6, y: 0 },
    { x: h, y: -c },
    { x: 0, y: -c }
  ];
  let d;
  const { cssStyles: f } = t;
  if (t.look === "handDrawn") {
    const m = ct.svg(n), y = ht(t, {}), x = Rt(u), C = m.path(x, y);
    d = n.insert(() => C, ":first-child").attr("transform", `translate(${-h / 2}, ${c / 2})`), f && d.attr("style", f);
  } else
    d = fr(n, h, c, u);
  return i && d.attr("style", i), t.width = h, t.height = c, dt(t, d), t.intersect = function(m) {
    return at.polygon(t, u, m);
  }, n;
}
p(hy, "trapezoid");
async function cy(e, t) {
  const { labelStyles: r, nodeStyles: i } = ft(t);
  t.labelStyle = r;
  const s = t.padding ?? 0, o = t.look === "neo" ? 16 : s, a = t.look === "neo" ? 12 : s, n = 15, l = 5;
  (t.width || t.height) && (t.height = (t.height ?? 0) - a * 2, t.height < l && (t.height = l), t.width = (t.width ?? 0) - o * 2, t.width < n && (t.width = n));
  const { shapeSvg: c, bbox: h } = await yt(e, t, xt(t)), u = (t?.width ? t?.width : h.width) + o * 2, d = (t?.height ? t?.height : h.height) + a * 2, { cssStyles: f } = t, m = ct.svg(c), y = ht(t, {});
  t.look !== "handDrawn" && (y.roughness = 0, y.fillStyle = "solid");
  const x = [
    { x: -u / 2 * 0.8, y: -d / 2 },
    { x: u / 2 * 0.8, y: -d / 2 },
    { x: u / 2, y: -d / 2 * 0.6 },
    { x: u / 2, y: d / 2 },
    { x: -u / 2, y: d / 2 },
    { x: -u / 2, y: -d / 2 * 0.6 }
  ], C = Rt(x), b = m.path(C, y), w = c.insert(() => b, ":first-child");
  return w.attr("class", "basic label-container outer-path"), f && t.look !== "handDrawn" && w.selectChildren("path").attr("style", f), i && t.look !== "handDrawn" && w.selectChildren("path").attr("style", i), dt(t, w), t.intersect = function(_) {
    return at.polygon(t, x, _);
  }, c;
}
p(cy, "trapezoidalPentagon");
var Cd = 10, bd = 10;
async function uy(e, t) {
  const { labelStyles: r, nodeStyles: i } = ft(t);
  t.labelStyle = r;
  const s = t.padding ?? 0, o = t.look === "neo" ? s * 2 : s;
  (t.width || t.height) && (t.width = ((t?.width ?? 0) - o) / 2, t.width < bd && (t.width = bd), t.height = t?.height ?? 0, t.height < Cd && (t.height = Cd));
  const { shapeSvg: a, bbox: n, label: l } = await yt(e, t, xt(t)), c = ur($t().flowchart?.htmlLabels), h = (t?.width ? t?.width : n.width) + o, u = t?.height ? t?.height : h + n.height, d = u, f = [
    { x: 0, y: 0 },
    { x: d, y: 0 },
    { x: d / 2, y: -u }
  ], { cssStyles: m } = t, y = ct.svg(a), x = ht(t, {});
  t.look !== "handDrawn" && (x.roughness = 0, x.fillStyle = "solid");
  const C = Rt(f), b = y.path(C, x), w = a.insert(() => b, ":first-child").attr("transform", `translate(${-u / 2}, ${u / 2})`).attr("class", "outer-path");
  return m && t.look !== "handDrawn" && w.selectChildren("path").attr("style", m), i && t.look !== "handDrawn" && w.selectChildren("path").attr("style", i), t.width = h, t.height = u, dt(t, w), l.attr(
    "transform",
    `translate(${-n.width / 2 - (n.x - (n.left ?? 0))}, ${u / 2 - (n.height + (t.padding ?? 0) / (c ? 2 : 1) - (n.y - (n.top ?? 0)))})`
  ), t.intersect = function(_) {
    return $.info("Triangle intersect", t, f, _), at.polygon(t, f, _);
  }, a;
}
p(uy, "triangle");
async function dy(e, t) {
  const { labelStyles: r, nodeStyles: i } = ft(t);
  t.labelStyle = r;
  const s = t.padding ?? 0, o = t.look === "neo" ? 16 : s, a = t.look === "neo" ? 12 : s;
  let n = !0;
  (t.width || t.height) && (n = !1, t.width = (t?.width ?? 0) - o * 2, t.width < 10 && (t.width = 10), t.height = (t?.height ?? 0) - a * 2, t.height < 10 && (t.height = 10));
  const { shapeSvg: l, bbox: c, label: h } = await yt(e, t, xt(t)), u = (t?.width ? t?.width : c.width) + (o ?? 0) * 2, d = (t?.height ? t?.height : c.height) + (a ?? 0) * 2, f = t.look === "neo" ? d / 4 : d / 8, m = d + (n ? f : -f), { cssStyles: y } = t, C = 14 - u, b = C > 0 ? C / 2 : 0, w = ct.svg(l), _ = ht(t, {});
  t.look !== "handDrawn" && (_.roughness = 0, _.fillStyle = "solid");
  const B = [
    { x: -u / 2 - b, y: m / 2 },
    ...jr(
      -u / 2 - b,
      m / 2,
      u / 2 + b,
      m / 2,
      f,
      0.8
    ),
    { x: u / 2 + b, y: -m / 2 },
    { x: -u / 2 - b, y: -m / 2 }
  ], A = Rt(B), v = w.path(A, _), L = l.insert(() => v, ":first-child");
  return L.attr("class", "basic label-container outer-path"), y && t.look !== "handDrawn" && L.selectAll("path").attr("style", y), i && t.look !== "handDrawn" && L.selectAll("path").attr("style", i), L.attr("transform", `translate(0,${-f / 2})`), h.attr(
    "transform",
    `translate(${-u / 2 + (t.padding ?? 0) - (c.x - (c.left ?? 0))},${-d / 2 + (t.padding ?? 0) - f - (c.y - (c.top ?? 0))})`
  ), dt(t, L), t.intersect = function(W) {
    return at.polygon(t, B, W);
  }, l;
}
p(dy, "waveEdgedRectangle");
async function fy(e, t) {
  const { labelStyles: r, nodeStyles: i } = ft(t);
  t.labelStyle = r;
  const s = t.padding ?? 0, o = t.look === "neo" ? 16 : s, a = t.look === "neo" ? 20 : s;
  if (t.width || t.height) {
    t.width = t?.width ?? 0, t.width < 20 && (t.width = 20), t.height = t?.height ?? 0, t.height < 10 && (t.height = 10);
    const _ = Math.min(t.height * 0.2, t.height / 4);
    t.height = Math.ceil(t.height - a - _ * (20 / 9)), t.width = t.width - o * 2;
  }
  const { shapeSvg: n, bbox: l } = await yt(e, t, xt(t)), c = (t?.width ? t?.width : l.width) + o * 2, h = (t?.height ? t?.height : l.height) + a, u = h / 8, d = h + u * 2, { cssStyles: f } = t, m = ct.svg(n), y = ht(t, {});
  t.look !== "handDrawn" && (y.roughness = 0, y.fillStyle = "solid");
  const x = [
    { x: -c / 2, y: d / 2 },
    ...jr(-c / 2, d / 2, c / 2, d / 2, u, 1),
    { x: c / 2, y: -d / 2 },
    ...jr(c / 2, -d / 2, -c / 2, -d / 2, u, -1)
  ], C = Rt(x), b = m.path(C, y), w = n.insert(() => b, ":first-child");
  return w.attr("class", "basic label-container"), f && t.look !== "handDrawn" && w.selectAll("path").attr("style", f), i && t.look !== "handDrawn" && w.selectAll("path").attr("style", i), dt(t, w), t.intersect = function(_) {
    return at.polygon(t, x, _);
  }, n;
}
p(fy, "waveRectangle");
var Kt = 10;
async function py(e, t) {
  const { labelStyles: r, nodeStyles: i } = ft(t);
  t.labelStyle = r;
  const s = t.look === "neo" ? 16 : t.padding ?? 0, o = t.look === "neo" ? 12 : t.padding ?? 0;
  (t.width || t.height) && (t.width = Math.max((t?.width ?? 0) - s * 2 - Kt, 10), t.height = Math.max((t?.height ?? 0) - o * 2 - Kt, 10));
  const { shapeSvg: a, bbox: n, label: l } = await yt(e, t, xt(t)), c = (t?.width ? t?.width : n.width) + s * 2 + Kt, h = (t?.height ? t?.height : n.height) + o * 2 + Kt, u = c - Kt, d = h - Kt, f = -u / 2, m = -d / 2, { cssStyles: y } = t, x = ct.svg(a), C = ht(t, {}), b = [
    { x: f - Kt, y: m - Kt },
    { x: f - Kt, y: m + d },
    { x: f + u, y: m + d },
    { x: f + u, y: m - Kt }
  ], w = `M${f - Kt},${m - Kt} L${f + u},${m - Kt} L${f + u},${m + d} L${f - Kt},${m + d} L${f - Kt},${m - Kt}
                M${f - Kt},${m} L${f + u},${m}
                M${f},${m - Kt} L${f},${m + d}`;
  t.look !== "handDrawn" && (C.roughness = 0, C.fillStyle = "solid");
  const _ = x.path(w, C), B = a.insert(() => _, ":first-child");
  return B.attr("transform", `translate(${Kt / 2}, ${Kt / 2})`), B.attr("class", "basic label-container outer-path"), y && t.look !== "handDrawn" && B.selectAll("path").attr("style", y), i && t.look !== "handDrawn" && B.selectAll("path").attr("style", i), l.attr(
    "transform",
    `translate(${-(n.width / 2) + Kt / 2 - (n.x - (n.left ?? 0))}, ${-(n.height / 2) + Kt / 2 - (n.y - (n.top ?? 0))})`
  ), dt(t, B), t.intersect = function(A) {
    return at.polygon(t, b, A);
  }, a;
}
p(py, "windowPane");
var kd = /* @__PURE__ */ new Set(["redux-color", "redux-dark-color"]), _B = /* @__PURE__ */ new Set(["redux", "redux-dark", "redux-color", "redux-dark-color"]);
async function jh(e, t) {
  const r = t;
  r.alias && (t.label = r.alias);
  const { theme: i, themeVariables: s } = jt(), { rowEven: o, rowOdd: a, nodeBorder: n, borderColorArray: l } = s;
  if (t.look === "handDrawn") {
    const { themeVariables: ot } = jt(), { background: Lt } = ot, Nt = {
      ...t,
      id: t.id + "-background",
      domId: (t.domId || t.id) + "-background",
      look: "default",
      cssStyles: ["stroke: none", `fill: ${Lt}`]
    };
    await jh(e, Nt);
  }
  const c = jt();
  t.useHtmlLabels = c.htmlLabels;
  let h = c.er?.diagramPadding ?? 10, u = c.er?.entityPadding ?? 6;
  const { cssStyles: d } = t, { labelStyles: f, nodeStyles: m } = ft(t);
  if (r.attributes.length === 0 && t.label) {
    const ot = {
      rx: 0,
      ry: 0,
      labelPaddingX: h,
      labelPaddingY: h * 1.5
    };
    Br(t.label, c) + ot.labelPaddingX * 2 < c.er.minEntityWidth && (t.width = c.er.minEntityWidth);
    const Lt = await hs(e, t, ot);
    if (i != null && kd.has(i)) {
      const Nt = r.colorIndex ?? 0;
      Lt.attr("data-color-id", `color-${Nt % l.length}`);
    }
    if (!ur(c.htmlLabels)) {
      const Nt = Lt.select("text"), Ft = Nt.node()?.getBBox();
      Nt.attr("transform", `translate(${-Ft.width / 2}, 0)`);
    }
    return Lt;
  }
  c.htmlLabels || (h *= 1.25, u *= 1.25);
  let y = xt(t);
  y || (y = "node default");
  const x = e.insert("g").attr("class", y).attr("id", t.domId || t.id), C = await Ei(x, t.label ?? "", c, 0, 0, ["name"], f);
  C.height += u;
  let b = 0;
  const w = [], _ = [];
  let B = 0, A = 0, v = 0, L = 0, W = !0, H = !0;
  for (const ot of r.attributes) {
    const Lt = await Ei(
      x,
      ot.type,
      c,
      0,
      b,
      ["attribute-type"],
      f
    );
    B = Math.max(B, Lt.width + h);
    const Nt = await Ei(
      x,
      ot.name,
      c,
      0,
      b,
      ["attribute-name"],
      f
    );
    A = Math.max(A, Nt.width + h);
    const Ft = await Ei(
      x,
      ot.keys.join(),
      c,
      0,
      b,
      ["attribute-keys"],
      f
    );
    v = Math.max(v, Ft.width + h);
    const oe = await Ei(
      x,
      ot.comment,
      c,
      0,
      b,
      ["attribute-comment"],
      f
    );
    L = Math.max(L, oe.width + h);
    const Vt = Math.max(Lt.height, Nt.height, Ft.height, oe.height) + u;
    _.push({ yOffset: b, rowHeight: Vt }), b += Vt;
  }
  let D = 4;
  v <= h && (W = !1, v = 0, D--), L <= h && (H = !1, L = 0, D--);
  const st = x.node().getBBox();
  if (C.width + h * 2 - (B + A + v + L) > 0) {
    const ot = C.width + h * 2 - (B + A + v + L);
    B += ot / D, A += ot / D, v > 0 && (v += ot / D), L > 0 && (L += ot / D);
  }
  const Y = B + A + v + L, U = ct.svg(x), Q = ht(t, {});
  t.look !== "handDrawn" && (Q.roughness = 0, Q.fillStyle = "solid");
  let I = 0;
  _.length > 0 && (I = _.reduce((ot, Lt) => ot + (Lt?.rowHeight ?? 0), 0));
  const N = Math.max(st.width + h * 2, t?.width || 0, Y), X = Math.max((I ?? 0) + C.height, t?.height || 0), gt = -N / 2, lt = -X / 2;
  if (x.selectAll("g:not(:first-child)").each((ot, Lt, Nt) => {
    const Ft = vt(Nt[Lt]), oe = Ft.attr("transform");
    let Vt = 0, He = 0;
    if (oe) {
      const Oe = RegExp(/translate\(([^,]+),([^)]+)\)/).exec(oe);
      Oe && (Vt = parseFloat(Oe[1]), He = parseFloat(Oe[2]), Ft.attr("class").includes("attribute-name") ? Vt += B : Ft.attr("class").includes("attribute-keys") ? Vt += B + A : Ft.attr("class").includes("attribute-comment") && (Vt += B + A + v));
    }
    Ft.attr(
      "transform",
      `translate(${gt + h / 2 + Vt}, ${He + lt + C.height + u / 2})`
    );
  }), x.select(".name").attr("transform", "translate(" + -C.width / 2 + ", " + (lt + u / 2) + ")"), i != null && kd.has(i)) {
    const ot = r.colorIndex ?? 0;
    x.attr("data-color-id", `color-${ot % l.length}`);
  }
  const St = U.rectangle(gt, lt, N, X, Q), It = x.insert(() => St, ":first-child").attr("class", "outer-path").attr("style", d.join(""));
  w.push(0);
  for (const [ot, Lt] of _.entries()) {
    const Ft = (ot + 1) % 2 === 0 && Lt.yOffset !== 0, oe = U.rectangle(gt, C.height + lt + Lt?.yOffset, N, Lt?.rowHeight, {
      ...Q,
      fill: Ft ? o : a,
      stroke: n
    });
    x.insert(() => oe, "g.label").attr("style", d.join("")).attr("class", `row-rect-${Ft ? "even" : "odd"}`);
  }
  const _t = 1e-4;
  let Et = Fi(gt, C.height + lt, N + gt, C.height + lt, _t), Bt = U.polygon(
    Et.map((ot) => [ot.x, ot.y]),
    Q
  );
  if (x.insert(() => Bt).attr("class", "divider"), Et = Fi(B + gt, C.height + lt, B + gt, X + lt, _t), Bt = U.polygon(
    Et.map((ot) => [ot.x, ot.y]),
    Q
  ), x.insert(() => Bt).attr("class", "divider"), W) {
    const ot = B + A + gt;
    Et = Fi(ot, C.height + lt, ot, X + lt, _t), Bt = U.polygon(
      Et.map((Lt) => [Lt.x, Lt.y]),
      Q
    ), x.insert(() => Bt).attr("class", "divider");
  }
  if (H) {
    const ot = B + A + v + gt;
    Et = Fi(ot, C.height + lt, ot, X + lt, _t), Bt = U.polygon(
      Et.map((Lt) => [Lt.x, Lt.y]),
      Q
    ), x.insert(() => Bt).attr("class", "divider");
  }
  for (const ot of w) {
    const Lt = C.height + lt + ot;
    Et = Fi(gt, Lt, N + gt, Lt, _t), Bt = U.polygon(
      Et.map((Nt) => [Nt.x, Nt.y]),
      Q
    ), x.insert(() => Bt).attr("class", "divider");
  }
  if (dt(t, It), m && t.look !== "handDrawn")
    if (i != null && _B.has(i))
      x.selectAll("path").attr("style", m);
    else {
      const Lt = m.split(";")?.filter((Nt) => Nt.includes("stroke"))?.map((Nt) => `${Nt}`).join("; ");
      x.selectAll("path").attr("style", Lt ?? ""), x.selectAll(".row-rect-even path").attr("style", m);
    }
  return t.intersect = function(ot) {
    return at.rect(t, ot);
  }, x;
}
p(jh, "erBox");
async function Ei(e, t, r, i = 0, s = 0, o = [], a = "") {
  const n = e.insert("g").attr("class", `label ${o.join(" ")}`).attr("transform", `translate(${i}, ${s})`).attr("style", a);
  t !== nu(t) && (t = nu(t), t = t.replaceAll("<", "&lt;").replaceAll(">", "&gt;"));
  const l = n.node().appendChild(
    await Qe(
      n,
      t,
      {
        width: Br(t, r) + 100,
        style: a,
        useHtmlLabels: r.htmlLabels
      },
      r
    )
  );
  if (t.includes("&lt;") || t.includes("&gt;")) {
    let h = l.children[0];
    for (h.textContent = h.textContent.replaceAll("&lt;", "<").replaceAll("&gt;", ">"); h.childNodes[0]; )
      h = h.childNodes[0], h.textContent = h.textContent.replaceAll("&lt;", "<").replaceAll("&gt;", ">");
  }
  let c = l.getBBox();
  if (ur(r.htmlLabels)) {
    const h = l.children[0];
    h.style.textAlign = "start";
    const u = vt(l);
    c = h.getBoundingClientRect(), u.attr("width", c.width), u.attr("height", c.height);
  }
  return c;
}
p(Ei, "addText");
function Fi(e, t, r, i, s) {
  return e === r ? [
    { x: e - s / 2, y: t },
    { x: e + s / 2, y: t },
    { x: r + s / 2, y: i },
    { x: r - s / 2, y: i }
  ] : [
    { x: e, y: t - s / 2 },
    { x: e, y: t + s / 2 },
    { x: r, y: i + s / 2 },
    { x: r, y: i - s / 2 }
  ];
}
p(Fi, "lineToPolygon");
async function gy(e, t, r, i, s = r.class.padding ?? 12) {
  const o = i ? 0 : 3, a = e.insert("g").attr("class", xt(t)).attr("id", t.domId || t.id);
  let n = null, l = null, c = null, h = null, u = 0, d = 0, f = 0;
  if (n = a.insert("g").attr("class", "annotation-group text"), t.annotations.length > 0) {
    const b = t.annotations[0];
    await Is(n, { text: `«${b}»` }, 0), u = n.node().getBBox().height;
  }
  l = a.insert("g").attr("class", "label-group text"), await Is(l, t, 0, ["font-weight: bolder"]);
  const m = l.node().getBBox();
  d = m.height, c = a.insert("g").attr("class", "members-group text");
  let y = 0;
  for (const b of t.members) {
    const w = await Is(c, b, y, [b.parseClassifier()]);
    y += w + o;
  }
  f = c.node().getBBox().height, f <= 0 && (f = s / 2), h = a.insert("g").attr("class", "methods-group text");
  let x = 0;
  for (const b of t.methods) {
    const w = await Is(h, b, x, [b.parseClassifier()]);
    x += w + o;
  }
  let C = a.node().getBBox();
  if (n !== null) {
    const b = n.node().getBBox();
    n.attr("transform", `translate(${-b.width / 2})`);
  }
  return l.attr("transform", `translate(${-m.width / 2}, ${u})`), C = a.node().getBBox(), c.attr(
    "transform",
    `translate(0, ${u + d + s * 2})`
  ), C = a.node().getBBox(), h.attr(
    "transform",
    `translate(0, ${u + d + (f ? f + s * 4 : s * 2)})`
  ), C = a.node().getBBox(), { shapeSvg: a, bbox: C };
}
p(gy, "textHelper");
async function Is(e, t, r, i = []) {
  const s = e.insert("g").attr("class", "label").attr("style", i.join("; ")), o = jt();
  let a = "useHtmlLabels" in t ? t.useHtmlLabels : ur(o.htmlLabels) ?? !0, n = "";
  "text" in t ? n = t.text : n = t.label, !a && n.startsWith("\\") && (n = n.substring(1)), js(n) && (a = !0);
  const l = await Qe(
    s,
    lh(Ur(n)),
    {
      width: Br(n, o) + 50,
      // Add room for error when splitting text into multiple lines
      classes: "markdown-node-label",
      useHtmlLabels: a
    },
    o
  );
  let c, h = 1;
  if (a) {
    const u = l.children[0], d = vt(l);
    h = u.innerHTML.split("<br>").length, u.innerHTML.includes("</math>") && (h += u.innerHTML.split("<mrow>").length - 1), await Hh(u), c = u.getBoundingClientRect(), d.attr("width", c.width), d.attr("height", c.height);
  } else {
    i.includes("font-weight: bolder") && vt(l).selectAll("tspan").attr("font-weight", ""), h = l.children.length;
    const u = l.children[0];
    (l.textContent === "" || l.textContent.includes("&gt")) && (u.textContent = n[0] + n.substring(1).replaceAll("&gt;", ">").replaceAll("&lt;", "<").trim(), n[1] === " " && (u.textContent = u.textContent[0] + " " + u.textContent.substring(1))), u.textContent === "undefined" && (u.textContent = ""), c = l.getBBox();
  }
  return s.attr("transform", "translate(0," + (-c.height / (2 * h) + r) + ")"), c.height;
}
p(Is, "addText");
async function my(e, t) {
  const r = $t(), { themeVariables: i } = r, { useGradient: s } = i, o = r.class.padding ?? 12, a = o, n = t.useHtmlLabels ?? ur(r.htmlLabels) ?? !0, l = t;
  l.annotations = l.annotations ?? [], l.members = l.members ?? [], l.methods = l.methods ?? [];
  const { shapeSvg: c, bbox: h } = await gy(e, t, r, n, a), { labelStyles: u, nodeStyles: d } = ft(t);
  t.labelStyle = u, t.cssStyles = l.styles || "";
  const f = l.styles?.join(";") || d || "";
  t.cssStyles || (t.cssStyles = f.replaceAll("!important", "").split(";"));
  const m = l.members.length === 0 && l.methods.length === 0 && !r.class?.hideEmptyMembersBox, y = ct.svg(c), x = ht(t, {});
  t.look !== "handDrawn" && (x.roughness = 0, x.fillStyle = "solid");
  const C = Math.max(t.width ?? 0, h.width);
  let b = Math.max(t.height ?? 0, h.height);
  const w = (t.height ?? 0) > h.height;
  l.members.length === 0 && l.methods.length === 0 ? b += a : l.members.length > 0 && l.methods.length === 0 && (b += a * 2);
  const _ = -C / 2, B = -b / 2;
  let A = m ? o * 2 : l.members.length === 0 && l.methods.length === 0 ? -o : 0;
  w && (A = o * 2);
  const v = y.rectangle(
    _ - o,
    B - o - (m ? o : l.members.length === 0 && l.methods.length === 0 ? -o / 2 : 0),
    C + 2 * o,
    b + 2 * o + A,
    x
  ), L = c.insert(() => v, ":first-child");
  L.attr("class", "basic label-container outer-path");
  const W = L.node().getBBox(), H = c.select(".annotation-group").node().getBBox().height - (m ? o / 2 : 0) || 0, D = c.select(".label-group").node().getBBox().height - (m ? o / 2 : 0) || 0, st = c.select(".members-group").node().getBBox().height - (m ? o / 2 : 0) || 0, Y = (H + D + B + o - (B - o - (m ? o : l.members.length === 0 && l.methods.length === 0 ? -o / 2 : 0))) / 2;
  if (c.selectAll(".text").each((U, Q, I) => {
    const N = vt(I[Q]), X = N.attr("transform");
    let gt = 0;
    if (X) {
      const _t = RegExp(/translate\(([^,]+),([^)]+)\)/).exec(X);
      _t && (gt = parseFloat(_t[2]));
    }
    let lt = gt + B + o - (m ? o : l.members.length === 0 && l.methods.length === 0 ? -o / 2 : 0);
    if (N.attr("class").includes("methods-group")) {
      const It = Math.max(st, a / 2);
      w ? lt = Math.max(
        Y,
        H + D + It + B + a * 2 + o
      ) + a * 2 : lt = H + D + It + B + a * 4 + o;
    }
    l.members.length === 0 && l.methods.length === 0 && r.class?.hideEmptyMembersBox && (l.annotations.length > 0 ? lt = gt - a : lt = gt), n || (lt -= 4);
    let St = _;
    (N.attr("class").includes("label-group") || N.attr("class").includes("annotation-group")) && (St = -N.node()?.getBBox().width / 2 || 0, c.selectAll("text").each(function(It, _t, Et) {
      window.getComputedStyle(Et[_t]).textAnchor === "middle" && (St = 0);
    })), N.attr("transform", `translate(${St}, ${lt})`);
  }), l.members.length > 0 || l.methods.length > 0 || m) {
    const U = H + D + B + o, Q = y.line(
      W.x,
      U,
      W.x + W.width,
      U + 1e-3,
      x
    );
    c.insert(() => Q).attr("class", `divider${t.look === "neo" && !s ? " neo-line" : ""}`).attr("style", f);
  }
  if (m || l.members.length > 0 || l.methods.length > 0) {
    const U = H + D + st + B + a * 2 + o, Q = y.line(
      W.x,
      w ? Math.max(Y, U) : U,
      W.x + W.width,
      (w ? Math.max(Y, U) : U) + 1e-3,
      x
    );
    c.insert(() => Q).attr("class", `divider${t.look === "neo" && !s ? " neo-line" : ""}`).attr("style", f);
  }
  if (l.look !== "handDrawn" && c.selectAll("path").attr("style", f), L.select(":nth-child(2)").attr("style", f), c.selectAll(".divider").select("path").attr("style", f), t.labelStyle ? c.selectAll("span").attr("style", t.labelStyle) : c.selectAll("span").attr("style", f), !n) {
    const U = RegExp(/color\s*:\s*([^;]*)/), Q = U.exec(f);
    if (Q) {
      const I = Q[0].replace("color", "fill");
      c.selectAll("tspan").attr("style", I);
    } else if (u) {
      const I = U.exec(u);
      if (I) {
        const N = I[0].replace("color", "fill");
        c.selectAll("tspan").attr("style", N);
      }
    }
  }
  return dt(t, L), t.intersect = function(U) {
    return at.rect(t, U);
  }, c;
}
p(my, "classBox");
async function yy(e, t) {
  const { labelStyles: r, nodeStyles: i } = ft(t);
  t.labelStyle = r;
  const s = t, o = t, a = 20, n = 20, l = "verifyMethod" in t, c = xt(t), h = $t(), { themeVariables: u } = h, { borderColorArray: d, requirementEdgeLabelBackground: f } = u, m = h.layout === "elk" ? "start" : "center", y = e.insert("g").attr("class", c).attr("id", t.domId ?? t.id);
  let x;
  l ? x = await ir(
    y,
    `&lt;&lt;${s.type}&gt;&gt;`,
    0,
    t.labelStyle
  ) : x = await ir(y, "&lt;&lt;Element&gt;&gt;", 0, t.labelStyle);
  let C = x;
  const b = await ir(
    y,
    s.name,
    C,
    t.labelStyle + "; font-weight: bold;"
  );
  if (C += b + n, l) {
    const D = await ir(
      y,
      `${s.requirementId ? `ID: ${s.requirementId}` : ""}`,
      C,
      t.labelStyle,
      m
    );
    C += D;
    const st = await ir(
      y,
      `${s.text ? `Text: ${s.text}` : ""}`,
      C,
      t.labelStyle,
      m
    );
    C += st;
    const Y = await ir(
      y,
      `${s.risk ? `Risk: ${s.risk}` : ""}`,
      C,
      t.labelStyle,
      m
    );
    C += Y, await ir(
      y,
      `${s.verifyMethod ? `Verification: ${s.verifyMethod}` : ""}`,
      C,
      t.labelStyle,
      m
    );
  } else {
    const D = await ir(
      y,
      `${o.type ? `Type: ${o.type}` : ""}`,
      C,
      t.labelStyle,
      m
    );
    C += D, await ir(
      y,
      `${o.docRef ? `Doc Ref: ${o.docRef}` : ""}`,
      C,
      t.labelStyle,
      m
    );
  }
  const w = (y.node()?.getBBox().width ?? 200) + a, _ = (y.node()?.getBBox().height ?? 200) + a, B = -w / 2, A = -_ / 2, v = ct.svg(y), L = ht(t, {});
  t.look !== "handDrawn" && (L.roughness = 0, L.fillStyle = "solid");
  const W = v.rectangle(B, A, w, _, L), H = y.insert(() => W, ":first-child");
  if (H.attr("class", "basic label-container outer-path").attr("style", i), d?.length) {
    const D = t.colorIndex ?? 0;
    y.attr("data-color-id", `color-${D % d.length}`);
  }
  if (y.selectAll(".label").each((D, st, Y) => {
    const U = vt(Y[st]), Q = U.attr("transform");
    let I = 0, N = 0;
    if (Q) {
      const St = RegExp(/translate\(([^,]+),([^)]+)\)/).exec(Q);
      St && (I = parseFloat(St[1]), N = parseFloat(St[2]));
    }
    const X = N - _ / 2;
    let gt = B + a / 2;
    (st === 0 || st === 1) && (gt = I), U.attr("transform", `translate(${gt}, ${X + a})`);
  }), C > x + b + n) {
    const D = A + x + b + n;
    let st;
    if (t.look === "neo") {
      const Q = [
        [B, D],
        [B + w, D],
        [B + w, D + 1e-3],
        [B, D + 1e-3]
      ];
      st = v.polygon(Q, L);
    } else
      st = v.line(B, D, B + w, D, L);
    y.insert(() => st).attr("class", "divider");
  }
  return dt(t, H), t.intersect = function(D) {
    return at.rect(t, D);
  }, i && t.look !== "handDrawn" && (f || d?.length) && y.selectAll("path").attr("style", i), y;
}
p(yy, "requirementBox");
async function ir(e, t, r, i = "", s = "center") {
  if (t === "")
    return 0;
  const o = e.insert("g").attr("class", "label").attr("style", i), a = $t(), n = a.htmlLabels ?? !0, l = await Qe(
    o,
    lh(Ur(t)),
    {
      width: Br(t, a) + 50,
      // Add room for error when splitting text into multiple lines
      classes: "markdown-node-label",
      useHtmlLabels: n,
      style: i
    },
    a
  );
  let c;
  if (n) {
    const h = l.children[0], u = vt(l);
    s === "start" && vt(h).style("text-align", "left"), c = h.getBoundingClientRect(), u.attr("width", c.width), u.attr("height", c.height);
  } else {
    const h = l.children[0];
    for (const u of h.children)
      i && u.setAttribute("style", i);
    if (s === "start") {
      h.setAttribute("text-anchor", "start");
      for (const u of h.children)
        u.setAttribute("text-anchor", "start");
    }
    c = l.getBBox(), c.height += 6;
  }
  return o.attr("transform", `translate(${-c.width / 2},${-c.height / 2 + r})`), c.height;
}
p(ir, "addText");
var BB = /* @__PURE__ */ p((e) => {
  switch (e) {
    case "Very High":
      return "red";
    case "High":
      return "orange";
    case "Medium":
      return null;
    // no stroke
    case "Low":
      return "blue";
    case "Very Low":
      return "lightblue";
  }
}, "colorFromPriority");
async function xy(e, t, { config: r }) {
  const { labelStyles: i, nodeStyles: s } = ft(t);
  t.labelStyle = i || "";
  const o = 10, a = t.width;
  t.width = (t.width ?? 200) - 10;
  const {
    shapeSvg: n,
    bbox: l,
    label: c
  } = await yt(e, t, xt(t)), h = t.padding || 10;
  let u = "", d;
  "ticket" in t && t.ticket && r?.kanban?.ticketBaseUrl && (u = r?.kanban?.ticketBaseUrl.replace("#TICKET#", t.ticket), d = n.insert("svg:a", ":first-child").attr("class", "kanban-ticket-link").attr("xlink:href", u).attr("target", "_blank"));
  const f = {
    useHtmlLabels: t.useHtmlLabels,
    labelStyle: t.labelStyle || "",
    width: t.width,
    img: t.img,
    padding: t.padding || 8,
    centerLabel: !1
  };
  let m, y;
  d ? { label: m, bbox: y } = await Ln(
    d,
    "ticket" in t && t.ticket || "",
    f
  ) : { label: m, bbox: y } = await Ln(
    n,
    "ticket" in t && t.ticket || "",
    f
  );
  const { label: x, bbox: C } = await Ln(
    n,
    "assigned" in t && t.assigned || "",
    f
  );
  t.width = a;
  const b = 10, w = t?.width || 0, _ = Math.max(y.height, C.height) / 2, B = Math.max(l.height + b * 2, t?.height || 0) + _, A = -w / 2, v = -B / 2;
  c.attr(
    "transform",
    "translate(" + (h - w / 2) + ", " + (-_ - l.height / 2) + ")"
  ), m.attr(
    "transform",
    "translate(" + (h - w / 2) + ", " + (-_ + l.height / 2) + ")"
  ), x.attr(
    "transform",
    "translate(" + (h + w / 2 - C.width - 2 * o) + ", " + (-_ + l.height / 2) + ")"
  );
  let L;
  const { rx: W, ry: H } = t, { cssStyles: D } = t;
  if (t.look === "handDrawn") {
    const st = ct.svg(n), Y = ht(t, {}), U = W || H ? st.path(ze(A, v, w, B, W || 0), Y) : st.rectangle(A, v, w, B, Y);
    L = n.insert(() => U, ":first-child"), L.attr("class", "basic label-container").attr("style", D || null);
  } else {
    L = n.insert("rect", ":first-child"), L.attr("class", "basic label-container __APA__").attr("style", s).attr("rx", W ?? 5).attr("ry", H ?? 5).attr("x", A).attr("y", v).attr("width", w).attr("height", B);
    const st = "priority" in t && t.priority;
    if (st) {
      const Y = n.append("line"), U = A + 2, Q = v + Math.floor((W ?? 0) / 2), I = v + B - Math.floor((W ?? 0) / 2);
      Y.attr("x1", U).attr("y1", Q).attr("x2", U).attr("y2", I).attr("stroke-width", "4").attr("stroke", BB(st));
    }
  }
  return dt(t, L), t.height = B, t.intersect = function(st) {
    return at.rect(t, st);
  }, n;
}
p(xy, "kanbanItem");
async function Cy(e, t) {
  const { labelStyles: r, nodeStyles: i } = ft(t);
  t.labelStyle = r;
  const { shapeSvg: s, bbox: o, halfPadding: a, label: n } = await yt(
    e,
    t,
    xt(t)
  ), l = o.width + 10 * a, c = o.height + 8 * a, h = 0.15 * l, { cssStyles: u } = t, d = o.width + 20, f = o.height + 20, m = Math.max(l, d), y = Math.max(c, f);
  n.attr("transform", `translate(${-o.width / 2}, ${-o.height / 2})`);
  let x;
  const C = `M0 0 
    a${h},${h} 1 0,0 ${m * 0.25},${-1 * y * 0.1}
    a${h},${h} 1 0,0 ${m * 0.25},0
    a${h},${h} 1 0,0 ${m * 0.25},0
    a${h},${h} 1 0,0 ${m * 0.25},${y * 0.1}

    a${h},${h} 1 0,0 ${m * 0.15},${y * 0.33}
    a${h * 0.8},${h * 0.8} 1 0,0 0,${y * 0.34}
    a${h},${h} 1 0,0 ${-1 * m * 0.15},${y * 0.33}

    a${h},${h} 1 0,0 ${-1 * m * 0.25},${y * 0.15}
    a${h},${h} 1 0,0 ${-1 * m * 0.25},0
    a${h},${h} 1 0,0 ${-1 * m * 0.25},0
    a${h},${h} 1 0,0 ${-1 * m * 0.25},${-1 * y * 0.15}

    a${h},${h} 1 0,0 ${-1 * m * 0.1},${-1 * y * 0.33}
    a${h * 0.8},${h * 0.8} 1 0,0 0,${-1 * y * 0.34}
    a${h},${h} 1 0,0 ${m * 0.1},${-1 * y * 0.33}
  H0 V0 Z`;
  if (t.look === "handDrawn") {
    const b = ct.svg(s), w = ht(t, {}), _ = b.path(C, w);
    x = s.insert(() => _, ":first-child"), x.attr("class", "basic label-container").attr("style", re(u));
  } else
    x = s.insert("path", ":first-child").attr("class", "basic label-container").attr("style", i).attr("d", C);
  return x.attr("transform", `translate(${-m / 2}, ${-y / 2})`), dt(t, x), t.calcIntersect = function(b, w) {
    return at.rect(b, w);
  }, t.intersect = function(b) {
    return $.info("Bang intersect", t, b), at.rect(t, b);
  }, s;
}
p(Cy, "bang");
async function by(e, t) {
  const { labelStyles: r, nodeStyles: i } = ft(t);
  t.labelStyle = r;
  const { shapeSvg: s, bbox: o, halfPadding: a, label: n } = await yt(
    e,
    t,
    xt(t)
  ), l = o.width + 2 * a, c = o.height + 2 * a, h = 0.15 * l, u = 0.25 * l, d = 0.35 * l, f = 0.2 * l, { cssStyles: m } = t;
  let y;
  const x = `M0 0 
    a${h},${h} 0 0,1 ${l * 0.25},${-1 * l * 0.1}
    a${d},${d} 1 0,1 ${l * 0.4},${-1 * l * 0.1}
    a${u},${u} 1 0,1 ${l * 0.35},${l * 0.2}

    a${h},${h} 1 0,1 ${l * 0.15},${c * 0.35}
    a${f},${f} 1 0,1 ${-1 * l * 0.15},${c * 0.65}

    a${u},${h} 1 0,1 ${-1 * l * 0.25},${l * 0.15}
    a${d},${d} 1 0,1 ${-1 * l * 0.5},0
    a${h},${h} 1 0,1 ${-1 * l * 0.25},${-1 * l * 0.15}

    a${h},${h} 1 0,1 ${-1 * l * 0.1},${-1 * c * 0.35}
    a${f},${f} 1 0,1 ${l * 0.1},${-1 * c * 0.65}
  H0 V0 Z`;
  if (t.look === "handDrawn") {
    const C = ct.svg(s), b = ht(t, {}), w = C.path(x, b);
    y = s.insert(() => w, ":first-child"), y.attr("class", "basic label-container").attr("style", re(m));
  } else
    y = s.insert("path", ":first-child").attr("class", "basic label-container").attr("style", i).attr("d", x);
  return n.attr("transform", `translate(${-o.width / 2}, ${-o.height / 2})`), y.attr("transform", `translate(${-l / 2}, ${-c / 2})`), dt(t, y), t.calcIntersect = function(C, b) {
    return at.rect(C, b);
  }, t.intersect = function(C) {
    return $.info("Cloud intersect", t, C), at.rect(t, C);
  }, s;
}
p(by, "cloud");
async function ky(e, t) {
  const { labelStyles: r, nodeStyles: i } = ft(t);
  t.labelStyle = r;
  const { shapeSvg: s, bbox: o, halfPadding: a, label: n } = await yt(
    e,
    t,
    xt(t)
  ), l = o.width + 8 * a, c = o.height + 2 * a, h = 5, u = t.look === "neo" ? `
    M${-l / 2} ${c / 2 - h}
    v${-c + 2 * h}
    q0,-${h} ${h},-${h}
    h${l - 2 * h}
    q${h},0 ${h},${h}
    v${c - h}
    H${-l / 2}
    Z
  ` : `
    M${-l / 2} ${c / 2 - h}
    v${-c + 2 * h}
    q0,-${h} ${h},-${h}
    h${l - 2 * h}
    q${h},0 ${h},${h}
    v${c - 2 * h}
    q0,${h} ${-h},${h}
    h${-(l - 2 * h)}
    q${-h},0 ${-h},${-h}
    Z
  `;
  if (!t.domId)
    throw new Error(
      `defaultMindmapNode: node "${t.id}" is missing a domId — was render.ts domId prefixing skipped?`
    );
  const d = s.append("path").attr("id", t.domId).attr("class", "node-bkg node-" + t.type).attr("style", i).attr("d", u);
  return s.append("line").attr("class", "node-line-").attr("x1", -l / 2).attr("y1", c / 2).attr("x2", l / 2).attr("y2", c / 2), n.attr("transform", `translate(${-o.width / 2}, ${-o.height / 2})`), s.append(() => n.node()), dt(t, d), t.calcIntersect = function(f, m) {
    return at.rect(f, m);
  }, t.intersect = function(f) {
    return at.rect(t, f);
  }, s;
}
p(ky, "defaultMindmapNode");
async function wy(e, t) {
  const r = {
    padding: t.padding ?? 0
  };
  return Xh(e, t, r);
}
p(wy, "mindmapCircle");
var vB = [
  {
    semanticName: "Process",
    name: "Rectangle",
    shortName: "rect",
    description: "Standard process shape",
    aliases: ["proc", "process", "rectangle"],
    internalAliases: ["squareRect"],
    handler: Jm
  },
  {
    semanticName: "Event",
    name: "Rounded Rectangle",
    shortName: "rounded",
    description: "Represents an event",
    aliases: ["event"],
    internalAliases: ["roundedRect"],
    handler: Km
  },
  {
    semanticName: "Terminal Point",
    name: "Stadium",
    shortName: "stadium",
    description: "Terminal point",
    aliases: ["terminal", "pill"],
    handler: ty
  },
  {
    semanticName: "Subprocess",
    name: "Framed Rectangle",
    shortName: "fr-rect",
    description: "Subprocess",
    aliases: ["subprocess", "subproc", "framed-rectangle", "subroutine"],
    handler: sy
  },
  {
    semanticName: "Database",
    name: "Cylinder",
    shortName: "cyl",
    description: "Database storage",
    aliases: ["db", "database", "cylinder"],
    handler: km
  },
  {
    semanticName: "Data Store",
    name: "Data Store",
    shortName: "datastore",
    description: "Data flow diagram data store",
    aliases: ["data-store"],
    handler: wm
  },
  {
    semanticName: "Folder",
    name: "Folder",
    shortName: "folder",
    description: "Folder or directory",
    aliases: ["directory"],
    handler: vm
  },
  {
    semanticName: "Bucket",
    name: "Bucket",
    shortName: "bucket",
    description: "Object storage bucket",
    handler: am
  },
  {
    semanticName: "Console",
    name: "Console (terminal window)",
    shortName: "console",
    description: "Terminal or console window",
    handler: fm
  },
  {
    semanticName: "Browser",
    name: "Browser",
    shortName: "browser",
    description: "Browser window",
    handler: hm
  },
  {
    semanticName: "Person",
    name: "Person",
    shortName: "person",
    description: "Person (circular head above a rounded body)",
    handler: bm
  },
  {
    semanticName: "Start",
    name: "Circle",
    shortName: "circle",
    description: "Starting point",
    aliases: ["circ"],
    handler: Xh
  },
  {
    semanticName: "Bang",
    name: "Bang",
    shortName: "bang",
    description: "Bang",
    aliases: ["bang"],
    handler: Cy
  },
  {
    semanticName: "Cloud",
    name: "Cloud",
    shortName: "cloud",
    description: "cloud",
    aliases: ["cloud"],
    handler: by
  },
  {
    semanticName: "Decision",
    name: "Diamond",
    shortName: "diam",
    description: "Decision-making step",
    aliases: ["decision", "diamond", "question"],
    handler: jm
  },
  {
    semanticName: "Prepare Conditional",
    name: "Hexagon",
    shortName: "hex",
    description: "Preparation or condition step",
    aliases: ["hexagon", "prepare"],
    handler: Em
  },
  {
    semanticName: "Data Input/Output",
    name: "Lean Right",
    shortName: "lean-r",
    description: "Represents input or output",
    aliases: ["lean-right", "in-out"],
    internalAliases: ["lean_right"],
    handler: qm
  },
  {
    semanticName: "Data Input/Output",
    name: "Lean Left",
    shortName: "lean-l",
    description: "Represents output or input",
    aliases: ["lean-left", "out-in"],
    internalAliases: ["lean_left"],
    handler: Nm
  },
  {
    semanticName: "Priority Action",
    name: "Trapezoid Base Bottom",
    shortName: "trap-b",
    description: "Priority action",
    aliases: ["priority", "trapezoid-bottom", "trapezoid"],
    handler: hy
  },
  {
    semanticName: "Manual Operation",
    name: "Trapezoid Base Top",
    shortName: "trap-t",
    description: "Represents a manual task",
    aliases: ["manual", "trapezoid-top", "inv-trapezoid"],
    internalAliases: ["inv_trapezoid"],
    handler: Rm
  },
  {
    semanticName: "Stop",
    name: "Double Circle",
    shortName: "dbl-circ",
    description: "Represents a stop point",
    aliases: ["double-circle"],
    internalAliases: ["doublecircle"],
    handler: Tm
  },
  {
    semanticName: "Text Block",
    name: "Text Block",
    shortName: "text",
    description: "Text block",
    handler: ny
  },
  {
    semanticName: "Card",
    name: "Notched Rectangle",
    shortName: "notch-rect",
    description: "Represents a card",
    aliases: ["card", "notched-rectangle"],
    handler: cm
  },
  {
    semanticName: "Lined/Shaded Process",
    name: "Lined Rectangle",
    shortName: "lin-rect",
    description: "Lined process shape",
    aliases: ["lined-rectangle", "lined-process", "lin-proc", "shaded-process"],
    handler: Zm
  },
  {
    semanticName: "Start",
    name: "Small Circle",
    shortName: "sm-circ",
    description: "Small starting point",
    aliases: ["start", "small-circle"],
    internalAliases: ["stateStart"],
    handler: iy
  },
  {
    semanticName: "Stop",
    name: "Framed Circle",
    shortName: "fr-circ",
    description: "Stop point",
    aliases: ["stop", "framed-circle"],
    internalAliases: ["stateEnd"],
    handler: ry
  },
  {
    semanticName: "Fork/Join",
    name: "Filled Rectangle",
    shortName: "fork",
    description: "Fork or join in process flow",
    aliases: ["join"],
    internalAliases: ["forkJoin"],
    handler: Lm
  },
  {
    semanticName: "Collate",
    name: "Hourglass",
    shortName: "hourglass",
    description: "Represents a collate operation",
    aliases: ["hourglass", "collate"],
    handler: Fm
  },
  {
    semanticName: "Comment",
    name: "Curly Brace",
    shortName: "brace",
    description: "Adds a comment",
    aliases: ["comment", "brace-l"],
    handler: mm
  },
  {
    semanticName: "Comment Right",
    name: "Curly Brace",
    shortName: "brace-r",
    description: "Adds a comment",
    handler: ym
  },
  {
    semanticName: "Comment with braces on both sides",
    name: "Curly Braces",
    shortName: "braces",
    description: "Adds a comment",
    handler: xm
  },
  {
    semanticName: "Com Link",
    name: "Lightning Bolt",
    shortName: "bolt",
    description: "Communication link",
    aliases: ["com-link", "lightning-bolt"],
    handler: Wm
  },
  {
    semanticName: "Document",
    name: "Document",
    shortName: "doc",
    description: "Represents a document",
    aliases: ["doc", "document"],
    handler: dy
  },
  {
    semanticName: "Delay",
    name: "Half-Rounded Rectangle",
    shortName: "delay",
    description: "Represents a delay",
    aliases: ["half-rounded-rectangle"],
    handler: Am
  },
  {
    semanticName: "Direct Access Storage",
    name: "Horizontal Cylinder",
    shortName: "h-cyl",
    description: "Direct access storage",
    aliases: ["das", "horizontal-cylinder"],
    handler: ly
  },
  {
    semanticName: "Disk Storage",
    name: "Lined Cylinder",
    shortName: "lin-cyl",
    description: "Disk storage",
    aliases: ["disk", "lined-cylinder"],
    handler: zm
  },
  {
    semanticName: "Display",
    name: "Curved Trapezoid",
    shortName: "curv-trap",
    description: "Represents a display",
    aliases: ["curved-trapezoid", "display"],
    handler: Cm
  },
  {
    semanticName: "Divided Process",
    name: "Divided Rectangle",
    shortName: "div-rect",
    description: "Divided process shape",
    aliases: ["div-proc", "divided-rectangle", "divided-process"],
    handler: Sm
  },
  {
    semanticName: "Extract",
    name: "Triangle",
    shortName: "tri",
    description: "Extraction process",
    aliases: ["extract", "triangle"],
    handler: uy
  },
  {
    semanticName: "Internal Storage",
    name: "Window Pane",
    shortName: "win-pane",
    description: "Internal storage",
    aliases: ["internal-storage", "window-pane"],
    handler: py
  },
  {
    semanticName: "Junction",
    name: "Filled Circle",
    shortName: "f-circ",
    description: "Junction point",
    aliases: ["junction", "filled-circle"],
    handler: _m
  },
  {
    semanticName: "Loop Limit",
    name: "Trapezoidal Pentagon",
    shortName: "notch-pent",
    description: "Loop limit step",
    aliases: ["loop-limit", "notched-pentagon"],
    handler: cy
  },
  {
    semanticName: "Manual File",
    name: "Flipped Triangle",
    shortName: "flip-tri",
    description: "Manual file operation",
    aliases: ["manual-file", "flipped-triangle"],
    handler: Bm
  },
  {
    semanticName: "Manual Input",
    name: "Sloped Rectangle",
    shortName: "sl-rect",
    description: "Manual input step",
    aliases: ["manual-input", "sloped-rectangle"],
    handler: Qm
  },
  {
    semanticName: "Multi-Document",
    name: "Stacked Document",
    shortName: "docs",
    description: "Multiple documents",
    aliases: ["documents", "st-doc", "stacked-document"],
    handler: Um
  },
  {
    semanticName: "Multi-Process",
    name: "Stacked Rectangle",
    shortName: "st-rect",
    description: "Multiple processes",
    aliases: ["procs", "processes", "stacked-rectangle"],
    handler: Ym
  },
  {
    semanticName: "Stored Data",
    name: "Bow Tie Rectangle",
    shortName: "bow-rect",
    description: "Stored data",
    aliases: ["stored-data", "bow-tie-rectangle"],
    handler: om
  },
  {
    semanticName: "Summary",
    name: "Crossed Circle",
    shortName: "cross-circ",
    description: "Summary",
    aliases: ["summary", "crossed-circle"],
    handler: gm
  },
  {
    semanticName: "Tagged Document",
    name: "Tagged Document",
    shortName: "tag-doc",
    description: "Tagged document",
    aliases: ["tag-doc", "tagged-document"],
    handler: ay
  },
  {
    semanticName: "Tagged Process",
    name: "Tagged Rectangle",
    shortName: "tag-rect",
    description: "Tagged process",
    aliases: ["tagged-rectangle", "tag-proc", "tagged-process"],
    handler: oy
  },
  {
    semanticName: "Paper Tape",
    name: "Flag",
    shortName: "flag",
    description: "Paper tape",
    aliases: ["paper-tape"],
    handler: fy
  },
  {
    semanticName: "Odd",
    name: "Odd",
    shortName: "odd",
    description: "Odd shape",
    internalAliases: ["rect_left_inv_arrow"],
    handler: Gm
  },
  {
    semanticName: "Lined Document",
    name: "Lined Document",
    shortName: "lin-doc",
    description: "Lined document",
    aliases: ["lined-document"],
    handler: Hm
  }
], LB = /* @__PURE__ */ p(() => {
  const t = [
    ...Object.entries({
      // States
      state: ey,
      choice: um,
      note: Xm,
      // Rectangles
      composite: dm,
      rectWithTitle: Vm,
      labelRect: Pm,
      block_arrow: lm,
      // Collapsed subgraph (flowchart `@{ view: collapsed }`)
      collapsedGroup: nm,
      // Icons
      iconSquare: Im,
      iconCircle: Om,
      icon: Mm,
      iconRounded: $m,
      imageSquare: Dm,
      anchor: im,
      // Kanban diagram
      kanbanItem: xy,
      //Mindmap diagram
      mindmapCircle: wy,
      defaultMindmapNode: ky,
      // class diagram
      classBox: my,
      // er diagram
      erBox: jh,
      // Requirement diagram
      requirementBox: yy
    }),
    ...vB.flatMap((r) => [
      r.shortName,
      ..."aliases" in r ? r.aliases : [],
      ..."internalAliases" in r ? r.internalAliases : []
    ].map((s) => [s, r.handler]))
  ];
  return Object.fromEntries(t);
}, "generateShapeMap"), Sy = LB();
function AB(e) {
  return e in Sy;
}
p(AB, "isValidShape");
var Ia = /* @__PURE__ */ p(({
  flowchart: e
}) => {
  const t = e?.subGraphTitleMargin?.top ?? 0, r = e?.subGraphTitleMargin?.bottom ?? 0, i = t + r;
  return {
    subGraphTitleTopMargin: t,
    subGraphTitleBottomMargin: r,
    subGraphTitleTotalMargin: i
  };
}, "getSubGraphTitleMargins"), Da = /* @__PURE__ */ new Map();
async function Gh(e, t, r) {
  let i, s;
  t.shape === "rect" && (t.rx && t.ry ? t.shape = "roundedRect" : t.shape = "squareRect");
  const o = t.shape ? Sy[t.shape] : void 0;
  if (!o)
    throw new Error(`No such shape: ${t.shape}. Please check your syntax.`);
  if (t.link) {
    let a;
    r.config.securityLevel === "sandbox" ? a = "_top" : t.linkTarget && (a = t.linkTarget || "_blank"), i = e.insert("svg:a").attr("xlink:href", t.link).attr("target", a ?? null), s = await o(i, t, r);
  } else
    s = await o(e, t, r), i = s;
  return i.attr("data-look", re(t.look)), t.tooltip && s.attr("title", t.tooltip), Da.set(t.id, i), t.haveCallback && i.attr("class", i.attr("class") + " clickable"), i;
}
p(Gh, "insertNode");
var JM = /* @__PURE__ */ p((e, t) => {
  Da.set(t.id, e);
}, "setNodeElem"), EB = /* @__PURE__ */ p(() => {
  Da.clear();
}, "clear"), wd = /* @__PURE__ */ p((e) => {
  const t = Da.get(e.id);
  $.trace(
    "Transforming node",
    e.diff,
    e,
    "translate(" + (e.x - e.width / 2 - 5) + ", " + e.width / 2 + ")"
  );
  const r = 8, i = e.diff || 0;
  return e.clusterNode ? t.attr(
    "transform",
    "translate(" + (e.x + i - e.width / 2) + ", " + (e.y - e.height / 2 - r) + ")"
  ) : t.attr("transform", "translate(" + e.x + ", " + e.y + ")"), i;
}, "positionNode"), FB = /* @__PURE__ */ p(async (e, t) => {
  const r = $t(), { themeVariables: i, handDrawnSeed: s } = r, { clusterBkg: o, clusterBorder: a } = i, n = a, { labelStyles: l, nodeStyles: c, borderStyles: h, backgroundStyles: u } = ft(t), d = e.insert("g").attr("class", "cluster swimlane " + (t.cssClasses || "")).attr("id", t.id).attr("data-id", t.id).attr("data-et", "cluster").attr("data-look", t.look), f = ur(r.flowchart.htmlLabels), m = t.direction === "LR", y = d.insert("g").attr("class", "cluster-label swimlane-label"), x = await Qe(y, t.label, {
    style: t.labelStyle,
    useHtmlLabels: f,
    isNode: !0,
    width: t.width
  });
  let C = x.getBBox();
  if (f) {
    const Y = x.children[0], U = vt(x);
    C = Y.getBoundingClientRect(), U.attr("width", C.width), U.attr("height", C.height);
  }
  const b = t.padding ?? 0, w = t.width <= C.width + b ? C.width + b : t.width;
  t.width <= C.width + b ? t.diff = (w - t.width) / 2 - b : t.diff = -b;
  const _ = t.height, B = t.y - _ / 2, A = t.y + _ / 2, v = t.x - w / 2, L = t.swimlaneContentTop !== void 0 ? t.swimlaneContentTop : B + _ / 3, W = m ? 4 : 0, H = C.height + 2 * W;
  let D, st;
  if (m) {
    const Y = Math.max(H, C.height + 2 * W), U = v + Y, Q = Math.max(0, w - Y);
    if (t.look === "handDrawn") {
      const X = ct.svg(d), gt = ht(t, {
        roughness: 0.7,
        fill: o,
        stroke: n,
        fillWeight: 3,
        seed: s
      }), lt = ht(t, {
        roughness: 0.7,
        fill: "none",
        stroke: n,
        seed: s
      }), St = X.rectangle(v, B, Y, _, gt);
      D = d.insert(() => St, ":first-child");
      const It = X.rectangle(U, B, Q, _, lt);
      st = d.insert(() => It, ":first-child"), D.select("path:nth-child(2)").attr("style", h.join(";")), D.select("path").attr("style", u.join(";").replace("fill", "stroke"));
    } else
      D = d.insert("rect", ":first-child"), st = d.insert("rect", ":first-child"), D.attr("class", "swimlane-title").attr("style", c).attr("x", v).attr("y", B).attr("width", Y).attr("height", _).attr("fill", o).attr("stroke", n), st.attr("class", "swimlane-body").attr("style", c).attr("x", U).attr("y", B).attr("width", Q).attr("height", _).attr("fill", "none").attr("stroke", n);
    const I = v + Y / 2, N = t.y;
    y.attr(
      "transform",
      `translate(${I}, ${N}) rotate(-90) translate(${-C.width / 2}, ${-C.height / 2})`
    );
  } else {
    const Y = Math.max(0, L - B), U = Math.min(H, Y), Q = B + U, I = Math.max(0, A - Q), N = t.x - w / 2;
    if (t.look === "handDrawn") {
      const lt = ct.svg(d), St = ht(t, {
        roughness: 0.7,
        fill: o,
        stroke: n,
        fillWeight: 3,
        seed: s
      }), It = ht(t, {
        roughness: 0.7,
        fill: "none",
        stroke: n,
        seed: s
      }), _t = lt.rectangle(N, B, w, U, St);
      D = d.insert(() => _t, ":first-child");
      const Et = lt.rectangle(N, Q, w, I, It);
      st = d.insert(() => Et, ":first-child"), D.select("path:nth-child(2)").attr("style", h.join(";")), D.select("path").attr("style", u.join(";").replace("fill", "stroke"));
    } else
      D = d.insert("rect", ":first-child"), st = d.insert("rect", ":first-child"), D.attr("class", "swimlane-title").attr("style", c).attr("x", N).attr("y", B).attr("width", w).attr("height", U).attr("fill", o).attr("stroke", n), st.attr("class", "swimlane-body").attr("style", c).attr("x", N).attr("y", Q).attr("width", w).attr("height", I).attr("fill", "none").attr("stroke", n);
    const X = t.x - C.width / 2, gt = B + (U - C.height) / 2;
    y.attr("transform", `translate(${X}, ${gt})`);
  }
  if ($.trace("Swimlane data ", t, JSON.stringify(t)), l) {
    const Y = y.select("span");
    Y && Y.attr("style", l);
  }
  return t.offsetX = 0, t.width = w, t.height = _, t.offsetY = C.height - b / 2, t.intersect = function(Y) {
    return xi(t, Y);
  }, { cluster: d, labelBBox: C };
}, "swimlane"), Ty = /* @__PURE__ */ p(async (e, t) => {
  $.info("Creating subgraph rect for ", t.id, t);
  const r = $t(), { themeVariables: i, handDrawnSeed: s } = r, { clusterBkg: o, clusterBorder: a } = i, { labelStyles: n, nodeStyles: l, borderStyles: c, backgroundStyles: h } = ft(t), u = e.insert("g").attr("class", "cluster " + t.cssClasses).attr("id", t.domId).attr("data-look", t.look), d = ye(r), f = u.insert("g").attr("class", "cluster-label ");
  let m;
  t.labelType === "markdown" ? m = await Qe(f, t.label, {
    style: t.labelStyle,
    useHtmlLabels: d,
    isNode: !0,
    width: t.width
  }) : m = await Wr(f, t.label, t.labelStyle || "", !1, !0);
  let y = m.getBBox();
  if (ye(r)) {
    const v = m.children[0], L = vt(m);
    y = v.getBoundingClientRect(), L.attr("width", y.width), L.attr("height", y.height);
  }
  const x = t.width <= y.width + t.padding ? y.width + t.padding : t.width;
  t.width <= y.width + t.padding ? t.diff = (x - t.width) / 2 - t.padding : t.diff = -t.padding;
  const C = t.height, b = t.x - x / 2, w = t.y - C / 2;
  $.trace("Data ", t, JSON.stringify(t));
  let _;
  if (t.look === "handDrawn") {
    const v = ct.svg(u), L = ht(t, {
      roughness: 0.7,
      fill: o,
      // fill: 'red',
      stroke: a,
      fillWeight: 3,
      seed: s
    }), W = v.path(ze(b, w, x, C, 0), L);
    _ = u.insert(() => ($.debug("Rough node insert CXC", W), W), ":first-child"), _.select("path:nth-child(2)").attr("style", c.join(";")), _.select("path").attr("style", h.join(";").replace("fill", "stroke"));
  } else
    _ = u.insert("rect", ":first-child"), _.attr("style", l).attr("rx", t.rx).attr("ry", t.ry).attr("x", b).attr("y", w).attr("width", x).attr("height", C);
  const { subGraphTitleTopMargin: B } = Ia(r);
  if (f.attr(
    "transform",
    // This puts the label on top of the box instead of inside it
    `translate(${t.x - y.width / 2}, ${t.y - t.height / 2 + B})`
  ), n) {
    const v = f.select("span");
    v && v.attr("style", n);
  }
  const A = _.node().getBBox();
  return t.offsetX = 0, t.width = A.width, t.height = A.height, t.offsetY = y.height - t.padding / 2, t.intersect = function(v) {
    return xi(t, v);
  }, { cluster: u, labelBBox: y };
}, "rect"), MB = /* @__PURE__ */ p((e, t) => {
  const r = e.insert("g").attr("class", "note-cluster").attr("id", t.domId), i = r.insert("rect", ":first-child"), s = 0 * t.padding, o = s / 2;
  i.attr("rx", t.rx).attr("ry", t.ry).attr("x", t.x - t.width / 2 - o).attr("y", t.y - t.height / 2 - o).attr("width", t.width + s).attr("height", t.height + s).attr("fill", "none");
  const a = i.node().getBBox();
  return t.width = a.width, t.height = a.height, t.intersect = function(n) {
    return xi(t, n);
  }, { cluster: r, labelBBox: { width: 0, height: 0 } };
}, "noteGroup"), OB = /* @__PURE__ */ p(async (e, t) => {
  const r = $t(), { themeVariables: i, handDrawnSeed: s } = r, { altBackground: o, compositeBackground: a, compositeTitleBackground: n, nodeBorder: l } = i, c = e.insert("g").attr("class", t.cssClasses).attr("id", t.domId).attr("data-id", t.id).attr("data-look", t.look), h = c.insert("g", ":first-child"), u = c.insert("g").attr("class", "cluster-label");
  let d = c.append("rect");
  const f = await Wr(u, t.label, t.labelStyle, void 0, !0);
  let m = f.getBBox();
  if (ye(r)) {
    const W = f.children[0], H = vt(f);
    m = W.getBoundingClientRect(), H.attr("width", m.width), H.attr("height", m.height);
  }
  const y = 0 * t.padding, x = y / 2, C = (t.width <= m.width + t.padding ? m.width + t.padding : t.width) + y;
  t.width <= m.width + t.padding ? t.diff = (C - t.width) / 2 - t.padding : t.diff = -t.padding;
  const b = t.height + y, w = t.height + y - m.height - 6, _ = t.x - C / 2, B = t.y - b / 2;
  t.width = C;
  const A = t.y - t.height / 2 - x + m.height + 2;
  let v;
  if (t.look === "handDrawn") {
    const W = t.cssClasses.includes("statediagram-cluster-alt"), H = ct.svg(c), D = t.rx || t.ry ? H.path(ze(_, B, C, b, 10), {
      roughness: 0.7,
      fill: n,
      fillStyle: "solid",
      stroke: l,
      seed: s
    }) : H.rectangle(_, B, C, b, { seed: s });
    v = c.insert(() => D, ":first-child");
    const st = H.rectangle(_, A, C, w, {
      fill: W ? o : a,
      fillStyle: W ? "hachure" : "solid",
      stroke: l,
      seed: s
    });
    v = c.insert(() => D, ":first-child"), d = c.insert(() => st);
  } else
    v = h.insert("rect", ":first-child"), v.attr("class", "outer").attr("x", _).attr("y", B).attr("width", C).attr("height", b).attr("data-look", t.look), d.attr("class", "inner").attr("x", _).attr("y", A).attr("width", C).attr("height", w);
  u.attr(
    "transform",
    `translate(${t.x - m.width / 2}, ${B + 1 - (ye(r) ? 0 : 3)})`
  );
  const L = v.node().getBBox();
  return t.height = L.height, t.offsetX = 0, t.offsetY = m.height - t.padding / 2, t.labelBBox = m, t.intersect = function(W) {
    return xi(t, W);
  }, { cluster: c, labelBBox: m };
}, "roundedWithTitle"), $B = /* @__PURE__ */ p(async (e, t) => {
  $.info("Creating subgraph rect for ", t.id, t);
  const r = $t(), { themeVariables: i, handDrawnSeed: s } = r, { clusterBkg: o, clusterBorder: a } = i, { labelStyles: n, nodeStyles: l, borderStyles: c, backgroundStyles: h } = ft(t), u = e.insert("g").attr("class", "cluster " + t.cssClasses).attr("id", t.domId).attr("data-look", t.look), d = ye(r), f = u.insert("g").attr("class", "cluster-label "), m = await Qe(f, t.label, {
    style: t.labelStyle,
    useHtmlLabels: d,
    isNode: !0,
    width: t.width
  });
  let y = m.getBBox();
  if (ye(r)) {
    const v = m.children[0], L = vt(m);
    y = v.getBoundingClientRect(), L.attr("width", y.width), L.attr("height", y.height);
  }
  const x = t.width <= y.width + t.padding ? y.width + t.padding : t.width;
  t.width <= y.width + t.padding ? t.diff = (x - t.width) / 2 - t.padding : t.diff = -t.padding;
  const C = t.height, b = t.x - x / 2, w = t.y - C / 2;
  $.trace("Data ", t, JSON.stringify(t));
  let _;
  if (t.look === "handDrawn") {
    const v = ct.svg(u), L = ht(t, {
      roughness: 0.7,
      fill: o,
      // fill: 'red',
      stroke: a,
      fillWeight: 4,
      seed: s
    }), W = v.path(ze(b, w, x, C, t.rx), L);
    _ = u.insert(() => ($.debug("Rough node insert CXC", W), W), ":first-child"), _.select("path:nth-child(2)").attr("style", c.join(";")), _.select("path").attr("style", h.join(";").replace("fill", "stroke"));
  } else
    _ = u.insert("rect", ":first-child"), _.attr("style", l).attr("rx", t.rx).attr("ry", t.ry).attr("x", b).attr("y", w).attr("width", x).attr("height", C);
  const { subGraphTitleTopMargin: B } = Ia(r);
  if (f.attr(
    "transform",
    // This puts the label on top of the box instead of inside it
    `translate(${t.x - y.width / 2}, ${t.y - t.height / 2 + B})`
  ), n) {
    const v = f.select("span");
    v && v.attr("style", n);
  }
  const A = _.node().getBBox();
  return t.offsetX = 0, t.width = A.width, t.height = A.height, t.offsetY = y.height - t.padding / 2, t.intersect = function(v) {
    return xi(t, v);
  }, { cluster: u, labelBBox: y };
}, "kanbanSection"), IB = /* @__PURE__ */ p((e, t) => {
  const r = $t(), { themeVariables: i, handDrawnSeed: s } = r, { nodeBorder: o } = i, a = e.insert("g").attr("class", t.cssClasses).attr("id", t.domId).attr("data-look", t.look), n = a.insert("g", ":first-child"), l = 0 * t.padding, c = t.width + l;
  t.diff = -t.padding;
  const h = t.height + l, u = t.x - c / 2, d = t.y - h / 2;
  t.width = c;
  let f;
  if (t.look === "handDrawn") {
    const x = ct.svg(a).rectangle(u, d, c, h, {
      fill: "lightgrey",
      roughness: 0.5,
      strokeLineDash: [5],
      stroke: o,
      seed: s
    });
    f = a.insert(() => x, ":first-child");
  } else {
    f = n.insert("rect", ":first-child");
    let y = "outer";
    t.look, y = "divider", f.attr("class", y).attr("x", u).attr("y", d).attr("width", c).attr("height", h).attr("data-look", t.look);
  }
  const m = f.node().getBBox();
  return t.height = m.height, t.offsetX = 0, t.offsetY = 0, t.intersect = function(y) {
    return xi(t, y);
  }, { cluster: a, labelBBox: {} };
}, "divider"), DB = Ty, RB = {
  rect: Ty,
  squareRect: DB,
  roundedWithTitle: OB,
  noteGroup: MB,
  divider: IB,
  kanbanSection: $B,
  swimlane: FB
}, _y = /* @__PURE__ */ new Map(), By = /* @__PURE__ */ p(async (e, t) => {
  const r = t.shape || "rect", i = await RB[r](e, t);
  return _y.set(t.id, i), i;
}, "insertCluster"), PB = /* @__PURE__ */ p(() => {
  _y = /* @__PURE__ */ new Map();
}, "clear"), vs = /* @__PURE__ */ p((e, t) => {
  if (t)
    return "translate(" + -e.width / 2 + ", " + -e.height / 2 + ")";
  const r = e.x ?? 0, i = e.y ?? 0;
  return "translate(" + -(r + e.width / 2) + ", " + -(i + e.height / 2) + ")";
}, "computeLabelTransform"), ge = {
  aggregation: 17.25,
  extension: 17.25,
  composition: 17.25,
  dependency: 6,
  lollipop: 13.5,
  arrow_point: 4,
  arrow_barb: 0,
  arrow_barb_neo: 5.5
  //arrow_cross: 24,
}, Sd = {
  arrow_point: 4,
  arrow_cross: 12.5,
  arrow_circle: 12.5
};
function Ds(e, t) {
  if (e === void 0 || t === void 0)
    return { angle: 0, deltaX: 0, deltaY: 0 };
  e = Xt(e), t = Xt(t);
  const [r, i] = [e.x, e.y], [s, o] = [t.x, t.y], a = s - r, n = o - i;
  return { angle: Math.atan(n / a), deltaX: a, deltaY: n };
}
p(Ds, "calculateDeltaAndAngle");
var Xt = /* @__PURE__ */ p((e) => Array.isArray(e) ? { x: e[0], y: e[1] } : e, "pointTransformer"), NB = /* @__PURE__ */ p((e) => ({
  x: /* @__PURE__ */ p(function(t, r, i) {
    let s = 0;
    const o = Xt(i[0]).x < Xt(i[i.length - 1]).x ? "left" : "right";
    if (r === 0 && Object.hasOwn(ge, e.arrowTypeStart)) {
      const { angle: f, deltaX: m } = Ds(i[0], i[1]);
      s = ge[e.arrowTypeStart] * Math.cos(f) * (m >= 0 ? 1 : -1);
    } else if (r === i.length - 1 && Object.hasOwn(ge, e.arrowTypeEnd)) {
      const { angle: f, deltaX: m } = Ds(
        i[i.length - 1],
        i[i.length - 2]
      );
      s = ge[e.arrowTypeEnd] * Math.cos(f) * (m >= 0 ? 1 : -1);
    }
    const a = Math.abs(
      Xt(t).x - Xt(i[i.length - 1]).x
    ), n = Math.abs(
      Xt(t).y - Xt(i[i.length - 1]).y
    ), l = Math.abs(Xt(t).x - Xt(i[0]).x), c = Math.abs(Xt(t).y - Xt(i[0]).y), h = ge[e.arrowTypeStart], u = ge[e.arrowTypeEnd], d = 1;
    if (a < u && a > 0 && n < u) {
      let f = u + d - a;
      f *= o === "right" ? -1 : 1, s -= f;
    }
    if (l < h && l > 0 && c < h) {
      let f = h + d - l;
      f *= o === "right" ? -1 : 1, s += f;
    }
    return Xt(t).x + s;
  }, "x"),
  y: /* @__PURE__ */ p(function(t, r, i) {
    let s = 0;
    const o = Xt(i[0]).y < Xt(i[i.length - 1]).y ? "down" : "up";
    if (r === 0 && Object.hasOwn(ge, e.arrowTypeStart)) {
      const { angle: f, deltaY: m } = Ds(i[0], i[1]);
      s = ge[e.arrowTypeStart] * Math.abs(Math.sin(f)) * (m >= 0 ? 1 : -1);
    } else if (r === i.length - 1 && Object.hasOwn(ge, e.arrowTypeEnd)) {
      const { angle: f, deltaY: m } = Ds(
        i[i.length - 1],
        i[i.length - 2]
      );
      s = ge[e.arrowTypeEnd] * Math.abs(Math.sin(f)) * (m >= 0 ? 1 : -1);
    }
    const a = Math.abs(
      Xt(t).y - Xt(i[i.length - 1]).y
    ), n = Math.abs(
      Xt(t).x - Xt(i[i.length - 1]).x
    ), l = Math.abs(Xt(t).y - Xt(i[0]).y), c = Math.abs(Xt(t).x - Xt(i[0]).x), h = ge[e.arrowTypeStart], u = ge[e.arrowTypeEnd], d = 1;
    if (a < u && a > 0 && n < u) {
      let f = u + d - a;
      f *= o === "up" ? -1 : 1, s -= f;
    }
    if (l < h && l > 0 && c < h) {
      let f = h + d - l;
      f *= o === "up" ? -1 : 1, s += f;
    }
    return Xt(t).y + s;
  }, "y")
}), "getLineFunctionsWithOffset"), qB = /* @__PURE__ */ p((e, t, r, i, s, o = !1, a) => {
  t.arrowTypeStart && Td(
    e,
    "start",
    t.arrowTypeStart,
    r,
    i,
    s,
    o,
    a
  ), t.arrowTypeEnd && Td(e, "end", t.arrowTypeEnd, r, i, s, o, a);
}, "addEdgeMarkers"), WB = {
  arrow_cross: { type: "cross", fill: !1 },
  arrow_point: { type: "point", fill: !0 },
  arrow_barb: { type: "barb", fill: !0 },
  arrow_barb_neo: { type: "barb", fill: !0 },
  arrow_circle: { type: "circle", fill: !1 },
  aggregation: { type: "aggregation", fill: !1 },
  extension: { type: "extension", fill: !1 },
  composition: { type: "composition", fill: !0 },
  dependency: { type: "dependency", fill: !0 },
  lollipop: { type: "lollipop", fill: !1 },
  only_one: { type: "onlyOne", fill: !1 },
  zero_or_one: { type: "zeroOrOne", fill: !1 },
  one_or_more: { type: "oneOrMore", fill: !1 },
  zero_or_more: { type: "zeroOrMore", fill: !1 },
  requirement_arrow: { type: "requirement_arrow", fill: !1 },
  requirement_contains: { type: "requirement_contains", fill: !1 }
}, zB = [
  "cross",
  "point",
  "circle",
  "lollipop",
  "aggregation",
  "extension",
  "composition",
  "dependency",
  "barb"
], Td = /* @__PURE__ */ p((e, t, r, i, s, o, a = !1, n) => {
  if (!r || r === "none")
    return;
  const l = WB[r], c = l && zB.includes(l.type);
  if (!l) {
    $.warn(`Unknown arrow type: ${r}`);
    return;
  }
  const h = l.type, f = `${s}_${o}-${h}${t === "start" ? "Start" : "End"}${a && c ? "-margin" : ""}`;
  if (n && n.trim() !== "") {
    const m = n.replace(/[^\dA-Za-z]/g, "_"), y = `${f}_${m}`;
    if (!document.getElementById(y)) {
      const x = document.getElementById(f);
      if (x) {
        const C = x.cloneNode(!0);
        C.id = y, C.querySelectorAll("path, circle, line").forEach((w) => {
          w.setAttribute("stroke", n), l.fill && w.setAttribute("fill", n);
        }), x.parentNode?.appendChild(C);
      }
    }
    e.attr(`marker-${t}`, `url(${i}#${y})`);
  } else
    e.attr(`marker-${t}`, `url(${i}#${f})`);
}, "addEdgeMarker"), HB = /* @__PURE__ */ p((e) => typeof e == "string" ? e : $t()?.flowchart?.curve, "resolveEdgeCurveType"), ss = /* @__PURE__ */ new Map(), Qt = /* @__PURE__ */ new Map(), YB = /* @__PURE__ */ p(() => {
  ss.clear(), Qt.clear();
}, "clear"), vy = /* @__PURE__ */ p((e) => !!(e.label || e.startLabelLeft || e.startLabelRight || e.endLabelLeft || e.endLabelRight), "hasEdgeLabel"), Ls = /* @__PURE__ */ p((e) => e ? typeof e == "string" ? e : e.reduce((t, r) => t + ";" + r, "") : "", "getLabelStyles"), Vh = /* @__PURE__ */ p(async (e, t) => {
  const r = $t();
  let i = ye(r);
  const { labelStyles: s } = ft(t);
  t.labelStyle = s;
  const o = e.insert("g").attr("class", "edgeLabel"), a = o.insert("g").attr("class", "label").attr("data-id", t.id), n = t.labelType === "markdown", c = await Qe(
    e,
    t.label,
    {
      style: Ls(t.labelStyle),
      useHtmlLabels: i,
      addSvgBackground: !0,
      isNode: !1,
      markdown: n,
      // Plain text edge labels should auto-wrap, markdown edge labels respect markdownAutoWrap config
      width: n ? void 0 : void 0
    },
    r
  );
  a.node().appendChild(c), $.info("abc82", t, t.labelType);
  let h, u;
  if (i) {
    const f = c.children[0], m = vt(c);
    h = await pi.measure(() => f.getBoundingClientRect()), u = h, m.attr("width", h.width), m.attr("height", h.height);
  } else {
    const f = vt(c).select("text").node();
    await pi.measure(() => {
      h = c.getBBox(), f && typeof f.getBBox == "function" ? u = f.getBBox() : u = h;
    });
  }
  a.attr("transform", vs(u, i)), ss.set(t.id, o), t.width = h.width, t.height = h.height;
  let d;
  if (t.startLabelLeft) {
    const f = e.insert("g").attr("class", "edgeTerminals"), m = f.insert("g").attr("class", "inner"), y = await Wr(
      m,
      t.startLabelLeft,
      Ls(t.labelStyle) || "",
      !1,
      !1
    );
    d = y;
    let x = y.getBBox();
    if (i) {
      const C = y.children[0], b = vt(y);
      x = C.getBoundingClientRect(), b.attr("width", x.width), b.attr("height", x.height);
    }
    m.attr("transform", vs(x, i)), Qt.get(t.id) || Qt.set(t.id, {}), Qt.get(t.id).startLeft = f, Rs(d, t.startLabelLeft);
  }
  if (t.startLabelRight) {
    const f = e.insert("g").attr("class", "edgeTerminals"), m = f.insert("g").attr("class", "inner"), y = await Wr(
      m,
      t.startLabelRight,
      Ls(t.labelStyle) || "",
      !1,
      !1
    );
    d = y;
    let x = y.getBBox();
    if (i) {
      const C = y.children[0], b = vt(y);
      x = C.getBoundingClientRect(), b.attr("width", x.width), b.attr("height", x.height);
    }
    m.attr("transform", vs(x, i)), Qt.get(t.id) || Qt.set(t.id, {}), Qt.get(t.id).startRight = f, Rs(d, t.startLabelRight);
  }
  if (t.endLabelLeft) {
    const f = e.insert("g").attr("class", "edgeTerminals"), m = f.insert("g").attr("class", "inner"), y = await Wr(
      f,
      t.endLabelLeft,
      Ls(t.labelStyle) || "",
      !1,
      !1
    );
    d = y;
    let x = y.getBBox();
    if (i) {
      const C = y.children[0], b = vt(y);
      x = C.getBoundingClientRect(), b.attr("width", x.width), b.attr("height", x.height);
    }
    m.attr("transform", vs(x, i)), Qt.get(t.id) || Qt.set(t.id, {}), Qt.get(t.id).endLeft = f, Rs(d, t.endLabelLeft);
  }
  if (t.endLabelRight) {
    const f = e.insert("g").attr("class", "edgeTerminals"), m = f.insert("g").attr("class", "inner"), y = await Wr(
      f,
      t.endLabelRight,
      Ls(t.labelStyle) || "",
      !1,
      !1
    );
    d = y;
    let x = y.getBBox();
    if (i) {
      const C = y.children[0], b = vt(y);
      x = C.getBoundingClientRect(), b.attr("width", x.width), b.attr("height", x.height);
    }
    m.attr("transform", vs(x, i)), Qt.get(t.id) || Qt.set(t.id, {}), Qt.get(t.id).endRight = f, Rs(d, t.endLabelRight);
  }
  return c;
}, "insertEdgeLabel");
function Rs(e, t) {
  ye($t()) && e && (e.style.width = t.length * 9 + "px", e.style.height = "12px");
}
p(Rs, "setTerminalWidth");
var UB = /* @__PURE__ */ p((e, t) => {
  $.debug("Moving label abc88 ", e.id, e.label, ss.get(e.id), t);
  let r = t.updatedPath ? t.updatedPath : t.originalPath;
  const i = $t(), { subGraphTitleTotalMargin: s } = Ia(i);
  if (e.label) {
    const o = ss.get(e.id);
    let a = e.x, n = e.y;
    if (r) {
      const l = me.calcLabelPosition(r);
      $.debug(
        "Moving label " + e.label + " from (",
        a,
        ",",
        n,
        ") to (",
        l.x,
        ",",
        l.y,
        ") abc88"
      ), t.updatedPath && (a = l.x, n = l.y);
    }
    o.attr("transform", `translate(${a}, ${n + s / 2})`);
  }
  if (e.startLabelLeft) {
    const o = Qt.get(e.id).startLeft;
    let a = e.x, n = e.y;
    if (r) {
      const l = me.calcTerminalLabelPosition(e.arrowTypeStart ? 10 : 0, "start_left", r);
      a = l.x, n = l.y;
    }
    o.attr("transform", `translate(${a}, ${n})`);
  }
  if (e.startLabelRight) {
    const o = Qt.get(e.id).startRight;
    let a = e.x, n = e.y;
    if (r) {
      const l = me.calcTerminalLabelPosition(
        e.arrowTypeStart ? 10 : 0,
        "start_right",
        r
      );
      a = l.x, n = l.y;
    }
    o.attr("transform", `translate(${a}, ${n})`);
  }
  if (e.endLabelLeft) {
    const o = Qt.get(e.id).endLeft;
    let a = e.x, n = e.y;
    if (r) {
      const l = me.calcTerminalLabelPosition(e.arrowTypeEnd ? 10 : 0, "end_left", r);
      a = l.x, n = l.y;
    }
    o.attr("transform", `translate(${a}, ${n})`);
  }
  if (e.endLabelRight) {
    const o = Qt.get(e.id).endRight;
    let a = e.x, n = e.y;
    if (r) {
      const l = me.calcTerminalLabelPosition(e.arrowTypeEnd ? 10 : 0, "end_right", r);
      a = l.x, n = l.y;
    }
    o.attr("transform", `translate(${a}, ${n})`);
  }
}, "positionEdgeLabel"), XB = /* @__PURE__ */ p((e, t) => {
  if (!e?.isLabelEdge || !e?.id?.endsWith("-to-label") || !Array.isArray(t) || t.length !== 2)
    return t;
  const [r, i] = t, s = Math.abs(i.x - r.x), o = Math.abs(i.y - r.y);
  return s < 1e-3 || o < 1e-3 ? t : o >= s ? [r, { x: r.x, y: i.y }, i] : [r, { x: i.x, y: r.y }, i];
}, "orthogonalizeToLabelClippedPoints"), jB = /* @__PURE__ */ p((e, t) => {
  const r = e.x, i = e.y, s = Math.abs(t.x - r), o = Math.abs(t.y - i), a = e.width / 2, n = e.height / 2;
  return s >= a || o >= n;
}, "outsideNode"), GB = /* @__PURE__ */ p((e, t, r) => {
  $.debug(`intersection calc abc89:
  outsidePoint: ${JSON.stringify(t)}
  insidePoint : ${JSON.stringify(r)}
  node        : x:${e.x} y:${e.y} w:${e.width} h:${e.height}`);
  const i = e.x, s = e.y, o = Math.abs(i - r.x), a = e.width / 2;
  let n = r.x < t.x ? a - o : a + o;
  const l = e.height / 2, c = Math.abs(t.y - r.y), h = Math.abs(t.x - r.x);
  if (Math.abs(s - t.y) * a > Math.abs(i - t.x) * l) {
    let u = r.y < t.y ? t.y - l - s : s - l - t.y;
    n = h * u / c;
    const d = {
      x: r.x < t.x ? r.x + n : r.x - h + n,
      y: r.y < t.y ? r.y + c - u : r.y - c + u
    };
    return n === 0 && (d.x = t.x, d.y = t.y), h === 0 && (d.x = t.x), c === 0 && (d.y = t.y), $.debug(`abc89 top/bottom calc, Q ${c}, q ${u}, R ${h}, r ${n}`, d), d;
  } else {
    r.x < t.x ? n = t.x - a - i : n = i - a - t.x;
    let u = c * n / h, d = r.x < t.x ? r.x + h - n : r.x - h + n, f = r.y < t.y ? r.y + u : r.y - u;
    return $.debug(`sides calc abc89, Q ${c}, q ${u}, R ${h}, r ${n}`, { _x: d, _y: f }), n === 0 && (d = t.x, f = t.y), h === 0 && (d = t.x), c === 0 && (f = t.y), { x: d, y: f };
  }
}, "intersection"), _d = /* @__PURE__ */ p((e, t) => {
  $.warn("abc88 cutPathAtIntersect", e, t);
  let r = [], i = e[0], s = !1;
  return e.forEach((o) => {
    if ($.info("abc88 checking point", o, t), !jB(t, o) && !s) {
      const a = GB(t, i, o);
      $.debug("abc88 inside", o, i, a), $.debug("abc88 intersection", a, t);
      let n = !1;
      r.forEach((l) => {
        n = n || l.x === a.x && l.y === a.y;
      }), r.some((l) => l.x === a.x && l.y === a.y) ? $.warn("abc88 no intersect", a, r) : r.push(a), s = !0;
    } else
      $.warn("abc88 outside", o, i), i = o, s || r.push(o);
  }), $.debug("returning points", r), r;
}, "cutPathAtIntersect");
function Ly(e) {
  const t = [], r = [];
  for (let i = 1; i < e.length - 1; i++) {
    const s = e[i - 1], o = e[i], a = e[i + 1];
    (s.x === o.x && o.y === a.y && Math.abs(o.x - a.x) > 5 && Math.abs(o.y - s.y) > 5 || s.y === o.y && o.x === a.x && Math.abs(o.x - s.x) > 5 && Math.abs(o.y - a.y) > 5) && (t.push(o), r.push(i));
  }
  return { cornerPoints: t, cornerPointPositions: r };
}
p(Ly, "extractCornerPoints");
var Bd = /* @__PURE__ */ p(function(e, t, r) {
  const i = t.x - e.x, s = t.y - e.y, o = Math.sqrt(i * i + s * s), a = r / o;
  return { x: t.x - a * i, y: t.y - a * s };
}, "findAdjacentPoint"), VB = /* @__PURE__ */ p(function(e) {
  const { cornerPointPositions: t } = Ly(e), r = [];
  for (let i = 0; i < e.length; i++)
    if (t.includes(i)) {
      const s = e[i - 1], o = e[i + 1], a = e[i], n = Bd(s, a, 5), l = Bd(o, a, 5), c = l.x - n.x, h = l.y - n.y;
      r.push(n);
      const u = Math.sqrt(2) * 2;
      let d = { x: a.x, y: a.y };
      if (Math.abs(o.x - s.x) > 10 && Math.abs(o.y - s.y) >= 10) {
        $.debug(
          "Corner point fixing",
          Math.abs(o.x - s.x),
          Math.abs(o.y - s.y)
        );
        const f = 5;
        a.x === n.x ? d = {
          x: c < 0 ? n.x - f + u : n.x + f - u,
          y: h < 0 ? n.y - u : n.y + u
        } : d = {
          x: c < 0 ? n.x - u : n.x + u,
          y: h < 0 ? n.y - f + u : n.y + f - u
        };
      } else
        $.debug(
          "Corner point skipping fixing",
          Math.abs(o.x - s.x),
          Math.abs(o.y - s.y)
        );
      r.push(d, l);
    } else
      r.push(e[i]);
  return r;
}, "fixCorners"), KB = /* @__PURE__ */ p((e, t, r) => {
  const i = e - t - r, s = 2, o = 2, a = s + o, n = Math.floor(i / a), l = Number.isFinite(n) ? Math.max(0, n) : 0, c = Array(l).fill(`${s} ${o}`).join(" ");
  return `0 ${t} ${c} ${r}`;
}, "generateDashArray"), Ay = /* @__PURE__ */ p(function(e, t, r, i, s, o, a, n = !1) {
  if (!a)
    throw new Error(
      `insertEdge: missing diagramId for edge "${t.id}" — edge IDs require a diagram prefix for uniqueness`
    );
  const { handDrawnSeed: l, layout: c } = $t();
  let h = t.points, u = !1;
  const d = s;
  var f = o;
  const m = [];
  for (const X in t.cssCompiledStyles)
    rg(X) || m.push(t.cssCompiledStyles[X]);
  if (c === "swimlane") {
    if (f.intersect && d.intersect && Array.isArray(h) && h.length >= 2)
      if (h.length === 2)
        h = [d.intersect(h[0]), f.intersect(h[1])];
      else {
        const X = h.slice(1, -1), gt = X[0], lt = X[X.length - 1], St = 0.5, It = Math.abs(h[h.length - 1].x - lt.x) < St && Math.abs(h[h.length - 1].y - lt.y) < St, _t = d.intersect(gt), Et = It ? lt : f.intersect(lt), Bt = Math.abs(Et.x - lt.x) < St && Math.abs(Et.y - lt.y) < St, Lt = Math.abs(_t.x - gt.x) < St && Math.abs(_t.y - gt.y) < St ? [] : [_t], Nt = Bt ? [] : [Et];
        h = [...Lt, ...X, ...Nt];
      }
    h = XB(t, h);
  } else f.intersect && d.intersect && !n && (h = h.slice(1, t.points.length - 1), h.unshift(d.intersect(h[0])), h.push(f.intersect(h[h.length - 1])));
  const y = btoa(JSON.stringify(h));
  t.toCluster && ($.info("to cluster abc88", r.get(t.toCluster)), h = _d(t.points, r.get(t.toCluster).node), u = !0), t.fromCluster && ($.debug(
    "from cluster abc88",
    r.get(t.fromCluster),
    JSON.stringify(h, null, 2)
  ), h = _d(h.reverse(), r.get(t.fromCluster).node).reverse(), u = !0);
  let x = h.filter((X) => !Number.isNaN(X.y));
  const C = HB(t.curve);
  C !== "rounded" && (x = VB(x));
  let b = Hs;
  switch (C) {
    case "linear":
      b = Hs;
      break;
    case "basis":
      b = _l;
      break;
    case "cardinal":
      b = Wp;
      break;
    case "bumpX":
      b = Dp;
      break;
    case "bumpY":
      b = Rp;
      break;
    case "catmullRom":
      b = Hp;
      break;
    case "monotoneX":
      b = Vp;
      break;
    case "monotoneY":
      b = Kp;
      break;
    case "natural":
      b = Qp;
      break;
    case "step":
      b = Jp;
      break;
    case "stepAfter":
      b = eg;
      break;
    case "stepBefore":
      b = tg;
      break;
    case "rounded":
      b = Hs;
      break;
    default:
      b = _l;
  }
  const { x: w, y: _ } = NB(t), B = uS().x(w).y(_).curve(b);
  let A;
  switch (t.thickness) {
    case "normal":
      A = "edge-thickness-normal";
      break;
    case "thick":
      A = "edge-thickness-thick";
      break;
    case "invisible":
      A = "edge-thickness-invisible";
      break;
    default:
      A = "edge-thickness-normal";
  }
  switch (t.pattern) {
    case "solid":
      A += " edge-pattern-solid";
      break;
    case "dotted":
      A += " edge-pattern-dotted";
      break;
    case "dashed":
      A += " edge-pattern-dashed";
      break;
    default:
      A += " edge-pattern-solid";
  }
  let v, L = C === "rounded" ? Ey(Fy(x, t), 5) : B(x);
  const W = Array.isArray(t.style) ? t.style : [t.style];
  let H = W.find((X) => X?.startsWith("stroke:")), D = "";
  t.animate && (D = "edge-animation-fast"), t.animation && (D = "edge-animation-" + t.animation);
  let st = !1;
  if (t.look === "handDrawn") {
    const X = ct.svg(e);
    Object.assign([], x);
    const gt = X.path(L, {
      roughness: 0.3,
      seed: l
    });
    A += " transition", v = vt(gt).select("path").attr("id", `${a}-${t.id}`).attr(
      "class",
      " " + A + (t.classes ? " " + t.classes : "") + (D ? " " + D : "")
    ).attr("style", W ? W.reduce((St, It) => St + ";" + It, "") : "");
    let lt = v.attr("d");
    v.attr("d", lt), e.node().appendChild(v.node());
  } else {
    const X = m.join(";"), gt = W ? W.reduce((Bt, ot) => Bt + ot + ";", "") : "", lt = (X ? X + ";" + gt + ";" : gt) + ";" + (W ? W.reduce((Bt, ot) => Bt + ";" + ot, "") : "");
    v = e.append("path").attr("d", L).attr("id", `${a}-${t.id}`).attr(
      "class",
      " " + A + (t.classes ? " " + t.classes : "") + (D ? " " + D : "")
    ).attr("style", lt), H = lt.match(/stroke:([^;]+)/)?.[1], st = t.animate === !0 || !!t.animation || X.includes("animation");
    const St = v.node(), It = typeof St.getTotalLength == "function" ? St.getTotalLength() : 0, _t = Sd[t.arrowTypeStart] || 0, Et = Sd[t.arrowTypeEnd] || 0;
    if (t.look === "neo" && !st) {
      const ot = `stroke-dasharray: ${t.pattern === "dotted" || t.pattern === "dashed" ? KB(It, _t, Et) : `0 ${_t} ${It - _t - Et} ${Et}`}; stroke-dashoffset: 0;`;
      v.attr("style", ot + v.attr("style"));
    }
  }
  v.attr("data-edge", !0), v.attr("data-et", "edge"), v.attr("data-id", t.id), v.attr("data-points", y), v.attr("data-look", re(t.look)), t.showPoints && x.forEach((X) => {
    e.append("circle").style("stroke", "red").style("fill", "red").attr("r", 1).attr("cx", X.x).attr("cy", X.y);
  });
  let Y = "";
  ($t().flowchart.arrowMarkerAbsolute || $t().state.arrowMarkerAbsolute) && (Y = window.location.protocol + "//" + window.location.host + window.location.pathname + window.location.search, Y = Y.replace(/\(/g, "\\(").replace(/\)/g, "\\)")), $.info("arrowTypeStart", t.arrowTypeStart), $.info("arrowTypeEnd", t.arrowTypeEnd);
  const U = !st && t?.look === "neo";
  qB(v, t, Y, a, i, U, H);
  const Q = Math.floor(h.length / 2), I = h[Q];
  me.isLabelCoordinateInPath(I, v.attr("d")) || (u = !0);
  let N = {};
  return u && (N.updatedPath = h), N.originalPath = t.points, N;
}, "insertEdge");
function Ey(e, t) {
  if (e.length < 2)
    return "";
  let r = "";
  const i = e.length, s = 1e-5;
  for (let o = 0; o < i; o++) {
    const a = e[o], n = e[o - 1], l = e[o + 1];
    if (o === 0)
      r += `M${a.x},${a.y}`;
    else if (o === i - 1)
      r += `L${a.x},${a.y}`;
    else {
      const c = a.x - n.x, h = a.y - n.y, u = l.x - a.x, d = l.y - a.y, f = Math.hypot(c, h), m = Math.hypot(u, d);
      if (f < s || m < s) {
        r += `L${a.x},${a.y}`;
        continue;
      }
      const y = c / f, x = h / f, C = u / m, b = d / m, w = y * C + x * b, _ = Math.max(-1, Math.min(1, w)), B = Math.acos(_);
      if (B < s || Math.abs(Math.PI - B) < s) {
        r += `L${a.x},${a.y}`;
        continue;
      }
      const A = Math.min(t / Math.sin(B / 2), f / 2, m / 2), v = a.x - y * A, L = a.y - x * A, W = a.x + C * A, H = a.y + b * A;
      r += `L${v},${L}`, r += `Q${a.x},${a.y} ${W},${H}`;
    }
  }
  return r;
}
p(Ey, "generateRoundedPath");
function Wl(e, t) {
  if (!e || !t)
    return { angle: 0, deltaX: 0, deltaY: 0 };
  const r = t.x - e.x, i = t.y - e.y;
  return { angle: Math.atan2(i, r), deltaX: r, deltaY: i };
}
p(Wl, "calculateDeltaAndAngle");
function Fy(e, t) {
  const r = e.map((s) => ({ ...s }));
  if (e.length >= 2 && ge[t.arrowTypeStart]) {
    const s = ge[t.arrowTypeStart], o = e[0], a = e[1], { angle: n } = Wl(o, a), l = s * Math.cos(n), c = s * Math.sin(n);
    r[0].x = o.x + l, r[0].y = o.y + c;
  }
  const i = e.length;
  if (i >= 2 && ge[t.arrowTypeEnd]) {
    const s = ge[t.arrowTypeEnd], o = e[i - 1], a = e[i - 2], { angle: n } = Wl(a, o), l = s * Math.cos(n), c = s * Math.sin(n);
    r[i - 1].x = o.x - l, r[i - 1].y = o.y - c;
  }
  return r;
}
p(Fy, "applyMarkerOffsetsToPoints");
var ZB = /* @__PURE__ */ p((e, t, r, i) => {
  t.forEach((s) => {
    bv[s](e, r, i);
  });
}, "insertMarkers"), QB = /* @__PURE__ */ p((e, t, r) => {
  $.trace("Making markers for ", r), e.append("defs").append("marker").attr("id", r + "_" + t + "-extensionStart").attr("class", "marker extension " + t).attr("refX", 18).attr("refY", 7).attr("markerWidth", 20).attr("markerHeight", 28).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("path").attr("d", "M 1,7 L18,13 V 1 Z"), e.append("defs").append("marker").attr("id", r + "_" + t + "-extensionEnd").attr("class", "marker extension " + t).attr("refX", 1).attr("refY", 7).attr("markerWidth", 20).attr("markerHeight", 28).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("path").attr("d", "M 1,1 V 13 L18,7 Z"), e.append("marker").attr("id", r + "_" + t + "-extensionStart-margin").attr("class", "marker extension " + t).attr("refX", 18).attr("refY", 7).attr("markerWidth", 20).attr("markerHeight", 28).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").attr("viewBox", "0 0 20 14").append("polygon").attr("points", "10,7 18,13 18,1").style("stroke-width", 2).style("stroke-dasharray", "0"), e.append("defs").append("marker").attr("id", r + "_" + t + "-extensionEnd-margin").attr("class", "marker extension " + t).attr("refX", 9).attr("refY", 7).attr("markerWidth", 20).attr("markerHeight", 28).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").attr("viewBox", "0 0 20 14").append("polygon").attr("points", "10,1 10,13 18,7").style("stroke-width", 2).style("stroke-dasharray", "0");
}, "extension"), JB = /* @__PURE__ */ p((e, t, r) => {
  e.append("defs").append("marker").attr("id", r + "_" + t + "-compositionStart").attr("class", "marker composition " + t).attr("refX", 18).attr("refY", 7).attr("markerWidth", 190).attr("markerHeight", 240).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("path").attr("d", "M 18,7 L9,13 L1,7 L9,1 Z"), e.append("defs").append("marker").attr("id", r + "_" + t + "-compositionEnd").attr("class", "marker composition " + t).attr("refX", 1).attr("refY", 7).attr("markerWidth", 20).attr("markerHeight", 28).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("path").attr("d", "M 18,7 L9,13 L1,7 L9,1 Z"), e.append("defs").append("marker").attr("id", r + "_" + t + "-compositionStart-margin").attr("class", "marker composition " + t).attr("refX", 15).attr("refY", 7).attr("markerWidth", 190).attr("markerHeight", 240).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("path").style("stroke-width", 0).attr("viewBox", "0 0 15 15").attr("d", "M 18,7 L9,13 L1,7 L9,1 Z"), e.append("defs").append("marker").attr("id", r + "_" + t + "-compositionEnd-margin").attr("class", "marker composition " + t).attr("refX", 3.5).attr("refY", 7).attr("markerWidth", 20).attr("markerHeight", 28).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("path").style("stroke-width", 0).attr("d", "M 18,7 L9,13 L1,7 L9,1 Z");
}, "composition"), tv = /* @__PURE__ */ p((e, t, r) => {
  e.append("defs").append("marker").attr("id", r + "_" + t + "-aggregationStart").attr("class", "marker aggregation " + t).attr("refX", 18).attr("refY", 7).attr("markerWidth", 190).attr("markerHeight", 240).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("path").attr("d", "M 18,7 L9,13 L1,7 L9,1 Z"), e.append("defs").append("marker").attr("id", r + "_" + t + "-aggregationEnd").attr("class", "marker aggregation " + t).attr("refX", 1).attr("refY", 7).attr("markerWidth", 20).attr("markerHeight", 28).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("path").attr("d", "M 18,7 L9,13 L1,7 L9,1 Z"), e.append("defs").append("marker").attr("id", r + "_" + t + "-aggregationStart-margin").attr("class", "marker aggregation " + t).attr("refX", 15).attr("refY", 7).attr("markerWidth", 190).attr("markerHeight", 240).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("path").style("stroke-width", 2).attr("d", "M 18,7 L9,13 L1,7 L9,1 Z"), e.append("defs").append("marker").attr("id", r + "_" + t + "-aggregationEnd-margin").attr("class", "marker aggregation " + t).attr("refX", 1).attr("refY", 7).attr("markerWidth", 20).attr("markerHeight", 28).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("path").style("stroke-width", 2).attr("d", "M 18,7 L9,13 L1,7 L9,1 Z");
}, "aggregation"), ev = /* @__PURE__ */ p((e, t, r) => {
  e.append("defs").append("marker").attr("id", r + "_" + t + "-dependencyStart").attr("class", "marker dependency " + t).attr("refX", 6).attr("refY", 7).attr("markerWidth", 190).attr("markerHeight", 240).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("path").attr("d", "M 5,7 L9,13 L1,7 L9,1 Z"), e.append("defs").append("marker").attr("id", r + "_" + t + "-dependencyEnd").attr("class", "marker dependency " + t).attr("refX", 13).attr("refY", 7).attr("markerWidth", 20).attr("markerHeight", 28).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("path").attr("d", "M 18,7 L9,13 L14,7 L9,1 Z"), e.append("defs").append("marker").attr("id", r + "_" + t + "-dependencyStart-margin").attr("class", "marker dependency " + t).attr("refX", 4).attr("refY", 7).attr("markerWidth", 190).attr("markerHeight", 240).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("path").style("stroke-width", 0).attr("d", "M 5,7 L9,13 L1,7 L9,1 Z"), e.append("defs").append("marker").attr("id", r + "_" + t + "-dependencyEnd-margin").attr("class", "marker dependency " + t).attr("refX", 16).attr("refY", 7).attr("markerWidth", 20).attr("markerHeight", 28).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("path").style("stroke-width", 0).attr("d", "M 18,7 L9,13 L14,7 L9,1 Z");
}, "dependency"), rv = /* @__PURE__ */ p((e, t, r) => {
  e.append("defs").append("marker").attr("id", r + "_" + t + "-lollipopStart").attr("class", "marker lollipop " + t).attr("refX", 13).attr("refY", 7).attr("markerWidth", 190).attr("markerHeight", 240).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("circle").attr("fill", "transparent").attr("cx", 7).attr("cy", 7).attr("r", 6), e.append("defs").append("marker").attr("id", r + "_" + t + "-lollipopEnd").attr("class", "marker lollipop " + t).attr("refX", 1).attr("refY", 7).attr("markerWidth", 190).attr("markerHeight", 240).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("circle").attr("fill", "transparent").attr("cx", 7).attr("cy", 7).attr("r", 6), e.append("defs").append("marker").attr("id", r + "_" + t + "-lollipopStart-margin").attr("class", "marker lollipop " + t).attr("refX", 13).attr("refY", 7).attr("markerWidth", 190).attr("markerHeight", 240).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("circle").attr("fill", "transparent").attr("cx", 7).attr("cy", 7).attr("r", 6).attr("stroke-width", 2), e.append("defs").append("marker").attr("id", r + "_" + t + "-lollipopEnd-margin").attr("class", "marker lollipop " + t).attr("refX", 1).attr("refY", 7).attr("markerWidth", 190).attr("markerHeight", 240).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("circle").attr("fill", "transparent").attr("cx", 7).attr("cy", 7).attr("r", 6).attr("stroke-width", 2);
}, "lollipop"), iv = /* @__PURE__ */ p((e, t, r) => {
  e.append("marker").attr("id", r + "_" + t + "-pointEnd").attr("class", "marker " + t).attr("viewBox", "0 0 10 10").attr("refX", 5).attr("refY", 5).attr("markerUnits", "userSpaceOnUse").attr("markerWidth", 8).attr("markerHeight", 8).attr("orient", "auto").append("path").attr("d", "M 0 0 L 10 5 L 0 10 z").attr("class", "arrowMarkerPath").style("stroke-width", 1).style("stroke-dasharray", "1,0"), e.append("marker").attr("id", r + "_" + t + "-pointStart").attr("class", "marker " + t).attr("viewBox", "0 0 10 10").attr("refX", 4.5).attr("refY", 5).attr("markerUnits", "userSpaceOnUse").attr("markerWidth", 8).attr("markerHeight", 8).attr("orient", "auto").append("path").attr("d", "M 0 5 L 10 10 L 10 0 z").attr("class", "arrowMarkerPath").style("stroke-width", 1).style("stroke-dasharray", "1,0"), e.append("marker").attr("id", r + "_" + t + "-pointEnd-margin").attr("class", "marker " + t).attr("viewBox", "0 0 11.5 14").attr("refX", 11.5).attr("refY", 7).attr("markerUnits", "userSpaceOnUse").attr("markerWidth", 10.5).attr("markerHeight", 14).attr("orient", "auto").append("path").attr("d", "M 0 0 L 11.5 7 L 0 14 z").attr("class", "arrowMarkerPath").style("stroke-width", 0).style("stroke-dasharray", "1,0"), e.append("marker").attr("id", r + "_" + t + "-pointStart-margin").attr("class", "marker " + t).attr("viewBox", "0 0 11.5 14").attr("refX", 1).attr("refY", 7).attr("markerUnits", "userSpaceOnUse").attr("markerWidth", 11.5).attr("markerHeight", 14).attr("orient", "auto").append("polygon").attr("points", "0,7 11.5,14 11.5,0").attr("class", "arrowMarkerPath").style("stroke-width", 0).style("stroke-dasharray", "1,0");
}, "point"), sv = /* @__PURE__ */ p((e, t, r) => {
  e.append("marker").attr("id", r + "_" + t + "-circleEnd").attr("class", "marker " + t).attr("viewBox", "0 0 10 10").attr("refX", 11).attr("refY", 5).attr("markerUnits", "userSpaceOnUse").attr("markerWidth", 11).attr("markerHeight", 11).attr("orient", "auto").append("circle").attr("cx", "5").attr("cy", "5").attr("r", "5").attr("class", "arrowMarkerPath").style("stroke-width", 1).style("stroke-dasharray", "1,0"), e.append("marker").attr("id", r + "_" + t + "-circleStart").attr("class", "marker " + t).attr("viewBox", "0 0 10 10").attr("refX", -1).attr("refY", 5).attr("markerUnits", "userSpaceOnUse").attr("markerWidth", 11).attr("markerHeight", 11).attr("orient", "auto").append("circle").attr("cx", "5").attr("cy", "5").attr("r", "5").attr("class", "arrowMarkerPath").style("stroke-width", 1).style("stroke-dasharray", "1,0"), e.append("marker").attr("id", r + "_" + t + "-circleEnd-margin").attr("class", "marker " + t).attr("viewBox", "0 0 10 10").attr("refY", 5).attr("refX", 12.25).attr("markerUnits", "userSpaceOnUse").attr("markerWidth", 14).attr("markerHeight", 14).attr("orient", "auto").append("circle").attr("cx", "5").attr("cy", "5").attr("r", "5").attr("class", "arrowMarkerPath").style("stroke-width", 0).style("stroke-dasharray", "1,0"), e.append("marker").attr("id", r + "_" + t + "-circleStart-margin").attr("class", "marker " + t).attr("viewBox", "0 0 10 10").attr("refX", -2).attr("refY", 5).attr("markerUnits", "userSpaceOnUse").attr("markerWidth", 14).attr("markerHeight", 14).attr("orient", "auto").append("circle").attr("cx", "5").attr("cy", "5").attr("r", "5").attr("class", "arrowMarkerPath").style("stroke-width", 0).style("stroke-dasharray", "1,0");
}, "circle"), ov = /* @__PURE__ */ p((e, t, r) => {
  e.append("marker").attr("id", r + "_" + t + "-crossEnd").attr("class", "marker cross " + t).attr("viewBox", "0 0 11 11").attr("refX", 12).attr("refY", 5.2).attr("markerUnits", "userSpaceOnUse").attr("markerWidth", 11).attr("markerHeight", 11).attr("orient", "auto").append("path").attr("d", "M 1,1 l 9,9 M 10,1 l -9,9").attr("class", "arrowMarkerPath").style("stroke-width", 2).style("stroke-dasharray", "1,0"), e.append("marker").attr("id", r + "_" + t + "-crossStart").attr("class", "marker cross " + t).attr("viewBox", "0 0 11 11").attr("refX", -1).attr("refY", 5.2).attr("markerUnits", "userSpaceOnUse").attr("markerWidth", 11).attr("markerHeight", 11).attr("orient", "auto").append("path").attr("d", "M 1,1 l 9,9 M 10,1 l -9,9").attr("class", "arrowMarkerPath").style("stroke-width", 2).style("stroke-dasharray", "1,0"), e.append("marker").attr("id", r + "_" + t + "-crossEnd-margin").attr("class", "marker cross " + t).attr("viewBox", "0 0 15 15").attr("refX", 17.7).attr("refY", 7.5).attr("markerUnits", "userSpaceOnUse").attr("markerWidth", 12).attr("markerHeight", 12).attr("orient", "auto").append("path").attr("d", "M 1,1 L 14,14 M 1,14 L 14,1").attr("class", "arrowMarkerPath").style("stroke-width", 2.5), e.append("marker").attr("id", r + "_" + t + "-crossStart-margin").attr("class", "marker cross " + t).attr("viewBox", "0 0 15 15").attr("refX", -3.5).attr("refY", 7.5).attr("markerUnits", "userSpaceOnUse").attr("markerWidth", 12).attr("markerHeight", 12).attr("orient", "auto").append("path").attr("d", "M 1,1 L 14,14 M 1,14 L 14,1").attr("class", "arrowMarkerPath").style("stroke-width", 2.5).style("stroke-dasharray", "1,0");
}, "cross"), av = /* @__PURE__ */ p((e, t, r) => {
  e.append("defs").append("marker").attr("id", r + "_" + t + "-barbEnd").attr("refX", 19).attr("refY", 7).attr("markerWidth", 20).attr("markerHeight", 14).attr("markerUnits", "userSpaceOnUse").attr("orient", "auto").append("path").attr("d", "M 19,7 L9,13 L14,7 L9,1 Z");
}, "barb"), nv = /* @__PURE__ */ p((e, t, r) => {
  const i = jt(), { themeVariables: s } = i, { transitionColor: o } = s;
  e.append("defs").append("marker").attr("id", r + "_" + t + "-barbEnd").attr("refX", 19).attr("refY", 7).attr("markerWidth", 20).attr("markerHeight", 14).attr("markerUnits", "strokeWidth").attr("orient", "auto").append("path").attr("d", "M 19,7 L11,14 L13,7 L11,0 Z"), e.append("defs").append("marker").attr("id", r + "_" + t + "-barbEnd-margin").attr("refX", 17).attr("refY", 7).attr("markerWidth", 20).attr("markerHeight", 14).attr("markerUnits", "userSpaceOnUse").attr("orient", "auto").append("path").attr("d", "M 19,7 L11,14 L13,7 L11,0 Z").attr("fill", `${o}`);
}, "barbNeo"), lv = /* @__PURE__ */ p((e, t, r) => {
  e.append("defs").append("marker").attr("id", r + "_" + t + "-onlyOneStart").attr("class", "marker onlyOne " + t).attr("refX", 0).attr("refY", 9).attr("markerWidth", 18).attr("markerHeight", 18).attr("orient", "auto").append("path").attr("d", "M9,0 L9,18 M15,0 L15,18"), e.append("defs").append("marker").attr("id", r + "_" + t + "-onlyOneEnd").attr("class", "marker onlyOne " + t).attr("refX", 18).attr("refY", 9).attr("markerWidth", 18).attr("markerHeight", 18).attr("orient", "auto").append("path").attr("d", "M3,0 L3,18 M9,0 L9,18");
}, "only_one"), hv = /* @__PURE__ */ p((e, t, r) => {
  const i = e.append("defs").append("marker").attr("id", r + "_" + t + "-zeroOrOneStart").attr("class", "marker zeroOrOne " + t).attr("refX", 0).attr("refY", 9).attr("markerWidth", 30).attr("markerHeight", 18).attr("orient", "auto");
  i.append("circle").attr("fill", "white").attr("cx", 21).attr("cy", 9).attr("r", 6), i.append("path").attr("d", "M9,0 L9,18");
  const s = e.append("defs").append("marker").attr("id", r + "_" + t + "-zeroOrOneEnd").attr("class", "marker zeroOrOne " + t).attr("refX", 30).attr("refY", 9).attr("markerWidth", 30).attr("markerHeight", 18).attr("orient", "auto");
  s.append("circle").attr("fill", "white").attr("cx", 9).attr("cy", 9).attr("r", 6), s.append("path").attr("d", "M21,0 L21,18");
}, "zero_or_one"), cv = /* @__PURE__ */ p((e, t, r) => {
  e.append("defs").append("marker").attr("id", r + "_" + t + "-oneOrMoreStart").attr("class", "marker oneOrMore " + t).attr("refX", 18).attr("refY", 18).attr("markerWidth", 45).attr("markerHeight", 36).attr("orient", "auto").append("path").attr("d", "M0,18 Q 18,0 36,18 Q 18,36 0,18 M42,9 L42,27"), e.append("defs").append("marker").attr("id", r + "_" + t + "-oneOrMoreEnd").attr("class", "marker oneOrMore " + t).attr("refX", 27).attr("refY", 18).attr("markerWidth", 45).attr("markerHeight", 36).attr("orient", "auto").append("path").attr("d", "M3,9 L3,27 M9,18 Q27,0 45,18 Q27,36 9,18");
}, "one_or_more"), uv = /* @__PURE__ */ p((e, t, r) => {
  const i = e.append("defs").append("marker").attr("id", r + "_" + t + "-zeroOrMoreStart").attr("class", "marker zeroOrMore " + t).attr("refX", 18).attr("refY", 18).attr("markerWidth", 57).attr("markerHeight", 36).attr("orient", "auto");
  i.append("circle").attr("fill", "white").attr("cx", 48).attr("cy", 18).attr("r", 6), i.append("path").attr("d", "M0,18 Q18,0 36,18 Q18,36 0,18");
  const s = e.append("defs").append("marker").attr("id", r + "_" + t + "-zeroOrMoreEnd").attr("class", "marker zeroOrMore " + t).attr("refX", 39).attr("refY", 18).attr("markerWidth", 57).attr("markerHeight", 36).attr("orient", "auto");
  s.append("circle").attr("fill", "white").attr("cx", 9).attr("cy", 18).attr("r", 6), s.append("path").attr("d", "M21,18 Q39,0 57,18 Q39,36 21,18");
}, "zero_or_more"), dv = /* @__PURE__ */ p((e, t, r) => {
  const i = jt(), { themeVariables: s } = i, { strokeWidth: o } = s;
  e.append("defs").append("marker").attr("id", r + "_" + t + "-onlyOneStart").attr("class", "marker onlyOne " + t).attr("refX", 0).attr("refY", 9).attr("markerWidth", 18).attr("markerHeight", 18).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("path").attr("d", "M9,0 L9,18 M15,0 L15,18").attr("stroke-width", `${o}`), e.append("defs").append("marker").attr("id", r + "_" + t + "-onlyOneEnd").attr("class", "marker onlyOne " + t).attr("refX", 18).attr("refY", 9).attr("markerWidth", 18).attr("markerHeight", 18).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("path").attr("d", "M3,0 L3,18 M9,0 L9,18").attr("stroke-width", `${o}`);
}, "only_one_neo"), fv = /* @__PURE__ */ p((e, t, r) => {
  const i = jt(), { themeVariables: s } = i, { strokeWidth: o, mainBkg: a } = s, n = e.append("defs").append("marker").attr("id", r + "_" + t + "-zeroOrOneStart").attr("class", "marker zeroOrOne " + t).attr("refX", 0).attr("refY", 9).attr("markerWidth", 30).attr("markerHeight", 18).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse");
  n.append("circle").attr("fill", a ?? "white").attr("cx", 21).attr("cy", 9).attr("stroke-width", `${o}`).attr("r", 6), n.append("path").attr("d", "M9,0 L9,18").attr("stroke-width", `${o}`);
  const l = e.append("defs").append("marker").attr("id", r + "_" + t + "-zeroOrOneEnd").attr("class", "marker zeroOrOne " + t).attr("refX", 30).attr("refY", 9).attr("markerWidth", 30).attr("markerHeight", 18).attr("markerUnits", "userSpaceOnUse").attr("orient", "auto");
  l.append("circle").attr("fill", a ?? "white").attr("cx", 9).attr("cy", 9).attr("stroke-width", `${o}`).attr("r", 6), l.append("path").attr("d", "M21,0 L21,18").attr("stroke-width", `${o}`);
}, "zero_or_one_neo"), pv = /* @__PURE__ */ p((e, t, r) => {
  const i = jt(), { themeVariables: s } = i, { strokeWidth: o } = s;
  e.append("defs").append("marker").attr("id", r + "_" + t + "-oneOrMoreStart").attr("class", "marker oneOrMore " + t).attr("refX", 18).attr("refY", 18).attr("markerWidth", 45).attr("markerHeight", 36).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("path").attr("d", "M0,18 Q 18,0 36,18 Q 18,36 0,18 M42,9 L42,27").attr("stroke-width", `${o}`), e.append("defs").append("marker").attr("id", r + "_" + t + "-oneOrMoreEnd").attr("class", "marker oneOrMore " + t).attr("refX", 27).attr("refY", 18).attr("markerWidth", 45).attr("markerHeight", 36).attr("markerUnits", "userSpaceOnUse").attr("orient", "auto").append("path").attr("d", "M3,9 L3,27 M9,18 Q27,0 45,18 Q27,36 9,18").attr("stroke-width", `${o}`);
}, "one_or_more_neo"), gv = /* @__PURE__ */ p((e, t, r) => {
  const i = jt(), { themeVariables: s } = i, { strokeWidth: o, mainBkg: a } = s, n = e.append("defs").append("marker").attr("id", r + "_" + t + "-zeroOrMoreStart").attr("class", "marker zeroOrMore " + t).attr("refX", 18).attr("refY", 18).attr("markerWidth", 57).attr("markerHeight", 36).attr("markerUnits", "userSpaceOnUse").attr("orient", "auto");
  n.append("circle").attr("fill", a ?? "white").attr("cx", 45.5).attr("cy", 18).attr("r", 6).attr("stroke-width", `${o}`), n.append("path").attr("d", "M0,18 Q18,0 36,18 Q18,36 0,18").attr("stroke-width", `${o}`);
  const l = e.append("defs").append("marker").attr("id", r + "_" + t + "-zeroOrMoreEnd").attr("class", "marker zeroOrMore " + t).attr("refX", 39).attr("refY", 18).attr("markerWidth", 57).attr("markerHeight", 36).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse");
  l.append("circle").attr("fill", a ?? "white").attr("cx", 11).attr("cy", 18).attr("r", 6).attr("stroke-width", `${o}`), l.append("path").attr("d", "M21,18 Q39,0 57,18 Q39,36 21,18").attr("stroke-width", `${o}`);
}, "zero_or_more_neo"), mv = /* @__PURE__ */ p((e, t, r) => {
  e.append("defs").append("marker").attr("id", r + "_" + t + "-requirement_arrowEnd").attr("refX", 20).attr("refY", 10).attr("markerWidth", 20).attr("markerHeight", 20).attr("orient", "auto").append("path").attr(
    "d",
    `M0,0
      L20,10
      M20,10
      L0,20`
  );
}, "requirement_arrow"), yv = /* @__PURE__ */ p((e, t, r) => {
  const i = jt(), { themeVariables: s } = i, { strokeWidth: o } = s;
  e.append("defs").append("marker").attr("id", r + "_" + t + "-requirement_arrowEnd").attr("refX", 20).attr("refY", 10).attr("markerWidth", 20).attr("markerHeight", 20).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").attr("stroke-width", `${o}`).attr("viewBox", "0 0 25 20").append("path").attr(
    "d",
    `M0,0
      L20,10
      M20,10
      L0,20`
  ).attr("stroke-linejoin", "miter");
}, "requirement_arrow_neo"), xv = /* @__PURE__ */ p((e, t, r) => {
  const i = e.append("defs").append("marker").attr("id", r + "_" + t + "-requirement_containsStart").attr("refX", 0).attr("refY", 10).attr("markerWidth", 20).attr("markerHeight", 20).attr("orient", "auto").append("g");
  i.append("circle").attr("cx", 10).attr("cy", 10).attr("r", 9).attr("fill", "none"), i.append("line").attr("x1", 1).attr("x2", 19).attr("y1", 10).attr("y2", 10), i.append("line").attr("y1", 1).attr("y2", 19).attr("x1", 10).attr("x2", 10);
}, "requirement_contains"), Cv = /* @__PURE__ */ p((e, t, r) => {
  const i = jt(), { themeVariables: s } = i, { strokeWidth: o } = s, a = e.append("defs").append("marker").attr("id", r + "_" + t + "-requirement_containsStart").attr("refX", 0).attr("refY", 10).attr("markerWidth", 20).attr("markerHeight", 20).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("g");
  a.append("circle").attr("cx", 10).attr("cy", 10).attr("r", 9).attr("fill", "none"), a.append("line").attr("x1", 1).attr("x2", 19).attr("y1", 10).attr("y2", 10), a.append("line").attr("y1", 1).attr("y2", 19).attr("x1", 10).attr("x2", 10), a.selectAll("*").attr("stroke-width", `${o}`);
}, "requirement_contains_neo"), bv = {
  extension: QB,
  composition: JB,
  aggregation: tv,
  dependency: ev,
  lollipop: rv,
  point: iv,
  circle: sv,
  cross: ov,
  barb: av,
  barbNeo: nv,
  only_one: lv,
  zero_or_one: hv,
  one_or_more: cv,
  zero_or_more: uv,
  only_one_neo: dv,
  zero_or_one_neo: fv,
  one_or_more_neo: pv,
  zero_or_more_neo: gv,
  requirement_arrow: mv,
  requirement_contains: xv,
  requirement_arrow_neo: yv,
  requirement_contains_neo: Cv
}, My = ZB, kv = "\0", Zr = "\0", vd = "";
class Ra {
  /**
   * @param {GraphOptions} [opts] - Graph options.
   */
  constructor(t = {}) {
    this._isDirected = Object.prototype.hasOwnProperty.call(t, "directed") ? t.directed : !0, this._isMultigraph = Object.prototype.hasOwnProperty.call(t, "multigraph") ? t.multigraph : !1, this._isCompound = Object.prototype.hasOwnProperty.call(t, "compound") ? t.compound : !1, this._label = void 0, this._defaultNodeLabelFn = xo(void 0), this._defaultEdgeLabelFn = xo(void 0), this._nodes = {}, this._isCompound && (this._parent = {}, this._children = {}, this._children[Zr] = {}), this._in = {}, this._preds = {}, this._out = {}, this._sucs = {}, this._edgeObjs = {}, this._edgeLabels = {};
  }
  /* === Graph functions ========= */
  /**
   *
   * @returns {boolean} `true` if the graph is [directed](https://en.wikipedia.org/wiki/Directed_graph).
   * A directed graph treats the order of nodes in an edge as significant whereas an
   * [undirected](https://en.wikipedia.org/wiki/Graph_(mathematics)#Undirected_graph)
   * graph does not.
   * This example demonstrates the difference:
   *
   * @example
   *
   * ```js
   * var directed = new Graph({ directed: true });
   * directed.setEdge("a", "b", "my-label");
   * directed.edge("a", "b"); // returns "my-label"
   * directed.edge("b", "a"); // returns undefined
   *
   * var undirected = new Graph({ directed: false });
   * undirected.setEdge("a", "b", "my-label");
   * undirected.edge("a", "b"); // returns "my-label"
   * undirected.edge("b", "a"); // returns "my-label"
   * ```
   */
  isDirected() {
    return this._isDirected;
  }
  /**
   * @returns {boolean} `true` if the graph is a multigraph.
   */
  isMultigraph() {
    return this._isMultigraph;
  }
  /**
   * @returns {boolean} `true` if the graph is compound.
   */
  isCompound() {
    return this._isCompound;
  }
  /**
   * Sets the label for the graph to `label`.
   *
   * @param {GraphLabel} label - Label for the graph.
   * @returns {this}
   */
  setGraph(t) {
    return this._label = t, this;
  }
  /**
   * @returns {GraphLabel | undefined} the currently assigned label for the graph.
   * If no label has been assigned, returns `undefined`.
   *
   * @example
   *
   * ```js
   * var g = new Graph();
   * g.graph(); // returns undefined
   * g.setGraph("graph-label");
   *  g.graph(); // returns "graph-label"
   * ```
   */
  graph() {
    return this._label;
  }
  /* === Node functions ========== */
  /**
   * Sets a new default value that is assigned to nodes that are created without
   * a label.
   *
   * @param {typeof this._defaultNodeLabelFn | NodeLabel} newDefault - If a function,
   * it is called with the id of the node being created.
   * Otherwise, it is assigned as the label directly.
   * @returns {this}
   */
  setDefaultNodeLabel(t) {
    return qc(t) || (t = xo(t)), this._defaultNodeLabelFn = t, this;
  }
  /**
   * @returns {number} the number of nodes in the graph.
   */
  nodeCount() {
    return this._nodeCount;
  }
  /**
   * @returns {NodeID[]} the ids of the nodes in the graph.
   *
   * @remarks
   * Use {@link node()} to get the label for each node.
   * Takes `O(|V|)` time.
   */
  nodes() {
    return Qr(this._nodes);
  }
  /**
   * @returns {NodeID[]} those nodes in the graph that have no in-edges.
   * @remarks Takes `O(|V|)` time.
   */
  sources() {
    var t = this;
    return Co(this.nodes(), function(r) {
      return Wc(t._in[r]);
    });
  }
  /**
   * @returns {NodeID[]} those nodes in the graph that have no out-edges.
   * @remarks Takes `O(|V|)` time.
   */
  sinks() {
    var t = this;
    return Co(this.nodes(), function(r) {
      return Wc(t._out[r]);
    });
  }
  /**
   * Invokes setNode method for each node in `vs` list.
   *
   * @param {Collection<NodeID | number>} vs - List of node IDs to create/set.
   * @param {NodeLabel} [value] - If set, update all nodes with this value.
   * @returns {this}
   * @remarks Complexity: O(|names|).
   */
  setNodes(t, r) {
    var i = arguments, s = this;
    return Gr(t, function(o) {
      i.length > 1 ? s.setNode(o, r) : s.setNode(o);
    }), this;
  }
  /**
   * Creates or updates the value for the node `v` in the graph.
   *
   * @param {NodeID | number} v - ID of the node to create/set.
   * @param {NodeLabel} [value] - If supplied, it is set as the value for the node.
   * If not supplied and the node was created by this call then
   * {@link setDefaultNodeLabel} will be used to set the node's value.
   * @returns {this} the graph, allowing this to be chained with other functions.
   * @remarks Takes `O(1)` time.
   */
  setNode(t, r) {
    return Object.prototype.hasOwnProperty.call(this._nodes, t) ? (arguments.length > 1 && (this._nodes[t] = r), this) : (this._nodes[t] = arguments.length > 1 ? r : this._defaultNodeLabelFn(t), this._isCompound && (this._parent[t] = Zr, this._children[t] = {}, this._children[Zr][t] = !0), this._in[t] = {}, this._preds[t] = {}, this._out[t] = {}, this._sucs[t] = {}, ++this._nodeCount, this);
  }
  /**
   * Gets the label of node with specified name.
   *
   * @param {NodeID | number} v - Node ID.
   * @returns {NodeLabel | undefined} the label assigned to the node with the id `v`
   * if it is in the graph.
   * Otherwise returns `undefined`.
   * @remarks Takes `O(1)` time.
   */
  node(t) {
    return this._nodes[t];
  }
  /**
   * Detects whether graph has a node with specified name or not.
   *
   * @param {NodeID | number} v - Node ID.
   * @returns {boolean} Returns `true` the graph has a node with the id.
   * @remarks Takes `O(1)` time.
   */
  hasNode(t) {
    return Object.prototype.hasOwnProperty.call(this._nodes, t);
  }
  /**
   * Remove the node with the id `v` in the graph or do nothing if the node is
   * not in the graph.
   *
   * If the node was removed this function also removes any incident edges.
   *
   * @param {NodeID | number} v - Node ID to remove.
   * @returns {this} the graph, allowing this to be chained with other functions.
   * @remarks Takes `O(|E|)` time.
   */
  removeNode(t) {
    if (Object.prototype.hasOwnProperty.call(this._nodes, t)) {
      var r = (i) => this.removeEdge(this._edgeObjs[i]);
      delete this._nodes[t], this._isCompound && (this._removeFromParentsChildList(t), delete this._parent[t], Gr(this.children(t), (i) => {
        this.setParent(i);
      }), delete this._children[t]), Gr(Qr(this._in[t]), r), delete this._in[t], delete this._preds[t], Gr(Qr(this._out[t]), r), delete this._out[t], delete this._sucs[t], --this._nodeCount;
    }
    return this;
  }
  /**
   * Sets the parent for `v` to `parent` if it is defined or removes the parent
   * for `v` if `parent` is undefined.
   *
   * @param {NodeID | number} v - Node ID to set the parent for.
   * @param {NodeID | number} [parent] - Parent node ID. If not defined, removes the parent.
   * @returns {this} the graph, allowing this to be chained with other functions.
   * @throws if the graph is not compound.
   * @throws if setting the parent would create a cycle.
   * @remarks Takes `O(1)` time.
   */
  setParent(t, r) {
    if (!this._isCompound)
      throw new Error("Cannot set parent in a non-compound graph");
    if (Li(r))
      r = Zr;
    else {
      r += "";
      for (var i = r; !Li(i); i = this.parent(i))
        if (i === t)
          throw new Error("Setting " + r + " as parent of " + t + " would create a cycle");
      this.setNode(r);
    }
    return this.setNode(t), this._removeFromParentsChildList(t), this._parent[t] = r, this._children[r][t] = !0, this;
  }
  /**
   * @private
   * @param {NodeID | number} v - Node ID.
   */
  _removeFromParentsChildList(t) {
    delete this._children[this._parent[t]][t];
  }
  /**
   * Get parent node for node `v`.
   *
   * @param {NodeID | number} v - Node ID.
   * @returns {NodeID | undefined} the node that is a parent of node `v`
   * or `undefined` if node `v` does not have a parent or is not a member of
   * the graph.
   * Always returns `undefined` for graphs that are not compound.
   * @remarks Takes `O(1)` time.
   */
  parent(t) {
    if (this._isCompound) {
      var r = this._parent[t];
      if (r !== Zr)
        return r;
    }
  }
  /**
   * Gets list of direct children of node v.
   *
   * @param {NodeID | number} [v] - Node ID. If not specified, gets nodes
   * with no parent (top-level nodes).
   * @returns {NodeID[] | undefined} all nodes that are children of node `v` or
   * `undefined` if node `v` is not in the graph.
   * Always returns `[]` for graphs that are not compound.
   * @remarks Takes `O(|V|)` time.
   */
  children(t) {
    if (Li(t) && (t = Zr), this._isCompound) {
      var r = this._children[t];
      if (r)
        return Qr(r);
    } else {
      if (t === Zr)
        return this.nodes();
      if (this.hasNode(t))
        return [];
    }
  }
  /**
   * @param {NodeID | number} v - Node ID.
   * @returns {NodeID[] | undefined} all nodes that are predecessors of the
   * specified node or `undefined` if node `v` is not in the graph.
   * @remarks
   * Behavior is undefined for undirected graphs - use {@link neighbors} instead.
   * Takes `O(|V|)` time.
   */
  predecessors(t) {
    var r = this._preds[t];
    if (r)
      return Qr(r);
  }
  /**
   * @param {NodeID | number} v - Node ID.
   * @returns {NodeID[] | undefined} all nodes that are successors of the
   * specified node or `undefined` if node `v` is not in the graph.
   * @remarks
   * Behavior is undefined for undirected graphs - use {@link neighbors} instead.
   * Takes `O(|V|)` time.
   */
  successors(t) {
    var r = this._sucs[t];
    if (r)
      return Qr(r);
  }
  /**
   * @param {NodeID | number} v - Node ID.
   * @returns {NodeID[] | undefined} all nodes that are predecessors or
   * successors of the specified node
   * or `undefined` if node `v` is not in the graph.
   * @remarks Takes `O(|V|)` time.
   */
  neighbors(t) {
    var r = this.predecessors(t);
    if (r)
      return aC(r, this.successors(t));
  }
  /**
   * @param {NodeID | number} v - Node ID.
   * @returns {boolean} True if the node is a leaf (has no successors), false otherwise.
   */
  isLeaf(t) {
    var r;
    return this.isDirected() ? r = this.successors(t) : r = this.neighbors(t), r.length === 0;
  }
  /**
     * Creates new graph with nodes filtered via `filter`.
     * Edges incident to rejected node
     * are also removed.
     * 
     * In case of compound graph, if parent is rejected by `filter`,
     * than all its children are rejected too.
  
     * @param {(v: NodeID) => boolean} filter - Function that returns `true` for nodes to keep.
     * @returns {Graph<GraphLabel, NodeLabel, EdgeLabel>} A new graph containing only the nodes for which `filter` returns `true`.
     * @remarks Average-case complexity: O(|E|+|V|).
     */
  filterNodes(t) {
    var r = new this.constructor({
      directed: this._isDirected,
      multigraph: this._isMultigraph,
      compound: this._isCompound
    });
    r.setGraph(this.graph());
    var i = this;
    Gr(this._nodes, function(a, n) {
      t(n) && r.setNode(n, a);
    }), Gr(this._edgeObjs, function(a) {
      r.hasNode(a.v) && r.hasNode(a.w) && r.setEdge(a, i.edge(a));
    });
    var s = {};
    function o(a) {
      var n = i.parent(a);
      return n === void 0 || r.hasNode(n) ? (s[a] = n, n) : n in s ? s[n] : o(n);
    }
    return this._isCompound && Gr(r.nodes(), function(a) {
      r.setParent(a, o(a));
    }), r;
  }
  /* === Edge functions ========== */
  /**
   * Sets a new default value that is assigned to edges that are created without
   * a label.
   *
   * @param {typeof this._defaultEdgeLabelFn | EdgeLabel} newDefault - If a function,
   * it is called with the parameters `(v, w, name)`.
   * Otherwise, it is assigned as the label directly.
   * @returns {this}
   */
  setDefaultEdgeLabel(t) {
    return qc(t) || (t = xo(t)), this._defaultEdgeLabelFn = t, this;
  }
  /**
   * @returns {number} the number of edges in the graph.
   * @remarks Complexity: O(1).
   */
  edgeCount() {
    return this._edgeCount;
  }
  /**
   * Gets edges of the graph.
   *
   * @returns {EdgeObj[]} the {@link EdgeObj} for each edge in the graph.
   *
   * @remarks
   * In case of compound graph subgraphs are not considered.
   * Use {@link edge()} to get the label for each edge.
   * Takes `O(|E|)` time.
   */
  edges() {
    return sn(this._edgeObjs);
  }
  /**
   * Establish an edges path over the nodes in nodes list.
   *
   * If some edge is already exists, it will update its label, otherwise it will
   * create an edge between pair of nodes with label provided or default label
   * if no label provided.
   *
   * @param {Collection<NodeID>} vs - List of node IDs to create edges between.
   * @param {EdgeLabel} [value] - If set, update all edges with this value.
   * @returns {this}
   * @remarks Complexity: O(|nodes|).
   */
  setPath(t, r) {
    var i = this, s = arguments;
    return Qx(t, function(o, a) {
      return s.length > 1 ? i.setEdge(o, a, r) : i.setEdge(o, a), a;
    }), this;
  }
  /**
   * Creates or updates the label for the edge (`v`, `w`) with the optionally
   * supplied `name`.
   *
   * @overload
   * @param {EdgeObj} arg0 - Edge object.
   * @param {EdgeLabel} [value] - If supplied, it is set as the label for the edge.
   * If not supplied and the edge was created by this call then
   * {@link setDefaultEdgeLabel} will be used to assign the edge's label.
   * @returns {this} the graph, allowing this to be chained with other functions.
   * @remarks Takes `O(1)` time.
   */
  /**
   * Creates or updates the label for the edge (`v`, `w`) with the optionally
   * supplied `name`.
   *
   * @overload
   * @param {NodeID | number} v - Source node ID. Number values will be coerced to strings.
   * @param {NodeID | number} w - Target node ID. Number values will be coerced to strings.
   * @param {EdgeLabel} [value] - If supplied, it is set as the label for the edge.
   * If not supplied and the edge was created by this call then
   * {@link setDefaultEdgeLabel} will be used to assign the edge's label.
   * @param {string | number} [name] - Edge name. Only useful with multigraphs.
   * @returns {this} the graph, allowing this to be chained with other functions.
   * @remarks Takes `O(1)` time.
   */
  setEdge() {
    var t, r, i, s, o = !1, a = arguments[0];
    typeof a == "object" && a !== null && "v" in a ? (t = a.v, r = a.w, i = a.name, arguments.length === 2 && (s = arguments[1], o = !0)) : (t = a, r = arguments[1], i = arguments[3], arguments.length > 2 && (s = arguments[2], o = !0)), t = "" + t, r = "" + r, Li(i) || (i = "" + i);
    var n = Ps(this._isDirected, t, r, i);
    if (Object.prototype.hasOwnProperty.call(this._edgeLabels, n))
      return o && (this._edgeLabels[n] = s), this;
    if (!Li(i) && !this._isMultigraph)
      throw new Error("Cannot set a named edge when isMultigraph = false");
    this.setNode(t), this.setNode(r), this._edgeLabels[n] = o ? s : this._defaultEdgeLabelFn(t, r, i);
    var l = wv(this._isDirected, t, r, i);
    return t = l.v, r = l.w, Object.freeze(l), this._edgeObjs[n] = l, Ld(this._preds[r], t), Ld(this._sucs[t], r), this._in[r][n] = l, this._out[t][n] = l, this._edgeCount++, this;
  }
  /**
   * Gets the label for the specified edge.
   *
   * @overload
   * @param {EdgeObj} v - Edge object.
   * @returns {EdgeLabel | undefined} the label for the edge (`v`, `w`) if the
   * graph has an edge between `v` and `w` with the optional `name`.
   * Returned `undefined` if there is no such edge in the graph.
   * @remarks
   * `v` and `w` can be interchanged for undirected graphs.
   * Takes `O(1)` time.
   */
  /**
   * Gets the label for the specified edge.
   *
   * @overload
   * @param {NodeID | number} v - Source node ID.
   * @param {NodeID | number} w - Target node ID.
   * @param {string | number} [name] - Edge name. Only useful with multigraphs.
   * @returns {EdgeLabel | undefined} the label for the edge (`v`, `w`) if the
   * graph has an edge between `v` and `w` with the optional `name`.
   * Returned `undefined` if there is no such edge in the graph.
   * @remarks
   * `v` and `w` can be interchanged for undirected graphs.
   * Takes `O(1)` time.
   */
  edge(t, r, i) {
    var s = arguments.length === 1 ? Fn(this._isDirected, arguments[0]) : Ps(this._isDirected, t, r, i);
    return this._edgeLabels[s];
  }
  /**
   * Detects whether the graph contains specified edge or not.
   *
   * @overload
   * @param {EdgeObj} v - Edge object.
   * @returns {boolean} `true` if the graph has an edge between `v` and `w`
   * with the optional `name`.
   * @remarks
   * `v` and `w` can be interchanged for undirected graphs.
   * No subgraphs are considered.
   * Takes `O(1)` time.
   */
  /**
   * Detects whether the graph contains specified edge or not.
   *
   * @overload
   * @param {NodeID | number} v - Source node ID.
   * @param {NodeID | number} w - Target node ID.
   * @param {string | number} [name] - Edge name. Only useful with multigraphs.
   * @returns {boolean} `true` if the graph has an edge between `v` and `w`
   * with the optional `name`.
   * @remarks
   * `v` and `w` can be interchanged for undirected graphs.
   * No subgraphs are considered.
   * Takes `O(1)` time.
   */
  hasEdge(t, r, i) {
    var s = arguments.length === 1 ? Fn(this._isDirected, arguments[0]) : Ps(this._isDirected, t, r, i);
    return Object.prototype.hasOwnProperty.call(this._edgeLabels, s);
  }
  /**
   * Removes the edge (`v`, `w`) if the graph has an edge between `v` and `w`
   * with the optional `name`. If not this function does nothing.
   *
   * @overload
   * @param {EdgeObj} v - Edge object.
   * @returns {this}
   * @remarks
   * `v` and `w` can be interchanged for undirected graphs.
   * No subgraphs are considered.
   * Takes `O(1)` time.
   */
  /**
   * Removes the edge (`v`, `w`) if the graph has an edge between `v` and `w`
   * with the optional `name`. If not this function does nothing.
   *
   * @overload
   * @param {NodeID | number} v - Source node ID.
   * @param {NodeID | number} w - Target node ID.
   * @param {string | number} [name] - Edge name. Only useful with multigraphs.
   * @returns {this}
   * @remarks
   * `v` and `w` can be interchanged for undirected graphs.
   * Takes `O(1)` time.
   */
  removeEdge(t, r, i) {
    var s = arguments.length === 1 ? Fn(this._isDirected, arguments[0]) : Ps(this._isDirected, t, r, i), o = this._edgeObjs[s];
    return o && (t = o.v, r = o.w, delete this._edgeLabels[s], delete this._edgeObjs[s], Ad(this._preds[r], t), Ad(this._sucs[t], r), delete this._in[r][s], delete this._out[t][s], this._edgeCount--), this;
  }
  /**
   * @param {NodeID | number} v - Target node ID.
   * @param {NodeID | number} [u] - Optionally filters edges down to just those
   * coming from node `u`.
   * @returns {EdgeObj[] | undefined} all edges that point to the node `v`.
   * Returns `undefined` if node `v` is not in the graph.
   * @remarks
   * Behavior is undefined for undirected graphs - use {@link nodeEdges} instead.
   * Takes `O(|E|)` time.
   */
  inEdges(t, r) {
    var i = this._in[t];
    if (i) {
      var s = sn(i);
      return r ? Co(s, function(o) {
        return o.v === r;
      }) : s;
    }
  }
  /**
   * @param {NodeID | number} v - Target node ID.
   * @param {NodeID | number} [w] - Optionally filters edges down to just those
   * that point to `w`.
   * @returns {EdgeObj[] | undefined} all edges that point to the node `v`.
   * Returns `undefined` if node `v` is not in the graph.
   * @remarks
   * Behavior is undefined for undirected graphs - use {@link nodeEdges} instead.
   * Takes `O(|E|)` time.
   */
  outEdges(t, r) {
    var i = this._out[t];
    if (i) {
      var s = sn(i);
      return r ? Co(s, function(o) {
        return o.w === r;
      }) : s;
    }
  }
  /**
   * @param {NodeID | number} v - Target Node ID.
   * @param {NodeID | number} [w] - If set, filters those edges down to just
   * those between nodes `v` and `w` regardless of direction
   * @returns {EdgeObj[] | undefined} all edges to or from node `v` regardless
   * of direction. Returns `undefined` if node `v` is not in the graph.
   * @remarks Takes `O(|E|)` time.
   */
  nodeEdges(t, r) {
    var i = this.inEdges(t, r);
    if (i)
      return i.concat(this.outEdges(t, r));
  }
}
Ra.prototype._nodeCount = 0;
Ra.prototype._edgeCount = 0;
function Ld(e, t) {
  e[t] ? e[t]++ : e[t] = 1;
}
function Ad(e, t) {
  --e[t] || delete e[t];
}
function Ps(e, t, r, i) {
  var s = "" + t, o = "" + r;
  if (!e && s > o) {
    var a = s;
    s = o, o = a;
  }
  return s + vd + o + vd + (Li(i) ? kv : i);
}
function wv(e, t, r, i) {
  var s = "" + t, o = "" + r;
  if (!e && s > o) {
    var a = s;
    s = o, o = a;
  }
  var n = { v: s, w: o };
  return i && (n.name = i), n;
}
function Fn(e, t) {
  return Ps(e, t.v, t.w, t.name);
}
function Oy(e, { edgePathsClass: t = "edges edgePaths" } = {}) {
  const r = e.insert("g").attr("class", "root"), i = r.insert("g").attr("class", "clusters"), s = r.insert("g").attr("class", t), o = r.insert("g").attr("class", "edgeLabels"), a = r.insert("g").attr("class", "nodes");
  return { clusters: i, edgePaths: s, edgeLabels: o, nodes: a, rootGroups: r };
}
p(Oy, "createLayoutElementGroups");
async function $y(e, t) {
  if (t.label) {
    const { shapeSvg: r, bbox: i } = await yt(e, t);
    t.labelBBox = { width: i.width, height: i.height }, r.remove();
  } else
    t.labelBBox = { width: 0, height: 0 };
}
p($y, "measureGroupLabel");
async function Iy(e, t, r) {
  const i = await Gh(e, t, r), s = i.node()?.getBBox() ?? { width: 0, height: 0 };
  return t.width = s.width, t.height = s.height, i;
}
p(Iy, "insertMeasuredNode");
async function Dy(e, t) {
  const r = new Ra({
    multigraph: !0,
    compound: !0
  }), i = [...t.edges], s = $t(), o = Oy(e), { edgeLabels: a, nodes: n } = o, l = /* @__PURE__ */ new Map(), c = e.node() != null;
  await Promise.all(
    t.nodes.map(async (h) => {
      if (h.isGroup)
        c && await $y(n, h), r.setNode(h.id, { ...h });
      else {
        if (c) {
          const u = await Iy(n, h, {
            config: s,
            dir: h.dir
          });
          l.set(h.id, u);
        }
        r.setNode(h.id, { ...h });
      }
    })
  );
  for (const h of i)
    c && vy(h) && await Vh(a, h), r.setEdge(h.start, h.end, { ...h }, h.id), t.edges.some((d) => d.id === h.id) || t.edges.push(h);
  if (globalThis.mermaidCaptureSizes) {
    const { captureNodeSizes: h } = await import("./sizeCapture-INFHLROL-l-q8wpLT.js");
    h(e, t);
  }
  return {
    graph: r,
    groups: o,
    nodeElements: l
  };
}
p(Dy, "createGraphWithElements");
var Dt = /* @__PURE__ */ new Map(), si = /* @__PURE__ */ new Map(), Ry = /* @__PURE__ */ new Map(), Sv = /* @__PURE__ */ p(() => {
  si.clear(), Ry.clear(), Dt.clear();
}, "clear"), Qs = /* @__PURE__ */ p((e, t) => {
  const r = si.get(t) || [];
  return $.trace("In isDescendant", t, " ", e, " = ", r.includes(e)), r.includes(e);
}, "isDescendant"), Tv = /* @__PURE__ */ p((e, t) => {
  const r = si.get(t) || [];
  return $.info("Descendants of ", t, " is ", r), $.info("Edge is ", e), e.v === t || e.w === t ? !1 : r ? r.includes(e.v) || Qs(e.v, t) || Qs(e.w, t) || r.includes(e.w) : ($.debug("Tilt, ", t, ",not in descendants"), !1);
}, "edgeInCluster"), Py = /* @__PURE__ */ p((e, t, r, i) => {
  $.debug(
    "Copying children of ",
    e,
    "root",
    i,
    "data",
    t.node(e),
    i
  );
  const s = t.children(e) || [];
  e !== i && s.push(e), $.debug("Copying (nodes) clusterId", e, "nodes", s), s.forEach((o) => {
    if (t.children(o).length > 0)
      Py(o, t, r, i);
    else {
      const a = t.node(o);
      $.info("cp ", o, " to ", i, " with parent ", e), r.setNode(o, a), i !== t.parent(o) && ($.debug("Setting parent", o, t.parent(o)), r.setParent(o, t.parent(o))), e !== i && o !== e ? ($.debug("Setting parent", o, e), r.setParent(o, e)) : ($.info("In copy ", e, "root", i, "data", t.node(e), i), $.debug(
        "Not Setting parent for node=",
        o,
        "cluster!==rootId",
        e !== i,
        "node!==clusterId",
        o !== e
      ));
      const n = t.edges(o);
      $.debug("Copying Edges", n), n.forEach((l) => {
        $.info("Edge", l);
        const c = t.edge(l.v, l.w, l.name);
        $.info("Edge data", c, i);
        try {
          Tv(l, i) ? ($.info("Copying as ", l.v, l.w, c, l.name), r.setEdge(l.v, l.w, c, l.name), $.info("newGraph edges ", r.edges(), r.edge(r.edges()[0]))) : $.info(
            "Skipping copy of edge ",
            l.v,
            "-->",
            l.w,
            " rootId: ",
            i,
            " clusterId:",
            e
          );
        } catch (h) {
          $.error(h);
        }
      });
    }
    $.debug("Removing node", o), t.removeNode(o);
  });
}, "copy"), Ny = /* @__PURE__ */ p((e, t) => {
  const r = t.children(e);
  let i = [...r];
  for (const s of r)
    Ry.set(s, e), i = [...i, ...Ny(s, t)];
  return i;
}, "extractDescendants"), _v = /* @__PURE__ */ p((e, t, r) => {
  const i = e.edges().filter((l) => l.v === t || l.w === t), s = e.edges().filter((l) => l.v === r || l.w === r), o = i.map((l) => ({ v: l.v === t ? r : l.v, w: l.w === t ? t : l.w })), a = s.map((l) => ({ v: l.v, w: l.w }));
  return o.filter((l) => a.some((c) => l.v === c.v && l.w === c.w));
}, "findCommonEdges"), xa = /* @__PURE__ */ p((e, t, r) => {
  const i = t.children(e);
  if ($.trace("Searching children of id ", e, i), i.length < 1)
    return e;
  let s;
  for (const o of i) {
    const a = xa(o, t, r), n = _v(t, r, a);
    if (a)
      if (n.length > 0)
        s = a;
      else
        return a;
  }
  return s;
}, "findNonClusterChild"), Ed = /* @__PURE__ */ p((e) => !Dt.has(e) || !Dt.get(e).externalConnections ? e : Dt.has(e) ? Dt.get(e).id : e, "getAnchorId"), t5 = /* @__PURE__ */ p((e, t) => {
  if (!e || t > 10) {
    $.debug("Opting out, no graph ");
    return;
  } else
    $.debug("Opting in, graph ");
  e.nodes().forEach(function(r) {
    e.children(r).length > 0 && ($.debug(
      "Cluster identified",
      r,
      " Replacement id in edges: ",
      xa(r, e, r)
    ), si.set(r, Ny(r, e)), Dt.set(r, { id: xa(r, e, r), clusterData: e.node(r) }));
  }), e.nodes().forEach(function(r) {
    const i = e.children(r), s = e.edges();
    i.length > 0 ? ($.debug("Cluster identified", r, si), s.forEach((o) => {
      const a = Qs(o.v, r), n = Qs(o.w, r);
      a ^ n && ($.debug("Edge: ", o, " leaves cluster ", r), $.debug("Descendants of XXX ", r, ": ", si.get(r)), Dt.get(r).externalConnections = !0);
    })) : $.debug("Not a cluster ", r, si);
  });
  for (let r of Dt.keys()) {
    const i = Dt.get(r).id, s = e.parent(i);
    s !== r && Dt.has(s) && !Dt.get(s).externalConnections && (Dt.get(r).id = s);
    const o = e.edges().some((a) => a.v === r);
    if (i && Dt.get(r)?.externalConnections && o && zy(e, i, r)) {
      const a = Bv(e, r, e.parent(i));
      a && (Dt.get(r).id = a);
    }
  }
  e.edges().forEach(function(r) {
    const i = e.edge(r);
    $.debug("Edge " + r.v + " -> " + r.w + ": " + JSON.stringify(r)), $.debug("Edge " + r.v + " -> " + r.w + ": " + JSON.stringify(e.edge(r)));
    let s = r.v, o = r.w;
    if ($.debug(
      "Fix XXX",
      Dt,
      "ids:",
      r.v,
      r.w,
      "Translating: ",
      Dt.get(r.v),
      " --- ",
      Dt.get(r.w)
    ), Dt.get(r.v) || Dt.get(r.w)) {
      if ($.debug("Fixing and trying - removing XXX", r.v, r.w, r.name), s = Ed(r.v), o = Ed(r.w), e.removeEdge(r.v, r.w, r.name), s !== r.v) {
        const a = e.parent(s);
        Dt.get(a).externalConnections = !0, i.fromCluster = r.v;
      }
      if (o !== r.w) {
        const a = e.parent(o);
        Dt.get(a).externalConnections = !0, i.toCluster = r.w;
      }
      $.debug("Fix Replacing with XXX", s, o, r.name), e.setEdge(s, o, i, r.name);
    }
  }), qy(e, 0), $.trace(Dt);
}, "adjustClustersAndEdges"), qy = /* @__PURE__ */ p((e, t) => {
  if (t > 10) {
    $.error("Bailing out");
    return;
  }
  let r = e.nodes(), i = !1;
  for (const s of r) {
    const o = e.children(s);
    i = i || o.length > 0;
  }
  if (!i) {
    $.debug("Done, no node has children", e.nodes());
    return;
  }
  $.debug("Nodes = ", r, t);
  for (const s of r)
    if ($.debug(
      "Extracting node",
      s,
      Dt,
      Dt.has(s) && !Dt.get(s).externalConnections,
      !e.parent(s),
      e.node(s),
      e.children("D"),
      " Depth ",
      t
    ), !Dt.has(s))
      $.debug("Not a cluster", s, t);
    else if (!Dt.get(s).externalConnections && e.children(s) && e.children(s).length > 0) {
      $.debug(
        "Cluster without external connections, without a parent and with children",
        s,
        t
      );
      let a = e.graph().rankdir === "TB" ? "LR" : "TB";
      Dt.get(s)?.clusterData?.dir && (a = Dt.get(s).clusterData.dir, $.debug("Fixing dir", Dt.get(s).clusterData.dir, a));
      const n = new Ra({
        multigraph: !0,
        compound: !0
      }).setGraph({
        rankdir: a,
        nodesep: 50,
        ranksep: 50,
        marginx: 8,
        marginy: 8
      }).setDefaultEdgeLabel(function() {
        return {};
      });
      Py(s, e, n, s), e.setNode(s, {
        clusterNode: !0,
        id: s,
        clusterData: Dt.get(s).clusterData,
        label: Dt.get(s).label,
        graph: n
      });
    } else
      $.debug(
        "Cluster ** ",
        s,
        " **not meeting the criteria !externalConnections:",
        !Dt.get(s).externalConnections,
        " no parent: ",
        !e.parent(s),
        " children ",
        e.children(s) && e.children(s).length > 0,
        e.children("D"),
        t
      ), $.debug(Dt);
  r = e.nodes(), $.debug("New list of nodes", r);
  for (const s of r) {
    const o = e.node(s);
    $.debug(" Now next level", s, o), o?.clusterNode && qy(o.graph, t + 1);
  }
}, "extractor"), Wy = /* @__PURE__ */ p((e, t) => {
  if (t.length === 0)
    return [];
  let r = Object.assign([], t);
  return t.forEach((i) => {
    const s = e.children(i), o = Wy(e, s);
    r = [...r, ...o];
  }), r;
}, "sorter"), e5 = /* @__PURE__ */ p((e) => Wy(e, e.children()), "sortNodesByHierarchy"), zy = /* @__PURE__ */ p((e, t, r) => {
  let i = e.parent(t);
  for (; i && i !== r; ) {
    const s = Dt.get(i);
    if (s && !s.externalConnections)
      return !0;
    i = e.parent(i);
  }
  return !1;
}, "isNodeInExtractableCluster"), Bv = /* @__PURE__ */ p((e, t, r) => {
  const i = e.children(t) ?? [];
  for (const s of i) {
    if (s === r || Qs(s, r))
      continue;
    const o = xa(s, e, t);
    if (o && !zy(e, o, t))
      return o;
  }
  return null;
}, "findSafeAnchorNode");
function vv({
  prepareLayout: e,
  measureLayout: t,
  runLayoutCore: r,
  paintLayout: i,
  afterPaint: s,
  paintOptions: o
}) {
  const a = t ?? Yy;
  return /* @__PURE__ */ p(async function(l, c, h, u) {
    const d = c.select("g");
    (h?.insertMarkers ?? My)(
      d,
      l.markers,
      l.type,
      l.diagramId
    ), Hy();
    const f = {
      element: d,
      // root SVG <g>
      helpers: h,
      // Mermaid helper functions
      options: u
      // { algorithm: "elk.layered" }
    };
    f.preparedLayout = await e?.(l, f);
    const m = await a(l, f), y = await r(l, f), x = {
      ...f,
      measure: m
    };
    i ? await i(l, x, y) : await Uy(
      l,
      x,
      o
    ), await s?.(l, x, y);
  }, "render");
}
p(vv, "createCommonLayoutRenderer");
function Hy() {
  EB(), YB(), PB(), Sv();
}
p(Hy, "clearLayoutRenderState");
async function Yy(e, { element: t }) {
  return await Dy(t, e);
}
p(Yy, "defaultMeasureLayout");
async function Uy(e, t, r = {}) {
  const { measure: i } = t, { groups: s } = i;
  for (const a of r.getNodes?.(e, t) ?? e.nodes)
    r.skipNode?.(a, t) || await Xy(s, a, t, r);
  const o = Gy(e.nodes);
  for (const a of e.edges)
    Vy(a, r) || await Ky(s, a, o, e, r, t);
}
p(Uy, "paintLayoutData");
async function Xy(e, t, r, i) {
  t.clusterNode ? wd(t) : jy(t, r, i) ? await By(e.clusters, t) : wd(t);
}
p(Xy, "paintLayoutNode");
function jy(e, t, r) {
  return e.isGroup === !0 && (r.isCluster?.(e, t) ?? !0);
}
p(jy, "shouldPaintAsCluster");
function Gy(e) {
  const t = /* @__PURE__ */ new Map();
  for (const r of e)
    r?.id && t.set(r.id, r);
  return t;
}
p(Gy, "buildNodeLookup");
function Vy(e, t) {
  return e.isLayoutOnly || !!t.skipEdge?.(e);
}
p(Vy, "shouldSkipPaintEdge");
async function Ky(e, t, r, i, s, o) {
  const a = Ay(
    e.edgePaths,
    { ...t },
    s.clusterDb ?? /* @__PURE__ */ new Map(),
    i.type,
    zl(t.start, t, r, o, s),
    zl(t.end, t, r, o, s),
    i.diagramId,
    Zy(t, s)
  );
  vy(t) && (ss.has(t.id) || await Vh(e.edgeLabels, t), Qy(t, a));
}
p(Ky, "paintLayoutEdge");
function zl(e, t, r, i, s) {
  return s.getEdgeNode?.(e, t, i) ?? (e ? r.get(e) ?? {} : {});
}
p(zl, "getRenderedNode");
function Zy(e, t) {
  return typeof t.skipIntersect == "function" ? t.skipIntersect(e) : t.skipIntersect ?? !1;
}
p(Zy, "shouldSkipIntersect");
function Qy(e, t) {
  const r = t?.updatedPath ?? t?.originalPath, i = jt(), { subGraphTitleTotalMargin: s } = Ia({
    flowchart: i.flowchart ?? {}
  });
  if (e.label) {
    const o = ss.get(e.id);
    let a = e.x, n = e.y;
    if (r) {
      const l = me.calcLabelPosition(r);
      $.debug(
        "Moving label " + e.label + " from (",
        a,
        ",",
        n,
        ") to (",
        l.x,
        ",",
        l.y,
        ") abc88"
      ), t?.updatedPath && (a = l.x, n = l.y);
    }
    o.attr("transform", `translate(${a}, ${n + s / 2})`);
  }
  if (e?.startLabelLeft) {
    const o = Qt.get(e.id).startLeft;
    let a = e?.x, n = e?.y;
    if (r) {
      const l = me.calcTerminalLabelPosition(e.arrowTypeStart ? 10 : 0, "start_left", r);
      a = l.x, n = l.y;
    }
    o.attr("transform", `translate(${a}, ${n})`);
  }
  if (e.startLabelRight) {
    const o = Qt.get(e.id).startRight;
    let a = e.x, n = e.y;
    if (r) {
      const l = me.calcTerminalLabelPosition(
        e.arrowTypeStart ? 10 : 0,
        "start_right",
        r
      );
      a = l.x, n = l.y;
    }
    o.attr("transform", `translate(${a}, ${n})`);
  }
  if (e.endLabelLeft) {
    const o = Qt.get(e.id).endLeft;
    let a = e.x, n = e.y;
    if (r) {
      const l = me.calcTerminalLabelPosition(e.arrowTypeEnd ? 10 : 0, "end_left", r);
      a = l.x, n = l.y;
    }
    o.attr("transform", `translate(${a}, ${n})`);
  }
  if (e.endLabelRight) {
    const o = Qt.get(e.id).endRight;
    let a = e.x, n = e.y;
    if (r) {
      const l = me.calcTerminalLabelPosition(e.arrowTypeEnd ? 10 : 0, "end_right", r);
      a = l.x, n = l.y;
    }
    o.attr("transform", `translate(${a}, ${n})`);
  }
}
p(Qy, "positionRenderedEdgeLabel");
function Jy(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
p(Jy, "getDefaultExportFromCjs");
var fe = {}, Oo = {}, Rr = {}, Fd;
function cs() {
  if (Fd) return Rr;
  Fd = 1;
  function e(a) {
    return typeof a > "u" || a === null;
  }
  p(e, "isNothing");
  function t(a) {
    return typeof a == "object" && a !== null;
  }
  p(t, "isObject");
  function r(a) {
    return Array.isArray(a) ? a : e(a) ? [] : [a];
  }
  p(r, "toArray");
  function i(a, n) {
    if (n) {
      const l = Object.keys(n);
      for (let c = 0, h = l.length; c < h; c += 1) {
        const u = l[c];
        a[u] = n[u];
      }
    }
    return a;
  }
  p(i, "extend");
  function s(a, n) {
    let l = "";
    for (let c = 0; c < n; c += 1)
      l += a;
    return l;
  }
  p(s, "repeat");
  function o(a) {
    return a === 0 && Number.NEGATIVE_INFINITY === 1 / a;
  }
  return p(o, "isNegativeZero"), Rr.isNothing = e, Rr.isObject = t, Rr.toArray = r, Rr.repeat = s, Rr.isNegativeZero = o, Rr.extend = i, Rr;
}
p(cs, "requireCommon");
var Mn, Md;
function us() {
  if (Md) return Mn;
  Md = 1;
  function e(r, i) {
    let s = "";
    const o = r.reason || "(unknown reason)";
    return r.mark ? (r.mark.name && (s += 'in "' + r.mark.name + '" '), s += "(" + (r.mark.line + 1) + ":" + (r.mark.column + 1) + ")", !i && r.mark.snippet && (s += `

` + r.mark.snippet), o + " " + s) : o;
  }
  p(e, "formatError");
  function t(r, i) {
    Error.call(this), this.name = "YAMLException", this.reason = r, this.mark = i, this.message = e(this, !1), Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = new Error().stack || "";
  }
  return p(t, "YAMLException2"), t.prototype = Object.create(Error.prototype), t.prototype.constructor = t, t.prototype.toString = /* @__PURE__ */ p(function(i) {
    return this.name + ": " + e(this, i);
  }, "toString"), Mn = t, Mn;
}
p(us, "requireException");
var On, Od;
function t0() {
  if (Od) return On;
  Od = 1;
  const e = cs();
  function t(s, o, a, n, l) {
    let c = "", h = "";
    const u = Math.floor(l / 2) - 1;
    return n - o > u && (c = " ... ", o = n - u + c.length), a - n > u && (h = " ...", a = n + u - h.length), {
      str: c + s.slice(o, a).replace(/\t/g, "→") + h,
      pos: n - o + c.length
      // relative position
    };
  }
  p(t, "getLine");
  function r(s, o) {
    return e.repeat(" ", o - s.length) + s;
  }
  p(r, "padStart");
  function i(s, o) {
    if (o = Object.create(o || null), !s.buffer) return null;
    o.maxLength || (o.maxLength = 79), typeof o.indent != "number" && (o.indent = 1), typeof o.linesBefore != "number" && (o.linesBefore = 3), typeof o.linesAfter != "number" && (o.linesAfter = 2);
    const a = /\r?\n|\r|\0/g, n = [0], l = [];
    let c, h = -1;
    for (; c = a.exec(s.buffer); )
      l.push(c.index), n.push(c.index + c[0].length), s.position <= c.index && h < 0 && (h = n.length - 2);
    h < 0 && (h = n.length - 1);
    let u = "";
    const d = Math.min(s.line + o.linesAfter, l.length).toString().length, f = o.maxLength - (o.indent + d + 3);
    for (let y = 1; y <= o.linesBefore && !(h - y < 0); y++) {
      const x = t(
        s.buffer,
        n[h - y],
        l[h - y],
        s.position - (n[h] - n[h - y]),
        f
      );
      u = e.repeat(" ", o.indent) + r((s.line - y + 1).toString(), d) + " | " + x.str + `
` + u;
    }
    const m = t(s.buffer, n[h], l[h], s.position, f);
    u += e.repeat(" ", o.indent) + r((s.line + 1).toString(), d) + " | " + m.str + `
`, u += e.repeat("-", o.indent + d + 3 + m.pos) + `^
`;
    for (let y = 1; y <= o.linesAfter && !(h + y >= l.length); y++) {
      const x = t(
        s.buffer,
        n[h + y],
        l[h + y],
        s.position - (n[h] - n[h + y]),
        f
      );
      u += e.repeat(" ", o.indent) + r((s.line + y + 1).toString(), d) + " | " + x.str + `
`;
    }
    return u.replace(/\n$/, "");
  }
  return p(i, "makeSnippet"), On = i, On;
}
p(t0, "requireSnippet");
var $n, $d;
function xe() {
  if ($d) return $n;
  $d = 1;
  const e = us(), t = [
    "kind",
    "multi",
    "resolve",
    "construct",
    "instanceOf",
    "predicate",
    "represent",
    "representName",
    "defaultStyle",
    "styleAliases"
  ], r = [
    "scalar",
    "sequence",
    "mapping"
  ];
  function i(o) {
    const a = {};
    return o !== null && Object.keys(o).forEach(function(n) {
      o[n].forEach(function(l) {
        a[String(l)] = n;
      });
    }), a;
  }
  p(i, "compileStyleAliases");
  function s(o, a) {
    if (a = a || {}, Object.keys(a).forEach(function(n) {
      if (t.indexOf(n) === -1)
        throw new e('Unknown option "' + n + '" is met in definition of "' + o + '" YAML type.');
    }), this.options = a, this.tag = o, this.kind = a.kind || null, this.resolve = a.resolve || function() {
      return !0;
    }, this.construct = a.construct || function(n) {
      return n;
    }, this.instanceOf = a.instanceOf || null, this.predicate = a.predicate || null, this.represent = a.represent || null, this.representName = a.representName || null, this.defaultStyle = a.defaultStyle || null, this.multi = a.multi || !1, this.styleAliases = i(a.styleAliases || null), r.indexOf(this.kind) === -1)
      throw new e('Unknown kind "' + this.kind + '" is specified for "' + o + '" YAML type.');
  }
  return p(s, "Type2"), $n = s, $n;
}
p(xe, "requireType");
var In, Id;
function Kh() {
  if (Id) return In;
  Id = 1;
  const e = us(), t = xe();
  function r(o, a) {
    const n = [];
    return o[a].forEach(function(l) {
      let c = n.length;
      n.forEach(function(h, u) {
        h.tag === l.tag && h.kind === l.kind && h.multi === l.multi && (c = u);
      }), n[c] = l;
    }), n;
  }
  p(r, "compileList");
  function i() {
    const o = {
      scalar: {},
      sequence: {},
      mapping: {},
      fallback: {},
      multi: {
        scalar: [],
        sequence: [],
        mapping: [],
        fallback: []
      }
    };
    function a(n) {
      n.multi ? (o.multi[n.kind].push(n), o.multi.fallback.push(n)) : o[n.kind][n.tag] = o.fallback[n.tag] = n;
    }
    p(a, "collectType");
    for (let n = 0, l = arguments.length; n < l; n += 1)
      arguments[n].forEach(a);
    return o;
  }
  p(i, "compileMap");
  function s(o) {
    return this.extend(o);
  }
  return p(s, "Schema2"), s.prototype.extend = /* @__PURE__ */ p(function(a) {
    let n = [], l = [];
    if (a instanceof t)
      l.push(a);
    else if (Array.isArray(a))
      l = l.concat(a);
    else if (a && (Array.isArray(a.implicit) || Array.isArray(a.explicit)))
      a.implicit && (n = n.concat(a.implicit)), a.explicit && (l = l.concat(a.explicit));
    else
      throw new e("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");
    n.forEach(function(h) {
      if (!(h instanceof t))
        throw new e("Specified list of YAML types (or a single Type object) contains a non-Type object.");
      if (h.loadKind && h.loadKind !== "scalar")
        throw new e("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");
      if (h.multi)
        throw new e("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.");
    }), l.forEach(function(h) {
      if (!(h instanceof t))
        throw new e("Specified list of YAML types (or a single Type object) contains a non-Type object.");
    });
    const c = Object.create(s.prototype);
    return c.implicit = (this.implicit || []).concat(n), c.explicit = (this.explicit || []).concat(l), c.compiledImplicit = r(c, "implicit"), c.compiledExplicit = r(c, "explicit"), c.compiledTypeMap = i(c.compiledImplicit, c.compiledExplicit), c;
  }, "extend"), In = s, In;
}
p(Kh, "requireSchema");
var Dn, Dd;
function Zh() {
  if (Dd) return Dn;
  Dd = 1;
  const e = xe();
  return Dn = new e("tag:yaml.org,2002:str", {
    kind: "scalar",
    construct: /* @__PURE__ */ p(function(t) {
      return t !== null ? t : "";
    }, "construct")
  }), Dn;
}
p(Zh, "requireStr");
var Rn, Rd;
function Qh() {
  if (Rd) return Rn;
  Rd = 1;
  const e = xe();
  return Rn = new e("tag:yaml.org,2002:seq", {
    kind: "sequence",
    construct: /* @__PURE__ */ p(function(t) {
      return t !== null ? t : [];
    }, "construct")
  }), Rn;
}
p(Qh, "requireSeq");
var Pn, Pd;
function Jh() {
  if (Pd) return Pn;
  Pd = 1;
  const e = xe();
  return Pn = new e("tag:yaml.org,2002:map", {
    kind: "mapping",
    construct: /* @__PURE__ */ p(function(t) {
      return t !== null ? t : {};
    }, "construct")
  }), Pn;
}
p(Jh, "requireMap");
var Nn, Nd;
function tc() {
  if (Nd) return Nn;
  Nd = 1;
  const e = Kh();
  return Nn = new e({
    explicit: [
      Zh(),
      Qh(),
      Jh()
    ]
  }), Nn;
}
p(tc, "requireFailsafe");
var qn, qd;
function ec() {
  if (qd) return qn;
  qd = 1;
  const e = xe();
  function t(s) {
    if (s === null) return !0;
    const o = s.length;
    return o === 1 && s === "~" || o === 4 && (s === "null" || s === "Null" || s === "NULL");
  }
  p(t, "resolveYamlNull");
  function r() {
    return null;
  }
  p(r, "constructYamlNull");
  function i(s) {
    return s === null;
  }
  return p(i, "isNull"), qn = new e("tag:yaml.org,2002:null", {
    kind: "scalar",
    resolve: t,
    construct: r,
    predicate: i,
    represent: {
      canonical: /* @__PURE__ */ p(function() {
        return "~";
      }, "canonical"),
      lowercase: /* @__PURE__ */ p(function() {
        return "null";
      }, "lowercase"),
      uppercase: /* @__PURE__ */ p(function() {
        return "NULL";
      }, "uppercase"),
      camelcase: /* @__PURE__ */ p(function() {
        return "Null";
      }, "camelcase"),
      empty: /* @__PURE__ */ p(function() {
        return "";
      }, "empty")
    },
    defaultStyle: "lowercase"
  }), qn;
}
p(ec, "require_null");
var Wn, Wd;
function rc() {
  if (Wd) return Wn;
  Wd = 1;
  const e = xe();
  function t(s) {
    if (s === null) return !1;
    const o = s.length;
    return o === 4 && (s === "true" || s === "True" || s === "TRUE") || o === 5 && (s === "false" || s === "False" || s === "FALSE");
  }
  p(t, "resolveYamlBoolean");
  function r(s) {
    return s === "true" || s === "True" || s === "TRUE";
  }
  p(r, "constructYamlBoolean");
  function i(s) {
    return Object.prototype.toString.call(s) === "[object Boolean]";
  }
  return p(i, "isBoolean"), Wn = new e("tag:yaml.org,2002:bool", {
    kind: "scalar",
    resolve: t,
    construct: r,
    predicate: i,
    represent: {
      lowercase: /* @__PURE__ */ p(function(s) {
        return s ? "true" : "false";
      }, "lowercase"),
      uppercase: /* @__PURE__ */ p(function(s) {
        return s ? "TRUE" : "FALSE";
      }, "uppercase"),
      camelcase: /* @__PURE__ */ p(function(s) {
        return s ? "True" : "False";
      }, "camelcase")
    },
    defaultStyle: "lowercase"
  }), Wn;
}
p(rc, "requireBool");
var zn, zd;
function ic() {
  if (zd) return zn;
  zd = 1;
  const e = cs(), t = xe();
  function r(c) {
    return c >= 48 && c <= 57 || c >= 65 && c <= 70 || c >= 97 && c <= 102;
  }
  p(r, "isHexCode");
  function i(c) {
    return c >= 48 && c <= 55;
  }
  p(i, "isOctCode");
  function s(c) {
    return c >= 48 && c <= 57;
  }
  p(s, "isDecCode");
  function o(c) {
    if (c === null) return !1;
    const h = c.length;
    let u = 0, d = !1;
    if (!h) return !1;
    let f = c[u];
    if ((f === "-" || f === "+") && (f = c[++u]), f === "0") {
      if (u + 1 === h) return !0;
      if (f = c[++u], f === "b") {
        for (u++; u < h; u++) {
          if (f = c[u], f !== "0" && f !== "1") return !1;
          d = !0;
        }
        return d && isFinite(a(c));
      }
      if (f === "x") {
        for (u++; u < h; u++) {
          if (!r(c.charCodeAt(u))) return !1;
          d = !0;
        }
        return d && isFinite(a(c));
      }
      if (f === "o") {
        for (u++; u < h; u++) {
          if (!i(c.charCodeAt(u))) return !1;
          d = !0;
        }
        return d && isFinite(a(c));
      }
    }
    for (; u < h; u++) {
      if (!s(c.charCodeAt(u)))
        return !1;
      d = !0;
    }
    return d ? isFinite(a(c)) : !1;
  }
  p(o, "resolveYamlInteger");
  function a(c) {
    let h = c, u = 1, d = h[0];
    if ((d === "-" || d === "+") && (d === "-" && (u = -1), h = h.slice(1), d = h[0]), h === "0") return 0;
    if (d === "0") {
      if (h[1] === "b") return u * parseInt(h.slice(2), 2);
      if (h[1] === "x") return u * parseInt(h.slice(2), 16);
      if (h[1] === "o") return u * parseInt(h.slice(2), 8);
    }
    return u * parseInt(h, 10);
  }
  p(a, "parseYamlInteger");
  function n(c) {
    return a(c);
  }
  p(n, "constructYamlInteger");
  function l(c) {
    return Object.prototype.toString.call(c) === "[object Number]" && c % 1 === 0 && !e.isNegativeZero(c);
  }
  return p(l, "isInteger"), zn = new t("tag:yaml.org,2002:int", {
    kind: "scalar",
    resolve: o,
    construct: n,
    predicate: l,
    represent: {
      binary: /* @__PURE__ */ p(function(c) {
        return c >= 0 ? "0b" + c.toString(2) : "-0b" + c.toString(2).slice(1);
      }, "binary"),
      octal: /* @__PURE__ */ p(function(c) {
        return c >= 0 ? "0o" + c.toString(8) : "-0o" + c.toString(8).slice(1);
      }, "octal"),
      decimal: /* @__PURE__ */ p(function(c) {
        return c.toString(10);
      }, "decimal"),
      hexadecimal: /* @__PURE__ */ p(function(c) {
        return c >= 0 ? "0x" + c.toString(16).toUpperCase() : "-0x" + c.toString(16).toUpperCase().slice(1);
      }, "hexadecimal")
    },
    defaultStyle: "decimal",
    styleAliases: {
      binary: [2, "bin"],
      octal: [8, "oct"],
      decimal: [10, "dec"],
      hexadecimal: [16, "hex"]
    }
  }), zn;
}
p(ic, "requireInt");
var Hn, Hd;
function sc() {
  if (Hd) return Hn;
  Hd = 1;
  const e = cs(), t = xe(), r = new RegExp(
    // 2.5e4, 2.5 and integers
    "^(?:[-+]?(?:[0-9]+)(?:\\.[0-9]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"
  ), i = new RegExp(
    "^(?:[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"
  );
  function s(c) {
    return c === null || !r.test(c) ? !1 : isFinite(parseFloat(c, 10)) ? !0 : i.test(c);
  }
  p(s, "resolveYamlFloat");
  function o(c) {
    let h = c.toLowerCase();
    const u = h[0] === "-" ? -1 : 1;
    return "+-".indexOf(h[0]) >= 0 && (h = h.slice(1)), h === ".inf" ? u === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY : h === ".nan" ? NaN : u * parseFloat(h, 10);
  }
  p(o, "constructYamlFloat");
  const a = /^[-+]?[0-9]+e/;
  function n(c, h) {
    if (isNaN(c))
      switch (h) {
        case "lowercase":
          return ".nan";
        case "uppercase":
          return ".NAN";
        case "camelcase":
          return ".NaN";
      }
    else if (Number.POSITIVE_INFINITY === c)
      switch (h) {
        case "lowercase":
          return ".inf";
        case "uppercase":
          return ".INF";
        case "camelcase":
          return ".Inf";
      }
    else if (Number.NEGATIVE_INFINITY === c)
      switch (h) {
        case "lowercase":
          return "-.inf";
        case "uppercase":
          return "-.INF";
        case "camelcase":
          return "-.Inf";
      }
    else if (e.isNegativeZero(c))
      return "-0.0";
    const u = c.toString(10);
    return a.test(u) ? u.replace("e", ".e") : u;
  }
  p(n, "representYamlFloat");
  function l(c) {
    return Object.prototype.toString.call(c) === "[object Number]" && (c % 1 !== 0 || e.isNegativeZero(c));
  }
  return p(l, "isFloat"), Hn = new t("tag:yaml.org,2002:float", {
    kind: "scalar",
    resolve: s,
    construct: o,
    predicate: l,
    represent: n,
    defaultStyle: "lowercase"
  }), Hn;
}
p(sc, "requireFloat");
var Yn, Yd;
function oc() {
  return Yd || (Yd = 1, Yn = tc().extend({
    implicit: [
      ec(),
      rc(),
      ic(),
      sc()
    ]
  })), Yn;
}
p(oc, "requireJson");
var Un, Ud;
function ac() {
  return Ud || (Ud = 1, Un = oc()), Un;
}
p(ac, "requireCore");
var Xn, Xd;
function nc() {
  if (Xd) return Xn;
  Xd = 1;
  const e = xe(), t = new RegExp(
    "^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"
  ), r = new RegExp(
    "^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$"
  );
  function i(a) {
    return a === null ? !1 : t.exec(a) !== null || r.exec(a) !== null;
  }
  p(i, "resolveYamlTimestamp");
  function s(a) {
    let n = 0, l = null, c = t.exec(a);
    if (c === null && (c = r.exec(a)), c === null) throw new Error("Date resolve error");
    const h = +c[1], u = +c[2] - 1, d = +c[3];
    if (!c[4])
      return new Date(Date.UTC(h, u, d));
    const f = +c[4], m = +c[5], y = +c[6];
    if (c[7]) {
      for (n = c[7].slice(0, 3); n.length < 3; )
        n += "0";
      n = +n;
    }
    if (c[9]) {
      const C = +c[10], b = +(c[11] || 0);
      l = (C * 60 + b) * 6e4, c[9] === "-" && (l = -l);
    }
    const x = new Date(Date.UTC(h, u, d, f, m, y, n));
    return l && x.setTime(x.getTime() - l), x;
  }
  p(s, "constructYamlTimestamp");
  function o(a) {
    return a.toISOString();
  }
  return p(o, "representYamlTimestamp"), Xn = new e("tag:yaml.org,2002:timestamp", {
    kind: "scalar",
    resolve: i,
    construct: s,
    instanceOf: Date,
    represent: o
  }), Xn;
}
p(nc, "requireTimestamp");
var jn, jd;
function lc() {
  if (jd) return jn;
  jd = 1;
  const e = xe();
  function t(r) {
    return r === "<<" || r === null;
  }
  return p(t, "resolveYamlMerge"), jn = new e("tag:yaml.org,2002:merge", {
    kind: "scalar",
    resolve: t
  }), jn;
}
p(lc, "requireMerge");
var Gn, Gd;
function hc() {
  if (Gd) return Gn;
  Gd = 1;
  const e = xe(), t = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=
\r`;
  function r(a) {
    if (a === null) return !1;
    let n = 0;
    const l = a.length, c = t;
    for (let h = 0; h < l; h++) {
      const u = c.indexOf(a.charAt(h));
      if (!(u > 64)) {
        if (u < 0) return !1;
        n += 6;
      }
    }
    return n % 8 === 0;
  }
  p(r, "resolveYamlBinary");
  function i(a) {
    const n = a.replace(/[\r\n=]/g, ""), l = n.length, c = t;
    let h = 0;
    const u = [];
    for (let f = 0; f < l; f++)
      f % 4 === 0 && f && (u.push(h >> 16 & 255), u.push(h >> 8 & 255), u.push(h & 255)), h = h << 6 | c.indexOf(n.charAt(f));
    const d = l % 4 * 6;
    return d === 0 ? (u.push(h >> 16 & 255), u.push(h >> 8 & 255), u.push(h & 255)) : d === 18 ? (u.push(h >> 10 & 255), u.push(h >> 2 & 255)) : d === 12 && u.push(h >> 4 & 255), new Uint8Array(u);
  }
  p(i, "constructYamlBinary");
  function s(a) {
    let n = "", l = 0;
    const c = a.length, h = t;
    for (let d = 0; d < c; d++)
      d % 3 === 0 && d && (n += h[l >> 18 & 63], n += h[l >> 12 & 63], n += h[l >> 6 & 63], n += h[l & 63]), l = (l << 8) + a[d];
    const u = c % 3;
    return u === 0 ? (n += h[l >> 18 & 63], n += h[l >> 12 & 63], n += h[l >> 6 & 63], n += h[l & 63]) : u === 2 ? (n += h[l >> 10 & 63], n += h[l >> 4 & 63], n += h[l << 2 & 63], n += h[64]) : u === 1 && (n += h[l >> 2 & 63], n += h[l << 4 & 63], n += h[64], n += h[64]), n;
  }
  p(s, "representYamlBinary");
  function o(a) {
    return Object.prototype.toString.call(a) === "[object Uint8Array]";
  }
  return p(o, "isBinary"), Gn = new e("tag:yaml.org,2002:binary", {
    kind: "scalar",
    resolve: r,
    construct: i,
    predicate: o,
    represent: s
  }), Gn;
}
p(hc, "requireBinary");
var Vn, Vd;
function cc() {
  if (Vd) return Vn;
  Vd = 1;
  const e = xe(), t = Object.prototype.hasOwnProperty, r = Object.prototype.toString;
  function i(o) {
    if (o === null) return !0;
    const a = [], n = o;
    for (let l = 0, c = n.length; l < c; l += 1) {
      const h = n[l];
      let u = !1;
      if (r.call(h) !== "[object Object]") return !1;
      let d;
      for (d in h)
        if (t.call(h, d))
          if (!u) u = !0;
          else return !1;
      if (!u) return !1;
      if (a.indexOf(d) === -1) a.push(d);
      else return !1;
    }
    return !0;
  }
  p(i, "resolveYamlOmap");
  function s(o) {
    return o !== null ? o : [];
  }
  return p(s, "constructYamlOmap"), Vn = new e("tag:yaml.org,2002:omap", {
    kind: "sequence",
    resolve: i,
    construct: s
  }), Vn;
}
p(cc, "requireOmap");
var Kn, Kd;
function uc() {
  if (Kd) return Kn;
  Kd = 1;
  const e = xe(), t = Object.prototype.toString;
  function r(s) {
    if (s === null) return !0;
    const o = s, a = new Array(o.length);
    for (let n = 0, l = o.length; n < l; n += 1) {
      const c = o[n];
      if (t.call(c) !== "[object Object]") return !1;
      const h = Object.keys(c);
      if (h.length !== 1) return !1;
      a[n] = [h[0], c[h[0]]];
    }
    return !0;
  }
  p(r, "resolveYamlPairs");
  function i(s) {
    if (s === null) return [];
    const o = s, a = new Array(o.length);
    for (let n = 0, l = o.length; n < l; n += 1) {
      const c = o[n], h = Object.keys(c);
      a[n] = [h[0], c[h[0]]];
    }
    return a;
  }
  return p(i, "constructYamlPairs"), Kn = new e("tag:yaml.org,2002:pairs", {
    kind: "sequence",
    resolve: r,
    construct: i
  }), Kn;
}
p(uc, "requirePairs");
var Zn, Zd;
function dc() {
  if (Zd) return Zn;
  Zd = 1;
  const e = xe(), t = Object.prototype.hasOwnProperty;
  function r(s) {
    if (s === null) return !0;
    const o = s;
    for (const a in o)
      if (t.call(o, a) && o[a] !== null)
        return !1;
    return !0;
  }
  p(r, "resolveYamlSet");
  function i(s) {
    return s !== null ? s : {};
  }
  return p(i, "constructYamlSet"), Zn = new e("tag:yaml.org,2002:set", {
    kind: "mapping",
    resolve: r,
    construct: i
  }), Zn;
}
p(dc, "requireSet");
var Qn, Qd;
function Pa() {
  return Qd || (Qd = 1, Qn = ac().extend({
    implicit: [
      nc(),
      lc()
    ],
    explicit: [
      hc(),
      cc(),
      uc(),
      dc()
    ]
  })), Qn;
}
p(Pa, "require_default");
var Jd;
function e0() {
  if (Jd) return Oo;
  Jd = 1;
  const e = cs(), t = us(), r = t0(), i = Pa(), s = Object.prototype.hasOwnProperty, o = 1, a = 2, n = 3, l = 4, c = 1, h = 2, u = 3, d = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/, f = /[\x85\u2028\u2029]/, m = /[,\[\]{}]/, y = /^(?:!|!!|![0-9A-Za-z-]+!)$/, x = /^(?:!|[^,\[\]{}])(?:%[0-9a-f]{2}|[0-9a-z\-#;/?:@&=+$,_.!~*'()\[\]])*$/i;
  function C(g) {
    return Object.prototype.toString.call(g);
  }
  p(C, "_class");
  function b(g) {
    return g === 10 || g === 13;
  }
  p(b, "isEol");
  function w(g) {
    return g === 9 || g === 32;
  }
  p(w, "isWhiteSpace");
  function _(g) {
    return g === 9 || g === 32 || g === 10 || g === 13;
  }
  p(_, "isWsOrEol");
  function B(g) {
    return g === 44 || g === 91 || g === 93 || g === 123 || g === 125;
  }
  p(B, "isFlowIndicator");
  function A(g) {
    if (g >= 48 && g <= 57)
      return g - 48;
    const M = g | 32;
    return M >= 97 && M <= 102 ? M - 97 + 10 : -1;
  }
  p(A, "fromHexCode");
  function v(g) {
    return g === 120 ? 2 : g === 117 ? 4 : g === 85 ? 8 : 0;
  }
  p(v, "escapedHexLen");
  function L(g) {
    return g >= 48 && g <= 57 ? g - 48 : -1;
  }
  p(L, "fromDecimalCode");
  function W(g) {
    switch (g) {
      case 48:
        return "\0";
      case 97:
        return "\x07";
      case 98:
        return "\b";
      case 116:
        return "	";
      case 9:
        return "	";
      case 110:
        return `
`;
      case 118:
        return "\v";
      case 102:
        return "\f";
      case 114:
        return "\r";
      case 101:
        return "\x1B";
      case 32:
        return " ";
      case 34:
        return '"';
      case 47:
        return "/";
      case 92:
        return "\\";
      case 78:
        return "";
      case 95:
        return " ";
      case 76:
        return "\u2028";
      case 80:
        return "\u2029";
      default:
        return "";
    }
  }
  p(W, "simpleEscapeSequence");
  function H(g) {
    return g <= 65535 ? String.fromCharCode(g) : String.fromCharCode(
      (g - 65536 >> 10) + 55296,
      (g - 65536 & 1023) + 56320
    );
  }
  p(H, "charFromCodepoint");
  function D(g, M, z) {
    M === "__proto__" ? Object.defineProperty(g, M, {
      configurable: !0,
      enumerable: !0,
      writable: !0,
      value: z
    }) : g[M] = z;
  }
  p(D, "setProperty");
  const st = new Array(256), Y = new Array(256);
  for (let g = 0; g < 256; g++)
    st[g] = W(g) ? 1 : 0, Y[g] = W(g);
  function U(g, M) {
    this.input = g, this.filename = M.filename || null, this.schema = M.schema || i, this.onWarning = M.onWarning || null, this.legacy = M.legacy || !1, this.json = M.json || !1, this.listener = M.listener || null, this.maxDepth = typeof M.maxDepth == "number" ? M.maxDepth : 100, this.maxTotalMergeKeys = typeof M.maxTotalMergeKeys == "number" ? M.maxTotalMergeKeys : 1e4, this.implicitTypes = this.schema.compiledImplicit, this.typeMap = this.schema.compiledTypeMap, this.length = g.length, this.position = 0, this.line = 0, this.lineStart = 0, this.lineIndent = 0, this.depth = 0, this.totalMergeKeys = 0, this.firstTabInLine = -1, this.documents = [], this.anchorMapTransactions = [];
  }
  p(U, "State");
  function Q(g, M) {
    const z = {
      name: g.filename,
      buffer: g.input.slice(0, -1),
      // omit trailing \0
      position: g.position,
      line: g.line,
      column: g.position - g.lineStart
    };
    return z.snippet = r(z), new t(M, z);
  }
  p(Q, "generateError");
  function I(g, M) {
    throw Q(g, M);
  }
  p(I, "throwError");
  function N(g, M) {
    g.onWarning && g.onWarning.call(null, Q(g, M));
  }
  p(N, "throwWarning");
  function X(g, M, z) {
    const G = g.anchorMapTransactions;
    if (G.length !== 0) {
      const q = G[G.length - 1];
      s.call(q, M) || (q[M] = {
        existed: s.call(g.anchorMap, M),
        value: g.anchorMap[M]
      });
    }
    g.anchorMap[M] = z;
  }
  p(X, "storeAnchor");
  function gt(g) {
    g.anchorMapTransactions.push(/* @__PURE__ */ Object.create(null));
  }
  p(gt, "beginAnchorTransaction");
  function lt(g) {
    const M = g.anchorMapTransactions.pop(), z = g.anchorMapTransactions;
    if (z.length === 0) return;
    const G = z[z.length - 1], q = Object.keys(M);
    for (let it = 0, S = q.length; it < S; it += 1) {
      const O = q[it];
      s.call(G, O) || (G[O] = M[O]);
    }
  }
  p(lt, "commitAnchorTransaction");
  function St(g) {
    const M = g.anchorMapTransactions.pop(), z = Object.keys(M);
    for (let G = z.length - 1; G >= 0; G -= 1) {
      const q = M[z[G]];
      q.existed ? g.anchorMap[z[G]] = q.value : delete g.anchorMap[z[G]];
    }
  }
  p(St, "rollbackAnchorTransaction");
  function It(g) {
    return {
      position: g.position,
      line: g.line,
      lineStart: g.lineStart,
      lineIndent: g.lineIndent,
      firstTabInLine: g.firstTabInLine,
      tag: g.tag,
      anchor: g.anchor,
      kind: g.kind,
      result: g.result
    };
  }
  p(It, "snapshotState");
  function _t(g, M) {
    g.position = M.position, g.line = M.line, g.lineStart = M.lineStart, g.lineIndent = M.lineIndent, g.firstTabInLine = M.firstTabInLine, g.tag = M.tag, g.anchor = M.anchor, g.kind = M.kind, g.result = M.result;
  }
  p(_t, "restoreState");
  const Et = {
    YAML: /* @__PURE__ */ p(function(M, z, G) {
      M.version !== null && I(M, "duplication of %YAML directive"), G.length !== 1 && I(M, "YAML directive accepts exactly one argument");
      const q = /^([0-9]+)\.([0-9]+)$/.exec(G[0]);
      q === null && I(M, "ill-formed argument of the YAML directive");
      const it = parseInt(q[1], 10), S = parseInt(q[2], 10);
      it !== 1 && I(M, "unacceptable YAML version of the document"), M.version = G[0], M.checkLineBreaks = S < 2, S !== 1 && S !== 2 && N(M, "unsupported YAML version of the document");
    }, "handleYamlDirective"),
    TAG: /* @__PURE__ */ p(function(M, z, G) {
      let q;
      G.length !== 2 && I(M, "TAG directive accepts exactly two arguments");
      const it = G[0];
      q = G[1], y.test(it) || I(M, "ill-formed tag handle (first argument) of the TAG directive"), s.call(M.tagMap, it) && I(M, 'there is a previously declared suffix for "' + it + '" tag handle'), x.test(q) || I(M, "ill-formed tag prefix (second argument) of the TAG directive");
      try {
        q = decodeURIComponent(q);
      } catch {
        I(M, "tag prefix is malformed: " + q);
      }
      M.tagMap[it] = q;
    }, "handleTagDirective")
  };
  function Bt(g, M, z, G) {
    if (M < z) {
      const q = g.input.slice(M, z);
      if (G)
        for (let it = 0, S = q.length; it < S; it += 1) {
          const O = q.charCodeAt(it);
          O === 9 || O >= 32 && O <= 1114111 || I(g, "expected valid JSON character");
        }
      else d.test(q) && I(g, "the stream contains non-printable characters");
      g.result += q;
    }
  }
  p(Bt, "captureSegment");
  function ot(g, M, z, G) {
    e.isObject(z) || I(g, "cannot merge mappings; the provided source object is unacceptable");
    const q = Object.keys(z);
    for (let it = 0, S = q.length; it < S; it += 1) {
      const O = q[it];
      g.maxTotalMergeKeys !== -1 && ++g.totalMergeKeys > g.maxTotalMergeKeys && I(g, "merge keys exceeded maxTotalMergeKeys (" + g.maxTotalMergeKeys + ")"), s.call(M, O) || (D(M, O, z[O]), G[O] = !0);
    }
  }
  p(ot, "mergeMappings");
  function Lt(g, M, z, G, q, it, S, O, J) {
    if (Array.isArray(q)) {
      q = Array.prototype.slice.call(q);
      for (let j = 0, V = q.length; j < V; j += 1)
        Array.isArray(q[j]) && I(g, "nested arrays are not supported inside keys"), typeof q == "object" && C(q[j]) === "[object Object]" && (q[j] = "[object Object]");
    }
    if (typeof q == "object" && C(q) === "[object Object]" && (q = "[object Object]"), q = String(q), M === null && (M = {}), G === "tag:yaml.org,2002:merge")
      if (Array.isArray(it))
        for (let j = 0, V = it.length; j < V; j += 1)
          ot(g, M, it[j], z);
      else
        ot(g, M, it, z);
    else
      !g.json && !s.call(z, q) && s.call(M, q) && (g.line = S || g.line, g.lineStart = O || g.lineStart, g.position = J || g.position, I(g, "duplicated mapping key")), D(M, q, it), delete z[q];
    return M;
  }
  p(Lt, "storeMappingPair");
  function Nt(g) {
    const M = g.input.charCodeAt(g.position);
    M === 10 ? g.position++ : M === 13 ? (g.position++, g.input.charCodeAt(g.position) === 10 && g.position++) : I(g, "a line break is expected"), g.line += 1, g.lineStart = g.position, g.firstTabInLine = -1;
  }
  p(Nt, "readLineBreak");
  function Ft(g, M, z) {
    let G = 0, q = g.input.charCodeAt(g.position);
    for (; q !== 0; ) {
      for (; w(q); )
        q === 9 && g.firstTabInLine === -1 && (g.firstTabInLine = g.position), q = g.input.charCodeAt(++g.position);
      if (M && q === 35)
        do
          q = g.input.charCodeAt(++g.position);
        while (q !== 10 && q !== 13 && q !== 0);
      if (b(q))
        for (Nt(g), q = g.input.charCodeAt(g.position), G++, g.lineIndent = 0; q === 32; )
          g.lineIndent++, q = g.input.charCodeAt(++g.position);
      else
        break;
    }
    return z !== -1 && G !== 0 && g.lineIndent < z && N(g, "deficient indentation"), G;
  }
  p(Ft, "skipSeparationSpace");
  function oe(g) {
    let M = g.position, z = g.input.charCodeAt(M);
    return !!((z === 45 || z === 46) && z === g.input.charCodeAt(M + 1) && z === g.input.charCodeAt(M + 2) && (M += 3, z = g.input.charCodeAt(M), z === 0 || _(z)));
  }
  p(oe, "testDocumentSeparator");
  function Vt(g, M) {
    M === 1 ? g.result += " " : M > 1 && (g.result += e.repeat(`
`, M - 1));
  }
  p(Vt, "writeFoldedLines");
  function He(g, M, z) {
    let G, q, it, S, O, J;
    const j = g.kind, V = g.result;
    let rt = g.input.charCodeAt(g.position);
    if (_(rt) || B(rt) || rt === 35 || rt === 38 || rt === 42 || rt === 33 || rt === 124 || rt === 62 || rt === 39 || rt === 34 || rt === 37 || rt === 64 || rt === 96)
      return !1;
    if (rt === 63 || rt === 45) {
      const tt = g.input.charCodeAt(g.position + 1);
      if (_(tt) || z && B(tt))
        return !1;
    }
    for (g.kind = "scalar", g.result = "", G = q = g.position, it = !1; rt !== 0; ) {
      if (rt === 58) {
        const tt = g.input.charCodeAt(g.position + 1);
        if (_(tt) || z && B(tt))
          break;
      } else if (rt === 35) {
        const tt = g.input.charCodeAt(g.position - 1);
        if (_(tt))
          break;
      } else {
        if (g.position === g.lineStart && oe(g) || z && B(rt))
          break;
        if (b(rt))
          if (S = g.line, O = g.lineStart, J = g.lineIndent, Ft(g, !1, -1), g.lineIndent >= M) {
            it = !0, rt = g.input.charCodeAt(g.position);
            continue;
          } else {
            g.position = q, g.line = S, g.lineStart = O, g.lineIndent = J;
            break;
          }
      }
      it && (Bt(g, G, q, !1), Vt(g, g.line - S), G = q = g.position, it = !1), w(rt) || (q = g.position + 1), rt = g.input.charCodeAt(++g.position);
    }
    return Bt(g, G, q, !1), g.result ? !0 : (g.kind = j, g.result = V, !1);
  }
  p(He, "readPlainScalar");
  function pr(g, M) {
    let z, G, q = g.input.charCodeAt(g.position);
    if (q !== 39)
      return !1;
    for (g.kind = "scalar", g.result = "", g.position++, z = G = g.position; (q = g.input.charCodeAt(g.position)) !== 0; )
      if (q === 39)
        if (Bt(g, z, g.position, !0), q = g.input.charCodeAt(++g.position), q === 39)
          z = g.position, g.position++, G = g.position;
        else
          return !0;
      else b(q) ? (Bt(g, z, G, !0), Vt(g, Ft(g, !1, M)), z = G = g.position) : g.position === g.lineStart && oe(g) ? I(g, "unexpected end of the document within a single quoted scalar") : (g.position++, w(q) || (G = g.position));
    I(g, "unexpected end of the stream within a single quoted scalar");
  }
  p(pr, "readSingleQuotedScalar");
  function Oe(g, M) {
    let z, G, q, it = g.input.charCodeAt(g.position);
    if (it !== 34)
      return !1;
    for (g.kind = "scalar", g.result = "", g.position++, z = G = g.position; (it = g.input.charCodeAt(g.position)) !== 0; ) {
      if (it === 34)
        return Bt(g, z, g.position, !0), g.position++, !0;
      if (it === 92) {
        if (Bt(g, z, g.position, !0), it = g.input.charCodeAt(++g.position), b(it))
          Ft(g, !1, M);
        else if (it < 256 && st[it])
          g.result += Y[it], g.position++;
        else if ((q = v(it)) > 0) {
          let S = q, O = 0;
          for (; S > 0; S--)
            it = g.input.charCodeAt(++g.position), (q = A(it)) >= 0 ? O = (O << 4) + q : I(g, "expected hexadecimal character");
          g.result += H(O), g.position++;
        } else
          I(g, "unknown escape sequence");
        z = G = g.position;
      } else b(it) ? (Bt(g, z, G, !0), Vt(g, Ft(g, !1, M)), z = G = g.position) : g.position === g.lineStart && oe(g) ? I(g, "unexpected end of the document within a double quoted scalar") : (g.position++, w(it) || (G = g.position));
    }
    I(g, "unexpected end of the stream within a double quoted scalar");
  }
  p(Oe, "readDoubleQuotedScalar");
  function Ar(g, M) {
    let z = !0, G, q, it;
    const S = g.tag;
    let O;
    const J = g.anchor;
    let j, V, rt, tt;
    const ut = /* @__PURE__ */ Object.create(null);
    let nt, pt, mt, At = g.input.charCodeAt(g.position);
    if (At === 91)
      j = 93, tt = !1, O = [];
    else if (At === 123)
      j = 125, tt = !0, O = {};
    else
      return !1;
    for (g.anchor !== null && X(g, g.anchor, O), At = g.input.charCodeAt(++g.position); At !== 0; ) {
      if (Ft(g, !0, M), At = g.input.charCodeAt(g.position), At === j)
        return g.position++, g.tag = S, g.anchor = J, g.kind = tt ? "mapping" : "sequence", g.result = O, !0;
      if (z ? At === 44 && I(g, "expected the node content, but found ','") : I(g, "missed comma between flow collection entries"), pt = nt = mt = null, V = rt = !1, At === 63) {
        const Ut = g.input.charCodeAt(g.position + 1);
        _(Ut) && (V = rt = !0, g.position++, Ft(g, !0, M));
      }
      G = g.line, q = g.lineStart, it = g.position, Jt(g, M, o, !1, !0), pt = g.tag, nt = g.result, Ft(g, !0, M), At = g.input.charCodeAt(g.position), (rt || g.line === G) && At === 58 && (V = !0, At = g.input.charCodeAt(++g.position), Ft(g, !0, M), Jt(g, M, o, !1, !0), mt = g.result), tt ? Lt(g, O, ut, pt, nt, mt, G, q, it) : V ? O.push(Lt(g, null, ut, pt, nt, mt, G, q, it)) : O.push(nt), Ft(g, !0, M), At = g.input.charCodeAt(g.position), At === 44 ? (z = !0, At = g.input.charCodeAt(++g.position)) : z = !1;
    }
    I(g, "unexpected end of the stream within a flow collection");
  }
  p(Ar, "readFlowCollection");
  function Ht(g, M) {
    let z, G = c, q = !1, it = !1, S = M, O = 0, J = !1, j, V = g.input.charCodeAt(g.position);
    if (V === 124)
      z = !1;
    else if (V === 62)
      z = !0;
    else
      return !1;
    for (g.kind = "scalar", g.result = ""; V !== 0; )
      if (V = g.input.charCodeAt(++g.position), V === 43 || V === 45)
        c === G ? G = V === 43 ? u : h : I(g, "repeat of a chomping mode identifier");
      else if ((j = L(V)) >= 0)
        j === 0 ? I(g, "bad explicit indentation width of a block scalar; it cannot be less than one") : it ? I(g, "repeat of an indentation width identifier") : (S = M + j - 1, it = !0);
      else
        break;
    if (w(V)) {
      do
        V = g.input.charCodeAt(++g.position);
      while (w(V));
      if (V === 35)
        do
          V = g.input.charCodeAt(++g.position);
        while (!b(V) && V !== 0);
    }
    for (; V !== 0; ) {
      for (Nt(g), g.lineIndent = 0, V = g.input.charCodeAt(g.position); (!it || g.lineIndent < S) && V === 32; )
        g.lineIndent++, V = g.input.charCodeAt(++g.position);
      if (!it && g.lineIndent > S && (S = g.lineIndent), b(V)) {
        O++;
        continue;
      }
      if (!it && S === 0 && I(g, "missing indentation for block scalar"), g.lineIndent < S) {
        G === u ? g.result += e.repeat(`
`, q ? 1 + O : O) : G === c && q && (g.result += `
`);
        break;
      }
      z ? w(V) ? (J = !0, g.result += e.repeat(`
`, q ? 1 + O : O)) : J ? (J = !1, g.result += e.repeat(`
`, O + 1)) : O === 0 ? q && (g.result += " ") : g.result += e.repeat(`
`, O) : g.result += e.repeat(`
`, q ? 1 + O : O), q = !0, it = !0, O = 0;
      const rt = g.position;
      for (; !b(V) && V !== 0; )
        V = g.input.charCodeAt(++g.position);
      Bt(g, rt, g.position, !1);
    }
    return !0;
  }
  p(Ht, "readBlockScalar");
  function we(g, M) {
    const z = g.tag, G = g.anchor, q = [];
    let it = !1;
    if (g.firstTabInLine !== -1) return !1;
    g.anchor !== null && X(g, g.anchor, q);
    let S = g.input.charCodeAt(g.position);
    for (; S !== 0 && (g.firstTabInLine !== -1 && (g.position = g.firstTabInLine, I(g, "tab characters must not be used in indentation")), S === 45); ) {
      const O = g.input.charCodeAt(g.position + 1);
      if (!_(O))
        break;
      if (it = !0, g.position++, Ft(g, !0, -1) && g.lineIndent <= M) {
        q.push(null), S = g.input.charCodeAt(g.position);
        continue;
      }
      const J = g.line;
      if (Jt(g, M, n, !1, !0), q.push(g.result), Ft(g, !0, -1), S = g.input.charCodeAt(g.position), (g.line === J || g.lineIndent > M) && S !== 0)
        I(g, "bad indentation of a sequence entry");
      else if (g.lineIndent < M)
        break;
    }
    return it ? (g.tag = z, g.anchor = G, g.kind = "sequence", g.result = q, !0) : !1;
  }
  p(we, "readBlockSequence");
  function zt(g, M, z) {
    let G, q, it, S;
    const O = g.tag, J = g.anchor, j = {}, V = /* @__PURE__ */ Object.create(null);
    let rt = null, tt = null, ut = null, nt = !1, pt = !1;
    if (g.firstTabInLine !== -1) return !1;
    g.anchor !== null && X(g, g.anchor, j);
    let mt = g.input.charCodeAt(g.position);
    for (; mt !== 0; ) {
      !nt && g.firstTabInLine !== -1 && (g.position = g.firstTabInLine, I(g, "tab characters must not be used in indentation"));
      const At = g.input.charCodeAt(g.position + 1), Ut = g.line;
      if ((mt === 63 || mt === 58) && _(At))
        mt === 63 ? (nt && (Lt(g, j, V, rt, tt, null, q, it, S), rt = tt = ut = null), pt = !0, nt = !0, G = !0) : nt ? (nt = !1, G = !0) : I(g, "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"), g.position += 1, mt = At;
      else {
        if (q = g.line, it = g.lineStart, S = g.position, !Jt(g, z, a, !1, !0))
          break;
        if (g.line === Ut) {
          for (mt = g.input.charCodeAt(g.position); w(mt); )
            mt = g.input.charCodeAt(++g.position);
          if (mt === 58)
            mt = g.input.charCodeAt(++g.position), _(mt) || I(g, "a whitespace character is expected after the key-value separator within a block mapping"), nt && (Lt(g, j, V, rt, tt, null, q, it, S), rt = tt = ut = null), pt = !0, nt = !1, G = !1, rt = g.tag, tt = g.result;
          else if (pt)
            I(g, "can not read an implicit mapping pair; a colon is missed");
          else
            return g.tag = O, g.anchor = J, !0;
        } else if (pt)
          I(g, "can not read a block mapping entry; a multiline key may not be an implicit key");
        else
          return g.tag = O, g.anchor = J, !0;
      }
      if ((g.line === Ut || g.lineIndent > M) && (nt && (q = g.line, it = g.lineStart, S = g.position), Jt(g, M, l, !0, G) && (nt ? tt = g.result : ut = g.result), nt || (Lt(g, j, V, rt, tt, ut, q, it, S), rt = tt = ut = null), Ft(g, !0, -1), mt = g.input.charCodeAt(g.position)), (g.line === Ut || g.lineIndent > M) && mt !== 0)
        I(g, "bad indentation of a mapping entry");
      else if (g.lineIndent < M)
        break;
    }
    return nt && Lt(g, j, V, rt, tt, null, q, it, S), pt && (g.tag = O, g.anchor = J, g.kind = "mapping", g.result = j), pt;
  }
  p(zt, "readBlockMapping");
  function gr(g) {
    let M = !1, z = !1, G, q, it = g.input.charCodeAt(g.position);
    if (it !== 33) return !1;
    g.tag !== null && I(g, "duplication of a tag property"), it = g.input.charCodeAt(++g.position), it === 60 ? (M = !0, it = g.input.charCodeAt(++g.position)) : it === 33 ? (z = !0, G = "!!", it = g.input.charCodeAt(++g.position)) : G = "!";
    let S = g.position;
    if (M) {
      do
        it = g.input.charCodeAt(++g.position);
      while (it !== 0 && it !== 62);
      g.position < g.length ? (q = g.input.slice(S, g.position), it = g.input.charCodeAt(++g.position)) : I(g, "unexpected end of the stream within a verbatim tag");
    } else {
      for (; it !== 0 && !_(it); )
        it === 33 && (z ? I(g, "tag suffix cannot contain exclamation marks") : (G = g.input.slice(S - 1, g.position + 1), y.test(G) || I(g, "named tag handle cannot contain such characters"), z = !0, S = g.position + 1)), it = g.input.charCodeAt(++g.position);
      q = g.input.slice(S, g.position), m.test(q) && I(g, "tag suffix cannot contain flow indicator characters");
    }
    q && !x.test(q) && I(g, "tag name cannot contain such characters: " + q);
    try {
      q = decodeURIComponent(q);
    } catch {
      I(g, "tag name is malformed: " + q);
    }
    return M ? g.tag = q : s.call(g.tagMap, G) ? g.tag = g.tagMap[G] + q : G === "!" ? g.tag = "!" + q : G === "!!" ? g.tag = "tag:yaml.org,2002:" + q : I(g, 'undeclared tag handle "' + G + '"'), !0;
  }
  p(gr, "readTagProperty");
  function le(g) {
    let M = g.input.charCodeAt(g.position);
    if (M !== 38) return !1;
    g.anchor !== null && I(g, "duplication of an anchor property"), M = g.input.charCodeAt(++g.position);
    const z = g.position;
    for (; M !== 0 && !_(M) && !B(M); )
      M = g.input.charCodeAt(++g.position);
    return g.position === z && I(g, "name of an anchor node must contain at least one character"), g.anchor = g.input.slice(z, g.position), !0;
  }
  p(le, "readAnchorProperty");
  function $e(g) {
    let M = g.input.charCodeAt(g.position);
    if (M !== 42) return !1;
    M = g.input.charCodeAt(++g.position);
    const z = g.position;
    for (; M !== 0 && !_(M) && !B(M); )
      M = g.input.charCodeAt(++g.position);
    g.position === z && I(g, "name of an alias node must contain at least one character");
    const G = g.input.slice(z, g.position);
    return s.call(g.anchorMap, G) || I(g, 'unidentified alias "' + G + '"'), g.result = g.anchorMap[G], Ft(g, !0, -1), !0;
  }
  p($e, "readAlias");
  function Er(g, M, z, G) {
    const q = It(g);
    return gt(g), _t(g, M), g.tag = null, g.anchor = null, g.kind = null, g.result = null, zt(g, z, G) && g.kind === "mapping" ? (lt(g), !0) : (St(g), _t(g, q), !1);
  }
  p(Er, "tryReadBlockMappingFromProperty");
  function Jt(g, M, z, G, q) {
    let it, S, O = 1, J = !1, j = !1, V = null, rt, tt, ut;
    g.depth >= g.maxDepth && I(g, "nesting exceeded maxDepth (" + g.maxDepth + ")"), g.depth += 1, g.listener !== null && g.listener("open", g), g.tag = null, g.anchor = null, g.kind = null, g.result = null;
    const nt = it = S = l === z || n === z;
    if (G && Ft(g, !0, -1) && (J = !0, g.lineIndent > M ? O = 1 : g.lineIndent === M ? O = 0 : g.lineIndent < M && (O = -1)), O === 1)
      for (; ; ) {
        const pt = g.input.charCodeAt(g.position), mt = It(g);
        if (J && (pt === 33 && g.tag !== null || pt === 38 && g.anchor !== null) || !gr(g) && !le(g))
          break;
        V === null && (V = mt), Ft(g, !0, -1) ? (J = !0, S = nt, g.lineIndent > M ? O = 1 : g.lineIndent === M ? O = 0 : g.lineIndent < M && (O = -1)) : S = !1;
      }
    if (S && (S = J || q), O === 1 || l === z)
      if (o === z || a === z ? tt = M : tt = M + 1, ut = g.position - g.lineStart, O === 1)
        if (S && (we(g, ut) || zt(g, ut, tt)) || Ar(g, tt))
          j = !0;
        else {
          const pt = g.input.charCodeAt(g.position);
          V !== null && nt && !S && pt !== 124 && pt !== 62 && Er(
            g,
            V,
            V.position - V.lineStart,
            tt
          ) || it && Ht(g, tt) || pr(g, tt) || Oe(g, tt) ? j = !0 : $e(g) ? (j = !0, (g.tag !== null || g.anchor !== null) && I(g, "alias node should not have any properties")) : He(g, tt, o === z) && (j = !0, g.tag === null && (g.tag = "?")), g.anchor !== null && X(g, g.anchor, g.result);
        }
      else O === 0 && (j = S && we(g, ut));
    if (g.tag === null)
      g.anchor !== null && X(g, g.anchor, g.result);
    else if (g.tag === "?") {
      g.result !== null && g.kind !== "scalar" && I(g, 'unacceptable node kind for !<?> tag; it should be "scalar", not "' + g.kind + '"');
      for (let pt = 0, mt = g.implicitTypes.length; pt < mt; pt += 1)
        if (rt = g.implicitTypes[pt], rt.resolve(g.result)) {
          g.result = rt.construct(g.result), g.tag = rt.tag, g.anchor !== null && X(g, g.anchor, g.result);
          break;
        }
    } else if (g.tag !== "!") {
      if (s.call(g.typeMap[g.kind || "fallback"], g.tag))
        rt = g.typeMap[g.kind || "fallback"][g.tag];
      else {
        rt = null;
        const pt = g.typeMap.multi[g.kind || "fallback"];
        for (let mt = 0, At = pt.length; mt < At; mt += 1)
          if (g.tag.slice(0, pt[mt].tag.length) === pt[mt].tag) {
            rt = pt[mt];
            break;
          }
      }
      rt || I(g, "unknown tag !<" + g.tag + ">"), g.result !== null && rt.kind !== g.kind && I(g, "unacceptable node kind for !<" + g.tag + '> tag; it should be "' + rt.kind + '", not "' + g.kind + '"'), rt.resolve(g.result, g.tag) ? (g.result = rt.construct(g.result, g.tag), g.anchor !== null && X(g, g.anchor, g.result)) : I(g, "cannot resolve a node with !<" + g.tag + "> explicit tag");
    }
    return g.listener !== null && g.listener("close", g), g.depth -= 1, g.tag !== null || g.anchor !== null || j;
  }
  p(Jt, "composeNode");
  function Fr(g) {
    const M = g.position;
    let z = !1, G;
    for (g.version = null, g.checkLineBreaks = g.legacy, g.tagMap = /* @__PURE__ */ Object.create(null), g.anchorMap = /* @__PURE__ */ Object.create(null); (G = g.input.charCodeAt(g.position)) !== 0 && (Ft(g, !0, -1), G = g.input.charCodeAt(g.position), !(g.lineIndent > 0 || G !== 37)); ) {
      z = !0, G = g.input.charCodeAt(++g.position);
      let q = g.position;
      for (; G !== 0 && !_(G); )
        G = g.input.charCodeAt(++g.position);
      const it = g.input.slice(q, g.position), S = [];
      for (it.length < 1 && I(g, "directive name must not be less than one character in length"); G !== 0; ) {
        for (; w(G); )
          G = g.input.charCodeAt(++g.position);
        if (G === 35) {
          do
            G = g.input.charCodeAt(++g.position);
          while (G !== 0 && !b(G));
          break;
        }
        if (b(G)) break;
        for (q = g.position; G !== 0 && !_(G); )
          G = g.input.charCodeAt(++g.position);
        S.push(g.input.slice(q, g.position));
      }
      G !== 0 && Nt(g), s.call(Et, it) ? Et[it](g, it, S) : N(g, 'unknown document directive "' + it + '"');
    }
    if (Ft(g, !0, -1), g.lineIndent === 0 && g.input.charCodeAt(g.position) === 45 && g.input.charCodeAt(g.position + 1) === 45 && g.input.charCodeAt(g.position + 2) === 45 ? (g.position += 3, Ft(g, !0, -1)) : z && I(g, "directives end mark is expected"), Jt(g, g.lineIndent - 1, l, !1, !0), Ft(g, !0, -1), g.checkLineBreaks && f.test(g.input.slice(M, g.position)) && N(g, "non-ASCII line breaks are interpreted as content"), g.documents.push(g.result), g.position === g.lineStart && oe(g)) {
      g.input.charCodeAt(g.position) === 46 && (g.position += 3, Ft(g, !0, -1));
      return;
    }
    g.position < g.length - 1 && I(g, "end of the stream or a document separator is expected");
  }
  p(Fr, "readDocument");
  function Je(g, M) {
    g = String(g), M = M || {}, g.length !== 0 && (g.charCodeAt(g.length - 1) !== 10 && g.charCodeAt(g.length - 1) !== 13 && (g += `
`), g.charCodeAt(0) === 65279 && (g = g.slice(1)));
    const z = new U(g, M), G = g.indexOf("\0");
    for (G !== -1 && (z.position = G, I(z, "null byte is not allowed in input")), z.input += "\0"; z.input.charCodeAt(z.position) === 32; )
      z.lineIndent += 1, z.position += 1;
    for (; z.position < z.length - 1; )
      Fr(z);
    return z.documents;
  }
  p(Je, "loadDocuments");
  function mr(g, M, z) {
    M !== null && typeof M == "object" && typeof z > "u" && (z = M, M = null);
    const G = Je(g, z);
    if (typeof M != "function")
      return G;
    for (let q = 0, it = G.length; q < it; q += 1)
      M(G[q]);
  }
  p(mr, "loadAll2");
  function yr(g, M) {
    const z = Je(g, M);
    if (z.length !== 0) {
      if (z.length === 1)
        return z[0];
      throw new t("expected a single document in the stream, but found more");
    }
  }
  return p(yr, "load2"), Oo.loadAll = mr, Oo.load = yr, Oo;
}
p(e0, "requireLoader");
var Jn = {}, tf;
function r0() {
  if (tf) return Jn;
  tf = 1;
  const e = cs(), t = us(), r = Pa(), i = Object.prototype.toString, s = Object.prototype.hasOwnProperty, o = 65279, a = 9, n = 10, l = 13, c = 32, h = 33, u = 34, d = 35, f = 37, m = 38, y = 39, x = 42, C = 44, b = 45, w = 58, _ = 61, B = 62, A = 63, v = 64, L = 91, W = 93, H = 96, D = 123, st = 124, Y = 125, U = {};
  U[0] = "\\0", U[7] = "\\a", U[8] = "\\b", U[9] = "\\t", U[10] = "\\n", U[11] = "\\v", U[12] = "\\f", U[13] = "\\r", U[27] = "\\e", U[34] = '\\"', U[92] = "\\\\", U[133] = "\\N", U[160] = "\\_", U[8232] = "\\L", U[8233] = "\\P";
  const Q = [
    "y",
    "Y",
    "yes",
    "Yes",
    "YES",
    "on",
    "On",
    "ON",
    "n",
    "N",
    "no",
    "No",
    "NO",
    "off",
    "Off",
    "OFF"
  ], I = /^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;
  function N(S, O) {
    if (O === null) return {};
    const J = {}, j = Object.keys(O);
    for (let V = 0, rt = j.length; V < rt; V += 1) {
      let tt = j[V], ut = String(O[tt]);
      tt.slice(0, 2) === "!!" && (tt = "tag:yaml.org,2002:" + tt.slice(2));
      const nt = S.compiledTypeMap.fallback[tt];
      nt && s.call(nt.styleAliases, ut) && (ut = nt.styleAliases[ut]), J[tt] = ut;
    }
    return J;
  }
  p(N, "compileStyleMap");
  function X(S) {
    let O, J;
    const j = S.toString(16).toUpperCase();
    if (S <= 255)
      O = "x", J = 2;
    else if (S <= 65535)
      O = "u", J = 4;
    else if (S <= 4294967295)
      O = "U", J = 8;
    else
      throw new t("code point within a string may not be greater than 0xFFFFFFFF");
    return "\\" + O + e.repeat("0", J - j.length) + j;
  }
  p(X, "encodeHex");
  const gt = 1, lt = 2;
  function St(S) {
    this.schema = S.schema || r, this.indent = Math.max(1, S.indent || 2), this.noArrayIndent = S.noArrayIndent || !1, this.skipInvalid = S.skipInvalid || !1, this.flowLevel = e.isNothing(S.flowLevel) ? -1 : S.flowLevel, this.styleMap = N(this.schema, S.styles || null), this.sortKeys = S.sortKeys || !1, this.lineWidth = S.lineWidth || 80, this.noRefs = S.noRefs || !1, this.noCompatMode = S.noCompatMode || !1, this.condenseFlow = S.condenseFlow || !1, this.quotingType = S.quotingType === '"' ? lt : gt, this.forceQuotes = S.forceQuotes || !1, this.replacer = typeof S.replacer == "function" ? S.replacer : null, this.implicitTypes = this.schema.compiledImplicit, this.explicitTypes = this.schema.compiledExplicit, this.tag = null, this.result = "", this.duplicates = [], this.usedDuplicates = null;
  }
  p(St, "State");
  function It(S, O) {
    const J = e.repeat(" ", O);
    let j = 0, V = "";
    const rt = S.length;
    for (; j < rt; ) {
      let tt;
      const ut = S.indexOf(`
`, j);
      ut === -1 ? (tt = S.slice(j), j = rt) : (tt = S.slice(j, ut + 1), j = ut + 1), tt.length && tt !== `
` && (V += J), V += tt;
    }
    return V;
  }
  p(It, "indentString");
  function _t(S, O) {
    return `
` + e.repeat(" ", S.indent * O);
  }
  p(_t, "generateNextLine");
  function Et(S, O) {
    for (let J = 0, j = S.implicitTypes.length; J < j; J += 1)
      if (S.implicitTypes[J].resolve(O))
        return !0;
    return !1;
  }
  p(Et, "testImplicitResolving");
  function Bt(S) {
    return S === c || S === a;
  }
  p(Bt, "isWhitespace");
  function ot(S) {
    return S >= 32 && S <= 126 || S >= 161 && S <= 55295 && S !== 8232 && S !== 8233 || S >= 57344 && S <= 65533 && S !== o || S >= 65536 && S <= 1114111;
  }
  p(ot, "isPrintable");
  function Lt(S) {
    return ot(S) && S !== o && // - b-char
    S !== l && S !== n;
  }
  p(Lt, "isNsCharOrWhitespace");
  function Nt(S, O, J) {
    const j = Lt(S), V = j && !Bt(S);
    return (
      // ns-plain-safe
      (J ? j : j && // - c-flow-indicator
      S !== C && S !== L && S !== W && S !== D && S !== Y) && // ns-plain-char
      S !== d && // false on '#'
      !(O === w && !V) || // false on ': '
      Lt(O) && !Bt(O) && S === d || // change to true on '[^ ]#'
      O === w && V
    );
  }
  p(Nt, "isPlainSafe");
  function Ft(S) {
    return ot(S) && S !== o && !Bt(S) && // - s-white
    // - (c-indicator ::=
    // “-” | “?” | “:” | “,” | “[” | “]” | “{” | “}”
    S !== b && S !== A && S !== w && S !== C && S !== L && S !== W && S !== D && S !== Y && // | “#” | “&” | “*” | “!” | “|” | “=” | “>” | “'” | “"”
    S !== d && S !== m && S !== x && S !== h && S !== st && S !== _ && S !== B && S !== y && S !== u && // | “%” | “@” | “`”)
    S !== f && S !== v && S !== H;
  }
  p(Ft, "isPlainSafeFirst");
  function oe(S) {
    return !Bt(S) && S !== w;
  }
  p(oe, "isPlainSafeLast");
  function Vt(S, O) {
    const J = S.charCodeAt(O);
    let j;
    return J >= 55296 && J <= 56319 && O + 1 < S.length && (j = S.charCodeAt(O + 1), j >= 56320 && j <= 57343) ? (J - 55296) * 1024 + j - 56320 + 65536 : J;
  }
  p(Vt, "codePointAt");
  function He(S) {
    return /^\n* /.test(S);
  }
  p(He, "needIndentIndicator");
  const pr = 1, Oe = 2, Ar = 3, Ht = 4, we = 5;
  function zt(S, O, J, j, V, rt, tt, ut) {
    let nt, pt = 0, mt = null, At = !1, Ut = !1;
    const fs = j !== -1;
    let Mr = -1, Or = Ft(Vt(S, 0)) && oe(Vt(S, S.length - 1));
    if (O || tt)
      for (nt = 0; nt < S.length; pt >= 65536 ? nt += 2 : nt++) {
        if (pt = Vt(S, nt), !ot(pt))
          return we;
        Or = Or && Nt(pt, mt, ut), mt = pt;
      }
    else {
      for (nt = 0; nt < S.length; pt >= 65536 ? nt += 2 : nt++) {
        if (pt = Vt(S, nt), pt === n)
          At = !0, fs && (Ut = Ut || // Foldable line = too long, and not more-indented.
          nt - Mr - 1 > j && S[Mr + 1] !== " ", Mr = nt);
        else if (!ot(pt))
          return we;
        Or = Or && Nt(pt, mt, ut), mt = pt;
      }
      Ut = Ut || fs && nt - Mr - 1 > j && S[Mr + 1] !== " ";
    }
    return !At && !Ut ? Or && !tt && !V(S) ? pr : rt === lt ? we : Oe : J > 9 && He(S) ? we : tt ? rt === lt ? we : Oe : Ut ? Ht : Ar;
  }
  p(zt, "chooseScalarStyle");
  function gr(S, O, J, j, V) {
    S.dump = (function() {
      if (O.length === 0)
        return S.quotingType === lt ? '""' : "''";
      if (!S.noCompatMode && (Q.indexOf(O) !== -1 || I.test(O)))
        return S.quotingType === lt ? '"' + O + '"' : "'" + O + "'";
      const rt = S.indent * Math.max(1, J), tt = S.lineWidth === -1 ? -1 : Math.max(Math.min(S.lineWidth, 40), S.lineWidth - rt), ut = j || // No block styles in flow mode.
      S.flowLevel > -1 && J >= S.flowLevel;
      function nt(pt) {
        return Et(S, pt);
      }
      switch (p(nt, "testAmbiguity"), zt(
        O,
        ut,
        S.indent,
        tt,
        nt,
        S.quotingType,
        S.forceQuotes && !j,
        V
      )) {
        case pr:
          return O;
        case Oe:
          return "'" + O.replace(/'/g, "''") + "'";
        case Ar:
          return "|" + le(O, S.indent) + $e(It(O, rt));
        case Ht:
          return ">" + le(O, S.indent) + $e(It(Er(O, tt), rt));
        case we:
          return '"' + Fr(O) + '"';
        default:
          throw new t("impossible error: invalid scalar style");
      }
    })();
  }
  p(gr, "writeScalar");
  function le(S, O) {
    const J = He(S) ? String(O) : "", j = S[S.length - 1] === `
`, rt = j && (S[S.length - 2] === `
` || S === `
`) ? "+" : j ? "" : "-";
    return J + rt + `
`;
  }
  p(le, "blockHeader");
  function $e(S) {
    return S[S.length - 1] === `
` ? S.slice(0, -1) : S;
  }
  p($e, "dropEndingNewline");
  function Er(S, O) {
    const J = /(\n+)([^\n]*)/g;
    let j = (function() {
      let ut = S.indexOf(`
`);
      return ut = ut !== -1 ? ut : S.length, J.lastIndex = ut, Jt(S.slice(0, ut), O);
    })(), V = S[0] === `
` || S[0] === " ", rt, tt;
    for (; tt = J.exec(S); ) {
      const ut = tt[1], nt = tt[2];
      rt = nt[0] === " ", j += ut + (!V && !rt && nt !== "" ? `
` : "") + Jt(nt, O), V = rt;
    }
    return j;
  }
  p(Er, "foldString");
  function Jt(S, O) {
    if (S === "" || S[0] === " ") return S;
    const J = / [^ ]/g;
    let j, V = 0, rt, tt = 0, ut = 0, nt = "";
    for (; j = J.exec(S); )
      ut = j.index, ut - V > O && (rt = tt > V ? tt : ut, nt += `
` + S.slice(V, rt), V = rt + 1), tt = ut;
    return nt += `
`, S.length - V > O && tt > V ? nt += S.slice(V, tt) + `
` + S.slice(tt + 1) : nt += S.slice(V), nt.slice(1);
  }
  p(Jt, "foldLine");
  function Fr(S) {
    let O = "", J = 0;
    for (let j = 0; j < S.length; J >= 65536 ? j += 2 : j++) {
      J = Vt(S, j);
      const V = U[J];
      !V && ot(J) ? (O += S[j], J >= 65536 && (O += S[j + 1])) : O += V || X(J);
    }
    return O;
  }
  p(Fr, "escapeString");
  function Je(S, O, J) {
    let j = "";
    const V = S.tag;
    for (let rt = 0, tt = J.length; rt < tt; rt += 1) {
      let ut = J[rt];
      S.replacer && (ut = S.replacer.call(J, String(rt), ut)), (z(S, O, ut, !1, !1) || typeof ut > "u" && z(S, O, null, !1, !1)) && (j !== "" && (j += "," + (S.condenseFlow ? "" : " ")), j += S.dump);
    }
    S.tag = V, S.dump = "[" + j + "]";
  }
  p(Je, "writeFlowSequence");
  function mr(S, O, J, j) {
    let V = "";
    const rt = S.tag;
    for (let tt = 0, ut = J.length; tt < ut; tt += 1) {
      let nt = J[tt];
      S.replacer && (nt = S.replacer.call(J, String(tt), nt)), (z(S, O + 1, nt, !0, !0, !1, !0) || typeof nt > "u" && z(S, O + 1, null, !0, !0, !1, !0)) && ((!j || V !== "") && (V += _t(S, O)), S.dump && n === S.dump.charCodeAt(0) ? V += "-" : V += "- ", V += S.dump);
    }
    S.tag = rt, S.dump = V || "[]";
  }
  p(mr, "writeBlockSequence");
  function yr(S, O, J) {
    let j = "";
    const V = S.tag, rt = Object.keys(J);
    for (let tt = 0, ut = rt.length; tt < ut; tt += 1) {
      let nt = "";
      j !== "" && (nt += ", "), S.condenseFlow && (nt += '"');
      const pt = rt[tt];
      let mt = J[pt];
      S.replacer && (mt = S.replacer.call(J, pt, mt)), z(S, O, pt, !1, !1) && (S.dump.length > 1024 && (nt += "? "), nt += S.dump + (S.condenseFlow ? '"' : "") + ":" + (S.condenseFlow ? "" : " "), z(S, O, mt, !1, !1) && (nt += S.dump, j += nt));
    }
    S.tag = V, S.dump = "{" + j + "}";
  }
  p(yr, "writeFlowMapping");
  function g(S, O, J, j) {
    let V = "";
    const rt = S.tag, tt = Object.keys(J);
    if (S.sortKeys === !0)
      tt.sort();
    else if (typeof S.sortKeys == "function")
      tt.sort(S.sortKeys);
    else if (S.sortKeys)
      throw new t("sortKeys must be a boolean or a function");
    for (let ut = 0, nt = tt.length; ut < nt; ut += 1) {
      let pt = "";
      (!j || V !== "") && (pt += _t(S, O));
      const mt = tt[ut];
      let At = J[mt];
      if (S.replacer && (At = S.replacer.call(J, mt, At)), !z(S, O + 1, mt, !0, !0, !0))
        continue;
      const Ut = S.tag !== null && S.tag !== "?" || S.dump && S.dump.length > 1024;
      Ut && (S.dump && n === S.dump.charCodeAt(0) ? pt += "?" : pt += "? "), pt += S.dump, Ut && (pt += _t(S, O)), z(S, O + 1, At, !0, Ut) && (S.dump && n === S.dump.charCodeAt(0) ? pt += ":" : pt += ": ", pt += S.dump, V += pt);
    }
    S.tag = rt, S.dump = V || "{}";
  }
  p(g, "writeBlockMapping");
  function M(S, O, J) {
    const j = J ? S.explicitTypes : S.implicitTypes;
    for (let V = 0, rt = j.length; V < rt; V += 1) {
      const tt = j[V];
      if ((tt.instanceOf || tt.predicate) && (!tt.instanceOf || typeof O == "object" && O instanceof tt.instanceOf) && (!tt.predicate || tt.predicate(O))) {
        if (J ? tt.multi && tt.representName ? S.tag = tt.representName(O) : S.tag = tt.tag : S.tag = "?", tt.represent) {
          const ut = S.styleMap[tt.tag] || tt.defaultStyle;
          let nt;
          if (i.call(tt.represent) === "[object Function]")
            nt = tt.represent(O, ut);
          else if (s.call(tt.represent, ut))
            nt = tt.represent[ut](O, ut);
          else
            throw new t("!<" + tt.tag + '> tag resolver accepts not "' + ut + '" style');
          S.dump = nt;
        }
        return !0;
      }
    }
    return !1;
  }
  p(M, "detectType");
  function z(S, O, J, j, V, rt, tt) {
    S.tag = null, S.dump = J, M(S, J, !1) || M(S, J, !0);
    const ut = i.call(S.dump), nt = j;
    j && (j = S.flowLevel < 0 || S.flowLevel > O);
    const pt = ut === "[object Object]" || ut === "[object Array]";
    let mt, At;
    if (pt && (mt = S.duplicates.indexOf(J), At = mt !== -1), (S.tag !== null && S.tag !== "?" || At || S.indent !== 2 && O > 0) && (V = !1), At && S.usedDuplicates[mt])
      S.dump = "*ref_" + mt;
    else {
      if (pt && At && !S.usedDuplicates[mt] && (S.usedDuplicates[mt] = !0), ut === "[object Object]")
        j && Object.keys(S.dump).length !== 0 ? (g(S, O, S.dump, V), At && (S.dump = "&ref_" + mt + S.dump)) : (yr(S, O, S.dump), At && (S.dump = "&ref_" + mt + " " + S.dump));
      else if (ut === "[object Array]")
        j && S.dump.length !== 0 ? (S.noArrayIndent && !tt && O > 0 ? mr(S, O - 1, S.dump, V) : mr(S, O, S.dump, V), At && (S.dump = "&ref_" + mt + S.dump)) : (Je(S, O, S.dump), At && (S.dump = "&ref_" + mt + " " + S.dump));
      else if (ut === "[object String]")
        S.tag !== "?" && gr(S, S.dump, O, rt, nt);
      else {
        if (ut === "[object Undefined]")
          return !1;
        if (S.skipInvalid) return !1;
        throw new t("unacceptable kind of an object to dump " + ut);
      }
      if (S.tag !== null && S.tag !== "?") {
        let Ut = encodeURI(
          S.tag[0] === "!" ? S.tag.slice(1) : S.tag
        ).replace(/!/g, "%21");
        S.tag[0] === "!" ? Ut = "!" + Ut : Ut.slice(0, 18) === "tag:yaml.org,2002:" ? Ut = "!!" + Ut.slice(18) : Ut = "!<" + Ut + ">", S.dump = Ut + " " + S.dump;
      }
    }
    return !0;
  }
  p(z, "writeNode");
  function G(S, O) {
    const J = [], j = [];
    q(S, J, j);
    const V = j.length;
    for (let rt = 0; rt < V; rt += 1)
      O.duplicates.push(J[j[rt]]);
    O.usedDuplicates = new Array(V);
  }
  p(G, "getDuplicateReferences");
  function q(S, O, J) {
    if (S !== null && typeof S == "object") {
      const j = O.indexOf(S);
      if (j !== -1)
        J.indexOf(j) === -1 && J.push(j);
      else if (O.push(S), Array.isArray(S))
        for (let V = 0, rt = S.length; V < rt; V += 1)
          q(S[V], O, J);
      else {
        const V = Object.keys(S);
        for (let rt = 0, tt = V.length; rt < tt; rt += 1)
          q(S[V[rt]], O, J);
      }
    }
  }
  p(q, "inspectNode");
  function it(S, O) {
    O = O || {};
    const J = new St(O);
    J.noRefs || G(S, J);
    let j = S;
    return J.replacer && (j = J.replacer.call({ "": j }, "", j)), z(J, 0, j, !0, !0) ? J.dump + `
` : "";
  }
  return p(it, "dump2"), Jn.dump = it, Jn;
}
p(r0, "requireDumper");
var ef;
function i0() {
  if (ef) return fe;
  ef = 1;
  const e = e0(), t = r0();
  function r(i, s) {
    return function() {
      throw new Error("Function yaml." + i + " is removed in js-yaml 4. Use yaml." + s + " instead, which is now safe by default.");
    };
  }
  return p(r, "renamed"), fe.Type = xe(), fe.Schema = Kh(), fe.FAILSAFE_SCHEMA = tc(), fe.JSON_SCHEMA = oc(), fe.CORE_SCHEMA = ac(), fe.DEFAULT_SCHEMA = Pa(), fe.load = e.load, fe.loadAll = e.loadAll, fe.dump = t.dump, fe.YAMLException = us(), fe.types = {
    binary: hc(),
    float: sc(),
    map: Jh(),
    null: ec(),
    pairs: uc(),
    set: dc(),
    timestamp: nc(),
    bool: rc(),
    int: ic(),
    merge: lc(),
    omap: cc(),
    seq: Qh(),
    str: Zh()
  }, fe.safeLoad = r("safeLoad", "load"), fe.safeLoadAll = r("safeLoadAll", "loadAll"), fe.safeDump = r("safeDump", "dump"), fe;
}
p(i0, "requireJsYaml");
var Lv = i0(), Av = /* @__PURE__ */ Jy(Lv), {
  Type: r5,
  Schema: i5,
  FAILSAFE_SCHEMA: s5,
  JSON_SCHEMA: Ev,
  CORE_SCHEMA: o5,
  DEFAULT_SCHEMA: a5,
  load: Fv,
  loadAll: n5,
  dump: l5,
  YAMLException: h5,
  types: c5,
  safeLoad: u5,
  safeLoadAll: d5,
  safeDump: f5
} = Av, Mv = {
  common: oo,
  getConfig: jt,
  insertCluster: By,
  insertEdge: Ay,
  insertEdgeLabel: Vh,
  insertMarkers: My,
  insertNode: Gh,
  interpolateToCurve: _h,
  labelHelper: yt,
  log: $,
  positionEdgeLabel: UB
}, Js = {}, s0 = /* @__PURE__ */ p((e) => {
  for (const t of e)
    Js[t.name] = t;
}, "registerLayoutLoaders"), Ov = /* @__PURE__ */ p(() => {
  s0([
    {
      name: "dagre",
      loader: /* @__PURE__ */ p(async () => await import("./dagre-GXQ25YYZ-Bsr3Duqf.js"), "loader")
    },
    {
      name: "swimlane",
      loader: /* @__PURE__ */ p(async () => await import("./swimlanes-42K2YHIH-CtV7WVqt.js"), "loader")
    },
    {
      name: "cose-bilkent",
      loader: /* @__PURE__ */ p(async () => await import("./cose-bilkent-JH36ORCC-BJed39-a.js"), "loader")
    }
  ]);
}, "registerDefaultLayoutLoaders");
Ov();
var p5 = /* @__PURE__ */ p(async (e, t) => {
  if (!(e.layoutAlgorithm in Js))
    throw new Error(`Unknown layout algorithm: ${e.layoutAlgorithm}`);
  if (e.diagramId)
    for (const h of e.nodes) {
      const u = h.domId || h.id;
      h.domId = `${e.diagramId}-${u}`;
    }
  const r = Js[e.layoutAlgorithm], i = await r.loader(), { theme: s, themeVariables: o } = e.config, { useGradient: a, gradientStart: n, gradientStop: l } = o, c = t.attr("id");
  if (t.append("defs").append("filter").attr("id", `${c}-drop-shadow`).attr("height", "130%").attr("width", "130%").append("feDropShadow").attr("dx", "4").attr("dy", "4").attr("stdDeviation", 0).attr("flood-opacity", "0.06").attr("flood-color", `${s?.includes("dark") ? "#FFFFFF" : "#000000"}`), t.append("defs").append("filter").attr("id", `${c}-drop-shadow-small`).attr("height", "150%").attr("width", "150%").append("feDropShadow").attr("dx", "2").attr("dy", "2").attr("stdDeviation", 0).attr("flood-opacity", "0.06").attr("flood-color", `${s?.includes("dark") ? "#FFFFFF" : "#000000"}`), a) {
    const h = t.append("linearGradient").attr("id", t.attr("id") + "-gradient").attr("gradientUnits", "objectBoundingBox").attr("x1", "0%").attr("y1", "0%").attr("x2", "100%").attr("y2", "0%");
    h.append("svg:stop").attr("offset", "0%").attr("stop-color", n).attr("stop-opacity", 1), h.append("svg:stop").attr("offset", "100%").attr("stop-color", l).attr("stop-opacity", 1);
  }
  return i.render(e, t, Mv, {
    algorithm: r.algorithm
  });
}, "render"), g5 = /* @__PURE__ */ p((e = "", { fallback: t = "dagre" } = {}) => {
  if (e in Js)
    return e;
  if (t in Js)
    return $.warn(`Layout algorithm ${e} is not registered. Using ${t} as fallback.`), t;
  throw new Error(`Both layout algorithms ${e} and ${t} are not registered.`);
}, "getRegisteredLayoutAlgorithm"), fc = "comm", o0 = "rule", a0 = "decl", $v = "@media", Iv = "@import", Dv = "@supports", Rv = "@namespace", Hl = "@keyframes", n0 = "@layer", Pv = "@scope", Nv = Math.abs, Us = String.fromCharCode;
function l0(e) {
  return e.trim();
}
function Yl(e, t, r) {
  return e.replace(t, r);
}
function Ri(e, t) {
  return e.charCodeAt(t) | 0;
}
function os(e, t, r) {
  return e.slice(t, r);
}
function or(e) {
  return e.length;
}
function h0(e) {
  return e.length;
}
function $o(e, t) {
  return t.push(e), e;
}
var Na = 1, as = 1, c0 = 0, Ne = 0, ee = 0, ds = "";
function pc(e, t, r, i, s, o, a, n) {
  return { value: e, root: t, parent: r, type: i, props: s, children: o, line: Na, column: as, length: a, return: "", siblings: n };
}
function qv() {
  return ee;
}
function Wv() {
  return ee = Ne > 0 ? Ri(ds, --Ne) : 0, as--, ee === 10 && (as = 1, Na--), ee;
}
function Ve() {
  return ee = Ne < c0 ? Ri(ds, Ne++) : 0, as++, ee === 10 && (as = 1, Na++), ee;
}
function zr() {
  return Ri(ds, Ne);
}
function Xo() {
  return Ne;
}
function qa(e, t) {
  return os(ds, e, t);
}
function to(e) {
  switch (e) {
    // \0 \t \n \r \s whitespace token
    case 0:
    case 9:
    case 10:
    case 13:
    case 32:
      return 5;
    // ! + , / > @ ~ isolate token
    case 33:
    case 43:
    case 44:
    case 47:
    case 62:
    case 64:
    case 126:
    // ; { } breakpoint token
    case 59:
    case 123:
    case 125:
      return 4;
    // : accompanied token
    case 58:
      return 3;
    // " ' ( [ opening delimit token
    case 34:
    case 39:
    case 40:
    case 91:
      return 2;
    // ) ] closing delimit token
    case 41:
    case 93:
      return 1;
  }
  return 0;
}
function zv(e) {
  return Na = as = 1, c0 = or(ds = e), Ne = 0, [];
}
function Hv(e) {
  return ds = "", e;
}
function tl(e) {
  return l0(qa(Ne - 1, Ul(e === 91 ? e + 2 : e === 40 ? e + 1 : e)));
}
function Yv(e) {
  for (; (ee = zr()) && ee < 33; )
    Ve();
  return to(e) > 2 || to(ee) > 3 ? "" : " ";
}
function Uv(e, t) {
  for (; --t && Ve() && !(ee < 48 || ee > 102 || ee > 57 && ee < 65 || ee > 70 && ee < 97); )
    ;
  return qa(e, Xo() + (t < 6 && zr() == 32 && Ve() == 32));
}
function Ul(e) {
  for (; Ve(); )
    switch (ee) {
      // ] ) " '
      case e:
        return Ne;
      // " '
      case 34:
      case 39:
        e !== 34 && e !== 39 && Ul(ee);
        break;
      // (
      case 40:
        e === 41 && Ul(e);
        break;
      // \
      case 92:
        Ve();
        break;
    }
  return Ne;
}
function Xv(e, t) {
  for (; Ve() && e + ee !== 57; )
    if (e + ee === 84 && zr() === 47)
      break;
  return "/*" + qa(t, Ne - 1) + "*" + Us(e === 47 ? e : Ve());
}
function jv(e) {
  for (; !to(zr()); )
    Ve();
  return qa(e, Ne);
}
function Gv(e) {
  return Hv(jo("", null, null, null, [""], e = zv(e), 0, [0], e));
}
function jo(e, t, r, i, s, o, a, n, l) {
  for (var c = 0, h = 0, u = a, d = 0, f = 0, m = 0, y = 1, x = 1, C = 1, b = 0, w = 0, _ = "", B = s, A = o, v = i, L = _; x; )
    switch (m = w, w = Ve()) {
      // (
      case 40:
        m != 108 && Ri(L, u - 1) == 58 ? (b++, L += "(") : L += tl(w);
        break;
      // )
      case 41:
        b--, L += ")";
        break;
      // " ' [
      case 34:
      case 39:
      case 91:
        L += tl(w);
        break;
      // \t \n \r \s
      case 9:
      case 10:
      case 13:
      case 32:
        if (b > 0) {
          L += Us(w);
          break;
        }
        L += Yv(m);
        break;
      // \
      case 92:
        L += Uv(Xo() - 1, 7);
        continue;
      // /
      case 47:
        switch (zr()) {
          case 42:
          case 47:
            $o(Vv(Xv(Ve(), Xo()), t, r, l), l), (to(m || 1) == 5 || to(zr() || 1) == 5) && or(L) && os(L, -1, void 0) !== " " && (L += " ");
            break;
          default:
            L += "/";
        }
        break;
      // {
      case 123 * y:
        n[c++] = or(L) * C;
      // } ; \0
      case 125 * y:
      case 59:
      case 0:
        if (b > 0 && w) {
          L += Us(w);
          break;
        }
        switch (w) {
          // \0 }
          case 0:
          case 125:
            x = 0;
          // ;
          case 59 + h:
            C == -1 && (L = Yl(L, /\f/g, "")), f > 0 && (or(L) - u || y === 0) && $o(f > 32 ? sf(L + ";", i, r, u - 1, l) : sf(Yl(L, " ", "") + ";", i, r, u - 2, l), l);
            break;
          // @ ;
          case 59:
            L += ";";
          // { rule/at-rule
          default:
            if ($o(v = rf(L, t, r, c, h, s, n, _, B = [], A = [], u, o), o), w === 123)
              if (h === 0)
                jo(L, t, v, v, B, o, u, n, A);
              else {
                switch (d) {
                  // c(ontainer)
                  case 99:
                    if (Ri(L, 3) === 110) break;
                  // l(ayer)
                  case 108:
                    if (Ri(L, 2) === 97) break;
                  default:
                    h = 0;
                  // d(ocument) m(edia) s(upports)
                  case 100:
                  case 109:
                  case 115:
                }
                h ? jo(e, v, v, i && $o(rf(e, v, v, 0, 0, s, n, _, s, B = [], u, A), A), s, A, u, n, i ? B : A) : jo(L, v, v, v, [""], A, 0, n, A);
              }
        }
        c = h = f = 0, y = C = 1, _ = L = "", u = a;
        break;
      // :
      case 58:
        u = 1 + or(L), f = m;
      default:
        if (y < 1) {
          if (w == 123)
            --y;
          else if (w == 125 && y++ == 0 && Wv() == 125)
            continue;
        }
        switch (L += Us(w), w * y) {
          // &
          case 38:
            C = h > 0 ? 1 : (L += "\f", -1);
            break;
          // ,
          case 44:
            if (b > 0) break;
            n[c++] = (or(L) - 1) * C, C = 1;
            break;
          // @
          case 64:
            zr() === 45 && (L += tl(Ve())), d = zr(), h = u = or(_ = L += jv(Xo())), w++;
            break;
          // -
          case 45:
            m === 45 && or(L) == 2 && (y = 0);
        }
    }
  return o;
}
function rf(e, t, r, i, s, o, a, n, l, c, h, u) {
  for (var d = s - 1, f = s === 0 ? o : [""], m = h0(f), y = 0, x = 0, C = 0; y < i; ++y)
    for (var b = 0, w = os(e, d + 1, d = Nv(x = a[y])), _ = e; b < m; ++b)
      (_ = l0(x > 0 ? f[b] + " " + w : Yl(w, /&\f/g, f[b]))) && (l[C++] = _);
  return pc(e, t, r, s === 0 ? o0 : n, l, c, h, u);
}
function Vv(e, t, r, i) {
  return pc(e, t, r, fc, Us(qv()), os(e, 2, -2), 0, i);
}
function sf(e, t, r, i, s) {
  return pc(e, t, r, a0, os(e, 0, i), os(e, i + 1, -1), i, s);
}
function Xl(e, t) {
  for (var r = "", i = 0; i < e.length; i++)
    r += t(e[i], i, e, t) || "";
  return r;
}
function Kv(e, t, r, i) {
  switch (e.type) {
    case n0:
      if (e.children.length) break;
    case Iv:
    case Rv:
    case a0:
      return e.return = e.return || e.value;
    case fc:
      return "";
    case Hl:
      return e.return = e.value + "{" + Xl(e.children, i) + "}";
    case o0:
      if (!or(e.value = e.props.join(","))) return "";
  }
  return or(r = Xl(e.children, i)) ? e.return = e.value + "{" + r + "}" : "";
}
function Zv(e) {
  var t = h0(e);
  return function(r, i, s, o) {
    for (var a = "", n = 0; n < t; n++)
      a += e[n](r, i, s, o) || "";
    return a;
  };
}
var u0 = "c4", Qv = /* @__PURE__ */ p((e) => /^\s*C4Context|C4Container|C4Component|C4Dynamic|C4Deployment/.test(e), "detector"), Jv = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./c4Diagram-7LVT6UL2-mxMDJZJv.js");
  return { id: u0, diagram: e };
}, "loader"), tL = {
  id: u0,
  detector: Qv,
  loader: Jv
}, eL = tL, d0 = "flowchart", rL = /* @__PURE__ */ p((e, t) => t?.flowchart?.defaultRenderer === "dagre-wrapper" || t?.flowchart?.defaultRenderer === "elk" ? !1 : /^\s*graph/.test(e), "detector"), iL = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./flowDiagram-HODETNUW-DZF4oeiH.js");
  return { id: d0, diagram: e };
}, "loader"), sL = {
  id: d0,
  detector: rL,
  loader: iL
}, oL = sL, f0 = "flowchart-v2", aL = /* @__PURE__ */ p((e, t) => t?.flowchart?.defaultRenderer === "dagre-d3" ? !1 : (t?.flowchart?.defaultRenderer === "elk" && (t.layout = "elk"), /^\s*graph/.test(e) && t?.flowchart?.defaultRenderer === "dagre-wrapper" ? !0 : /^\s*flowchart/.test(e)), "detector"), nL = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./flowDiagram-HODETNUW-DZF4oeiH.js");
  return { id: f0, diagram: e };
}, "loader"), lL = {
  id: f0,
  detector: aL,
  loader: nL
}, hL = lL, p0 = "swimlane", cL = /* @__PURE__ */ p((e) => /^\s*swimlane-beta\b/.test(e), "detector"), uL = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./swimlanesDiagram-VR7AAH4N-Cy-h5lRW.js");
  return { id: p0, diagram: e };
}, "loader"), dL = {
  id: p0,
  detector: cL,
  loader: uL
}, fL = dL, g0 = "er", pL = /* @__PURE__ */ p((e) => /^\s*erDiagram/.test(e), "detector"), gL = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./erDiagram-RLTQ6QDP-DYrUxxaY.js");
  return { id: g0, diagram: e };
}, "loader"), mL = {
  id: g0,
  detector: pL,
  loader: gL
}, yL = mL, m0 = "gitGraph", xL = /* @__PURE__ */ p((e) => /^\s*gitGraph/.test(e), "detector"), CL = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./gitGraphDiagram-WWUBYQGX-DIDiIuwa.js");
  return { id: m0, diagram: e };
}, "loader"), bL = {
  id: m0,
  detector: xL,
  loader: CL
}, kL = bL, y0 = "gantt", wL = /* @__PURE__ */ p((e) => /^\s*gantt/.test(e), "detector"), SL = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./ganttDiagram-EL5Y4UJY-CTqAhTzo.js");
  return { id: y0, diagram: e };
}, "loader"), TL = {
  id: y0,
  detector: wL,
  loader: SL
}, _L = TL, x0 = "info", BL = /* @__PURE__ */ p((e) => /^\s*info/.test(e), "detector"), vL = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./infoDiagram-27XIBGKW-C1w28pId.js");
  return { id: x0, diagram: e };
}, "loader"), LL = {
  id: x0,
  detector: BL,
  loader: vL
}, C0 = "pie", AL = /* @__PURE__ */ p((e) => /^\s*pie/.test(e), "detector"), EL = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./pieDiagram-E7YTZNPT-HQngM4XS.js");
  return { id: C0, diagram: e };
}, "loader"), FL = {
  id: C0,
  detector: AL,
  loader: EL
}, b0 = "quadrantChart", ML = /* @__PURE__ */ p((e) => /^\s*quadrantChart/.test(e), "detector"), OL = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./quadrantDiagram-AXDQQJYC-B2MBGjiQ.js");
  return { id: b0, diagram: e };
}, "loader"), $L = {
  id: b0,
  detector: ML,
  loader: OL
}, IL = $L, k0 = "xychart", DL = /* @__PURE__ */ p((e) => /^\s*xychart(-beta)?/.test(e), "detector"), RL = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./xychartDiagram-S5SC5T6Z-D5aAEhrN.js");
  return { id: k0, diagram: e };
}, "loader"), PL = {
  id: k0,
  detector: DL,
  loader: RL
}, NL = PL, w0 = "requirement", qL = /* @__PURE__ */ p((e) => /^\s*requirement(Diagram)?/.test(e), "detector"), WL = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./requirementDiagram-BXWQKSXE-DCYMKQBn.js");
  return { id: w0, diagram: e };
}, "loader"), zL = {
  id: w0,
  detector: qL,
  loader: WL
}, HL = zL, S0 = "sequence", YL = /* @__PURE__ */ p((e) => /^\s*sequenceDiagram/.test(e), "detector"), UL = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./sequenceDiagram-WJ2MYXX4-BzZicgcI.js");
  return { id: S0, diagram: e };
}, "loader"), XL = {
  id: S0,
  detector: YL,
  loader: UL
}, jL = XL, T0 = "class", GL = /* @__PURE__ */ p((e, t) => t?.class?.defaultRenderer === "dagre-wrapper" ? !1 : /^\s*classDiagram/.test(e), "detector"), VL = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./classDiagram-ZZMXUADV-CKSs-auA.js");
  return { id: T0, diagram: e };
}, "loader"), KL = {
  id: T0,
  detector: GL,
  loader: VL
}, ZL = KL, _0 = "classDiagram", QL = /* @__PURE__ */ p((e, t) => /^\s*classDiagram/.test(e) && t?.class?.defaultRenderer === "dagre-wrapper" ? !0 : /^\s*classDiagram-v2/.test(e), "detector"), JL = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./classDiagram-v2-VYDZK3BY-CKSs-auA.js");
  return { id: _0, diagram: e };
}, "loader"), tA = {
  id: _0,
  detector: QL,
  loader: JL
}, eA = tA, B0 = "state", rA = /* @__PURE__ */ p((e, t) => t?.state?.defaultRenderer === "dagre-wrapper" ? !1 : /^\s*stateDiagram/.test(e), "detector"), iA = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./stateDiagram-D77RDMKH-CGg79JQb.js");
  return { id: B0, diagram: e };
}, "loader"), sA = {
  id: B0,
  detector: rA,
  loader: iA
}, oA = sA, v0 = "stateDiagram", aA = /* @__PURE__ */ p((e, t) => !!(/^\s*stateDiagram-v2/.test(e) || /^\s*stateDiagram/.test(e) && t?.state?.defaultRenderer === "dagre-wrapper"), "detector"), nA = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./stateDiagram-v2-MP3YSRHH-BCX5EC_i.js");
  return { id: v0, diagram: e };
}, "loader"), lA = {
  id: v0,
  detector: aA,
  loader: nA
}, hA = lA, L0 = "journey", cA = /* @__PURE__ */ p((e) => /^\s*journey/.test(e), "detector"), uA = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./journeyDiagram-3NMN7TZE-hwX4IlOF.js");
  return { id: L0, diagram: e };
}, "loader"), dA = {
  id: L0,
  detector: cA,
  loader: uA
}, fA = dA, pA = /* @__PURE__ */ p((e, t, r) => {
  $.debug(`rendering svg for syntax error
`);
  const i = bS(t), s = i.append("g");
  i.attr("viewBox", "0 0 2412 512"), op(i, 100, 512, !0), s.append("path").attr("class", "error-icon").attr(
    "d",
    "m411.313,123.313c6.25-6.25 6.25-16.375 0-22.625s-16.375-6.25-22.625,0l-32,32-9.375,9.375-20.688-20.688c-12.484-12.5-32.766-12.5-45.25,0l-16,16c-1.261,1.261-2.304,2.648-3.31,4.051-21.739-8.561-45.324-13.426-70.065-13.426-105.867,0-192,86.133-192,192s86.133,192 192,192 192-86.133 192-192c0-24.741-4.864-48.327-13.426-70.065 1.402-1.007 2.79-2.049 4.051-3.31l16-16c12.5-12.492 12.5-32.758 0-45.25l-20.688-20.688 9.375-9.375 32.001-31.999zm-219.313,100.687c-52.938,0-96,43.063-96,96 0,8.836-7.164,16-16,16s-16-7.164-16-16c0-70.578 57.422-128 128-128 8.836,0 16,7.164 16,16s-7.164,16-16,16z"
  ), s.append("path").attr("class", "error-icon").attr(
    "d",
    "m459.02,148.98c-6.25-6.25-16.375-6.25-22.625,0s-6.25,16.375 0,22.625l16,16c3.125,3.125 7.219,4.688 11.313,4.688 4.094,0 8.188-1.563 11.313-4.688 6.25-6.25 6.25-16.375 0-22.625l-16.001-16z"
  ), s.append("path").attr("class", "error-icon").attr(
    "d",
    "m340.395,75.605c3.125,3.125 7.219,4.688 11.313,4.688 4.094,0 8.188-1.563 11.313-4.688 6.25-6.25 6.25-16.375 0-22.625l-16-16c-6.25-6.25-16.375-6.25-22.625,0s-6.25,16.375 0,22.625l15.999,16z"
  ), s.append("path").attr("class", "error-icon").attr(
    "d",
    "m400,64c8.844,0 16-7.164 16-16v-32c0-8.836-7.156-16-16-16-8.844,0-16,7.164-16,16v32c0,8.836 7.156,16 16,16z"
  ), s.append("path").attr("class", "error-icon").attr(
    "d",
    "m496,96.586h-32c-8.844,0-16,7.164-16,16 0,8.836 7.156,16 16,16h32c8.844,0 16-7.164 16-16 0-8.836-7.156-16-16-16z"
  ), s.append("path").attr("class", "error-icon").attr(
    "d",
    "m436.98,75.605c3.125,3.125 7.219,4.688 11.313,4.688 4.094,0 8.188-1.563 11.313-4.688l32-32c6.25-6.25 6.25-16.375 0-22.625s-16.375-6.25-22.625,0l-32,32c-6.251,6.25-6.251,16.375-0.001,22.625z"
  ), s.append("text").attr("class", "error-text").attr("x", 1440).attr("y", 250).attr("font-size", "150px").style("text-anchor", "middle").text("Syntax error in text"), s.append("text").attr("class", "error-text").attr("x", 1250).attr("y", 400).attr("font-size", "100px").style("text-anchor", "middle").text(`mermaid version ${r}`);
}, "draw"), A0 = { draw: pA }, gA = A0, mA = {
  db: {},
  renderer: A0,
  parser: {
    parse: /* @__PURE__ */ p(() => {
    }, "parse")
  }
}, yA = mA, E0 = "flowchart-elk", xA = /* @__PURE__ */ p((e, t = {}) => (
  // If diagram explicitly states flowchart-elk
  /^\s*flowchart-elk/.test(e) || // If a flowchart/graph diagram has their default renderer set to elk
  /^\s*(flowchart|graph)/.test(e) && t?.flowchart?.defaultRenderer === "elk" ? (t.layout = "elk", !0) : !1
), "detector"), CA = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./flowDiagram-HODETNUW-DZF4oeiH.js");
  return { id: E0, diagram: e };
}, "loader"), bA = {
  id: E0,
  detector: xA,
  loader: CA
}, kA = bA, F0 = "timeline", wA = /* @__PURE__ */ p((e) => /^\s*timeline/.test(e), "detector"), SA = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./timeline-definition-24CTP7MA-CODWux8P.js");
  return { id: F0, diagram: e };
}, "loader"), TA = {
  id: F0,
  detector: wA,
  loader: SA
}, _A = TA, M0 = "mindmap", BA = /* @__PURE__ */ p((e) => /^\s*mindmap/.test(e), "detector"), vA = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./mindmap-definition-YA3MSWOX-DlfOTVdi.js");
  return { id: M0, diagram: e };
}, "loader"), LA = {
  id: M0,
  detector: BA,
  loader: vA
}, AA = LA, O0 = "kanban", EA = /* @__PURE__ */ p((e) => /^\s*kanban/.test(e), "detector"), FA = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./kanban-definition-UXKFOSKX-MRnSTifn.js");
  return { id: O0, diagram: e };
}, "loader"), MA = {
  id: O0,
  detector: EA,
  loader: FA
}, OA = MA, $0 = "sankey", $A = /* @__PURE__ */ p((e) => /^\s*sankey(-beta)?/.test(e), "detector"), IA = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./sankeyDiagram-P5KCCOFB-4m8DbtZO.js");
  return { id: $0, diagram: e };
}, "loader"), DA = {
  id: $0,
  detector: $A,
  loader: IA
}, RA = DA, I0 = "packet", PA = /* @__PURE__ */ p((e) => /^\s*packet(-beta)?/.test(e), "detector"), NA = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./diagram-Z3DM3KII-C6_chMeS.js");
  return { id: I0, diagram: e };
}, "loader"), qA = {
  id: I0,
  detector: PA,
  loader: NA
}, D0 = "radar", WA = /* @__PURE__ */ p((e) => /^\s*radar-beta/.test(e), "detector"), zA = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./diagram-UQ7AKVKN-8l_azvg-.js");
  return { id: D0, diagram: e };
}, "loader"), HA = {
  id: D0,
  detector: WA,
  loader: zA
}, R0 = "block", YA = /* @__PURE__ */ p((e) => /^\s*block(-beta)?/.test(e), "detector"), UA = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./blockDiagram-I7D4REHJ-yLwnQXGZ.js");
  return { id: R0, diagram: e };
}, "loader"), XA = {
  id: R0,
  detector: YA,
  loader: UA
}, jA = XA, P0 = "treeView", GA = /* @__PURE__ */ p((e) => /^\s*treeView-beta/.test(e), "detector"), VA = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./diagram-S7CK7UJ4-DqS8rAQP.js");
  return { id: P0, diagram: e };
}, "loader"), KA = {
  id: P0,
  detector: GA,
  loader: VA
}, ZA = KA, N0 = "architecture", QA = /* @__PURE__ */ p((e) => /^\s*architecture/.test(e), "detector"), JA = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./architectureDiagram-5GKGNRK7-DR-UuiWU.js");
  return { id: N0, diagram: e };
}, "loader"), tE = {
  id: N0,
  detector: QA,
  loader: JA
}, eE = tE, q0 = "eventmodeling", rE = /* @__PURE__ */ p((e) => /^\s*eventmodeling/.test(e), "detector"), iE = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./diagram-VSXAHHWV-DypSHtY-.js");
  return { id: q0, diagram: e };
}, "loader"), sE = {
  id: q0,
  detector: rE,
  loader: iE
}, oE = sE, W0 = "ishikawa", aE = /* @__PURE__ */ p((e) => /^\s*ishikawa(-beta)?\b/i.test(e), "detector"), nE = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./ishikawaDiagram-5VMMS53U-CievNr7W.js");
  return { id: W0, diagram: e };
}, "loader"), lE = {
  id: W0,
  detector: aE,
  loader: nE
}, z0 = "venn", hE = /* @__PURE__ */ p((e) => /^\s*venn-beta/.test(e), "detector"), cE = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./vennDiagram-4TSXK5OY-CsusoJmf.js");
  return { id: z0, diagram: e };
}, "loader"), uE = {
  id: z0,
  detector: hE,
  loader: cE
}, dE = uE, H0 = "treemap", fE = /* @__PURE__ */ p((e) => /^\s*treemap/.test(e), "detector"), pE = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./diagram-VX7I27RA-BnrygG1S.js");
  return { id: H0, diagram: e };
}, "loader"), gE = {
  id: H0,
  detector: fE,
  loader: pE
}, Y0 = "wardley", mE = /* @__PURE__ */ p((e) => /^\s*wardley-beta/i.test(e), "detector"), yE = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./wardleyDiagram-VM6X3IG4-Bl_jzAr-.js");
  return { id: Y0, diagram: e };
}, "loader"), xE = {
  id: Y0,
  detector: mE,
  loader: yE
}, CE = xE, U0 = "cynefin", bE = /* @__PURE__ */ p((e) => /^\s*cynefin-beta(?:[\s:]|$)/.test(e), "detector"), kE = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./cynefinDiagram-5FMLGOSQ-DbzQ7wP8.js");
  return { id: U0, diagram: e };
}, "loader"), wE = {
  id: U0,
  detector: bE,
  loader: kE
}, X0 = "railroad", SE = /* @__PURE__ */ p((e) => /^\s*railroad-beta/i.test(e), "detector"), TE = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./railroadDiagram-O6MQD6OU-DYpQsgzo.js");
  return { id: X0, diagram: e };
}, "loader"), _E = {
  id: X0,
  detector: SE,
  loader: TE
}, j0 = "railroadEbnf", BE = /* @__PURE__ */ p((e) => /^\s*railroad-ebnf-beta/i.test(e), "detector"), vE = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./ebnfDiagram-PWID7BFC-DgK9CDYu.js");
  return { id: j0, diagram: e };
}, "loader"), LE = {
  id: j0,
  detector: BE,
  loader: vE
}, G0 = "railroadAbnf", AE = /* @__PURE__ */ p((e) => /^\s*railroad-abnf-beta/i.test(e), "detector"), EE = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./abnfDiagram-VCTEODGH-BQZmla3b.js");
  return { id: G0, diagram: e };
}, "loader"), FE = {
  id: G0,
  detector: AE,
  loader: EE
}, V0 = "railroadPeg", ME = /* @__PURE__ */ p((e) => /^\s*railroad-peg-beta/i.test(e), "detector"), OE = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./pegDiagram-XKGWAZYB-Bzb3ggsj.js");
  return { id: V0, diagram: e };
}, "loader"), $E = {
  id: V0,
  detector: ME,
  loader: OE
}, of = !1, Wa = /* @__PURE__ */ p(() => {
  of || (of = !0, Jo("error", yA, (e) => e.toLowerCase().trim() === "error"), Jo(
    "---",
    // --- diagram type may appear if YAML front-matter is not parsed correctly
    {
      db: {
        clear: /* @__PURE__ */ p(() => {
        }, "clear")
      },
      styles: {},
      // should never be used
      renderer: {
        draw: /* @__PURE__ */ p(() => {
        }, "draw")
      },
      parser: {
        parse: /* @__PURE__ */ p(() => {
          throw new Error(
            "Diagrams beginning with --- are not valid. If you were trying to use a YAML front-matter, please ensure that you've correctly opened and closed the YAML front-matter with un-indented `---` blocks"
          );
        }, "parse")
      },
      init: /* @__PURE__ */ p(() => null, "init")
      // no op
    },
    (e) => e.toLowerCase().trimStart().startsWith("---")
  ), ul(kA, AA, eE), ul(
    eL,
    OA,
    eA,
    ZL,
    yL,
    _L,
    LL,
    FL,
    HL,
    jL,
    fL,
    hL,
    oL,
    _A,
    kL,
    hA,
    oA,
    fA,
    IL,
    RA,
    qA,
    NL,
    jA,
    oE,
    ZA,
    HA,
    lE,
    gE,
    _E,
    LE,
    FE,
    $E,
    dE,
    CE,
    wE
  ));
}, "addDiagrams"), IE = /* @__PURE__ */ p(async () => {
  $.debug("Loading registered diagrams");
  const t = (await Promise.allSettled(
    Object.entries(ui).map(async ([r, { detector: i, loader: s }]) => {
      if (s)
        try {
          gl(r);
        } catch {
          try {
            const { diagram: o, id: a } = await s();
            Jo(a, o, i);
          } catch (o) {
            throw $.error(`Failed to load external diagram with key ${r}. Removing from detectors.`), delete ui[r], o;
          }
        }
    })
  )).filter((r) => r.status === "rejected");
  if (t.length > 0) {
    $.error(`Failed to load ${t.length} external diagrams`);
    for (const r of t)
      $.error(r);
    throw new Error(`Failed to load ${t.length} external diagrams`);
  }
}, "loadRegisteredDiagrams"), DE = "graphics-document document";
function K0(e, t) {
  e.attr("role", DE), t !== "" && e.attr("aria-roledescription", t);
}
p(K0, "setA11yDiagramInfo");
function Z0(e, t, r, i) {
  if (e.insert !== void 0) {
    if (r) {
      const s = `chart-desc-${i}`;
      e.attr("aria-describedby", s), e.insert("desc", ":first-child").attr("id", s).text(r);
    }
    if (t) {
      const s = `chart-title-${i}`;
      e.attr("aria-labelledby", s), e.insert("title", ":first-child").attr("id", s).text(t);
    }
  }
}
p(Z0, "addSVGa11yTitleDescription");
var hi, jl = (hi = class {
  constructor(t, r, i, s, o) {
    this.type = t, this.text = r, this.db = i, this.parser = s, this.renderer = o;
  }
  static async fromText(t, r = {}) {
    const i = jt(), s = ih(t, i);
    t = zT(t) + `
`;
    try {
      gl(s);
    } catch {
      const c = pk(s);
      if (!c)
        throw new Jf(`Diagram ${s} not found.`);
      const { id: h, diagram: u } = await c();
      Jo(h, u);
    }
    const { db: o, parser: a, renderer: n, init: l } = gl(s);
    return a.parser && (a.parser.yy = o), o.clear?.(), l?.(i), r.title && o.setDiagramTitle?.(r.title), await a.parse(t), new hi(s, t, o, a, n);
  }
  async render(t, r) {
    await this.renderer.draw(this.text, t, r, this);
  }
  getParser() {
    return this.parser;
  }
  getType() {
    return this.type;
  }
}, p(hi, "Diagram"), hi), af = [], RE = /* @__PURE__ */ p(() => {
  af.forEach((e) => {
    e();
  }), af = [];
}, "attachFunctions"), PE = /* @__PURE__ */ p((e) => e.replace(/^\s*%%(?!{)[^\n]+\n?/gm, "").trimStart(), "cleanupComments");
function Q0(e) {
  const t = e.match(Qf);
  if (!t)
    return {
      text: e,
      metadata: {}
    };
  const r = t[1], i = r ? t[2].split(`
`).map((a) => a.startsWith(r) ? a.slice(r.length) : a).join(`
`) : t[2];
  let s = Fv(i, {
    // To support config, we need JSON schema.
    // https://www.yaml.org/spec/1.2/spec.html#id2803231
    schema: Ev
  }) ?? {};
  s = typeof s == "object" && !Array.isArray(s) ? s : {};
  const o = {};
  return s.displayMode && (o.displayMode = s.displayMode.toString()), s.title && (o.title = s.title.toString()), s.config && (o.config = s.config), {
    text: e.slice(t[0].length),
    metadata: o
  };
}
p(Q0, "extractFrontMatter");
var NE = /* @__PURE__ */ p((e) => e.replace(/\r\n?/g, `
`).replace(
  /<(\w+)([^>]*)>/g,
  (t, r, i) => "<" + r + i.replace(/="([^"]*)"/g, "='$1'") + ">"
), "cleanupText"), qE = /* @__PURE__ */ p((e) => {
  const { text: t, metadata: r } = Q0(e), { displayMode: i, title: s, config: o = {} } = r;
  return i && (o.gantt || (o.gantt = {}), o.gantt.displayMode = i), { title: s, config: o, text: t };
}, "processFrontmatter"), WE = /* @__PURE__ */ p((e) => {
  const t = me.detectInit(e) ?? {}, r = me.detectDirective(e, "wrap");
  return Array.isArray(r) ? t.wrap = r.some(({ type: i }) => i === "wrap") : r?.type === "wrap" && (t.wrap = !0), {
    text: AT(e),
    directive: t
  };
}, "processDirectives");
function gc(e) {
  const t = NE(e), r = qE(t), i = WE(r.text), s = Eh(r.config, i.directive);
  return e = PE(i.text), {
    code: e,
    title: r.title,
    config: s
  };
}
p(gc, "preprocessDiagram");
function J0(e) {
  const t = new TextEncoder().encode(e), r = Array.from(t, (i) => String.fromCodePoint(i)).join("");
  return btoa(r);
}
p(J0, "toBase64");
var zE = 5e4, HE = "graph TB;a[Maximum text size in diagram exceeded];style a fill:#faa", YE = "sandbox", UE = "loose", XE = "http://www.w3.org/2000/svg", jE = "http://www.w3.org/1999/xlink", GE = "http://www.w3.org/1999/xhtml", VE = "100%", KE = "100%", ZE = "border:0;margin:0;", QE = "margin:0", JE = "allow-top-navigation-by-user-activation allow-popups", tF = 'The "iframe" tag is not supported by your browser.', eF = ["foreignobject"], rF = ["dominant-baseline"];
function mc(e) {
  const t = gc(e);
  return Zo(), ck(t.config ?? {}), t;
}
p(mc, "processAndSetConfigs");
async function tx(e, t) {
  Wa();
  try {
    const { code: r, config: i } = mc(e);
    return { diagramType: (await rx(r)).type, config: i };
  } catch (r) {
    if (t?.suppressErrors)
      return !1;
    throw r;
  }
}
p(tx, "parse");
var nf = /* @__PURE__ */ p((e, t, r = []) => {
  const i = jf(`{ ${r.join(" !important; ")} !important; }`);
  return `.${e} ${t} ${i}`;
}, "cssImportantStyles"), iF = /* @__PURE__ */ p((e, t = /* @__PURE__ */ new Map()) => {
  const r = new CSSStyleSheet();
  if (e.fontFamily !== void 0 && r.insertRule(
    `:root { --mermaid-font-family: ${e.fontFamily}}`,
    r.cssRules.length
  ), e.altFontFamily !== void 0 && r.insertRule(
    `:root { --mermaid-alt-font-family: ${e.altFontFamily}}`,
    r.cssRules.length
  ), t instanceof Map) {
    const n = ye(e) ? ["> *", "span"] : ["rect", "polygon", "ellipse", "circle", "path"];
    t.forEach((l) => {
      qu(l.styles) || n.forEach((c) => {
        r.insertRule(
          nf(l.id, c, l.styles),
          r.cssRules.length
        );
      }), qu(l.textStyles) || r.insertRule(
        nf(
          l.id,
          "tspan",
          (l?.textStyles || []).map((c) => c.replace("color", "fill"))
        ),
        r.cssRules.length
      );
    });
  }
  let i = "";
  if (e.themeCSS !== void 0)
    if (typeof r.replaceSync == "function") {
      const s = new CSSStyleSheet();
      s.replaceSync(e.themeCSS), i = pl(s) + `
`;
    } else
      i += `${e.themeCSS}
`;
  return i + pl(r);
}, "createCssStyles"), sF = /* @__PURE__ */ p((e, t) => Xl(
  Gv(`${e}{${t}}`),
  Zv([
    /* @__PURE__ */ p(function(i, s, o, a) {
      if (i.type === "rule" && Array.isArray(i.props)) {
        if (i.parent && i.parent.type === Hl)
          return;
        i.props = i.props.map((n) => n === e && Array.isArray(i.children) && i.children.every((c) => c.type !== "decl" ? !1 : (/* @__PURE__ */ new Set([
          "font-family",
          "font-size",
          "fill"
        ])).has(c.props)) || // If the prop already starts with the namespace followed by a space or >, then it's already namespaced.
        (n.startsWith(`${e} `) || n.startsWith(`${e}>`)) && // Column combinators are not yet widely supported, it's not yet compressed to `${namespace}||`,
        // so we need to add an extra check for that
        !n.startsWith(`${e} ||`) ? n : `${e} ${n}`);
      } else i.type.startsWith("@") && ([
        ...[
          $v,
          Dv,
          n0,
          Pv,
          "@container",
          "@starting-style"
        ],
        Hl
        // needed for Mermaid's animation feature
      ].includes(i.type) || ($.warn(`Removing unsupported at-rule ${i.type} from CSS`), i.type = fc));
    }, "addNamespace"),
    Kv
  ])
), "compileCSS"), oF = /* @__PURE__ */ p((e, t, r, i) => {
  const s = iF(e, r), o = Mk(
    t,
    s,
    { ...e.themeVariables, theme: e.theme, look: e.look },
    i
  );
  return sF(i, o);
}, "createUserStyles"), aF = /* @__PURE__ */ p((e = "", t, r) => {
  let i = e;
  return !r && !t && (i = i.replace(
    /marker-end="url\([\d+./:=?A-Za-z-]*?#/g,
    'marker-end="url(#'
  )), i = Ur(i), i = i.replace(/<br>/g, "<br/>"), i;
}, "cleanUpSvgCode"), nF = /* @__PURE__ */ p((e = "", t) => {
  const r = t?.viewBox?.baseVal?.height ? t.viewBox.baseVal.height + "px" : KE, i = J0(`<body style="${QE}">${e}</body>`);
  return `<iframe style="width:${VE};height:${r};${ZE}" src="data:text/html;charset=UTF-8;base64,${i}" sandbox="${JE}">
  ${tF}
</iframe>`;
}, "putIntoIFrame"), lf = /* @__PURE__ */ p((e, t, r, i, s) => {
  const o = e.append("div");
  o.attr("id", r), i && o.attr("style", i);
  const a = o.append("svg").attr("id", t).attr("width", "100%").attr("xmlns", XE);
  return s && a.attr("xmlns:xlink", s), a.append("g"), e;
}, "appendDivSvgG");
function Gl(e, t) {
  return e.append("iframe").attr("id", t).attr("style", "width: 100%; height: 100%;").attr("sandbox", "");
}
p(Gl, "sandboxedIframe");
var lF = /* @__PURE__ */ p((e, t, r, i) => {
  e.getElementById(t)?.remove(), e.getElementById(r)?.remove(), e.getElementById(i)?.remove();
}, "removeExistingElements"), hF = /* @__PURE__ */ p(async function(e, t, r) {
  Wa();
  const i = mc(t);
  t = i.code;
  const s = jt();
  $.debug(s), t.length > (s?.maxTextSize ?? zE) && (t = HE);
  const o = `#${e}`, a = "i" + e, n = "#" + a, l = "d" + e, c = "#" + l, h = /* @__PURE__ */ p(() => {
    const U = vt(d ? n : c).node();
    U && "remove" in U && U.remove();
  }, "removeTempElements");
  let u = vt(document.body);
  const d = s.securityLevel === YE, f = s.securityLevel === UE, m = s.fontFamily;
  if (r !== void 0) {
    if (r && (r.innerHTML = ""), d) {
      const Y = Gl(vt(r), a);
      u = vt(Y.nodes()[0].contentDocument.body), u.node().style.margin = "0";
    } else
      u = vt(r);
    lf(u, e, l, `font-family: ${m}`, jE);
  } else {
    if (lF(document, e, l, a), d) {
      const Y = Gl(vt(document.body), a);
      u = vt(Y.nodes()[0].contentDocument.body), u.node().style.margin = "0";
    } else
      u = vt("body");
    lf(u, e, l);
  }
  let y, x;
  try {
    y = await jl.fromText(t, { title: i.title });
  } catch (Y) {
    if (s.suppressErrorRendering)
      throw h(), Y;
    y = await jl.fromText("error"), x = Y;
  }
  const C = u.select(c).node(), b = y.type, w = C.firstChild, _ = w.firstChild, B = y.renderer.getClasses?.(t, y), A = oF(s, b, B, o), v = document.createElement("style");
  v.innerHTML = A, w.insertBefore(v, _);
  try {
    await y.renderer.draw(t, e, "11.17.2", y);
  } catch (Y) {
    throw s.suppressErrorRendering ? h() : gA.draw(t, e, "11.17.2"), Y;
  }
  const L = u.select(`${c} svg`), W = y.db.getAccTitle?.(), H = y.db.getAccDescription?.();
  ix(b, L, W, H);
  const st = (/* @__PURE__ */ p(() => {
    u.select(`[id="${e}"]`).selectAll("foreignobject > *").attr("xmlns", GE);
    let Y = u.select(c).node().innerHTML;
    if ($.debug("config.arrowMarkerAbsolute", s.arrowMarkerAbsolute), Y = aF(Y, d, ur(s.arrowMarkerAbsolute)), d) {
      const U = u.select(c + " svg").node();
      Y = nF(Y, U);
    } else f || (Y = ts.sanitize(Y, {
      ADD_TAGS: eF,
      ADD_ATTR: rF,
      HTML_INTEGRATION_POINTS: { foreignobject: !0 }
    }));
    return RE(), Y;
  }, "serializeSvg"))();
  if (x)
    throw x;
  return h(), {
    diagramType: b,
    svg: st,
    bindFunctions: y.db.bindFunctions
  };
}, "render");
function ex(e = {}) {
  const t = ae({}, e);
  t?.fontFamily && !t.themeVariables?.fontFamily && (t.themeVariables || (t.themeVariables = {}), t.themeVariables.fontFamily = t.fontFamily), lk(t), t?.theme && t.theme in Tr ? t.themeVariables = Tr[t.theme].getThemeVariables(
    t.themeVariables
  ) : t && (t.themeVariables = Tr.default.getThemeVariables(t.themeVariables));
  const r = typeof t == "object" ? nk(t) : Gf();
  rh(r.logLevel), Wa();
}
p(ex, "initialize");
var rx = /* @__PURE__ */ p((e, t = {}) => {
  const { code: r } = gc(e);
  return jl.fromText(r, t);
}, "getDiagramFromText");
function ix(e, t, r, i) {
  K0(t, e), Z0(t, r, i, t.attr("id"));
}
p(ix, "addA11yInfo");
var gi = Object.freeze({
  render: hF,
  parse: tx,
  getDiagramFromText: rx,
  initialize: ex,
  getConfig: jt,
  /**
   * @deprecated This function does nothing. It will be overwritten by the next
   *             call to {@link render} or {@link parse}.
   */
  setConfig: Vf,
  getSiteConfig: Gf,
  updateSiteConfig: hk,
  reset: /* @__PURE__ */ p(() => {
    Zo();
  }, "reset"),
  globalReset: /* @__PURE__ */ p(() => {
    Zo(es);
  }, "globalReset"),
  defaultConfig: es
});
rh(jt().logLevel);
Zo(jt());
var cF = /* @__PURE__ */ p((e, t, r) => {
  $.warn(e), Ah(e) ? (r && r(e.str, e.hash), t.push({ ...e, message: e.str, error: e })) : (r && r(e), e instanceof Error && t.push({
    str: e.message,
    message: e.message,
    hash: e.name,
    error: e
  }));
}, "handleError"), sx = /* @__PURE__ */ p(async function(e = {
  querySelector: ".mermaid"
}) {
  try {
    await uF(e);
  } catch (t) {
    if (Ah(t) && $.error(t.str), vr.parseError && vr.parseError(t), !e.suppressErrors)
      throw $.error("Use the suppressErrors option to suppress these errors"), t;
  }
}, "run"), uF = /* @__PURE__ */ p(async function({ postRenderCallback: e, querySelector: t, nodes: r } = {
  querySelector: ".mermaid"
}) {
  const i = gi.getConfig();
  $.debug(`${e ? "" : "No "}Callback function found`);
  let s;
  if (r)
    s = r;
  else if (t)
    s = document.querySelectorAll(t);
  else
    throw new Error("Nodes and querySelector are both undefined");
  $.debug(`Found ${s.length} diagrams`), i?.startOnLoad !== void 0 && ($.debug("Start On Load: " + i?.startOnLoad), gi.updateSiteConfig({ startOnLoad: i?.startOnLoad }));
  const o = new me.InitIDGenerator(i.deterministicIds, i.deterministicIDSeed);
  let a;
  const n = [];
  for (const l of Array.from(s)) {
    if ($.info("Rendering diagram: " + l.id), l.getAttribute("data-processed"))
      continue;
    l.setAttribute("data-processed", "true");
    const c = `mermaid-${o.next()}`;
    a = l.innerHTML, a = Mg(me.entityDecode(a)).trim().replace(/<br\s*\/?>/gi, "<br/>");
    const h = me.detectInit(a);
    h && $.debug("Detected early reinit: ", h);
    try {
      const { svg: u, bindFunctions: d } = await lx(c, a, l);
      l.innerHTML = u, e && await e(c), d && d(l);
    } catch (u) {
      cF(u, n, vr.parseError);
    }
  }
  if (n.length > 0)
    throw n[0];
}, "runThrowsErrors"), ox = /* @__PURE__ */ p(function(e) {
  gi.initialize(e);
}, "initialize"), dF = /* @__PURE__ */ p(async function(e, t, r) {
  $.warn("mermaid.init is deprecated. Please use run instead."), e && ox(e);
  const i = { postRenderCallback: r, querySelector: ".mermaid" };
  typeof t == "string" ? i.querySelector = t : t && (t instanceof HTMLElement ? i.nodes = [t] : i.nodes = t), await sx(i);
}, "init"), fF = /* @__PURE__ */ p(async (e, {
  lazyLoad: t = !0
} = {}) => {
  Wa(), ul(...e), t === !1 && await IE();
}, "registerExternalDiagrams"), ax = /* @__PURE__ */ p(function() {
  if (vr.startOnLoad) {
    const { startOnLoad: e } = gi.getConfig();
    e && vr.run().catch((t) => $.error("Mermaid failed to initialize", t));
  }
}, "contentLoaded");
typeof document < "u" && window.addEventListener("load", ax, !1);
var pF = /* @__PURE__ */ p(function(e) {
  vr.parseError = e;
}, "setParseErrorHandler"), Ca = [], el = !1, nx = /* @__PURE__ */ p(async () => {
  if (!el) {
    for (el = !0; Ca.length > 0; ) {
      const e = Ca.shift();
      if (e)
        try {
          await e();
        } catch (t) {
          $.error("Error executing queue", t);
        }
    }
    el = !1;
  }
}, "executeQueue"), gF = /* @__PURE__ */ p(async (e, t) => new Promise((r, i) => {
  const s = /* @__PURE__ */ p(() => new Promise((o, a) => {
    gi.parse(e, t).then(
      (n) => {
        o(n), r(n);
      },
      (n) => {
        $.error("Error parsing", n), vr.parseError?.(n), a(n), i(n);
      }
    );
  }), "performCall");
  Ca.push(s), nx().catch(i);
}), "parse"), lx = /* @__PURE__ */ p((e, t, r) => new Promise((i, s) => {
  const o = /* @__PURE__ */ p(() => new Promise((a, n) => {
    gi.render(e, t, r).then(
      (l) => {
        a(l), i(l);
      },
      (l) => {
        $.error("Error parsing", l), vr.parseError?.(l), n(l), s(l);
      }
    );
  }), "performCall");
  Ca.push(o), nx().catch(s);
}), "render"), mF = /* @__PURE__ */ p(() => Object.keys(ui).map((e) => ({
  id: e
})), "getRegisteredDiagramsMetadata"), vr = {
  startOnLoad: !0,
  mermaidAPI: gi,
  parse: gF,
  render: lx,
  init: dF,
  run: sx,
  registerExternalDiagrams: fF,
  registerLayoutLoaders: s0,
  initialize: ox,
  parseError: void 0,
  contentLoaded: ax,
  setParseErrorHandler: pF,
  detectType: ih,
  registerIconPacks: US,
  getRegisteredDiagramsMetadata: mF
}, rl = vr;
const Mt = (e) => e.replace(/\s*!important\s*$/i, "").trim(), yF = (e, t) => {
  let r = t;
  for (; r < e.length && /\s/.test(e[r]); )
    r += 1;
  const i = r;
  for (; r < e.length && /[a-z-]/i.test(e[r]); )
    r += 1;
  if (r === i)
    return !1;
  for (; r < e.length && /\s/.test(e[r]); )
    r += 1;
  return e[r] === ":";
}, qe = (e) => {
  const t = [];
  let r = 0;
  for (; r < e.length; ) {
    for (; r < e.length && /[\s;,]/.test(e[r]); )
      r += 1;
    if (r >= e.length)
      break;
    const i = r;
    for (; r < e.length && e[r] !== ":" && !(e[r] === ";" || e[r] === ","); )
      r += 1;
    if (r >= e.length || e[r] !== ":")
      break;
    const s = e.substring(i, r).trim().toLowerCase();
    r += 1;
    const o = r;
    let a = 0, n = null;
    for (; r < e.length; ) {
      const c = e[r];
      if (n) {
        c === n && e[r - 1] !== "\\" && (n = null), r += 1;
        continue;
      }
      if (c === '"' || c === "'") {
        n = c, r += 1;
        continue;
      }
      if (c === "(") {
        a += 1, r += 1;
        continue;
      }
      if (c === ")") {
        a = Math.max(0, a - 1), r += 1;
        continue;
      }
      if (a === 0 && (c === ";" || c === "," || /\s/.test(c) && yF(e, r)))
        break;
      r += 1;
    }
    const l = Mt(e.substring(o, r));
    s && l && t.push({ property: s, value: l }), r < e.length && (e[r] === ";" || e[r] === ",") && (r += 1);
  }
  return t;
}, We = (e) => {
  const t = Mt(e);
  if (!t)
    return !1;
  if (typeof CSS < "u" && typeof CSS.supports == "function")
    return CSS.supports("color", t);
  if (typeof document < "u") {
    const r = document.createElement("div");
    return r.style.color = "", r.style.color = t, r.style.color !== "";
  }
  return !1;
}, hf = (e, t) => {
  const r = e.getAttribute("style");
  return r && qe(r).find((i) => i.property === t)?.value || "";
}, il = (...e) => {
  for (const t of e) {
    const r = Mt(t || "");
    if (We(r))
      return r;
  }
}, yc = (e, t) => {
  const r = e.querySelector("text, foreignObject, div, span, p") || e, i = il(r.getAttribute?.("fill"), hf(r, "fill"), r.style?.fill);
  if (i)
    return i;
  const s = il(r.getAttribute?.("color"), hf(r, "color"), r.style?.color);
  if (s)
    return s;
  const o = il(t);
  if (o)
    return o;
}, xc = (e, t, r) => {
  switch (t) {
    case qt.FILL:
    case qt.STROKE:
      We(r) && (e[t] = r);
      break;
    case qt.STROKE_WIDTH:
    case qt.STROKE_DASHARRAY:
      e[t] = r;
      break;
  }
}, ba = (e, t, r) => {
  t === be.COLOR && We(r) && (e[be.COLOR] = r);
}, ka = (e, t, r) => {
  e && qe(e).forEach(({ property: i, value: s }) => {
    xc(t, i, s), ba(r, i, s);
  });
}, hx = (e, t) => {
  e && qe(e).forEach(({ property: r, value: i }) => {
    if (r === "fill" && We(i)) {
      t[be.COLOR] = i;
      return;
    }
    ba(t, r, i);
  });
}, cx = (e, t) => {
  if (!e)
    return;
  [
    [qt.FILL, e.getAttribute("fill")],
    [qt.STROKE, e.getAttribute("stroke")],
    [
      qt.STROKE_WIDTH,
      e.getAttribute("stroke-width")
    ],
    [
      qt.STROKE_DASHARRAY,
      e.getAttribute("stroke-dasharray")
    ]
  ].forEach(([i, s]) => {
    const o = Mt(s || "");
    o && xc(t, i, o);
  });
}, ux = (e, t) => {
  if (!e)
    return;
  const r = e.getAttribute("fill") || e.getAttribute("color"), i = Mt(r || "");
  We(i) && (t[be.COLOR] = i);
}, Vl = (e, t, r, i) => {
  if (!(t instanceof Map))
    return;
  const s = t.get(e);
  s && (s.styles?.forEach((o) => {
    qe(o).forEach(({ property: a, value: n }) => {
      xc(r, a, n), ba(i, a, n);
    });
  }), s.textStyles?.forEach((o) => {
    qe(o).forEach(({ property: a, value: n }) => {
      ba(i, a, n);
    });
  }));
}, xF = (e, t, r) => {
  const i = e.nodes.map((d) => d.startsWith("flowchart-") ? d.split("-")[1] : d), s = t.querySelector(`[id='${e.id}']`);
  if (!s)
    throw new Error("SubGraph element not found");
  const o = Cc(s, t), a = s.getBBox(), n = {
    width: a.width,
    height: a.height
  }, l = {}, c = {}, h = s.querySelector(":scope > rect, :scope > path, :scope > polygon, :scope > ellipse") || s.querySelector(".cluster > rect, .cluster > path, .cluster > polygon, .cluster > ellipse") || s.querySelector("rect, path, polygon, ellipse");
  ka(s.getAttribute("style"), l, c), ka(h?.getAttribute("style"), l, c), cx(h, l);
  const u = s.querySelector(".cluster-label text, .cluster-label tspan") || s.querySelector("text");
  return hx(u?.getAttribute("style"), c), ux(u, c), Vl(e.id, r, l, c), e.classes?.forEach((d) => {
    Vl(d, r, l, c);
  }), {
    id: e.id,
    nodeIds: i,
    text: Ae(e.title),
    labelType: "text",
    ...o,
    ...n,
    containerStyle: l,
    labelStyle: c
  };
}, cf = (e, t, r) => {
  const i = t.querySelector(`[id*="${e.domId}"]`);
  if (!i)
    return;
  let s;
  i.parentElement?.tagName.toLowerCase() === "a" && (s = i.parentElement.getAttribute("xlink:href"));
  const o = Cc(s ? i.parentElement : i, t), a = i.getBBox(), n = {
    width: a.width,
    height: a.height
  }, l = {}, c = {};
  e.classes && r instanceof Map && (Array.isArray(e.classes) ? e.classes : [e.classes]).forEach((d) => {
    Vl(d, r, l, c);
  }), e.styles?.forEach((d) => {
    ka(d, l, c);
  });
  const h = i.querySelector(".label-container");
  return ka(h?.getAttribute("style"), l, c), cx(h, l), Array.from(i.querySelectorAll(".label, .nodeLabel, .label text, .label tspan, .label span, .label div")).forEach((d) => {
    hx(d.getAttribute("style"), c), ux(d, c);
  }), {
    id: e.id,
    labelType: e.labelType,
    text: Ae(e.text || ""),
    type: e.type,
    link: s || void 0,
    ...o,
    ...n,
    containerStyle: l,
    labelStyle: c
  };
}, CF = (e, t, r) => {
  const i = r.querySelector(`[id*="${e.id}"]`);
  if (!i)
    throw new Error("Edge element not found");
  const s = Cc(i, r), o = $f(i, s);
  return e.length = void 0, {
    ...e,
    ...o,
    text: Ae(e.text)
  };
}, Cc = (e, t) => {
  if (!e)
    throw new Error("Element not found");
  let r = e.parentElement?.parentElement;
  const i = e.childNodes[0];
  let s = { x: 0, y: 0 };
  if (i) {
    const { transformX: l, transformY: c } = ni(i), h = i.getBBox();
    s = {
      x: Number(i.getAttribute("x")) || l + h.x || 0,
      y: Number(i.getAttribute("y")) || c + h.y || 0
    };
  }
  const { transformX: o, transformY: a } = ni(e), n = {
    x: o + s.x,
    y: a + s.y
  };
  for (; r && r.id !== t.id; ) {
    if (r.classList.value === "root" && r.hasAttribute("transform")) {
      const { transformX: l, transformY: c } = ni(r);
      n.x += l, n.y += c;
    }
    r = r.parentElement;
  }
  return n;
}, bF = (e, t) => {
  const r = e.getVertices(), i = e.getEdges(), s = e.getSubGraphs(), o = e.getClasses(), a = {}, n = o instanceof Map ? o : {};
  r instanceof Map ? r.forEach((u, d) => {
    a[d] = cf(u, t, n);
  }) : typeof r == "object" && r !== null && Object.entries(r).forEach(([u, d]) => {
    a[u] = cf(d, t, n);
  });
  const l = /* @__PURE__ */ new Map(), c = (Array.isArray(i) ? i : []).map((u) => {
    if (!t.querySelector(`[id*="${u.id}"]`))
      return null;
    const d = `${u.start}-${u.end}`, f = l.get(d) || 0;
    return l.set(d, f + 1), CF(u, f, t);
  }).filter((u) => u !== null && u.reflectionPoints.length > 1);
  return {
    type: "flowchart",
    subGraphs: (Array.isArray(s) ? s : []).map((u) => xF(u, t, n)),
    vertices: a,
    edges: c
  };
}, kF = (e, t) => {
  const r = {};
  t?.label && (r.label = { text: Ae(t.label), fontSize: 16 });
  const i = e.tagName;
  if (i === "line")
    r.startX = Number(e.getAttribute("x1")), r.startY = Number(e.getAttribute("y1")), r.endX = Number(e.getAttribute("x2")), r.endY = Number(e.getAttribute("y2"));
  else if (i === "path") {
    const a = e.getAttribute("d");
    if (!a)
      throw new Error('Path element does not contain a "d" attribute');
    const n = a.split(/(?=[LC])/), l = n[0].substring(1).split(",").map((u) => parseFloat(u)), c = [];
    n.forEach((u) => {
      const d = u.substring(1).trim().split(" ").map((f) => {
        const [m, y] = f.split(",");
        return [
          parseFloat(m) - l[0],
          parseFloat(y) - l[1]
        ];
      });
      c.push(...d);
    });
    const h = c[c.length - 1];
    r.startX = l[0], r.startY = l[1], r.endX = h[0], r.endY = h[1], r.points = c;
  }
  t?.label && (r.startY = r.startY - 10, r.endY = r.endY - 10);
  const s = e.getAttribute("stroke"), o = (s && s !== "none" ? s : "") || getComputedStyle(e).stroke || "";
  return r.strokeColor = o ? Mt(o) : null, r.strokeWidth = Number(e.getAttribute("stroke-width")), r.type = "arrow", r.strokeStyle = t?.strokeStyle || "solid", r.startArrowhead = t?.startArrowhead || null, r.endArrowhead = t?.endArrowhead || null, r;
}, bc = (e, t, r, i, s) => {
  const o = {};
  return o.type = "arrow", o.startX = e, o.startY = t, o.endX = r, o.endY = i, Object.assign(o, { ...s }), o;
}, wa = (e, t, r, i) => ({
  type: "text",
  x: e,
  y: t,
  text: r,
  width: i?.width || 20,
  height: i?.height || 20,
  fontSize: i?.fontSize || ro,
  id: i?.id,
  color: i?.color,
  groupId: i?.groupId,
  metadata: i?.metadata
}), dx = (e, t, r) => {
  const i = {}, s = Number(e.getAttribute("x")), o = Number(e.getAttribute("y"));
  i.type = "text", i.text = Ae(t), r?.id && (i.id = r.id), r?.groupId && (i.groupId = r.groupId);
  const a = e.getBBox();
  i.width = a.width, i.height = a.height, i.x = s - a.width / 2, i.y = o;
  const n = parseInt(getComputedStyle(e).fontSize);
  return i.fontSize = n, i.color = yc(e), i;
}, Lr = (e, t, r = {}) => {
  const i = {};
  i.type = t;
  const { label: s, subtype: o, id: a, groupId: n } = r;
  i.id = a, n && (i.groupId = n), s && (i.label = {
    text: Ae(s.text),
    fontSize: 16,
    textAlign: s?.textAlign,
    verticalAlign: s?.verticalAlign
  });
  const l = e.getBBox();
  switch (i.x = l.x, i.y = l.y, i.width = l.width, i.height = l.height, i.subtype = o, o) {
    case "highlight":
      const c = e.getAttribute("fill");
      c && (i.bgColor = Mt(c));
      break;
    case "note":
      i.strokeStyle = "dashed";
      break;
  }
  return i;
}, eo = (e, t, r, i, s, o) => {
  const a = {};
  a.startX = t, a.startY = r, a.endX = i, o?.groupId && (a.groupId = o.groupId), o?.id && (a.id = o.id), a.endY = s;
  const n = e.getAttribute("stroke");
  return a.strokeColor = n ? Mt(n) : null, a.strokeWidth = Number(e.getAttribute("stroke-width")), a.type = "line", a;
}, uf = {
  0: "SOLID",
  1: "DOTTED",
  3: "SOLID_CROSS",
  4: "DOTTED_CROSS",
  5: "SOLID_OPEN",
  6: "DOTTED_OPEN",
  24: "SOLID_POINT",
  25: "DOTTED_POINT"
}, sr = {
  SOLID: 0,
  DOTTED: 1,
  NOTE: 2,
  SOLID_CROSS: 3,
  DOTTED_CROSS: 4,
  SOLID_OPEN: 5,
  DOTTED_OPEN: 6,
  SOLID_POINT: 24,
  DOTTED_POINT: 25,
  CRITICAL_START: 27
}, wF = (e) => {
  let t;
  switch (e) {
    case sr.SOLID:
    case sr.SOLID_CROSS:
    case sr.SOLID_OPEN:
    case sr.SOLID_POINT:
      t = "solid";
      break;
    case sr.DOTTED:
    case sr.DOTTED_CROSS:
    case sr.DOTTED_OPEN:
    case sr.DOTTED_POINT:
      t = "dotted";
      break;
    default:
      t = "solid";
      break;
  }
  return t;
}, SF = (e, t) => {
  if (!!e.nextElementSibling?.classList.contains("sequenceNumber")) {
    const i = e.nextElementSibling?.textContent;
    if (!i)
      throw new Error("sequence number not present");
    const s = 30, o = s / 2, n = {
      type: "rectangle",
      x: t.startX - 10,
      y: t.startY - o,
      label: { text: i, fontSize: 14 },
      bgColor: "#e9ecef",
      height: s,
      subtype: "sequence"
    };
    Object.assign(t, { sequenceNumber: n });
  }
}, df = (e, t, r) => {
  if (!e)
    throw "root node not found";
  const i = Re(), s = Array.from(e.children), o = [];
  return s.forEach((a, n) => {
    const l = `${r?.id}-${n}`;
    let c;
    switch (a.tagName) {
      case "line":
        const h = Number(a.getAttribute("x1")), u = Number(a.getAttribute("y1")), d = Number(a.getAttribute("x2")), f = Number(a.getAttribute("y2"));
        c = eo(a, h, u, d, f, { groupId: i, id: l });
        break;
      case "text":
        c = dx(a, t, {
          groupId: i,
          id: l
        });
        break;
      case "circle":
        c = Lr(a, "ellipse", {
          label: a.textContent ? { text: a.textContent } : void 0,
          groupId: i,
          id: l
        });
      default:
        c = Lr(a, nC[a.tagName], {
          label: a.textContent ? { text: a.textContent } : void 0,
          groupId: i,
          id: l
        });
    }
    o.push(c);
  }), o;
}, ff = (e, t) => {
  const r = t.getAttribute("fill"), i = t.getAttribute("stroke"), s = t.getAttribute("stroke-width"), o = t.getAttribute("stroke-dasharray");
  r && r !== "none" && (e.bgColor = Mt(r)), i && i !== "none" && (e.strokeColor = Mt(i)), s && (e.strokeWidth = Number(s)), o && o.trim() && (e.strokeStyle = "dashed");
}, TF = (e, t) => {
  const r = Array.from(t.querySelectorAll(".actor-top")), i = Array.from(t.querySelectorAll(".actor-bottom")), s = [], o = [], a = {}, n = e instanceof Map ? Array.from(e.values()) : Object.values(e), l = Array.from(t.querySelectorAll(".actor-line")), c = (h, u) => {
    const d = h.name, f = l.find((y) => y.getAttribute("name") === d);
    if (f)
      return f;
    const m = h.type === "participant" ? u.parentElement?.previousElementSibling : u.previousElementSibling;
    return m ? m.tagName === "line" ? m : m.querySelector("line") : null;
  };
  return n.forEach((h) => {
    const u = r.find((m) => m.getAttribute("name") === h.name), d = i.find((m) => m.getAttribute("name") === h.name);
    if (!u || !d)
      throw "root not found";
    const f = h.description;
    if (h.type === "participant") {
      const m = Lr(u, "rectangle", { id: `${h.name}-top`, label: { text: f }, subtype: "actor" });
      if (ff(m, u), !m)
        throw "Top Node element not found!";
      s.push([m]);
      const y = Lr(d, "rectangle", { id: `${h.name}-bottom`, label: { text: f }, subtype: "actor" });
      a[h.name] = {
        topId: `${h.name}-top`,
        bottomId: `${h.name}-bottom`,
        bindType: "rectangle"
      }, ff(y, d), s.push([y]);
      const x = c(h, u);
      if (x?.tagName !== "line")
        throw "Line not found";
      const C = Number(x.getAttribute("x1"));
      if (!m.height)
        throw "Top node element height is null";
      const b = m.y + m.height, w = y.y, _ = Number(x.getAttribute("x2")), B = eo(x, C, b, _, w);
      o.push(B);
    } else if (h.type === "actor") {
      const m = df(u, f, {
        id: `${h.name}-top`
      });
      s.push(m);
      const y = df(d, f, {
        id: `${h.name}-bottom`
      });
      s.push(y);
      const x = c(h, u);
      if (x?.tagName !== "line")
        throw "Line not found";
      const C = Number(x.getAttribute("x1")), b = Number(x.getAttribute("y1")), w = Number(x.getAttribute("x2")), _ = y.find((v) => v.type === "ellipse");
      if (_) {
        const v = _.y, L = eo(x, C, b, w, v);
        o.push(L);
      }
      const B = m.find((v) => v.type === "ellipse"), A = y.find((v) => v.type === "ellipse");
      B?.id && A?.id && (a[h.name] = {
        topId: B.id,
        bottomId: A.id,
        bindType: "ellipse"
      });
    }
  }), { nodes: s, lines: o, actorMap: a };
}, _F = (e, t, r) => {
  const i = [], s = Array.from(t.querySelectorAll('[class*="messageLine"]')), o = Object.keys(uf), a = e.filter((n) => o.includes(n.type.toString()));
  return s.forEach((n, l) => {
    const c = a[l], h = uf[c.type], u = kF(n, {
      label: c?.message,
      strokeStyle: wF(c.type),
      endArrowhead: h === "SOLID_OPEN" || h === "DOTTED_OPEN" ? null : "arrow"
    }), d = r[c.from], f = r[c.to];
    d?.topId && f?.topId && (u.start = { type: d.bindType || "rectangle", id: d.topId }, u.end = { type: f.bindType || "rectangle", id: f.topId }), SF(n, u), i.push(u);
  }), i;
}, BF = (e, t) => {
  const r = Array.from(t.querySelectorAll(".note")).map((o) => o.parentElement), i = e.filter((o) => o.type === sr.NOTE), s = [];
  return r.forEach((o, a) => {
    if (!o)
      return;
    const n = o.firstChild, l = i[a].message, c = Lr(n, "rectangle", {
      label: { text: l },
      subtype: "note"
    }), h = n.getAttribute("fill"), u = n.getAttribute("stroke"), d = n.getAttribute("stroke-width"), f = n.getAttribute("stroke-dasharray");
    h && h !== "none" && (c.bgColor = Mt(h)), u && u !== "none" && (c.strokeColor = Mt(u)), d && (c.strokeWidth = Number(d)), f && f.trim() && (c.strokeStyle = "dashed"), s.push(c);
  }), s;
}, vF = (e) => {
  const t = Array.from(e.querySelectorAll("[class*=activation]")), r = [];
  return t.forEach((i) => {
    const s = Lr(i, "rectangle", {
      label: { text: "" },
      subtype: "activation"
    });
    (() => {
      const a = i.getAttribute("fill"), n = i.getAttribute("stroke"), l = i.getAttribute("stroke-width"), c = i.getAttribute("stroke-dasharray");
      a && a !== "none" && (s.bgColor = Mt(a)), n && n !== "none" && (s.strokeColor = Mt(n)), l && (s.strokeWidth = Number(l)), c && c.trim() && (s.strokeStyle = "dashed");
    })(), r.push(s);
  }), r;
}, LF = (e, t) => {
  const r = Array.from(t.querySelectorAll(".loopLine")), i = [], s = [], o = [];
  r.forEach((h) => {
    const u = Number(h.getAttribute("x1")), d = Number(h.getAttribute("y1")), f = Number(h.getAttribute("x2")), m = Number(h.getAttribute("y2")), y = eo(h, u, d, f, m);
    y.strokeStyle = "dotted", y.strokeColor = "#adb5bd", y.strokeWidth = 2, i.push(y);
  });
  const a = Array.from(t.querySelectorAll(".loopText")), n = e.filter((h) => h.type === sr.CRITICAL_START).map((h) => h.message);
  a.forEach((h) => {
    const u = h.textContent || "", d = dx(h, u), f = u.match(/\[(.*?)\]/)?.[1] || "";
    n.includes(f) && (d.x += 16), s.push(d);
  });
  const l = Array.from(t?.querySelectorAll(".labelBox")), c = Array.from(t?.querySelectorAll(".labelText"));
  return l.forEach((h, u) => {
    const d = c[u]?.textContent || "", f = Lr(h, "rectangle", {
      label: { text: d }
    });
    f.strokeColor = "#adb5bd", f.bgColor = "#e9ecef", f.width = void 0, o.push(f);
  }), { lines: i, texts: s, nodes: o };
}, AF = (e) => {
  const t = Array.from(e.querySelectorAll(".rect")).filter((i) => i.parentElement?.tagName !== "g"), r = [];
  return t.forEach((i) => {
    const s = Lr(i, "rectangle", {
      label: { text: "" },
      subtype: "highlight"
    });
    r.push(s);
  }), r;
}, EF = (e, t) => {
  const r = e.db, i = [], o = r.getBoxes().map((x) => ({
    ...x,
    fill: Mt(x.fill || "")
  })), a = AF(t), n = r.getActors(), { nodes: l, lines: c, actorMap: h } = TF(n, t), u = r.getMessages(), d = _F(u, t, h), f = BF(u, t), m = vF(t), y = LF(u, t);
  return i.push(a), i.push(...l), i.push(f), i.push(m), { type: "sequence", lines: c, arrows: d, nodes: i, loops: y, groups: o };
}, FF = (e) => {
  const t = {};
  return e && e.forEach((r) => {
    qe(r).forEach(({ property: i, value: s }) => {
      i && s && (t[i] = Mt(s));
    });
  }), t;
}, Io = {
  AGGREGATION: 0,
  EXTENSION: 1,
  COMPOSITION: 2,
  DEPENDENCY: 3
}, pf = {
  LINE: 0,
  DOTTED_LINE: 1
}, gf = 16, MF = (e) => {
  let t;
  switch (e) {
    case pf.LINE:
      t = "solid";
      break;
    case pf.DOTTED_LINE:
      t = "dotted";
      break;
    default:
      t = "solid";
  }
  return t;
}, mf = (e) => {
  let t;
  switch (e) {
    case Io.AGGREGATION:
      t = "diamond_outline";
      break;
    case Io.COMPOSITION:
      t = "diamond";
      break;
    case Io.EXTENSION:
      t = "triangle_outline";
      break;
    case "none":
      t = null;
      break;
    case Io.DEPENDENCY:
    default:
      t = "arrow";
      break;
  }
  return t;
}, sl = (e, t) => {
  let r = 0, i = 0, s = e;
  for (; s && s !== t; ) {
    const { transformX: o, transformY: a } = ni(s);
    r += o, i += a, s = s.parentElement;
  }
  return { tx: r, ty: i };
}, yf = /* @__PURE__ */ new Set([
  "triangle_outline",
  "diamond",
  "diamond_outline"
]), fx = (e, t = 0.5) => {
  if (e.length <= 2)
    return [...e];
  const r = [e[0]];
  for (let i = 1; i < e.length - 1; i++) {
    const s = r[r.length - 1], o = e[i], a = e[i + 1], n = a.x - s.x, l = a.y - s.y, c = Math.hypot(n, l);
    if (!c)
      continue;
    const u = Math.abs(n * (o.y - s.y) - l * (o.x - s.x)) / c, d = ((o.x - s.x) * n + (o.y - s.y) * l) / (c * c);
    u <= t && d >= -t && d <= 1 + t || r.push(o);
  }
  return r.push(e[e.length - 1]), r;
}, px = (e) => {
  const t = th(Of(e).map((i) => [i.x, i.y])).map(([i, s]) => ({ x: i, y: s })), r = eh(e);
  return r && t.length >= 2 && (t[0] = {
    x: r.startX,
    y: r.startY
  }, t[t.length - 1] = {
    x: r.endX,
    y: r.endY
  }), fx(t);
}, xf = (e, t, r) => {
  const i = e.x - t.x, s = e.y - t.y, o = Math.hypot(i, s);
  return o ? {
    x: e.x + i / o * r,
    y: e.y + s / o * r
  } : e;
}, OF = (e, t) => {
  const r = th(t.map((o) => [o.x, o.y])).map(([o, a]) => ({ x: o, y: a }));
  if (r.length < 2)
    throw new Error("Arrow route must contain at least two points");
  const i = r[0], s = r[r.length - 1];
  e.startX = i.x, e.startY = i.y, e.endX = s.x, e.endY = s.y, e.points = r.map((o) => [
    o.x - i.x,
    o.y - i.y
  ]);
}, $F = (e) => {
  const t = e.points?.map(([o, a]) => ({ x: e.startX + o, y: e.startY + a })).filter((o) => Number.isFinite(o.x) && Number.isFinite(o.y));
  if (!t || t.length < 2)
    return e;
  const r = [...t], i = !!e.startArrowhead && yf.has(e.startArrowhead), s = !!e.endArrowhead && yf.has(e.endArrowhead);
  if (!i && !s)
    return e;
  if (i && (r[0] = xf(r[0], r[1], gf)), s) {
    const o = r.length - 1;
    r[o] = xf(r[o], r[o - 1], gf);
  }
  return OF(e, r), e;
}, IF = (e, t) => {
  const r = Mt(e.getAttribute("stroke") || getComputedStyle(e).stroke || ""), i = parseFloat(e.getAttribute("stroke-width") || getComputedStyle(e).strokeWidth || "1");
  We(r) && r !== "none" && (t.strokeColor = r), Number.isFinite(i) && i > 0 && (t.strokeWidth = i);
}, DF = (e) => {
  const t = [];
  return e.forEach((r) => {
    px(r).forEach((i) => {
      const s = t[t.length - 1];
      s && s.x === i.x && s.y === i.y || t.push(i);
    });
  }), fx(t);
}, gx = (e, t, r) => {
  if (e.length < 2)
    throw new Error(`Class diagram edge ${t?.id || "<unknown>"} is missing usable path points`);
  const i = e[0], s = e[e.length - 1], o = bc(i.x, i.y, s.x, s.y, {
    id: t?.getAttribute("data-id") || t?.id || void 0,
    ...r,
    points: e.map((a) => [
      a.x - i.x,
      a.y - i.y
    ])
  });
  return t && IF(t, o), $F(o);
}, mx = (e, t) => gx(DF(e), e[0], t), RF = (e, t) => {
  const r = px(e);
  return gx([r[0], r[r.length - 1]], e, t);
}, PF = (e, t) => mx([e], t), NF = (e, t) => [
  `${e}-cyclic-special-1`,
  `${e}-cyclic-special-mid`,
  `${e}-cyclic-special-2`
].map((i) => t.querySelector(`path[id="${i}"][data-edge="true"]`)).filter((i) => i !== null), qF = (e) => e.points?.map(([t, r]) => ({ x: e.startX + t, y: e.startY + r })).filter((t) => Number.isFinite(t.x) && Number.isFinite(t.y)) || [], Cf = (e, t) => {
  const r = qF(e);
  if (r.length < 2)
    return null;
  const i = t === "start", s = i ? r[0] : r[r.length - 1], o = i ? r[1] : r[r.length - 2], a = o.x === s.x ? i ? -1 : 1 : Math.sign(o.x - s.x), n = o.y === s.y ? 1 : Math.sign(o.y - s.y);
  return {
    x: s.x + a * 20,
    y: s.y + (n >= 0 ? 12 : -28)
  };
}, WF = (e, t) => {
  let r = e;
  for (; r && r !== t; ) {
    if (r.classList.contains("annotation-group") || r.classList.contains("label-group"))
      return "header";
    if (r.classList.contains("members-group"))
      return "members";
    if (r.classList.contains("methods-group"))
      return "methods";
    r = r.parentElement;
  }
  return "other";
}, zF = (e, t, r) => {
  const i = [], s = [], o = [];
  return Object.values(e).forEach((a) => {
    const { domId: n, id: l } = a, c = Re(), h = FF(
      // @ts-ignore
      a.styles || a.cssStyles
    );
    let u;
    try {
      u = r ? r(l) : void 0;
    } catch {
      u = void 0;
    }
    const d = (N) => {
      const X = new RegExp(`^classId-${N}(?:-|$)`);
      return Array.from(t.querySelectorAll("[id]")).filter((lt) => X.test(lt.id))[0];
    }, f = u && t.querySelector(`#${u}`) || t.querySelector(`#${n}`) || t.querySelector(`[data-id='${l}']`) || d(l);
    if (!f)
      throw Error(`DOM Node with id ${n} not found`);
    const m = f.querySelector("rect") || f, y = m.getBBox(), { tx: x, ty: C } = sl(m, t), b = {
      type: "rectangle",
      id: l,
      groupId: c,
      x: y.x + x,
      y: y.y + C,
      width: y.width,
      height: y.height,
      metadata: { classId: l }
    }, w = m.getAttribute("fill"), _ = m.getAttribute("stroke"), B = m.getAttribute("stroke-width"), A = m.getAttribute("stroke-dasharray"), v = getComputedStyle(m), L = Mt(w || h.fill || (w ? v.fill : "")), W = Mt(_ || h.stroke || (_ ? v.stroke : "")), H = B || h["stroke-width"] || (B ? v.strokeWidth : ""), D = A || h["stroke-dasharray"] || (A ? v.strokeDasharray === "none" ? "" : v.strokeDasharray : ""), st = (N) => {
      if (!N || !We(N))
        return !1;
      const X = N.toLowerCase();
      return !(X === "none" || X === "transparent" || X === "rgba(0, 0, 0, 0)" || X === "black" || X === "#000" || X === "#000000" || X === "rgb(0, 0, 0)" || X === "rgba(0, 0, 0, 1)");
    };
    st(L) ? b.bgColor = L : b.bgColor = void 0, st(W) ? b.strokeColor = W : b.strokeColor = void 0, H ? b.strokeWidth = Number(H) : b.strokeWidth = void 0, D && D.trim().length > 0 ? b.strokeStyle = "dashed" : b.strokeStyle = void 0, i.push(b), [
      ...Array.from(f.querySelectorAll("line")),
      ...Array.from(f.querySelectorAll("g.divider path"))
    ].forEach((N) => {
      const { tx: X, ty: gt } = sl(N, t);
      let lt, St, It, _t;
      if (N.tagName.toLowerCase() === "line")
        lt = Number(N.getAttribute("x1")) + X, St = Number(N.getAttribute("y1")) + gt, It = Number(N.getAttribute("x2")) + X, _t = Number(N.getAttribute("y2")) + gt;
      else {
        const Bt = N.getBBox();
        lt = Bt.x + X, It = Bt.x + Bt.width + X;
        const ot = Bt.y + Bt.height / 2 + gt;
        St = ot, _t = ot;
      }
      if (lt === It && St === _t)
        return;
      const Et = eo(
        // @ts-ignore
        N,
        lt,
        St,
        It,
        _t,
        {
          groupId: c,
          id: Re()
        }
      );
      b.strokeColor ? Et.strokeColor = b.strokeColor : Et.strokeColor = void 0, b.strokeWidth !== void 0 ? Et.strokeWidth = b.strokeWidth : Et.strokeWidth = void 0, b.strokeStyle ? Et.strokeStyle = b.strokeStyle : Et.strokeStyle = void 0, Et.metadata = { classId: l }, s.push(Et);
    });
    const U = Array.from(f.querySelectorAll("text, foreignObject")), Q = [];
    U.forEach((N) => {
      const X = N.tagName.toLowerCase() === "foreignobject", gt = X ? [] : Array.from(N.querySelectorAll("tspan")), lt = gt.length ? gt.map((Bt) => Bt.textContent?.trim()).filter(Boolean).join(`
`) : N.textContent?.trim() || "";
      if (!lt)
        return;
      const St = N.getBBox(), { ty: It } = sl(N, t);
      let _t = parseFloat(getComputedStyle(N).fontSize || "");
      if (X && (!Number.isFinite(_t) || !_t)) {
        const Bt = N.querySelector("div, span, p");
        Bt && (_t = parseFloat(getComputedStyle(Bt).fontSize || ""));
      }
      (!Number.isFinite(_t) || _t <= 0) && (_t = Math.max(12, St.height * 0.6)), _t = _t * 0.9;
      const Et = yc(N, h.color);
      Q.push({
        section: WF(N, f),
        text: Ae(lt),
        x: St.x,
        y: St.y + It,
        width: b && b.width ? Math.max(b.width - 8, St.width) : St.width,
        height: St.height,
        fontSize: _t,
        color: Et
      });
    });
    const I = Q.filter((N) => N.section === "header").sort((N, X) => N.y - X.y || N.x - X.x);
    if (!b.label) {
      const N = I.length === 0 && Q.length === 1 ? Q : I;
      N.length > 0 && (b.label = {
        text: N.map((X) => X.text).join(`
`),
        fontSize: Math.max(...N.map((X) => X.fontSize)),
        color: N.find((X) => X.color)?.color,
        verticalAlign: "top"
      });
    }
    Q.filter((N) => I.length > 0 ? N.section !== "header" : !(b.label && Q.length === 1)).forEach((N) => {
      const X = wa((b?.x || 0) + 4, N.y, N.text, {
        width: N.width,
        height: N.height,
        fontSize: N.fontSize,
        color: N.color,
        id: Re(),
        groupId: c,
        metadata: { classId: l }
      });
      o.push(X);
    });
  }), { nodes: i, lines: s, text: o };
}, HF = (e, t, r, i) => {
  const s = Array.from(r.querySelectorAll('.edgePaths path[data-edge="true"]:not([id^="edgeNote"]):not([id*="-cyclic-special-"])'));
  if (e.length === 0)
    return { arrows: [], text: [] };
  const o = [], a = [];
  let n = 0;
  return e.forEach((l) => {
    const { id1: c, id2: h, relation: u } = l, d = t.find((H) => H.id === c), f = t.find((H) => H.id === h);
    if (!d)
      throw new Error(`parseRelations: Cannot find node with id ${c}`);
    if (!f)
      throw new Error(`parseRelations: Cannot find node with id ${h}`);
    const m = MF(u.lineType), y = mf(u.type1), x = mf(u.type2);
    let C;
    if (c === h) {
      const H = NF(c, r);
      if (!H.length)
        throw new Error(`parseRelations: Cannot find rendered SVG edge for relation ${c} -> ${h}`);
      C = mx(H, {
        strokeStyle: m,
        startArrowhead: y,
        endArrowhead: x,
        label: l.title ? { text: l.title } : void 0,
        start: { type: "rectangle", id: d.id },
        end: { type: "rectangle", id: f.id }
      });
    } else {
      const H = s[n];
      if (!H)
        throw new Error(`parseRelations: Cannot find rendered SVG edge for relation ${c} -> ${h}`);
      n += 1, C = RF(H, {
        strokeStyle: m,
        startArrowhead: y,
        endArrowhead: x,
        label: l.title ? { text: l.title } : void 0,
        start: { type: "rectangle", id: d.id },
        end: { type: "rectangle", id: f.id }
      });
    }
    o.push(C);
    const { relationTitle1: b, relationTitle2: w } = l, _ = c === h, B = 20, A = 15, v = 15;
    let L, W;
    if (b && b !== "none") {
      if (_) {
        const D = Cf(C, "start");
        D && (L = D.x, W = D.y);
      } else
        switch (i) {
          case "TB":
            L = C.startX - B, C.endX < C.startX && (L -= v), W = C.startY + A;
            break;
          case "BT":
            L = C.startX + B, C.endX > C.startX && (L += v), W = C.startY - A;
            break;
          case "LR":
            L = C.startX + B, W = C.startY + A, C.endY > C.startY && (W += v);
            break;
          case "RL":
            L = C.startX - B, W = C.startY - A, C.startY > C.endY && (W -= v);
            break;
          default:
            L = C.startX - B, W = C.startY + A;
        }
      L ??= C.startX - B, W ??= C.startY + A;
      const H = wa(L, W, b, {
        fontSize: 16
      });
      a.push(H);
    }
    if (w && w !== "none") {
      if (_) {
        const D = Cf(C, "end");
        D && (L = D.x, W = D.y);
      } else
        switch (i) {
          case "TB":
            L = C.endX + B, C.endX < C.startX && (L += v), W = C.endY - A;
            break;
          case "BT":
            L = C.endX - B, C.endX > C.startX && (L -= v), W = C.endY + A;
            break;
          case "LR":
            L = C.endX - B, W = C.endY - A, C.endY > C.startY && (W -= v);
            break;
          case "RL":
            L = C.endX + B, W = C.endY + A, C.startY > C.endY && (W += v);
            break;
          default:
            L = C.endX + B, W = C.endY - A;
        }
      L ??= C.endX + B, W ??= C.endY + A;
      const H = wa(L, W, w, {
        fontSize: 16
      });
      a.push(H);
    }
  }), { arrows: o, text: a };
}, YF = (e, t, r) => {
  const i = [], s = [];
  return e.forEach((o, a) => {
    const { id: n, text: l, class: c } = o, h = t.querySelector(`#${n}`);
    if (!h)
      throw new Error(`Node with id ${n} not found!`);
    const { transformX: u, transformY: d } = ni(h), f = h.firstChild, m = Lr(f, "rectangle", {
      id: n,
      subtype: "note",
      label: { text: l }
    });
    if (Object.assign(m, {
      x: m.x + u,
      y: m.y + d
    }), i.push(m), c) {
      const y = r.find((A) => A.id === c);
      if (!y)
        throw new Error(`class node with id ${c} not found!`);
      const x = t.querySelector(`path[id="edgeNote${a + 1}"][data-edge="true"]`);
      if (x) {
        s.push(PF(x, {
          strokeStyle: "dotted",
          startArrowhead: null,
          endArrowhead: null,
          start: { id: m.id, type: "rectangle" },
          end: { id: y.id, type: "rectangle" }
        }));
        return;
      }
      const C = m.x + (m.width || 0) / 2, b = m.y + (m.height || 0), w = C, _ = y.y, B = bc(C, b, w, _, {
        strokeStyle: "dotted",
        startArrowhead: null,
        endArrowhead: null,
        start: { id: m.id, type: "rectangle" },
        end: { id: y.id, type: "rectangle" }
      });
      s.push(B);
    }
  }), { notes: i, connectors: s };
}, UF = (e, t) => {
  const r = e.db, i = r.getDirection?.() || "TB", s = [], o = [], a = [], n = [], l = r.getNamespaces?.() || [], c = r.getClasses?.() || {}, h = c instanceof Map ? Object.fromEntries(c) : c;
  if (h && Object.keys(h).length) {
    const C = (
      //@ts-ignore
      typeof r.lookUpDomId == "function" ? (
        //@ts-ignore
        r.lookUpDomId.bind(r)
      ) : void 0
    ), b = zF(h, t, C);
    s.push(b.nodes), o.push(...b.lines), a.push(...b.text), n.push(...b.nodes);
  }
  const u = r.getRelations?.() || [], { arrows: d, text: f } = HF(u, n, t, i), m = r.getNotes?.() || [], { notes: y, connectors: x } = YF(m, t, n);
  return s.push(y), d.push(...x), a.push(...f), { type: "class", nodes: s, lines: o, arrows: d, text: a, namespaces: l };
}, bf = 18, XF = (e) => {
  const t = {};
  return e && e.forEach((r) => {
    qe(r).forEach(({ property: i, value: s }) => {
      i && s && (t[i] = Mt(s));
    });
  }), t;
}, jF = (e) => {
  if (e == null || e === "")
    return;
  const t = typeof e == "number" ? e : parseFloat(Mt(e));
  if (!(!Number.isFinite(t) || t <= 0))
    return t;
}, kc = (e, t) => {
  let r = 0, i = 0, s = e;
  for (; s && s !== t; ) {
    const { transformX: o, transformY: a } = ni(s);
    r += o, i += a, s = s.parentElement;
  }
  return { tx: r, ty: i };
}, GF = (e) => {
  const t = Array.from(e.querySelectorAll("tspan")), r = t.length ? t.map((i) => i.textContent?.trim()).filter(Boolean).join(`
`) : e.textContent?.trim() || "";
  return Ae(r);
}, VF = (e) => {
  const t = e.querySelector("text, foreignObject, div, span, p") || e;
  let r = parseFloat(getComputedStyle(t).fontSize || "");
  return (!Number.isFinite(r) || r <= 0) && (r = Math.max(12, e.getBBox().height * 0.75)), r;
}, KF = (e, t, r) => {
  const i = GF(e);
  if (!i)
    return null;
  const s = e.getBBox(), { tx: o, ty: a } = kc(e, t);
  return {
    className: e.getAttribute("class") || "",
    text: i,
    x: s.x + o,
    y: s.y + a,
    width: s.width,
    height: s.height,
    fontSize: VF(e),
    color: yc(e, r)
  };
}, ZF = (e, t, r, i, s, o, a) => {
  const { tx: n, ty: l } = kc(e, t);
  let c = 0, h = 0, u = 0, d = 0;
  if (e.tagName.toLowerCase() === "line")
    c = Number(e.getAttribute("x1")) + n, h = Number(e.getAttribute("y1")) + l, u = Number(e.getAttribute("x2")) + n, d = Number(e.getAttribute("y2")) + l;
  else {
    const m = eh(e);
    if (!m)
      return null;
    c = m.startX + n, h = m.startY + l, u = m.endX + n, d = m.endY + l;
  }
  const f = {
    type: "line",
    id: Re(),
    groupId: r,
    startX: c,
    startY: h,
    endX: u,
    endY: d,
    metadata: { entityId: i }
  };
  return s && We(s) && s !== "none" && (f.strokeColor = s), o !== void 0 && (f.strokeWidth = o), a && (f.strokeStyle = a), f;
}, kf = (e) => {
  switch (e?.toLowerCase()) {
    case "one":
      return "cardinality_one";
    case "many":
      return "cardinality_many";
    case "only_one":
      return "cardinality_exactly_one";
    case "one_or_more":
      return "cardinality_one_or_many";
    case "zero_or_one":
      return "cardinality_zero_or_one";
    case "zero_or_more":
      return "cardinality_zero_or_many";
    default:
      return null;
  }
}, QF = (e) => {
  switch (e) {
    case "dotted":
      return "dotted";
    case "dashed":
      return "dashed";
    default:
      return "solid";
  }
}, JF = (e, t) => {
  const r = t.querySelector(`path[id="${e.id}"][data-edge="true"]`);
  return r ? [r] : e.start !== e.end ? [] : [
    `${e.start}-cyclic-special-1`,
    `${e.start}-cyclic-special-mid`,
    `${e.start}-cyclic-special-2`
  ].map((s) => t.querySelector(`path[id="${s}"][data-edge="true"]`)).filter((s) => s !== null);
}, tM = (e) => {
  const t = [];
  return e.forEach((r) => {
    Of(r).forEach((i) => {
      const s = t[t.length - 1];
      s && s.x === i.x && s.y === i.y || t.push(i);
    });
  }), t;
}, eM = (e, t) => {
  const r = t.querySelector(`[id="${e.id}"]`);
  if (!r)
    throw new Error(`ER entity ${e.id} not found in rendered SVG`);
  const i = e.attributes.length ? Re() : void 0, s = r.getBBox(), { tx: o, ty: a } = kc(r, t), n = XF([
    ...e.cssStyles || [],
    ...e.cssCompiledStyles || []
  ]), l = Mt(n.fill || ""), c = Mt(n.stroke || ""), h = jF(n["stroke-width"]), u = Mt(n["stroke-dasharray"] || ""), d = Array.from(r.querySelectorAll("g.label")).map((w) => KF(w, t, n.color)).filter((w) => w !== null), f = d.find((w) => w.className.includes("name")) || d[0], m = d.filter((w) => w !== f), y = f?.text || Ae(e.alias || e.label || ""), x = {
    type: "rectangle",
    id: e.id,
    groupId: i,
    x: s.x + o,
    y: s.y + a,
    width: s.width,
    height: s.height,
    label: {
      text: y,
      fontSize: e.attributes.length ? bf : f?.fontSize || 16,
      color: f?.color,
      textAlign: "center",
      verticalAlign: e.attributes.length ? "top" : "middle"
    },
    metadata: {
      entityId: e.id,
      entityLabel: e.label,
      entityAlias: e.alias
    }
  };
  We(l) && l !== "none" && (x.bgColor = l), We(c) && c !== "none" && (x.strokeColor = c), h && Number.isFinite(h) && h > 0 && (x.strokeWidth = h), u && u !== "none" && (x.strokeStyle = "dashed");
  const C = Array.from(r.querySelectorAll(".divider path, path.divider, line.divider")).map((w) => ZF(w, t, i, e.id, x.strokeColor, x.strokeWidth, x.strokeStyle)).filter((w) => w !== null), b = m.map((w) => wa(w.x, w.y, w.text, {
    id: Re(),
    groupId: i,
    width: w.width,
    height: w.height,
    fontSize: bf,
    color: w.color,
    metadata: { entityId: e.id }
  }));
  return { container: x, lines: C, text: b };
}, rM = (e, t) => {
  const r = JF(e, t);
  if (!r.length)
    throw new Error(`ER relationship ${e.id} not found in rendered SVG`);
  const i = tM(r);
  if (i.length < 2)
    throw new Error(`ER relationship ${e.id} is missing usable path points`);
  const s = i[0], o = i[i.length - 1], a = r[0], n = Mt(a.getAttribute("stroke") || getComputedStyle(a).stroke || ""), l = Number(a.getAttribute("stroke-width") || getComputedStyle(a).strokeWidth || 1), c = bc(s.x, s.y, o.x, o.y, {
    id: e.id,
    label: e.label ? {
      text: Ae(e.label),
      fontSize: 16,
      textAlign: "center"
    } : void 0,
    strokeStyle: QF(e.pattern),
    startArrowhead: kf(e.arrowTypeStart),
    endArrowhead: kf(e.arrowTypeEnd),
    start: { type: "rectangle", id: e.start },
    end: { type: "rectangle", id: e.end },
    points: i.map((h) => [
      h.x - s.x,
      h.y - s.y
    ])
  });
  return We(n) && n !== "none" && (c.strokeColor = n), Number.isFinite(l) && l > 0 && (c.strokeWidth = l), c;
}, iM = (e, t) => {
  const r = e.getData(), i = r.nodes, s = r.edges, o = [], a = [], n = [];
  i.forEach((c) => {
    const h = eM(c, t);
    o.push(h.container), a.push(...h.lines), n.push(...h.text);
  });
  const l = s.map((c) => rM(c, t));
  return {
    type: "erd",
    nodes: [o],
    lines: a,
    arrows: l,
    text: n
  };
}, mi = (e) => {
  const t = Mt(e || "");
  return !t || t === "none" || t === "transparent" || t === "rgba(0, 0, 0, 0)" || t === "rgba(0,0,0,0)" ? !1 : We(t);
}, yx = (e, t, r) => {
  switch (t) {
    case qt.FILL:
    case qt.STROKE:
      mi(r) && (e[t] = Mt(r));
      break;
    case qt.STROKE_WIDTH:
    case qt.STROKE_DASHARRAY:
      Mt(r) && (e[t] = Mt(r));
      break;
  }
}, xx = (e, t, r) => {
  t === be.COLOR && mi(r) && (e[be.COLOR] = Mt(r));
}, sM = (e, t, r) => {
  e && qe(e).forEach(({ property: i, value: s }) => {
    yx(t, i, s), xx(r, i, s);
  });
}, oM = (e, t) => {
  e && qe(e).forEach(({ property: r, value: i }) => {
    if (r === qt.FILL && mi(i)) {
      t[be.COLOR] = Mt(i);
      return;
    }
    xx(t, r, i);
  });
}, aM = (e) => {
  const t = /* @__PURE__ */ new Set();
  return e.filter(Boolean).forEach((r) => {
    qe(r || "").forEach(({ property: i }) => {
      t.add(i);
    });
  }), t;
}, nM = (e, t, r) => {
  if (!e)
    return;
  [
    [qt.FILL, e.getAttribute("fill")],
    [qt.STROKE, e.getAttribute("stroke")],
    [
      qt.STROKE_WIDTH,
      e.getAttribute("stroke-width")
    ],
    [
      qt.STROKE_DASHARRAY,
      e.getAttribute("stroke-dasharray")
    ]
  ].forEach(([s, o]) => {
    if (!r.has(s) || t[s])
      return;
    const a = Mt(o || "");
    a && yx(t, s, a);
  });
}, lM = (e, t, r) => {
  if (!e)
    return;
  const i = [
    e,
    ...Array.from(e.querySelectorAll("text, foreignObject, div, span, p"))
  ];
  for (const s of i) {
    if (t[be.COLOR] || (r.has(be.COLOR) || r.has(qt.FILL)) && (oM(s.getAttribute("style"), t), t[be.COLOR]))
      break;
    const o = Mt(s.getAttribute("fill") || s.getAttribute("color") || "");
    (r.has(be.COLOR) || r.has(qt.FILL)) && mi(o) && (t[be.COLOR] = o);
  }
}, wc = (e, t) => {
  let r = 0, i = 0, s = e;
  for (; s && s !== t; ) {
    const { transformX: o, transformY: a } = ni(s);
    r += o, i += a, s = s.parentElement;
  }
  return { tx: r, ty: i };
}, hM = (e, t) => {
  const r = e.getBBox(), { tx: i, ty: s } = wc(e, t);
  return {
    x: r.x + i,
    y: r.y + s,
    width: r.width,
    height: r.height
  };
}, cM = (e, t) => {
  const r = e.querySelector("line.divider");
  if (!r)
    return;
  const { tx: i, ty: s } = wc(r, t);
  return {
    startX: Number(r.getAttribute("x1")) + i,
    startY: Number(r.getAttribute("y1")) + s,
    endX: Number(r.getAttribute("x2")) + i,
    endY: Number(r.getAttribute("y2")) + s
  };
}, uM = (e) => {
  const t = e.getBBox();
  return Math.abs(t.width * t.height);
}, wf = (e, t) => {
  const r = e.getAttribute("style");
  if (!r)
    return;
  const i = qe(r).find((s) => s.property === t);
  if (i)
    return Mt(i.value);
}, Kl = (e, t) => {
  const r = e.map((s) => ({ element: s, area: uM(s) })).filter(({ area: s }) => Number.isFinite(s) && s > 0);
  return r.length === 0 ? null : r.sort((s, o) => t === "largest" ? o.area - s.area : s.area - o.area)[0].element;
}, dM = (e, t) => {
  if (!e || !t.has(qt.FILL) && !t.has(qt.STROKE))
    return;
  const r = Mt(e.getAttribute("fill") || wf(e, qt.FILL) || ""), i = Mt(e.getAttribute("stroke") || wf(e, qt.STROKE) || "");
  if (mi(r))
    return r;
  if (mi(i))
    return i;
}, fM = (e, t) => {
  const r = Array.from(e.querySelectorAll("circle, ellipse, path")), i = Kl(r, "smallest");
  return dM(i, t);
}, pM = (e) => {
  if (e.length < 2)
    return e;
  const t = e.slice(1), r = t.filter((i) => i.trim().length > 0).reduce((i, s) => {
    const o = s.match(/^\s*/)?.[0].length ?? 0;
    return Math.min(i, o);
  }, Number.POSITIVE_INFINITY);
  return !Number.isFinite(r) || r <= 0 ? e.map((i) => i.trimEnd()) : [
    e[0].trimEnd(),
    ...t.map((i) => i.replace(new RegExp(`^\\s{0,${r}}`), "").trimEnd())
  ];
}, gM = (e) => {
  const t = Array.isArray(e.label) ? e.label.map((i) => Ae(i)) : Ae(e.label || "").split(`
`);
  return pM(t).join(`
`);
}, mM = (e) => e.description ? (Array.isArray(e.description) ? e.description : [e.description]).map((r) => Ae(r)).filter((r) => r.length > 0) : [], yM = (e) => {
  const t = /* @__PURE__ */ new Set(), r = (s) => (s && t.add(s), s), i = (s) => {
    const o = s.find((a) => !t.has(a));
    return r(o || null);
  };
  return (s) => {
    const o = [
      `[id='${s.domId}']`,
      `[id='${s.id}']`,
      `[data-id='${s.id}']`
    ];
    for (const a of o) {
      const n = e.querySelector(a);
      if (n)
        return r(n);
    }
    switch (s.shape) {
      case "divider":
        return i(Array.from(e.querySelectorAll("g.statediagram-cluster-alt")));
      case "stateStart":
        return i(Array.from(e.querySelectorAll("g.node.default")).filter((a) => a.querySelector("circle.state-start")));
      case "stateEnd":
        return i(Array.from(e.querySelectorAll("g.node.default")).filter((a) => !a.querySelector("circle.state-start")));
      default:
        return null;
    }
  };
}, xM = (e, t) => {
  switch (t) {
    case "roundedWithTitle":
      return e.querySelector("rect.outer") || e.querySelector("rect") || e;
    case "divider":
      return e.querySelector("rect.divider") || e.querySelector("rect") || e;
    case "rectWithTitle":
      return e.querySelector("rect.outer") || e.querySelector("rect") || e;
    case "stateStart":
      return Kl(Array.from(e.querySelectorAll("circle, ellipse, path")), "largest") || e;
    case "stateEnd":
      return Kl(Array.from(e.querySelectorAll("circle, ellipse, path")), "largest") || e;
    default:
      return e.querySelector("rect, path, circle, ellipse, polygon") || e;
  }
}, CM = (e, t, r) => {
  const i = r(e);
  if (!i)
    throw new Error(`State node element not found for "${e.id}"`);
  const s = xM(i, e.shape), o = {}, a = {}, n = [
    e.labelStyle,
    ...e.cssCompiledStyles || [],
    ...e.cssStyles || []
  ], l = aM(n);
  n.filter(Boolean).forEach((h) => {
    sM(h, o, a);
  }), nM(s, o, l), lM(i, a, l);
  const c = hM(s, t);
  return {
    id: e.id,
    shape: e.shape,
    text: gM(e),
    description: mM(e),
    x: c.x,
    y: c.y,
    width: c.width,
    height: c.height,
    parentId: e.parentId,
    position: e.position,
    containerStyle: o,
    labelStyle: a,
    dividerLine: e.shape === "rectWithTitle" ? cM(i, t) : void 0,
    endInnerColor: e.shape === "stateEnd" ? fM(i, l) : void 0,
    isRenderable: e.shape !== "noteGroup"
  };
}, bM = (e, t) => {
  const r = t.querySelector(`[id='${e.id}']`);
  if (!r)
    return null;
  const { tx: i, ty: s } = wc(r, t), o = $f(r, { x: i, y: s }, "MCL");
  if (o.reflectionPoints.length < 2)
    return null;
  const a = {}, n = (c, h) => {
    switch (c) {
      case qt.STROKE:
        mi(h) && (a.strokeColor = Mt(h));
        break;
      case qt.STROKE_WIDTH: {
        const u = parseFloat(Mt(h));
        Number.isFinite(u) && u > 0 && (a.strokeWidth = u);
        break;
      }
      case qt.STROKE_DASHARRAY:
        Mt(h) && (a.strokeStyle = "dashed");
        break;
    }
  };
  [e.style].filter(Boolean).forEach((c) => {
    qe(c || "").forEach(({ property: h, value: u }) => {
      n(h, u);
    });
  });
  const l = e.arrowhead === "none" || e.classes?.includes("note-edge");
  return {
    id: e.id,
    start: e.start,
    end: e.end,
    text: Ae(e.label || ""),
    ...o,
    strokeColor: a.strokeColor,
    strokeWidth: a.strokeWidth,
    strokeStyle: l ? "dashed" : a.strokeStyle,
    isNoteEdge: l
  };
}, kM = (e, t) => {
  const { nodes: r, edges: i } = e.getData(), s = yM(t);
  return {
    type: "state",
    nodes: r.map((o) => CM(o, t, s)),
    edges: i.map((o) => bM(o, t)).filter((o) => o !== null)
  };
};
let Sf = Promise.resolve();
const wM = (e) => {
  const t = Sf.then(e, e);
  return Sf = t.then(() => {
  }, () => {
  }), t;
};
let Tf = null, SM = 0;
const TM = (e) => JSON.stringify(e), _f = (e) => {
  const t = e.querySelector("svg");
  if (!t)
    throw new Error("SVG element not found");
  const r = t.getBoundingClientRect(), i = r.width, s = r.height;
  t.setAttribute("width", `${i}`), t.setAttribute("height", `${s}`);
  const o = "image/svg+xml", a = unescape(encodeURIComponent(t.outerHTML)), l = `data:image/svg+xml;base64,${btoa(a)}`;
  return {
    type: "graphImage",
    mimeType: o,
    dataURL: l,
    width: i,
    height: s
  };
}, _M = async (e, t = bo) => wM(async () => {
  const r = t.themeVariables?.fontSize ?? bo.themeVariables.fontSize, i = {
    ...bo,
    ...t,
    fontSize: r,
    themeVariables: {
      ...bo.themeVariables,
      ...t.themeVariables,
      fontSize: r
    }
  }, s = TM(i);
  s !== Tf && (rl.initialize(i), Tf = s);
  const o = await rl.mermaidAPI.getDiagramFromText(YC(e)), a = `mermaid-to-excalidraw-${SM++}`, n = document.createElement("div");
  n.setAttribute("style", "opacity: 0; position: fixed; z-index: -1; left: -99999px; top: -99999px;");
  const l = `${a}-container`;
  n.id = l, document.getElementById(l)?.remove(), document.body.appendChild(n);
  try {
    const { svg: c } = await rl.render(a, e, n);
    n.innerHTML = c;
    let h;
    try {
      switch (o.type) {
        case "flowchart-v2":
        case "graph": {
          h = bF(o.db, n);
          break;
        }
        case "sequence": {
          h = EF(o, n);
          break;
        }
        case "class":
        case "classDiagram": {
          h = UF(o, n);
          break;
        }
        case "er": {
          h = iM(o.db, n);
          break;
        }
        case "state":
        case "stateDiagram": {
          h = kM(o.db, n);
          break;
        }
        default:
          h = _f(n);
      }
    } catch (u) {
      console.error("Error processing Mermaid diagram:", u), h = _f(n);
    }
    return h;
  } finally {
    n.remove();
  }
}), BM = async (e, t) => {
  const r = t || {}, i = parseInt(r.themeVariables?.fontSize ?? "") || ro, s = await _M(e, {
    ...r,
    themeVariables: {
      ...r.themeVariables
    }
  });
  return GC(s, {
    fontSize: i
  });
}, m5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  parseMermaidToExcalidraw: BM
}, Symbol.toStringTag, { value: "Module" }));
export {
  Ti as $,
  jM as A,
  ts as B,
  Ok as C,
  IM as D,
  Hr as E,
  lr as F,
  VC as G,
  jt as H,
  Wk as I,
  Ev as J,
  Eh as K,
  Xf as L,
  $T as M,
  bS as N,
  nS as O,
  vu as P,
  Bu as Q,
  YM as R,
  NM as S,
  zM as T,
  Tt as U,
  WM as V,
  RM as W,
  mh as X,
  HM as Y,
  PM as Z,
  p as _,
  Ik as a,
  oT as a$,
  XM as a0,
  UM as a1,
  qM as a2,
  Wb as a3,
  js as a4,
  OM as a5,
  Aa as a6,
  _T as a7,
  kk as a8,
  sp as a9,
  Ia as aA,
  Vh as aB,
  Ay as aC,
  UB as aD,
  ge as aE,
  D_ as aF,
  Sh as aG,
  kh as aH,
  Wo as aI,
  hT as aJ,
  lT as aK,
  nT as aL,
  aT as aM,
  QS as aN,
  ng as aO,
  eT as aP,
  ZS as aQ,
  sT as aR,
  lg as aS,
  tT as aT,
  dT as aU,
  uT as aV,
  cT as aW,
  pT as aX,
  fT as aY,
  JS as aZ,
  hg as a_,
  nu as aa,
  Ra as ab,
  uS as ac,
  _l as ad,
  OT as ae,
  Ke as af,
  R as ag,
  P as ah,
  Ak as ai,
  ap as aj,
  By as ak,
  Gh as al,
  wd as am,
  lo as an,
  US as ao,
  Lh as ap,
  ct as aq,
  e5 as ar,
  t5 as as,
  vv as at,
  Dt as au,
  Oy as av,
  dt as aw,
  JM as ax,
  xa as ay,
  Iy as az,
  $k as b,
  iT as b0,
  rT as b1,
  cg as b2,
  My as b3,
  yg as b4,
  Rf as b5,
  lS as b6,
  Qe as b7,
  YS as b8,
  dh as b9,
  Nr as ba,
  Ks as bb,
  bu as bc,
  W2 as bd,
  ft as be,
  rg as bf,
  Le as bg,
  $2 as bh,
  uh as bi,
  bp as bj,
  no as bk,
  Sp as bl,
  DM as bm,
  ZC as bn,
  Co as bo,
  sn as bp,
  m5 as bq,
  $t as c,
  op as d,
  ae as e,
  Br as f,
  Rk as g,
  Sy as h,
  Pe as i,
  vt as j,
  oo as k,
  $ as l,
  Cg as m,
  so as n,
  VS as o,
  MM as p,
  $M as q,
  g5 as r,
  Dk as s,
  p5 as t,
  me as u,
  Pk as v,
  RT as w,
  Nk as x,
  Fv as y,
  AB as z
};
