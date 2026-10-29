import { D as vn } from "./index-DYsA9s7a.js";
import { r as dm } from "./dayjs.min-Bqm5tm0Y.js";
import { p as ni } from "./documentTransfer-_tPvdtOt.js";
import { w as bs, s as th } from "./isArrayLikeObject-CvpqkKQ7.js";
import { k as $r, a as ks, f as sr, i as Rr, u as um, v as Yo, r as fm, w as eh } from "./union-Ck_IpzPd.js";
const cs = 20, pm = {
  rect: "rectangle",
  circle: "ellipse"
}, ws = {
  startOnLoad: !1,
  flowchart: { curve: "linear" },
  themeVariables: {
    fontSize: `${cs}px`
  },
  maxEdges: 500,
  maxTextSize: 5e4
};
class gi {
  constructor({ converter: t }) {
    this.convert = (r, i) => this.converter(r, {
      ...i,
      fontSize: i.fontSize || cs
    }), this.converter = t;
  }
}
var Ke;
(function(e) {
  e.ROUND = "round", e.STADIUM = "stadium", e.DOUBLECIRCLE = "doublecircle", e.CIRCLE = "circle", e.DIAMOND = "diamond", e.CYLINDER = "cylinder";
})(Ke || (Ke = {}));
var Jt;
(function(e) {
  e.COLOR = "color";
})(Jt || (Jt = {}));
var At;
(function(e) {
  e.FILL = "fill", e.STROKE = "stroke", e.STROKE_WIDTH = "stroke-width", e.STROKE_DASHARRAY = "stroke-dasharray";
})(At || (At = {}));
var Fi = {}, rh;
function gm() {
  if (rh) return Fi;
  rh = 1, Object.defineProperty(Fi, "__esModule", { value: !0 }), Fi.removeMarkdown = void 0;
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
  return Fi.removeMarkdown = e, Fi;
}
var ym = gm();
const mm = {
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
}, xm = (e) => mm[e], Xo = (e) => {
  let t = e.text;
  return e.labelType === "markdown" && (t = ym.removeMarkdown(e.text)), Cm(t);
}, Cm = (e) => {
  const t = /\s?(fa|fab):[a-zA-Z0-9-]+/g;
  return e.replace(t, "");
}, ts = (e) => {
  const t = {};
  return Object.keys(e).forEach((r) => {
    switch (r) {
      case At.FILL: {
        t.backgroundColor = e[r], t.fillStyle = "solid";
        break;
      }
      case At.STROKE: {
        t.strokeColor = e[r];
        break;
      }
      case At.STROKE_WIDTH: {
        t.strokeWidth = Number(e[r]?.split("px")[0]);
        break;
      }
      case At.STROKE_DASHARRAY: {
        t.strokeStyle = "dashed";
        break;
      }
    }
  }), t;
}, Da = (e) => {
  const t = {};
  return Object.keys(e).forEach((r) => {
    r === Jt.COLOR && (t.strokeColor = e[r]);
  }), t;
}, bm = (e, t) => [e, t], km = 32, Td = 0.62, wm = 12, Sm = 12, Bd = (e, t) => Math.max(20, Math.ceil(e.length * t * Td)), Tm = (e, t, r, i) => {
  const s = i || cs;
  if (e !== Ke.CYLINDER || !t || t.includes(`
`))
    return s;
  const o = Math.max(20, r - wm);
  return Bd(t, s) <= o ? s : Math.max(Sm, Math.floor(o / (t.length * Td)));
}, Bm = (e) => {
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
}, _m = new gi({
  converter: (e, t) => {
    const r = [], i = t.fontSize, { getGroupIds: s, getParentId: o } = Bm(e);
    return e.subGraphs.reverse().forEach((a) => {
      const n = s(a.id), l = Xo(a), d = Bd(l, i || 16) + km * 2, u = Math.max(a.width, d), f = a.x - (u - a.width) / 2, y = ts(a.containerStyle), m = Da(a.labelStyle), x = {
        id: a.id,
        type: "rectangle",
        groupIds: n,
        x: f,
        y: a.y,
        width: u,
        height: a.height,
        label: {
          groupIds: n,
          text: l,
          fontSize: i,
          verticalAlign: "top",
          ...m
        },
        ...y
      };
      r.push(x);
    }), Object.values(e.vertices).forEach((a) => {
      if (!a)
        return;
      const n = s(a.id), l = Xo(a), c = Tm(a.type, l, a.width, i), h = ts(a.containerStyle), d = Da(a.labelStyle);
      let u = {
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
          ...d
        },
        link: a.link || null,
        ...h
      };
      switch (a.type) {
        case Ke.STADIUM: {
          u = { ...u, roundness: { type: 3 } };
          break;
        }
        case Ke.ROUND: {
          u = { ...u, roundness: { type: 3 } };
          break;
        }
        case Ke.DOUBLECIRCLE: {
          n.push(`doublecircle_${a.id}}`);
          const y = {
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
              ...d
            }
          };
          u = { ...u, groupIds: n, type: "ellipse" }, r.push(y);
          break;
        }
        case Ke.CIRCLE: {
          u.type = "ellipse";
          break;
        }
        case Ke.DIAMOND: {
          u.type = "diamond";
          break;
        }
      }
      r.push(u);
    }), e.edges.forEach((a) => {
      let n = [];
      const l = o(a.start), c = o(a.end);
      l && l === c && (n = s(l));
      const { startX: h, startY: d, reflectionPoints: u } = a, f = u.map((w) => bm(w.x - u[0].x, w.y - u[0].y)), y = xm(a.type || "arrow_point"), m = r.find((w) => w.id === a.start), x = r.find((w) => w.id === a.end);
      if (!m || !x)
        return;
      const b = {
        id: `${a.start}_${a.end}`,
        type: "arrow",
        groupIds: n,
        x: h,
        y: d,
        // 4 and 2 are the Excalidraw's stroke width of thick and thin respectively
        // TODO: use constant exported from Excalidraw package
        strokeWidth: a.stroke === "thick" ? 4 : 2,
        strokeStyle: a.stroke === "dotted" ? "dashed" : void 0,
        points: f,
        ...a.text ? { label: { text: Xo(a), fontSize: i, groupIds: n } } : {},
        roundness: {
          type: 2
        },
        ...y,
        start: {
          id: m.id || ""
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
let le = (e = 21) => crypto.getRandomValues(new Uint8Array(e)).reduce((t, r) => (r &= 63, r < 36 ? t += r.toString(36) : r < 62 ? t += (r - 26).toString(36).toUpperCase() : r > 62 ? t += "-" : t += "_", t), "");
const vm = new gi({
  converter: (e) => {
    const t = le(), { width: r, height: i } = e, s = {
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
}), Ui = (e, t) => [e, t], Ln = (e) => e.replace(/\\n/g, `
`), fr = (e) => {
  const t = {
    type: "line",
    x: e.startX,
    y: e.startY,
    points: [
      Ui(0, 0),
      Ui(e.endX - e.startX, e.endY - e.startY)
    ],
    width: e.endX - e.startX,
    height: e.endY - e.startY,
    strokeStyle: e.strokeStyle || "solid",
    strokeColor: e.strokeColor || "#000",
    strokeWidth: e.strokeWidth || 1
  };
  return e.groupId && Object.assign(t, { groupIds: [e.groupId] }), e.id && Object.assign(t, { id: e.id }), t;
}, pr = (e) => {
  const t = {
    type: "text",
    x: e.x,
    y: e.y,
    width: e.width,
    height: e.height,
    text: Ln(e.text) || "",
    fontSize: e.fontSize,
    verticalAlign: "top",
    strokeColor: e.color
  };
  return e.groupId && Object.assign(t, { groupIds: [e.groupId] }), e.id && Object.assign(t, { id: e.id }), t;
}, Wr = (e) => {
  const t = {
    text: Ln(e?.label?.text || ""),
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
}, Fn = (e) => {
  const t = {
    type: "arrow",
    x: e.startX,
    y: e.startY,
    points: e.points?.map(([r, i]) => Ui(r, i)) || [
      Ui(0, 0),
      Ui(e.endX - e.startX, e.endY - e.startY)
    ],
    width: e.endX - e.startX,
    height: e.endY - e.startY,
    strokeStyle: e?.strokeStyle || "solid",
    endArrowhead: e?.endArrowhead || null,
    startArrowhead: e?.startArrowhead || null,
    label: {
      text: Ln(e?.label?.text || ""),
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
}, Ss = 10, jo = 16, Lm = 24, Fm = 4, Am = (e) => {
  if (!e)
    return !0;
  const t = e.trim().toLowerCase();
  return t === "transparent" || t === "none" || t === "rgba(0,0,0,0)" || t === "rgba(0, 0, 0, 0)";
}, Em = (e, t) => Math.max(20, Math.round(e.length * t * 0.6)), ih = (e, t, r = !0) => {
  const i = e, s = i.groupIds ?? [];
  if (s.includes(t) || (i.groupIds = [...s, t]), !r || !i.label)
    return;
  const o = i.label.groupIds ?? [];
  o.includes(t) || (i.label.groupIds = [...o, t]);
}, Mm = new gi({
  converter: (e) => {
    const t = [], r = [];
    if (Object.values(e.nodes).forEach((i) => {
      !i || !i.length || i.forEach((s) => {
        let o;
        switch (s.type) {
          case "line":
            o = fr(s);
            break;
          case "rectangle":
          case "ellipse":
            o = Wr(s);
            break;
          case "text":
            o = pr(s);
            break;
          default:
            throw `unknown type ${s.type}`;
        }
        s.type === "rectangle" && s?.subtype === "activation" ? r.push(o) : t.push(o);
      });
    }), Object.values(e.lines).forEach((i) => {
      i && t.push(fr(i));
    }), Object.values(e.arrows).forEach((i) => {
      i && (t.push(Fn(i)), i.sequenceNumber && t.push(Wr(i.sequenceNumber)));
    }), t.push(...r), e.loops) {
      const { lines: i, texts: s, nodes: o } = e.loops;
      i.forEach((a) => {
        t.push(fr(a));
      }), s.forEach((a) => {
        t.push(pr(a));
      }), o.forEach((a) => {
        t.push(Wr(a));
      });
    }
    return e.groups && e.groups.forEach((i) => {
      const { actorKeys: s, name: o } = i;
      let a = 1 / 0, n = 1 / 0, l = 0, c = 0;
      if (!s.length)
        return;
      const h = t.filter((b) => {
        if (b.id) {
          const w = b.id.indexOf("-"), T = b.id.substring(0, w);
          return s.includes(T);
        }
        return !1;
      });
      if (!h.length || (h.forEach((b) => {
        b.x === void 0 || b.y === void 0 || b.width === void 0 || b.height === void 0 || (a = Math.min(a, b.x), n = Math.min(n, b.y), l = Math.max(l, b.x + b.width), c = Math.max(c, b.y + b.height));
      }), !Number.isFinite(a) || !Number.isFinite(n) || !Number.isFinite(l) || !Number.isFinite(c)))
        return;
      const d = a - Ss, u = n - Ss, f = l - a + Ss * 2, y = c - n + Ss * 2, m = le(), x = le(), C = Wr({
        type: "rectangle",
        x: d,
        y: u,
        width: f,
        height: y,
        bgColor: Am(i.fill) ? void 0 : i.fill,
        strokeColor: "#1f1f1f",
        strokeWidth: 1,
        id: m,
        groupId: x
      });
      if (t.unshift(C), t.forEach((b) => {
        b.id !== m && (b.x === void 0 || b.y === void 0 || b.width === void 0 || b.height === void 0 || b.x >= a && b.x + b.width <= l && b.y >= n && b.y + b.height <= c && ih(b, x));
      }), o) {
        const b = pr({
          id: le(),
          text: o,
          x: d + Fm,
          y: u - Lm,
          width: Em(o, jo),
          height: jo + 8,
          fontSize: jo,
          color: "#1f1f1f",
          groupId: x
        });
        ih(b, x, !1), t.push(b);
      }
    }), { elements: t };
  }
}), $m = new gi({
  converter: (e) => {
    const t = [];
    return e.nodes.forEach((r) => {
      !r || !r.length || r.forEach((i) => {
        let s;
        switch (i.type) {
          case "line":
            s = fr(i);
            break;
          case "rectangle":
          case "ellipse":
            s = Wr(i);
            break;
          case "text":
            s = pr(i);
            break;
          default:
            throw `unknown type ${i.type}`;
        }
        t.push(s);
      });
    }), Object.values(e.lines).forEach((r) => {
      r && t.push(fr(r));
    }), Object.values(e.arrows).forEach((r) => {
      if (!r)
        return;
      const i = Fn(r);
      t.push(i);
    }), Object.values(e.text).forEach((r) => {
      const i = pr(r);
      t.push(i);
    }), Object.values(e.namespaces).forEach((r) => {
      const i = Object.keys(r.classes), s = [...i], o = [...e.lines, ...e.arrows, ...e.text];
      i.forEach((n) => {
        const l = o.filter((c) => c.metadata && c.metadata.classId === n).map((c) => c.id);
        l.length && s.push(...l);
      });
      const a = {
        type: "frame",
        id: le(),
        name: r.id,
        children: s
      };
      t.push(a);
    }), { elements: t };
  }
}), Om = new gi({
  converter: (e) => {
    const t = [];
    return e.nodes.forEach((r) => {
      !r || !r.length || r.forEach((i) => {
        let s;
        switch (i.type) {
          case "line":
            s = fr(i);
            break;
          case "rectangle":
          case "ellipse":
            s = Wr(i);
            break;
          case "text":
            s = pr(i);
            break;
          default:
            throw `unknown type ${i.type}`;
        }
        t.push(s);
      });
    }), e.lines.forEach((r) => {
      t.push(fr(r));
    }), e.arrows.forEach((r) => {
      t.push(Fn(r));
    }), e.text.forEach((r) => {
      t.push(pr(r));
    }), { elements: t };
  }
}), Vs = (e, t) => [e, t], Pi = 16, _d = 14, Im = 1, Pa = "#000000", vd = 5, Dm = vd * 2, Pm = vd * 2, Rm = 1.25, Ld = /* @__PURE__ */ new Set([
  "choice",
  "fork",
  "join",
  "stateStart",
  "stateEnd",
  "divider"
]), Ra = (e) => e.shape === "stateEnd" ? [`state_end_group_${e.id}`] : void 0, Fd = (e) => e.shape === "rectWithTitle" && e.description.length ? [e.text, ...e.description].join(`
`) : e.text;
let or;
const qm = () => {
  if (or !== void 0)
    return or;
  if (typeof document > "u")
    return or = null, or;
  try {
    or = document.createElement("canvas").getContext("2d");
  } catch {
    or = null;
  }
  return or;
}, li = (e, t) => {
  const r = qm();
  return r ? (r.font = `${t}px Excalifont, sans-serif`, r.measureText(e).width) : e.length * t * 0.6;
}, Nm = (e, t, r) => {
  if (li(e, t) <= r)
    return [e];
  const i = [];
  let s = "";
  for (const o of e) {
    const a = `${s}${o}`;
    if (s && li(a, t) > r) {
      i.push(s), s = o;
      continue;
    }
    s = a;
  }
  return s && i.push(s), i;
}, Wm = (e, t, r) => {
  if (!e.trim() || li(e, t) <= r)
    return e;
  const i = e.split(/\s+/).filter(Boolean), s = [];
  let o = "";
  for (const a of i) {
    const n = Nm(a, t, r);
    for (const [l, c] of n.entries()) {
      const d = o ? `${o}${o && l === 0 ? " " : ""}${c}` : c;
      if (li(d, t) <= r) {
        o = d;
        continue;
      }
      o && s.push(o), o = c;
    }
    n.length > 1;
  }
  return s.push(o), s.join(`
`);
}, zm = (e, t, r) => {
  const s = e.map((n) => Wm(n, t, r)).join(`
`).split(`
`), o = Math.max(...s.map((n) => li(n, t))), a = s.length * t * Rm;
  return {
    width: o,
    height: a
  };
}, Hm = (e, t, r, i) => {
  const s = e.split(`
`);
  for (let o = Pi; o >= _d; o -= Im) {
    const { height: a } = zm(s, o, t);
    if (a <= r)
      return o;
  }
  return i;
}, Ym = (e) => {
  const t = Fd(e);
  if (!t || Ld.has(e.shape))
    return Pi;
  const r = Math.max(1, e.width - Dm), i = Math.max(1, e.height - Pm), s = t.split(`
`);
  return s.length > 1 && Math.max(...s.map((a) => li(a, Pi))) <= r ? Pi : Hm(t, r, i, s.length === 1 ? Pi : _d);
}, Xm = (e) => {
  if (Ld.has(e.shape))
    return;
  const t = Fd(e);
  if (t)
    return {
      text: t,
      fontSize: Ym(e),
      verticalAlign: e.shape === "rectWithTitle" || e.shape === "roundedWithTitle" ? "top" : "middle",
      ...Da(e.labelStyle)
    };
}, jm = (e) => {
  const t = ts(e.containerStyle), r = Xm(e), i = e.shape === "choice" ? "diamond" : e.shape === "stateStart" || e.shape === "stateEnd" ? "ellipse" : "rectangle", s = e.shape === "rect" || e.shape === "rectWithTitle" || e.shape === "roundedWithTitle", o = e.shape === "stateStart" || e.shape === "fork" || e.shape === "join", a = t.backgroundColor || t.strokeColor || Pa, n = t.strokeColor || t.backgroundColor || Pa;
  return {
    id: e.id,
    type: i,
    ...Ra(e) ? { groupIds: Ra(e) } : {},
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
}, Um = (e) => {
  if (!e.dividerLine)
    return null;
  const t = ts(e.containerStyle);
  return {
    id: `${e.id}__divider`,
    type: "line",
    x: e.dividerLine.startX,
    y: e.dividerLine.startY,
    width: e.dividerLine.endX - e.dividerLine.startX,
    height: e.dividerLine.endY - e.dividerLine.startY,
    points: [
      Vs(0, 0),
      Vs(e.dividerLine.endX - e.dividerLine.startX, e.dividerLine.endY - e.dividerLine.startY)
    ],
    strokeColor: t.strokeColor || "#000",
    strokeWidth: t.strokeWidth || 1
  };
}, Gm = (e) => {
  const t = ts(e.containerStyle), r = Math.max(2, Math.min(e.width, e.height) * 0.32), i = e.endInnerColor || t.strokeColor || t.backgroundColor || Pa;
  return {
    id: `${e.id}__inner`,
    type: "ellipse",
    groupIds: Ra(e),
    x: e.x + r,
    y: e.y + r,
    width: Math.max(1, e.width - r * 2),
    height: Math.max(1, e.height - r * 2),
    backgroundColor: i,
    strokeColor: i,
    fillStyle: "solid",
    strokeWidth: 1
  };
}, Vm = (e) => {
  const t = e.reflectionPoints.map((r, i, s) => {
    const o = s[0];
    return i === 0 ? Vs(0, 0) : Vs(r.x - o.x, r.y - o.y);
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
}, Km = new gi({
  converter: (e) => {
    const t = [];
    return e.nodes.forEach((r) => {
      if (!r.isRenderable)
        return;
      const i = jm(r);
      t.push(i);
      const s = Um(r);
      s && t.push(s), r.shape === "stateEnd" && t.push(Gm(r));
    }), e.edges.forEach((r) => {
      t.push(Vm(r));
    }), { elements: t };
  }
}), se = (e) => {
  e = Qm(e);
  const t = e.replace(/#(\d+);/g, "&#$1;").replace(/#([a-z]+);/g, "&$1;"), r = document.createElement("textarea");
  return r.innerHTML = t, r.value;
}, gr = (e) => {
  const r = e.getAttribute("transform")?.match(/translate\(([ \d.-]+),\s*([\d.-]+)\)/);
  let i = 0, s = 0;
  return r && (i = Number(r[1]), s = Number(r[2])), { transformX: i, transformY: s };
}, Zm = (e) => {
  let t = e;
  return t = t.replace(/style.*:\S*#.*;/g, (r) => r.substring(0, r.length - 1)), t = t.replace(/classDef.*:\S*#.*;/g, (r) => r.substring(0, r.length - 1)), t = t.replace(/#\w+;/g, (r) => {
    const i = r.substring(1, r.length - 1);
    return /^\+?\d+$/.test(i) ? `ﬂ°°${i}¶ß` : `ﬂ°${i}¶ß`;
  }), t;
}, Qm = function(e) {
  return e.replace(/ﬂ°°/g, "#").replace(/ﬂ°/g, "&").replace(/¶ß/g, ";");
}, Jm = 0.5, An = (e, t = Jm) => {
  const r = [];
  return e.forEach((i) => {
    const s = r[r.length - 1];
    if (!s) {
      r.push(i);
      return;
    }
    Math.hypot(i[0] - s[0], i[1] - s[1]) <= t || r.push(i);
  }), r;
}, En = (e) => {
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
}, Ad = (e) => {
  const t = e.getAttribute("data-points");
  if (!t) {
    const r = En(e);
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
}, Ed = (e, t = { x: 0, y: 0 }, r = "LM") => {
  if (e.tagName.toLowerCase() !== "path")
    throw new Error(`Invalid input: Expected an HTMLElement of tag "path", got ${e.tagName}`);
  const i = e.getAttribute("d");
  if (!i)
    throw new Error('Path element does not contain a "d" attribute');
  const s = i.split(new RegExp(`(?=[${r}])`)), o = s[0].substring(1).split(",").map((l) => parseFloat(l)), a = s[s.length - 1].substring(1).split(",").map((l) => parseFloat(l)), n = s.map((l) => {
    const c = l[0], h = l.substring(1).split(",").map((d) => parseFloat(d));
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
      const d = h[h.length - 1];
      return Math.hypot(d.x - l.x, d.y - l.y) > 20;
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
}, t0 = (e) => ({
  ...e,
  elements: e.elements.map((t) => {
    if (!("points" in t) || !Array.isArray(t.points))
      return t;
    const r = t.points;
    if (r.length < 2)
      return t;
    const i = An(r);
    return i.length === r.length ? t : {
      ...t,
      points: i
    };
  })
}), e0 = (e, t = {}) => {
  const r = (() => {
    switch (e.type) {
      case "graphImage":
        return vm.convert(e, t);
      case "flowchart":
        return _m.convert(e, t);
      case "sequence":
        return Mm.convert(e, t);
      case "class":
        return $m.convert(e, t);
      case "erd":
        return Om.convert(e, t);
      case "state":
        return Km.convert(e, t);
      default:
        throw new Error(`graphToExcalidraw: unknown graph type "${e.type}, only flowcharts are supported!"`);
    }
  })();
  return t0(r);
};
var Md = Object.defineProperty, p = (e, t) => Md(e, "name", { value: t, configurable: !0 }), r0 = (e, t) => {
  for (var r in t)
    Md(e, r, { get: t[r], enumerable: !0 });
}, i0 = dm();
const s0 = /* @__PURE__ */ vn(i0);
var Re = {
  trace: 0,
  debug: 1,
  info: 2,
  warn: 3,
  error: 4,
  fatal: 5
}, M = {
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
}, Mn = /* @__PURE__ */ p(function(e = "fatal") {
  let t = Re.fatal;
  typeof e == "string" ? e.toLowerCase() in Re && (t = Re[e]) : typeof e == "number" && (t = e), M.trace = () => {
  }, M.debug = () => {
  }, M.info = () => {
  }, M.warn = () => {
  }, M.error = () => {
  }, M.fatal = () => {
  }, t <= Re.fatal && (M.fatal = console.error ? console.error.bind(console, ne("FATAL"), "color: orange") : console.log.bind(console, "\x1B[35m", ne("FATAL"))), t <= Re.error && (M.error = console.error ? console.error.bind(console, ne("ERROR"), "color: orange") : console.log.bind(console, "\x1B[31m", ne("ERROR"))), t <= Re.warn && (M.warn = console.warn ? console.warn.bind(console, ne("WARN"), "color: orange") : console.log.bind(console, "\x1B[33m", ne("WARN"))), t <= Re.info && (M.info = console.info ? console.info.bind(console, ne("INFO"), "color: lightblue") : console.log.bind(console, "\x1B[34m", ne("INFO"))), t <= Re.debug && (M.debug = console.debug ? console.debug.bind(console, ne("DEBUG"), "color: lightgreen") : console.log.bind(console, "\x1B[32m", ne("DEBUG"))), t <= Re.trace && (M.trace = console.debug ? console.debug.bind(console, ne("TRACE"), "color: lightgreen") : console.log.bind(console, "\x1B[32m", ne("TRACE")));
}, "setLogLevel"), ne = /* @__PURE__ */ p((e) => `%c${s0().format("ss.SSS")} : ${e} : `, "format");
const Ps = {
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
        return Ps.hue2rgb(o, s, e + 1 / 3) * 255;
      case "g":
        return Ps.hue2rgb(o, s, e) * 255;
      case "b":
        return Ps.hue2rgb(o, s, e - 1 / 3) * 255;
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
}, o0 = {
  /* API */
  clamp: (e, t, r) => t > r ? Math.min(t, Math.max(r, e)) : Math.min(r, Math.max(t, e)),
  round: (e) => Math.round(e * 1e10) / 1e10
}, a0 = {
  /* API */
  dec2hex: (e) => {
    const t = Math.round(e).toString(16);
    return t.length > 1 ? t : `0${t}`;
  }
}, yt = {
  channel: Ps,
  lang: o0,
  unit: a0
}, Ge = {};
for (let e = 0; e <= 255; e++)
  Ge[e] = yt.unit.dec2hex(e);
const Gt = {
  ALL: 0,
  RGB: 1,
  HSL: 2
};
let n0 = class {
  constructor() {
    this.type = Gt.ALL;
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
    this.type = Gt.ALL;
  }
  is(t) {
    return this.type === t;
  }
};
class l0 {
  /* CONSTRUCTOR */
  constructor(t, r) {
    this.color = r, this.changed = !1, this.data = t, this.type = new n0();
  }
  /* API */
  set(t, r) {
    return this.color = r, this.changed = !1, this.data = t, this.type.type = Gt.ALL, this;
  }
  /* HELPERS */
  _ensureHSL() {
    const t = this.data, { h: r, s: i, l: s } = t;
    r === void 0 && (t.h = yt.channel.rgb2hsl(t, "h")), i === void 0 && (t.s = yt.channel.rgb2hsl(t, "s")), s === void 0 && (t.l = yt.channel.rgb2hsl(t, "l"));
  }
  _ensureRGB() {
    const t = this.data, { r, g: i, b: s } = t;
    r === void 0 && (t.r = yt.channel.hsl2rgb(t, "r")), i === void 0 && (t.g = yt.channel.hsl2rgb(t, "g")), s === void 0 && (t.b = yt.channel.hsl2rgb(t, "b"));
  }
  /* GETTERS */
  get r() {
    const t = this.data, r = t.r;
    return !this.type.is(Gt.HSL) && r !== void 0 ? r : (this._ensureHSL(), yt.channel.hsl2rgb(t, "r"));
  }
  get g() {
    const t = this.data, r = t.g;
    return !this.type.is(Gt.HSL) && r !== void 0 ? r : (this._ensureHSL(), yt.channel.hsl2rgb(t, "g"));
  }
  get b() {
    const t = this.data, r = t.b;
    return !this.type.is(Gt.HSL) && r !== void 0 ? r : (this._ensureHSL(), yt.channel.hsl2rgb(t, "b"));
  }
  get h() {
    const t = this.data, r = t.h;
    return !this.type.is(Gt.RGB) && r !== void 0 ? r : (this._ensureRGB(), yt.channel.rgb2hsl(t, "h"));
  }
  get s() {
    const t = this.data, r = t.s;
    return !this.type.is(Gt.RGB) && r !== void 0 ? r : (this._ensureRGB(), yt.channel.rgb2hsl(t, "s"));
  }
  get l() {
    const t = this.data, r = t.l;
    return !this.type.is(Gt.RGB) && r !== void 0 ? r : (this._ensureRGB(), yt.channel.rgb2hsl(t, "l"));
  }
  get a() {
    return this.data.a;
  }
  /* SETTERS */
  set r(t) {
    this.type.set(Gt.RGB), this.changed = !0, this.data.r = t;
  }
  set g(t) {
    this.type.set(Gt.RGB), this.changed = !0, this.data.g = t;
  }
  set b(t) {
    this.type.set(Gt.RGB), this.changed = !0, this.data.b = t;
  }
  set h(t) {
    this.type.set(Gt.HSL), this.changed = !0, this.data.h = t;
  }
  set s(t) {
    this.type.set(Gt.HSL), this.changed = !0, this.data.s = t;
  }
  set l(t) {
    this.type.set(Gt.HSL), this.changed = !0, this.data.l = t;
  }
  set a(t) {
    this.changed = !0, this.data.a = t;
  }
}
const Bo = new l0({ r: 0, g: 0, b: 0, a: 0 }, "transparent"), Hr = {
  /* VARIABLES */
  re: /^#((?:[a-f0-9]{2}){2,4}|[a-f0-9]{3})$/i,
  /* API */
  parse: (e) => {
    if (e.charCodeAt(0) !== 35)
      return;
    const t = e.match(Hr.re);
    if (!t)
      return;
    const r = t[1], i = parseInt(r, 16), s = r.length, o = s % 4 === 0, a = s > 4, n = a ? 1 : 17, l = a ? 8 : 4, c = o ? 0 : -1, h = a ? 255 : 15;
    return Bo.set({
      r: (i >> l * (c + 3) & h) * n,
      g: (i >> l * (c + 2) & h) * n,
      b: (i >> l * (c + 1) & h) * n,
      a: o ? (i & h) * n / 255 : 1
    }, e);
  },
  stringify: (e) => {
    const { r: t, g: r, b: i, a: s } = e;
    return s < 1 ? `#${Ge[Math.round(t)]}${Ge[Math.round(r)]}${Ge[Math.round(i)]}${Ge[Math.round(s * 255)]}` : `#${Ge[Math.round(t)]}${Ge[Math.round(r)]}${Ge[Math.round(i)]}`;
  }
}, cr = {
  /* VARIABLES */
  re: /^hsla?\(\s*?(-?(?:\d+(?:\.\d+)?|(?:\.\d+))(?:e-?\d+)?(?:deg|grad|rad|turn)?)\s*?(?:,|\s)\s*?(-?(?:\d+(?:\.\d+)?|(?:\.\d+))(?:e-?\d+)?%)\s*?(?:,|\s)\s*?(-?(?:\d+(?:\.\d+)?|(?:\.\d+))(?:e-?\d+)?%)(?:\s*?(?:,|\/)\s*?\+?(-?(?:\d+(?:\.\d+)?|(?:\.\d+))(?:e-?\d+)?(%)?))?\s*?\)$/i,
  hueRe: /^(.+?)(deg|grad|rad|turn)$/i,
  /* HELPERS */
  _hue2deg: (e) => {
    const t = e.match(cr.hueRe);
    if (t) {
      const [, r, i] = t;
      switch (i) {
        case "grad":
          return yt.channel.clamp.h(parseFloat(r) * 0.9);
        case "rad":
          return yt.channel.clamp.h(parseFloat(r) * 180 / Math.PI);
        case "turn":
          return yt.channel.clamp.h(parseFloat(r) * 360);
      }
    }
    return yt.channel.clamp.h(parseFloat(e));
  },
  /* API */
  parse: (e) => {
    const t = e.charCodeAt(0);
    if (t !== 104 && t !== 72)
      return;
    const r = e.match(cr.re);
    if (!r)
      return;
    const [, i, s, o, a, n] = r;
    return Bo.set({
      h: cr._hue2deg(i),
      s: yt.channel.clamp.s(parseFloat(s)),
      l: yt.channel.clamp.l(parseFloat(o)),
      a: a ? yt.channel.clamp.a(n ? parseFloat(a) / 100 : parseFloat(a)) : 1
    }, e);
  },
  stringify: (e) => {
    const { h: t, s: r, l: i, a: s } = e;
    return s < 1 ? `hsla(${yt.lang.round(t)}, ${yt.lang.round(r)}%, ${yt.lang.round(i)}%, ${s})` : `hsl(${yt.lang.round(t)}, ${yt.lang.round(r)}%, ${yt.lang.round(i)}%)`;
  }
}, Gi = {
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
    const t = Gi.colors[e];
    if (t)
      return Hr.parse(t);
  },
  stringify: (e) => {
    const t = Hr.stringify(e);
    for (const r in Gi.colors)
      if (Gi.colors[r] === t)
        return r;
  }
}, Ri = {
  /* VARIABLES */
  re: /^rgba?\(\s*?(-?(?:\d+(?:\.\d+)?|(?:\.\d+))(?:e\d+)?(%?))\s*?(?:,|\s)\s*?(-?(?:\d+(?:\.\d+)?|(?:\.\d+))(?:e\d+)?(%?))\s*?(?:,|\s)\s*?(-?(?:\d+(?:\.\d+)?|(?:\.\d+))(?:e\d+)?(%?))(?:\s*?(?:,|\/)\s*?\+?(-?(?:\d+(?:\.\d+)?|(?:\.\d+))(?:e\d+)?(%?)))?\s*?\)$/i,
  /* API */
  parse: (e) => {
    const t = e.charCodeAt(0);
    if (t !== 114 && t !== 82)
      return;
    const r = e.match(Ri.re);
    if (!r)
      return;
    const [, i, s, o, a, n, l, c, h] = r;
    return Bo.set({
      r: yt.channel.clamp.r(s ? parseFloat(i) * 2.55 : parseFloat(i)),
      g: yt.channel.clamp.g(a ? parseFloat(o) * 2.55 : parseFloat(o)),
      b: yt.channel.clamp.b(l ? parseFloat(n) * 2.55 : parseFloat(n)),
      a: c ? yt.channel.clamp.a(h ? parseFloat(c) / 100 : parseFloat(c)) : 1
    }, e);
  },
  stringify: (e) => {
    const { r: t, g: r, b: i, a: s } = e;
    return s < 1 ? `rgba(${yt.lang.round(t)}, ${yt.lang.round(r)}, ${yt.lang.round(i)}, ${yt.lang.round(s)})` : `rgb(${yt.lang.round(t)}, ${yt.lang.round(r)}, ${yt.lang.round(i)})`;
  }
}, Ee = {
  /* VARIABLES */
  format: {
    keyword: Gi,
    hex: Hr,
    rgb: Ri,
    rgba: Ri,
    hsl: cr,
    hsla: cr
  },
  /* API */
  parse: (e) => {
    if (typeof e != "string")
      return e;
    const t = Hr.parse(e) || Ri.parse(e) || cr.parse(e) || Gi.parse(e);
    if (t)
      return t;
    throw new Error(`Unsupported color format: "${e}"`);
  },
  stringify: (e) => !e.changed && e.color ? e.color : e.type.is(Gt.HSL) || e.data.r === void 0 ? cr.stringify(e) : e.a < 1 || !Number.isInteger(e.r) || !Number.isInteger(e.g) || !Number.isInteger(e.b) ? Ri.stringify(e) : Hr.stringify(e)
}, $d = (e, t) => {
  const r = Ee.parse(e);
  for (const i in t)
    r[i] = yt.channel.clamp[i](t[i]);
  return Ee.stringify(r);
}, Je = (e, t, r = 0, i = 1) => {
  if (typeof e != "number")
    return $d(e, { a: t });
  const s = Bo.set({
    r: yt.channel.clamp.r(e),
    g: yt.channel.clamp.g(t),
    b: yt.channel.clamp.b(r),
    a: yt.channel.clamp.a(i)
  });
  return Ee.stringify(s);
}, h0 = (e) => {
  const { r: t, g: r, b: i } = Ee.parse(e), s = 0.2126 * yt.channel.toLinear(t) + 0.7152 * yt.channel.toLinear(r) + 0.0722 * yt.channel.toLinear(i);
  return yt.lang.round(s);
}, c0 = (e) => h0(e) >= 0.5, be = (e) => !c0(e), Od = (e, t, r) => {
  const i = Ee.parse(e), s = i[t], o = yt.channel.clamp[t](s + r);
  return s !== o && (i[t] = o), Ee.stringify(i);
}, O = (e, t) => Od(e, "l", t), I = (e, t) => Od(e, "l", -t), k = (e, t) => {
  const r = Ee.parse(e), i = {};
  for (const s in t)
    t[s] && (i[s] = r[s] + t[s]);
  return $d(e, i);
}, d0 = (e, t, r = 50) => {
  const { r: i, g: s, b: o, a } = Ee.parse(e), { r: n, g: l, b: c, a: h } = Ee.parse(t), d = r / 100, u = d * 2 - 1, f = a - h, m = ((u * f === -1 ? u : (u + f) / (1 + u * f)) + 1) / 2, x = 1 - m, C = i * m + n * x, b = s * m + l * x, w = o * m + c * x, T = a * d + h * (1 - d);
  return Je(C, b, w, T);
}, F = (e, t = 100) => {
  const r = Ee.parse(e);
  return r.r = 255 - r.r, r.g = 255 - r.g, r.b = 255 - r.b, d0(r, e, t);
};
var qa = /* @__PURE__ */ p((e, t, { depth: r = 2 } = {}) => {
  const i = { depth: r };
  if (Array.isArray(t) && !Array.isArray(e))
    return t.forEach((s) => qa(e, s, i)), e;
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
        }), s[o] === void 0 && (s[o] = Array.isArray(a) ? [] : {}), typeof s[o] == "object" && (s[o] = qa(s[o], a, { depth: r - 1 }));
      } else typeof s[o] != "object" && (Object.hasOwn(e, o) ? s[o] = a : Object.defineProperty(e, o, {
        value: a,
        writable: !0,
        enumerable: !0,
        configurable: !0
      }));
    });
  }
  return e;
}, "assignWithDepth"), Ht = qa, Me = "#ffffff", $e = "#f2f2f2", gt = /* @__PURE__ */ p((e, t) => t ? k(e, { s: -40, l: 10 }) : k(e, { s: -40, l: -10 }), "mkBorder"), jr, u0 = (jr = class {
  constructor() {
    this.background = "#f4f4f4", this.primaryColor = "#fff4dd", this.noteBkgColor = "#fff5ad", this.noteTextColor = "#333", this.THEME_COLOR_LIMIT = 12, this.radius = 5, this.strokeWidth = 1, this.fontFamily = '"trebuchet ms", verdana, arial, sans-serif', this.fontSize = "16px", this.useGradient = !0, this.dropShadow = "drop-shadow( 1px 2px 2px rgba(185,185,185,1))";
  }
  updateColors() {
    if (this.primaryTextColor = this.primaryTextColor || (this.darkMode ? "#eee" : "#333"), this.secondaryColor = this.secondaryColor || k(this.primaryColor, { h: -120 }), this.tertiaryColor = this.tertiaryColor || k(this.primaryColor, { h: 180, l: 5 }), this.primaryBorderColor = this.primaryBorderColor || gt(this.primaryColor, this.darkMode), this.secondaryBorderColor = this.secondaryBorderColor || gt(this.secondaryColor, this.darkMode), this.tertiaryBorderColor = this.tertiaryBorderColor || gt(this.tertiaryColor, this.darkMode), this.noteBorderColor = this.noteBorderColor || gt(this.noteBkgColor, this.darkMode), this.noteBkgColor = this.noteBkgColor || "#fff5ad", this.noteTextColor = this.noteTextColor || "#333", this.secondaryTextColor = this.secondaryTextColor || F(this.secondaryColor), this.tertiaryTextColor = this.tertiaryTextColor || F(this.tertiaryColor), this.lineColor = this.lineColor || F(this.background), this.arrowheadColor = this.arrowheadColor || F(this.background), this.textColor = this.textColor || this.primaryTextColor, this.border2 = this.border2 || this.tertiaryBorderColor, this.nodeBkg = this.nodeBkg || this.primaryColor, this.mainBkg = this.mainBkg || this.primaryColor, this.nodeBorder = this.nodeBorder || this.primaryBorderColor, this.clusterBkg = this.clusterBkg || this.tertiaryColor, this.clusterBorder = this.clusterBorder || this.tertiaryBorderColor, this.defaultLinkColor = this.defaultLinkColor || this.lineColor, this.titleColor = this.titleColor || this.tertiaryTextColor, this.edgeLabelBackground = this.edgeLabelBackground || (this.darkMode ? I(this.secondaryColor, 30) : this.secondaryColor), this.nodeTextColor = this.nodeTextColor || this.primaryTextColor, this.actorBorder = this.actorBorder || this.primaryBorderColor, this.actorBkg = this.actorBkg || this.mainBkg, this.actorTextColor = this.actorTextColor || this.primaryTextColor, this.actorLineColor = this.actorLineColor || this.actorBorder, this.labelBoxBkgColor = this.labelBoxBkgColor || this.actorBkg, this.signalColor = this.signalColor || this.textColor, this.signalTextColor = this.signalTextColor || this.textColor, this.labelBoxBorderColor = this.labelBoxBorderColor || this.actorBorder, this.labelTextColor = this.labelTextColor || this.actorTextColor, this.loopTextColor = this.loopTextColor || this.actorTextColor, this.activationBorderColor = this.activationBorderColor || I(this.secondaryColor, 10), this.activationBkgColor = this.activationBkgColor || this.secondaryColor, this.sequenceNumberColor = this.sequenceNumberColor || F(this.lineColor), this.rectBkgColor = this.rectBkgColor || this.tertiaryColor, this.sectionBkgColor = this.sectionBkgColor || this.tertiaryColor, this.altSectionBkgColor = this.altSectionBkgColor || "white", this.sectionBkgColor = this.sectionBkgColor || this.secondaryColor, this.sectionBkgColor2 = this.sectionBkgColor2 || this.primaryColor, this.excludeBkgColor = this.excludeBkgColor || "#eeeeee", this.taskBorderColor = this.taskBorderColor || this.primaryBorderColor, this.taskBkgColor = this.taskBkgColor || this.primaryColor, this.activeTaskBorderColor = this.activeTaskBorderColor || this.primaryColor, this.activeTaskBkgColor = this.activeTaskBkgColor || O(this.primaryColor, 23), this.gridColor = this.gridColor || "lightgrey", this.doneTaskBkgColor = this.doneTaskBkgColor || "lightgrey", this.doneTaskBorderColor = this.doneTaskBorderColor || "grey", this.critBorderColor = this.critBorderColor || "#ff8888", this.critBkgColor = this.critBkgColor || "red", this.todayLineColor = this.todayLineColor || "red", this.vertLineColor = this.vertLineColor || "navy", this.taskTextColor = this.taskTextColor || this.textColor, this.taskTextOutsideColor = this.taskTextOutsideColor || this.textColor, this.taskTextLightColor = this.taskTextLightColor || this.textColor, this.taskTextColor = this.taskTextColor || this.primaryTextColor, this.taskTextDarkColor = this.taskTextDarkColor || this.textColor, this.taskTextClickableColor = this.taskTextClickableColor || "#003163", this.noteFontWeight = this.noteFontWeight || "normal", this.fontWeight = this.fontWeight || "normal", this.personBorder = this.personBorder || this.primaryBorderColor, this.personBkg = this.personBkg || this.mainBkg, this.darkMode ? (this.rowOdd = this.rowOdd || I(this.mainBkg, 5) || "#ffffff", this.rowEven = this.rowEven || I(this.mainBkg, 10)) : (this.rowOdd = this.rowOdd || O(this.mainBkg, 75) || "#ffffff", this.rowEven = this.rowEven || O(this.mainBkg, 5)), this.transitionColor = this.transitionColor || this.lineColor, this.transitionLabelColor = this.transitionLabelColor || this.textColor, this.stateLabelColor = this.stateLabelColor || this.stateBkg || this.primaryTextColor, this.stateBkg = this.stateBkg || this.mainBkg, this.labelBackgroundColor = this.labelBackgroundColor || this.stateBkg, this.compositeBackground = this.compositeBackground || this.background || this.tertiaryColor, this.altBackground = this.altBackground || this.tertiaryColor, this.compositeTitleBackground = this.compositeTitleBackground || this.mainBkg, this.compositeBorder = this.compositeBorder || this.nodeBorder, this.innerEndBackground = this.nodeBorder, this.errorBkgColor = this.errorBkgColor || this.tertiaryColor, this.errorTextColor = this.errorTextColor || this.tertiaryTextColor, this.transitionColor = this.transitionColor || this.lineColor, this.specialStateColor = this.lineColor, this.cScale0 = this.cScale0 || this.primaryColor, this.cScale1 = this.cScale1 || this.secondaryColor, this.cScale2 = this.cScale2 || this.tertiaryColor, this.cScale3 = this.cScale3 || k(this.primaryColor, { h: 30 }), this.cScale4 = this.cScale4 || k(this.primaryColor, { h: 60 }), this.cScale5 = this.cScale5 || k(this.primaryColor, { h: 90 }), this.cScale6 = this.cScale6 || k(this.primaryColor, { h: 120 }), this.cScale7 = this.cScale7 || k(this.primaryColor, { h: 150 }), this.cScale8 = this.cScale8 || k(this.primaryColor, { h: 210, l: 150 }), this.cScale9 = this.cScale9 || k(this.primaryColor, { h: 270 }), this.cScale10 = this.cScale10 || k(this.primaryColor, { h: 300 }), this.cScale11 = this.cScale11 || k(this.primaryColor, { h: 330 }), this.darkMode)
      for (let r = 0; r < this.THEME_COLOR_LIMIT; r++)
        this["cScale" + r] = I(this["cScale" + r], 75);
    else
      for (let r = 0; r < this.THEME_COLOR_LIMIT; r++)
        this["cScale" + r] = I(this["cScale" + r], 25);
    for (let r = 0; r < this.THEME_COLOR_LIMIT; r++)
      this["cScaleInv" + r] = this["cScaleInv" + r] || F(this["cScale" + r]);
    for (let r = 0; r < this.THEME_COLOR_LIMIT; r++)
      this.darkMode ? this["cScalePeer" + r] = this["cScalePeer" + r] || O(this["cScale" + r], 10) : this["cScalePeer" + r] = this["cScalePeer" + r] || I(this["cScale" + r], 10);
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
    }, this.archEdgeColor = this.archEdgeColor || "#777", this.archEdgeArrowColor = this.archEdgeArrowColor || "#777", this.archEdgeWidth = this.archEdgeWidth || "3", this.archGroupBorderColor = this.archGroupBorderColor || "#000", this.archGroupBorderWidth = this.archGroupBorderWidth || "2px", this.quadrant1Fill = this.quadrant1Fill || this.primaryColor, this.quadrant2Fill = this.quadrant2Fill || k(this.primaryColor, { r: 5, g: 5, b: 5 }), this.quadrant3Fill = this.quadrant3Fill || k(this.primaryColor, { r: 10, g: 10, b: 10 }), this.quadrant4Fill = this.quadrant4Fill || k(this.primaryColor, { r: 15, g: 15, b: 15 }), this.quadrant1TextFill = this.quadrant1TextFill || this.primaryTextColor, this.quadrant2TextFill = this.quadrant2TextFill || k(this.primaryTextColor, { r: -5, g: -5, b: -5 }), this.quadrant3TextFill = this.quadrant3TextFill || k(this.primaryTextColor, { r: -10, g: -10, b: -10 }), this.quadrant4TextFill = this.quadrant4TextFill || k(this.primaryTextColor, { r: -15, g: -15, b: -15 }), this.quadrantPointFill = this.quadrantPointFill || be(this.quadrant1Fill) ? O(this.quadrant1Fill) : I(this.quadrant1Fill), this.quadrantPointTextFill = this.quadrantPointTextFill || this.primaryTextColor, this.quadrantXAxisTextFill = this.quadrantXAxisTextFill || this.primaryTextColor, this.quadrantYAxisTextFill = this.quadrantYAxisTextFill || this.primaryTextColor, this.quadrantInternalBorderStrokeFill = this.quadrantInternalBorderStrokeFill || this.primaryBorderColor, this.quadrantExternalBorderStrokeFill = this.quadrantExternalBorderStrokeFill || this.primaryBorderColor, this.quadrantTitleFill = this.quadrantTitleFill || this.primaryTextColor, this.xyChart = {
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
    }, this.requirementBackground = this.requirementBackground || this.primaryColor, this.requirementBorderColor = this.requirementBorderColor || this.primaryBorderColor, this.requirementBorderSize = this.requirementBorderSize || "1", this.requirementTextColor = this.requirementTextColor || this.primaryTextColor, this.relationColor = this.relationColor || this.lineColor, this.relationLabelBackground = this.relationLabelBackground || (this.darkMode ? I(this.secondaryColor, 30) : this.secondaryColor), this.relationLabelColor = this.relationLabelColor || this.actorTextColor, this.git0 = this.git0 || this.primaryColor, this.git1 = this.git1 || this.secondaryColor, this.git2 = this.git2 || this.tertiaryColor, this.git3 = this.git3 || k(this.primaryColor, { h: -30 }), this.git4 = this.git4 || k(this.primaryColor, { h: -60 }), this.git5 = this.git5 || k(this.primaryColor, { h: -90 }), this.git6 = this.git6 || k(this.primaryColor, { h: 60 }), this.git7 = this.git7 || k(this.primaryColor, { h: 120 }), this.darkMode ? (this.git0 = O(this.git0, 25), this.git1 = O(this.git1, 25), this.git2 = O(this.git2, 25), this.git3 = O(this.git3, 25), this.git4 = O(this.git4, 25), this.git5 = O(this.git5, 25), this.git6 = O(this.git6, 25), this.git7 = O(this.git7, 25)) : (this.git0 = I(this.git0, 25), this.git1 = I(this.git1, 25), this.git2 = I(this.git2, 25), this.git3 = I(this.git3, 25), this.git4 = I(this.git4, 25), this.git5 = I(this.git5, 25), this.git6 = I(this.git6, 25), this.git7 = I(this.git7, 25)), this.gitInv0 = this.gitInv0 || F(this.git0), this.gitInv1 = this.gitInv1 || F(this.git1), this.gitInv2 = this.gitInv2 || F(this.git2), this.gitInv3 = this.gitInv3 || F(this.git3), this.gitInv4 = this.gitInv4 || F(this.git4), this.gitInv5 = this.gitInv5 || F(this.git5), this.gitInv6 = this.gitInv6 || F(this.git6), this.gitInv7 = this.gitInv7 || F(this.git7), this.branchLabelColor = this.branchLabelColor || (this.darkMode ? "black" : this.labelTextColor), this.gitBranchLabel0 = this.gitBranchLabel0 || this.branchLabelColor, this.gitBranchLabel1 = this.gitBranchLabel1 || this.branchLabelColor, this.gitBranchLabel2 = this.gitBranchLabel2 || this.branchLabelColor, this.gitBranchLabel3 = this.gitBranchLabel3 || this.branchLabelColor, this.gitBranchLabel4 = this.gitBranchLabel4 || this.branchLabelColor, this.gitBranchLabel5 = this.gitBranchLabel5 || this.branchLabelColor, this.gitBranchLabel6 = this.gitBranchLabel6 || this.branchLabelColor, this.gitBranchLabel7 = this.gitBranchLabel7 || this.branchLabelColor, this.tagLabelColor = this.tagLabelColor || this.primaryTextColor, this.tagLabelBackground = this.tagLabelBackground || this.primaryColor, this.tagLabelBorder = this.tagBorder || this.primaryBorderColor, this.tagLabelFontSize = this.tagLabelFontSize || "10px", this.commitLabelColor = this.commitLabelColor || this.secondaryTextColor, this.commitLabelBackground = this.commitLabelBackground || this.secondaryColor, this.commitLabelFontSize = this.commitLabelFontSize || "10px", this.emUiFill = this.emUiFill || "white", this.emUiStroke = this.emUiStroke || "#dbdada", this.emProcessorFill = this.emProcessorFill || "#edb3f6", this.emProcessorStroke = this.emProcessorStroke || "#b88cbf", this.emReadModelFill = this.emReadModelFill || "#d3f1a2", this.emReadModelStroke = this.emReadModelStroke || "#a3b732", this.emCommandFill = this.emCommandFill || "#bcd6fe", this.emCommandStroke = this.emCommandStroke || "#679ac3", this.emEventFill = this.emEventFill || "#ffb778", this.emEventStroke = this.emEventStroke || "#c19a0f", this.emSwimlaneBackgroundOdd = this.emSwimlaneBackgroundOdd || "rgb(250,250,250)", this.emSwimlaneBackgroundStroke = this.emSwimlaneBackgroundStroke || "rgb(240,240,240)", this.emArrowhead = this.emArrowhead || this.lineColor, this.emRelationStroke = this.emRelationStroke || this.lineColor, this.attributeBackgroundColorOdd = this.attributeBackgroundColorOdd || Me, this.attributeBackgroundColorEven = this.attributeBackgroundColorEven || $e, this.gradientStart = this.primaryBorderColor, this.gradientStop = this.secondaryBorderColor;
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
}, p(jr, "Theme"), jr), f0 = /* @__PURE__ */ p((e) => {
  const t = new u0();
  return t.calculate(e), t;
}, "getThemeVariables"), Ur, p0 = (Ur = class {
  constructor() {
    this.background = "#333", this.primaryColor = "#1f2020", this.secondaryColor = O(this.primaryColor, 16), this.tertiaryColor = k(this.primaryColor, { h: -160 }), this.primaryBorderColor = F(this.background), this.secondaryBorderColor = gt(this.secondaryColor, this.darkMode), this.tertiaryBorderColor = gt(this.tertiaryColor, this.darkMode), this.primaryTextColor = F(this.primaryColor), this.secondaryTextColor = F(this.secondaryColor), this.tertiaryTextColor = F(this.tertiaryColor), this.lineColor = F(this.background), this.textColor = F(this.background), this.mainBkg = "#1f2020", this.secondBkg = "calculated", this.mainContrastColor = "lightgrey", this.darkTextColor = O(F("#323D47"), 10), this.lineColor = "calculated", this.border1 = "#ccc", this.border2 = Je(255, 255, 255, 0.25), this.arrowheadColor = "calculated", this.fontFamily = '"trebuchet ms", verdana, arial, sans-serif', this.fontSize = "16px", this.labelBackground = "#181818", this.textColor = "#ccc", this.THEME_COLOR_LIMIT = 12, this.radius = 5, this.strokeWidth = 1, this.nodeBkg = "calculated", this.nodeBorder = "calculated", this.clusterBkg = "calculated", this.clusterBorder = "calculated", this.defaultLinkColor = "calculated", this.titleColor = "#F9FFFE", this.edgeLabelBackground = "calculated", this.actorBorder = "calculated", this.actorBkg = "calculated", this.actorTextColor = "calculated", this.actorLineColor = "calculated", this.signalColor = "calculated", this.signalTextColor = "calculated", this.labelBoxBkgColor = "calculated", this.labelBoxBorderColor = "calculated", this.labelTextColor = "calculated", this.loopTextColor = "calculated", this.noteBorderColor = "calculated", this.noteBkgColor = "#fff5ad", this.noteTextColor = "calculated", this.activationBorderColor = "calculated", this.activationBkgColor = "calculated", this.sequenceNumberColor = "black", this.clusterBkg = "#302F3D", this.sectionBkgColor = I("#EAE8D9", 30), this.altSectionBkgColor = "calculated", this.sectionBkgColor2 = "#EAE8D9", this.excludeBkgColor = I(this.sectionBkgColor, 10), this.taskBorderColor = Je(255, 255, 255, 70), this.taskBkgColor = "calculated", this.taskTextColor = "calculated", this.taskTextLightColor = "calculated", this.taskTextOutsideColor = "calculated", this.taskTextClickableColor = "#003163", this.activeTaskBorderColor = Je(255, 255, 255, 50), this.activeTaskBkgColor = "#81B1DB", this.gridColor = "calculated", this.doneTaskBkgColor = "calculated", this.doneTaskBorderColor = "grey", this.critBorderColor = "#E83737", this.critBkgColor = "#E83737", this.taskTextDarkColor = "calculated", this.todayLineColor = "#DB5757", this.vertLineColor = "#00BFFF", this.personBorder = this.primaryBorderColor, this.personBkg = this.mainBkg, this.archEdgeColor = "calculated", this.archEdgeArrowColor = "calculated", this.archEdgeWidth = "3", this.archGroupBorderColor = this.primaryBorderColor, this.archGroupBorderWidth = "2px", this.rowOdd = this.rowOdd || O(this.mainBkg, 5) || "#ffffff", this.rowEven = this.rowEven || I(this.mainBkg, 10), this.labelColor = "calculated", this.errorBkgColor = "#a44141", this.errorTextColor = "#ddd", this.useGradient = !0, this.gradientStart = this.primaryBorderColor, this.gradientStop = this.secondaryBorderColor, this.dropShadow = "drop-shadow( 1px 2px 2px rgba(185,185,185,1))", this.noteFontWeight = this.noteFontWeight || "normal", this.fontWeight = this.fontWeight || "normal";
  }
  updateColors() {
    this.secondBkg = O(this.mainBkg, 16), this.lineColor = this.mainContrastColor, this.arrowheadColor = this.mainContrastColor, this.nodeBkg = this.mainBkg, this.nodeBorder = this.border1, this.clusterBkg = this.secondBkg, this.clusterBorder = this.border2, this.defaultLinkColor = this.lineColor, this.edgeLabelBackground = O(this.labelBackground, 25), this.actorBorder = this.border1, this.actorBkg = this.mainBkg, this.actorTextColor = this.mainContrastColor, this.actorLineColor = this.actorBorder, this.signalColor = this.mainContrastColor, this.signalTextColor = this.mainContrastColor, this.labelBoxBkgColor = this.actorBkg, this.labelBoxBorderColor = this.actorBorder, this.labelTextColor = this.mainContrastColor, this.loopTextColor = this.mainContrastColor, this.noteBorderColor = this.secondaryBorderColor, this.noteBkgColor = this.secondBkg, this.noteTextColor = this.secondaryTextColor, this.activationBorderColor = this.border1, this.activationBkgColor = this.secondBkg, this.rectBkgColor = this.rectBkgColor || this.tertiaryColor, this.altSectionBkgColor = this.background, this.taskBkgColor = O(this.mainBkg, 23), this.taskTextColor = this.darkTextColor, this.taskTextLightColor = this.mainContrastColor, this.taskTextOutsideColor = this.taskTextLightColor, this.gridColor = this.mainContrastColor, this.doneTaskBkgColor = this.mainContrastColor, this.taskTextDarkColor = F(this.doneTaskBkgColor), this.archEdgeColor = this.lineColor, this.archEdgeArrowColor = this.lineColor, this.transitionColor = this.transitionColor || this.lineColor, this.transitionLabelColor = this.transitionLabelColor || this.textColor, this.stateLabelColor = this.stateLabelColor || this.stateBkg || this.primaryTextColor, this.stateBkg = this.stateBkg || this.mainBkg, this.labelBackgroundColor = this.labelBackgroundColor || this.stateBkg, this.compositeBackground = this.compositeBackground || this.background || this.tertiaryColor, this.altBackground = this.altBackground || "#555", this.compositeTitleBackground = this.compositeTitleBackground || this.mainBkg, this.compositeBorder = this.compositeBorder || this.nodeBorder, this.innerEndBackground = this.primaryBorderColor, this.specialStateColor = "#f4f4f4", this.errorBkgColor = this.errorBkgColor || this.tertiaryColor, this.errorTextColor = this.errorTextColor || this.tertiaryTextColor, this.fillType0 = this.primaryColor, this.fillType1 = this.secondaryColor, this.fillType2 = k(this.primaryColor, { h: 64 }), this.fillType3 = k(this.secondaryColor, { h: 64 }), this.fillType4 = k(this.primaryColor, { h: -64 }), this.fillType5 = k(this.secondaryColor, { h: -64 }), this.fillType6 = k(this.primaryColor, { h: 128 }), this.fillType7 = k(this.secondaryColor, { h: 128 }), this.cScale1 = this.cScale1 || "#0b0000", this.cScale2 = this.cScale2 || "#4d1037", this.cScale3 = this.cScale3 || "#3f5258", this.cScale4 = this.cScale4 || "#4f2f1b", this.cScale5 = this.cScale5 || "#6e0a0a", this.cScale6 = this.cScale6 || "#3b0048", this.cScale7 = this.cScale7 || "#995a01", this.cScale8 = this.cScale8 || "#154706", this.cScale9 = this.cScale9 || "#161722", this.cScale10 = this.cScale10 || "#00296f", this.cScale11 = this.cScale11 || "#01629c", this.cScale12 = this.cScale12 || "#010029", this.cScale0 = this.cScale0 || this.primaryColor, this.cScale1 = this.cScale1 || this.secondaryColor, this.cScale2 = this.cScale2 || this.tertiaryColor, this.cScale3 = this.cScale3 || k(this.primaryColor, { h: 30 }), this.cScale4 = this.cScale4 || k(this.primaryColor, { h: 60 }), this.cScale5 = this.cScale5 || k(this.primaryColor, { h: 90 }), this.cScale6 = this.cScale6 || k(this.primaryColor, { h: 120 }), this.cScale7 = this.cScale7 || k(this.primaryColor, { h: 150 }), this.cScale8 = this.cScale8 || k(this.primaryColor, { h: 210 }), this.cScale9 = this.cScale9 || k(this.primaryColor, { h: 270 }), this.cScale10 = this.cScale10 || k(this.primaryColor, { h: 300 }), this.cScale11 = this.cScale11 || k(this.primaryColor, { h: 330 });
    for (let t = 0; t < this.THEME_COLOR_LIMIT; t++)
      this["cScaleInv" + t] = this["cScaleInv" + t] || F(this["cScale" + t]);
    for (let t = 0; t < this.THEME_COLOR_LIMIT; t++)
      this["cScalePeer" + t] = this["cScalePeer" + t] || O(this["cScale" + t], 10);
    for (let t = 0; t < 5; t++)
      this["surface" + t] = this["surface" + t] || k(this.mainBkg, { h: 30, s: -30, l: -(-10 + t * 4) }), this["surfacePeer" + t] = this["surfacePeer" + t] || k(this.mainBkg, { h: 30, s: -30, l: -(-7 + t * 4) });
    this.scaleLabelColor = this.scaleLabelColor || (this.darkMode ? "black" : this.labelTextColor);
    for (let t = 0; t < this.THEME_COLOR_LIMIT; t++)
      this["cScaleLabel" + t] = this["cScaleLabel" + t] || this.scaleLabelColor;
    for (let t = 0; t < this.THEME_COLOR_LIMIT; t++)
      this["pie" + t] = this["cScale" + t];
    this.pieTitleTextSize = this.pieTitleTextSize || "25px", this.pieTitleTextColor = this.pieTitleTextColor || this.mainContrastColor, this.pieSectionTextSize = this.pieSectionTextSize || "17px", this.pieSectionTextColor = this.pieSectionTextColor || this.textColor, this.pieLegendTextSize = this.pieLegendTextSize || "17px", this.pieLegendTextColor = this.pieLegendTextColor || this.mainContrastColor, this.pieStrokeColor = this.pieStrokeColor || "black", this.pieStrokeWidth = this.pieStrokeWidth || "2px", this.pieOuterStrokeWidth = this.pieOuterStrokeWidth || "2px", this.pieOuterStrokeColor = this.pieOuterStrokeColor || "black", this.pieOpacity = this.pieOpacity || "0.7";
    for (let t = 0; t < 8; t++)
      this["venn" + (t + 1)] = this["venn" + (t + 1)] ?? O(this["cScale" + t], 30);
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
    }, this.quadrant1Fill = this.quadrant1Fill || this.primaryColor, this.quadrant2Fill = this.quadrant2Fill || k(this.primaryColor, { r: 5, g: 5, b: 5 }), this.quadrant3Fill = this.quadrant3Fill || k(this.primaryColor, { r: 10, g: 10, b: 10 }), this.quadrant4Fill = this.quadrant4Fill || k(this.primaryColor, { r: 15, g: 15, b: 15 }), this.quadrant1TextFill = this.quadrant1TextFill || this.primaryTextColor, this.quadrant2TextFill = this.quadrant2TextFill || k(this.primaryTextColor, { r: -5, g: -5, b: -5 }), this.quadrant3TextFill = this.quadrant3TextFill || k(this.primaryTextColor, { r: -10, g: -10, b: -10 }), this.quadrant4TextFill = this.quadrant4TextFill || k(this.primaryTextColor, { r: -15, g: -15, b: -15 }), this.quadrantPointFill = this.quadrantPointFill || be(this.quadrant1Fill) ? O(this.quadrant1Fill) : I(this.quadrant1Fill), this.quadrantPointTextFill = this.quadrantPointTextFill || this.primaryTextColor, this.quadrantXAxisTextFill = this.quadrantXAxisTextFill || this.primaryTextColor, this.quadrantYAxisTextFill = this.quadrantYAxisTextFill || this.primaryTextColor, this.quadrantInternalBorderStrokeFill = this.quadrantInternalBorderStrokeFill || this.primaryBorderColor, this.quadrantExternalBorderStrokeFill = this.quadrantExternalBorderStrokeFill || this.primaryBorderColor, this.quadrantTitleFill = this.quadrantTitleFill || this.primaryTextColor, this.xyChart = {
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
    }, this.classText = this.primaryTextColor, this.requirementBackground = this.requirementBackground || this.primaryColor, this.requirementBorderColor = this.requirementBorderColor || this.primaryBorderColor, this.requirementBorderSize = this.requirementBorderSize || "1", this.requirementTextColor = this.requirementTextColor || this.primaryTextColor, this.relationColor = this.relationColor || this.lineColor, this.relationLabelBackground = this.relationLabelBackground || (this.darkMode ? I(this.secondaryColor, 30) : this.secondaryColor), this.relationLabelColor = this.relationLabelColor || this.actorTextColor, this.git0 = O(this.secondaryColor, 20), this.git1 = O(this.pie2 || this.secondaryColor, 20), this.git2 = O(this.pie3 || this.tertiaryColor, 20), this.git3 = O(this.pie4 || k(this.primaryColor, { h: -30 }), 20), this.git4 = O(this.pie5 || k(this.primaryColor, { h: -60 }), 20), this.git5 = O(this.pie6 || k(this.primaryColor, { h: -90 }), 10), this.git6 = O(this.pie7 || k(this.primaryColor, { h: 60 }), 10), this.git7 = O(this.pie8 || k(this.primaryColor, { h: 120 }), 20), this.gitInv0 = this.gitInv0 || F(this.git0), this.gitInv1 = this.gitInv1 || F(this.git1), this.gitInv2 = this.gitInv2 || F(this.git2), this.gitInv3 = this.gitInv3 || F(this.git3), this.gitInv4 = this.gitInv4 || F(this.git4), this.gitInv5 = this.gitInv5 || F(this.git5), this.gitInv6 = this.gitInv6 || F(this.git6), this.gitInv7 = this.gitInv7 || F(this.git7), this.gitBranchLabel0 = this.gitBranchLabel0 || F(this.labelTextColor), this.gitBranchLabel1 = this.gitBranchLabel1 || this.labelTextColor, this.gitBranchLabel2 = this.gitBranchLabel2 || this.labelTextColor, this.gitBranchLabel3 = this.gitBranchLabel3 || F(this.labelTextColor), this.gitBranchLabel4 = this.gitBranchLabel4 || this.labelTextColor, this.gitBranchLabel5 = this.gitBranchLabel5 || this.labelTextColor, this.gitBranchLabel6 = this.gitBranchLabel6 || this.labelTextColor, this.gitBranchLabel7 = this.gitBranchLabel7 || this.labelTextColor, this.tagLabelColor = this.tagLabelColor || this.primaryTextColor, this.tagLabelBackground = this.tagLabelBackground || this.primaryColor, this.tagLabelBorder = this.tagBorder || this.primaryBorderColor, this.tagLabelFontSize = this.tagLabelFontSize || "10px", this.commitLabelColor = this.commitLabelColor || this.secondaryTextColor, this.commitLabelBackground = this.commitLabelBackground || this.secondaryColor, this.commitLabelFontSize = this.commitLabelFontSize || "10px", this.emUiFill = this.emUiFill || "#2d2d2d", this.emUiStroke = this.emUiStroke || "#555", this.emProcessorFill = this.emProcessorFill || O("#5a3d5c", 10), this.emProcessorStroke = this.emProcessorStroke || "#8a6d8c", this.emReadModelFill = this.emReadModelFill || O("#3d5a2d", 10), this.emReadModelStroke = this.emReadModelStroke || "#6d8c5c", this.emCommandFill = this.emCommandFill || O("#2d3d5a", 10), this.emCommandStroke = this.emCommandStroke || "#5c6d8c", this.emEventFill = this.emEventFill || O("#5a452d", 10), this.emEventStroke = this.emEventStroke || "#8c755c", this.emSwimlaneBackgroundOdd = this.emSwimlaneBackgroundOdd || O(this.background, 5), this.emSwimlaneBackgroundStroke = this.emSwimlaneBackgroundStroke || O(this.background, 12), this.emArrowhead = this.emArrowhead || this.lineColor, this.emRelationStroke = this.emRelationStroke || this.lineColor, this.attributeBackgroundColorOdd = this.attributeBackgroundColorOdd || O(this.background, 12), this.attributeBackgroundColorEven = this.attributeBackgroundColorEven || O(this.background, 2), this.nodeBorder = this.nodeBorder || "#999";
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
}, p(Ur, "Theme"), Ur), g0 = /* @__PURE__ */ p((e) => {
  const t = new p0();
  return t.calculate(e), t;
}, "getThemeVariables"), Gr, y0 = (Gr = class {
  constructor() {
    this.background = "#f4f4f4", this.primaryColor = "#ECECFF", this.secondaryColor = k(this.primaryColor, { h: 120 }), this.secondaryColor = "#ffffde", this.tertiaryColor = k(this.primaryColor, { h: -160 }), this.primaryBorderColor = gt(this.primaryColor, this.darkMode), this.secondaryBorderColor = gt(this.secondaryColor, this.darkMode), this.tertiaryBorderColor = gt(this.tertiaryColor, this.darkMode), this.primaryTextColor = F(this.primaryColor), this.secondaryTextColor = F(this.secondaryColor), this.tertiaryTextColor = F(this.tertiaryColor), this.lineColor = F(this.background), this.textColor = F(this.background), this.background = "white", this.mainBkg = "#ECECFF", this.secondBkg = "#ffffde", this.lineColor = "#333333", this.border1 = "#9370DB", this.primaryBorderColor = gt(this.primaryColor, this.darkMode), this.border2 = "#aaaa33", this.arrowheadColor = "#333333", this.fontFamily = '"trebuchet ms", verdana, arial, sans-serif', this.fontSize = "16px", this.labelBackground = "rgba(232,232,232, 0.8)", this.textColor = "#333", this.THEME_COLOR_LIMIT = 12, this.radius = 5, this.strokeWidth = 1, this.nodeBkg = "calculated", this.nodeBorder = "calculated", this.clusterBkg = "calculated", this.clusterBorder = "calculated", this.defaultLinkColor = "calculated", this.titleColor = "calculated", this.edgeLabelBackground = "calculated", this.actorBorder = "calculated", this.actorBkg = "calculated", this.actorTextColor = "black", this.actorLineColor = "calculated", this.signalColor = "calculated", this.signalTextColor = "calculated", this.labelBoxBkgColor = "calculated", this.labelBoxBorderColor = "calculated", this.labelTextColor = "calculated", this.loopTextColor = "calculated", this.noteBorderColor = "calculated", this.noteBkgColor = "#fff5ad", this.noteTextColor = "calculated", this.activationBorderColor = "#666", this.activationBkgColor = "#f4f4f4", this.sequenceNumberColor = "white", this.clusterBkg = "#FBFBFF", this.sectionBkgColor = "calculated", this.altSectionBkgColor = "calculated", this.sectionBkgColor2 = "calculated", this.excludeBkgColor = "#eeeeee", this.taskBorderColor = "calculated", this.taskBkgColor = "calculated", this.taskTextLightColor = "calculated", this.taskTextColor = this.taskTextLightColor, this.taskTextDarkColor = "calculated", this.taskTextOutsideColor = this.taskTextDarkColor, this.taskTextClickableColor = "calculated", this.activeTaskBorderColor = "calculated", this.activeTaskBkgColor = "calculated", this.gridColor = "calculated", this.doneTaskBkgColor = "calculated", this.doneTaskBorderColor = "calculated", this.critBorderColor = "calculated", this.critBkgColor = "calculated", this.todayLineColor = "calculated", this.vertLineColor = "calculated", this.sectionBkgColor = Je(102, 102, 255, 0.49), this.altSectionBkgColor = "white", this.sectionBkgColor2 = "#fff400", this.taskBorderColor = "#534fbc", this.taskBkgColor = "#8a90dd", this.taskTextLightColor = "white", this.taskTextColor = "calculated", this.taskTextDarkColor = "black", this.taskTextOutsideColor = "calculated", this.taskTextClickableColor = "#003163", this.activeTaskBorderColor = "#534fbc", this.activeTaskBkgColor = "#bfc7ff", this.gridColor = "lightgrey", this.doneTaskBkgColor = "lightgrey", this.doneTaskBorderColor = "grey", this.critBorderColor = "#ff8888", this.critBkgColor = "red", this.todayLineColor = "red", this.vertLineColor = "navy", this.noteFontWeight = this.noteFontWeight || "normal", this.fontWeight = this.fontWeight || "normal", this.personBorder = this.primaryBorderColor, this.personBkg = this.mainBkg, this.archEdgeColor = "calculated", this.archEdgeArrowColor = "calculated", this.archEdgeWidth = "3", this.archGroupBorderColor = this.primaryBorderColor, this.archGroupBorderWidth = "2px", this.rowOdd = "calculated", this.rowEven = "calculated", this.labelColor = "black", this.errorBkgColor = "#552222", this.errorTextColor = "#552222", this.useGradient = !1, this.gradientStart = this.primaryBorderColor, this.gradientStop = this.secondaryBorderColor, this.dropShadow = "drop-shadow(1px 2px 2px rgba(185, 185, 185, 1))", this.updateColors();
  }
  updateColors() {
    this.cScale0 = this.cScale0 || this.primaryColor, this.cScale1 = this.cScale1 || this.secondaryColor, this.cScale2 = this.cScale2 || this.tertiaryColor, this.cScale3 = this.cScale3 || k(this.primaryColor, { h: 30 }), this.cScale4 = this.cScale4 || k(this.primaryColor, { h: 60 }), this.cScale5 = this.cScale5 || k(this.primaryColor, { h: 90 }), this.cScale6 = this.cScale6 || k(this.primaryColor, { h: 120 }), this.cScale7 = this.cScale7 || k(this.primaryColor, { h: 150 }), this.cScale8 = this.cScale8 || k(this.primaryColor, { h: 210 }), this.cScale9 = this.cScale9 || k(this.primaryColor, { h: 270 }), this.cScale10 = this.cScale10 || k(this.primaryColor, { h: 300 }), this.cScale11 = this.cScale11 || k(this.primaryColor, { h: 330 }), this.cScalePeer1 = this.cScalePeer1 || I(this.secondaryColor, 45), this.cScalePeer2 = this.cScalePeer2 || I(this.tertiaryColor, 40);
    for (let t = 0; t < this.THEME_COLOR_LIMIT; t++)
      this["cScale" + t] = I(this["cScale" + t], 10), this["cScalePeer" + t] = this["cScalePeer" + t] || I(this["cScale" + t], 25);
    for (let t = 0; t < this.THEME_COLOR_LIMIT; t++)
      this["cScaleInv" + t] = this["cScaleInv" + t] || k(this["cScale" + t], { h: 180 });
    for (let t = 0; t < 5; t++)
      this["surface" + t] = this["surface" + t] || k(this.mainBkg, { h: 30, l: -(5 + t * 5) }), this["surfacePeer" + t] = this["surfacePeer" + t] || k(this.mainBkg, { h: 30, l: -(7 + t * 5) });
    if (this.scaleLabelColor = this.scaleLabelColor !== "calculated" && this.scaleLabelColor ? this.scaleLabelColor : this.labelTextColor, this.labelTextColor !== "calculated") {
      this.cScaleLabel0 = this.cScaleLabel0 || F(this.labelTextColor), this.cScaleLabel3 = this.cScaleLabel3 || F(this.labelTextColor);
      for (let t = 0; t < this.THEME_COLOR_LIMIT; t++)
        this["cScaleLabel" + t] = this["cScaleLabel" + t] || this.labelTextColor;
    }
    this.nodeBkg = this.mainBkg, this.nodeBorder = this.border1, this.clusterBkg = this.secondBkg, this.clusterBorder = this.border2, this.defaultLinkColor = this.lineColor, this.titleColor = this.textColor, this.edgeLabelBackground = this.labelBackground, this.actorBorder = this.border1, this.actorBkg = this.mainBkg, this.labelBoxBkgColor = this.actorBkg, this.signalColor = this.textColor, this.signalTextColor = this.textColor, this.labelBoxBorderColor = this.actorBorder, this.labelTextColor = this.actorTextColor, this.loopTextColor = this.actorTextColor, this.noteBorderColor = this.border2, this.noteTextColor = this.actorTextColor, this.actorLineColor = this.actorBorder, this.rectBkgColor = this.rectBkgColor || this.tertiaryColor, this.taskTextColor = this.taskTextLightColor, this.taskTextOutsideColor = this.taskTextDarkColor, this.archEdgeColor = this.lineColor, this.archEdgeArrowColor = this.lineColor, this.rowOdd = this.rowOdd || O(this.primaryColor, 75) || "#ffffff", this.rowEven = this.rowEven || O(this.primaryColor, 1), this.transitionColor = this.transitionColor || this.lineColor, this.transitionLabelColor = this.transitionLabelColor || this.textColor, this.stateLabelColor = this.stateLabelColor || this.stateBkg || this.primaryTextColor, this.stateBkg = this.stateBkg || this.mainBkg, this.labelBackgroundColor = this.labelBackgroundColor || this.stateBkg, this.compositeBackground = this.compositeBackground || this.background || this.tertiaryColor, this.altBackground = this.altBackground || "#f0f0f0", this.compositeTitleBackground = this.compositeTitleBackground || this.mainBkg, this.compositeBorder = this.compositeBorder || this.nodeBorder, this.innerEndBackground = this.nodeBorder, this.specialStateColor = this.lineColor, this.errorBkgColor = this.errorBkgColor || this.tertiaryColor, this.errorTextColor = this.errorTextColor || this.tertiaryTextColor, this.transitionColor = this.transitionColor || this.lineColor, this.classText = this.primaryTextColor, this.fillType0 = this.primaryColor, this.fillType1 = this.secondaryColor, this.fillType2 = k(this.primaryColor, { h: 64 }), this.fillType3 = k(this.secondaryColor, { h: 64 }), this.fillType4 = k(this.primaryColor, { h: -64 }), this.fillType5 = k(this.secondaryColor, { h: -64 }), this.fillType6 = k(this.primaryColor, { h: 128 }), this.fillType7 = k(this.secondaryColor, { h: 128 }), this.pie1 = this.pie1 || this.primaryColor, this.pie2 = this.pie2 || this.secondaryColor, this.pie3 = this.pie3 || k(this.tertiaryColor, { l: -40 }), this.pie4 = this.pie4 || k(this.primaryColor, { l: -10 }), this.pie5 = this.pie5 || k(this.secondaryColor, { l: -30 }), this.pie6 = this.pie6 || k(this.tertiaryColor, { l: -20 }), this.pie7 = this.pie7 || k(this.primaryColor, { h: 60, l: -20 }), this.pie8 = this.pie8 || k(this.primaryColor, { h: -60, l: -40 }), this.pie9 = this.pie9 || k(this.primaryColor, { h: 120, l: -40 }), this.pie10 = this.pie10 || k(this.primaryColor, { h: 60, l: -40 }), this.pie11 = this.pie11 || k(this.primaryColor, { h: -90, l: -40 }), this.pie12 = this.pie12 || k(this.primaryColor, { h: 120, l: -30 }), this.pieTitleTextSize = this.pieTitleTextSize || "25px", this.pieTitleTextColor = this.pieTitleTextColor || this.taskTextDarkColor, this.pieSectionTextSize = this.pieSectionTextSize || "17px", this.pieSectionTextColor = this.pieSectionTextColor || this.textColor, this.pieLegendTextSize = this.pieLegendTextSize || "17px", this.pieLegendTextColor = this.pieLegendTextColor || this.taskTextDarkColor, this.pieStrokeColor = this.pieStrokeColor || "black", this.pieStrokeWidth = this.pieStrokeWidth || "2px", this.pieOuterStrokeWidth = this.pieOuterStrokeWidth || "2px", this.pieOuterStrokeColor = this.pieOuterStrokeColor || "black", this.pieOpacity = this.pieOpacity || "0.7", this.venn1 = this.venn1 ?? k(this.primaryColor, { l: -30 }), this.venn2 = this.venn2 ?? k(this.secondaryColor, { l: -30 }), this.venn3 = this.venn3 ?? k(this.tertiaryColor, { l: -40 }), this.venn4 = this.venn4 ?? k(this.primaryColor, { h: 60, l: -30 }), this.venn5 = this.venn5 ?? k(this.primaryColor, { h: -60, l: -30 }), this.venn6 = this.venn6 ?? k(this.secondaryColor, { h: 60, l: -30 }), this.venn7 = this.venn7 ?? k(this.primaryColor, { h: 120, l: -30 }), this.venn8 = this.venn8 ?? k(this.secondaryColor, { h: 120, l: -30 }), this.vennTitleTextColor = this.vennTitleTextColor ?? this.titleColor, this.vennSetTextColor = this.vennSetTextColor ?? this.textColor, this.cynefin = {
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
    }, this.quadrant1Fill = this.quadrant1Fill || this.primaryColor, this.quadrant2Fill = this.quadrant2Fill || k(this.primaryColor, { r: 5, g: 5, b: 5 }), this.quadrant3Fill = this.quadrant3Fill || k(this.primaryColor, { r: 10, g: 10, b: 10 }), this.quadrant4Fill = this.quadrant4Fill || k(this.primaryColor, { r: 15, g: 15, b: 15 }), this.quadrant1TextFill = this.quadrant1TextFill || this.primaryTextColor, this.quadrant2TextFill = this.quadrant2TextFill || k(this.primaryTextColor, { r: -5, g: -5, b: -5 }), this.quadrant3TextFill = this.quadrant3TextFill || k(this.primaryTextColor, { r: -10, g: -10, b: -10 }), this.quadrant4TextFill = this.quadrant4TextFill || k(this.primaryTextColor, { r: -15, g: -15, b: -15 }), this.quadrantPointFill = this.quadrantPointFill || be(this.quadrant1Fill) ? O(this.quadrant1Fill) : I(this.quadrant1Fill), this.quadrantPointTextFill = this.quadrantPointTextFill || this.primaryTextColor, this.quadrantXAxisTextFill = this.quadrantXAxisTextFill || this.primaryTextColor, this.quadrantYAxisTextFill = this.quadrantYAxisTextFill || this.primaryTextColor, this.quadrantInternalBorderStrokeFill = this.quadrantInternalBorderStrokeFill || this.primaryBorderColor, this.quadrantExternalBorderStrokeFill = this.quadrantExternalBorderStrokeFill || this.primaryBorderColor, this.quadrantTitleFill = this.quadrantTitleFill || this.primaryTextColor, this.radar = {
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
    }, this.requirementBackground = this.requirementBackground || this.primaryColor, this.requirementBorderColor = this.requirementBorderColor || this.primaryBorderColor, this.requirementBorderSize = this.requirementBorderSize || "1", this.requirementTextColor = this.requirementTextColor || this.primaryTextColor, this.relationColor = this.relationColor || this.lineColor, this.relationLabelBackground = this.relationLabelBackground || this.labelBackground, this.relationLabelColor = this.relationLabelColor || this.actorTextColor, this.git0 = this.git0 || this.primaryColor, this.git1 = this.git1 || this.secondaryColor, this.git2 = this.git2 || this.tertiaryColor, this.git3 = this.git3 || k(this.primaryColor, { h: -30 }), this.git4 = this.git4 || k(this.primaryColor, { h: -60 }), this.git5 = this.git5 || k(this.primaryColor, { h: -90 }), this.git6 = this.git6 || k(this.primaryColor, { h: 60 }), this.git7 = this.git7 || k(this.primaryColor, { h: 120 }), this.darkMode ? (this.git0 = O(this.git0, 25), this.git1 = O(this.git1, 25), this.git2 = O(this.git2, 25), this.git3 = O(this.git3, 25), this.git4 = O(this.git4, 25), this.git5 = O(this.git5, 25), this.git6 = O(this.git6, 25), this.git7 = O(this.git7, 25)) : (this.git0 = I(this.git0, 25), this.git1 = I(this.git1, 25), this.git2 = I(this.git2, 25), this.git3 = I(this.git3, 25), this.git4 = I(this.git4, 25), this.git5 = I(this.git5, 25), this.git6 = I(this.git6, 25), this.git7 = I(this.git7, 25)), this.gitInv0 = this.gitInv0 || I(F(this.git0), 25), this.gitInv1 = this.gitInv1 || F(this.git1), this.gitInv2 = this.gitInv2 || F(this.git2), this.gitInv3 = this.gitInv3 || F(this.git3), this.gitInv4 = this.gitInv4 || F(this.git4), this.gitInv5 = this.gitInv5 || F(this.git5), this.gitInv6 = this.gitInv6 || F(this.git6), this.gitInv7 = this.gitInv7 || F(this.git7), this.gitBranchLabel0 = this.gitBranchLabel0 || F(this.labelTextColor), this.gitBranchLabel1 = this.gitBranchLabel1 || this.labelTextColor, this.gitBranchLabel2 = this.gitBranchLabel2 || this.labelTextColor, this.gitBranchLabel3 = this.gitBranchLabel3 || F(this.labelTextColor), this.gitBranchLabel4 = this.gitBranchLabel4 || this.labelTextColor, this.gitBranchLabel5 = this.gitBranchLabel5 || this.labelTextColor, this.gitBranchLabel6 = this.gitBranchLabel6 || this.labelTextColor, this.gitBranchLabel7 = this.gitBranchLabel7 || this.labelTextColor, this.tagLabelColor = this.tagLabelColor || this.primaryTextColor, this.tagLabelBackground = this.tagLabelBackground || this.primaryColor, this.tagLabelBorder = this.tagBorder || this.primaryBorderColor, this.tagLabelFontSize = this.tagLabelFontSize || "10px", this.commitLabelColor = this.commitLabelColor || this.secondaryTextColor, this.commitLabelBackground = this.commitLabelBackground || this.secondaryColor, this.commitLabelFontSize = this.commitLabelFontSize || "10px", this.emUiFill = this.emUiFill || "white", this.emUiStroke = this.emUiStroke || "#dbdada", this.emProcessorFill = this.emProcessorFill || "#edb3f6", this.emProcessorStroke = this.emProcessorStroke || "#b88cbf", this.emReadModelFill = this.emReadModelFill || "#d3f1a2", this.emReadModelStroke = this.emReadModelStroke || "#a3b732", this.emCommandFill = this.emCommandFill || "#bcd6fe", this.emCommandStroke = this.emCommandStroke || "#679ac3", this.emEventFill = this.emEventFill || "#ffb778", this.emEventStroke = this.emEventStroke || "#c19a0f", this.emSwimlaneBackgroundOdd = this.emSwimlaneBackgroundOdd || "rgb(250,250,250)", this.emSwimlaneBackgroundStroke = this.emSwimlaneBackgroundStroke || "rgb(240,240,240)", this.emArrowhead = this.emArrowhead || this.lineColor, this.emRelationStroke = this.emRelationStroke || this.lineColor, this.attributeBackgroundColorOdd = this.attributeBackgroundColorOdd || Me, this.attributeBackgroundColorEven = this.attributeBackgroundColorEven || $e;
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
}, p(Gr, "Theme"), Gr), m0 = /* @__PURE__ */ p((e) => {
  const t = new y0();
  return t.calculate(e), t;
}, "getThemeVariables"), Vr, x0 = (Vr = class {
  constructor() {
    this.background = "#f4f4f4", this.primaryColor = "#cde498", this.secondaryColor = "#cdffb2", this.background = "white", this.mainBkg = "#cde498", this.secondBkg = "#cdffb2", this.lineColor = "green", this.border1 = "#13540c", this.border2 = "#6eaa49", this.arrowheadColor = "green", this.fontFamily = '"trebuchet ms", verdana, arial, sans-serif', this.fontSize = "16px", this.tertiaryColor = O("#cde498", 10), this.primaryBorderColor = gt(this.primaryColor, this.darkMode), this.secondaryBorderColor = gt(this.secondaryColor, this.darkMode), this.tertiaryBorderColor = gt(this.tertiaryColor, this.darkMode), this.primaryTextColor = F(this.primaryColor), this.secondaryTextColor = F(this.secondaryColor), this.tertiaryTextColor = F(this.primaryColor), this.lineColor = F(this.background), this.textColor = F(this.background), this.THEME_COLOR_LIMIT = 12, this.radius = 5, this.strokeWidth = 1, this.nodeBkg = "calculated", this.nodeBorder = "calculated", this.clusterBkg = "calculated", this.clusterBorder = "calculated", this.defaultLinkColor = "calculated", this.titleColor = "#333", this.edgeLabelBackground = "#e8e8e8", this.actorBorder = "calculated", this.actorBkg = "calculated", this.actorTextColor = "black", this.actorLineColor = "calculated", this.signalColor = "#333", this.signalTextColor = "#333", this.labelBoxBkgColor = "calculated", this.labelBoxBorderColor = "#326932", this.labelTextColor = "calculated", this.loopTextColor = "calculated", this.noteBorderColor = "calculated", this.noteBkgColor = "#fff5ad", this.noteTextColor = "calculated", this.activationBorderColor = "#666", this.activationBkgColor = "#f4f4f4", this.sequenceNumberColor = "white", this.sectionBkgColor = "#6eaa49", this.altSectionBkgColor = "white", this.sectionBkgColor2 = "#6eaa49", this.excludeBkgColor = "#eeeeee", this.taskBorderColor = "calculated", this.taskBkgColor = "#487e3a", this.taskTextLightColor = "white", this.taskTextColor = "calculated", this.taskTextDarkColor = "black", this.taskTextOutsideColor = "calculated", this.taskTextClickableColor = "#003163", this.activeTaskBorderColor = "calculated", this.activeTaskBkgColor = "calculated", this.gridColor = "lightgrey", this.doneTaskBkgColor = "lightgrey", this.doneTaskBorderColor = "grey", this.critBorderColor = "#ff8888", this.critBkgColor = "red", this.todayLineColor = "red", this.vertLineColor = "#00BFFF", this.personBorder = this.primaryBorderColor, this.personBkg = this.mainBkg, this.archEdgeColor = "calculated", this.archEdgeArrowColor = "calculated", this.archEdgeWidth = "3", this.archGroupBorderColor = this.primaryBorderColor, this.archGroupBorderWidth = "2px", this.noteFontWeight = "normal", this.fontWeight = "normal", this.labelColor = "black", this.errorBkgColor = "#552222", this.errorTextColor = "#552222", this.useGradient = !0, this.gradientStart = this.primaryBorderColor, this.gradientStop = this.secondaryBorderColor, this.dropShadow = "drop-shadow( 1px 2px 2px rgba(185,185,185,0.5))";
  }
  updateColors() {
    this.actorBorder = I(this.mainBkg, 20), this.actorBkg = this.mainBkg, this.labelBoxBkgColor = this.actorBkg, this.labelTextColor = this.actorTextColor, this.loopTextColor = this.actorTextColor, this.noteBorderColor = this.border2, this.noteTextColor = this.actorTextColor, this.actorLineColor = this.actorBorder, this.rectBkgColor = this.rectBkgColor || this.tertiaryColor, this.cScale0 = this.cScale0 || this.primaryColor, this.cScale1 = this.cScale1 || this.secondaryColor, this.cScale2 = this.cScale2 || this.tertiaryColor, this.cScale3 = this.cScale3 || k(this.primaryColor, { h: 30 }), this.cScale4 = this.cScale4 || k(this.primaryColor, { h: 60 }), this.cScale5 = this.cScale5 || k(this.primaryColor, { h: 90 }), this.cScale6 = this.cScale6 || k(this.primaryColor, { h: 120 }), this.cScale7 = this.cScale7 || k(this.primaryColor, { h: 150 }), this.cScale8 = this.cScale8 || k(this.primaryColor, { h: 210 }), this.cScale9 = this.cScale9 || k(this.primaryColor, { h: 270 }), this.cScale10 = this.cScale10 || k(this.primaryColor, { h: 300 }), this.cScale11 = this.cScale11 || k(this.primaryColor, { h: 330 }), this.cScalePeer1 = this.cScalePeer1 || I(this.secondaryColor, 45), this.cScalePeer2 = this.cScalePeer2 || I(this.tertiaryColor, 40);
    for (let t = 0; t < this.THEME_COLOR_LIMIT; t++)
      this["cScale" + t] = I(this["cScale" + t], 10), this["cScalePeer" + t] = this["cScalePeer" + t] || I(this["cScale" + t], 25);
    for (let t = 0; t < this.THEME_COLOR_LIMIT; t++)
      this["cScaleInv" + t] = this["cScaleInv" + t] || k(this["cScale" + t], { h: 180 });
    this.scaleLabelColor = this.scaleLabelColor !== "calculated" && this.scaleLabelColor ? this.scaleLabelColor : this.labelTextColor;
    for (let t = 0; t < this.THEME_COLOR_LIMIT; t++)
      this["cScaleLabel" + t] = this["cScaleLabel" + t] || this.scaleLabelColor;
    for (let t = 0; t < 5; t++)
      this["surface" + t] = this["surface" + t] || k(this.mainBkg, { h: 30, s: -30, l: -(5 + t * 5) }), this["surfacePeer" + t] = this["surfacePeer" + t] || k(this.mainBkg, { h: 30, s: -30, l: -(8 + t * 5) });
    this.nodeBkg = this.mainBkg, this.nodeBorder = this.border1, this.clusterBkg = this.secondBkg, this.clusterBorder = this.border2, this.defaultLinkColor = this.lineColor, this.taskBorderColor = this.border1, this.taskTextColor = this.taskTextLightColor, this.taskTextOutsideColor = this.taskTextDarkColor, this.activeTaskBorderColor = this.taskBorderColor, this.activeTaskBkgColor = this.mainBkg, this.archEdgeColor = this.lineColor, this.archEdgeArrowColor = this.lineColor, this.rowOdd = this.rowOdd || O(this.mainBkg, 75) || "#ffffff", this.rowEven = this.rowEven || O(this.mainBkg, 20), this.transitionColor = this.transitionColor || this.lineColor, this.transitionLabelColor = this.transitionLabelColor || this.textColor, this.stateLabelColor = this.stateLabelColor || this.stateBkg || this.primaryTextColor, this.stateBkg = this.stateBkg || this.mainBkg, this.labelBackgroundColor = this.labelBackgroundColor || this.stateBkg, this.compositeBackground = this.compositeBackground || this.background || this.tertiaryColor, this.altBackground = this.altBackground || "#f0f0f0", this.compositeTitleBackground = this.compositeTitleBackground || this.mainBkg, this.compositeBorder = this.compositeBorder || this.nodeBorder, this.innerEndBackground = this.primaryBorderColor, this.specialStateColor = this.lineColor, this.errorBkgColor = this.errorBkgColor || this.tertiaryColor, this.errorTextColor = this.errorTextColor || this.tertiaryTextColor, this.transitionColor = this.transitionColor || this.lineColor, this.classText = this.primaryTextColor, this.fillType0 = this.primaryColor, this.fillType1 = this.secondaryColor, this.fillType2 = k(this.primaryColor, { h: 64 }), this.fillType3 = k(this.secondaryColor, { h: 64 }), this.fillType4 = k(this.primaryColor, { h: -64 }), this.fillType5 = k(this.secondaryColor, { h: -64 }), this.fillType6 = k(this.primaryColor, { h: 128 }), this.fillType7 = k(this.secondaryColor, { h: 128 }), this.pie1 = this.pie1 || this.primaryColor, this.pie2 = this.pie2 || this.secondaryColor, this.pie3 = this.pie3 || this.tertiaryColor, this.pie4 = this.pie4 || k(this.primaryColor, { l: -30 }), this.pie5 = this.pie5 || k(this.secondaryColor, { l: -30 }), this.pie6 = this.pie6 || k(this.tertiaryColor, { h: 40, l: -40 }), this.pie7 = this.pie7 || k(this.primaryColor, { h: 60, l: -10 }), this.pie8 = this.pie8 || k(this.primaryColor, { h: -60, l: -10 }), this.pie9 = this.pie9 || k(this.primaryColor, { h: 120, l: 0 }), this.pie10 = this.pie10 || k(this.primaryColor, { h: 60, l: -50 }), this.pie11 = this.pie11 || k(this.primaryColor, { h: -60, l: -50 }), this.pie12 = this.pie12 || k(this.primaryColor, { h: 120, l: -50 }), this.pieTitleTextSize = this.pieTitleTextSize || "25px", this.pieTitleTextColor = this.pieTitleTextColor || this.taskTextDarkColor, this.pieSectionTextSize = this.pieSectionTextSize || "17px", this.pieSectionTextColor = this.pieSectionTextColor || this.textColor, this.pieLegendTextSize = this.pieLegendTextSize || "17px", this.pieLegendTextColor = this.pieLegendTextColor || this.taskTextDarkColor, this.pieStrokeColor = this.pieStrokeColor || "black", this.pieStrokeWidth = this.pieStrokeWidth || "2px", this.pieOuterStrokeWidth = this.pieOuterStrokeWidth || "2px", this.pieOuterStrokeColor = this.pieOuterStrokeColor || "black", this.pieOpacity = this.pieOpacity || "0.7", this.venn1 = this.venn1 ?? k(this.primaryColor, { l: -30 }), this.venn2 = this.venn2 ?? k(this.secondaryColor, { l: -30 }), this.venn3 = this.venn3 ?? k(this.tertiaryColor, { l: -30 }), this.venn4 = this.venn4 ?? k(this.primaryColor, { h: 60, l: -30 }), this.venn5 = this.venn5 ?? k(this.primaryColor, { h: -60, l: -30 }), this.venn6 = this.venn6 ?? k(this.secondaryColor, { h: 60, l: -30 }), this.venn7 = this.venn7 ?? k(this.primaryColor, { h: 120, l: -30 }), this.venn8 = this.venn8 ?? k(this.secondaryColor, { h: 120, l: -30 }), this.vennTitleTextColor = this.vennTitleTextColor ?? this.titleColor, this.vennSetTextColor = this.vennSetTextColor ?? this.textColor, this.cynefin = {
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
    }, this.quadrant1Fill = this.quadrant1Fill || this.primaryColor, this.quadrant2Fill = this.quadrant2Fill || k(this.primaryColor, { r: 5, g: 5, b: 5 }), this.quadrant3Fill = this.quadrant3Fill || k(this.primaryColor, { r: 10, g: 10, b: 10 }), this.quadrant4Fill = this.quadrant4Fill || k(this.primaryColor, { r: 15, g: 15, b: 15 }), this.quadrant1TextFill = this.quadrant1TextFill || this.primaryTextColor, this.quadrant2TextFill = this.quadrant2TextFill || k(this.primaryTextColor, { r: -5, g: -5, b: -5 }), this.quadrant3TextFill = this.quadrant3TextFill || k(this.primaryTextColor, { r: -10, g: -10, b: -10 }), this.quadrant4TextFill = this.quadrant4TextFill || k(this.primaryTextColor, { r: -15, g: -15, b: -15 }), this.quadrantPointFill = this.quadrantPointFill || be(this.quadrant1Fill) ? O(this.quadrant1Fill) : I(this.quadrant1Fill), this.quadrantPointTextFill = this.quadrantPointTextFill || this.primaryTextColor, this.quadrantXAxisTextFill = this.quadrantXAxisTextFill || this.primaryTextColor, this.quadrantYAxisTextFill = this.quadrantYAxisTextFill || this.primaryTextColor, this.quadrantInternalBorderStrokeFill = this.quadrantInternalBorderStrokeFill || this.primaryBorderColor, this.quadrantExternalBorderStrokeFill = this.quadrantExternalBorderStrokeFill || this.primaryBorderColor, this.quadrantTitleFill = this.quadrantTitleFill || this.primaryTextColor, this.packet = {
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
    }, this.requirementBackground = this.requirementBackground || this.primaryColor, this.requirementBorderColor = this.requirementBorderColor || this.primaryBorderColor, this.requirementBorderSize = this.requirementBorderSize || "1", this.requirementTextColor = this.requirementTextColor || this.primaryTextColor, this.relationColor = this.relationColor || this.lineColor, this.relationLabelBackground = this.relationLabelBackground || this.edgeLabelBackground, this.relationLabelColor = this.relationLabelColor || this.actorTextColor, this.git0 = this.git0 || this.primaryColor, this.git1 = this.git1 || this.secondaryColor, this.git2 = this.git2 || this.tertiaryColor, this.git3 = this.git3 || k(this.primaryColor, { h: -30 }), this.git4 = this.git4 || k(this.primaryColor, { h: -60 }), this.git5 = this.git5 || k(this.primaryColor, { h: -90 }), this.git6 = this.git6 || k(this.primaryColor, { h: 60 }), this.git7 = this.git7 || k(this.primaryColor, { h: 120 }), this.darkMode ? (this.git0 = O(this.git0, 25), this.git1 = O(this.git1, 25), this.git2 = O(this.git2, 25), this.git3 = O(this.git3, 25), this.git4 = O(this.git4, 25), this.git5 = O(this.git5, 25), this.git6 = O(this.git6, 25), this.git7 = O(this.git7, 25)) : (this.git0 = I(this.git0, 25), this.git1 = I(this.git1, 25), this.git2 = I(this.git2, 25), this.git3 = I(this.git3, 25), this.git4 = I(this.git4, 25), this.git5 = I(this.git5, 25), this.git6 = I(this.git6, 25), this.git7 = I(this.git7, 25)), this.gitInv0 = this.gitInv0 || F(this.git0), this.gitInv1 = this.gitInv1 || F(this.git1), this.gitInv2 = this.gitInv2 || F(this.git2), this.gitInv3 = this.gitInv3 || F(this.git3), this.gitInv4 = this.gitInv4 || F(this.git4), this.gitInv5 = this.gitInv5 || F(this.git5), this.gitInv6 = this.gitInv6 || F(this.git6), this.gitInv7 = this.gitInv7 || F(this.git7), this.gitBranchLabel0 = this.gitBranchLabel0 || F(this.labelTextColor), this.gitBranchLabel1 = this.gitBranchLabel1 || this.labelTextColor, this.gitBranchLabel2 = this.gitBranchLabel2 || this.labelTextColor, this.gitBranchLabel3 = this.gitBranchLabel3 || F(this.labelTextColor), this.gitBranchLabel4 = this.gitBranchLabel4 || this.labelTextColor, this.gitBranchLabel5 = this.gitBranchLabel5 || this.labelTextColor, this.gitBranchLabel6 = this.gitBranchLabel6 || this.labelTextColor, this.gitBranchLabel7 = this.gitBranchLabel7 || this.labelTextColor, this.tagLabelColor = this.tagLabelColor || this.primaryTextColor, this.tagLabelBackground = this.tagLabelBackground || this.primaryColor, this.tagLabelBorder = this.tagBorder || this.primaryBorderColor, this.tagLabelFontSize = this.tagLabelFontSize || "10px", this.commitLabelColor = this.commitLabelColor || this.secondaryTextColor, this.commitLabelBackground = this.commitLabelBackground || this.secondaryColor, this.commitLabelFontSize = this.commitLabelFontSize || "10px", this.emUiFill = this.emUiFill || "white", this.emUiStroke = this.emUiStroke || "#dbdada", this.emProcessorFill = this.emProcessorFill || "#edb3f6", this.emProcessorStroke = this.emProcessorStroke || "#b88cbf", this.emReadModelFill = this.emReadModelFill || "#d3f1a2", this.emReadModelStroke = this.emReadModelStroke || "#a3b732", this.emCommandFill = this.emCommandFill || "#bcd6fe", this.emCommandStroke = this.emCommandStroke || "#679ac3", this.emEventFill = this.emEventFill || "#ffb778", this.emEventStroke = this.emEventStroke || "#c19a0f", this.emSwimlaneBackgroundOdd = this.emSwimlaneBackgroundOdd || "rgb(250,250,250)", this.emSwimlaneBackgroundStroke = this.emSwimlaneBackgroundStroke || "rgb(240,240,240)", this.emArrowhead = this.emArrowhead || this.lineColor, this.emRelationStroke = this.emRelationStroke || this.lineColor, this.attributeBackgroundColorOdd = this.attributeBackgroundColorOdd || Me, this.attributeBackgroundColorEven = this.attributeBackgroundColorEven || $e;
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
}, p(Vr, "Theme"), Vr), C0 = /* @__PURE__ */ p((e) => {
  const t = new x0();
  return t.calculate(e), t;
}, "getThemeVariables"), Kr, b0 = (Kr = class {
  constructor() {
    this.primaryColor = "#eee", this.contrast = "#707070", this.secondaryColor = O(this.contrast, 55), this.background = "#ffffff", this.tertiaryColor = k(this.primaryColor, { h: -160 }), this.primaryBorderColor = gt(this.primaryColor, this.darkMode), this.secondaryBorderColor = gt(this.secondaryColor, this.darkMode), this.tertiaryBorderColor = gt(this.tertiaryColor, this.darkMode), this.primaryTextColor = F(this.primaryColor), this.secondaryTextColor = F(this.secondaryColor), this.tertiaryTextColor = F(this.tertiaryColor), this.lineColor = F(this.background), this.textColor = F(this.background), this.mainBkg = "#eee", this.secondBkg = "calculated", this.lineColor = "#666", this.border1 = "#999", this.border2 = "calculated", this.note = "#ffa", this.text = "#333", this.critical = "#d42", this.done = "#bbb", this.arrowheadColor = "#333333", this.fontFamily = '"trebuchet ms", verdana, arial, sans-serif', this.fontSize = "16px", this.THEME_COLOR_LIMIT = 12, this.radius = 5, this.strokeWidth = 1, this.nodeBkg = "calculated", this.nodeBorder = "calculated", this.clusterBkg = "calculated", this.clusterBorder = "calculated", this.defaultLinkColor = "calculated", this.titleColor = "calculated", this.edgeLabelBackground = "white", this.actorBorder = "calculated", this.actorBkg = "calculated", this.actorTextColor = "calculated", this.actorLineColor = this.actorBorder, this.signalColor = "calculated", this.signalTextColor = "calculated", this.labelBoxBkgColor = "calculated", this.labelBoxBorderColor = "calculated", this.labelTextColor = "calculated", this.loopTextColor = "calculated", this.noteBorderColor = "calculated", this.noteBkgColor = "calculated", this.noteTextColor = "calculated", this.activationBorderColor = "#666", this.activationBkgColor = "#f4f4f4", this.sequenceNumberColor = "white", this.sectionBkgColor = "calculated", this.altSectionBkgColor = "white", this.sectionBkgColor2 = "calculated", this.excludeBkgColor = "#eeeeee", this.taskBorderColor = "calculated", this.taskBkgColor = "calculated", this.taskTextLightColor = "white", this.taskTextColor = "calculated", this.taskTextDarkColor = "calculated", this.taskTextOutsideColor = "calculated", this.taskTextClickableColor = "#003163", this.activeTaskBorderColor = "calculated", this.activeTaskBkgColor = "calculated", this.gridColor = "calculated", this.doneTaskBkgColor = "calculated", this.doneTaskBorderColor = "calculated", this.critBkgColor = "calculated", this.critBorderColor = "calculated", this.todayLineColor = "calculated", this.vertLineColor = "calculated", this.personBorder = this.primaryBorderColor, this.personBkg = this.mainBkg, this.archEdgeColor = "calculated", this.archEdgeArrowColor = "calculated", this.archEdgeWidth = "3", this.archGroupBorderColor = this.primaryBorderColor, this.archGroupBorderWidth = "2px", this.noteFontWeight = "normal", this.fontWeight = "normal", this.rowOdd = this.rowOdd || O(this.mainBkg, 75) || "#ffffff", this.rowEven = this.rowEven || "#f4f4f4", this.labelColor = "black", this.errorBkgColor = "#552222", this.errorTextColor = "#552222", this.useGradient = !0, this.gradientStart = this.primaryBorderColor, this.gradientStop = this.secondaryBorderColor, this.dropShadow = "drop-shadow( 1px 2px 2px rgba(185,185,185,1))";
  }
  updateColors() {
    this.secondBkg = O(this.contrast, 55), this.border2 = this.contrast, this.actorBorder = O(this.border1, 23), this.actorBkg = this.mainBkg, this.actorTextColor = this.text, this.actorLineColor = this.actorBorder, this.rectBkgColor = this.rectBkgColor || this.tertiaryColor, this.signalColor = this.text, this.signalTextColor = this.text, this.labelBoxBkgColor = this.actorBkg, this.labelBoxBorderColor = this.actorBorder, this.labelTextColor = this.text, this.loopTextColor = this.text, this.noteBorderColor = "#999", this.noteBkgColor = "#666", this.noteTextColor = "#fff", this.cScale0 = this.cScale0 || "#555", this.cScale1 = this.cScale1 || "#F4F4F4", this.cScale2 = this.cScale2 || "#555", this.cScale3 = this.cScale3 || "#BBB", this.cScale4 = this.cScale4 || "#777", this.cScale5 = this.cScale5 || "#999", this.cScale6 = this.cScale6 || "#DDD", this.cScale7 = this.cScale7 || "#FFF", this.cScale8 = this.cScale8 || "#DDD", this.cScale9 = this.cScale9 || "#BBB", this.cScale10 = this.cScale10 || "#999", this.cScale11 = this.cScale11 || "#777";
    for (let t = 0; t < this.THEME_COLOR_LIMIT; t++)
      this["cScaleInv" + t] = this["cScaleInv" + t] || F(this["cScale" + t]);
    for (let t = 0; t < this.THEME_COLOR_LIMIT; t++)
      this.darkMode ? this["cScalePeer" + t] = this["cScalePeer" + t] || O(this["cScale" + t], 10) : this["cScalePeer" + t] = this["cScalePeer" + t] || I(this["cScale" + t], 10);
    this.scaleLabelColor = this.scaleLabelColor || (this.darkMode ? "black" : this.labelTextColor), this.cScaleLabel0 = this.cScaleLabel0 || this.cScale1, this.cScaleLabel2 = this.cScaleLabel2 || this.cScale1;
    for (let t = 0; t < this.THEME_COLOR_LIMIT; t++)
      this["cScaleLabel" + t] = this["cScaleLabel" + t] || this.scaleLabelColor;
    for (let t = 0; t < 5; t++)
      this["surface" + t] = this["surface" + t] || k(this.mainBkg, { l: -(5 + t * 5) }), this["surfacePeer" + t] = this["surfacePeer" + t] || k(this.mainBkg, { l: -(8 + t * 5) });
    this.nodeBkg = this.mainBkg, this.nodeBorder = this.border1, this.clusterBkg = this.secondBkg, this.clusterBorder = this.border2, this.defaultLinkColor = this.lineColor, this.titleColor = this.text, this.sectionBkgColor = O(this.contrast, 30), this.sectionBkgColor2 = O(this.contrast, 30), this.taskBorderColor = I(this.contrast, 10), this.taskBkgColor = this.contrast, this.taskTextColor = this.taskTextLightColor, this.taskTextDarkColor = this.text, this.taskTextOutsideColor = this.taskTextDarkColor, this.activeTaskBorderColor = this.taskBorderColor, this.activeTaskBkgColor = this.mainBkg, this.gridColor = O(this.border1, 30), this.doneTaskBkgColor = this.done, this.doneTaskBorderColor = this.lineColor, this.critBkgColor = this.critical, this.critBorderColor = I(this.critBkgColor, 10), this.todayLineColor = this.critBkgColor, this.vertLineColor = this.critBkgColor, this.archEdgeColor = this.lineColor, this.archEdgeArrowColor = this.lineColor, this.transitionColor = this.transitionColor || "#000", this.transitionLabelColor = this.transitionLabelColor || this.textColor, this.stateLabelColor = this.stateLabelColor || this.stateBkg || this.primaryTextColor, this.stateBkg = this.stateBkg || this.mainBkg, this.labelBackgroundColor = this.labelBackgroundColor || this.stateBkg, this.compositeBackground = this.compositeBackground || this.background || this.tertiaryColor, this.altBackground = this.altBackground || "#f4f4f4", this.compositeTitleBackground = this.compositeTitleBackground || this.mainBkg, this.stateBorder = this.stateBorder || "#000", this.innerEndBackground = this.primaryBorderColor, this.specialStateColor = "#222", this.errorBkgColor = this.errorBkgColor || this.tertiaryColor, this.errorTextColor = this.errorTextColor || this.tertiaryTextColor, this.classText = this.primaryTextColor, this.fillType0 = this.primaryColor, this.fillType1 = this.secondaryColor, this.fillType2 = k(this.primaryColor, { h: 64 }), this.fillType3 = k(this.secondaryColor, { h: 64 }), this.fillType4 = k(this.primaryColor, { h: -64 }), this.fillType5 = k(this.secondaryColor, { h: -64 }), this.fillType6 = k(this.primaryColor, { h: 128 }), this.fillType7 = k(this.secondaryColor, { h: 128 });
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
    }, this.quadrant1Fill = this.quadrant1Fill || this.primaryColor, this.quadrant2Fill = this.quadrant2Fill || k(this.primaryColor, { r: 5, g: 5, b: 5 }), this.quadrant3Fill = this.quadrant3Fill || k(this.primaryColor, { r: 10, g: 10, b: 10 }), this.quadrant4Fill = this.quadrant4Fill || k(this.primaryColor, { r: 15, g: 15, b: 15 }), this.quadrant1TextFill = this.quadrant1TextFill || this.primaryTextColor, this.quadrant2TextFill = this.quadrant2TextFill || k(this.primaryTextColor, { r: -5, g: -5, b: -5 }), this.quadrant3TextFill = this.quadrant3TextFill || k(this.primaryTextColor, { r: -10, g: -10, b: -10 }), this.quadrant4TextFill = this.quadrant4TextFill || k(this.primaryTextColor, { r: -15, g: -15, b: -15 }), this.quadrantPointFill = this.quadrantPointFill || be(this.quadrant1Fill) ? O(this.quadrant1Fill) : I(this.quadrant1Fill), this.quadrantPointTextFill = this.quadrantPointTextFill || this.primaryTextColor, this.quadrantXAxisTextFill = this.quadrantXAxisTextFill || this.primaryTextColor, this.quadrantYAxisTextFill = this.quadrantYAxisTextFill || this.primaryTextColor, this.quadrantInternalBorderStrokeFill = this.quadrantInternalBorderStrokeFill || this.primaryBorderColor, this.quadrantExternalBorderStrokeFill = this.quadrantExternalBorderStrokeFill || this.primaryBorderColor, this.quadrantTitleFill = this.quadrantTitleFill || this.primaryTextColor, this.xyChart = {
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
    }, this.requirementBackground = this.requirementBackground || this.primaryColor, this.requirementBorderColor = this.requirementBorderColor || this.primaryBorderColor, this.requirementBorderSize = this.requirementBorderSize || "1", this.requirementTextColor = this.requirementTextColor || this.primaryTextColor, this.relationColor = this.relationColor || this.lineColor, this.relationLabelBackground = this.relationLabelBackground || this.edgeLabelBackground, this.relationLabelColor = this.relationLabelColor || this.actorTextColor, this.git0 = I(this.pie1, 25) || this.primaryColor, this.git1 = this.pie2 || this.secondaryColor, this.git2 = this.pie3 || this.tertiaryColor, this.git3 = this.pie4 || k(this.primaryColor, { h: -30 }), this.git4 = this.pie5 || k(this.primaryColor, { h: -60 }), this.git5 = this.pie6 || k(this.primaryColor, { h: -90 }), this.git6 = this.pie7 || k(this.primaryColor, { h: 60 }), this.git7 = this.pie8 || k(this.primaryColor, { h: 120 }), this.gitInv0 = this.gitInv0 || F(this.git0), this.gitInv1 = this.gitInv1 || F(this.git1), this.gitInv2 = this.gitInv2 || F(this.git2), this.gitInv3 = this.gitInv3 || F(this.git3), this.gitInv4 = this.gitInv4 || F(this.git4), this.gitInv5 = this.gitInv5 || F(this.git5), this.gitInv6 = this.gitInv6 || F(this.git6), this.gitInv7 = this.gitInv7 || F(this.git7), this.branchLabelColor = this.branchLabelColor || this.labelTextColor, this.gitBranchLabel0 = this.branchLabelColor, this.gitBranchLabel1 = "white", this.gitBranchLabel2 = this.branchLabelColor, this.gitBranchLabel3 = "white", this.gitBranchLabel4 = this.branchLabelColor, this.gitBranchLabel5 = this.branchLabelColor, this.gitBranchLabel6 = this.branchLabelColor, this.gitBranchLabel7 = this.branchLabelColor, this.tagLabelColor = this.tagLabelColor || this.primaryTextColor, this.tagLabelBackground = this.tagLabelBackground || this.primaryColor, this.tagLabelBorder = this.tagBorder || this.primaryBorderColor, this.tagLabelFontSize = this.tagLabelFontSize || "10px", this.commitLabelColor = this.commitLabelColor || this.secondaryTextColor, this.commitLabelBackground = this.commitLabelBackground || this.secondaryColor, this.commitLabelFontSize = this.commitLabelFontSize || "10px", this.emUiFill = this.emUiFill || "white", this.emUiStroke = this.emUiStroke || "#dbdada", this.emProcessorFill = this.emProcessorFill || "#edb3f6", this.emProcessorStroke = this.emProcessorStroke || "#b88cbf", this.emReadModelFill = this.emReadModelFill || "#d3f1a2", this.emReadModelStroke = this.emReadModelStroke || "#a3b732", this.emCommandFill = this.emCommandFill || "#bcd6fe", this.emCommandStroke = this.emCommandStroke || "#679ac3", this.emEventFill = this.emEventFill || "#ffb778", this.emEventStroke = this.emEventStroke || "#c19a0f", this.emSwimlaneBackgroundOdd = this.emSwimlaneBackgroundOdd || "rgb(250,250,250)", this.emSwimlaneBackgroundStroke = this.emSwimlaneBackgroundStroke || "rgb(240,240,240)", this.emArrowhead = this.emArrowhead || this.lineColor, this.emRelationStroke = this.emRelationStroke || this.lineColor, this.attributeBackgroundColorOdd = this.attributeBackgroundColorOdd || Me, this.attributeBackgroundColorEven = this.attributeBackgroundColorEven || $e;
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
}, p(Kr, "Theme"), Kr), k0 = /* @__PURE__ */ p((e) => {
  const t = new b0();
  return t.calculate(e), t;
}, "getThemeVariables"), Zr, w0 = (Zr = class {
  constructor() {
    this.background = "#ffffff", this.primaryColor = "#cccccc", this.mainBkg = "#ffffff", this.noteBkgColor = "#fff5ad", this.noteTextColor = "#333", this.THEME_COLOR_LIMIT = 12, this.radius = 3, this.strokeWidth = 2, this.primaryBorderColor = gt(this.primaryColor, this.darkMode), this.fontFamily = "arial, sans-serif", this.fontSize = "14px", this.nodeBorder = "#000000", this.stateBorder = "#000000", this.useGradient = !0, this.gradientStart = "#0042eb", this.gradientStop = "#eb0042", this.dropShadow = "drop-shadow( 0px 1px 2px rgba(0, 0, 0, 0.25));", this.tertiaryColor = "#ffffff", this.archEdgeColor = "calculated", this.archEdgeArrowColor = "calculated", this.archEdgeWidth = "3", this.archGroupBorderColor = this.primaryBorderColor, this.archGroupBorderWidth = "2px", this.noteFontWeight = "normal", this.fontWeight = "normal";
  }
  updateColors() {
    this.primaryTextColor = this.primaryTextColor || (this.darkMode ? "#eee" : "#333"), this.secondaryColor = this.secondaryColor || k(this.primaryColor, { h: -120 }), this.tertiaryColor = this.tertiaryColor || k(this.primaryColor, { h: 180, l: 5 }), this.primaryBorderColor = this.primaryBorderColor || gt(this.primaryColor, this.darkMode), this.secondaryBorderColor = this.secondaryBorderColor || gt(this.secondaryColor, this.darkMode), this.tertiaryBorderColor = this.tertiaryBorderColor || gt(this.tertiaryColor, this.darkMode), this.noteBorderColor = this.noteBorderColor || gt(this.noteBkgColor, this.darkMode), this.noteBkgColor = this.noteBkgColor || "#fff5ad", this.noteTextColor = this.noteTextColor || "#333", this.secondaryTextColor = this.secondaryTextColor || F(this.secondaryColor), this.tertiaryTextColor = this.tertiaryTextColor || F(this.tertiaryColor), this.lineColor = this.lineColor || F(this.background), this.arrowheadColor = this.arrowheadColor || F(this.background), this.textColor = this.textColor || this.primaryTextColor, this.border2 = this.border2 || this.tertiaryBorderColor, this.nodeBkg = this.nodeBkg || this.primaryColor, this.mainBkg = this.mainBkg || this.primaryColor, this.nodeBorder = this.nodeBorder || this.primaryBorderColor, this.clusterBkg = this.clusterBkg || this.tertiaryColor, this.clusterBorder = this.clusterBorder || this.tertiaryBorderColor, this.defaultLinkColor = this.defaultLinkColor || this.lineColor, this.titleColor = this.titleColor || this.tertiaryTextColor, this.edgeLabelBackground = this.edgeLabelBackground || (this.darkMode ? I(this.secondaryColor, 30) : this.secondaryColor), this.nodeTextColor = this.nodeTextColor || this.primaryTextColor, this.actorBorder = this.actorBorder || this.primaryBorderColor, this.actorBkg = this.actorBkg || this.mainBkg, this.actorTextColor = this.actorTextColor || this.primaryTextColor, this.actorLineColor = this.actorLineColor || this.actorBorder, this.labelBoxBkgColor = this.labelBoxBkgColor || this.actorBkg, this.signalColor = this.signalColor || this.textColor, this.signalTextColor = this.signalTextColor || this.textColor, this.labelBoxBorderColor = this.labelBoxBorderColor || this.actorBorder, this.labelTextColor = this.labelTextColor || this.actorTextColor, this.loopTextColor = this.loopTextColor || this.actorTextColor, this.activationBorderColor = this.activationBorderColor || I(this.secondaryColor, 10), this.activationBkgColor = this.activationBkgColor || this.secondaryColor, this.sequenceNumberColor = this.sequenceNumberColor || F(this.lineColor), this.rectBkgColor = this.rectBkgColor || this.tertiaryColor;
    const t = "#ECECFE", r = "#E9E9F1", i = k(t, { h: 180, l: 5 });
    if (this.sectionBkgColor = this.sectionBkgColor || i, this.altSectionBkgColor = this.altSectionBkgColor || "white", this.sectionBkgColor = this.sectionBkgColor || r, this.sectionBkgColor2 = this.sectionBkgColor2 || t, this.excludeBkgColor = this.excludeBkgColor || "#eeeeee", this.taskBorderColor = this.taskBorderColor || this.primaryBorderColor, this.taskBkgColor = this.taskBkgColor || t, this.activeTaskBorderColor = this.activeTaskBorderColor || t, this.activeTaskBkgColor = this.activeTaskBkgColor || O(t, 23), this.gridColor = this.gridColor || "lightgrey", this.doneTaskBkgColor = this.doneTaskBkgColor || "lightgrey", this.doneTaskBorderColor = this.doneTaskBorderColor || "grey", this.critBorderColor = this.critBorderColor || "#ff8888", this.critBkgColor = this.critBkgColor || "red", this.todayLineColor = this.todayLineColor || "red", this.taskTextColor = this.taskTextColor || this.textColor, this.taskTextOutsideColor = this.taskTextOutsideColor || this.textColor, this.vertLineColor = this.vertLineColor || this.primaryBorderColor, this.taskTextLightColor = this.taskTextLightColor || this.textColor, this.taskTextColor = this.taskTextColor || this.primaryTextColor, this.taskTextDarkColor = this.taskTextDarkColor || this.textColor, this.taskTextClickableColor = this.taskTextClickableColor || "#003163", this.archEdgeColor = this.lineColor, this.archEdgeArrowColor = this.lineColor, this.personBorder = this.personBorder || this.primaryBorderColor, this.personBkg = this.personBkg || this.mainBkg, this.transitionColor = this.transitionColor || this.lineColor, this.transitionLabelColor = this.transitionLabelColor || this.textColor, this.stateLabelColor = this.stateLabelColor || this.stateBkg || this.primaryTextColor, this.stateBkg = this.stateBkg || this.mainBkg, this.labelBackgroundColor = this.labelBackgroundColor || this.stateBkg, this.compositeBackground = this.compositeBackground || this.background || this.tertiaryColor, this.altBackground = this.altBackground || "#f0f0f0", this.compositeTitleBackground = this.compositeTitleBackground || this.mainBkg, this.compositeBorder = this.compositeBorder || this.nodeBorder, this.innerEndBackground = this.nodeBorder, this.errorBkgColor = this.errorBkgColor || this.tertiaryColor, this.errorTextColor = this.errorTextColor || this.tertiaryTextColor, this.transitionColor = this.transitionColor || this.lineColor, this.specialStateColor = this.lineColor, this.cScale0 = this.cScale0 || t, this.cScale1 = this.cScale1 || r, this.cScale2 = this.cScale2 || i, this.cScale3 = this.cScale3 || k(t, { h: 30 }), this.cScale4 = this.cScale4 || k(t, { h: 60 }), this.cScale5 = this.cScale5 || k(t, { h: 90 }), this.cScale6 = this.cScale6 || k(t, { h: 120 }), this.cScale7 = this.cScale7 || k(t, { h: 150 }), this.cScale8 = this.cScale8 || k(t, { h: 210, l: 150 }), this.cScale9 = this.cScale9 || k(t, { h: 270 }), this.cScale10 = this.cScale10 || k(t, { h: 300 }), this.cScale11 = this.cScale11 || k(t, { h: 330 }), this.darkMode)
      for (let o = 0; o < this.THEME_COLOR_LIMIT; o++)
        this["cScale" + o] = I(this["cScale" + o], 75);
    else
      for (let o = 0; o < this.THEME_COLOR_LIMIT; o++)
        this["cScale" + o] = I(this["cScale" + o], 25);
    for (let o = 0; o < this.THEME_COLOR_LIMIT; o++)
      this["cScaleInv" + o] = this["cScaleInv" + o] || F(this["cScale" + o]);
    for (let o = 0; o < this.THEME_COLOR_LIMIT; o++)
      this.darkMode ? this["cScalePeer" + o] = this["cScalePeer" + o] || O(this["cScale" + o], 10) : this["cScalePeer" + o] = this["cScalePeer" + o] || I(this["cScale" + o], 10);
    this.scaleLabelColor = this.scaleLabelColor || this.labelTextColor;
    for (let o = 0; o < this.THEME_COLOR_LIMIT; o++)
      this["cScaleLabel" + o] = this["cScaleLabel" + o] || this.scaleLabelColor;
    const s = this.darkMode ? -4 : -1;
    for (let o = 0; o < 5; o++)
      this["surface" + o] = this["surface" + o] || k(this.mainBkg, { h: 180, s: -15, l: s * (5 + o * 3) }), this["surfacePeer" + o] = this["surfacePeer" + o] || k(this.mainBkg, { h: 180, s: -15, l: s * (8 + o * 3) });
    this.classText = this.classText || this.textColor, this.fillType0 = this.fillType0 || t, this.fillType1 = this.fillType1 || r, this.fillType2 = this.fillType2 || k(t, { h: 64 }), this.fillType3 = this.fillType3 || k(r, { h: 64 }), this.fillType4 = this.fillType4 || k(t, { h: -64 }), this.fillType5 = this.fillType5 || k(r, { h: -64 }), this.fillType6 = this.fillType6 || k(t, { h: 128 }), this.fillType7 = this.fillType7 || k(r, { h: 128 }), this.pie1 = this.pie1 || t, this.pie2 = this.pie2 || r, this.pie3 = this.pie3 || i, this.pie4 = this.pie4 || k(t, { l: -10 }), this.pie5 = this.pie5 || k(r, { l: -10 }), this.pie6 = this.pie6 || k(i, { l: -10 }), this.pie7 = this.pie7 || k(t, { h: 60, l: -10 }), this.pie8 = this.pie8 || k(t, { h: -60, l: -10 }), this.pie9 = this.pie9 || k(t, { h: 120, l: 0 }), this.pie10 = this.pie10 || k(t, { h: 60, l: -20 }), this.pie11 = this.pie11 || k(t, { h: -60, l: -20 }), this.pie12 = this.pie12 || k(t, { h: 120, l: -10 }), this.pieTitleTextSize = this.pieTitleTextSize || "25px", this.pieTitleTextColor = this.pieTitleTextColor || this.taskTextDarkColor, this.pieSectionTextSize = this.pieSectionTextSize || "17px", this.pieSectionTextColor = this.pieSectionTextColor || this.textColor, this.pieLegendTextSize = this.pieLegendTextSize || "17px", this.pieLegendTextColor = this.pieLegendTextColor || this.taskTextDarkColor, this.pieStrokeColor = this.pieStrokeColor || "black", this.pieStrokeWidth = this.pieStrokeWidth || "2px", this.pieOuterStrokeWidth = this.pieOuterStrokeWidth || "2px", this.pieOuterStrokeColor = this.pieOuterStrokeColor || "black", this.pieOpacity = this.pieOpacity || "0.7", this.vennTitleTextColor = this.vennTitleTextColor ?? this.titleColor, this.vennSetTextColor = this.vennSetTextColor ?? this.textColor, this.quadrant1Fill = this.quadrant1Fill || t, this.quadrant2Fill = this.quadrant2Fill || k(t, { r: 5, g: 5, b: 5 }), this.quadrant3Fill = this.quadrant3Fill || k(t, { r: 10, g: 10, b: 10 }), this.quadrant4Fill = this.quadrant4Fill || k(t, { r: 15, g: 15, b: 15 }), this.quadrant1TextFill = this.quadrant1TextFill || this.primaryTextColor, this.quadrant2TextFill = this.quadrant2TextFill || k(this.primaryTextColor, { r: -5, g: -5, b: -5 }), this.quadrant3TextFill = this.quadrant3TextFill || k(this.primaryTextColor, { r: -10, g: -10, b: -10 }), this.quadrant4TextFill = this.quadrant4TextFill || k(this.primaryTextColor, { r: -15, g: -15, b: -15 }), this.quadrantPointFill = this.quadrantPointFill || be(this.quadrant1Fill) ? O(this.quadrant1Fill) : I(this.quadrant1Fill), this.quadrantPointTextFill = this.quadrantPointTextFill || this.primaryTextColor, this.quadrantXAxisTextFill = this.quadrantXAxisTextFill || this.primaryTextColor, this.quadrantYAxisTextFill = this.quadrantYAxisTextFill || this.primaryTextColor, this.quadrantInternalBorderStrokeFill = this.quadrantInternalBorderStrokeFill || this.primaryBorderColor, this.quadrantExternalBorderStrokeFill = this.quadrantExternalBorderStrokeFill || this.primaryBorderColor, this.quadrantTitleFill = this.quadrantTitleFill || this.primaryTextColor, this.xyChart = {
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
    }, this.requirementBackground = this.requirementBackground || t, this.requirementBorderColor = this.requirementBorderColor || this.primaryBorderColor, this.requirementBorderSize = this.requirementBorderSize || "1", this.requirementTextColor = this.requirementTextColor || this.primaryTextColor, this.relationColor = this.relationColor || this.lineColor, this.relationLabelBackground = this.relationLabelBackground || (this.darkMode ? I(this.secondaryColor, 30) : this.secondaryColor), this.relationLabelColor = this.relationLabelColor || this.actorTextColor, this.git0 = this.git0 || t, this.git1 = this.git1 || r, this.git2 = this.git2 || i, this.git3 = this.git3 || k(t, { h: -30 }), this.git4 = this.git4 || k(t, { h: -60 }), this.git5 = this.git5 || k(t, { h: -90 }), this.git6 = this.git6 || k(t, { h: 60 }), this.git7 = this.git7 || k(t, { h: 120 }), this.darkMode ? (this.git0 = O(this.git0, 25), this.git1 = O(this.git1, 25), this.git2 = O(this.git2, 25), this.git3 = O(this.git3, 25), this.git4 = O(this.git4, 25), this.git5 = O(this.git5, 25), this.git6 = O(this.git6, 25), this.git7 = O(this.git7, 25)) : (this.git0 = I(this.git0, 25), this.git1 = I(this.git1, 25), this.git2 = I(this.git2, 25), this.git3 = I(this.git3, 25), this.git4 = I(this.git4, 25), this.git5 = I(this.git5, 25), this.git6 = I(this.git6, 25), this.git7 = I(this.git7, 25)), this.gitInv0 = this.gitInv0 || F(this.git0), this.gitInv1 = this.gitInv1 || F(this.git1), this.gitInv2 = this.gitInv2 || F(this.git2), this.gitInv3 = this.gitInv3 || F(this.git3), this.gitInv4 = this.gitInv4 || F(this.git4), this.gitInv5 = this.gitInv5 || F(this.git5), this.gitInv6 = this.gitInv6 || F(this.git6), this.gitInv7 = this.gitInv7 || F(this.git7), this.branchLabelColor = this.branchLabelColor || (this.darkMode ? "black" : this.labelTextColor), this.gitBranchLabel0 = this.gitBranchLabel0 || this.branchLabelColor, this.gitBranchLabel1 = this.gitBranchLabel1 || this.branchLabelColor, this.gitBranchLabel2 = this.gitBranchLabel2 || this.branchLabelColor, this.gitBranchLabel3 = this.gitBranchLabel3 || this.branchLabelColor, this.gitBranchLabel4 = this.gitBranchLabel4 || this.branchLabelColor, this.gitBranchLabel5 = this.gitBranchLabel5 || this.branchLabelColor, this.gitBranchLabel6 = this.gitBranchLabel6 || this.branchLabelColor, this.gitBranchLabel7 = this.gitBranchLabel7 || this.branchLabelColor, this.tagLabelColor = this.tagLabelColor || this.primaryTextColor, this.tagLabelBackground = this.tagLabelBackground || this.primaryColor, this.tagLabelBorder = this.tagBorder || this.primaryBorderColor, this.tagLabelFontSize = this.tagLabelFontSize || "10px", this.commitLabelColor = this.commitLabelColor || this.secondaryTextColor, this.commitLabelBackground = this.commitLabelBackground || this.secondaryColor, this.commitLabelFontSize = this.commitLabelFontSize || "10px", this.attributeBackgroundColorOdd = this.attributeBackgroundColorOdd || Me, this.attributeBackgroundColorEven = this.attributeBackgroundColorEven || $e;
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
}, p(Zr, "Theme"), Zr), S0 = /* @__PURE__ */ p((e) => {
  const t = new w0();
  return t.calculate(e), t;
}, "getThemeVariables"), Qr, T0 = (Qr = class {
  constructor() {
    this.background = "#333", this.primaryColor = "#1f2020", this.secondaryColor = O(this.primaryColor, 16), this.tertiaryColor = k(this.primaryColor, { h: -160 }), this.primaryBorderColor = F(this.background), this.secondaryBorderColor = gt(this.secondaryColor, this.darkMode), this.tertiaryBorderColor = gt(this.tertiaryColor, this.darkMode), this.primaryTextColor = F(this.primaryColor), this.secondaryTextColor = F(this.secondaryColor), this.tertiaryTextColor = F(this.tertiaryColor), this.mainBkg = "#2a2020", this.secondBkg = "calculated", this.mainContrastColor = "lightgrey", this.darkTextColor = O(F("#323D47"), 10), this.border1 = "#ccc", this.border2 = Je(255, 255, 255, 0.25), this.arrowheadColor = F(this.background), this.fontFamily = "arial, sans-serif", this.fontSize = "14px", this.labelBackground = "#181818", this.textColor = "#ccc", this.THEME_COLOR_LIMIT = 12, this.radius = 3, this.strokeWidth = 1, this.noteBkgColor = "#fff5ad", this.noteTextColor = "#333", this.THEME_COLOR_LIMIT = 12, this.fontFamily = "arial, sans-serif", this.fontSize = "14px", this.useGradient = !0, this.gradientStart = "#0042eb", this.gradientStop = "#eb0042", this.dropShadow = "drop-shadow( 1px 2px 2px rgba(185,185,185,0.2))", this.archEdgeColor = "calculated", this.archEdgeArrowColor = "calculated", this.archEdgeWidth = "3", this.archGroupBorderColor = this.primaryBorderColor, this.archGroupBorderWidth = "2px", this.noteFontWeight = "normal", this.fontWeight = "normal";
  }
  updateColors() {
    if (this.primaryTextColor = this.primaryTextColor || (this.darkMode ? "#eee" : "#333"), this.secondaryColor = this.secondaryColor || k(this.primaryColor, { h: -120 }), this.tertiaryColor = this.tertiaryColor || k(this.primaryColor, { h: 180, l: 5 }), this.primaryBorderColor = this.primaryBorderColor || gt(this.primaryColor, this.darkMode), this.secondaryBorderColor = this.secondaryBorderColor || gt(this.secondaryColor, this.darkMode), this.tertiaryBorderColor = this.tertiaryBorderColor || gt(this.tertiaryColor, this.darkMode), this.noteBorderColor = this.noteBorderColor || gt(this.noteBkgColor, this.darkMode), this.noteBkgColor = this.noteBkgColor || "#fff5ad", this.noteTextColor = this.noteTextColor || "#333", this.secondaryTextColor = this.secondaryTextColor || F(this.secondaryColor), this.tertiaryTextColor = this.tertiaryTextColor || F(this.tertiaryColor), this.lineColor = this.lineColor || F(this.background), this.arrowheadColor = this.arrowheadColor || F(this.background), this.textColor = this.textColor || this.primaryTextColor, this.border2 = this.border2 || this.tertiaryBorderColor, this.nodeBkg = this.nodeBkg || this.primaryColor, this.mainBkg = this.mainBkg || this.primaryColor, this.nodeBorder = this.nodeBorder || this.border1, this.clusterBkg = this.clusterBkg || this.tertiaryColor, this.clusterBorder = this.clusterBorder || this.tertiaryBorderColor, this.defaultLinkColor = this.defaultLinkColor || this.lineColor, this.titleColor = this.titleColor || this.tertiaryTextColor, this.edgeLabelBackground = this.edgeLabelBackground || (this.darkMode ? I(this.secondaryColor, 30) : this.secondaryColor), this.nodeTextColor = this.nodeTextColor || this.primaryTextColor, this.actorBorder = this.actorBorder || this.primaryBorderColor, this.actorBkg = this.actorBkg || this.mainBkg, this.actorTextColor = this.actorTextColor || this.primaryTextColor, this.actorLineColor = this.actorLineColor || this.actorBorder, this.labelBoxBkgColor = this.labelBoxBkgColor || this.actorBkg, this.signalColor = this.signalColor || this.textColor, this.signalTextColor = this.signalTextColor || this.textColor, this.labelBoxBorderColor = this.labelBoxBorderColor || this.actorBorder, this.labelTextColor = this.labelTextColor || this.actorTextColor, this.loopTextColor = this.loopTextColor || this.actorTextColor, this.activationBorderColor = this.activationBorderColor || I(this.secondaryColor, 10), this.activationBkgColor = this.activationBkgColor || this.secondaryColor, this.sequenceNumberColor = this.sequenceNumberColor || F(this.lineColor), this.rectBkgColor = this.rectBkgColor || this.tertiaryColor, this.sectionBkgColor = this.sectionBkgColor || this.tertiaryColor, this.altSectionBkgColor = this.altSectionBkgColor || "white", this.sectionBkgColor = this.sectionBkgColor || this.secondaryColor, this.sectionBkgColor2 = this.sectionBkgColor2 || this.primaryColor, this.excludeBkgColor = this.excludeBkgColor || "#eeeeee", this.taskBorderColor = this.taskBorderColor || this.primaryBorderColor, this.taskBkgColor = this.taskBkgColor || this.primaryColor, this.activeTaskBorderColor = this.activeTaskBorderColor || this.primaryColor, this.activeTaskBkgColor = this.activeTaskBkgColor || O(this.primaryColor, 23), this.gridColor = this.gridColor || "lightgrey", this.doneTaskBkgColor = this.doneTaskBkgColor || "lightgrey", this.doneTaskBorderColor = this.doneTaskBorderColor || "grey", this.critBorderColor = this.critBorderColor || "#ff8888", this.critBkgColor = this.critBkgColor || "red", this.todayLineColor = this.todayLineColor || "red", this.vertLineColor = this.vertLineColor || this.primaryBorderColor, this.taskTextColor = this.taskTextColor || this.textColor, this.taskTextOutsideColor = this.taskTextOutsideColor || this.textColor, this.taskTextLightColor = this.taskTextLightColor || this.textColor, this.taskTextColor = this.taskTextColor || this.primaryTextColor, this.taskTextDarkColor = this.taskTextDarkColor || this.textColor, this.taskTextClickableColor = this.taskTextClickableColor || "#003163", this.archEdgeColor = this.lineColor, this.archEdgeArrowColor = this.lineColor, this.personBorder = this.personBorder || this.primaryBorderColor, this.personBkg = this.personBkg || this.mainBkg, this.transitionColor = this.transitionColor || this.lineColor, this.transitionLabelColor = this.transitionLabelColor || this.textColor, this.stateLabelColor = this.stateLabelColor || this.stateBkg || this.primaryTextColor, this.stateBkg = this.stateBkg || this.mainBkg, this.labelBackgroundColor = this.labelBackgroundColor || this.stateBkg, this.compositeBackground = this.compositeBackground || this.background || this.tertiaryColor, this.altBackground = this.altBackground || "#f0f0f0", this.compositeTitleBackground = this.compositeTitleBackground || this.mainBkg, this.compositeBorder = this.compositeBorder || this.nodeBorder, this.innerEndBackground = this.nodeBorder, this.errorBkgColor = this.errorBkgColor || this.tertiaryColor, this.errorTextColor = this.errorTextColor || this.tertiaryTextColor, this.transitionColor = this.transitionColor || this.lineColor, this.specialStateColor = this.lineColor, this.cScale0 = this.cScale0 || this.primaryColor, this.cScale1 = this.cScale1 || this.secondaryColor, this.cScale2 = this.cScale2 || this.tertiaryColor, this.cScale3 = this.cScale3 || k(this.primaryColor, { h: 30 }), this.cScale4 = this.cScale4 || k(this.primaryColor, { h: 60 }), this.cScale5 = this.cScale5 || k(this.primaryColor, { h: 90 }), this.cScale6 = this.cScale6 || k(this.primaryColor, { h: 120 }), this.cScale7 = this.cScale7 || k(this.primaryColor, { h: 150 }), this.cScale8 = this.cScale8 || k(this.primaryColor, { h: 210, l: 150 }), this.cScale9 = this.cScale9 || k(this.primaryColor, { h: 270 }), this.cScale10 = this.cScale10 || k(this.primaryColor, { h: 300 }), this.cScale11 = this.cScale11 || k(this.primaryColor, { h: 330 }), this.darkMode)
      for (let r = 0; r < this.THEME_COLOR_LIMIT; r++)
        this["cScale" + r] = I(this["cScale" + r], 75);
    else
      for (let r = 0; r < this.THEME_COLOR_LIMIT; r++)
        this["cScale" + r] = I(this["cScale" + r], 25);
    for (let r = 0; r < this.THEME_COLOR_LIMIT; r++)
      this["cScaleInv" + r] = this["cScaleInv" + r] || F(this["cScale" + r]);
    for (let r = 0; r < this.THEME_COLOR_LIMIT; r++)
      this.darkMode ? this["cScalePeer" + r] = this["cScalePeer" + r] || O(this["cScale" + r], 10) : this["cScalePeer" + r] = this["cScalePeer" + r] || I(this["cScale" + r], 10);
    this.scaleLabelColor = this.scaleLabelColor || this.labelTextColor;
    for (let r = 0; r < this.THEME_COLOR_LIMIT; r++)
      this["cScaleLabel" + r] = this["cScaleLabel" + r] || this.scaleLabelColor;
    const t = this.darkMode ? -4 : -1;
    for (let r = 0; r < 5; r++)
      this["surface" + r] = this["surface" + r] || k(this.mainBkg, { h: 180, s: -15, l: t * (5 + r * 3) }), this["surfacePeer" + r] = this["surfacePeer" + r] || k(this.mainBkg, { h: 180, s: -15, l: t * (8 + r * 3) });
    this.classText = this.classText || this.textColor, this.fillType0 = this.fillType0 || this.primaryColor, this.fillType1 = this.fillType1 || this.secondaryColor, this.fillType2 = this.fillType2 || k(this.primaryColor, { h: 64 }), this.fillType3 = this.fillType3 || k(this.secondaryColor, { h: 64 }), this.fillType4 = this.fillType4 || k(this.primaryColor, { h: -64 }), this.fillType5 = this.fillType5 || k(this.secondaryColor, { h: -64 }), this.fillType6 = this.fillType6 || k(this.primaryColor, { h: 128 }), this.fillType7 = this.fillType7 || k(this.secondaryColor, { h: 128 }), this.pie1 = this.pie1 || this.primaryColor, this.pie2 = this.pie2 || this.secondaryColor, this.pie3 = this.pie3 || this.tertiaryColor, this.pie4 = this.pie4 || k(this.primaryColor, { l: -10 }), this.pie5 = this.pie5 || k(this.secondaryColor, { l: -10 }), this.pie6 = this.pie6 || k(this.tertiaryColor, { l: -10 }), this.pie7 = this.pie7 || k(this.primaryColor, { h: 60, l: -10 }), this.pie8 = this.pie8 || k(this.primaryColor, { h: -60, l: -10 }), this.pie9 = this.pie9 || k(this.primaryColor, { h: 120, l: 0 }), this.pie10 = this.pie10 || k(this.primaryColor, { h: 60, l: -20 }), this.pie11 = this.pie11 || k(this.primaryColor, { h: -60, l: -20 }), this.pie12 = this.pie12 || k(this.primaryColor, { h: 120, l: -10 }), this.pieTitleTextSize = this.pieTitleTextSize || "25px", this.pieTitleTextColor = this.pieTitleTextColor || this.taskTextDarkColor, this.pieSectionTextSize = this.pieSectionTextSize || "17px", this.pieSectionTextColor = this.pieSectionTextColor || this.textColor, this.pieLegendTextSize = this.pieLegendTextSize || "17px", this.pieLegendTextColor = this.pieLegendTextColor || this.taskTextDarkColor, this.pieStrokeColor = this.pieStrokeColor || "black", this.pieStrokeWidth = this.pieStrokeWidth || "2px", this.pieOuterStrokeWidth = this.pieOuterStrokeWidth || "2px", this.pieOuterStrokeColor = this.pieOuterStrokeColor || "black", this.pieOpacity = this.pieOpacity || "0.7", this.vennTitleTextColor = this.vennTitleTextColor ?? this.titleColor, this.vennSetTextColor = this.vennSetTextColor ?? this.textColor, this.quadrant1Fill = this.quadrant1Fill || this.primaryColor, this.quadrant2Fill = this.quadrant2Fill || k(this.primaryColor, { r: 5, g: 5, b: 5 }), this.quadrant3Fill = this.quadrant3Fill || k(this.primaryColor, { r: 10, g: 10, b: 10 }), this.quadrant4Fill = this.quadrant4Fill || k(this.primaryColor, { r: 15, g: 15, b: 15 }), this.quadrant1TextFill = this.quadrant1TextFill || this.primaryTextColor, this.quadrant2TextFill = this.quadrant2TextFill || k(this.primaryTextColor, { r: -5, g: -5, b: -5 }), this.quadrant3TextFill = this.quadrant3TextFill || k(this.primaryTextColor, { r: -10, g: -10, b: -10 }), this.quadrant4TextFill = this.quadrant4TextFill || k(this.primaryTextColor, { r: -15, g: -15, b: -15 }), this.quadrantPointFill = this.quadrantPointFill || be(this.quadrant1Fill) ? O(this.quadrant1Fill) : I(this.quadrant1Fill), this.quadrantPointTextFill = this.quadrantPointTextFill || this.primaryTextColor, this.quadrantXAxisTextFill = this.quadrantXAxisTextFill || this.primaryTextColor, this.quadrantYAxisTextFill = this.quadrantYAxisTextFill || this.primaryTextColor, this.quadrantInternalBorderStrokeFill = this.quadrantInternalBorderStrokeFill || this.primaryBorderColor, this.quadrantExternalBorderStrokeFill = this.quadrantExternalBorderStrokeFill || this.primaryBorderColor, this.quadrantTitleFill = this.quadrantTitleFill || this.primaryTextColor, this.xyChart = {
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
    }, this.requirementBackground = this.requirementBackground || this.primaryColor, this.requirementBorderColor = this.requirementBorderColor || this.primaryBorderColor, this.requirementBorderSize = this.requirementBorderSize || "1", this.requirementTextColor = this.requirementTextColor || this.primaryTextColor, this.relationColor = this.relationColor || this.lineColor, this.relationLabelBackground = this.relationLabelBackground || (this.darkMode ? I(this.secondaryColor, 30) : this.secondaryColor), this.relationLabelColor = this.relationLabelColor || this.actorTextColor, this.git0 = this.git0 || "#0b0000", this.git1 = this.git1 || "#4d1037", this.git2 = this.git2 || "#3f5258", this.git3 = this.git3 || "#4f2f1b", this.git4 = this.git4 || "#6e0a0a", this.git5 = this.git5 || "#3b0048", this.git6 = this.git6 || "#995a01", this.git7 = this.git7 || "#154706", this.gitDarkMode = !0, this.gitDarkMode ? (this.git0 = O(this.git0, 25), this.git1 = O(this.git1, 25), this.git2 = O(this.git2, 25), this.git3 = O(this.git3, 25), this.git4 = O(this.git4, 25), this.git5 = O(this.git5, 25), this.git6 = O(this.git6, 25), this.git7 = O(this.git7, 25)) : (this.git0 = I(this.git0, 25), this.git1 = I(this.git1, 25), this.git2 = I(this.git2, 25), this.git3 = I(this.git3, 25), this.git4 = I(this.git4, 25), this.git5 = I(this.git5, 25), this.git6 = I(this.git6, 25), this.git7 = I(this.git7, 25)), this.gitInv0 = this.gitInv0 || F(this.git0), this.gitInv1 = this.gitInv1 || F(this.git1), this.gitInv2 = this.gitInv2 || F(this.git2), this.gitInv3 = this.gitInv3 || F(this.git3), this.gitInv4 = this.gitInv4 || F(this.git4), this.gitInv5 = this.gitInv5 || F(this.git5), this.gitInv6 = this.gitInv6 || F(this.git6), this.gitInv7 = this.gitInv7 || F(this.git7), this.branchLabelColor = this.branchLabelColor || (this.darkMode ? "black" : this.labelTextColor), this.gitBranchLabel0 = this.gitBranchLabel0 || this.branchLabelColor, this.gitBranchLabel1 = this.gitBranchLabel1 || this.branchLabelColor, this.gitBranchLabel2 = this.gitBranchLabel2 || this.branchLabelColor, this.gitBranchLabel3 = this.gitBranchLabel3 || this.branchLabelColor, this.gitBranchLabel4 = this.gitBranchLabel4 || this.branchLabelColor, this.gitBranchLabel5 = this.gitBranchLabel5 || this.branchLabelColor, this.gitBranchLabel6 = this.gitBranchLabel6 || this.branchLabelColor, this.gitBranchLabel7 = this.gitBranchLabel7 || this.branchLabelColor, this.tagLabelColor = this.tagLabelColor || this.primaryTextColor, this.tagLabelBackground = this.tagLabelBackground || this.primaryColor, this.tagLabelBorder = this.tagBorder || this.primaryBorderColor, this.tagLabelFontSize = this.tagLabelFontSize || "10px", this.commitLabelColor = this.commitLabelColor || this.secondaryTextColor, this.commitLabelBackground = this.commitLabelBackground || this.secondaryColor, this.commitLabelFontSize = this.commitLabelFontSize || "10px", this.attributeBackgroundColorOdd = this.attributeBackgroundColorOdd || Me, this.attributeBackgroundColorEven = this.attributeBackgroundColorEven || $e;
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
}, p(Qr, "Theme"), Qr), B0 = /* @__PURE__ */ p((e) => {
  const t = new T0();
  return t.calculate(e), t;
}, "getThemeVariables"), Jr, _0 = (Jr = class {
  constructor() {
    this.background = "#ffffff", this.primaryColor = "#cccccc", this.mainBkg = "#ffffff", this.noteBkgColor = "#fff5ad", this.noteTextColor = "#28253D", this.THEME_COLOR_LIMIT = 12, this.radius = 12, this.strokeWidth = 2, this.primaryBorderColor = gt("#28253D", this.darkMode), this.fontFamily = '"Recursive Variable", arial, sans-serif', this.fontSize = "14px", this.nodeBorder = "#28253D", this.stateBorder = "#28253D", this.useGradient = !1, this.gradientStart = "#0042eb", this.gradientStop = "#eb0042", this.dropShadow = "url(#drop-shadow)", this.nodeShadow = !0, this.tertiaryColor = "#ffffff", this.clusterBkg = "#F9F9FB", this.clusterBorder = "#BDBCCC", this.noteBorderColor = "#FACC15", this.archEdgeColor = "calculated", this.archEdgeArrowColor = "calculated", this.archEdgeWidth = "3", this.archGroupBorderColor = this.primaryBorderColor, this.archGroupBorderWidth = "2px", this.actorBorder = "#28253D", this.filterColor = "#000000";
  }
  updateColors() {
    this.primaryTextColor = this.primaryTextColor || (this.darkMode ? "#eee" : "#28253D"), this.secondaryColor = this.secondaryColor || k(this.primaryColor, { h: -120 }), this.tertiaryColor = this.tertiaryColor || k(this.primaryColor, { h: 180, l: 5 }), this.primaryBorderColor = this.primaryBorderColor || gt(this.primaryColor, this.darkMode), this.secondaryBorderColor = this.secondaryBorderColor || gt(this.secondaryColor, this.darkMode), this.tertiaryBorderColor = this.tertiaryBorderColor || gt(this.tertiaryColor, this.darkMode), this.noteBorderColor = this.noteBorderColor || gt(this.noteBkgColor, this.darkMode), this.noteBkgColor = this.noteBkgColor || "#FEF9C3", this.noteTextColor = this.noteTextColor || "#28253D", this.secondaryTextColor = this.secondaryTextColor || F(this.secondaryColor), this.tertiaryTextColor = this.tertiaryTextColor || F(this.tertiaryColor), this.lineColor = this.lineColor || F(this.background), this.arrowheadColor = this.arrowheadColor || F(this.background), this.textColor = this.textColor || this.primaryTextColor, this.border2 = this.border2 || this.tertiaryBorderColor, this.nodeBkg = this.nodeBkg || this.primaryColor, this.mainBkg = this.mainBkg || this.primaryColor, this.nodeBorder = this.nodeBorder || this.primaryBorderColor, this.clusterBkg = this.clusterBkg || this.tertiaryColor, this.clusterBorder = this.clusterBorder || this.tertiaryBorderColor, this.defaultLinkColor = this.defaultLinkColor || this.lineColor, this.titleColor = this.titleColor || this.tertiaryTextColor, this.edgeLabelBackground = this.edgeLabelBackground || (this.darkMode ? I(this.secondaryColor, 30) : this.secondaryColor), this.nodeTextColor = this.nodeTextColor || this.primaryTextColor, this.noteFontWeight = 600, this.actorBorder = this.actorBorder || this.primaryBorderColor, this.actorBkg = this.actorBkg || this.mainBkg, this.actorTextColor = this.actorTextColor || this.primaryTextColor, this.actorLineColor = this.actorLineColor || this.actorBorder, this.labelBoxBkgColor = this.labelBoxBkgColor || this.actorBkg, this.signalColor = this.signalColor || this.textColor, this.signalTextColor = this.signalTextColor || this.textColor, this.labelBoxBorderColor = this.labelBoxBorderColor || this.actorBorder, this.labelTextColor = this.labelTextColor || this.actorTextColor, this.loopTextColor = this.loopTextColor || this.actorTextColor, this.activationBorderColor = this.activationBorderColor || I(this.secondaryColor, 10), this.activationBkgColor = this.activationBkgColor || this.secondaryColor, this.sequenceNumberColor = this.sequenceNumberColor || F(this.lineColor), this.rectBkgColor = this.rectBkgColor || this.tertiaryColor;
    const t = "#ECECFE", r = "#E9E9F1", i = k(t, { h: 180, l: 5 });
    this.sectionBkgColor = this.sectionBkgColor || i, this.altSectionBkgColor = this.altSectionBkgColor || "white", this.sectionBkgColor = this.sectionBkgColor || r, this.sectionBkgColor2 = this.sectionBkgColor2 || t, this.excludeBkgColor = this.excludeBkgColor || "#eeeeee", this.taskBorderColor = this.taskBorderColor || this.primaryBorderColor, this.taskBkgColor = this.taskBkgColor || t, this.activeTaskBorderColor = this.activeTaskBorderColor || t, this.activeTaskBkgColor = this.activeTaskBkgColor || O(t, 23), this.gridColor = this.gridColor || "lightgrey", this.doneTaskBkgColor = this.doneTaskBkgColor || "lightgrey", this.doneTaskBorderColor = this.doneTaskBorderColor || "grey", this.critBorderColor = this.critBorderColor || "#ff8888", this.critBkgColor = this.critBkgColor || "red", this.todayLineColor = this.todayLineColor || "red", this.taskTextColor = this.taskTextColor || this.textColor, this.vertLineColor = this.vertLineColor || this.primaryBorderColor, this.taskTextOutsideColor = this.taskTextOutsideColor || this.textColor, this.taskTextLightColor = this.taskTextLightColor || this.textColor, this.taskTextColor = this.taskTextColor || this.primaryTextColor, this.taskTextDarkColor = this.taskTextDarkColor || this.textColor, this.taskTextClickableColor = this.taskTextClickableColor || "#003163", this.archEdgeColor = this.lineColor, this.archEdgeArrowColor = this.lineColor, this.personBorder = this.personBorder || this.primaryBorderColor, this.personBkg = this.personBkg || this.mainBkg, this.transitionColor = this.transitionColor || this.lineColor, this.transitionLabelColor = this.transitionLabelColor || this.textColor, this.stateLabelColor = this.stateLabelColor || this.stateBkg || this.primaryTextColor, this.compositeTitleBackground = "#F9F9FB", this.altBackground = "#F9F9FB", this.stateEdgeLabelBackground = "#FFFFFF", this.fontWeight = 600, this.stateBkg = this.stateBkg || this.mainBkg, this.labelBackgroundColor = this.labelBackgroundColor || this.stateBkg, this.compositeBackground = this.compositeBackground || this.background || this.tertiaryColor, this.altBackground = this.altBackground || "#f0f0f0", this.compositeTitleBackground = this.compositeTitleBackground || this.mainBkg, this.compositeBorder = this.compositeBorder || this.nodeBorder, this.innerEndBackground = this.nodeBorder, this.errorBkgColor = this.errorBkgColor || this.tertiaryColor, this.errorTextColor = this.errorTextColor || this.tertiaryTextColor, this.transitionColor = this.transitionColor || this.lineColor, this.specialStateColor = this.lineColor;
    for (let o = 0; o < this.THEME_COLOR_LIMIT; o++)
      this["cScale" + o] = this.mainBkg;
    if (this.darkMode)
      for (let o = 0; o < this.THEME_COLOR_LIMIT; o++)
        this["cScale" + o] = I(this["cScale" + o], 75);
    else
      for (let o = 0; o < this.THEME_COLOR_LIMIT; o++)
        this["cScale" + o] = I(this["cScale" + o], 25);
    for (let o = 0; o < this.THEME_COLOR_LIMIT; o++)
      this["cScaleInv" + o] = this["cScaleInv" + o] || F(this["cScale" + o]);
    for (let o = 0; o < this.THEME_COLOR_LIMIT; o++)
      this.darkMode ? this["cScalePeer" + o] = this["cScalePeer" + o] || O(this["cScale" + o], 10) : this["cScalePeer" + o] = this["cScalePeer" + o] || I(this["cScale" + o], 10);
    this.scaleLabelColor = this.scaleLabelColor || this.labelTextColor;
    for (let o = 0; o < this.THEME_COLOR_LIMIT; o++)
      this["cScaleLabel" + o] = this["cScaleLabel" + o] || this.scaleLabelColor;
    const s = this.darkMode ? -4 : -1;
    for (let o = 0; o < 5; o++)
      this["surface" + o] = this["surface" + o] || k(this.mainBkg, { h: 180, s: -15, l: s * (5 + o * 3) }), this["surfacePeer" + o] = this["surfacePeer" + o] || k(this.mainBkg, { h: 180, s: -15, l: s * (8 + o * 3) });
    this.classText = this.classText || this.textColor, this.fillType0 = this.fillType0 || t, this.fillType1 = this.fillType1 || r, this.fillType2 = this.fillType2 || k(t, { h: 64 }), this.fillType3 = this.fillType3 || k(r, { h: 64 }), this.fillType4 = this.fillType4 || k(t, { h: -64 }), this.fillType5 = this.fillType5 || k(r, { h: -64 }), this.fillType6 = this.fillType6 || k(t, { h: 128 }), this.fillType7 = this.fillType7 || k(r, { h: 128 }), this.pie1 = this.pie1 || t, this.pie2 = this.pie2 || r, this.pie3 = this.pie3 || i, this.pie4 = this.pie4 || k(t, { l: -10 }), this.pie5 = this.pie5 || k(r, { l: -10 }), this.pie6 = this.pie6 || k(i, { l: -10 }), this.pie7 = this.pie7 || k(t, { h: 60, l: -10 }), this.pie8 = this.pie8 || k(t, { h: -60, l: -10 }), this.pie9 = this.pie9 || k(t, { h: 120, l: 0 }), this.pie10 = this.pie10 || k(t, { h: 60, l: -20 }), this.pie11 = this.pie11 || k(t, { h: -60, l: -20 }), this.pie12 = this.pie12 || k(t, { h: 120, l: -10 }), this.pieTitleTextSize = this.pieTitleTextSize || "25px", this.pieTitleTextColor = this.pieTitleTextColor || this.taskTextDarkColor, this.pieSectionTextSize = this.pieSectionTextSize || "17px", this.pieSectionTextColor = this.pieSectionTextColor || this.textColor, this.pieLegendTextSize = this.pieLegendTextSize || "17px", this.pieLegendTextColor = this.pieLegendTextColor || this.taskTextDarkColor, this.pieStrokeColor = this.pieStrokeColor || "black", this.pieStrokeWidth = this.pieStrokeWidth || "2px", this.pieOuterStrokeWidth = this.pieOuterStrokeWidth || "2px", this.pieOuterStrokeColor = this.pieOuterStrokeColor || "black", this.pieOpacity = this.pieOpacity || "0.7", this.vennTitleTextColor = this.vennTitleTextColor ?? this.titleColor, this.vennSetTextColor = this.vennSetTextColor ?? this.textColor, this.quadrant1Fill = this.quadrant1Fill || t, this.quadrant2Fill = this.quadrant2Fill || k(t, { r: 5, g: 5, b: 5 }), this.quadrant3Fill = this.quadrant3Fill || k(t, { r: 10, g: 10, b: 10 }), this.quadrant4Fill = this.quadrant4Fill || k(t, { r: 15, g: 15, b: 15 }), this.quadrant1TextFill = this.quadrant1TextFill || this.primaryTextColor, this.quadrant2TextFill = this.quadrant2TextFill || k(this.primaryTextColor, { r: -5, g: -5, b: -5 }), this.quadrant3TextFill = this.quadrant3TextFill || k(this.primaryTextColor, { r: -10, g: -10, b: -10 }), this.quadrant4TextFill = this.quadrant4TextFill || k(this.primaryTextColor, { r: -15, g: -15, b: -15 }), this.quadrantPointFill = this.quadrantPointFill || be(this.quadrant1Fill) ? O(this.quadrant1Fill) : I(this.quadrant1Fill), this.quadrantPointTextFill = this.quadrantPointTextFill || this.primaryTextColor, this.quadrantXAxisTextFill = this.quadrantXAxisTextFill || this.primaryTextColor, this.quadrantYAxisTextFill = this.quadrantYAxisTextFill || this.primaryTextColor, this.quadrantInternalBorderStrokeFill = this.quadrantInternalBorderStrokeFill || this.primaryBorderColor, this.quadrantExternalBorderStrokeFill = this.quadrantExternalBorderStrokeFill || this.primaryBorderColor, this.quadrantTitleFill = this.quadrantTitleFill || this.primaryTextColor, this.xyChart = {
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
    }, this.requirementBackground = this.requirementBackground || t, this.requirementBorderColor = this.requirementBorderColor || this.primaryBorderColor, this.requirementBorderSize = this.requirementBorderSize || "1", this.requirementTextColor = this.requirementTextColor || this.primaryTextColor, this.relationColor = this.relationColor || this.lineColor, this.relationLabelBackground = this.relationLabelBackground || (this.darkMode ? I(this.secondaryColor, 30) : this.secondaryColor), this.relationLabelColor = this.relationLabelColor || this.actorTextColor, this.requirementEdgeLabelBackground = "#FFFFFF", this.git0 = this.git0 || t, this.git1 = this.git1 || r, this.git2 = this.git2 || i, this.git3 = this.git3 || k(t, { h: -30 }), this.git4 = this.git4 || k(t, { h: -60 }), this.git5 = this.git5 || k(t, { h: -90 }), this.git6 = this.git6 || k(t, { h: 60 }), this.git7 = this.git7 || k(t, { h: 120 }), this.darkMode ? (this.git0 = O(this.git0, 25), this.git1 = O(this.git1, 25), this.git2 = O(this.git2, 25), this.git3 = O(this.git3, 25), this.git4 = O(this.git4, 25), this.git5 = O(this.git5, 25), this.git6 = O(this.git6, 25), this.git7 = O(this.git7, 25)) : (this.git0 = I(this.git0, 25), this.git1 = I(this.git1, 25), this.git2 = I(this.git2, 25), this.git3 = I(this.git3, 25), this.git4 = I(this.git4, 25), this.git5 = I(this.git5, 25), this.git6 = I(this.git6, 25), this.git7 = I(this.git7, 25)), this.gitInv0 = this.gitInv0 || F(this.git0), this.gitInv1 = this.gitInv1 || F(this.git1), this.gitInv2 = this.gitInv2 || F(this.git2), this.gitInv3 = this.gitInv3 || F(this.git3), this.gitInv4 = this.gitInv4 || F(this.git4), this.gitInv5 = this.gitInv5 || F(this.git5), this.gitInv6 = this.gitInv6 || F(this.git6), this.gitInv7 = this.gitInv7 || F(this.git7), this.branchLabelColor = this.branchLabelColor || (this.darkMode ? "black" : this.labelTextColor), this.gitBranchLabel0 = this.gitBranchLabel0 || this.branchLabelColor, this.gitBranchLabel1 = this.gitBranchLabel1 || this.branchLabelColor, this.gitBranchLabel2 = this.gitBranchLabel2 || this.branchLabelColor, this.gitBranchLabel3 = this.gitBranchLabel3 || this.branchLabelColor, this.gitBranchLabel4 = this.gitBranchLabel4 || this.branchLabelColor, this.gitBranchLabel5 = this.gitBranchLabel5 || this.branchLabelColor, this.gitBranchLabel6 = this.gitBranchLabel6 || this.branchLabelColor, this.gitBranchLabel7 = this.gitBranchLabel7 || this.branchLabelColor, this.tagLabelColor = this.tagLabelColor || this.primaryTextColor, this.tagLabelBackground = this.tagLabelBackground || this.primaryColor, this.tagLabelBorder = this.tagBorder || this.primaryBorderColor, this.tagLabelFontSize = this.tagLabelFontSize || "10px", this.commitLabelColor = this.commitLabelColor || this.secondaryTextColor, this.commitLabelBackground = this.commitLabelBackground || this.secondaryColor, this.commitLabelFontSize = this.commitLabelFontSize || "10px", this.commitLineColor = this.commitLineColor ?? "#BDBCCC", this.erEdgeLabelBackground = "#FFFFFF", this.attributeBackgroundColorOdd = this.attributeBackgroundColorOdd || Me, this.attributeBackgroundColorEven = this.attributeBackgroundColorEven || $e;
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
}, p(Jr, "Theme"), Jr), v0 = /* @__PURE__ */ p((e) => {
  const t = new _0();
  return t.calculate(e), t;
}, "getThemeVariables"), ti, L0 = (ti = class {
  constructor() {
    this.background = "#333", this.primaryColor = "#1f2020", this.secondaryColor = O(this.primaryColor, 16), this.tertiaryColor = k(this.primaryColor, { h: -160 }), this.primaryBorderColor = F(this.background), this.secondaryBorderColor = gt(this.secondaryColor, this.darkMode), this.tertiaryBorderColor = gt(this.tertiaryColor, this.darkMode), this.primaryTextColor = F(this.primaryColor), this.secondaryTextColor = F(this.secondaryColor), this.tertiaryTextColor = F(this.tertiaryColor), this.mainBkg = "#111113", this.secondBkg = "calculated", this.mainContrastColor = "lightgrey", this.darkTextColor = O(F("#323D47"), 10), this.border1 = "#ccc", this.border2 = Je(255, 255, 255, 0.25), this.arrowheadColor = F(this.background), this.fontFamily = '"Recursive Variable", arial, sans-serif', this.fontSize = "14px", this.labelBackground = "#111113", this.textColor = "#ccc", this.THEME_COLOR_LIMIT = 12, this.radius = 12, this.strokeWidth = 2, this.noteBkgColor = this.noteBkgColor ?? "#FEF9C3", this.noteTextColor = this.noteTextColor ?? "#28253D", this.THEME_COLOR_LIMIT = 12, this.fontFamily = '"Recursive Variable", arial, sans-serif', this.fontSize = "14px", this.nodeBorder = "#FFFFFF", this.stateBorder = "#FFFFFF", this.useGradient = !1, this.gradientStart = "#0042eb", this.gradientStop = "#eb0042", this.dropShadow = "url(#drop-shadow)", this.nodeShadow = !0, this.archEdgeColor = "calculated", this.archEdgeArrowColor = "calculated", this.archEdgeWidth = "3", this.archGroupBorderColor = this.primaryBorderColor, this.archGroupBorderWidth = "2px", this.clusterBkg = "#1E1A2E", this.clusterBorder = "#BDBCCC", this.noteBorderColor = "#FACC15", this.noteFontWeight = 600, this.filterColor = "#FFFFFF";
  }
  updateColors() {
    if (this.primaryTextColor = this.primaryTextColor || (this.darkMode ? "#eee" : "#FFFFFF"), this.secondaryColor = this.secondaryColor || k(this.primaryColor, { h: -120 }), this.tertiaryColor = this.tertiaryColor || k(this.primaryColor, { h: 180, l: 5 }), this.primaryBorderColor = this.primaryBorderColor || gt(this.primaryColor, this.darkMode), this.secondaryBorderColor = this.secondaryBorderColor || gt(this.secondaryColor, this.darkMode), this.tertiaryBorderColor = this.tertiaryBorderColor || gt(this.tertiaryColor, this.darkMode), this.noteBorderColor = this.noteBorderColor || gt(this.noteBkgColor, this.darkMode), this.noteBkgColor = this.noteBkgColor || "#fff5ad", this.noteTextColor = this.noteTextColor || "#FFFFFF", this.secondaryTextColor = this.secondaryTextColor || F(this.secondaryColor), this.tertiaryTextColor = this.tertiaryTextColor || F(this.tertiaryColor), this.lineColor = this.lineColor || F(this.background), this.arrowheadColor = this.arrowheadColor || F(this.background), this.textColor = this.textColor || this.primaryTextColor, this.border2 = this.border2 || this.tertiaryBorderColor, this.nodeBkg = this.nodeBkg || this.primaryColor, this.mainBkg = this.mainBkg || this.primaryColor, this.nodeBorder = this.nodeBorder || this.border1, this.clusterBkg = this.clusterBkg || this.tertiaryColor, this.clusterBorder = this.clusterBorder || this.tertiaryBorderColor, this.defaultLinkColor = this.defaultLinkColor || this.lineColor, this.titleColor = this.titleColor || this.tertiaryTextColor, this.edgeLabelBackground = this.edgeLabelBackground || (this.darkMode ? I(this.secondaryColor, 30) : this.secondaryColor), this.nodeTextColor = this.nodeTextColor || this.primaryTextColor, this.actorBorder = "#FFFFFF", this.signalColor = "#FFFFFF", this.labelBoxBorderColor = "#BDBCCC", this.actorBorder = this.actorBorder || this.primaryBorderColor, this.actorBkg = this.actorBkg || this.mainBkg, this.actorTextColor = this.actorTextColor || this.primaryTextColor, this.actorLineColor = this.actorLineColor || this.actorBorder, this.labelBoxBkgColor = this.labelBoxBkgColor || this.actorBkg, this.signalColor = this.signalColor || this.textColor, this.signalTextColor = this.signalTextColor || this.textColor, this.labelBoxBorderColor = this.labelBoxBorderColor || this.actorBorder, this.labelTextColor = this.labelTextColor || this.actorTextColor, this.loopTextColor = this.loopTextColor || this.actorTextColor, this.activationBorderColor = this.activationBorderColor || I(this.secondaryColor, 10), this.activationBkgColor = this.activationBkgColor || this.secondaryColor, this.sequenceNumberColor = this.sequenceNumberColor || F(this.lineColor), this.rectBkgColor = this.rectBkgColor || this.tertiaryColor, this.sectionBkgColor = this.sectionBkgColor || this.tertiaryColor, this.altSectionBkgColor = this.altSectionBkgColor || "white", this.sectionBkgColor = this.sectionBkgColor || this.secondaryColor, this.sectionBkgColor2 = this.sectionBkgColor2 || this.primaryColor, this.excludeBkgColor = this.excludeBkgColor || "#eeeeee", this.taskBorderColor = this.taskBorderColor || this.primaryBorderColor, this.taskBkgColor = this.taskBkgColor || this.primaryColor, this.activeTaskBorderColor = this.activeTaskBorderColor || this.primaryColor, this.activeTaskBkgColor = this.activeTaskBkgColor || O(this.primaryColor, 23), this.gridColor = this.gridColor || "lightgrey", this.doneTaskBkgColor = this.doneTaskBkgColor || "lightgrey", this.doneTaskBorderColor = this.doneTaskBorderColor || "grey", this.critBorderColor = this.critBorderColor || "#ff8888", this.critBkgColor = this.critBkgColor || "red", this.todayLineColor = this.todayLineColor || "red", this.taskTextColor = this.taskTextColor || this.textColor, this.taskTextOutsideColor = this.taskTextOutsideColor || this.textColor, this.taskTextLightColor = this.taskTextLightColor || this.textColor, this.taskTextColor = this.taskTextColor || this.primaryTextColor, this.taskTextDarkColor = this.taskTextDarkColor || this.textColor, this.taskTextClickableColor = this.taskTextClickableColor || "#003163", this.archEdgeColor = this.lineColor, this.archEdgeArrowColor = this.lineColor, this.personBorder = this.personBorder || this.primaryBorderColor, this.personBkg = this.personBkg || this.mainBkg, this.transitionColor = this.transitionColor || this.lineColor, this.transitionLabelColor = this.transitionLabelColor || this.textColor, this.stateLabelColor = this.stateLabelColor || this.stateBkg || this.primaryTextColor, this.vertLineColor = this.vertLineColor || this.primaryBorderColor, this.compositeBackground = "#16141F", this.altBackground = "#16141F", this.compositeTitleBackground = "#16141F", this.stateEdgeLabelBackground = "#16141F", this.fontWeight = 600, this.stateBkg = this.stateBkg || this.mainBkg, this.labelBackgroundColor = this.labelBackgroundColor || this.stateBkg, this.compositeBackground = this.compositeBackground || this.background || this.tertiaryColor, this.altBackground = this.altBackground || "#f0f0f0", this.compositeTitleBackground = this.compositeTitleBackground || this.mainBkg, this.compositeBorder = this.compositeBorder || this.nodeBorder, this.innerEndBackground = this.nodeBorder, this.errorBkgColor = this.errorBkgColor || this.tertiaryColor, this.errorTextColor = this.errorTextColor || this.tertiaryTextColor, this.transitionColor = this.transitionColor || this.lineColor, this.specialStateColor = this.lineColor, this.cScale0 = this.cScale0 || this.primaryColor, this.cScale1 = this.cScale1 || this.secondaryColor, this.cScale2 = this.cScale2 || this.tertiaryColor, this.cScale3 = this.cScale3 || k(this.primaryColor, { h: 30 }), this.cScale4 = this.cScale4 || k(this.primaryColor, { h: 60 }), this.cScale5 = this.cScale5 || k(this.primaryColor, { h: 90 }), this.cScale6 = this.cScale6 || k(this.primaryColor, { h: 120 }), this.cScale7 = this.cScale7 || k(this.primaryColor, { h: 150 }), this.cScale8 = this.cScale8 || k(this.primaryColor, { h: 210, l: 150 }), this.cScale9 = this.cScale9 || k(this.primaryColor, { h: 270 }), this.cScale10 = this.cScale10 || k(this.primaryColor, { h: 300 }), this.cScale11 = this.cScale11 || k(this.primaryColor, { h: 330 }), this.darkMode)
      for (let r = 0; r < this.THEME_COLOR_LIMIT; r++)
        this["cScale" + r] = I(this["cScale" + r], 75);
    else
      for (let r = 0; r < this.THEME_COLOR_LIMIT; r++)
        this["cScale" + r] = I(this["cScale" + r], 25);
    for (let r = 0; r < this.THEME_COLOR_LIMIT; r++)
      this["cScaleInv" + r] = this["cScaleInv" + r] || F(this["cScale" + r]);
    for (let r = 0; r < this.THEME_COLOR_LIMIT; r++)
      this.darkMode ? this["cScalePeer" + r] = this["cScalePeer" + r] || O(this["cScale" + r], 10) : this["cScalePeer" + r] = this["cScalePeer" + r] || I(this["cScale" + r], 10);
    this.scaleLabelColor = this.scaleLabelColor || this.labelTextColor;
    for (let r = 0; r < this.THEME_COLOR_LIMIT; r++)
      this["cScaleLabel" + r] = this["cScaleLabel" + r] || this.scaleLabelColor;
    const t = this.darkMode ? -4 : -1;
    for (let r = 0; r < 5; r++)
      this["surface" + r] = this["surface" + r] || k(this.mainBkg, { h: 180, s: -15, l: t * (5 + r * 3) }), this["surfacePeer" + r] = this["surfacePeer" + r] || k(this.mainBkg, { h: 180, s: -15, l: t * (8 + r * 3) });
    this.classText = this.classText || this.textColor, this.fillType0 = this.fillType0 || this.primaryColor, this.fillType1 = this.fillType1 || this.secondaryColor, this.fillType2 = this.fillType2 || k(this.primaryColor, { h: 64 }), this.fillType3 = this.fillType3 || k(this.secondaryColor, { h: 64 }), this.fillType4 = this.fillType4 || k(this.primaryColor, { h: -64 }), this.fillType5 = this.fillType5 || k(this.secondaryColor, { h: -64 }), this.fillType6 = this.fillType6 || k(this.primaryColor, { h: 128 }), this.fillType7 = this.fillType7 || k(this.secondaryColor, { h: 128 }), this.pie1 = this.pie1 || this.primaryColor, this.pie2 = this.pie2 || this.secondaryColor, this.pie3 = this.pie3 || this.tertiaryColor, this.pie4 = this.pie4 || k(this.primaryColor, { l: -10 }), this.pie5 = this.pie5 || k(this.secondaryColor, { l: -10 }), this.pie6 = this.pie6 || k(this.tertiaryColor, { l: -10 }), this.pie7 = this.pie7 || k(this.primaryColor, { h: 60, l: -10 }), this.pie8 = this.pie8 || k(this.primaryColor, { h: -60, l: -10 }), this.pie9 = this.pie9 || k(this.primaryColor, { h: 120, l: 0 }), this.pie10 = this.pie10 || k(this.primaryColor, { h: 60, l: -20 }), this.pie11 = this.pie11 || k(this.primaryColor, { h: -60, l: -20 }), this.pie12 = this.pie12 || k(this.primaryColor, { h: 120, l: -10 }), this.pieTitleTextSize = this.pieTitleTextSize || "25px", this.pieTitleTextColor = this.pieTitleTextColor || this.taskTextDarkColor, this.pieSectionTextSize = this.pieSectionTextSize || "17px", this.pieSectionTextColor = this.pieSectionTextColor || this.textColor, this.pieLegendTextSize = this.pieLegendTextSize || "17px", this.pieLegendTextColor = this.pieLegendTextColor || this.taskTextDarkColor, this.pieStrokeColor = this.pieStrokeColor || "black", this.pieStrokeWidth = this.pieStrokeWidth || "2px", this.pieOuterStrokeWidth = this.pieOuterStrokeWidth || "2px", this.pieOuterStrokeColor = this.pieOuterStrokeColor || "black", this.pieOpacity = this.pieOpacity || "0.7", this.vennTitleTextColor = this.vennTitleTextColor ?? this.titleColor, this.vennSetTextColor = this.vennSetTextColor ?? this.textColor, this.quadrant1Fill = this.quadrant1Fill || this.primaryColor, this.quadrant2Fill = this.quadrant2Fill || k(this.primaryColor, { r: 5, g: 5, b: 5 }), this.quadrant3Fill = this.quadrant3Fill || k(this.primaryColor, { r: 10, g: 10, b: 10 }), this.quadrant4Fill = this.quadrant4Fill || k(this.primaryColor, { r: 15, g: 15, b: 15 }), this.quadrant1TextFill = this.quadrant1TextFill || this.primaryTextColor, this.quadrant2TextFill = this.quadrant2TextFill || k(this.primaryTextColor, { r: -5, g: -5, b: -5 }), this.quadrant3TextFill = this.quadrant3TextFill || k(this.primaryTextColor, { r: -10, g: -10, b: -10 }), this.quadrant4TextFill = this.quadrant4TextFill || k(this.primaryTextColor, { r: -15, g: -15, b: -15 }), this.quadrantPointFill = this.quadrantPointFill || be(this.quadrant1Fill) ? O(this.quadrant1Fill) : I(this.quadrant1Fill), this.quadrantPointTextFill = this.quadrantPointTextFill || this.primaryTextColor, this.quadrantXAxisTextFill = this.quadrantXAxisTextFill || this.primaryTextColor, this.quadrantYAxisTextFill = this.quadrantYAxisTextFill || this.primaryTextColor, this.quadrantInternalBorderStrokeFill = this.quadrantInternalBorderStrokeFill || this.primaryBorderColor, this.quadrantExternalBorderStrokeFill = this.quadrantExternalBorderStrokeFill || this.primaryBorderColor, this.quadrantTitleFill = this.quadrantTitleFill || this.primaryTextColor, this.xyChart = {
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
    }, this.requirementBackground = this.requirementBackground || this.primaryColor, this.requirementBorderColor = this.requirementBorderColor || this.primaryBorderColor, this.requirementBorderSize = this.requirementBorderSize || "1", this.requirementTextColor = this.requirementTextColor || this.primaryTextColor, this.relationColor = this.relationColor || this.lineColor, this.relationLabelBackground = this.relationLabelBackground || (this.darkMode ? I(this.secondaryColor, 30) : this.secondaryColor), this.relationLabelColor = this.relationLabelColor || this.actorTextColor, this.requirementEdgeLabelBackground = "#16141F", this.git0 = this.git0 || this.primaryColor, this.git1 = this.git1 || this.secondaryColor, this.git2 = this.git2 || this.tertiaryColor, this.git3 = this.git3 || k(this.primaryColor, { h: -30 }), this.git4 = this.git4 || k(this.primaryColor, { h: -60 }), this.git5 = this.git5 || k(this.primaryColor, { h: -90 }), this.git6 = this.git6 || k(this.primaryColor, { h: 60 }), this.git7 = this.git7 || k(this.primaryColor, { h: 120 }), this.darkMode ? (this.git0 = O(this.git0, 25), this.git1 = O(this.git1, 25), this.git2 = O(this.git2, 25), this.git3 = O(this.git3, 25), this.git4 = O(this.git4, 25), this.git5 = O(this.git5, 25), this.git6 = O(this.git6, 25), this.git7 = O(this.git7, 25)) : (this.git0 = I(this.git0, 25), this.git1 = I(this.git1, 25), this.git2 = I(this.git2, 25), this.git3 = I(this.git3, 25), this.git4 = I(this.git4, 25), this.git5 = I(this.git5, 25), this.git6 = I(this.git6, 25), this.git7 = I(this.git7, 25)), this.gitInv0 = this.gitInv0 || F(this.git0), this.gitInv1 = this.gitInv1 || F(this.git1), this.gitInv2 = this.gitInv2 || F(this.git2), this.gitInv3 = this.gitInv3 || F(this.git3), this.gitInv4 = this.gitInv4 || F(this.git4), this.gitInv5 = this.gitInv5 || F(this.git5), this.gitInv6 = this.gitInv6 || F(this.git6), this.gitInv7 = this.gitInv7 || F(this.git7), this.branchLabelColor = this.branchLabelColor || (this.darkMode ? "black" : this.labelTextColor), this.gitBranchLabel0 = this.gitBranchLabel0 || this.branchLabelColor, this.gitBranchLabel1 = this.gitBranchLabel1 || this.branchLabelColor, this.gitBranchLabel2 = this.gitBranchLabel2 || this.branchLabelColor, this.gitBranchLabel3 = this.gitBranchLabel3 || this.branchLabelColor, this.gitBranchLabel4 = this.gitBranchLabel4 || this.branchLabelColor, this.gitBranchLabel5 = this.gitBranchLabel5 || this.branchLabelColor, this.gitBranchLabel6 = this.gitBranchLabel6 || this.branchLabelColor, this.gitBranchLabel7 = this.gitBranchLabel7 || this.branchLabelColor, this.tagLabelColor = this.tagLabelColor || this.primaryTextColor, this.tagLabelBackground = this.tagLabelBackground || this.primaryColor, this.tagLabelBorder = this.tagBorder || this.primaryBorderColor, this.tagLabelFontSize = this.tagLabelFontSize || "10px", this.commitLabelColor = this.commitLabelColor || this.secondaryTextColor, this.commitLabelBackground = this.commitLabelBackground || this.secondaryColor, this.commitLabelFontSize = this.commitLabelFontSize || "10px", this.commitLineColor = this.commitLineColor ?? "#BDBCCC", this.erEdgeLabelBackground = "#16141F", this.attributeBackgroundColorOdd = this.attributeBackgroundColorOdd || Me, this.attributeBackgroundColorEven = this.attributeBackgroundColorEven || $e;
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
}, p(ti, "Theme"), ti), F0 = /* @__PURE__ */ p((e) => {
  const t = new L0();
  return t.calculate(e), t;
}, "getThemeVariables"), ei, A0 = (ei = class {
  constructor() {
    this.background = "#ffffff", this.primaryColor = "#cccccc", this.mainBkg = "#ffffff", this.noteBkgColor = "#fff5ad", this.noteTextColor = "#28253D", this.THEME_COLOR_LIMIT = 12, this.radius = 12, this.strokeWidth = 2, this.primaryBorderColor = gt(this.primaryColor, this.darkMode), this.fontFamily = '"Recursive Variable", arial, sans-serif', this.fontSize = "14px", this.nodeBorder = "#28253D", this.stateBorder = "#28253D", this.useGradient = !1, this.gradientStart = "#0042eb", this.gradientStop = "#eb0042", this.dropShadow = "url(#drop-shadow)", this.nodeShadow = !0, this.tertiaryColor = "#ffffff", this.archEdgeColor = "calculated", this.archEdgeArrowColor = "calculated", this.archEdgeWidth = "3", this.archGroupBorderColor = this.primaryBorderColor, this.archGroupBorderWidth = "2px", this.actorBorder = "#28253D", this.noteBorderColor = "#FACC15", this.noteFontWeight = 600, this.borderColorArray = [
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
    this.primaryTextColor = this.primaryTextColor || (this.darkMode ? "#eee" : "#28253D"), this.secondaryColor = this.secondaryColor || k(this.primaryColor, { h: -120 }), this.tertiaryColor = this.tertiaryColor || k(this.primaryColor, { h: 180, l: 5 }), this.primaryBorderColor = this.primaryBorderColor || gt(this.primaryColor, this.darkMode), this.secondaryBorderColor = this.secondaryBorderColor || gt(this.secondaryColor, this.darkMode), this.tertiaryBorderColor = this.tertiaryBorderColor || gt(this.tertiaryColor, this.darkMode), this.noteBorderColor = this.noteBorderColor || gt(this.noteBkgColor, this.darkMode), this.noteBkgColor = this.noteBkgColor || "#fff5ad", this.noteTextColor = this.noteTextColor || "#28253D", this.secondaryTextColor = this.secondaryTextColor || F(this.secondaryColor), this.tertiaryTextColor = this.tertiaryTextColor || F(this.tertiaryColor), this.lineColor = this.lineColor || F(this.background), this.arrowheadColor = this.arrowheadColor || F(this.background), this.textColor = this.textColor || this.primaryTextColor, this.border2 = this.border2 || this.tertiaryBorderColor, this.nodeBkg = this.nodeBkg || this.primaryColor, this.mainBkg = this.mainBkg || this.primaryColor, this.nodeBorder = this.nodeBorder || this.primaryBorderColor, this.clusterBkg = this.clusterBkg || this.tertiaryColor, this.clusterBorder = this.clusterBorder || this.tertiaryBorderColor, this.defaultLinkColor = this.defaultLinkColor || this.lineColor, this.titleColor = this.titleColor || this.tertiaryTextColor, this.edgeLabelBackground = this.edgeLabelBackground || (this.darkMode ? I(this.secondaryColor, 30) : this.secondaryColor), this.nodeTextColor = this.nodeTextColor || this.primaryTextColor, this.actorBorder = this.actorBorder || this.primaryBorderColor, this.actorBkg = this.actorBkg || this.mainBkg, this.actorTextColor = this.actorTextColor || this.primaryTextColor, this.actorLineColor = this.actorLineColor || this.actorBorder, this.labelBoxBkgColor = this.labelBoxBkgColor || this.actorBkg, this.signalColor = this.signalColor || this.textColor, this.signalTextColor = this.signalTextColor || this.textColor, this.labelBoxBorderColor = this.labelBoxBorderColor || this.actorBorder, this.labelTextColor = this.labelTextColor || this.actorTextColor, this.loopTextColor = this.loopTextColor || this.actorTextColor, this.activationBorderColor = this.activationBorderColor || I(this.secondaryColor, 10), this.activationBkgColor = this.activationBkgColor || this.secondaryColor, this.sequenceNumberColor = this.sequenceNumberColor || F(this.lineColor), this.rectBkgColor = this.rectBkgColor || this.tertiaryColor;
    const t = "#ECECFE", r = "#E9E9F1", i = k(t, { h: 180, l: 5 });
    this.sectionBkgColor = this.sectionBkgColor || i, this.altSectionBkgColor = this.altSectionBkgColor || "white", this.sectionBkgColor = this.sectionBkgColor || r, this.sectionBkgColor2 = this.sectionBkgColor2 || t, this.excludeBkgColor = this.excludeBkgColor || "#eeeeee", this.taskBorderColor = this.taskBorderColor || this.primaryBorderColor, this.taskBkgColor = this.taskBkgColor || t, this.activeTaskBorderColor = this.activeTaskBorderColor || t, this.activeTaskBkgColor = this.activeTaskBkgColor || O(t, 23), this.gridColor = this.gridColor || "lightgrey", this.doneTaskBkgColor = this.doneTaskBkgColor || "lightgrey", this.doneTaskBorderColor = this.doneTaskBorderColor || "grey", this.critBorderColor = this.critBorderColor || "#ff8888", this.critBkgColor = this.critBkgColor || "red", this.todayLineColor = this.todayLineColor || "red", this.taskTextColor = this.taskTextColor || this.textColor, this.vertLineColor = this.vertLineColor || this.primaryBorderColor, this.taskTextOutsideColor = this.taskTextOutsideColor || this.textColor, this.taskTextLightColor = this.taskTextLightColor || this.textColor, this.taskTextColor = this.taskTextColor || this.primaryTextColor, this.taskTextDarkColor = this.taskTextDarkColor || this.textColor, this.taskTextClickableColor = this.taskTextClickableColor || "#003163", this.archEdgeColor = this.lineColor, this.archEdgeArrowColor = this.lineColor, this.personBorder = this.personBorder || this.primaryBorderColor, this.personBkg = this.personBkg || this.mainBkg, this.transitionColor = this.transitionColor || this.lineColor, this.transitionLabelColor = this.transitionLabelColor || this.textColor, this.stateLabelColor = this.stateLabelColor || this.stateBkg || this.primaryTextColor, this.stateBkg = this.stateBkg || this.mainBkg, this.labelBackgroundColor = this.labelBackgroundColor || this.stateBkg, this.compositeBackground = this.compositeBackground || this.background || this.tertiaryColor, this.altBackground = this.altBackground || "#f0f0f0", this.compositeTitleBackground = this.compositeTitleBackground || this.mainBkg, this.compositeBorder = this.compositeBorder || this.nodeBorder, this.innerEndBackground = this.nodeBorder, this.errorBkgColor = this.errorBkgColor || this.tertiaryColor, this.errorTextColor = this.errorTextColor || this.tertiaryTextColor, this.transitionColor = this.transitionColor || this.lineColor, this.specialStateColor = this.lineColor, this.cScale0 = this.cScale0 || "#f4a8ff", this.cScale1 = this.cScale1 || "#46ecd5", this.cScale2 = this.cScale2 || "#ffb86a", this.cScale3 = this.cScale3 || "#dab2ff", this.cScale4 = this.cScale4 || "#7bf1a8", this.cScale5 = this.cScale5 || "#c4b4ff", this.cScale6 = this.cScale6 || "#ffa2a2", this.cScale7 = this.cScale7 || "#ffdf20", this.cScale8 = this.cScale8 || "#a3b3ff", this.cScale9 = this.cScale9 || "#bbf451", this.cScale10 = this.cScale10 || "#74d4ff", this.cScale11 = this.cScale11 || "#ffa1ad";
    for (let o = 0; o < this.THEME_COLOR_LIMIT; o++)
      this["cScaleInv" + o] = this["cScaleInv" + o] || F(this["cScale" + o]);
    for (let o = 0; o < this.THEME_COLOR_LIMIT; o++)
      this.darkMode ? this["cScalePeer" + o] = this["cScalePeer" + o] || O(this["cScale" + o], 10) : this["cScalePeer" + o] = this["cScalePeer" + o] || I(this["cScale" + o], 10);
    this.scaleLabelColor = this.scaleLabelColor || this.labelTextColor;
    for (let o = 0; o < this.THEME_COLOR_LIMIT; o++)
      this["cScaleLabel" + o] = this["cScaleLabel" + o] || this.scaleLabelColor;
    const s = this.darkMode ? -4 : -1;
    for (let o = 0; o < 5; o++)
      this["surface" + o] = this["surface" + o] || k(this.mainBkg, { h: 180, s: -15, l: s * (5 + o * 3) }), this["surfacePeer" + o] = this["surfacePeer" + o] || k(this.mainBkg, { h: 180, s: -15, l: s * (8 + o * 3) });
    this.classText = this.classText || this.textColor, this.fillType0 = this.fillType0 || t, this.fillType1 = this.fillType1 || r, this.fillType2 = this.fillType2 || k(t, { h: 64 }), this.fillType3 = this.fillType3 || k(r, { h: 64 }), this.fillType4 = this.fillType4 || k(t, { h: -64 }), this.fillType5 = this.fillType5 || k(r, { h: -64 }), this.fillType6 = this.fillType6 || k(t, { h: 128 }), this.fillType7 = this.fillType7 || k(r, { h: 128 }), this.pie1 = this.pie1 || t, this.pie2 = this.pie2 || r, this.pie3 = this.pie3 || i, this.pie4 = this.pie4 || k(t, { l: -10 }), this.pie5 = this.pie5 || k(r, { l: -10 }), this.pie6 = this.pie6 || k(i, { l: -10 }), this.pie7 = this.pie7 || k(t, { h: 60, l: -10 }), this.pie8 = this.pie8 || k(t, { h: -60, l: -10 }), this.pie9 = this.pie9 || k(t, { h: 120, l: 0 }), this.pie10 = this.pie10 || k(t, { h: 60, l: -20 }), this.pie11 = this.pie11 || k(t, { h: -60, l: -20 }), this.pie12 = this.pie12 || k(t, { h: 120, l: -10 }), this.pieTitleTextSize = this.pieTitleTextSize || "25px", this.pieTitleTextColor = this.pieTitleTextColor || this.taskTextDarkColor, this.pieSectionTextSize = this.pieSectionTextSize || "17px", this.pieSectionTextColor = this.pieSectionTextColor || this.textColor, this.pieLegendTextSize = this.pieLegendTextSize || "17px", this.pieLegendTextColor = this.pieLegendTextColor || this.taskTextDarkColor, this.pieStrokeColor = this.pieStrokeColor || "black", this.pieStrokeWidth = this.pieStrokeWidth || "2px", this.pieOuterStrokeWidth = this.pieOuterStrokeWidth || "2px", this.pieOuterStrokeColor = this.pieOuterStrokeColor || "black", this.pieOpacity = this.pieOpacity || "0.7", this.vennTitleTextColor = this.vennTitleTextColor ?? this.titleColor, this.vennSetTextColor = this.vennSetTextColor ?? this.textColor, this.quadrant1Fill = this.quadrant1Fill || t, this.quadrant2Fill = this.quadrant2Fill || k(t, { r: 5, g: 5, b: 5 }), this.quadrant3Fill = this.quadrant3Fill || k(t, { r: 10, g: 10, b: 10 }), this.quadrant4Fill = this.quadrant4Fill || k(t, { r: 15, g: 15, b: 15 }), this.quadrant1TextFill = this.quadrant1TextFill || this.primaryTextColor, this.quadrant2TextFill = this.quadrant2TextFill || k(this.primaryTextColor, { r: -5, g: -5, b: -5 }), this.quadrant3TextFill = this.quadrant3TextFill || k(this.primaryTextColor, { r: -10, g: -10, b: -10 }), this.quadrant4TextFill = this.quadrant4TextFill || k(this.primaryTextColor, { r: -15, g: -15, b: -15 }), this.quadrantPointFill = this.quadrantPointFill || be(this.quadrant1Fill) ? O(this.quadrant1Fill) : I(this.quadrant1Fill), this.quadrantPointTextFill = this.quadrantPointTextFill || this.primaryTextColor, this.quadrantXAxisTextFill = this.quadrantXAxisTextFill || this.primaryTextColor, this.quadrantYAxisTextFill = this.quadrantYAxisTextFill || this.primaryTextColor, this.quadrantInternalBorderStrokeFill = this.quadrantInternalBorderStrokeFill || this.primaryBorderColor, this.quadrantExternalBorderStrokeFill = this.quadrantExternalBorderStrokeFill || this.primaryBorderColor, this.quadrantTitleFill = this.quadrantTitleFill || this.primaryTextColor, this.xyChart = {
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
    }, this.requirementBackground = this.requirementBackground || t, this.requirementBorderColor = this.requirementBorderColor || this.primaryBorderColor, this.requirementBorderSize = this.requirementBorderSize || "1", this.requirementTextColor = this.requirementTextColor || this.primaryTextColor, this.relationColor = this.relationColor || this.lineColor, this.relationLabelBackground = this.relationLabelBackground || (this.darkMode ? I(this.secondaryColor, 30) : this.secondaryColor), this.relationLabelColor = this.relationLabelColor || this.actorTextColor, this.git0 = this.git0 || t, this.git1 = this.git1 || r, this.git2 = this.git2 || i, this.git3 = this.git3 || k(t, { h: -30 }), this.git4 = this.git4 || k(t, { h: -60 }), this.git5 = this.git5 || k(t, { h: -90 }), this.git6 = this.git6 || k(t, { h: 60 }), this.git7 = this.git7 || k(t, { h: 120 }), this.darkMode ? (this.git0 = O(this.git0, 25), this.git1 = O(this.git1, 25), this.git2 = O(this.git2, 25), this.git3 = O(this.git3, 25), this.git4 = O(this.git4, 25), this.git5 = O(this.git5, 25), this.git6 = O(this.git6, 25), this.git7 = O(this.git7, 25)) : (this.git0 = I(this.git0, 25), this.git1 = I(this.git1, 25), this.git2 = I(this.git2, 25), this.git3 = I(this.git3, 25), this.git4 = I(this.git4, 25), this.git5 = I(this.git5, 25), this.git6 = I(this.git6, 25), this.git7 = I(this.git7, 25)), this.gitInv0 = this.gitInv0 || F(this.git0), this.gitInv1 = this.gitInv1 || F(this.git1), this.gitInv2 = this.gitInv2 || F(this.git2), this.gitInv3 = this.gitInv3 || F(this.git3), this.gitInv4 = this.gitInv4 || F(this.git4), this.gitInv5 = this.gitInv5 || F(this.git5), this.gitInv6 = this.gitInv6 || F(this.git6), this.gitInv7 = this.gitInv7 || F(this.git7), this.branchLabelColor = this.branchLabelColor || (this.darkMode ? "black" : this.labelTextColor), this.gitBranchLabel0 = this.gitBranchLabel0 || this.branchLabelColor, this.gitBranchLabel1 = this.gitBranchLabel1 || this.branchLabelColor, this.gitBranchLabel2 = this.gitBranchLabel2 || this.branchLabelColor, this.gitBranchLabel3 = this.gitBranchLabel3 || this.branchLabelColor, this.gitBranchLabel4 = this.gitBranchLabel4 || this.branchLabelColor, this.gitBranchLabel5 = this.gitBranchLabel5 || this.branchLabelColor, this.gitBranchLabel6 = this.gitBranchLabel6 || this.branchLabelColor, this.gitBranchLabel7 = this.gitBranchLabel7 || this.branchLabelColor, this.tagLabelColor = this.tagLabelColor || this.primaryTextColor, this.tagLabelBackground = this.tagLabelBackground || this.primaryColor, this.tagLabelBorder = this.tagBorder || this.primaryBorderColor, this.tagLabelFontSize = this.tagLabelFontSize || "10px", this.commitLabelColor = this.commitLabelColor || this.secondaryTextColor, this.commitLabelBackground = this.commitLabelBackground || this.secondaryColor, this.commitLineColor = this.commitLineColor ?? "#BDBCCC", this.commitLabelFontSize = this.commitLabelFontSize || "10px", this.fontWeight = 600, this.erEdgeLabelBackground = "#FFFFFF", this.attributeBackgroundColorOdd = this.attributeBackgroundColorOdd || Me, this.attributeBackgroundColorEven = this.attributeBackgroundColorEven || $e;
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
}, p(ei, "Theme"), ei), E0 = /* @__PURE__ */ p((e) => {
  const t = new A0();
  return t.calculate(e), t;
}, "getThemeVariables"), ri, M0 = (ri = class {
  constructor() {
    this.background = "#333", this.primaryColor = "#1f2020", this.secondaryColor = O(this.primaryColor, 16), this.tertiaryColor = k(this.primaryColor, { h: -160 }), this.primaryBorderColor = F(this.background), this.secondaryBorderColor = gt(this.secondaryColor, this.darkMode), this.tertiaryBorderColor = gt(this.tertiaryColor, this.darkMode), this.primaryTextColor = F(this.primaryColor), this.secondaryTextColor = F(this.secondaryColor), this.tertiaryTextColor = F(this.tertiaryColor), this.mainBkg = "#111113", this.secondBkg = "calculated", this.mainContrastColor = "lightgrey", this.darkTextColor = O(F("#323D47"), 10), this.border1 = "#ccc", this.border2 = Je(255, 255, 255, 0.25), this.arrowheadColor = F(this.background), this.fontFamily = '"Recursive Variable", arial, sans-serif', this.fontSize = "14px", this.labelBackground = "#111113", this.textColor = "#ccc", this.THEME_COLOR_LIMIT = 12, this.radius = 12, this.strokeWidth = 2, this.noteBkgColor = this.noteBkgColor ?? "#FEF9C3", this.noteTextColor = this.noteTextColor ?? "#28253D", this.THEME_COLOR_LIMIT = 12, this.fontFamily = '"Recursive Variable", arial, sans-serif', this.fontSize = "14px", this.nodeBorder = "#FFFFFF", this.stateBorder = "#FFFFFF", this.useGradient = !1, this.gradientStart = "#0042eb", this.gradientStop = "#eb0042", this.dropShadow = "url(#drop-shadow)", this.nodeShadow = !0, this.archEdgeColor = "calculated", this.archEdgeArrowColor = "calculated", this.archEdgeWidth = "3", this.archGroupBorderColor = this.primaryBorderColor, this.archGroupBorderWidth = "2px", this.clusterBkg = "#1E1A2E", this.clusterBorder = "#BDBCCC", this.noteBorderColor = "#FACC15", this.noteFontWeight = 600, this.borderColorArray = [
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
    this.primaryTextColor = this.primaryTextColor || (this.darkMode ? "#eee" : "#FFFFFF"), this.secondaryColor = this.secondaryColor || k(this.primaryColor, { h: -120 }), this.tertiaryColor = this.tertiaryColor || k(this.primaryColor, { h: 180, l: 5 }), this.primaryBorderColor = this.primaryBorderColor || gt(this.primaryColor, this.darkMode), this.secondaryBorderColor = this.secondaryBorderColor || gt(this.secondaryColor, this.darkMode), this.tertiaryBorderColor = this.tertiaryBorderColor || gt(this.tertiaryColor, this.darkMode), this.noteBorderColor = this.noteBorderColor || gt(this.noteBkgColor, this.darkMode), this.noteBkgColor = this.noteBkgColor || "#fff5ad", this.noteTextColor = this.noteTextColor || "#FFFFFF", this.secondaryTextColor = this.secondaryTextColor || F(this.secondaryColor), this.tertiaryTextColor = this.tertiaryTextColor || F(this.tertiaryColor), this.lineColor = this.lineColor || F(this.background), this.arrowheadColor = this.arrowheadColor || F(this.background), this.textColor = this.textColor || this.primaryTextColor, this.border2 = this.border2 || this.tertiaryBorderColor, this.nodeBkg = this.nodeBkg || this.primaryColor, this.mainBkg = this.mainBkg || this.primaryColor, this.nodeBorder = this.nodeBorder || this.border1, this.clusterBkg = this.clusterBkg || this.tertiaryColor, this.clusterBorder = this.clusterBorder || this.tertiaryBorderColor, this.defaultLinkColor = this.defaultLinkColor || this.lineColor, this.titleColor = this.titleColor || this.tertiaryTextColor, this.edgeLabelBackground = this.edgeLabelBackground || (this.darkMode ? I(this.secondaryColor, 30) : this.secondaryColor), this.nodeTextColor = this.nodeTextColor || this.primaryTextColor, this.actorBorder = "#FFFFFF", this.signalColor = "#FFFFFF", this.labelBoxBorderColor = "#BDBCCC", this.actorBorder = this.actorBorder || this.primaryBorderColor, this.actorBkg = this.actorBkg || this.mainBkg, this.actorTextColor = this.actorTextColor || this.primaryTextColor, this.actorLineColor = this.actorLineColor || this.actorBorder, this.labelBoxBkgColor = this.labelBoxBkgColor || this.actorBkg, this.signalColor = this.signalColor || this.textColor, this.signalTextColor = this.signalTextColor || this.textColor, this.labelBoxBorderColor = this.labelBoxBorderColor || this.actorBorder, this.labelTextColor = this.labelTextColor || this.actorTextColor, this.loopTextColor = this.loopTextColor || this.actorTextColor, this.activationBorderColor = this.activationBorderColor || I(this.secondaryColor, 10), this.activationBkgColor = this.activationBkgColor || this.secondaryColor, this.sequenceNumberColor = this.sequenceNumberColor || F(this.lineColor), this.rectBkgColor = this.rectBkgColor || this.tertiaryColor, this.rootLabelColor = "#FFFFFF", this.sectionBkgColor = this.sectionBkgColor || this.tertiaryColor, this.altSectionBkgColor = this.altSectionBkgColor || "white", this.sectionBkgColor = this.sectionBkgColor || this.secondaryColor, this.sectionBkgColor2 = this.sectionBkgColor2 || this.primaryColor, this.excludeBkgColor = this.excludeBkgColor || "#eeeeee", this.taskBorderColor = this.taskBorderColor || this.primaryBorderColor, this.taskBkgColor = this.taskBkgColor || this.primaryColor, this.activeTaskBorderColor = this.activeTaskBorderColor || this.primaryColor, this.activeTaskBkgColor = this.activeTaskBkgColor || O(this.primaryColor, 23), this.gridColor = this.gridColor || "lightgrey", this.doneTaskBkgColor = this.doneTaskBkgColor || "lightgrey", this.doneTaskBorderColor = this.doneTaskBorderColor || "grey", this.critBorderColor = this.critBorderColor || "#ff8888", this.critBkgColor = this.critBkgColor || "red", this.todayLineColor = this.todayLineColor || "red", this.taskTextColor = this.taskTextColor || this.textColor, this.vertLineColor = this.vertLineColor || this.primaryBorderColor, this.taskTextOutsideColor = this.taskTextOutsideColor || this.textColor, this.taskTextLightColor = this.taskTextLightColor || this.textColor, this.taskTextColor = this.taskTextColor || this.primaryTextColor, this.taskTextDarkColor = this.taskTextDarkColor || this.textColor, this.taskTextClickableColor = this.taskTextClickableColor || "#003163", this.archEdgeColor = this.lineColor, this.archEdgeArrowColor = this.lineColor, this.personBorder = this.personBorder || this.primaryBorderColor, this.personBkg = this.personBkg || this.mainBkg, this.transitionColor = this.transitionColor || this.lineColor, this.transitionLabelColor = this.transitionLabelColor || this.textColor, this.stateLabelColor = this.stateLabelColor || this.stateBkg || this.primaryTextColor, this.stateBkg = this.stateBkg || this.mainBkg, this.labelBackgroundColor = this.labelBackgroundColor || this.stateBkg, this.compositeBackground = this.compositeBackground || this.background || this.tertiaryColor, this.altBackground = this.altBackground || "#f0f0f0", this.compositeTitleBackground = this.compositeTitleBackground || this.mainBkg, this.compositeBorder = this.compositeBorder || this.nodeBorder, this.innerEndBackground = this.nodeBorder, this.errorBkgColor = this.errorBkgColor || this.tertiaryColor, this.errorTextColor = this.errorTextColor || this.tertiaryTextColor, this.transitionColor = this.transitionColor || this.lineColor, this.specialStateColor = this.lineColor, this.cScale0 = this.cScale0 || "#f4a8ff", this.cScale1 = this.cScale1 || "#46ecd5", this.cScale2 = this.cScale2 || "#ffb86a", this.cScale3 = this.cScale3 || "#dab2ff", this.cScale4 = this.cScale4 || "#7bf1a8", this.cScale5 = this.cScale5 || "#c4b4ff", this.cScale6 = this.cScale6 || "#ffa2a2", this.cScale7 = this.cScale7 || "#ffdf20", this.cScale8 = this.cScale8 || "#a3b3ff", this.cScale9 = this.cScale9 || "#bbf451", this.cScale10 = this.cScale10 || "#74d4ff", this.cScale11 = this.cScale11 || "#ffa1ad";
    for (let r = 0; r < this.THEME_COLOR_LIMIT; r++)
      this["cScaleInv" + r] = this["cScaleInv" + r] || F(this["cScale" + r]);
    for (let r = 0; r < this.THEME_COLOR_LIMIT; r++)
      this.darkMode ? this["cScalePeer" + r] = this["cScalePeer" + r] || O(this["cScale" + r], 10) : this["cScalePeer" + r] = this["cScalePeer" + r] || I(this["cScale" + r], 10);
    this.scaleLabelColor = this.scaleLabelColor || this.labelTextColor;
    for (let r = 0; r < this.THEME_COLOR_LIMIT; r++)
      this["cScaleLabel" + r] = I(this["cScale" + r], 75);
    const t = this.darkMode ? -4 : -1;
    for (let r = 0; r < 5; r++)
      this["surface" + r] = this["surface" + r] || k(this.mainBkg, { h: 180, s: -15, l: t * (5 + r * 3) }), this["surfacePeer" + r] = this["surfacePeer" + r] || k(this.mainBkg, { h: 180, s: -15, l: t * (8 + r * 3) });
    this.classText = this.classText || this.textColor, this.fillType0 = this.fillType0 || this.primaryColor, this.fillType1 = this.fillType1 || this.secondaryColor, this.fillType2 = this.fillType2 || k(this.primaryColor, { h: 64 }), this.fillType3 = this.fillType3 || k(this.secondaryColor, { h: 64 }), this.fillType4 = this.fillType4 || k(this.primaryColor, { h: -64 }), this.fillType5 = this.fillType5 || k(this.secondaryColor, { h: -64 }), this.fillType6 = this.fillType6 || k(this.primaryColor, { h: 128 }), this.fillType7 = this.fillType7 || k(this.secondaryColor, { h: 128 }), this.pie1 = this.pie1 || this.primaryColor, this.pie2 = this.pie2 || this.secondaryColor, this.pie3 = this.pie3 || this.tertiaryColor, this.pie4 = this.pie4 || k(this.primaryColor, { l: -10 }), this.pie5 = this.pie5 || k(this.secondaryColor, { l: -10 }), this.pie6 = this.pie6 || k(this.tertiaryColor, { l: -10 }), this.pie7 = this.pie7 || k(this.primaryColor, { h: 60, l: -10 }), this.pie8 = this.pie8 || k(this.primaryColor, { h: -60, l: -10 }), this.pie9 = this.pie9 || k(this.primaryColor, { h: 120, l: 0 }), this.pie10 = this.pie10 || k(this.primaryColor, { h: 60, l: -20 }), this.pie11 = this.pie11 || k(this.primaryColor, { h: -60, l: -20 }), this.pie12 = this.pie12 || k(this.primaryColor, { h: 120, l: -10 }), this.pieTitleTextSize = this.pieTitleTextSize || "25px", this.pieTitleTextColor = this.pieTitleTextColor || this.taskTextDarkColor, this.pieSectionTextSize = this.pieSectionTextSize || "17px", this.pieSectionTextColor = this.pieSectionTextColor || this.textColor, this.pieLegendTextSize = this.pieLegendTextSize || "17px", this.pieLegendTextColor = this.pieLegendTextColor || this.taskTextDarkColor, this.pieStrokeColor = this.pieStrokeColor || "black", this.pieStrokeWidth = this.pieStrokeWidth || "2px", this.pieOuterStrokeWidth = this.pieOuterStrokeWidth || "2px", this.pieOuterStrokeColor = this.pieOuterStrokeColor || "black", this.pieOpacity = this.pieOpacity || "0.7", this.vennTitleTextColor = this.vennTitleTextColor ?? this.titleColor, this.vennSetTextColor = this.vennSetTextColor ?? this.textColor, this.quadrant1Fill = this.quadrant1Fill || this.primaryColor, this.quadrant2Fill = this.quadrant2Fill || k(this.primaryColor, { r: 5, g: 5, b: 5 }), this.quadrant3Fill = this.quadrant3Fill || k(this.primaryColor, { r: 10, g: 10, b: 10 }), this.quadrant4Fill = this.quadrant4Fill || k(this.primaryColor, { r: 15, g: 15, b: 15 }), this.quadrant1TextFill = this.quadrant1TextFill || this.primaryTextColor, this.quadrant2TextFill = this.quadrant2TextFill || k(this.primaryTextColor, { r: -5, g: -5, b: -5 }), this.quadrant3TextFill = this.quadrant3TextFill || k(this.primaryTextColor, { r: -10, g: -10, b: -10 }), this.quadrant4TextFill = this.quadrant4TextFill || k(this.primaryTextColor, { r: -15, g: -15, b: -15 }), this.quadrantPointFill = this.quadrantPointFill || be(this.quadrant1Fill) ? O(this.quadrant1Fill) : I(this.quadrant1Fill), this.quadrantPointTextFill = this.quadrantPointTextFill || this.primaryTextColor, this.quadrantXAxisTextFill = this.quadrantXAxisTextFill || this.primaryTextColor, this.quadrantYAxisTextFill = this.quadrantYAxisTextFill || this.primaryTextColor, this.quadrantInternalBorderStrokeFill = this.quadrantInternalBorderStrokeFill || this.primaryBorderColor, this.quadrantExternalBorderStrokeFill = this.quadrantExternalBorderStrokeFill || this.primaryBorderColor, this.quadrantTitleFill = this.quadrantTitleFill || this.primaryTextColor, this.xyChart = {
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
    }, this.requirementBackground = this.requirementBackground || this.primaryColor, this.requirementBorderColor = this.requirementBorderColor || this.primaryBorderColor, this.requirementBorderSize = this.requirementBorderSize || "1", this.requirementTextColor = this.requirementTextColor || this.primaryTextColor, this.relationColor = this.relationColor || this.lineColor, this.relationLabelBackground = this.relationLabelBackground || (this.darkMode ? I(this.secondaryColor, 30) : this.secondaryColor), this.relationLabelColor = this.relationLabelColor || this.actorTextColor, this.git0 = this.git0 || this.primaryColor, this.git1 = this.git1 || this.secondaryColor, this.git2 = this.git2 || this.tertiaryColor, this.git3 = this.git3 || k(this.primaryColor, { h: -30 }), this.git4 = this.git4 || k(this.primaryColor, { h: -60 }), this.git5 = this.git5 || k(this.primaryColor, { h: -90 }), this.git6 = this.git6 || k(this.primaryColor, { h: 60 }), this.git7 = this.git7 || k(this.primaryColor, { h: 120 }), this.darkMode ? (this.git0 = O(this.git0, 25), this.git1 = O(this.git1, 25), this.git2 = O(this.git2, 25), this.git3 = O(this.git3, 25), this.git4 = O(this.git4, 25), this.git5 = O(this.git5, 25), this.git6 = O(this.git6, 25), this.git7 = O(this.git7, 25)) : (this.git0 = I(this.git0, 25), this.git1 = I(this.git1, 25), this.git2 = I(this.git2, 25), this.git3 = I(this.git3, 25), this.git4 = I(this.git4, 25), this.git5 = I(this.git5, 25), this.git6 = I(this.git6, 25), this.git7 = I(this.git7, 25)), this.gitInv0 = this.gitInv0 || F(this.git0), this.gitInv1 = this.gitInv1 || F(this.git1), this.gitInv2 = this.gitInv2 || F(this.git2), this.gitInv3 = this.gitInv3 || F(this.git3), this.gitInv4 = this.gitInv4 || F(this.git4), this.gitInv5 = this.gitInv5 || F(this.git5), this.gitInv6 = this.gitInv6 || F(this.git6), this.gitInv7 = this.gitInv7 || F(this.git7), this.branchLabelColor = this.branchLabelColor || (this.darkMode ? "black" : this.labelTextColor), this.gitBranchLabel0 = this.gitBranchLabel0 || this.branchLabelColor, this.gitBranchLabel1 = this.gitBranchLabel1 || this.branchLabelColor, this.gitBranchLabel2 = this.gitBranchLabel2 || this.branchLabelColor, this.gitBranchLabel3 = this.gitBranchLabel3 || this.branchLabelColor, this.gitBranchLabel4 = this.gitBranchLabel4 || this.branchLabelColor, this.gitBranchLabel5 = this.gitBranchLabel5 || this.branchLabelColor, this.gitBranchLabel6 = this.gitBranchLabel6 || this.branchLabelColor, this.gitBranchLabel7 = this.gitBranchLabel7 || this.branchLabelColor, this.tagLabelColor = this.tagLabelColor || this.primaryTextColor, this.tagLabelBackground = this.tagLabelBackground || this.primaryColor, this.tagLabelBorder = this.tagBorder || this.primaryBorderColor, this.tagLabelFontSize = this.tagLabelFontSize || "10px", this.commitLabelColor = this.commitLabelColor || this.secondaryTextColor, this.commitLabelBackground = this.commitLabelBackground || this.secondaryColor, this.commitLabelFontSize = this.commitLabelFontSize || "10px", this.commitLineColor = this.commitLineColor ?? "#BDBCCC", this.fontWeight = 600, this.erEdgeLabelBackground = "#16141F", this.attributeBackgroundColorOdd = this.attributeBackgroundColorOdd || Me, this.attributeBackgroundColorEven = this.attributeBackgroundColorEven || $e;
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
}, p(ri, "Theme"), ri), $0 = /* @__PURE__ */ p((e) => {
  const t = new M0();
  return t.calculate(e), t;
}, "getThemeVariables"), ze = {
  base: {
    getThemeVariables: f0
  },
  dark: {
    getThemeVariables: g0
  },
  default: {
    getThemeVariables: m0
  },
  forest: {
    getThemeVariables: C0
  },
  neutral: {
    getThemeVariables: k0
  },
  neo: {
    getThemeVariables: S0
  },
  "neo-dark": {
    getThemeVariables: B0
  },
  redux: {
    getThemeVariables: v0
  },
  "redux-dark": {
    getThemeVariables: F0
  },
  "redux-color": {
    getThemeVariables: E0
  },
  "redux-dark-color": {
    getThemeVariables: $0
  }
}, Yt = {
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
}, Id = {
  ...Yt,
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
  themeVariables: ze.default.getThemeVariables(),
  sequence: {
    ...Yt.sequence,
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
    ...Yt.gantt,
    tickInterval: void 0,
    useWidth: void 0
    // can probably be removed since `configKeys` already includes this
  },
  c4: {
    ...Yt.c4,
    useWidth: void 0,
    personFont: /* @__PURE__ */ p(function() {
      return {
        fontFamily: this.personFontFamily,
        fontSize: this.personFontSize,
        fontWeight: this.personFontWeight
      };
    }, "personFont"),
    flowchart: {
      ...Yt.flowchart,
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
    ...Yt.pie,
    useWidth: 984
  },
  xyChart: {
    ...Yt.xyChart,
    useWidth: void 0
  },
  requirement: {
    ...Yt.requirement,
    useWidth: void 0
  },
  packet: {
    ...Yt.packet
  },
  eventmodeling: {
    ...Yt.eventmodeling
  },
  treeView: {
    ...Yt.treeView,
    useWidth: void 0
  },
  radar: {
    ...Yt.radar
  },
  railroad: {
    ...Yt.railroad,
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
    ...Yt.ishikawa
  },
  sankey: {
    ...Yt.sankey,
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
    ...Yt.venn
  },
  cynefin: {
    ...Yt.cynefin
  }
}, Dd = /* @__PURE__ */ p((e, t = "") => Object.keys(e).reduce((r, i) => Array.isArray(e[i]) ? r : typeof e[i] == "object" && e[i] !== null ? [...r, t + i, ...Dd(e[i], "")] : [...r, t + i], []), "keyify"), O0 = new Set(Dd(Id, "")), Pd = Id, I0 = {
  // CSS colors (sankey)
  nodeColors: /^#[\da-f]{3,8}$|^rgb\([\d\s%,.]+\)$|^hsl\([\d\s%,.]+\)$|^[a-z]+$/i,
  // iconify icon references (treeView filenameIcons/extensionIcons)
  filenameIcons: /^[\w-]+(?::[\w-]+)?$/,
  extensionIcons: /^[\w-]+(?::[\w-]+)?$/
}, D0 = /* @__PURE__ */ p((e, t) => {
  for (const r of Object.keys(e)) {
    const i = e[r];
    (r.startsWith("__") || r.includes("proto") || r.includes("constr") || typeof i != "string" || !t.test(i)) && (M.debug("sanitize deleting dictionary entry:", r, i), delete e[r]);
  }
}, "sanitizeDictionaryConfig"), Ks = /* @__PURE__ */ p((e) => {
  if (M.debug("sanitizeDirective called with", e), !(typeof e != "object" || e == null)) {
    if (Array.isArray(e)) {
      e.forEach((t) => Ks(t));
      return;
    }
    for (const t of Object.keys(e)) {
      if (M.debug("Checking key", t), t.startsWith("__") || t.includes("proto") || t.includes("constr") || !O0.has(t) || e[t] == null) {
        M.debug("sanitize deleting key: ", t), delete e[t];
        continue;
      }
      if (typeof e[t] == "object") {
        const i = I0[t];
        i ? D0(e[t], i) : (M.debug("sanitizing object", t), Ks(e[t]));
        continue;
      }
      const r = ["themeCSS", "fontFamily", "altFontFamily"];
      for (const i of r)
        t.includes(i) && (M.debug("sanitizing css option", t), e[t] = Rd(e[t]));
    }
    if (e.themeVariables)
      for (const t of Object.keys(e.themeVariables)) {
        const r = e.themeVariables[t];
        r?.match && !r.match(/^[\d "#%(),.;A-Za-z]+$/) && (e.themeVariables[t] = "");
      }
    M.debug("After sanitization", e);
  }
}, "sanitizeDirective"), Rd = /* @__PURE__ */ p((e) => {
  let t = 0, r = 0;
  for (const i of e) {
    if (t < r)
      return "{ /* ERROR: Unbalanced CSS */ }";
    i === "{" ? t++ : i === "}" && r++;
  }
  return t !== r ? "{ /* ERROR: Unbalanced CSS */ }" : e;
}, "sanitizeCss"), hi = Object.freeze(Pd), Oe = /* @__PURE__ */ p((e) => !(e === !1 || ["false", "null", "0"].includes(String(e).trim().toLowerCase())), "evaluate"), re = Ht({}, hi), Zs, xr = [], Vi = Ht({}, hi), ds = /* @__PURE__ */ p((e, t) => {
  let r = Ht({}, e), i = {};
  for (const s of t)
    Wd(s), i = Ht(i, s);
  if (r = Ht(r, i), i.theme && i.theme in ze) {
    const s = Ht({}, Zs), o = Ht(
      s.themeVariables || {},
      i.themeVariables
    );
    r.theme && r.theme in ze && (r.themeVariables = ze[r.theme].getThemeVariables(o));
  }
  return Vi = r, z0(Vi), Vi;
}, "updateCurrentConfig"), P0 = /* @__PURE__ */ p((e) => (re = Ht({}, hi), re = Ht(re, e), e.theme && ze[e.theme] && (re.themeVariables = ze[e.theme].getThemeVariables(e.themeVariables)), ds(re, xr), re), "setSiteConfig"), R0 = /* @__PURE__ */ p((e) => {
  Zs = Ht({}, e);
}, "saveConfigFromInitialize"), q0 = /* @__PURE__ */ p((e) => (re = Ht(re, e), ds(re, xr), re), "updateSiteConfig"), qd = /* @__PURE__ */ p(() => Ht({}, re), "getSiteConfig"), Nd = /* @__PURE__ */ p((e) => (ds(Vi, [e]), Dt()), "setConfig"), Dt = /* @__PURE__ */ p(() => Ht({}, Vi), "getConfig"), Wd = /* @__PURE__ */ p((e) => {
  e && (["secure", ...re.secure ?? []].forEach((t) => {
    Object.hasOwn(e, t) && (M.debug(`Denied attempt to modify a secure key ${t}`, e[t]), delete e[t]);
  }), Object.keys(e).forEach((t) => {
    t.startsWith("__") && delete e[t];
  }), Object.keys(e).forEach((t) => {
    typeof e[t] == "string" && (e[t].includes("<") || e[t].includes(">") || e[t].includes("url(data:")) && delete e[t], typeof e[t] == "object" && Wd(e[t]);
  }));
}, "sanitize"), N0 = /* @__PURE__ */ p((e) => {
  Ks(e), e.fontFamily && !e.themeVariables?.fontFamily && (e.themeVariables = {
    ...e.themeVariables,
    fontFamily: e.fontFamily
  }), xr.push(e), ds(re, xr);
}, "addDirective"), Qs = /* @__PURE__ */ p((e = re) => {
  xr = [], ds(e, xr);
}, "reset"), W0 = {
  LAZY_LOAD_DEPRECATED: "The configuration options lazyLoadedDiagrams and loadExternalDiagramsAtStartup are deprecated. Please use registerExternalDiagrams instead.",
  FLOWCHART_HTML_LABELS_DEPRECATED: "flowchart.htmlLabels is deprecated. Please use global htmlLabels instead."
}, sh = {}, zd = /* @__PURE__ */ p((e) => {
  sh[e] || (M.warn(W0[e]), sh[e] = !0);
}, "issueWarning"), z0 = /* @__PURE__ */ p((e) => {
  e && (e.lazyLoadedDiagrams || e.loadExternalDiagramsAtStartup) && zd("LAZY_LOAD_DEPRECATED");
}, "checkConfig"), hF = /* @__PURE__ */ p(() => {
  let e = {};
  Zs && (e = Ht(e, Zs));
  for (const t of xr)
    e = Ht(e, t);
  return e;
}, "getUserDefinedConfig"), Zt = /* @__PURE__ */ p((e) => (e.flowchart?.htmlLabels != null && zd("FLOWCHART_HTML_LABELS_DEPRECATED"), Oe(e.htmlLabels ?? e.flowchart?.htmlLabels ?? !0)), "getEffectiveHtmlLabels"), Hd = /^([^\S\n\r]*)-{3}\s*[\n\r](.*?)[\n\r]\1-{3}\s*[\n\r]+/s, Ki = /%{2}{\s*(?:(\w+)\s*:|(\w+))\s*(?:(\w+)|((?:(?!}%{2}).|\r?\n)*))?\s*(?:}%{2})?/gi, H0 = /\s*%%.*\n/gm, ii, Yd = (ii = class extends Error {
  constructor(t) {
    super(t), this.name = "UnknownDiagramError";
  }
}, p(ii, "UnknownDiagramError"), ii), Cr = {}, $n = /* @__PURE__ */ p(function(e, t) {
  e = e.replace(Hd, "").replace(Ki, "").replace(H0, `
`);
  for (const [r, { detector: i }] of Object.entries(Cr))
    if (i(e, t))
      return r;
  throw new Yd(
    `No diagram type detected matching given configuration for text: ${e}`
  );
}, "detectType"), Na = /* @__PURE__ */ p((...e) => {
  for (const { id: t, detector: r, loader: i } of e)
    Xd(t, r, i);
}, "registerLazyLoadedDiagrams"), Xd = /* @__PURE__ */ p((e, t, r) => {
  Cr[e] && M.warn(`Detector with key ${e} already exists. Overwriting.`), Cr[e] = { detector: t, loader: r }, M.debug(`Detector with key ${e} added${r ? " with loader" : ""}`);
}, "addDetector"), Y0 = /* @__PURE__ */ p((e) => Cr[e].loader, "getDiagramLoader"), us = /<br\s*\/?>/gi, X0 = /* @__PURE__ */ p((e) => e ? Gd(e).replace(/\\n/g, "#br#").split("#br#") : [""], "getRows"), j0 = /* @__PURE__ */ (() => {
  let e = !1;
  return () => {
    e || (jd(), e = !0);
  };
})();
function jd() {
  const e = "data-temp-href-target";
  ni.addHook("beforeSanitizeAttributes", (t) => {
    t.tagName === "A" && t.hasAttribute("target") && t.setAttribute(e, t.getAttribute("target") ?? "");
  }), ni.addHook("afterSanitizeAttributes", (t) => {
    t.tagName === "A" && t.hasAttribute(e) && (t.setAttribute("target", t.getAttribute(e) ?? ""), t.removeAttribute(e), t.getAttribute("target") === "_blank" && t.setAttribute("rel", "noopener"));
  });
}
p(jd, "setupDompurifyHooks");
var Ud = /* @__PURE__ */ p((e) => (j0(), ni.sanitize(e)), "removeScript"), oh = /* @__PURE__ */ p((e, t) => {
  if (Zt(t)) {
    const r = t.securityLevel;
    r === "antiscript" || r === "strict" || r === "sandbox" ? e = Ud(e) : r !== "loose" && (e = Gd(e), e = e.replace(/</g, "&lt;").replace(/>/g, "&gt;"), e = e.replace(/=/g, "&equals;"), e = K0(e));
  }
  return e;
}, "sanitizeMore"), he = /* @__PURE__ */ p((e, t) => e && (t.dompurifyConfig ? e = ni.sanitize(oh(e, t), t.dompurifyConfig).toString() : e = ni.sanitize(oh(e, t), {
  FORBID_TAGS: ["style"]
}).toString(), e), "sanitizeText"), U0 = /* @__PURE__ */ p((e, t) => typeof e == "string" ? he(e, t) : e.flat().map((r) => he(r, t)), "sanitizeTextOrArray"), G0 = /* @__PURE__ */ p((e) => us.test(e), "hasBreaks"), V0 = /* @__PURE__ */ p((e) => e.split(us), "splitBreaks"), K0 = /* @__PURE__ */ p((e) => e.replace(/#br#/g, "<br/>"), "placeholderToBreak"), Gd = /* @__PURE__ */ p((e) => e.replace(us, "#br#"), "breakToPlaceholder"), Z0 = /* @__PURE__ */ p((e) => {
  let t = "";
  return e && (t = window.location.protocol + "//" + window.location.host + window.location.pathname + window.location.search, t = CSS.escape(t)), t;
}, "getUrl"), Q0 = /* @__PURE__ */ p(function(...e) {
  const t = e.filter((r) => !isNaN(r));
  return Math.max(...t);
}, "getMax"), J0 = /* @__PURE__ */ p(function(...e) {
  const t = e.filter((r) => !isNaN(r));
  return Math.min(...t);
}, "getMin"), ah = /* @__PURE__ */ p(function(e) {
  const t = e.split(/(,)/), r = [];
  for (let i = 0; i < t.length; i++) {
    let s = t[i];
    if (s === "," && i > 0 && i + 1 < t.length) {
      const o = t[i - 1], a = t[i + 1];
      tx(o, a) && (s = o + "," + a, i++, r.pop());
    }
    r.push(ex(s));
  }
  return r.join("");
}, "parseGenericTypes"), Wa = /* @__PURE__ */ p((e, t) => Math.max(0, e.split(t).length - 1), "countOccurrence"), tx = /* @__PURE__ */ p((e, t) => {
  const r = Wa(e, "~"), i = Wa(t, "~");
  return r === 1 && i === 1;
}, "shouldCombineSets"), ex = /* @__PURE__ */ p((e) => {
  const t = Wa(e, "~");
  let r = !1;
  if (t <= 1)
    return e;
  t % 2 !== 0 && e.startsWith("~") && (e = e.substring(1), r = !0);
  const i = [...e];
  let s = i.indexOf("~"), o = i.lastIndexOf("~");
  for (; s !== -1 && o !== -1 && s !== o; )
    i[s] = "<", i[o] = ">", s = i.indexOf("~"), o = i.lastIndexOf("~");
  return r && i.unshift("~"), i.join("");
}, "processSet"), nh = /* @__PURE__ */ p(() => window.MathMLElement !== void 0, "isMathMLSupported"), za = /\$\$(.*?)\$\$/g, es = /* @__PURE__ */ p((e) => (e.match(za)?.length ?? 0) > 0, "hasKatex"), cF = /* @__PURE__ */ p(async (e, t) => {
  const r = document.createElement("div");
  r.innerHTML = await Vd(e, t), r.id = "katex-temp", r.style.visibility = "hidden", r.style.position = "absolute", r.style.top = "0", document.querySelector("body")?.insertAdjacentElement("beforeend", r);
  const s = { width: r.clientWidth, height: r.clientHeight };
  return r.remove(), s;
}, "calculateMathMLDimensions"), rx = /* @__PURE__ */ p(async (e, t) => {
  if (!es(e))
    return e;
  if (!(nh() || t.legacyMathML || t.forceLegacyMathML))
    return e.replace(za, "MathML is unsupported in this environment.");
  {
    const { default: r } = await import("./katex-DoRnZ_sp.js"), i = t.forceLegacyMathML || !nh() && t.legacyMathML ? "htmlAndMathml" : "mathml";
    return e.split(us).map(
      (s) => es(s) ? `<div style="display: flex; align-items: center; justify-content: center; white-space: nowrap;">${s}</div>` : `<div>${s}</div>`
    ).join("").replace(
      za,
      (s, o) => r.renderToString(o, {
        throwOnError: !0,
        displayMode: !0,
        output: i
      }).replace(/\n/g, " ").replace(/<annotation.*<\/annotation>/g, "")
    );
  }
}, "renderKatexUnsanitized"), Vd = /* @__PURE__ */ p(async (e, t) => he(await rx(e, t), t), "renderKatexSanitized"), fs = {
  getRows: X0,
  sanitizeText: he,
  sanitizeTextOrArray: U0,
  hasBreaks: G0,
  splitBreaks: V0,
  lineBreakRegex: us,
  removeScript: Ud,
  getUrl: Z0,
  evaluate: Oe,
  getMax: Q0,
  getMin: J0
}, ix = /* @__PURE__ */ p(function(e, t) {
  for (let r of t)
    e.attr(r[0], r[1]);
}, "d3Attrs"), sx = /* @__PURE__ */ p(function(e, t, r) {
  let i = /* @__PURE__ */ new Map();
  return r ? (i.set("width", "100%"), i.set("style", `max-width: ${t}px;`)) : (i.set("height", e), i.set("width", t)), i;
}, "calculateSvgSizeAttrs"), Kd = /* @__PURE__ */ p(function(e, t, r, i) {
  const s = sx(t, r, i);
  ix(e, s);
}, "configureSvgSize"), ox = /* @__PURE__ */ p(function(e, t, r, i) {
  const s = t.node().getBBox(), o = s.width, a = s.height;
  M.info(`SVG bounds: ${o}x${a}`, s);
  let n = 0, l = 0;
  M.info(`Graph bounds: ${n}x${l}`, e), n = o + r * 2, l = a + r * 2, M.info(`Calculated bounds: ${n}x${l}`), Kd(t, l, n, i);
  const c = `${s.x - r} ${s.y - r} ${s.width + 2 * r} ${s.height + 2 * r}`;
  t.attr("viewBox", c);
}, "setupGraphViewbox"), Rs = {};
function Ha(e) {
  return [...e.cssRules].map((t) => t.cssText).join(`
`);
}
p(Ha, "cssStyleSheetToString");
var ax = /* @__PURE__ */ p((e, t, r, i) => {
  let s = "";
  return e in Rs && Rs[e] ? s = Rs[e]({ ...r, svgId: i }) : M.warn(`No theme found for ${e}`), `& {
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
}, "getStyles"), nx = /* @__PURE__ */ p((e, t) => {
  t !== void 0 && (Rs[e] = t);
}, "addStylesForDiagram"), lx = ax, Zd = {};
r0(Zd, {
  clear: () => hx,
  getAccDescription: () => fx,
  getAccTitle: () => dx,
  getDiagramTitle: () => gx,
  setAccDescription: () => ux,
  setAccTitle: () => cx,
  setDiagramTitle: () => px
});
var On = "", In = "", Dn = "", Pn = /* @__PURE__ */ p((e) => he(e, Dt()), "sanitizeText"), hx = /* @__PURE__ */ p(() => {
  On = "", Dn = "", In = "";
}, "clear"), cx = /* @__PURE__ */ p((e) => {
  On = Pn(e).replace(/^\s+/g, "");
}, "setAccTitle"), dx = /* @__PURE__ */ p(() => On, "getAccTitle"), ux = /* @__PURE__ */ p((e) => {
  Dn = Pn(e).replace(/\n\s+/g, `
`);
}, "setAccDescription"), fx = /* @__PURE__ */ p(() => Dn, "getAccDescription"), px = /* @__PURE__ */ p((e) => {
  In = Pn(e);
}, "setDiagramTitle"), gx = /* @__PURE__ */ p(() => In, "getDiagramTitle"), lh = M, yx = Mn, Bt = Dt, dF = Nd, uF = hi, Rn = /* @__PURE__ */ p((e) => he(e, Bt()), "sanitizeText"), mx = ox, xx = /* @__PURE__ */ p(() => Zd, "getCommonDb"), Js = {}, to = /* @__PURE__ */ p((e, t, r) => {
  Js[e] && lh.warn(`Diagram with id ${e} already registered. Overwriting.`), Js[e] = t, r && Xd(e, r), nx(e, t.styles), t.injectUtils?.(
    lh,
    yx,
    Bt,
    Rn,
    mx,
    xx(),
    () => {
    }
  );
}, "registerDiagram"), Ya = /* @__PURE__ */ p((e) => {
  if (e in Js)
    return Js[e];
  throw new Cx(e);
}, "getDiagram"), si, Cx = (si = class extends Error {
  constructor(t) {
    super(`Diagram ${t} not found.`);
  }
}, p(si, "DiagramNotFoundError"), si), bx = { value: () => {
} };
function Qd() {
  for (var e = 0, t = arguments.length, r = {}, i; e < t; ++e) {
    if (!(i = arguments[e] + "") || i in r || /[\s.]/.test(i)) throw new Error("illegal type: " + i);
    r[i] = [];
  }
  return new qs(r);
}
function qs(e) {
  this._ = e;
}
function kx(e, t) {
  return e.trim().split(/^|\s+/).map(function(r) {
    var i = "", s = r.indexOf(".");
    if (s >= 0 && (i = r.slice(s + 1), r = r.slice(0, s)), r && !t.hasOwnProperty(r)) throw new Error("unknown type: " + r);
    return { type: r, name: i };
  });
}
qs.prototype = Qd.prototype = {
  constructor: qs,
  on: function(e, t) {
    var r = this._, i = kx(e + "", r), s, o = -1, a = i.length;
    if (arguments.length < 2) {
      for (; ++o < a; ) if ((s = (e = i[o]).type) && (s = wx(r[s], e.name))) return s;
      return;
    }
    if (t != null && typeof t != "function") throw new Error("invalid callback: " + t);
    for (; ++o < a; )
      if (s = (e = i[o]).type) r[s] = hh(r[s], e.name, t);
      else if (t == null) for (s in r) r[s] = hh(r[s], e.name, null);
    return this;
  },
  copy: function() {
    var e = {}, t = this._;
    for (var r in t) e[r] = t[r].slice();
    return new qs(e);
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
function wx(e, t) {
  for (var r = 0, i = e.length, s; r < i; ++r)
    if ((s = e[r]).name === t)
      return s.value;
}
function hh(e, t, r) {
  for (var i = 0, s = e.length; i < s; ++i)
    if (e[i].name === t) {
      e[i] = bx, e = e.slice(0, i).concat(e.slice(i + 1));
      break;
    }
  return r != null && e.push({ name: t, value: r }), e;
}
var Xa = "http://www.w3.org/1999/xhtml";
const ch = {
  svg: "http://www.w3.org/2000/svg",
  xhtml: Xa,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};
function _o(e) {
  var t = e += "", r = t.indexOf(":");
  return r >= 0 && (t = e.slice(0, r)) !== "xmlns" && (e = e.slice(r + 1)), ch.hasOwnProperty(t) ? { space: ch[t], local: e } : e;
}
function Sx(e) {
  return function() {
    var t = this.ownerDocument, r = this.namespaceURI;
    return r === Xa && t.documentElement.namespaceURI === Xa ? t.createElement(e) : t.createElementNS(r, e);
  };
}
function Tx(e) {
  return function() {
    return this.ownerDocument.createElementNS(e.space, e.local);
  };
}
function Jd(e) {
  var t = _o(e);
  return (t.local ? Tx : Sx)(t);
}
function Bx() {
}
function qn(e) {
  return e == null ? Bx : function() {
    return this.querySelector(e);
  };
}
function _x(e) {
  typeof e != "function" && (e = qn(e));
  for (var t = this._groups, r = t.length, i = new Array(r), s = 0; s < r; ++s)
    for (var o = t[s], a = o.length, n = i[s] = new Array(a), l, c, h = 0; h < a; ++h)
      (l = o[h]) && (c = e.call(l, l.__data__, h, o)) && ("__data__" in l && (c.__data__ = l.__data__), n[h] = c);
  return new ae(i, this._parents);
}
function vx(e) {
  return e == null ? [] : Array.isArray(e) ? e : Array.from(e);
}
function Lx() {
  return [];
}
function tu(e) {
  return e == null ? Lx : function() {
    return this.querySelectorAll(e);
  };
}
function Fx(e) {
  return function() {
    return vx(e.apply(this, arguments));
  };
}
function Ax(e) {
  typeof e == "function" ? e = Fx(e) : e = tu(e);
  for (var t = this._groups, r = t.length, i = [], s = [], o = 0; o < r; ++o)
    for (var a = t[o], n = a.length, l, c = 0; c < n; ++c)
      (l = a[c]) && (i.push(e.call(l, l.__data__, c, a)), s.push(l));
  return new ae(i, s);
}
function eu(e) {
  return function() {
    return this.matches(e);
  };
}
function ru(e) {
  return function(t) {
    return t.matches(e);
  };
}
var Ex = Array.prototype.find;
function Mx(e) {
  return function() {
    return Ex.call(this.children, e);
  };
}
function $x() {
  return this.firstElementChild;
}
function Ox(e) {
  return this.select(e == null ? $x : Mx(typeof e == "function" ? e : ru(e)));
}
var Ix = Array.prototype.filter;
function Dx() {
  return Array.from(this.children);
}
function Px(e) {
  return function() {
    return Ix.call(this.children, e);
  };
}
function Rx(e) {
  return this.selectAll(e == null ? Dx : Px(typeof e == "function" ? e : ru(e)));
}
function qx(e) {
  typeof e != "function" && (e = eu(e));
  for (var t = this._groups, r = t.length, i = new Array(r), s = 0; s < r; ++s)
    for (var o = t[s], a = o.length, n = i[s] = [], l, c = 0; c < a; ++c)
      (l = o[c]) && e.call(l, l.__data__, c, o) && n.push(l);
  return new ae(i, this._parents);
}
function iu(e) {
  return new Array(e.length);
}
function Nx() {
  return new ae(this._enter || this._groups.map(iu), this._parents);
}
function eo(e, t) {
  this.ownerDocument = e.ownerDocument, this.namespaceURI = e.namespaceURI, this._next = null, this._parent = e, this.__data__ = t;
}
eo.prototype = {
  constructor: eo,
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
function Wx(e) {
  return function() {
    return e;
  };
}
function zx(e, t, r, i, s, o) {
  for (var a = 0, n, l = t.length, c = o.length; a < c; ++a)
    (n = t[a]) ? (n.__data__ = o[a], i[a] = n) : r[a] = new eo(e, o[a]);
  for (; a < l; ++a)
    (n = t[a]) && (s[a] = n);
}
function Hx(e, t, r, i, s, o, a) {
  var n, l, c = /* @__PURE__ */ new Map(), h = t.length, d = o.length, u = new Array(h), f;
  for (n = 0; n < h; ++n)
    (l = t[n]) && (u[n] = f = a.call(l, l.__data__, n, t) + "", c.has(f) ? s[n] = l : c.set(f, l));
  for (n = 0; n < d; ++n)
    f = a.call(e, o[n], n, o) + "", (l = c.get(f)) ? (i[n] = l, l.__data__ = o[n], c.delete(f)) : r[n] = new eo(e, o[n]);
  for (n = 0; n < h; ++n)
    (l = t[n]) && c.get(u[n]) === l && (s[n] = l);
}
function Yx(e) {
  return e.__data__;
}
function Xx(e, t) {
  if (!arguments.length) return Array.from(this, Yx);
  var r = t ? Hx : zx, i = this._parents, s = this._groups;
  typeof e != "function" && (e = Wx(e));
  for (var o = s.length, a = new Array(o), n = new Array(o), l = new Array(o), c = 0; c < o; ++c) {
    var h = i[c], d = s[c], u = d.length, f = jx(e.call(h, h && h.__data__, c, i)), y = f.length, m = n[c] = new Array(y), x = a[c] = new Array(y), C = l[c] = new Array(u);
    r(h, d, m, x, C, f, t);
    for (var b = 0, w = 0, T, B; b < y; ++b)
      if (T = m[b]) {
        for (b >= w && (w = b + 1); !(B = x[w]) && ++w < y; ) ;
        T._next = B || null;
      }
  }
  return a = new ae(a, i), a._enter = n, a._exit = l, a;
}
function jx(e) {
  return typeof e == "object" && "length" in e ? e : Array.from(e);
}
function Ux() {
  return new ae(this._exit || this._groups.map(iu), this._parents);
}
function Gx(e, t, r) {
  var i = this.enter(), s = this, o = this.exit();
  return typeof e == "function" ? (i = e(i), i && (i = i.selection())) : i = i.append(e + ""), t != null && (s = t(s), s && (s = s.selection())), r == null ? o.remove() : r(o), i && s ? i.merge(s).order() : s;
}
function Vx(e) {
  for (var t = e.selection ? e.selection() : e, r = this._groups, i = t._groups, s = r.length, o = i.length, a = Math.min(s, o), n = new Array(s), l = 0; l < a; ++l)
    for (var c = r[l], h = i[l], d = c.length, u = n[l] = new Array(d), f, y = 0; y < d; ++y)
      (f = c[y] || h[y]) && (u[y] = f);
  for (; l < s; ++l)
    n[l] = r[l];
  return new ae(n, this._parents);
}
function Kx() {
  for (var e = this._groups, t = -1, r = e.length; ++t < r; )
    for (var i = e[t], s = i.length - 1, o = i[s], a; --s >= 0; )
      (a = i[s]) && (o && a.compareDocumentPosition(o) ^ 4 && o.parentNode.insertBefore(a, o), o = a);
  return this;
}
function Zx(e) {
  e || (e = Qx);
  function t(d, u) {
    return d && u ? e(d.__data__, u.__data__) : !d - !u;
  }
  for (var r = this._groups, i = r.length, s = new Array(i), o = 0; o < i; ++o) {
    for (var a = r[o], n = a.length, l = s[o] = new Array(n), c, h = 0; h < n; ++h)
      (c = a[h]) && (l[h] = c);
    l.sort(t);
  }
  return new ae(s, this._parents).order();
}
function Qx(e, t) {
  return e < t ? -1 : e > t ? 1 : e >= t ? 0 : NaN;
}
function Jx() {
  var e = arguments[0];
  return arguments[0] = this, e.apply(null, arguments), this;
}
function tC() {
  return Array.from(this);
}
function eC() {
  for (var e = this._groups, t = 0, r = e.length; t < r; ++t)
    for (var i = e[t], s = 0, o = i.length; s < o; ++s) {
      var a = i[s];
      if (a) return a;
    }
  return null;
}
function rC() {
  let e = 0;
  for (const t of this) ++e;
  return e;
}
function iC() {
  return !this.node();
}
function sC(e) {
  for (var t = this._groups, r = 0, i = t.length; r < i; ++r)
    for (var s = t[r], o = 0, a = s.length, n; o < a; ++o)
      (n = s[o]) && e.call(n, n.__data__, o, s);
  return this;
}
function oC(e) {
  return function() {
    this.removeAttribute(e);
  };
}
function aC(e) {
  return function() {
    this.removeAttributeNS(e.space, e.local);
  };
}
function nC(e, t) {
  return function() {
    this.setAttribute(e, t);
  };
}
function lC(e, t) {
  return function() {
    this.setAttributeNS(e.space, e.local, t);
  };
}
function hC(e, t) {
  return function() {
    var r = t.apply(this, arguments);
    r == null ? this.removeAttribute(e) : this.setAttribute(e, r);
  };
}
function cC(e, t) {
  return function() {
    var r = t.apply(this, arguments);
    r == null ? this.removeAttributeNS(e.space, e.local) : this.setAttributeNS(e.space, e.local, r);
  };
}
function dC(e, t) {
  var r = _o(e);
  if (arguments.length < 2) {
    var i = this.node();
    return r.local ? i.getAttributeNS(r.space, r.local) : i.getAttribute(r);
  }
  return this.each((t == null ? r.local ? aC : oC : typeof t == "function" ? r.local ? cC : hC : r.local ? lC : nC)(r, t));
}
function su(e) {
  return e.ownerDocument && e.ownerDocument.defaultView || e.document && e || e.defaultView;
}
function uC(e) {
  return function() {
    this.style.removeProperty(e);
  };
}
function fC(e, t, r) {
  return function() {
    this.style.setProperty(e, t, r);
  };
}
function pC(e, t, r) {
  return function() {
    var i = t.apply(this, arguments);
    i == null ? this.style.removeProperty(e) : this.style.setProperty(e, i, r);
  };
}
function gC(e, t, r) {
  return arguments.length > 1 ? this.each((t == null ? uC : typeof t == "function" ? pC : fC)(e, t, r ?? "")) : ci(this.node(), e);
}
function ci(e, t) {
  return e.style.getPropertyValue(t) || su(e).getComputedStyle(e, null).getPropertyValue(t);
}
function yC(e) {
  return function() {
    delete this[e];
  };
}
function mC(e, t) {
  return function() {
    this[e] = t;
  };
}
function xC(e, t) {
  return function() {
    var r = t.apply(this, arguments);
    r == null ? delete this[e] : this[e] = r;
  };
}
function CC(e, t) {
  return arguments.length > 1 ? this.each((t == null ? yC : typeof t == "function" ? xC : mC)(e, t)) : this.node()[e];
}
function ou(e) {
  return e.trim().split(/^|\s+/);
}
function Nn(e) {
  return e.classList || new au(e);
}
function au(e) {
  this._node = e, this._names = ou(e.getAttribute("class") || "");
}
au.prototype = {
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
function nu(e, t) {
  for (var r = Nn(e), i = -1, s = t.length; ++i < s; ) r.add(t[i]);
}
function lu(e, t) {
  for (var r = Nn(e), i = -1, s = t.length; ++i < s; ) r.remove(t[i]);
}
function bC(e) {
  return function() {
    nu(this, e);
  };
}
function kC(e) {
  return function() {
    lu(this, e);
  };
}
function wC(e, t) {
  return function() {
    (t.apply(this, arguments) ? nu : lu)(this, e);
  };
}
function SC(e, t) {
  var r = ou(e + "");
  if (arguments.length < 2) {
    for (var i = Nn(this.node()), s = -1, o = r.length; ++s < o; ) if (!i.contains(r[s])) return !1;
    return !0;
  }
  return this.each((typeof t == "function" ? wC : t ? bC : kC)(r, t));
}
function TC() {
  this.textContent = "";
}
function BC(e) {
  return function() {
    this.textContent = e;
  };
}
function _C(e) {
  return function() {
    var t = e.apply(this, arguments);
    this.textContent = t ?? "";
  };
}
function vC(e) {
  return arguments.length ? this.each(e == null ? TC : (typeof e == "function" ? _C : BC)(e)) : this.node().textContent;
}
function LC() {
  this.innerHTML = "";
}
function FC(e) {
  return function() {
    this.innerHTML = e;
  };
}
function AC(e) {
  return function() {
    var t = e.apply(this, arguments);
    this.innerHTML = t ?? "";
  };
}
function EC(e) {
  return arguments.length ? this.each(e == null ? LC : (typeof e == "function" ? AC : FC)(e)) : this.node().innerHTML;
}
function MC() {
  this.nextSibling && this.parentNode.appendChild(this);
}
function $C() {
  return this.each(MC);
}
function OC() {
  this.previousSibling && this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function IC() {
  return this.each(OC);
}
function DC(e) {
  var t = typeof e == "function" ? e : Jd(e);
  return this.select(function() {
    return this.appendChild(t.apply(this, arguments));
  });
}
function PC() {
  return null;
}
function RC(e, t) {
  var r = typeof e == "function" ? e : Jd(e), i = t == null ? PC : typeof t == "function" ? t : qn(t);
  return this.select(function() {
    return this.insertBefore(r.apply(this, arguments), i.apply(this, arguments) || null);
  });
}
function qC() {
  var e = this.parentNode;
  e && e.removeChild(this);
}
function NC() {
  return this.each(qC);
}
function WC() {
  var e = this.cloneNode(!1), t = this.parentNode;
  return t ? t.insertBefore(e, this.nextSibling) : e;
}
function zC() {
  var e = this.cloneNode(!0), t = this.parentNode;
  return t ? t.insertBefore(e, this.nextSibling) : e;
}
function HC(e) {
  return this.select(e ? zC : WC);
}
function YC(e) {
  return arguments.length ? this.property("__data__", e) : this.node().__data__;
}
function XC(e) {
  return function(t) {
    e.call(this, t, this.__data__);
  };
}
function jC(e) {
  return e.trim().split(/^|\s+/).map(function(t) {
    var r = "", i = t.indexOf(".");
    return i >= 0 && (r = t.slice(i + 1), t = t.slice(0, i)), { type: t, name: r };
  });
}
function UC(e) {
  return function() {
    var t = this.__on;
    if (t) {
      for (var r = 0, i = -1, s = t.length, o; r < s; ++r)
        o = t[r], (!e.type || o.type === e.type) && o.name === e.name ? this.removeEventListener(o.type, o.listener, o.options) : t[++i] = o;
      ++i ? t.length = i : delete this.__on;
    }
  };
}
function GC(e, t, r) {
  return function() {
    var i = this.__on, s, o = XC(t);
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
function VC(e, t, r) {
  var i = jC(e + ""), s, o = i.length, a;
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
  for (n = t ? GC : UC, s = 0; s < o; ++s) this.each(n(i[s], t, r));
  return this;
}
function hu(e, t, r) {
  var i = su(e), s = i.CustomEvent;
  typeof s == "function" ? s = new s(t, r) : (s = i.document.createEvent("Event"), r ? (s.initEvent(t, r.bubbles, r.cancelable), s.detail = r.detail) : s.initEvent(t, !1, !1)), e.dispatchEvent(s);
}
function KC(e, t) {
  return function() {
    return hu(this, e, t);
  };
}
function ZC(e, t) {
  return function() {
    return hu(this, e, t.apply(this, arguments));
  };
}
function QC(e, t) {
  return this.each((typeof t == "function" ? ZC : KC)(e, t));
}
function* JC() {
  for (var e = this._groups, t = 0, r = e.length; t < r; ++t)
    for (var i = e[t], s = 0, o = i.length, a; s < o; ++s)
      (a = i[s]) && (yield a);
}
var cu = [null];
function ae(e, t) {
  this._groups = e, this._parents = t;
}
function ps() {
  return new ae([[document.documentElement]], cu);
}
function tb() {
  return this;
}
ae.prototype = ps.prototype = {
  constructor: ae,
  select: _x,
  selectAll: Ax,
  selectChild: Ox,
  selectChildren: Rx,
  filter: qx,
  data: Xx,
  enter: Nx,
  exit: Ux,
  join: Gx,
  merge: Vx,
  selection: tb,
  order: Kx,
  sort: Zx,
  call: Jx,
  nodes: tC,
  node: eC,
  size: rC,
  empty: iC,
  each: sC,
  attr: dC,
  style: gC,
  property: CC,
  classed: SC,
  text: vC,
  html: EC,
  raise: $C,
  lower: IC,
  append: DC,
  insert: RC,
  remove: NC,
  clone: HC,
  datum: YC,
  on: VC,
  dispatch: QC,
  [Symbol.iterator]: JC
};
function xt(e) {
  return typeof e == "string" ? new ae([[document.querySelector(e)]], [document.documentElement]) : new ae([[e]], cu);
}
function Wn(e, t, r) {
  e.prototype = t.prototype = r, r.constructor = e;
}
function du(e, t) {
  var r = Object.create(e.prototype);
  for (var i in t) r[i] = t[i];
  return r;
}
function gs() {
}
var rs = 0.7, ro = 1 / rs, Yr = "\\s*([+-]?\\d+)\\s*", is = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*", Ae = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*", eb = /^#([0-9a-f]{3,8})$/, rb = new RegExp(`^rgb\\(${Yr},${Yr},${Yr}\\)$`), ib = new RegExp(`^rgb\\(${Ae},${Ae},${Ae}\\)$`), sb = new RegExp(`^rgba\\(${Yr},${Yr},${Yr},${is}\\)$`), ob = new RegExp(`^rgba\\(${Ae},${Ae},${Ae},${is}\\)$`), ab = new RegExp(`^hsl\\(${is},${Ae},${Ae}\\)$`), nb = new RegExp(`^hsla\\(${is},${Ae},${Ae},${is}\\)$`), dh = {
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
Wn(gs, ss, {
  copy(e) {
    return Object.assign(new this.constructor(), this, e);
  },
  displayable() {
    return this.rgb().displayable();
  },
  hex: uh,
  // Deprecated! Use color.formatHex.
  formatHex: uh,
  formatHex8: lb,
  formatHsl: hb,
  formatRgb: fh,
  toString: fh
});
function uh() {
  return this.rgb().formatHex();
}
function lb() {
  return this.rgb().formatHex8();
}
function hb() {
  return uu(this).formatHsl();
}
function fh() {
  return this.rgb().formatRgb();
}
function ss(e) {
  var t, r;
  return e = (e + "").trim().toLowerCase(), (t = eb.exec(e)) ? (r = t[1].length, t = parseInt(t[1], 16), r === 6 ? ph(t) : r === 3 ? new ie(t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, (t & 15) << 4 | t & 15, 1) : r === 8 ? Ts(t >> 24 & 255, t >> 16 & 255, t >> 8 & 255, (t & 255) / 255) : r === 4 ? Ts(t >> 12 & 15 | t >> 8 & 240, t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, ((t & 15) << 4 | t & 15) / 255) : null) : (t = rb.exec(e)) ? new ie(t[1], t[2], t[3], 1) : (t = ib.exec(e)) ? new ie(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, 1) : (t = sb.exec(e)) ? Ts(t[1], t[2], t[3], t[4]) : (t = ob.exec(e)) ? Ts(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, t[4]) : (t = ab.exec(e)) ? mh(t[1], t[2] / 100, t[3] / 100, 1) : (t = nb.exec(e)) ? mh(t[1], t[2] / 100, t[3] / 100, t[4]) : dh.hasOwnProperty(e) ? ph(dh[e]) : e === "transparent" ? new ie(NaN, NaN, NaN, 0) : null;
}
function ph(e) {
  return new ie(e >> 16 & 255, e >> 8 & 255, e & 255, 1);
}
function Ts(e, t, r, i) {
  return i <= 0 && (e = t = r = NaN), new ie(e, t, r, i);
}
function cb(e) {
  return e instanceof gs || (e = ss(e)), e ? (e = e.rgb(), new ie(e.r, e.g, e.b, e.opacity)) : new ie();
}
function ja(e, t, r, i) {
  return arguments.length === 1 ? cb(e) : new ie(e, t, r, i ?? 1);
}
function ie(e, t, r, i) {
  this.r = +e, this.g = +t, this.b = +r, this.opacity = +i;
}
Wn(ie, ja, du(gs, {
  brighter(e) {
    return e = e == null ? ro : Math.pow(ro, e), new ie(this.r * e, this.g * e, this.b * e, this.opacity);
  },
  darker(e) {
    return e = e == null ? rs : Math.pow(rs, e), new ie(this.r * e, this.g * e, this.b * e, this.opacity);
  },
  rgb() {
    return this;
  },
  clamp() {
    return new ie(yr(this.r), yr(this.g), yr(this.b), io(this.opacity));
  },
  displayable() {
    return -0.5 <= this.r && this.r < 255.5 && -0.5 <= this.g && this.g < 255.5 && -0.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
  },
  hex: gh,
  // Deprecated! Use color.formatHex.
  formatHex: gh,
  formatHex8: db,
  formatRgb: yh,
  toString: yh
}));
function gh() {
  return `#${dr(this.r)}${dr(this.g)}${dr(this.b)}`;
}
function db() {
  return `#${dr(this.r)}${dr(this.g)}${dr(this.b)}${dr((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function yh() {
  const e = io(this.opacity);
  return `${e === 1 ? "rgb(" : "rgba("}${yr(this.r)}, ${yr(this.g)}, ${yr(this.b)}${e === 1 ? ")" : `, ${e})`}`;
}
function io(e) {
  return isNaN(e) ? 1 : Math.max(0, Math.min(1, e));
}
function yr(e) {
  return Math.max(0, Math.min(255, Math.round(e) || 0));
}
function dr(e) {
  return e = yr(e), (e < 16 ? "0" : "") + e.toString(16);
}
function mh(e, t, r, i) {
  return i <= 0 ? e = t = r = NaN : r <= 0 || r >= 1 ? e = t = NaN : t <= 0 && (e = NaN), new xe(e, t, r, i);
}
function uu(e) {
  if (e instanceof xe) return new xe(e.h, e.s, e.l, e.opacity);
  if (e instanceof gs || (e = ss(e)), !e) return new xe();
  if (e instanceof xe) return e;
  e = e.rgb();
  var t = e.r / 255, r = e.g / 255, i = e.b / 255, s = Math.min(t, r, i), o = Math.max(t, r, i), a = NaN, n = o - s, l = (o + s) / 2;
  return n ? (t === o ? a = (r - i) / n + (r < i) * 6 : r === o ? a = (i - t) / n + 2 : a = (t - r) / n + 4, n /= l < 0.5 ? o + s : 2 - o - s, a *= 60) : n = l > 0 && l < 1 ? 0 : a, new xe(a, n, l, e.opacity);
}
function ub(e, t, r, i) {
  return arguments.length === 1 ? uu(e) : new xe(e, t, r, i ?? 1);
}
function xe(e, t, r, i) {
  this.h = +e, this.s = +t, this.l = +r, this.opacity = +i;
}
Wn(xe, ub, du(gs, {
  brighter(e) {
    return e = e == null ? ro : Math.pow(ro, e), new xe(this.h, this.s, this.l * e, this.opacity);
  },
  darker(e) {
    return e = e == null ? rs : Math.pow(rs, e), new xe(this.h, this.s, this.l * e, this.opacity);
  },
  rgb() {
    var e = this.h % 360 + (this.h < 0) * 360, t = isNaN(e) || isNaN(this.s) ? 0 : this.s, r = this.l, i = r + (r < 0.5 ? r : 1 - r) * t, s = 2 * r - i;
    return new ie(
      Uo(e >= 240 ? e - 240 : e + 120, s, i),
      Uo(e, s, i),
      Uo(e < 120 ? e + 240 : e - 120, s, i),
      this.opacity
    );
  },
  clamp() {
    return new xe(xh(this.h), Bs(this.s), Bs(this.l), io(this.opacity));
  },
  displayable() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
  },
  formatHsl() {
    const e = io(this.opacity);
    return `${e === 1 ? "hsl(" : "hsla("}${xh(this.h)}, ${Bs(this.s) * 100}%, ${Bs(this.l) * 100}%${e === 1 ? ")" : `, ${e})`}`;
  }
}));
function xh(e) {
  return e = (e || 0) % 360, e < 0 ? e + 360 : e;
}
function Bs(e) {
  return Math.max(0, Math.min(1, e || 0));
}
function Uo(e, t, r) {
  return (e < 60 ? t + (r - t) * e / 60 : e < 180 ? r : e < 240 ? t + (r - t) * (240 - e) / 60 : t) * 255;
}
const zn = (e) => () => e;
function fu(e, t) {
  return function(r) {
    return e + r * t;
  };
}
function fb(e, t, r) {
  return e = Math.pow(e, r), t = Math.pow(t, r) - e, r = 1 / r, function(i) {
    return Math.pow(e + i * t, r);
  };
}
function fF(e, t) {
  var r = t - e;
  return r ? fu(e, r > 180 || r < -180 ? r - 360 * Math.round(r / 360) : r) : zn(isNaN(e) ? t : e);
}
function pb(e) {
  return (e = +e) == 1 ? pu : function(t, r) {
    return r - t ? fb(t, r, e) : zn(isNaN(t) ? r : t);
  };
}
function pu(e, t) {
  var r = t - e;
  return r ? fu(e, r) : zn(isNaN(e) ? t : e);
}
const Ch = (function e(t) {
  var r = pb(t);
  function i(s, o) {
    var a = r((s = ja(s)).r, (o = ja(o)).r), n = r(s.g, o.g), l = r(s.b, o.b), c = pu(s.opacity, o.opacity);
    return function(h) {
      return s.r = a(h), s.g = n(h), s.b = l(h), s.opacity = c(h), s + "";
    };
  }
  return i.gamma = e, i;
})(1);
function Ve(e, t) {
  return e = +e, t = +t, function(r) {
    return e * (1 - r) + t * r;
  };
}
var Ua = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, Go = new RegExp(Ua.source, "g");
function gb(e) {
  return function() {
    return e;
  };
}
function yb(e) {
  return function(t) {
    return e(t) + "";
  };
}
function mb(e, t) {
  var r = Ua.lastIndex = Go.lastIndex = 0, i, s, o, a = -1, n = [], l = [];
  for (e = e + "", t = t + ""; (i = Ua.exec(e)) && (s = Go.exec(t)); )
    (o = s.index) > r && (o = t.slice(r, o), n[a] ? n[a] += o : n[++a] = o), (i = i[0]) === (s = s[0]) ? n[a] ? n[a] += s : n[++a] = s : (n[++a] = null, l.push({ i: a, x: Ve(i, s) })), r = Go.lastIndex;
  return r < t.length && (o = t.slice(r), n[a] ? n[a] += o : n[++a] = o), n.length < 2 ? l[0] ? yb(l[0].x) : gb(t) : (t = l.length, function(c) {
    for (var h = 0, d; h < t; ++h) n[(d = l[h]).i] = d.x(c);
    return n.join("");
  });
}
var bh = 180 / Math.PI, Ga = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  skewX: 0,
  scaleX: 1,
  scaleY: 1
};
function gu(e, t, r, i, s, o) {
  var a, n, l;
  return (a = Math.sqrt(e * e + t * t)) && (e /= a, t /= a), (l = e * r + t * i) && (r -= e * l, i -= t * l), (n = Math.sqrt(r * r + i * i)) && (r /= n, i /= n, l /= n), e * i < t * r && (e = -e, t = -t, l = -l, a = -a), {
    translateX: s,
    translateY: o,
    rotate: Math.atan2(t, e) * bh,
    skewX: Math.atan(l) * bh,
    scaleX: a,
    scaleY: n
  };
}
var _s;
function xb(e) {
  const t = new (typeof DOMMatrix == "function" ? DOMMatrix : WebKitCSSMatrix)(e + "");
  return t.isIdentity ? Ga : gu(t.a, t.b, t.c, t.d, t.e, t.f);
}
function Cb(e) {
  return e == null || (_s || (_s = document.createElementNS("http://www.w3.org/2000/svg", "g")), _s.setAttribute("transform", e), !(e = _s.transform.baseVal.consolidate())) ? Ga : (e = e.matrix, gu(e.a, e.b, e.c, e.d, e.e, e.f));
}
function yu(e, t, r, i) {
  function s(c) {
    return c.length ? c.pop() + " " : "";
  }
  function o(c, h, d, u, f, y) {
    if (c !== d || h !== u) {
      var m = f.push("translate(", null, t, null, r);
      y.push({ i: m - 4, x: Ve(c, d) }, { i: m - 2, x: Ve(h, u) });
    } else (d || u) && f.push("translate(" + d + t + u + r);
  }
  function a(c, h, d, u) {
    c !== h ? (c - h > 180 ? h += 360 : h - c > 180 && (c += 360), u.push({ i: d.push(s(d) + "rotate(", null, i) - 2, x: Ve(c, h) })) : h && d.push(s(d) + "rotate(" + h + i);
  }
  function n(c, h, d, u) {
    c !== h ? u.push({ i: d.push(s(d) + "skewX(", null, i) - 2, x: Ve(c, h) }) : h && d.push(s(d) + "skewX(" + h + i);
  }
  function l(c, h, d, u, f, y) {
    if (c !== d || h !== u) {
      var m = f.push(s(f) + "scale(", null, ",", null, ")");
      y.push({ i: m - 4, x: Ve(c, d) }, { i: m - 2, x: Ve(h, u) });
    } else (d !== 1 || u !== 1) && f.push(s(f) + "scale(" + d + "," + u + ")");
  }
  return function(c, h) {
    var d = [], u = [];
    return c = e(c), h = e(h), o(c.translateX, c.translateY, h.translateX, h.translateY, d, u), a(c.rotate, h.rotate, d, u), n(c.skewX, h.skewX, d, u), l(c.scaleX, c.scaleY, h.scaleX, h.scaleY, d, u), c = h = null, function(f) {
      for (var y = -1, m = u.length, x; ++y < m; ) d[(x = u[y]).i] = x.x(f);
      return d.join("");
    };
  };
}
var bb = yu(xb, "px, ", "px)", "deg)"), kb = yu(Cb, ", ", ")", ")"), di = 0, qi = 0, Ai = 0, mu = 1e3, so, Ni, oo = 0, br = 0, vo = 0, os = typeof performance == "object" && performance.now ? performance : Date, xu = typeof window == "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(e) {
  setTimeout(e, 17);
};
function Hn() {
  return br || (xu(wb), br = os.now() + vo);
}
function wb() {
  br = 0;
}
function ao() {
  this._call = this._time = this._next = null;
}
ao.prototype = Cu.prototype = {
  constructor: ao,
  restart: function(e, t, r) {
    if (typeof e != "function") throw new TypeError("callback is not a function");
    r = (r == null ? Hn() : +r) + (t == null ? 0 : +t), !this._next && Ni !== this && (Ni ? Ni._next = this : so = this, Ni = this), this._call = e, this._time = r, Va();
  },
  stop: function() {
    this._call && (this._call = null, this._time = 1 / 0, Va());
  }
};
function Cu(e, t, r) {
  var i = new ao();
  return i.restart(e, t, r), i;
}
function Sb() {
  Hn(), ++di;
  for (var e = so, t; e; )
    (t = br - e._time) >= 0 && e._call.call(void 0, t), e = e._next;
  --di;
}
function kh() {
  br = (oo = os.now()) + vo, di = qi = 0;
  try {
    Sb();
  } finally {
    di = 0, Bb(), br = 0;
  }
}
function Tb() {
  var e = os.now(), t = e - oo;
  t > mu && (vo -= t, oo = e);
}
function Bb() {
  for (var e, t = so, r, i = 1 / 0; t; )
    t._call ? (i > t._time && (i = t._time), e = t, t = t._next) : (r = t._next, t._next = null, t = e ? e._next = r : so = r);
  Ni = e, Va(i);
}
function Va(e) {
  if (!di) {
    qi && (qi = clearTimeout(qi));
    var t = e - br;
    t > 24 ? (e < 1 / 0 && (qi = setTimeout(kh, e - os.now() - vo)), Ai && (Ai = clearInterval(Ai))) : (Ai || (oo = os.now(), Ai = setInterval(Tb, mu)), di = 1, xu(kh));
  }
}
function wh(e, t, r) {
  var i = new ao();
  return t = t == null ? 0 : +t, i.restart((s) => {
    i.stop(), e(s + t);
  }, t, r), i;
}
var _b = Qd("start", "end", "cancel", "interrupt"), vb = [], bu = 0, Sh = 1, Ka = 2, Ns = 3, Th = 4, Za = 5, Ws = 6;
function Lo(e, t, r, i, s, o) {
  var a = e.__transition;
  if (!a) e.__transition = {};
  else if (r in a) return;
  Lb(e, r, {
    name: t,
    index: i,
    // For context during callback.
    group: s,
    // For context during callback.
    on: _b,
    tween: vb,
    time: o.time,
    delay: o.delay,
    duration: o.duration,
    ease: o.ease,
    timer: null,
    state: bu
  });
}
function Yn(e, t) {
  var r = ke(e, t);
  if (r.state > bu) throw new Error("too late; already scheduled");
  return r;
}
function Ie(e, t) {
  var r = ke(e, t);
  if (r.state > Ns) throw new Error("too late; already running");
  return r;
}
function ke(e, t) {
  var r = e.__transition;
  if (!r || !(r = r[t])) throw new Error("transition not found");
  return r;
}
function Lb(e, t, r) {
  var i = e.__transition, s;
  i[t] = r, r.timer = Cu(o, 0, r.time);
  function o(c) {
    r.state = Sh, r.timer.restart(a, r.delay, r.time), r.delay <= c && a(c - r.delay);
  }
  function a(c) {
    var h, d, u, f;
    if (r.state !== Sh) return l();
    for (h in i)
      if (f = i[h], f.name === r.name) {
        if (f.state === Ns) return wh(a);
        f.state === Th ? (f.state = Ws, f.timer.stop(), f.on.call("interrupt", e, e.__data__, f.index, f.group), delete i[h]) : +h < t && (f.state = Ws, f.timer.stop(), f.on.call("cancel", e, e.__data__, f.index, f.group), delete i[h]);
      }
    if (wh(function() {
      r.state === Ns && (r.state = Th, r.timer.restart(n, r.delay, r.time), n(c));
    }), r.state = Ka, r.on.call("start", e, e.__data__, r.index, r.group), r.state === Ka) {
      for (r.state = Ns, s = new Array(u = r.tween.length), h = 0, d = -1; h < u; ++h)
        (f = r.tween[h].value.call(e, e.__data__, r.index, r.group)) && (s[++d] = f);
      s.length = d + 1;
    }
  }
  function n(c) {
    for (var h = c < r.duration ? r.ease.call(null, c / r.duration) : (r.timer.restart(l), r.state = Za, 1), d = -1, u = s.length; ++d < u; )
      s[d].call(e, h);
    r.state === Za && (r.on.call("end", e, e.__data__, r.index, r.group), l());
  }
  function l() {
    r.state = Ws, r.timer.stop(), delete i[t];
    for (var c in i) return;
    delete e.__transition;
  }
}
function Fb(e, t) {
  var r = e.__transition, i, s, o = !0, a;
  if (r) {
    t = t == null ? null : t + "";
    for (a in r) {
      if ((i = r[a]).name !== t) {
        o = !1;
        continue;
      }
      s = i.state > Ka && i.state < Za, i.state = Ws, i.timer.stop(), i.on.call(s ? "interrupt" : "cancel", e, e.__data__, i.index, i.group), delete r[a];
    }
    o && delete e.__transition;
  }
}
function Ab(e) {
  return this.each(function() {
    Fb(this, e);
  });
}
function Eb(e, t) {
  var r, i;
  return function() {
    var s = Ie(this, e), o = s.tween;
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
function Mb(e, t, r) {
  var i, s;
  if (typeof r != "function") throw new Error();
  return function() {
    var o = Ie(this, e), a = o.tween;
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
function $b(e, t) {
  var r = this._id;
  if (e += "", arguments.length < 2) {
    for (var i = ke(this.node(), r).tween, s = 0, o = i.length, a; s < o; ++s)
      if ((a = i[s]).name === e)
        return a.value;
    return null;
  }
  return this.each((t == null ? Eb : Mb)(r, e, t));
}
function Xn(e, t, r) {
  var i = e._id;
  return e.each(function() {
    var s = Ie(this, i);
    (s.value || (s.value = {}))[t] = r.apply(this, arguments);
  }), function(s) {
    return ke(s, i).value[t];
  };
}
function ku(e, t) {
  var r;
  return (typeof t == "number" ? Ve : t instanceof ss ? Ch : (r = ss(t)) ? (t = r, Ch) : mb)(e, t);
}
function Ob(e) {
  return function() {
    this.removeAttribute(e);
  };
}
function Ib(e) {
  return function() {
    this.removeAttributeNS(e.space, e.local);
  };
}
function Db(e, t, r) {
  var i, s = r + "", o;
  return function() {
    var a = this.getAttribute(e);
    return a === s ? null : a === i ? o : o = t(i = a, r);
  };
}
function Pb(e, t, r) {
  var i, s = r + "", o;
  return function() {
    var a = this.getAttributeNS(e.space, e.local);
    return a === s ? null : a === i ? o : o = t(i = a, r);
  };
}
function Rb(e, t, r) {
  var i, s, o;
  return function() {
    var a, n = r(this), l;
    return n == null ? void this.removeAttribute(e) : (a = this.getAttribute(e), l = n + "", a === l ? null : a === i && l === s ? o : (s = l, o = t(i = a, n)));
  };
}
function qb(e, t, r) {
  var i, s, o;
  return function() {
    var a, n = r(this), l;
    return n == null ? void this.removeAttributeNS(e.space, e.local) : (a = this.getAttributeNS(e.space, e.local), l = n + "", a === l ? null : a === i && l === s ? o : (s = l, o = t(i = a, n)));
  };
}
function Nb(e, t) {
  var r = _o(e), i = r === "transform" ? kb : ku;
  return this.attrTween(e, typeof t == "function" ? (r.local ? qb : Rb)(r, i, Xn(this, "attr." + e, t)) : t == null ? (r.local ? Ib : Ob)(r) : (r.local ? Pb : Db)(r, i, t));
}
function Wb(e, t) {
  return function(r) {
    this.setAttribute(e, t.call(this, r));
  };
}
function zb(e, t) {
  return function(r) {
    this.setAttributeNS(e.space, e.local, t.call(this, r));
  };
}
function Hb(e, t) {
  var r, i;
  function s() {
    var o = t.apply(this, arguments);
    return o !== i && (r = (i = o) && zb(e, o)), r;
  }
  return s._value = t, s;
}
function Yb(e, t) {
  var r, i;
  function s() {
    var o = t.apply(this, arguments);
    return o !== i && (r = (i = o) && Wb(e, o)), r;
  }
  return s._value = t, s;
}
function Xb(e, t) {
  var r = "attr." + e;
  if (arguments.length < 2) return (r = this.tween(r)) && r._value;
  if (t == null) return this.tween(r, null);
  if (typeof t != "function") throw new Error();
  var i = _o(e);
  return this.tween(r, (i.local ? Hb : Yb)(i, t));
}
function jb(e, t) {
  return function() {
    Yn(this, e).delay = +t.apply(this, arguments);
  };
}
function Ub(e, t) {
  return t = +t, function() {
    Yn(this, e).delay = t;
  };
}
function Gb(e) {
  var t = this._id;
  return arguments.length ? this.each((typeof e == "function" ? jb : Ub)(t, e)) : ke(this.node(), t).delay;
}
function Vb(e, t) {
  return function() {
    Ie(this, e).duration = +t.apply(this, arguments);
  };
}
function Kb(e, t) {
  return t = +t, function() {
    Ie(this, e).duration = t;
  };
}
function Zb(e) {
  var t = this._id;
  return arguments.length ? this.each((typeof e == "function" ? Vb : Kb)(t, e)) : ke(this.node(), t).duration;
}
function Qb(e, t) {
  if (typeof t != "function") throw new Error();
  return function() {
    Ie(this, e).ease = t;
  };
}
function Jb(e) {
  var t = this._id;
  return arguments.length ? this.each(Qb(t, e)) : ke(this.node(), t).ease;
}
function tk(e, t) {
  return function() {
    var r = t.apply(this, arguments);
    if (typeof r != "function") throw new Error();
    Ie(this, e).ease = r;
  };
}
function ek(e) {
  if (typeof e != "function") throw new Error();
  return this.each(tk(this._id, e));
}
function rk(e) {
  typeof e != "function" && (e = eu(e));
  for (var t = this._groups, r = t.length, i = new Array(r), s = 0; s < r; ++s)
    for (var o = t[s], a = o.length, n = i[s] = [], l, c = 0; c < a; ++c)
      (l = o[c]) && e.call(l, l.__data__, c, o) && n.push(l);
  return new He(i, this._parents, this._name, this._id);
}
function ik(e) {
  if (e._id !== this._id) throw new Error();
  for (var t = this._groups, r = e._groups, i = t.length, s = r.length, o = Math.min(i, s), a = new Array(i), n = 0; n < o; ++n)
    for (var l = t[n], c = r[n], h = l.length, d = a[n] = new Array(h), u, f = 0; f < h; ++f)
      (u = l[f] || c[f]) && (d[f] = u);
  for (; n < i; ++n)
    a[n] = t[n];
  return new He(a, this._parents, this._name, this._id);
}
function sk(e) {
  return (e + "").trim().split(/^|\s+/).every(function(t) {
    var r = t.indexOf(".");
    return r >= 0 && (t = t.slice(0, r)), !t || t === "start";
  });
}
function ok(e, t, r) {
  var i, s, o = sk(t) ? Yn : Ie;
  return function() {
    var a = o(this, e), n = a.on;
    n !== i && (s = (i = n).copy()).on(t, r), a.on = s;
  };
}
function ak(e, t) {
  var r = this._id;
  return arguments.length < 2 ? ke(this.node(), r).on.on(e) : this.each(ok(r, e, t));
}
function nk(e) {
  return function() {
    var t = this.parentNode;
    for (var r in this.__transition) if (+r !== e) return;
    t && t.removeChild(this);
  };
}
function lk() {
  return this.on("end.remove", nk(this._id));
}
function hk(e) {
  var t = this._name, r = this._id;
  typeof e != "function" && (e = qn(e));
  for (var i = this._groups, s = i.length, o = new Array(s), a = 0; a < s; ++a)
    for (var n = i[a], l = n.length, c = o[a] = new Array(l), h, d, u = 0; u < l; ++u)
      (h = n[u]) && (d = e.call(h, h.__data__, u, n)) && ("__data__" in h && (d.__data__ = h.__data__), c[u] = d, Lo(c[u], t, r, u, c, ke(h, r)));
  return new He(o, this._parents, t, r);
}
function ck(e) {
  var t = this._name, r = this._id;
  typeof e != "function" && (e = tu(e));
  for (var i = this._groups, s = i.length, o = [], a = [], n = 0; n < s; ++n)
    for (var l = i[n], c = l.length, h, d = 0; d < c; ++d)
      if (h = l[d]) {
        for (var u = e.call(h, h.__data__, d, l), f, y = ke(h, r), m = 0, x = u.length; m < x; ++m)
          (f = u[m]) && Lo(f, t, r, m, u, y);
        o.push(u), a.push(h);
      }
  return new He(o, a, t, r);
}
var dk = ps.prototype.constructor;
function uk() {
  return new dk(this._groups, this._parents);
}
function fk(e, t) {
  var r, i, s;
  return function() {
    var o = ci(this, e), a = (this.style.removeProperty(e), ci(this, e));
    return o === a ? null : o === r && a === i ? s : s = t(r = o, i = a);
  };
}
function wu(e) {
  return function() {
    this.style.removeProperty(e);
  };
}
function pk(e, t, r) {
  var i, s = r + "", o;
  return function() {
    var a = ci(this, e);
    return a === s ? null : a === i ? o : o = t(i = a, r);
  };
}
function gk(e, t, r) {
  var i, s, o;
  return function() {
    var a = ci(this, e), n = r(this), l = n + "";
    return n == null && (l = n = (this.style.removeProperty(e), ci(this, e))), a === l ? null : a === i && l === s ? o : (s = l, o = t(i = a, n));
  };
}
function yk(e, t) {
  var r, i, s, o = "style." + t, a = "end." + o, n;
  return function() {
    var l = Ie(this, e), c = l.on, h = l.value[o] == null ? n || (n = wu(t)) : void 0;
    (c !== r || s !== h) && (i = (r = c).copy()).on(a, s = h), l.on = i;
  };
}
function mk(e, t, r) {
  var i = (e += "") == "transform" ? bb : ku;
  return t == null ? this.styleTween(e, fk(e, i)).on("end.style." + e, wu(e)) : typeof t == "function" ? this.styleTween(e, gk(e, i, Xn(this, "style." + e, t))).each(yk(this._id, e)) : this.styleTween(e, pk(e, i, t), r).on("end.style." + e, null);
}
function xk(e, t, r) {
  return function(i) {
    this.style.setProperty(e, t.call(this, i), r);
  };
}
function Ck(e, t, r) {
  var i, s;
  function o() {
    var a = t.apply(this, arguments);
    return a !== s && (i = (s = a) && xk(e, a, r)), i;
  }
  return o._value = t, o;
}
function bk(e, t, r) {
  var i = "style." + (e += "");
  if (arguments.length < 2) return (i = this.tween(i)) && i._value;
  if (t == null) return this.tween(i, null);
  if (typeof t != "function") throw new Error();
  return this.tween(i, Ck(e, t, r ?? ""));
}
function kk(e) {
  return function() {
    this.textContent = e;
  };
}
function wk(e) {
  return function() {
    var t = e(this);
    this.textContent = t ?? "";
  };
}
function Sk(e) {
  return this.tween("text", typeof e == "function" ? wk(Xn(this, "text", e)) : kk(e == null ? "" : e + ""));
}
function Tk(e) {
  return function(t) {
    this.textContent = e.call(this, t);
  };
}
function Bk(e) {
  var t, r;
  function i() {
    var s = e.apply(this, arguments);
    return s !== r && (t = (r = s) && Tk(s)), t;
  }
  return i._value = e, i;
}
function _k(e) {
  var t = "text";
  if (arguments.length < 1) return (t = this.tween(t)) && t._value;
  if (e == null) return this.tween(t, null);
  if (typeof e != "function") throw new Error();
  return this.tween(t, Bk(e));
}
function vk() {
  for (var e = this._name, t = this._id, r = Su(), i = this._groups, s = i.length, o = 0; o < s; ++o)
    for (var a = i[o], n = a.length, l, c = 0; c < n; ++c)
      if (l = a[c]) {
        var h = ke(l, t);
        Lo(l, e, r, c, a, {
          time: h.time + h.delay + h.duration,
          delay: 0,
          duration: h.duration,
          ease: h.ease
        });
      }
  return new He(i, this._parents, e, r);
}
function Lk() {
  var e, t, r = this, i = r._id, s = r.size();
  return new Promise(function(o, a) {
    var n = { value: a }, l = { value: function() {
      --s === 0 && o();
    } };
    r.each(function() {
      var c = Ie(this, i), h = c.on;
      h !== e && (t = (e = h).copy(), t._.cancel.push(n), t._.interrupt.push(n), t._.end.push(l)), c.on = t;
    }), s === 0 && o();
  });
}
var Fk = 0;
function He(e, t, r, i) {
  this._groups = e, this._parents = t, this._name = r, this._id = i;
}
function Su() {
  return ++Fk;
}
var qe = ps.prototype;
He.prototype = {
  constructor: He,
  select: hk,
  selectAll: ck,
  selectChild: qe.selectChild,
  selectChildren: qe.selectChildren,
  filter: rk,
  merge: ik,
  selection: uk,
  transition: vk,
  call: qe.call,
  nodes: qe.nodes,
  node: qe.node,
  size: qe.size,
  empty: qe.empty,
  each: qe.each,
  on: ak,
  attr: Nb,
  attrTween: Xb,
  style: mk,
  styleTween: bk,
  text: Sk,
  textTween: _k,
  remove: lk,
  tween: $b,
  delay: Gb,
  duration: Zb,
  ease: Jb,
  easeVarying: ek,
  end: Lk,
  [Symbol.iterator]: qe[Symbol.iterator]
};
function Ak(e) {
  return ((e *= 2) <= 1 ? e * e * e : (e -= 2) * e * e + 2) / 2;
}
var Ek = {
  time: null,
  // Set on use.
  delay: 0,
  duration: 250,
  ease: Ak
};
function Mk(e, t) {
  for (var r; !(r = e.__transition) || !(r = r[t]); )
    if (!(e = e.parentNode))
      throw new Error(`transition ${t} not found`);
  return r;
}
function $k(e) {
  var t, r;
  e instanceof He ? (t = e._id, e = e._name) : (t = Su(), (r = Ek).time = Hn(), e = e == null ? null : e + "");
  for (var i = this._groups, s = i.length, o = 0; o < s; ++o)
    for (var a = i[o], n = a.length, l, c = 0; c < n; ++c)
      (l = a[c]) && Lo(l, e, t, c, a, r || Mk(l, t));
  return new He(i, this._parents, e, t);
}
ps.prototype.interrupt = Ab;
ps.prototype.transition = $k;
const Qa = Math.PI, Ja = 2 * Qa, lr = 1e-6, Ok = Ja - lr;
function Tu(e) {
  this._ += e[0];
  for (let t = 1, r = e.length; t < r; ++t)
    this._ += arguments[t] + e[t];
}
function Ik(e) {
  let t = Math.floor(e);
  if (!(t >= 0)) throw new Error(`invalid digits: ${e}`);
  if (t > 15) return Tu;
  const r = 10 ** t;
  return function(i) {
    this._ += i[0];
    for (let s = 1, o = i.length; s < o; ++s)
      this._ += Math.round(arguments[s] * r) / r + i[s];
  };
}
class Dk {
  constructor(t) {
    this._x0 = this._y0 = // start of current subpath
    this._x1 = this._y1 = null, this._ = "", this._append = t == null ? Tu : Ik(t);
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
    let a = this._x1, n = this._y1, l = i - t, c = s - r, h = a - t, d = n - r, u = h * h + d * d;
    if (this._x1 === null)
      this._append`M${this._x1 = t},${this._y1 = r}`;
    else if (u > lr) if (!(Math.abs(d * l - c * h) > lr) || !o)
      this._append`L${this._x1 = t},${this._y1 = r}`;
    else {
      let f = i - a, y = s - n, m = l * l + c * c, x = f * f + y * y, C = Math.sqrt(m), b = Math.sqrt(u), w = o * Math.tan((Qa - Math.acos((m + u - x) / (2 * C * b))) / 2), T = w / b, B = w / C;
      Math.abs(T - 1) > lr && this._append`L${t + T * h},${r + T * d}`, this._append`A${o},${o},0,0,${+(d * f > h * y)},${this._x1 = t + B * l},${this._y1 = r + B * c}`;
    }
  }
  arc(t, r, i, s, o, a) {
    if (t = +t, r = +r, i = +i, a = !!a, i < 0) throw new Error(`negative radius: ${i}`);
    let n = i * Math.cos(s), l = i * Math.sin(s), c = t + n, h = r + l, d = 1 ^ a, u = a ? s - o : o - s;
    this._x1 === null ? this._append`M${c},${h}` : (Math.abs(this._x1 - c) > lr || Math.abs(this._y1 - h) > lr) && this._append`L${c},${h}`, i && (u < 0 && (u = u % Ja + Ja), u > Ok ? this._append`A${i},${i},0,1,${d},${t - n},${r - l}A${i},${i},0,1,${d},${this._x1 = c},${this._y1 = h}` : u > lr && this._append`A${i},${i},0,${+(u >= Qa)},${d},${this._x1 = t + i * Math.cos(o)},${this._y1 = r + i * Math.sin(o)}`);
  }
  rect(t, r, i, s) {
    this._append`M${this._x0 = this._x1 = +t},${this._y0 = this._y1 = +r}h${i = +i}v${+s}h${-i}Z`;
  }
  toString() {
    return this._;
  }
}
function Or(e) {
  return function() {
    return e;
  };
}
const pF = Math.abs, gF = Math.atan2, yF = Math.cos, mF = Math.max, xF = Math.min, CF = Math.sin, bF = Math.sqrt, Bh = 1e-12, jn = Math.PI, _h = jn / 2, kF = 2 * jn;
function wF(e) {
  return e > 1 ? 0 : e < -1 ? jn : Math.acos(e);
}
function SF(e) {
  return e >= 1 ? _h : e <= -1 ? -_h : Math.asin(e);
}
function Pk(e) {
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
  }, () => new Dk(t);
}
function Rk(e) {
  return typeof e == "object" && "length" in e ? e : Array.from(e);
}
function Bu(e) {
  this._context = e;
}
Bu.prototype = {
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
function Zi(e) {
  return new Bu(e);
}
function qk(e) {
  return e[0];
}
function Nk(e) {
  return e[1];
}
function Wk(e, t) {
  var r = Or(!0), i = null, s = Zi, o = null, a = Pk(n);
  e = typeof e == "function" ? e : e === void 0 ? qk : Or(e), t = typeof t == "function" ? t : t === void 0 ? Nk : Or(t);
  function n(l) {
    var c, h = (l = Rk(l)).length, d, u = !1, f;
    for (i == null && (o = s(f = a())), c = 0; c <= h; ++c)
      !(c < h && r(d = l[c], c, l)) === u && ((u = !u) ? o.lineStart() : o.lineEnd()), u && o.point(+e(d, c, l), +t(d, c, l));
    if (f) return o = null, f + "" || null;
  }
  return n.x = function(l) {
    return arguments.length ? (e = typeof l == "function" ? l : Or(+l), n) : e;
  }, n.y = function(l) {
    return arguments.length ? (t = typeof l == "function" ? l : Or(+l), n) : t;
  }, n.defined = function(l) {
    return arguments.length ? (r = typeof l == "function" ? l : Or(!!l), n) : r;
  }, n.curve = function(l) {
    return arguments.length ? (s = l, i != null && (o = s(i)), n) : s;
  }, n.context = function(l) {
    return arguments.length ? (l == null ? i = o = null : o = s(i = l), n) : i;
  }, n;
}
class _u {
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
function vu(e) {
  return new _u(e, !0);
}
function Lu(e) {
  return new _u(e, !1);
}
function tr() {
}
function no(e, t, r) {
  e._context.bezierCurveTo(
    (2 * e._x0 + e._x1) / 3,
    (2 * e._y0 + e._y1) / 3,
    (e._x0 + 2 * e._x1) / 3,
    (e._y0 + 2 * e._y1) / 3,
    (e._x0 + 4 * e._x1 + t) / 6,
    (e._y0 + 4 * e._y1 + r) / 6
  );
}
function Fo(e) {
  this._context = e;
}
Fo.prototype = {
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
        no(this, this._x1, this._y1);
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
        no(this, e, t);
        break;
    }
    this._x0 = this._x1, this._x1 = e, this._y0 = this._y1, this._y1 = t;
  }
};
function tn(e) {
  return new Fo(e);
}
function Fu(e) {
  this._context = e;
}
Fu.prototype = {
  areaStart: tr,
  areaEnd: tr,
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
        no(this, e, t);
        break;
    }
    this._x0 = this._x1, this._x1 = e, this._y0 = this._y1, this._y1 = t;
  }
};
function zk(e) {
  return new Fu(e);
}
function Au(e) {
  this._context = e;
}
Au.prototype = {
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
        no(this, e, t);
        break;
    }
    this._x0 = this._x1, this._x1 = e, this._y0 = this._y1, this._y1 = t;
  }
};
function Hk(e) {
  return new Au(e);
}
function Eu(e, t) {
  this._basis = new Fo(e), this._beta = t;
}
Eu.prototype = {
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
const Yk = (function e(t) {
  function r(i) {
    return t === 1 ? new Fo(i) : new Eu(i, t);
  }
  return r.beta = function(i) {
    return e(+i);
  }, r;
})(0.85);
function lo(e, t, r) {
  e._context.bezierCurveTo(
    e._x1 + e._k * (e._x2 - e._x0),
    e._y1 + e._k * (e._y2 - e._y0),
    e._x2 + e._k * (e._x1 - t),
    e._y2 + e._k * (e._y1 - r),
    e._x2,
    e._y2
  );
}
function Un(e, t) {
  this._context = e, this._k = (1 - t) / 6;
}
Un.prototype = {
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
        lo(this, this._x1, this._y1);
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
        lo(this, e, t);
        break;
    }
    this._x0 = this._x1, this._x1 = this._x2, this._x2 = e, this._y0 = this._y1, this._y1 = this._y2, this._y2 = t;
  }
};
const Mu = (function e(t) {
  function r(i) {
    return new Un(i, t);
  }
  return r.tension = function(i) {
    return e(+i);
  }, r;
})(0);
function Gn(e, t) {
  this._context = e, this._k = (1 - t) / 6;
}
Gn.prototype = {
  areaStart: tr,
  areaEnd: tr,
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
        lo(this, e, t);
        break;
    }
    this._x0 = this._x1, this._x1 = this._x2, this._x2 = e, this._y0 = this._y1, this._y1 = this._y2, this._y2 = t;
  }
};
const Xk = (function e(t) {
  function r(i) {
    return new Gn(i, t);
  }
  return r.tension = function(i) {
    return e(+i);
  }, r;
})(0);
function Vn(e, t) {
  this._context = e, this._k = (1 - t) / 6;
}
Vn.prototype = {
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
        lo(this, e, t);
        break;
    }
    this._x0 = this._x1, this._x1 = this._x2, this._x2 = e, this._y0 = this._y1, this._y1 = this._y2, this._y2 = t;
  }
};
const jk = (function e(t) {
  function r(i) {
    return new Vn(i, t);
  }
  return r.tension = function(i) {
    return e(+i);
  }, r;
})(0);
function Kn(e, t, r) {
  var i = e._x1, s = e._y1, o = e._x2, a = e._y2;
  if (e._l01_a > Bh) {
    var n = 2 * e._l01_2a + 3 * e._l01_a * e._l12_a + e._l12_2a, l = 3 * e._l01_a * (e._l01_a + e._l12_a);
    i = (i * n - e._x0 * e._l12_2a + e._x2 * e._l01_2a) / l, s = (s * n - e._y0 * e._l12_2a + e._y2 * e._l01_2a) / l;
  }
  if (e._l23_a > Bh) {
    var c = 2 * e._l23_2a + 3 * e._l23_a * e._l12_a + e._l12_2a, h = 3 * e._l23_a * (e._l23_a + e._l12_a);
    o = (o * c + e._x1 * e._l23_2a - t * e._l12_2a) / h, a = (a * c + e._y1 * e._l23_2a - r * e._l12_2a) / h;
  }
  e._context.bezierCurveTo(i, s, o, a, e._x2, e._y2);
}
function $u(e, t) {
  this._context = e, this._alpha = t;
}
$u.prototype = {
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
        Kn(this, e, t);
        break;
    }
    this._l01_a = this._l12_a, this._l12_a = this._l23_a, this._l01_2a = this._l12_2a, this._l12_2a = this._l23_2a, this._x0 = this._x1, this._x1 = this._x2, this._x2 = e, this._y0 = this._y1, this._y1 = this._y2, this._y2 = t;
  }
};
const Ou = (function e(t) {
  function r(i) {
    return t ? new $u(i, t) : new Un(i, 0);
  }
  return r.alpha = function(i) {
    return e(+i);
  }, r;
})(0.5);
function Iu(e, t) {
  this._context = e, this._alpha = t;
}
Iu.prototype = {
  areaStart: tr,
  areaEnd: tr,
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
        Kn(this, e, t);
        break;
    }
    this._l01_a = this._l12_a, this._l12_a = this._l23_a, this._l01_2a = this._l12_2a, this._l12_2a = this._l23_2a, this._x0 = this._x1, this._x1 = this._x2, this._x2 = e, this._y0 = this._y1, this._y1 = this._y2, this._y2 = t;
  }
};
const Uk = (function e(t) {
  function r(i) {
    return t ? new Iu(i, t) : new Gn(i, 0);
  }
  return r.alpha = function(i) {
    return e(+i);
  }, r;
})(0.5);
function Du(e, t) {
  this._context = e, this._alpha = t;
}
Du.prototype = {
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
        Kn(this, e, t);
        break;
    }
    this._l01_a = this._l12_a, this._l12_a = this._l23_a, this._l01_2a = this._l12_2a, this._l12_2a = this._l23_2a, this._x0 = this._x1, this._x1 = this._x2, this._x2 = e, this._y0 = this._y1, this._y1 = this._y2, this._y2 = t;
  }
};
const Gk = (function e(t) {
  function r(i) {
    return t ? new Du(i, t) : new Vn(i, 0);
  }
  return r.alpha = function(i) {
    return e(+i);
  }, r;
})(0.5);
function Pu(e) {
  this._context = e;
}
Pu.prototype = {
  areaStart: tr,
  areaEnd: tr,
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
function Vk(e) {
  return new Pu(e);
}
function vh(e) {
  return e < 0 ? -1 : 1;
}
function Lh(e, t, r) {
  var i = e._x1 - e._x0, s = t - e._x1, o = (e._y1 - e._y0) / (i || s < 0 && -0), a = (r - e._y1) / (s || i < 0 && -0), n = (o * s + a * i) / (i + s);
  return (vh(o) + vh(a)) * Math.min(Math.abs(o), Math.abs(a), 0.5 * Math.abs(n)) || 0;
}
function Fh(e, t) {
  var r = e._x1 - e._x0;
  return r ? (3 * (e._y1 - e._y0) / r - t) / 2 : t;
}
function Vo(e, t, r) {
  var i = e._x0, s = e._y0, o = e._x1, a = e._y1, n = (o - i) / 3;
  e._context.bezierCurveTo(i + n, s + n * t, o - n, a - n * r, o, a);
}
function ho(e) {
  this._context = e;
}
ho.prototype = {
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
        Vo(this, this._t0, Fh(this, this._t0));
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
          this._point = 3, Vo(this, Fh(this, r = Lh(this, e, t)), r);
          break;
        default:
          Vo(this, this._t0, r = Lh(this, e, t));
          break;
      }
      this._x0 = this._x1, this._x1 = e, this._y0 = this._y1, this._y1 = t, this._t0 = r;
    }
  }
};
function Ru(e) {
  this._context = new qu(e);
}
(Ru.prototype = Object.create(ho.prototype)).point = function(e, t) {
  ho.prototype.point.call(this, t, e);
};
function qu(e) {
  this._context = e;
}
qu.prototype = {
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
function Nu(e) {
  return new ho(e);
}
function Wu(e) {
  return new Ru(e);
}
function zu(e) {
  this._context = e;
}
zu.prototype = {
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
        for (var i = Ah(e), s = Ah(t), o = 0, a = 1; a < r; ++o, ++a)
          this._context.bezierCurveTo(i[0][o], s[0][o], i[1][o], s[1][o], e[a], t[a]);
    (this._line || this._line !== 0 && r === 1) && this._context.closePath(), this._line = 1 - this._line, this._x = this._y = null;
  },
  point: function(e, t) {
    this._x.push(+e), this._y.push(+t);
  }
};
function Ah(e) {
  var t, r = e.length - 1, i, s = new Array(r), o = new Array(r), a = new Array(r);
  for (s[0] = 0, o[0] = 2, a[0] = e[0] + 2 * e[1], t = 1; t < r - 1; ++t) s[t] = 1, o[t] = 4, a[t] = 4 * e[t] + 2 * e[t + 1];
  for (s[r - 1] = 2, o[r - 1] = 7, a[r - 1] = 8 * e[r - 1] + e[r], t = 1; t < r; ++t) i = s[t] / o[t - 1], o[t] -= i, a[t] -= i * a[t - 1];
  for (s[r - 1] = a[r - 1] / o[r - 1], t = r - 2; t >= 0; --t) s[t] = (a[t] - s[t + 1]) / o[t];
  for (o[r - 1] = (e[r] + s[r - 1]) / 2, t = 0; t < r - 1; ++t) o[t] = 2 * e[t + 1] - s[t + 1];
  return [s, o];
}
function Hu(e) {
  return new zu(e);
}
function Ao(e, t) {
  this._context = e, this._t = t;
}
Ao.prototype = {
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
function Yu(e) {
  return new Ao(e, 0.5);
}
function Xu(e) {
  return new Ao(e, 0);
}
function ju(e) {
  return new Ao(e, 1);
}
function Wi(e, t, r) {
  this.k = e, this.x = t, this.y = r;
}
Wi.prototype = {
  constructor: Wi,
  scale: function(e) {
    return e === 1 ? this : new Wi(this.k * e, this.x, this.y);
  },
  translate: function(e, t) {
    return e === 0 & t === 0 ? this : new Wi(this.k, this.x + this.k * e, this.y + this.k * t);
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
Wi.prototype;
var Kk = /* @__PURE__ */ p((e) => {
  const { securityLevel: t } = Bt();
  let r = xt("body");
  if (t === "sandbox") {
    const o = xt(`#i${e}`).node()?.contentDocument ?? document;
    r = xt(o.body);
  }
  return r.select(`#${e}`);
}, "selectSvgElement"), Zk = /* @__PURE__ */ p((e) => {
  const { handDrawnSeed: t } = Bt();
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
}, "solidStateFill"), Qk = /* @__PURE__ */ p((e) => Array.isArray(e) ? e : e ? e.split(";").map((t) => t.trim()).filter(Boolean) : [], "normalizeStyleList"), yi = /* @__PURE__ */ p((e) => {
  const t = Jk([
    ...e.cssCompiledStyles || [],
    ...e.cssStyles || [],
    ...Qk(e.labelStyle)
  ]);
  return { stylesMap: t, stylesArray: [...t] };
}, "compileStyles"), Jk = /* @__PURE__ */ p((e) => {
  const t = /* @__PURE__ */ new Map();
  return e.forEach((r) => {
    const [i, s] = r.split(":");
    t.set(i.trim(), s?.trim());
  }), t;
}, "styles2Map"), Uu = /* @__PURE__ */ p((e) => e === "color" || e === "font-size" || e === "font-family" || e === "font-weight" || e === "font-style" || e === "text-decoration" || e === "text-align" || e === "text-transform" || e === "line-height" || e === "letter-spacing" || e === "word-spacing" || e === "text-shadow" || e === "text-overflow" || e === "white-space" || e === "word-wrap" || e === "word-break" || e === "overflow-wrap" || e === "hyphens", "isLabelStyle"), ot = /* @__PURE__ */ p((e) => {
  const { stylesArray: t } = yi(e), r = [], i = [], s = [], o = [];
  return t.forEach((a) => {
    const n = a[0];
    Uu(n) ? r.push(a.join(":") + " !important") : (i.push(a.join(":") + " !important"), n.includes("stroke") && s.push(a.join(":") + " !important"), n === "fill" && o.push(a.join(":") + " !important"));
  }), {
    labelStyles: r.join(";"),
    nodeStyles: i.join(";"),
    stylesArray: t,
    borderStyles: s,
    backgroundStyles: o
  };
}, "styles2String"), et = /* @__PURE__ */ p((e, t) => {
  const { themeVariables: r, handDrawnSeed: i } = Bt(), { nodeBorder: s, mainBkg: o } = r, { stylesMap: a } = yi(e);
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
      strokeLineDash: t1(a.get("stroke-dasharray"))
    },
    t
  );
}, "userNodeOverrides"), t1 = /* @__PURE__ */ p((e) => {
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
const e1 = Object.freeze({
  left: 0,
  top: 0,
  width: 16,
  height: 16
}), co = Object.freeze({
  rotate: 0,
  vFlip: !1,
  hFlip: !1
}), Gu = Object.freeze({
  ...e1,
  ...co
}), r1 = Object.freeze({
  ...Gu,
  body: "",
  hidden: !1
}), i1 = Object.freeze({
  width: null,
  height: null
}), s1 = Object.freeze({
  ...i1,
  ...co
}), o1 = (e, t, r, i = "") => {
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
    return Ko(c) ? c : null;
  }
  const o = s[0], a = o.split("-");
  if (a.length > 1) {
    const n = {
      provider: i,
      prefix: a.shift(),
      name: a.join("-")
    };
    return Ko(n) ? n : null;
  }
  if (r && i === "") {
    const n = {
      provider: i,
      prefix: "",
      name: o
    };
    return Ko(n, r) ? n : null;
  }
  return null;
}, Ko = (e, t) => e ? !!((t && e.prefix === "" || e.prefix) && e.name) : !1;
function a1(e, t) {
  const r = {};
  !e.hFlip != !t.hFlip && (r.hFlip = !0), !e.vFlip != !t.vFlip && (r.vFlip = !0);
  const i = ((e.rotate || 0) + (t.rotate || 0)) % 4;
  return i && (r.rotate = i), r;
}
function Eh(e, t) {
  const r = a1(e, t);
  for (const i in r1) i in co ? i in e && !(i in r) && (r[i] = co[i]) : i in t ? r[i] = t[i] : i in e && (r[i] = e[i]);
  return r;
}
function n1(e, t) {
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
function Mh(e, t, r) {
  const i = e.icons, s = e.aliases || /* @__PURE__ */ Object.create(null);
  let o = {};
  function a(n) {
    o = Eh(i[n] || s[n], o);
  }
  return a(t), r.forEach(a), Eh(e, o);
}
function l1(e, t) {
  if (e.icons[t]) return Mh(e, t, []);
  const r = n1(e, [t])[t];
  return r ? Mh(e, t, r) : null;
}
const h1 = /(-?[0-9.]*[0-9]+[0-9.]*)/g, c1 = /^-?[0-9.]*[0-9]+[0-9.]*$/g;
function $h(e, t, r) {
  if (t === 1) return e;
  if (r = r || 100, typeof e == "number") return Math.ceil(e * t * r) / r;
  if (typeof e != "string") return e;
  const i = e.split(h1);
  if (i === null || !i.length) return e;
  const s = [];
  let o = i.shift(), a = c1.test(o);
  for (; ; ) {
    if (a) {
      const n = parseFloat(o);
      isNaN(n) ? s.push(o) : s.push(Math.ceil(n * t * r) / r);
    } else s.push(o);
    if (o = i.shift(), o === void 0) return s.join("");
    a = !a;
  }
}
function d1(e, t = "defs") {
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
function u1(e, t) {
  return e ? "<defs>" + e + "</defs>" + t : t;
}
function f1(e, t, r) {
  const i = d1(e);
  return u1(i.defs, t + i.content + r);
}
const p1 = (e) => e === "unset" || e === "undefined" || e === "none";
function g1(e, t) {
  const r = {
    ...Gu,
    ...e
  }, i = {
    ...s1,
    ...t
  }, s = {
    left: r.left,
    top: r.top,
    width: r.width,
    height: r.height
  };
  let o = r.body;
  [r, i].forEach((m) => {
    const x = [], C = m.hFlip, b = m.vFlip;
    let w = m.rotate;
    C ? b ? w += 2 : (x.push("translate(" + (s.width + s.left).toString() + " " + (0 - s.top).toString() + ")"), x.push("scale(-1 1)"), s.top = s.left = 0) : b && (x.push("translate(" + (0 - s.left).toString() + " " + (s.height + s.top).toString() + ")"), x.push("scale(1 -1)"), s.top = s.left = 0);
    let T;
    switch (w < 0 && (w -= Math.floor(w / 4) * 4), w = w % 4, w) {
      case 1:
        T = s.height / 2 + s.top, x.unshift("rotate(90 " + T.toString() + " " + T.toString() + ")");
        break;
      case 2:
        x.unshift("rotate(180 " + (s.width / 2 + s.left).toString() + " " + (s.height / 2 + s.top).toString() + ")");
        break;
      case 3:
        T = s.width / 2 + s.left, x.unshift("rotate(-90 " + T.toString() + " " + T.toString() + ")");
    }
    w % 2 === 1 && (s.left !== s.top && (T = s.left, s.left = s.top, s.top = T), s.width !== s.height && (T = s.width, s.width = s.height, s.height = T)), x.length && (o = f1(o, '<g transform="' + x.join(" ") + '">', "</g>"));
  });
  const a = i.width, n = i.height, l = s.width, c = s.height;
  let h, d;
  a === null ? (d = n === null ? "1em" : n === "auto" ? c : n, h = $h(d, l / c)) : (h = a === "auto" ? l : a, d = n === null ? $h(h, c / l) : n === "auto" ? c : n);
  const u = {}, f = (m, x) => {
    p1(x) || (u[m] = x.toString());
  };
  f("width", h), f("height", d);
  const y = [
    s.left,
    s.top,
    l,
    c
  ];
  return u.viewBox = y.join(" "), {
    attributes: u,
    viewBox: y,
    body: o
  };
}
const y1 = /\sid="(\S+)"/g, Oh = /* @__PURE__ */ new Map();
function m1(e) {
  e = e.replace(/[0-9]+$/, "") || "a";
  const t = Oh.get(e) || 0;
  return Oh.set(e, t + 1), t ? `${e}${t}` : e;
}
function x1(e) {
  const t = [];
  let r;
  for (; r = y1.exec(e); ) t.push(r[1]);
  if (!t.length) return e;
  const i = "suffix" + (Math.random() * 16777216 | Date.now()).toString(16);
  return t.forEach((s) => {
    const o = m1(s), a = s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    e = e.replace(new RegExp('([#;"])(' + a + ')([")]|\\.[a-z])', "g"), "$1" + o + i + "$3");
  }), e = e.replace(new RegExp(i, "g"), ""), e;
}
function C1(e, t) {
  let r = e.indexOf("xlink:") === -1 ? "" : ' xmlns:xlink="http://www.w3.org/1999/xlink"';
  for (const i in t) r += " " + i + '="' + t[i] + '"';
  return '<svg xmlns="http://www.w3.org/2000/svg"' + r + ">" + e + "</svg>";
}
var b1 = {
  body: '<g><rect width="80" height="80" style="fill: #087ebf; stroke-width: 0px;"/><text transform="translate(21.16 64.67)" style="fill: #fff; font-family: ArialMT, Arial; font-size: 67.75px;"><tspan x="0" y="0">?</tspan></text></g>',
  height: 80,
  width: 80
}, en = /* @__PURE__ */ new Map(), Vu = /* @__PURE__ */ new Map(), k1 = /* @__PURE__ */ p((e) => {
  for (const t of e) {
    if (!t.name)
      throw new Error(
        'Invalid icon loader. Must have a "name" property with non-empty string value.'
      );
    if (M.debug("Registering icon pack:", t.name), "loader" in t)
      Vu.set(t.name, t.loader);
    else if ("icons" in t)
      en.set(t.name, t.icons);
    else
      throw M.error("Invalid icon loader:", t), new Error('Invalid icon loader. Must have either "icons" or "loader" property.');
  }
}, "registerIconPacks"), Ku = /* @__PURE__ */ p(async (e, t) => {
  const r = o1(e, !0, t !== void 0);
  if (!r)
    throw new Error(`Invalid icon name: ${e}`);
  const i = r.prefix || t;
  if (!i)
    throw new Error(`Icon name must contain a prefix: ${e}`);
  let s = en.get(i);
  if (!s) {
    const a = Vu.get(i);
    if (!a)
      throw new Error(`Icon set not found: ${r.prefix}`);
    try {
      s = { ...await a(), prefix: i }, en.set(i, s);
    } catch (n) {
      throw M.error(n), new Error(`Failed to load icon set: ${r.prefix}`);
    }
  }
  const o = l1(s, r.name);
  if (!o)
    throw new Error(`Icon not found: ${e}`);
  return o;
}, "getRegisteredIconData"), w1 = /* @__PURE__ */ p(async (e) => {
  try {
    return await Ku(e), !0;
  } catch {
    return !1;
  }
}, "isIconAvailable"), ys = /* @__PURE__ */ p(async (e, t, r) => {
  let i;
  try {
    i = await Ku(e, t?.fallbackPrefix);
  } catch (a) {
    M.error(a), i = b1;
  }
  const s = g1(i, t), o = C1(x1(s.body), {
    ...s.attributes,
    ...r
  });
  return he(o, Dt());
}, "getIconSVG"), vs = {}, zt = {}, Ih;
function S1() {
  return Ih || (Ih = 1, Object.defineProperty(zt, "__esModule", { value: !0 }), zt.BLANK_URL = zt.relativeFirstCharacters = zt.whitespaceEscapeCharsRegex = zt.urlSchemeRegex = zt.ctrlCharactersRegex = zt.htmlCtrlEntityRegex = zt.htmlEntitiesRegex = zt.invalidProtocolRegex = void 0, zt.invalidProtocolRegex = /^([^\w]*)(javascript|data|vbscript)/im, zt.htmlEntitiesRegex = /&#(\w+)(^\w|;)?/g, zt.htmlCtrlEntityRegex = /&(newline|tab);/gi, zt.ctrlCharactersRegex = /[\u0000-\u001F\u007F-\u009F\u2000-\u200D\uFEFF]/gim, zt.urlSchemeRegex = /^.+(:|&colon;)/gim, zt.whitespaceEscapeCharsRegex = /(\\|%5[cC])((%(6[eE]|72|74))|[nrt])/g, zt.relativeFirstCharacters = [".", "/"], zt.BLANK_URL = "about:blank"), zt;
}
var Dh;
function T1() {
  if (Dh) return vs;
  Dh = 1, Object.defineProperty(vs, "__esModule", { value: !0 }), vs.sanitizeUrl = o;
  var e = S1();
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
    var h = c.trimStart(), d = h.match(e.urlSchemeRegex);
    if (!d)
      return c;
    var u = d[0].toLowerCase().trim();
    if (e.invalidProtocolRegex.test(u))
      return e.BLANK_URL;
    var f = h.replace(/\\/g, "/");
    if (u === "mailto:" || u.includes("://"))
      return f;
    if (u === "http:" || u === "https:") {
      if (!i(f))
        return e.BLANK_URL;
      var y = new URL(f);
      return y.protocol = y.protocol.toLowerCase(), y.hostname = y.hostname.toLowerCase(), y.toString();
    }
    return f;
  }
  return vs;
}
var B1 = T1();
function Zo(e) {
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
function _1() {
}
function Zu(e) {
  return Object.getOwnPropertySymbols(e).filter((t) => Object.prototype.propertyIsEnumerable.call(e, t));
}
function Zn(e) {
  return e == null ? e === void 0 ? "[object Undefined]" : "[object Null]" : Object.prototype.toString.call(e);
}
const v1 = "[object RegExp]", Qu = "[object String]", Ju = "[object Number]", tf = "[object Boolean]", ef = "[object Arguments]", L1 = "[object Symbol]", F1 = "[object Date]", A1 = "[object Map]", E1 = "[object Set]", M1 = "[object Array]", $1 = "[object ArrayBuffer]", O1 = "[object Object]", I1 = "[object DataView]", D1 = "[object Uint8Array]", P1 = "[object Uint8ClampedArray]", R1 = "[object Uint16Array]", q1 = "[object Uint32Array]", N1 = "[object Int8Array]", W1 = "[object Int16Array]", z1 = "[object Int32Array]", H1 = "[object Float32Array]", Y1 = "[object Float64Array]", Ph = typeof globalThis == "object" && globalThis || typeof window == "object" && window || typeof self == "object" && self || typeof global == "object" && global || /* @__PURE__ */ (function() {
  return this;
})();
function Qn(e) {
  return typeof Ph.Buffer < "u" && Ph.Buffer.isBuffer(e);
}
function X1(e) {
  return Number.isSafeInteger(e) && e >= 0;
}
function rf(e) {
  return e != null && typeof e != "function" && X1(e.length);
}
function j1(e) {
  return e === "__proto__";
}
function Jn(e) {
  return e == null || typeof e != "object" && typeof e != "function";
}
function tl(e) {
  return ArrayBuffer.isView(e) && !(e instanceof DataView);
}
function U1(e, t) {
  return zr(e, void 0, e, /* @__PURE__ */ new Map(), t);
}
function zr(e, t, r, i = /* @__PURE__ */ new Map(), s = void 0) {
  const o = s?.(e, t, r, i);
  if (o !== void 0) return o;
  if (Jn(e)) return e;
  if (i.has(e)) return i.get(e);
  if (Array.isArray(e)) {
    const a = new Array(e.length);
    i.set(e, a);
    for (let n = 0; n < e.length; n++) a[n] = zr(e[n], n, r, i, s);
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
    for (const [n, l] of e) a.set(n, zr(l, n, r, i, s));
    return a;
  }
  if (e instanceof Set) {
    const a = /* @__PURE__ */ new Set();
    i.set(e, a);
    for (const n of e) a.add(zr(n, void 0, r, i, s));
    return a;
  }
  if (Qn(e)) return e.subarray();
  if (tl(e)) {
    const a = new (Object.getPrototypeOf(e)).constructor(e.length);
    i.set(e, a);
    for (let n = 0; n < e.length; n++) a[n] = zr(e[n], n, r, i, s);
    return a;
  }
  if (e instanceof ArrayBuffer || typeof SharedArrayBuffer < "u" && e instanceof SharedArrayBuffer) return e.slice(0);
  if (e instanceof DataView) {
    const a = new DataView(e.buffer.slice(0), e.byteOffset, e.byteLength);
    return i.set(e, a), ge(a, e, r, i, s), a;
  }
  if (typeof File < "u" && e instanceof File) {
    const a = new File([e], e.name, { type: e.type });
    return i.set(e, a), ge(a, e, r, i, s), a;
  }
  if (typeof Blob < "u" && e instanceof Blob) {
    const a = new Blob([e], { type: e.type });
    return i.set(e, a), ge(a, e, r, i, s), a;
  }
  if (e instanceof Error) {
    const a = structuredClone(e);
    return i.set(e, a), a.message = e.message, a.name = e.name, a.stack = e.stack, a.cause = e.cause, a.constructor = e.constructor, ge(a, e, r, i, s), a;
  }
  if (e instanceof Boolean) {
    const a = new Boolean(e.valueOf());
    return i.set(e, a), ge(a, e, r, i, s), a;
  }
  if (e instanceof Number) {
    const a = new Number(e.valueOf());
    return i.set(e, a), ge(a, e, r, i, s), a;
  }
  if (e instanceof String) {
    const a = new String(e.valueOf());
    return i.set(e, a), ge(a, e, r, i, s), a;
  }
  if (typeof e == "object" && G1(e)) {
    const a = Object.create(Object.getPrototypeOf(e));
    return i.set(e, a), ge(a, e, r, i, s), a;
  }
  return e;
}
function ge(e, t, r = e, i, s) {
  const o = [...Object.keys(t), ...Zu(t)];
  for (let a = 0; a < o.length; a++) {
    const n = o[a], l = Object.getOwnPropertyDescriptor(e, n);
    (l == null || l.writable) && (e[n] = zr(t[n], n, r, i, s));
  }
}
function G1(e) {
  switch (Zn(e)) {
    case ef:
    case M1:
    case $1:
    case I1:
    case tf:
    case F1:
    case H1:
    case Y1:
    case N1:
    case W1:
    case z1:
    case A1:
    case Ju:
    case O1:
    case v1:
    case E1:
    case Qu:
    case L1:
    case D1:
    case P1:
    case R1:
    case q1:
      return !0;
    default:
      return !1;
  }
}
function V1(e, t) {
  return U1(e, (r, i, s, o) => {
    if (typeof e == "object") {
      if (Zn(e) === "[object Object]" && typeof e.constructor != "function") {
        const a = {};
        return o.set(e, a), ge(a, e, s, o), a;
      }
      switch (Object.prototype.toString.call(e)) {
        case Ju:
        case Qu:
        case tf: {
          const a = new e.constructor(e?.valueOf());
          return ge(a, e), a;
        }
        case ef: {
          const a = {};
          return ge(a, e), a.length = e.length, a[Symbol.iterator] = e[Symbol.iterator], a;
        }
        default:
          return;
      }
    }
  });
}
function Rh(e) {
  return V1(e);
}
function rn(e) {
  return e !== null && typeof e == "object" && Zn(e) === "[object Arguments]";
}
function sn(e) {
  return typeof e == "object" && e !== null;
}
function K1(e) {
  return sn(e) && rf(e);
}
function zs(e) {
  return tl(e);
}
function Z1(e) {
  const t = e?.constructor;
  return e === (typeof t == "function" ? t.prototype : Object.prototype);
}
function ms(e, t) {
  if (typeof e != "function" || t != null && typeof t != "function") throw new TypeError("Expected a function");
  const r = function(...i) {
    const s = t ? t.apply(this, i) : i[0], o = r.cache;
    if (o.has(s)) return o.get(s);
    const a = e.apply(this, i);
    return r.cache = o.set(s, a) || o, a;
  };
  return r.cache = new (ms.Cache || Map)(), r;
}
ms.Cache = Map;
function Q1(e) {
  if (Jn(e)) return e;
  if (Array.isArray(e) || tl(e) || e instanceof ArrayBuffer || typeof SharedArrayBuffer < "u" && e instanceof SharedArrayBuffer) return e.slice(0);
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
function J1(e, ...t) {
  const r = t.slice(0, -1), i = t[t.length - 1];
  let s = e;
  for (let o = 0; o < r.length; o++) {
    const a = r[o];
    s = Hs(s, a, i, /* @__PURE__ */ new Map());
  }
  return s;
}
function Hs(e, t, r, i) {
  if (Jn(e) && (e = Object(e)), t == null || typeof t != "object") return e;
  if (i.has(t)) return Q1(i.get(t));
  if (i.set(t, e), Array.isArray(t)) {
    t = t.slice();
    for (let o = 0; o < t.length; o++) o in t || (t[o] = void 0);
  }
  const s = [...Object.keys(t), ...Zu(t)];
  for (let o = 0; o < s.length; o++) {
    const a = s[o];
    if (j1(a)) continue;
    let n = t[a], l = e[a];
    if (rn(n) && (n = { ...n }), rn(l) && (l = { ...l }), Qn(n) && (n = Rh(n)), Array.isArray(n)) if (Array.isArray(l)) {
      const h = [], d = Reflect.ownKeys(l);
      for (let u = 0; u < d.length; u++) {
        const f = d[u];
        h[f] = l[f];
      }
      l = h;
    } else if (K1(l)) {
      const h = [];
      for (let d = 0; d < l.length; d++) h[d] = l[d];
      l = h;
    } else l = [];
    const c = r(l, n, a, e, t, i);
    c !== void 0 ? e[a] = c : Array.isArray(n) || sn(l) && sn(n) && (Zo(l) || Zo(n) || zs(l) || zs(n)) ? e[a] = Hs(l, n, r, i) : l == null && Zo(n) ? e[a] = Hs({}, n, r, i) : l == null && zs(n) ? e[a] = Rh(n) : (l === void 0 || n !== void 0) && (e[a] = n);
  }
  return e;
}
function t2(e, ...t) {
  return J1(e, ...t, _1);
}
function qh(e) {
  if (e == null) return !0;
  if (rf(e))
    return typeof e.splice != "function" && typeof e != "string" && !Qn(e) && !zs(e) && !rn(e) ? !1 : e.length === 0;
  if (typeof e == "object" || typeof e == "function") {
    if (e instanceof Map || e instanceof Set) return e.size === 0;
    const t = Object.keys(e);
    return Z1(e) ? t.filter((r) => r !== "constructor").length === 0 : t.length === 0;
  }
  return !0;
}
var e2 = "​", r2 = {
  curveBasis: tn,
  curveBasisClosed: zk,
  curveBasisOpen: Hk,
  curveBumpX: vu,
  curveBumpY: Lu,
  curveBundle: Yk,
  curveCardinalClosed: Xk,
  curveCardinalOpen: jk,
  curveCardinal: Mu,
  curveCatmullRomClosed: Uk,
  curveCatmullRomOpen: Gk,
  curveCatmullRom: Ou,
  curveLinear: Zi,
  curveLinearClosed: Vk,
  curveMonotoneX: Nu,
  curveMonotoneY: Wu,
  curveNatural: Hu,
  curveStep: Yu,
  curveStepAfter: ju,
  curveStepBefore: Xu
}, i2 = /\s*(?:(\w+)(?=:):|(\w+))\s*(?:(\w+)|((?:(?!}%{2}).|\r?\n)*))?\s*(?:}%{2})?/gi, s2 = /* @__PURE__ */ p(function(e, t) {
  const r = sf(e, /(?:init\b)|(?:initialize\b)/);
  let i = {};
  if (Array.isArray(r)) {
    const a = r.map((n) => n.args);
    Ks(a), i = Ht(i, [...a]);
  } else
    i = r.args;
  if (!i)
    return;
  let s = $n(e, t);
  const o = "config";
  return i[o] !== void 0 && (s === "flowchart-v2" && (s = "flowchart"), i[s] = i[o], delete i[o]), i;
}, "detectInit"), sf = /* @__PURE__ */ p(function(e, t = null) {
  try {
    const r = new RegExp(
      `[%]{2}(?![{]${i2.source})(?=[}][%]{2}).*
`,
      "ig"
    );
    e = e.trim().replace(r, "").replace(/'/gm, '"'), M.debug(
      `Detecting diagram directive${t !== null ? " type:" + t : ""} based on the text:${e}`
    );
    let i;
    const s = [];
    for (; (i = Ki.exec(e)) !== null; )
      if (i.index === Ki.lastIndex && Ki.lastIndex++, i && !t || t && i[1]?.match(t) || t && i[2]?.match(t)) {
        const o = i[1] ? i[1] : i[2], a = i[3] ? i[3].trim() : i[4] ? JSON.parse(i[4].trim()) : null;
        s.push({ type: o, args: a });
      }
    return s.length === 0 ? { type: e, args: null } : s.length === 1 ? s[0] : s;
  } catch (r) {
    return M.error(
      `ERROR: ${r.message} - Unable to parse directive type: '${t}' based on the text: '${e}'`
    ), { type: void 0, args: null };
  }
}, "detectDirective"), o2 = /* @__PURE__ */ p(function(e) {
  return e.replace(Ki, "");
}, "removeDirectives"), a2 = /* @__PURE__ */ p(function(e, t) {
  for (const [r, i] of t.entries())
    if (i.match(e))
      return r;
  return -1;
}, "isSubstringInArray");
function el(e, t) {
  if (!e)
    return t;
  const r = `curve${e.charAt(0).toUpperCase() + e.slice(1)}`;
  return r2[r] ?? t;
}
p(el, "interpolateToCurve");
function of(e, t) {
  const r = e.trim();
  if (r)
    return t.securityLevel !== "loose" ? B1.sanitizeUrl(r) : r;
}
p(of, "formatUrl");
var n2 = /* @__PURE__ */ p((e, ...t) => {
  const r = e.split("."), i = r.length - 1, s = r[i];
  let o = window;
  for (let a = 0; a < i; a++)
    if (o = o[r[a]], !o) {
      M.error(`Function name: ${e} not found in window`);
      return;
    }
  o[s](...t);
}, "runFunc");
function rl(e, t) {
  return !e || !t ? 0 : Math.sqrt(Math.pow(t.x - e.x, 2) + Math.pow(t.y - e.y, 2));
}
p(rl, "distance");
function af(e) {
  let t, r = 0;
  e.forEach((s) => {
    r += rl(s, t), t = s;
  });
  const i = r / 2;
  return il(e, i);
}
p(af, "traverseEdge");
function nf(e) {
  return e.length === 1 ? e[0] : af(e);
}
p(nf, "calcLabelPosition");
var Nh = /* @__PURE__ */ p((e, t = 2) => {
  const r = Math.pow(10, t);
  return Math.round(e * r) / r;
}, "roundNumber"), il = /* @__PURE__ */ p((e, t) => {
  let r, i = t;
  for (const s of e) {
    if (r) {
      const o = rl(s, r);
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
            x: Nh((1 - a) * r.x + a * s.x, 5),
            y: Nh((1 - a) * r.y + a * s.y, 5)
          };
      }
    }
    r = s;
  }
  throw new Error("Could not find a suitable point for the given distance");
}, "calculatePoint"), l2 = /* @__PURE__ */ p((e, t, r) => {
  M.info(`our points ${JSON.stringify(t)}`), t[0] !== r && (t = t.reverse());
  const s = il(t, 25), o = e ? 10 : 5, a = Math.atan2(t[0].y - s.y, t[0].x - s.x), n = { x: 0, y: 0 };
  return n.x = Math.sin(a) * o + (t[0].x + s.x) / 2, n.y = -Math.cos(a) * o + (t[0].y + s.y) / 2, n;
}, "calcCardinalityPosition");
function lf(e, t, r) {
  const i = structuredClone(r);
  M.info("our points", i), t !== "start_left" && t !== "start_right" && i.reverse();
  const s = 25 + e, o = il(i, s), a = 10 + e * 0.5, n = Math.atan2(i[0].y - o.y, i[0].x - o.x), l = { x: 0, y: 0 };
  return t === "start_left" ? (l.x = Math.sin(n + Math.PI) * a + (i[0].x + o.x) / 2, l.y = -Math.cos(n + Math.PI) * a + (i[0].y + o.y) / 2) : t === "end_right" ? (l.x = Math.sin(n - Math.PI) * a + (i[0].x + o.x) / 2 - 5, l.y = -Math.cos(n - Math.PI) * a + (i[0].y + o.y) / 2 - 5) : t === "end_left" ? (l.x = Math.sin(n) * a + (i[0].x + o.x) / 2 - 5, l.y = -Math.cos(n) * a + (i[0].y + o.y) / 2 - 5) : (l.x = Math.sin(n) * a + (i[0].x + o.x) / 2, l.y = -Math.cos(n) * a + (i[0].y + o.y) / 2), l;
}
p(lf, "calcTerminalLabelPosition");
function hf(e) {
  let t = "", r = "";
  for (const i of e)
    i !== void 0 && (i.startsWith("color:") || i.startsWith("text-align:") ? r = r + i + ";" : t = t + i + ";");
  return { style: t, labelStyle: r };
}
p(hf, "getStylesFromArray");
var Wh = 0, h2 = /* @__PURE__ */ p(() => (Wh++, "id-" + Math.random().toString(36).substr(2, 12) + "-" + Wh), "generateId");
function cf(e) {
  let t = "";
  const r = "0123456789abcdef", i = r.length;
  for (let s = 0; s < e; s++)
    t += r.charAt(Math.floor(Math.random() * i));
  return t;
}
p(cf, "makeRandomHex");
var c2 = /* @__PURE__ */ p((e) => cf(e.length), "random"), d2 = /* @__PURE__ */ p(function() {
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
}, "getTextObj"), u2 = /* @__PURE__ */ p(function(e, t) {
  const r = t.text.replace(fs.lineBreakRegex, " "), [, i] = Eo(t.fontSize), s = e.append("text");
  s.attr("x", t.x), s.attr("y", t.y), s.style("text-anchor", t.anchor), s.style("font-family", t.fontFamily), s.style("font-size", i), s.style("font-weight", t.fontWeight), s.attr("fill", t.fill), t.class !== void 0 && s.attr("class", t.class);
  const o = s.append("tspan");
  return o.attr("x", t.x + t.textMargin * 2), o.attr("fill", t.fill), o.text(r), s;
}, "drawSimpleText"), f2 = ms(
  (e, t, r) => {
    if (!e || (r = Object.assign(
      { fontSize: 12, fontWeight: 400, fontFamily: "Arial", joinWith: "<br/>" },
      r
    ), fs.lineBreakRegex.test(e)))
      return e;
    const i = e.split(" ").filter(Boolean), s = [];
    let o = "";
    return i.forEach((a, n) => {
      const l = Ye(`${a} `, r), c = Ye(o, r);
      if (l > t) {
        const { hyphenatedStrings: u, remainingWord: f } = p2(a, t, "-", r);
        s.push(o, ...u), o = f;
      } else c + l >= t ? (s.push(o), o = a) : o = [o, a].filter(Boolean).join(" ");
      n + 1 === i.length && s.push(o);
    }), s.filter((a) => a !== "").join(r.joinWith);
  },
  (e, t, r) => `${e}${t}${r.fontSize}${r.fontWeight}${r.fontFamily}${r.joinWith}`
), p2 = ms(
  (e, t, r = "-", i) => {
    i = Object.assign(
      { fontSize: 12, fontWeight: 400, fontFamily: "Arial", margin: 0 },
      i
    );
    const s = [...e], o = [];
    let a = "";
    return s.forEach((n, l) => {
      const c = `${a}${n}`;
      if (Ye(c, i) >= t) {
        const d = l + 1, u = s.length === d, f = `${c}${r}`;
        o.push(u ? c : f), a = "";
      } else
        a = c;
    }), { hyphenatedStrings: o, remainingWord: a };
  },
  (e, t, r = "-", i) => `${e}${t}${r}${i.fontSize}${i.fontWeight}${i.fontFamily}`
);
function df(e, t) {
  return sl(e, t).height;
}
p(df, "calculateTextHeight");
function Ye(e, t) {
  return sl(e, t).width;
}
p(Ye, "calculateTextWidth");
var sl = ms(
  (e, t) => {
    const { fontSize: r = 12, fontFamily: i = "Arial", fontWeight: s = 400 } = t;
    if (!e)
      return { width: 0, height: 0 };
    const [, o] = Eo(r), a = ["sans-serif", i], n = e.split(fs.lineBreakRegex), l = [], c = xt("body");
    if (!c.remove)
      return { width: 0, height: 0, lineHeight: 0 };
    const h = c.append("svg");
    for (const u of a) {
      let f = 0;
      const y = { width: 0, height: 0, lineHeight: 0 };
      for (const m of n) {
        const x = d2();
        x.text = m || e2;
        const C = u2(h, x).style("font-size", o).style("font-weight", s).style("font-family", u), b = (C._groups || C)[0][0].getBBox();
        if (b.width === 0 && b.height === 0)
          throw new Error("svg element not in render tree");
        y.width = Math.round(Math.max(y.width, b.width)), f = Math.round(b.height), y.height += f, y.lineHeight = Math.round(Math.max(y.lineHeight, f));
      }
      l.push(y);
    }
    h.remove();
    const d = isNaN(l[1].height) || isNaN(l[1].width) || isNaN(l[1].lineHeight) || l[0].height > l[1].height && l[0].width > l[1].width && l[0].lineHeight > l[1].lineHeight ? 0 : 1;
    return l[d];
  },
  (e, t) => `${e}${t.fontSize}${t.fontWeight}${t.fontFamily}`
), oi, g2 = (oi = class {
  constructor(t = !1, r) {
    this.count = 0, this.count = r ? r.length : 0, this.next = t ? () => this.count++ : () => Date.now();
  }
}, p(oi, "InitIDGenerator"), oi), Ls, y2 = /* @__PURE__ */ p(function(e) {
  return Ls = Ls || document.createElement("div"), e = escape(e).replace(/%26/g, "&").replace(/%23/g, "#").replace(/%3B/g, ";"), Ls.innerHTML = e, unescape(Ls.textContent);
}, "entityDecode");
function ol(e) {
  return "str" in e;
}
p(ol, "isDetailedError");
var m2 = /* @__PURE__ */ p((e, t, r, i) => {
  if (!i)
    return;
  const s = e.node()?.getBBox();
  s && e.append("text").text(i).attr("text-anchor", "middle").attr("x", s.x + s.width / 2).attr("y", -r).attr("class", t);
}, "insertTitle"), Eo = /* @__PURE__ */ p((e) => {
  if (typeof e == "number")
    return [e, e + "px"];
  const t = parseInt(e ?? "", 10);
  return Number.isNaN(t) ? [void 0, void 0] : e === String(t) ? [t, e + "px"] : [t, e];
}, "parseFontSize");
function al(e, t) {
  return t2({}, e, t);
}
p(al, "cleanAndMerge");
var Kt = {
  assignWithDepth: Ht,
  wrapLabel: f2,
  calculateTextHeight: df,
  calculateTextWidth: Ye,
  calculateTextDimensions: sl,
  cleanAndMerge: al,
  detectInit: s2,
  detectDirective: sf,
  isSubstringInArray: a2,
  interpolateToCurve: el,
  calcLabelPosition: nf,
  calcCardinalityPosition: l2,
  calcTerminalLabelPosition: lf,
  formatUrl: of,
  getStylesFromArray: hf,
  generateId: h2,
  random: c2,
  runFunc: n2,
  entityDecode: y2,
  insertTitle: m2,
  isLabelCoordinateInPath: uf,
  parseFontSize: Eo,
  InitIDGenerator: g2
}, x2 = /* @__PURE__ */ p(function(e) {
  let t = e;
  return t = t.replace(/style.*:\S*#.*;/g, function(r) {
    return r.substring(0, r.length - 1);
  }), t = t.replace(/classDef.*:\S*#.*;/g, function(r) {
    return r.substring(0, r.length - 1);
  }), t = t.replace(/#\w+;/g, function(r) {
    const i = r.substring(1, r.length - 1);
    return /^\+?\d+$/.test(i) ? "ﬂ°°" + i + "¶ß" : "ﬂ°" + i + "¶ß";
  }), t;
}, "encodeEntities"), er = /* @__PURE__ */ p(function(e) {
  return e.replace(/ﬂ°°/g, "&#").replace(/ﬂ°/g, "&").replace(/¶ß/g, ";");
}, "decodeEntities"), TF = /* @__PURE__ */ p((e, t, {
  counter: r = 0,
  prefix: i,
  suffix: s
}, o) => o || `${i ? `${i}_` : ""}${e}_${t}_${r}${s ? `_${s}` : ""}`, "getEdgeId");
function Wt(e) {
  return e ?? null;
}
p(Wt, "handleUndefinedAttr");
function uf(e, t) {
  const r = Math.round(e.x), i = Math.round(e.y), s = t.replace(
    /(\d+\.\d+)/g,
    (o) => Math.round(parseFloat(o)).toString()
  );
  return s.includes(r.toString()) || s.includes(i.toString());
}
p(uf, "isLabelCoordinateInPath");
var Ys = { exports: {} }, zh = Ys.exports, Hh;
function C2() {
  return Hh || (Hh = 1, (function(e) {
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
          for (var d; d = h.shift(); ) d();
        },
        /**
         * Adds a job to the read batch and
         * schedules a new frame if need be.
         *
         * @param  {Function} fn
         * @param  {Object} ctx the context to be bound to `fn` (optional).
         * @public
         */
        measure: function(h, d) {
          var u = d ? h.bind(d) : h;
          return this.reads.push(u), o(this), u;
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
        mutate: function(h, d) {
          var u = d ? h.bind(d) : h;
          return this.writes.push(u), o(this), u;
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
          var d = Object.create(this);
          return l(d, h), d.fastdom = this, d.initialize && d.initialize(), d;
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
        var d = h.writes, u = h.reads, f;
        try {
          r("flushing reads", u.length), h.runTasks(u), r("flushing writes", d.length), h.runTasks(d);
        } catch (y) {
          f = y;
        }
        if (h.scheduled = !1, (u.length || d.length) && o(h), f)
          if (r("task errored", f.message), h.catch) h.catch(f);
          else throw f;
      }
      function n(h, d) {
        var u = h.indexOf(d);
        return !!~u && !!h.splice(u, 1);
      }
      function l(h, d) {
        for (var u in d)
          d.hasOwnProperty(u) && (h[u] = d[u]);
      }
      var c = t.fastdom = t.fastdom || new s();
      e.exports = c;
    })(typeof window < "u" ? window : typeof zh < "u" ? zh : globalThis);
  })(Ys)), Ys.exports;
}
var b2 = C2();
const k2 = /* @__PURE__ */ vn(b2);
var Qo = { exports: {} }, Yh;
function w2() {
  return Yh || (Yh = 1, (function(e) {
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
        var n = i._tasks, l = i.fastdom, c, h = new Promise(function(d, u) {
          c = l[s](function() {
            n.delete(h);
            try {
              d(a ? o.call(a) : o());
            } catch (f) {
              u(f);
            }
          }, a);
        });
        return n.set(h, c), h;
      }
      e.exports = t;
    })();
  })(Qo)), Qo.exports;
}
var S2 = w2();
const T2 = /* @__PURE__ */ vn(S2);
function nl() {
  return { async: !1, breaks: !1, extensions: null, gfm: !0, hooks: null, pedantic: !1, renderer: null, silent: !1, tokenizer: null, walkTokens: null };
}
var Br = nl();
function ff(e) {
  Br = e;
}
var Qi = { exec: () => null };
function Et(e, t = "") {
  let r = typeof e == "string" ? e : e.source, i = { replace: (s, o) => {
    let a = typeof o == "string" ? o : o.source;
    return a = a.replace(te.caret, "$1"), r = r.replace(s, a), i;
  }, getRegex: () => new RegExp(r, t) };
  return i;
}
var B2 = (() => {
  try {
    return !!new RegExp("(?<=1)(?<!1)");
  } catch {
    return !1;
  }
})(), te = { codeRemoveIndent: /^(?: {1,4}| {0,3}\t)/gm, outputLinkReplace: /\\([\[\]])/g, indentCodeCompensation: /^(\s+)(?:```)/, beginningSpace: /^\s+/, endingHash: /#$/, startingSpaceChar: /^ /, endingSpaceChar: / $/, nonSpaceChar: /[^ ]/, newLineCharGlobal: /\n/g, tabCharGlobal: /\t/g, multipleSpaceGlobal: /\s+/g, blankLine: /^[ \t]*$/, doubleBlankLine: /\n[ \t]*\n[ \t]*$/, blockquoteStart: /^ {0,3}>/, blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g, blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm, listReplaceTabs: /^\t+/, listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g, listIsTask: /^\[[ xX]\] /, listReplaceTask: /^\[[ xX]\] +/, anyLine: /\n.*\n/, hrefBrackets: /^<(.*)>$/, tableDelimiter: /[:|]/, tableAlignChars: /^\||\| *$/g, tableRowBlankLine: /\n[ \t]*$/, tableAlignRight: /^ *-+: *$/, tableAlignCenter: /^ *:-+: *$/, tableAlignLeft: /^ *:-+ *$/, startATag: /^<a /i, endATag: /^<\/a>/i, startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i, endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i, startAngleBracket: /^</, endAngleBracket: />$/, pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/, unicodeAlphaNumeric: /[\p{L}\p{N}]/u, escapeTest: /[&<>"']/, escapeReplace: /[&<>"']/g, escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/, escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g, unescapeTest: /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig, caret: /(^|[^\[])\^/g, percentDecode: /%25/g, findPipe: /\|/g, splitPipe: / \|/, slashPipe: /\\\|/g, carriageReturn: /\r\n|\r/g, spaceLine: /^ +$/gm, notSpaceStart: /^\S*/, endingNewline: /\n$/, listItemRegex: (e) => new RegExp(`^( {0,3}${e})((?:[	 ][^\\n]*)?(?:\\n|$))`), nextBulletRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`), hrRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`), fencesBeginRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}(?:\`\`\`|~~~)`), headingBeginRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}#`), htmlBeginRegex: (e) => new RegExp(`^ {0,${Math.min(3, e - 1)}}<(?:[a-z].*>|!--)`, "i") }, _2 = /^(?:[ \t]*(?:\n|$))+/, v2 = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, L2 = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, xs = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, F2 = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, ll = /(?:[*+-]|\d{1,9}[.)])/, pf = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/, gf = Et(pf).replace(/bull/g, ll).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex(), A2 = Et(pf).replace(/bull/g, ll).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(), hl = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/, E2 = /^[^\n]+/, cl = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/, M2 = Et(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", cl).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), $2 = Et(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, ll).getRegex(), Mo = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", dl = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, O2 = Et("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))", "i").replace("comment", dl).replace("tag", Mo).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), yf = Et(hl).replace("hr", xs).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Mo).getRegex(), I2 = Et(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", yf).getRegex(), ul = { blockquote: I2, code: v2, def: M2, fences: L2, heading: F2, hr: xs, html: O2, lheading: gf, list: $2, newline: _2, paragraph: yf, table: Qi, text: E2 }, Xh = Et("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", xs).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Mo).getRegex(), D2 = { ...ul, lheading: A2, table: Xh, paragraph: Et(hl).replace("hr", xs).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", Xh).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Mo).getRegex() }, P2 = { ...ul, html: Et(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", dl).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(), def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/, heading: /^(#{1,6})(.*)(?:\n+|$)/, fences: Qi, lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/, paragraph: Et(hl).replace("hr", xs).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", gf).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex() }, R2 = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, q2 = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, mf = /^( {2,}|\\)\n(?!\s*$)/, N2 = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, $o = /[\p{P}\p{S}]/u, fl = /[\s\p{P}\p{S}]/u, xf = /[^\s\p{P}\p{S}]/u, W2 = Et(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, fl).getRegex(), Cf = /(?!~)[\p{P}\p{S}]/u, z2 = /(?!~)[\s\p{P}\p{S}]/u, H2 = /(?:[^\s\p{P}\p{S}]|~)/u, Y2 = Et(/link|precode-code|html/, "g").replace("link", /\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-", B2 ? "(?<!`)()" : "(^^|[^`])").replace("code", /(?<b>`+)[^`]+\k<b>(?!`)/).replace("html", /<(?! )[^<>]*?>/).getRegex(), bf = /^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/, X2 = Et(bf, "u").replace(/punct/g, $o).getRegex(), j2 = Et(bf, "u").replace(/punct/g, Cf).getRegex(), kf = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)", U2 = Et(kf, "gu").replace(/notPunctSpace/g, xf).replace(/punctSpace/g, fl).replace(/punct/g, $o).getRegex(), G2 = Et(kf, "gu").replace(/notPunctSpace/g, H2).replace(/punctSpace/g, z2).replace(/punct/g, Cf).getRegex(), V2 = Et("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, xf).replace(/punctSpace/g, fl).replace(/punct/g, $o).getRegex(), K2 = Et(/\\(punct)/, "gu").replace(/punct/g, $o).getRegex(), Z2 = Et(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), Q2 = Et(dl).replace("(?:-->|$)", "-->").getRegex(), J2 = Et("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", Q2).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), uo = /(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+[^`]*?`+(?!`)|[^\[\]\\`])*?/, tw = Et(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]*(?:\n[ \t]*)?)(title))?\s*\)/).replace("label", uo).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), wf = Et(/^!?\[(label)\]\[(ref)\]/).replace("label", uo).replace("ref", cl).getRegex(), Sf = Et(/^!?\[(ref)\](?:\[\])?/).replace("ref", cl).getRegex(), ew = Et("reflink|nolink(?!\\()", "g").replace("reflink", wf).replace("nolink", Sf).getRegex(), jh = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/, pl = { _backpedal: Qi, anyPunctuation: K2, autolink: Z2, blockSkip: Y2, br: mf, code: q2, del: Qi, emStrongLDelim: X2, emStrongRDelimAst: U2, emStrongRDelimUnd: V2, escape: R2, link: tw, nolink: Sf, punctuation: W2, reflink: wf, reflinkSearch: ew, tag: J2, text: N2, url: Qi }, rw = { ...pl, link: Et(/^!?\[(label)\]\((.*?)\)/).replace("label", uo).getRegex(), reflink: Et(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", uo).getRegex() }, on = { ...pl, emStrongRDelimAst: G2, emStrongLDelim: j2, url: Et(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol", jh).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(), _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/, del: /^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/, text: Et(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol", jh).getRegex() }, iw = { ...on, br: Et(mf).replace("{2,}", "*").getRegex(), text: Et(on.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex() }, Fs = { normal: ul, gfm: D2, pedantic: P2 }, Ei = { normal: pl, gfm: on, breaks: iw, pedantic: rw }, sw = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }, Uh = (e) => sw[e];
function Be(e, t) {
  if (t) {
    if (te.escapeTest.test(e)) return e.replace(te.escapeReplace, Uh);
  } else if (te.escapeTestNoEncode.test(e)) return e.replace(te.escapeReplaceNoEncode, Uh);
  return e;
}
function Gh(e) {
  try {
    e = encodeURI(e).replace(te.percentDecode, "%");
  } catch {
    return null;
  }
  return e;
}
function Vh(e, t) {
  let r = e.replace(te.findPipe, (o, a, n) => {
    let l = !1, c = a;
    for (; --c >= 0 && n[c] === "\\"; ) l = !l;
    return l ? "|" : " |";
  }), i = r.split(te.splitPipe), s = 0;
  if (i[0].trim() || i.shift(), i.length > 0 && !i.at(-1)?.trim() && i.pop(), t) if (i.length > t) i.splice(t);
  else for (; i.length < t; ) i.push("");
  for (; s < i.length; s++) i[s] = i[s].trim().replace(te.slashPipe, "|");
  return i;
}
function Mi(e, t, r) {
  let i = e.length;
  if (i === 0) return "";
  let s = 0;
  for (; s < i && e.charAt(i - s - 1) === t; )
    s++;
  return e.slice(0, i - s);
}
function ow(e, t) {
  if (e.indexOf(t[1]) === -1) return -1;
  let r = 0;
  for (let i = 0; i < e.length; i++) if (e[i] === "\\") i++;
  else if (e[i] === t[0]) r++;
  else if (e[i] === t[1] && (r--, r < 0)) return i;
  return r > 0 ? -2 : -1;
}
function Kh(e, t, r, i, s) {
  let o = t.href, a = t.title || null, n = e[1].replace(s.other.outputLinkReplace, "$1");
  i.state.inLink = !0;
  let l = { type: e[0].charAt(0) === "!" ? "image" : "link", raw: r, href: o, title: a, text: n, tokens: i.inlineTokens(n) };
  return i.state.inLink = !1, l;
}
function aw(e, t, r) {
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
var fo = class {
  options;
  rules;
  lexer;
  constructor(t) {
    this.options = t || Br;
  }
  space(t) {
    let r = this.rules.block.newline.exec(t);
    if (r && r[0].length > 0) return { type: "space", raw: r[0] };
  }
  code(t) {
    let r = this.rules.block.code.exec(t);
    if (r) {
      let i = r[0].replace(this.rules.other.codeRemoveIndent, "");
      return { type: "code", raw: r[0], codeBlockStyle: "indented", text: this.options.pedantic ? i : Mi(i, `
`) };
    }
  }
  fences(t) {
    let r = this.rules.block.fences.exec(t);
    if (r) {
      let i = r[0], s = aw(i, r[3] || "", this.rules);
      return { type: "code", raw: i, lang: r[2] ? r[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : r[2], text: s };
    }
  }
  heading(t) {
    let r = this.rules.block.heading.exec(t);
    if (r) {
      let i = r[2].trim();
      if (this.rules.other.endingHash.test(i)) {
        let s = Mi(i, "#");
        (this.options.pedantic || !s || this.rules.other.endingSpaceChar.test(s)) && (i = s.trim());
      }
      return { type: "heading", raw: r[0], depth: r[1].length, text: i, tokens: this.lexer.inline(i) };
    }
  }
  hr(t) {
    let r = this.rules.block.hr.exec(t);
    if (r) return { type: "hr", raw: Mi(r[0], `
`) };
  }
  blockquote(t) {
    let r = this.rules.block.blockquote.exec(t);
    if (r) {
      let i = Mi(r[0], `
`).split(`
`), s = "", o = "", a = [];
      for (; i.length > 0; ) {
        let n = !1, l = [], c;
        for (c = 0; c < i.length; c++) if (this.rules.other.blockquoteStart.test(i[c])) l.push(i[c]), n = !0;
        else if (!n) l.push(i[c]);
        else break;
        i = i.slice(c);
        let h = l.join(`
`), d = h.replace(this.rules.other.blockquoteSetextReplace, `
    $1`).replace(this.rules.other.blockquoteSetextReplace2, "");
        s = s ? `${s}
${h}` : h, o = o ? `${o}
${d}` : d;
        let u = this.lexer.state.top;
        if (this.lexer.state.top = !0, this.lexer.blockTokens(d, a, !0), this.lexer.state.top = u, i.length === 0) break;
        let f = a.at(-1);
        if (f?.type === "code") break;
        if (f?.type === "blockquote") {
          let y = f, m = y.raw + `
` + i.join(`
`), x = this.blockquote(m);
          a[a.length - 1] = x, s = s.substring(0, s.length - y.raw.length) + x.raw, o = o.substring(0, o.length - y.text.length) + x.text;
          break;
        } else if (f?.type === "list") {
          let y = f, m = y.raw + `
` + i.join(`
`), x = this.list(m);
          a[a.length - 1] = x, s = s.substring(0, s.length - f.raw.length) + x.raw, o = o.substring(0, o.length - y.raw.length) + x.raw, i = m.substring(a.at(-1).raw.length).split(`
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
        let c = !1, h = "", d = "";
        if (!(r = a.exec(t)) || this.rules.block.hr.test(t)) break;
        h = r[0], t = t.substring(h.length);
        let u = r[2].split(`
`, 1)[0].replace(this.rules.other.listReplaceTabs, (b) => " ".repeat(3 * b.length)), f = t.split(`
`, 1)[0], y = !u.trim(), m = 0;
        if (this.options.pedantic ? (m = 2, d = u.trimStart()) : y ? m = r[1].length + 1 : (m = r[2].search(this.rules.other.nonSpaceChar), m = m > 4 ? 1 : m, d = u.slice(m), m += r[1].length), y && this.rules.other.blankLine.test(f) && (h += f + `
`, t = t.substring(f.length + 1), c = !0), !c) {
          let b = this.rules.other.nextBulletRegex(m), w = this.rules.other.hrRegex(m), T = this.rules.other.fencesBeginRegex(m), B = this.rules.other.headingBeginRegex(m), L = this.rules.other.htmlBeginRegex(m);
          for (; t; ) {
            let v = t.split(`
`, 1)[0], _;
            if (f = v, this.options.pedantic ? (f = f.replace(this.rules.other.listReplaceNesting, "  "), _ = f) : _ = f.replace(this.rules.other.tabCharGlobal, "    "), T.test(f) || B.test(f) || L.test(f) || b.test(f) || w.test(f)) break;
            if (_.search(this.rules.other.nonSpaceChar) >= m || !f.trim()) d += `
` + _.slice(m);
            else {
              if (y || u.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || T.test(u) || B.test(u) || w.test(u)) break;
              d += `
` + f;
            }
            !y && !f.trim() && (y = !0), h += v + `
`, t = t.substring(v.length + 1), u = _.slice(m);
          }
        }
        o.loose || (n ? o.loose = !0 : this.rules.other.doubleBlankLine.test(h) && (n = !0));
        let x = null, C;
        this.options.gfm && (x = this.rules.other.listIsTask.exec(d), x && (C = x[0] !== "[ ] ", d = d.replace(this.rules.other.listReplaceTask, ""))), o.items.push({ type: "list_item", raw: h, task: !!x, checked: C, loose: !1, text: d, tokens: [] }), o.raw += h;
      }
      let l = o.items.at(-1);
      if (l) l.raw = l.raw.trimEnd(), l.text = l.text.trimEnd();
      else return;
      o.raw = o.raw.trimEnd();
      for (let c = 0; c < o.items.length; c++) if (this.lexer.state.top = !1, o.items[c].tokens = this.lexer.blockTokens(o.items[c].text, []), !o.loose) {
        let h = o.items[c].tokens.filter((u) => u.type === "space"), d = h.length > 0 && h.some((u) => this.rules.other.anyLine.test(u.raw));
        o.loose = d;
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
    let i = Vh(r[1]), s = r[2].replace(this.rules.other.tableAlignChars, "").split("|"), o = r[3]?.trim() ? r[3].replace(this.rules.other.tableRowBlankLine, "").split(`
`) : [], a = { type: "table", raw: r[0], header: [], align: [], rows: [] };
    if (i.length === s.length) {
      for (let n of s) this.rules.other.tableAlignRight.test(n) ? a.align.push("right") : this.rules.other.tableAlignCenter.test(n) ? a.align.push("center") : this.rules.other.tableAlignLeft.test(n) ? a.align.push("left") : a.align.push(null);
      for (let n = 0; n < i.length; n++) a.header.push({ text: i[n], tokens: this.lexer.inline(i[n]), header: !0, align: a.align[n] });
      for (let n of o) a.rows.push(Vh(n, a.header.length).map((l, c) => ({ text: l, tokens: this.lexer.inline(l), header: !1, align: a.align[c] })));
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
        let a = Mi(i.slice(0, -1), "\\");
        if ((i.length - a.length) % 2 === 0) return;
      } else {
        let a = ow(r[2], "()");
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
      return s = s.trim(), this.rules.other.startAngleBracket.test(s) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(i) ? s = s.slice(1) : s = s.slice(1, -1)), Kh(r, { href: s && s.replace(this.rules.inline.anyPunctuation, "$1"), title: o && o.replace(this.rules.inline.anyPunctuation, "$1") }, r[0], this.lexer, this.rules);
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
      return Kh(i, o, i[0], this.lexer, this.rules);
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
        let d = [...s[0]][0].length, u = t.slice(0, o + s.index + d + n);
        if (Math.min(o, n) % 2) {
          let y = u.slice(1, -1);
          return { type: "em", raw: u, text: y, tokens: this.lexer.inlineTokens(y) };
        }
        let f = u.slice(2, -2);
        return { type: "strong", raw: u, text: f, tokens: this.lexer.inlineTokens(f) };
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
}, ye = class an {
  tokens;
  options;
  state;
  tokenizer;
  inlineQueue;
  constructor(t) {
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = t || Br, this.options.tokenizer = this.options.tokenizer || new fo(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = { inLink: !1, inRawBlock: !1, top: !0 };
    let r = { other: te, block: Fs.normal, inline: Ei.normal };
    this.options.pedantic ? (r.block = Fs.pedantic, r.inline = Ei.pedantic) : this.options.gfm && (r.block = Fs.gfm, this.options.breaks ? r.inline = Ei.breaks : r.inline = Ei.gfm), this.tokenizer.rules = r;
  }
  static get rules() {
    return { block: Fs, inline: Ei };
  }
  static lex(t, r) {
    return new an(r).lex(t);
  }
  static lexInline(t, r) {
    return new an(r).inlineTokens(t);
  }
  lex(t) {
    t = t.replace(te.carriageReturn, `
`), this.blockTokens(t, this.tokens);
    for (let r = 0; r < this.inlineQueue.length; r++) {
      let i = this.inlineQueue[r];
      this.inlineTokens(i.src, i.tokens);
    }
    return this.inlineQueue = [], this.tokens;
  }
  blockTokens(t, r = [], i = !1) {
    for (this.options.pedantic && (t = t.replace(te.tabCharGlobal, "    ").replace(te.spaceLine, "")); t; ) {
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
        let h = 1 / 0, d = t.slice(1), u;
        this.options.extensions.startInline.forEach((f) => {
          u = f.call({ lexer: this }, d), typeof u == "number" && u >= 0 && (h = Math.min(h, u));
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
}, po = class {
  options;
  parser;
  constructor(t) {
    this.options = t || Br;
  }
  space(t) {
    return "";
  }
  code({ text: t, lang: r, escaped: i }) {
    let s = (r || "").match(te.notSpaceStart)?.[0], o = t.replace(te.endingNewline, "") + `
`;
    return s ? '<pre><code class="language-' + Be(s) + '">' + (i ? o : Be(o, !0)) + `</code></pre>
` : "<pre><code>" + (i ? o : Be(o, !0)) + `</code></pre>
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
      t.loose ? t.tokens[0]?.type === "paragraph" ? (t.tokens[0].text = i + " " + t.tokens[0].text, t.tokens[0].tokens && t.tokens[0].tokens.length > 0 && t.tokens[0].tokens[0].type === "text" && (t.tokens[0].tokens[0].text = i + " " + Be(t.tokens[0].tokens[0].text), t.tokens[0].tokens[0].escaped = !0)) : t.tokens.unshift({ type: "text", raw: i + " ", text: i + " ", escaped: !0 }) : r += i + " ";
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
    return `<code>${Be(t, !0)}</code>`;
  }
  br(t) {
    return "<br>";
  }
  del({ tokens: t }) {
    return `<del>${this.parser.parseInline(t)}</del>`;
  }
  link({ href: t, title: r, tokens: i }) {
    let s = this.parser.parseInline(i), o = Gh(t);
    if (o === null) return s;
    t = o;
    let a = '<a href="' + t + '"';
    return r && (a += ' title="' + Be(r) + '"'), a += ">" + s + "</a>", a;
  }
  image({ href: t, title: r, text: i, tokens: s }) {
    s && (i = this.parser.parseInline(s, this.parser.textRenderer));
    let o = Gh(t);
    if (o === null) return Be(i);
    t = o;
    let a = `<img src="${t}" alt="${i}"`;
    return r && (a += ` title="${Be(r)}"`), a += ">", a;
  }
  text(t) {
    return "tokens" in t && t.tokens ? this.parser.parseInline(t.tokens) : "escaped" in t && t.escaped ? t.text : Be(t.text);
  }
}, gl = class {
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
}, me = class nn {
  options;
  renderer;
  textRenderer;
  constructor(t) {
    this.options = t || Br, this.options.renderer = this.options.renderer || new po(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new gl();
  }
  static parse(t, r) {
    return new nn(r).parse(t);
  }
  static parseInline(t, r) {
    return new nn(r).parseInline(t);
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
}, zi = class {
  options;
  block;
  constructor(t) {
    this.options = t || Br;
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
    return this.block ? ye.lex : ye.lexInline;
  }
  provideParser() {
    return this.block ? me.parse : me.parseInline;
  }
}, nw = class {
  defaults = nl();
  options = this.setOptions;
  parse = this.parseMarkdown(!0);
  parseInline = this.parseMarkdown(!1);
  Parser = me;
  Renderer = po;
  TextRenderer = gl;
  Lexer = ye;
  Tokenizer = fo;
  Hooks = zi;
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
        let o = this.defaults.renderer || new po(this.defaults);
        for (let a in i.renderer) {
          if (!(a in o)) throw new Error(`renderer '${a}' does not exist`);
          if (["options", "parser"].includes(a)) continue;
          let n = a, l = i.renderer[n], c = o[n];
          o[n] = (...h) => {
            let d = l.apply(o, h);
            return d === !1 && (d = c.apply(o, h)), d || "";
          };
        }
        s.renderer = o;
      }
      if (i.tokenizer) {
        let o = this.defaults.tokenizer || new fo(this.defaults);
        for (let a in i.tokenizer) {
          if (!(a in o)) throw new Error(`tokenizer '${a}' does not exist`);
          if (["options", "rules", "lexer"].includes(a)) continue;
          let n = a, l = i.tokenizer[n], c = o[n];
          o[n] = (...h) => {
            let d = l.apply(o, h);
            return d === !1 && (d = c.apply(o, h)), d;
          };
        }
        s.tokenizer = o;
      }
      if (i.hooks) {
        let o = this.defaults.hooks || new zi();
        for (let a in i.hooks) {
          if (!(a in o)) throw new Error(`hook '${a}' does not exist`);
          if (["options", "block"].includes(a)) continue;
          let n = a, l = i.hooks[n], c = o[n];
          zi.passThroughHooks.has(a) ? o[n] = (h) => {
            if (this.defaults.async && zi.passThroughHooksRespectAsync.has(a)) return (async () => {
              let u = await l.call(o, h);
              return c.call(o, u);
            })();
            let d = l.call(o, h);
            return c.call(o, d);
          } : o[n] = (...h) => {
            if (this.defaults.async) return (async () => {
              let u = await l.apply(o, h);
              return u === !1 && (u = await c.apply(o, h)), u;
            })();
            let d = l.apply(o, h);
            return d === !1 && (d = c.apply(o, h)), d;
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
    return ye.lex(t, r ?? this.defaults);
  }
  parser(t, r) {
    return me.parse(t, r ?? this.defaults);
  }
  parseMarkdown(t) {
    return (r, i) => {
      let s = { ...i }, o = { ...this.defaults, ...s }, a = this.onError(!!o.silent, !!o.async);
      if (this.defaults.async === !0 && s.async === !1) return a(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
      if (typeof r > "u" || r === null) return a(new Error("marked(): input parameter is undefined or null"));
      if (typeof r != "string") return a(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(r) + ", string expected"));
      if (o.hooks && (o.hooks.options = o, o.hooks.block = t), o.async) return (async () => {
        let n = o.hooks ? await o.hooks.preprocess(r) : r, l = await (o.hooks ? await o.hooks.provideLexer() : t ? ye.lex : ye.lexInline)(n, o), c = o.hooks ? await o.hooks.processAllTokens(l) : l;
        o.walkTokens && await Promise.all(this.walkTokens(c, o.walkTokens));
        let h = await (o.hooks ? await o.hooks.provideParser() : t ? me.parse : me.parseInline)(c, o);
        return o.hooks ? await o.hooks.postprocess(h) : h;
      })().catch(a);
      try {
        o.hooks && (r = o.hooks.preprocess(r));
        let n = (o.hooks ? o.hooks.provideLexer() : t ? ye.lex : ye.lexInline)(r, o);
        o.hooks && (n = o.hooks.processAllTokens(n)), o.walkTokens && this.walkTokens(n, o.walkTokens);
        let l = (o.hooks ? o.hooks.provideParser() : t ? me.parse : me.parseInline)(n, o);
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
        let s = "<p>An error occurred:</p><pre>" + Be(i.message + "", !0) + "</pre>";
        return r ? Promise.resolve(s) : s;
      }
      if (r) return Promise.reject(i);
      throw i;
    };
  }
}, kr = new nw();
function $t(e, t) {
  return kr.parse(e, t);
}
$t.options = $t.setOptions = function(e) {
  return kr.setOptions(e), $t.defaults = kr.defaults, ff($t.defaults), $t;
};
$t.getDefaults = nl;
$t.defaults = Br;
$t.use = function(...e) {
  return kr.use(...e), $t.defaults = kr.defaults, ff($t.defaults), $t;
};
$t.walkTokens = function(e, t) {
  return kr.walkTokens(e, t);
};
$t.parseInline = kr.parseInline;
$t.Parser = me;
$t.parser = me.parse;
$t.Renderer = po;
$t.TextRenderer = gl;
$t.Lexer = ye;
$t.lexer = ye.lex;
$t.Tokenizer = fo;
$t.Hooks = zi;
$t.parse = $t;
$t.options;
$t.setOptions;
$t.use;
$t.walkTokens;
$t.parseInline;
me.parse;
ye.lex;
function Tf(e) {
  for (var t = [], r = 1; r < arguments.length; r++)
    t[r - 1] = arguments[r];
  var i = Array.from(typeof e == "string" ? [e] : e);
  i[i.length - 1] = i[i.length - 1].replace(/\r?\n([\t ]*)$/, "");
  var s = i.reduce(function(n, l) {
    var c = l.match(/\n([\t ]+|(?!\s).)/g);
    return c ? n.concat(c.map(function(h) {
      var d, u;
      return (u = (d = h.match(/[\t ]/g)) === null || d === void 0 ? void 0 : d.length) !== null && u !== void 0 ? u : 0;
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
    var c = a.match(/(?:^|\n)( *)$/), h = c ? c[1] : "", d = n;
    typeof n == "string" && n.includes(`
`) && (d = String(n).split(`
`).map(function(u, f) {
      return f === 0 ? u : "".concat(h).concat(u);
    }).join(`
`)), a += d + i[l + 1];
  }), a;
}
var ln = typeof performance < "u" && typeof performance.now == "function", Ir = /* @__PURE__ */ p(() => ln ? performance.now() : 0, "now"), Jo = "🧜 ", lw = "Mermaid render", hw = "Mermaid", cw = {
  parse: "tertiary",
  prepare: "secondary",
  measure: "primary",
  layout: "primary-dark",
  layoutCore: "error",
  draw: "primary-light",
  paint: "secondary-dark",
  serialize: "tertiary-dark",
  render: "primary-light"
}, ai;
ai = class {
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
    const i = Ir();
    try {
      return r();
    } finally {
      this.buckets[t] = (this.buckets[t] ?? 0) + (Ir() - i);
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
    const i = Ir();
    try {
      return await r();
    } finally {
      this.buckets[t] = (this.buckets[t] ?? 0) + (Ir() - i);
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
    const r = { name: t, start: Ir(), duration: -1, children: [] }, i = this.stack.at(-1);
    if (i ? i.children.push(r) : this.roots.push(r), this.stack.push(r), ln && typeof performance.mark == "function")
      try {
        performance.mark(`${Jo}${t} ▶`);
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
    const r = Ir();
    if (t.duration = r - t.start, ln && typeof performance.measure == "function")
      try {
        performance.measure(`${Jo}${t.name}`, {
          start: t.start,
          end: r,
          detail: {
            devtools: {
              dataType: "track-entry",
              track: lw,
              trackGroup: hw,
              color: cw[t.name] ?? "primary",
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
      const h = "  ".repeat(c), d = l.duration.toFixed(1).padStart(8), u = i > 0 ? `${(l.duration / i * 100).toFixed(0).padStart(3)}%` : "   -";
      o.push(`${d}  ${u}  ${h}${l.name}`);
      for (const f of l.children)
        a(f, c + 1);
      if (l.children.length > 0) {
        const f = l.children.reduce((m, x) => m + x.duration, 0), y = l.duration - f;
        if (y > 0.5) {
          const m = y.toFixed(1).padStart(8);
          o.push(`${m}       ${h}  (self)`);
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
    console.log(`${Jo}mermaid render profile · ${s}
${o.join(`
`)}`);
  }
}, p(ai, "Profiler");
globalThis.injected ??= {
  includeLargeFeatures: !0,
  profiling: !1,
  version: "0.0.0"
};
var dw = (
  // @ts-expect-error -- fastdom types aren't yet ESM-compatible, we need this hack
  k2.extend({
    /**
     * `requestAnimationFrame` is too slow compared to `queueMicrotask`.
     */
    raf(e) {
      typeof queueMicrotask == "function" ? queueMicrotask(e) : setTimeout(e, 0);
    }
  }).extend(T2)
), wr = dw;
function Bf(e, { markdownAutoWrap: t }) {
  const i = e.replace(/<br\/>/g, `
`).replace(/\n{2,}/g, `
`);
  return Tf(i);
}
p(Bf, "preprocessMarkdown");
function _f(e) {
  return e.split(/\\n|\n|<br\s*\/?>/gi).map(
    (t) => t.trim().match(/<[^>]+>|[^\s<>]+/g)?.map((r) => ({ content: r, type: "normal" })) ?? []
  );
}
p(_f, "nonMarkdownToLines");
function vf(e, t = {}) {
  const r = Bf(e, t), i = $t.lexer(r), s = [[]];
  let o = 0;
  function a(n, l = "normal") {
    n.type === "text" ? n.text.split(`
`).forEach((h, d) => {
      d !== 0 && (o++, s.push([])), h.split(" ").forEach((u) => {
        u = u.replace(/&#39;/g, "'"), u && s[o].push({ content: u, type: l });
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
p(vf, "markdownToLines");
function Lf(e) {
  return e ? `<p>${/**
  * Replace new lines with <br /> tags.
  *
  * Unlike in markdown text, `\n` sequences are treated as line breaks here.
  */
  e.replace(/\\n|\n/g, "<br />")}</p>` : "";
}
p(Lf, "nonMarkdownToHTML");
function Ff(e, { markdownAutoWrap: t } = {}) {
  const r = $t.lexer(e);
  function i(s) {
    return s.type === "text" ? t === !1 ? s.text.replace(/\n */g, "<br/>").replace(/ /g, "&nbsp;") : s.text.replace(/\n */g, "<br/>") : s.type === "strong" ? `<strong>${s.tokens?.map(i).join("")}</strong>` : s.type === "em" ? `<em>${s.tokens?.map(i).join("")}</em>` : s.type === "paragraph" ? `<p>${s.tokens?.map(i).join("")}</p>` : s.type === "space" ? "" : s.type === "html" ? `${s.text}` : s.type === "escape" ? s.text : (M.warn(`Unsupported markdown: ${s.type}`), s.raw);
  }
  return p(i, "output"), r.map(i).join("");
}
p(Ff, "markdownToHTML");
function Af(e) {
  return Intl.Segmenter ? [...new Intl.Segmenter().segment(e)].map((t) => t.segment) : [...e];
}
p(Af, "splitTextToChars");
function Ef(e, t) {
  const r = Af(t.content);
  return yl(e, [], r, t.type);
}
p(Ef, "splitWordToFitWidth");
function yl(e, t, r, i) {
  if (r.length === 0)
    return [
      { content: t.join(""), type: i },
      { content: "", type: i }
    ];
  const [s, ...o] = r, a = [...t, s];
  return e([{ content: a.join(""), type: i }]) ? yl(e, a, o, i) : (t.length === 0 && s && (t.push(s), r.shift()), [
    { content: t.join(""), type: i },
    { content: r.join(""), type: i }
  ]);
}
p(yl, "splitWordToFitWidthRecursion");
function Mf(e, t) {
  if (e.some(({ content: r }) => r.includes(`
`)))
    throw new Error("splitLineToFitWidth does not support newlines in the line");
  return go(e, t);
}
p(Mf, "splitLineToFitWidth");
function go(e, t, r = [], i = []) {
  if (e.length === 0)
    return i.length > 0 && r.push(i), r.length > 0 ? r : [];
  let s = "";
  e[0].content === " " && (s = " ", e.shift());
  const o = e.shift() ?? { content: " ", type: "normal" }, a = [...i];
  if (s !== "" && a.push({ content: s, type: "normal" }), a.push(o), t(a))
    return go(e, t, r, a);
  if (i.length > 0)
    r.push(i), e.unshift(o);
  else if (o.content) {
    const [n, l] = Ef(t, o);
    r.push([n]), l.content && e.unshift(l);
  }
  return go(e, t, r);
}
p(go, "splitLineToFitWidthRecursion");
function hn(e, t) {
  t && e.attr("style", t);
}
p(hn, "applyStyle");
var Zh = 16384;
async function $f(e, t, r, i, s = !1, o = Dt()) {
  const a = e.append("foreignObject");
  a.attr("width", `${Math.min(10 * r, Zh)}px`), a.attr("height", `${Math.min(10 * r, Zh)}px`);
  const n = a.append("xhtml:div"), l = es(t.label) ? await Vd(t.label.replace(fs.lineBreakRegex, `
`), o) : he(t.label, o), c = t.isNode ? "nodeLabel" : "edgeLabel", h = n.append("span");
  return h.html(l), hn(h, t.labelStyle), h.attr("class", `${c} ${i}`), hn(n, t.labelStyle), n.style("display", "table-cell"), n.style("white-space", "nowrap"), n.style("line-height", "1.5"), r !== Number.POSITIVE_INFINITY && (n.style("max-width", r + "px"), n.style("text-align", "center")), n.attr("xmlns", "http://www.w3.org/1999/xhtml"), s && n.attr("class", "labelBkg"), (await wr.measure(() => n.node().getBoundingClientRect())).width === r && (n.style("display", "table"), n.style("white-space", "break-spaces"), n.style("width", r + "px")), a.node();
}
p($f, "addHtmlSpan");
function Oo(e, t, r, i = !1) {
  const s = e.append("tspan").attr("class", "text-outer-tspan").attr("x", 0).attr("y", t * r - 0.1 + "em").attr("dy", r + "em");
  return i && s.attr("text-anchor", "middle"), s;
}
p(Oo, "createTspan");
function Of(e, t, r) {
  const i = e.append("text"), s = Oo(i, 1, t);
  Io(s, r);
  const o = s.node().getComputedTextLength();
  return i.remove(), o;
}
p(Of, "computeWidthOfText");
function uw(e, t, r) {
  const i = e.append("text"), s = Oo(i, 1, t);
  Io(s, [{ content: r, type: "normal" }]);
  const o = s.node()?.getBoundingClientRect();
  return o && i.remove(), o;
}
p(uw, "computeDimensionOfText");
function If(e, t, r, i = !1, s = !1) {
  const a = t.append("g"), n = a.insert("rect").attr("class", "background").attr("style", "stroke: none"), l = a.append("text").attr("y", "-10.1");
  s && l.attr("text-anchor", "middle");
  let c = 0;
  for (const h of r) {
    const d = /* @__PURE__ */ p((f) => Of(a, 1.1, f) <= e, "checkWidth"), u = d(h) ? [h] : Mf(h, d);
    for (const f of u) {
      const y = Oo(l, c, 1.1, s);
      Io(y, f), c++;
    }
  }
  if (i) {
    const h = l.node().getBBox(), d = 2;
    return n.attr("x", h.x - d).attr("y", h.y - d).attr("width", h.width + 2 * d).attr("height", h.height + 2 * d), a.node();
  } else
    return l.node();
}
p(If, "createFormattedText");
function cn(e) {
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
p(cn, "decodeHTMLEntities");
function Io(e, t) {
  e.text(""), t.forEach((r, i) => {
    const s = e.append("tspan").attr("font-style", r.type === "em" ? "italic" : "normal").attr("class", "text-inner-tspan").attr("font-weight", r.type === "strong" ? "bold" : "normal");
    i === 0 ? s.text(cn(r.content)) : s.text(" " + cn(r.content));
  });
}
p(Io, "updateTextContentAndStyles");
async function Df(e, t = {}) {
  const r = [];
  e.replace(/(fa[bklrs]?):fa-([\w-]+)/g, (s, o, a) => (r.push(
    (async () => {
      const n = `${o}:${a}`;
      return await w1(n) ? await ys(n, void 0, { class: "label-icon" }) : `<i class='${he(s, t).replace(":", " ")}'></i>`;
    })()
  ), s));
  const i = await Promise.all(r);
  return e.replace(/(fa[bklrs]?):fa-([\w-]+)/g, () => i.shift() ?? "");
}
p(Df, "replaceIconSubstring");
var we = /* @__PURE__ */ p(async (e, t = "", {
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
  if (M.debug(
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
    const d = a ? Ff(t, h) : Lf(t), u = await Df(er(d), h), f = t.replace(/\\\\/g, "\\"), y = {
      isNode: n,
      label: es(t) ? f : u,
      labelStyle: r.replace("fill:", "color:")
    };
    return await $f(e, y, l, s, c, h);
  } else {
    const d = er(t.replace(/<br\s*\/?>/g, "<br/>")), u = a ? vf(d.replace("<br>", "<br/>"), h) : _f(d), f = If(
      l,
      e,
      u,
      t ? c : !1,
      !n
    );
    if (n) {
      /stroke:/.exec(r) && (r = r.replace("stroke:", "lineColor:"));
      const y = r.replace(/stroke:[^;]+;?/g, "").replace(/stroke-width:[^;]+;?/g, "").replace(/fill:[^;]+;?/g, "").replace(/color:/g, "fill:");
      xt(f).attr("style", y);
    } else {
      const y = r.replace(/stroke:[^;]+;?/g, "").replace(/stroke-width:[^;]+;?/g, "").replace(/fill:[^;]+;?/g, "").replace(/background:/g, "fill:");
      xt(f).select("rect").attr("style", y.replace(/background:/g, "fill:"));
      const m = r.replace(/stroke:[^;]+;?/g, "").replace(/stroke-width:[^;]+;?/g, "").replace(/fill:[^;]+;?/g, "").replace(/color:/g, "fill:");
      xt(f).select("text").attr("style", m);
    }
    return i ? xt(f).selectAll("tspan.text-outer-tspan").classed("title-row", !0) : xt(f).selectAll("tspan.text-outer-tspan").classed("row", !0), f;
  }
}, "createText");
function ta(e, t, r) {
  if (e && e.length) {
    const [i, s] = t, o = Math.PI / 180 * r, a = Math.cos(o), n = Math.sin(o);
    for (const l of e) {
      const [c, h] = l;
      l[0] = (c - i) * a - (h - s) * n + i, l[1] = (c - i) * n + (h - s) * a + s;
    }
  }
}
function fw(e, t) {
  return e[0] === t[0] && e[1] === t[1];
}
function pw(e, t, r, i = 1) {
  const s = r, o = Math.max(t, 0.1), a = e[0] && e[0][0] && typeof e[0][0] == "number" ? [e] : e, n = [0, 0];
  if (s) for (const c of a) ta(c, n, s);
  const l = (function(c, h, d) {
    const u = [];
    for (const b of c) {
      const w = [...b];
      fw(w[0], w[w.length - 1]) || w.push([w[0][0], w[0][1]]), w.length > 2 && u.push(w);
    }
    const f = [];
    h = Math.max(h, 0.1);
    const y = [];
    for (const b of u) for (let w = 0; w < b.length - 1; w++) {
      const T = b[w], B = b[w + 1];
      if (T[1] !== B[1]) {
        const L = Math.min(T[1], B[1]);
        y.push({ ymin: L, ymax: Math.max(T[1], B[1]), x: L === T[1] ? T[0] : B[0], islope: (B[0] - T[0]) / (B[1] - T[1]) });
      }
    }
    if (y.sort(((b, w) => b.ymin < w.ymin ? -1 : b.ymin > w.ymin ? 1 : b.x < w.x ? -1 : b.x > w.x ? 1 : b.ymax === w.ymax ? 0 : (b.ymax - w.ymax) / Math.abs(b.ymax - w.ymax))), !y.length) return f;
    let m = [], x = y[0].ymin, C = 0;
    for (; m.length || y.length; ) {
      if (y.length) {
        let b = -1;
        for (let w = 0; w < y.length && !(y[w].ymin > x); w++) b = w;
        y.splice(0, b + 1).forEach(((w) => {
          m.push({ s: x, edge: w });
        }));
      }
      if (m = m.filter(((b) => !(b.edge.ymax <= x))), m.sort(((b, w) => b.edge.x === w.edge.x ? 0 : (b.edge.x - w.edge.x) / Math.abs(b.edge.x - w.edge.x))), (d !== 1 || C % h == 0) && m.length > 1) for (let b = 0; b < m.length; b += 2) {
        const w = b + 1;
        if (w >= m.length) break;
        const T = m[b].edge, B = m[w].edge;
        f.push([[Math.round(T.x), x], [Math.round(B.x), x]]);
      }
      x += d, m.forEach(((b) => {
        b.edge.x = b.edge.x + d * b.edge.islope;
      })), C++;
    }
    return f;
  })(a, o, i);
  if (s) {
    for (const c of a) ta(c, n, -s);
    (function(c, h, d) {
      const u = [];
      c.forEach(((f) => u.push(...f))), ta(u, h, d);
    })(l, n, -s);
  }
  return l;
}
function Cs(e, t) {
  var r;
  const i = t.hachureAngle + 90;
  let s = t.hachureGap;
  s < 0 && (s = 4 * t.strokeWidth), s = Math.round(Math.max(s, 0.1));
  let o = 1;
  return t.roughness >= 1 && (((r = t.randomizer) === null || r === void 0 ? void 0 : r.next()) || Math.random()) > 0.7 && (o = s), pw(e, s, i, o || 1);
}
class ml {
  constructor(t) {
    this.helper = t;
  }
  fillPolygons(t, r) {
    return this._fillPolygons(t, r);
  }
  _fillPolygons(t, r) {
    const i = Cs(t, r);
    return { type: "fillSketch", ops: this.renderLines(i, r) };
  }
  renderLines(t, r) {
    const i = [];
    for (const s of t) i.push(...this.helper.doubleLineOps(s[0][0], s[0][1], s[1][0], s[1][1], r));
    return i;
  }
}
function Do(e) {
  const t = e[0], r = e[1];
  return Math.sqrt(Math.pow(t[0] - r[0], 2) + Math.pow(t[1] - r[1], 2));
}
class gw extends ml {
  fillPolygons(t, r) {
    let i = r.hachureGap;
    i < 0 && (i = 4 * r.strokeWidth), i = Math.max(i, 0.1);
    const s = Cs(t, Object.assign({}, r, { hachureGap: i })), o = Math.PI / 180 * r.hachureAngle, a = [], n = 0.5 * i * Math.cos(o), l = 0.5 * i * Math.sin(o);
    for (const [c, h] of s) Do([c, h]) && a.push([[c[0] - n, c[1] + l], [...h]], [[c[0] + n, c[1] - l], [...h]]);
    return { type: "fillSketch", ops: this.renderLines(a, r) };
  }
}
class yw extends ml {
  fillPolygons(t, r) {
    const i = this._fillPolygons(t, r), s = Object.assign({}, r, { hachureAngle: r.hachureAngle + 90 }), o = this._fillPolygons(t, s);
    return i.ops = i.ops.concat(o.ops), i;
  }
}
class mw {
  constructor(t) {
    this.helper = t;
  }
  fillPolygons(t, r) {
    const i = Cs(t, r = Object.assign({}, r, { hachureAngle: 0 }));
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
      const l = Do(n), c = l / s, h = Math.ceil(c) - 1, d = l - h * s, u = (n[0][0] + n[1][0]) / 2 - s / 4, f = Math.min(n[0][1], n[1][1]);
      for (let y = 0; y < h; y++) {
        const m = f + d + y * s, x = u - a + 2 * Math.random() * a, C = m - a + 2 * Math.random() * a, b = this.helper.ellipse(x, C, o, o, r);
        i.push(...b.ops);
      }
    }
    return { type: "fillSketch", ops: i };
  }
}
class xw {
  constructor(t) {
    this.helper = t;
  }
  fillPolygons(t, r) {
    const i = Cs(t, r);
    return { type: "fillSketch", ops: this.dashedLine(i, r) };
  }
  dashedLine(t, r) {
    const i = r.dashOffset < 0 ? r.hachureGap < 0 ? 4 * r.strokeWidth : r.hachureGap : r.dashOffset, s = r.dashGap < 0 ? r.hachureGap < 0 ? 4 * r.strokeWidth : r.hachureGap : r.dashGap, o = [];
    return t.forEach(((a) => {
      const n = Do(a), l = Math.floor(n / (i + s)), c = (n + s - l * (i + s)) / 2;
      let h = a[0], d = a[1];
      h[0] > d[0] && (h = a[1], d = a[0]);
      const u = Math.atan((d[1] - h[1]) / (d[0] - h[0]));
      for (let f = 0; f < l; f++) {
        const y = f * (i + s), m = y + i, x = [h[0] + y * Math.cos(u) + c * Math.cos(u), h[1] + y * Math.sin(u) + c * Math.sin(u)], C = [h[0] + m * Math.cos(u) + c * Math.cos(u), h[1] + m * Math.sin(u) + c * Math.sin(u)];
        o.push(...this.helper.doubleLineOps(x[0], x[1], C[0], C[1], r));
      }
    })), o;
  }
}
class Cw {
  constructor(t) {
    this.helper = t;
  }
  fillPolygons(t, r) {
    const i = r.hachureGap < 0 ? 4 * r.strokeWidth : r.hachureGap, s = r.zigzagOffset < 0 ? i : r.zigzagOffset, o = Cs(t, r = Object.assign({}, r, { hachureGap: i + s }));
    return { type: "fillSketch", ops: this.zigzagLines(o, s, r) };
  }
  zigzagLines(t, r, i) {
    const s = [];
    return t.forEach(((o) => {
      const a = Do(o), n = Math.round(a / (2 * r));
      let l = o[0], c = o[1];
      l[0] > c[0] && (l = o[1], c = o[0]);
      const h = Math.atan((c[1] - l[1]) / (c[0] - l[0]));
      for (let d = 0; d < n; d++) {
        const u = 2 * d * r, f = 2 * (d + 1) * r, y = Math.sqrt(2 * Math.pow(r, 2)), m = [l[0] + u * Math.cos(h), l[1] + u * Math.sin(h)], x = [l[0] + f * Math.cos(h), l[1] + f * Math.sin(h)], C = [m[0] + y * Math.cos(h + Math.PI / 4), m[1] + y * Math.sin(h + Math.PI / 4)];
        s.push(...this.helper.doubleLineOps(m[0], m[1], C[0], C[1], i), ...this.helper.doubleLineOps(C[0], C[1], x[0], x[1], i));
      }
    })), s;
  }
}
const ee = {};
class bw {
  constructor(t) {
    this.seed = t;
  }
  next() {
    return this.seed ? (2 ** 31 - 1 & (this.seed = Math.imul(48271, this.seed))) / 2 ** 31 : Math.random();
  }
}
const kw = 0, ea = 1, Qh = 2, As = { A: 7, a: 7, C: 6, c: 6, H: 1, h: 1, L: 2, l: 2, M: 2, m: 2, Q: 4, q: 4, S: 4, s: 4, T: 2, t: 2, V: 1, v: 1, Z: 0, z: 0 };
function ra(e, t) {
  return e.type === t;
}
function xl(e) {
  const t = [], r = (function(a) {
    const n = new Array();
    for (; a !== ""; ) if (a.match(/^([ \t\r\n,]+)/)) a = a.substr(RegExp.$1.length);
    else if (a.match(/^([aAcChHlLmMqQsStTvVzZ])/)) n[n.length] = { type: kw, text: RegExp.$1 }, a = a.substr(RegExp.$1.length);
    else {
      if (!a.match(/^(([-+]?[0-9]+(\.[0-9]*)?|[-+]?\.[0-9]+)([eE][-+]?[0-9]+)?)/)) return [];
      n[n.length] = { type: ea, text: `${parseFloat(RegExp.$1)}` }, a = a.substr(RegExp.$1.length);
    }
    return n[n.length] = { type: Qh, text: "" }, n;
  })(e);
  let i = "BOD", s = 0, o = r[s];
  for (; !ra(o, Qh); ) {
    let a = 0;
    const n = [];
    if (i === "BOD") {
      if (o.text !== "M" && o.text !== "m") return xl("M0,0" + e);
      s++, a = As[o.text], i = o.text;
    } else ra(o, ea) ? a = As[i] : (s++, a = As[o.text], i = o.text);
    if (!(s + a < r.length)) throw new Error("Path data ended short");
    for (let l = s; l < s + a; l++) {
      const c = r[l];
      if (!ra(c, ea)) throw new Error("Param not a number: " + i + "," + c.text);
      n[n.length] = +c.text;
    }
    if (typeof As[i] != "number") throw new Error("Bad segment: " + i);
    {
      const l = { key: i, data: n };
      t.push(l), s += a, o = r[s], i === "M" && (i = "L"), i === "m" && (i = "l");
    }
  }
  return t;
}
function Pf(e) {
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
function Rf(e) {
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
        let d = 0, u = 0;
        r === "C" || r === "S" ? (d = i + (i - n), u = s + (s - l)) : (d = i, u = s), t.push({ key: "C", data: [d, u, ...h] }), n = h[0], l = h[1], i = h[2], s = h[3];
        break;
      }
      case "T": {
        const [d, u] = h;
        let f = 0, y = 0;
        r === "Q" || r === "T" ? (f = i + (i - n), y = s + (s - l)) : (f = i, y = s);
        const m = i + 2 * (f - i) / 3, x = s + 2 * (y - s) / 3, C = d + 2 * (f - d) / 3, b = u + 2 * (y - u) / 3;
        t.push({ key: "C", data: [m, x, C, b, d, u] }), n = f, l = y, i = d, s = u;
        break;
      }
      case "Q": {
        const [d, u, f, y] = h, m = i + 2 * (d - i) / 3, x = s + 2 * (u - s) / 3, C = f + 2 * (d - f) / 3, b = y + 2 * (u - y) / 3;
        t.push({ key: "C", data: [m, x, C, b, f, y] }), n = d, l = u, i = f, s = y;
        break;
      }
      case "A": {
        const d = Math.abs(h[0]), u = Math.abs(h[1]), f = h[2], y = h[3], m = h[4], x = h[5], C = h[6];
        d === 0 || u === 0 ? (t.push({ key: "C", data: [i, s, x, C, x, C] }), i = x, s = C) : (i !== x || s !== C) && (qf(i, s, x, C, d, u, f, y, m).forEach((function(b) {
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
function $i(e, t, r) {
  return [e * Math.cos(r) - t * Math.sin(r), e * Math.sin(r) + t * Math.cos(r)];
}
function qf(e, t, r, i, s, o, a, n, l, c) {
  const h = (d = a, Math.PI * d / 180);
  var d;
  let u = [], f = 0, y = 0, m = 0, x = 0;
  if (c) [f, y, m, x] = c;
  else {
    [e, t] = $i(e, t, -h), [r, i] = $i(r, i, -h);
    const W = (e - r) / 2, z = (t - i) / 2;
    let V = W * W / (s * s) + z * z / (o * o);
    V > 1 && (V = Math.sqrt(V), s *= V, o *= V);
    const $ = s * s, P = o * o, Y = $ * P - $ * z * z - P * W * W, lt = $ * z * z + P * W * W, at = (n === l ? -1 : 1) * Math.sqrt(Math.abs(Y / lt));
    m = at * s * z / o + (e + r) / 2, x = at * -o * W / s + (t + i) / 2, f = Math.asin(parseFloat(((t - x) / o).toFixed(9))), y = Math.asin(parseFloat(((i - x) / o).toFixed(9))), e < m && (f = Math.PI - f), r < m && (y = Math.PI - y), f < 0 && (f = 2 * Math.PI + f), y < 0 && (y = 2 * Math.PI + y), l && f > y && (f -= 2 * Math.PI), !l && y > f && (y -= 2 * Math.PI);
  }
  let C = y - f;
  if (Math.abs(C) > 120 * Math.PI / 180) {
    const W = y, z = r, V = i;
    y = l && y > f ? f + 120 * Math.PI / 180 * 1 : f + 120 * Math.PI / 180 * -1, u = qf(r = m + s * Math.cos(y), i = x + o * Math.sin(y), z, V, s, o, a, 0, l, [y, W, m, x]);
  }
  C = y - f;
  const b = Math.cos(f), w = Math.sin(f), T = Math.cos(y), B = Math.sin(y), L = Math.tan(C / 4), v = 4 / 3 * s * L, _ = 4 / 3 * o * L, R = [e, t], N = [e + v * w, t - _ * b], q = [r + v * B, i - _ * T], J = [r, i];
  if (N[0] = 2 * R[0] - N[0], N[1] = 2 * R[1] - N[1], c) return [N, q, J].concat(u);
  {
    u = [N, q, J].concat(u);
    const W = [];
    for (let z = 0; z < u.length; z += 3) {
      const V = $i(u[z][0], u[z][1], h), $ = $i(u[z + 1][0], u[z + 1][1], h), P = $i(u[z + 2][0], u[z + 2][1], h);
      W.push([V[0], V[1], $[0], $[1], P[0], P[1]]);
    }
    return W;
  }
}
const ww = { randOffset: function(e, t) {
  return pt(e, t);
}, randOffsetWithRange: function(e, t, r) {
  return yo(e, t, r);
}, ellipse: function(e, t, r, i, s) {
  const o = Wf(r, i, s);
  return dn(e, t, s, o).opset;
}, doubleLineOps: function(e, t, r, i, s) {
  return rr(e, t, r, i, s, !0);
} };
function Nf(e, t, r, i, s) {
  return { type: "path", ops: rr(e, t, r, i, s) };
}
function Xs(e, t, r) {
  const i = (e || []).length;
  if (i > 2) {
    const s = [];
    for (let o = 0; o < i - 1; o++) s.push(...rr(e[o][0], e[o][1], e[o + 1][0], e[o + 1][1], r));
    return t && s.push(...rr(e[i - 1][0], e[i - 1][1], e[0][0], e[0][1], r)), { type: "path", ops: s };
  }
  return i === 2 ? Nf(e[0][0], e[0][1], e[1][0], e[1][1], r) : { type: "path", ops: [] };
}
function Sw(e, t, r, i, s) {
  return (function(o, a) {
    return Xs(o, !0, a);
  })([[e, t], [e + r, t], [e + r, t + i], [e, t + i]], s);
}
function Jh(e, t) {
  if (e.length) {
    const r = typeof e[0][0] == "number" ? [e] : e, i = Es(r[0], 1 * (1 + 0.2 * t.roughness), t), s = t.disableMultiStroke ? [] : Es(r[0], 1.5 * (1 + 0.22 * t.roughness), rc(t));
    for (let o = 1; o < r.length; o++) {
      const a = r[o];
      if (a.length) {
        const n = Es(a, 1 * (1 + 0.2 * t.roughness), t), l = t.disableMultiStroke ? [] : Es(a, 1.5 * (1 + 0.22 * t.roughness), rc(t));
        for (const c of n) c.op !== "move" && i.push(c);
        for (const c of l) c.op !== "move" && s.push(c);
      }
    }
    return { type: "path", ops: i.concat(s) };
  }
  return { type: "path", ops: [] };
}
function Wf(e, t, r) {
  const i = Math.sqrt(2 * Math.PI * Math.sqrt((Math.pow(e / 2, 2) + Math.pow(t / 2, 2)) / 2)), s = Math.ceil(Math.max(r.curveStepCount, r.curveStepCount / Math.sqrt(200) * i)), o = 2 * Math.PI / s;
  let a = Math.abs(e / 2), n = Math.abs(t / 2);
  const l = 1 - r.curveFitting;
  return a += pt(a * l, r), n += pt(n * l, r), { increment: o, rx: a, ry: n };
}
function dn(e, t, r, i) {
  const [s, o] = ic(i.increment, e, t, i.rx, i.ry, 1, i.increment * yo(0.1, yo(0.4, 1, r), r), r);
  let a = mo(s, null, r);
  if (!r.disableMultiStroke && r.roughness !== 0) {
    const [n] = ic(i.increment, e, t, i.rx, i.ry, 1.5, 0, r), l = mo(n, null, r);
    a = a.concat(l);
  }
  return { estimatedPoints: o, opset: { type: "path", ops: a } };
}
function tc(e, t, r, i, s, o, a, n, l) {
  const c = e, h = t;
  let d = Math.abs(r / 2), u = Math.abs(i / 2);
  d += pt(0.01 * d, l), u += pt(0.01 * u, l);
  let f = s, y = o;
  for (; f < 0; ) f += 2 * Math.PI, y += 2 * Math.PI;
  y - f > 2 * Math.PI && (f = 0, y = 2 * Math.PI);
  const m = 2 * Math.PI / l.curveStepCount, x = Math.min(m / 2, (y - f) / 2), C = sc(x, c, h, d, u, f, y, 1, l);
  if (!l.disableMultiStroke) {
    const b = sc(x, c, h, d, u, f, y, 1.5, l);
    C.push(...b);
  }
  return a && (n ? C.push(...rr(c, h, c + d * Math.cos(f), h + u * Math.sin(f), l), ...rr(c, h, c + d * Math.cos(y), h + u * Math.sin(y), l)) : C.push({ op: "lineTo", data: [c, h] }, { op: "lineTo", data: [c + d * Math.cos(f), h + u * Math.sin(f)] })), { type: "path", ops: C };
}
function ec(e, t) {
  const r = Rf(Pf(xl(e))), i = [];
  let s = [0, 0], o = [0, 0];
  for (const { key: a, data: n } of r) switch (a) {
    case "M":
      o = [n[0], n[1]], s = [n[0], n[1]];
      break;
    case "L":
      i.push(...rr(o[0], o[1], n[0], n[1], t)), o = [n[0], n[1]];
      break;
    case "C": {
      const [l, c, h, d, u, f] = n;
      i.push(...Tw(l, c, h, d, u, f, o, t)), o = [u, f];
      break;
    }
    case "Z":
      i.push(...rr(o[0], o[1], s[0], s[1], t)), o = [s[0], s[1]];
  }
  return { type: "path", ops: i };
}
function ia(e, t) {
  const r = [];
  for (const i of e) if (i.length) {
    const s = t.maxRandomnessOffset || 0, o = i.length;
    if (o > 2) {
      r.push({ op: "move", data: [i[0][0] + pt(s, t), i[0][1] + pt(s, t)] });
      for (let a = 1; a < o; a++) r.push({ op: "lineTo", data: [i[a][0] + pt(s, t), i[a][1] + pt(s, t)] });
    }
  }
  return { type: "fillPath", ops: r };
}
function Dr(e, t) {
  return (function(r, i) {
    let s = r.fillStyle || "hachure";
    if (!ee[s]) switch (s) {
      case "zigzag":
        ee[s] || (ee[s] = new gw(i));
        break;
      case "cross-hatch":
        ee[s] || (ee[s] = new yw(i));
        break;
      case "dots":
        ee[s] || (ee[s] = new mw(i));
        break;
      case "dashed":
        ee[s] || (ee[s] = new xw(i));
        break;
      case "zigzag-line":
        ee[s] || (ee[s] = new Cw(i));
        break;
      default:
        s = "hachure", ee[s] || (ee[s] = new ml(i));
    }
    return ee[s];
  })(t, ww).fillPolygons(e, t);
}
function rc(e) {
  const t = Object.assign({}, e);
  return t.randomizer = void 0, e.seed && (t.seed = e.seed + 1), t;
}
function zf(e) {
  return e.randomizer || (e.randomizer = new bw(e.seed || 0)), e.randomizer.next();
}
function yo(e, t, r, i = 1) {
  return r.roughness * i * (zf(r) * (t - e) + e);
}
function pt(e, t, r = 1) {
  return yo(-e, e, t, r);
}
function rr(e, t, r, i, s, o = !1) {
  const a = o ? s.disableMultiStrokeFill : s.disableMultiStroke, n = un(e, t, r, i, s, !0, !1);
  if (a) return n;
  const l = un(e, t, r, i, s, !0, !0);
  return n.concat(l);
}
function un(e, t, r, i, s, o, a) {
  const n = Math.pow(e - r, 2) + Math.pow(t - i, 2), l = Math.sqrt(n);
  let c = 1;
  c = l < 200 ? 1 : l > 500 ? 0.4 : -16668e-7 * l + 1.233334;
  let h = s.maxRandomnessOffset || 0;
  h * h * 100 > n && (h = l / 10);
  const d = h / 2, u = 0.2 + 0.2 * zf(s);
  let f = s.bowing * s.maxRandomnessOffset * (i - t) / 200, y = s.bowing * s.maxRandomnessOffset * (e - r) / 200;
  f = pt(f, s, c), y = pt(y, s, c);
  const m = [], x = () => pt(d, s, c), C = () => pt(h, s, c), b = s.preserveVertices;
  return a ? m.push({ op: "move", data: [e + (b ? 0 : x()), t + (b ? 0 : x())] }) : m.push({ op: "move", data: [e + (b ? 0 : pt(h, s, c)), t + (b ? 0 : pt(h, s, c))] }), a ? m.push({ op: "bcurveTo", data: [f + e + (r - e) * u + x(), y + t + (i - t) * u + x(), f + e + 2 * (r - e) * u + x(), y + t + 2 * (i - t) * u + x(), r + (b ? 0 : x()), i + (b ? 0 : x())] }) : m.push({ op: "bcurveTo", data: [f + e + (r - e) * u + C(), y + t + (i - t) * u + C(), f + e + 2 * (r - e) * u + C(), y + t + 2 * (i - t) * u + C(), r + (b ? 0 : C()), i + (b ? 0 : C())] }), m;
}
function Es(e, t, r) {
  if (!e.length) return [];
  const i = [];
  i.push([e[0][0] + pt(t, r), e[0][1] + pt(t, r)]), i.push([e[0][0] + pt(t, r), e[0][1] + pt(t, r)]);
  for (let s = 1; s < e.length; s++) i.push([e[s][0] + pt(t, r), e[s][1] + pt(t, r)]), s === e.length - 1 && i.push([e[s][0] + pt(t, r), e[s][1] + pt(t, r)]);
  return mo(i, null, r);
}
function mo(e, t, r) {
  const i = e.length, s = [];
  if (i > 3) {
    const o = [], a = 1 - r.curveTightness;
    s.push({ op: "move", data: [e[1][0], e[1][1]] });
    for (let n = 1; n + 2 < i; n++) {
      const l = e[n];
      o[0] = [l[0], l[1]], o[1] = [l[0] + (a * e[n + 1][0] - a * e[n - 1][0]) / 6, l[1] + (a * e[n + 1][1] - a * e[n - 1][1]) / 6], o[2] = [e[n + 1][0] + (a * e[n][0] - a * e[n + 2][0]) / 6, e[n + 1][1] + (a * e[n][1] - a * e[n + 2][1]) / 6], o[3] = [e[n + 1][0], e[n + 1][1]], s.push({ op: "bcurveTo", data: [o[1][0], o[1][1], o[2][0], o[2][1], o[3][0], o[3][1]] });
    }
  } else i === 3 ? (s.push({ op: "move", data: [e[1][0], e[1][1]] }), s.push({ op: "bcurveTo", data: [e[1][0], e[1][1], e[2][0], e[2][1], e[2][0], e[2][1]] })) : i === 2 && s.push(...un(e[0][0], e[0][1], e[1][0], e[1][1], r, !0, !0));
  return s;
}
function ic(e, t, r, i, s, o, a, n) {
  const l = [], c = [];
  if (n.roughness === 0) {
    e /= 4, c.push([t + i * Math.cos(-e), r + s * Math.sin(-e)]);
    for (let h = 0; h <= 2 * Math.PI; h += e) {
      const d = [t + i * Math.cos(h), r + s * Math.sin(h)];
      l.push(d), c.push(d);
    }
    c.push([t + i * Math.cos(0), r + s * Math.sin(0)]), c.push([t + i * Math.cos(e), r + s * Math.sin(e)]);
  } else {
    const h = pt(0.5, n) - Math.PI / 2;
    c.push([pt(o, n) + t + 0.9 * i * Math.cos(h - e), pt(o, n) + r + 0.9 * s * Math.sin(h - e)]);
    const d = 2 * Math.PI + h - 0.01;
    for (let u = h; u < d; u += e) {
      const f = [pt(o, n) + t + i * Math.cos(u), pt(o, n) + r + s * Math.sin(u)];
      l.push(f), c.push(f);
    }
    c.push([pt(o, n) + t + i * Math.cos(h + 2 * Math.PI + 0.5 * a), pt(o, n) + r + s * Math.sin(h + 2 * Math.PI + 0.5 * a)]), c.push([pt(o, n) + t + 0.98 * i * Math.cos(h + a), pt(o, n) + r + 0.98 * s * Math.sin(h + a)]), c.push([pt(o, n) + t + 0.9 * i * Math.cos(h + 0.5 * a), pt(o, n) + r + 0.9 * s * Math.sin(h + 0.5 * a)]);
  }
  return [c, l];
}
function sc(e, t, r, i, s, o, a, n, l) {
  const c = o + pt(0.1, l), h = [];
  h.push([pt(n, l) + t + 0.9 * i * Math.cos(c - e), pt(n, l) + r + 0.9 * s * Math.sin(c - e)]);
  for (let d = c; d <= a; d += e) h.push([pt(n, l) + t + i * Math.cos(d), pt(n, l) + r + s * Math.sin(d)]);
  return h.push([t + i * Math.cos(a), r + s * Math.sin(a)]), h.push([t + i * Math.cos(a), r + s * Math.sin(a)]), mo(h, null, l);
}
function Tw(e, t, r, i, s, o, a, n) {
  const l = [], c = [n.maxRandomnessOffset || 1, (n.maxRandomnessOffset || 1) + 0.3];
  let h = [0, 0];
  const d = n.disableMultiStroke ? 1 : 2, u = n.preserveVertices;
  for (let f = 0; f < d; f++) f === 0 ? l.push({ op: "move", data: [a[0], a[1]] }) : l.push({ op: "move", data: [a[0] + (u ? 0 : pt(c[0], n)), a[1] + (u ? 0 : pt(c[0], n))] }), h = u ? [s, o] : [s + pt(c[f], n), o + pt(c[f], n)], l.push({ op: "bcurveTo", data: [e + pt(c[f], n), t + pt(c[f], n), r + pt(c[f], n), i + pt(c[f], n), h[0], h[1]] });
  return l;
}
function Oi(e) {
  return [...e];
}
function oc(e, t = 0) {
  const r = e.length;
  if (r < 3) throw new Error("A curve must have at least three points.");
  const i = [];
  if (r === 3) i.push(Oi(e[0]), Oi(e[1]), Oi(e[2]), Oi(e[2]));
  else {
    const s = [];
    s.push(e[0], e[0]);
    for (let n = 1; n < e.length; n++) s.push(e[n]), n === e.length - 1 && s.push(e[n]);
    const o = [], a = 1 - t;
    i.push(Oi(s[0]));
    for (let n = 1; n + 2 < s.length; n++) {
      const l = s[n];
      o[0] = [l[0], l[1]], o[1] = [l[0] + (a * s[n + 1][0] - a * s[n - 1][0]) / 6, l[1] + (a * s[n + 1][1] - a * s[n - 1][1]) / 6], o[2] = [s[n + 1][0] + (a * s[n][0] - a * s[n + 2][0]) / 6, s[n + 1][1] + (a * s[n][1] - a * s[n + 2][1]) / 6], o[3] = [s[n + 1][0], s[n + 1][1]], i.push(o[1], o[2], o[3]);
    }
  }
  return i;
}
function js(e, t) {
  return Math.pow(e[0] - t[0], 2) + Math.pow(e[1] - t[1], 2);
}
function Bw(e, t, r) {
  const i = js(t, r);
  if (i === 0) return js(e, t);
  let s = ((e[0] - t[0]) * (r[0] - t[0]) + (e[1] - t[1]) * (r[1] - t[1])) / i;
  return s = Math.max(0, Math.min(1, s)), js(e, hr(t, r, s));
}
function hr(e, t, r) {
  return [e[0] + (t[0] - e[0]) * r, e[1] + (t[1] - e[1]) * r];
}
function fn(e, t, r, i) {
  const s = i || [];
  if ((function(n, l) {
    const c = n[l + 0], h = n[l + 1], d = n[l + 2], u = n[l + 3];
    let f = 3 * h[0] - 2 * c[0] - u[0];
    f *= f;
    let y = 3 * h[1] - 2 * c[1] - u[1];
    y *= y;
    let m = 3 * d[0] - 2 * u[0] - c[0];
    m *= m;
    let x = 3 * d[1] - 2 * u[1] - c[1];
    return x *= x, f < m && (f = m), y < x && (y = x), f + y;
  })(e, t) < r) {
    const n = e[t + 0];
    s.length ? (o = s[s.length - 1], a = n, Math.sqrt(js(o, a)) > 1 && s.push(n)) : s.push(n), s.push(e[t + 3]);
  } else {
    const l = e[t + 0], c = e[t + 1], h = e[t + 2], d = e[t + 3], u = hr(l, c, 0.5), f = hr(c, h, 0.5), y = hr(h, d, 0.5), m = hr(u, f, 0.5), x = hr(f, y, 0.5), C = hr(m, x, 0.5);
    fn([l, u, m, C], 0, r, s), fn([C, x, y, d], 0, r, s);
  }
  var o, a;
  return s;
}
function _w(e, t) {
  return xo(e, 0, e.length, t);
}
function xo(e, t, r, i, s) {
  const o = s || [], a = e[t], n = e[r - 1];
  let l = 0, c = 1;
  for (let h = t + 1; h < r - 1; ++h) {
    const d = Bw(e[h], a, n);
    d > l && (l = d, c = h);
  }
  return Math.sqrt(l) > i ? (xo(e, t, c + 1, i, o), xo(e, c, r, i, o)) : (o.length || o.push(a), o.push(n)), o;
}
function sa(e, t = 0.15, r) {
  const i = [], s = (e.length - 1) / 3;
  for (let o = 0; o < s; o++)
    fn(e, 3 * o, t, i);
  return r && r > 0 ? xo(i, 0, i.length, r) : i;
}
const oe = "none";
class Co {
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
    return this._d("line", [Nf(t, r, i, s, a)], a);
  }
  rectangle(t, r, i, s, o) {
    const a = this._o(o), n = [], l = Sw(t, r, i, s, a);
    if (a.fill) {
      const c = [[t, r], [t + i, r], [t + i, r + s], [t, r + s]];
      a.fillStyle === "solid" ? n.push(ia([c], a)) : n.push(Dr([c], a));
    }
    return a.stroke !== oe && n.push(l), this._d("rectangle", n, a);
  }
  ellipse(t, r, i, s, o) {
    const a = this._o(o), n = [], l = Wf(i, s, a), c = dn(t, r, a, l);
    if (a.fill) if (a.fillStyle === "solid") {
      const h = dn(t, r, a, l).opset;
      h.type = "fillPath", n.push(h);
    } else n.push(Dr([c.estimatedPoints], a));
    return a.stroke !== oe && n.push(c.opset), this._d("ellipse", n, a);
  }
  circle(t, r, i, s) {
    const o = this.ellipse(t, r, i, i, s);
    return o.shape = "circle", o;
  }
  linearPath(t, r) {
    const i = this._o(r);
    return this._d("linearPath", [Xs(t, !1, i)], i);
  }
  arc(t, r, i, s, o, a, n = !1, l) {
    const c = this._o(l), h = [], d = tc(t, r, i, s, o, a, n, !0, c);
    if (n && c.fill) if (c.fillStyle === "solid") {
      const u = Object.assign({}, c);
      u.disableMultiStroke = !0;
      const f = tc(t, r, i, s, o, a, !0, !1, u);
      f.type = "fillPath", h.push(f);
    } else h.push((function(u, f, y, m, x, C, b) {
      const w = u, T = f;
      let B = Math.abs(y / 2), L = Math.abs(m / 2);
      B += pt(0.01 * B, b), L += pt(0.01 * L, b);
      let v = x, _ = C;
      for (; v < 0; ) v += 2 * Math.PI, _ += 2 * Math.PI;
      _ - v > 2 * Math.PI && (v = 0, _ = 2 * Math.PI);
      const R = (_ - v) / b.curveStepCount, N = [];
      for (let q = v; q <= _; q += R) N.push([w + B * Math.cos(q), T + L * Math.sin(q)]);
      return N.push([w + B * Math.cos(_), T + L * Math.sin(_)]), N.push([w, T]), Dr([N], b);
    })(t, r, i, s, o, a, c));
    return c.stroke !== oe && h.push(d), this._d("arc", h, c);
  }
  curve(t, r) {
    const i = this._o(r), s = [], o = Jh(t, i);
    if (i.fill && i.fill !== oe) if (i.fillStyle === "solid") {
      const a = Jh(t, Object.assign(Object.assign({}, i), { disableMultiStroke: !0, roughness: i.roughness ? i.roughness + i.fillShapeRoughnessGain : 0 }));
      s.push({ type: "fillPath", ops: this._mergedShape(a.ops) });
    } else {
      const a = [], n = t;
      if (n.length) {
        const l = typeof n[0][0] == "number" ? [n] : n;
        for (const c of l) c.length < 3 ? a.push(...c) : c.length === 3 ? a.push(...sa(oc([c[0], c[0], c[1], c[2]]), 10, (1 + i.roughness) / 2)) : a.push(...sa(oc(c), 10, (1 + i.roughness) / 2));
      }
      a.length && s.push(Dr([a], i));
    }
    return i.stroke !== oe && s.push(o), this._d("curve", s, i);
  }
  polygon(t, r) {
    const i = this._o(r), s = [], o = Xs(t, !0, i);
    return i.fill && (i.fillStyle === "solid" ? s.push(ia([t], i)) : s.push(Dr([t], i))), i.stroke !== oe && s.push(o), this._d("polygon", s, i);
  }
  path(t, r) {
    const i = this._o(r), s = [];
    if (!t) return this._d("path", s, i);
    t = (t || "").replace(/\n/g, " ").replace(/(-\s)/g, "-").replace("/(ss)/g", " ");
    const o = i.fill && i.fill !== "transparent" && i.fill !== oe, a = i.stroke !== oe, n = !!(i.simplification && i.simplification < 1), l = (function(h, d, u) {
      const f = Rf(Pf(xl(h))), y = [];
      let m = [], x = [0, 0], C = [];
      const b = () => {
        C.length >= 4 && m.push(...sa(C, d)), C = [];
      }, w = () => {
        b(), m.length && (y.push(m), m = []);
      };
      for (const { key: B, data: L } of f) switch (B) {
        case "M":
          w(), x = [L[0], L[1]], m.push(x);
          break;
        case "L":
          b(), m.push([L[0], L[1]]);
          break;
        case "C":
          if (!C.length) {
            const v = m.length ? m[m.length - 1] : x;
            C.push([v[0], v[1]]);
          }
          C.push([L[0], L[1]]), C.push([L[2], L[3]]), C.push([L[4], L[5]]);
          break;
        case "Z":
          b(), m.push([x[0], x[1]]);
      }
      if (w(), !u) return y;
      const T = [];
      for (const B of y) {
        const L = _w(B, u);
        L.length && T.push(L);
      }
      return T;
    })(t, 1, n ? 4 - 4 * (i.simplification || 1) : (1 + i.roughness) / 2), c = ec(t, i);
    if (o) if (i.fillStyle === "solid") if (l.length === 1) {
      const h = ec(t, Object.assign(Object.assign({}, i), { disableMultiStroke: !0, roughness: i.roughness ? i.roughness + i.fillShapeRoughnessGain : 0 }));
      s.push({ type: "fillPath", ops: this._mergedShape(h.ops) });
    } else s.push(ia(l, i));
    else s.push(Dr(l, i));
    return a && (n ? l.forEach(((h) => {
      s.push(Xs(h, !1, i));
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
          a = { d: this.opsToPath(o), stroke: i.stroke, strokeWidth: i.strokeWidth, fill: oe };
          break;
        case "fillPath":
          a = { d: this.opsToPath(o), stroke: oe, strokeWidth: 0, fill: i.fill || oe };
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
    return i < 0 && (i = r.strokeWidth / 2), { d: this.opsToPath(t), stroke: r.fill || oe, strokeWidth: i, fill: oe };
  }
  _mergedShape(t) {
    return t.filter(((r, i) => i === 0 || r.op !== "move"));
  }
}
class vw {
  constructor(t, r) {
    this.canvas = t, this.ctx = this.canvas.getContext("2d"), this.gen = new Co(r);
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
const Ms = "http://www.w3.org/2000/svg";
class Lw {
  constructor(t, r) {
    this.svg = t, this.gen = new Co(r);
  }
  draw(t) {
    const r = t.sets || [], i = t.options || this.getDefaultOptions(), s = this.svg.ownerDocument || window.document, o = s.createElementNS(Ms, "g"), a = t.options.fixedDecimalPlaceDigits;
    for (const n of r) {
      let l = null;
      switch (n.type) {
        case "path":
          l = s.createElementNS(Ms, "path"), l.setAttribute("d", this.opsToPath(n, a)), l.setAttribute("stroke", i.stroke), l.setAttribute("stroke-width", i.strokeWidth + ""), l.setAttribute("fill", "none"), i.strokeLineDash && l.setAttribute("stroke-dasharray", i.strokeLineDash.join(" ").trim()), i.strokeLineDashOffset && l.setAttribute("stroke-dashoffset", `${i.strokeLineDashOffset}`);
          break;
        case "fillPath":
          l = s.createElementNS(Ms, "path"), l.setAttribute("d", this.opsToPath(n, a)), l.setAttribute("stroke", "none"), l.setAttribute("stroke-width", "0"), l.setAttribute("fill", i.fill || ""), t.shape !== "curve" && t.shape !== "polygon" || l.setAttribute("fill-rule", "evenodd");
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
    const o = t.createElementNS(Ms, "path");
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
var rt = { canvas: (e, t) => new vw(e, t), svg: (e, t) => new Lw(e, t), generator: (e) => new Co(e), newSeed: () => Co.newSeed() }, Fw = 1, Aw = 3;
async function Cl(e) {
  const t = e.getElementsByTagName("img");
  if (!t || t.length === 0)
    return;
  const r = !bl(e);
  await Promise.all(
    [...t].map(
      (i) => new Promise((s) => {
        function o() {
          if (i.style.display = "flex", i.style.flexDirection = "column", r) {
            const a = Bt().fontSize ? Bt().fontSize : window.getComputedStyle(document.body).fontSize, n = 5, [l = Pd.fontSize] = Eo(a), c = l * n + "px";
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
p(Cl, "configureLabelImages");
function bl(e) {
  return e.nodeType === Aw ? e.textContent?.trim() !== "" : e.nodeType !== Fw || e.tagName.toLowerCase() === "img" ? !1 : [...e.childNodes].some(bl);
}
p(bl, "hasTextBesidesImages");
var ac = 3, Ew = 32, Mw = /* @__PURE__ */ p(async (e, t, r) => {
  const i = Bt(), s = e.insert("g").attr("class", r ?? "node default").attr("id", t.domId || t.id), o = s.insert("g").attr("class", "label").attr("style", Wt(t.labelStyle)), n = [
    { text: typeof t.label == "string" ? t.label : t.label?.[0] ?? "", cssClass: "c4-name" },
    { text: t.stereotype, cssClass: "c4-type" },
    ...(t.description ?? []).map((C) => ({ text: C, cssClass: "c4-descr" }))
  ].filter((C) => C.text), l = t.width ? Math.max(t.width - 2 * (t.padding ?? 0), Ew) : Bt().flowchart?.wrappingWidth ?? 200, h = i.c4?.wrap ?? !0 ? l : Number.POSITIVE_INFINITY, d = await Promise.all(
    n.map(async (C) => {
      const b = o.append("g").attr("class", C.cssClass), w = await we(
        b,
        he(er(C.text ?? ""), i),
        {
          useHtmlLabels: !1,
          markdown: !1,
          isNode: !0,
          width: h,
          style: t.labelStyle
        },
        i
      );
      return xt(w).selectAll("tspan.text-outer-tspan").attr("text-anchor", "middle"), xt(w).selectAll("tspan.text-inner-tspan").attr("font-weight", null).attr("font-style", null), { el: b, box: b.node().getBBox() };
    })
  ), u = Math.max(...d.map(({ box: C }) => C.width), 0);
  let f = 0;
  for (const { el: C, box: b } of d)
    C.attr("transform", `translate(${u / 2 - b.x - b.width / 2}, ${f - b.y})`), f += b.height + ac;
  const y = d.length > 0 ? f - ac : 0;
  o.insert("rect", ":first-child"), o.attr("transform", `translate(${-u / 2}, ${-y / 2})`);
  const m = o.node().getBBox(), x = (t.padding ?? 0) / 2;
  return { shapeSvg: s, bbox: m, halfPadding: x, label: o };
}, "c4LabelHelper"), ct = /* @__PURE__ */ p(async (e, t, r) => {
  if (t.stereotype !== void 0)
    return Mw(e, t, r);
  let i;
  const s = t.useHtmlLabels || Oe(Bt()?.htmlLabels);
  r ? i = r : i = "node default";
  const o = e.insert("g").attr("class", i).attr("id", t.domId || t.id), a = o.insert("g").attr("class", "label").attr("style", Wt(t.labelStyle));
  let n;
  t.label === void 0 ? n = "" : n = typeof t.label == "string" ? t.label : t.label[0];
  const l = !!t.icon || !!t.img, c = t.labelType === "markdown", h = await we(
    a,
    he(er(n), Bt()),
    {
      useHtmlLabels: s,
      width: t.width || t.wrappingWidth || Bt().flowchart?.wrappingWidth,
      classes: c ? "markdown-node-label" : "",
      style: t.labelStyle,
      addSvgBackground: l,
      markdown: c
    },
    Bt()
  ), d = (t?.padding ?? 0) / 2;
  let u;
  if (s) {
    const f = h.children[0], y = xt(h);
    await Cl(f), u = await wr.measure(
      () => f.getBoundingClientRect()
    ), y.attr("width", u.width), y.attr("height", u.height);
  } else
    u = await wr.measure(
      () => h.getBBox()
    );
  return s ? a.attr("transform", "translate(" + -u.width / 2 + ", " + -u.height / 2 + ")") : a.attr("transform", "translate(0, " + -u.height / 2 + ")"), t.centerLabel && a.attr("transform", "translate(" + -u.width / 2 + ", " + -u.height / 2 + ")"), a.insert("rect", ":first-child"), { shapeSvg: o, bbox: u, halfPadding: d, label: a };
}, "labelHelper"), oa = /* @__PURE__ */ p(async (e, t, r) => {
  const i = r.useHtmlLabels ?? Zt(Bt()), s = e.insert("g").attr("class", "label").attr("style", r.labelStyle || ""), o = await we(s, he(er(t), Bt()), {
    useHtmlLabels: i,
    width: r.width || Bt()?.flowchart?.wrappingWidth,
    style: r.labelStyle,
    addSvgBackground: !!r.icon || !!r.img
  }), a = r.padding / 2;
  let n;
  if (Zt(Bt())) {
    const l = o.children[0], c = xt(o);
    n = await wr.measure(
      () => l.getBoundingClientRect()
    ), c.attr("width", n.width), c.attr("height", n.height);
  } else
    n = await wr.measure(
      () => o.getBBox()
    );
  return i ? s.attr("transform", "translate(" + -n.width / 2 + ", " + -n.height / 2 + ")") : s.attr("transform", "translate(0, " + -n.height / 2 + ")"), r.centerLabel && s.attr("transform", "translate(" + -n.width / 2 + ", " + -n.height / 2 + ")"), s.insert("rect", ":first-child"), { shapeSvg: e, bbox: n, halfPadding: a, label: s };
}, "insertLabel"), st = /* @__PURE__ */ p((e, t, r) => {
  if (r) {
    e.width = r.width, e.height = r.height;
    return;
  }
  const i = t.node().getBBox();
  e.width = i.width, e.height = i.height;
}, "updateNodeBounds"), dt = /* @__PURE__ */ p((e, t) => (e.look === "handDrawn" ? "rough-node" : "node") + " " + e.cssClasses + " " + (t || ""), "getNodeClasses");
function Lt(e) {
  const t = e.map((r, i) => `${i === 0 ? "M" : "L"}${r.x},${r.y}`);
  return t.push("Z"), t.join(" ");
}
p(Lt, "createPathFromPoints");
function ir(e, t, r, i, s, o) {
  const a = [], l = r - e, c = i - t, h = l / o, d = 2 * Math.PI / h, u = t + c / 2;
  for (let f = 0; f <= 50; f++) {
    const y = f / 50, m = e + y * l, x = u + s * Math.sin(d * (m - e));
    a.push({ x: m, y: x });
  }
  return a;
}
p(ir, "generateFullSineWavePoints");
function Fe(e, t, r, i, s, o) {
  const a = [], n = s * Math.PI / 180, h = (o * Math.PI / 180 - n) / (i - 1);
  for (let d = 0; d < i; d++) {
    const u = n + d * h, f = e + r * Math.cos(u), y = t + r * Math.sin(u);
    a.push({ x: -f, y: -y });
  }
  return a;
}
p(Fe, "generateCirclePoints");
function pn(e) {
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
p(pn, "mergePaths");
var $w = /* @__PURE__ */ p((e, t) => {
  var r = e.x, i = e.y, s = t.x - r, o = t.y - i, a = e.width / 2, n = e.height / 2, l, c;
  return Math.abs(o) * a > Math.abs(s) * n ? (o < 0 && (n = -n), l = o === 0 ? 0 : n * s / o, c = n) : (s < 0 && (a = -a), l = a, c = s === 0 ? 0 : a * o / s), { x: r + l, y: i + c };
}, "intersectRect"), _r = $w, fe = /* @__PURE__ */ p((e, t, r, i, s) => [
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
].join(" "), "createRoundedRectPathD"), Ow = /* @__PURE__ */ p(async (e, t, r, i = !1, s = !1) => {
  let o = t || "";
  typeof o == "object" && (o = o[0]);
  const a = Bt(), n = Zt(a);
  return await we(
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
}, "createLabel"), Ze = Ow;
function Hf(e, t) {
  return e.intersect(t);
}
p(Hf, "intersectNode");
var Iw = Hf;
function Yf(e, t, r, i) {
  var s = e.x, o = e.y, a = s - i.x, n = o - i.y, l = Math.sqrt(t * t * n * n + r * r * a * a), c = Math.abs(t * r * a / l);
  i.x < s && (c = -c);
  var h = Math.abs(t * r * n / l);
  return i.y < o && (h = -h), { x: s + c, y: o + h };
}
p(Yf, "intersectEllipse");
var Xf = Yf;
function jf(e, t, r) {
  return Xf(e, t, t, r);
}
p(jf, "intersectCircle");
var Dw = jf;
function Uf(e, t, r, i) {
  {
    const s = t.y - e.y, o = e.x - t.x, a = t.x * e.y - e.x * t.y, n = s * r.x + o * r.y + a, l = s * i.x + o * i.y + a, c = 1e-6;
    if (n !== 0 && l !== 0 && gn(n, l))
      return;
    const h = i.y - r.y, d = r.x - i.x, u = i.x * r.y - r.x * i.y, f = h * e.x + d * e.y + u, y = h * t.x + d * t.y + u;
    if (Math.abs(f) < c && Math.abs(y) < c && gn(f, y))
      return;
    const m = s * d - h * o;
    if (m === 0)
      return;
    const x = Math.abs(m / 2);
    let C = o * u - d * a;
    const b = C < 0 ? (C - x) / m : (C + x) / m;
    C = h * a - s * u;
    const w = C < 0 ? (C - x) / m : (C + x) / m;
    return { x: b, y: w };
  }
}
p(Uf, "intersectLine");
function gn(e, t) {
  return e * t > 0;
}
p(gn, "sameSign");
var Pw = Uf;
function Gf(e, t, r) {
  let i = e.x, s = e.y, o = [], a = Number.POSITIVE_INFINITY, n = Number.POSITIVE_INFINITY;
  typeof t.forEach == "function" ? t.forEach(function(h) {
    a = Math.min(a, h.x), n = Math.min(n, h.y);
  }) : (a = Math.min(a, t.x), n = Math.min(n, t.y));
  let l = i - e.width / 2 - a, c = s - e.height / 2 - n;
  for (let h = 0; h < t.length; h++) {
    let d = t[h], u = t[h < t.length - 1 ? h + 1 : 0], f = Pw(
      e,
      r,
      { x: l + d.x, y: c + d.y },
      { x: l + u.x, y: c + u.y }
    );
    f && o.push(f);
  }
  return o.length ? (o.length > 1 && o.sort(function(h, d) {
    let u = h.x - r.x, f = h.y - r.y, y = Math.sqrt(u * u + f * f), m = d.x - r.x, x = d.y - r.y, C = Math.sqrt(m * m + x * x);
    return y < C ? -1 : y === C ? 0 : 1;
  }), o[0]) : e;
}
p(Gf, "intersectPolygon");
var Rw = Gf, tt = {
  node: Iw,
  circle: Dw,
  ellipse: Xf,
  polygon: Rw,
  rect: _r
};
function Vf(e, t) {
  const { labelStyles: r } = ot(t);
  t.labelStyle = r;
  const i = dt(t);
  let s = i;
  i || (s = "anchor");
  const o = e.insert("g").attr("class", s).attr("id", t.domId || t.id), a = 1, { cssStyles: n } = t, l = rt.svg(o), c = et(t, { fill: "black", stroke: "none", fillStyle: "solid" });
  t.look !== "handDrawn" && (c.roughness = 0);
  const h = l.circle(0, 0, a * 2, c), d = o.insert(() => h, ":first-child");
  return d.attr("class", "anchor").attr("style", Wt(n)), st(t, d), t.intersect = function(u) {
    return M.info("Circle intersect", t, a, u), tt.circle(t, a, u);
  }, o;
}
p(Vf, "anchor");
function yn(e, t, r, i, s, o, a) {
  const l = (e + r) / 2, c = (t + i) / 2, h = Math.atan2(i - t, r - e), d = (r - e) / 2, u = (i - t) / 2, f = d / s, y = u / o, m = Math.sqrt(f ** 2 + y ** 2);
  if (m > 1)
    throw new Error("The given radii are too small to create an arc between the points.");
  const x = Math.sqrt(1 - m ** 2), C = l + x * o * Math.sin(h) * (a ? -1 : 1), b = c - x * s * Math.cos(h) * (a ? -1 : 1), w = Math.atan2((t - b) / o, (e - C) / s);
  let B = Math.atan2((i - b) / o, (r - C) / s) - w;
  a && B < 0 && (B += 2 * Math.PI), !a && B > 0 && (B -= 2 * Math.PI);
  const L = [];
  for (let v = 0; v < 20; v++) {
    const _ = v / 19, R = w + _ * B, N = C + s * Math.cos(R), q = b + o * Math.sin(R);
    L.push({ x: N, y: q });
  }
  return L;
}
p(yn, "generateArcPoints");
function Kf(e, t, r) {
  const [i, s] = [t, r].sort((o, a) => a - o);
  return s * (1 - Math.sqrt(1 - (e / i / 2) ** 2));
}
p(Kf, "calculateArcSagitta");
async function Zf(e, t) {
  const { labelStyles: r, nodeStyles: i } = ot(t);
  t.labelStyle = r;
  const s = t.padding ?? 0, o = t.look === "neo" ? 16 : s, a = t.look === "neo" ? 12 : s, n = /* @__PURE__ */ p((R) => R + a, "calcTotalHeight"), l = /* @__PURE__ */ p((R) => {
    const N = R / 2;
    return [N / (2.5 + R / 50), N];
  }, "calcEllipseRadius"), { shapeSvg: c, bbox: h } = await ct(e, t, dt(t)), d = n(t?.height ? t?.height : h.height), [u, f] = l(d), y = Kf(d, u, f), x = (t?.width ? t?.width : h.width) + o * 2 + y - y, C = d, { cssStyles: b } = t, w = [
    { x: x / 2, y: -C / 2 },
    { x: -x / 2, y: -C / 2 },
    ...yn(-x / 2, -C / 2, -x / 2, C / 2, u, f, !1),
    { x: x / 2, y: C / 2 },
    ...yn(x / 2, C / 2, x / 2, -C / 2, u, f, !0)
  ], T = rt.svg(c), B = et(t, {});
  t.look !== "handDrawn" && (B.roughness = 0, B.fillStyle = "solid");
  const L = Lt(w), v = T.path(L, B), _ = c.insert(() => v, ":first-child");
  return _.attr("class", "basic label-container outer-path"), b && t.look !== "handDrawn" && _.selectAll("path").attr("style", b), i && t.look !== "handDrawn" && _.selectAll("path").attr("style", i), _.attr("transform", `translate(${u / 2}, 0)`), st(t, _), t.intersect = function(R) {
    return tt.polygon(t, w, R);
  }, c;
}
p(Zf, "bowTieRect");
async function Qf(e, t, { config: { themeVariables: r } }) {
  const { labelStyles: i, nodeStyles: s } = ot(t);
  t.labelStyle = i;
  const { shapeSvg: o, bbox: a, label: n } = await ct(e, t, dt(t)), l = r?.nodeBorder ?? r?.lineColor ?? "currentColor", c = t.padding ?? 12, h = Math.max(a.width + c * 2, t.width ?? 0, 80), d = Math.max(Math.min(h * 0.08, 12), 5), u = Math.max(a.height + c * 2 + d, t.height ?? 0), f = -u / 2 + d, y = u / 2, m = h * 0.72, x = [
    `M${-h / 2},${f}`,
    `L${-m / 2},${y}`,
    `A${m / 2},${d} 0 0 0 ${m / 2},${y}`,
    `L${h / 2},${f}`,
    `A${h / 2},${d} 0 0 0 ${-h / 2},${f}`,
    "Z"
  ].join(" "), { cssStyles: C } = t, b = o.insert("g", ":first-child").attr("class", "basic label-container");
  if (t.look === "handDrawn") {
    const _ = rt.svg(o).path(x, et(t, {}));
    b.node()?.appendChild(_), C && b.attr("style", C);
  } else
    b.append("path").attr("d", x).attr("style", s);
  b.append("ellipse").attr("cx", 0).attr("cy", f).attr("rx", h / 2).attr("ry", d).attr("style", `fill:none;stroke:${l};stroke-width:1px`), st(t, b);
  const w = f + (y - f) / 2;
  n.attr(
    "transform",
    `translate(${-(a.width / 2) - (a.x - (a.left ?? 0))}, ${w - a.height / 2 - (a.y - (a.top ?? 0))})`
  );
  const T = 12, B = /* @__PURE__ */ p((v, _, R) => Array.from({ length: T + 1 }, (N, q) => {
    const J = Math.PI - q * Math.PI / T;
    return { x: v * Math.cos(J), y: _ + R * d * Math.sin(J) };
  }), "arc"), L = [...B(h / 2, f, -1), ...B(m / 2, y, 1).reverse()];
  return t.intersect = function(v) {
    return tt.polygon(t, L, v);
  }, o;
}
p(Qf, "bucket");
var nc = 20, lc = 8, qw = 80, aa = 8;
async function Jf(e, t) {
  const { themeVariables: r } = Bt(), i = r.clusterBkg, s = r.clusterBorder, { nodeStyles: o } = ot(t), { shapeSvg: a, bbox: n } = await ct(e, t, dt(t)), l = t.padding ?? 8, c = n.height, h = Math.max(n.width + l * 2, qw, t?.width ?? 0), d = Math.max(
    c + lc + nc + l * 2,
    t?.height ?? 0
  ), u = -h / 2, f = -d / 2, y = -28 / 2, m = a.select(".label");
  m && (t.useHtmlLabels ?? Zt(Bt()) ? m.attr("transform", `translate(${-n.width / 2}, ${-n.height / 2 + y})`) : m.attr("transform", `translate(0, ${-n.height / 2 + y})`));
  let x;
  if (t.look === "handDrawn") {
    const B = rt.svg(a), L = et(t, {
      fill: i,
      stroke: s,
      fillStyle: "solid"
    }), v = B.path(
      fe(u, f, h, d, aa),
      L
    );
    x = a.insert(() => v, ":first-child"), x.attr("class", "basic label-container collapsed-group").attr("style", Wt(t.cssStyles));
  } else
    x = a.insert("rect", ":first-child"), x.attr("class", "basic label-container collapsed-group").attr("style", o).attr("rx", aa).attr("ry", aa).attr("x", u).attr("y", f).attr("width", h).attr("height", d).attr("fill", i).attr("stroke", s);
  const C = f + l + c + lc;
  a.append("line").attr("class", "collapsed-separator").attr("x1", u + 8).attr("y1", C).attr("x2", u + h - 8).attr("y2", C).attr("stroke", s).attr("stroke-dasharray", "3, 3");
  const b = C + nc / 2, w = 2.5, T = 10;
  for (let B = -1; B <= 1; B++)
    a.append("circle").attr("class", "collapsed-indicator").attr("cx", B * T).attr("cy", b).attr("r", w).attr("fill", s);
  return st(t, x), t.calcIntersect = function(B, L) {
    return tt.rect(B, L);
  }, t.intersect = function(B) {
    return tt.rect(t, B);
  }, a;
}
p(Jf, "collapsedGroup");
function De(e, t, r, i) {
  return e.insert("polygon", ":first-child").attr(
    "points",
    i.map(function(s) {
      return s.x + "," + s.y;
    }).join(" ")
  ).attr("class", "label-container").attr("transform", "translate(" + -t / 2 + "," + r / 2 + ")");
}
p(De, "insertPolygonShape");
var Nw = ["right", "left", "up", "down"], kl = "point", Ww = /* @__PURE__ */ p((e) => {
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
}, "expandAndDeduplicateDirections"), zw = /* @__PURE__ */ p((e) => Nw.filter((t) => e.has(t)).join("|") || kl, "getDirectionKey"), hc = {
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
  [kl]: () => [{ x: 0, y: 0 }]
}, Hw = /* @__PURE__ */ p((e, t, r, i) => {
  const s = Ww(e), o = (r.padding ?? 0) / 2, a = t.height + 4 * o, n = a / 2, l = i ?? t.width + 2 * n + 2 * o, c = zw(s);
  return (hc[c] ?? hc[kl])({ height: a, midpoint: n, padding: o, width: l });
}, "getArrowPoints");
async function tp(e, t) {
  const r = t, { shapeSvg: i, bbox: s } = await ct(e, r, dt(r)), o = r.padding ?? 0, a = s.height + 2 * o, n = a / 2, l = s.width + 2 * n + o, c = r.width ?? 0, d = r.positioned && (r.widthInColumns ?? 1) > 1 && c > l ? c : l, u = Hw(r.directions ?? [], s, r, d), f = De(i, d, a, u);
  return f.attr("style", r.style ?? null), st(r, f), r.intersect = function(y) {
    return tt.polygon(r, u, y);
  }, i;
}
p(tp, "block_arrow");
async function ep(e, t, { config: { themeVariables: r } }) {
  const { labelStyles: i, nodeStyles: s } = ot(t);
  t.labelStyle = i;
  const { shapeSvg: o, bbox: a, label: n } = await ct(e, t, dt(t)), l = r?.nodeBorder ?? r?.lineColor ?? "currentColor", c = t.padding ?? 12, h = 18, d = 12, u = Math.max(a.width + c * 2, t.width ?? 0, 90), f = Math.max(a.height + c * 2 + h, t.height ?? 0), y = -f / 2, { cssStyles: m } = t, x = o.insert("g", ":first-child").attr("class", "basic label-container");
  if (t.look === "handDrawn") {
    const w = rt.svg(o).path(
      fe(-u / 2, y, u, f, d),
      et(t, {})
    );
    x.node()?.appendChild(w), m && x.attr("style", m);
  } else
    x.append("rect").attr("x", -u / 2).attr("y", y).attr("width", u).attr("height", f).attr("rx", d).attr("ry", d).attr("style", s);
  x.append("line").attr("x1", -u / 2).attr("y1", y + h).attr("x2", u / 2).attr("y2", y + h).attr("style", `stroke:${l};stroke-width:1px`);
  for (let b = 0; b < 3; b++)
    x.append("circle").attr("cx", -u / 2 + 12 + b * 9).attr("cy", y + h / 2).attr("r", 2.5).attr("style", `fill:${l};stroke:none`);
  x.append("rect").attr("class", "browser-address-bar").attr("x", -u / 2 + 44).attr("y", y + 4).attr("width", Math.max(u - 56, 10)).attr("height", h - 8).attr("rx", 3).attr("ry", 3).attr("style", `fill:none;stroke:${l};stroke-width:1px;opacity:0.6`), st(t, x);
  const C = y + h + (f - h) / 2;
  return n.attr(
    "transform",
    `translate(${-(a.width / 2) - (a.x - (a.left ?? 0))}, ${C - a.height / 2 - (a.y - (a.top ?? 0))})`
  ), t.intersect = function(b) {
    return tt.rect(t, b);
  }, o;
}
p(ep, "browser");
var $s = 12;
async function rp(e, t) {
  const { labelStyles: r, nodeStyles: i } = ot(t);
  t.labelStyle = r;
  const s = t.padding ?? 0, o = t.look === "neo" ? 28 : s, a = t.look === "neo" ? 24 : s, { shapeSvg: n, bbox: l } = await ct(e, t, dt(t)), c = (t?.width ?? l.width) + (t.look === "neo" ? o * 2 : o + $s), h = (t?.height ?? l.height) + (t.look === "neo" ? a * 2 : a), d = 0, u = c, f = -h, y = 0, m = [
    { x: d + $s, y: f },
    { x: u, y: f },
    { x: u, y },
    { x: d, y },
    { x: d, y: f + $s },
    { x: d + $s, y: f }
  ];
  let x;
  const { cssStyles: C } = t;
  if (t.look === "handDrawn") {
    const b = rt.svg(n), w = et(t, {}), T = Lt(m), B = b.path(T, w);
    x = n.insert(() => B, ":first-child").attr("transform", `translate(${-c / 2}, ${h / 2})`), C && x.attr("style", C);
  } else
    x = De(n, c, h, m);
  return i && x.attr("style", i), st(t, x), t.intersect = function(b) {
    return tt.polygon(t, m, b);
  }, n;
}
p(rp, "card");
function ip(e, t) {
  const { nodeStyles: r } = ot(t);
  t.label = "";
  const i = e.insert("g").attr("class", dt(t)).attr("id", t.domId ?? t.id), { cssStyles: s } = t, o = Math.max(28, t.width ?? 0), a = [
    { x: 0, y: o / 2 },
    { x: o / 2, y: 0 },
    { x: 0, y: -o / 2 },
    { x: -o / 2, y: 0 }
  ], n = rt.svg(i), l = et(t, {});
  t.look !== "handDrawn" && (l.roughness = 0, l.fillStyle = "solid");
  const c = Lt(a), h = n.path(c, l), d = i.insert(() => h, ":first-child");
  return s && t.look !== "handDrawn" && d.selectAll("path").attr("style", s), r && t.look !== "handDrawn" && d.selectAll("path").attr("style", r), t.width = 28, t.height = 28, t.intersect = function(u) {
    return tt.polygon(t, a, u);
  }, i;
}
p(ip, "choice");
async function wl(e, t, r) {
  const { labelStyles: i, nodeStyles: s } = ot(t);
  t.labelStyle = i;
  const { shapeSvg: o, bbox: a, halfPadding: n } = await ct(e, t, dt(t)), l = 16, c = r?.padding ?? n, h = t.look === "neo" ? a.width / 2 + l * 2 : a.width / 2 + c;
  let d;
  const { cssStyles: u } = t;
  if (t.look === "handDrawn") {
    const f = rt.svg(o), y = et(t, {}), m = f.circle(0, 0, h * 2, y);
    d = o.insert(() => m, ":first-child"), d.attr("class", "basic label-container").attr("style", Wt(u));
  } else
    d = o.insert("circle", ":first-child").attr("class", "basic label-container").attr("style", s).attr("r", h).attr("cx", 0).attr("cy", 0);
  return st(t, d), t.calcIntersect = function(f, y) {
    const m = f.width / 2;
    return tt.circle(f, m, y);
  }, t.intersect = function(f) {
    return M.info("Circle intersect", t, h, f), tt.circle(t, h, f);
  }, o;
}
p(wl, "circle");
async function sp(e, t) {
  const r = t, i = ["node", r.cssClasses, r.class].filter(Boolean).join(" "), { shapeSvg: s, bbox: o, halfPadding: a } = await ct(e, r, i), n = s.insert("rect", ":first-child"), l = r.padding ?? 0, c = r.positioned ? r.width ?? 0 : o.width + l, h = r.positioned ? r.height ?? 0 : o.height + l, d = r.positioned ? -c / 2 : -o.width / 2 - a, u = r.positioned ? -h / 2 : -o.height / 2 - a;
  return n.attr("class", "basic cluster composite label-container").attr("style", r.style ?? null).attr("rx", r.rx ?? null).attr("ry", r.ry ?? null).attr("x", d).attr("y", u).attr("width", c).attr("height", h), st(r, n), r.intersect = function(f) {
    return tt.rect(r, f);
  }, s;
}
p(sp, "composite");
async function op(e, t, { config: { themeVariables: r } }) {
  const { labelStyles: i, nodeStyles: s } = ot(t);
  t.labelStyle = i;
  const { shapeSvg: o, bbox: a, label: n } = await ct(e, t, dt(t)), l = r?.nodeBorder ?? r?.lineColor ?? "currentColor", c = t.padding ?? 12, h = 20, d = 12, u = Math.max(a.width + c * 2, t.width ?? 0, 90), f = Math.max(a.height + c * 2 + h, t.height ?? 0), y = -f / 2, { cssStyles: m } = t, x = o.insert("g", ":first-child").attr("class", "basic label-container");
  if (t.look === "handDrawn") {
    const w = rt.svg(o).path(
      fe(-u / 2, y, u, f, d),
      et(t, {})
    );
    x.node()?.appendChild(w), m && x.attr("style", m);
  } else
    x.append("rect").attr("x", -u / 2).attr("y", y).attr("width", u).attr("height", f).attr("rx", d).attr("ry", d).attr("style", s);
  x.append("text").attr("x", -u / 2 + 12).attr("y", y + 16).attr("class", "console-glyph").attr("style", `font-family:monospace;font-weight:bold;font-size:14px;fill:${l}`).text(">_"), st(t, x);
  const C = y + h + (f - h) / 2;
  return n.attr(
    "transform",
    `translate(${-(a.width / 2) - (a.x - (a.left ?? 0))}, ${C - a.height / 2 - (a.y - (a.top ?? 0))})`
  ), t.intersect = function(b) {
    return tt.rect(t, b);
  }, o;
}
p(op, "consoleWindow");
function ap(e) {
  const t = Math.cos(Math.PI / 4), r = Math.sin(Math.PI / 4), i = e * 2, s = { x: i / 2 * t, y: i / 2 * r }, o = { x: -(i / 2) * t, y: i / 2 * r }, a = { x: -(i / 2) * t, y: -(i / 2) * r }, n = { x: i / 2 * t, y: -(i / 2) * r };
  return `M ${o.x},${o.y} L ${n.x},${n.y}
                   M ${s.x},${s.y} L ${a.x},${a.y}`;
}
p(ap, "createLine");
function np(e, t) {
  const { labelStyles: r, nodeStyles: i } = ot(t);
  t.labelStyle = r, t.label = "";
  const s = e.insert("g").attr("class", dt(t)).attr("id", t.domId ?? t.id), o = Math.max(30, t?.width ?? 0), { cssStyles: a } = t, n = rt.svg(s), l = et(t, {});
  t.look !== "handDrawn" && (l.roughness = 0, l.fillStyle = "solid");
  const c = n.circle(0, 0, o * 2, l), h = ap(o), d = n.path(h, l), u = s.insert(() => c, ":first-child");
  return u.insert(() => d), u.attr("class", "outer-path"), a && t.look !== "handDrawn" && u.selectAll("path").attr("style", a), i && t.look !== "handDrawn" && u.selectAll("path").attr("style", i), st(t, u), t.intersect = function(f) {
    return M.info("crossedCircle intersect", t, { radius: o, point: f }), tt.circle(t, o, f);
  }, s;
}
p(np, "crossedCircle");
function Ne(e, t, r, i = 100, s = 0, o = 180) {
  const a = [], n = s * Math.PI / 180, h = (o * Math.PI / 180 - n) / (i - 1);
  for (let d = 0; d < i; d++) {
    const u = n + d * h, f = e + r * Math.cos(u), y = t + r * Math.sin(u);
    a.push({ x: -f, y: -y });
  }
  return a;
}
p(Ne, "generateCirclePoints");
async function lp(e, t) {
  const { labelStyles: r, nodeStyles: i } = ot(t);
  t.labelStyle = r;
  const { shapeSvg: s, bbox: o, label: a } = await ct(e, t, dt(t)), n = t.look === "neo" ? 18 : t.padding ?? 0, l = t.look === "neo" ? 12 : t.padding ?? 0, c = o.width + n, h = o.height + l, d = Math.max(5, h * 0.1), { cssStyles: u } = t, f = [
    ...Ne(c / 2, -h / 2, d, 30, -90, 0),
    { x: -c / 2 - d, y: d },
    ...Ne(c / 2 + d * 2, -d, d, 20, -180, -270),
    ...Ne(c / 2 + d * 2, d, d, 20, -90, -180),
    { x: -c / 2 - d, y: -h / 2 },
    ...Ne(c / 2, h / 2, d, 20, 0, 90)
  ], y = [
    { x: c / 2, y: -h / 2 - d },
    { x: -c / 2, y: -h / 2 - d },
    ...Ne(c / 2, -h / 2, d, 20, -90, 0),
    { x: -c / 2 - d, y: -d },
    ...Ne(c / 2 + c * 0.1, -d, d, 20, -180, -270),
    ...Ne(c / 2 + c * 0.1, d, d, 20, -90, -180),
    { x: -c / 2 - d, y: h / 2 },
    ...Ne(c / 2, h / 2, d, 20, 0, 90),
    { x: -c / 2, y: h / 2 + d },
    { x: c / 2, y: h / 2 + d }
  ], m = rt.svg(s), x = et(t, { fill: "none" });
  t.look !== "handDrawn" && (x.roughness = 0, x.fillStyle = "solid");
  const b = Lt(f).replace("Z", ""), w = m.path(b, x), T = Lt(y), B = m.path(T, { ...x }), L = s.insert("g", ":first-child");
  return L.insert(() => B, ":first-child").attr("stroke-opacity", 0), L.insert(() => w, ":first-child"), L.attr("class", "text"), u && t.look !== "handDrawn" && L.selectAll("path").attr("style", u), i && t.look !== "handDrawn" && L.selectAll("path").attr("style", i), L.attr("transform", `translate(${d}, 0)`), a.attr(
    "transform",
    `translate(${-c / 2 + d - (o.x - (o.left ?? 0))},${-h / 2 + (t.padding ?? 0) / 2 - (o.y - (o.top ?? 0))})`
  ), st(t, L), t.intersect = function(v) {
    return tt.polygon(t, y, v);
  }, s;
}
p(lp, "curlyBraceLeft");
function We(e, t, r, i = 100, s = 0, o = 180) {
  const a = [], n = s * Math.PI / 180, h = (o * Math.PI / 180 - n) / (i - 1);
  for (let d = 0; d < i; d++) {
    const u = n + d * h, f = e + r * Math.cos(u), y = t + r * Math.sin(u);
    a.push({ x: f, y });
  }
  return a;
}
p(We, "generateCirclePoints");
async function hp(e, t) {
  const { labelStyles: r, nodeStyles: i } = ot(t);
  t.labelStyle = r;
  const { shapeSvg: s, bbox: o, label: a } = await ct(e, t, dt(t)), n = t.look === "neo" ? 18 : t.padding ?? 0, l = t.look === "neo" ? 12 : t.padding ?? 0, c = o.width + (t.look === "neo" ? n * 2 : n), h = o.height + (t.look === "neo" ? l * 2 : l), d = Math.max(5, h * 0.1), { cssStyles: u } = t, f = [
    ...We(c / 2, -h / 2, d, 20, -90, 0),
    { x: c / 2 + d, y: -d },
    ...We(c / 2 + d * 2, -d, d, 20, -180, -270),
    ...We(c / 2 + d * 2, d, d, 20, -90, -180),
    { x: c / 2 + d, y: h / 2 },
    ...We(c / 2, h / 2, d, 20, 0, 90)
  ], y = [
    { x: -c / 2, y: -h / 2 - d },
    { x: c / 2, y: -h / 2 - d },
    ...We(c / 2, -h / 2, d, 20, -90, 0),
    { x: c / 2 + d, y: -d },
    ...We(c / 2 + d * 2, -d, d, 20, -180, -270),
    ...We(c / 2 + d * 2, d, d, 20, -90, -180),
    { x: c / 2 + d, y: h / 2 },
    ...We(c / 2, h / 2, d, 20, 0, 90),
    { x: c / 2, y: h / 2 + d },
    { x: -c / 2, y: h / 2 + d }
  ], m = rt.svg(s), x = et(t, { fill: "none" });
  t.look !== "handDrawn" && (x.roughness = 0, x.fillStyle = "solid");
  const b = Lt(f).replace("Z", ""), w = m.path(b, x), T = Lt(y), B = m.path(T, { ...x }), L = s.insert("g", ":first-child");
  return L.insert(() => B, ":first-child").attr("stroke-opacity", 0), L.insert(() => w, ":first-child"), L.attr("class", "text"), u && t.look !== "handDrawn" && L.selectAll("path").attr("style", u), i && t.look !== "handDrawn" && L.selectAll("path").attr("style", i), L.attr("transform", `translate(${-d}, 0)`), a.attr(
    "transform",
    `translate(${-c / 2 + (t.padding ?? 0) / 2 - (o.x - (o.left ?? 0))},${-h / 2 + (t.padding ?? 0) / 2 - (o.y - (o.top ?? 0))})`
  ), st(t, L), t.intersect = function(v) {
    return tt.polygon(t, y, v);
  }, s;
}
p(hp, "curlyBraceRight");
function Xt(e, t, r, i = 100, s = 0, o = 180) {
  const a = [], n = s * Math.PI / 180, h = (o * Math.PI / 180 - n) / (i - 1);
  for (let d = 0; d < i; d++) {
    const u = n + d * h, f = e + r * Math.cos(u), y = t + r * Math.sin(u);
    a.push({ x: -f, y: -y });
  }
  return a;
}
p(Xt, "generateCirclePoints");
async function cp(e, t) {
  const { labelStyles: r, nodeStyles: i } = ot(t);
  t.labelStyle = r;
  const { shapeSvg: s, bbox: o, label: a } = await ct(e, t, dt(t)), n = t.look === "neo" ? 18 : t.padding ?? 0, l = t.look === "neo" ? 12 : t.padding ?? 0, c = o.width + (t.look === "neo" ? n * 2 : n), h = o.height + (t.look === "neo" ? l * 2 : l), d = Math.max(5, h * 0.1), { cssStyles: u } = t, f = [
    ...Xt(c / 2, -h / 2, d, 30, -90, 0),
    { x: -c / 2 - d, y: d },
    ...Xt(c / 2 + d * 2, -d, d, 20, -180, -270),
    ...Xt(c / 2 + d * 2, d, d, 20, -90, -180),
    { x: -c / 2 - d, y: -h / 2 },
    ...Xt(c / 2, h / 2, d, 20, 0, 90)
  ], y = [
    ...Xt(-c / 2 + d + d / 2, -h / 2, d, 20, -90, -180),
    { x: c / 2 - d / 2, y: d },
    ...Xt(-c / 2 - d / 2, -d, d, 20, 0, 90),
    ...Xt(-c / 2 - d / 2, d, d, 20, -90, 0),
    { x: c / 2 - d / 2, y: -d },
    ...Xt(-c / 2 + d + d / 2, h / 2, d, 30, -180, -270)
  ], m = [
    { x: c / 2, y: -h / 2 - d },
    { x: -c / 2, y: -h / 2 - d },
    ...Xt(c / 2, -h / 2, d, 20, -90, 0),
    { x: -c / 2 - d, y: -d },
    ...Xt(c / 2 + d * 2, -d, d, 20, -180, -270),
    ...Xt(c / 2 + d * 2, d, d, 20, -90, -180),
    { x: -c / 2 - d, y: h / 2 },
    ...Xt(c / 2, h / 2, d, 20, 0, 90),
    { x: -c / 2, y: h / 2 + d },
    { x: c / 2 - d - d / 2, y: h / 2 + d },
    ...Xt(-c / 2 + d + d / 2, -h / 2, d, 20, -90, -180),
    { x: c / 2 - d / 2, y: d },
    ...Xt(-c / 2 - d / 2, -d, d, 20, 0, 90),
    ...Xt(-c / 2 - d / 2, d, d, 20, -90, 0),
    { x: c / 2 - d / 2, y: -d },
    ...Xt(-c / 2 + d + d / 2, h / 2, d, 30, -180, -270)
  ], x = rt.svg(s), C = et(t, { fill: "none" });
  t.look !== "handDrawn" && (C.roughness = 0, C.fillStyle = "solid");
  const w = Lt(f).replace("Z", ""), T = x.path(w, C), L = Lt(y).replace("Z", ""), v = x.path(L, C), _ = Lt(m), R = x.path(_, { ...C }), N = s.insert("g", ":first-child");
  return N.insert(() => R, ":first-child").attr("stroke-opacity", 0), N.insert(() => T, ":first-child"), N.insert(() => v, ":first-child"), N.attr("class", "text"), u && t.look !== "handDrawn" && N.selectAll("path").attr("style", u), i && t.look !== "handDrawn" && N.selectAll("path").attr("style", i), N.attr("transform", `translate(${d - d / 4}, 0)`), a.attr(
    "transform",
    `translate(${-c / 2 + (t.padding ?? 0) / 2 - (o.x - (o.left ?? 0))},${-h / 2 + (t.padding ?? 0) / 2 - (o.y - (o.top ?? 0))})`
  ), st(t, N), t.intersect = function(q) {
    return tt.polygon(t, m, q);
  }, s;
}
p(cp, "curlyBraces");
async function dp(e, t) {
  const { labelStyles: r, nodeStyles: i } = ot(t);
  t.labelStyle = r;
  const s = t.padding ?? 0, o = t.look === "neo" ? 16 : s, a = t.look === "neo" ? 12 : s, n = 20, l = 5, { shapeSvg: c, bbox: h } = await ct(e, t, dt(t)), d = Math.max(n, (h.width + o * 2) * 1.25, t?.width ?? 0), u = Math.max(l, h.height + a * 2, t?.height ?? 0), f = u / 2, { cssStyles: y } = t, m = rt.svg(c), x = et(t, {});
  t.look !== "handDrawn" && (x.roughness = 0, x.fillStyle = "solid");
  const C = d, b = u, w = C - f, T = b / 4, B = [
    { x: w, y: 0 },
    { x: T, y: 0 },
    { x: 0, y: b / 2 },
    { x: T, y: b },
    { x: w, y: b },
    ...Fe(-w, -b / 2, f, 50, 270, 90)
  ], L = Lt(B), v = m.path(L, x), _ = c.insert(() => v, ":first-child");
  return _.attr("class", "basic label-container outer-path"), y && t.look !== "handDrawn" && _.selectChildren("path").attr("style", y), i && t.look !== "handDrawn" && _.selectChildren("path").attr("style", i), _.attr("transform", `translate(${-d / 2}, ${-u / 2})`), st(t, _), t.intersect = function(R) {
    return tt.polygon(t, B, R);
  }, c;
}
p(dp, "curvedTrapezoid");
async function up(e, t) {
  const { labelStyles: r, nodeStyles: i } = ot(t);
  t.labelStyle = r;
  const { shapeSvg: s, bbox: o, label: a } = await ct(e, t, dt(t)), n = t.padding ?? 20, l = Math.max(o.width + n * 2, t.width ?? 0, 100), c = Math.min(Math.max(l * 0.23, 16), 56), h = c * 0.27, d = Math.max(
    o.height + n * 2,
    t.height ? t.height - (2 * c - h) : 0
  ), u = Math.min(l * 0.177, d * 0.45), f = d + 2 * c - h, y = -f / 2, m = y + 2 * c - h, x = s.insert("g", ":first-child").attr("class", "basic label-container"), { cssStyles: C } = t;
  if (t.look === "handDrawn") {
    const _ = rt.svg(s), R = et(t, {}), N = _.path(
      fe(-l / 2, m, l, d, u),
      R
    ), q = _.circle(0, y + c, c * 2, R);
    x.insert(() => q, ":first-child"), x.insert(() => N, ":first-child"), C && x.attr("style", C);
  } else
    x.append("rect").attr("x", -l / 2).attr("y", m).attr("width", l).attr("height", d).attr("rx", u).attr("ry", u).attr("style", i), x.append("circle").attr("cx", 0).attr("cy", y + c).attr("r", c).attr("style", i);
  st(t, x);
  const b = m + d / 2;
  a.attr(
    "transform",
    `translate(${-(o.width / 2) - (o.x - (o.left ?? 0))}, ${b - o.height / 2 - (o.y - (o.top ?? 0))})`
  );
  const w = y + c, T = Math.asin(Math.min(1, (m - w) / c)) * 180 / Math.PI, v = [
    ...Fe(
      0,
      -w,
      c,
      24,
      180 + T,
      -T
    ),
    ...Fe(-(-l / 2 + u), -(m + u), u, 12, 90, 0),
    ...Fe(
      -(-l / 2 + u),
      -(f / 2 - u),
      u,
      12,
      360,
      270
    ),
    ...Fe(
      -(l / 2 - u),
      -(f / 2 - u),
      u,
      12,
      270,
      180
    ),
    ...Fe(
      -(l / 2 - u),
      -(m + u),
      u,
      12,
      180,
      90
    )
  ];
  return t.intersect = function(_) {
    return tt.polygon(t, v, _);
  }, s;
}
p(up, "person");
var Yw = /* @__PURE__ */ p((e, t, r, i, s, o) => [
  `M${e},${t + o}`,
  `a${s},${o} 0,0,0 ${r},0`,
  `a${s},${o} 0,0,0 ${-r},0`,
  `l0,${i}`,
  `a${s},${o} 0,0,0 ${r},0`,
  `l0,${-i}`
].join(" "), "createCylinderPathD"), Xw = /* @__PURE__ */ p((e, t, r, i, s, o) => [
  `M${e},${t + o}`,
  `M${e + r},${t + o}`,
  `a${s},${o} 0,0,0 ${-r},0`,
  `l0,${i}`,
  `a${s},${o} 0,0,0 ${r},0`,
  `l0,${-i}`
].join(" "), "createOuterCylinderPathD"), jw = /* @__PURE__ */ p((e, t, r, i, s, o) => [`M${e - r / 2},${-i / 2}`, `a${s},${o} 0,0,0 ${r},0`].join(" "), "createInnerCylinderPathD"), cc = 8, dc = 8;
async function fp(e, t) {
  const { labelStyles: r, nodeStyles: i } = ot(t);
  t.labelStyle = r;
  const s = t.padding ?? 0, o = t.look === "neo" ? 24 : s, a = t.look === "neo" ? 24 : s, n = t.width ?? 0;
  if (t.width && (t.width = t.width - a, t.width < dc && (t.width = dc)), t.height) {
    const b = n / 2 / (2.5 + n / 50);
    t.height = t.height - o - b * 3, t.height < cc && (t.height = cc);
  }
  const { shapeSvg: l, bbox: c, label: h } = await ct(e, t, dt(t)), d = Math.max(t.width ?? 0, c.width) + a, u = d / 2, f = u / (2.5 + d / 50), y = Math.max(t.height ?? 0, c.height) + o + f;
  let m;
  const { cssStyles: x } = t;
  if (t.look === "handDrawn") {
    const C = rt.svg(l), b = Xw(0, 0, d, y, u, f), w = jw(0, f, d, y, u, f), T = et(t, {}), B = C.path(b, T), L = C.path(w, et(t, { fill: "none" }));
    m = l.insert(() => L, ":first-child"), m = l.insert(() => B, ":first-child"), m.attr("class", "basic label-container"), x && m.attr("style", x);
  } else {
    const C = Yw(0, 0, d, y, u, f);
    m = l.insert("path", ":first-child").attr("d", C).attr("class", "basic label-container outer-path").attr("style", Wt(x)).attr("style", i);
  }
  return m.attr("label-offset-y", f), m.attr("transform", `translate(${-d / 2}, ${-(y / 2 + f)})`), st(t, m), h.attr(
    "transform",
    `translate(${-(c.width / 2) - (c.x - (c.left ?? 0))}, ${-(c.height / 2) + (t.padding ?? 0) / 1.5 - (c.y - (c.top ?? 0))})`
  ), t.intersect = function(C) {
    const b = tt.rect(t, C), w = b.x - (t.x ?? 0);
    if (u != 0 && (Math.abs(w) < (t.width ?? 0) / 2 || Math.abs(w) == (t.width ?? 0) / 2 && Math.abs(b.y - (t.y ?? 0)) > (t.height ?? 0) / 2 - f)) {
      let T = f * f * (1 - w * w / (u * u));
      T > 0 && (T = Math.sqrt(T)), T = f - T, C.y - (t.y ?? 0) > 0 && (T = -T), b.y += T;
    }
    return b;
  }, l;
}
p(fp, "cylinder");
async function mi(e, t, r) {
  const { labelStyles: i, nodeStyles: s } = ot(t);
  t.labelStyle = i;
  const { shapeSvg: o, bbox: a } = await ct(e, t, dt(t)), n = Math.max(a.width + r.labelPaddingX * 2, t?.width || 0), l = Math.max(a.height + r.labelPaddingY * 2, t?.height || 0), c = -n / 2, h = -l / 2;
  let d, { rx: u, ry: f } = t;
  const { cssStyles: y } = t;
  if (r?.rx && r.ry && (u = r.rx, f = r.ry), t.look === "handDrawn") {
    const m = rt.svg(o), x = et(t, {}), C = u || f ? m.path(fe(c, h, n, l, u || 0), x) : m.rectangle(c, h, n, l, x);
    d = o.insert(() => C, ":first-child"), d.attr("class", "basic label-container").attr("style", Wt(y));
  } else
    d = o.insert("rect", ":first-child"), d.attr("class", "basic label-container").attr("style", s).attr("rx", Wt(u)).attr("ry", Wt(f)).attr("x", c).attr("y", h).attr("width", n).attr("height", l);
  return st(
    t,
    d,
    t.look === "handDrawn" ? void 0 : { width: n, height: l }
  ), t.calcIntersect = function(m, x) {
    return tt.rect(m, x);
  }, t.intersect = function(m) {
    return tt.rect(t, m);
  }, o;
}
p(mi, "drawRect");
async function pp(e, t) {
  const { cssClasses: r, labelPaddingX: i, labelPaddingY: s, padding: o, width: a, height: n } = t, l = {
    rx: 0,
    ry: 0,
    labelPaddingX: i ?? (o ?? 0) * 2,
    labelPaddingY: s ?? o ?? 0
  }, c = await mi(e, t, l);
  if (t.look === "handDrawn") {
    const f = rt.svg(c), y = et(t, {}), m = c.select(".basic.label-container > path:nth-child(2)"), x = m.node();
    if (!x)
      return c;
    let C = null;
    if (x instanceof SVGGraphicsElement)
      C = x.getBBox();
    else
      return c;
    return c.insert(
      () => f.line(C.x, C.y, C.x + C.width, C.y, y),
      ".basic.label-container g.label"
    ), c.insert(
      () => f.line(
        C.x,
        C.y + C.height,
        C.x + C.width,
        C.y + C.height,
        y
      ),
      ".basic.label-container g.label"
    ), m.remove(), c;
  }
  const h = c.select(".basic.label-container"), d = (Number(h.attr("width")) || a) ?? 0, u = (Number(h.attr("height")) || n) ?? 0;
  return d > 0 && u > 0 && h.attr("stroke-dasharray", `${d} ${u}`), c;
}
p(pp, "datastore");
async function gp(e, t) {
  const { labelStyles: r, nodeStyles: i } = ot(t);
  t.labelStyle = r;
  const s = t.look === "neo" ? 16 : t.padding ?? 0, o = t.look === "neo" ? 16 : t.padding ?? 0, { shapeSvg: a, bbox: n, label: l } = await ct(e, t, dt(t)), c = n.width + s, h = n.height + o, d = h * 0.2, u = -c / 2, f = -h / 2 - d / 2, { cssStyles: y } = t, m = rt.svg(a), x = et(t, {});
  t.look !== "handDrawn" && (x.roughness = 0, x.fillStyle = "solid");
  const C = [
    { x: u, y: f + d },
    { x: -u, y: f + d },
    { x: -u, y: -f },
    { x: u, y: -f },
    { x: u, y: f },
    { x: -u, y: f },
    { x: -u, y: f + d }
  ], b = m.polygon(
    C.map((T) => [T.x, T.y]),
    x
  ), w = a.insert(() => b, ":first-child");
  return w.attr("class", "basic label-container outer-path"), y && t.look !== "handDrawn" && w.selectAll("path").attr("style", y), i && t.look !== "handDrawn" && w.selectAll("path").attr("style", i), l.attr(
    "transform",
    `translate(${u + (t.padding ?? 0) / 2 - (n.x - (n.left ?? 0))}, ${f + d + (t.padding ?? 0) / 2 - (n.y - (n.top ?? 0))})`
  ), st(t, w), t.intersect = function(T) {
    return tt.rect(t, T);
  }, a;
}
p(gp, "dividedRectangle");
async function yp(e, t) {
  const { labelStyles: r, nodeStyles: i } = ot(t), s = t.look === "neo" ? 12 : 5;
  t.labelStyle = r;
  const o = t.padding ?? 0, a = t.look === "neo" ? 16 : o, { shapeSvg: n, bbox: l } = await ct(e, t, dt(t)), c = (t?.width ? t?.width / 2 : l.width / 2) + (a ?? 0), h = c - s;
  let d;
  const { cssStyles: u } = t;
  if (t.look === "handDrawn") {
    const f = rt.svg(n), y = et(t, { roughness: 0.2, strokeWidth: 2.5 }), m = et(t, { roughness: 0.2, strokeWidth: 1.5 }), x = f.circle(0, 0, c * 2, y), C = f.circle(0, 0, h * 2, m);
    d = n.insert("g", ":first-child"), d.attr("class", Wt(t.cssClasses)).attr("style", Wt(u)), d.node()?.appendChild(x), d.node()?.appendChild(C);
  } else {
    d = n.insert("g", ":first-child");
    const f = d.insert("circle", ":first-child"), y = d.insert("circle");
    d.attr("class", "basic label-container").attr("style", i), f.attr("class", "outer-circle").attr("style", i).attr("r", c).attr("cx", 0).attr("cy", 0), y.attr("class", "inner-circle").attr("style", i).attr("r", h).attr("cx", 0).attr("cy", 0);
  }
  return st(t, d), t.intersect = function(f) {
    return M.info("DoubleCircle intersect", t, c, f), tt.circle(t, c, f);
  }, n;
}
p(yp, "doublecircle");
function mp(e, t, { config: { themeVariables: r } }) {
  const { labelStyles: i, nodeStyles: s } = ot(t);
  t.label = "", t.labelStyle = i;
  const o = e.insert("g").attr("class", dt(t)).attr("id", t.domId ?? t.id), a = 7, { cssStyles: n } = t, l = rt.svg(o), { nodeBorder: c } = r, h = et(t, { fillStyle: "solid" });
  t.look !== "handDrawn" && (h.roughness = 0);
  const d = l.circle(0, 0, a * 2, h), u = o.insert(() => d, ":first-child");
  return u.selectAll("path").attr("style", `fill: ${c} !important;`), n && n.length > 0 && t.look !== "handDrawn" && u.selectAll("path").attr("style", n), s && t.look !== "handDrawn" && u.selectAll("path").attr("style", s), st(t, u), t.intersect = function(f) {
    return M.info("filledCircle intersect", t, { radius: a, point: f }), tt.circle(t, a, f);
  }, o;
}
p(mp, "filledCircle");
var uc = 10, fc = 10;
async function xp(e, t) {
  const { labelStyles: r, nodeStyles: i } = ot(t);
  t.labelStyle = r;
  const s = t.padding ?? 0, o = t.look === "neo" ? s * 2 : s;
  (t.width || t.height) && (t.height = t?.height ?? 0, t.height < uc && (t.height = uc), t.width = (t?.width ?? 0) - o - o / 2, t.width < fc && (t.width = fc));
  const { shapeSvg: a, bbox: n, label: l } = await ct(e, t, dt(t)), c = (t?.width ? t?.width : n.width) + (o ?? 0), h = t?.height ? t?.height : c + n.height, d = h, u = [
    { x: 0, y: -h },
    { x: d, y: -h },
    { x: d / 2, y: 0 }
  ], { cssStyles: f } = t, y = rt.svg(a), m = et(t, {});
  t.look !== "handDrawn" && (m.roughness = 0, m.fillStyle = "solid");
  const x = Lt(u), C = y.path(x, m), b = a.insert(() => C, ":first-child").attr("transform", `translate(${-h / 2}, ${h / 2})`).attr("class", "outer-path");
  return f && t.look !== "handDrawn" && b.selectChildren("path").attr("style", f), i && t.look !== "handDrawn" && b.selectChildren("path").attr("style", i), t.width = c, t.height = h, st(t, b), l.attr(
    "transform",
    `translate(${-n.width / 2 - (n.x - (n.left ?? 0))}, ${-h / 2 + (t.padding ?? 0) / 2 + (n.y - (n.top ?? 0))})`
  ), t.intersect = function(w) {
    return M.info("Triangle intersect", t, u, w), tt.polygon(t, u, w);
  }, a;
}
p(xp, "flippedTriangle");
async function Cp(e, t) {
  const { labelStyles: r, nodeStyles: i } = ot(t);
  t.labelStyle = r;
  const { shapeSvg: s, bbox: o, label: a } = await ct(e, t, dt(t)), n = t.padding ?? 12, l = Math.max(o.width + n * 2, t.width ?? 0, 90), c = o.height + n * 2, h = Math.max(Math.min(c * 0.16, 14), 8), d = Math.max(c + h, t.height ?? 0), u = d - h, f = Math.max(l * 0.38, 28), y = -d / 2, m = [
    { x: -l / 2, y },
    { x: -l / 2 + f, y },
    { x: -l / 2 + f, y: y + h },
    { x: l / 2, y: y + h },
    { x: l / 2, y: d / 2 },
    { x: -l / 2, y: d / 2 }
  ], x = [
    `M${m[0].x},${m[0].y}`,
    ...m.slice(1).map((T) => `L${T.x},${T.y}`),
    "Z"
  ].join(" "), { cssStyles: C } = t;
  let b;
  if (t.look === "handDrawn") {
    const B = rt.svg(s).path(x, et(t, {}));
    b = s.insert(() => B, ":first-child").attr("class", "basic label-container"), C && b.attr("style", C);
  } else
    b = s.insert("path", ":first-child").attr("d", x).attr("class", "basic label-container").attr("style", i);
  t.look === "handDrawn" ? st(t, b) : st(t, b, { width: l, height: d });
  const w = y + h + u / 2;
  return a.attr(
    "transform",
    `translate(${-(o.width / 2) - (o.x - (o.left ?? 0))}, ${w - o.height / 2 - (o.y - (o.top ?? 0))})`
  ), t.intersect = function(T) {
    return tt.polygon(t, m, T);
  }, s;
}
p(Cp, "folder");
function bp(e, t, { dir: r, config: { state: i, themeVariables: s } }) {
  const { nodeStyles: o } = ot(t);
  t.label = "";
  const a = e.insert("g").attr("class", dt(t)).attr("id", t.domId ?? t.id), { cssStyles: n } = t;
  let l = Math.max(70, t?.width ?? 0), c = Math.max(10, t?.height ?? 0);
  r === "LR" && (l = Math.max(10, t?.width ?? 0), c = Math.max(70, t?.height ?? 0));
  const h = -1 * l / 2, d = -1 * c / 2, u = rt.svg(a), f = et(t, {
    stroke: s.lineColor,
    fill: s.lineColor
  });
  t.look !== "handDrawn" && (f.roughness = 0, f.fillStyle = "solid");
  const y = u.rectangle(h, d, l, c, f), m = a.insert(() => y, ":first-child");
  n && t.look !== "handDrawn" && m.selectAll("path").attr("style", n), o && t.look !== "handDrawn" && m.selectAll("path").attr("style", o), st(t, m);
  const x = i?.padding ?? 0;
  return t.width && t.height && (t.width += x / 2 || 0, t.height += x / 2 || 0), t.intersect = function(C) {
    return tt.rect(t, C);
  }, a;
}
p(bp, "forkJoin");
async function kp(e, t) {
  const { labelStyles: r, nodeStyles: i } = ot(t);
  t.labelStyle = r;
  const s = 15, o = 10, a = t.look === "neo" ? 16 : t.padding ?? 0, n = t.look === "neo" ? 12 : t.padding ?? 0;
  (t.width || t.height) && (t.height = (t?.height ?? 0) - n * 2, t.height < o && (t.height = o), t.width = (t?.width ?? 0) - a * 2, t.width < s && (t.width = s));
  const { shapeSvg: l, bbox: c } = await ct(e, t, dt(t)), h = (t?.width ? t?.width : Math.max(s, c.width)) + a * 2, d = (t?.height ? t?.height : Math.max(o, c.height)) + n * 2, u = d / 2, { cssStyles: f } = t, y = rt.svg(l), m = et(t, {});
  t.look !== "handDrawn" && (m.roughness = 0, m.fillStyle = "solid");
  const x = [
    { x: -h / 2, y: -d / 2 },
    { x: h / 2 - u, y: -d / 2 },
    ...Fe(-h / 2 + u, 0, u, 50, 90, 270),
    { x: h / 2 - u, y: d / 2 },
    { x: -h / 2, y: d / 2 }
  ], C = Lt(x), b = y.path(C, m), w = l.insert(() => b, ":first-child");
  return w.attr("class", "basic label-container outer-path"), f && t.look !== "handDrawn" && w.selectChildren("path").attr("style", f), i && t.look !== "handDrawn" && w.selectChildren("path").attr("style", i), st(t, w), t.intersect = function(T) {
    return M.info("Pill intersect", t, { radius: u, point: T }), tt.polygon(t, x, T);
  }, l;
}
p(kp, "halfRoundedRectangle");
var Uw = /* @__PURE__ */ p((e, t, r, i, s) => [
  `M${e + s},${t}`,
  `L${e + r - s},${t}`,
  `L${e + r},${t - i / 2}`,
  `L${e + r - s},${t - i}`,
  `L${e + s},${t - i}`,
  `L${e},${t - i / 2}`,
  "Z"
].join(" "), "createHexagonPathD");
async function wp(e, t) {
  const { labelStyles: r, nodeStyles: i } = ot(t), s = t.look === "neo" ? 3.5 : 4;
  t.labelStyle = r;
  const o = t.padding ?? 0, a = 70, n = 32, l = t.look === "neo" ? a : o, c = t.look === "neo" ? n : o;
  if (t.width || t.height) {
    const w = (t.height ?? 0) / s;
    t.width = (t?.width ?? 0) - 2 * w - c, t.height = (t.height ?? 0) - l;
  }
  const { shapeSvg: h, bbox: d } = await ct(e, t, dt(t)), u = (t?.height ? t?.height : d.height) + l, f = u / s, y = (t?.width ? t?.width : d.width) + 2 * f + c, m = [
    { x: f, y: 0 },
    { x: y - f, y: 0 },
    { x: y, y: -u / 2 },
    { x: y - f, y: -u },
    { x: f, y: -u },
    { x: 0, y: -u / 2 }
  ];
  let x;
  const { cssStyles: C } = t;
  if (t.look === "handDrawn") {
    const b = rt.svg(h), w = et(t, {}), T = Uw(0, 0, y, u, f), B = b.path(T, w);
    x = h.insert(() => B, ":first-child").attr("transform", `translate(${-y / 2}, ${u / 2})`), C && x.attr("style", C);
  } else
    x = De(h, y, u, m);
  return i && x.attr("style", i), t.width = y, t.height = u, st(t, x), t.intersect = function(b) {
    return tt.polygon(t, m, b);
  }, h;
}
p(wp, "hexagon");
async function Sp(e, t) {
  const { labelStyles: r, nodeStyles: i } = ot(t);
  t.label = "", t.labelStyle = r;
  const { shapeSvg: s } = await ct(e, t, dt(t)), o = Math.max(30, t?.width ?? 0), a = Math.max(30, t?.height ?? 0), { cssStyles: n } = t, l = rt.svg(s), c = et(t, {});
  t.look !== "handDrawn" && (c.roughness = 0, c.fillStyle = "solid");
  const h = [
    { x: 0, y: 0 },
    { x: o, y: 0 },
    { x: 0, y: a },
    { x: o, y: a }
  ], d = Lt(h), u = l.path(d, c), f = s.insert(() => u, ":first-child");
  return f.attr("class", "basic label-container outer-path"), n && t.look !== "handDrawn" && f.selectChildren("path").attr("style", n), i && t.look !== "handDrawn" && f.selectChildren("path").attr("style", i), f.attr("transform", `translate(${-o / 2}, ${-a / 2})`), st(t, f), t.intersect = function(y) {
    return M.info("Pill intersect", t, { points: h }), tt.polygon(t, h, y);
  }, s;
}
p(Sp, "hourglass");
async function Tp(e, t, { config: { themeVariables: r, flowchart: i } }) {
  const { labelStyles: s } = ot(t);
  t.labelStyle = s;
  const o = t.assetHeight ?? 48, a = t.assetWidth ?? 48, n = Math.max(o, a), l = i?.wrappingWidth;
  t.width = Math.max(n, l ?? 0);
  const { shapeSvg: c, bbox: h, label: d } = await ct(e, t, "icon-shape default"), u = t.pos === "t", f = n, y = n, { nodeBorder: m } = r, { stylesMap: x } = yi(t), C = -y / 2, b = -f / 2, w = t.label ? 8 : 0, T = rt.svg(c), B = et(t, { stroke: "none", fill: "none" });
  t.look !== "handDrawn" && (B.roughness = 0, B.fillStyle = "solid");
  const L = T.rectangle(C, b, y, f, B), v = Math.max(y, h.width), _ = f + h.height + w, R = T.rectangle(-v / 2, -_ / 2, v, _, {
    ...B,
    fill: "transparent",
    stroke: "none"
  }), N = c.insert(() => L, ":first-child"), q = c.insert(() => R);
  if (t.icon) {
    const J = c.append("g");
    J.html(
      `<g>${await ys(t.icon, {
        height: n,
        width: n,
        fallbackPrefix: ""
      })}</g>`
    );
    const W = J.node().getBBox(), z = W.width, V = W.height, $ = W.x, P = W.y;
    J.attr(
      "transform",
      `translate(${-z / 2 - $},${u ? h.height / 2 + w / 2 - V / 2 - P : -h.height / 2 - w / 2 - V / 2 - P})`
    ), J.attr("style", `color: ${x.get("stroke") ?? m};`);
  }
  return d.attr(
    "transform",
    `translate(${-h.width / 2 - (h.x - (h.left ?? 0))},${u ? -_ / 2 : _ / 2 - h.height})`
  ), N.attr(
    "transform",
    `translate(0,${u ? h.height / 2 + w / 2 : -h.height / 2 - w / 2})`
  ), st(t, q), t.intersect = function(J) {
    if (M.info("iconSquare intersect", t, J), !t.label)
      return tt.rect(t, J);
    const W = t.x ?? 0, z = t.y ?? 0, V = t.height ?? 0;
    let $ = [];
    return u ? $ = [
      { x: W - h.width / 2, y: z - V / 2 },
      { x: W + h.width / 2, y: z - V / 2 },
      { x: W + h.width / 2, y: z - V / 2 + h.height + w },
      { x: W + y / 2, y: z - V / 2 + h.height + w },
      { x: W + y / 2, y: z + V / 2 },
      { x: W - y / 2, y: z + V / 2 },
      { x: W - y / 2, y: z - V / 2 + h.height + w },
      { x: W - h.width / 2, y: z - V / 2 + h.height + w }
    ] : $ = [
      { x: W - y / 2, y: z - V / 2 },
      { x: W + y / 2, y: z - V / 2 },
      { x: W + y / 2, y: z - V / 2 + f },
      { x: W + h.width / 2, y: z - V / 2 + f },
      { x: W + h.width / 2 / 2, y: z + V / 2 },
      { x: W - h.width / 2, y: z + V / 2 },
      { x: W - h.width / 2, y: z - V / 2 + f },
      { x: W - y / 2, y: z - V / 2 + f }
    ], tt.polygon(t, $, J);
  }, c;
}
p(Tp, "icon");
async function Bp(e, t, { config: { themeVariables: r, flowchart: i } }) {
  const { labelStyles: s } = ot(t);
  t.labelStyle = s;
  const o = t.assetHeight ?? 48, a = t.assetWidth ?? 48, n = Math.max(o, a), l = i?.wrappingWidth;
  t.width = Math.max(n, l ?? 0);
  const { shapeSvg: c, bbox: h, label: d } = await ct(e, t, "icon-shape default"), u = 20, f = t.label ? 8 : 0, y = t.pos === "t", { nodeBorder: m, mainBkg: x } = r, { stylesMap: C } = yi(t), b = rt.svg(c), w = et(t, {});
  t.look !== "handDrawn" && (w.roughness = 0, w.fillStyle = "solid");
  const T = C.get("fill");
  w.stroke = T ?? x;
  const B = c.append("g");
  t.icon && B.html(
    `<g>${await ys(t.icon, {
      height: n,
      width: n,
      fallbackPrefix: ""
    })}</g>`
  );
  const L = B.node().getBBox(), v = L.width, _ = L.height, R = L.x, N = L.y, q = Math.max(v, _) * Math.SQRT2 + u * 2, J = b.circle(0, 0, q, w), W = Math.max(q, h.width), z = q + h.height + f, V = b.rectangle(-W / 2, -z / 2, W, z, {
    ...w,
    fill: "transparent",
    stroke: "none"
  }), $ = c.insert(() => J, ":first-child"), P = c.insert(() => V);
  return B.attr(
    "transform",
    `translate(${-v / 2 - R},${y ? h.height / 2 + f / 2 - _ / 2 - N : -h.height / 2 - f / 2 - _ / 2 - N})`
  ), B.attr("style", `color: ${C.get("stroke") ?? m};`), d.attr(
    "transform",
    `translate(${-h.width / 2 - (h.x - (h.left ?? 0))},${y ? -z / 2 : z / 2 - h.height})`
  ), $.attr(
    "transform",
    `translate(0,${y ? h.height / 2 + f / 2 : -h.height / 2 - f / 2})`
  ), st(t, P), t.intersect = function(Y) {
    return M.info("iconSquare intersect", t, Y), tt.rect(t, Y);
  }, c;
}
p(Bp, "iconCircle");
async function _p(e, t, { config: { themeVariables: r, flowchart: i } }) {
  const { labelStyles: s } = ot(t);
  t.labelStyle = s;
  const o = t.assetHeight ?? 48, a = t.assetWidth ?? 48, n = Math.max(o, a), l = i?.wrappingWidth;
  t.width = Math.max(n, l ?? 0);
  const { shapeSvg: c, bbox: h, halfPadding: d, label: u } = await ct(
    e,
    t,
    "icon-shape default"
  ), f = t.pos === "t", y = n + d * 2, m = n + d * 2, { nodeBorder: x, mainBkg: C } = r, { stylesMap: b } = yi(t), w = -m / 2, T = -y / 2, B = t.label ? 8 : 0, L = rt.svg(c), v = et(t, {});
  t.look !== "handDrawn" && (v.roughness = 0, v.fillStyle = "solid");
  const _ = b.get("fill");
  v.stroke = _ ?? C;
  const R = L.path(fe(w, T, m, y, 5), v), N = Math.max(m, h.width), q = y + h.height + B, J = L.rectangle(-N / 2, -q / 2, N, q, {
    ...v,
    fill: "transparent",
    stroke: "none"
  }), W = c.insert(() => R, ":first-child").attr("class", "icon-shape2"), z = c.insert(() => J);
  if (t.icon) {
    const V = c.append("g");
    V.html(
      `<g>${await ys(t.icon, {
        height: n,
        width: n,
        fallbackPrefix: ""
      })}</g>`
    );
    const $ = V.node().getBBox(), P = $.width, Y = $.height, lt = $.x, at = $.y;
    V.attr(
      "transform",
      `translate(${-P / 2 - lt},${f ? h.height / 2 + B / 2 - Y / 2 - at : -h.height / 2 - B / 2 - Y / 2 - at})`
    ), V.attr("style", `color: ${b.get("stroke") ?? x};`);
  }
  return u.attr(
    "transform",
    `translate(${-h.width / 2 - (h.x - (h.left ?? 0))},${f ? -q / 2 : q / 2 - h.height})`
  ), W.attr(
    "transform",
    `translate(0,${f ? h.height / 2 + B / 2 : -h.height / 2 - B / 2})`
  ), st(t, z), t.intersect = function(V) {
    if (M.info("iconSquare intersect", t, V), !t.label)
      return tt.rect(t, V);
    const $ = t.x ?? 0, P = t.y ?? 0, Y = t.height ?? 0;
    let lt = [];
    return f ? lt = [
      { x: $ - h.width / 2, y: P - Y / 2 },
      { x: $ + h.width / 2, y: P - Y / 2 },
      { x: $ + h.width / 2, y: P - Y / 2 + h.height + B },
      { x: $ + m / 2, y: P - Y / 2 + h.height + B },
      { x: $ + m / 2, y: P + Y / 2 },
      { x: $ - m / 2, y: P + Y / 2 },
      { x: $ - m / 2, y: P - Y / 2 + h.height + B },
      { x: $ - h.width / 2, y: P - Y / 2 + h.height + B }
    ] : lt = [
      { x: $ - m / 2, y: P - Y / 2 },
      { x: $ + m / 2, y: P - Y / 2 },
      { x: $ + m / 2, y: P - Y / 2 + y },
      { x: $ + h.width / 2, y: P - Y / 2 + y },
      { x: $ + h.width / 2 / 2, y: P + Y / 2 },
      { x: $ - h.width / 2, y: P + Y / 2 },
      { x: $ - h.width / 2, y: P - Y / 2 + y },
      { x: $ - m / 2, y: P - Y / 2 + y }
    ], tt.polygon(t, lt, V);
  }, c;
}
p(_p, "iconRounded");
async function vp(e, t, { config: { themeVariables: r, flowchart: i } }) {
  const { labelStyles: s } = ot(t);
  t.labelStyle = s;
  const o = t.assetHeight ?? 48, a = t.assetWidth ?? 48, n = Math.max(o, a), l = i?.wrappingWidth;
  t.width = Math.max(n, l ?? 0);
  const { shapeSvg: c, bbox: h, halfPadding: d, label: u } = await ct(
    e,
    t,
    "icon-shape default"
  ), f = t.pos === "t", y = n + d * 2, m = n + d * 2, { nodeBorder: x, mainBkg: C } = r, { stylesMap: b } = yi(t), w = -m / 2, T = -y / 2, B = t.label ? 8 : 0, L = rt.svg(c), v = et(t, {});
  t.look !== "handDrawn" && (v.roughness = 0, v.fillStyle = "solid");
  const _ = b.get("fill");
  v.stroke = _ ?? C;
  const R = L.path(fe(w, T, m, y, 0.1), v), N = Math.max(m, h.width), q = y + h.height + B, J = L.rectangle(-N / 2, -q / 2, N, q, {
    ...v,
    fill: "transparent",
    stroke: "none"
  }), W = c.insert(() => R, ":first-child"), z = c.insert(() => J);
  if (t.icon) {
    const V = c.append("g");
    V.html(
      `<g>${await ys(t.icon, {
        height: n,
        width: n,
        fallbackPrefix: ""
      })}</g>`
    );
    const $ = V.node().getBBox(), P = $.width, Y = $.height, lt = $.x, at = $.y;
    V.attr(
      "transform",
      `translate(${-P / 2 - lt},${f ? h.height / 2 + B / 2 - Y / 2 - at : -h.height / 2 - B / 2 - Y / 2 - at})`
    ), V.attr("style", `color: ${b.get("stroke") ?? x};`);
  }
  return u.attr(
    "transform",
    `translate(${-h.width / 2 - (h.x - (h.left ?? 0))},${f ? -q / 2 : q / 2 - h.height})`
  ), W.attr(
    "transform",
    `translate(0,${f ? h.height / 2 + B / 2 : -h.height / 2 - B / 2})`
  ), st(t, z), t.intersect = function(V) {
    if (M.info("iconSquare intersect", t, V), !t.label)
      return tt.rect(t, V);
    const $ = t.x ?? 0, P = t.y ?? 0, Y = t.height ?? 0;
    let lt = [];
    return f ? lt = [
      { x: $ - h.width / 2, y: P - Y / 2 },
      { x: $ + h.width / 2, y: P - Y / 2 },
      { x: $ + h.width / 2, y: P - Y / 2 + h.height + B },
      { x: $ + m / 2, y: P - Y / 2 + h.height + B },
      { x: $ + m / 2, y: P + Y / 2 },
      { x: $ - m / 2, y: P + Y / 2 },
      { x: $ - m / 2, y: P - Y / 2 + h.height + B },
      { x: $ - h.width / 2, y: P - Y / 2 + h.height + B }
    ] : lt = [
      { x: $ - m / 2, y: P - Y / 2 },
      { x: $ + m / 2, y: P - Y / 2 },
      { x: $ + m / 2, y: P - Y / 2 + y },
      { x: $ + h.width / 2, y: P - Y / 2 + y },
      { x: $ + h.width / 2 / 2, y: P + Y / 2 },
      { x: $ - h.width / 2, y: P + Y / 2 },
      { x: $ - h.width / 2, y: P - Y / 2 + y },
      { x: $ - m / 2, y: P - Y / 2 + y }
    ], tt.polygon(t, lt, V);
  }, c;
}
p(vp, "iconSquare");
async function Lp(e, t, { config: { flowchart: r } }) {
  const i = new Image();
  i.src = t?.img ?? "", await i.decode();
  const s = Number(i.naturalWidth.toString().replace("px", "")), o = Number(i.naturalHeight.toString().replace("px", ""));
  t.imageAspectRatio = s / o;
  const { labelStyles: a } = ot(t);
  t.labelStyle = a;
  const n = r?.wrappingWidth;
  t.defaultWidth = r?.wrappingWidth;
  const l = Math.max(
    t.label ? n ?? 0 : 0,
    t?.assetWidth ?? s
  ), c = t.constraint === "on" && t?.assetHeight ? t.assetHeight * t.imageAspectRatio : l, h = t.constraint === "on" ? c / t.imageAspectRatio : t?.assetHeight ?? o;
  t.width = Math.max(c, n ?? 0);
  const { shapeSvg: d, bbox: u, label: f } = await ct(e, t, "image-shape default"), y = t.pos === "t", m = -c / 2, x = -h / 2, C = t.label ? 8 : 0, b = rt.svg(d), w = et(t, {});
  t.look !== "handDrawn" && (w.roughness = 0, w.fillStyle = "solid");
  const T = b.rectangle(m, x, c, h, w), B = Math.max(c, u.width), L = h + u.height + C, v = b.rectangle(-B / 2, -L / 2, B, L, {
    ...w,
    fill: "none",
    stroke: "none"
  }), _ = d.insert(() => T, ":first-child"), R = d.insert(() => v);
  if (t.img) {
    const N = d.append("image");
    N.attr("href", t.img), N.attr("width", c), N.attr("height", h), N.attr("preserveAspectRatio", "none"), N.attr(
      "transform",
      `translate(${-c / 2},${y ? L / 2 - h : -L / 2})`
    );
  }
  return f.attr(
    "transform",
    `translate(${-u.width / 2 - (u.x - (u.left ?? 0))},${y ? -h / 2 - u.height / 2 - C / 2 : h / 2 - u.height / 2 + C / 2})`
  ), _.attr(
    "transform",
    `translate(0,${y ? u.height / 2 + C / 2 : -u.height / 2 - C / 2})`
  ), st(t, R), t.intersect = function(N) {
    if (M.info("iconSquare intersect", t, N), !t.label)
      return tt.rect(t, N);
    const q = t.x ?? 0, J = t.y ?? 0, W = t.height ?? 0;
    let z = [];
    return y ? z = [
      { x: q - u.width / 2, y: J - W / 2 },
      { x: q + u.width / 2, y: J - W / 2 },
      { x: q + u.width / 2, y: J - W / 2 + u.height + C },
      { x: q + c / 2, y: J - W / 2 + u.height + C },
      { x: q + c / 2, y: J + W / 2 },
      { x: q - c / 2, y: J + W / 2 },
      { x: q - c / 2, y: J - W / 2 + u.height + C },
      { x: q - u.width / 2, y: J - W / 2 + u.height + C }
    ] : z = [
      { x: q - c / 2, y: J - W / 2 },
      { x: q + c / 2, y: J - W / 2 },
      { x: q + c / 2, y: J - W / 2 + h },
      { x: q + u.width / 2, y: J - W / 2 + h },
      { x: q + u.width / 2 / 2, y: J + W / 2 },
      { x: q - u.width / 2, y: J + W / 2 },
      { x: q - u.width / 2, y: J - W / 2 + h },
      { x: q - c / 2, y: J - W / 2 + h }
    ], tt.polygon(t, z, N);
  }, d;
}
p(Lp, "imageSquare");
async function Fp(e, t) {
  const { labelStyles: r, nodeStyles: i } = ot(t);
  t.labelStyle = r;
  const s = t.padding ?? 0, o = s, a = t.look === "neo" ? s * 2 : s, { shapeSvg: n, bbox: l } = await ct(e, t, dt(t)), c = Math.max(l.height + o * 2, t.height ?? 0), h = Math.max(l.width + a * 2, (t.width ?? 0) - c), d = [
    { x: 0, y: 0 },
    { x: h, y: 0 },
    { x: h + 3 * c / 6, y: -c },
    { x: -3 * c / 6, y: -c }
  ];
  let u;
  const { cssStyles: f } = t;
  if (t.look === "handDrawn") {
    const y = rt.svg(n), m = et(t, {}), x = Lt(d), C = y.path(x, m);
    u = n.insert(() => C, ":first-child").attr("transform", `translate(${-h / 2}, ${c / 2})`), f && u.attr("style", f);
  } else
    u = De(n, h, c, d);
  return i && u.attr("style", i), t.width = h, t.height = c, st(t, u), t.intersect = function(y) {
    return tt.polygon(t, d, y);
  }, n;
}
p(Fp, "inv_trapezoid");
async function Ap(e, t) {
  const { shapeSvg: r, bbox: i, label: s } = await ct(e, t, "label"), o = r.insert("rect", ":first-child");
  return o.attr("width", 0.1).attr("height", 0.1), r.attr("class", "label edgeLabel"), s.attr(
    "transform",
    `translate(${-(i.width / 2) - (i.x - (i.left ?? 0))}, ${-(i.height / 2) - (i.y - (i.top ?? 0))})`
  ), st(t, o), t.intersect = function(l) {
    return tt.rect(t, l);
  }, r;
}
p(Ap, "labelRect");
async function Ep(e, t) {
  const { labelStyles: r, nodeStyles: i } = ot(t);
  t.labelStyle = r;
  const s = t.padding ?? 0, o = s, a = t.look === "neo" ? s * 2 : s, { shapeSvg: n, bbox: l } = await ct(e, t, dt(t)), c = Math.max(l.height + o, t.height ?? 0), h = Math.max(l.width + a, (t.width ?? 0) - c), d = [
    { x: 0, y: 0 },
    { x: h + 3 * c / 6, y: 0 },
    { x: h, y: -c },
    { x: -(3 * c) / 6, y: -c }
  ];
  let u;
  const { cssStyles: f } = t;
  if (t.look === "handDrawn") {
    const y = rt.svg(n), m = et(t, {}), x = Lt(d), C = y.path(x, m);
    u = n.insert(() => C, ":first-child").attr("transform", `translate(${-h / 2}, ${c / 2})`), f && u.attr("style", f);
  } else
    u = De(n, h, c, d);
  return i && u.attr("style", i), t.width = h, t.height = c, st(t, u), t.intersect = function(y) {
    return tt.polygon(t, d, y);
  }, n;
}
p(Ep, "lean_left");
async function Mp(e, t) {
  const { labelStyles: r, nodeStyles: i } = ot(t);
  t.labelStyle = r;
  const s = t.padding ?? 0, o = s, a = t.look === "neo" ? s * 2 : s, { shapeSvg: n, bbox: l } = await ct(e, t, dt(t)), c = Math.max(l.height + o, t.height ?? 0), h = Math.max(l.width + a, (t.width ?? 0) - c), d = [
    { x: -3 * c / 6, y: 0 },
    { x: h, y: 0 },
    { x: h + 3 * c / 6, y: -c },
    { x: 0, y: -c }
  ];
  let u;
  const { cssStyles: f } = t;
  if (t.look === "handDrawn") {
    const y = rt.svg(n), m = et(t, {}), x = Lt(d), C = y.path(x, m);
    u = n.insert(() => C, ":first-child").attr("transform", `translate(${-h / 2}, ${c / 2})`), f && u.attr("style", f);
  } else
    u = De(n, h, c, d);
  return i && u.attr("style", i), t.width = h, t.height = c, st(t, u), t.intersect = function(y) {
    return tt.polygon(t, d, y);
  }, n;
}
p(Mp, "lean_right");
function $p(e, t) {
  const { labelStyles: r, nodeStyles: i } = ot(t);
  t.label = "", t.labelStyle = r;
  const s = e.insert("g").attr("class", dt(t)).attr("id", t.domId ?? t.id), { cssStyles: o } = t, a = Math.max(35, t?.width ?? 0), n = Math.max(35, t?.height ?? 0), l = 7, c = [
    { x: a, y: 0 },
    { x: 0, y: n + l / 2 },
    { x: a - 2 * l, y: n + l / 2 },
    { x: 0, y: 2 * n },
    { x: a, y: n - l / 2 },
    { x: 2 * l, y: n - l / 2 }
  ], h = rt.svg(s), d = et(t, {});
  t.look !== "handDrawn" && (d.roughness = 0, d.fillStyle = "solid");
  const u = Lt(c), f = h.path(u, d), y = s.insert(() => f, ":first-child");
  return y.attr("class", "outer-path"), o && t.look !== "handDrawn" && y.selectAll("path").attr("style", o), i && t.look !== "handDrawn" && y.selectAll("path").attr("style", i), y.attr("transform", `translate(-${a / 2},${-n})`), st(t, y), t.intersect = function(m) {
    return M.info("lightningBolt intersect", t, m), tt.polygon(t, c, m);
  }, s;
}
p($p, "lightningBolt");
var Gw = /* @__PURE__ */ p((e, t, r, i, s, o, a) => [
  `M${e},${t + o}`,
  `a${s},${o} 0,0,0 ${r},0`,
  `a${s},${o} 0,0,0 ${-r},0`,
  `l0,${i}`,
  `a${s},${o} 0,0,0 ${r},0`,
  `l0,${-i}`,
  `M${e},${t + o + a}`,
  `a${s},${o} 0,0,0 ${r},0`
].join(" "), "createCylinderPathD"), Vw = /* @__PURE__ */ p((e, t, r, i, s, o, a) => [
  `M${e},${t + o}`,
  `M${e + r},${t + o}`,
  `a${s},${o} 0,0,0 ${-r},0`,
  `l0,${i}`,
  `a${s},${o} 0,0,0 ${r},0`,
  `l0,${-i}`,
  `M${e},${t + o + a}`,
  `a${s},${o} 0,0,0 ${r},0`
].join(" "), "createOuterCylinderPathD"), Kw = /* @__PURE__ */ p((e, t, r, i, s, o) => [`M${e - r / 2},${-i / 2}`, `a${s},${o} 0,0,0 ${r},0`].join(" "), "createInnerCylinderPathD"), pc = 10, gc = 10;
async function Op(e, t) {
  const { labelStyles: r, nodeStyles: i } = ot(t);
  t.labelStyle = r;
  const s = t.padding ?? 0, o = t.look === "neo" ? 16 : s, a = t.look === "neo" ? 24 : s;
  if (t.width || t.height) {
    const C = t.width ?? 0;
    t.width = (t.width ?? 0) - o, t.width < gc && (t.width = gc);
    const w = C / 2 / (2.5 + C / 50);
    t.height = (t.height ?? 0) - a - w * 3, t.height < pc && (t.height = pc);
  }
  const { shapeSvg: n, bbox: l, label: c } = await ct(e, t, dt(t)), h = (t?.width ? t?.width : l.width) + o * 2, d = h / 2, u = d / (2.5 + h / 50), f = (t?.height ? t?.height : l.height) + u + a * 2, y = f * 0.1;
  let m;
  const { cssStyles: x } = t;
  if (t.look === "handDrawn") {
    const C = rt.svg(n), b = Vw(0, 0, h, f, d, u, y), w = Kw(0, u, h, f, d, u), T = et(t, {}), B = C.path(b, T), L = C.path(w, T);
    n.insert(() => L, ":first-child").attr("class", "line"), m = n.insert(() => B, ":first-child"), m.attr("class", "basic label-container"), x && m.attr("style", x);
  } else {
    const C = Gw(0, 0, h, f, d, u, y);
    m = n.insert("path", ":first-child").attr("d", C).attr("class", "basic label-container outer-path").attr("style", Wt(x)).attr("style", i);
  }
  return m.attr("label-offset-y", u), m.attr("transform", `translate(${-h / 2}, ${-(f / 2 + u)})`), st(t, m), c.attr(
    "transform",
    `translate(${-(l.width / 2) - (l.x - (l.left ?? 0))}, ${-(l.height / 2) + u - (l.y - (l.top ?? 0))})`
  ), t.intersect = function(C) {
    const b = tt.rect(t, C), w = b.x - (t.x ?? 0);
    if (d != 0 && (Math.abs(w) < (t.width ?? 0) / 2 || Math.abs(w) == (t.width ?? 0) / 2 && Math.abs(b.y - (t.y ?? 0)) > (t.height ?? 0) / 2 - u)) {
      let T = u * u * (1 - w * w / (d * d));
      T > 0 && (T = Math.sqrt(T)), T = u - T, C.y - (t.y ?? 0) > 0 && (T = -T), b.y += T;
    }
    return b;
  }, n;
}
p(Op, "linedCylinder");
async function Ip(e, t) {
  const { labelStyles: r, nodeStyles: i } = ot(t);
  t.labelStyle = r;
  const s = t.padding ?? 0, o = t.look === "neo" ? 16 : s, a = t.look === "neo" ? 12 : s;
  if (t.width || t.height) {
    const T = t.width;
    t.width = (T ?? 0) * 10 / 11 - o * 2, t.width < 10 && (t.width = 10), t.height = (t?.height ?? 0) - a * 2, t.height < 10 && (t.height = 10);
  }
  const { shapeSvg: n, bbox: l, label: c } = await ct(e, t, dt(t)), h = (t?.width ? t?.width : l.width) + (o ?? 0) * 2, d = (t?.height ? t?.height : l.height) + (a ?? 0) * 2, u = t.look === "neo" ? d / 4 : d / 8, f = d + u, { cssStyles: y } = t, m = rt.svg(n), x = et(t, {});
  t.look !== "handDrawn" && (x.roughness = 0, x.fillStyle = "solid");
  const C = [
    { x: -h / 2 - h / 2 * 0.1, y: -f / 2 },
    { x: -h / 2 - h / 2 * 0.1, y: f / 2 },
    ...ir(
      -h / 2 - h / 2 * 0.1,
      f / 2,
      h / 2 + h / 2 * 0.1,
      f / 2,
      u,
      0.8
    ),
    { x: h / 2 + h / 2 * 0.1, y: -f / 2 },
    { x: -h / 2 - h / 2 * 0.1, y: -f / 2 },
    { x: -h / 2, y: -f / 2 },
    { x: -h / 2, y: f / 2 * 1.1 },
    { x: -h / 2, y: -f / 2 }
  ], b = m.polygon(
    C.map((T) => [T.x, T.y]),
    x
  ), w = n.insert(() => b, ":first-child");
  return w.attr("class", "basic label-container outer-path"), y && t.look !== "handDrawn" && w.selectAll("path").attr("style", y), i && t.look !== "handDrawn" && w.selectAll("path").attr("style", i), w.attr("transform", `translate(0,${-u / 2})`), c.attr(
    "transform",
    `translate(${-h / 2 + (t.padding ?? 0) + h / 2 * 0.1 / 2 - (l.x - (l.left ?? 0))},${-d / 2 + (t.padding ?? 0) - u / 2 - (l.y - (l.top ?? 0))})`
  ), st(t, w), t.intersect = function(T) {
    return tt.polygon(t, C, T);
  }, n;
}
p(Ip, "linedWaveEdgedRect");
async function Dp(e, t) {
  const { labelStyles: r, nodeStyles: i } = ot(t);
  t.labelStyle = r;
  const s = t.padding ?? 0, o = t.look === "neo" ? 16 : s, a = t.look === "neo" ? 12 : s, n = t.look === "neo" ? 10 : 5;
  (t.width || t.height) && (t.width = Math.max((t?.width ?? 0) - o * 2 - 2 * n, 10), t.height = Math.max((t?.height ?? 0) - a * 2 - 2 * n, 10));
  const { shapeSvg: l, bbox: c, label: h } = await ct(e, t, dt(t)), d = (t?.width ? t?.width : c.width) + o * 2 + 2 * n, u = (t?.height ? t?.height : c.height) + a * 2 + 2 * n, f = d - 2 * n, y = u - 2 * n, m = -f / 2, x = -y / 2, { cssStyles: C } = t, b = rt.svg(l), w = et(t, {}), T = [
    { x: m - n, y: x + n },
    { x: m - n, y: x + y + n },
    { x: m + f - n, y: x + y + n },
    { x: m + f - n, y: x + y },
    { x: m + f, y: x + y },
    { x: m + f, y: x + y - n },
    { x: m + f + n, y: x + y - n },
    { x: m + f + n, y: x - n },
    { x: m + n, y: x - n },
    { x: m + n, y: x },
    { x: m, y: x },
    { x: m, y: x + n }
  ], B = [
    { x: m, y: x + n },
    { x: m + f - n, y: x + n },
    { x: m + f - n, y: x + y },
    { x: m + f, y: x + y },
    { x: m + f, y: x },
    { x: m, y: x }
  ];
  t.look !== "handDrawn" && (w.roughness = 0, w.fillStyle = "solid");
  const L = Lt(T);
  let v = b.path(L, w);
  const _ = Lt(B);
  let R = b.path(_, w);
  t.look !== "handDrawn" && (v = pn(v), R = pn(R));
  const N = l.insert("g", ":first-child");
  return N.insert(() => v), N.insert(() => R), N.attr("class", "basic label-container outer-path"), C && t.look !== "handDrawn" && N.selectAll("path").attr("style", C), i && t.look !== "handDrawn" && N.selectAll("path").attr("style", i), h.attr(
    "transform",
    `translate(${-(c.width / 2) - n - (c.x - (c.left ?? 0))}, ${-(c.height / 2) + n - (c.y - (c.top ?? 0))})`
  ), st(t, N), t.intersect = function(q) {
    return tt.polygon(t, T, q);
  }, l;
}
p(Dp, "multiRect");
async function Pp(e, t) {
  const { labelStyles: r, nodeStyles: i } = ot(t);
  t.labelStyle = r;
  const { shapeSvg: s, bbox: o, label: a } = await ct(e, t, dt(t)), n = t.padding ?? 0, l = t.look === "neo" ? 16 : n, c = t.look === "neo" ? 12 : n;
  let h = !0;
  (t.width || t.height) && (h = !1, t.width = (t?.width ?? 0) - l * 2, t.height = (t?.height ?? 0) - c * 3);
  const d = Math.max(o.width, t?.width ?? 0) + l * 2, u = Math.max(o.height, t?.height ?? 0) + c * 3, f = t.look === "neo" ? u / 4 : u / 8, y = u + (h ? f / 2 : -f / 2), m = -d / 2, x = -y / 2, C = 10, { cssStyles: b } = t, w = ir(
    m - C,
    x + y + C,
    m + d - C,
    x + y + C,
    f,
    0.8
  ), T = w?.[w.length - 1], B = [
    { x: m - C, y: x + C },
    { x: m - C, y: x + y + C },
    ...w,
    { x: m + d - C, y: T.y - C },
    { x: m + d, y: T.y - C },
    { x: m + d, y: T.y - 2 * C },
    { x: m + d + C, y: T.y - 2 * C },
    { x: m + d + C, y: x - C },
    { x: m + C, y: x - C },
    { x: m + C, y: x },
    { x: m, y: x },
    { x: m, y: x + C }
  ], L = [
    { x: m, y: x + C },
    { x: m + d - C, y: x + C },
    { x: m + d - C, y: T.y - C },
    { x: m + d, y: T.y - C },
    { x: m + d, y: x },
    { x: m, y: x }
  ], v = rt.svg(s), _ = et(t, {});
  t.look !== "handDrawn" && (_.roughness = 0, _.fillStyle = "solid");
  const R = Lt(B), N = v.path(R, _), q = Lt(L), J = v.path(q, _), W = s.insert(() => N, ":first-child");
  return W.insert(() => J), W.attr("class", "basic label-container outer-path"), b && t.look !== "handDrawn" && W.selectAll("path").attr("style", b), i && t.look !== "handDrawn" && W.selectAll("path").attr("style", i), W.attr("transform", `translate(0,${-f / 2})`), a.attr(
    "transform",
    `translate(${-(o.width / 2) - C - (o.x - (o.left ?? 0))}, ${-(o.height / 2) + C - f / 2 - (o.y - (o.top ?? 0))})`
  ), st(t, W), t.intersect = function(z) {
    return tt.polygon(t, B, z);
  }, s;
}
p(Pp, "multiWaveEdgedRectangle");
async function Rp(e, t, { config: { themeVariables: r } }) {
  const { labelStyles: i, nodeStyles: s } = ot(t);
  t.labelStyle = i, t.useHtmlLabels || Zt(Dt()) || (t.centerLabel = !0);
  const { shapeSvg: a, bbox: n, label: l } = await ct(e, t, dt(t)), c = Math.max(n.width + (t.padding ?? 0) * 2, t?.width ?? 0), h = Math.max(n.height + (t.padding ?? 0) * 2, t?.height ?? 0), d = -c / 2, u = -h / 2, { cssStyles: f } = t, y = rt.svg(a), m = et(t, {
    fill: r.noteBkgColor,
    stroke: r.noteBorderColor
  });
  t.look !== "handDrawn" && (m.roughness = 0, m.fillStyle = "solid");
  const x = y.rectangle(d, u, c, h, m), C = a.insert(() => x, ":first-child");
  return C.attr("class", "basic label-container outer-path"), l.attr("class", "label noteLabel"), f && t.look !== "handDrawn" && C.selectAll("path").attr("style", f), s && t.look !== "handDrawn" && C.selectAll("path").attr("style", s), l.attr(
    "transform",
    `translate(${-n.width / 2 - (n.x - (n.left ?? 0))}, ${-(n.height / 2) - (n.y - (n.top ?? 0))})`
  ), st(t, C), t.intersect = function(b) {
    return tt.rect(t, b);
  }, a;
}
p(Rp, "note");
var Zw = /* @__PURE__ */ p((e, t, r) => [
  `M${e + r / 2},${t}`,
  `L${e + r},${t - r / 2}`,
  `L${e + r / 2},${t - r}`,
  `L${e},${t - r / 2}`,
  "Z"
].join(" "), "createDecisionBoxPathD");
async function qp(e, t) {
  const { labelStyles: r, nodeStyles: i } = ot(t);
  t.labelStyle = r;
  const { shapeSvg: s, bbox: o } = await ct(e, t, dt(t)), a = o.width + (t.padding ?? 0), n = o.height + (t.padding ?? 0), l = a + n, c = 0.5, h = [
    { x: l / 2, y: 0 },
    { x: l, y: -l / 2 },
    { x: l / 2, y: -l },
    { x: 0, y: -l / 2 }
  ];
  let d;
  const { cssStyles: u } = t;
  if (t.look === "handDrawn") {
    const f = rt.svg(s), y = et(t, {}), m = Zw(0, 0, l), x = f.path(m, y);
    d = s.insert(() => x, ":first-child").attr("transform", `translate(${-l / 2 + c}, ${l / 2})`), u && d.attr("style", u);
  } else
    d = De(s, l, l, h), d.attr("transform", `translate(${-l / 2 + c}, ${l / 2})`);
  return i && d.attr("style", i), st(t, d), t.calcIntersect = function(f, y) {
    const m = f.width, x = [
      { x: m / 2, y: 0 },
      { x: m, y: -m / 2 },
      { x: m / 2, y: -m },
      { x: 0, y: -m / 2 }
    ], C = tt.polygon(f, x, y);
    return { x: C.x - 0.5, y: C.y - 0.5 };
  }, t.intersect = function(f) {
    return this.calcIntersect(t, f);
  }, s;
}
p(qp, "question");
async function Np(e, t) {
  const { labelStyles: r, nodeStyles: i } = ot(t);
  t.labelStyle = r;
  const s = t.padding ?? 0, o = t.look === "neo" ? 21 : s ?? 0, a = t.look === "neo" ? 12 : s ?? 0, { shapeSvg: n, bbox: l, label: c } = await ct(e, t, dt(t)), h = l.width + (t.look === "neo" ? o * 2 : o), d = Math.max(
    l.height + (t.look === "neo" ? a * 2 : a),
    t.height ?? 0
  ), u = d / 4, y = -Math.max(h, (t.width ?? 0) - u) / 2, m = -d / 2, x = m / 2, C = [
    { x: y + x, y: m },
    { x: y, y: 0 },
    { x: y + x, y: -m },
    { x: -y, y: -m },
    { x: -y, y: m }
  ], { cssStyles: b } = t, w = rt.svg(n), T = et(t, {});
  t.look !== "handDrawn" && (T.roughness = 0, T.fillStyle = "solid");
  const B = Lt(C), L = w.path(B, T), v = n.insert(() => L, ":first-child");
  return v.attr("class", "basic label-container outer-path"), b && t.look !== "handDrawn" && v.selectAll("path").attr("style", b), i && t.look !== "handDrawn" && v.selectAll("path").attr("style", i), v.attr("transform", `translate(${-x / 2},0)`), c.attr(
    "transform",
    `translate(${-x / 2 - l.width / 2 - (l.x - (l.left ?? 0))}, ${-(l.height / 2) - (l.y - (l.top ?? 0))})`
  ), st(t, v), t.intersect = function(_) {
    return tt.polygon(t, C, _);
  }, n;
}
p(Np, "rect_left_inv_arrow");
async function Wp(e, t) {
  const { labelStyles: r, nodeStyles: i } = ot(t);
  t.labelStyle = r;
  let s;
  t.cssClasses ? s = "node " + t.cssClasses : s = "node default";
  const o = e.insert("g").attr("class", s).attr("id", t.domId || t.id), a = o.insert("g"), n = o.insert("g").attr("class", "label").attr("style", i), l = t.description, c = t.label, h = await Ze(n, c, t.labelStyle, !0, !0);
  let d = { width: 0, height: 0 };
  if (Zt(Bt())) {
    const _ = h.children[0], R = xt(h);
    d = _.getBoundingClientRect(), R.attr("width", d.width), R.attr("height", d.height);
  }
  M.info("Text 2", l);
  const u = l || [], f = h.getBBox(), y = await Ze(
    n,
    Array.isArray(u) ? u.join("<br/>") : u,
    t.labelStyle,
    !0,
    !0
  ), m = y.children[0], x = xt(y);
  d = m.getBoundingClientRect(), x.attr("width", d.width), x.attr("height", d.height);
  const C = (t.padding || 0) / 2;
  xt(y).attr(
    "transform",
    "translate( " + (d.width > f.width ? 0 : (f.width - d.width) / 2) + ", " + (f.height + C + 5) + ")"
  ), xt(h).attr(
    "transform",
    "translate( " + (d.width < f.width ? 0 : -(f.width - d.width) / 2) + ", 0)"
  ), d = n.node().getBBox(), n.attr(
    "transform",
    "translate(" + -d.width / 2 + ", " + (-d.height / 2 - C + 3) + ")"
  );
  const b = d.width + (t.padding || 0), w = d.height + (t.padding || 0), T = -d.width / 2 - C, B = -d.height / 2 - C;
  let L, v;
  if (t.look === "handDrawn") {
    const _ = rt.svg(o), R = et(t, {}), N = _.path(
      fe(T, B, b, w, t.rx || 0),
      R
    ), q = _.line(
      -d.width / 2 - C,
      -d.height / 2 - C + f.height + C,
      d.width / 2 + C,
      -d.height / 2 - C + f.height + C,
      R
    );
    v = o.insert(() => (M.debug("Rough node insert CXC", N), q), ":first-child"), L = o.insert(() => (M.debug("Rough node insert CXC", N), N), ":first-child");
  } else
    L = a.insert("rect", ":first-child"), v = a.insert("line"), L.attr("class", "outer title-state").attr("style", i).attr("x", -d.width / 2 - C).attr("y", -d.height / 2 - C).attr("width", d.width + (t.padding || 0)).attr("height", d.height + (t.padding || 0)), v.attr("class", "divider").attr("x1", -d.width / 2 - C).attr("x2", d.width / 2 + C).attr("y1", -d.height / 2 - C + f.height + C).attr("y2", -d.height / 2 - C + f.height + C);
  return st(t, L), t.intersect = function(_) {
    return tt.rect(t, _);
  }, o;
}
p(Wp, "rectWithTitle");
async function zp(e, t, { config: { themeVariables: r } }) {
  const i = r?.radius ?? 5, s = {
    rx: i,
    ry: i,
    labelPaddingX: (t?.padding ?? 0) * 1,
    labelPaddingY: (t?.padding ?? 0) * 1
  };
  return mi(e, t, s);
}
p(zp, "roundedRect");
var ar = 8;
async function Hp(e, t) {
  const { labelStyles: r, nodeStyles: i } = ot(t);
  t.labelStyle = r;
  const s = t.look === "neo" ? 16 : t.padding ?? 0, o = t.look === "neo" ? 12 : t.padding ?? 0, { shapeSvg: a, bbox: n, label: l } = await ct(e, t, dt(t)), c = (t?.width ?? n.width) + s * 2 + (t.look === "neo" ? ar : ar * 2), h = (t?.height ?? n.height) + o * 2, d = c - ar, u = h, f = ar - c / 2, y = -h / 2, { cssStyles: m } = t, x = rt.svg(a), C = et(t, {});
  t.look !== "handDrawn" && (C.roughness = 0, C.fillStyle = "solid");
  const b = [
    { x: f, y },
    { x: f + d, y },
    { x: f + d, y: y + u },
    { x: f - ar, y: y + u },
    { x: f - ar, y },
    { x: f, y },
    { x: f, y: y + u }
  ], w = x.polygon(
    b.map((B) => [B.x, B.y]),
    C
  ), T = a.insert(() => w, ":first-child");
  return T.attr("class", "basic label-container outer-path").attr("style", Wt(m)), i && t.look !== "handDrawn" && T.selectAll("path").attr("style", i), m && t.look !== "handDrawn" && T.selectAll("path").attr("style", i), l.attr(
    "transform",
    `translate(${ar / 2 - n.width / 2 - (n.x - (n.left ?? 0))}, ${-(n.height / 2) - (n.y - (n.top ?? 0))})`
  ), st(t, T), t.intersect = function(B) {
    return tt.rect(t, B);
  }, a;
}
p(Hp, "shadedProcess");
async function Yp(e, t) {
  const { labelStyles: r, nodeStyles: i } = ot(t);
  t.labelStyle = r;
  const s = t.padding ?? 0, o = t.look === "neo" ? 16 : s, a = t.look === "neo" ? 12 : s;
  (t.width || t.height) && (t.width = Math.max((t?.width ?? 0) - o * 2, 10), t.height = Math.max((t?.height ?? 0) / 1.5 - a * 2, 10));
  const { shapeSvg: n, bbox: l, label: c } = await ct(e, t, dt(t)), h = (t?.width ? t?.width : l.width) + o * 2, d = ((t?.height ? t?.height : l.height) + a * 2) * 1.5, u = h, f = d / 1.5, y = -u / 2, m = -f / 2, { cssStyles: x } = t, C = rt.svg(n), b = et(t, {});
  t.look !== "handDrawn" && (b.roughness = 0, b.fillStyle = "solid");
  const w = [
    { x: y, y: m },
    { x: y, y: m + f },
    { x: y + u, y: m + f },
    { x: y + u, y: m - f / 2 }
  ], T = Lt(w), B = C.path(T, b), L = n.insert(() => B, ":first-child");
  return L.attr("class", "basic label-container  outer-path"), x && t.look !== "handDrawn" && L.selectChildren("path").attr("style", x), i && t.look !== "handDrawn" && L.selectChildren("path").attr("style", i), L.attr("transform", `translate(0, ${f / 4})`), c.attr(
    "transform",
    `translate(${-u / 2 + (t.padding ?? 0) - (l.x - (l.left ?? 0))}, ${-f / 4 + (t.padding ?? 0) - (l.y - (l.top ?? 0))})`
  ), st(t, L), t.intersect = function(v) {
    return tt.polygon(t, w, v);
  }, n;
}
p(Yp, "slopedRect");
async function Xp(e, t) {
  const r = t.padding ?? 0, i = t.look === "neo" ? 16 : r * 2, s = t.look === "neo" ? 12 : r, o = {
    rx: 0,
    ry: 0,
    labelPaddingX: t.labelPaddingX ?? i,
    labelPaddingY: s
  };
  return mi(e, t, o);
}
p(Xp, "squareRect");
async function jp(e, t) {
  const { labelStyles: r, nodeStyles: i } = ot(t);
  t.labelStyle = r;
  const s = t.padding ?? 0, o = t.look === "neo" ? 20 : s, a = t.look === "neo" ? 12 : s, { shapeSvg: n, bbox: l } = await ct(e, t, dt(t)), c = l.height + (t.look === "neo" ? a * 2 : a), h = l.width + c / 4 + (t.look === "neo" ? o * 2 : o), d = c / 2, { cssStyles: u } = t, f = rt.svg(n), y = et(t, {});
  t.look !== "handDrawn" && (y.roughness = 0, y.fillStyle = "solid");
  const m = [
    { x: -h / 2 + d, y: -c / 2 },
    { x: h / 2 - d, y: -c / 2 },
    ...Fe(-h / 2 + d, 0, d, 50, 90, 270),
    { x: h / 2 - d, y: c / 2 },
    ...Fe(h / 2 - d, 0, d, 50, 270, 450)
  ], x = Lt(m), C = f.path(x, y), b = n.insert(() => C, ":first-child");
  return b.attr("class", "basic label-container outer-path"), u && t.look !== "handDrawn" && b.selectChildren("path").attr("style", u), i && t.look !== "handDrawn" && b.selectChildren("path").attr("style", i), st(t, b), t.intersect = function(w) {
    return tt.polygon(t, m, w);
  }, n;
}
p(jp, "stadium");
async function Up(e, t) {
  const r = {
    rx: t.look === "neo" ? 3 : 5,
    ry: t.look === "neo" ? 3 : 5
  };
  return mi(e, t, r);
}
p(Up, "state");
function Gp(e, t, { config: { themeVariables: r } }) {
  const { labelStyles: i, nodeStyles: s } = ot(t);
  t.labelStyle = i;
  const { cssStyles: o } = t, { lineColor: a, stateBorder: n, nodeBorder: l, nodeShadow: c } = r;
  (t.width || t.height) && ((t.width ?? 0) < 14 && (t.width = 14), (t.height ?? 0) < 14 && (t.height = 14)), t.width || (t.width = 14), t.height || (t.height = 14);
  const h = e.insert("g").attr("class", "node default").attr("id", t.domId ?? t.id), d = rt.svg(h), u = et(t, {});
  t.look !== "handDrawn" && (u.roughness = 0, u.fillStyle = "solid");
  const f = d.circle(0, 0, t.width, {
    ...u,
    stroke: a,
    strokeWidth: 2
  }), y = n ?? l, m = (t.width ?? 0) * 5 / 14, x = d.circle(0, 0, m, {
    ...u,
    fill: y,
    stroke: y,
    strokeWidth: 2,
    fillStyle: "solid"
  }), C = h.insert(() => f, ":first-child");
  if (C.insert(() => x), t.look !== "handDrawn" && C.attr("class", "outer-path"), o && C.selectAll("path").attr("style", o), s && C.selectAll("path").attr("style", s), t.width < 25 && c && t.look !== "handDrawn") {
    const b = e.node()?.ownerSVGElement?.id ?? "", w = b ? `${b}-drop-shadow-small` : "drop-shadow-small";
    C.attr("style", `filter:url(#${w})`);
  }
  return st(t, C), t.intersect = function(b) {
    return tt.circle(t, (t.width ?? 0) / 2, b);
  }, h;
}
p(Gp, "stateEnd");
function Vp(e, t, { config: { themeVariables: r } }) {
  const { lineColor: i, nodeShadow: s } = r;
  (t.width || t.height) && ((t.width ?? 0) < 14 && (t.width = 14), (t.height ?? 0) < 14 && (t.height = 14)), t.width || (t.width = 14), t.height || (t.height = 14);
  const o = e.insert("g").attr("class", "node default").attr("id", t.domId || t.id);
  let a;
  if (t.look === "handDrawn") {
    const l = rt.svg(o).circle(0, 0, t.width, Zk(i));
    a = o.insert(() => l), a.attr("class", "state-start").attr("r", (t.width ?? 7) / 2).attr("width", t.width ?? 14).attr("height", t.height ?? 14);
  } else
    a = o.insert("circle", ":first-child"), a.attr("class", "state-start").attr("r", (t.width ?? 7) / 2).attr("width", t.width ?? 14).attr("height", t.height ?? 14);
  if (t.width < 25 && s && t.look !== "handDrawn") {
    const n = e.node()?.ownerSVGElement?.id ?? "", l = n ? `${n}-drop-shadow-small` : "drop-shadow-small";
    a.attr("style", `filter:url(#${l})`);
  }
  return st(t, a), t.intersect = function(n) {
    return tt.circle(t, (t.width ?? 7) / 2, n);
  }, o;
}
p(Vp, "stateStart");
var Pr = 8;
async function Kp(e, t) {
  const { labelStyles: r, nodeStyles: i } = ot(t);
  t.labelStyle = r;
  const s = t?.padding ?? 8, o = t.look === "neo" ? 28 : s, a = t.look === "neo" ? 12 : s, { shapeSvg: n, bbox: l } = await ct(e, t, dt(t)), c = Math.max(l.width + 2 * Pr + o, t.width ?? 0), h = Math.max(l.height + a, t.height ?? 0), d = c - 2 * Pr, u = h, f = -c / 2, y = -h / 2, m = [
    { x: 0, y: 0 },
    { x: d, y: 0 },
    { x: d, y: -u },
    { x: 0, y: -u },
    { x: 0, y: 0 },
    { x: -8, y: 0 },
    { x: d + 8, y: 0 },
    { x: d + 8, y: -u },
    { x: -8, y: -u },
    { x: -8, y: 0 }
  ];
  if (t.look === "handDrawn") {
    const x = rt.svg(n), C = et(t, {}), b = x.rectangle(f, y, d + 16, u, C), w = x.line(f + Pr, y, f + Pr, y + u, C), T = x.line(f + Pr + d, y, f + Pr + d, y + u, C);
    n.insert(() => w, ":first-child"), n.insert(() => T, ":first-child");
    const B = n.insert(() => b, ":first-child"), { cssStyles: L } = t;
    B.attr("class", "basic label-container").attr("style", Wt(L)), st(t, B);
  } else {
    const x = De(n, d, u, m);
    i && x.attr("style", i), st(t, x);
  }
  return t.intersect = function(x) {
    return tt.polygon(t, m, x);
  }, n;
}
p(Kp, "subroutine");
var na = 0.2;
async function Zp(e, t) {
  const { labelStyles: r, nodeStyles: i } = ot(t);
  t.labelStyle = r;
  const s = t.padding ?? 0, o = t.look === "neo" ? 16 : s, a = t.look === "neo" ? 12 : s;
  (t.width || t.height) && (t.height = Math.max((t?.height ?? 0) - a * 2, 10), t.width = Math.max(
    (t?.width ?? 0) - o * 2 - na * (t.height + a * 2),
    10
  ));
  const { shapeSvg: n, bbox: l } = await ct(e, t, dt(t)), c = (t?.height ? t?.height : l.height) + a * 2, h = na * c, d = na * c, f = (t?.width ? t?.width : l.width) + o * 2 + h - h, y = c, m = -f / 2, x = -y / 2, { cssStyles: C } = t, b = rt.svg(n), w = et(t, {}), T = [
    { x: m - h / 2, y: x },
    { x: m + f + h / 2, y: x },
    { x: m + f + h / 2, y: x + y },
    { x: m - h / 2, y: x + y }
  ], B = [
    { x: m + f - h / 2, y: x + y },
    { x: m + f + h / 2, y: x + y },
    { x: m + f + h / 2, y: x + y - d }
  ];
  t.look !== "handDrawn" && (w.roughness = 0, w.fillStyle = "solid");
  const L = Lt(T), v = b.path(L, w), _ = Lt(B), R = b.path(_, { ...w, fillStyle: "solid" }), N = n.insert(() => R, ":first-child");
  return N.insert(() => v, ":first-child"), N.attr("class", "basic label-container outer-path"), C && t.look !== "handDrawn" && N.selectAll("path").attr("style", C), i && t.look !== "handDrawn" && N.selectAll("path").attr("style", i), st(t, N), t.intersect = function(q) {
    return tt.polygon(t, T, q);
  }, n;
}
p(Zp, "taggedRect");
async function Qp(e, t) {
  const { labelStyles: r, nodeStyles: i } = ot(t);
  t.labelStyle = r;
  const { shapeSvg: s, bbox: o, label: a } = await ct(e, t, dt(t)), n = Math.max(o.width + (t.padding ?? 0) * 2, t?.width ?? 0), l = Math.max(o.height + (t.padding ?? 0) * 2, t?.height ?? 0), c = l / 8, h = 0.2 * n, d = 0.2 * l, u = l + c, { cssStyles: f } = t, y = rt.svg(s), m = et(t, {});
  t.look !== "handDrawn" && (m.roughness = 0, m.fillStyle = "solid");
  const x = [
    { x: -n / 2 - n / 2 * 0.1, y: u / 2 },
    ...ir(
      -n / 2 - n / 2 * 0.1,
      u / 2,
      n / 2 + n / 2 * 0.1,
      u / 2,
      c,
      0.8
    ),
    { x: n / 2 + n / 2 * 0.1, y: -u / 2 },
    { x: -n / 2 - n / 2 * 0.1, y: -u / 2 }
  ], C = -n / 2 + n / 2 * 0.1, b = -u / 2 - d * 0.4, w = [
    { x: C + n - h, y: (b + l) * 1.3 },
    { x: C + n, y: b + l - d },
    { x: C + n, y: (b + l) * 0.9 },
    ...ir(
      C + n,
      (b + l) * 1.25,
      C + n - h,
      (b + l) * 1.3,
      -l * 0.02,
      0.5
    )
  ], T = Lt(x), B = y.path(T, m), L = Lt(w), v = y.path(L, {
    ...m,
    fillStyle: "solid"
  }), _ = s.insert(() => v, ":first-child");
  return _.insert(() => B, ":first-child"), _.attr("class", "basic label-container outer-path"), f && t.look !== "handDrawn" && _.selectAll("path").attr("style", f), i && t.look !== "handDrawn" && _.selectAll("path").attr("style", i), _.attr("transform", `translate(0,${-c / 2})`), a.attr(
    "transform",
    `translate(${-n / 2 + (t.padding ?? 0) - (o.x - (o.left ?? 0))},${-l / 2 + (t.padding ?? 0) - c / 2 - (o.y - (o.top ?? 0))})`
  ), st(t, _), t.intersect = function(R) {
    return tt.polygon(t, x, R);
  }, s;
}
p(Qp, "taggedWaveEdgedRectangle");
async function Jp(e, t) {
  const { labelStyles: r, nodeStyles: i } = ot(t);
  t.labelStyle = r;
  const { shapeSvg: s, bbox: o } = await ct(e, t, dt(t)), a = Math.max(o.width + (t.padding ?? 0), t?.width || 0), n = Math.max(o.height + (t.padding ?? 0), t?.height || 0), l = -a / 2, c = -n / 2, h = s.insert("rect", ":first-child");
  return h.attr("class", "text").attr("style", i).attr("rx", 0).attr("ry", 0).attr("x", l).attr("y", c).attr("width", a).attr("height", n), st(t, h), t.intersect = function(d) {
    return tt.rect(t, d);
  }, s;
}
p(Jp, "text");
var Qw = /* @__PURE__ */ p((e, t, r, i, s, o) => `M${e},${t}
    a${s},${o} 0,0,1 0,${-i}
    l${r},0
    a${s},${o} 0,0,1 0,${i}
    M${r},${-i}
    a${s},${o} 0,0,0 0,${i}
    l${-r},0`, "createCylinderPathD"), Jw = /* @__PURE__ */ p((e, t, r, i, s, o) => [
  `M${e},${t}`,
  `M${e + r},${t}`,
  `a${s},${o} 0,0,0 0,${-i}`,
  `l${-r},0`,
  `a${s},${o} 0,0,0 0,${i}`,
  `l${r},0`
].join(" "), "createOuterCylinderPathD"), tS = /* @__PURE__ */ p((e, t, r, i, s, o) => [`M${e + r / 2},${-i / 2}`, `a${s},${o} 0,0,0 0,${i}`].join(" "), "createInnerCylinderPathD"), yc = 5, mc = 10;
async function tg(e, t) {
  const { labelStyles: r, nodeStyles: i } = ot(t);
  t.labelStyle = r;
  const s = t.padding ?? 0, o = t.look === "neo" ? 12 : s / 2, a = t.height ?? 0;
  if (t.height && (t.height = t.height - o, t.height < yc && (t.height = yc)), t.width) {
    const C = a / 2 / (2.5 + a / 50);
    t.width = t.width - o - C * 3, t.width < mc && (t.width = mc);
  }
  const { shapeSvg: n, bbox: l, label: c } = await ct(e, t, dt(t)), h = Math.max(t.height ?? 0, l.height) + o, d = h / 2, u = d / (2.5 + h / 50), f = Math.max(t.width ?? 0, l.width) + u + o, { cssStyles: y } = t;
  let m;
  if (t.look === "handDrawn") {
    const x = rt.svg(n), C = Jw(0, 0, f, h, u, d), b = tS(0, 0, f, h, u, d), w = x.path(C, et(t, {})), T = x.path(b, et(t, { fill: "none" }));
    m = n.insert(() => T, ":first-child"), m = n.insert(() => w, ":first-child"), m.attr("class", "basic label-container"), y && m.attr("style", y);
  } else {
    const x = Qw(0, 0, f, h, u, d);
    m = n.insert("path", ":first-child").attr("d", x).attr("class", "basic label-container").attr("style", Wt(y)).attr("style", i), m.attr("class", "basic label-container outer-path"), y && m.selectAll("path").attr("style", y), i && m.selectAll("path").attr("style", i);
  }
  return m.attr("label-offset-x", u), m.attr("transform", `translate(${-f / 2}, ${h / 2} )`), c.attr(
    "transform",
    `translate(${-(l.width / 2) - u - (l.x - (l.left ?? 0))}, ${-(l.height / 2) - (l.y - (l.top ?? 0))})`
  ), st(t, m), t.intersect = function(x) {
    const C = tt.rect(t, x), b = C.y - (t.y ?? 0);
    if (d != 0 && (Math.abs(b) < (t.height ?? 0) / 2 || Math.abs(b) == (t.height ?? 0) / 2 && Math.abs(C.x - (t.x ?? 0)) > (t.width ?? 0) / 2 - u)) {
      let w = u * u * (1 - b * b / (d * d));
      w != 0 && (w = Math.sqrt(Math.abs(w))), w = u - w, x.x - (t.x ?? 0) > 0 && (w = -w), C.x += w;
    }
    return C;
  }, n;
}
p(tg, "tiltedCylinder");
async function eg(e, t) {
  const { labelStyles: r, nodeStyles: i } = ot(t);
  t.labelStyle = r;
  const s = t.padding ?? 0, o = (t.look === "neo", s), a = t.look === "neo" ? s * 2 : s, { shapeSvg: n, bbox: l } = await ct(e, t, dt(t)), c = Math.max(l.height + o, t.height ?? 0), h = Math.max(l.width + a, (t.width ?? 0) - c), d = [
    { x: -3 * c / 6, y: 0 },
    { x: h + 3 * c / 6, y: 0 },
    { x: h, y: -c },
    { x: 0, y: -c }
  ];
  let u;
  const { cssStyles: f } = t;
  if (t.look === "handDrawn") {
    const y = rt.svg(n), m = et(t, {}), x = Lt(d), C = y.path(x, m);
    u = n.insert(() => C, ":first-child").attr("transform", `translate(${-h / 2}, ${c / 2})`), f && u.attr("style", f);
  } else
    u = De(n, h, c, d);
  return i && u.attr("style", i), t.width = h, t.height = c, st(t, u), t.intersect = function(y) {
    return tt.polygon(t, d, y);
  }, n;
}
p(eg, "trapezoid");
async function rg(e, t) {
  const { labelStyles: r, nodeStyles: i } = ot(t);
  t.labelStyle = r;
  const s = t.padding ?? 0, o = t.look === "neo" ? 16 : s, a = t.look === "neo" ? 12 : s, n = 15, l = 5;
  (t.width || t.height) && (t.height = (t.height ?? 0) - a * 2, t.height < l && (t.height = l), t.width = (t.width ?? 0) - o * 2, t.width < n && (t.width = n));
  const { shapeSvg: c, bbox: h } = await ct(e, t, dt(t)), d = (t?.width ? t?.width : h.width) + o * 2, u = (t?.height ? t?.height : h.height) + a * 2, { cssStyles: f } = t, y = rt.svg(c), m = et(t, {});
  t.look !== "handDrawn" && (m.roughness = 0, m.fillStyle = "solid");
  const x = [
    { x: -d / 2 * 0.8, y: -u / 2 },
    { x: d / 2 * 0.8, y: -u / 2 },
    { x: d / 2, y: -u / 2 * 0.6 },
    { x: d / 2, y: u / 2 },
    { x: -d / 2, y: u / 2 },
    { x: -d / 2, y: -u / 2 * 0.6 }
  ], C = Lt(x), b = y.path(C, m), w = c.insert(() => b, ":first-child");
  return w.attr("class", "basic label-container outer-path"), f && t.look !== "handDrawn" && w.selectChildren("path").attr("style", f), i && t.look !== "handDrawn" && w.selectChildren("path").attr("style", i), st(t, w), t.intersect = function(T) {
    return tt.polygon(t, x, T);
  }, c;
}
p(rg, "trapezoidalPentagon");
var xc = 10, Cc = 10;
async function ig(e, t) {
  const { labelStyles: r, nodeStyles: i } = ot(t);
  t.labelStyle = r;
  const s = t.padding ?? 0, o = t.look === "neo" ? s * 2 : s;
  (t.width || t.height) && (t.width = ((t?.width ?? 0) - o) / 2, t.width < Cc && (t.width = Cc), t.height = t?.height ?? 0, t.height < xc && (t.height = xc));
  const { shapeSvg: a, bbox: n, label: l } = await ct(e, t, dt(t)), c = Oe(Bt().flowchart?.htmlLabels), h = (t?.width ? t?.width : n.width) + o, d = t?.height ? t?.height : h + n.height, u = d, f = [
    { x: 0, y: 0 },
    { x: u, y: 0 },
    { x: u / 2, y: -d }
  ], { cssStyles: y } = t, m = rt.svg(a), x = et(t, {});
  t.look !== "handDrawn" && (x.roughness = 0, x.fillStyle = "solid");
  const C = Lt(f), b = m.path(C, x), w = a.insert(() => b, ":first-child").attr("transform", `translate(${-d / 2}, ${d / 2})`).attr("class", "outer-path");
  return y && t.look !== "handDrawn" && w.selectChildren("path").attr("style", y), i && t.look !== "handDrawn" && w.selectChildren("path").attr("style", i), t.width = h, t.height = d, st(t, w), l.attr(
    "transform",
    `translate(${-n.width / 2 - (n.x - (n.left ?? 0))}, ${d / 2 - (n.height + (t.padding ?? 0) / (c ? 2 : 1) - (n.y - (n.top ?? 0)))})`
  ), t.intersect = function(T) {
    return M.info("Triangle intersect", t, f, T), tt.polygon(t, f, T);
  }, a;
}
p(ig, "triangle");
async function sg(e, t) {
  const { labelStyles: r, nodeStyles: i } = ot(t);
  t.labelStyle = r;
  const s = t.padding ?? 0, o = t.look === "neo" ? 16 : s, a = t.look === "neo" ? 12 : s;
  let n = !0;
  (t.width || t.height) && (n = !1, t.width = (t?.width ?? 0) - o * 2, t.width < 10 && (t.width = 10), t.height = (t?.height ?? 0) - a * 2, t.height < 10 && (t.height = 10));
  const { shapeSvg: l, bbox: c, label: h } = await ct(e, t, dt(t)), d = (t?.width ? t?.width : c.width) + (o ?? 0) * 2, u = (t?.height ? t?.height : c.height) + (a ?? 0) * 2, f = t.look === "neo" ? u / 4 : u / 8, y = u + (n ? f : -f), { cssStyles: m } = t, C = 14 - d, b = C > 0 ? C / 2 : 0, w = rt.svg(l), T = et(t, {});
  t.look !== "handDrawn" && (T.roughness = 0, T.fillStyle = "solid");
  const B = [
    { x: -d / 2 - b, y: y / 2 },
    ...ir(
      -d / 2 - b,
      y / 2,
      d / 2 + b,
      y / 2,
      f,
      0.8
    ),
    { x: d / 2 + b, y: -y / 2 },
    { x: -d / 2 - b, y: -y / 2 }
  ], L = Lt(B), v = w.path(L, T), _ = l.insert(() => v, ":first-child");
  return _.attr("class", "basic label-container outer-path"), m && t.look !== "handDrawn" && _.selectAll("path").attr("style", m), i && t.look !== "handDrawn" && _.selectAll("path").attr("style", i), _.attr("transform", `translate(0,${-f / 2})`), h.attr(
    "transform",
    `translate(${-d / 2 + (t.padding ?? 0) - (c.x - (c.left ?? 0))},${-u / 2 + (t.padding ?? 0) - f - (c.y - (c.top ?? 0))})`
  ), st(t, _), t.intersect = function(R) {
    return tt.polygon(t, B, R);
  }, l;
}
p(sg, "waveEdgedRectangle");
async function og(e, t) {
  const { labelStyles: r, nodeStyles: i } = ot(t);
  t.labelStyle = r;
  const s = t.padding ?? 0, o = t.look === "neo" ? 16 : s, a = t.look === "neo" ? 20 : s;
  if (t.width || t.height) {
    t.width = t?.width ?? 0, t.width < 20 && (t.width = 20), t.height = t?.height ?? 0, t.height < 10 && (t.height = 10);
    const T = Math.min(t.height * 0.2, t.height / 4);
    t.height = Math.ceil(t.height - a - T * (20 / 9)), t.width = t.width - o * 2;
  }
  const { shapeSvg: n, bbox: l } = await ct(e, t, dt(t)), c = (t?.width ? t?.width : l.width) + o * 2, h = (t?.height ? t?.height : l.height) + a, d = h / 8, u = h + d * 2, { cssStyles: f } = t, y = rt.svg(n), m = et(t, {});
  t.look !== "handDrawn" && (m.roughness = 0, m.fillStyle = "solid");
  const x = [
    { x: -c / 2, y: u / 2 },
    ...ir(-c / 2, u / 2, c / 2, u / 2, d, 1),
    { x: c / 2, y: -u / 2 },
    ...ir(c / 2, -u / 2, -c / 2, -u / 2, d, -1)
  ], C = Lt(x), b = y.path(C, m), w = n.insert(() => b, ":first-child");
  return w.attr("class", "basic label-container"), f && t.look !== "handDrawn" && w.selectAll("path").attr("style", f), i && t.look !== "handDrawn" && w.selectAll("path").attr("style", i), st(t, w), t.intersect = function(T) {
    return tt.polygon(t, x, T);
  }, n;
}
p(og, "waveRectangle");
var Pt = 10;
async function ag(e, t) {
  const { labelStyles: r, nodeStyles: i } = ot(t);
  t.labelStyle = r;
  const s = t.look === "neo" ? 16 : t.padding ?? 0, o = t.look === "neo" ? 12 : t.padding ?? 0;
  (t.width || t.height) && (t.width = Math.max((t?.width ?? 0) - s * 2 - Pt, 10), t.height = Math.max((t?.height ?? 0) - o * 2 - Pt, 10));
  const { shapeSvg: a, bbox: n, label: l } = await ct(e, t, dt(t)), c = (t?.width ? t?.width : n.width) + s * 2 + Pt, h = (t?.height ? t?.height : n.height) + o * 2 + Pt, d = c - Pt, u = h - Pt, f = -d / 2, y = -u / 2, { cssStyles: m } = t, x = rt.svg(a), C = et(t, {}), b = [
    { x: f - Pt, y: y - Pt },
    { x: f - Pt, y: y + u },
    { x: f + d, y: y + u },
    { x: f + d, y: y - Pt }
  ], w = `M${f - Pt},${y - Pt} L${f + d},${y - Pt} L${f + d},${y + u} L${f - Pt},${y + u} L${f - Pt},${y - Pt}
                M${f - Pt},${y} L${f + d},${y}
                M${f},${y - Pt} L${f},${y + u}`;
  t.look !== "handDrawn" && (C.roughness = 0, C.fillStyle = "solid");
  const T = x.path(w, C), B = a.insert(() => T, ":first-child");
  return B.attr("transform", `translate(${Pt / 2}, ${Pt / 2})`), B.attr("class", "basic label-container outer-path"), m && t.look !== "handDrawn" && B.selectAll("path").attr("style", m), i && t.look !== "handDrawn" && B.selectAll("path").attr("style", i), l.attr(
    "transform",
    `translate(${-(n.width / 2) + Pt / 2 - (n.x - (n.left ?? 0))}, ${-(n.height / 2) + Pt / 2 - (n.y - (n.top ?? 0))})`
  ), st(t, B), t.intersect = function(L) {
    return tt.polygon(t, b, L);
  }, a;
}
p(ag, "windowPane");
var bc = /* @__PURE__ */ new Set(["redux-color", "redux-dark-color"]), eS = /* @__PURE__ */ new Set(["redux", "redux-dark", "redux-color", "redux-dark-color"]);
async function Sl(e, t) {
  const r = t;
  r.alias && (t.label = r.alias);
  const { theme: i, themeVariables: s } = Dt(), { rowEven: o, rowOdd: a, nodeBorder: n, borderColorArray: l } = s;
  if (t.look === "handDrawn") {
    const { themeVariables: ht } = Dt(), { background: kt } = ht, Mt = {
      ...t,
      id: t.id + "-background",
      domId: (t.domId || t.id) + "-background",
      look: "default",
      cssStyles: ["stroke: none", `fill: ${kt}`]
    };
    await Sl(e, Mt);
  }
  const c = Dt();
  t.useHtmlLabels = c.htmlLabels;
  let h = c.er?.diagramPadding ?? 10, d = c.er?.entityPadding ?? 6;
  const { cssStyles: u } = t, { labelStyles: f, nodeStyles: y } = ot(t);
  if (r.attributes.length === 0 && t.label) {
    const ht = {
      rx: 0,
      ry: 0,
      labelPaddingX: h,
      labelPaddingY: h * 1.5
    };
    Ye(t.label, c) + ht.labelPaddingX * 2 < c.er.minEntityWidth && (t.width = c.er.minEntityWidth);
    const kt = await mi(e, t, ht);
    if (i != null && bc.has(i)) {
      const Mt = r.colorIndex ?? 0;
      kt.attr("data-color-id", `color-${Mt % l.length}`);
    }
    if (!Oe(c.htmlLabels)) {
      const Mt = kt.select("text"), Tt = Mt.node()?.getBBox();
      Mt.attr("transform", `translate(${-Tt.width / 2}, 0)`);
    }
    return kt;
  }
  c.htmlLabels || (h *= 1.25, d *= 1.25);
  let m = dt(t);
  m || (m = "node default");
  const x = e.insert("g").attr("class", m).attr("id", t.domId || t.id), C = await qr(x, t.label ?? "", c, 0, 0, ["name"], f);
  C.height += d;
  let b = 0;
  const w = [], T = [];
  let B = 0, L = 0, v = 0, _ = 0, R = !0, N = !0;
  for (const ht of r.attributes) {
    const kt = await qr(
      x,
      ht.type,
      c,
      0,
      b,
      ["attribute-type"],
      f
    );
    B = Math.max(B, kt.width + h);
    const Mt = await qr(
      x,
      ht.name,
      c,
      0,
      b,
      ["attribute-name"],
      f
    );
    L = Math.max(L, Mt.width + h);
    const Tt = await qr(
      x,
      ht.keys.join(),
      c,
      0,
      b,
      ["attribute-keys"],
      f
    );
    v = Math.max(v, Tt.width + h);
    const jt = await qr(
      x,
      ht.comment,
      c,
      0,
      b,
      ["attribute-comment"],
      f
    );
    _ = Math.max(_, jt.width + h);
    const qt = Math.max(kt.height, Mt.height, Tt.height, jt.height) + d;
    T.push({ yOffset: b, rowHeight: qt }), b += qt;
  }
  let q = 4;
  v <= h && (R = !1, v = 0, q--), _ <= h && (N = !1, _ = 0, q--);
  const J = x.node().getBBox();
  if (C.width + h * 2 - (B + L + v + _) > 0) {
    const ht = C.width + h * 2 - (B + L + v + _);
    B += ht / q, L += ht / q, v > 0 && (v += ht / q), _ > 0 && (_ += ht / q);
  }
  const W = B + L + v + _, z = rt.svg(x), V = et(t, {});
  t.look !== "handDrawn" && (V.roughness = 0, V.fillStyle = "solid");
  let $ = 0;
  T.length > 0 && ($ = T.reduce((ht, kt) => ht + (kt?.rowHeight ?? 0), 0));
  const P = Math.max(J.width + h * 2, t?.width || 0, W), Y = Math.max(($ ?? 0) + C.height, t?.height || 0), lt = -P / 2, at = -Y / 2;
  if (x.selectAll("g:not(:first-child)").each((ht, kt, Mt) => {
    const Tt = xt(Mt[kt]), jt = Tt.attr("transform");
    let qt = 0, Pe = 0;
    if (jt) {
      const Se = RegExp(/translate\(([^,]+),([^)]+)\)/).exec(jt);
      Se && (qt = parseFloat(Se[1]), Pe = parseFloat(Se[2]), Tt.attr("class").includes("attribute-name") ? qt += B : Tt.attr("class").includes("attribute-keys") ? qt += B + L : Tt.attr("class").includes("attribute-comment") && (qt += B + L + v));
    }
    Tt.attr(
      "transform",
      `translate(${lt + h / 2 + qt}, ${Pe + at + C.height + d / 2})`
    );
  }), x.select(".name").attr("transform", "translate(" + -C.width / 2 + ", " + (at + d / 2) + ")"), i != null && bc.has(i)) {
    const ht = r.colorIndex ?? 0;
    x.attr("data-color-id", `color-${ht % l.length}`);
  }
  const Ct = z.rectangle(lt, at, P, Y, V), Ft = x.insert(() => Ct, ":first-child").attr("class", "outer-path").attr("style", u.join(""));
  w.push(0);
  for (const [ht, kt] of T.entries()) {
    const Tt = (ht + 1) % 2 === 0 && kt.yOffset !== 0, jt = z.rectangle(lt, C.height + at + kt?.yOffset, P, kt?.rowHeight, {
      ...V,
      fill: Tt ? o : a,
      stroke: n
    });
    x.insert(() => jt, "g.label").attr("style", u.join("")).attr("class", `row-rect-${Tt ? "even" : "odd"}`);
  }
  const mt = 1e-4;
  let St = Nr(lt, C.height + at, P + lt, C.height + at, mt), bt = z.polygon(
    St.map((ht) => [ht.x, ht.y]),
    V
  );
  if (x.insert(() => bt).attr("class", "divider"), St = Nr(B + lt, C.height + at, B + lt, Y + at, mt), bt = z.polygon(
    St.map((ht) => [ht.x, ht.y]),
    V
  ), x.insert(() => bt).attr("class", "divider"), R) {
    const ht = B + L + lt;
    St = Nr(ht, C.height + at, ht, Y + at, mt), bt = z.polygon(
      St.map((kt) => [kt.x, kt.y]),
      V
    ), x.insert(() => bt).attr("class", "divider");
  }
  if (N) {
    const ht = B + L + v + lt;
    St = Nr(ht, C.height + at, ht, Y + at, mt), bt = z.polygon(
      St.map((kt) => [kt.x, kt.y]),
      V
    ), x.insert(() => bt).attr("class", "divider");
  }
  for (const ht of w) {
    const kt = C.height + at + ht;
    St = Nr(lt, kt, P + lt, kt, mt), bt = z.polygon(
      St.map((Mt) => [Mt.x, Mt.y]),
      V
    ), x.insert(() => bt).attr("class", "divider");
  }
  if (st(t, Ft), y && t.look !== "handDrawn")
    if (i != null && eS.has(i))
      x.selectAll("path").attr("style", y);
    else {
      const kt = y.split(";")?.filter((Mt) => Mt.includes("stroke"))?.map((Mt) => `${Mt}`).join("; ");
      x.selectAll("path").attr("style", kt ?? ""), x.selectAll(".row-rect-even path").attr("style", y);
    }
  return t.intersect = function(ht) {
    return tt.rect(t, ht);
  }, x;
}
p(Sl, "erBox");
async function qr(e, t, r, i = 0, s = 0, o = [], a = "") {
  const n = e.insert("g").attr("class", `label ${o.join(" ")}`).attr("transform", `translate(${i}, ${s})`).attr("style", a);
  t !== ah(t) && (t = ah(t), t = t.replaceAll("<", "&lt;").replaceAll(">", "&gt;"));
  const l = n.node().appendChild(
    await we(
      n,
      t,
      {
        width: Ye(t, r) + 100,
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
  if (Oe(r.htmlLabels)) {
    const h = l.children[0];
    h.style.textAlign = "start";
    const d = xt(l);
    c = h.getBoundingClientRect(), d.attr("width", c.width), d.attr("height", c.height);
  }
  return c;
}
p(qr, "addText");
function Nr(e, t, r, i, s) {
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
p(Nr, "lineToPolygon");
async function ng(e, t, r, i, s = r.class.padding ?? 12) {
  const o = i ? 0 : 3, a = e.insert("g").attr("class", dt(t)).attr("id", t.domId || t.id);
  let n = null, l = null, c = null, h = null, d = 0, u = 0, f = 0;
  if (n = a.insert("g").attr("class", "annotation-group text"), t.annotations.length > 0) {
    const b = t.annotations[0];
    await Hi(n, { text: `«${b}»` }, 0), d = n.node().getBBox().height;
  }
  l = a.insert("g").attr("class", "label-group text"), await Hi(l, t, 0, ["font-weight: bolder"]);
  const y = l.node().getBBox();
  u = y.height, c = a.insert("g").attr("class", "members-group text");
  let m = 0;
  for (const b of t.members) {
    const w = await Hi(c, b, m, [b.parseClassifier()]);
    m += w + o;
  }
  f = c.node().getBBox().height, f <= 0 && (f = s / 2), h = a.insert("g").attr("class", "methods-group text");
  let x = 0;
  for (const b of t.methods) {
    const w = await Hi(h, b, x, [b.parseClassifier()]);
    x += w + o;
  }
  let C = a.node().getBBox();
  if (n !== null) {
    const b = n.node().getBBox();
    n.attr("transform", `translate(${-b.width / 2})`);
  }
  return l.attr("transform", `translate(${-y.width / 2}, ${d})`), C = a.node().getBBox(), c.attr(
    "transform",
    `translate(0, ${d + u + s * 2})`
  ), C = a.node().getBBox(), h.attr(
    "transform",
    `translate(0, ${d + u + (f ? f + s * 4 : s * 2)})`
  ), C = a.node().getBBox(), { shapeSvg: a, bbox: C };
}
p(ng, "textHelper");
async function Hi(e, t, r, i = []) {
  const s = e.insert("g").attr("class", "label").attr("style", i.join("; ")), o = Dt();
  let a = "useHtmlLabels" in t ? t.useHtmlLabels : Oe(o.htmlLabels) ?? !0, n = "";
  "text" in t ? n = t.text : n = t.label, !a && n.startsWith("\\") && (n = n.substring(1)), es(n) && (a = !0);
  const l = await we(
    s,
    Rn(er(n)),
    {
      width: Ye(n, o) + 50,
      // Add room for error when splitting text into multiple lines
      classes: "markdown-node-label",
      useHtmlLabels: a
    },
    o
  );
  let c, h = 1;
  if (a) {
    const d = l.children[0], u = xt(l);
    h = d.innerHTML.split("<br>").length, d.innerHTML.includes("</math>") && (h += d.innerHTML.split("<mrow>").length - 1), await Cl(d), c = d.getBoundingClientRect(), u.attr("width", c.width), u.attr("height", c.height);
  } else {
    i.includes("font-weight: bolder") && xt(l).selectAll("tspan").attr("font-weight", ""), h = l.children.length;
    const d = l.children[0];
    (l.textContent === "" || l.textContent.includes("&gt")) && (d.textContent = n[0] + n.substring(1).replaceAll("&gt;", ">").replaceAll("&lt;", "<").trim(), n[1] === " " && (d.textContent = d.textContent[0] + " " + d.textContent.substring(1))), d.textContent === "undefined" && (d.textContent = ""), c = l.getBBox();
  }
  return s.attr("transform", "translate(0," + (-c.height / (2 * h) + r) + ")"), c.height;
}
p(Hi, "addText");
async function lg(e, t) {
  const r = Bt(), { themeVariables: i } = r, { useGradient: s } = i, o = r.class.padding ?? 12, a = o, n = t.useHtmlLabels ?? Oe(r.htmlLabels) ?? !0, l = t;
  l.annotations = l.annotations ?? [], l.members = l.members ?? [], l.methods = l.methods ?? [];
  const { shapeSvg: c, bbox: h } = await ng(e, t, r, n, a), { labelStyles: d, nodeStyles: u } = ot(t);
  t.labelStyle = d, t.cssStyles = l.styles || "";
  const f = l.styles?.join(";") || u || "";
  t.cssStyles || (t.cssStyles = f.replaceAll("!important", "").split(";"));
  const y = l.members.length === 0 && l.methods.length === 0 && !r.class?.hideEmptyMembersBox, m = rt.svg(c), x = et(t, {});
  t.look !== "handDrawn" && (x.roughness = 0, x.fillStyle = "solid");
  const C = Math.max(t.width ?? 0, h.width);
  let b = Math.max(t.height ?? 0, h.height);
  const w = (t.height ?? 0) > h.height;
  l.members.length === 0 && l.methods.length === 0 ? b += a : l.members.length > 0 && l.methods.length === 0 && (b += a * 2);
  const T = -C / 2, B = -b / 2;
  let L = y ? o * 2 : l.members.length === 0 && l.methods.length === 0 ? -o : 0;
  w && (L = o * 2);
  const v = m.rectangle(
    T - o,
    B - o - (y ? o : l.members.length === 0 && l.methods.length === 0 ? -o / 2 : 0),
    C + 2 * o,
    b + 2 * o + L,
    x
  ), _ = c.insert(() => v, ":first-child");
  _.attr("class", "basic label-container outer-path");
  const R = _.node().getBBox(), N = c.select(".annotation-group").node().getBBox().height - (y ? o / 2 : 0) || 0, q = c.select(".label-group").node().getBBox().height - (y ? o / 2 : 0) || 0, J = c.select(".members-group").node().getBBox().height - (y ? o / 2 : 0) || 0, W = (N + q + B + o - (B - o - (y ? o : l.members.length === 0 && l.methods.length === 0 ? -o / 2 : 0))) / 2;
  if (c.selectAll(".text").each((z, V, $) => {
    const P = xt($[V]), Y = P.attr("transform");
    let lt = 0;
    if (Y) {
      const mt = RegExp(/translate\(([^,]+),([^)]+)\)/).exec(Y);
      mt && (lt = parseFloat(mt[2]));
    }
    let at = lt + B + o - (y ? o : l.members.length === 0 && l.methods.length === 0 ? -o / 2 : 0);
    if (P.attr("class").includes("methods-group")) {
      const Ft = Math.max(J, a / 2);
      w ? at = Math.max(
        W,
        N + q + Ft + B + a * 2 + o
      ) + a * 2 : at = N + q + Ft + B + a * 4 + o;
    }
    l.members.length === 0 && l.methods.length === 0 && r.class?.hideEmptyMembersBox && (l.annotations.length > 0 ? at = lt - a : at = lt), n || (at -= 4);
    let Ct = T;
    (P.attr("class").includes("label-group") || P.attr("class").includes("annotation-group")) && (Ct = -P.node()?.getBBox().width / 2 || 0, c.selectAll("text").each(function(Ft, mt, St) {
      window.getComputedStyle(St[mt]).textAnchor === "middle" && (Ct = 0);
    })), P.attr("transform", `translate(${Ct}, ${at})`);
  }), l.members.length > 0 || l.methods.length > 0 || y) {
    const z = N + q + B + o, V = m.line(
      R.x,
      z,
      R.x + R.width,
      z + 1e-3,
      x
    );
    c.insert(() => V).attr("class", `divider${t.look === "neo" && !s ? " neo-line" : ""}`).attr("style", f);
  }
  if (y || l.members.length > 0 || l.methods.length > 0) {
    const z = N + q + J + B + a * 2 + o, V = m.line(
      R.x,
      w ? Math.max(W, z) : z,
      R.x + R.width,
      (w ? Math.max(W, z) : z) + 1e-3,
      x
    );
    c.insert(() => V).attr("class", `divider${t.look === "neo" && !s ? " neo-line" : ""}`).attr("style", f);
  }
  if (l.look !== "handDrawn" && c.selectAll("path").attr("style", f), _.select(":nth-child(2)").attr("style", f), c.selectAll(".divider").select("path").attr("style", f), t.labelStyle ? c.selectAll("span").attr("style", t.labelStyle) : c.selectAll("span").attr("style", f), !n) {
    const z = RegExp(/color\s*:\s*([^;]*)/), V = z.exec(f);
    if (V) {
      const $ = V[0].replace("color", "fill");
      c.selectAll("tspan").attr("style", $);
    } else if (d) {
      const $ = z.exec(d);
      if ($) {
        const P = $[0].replace("color", "fill");
        c.selectAll("tspan").attr("style", P);
      }
    }
  }
  return st(t, _), t.intersect = function(z) {
    return tt.rect(t, z);
  }, c;
}
p(lg, "classBox");
async function hg(e, t) {
  const { labelStyles: r, nodeStyles: i } = ot(t);
  t.labelStyle = r;
  const s = t, o = t, a = 20, n = 20, l = "verifyMethod" in t, c = dt(t), h = Bt(), { themeVariables: d } = h, { borderColorArray: u, requirementEdgeLabelBackground: f } = d, y = h.layout === "elk" ? "start" : "center", m = e.insert("g").attr("class", c).attr("id", t.domId ?? t.id);
  let x;
  l ? x = await _e(
    m,
    `&lt;&lt;${s.type}&gt;&gt;`,
    0,
    t.labelStyle
  ) : x = await _e(m, "&lt;&lt;Element&gt;&gt;", 0, t.labelStyle);
  let C = x;
  const b = await _e(
    m,
    s.name,
    C,
    t.labelStyle + "; font-weight: bold;"
  );
  if (C += b + n, l) {
    const q = await _e(
      m,
      `${s.requirementId ? `ID: ${s.requirementId}` : ""}`,
      C,
      t.labelStyle,
      y
    );
    C += q;
    const J = await _e(
      m,
      `${s.text ? `Text: ${s.text}` : ""}`,
      C,
      t.labelStyle,
      y
    );
    C += J;
    const W = await _e(
      m,
      `${s.risk ? `Risk: ${s.risk}` : ""}`,
      C,
      t.labelStyle,
      y
    );
    C += W, await _e(
      m,
      `${s.verifyMethod ? `Verification: ${s.verifyMethod}` : ""}`,
      C,
      t.labelStyle,
      y
    );
  } else {
    const q = await _e(
      m,
      `${o.type ? `Type: ${o.type}` : ""}`,
      C,
      t.labelStyle,
      y
    );
    C += q, await _e(
      m,
      `${o.docRef ? `Doc Ref: ${o.docRef}` : ""}`,
      C,
      t.labelStyle,
      y
    );
  }
  const w = (m.node()?.getBBox().width ?? 200) + a, T = (m.node()?.getBBox().height ?? 200) + a, B = -w / 2, L = -T / 2, v = rt.svg(m), _ = et(t, {});
  t.look !== "handDrawn" && (_.roughness = 0, _.fillStyle = "solid");
  const R = v.rectangle(B, L, w, T, _), N = m.insert(() => R, ":first-child");
  if (N.attr("class", "basic label-container outer-path").attr("style", i), u?.length) {
    const q = t.colorIndex ?? 0;
    m.attr("data-color-id", `color-${q % u.length}`);
  }
  if (m.selectAll(".label").each((q, J, W) => {
    const z = xt(W[J]), V = z.attr("transform");
    let $ = 0, P = 0;
    if (V) {
      const Ct = RegExp(/translate\(([^,]+),([^)]+)\)/).exec(V);
      Ct && ($ = parseFloat(Ct[1]), P = parseFloat(Ct[2]));
    }
    const Y = P - T / 2;
    let lt = B + a / 2;
    (J === 0 || J === 1) && (lt = $), z.attr("transform", `translate(${lt}, ${Y + a})`);
  }), C > x + b + n) {
    const q = L + x + b + n;
    let J;
    if (t.look === "neo") {
      const V = [
        [B, q],
        [B + w, q],
        [B + w, q + 1e-3],
        [B, q + 1e-3]
      ];
      J = v.polygon(V, _);
    } else
      J = v.line(B, q, B + w, q, _);
    m.insert(() => J).attr("class", "divider");
  }
  return st(t, N), t.intersect = function(q) {
    return tt.rect(t, q);
  }, i && t.look !== "handDrawn" && (f || u?.length) && m.selectAll("path").attr("style", i), m;
}
p(hg, "requirementBox");
async function _e(e, t, r, i = "", s = "center") {
  if (t === "")
    return 0;
  const o = e.insert("g").attr("class", "label").attr("style", i), a = Bt(), n = a.htmlLabels ?? !0, l = await we(
    o,
    Rn(er(t)),
    {
      width: Ye(t, a) + 50,
      // Add room for error when splitting text into multiple lines
      classes: "markdown-node-label",
      useHtmlLabels: n,
      style: i
    },
    a
  );
  let c;
  if (n) {
    const h = l.children[0], d = xt(l);
    s === "start" && xt(h).style("text-align", "left"), c = h.getBoundingClientRect(), d.attr("width", c.width), d.attr("height", c.height);
  } else {
    const h = l.children[0];
    for (const d of h.children)
      i && d.setAttribute("style", i);
    if (s === "start") {
      h.setAttribute("text-anchor", "start");
      for (const d of h.children)
        d.setAttribute("text-anchor", "start");
    }
    c = l.getBBox(), c.height += 6;
  }
  return o.attr("transform", `translate(${-c.width / 2},${-c.height / 2 + r})`), c.height;
}
p(_e, "addText");
var rS = /* @__PURE__ */ p((e) => {
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
async function cg(e, t, { config: r }) {
  const { labelStyles: i, nodeStyles: s } = ot(t);
  t.labelStyle = i || "";
  const o = 10, a = t.width;
  t.width = (t.width ?? 200) - 10;
  const {
    shapeSvg: n,
    bbox: l,
    label: c
  } = await ct(e, t, dt(t)), h = t.padding || 10;
  let d = "", u;
  "ticket" in t && t.ticket && r?.kanban?.ticketBaseUrl && (d = r?.kanban?.ticketBaseUrl.replace("#TICKET#", t.ticket), u = n.insert("svg:a", ":first-child").attr("class", "kanban-ticket-link").attr("xlink:href", d).attr("target", "_blank"));
  const f = {
    useHtmlLabels: t.useHtmlLabels,
    labelStyle: t.labelStyle || "",
    width: t.width,
    img: t.img,
    padding: t.padding || 8,
    centerLabel: !1
  };
  let y, m;
  u ? { label: y, bbox: m } = await oa(
    u,
    "ticket" in t && t.ticket || "",
    f
  ) : { label: y, bbox: m } = await oa(
    n,
    "ticket" in t && t.ticket || "",
    f
  );
  const { label: x, bbox: C } = await oa(
    n,
    "assigned" in t && t.assigned || "",
    f
  );
  t.width = a;
  const b = 10, w = t?.width || 0, T = Math.max(m.height, C.height) / 2, B = Math.max(l.height + b * 2, t?.height || 0) + T, L = -w / 2, v = -B / 2;
  c.attr(
    "transform",
    "translate(" + (h - w / 2) + ", " + (-T - l.height / 2) + ")"
  ), y.attr(
    "transform",
    "translate(" + (h - w / 2) + ", " + (-T + l.height / 2) + ")"
  ), x.attr(
    "transform",
    "translate(" + (h + w / 2 - C.width - 2 * o) + ", " + (-T + l.height / 2) + ")"
  );
  let _;
  const { rx: R, ry: N } = t, { cssStyles: q } = t;
  if (t.look === "handDrawn") {
    const J = rt.svg(n), W = et(t, {}), z = R || N ? J.path(fe(L, v, w, B, R || 0), W) : J.rectangle(L, v, w, B, W);
    _ = n.insert(() => z, ":first-child"), _.attr("class", "basic label-container").attr("style", q || null);
  } else {
    _ = n.insert("rect", ":first-child"), _.attr("class", "basic label-container __APA__").attr("style", s).attr("rx", R ?? 5).attr("ry", N ?? 5).attr("x", L).attr("y", v).attr("width", w).attr("height", B);
    const J = "priority" in t && t.priority;
    if (J) {
      const W = n.append("line"), z = L + 2, V = v + Math.floor((R ?? 0) / 2), $ = v + B - Math.floor((R ?? 0) / 2);
      W.attr("x1", z).attr("y1", V).attr("x2", z).attr("y2", $).attr("stroke-width", "4").attr("stroke", rS(J));
    }
  }
  return st(t, _), t.height = B, t.intersect = function(J) {
    return tt.rect(t, J);
  }, n;
}
p(cg, "kanbanItem");
async function dg(e, t) {
  const { labelStyles: r, nodeStyles: i } = ot(t);
  t.labelStyle = r;
  const { shapeSvg: s, bbox: o, halfPadding: a, label: n } = await ct(
    e,
    t,
    dt(t)
  ), l = o.width + 10 * a, c = o.height + 8 * a, h = 0.15 * l, { cssStyles: d } = t, u = o.width + 20, f = o.height + 20, y = Math.max(l, u), m = Math.max(c, f);
  n.attr("transform", `translate(${-o.width / 2}, ${-o.height / 2})`);
  let x;
  const C = `M0 0 
    a${h},${h} 1 0,0 ${y * 0.25},${-1 * m * 0.1}
    a${h},${h} 1 0,0 ${y * 0.25},0
    a${h},${h} 1 0,0 ${y * 0.25},0
    a${h},${h} 1 0,0 ${y * 0.25},${m * 0.1}

    a${h},${h} 1 0,0 ${y * 0.15},${m * 0.33}
    a${h * 0.8},${h * 0.8} 1 0,0 0,${m * 0.34}
    a${h},${h} 1 0,0 ${-1 * y * 0.15},${m * 0.33}

    a${h},${h} 1 0,0 ${-1 * y * 0.25},${m * 0.15}
    a${h},${h} 1 0,0 ${-1 * y * 0.25},0
    a${h},${h} 1 0,0 ${-1 * y * 0.25},0
    a${h},${h} 1 0,0 ${-1 * y * 0.25},${-1 * m * 0.15}

    a${h},${h} 1 0,0 ${-1 * y * 0.1},${-1 * m * 0.33}
    a${h * 0.8},${h * 0.8} 1 0,0 0,${-1 * m * 0.34}
    a${h},${h} 1 0,0 ${y * 0.1},${-1 * m * 0.33}
  H0 V0 Z`;
  if (t.look === "handDrawn") {
    const b = rt.svg(s), w = et(t, {}), T = b.path(C, w);
    x = s.insert(() => T, ":first-child"), x.attr("class", "basic label-container").attr("style", Wt(d));
  } else
    x = s.insert("path", ":first-child").attr("class", "basic label-container").attr("style", i).attr("d", C);
  return x.attr("transform", `translate(${-y / 2}, ${-m / 2})`), st(t, x), t.calcIntersect = function(b, w) {
    return tt.rect(b, w);
  }, t.intersect = function(b) {
    return M.info("Bang intersect", t, b), tt.rect(t, b);
  }, s;
}
p(dg, "bang");
async function ug(e, t) {
  const { labelStyles: r, nodeStyles: i } = ot(t);
  t.labelStyle = r;
  const { shapeSvg: s, bbox: o, halfPadding: a, label: n } = await ct(
    e,
    t,
    dt(t)
  ), l = o.width + 2 * a, c = o.height + 2 * a, h = 0.15 * l, d = 0.25 * l, u = 0.35 * l, f = 0.2 * l, { cssStyles: y } = t;
  let m;
  const x = `M0 0 
    a${h},${h} 0 0,1 ${l * 0.25},${-1 * l * 0.1}
    a${u},${u} 1 0,1 ${l * 0.4},${-1 * l * 0.1}
    a${d},${d} 1 0,1 ${l * 0.35},${l * 0.2}

    a${h},${h} 1 0,1 ${l * 0.15},${c * 0.35}
    a${f},${f} 1 0,1 ${-1 * l * 0.15},${c * 0.65}

    a${d},${h} 1 0,1 ${-1 * l * 0.25},${l * 0.15}
    a${u},${u} 1 0,1 ${-1 * l * 0.5},0
    a${h},${h} 1 0,1 ${-1 * l * 0.25},${-1 * l * 0.15}

    a${h},${h} 1 0,1 ${-1 * l * 0.1},${-1 * c * 0.35}
    a${f},${f} 1 0,1 ${l * 0.1},${-1 * c * 0.65}
  H0 V0 Z`;
  if (t.look === "handDrawn") {
    const C = rt.svg(s), b = et(t, {}), w = C.path(x, b);
    m = s.insert(() => w, ":first-child"), m.attr("class", "basic label-container").attr("style", Wt(y));
  } else
    m = s.insert("path", ":first-child").attr("class", "basic label-container").attr("style", i).attr("d", x);
  return n.attr("transform", `translate(${-o.width / 2}, ${-o.height / 2})`), m.attr("transform", `translate(${-l / 2}, ${-c / 2})`), st(t, m), t.calcIntersect = function(C, b) {
    return tt.rect(C, b);
  }, t.intersect = function(C) {
    return M.info("Cloud intersect", t, C), tt.rect(t, C);
  }, s;
}
p(ug, "cloud");
async function fg(e, t) {
  const { labelStyles: r, nodeStyles: i } = ot(t);
  t.labelStyle = r;
  const { shapeSvg: s, bbox: o, halfPadding: a, label: n } = await ct(
    e,
    t,
    dt(t)
  ), l = o.width + 8 * a, c = o.height + 2 * a, h = 5, d = t.look === "neo" ? `
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
  const u = s.append("path").attr("id", t.domId).attr("class", "node-bkg node-" + t.type).attr("style", i).attr("d", d);
  return s.append("line").attr("class", "node-line-").attr("x1", -l / 2).attr("y1", c / 2).attr("x2", l / 2).attr("y2", c / 2), n.attr("transform", `translate(${-o.width / 2}, ${-o.height / 2})`), s.append(() => n.node()), st(t, u), t.calcIntersect = function(f, y) {
    return tt.rect(f, y);
  }, t.intersect = function(f) {
    return tt.rect(t, f);
  }, s;
}
p(fg, "defaultMindmapNode");
async function pg(e, t) {
  const r = {
    padding: t.padding ?? 0
  };
  return wl(e, t, r);
}
p(pg, "mindmapCircle");
var iS = [
  {
    semanticName: "Process",
    name: "Rectangle",
    shortName: "rect",
    description: "Standard process shape",
    aliases: ["proc", "process", "rectangle"],
    internalAliases: ["squareRect"],
    handler: Xp
  },
  {
    semanticName: "Event",
    name: "Rounded Rectangle",
    shortName: "rounded",
    description: "Represents an event",
    aliases: ["event"],
    internalAliases: ["roundedRect"],
    handler: zp
  },
  {
    semanticName: "Terminal Point",
    name: "Stadium",
    shortName: "stadium",
    description: "Terminal point",
    aliases: ["terminal", "pill"],
    handler: jp
  },
  {
    semanticName: "Subprocess",
    name: "Framed Rectangle",
    shortName: "fr-rect",
    description: "Subprocess",
    aliases: ["subprocess", "subproc", "framed-rectangle", "subroutine"],
    handler: Kp
  },
  {
    semanticName: "Database",
    name: "Cylinder",
    shortName: "cyl",
    description: "Database storage",
    aliases: ["db", "database", "cylinder"],
    handler: fp
  },
  {
    semanticName: "Data Store",
    name: "Data Store",
    shortName: "datastore",
    description: "Data flow diagram data store",
    aliases: ["data-store"],
    handler: pp
  },
  {
    semanticName: "Folder",
    name: "Folder",
    shortName: "folder",
    description: "Folder or directory",
    aliases: ["directory"],
    handler: Cp
  },
  {
    semanticName: "Bucket",
    name: "Bucket",
    shortName: "bucket",
    description: "Object storage bucket",
    handler: Qf
  },
  {
    semanticName: "Console",
    name: "Console (terminal window)",
    shortName: "console",
    description: "Terminal or console window",
    handler: op
  },
  {
    semanticName: "Browser",
    name: "Browser",
    shortName: "browser",
    description: "Browser window",
    handler: ep
  },
  {
    semanticName: "Person",
    name: "Person",
    shortName: "person",
    description: "Person (circular head above a rounded body)",
    handler: up
  },
  {
    semanticName: "Start",
    name: "Circle",
    shortName: "circle",
    description: "Starting point",
    aliases: ["circ"],
    handler: wl
  },
  {
    semanticName: "Bang",
    name: "Bang",
    shortName: "bang",
    description: "Bang",
    aliases: ["bang"],
    handler: dg
  },
  {
    semanticName: "Cloud",
    name: "Cloud",
    shortName: "cloud",
    description: "cloud",
    aliases: ["cloud"],
    handler: ug
  },
  {
    semanticName: "Decision",
    name: "Diamond",
    shortName: "diam",
    description: "Decision-making step",
    aliases: ["decision", "diamond", "question"],
    handler: qp
  },
  {
    semanticName: "Prepare Conditional",
    name: "Hexagon",
    shortName: "hex",
    description: "Preparation or condition step",
    aliases: ["hexagon", "prepare"],
    handler: wp
  },
  {
    semanticName: "Data Input/Output",
    name: "Lean Right",
    shortName: "lean-r",
    description: "Represents input or output",
    aliases: ["lean-right", "in-out"],
    internalAliases: ["lean_right"],
    handler: Mp
  },
  {
    semanticName: "Data Input/Output",
    name: "Lean Left",
    shortName: "lean-l",
    description: "Represents output or input",
    aliases: ["lean-left", "out-in"],
    internalAliases: ["lean_left"],
    handler: Ep
  },
  {
    semanticName: "Priority Action",
    name: "Trapezoid Base Bottom",
    shortName: "trap-b",
    description: "Priority action",
    aliases: ["priority", "trapezoid-bottom", "trapezoid"],
    handler: eg
  },
  {
    semanticName: "Manual Operation",
    name: "Trapezoid Base Top",
    shortName: "trap-t",
    description: "Represents a manual task",
    aliases: ["manual", "trapezoid-top", "inv-trapezoid"],
    internalAliases: ["inv_trapezoid"],
    handler: Fp
  },
  {
    semanticName: "Stop",
    name: "Double Circle",
    shortName: "dbl-circ",
    description: "Represents a stop point",
    aliases: ["double-circle"],
    internalAliases: ["doublecircle"],
    handler: yp
  },
  {
    semanticName: "Text Block",
    name: "Text Block",
    shortName: "text",
    description: "Text block",
    handler: Jp
  },
  {
    semanticName: "Card",
    name: "Notched Rectangle",
    shortName: "notch-rect",
    description: "Represents a card",
    aliases: ["card", "notched-rectangle"],
    handler: rp
  },
  {
    semanticName: "Lined/Shaded Process",
    name: "Lined Rectangle",
    shortName: "lin-rect",
    description: "Lined process shape",
    aliases: ["lined-rectangle", "lined-process", "lin-proc", "shaded-process"],
    handler: Hp
  },
  {
    semanticName: "Start",
    name: "Small Circle",
    shortName: "sm-circ",
    description: "Small starting point",
    aliases: ["start", "small-circle"],
    internalAliases: ["stateStart"],
    handler: Vp
  },
  {
    semanticName: "Stop",
    name: "Framed Circle",
    shortName: "fr-circ",
    description: "Stop point",
    aliases: ["stop", "framed-circle"],
    internalAliases: ["stateEnd"],
    handler: Gp
  },
  {
    semanticName: "Fork/Join",
    name: "Filled Rectangle",
    shortName: "fork",
    description: "Fork or join in process flow",
    aliases: ["join"],
    internalAliases: ["forkJoin"],
    handler: bp
  },
  {
    semanticName: "Collate",
    name: "Hourglass",
    shortName: "hourglass",
    description: "Represents a collate operation",
    aliases: ["hourglass", "collate"],
    handler: Sp
  },
  {
    semanticName: "Comment",
    name: "Curly Brace",
    shortName: "brace",
    description: "Adds a comment",
    aliases: ["comment", "brace-l"],
    handler: lp
  },
  {
    semanticName: "Comment Right",
    name: "Curly Brace",
    shortName: "brace-r",
    description: "Adds a comment",
    handler: hp
  },
  {
    semanticName: "Comment with braces on both sides",
    name: "Curly Braces",
    shortName: "braces",
    description: "Adds a comment",
    handler: cp
  },
  {
    semanticName: "Com Link",
    name: "Lightning Bolt",
    shortName: "bolt",
    description: "Communication link",
    aliases: ["com-link", "lightning-bolt"],
    handler: $p
  },
  {
    semanticName: "Document",
    name: "Document",
    shortName: "doc",
    description: "Represents a document",
    aliases: ["doc", "document"],
    handler: sg
  },
  {
    semanticName: "Delay",
    name: "Half-Rounded Rectangle",
    shortName: "delay",
    description: "Represents a delay",
    aliases: ["half-rounded-rectangle"],
    handler: kp
  },
  {
    semanticName: "Direct Access Storage",
    name: "Horizontal Cylinder",
    shortName: "h-cyl",
    description: "Direct access storage",
    aliases: ["das", "horizontal-cylinder"],
    handler: tg
  },
  {
    semanticName: "Disk Storage",
    name: "Lined Cylinder",
    shortName: "lin-cyl",
    description: "Disk storage",
    aliases: ["disk", "lined-cylinder"],
    handler: Op
  },
  {
    semanticName: "Display",
    name: "Curved Trapezoid",
    shortName: "curv-trap",
    description: "Represents a display",
    aliases: ["curved-trapezoid", "display"],
    handler: dp
  },
  {
    semanticName: "Divided Process",
    name: "Divided Rectangle",
    shortName: "div-rect",
    description: "Divided process shape",
    aliases: ["div-proc", "divided-rectangle", "divided-process"],
    handler: gp
  },
  {
    semanticName: "Extract",
    name: "Triangle",
    shortName: "tri",
    description: "Extraction process",
    aliases: ["extract", "triangle"],
    handler: ig
  },
  {
    semanticName: "Internal Storage",
    name: "Window Pane",
    shortName: "win-pane",
    description: "Internal storage",
    aliases: ["internal-storage", "window-pane"],
    handler: ag
  },
  {
    semanticName: "Junction",
    name: "Filled Circle",
    shortName: "f-circ",
    description: "Junction point",
    aliases: ["junction", "filled-circle"],
    handler: mp
  },
  {
    semanticName: "Loop Limit",
    name: "Trapezoidal Pentagon",
    shortName: "notch-pent",
    description: "Loop limit step",
    aliases: ["loop-limit", "notched-pentagon"],
    handler: rg
  },
  {
    semanticName: "Manual File",
    name: "Flipped Triangle",
    shortName: "flip-tri",
    description: "Manual file operation",
    aliases: ["manual-file", "flipped-triangle"],
    handler: xp
  },
  {
    semanticName: "Manual Input",
    name: "Sloped Rectangle",
    shortName: "sl-rect",
    description: "Manual input step",
    aliases: ["manual-input", "sloped-rectangle"],
    handler: Yp
  },
  {
    semanticName: "Multi-Document",
    name: "Stacked Document",
    shortName: "docs",
    description: "Multiple documents",
    aliases: ["documents", "st-doc", "stacked-document"],
    handler: Pp
  },
  {
    semanticName: "Multi-Process",
    name: "Stacked Rectangle",
    shortName: "st-rect",
    description: "Multiple processes",
    aliases: ["procs", "processes", "stacked-rectangle"],
    handler: Dp
  },
  {
    semanticName: "Stored Data",
    name: "Bow Tie Rectangle",
    shortName: "bow-rect",
    description: "Stored data",
    aliases: ["stored-data", "bow-tie-rectangle"],
    handler: Zf
  },
  {
    semanticName: "Summary",
    name: "Crossed Circle",
    shortName: "cross-circ",
    description: "Summary",
    aliases: ["summary", "crossed-circle"],
    handler: np
  },
  {
    semanticName: "Tagged Document",
    name: "Tagged Document",
    shortName: "tag-doc",
    description: "Tagged document",
    aliases: ["tag-doc", "tagged-document"],
    handler: Qp
  },
  {
    semanticName: "Tagged Process",
    name: "Tagged Rectangle",
    shortName: "tag-rect",
    description: "Tagged process",
    aliases: ["tagged-rectangle", "tag-proc", "tagged-process"],
    handler: Zp
  },
  {
    semanticName: "Paper Tape",
    name: "Flag",
    shortName: "flag",
    description: "Paper tape",
    aliases: ["paper-tape"],
    handler: og
  },
  {
    semanticName: "Odd",
    name: "Odd",
    shortName: "odd",
    description: "Odd shape",
    internalAliases: ["rect_left_inv_arrow"],
    handler: Np
  },
  {
    semanticName: "Lined Document",
    name: "Lined Document",
    shortName: "lin-doc",
    description: "Lined document",
    aliases: ["lined-document"],
    handler: Ip
  }
], sS = /* @__PURE__ */ p(() => {
  const t = [
    ...Object.entries({
      // States
      state: Up,
      choice: ip,
      note: Rp,
      // Rectangles
      composite: sp,
      rectWithTitle: Wp,
      labelRect: Ap,
      block_arrow: tp,
      // Collapsed subgraph (flowchart `@{ view: collapsed }`)
      collapsedGroup: Jf,
      // Icons
      iconSquare: vp,
      iconCircle: Bp,
      icon: Tp,
      iconRounded: _p,
      imageSquare: Lp,
      anchor: Vf,
      // Kanban diagram
      kanbanItem: cg,
      //Mindmap diagram
      mindmapCircle: pg,
      defaultMindmapNode: fg,
      // class diagram
      classBox: lg,
      // er diagram
      erBox: Sl,
      // Requirement diagram
      requirementBox: hg
    }),
    ...iS.flatMap((r) => [
      r.shortName,
      ..."aliases" in r ? r.aliases : [],
      ..."internalAliases" in r ? r.internalAliases : []
    ].map((s) => [s, r.handler]))
  ];
  return Object.fromEntries(t);
}, "generateShapeMap"), gg = sS();
function oS(e) {
  return e in gg;
}
p(oS, "isValidShape");
var Po = /* @__PURE__ */ p(({
  flowchart: e
}) => {
  const t = e?.subGraphTitleMargin?.top ?? 0, r = e?.subGraphTitleMargin?.bottom ?? 0, i = t + r;
  return {
    subGraphTitleTopMargin: t,
    subGraphTitleBottomMargin: r,
    subGraphTitleTotalMargin: i
  };
}, "getSubGraphTitleMargins"), Ro = /* @__PURE__ */ new Map();
async function Tl(e, t, r) {
  let i, s;
  t.shape === "rect" && (t.rx && t.ry ? t.shape = "roundedRect" : t.shape = "squareRect");
  const o = t.shape ? gg[t.shape] : void 0;
  if (!o)
    throw new Error(`No such shape: ${t.shape}. Please check your syntax.`);
  if (t.link) {
    let a;
    r.config.securityLevel === "sandbox" ? a = "_top" : t.linkTarget && (a = t.linkTarget || "_blank"), i = e.insert("svg:a").attr("xlink:href", t.link).attr("target", a ?? null), s = await o(i, t, r);
  } else
    s = await o(e, t, r), i = s;
  return i.attr("data-look", Wt(t.look)), t.tooltip && s.attr("title", t.tooltip), Ro.set(t.id, i), t.haveCallback && i.attr("class", i.attr("class") + " clickable"), i;
}
p(Tl, "insertNode");
var AF = /* @__PURE__ */ p((e, t) => {
  Ro.set(t.id, e);
}, "setNodeElem"), aS = /* @__PURE__ */ p(() => {
  Ro.clear();
}, "clear"), kc = /* @__PURE__ */ p((e) => {
  const t = Ro.get(e.id);
  M.trace(
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
}, "positionNode"), nS = /* @__PURE__ */ p(async (e, t) => {
  const r = Bt(), { themeVariables: i, handDrawnSeed: s } = r, { clusterBkg: o, clusterBorder: a } = i, n = a, { labelStyles: l, nodeStyles: c, borderStyles: h, backgroundStyles: d } = ot(t), u = e.insert("g").attr("class", "cluster swimlane " + (t.cssClasses || "")).attr("id", t.id).attr("data-id", t.id).attr("data-et", "cluster").attr("data-look", t.look), f = Oe(r.flowchart.htmlLabels), y = t.direction === "LR", m = u.insert("g").attr("class", "cluster-label swimlane-label"), x = await we(m, t.label, {
    style: t.labelStyle,
    useHtmlLabels: f,
    isNode: !0,
    width: t.width
  });
  let C = x.getBBox();
  if (f) {
    const W = x.children[0], z = xt(x);
    C = W.getBoundingClientRect(), z.attr("width", C.width), z.attr("height", C.height);
  }
  const b = t.padding ?? 0, w = t.width <= C.width + b ? C.width + b : t.width;
  t.width <= C.width + b ? t.diff = (w - t.width) / 2 - b : t.diff = -b;
  const T = t.height, B = t.y - T / 2, L = t.y + T / 2, v = t.x - w / 2, _ = t.swimlaneContentTop !== void 0 ? t.swimlaneContentTop : B + T / 3, R = y ? 4 : 0, N = C.height + 2 * R;
  let q, J;
  if (y) {
    const W = Math.max(N, C.height + 2 * R), z = v + W, V = Math.max(0, w - W);
    if (t.look === "handDrawn") {
      const Y = rt.svg(u), lt = et(t, {
        roughness: 0.7,
        fill: o,
        stroke: n,
        fillWeight: 3,
        seed: s
      }), at = et(t, {
        roughness: 0.7,
        fill: "none",
        stroke: n,
        seed: s
      }), Ct = Y.rectangle(v, B, W, T, lt);
      q = u.insert(() => Ct, ":first-child");
      const Ft = Y.rectangle(z, B, V, T, at);
      J = u.insert(() => Ft, ":first-child"), q.select("path:nth-child(2)").attr("style", h.join(";")), q.select("path").attr("style", d.join(";").replace("fill", "stroke"));
    } else
      q = u.insert("rect", ":first-child"), J = u.insert("rect", ":first-child"), q.attr("class", "swimlane-title").attr("style", c).attr("x", v).attr("y", B).attr("width", W).attr("height", T).attr("fill", o).attr("stroke", n), J.attr("class", "swimlane-body").attr("style", c).attr("x", z).attr("y", B).attr("width", V).attr("height", T).attr("fill", "none").attr("stroke", n);
    const $ = v + W / 2, P = t.y;
    m.attr(
      "transform",
      `translate(${$}, ${P}) rotate(-90) translate(${-C.width / 2}, ${-C.height / 2})`
    );
  } else {
    const W = Math.max(0, _ - B), z = Math.min(N, W), V = B + z, $ = Math.max(0, L - V), P = t.x - w / 2;
    if (t.look === "handDrawn") {
      const at = rt.svg(u), Ct = et(t, {
        roughness: 0.7,
        fill: o,
        stroke: n,
        fillWeight: 3,
        seed: s
      }), Ft = et(t, {
        roughness: 0.7,
        fill: "none",
        stroke: n,
        seed: s
      }), mt = at.rectangle(P, B, w, z, Ct);
      q = u.insert(() => mt, ":first-child");
      const St = at.rectangle(P, V, w, $, Ft);
      J = u.insert(() => St, ":first-child"), q.select("path:nth-child(2)").attr("style", h.join(";")), q.select("path").attr("style", d.join(";").replace("fill", "stroke"));
    } else
      q = u.insert("rect", ":first-child"), J = u.insert("rect", ":first-child"), q.attr("class", "swimlane-title").attr("style", c).attr("x", P).attr("y", B).attr("width", w).attr("height", z).attr("fill", o).attr("stroke", n), J.attr("class", "swimlane-body").attr("style", c).attr("x", P).attr("y", V).attr("width", w).attr("height", $).attr("fill", "none").attr("stroke", n);
    const Y = t.x - C.width / 2, lt = B + (z - C.height) / 2;
    m.attr("transform", `translate(${Y}, ${lt})`);
  }
  if (M.trace("Swimlane data ", t, JSON.stringify(t)), l) {
    const W = m.select("span");
    W && W.attr("style", l);
  }
  return t.offsetX = 0, t.width = w, t.height = T, t.offsetY = C.height - b / 2, t.intersect = function(W) {
    return _r(t, W);
  }, { cluster: u, labelBBox: C };
}, "swimlane"), yg = /* @__PURE__ */ p(async (e, t) => {
  M.info("Creating subgraph rect for ", t.id, t);
  const r = Bt(), { themeVariables: i, handDrawnSeed: s } = r, { clusterBkg: o, clusterBorder: a } = i, { labelStyles: n, nodeStyles: l, borderStyles: c, backgroundStyles: h } = ot(t), d = e.insert("g").attr("class", "cluster " + t.cssClasses).attr("id", t.domId).attr("data-look", t.look), u = Zt(r), f = d.insert("g").attr("class", "cluster-label ");
  let y;
  t.labelType === "markdown" ? y = await we(f, t.label, {
    style: t.labelStyle,
    useHtmlLabels: u,
    isNode: !0,
    width: t.width
  }) : y = await Ze(f, t.label, t.labelStyle || "", !1, !0);
  let m = y.getBBox();
  if (Zt(r)) {
    const v = y.children[0], _ = xt(y);
    m = v.getBoundingClientRect(), _.attr("width", m.width), _.attr("height", m.height);
  }
  const x = t.width <= m.width + t.padding ? m.width + t.padding : t.width;
  t.width <= m.width + t.padding ? t.diff = (x - t.width) / 2 - t.padding : t.diff = -t.padding;
  const C = t.height, b = t.x - x / 2, w = t.y - C / 2;
  M.trace("Data ", t, JSON.stringify(t));
  let T;
  if (t.look === "handDrawn") {
    const v = rt.svg(d), _ = et(t, {
      roughness: 0.7,
      fill: o,
      // fill: 'red',
      stroke: a,
      fillWeight: 3,
      seed: s
    }), R = v.path(fe(b, w, x, C, 0), _);
    T = d.insert(() => (M.debug("Rough node insert CXC", R), R), ":first-child"), T.select("path:nth-child(2)").attr("style", c.join(";")), T.select("path").attr("style", h.join(";").replace("fill", "stroke"));
  } else
    T = d.insert("rect", ":first-child"), T.attr("style", l).attr("rx", t.rx).attr("ry", t.ry).attr("x", b).attr("y", w).attr("width", x).attr("height", C);
  const { subGraphTitleTopMargin: B } = Po(r);
  if (f.attr(
    "transform",
    // This puts the label on top of the box instead of inside it
    `translate(${t.x - m.width / 2}, ${t.y - t.height / 2 + B})`
  ), n) {
    const v = f.select("span");
    v && v.attr("style", n);
  }
  const L = T.node().getBBox();
  return t.offsetX = 0, t.width = L.width, t.height = L.height, t.offsetY = m.height - t.padding / 2, t.intersect = function(v) {
    return _r(t, v);
  }, { cluster: d, labelBBox: m };
}, "rect"), lS = /* @__PURE__ */ p((e, t) => {
  const r = e.insert("g").attr("class", "note-cluster").attr("id", t.domId), i = r.insert("rect", ":first-child"), s = 0 * t.padding, o = s / 2;
  i.attr("rx", t.rx).attr("ry", t.ry).attr("x", t.x - t.width / 2 - o).attr("y", t.y - t.height / 2 - o).attr("width", t.width + s).attr("height", t.height + s).attr("fill", "none");
  const a = i.node().getBBox();
  return t.width = a.width, t.height = a.height, t.intersect = function(n) {
    return _r(t, n);
  }, { cluster: r, labelBBox: { width: 0, height: 0 } };
}, "noteGroup"), hS = /* @__PURE__ */ p(async (e, t) => {
  const r = Bt(), { themeVariables: i, handDrawnSeed: s } = r, { altBackground: o, compositeBackground: a, compositeTitleBackground: n, nodeBorder: l } = i, c = e.insert("g").attr("class", t.cssClasses).attr("id", t.domId).attr("data-id", t.id).attr("data-look", t.look), h = c.insert("g", ":first-child"), d = c.insert("g").attr("class", "cluster-label");
  let u = c.append("rect");
  const f = await Ze(d, t.label, t.labelStyle, void 0, !0);
  let y = f.getBBox();
  if (Zt(r)) {
    const R = f.children[0], N = xt(f);
    y = R.getBoundingClientRect(), N.attr("width", y.width), N.attr("height", y.height);
  }
  const m = 0 * t.padding, x = m / 2, C = (t.width <= y.width + t.padding ? y.width + t.padding : t.width) + m;
  t.width <= y.width + t.padding ? t.diff = (C - t.width) / 2 - t.padding : t.diff = -t.padding;
  const b = t.height + m, w = t.height + m - y.height - 6, T = t.x - C / 2, B = t.y - b / 2;
  t.width = C;
  const L = t.y - t.height / 2 - x + y.height + 2;
  let v;
  if (t.look === "handDrawn") {
    const R = t.cssClasses.includes("statediagram-cluster-alt"), N = rt.svg(c), q = t.rx || t.ry ? N.path(fe(T, B, C, b, 10), {
      roughness: 0.7,
      fill: n,
      fillStyle: "solid",
      stroke: l,
      seed: s
    }) : N.rectangle(T, B, C, b, { seed: s });
    v = c.insert(() => q, ":first-child");
    const J = N.rectangle(T, L, C, w, {
      fill: R ? o : a,
      fillStyle: R ? "hachure" : "solid",
      stroke: l,
      seed: s
    });
    v = c.insert(() => q, ":first-child"), u = c.insert(() => J);
  } else
    v = h.insert("rect", ":first-child"), v.attr("class", "outer").attr("x", T).attr("y", B).attr("width", C).attr("height", b).attr("data-look", t.look), u.attr("class", "inner").attr("x", T).attr("y", L).attr("width", C).attr("height", w);
  d.attr(
    "transform",
    `translate(${t.x - y.width / 2}, ${B + 1 - (Zt(r) ? 0 : 3)})`
  );
  const _ = v.node().getBBox();
  return t.height = _.height, t.offsetX = 0, t.offsetY = y.height - t.padding / 2, t.labelBBox = y, t.intersect = function(R) {
    return _r(t, R);
  }, { cluster: c, labelBBox: y };
}, "roundedWithTitle"), cS = /* @__PURE__ */ p(async (e, t) => {
  M.info("Creating subgraph rect for ", t.id, t);
  const r = Bt(), { themeVariables: i, handDrawnSeed: s } = r, { clusterBkg: o, clusterBorder: a } = i, { labelStyles: n, nodeStyles: l, borderStyles: c, backgroundStyles: h } = ot(t), d = e.insert("g").attr("class", "cluster " + t.cssClasses).attr("id", t.domId).attr("data-look", t.look), u = Zt(r), f = d.insert("g").attr("class", "cluster-label "), y = await we(f, t.label, {
    style: t.labelStyle,
    useHtmlLabels: u,
    isNode: !0,
    width: t.width
  });
  let m = y.getBBox();
  if (Zt(r)) {
    const v = y.children[0], _ = xt(y);
    m = v.getBoundingClientRect(), _.attr("width", m.width), _.attr("height", m.height);
  }
  const x = t.width <= m.width + t.padding ? m.width + t.padding : t.width;
  t.width <= m.width + t.padding ? t.diff = (x - t.width) / 2 - t.padding : t.diff = -t.padding;
  const C = t.height, b = t.x - x / 2, w = t.y - C / 2;
  M.trace("Data ", t, JSON.stringify(t));
  let T;
  if (t.look === "handDrawn") {
    const v = rt.svg(d), _ = et(t, {
      roughness: 0.7,
      fill: o,
      // fill: 'red',
      stroke: a,
      fillWeight: 4,
      seed: s
    }), R = v.path(fe(b, w, x, C, t.rx), _);
    T = d.insert(() => (M.debug("Rough node insert CXC", R), R), ":first-child"), T.select("path:nth-child(2)").attr("style", c.join(";")), T.select("path").attr("style", h.join(";").replace("fill", "stroke"));
  } else
    T = d.insert("rect", ":first-child"), T.attr("style", l).attr("rx", t.rx).attr("ry", t.ry).attr("x", b).attr("y", w).attr("width", x).attr("height", C);
  const { subGraphTitleTopMargin: B } = Po(r);
  if (f.attr(
    "transform",
    // This puts the label on top of the box instead of inside it
    `translate(${t.x - m.width / 2}, ${t.y - t.height / 2 + B})`
  ), n) {
    const v = f.select("span");
    v && v.attr("style", n);
  }
  const L = T.node().getBBox();
  return t.offsetX = 0, t.width = L.width, t.height = L.height, t.offsetY = m.height - t.padding / 2, t.intersect = function(v) {
    return _r(t, v);
  }, { cluster: d, labelBBox: m };
}, "kanbanSection"), dS = /* @__PURE__ */ p((e, t) => {
  const r = Bt(), { themeVariables: i, handDrawnSeed: s } = r, { nodeBorder: o } = i, a = e.insert("g").attr("class", t.cssClasses).attr("id", t.domId).attr("data-look", t.look), n = a.insert("g", ":first-child"), l = 0 * t.padding, c = t.width + l;
  t.diff = -t.padding;
  const h = t.height + l, d = t.x - c / 2, u = t.y - h / 2;
  t.width = c;
  let f;
  if (t.look === "handDrawn") {
    const x = rt.svg(a).rectangle(d, u, c, h, {
      fill: "lightgrey",
      roughness: 0.5,
      strokeLineDash: [5],
      stroke: o,
      seed: s
    });
    f = a.insert(() => x, ":first-child");
  } else {
    f = n.insert("rect", ":first-child");
    let m = "outer";
    t.look, m = "divider", f.attr("class", m).attr("x", d).attr("y", u).attr("width", c).attr("height", h).attr("data-look", t.look);
  }
  const y = f.node().getBBox();
  return t.height = y.height, t.offsetX = 0, t.offsetY = 0, t.intersect = function(m) {
    return _r(t, m);
  }, { cluster: a, labelBBox: {} };
}, "divider"), uS = yg, fS = {
  rect: yg,
  squareRect: uS,
  roundedWithTitle: hS,
  noteGroup: lS,
  divider: dS,
  kanbanSection: cS,
  swimlane: nS
}, mg = /* @__PURE__ */ new Map(), xg = /* @__PURE__ */ p(async (e, t) => {
  const r = t.shape || "rect", i = await fS[r](e, t);
  return mg.set(t.id, i), i;
}, "insertCluster"), pS = /* @__PURE__ */ p(() => {
  mg = /* @__PURE__ */ new Map();
}, "clear"), Ii = /* @__PURE__ */ p((e, t) => {
  if (t)
    return "translate(" + -e.width / 2 + ", " + -e.height / 2 + ")";
  const r = e.x ?? 0, i = e.y ?? 0;
  return "translate(" + -(r + e.width / 2) + ", " + -(i + e.height / 2) + ")";
}, "computeLabelTransform"), Vt = {
  aggregation: 17.25,
  extension: 17.25,
  composition: 17.25,
  dependency: 6,
  lollipop: 13.5,
  arrow_point: 4,
  arrow_barb: 0,
  arrow_barb_neo: 5.5
  //arrow_cross: 24,
}, wc = {
  arrow_point: 4,
  arrow_cross: 12.5,
  arrow_circle: 12.5
};
function Yi(e, t) {
  if (e === void 0 || t === void 0)
    return { angle: 0, deltaX: 0, deltaY: 0 };
  e = It(e), t = It(t);
  const [r, i] = [e.x, e.y], [s, o] = [t.x, t.y], a = s - r, n = o - i;
  return { angle: Math.atan(n / a), deltaX: a, deltaY: n };
}
p(Yi, "calculateDeltaAndAngle");
var It = /* @__PURE__ */ p((e) => Array.isArray(e) ? { x: e[0], y: e[1] } : e, "pointTransformer"), gS = /* @__PURE__ */ p((e) => ({
  x: /* @__PURE__ */ p(function(t, r, i) {
    let s = 0;
    const o = It(i[0]).x < It(i[i.length - 1]).x ? "left" : "right";
    if (r === 0 && Object.hasOwn(Vt, e.arrowTypeStart)) {
      const { angle: f, deltaX: y } = Yi(i[0], i[1]);
      s = Vt[e.arrowTypeStart] * Math.cos(f) * (y >= 0 ? 1 : -1);
    } else if (r === i.length - 1 && Object.hasOwn(Vt, e.arrowTypeEnd)) {
      const { angle: f, deltaX: y } = Yi(
        i[i.length - 1],
        i[i.length - 2]
      );
      s = Vt[e.arrowTypeEnd] * Math.cos(f) * (y >= 0 ? 1 : -1);
    }
    const a = Math.abs(
      It(t).x - It(i[i.length - 1]).x
    ), n = Math.abs(
      It(t).y - It(i[i.length - 1]).y
    ), l = Math.abs(It(t).x - It(i[0]).x), c = Math.abs(It(t).y - It(i[0]).y), h = Vt[e.arrowTypeStart], d = Vt[e.arrowTypeEnd], u = 1;
    if (a < d && a > 0 && n < d) {
      let f = d + u - a;
      f *= o === "right" ? -1 : 1, s -= f;
    }
    if (l < h && l > 0 && c < h) {
      let f = h + u - l;
      f *= o === "right" ? -1 : 1, s += f;
    }
    return It(t).x + s;
  }, "x"),
  y: /* @__PURE__ */ p(function(t, r, i) {
    let s = 0;
    const o = It(i[0]).y < It(i[i.length - 1]).y ? "down" : "up";
    if (r === 0 && Object.hasOwn(Vt, e.arrowTypeStart)) {
      const { angle: f, deltaY: y } = Yi(i[0], i[1]);
      s = Vt[e.arrowTypeStart] * Math.abs(Math.sin(f)) * (y >= 0 ? 1 : -1);
    } else if (r === i.length - 1 && Object.hasOwn(Vt, e.arrowTypeEnd)) {
      const { angle: f, deltaY: y } = Yi(
        i[i.length - 1],
        i[i.length - 2]
      );
      s = Vt[e.arrowTypeEnd] * Math.abs(Math.sin(f)) * (y >= 0 ? 1 : -1);
    }
    const a = Math.abs(
      It(t).y - It(i[i.length - 1]).y
    ), n = Math.abs(
      It(t).x - It(i[i.length - 1]).x
    ), l = Math.abs(It(t).y - It(i[0]).y), c = Math.abs(It(t).x - It(i[0]).x), h = Vt[e.arrowTypeStart], d = Vt[e.arrowTypeEnd], u = 1;
    if (a < d && a > 0 && n < d) {
      let f = d + u - a;
      f *= o === "up" ? -1 : 1, s -= f;
    }
    if (l < h && l > 0 && c < h) {
      let f = h + u - l;
      f *= o === "up" ? -1 : 1, s += f;
    }
    return It(t).y + s;
  }, "y")
}), "getLineFunctionsWithOffset"), yS = /* @__PURE__ */ p((e, t, r, i, s, o = !1, a) => {
  t.arrowTypeStart && Sc(
    e,
    "start",
    t.arrowTypeStart,
    r,
    i,
    s,
    o,
    a
  ), t.arrowTypeEnd && Sc(e, "end", t.arrowTypeEnd, r, i, s, o, a);
}, "addEdgeMarkers"), mS = {
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
}, xS = [
  "cross",
  "point",
  "circle",
  "lollipop",
  "aggregation",
  "extension",
  "composition",
  "dependency",
  "barb"
], Sc = /* @__PURE__ */ p((e, t, r, i, s, o, a = !1, n) => {
  if (!r || r === "none")
    return;
  const l = mS[r], c = l && xS.includes(l.type);
  if (!l) {
    M.warn(`Unknown arrow type: ${r}`);
    return;
  }
  const h = l.type, f = `${s}_${o}-${h}${t === "start" ? "Start" : "End"}${a && c ? "-margin" : ""}`;
  if (n && n.trim() !== "") {
    const y = n.replace(/[^\dA-Za-z]/g, "_"), m = `${f}_${y}`;
    if (!document.getElementById(m)) {
      const x = document.getElementById(f);
      if (x) {
        const C = x.cloneNode(!0);
        C.id = m, C.querySelectorAll("path, circle, line").forEach((w) => {
          w.setAttribute("stroke", n), l.fill && w.setAttribute("fill", n);
        }), x.parentNode?.appendChild(C);
      }
    }
    e.attr(`marker-${t}`, `url(${i}#${m})`);
  } else
    e.attr(`marker-${t}`, `url(${i}#${f})`);
}, "addEdgeMarker"), CS = /* @__PURE__ */ p((e) => typeof e == "string" ? e : Bt()?.flowchart?.curve, "resolveEdgeCurveType"), ui = /* @__PURE__ */ new Map(), Rt = /* @__PURE__ */ new Map(), bS = /* @__PURE__ */ p(() => {
  ui.clear(), Rt.clear();
}, "clear"), Cg = /* @__PURE__ */ p((e) => !!(e.label || e.startLabelLeft || e.startLabelRight || e.endLabelLeft || e.endLabelRight), "hasEdgeLabel"), Di = /* @__PURE__ */ p((e) => e ? typeof e == "string" ? e : e.reduce((t, r) => t + ";" + r, "") : "", "getLabelStyles"), Bl = /* @__PURE__ */ p(async (e, t) => {
  const r = Bt();
  let i = Zt(r);
  const { labelStyles: s } = ot(t);
  t.labelStyle = s;
  const o = e.insert("g").attr("class", "edgeLabel"), a = o.insert("g").attr("class", "label").attr("data-id", t.id), n = t.labelType === "markdown", c = await we(
    e,
    t.label,
    {
      style: Di(t.labelStyle),
      useHtmlLabels: i,
      addSvgBackground: !0,
      isNode: !1,
      markdown: n,
      // Plain text edge labels should auto-wrap, markdown edge labels respect markdownAutoWrap config
      width: n ? void 0 : void 0
    },
    r
  );
  a.node().appendChild(c), M.info("abc82", t, t.labelType);
  let h, d;
  if (i) {
    const f = c.children[0], y = xt(c);
    h = await wr.measure(() => f.getBoundingClientRect()), d = h, y.attr("width", h.width), y.attr("height", h.height);
  } else {
    const f = xt(c).select("text").node();
    await wr.measure(() => {
      h = c.getBBox(), f && typeof f.getBBox == "function" ? d = f.getBBox() : d = h;
    });
  }
  a.attr("transform", Ii(d, i)), ui.set(t.id, o), t.width = h.width, t.height = h.height;
  let u;
  if (t.startLabelLeft) {
    const f = e.insert("g").attr("class", "edgeTerminals"), y = f.insert("g").attr("class", "inner"), m = await Ze(
      y,
      t.startLabelLeft,
      Di(t.labelStyle) || "",
      !1,
      !1
    );
    u = m;
    let x = m.getBBox();
    if (i) {
      const C = m.children[0], b = xt(m);
      x = C.getBoundingClientRect(), b.attr("width", x.width), b.attr("height", x.height);
    }
    y.attr("transform", Ii(x, i)), Rt.get(t.id) || Rt.set(t.id, {}), Rt.get(t.id).startLeft = f, Xi(u, t.startLabelLeft);
  }
  if (t.startLabelRight) {
    const f = e.insert("g").attr("class", "edgeTerminals"), y = f.insert("g").attr("class", "inner"), m = await Ze(
      y,
      t.startLabelRight,
      Di(t.labelStyle) || "",
      !1,
      !1
    );
    u = m;
    let x = m.getBBox();
    if (i) {
      const C = m.children[0], b = xt(m);
      x = C.getBoundingClientRect(), b.attr("width", x.width), b.attr("height", x.height);
    }
    y.attr("transform", Ii(x, i)), Rt.get(t.id) || Rt.set(t.id, {}), Rt.get(t.id).startRight = f, Xi(u, t.startLabelRight);
  }
  if (t.endLabelLeft) {
    const f = e.insert("g").attr("class", "edgeTerminals"), y = f.insert("g").attr("class", "inner"), m = await Ze(
      f,
      t.endLabelLeft,
      Di(t.labelStyle) || "",
      !1,
      !1
    );
    u = m;
    let x = m.getBBox();
    if (i) {
      const C = m.children[0], b = xt(m);
      x = C.getBoundingClientRect(), b.attr("width", x.width), b.attr("height", x.height);
    }
    y.attr("transform", Ii(x, i)), Rt.get(t.id) || Rt.set(t.id, {}), Rt.get(t.id).endLeft = f, Xi(u, t.endLabelLeft);
  }
  if (t.endLabelRight) {
    const f = e.insert("g").attr("class", "edgeTerminals"), y = f.insert("g").attr("class", "inner"), m = await Ze(
      f,
      t.endLabelRight,
      Di(t.labelStyle) || "",
      !1,
      !1
    );
    u = m;
    let x = m.getBBox();
    if (i) {
      const C = m.children[0], b = xt(m);
      x = C.getBoundingClientRect(), b.attr("width", x.width), b.attr("height", x.height);
    }
    y.attr("transform", Ii(x, i)), Rt.get(t.id) || Rt.set(t.id, {}), Rt.get(t.id).endRight = f, Xi(u, t.endLabelRight);
  }
  return c;
}, "insertEdgeLabel");
function Xi(e, t) {
  Zt(Bt()) && e && (e.style.width = t.length * 9 + "px", e.style.height = "12px");
}
p(Xi, "setTerminalWidth");
var kS = /* @__PURE__ */ p((e, t) => {
  M.debug("Moving label abc88 ", e.id, e.label, ui.get(e.id), t);
  let r = t.updatedPath ? t.updatedPath : t.originalPath;
  const i = Bt(), { subGraphTitleTotalMargin: s } = Po(i);
  if (e.label) {
    const o = ui.get(e.id);
    let a = e.x, n = e.y;
    if (r) {
      const l = Kt.calcLabelPosition(r);
      M.debug(
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
    const o = Rt.get(e.id).startLeft;
    let a = e.x, n = e.y;
    if (r) {
      const l = Kt.calcTerminalLabelPosition(e.arrowTypeStart ? 10 : 0, "start_left", r);
      a = l.x, n = l.y;
    }
    o.attr("transform", `translate(${a}, ${n})`);
  }
  if (e.startLabelRight) {
    const o = Rt.get(e.id).startRight;
    let a = e.x, n = e.y;
    if (r) {
      const l = Kt.calcTerminalLabelPosition(
        e.arrowTypeStart ? 10 : 0,
        "start_right",
        r
      );
      a = l.x, n = l.y;
    }
    o.attr("transform", `translate(${a}, ${n})`);
  }
  if (e.endLabelLeft) {
    const o = Rt.get(e.id).endLeft;
    let a = e.x, n = e.y;
    if (r) {
      const l = Kt.calcTerminalLabelPosition(e.arrowTypeEnd ? 10 : 0, "end_left", r);
      a = l.x, n = l.y;
    }
    o.attr("transform", `translate(${a}, ${n})`);
  }
  if (e.endLabelRight) {
    const o = Rt.get(e.id).endRight;
    let a = e.x, n = e.y;
    if (r) {
      const l = Kt.calcTerminalLabelPosition(e.arrowTypeEnd ? 10 : 0, "end_right", r);
      a = l.x, n = l.y;
    }
    o.attr("transform", `translate(${a}, ${n})`);
  }
}, "positionEdgeLabel"), wS = /* @__PURE__ */ p((e, t) => {
  if (!e?.isLabelEdge || !e?.id?.endsWith("-to-label") || !Array.isArray(t) || t.length !== 2)
    return t;
  const [r, i] = t, s = Math.abs(i.x - r.x), o = Math.abs(i.y - r.y);
  return s < 1e-3 || o < 1e-3 ? t : o >= s ? [r, { x: r.x, y: i.y }, i] : [r, { x: i.x, y: r.y }, i];
}, "orthogonalizeToLabelClippedPoints"), SS = /* @__PURE__ */ p((e, t) => {
  const r = e.x, i = e.y, s = Math.abs(t.x - r), o = Math.abs(t.y - i), a = e.width / 2, n = e.height / 2;
  return s >= a || o >= n;
}, "outsideNode"), TS = /* @__PURE__ */ p((e, t, r) => {
  M.debug(`intersection calc abc89:
  outsidePoint: ${JSON.stringify(t)}
  insidePoint : ${JSON.stringify(r)}
  node        : x:${e.x} y:${e.y} w:${e.width} h:${e.height}`);
  const i = e.x, s = e.y, o = Math.abs(i - r.x), a = e.width / 2;
  let n = r.x < t.x ? a - o : a + o;
  const l = e.height / 2, c = Math.abs(t.y - r.y), h = Math.abs(t.x - r.x);
  if (Math.abs(s - t.y) * a > Math.abs(i - t.x) * l) {
    let d = r.y < t.y ? t.y - l - s : s - l - t.y;
    n = h * d / c;
    const u = {
      x: r.x < t.x ? r.x + n : r.x - h + n,
      y: r.y < t.y ? r.y + c - d : r.y - c + d
    };
    return n === 0 && (u.x = t.x, u.y = t.y), h === 0 && (u.x = t.x), c === 0 && (u.y = t.y), M.debug(`abc89 top/bottom calc, Q ${c}, q ${d}, R ${h}, r ${n}`, u), u;
  } else {
    r.x < t.x ? n = t.x - a - i : n = i - a - t.x;
    let d = c * n / h, u = r.x < t.x ? r.x + h - n : r.x - h + n, f = r.y < t.y ? r.y + d : r.y - d;
    return M.debug(`sides calc abc89, Q ${c}, q ${d}, R ${h}, r ${n}`, { _x: u, _y: f }), n === 0 && (u = t.x, f = t.y), h === 0 && (u = t.x), c === 0 && (f = t.y), { x: u, y: f };
  }
}, "intersection"), Tc = /* @__PURE__ */ p((e, t) => {
  M.warn("abc88 cutPathAtIntersect", e, t);
  let r = [], i = e[0], s = !1;
  return e.forEach((o) => {
    if (M.info("abc88 checking point", o, t), !SS(t, o) && !s) {
      const a = TS(t, i, o);
      M.debug("abc88 inside", o, i, a), M.debug("abc88 intersection", a, t);
      let n = !1;
      r.forEach((l) => {
        n = n || l.x === a.x && l.y === a.y;
      }), r.some((l) => l.x === a.x && l.y === a.y) ? M.warn("abc88 no intersect", a, r) : r.push(a), s = !0;
    } else
      M.warn("abc88 outside", o, i), i = o, s || r.push(o);
  }), M.debug("returning points", r), r;
}, "cutPathAtIntersect");
function bg(e) {
  const t = [], r = [];
  for (let i = 1; i < e.length - 1; i++) {
    const s = e[i - 1], o = e[i], a = e[i + 1];
    (s.x === o.x && o.y === a.y && Math.abs(o.x - a.x) > 5 && Math.abs(o.y - s.y) > 5 || s.y === o.y && o.x === a.x && Math.abs(o.x - s.x) > 5 && Math.abs(o.y - a.y) > 5) && (t.push(o), r.push(i));
  }
  return { cornerPoints: t, cornerPointPositions: r };
}
p(bg, "extractCornerPoints");
var Bc = /* @__PURE__ */ p(function(e, t, r) {
  const i = t.x - e.x, s = t.y - e.y, o = Math.sqrt(i * i + s * s), a = r / o;
  return { x: t.x - a * i, y: t.y - a * s };
}, "findAdjacentPoint"), BS = /* @__PURE__ */ p(function(e) {
  const { cornerPointPositions: t } = bg(e), r = [];
  for (let i = 0; i < e.length; i++)
    if (t.includes(i)) {
      const s = e[i - 1], o = e[i + 1], a = e[i], n = Bc(s, a, 5), l = Bc(o, a, 5), c = l.x - n.x, h = l.y - n.y;
      r.push(n);
      const d = Math.sqrt(2) * 2;
      let u = { x: a.x, y: a.y };
      if (Math.abs(o.x - s.x) > 10 && Math.abs(o.y - s.y) >= 10) {
        M.debug(
          "Corner point fixing",
          Math.abs(o.x - s.x),
          Math.abs(o.y - s.y)
        );
        const f = 5;
        a.x === n.x ? u = {
          x: c < 0 ? n.x - f + d : n.x + f - d,
          y: h < 0 ? n.y - d : n.y + d
        } : u = {
          x: c < 0 ? n.x - d : n.x + d,
          y: h < 0 ? n.y - f + d : n.y + f - d
        };
      } else
        M.debug(
          "Corner point skipping fixing",
          Math.abs(o.x - s.x),
          Math.abs(o.y - s.y)
        );
      r.push(u, l);
    } else
      r.push(e[i]);
  return r;
}, "fixCorners"), _S = /* @__PURE__ */ p((e, t, r) => {
  const i = e - t - r, s = 2, o = 2, a = s + o, n = Math.floor(i / a), l = Number.isFinite(n) ? Math.max(0, n) : 0, c = Array(l).fill(`${s} ${o}`).join(" ");
  return `0 ${t} ${c} ${r}`;
}, "generateDashArray"), kg = /* @__PURE__ */ p(function(e, t, r, i, s, o, a, n = !1) {
  if (!a)
    throw new Error(
      `insertEdge: missing diagramId for edge "${t.id}" — edge IDs require a diagram prefix for uniqueness`
    );
  const { handDrawnSeed: l, layout: c } = Bt();
  let h = t.points, d = !1;
  const u = s;
  var f = o;
  const y = [];
  for (const Y in t.cssCompiledStyles)
    Uu(Y) || y.push(t.cssCompiledStyles[Y]);
  if (c === "swimlane") {
    if (f.intersect && u.intersect && Array.isArray(h) && h.length >= 2)
      if (h.length === 2)
        h = [u.intersect(h[0]), f.intersect(h[1])];
      else {
        const Y = h.slice(1, -1), lt = Y[0], at = Y[Y.length - 1], Ct = 0.5, Ft = Math.abs(h[h.length - 1].x - at.x) < Ct && Math.abs(h[h.length - 1].y - at.y) < Ct, mt = u.intersect(lt), St = Ft ? at : f.intersect(at), bt = Math.abs(St.x - at.x) < Ct && Math.abs(St.y - at.y) < Ct, kt = Math.abs(mt.x - lt.x) < Ct && Math.abs(mt.y - lt.y) < Ct ? [] : [mt], Mt = bt ? [] : [St];
        h = [...kt, ...Y, ...Mt];
      }
    h = wS(t, h);
  } else f.intersect && u.intersect && !n && (h = h.slice(1, t.points.length - 1), h.unshift(u.intersect(h[0])), h.push(f.intersect(h[h.length - 1])));
  const m = btoa(JSON.stringify(h));
  t.toCluster && (M.info("to cluster abc88", r.get(t.toCluster)), h = Tc(t.points, r.get(t.toCluster).node), d = !0), t.fromCluster && (M.debug(
    "from cluster abc88",
    r.get(t.fromCluster),
    JSON.stringify(h, null, 2)
  ), h = Tc(h.reverse(), r.get(t.fromCluster).node).reverse(), d = !0);
  let x = h.filter((Y) => !Number.isNaN(Y.y));
  const C = CS(t.curve);
  C !== "rounded" && (x = BS(x));
  let b = Zi;
  switch (C) {
    case "linear":
      b = Zi;
      break;
    case "basis":
      b = tn;
      break;
    case "cardinal":
      b = Mu;
      break;
    case "bumpX":
      b = vu;
      break;
    case "bumpY":
      b = Lu;
      break;
    case "catmullRom":
      b = Ou;
      break;
    case "monotoneX":
      b = Nu;
      break;
    case "monotoneY":
      b = Wu;
      break;
    case "natural":
      b = Hu;
      break;
    case "step":
      b = Yu;
      break;
    case "stepAfter":
      b = ju;
      break;
    case "stepBefore":
      b = Xu;
      break;
    case "rounded":
      b = Zi;
      break;
    default:
      b = tn;
  }
  const { x: w, y: T } = gS(t), B = Wk().x(w).y(T).curve(b);
  let L;
  switch (t.thickness) {
    case "normal":
      L = "edge-thickness-normal";
      break;
    case "thick":
      L = "edge-thickness-thick";
      break;
    case "invisible":
      L = "edge-thickness-invisible";
      break;
    default:
      L = "edge-thickness-normal";
  }
  switch (t.pattern) {
    case "solid":
      L += " edge-pattern-solid";
      break;
    case "dotted":
      L += " edge-pattern-dotted";
      break;
    case "dashed":
      L += " edge-pattern-dashed";
      break;
    default:
      L += " edge-pattern-solid";
  }
  let v, _ = C === "rounded" ? wg(Sg(x, t), 5) : B(x);
  const R = Array.isArray(t.style) ? t.style : [t.style];
  let N = R.find((Y) => Y?.startsWith("stroke:")), q = "";
  t.animate && (q = "edge-animation-fast"), t.animation && (q = "edge-animation-" + t.animation);
  let J = !1;
  if (t.look === "handDrawn") {
    const Y = rt.svg(e);
    Object.assign([], x);
    const lt = Y.path(_, {
      roughness: 0.3,
      seed: l
    });
    L += " transition", v = xt(lt).select("path").attr("id", `${a}-${t.id}`).attr(
      "class",
      " " + L + (t.classes ? " " + t.classes : "") + (q ? " " + q : "")
    ).attr("style", R ? R.reduce((Ct, Ft) => Ct + ";" + Ft, "") : "");
    let at = v.attr("d");
    v.attr("d", at), e.node().appendChild(v.node());
  } else {
    const Y = y.join(";"), lt = R ? R.reduce((bt, ht) => bt + ht + ";", "") : "", at = (Y ? Y + ";" + lt + ";" : lt) + ";" + (R ? R.reduce((bt, ht) => bt + ";" + ht, "") : "");
    v = e.append("path").attr("d", _).attr("id", `${a}-${t.id}`).attr(
      "class",
      " " + L + (t.classes ? " " + t.classes : "") + (q ? " " + q : "")
    ).attr("style", at), N = at.match(/stroke:([^;]+)/)?.[1], J = t.animate === !0 || !!t.animation || Y.includes("animation");
    const Ct = v.node(), Ft = typeof Ct.getTotalLength == "function" ? Ct.getTotalLength() : 0, mt = wc[t.arrowTypeStart] || 0, St = wc[t.arrowTypeEnd] || 0;
    if (t.look === "neo" && !J) {
      const ht = `stroke-dasharray: ${t.pattern === "dotted" || t.pattern === "dashed" ? _S(Ft, mt, St) : `0 ${mt} ${Ft - mt - St} ${St}`}; stroke-dashoffset: 0;`;
      v.attr("style", ht + v.attr("style"));
    }
  }
  v.attr("data-edge", !0), v.attr("data-et", "edge"), v.attr("data-id", t.id), v.attr("data-points", m), v.attr("data-look", Wt(t.look)), t.showPoints && x.forEach((Y) => {
    e.append("circle").style("stroke", "red").style("fill", "red").attr("r", 1).attr("cx", Y.x).attr("cy", Y.y);
  });
  let W = "";
  (Bt().flowchart.arrowMarkerAbsolute || Bt().state.arrowMarkerAbsolute) && (W = window.location.protocol + "//" + window.location.host + window.location.pathname + window.location.search, W = W.replace(/\(/g, "\\(").replace(/\)/g, "\\)")), M.info("arrowTypeStart", t.arrowTypeStart), M.info("arrowTypeEnd", t.arrowTypeEnd);
  const z = !J && t?.look === "neo";
  yS(v, t, W, a, i, z, N);
  const V = Math.floor(h.length / 2), $ = h[V];
  Kt.isLabelCoordinateInPath($, v.attr("d")) || (d = !0);
  let P = {};
  return d && (P.updatedPath = h), P.originalPath = t.points, P;
}, "insertEdge");
function wg(e, t) {
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
      const c = a.x - n.x, h = a.y - n.y, d = l.x - a.x, u = l.y - a.y, f = Math.hypot(c, h), y = Math.hypot(d, u);
      if (f < s || y < s) {
        r += `L${a.x},${a.y}`;
        continue;
      }
      const m = c / f, x = h / f, C = d / y, b = u / y, w = m * C + x * b, T = Math.max(-1, Math.min(1, w)), B = Math.acos(T);
      if (B < s || Math.abs(Math.PI - B) < s) {
        r += `L${a.x},${a.y}`;
        continue;
      }
      const L = Math.min(t / Math.sin(B / 2), f / 2, y / 2), v = a.x - m * L, _ = a.y - x * L, R = a.x + C * L, N = a.y + b * L;
      r += `L${v},${_}`, r += `Q${a.x},${a.y} ${R},${N}`;
    }
  }
  return r;
}
p(wg, "generateRoundedPath");
function mn(e, t) {
  if (!e || !t)
    return { angle: 0, deltaX: 0, deltaY: 0 };
  const r = t.x - e.x, i = t.y - e.y;
  return { angle: Math.atan2(i, r), deltaX: r, deltaY: i };
}
p(mn, "calculateDeltaAndAngle");
function Sg(e, t) {
  const r = e.map((s) => ({ ...s }));
  if (e.length >= 2 && Vt[t.arrowTypeStart]) {
    const s = Vt[t.arrowTypeStart], o = e[0], a = e[1], { angle: n } = mn(o, a), l = s * Math.cos(n), c = s * Math.sin(n);
    r[0].x = o.x + l, r[0].y = o.y + c;
  }
  const i = e.length;
  if (i >= 2 && Vt[t.arrowTypeEnd]) {
    const s = Vt[t.arrowTypeEnd], o = e[i - 1], a = e[i - 2], { angle: n } = mn(a, o), l = s * Math.cos(n), c = s * Math.sin(n);
    r[i - 1].x = o.x - l, r[i - 1].y = o.y - c;
  }
  return r;
}
p(Sg, "applyMarkerOffsetsToPoints");
var vS = /* @__PURE__ */ p((e, t, r, i) => {
  t.forEach((s) => {
    KS[s](e, r, i);
  });
}, "insertMarkers"), LS = /* @__PURE__ */ p((e, t, r) => {
  M.trace("Making markers for ", r), e.append("defs").append("marker").attr("id", r + "_" + t + "-extensionStart").attr("class", "marker extension " + t).attr("refX", 18).attr("refY", 7).attr("markerWidth", 20).attr("markerHeight", 28).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("path").attr("d", "M 1,7 L18,13 V 1 Z"), e.append("defs").append("marker").attr("id", r + "_" + t + "-extensionEnd").attr("class", "marker extension " + t).attr("refX", 1).attr("refY", 7).attr("markerWidth", 20).attr("markerHeight", 28).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("path").attr("d", "M 1,1 V 13 L18,7 Z"), e.append("marker").attr("id", r + "_" + t + "-extensionStart-margin").attr("class", "marker extension " + t).attr("refX", 18).attr("refY", 7).attr("markerWidth", 20).attr("markerHeight", 28).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").attr("viewBox", "0 0 20 14").append("polygon").attr("points", "10,7 18,13 18,1").style("stroke-width", 2).style("stroke-dasharray", "0"), e.append("defs").append("marker").attr("id", r + "_" + t + "-extensionEnd-margin").attr("class", "marker extension " + t).attr("refX", 9).attr("refY", 7).attr("markerWidth", 20).attr("markerHeight", 28).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").attr("viewBox", "0 0 20 14").append("polygon").attr("points", "10,1 10,13 18,7").style("stroke-width", 2).style("stroke-dasharray", "0");
}, "extension"), FS = /* @__PURE__ */ p((e, t, r) => {
  e.append("defs").append("marker").attr("id", r + "_" + t + "-compositionStart").attr("class", "marker composition " + t).attr("refX", 18).attr("refY", 7).attr("markerWidth", 190).attr("markerHeight", 240).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("path").attr("d", "M 18,7 L9,13 L1,7 L9,1 Z"), e.append("defs").append("marker").attr("id", r + "_" + t + "-compositionEnd").attr("class", "marker composition " + t).attr("refX", 1).attr("refY", 7).attr("markerWidth", 20).attr("markerHeight", 28).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("path").attr("d", "M 18,7 L9,13 L1,7 L9,1 Z"), e.append("defs").append("marker").attr("id", r + "_" + t + "-compositionStart-margin").attr("class", "marker composition " + t).attr("refX", 15).attr("refY", 7).attr("markerWidth", 190).attr("markerHeight", 240).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("path").style("stroke-width", 0).attr("viewBox", "0 0 15 15").attr("d", "M 18,7 L9,13 L1,7 L9,1 Z"), e.append("defs").append("marker").attr("id", r + "_" + t + "-compositionEnd-margin").attr("class", "marker composition " + t).attr("refX", 3.5).attr("refY", 7).attr("markerWidth", 20).attr("markerHeight", 28).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("path").style("stroke-width", 0).attr("d", "M 18,7 L9,13 L1,7 L9,1 Z");
}, "composition"), AS = /* @__PURE__ */ p((e, t, r) => {
  e.append("defs").append("marker").attr("id", r + "_" + t + "-aggregationStart").attr("class", "marker aggregation " + t).attr("refX", 18).attr("refY", 7).attr("markerWidth", 190).attr("markerHeight", 240).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("path").attr("d", "M 18,7 L9,13 L1,7 L9,1 Z"), e.append("defs").append("marker").attr("id", r + "_" + t + "-aggregationEnd").attr("class", "marker aggregation " + t).attr("refX", 1).attr("refY", 7).attr("markerWidth", 20).attr("markerHeight", 28).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("path").attr("d", "M 18,7 L9,13 L1,7 L9,1 Z"), e.append("defs").append("marker").attr("id", r + "_" + t + "-aggregationStart-margin").attr("class", "marker aggregation " + t).attr("refX", 15).attr("refY", 7).attr("markerWidth", 190).attr("markerHeight", 240).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("path").style("stroke-width", 2).attr("d", "M 18,7 L9,13 L1,7 L9,1 Z"), e.append("defs").append("marker").attr("id", r + "_" + t + "-aggregationEnd-margin").attr("class", "marker aggregation " + t).attr("refX", 1).attr("refY", 7).attr("markerWidth", 20).attr("markerHeight", 28).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("path").style("stroke-width", 2).attr("d", "M 18,7 L9,13 L1,7 L9,1 Z");
}, "aggregation"), ES = /* @__PURE__ */ p((e, t, r) => {
  e.append("defs").append("marker").attr("id", r + "_" + t + "-dependencyStart").attr("class", "marker dependency " + t).attr("refX", 6).attr("refY", 7).attr("markerWidth", 190).attr("markerHeight", 240).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("path").attr("d", "M 5,7 L9,13 L1,7 L9,1 Z"), e.append("defs").append("marker").attr("id", r + "_" + t + "-dependencyEnd").attr("class", "marker dependency " + t).attr("refX", 13).attr("refY", 7).attr("markerWidth", 20).attr("markerHeight", 28).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("path").attr("d", "M 18,7 L9,13 L14,7 L9,1 Z"), e.append("defs").append("marker").attr("id", r + "_" + t + "-dependencyStart-margin").attr("class", "marker dependency " + t).attr("refX", 4).attr("refY", 7).attr("markerWidth", 190).attr("markerHeight", 240).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("path").style("stroke-width", 0).attr("d", "M 5,7 L9,13 L1,7 L9,1 Z"), e.append("defs").append("marker").attr("id", r + "_" + t + "-dependencyEnd-margin").attr("class", "marker dependency " + t).attr("refX", 16).attr("refY", 7).attr("markerWidth", 20).attr("markerHeight", 28).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("path").style("stroke-width", 0).attr("d", "M 18,7 L9,13 L14,7 L9,1 Z");
}, "dependency"), MS = /* @__PURE__ */ p((e, t, r) => {
  e.append("defs").append("marker").attr("id", r + "_" + t + "-lollipopStart").attr("class", "marker lollipop " + t).attr("refX", 13).attr("refY", 7).attr("markerWidth", 190).attr("markerHeight", 240).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("circle").attr("fill", "transparent").attr("cx", 7).attr("cy", 7).attr("r", 6), e.append("defs").append("marker").attr("id", r + "_" + t + "-lollipopEnd").attr("class", "marker lollipop " + t).attr("refX", 1).attr("refY", 7).attr("markerWidth", 190).attr("markerHeight", 240).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("circle").attr("fill", "transparent").attr("cx", 7).attr("cy", 7).attr("r", 6), e.append("defs").append("marker").attr("id", r + "_" + t + "-lollipopStart-margin").attr("class", "marker lollipop " + t).attr("refX", 13).attr("refY", 7).attr("markerWidth", 190).attr("markerHeight", 240).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("circle").attr("fill", "transparent").attr("cx", 7).attr("cy", 7).attr("r", 6).attr("stroke-width", 2), e.append("defs").append("marker").attr("id", r + "_" + t + "-lollipopEnd-margin").attr("class", "marker lollipop " + t).attr("refX", 1).attr("refY", 7).attr("markerWidth", 190).attr("markerHeight", 240).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("circle").attr("fill", "transparent").attr("cx", 7).attr("cy", 7).attr("r", 6).attr("stroke-width", 2);
}, "lollipop"), $S = /* @__PURE__ */ p((e, t, r) => {
  e.append("marker").attr("id", r + "_" + t + "-pointEnd").attr("class", "marker " + t).attr("viewBox", "0 0 10 10").attr("refX", 5).attr("refY", 5).attr("markerUnits", "userSpaceOnUse").attr("markerWidth", 8).attr("markerHeight", 8).attr("orient", "auto").append("path").attr("d", "M 0 0 L 10 5 L 0 10 z").attr("class", "arrowMarkerPath").style("stroke-width", 1).style("stroke-dasharray", "1,0"), e.append("marker").attr("id", r + "_" + t + "-pointStart").attr("class", "marker " + t).attr("viewBox", "0 0 10 10").attr("refX", 4.5).attr("refY", 5).attr("markerUnits", "userSpaceOnUse").attr("markerWidth", 8).attr("markerHeight", 8).attr("orient", "auto").append("path").attr("d", "M 0 5 L 10 10 L 10 0 z").attr("class", "arrowMarkerPath").style("stroke-width", 1).style("stroke-dasharray", "1,0"), e.append("marker").attr("id", r + "_" + t + "-pointEnd-margin").attr("class", "marker " + t).attr("viewBox", "0 0 11.5 14").attr("refX", 11.5).attr("refY", 7).attr("markerUnits", "userSpaceOnUse").attr("markerWidth", 10.5).attr("markerHeight", 14).attr("orient", "auto").append("path").attr("d", "M 0 0 L 11.5 7 L 0 14 z").attr("class", "arrowMarkerPath").style("stroke-width", 0).style("stroke-dasharray", "1,0"), e.append("marker").attr("id", r + "_" + t + "-pointStart-margin").attr("class", "marker " + t).attr("viewBox", "0 0 11.5 14").attr("refX", 1).attr("refY", 7).attr("markerUnits", "userSpaceOnUse").attr("markerWidth", 11.5).attr("markerHeight", 14).attr("orient", "auto").append("polygon").attr("points", "0,7 11.5,14 11.5,0").attr("class", "arrowMarkerPath").style("stroke-width", 0).style("stroke-dasharray", "1,0");
}, "point"), OS = /* @__PURE__ */ p((e, t, r) => {
  e.append("marker").attr("id", r + "_" + t + "-circleEnd").attr("class", "marker " + t).attr("viewBox", "0 0 10 10").attr("refX", 11).attr("refY", 5).attr("markerUnits", "userSpaceOnUse").attr("markerWidth", 11).attr("markerHeight", 11).attr("orient", "auto").append("circle").attr("cx", "5").attr("cy", "5").attr("r", "5").attr("class", "arrowMarkerPath").style("stroke-width", 1).style("stroke-dasharray", "1,0"), e.append("marker").attr("id", r + "_" + t + "-circleStart").attr("class", "marker " + t).attr("viewBox", "0 0 10 10").attr("refX", -1).attr("refY", 5).attr("markerUnits", "userSpaceOnUse").attr("markerWidth", 11).attr("markerHeight", 11).attr("orient", "auto").append("circle").attr("cx", "5").attr("cy", "5").attr("r", "5").attr("class", "arrowMarkerPath").style("stroke-width", 1).style("stroke-dasharray", "1,0"), e.append("marker").attr("id", r + "_" + t + "-circleEnd-margin").attr("class", "marker " + t).attr("viewBox", "0 0 10 10").attr("refY", 5).attr("refX", 12.25).attr("markerUnits", "userSpaceOnUse").attr("markerWidth", 14).attr("markerHeight", 14).attr("orient", "auto").append("circle").attr("cx", "5").attr("cy", "5").attr("r", "5").attr("class", "arrowMarkerPath").style("stroke-width", 0).style("stroke-dasharray", "1,0"), e.append("marker").attr("id", r + "_" + t + "-circleStart-margin").attr("class", "marker " + t).attr("viewBox", "0 0 10 10").attr("refX", -2).attr("refY", 5).attr("markerUnits", "userSpaceOnUse").attr("markerWidth", 14).attr("markerHeight", 14).attr("orient", "auto").append("circle").attr("cx", "5").attr("cy", "5").attr("r", "5").attr("class", "arrowMarkerPath").style("stroke-width", 0).style("stroke-dasharray", "1,0");
}, "circle"), IS = /* @__PURE__ */ p((e, t, r) => {
  e.append("marker").attr("id", r + "_" + t + "-crossEnd").attr("class", "marker cross " + t).attr("viewBox", "0 0 11 11").attr("refX", 12).attr("refY", 5.2).attr("markerUnits", "userSpaceOnUse").attr("markerWidth", 11).attr("markerHeight", 11).attr("orient", "auto").append("path").attr("d", "M 1,1 l 9,9 M 10,1 l -9,9").attr("class", "arrowMarkerPath").style("stroke-width", 2).style("stroke-dasharray", "1,0"), e.append("marker").attr("id", r + "_" + t + "-crossStart").attr("class", "marker cross " + t).attr("viewBox", "0 0 11 11").attr("refX", -1).attr("refY", 5.2).attr("markerUnits", "userSpaceOnUse").attr("markerWidth", 11).attr("markerHeight", 11).attr("orient", "auto").append("path").attr("d", "M 1,1 l 9,9 M 10,1 l -9,9").attr("class", "arrowMarkerPath").style("stroke-width", 2).style("stroke-dasharray", "1,0"), e.append("marker").attr("id", r + "_" + t + "-crossEnd-margin").attr("class", "marker cross " + t).attr("viewBox", "0 0 15 15").attr("refX", 17.7).attr("refY", 7.5).attr("markerUnits", "userSpaceOnUse").attr("markerWidth", 12).attr("markerHeight", 12).attr("orient", "auto").append("path").attr("d", "M 1,1 L 14,14 M 1,14 L 14,1").attr("class", "arrowMarkerPath").style("stroke-width", 2.5), e.append("marker").attr("id", r + "_" + t + "-crossStart-margin").attr("class", "marker cross " + t).attr("viewBox", "0 0 15 15").attr("refX", -3.5).attr("refY", 7.5).attr("markerUnits", "userSpaceOnUse").attr("markerWidth", 12).attr("markerHeight", 12).attr("orient", "auto").append("path").attr("d", "M 1,1 L 14,14 M 1,14 L 14,1").attr("class", "arrowMarkerPath").style("stroke-width", 2.5).style("stroke-dasharray", "1,0");
}, "cross"), DS = /* @__PURE__ */ p((e, t, r) => {
  e.append("defs").append("marker").attr("id", r + "_" + t + "-barbEnd").attr("refX", 19).attr("refY", 7).attr("markerWidth", 20).attr("markerHeight", 14).attr("markerUnits", "userSpaceOnUse").attr("orient", "auto").append("path").attr("d", "M 19,7 L9,13 L14,7 L9,1 Z");
}, "barb"), PS = /* @__PURE__ */ p((e, t, r) => {
  const i = Dt(), { themeVariables: s } = i, { transitionColor: o } = s;
  e.append("defs").append("marker").attr("id", r + "_" + t + "-barbEnd").attr("refX", 19).attr("refY", 7).attr("markerWidth", 20).attr("markerHeight", 14).attr("markerUnits", "strokeWidth").attr("orient", "auto").append("path").attr("d", "M 19,7 L11,14 L13,7 L11,0 Z"), e.append("defs").append("marker").attr("id", r + "_" + t + "-barbEnd-margin").attr("refX", 17).attr("refY", 7).attr("markerWidth", 20).attr("markerHeight", 14).attr("markerUnits", "userSpaceOnUse").attr("orient", "auto").append("path").attr("d", "M 19,7 L11,14 L13,7 L11,0 Z").attr("fill", `${o}`);
}, "barbNeo"), RS = /* @__PURE__ */ p((e, t, r) => {
  e.append("defs").append("marker").attr("id", r + "_" + t + "-onlyOneStart").attr("class", "marker onlyOne " + t).attr("refX", 0).attr("refY", 9).attr("markerWidth", 18).attr("markerHeight", 18).attr("orient", "auto").append("path").attr("d", "M9,0 L9,18 M15,0 L15,18"), e.append("defs").append("marker").attr("id", r + "_" + t + "-onlyOneEnd").attr("class", "marker onlyOne " + t).attr("refX", 18).attr("refY", 9).attr("markerWidth", 18).attr("markerHeight", 18).attr("orient", "auto").append("path").attr("d", "M3,0 L3,18 M9,0 L9,18");
}, "only_one"), qS = /* @__PURE__ */ p((e, t, r) => {
  const i = e.append("defs").append("marker").attr("id", r + "_" + t + "-zeroOrOneStart").attr("class", "marker zeroOrOne " + t).attr("refX", 0).attr("refY", 9).attr("markerWidth", 30).attr("markerHeight", 18).attr("orient", "auto");
  i.append("circle").attr("fill", "white").attr("cx", 21).attr("cy", 9).attr("r", 6), i.append("path").attr("d", "M9,0 L9,18");
  const s = e.append("defs").append("marker").attr("id", r + "_" + t + "-zeroOrOneEnd").attr("class", "marker zeroOrOne " + t).attr("refX", 30).attr("refY", 9).attr("markerWidth", 30).attr("markerHeight", 18).attr("orient", "auto");
  s.append("circle").attr("fill", "white").attr("cx", 9).attr("cy", 9).attr("r", 6), s.append("path").attr("d", "M21,0 L21,18");
}, "zero_or_one"), NS = /* @__PURE__ */ p((e, t, r) => {
  e.append("defs").append("marker").attr("id", r + "_" + t + "-oneOrMoreStart").attr("class", "marker oneOrMore " + t).attr("refX", 18).attr("refY", 18).attr("markerWidth", 45).attr("markerHeight", 36).attr("orient", "auto").append("path").attr("d", "M0,18 Q 18,0 36,18 Q 18,36 0,18 M42,9 L42,27"), e.append("defs").append("marker").attr("id", r + "_" + t + "-oneOrMoreEnd").attr("class", "marker oneOrMore " + t).attr("refX", 27).attr("refY", 18).attr("markerWidth", 45).attr("markerHeight", 36).attr("orient", "auto").append("path").attr("d", "M3,9 L3,27 M9,18 Q27,0 45,18 Q27,36 9,18");
}, "one_or_more"), WS = /* @__PURE__ */ p((e, t, r) => {
  const i = e.append("defs").append("marker").attr("id", r + "_" + t + "-zeroOrMoreStart").attr("class", "marker zeroOrMore " + t).attr("refX", 18).attr("refY", 18).attr("markerWidth", 57).attr("markerHeight", 36).attr("orient", "auto");
  i.append("circle").attr("fill", "white").attr("cx", 48).attr("cy", 18).attr("r", 6), i.append("path").attr("d", "M0,18 Q18,0 36,18 Q18,36 0,18");
  const s = e.append("defs").append("marker").attr("id", r + "_" + t + "-zeroOrMoreEnd").attr("class", "marker zeroOrMore " + t).attr("refX", 39).attr("refY", 18).attr("markerWidth", 57).attr("markerHeight", 36).attr("orient", "auto");
  s.append("circle").attr("fill", "white").attr("cx", 9).attr("cy", 18).attr("r", 6), s.append("path").attr("d", "M21,18 Q39,0 57,18 Q39,36 21,18");
}, "zero_or_more"), zS = /* @__PURE__ */ p((e, t, r) => {
  const i = Dt(), { themeVariables: s } = i, { strokeWidth: o } = s;
  e.append("defs").append("marker").attr("id", r + "_" + t + "-onlyOneStart").attr("class", "marker onlyOne " + t).attr("refX", 0).attr("refY", 9).attr("markerWidth", 18).attr("markerHeight", 18).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("path").attr("d", "M9,0 L9,18 M15,0 L15,18").attr("stroke-width", `${o}`), e.append("defs").append("marker").attr("id", r + "_" + t + "-onlyOneEnd").attr("class", "marker onlyOne " + t).attr("refX", 18).attr("refY", 9).attr("markerWidth", 18).attr("markerHeight", 18).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("path").attr("d", "M3,0 L3,18 M9,0 L9,18").attr("stroke-width", `${o}`);
}, "only_one_neo"), HS = /* @__PURE__ */ p((e, t, r) => {
  const i = Dt(), { themeVariables: s } = i, { strokeWidth: o, mainBkg: a } = s, n = e.append("defs").append("marker").attr("id", r + "_" + t + "-zeroOrOneStart").attr("class", "marker zeroOrOne " + t).attr("refX", 0).attr("refY", 9).attr("markerWidth", 30).attr("markerHeight", 18).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse");
  n.append("circle").attr("fill", a ?? "white").attr("cx", 21).attr("cy", 9).attr("stroke-width", `${o}`).attr("r", 6), n.append("path").attr("d", "M9,0 L9,18").attr("stroke-width", `${o}`);
  const l = e.append("defs").append("marker").attr("id", r + "_" + t + "-zeroOrOneEnd").attr("class", "marker zeroOrOne " + t).attr("refX", 30).attr("refY", 9).attr("markerWidth", 30).attr("markerHeight", 18).attr("markerUnits", "userSpaceOnUse").attr("orient", "auto");
  l.append("circle").attr("fill", a ?? "white").attr("cx", 9).attr("cy", 9).attr("stroke-width", `${o}`).attr("r", 6), l.append("path").attr("d", "M21,0 L21,18").attr("stroke-width", `${o}`);
}, "zero_or_one_neo"), YS = /* @__PURE__ */ p((e, t, r) => {
  const i = Dt(), { themeVariables: s } = i, { strokeWidth: o } = s;
  e.append("defs").append("marker").attr("id", r + "_" + t + "-oneOrMoreStart").attr("class", "marker oneOrMore " + t).attr("refX", 18).attr("refY", 18).attr("markerWidth", 45).attr("markerHeight", 36).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("path").attr("d", "M0,18 Q 18,0 36,18 Q 18,36 0,18 M42,9 L42,27").attr("stroke-width", `${o}`), e.append("defs").append("marker").attr("id", r + "_" + t + "-oneOrMoreEnd").attr("class", "marker oneOrMore " + t).attr("refX", 27).attr("refY", 18).attr("markerWidth", 45).attr("markerHeight", 36).attr("markerUnits", "userSpaceOnUse").attr("orient", "auto").append("path").attr("d", "M3,9 L3,27 M9,18 Q27,0 45,18 Q27,36 9,18").attr("stroke-width", `${o}`);
}, "one_or_more_neo"), XS = /* @__PURE__ */ p((e, t, r) => {
  const i = Dt(), { themeVariables: s } = i, { strokeWidth: o, mainBkg: a } = s, n = e.append("defs").append("marker").attr("id", r + "_" + t + "-zeroOrMoreStart").attr("class", "marker zeroOrMore " + t).attr("refX", 18).attr("refY", 18).attr("markerWidth", 57).attr("markerHeight", 36).attr("markerUnits", "userSpaceOnUse").attr("orient", "auto");
  n.append("circle").attr("fill", a ?? "white").attr("cx", 45.5).attr("cy", 18).attr("r", 6).attr("stroke-width", `${o}`), n.append("path").attr("d", "M0,18 Q18,0 36,18 Q18,36 0,18").attr("stroke-width", `${o}`);
  const l = e.append("defs").append("marker").attr("id", r + "_" + t + "-zeroOrMoreEnd").attr("class", "marker zeroOrMore " + t).attr("refX", 39).attr("refY", 18).attr("markerWidth", 57).attr("markerHeight", 36).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse");
  l.append("circle").attr("fill", a ?? "white").attr("cx", 11).attr("cy", 18).attr("r", 6).attr("stroke-width", `${o}`), l.append("path").attr("d", "M21,18 Q39,0 57,18 Q39,36 21,18").attr("stroke-width", `${o}`);
}, "zero_or_more_neo"), jS = /* @__PURE__ */ p((e, t, r) => {
  e.append("defs").append("marker").attr("id", r + "_" + t + "-requirement_arrowEnd").attr("refX", 20).attr("refY", 10).attr("markerWidth", 20).attr("markerHeight", 20).attr("orient", "auto").append("path").attr(
    "d",
    `M0,0
      L20,10
      M20,10
      L0,20`
  );
}, "requirement_arrow"), US = /* @__PURE__ */ p((e, t, r) => {
  const i = Dt(), { themeVariables: s } = i, { strokeWidth: o } = s;
  e.append("defs").append("marker").attr("id", r + "_" + t + "-requirement_arrowEnd").attr("refX", 20).attr("refY", 10).attr("markerWidth", 20).attr("markerHeight", 20).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").attr("stroke-width", `${o}`).attr("viewBox", "0 0 25 20").append("path").attr(
    "d",
    `M0,0
      L20,10
      M20,10
      L0,20`
  ).attr("stroke-linejoin", "miter");
}, "requirement_arrow_neo"), GS = /* @__PURE__ */ p((e, t, r) => {
  const i = e.append("defs").append("marker").attr("id", r + "_" + t + "-requirement_containsStart").attr("refX", 0).attr("refY", 10).attr("markerWidth", 20).attr("markerHeight", 20).attr("orient", "auto").append("g");
  i.append("circle").attr("cx", 10).attr("cy", 10).attr("r", 9).attr("fill", "none"), i.append("line").attr("x1", 1).attr("x2", 19).attr("y1", 10).attr("y2", 10), i.append("line").attr("y1", 1).attr("y2", 19).attr("x1", 10).attr("x2", 10);
}, "requirement_contains"), VS = /* @__PURE__ */ p((e, t, r) => {
  const i = Dt(), { themeVariables: s } = i, { strokeWidth: o } = s, a = e.append("defs").append("marker").attr("id", r + "_" + t + "-requirement_containsStart").attr("refX", 0).attr("refY", 10).attr("markerWidth", 20).attr("markerHeight", 20).attr("orient", "auto").attr("markerUnits", "userSpaceOnUse").append("g");
  a.append("circle").attr("cx", 10).attr("cy", 10).attr("r", 9).attr("fill", "none"), a.append("line").attr("x1", 1).attr("x2", 19).attr("y1", 10).attr("y2", 10), a.append("line").attr("y1", 1).attr("y2", 19).attr("x1", 10).attr("x2", 10), a.selectAll("*").attr("stroke-width", `${o}`);
}, "requirement_contains_neo"), KS = {
  extension: LS,
  composition: FS,
  aggregation: AS,
  dependency: ES,
  lollipop: MS,
  point: $S,
  circle: OS,
  cross: IS,
  barb: DS,
  barbNeo: PS,
  only_one: RS,
  zero_or_one: qS,
  one_or_more: NS,
  zero_or_more: WS,
  only_one_neo: zS,
  zero_or_one_neo: HS,
  one_or_more_neo: YS,
  zero_or_more_neo: XS,
  requirement_arrow: jS,
  requirement_contains: GS,
  requirement_arrow_neo: US,
  requirement_contains_neo: VS
}, Tg = vS, ZS = "\0", nr = "\0", _c = "";
class qo {
  /**
   * @param {GraphOptions} [opts] - Graph options.
   */
  constructor(t = {}) {
    this._isDirected = Object.prototype.hasOwnProperty.call(t, "directed") ? t.directed : !0, this._isMultigraph = Object.prototype.hasOwnProperty.call(t, "multigraph") ? t.multigraph : !1, this._isCompound = Object.prototype.hasOwnProperty.call(t, "compound") ? t.compound : !1, this._label = void 0, this._defaultNodeLabelFn = bs(void 0), this._defaultEdgeLabelFn = bs(void 0), this._nodes = {}, this._isCompound && (this._parent = {}, this._children = {}, this._children[nr] = {}), this._in = {}, this._preds = {}, this._out = {}, this._sucs = {}, this._edgeObjs = {}, this._edgeLabels = {};
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
    return th(t) || (t = bs(t)), this._defaultNodeLabelFn = t, this;
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
    return $r(this._nodes);
  }
  /**
   * @returns {NodeID[]} those nodes in the graph that have no in-edges.
   * @remarks Takes `O(|V|)` time.
   */
  sources() {
    var t = this;
    return ks(this.nodes(), function(r) {
      return eh(t._in[r]);
    });
  }
  /**
   * @returns {NodeID[]} those nodes in the graph that have no out-edges.
   * @remarks Takes `O(|V|)` time.
   */
  sinks() {
    var t = this;
    return ks(this.nodes(), function(r) {
      return eh(t._out[r]);
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
    return sr(t, function(o) {
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
    return Object.prototype.hasOwnProperty.call(this._nodes, t) ? (arguments.length > 1 && (this._nodes[t] = r), this) : (this._nodes[t] = arguments.length > 1 ? r : this._defaultNodeLabelFn(t), this._isCompound && (this._parent[t] = nr, this._children[t] = {}, this._children[nr][t] = !0), this._in[t] = {}, this._preds[t] = {}, this._out[t] = {}, this._sucs[t] = {}, ++this._nodeCount, this);
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
      delete this._nodes[t], this._isCompound && (this._removeFromParentsChildList(t), delete this._parent[t], sr(this.children(t), (i) => {
        this.setParent(i);
      }), delete this._children[t]), sr($r(this._in[t]), r), delete this._in[t], delete this._preds[t], sr($r(this._out[t]), r), delete this._out[t], delete this._sucs[t], --this._nodeCount;
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
    if (Rr(r))
      r = nr;
    else {
      r += "";
      for (var i = r; !Rr(i); i = this.parent(i))
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
      if (r !== nr)
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
    if (Rr(t) && (t = nr), this._isCompound) {
      var r = this._children[t];
      if (r)
        return $r(r);
    } else {
      if (t === nr)
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
      return $r(r);
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
      return $r(r);
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
      return um(r, this.successors(t));
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
    sr(this._nodes, function(a, n) {
      t(n) && r.setNode(n, a);
    }), sr(this._edgeObjs, function(a) {
      r.hasNode(a.v) && r.hasNode(a.w) && r.setEdge(a, i.edge(a));
    });
    var s = {};
    function o(a) {
      var n = i.parent(a);
      return n === void 0 || r.hasNode(n) ? (s[a] = n, n) : n in s ? s[n] : o(n);
    }
    return this._isCompound && sr(r.nodes(), function(a) {
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
    return th(t) || (t = bs(t)), this._defaultEdgeLabelFn = t, this;
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
    return Yo(this._edgeObjs);
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
    return fm(t, function(o, a) {
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
    typeof a == "object" && a !== null && "v" in a ? (t = a.v, r = a.w, i = a.name, arguments.length === 2 && (s = arguments[1], o = !0)) : (t = a, r = arguments[1], i = arguments[3], arguments.length > 2 && (s = arguments[2], o = !0)), t = "" + t, r = "" + r, Rr(i) || (i = "" + i);
    var n = ji(this._isDirected, t, r, i);
    if (Object.prototype.hasOwnProperty.call(this._edgeLabels, n))
      return o && (this._edgeLabels[n] = s), this;
    if (!Rr(i) && !this._isMultigraph)
      throw new Error("Cannot set a named edge when isMultigraph = false");
    this.setNode(t), this.setNode(r), this._edgeLabels[n] = o ? s : this._defaultEdgeLabelFn(t, r, i);
    var l = QS(this._isDirected, t, r, i);
    return t = l.v, r = l.w, Object.freeze(l), this._edgeObjs[n] = l, vc(this._preds[r], t), vc(this._sucs[t], r), this._in[r][n] = l, this._out[t][n] = l, this._edgeCount++, this;
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
    var s = arguments.length === 1 ? la(this._isDirected, arguments[0]) : ji(this._isDirected, t, r, i);
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
    var s = arguments.length === 1 ? la(this._isDirected, arguments[0]) : ji(this._isDirected, t, r, i);
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
    var s = arguments.length === 1 ? la(this._isDirected, arguments[0]) : ji(this._isDirected, t, r, i), o = this._edgeObjs[s];
    return o && (t = o.v, r = o.w, delete this._edgeLabels[s], delete this._edgeObjs[s], Lc(this._preds[r], t), Lc(this._sucs[t], r), delete this._in[r][s], delete this._out[t][s], this._edgeCount--), this;
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
      var s = Yo(i);
      return r ? ks(s, function(o) {
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
      var s = Yo(i);
      return r ? ks(s, function(o) {
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
qo.prototype._nodeCount = 0;
qo.prototype._edgeCount = 0;
function vc(e, t) {
  e[t] ? e[t]++ : e[t] = 1;
}
function Lc(e, t) {
  --e[t] || delete e[t];
}
function ji(e, t, r, i) {
  var s = "" + t, o = "" + r;
  if (!e && s > o) {
    var a = s;
    s = o, o = a;
  }
  return s + _c + o + _c + (Rr(i) ? ZS : i);
}
function QS(e, t, r, i) {
  var s = "" + t, o = "" + r;
  if (!e && s > o) {
    var a = s;
    s = o, o = a;
  }
  var n = { v: s, w: o };
  return i && (n.name = i), n;
}
function la(e, t) {
  return ji(e, t.v, t.w, t.name);
}
function Bg(e, { edgePathsClass: t = "edges edgePaths" } = {}) {
  const r = e.insert("g").attr("class", "root"), i = r.insert("g").attr("class", "clusters"), s = r.insert("g").attr("class", t), o = r.insert("g").attr("class", "edgeLabels"), a = r.insert("g").attr("class", "nodes");
  return { clusters: i, edgePaths: s, edgeLabels: o, nodes: a, rootGroups: r };
}
p(Bg, "createLayoutElementGroups");
async function _g(e, t) {
  if (t.label) {
    const { shapeSvg: r, bbox: i } = await ct(e, t);
    t.labelBBox = { width: i.width, height: i.height }, r.remove();
  } else
    t.labelBBox = { width: 0, height: 0 };
}
p(_g, "measureGroupLabel");
async function vg(e, t, r) {
  const i = await Tl(e, t, r), s = i.node()?.getBBox() ?? { width: 0, height: 0 };
  return t.width = s.width, t.height = s.height, i;
}
p(vg, "insertMeasuredNode");
async function Lg(e, t) {
  const r = new qo({
    multigraph: !0,
    compound: !0
  }), i = [...t.edges], s = Bt(), o = Bg(e), { edgeLabels: a, nodes: n } = o, l = /* @__PURE__ */ new Map(), c = e.node() != null;
  await Promise.all(
    t.nodes.map(async (h) => {
      if (h.isGroup)
        c && await _g(n, h), r.setNode(h.id, { ...h });
      else {
        if (c) {
          const d = await vg(n, h, {
            config: s,
            dir: h.dir
          });
          l.set(h.id, d);
        }
        r.setNode(h.id, { ...h });
      }
    })
  );
  for (const h of i)
    c && Cg(h) && await Bl(a, h), r.setEdge(h.start, h.end, { ...h }, h.id), t.edges.some((u) => u.id === h.id) || t.edges.push(h);
  if (globalThis.mermaidCaptureSizes) {
    const { captureNodeSizes: h } = await import("./sizeCapture-INFHLROL-CZOgAT-l.js");
    h(e, t);
  }
  return {
    graph: r,
    groups: o,
    nodeElements: l
  };
}
p(Lg, "createGraphWithElements");
var vt = /* @__PURE__ */ new Map(), ur = /* @__PURE__ */ new Map(), Fg = /* @__PURE__ */ new Map(), JS = /* @__PURE__ */ p(() => {
  ur.clear(), Fg.clear(), vt.clear();
}, "clear"), as = /* @__PURE__ */ p((e, t) => {
  const r = ur.get(t) || [];
  return M.trace("In isDescendant", t, " ", e, " = ", r.includes(e)), r.includes(e);
}, "isDescendant"), tT = /* @__PURE__ */ p((e, t) => {
  const r = ur.get(t) || [];
  return M.info("Descendants of ", t, " is ", r), M.info("Edge is ", e), e.v === t || e.w === t ? !1 : r ? r.includes(e.v) || as(e.v, t) || as(e.w, t) || r.includes(e.w) : (M.debug("Tilt, ", t, ",not in descendants"), !1);
}, "edgeInCluster"), Ag = /* @__PURE__ */ p((e, t, r, i) => {
  M.debug(
    "Copying children of ",
    e,
    "root",
    i,
    "data",
    t.node(e),
    i
  );
  const s = t.children(e) || [];
  e !== i && s.push(e), M.debug("Copying (nodes) clusterId", e, "nodes", s), s.forEach((o) => {
    if (t.children(o).length > 0)
      Ag(o, t, r, i);
    else {
      const a = t.node(o);
      M.info("cp ", o, " to ", i, " with parent ", e), r.setNode(o, a), i !== t.parent(o) && (M.debug("Setting parent", o, t.parent(o)), r.setParent(o, t.parent(o))), e !== i && o !== e ? (M.debug("Setting parent", o, e), r.setParent(o, e)) : (M.info("In copy ", e, "root", i, "data", t.node(e), i), M.debug(
        "Not Setting parent for node=",
        o,
        "cluster!==rootId",
        e !== i,
        "node!==clusterId",
        o !== e
      ));
      const n = t.edges(o);
      M.debug("Copying Edges", n), n.forEach((l) => {
        M.info("Edge", l);
        const c = t.edge(l.v, l.w, l.name);
        M.info("Edge data", c, i);
        try {
          tT(l, i) ? (M.info("Copying as ", l.v, l.w, c, l.name), r.setEdge(l.v, l.w, c, l.name), M.info("newGraph edges ", r.edges(), r.edge(r.edges()[0]))) : M.info(
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
          M.error(h);
        }
      });
    }
    M.debug("Removing node", o), t.removeNode(o);
  });
}, "copy"), Eg = /* @__PURE__ */ p((e, t) => {
  const r = t.children(e);
  let i = [...r];
  for (const s of r)
    Fg.set(s, e), i = [...i, ...Eg(s, t)];
  return i;
}, "extractDescendants"), eT = /* @__PURE__ */ p((e, t, r) => {
  const i = e.edges().filter((l) => l.v === t || l.w === t), s = e.edges().filter((l) => l.v === r || l.w === r), o = i.map((l) => ({ v: l.v === t ? r : l.v, w: l.w === t ? t : l.w })), a = s.map((l) => ({ v: l.v, w: l.w }));
  return o.filter((l) => a.some((c) => l.v === c.v && l.w === c.w));
}, "findCommonEdges"), bo = /* @__PURE__ */ p((e, t, r) => {
  const i = t.children(e);
  if (M.trace("Searching children of id ", e, i), i.length < 1)
    return e;
  let s;
  for (const o of i) {
    const a = bo(o, t, r), n = eT(t, r, a);
    if (a)
      if (n.length > 0)
        s = a;
      else
        return a;
  }
  return s;
}, "findNonClusterChild"), Fc = /* @__PURE__ */ p((e) => !vt.has(e) || !vt.get(e).externalConnections ? e : vt.has(e) ? vt.get(e).id : e, "getAnchorId"), EF = /* @__PURE__ */ p((e, t) => {
  if (!e || t > 10) {
    M.debug("Opting out, no graph ");
    return;
  } else
    M.debug("Opting in, graph ");
  e.nodes().forEach(function(r) {
    e.children(r).length > 0 && (M.debug(
      "Cluster identified",
      r,
      " Replacement id in edges: ",
      bo(r, e, r)
    ), ur.set(r, Eg(r, e)), vt.set(r, { id: bo(r, e, r), clusterData: e.node(r) }));
  }), e.nodes().forEach(function(r) {
    const i = e.children(r), s = e.edges();
    i.length > 0 ? (M.debug("Cluster identified", r, ur), s.forEach((o) => {
      const a = as(o.v, r), n = as(o.w, r);
      a ^ n && (M.debug("Edge: ", o, " leaves cluster ", r), M.debug("Descendants of XXX ", r, ": ", ur.get(r)), vt.get(r).externalConnections = !0);
    })) : M.debug("Not a cluster ", r, ur);
  });
  for (let r of vt.keys()) {
    const i = vt.get(r).id, s = e.parent(i);
    s !== r && vt.has(s) && !vt.get(s).externalConnections && (vt.get(r).id = s);
    const o = e.edges().some((a) => a.v === r);
    if (i && vt.get(r)?.externalConnections && o && Og(e, i, r)) {
      const a = rT(e, r, e.parent(i));
      a && (vt.get(r).id = a);
    }
  }
  e.edges().forEach(function(r) {
    const i = e.edge(r);
    M.debug("Edge " + r.v + " -> " + r.w + ": " + JSON.stringify(r)), M.debug("Edge " + r.v + " -> " + r.w + ": " + JSON.stringify(e.edge(r)));
    let s = r.v, o = r.w;
    if (M.debug(
      "Fix XXX",
      vt,
      "ids:",
      r.v,
      r.w,
      "Translating: ",
      vt.get(r.v),
      " --- ",
      vt.get(r.w)
    ), vt.get(r.v) || vt.get(r.w)) {
      if (M.debug("Fixing and trying - removing XXX", r.v, r.w, r.name), s = Fc(r.v), o = Fc(r.w), e.removeEdge(r.v, r.w, r.name), s !== r.v) {
        const a = e.parent(s);
        vt.get(a).externalConnections = !0, i.fromCluster = r.v;
      }
      if (o !== r.w) {
        const a = e.parent(o);
        vt.get(a).externalConnections = !0, i.toCluster = r.w;
      }
      M.debug("Fix Replacing with XXX", s, o, r.name), e.setEdge(s, o, i, r.name);
    }
  }), Mg(e, 0), M.trace(vt);
}, "adjustClustersAndEdges"), Mg = /* @__PURE__ */ p((e, t) => {
  if (t > 10) {
    M.error("Bailing out");
    return;
  }
  let r = e.nodes(), i = !1;
  for (const s of r) {
    const o = e.children(s);
    i = i || o.length > 0;
  }
  if (!i) {
    M.debug("Done, no node has children", e.nodes());
    return;
  }
  M.debug("Nodes = ", r, t);
  for (const s of r)
    if (M.debug(
      "Extracting node",
      s,
      vt,
      vt.has(s) && !vt.get(s).externalConnections,
      !e.parent(s),
      e.node(s),
      e.children("D"),
      " Depth ",
      t
    ), !vt.has(s))
      M.debug("Not a cluster", s, t);
    else if (!vt.get(s).externalConnections && e.children(s) && e.children(s).length > 0) {
      M.debug(
        "Cluster without external connections, without a parent and with children",
        s,
        t
      );
      let a = e.graph().rankdir === "TB" ? "LR" : "TB";
      vt.get(s)?.clusterData?.dir && (a = vt.get(s).clusterData.dir, M.debug("Fixing dir", vt.get(s).clusterData.dir, a));
      const n = new qo({
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
      Ag(s, e, n, s), e.setNode(s, {
        clusterNode: !0,
        id: s,
        clusterData: vt.get(s).clusterData,
        label: vt.get(s).label,
        graph: n
      });
    } else
      M.debug(
        "Cluster ** ",
        s,
        " **not meeting the criteria !externalConnections:",
        !vt.get(s).externalConnections,
        " no parent: ",
        !e.parent(s),
        " children ",
        e.children(s) && e.children(s).length > 0,
        e.children("D"),
        t
      ), M.debug(vt);
  r = e.nodes(), M.debug("New list of nodes", r);
  for (const s of r) {
    const o = e.node(s);
    M.debug(" Now next level", s, o), o?.clusterNode && Mg(o.graph, t + 1);
  }
}, "extractor"), $g = /* @__PURE__ */ p((e, t) => {
  if (t.length === 0)
    return [];
  let r = Object.assign([], t);
  return t.forEach((i) => {
    const s = e.children(i), o = $g(e, s);
    r = [...r, ...o];
  }), r;
}, "sorter"), MF = /* @__PURE__ */ p((e) => $g(e, e.children()), "sortNodesByHierarchy"), Og = /* @__PURE__ */ p((e, t, r) => {
  let i = e.parent(t);
  for (; i && i !== r; ) {
    const s = vt.get(i);
    if (s && !s.externalConnections)
      return !0;
    i = e.parent(i);
  }
  return !1;
}, "isNodeInExtractableCluster"), rT = /* @__PURE__ */ p((e, t, r) => {
  const i = e.children(t) ?? [];
  for (const s of i) {
    if (s === r || as(s, r))
      continue;
    const o = bo(s, e, t);
    if (o && !Og(e, o, t))
      return o;
  }
  return null;
}, "findSafeAnchorNode");
function iT({
  prepareLayout: e,
  measureLayout: t,
  runLayoutCore: r,
  paintLayout: i,
  afterPaint: s,
  paintOptions: o
}) {
  const a = t ?? Dg;
  return /* @__PURE__ */ p(async function(l, c, h, d) {
    const u = c.select("g");
    (h?.insertMarkers ?? Tg)(
      u,
      l.markers,
      l.type,
      l.diagramId
    ), Ig();
    const f = {
      element: u,
      // root SVG <g>
      helpers: h,
      // Mermaid helper functions
      options: d
      // { algorithm: "elk.layered" }
    };
    f.preparedLayout = await e?.(l, f);
    const y = await a(l, f), m = await r(l, f), x = {
      ...f,
      measure: y
    };
    i ? await i(l, x, m) : await Pg(
      l,
      x,
      o
    ), await s?.(l, x, m);
  }, "render");
}
p(iT, "createCommonLayoutRenderer");
function Ig() {
  aS(), bS(), pS(), JS();
}
p(Ig, "clearLayoutRenderState");
async function Dg(e, { element: t }) {
  return await Lg(t, e);
}
p(Dg, "defaultMeasureLayout");
async function Pg(e, t, r = {}) {
  const { measure: i } = t, { groups: s } = i;
  for (const a of r.getNodes?.(e, t) ?? e.nodes)
    r.skipNode?.(a, t) || await Rg(s, a, t, r);
  const o = Ng(e.nodes);
  for (const a of e.edges)
    Wg(a, r) || await zg(s, a, o, e, r, t);
}
p(Pg, "paintLayoutData");
async function Rg(e, t, r, i) {
  t.clusterNode ? kc(t) : qg(t, r, i) ? await xg(e.clusters, t) : kc(t);
}
p(Rg, "paintLayoutNode");
function qg(e, t, r) {
  return e.isGroup === !0 && (r.isCluster?.(e, t) ?? !0);
}
p(qg, "shouldPaintAsCluster");
function Ng(e) {
  const t = /* @__PURE__ */ new Map();
  for (const r of e)
    r?.id && t.set(r.id, r);
  return t;
}
p(Ng, "buildNodeLookup");
function Wg(e, t) {
  return e.isLayoutOnly || !!t.skipEdge?.(e);
}
p(Wg, "shouldSkipPaintEdge");
async function zg(e, t, r, i, s, o) {
  const a = kg(
    e.edgePaths,
    { ...t },
    s.clusterDb ?? /* @__PURE__ */ new Map(),
    i.type,
    xn(t.start, t, r, o, s),
    xn(t.end, t, r, o, s),
    i.diagramId,
    Hg(t, s)
  );
  Cg(t) && (ui.has(t.id) || await Bl(e.edgeLabels, t), Yg(t, a));
}
p(zg, "paintLayoutEdge");
function xn(e, t, r, i, s) {
  return s.getEdgeNode?.(e, t, i) ?? (e ? r.get(e) ?? {} : {});
}
p(xn, "getRenderedNode");
function Hg(e, t) {
  return typeof t.skipIntersect == "function" ? t.skipIntersect(e) : t.skipIntersect ?? !1;
}
p(Hg, "shouldSkipIntersect");
function Yg(e, t) {
  const r = t?.updatedPath ?? t?.originalPath, i = Dt(), { subGraphTitleTotalMargin: s } = Po({
    flowchart: i.flowchart ?? {}
  });
  if (e.label) {
    const o = ui.get(e.id);
    let a = e.x, n = e.y;
    if (r) {
      const l = Kt.calcLabelPosition(r);
      M.debug(
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
    const o = Rt.get(e.id).startLeft;
    let a = e?.x, n = e?.y;
    if (r) {
      const l = Kt.calcTerminalLabelPosition(e.arrowTypeStart ? 10 : 0, "start_left", r);
      a = l.x, n = l.y;
    }
    o.attr("transform", `translate(${a}, ${n})`);
  }
  if (e.startLabelRight) {
    const o = Rt.get(e.id).startRight;
    let a = e.x, n = e.y;
    if (r) {
      const l = Kt.calcTerminalLabelPosition(
        e.arrowTypeStart ? 10 : 0,
        "start_right",
        r
      );
      a = l.x, n = l.y;
    }
    o.attr("transform", `translate(${a}, ${n})`);
  }
  if (e.endLabelLeft) {
    const o = Rt.get(e.id).endLeft;
    let a = e.x, n = e.y;
    if (r) {
      const l = Kt.calcTerminalLabelPosition(e.arrowTypeEnd ? 10 : 0, "end_left", r);
      a = l.x, n = l.y;
    }
    o.attr("transform", `translate(${a}, ${n})`);
  }
  if (e.endLabelRight) {
    const o = Rt.get(e.id).endRight;
    let a = e.x, n = e.y;
    if (r) {
      const l = Kt.calcTerminalLabelPosition(e.arrowTypeEnd ? 10 : 0, "end_right", r);
      a = l.x, n = l.y;
    }
    o.attr("transform", `translate(${a}, ${n})`);
  }
}
p(Yg, "positionRenderedEdgeLabel");
function Xg(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
p(Xg, "getDefaultExportFromCjs");
var Ut = {}, Os = {}, Ue = {}, Ac;
function xi() {
  if (Ac) return Ue;
  Ac = 1;
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
        const d = l[c];
        a[d] = n[d];
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
  return p(o, "isNegativeZero"), Ue.isNothing = e, Ue.isObject = t, Ue.toArray = r, Ue.repeat = s, Ue.isNegativeZero = o, Ue.extend = i, Ue;
}
p(xi, "requireCommon");
var ha, Ec;
function Ci() {
  if (Ec) return ha;
  Ec = 1;
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
  }, "toString"), ha = t, ha;
}
p(Ci, "requireException");
var ca, Mc;
function jg() {
  if (Mc) return ca;
  Mc = 1;
  const e = xi();
  function t(s, o, a, n, l) {
    let c = "", h = "";
    const d = Math.floor(l / 2) - 1;
    return n - o > d && (c = " ... ", o = n - d + c.length), a - n > d && (h = " ...", a = n + d - h.length), {
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
    let d = "";
    const u = Math.min(s.line + o.linesAfter, l.length).toString().length, f = o.maxLength - (o.indent + u + 3);
    for (let m = 1; m <= o.linesBefore && !(h - m < 0); m++) {
      const x = t(
        s.buffer,
        n[h - m],
        l[h - m],
        s.position - (n[h] - n[h - m]),
        f
      );
      d = e.repeat(" ", o.indent) + r((s.line - m + 1).toString(), u) + " | " + x.str + `
` + d;
    }
    const y = t(s.buffer, n[h], l[h], s.position, f);
    d += e.repeat(" ", o.indent) + r((s.line + 1).toString(), u) + " | " + y.str + `
`, d += e.repeat("-", o.indent + u + 3 + y.pos) + `^
`;
    for (let m = 1; m <= o.linesAfter && !(h + m >= l.length); m++) {
      const x = t(
        s.buffer,
        n[h + m],
        l[h + m],
        s.position - (n[h] - n[h + m]),
        f
      );
      d += e.repeat(" ", o.indent) + r((s.line + m + 1).toString(), u) + " | " + x.str + `
`;
    }
    return d.replace(/\n$/, "");
  }
  return p(i, "makeSnippet"), ca = i, ca;
}
p(jg, "requireSnippet");
var da, $c;
function Qt() {
  if ($c) return da;
  $c = 1;
  const e = Ci(), t = [
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
  return p(s, "Type2"), da = s, da;
}
p(Qt, "requireType");
var ua, Oc;
function _l() {
  if (Oc) return ua;
  Oc = 1;
  const e = Ci(), t = Qt();
  function r(o, a) {
    const n = [];
    return o[a].forEach(function(l) {
      let c = n.length;
      n.forEach(function(h, d) {
        h.tag === l.tag && h.kind === l.kind && h.multi === l.multi && (c = d);
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
  }, "extend"), ua = s, ua;
}
p(_l, "requireSchema");
var fa, Ic;
function vl() {
  if (Ic) return fa;
  Ic = 1;
  const e = Qt();
  return fa = new e("tag:yaml.org,2002:str", {
    kind: "scalar",
    construct: /* @__PURE__ */ p(function(t) {
      return t !== null ? t : "";
    }, "construct")
  }), fa;
}
p(vl, "requireStr");
var pa, Dc;
function Ll() {
  if (Dc) return pa;
  Dc = 1;
  const e = Qt();
  return pa = new e("tag:yaml.org,2002:seq", {
    kind: "sequence",
    construct: /* @__PURE__ */ p(function(t) {
      return t !== null ? t : [];
    }, "construct")
  }), pa;
}
p(Ll, "requireSeq");
var ga, Pc;
function Fl() {
  if (Pc) return ga;
  Pc = 1;
  const e = Qt();
  return ga = new e("tag:yaml.org,2002:map", {
    kind: "mapping",
    construct: /* @__PURE__ */ p(function(t) {
      return t !== null ? t : {};
    }, "construct")
  }), ga;
}
p(Fl, "requireMap");
var ya, Rc;
function Al() {
  if (Rc) return ya;
  Rc = 1;
  const e = _l();
  return ya = new e({
    explicit: [
      vl(),
      Ll(),
      Fl()
    ]
  }), ya;
}
p(Al, "requireFailsafe");
var ma, qc;
function El() {
  if (qc) return ma;
  qc = 1;
  const e = Qt();
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
  return p(i, "isNull"), ma = new e("tag:yaml.org,2002:null", {
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
  }), ma;
}
p(El, "require_null");
var xa, Nc;
function Ml() {
  if (Nc) return xa;
  Nc = 1;
  const e = Qt();
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
  return p(i, "isBoolean"), xa = new e("tag:yaml.org,2002:bool", {
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
  }), xa;
}
p(Ml, "requireBool");
var Ca, Wc;
function $l() {
  if (Wc) return Ca;
  Wc = 1;
  const e = xi(), t = Qt();
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
    let d = 0, u = !1;
    if (!h) return !1;
    let f = c[d];
    if ((f === "-" || f === "+") && (f = c[++d]), f === "0") {
      if (d + 1 === h) return !0;
      if (f = c[++d], f === "b") {
        for (d++; d < h; d++) {
          if (f = c[d], f !== "0" && f !== "1") return !1;
          u = !0;
        }
        return u && isFinite(a(c));
      }
      if (f === "x") {
        for (d++; d < h; d++) {
          if (!r(c.charCodeAt(d))) return !1;
          u = !0;
        }
        return u && isFinite(a(c));
      }
      if (f === "o") {
        for (d++; d < h; d++) {
          if (!i(c.charCodeAt(d))) return !1;
          u = !0;
        }
        return u && isFinite(a(c));
      }
    }
    for (; d < h; d++) {
      if (!s(c.charCodeAt(d)))
        return !1;
      u = !0;
    }
    return u ? isFinite(a(c)) : !1;
  }
  p(o, "resolveYamlInteger");
  function a(c) {
    let h = c, d = 1, u = h[0];
    if ((u === "-" || u === "+") && (u === "-" && (d = -1), h = h.slice(1), u = h[0]), h === "0") return 0;
    if (u === "0") {
      if (h[1] === "b") return d * parseInt(h.slice(2), 2);
      if (h[1] === "x") return d * parseInt(h.slice(2), 16);
      if (h[1] === "o") return d * parseInt(h.slice(2), 8);
    }
    return d * parseInt(h, 10);
  }
  p(a, "parseYamlInteger");
  function n(c) {
    return a(c);
  }
  p(n, "constructYamlInteger");
  function l(c) {
    return Object.prototype.toString.call(c) === "[object Number]" && c % 1 === 0 && !e.isNegativeZero(c);
  }
  return p(l, "isInteger"), Ca = new t("tag:yaml.org,2002:int", {
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
  }), Ca;
}
p($l, "requireInt");
var ba, zc;
function Ol() {
  if (zc) return ba;
  zc = 1;
  const e = xi(), t = Qt(), r = new RegExp(
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
    const d = h[0] === "-" ? -1 : 1;
    return "+-".indexOf(h[0]) >= 0 && (h = h.slice(1)), h === ".inf" ? d === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY : h === ".nan" ? NaN : d * parseFloat(h, 10);
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
    const d = c.toString(10);
    return a.test(d) ? d.replace("e", ".e") : d;
  }
  p(n, "representYamlFloat");
  function l(c) {
    return Object.prototype.toString.call(c) === "[object Number]" && (c % 1 !== 0 || e.isNegativeZero(c));
  }
  return p(l, "isFloat"), ba = new t("tag:yaml.org,2002:float", {
    kind: "scalar",
    resolve: s,
    construct: o,
    predicate: l,
    represent: n,
    defaultStyle: "lowercase"
  }), ba;
}
p(Ol, "requireFloat");
var ka, Hc;
function Il() {
  return Hc || (Hc = 1, ka = Al().extend({
    implicit: [
      El(),
      Ml(),
      $l(),
      Ol()
    ]
  })), ka;
}
p(Il, "requireJson");
var wa, Yc;
function Dl() {
  return Yc || (Yc = 1, wa = Il()), wa;
}
p(Dl, "requireCore");
var Sa, Xc;
function Pl() {
  if (Xc) return Sa;
  Xc = 1;
  const e = Qt(), t = new RegExp(
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
    const h = +c[1], d = +c[2] - 1, u = +c[3];
    if (!c[4])
      return new Date(Date.UTC(h, d, u));
    const f = +c[4], y = +c[5], m = +c[6];
    if (c[7]) {
      for (n = c[7].slice(0, 3); n.length < 3; )
        n += "0";
      n = +n;
    }
    if (c[9]) {
      const C = +c[10], b = +(c[11] || 0);
      l = (C * 60 + b) * 6e4, c[9] === "-" && (l = -l);
    }
    const x = new Date(Date.UTC(h, d, u, f, y, m, n));
    return l && x.setTime(x.getTime() - l), x;
  }
  p(s, "constructYamlTimestamp");
  function o(a) {
    return a.toISOString();
  }
  return p(o, "representYamlTimestamp"), Sa = new e("tag:yaml.org,2002:timestamp", {
    kind: "scalar",
    resolve: i,
    construct: s,
    instanceOf: Date,
    represent: o
  }), Sa;
}
p(Pl, "requireTimestamp");
var Ta, jc;
function Rl() {
  if (jc) return Ta;
  jc = 1;
  const e = Qt();
  function t(r) {
    return r === "<<" || r === null;
  }
  return p(t, "resolveYamlMerge"), Ta = new e("tag:yaml.org,2002:merge", {
    kind: "scalar",
    resolve: t
  }), Ta;
}
p(Rl, "requireMerge");
var Ba, Uc;
function ql() {
  if (Uc) return Ba;
  Uc = 1;
  const e = Qt(), t = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=
\r`;
  function r(a) {
    if (a === null) return !1;
    let n = 0;
    const l = a.length, c = t;
    for (let h = 0; h < l; h++) {
      const d = c.indexOf(a.charAt(h));
      if (!(d > 64)) {
        if (d < 0) return !1;
        n += 6;
      }
    }
    return n % 8 === 0;
  }
  p(r, "resolveYamlBinary");
  function i(a) {
    const n = a.replace(/[\r\n=]/g, ""), l = n.length, c = t;
    let h = 0;
    const d = [];
    for (let f = 0; f < l; f++)
      f % 4 === 0 && f && (d.push(h >> 16 & 255), d.push(h >> 8 & 255), d.push(h & 255)), h = h << 6 | c.indexOf(n.charAt(f));
    const u = l % 4 * 6;
    return u === 0 ? (d.push(h >> 16 & 255), d.push(h >> 8 & 255), d.push(h & 255)) : u === 18 ? (d.push(h >> 10 & 255), d.push(h >> 2 & 255)) : u === 12 && d.push(h >> 4 & 255), new Uint8Array(d);
  }
  p(i, "constructYamlBinary");
  function s(a) {
    let n = "", l = 0;
    const c = a.length, h = t;
    for (let u = 0; u < c; u++)
      u % 3 === 0 && u && (n += h[l >> 18 & 63], n += h[l >> 12 & 63], n += h[l >> 6 & 63], n += h[l & 63]), l = (l << 8) + a[u];
    const d = c % 3;
    return d === 0 ? (n += h[l >> 18 & 63], n += h[l >> 12 & 63], n += h[l >> 6 & 63], n += h[l & 63]) : d === 2 ? (n += h[l >> 10 & 63], n += h[l >> 4 & 63], n += h[l << 2 & 63], n += h[64]) : d === 1 && (n += h[l >> 2 & 63], n += h[l << 4 & 63], n += h[64], n += h[64]), n;
  }
  p(s, "representYamlBinary");
  function o(a) {
    return Object.prototype.toString.call(a) === "[object Uint8Array]";
  }
  return p(o, "isBinary"), Ba = new e("tag:yaml.org,2002:binary", {
    kind: "scalar",
    resolve: r,
    construct: i,
    predicate: o,
    represent: s
  }), Ba;
}
p(ql, "requireBinary");
var _a, Gc;
function Nl() {
  if (Gc) return _a;
  Gc = 1;
  const e = Qt(), t = Object.prototype.hasOwnProperty, r = Object.prototype.toString;
  function i(o) {
    if (o === null) return !0;
    const a = [], n = o;
    for (let l = 0, c = n.length; l < c; l += 1) {
      const h = n[l];
      let d = !1;
      if (r.call(h) !== "[object Object]") return !1;
      let u;
      for (u in h)
        if (t.call(h, u))
          if (!d) d = !0;
          else return !1;
      if (!d) return !1;
      if (a.indexOf(u) === -1) a.push(u);
      else return !1;
    }
    return !0;
  }
  p(i, "resolveYamlOmap");
  function s(o) {
    return o !== null ? o : [];
  }
  return p(s, "constructYamlOmap"), _a = new e("tag:yaml.org,2002:omap", {
    kind: "sequence",
    resolve: i,
    construct: s
  }), _a;
}
p(Nl, "requireOmap");
var va, Vc;
function Wl() {
  if (Vc) return va;
  Vc = 1;
  const e = Qt(), t = Object.prototype.toString;
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
  return p(i, "constructYamlPairs"), va = new e("tag:yaml.org,2002:pairs", {
    kind: "sequence",
    resolve: r,
    construct: i
  }), va;
}
p(Wl, "requirePairs");
var La, Kc;
function zl() {
  if (Kc) return La;
  Kc = 1;
  const e = Qt(), t = Object.prototype.hasOwnProperty;
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
  return p(i, "constructYamlSet"), La = new e("tag:yaml.org,2002:set", {
    kind: "mapping",
    resolve: r,
    construct: i
  }), La;
}
p(zl, "requireSet");
var Fa, Zc;
function No() {
  return Zc || (Zc = 1, Fa = Dl().extend({
    implicit: [
      Pl(),
      Rl()
    ],
    explicit: [
      ql(),
      Nl(),
      Wl(),
      zl()
    ]
  })), Fa;
}
p(No, "require_default");
var Qc;
function Ug() {
  if (Qc) return Os;
  Qc = 1;
  const e = xi(), t = Ci(), r = jg(), i = No(), s = Object.prototype.hasOwnProperty, o = 1, a = 2, n = 3, l = 4, c = 1, h = 2, d = 3, u = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/, f = /[\x85\u2028\u2029]/, y = /[,\[\]{}]/, m = /^(?:!|!!|![0-9A-Za-z-]+!)$/, x = /^(?:!|[^,\[\]{}])(?:%[0-9a-f]{2}|[0-9a-z\-#;/?:@&=+$,_.!~*'()\[\]])*$/i;
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
  function T(g) {
    return g === 9 || g === 32 || g === 10 || g === 13;
  }
  p(T, "isWsOrEol");
  function B(g) {
    return g === 44 || g === 91 || g === 93 || g === 123 || g === 125;
  }
  p(B, "isFlowIndicator");
  function L(g) {
    if (g >= 48 && g <= 57)
      return g - 48;
    const A = g | 32;
    return A >= 97 && A <= 102 ? A - 97 + 10 : -1;
  }
  p(L, "fromHexCode");
  function v(g) {
    return g === 120 ? 2 : g === 117 ? 4 : g === 85 ? 8 : 0;
  }
  p(v, "escapedHexLen");
  function _(g) {
    return g >= 48 && g <= 57 ? g - 48 : -1;
  }
  p(_, "fromDecimalCode");
  function R(g) {
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
  p(R, "simpleEscapeSequence");
  function N(g) {
    return g <= 65535 ? String.fromCharCode(g) : String.fromCharCode(
      (g - 65536 >> 10) + 55296,
      (g - 65536 & 1023) + 56320
    );
  }
  p(N, "charFromCodepoint");
  function q(g, A, H) {
    A === "__proto__" ? Object.defineProperty(g, A, {
      configurable: !0,
      enumerable: !0,
      writable: !0,
      value: H
    }) : g[A] = H;
  }
  p(q, "setProperty");
  const J = new Array(256), W = new Array(256);
  for (let g = 0; g < 256; g++)
    J[g] = R(g) ? 1 : 0, W[g] = R(g);
  function z(g, A) {
    this.input = g, this.filename = A.filename || null, this.schema = A.schema || i, this.onWarning = A.onWarning || null, this.legacy = A.legacy || !1, this.json = A.json || !1, this.listener = A.listener || null, this.maxDepth = typeof A.maxDepth == "number" ? A.maxDepth : 100, this.maxTotalMergeKeys = typeof A.maxTotalMergeKeys == "number" ? A.maxTotalMergeKeys : 1e4, this.implicitTypes = this.schema.compiledImplicit, this.typeMap = this.schema.compiledTypeMap, this.length = g.length, this.position = 0, this.line = 0, this.lineStart = 0, this.lineIndent = 0, this.depth = 0, this.totalMergeKeys = 0, this.firstTabInLine = -1, this.documents = [], this.anchorMapTransactions = [];
  }
  p(z, "State");
  function V(g, A) {
    const H = {
      name: g.filename,
      buffer: g.input.slice(0, -1),
      // omit trailing \0
      position: g.position,
      line: g.line,
      column: g.position - g.lineStart
    };
    return H.snippet = r(H), new t(A, H);
  }
  p(V, "generateError");
  function $(g, A) {
    throw V(g, A);
  }
  p($, "throwError");
  function P(g, A) {
    g.onWarning && g.onWarning.call(null, V(g, A));
  }
  p(P, "throwWarning");
  function Y(g, A, H) {
    const U = g.anchorMapTransactions;
    if (U.length !== 0) {
      const D = U[U.length - 1];
      s.call(D, A) || (D[A] = {
        existed: s.call(g.anchorMap, A),
        value: g.anchorMap[A]
      });
    }
    g.anchorMap[A] = H;
  }
  p(Y, "storeAnchor");
  function lt(g) {
    g.anchorMapTransactions.push(/* @__PURE__ */ Object.create(null));
  }
  p(lt, "beginAnchorTransaction");
  function at(g) {
    const A = g.anchorMapTransactions.pop(), H = g.anchorMapTransactions;
    if (H.length === 0) return;
    const U = H[H.length - 1], D = Object.keys(A);
    for (let Q = 0, S = D.length; Q < S; Q += 1) {
      const E = D[Q];
      s.call(U, E) || (U[E] = A[E]);
    }
  }
  p(at, "commitAnchorTransaction");
  function Ct(g) {
    const A = g.anchorMapTransactions.pop(), H = Object.keys(A);
    for (let U = H.length - 1; U >= 0; U -= 1) {
      const D = A[H[U]];
      D.existed ? g.anchorMap[H[U]] = D.value : delete g.anchorMap[H[U]];
    }
  }
  p(Ct, "rollbackAnchorTransaction");
  function Ft(g) {
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
  p(Ft, "snapshotState");
  function mt(g, A) {
    g.position = A.position, g.line = A.line, g.lineStart = A.lineStart, g.lineIndent = A.lineIndent, g.firstTabInLine = A.firstTabInLine, g.tag = A.tag, g.anchor = A.anchor, g.kind = A.kind, g.result = A.result;
  }
  p(mt, "restoreState");
  const St = {
    YAML: /* @__PURE__ */ p(function(A, H, U) {
      A.version !== null && $(A, "duplication of %YAML directive"), U.length !== 1 && $(A, "YAML directive accepts exactly one argument");
      const D = /^([0-9]+)\.([0-9]+)$/.exec(U[0]);
      D === null && $(A, "ill-formed argument of the YAML directive");
      const Q = parseInt(D[1], 10), S = parseInt(D[2], 10);
      Q !== 1 && $(A, "unacceptable YAML version of the document"), A.version = U[0], A.checkLineBreaks = S < 2, S !== 1 && S !== 2 && P(A, "unsupported YAML version of the document");
    }, "handleYamlDirective"),
    TAG: /* @__PURE__ */ p(function(A, H, U) {
      let D;
      U.length !== 2 && $(A, "TAG directive accepts exactly two arguments");
      const Q = U[0];
      D = U[1], m.test(Q) || $(A, "ill-formed tag handle (first argument) of the TAG directive"), s.call(A.tagMap, Q) && $(A, 'there is a previously declared suffix for "' + Q + '" tag handle'), x.test(D) || $(A, "ill-formed tag prefix (second argument) of the TAG directive");
      try {
        D = decodeURIComponent(D);
      } catch {
        $(A, "tag prefix is malformed: " + D);
      }
      A.tagMap[Q] = D;
    }, "handleTagDirective")
  };
  function bt(g, A, H, U) {
    if (A < H) {
      const D = g.input.slice(A, H);
      if (U)
        for (let Q = 0, S = D.length; Q < S; Q += 1) {
          const E = D.charCodeAt(Q);
          E === 9 || E >= 32 && E <= 1114111 || $(g, "expected valid JSON character");
        }
      else u.test(D) && $(g, "the stream contains non-printable characters");
      g.result += D;
    }
  }
  p(bt, "captureSegment");
  function ht(g, A, H, U) {
    e.isObject(H) || $(g, "cannot merge mappings; the provided source object is unacceptable");
    const D = Object.keys(H);
    for (let Q = 0, S = D.length; Q < S; Q += 1) {
      const E = D[Q];
      g.maxTotalMergeKeys !== -1 && ++g.totalMergeKeys > g.maxTotalMergeKeys && $(g, "merge keys exceeded maxTotalMergeKeys (" + g.maxTotalMergeKeys + ")"), s.call(A, E) || (q(A, E, H[E]), U[E] = !0);
    }
  }
  p(ht, "mergeMappings");
  function kt(g, A, H, U, D, Q, S, E, K) {
    if (Array.isArray(D)) {
      D = Array.prototype.slice.call(D);
      for (let X = 0, j = D.length; X < j; X += 1)
        Array.isArray(D[X]) && $(g, "nested arrays are not supported inside keys"), typeof D == "object" && C(D[X]) === "[object Object]" && (D[X] = "[object Object]");
    }
    if (typeof D == "object" && C(D) === "[object Object]" && (D = "[object Object]"), D = String(D), A === null && (A = {}), U === "tag:yaml.org,2002:merge")
      if (Array.isArray(Q))
        for (let X = 0, j = Q.length; X < j; X += 1)
          ht(g, A, Q[X], H);
      else
        ht(g, A, Q, H);
    else
      !g.json && !s.call(H, D) && s.call(A, D) && (g.line = S || g.line, g.lineStart = E || g.lineStart, g.position = K || g.position, $(g, "duplicated mapping key")), q(A, D, Q), delete H[D];
    return A;
  }
  p(kt, "storeMappingPair");
  function Mt(g) {
    const A = g.input.charCodeAt(g.position);
    A === 10 ? g.position++ : A === 13 ? (g.position++, g.input.charCodeAt(g.position) === 10 && g.position++) : $(g, "a line break is expected"), g.line += 1, g.lineStart = g.position, g.firstTabInLine = -1;
  }
  p(Mt, "readLineBreak");
  function Tt(g, A, H) {
    let U = 0, D = g.input.charCodeAt(g.position);
    for (; D !== 0; ) {
      for (; w(D); )
        D === 9 && g.firstTabInLine === -1 && (g.firstTabInLine = g.position), D = g.input.charCodeAt(++g.position);
      if (A && D === 35)
        do
          D = g.input.charCodeAt(++g.position);
        while (D !== 10 && D !== 13 && D !== 0);
      if (b(D))
        for (Mt(g), D = g.input.charCodeAt(g.position), U++, g.lineIndent = 0; D === 32; )
          g.lineIndent++, D = g.input.charCodeAt(++g.position);
      else
        break;
    }
    return H !== -1 && U !== 0 && g.lineIndent < H && P(g, "deficient indentation"), U;
  }
  p(Tt, "skipSeparationSpace");
  function jt(g) {
    let A = g.position, H = g.input.charCodeAt(A);
    return !!((H === 45 || H === 46) && H === g.input.charCodeAt(A + 1) && H === g.input.charCodeAt(A + 2) && (A += 3, H = g.input.charCodeAt(A), H === 0 || T(H)));
  }
  p(jt, "testDocumentSeparator");
  function qt(g, A) {
    A === 1 ? g.result += " " : A > 1 && (g.result += e.repeat(`
`, A - 1));
  }
  p(qt, "writeFoldedLines");
  function Pe(g, A, H) {
    let U, D, Q, S, E, K;
    const X = g.kind, j = g.result;
    let Z = g.input.charCodeAt(g.position);
    if (T(Z) || B(Z) || Z === 35 || Z === 38 || Z === 42 || Z === 33 || Z === 124 || Z === 62 || Z === 39 || Z === 34 || Z === 37 || Z === 64 || Z === 96)
      return !1;
    if (Z === 63 || Z === 45) {
      const G = g.input.charCodeAt(g.position + 1);
      if (T(G) || H && B(G))
        return !1;
    }
    for (g.kind = "scalar", g.result = "", U = D = g.position, Q = !1; Z !== 0; ) {
      if (Z === 58) {
        const G = g.input.charCodeAt(g.position + 1);
        if (T(G) || H && B(G))
          break;
      } else if (Z === 35) {
        const G = g.input.charCodeAt(g.position - 1);
        if (T(G))
          break;
      } else {
        if (g.position === g.lineStart && jt(g) || H && B(Z))
          break;
        if (b(Z))
          if (S = g.line, E = g.lineStart, K = g.lineIndent, Tt(g, !1, -1), g.lineIndent >= A) {
            Q = !0, Z = g.input.charCodeAt(g.position);
            continue;
          } else {
            g.position = D, g.line = S, g.lineStart = E, g.lineIndent = K;
            break;
          }
      }
      Q && (bt(g, U, D, !1), qt(g, g.line - S), U = D = g.position, Q = !1), w(Z) || (D = g.position + 1), Z = g.input.charCodeAt(++g.position);
    }
    return bt(g, U, D, !1), g.result ? !0 : (g.kind = X, g.result = j, !1);
  }
  p(Pe, "readPlainScalar");
  function vr(g, A) {
    let H, U, D = g.input.charCodeAt(g.position);
    if (D !== 39)
      return !1;
    for (g.kind = "scalar", g.result = "", g.position++, H = U = g.position; (D = g.input.charCodeAt(g.position)) !== 0; )
      if (D === 39)
        if (bt(g, H, g.position, !0), D = g.input.charCodeAt(++g.position), D === 39)
          H = g.position, g.position++, U = g.position;
        else
          return !0;
      else b(D) ? (bt(g, H, U, !0), qt(g, Tt(g, !1, A)), H = U = g.position) : g.position === g.lineStart && jt(g) ? $(g, "unexpected end of the document within a single quoted scalar") : (g.position++, w(D) || (U = g.position));
    $(g, "unexpected end of the stream within a single quoted scalar");
  }
  p(vr, "readSingleQuotedScalar");
  function Se(g, A) {
    let H, U, D, Q = g.input.charCodeAt(g.position);
    if (Q !== 34)
      return !1;
    for (g.kind = "scalar", g.result = "", g.position++, H = U = g.position; (Q = g.input.charCodeAt(g.position)) !== 0; ) {
      if (Q === 34)
        return bt(g, H, g.position, !0), g.position++, !0;
      if (Q === 92) {
        if (bt(g, H, g.position, !0), Q = g.input.charCodeAt(++g.position), b(Q))
          Tt(g, !1, A);
        else if (Q < 256 && J[Q])
          g.result += W[Q], g.position++;
        else if ((D = v(Q)) > 0) {
          let S = D, E = 0;
          for (; S > 0; S--)
            Q = g.input.charCodeAt(++g.position), (D = L(Q)) >= 0 ? E = (E << 4) + D : $(g, "expected hexadecimal character");
          g.result += N(E), g.position++;
        } else
          $(g, "unknown escape sequence");
        H = U = g.position;
      } else b(Q) ? (bt(g, H, U, !0), qt(g, Tt(g, !1, A)), H = U = g.position) : g.position === g.lineStart && jt(g) ? $(g, "unexpected end of the document within a double quoted scalar") : (g.position++, w(Q) || (U = g.position));
    }
    $(g, "unexpected end of the stream within a double quoted scalar");
  }
  p(Se, "readDoubleQuotedScalar");
  function ki(g, A) {
    let H = !0, U, D, Q;
    const S = g.tag;
    let E;
    const K = g.anchor;
    let X, j, Z, G;
    const nt = /* @__PURE__ */ Object.create(null);
    let it, ut, ft, _t = g.input.charCodeAt(g.position);
    if (_t === 91)
      X = 93, G = !1, E = [];
    else if (_t === 123)
      X = 125, G = !0, E = {};
    else
      return !1;
    for (g.anchor !== null && Y(g, g.anchor, E), _t = g.input.charCodeAt(++g.position); _t !== 0; ) {
      if (Tt(g, !0, A), _t = g.input.charCodeAt(g.position), _t === X)
        return g.position++, g.tag = S, g.anchor = K, g.kind = G ? "mapping" : "sequence", g.result = E, !0;
      if (H ? _t === 44 && $(g, "expected the node content, but found ','") : $(g, "missed comma between flow collection entries"), ut = it = ft = null, j = Z = !1, _t === 63) {
        const Ot = g.input.charCodeAt(g.position + 1);
        T(Ot) && (j = Z = !0, g.position++, Tt(g, !0, A));
      }
      U = g.line, D = g.lineStart, Q = g.position, pe(g, A, o, !1, !0), ut = g.tag, it = g.result, Tt(g, !0, A), _t = g.input.charCodeAt(g.position), (Z || g.line === U) && _t === 58 && (j = !0, _t = g.input.charCodeAt(++g.position), Tt(g, !0, A), pe(g, A, o, !1, !0), ft = g.result), G ? kt(g, E, nt, ut, it, ft, U, D, Q) : j ? E.push(kt(g, null, nt, ut, it, ft, U, D, Q)) : E.push(it), Tt(g, !0, A), _t = g.input.charCodeAt(g.position), _t === 44 ? (H = !0, _t = g.input.charCodeAt(++g.position)) : H = !1;
    }
    $(g, "unexpected end of the stream within a flow collection");
  }
  p(ki, "readFlowCollection");
  function wi(g, A) {
    let H, U = c, D = !1, Q = !1, S = A, E = 0, K = !1, X, j = g.input.charCodeAt(g.position);
    if (j === 124)
      H = !1;
    else if (j === 62)
      H = !0;
    else
      return !1;
    for (g.kind = "scalar", g.result = ""; j !== 0; )
      if (j = g.input.charCodeAt(++g.position), j === 43 || j === 45)
        c === U ? U = j === 43 ? d : h : $(g, "repeat of a chomping mode identifier");
      else if ((X = _(j)) >= 0)
        X === 0 ? $(g, "bad explicit indentation width of a block scalar; it cannot be less than one") : Q ? $(g, "repeat of an indentation width identifier") : (S = A + X - 1, Q = !0);
      else
        break;
    if (w(j)) {
      do
        j = g.input.charCodeAt(++g.position);
      while (w(j));
      if (j === 35)
        do
          j = g.input.charCodeAt(++g.position);
        while (!b(j) && j !== 0);
    }
    for (; j !== 0; ) {
      for (Mt(g), g.lineIndent = 0, j = g.input.charCodeAt(g.position); (!Q || g.lineIndent < S) && j === 32; )
        g.lineIndent++, j = g.input.charCodeAt(++g.position);
      if (!Q && g.lineIndent > S && (S = g.lineIndent), b(j)) {
        E++;
        continue;
      }
      if (!Q && S === 0 && $(g, "missing indentation for block scalar"), g.lineIndent < S) {
        U === d ? g.result += e.repeat(`
`, D ? 1 + E : E) : U === c && D && (g.result += `
`);
        break;
      }
      H ? w(j) ? (K = !0, g.result += e.repeat(`
`, D ? 1 + E : E)) : K ? (K = !1, g.result += e.repeat(`
`, E + 1)) : E === 0 ? D && (g.result += " ") : g.result += e.repeat(`
`, E) : g.result += e.repeat(`
`, D ? 1 + E : E), D = !0, Q = !0, E = 0;
      const Z = g.position;
      for (; !b(j) && j !== 0; )
        j = g.input.charCodeAt(++g.position);
      bt(g, Z, g.position, !1);
    }
    return !0;
  }
  p(wi, "readBlockScalar");
  function Te(g, A) {
    const H = g.tag, U = g.anchor, D = [];
    let Q = !1;
    if (g.firstTabInLine !== -1) return !1;
    g.anchor !== null && Y(g, g.anchor, D);
    let S = g.input.charCodeAt(g.position);
    for (; S !== 0 && (g.firstTabInLine !== -1 && (g.position = g.firstTabInLine, $(g, "tab characters must not be used in indentation")), S === 45); ) {
      const E = g.input.charCodeAt(g.position + 1);
      if (!T(E))
        break;
      if (Q = !0, g.position++, Tt(g, !0, -1) && g.lineIndent <= A) {
        D.push(null), S = g.input.charCodeAt(g.position);
        continue;
      }
      const K = g.line;
      if (pe(g, A, n, !1, !0), D.push(g.result), Tt(g, !0, -1), S = g.input.charCodeAt(g.position), (g.line === K || g.lineIndent > A) && S !== 0)
        $(g, "bad indentation of a sequence entry");
      else if (g.lineIndent < A)
        break;
    }
    return Q ? (g.tag = H, g.anchor = U, g.kind = "sequence", g.result = D, !0) : !1;
  }
  p(Te, "readBlockSequence");
  function Lr(g, A, H) {
    let U, D, Q, S;
    const E = g.tag, K = g.anchor, X = {}, j = /* @__PURE__ */ Object.create(null);
    let Z = null, G = null, nt = null, it = !1, ut = !1;
    if (g.firstTabInLine !== -1) return !1;
    g.anchor !== null && Y(g, g.anchor, X);
    let ft = g.input.charCodeAt(g.position);
    for (; ft !== 0; ) {
      !it && g.firstTabInLine !== -1 && (g.position = g.firstTabInLine, $(g, "tab characters must not be used in indentation"));
      const _t = g.input.charCodeAt(g.position + 1), Ot = g.line;
      if ((ft === 63 || ft === 58) && T(_t))
        ft === 63 ? (it && (kt(g, X, j, Z, G, null, D, Q, S), Z = G = nt = null), ut = !0, it = !0, U = !0) : it ? (it = !1, U = !0) : $(g, "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"), g.position += 1, ft = _t;
      else {
        if (D = g.line, Q = g.lineStart, S = g.position, !pe(g, H, a, !1, !0))
          break;
        if (g.line === Ot) {
          for (ft = g.input.charCodeAt(g.position); w(ft); )
            ft = g.input.charCodeAt(++g.position);
          if (ft === 58)
            ft = g.input.charCodeAt(++g.position), T(ft) || $(g, "a whitespace character is expected after the key-value separator within a block mapping"), it && (kt(g, X, j, Z, G, null, D, Q, S), Z = G = nt = null), ut = !0, it = !1, U = !1, Z = g.tag, G = g.result;
          else if (ut)
            $(g, "can not read an implicit mapping pair; a colon is missed");
          else
            return g.tag = E, g.anchor = K, !0;
        } else if (ut)
          $(g, "can not read a block mapping entry; a multiline key may not be an implicit key");
        else
          return g.tag = E, g.anchor = K, !0;
      }
      if ((g.line === Ot || g.lineIndent > A) && (it && (D = g.line, Q = g.lineStart, S = g.position), pe(g, A, l, !0, U) && (it ? G = g.result : nt = g.result), it || (kt(g, X, j, Z, G, nt, D, Q, S), Z = G = nt = null), Tt(g, !0, -1), ft = g.input.charCodeAt(g.position)), (g.line === Ot || g.lineIndent > A) && ft !== 0)
        $(g, "bad indentation of a mapping entry");
      else if (g.lineIndent < A)
        break;
    }
    return it && kt(g, X, j, Z, G, null, D, Q, S), ut && (g.tag = E, g.anchor = K, g.kind = "mapping", g.result = X), ut;
  }
  p(Lr, "readBlockMapping");
  function Si(g) {
    let A = !1, H = !1, U, D, Q = g.input.charCodeAt(g.position);
    if (Q !== 33) return !1;
    g.tag !== null && $(g, "duplication of a tag property"), Q = g.input.charCodeAt(++g.position), Q === 60 ? (A = !0, Q = g.input.charCodeAt(++g.position)) : Q === 33 ? (H = !0, U = "!!", Q = g.input.charCodeAt(++g.position)) : U = "!";
    let S = g.position;
    if (A) {
      do
        Q = g.input.charCodeAt(++g.position);
      while (Q !== 0 && Q !== 62);
      g.position < g.length ? (D = g.input.slice(S, g.position), Q = g.input.charCodeAt(++g.position)) : $(g, "unexpected end of the stream within a verbatim tag");
    } else {
      for (; Q !== 0 && !T(Q); )
        Q === 33 && (H ? $(g, "tag suffix cannot contain exclamation marks") : (U = g.input.slice(S - 1, g.position + 1), m.test(U) || $(g, "named tag handle cannot contain such characters"), H = !0, S = g.position + 1)), Q = g.input.charCodeAt(++g.position);
      D = g.input.slice(S, g.position), y.test(D) && $(g, "tag suffix cannot contain flow indicator characters");
    }
    D && !x.test(D) && $(g, "tag name cannot contain such characters: " + D);
    try {
      D = decodeURIComponent(D);
    } catch {
      $(g, "tag name is malformed: " + D);
    }
    return A ? g.tag = D : s.call(g.tagMap, U) ? g.tag = g.tagMap[U] + D : U === "!" ? g.tag = "!" + D : U === "!!" ? g.tag = "tag:yaml.org,2002:" + D : $(g, 'undeclared tag handle "' + U + '"'), !0;
  }
  p(Si, "readTagProperty");
  function Fr(g) {
    let A = g.input.charCodeAt(g.position);
    if (A !== 38) return !1;
    g.anchor !== null && $(g, "duplication of an anchor property"), A = g.input.charCodeAt(++g.position);
    const H = g.position;
    for (; A !== 0 && !T(A) && !B(A); )
      A = g.input.charCodeAt(++g.position);
    return g.position === H && $(g, "name of an anchor node must contain at least one character"), g.anchor = g.input.slice(H, g.position), !0;
  }
  p(Fr, "readAnchorProperty");
  function Ar(g) {
    let A = g.input.charCodeAt(g.position);
    if (A !== 42) return !1;
    A = g.input.charCodeAt(++g.position);
    const H = g.position;
    for (; A !== 0 && !T(A) && !B(A); )
      A = g.input.charCodeAt(++g.position);
    g.position === H && $(g, "name of an alias node must contain at least one character");
    const U = g.input.slice(H, g.position);
    return s.call(g.anchorMap, U) || $(g, 'unidentified alias "' + U + '"'), g.result = g.anchorMap[U], Tt(g, !0, -1), !0;
  }
  p(Ar, "readAlias");
  function Ti(g, A, H, U) {
    const D = Ft(g);
    return lt(g), mt(g, A), g.tag = null, g.anchor = null, g.kind = null, g.result = null, Lr(g, H, U) && g.kind === "mapping" ? (at(g), !0) : (Ct(g), mt(g, D), !1);
  }
  p(Ti, "tryReadBlockMappingFromProperty");
  function pe(g, A, H, U, D) {
    let Q, S, E = 1, K = !1, X = !1, j = null, Z, G, nt;
    g.depth >= g.maxDepth && $(g, "nesting exceeded maxDepth (" + g.maxDepth + ")"), g.depth += 1, g.listener !== null && g.listener("open", g), g.tag = null, g.anchor = null, g.kind = null, g.result = null;
    const it = Q = S = l === H || n === H;
    if (U && Tt(g, !0, -1) && (K = !0, g.lineIndent > A ? E = 1 : g.lineIndent === A ? E = 0 : g.lineIndent < A && (E = -1)), E === 1)
      for (; ; ) {
        const ut = g.input.charCodeAt(g.position), ft = Ft(g);
        if (K && (ut === 33 && g.tag !== null || ut === 38 && g.anchor !== null) || !Si(g) && !Fr(g))
          break;
        j === null && (j = ft), Tt(g, !0, -1) ? (K = !0, S = it, g.lineIndent > A ? E = 1 : g.lineIndent === A ? E = 0 : g.lineIndent < A && (E = -1)) : S = !1;
      }
    if (S && (S = K || D), E === 1 || l === H)
      if (o === H || a === H ? G = A : G = A + 1, nt = g.position - g.lineStart, E === 1)
        if (S && (Te(g, nt) || Lr(g, nt, G)) || ki(g, G))
          X = !0;
        else {
          const ut = g.input.charCodeAt(g.position);
          j !== null && it && !S && ut !== 124 && ut !== 62 && Ti(
            g,
            j,
            j.position - j.lineStart,
            G
          ) || Q && wi(g, G) || vr(g, G) || Se(g, G) ? X = !0 : Ar(g) ? (X = !0, (g.tag !== null || g.anchor !== null) && $(g, "alias node should not have any properties")) : Pe(g, G, o === H) && (X = !0, g.tag === null && (g.tag = "?")), g.anchor !== null && Y(g, g.anchor, g.result);
        }
      else E === 0 && (X = S && Te(g, nt));
    if (g.tag === null)
      g.anchor !== null && Y(g, g.anchor, g.result);
    else if (g.tag === "?") {
      g.result !== null && g.kind !== "scalar" && $(g, 'unacceptable node kind for !<?> tag; it should be "scalar", not "' + g.kind + '"');
      for (let ut = 0, ft = g.implicitTypes.length; ut < ft; ut += 1)
        if (Z = g.implicitTypes[ut], Z.resolve(g.result)) {
          g.result = Z.construct(g.result), g.tag = Z.tag, g.anchor !== null && Y(g, g.anchor, g.result);
          break;
        }
    } else if (g.tag !== "!") {
      if (s.call(g.typeMap[g.kind || "fallback"], g.tag))
        Z = g.typeMap[g.kind || "fallback"][g.tag];
      else {
        Z = null;
        const ut = g.typeMap.multi[g.kind || "fallback"];
        for (let ft = 0, _t = ut.length; ft < _t; ft += 1)
          if (g.tag.slice(0, ut[ft].tag.length) === ut[ft].tag) {
            Z = ut[ft];
            break;
          }
      }
      Z || $(g, "unknown tag !<" + g.tag + ">"), g.result !== null && Z.kind !== g.kind && $(g, "unacceptable node kind for !<" + g.tag + '> tag; it should be "' + Z.kind + '", not "' + g.kind + '"'), Z.resolve(g.result, g.tag) ? (g.result = Z.construct(g.result, g.tag), g.anchor !== null && Y(g, g.anchor, g.result)) : $(g, "cannot resolve a node with !<" + g.tag + "> explicit tag");
    }
    return g.listener !== null && g.listener("close", g), g.depth -= 1, g.tag !== null || g.anchor !== null || X;
  }
  p(pe, "composeNode");
  function Bi(g) {
    const A = g.position;
    let H = !1, U;
    for (g.version = null, g.checkLineBreaks = g.legacy, g.tagMap = /* @__PURE__ */ Object.create(null), g.anchorMap = /* @__PURE__ */ Object.create(null); (U = g.input.charCodeAt(g.position)) !== 0 && (Tt(g, !0, -1), U = g.input.charCodeAt(g.position), !(g.lineIndent > 0 || U !== 37)); ) {
      H = !0, U = g.input.charCodeAt(++g.position);
      let D = g.position;
      for (; U !== 0 && !T(U); )
        U = g.input.charCodeAt(++g.position);
      const Q = g.input.slice(D, g.position), S = [];
      for (Q.length < 1 && $(g, "directive name must not be less than one character in length"); U !== 0; ) {
        for (; w(U); )
          U = g.input.charCodeAt(++g.position);
        if (U === 35) {
          do
            U = g.input.charCodeAt(++g.position);
          while (U !== 0 && !b(U));
          break;
        }
        if (b(U)) break;
        for (D = g.position; U !== 0 && !T(U); )
          U = g.input.charCodeAt(++g.position);
        S.push(g.input.slice(D, g.position));
      }
      U !== 0 && Mt(g), s.call(St, Q) ? St[Q](g, Q, S) : P(g, 'unknown document directive "' + Q + '"');
    }
    if (Tt(g, !0, -1), g.lineIndent === 0 && g.input.charCodeAt(g.position) === 45 && g.input.charCodeAt(g.position + 1) === 45 && g.input.charCodeAt(g.position + 2) === 45 ? (g.position += 3, Tt(g, !0, -1)) : H && $(g, "directives end mark is expected"), pe(g, g.lineIndent - 1, l, !1, !0), Tt(g, !0, -1), g.checkLineBreaks && f.test(g.input.slice(A, g.position)) && P(g, "non-ASCII line breaks are interpreted as content"), g.documents.push(g.result), g.position === g.lineStart && jt(g)) {
      g.input.charCodeAt(g.position) === 46 && (g.position += 3, Tt(g, !0, -1));
      return;
    }
    g.position < g.length - 1 && $(g, "end of the stream or a document separator is expected");
  }
  p(Bi, "readDocument");
  function Er(g, A) {
    g = String(g), A = A || {}, g.length !== 0 && (g.charCodeAt(g.length - 1) !== 10 && g.charCodeAt(g.length - 1) !== 13 && (g += `
`), g.charCodeAt(0) === 65279 && (g = g.slice(1)));
    const H = new z(g, A), U = g.indexOf("\0");
    for (U !== -1 && (H.position = U, $(H, "null byte is not allowed in input")), H.input += "\0"; H.input.charCodeAt(H.position) === 32; )
      H.lineIndent += 1, H.position += 1;
    for (; H.position < H.length - 1; )
      Bi(H);
    return H.documents;
  }
  p(Er, "loadDocuments");
  function Mr(g, A, H) {
    A !== null && typeof A == "object" && typeof H > "u" && (H = A, A = null);
    const U = Er(g, H);
    if (typeof A != "function")
      return U;
    for (let D = 0, Q = U.length; D < Q; D += 1)
      A(U[D]);
  }
  p(Mr, "loadAll2");
  function _i(g, A) {
    const H = Er(g, A);
    if (H.length !== 0) {
      if (H.length === 1)
        return H[0];
      throw new t("expected a single document in the stream, but found more");
    }
  }
  return p(_i, "load2"), Os.loadAll = Mr, Os.load = _i, Os;
}
p(Ug, "requireLoader");
var Aa = {}, Jc;
function Gg() {
  if (Jc) return Aa;
  Jc = 1;
  const e = xi(), t = Ci(), r = No(), i = Object.prototype.toString, s = Object.prototype.hasOwnProperty, o = 65279, a = 9, n = 10, l = 13, c = 32, h = 33, d = 34, u = 35, f = 37, y = 38, m = 39, x = 42, C = 44, b = 45, w = 58, T = 61, B = 62, L = 63, v = 64, _ = 91, R = 93, N = 96, q = 123, J = 124, W = 125, z = {};
  z[0] = "\\0", z[7] = "\\a", z[8] = "\\b", z[9] = "\\t", z[10] = "\\n", z[11] = "\\v", z[12] = "\\f", z[13] = "\\r", z[27] = "\\e", z[34] = '\\"', z[92] = "\\\\", z[133] = "\\N", z[160] = "\\_", z[8232] = "\\L", z[8233] = "\\P";
  const V = [
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
  ], $ = /^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;
  function P(S, E) {
    if (E === null) return {};
    const K = {}, X = Object.keys(E);
    for (let j = 0, Z = X.length; j < Z; j += 1) {
      let G = X[j], nt = String(E[G]);
      G.slice(0, 2) === "!!" && (G = "tag:yaml.org,2002:" + G.slice(2));
      const it = S.compiledTypeMap.fallback[G];
      it && s.call(it.styleAliases, nt) && (nt = it.styleAliases[nt]), K[G] = nt;
    }
    return K;
  }
  p(P, "compileStyleMap");
  function Y(S) {
    let E, K;
    const X = S.toString(16).toUpperCase();
    if (S <= 255)
      E = "x", K = 2;
    else if (S <= 65535)
      E = "u", K = 4;
    else if (S <= 4294967295)
      E = "U", K = 8;
    else
      throw new t("code point within a string may not be greater than 0xFFFFFFFF");
    return "\\" + E + e.repeat("0", K - X.length) + X;
  }
  p(Y, "encodeHex");
  const lt = 1, at = 2;
  function Ct(S) {
    this.schema = S.schema || r, this.indent = Math.max(1, S.indent || 2), this.noArrayIndent = S.noArrayIndent || !1, this.skipInvalid = S.skipInvalid || !1, this.flowLevel = e.isNothing(S.flowLevel) ? -1 : S.flowLevel, this.styleMap = P(this.schema, S.styles || null), this.sortKeys = S.sortKeys || !1, this.lineWidth = S.lineWidth || 80, this.noRefs = S.noRefs || !1, this.noCompatMode = S.noCompatMode || !1, this.condenseFlow = S.condenseFlow || !1, this.quotingType = S.quotingType === '"' ? at : lt, this.forceQuotes = S.forceQuotes || !1, this.replacer = typeof S.replacer == "function" ? S.replacer : null, this.implicitTypes = this.schema.compiledImplicit, this.explicitTypes = this.schema.compiledExplicit, this.tag = null, this.result = "", this.duplicates = [], this.usedDuplicates = null;
  }
  p(Ct, "State");
  function Ft(S, E) {
    const K = e.repeat(" ", E);
    let X = 0, j = "";
    const Z = S.length;
    for (; X < Z; ) {
      let G;
      const nt = S.indexOf(`
`, X);
      nt === -1 ? (G = S.slice(X), X = Z) : (G = S.slice(X, nt + 1), X = nt + 1), G.length && G !== `
` && (j += K), j += G;
    }
    return j;
  }
  p(Ft, "indentString");
  function mt(S, E) {
    return `
` + e.repeat(" ", S.indent * E);
  }
  p(mt, "generateNextLine");
  function St(S, E) {
    for (let K = 0, X = S.implicitTypes.length; K < X; K += 1)
      if (S.implicitTypes[K].resolve(E))
        return !0;
    return !1;
  }
  p(St, "testImplicitResolving");
  function bt(S) {
    return S === c || S === a;
  }
  p(bt, "isWhitespace");
  function ht(S) {
    return S >= 32 && S <= 126 || S >= 161 && S <= 55295 && S !== 8232 && S !== 8233 || S >= 57344 && S <= 65533 && S !== o || S >= 65536 && S <= 1114111;
  }
  p(ht, "isPrintable");
  function kt(S) {
    return ht(S) && S !== o && // - b-char
    S !== l && S !== n;
  }
  p(kt, "isNsCharOrWhitespace");
  function Mt(S, E, K) {
    const X = kt(S), j = X && !bt(S);
    return (
      // ns-plain-safe
      (K ? X : X && // - c-flow-indicator
      S !== C && S !== _ && S !== R && S !== q && S !== W) && // ns-plain-char
      S !== u && // false on '#'
      !(E === w && !j) || // false on ': '
      kt(E) && !bt(E) && S === u || // change to true on '[^ ]#'
      E === w && j
    );
  }
  p(Mt, "isPlainSafe");
  function Tt(S) {
    return ht(S) && S !== o && !bt(S) && // - s-white
    // - (c-indicator ::=
    // “-” | “?” | “:” | “,” | “[” | “]” | “{” | “}”
    S !== b && S !== L && S !== w && S !== C && S !== _ && S !== R && S !== q && S !== W && // | “#” | “&” | “*” | “!” | “|” | “=” | “>” | “'” | “"”
    S !== u && S !== y && S !== x && S !== h && S !== J && S !== T && S !== B && S !== m && S !== d && // | “%” | “@” | “`”)
    S !== f && S !== v && S !== N;
  }
  p(Tt, "isPlainSafeFirst");
  function jt(S) {
    return !bt(S) && S !== w;
  }
  p(jt, "isPlainSafeLast");
  function qt(S, E) {
    const K = S.charCodeAt(E);
    let X;
    return K >= 55296 && K <= 56319 && E + 1 < S.length && (X = S.charCodeAt(E + 1), X >= 56320 && X <= 57343) ? (K - 55296) * 1024 + X - 56320 + 65536 : K;
  }
  p(qt, "codePointAt");
  function Pe(S) {
    return /^\n* /.test(S);
  }
  p(Pe, "needIndentIndicator");
  const vr = 1, Se = 2, ki = 3, wi = 4, Te = 5;
  function Lr(S, E, K, X, j, Z, G, nt) {
    let it, ut = 0, ft = null, _t = !1, Ot = !1;
    const Jl = X !== -1;
    let vi = -1, Li = Tt(qt(S, 0)) && jt(qt(S, S.length - 1));
    if (E || G)
      for (it = 0; it < S.length; ut >= 65536 ? it += 2 : it++) {
        if (ut = qt(S, it), !ht(ut))
          return Te;
        Li = Li && Mt(ut, ft, nt), ft = ut;
      }
    else {
      for (it = 0; it < S.length; ut >= 65536 ? it += 2 : it++) {
        if (ut = qt(S, it), ut === n)
          _t = !0, Jl && (Ot = Ot || // Foldable line = too long, and not more-indented.
          it - vi - 1 > X && S[vi + 1] !== " ", vi = it);
        else if (!ht(ut))
          return Te;
        Li = Li && Mt(ut, ft, nt), ft = ut;
      }
      Ot = Ot || Jl && it - vi - 1 > X && S[vi + 1] !== " ";
    }
    return !_t && !Ot ? Li && !G && !j(S) ? vr : Z === at ? Te : Se : K > 9 && Pe(S) ? Te : G ? Z === at ? Te : Se : Ot ? wi : ki;
  }
  p(Lr, "chooseScalarStyle");
  function Si(S, E, K, X, j) {
    S.dump = (function() {
      if (E.length === 0)
        return S.quotingType === at ? '""' : "''";
      if (!S.noCompatMode && (V.indexOf(E) !== -1 || $.test(E)))
        return S.quotingType === at ? '"' + E + '"' : "'" + E + "'";
      const Z = S.indent * Math.max(1, K), G = S.lineWidth === -1 ? -1 : Math.max(Math.min(S.lineWidth, 40), S.lineWidth - Z), nt = X || // No block styles in flow mode.
      S.flowLevel > -1 && K >= S.flowLevel;
      function it(ut) {
        return St(S, ut);
      }
      switch (p(it, "testAmbiguity"), Lr(
        E,
        nt,
        S.indent,
        G,
        it,
        S.quotingType,
        S.forceQuotes && !X,
        j
      )) {
        case vr:
          return E;
        case Se:
          return "'" + E.replace(/'/g, "''") + "'";
        case ki:
          return "|" + Fr(E, S.indent) + Ar(Ft(E, Z));
        case wi:
          return ">" + Fr(E, S.indent) + Ar(Ft(Ti(E, G), Z));
        case Te:
          return '"' + Bi(E) + '"';
        default:
          throw new t("impossible error: invalid scalar style");
      }
    })();
  }
  p(Si, "writeScalar");
  function Fr(S, E) {
    const K = Pe(S) ? String(E) : "", X = S[S.length - 1] === `
`, Z = X && (S[S.length - 2] === `
` || S === `
`) ? "+" : X ? "" : "-";
    return K + Z + `
`;
  }
  p(Fr, "blockHeader");
  function Ar(S) {
    return S[S.length - 1] === `
` ? S.slice(0, -1) : S;
  }
  p(Ar, "dropEndingNewline");
  function Ti(S, E) {
    const K = /(\n+)([^\n]*)/g;
    let X = (function() {
      let nt = S.indexOf(`
`);
      return nt = nt !== -1 ? nt : S.length, K.lastIndex = nt, pe(S.slice(0, nt), E);
    })(), j = S[0] === `
` || S[0] === " ", Z, G;
    for (; G = K.exec(S); ) {
      const nt = G[1], it = G[2];
      Z = it[0] === " ", X += nt + (!j && !Z && it !== "" ? `
` : "") + pe(it, E), j = Z;
    }
    return X;
  }
  p(Ti, "foldString");
  function pe(S, E) {
    if (S === "" || S[0] === " ") return S;
    const K = / [^ ]/g;
    let X, j = 0, Z, G = 0, nt = 0, it = "";
    for (; X = K.exec(S); )
      nt = X.index, nt - j > E && (Z = G > j ? G : nt, it += `
` + S.slice(j, Z), j = Z + 1), G = nt;
    return it += `
`, S.length - j > E && G > j ? it += S.slice(j, G) + `
` + S.slice(G + 1) : it += S.slice(j), it.slice(1);
  }
  p(pe, "foldLine");
  function Bi(S) {
    let E = "", K = 0;
    for (let X = 0; X < S.length; K >= 65536 ? X += 2 : X++) {
      K = qt(S, X);
      const j = z[K];
      !j && ht(K) ? (E += S[X], K >= 65536 && (E += S[X + 1])) : E += j || Y(K);
    }
    return E;
  }
  p(Bi, "escapeString");
  function Er(S, E, K) {
    let X = "";
    const j = S.tag;
    for (let Z = 0, G = K.length; Z < G; Z += 1) {
      let nt = K[Z];
      S.replacer && (nt = S.replacer.call(K, String(Z), nt)), (H(S, E, nt, !1, !1) || typeof nt > "u" && H(S, E, null, !1, !1)) && (X !== "" && (X += "," + (S.condenseFlow ? "" : " ")), X += S.dump);
    }
    S.tag = j, S.dump = "[" + X + "]";
  }
  p(Er, "writeFlowSequence");
  function Mr(S, E, K, X) {
    let j = "";
    const Z = S.tag;
    for (let G = 0, nt = K.length; G < nt; G += 1) {
      let it = K[G];
      S.replacer && (it = S.replacer.call(K, String(G), it)), (H(S, E + 1, it, !0, !0, !1, !0) || typeof it > "u" && H(S, E + 1, null, !0, !0, !1, !0)) && ((!X || j !== "") && (j += mt(S, E)), S.dump && n === S.dump.charCodeAt(0) ? j += "-" : j += "- ", j += S.dump);
    }
    S.tag = Z, S.dump = j || "[]";
  }
  p(Mr, "writeBlockSequence");
  function _i(S, E, K) {
    let X = "";
    const j = S.tag, Z = Object.keys(K);
    for (let G = 0, nt = Z.length; G < nt; G += 1) {
      let it = "";
      X !== "" && (it += ", "), S.condenseFlow && (it += '"');
      const ut = Z[G];
      let ft = K[ut];
      S.replacer && (ft = S.replacer.call(K, ut, ft)), H(S, E, ut, !1, !1) && (S.dump.length > 1024 && (it += "? "), it += S.dump + (S.condenseFlow ? '"' : "") + ":" + (S.condenseFlow ? "" : " "), H(S, E, ft, !1, !1) && (it += S.dump, X += it));
    }
    S.tag = j, S.dump = "{" + X + "}";
  }
  p(_i, "writeFlowMapping");
  function g(S, E, K, X) {
    let j = "";
    const Z = S.tag, G = Object.keys(K);
    if (S.sortKeys === !0)
      G.sort();
    else if (typeof S.sortKeys == "function")
      G.sort(S.sortKeys);
    else if (S.sortKeys)
      throw new t("sortKeys must be a boolean or a function");
    for (let nt = 0, it = G.length; nt < it; nt += 1) {
      let ut = "";
      (!X || j !== "") && (ut += mt(S, E));
      const ft = G[nt];
      let _t = K[ft];
      if (S.replacer && (_t = S.replacer.call(K, ft, _t)), !H(S, E + 1, ft, !0, !0, !0))
        continue;
      const Ot = S.tag !== null && S.tag !== "?" || S.dump && S.dump.length > 1024;
      Ot && (S.dump && n === S.dump.charCodeAt(0) ? ut += "?" : ut += "? "), ut += S.dump, Ot && (ut += mt(S, E)), H(S, E + 1, _t, !0, Ot) && (S.dump && n === S.dump.charCodeAt(0) ? ut += ":" : ut += ": ", ut += S.dump, j += ut);
    }
    S.tag = Z, S.dump = j || "{}";
  }
  p(g, "writeBlockMapping");
  function A(S, E, K) {
    const X = K ? S.explicitTypes : S.implicitTypes;
    for (let j = 0, Z = X.length; j < Z; j += 1) {
      const G = X[j];
      if ((G.instanceOf || G.predicate) && (!G.instanceOf || typeof E == "object" && E instanceof G.instanceOf) && (!G.predicate || G.predicate(E))) {
        if (K ? G.multi && G.representName ? S.tag = G.representName(E) : S.tag = G.tag : S.tag = "?", G.represent) {
          const nt = S.styleMap[G.tag] || G.defaultStyle;
          let it;
          if (i.call(G.represent) === "[object Function]")
            it = G.represent(E, nt);
          else if (s.call(G.represent, nt))
            it = G.represent[nt](E, nt);
          else
            throw new t("!<" + G.tag + '> tag resolver accepts not "' + nt + '" style');
          S.dump = it;
        }
        return !0;
      }
    }
    return !1;
  }
  p(A, "detectType");
  function H(S, E, K, X, j, Z, G) {
    S.tag = null, S.dump = K, A(S, K, !1) || A(S, K, !0);
    const nt = i.call(S.dump), it = X;
    X && (X = S.flowLevel < 0 || S.flowLevel > E);
    const ut = nt === "[object Object]" || nt === "[object Array]";
    let ft, _t;
    if (ut && (ft = S.duplicates.indexOf(K), _t = ft !== -1), (S.tag !== null && S.tag !== "?" || _t || S.indent !== 2 && E > 0) && (j = !1), _t && S.usedDuplicates[ft])
      S.dump = "*ref_" + ft;
    else {
      if (ut && _t && !S.usedDuplicates[ft] && (S.usedDuplicates[ft] = !0), nt === "[object Object]")
        X && Object.keys(S.dump).length !== 0 ? (g(S, E, S.dump, j), _t && (S.dump = "&ref_" + ft + S.dump)) : (_i(S, E, S.dump), _t && (S.dump = "&ref_" + ft + " " + S.dump));
      else if (nt === "[object Array]")
        X && S.dump.length !== 0 ? (S.noArrayIndent && !G && E > 0 ? Mr(S, E - 1, S.dump, j) : Mr(S, E, S.dump, j), _t && (S.dump = "&ref_" + ft + S.dump)) : (Er(S, E, S.dump), _t && (S.dump = "&ref_" + ft + " " + S.dump));
      else if (nt === "[object String]")
        S.tag !== "?" && Si(S, S.dump, E, Z, it);
      else {
        if (nt === "[object Undefined]")
          return !1;
        if (S.skipInvalid) return !1;
        throw new t("unacceptable kind of an object to dump " + nt);
      }
      if (S.tag !== null && S.tag !== "?") {
        let Ot = encodeURI(
          S.tag[0] === "!" ? S.tag.slice(1) : S.tag
        ).replace(/!/g, "%21");
        S.tag[0] === "!" ? Ot = "!" + Ot : Ot.slice(0, 18) === "tag:yaml.org,2002:" ? Ot = "!!" + Ot.slice(18) : Ot = "!<" + Ot + ">", S.dump = Ot + " " + S.dump;
      }
    }
    return !0;
  }
  p(H, "writeNode");
  function U(S, E) {
    const K = [], X = [];
    D(S, K, X);
    const j = X.length;
    for (let Z = 0; Z < j; Z += 1)
      E.duplicates.push(K[X[Z]]);
    E.usedDuplicates = new Array(j);
  }
  p(U, "getDuplicateReferences");
  function D(S, E, K) {
    if (S !== null && typeof S == "object") {
      const X = E.indexOf(S);
      if (X !== -1)
        K.indexOf(X) === -1 && K.push(X);
      else if (E.push(S), Array.isArray(S))
        for (let j = 0, Z = S.length; j < Z; j += 1)
          D(S[j], E, K);
      else {
        const j = Object.keys(S);
        for (let Z = 0, G = j.length; Z < G; Z += 1)
          D(S[j[Z]], E, K);
      }
    }
  }
  p(D, "inspectNode");
  function Q(S, E) {
    E = E || {};
    const K = new Ct(E);
    K.noRefs || U(S, K);
    let X = S;
    return K.replacer && (X = K.replacer.call({ "": X }, "", X)), H(K, 0, X, !0, !0) ? K.dump + `
` : "";
  }
  return p(Q, "dump2"), Aa.dump = Q, Aa;
}
p(Gg, "requireDumper");
var td;
function Vg() {
  if (td) return Ut;
  td = 1;
  const e = Ug(), t = Gg();
  function r(i, s) {
    return function() {
      throw new Error("Function yaml." + i + " is removed in js-yaml 4. Use yaml." + s + " instead, which is now safe by default.");
    };
  }
  return p(r, "renamed"), Ut.Type = Qt(), Ut.Schema = _l(), Ut.FAILSAFE_SCHEMA = Al(), Ut.JSON_SCHEMA = Il(), Ut.CORE_SCHEMA = Dl(), Ut.DEFAULT_SCHEMA = No(), Ut.load = e.load, Ut.loadAll = e.loadAll, Ut.dump = t.dump, Ut.YAMLException = Ci(), Ut.types = {
    binary: ql(),
    float: Ol(),
    map: Fl(),
    null: El(),
    pairs: Wl(),
    set: zl(),
    timestamp: Pl(),
    bool: Ml(),
    int: $l(),
    merge: Rl(),
    omap: Nl(),
    seq: Ll(),
    str: vl()
  }, Ut.safeLoad = r("safeLoad", "load"), Ut.safeLoadAll = r("safeLoadAll", "loadAll"), Ut.safeDump = r("safeDump", "dump"), Ut;
}
p(Vg, "requireJsYaml");
var sT = Vg(), oT = /* @__PURE__ */ Xg(sT), {
  Type: $F,
  Schema: OF,
  FAILSAFE_SCHEMA: IF,
  JSON_SCHEMA: aT,
  CORE_SCHEMA: DF,
  DEFAULT_SCHEMA: PF,
  load: nT,
  loadAll: RF,
  dump: qF,
  YAMLException: NF,
  types: WF,
  safeLoad: zF,
  safeLoadAll: HF,
  safeDump: YF
} = oT, lT = {
  common: fs,
  getConfig: Dt,
  insertCluster: xg,
  insertEdge: kg,
  insertEdgeLabel: Bl,
  insertMarkers: Tg,
  insertNode: Tl,
  interpolateToCurve: el,
  labelHelper: ct,
  log: M,
  positionEdgeLabel: kS
}, ns = {}, Kg = /* @__PURE__ */ p((e) => {
  for (const t of e)
    ns[t.name] = t;
}, "registerLayoutLoaders"), hT = /* @__PURE__ */ p(() => {
  Kg([
    {
      name: "dagre",
      loader: /* @__PURE__ */ p(async () => await import("./dagre-GXQ25YYZ-Cs11ZYch.js"), "loader")
    },
    {
      name: "swimlane",
      loader: /* @__PURE__ */ p(async () => await import("./swimlanes-42K2YHIH-Be5QXT0g.js"), "loader")
    },
    {
      name: "cose-bilkent",
      loader: /* @__PURE__ */ p(async () => await import("./cose-bilkent-JH36ORCC-C4t7AdxV.js"), "loader")
    }
  ]);
}, "registerDefaultLayoutLoaders");
hT();
var XF = /* @__PURE__ */ p(async (e, t) => {
  if (!(e.layoutAlgorithm in ns))
    throw new Error(`Unknown layout algorithm: ${e.layoutAlgorithm}`);
  if (e.diagramId)
    for (const h of e.nodes) {
      const d = h.domId || h.id;
      h.domId = `${e.diagramId}-${d}`;
    }
  const r = ns[e.layoutAlgorithm], i = await r.loader(), { theme: s, themeVariables: o } = e.config, { useGradient: a, gradientStart: n, gradientStop: l } = o, c = t.attr("id");
  if (t.append("defs").append("filter").attr("id", `${c}-drop-shadow`).attr("height", "130%").attr("width", "130%").append("feDropShadow").attr("dx", "4").attr("dy", "4").attr("stdDeviation", 0).attr("flood-opacity", "0.06").attr("flood-color", `${s?.includes("dark") ? "#FFFFFF" : "#000000"}`), t.append("defs").append("filter").attr("id", `${c}-drop-shadow-small`).attr("height", "150%").attr("width", "150%").append("feDropShadow").attr("dx", "2").attr("dy", "2").attr("stdDeviation", 0).attr("flood-opacity", "0.06").attr("flood-color", `${s?.includes("dark") ? "#FFFFFF" : "#000000"}`), a) {
    const h = t.append("linearGradient").attr("id", t.attr("id") + "-gradient").attr("gradientUnits", "objectBoundingBox").attr("x1", "0%").attr("y1", "0%").attr("x2", "100%").attr("y2", "0%");
    h.append("svg:stop").attr("offset", "0%").attr("stop-color", n).attr("stop-opacity", 1), h.append("svg:stop").attr("offset", "100%").attr("stop-color", l).attr("stop-opacity", 1);
  }
  return i.render(e, t, lT, {
    algorithm: r.algorithm
  });
}, "render"), jF = /* @__PURE__ */ p((e = "", { fallback: t = "dagre" } = {}) => {
  if (e in ns)
    return e;
  if (t in ns)
    return M.warn(`Layout algorithm ${e} is not registered. Using ${t} as fallback.`), t;
  throw new Error(`Both layout algorithms ${e} and ${t} are not registered.`);
}, "getRegisteredLayoutAlgorithm"), Hl = "comm", Zg = "rule", Qg = "decl", cT = "@media", dT = "@import", uT = "@supports", fT = "@namespace", Cn = "@keyframes", Jg = "@layer", pT = "@scope", gT = Math.abs, Ji = String.fromCharCode;
function ty(e) {
  return e.trim();
}
function bn(e, t, r) {
  return e.replace(t, r);
}
function Xr(e, t) {
  return e.charCodeAt(t) | 0;
}
function fi(e, t, r) {
  return e.slice(t, r);
}
function Le(e) {
  return e.length;
}
function ey(e) {
  return e.length;
}
function Is(e, t) {
  return t.push(e), e;
}
var Wo = 1, pi = 1, ry = 0, ce = 0, Nt = 0, bi = "";
function Yl(e, t, r, i, s, o, a, n) {
  return { value: e, root: t, parent: r, type: i, props: s, children: o, line: Wo, column: pi, length: a, return: "", siblings: n };
}
function yT() {
  return Nt;
}
function mT() {
  return Nt = ce > 0 ? Xr(bi, --ce) : 0, pi--, Nt === 10 && (pi = 1, Wo--), Nt;
}
function Ce() {
  return Nt = ce < ry ? Xr(bi, ce++) : 0, pi++, Nt === 10 && (pi = 1, Wo++), Nt;
}
function Qe() {
  return Xr(bi, ce);
}
function Us() {
  return ce;
}
function zo(e, t) {
  return fi(bi, e, t);
}
function ls(e) {
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
function xT(e) {
  return Wo = pi = 1, ry = Le(bi = e), ce = 0, [];
}
function CT(e) {
  return bi = "", e;
}
function Ea(e) {
  return ty(zo(ce - 1, kn(e === 91 ? e + 2 : e === 40 ? e + 1 : e)));
}
function bT(e) {
  for (; (Nt = Qe()) && Nt < 33; )
    Ce();
  return ls(e) > 2 || ls(Nt) > 3 ? "" : " ";
}
function kT(e, t) {
  for (; --t && Ce() && !(Nt < 48 || Nt > 102 || Nt > 57 && Nt < 65 || Nt > 70 && Nt < 97); )
    ;
  return zo(e, Us() + (t < 6 && Qe() == 32 && Ce() == 32));
}
function kn(e) {
  for (; Ce(); )
    switch (Nt) {
      // ] ) " '
      case e:
        return ce;
      // " '
      case 34:
      case 39:
        e !== 34 && e !== 39 && kn(Nt);
        break;
      // (
      case 40:
        e === 41 && kn(e);
        break;
      // \
      case 92:
        Ce();
        break;
    }
  return ce;
}
function wT(e, t) {
  for (; Ce() && e + Nt !== 57; )
    if (e + Nt === 84 && Qe() === 47)
      break;
  return "/*" + zo(t, ce - 1) + "*" + Ji(e === 47 ? e : Ce());
}
function ST(e) {
  for (; !ls(Qe()); )
    Ce();
  return zo(e, ce);
}
function TT(e) {
  return CT(Gs("", null, null, null, [""], e = xT(e), 0, [0], e));
}
function Gs(e, t, r, i, s, o, a, n, l) {
  for (var c = 0, h = 0, d = a, u = 0, f = 0, y = 0, m = 1, x = 1, C = 1, b = 0, w = 0, T = "", B = s, L = o, v = i, _ = T; x; )
    switch (y = w, w = Ce()) {
      // (
      case 40:
        y != 108 && Xr(_, d - 1) == 58 ? (b++, _ += "(") : _ += Ea(w);
        break;
      // )
      case 41:
        b--, _ += ")";
        break;
      // " ' [
      case 34:
      case 39:
      case 91:
        _ += Ea(w);
        break;
      // \t \n \r \s
      case 9:
      case 10:
      case 13:
      case 32:
        if (b > 0) {
          _ += Ji(w);
          break;
        }
        _ += bT(y);
        break;
      // \
      case 92:
        _ += kT(Us() - 1, 7);
        continue;
      // /
      case 47:
        switch (Qe()) {
          case 42:
          case 47:
            Is(BT(wT(Ce(), Us()), t, r, l), l), (ls(y || 1) == 5 || ls(Qe() || 1) == 5) && Le(_) && fi(_, -1, void 0) !== " " && (_ += " ");
            break;
          default:
            _ += "/";
        }
        break;
      // {
      case 123 * m:
        n[c++] = Le(_) * C;
      // } ; \0
      case 125 * m:
      case 59:
      case 0:
        if (b > 0 && w) {
          _ += Ji(w);
          break;
        }
        switch (w) {
          // \0 }
          case 0:
          case 125:
            x = 0;
          // ;
          case 59 + h:
            C == -1 && (_ = bn(_, /\f/g, "")), f > 0 && (Le(_) - d || m === 0) && Is(f > 32 ? rd(_ + ";", i, r, d - 1, l) : rd(bn(_, " ", "") + ";", i, r, d - 2, l), l);
            break;
          // @ ;
          case 59:
            _ += ";";
          // { rule/at-rule
          default:
            if (Is(v = ed(_, t, r, c, h, s, n, T, B = [], L = [], d, o), o), w === 123)
              if (h === 0)
                Gs(_, t, v, v, B, o, d, n, L);
              else {
                switch (u) {
                  // c(ontainer)
                  case 99:
                    if (Xr(_, 3) === 110) break;
                  // l(ayer)
                  case 108:
                    if (Xr(_, 2) === 97) break;
                  default:
                    h = 0;
                  // d(ocument) m(edia) s(upports)
                  case 100:
                  case 109:
                  case 115:
                }
                h ? Gs(e, v, v, i && Is(ed(e, v, v, 0, 0, s, n, T, s, B = [], d, L), L), s, L, d, n, i ? B : L) : Gs(_, v, v, v, [""], L, 0, n, L);
              }
        }
        c = h = f = 0, m = C = 1, T = _ = "", d = a;
        break;
      // :
      case 58:
        d = 1 + Le(_), f = y;
      default:
        if (m < 1) {
          if (w == 123)
            --m;
          else if (w == 125 && m++ == 0 && mT() == 125)
            continue;
        }
        switch (_ += Ji(w), w * m) {
          // &
          case 38:
            C = h > 0 ? 1 : (_ += "\f", -1);
            break;
          // ,
          case 44:
            if (b > 0) break;
            n[c++] = (Le(_) - 1) * C, C = 1;
            break;
          // @
          case 64:
            Qe() === 45 && (_ += Ea(Ce())), u = Qe(), h = d = Le(T = _ += ST(Us())), w++;
            break;
          // -
          case 45:
            y === 45 && Le(_) == 2 && (m = 0);
        }
    }
  return o;
}
function ed(e, t, r, i, s, o, a, n, l, c, h, d) {
  for (var u = s - 1, f = s === 0 ? o : [""], y = ey(f), m = 0, x = 0, C = 0; m < i; ++m)
    for (var b = 0, w = fi(e, u + 1, u = gT(x = a[m])), T = e; b < y; ++b)
      (T = ty(x > 0 ? f[b] + " " + w : bn(w, /&\f/g, f[b]))) && (l[C++] = T);
  return Yl(e, t, r, s === 0 ? Zg : n, l, c, h, d);
}
function BT(e, t, r, i) {
  return Yl(e, t, r, Hl, Ji(yT()), fi(e, 2, -2), 0, i);
}
function rd(e, t, r, i, s) {
  return Yl(e, t, r, Qg, fi(e, 0, i), fi(e, i + 1, -1), i, s);
}
function wn(e, t) {
  for (var r = "", i = 0; i < e.length; i++)
    r += t(e[i], i, e, t) || "";
  return r;
}
function _T(e, t, r, i) {
  switch (e.type) {
    case Jg:
      if (e.children.length) break;
    case dT:
    case fT:
    case Qg:
      return e.return = e.return || e.value;
    case Hl:
      return "";
    case Cn:
      return e.return = e.value + "{" + wn(e.children, i) + "}";
    case Zg:
      if (!Le(e.value = e.props.join(","))) return "";
  }
  return Le(r = wn(e.children, i)) ? e.return = e.value + "{" + r + "}" : "";
}
function vT(e) {
  var t = ey(e);
  return function(r, i, s, o) {
    for (var a = "", n = 0; n < t; n++)
      a += e[n](r, i, s, o) || "";
    return a;
  };
}
var iy = "c4", LT = /* @__PURE__ */ p((e) => /^\s*C4Context|C4Container|C4Component|C4Dynamic|C4Deployment/.test(e), "detector"), FT = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./c4Diagram-7LVT6UL2-D7NqJYcw.js");
  return { id: iy, diagram: e };
}, "loader"), AT = {
  id: iy,
  detector: LT,
  loader: FT
}, ET = AT, sy = "flowchart", MT = /* @__PURE__ */ p((e, t) => t?.flowchart?.defaultRenderer === "dagre-wrapper" || t?.flowchart?.defaultRenderer === "elk" ? !1 : /^\s*graph/.test(e), "detector"), $T = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./flowDiagram-HODETNUW-LqUCCqKT.js");
  return { id: sy, diagram: e };
}, "loader"), OT = {
  id: sy,
  detector: MT,
  loader: $T
}, IT = OT, oy = "flowchart-v2", DT = /* @__PURE__ */ p((e, t) => t?.flowchart?.defaultRenderer === "dagre-d3" ? !1 : (t?.flowchart?.defaultRenderer === "elk" && (t.layout = "elk"), /^\s*graph/.test(e) && t?.flowchart?.defaultRenderer === "dagre-wrapper" ? !0 : /^\s*flowchart/.test(e)), "detector"), PT = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./flowDiagram-HODETNUW-LqUCCqKT.js");
  return { id: oy, diagram: e };
}, "loader"), RT = {
  id: oy,
  detector: DT,
  loader: PT
}, qT = RT, ay = "swimlane", NT = /* @__PURE__ */ p((e) => /^\s*swimlane-beta\b/.test(e), "detector"), WT = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./swimlanesDiagram-VR7AAH4N-BmOq7IbJ.js");
  return { id: ay, diagram: e };
}, "loader"), zT = {
  id: ay,
  detector: NT,
  loader: WT
}, HT = zT, ny = "er", YT = /* @__PURE__ */ p((e) => /^\s*erDiagram/.test(e), "detector"), XT = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./erDiagram-RLTQ6QDP-BYbrlk1n.js");
  return { id: ny, diagram: e };
}, "loader"), jT = {
  id: ny,
  detector: YT,
  loader: XT
}, UT = jT, ly = "gitGraph", GT = /* @__PURE__ */ p((e) => /^\s*gitGraph/.test(e), "detector"), VT = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./gitGraphDiagram-WWUBYQGX-HjRMJny6.js");
  return { id: ly, diagram: e };
}, "loader"), KT = {
  id: ly,
  detector: GT,
  loader: VT
}, ZT = KT, hy = "gantt", QT = /* @__PURE__ */ p((e) => /^\s*gantt/.test(e), "detector"), JT = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./ganttDiagram-EL5Y4UJY-Dw3NopPq.js");
  return { id: hy, diagram: e };
}, "loader"), tB = {
  id: hy,
  detector: QT,
  loader: JT
}, eB = tB, cy = "info", rB = /* @__PURE__ */ p((e) => /^\s*info/.test(e), "detector"), iB = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./infoDiagram-27XIBGKW-Bc5KQKt3.js");
  return { id: cy, diagram: e };
}, "loader"), sB = {
  id: cy,
  detector: rB,
  loader: iB
}, dy = "pie", oB = /* @__PURE__ */ p((e) => /^\s*pie/.test(e), "detector"), aB = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./pieDiagram-E7YTZNPT-Db6q8y0g.js");
  return { id: dy, diagram: e };
}, "loader"), nB = {
  id: dy,
  detector: oB,
  loader: aB
}, uy = "quadrantChart", lB = /* @__PURE__ */ p((e) => /^\s*quadrantChart/.test(e), "detector"), hB = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./quadrantDiagram-AXDQQJYC-Id-Nbum4.js");
  return { id: uy, diagram: e };
}, "loader"), cB = {
  id: uy,
  detector: lB,
  loader: hB
}, dB = cB, fy = "xychart", uB = /* @__PURE__ */ p((e) => /^\s*xychart(-beta)?/.test(e), "detector"), fB = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./xychartDiagram-S5SC5T6Z-Cf3tifEK.js");
  return { id: fy, diagram: e };
}, "loader"), pB = {
  id: fy,
  detector: uB,
  loader: fB
}, gB = pB, py = "requirement", yB = /* @__PURE__ */ p((e) => /^\s*requirement(Diagram)?/.test(e), "detector"), mB = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./requirementDiagram-BXWQKSXE-gttoVlde.js");
  return { id: py, diagram: e };
}, "loader"), xB = {
  id: py,
  detector: yB,
  loader: mB
}, CB = xB, gy = "sequence", bB = /* @__PURE__ */ p((e) => /^\s*sequenceDiagram/.test(e), "detector"), kB = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./sequenceDiagram-WJ2MYXX4-BF3gMLXV.js");
  return { id: gy, diagram: e };
}, "loader"), wB = {
  id: gy,
  detector: bB,
  loader: kB
}, SB = wB, yy = "class", TB = /* @__PURE__ */ p((e, t) => t?.class?.defaultRenderer === "dagre-wrapper" ? !1 : /^\s*classDiagram/.test(e), "detector"), BB = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./classDiagram-ZZMXUADV-Bfu1yvTX.js");
  return { id: yy, diagram: e };
}, "loader"), _B = {
  id: yy,
  detector: TB,
  loader: BB
}, vB = _B, my = "classDiagram", LB = /* @__PURE__ */ p((e, t) => /^\s*classDiagram/.test(e) && t?.class?.defaultRenderer === "dagre-wrapper" ? !0 : /^\s*classDiagram-v2/.test(e), "detector"), FB = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./classDiagram-v2-VYDZK3BY-Bfu1yvTX.js");
  return { id: my, diagram: e };
}, "loader"), AB = {
  id: my,
  detector: LB,
  loader: FB
}, EB = AB, xy = "state", MB = /* @__PURE__ */ p((e, t) => t?.state?.defaultRenderer === "dagre-wrapper" ? !1 : /^\s*stateDiagram/.test(e), "detector"), $B = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./stateDiagram-D77RDMKH-CQqVNBi8.js");
  return { id: xy, diagram: e };
}, "loader"), OB = {
  id: xy,
  detector: MB,
  loader: $B
}, IB = OB, Cy = "stateDiagram", DB = /* @__PURE__ */ p((e, t) => !!(/^\s*stateDiagram-v2/.test(e) || /^\s*stateDiagram/.test(e) && t?.state?.defaultRenderer === "dagre-wrapper"), "detector"), PB = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./stateDiagram-v2-MP3YSRHH-DUkoVn31.js");
  return { id: Cy, diagram: e };
}, "loader"), RB = {
  id: Cy,
  detector: DB,
  loader: PB
}, qB = RB, by = "journey", NB = /* @__PURE__ */ p((e) => /^\s*journey/.test(e), "detector"), WB = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./journeyDiagram-3NMN7TZE-Dyeo4l9Y.js");
  return { id: by, diagram: e };
}, "loader"), zB = {
  id: by,
  detector: NB,
  loader: WB
}, HB = zB, YB = /* @__PURE__ */ p((e, t, r) => {
  M.debug(`rendering svg for syntax error
`);
  const i = Kk(t), s = i.append("g");
  i.attr("viewBox", "0 0 2412 512"), Kd(i, 100, 512, !0), s.append("path").attr("class", "error-icon").attr(
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
}, "draw"), ky = { draw: YB }, XB = ky, jB = {
  db: {},
  renderer: ky,
  parser: {
    parse: /* @__PURE__ */ p(() => {
    }, "parse")
  }
}, UB = jB, wy = "flowchart-elk", GB = /* @__PURE__ */ p((e, t = {}) => (
  // If diagram explicitly states flowchart-elk
  /^\s*flowchart-elk/.test(e) || // If a flowchart/graph diagram has their default renderer set to elk
  /^\s*(flowchart|graph)/.test(e) && t?.flowchart?.defaultRenderer === "elk" ? (t.layout = "elk", !0) : !1
), "detector"), VB = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./flowDiagram-HODETNUW-LqUCCqKT.js");
  return { id: wy, diagram: e };
}, "loader"), KB = {
  id: wy,
  detector: GB,
  loader: VB
}, ZB = KB, Sy = "timeline", QB = /* @__PURE__ */ p((e) => /^\s*timeline/.test(e), "detector"), JB = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./timeline-definition-24CTP7MA-BWRk_rkg.js");
  return { id: Sy, diagram: e };
}, "loader"), t_ = {
  id: Sy,
  detector: QB,
  loader: JB
}, e_ = t_, Ty = "mindmap", r_ = /* @__PURE__ */ p((e) => /^\s*mindmap/.test(e), "detector"), i_ = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./mindmap-definition-YA3MSWOX-DSK042d8.js");
  return { id: Ty, diagram: e };
}, "loader"), s_ = {
  id: Ty,
  detector: r_,
  loader: i_
}, o_ = s_, By = "kanban", a_ = /* @__PURE__ */ p((e) => /^\s*kanban/.test(e), "detector"), n_ = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./kanban-definition-UXKFOSKX-DUKLl2tv.js");
  return { id: By, diagram: e };
}, "loader"), l_ = {
  id: By,
  detector: a_,
  loader: n_
}, h_ = l_, _y = "sankey", c_ = /* @__PURE__ */ p((e) => /^\s*sankey(-beta)?/.test(e), "detector"), d_ = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./sankeyDiagram-P5KCCOFB-DkJ3bdP_.js");
  return { id: _y, diagram: e };
}, "loader"), u_ = {
  id: _y,
  detector: c_,
  loader: d_
}, f_ = u_, vy = "packet", p_ = /* @__PURE__ */ p((e) => /^\s*packet(-beta)?/.test(e), "detector"), g_ = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./diagram-Z3DM3KII-CUGvzuE9.js");
  return { id: vy, diagram: e };
}, "loader"), y_ = {
  id: vy,
  detector: p_,
  loader: g_
}, Ly = "radar", m_ = /* @__PURE__ */ p((e) => /^\s*radar-beta/.test(e), "detector"), x_ = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./diagram-UQ7AKVKN-KzXa6dwV.js");
  return { id: Ly, diagram: e };
}, "loader"), C_ = {
  id: Ly,
  detector: m_,
  loader: x_
}, Fy = "block", b_ = /* @__PURE__ */ p((e) => /^\s*block(-beta)?/.test(e), "detector"), k_ = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./blockDiagram-I7D4REHJ-DPtKYm36.js");
  return { id: Fy, diagram: e };
}, "loader"), w_ = {
  id: Fy,
  detector: b_,
  loader: k_
}, S_ = w_, Ay = "treeView", T_ = /* @__PURE__ */ p((e) => /^\s*treeView-beta/.test(e), "detector"), B_ = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./diagram-S7CK7UJ4-4s6F2yHO.js");
  return { id: Ay, diagram: e };
}, "loader"), __ = {
  id: Ay,
  detector: T_,
  loader: B_
}, v_ = __, Ey = "architecture", L_ = /* @__PURE__ */ p((e) => /^\s*architecture/.test(e), "detector"), F_ = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./architectureDiagram-5GKGNRK7-Dr3ufEgd.js");
  return { id: Ey, diagram: e };
}, "loader"), A_ = {
  id: Ey,
  detector: L_,
  loader: F_
}, E_ = A_, My = "eventmodeling", M_ = /* @__PURE__ */ p((e) => /^\s*eventmodeling/.test(e), "detector"), $_ = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./diagram-VSXAHHWV-DPbWpy2C.js");
  return { id: My, diagram: e };
}, "loader"), O_ = {
  id: My,
  detector: M_,
  loader: $_
}, I_ = O_, $y = "ishikawa", D_ = /* @__PURE__ */ p((e) => /^\s*ishikawa(-beta)?\b/i.test(e), "detector"), P_ = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./ishikawaDiagram-5VMMS53U-IkZYPj1T.js");
  return { id: $y, diagram: e };
}, "loader"), R_ = {
  id: $y,
  detector: D_,
  loader: P_
}, Oy = "venn", q_ = /* @__PURE__ */ p((e) => /^\s*venn-beta/.test(e), "detector"), N_ = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./vennDiagram-4TSXK5OY-CQIVPdRk.js");
  return { id: Oy, diagram: e };
}, "loader"), W_ = {
  id: Oy,
  detector: q_,
  loader: N_
}, z_ = W_, Iy = "treemap", H_ = /* @__PURE__ */ p((e) => /^\s*treemap/.test(e), "detector"), Y_ = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./diagram-VX7I27RA-aM7aEWBO.js");
  return { id: Iy, diagram: e };
}, "loader"), X_ = {
  id: Iy,
  detector: H_,
  loader: Y_
}, Dy = "wardley", j_ = /* @__PURE__ */ p((e) => /^\s*wardley-beta/i.test(e), "detector"), U_ = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./wardleyDiagram-VM6X3IG4-DRi1sFyK.js");
  return { id: Dy, diagram: e };
}, "loader"), G_ = {
  id: Dy,
  detector: j_,
  loader: U_
}, V_ = G_, Py = "cynefin", K_ = /* @__PURE__ */ p((e) => /^\s*cynefin-beta(?:[\s:]|$)/.test(e), "detector"), Z_ = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./cynefinDiagram-5FMLGOSQ-CZp1SRue.js");
  return { id: Py, diagram: e };
}, "loader"), Q_ = {
  id: Py,
  detector: K_,
  loader: Z_
}, Ry = "railroad", J_ = /* @__PURE__ */ p((e) => /^\s*railroad-beta/i.test(e), "detector"), tv = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./railroadDiagram-O6MQD6OU-Du3ZBw10.js");
  return { id: Ry, diagram: e };
}, "loader"), ev = {
  id: Ry,
  detector: J_,
  loader: tv
}, qy = "railroadEbnf", rv = /* @__PURE__ */ p((e) => /^\s*railroad-ebnf-beta/i.test(e), "detector"), iv = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./ebnfDiagram-PWID7BFC-BpWEiuX2.js");
  return { id: qy, diagram: e };
}, "loader"), sv = {
  id: qy,
  detector: rv,
  loader: iv
}, Ny = "railroadAbnf", ov = /* @__PURE__ */ p((e) => /^\s*railroad-abnf-beta/i.test(e), "detector"), av = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./abnfDiagram-VCTEODGH-BrkrHoBm.js");
  return { id: Ny, diagram: e };
}, "loader"), nv = {
  id: Ny,
  detector: ov,
  loader: av
}, Wy = "railroadPeg", lv = /* @__PURE__ */ p((e) => /^\s*railroad-peg-beta/i.test(e), "detector"), hv = /* @__PURE__ */ p(async () => {
  const { diagram: e } = await import("./pegDiagram-XKGWAZYB-CNb-fhzF.js");
  return { id: Wy, diagram: e };
}, "loader"), cv = {
  id: Wy,
  detector: lv,
  loader: hv
}, id = !1, Ho = /* @__PURE__ */ p(() => {
  id || (id = !0, to("error", UB, (e) => e.toLowerCase().trim() === "error"), to(
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
  ), Na(ZB, o_, E_), Na(
    ET,
    h_,
    EB,
    vB,
    UT,
    eB,
    sB,
    nB,
    CB,
    SB,
    HT,
    qT,
    IT,
    e_,
    ZT,
    qB,
    IB,
    HB,
    dB,
    f_,
    y_,
    gB,
    S_,
    I_,
    v_,
    C_,
    R_,
    X_,
    ev,
    sv,
    nv,
    cv,
    z_,
    V_,
    Q_
  ));
}, "addDiagrams"), dv = /* @__PURE__ */ p(async () => {
  M.debug("Loading registered diagrams");
  const t = (await Promise.allSettled(
    Object.entries(Cr).map(async ([r, { detector: i, loader: s }]) => {
      if (s)
        try {
          Ya(r);
        } catch {
          try {
            const { diagram: o, id: a } = await s();
            to(a, o, i);
          } catch (o) {
            throw M.error(`Failed to load external diagram with key ${r}. Removing from detectors.`), delete Cr[r], o;
          }
        }
    })
  )).filter((r) => r.status === "rejected");
  if (t.length > 0) {
    M.error(`Failed to load ${t.length} external diagrams`);
    for (const r of t)
      M.error(r);
    throw new Error(`Failed to load ${t.length} external diagrams`);
  }
}, "loadRegisteredDiagrams"), uv = "graphics-document document";
function zy(e, t) {
  e.attr("role", uv), t !== "" && e.attr("aria-roledescription", t);
}
p(zy, "setA11yDiagramInfo");
function Hy(e, t, r, i) {
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
p(Hy, "addSVGa11yTitleDescription");
var mr, Sn = (mr = class {
  constructor(t, r, i, s, o) {
    this.type = t, this.text = r, this.db = i, this.parser = s, this.renderer = o;
  }
  static async fromText(t, r = {}) {
    const i = Dt(), s = $n(t, i);
    t = x2(t) + `
`;
    try {
      Ya(s);
    } catch {
      const c = Y0(s);
      if (!c)
        throw new Yd(`Diagram ${s} not found.`);
      const { id: h, diagram: d } = await c();
      to(h, d);
    }
    const { db: o, parser: a, renderer: n, init: l } = Ya(s);
    return a.parser && (a.parser.yy = o), o.clear?.(), l?.(i), r.title && o.setDiagramTitle?.(r.title), await a.parse(t), new mr(s, t, o, a, n);
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
}, p(mr, "Diagram"), mr), sd = [], fv = /* @__PURE__ */ p(() => {
  sd.forEach((e) => {
    e();
  }), sd = [];
}, "attachFunctions"), pv = /* @__PURE__ */ p((e) => e.replace(/^\s*%%(?!{)[^\n]+\n?/gm, "").trimStart(), "cleanupComments");
function Yy(e) {
  const t = e.match(Hd);
  if (!t)
    return {
      text: e,
      metadata: {}
    };
  const r = t[1], i = r ? t[2].split(`
`).map((a) => a.startsWith(r) ? a.slice(r.length) : a).join(`
`) : t[2];
  let s = nT(i, {
    // To support config, we need JSON schema.
    // https://www.yaml.org/spec/1.2/spec.html#id2803231
    schema: aT
  }) ?? {};
  s = typeof s == "object" && !Array.isArray(s) ? s : {};
  const o = {};
  return s.displayMode && (o.displayMode = s.displayMode.toString()), s.title && (o.title = s.title.toString()), s.config && (o.config = s.config), {
    text: e.slice(t[0].length),
    metadata: o
  };
}
p(Yy, "extractFrontMatter");
var gv = /* @__PURE__ */ p((e) => e.replace(/\r\n?/g, `
`).replace(
  /<(\w+)([^>]*)>/g,
  (t, r, i) => "<" + r + i.replace(/="([^"]*)"/g, "='$1'") + ">"
), "cleanupText"), yv = /* @__PURE__ */ p((e) => {
  const { text: t, metadata: r } = Yy(e), { displayMode: i, title: s, config: o = {} } = r;
  return i && (o.gantt || (o.gantt = {}), o.gantt.displayMode = i), { title: s, config: o, text: t };
}, "processFrontmatter"), mv = /* @__PURE__ */ p((e) => {
  const t = Kt.detectInit(e) ?? {}, r = Kt.detectDirective(e, "wrap");
  return Array.isArray(r) ? t.wrap = r.some(({ type: i }) => i === "wrap") : r?.type === "wrap" && (t.wrap = !0), {
    text: o2(e),
    directive: t
  };
}, "processDirectives");
function Xl(e) {
  const t = gv(e), r = yv(t), i = mv(r.text), s = al(r.config, i.directive);
  return e = pv(i.text), {
    code: e,
    title: r.title,
    config: s
  };
}
p(Xl, "preprocessDiagram");
function Xy(e) {
  const t = new TextEncoder().encode(e), r = Array.from(t, (i) => String.fromCodePoint(i)).join("");
  return btoa(r);
}
p(Xy, "toBase64");
var xv = 5e4, Cv = "graph TB;a[Maximum text size in diagram exceeded];style a fill:#faa", bv = "sandbox", kv = "loose", wv = "http://www.w3.org/2000/svg", Sv = "http://www.w3.org/1999/xlink", Tv = "http://www.w3.org/1999/xhtml", Bv = "100%", _v = "100%", vv = "border:0;margin:0;", Lv = "margin:0", Fv = "allow-top-navigation-by-user-activation allow-popups", Av = 'The "iframe" tag is not supported by your browser.', Ev = ["foreignobject"], Mv = ["dominant-baseline"];
function jl(e) {
  const t = Xl(e);
  return Qs(), N0(t.config ?? {}), t;
}
p(jl, "processAndSetConfigs");
async function jy(e, t) {
  Ho();
  try {
    const { code: r, config: i } = jl(e);
    return { diagramType: (await Gy(r)).type, config: i };
  } catch (r) {
    if (t?.suppressErrors)
      return !1;
    throw r;
  }
}
p(jy, "parse");
var od = /* @__PURE__ */ p((e, t, r = []) => {
  const i = Rd(`{ ${r.join(" !important; ")} !important; }`);
  return `.${e} ${t} ${i}`;
}, "cssImportantStyles"), $v = /* @__PURE__ */ p((e, t = /* @__PURE__ */ new Map()) => {
  const r = new CSSStyleSheet();
  if (e.fontFamily !== void 0 && r.insertRule(
    `:root { --mermaid-font-family: ${e.fontFamily}}`,
    r.cssRules.length
  ), e.altFontFamily !== void 0 && r.insertRule(
    `:root { --mermaid-alt-font-family: ${e.altFontFamily}}`,
    r.cssRules.length
  ), t instanceof Map) {
    const n = Zt(e) ? ["> *", "span"] : ["rect", "polygon", "ellipse", "circle", "path"];
    t.forEach((l) => {
      qh(l.styles) || n.forEach((c) => {
        r.insertRule(
          od(l.id, c, l.styles),
          r.cssRules.length
        );
      }), qh(l.textStyles) || r.insertRule(
        od(
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
      s.replaceSync(e.themeCSS), i = Ha(s) + `
`;
    } else
      i += `${e.themeCSS}
`;
  return i + Ha(r);
}, "createCssStyles"), Ov = /* @__PURE__ */ p((e, t) => wn(
  TT(`${e}{${t}}`),
  vT([
    /* @__PURE__ */ p(function(i, s, o, a) {
      if (i.type === "rule" && Array.isArray(i.props)) {
        if (i.parent && i.parent.type === Cn)
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
          cT,
          uT,
          Jg,
          pT,
          "@container",
          "@starting-style"
        ],
        Cn
        // needed for Mermaid's animation feature
      ].includes(i.type) || (M.warn(`Removing unsupported at-rule ${i.type} from CSS`), i.type = Hl));
    }, "addNamespace"),
    _T
  ])
), "compileCSS"), Iv = /* @__PURE__ */ p((e, t, r, i) => {
  const s = $v(e, r), o = lx(
    t,
    s,
    { ...e.themeVariables, theme: e.theme, look: e.look },
    i
  );
  return Ov(i, o);
}, "createUserStyles"), Dv = /* @__PURE__ */ p((e = "", t, r) => {
  let i = e;
  return !r && !t && (i = i.replace(
    /marker-end="url\([\d+./:=?A-Za-z-]*?#/g,
    'marker-end="url(#'
  )), i = er(i), i = i.replace(/<br>/g, "<br/>"), i;
}, "cleanUpSvgCode"), Pv = /* @__PURE__ */ p((e = "", t) => {
  const r = t?.viewBox?.baseVal?.height ? t.viewBox.baseVal.height + "px" : _v, i = Xy(`<body style="${Lv}">${e}</body>`);
  return `<iframe style="width:${Bv};height:${r};${vv}" src="data:text/html;charset=UTF-8;base64,${i}" sandbox="${Fv}">
  ${Av}
</iframe>`;
}, "putIntoIFrame"), ad = /* @__PURE__ */ p((e, t, r, i, s) => {
  const o = e.append("div");
  o.attr("id", r), i && o.attr("style", i);
  const a = o.append("svg").attr("id", t).attr("width", "100%").attr("xmlns", wv);
  return s && a.attr("xmlns:xlink", s), a.append("g"), e;
}, "appendDivSvgG");
function Tn(e, t) {
  return e.append("iframe").attr("id", t).attr("style", "width: 100%; height: 100%;").attr("sandbox", "");
}
p(Tn, "sandboxedIframe");
var Rv = /* @__PURE__ */ p((e, t, r, i) => {
  e.getElementById(t)?.remove(), e.getElementById(r)?.remove(), e.getElementById(i)?.remove();
}, "removeExistingElements"), qv = /* @__PURE__ */ p(async function(e, t, r) {
  Ho();
  const i = jl(t);
  t = i.code;
  const s = Dt();
  M.debug(s), t.length > (s?.maxTextSize ?? xv) && (t = Cv);
  const o = `#${e}`, a = "i" + e, n = "#" + a, l = "d" + e, c = "#" + l, h = /* @__PURE__ */ p(() => {
    const z = xt(u ? n : c).node();
    z && "remove" in z && z.remove();
  }, "removeTempElements");
  let d = xt(document.body);
  const u = s.securityLevel === bv, f = s.securityLevel === kv, y = s.fontFamily;
  if (r !== void 0) {
    if (r && (r.innerHTML = ""), u) {
      const W = Tn(xt(r), a);
      d = xt(W.nodes()[0].contentDocument.body), d.node().style.margin = "0";
    } else
      d = xt(r);
    ad(d, e, l, `font-family: ${y}`, Sv);
  } else {
    if (Rv(document, e, l, a), u) {
      const W = Tn(xt(document.body), a);
      d = xt(W.nodes()[0].contentDocument.body), d.node().style.margin = "0";
    } else
      d = xt("body");
    ad(d, e, l);
  }
  let m, x;
  try {
    m = await Sn.fromText(t, { title: i.title });
  } catch (W) {
    if (s.suppressErrorRendering)
      throw h(), W;
    m = await Sn.fromText("error"), x = W;
  }
  const C = d.select(c).node(), b = m.type, w = C.firstChild, T = w.firstChild, B = m.renderer.getClasses?.(t, m), L = Iv(s, b, B, o), v = document.createElement("style");
  v.innerHTML = L, w.insertBefore(v, T);
  try {
    await m.renderer.draw(t, e, "11.17.2", m);
  } catch (W) {
    throw s.suppressErrorRendering ? h() : XB.draw(t, e, "11.17.2"), W;
  }
  const _ = d.select(`${c} svg`), R = m.db.getAccTitle?.(), N = m.db.getAccDescription?.();
  Vy(b, _, R, N);
  const J = (/* @__PURE__ */ p(() => {
    d.select(`[id="${e}"]`).selectAll("foreignobject > *").attr("xmlns", Tv);
    let W = d.select(c).node().innerHTML;
    if (M.debug("config.arrowMarkerAbsolute", s.arrowMarkerAbsolute), W = Dv(W, u, Oe(s.arrowMarkerAbsolute)), u) {
      const z = d.select(c + " svg").node();
      W = Pv(W, z);
    } else f || (W = ni.sanitize(W, {
      ADD_TAGS: Ev,
      ADD_ATTR: Mv,
      HTML_INTEGRATION_POINTS: { foreignobject: !0 }
    }));
    return fv(), W;
  }, "serializeSvg"))();
  if (x)
    throw x;
  return h(), {
    diagramType: b,
    svg: J,
    bindFunctions: m.db.bindFunctions
  };
}, "render");
function Uy(e = {}) {
  const t = Ht({}, e);
  t?.fontFamily && !t.themeVariables?.fontFamily && (t.themeVariables || (t.themeVariables = {}), t.themeVariables.fontFamily = t.fontFamily), R0(t), t?.theme && t.theme in ze ? t.themeVariables = ze[t.theme].getThemeVariables(
    t.themeVariables
  ) : t && (t.themeVariables = ze.default.getThemeVariables(t.themeVariables));
  const r = typeof t == "object" ? P0(t) : qd();
  Mn(r.logLevel), Ho();
}
p(Uy, "initialize");
var Gy = /* @__PURE__ */ p((e, t = {}) => {
  const { code: r } = Xl(e);
  return Sn.fromText(r, t);
}, "getDiagramFromText");
function Vy(e, t, r, i) {
  zy(t, e), Hy(t, r, i, t.attr("id"));
}
p(Vy, "addA11yInfo");
var Sr = Object.freeze({
  render: qv,
  parse: jy,
  getDiagramFromText: Gy,
  initialize: Uy,
  getConfig: Dt,
  /**
   * @deprecated This function does nothing. It will be overwritten by the next
   *             call to {@link render} or {@link parse}.
   */
  setConfig: Nd,
  getSiteConfig: qd,
  updateSiteConfig: q0,
  reset: /* @__PURE__ */ p(() => {
    Qs();
  }, "reset"),
  globalReset: /* @__PURE__ */ p(() => {
    Qs(hi);
  }, "globalReset"),
  defaultConfig: hi
});
Mn(Dt().logLevel);
Qs(Dt());
var Nv = /* @__PURE__ */ p((e, t, r) => {
  M.warn(e), ol(e) ? (r && r(e.str, e.hash), t.push({ ...e, message: e.str, error: e })) : (r && r(e), e instanceof Error && t.push({
    str: e.message,
    message: e.message,
    hash: e.name,
    error: e
  }));
}, "handleError"), Ky = /* @__PURE__ */ p(async function(e = {
  querySelector: ".mermaid"
}) {
  try {
    await Wv(e);
  } catch (t) {
    if (ol(t) && M.error(t.str), Xe.parseError && Xe.parseError(t), !e.suppressErrors)
      throw M.error("Use the suppressErrors option to suppress these errors"), t;
  }
}, "run"), Wv = /* @__PURE__ */ p(async function({ postRenderCallback: e, querySelector: t, nodes: r } = {
  querySelector: ".mermaid"
}) {
  const i = Sr.getConfig();
  M.debug(`${e ? "" : "No "}Callback function found`);
  let s;
  if (r)
    s = r;
  else if (t)
    s = document.querySelectorAll(t);
  else
    throw new Error("Nodes and querySelector are both undefined");
  M.debug(`Found ${s.length} diagrams`), i?.startOnLoad !== void 0 && (M.debug("Start On Load: " + i?.startOnLoad), Sr.updateSiteConfig({ startOnLoad: i?.startOnLoad }));
  const o = new Kt.InitIDGenerator(i.deterministicIds, i.deterministicIDSeed);
  let a;
  const n = [];
  for (const l of Array.from(s)) {
    if (M.info("Rendering diagram: " + l.id), l.getAttribute("data-processed"))
      continue;
    l.setAttribute("data-processed", "true");
    const c = `mermaid-${o.next()}`;
    a = l.innerHTML, a = Tf(Kt.entityDecode(a)).trim().replace(/<br\s*\/?>/gi, "<br/>");
    const h = Kt.detectInit(a);
    h && M.debug("Detected early reinit: ", h);
    try {
      const { svg: d, bindFunctions: u } = await tm(c, a, l);
      l.innerHTML = d, e && await e(c), u && u(l);
    } catch (d) {
      Nv(d, n, Xe.parseError);
    }
  }
  if (n.length > 0)
    throw n[0];
}, "runThrowsErrors"), Zy = /* @__PURE__ */ p(function(e) {
  Sr.initialize(e);
}, "initialize"), zv = /* @__PURE__ */ p(async function(e, t, r) {
  M.warn("mermaid.init is deprecated. Please use run instead."), e && Zy(e);
  const i = { postRenderCallback: r, querySelector: ".mermaid" };
  typeof t == "string" ? i.querySelector = t : t && (t instanceof HTMLElement ? i.nodes = [t] : i.nodes = t), await Ky(i);
}, "init"), Hv = /* @__PURE__ */ p(async (e, {
  lazyLoad: t = !0
} = {}) => {
  Ho(), Na(...e), t === !1 && await dv();
}, "registerExternalDiagrams"), Qy = /* @__PURE__ */ p(function() {
  if (Xe.startOnLoad) {
    const { startOnLoad: e } = Sr.getConfig();
    e && Xe.run().catch((t) => M.error("Mermaid failed to initialize", t));
  }
}, "contentLoaded");
typeof document < "u" && window.addEventListener("load", Qy, !1);
var Yv = /* @__PURE__ */ p(function(e) {
  Xe.parseError = e;
}, "setParseErrorHandler"), ko = [], Ma = !1, Jy = /* @__PURE__ */ p(async () => {
  if (!Ma) {
    for (Ma = !0; ko.length > 0; ) {
      const e = ko.shift();
      if (e)
        try {
          await e();
        } catch (t) {
          M.error("Error executing queue", t);
        }
    }
    Ma = !1;
  }
}, "executeQueue"), Xv = /* @__PURE__ */ p(async (e, t) => new Promise((r, i) => {
  const s = /* @__PURE__ */ p(() => new Promise((o, a) => {
    Sr.parse(e, t).then(
      (n) => {
        o(n), r(n);
      },
      (n) => {
        M.error("Error parsing", n), Xe.parseError?.(n), a(n), i(n);
      }
    );
  }), "performCall");
  ko.push(s), Jy().catch(i);
}), "parse"), tm = /* @__PURE__ */ p((e, t, r) => new Promise((i, s) => {
  const o = /* @__PURE__ */ p(() => new Promise((a, n) => {
    Sr.render(e, t, r).then(
      (l) => {
        a(l), i(l);
      },
      (l) => {
        M.error("Error parsing", l), Xe.parseError?.(l), n(l), s(l);
      }
    );
  }), "performCall");
  ko.push(o), Jy().catch(s);
}), "render"), jv = /* @__PURE__ */ p(() => Object.keys(Cr).map((e) => ({
  id: e
})), "getRegisteredDiagramsMetadata"), Xe = {
  startOnLoad: !0,
  mermaidAPI: Sr,
  parse: Xv,
  render: tm,
  init: zv,
  run: Ky,
  registerExternalDiagrams: Hv,
  registerLayoutLoaders: Kg,
  initialize: Zy,
  parseError: void 0,
  contentLoaded: Qy,
  setParseErrorHandler: Yv,
  detectType: $n,
  registerIconPacks: k1,
  getRegisteredDiagramsMetadata: jv
}, $a = Xe;
const wt = (e) => e.replace(/\s*!important\s*$/i, "").trim(), Uv = (e, t) => {
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
}, de = (e) => {
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
      if (a === 0 && (c === ";" || c === "," || /\s/.test(c) && Uv(e, r)))
        break;
      r += 1;
    }
    const l = wt(e.substring(o, r));
    s && l && t.push({ property: s, value: l }), r < e.length && (e[r] === ";" || e[r] === ",") && (r += 1);
  }
  return t;
}, ue = (e) => {
  const t = wt(e);
  if (!t)
    return !1;
  if (typeof CSS < "u" && typeof CSS.supports == "function")
    return CSS.supports("color", t);
  if (typeof document < "u") {
    const r = document.createElement("div");
    return r.style.color = "", r.style.color = t, r.style.color !== "";
  }
  return !1;
}, nd = (e, t) => {
  const r = e.getAttribute("style");
  return r && de(r).find((i) => i.property === t)?.value || "";
}, Oa = (...e) => {
  for (const t of e) {
    const r = wt(t || "");
    if (ue(r))
      return r;
  }
}, Ul = (e, t) => {
  const r = e.querySelector("text, foreignObject, div, span, p") || e, i = Oa(r.getAttribute?.("fill"), nd(r, "fill"), r.style?.fill);
  if (i)
    return i;
  const s = Oa(r.getAttribute?.("color"), nd(r, "color"), r.style?.color);
  if (s)
    return s;
  const o = Oa(t);
  if (o)
    return o;
}, Gl = (e, t, r) => {
  switch (t) {
    case At.FILL:
    case At.STROKE:
      ue(r) && (e[t] = r);
      break;
    case At.STROKE_WIDTH:
    case At.STROKE_DASHARRAY:
      e[t] = r;
      break;
  }
}, wo = (e, t, r) => {
  t === Jt.COLOR && ue(r) && (e[Jt.COLOR] = r);
}, So = (e, t, r) => {
  e && de(e).forEach(({ property: i, value: s }) => {
    Gl(t, i, s), wo(r, i, s);
  });
}, em = (e, t) => {
  e && de(e).forEach(({ property: r, value: i }) => {
    if (r === "fill" && ue(i)) {
      t[Jt.COLOR] = i;
      return;
    }
    wo(t, r, i);
  });
}, rm = (e, t) => {
  if (!e)
    return;
  [
    [At.FILL, e.getAttribute("fill")],
    [At.STROKE, e.getAttribute("stroke")],
    [
      At.STROKE_WIDTH,
      e.getAttribute("stroke-width")
    ],
    [
      At.STROKE_DASHARRAY,
      e.getAttribute("stroke-dasharray")
    ]
  ].forEach(([i, s]) => {
    const o = wt(s || "");
    o && Gl(t, i, o);
  });
}, im = (e, t) => {
  if (!e)
    return;
  const r = e.getAttribute("fill") || e.getAttribute("color"), i = wt(r || "");
  ue(i) && (t[Jt.COLOR] = i);
}, Bn = (e, t, r, i) => {
  if (!(t instanceof Map))
    return;
  const s = t.get(e);
  s && (s.styles?.forEach((o) => {
    de(o).forEach(({ property: a, value: n }) => {
      Gl(r, a, n), wo(i, a, n);
    });
  }), s.textStyles?.forEach((o) => {
    de(o).forEach(({ property: a, value: n }) => {
      wo(i, a, n);
    });
  }));
}, Gv = (e, t, r) => {
  const i = e.nodes.map((u) => u.startsWith("flowchart-") ? u.split("-")[1] : u), s = t.querySelector(`[id='${e.id}']`);
  if (!s)
    throw new Error("SubGraph element not found");
  const o = Vl(s, t), a = s.getBBox(), n = {
    width: a.width,
    height: a.height
  }, l = {}, c = {}, h = s.querySelector(":scope > rect, :scope > path, :scope > polygon, :scope > ellipse") || s.querySelector(".cluster > rect, .cluster > path, .cluster > polygon, .cluster > ellipse") || s.querySelector("rect, path, polygon, ellipse");
  So(s.getAttribute("style"), l, c), So(h?.getAttribute("style"), l, c), rm(h, l);
  const d = s.querySelector(".cluster-label text, .cluster-label tspan") || s.querySelector("text");
  return em(d?.getAttribute("style"), c), im(d, c), Bn(e.id, r, l, c), e.classes?.forEach((u) => {
    Bn(u, r, l, c);
  }), {
    id: e.id,
    nodeIds: i,
    text: se(e.title),
    labelType: "text",
    ...o,
    ...n,
    containerStyle: l,
    labelStyle: c
  };
}, ld = (e, t, r) => {
  const i = t.querySelector(`[id*="${e.domId}"]`);
  if (!i)
    return;
  let s;
  i.parentElement?.tagName.toLowerCase() === "a" && (s = i.parentElement.getAttribute("xlink:href"));
  const o = Vl(s ? i.parentElement : i, t), a = i.getBBox(), n = {
    width: a.width,
    height: a.height
  }, l = {}, c = {};
  e.classes && r instanceof Map && (Array.isArray(e.classes) ? e.classes : [e.classes]).forEach((u) => {
    Bn(u, r, l, c);
  }), e.styles?.forEach((u) => {
    So(u, l, c);
  });
  const h = i.querySelector(".label-container");
  return So(h?.getAttribute("style"), l, c), rm(h, l), Array.from(i.querySelectorAll(".label, .nodeLabel, .label text, .label tspan, .label span, .label div")).forEach((u) => {
    em(u.getAttribute("style"), c), im(u, c);
  }), {
    id: e.id,
    labelType: e.labelType,
    text: se(e.text || ""),
    type: e.type,
    link: s || void 0,
    ...o,
    ...n,
    containerStyle: l,
    labelStyle: c
  };
}, Vv = (e, t, r) => {
  const i = r.querySelector(`[id*="${e.id}"]`);
  if (!i)
    throw new Error("Edge element not found");
  const s = Vl(i, r), o = Ed(i, s);
  return e.length = void 0, {
    ...e,
    ...o,
    text: se(e.text)
  };
}, Vl = (e, t) => {
  if (!e)
    throw new Error("Element not found");
  let r = e.parentElement?.parentElement;
  const i = e.childNodes[0];
  let s = { x: 0, y: 0 };
  if (i) {
    const { transformX: l, transformY: c } = gr(i), h = i.getBBox();
    s = {
      x: Number(i.getAttribute("x")) || l + h.x || 0,
      y: Number(i.getAttribute("y")) || c + h.y || 0
    };
  }
  const { transformX: o, transformY: a } = gr(e), n = {
    x: o + s.x,
    y: a + s.y
  };
  for (; r && r.id !== t.id; ) {
    if (r.classList.value === "root" && r.hasAttribute("transform")) {
      const { transformX: l, transformY: c } = gr(r);
      n.x += l, n.y += c;
    }
    r = r.parentElement;
  }
  return n;
}, Kv = (e, t) => {
  const r = e.getVertices(), i = e.getEdges(), s = e.getSubGraphs(), o = e.getClasses(), a = {}, n = o instanceof Map ? o : {};
  r instanceof Map ? r.forEach((d, u) => {
    a[u] = ld(d, t, n);
  }) : typeof r == "object" && r !== null && Object.entries(r).forEach(([d, u]) => {
    a[d] = ld(u, t, n);
  });
  const l = /* @__PURE__ */ new Map(), c = (Array.isArray(i) ? i : []).map((d) => {
    if (!t.querySelector(`[id*="${d.id}"]`))
      return null;
    const u = `${d.start}-${d.end}`, f = l.get(u) || 0;
    return l.set(u, f + 1), Vv(d, f, t);
  }).filter((d) => d !== null && d.reflectionPoints.length > 1);
  return {
    type: "flowchart",
    subGraphs: (Array.isArray(s) ? s : []).map((d) => Gv(d, t, n)),
    vertices: a,
    edges: c
  };
}, Zv = (e, t) => {
  const r = {};
  t?.label && (r.label = { text: se(t.label), fontSize: 16 });
  const i = e.tagName;
  if (i === "line")
    r.startX = Number(e.getAttribute("x1")), r.startY = Number(e.getAttribute("y1")), r.endX = Number(e.getAttribute("x2")), r.endY = Number(e.getAttribute("y2"));
  else if (i === "path") {
    const a = e.getAttribute("d");
    if (!a)
      throw new Error('Path element does not contain a "d" attribute');
    const n = a.split(/(?=[LC])/), l = n[0].substring(1).split(",").map((d) => parseFloat(d)), c = [];
    n.forEach((d) => {
      const u = d.substring(1).trim().split(" ").map((f) => {
        const [y, m] = f.split(",");
        return [
          parseFloat(y) - l[0],
          parseFloat(m) - l[1]
        ];
      });
      c.push(...u);
    });
    const h = c[c.length - 1];
    r.startX = l[0], r.startY = l[1], r.endX = h[0], r.endY = h[1], r.points = c;
  }
  t?.label && (r.startY = r.startY - 10, r.endY = r.endY - 10);
  const s = e.getAttribute("stroke"), o = (s && s !== "none" ? s : "") || getComputedStyle(e).stroke || "";
  return r.strokeColor = o ? wt(o) : null, r.strokeWidth = Number(e.getAttribute("stroke-width")), r.type = "arrow", r.strokeStyle = t?.strokeStyle || "solid", r.startArrowhead = t?.startArrowhead || null, r.endArrowhead = t?.endArrowhead || null, r;
}, Kl = (e, t, r, i, s) => {
  const o = {};
  return o.type = "arrow", o.startX = e, o.startY = t, o.endX = r, o.endY = i, Object.assign(o, { ...s }), o;
}, To = (e, t, r, i) => ({
  type: "text",
  x: e,
  y: t,
  text: r,
  width: i?.width || 20,
  height: i?.height || 20,
  fontSize: i?.fontSize || cs,
  id: i?.id,
  color: i?.color,
  groupId: i?.groupId,
  metadata: i?.metadata
}), sm = (e, t, r) => {
  const i = {}, s = Number(e.getAttribute("x")), o = Number(e.getAttribute("y"));
  i.type = "text", i.text = se(t), r?.id && (i.id = r.id), r?.groupId && (i.groupId = r.groupId);
  const a = e.getBBox();
  i.width = a.width, i.height = a.height, i.x = s - a.width / 2, i.y = o;
  const n = parseInt(getComputedStyle(e).fontSize);
  return i.fontSize = n, i.color = Ul(e), i;
}, je = (e, t, r = {}) => {
  const i = {};
  i.type = t;
  const { label: s, subtype: o, id: a, groupId: n } = r;
  i.id = a, n && (i.groupId = n), s && (i.label = {
    text: se(s.text),
    fontSize: 16,
    textAlign: s?.textAlign,
    verticalAlign: s?.verticalAlign
  });
  const l = e.getBBox();
  switch (i.x = l.x, i.y = l.y, i.width = l.width, i.height = l.height, i.subtype = o, o) {
    case "highlight":
      const c = e.getAttribute("fill");
      c && (i.bgColor = wt(c));
      break;
    case "note":
      i.strokeStyle = "dashed";
      break;
  }
  return i;
}, hs = (e, t, r, i, s, o) => {
  const a = {};
  a.startX = t, a.startY = r, a.endX = i, o?.groupId && (a.groupId = o.groupId), o?.id && (a.id = o.id), a.endY = s;
  const n = e.getAttribute("stroke");
  return a.strokeColor = n ? wt(n) : null, a.strokeWidth = Number(e.getAttribute("stroke-width")), a.type = "line", a;
}, hd = {
  0: "SOLID",
  1: "DOTTED",
  3: "SOLID_CROSS",
  4: "DOTTED_CROSS",
  5: "SOLID_OPEN",
  6: "DOTTED_OPEN",
  24: "SOLID_POINT",
  25: "DOTTED_POINT"
}, ve = {
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
}, Qv = (e) => {
  let t;
  switch (e) {
    case ve.SOLID:
    case ve.SOLID_CROSS:
    case ve.SOLID_OPEN:
    case ve.SOLID_POINT:
      t = "solid";
      break;
    case ve.DOTTED:
    case ve.DOTTED_CROSS:
    case ve.DOTTED_OPEN:
    case ve.DOTTED_POINT:
      t = "dotted";
      break;
    default:
      t = "solid";
      break;
  }
  return t;
}, Jv = (e, t) => {
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
}, cd = (e, t, r) => {
  if (!e)
    throw "root node not found";
  const i = le(), s = Array.from(e.children), o = [];
  return s.forEach((a, n) => {
    const l = `${r?.id}-${n}`;
    let c;
    switch (a.tagName) {
      case "line":
        const h = Number(a.getAttribute("x1")), d = Number(a.getAttribute("y1")), u = Number(a.getAttribute("x2")), f = Number(a.getAttribute("y2"));
        c = hs(a, h, d, u, f, { groupId: i, id: l });
        break;
      case "text":
        c = sm(a, t, {
          groupId: i,
          id: l
        });
        break;
      case "circle":
        c = je(a, "ellipse", {
          label: a.textContent ? { text: a.textContent } : void 0,
          groupId: i,
          id: l
        });
      default:
        c = je(a, pm[a.tagName], {
          label: a.textContent ? { text: a.textContent } : void 0,
          groupId: i,
          id: l
        });
    }
    o.push(c);
  }), o;
}, dd = (e, t) => {
  const r = t.getAttribute("fill"), i = t.getAttribute("stroke"), s = t.getAttribute("stroke-width"), o = t.getAttribute("stroke-dasharray");
  r && r !== "none" && (e.bgColor = wt(r)), i && i !== "none" && (e.strokeColor = wt(i)), s && (e.strokeWidth = Number(s)), o && o.trim() && (e.strokeStyle = "dashed");
}, tL = (e, t) => {
  const r = Array.from(t.querySelectorAll(".actor-top")), i = Array.from(t.querySelectorAll(".actor-bottom")), s = [], o = [], a = {}, n = e instanceof Map ? Array.from(e.values()) : Object.values(e), l = Array.from(t.querySelectorAll(".actor-line")), c = (h, d) => {
    const u = h.name, f = l.find((m) => m.getAttribute("name") === u);
    if (f)
      return f;
    const y = h.type === "participant" ? d.parentElement?.previousElementSibling : d.previousElementSibling;
    return y ? y.tagName === "line" ? y : y.querySelector("line") : null;
  };
  return n.forEach((h) => {
    const d = r.find((y) => y.getAttribute("name") === h.name), u = i.find((y) => y.getAttribute("name") === h.name);
    if (!d || !u)
      throw "root not found";
    const f = h.description;
    if (h.type === "participant") {
      const y = je(d, "rectangle", { id: `${h.name}-top`, label: { text: f }, subtype: "actor" });
      if (dd(y, d), !y)
        throw "Top Node element not found!";
      s.push([y]);
      const m = je(u, "rectangle", { id: `${h.name}-bottom`, label: { text: f }, subtype: "actor" });
      a[h.name] = {
        topId: `${h.name}-top`,
        bottomId: `${h.name}-bottom`,
        bindType: "rectangle"
      }, dd(m, u), s.push([m]);
      const x = c(h, d);
      if (x?.tagName !== "line")
        throw "Line not found";
      const C = Number(x.getAttribute("x1"));
      if (!y.height)
        throw "Top node element height is null";
      const b = y.y + y.height, w = m.y, T = Number(x.getAttribute("x2")), B = hs(x, C, b, T, w);
      o.push(B);
    } else if (h.type === "actor") {
      const y = cd(d, f, {
        id: `${h.name}-top`
      });
      s.push(y);
      const m = cd(u, f, {
        id: `${h.name}-bottom`
      });
      s.push(m);
      const x = c(h, d);
      if (x?.tagName !== "line")
        throw "Line not found";
      const C = Number(x.getAttribute("x1")), b = Number(x.getAttribute("y1")), w = Number(x.getAttribute("x2")), T = m.find((v) => v.type === "ellipse");
      if (T) {
        const v = T.y, _ = hs(x, C, b, w, v);
        o.push(_);
      }
      const B = y.find((v) => v.type === "ellipse"), L = m.find((v) => v.type === "ellipse");
      B?.id && L?.id && (a[h.name] = {
        topId: B.id,
        bottomId: L.id,
        bindType: "ellipse"
      });
    }
  }), { nodes: s, lines: o, actorMap: a };
}, eL = (e, t, r) => {
  const i = [], s = Array.from(t.querySelectorAll('[class*="messageLine"]')), o = Object.keys(hd), a = e.filter((n) => o.includes(n.type.toString()));
  return s.forEach((n, l) => {
    const c = a[l], h = hd[c.type], d = Zv(n, {
      label: c?.message,
      strokeStyle: Qv(c.type),
      endArrowhead: h === "SOLID_OPEN" || h === "DOTTED_OPEN" ? null : "arrow"
    }), u = r[c.from], f = r[c.to];
    u?.topId && f?.topId && (d.start = { type: u.bindType || "rectangle", id: u.topId }, d.end = { type: f.bindType || "rectangle", id: f.topId }), Jv(n, d), i.push(d);
  }), i;
}, rL = (e, t) => {
  const r = Array.from(t.querySelectorAll(".note")).map((o) => o.parentElement), i = e.filter((o) => o.type === ve.NOTE), s = [];
  return r.forEach((o, a) => {
    if (!o)
      return;
    const n = o.firstChild, l = i[a].message, c = je(n, "rectangle", {
      label: { text: l },
      subtype: "note"
    }), h = n.getAttribute("fill"), d = n.getAttribute("stroke"), u = n.getAttribute("stroke-width"), f = n.getAttribute("stroke-dasharray");
    h && h !== "none" && (c.bgColor = wt(h)), d && d !== "none" && (c.strokeColor = wt(d)), u && (c.strokeWidth = Number(u)), f && f.trim() && (c.strokeStyle = "dashed"), s.push(c);
  }), s;
}, iL = (e) => {
  const t = Array.from(e.querySelectorAll("[class*=activation]")), r = [];
  return t.forEach((i) => {
    const s = je(i, "rectangle", {
      label: { text: "" },
      subtype: "activation"
    });
    (() => {
      const a = i.getAttribute("fill"), n = i.getAttribute("stroke"), l = i.getAttribute("stroke-width"), c = i.getAttribute("stroke-dasharray");
      a && a !== "none" && (s.bgColor = wt(a)), n && n !== "none" && (s.strokeColor = wt(n)), l && (s.strokeWidth = Number(l)), c && c.trim() && (s.strokeStyle = "dashed");
    })(), r.push(s);
  }), r;
}, sL = (e, t) => {
  const r = Array.from(t.querySelectorAll(".loopLine")), i = [], s = [], o = [];
  r.forEach((h) => {
    const d = Number(h.getAttribute("x1")), u = Number(h.getAttribute("y1")), f = Number(h.getAttribute("x2")), y = Number(h.getAttribute("y2")), m = hs(h, d, u, f, y);
    m.strokeStyle = "dotted", m.strokeColor = "#adb5bd", m.strokeWidth = 2, i.push(m);
  });
  const a = Array.from(t.querySelectorAll(".loopText")), n = e.filter((h) => h.type === ve.CRITICAL_START).map((h) => h.message);
  a.forEach((h) => {
    const d = h.textContent || "", u = sm(h, d), f = d.match(/\[(.*?)\]/)?.[1] || "";
    n.includes(f) && (u.x += 16), s.push(u);
  });
  const l = Array.from(t?.querySelectorAll(".labelBox")), c = Array.from(t?.querySelectorAll(".labelText"));
  return l.forEach((h, d) => {
    const u = c[d]?.textContent || "", f = je(h, "rectangle", {
      label: { text: u }
    });
    f.strokeColor = "#adb5bd", f.bgColor = "#e9ecef", f.width = void 0, o.push(f);
  }), { lines: i, texts: s, nodes: o };
}, oL = (e) => {
  const t = Array.from(e.querySelectorAll(".rect")).filter((i) => i.parentElement?.tagName !== "g"), r = [];
  return t.forEach((i) => {
    const s = je(i, "rectangle", {
      label: { text: "" },
      subtype: "highlight"
    });
    r.push(s);
  }), r;
}, aL = (e, t) => {
  const r = e.db, i = [], o = r.getBoxes().map((x) => ({
    ...x,
    fill: wt(x.fill || "")
  })), a = oL(t), n = r.getActors(), { nodes: l, lines: c, actorMap: h } = tL(n, t), d = r.getMessages(), u = eL(d, t, h), f = rL(d, t), y = iL(t), m = sL(d, t);
  return i.push(a), i.push(...l), i.push(f), i.push(y), { type: "sequence", lines: c, arrows: u, nodes: i, loops: m, groups: o };
}, nL = (e) => {
  const t = {};
  return e && e.forEach((r) => {
    de(r).forEach(({ property: i, value: s }) => {
      i && s && (t[i] = wt(s));
    });
  }), t;
}, Ds = {
  AGGREGATION: 0,
  EXTENSION: 1,
  COMPOSITION: 2,
  DEPENDENCY: 3
}, ud = {
  LINE: 0,
  DOTTED_LINE: 1
}, fd = 16, lL = (e) => {
  let t;
  switch (e) {
    case ud.LINE:
      t = "solid";
      break;
    case ud.DOTTED_LINE:
      t = "dotted";
      break;
    default:
      t = "solid";
  }
  return t;
}, pd = (e) => {
  let t;
  switch (e) {
    case Ds.AGGREGATION:
      t = "diamond_outline";
      break;
    case Ds.COMPOSITION:
      t = "diamond";
      break;
    case Ds.EXTENSION:
      t = "triangle_outline";
      break;
    case "none":
      t = null;
      break;
    case Ds.DEPENDENCY:
    default:
      t = "arrow";
      break;
  }
  return t;
}, Ia = (e, t) => {
  let r = 0, i = 0, s = e;
  for (; s && s !== t; ) {
    const { transformX: o, transformY: a } = gr(s);
    r += o, i += a, s = s.parentElement;
  }
  return { tx: r, ty: i };
}, gd = /* @__PURE__ */ new Set([
  "triangle_outline",
  "diamond",
  "diamond_outline"
]), om = (e, t = 0.5) => {
  if (e.length <= 2)
    return [...e];
  const r = [e[0]];
  for (let i = 1; i < e.length - 1; i++) {
    const s = r[r.length - 1], o = e[i], a = e[i + 1], n = a.x - s.x, l = a.y - s.y, c = Math.hypot(n, l);
    if (!c)
      continue;
    const d = Math.abs(n * (o.y - s.y) - l * (o.x - s.x)) / c, u = ((o.x - s.x) * n + (o.y - s.y) * l) / (c * c);
    d <= t && u >= -t && u <= 1 + t || r.push(o);
  }
  return r.push(e[e.length - 1]), r;
}, am = (e) => {
  const t = An(Ad(e).map((i) => [i.x, i.y])).map(([i, s]) => ({ x: i, y: s })), r = En(e);
  return r && t.length >= 2 && (t[0] = {
    x: r.startX,
    y: r.startY
  }, t[t.length - 1] = {
    x: r.endX,
    y: r.endY
  }), om(t);
}, yd = (e, t, r) => {
  const i = e.x - t.x, s = e.y - t.y, o = Math.hypot(i, s);
  return o ? {
    x: e.x + i / o * r,
    y: e.y + s / o * r
  } : e;
}, hL = (e, t) => {
  const r = An(t.map((o) => [o.x, o.y])).map(([o, a]) => ({ x: o, y: a }));
  if (r.length < 2)
    throw new Error("Arrow route must contain at least two points");
  const i = r[0], s = r[r.length - 1];
  e.startX = i.x, e.startY = i.y, e.endX = s.x, e.endY = s.y, e.points = r.map((o) => [
    o.x - i.x,
    o.y - i.y
  ]);
}, cL = (e) => {
  const t = e.points?.map(([o, a]) => ({ x: e.startX + o, y: e.startY + a })).filter((o) => Number.isFinite(o.x) && Number.isFinite(o.y));
  if (!t || t.length < 2)
    return e;
  const r = [...t], i = !!e.startArrowhead && gd.has(e.startArrowhead), s = !!e.endArrowhead && gd.has(e.endArrowhead);
  if (!i && !s)
    return e;
  if (i && (r[0] = yd(r[0], r[1], fd)), s) {
    const o = r.length - 1;
    r[o] = yd(r[o], r[o - 1], fd);
  }
  return hL(e, r), e;
}, dL = (e, t) => {
  const r = wt(e.getAttribute("stroke") || getComputedStyle(e).stroke || ""), i = parseFloat(e.getAttribute("stroke-width") || getComputedStyle(e).strokeWidth || "1");
  ue(r) && r !== "none" && (t.strokeColor = r), Number.isFinite(i) && i > 0 && (t.strokeWidth = i);
}, uL = (e) => {
  const t = [];
  return e.forEach((r) => {
    am(r).forEach((i) => {
      const s = t[t.length - 1];
      s && s.x === i.x && s.y === i.y || t.push(i);
    });
  }), om(t);
}, nm = (e, t, r) => {
  if (e.length < 2)
    throw new Error(`Class diagram edge ${t?.id || "<unknown>"} is missing usable path points`);
  const i = e[0], s = e[e.length - 1], o = Kl(i.x, i.y, s.x, s.y, {
    id: t?.getAttribute("data-id") || t?.id || void 0,
    ...r,
    points: e.map((a) => [
      a.x - i.x,
      a.y - i.y
    ])
  });
  return t && dL(t, o), cL(o);
}, lm = (e, t) => nm(uL(e), e[0], t), fL = (e, t) => {
  const r = am(e);
  return nm([r[0], r[r.length - 1]], e, t);
}, pL = (e, t) => lm([e], t), gL = (e, t) => [
  `${e}-cyclic-special-1`,
  `${e}-cyclic-special-mid`,
  `${e}-cyclic-special-2`
].map((i) => t.querySelector(`path[id="${i}"][data-edge="true"]`)).filter((i) => i !== null), yL = (e) => e.points?.map(([t, r]) => ({ x: e.startX + t, y: e.startY + r })).filter((t) => Number.isFinite(t.x) && Number.isFinite(t.y)) || [], md = (e, t) => {
  const r = yL(e);
  if (r.length < 2)
    return null;
  const i = t === "start", s = i ? r[0] : r[r.length - 1], o = i ? r[1] : r[r.length - 2], a = o.x === s.x ? i ? -1 : 1 : Math.sign(o.x - s.x), n = o.y === s.y ? 1 : Math.sign(o.y - s.y);
  return {
    x: s.x + a * 20,
    y: s.y + (n >= 0 ? 12 : -28)
  };
}, mL = (e, t) => {
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
}, xL = (e, t, r) => {
  const i = [], s = [], o = [];
  return Object.values(e).forEach((a) => {
    const { domId: n, id: l } = a, c = le(), h = nL(
      // @ts-ignore
      a.styles || a.cssStyles
    );
    let d;
    try {
      d = r ? r(l) : void 0;
    } catch {
      d = void 0;
    }
    const u = (P) => {
      const Y = new RegExp(`^classId-${P}(?:-|$)`);
      return Array.from(t.querySelectorAll("[id]")).filter((at) => Y.test(at.id))[0];
    }, f = d && t.querySelector(`#${d}`) || t.querySelector(`#${n}`) || t.querySelector(`[data-id='${l}']`) || u(l);
    if (!f)
      throw Error(`DOM Node with id ${n} not found`);
    const y = f.querySelector("rect") || f, m = y.getBBox(), { tx: x, ty: C } = Ia(y, t), b = {
      type: "rectangle",
      id: l,
      groupId: c,
      x: m.x + x,
      y: m.y + C,
      width: m.width,
      height: m.height,
      metadata: { classId: l }
    }, w = y.getAttribute("fill"), T = y.getAttribute("stroke"), B = y.getAttribute("stroke-width"), L = y.getAttribute("stroke-dasharray"), v = getComputedStyle(y), _ = wt(w || h.fill || (w ? v.fill : "")), R = wt(T || h.stroke || (T ? v.stroke : "")), N = B || h["stroke-width"] || (B ? v.strokeWidth : ""), q = L || h["stroke-dasharray"] || (L ? v.strokeDasharray === "none" ? "" : v.strokeDasharray : ""), J = (P) => {
      if (!P || !ue(P))
        return !1;
      const Y = P.toLowerCase();
      return !(Y === "none" || Y === "transparent" || Y === "rgba(0, 0, 0, 0)" || Y === "black" || Y === "#000" || Y === "#000000" || Y === "rgb(0, 0, 0)" || Y === "rgba(0, 0, 0, 1)");
    };
    J(_) ? b.bgColor = _ : b.bgColor = void 0, J(R) ? b.strokeColor = R : b.strokeColor = void 0, N ? b.strokeWidth = Number(N) : b.strokeWidth = void 0, q && q.trim().length > 0 ? b.strokeStyle = "dashed" : b.strokeStyle = void 0, i.push(b), [
      ...Array.from(f.querySelectorAll("line")),
      ...Array.from(f.querySelectorAll("g.divider path"))
    ].forEach((P) => {
      const { tx: Y, ty: lt } = Ia(P, t);
      let at, Ct, Ft, mt;
      if (P.tagName.toLowerCase() === "line")
        at = Number(P.getAttribute("x1")) + Y, Ct = Number(P.getAttribute("y1")) + lt, Ft = Number(P.getAttribute("x2")) + Y, mt = Number(P.getAttribute("y2")) + lt;
      else {
        const bt = P.getBBox();
        at = bt.x + Y, Ft = bt.x + bt.width + Y;
        const ht = bt.y + bt.height / 2 + lt;
        Ct = ht, mt = ht;
      }
      if (at === Ft && Ct === mt)
        return;
      const St = hs(
        // @ts-ignore
        P,
        at,
        Ct,
        Ft,
        mt,
        {
          groupId: c,
          id: le()
        }
      );
      b.strokeColor ? St.strokeColor = b.strokeColor : St.strokeColor = void 0, b.strokeWidth !== void 0 ? St.strokeWidth = b.strokeWidth : St.strokeWidth = void 0, b.strokeStyle ? St.strokeStyle = b.strokeStyle : St.strokeStyle = void 0, St.metadata = { classId: l }, s.push(St);
    });
    const z = Array.from(f.querySelectorAll("text, foreignObject")), V = [];
    z.forEach((P) => {
      const Y = P.tagName.toLowerCase() === "foreignobject", lt = Y ? [] : Array.from(P.querySelectorAll("tspan")), at = lt.length ? lt.map((bt) => bt.textContent?.trim()).filter(Boolean).join(`
`) : P.textContent?.trim() || "";
      if (!at)
        return;
      const Ct = P.getBBox(), { ty: Ft } = Ia(P, t);
      let mt = parseFloat(getComputedStyle(P).fontSize || "");
      if (Y && (!Number.isFinite(mt) || !mt)) {
        const bt = P.querySelector("div, span, p");
        bt && (mt = parseFloat(getComputedStyle(bt).fontSize || ""));
      }
      (!Number.isFinite(mt) || mt <= 0) && (mt = Math.max(12, Ct.height * 0.6)), mt = mt * 0.9;
      const St = Ul(P, h.color);
      V.push({
        section: mL(P, f),
        text: se(at),
        x: Ct.x,
        y: Ct.y + Ft,
        width: b && b.width ? Math.max(b.width - 8, Ct.width) : Ct.width,
        height: Ct.height,
        fontSize: mt,
        color: St
      });
    });
    const $ = V.filter((P) => P.section === "header").sort((P, Y) => P.y - Y.y || P.x - Y.x);
    if (!b.label) {
      const P = $.length === 0 && V.length === 1 ? V : $;
      P.length > 0 && (b.label = {
        text: P.map((Y) => Y.text).join(`
`),
        fontSize: Math.max(...P.map((Y) => Y.fontSize)),
        color: P.find((Y) => Y.color)?.color,
        verticalAlign: "top"
      });
    }
    V.filter((P) => $.length > 0 ? P.section !== "header" : !(b.label && V.length === 1)).forEach((P) => {
      const Y = To((b?.x || 0) + 4, P.y, P.text, {
        width: P.width,
        height: P.height,
        fontSize: P.fontSize,
        color: P.color,
        id: le(),
        groupId: c,
        metadata: { classId: l }
      });
      o.push(Y);
    });
  }), { nodes: i, lines: s, text: o };
}, CL = (e, t, r, i) => {
  const s = Array.from(r.querySelectorAll('.edgePaths path[data-edge="true"]:not([id^="edgeNote"]):not([id*="-cyclic-special-"])'));
  if (e.length === 0)
    return { arrows: [], text: [] };
  const o = [], a = [];
  let n = 0;
  return e.forEach((l) => {
    const { id1: c, id2: h, relation: d } = l, u = t.find((N) => N.id === c), f = t.find((N) => N.id === h);
    if (!u)
      throw new Error(`parseRelations: Cannot find node with id ${c}`);
    if (!f)
      throw new Error(`parseRelations: Cannot find node with id ${h}`);
    const y = lL(d.lineType), m = pd(d.type1), x = pd(d.type2);
    let C;
    if (c === h) {
      const N = gL(c, r);
      if (!N.length)
        throw new Error(`parseRelations: Cannot find rendered SVG edge for relation ${c} -> ${h}`);
      C = lm(N, {
        strokeStyle: y,
        startArrowhead: m,
        endArrowhead: x,
        label: l.title ? { text: l.title } : void 0,
        start: { type: "rectangle", id: u.id },
        end: { type: "rectangle", id: f.id }
      });
    } else {
      const N = s[n];
      if (!N)
        throw new Error(`parseRelations: Cannot find rendered SVG edge for relation ${c} -> ${h}`);
      n += 1, C = fL(N, {
        strokeStyle: y,
        startArrowhead: m,
        endArrowhead: x,
        label: l.title ? { text: l.title } : void 0,
        start: { type: "rectangle", id: u.id },
        end: { type: "rectangle", id: f.id }
      });
    }
    o.push(C);
    const { relationTitle1: b, relationTitle2: w } = l, T = c === h, B = 20, L = 15, v = 15;
    let _, R;
    if (b && b !== "none") {
      if (T) {
        const q = md(C, "start");
        q && (_ = q.x, R = q.y);
      } else
        switch (i) {
          case "TB":
            _ = C.startX - B, C.endX < C.startX && (_ -= v), R = C.startY + L;
            break;
          case "BT":
            _ = C.startX + B, C.endX > C.startX && (_ += v), R = C.startY - L;
            break;
          case "LR":
            _ = C.startX + B, R = C.startY + L, C.endY > C.startY && (R += v);
            break;
          case "RL":
            _ = C.startX - B, R = C.startY - L, C.startY > C.endY && (R -= v);
            break;
          default:
            _ = C.startX - B, R = C.startY + L;
        }
      _ ??= C.startX - B, R ??= C.startY + L;
      const N = To(_, R, b, {
        fontSize: 16
      });
      a.push(N);
    }
    if (w && w !== "none") {
      if (T) {
        const q = md(C, "end");
        q && (_ = q.x, R = q.y);
      } else
        switch (i) {
          case "TB":
            _ = C.endX + B, C.endX < C.startX && (_ += v), R = C.endY - L;
            break;
          case "BT":
            _ = C.endX - B, C.endX > C.startX && (_ -= v), R = C.endY + L;
            break;
          case "LR":
            _ = C.endX - B, R = C.endY - L, C.endY > C.startY && (R -= v);
            break;
          case "RL":
            _ = C.endX + B, R = C.endY + L, C.startY > C.endY && (R += v);
            break;
          default:
            _ = C.endX + B, R = C.endY - L;
        }
      _ ??= C.endX + B, R ??= C.endY + L;
      const N = To(_, R, w, {
        fontSize: 16
      });
      a.push(N);
    }
  }), { arrows: o, text: a };
}, bL = (e, t, r) => {
  const i = [], s = [];
  return e.forEach((o, a) => {
    const { id: n, text: l, class: c } = o, h = t.querySelector(`#${n}`);
    if (!h)
      throw new Error(`Node with id ${n} not found!`);
    const { transformX: d, transformY: u } = gr(h), f = h.firstChild, y = je(f, "rectangle", {
      id: n,
      subtype: "note",
      label: { text: l }
    });
    if (Object.assign(y, {
      x: y.x + d,
      y: y.y + u
    }), i.push(y), c) {
      const m = r.find((L) => L.id === c);
      if (!m)
        throw new Error(`class node with id ${c} not found!`);
      const x = t.querySelector(`path[id="edgeNote${a + 1}"][data-edge="true"]`);
      if (x) {
        s.push(pL(x, {
          strokeStyle: "dotted",
          startArrowhead: null,
          endArrowhead: null,
          start: { id: y.id, type: "rectangle" },
          end: { id: m.id, type: "rectangle" }
        }));
        return;
      }
      const C = y.x + (y.width || 0) / 2, b = y.y + (y.height || 0), w = C, T = m.y, B = Kl(C, b, w, T, {
        strokeStyle: "dotted",
        startArrowhead: null,
        endArrowhead: null,
        start: { id: y.id, type: "rectangle" },
        end: { id: m.id, type: "rectangle" }
      });
      s.push(B);
    }
  }), { notes: i, connectors: s };
}, kL = (e, t) => {
  const r = e.db, i = r.getDirection?.() || "TB", s = [], o = [], a = [], n = [], l = r.getNamespaces?.() || [], c = r.getClasses?.() || {}, h = c instanceof Map ? Object.fromEntries(c) : c;
  if (h && Object.keys(h).length) {
    const C = (
      //@ts-ignore
      typeof r.lookUpDomId == "function" ? (
        //@ts-ignore
        r.lookUpDomId.bind(r)
      ) : void 0
    ), b = xL(h, t, C);
    s.push(b.nodes), o.push(...b.lines), a.push(...b.text), n.push(...b.nodes);
  }
  const d = r.getRelations?.() || [], { arrows: u, text: f } = CL(d, n, t, i), y = r.getNotes?.() || [], { notes: m, connectors: x } = bL(y, t, n);
  return s.push(m), u.push(...x), a.push(...f), { type: "class", nodes: s, lines: o, arrows: u, text: a, namespaces: l };
}, xd = 18, wL = (e) => {
  const t = {};
  return e && e.forEach((r) => {
    de(r).forEach(({ property: i, value: s }) => {
      i && s && (t[i] = wt(s));
    });
  }), t;
}, SL = (e) => {
  if (e == null || e === "")
    return;
  const t = typeof e == "number" ? e : parseFloat(wt(e));
  if (!(!Number.isFinite(t) || t <= 0))
    return t;
}, Zl = (e, t) => {
  let r = 0, i = 0, s = e;
  for (; s && s !== t; ) {
    const { transformX: o, transformY: a } = gr(s);
    r += o, i += a, s = s.parentElement;
  }
  return { tx: r, ty: i };
}, TL = (e) => {
  const t = Array.from(e.querySelectorAll("tspan")), r = t.length ? t.map((i) => i.textContent?.trim()).filter(Boolean).join(`
`) : e.textContent?.trim() || "";
  return se(r);
}, BL = (e) => {
  const t = e.querySelector("text, foreignObject, div, span, p") || e;
  let r = parseFloat(getComputedStyle(t).fontSize || "");
  return (!Number.isFinite(r) || r <= 0) && (r = Math.max(12, e.getBBox().height * 0.75)), r;
}, _L = (e, t, r) => {
  const i = TL(e);
  if (!i)
    return null;
  const s = e.getBBox(), { tx: o, ty: a } = Zl(e, t);
  return {
    className: e.getAttribute("class") || "",
    text: i,
    x: s.x + o,
    y: s.y + a,
    width: s.width,
    height: s.height,
    fontSize: BL(e),
    color: Ul(e, r)
  };
}, vL = (e, t, r, i, s, o, a) => {
  const { tx: n, ty: l } = Zl(e, t);
  let c = 0, h = 0, d = 0, u = 0;
  if (e.tagName.toLowerCase() === "line")
    c = Number(e.getAttribute("x1")) + n, h = Number(e.getAttribute("y1")) + l, d = Number(e.getAttribute("x2")) + n, u = Number(e.getAttribute("y2")) + l;
  else {
    const y = En(e);
    if (!y)
      return null;
    c = y.startX + n, h = y.startY + l, d = y.endX + n, u = y.endY + l;
  }
  const f = {
    type: "line",
    id: le(),
    groupId: r,
    startX: c,
    startY: h,
    endX: d,
    endY: u,
    metadata: { entityId: i }
  };
  return s && ue(s) && s !== "none" && (f.strokeColor = s), o !== void 0 && (f.strokeWidth = o), a && (f.strokeStyle = a), f;
}, Cd = (e) => {
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
}, LL = (e) => {
  switch (e) {
    case "dotted":
      return "dotted";
    case "dashed":
      return "dashed";
    default:
      return "solid";
  }
}, FL = (e, t) => {
  const r = t.querySelector(`path[id="${e.id}"][data-edge="true"]`);
  return r ? [r] : e.start !== e.end ? [] : [
    `${e.start}-cyclic-special-1`,
    `${e.start}-cyclic-special-mid`,
    `${e.start}-cyclic-special-2`
  ].map((s) => t.querySelector(`path[id="${s}"][data-edge="true"]`)).filter((s) => s !== null);
}, AL = (e) => {
  const t = [];
  return e.forEach((r) => {
    Ad(r).forEach((i) => {
      const s = t[t.length - 1];
      s && s.x === i.x && s.y === i.y || t.push(i);
    });
  }), t;
}, EL = (e, t) => {
  const r = t.querySelector(`[id="${e.id}"]`);
  if (!r)
    throw new Error(`ER entity ${e.id} not found in rendered SVG`);
  const i = e.attributes.length ? le() : void 0, s = r.getBBox(), { tx: o, ty: a } = Zl(r, t), n = wL([
    ...e.cssStyles || [],
    ...e.cssCompiledStyles || []
  ]), l = wt(n.fill || ""), c = wt(n.stroke || ""), h = SL(n["stroke-width"]), d = wt(n["stroke-dasharray"] || ""), u = Array.from(r.querySelectorAll("g.label")).map((w) => _L(w, t, n.color)).filter((w) => w !== null), f = u.find((w) => w.className.includes("name")) || u[0], y = u.filter((w) => w !== f), m = f?.text || se(e.alias || e.label || ""), x = {
    type: "rectangle",
    id: e.id,
    groupId: i,
    x: s.x + o,
    y: s.y + a,
    width: s.width,
    height: s.height,
    label: {
      text: m,
      fontSize: e.attributes.length ? xd : f?.fontSize || 16,
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
  ue(l) && l !== "none" && (x.bgColor = l), ue(c) && c !== "none" && (x.strokeColor = c), h && Number.isFinite(h) && h > 0 && (x.strokeWidth = h), d && d !== "none" && (x.strokeStyle = "dashed");
  const C = Array.from(r.querySelectorAll(".divider path, path.divider, line.divider")).map((w) => vL(w, t, i, e.id, x.strokeColor, x.strokeWidth, x.strokeStyle)).filter((w) => w !== null), b = y.map((w) => To(w.x, w.y, w.text, {
    id: le(),
    groupId: i,
    width: w.width,
    height: w.height,
    fontSize: xd,
    color: w.color,
    metadata: { entityId: e.id }
  }));
  return { container: x, lines: C, text: b };
}, ML = (e, t) => {
  const r = FL(e, t);
  if (!r.length)
    throw new Error(`ER relationship ${e.id} not found in rendered SVG`);
  const i = AL(r);
  if (i.length < 2)
    throw new Error(`ER relationship ${e.id} is missing usable path points`);
  const s = i[0], o = i[i.length - 1], a = r[0], n = wt(a.getAttribute("stroke") || getComputedStyle(a).stroke || ""), l = Number(a.getAttribute("stroke-width") || getComputedStyle(a).strokeWidth || 1), c = Kl(s.x, s.y, o.x, o.y, {
    id: e.id,
    label: e.label ? {
      text: se(e.label),
      fontSize: 16,
      textAlign: "center"
    } : void 0,
    strokeStyle: LL(e.pattern),
    startArrowhead: Cd(e.arrowTypeStart),
    endArrowhead: Cd(e.arrowTypeEnd),
    start: { type: "rectangle", id: e.start },
    end: { type: "rectangle", id: e.end },
    points: i.map((h) => [
      h.x - s.x,
      h.y - s.y
    ])
  });
  return ue(n) && n !== "none" && (c.strokeColor = n), Number.isFinite(l) && l > 0 && (c.strokeWidth = l), c;
}, $L = (e, t) => {
  const r = e.getData(), i = r.nodes, s = r.edges, o = [], a = [], n = [];
  i.forEach((c) => {
    const h = EL(c, t);
    o.push(h.container), a.push(...h.lines), n.push(...h.text);
  });
  const l = s.map((c) => ML(c, t));
  return {
    type: "erd",
    nodes: [o],
    lines: a,
    arrows: l,
    text: n
  };
}, Tr = (e) => {
  const t = wt(e || "");
  return !t || t === "none" || t === "transparent" || t === "rgba(0, 0, 0, 0)" || t === "rgba(0,0,0,0)" ? !1 : ue(t);
}, hm = (e, t, r) => {
  switch (t) {
    case At.FILL:
    case At.STROKE:
      Tr(r) && (e[t] = wt(r));
      break;
    case At.STROKE_WIDTH:
    case At.STROKE_DASHARRAY:
      wt(r) && (e[t] = wt(r));
      break;
  }
}, cm = (e, t, r) => {
  t === Jt.COLOR && Tr(r) && (e[Jt.COLOR] = wt(r));
}, OL = (e, t, r) => {
  e && de(e).forEach(({ property: i, value: s }) => {
    hm(t, i, s), cm(r, i, s);
  });
}, IL = (e, t) => {
  e && de(e).forEach(({ property: r, value: i }) => {
    if (r === At.FILL && Tr(i)) {
      t[Jt.COLOR] = wt(i);
      return;
    }
    cm(t, r, i);
  });
}, DL = (e) => {
  const t = /* @__PURE__ */ new Set();
  return e.filter(Boolean).forEach((r) => {
    de(r || "").forEach(({ property: i }) => {
      t.add(i);
    });
  }), t;
}, PL = (e, t, r) => {
  if (!e)
    return;
  [
    [At.FILL, e.getAttribute("fill")],
    [At.STROKE, e.getAttribute("stroke")],
    [
      At.STROKE_WIDTH,
      e.getAttribute("stroke-width")
    ],
    [
      At.STROKE_DASHARRAY,
      e.getAttribute("stroke-dasharray")
    ]
  ].forEach(([s, o]) => {
    if (!r.has(s) || t[s])
      return;
    const a = wt(o || "");
    a && hm(t, s, a);
  });
}, RL = (e, t, r) => {
  if (!e)
    return;
  const i = [
    e,
    ...Array.from(e.querySelectorAll("text, foreignObject, div, span, p"))
  ];
  for (const s of i) {
    if (t[Jt.COLOR] || (r.has(Jt.COLOR) || r.has(At.FILL)) && (IL(s.getAttribute("style"), t), t[Jt.COLOR]))
      break;
    const o = wt(s.getAttribute("fill") || s.getAttribute("color") || "");
    (r.has(Jt.COLOR) || r.has(At.FILL)) && Tr(o) && (t[Jt.COLOR] = o);
  }
}, Ql = (e, t) => {
  let r = 0, i = 0, s = e;
  for (; s && s !== t; ) {
    const { transformX: o, transformY: a } = gr(s);
    r += o, i += a, s = s.parentElement;
  }
  return { tx: r, ty: i };
}, qL = (e, t) => {
  const r = e.getBBox(), { tx: i, ty: s } = Ql(e, t);
  return {
    x: r.x + i,
    y: r.y + s,
    width: r.width,
    height: r.height
  };
}, NL = (e, t) => {
  const r = e.querySelector("line.divider");
  if (!r)
    return;
  const { tx: i, ty: s } = Ql(r, t);
  return {
    startX: Number(r.getAttribute("x1")) + i,
    startY: Number(r.getAttribute("y1")) + s,
    endX: Number(r.getAttribute("x2")) + i,
    endY: Number(r.getAttribute("y2")) + s
  };
}, WL = (e) => {
  const t = e.getBBox();
  return Math.abs(t.width * t.height);
}, bd = (e, t) => {
  const r = e.getAttribute("style");
  if (!r)
    return;
  const i = de(r).find((s) => s.property === t);
  if (i)
    return wt(i.value);
}, _n = (e, t) => {
  const r = e.map((s) => ({ element: s, area: WL(s) })).filter(({ area: s }) => Number.isFinite(s) && s > 0);
  return r.length === 0 ? null : r.sort((s, o) => t === "largest" ? o.area - s.area : s.area - o.area)[0].element;
}, zL = (e, t) => {
  if (!e || !t.has(At.FILL) && !t.has(At.STROKE))
    return;
  const r = wt(e.getAttribute("fill") || bd(e, At.FILL) || ""), i = wt(e.getAttribute("stroke") || bd(e, At.STROKE) || "");
  if (Tr(r))
    return r;
  if (Tr(i))
    return i;
}, HL = (e, t) => {
  const r = Array.from(e.querySelectorAll("circle, ellipse, path")), i = _n(r, "smallest");
  return zL(i, t);
}, YL = (e) => {
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
}, XL = (e) => {
  const t = Array.isArray(e.label) ? e.label.map((i) => se(i)) : se(e.label || "").split(`
`);
  return YL(t).join(`
`);
}, jL = (e) => e.description ? (Array.isArray(e.description) ? e.description : [e.description]).map((r) => se(r)).filter((r) => r.length > 0) : [], UL = (e) => {
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
}, GL = (e, t) => {
  switch (t) {
    case "roundedWithTitle":
      return e.querySelector("rect.outer") || e.querySelector("rect") || e;
    case "divider":
      return e.querySelector("rect.divider") || e.querySelector("rect") || e;
    case "rectWithTitle":
      return e.querySelector("rect.outer") || e.querySelector("rect") || e;
    case "stateStart":
      return _n(Array.from(e.querySelectorAll("circle, ellipse, path")), "largest") || e;
    case "stateEnd":
      return _n(Array.from(e.querySelectorAll("circle, ellipse, path")), "largest") || e;
    default:
      return e.querySelector("rect, path, circle, ellipse, polygon") || e;
  }
}, VL = (e, t, r) => {
  const i = r(e);
  if (!i)
    throw new Error(`State node element not found for "${e.id}"`);
  const s = GL(i, e.shape), o = {}, a = {}, n = [
    e.labelStyle,
    ...e.cssCompiledStyles || [],
    ...e.cssStyles || []
  ], l = DL(n);
  n.filter(Boolean).forEach((h) => {
    OL(h, o, a);
  }), PL(s, o, l), RL(i, a, l);
  const c = qL(s, t);
  return {
    id: e.id,
    shape: e.shape,
    text: XL(e),
    description: jL(e),
    x: c.x,
    y: c.y,
    width: c.width,
    height: c.height,
    parentId: e.parentId,
    position: e.position,
    containerStyle: o,
    labelStyle: a,
    dividerLine: e.shape === "rectWithTitle" ? NL(i, t) : void 0,
    endInnerColor: e.shape === "stateEnd" ? HL(i, l) : void 0,
    isRenderable: e.shape !== "noteGroup"
  };
}, KL = (e, t) => {
  const r = t.querySelector(`[id='${e.id}']`);
  if (!r)
    return null;
  const { tx: i, ty: s } = Ql(r, t), o = Ed(r, { x: i, y: s }, "MCL");
  if (o.reflectionPoints.length < 2)
    return null;
  const a = {}, n = (c, h) => {
    switch (c) {
      case At.STROKE:
        Tr(h) && (a.strokeColor = wt(h));
        break;
      case At.STROKE_WIDTH: {
        const d = parseFloat(wt(h));
        Number.isFinite(d) && d > 0 && (a.strokeWidth = d);
        break;
      }
      case At.STROKE_DASHARRAY:
        wt(h) && (a.strokeStyle = "dashed");
        break;
    }
  };
  [e.style].filter(Boolean).forEach((c) => {
    de(c || "").forEach(({ property: h, value: d }) => {
      n(h, d);
    });
  });
  const l = e.arrowhead === "none" || e.classes?.includes("note-edge");
  return {
    id: e.id,
    start: e.start,
    end: e.end,
    text: se(e.label || ""),
    ...o,
    strokeColor: a.strokeColor,
    strokeWidth: a.strokeWidth,
    strokeStyle: l ? "dashed" : a.strokeStyle,
    isNoteEdge: l
  };
}, ZL = (e, t) => {
  const { nodes: r, edges: i } = e.getData(), s = UL(t);
  return {
    type: "state",
    nodes: r.map((o) => VL(o, t, s)),
    edges: i.map((o) => KL(o, t)).filter((o) => o !== null)
  };
};
let kd = Promise.resolve();
const QL = (e) => {
  const t = kd.then(e, e);
  return kd = t.then(() => {
  }, () => {
  }), t;
};
let wd = null, JL = 0;
const tF = (e) => JSON.stringify(e), Sd = (e) => {
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
}, eF = async (e, t = ws) => QL(async () => {
  const r = t.themeVariables?.fontSize ?? ws.themeVariables.fontSize, i = {
    ...ws,
    ...t,
    fontSize: r,
    themeVariables: {
      ...ws.themeVariables,
      ...t.themeVariables,
      fontSize: r
    }
  }, s = tF(i);
  s !== wd && ($a.initialize(i), wd = s);
  const o = await $a.mermaidAPI.getDiagramFromText(Zm(e)), a = `mermaid-to-excalidraw-${JL++}`, n = document.createElement("div");
  n.setAttribute("style", "opacity: 0; position: fixed; z-index: -1; left: -99999px; top: -99999px;");
  const l = `${a}-container`;
  n.id = l, document.getElementById(l)?.remove(), document.body.appendChild(n);
  try {
    const { svg: c } = await $a.render(a, e, n);
    n.innerHTML = c;
    let h;
    try {
      switch (o.type) {
        case "flowchart-v2":
        case "graph": {
          h = Kv(o.db, n);
          break;
        }
        case "sequence": {
          h = aL(o, n);
          break;
        }
        case "class":
        case "classDiagram": {
          h = kL(o, n);
          break;
        }
        case "er": {
          h = $L(o.db, n);
          break;
        }
        case "state":
        case "stateDiagram": {
          h = ZL(o.db, n);
          break;
        }
        default:
          h = Sd(n);
      }
    } catch (d) {
      console.error("Error processing Mermaid diagram:", d), h = Sd(n);
    }
    return h;
  } finally {
    n.remove();
  }
}), rF = async (e, t) => {
  const r = t || {}, i = parseInt(r.themeVariables?.fontSize ?? "") || cs, s = await eF(e, {
    ...r,
    themeVariables: {
      ...r.themeVariables
    }
  });
  return e0(s, {
    fontSize: i
  });
}, UF = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  parseMermaidToExcalidraw: rF
}, Symbol.toStringTag, { value: "Module" }));
export {
  SF as $,
  TF as A,
  hx as B,
  uF as C,
  Je as D,
  Ee as E,
  r0 as F,
  Dt as G,
  mx as H,
  al as I,
  aT as J,
  Pd as K,
  c2 as L,
  Kk as M,
  Pk as N,
  _h as O,
  Bh as P,
  kF as Q,
  yF as R,
  CF as S,
  xF as T,
  yt as U,
  pF as V,
  jn as W,
  bF as X,
  gF as Y,
  Or as Z,
  p as _,
  dx as a,
  $1 as a$,
  wF as a0,
  mF as a1,
  m0 as a2,
  es as a3,
  cF as a4,
  Eo as a5,
  e2 as a6,
  Z0 as a7,
  Vd as a8,
  ah as a9,
  Bl as aA,
  kg as aB,
  kS as aC,
  Vt as aD,
  uw as aE,
  Jn as aF,
  Zn as aG,
  zs as aH,
  q1 as aI,
  R1 as aJ,
  P1 as aK,
  D1 as aL,
  L1 as aM,
  Qu as aN,
  E1 as aO,
  v1 as aP,
  O1 as aQ,
  Ju as aR,
  A1 as aS,
  z1 as aT,
  W1 as aU,
  N1 as aV,
  Y1 as aW,
  H1 as aX,
  F1 as aY,
  tf as aZ,
  I1 as a_,
  qo as aa,
  Wk as ab,
  tn as ac,
  h2 as ad,
  be as ae,
  O as af,
  I as ag,
  ox as ah,
  Zd as ai,
  xg as aj,
  Tl as ak,
  kc as al,
  ys as am,
  k1 as an,
  sl as ao,
  rt as ap,
  MF as aq,
  EF as ar,
  iT as as,
  vt as at,
  Bg as au,
  st as av,
  AF as aw,
  bo as ax,
  vg as ay,
  Po as az,
  cx as b,
  M1 as b0,
  ef as b1,
  Tg as b2,
  hf as b3,
  Od as b4,
  Rk as b5,
  we as b6,
  b1 as b7,
  zn as b8,
  Ve as b9,
  ss as ba,
  Ch as bb,
  mb as bc,
  ot as bd,
  Uu as be,
  ie as bf,
  cb as bg,
  Wn as bh,
  du as bi,
  gs as bj,
  pu as bk,
  fF as bl,
  s0 as bm,
  UF as bn,
  Bt as c,
  Kd as d,
  Ht as e,
  Ye as f,
  fx as g,
  gg as h,
  he as i,
  xt as j,
  fs as k,
  M as l,
  df as m,
  us as n,
  B1 as o,
  hF as p,
  dF as q,
  jF as r,
  ux as s,
  XF as t,
  Kt as u,
  px as v,
  f2 as w,
  gx as x,
  nT as y,
  oS as z
};
