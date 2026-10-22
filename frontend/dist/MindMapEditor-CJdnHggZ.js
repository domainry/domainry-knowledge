import { jsxs as j, jsx as _ } from "react/jsx-runtime";
import { useRef as G, useState as xe, useEffect as He } from "react";
import { Palette as nn, LayoutTemplate as on, Upload as rn, FileJson as sn, Image as ln, Download as an, Tags as cn, StickyNote as dn, Link as hn } from "lucide-react";
import { C as it, D as Re, E as Ee, F as un, G as pn, B as Ie, H as fn, I as mn, K as ot } from "./index-xTnnSBIQ.js";
const Ve = {
  name: "Latte",
  type: "light",
  palette: ["#dd7878", "#ea76cb", "#8839ef", "#e64553", "#fe640b", "#df8e1d", "#40a02b", "#209fb5", "#1e66f5", "#7287fd"],
  cssVar: {
    "--node-gap-x": "30px",
    "--node-gap-y": "10px",
    "--main-gap-x": "65px",
    "--main-gap-y": "45px",
    "--root-radius": "30px",
    "--main-radius": "20px",
    "--root-color": "#ffffff",
    "--root-bgcolor": "#4c4f69",
    "--root-border-color": "rgba(0, 0, 0, 0)",
    "--main-border": "",
    // you can customize, it will fallback to 2px solid main-color
    "--main-color": "#444446",
    "--main-bgcolor": "#ffffff",
    "--main-bgcolor-transparent": "rgba(255, 255, 255, 0.8)",
    "--topic-padding": "3px",
    "--color": "#777777",
    "--bgcolor": "#f6f6f6",
    "--selected": "#4dc4ff",
    "--accent-color": "#e64553",
    "--panel-color": "#444446",
    "--panel-bgcolor": "#ffffff",
    "--panel-border-color": "#eaeaea",
    "--map-padding": "50px 80px"
  }
}, Ye = {
  name: "Dark",
  type: "dark",
  palette: ["#848FA0", "#748BE9", "#D2F9FE", "#4145A5", "#789AFA", "#706CF4", "#EF987F", "#775DD5", "#FCEECF", "#DA7FBC"],
  cssVar: {
    "--node-gap-x": "30px",
    "--node-gap-y": "10px",
    "--main-gap-x": "65px",
    "--main-gap-y": "45px",
    "--root-radius": "30px",
    "--main-radius": "20px",
    "--root-color": "#ffffff",
    "--root-bgcolor": "#2d3748",
    "--root-border-color": "rgba(255, 255, 255, 0.1)",
    "--main-border": "",
    "--main-color": "#ffffff",
    "--main-bgcolor": "#4c4f69",
    "--main-bgcolor-transparent": "rgba(76, 79, 105, 0.8)",
    "--topic-padding": "3px",
    "--color": "#cccccc",
    "--bgcolor": "#252526",
    "--selected": "#4dc4ff",
    "--accent-color": "#789AFA",
    "--panel-color": "#ffffff",
    "--panel-bgcolor": "#2d3748",
    "--panel-border-color": "#696969",
    "--map-padding": "50px 80px"
  }
};
function qe(e) {
  return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
}
const Le = function(e, t) {
  if (t.id === e)
    return t;
  if (t.children && t.children.length) {
    for (let n = 0; n < t.children.length; n++) {
      const i = Le(e, t.children[n]);
      if (i) return i;
    }
    return null;
  } else
    return null;
}, Q = (e, t) => {
  if (e.parent = t, e.children)
    for (let n = 0; n < e.children.length; n++)
      Q(e.children[n], e);
}, ae = (e, t, n) => {
  if (e.expanded = t, e.children)
    if (n === void 0 || n > 0) {
      const i = n !== void 0 ? n - 1 : void 0;
      e.children.forEach((o) => {
        ae(o, t, i);
      });
    } else
      e.children.forEach((i) => {
        ae(i, !1);
      });
};
function Xe(e) {
  if (e.id = Z(), e.children)
    for (let t = 0; t < e.children.length; t++)
      Xe(e.children[t]);
}
function Ae(e, t, n, i) {
  const o = n - e, r = i - t, s = Math.atan2(r, o) * 180 / Math.PI, l = 12, c = 30, a = (s + 180 - c) * Math.PI / 180, d = (s + 180 + c) * Math.PI / 180;
  return {
    x1: n + Math.cos(a) * l,
    y1: i + Math.sin(a) * l,
    x2: n + Math.cos(d) * l,
    y2: i + Math.sin(d) * l
  };
}
function Z() {
  return ((/* @__PURE__ */ new Date()).getTime().toString(16) + Math.random().toString(16).substring(2)).substring(2, 18);
}
const gn = function() {
  const e = Z();
  return {
    topic: this.newTopicName,
    id: e
  };
};
function ce(e) {
  return JSON.parse(
    JSON.stringify(e, (t, n) => {
      if (t !== "parent")
        return n;
    })
  );
}
const W = (e, t) => {
  let n = 0, i = 0;
  for (; t && t !== e; )
    n += t.offsetLeft, i += t.offsetTop, t = t.offsetParent;
  return { offsetLeft: n, offsetTop: i };
}, O = (e, t) => {
  for (const n in t)
    e.setAttribute(n, t[n]);
}, _e = (e) => e ? e.tagName === "ME-TPC" : !1, ze = (e) => {
  const t = new Set(e.map((n) => n.nodeObj));
  return e.filter((n) => n.nodeObj.parent).filter((n) => {
    let i = n.nodeObj.parent;
    for (; i; ) {
      if (t.has(i)) return !1;
      i = i.parent;
    }
    return !0;
  });
}, Ge = (e) => {
  const t = /translate3d\(([^,]+),\s*([^,]+)/, n = e.match(t);
  return n ? { x: parseFloat(n[1]), y: parseFloat(n[2]) } : { x: 0, y: 0 };
}, Et = function(e) {
  for (let t = 0; t < e.length; t++) {
    const { dom: n, evt: i, func: o } = e[t];
    n.addEventListener(i, o);
  }
  return function() {
    for (let t = 0; t < e.length; t++) {
      const { dom: n, evt: i, func: o } = e[t];
      n.removeEventListener(i, o);
    }
  };
}, rt = (e, t) => {
  const n = e.x - t.x, i = e.y - t.y;
  return Math.sqrt(n * n + i * i);
}, st = function(e, t) {
  if (!t)
    return $e(e), e;
  let n = e.querySelector(".insert-preview");
  const i = `insert-preview ${t} show`;
  return n || (n = document.createElement("div"), e.appendChild(n)), n.className = i, e;
}, $e = function(e) {
  if (!e) return;
  const t = e.querySelectorAll(".insert-preview");
  for (const n of t || [])
    n.remove();
}, Se = function(e, t) {
  for (const n of t) {
    const i = n.parentElement.parentElement.contains(e);
    if (!(e && e.tagName === "ME-TPC" && e !== n && !i && e.nodeObj.parent)) return !1;
  }
  return !0;
}, yn = function(e) {
  const t = document.createElement("div");
  return t.className = "mind-elixir-ghost", e.container.appendChild(t), t;
};
class bn {
  mind;
  isMoving = !1;
  interval = null;
  speed = 20;
  constructor(t) {
    this.mind = t;
  }
  move(t, n) {
    this.isMoving || (this.isMoving = !0, this.interval = setInterval(() => {
      this.mind.move(t * this.speed * this.mind.scaleVal, n * this.speed * this.mind.scaleVal);
    }, 100));
  }
  stop() {
    this.isMoving = !1, this.interval && (clearInterval(this.interval), this.interval = null);
  }
}
function vn(e) {
  return {
    isDragging: !1,
    insertType: null,
    meet: null,
    ghost: yn(e),
    edgeMoveController: new bn(e),
    startX: 0,
    startY: 0,
    pointerId: null
  };
}
const wn = 5;
function lt(e, t, n, i = !1) {
  if (e.spacePressed) return !1;
  const o = n.target;
  if (o?.tagName !== "ME-TPC" || !o.nodeObj.parent) return !1;
  if (t.startX = n.clientX, t.startY = n.clientY, t.pointerId = n.pointerId, e.dragged = e.currentNodes, i) {
    Ct(e, t);
    const r = e.container.getBoundingClientRect();
    St(t.ghost, n.clientX - r.x, n.clientY - r.y);
  }
  return !0;
}
function St(e, t, n) {
  e.style.transform = `translate(${t - 10}px, ${n - 10}px)`, e.style.display = "block";
}
function Ct(e, t) {
  const { dragged: n } = e;
  if (!n) return;
  const i = document.activeElement;
  i && i.isContentEditable && i.blur(), t.isDragging = !0, n.length > 1 ? t.ghost.innerHTML = n.length + "" : t.ghost.innerHTML = n[0].innerHTML;
  for (const o of n)
    o.parentElement.parentElement.style.opacity = "0.5";
  e.panHelper.clear();
}
function xn(e, t, n) {
  const { dragged: i } = e;
  if (!i || t.pointerId !== n.pointerId) return;
  const o = n.clientX - t.startX, r = n.clientY - t.startY, s = Math.sqrt(o * o + r * r);
  if (!t.isDragging && s > wn && Ct(e, t), !t.isDragging) return;
  const l = e.container.getBoundingClientRect();
  St(t.ghost, n.clientX - l.x, n.clientY - l.y), n.clientX < l.x + 50 ? t.edgeMoveController.move(1, 0) : n.clientX > l.x + l.width - 50 ? t.edgeMoveController.move(-1, 0) : n.clientY < l.y + 50 ? t.edgeMoveController.move(0, 1) : n.clientY > l.y + l.height - 50 ? t.edgeMoveController.move(0, -1) : t.edgeMoveController.stop(), $e(t.meet);
  const c = 12 * e.scaleVal;
  if (e.direction === 3) {
    const d = document.elementFromPoint(n.clientX - c, n.clientY);
    if (Se(d, i)) {
      t.meet = d;
      const h = d.getBoundingClientRect();
      n.clientX > h.x + h.width ? t.insertType = "after" : t.insertType = "in";
    } else {
      const h = document.elementFromPoint(n.clientX + c, n.clientY);
      if (Se(h, i)) {
        t.meet = h;
        const p = h.getBoundingClientRect();
        n.clientX < p.x ? t.insertType = "before" : t.insertType = "in";
      } else
        t.insertType = null, t.meet = null;
    }
    t.meet && st(t.meet, t.insertType);
    return;
  }
  const a = document.elementFromPoint(n.clientX, n.clientY - c);
  if (Se(a, i)) {
    t.meet = a;
    const d = a.getBoundingClientRect(), h = d.y;
    n.clientY > h + d.height ? t.insertType = "after" : t.insertType = "in";
  } else {
    const d = document.elementFromPoint(n.clientX, n.clientY + c);
    if (Se(d, i)) {
      t.meet = d;
      const h = d.getBoundingClientRect().y;
      n.clientY < h ? t.insertType = "before" : t.insertType = "in";
    } else
      t.insertType = null, t.meet = null;
  }
  t.meet && st(t.meet, t.insertType);
}
function En(e, t, n) {
  const { dragged: i } = e;
  if (!(!i || t.pointerId !== n.pointerId)) {
    t.edgeMoveController.stop();
    for (const o of i)
      o.parentElement.parentElement.style.opacity = "1";
    t.ghost.style.display = "none", t.ghost.innerHTML = "", t.isDragging && t.meet && ($e(t.meet), t.insertType === "before" ? e.moveNodeBefore(i, t.meet) : t.insertType === "after" ? e.moveNodeAfter(i, t.meet) : t.insertType === "in" && e.moveNodeIn(i, t.meet)), e.dragged = null, t.isDragging = !1, t.insertType = null, t.meet = null, t.pointerId = null;
  }
}
function at(e, t) {
  const { dragged: n } = e;
  if (n) {
    t.edgeMoveController.stop();
    for (const i of n)
      i.parentElement.parentElement.style.opacity = "1";
    t.meet && $e(t.meet), t.ghost.style.display = "none", t.ghost.innerHTML = "", e.dragged = null, t.isDragging = !1, t.insertType = null, t.meet = null, t.pointerId = null;
  }
}
function Sn(e) {
  return () => {
  };
}
const H = {
  LHS: "lhs",
  RHS: "rhs",
  DOWN: "down"
}, Cn = function() {
  this.nodes.innerHTML = "", this.nodes.className = this.direction === 3 ? "down" : "";
  const e = this.createTopic(this.nodeData);
  Ue.call(this, e, this.nodeData), e.draggable = !1;
  const t = document.createElement("me-root");
  t.appendChild(e);
  const n = this.nodeData.children || [];
  if (this.direction === 2) {
    let i = 0, o = 0;
    n.map((r) => {
      r.direction === 0 ? i += 1 : r.direction === 1 ? o += 1 : i <= o ? (r.direction = 0, i += 1) : (r.direction = 1, o += 1);
    });
  }
  Nn(this, n, t);
}, Nn = function(e, t, n) {
  if (e.direction === 3) {
    const r = document.createElement("me-main");
    r.className = H.DOWN;
    for (let s = 0; s < t.length; s++) {
      const { grp: l } = e.createWrapper(t[s]);
      r.appendChild(l);
    }
    e.nodes.appendChild(n), e.nodes.appendChild(r), e.nodes.appendChild(e.lines), e.nodes.appendChild(e.labelContainer);
    return;
  }
  const i = document.createElement("me-main");
  i.className = H.LHS;
  const o = document.createElement("me-main");
  o.className = H.RHS;
  for (let r = 0; r < t.length; r++) {
    const s = t[r], { grp: l } = e.createWrapper(s);
    e.direction === 2 ? s.direction === 0 ? i.appendChild(l) : o.appendChild(l) : e.direction === 0 ? i.appendChild(l) : o.appendChild(l);
  }
  e.nodes.appendChild(i), e.nodes.appendChild(n), e.nodes.appendChild(o), e.nodes.appendChild(e.lines), e.nodes.appendChild(e.labelContainer);
}, Tn = function(e, t) {
  const n = document.createElement("me-children");
  for (let i = 0; i < t.length; i++) {
    const o = t[i], { grp: r } = e.createWrapper(o);
    n.appendChild(r);
  }
  return n;
}, Nt = function(e, t) {
  const n = (this?.el ? this.el : t || document).querySelector(`[data-nodeid="me${e}"]`);
  if (!n) throw new Error(`FindEle: Node ${e} not found, maybe it's collapsed.`);
  return n;
}, Ue = function(e, t) {
  if (e.innerHTML = "", t.style) {
    const n = t.style;
    for (const i in n)
      e.style[i] = n[i];
  }
  if (t.dangerouslySetInnerHTML) {
    e.innerHTML = t.dangerouslySetInnerHTML;
    return;
  }
  if (t.image) {
    const n = t.image;
    if (n.url && n.width && n.height) {
      const i = document.createElement("img");
      i.src = this.imageProxy ? this.imageProxy(n.url) : n.url, i.style.width = n.width + "px", i.style.height = n.height + "px", n.fit && (i.style.objectFit = n.fit), e.appendChild(i), e.image = i;
    }
  } else e.image && (e.image = void 0);
  {
    const n = document.createElement("span");
    n.className = "text", this.markdown ? n.innerHTML = this.markdown(t.topic, t) : n.textContent = t.topic, e.appendChild(n), e.text = n;
  }
  if (t.hyperLink) {
    const n = document.createElement("a");
    n.className = "hyper-link", n.target = "_blank", n.innerText = "🔗", n.href = t.hyperLink, e.appendChild(n), e.link = n;
  } else e.link && (e.link = void 0);
  if (t.icons && t.icons.length) {
    const n = document.createElement("span");
    n.className = "icons", n.innerHTML = t.icons.map((i) => `<span>${qe(i)}</span>`).join(""), e.appendChild(n), e.icons = n;
  } else e.icons && (e.icons = void 0);
  if (t.tags && t.tags.length) {
    const n = document.createElement("div");
    n.className = "tags", t.tags.forEach((i) => {
      const o = document.createElement("span");
      typeof i == "string" ? o.textContent = i : (o.textContent = i.text, i.className && (o.className = i.className), i.style && Object.assign(o.style, i.style)), n.appendChild(o);
    }), e.appendChild(n), e.tags = n;
  } else e.tags && (e.tags = void 0);
}, Mn = function(e, t) {
  const n = document.createElement("me-wrapper"), { p: i, tpc: o } = this.createParent(e);
  if (n.appendChild(i), !t && e.children && e.children.length > 0) {
    const r = Je(e.expanded);
    if (i.appendChild(r), e.expanded !== !1) {
      const s = Tn(this, e.children);
      n.appendChild(s);
    }
  }
  return { grp: n, top: i, tpc: o };
}, kn = function(e) {
  const t = document.createElement("me-parent"), n = this.createTopic(e);
  return Ue.call(this, n, e), t.appendChild(n), { p: t, tpc: n };
}, _n = function(e) {
  const t = document.createElement("me-children");
  return t.append(...e), t;
}, Dn = function(e) {
  const t = document.createElement("me-tpc");
  return t.nodeObj = e, t.dataset.nodeid = "me" + e.id, t;
};
function Tt(e) {
  const t = document.createRange();
  t.selectNodeContents(e);
  const n = window.getSelection();
  n && (n.removeAllRanges(), n.addRange(t));
}
const Ln = function(e) {
  if (!e) return;
  const t = document.createElement("div"), n = e.nodeObj, i = n.topic, { offsetLeft: o, offsetTop: r } = W(this.nodes, e);
  this.nodes.appendChild(t), t.id = "input-box", t.textContent = i, t.contentEditable = "plaintext-only", t.spellcheck = !1;
  const s = getComputedStyle(e);
  t.style.cssText = `
  left: ${o}px;
  top: ${r}px;
  min-width:${e.offsetWidth - 8}px;
  color:${s.color};
  font-size:${s.fontSize};
  padding:${s.padding};
  margin:${s.margin}; 
  background-color:${s.backgroundColor !== "rgba(0, 0, 0, 0)" && s.backgroundColor};
  border: ${s.border};
  border-radius:${s.borderRadius}; `, this.direction === 0 && (t.style.right = "0"), e.style.opacity = "0", Tt(t), this.bus.fire("operation", {
    name: "beginEdit",
    obj: e.nodeObj
  }), t.addEventListener("keydown", (l) => {
    if (l.stopPropagation(), l.isComposing) return;
    const c = l.key;
    if (c === "Enter" || c === "Tab") {
      if (l.shiftKey) return;
      l.preventDefault(), t.blur(), this.container.focus();
    } else c === "Escape" && (l.preventDefault(), t.textContent = i, t.blur(), this.container.focus());
  }), t.addEventListener("blur", () => {
    if (!t) return;
    e.style.opacity = "1";
    const l = t.innerText?.trim() || "";
    t.remove(), !(l === i || l === "") && (n.topic = l, this.markdown ? e.text.innerHTML = this.markdown(n.topic, n) : e.text.textContent = l, this.linkDiv(), this.bus.fire("operation", {
      name: "finishEdit",
      obj: n,
      origin: i
    }));
  });
}, Je = function(e) {
  const t = document.createElement("me-epd");
  return t.expanded = e !== !1, t.className = e !== !1 ? "minus" : "", t;
}, Pe = (e) => {
  const t = e.parent?.children, n = t?.indexOf(e) ?? 0;
  return { siblings: t, index: n };
};
function Mt(e) {
  const { siblings: t, index: n } = Pe(e);
  return t === void 0 ? 0 : (t.splice(n, 1), t.length);
}
function An(e, t, n) {
  const { siblings: i, index: o } = Pe(n);
  i !== void 0 && (t === "before" ? i.splice(o, 0, e) : i.splice(o + 1, 0, e));
}
function $n(e, t) {
  const { siblings: n, index: i } = Pe(e);
  n !== void 0 && (n[i] = t, t.children = [e]);
}
function Pn(e, t, n) {
  if (Mt(t), n.parent?.parent || (t.direction = n.direction), e === "in")
    n.children ? n.children.push(t) : n.children = [t];
  else {
    t.direction !== void 0 && (t.direction = n.direction);
    const { siblings: i, index: o } = Pe(n);
    if (i === void 0) return;
    e === "before" ? i.splice(o, 0, t) : i.splice(o + 1, 0, t);
  }
}
const On = function({ map: e, direction: t }, n) {
  if (t === 0)
    return 0;
  if (t === 1)
    return 1;
  if (t === 3)
    return 3;
  if (t === 2) {
    const i = e.querySelector(".lhs")?.childElementCount || 0, o = e.querySelector(".rhs")?.childElementCount || 0;
    return i <= o ? (n.direction = 0, 0) : (n.direction = 1, 1);
  }
}, kt = function(e, t, n) {
  const i = n.children[0].children[0], o = t.parentElement;
  if (o.tagName === "ME-PARENT") {
    if (ye(i), o.children[1])
      o.nextSibling.appendChild(n);
    else {
      const r = e.createChildren([n]);
      o.appendChild(Je(!0)), o.insertAdjacentElement("afterend", r);
    }
    e.linkDiv(n.offsetParent);
  } else if (o.tagName === "ME-ROOT") {
    const r = On(e, i.nodeObj);
    r === 3 ? e.container.querySelector("me-main.down")?.appendChild(n) : r === 0 ? e.container.querySelector(".lhs")?.appendChild(n) : e.container.querySelector(".rhs")?.appendChild(n), e.linkDiv();
  }
}, jn = function(e, t) {
  const n = e.parentNode;
  if (t === 0) {
    const i = n.parentNode.parentNode;
    i.tagName !== "ME-MAIN" && (i.previousSibling.children[1].remove(), i.remove());
  }
  n.parentNode.remove();
}, _t = {
  before: "beforebegin",
  after: "afterend"
}, ye = function(e) {
  const t = e.parentElement.parentElement.lastElementChild;
  t?.tagName === "svg" && t?.remove();
}, Hn = function(e, t) {
  const n = e.nodeObj, i = ce(n);
  i.style && t.style && (t.style = Object.assign(i.style, t.style));
  const o = Object.assign(n, t);
  Ue.call(this, e, o), this.linkDiv(), this.bus.fire("operation", {
    name: "reshapeNode",
    obj: o,
    origin: i
  });
}, Qe = function(e, t, n) {
  if (!t) return null;
  const i = t.nodeObj;
  i.expanded === !1 && (e.expandNode(t, !0), t = e.findEle(i.id));
  const o = n || e.generateNewObj();
  i.children ? i.children.push(o) : i.children = [o], Q(e.nodeData);
  const { grp: r, top: s } = e.createWrapper(o);
  return kt(e, t, r), { newTop: s, newNodeObj: o };
}, In = function(e, t, n) {
  const i = t || this.currentNode;
  if (!i) return;
  const o = i.nodeObj;
  if (o.parent) {
    if (!o.parent?.parent && this.direction === 2) {
      const a = this.map.querySelector(".lhs")?.childElementCount || 0, d = this.map.querySelector(".rhs")?.childElementCount || 0;
      if (!a || !d) {
        this.addChild(this.findEle(o.parent.id), n);
        return;
      }
    }
  } else {
    this.addChild();
    return;
  }
  const r = n || this.generateNewObj();
  if (!o.parent?.parent) {
    const a = i.closest("me-main").className === H.LHS ? 0 : 1;
    r.direction = a;
  }
  An(r, e, o), Q(this.nodeData);
  const s = i.parentElement, { grp: l, top: c } = this.createWrapper(r);
  s.parentElement.insertAdjacentElement(_t[e], l), this.linkDiv(l.offsetParent), n || this.editTopic(c.firstChild), this.bus.fire("operation", {
    name: "insertSibling",
    type: e,
    obj: r
  }), this.selectNode(c.firstChild, !0);
}, Bn = function(e, t) {
  const n = e || this.currentNode;
  if (!n) return;
  ye(n);
  const i = n.nodeObj;
  if (!i.parent)
    return;
  const o = t || this.generateNewObj();
  if (!i.parent?.parent) {
    const a = n.closest("me-main").className === H.LHS ? 0 : 1;
    o.direction = a;
  }
  $n(i, o), Q(this.nodeData);
  const r = n.parentElement.parentElement, { grp: s, top: l } = this.createWrapper(o, !0);
  l.appendChild(Je(!0)), r.insertAdjacentElement("afterend", s);
  const c = this.createChildren([r]);
  l.insertAdjacentElement("afterend", c), this.linkDiv(), t || this.editTopic(l.firstChild), this.bus.fire("operation", {
    name: "insertParent",
    obj: o
  }), this.selectNode(l.firstChild, !0);
}, Wn = function(e, t) {
  const n = e || this.currentNode;
  if (!n) return;
  const i = Qe(this, n, t);
  if (!i) return;
  const { newTop: o, newNodeObj: r } = i;
  this.bus.fire("operation", {
    name: "addChild",
    obj: r
  }), t || this.editTopic(o.firstChild), this.selectNode(o.firstChild, !0);
}, Rn = function(e, t) {
  const n = ce(e.nodeObj);
  Xe(n);
  const i = Qe(this, t, n);
  if (!i) return;
  const { newNodeObj: o } = i;
  this.bus.fire("operation", {
    name: "copyNode",
    obj: o
  }), this.selectNode(this.findEle(o.id));
}, Vn = function(e, t) {
  const n = [];
  for (let i = 0; i < e.length; i++) {
    const o = e[i], r = ce(o.nodeObj);
    Xe(r);
    const s = Qe(this, t, r);
    if (!s) return;
    const { newNodeObj: l } = s;
    n.push(l);
  }
  this.bus.fire("operation", {
    name: "copyNodes",
    objs: n
  }), this.unselectNodes(this.currentNodes), this.selectNodes(n.map((i) => this.findEle(i.id)));
}, Dt = function(e, t, n) {
  const i = t.parent?.children;
  if (i === void 0) return;
  const o = e.direction === 2 && !t.parent?.parent, r = (c) => !o || c.direction === t.direction;
  let s, l = !1;
  for (const c of i)
    if (r(c)) {
      if (c === t) {
        if (n === -1) return s ? { to: s, type: "before" } : void 0;
        l = !0;
        continue;
      }
      if (l) return { to: c, type: "after" };
      s = c;
    }
}, Yn = function(e) {
  const t = e || this.currentNode;
  if (!t) return;
  const n = t.nodeObj;
  if (!n.parent) return;
  const i = Dt(this, n, -1);
  i && be([t], i.type, this.findEle(i.to.id), this);
}, qn = function(e) {
  const t = e || this.currentNode;
  if (!t) return;
  const n = t.nodeObj;
  if (!n.parent) return;
  const i = Dt(this, n, 1);
  i && be([t], i.type, this.findEle(i.to.id), this);
}, Fn = function(e) {
  if (e = ze(e), e.length === 0) return;
  for (const n of e) {
    const i = n.nodeObj, o = Mt(i);
    jn(n, o);
  }
  const t = e[e.length - 1];
  this.selectNode(this.findEle(t.nodeObj.parent.id)), this.linkDiv(), this.bus.fire("operation", {
    name: "removeNodes",
    objs: e.map((n) => n.nodeObj)
  });
}, be = (e, t, n, i) => {
  e = ze(e);
  let o = n.nodeObj;
  t === "in" && o.expanded === !1 && (i.expandNode(n, !0), n = i.findEle(o.id), o = n.nodeObj), t === "after" && (e = e.reverse());
  const r = /* @__PURE__ */ new Set();
  for (const l of e) {
    const c = l.nodeObj;
    if (Pn(t, c, o), Q(i.nodeData), t === "in") {
      const a = l.parentElement.parentElement, d = a.parentElement;
      kt(i, n, a), r.add(d);
    } else {
      ye(l);
      const a = l.parentElement.parentNode;
      r.add(a.parentElement), n.parentElement.parentNode.insertAdjacentElement(_t[t], a);
    }
  }
  for (const l of r)
    l.childElementCount === 0 && l.tagName !== "ME-MAIN" && (l.previousSibling.children[1].remove(), l.remove());
  i.linkDiv(), i.scrollIntoView(e[e.length - 1]);
  const s = t === "before" ? "moveNodeBefore" : t === "after" ? "moveNodeAfter" : "moveNodeIn";
  i.bus.fire("operation", {
    name: s,
    objs: e.map((l) => l.nodeObj),
    toObj: o
  });
}, Kn = function(e, t) {
  be(e, "in", t, this);
}, Xn = function(e, t) {
  be(e, "before", t, this);
}, zn = function(e, t) {
  be(e, "after", t, this);
}, Gn = function(e) {
  const t = e || this.currentNode;
  t && (t.nodeObj.dangerouslySetInnerHTML || this.editTopic(t));
}, Un = function(e, t) {
  e.text.textContent = t, e.nodeObj.topic = t, this.linkDiv();
}, Lt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  addChild: Wn,
  beginEdit: Gn,
  copyNode: Rn,
  copyNodes: Vn,
  insertParent: Bn,
  insertSibling: In,
  moveDownNode: qn,
  moveNodeAfter: zn,
  moveNodeBefore: Xn,
  moveNodeIn: Kn,
  moveUpNode: Yn,
  removeNodes: Fn,
  reshapeNode: Hn,
  rmSubline: ye,
  setNodeTopic: Un
}, Symbol.toStringTag, { value: "Module" }));
function Jn(e) {
  return {
    nodeData: e.isFocusMode ? e.nodeDataBackup : e.nodeData,
    arrows: e.arrows,
    summaries: e.summaries,
    direction: e.direction,
    theme: e.theme,
    compact: e.compact,
    meta: e.meta
  };
}
const Qn = function(e, t = !1) {
  const n = this.container, i = e.getBoundingClientRect(), o = n.getBoundingClientRect();
  if (t || i.top > o.bottom - 50 || i.bottom < o.top + 50 || i.left > o.right - 50 || i.right < o.left + 50) {
    const r = i.left + i.width / 2, s = i.top + i.height / 2, l = o.left + o.width / 2, c = o.top + o.height / 2, a = r - l, d = s - c;
    this.move(-a, -d, !0);
  }
}, Zn = function(e, t, n) {
  this.clearSelection(), this.scrollIntoView(e), this.selection?.select(e), t && this.bus.fire("selectNewNode", e.nodeObj);
}, ei = function(e) {
  this.selection?.select(e);
}, ti = function(e) {
  this.selection?.deselect(e);
}, ni = function() {
  this.unselectNodes(this.currentNodes), this.unselectSummary(), this.unselectArrow();
}, Ze = function(e) {
  return JSON.stringify(e, (t, n) => {
    if (!(t === "parent" && typeof n != "string"))
      return n;
  });
}, ii = function() {
  const e = Jn(this);
  return Ze(e);
}, oi = function() {
  return JSON.parse(this.getDataString());
}, ri = function() {
  this.editable = !0;
}, si = function() {
  this.editable = !1;
}, li = function(e, t = { x: 0, y: 0 }) {
  if (e < this.scaleMin && e < this.scaleVal || e > this.scaleMax && e > this.scaleVal) return;
  const n = this.container.getBoundingClientRect(), i = t.x ? t.x - n.left - n.width / 2 : 0, o = t.y ? t.y - n.top - n.height / 2 : 0, { dx: r, dy: s } = et(this), l = this.map.style.transform, { x: c, y: a } = Ge(l), d = c - r, h = a - s, p = this.scaleVal, f = (-i + d) * (1 - e / p), y = (-o + h) * (1 - e / p);
  this.map.style.transform = `translate3d(${c - f}px, ${a - y}px, 0) scale(${e})`, this.scaleVal = e, this.bus.fire("scale", e);
}, ai = function() {
  const e = this.nodes.offsetHeight / this.container.offsetHeight, t = this.nodes.offsetWidth / this.container.offsetWidth, n = 1 / Math.max(1, Math.max(e, t));
  this.scaleVal = n;
  const { dx: i, dy: o } = et(this, !0);
  this.map.style.transform = `translate3d(${i}px, ${o}px, 0) scale(${n})`, this.bus.fire("scale", n);
}, ci = function(e, t, n = !1) {
  const { map: i, scaleVal: o, bus: r, container: s, nodes: l } = this;
  if (n && i.style.transition === "transform 0.3s")
    return !1;
  const c = i.style.transform;
  let { x: a, y: d } = Ge(c);
  const h = s.getBoundingClientRect(), p = l.getBoundingClientRect(), f = (h.left + h.right) / 2, y = (h.top + h.bottom) / 2;
  return e > 0 ? e = Math.min(e, Math.max(0, f - p.left)) : e < 0 && (e = Math.max(e, Math.min(0, f - p.right))), t > 0 ? t = Math.min(t, Math.max(0, y - p.top)) : t < 0 && (t = Math.max(t, Math.min(0, y - p.bottom))), e === 0 && t === 0 ? !1 : (a += e, d += t, n && (i.style.transition = "transform 0.3s", setTimeout(() => {
    i.style.transition = "none";
  }, 300)), i.style.transform = `translate3d(${a}px, ${d}px, 0) scale(${o})`, r.fire("move", { dx: e, dy: t }), !0);
}, et = (e, t = !1) => {
  const { container: n, map: i, nodes: o } = e;
  let r, s;
  if (e.alignment === "nodes" || t || e.direction === 3)
    r = (n.offsetWidth - o.offsetWidth) / 2, s = (n.offsetHeight - o.offsetHeight) / 2, i.style.transformOrigin = "50% 50%";
  else {
    const l = i.querySelector("me-root"), c = l.offsetTop, a = l.offsetLeft, d = l.offsetWidth, h = l.offsetHeight;
    r = n.offsetWidth / 2 - a - d / 2, s = n.offsetHeight / 2 - c - h / 2, i.style.transformOrigin = `${a + d / 2}px 50%`;
  }
  return { dx: r, dy: s };
}, di = function() {
  const { map: e, container: t } = this, { dx: n, dy: i } = et(this);
  t.scrollTop = 0, t.scrollLeft = 0, e.style.transform = `translate3d(${n}px, ${i}px, 0) scale(${this.scaleVal})`;
}, hi = function(e) {
  e(this);
}, ui = function(e) {
  e.nodeObj.parent && (this.clearSelection(), this.tempDirection === null && (this.tempDirection = this.direction), this.isFocusMode || (this.nodeDataBackup = this.nodeData, this.isFocusMode = !0), this.nodeData = e.nodeObj, this.initRight(), this.toCenter());
}, pi = function() {
  this.isFocusMode = !1, this.tempDirection !== null && (this.nodeData = this.nodeDataBackup, this.direction = this.tempDirection, this.tempDirection = null, this.refresh(), this.toCenter());
}, fi = function() {
  this.direction = 0, this.refresh(), this.toCenter(), this.bus.fire("changeDirection", this.direction);
}, mi = function() {
  this.direction = 1, this.refresh(), this.toCenter(), this.bus.fire("changeDirection", this.direction);
}, gi = function() {
  this.direction = 2, this.refresh(), this.toCenter(), this.bus.fire("changeDirection", this.direction);
}, yi = function() {
  this.direction = 3, this.refresh(), this.toCenter(), this.bus.fire("changeDirection", this.direction);
}, bi = function(e, t) {
  const n = e.nodeObj;
  typeof t == "boolean" ? n.expanded = t : n.expanded !== !1 ? n.expanded = !1 : n.expanded = !0;
  const i = e.getBoundingClientRect(), o = {
    x: i.left,
    y: i.top
  }, r = e.parentNode, s = r.children[1];
  if (s.expanded = n.expanded, s.className = n.expanded ? "minus" : "", ye(e), n.expanded) {
    const h = this.createChildren(
      n.children.map((p) => this.createWrapper(p).grp)
    );
    r.parentNode.appendChild(h);
  } else
    r.parentNode.children[1].remove();
  this.linkDiv(e.closest("me-main > me-wrapper"));
  const l = e.getBoundingClientRect(), c = {
    x: l.left,
    y: l.top
  }, a = o.x - c.x, d = o.y - c.y;
  this.move(a, d), this.bus.fire("expandNode", n);
}, vi = function(e, t) {
  const n = e.nodeObj, i = e.getBoundingClientRect(), o = {
    x: i.left,
    y: i.top
  };
  ae(n, t ?? !n.expanded), this.refresh();
  const r = this.findEle(n.id).getBoundingClientRect(), s = {
    x: r.left,
    y: r.top
  }, l = o.x - s.x, c = o.y - s.y;
  this.move(l, c);
}, wi = function(e) {
  this.clearSelection(), e && (e = JSON.parse(JSON.stringify(e)), this.nodeData = e.nodeData, this.arrows = e.arrows || [], this.summaries = e.summaries || [], e.meta && (this.meta = e.meta)), Q(this.nodeData), this.layout(), this.linkDiv();
}, xi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  cancelFocus: pi,
  clearSelection: ni,
  disableEdit: si,
  enableEdit: ri,
  expandNode: bi,
  expandNodeAll: vi,
  focusNode: ui,
  getData: oi,
  getDataString: ii,
  initDown: yi,
  initLeft: fi,
  initRight: mi,
  initSide: gi,
  install: hi,
  move: ci,
  refresh: wi,
  scale: li,
  scaleFit: ai,
  scrollIntoView: Qn,
  selectNode: Zn,
  selectNodes: ei,
  stringifyData: Ze,
  toCenter: di,
  unselectNodes: ti
}, Symbol.toStringTag, { value: "Module" })), ct = "MIND-ELIXIR-WAIT-COPY", Ei = 40, Si = 10, Ci = ({ deltaMode: e, deltaY: t, viewportHeight: n }) => e === WheelEvent.DOM_DELTA_LINE ? t * Ei : e === WheelEvent.DOM_DELTA_PAGE ? t * n : t, Ni = ({ deltaMode: e, deltaY: t, scaleSensitivity: n, viewportHeight: i }) => {
  const o = -Ci({ deltaMode: e, deltaY: t, viewportHeight: i }) / Si * n;
  return Math.max(-n, Math.min(n, o));
}, At = (e, t, n) => {
  t !== 0 && e.scale(e.scaleVal + t, n);
}, Ti = (e, t) => {
  const n = e.map.querySelectorAll(`.${t}>me-wrapper>me-parent>me-tpc`);
  n.length !== 0 && e.selectNode(n[Math.ceil(n.length / 2) - 1]);
}, $t = (e) => {
  e.selectNode(e.map.querySelector("me-root>me-tpc"));
}, Pt = function(e, t) {
  const n = t.parentElement.parentElement.parentElement.previousSibling;
  if (n) {
    const i = n.firstChild;
    e.selectNode(i);
  }
}, Ot = function(e, t) {
  const n = t.parentElement.nextSibling;
  if (n && n.firstChild) {
    const i = n.firstChild.firstChild.firstChild;
    e.selectNode(i);
  }
}, dt = function(e, t) {
  const n = e.currentNode || e.currentNodes?.[0];
  if (!n) return;
  const i = n.nodeObj, o = n.offsetParent.offsetParent.parentElement;
  i.parent ? o.className === t ? Ot(e, n) : i.parent?.parent ? Pt(e, n) : $t(e) : Ti(e, t);
}, Ce = function(e, t) {
  const n = e.currentNode;
  if (!n || !n.nodeObj.parent) return;
  const i = t + "Sibling", o = n.parentElement.parentElement[i];
  o ? e.selectNode(o.firstChild.firstChild) : e.selectNode(n);
}, Mi = function(e, t) {
  const n = t.nodeObj;
  n.parent && (n.parent.parent ? Pt(e, t) : $t(e));
}, ki = function(e, t) {
  if (t.nodeObj.parent)
    Ot(e, t);
  else {
    const n = e.map.querySelectorAll(".down>me-wrapper>me-parent>me-tpc");
    if (n.length === 0) return;
    e.selectNode(n[Math.ceil(n.length / 2) - 1]);
  }
}, ht = function(e, t, n) {
  const i = t === "in" ? e.scaleSensitivity : -e.scaleSensitivity;
  At(e, i, n);
}, _i = (e, t) => {
  const n = Ni({
    deltaMode: t.deltaMode,
    deltaY: t.deltaY,
    scaleSensitivity: e.scaleSensitivity,
    viewportHeight: e.container.clientHeight || window.innerHeight
  });
  At(e, n, { x: t.clientX, y: t.clientY });
};
function Di(e, t) {
  t = t === !0 ? {} : t;
  const n = () => {
    e.currentArrow ? e.removeArrow() : e.currentSummary ? e.removeSummary(e.currentSummary.summaryObj.id) : e.currentNodes && e.removeNodes(e.currentNodes);
  };
  let i = !1, o = null;
  const r = () => {
    i = !1, o && (clearTimeout(o), o = null), e.container.removeEventListener("keydown", s);
  }, s = (a) => {
    if (["Control", "Meta", "Shift", "Alt"].includes(a.key)) return;
    const d = e.nodeData;
    if (!d.children?.length) {
      r();
      return;
    }
    let h = !0;
    if (a.key === "0")
      for (const p of d.children)
        ae(p, !1);
    else if (a.key === "=")
      for (const p of d.children)
        ae(p, !0);
    else if (["1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(a.key))
      for (const p of d.children)
        ae(p, !0, Number(a.key) - 1);
    else
      h = !1;
    h && (e.refresh(), e.toCenter()), r();
  }, l = {
    Enter: (a) => {
      a.shiftKey ? e.insertSibling("before") : a.ctrlKey || a.metaKey ? e.insertParent() : e.insertSibling("after");
    },
    Tab: () => {
      e.addChild();
    },
    F1: () => {
      e.toCenter();
    },
    F2: () => {
      e.currentSummary ? e.editSummary(e.currentSummary) : e.currentArrow ? e.editArrowLabel(e.currentArrow) : e.beginEdit();
    },
    ArrowUp: (a) => {
      if (a.altKey)
        e.moveUpNode();
      else {
        if (a.metaKey || a.ctrlKey)
          return e.initSide();
        if (e.direction === 3) {
          const d = e.currentNode || e.currentNodes?.[0];
          d && Mi(e, d);
        } else
          Ce(e, "previous");
      }
    },
    ArrowDown: (a) => {
      if (a.altKey)
        e.moveDownNode();
      else if (e.direction === 3) {
        const d = e.currentNode || e.currentNodes?.[0];
        d && ki(e, d);
      } else
        Ce(e, "next");
    },
    ArrowLeft: (a) => {
      if (a.metaKey || a.ctrlKey)
        return e.initLeft();
      e.direction === 3 ? Ce(e, "previous") : dt(e, H.LHS);
    },
    ArrowRight: (a) => {
      if (a.metaKey || a.ctrlKey)
        return e.initRight();
      e.direction === 3 ? Ce(e, "next") : dt(e, H.RHS);
    },
    PageUp: () => e.moveUpNode(),
    PageDown: () => {
      e.moveDownNode();
    },
    "=": (a) => {
      (a.metaKey || a.ctrlKey) && ht(e, "in");
    },
    "-": (a) => {
      (a.metaKey || a.ctrlKey) && ht(e, "out");
    },
    0: (a) => {
      if (a.metaKey || a.ctrlKey) {
        if (i)
          return;
        e.scale(1);
      }
    },
    k: (a) => {
      (a.metaKey || a.ctrlKey) && (r(), i = !0, o = window.setTimeout(() => {
        o = null, r();
      }, 2e3), e.container.addEventListener("keydown", s));
    },
    Delete: n,
    Backspace: n,
    ...t
  };
  e.container.onkeydown = (a) => {
    if ((a.ctrlKey || a.metaKey) && ["c", "v", "x"].includes(a.key) || a.preventDefault(), !e.editable) return;
    const d = l[a.key];
    d && d(a);
  };
  const c = (a) => {
    if (a.target instanceof HTMLElement && a.target.id === "input-box" || e.currentNodes.length === 0) return !1;
    if (a.clipboardData) {
      const d = ze(e.currentNodes).map((p) => p.nodeObj), h = Ze({
        magic: ct,
        data: d
      });
      return a.clipboardData.setData("text/plain", h), a.preventDefault(), !0;
    }
    return !1;
  };
  e.container.addEventListener("copy", c), e.container.addEventListener("cut", (a) => {
    c(a) && n();
  }), e.container.addEventListener("paste", (a) => {
    const d = a.clipboardData?.getData("text/plain");
    if (d)
      try {
        const h = JSON.parse(d);
        if (h && h.magic === ct && Array.isArray(h.data)) {
          const p = h.data, f = p.map((y) => ({ nodeObj: y }));
          p.length > 0 && e.currentNode && (e.copyNodes(f, e.currentNode), a.preventDefault());
          return;
        }
      } catch {
      }
    e.pasteHandler && e.pasteHandler(a);
  });
}
function Li(e) {
  const { panHelper: t, container: n } = e;
  let i = null;
  e.spacePressed = !1;
  const o = {
    lastTap: 0,
    lastTapTarget: null,
    DOUBLE_CLICK_THRESHOLD: 300,
    detect(u, v) {
      if (u.button !== 0) {
        this.clear();
        return;
      }
      const E = (/* @__PURE__ */ new Date()).getTime(), C = E - this.lastTap, N = C < this.DOUBLE_CLICK_THRESHOLD && C > 0 && this.lastTapTarget === u.target;
      this.lastTap = E, this.lastTapTarget = u.target, N && v(u);
    },
    clear() {
      this.lastTap = 0, this.lastTapTarget = null;
    }
  }, r = {
    Idle: 0,
    Pinch: 1,
    DragWait: 2,
    Drag: 3,
    Pan: 4,
    BoxSelect: 5
  };
  e.ptState = r.Idle;
  const s = {
    lastDistance: null,
    activePointers: /* @__PURE__ */ new Map(),
    handlePointerDown(u) {
      if (u.pointerType !== "touch") return !1;
      if (this.activePointers.set(u.pointerId, { x: u.clientX, y: u.clientY }), this.activePointers.size >= 2) {
        const [v, E] = Array.from(this.activePointers.values());
        return this.lastDistance = rt(v, E), !0;
      }
      return !1;
    },
    handlePointerMove(u) {
      if (u.pointerType !== "touch" || !this.activePointers.has(u.pointerId)) return !1;
      if (this.activePointers.set(u.pointerId, { x: u.clientX, y: u.clientY }), this.activePointers.size >= 2) {
        const [v, E] = Array.from(this.activePointers.values()), C = rt(v, E);
        if (this.lastDistance !== null && this.lastDistance > 0) {
          const N = C / this.lastDistance;
          e.scale(e.scaleVal * N, {
            x: (v.x + E.x) / 2,
            y: (v.y + E.y) / 2
          });
        }
        return this.lastDistance = C, !0;
      }
      return !1;
    },
    handlePointerUp(u) {
      u.pointerType === "touch" && (this.activePointers.delete(u.pointerId), this.activePointers.size < 2 && (this.lastDistance = null));
    },
    clear() {
      this.activePointers.clear(), this.lastDistance = null;
    }
  }, l = vn(e), c = {
    timer: null,
    startPos: null,
    pointerId: null,
    DURATION: 500,
    MOVE_THRESHOLD: 10,
    clear() {
      this.timer !== null && (clearTimeout(this.timer), this.timer = null, this.startPos = null, this.pointerId = null);
    },
    start(u, v) {
      this.timer = window.setTimeout(() => {
        v(u), this.timer = null, this.startPos = null, this.pointerId = null;
      }, this.DURATION), this.startPos = { x: u.clientX, y: u.clientY }, this.pointerId = u.pointerId;
    },
    handleMove(u) {
      if (this.timer !== null && this.startPos !== null && u.pointerId === this.pointerId) {
        const v = u.clientX - this.startPos.x, E = u.clientY - this.startPos.y;
        Math.sqrt(v * v + E * E) > this.MOVE_THRESHOLD && this.clear();
      }
    }
  }, a = (u, v) => {
    if (u.closest("#input-box")) return !1;
    const E = u.closest(".svg-label"), C = u.closest(".topiclinks, .summary"), N = E ? { type: E.dataset.type, element: document.getElementById(E.dataset.svgId) } : C ? { type: C.classList.contains("topiclinks") ? "arrow" : "summary", element: u.closest("g") } : null;
    if (!N?.type || !N?.element) return !1;
    const { type: D, element: k } = N;
    return e.clearSelection(), D === "arrow" ? v ? e.editArrowLabel(k) : e.selectArrow(k) : v ? e.editSummary(k) : e.selectSummary(k), !0;
  }, d = (u) => {
    if (u.pointerType === "mouse" && u.button !== 0) return;
    if (e.helper1?.moved) {
      e.helper1.clear();
      return;
    }
    if (e.helper2?.moved) {
      e.helper2.clear();
      return;
    }
    if (t.moved) {
      t.clear();
      return;
    }
    if (l?.isDragging)
      return;
    const v = u.target;
    v.tagName === "ME-EPD" && (u.ctrlKey || u.metaKey ? e.expandNodeAll(v.previousSibling) : e.expandNode(v.previousSibling));
  }, h = (u) => {
    if (!e.editable) return;
    const v = u.target;
    if (_e(v)) {
      e.selectNode(v), e.beginEdit(v);
      return;
    }
    a(v, !0);
  }, p = (u) => {
    if (u.pointerType === "touch" && s.handlePointerDown(u)) {
      e.ptState = r.Pinch, c.clear(), t.clear(), (l.isDragging || l.pointerId !== null) && at(e, l);
      return;
    }
    if (e.ptState === r.Pinch) return;
    const v = u.target;
    if (e.editable && v.className === "map-container" && u.button === 0 && u.pointerType === "mouse") {
      e.ptState = r.BoxSelect;
      return;
    }
    if (t.handlePointerDown(u), t.mousedown && (e.ptState = r.Pan), u.button === 0 || u.pointerType === "touch")
      if (_e(v)) {
        e.selection?.cancel();
        const E = e.currentNodes || [];
        if (u.ctrlKey || u.metaKey || e.mobileMultiSelect ? E.includes(v) ? i = v : ((e.currentArrow || e.currentSummary) && e.clearSelection(), e.selection?.select(v)) : E.includes(v) || e.selectNode(v), !e.editable) return;
        u.pointerType === "touch" ? (e.ptState = r.DragWait, c.start(u, (C) => {
          lt(e, l, C, !0) && (e.ptState = r.Drag, v.setPointerCapture(C.pointerId));
        })) : lt(e, l, u, !1) && (e.ptState = r.Drag, v.setPointerCapture(u.pointerId));
      } else
        a(v, !1);
  }, f = (u) => {
    switch (e.ptState) {
      case r.Pinch:
        s.handlePointerMove(u);
        break;
      case r.DragWait:
        c.handleMove(u), c.timer === null && (e.ptState = r.Pan, t.handlePointerMove(u));
        break;
      case r.Drag:
        xn(e, l, u);
        break;
      case r.Pan:
        t.handlePointerMove(u);
        break;
    }
  }, y = (u) => {
    u.preventDefault(), window.removeEventListener("contextmenu", y, !0);
  }, w = (u) => {
    u.pointerType === "touch" && s.handlePointerUp(u);
    const v = l.isDragging, E = t.moved;
    switch (e.ptState) {
      case r.DragWait:
        c.clear();
        break;
      case r.Drag:
        En(e, l, u);
        break;
      case r.Pan:
        t.handlePointerUp(u), t.moved && u.button === 2 && u.pointerType === "mouse" && (window.addEventListener("contextmenu", y, { capture: !0, once: !0 }), setTimeout(() => window.removeEventListener("contextmenu", y, !0), 300));
        break;
    }
    o.detect(u, h), (e.ptState !== r.Pinch || s.activePointers.size < 2) && (e.ptState = r.Idle), i && (!v && !E && e.selection?.deselect(i), i = null);
  }, b = () => {
    s.clear(), c.clear(), t.clear(), o.clear(), (l.isDragging || l.pointerId !== null) && at(e, l), e.ptState = r.Idle, i = null;
  }, m = (u) => {
    u.preventDefault(), u.button === 2 && e.editable && setTimeout(() => {
      if (e.panHelper.moved || e.ptState !== r.Idle && e.ptState !== r.Pan) return;
      const v = u.target;
      _e(v) && !v.classList.contains("selected") && e.selectNode(v), e.bus.fire("showContextMenu", u);
    }, 200);
  }, x = (u) => {
    if (u.ctrlKey || u.metaKey)
      return u.stopPropagation(), u.preventDefault(), _i(e, u);
    (u.shiftKey ? e.move(-u.deltaY, 0) : e.move(-u.deltaX, -u.deltaY)) && (u.stopPropagation(), u.preventDefault());
  }, M = (u) => {
    u.code === "Space" && (e.spacePressed = !0, e.container.classList.add("space-pressed"));
  }, T = (u) => {
    u.code === "Space" && (e.spacePressed = !1, e.container.classList.remove("space-pressed"));
  };
  return Et([
    { dom: n, evt: "pointerdown", func: p },
    { dom: n, evt: "pointermove", func: f },
    { dom: n, evt: "pointerup", func: w },
    { dom: n, evt: "pointercancel", func: b },
    { dom: n, evt: "click", func: d },
    { dom: n, evt: "contextmenu", func: m },
    { dom: n, evt: "wheel", func: typeof e.handleWheel == "function" ? e.handleWheel : x },
    { dom: n, evt: "blur", func: b },
    { dom: n, evt: "keydown", func: M },
    { dom: n, evt: "keyup", func: T }
  ]);
}
function Ai() {
  return {
    handlers: {},
    addListener: function(e, t) {
      this.handlers[e] === void 0 && (this.handlers[e] = []), this.handlers[e].push(t);
    },
    fire: function(e, ...t) {
      if (this.handlers[e] instanceof Array) {
        const n = this.handlers[e];
        for (let i = 0; i < n.length; i++)
          n[i](...t);
      }
    },
    removeListener: function(e, t) {
      if (!this.handlers[e]) return;
      const n = this.handlers[e];
      if (!t)
        n.length = 0;
      else if (n.length)
        for (let i = 0; i < n.length; i++)
          n[i] === t && this.handlers[e].splice(i, 1);
    }
  };
}
const R = "http://www.w3.org/2000/svg", Oe = function(e) {
  const t = e.clientWidth, n = e.clientHeight, i = e.dataset, o = Number(i.x), r = Number(i.y), s = i.anchor;
  let l = o;
  s === "middle" ? l = o - t / 2 : s === "end" && (l = o - t), e.style.left = `${l}px`, e.style.top = `${r - n / 2}px`, e.style.visibility = "visible";
}, De = function(e, t, n, i) {
  const { anchor: o = "middle", color: r, dataType: s, svgId: l } = i, c = document.createElement("div");
  c.className = "svg-label", c.style.color = r || "#666";
  const a = "label-" + l;
  return c.id = a, c.innerHTML = e, c.dataset.type = s, c.dataset.svgId = l, c.dataset.x = t.toString(), c.dataset.y = n.toString(), c.dataset.anchor = o, c;
}, jt = function(e, t, n) {
  const i = document.createElementNS(R, "path");
  return O(i, {
    d: e,
    stroke: t || "#666",
    fill: "none",
    "stroke-width": n
  }), i;
}, me = function(e) {
  const t = document.createElementNS(R, "svg");
  return t.setAttribute("class", e), t.setAttribute("overflow", "visible"), t;
}, ut = function() {
  const e = document.createElementNS(R, "line");
  return e.setAttribute("stroke", "#4dc4ff"), e.setAttribute("fill", "none"), e.setAttribute("stroke-width", "2"), e.setAttribute("opacity", "0.45"), e;
}, $i = function(e, t, n, i) {
  const o = document.createElementNS(R, "g");
  return [
    {
      name: "line",
      d: e
    },
    {
      name: "arrow1",
      d: t
    },
    {
      name: "arrow2",
      d: n
    }
  ].forEach((r, s) => {
    const l = r.d, c = document.createElementNS(R, "path"), a = {
      d: l,
      stroke: i?.stroke || "rgb(227, 125, 116)",
      fill: "none",
      "stroke-width": String(i?.strokeWidth || "2")
    };
    i?.opacity !== void 0 && (a.opacity = String(i.opacity)), O(c, a), s === 0 && c.setAttribute("stroke-dasharray", i?.strokeDasharray || "8,2");
    const d = document.createElementNS(R, "path");
    O(d, {
      d: l,
      stroke: "transparent",
      fill: "none",
      "stroke-width": "15"
    }), o.appendChild(d), o.appendChild(c), o[r.name] = c;
  }), o;
}, Ht = function(e, t, n) {
  if (!t) return;
  const i = n.label;
  t.style.opacity = "0";
  const o = t.cloneNode(!0);
  e.nodes.appendChild(o), o.id = "input-box", o.textContent = i, o.contentEditable = "plaintext-only", o.spellcheck = !1, o.style.cssText = `
    left:${t.style.left};
    top:${t.style.top}; 
    max-width: 200px;
  `, Tt(o), e.scrollIntoView(o), o.addEventListener("keydown", (r) => {
    if (r.stopPropagation(), r.isComposing) return;
    const s = r.key;
    if (s === "Enter" || s === "Tab") {
      if (r.shiftKey) return;
      r.preventDefault(), o.blur(), e.container.focus();
    }
  }), o.addEventListener("blur", () => {
    if (!o) return;
    const r = o.innerText?.trim() || "";
    r === "" ? n.label = i : n.label = r, t.style.opacity = "1", o.remove(), r !== i && (e.markdown ? t.innerHTML = e.markdown(n.label, n) : t.textContent = n.label, Oe(t), "parent" in n ? e.bus.fire("operation", {
      name: "finishEditSummary",
      obj: n
    }) : e.bus.fire("operation", {
      name: "finishEditArrowLabel",
      obj: n
    }));
  });
}, Pi = function(e) {
  const t = this.map.querySelector("me-root"), n = t.offsetTop, i = t.offsetLeft, o = t.offsetWidth, r = t.offsetHeight, s = this.map.querySelectorAll("me-main > me-wrapper");
  this.lines.innerHTML = "";
  for (let l = 0; l < s.length; l++) {
    const c = s[l], a = c.querySelector("me-tpc"), { offsetLeft: d, offsetTop: h } = W(this.nodes, a), p = a.offsetWidth, f = a.offsetHeight, y = c.parentNode.className, w = this.generateMainBranch({
      pT: n,
      pL: i,
      pW: o,
      pH: r,
      cT: h,
      cL: d,
      cW: p,
      cH: f,
      direction: y,
      containerHeight: this.nodes.offsetHeight,
      containerWidth: this.nodes.offsetWidth
    }), b = this.theme.palette, m = a.nodeObj.branchColor || b[l % b.length];
    if (a.style.borderColor = m, this.lines.appendChild(jt(w, m, "3")), e && e !== c)
      continue;
    const x = me("subLines"), M = c.lastChild;
    M.tagName === "svg" && M.remove(), c.appendChild(x), It(this, x, m, c, y, !0);
  }
  this.labelContainer.innerHTML = "", this.renderArrow(), this.renderSummary(), this.bus.fire("linkDiv");
}, It = function(e, t, n, i, o, r) {
  const s = i.firstChild, l = i.children[1].children;
  if (l.length === 0) return;
  const c = s.offsetTop, a = s.offsetLeft, d = s.offsetWidth, h = s.offsetHeight;
  for (let p = 0; p < l.length; p++) {
    const f = l[p], y = f.firstChild, w = y.offsetTop, b = y.offsetLeft, m = y.offsetWidth, x = y.offsetHeight, M = y.firstChild.nodeObj.branchColor || n, T = e.generateSubBranch({ pT: c, pL: a, pW: d, pH: h, cT: w, cL: b, cW: m, cH: x, direction: o, isFirst: r });
    t.appendChild(jt(T, M, "2"));
    const u = y.children[1];
    if (u) {
      if (!u.expanded) continue;
    } else
      continue;
    It(e, t, M, f, o);
  }
}, Oi = {
  addChild: "Add child",
  addParent: "Add parent",
  addSibling: "Add sibling",
  removeNode: "Remove node",
  focus: "Focus Mode",
  cancelFocus: "Cancel Focus Mode",
  moveUp: "Move up",
  moveDown: "Move down",
  link: "Link",
  linkBidirectional: "Bidirectional Link",
  clickTips: "Please click the target node",
  summary: "Summary"
};
function ji(e, t) {
  const n = {
    focus: !0,
    link: !0,
    locale: Oi
  };
  t = t === !0 ? n : Object.assign(n, t);
  const i = (v) => {
    const E = document.createElement("div");
    return E.innerText = v, E.className = "tips", E;
  }, o = (v, E, C) => {
    const N = document.createElement("li");
    return N.id = v, N.innerHTML = `<span>${qe(E)}</span><span ${C ? 'class="key"' : ""}>${qe(C)}</span>`, N;
  }, r = t.locale, s = o("cm-add_child", r.addChild, "Tab"), l = o("cm-add_parent", r.addParent, "Ctrl + Enter"), c = o("cm-add_sibling", r.addSibling, "Enter"), a = o("cm-remove_child", r.removeNode, "Delete"), d = o("cm-fucus", r.focus, ""), h = o("cm-unfucus", r.cancelFocus, ""), p = o("cm-up", r.moveUp, "PgUp"), f = o("cm-down", r.moveDown, "Pgdn"), y = o("cm-link", r.link, ""), w = o("cm-link-bidirectional", r.linkBidirectional, ""), b = o("cm-summary", r.summary, ""), m = document.createElement("ul");
  if (m.className = "menu-list", m.appendChild(s), m.appendChild(l), m.appendChild(c), m.appendChild(a), t.focus && (m.appendChild(d), m.appendChild(h)), m.appendChild(p), m.appendChild(f), m.appendChild(b), t.link && (m.appendChild(y), m.appendChild(w)), t && t.extend)
    for (let v = 0; v < t.extend.length; v++) {
      const E = t.extend[v], C = o(E.name, E.name, E.key || "");
      m.appendChild(C), C.onclick = (N) => {
        E.onclick(N);
      };
    }
  const x = document.createElement("div");
  x.className = "context-menu", x.appendChild(m), x.hidden = !0, e.container.append(x);
  let M = !0;
  const T = (v) => {
    const E = v.target;
    if (_e(E)) {
      E.parentElement.tagName === "ME-ROOT" ? M = !0 : M = !1, M ? (d.className = "disabled", p.className = "disabled", f.className = "disabled", l.className = "disabled", c.className = "disabled", a.className = "disabled") : (d.className = "", p.className = "", f.className = "", l.className = "", c.className = "", a.className = ""), x.hidden = !1, m.style.top = "", m.style.bottom = "", m.style.left = "", m.style.right = "";
      const C = m.offsetHeight, N = m.offsetWidth, D = m.getBoundingClientRect(), k = v.clientY - D.top, L = v.clientX - D.left;
      C + k > window.innerHeight ? (m.style.top = "", m.style.bottom = "0px") : (m.style.bottom = "", m.style.top = k + 15 + "px"), N + L > window.innerWidth ? (m.style.left = "", m.style.right = "0px") : (m.style.right = "", m.style.left = L + 10 + "px");
    }
  };
  e.bus.addListener("showContextMenu", T), x.onclick = (v) => {
    v.target === x && (x.hidden = !0);
  }, s.onclick = () => {
    e.addChild(), x.hidden = !0;
  }, l.onclick = () => {
    e.insertParent(), x.hidden = !0;
  }, c.onclick = () => {
    M || (e.insertSibling("after"), x.hidden = !0);
  }, a.onclick = () => {
    M || (e.removeNodes(e.currentNodes || []), x.hidden = !0);
  }, d.onclick = () => {
    M || (e.focusNode(e.currentNode), x.hidden = !0);
  }, h.onclick = () => {
    e.cancelFocus(), x.hidden = !0;
  }, p.onclick = () => {
    M || (e.moveUpNode(), x.hidden = !0);
  }, f.onclick = () => {
    M || (e.moveDownNode(), x.hidden = !0);
  };
  const u = (v) => {
    x.hidden = !0;
    const E = e.currentNode, C = i(r.clickTips);
    e.container.appendChild(C), e.map.addEventListener(
      "click",
      (N) => {
        N.preventDefault(), C.remove();
        const D = N.target;
        (D.parentElement.tagName === "ME-PARENT" || D.parentElement.tagName === "ME-ROOT") && e.createArrow(E, D, v);
      },
      {
        once: !0
      }
    );
  };
  return y.onclick = () => u(), w.onclick = () => u({ bidirectional: !0 }), b.onclick = () => {
    x.hidden = !0, e.createSummary(), e.unselectNodes(e.currentNodes);
  }, () => {
    s.onclick = null, l.onclick = null, c.onclick = null, a.onclick = null, d.onclick = null, h.onclick = null, p.onclick = null, f.onclick = null, y.onclick = null, b.onclick = null, x.onclick = null, e.container.oncontextmenu = null;
  };
}
const Hi = function(e) {
  return ["createSummary", "removeSummary", "finishEditSummary"].includes(e.name) ? {
    type: "summary",
    value: e.obj.id
  } : ["createArrow", "removeArrow", "finishEditArrowLabel", "reshapeArrow"].includes(e.name) ? {
    type: "arrow",
    value: e.obj.id
  } : ["removeNodes", "copyNodes", "moveNodeBefore", "moveNodeAfter", "moveNodeIn"].includes(e.name) ? {
    type: "nodes",
    value: e.objs.map((t) => t.id)
  } : {
    type: "nodes",
    value: [e.obj.id]
  };
};
function Ii(e) {
  let t = [], n = -1, i = e.getData(), o = [];
  e.undo = function() {
    if (n > -1) {
      const c = t[n];
      i = c.prev, e.refresh(c.prev);
      try {
        c.currentTarget.type === "nodes" && (c.operation === "removeNodes" ? e.selectNodes(c.currentTarget.value.map((a) => this.findEle(a))) : e.selectNodes(c.currentSelected.map((a) => this.findEle(a))));
      } catch {
      } finally {
        n--;
      }
    }
  }, e.redo = function() {
    if (n < t.length - 1) {
      n++;
      const c = t[n];
      i = c.next, e.refresh(c.next);
      try {
        c.currentTarget.type === "nodes" && (c.operation === "removeNodes" ? e.selectNodes(c.currentSelected.map((a) => this.findEle(a))) : e.selectNodes(c.currentTarget.value.map((a) => this.findEle(a))));
      } catch {
      }
    }
  }, e.clearHistory = function() {
    t = [], n = -1, i = e.getData(), e.clearSelection();
  };
  const r = function(c) {
    if (c.name === "beginEdit") return;
    t = t.slice(0, n + 1);
    const a = e.getData(), d = {
      prev: i,
      operation: c.name,
      currentSelected: o.map((h) => h.id),
      currentTarget: Hi(c),
      next: a
    };
    t.push(d), i = a, n = t.length - 1;
  }, s = function(c) {
    if (!e.editable || !c.metaKey && !c.ctrlKey) return;
    const a = c.key.toLowerCase();
    a === "z" ? c.shiftKey ? e.redo() : e.undo() : a === "y" && e.redo();
  }, l = function() {
    o = e.currentNodes.map((c) => c.nodeObj);
  };
  return e.bus.addListener("operation", r), e.bus.addListener("selectNodes", l), e.bus.addListener("unselectNodes", l), e.container.addEventListener("keydown", s), () => {
    e.bus.removeListener("operation", r), e.bus.removeListener("selectNodes", l), e.bus.removeListener("unselectNodes", l), e.container.removeEventListener("keydown", s);
  };
}
const Bi = '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg t="1750169394918" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2021" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200"><path d="M851.91168 328.45312c-59.97056 0-108.6208 48.47104-108.91264 108.36992l-137.92768 38.4a109.14304 109.14304 0 0 0-63.46752-46.58688l1.39264-137.11872c47.29344-11.86816 82.31936-54.66624 82.31936-105.64096 0-60.15488-48.76288-108.91776-108.91776-108.91776s-108.91776 48.76288-108.91776 108.91776c0 49.18784 32.60928 90.75712 77.38368 104.27392l-1.41312 138.87488a109.19936 109.19936 0 0 0-63.50336 48.55808l-138.93632-39.48544 0.01024-0.72704c0-60.15488-48.76288-108.91776-108.91776-108.91776s-108.91776 48.75776-108.91776 108.91776c0 60.15488 48.76288 108.91264 108.91776 108.91264 39.3984 0 73.91232-20.92032 93.03552-52.2496l139.19232 39.552-0.00512 0.2304c0 25.8304 9.00096 49.5616 24.02816 68.23424l-90.14272 132.63872a108.7488 108.7488 0 0 0-34.2528-5.504c-60.15488 0-108.91776 48.768-108.91776 108.91776 0 60.16 48.76288 108.91776 108.91776 108.91776 60.16 0 108.92288-48.75776 108.92288-108.91776 0-27.14624-9.9328-51.968-26.36288-71.04l89.04704-131.03104a108.544 108.544 0 0 0 37.6832 6.70208 108.672 108.672 0 0 0 36.48512-6.272l93.13792 132.57216a108.48256 108.48256 0 0 0-24.69888 69.0688c0 60.16 48.768 108.92288 108.91776 108.92288 60.16 0 108.91776-48.76288 108.91776-108.92288 0-60.14976-48.75776-108.91776-108.91776-108.91776a108.80512 108.80512 0 0 0-36.69504 6.3488l-93.07136-132.48a108.48768 108.48768 0 0 0 24.79616-72.22784l136.09984-37.888c18.99008 31.93856 53.84192 53.3504 93.69088 53.3504 60.16 0 108.92288-48.75776 108.92288-108.91264-0.00512-60.15488-48.77312-108.92288-108.92288-108.92288z" p-id="2022"></path></svg>', Wi = '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg t="1750169375313" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1775" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200"><path d="M639 463.30000001L639 285.1c0-36.90000001-26.4-68.5-61.3-68.5l-150.2 0c-1.5 0-3 0.1-4.5 0.3-10.2-38.7-45.5-67.3-87.5-67.3-50 0-90.5 40.5-90.5 90.5s40.5 90.5 90.5 90.5c42 0 77.3-28.6 87.5-67.39999999 1.4 0.3 2.9 0.4 4.5 0.39999999L577.7 263.6c6.8 0 14.3 8.9 14.3 21.49999999l0 427.00000001c0 12.7-7.40000001 21.5-14.30000001 21.5l-150.19999999 0c-1.5 0-3 0.2-4.5 0.4-10.2-38.8-45.5-67.3-87.5-67.3-50 0-90.5 40.5-90.5 90.4 0 49.9 40.5 90.6 90.5 90.59999999 42 0 77.3-28.6 87.5-67.39999999 1.4 0.2 2.9 0.4 4.49999999 0.4L577.7 780.7c34.80000001 0 61.3-31.6 61.3-68.50000001L639 510.3l79.1 0c10.4 38.5 45.49999999 67 87.4 67 50 0 90.5-40.5 90.5-90.5s-40.5-90.5-90.5-90.5c-41.79999999 0-77.00000001 28.4-87.4 67L639 463.30000001z" fill="currentColor" p-id="1776"></path></svg>', Ri = '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg t="1750169667709" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3037" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200"><path d="M385 560.69999999L385 738.9c0 36.90000001 26.4 68.5 61.3 68.5l150.2 0c1.5 0 3-0.1 4.5-0.3 10.2 38.7 45.5 67.3 87.5 67.3 50 0 90.5-40.5 90.5-90.5s-40.5-90.5-90.5-90.5c-42 0-77.3 28.6-87.5 67.39999999-1.4-0.3-2.9-0.4-4.5-0.39999999L446.3 760.4c-6.8 0-14.3-8.9-14.3-21.49999999l0-427.00000001c0-12.7 7.40000001-21.5 14.30000001-21.5l150.19999999 0c1.5 0 3-0.2 4.5-0.4 10.2 38.8 45.5 67.3 87.5 67.3 50 0 90.5-40.5 90.5-90.4 0-49.9-40.5-90.6-90.5-90.59999999-42 0-77.3 28.6-87.5 67.39999999-1.4-0.2-2.9-0.4-4.49999999-0.4L446.3 243.3c-34.80000001 0-61.3 31.6-61.3 68.50000001L385 513.7l-79.1 0c-10.4-38.5-45.49999999-67-87.4-67-50 0-90.5 40.5-90.5 90.5s40.5 90.5 90.5 90.5c41.79999999 0 77.00000001-28.4 87.4-67L385 560.69999999z" fill="currentColor" p-id="3038"></path></svg>', Vi = '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg t="1750169402629" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2170" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200"><path d="M639.328 416c8.032 0 16.096-3.008 22.304-9.056l202.624-197.184-0.8 143.808c-0.096 17.696 14.144 32.096 31.808 32.192 0.064 0 0.128 0 0.192 0 17.6 0 31.904-14.208 32-31.808l1.248-222.208c0-0.672-0.352-1.248-0.384-1.92 0.032-0.512 0.288-0.896 0.288-1.408 0.032-17.664-14.272-32-31.968-32.032L671.552 96l-0.032 0c-17.664 0-31.968 14.304-32 31.968C639.488 145.632 653.824 160 671.488 160l151.872 0.224-206.368 200.8c-12.672 12.32-12.928 32.608-0.64 45.248C622.656 412.736 630.976 416 639.328 416z" p-id="2171"></path><path d="M896.032 639.552 896.032 639.552c-17.696 0-32 14.304-32.032 31.968l-0.224 151.872-200.832-206.4c-12.32-12.64-32.576-12.96-45.248-0.64-12.672 12.352-12.928 32.608-0.64 45.248l197.184 202.624-143.808-0.8c-0.064 0-0.128 0-0.192 0-17.6 0-31.904 14.208-32 31.808-0.096 17.696 14.144 32.096 31.808 32.192l222.24 1.248c0.064 0 0.128 0 0.192 0 0.64 0 1.12-0.32 1.76-0.352 0.512 0.032 0.896 0.288 1.408 0.288l0.032 0c17.664 0 31.968-14.304 32-31.968L928 671.584C928.032 653.952 913.728 639.584 896.032 639.552z" p-id="2172"></path><path d="M209.76 159.744l143.808 0.8c0.064 0 0.128 0 0.192 0 17.6 0 31.904-14.208 32-31.808 0.096-17.696-14.144-32.096-31.808-32.192L131.68 95.328c-0.064 0-0.128 0-0.192 0-0.672 0-1.248 0.352-1.888 0.384-0.448 0-0.8-0.256-1.248-0.256 0 0-0.032 0-0.032 0-17.664 0-31.968 14.304-32 31.968L96 352.448c-0.032 17.664 14.272 32 31.968 32.032 0 0 0.032 0 0.032 0 17.664 0 31.968-14.304 32-31.968l0.224-151.936 200.832 206.4c6.272 6.464 14.624 9.696 22.944 9.696 8.032 0 16.096-3.008 22.304-9.056 12.672-12.32 12.96-32.608 0.64-45.248L209.76 159.744z" p-id="2173"></path><path d="M362.368 617.056l-202.624 197.184 0.8-143.808c0.096-17.696-14.144-32.096-31.808-32.192-0.064 0-0.128 0-0.192 0-17.6 0-31.904 14.208-32 31.808l-1.248 222.24c0 0.704 0.352 1.312 0.384 2.016 0 0.448-0.256 0.832-0.256 1.312-0.032 17.664 14.272 32 31.968 32.032L352.448 928c0 0 0.032 0 0.032 0 17.664 0 31.968-14.304 32-31.968s-14.272-32-31.968-32.032l-151.936-0.224 206.4-200.832c12.672-12.352 12.96-32.608 0.64-45.248S375.008 604.704 362.368 617.056z" p-id="2174"></path></svg>', Yi = '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg t="1750169573443" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2883" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200"><path d="M514.133333 488.533333m-106.666666 0a106.666667 106.666667 0 1 0 213.333333 0 106.666667 106.666667 0 1 0-213.333333 0Z" fill="currentColor" p-id="2884"></path><path d="M512 64C264.533333 64 64 264.533333 64 512c0 236.8 183.466667 428.8 416 445.866667v-134.4c-53.333333-59.733333-200.533333-230.4-200.533333-334.933334 0-130.133333 104.533333-234.666667 234.666666-234.666666s234.666667 104.533333 234.666667 234.666666c0 61.866667-49.066667 153.6-145.066667 270.933334l-59.733333 68.266666V960C776.533333 942.933333 960 748.8 960 512c0-247.466667-200.533333-448-448-448z" fill="currentColor" p-id="2885"></path></svg>', qi = '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg t="1750169419447" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2480" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200"><path d="M863.328 482.56l-317.344-1.12L545.984 162.816c0-17.664-14.336-32-32-32s-32 14.336-32 32l0 318.4L159.616 480.064c-0.032 0-0.064 0-0.096 0-17.632 0-31.936 14.24-32 31.904C127.424 529.632 141.728 544 159.392 544.064l322.592 1.152 0 319.168c0 17.696 14.336 32 32 32s32-14.304 32-32l0-318.944 317.088 1.12c0.064 0 0.096 0 0.128 0 17.632 0 31.936-14.24 32-31.904C895.264 496.992 880.96 482.624 863.328 482.56z" p-id="2481"></path></svg>', Fi = '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg t="1750169426515" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2730" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200"><path d="M863.744 544 163.424 544c-17.664 0-32-14.336-32-32s14.336-32 32-32l700.32 0c17.696 0 32 14.336 32 32S881.44 544 863.744 544z" p-id="2731"></path></svg>', Ki = {
  side: Bi,
  left: Wi,
  right: Ri,
  full: Vi,
  living: Yi,
  zoomin: qi,
  zoomout: Fi
}, J = (e, t) => {
  const n = document.createElement("span");
  return n.id = e, n.innerHTML = Ki[t], n;
};
function Xi(e) {
  const t = document.createElement("div"), n = J("fullscreen", "full"), i = J("toCenter", "living"), o = J("zoomout", "zoomout"), r = J("zoomin", "zoomin");
  t.appendChild(n), t.appendChild(i), t.appendChild(o), t.appendChild(r), t.className = "mind-elixir-toolbar rb";
  let s = null;
  const l = () => {
    const a = e.container.getBoundingClientRect(), d = Ge(e.map.style.transform), h = a.width / 2, p = a.height / 2, f = (h - d.x) / e.scaleVal, y = (p - d.y) / e.scaleVal;
    s = {
      containerRect: a,
      currentTransform: d,
      mapCenterX: f,
      mapCenterY: y
    };
  }, c = () => {
    if (s) {
      const a = e.container.getBoundingClientRect(), d = a.width / 2, h = a.height / 2, p = d - s.mapCenterX * e.scaleVal, f = h - s.mapCenterY * e.scaleVal, y = p - s.currentTransform.x, w = f - s.currentTransform.y;
      e.move(y, w);
    }
  };
  return e.el.addEventListener("fullscreenchange", c), n.onclick = () => {
    l(), document.fullscreenElement !== e.el ? e.el.requestFullscreen() : document.exitFullscreen();
  }, i.onclick = () => {
    e.toCenter();
  }, o.onclick = () => {
    e.scale(e.scaleVal - e.scaleSensitivity);
  }, r.onclick = () => {
    e.scale(e.scaleVal + e.scaleSensitivity);
  }, t;
}
function zi(e) {
  const t = document.createElement("div"), n = J("tbltl", "left"), i = J("tbltr", "right"), o = J("tblts", "side");
  return t.appendChild(n), t.appendChild(i), t.appendChild(o), t.className = "mind-elixir-toolbar lt", n.onclick = () => {
    e.initLeft();
  }, i.onclick = () => {
    e.initRight();
  }, o.onclick = () => {
    e.initSide();
  }, t;
}
function Gi(e) {
  e.container.append(Xi(e)), e.container.append(zi(e));
}
class Ui {
  _listeners = /* @__PURE__ */ new Map();
  addEventListener(t, n) {
    const i = this._listeners.get(t) ?? /* @__PURE__ */ new Set();
    return this._listeners.set(t, i), i.add(n), this;
  }
  removeEventListener(t, n) {
    return this._listeners.get(t)?.delete(n), this;
  }
  dispatchEvent(t, ...n) {
    let i = !0;
    for (const o of this._listeners.get(t) ?? [])
      i = o(...n) !== !1 && i;
    return i;
  }
  unbindAllListeners() {
    this._listeners.clear();
  }
  // Let's also support on, off and emit like node
  on = this.addEventListener;
  off = this.removeEventListener;
  emit = this.dispatchEvent;
}
const pt = (e, t = "px") => typeof e == "number" ? e + t : e, K = ({ style: e }, t, n) => {
  if (typeof t == "object")
    for (const [i, o] of Object.entries(t))
      o !== void 0 && (e[i] = pt(o));
  else n !== void 0 && (e[t] = pt(n));
}, ft = (e = 0, t = 0, n = 0, i = 0) => {
  const o = { x: e, y: t, width: n, height: i, top: t, left: e, right: e + n, bottom: t + i };
  return { ...o, toJSON: () => JSON.stringify(o) };
}, Ji = (e) => {
  let t, n = -1, i = !1;
  return {
    next: (...o) => {
      t = o, i || (i = !0, n = requestAnimationFrame(() => {
        e(...t), i = !1;
      }));
    },
    cancel: () => {
      cancelAnimationFrame(n), i = !1;
    }
  };
}, mt = (e, t, n = "touch") => {
  switch (n) {
    case "center": {
      const i = t.left + t.width / 2, o = t.top + t.height / 2;
      return i >= e.left && i <= e.right && o >= e.top && o <= e.bottom;
    }
    case "cover":
      return t.left >= e.left && t.top >= e.top && t.right <= e.right && t.bottom <= e.bottom;
    case "touch":
      return e.right >= t.left && e.left <= t.right && e.bottom >= t.top && e.top <= t.bottom;
  }
}, Qi = () => matchMedia("(hover: none), (pointer: coarse)").matches, Zi = () => "safari" in window, Fe = (e) => Array.isArray(e) ? e : [e], Bt = (e) => (t, n, i, o = {}) => {
  (t instanceof HTMLCollection || t instanceof NodeList) && (t = Array.from(t)), n = Fe(n), t = Fe(t);
  for (const r of t)
    if (r)
      for (const s of n)
        r[e](s, i, { capture: !1, ...o });
}, oe = Bt("addEventListener"), F = Bt("removeEventListener"), Ne = (e) => {
  const { clientX: t, clientY: n, target: i } = e.touches?.[0] ?? e;
  return { x: t, y: n, target: i };
}, re = (e, t = document) => Fe(e).map((n) => typeof n == "string" ? Array.from(t.querySelectorAll(n)) : n instanceof Element ? n : null).flat().filter(Boolean), eo = (e, t) => t.some((n) => typeof n == "number" ? e.button === n : typeof n == "object" ? n.button !== e.button ? !1 : n.modifiers.every((i) => {
  switch (i) {
    case "alt":
      return e.altKey;
    case "ctrl":
      return e.ctrlKey || e.metaKey;
    case "shift":
      return e.shiftKey;
  }
}) : !1), { abs: U, max: gt, min: yt, ceil: bt } = Math, vt = (e = []) => ({
  stored: e,
  selected: [],
  touched: [],
  changed: { added: [], removed: [] }
});
class to extends Ui {
  static version = "mind-elixir-fork";
  // Options
  _options;
  // Selection store
  _selection = vt();
  // Area element and clipping element
  _area;
  _clippingElement;
  // Target container (element) and boundary (cached)
  _targetElement;
  _targetBoundary;
  _targetBoundaryScrolled = !0;
  _targetRect;
  _selectables = [];
  _latestElement;
  // Dynamically constructed area rect
  _areaLocation = { y1: 0, x2: 0, y2: 0, x1: 0 };
  _areaRect = ft();
  // If a single click is being performed, it's a single-click until the user dragged the mouse
  _singleClick = !0;
  _frame;
  // Required data for scrolling
  _scrollAvailable = !0;
  _scrollingActive = !1;
  _scrollSpeed = { x: 0, y: 0 };
  _scrollDelta = { x: 0, y: 0 };
  constructor(t) {
    super(), this._options = {
      selectionAreaClass: "selection-area",
      selectionContainerClass: void 0,
      selectables: [],
      document: window.document,
      startAreas: ["html"],
      boundaries: ["html"],
      container: "body",
      mindElixirInstance: void 0,
      // 添加默认值
      ...t,
      behaviour: {
        overlap: "invert",
        intersect: "touch",
        triggers: [0],
        ...t.behaviour,
        startThreshold: t.behaviour?.startThreshold ? typeof t.behaviour.startThreshold == "number" ? t.behaviour.startThreshold : { x: 10, y: 10, ...t.behaviour.startThreshold } : { x: 10, y: 10 },
        scrolling: {
          speedDivider: 10,
          ...t.behaviour?.scrolling,
          startScrollMargins: {
            x: 0,
            y: 0,
            ...t.behaviour?.scrolling?.startScrollMargins
          }
        }
      },
      features: {
        range: !0,
        touch: !0,
        deselectOnBlur: !1,
        ...t.features,
        singleTap: {
          allow: !0,
          intersect: "native",
          ...t.features?.singleTap
        }
      }
    };
    for (const r of Object.getOwnPropertyNames(Object.getPrototypeOf(this)))
      typeof this[r] == "function" && (this[r] = this[r].bind(this));
    const { document: n, selectionAreaClass: i, selectionContainerClass: o } = this._options;
    this._area = n.createElement("div"), this._clippingElement = n.createElement("div"), this._clippingElement.appendChild(this._area), this._area.classList.add(i), o && this._clippingElement.classList.add(o), K(this._area, {
      willChange: "top, left, bottom, right, width, height",
      top: 0,
      left: 0,
      position: "fixed"
    }), K(this._clippingElement, {
      overflow: "hidden",
      position: "fixed",
      transform: "translate3d(0, 0, 0)",
      // https://stackoverflow.com/a/38268846
      pointerEvents: "none",
      zIndex: "1"
    }), this._frame = Ji((r) => {
      this._recalculateSelectionAreaRect(), this._updateElementSelection(), this._emitEvent("move", r), this._redrawSelectionArea();
    }), this.enable();
  }
  _toggleStartEvents(t = !0) {
    const { document: n } = this._options;
    (t ? oe : F)(n, "pointerdown", this._onTapStart);
  }
  _onTapStart(t, n = !1) {
    const { x: i, y: o, target: r } = Ne(t), { document: s, startAreas: l, boundaries: c, behaviour: a, features: d } = this._options, h = r.getBoundingClientRect();
    if (!eo(t, a.triggers))
      return;
    const p = re(l, s), f = re(c, s);
    this._targetElement = f.find((m) => mt(m.getBoundingClientRect(), h));
    const y = t.composedPath(), w = p.find((m) => y.includes(m));
    if (this._targetBoundary = f.find((m) => y.includes(m)), !this._targetElement || !w || !this._targetBoundary || !n && this._emitEvent("beforestart", t) === !1)
      return;
    this._areaLocation = { x1: i, y1: o, x2: 0, y2: 0 };
    const b = s.scrollingElement ?? s.body;
    this._scrollDelta = { x: b.scrollLeft, y: b.scrollTop }, this._singleClick = !0, this.clearSelection(!1, !0), oe(s, ["pointermove"], this._delayedTapMove, { passive: !1 }), oe(s, ["pointerup", "pointercancel"], this._onTapStop), oe(s, "scroll", this._onScroll), d.deselectOnBlur && (this._targetBoundaryScrolled = !1, oe(this._targetBoundary, "scroll", this._onStartAreaScroll));
  }
  _onSingleTap(t) {
    const {
      singleTap: { intersect: n },
      range: i
    } = this._options.features, o = Ne(t);
    let r;
    if (n === "native")
      r = o.target;
    else if (n === "touch") {
      this.resolveSelectables();
      const { x: l, y: c } = o;
      r = this._selectables.find((a) => {
        const { right: d, left: h, top: p, bottom: f } = a.getBoundingClientRect();
        return l < d && l > h && c < f && c > p;
      });
    }
    if (!r)
      return;
    for (this.resolveSelectables(); !this._selectables.includes(r); )
      if (r.parentElement)
        r = r.parentElement;
      else {
        this._targetBoundaryScrolled || this.clearSelection();
        return;
      }
    const { stored: s } = this._selection;
    if (this._emitEvent("start", t), t.shiftKey && i && this._latestElement) {
      const l = this._latestElement, [c, a] = l.compareDocumentPosition(r) & 4 ? [r, l] : [l, r], d = [
        ...this._selectables.filter((h) => h.compareDocumentPosition(c) & 4 && h.compareDocumentPosition(a) & 2),
        c,
        a
      ];
      this.select(d), this._latestElement = l;
    } else s.includes(r) && (s.length === 1 || t.ctrlKey || s.every((l) => this._selection.stored.includes(l))) ? this.deselect(r) : (this.select(r), this._latestElement = r);
  }
  _delayedTapMove(t) {
    const {
      container: n,
      document: i,
      behaviour: { startThreshold: o }
    } = this._options, { x1: r, y1: s } = this._areaLocation, { x: l, y: c } = Ne(t);
    if (
      // Single number for both coordinates
      typeof o == "number" && U(l + c - (r + s)) >= o || // Different x and y threshold
      typeof o == "object" && U(l - r) >= o.x || U(c - s) >= o.y
    ) {
      if (F(i, ["pointermove"], this._delayedTapMove, { passive: !1 }), this._emitEvent("beforedrag", t) === !1) {
        F(i, ["pointerup", "pointercancel"], this._onTapStop);
        return;
      }
      oe(i, ["pointermove"], this._onTapMove, { passive: !1 }), K(this._area, "display", "block"), re(n, i)[0].appendChild(this._clippingElement), this.resolveSelectables(), this._singleClick = !1, this._targetRect = this._targetElement.getBoundingClientRect(), this._scrollAvailable = this._targetElement.scrollHeight !== this._targetElement.clientHeight || this._targetElement.scrollWidth !== this._targetElement.clientWidth, this._scrollAvailable && (this._selectables = this._selectables.filter((a) => this._targetElement.contains(a))), this._setupSelectionArea(), this._emitEvent("start", t), this._onTapMove(t);
    }
    this._handleMoveEvent(t);
  }
  _setupSelectionArea() {
    const { _clippingElement: t, _targetElement: n, _area: i } = this, o = this._targetRect = n.getBoundingClientRect();
    this._scrollAvailable ? (K(t, {
      top: o.top,
      left: o.left,
      width: o.width,
      height: o.height
    }), K(i, {
      marginTop: -o.top,
      marginLeft: -o.left
    })) : (K(t, {
      top: 0,
      left: 0,
      width: "100%",
      height: "100%"
    }), K(i, {
      marginTop: 0,
      marginLeft: 0
    }));
  }
  _onTapMove(t) {
    const { _scrollSpeed: n, _areaLocation: i, _options: o, _frame: r } = this, { speedDivider: s } = o.behaviour.scrolling, { x: l, y: c } = Ne(t);
    if (i.x2 = l, i.y2 = c, this._scrollAvailable && !this._scrollingActive && (n.y || n.x)) {
      this._scrollingActive = !0;
      const a = () => {
        if (!n.x && !n.y) {
          this._scrollingActive = !1;
          return;
        }
        const d = this._options.mindElixirInstance;
        if (d && d.move) {
          const h = n.x ? bt(n.x / s) : 0, p = n.y ? bt(n.y / s) : 0;
          (h || p) && (d.move(-h, -p), i.x1 -= h, i.y1 -= p);
        }
        r.next(t), requestAnimationFrame(a);
      };
      requestAnimationFrame(a);
    } else
      r.next(t);
    this._handleMoveEvent(t);
  }
  _handleMoveEvent(t) {
    const { features: n } = this._options;
    (n.touch && Qi() || this._scrollAvailable && Zi()) && t.preventDefault();
  }
  _onScroll() {
    const {
      _scrollDelta: t,
      _options: { document: n }
    } = this, { scrollTop: i, scrollLeft: o } = n.scrollingElement ?? n.body;
    this._areaLocation.x1 += t.x - o, this._areaLocation.y1 += t.y - i, t.x = o, t.y = i, this._setupSelectionArea(), this._frame.next(null);
  }
  _onStartAreaScroll() {
    this._targetBoundaryScrolled = !0, F(this._targetElement, "scroll", this._onStartAreaScroll);
  }
  _recalculateSelectionAreaRect() {
    const { _scrollSpeed: t, _areaLocation: n, _targetElement: i, _options: o } = this, r = this._targetRect, { x1: s, y1: l } = n;
    let { x2: c, y2: a } = n;
    const {
      behaviour: {
        scrolling: { startScrollMargins: d }
      }
    } = o;
    c < r.left + d.x ? (t.x = -U(r.left - c + d.x), c = c < r.left ? r.left : c) : c > r.right - d.x ? (t.x = U(r.left + r.width - c - d.x), c = c > r.right ? r.right : c) : t.x = 0, a < r.top + d.y ? (t.y = -U(r.top - a + d.y), a = a < r.top ? r.top : a) : a > r.bottom - d.y ? (t.y = U(r.top + r.height - a - d.y), a = a > r.bottom ? r.bottom : a) : t.y = 0;
    const h = yt(s, c), p = yt(l, a), f = gt(s, c), y = gt(l, a);
    this._areaRect = ft(h, p, f - h, y - p);
  }
  _redrawSelectionArea() {
    const { x: t, y: n, width: i, height: o } = this._areaRect, { style: r } = this._area;
    r.left = `${t}px`, r.top = `${n}px`, r.width = `${i}px`, r.height = `${o}px`;
  }
  _onTapStop(t, n) {
    const { document: i, features: o } = this._options, { _singleClick: r } = this;
    F(this._targetElement, "scroll", this._onStartAreaScroll), F(i, ["pointermove"], this._delayedTapMove), F(i, ["pointermove"], this._onTapMove), F(i, ["pointerup", "pointercancel"], this._onTapStop), F(i, "scroll", this._onScroll), this._keepSelection(), t && r && o.singleTap.allow ? this._onSingleTap(t) : !r && !n && (this._updateElementSelection(), this._emitEvent("stop", t)), this._scrollSpeed.x = 0, this._scrollSpeed.y = 0, this._clippingElement.remove(), this._frame?.cancel(), K(this._area, "display", "none");
  }
  _updateElementSelection() {
    const { _selectables: t, _options: n, _selection: i, _areaRect: o } = this, { stored: r, selected: s, touched: l } = i, { intersect: c, overlap: a } = n.behaviour, d = a === "invert", h = [], p = [], f = [];
    for (let w = 0; w < t.length; w++) {
      const b = t[w];
      if (mt(o, b.getBoundingClientRect(), c)) {
        if (s.includes(b))
          r.includes(b) && !l.includes(b) && l.push(b);
        else if (d && r.includes(b)) {
          f.push(b);
          continue;
        } else
          p.push(b);
        h.push(b);
      }
    }
    d && p.push(...r.filter((w) => !s.includes(w)));
    const y = a === "keep";
    for (let w = 0; w < s.length; w++) {
      const b = s[w];
      !h.includes(b) && !// Check if the user wants to keep previously selected elements, e.g.,
      // not make them part of the current selection as soon as they're touched.
      (y && r.includes(b)) && f.push(b);
    }
    i.selected = h, i.changed = { added: p, removed: f }, this._latestElement = void 0;
  }
  _emitEvent(t, n) {
    return this.emit(t, {
      event: n,
      store: this._selection,
      selection: this
    });
  }
  _keepSelection() {
    const { _options: t, _selection: n } = this, { selected: i, changed: o, touched: r, stored: s } = n, l = i.filter((c) => !s.includes(c));
    switch (t.behaviour.overlap) {
      case "drop": {
        n.stored = [
          ...l,
          ...s.filter((c) => !r.includes(c))
          // Elements not touched
        ];
        break;
      }
      case "invert": {
        n.stored = [
          ...l,
          ...s.filter((c) => !o.removed.includes(c))
          // Elements not removed from selection
        ];
        break;
      }
      case "keep": {
        n.stored = [
          ...s,
          ...i.filter((c) => !s.includes(c))
          // Newly added
        ];
        break;
      }
    }
  }
  /**
   * Manually triggers the start of a selection
   * @param evt A PointerEvent-like object
   * @param silent If beforestart should be fired
   */
  trigger(t, n = !0) {
    this._onTapStart(t, n);
  }
  /**
   * Can be used if during a selection elements have been added
   * Will update everything that can be selected
   */
  resolveSelectables() {
    this._selectables = re(this._options.selectables, this._options.document);
  }
  /**
   * Same as deselecting, but for all elements currently selected
   * @param includeStored If the store should also get cleared
   * @param quiet If move / stop events should be fired
   */
  clearSelection(t = !0, n = !1) {
    const { selected: i, stored: o, changed: r } = this._selection;
    r.added = [], r.removed.push(...i, ...t ? o : []), n || (this._emitEvent("move", null), this._emitEvent("stop", null)), this._selection = vt(t ? [] : o);
  }
  /**
   * @returns {Array} Selected elements
   */
  getSelection() {
    return this._selection.stored;
  }
  /**
   * @returns {HTMLElement} The selection area element
   */
  getSelectionArea() {
    return this._area;
  }
  /**
   * @returns {Element[]} Available selectable elements for current selection
   */
  getSelectables() {
    return this._selectables;
  }
  /**
   * Set the location of the selection area
   * @param location A partial AreaLocation object
   */
  setAreaLocation(t) {
    Object.assign(this._areaLocation, t), this._redrawSelectionArea();
  }
  /**
   * @returns {AreaLocation} The current location of the selection area
   */
  getAreaLocation() {
    return this._areaLocation;
  }
  /**
   * Cancel the current selection process, pass true to fire a stop event after cancel
   * @param keepEvent If a stop event should be fired
   */
  cancel(t = !1) {
    this._onTapStop(null, !t);
  }
  /**
   * Unbinds all events and removes the area-element.
   */
  destroy() {
    this.cancel(), this.disable(), this._clippingElement.remove(), super.unbindAllListeners();
  }
  /**
   * Enable selecting elements
   */
  enable = this._toggleStartEvents;
  /**
   * Disable selecting elements
   */
  disable = this._toggleStartEvents.bind(this, !1);
  /**
   * Adds elements to the selection
   * @param query CSS Query, can be an array of queries
   * @param quiet If this should not trigger the move event
   */
  select(t, n = !1) {
    const { changed: i, selected: o, stored: r } = this._selection, s = re(t, this._options.document).filter((l) => !o.includes(l) && !r.includes(l));
    return r.push(...s), o.push(...s), i.added.push(...s), i.removed = [], this._latestElement = void 0, n || (this._emitEvent("move", null), this._emitEvent("stop", null)), s;
  }
  /**
   * Removes a particular element from the selection
   * @param query CSS Query, can be an array of queries
   * @param quiet If this should not trigger the move event
   */
  deselect(t, n = !1) {
    const { selected: i, stored: o, changed: r } = this._selection, s = re(t, this._options.document).filter((l) => i.includes(l) || o.includes(l));
    this._selection.stored = o.filter((l) => !s.includes(l)), this._selection.selected = i.filter((l) => !s.includes(l)), this._selection.changed.added = [], this._selection.changed.removed.push(...s.filter((l) => !r.removed.includes(l))), this._latestElement = void 0, n || (this._emitEvent("move", null), this._emitEvent("stop", null));
  }
}
function no(e) {
  const t = e.mouseSelectionButton === 2 ? [2] : [0], n = new to({
    selectables: [".map-container me-tpc"],
    boundaries: [e.container],
    container: e.selectionContainer,
    mindElixirInstance: e,
    // 传递 MindElixir 实例
    features: {
      touch: !1,
      singleTap: {
        allow: !1
      }
    },
    behaviour: {
      triggers: t,
      // Scroll configuration.
      scrolling: {
        // On scrollable areas the number on px per frame is devided by this amount.
        // Default is 10 to provide a enjoyable scroll experience.
        speedDivider: 10,
        startScrollMargins: { x: 50, y: 50 }
      }
    }
  }).on("beforestart", ({ event: i }) => {
    if (!e.editable || e.spacePressed || e.ptState !== 5) return !1;
    const o = i.target;
    if (o.id === "input-box" || o.className === "circle" || o.className !== "map-container")
      return !1;
    !i.ctrlKey && !i.metaKey && e.clearSelection();
    const r = n.getSelectionArea();
    return r.style.background = "#4f90f22d", r.style.border = "1px solid #4f90f2", r.style.borderRadius = "3px", r.parentElement && (r.parentElement.style.zIndex = "9999"), !0;
  }).on(
    "move",
    ({
      store: {
        changed: { added: i, removed: o }
      }
    }) => {
      if (i.length > 0 || o.length > 0, i.length > 0) {
        const r = i.filter((s) => !e.currentNodes?.includes(s));
        if (r.length > 0) {
          for (const s of r)
            s.className = "selected";
          e.currentNodes = [...e.currentNodes || [], ...r], e.bus.fire(
            "selectNodes",
            r.map((s) => s.nodeObj)
          );
        }
      }
      if (o.length > 0) {
        const r = o.filter((s) => e.currentNodes?.includes(s));
        if (r.length > 0) {
          for (const s of r)
            s.classList.remove("selected");
          e.currentNodes = (e.currentNodes || []).filter((s) => !r.includes(s)), e.bus.fire(
            "unselectNodes",
            r.map((s) => s.nodeObj)
          );
        }
      }
    }
  );
  e.selection = n;
}
const Wt = function(e, t, n, i, o = 8) {
  if (e === n) return `M ${e} ${t} V ${i}`;
  const r = (t + i) / 2, s = n > e ? 1 : -1, l = Math.min(o, Math.abs(n - e) / 2, Math.abs(r - t), Math.abs(i - r));
  return `M ${e} ${t} V ${r - l} Q ${e} ${r} ${e + s * l} ${r} H ${n - s * l} Q ${n} ${r} ${n} ${r + l} V ${i}`;
};
function Rt({ pT: e, pL: t, pW: n, pH: i, cT: o, cL: r, cW: s, cH: l, direction: c, containerHeight: a, containerWidth: d }) {
  if (c === H.DOWN) {
    const b = t + n / 2, m = r + s / 2, x = e + i;
    return Wt(b, x, m, o);
  }
  let h = t + n / 2;
  const p = e + i / 2;
  let f;
  c === H.LHS ? f = r + s : f = r;
  const y = o + l / 2, w = (1 - Math.abs(y - p) / a) * 0.25 * (n / 2);
  return c === H.LHS ? h = h - n / 10 - w : h = h + n / 10 + w, `M ${h} ${p} Q ${h} ${y} ${f} ${y}`;
}
function Vt({ pT: e, pL: t, pW: n, pH: i, cT: o, cL: r, cW: s, cH: l, direction: c, isFirst: a }) {
  if (c === H.DOWN) {
    const x = t + n / 2, M = e + i, T = r + s / 2;
    return Wt(x, M, T, o);
  }
  const d = parseInt(this.container.style.getPropertyValue("--node-gap-x"));
  let h = 0, p = 0;
  a ? h = e + i / 2 : h = e + i;
  const f = o + l;
  let y = 0, w = 0, b = 0;
  const m = Math.abs(h - f) / 300 * d;
  return c === H.LHS ? (b = t, y = b + d, w = b - d, p = r + d, `M ${y} ${h} C ${b} ${h} ${b + m} ${f} ${w} ${f} H ${p}`) : (b = t + n, y = b - d, w = b + d, p = r + s - d, `M ${y} ${h} C ${b} ${h} ${b - m} ${f} ${w} ${f} H ${p}`);
}
const io = function(e, t = !0) {
  this.theme = e, this.generateMainBranch = this.theme.generateMainBranch || Rt, this.generateSubBranch = this.theme.generateSubBranch || Vt;
  const n = {
    ...(this.theme.type === "dark" ? Ye : Ve).cssVar,
    ...this.theme.cssVar
  };
  this.compact && (n["--node-gap-x"] = "15px", n["--node-gap-y"] = "2px", n["--main-gap-x"] = "30px", n["--main-gap-y"] = "6px");
  const i = Object.keys(n);
  for (let o = 0; o < i.length; o++) {
    const r = i[o];
    this.container.style.setProperty(r, n[r]);
  }
  t && this.refresh();
}, oo = function(e) {
  this.compact = e, this.theme && this.changeTheme(this.theme);
}, ro = function(e) {
  return {
    dom: e,
    moved: !1,
    // differentiate click and move
    sessionMoved: !1,
    // whether the current drag session actually moved
    pointerdown: !1,
    lastX: 0,
    lastY: 0,
    handlePointerMove(t) {
      if (this.pointerdown) {
        this.moved = !0, this.sessionMoved = !0;
        const n = t.clientX - this.lastX, i = t.clientY - this.lastY;
        this.lastX = t.clientX, this.lastY = t.clientY, this.cb && this.cb(n, i);
      }
    },
    handlePointerDown(t) {
      t.button === 0 && (this.pointerdown = !0, this.sessionMoved = !1, this.lastX = t.clientX, this.lastY = t.clientY, this.dom.setPointerCapture(t.pointerId));
    },
    handleClear(t) {
      const n = this.pointerdown && this.sessionMoved;
      this.pointerdown = !1, this.sessionMoved = !1, t.pointerId !== void 0 && this.dom.releasePointerCapture(t.pointerId), n && this.onEnd && this.onEnd();
    },
    cb: null,
    onEnd: null,
    init(t, n, i) {
      this.cb = n, this.onEnd = i || null, this.handleClear = this.handleClear.bind(this), this.handlePointerMove = this.handlePointerMove.bind(this), this.handlePointerDown = this.handlePointerDown.bind(this), this.destroy = Et([
        { dom: t, evt: "pointermove", func: this.handlePointerMove },
        { dom: t, evt: "pointerleave", func: this.handleClear },
        { dom: t, evt: "pointerup", func: this.handleClear },
        { dom: this.dom, evt: "pointerdown", func: this.handlePointerDown }
      ]);
    },
    destroy: null,
    clear() {
      this.moved = !1, this.pointerdown = !1;
    }
  };
}, wt = {
  create: ro
}, Yt = "#4dc4ff";
function qt(e, t, n, i, o, r, s, l) {
  return {
    x: e / 8 + n * 3 / 8 + o * 3 / 8 + s / 8,
    y: t / 8 + i * 3 / 8 + r * 3 / 8 + l / 8
  };
}
function so(e, t, n) {
  e && (e.dataset.x = t.toString(), e.dataset.y = n.toString(), Oe(e));
}
function le(e, t, n, i, o) {
  O(e, {
    x1: t + "",
    y1: n + "",
    x2: i + "",
    y2: o + ""
  });
}
function Ke(e, t, n, i, o, r, s, l, c, a) {
  const d = `M ${t} ${n} C ${i} ${o} ${r} ${s} ${l} ${c}`;
  e.line.setAttribute("d", d);
  const h = a.style || {};
  e.line.setAttribute("stroke", h.stroke || "rgb(227, 125, 116)"), e.line.setAttribute("stroke-width", String(h.strokeWidth || "2")), e.line.setAttribute("stroke-dasharray", h.strokeDasharray || "8,2"), h.opacity !== void 0 && h.opacity !== null && h.opacity !== "" ? e.line.setAttribute("opacity", String(h.opacity)) : e.line.removeAttribute("opacity");
  const p = e.querySelectorAll('path[stroke="transparent"]');
  p.length > 0 && p[0].setAttribute("d", d);
  const f = Ae(r, s, l, c);
  if (f) {
    const m = `M ${f.x1} ${f.y1} L ${l} ${c} L ${f.x2} ${f.y2}`;
    e.arrow1.setAttribute("d", m), p.length > 1 && p[1].setAttribute("d", m), e.arrow1.setAttribute("stroke", h.stroke || "rgb(227, 125, 116)"), e.arrow1.setAttribute("stroke-width", String(h.strokeWidth || "2")), h.opacity !== void 0 && h.opacity !== null && h.opacity !== "" ? e.arrow1.setAttribute("opacity", String(h.opacity)) : e.arrow1.removeAttribute("opacity");
  }
  if (a.bidirectional) {
    const m = Ae(i, o, t, n);
    if (m) {
      const x = `M ${m.x1} ${m.y1} L ${t} ${n} L ${m.x2} ${m.y2}`;
      e.arrow2.setAttribute("d", x), p.length > 2 && p[2].setAttribute("d", x);
    }
  } else
    e.arrow2.setAttribute("d", ""), p.length > 2 && p[2].setAttribute("d", "");
  e.arrow2.setAttribute("stroke", h.stroke || "rgb(227, 125, 116)"), e.arrow2.setAttribute("stroke-width", String(h.strokeWidth || "2")), h.opacity !== void 0 && h.opacity !== null && h.opacity !== "" ? e.arrow2.setAttribute("opacity", String(h.opacity)) : e.arrow2.removeAttribute("opacity");
  const { x: y, y: w } = qt(t, n, i, o, r, s, l, c);
  e.labelEl && so(e.labelEl, y, w);
  const b = e.labelEl;
  b && (b.style.color = h.labelColor || "rgb(235, 95, 82)"), fo(e);
}
function de(e, t, n) {
  const { offsetLeft: i, offsetTop: o } = W(e.nodes, t), r = t.offsetWidth, s = t.offsetHeight, l = i + r / 2, c = o + s / 2, a = l + n.x, d = c + n.y;
  return {
    w: r,
    h: s,
    cx: l,
    cy: c,
    ctrlX: a,
    ctrlY: d
  };
}
function X(e) {
  const t = e.w / 2, n = e.h / 2, i = e.ctrlX - e.cx, o = e.ctrlY - e.cy, r = Math.hypot(i, o);
  if (r === 0 || t === 0 && n === 0)
    return { x: e.cx, y: e.cy };
  const s = i / r, l = o / r, c = Math.min(t / Math.abs(s), n / Math.abs(l));
  return { x: e.cx + s * c, y: e.cy + l * c };
}
const Ft = function(e, t, n) {
  const i = W(e.nodes, t), o = W(e.nodes, n), r = i.offsetLeft + t.offsetWidth / 2, s = i.offsetTop + t.offsetHeight / 2, l = o.offsetLeft + n.offsetWidth / 2, c = o.offsetTop + n.offsetHeight / 2, a = l - r, d = c - s, h = Math.sqrt(a * a + d * d), p = Math.max(50, Math.min(200, h * 0.3)), f = Math.abs(a), y = Math.abs(d);
  let w, b;
  if (h < 150) {
    const m = t.closest("me-main"), x = m ? m.className === "lhs" ? -1 : 1 : a > 0 ? -1 : 1;
    w = { x: 200 * x, y: 0 }, b = { x: 200 * x, y: 0 };
  } else if (f > y * 1.5) {
    const m = a > 0 ? t.offsetWidth / 2 : -t.offsetWidth / 2, x = a > 0 ? -n.offsetWidth / 2 : n.offsetWidth / 2;
    w = { x: m + (a > 0 ? p : -p), y: 0 }, b = { x: x + (a > 0 ? -p : p), y: 0 };
  } else if (y > f * 1.5) {
    const m = d > 0 ? t.offsetHeight / 2 : -t.offsetHeight / 2, x = d > 0 ? -n.offsetHeight / 2 : n.offsetHeight / 2;
    w = { x: 0, y: m + (d > 0 ? p : -p) }, b = { x: 0, y: x + (d > 0 ? -p : p) };
  } else {
    const m = Math.atan2(d, a), x = t.offsetWidth / 2 * Math.cos(m), M = t.offsetHeight / 2 * Math.sin(m), T = -(n.offsetWidth / 2) * Math.cos(m), u = -(n.offsetHeight / 2) * Math.sin(m), v = p * 0.7 * (a > 0 ? 1 : -1), E = p * 0.7 * (d > 0 ? 1 : -1);
    w = { x: x + v, y: M + E }, b = { x: T - v, y: u - E };
  }
  return {
    delta1: { x: Math.round(w.x), y: Math.round(w.y) },
    delta2: { x: Math.round(b.x), y: Math.round(b.y) }
  };
}, tt = function(e, t, n, i, o) {
  if (!t || !n)
    return;
  if (!i.delta1 || !i.delta2) {
    const N = Ft(e, t, n);
    i.delta1 = N.delta1, i.delta2 = N.delta2;
  }
  const r = de(e, t, i.delta1), s = de(e, n, i.delta2), { x: l, y: c } = X(r), { ctrlX: a, ctrlY: d } = r, { ctrlX: h, ctrlY: p } = s, { x: f, y } = X(s), w = Ae(h, p, f, y);
  if (!w) return;
  const b = `M ${w.x1} ${w.y1} L ${f} ${y} L ${w.x2} ${w.y2}`;
  let m = "";
  if (i.bidirectional) {
    const N = Ae(a, d, l, c);
    if (!N) return;
    m = `M ${N.x1} ${N.y1} L ${l} ${c} L ${N.x2} ${N.y2}`;
  }
  const x = $i(`M ${l} ${c} C ${a} ${d} ${h} ${p} ${f} ${y}`, b, m, i.style), { x: M, y: T } = qt(l, c, a, d, h, p, f, y), u = i.style?.labelColor || "rgb(235, 95, 82)", v = "a-" + i.id;
  x.id = v;
  const E = e.markdown ? e.markdown(i.label, i) : i.label, C = De(E, M, T, {
    anchor: "middle",
    color: u,
    dataType: "arrow",
    svgId: v
  });
  x.labelEl = C, x.arrowObj = i, x.dataset.linkid = i.id, e.labelContainer.appendChild(C), e.arrowSvg.appendChild(x), Oe(C), o || (e.arrows.push(i), e.currentArrow = x, Xt(e, i, r, s));
}, lo = function(e, t, n = {}) {
  const i = {
    id: Z(),
    label: "Custom Link",
    from: e.nodeObj.id,
    to: t.nodeObj.id,
    ...n
  };
  tt(this, e, t, i), this.bus.fire("operation", {
    name: "createArrow",
    obj: i
  });
}, ao = function(e) {
  je(this);
  const t = { ...e, id: Z() };
  tt(this, this.findEle(t.from), this.findEle(t.to), t), this.bus.fire("operation", {
    name: "createArrow",
    obj: t
  });
}, co = function(e) {
  let t;
  if (e ? t = e : t = this.currentArrow, !t) return;
  je(this);
  const n = t.arrowObj.id;
  this.arrows = this.arrows.filter((i) => i.id !== n), t.labelEl?.remove(), t.remove(), this.bus.fire("operation", {
    name: "removeArrow",
    obj: {
      id: n
    }
  });
}, ho = function(e) {
  this.currentArrow = e;
  const t = e.arrowObj, n = this.findEle(t.from), i = this.findEle(t.to), o = de(this, n, t.delta1), r = de(this, i, t.delta2);
  this.editable ? Xt(this, t, o, r) : Kt(e, Yt), this.bus.fire("selectArrow", t);
}, uo = function() {
  je(this), this.currentArrow = null, this.bus.fire("unselectArrow");
}, Be = function(e, t) {
  const n = document.createElementNS(R, "path");
  return O(n, {
    d: e,
    stroke: t,
    fill: "none",
    "stroke-width": "6",
    "stroke-linecap": "round",
    "stroke-linejoin": "round"
  }), n;
}, Kt = function(e, t) {
  const n = document.createElementNS(R, "g");
  n.setAttribute("class", "arrow-highlight"), n.setAttribute("opacity", "0.45");
  const i = Be(e.line.getAttribute("d"), t);
  n.appendChild(i);
  const o = Be(e.arrow1.getAttribute("d"), t);
  if (n.appendChild(o), e.arrow2.getAttribute("d")) {
    const r = Be(e.arrow2.getAttribute("d"), t);
    n.appendChild(r);
  }
  e.insertBefore(n, e.firstChild);
}, po = function(e) {
  const t = e.querySelector(".arrow-highlight");
  t && t.remove();
}, fo = function(e) {
  const t = e.querySelector(".arrow-highlight");
  if (!t) return;
  const n = t.querySelectorAll("path");
  n.length >= 1 && n[0].setAttribute("d", e.line.getAttribute("d")), n.length >= 2 && n[1].setAttribute("d", e.arrow1.getAttribute("d")), n.length >= 3 && e.arrow2.getAttribute("d") && n[2].setAttribute("d", e.arrow2.getAttribute("d"));
}, je = function(e) {
  e.helper1?.destroy(), e.helper2?.destroy(), e.linkController.style.display = "none", e.P2.style.display = "none", e.P3.style.display = "none", e.currentArrow && po(e.currentArrow);
}, Xt = function(e, t, n, i) {
  const { linkController: o, P2: r, P3: s, line1: l, line2: c, nodes: a, map: d, currentArrow: h, bus: p } = e;
  if (!h) return;
  o.style.display = "initial", r.style.display = "initial", s.style.display = "initial", a.appendChild(o), a.appendChild(r), a.appendChild(s), Kt(h, Yt);
  let { x: f, y } = X(n), { ctrlX: w, ctrlY: b } = n, { ctrlX: m, ctrlY: x } = i, { x: M, y: T } = X(i);
  r.style.cssText = `top:${b}px;left:${w}px;`, s.style.cssText = `top:${x}px;left:${m}px;`, le(l, f, y, w, b), le(c, m, x, M, T), e.helper1 = wt.create(r), e.helper2 = wt.create(s);
  let u = ce(t);
  const v = () => {
    p.fire("operation", {
      name: "reshapeArrow",
      obj: t,
      origin: u
    }), u = ce(t);
  };
  e.helper1.init(
    d,
    (E, C) => {
      w = w + E / e.scaleVal, b = b + C / e.scaleVal;
      const N = X({ ...n, ctrlX: w, ctrlY: b });
      f = N.x, y = N.y, r.style.top = b + "px", r.style.left = w + "px", Ke(h, f, y, w, b, m, x, M, T, t), le(l, f, y, w, b), t.delta1.x = Math.round(w - n.cx), t.delta1.y = Math.round(b - n.cy), p.fire("updateArrowDelta", t);
    },
    v
  ), e.helper2.init(
    d,
    (E, C) => {
      m = m + E / e.scaleVal, x = x + C / e.scaleVal;
      const N = X({ ...i, ctrlX: m, ctrlY: x });
      M = N.x, T = N.y, s.style.top = x + "px", s.style.left = m + "px", Ke(h, f, y, w, b, m, x, M, T, t), le(c, m, x, M, T), t.delta2.x = Math.round(m - i.cx), t.delta2.y = Math.round(x - i.cy), p.fire("updateArrowDelta", t);
    },
    v
  );
};
function mo() {
  this.arrowSvg.innerHTML = "", this.labelContainer.querySelectorAll('.svg-label[data-type="arrow"]').forEach((e) => e.remove());
  for (let e = 0; e < this.arrows.length; e++) {
    const t = this.arrows[e];
    try {
      tt(this, this.findEle(t.from), this.findEle(t.to), t, !0);
    } catch {
    }
  }
  this.nodes.appendChild(this.arrowSvg);
}
function go(e) {
  je(this), e && e.labelEl && Ht(this, e.labelEl, e.arrowObj);
}
function yo() {
  this.arrows = this.arrows.filter((e) => Le(e.from, this.nodeData) && Le(e.to, this.nodeData));
}
const bo = function(e, t) {
  const n = ce(e);
  n.style && t.style && (t.style = Object.assign({}, n.style, t.style)), Object.assign(e, t);
  const i = this.arrowSvg.querySelector(`g[data-linkid="${e.id}"]`);
  if (i) {
    if (t.label !== void 0 && i.labelEl) {
      const s = this.markdown ? this.markdown(e.label, e) : e.label;
      i.labelEl.innerHTML = s;
    }
    const o = this.findEle(e.from), r = this.findEle(e.to);
    if (o && r) {
      if (!e.delta1 || !e.delta2) {
        const b = Ft(this, o, r);
        e.delta1 = e.delta1 || b.delta1, e.delta2 = e.delta2 || b.delta2;
      }
      const s = de(this, o, e.delta1), l = de(this, r, e.delta2), { x: c, y: a } = X(s), { ctrlX: d, ctrlY: h } = s, { ctrlX: p, ctrlY: f } = l, { x: y, y: w } = X(l);
      Ke(i, c, a, d, h, p, f, y, w, e), this.currentArrow?.arrowObj?.id === e.id && (this.P2.style.cssText = `top:${h}px;left:${d}px;`, this.P3.style.cssText = `top:${f}px;left:${p}px;`, le(this.line1, c, a, d, h), le(this.line2, p, f, y, w));
    }
  }
  this.bus.fire("operation", {
    name: "reshapeArrow",
    obj: e,
    origin: n
  });
}, vo = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  createArrow: lo,
  createArrowFrom: ao,
  editArrowLabel: go,
  removeArrow: co,
  renderArrow: mo,
  reshapeArrow: bo,
  selectArrow: ho,
  tidyArrow: yo,
  unselectArrow: uo
}, Symbol.toStringTag, { value: "Module" })), wo = function(e) {
  if (e.length === 0) throw new Error("No selected node.");
  if (e.length === 1) {
    const c = e[0].nodeObj, a = e[0].nodeObj.parent;
    if (!a) throw new Error("Can not select root node.");
    const d = a.children.findIndex((h) => c === h);
    return {
      parent: a.id,
      start: d,
      end: d
    };
  }
  let t = 0;
  const n = e.map((c) => {
    let a = c.nodeObj;
    const d = [];
    for (; a.parent; ) {
      const h = a.parent, p = h.children?.indexOf(a);
      a = h, d.unshift({ node: a, index: p });
    }
    return d.length > t && (t = d.length), d;
  });
  let i = 0;
  e: for (; i < t; i++) {
    const c = n[0][i]?.node;
    for (let a = 1; a < n.length; a++)
      if (n[a][i]?.node !== c)
        break e;
  }
  if (!i) throw new Error("Can not select root node.");
  const o = n.map((c) => c[i - 1].index).sort((c, a) => c - a), r = o[0] || 0, s = o[o.length - 1] || 0, l = n[0][i - 1].node;
  if (!l.parent) throw new Error("Please select nodes in the same main topic.");
  return {
    parent: l.id,
    start: r,
    end: s
  };
}, xo = function(e) {
  const t = document.createElementNS(R, "g");
  return t.setAttribute("id", e), t;
}, We = function(e, t) {
  const n = document.createElementNS(R, "path");
  return O(n, {
    d: e,
    stroke: t || "#666",
    fill: "none",
    "stroke-linecap": "round",
    "stroke-width": "2"
  }), n;
}, Eo = (e) => e.parentElement.parentElement, zt = function(e, t) {
  const n = e.summaries.findIndex((i) => i.id === t);
  return n === -1 ? !1 : (e.summaries.splice(n, 1), e.nodes.querySelector("#s-" + t)?.remove(), e.nodes.querySelector("#label-s-" + t)?.remove(), !0);
}, So = function(e, { parent: t, start: n }) {
  const i = e.findEle(t), o = i.nodeObj;
  let r;
  return o.parent ? r = i.closest("me-main").className : r = e.findEle(o.children[n].id).closest("me-main").className, r;
}, nt = function(e, t) {
  const { id: n, label: i, parent: o, start: r, end: s, style: l } = t, { nodes: c, theme: a, summarySvg: d } = e, h = e.findEle(o).nodeObj, p = So(e, t);
  let f = 1 / 0, y = 0, w = 0, b = 0, m = 0, x = 1 / 0, M = 0;
  for (let k = r; k <= s; k++) {
    const L = h.children?.[k];
    if (!L)
      return null;
    const $ = Eo(e.findEle(L.id)), { offsetLeft: I, offsetTop: ee } = W(c, $), te = r === s ? 10 : 20;
    k === r && (w = ee + te), k === s && (b = ee + $.offsetHeight - te), k === r && (x = I + te), k === s && (M = I + $.offsetWidth - te), ee + $.offsetHeight > m && (m = ee + $.offsetHeight), I < f && (f = I), $.offsetWidth + I > y && (y = $.offsetWidth + I);
  }
  let T, u;
  const v = l?.stroke || a.cssVar["--color"], E = l?.labelColor || a.cssVar["--color"], C = "s-" + n, N = e.markdown ? e.markdown(i, t) : i;
  if (p === H.DOWN) {
    const k = m + 10, L = (x + M) / 2;
    T = We(`M ${x} ${k - 10} c 0 5 5 10 10 10 L ${M - 10} ${k} c 5 0 10 -5 10 -10 M ${L} ${k} v 10`, v), u = De(N, L, k + 20, { anchor: "middle", color: E, dataType: "summary", svgId: C });
  } else {
    const k = h.parent ? 10 : 0, L = w + k, $ = b + k, I = (L + $) / 2;
    p === H.LHS ? (T = We(`M ${f + 10} ${L} c -5 0 -10 5 -10 10 L ${f} ${$ - 10} c 0 5 5 10 10 10 M ${f} ${I} h -10`, v), u = De(N, f - 20, I, { anchor: "end", color: E, dataType: "summary", svgId: C })) : (T = We(`M ${y - 10} ${L} c 5 0 10 5 10 10 L ${y} ${$ - 10} c 0 5 -5 10 -10 10 M ${y} ${I} h 10`, v), u = De(N, y + 20, I, { anchor: "start", color: E, dataType: "summary", svgId: C }));
  }
  const D = xo(C);
  return D.appendChild(T), e.labelContainer.appendChild(u), Oe(u), D.summaryObj = t, D.labelEl = u, d.appendChild(D), D;
}, Co = function(e = {}) {
  if (!this.currentNodes) return;
  const { currentNodes: t, summaries: n, bus: i } = this, { parent: o, start: r, end: s } = wo(t), l = { id: Z(), parent: o, start: r, end: s, label: "summary", style: e.style }, c = nt(this, l);
  n.push(l), this.editSummary(c), i.fire("operation", {
    name: "createSummary",
    obj: l
  });
}, No = function(e) {
  const t = Z(), n = { ...e, id: t };
  nt(this, n), this.summaries.push(n), this.bus.fire("operation", {
    name: "createSummary",
    obj: n
  });
}, To = function(e) {
  zt(this, e) && this.bus.fire("operation", {
    name: "removeSummary",
    obj: { id: e }
  });
}, Mo = function(e) {
  const t = e.labelEl;
  t && t.classList.add("selected"), this.currentSummary = e, this.bus.fire("selectSummary", e.summaryObj);
}, ko = function() {
  this.currentSummary?.labelEl?.classList.remove("selected"), this.currentSummary = null, this.bus.fire("unselectSummary");
}, _o = function() {
  this.summarySvg.innerHTML = "";
  const e = [];
  this.summaries.forEach((t) => {
    try {
      nt(this, t) === null && e.push(t.id);
    } catch {
    }
  }), e.forEach((t) => zt(this, t)), this.nodes.insertAdjacentElement("beforeend", this.summarySvg);
}, Do = function(e) {
  e && e.labelEl && Ht(this, e.labelEl, e.summaryObj);
}, Lo = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  createSummary: Co,
  createSummaryFrom: No,
  editSummary: Do,
  removeSummary: To,
  renderSummary: _o,
  selectSummary: Mo,
  unselectSummary: ko
}, Symbol.toStringTag, { value: "Module" })), B = "http://www.w3.org/2000/svg";
function Ao(e, t) {
  const n = document.createElementNS(B, "svg");
  return O(n, {
    version: "1.1",
    xmlns: B,
    height: e,
    width: t
  }), n;
}
function $o(e, t) {
  return (parseInt(e) - parseInt(t)) / 2;
}
function Po(e, t, n, i) {
  const o = document.createElementNS(B, "g");
  let r = "";
  return e.text ? r = e.text.textContent : r = e.childNodes[0].textContent, r.split(`
`).forEach((s, l) => {
    const c = document.createElementNS(B, "text");
    O(c, {
      x: n + parseInt(t.paddingLeft) + "",
      y: i + parseInt(t.paddingTop) + $o(t.lineHeight, t.fontSize) * (l + 1) + parseFloat(t.fontSize) * (l + 1) + "",
      "text-anchor": "start",
      "font-family": t.fontFamily,
      "font-size": `${t.fontSize}`,
      "font-weight": `${t.fontWeight}`,
      fill: `${t.color}`
    }), c.innerHTML = s, o.appendChild(c);
  }), o;
}
function Oo(e, t, n, i) {
  let o = "";
  e.nodeObj?.dangerouslySetInnerHTML ? o = e.nodeObj.dangerouslySetInnerHTML : e.text ? o = e.text.textContent : o = e.childNodes[0].textContent;
  const r = document.createElementNS(B, "foreignObject");
  O(r, {
    x: n + parseInt(t.paddingLeft) + "",
    y: i + parseInt(t.paddingTop) + "",
    width: t.width,
    height: t.height
  });
  const s = document.createElement("div");
  return O(s, {
    xmlns: "http://www.w3.org/1999/xhtml",
    style: `font-family: ${t.fontFamily}; font-size: ${t.fontSize}; font-weight: ${t.fontWeight}; color: ${t.color}; white-space: pre-wrap;`
  }), s.innerHTML = o, r.appendChild(s), r;
}
function jo(e, t) {
  const n = getComputedStyle(t), { offsetLeft: i, offsetTop: o } = W(e.nodes, t), r = document.createElementNS(B, "rect");
  return O(r, {
    x: i + "",
    y: o + "",
    rx: n.borderRadius,
    ry: n.borderRadius,
    width: n.width,
    height: n.height,
    fill: n.backgroundColor,
    stroke: n.borderColor,
    "stroke-width": n.borderWidth
  }), r;
}
function Te(e, t, n = !1) {
  const i = getComputedStyle(t), { offsetLeft: o, offsetTop: r } = W(e.nodes, t), s = document.createElementNS(B, "rect");
  O(s, {
    x: o + "",
    y: r + "",
    rx: i.borderRadius,
    ry: i.borderRadius,
    width: i.width,
    height: i.height,
    fill: i.backgroundColor,
    stroke: i.borderColor,
    "stroke-width": i.borderWidth
  });
  const l = document.createElementNS(B, "g");
  l.appendChild(s);
  let c;
  return n ? c = Oo(t, i, o, r) : c = Po(t, i, o, r), l.appendChild(c), l;
}
function Ho(e, t) {
  const n = getComputedStyle(t), { offsetLeft: i, offsetTop: o } = W(e.nodes, t), r = document.createElementNS(B, "a"), s = document.createElementNS(B, "text");
  return O(s, {
    x: i + "",
    y: o + parseInt(n.fontSize) + "",
    "text-anchor": "start",
    "font-family": n.fontFamily,
    "font-size": `${n.fontSize}`,
    "font-weight": `${n.fontWeight}`,
    fill: `${n.color}`
  }), s.innerHTML = t.textContent, r.appendChild(s), r.setAttribute("href", t.href), r;
}
function Io(e, t) {
  const n = getComputedStyle(t), { offsetLeft: i, offsetTop: o } = W(e.nodes, t), r = document.createElementNS(B, "image");
  return O(r, {
    x: i + "",
    y: o + "",
    width: n.width + "",
    height: n.height + "",
    href: t.src
  }), r;
}
const Me = 100, Bo = '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">', Wo = (e, t = !1) => {
  const n = e.nodes, i = n.offsetHeight + Me * 2, o = n.offsetWidth + Me * 2, r = Ao(i + "px", o + "px"), s = document.createElementNS(B, "svg"), l = document.createElementNS(B, "rect");
  O(l, {
    x: "0",
    y: "0",
    width: `${o}`,
    height: `${i}`,
    fill: e.theme.cssVar["--bgcolor"]
  }), r.appendChild(l), n.querySelectorAll(".subLines").forEach((h) => {
    const p = h.cloneNode(!0), { offsetLeft: f, offsetTop: y } = W(n, h.parentElement);
    p.setAttribute("x", `${f}`), p.setAttribute("y", `${y}`), s.appendChild(p);
  });
  const c = n.querySelector(".lines")?.cloneNode(!0);
  c && s.appendChild(c);
  const a = n.querySelector(".topiclinks")?.cloneNode(!0);
  a && s.appendChild(a);
  const d = n.querySelector(".summary")?.cloneNode(!0);
  return d && s.appendChild(d), n.querySelectorAll("me-tpc").forEach((h) => {
    h.nodeObj.dangerouslySetInnerHTML ? s.appendChild(Te(e, h, !t)) : (s.appendChild(jo(e, h)), s.appendChild(Te(e, h.text, !t)));
  }), n.querySelectorAll(".tags > span").forEach((h) => {
    s.appendChild(Te(e, h));
  }), n.querySelectorAll(".icons > span").forEach((h) => {
    s.appendChild(Te(e, h));
  }), n.querySelectorAll(".hyper-link").forEach((h) => {
    s.appendChild(Ho(e, h));
  }), n.querySelectorAll("img").forEach((h) => {
    s.appendChild(Io(e, h));
  }), O(s, {
    x: Me + "",
    y: Me + "",
    overflow: "visible"
  }), r.appendChild(s), r;
}, Ro = (e, t) => (t && e.insertAdjacentHTML("afterbegin", "<style>" + t + "</style>"), Bo + e.outerHTML);
function Vo(e) {
  return new Promise((t, n) => {
    const i = new FileReader();
    i.onload = (o) => {
      t(o.target.result);
    }, i.onerror = (o) => {
      n(o);
    }, i.readAsDataURL(e);
  });
}
const Yo = function(e = !1, t) {
  const n = Wo(this, e), i = Ro(n, t);
  return new Blob([i], { type: "image/svg+xml" });
}, qo = async function(e = !1, t) {
  const n = this.exportSvg(e, t), i = await Vo(n);
  return new Promise((o, r) => {
    const s = new Image();
    s.setAttribute("crossOrigin", "anonymous"), s.onload = () => {
      const l = document.createElement("canvas");
      l.width = s.width, l.height = s.height, l.getContext("2d").drawImage(s, 0, 0), l.toBlob(o, "image/png", 1);
    }, s.src = i, s.onerror = r;
  });
}, Fo = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  exportPng: qo,
  exportSvg: Yo
}, Symbol.toStringTag, { value: "Module" }));
function Ko(e, t) {
  return async function(...n) {
    const i = this.before[t];
    i && !await i.apply(this, n) || e.apply(this, n);
  };
}
const xt = Object.keys(Lt), Gt = {};
for (let e = 0; e < xt.length; e++) {
  const t = xt[e];
  Gt[t] = Ko(Lt[t], t);
}
const Xo = {
  getObjById: Le,
  generateNewObj: gn,
  layout: Cn,
  linkDiv: Pi,
  editTopic: Ln,
  createWrapper: Mn,
  createParent: kn,
  createChildren: _n,
  createTopic: Dn,
  findEle: Nt,
  changeTheme: io,
  changeCompact: oo,
  ...xi,
  ...Gt,
  ...vo,
  ...Lo,
  ...Fo,
  init(e) {
    if (e = JSON.parse(JSON.stringify(e)), !e || !e.nodeData) return new Error("MindElixir: `data` is required");
    e.direction !== void 0 && (this.direction = e.direction), e.compact !== void 0 && (this.compact = e.compact), this.changeTheme(e.theme || this.theme, !1), e.meta && (this.meta = e.meta), this.nodeData = e.nodeData, Q(this.nodeData), this.arrows = e.arrows || [], this.summaries = e.summaries || [], this.tidyArrow(), this.toolBar && Gi(this), this.keypress && Di(this, this.keypress), no(this), this.disposable.push(Sn()), this.contextMenu && this.disposable.push(ji(this, this.contextMenu)), this.allowUndo && this.disposable.push(Ii(this)), this.layout(), this.linkDiv(), this.toCenter();
  },
  destroy() {
    this.disposable.forEach((e) => e()), this.el && (this.el.innerHTML = ""), this.el = void 0, this.nodeData = void 0, this.arrows = void 0, this.summaries = void 0, this.currentArrow = void 0, this.currentNodes = void 0, this.currentSummary = void 0, this.theme = void 0, this.direction = void 0, this.bus = void 0, this.container = void 0, this.map = void 0, this.lines = void 0, this.linkController = void 0, this.arrowSvg = void 0, this.P2 = void 0, this.P3 = void 0, this.line1 = void 0, this.line2 = void 0, this.nodes = void 0, this.selection?.destroy(), this.selection = void 0;
  },
  /**
   * @public
   * @param {boolean} enable
   */
  enableMobileMultiSelect(e) {
    this.mobileMultiSelect = e;
  }
}, zo = "5.15.1";
function Go(e) {
  return {
    x: 0,
    y: 0,
    moved: !1,
    // differentiate click and move
    mousedown: !1,
    handlePointerDown(t) {
      this.moved = !1;
      const n = t.target, i = e.mouseSelectionButton === 0 ? 2 : 0, o = e.spacePressed && t.button === 0 && t.pointerType === "mouse", r = !e.editable || t.button === i && t.pointerType === "mouse" || t.pointerType === "touch";
      !o && !r || (this.x = t.clientX, this.y = t.clientY, n.className !== "circle" && n.contentEditable !== "plaintext-only" && (this.mousedown = !0, n.setPointerCapture(t.pointerId)));
    },
    handlePointerMove(t) {
      if (!this.mousedown || t.target.contentEditable === "plaintext-only" && !e.spacePressed) return !1;
      const n = t.clientX - this.x, i = t.clientY - this.y;
      return this.x = t.clientX, this.y = t.clientY, this.moved = !0, e.move(n, i), !0;
    },
    handlePointerUp(t) {
      if (!this.mousedown) return;
      const n = t.target;
      n.hasPointerCapture && n.hasPointerCapture(t.pointerId) && n.releasePointerCapture(t.pointerId), this.mousedown = !1;
    },
    clear() {
      this.mousedown = !1, this.moved = !1;
    }
  };
}
class z {
  static LEFT = 0;
  static RIGHT = 1;
  static SIDE = 2;
  static DOWN = 3;
  static THEME = Ve;
  static DARK_THEME = Ye;
  /**
   * @memberof MindElixir
   * @static
   */
  static version = zo;
  /**
   * @function
   * @memberof MindElixir
   * @static
   * @name E
   * @param {string} id Node id.
   * @return {TargetElement} Target element.
   * @example
   * E('bd4313fbac40284b')
   */
  static E = Nt;
  /**
   * @function new
   * @memberof MindElixir
   * @static
   * @param {String} topic root topic
   */
  static new = (t) => ({
    nodeData: {
      id: Z(),
      topic: t || "new topic",
      children: []
    }
  });
  // #endregion GENERATED
  get currentNode() {
    return this.currentNodes[this.currentNodes.length - 1];
  }
  constructor({
    el: t,
    direction: n,
    editable: i,
    contextMenu: o,
    toolBar: r,
    keypress: s,
    mouseSelectionButton: l,
    selectionContainer: c,
    before: a,
    newTopicName: d,
    allowUndo: h,
    generateMainBranch: p,
    generateSubBranch: f,
    overflowHidden: y,
    compact: w,
    theme: b,
    alignment: m,
    scaleSensitivity: x,
    scaleMax: M,
    scaleMin: T,
    handleWheel: u,
    markdown: v,
    imageProxy: E,
    pasteHandler: C,
    mobileMultiSelect: N
  }) {
    let D = null;
    const k = Object.prototype.toString.call(t);
    if (k === "[object HTMLDivElement]" ? D = t : k === "[object String]" && (D = document.querySelector(t)), !D) throw new Error("MindElixir: el is not a valid element");
    D.style.position = "relative", D.innerHTML = "", this.el = D, this.disposable = [], this.before = a || {}, this.newTopicName = d || "New Node", this.contextMenu = o ?? !0, this.toolBar = r ?? !0, this.keypress = s ?? !0, this.mouseSelectionButton = l ?? 0, this.direction = n ?? 1, this.editable = i ?? !0, this.allowUndo = h ?? !0, this.scaleSensitivity = x ?? 0.1, this.scaleMax = M ?? 1.4, this.scaleMin = T ?? 0.2, this.generateMainBranch = p || Rt, this.generateSubBranch = f || Vt, this.overflowHidden = y ?? !1, this.compact = w ?? !1, this.alignment = m ?? "root", this.handleWheel = u ?? !0, this.markdown = v || void 0, this.imageProxy = E || void 0, this.currentNodes = [], this.currentArrow = null, this.scaleVal = 1, this.tempDirection = null, this.mobileMultiSelect = N ?? !1, this.panHelper = Go(this), this.bus = Ai(), this.container = document.createElement("div"), this.selectionContainer = c || this.container, this.container.className = "map-container";
    const L = window.matchMedia("(prefers-color-scheme: dark)");
    this.theme = b || (L.matches ? Ye : Ve);
    const $ = document.createElement("div");
    $.className = "map-canvas", this.map = $, this.container.setAttribute("tabindex", "0"), this.container.appendChild(this.map), this.el.appendChild(this.container), this.nodes = document.createElement("me-nodes"), this.lines = me("lines"), this.summarySvg = me("summary"), this.linkController = me("linkcontroller"), this.P2 = document.createElement("div"), this.P3 = document.createElement("div"), this.P2.className = this.P3.className = "circle", this.P2.style.display = this.P3.style.display = "none", this.line1 = ut(), this.line2 = ut(), this.linkController.appendChild(this.line1), this.linkController.appendChild(this.line2), this.arrowSvg = me("topiclinks"), this.labelContainer = document.createElement("div"), this.labelContainer.className = "label-container", this.map.appendChild(this.nodes), this.overflowHidden ? this.container.style.overflow = "hidden" : this.disposable.push(Li(this)), C && (this.pasteHandler = C);
  }
}
Object.assign(z.prototype, Xo);
const Uo = {
  addChild: "插入子节点",
  addParent: "插入父节点",
  addSibling: "插入同级节点",
  removeNode: "删除节点",
  focus: "专注",
  cancelFocus: "取消专注",
  moveUp: "上移",
  moveDown: "下移",
  link: "连接",
  linkBidirectional: "双向连接",
  clickTips: "请点击目标节点",
  summary: "摘要"
}, Jo = Uo, ge = {
  emerald: { root: "#00856a", rootText: "#ffffff", node: "#e8f5f0", text: "#17332b", accent: "#00856a", palette: ["#00856a", "#2b8f75", "#5aa58f", "#83bbaa", "#a8d0c3", "#d4e7df"] },
  ocean: { root: "#2563eb", rootText: "#ffffff", node: "#eaf2ff", text: "#17324d", accent: "#2563eb", palette: ["#2563eb", "#0ea5e9", "#0891b2", "#14b8a6", "#67e8f9", "#bfdbfe"] },
  sunset: { root: "#c2410c", rootText: "#ffffff", node: "#fff7ed", text: "#7c2d12", accent: "#ea580c", palette: ["#c2410c", "#ea580c", "#f59e0b", "#eab308", "#fb923c", "#fed7aa"] },
  mono: { root: "#334155", rootText: "#ffffff", node: "#f1f5f9", text: "#1e293b", accent: "#475569", palette: ["#334155", "#475569", "#64748b", "#94a3b8", "#cbd5e1", "#e2e8f0"] }
};
function pe(e) {
  const t = ge[e];
  return {
    ...z.THEME,
    name: `Knowledge ${e}`,
    palette: t.palette,
    cssVar: {
      ...z.THEME.cssVar,
      "--accent-color": t.accent,
      "--root-bgcolor": t.root,
      "--root-color": t.rootText,
      "--selected": `${t.accent}22`,
      "--panel-bgcolor": "#ffffff",
      "--panel-border-color": "#d9e4df"
    }
  };
}
const Ut = { left: z.LEFT, right: z.RIGHT, side: z.SIDE, down: z.DOWN };
function Jt(e) {
  return {
    id: e.id,
    topic: e.text,
    expanded: e.expanded,
    direction: e.direction === "left" ? 0 : e.direction === "right" ? 1 : void 0,
    style: { color: e.style.color, background: e.style.background_color, fontWeight: e.style.font_weight },
    ...e.tags?.length ? { tags: e.tags } : {},
    ...e.note ? { note: e.note } : {},
    ...e.link ? { hyperLink: e.link } : {},
    children: e.children.map(Jt)
  };
}
function se(e) {
  return {
    nodeData: Jt(e.root),
    direction: Ut[e.layout],
    compact: e.compact,
    arrows: e.relations.map((t) => ({ id: t.id, from: t.from, to: t.to, label: t.label, bidirectional: t.bidirectional, style: { stroke: t.color, strokeWidth: t.width, strokeDasharray: t.dashed ? "6 4" : "" } }))
  };
}
function Qt(e) {
  const t = e.style || {};
  return {
    id: e.id,
    text: e.topic || "",
    expanded: e.expanded !== !1,
    direction: e.direction === 0 ? "left" : e.direction === 1 ? "right" : "auto",
    style: {
      color: typeof t.color == "string" ? t.color : "#17332b",
      background_color: typeof t.background == "string" ? t.background : "#e8f5f0",
      font_weight: t.fontWeight === "bold" ? "bold" : "normal"
    },
    ...Array.isArray(e.tags) && e.tags.length ? { tags: e.tags.map((n) => typeof n == "string" ? n : n.text).filter((n) => !!n) } : {},
    ...typeof e.note == "string" && e.note ? { note: e.note } : {},
    ...typeof e.hyperLink == "string" && e.hyperLink ? { link: e.hyperLink } : {},
    children: (e.children || []).map(Qt)
  };
}
function Zt(e, t) {
  if (e.id === t) return e;
  for (const n of e.children) {
    const i = Zt(n, t);
    if (i) return i;
  }
  return null;
}
function en(e, t, n) {
  return e.id === t ? { ...e, ...n } : { ...e, children: e.children.map((i) => en(i, t, n)) };
}
function ke(e, t) {
  return Re(JSON.stringify({
    schema_version: 1,
    ...t,
    root: Qt(e.nodeData),
    relations: (e.arrows || []).map((n) => ({
      id: n.id,
      from: n.from,
      to: n.to,
      label: n.label || "",
      bidirectional: !!n.bidirectional,
      color: typeof n.style?.stroke == "string" ? n.style.stroke : "#64748b",
      width: Math.min(12, Math.max(1, Number(n.style?.strokeWidth) || 2)),
      dashed: !!n.style?.strokeDasharray
    }))
  }));
}
function tn(e, t, n = !1) {
  const i = ge[t];
  return {
    ...e,
    style: {
      color: n ? i.rootText : i.text,
      background_color: n ? i.root : i.node,
      font_weight: n ? "bold" : e.style.font_weight
    },
    children: e.children.map((o) => tn(o, t))
  };
}
function fe(e, t) {
  if (!t || !e.getObjById(t, e.nodeData)) return !1;
  try {
    return e.selectNode(e.findEle(t)), !0;
  } catch {
    return !1;
  }
}
function nr({ body: e, readOnly: t = !1, documentTitle: n = "思维导图", initialBlockID: i, authorizeContentAction: o, onChange: r, onPresence: s, onCommentAnchor: l, onActionFeedback: c }) {
  const a = G(null), d = G(null), h = G(null), p = G(e), f = G(it(e)), y = G(r), w = G({ onPresence: s, onCommentAnchor: l }), [b, m] = xe(f.current.theme), [x, M] = xe(f.current.layout), [T, u] = xe(""), [v, E] = xe(0);
  y.current = r, w.current = { onPresence: s, onCommentAnchor: l };
  const C = (g) => {
    f.current = g, m(g.theme), M(g.layout), y.current(Ee(g));
  };
  He(() => {
    if (!a.current) return;
    f.current = it(p.current);
    const g = new z({
      el: a.current,
      direction: Ut[f.current.layout],
      editable: !t,
      contextMenu: t ? !1 : { locale: Jo, focus: !0, link: !0 },
      toolBar: !t,
      keypress: !t,
      overflowHidden: !0,
      compact: f.current.compact,
      theme: pe(f.current.theme)
    });
    g.init(se(f.current)), d.current = g;
    const S = () => {
      t || C(ke(g.getData(), f.current));
    }, A = (V) => {
      const Y = g.currentNodes.map((we) => we.nodeObj), ie = Y.length > 0 ? Y : V, q = ie[0];
      u(q?.id || ""), w.current.onPresence?.(q?.id, ie.length > 1 ? ie[ie.length - 1]?.id : void 0), w.current.onCommentAnchor?.(q ? { nodeID: q.id, quote: (q.topic || "思维导图节点").trim() } : void 0);
    }, P = (V) => A([V]), ne = () => {
      const V = g.currentNodes.map((Y) => Y.nodeObj);
      if (V.length > 0) {
        A(V);
        return;
      }
      u(""), w.current.onPresence?.(), w.current.onCommentAnchor?.();
    }, ve = (V) => {
      const Y = V.target instanceof Element ? V.target.closest("me-tpc") : null;
      if (!Y || !a.current?.contains(Y)) {
        ne();
        return;
      }
      const ie = Y.nodeObj, q = Y.getAttribute("data-nodeid") || "", we = q.startsWith("me") ? q.slice(2) : q, ue = ie || (we ? g.getObjById(we, g.nodeData) : null);
      ue && (u(ue.id), w.current.onPresence?.(ue.id), w.current.onCommentAnchor?.({ nodeID: ue.id, quote: (ue.topic || "思维导图节点").trim() }));
    };
    return g.bus.addListener("operation", S), g.bus.addListener("selectNodes", A), g.bus.addListener("selectNewNode", P), a.current.addEventListener("pointerdown", ve, !0), () => {
      a.current?.removeEventListener("pointerdown", ve, !0), d.current = null, g.destroy();
    };
  }, [t]), He(() => {
    const g = d.current;
    !g || !i || !fe(g, i) || (u(i), g.findEle(i)?.scrollIntoView({ block: "center", inline: "center" }));
  }, [i]), He(() => {
    const g = d.current;
    if (!g) return;
    let S;
    try {
      S = Re(e);
    } catch {
      return;
    }
    Ee(S) !== Ee(f.current) && (f.current = S, m(S.theme), M(S.layout), g.changeTheme(pe(S.theme), !1), g.refresh(se(S)), g.clearHistory?.(), fe(g, T) || u(""));
  }, [e, T]);
  const N = (g) => {
    const S = d.current;
    if (!S) return;
    const A = ge[g], P = ke(S.getData(), f.current), ne = {
      ...P,
      theme: g,
      root: tn(P.root, g, !0),
      relations: P.relations.map((ve) => ({ ...ve, color: A.accent }))
    };
    S.changeTheme(pe(g), !1), S.refresh(se(ne)), fe(S, T), C(ne);
  }, D = (g) => {
    const S = d.current;
    S && ({ left: S.initLeft, right: S.initRight, side: S.initSide, down: S.initDown }[g].call(S), fe(S, T), C(ke(S.getData(), { ...f.current, layout: g })));
  }, k = async (g) => {
    const S = d.current;
    if (!S || !T) return;
    const A = S.getObjById(T, S.nodeData), P = S.findEle(T);
    !A || !P || await S.reshapeNode(P, { style: { ...A.style, ...g.color ? { color: g.color } : {}, ...g.background_color ? { background: g.background_color } : {}, ...g.font_weight ? { fontWeight: g.font_weight } : {} } });
  }, L = (g) => {
    const S = d.current;
    if (!(!S || !T))
      try {
        const A = ke(S.getData(), f.current), P = { ...A, root: en(A.root, T, g) };
        S.refresh(se(P)), fe(S, T), C(P), E((ne) => ne + 1);
      } catch (A) {
        c?.(A instanceof Error ? A.message : "节点属性无效。");
      }
  }, $ = (g) => {
    const S = d.current, A = mn[g];
    if (!S || !A) return;
    const P = structuredClone(A);
    f.current = P, S.changeTheme(pe(P.theme), !1), S.refresh(se(P)), S.clearHistory?.(), C(P), c?.("已应用思维导图模板。");
  }, I = async (g) => {
    if (g) {
      try {
        const S = Re(await g.text());
        f.current = S, d.current?.changeTheme(pe(S.theme), !1), d.current?.refresh(se(S)), d.current?.clearHistory?.(), C(S), c?.("已导入思维导图 JSON。");
      } catch (S) {
        c?.(S instanceof Error ? S.message : "导入失败。");
      }
      h.current && (h.current.value = "");
    }
  }, ee = async () => {
    if (!o) throw Error("当前页面禁止导出内容。");
    await o("export"), ot(new Blob([Ee(f.current)], { type: "application/json" }), `${n || "思维导图"}.json`);
  }, te = async () => {
    if (!o) throw Error("当前页面禁止导出内容。");
    await o("export");
    const g = await d.current?.exportPng(!1);
    g ? ot(g, `${n || "思维导图"}.png`) : c?.("当前浏览器无法导出思维导图图片。");
  }, he = T ? Zt(f.current.root, T) : null;
  return /* @__PURE__ */ j("div", { className: "knowledge-open-editor is-mind-elixir", children: [
    !t && /* @__PURE__ */ j("div", { className: "diagram-editor-toolbar", "aria-label": "思维导图工具栏", children: [
      /* @__PURE__ */ j("label", { children: [
        /* @__PURE__ */ _(nn, { size: 15 }),
        "主题",
        /* @__PURE__ */ _("select", { "aria-label": "思维导图主题", value: b, onChange: (g) => N(g.target.value), children: un.map((g) => /* @__PURE__ */ _("option", { value: g, children: { emerald: "翡翠", ocean: "海洋", sunset: "日落", mono: "中性" }[g] }, g)) })
      ] }),
      /* @__PURE__ */ j("label", { children: [
        "布局",
        /* @__PURE__ */ _("select", { "aria-label": "思维导图布局", value: x, onChange: (g) => D(g.target.value), children: pn.map((g) => /* @__PURE__ */ _("option", { value: g, children: { side: "双侧", left: "向左", right: "向右", down: "向下" }[g] }, g)) })
      ] }),
      /* @__PURE__ */ j("label", { children: [
        /* @__PURE__ */ _(on, { size: 15 }),
        "模板",
        /* @__PURE__ */ j("select", { "aria-label": "思维导图模板", defaultValue: "", onChange: (g) => {
          $(g.target.value), g.target.value = "";
        }, children: [
          /* @__PURE__ */ _("option", { value: "", disabled: !0, children: "选择模板" }),
          /* @__PURE__ */ _("option", { value: "brainstorming", children: "头脑风暴" }),
          /* @__PURE__ */ _("option", { value: "swot", children: "SWOT 分析" })
        ] })
      ] }),
      /* @__PURE__ */ j("span", { className: "diagram-style-tools", "aria-label": "节点样式", children: [
        /* @__PURE__ */ _("button", { type: "button", disabled: !T, "aria-label": "节点加粗", onClick: () => k({ font_weight: "bold" }), children: /* @__PURE__ */ _("strong", { children: "B" }) }),
        [ge[b].node, ge[b].text].map((g, S) => /* @__PURE__ */ _("button", { type: "button", disabled: !T, className: "diagram-color-swatch", style: { background: g }, "aria-label": S === 0 ? "节点背景色" : "节点文字色", onClick: () => k(S === 0 ? { background_color: g } : { color: g }) }, g))
      ] }),
      /* @__PURE__ */ j(Ie, { title: "导入 canonical JSON", "aria-label": "导入思维导图 JSON", onClick: () => h.current?.click(), children: [
        /* @__PURE__ */ _(rn, { size: 15 }),
        "导入"
      ] }),
      o && /* @__PURE__ */ j(Ie, { title: "导出 canonical JSON", onClick: () => {
        ee().catch((g) => c?.(g instanceof Error ? g.message : "导出失败。"));
      }, children: [
        /* @__PURE__ */ _(sn, { size: 15 }),
        "JSON"
      ] }),
      o && /* @__PURE__ */ j(Ie, { title: "导出 PNG", onClick: () => {
        te().catch((g) => c?.(g instanceof Error ? g.message : "导出失败。"));
      }, children: [
        /* @__PURE__ */ _(ln, { size: 15 }),
        "PNG"
      ] }),
      /* @__PURE__ */ j("span", { className: "diagram-toolbar-hint", children: [
        /* @__PURE__ */ _(an, { size: 14 }),
        "选择节点后可同步位置与调整样式；评论请切换到评论页签"
      ] }),
      /* @__PURE__ */ _("input", { ref: h, hidden: !0, type: "file", accept: "application/json,.json", onChange: (g) => I(g.target.files?.[0]) })
    ] }),
    !t && he && /* @__PURE__ */ j("section", { className: "mindmap-node-metadata", "aria-label": "节点属性", children: [
      /* @__PURE__ */ j("label", { children: [
        /* @__PURE__ */ _(cn, { size: 14 }),
        /* @__PURE__ */ _("span", { children: "标签" }),
        /* @__PURE__ */ _("input", { defaultValue: (he.tags || []).join(", "), placeholder: "产品, 发布", onBlur: (g) => L({ tags: [...new Set(g.target.value.split(/[,，]/).map((S) => Array.from(S.trim()).slice(0, 20).join("")).filter(Boolean))].slice(0, 12) }) })
      ] }),
      /* @__PURE__ */ j("label", { children: [
        /* @__PURE__ */ _(dn, { size: 14 }),
        /* @__PURE__ */ _("span", { children: "备注" }),
        /* @__PURE__ */ _("input", { maxLength: 1365, defaultValue: he.note || "", placeholder: "补充节点背景", onBlur: (g) => L({ note: g.target.value }) })
      ] }),
      /* @__PURE__ */ j("label", { children: [
        /* @__PURE__ */ _(hn, { size: 14 }),
        /* @__PURE__ */ _("span", { children: "链接" }),
        /* @__PURE__ */ _("input", { type: "url", maxLength: 2048, defaultValue: he.link || "", placeholder: "https://example.com", onBlur: (g) => L({ link: g.target.value.trim() }) })
      ] })
    ] }, `${he.id}:${v}`),
    /* @__PURE__ */ _("div", { ref: a, className: "native-mindmap-host", "data-plain-text": fn(f.current) })
  ] });
}
export {
  nr as MindMapEditor
};
