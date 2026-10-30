import { jsxs as O, jsx as D } from "react/jsx-runtime";
import { Q as dn, T as at, k as C, U as qe, V as Ee, P as hn, B as Ie, S as We, W as un, X as pn, Y as fn, Z as lt, _ as mn } from "./index-BvmzxIIo.js";
import { useRef as X, useState as Se, useEffect as Ce } from "react";
import { FileJson as gn, Image as bn, Palette as yn, LayoutTemplate as vn, Upload as wn, Download as xn, Tags as En, StickyNote as Sn, Link as Cn } from "lucide-react";
import { m as Re } from "./thirdParty-C3dzVkJq.js";
const ze = {
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
}, Ke = {
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
function Xe(e) {
  return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
}
const Pe = function(e, t) {
  if (t.id === e)
    return t;
  if (t.children && t.children.length) {
    for (let n = 0; n < t.children.length; n++) {
      const i = Pe(e, t.children[n]);
      if (i) return i;
    }
    return null;
  } else
    return null;
}, ee = (e, t) => {
  if (e.parent = t, e.children)
    for (let n = 0; n < e.children.length; n++)
      ee(e.children[n], e);
}, ce = (e, t, n) => {
  if (e.expanded = t, e.children)
    if (n === void 0 || n > 0) {
      const i = n !== void 0 ? n - 1 : void 0;
      e.children.forEach((o) => {
        ce(o, t, i);
      });
    } else
      e.children.forEach((i) => {
        ce(i, !1);
      });
};
function Je(e) {
  if (e.id = te(), e.children)
    for (let t = 0; t < e.children.length; t++)
      Je(e.children[t]);
}
function $e(e, t, n, i) {
  const o = n - e, r = i - t, s = Math.atan2(r, o) * 180 / Math.PI, a = 12, c = 30, l = (s + 180 - c) * Math.PI / 180, h = (s + 180 + c) * Math.PI / 180;
  return {
    x1: n + Math.cos(l) * a,
    y1: i + Math.sin(l) * a,
    x2: n + Math.cos(h) * a,
    y2: i + Math.sin(h) * a
  };
}
function te() {
  return ((/* @__PURE__ */ new Date()).getTime().toString(16) + Math.random().toString(16).substring(2)).substring(2, 18);
}
const kn = function() {
  const e = te();
  return {
    topic: this.newTopicName,
    id: e
  };
};
function de(e) {
  return JSON.parse(
    JSON.stringify(e, (t, n) => {
      if (t !== "parent")
        return n;
    })
  );
}
const R = (e, t) => {
  let n = 0, i = 0;
  for (; t && t !== e; )
    n += t.offsetLeft, i += t.offsetTop, t = t.offsetParent;
  return { offsetLeft: n, offsetTop: i };
}, H = (e, t) => {
  for (const n in t)
    e.setAttribute(n, t[n]);
}, Le = (e) => e ? e.tagName === "ME-TPC" : !1, Ze = (e) => {
  const t = new Set(e.map((n) => n.nodeObj));
  return e.filter((n) => n.nodeObj.parent).filter((n) => {
    let i = n.nodeObj.parent;
    for (; i; ) {
      if (t.has(i)) return !1;
      i = i.parent;
    }
    return !0;
  });
}, Qe = (e) => {
  const t = /translate3d\(([^,]+),\s*([^,]+)/, n = e.match(t);
  return n ? { x: parseFloat(n[1]), y: parseFloat(n[2]) } : { x: 0, y: 0 };
}, Nt = function(e) {
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
}, ct = (e, t) => {
  const n = e.x - t.x, i = e.y - t.y;
  return Math.sqrt(n * n + i * i);
}, dt = function(e, t) {
  if (!t)
    return je(e), e;
  let n = e.querySelector(".insert-preview");
  const i = `insert-preview ${t} show`;
  return n || (n = document.createElement("div"), e.appendChild(n)), n.className = i, e;
}, je = function(e) {
  if (!e) return;
  const t = e.querySelectorAll(".insert-preview");
  for (const n of t || [])
    n.remove();
}, ke = function(e, t) {
  for (const n of t) {
    const i = n.parentElement.parentElement.contains(e);
    if (!(e && e.tagName === "ME-TPC" && e !== n && !i && e.nodeObj.parent)) return !1;
  }
  return !0;
}, Nn = function(e) {
  const t = document.createElement("div");
  return t.className = "mind-elixir-ghost", e.container.appendChild(t), t;
};
class Tn {
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
function Mn(e) {
  return {
    isDragging: !1,
    insertType: null,
    meet: null,
    ghost: Nn(e),
    edgeMoveController: new Tn(e),
    startX: 0,
    startY: 0,
    pointerId: null
  };
}
const _n = 5;
function ht(e, t, n, i = !1) {
  if (e.spacePressed) return !1;
  const o = n.target;
  if (o?.tagName !== "ME-TPC" || !o.nodeObj.parent) return !1;
  if (t.startX = n.clientX, t.startY = n.clientY, t.pointerId = n.pointerId, e.dragged = e.currentNodes, i) {
    Mt(e, t);
    const r = e.container.getBoundingClientRect();
    Tt(t.ghost, n.clientX - r.x, n.clientY - r.y);
  }
  return !0;
}
function Tt(e, t, n) {
  e.style.transform = `translate(${t - 10}px, ${n - 10}px)`, e.style.display = "block";
}
function Mt(e, t) {
  const { dragged: n } = e;
  if (!n) return;
  const i = document.activeElement;
  i && i.isContentEditable && i.blur(), t.isDragging = !0, n.length > 1 ? t.ghost.innerHTML = n.length + "" : t.ghost.innerHTML = n[0].innerHTML;
  for (const o of n)
    o.parentElement.parentElement.style.opacity = "0.5";
  e.panHelper.clear();
}
function Dn(e, t, n) {
  const { dragged: i } = e;
  if (!i || t.pointerId !== n.pointerId) return;
  const o = n.clientX - t.startX, r = n.clientY - t.startY, s = Math.sqrt(o * o + r * r);
  if (!t.isDragging && s > _n && Mt(e, t), !t.isDragging) return;
  const a = e.container.getBoundingClientRect();
  Tt(t.ghost, n.clientX - a.x, n.clientY - a.y), n.clientX < a.x + 50 ? t.edgeMoveController.move(1, 0) : n.clientX > a.x + a.width - 50 ? t.edgeMoveController.move(-1, 0) : n.clientY < a.y + 50 ? t.edgeMoveController.move(0, 1) : n.clientY > a.y + a.height - 50 ? t.edgeMoveController.move(0, -1) : t.edgeMoveController.stop(), je(t.meet);
  const c = 12 * e.scaleVal;
  if (e.direction === 3) {
    const h = document.elementFromPoint(n.clientX - c, n.clientY);
    if (ke(h, i)) {
      t.meet = h;
      const d = h.getBoundingClientRect();
      n.clientX > d.x + d.width ? t.insertType = "after" : t.insertType = "in";
    } else {
      const d = document.elementFromPoint(n.clientX + c, n.clientY);
      if (ke(d, i)) {
        t.meet = d;
        const u = d.getBoundingClientRect();
        n.clientX < u.x ? t.insertType = "before" : t.insertType = "in";
      } else
        t.insertType = null, t.meet = null;
    }
    t.meet && dt(t.meet, t.insertType);
    return;
  }
  const l = document.elementFromPoint(n.clientX, n.clientY - c);
  if (ke(l, i)) {
    t.meet = l;
    const h = l.getBoundingClientRect(), d = h.y;
    n.clientY > d + h.height ? t.insertType = "after" : t.insertType = "in";
  } else {
    const h = document.elementFromPoint(n.clientX, n.clientY + c);
    if (ke(h, i)) {
      t.meet = h;
      const d = h.getBoundingClientRect().y;
      n.clientY < d ? t.insertType = "before" : t.insertType = "in";
    } else
      t.insertType = null, t.meet = null;
  }
  t.meet && dt(t.meet, t.insertType);
}
function Ln(e, t, n) {
  const { dragged: i } = e;
  if (!(!i || t.pointerId !== n.pointerId)) {
    t.edgeMoveController.stop();
    for (const o of i)
      o.parentElement.parentElement.style.opacity = "1";
    t.ghost.style.display = "none", t.ghost.innerHTML = "", t.isDragging && t.meet && (je(t.meet), t.insertType === "before" ? e.moveNodeBefore(i, t.meet) : t.insertType === "after" ? e.moveNodeAfter(i, t.meet) : t.insertType === "in" && e.moveNodeIn(i, t.meet)), e.dragged = null, t.isDragging = !1, t.insertType = null, t.meet = null, t.pointerId = null;
  }
}
function ut(e, t) {
  const { dragged: n } = e;
  if (n) {
    t.edgeMoveController.stop();
    for (const i of n)
      i.parentElement.parentElement.style.opacity = "1";
    t.meet && je(t.meet), t.ghost.style.display = "none", t.ghost.innerHTML = "", e.dragged = null, t.isDragging = !1, t.insertType = null, t.meet = null, t.pointerId = null;
  }
}
function An(e) {
  return () => {
  };
}
const I = {
  LHS: "lhs",
  RHS: "rhs",
  DOWN: "down"
}, Pn = function() {
  this.nodes.innerHTML = "", this.nodes.className = this.direction === 3 ? "down" : "";
  const e = this.createTopic(this.nodeData);
  et.call(this, e, this.nodeData), e.draggable = !1;
  const t = document.createElement("me-root");
  t.appendChild(e);
  const n = this.nodeData.children || [];
  if (this.direction === 2) {
    let i = 0, o = 0;
    n.map((r) => {
      r.direction === 0 ? i += 1 : r.direction === 1 ? o += 1 : i <= o ? (r.direction = 0, i += 1) : (r.direction = 1, o += 1);
    });
  }
  $n(this, n, t);
}, $n = function(e, t, n) {
  if (e.direction === 3) {
    const r = document.createElement("me-main");
    r.className = I.DOWN;
    for (let s = 0; s < t.length; s++) {
      const { grp: a } = e.createWrapper(t[s]);
      r.appendChild(a);
    }
    e.nodes.appendChild(n), e.nodes.appendChild(r), e.nodes.appendChild(e.lines), e.nodes.appendChild(e.labelContainer);
    return;
  }
  const i = document.createElement("me-main");
  i.className = I.LHS;
  const o = document.createElement("me-main");
  o.className = I.RHS;
  for (let r = 0; r < t.length; r++) {
    const s = t[r], { grp: a } = e.createWrapper(s);
    e.direction === 2 ? s.direction === 0 ? i.appendChild(a) : o.appendChild(a) : e.direction === 0 ? i.appendChild(a) : o.appendChild(a);
  }
  e.nodes.appendChild(i), e.nodes.appendChild(n), e.nodes.appendChild(o), e.nodes.appendChild(e.lines), e.nodes.appendChild(e.labelContainer);
}, jn = function(e, t) {
  const n = document.createElement("me-children");
  for (let i = 0; i < t.length; i++) {
    const o = t[i], { grp: r } = e.createWrapper(o);
    n.appendChild(r);
  }
  return n;
}, _t = function(e, t) {
  const n = (this?.el ? this.el : t || document).querySelector(`[data-nodeid="me${e}"]`);
  if (!n) throw new Error(`FindEle: Node ${e} not found, maybe it's collapsed.`);
  return n;
}, et = function(e, t) {
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
    n.className = "icons", n.innerHTML = t.icons.map((i) => `<span>${Xe(i)}</span>`).join(""), e.appendChild(n), e.icons = n;
  } else e.icons && (e.icons = void 0);
  if (t.tags && t.tags.length) {
    const n = document.createElement("div");
    n.className = "tags", t.tags.forEach((i) => {
      const o = document.createElement("span");
      typeof i == "string" ? o.textContent = i : (o.textContent = i.text, i.className && (o.className = i.className), i.style && Object.assign(o.style, i.style)), n.appendChild(o);
    }), e.appendChild(n), e.tags = n;
  } else e.tags && (e.tags = void 0);
}, On = function(e, t) {
  const n = document.createElement("me-wrapper"), { p: i, tpc: o } = this.createParent(e);
  if (n.appendChild(i), !t && e.children && e.children.length > 0) {
    const r = tt(e.expanded);
    if (i.appendChild(r), e.expanded !== !1) {
      const s = jn(this, e.children);
      n.appendChild(s);
    }
  }
  return { grp: n, top: i, tpc: o };
}, Hn = function(e) {
  const t = document.createElement("me-parent"), n = this.createTopic(e);
  return et.call(this, n, e), t.appendChild(n), { p: t, tpc: n };
}, Bn = function(e) {
  const t = document.createElement("me-children");
  return t.append(...e), t;
}, In = function(e) {
  const t = document.createElement("me-tpc");
  return t.nodeObj = e, t.dataset.nodeid = "me" + e.id, t;
};
function Dt(e) {
  const t = document.createRange();
  t.selectNodeContents(e);
  const n = window.getSelection();
  n && (n.removeAllRanges(), n.addRange(t));
}
const Wn = function(e) {
  if (!e) return;
  const t = document.createElement("div"), n = e.nodeObj, i = n.topic, { offsetLeft: o, offsetTop: r } = R(this.nodes, e);
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
  border-radius:${s.borderRadius}; `, this.direction === 0 && (t.style.right = "0"), e.style.opacity = "0", Dt(t), this.bus.fire("operation", {
    name: "beginEdit",
    obj: e.nodeObj
  }), t.addEventListener("keydown", (a) => {
    if (a.stopPropagation(), a.isComposing) return;
    const c = a.key;
    if (c === "Enter" || c === "Tab") {
      if (a.shiftKey) return;
      a.preventDefault(), t.blur(), this.container.focus();
    } else c === "Escape" && (a.preventDefault(), t.textContent = i, t.blur(), this.container.focus());
  }), t.addEventListener("blur", () => {
    if (!t) return;
    e.style.opacity = "1";
    const a = t.innerText?.trim() || "";
    t.remove(), !(a === i || a === "") && (n.topic = a, this.markdown ? e.text.innerHTML = this.markdown(n.topic, n) : e.text.textContent = a, this.linkDiv(), this.bus.fire("operation", {
      name: "finishEdit",
      obj: n,
      origin: i
    }));
  });
}, tt = function(e) {
  const t = document.createElement("me-epd");
  return t.expanded = e !== !1, t.className = e !== !1 ? "minus" : "", t;
}, Oe = (e) => {
  const t = e.parent?.children, n = t?.indexOf(e) ?? 0;
  return { siblings: t, index: n };
};
function Lt(e) {
  const { siblings: t, index: n } = Oe(e);
  return t === void 0 ? 0 : (t.splice(n, 1), t.length);
}
function Rn(e, t, n) {
  const { siblings: i, index: o } = Oe(n);
  i !== void 0 && (t === "before" ? i.splice(o, 0, e) : i.splice(o + 1, 0, e));
}
function Fn(e, t) {
  const { siblings: n, index: i } = Oe(e);
  n !== void 0 && (n[i] = t, t.children = [e]);
}
function Vn(e, t, n) {
  if (Lt(t), n.parent?.parent || (t.direction = n.direction), e === "in")
    n.children ? n.children.push(t) : n.children = [t];
  else {
    t.direction !== void 0 && (t.direction = n.direction);
    const { siblings: i, index: o } = Oe(n);
    if (i === void 0) return;
    e === "before" ? i.splice(o, 0, t) : i.splice(o + 1, 0, t);
  }
}
const Yn = function({ map: e, direction: t }, n) {
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
}, At = function(e, t, n) {
  const i = n.children[0].children[0], o = t.parentElement;
  if (o.tagName === "ME-PARENT") {
    if (ye(i), o.children[1])
      o.nextSibling.appendChild(n);
    else {
      const r = e.createChildren([n]);
      o.appendChild(tt(!0)), o.insertAdjacentElement("afterend", r);
    }
    e.linkDiv(n.offsetParent);
  } else if (o.tagName === "ME-ROOT") {
    const r = Yn(e, i.nodeObj);
    r === 3 ? e.container.querySelector("me-main.down")?.appendChild(n) : r === 0 ? e.container.querySelector(".lhs")?.appendChild(n) : e.container.querySelector(".rhs")?.appendChild(n), e.linkDiv();
  }
}, qn = function(e, t) {
  const n = e.parentNode;
  if (t === 0) {
    const i = n.parentNode.parentNode;
    i.tagName !== "ME-MAIN" && (i.previousSibling.children[1].remove(), i.remove());
  }
  n.parentNode.remove();
}, Pt = {
  before: "beforebegin",
  after: "afterend"
}, ye = function(e) {
  const t = e.parentElement.parentElement.lastElementChild;
  t?.tagName === "svg" && t?.remove();
}, zn = function(e, t) {
  const n = e.nodeObj, i = de(n);
  i.style && t.style && (t.style = Object.assign(i.style, t.style));
  const o = Object.assign(n, t);
  et.call(this, e, o), this.linkDiv(), this.bus.fire("operation", {
    name: "reshapeNode",
    obj: o,
    origin: i
  });
}, nt = function(e, t, n) {
  if (!t) return null;
  const i = t.nodeObj;
  i.expanded === !1 && (e.expandNode(t, !0), t = e.findEle(i.id));
  const o = n || e.generateNewObj();
  i.children ? i.children.push(o) : i.children = [o], ee(e.nodeData);
  const { grp: r, top: s } = e.createWrapper(o);
  return At(e, t, r), { newTop: s, newNodeObj: o };
}, Kn = function(e, t, n) {
  const i = t || this.currentNode;
  if (!i) return;
  const o = i.nodeObj;
  if (o.parent) {
    if (!o.parent?.parent && this.direction === 2) {
      const l = this.map.querySelector(".lhs")?.childElementCount || 0, h = this.map.querySelector(".rhs")?.childElementCount || 0;
      if (!l || !h) {
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
    const l = i.closest("me-main").className === I.LHS ? 0 : 1;
    r.direction = l;
  }
  Rn(r, e, o), ee(this.nodeData);
  const s = i.parentElement, { grp: a, top: c } = this.createWrapper(r);
  s.parentElement.insertAdjacentElement(Pt[e], a), this.linkDiv(a.offsetParent), n || this.editTopic(c.firstChild), this.bus.fire("operation", {
    name: "insertSibling",
    type: e,
    obj: r
  }), this.selectNode(c.firstChild, !0);
}, Xn = function(e, t) {
  const n = e || this.currentNode;
  if (!n) return;
  ye(n);
  const i = n.nodeObj;
  if (!i.parent)
    return;
  const o = t || this.generateNewObj();
  if (!i.parent?.parent) {
    const l = n.closest("me-main").className === I.LHS ? 0 : 1;
    o.direction = l;
  }
  Fn(i, o), ee(this.nodeData);
  const r = n.parentElement.parentElement, { grp: s, top: a } = this.createWrapper(o, !0);
  a.appendChild(tt(!0)), r.insertAdjacentElement("afterend", s);
  const c = this.createChildren([r]);
  a.insertAdjacentElement("afterend", c), this.linkDiv(), t || this.editTopic(a.firstChild), this.bus.fire("operation", {
    name: "insertParent",
    obj: o
  }), this.selectNode(a.firstChild, !0);
}, Un = function(e, t) {
  const n = e || this.currentNode;
  if (!n) return;
  const i = nt(this, n, t);
  if (!i) return;
  const { newTop: o, newNodeObj: r } = i;
  this.bus.fire("operation", {
    name: "addChild",
    obj: r
  }), t || this.editTopic(o.firstChild), this.selectNode(o.firstChild, !0);
}, Gn = function(e, t) {
  const n = de(e.nodeObj);
  Je(n);
  const i = nt(this, t, n);
  if (!i) return;
  const { newNodeObj: o } = i;
  this.bus.fire("operation", {
    name: "copyNode",
    obj: o
  }), this.selectNode(this.findEle(o.id));
}, Jn = function(e, t) {
  const n = [];
  for (let i = 0; i < e.length; i++) {
    const o = e[i], r = de(o.nodeObj);
    Je(r);
    const s = nt(this, t, r);
    if (!s) return;
    const { newNodeObj: a } = s;
    n.push(a);
  }
  this.bus.fire("operation", {
    name: "copyNodes",
    objs: n
  }), this.unselectNodes(this.currentNodes), this.selectNodes(n.map((i) => this.findEle(i.id)));
}, $t = function(e, t, n) {
  const i = t.parent?.children;
  if (i === void 0) return;
  const o = e.direction === 2 && !t.parent?.parent, r = (c) => !o || c.direction === t.direction;
  let s, a = !1;
  for (const c of i)
    if (r(c)) {
      if (c === t) {
        if (n === -1) return s ? { to: s, type: "before" } : void 0;
        a = !0;
        continue;
      }
      if (a) return { to: c, type: "after" };
      s = c;
    }
}, Zn = function(e) {
  const t = e || this.currentNode;
  if (!t) return;
  const n = t.nodeObj;
  if (!n.parent) return;
  const i = $t(this, n, -1);
  i && ve([t], i.type, this.findEle(i.to.id), this);
}, Qn = function(e) {
  const t = e || this.currentNode;
  if (!t) return;
  const n = t.nodeObj;
  if (!n.parent) return;
  const i = $t(this, n, 1);
  i && ve([t], i.type, this.findEle(i.to.id), this);
}, ei = function(e) {
  if (e = Ze(e), e.length === 0) return;
  for (const n of e) {
    const i = n.nodeObj, o = Lt(i);
    qn(n, o);
  }
  const t = e[e.length - 1];
  this.selectNode(this.findEle(t.nodeObj.parent.id)), this.linkDiv(), this.bus.fire("operation", {
    name: "removeNodes",
    objs: e.map((n) => n.nodeObj)
  });
}, ve = (e, t, n, i) => {
  e = Ze(e);
  let o = n.nodeObj;
  t === "in" && o.expanded === !1 && (i.expandNode(n, !0), n = i.findEle(o.id), o = n.nodeObj), t === "after" && (e = e.reverse());
  const r = /* @__PURE__ */ new Set();
  for (const a of e) {
    const c = a.nodeObj;
    if (Vn(t, c, o), ee(i.nodeData), t === "in") {
      const l = a.parentElement.parentElement, h = l.parentElement;
      At(i, n, l), r.add(h);
    } else {
      ye(a);
      const l = a.parentElement.parentNode;
      r.add(l.parentElement), n.parentElement.parentNode.insertAdjacentElement(Pt[t], l);
    }
  }
  for (const a of r)
    a.childElementCount === 0 && a.tagName !== "ME-MAIN" && (a.previousSibling.children[1].remove(), a.remove());
  i.linkDiv(), i.scrollIntoView(e[e.length - 1]);
  const s = t === "before" ? "moveNodeBefore" : t === "after" ? "moveNodeAfter" : "moveNodeIn";
  i.bus.fire("operation", {
    name: s,
    objs: e.map((a) => a.nodeObj),
    toObj: o
  });
}, ti = function(e, t) {
  ve(e, "in", t, this);
}, ni = function(e, t) {
  ve(e, "before", t, this);
}, ii = function(e, t) {
  ve(e, "after", t, this);
}, oi = function(e) {
  const t = e || this.currentNode;
  t && (t.nodeObj.dangerouslySetInnerHTML || this.editTopic(t));
}, ri = function(e, t) {
  e.text.textContent = t, e.nodeObj.topic = t, this.linkDiv();
}, jt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  addChild: Un,
  beginEdit: oi,
  copyNode: Gn,
  copyNodes: Jn,
  insertParent: Xn,
  insertSibling: Kn,
  moveDownNode: Qn,
  moveNodeAfter: ii,
  moveNodeBefore: ni,
  moveNodeIn: ti,
  moveUpNode: Zn,
  removeNodes: ei,
  reshapeNode: zn,
  rmSubline: ye,
  setNodeTopic: ri
}, Symbol.toStringTag, { value: "Module" }));
function si(e) {
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
const ai = function(e, t = !1) {
  const n = this.container, i = e.getBoundingClientRect(), o = n.getBoundingClientRect();
  if (t || i.top > o.bottom - 50 || i.bottom < o.top + 50 || i.left > o.right - 50 || i.right < o.left + 50) {
    const r = i.left + i.width / 2, s = i.top + i.height / 2, a = o.left + o.width / 2, c = o.top + o.height / 2, l = r - a, h = s - c;
    this.move(-l, -h, !0);
  }
}, li = function(e, t, n) {
  this.clearSelection(), this.scrollIntoView(e), this.selection?.select(e), t && this.bus.fire("selectNewNode", e.nodeObj);
}, ci = function(e) {
  this.selection?.select(e);
}, di = function(e) {
  this.selection?.deselect(e);
}, hi = function() {
  this.unselectNodes(this.currentNodes), this.unselectSummary(), this.unselectArrow();
}, it = function(e) {
  return JSON.stringify(e, (t, n) => {
    if (!(t === "parent" && typeof n != "string"))
      return n;
  });
}, ui = function() {
  const e = si(this);
  return it(e);
}, pi = function() {
  return JSON.parse(this.getDataString());
}, fi = function() {
  this.editable = !0;
}, mi = function() {
  this.editable = !1;
}, gi = function(e, t = { x: 0, y: 0 }) {
  if (e < this.scaleMin && e < this.scaleVal || e > this.scaleMax && e > this.scaleVal) return;
  const n = this.container.getBoundingClientRect(), i = t.x ? t.x - n.left - n.width / 2 : 0, o = t.y ? t.y - n.top - n.height / 2 : 0, { dx: r, dy: s } = ot(this), a = this.map.style.transform, { x: c, y: l } = Qe(a), h = c - r, d = l - s, u = this.scaleVal, b = (-i + h) * (1 - e / u), y = (-o + d) * (1 - e / u);
  this.map.style.transform = `translate3d(${c - b}px, ${l - y}px, 0) scale(${e})`, this.scaleVal = e, this.bus.fire("scale", e);
}, bi = function() {
  const e = this.nodes.offsetHeight / this.container.offsetHeight, t = this.nodes.offsetWidth / this.container.offsetWidth, n = 1 / Math.max(1, Math.max(e, t));
  this.scaleVal = n;
  const { dx: i, dy: o } = ot(this, !0);
  this.map.style.transform = `translate3d(${i}px, ${o}px, 0) scale(${n})`, this.bus.fire("scale", n);
}, yi = function(e, t, n = !1) {
  const { map: i, scaleVal: o, bus: r, container: s, nodes: a } = this;
  if (n && i.style.transition === "transform 0.3s")
    return !1;
  const c = i.style.transform;
  let { x: l, y: h } = Qe(c);
  const d = s.getBoundingClientRect(), u = a.getBoundingClientRect(), b = (d.left + d.right) / 2, y = (d.top + d.bottom) / 2;
  return e > 0 ? e = Math.min(e, Math.max(0, b - u.left)) : e < 0 && (e = Math.max(e, Math.min(0, b - u.right))), t > 0 ? t = Math.min(t, Math.max(0, y - u.top)) : t < 0 && (t = Math.max(t, Math.min(0, y - u.bottom))), e === 0 && t === 0 ? !1 : (l += e, h += t, n && (i.style.transition = "transform 0.3s", setTimeout(() => {
    i.style.transition = "none";
  }, 300)), i.style.transform = `translate3d(${l}px, ${h}px, 0) scale(${o})`, r.fire("move", { dx: e, dy: t }), !0);
}, ot = (e, t = !1) => {
  const { container: n, map: i, nodes: o } = e;
  let r, s;
  if (e.alignment === "nodes" || t || e.direction === 3)
    r = (n.offsetWidth - o.offsetWidth) / 2, s = (n.offsetHeight - o.offsetHeight) / 2, i.style.transformOrigin = "50% 50%";
  else {
    const a = i.querySelector("me-root"), c = a.offsetTop, l = a.offsetLeft, h = a.offsetWidth, d = a.offsetHeight;
    r = n.offsetWidth / 2 - l - h / 2, s = n.offsetHeight / 2 - c - d / 2, i.style.transformOrigin = `${l + h / 2}px 50%`;
  }
  return { dx: r, dy: s };
}, vi = function() {
  const { map: e, container: t } = this, { dx: n, dy: i } = ot(this);
  t.scrollTop = 0, t.scrollLeft = 0, e.style.transform = `translate3d(${n}px, ${i}px, 0) scale(${this.scaleVal})`;
}, wi = function(e) {
  e(this);
}, xi = function(e) {
  e.nodeObj.parent && (this.clearSelection(), this.tempDirection === null && (this.tempDirection = this.direction), this.isFocusMode || (this.nodeDataBackup = this.nodeData, this.isFocusMode = !0), this.nodeData = e.nodeObj, this.initRight(), this.toCenter());
}, Ei = function() {
  this.isFocusMode = !1, this.tempDirection !== null && (this.nodeData = this.nodeDataBackup, this.direction = this.tempDirection, this.tempDirection = null, this.refresh(), this.toCenter());
}, Si = function() {
  this.direction = 0, this.refresh(), this.toCenter(), this.bus.fire("changeDirection", this.direction);
}, Ci = function() {
  this.direction = 1, this.refresh(), this.toCenter(), this.bus.fire("changeDirection", this.direction);
}, ki = function() {
  this.direction = 2, this.refresh(), this.toCenter(), this.bus.fire("changeDirection", this.direction);
}, Ni = function() {
  this.direction = 3, this.refresh(), this.toCenter(), this.bus.fire("changeDirection", this.direction);
}, Ti = function(e, t) {
  const n = e.nodeObj;
  typeof t == "boolean" ? n.expanded = t : n.expanded !== !1 ? n.expanded = !1 : n.expanded = !0;
  const i = e.getBoundingClientRect(), o = {
    x: i.left,
    y: i.top
  }, r = e.parentNode, s = r.children[1];
  if (s.expanded = n.expanded, s.className = n.expanded ? "minus" : "", ye(e), n.expanded) {
    const d = this.createChildren(
      n.children.map((u) => this.createWrapper(u).grp)
    );
    r.parentNode.appendChild(d);
  } else
    r.parentNode.children[1].remove();
  this.linkDiv(e.closest("me-main > me-wrapper"));
  const a = e.getBoundingClientRect(), c = {
    x: a.left,
    y: a.top
  }, l = o.x - c.x, h = o.y - c.y;
  this.move(l, h), this.bus.fire("expandNode", n);
}, Mi = function(e, t) {
  const n = e.nodeObj, i = e.getBoundingClientRect(), o = {
    x: i.left,
    y: i.top
  };
  ce(n, t ?? !n.expanded), this.refresh();
  const r = this.findEle(n.id).getBoundingClientRect(), s = {
    x: r.left,
    y: r.top
  }, a = o.x - s.x, c = o.y - s.y;
  this.move(a, c);
}, _i = function(e) {
  this.clearSelection(), e && (e = JSON.parse(JSON.stringify(e)), this.nodeData = e.nodeData, this.arrows = e.arrows || [], this.summaries = e.summaries || [], e.meta && (this.meta = e.meta)), ee(this.nodeData), this.layout(), this.linkDiv();
}, Di = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  cancelFocus: Ei,
  clearSelection: hi,
  disableEdit: mi,
  enableEdit: fi,
  expandNode: Ti,
  expandNodeAll: Mi,
  focusNode: xi,
  getData: pi,
  getDataString: ui,
  initDown: Ni,
  initLeft: Si,
  initRight: Ci,
  initSide: ki,
  install: wi,
  move: yi,
  refresh: _i,
  scale: gi,
  scaleFit: bi,
  scrollIntoView: ai,
  selectNode: li,
  selectNodes: ci,
  stringifyData: it,
  toCenter: vi,
  unselectNodes: di
}, Symbol.toStringTag, { value: "Module" })), pt = "MIND-ELIXIR-WAIT-COPY", Li = 40, Ai = 10, Pi = ({ deltaMode: e, deltaY: t, viewportHeight: n }) => e === WheelEvent.DOM_DELTA_LINE ? t * Li : e === WheelEvent.DOM_DELTA_PAGE ? t * n : t, $i = ({ deltaMode: e, deltaY: t, scaleSensitivity: n, viewportHeight: i }) => {
  const o = -Pi({ deltaMode: e, deltaY: t, viewportHeight: i }) / Ai * n;
  return Math.max(-n, Math.min(n, o));
}, Ot = (e, t, n) => {
  t !== 0 && e.scale(e.scaleVal + t, n);
}, ji = (e, t) => {
  const n = e.map.querySelectorAll(`.${t}>me-wrapper>me-parent>me-tpc`);
  n.length !== 0 && e.selectNode(n[Math.ceil(n.length / 2) - 1]);
}, Ht = (e) => {
  e.selectNode(e.map.querySelector("me-root>me-tpc"));
}, Bt = function(e, t) {
  const n = t.parentElement.parentElement.parentElement.previousSibling;
  if (n) {
    const i = n.firstChild;
    e.selectNode(i);
  }
}, It = function(e, t) {
  const n = t.parentElement.nextSibling;
  if (n && n.firstChild) {
    const i = n.firstChild.firstChild.firstChild;
    e.selectNode(i);
  }
}, ft = function(e, t) {
  const n = e.currentNode || e.currentNodes?.[0];
  if (!n) return;
  const i = n.nodeObj, o = n.offsetParent.offsetParent.parentElement;
  i.parent ? o.className === t ? It(e, n) : i.parent?.parent ? Bt(e, n) : Ht(e) : ji(e, t);
}, Ne = function(e, t) {
  const n = e.currentNode;
  if (!n || !n.nodeObj.parent) return;
  const i = t + "Sibling", o = n.parentElement.parentElement[i];
  o ? e.selectNode(o.firstChild.firstChild) : e.selectNode(n);
}, Oi = function(e, t) {
  const n = t.nodeObj;
  n.parent && (n.parent.parent ? Bt(e, t) : Ht(e));
}, Hi = function(e, t) {
  if (t.nodeObj.parent)
    It(e, t);
  else {
    const n = e.map.querySelectorAll(".down>me-wrapper>me-parent>me-tpc");
    if (n.length === 0) return;
    e.selectNode(n[Math.ceil(n.length / 2) - 1]);
  }
}, mt = function(e, t, n) {
  const i = t === "in" ? e.scaleSensitivity : -e.scaleSensitivity;
  Ot(e, i, n);
}, Bi = (e, t) => {
  const n = $i({
    deltaMode: t.deltaMode,
    deltaY: t.deltaY,
    scaleSensitivity: e.scaleSensitivity,
    viewportHeight: e.container.clientHeight || window.innerHeight
  });
  Ot(e, n, { x: t.clientX, y: t.clientY });
};
function Ii(e, t) {
  t = t === !0 ? {} : t;
  const n = () => {
    e.currentArrow ? e.removeArrow() : e.currentSummary ? e.removeSummary(e.currentSummary.summaryObj.id) : e.currentNodes && e.removeNodes(e.currentNodes);
  };
  let i = !1, o = null;
  const r = () => {
    i = !1, o && (clearTimeout(o), o = null), e.container.removeEventListener("keydown", s);
  }, s = (l) => {
    if (["Control", "Meta", "Shift", "Alt"].includes(l.key)) return;
    const h = e.nodeData;
    if (!h.children?.length) {
      r();
      return;
    }
    let d = !0;
    if (l.key === "0")
      for (const u of h.children)
        ce(u, !1);
    else if (l.key === "=")
      for (const u of h.children)
        ce(u, !0);
    else if (["1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(l.key))
      for (const u of h.children)
        ce(u, !0, Number(l.key) - 1);
    else
      d = !1;
    d && (e.refresh(), e.toCenter()), r();
  }, a = {
    Enter: (l) => {
      l.shiftKey ? e.insertSibling("before") : l.ctrlKey || l.metaKey ? e.insertParent() : e.insertSibling("after");
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
    ArrowUp: (l) => {
      if (l.altKey)
        e.moveUpNode();
      else {
        if (l.metaKey || l.ctrlKey)
          return e.initSide();
        if (e.direction === 3) {
          const h = e.currentNode || e.currentNodes?.[0];
          h && Oi(e, h);
        } else
          Ne(e, "previous");
      }
    },
    ArrowDown: (l) => {
      if (l.altKey)
        e.moveDownNode();
      else if (e.direction === 3) {
        const h = e.currentNode || e.currentNodes?.[0];
        h && Hi(e, h);
      } else
        Ne(e, "next");
    },
    ArrowLeft: (l) => {
      if (l.metaKey || l.ctrlKey)
        return e.initLeft();
      e.direction === 3 ? Ne(e, "previous") : ft(e, I.LHS);
    },
    ArrowRight: (l) => {
      if (l.metaKey || l.ctrlKey)
        return e.initRight();
      e.direction === 3 ? Ne(e, "next") : ft(e, I.RHS);
    },
    PageUp: () => e.moveUpNode(),
    PageDown: () => {
      e.moveDownNode();
    },
    "=": (l) => {
      (l.metaKey || l.ctrlKey) && mt(e, "in");
    },
    "-": (l) => {
      (l.metaKey || l.ctrlKey) && mt(e, "out");
    },
    0: (l) => {
      if (l.metaKey || l.ctrlKey) {
        if (i)
          return;
        e.scale(1);
      }
    },
    k: (l) => {
      (l.metaKey || l.ctrlKey) && (r(), i = !0, o = window.setTimeout(() => {
        o = null, r();
      }, 2e3), e.container.addEventListener("keydown", s));
    },
    Delete: n,
    Backspace: n,
    ...t
  };
  e.container.onkeydown = (l) => {
    if ((l.ctrlKey || l.metaKey) && ["c", "v", "x"].includes(l.key) || l.preventDefault(), !e.editable) return;
    const h = a[l.key];
    h && h(l);
  };
  const c = (l) => {
    if (l.target instanceof HTMLElement && l.target.id === "input-box" || e.currentNodes.length === 0) return !1;
    if (l.clipboardData) {
      const h = Ze(e.currentNodes).map((u) => u.nodeObj), d = it({
        magic: pt,
        data: h
      });
      return l.clipboardData.setData("text/plain", d), l.preventDefault(), !0;
    }
    return !1;
  };
  e.container.addEventListener("copy", c), e.container.addEventListener("cut", (l) => {
    c(l) && n();
  }), e.container.addEventListener("paste", (l) => {
    const h = l.clipboardData?.getData("text/plain");
    if (h)
      try {
        const d = JSON.parse(h);
        if (d && d.magic === pt && Array.isArray(d.data)) {
          const u = d.data, b = u.map((y) => ({ nodeObj: y }));
          u.length > 0 && e.currentNode && (e.copyNodes(b, e.currentNode), l.preventDefault());
          return;
        }
      } catch {
      }
    e.pasteHandler && e.pasteHandler(l);
  });
}
function Wi(e) {
  const { panHelper: t, container: n } = e;
  let i = null;
  e.spacePressed = !1;
  const o = {
    lastTap: 0,
    lastTapTarget: null,
    DOUBLE_CLICK_THRESHOLD: 300,
    detect(p, v) {
      if (p.button !== 0) {
        this.clear();
        return;
      }
      const E = (/* @__PURE__ */ new Date()).getTime(), k = E - this.lastTap, N = k < this.DOUBLE_CLICK_THRESHOLD && k > 0 && this.lastTapTarget === p.target;
      this.lastTap = E, this.lastTapTarget = p.target, N && v(p);
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
    handlePointerDown(p) {
      if (p.pointerType !== "touch") return !1;
      if (this.activePointers.set(p.pointerId, { x: p.clientX, y: p.clientY }), this.activePointers.size >= 2) {
        const [v, E] = Array.from(this.activePointers.values());
        return this.lastDistance = ct(v, E), !0;
      }
      return !1;
    },
    handlePointerMove(p) {
      if (p.pointerType !== "touch" || !this.activePointers.has(p.pointerId)) return !1;
      if (this.activePointers.set(p.pointerId, { x: p.clientX, y: p.clientY }), this.activePointers.size >= 2) {
        const [v, E] = Array.from(this.activePointers.values()), k = ct(v, E);
        if (this.lastDistance !== null && this.lastDistance > 0) {
          const N = k / this.lastDistance;
          e.scale(e.scaleVal * N, {
            x: (v.x + E.x) / 2,
            y: (v.y + E.y) / 2
          });
        }
        return this.lastDistance = k, !0;
      }
      return !1;
    },
    handlePointerUp(p) {
      p.pointerType === "touch" && (this.activePointers.delete(p.pointerId), this.activePointers.size < 2 && (this.lastDistance = null));
    },
    clear() {
      this.activePointers.clear(), this.lastDistance = null;
    }
  }, a = Mn(e), c = {
    timer: null,
    startPos: null,
    pointerId: null,
    DURATION: 500,
    MOVE_THRESHOLD: 10,
    clear() {
      this.timer !== null && (clearTimeout(this.timer), this.timer = null, this.startPos = null, this.pointerId = null);
    },
    start(p, v) {
      this.timer = window.setTimeout(() => {
        v(p), this.timer = null, this.startPos = null, this.pointerId = null;
      }, this.DURATION), this.startPos = { x: p.clientX, y: p.clientY }, this.pointerId = p.pointerId;
    },
    handleMove(p) {
      if (this.timer !== null && this.startPos !== null && p.pointerId === this.pointerId) {
        const v = p.clientX - this.startPos.x, E = p.clientY - this.startPos.y;
        Math.sqrt(v * v + E * E) > this.MOVE_THRESHOLD && this.clear();
      }
    }
  }, l = (p, v) => {
    if (p.closest("#input-box")) return !1;
    const E = p.closest(".svg-label"), k = p.closest(".topiclinks, .summary"), N = E ? { type: E.dataset.type, element: document.getElementById(E.dataset.svgId) } : k ? { type: k.classList.contains("topiclinks") ? "arrow" : "summary", element: p.closest("g") } : null;
    if (!N?.type || !N?.element) return !1;
    const { type: L, element: M } = N;
    return e.clearSelection(), L === "arrow" ? v ? e.editArrowLabel(M) : e.selectArrow(M) : v ? e.editSummary(M) : e.selectSummary(M), !0;
  }, h = (p) => {
    if (p.pointerType === "mouse" && p.button !== 0) return;
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
    if (a?.isDragging)
      return;
    const v = p.target;
    v.tagName === "ME-EPD" && (p.ctrlKey || p.metaKey ? e.expandNodeAll(v.previousSibling) : e.expandNode(v.previousSibling));
  }, d = (p) => {
    if (!e.editable) return;
    const v = p.target;
    if (Le(v)) {
      e.selectNode(v), e.beginEdit(v);
      return;
    }
    l(v, !0);
  }, u = (p) => {
    if (p.pointerType === "touch" && s.handlePointerDown(p)) {
      e.ptState = r.Pinch, c.clear(), t.clear(), (a.isDragging || a.pointerId !== null) && ut(e, a);
      return;
    }
    if (e.ptState === r.Pinch) return;
    const v = p.target;
    if (e.editable && v.className === "map-container" && p.button === 0 && p.pointerType === "mouse") {
      e.ptState = r.BoxSelect;
      return;
    }
    if (t.handlePointerDown(p), t.mousedown && (e.ptState = r.Pan), p.button === 0 || p.pointerType === "touch")
      if (Le(v)) {
        e.selection?.cancel();
        const E = e.currentNodes || [];
        if (p.ctrlKey || p.metaKey || e.mobileMultiSelect ? E.includes(v) ? i = v : ((e.currentArrow || e.currentSummary) && e.clearSelection(), e.selection?.select(v)) : E.includes(v) || e.selectNode(v), !e.editable) return;
        p.pointerType === "touch" ? (e.ptState = r.DragWait, c.start(p, (k) => {
          ht(e, a, k, !0) && (e.ptState = r.Drag, v.setPointerCapture(k.pointerId));
        })) : ht(e, a, p, !1) && (e.ptState = r.Drag, v.setPointerCapture(p.pointerId));
      } else
        l(v, !1);
  }, b = (p) => {
    switch (e.ptState) {
      case r.Pinch:
        s.handlePointerMove(p);
        break;
      case r.DragWait:
        c.handleMove(p), c.timer === null && (e.ptState = r.Pan, t.handlePointerMove(p));
        break;
      case r.Drag:
        Dn(e, a, p);
        break;
      case r.Pan:
        t.handlePointerMove(p);
        break;
    }
  }, y = (p) => {
    p.preventDefault(), window.removeEventListener("contextmenu", y, !0);
  }, x = (p) => {
    p.pointerType === "touch" && s.handlePointerUp(p);
    const v = a.isDragging, E = t.moved;
    switch (e.ptState) {
      case r.DragWait:
        c.clear();
        break;
      case r.Drag:
        Ln(e, a, p);
        break;
      case r.Pan:
        t.handlePointerUp(p), t.moved && p.button === 2 && p.pointerType === "mouse" && (window.addEventListener("contextmenu", y, { capture: !0, once: !0 }), setTimeout(() => window.removeEventListener("contextmenu", y, !0), 300));
        break;
    }
    o.detect(p, d), (e.ptState !== r.Pinch || s.activePointers.size < 2) && (e.ptState = r.Idle), i && (!v && !E && e.selection?.deselect(i), i = null);
  }, f = () => {
    s.clear(), c.clear(), t.clear(), o.clear(), (a.isDragging || a.pointerId !== null) && ut(e, a), e.ptState = r.Idle, i = null;
  }, m = (p) => {
    p.preventDefault(), p.button === 2 && e.editable && setTimeout(() => {
      if (e.panHelper.moved || e.ptState !== r.Idle && e.ptState !== r.Pan) return;
      const v = p.target;
      Le(v) && !v.classList.contains("selected") && e.selectNode(v), e.bus.fire("showContextMenu", p);
    }, 200);
  }, w = (p) => {
    if (p.ctrlKey || p.metaKey)
      return p.stopPropagation(), p.preventDefault(), Bi(e, p);
    (p.shiftKey ? e.move(-p.deltaY, 0) : e.move(-p.deltaX, -p.deltaY)) && (p.stopPropagation(), p.preventDefault());
  }, T = (p) => {
    p.code === "Space" && (e.spacePressed = !0, e.container.classList.add("space-pressed"));
  }, _ = (p) => {
    p.code === "Space" && (e.spacePressed = !1, e.container.classList.remove("space-pressed"));
  };
  return Nt([
    { dom: n, evt: "pointerdown", func: u },
    { dom: n, evt: "pointermove", func: b },
    { dom: n, evt: "pointerup", func: x },
    { dom: n, evt: "pointercancel", func: f },
    { dom: n, evt: "click", func: h },
    { dom: n, evt: "contextmenu", func: m },
    { dom: n, evt: "wheel", func: typeof e.handleWheel == "function" ? e.handleWheel : w },
    { dom: n, evt: "blur", func: f },
    { dom: n, evt: "keydown", func: T },
    { dom: n, evt: "keyup", func: _ }
  ]);
}
function Ri() {
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
const F = "http://www.w3.org/2000/svg", He = function(e) {
  const t = e.clientWidth, n = e.clientHeight, i = e.dataset, o = Number(i.x), r = Number(i.y), s = i.anchor;
  let a = o;
  s === "middle" ? a = o - t / 2 : s === "end" && (a = o - t), e.style.left = `${a}px`, e.style.top = `${r - n / 2}px`, e.style.visibility = "visible";
}, Ae = function(e, t, n, i) {
  const { anchor: o = "middle", color: r, dataType: s, svgId: a } = i, c = document.createElement("div");
  c.className = "svg-label", c.style.color = r || "#666";
  const l = "label-" + a;
  return c.id = l, c.innerHTML = e, c.dataset.type = s, c.dataset.svgId = a, c.dataset.x = t.toString(), c.dataset.y = n.toString(), c.dataset.anchor = o, c;
}, Wt = function(e, t, n) {
  const i = document.createElementNS(F, "path");
  return H(i, {
    d: e,
    stroke: t || "#666",
    fill: "none",
    "stroke-width": n
  }), i;
}, ge = function(e) {
  const t = document.createElementNS(F, "svg");
  return t.setAttribute("class", e), t.setAttribute("overflow", "visible"), t;
}, gt = function() {
  const e = document.createElementNS(F, "line");
  return e.setAttribute("stroke", "#4dc4ff"), e.setAttribute("fill", "none"), e.setAttribute("stroke-width", "2"), e.setAttribute("opacity", "0.45"), e;
}, Fi = function(e, t, n, i) {
  const o = document.createElementNS(F, "g");
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
    const a = r.d, c = document.createElementNS(F, "path"), l = {
      d: a,
      stroke: i?.stroke || "rgb(227, 125, 116)",
      fill: "none",
      "stroke-width": String(i?.strokeWidth || "2")
    };
    i?.opacity !== void 0 && (l.opacity = String(i.opacity)), H(c, l), s === 0 && c.setAttribute("stroke-dasharray", i?.strokeDasharray || "8,2");
    const h = document.createElementNS(F, "path");
    H(h, {
      d: a,
      stroke: "transparent",
      fill: "none",
      "stroke-width": "15"
    }), o.appendChild(h), o.appendChild(c), o[r.name] = c;
  }), o;
}, Rt = function(e, t, n) {
  if (!t) return;
  const i = n.label;
  t.style.opacity = "0";
  const o = t.cloneNode(!0);
  e.nodes.appendChild(o), o.id = "input-box", o.textContent = i, o.contentEditable = "plaintext-only", o.spellcheck = !1, o.style.cssText = `
    left:${t.style.left};
    top:${t.style.top}; 
    max-width: 200px;
  `, Dt(o), e.scrollIntoView(o), o.addEventListener("keydown", (r) => {
    if (r.stopPropagation(), r.isComposing) return;
    const s = r.key;
    if (s === "Enter" || s === "Tab") {
      if (r.shiftKey) return;
      r.preventDefault(), o.blur(), e.container.focus();
    }
  }), o.addEventListener("blur", () => {
    if (!o) return;
    const r = o.innerText?.trim() || "";
    r === "" ? n.label = i : n.label = r, t.style.opacity = "1", o.remove(), r !== i && (e.markdown ? t.innerHTML = e.markdown(n.label, n) : t.textContent = n.label, He(t), "parent" in n ? e.bus.fire("operation", {
      name: "finishEditSummary",
      obj: n
    }) : e.bus.fire("operation", {
      name: "finishEditArrowLabel",
      obj: n
    }));
  });
}, Vi = function(e) {
  const t = this.map.querySelector("me-root"), n = t.offsetTop, i = t.offsetLeft, o = t.offsetWidth, r = t.offsetHeight, s = this.map.querySelectorAll("me-main > me-wrapper");
  this.lines.innerHTML = "";
  for (let a = 0; a < s.length; a++) {
    const c = s[a], l = c.querySelector("me-tpc"), { offsetLeft: h, offsetTop: d } = R(this.nodes, l), u = l.offsetWidth, b = l.offsetHeight, y = c.parentNode.className, x = this.generateMainBranch({
      pT: n,
      pL: i,
      pW: o,
      pH: r,
      cT: d,
      cL: h,
      cW: u,
      cH: b,
      direction: y,
      containerHeight: this.nodes.offsetHeight,
      containerWidth: this.nodes.offsetWidth
    }), f = this.theme.palette, m = l.nodeObj.branchColor || f[a % f.length];
    if (l.style.borderColor = m, this.lines.appendChild(Wt(x, m, "3")), e && e !== c)
      continue;
    const w = ge("subLines"), T = c.lastChild;
    T.tagName === "svg" && T.remove(), c.appendChild(w), Ft(this, w, m, c, y, !0);
  }
  this.labelContainer.innerHTML = "", this.renderArrow(), this.renderSummary(), this.bus.fire("linkDiv");
}, Ft = function(e, t, n, i, o, r) {
  const s = i.firstChild, a = i.children[1].children;
  if (a.length === 0) return;
  const c = s.offsetTop, l = s.offsetLeft, h = s.offsetWidth, d = s.offsetHeight;
  for (let u = 0; u < a.length; u++) {
    const b = a[u], y = b.firstChild, x = y.offsetTop, f = y.offsetLeft, m = y.offsetWidth, w = y.offsetHeight, T = y.firstChild.nodeObj.branchColor || n, _ = e.generateSubBranch({ pT: c, pL: l, pW: h, pH: d, cT: x, cL: f, cW: m, cH: w, direction: o, isFirst: r });
    t.appendChild(Wt(_, T, "2"));
    const p = y.children[1];
    if (p) {
      if (!p.expanded) continue;
    } else
      continue;
    Ft(e, t, T, b, o);
  }
}, Yi = {
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
function qi(e, t) {
  const n = {
    focus: !0,
    link: !0,
    locale: Yi
  };
  t = t === !0 ? n : Object.assign(n, t);
  const i = (v) => {
    const E = document.createElement("div");
    return E.innerText = v, E.className = "tips", E;
  }, o = (v, E, k) => {
    const N = document.createElement("li");
    return N.id = v, N.innerHTML = `<span>${Xe(E)}</span><span ${k ? 'class="key"' : ""}>${Xe(k)}</span>`, N;
  }, r = t.locale, s = o("cm-add_child", r.addChild, "Tab"), a = o("cm-add_parent", r.addParent, "Ctrl + Enter"), c = o("cm-add_sibling", r.addSibling, "Enter"), l = o("cm-remove_child", r.removeNode, "Delete"), h = o("cm-fucus", r.focus, ""), d = o("cm-unfucus", r.cancelFocus, ""), u = o("cm-up", r.moveUp, "PgUp"), b = o("cm-down", r.moveDown, "Pgdn"), y = o("cm-link", r.link, ""), x = o("cm-link-bidirectional", r.linkBidirectional, ""), f = o("cm-summary", r.summary, ""), m = document.createElement("ul");
  if (m.className = "menu-list", m.appendChild(s), m.appendChild(a), m.appendChild(c), m.appendChild(l), t.focus && (m.appendChild(h), m.appendChild(d)), m.appendChild(u), m.appendChild(b), m.appendChild(f), t.link && (m.appendChild(y), m.appendChild(x)), t && t.extend)
    for (let v = 0; v < t.extend.length; v++) {
      const E = t.extend[v], k = o(E.name, E.name, E.key || "");
      m.appendChild(k), k.onclick = (N) => {
        E.onclick(N);
      };
    }
  const w = document.createElement("div");
  w.className = "context-menu", w.appendChild(m), w.hidden = !0, e.container.append(w);
  let T = !0;
  const _ = (v) => {
    const E = v.target;
    if (Le(E)) {
      E.parentElement.tagName === "ME-ROOT" ? T = !0 : T = !1, T ? (h.className = "disabled", u.className = "disabled", b.className = "disabled", a.className = "disabled", c.className = "disabled", l.className = "disabled") : (h.className = "", u.className = "", b.className = "", a.className = "", c.className = "", l.className = ""), w.hidden = !1, m.style.top = "", m.style.bottom = "", m.style.left = "", m.style.right = "";
      const k = m.offsetHeight, N = m.offsetWidth, L = m.getBoundingClientRect(), M = v.clientY - L.top, P = v.clientX - L.left;
      k + M > window.innerHeight ? (m.style.top = "", m.style.bottom = "0px") : (m.style.bottom = "", m.style.top = M + 15 + "px"), N + P > window.innerWidth ? (m.style.left = "", m.style.right = "0px") : (m.style.right = "", m.style.left = P + 10 + "px");
    }
  };
  e.bus.addListener("showContextMenu", _), w.onclick = (v) => {
    v.target === w && (w.hidden = !0);
  }, s.onclick = () => {
    e.addChild(), w.hidden = !0;
  }, a.onclick = () => {
    e.insertParent(), w.hidden = !0;
  }, c.onclick = () => {
    T || (e.insertSibling("after"), w.hidden = !0);
  }, l.onclick = () => {
    T || (e.removeNodes(e.currentNodes || []), w.hidden = !0);
  }, h.onclick = () => {
    T || (e.focusNode(e.currentNode), w.hidden = !0);
  }, d.onclick = () => {
    e.cancelFocus(), w.hidden = !0;
  }, u.onclick = () => {
    T || (e.moveUpNode(), w.hidden = !0);
  }, b.onclick = () => {
    T || (e.moveDownNode(), w.hidden = !0);
  };
  const p = (v) => {
    w.hidden = !0;
    const E = e.currentNode, k = i(r.clickTips);
    e.container.appendChild(k), e.map.addEventListener(
      "click",
      (N) => {
        N.preventDefault(), k.remove();
        const L = N.target;
        (L.parentElement.tagName === "ME-PARENT" || L.parentElement.tagName === "ME-ROOT") && e.createArrow(E, L, v);
      },
      {
        once: !0
      }
    );
  };
  return y.onclick = () => p(), x.onclick = () => p({ bidirectional: !0 }), f.onclick = () => {
    w.hidden = !0, e.createSummary(), e.unselectNodes(e.currentNodes);
  }, () => {
    s.onclick = null, a.onclick = null, c.onclick = null, l.onclick = null, h.onclick = null, d.onclick = null, u.onclick = null, b.onclick = null, y.onclick = null, f.onclick = null, w.onclick = null, e.container.oncontextmenu = null;
  };
}
const zi = function(e) {
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
function Ki(e) {
  let t = [], n = -1, i = e.getData(), o = [];
  e.undo = function() {
    if (n > -1) {
      const c = t[n];
      i = c.prev, e.refresh(c.prev);
      try {
        c.currentTarget.type === "nodes" && (c.operation === "removeNodes" ? e.selectNodes(c.currentTarget.value.map((l) => this.findEle(l))) : e.selectNodes(c.currentSelected.map((l) => this.findEle(l))));
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
        c.currentTarget.type === "nodes" && (c.operation === "removeNodes" ? e.selectNodes(c.currentSelected.map((l) => this.findEle(l))) : e.selectNodes(c.currentTarget.value.map((l) => this.findEle(l))));
      } catch {
      }
    }
  }, e.clearHistory = function() {
    t = [], n = -1, i = e.getData(), e.clearSelection();
  };
  const r = function(c) {
    if (c.name === "beginEdit") return;
    t = t.slice(0, n + 1);
    const l = e.getData(), h = {
      prev: i,
      operation: c.name,
      currentSelected: o.map((d) => d.id),
      currentTarget: zi(c),
      next: l
    };
    t.push(h), i = l, n = t.length - 1;
  }, s = function(c) {
    if (!e.editable || !c.metaKey && !c.ctrlKey) return;
    const l = c.key.toLowerCase();
    l === "z" ? c.shiftKey ? e.redo() : e.undo() : l === "y" && e.redo();
  }, a = function() {
    o = e.currentNodes.map((c) => c.nodeObj);
  };
  return e.bus.addListener("operation", r), e.bus.addListener("selectNodes", a), e.bus.addListener("unselectNodes", a), e.container.addEventListener("keydown", s), () => {
    e.bus.removeListener("operation", r), e.bus.removeListener("selectNodes", a), e.bus.removeListener("unselectNodes", a), e.container.removeEventListener("keydown", s);
  };
}
const Xi = '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg t="1750169394918" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2021" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200"><path d="M851.91168 328.45312c-59.97056 0-108.6208 48.47104-108.91264 108.36992l-137.92768 38.4a109.14304 109.14304 0 0 0-63.46752-46.58688l1.39264-137.11872c47.29344-11.86816 82.31936-54.66624 82.31936-105.64096 0-60.15488-48.76288-108.91776-108.91776-108.91776s-108.91776 48.76288-108.91776 108.91776c0 49.18784 32.60928 90.75712 77.38368 104.27392l-1.41312 138.87488a109.19936 109.19936 0 0 0-63.50336 48.55808l-138.93632-39.48544 0.01024-0.72704c0-60.15488-48.76288-108.91776-108.91776-108.91776s-108.91776 48.75776-108.91776 108.91776c0 60.15488 48.76288 108.91264 108.91776 108.91264 39.3984 0 73.91232-20.92032 93.03552-52.2496l139.19232 39.552-0.00512 0.2304c0 25.8304 9.00096 49.5616 24.02816 68.23424l-90.14272 132.63872a108.7488 108.7488 0 0 0-34.2528-5.504c-60.15488 0-108.91776 48.768-108.91776 108.91776 0 60.16 48.76288 108.91776 108.91776 108.91776 60.16 0 108.92288-48.75776 108.92288-108.91776 0-27.14624-9.9328-51.968-26.36288-71.04l89.04704-131.03104a108.544 108.544 0 0 0 37.6832 6.70208 108.672 108.672 0 0 0 36.48512-6.272l93.13792 132.57216a108.48256 108.48256 0 0 0-24.69888 69.0688c0 60.16 48.768 108.92288 108.91776 108.92288 60.16 0 108.91776-48.76288 108.91776-108.92288 0-60.14976-48.75776-108.91776-108.91776-108.91776a108.80512 108.80512 0 0 0-36.69504 6.3488l-93.07136-132.48a108.48768 108.48768 0 0 0 24.79616-72.22784l136.09984-37.888c18.99008 31.93856 53.84192 53.3504 93.69088 53.3504 60.16 0 108.92288-48.75776 108.92288-108.91264-0.00512-60.15488-48.77312-108.92288-108.92288-108.92288z" p-id="2022"></path></svg>', Ui = '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg t="1750169375313" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1775" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200"><path d="M639 463.30000001L639 285.1c0-36.90000001-26.4-68.5-61.3-68.5l-150.2 0c-1.5 0-3 0.1-4.5 0.3-10.2-38.7-45.5-67.3-87.5-67.3-50 0-90.5 40.5-90.5 90.5s40.5 90.5 90.5 90.5c42 0 77.3-28.6 87.5-67.39999999 1.4 0.3 2.9 0.4 4.5 0.39999999L577.7 263.6c6.8 0 14.3 8.9 14.3 21.49999999l0 427.00000001c0 12.7-7.40000001 21.5-14.30000001 21.5l-150.19999999 0c-1.5 0-3 0.2-4.5 0.4-10.2-38.8-45.5-67.3-87.5-67.3-50 0-90.5 40.5-90.5 90.4 0 49.9 40.5 90.6 90.5 90.59999999 42 0 77.3-28.6 87.5-67.39999999 1.4 0.2 2.9 0.4 4.49999999 0.4L577.7 780.7c34.80000001 0 61.3-31.6 61.3-68.50000001L639 510.3l79.1 0c10.4 38.5 45.49999999 67 87.4 67 50 0 90.5-40.5 90.5-90.5s-40.5-90.5-90.5-90.5c-41.79999999 0-77.00000001 28.4-87.4 67L639 463.30000001z" fill="currentColor" p-id="1776"></path></svg>', Gi = '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg t="1750169667709" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3037" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200"><path d="M385 560.69999999L385 738.9c0 36.90000001 26.4 68.5 61.3 68.5l150.2 0c1.5 0 3-0.1 4.5-0.3 10.2 38.7 45.5 67.3 87.5 67.3 50 0 90.5-40.5 90.5-90.5s-40.5-90.5-90.5-90.5c-42 0-77.3 28.6-87.5 67.39999999-1.4-0.3-2.9-0.4-4.5-0.39999999L446.3 760.4c-6.8 0-14.3-8.9-14.3-21.49999999l0-427.00000001c0-12.7 7.40000001-21.5 14.30000001-21.5l150.19999999 0c1.5 0 3-0.2 4.5-0.4 10.2 38.8 45.5 67.3 87.5 67.3 50 0 90.5-40.5 90.5-90.4 0-49.9-40.5-90.6-90.5-90.59999999-42 0-77.3 28.6-87.5 67.39999999-1.4-0.2-2.9-0.4-4.49999999-0.4L446.3 243.3c-34.80000001 0-61.3 31.6-61.3 68.50000001L385 513.7l-79.1 0c-10.4-38.5-45.49999999-67-87.4-67-50 0-90.5 40.5-90.5 90.5s40.5 90.5 90.5 90.5c41.79999999 0 77.00000001-28.4 87.4-67L385 560.69999999z" fill="currentColor" p-id="3038"></path></svg>', Ji = '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg t="1750169402629" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2170" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200"><path d="M639.328 416c8.032 0 16.096-3.008 22.304-9.056l202.624-197.184-0.8 143.808c-0.096 17.696 14.144 32.096 31.808 32.192 0.064 0 0.128 0 0.192 0 17.6 0 31.904-14.208 32-31.808l1.248-222.208c0-0.672-0.352-1.248-0.384-1.92 0.032-0.512 0.288-0.896 0.288-1.408 0.032-17.664-14.272-32-31.968-32.032L671.552 96l-0.032 0c-17.664 0-31.968 14.304-32 31.968C639.488 145.632 653.824 160 671.488 160l151.872 0.224-206.368 200.8c-12.672 12.32-12.928 32.608-0.64 45.248C622.656 412.736 630.976 416 639.328 416z" p-id="2171"></path><path d="M896.032 639.552 896.032 639.552c-17.696 0-32 14.304-32.032 31.968l-0.224 151.872-200.832-206.4c-12.32-12.64-32.576-12.96-45.248-0.64-12.672 12.352-12.928 32.608-0.64 45.248l197.184 202.624-143.808-0.8c-0.064 0-0.128 0-0.192 0-17.6 0-31.904 14.208-32 31.808-0.096 17.696 14.144 32.096 31.808 32.192l222.24 1.248c0.064 0 0.128 0 0.192 0 0.64 0 1.12-0.32 1.76-0.352 0.512 0.032 0.896 0.288 1.408 0.288l0.032 0c17.664 0 31.968-14.304 32-31.968L928 671.584C928.032 653.952 913.728 639.584 896.032 639.552z" p-id="2172"></path><path d="M209.76 159.744l143.808 0.8c0.064 0 0.128 0 0.192 0 17.6 0 31.904-14.208 32-31.808 0.096-17.696-14.144-32.096-31.808-32.192L131.68 95.328c-0.064 0-0.128 0-0.192 0-0.672 0-1.248 0.352-1.888 0.384-0.448 0-0.8-0.256-1.248-0.256 0 0-0.032 0-0.032 0-17.664 0-31.968 14.304-32 31.968L96 352.448c-0.032 17.664 14.272 32 31.968 32.032 0 0 0.032 0 0.032 0 17.664 0 31.968-14.304 32-31.968l0.224-151.936 200.832 206.4c6.272 6.464 14.624 9.696 22.944 9.696 8.032 0 16.096-3.008 22.304-9.056 12.672-12.32 12.96-32.608 0.64-45.248L209.76 159.744z" p-id="2173"></path><path d="M362.368 617.056l-202.624 197.184 0.8-143.808c0.096-17.696-14.144-32.096-31.808-32.192-0.064 0-0.128 0-0.192 0-17.6 0-31.904 14.208-32 31.808l-1.248 222.24c0 0.704 0.352 1.312 0.384 2.016 0 0.448-0.256 0.832-0.256 1.312-0.032 17.664 14.272 32 31.968 32.032L352.448 928c0 0 0.032 0 0.032 0 17.664 0 31.968-14.304 32-31.968s-14.272-32-31.968-32.032l-151.936-0.224 206.4-200.832c12.672-12.352 12.96-32.608 0.64-45.248S375.008 604.704 362.368 617.056z" p-id="2174"></path></svg>', Zi = '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg t="1750169573443" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2883" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200"><path d="M514.133333 488.533333m-106.666666 0a106.666667 106.666667 0 1 0 213.333333 0 106.666667 106.666667 0 1 0-213.333333 0Z" fill="currentColor" p-id="2884"></path><path d="M512 64C264.533333 64 64 264.533333 64 512c0 236.8 183.466667 428.8 416 445.866667v-134.4c-53.333333-59.733333-200.533333-230.4-200.533333-334.933334 0-130.133333 104.533333-234.666667 234.666666-234.666666s234.666667 104.533333 234.666667 234.666666c0 61.866667-49.066667 153.6-145.066667 270.933334l-59.733333 68.266666V960C776.533333 942.933333 960 748.8 960 512c0-247.466667-200.533333-448-448-448z" fill="currentColor" p-id="2885"></path></svg>', Qi = '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg t="1750169419447" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2480" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200"><path d="M863.328 482.56l-317.344-1.12L545.984 162.816c0-17.664-14.336-32-32-32s-32 14.336-32 32l0 318.4L159.616 480.064c-0.032 0-0.064 0-0.096 0-17.632 0-31.936 14.24-32 31.904C127.424 529.632 141.728 544 159.392 544.064l322.592 1.152 0 319.168c0 17.696 14.336 32 32 32s32-14.304 32-32l0-318.944 317.088 1.12c0.064 0 0.096 0 0.128 0 17.632 0 31.936-14.24 32-31.904C895.264 496.992 880.96 482.624 863.328 482.56z" p-id="2481"></path></svg>', eo = '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg t="1750169426515" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2730" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200"><path d="M863.744 544 163.424 544c-17.664 0-32-14.336-32-32s14.336-32 32-32l700.32 0c17.696 0 32 14.336 32 32S881.44 544 863.744 544z" p-id="2731"></path></svg>', to = {
  side: Xi,
  left: Ui,
  right: Gi,
  full: Ji,
  living: Zi,
  zoomin: Qi,
  zoomout: eo
}, Q = (e, t) => {
  const n = document.createElement("span");
  return n.id = e, n.innerHTML = to[t], n;
};
function no(e) {
  const t = document.createElement("div"), n = Q("fullscreen", "full"), i = Q("toCenter", "living"), o = Q("zoomout", "zoomout"), r = Q("zoomin", "zoomin");
  t.appendChild(n), t.appendChild(i), t.appendChild(o), t.appendChild(r), t.className = "mind-elixir-toolbar rb";
  let s = null;
  const a = () => {
    const l = e.container.getBoundingClientRect(), h = Qe(e.map.style.transform), d = l.width / 2, u = l.height / 2, b = (d - h.x) / e.scaleVal, y = (u - h.y) / e.scaleVal;
    s = {
      containerRect: l,
      currentTransform: h,
      mapCenterX: b,
      mapCenterY: y
    };
  }, c = () => {
    if (s) {
      const l = e.container.getBoundingClientRect(), h = l.width / 2, d = l.height / 2, u = h - s.mapCenterX * e.scaleVal, b = d - s.mapCenterY * e.scaleVal, y = u - s.currentTransform.x, x = b - s.currentTransform.y;
      e.move(y, x);
    }
  };
  return e.el.addEventListener("fullscreenchange", c), n.onclick = () => {
    a(), document.fullscreenElement !== e.el ? e.el.requestFullscreen() : document.exitFullscreen();
  }, i.onclick = () => {
    e.toCenter();
  }, o.onclick = () => {
    e.scale(e.scaleVal - e.scaleSensitivity);
  }, r.onclick = () => {
    e.scale(e.scaleVal + e.scaleSensitivity);
  }, t;
}
function io(e) {
  const t = document.createElement("div"), n = Q("tbltl", "left"), i = Q("tbltr", "right"), o = Q("tblts", "side");
  return t.appendChild(n), t.appendChild(i), t.appendChild(o), t.className = "mind-elixir-toolbar lt", n.onclick = () => {
    e.initLeft();
  }, i.onclick = () => {
    e.initRight();
  }, o.onclick = () => {
    e.initSide();
  }, t;
}
function oo(e) {
  e.container.append(no(e)), e.container.append(io(e));
}
class ro {
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
const bt = (e, t = "px") => typeof e == "number" ? e + t : e, U = ({ style: e }, t, n) => {
  if (typeof t == "object")
    for (const [i, o] of Object.entries(t))
      o !== void 0 && (e[i] = bt(o));
  else n !== void 0 && (e[t] = bt(n));
}, yt = (e = 0, t = 0, n = 0, i = 0) => {
  const o = { x: e, y: t, width: n, height: i, top: t, left: e, right: e + n, bottom: t + i };
  return { ...o, toJSON: () => JSON.stringify(o) };
}, so = (e) => {
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
}, vt = (e, t, n = "touch") => {
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
}, ao = () => matchMedia("(hover: none), (pointer: coarse)").matches, lo = () => "safari" in window, Ue = (e) => Array.isArray(e) ? e : [e], Vt = (e) => (t, n, i, o = {}) => {
  (t instanceof HTMLCollection || t instanceof NodeList) && (t = Array.from(t)), n = Ue(n), t = Ue(t);
  for (const r of t)
    if (r)
      for (const s of n)
        r[e](s, i, { capture: !1, ...o });
}, re = Vt("addEventListener"), z = Vt("removeEventListener"), Te = (e) => {
  const { clientX: t, clientY: n, target: i } = e.touches?.[0] ?? e;
  return { x: t, y: n, target: i };
}, se = (e, t = document) => Ue(e).map((n) => typeof n == "string" ? Array.from(t.querySelectorAll(n)) : n instanceof Element ? n : null).flat().filter(Boolean), co = (e, t) => t.some((n) => typeof n == "number" ? e.button === n : typeof n == "object" ? n.button !== e.button ? !1 : n.modifiers.every((i) => {
  switch (i) {
    case "alt":
      return e.altKey;
    case "ctrl":
      return e.ctrlKey || e.metaKey;
    case "shift":
      return e.shiftKey;
  }
}) : !1), { abs: Z, max: wt, min: xt, ceil: Et } = Math, St = (e = []) => ({
  stored: e,
  selected: [],
  touched: [],
  changed: { added: [], removed: [] }
});
class ho extends ro {
  static version = "mind-elixir-fork";
  // Options
  _options;
  // Selection store
  _selection = St();
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
  _areaRect = yt();
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
    this._area = n.createElement("div"), this._clippingElement = n.createElement("div"), this._clippingElement.appendChild(this._area), this._area.classList.add(i), o && this._clippingElement.classList.add(o), U(this._area, {
      willChange: "top, left, bottom, right, width, height",
      top: 0,
      left: 0,
      position: "fixed"
    }), U(this._clippingElement, {
      overflow: "hidden",
      position: "fixed",
      transform: "translate3d(0, 0, 0)",
      // https://stackoverflow.com/a/38268846
      pointerEvents: "none",
      zIndex: "1"
    }), this._frame = so((r) => {
      this._recalculateSelectionAreaRect(), this._updateElementSelection(), this._emitEvent("move", r), this._redrawSelectionArea();
    }), this.enable();
  }
  _toggleStartEvents(t = !0) {
    const { document: n } = this._options;
    (t ? re : z)(n, "pointerdown", this._onTapStart);
  }
  _onTapStart(t, n = !1) {
    const { x: i, y: o, target: r } = Te(t), { document: s, startAreas: a, boundaries: c, behaviour: l, features: h } = this._options, d = r.getBoundingClientRect();
    if (!co(t, l.triggers))
      return;
    const u = se(a, s), b = se(c, s);
    this._targetElement = b.find((m) => vt(m.getBoundingClientRect(), d));
    const y = t.composedPath(), x = u.find((m) => y.includes(m));
    if (this._targetBoundary = b.find((m) => y.includes(m)), !this._targetElement || !x || !this._targetBoundary || !n && this._emitEvent("beforestart", t) === !1)
      return;
    this._areaLocation = { x1: i, y1: o, x2: 0, y2: 0 };
    const f = s.scrollingElement ?? s.body;
    this._scrollDelta = { x: f.scrollLeft, y: f.scrollTop }, this._singleClick = !0, this.clearSelection(!1, !0), re(s, ["pointermove"], this._delayedTapMove, { passive: !1 }), re(s, ["pointerup", "pointercancel"], this._onTapStop), re(s, "scroll", this._onScroll), h.deselectOnBlur && (this._targetBoundaryScrolled = !1, re(this._targetBoundary, "scroll", this._onStartAreaScroll));
  }
  _onSingleTap(t) {
    const {
      singleTap: { intersect: n },
      range: i
    } = this._options.features, o = Te(t);
    let r;
    if (n === "native")
      r = o.target;
    else if (n === "touch") {
      this.resolveSelectables();
      const { x: a, y: c } = o;
      r = this._selectables.find((l) => {
        const { right: h, left: d, top: u, bottom: b } = l.getBoundingClientRect();
        return a < h && a > d && c < b && c > u;
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
      const a = this._latestElement, [c, l] = a.compareDocumentPosition(r) & 4 ? [r, a] : [a, r], h = [
        ...this._selectables.filter((d) => d.compareDocumentPosition(c) & 4 && d.compareDocumentPosition(l) & 2),
        c,
        l
      ];
      this.select(h), this._latestElement = a;
    } else s.includes(r) && (s.length === 1 || t.ctrlKey || s.every((a) => this._selection.stored.includes(a))) ? this.deselect(r) : (this.select(r), this._latestElement = r);
  }
  _delayedTapMove(t) {
    const {
      container: n,
      document: i,
      behaviour: { startThreshold: o }
    } = this._options, { x1: r, y1: s } = this._areaLocation, { x: a, y: c } = Te(t);
    if (
      // Single number for both coordinates
      typeof o == "number" && Z(a + c - (r + s)) >= o || // Different x and y threshold
      typeof o == "object" && Z(a - r) >= o.x || Z(c - s) >= o.y
    ) {
      if (z(i, ["pointermove"], this._delayedTapMove, { passive: !1 }), this._emitEvent("beforedrag", t) === !1) {
        z(i, ["pointerup", "pointercancel"], this._onTapStop);
        return;
      }
      re(i, ["pointermove"], this._onTapMove, { passive: !1 }), U(this._area, "display", "block"), se(n, i)[0].appendChild(this._clippingElement), this.resolveSelectables(), this._singleClick = !1, this._targetRect = this._targetElement.getBoundingClientRect(), this._scrollAvailable = this._targetElement.scrollHeight !== this._targetElement.clientHeight || this._targetElement.scrollWidth !== this._targetElement.clientWidth, this._scrollAvailable && (this._selectables = this._selectables.filter((l) => this._targetElement.contains(l))), this._setupSelectionArea(), this._emitEvent("start", t), this._onTapMove(t);
    }
    this._handleMoveEvent(t);
  }
  _setupSelectionArea() {
    const { _clippingElement: t, _targetElement: n, _area: i } = this, o = this._targetRect = n.getBoundingClientRect();
    this._scrollAvailable ? (U(t, {
      top: o.top,
      left: o.left,
      width: o.width,
      height: o.height
    }), U(i, {
      marginTop: -o.top,
      marginLeft: -o.left
    })) : (U(t, {
      top: 0,
      left: 0,
      width: "100%",
      height: "100%"
    }), U(i, {
      marginTop: 0,
      marginLeft: 0
    }));
  }
  _onTapMove(t) {
    const { _scrollSpeed: n, _areaLocation: i, _options: o, _frame: r } = this, { speedDivider: s } = o.behaviour.scrolling, { x: a, y: c } = Te(t);
    if (i.x2 = a, i.y2 = c, this._scrollAvailable && !this._scrollingActive && (n.y || n.x)) {
      this._scrollingActive = !0;
      const l = () => {
        if (!n.x && !n.y) {
          this._scrollingActive = !1;
          return;
        }
        const h = this._options.mindElixirInstance;
        if (h && h.move) {
          const d = n.x ? Et(n.x / s) : 0, u = n.y ? Et(n.y / s) : 0;
          (d || u) && (h.move(-d, -u), i.x1 -= d, i.y1 -= u);
        }
        r.next(t), requestAnimationFrame(l);
      };
      requestAnimationFrame(l);
    } else
      r.next(t);
    this._handleMoveEvent(t);
  }
  _handleMoveEvent(t) {
    const { features: n } = this._options;
    (n.touch && ao() || this._scrollAvailable && lo()) && t.preventDefault();
  }
  _onScroll() {
    const {
      _scrollDelta: t,
      _options: { document: n }
    } = this, { scrollTop: i, scrollLeft: o } = n.scrollingElement ?? n.body;
    this._areaLocation.x1 += t.x - o, this._areaLocation.y1 += t.y - i, t.x = o, t.y = i, this._setupSelectionArea(), this._frame.next(null);
  }
  _onStartAreaScroll() {
    this._targetBoundaryScrolled = !0, z(this._targetElement, "scroll", this._onStartAreaScroll);
  }
  _recalculateSelectionAreaRect() {
    const { _scrollSpeed: t, _areaLocation: n, _targetElement: i, _options: o } = this, r = this._targetRect, { x1: s, y1: a } = n;
    let { x2: c, y2: l } = n;
    const {
      behaviour: {
        scrolling: { startScrollMargins: h }
      }
    } = o;
    c < r.left + h.x ? (t.x = -Z(r.left - c + h.x), c = c < r.left ? r.left : c) : c > r.right - h.x ? (t.x = Z(r.left + r.width - c - h.x), c = c > r.right ? r.right : c) : t.x = 0, l < r.top + h.y ? (t.y = -Z(r.top - l + h.y), l = l < r.top ? r.top : l) : l > r.bottom - h.y ? (t.y = Z(r.top + r.height - l - h.y), l = l > r.bottom ? r.bottom : l) : t.y = 0;
    const d = xt(s, c), u = xt(a, l), b = wt(s, c), y = wt(a, l);
    this._areaRect = yt(d, u, b - d, y - u);
  }
  _redrawSelectionArea() {
    const { x: t, y: n, width: i, height: o } = this._areaRect, { style: r } = this._area;
    r.left = `${t}px`, r.top = `${n}px`, r.width = `${i}px`, r.height = `${o}px`;
  }
  _onTapStop(t, n) {
    const { document: i, features: o } = this._options, { _singleClick: r } = this;
    z(this._targetElement, "scroll", this._onStartAreaScroll), z(i, ["pointermove"], this._delayedTapMove), z(i, ["pointermove"], this._onTapMove), z(i, ["pointerup", "pointercancel"], this._onTapStop), z(i, "scroll", this._onScroll), this._keepSelection(), t && r && o.singleTap.allow ? this._onSingleTap(t) : !r && !n && (this._updateElementSelection(), this._emitEvent("stop", t)), this._scrollSpeed.x = 0, this._scrollSpeed.y = 0, this._clippingElement.remove(), this._frame?.cancel(), U(this._area, "display", "none");
  }
  _updateElementSelection() {
    const { _selectables: t, _options: n, _selection: i, _areaRect: o } = this, { stored: r, selected: s, touched: a } = i, { intersect: c, overlap: l } = n.behaviour, h = l === "invert", d = [], u = [], b = [];
    for (let x = 0; x < t.length; x++) {
      const f = t[x];
      if (vt(o, f.getBoundingClientRect(), c)) {
        if (s.includes(f))
          r.includes(f) && !a.includes(f) && a.push(f);
        else if (h && r.includes(f)) {
          b.push(f);
          continue;
        } else
          u.push(f);
        d.push(f);
      }
    }
    h && u.push(...r.filter((x) => !s.includes(x)));
    const y = l === "keep";
    for (let x = 0; x < s.length; x++) {
      const f = s[x];
      !d.includes(f) && !// Check if the user wants to keep previously selected elements, e.g.,
      // not make them part of the current selection as soon as they're touched.
      (y && r.includes(f)) && b.push(f);
    }
    i.selected = d, i.changed = { added: u, removed: b }, this._latestElement = void 0;
  }
  _emitEvent(t, n) {
    return this.emit(t, {
      event: n,
      store: this._selection,
      selection: this
    });
  }
  _keepSelection() {
    const { _options: t, _selection: n } = this, { selected: i, changed: o, touched: r, stored: s } = n, a = i.filter((c) => !s.includes(c));
    switch (t.behaviour.overlap) {
      case "drop": {
        n.stored = [
          ...a,
          ...s.filter((c) => !r.includes(c))
          // Elements not touched
        ];
        break;
      }
      case "invert": {
        n.stored = [
          ...a,
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
    this._selectables = se(this._options.selectables, this._options.document);
  }
  /**
   * Same as deselecting, but for all elements currently selected
   * @param includeStored If the store should also get cleared
   * @param quiet If move / stop events should be fired
   */
  clearSelection(t = !0, n = !1) {
    const { selected: i, stored: o, changed: r } = this._selection;
    r.added = [], r.removed.push(...i, ...t ? o : []), n || (this._emitEvent("move", null), this._emitEvent("stop", null)), this._selection = St(t ? [] : o);
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
    const { changed: i, selected: o, stored: r } = this._selection, s = se(t, this._options.document).filter((a) => !o.includes(a) && !r.includes(a));
    return r.push(...s), o.push(...s), i.added.push(...s), i.removed = [], this._latestElement = void 0, n || (this._emitEvent("move", null), this._emitEvent("stop", null)), s;
  }
  /**
   * Removes a particular element from the selection
   * @param query CSS Query, can be an array of queries
   * @param quiet If this should not trigger the move event
   */
  deselect(t, n = !1) {
    const { selected: i, stored: o, changed: r } = this._selection, s = se(t, this._options.document).filter((a) => i.includes(a) || o.includes(a));
    this._selection.stored = o.filter((a) => !s.includes(a)), this._selection.selected = i.filter((a) => !s.includes(a)), this._selection.changed.added = [], this._selection.changed.removed.push(...s.filter((a) => !r.removed.includes(a))), this._latestElement = void 0, n || (this._emitEvent("move", null), this._emitEvent("stop", null));
  }
}
function uo(e) {
  const t = e.mouseSelectionButton === 2 ? [2] : [0], n = new ho({
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
const Yt = function(e, t, n, i, o = 8) {
  if (e === n) return `M ${e} ${t} V ${i}`;
  const r = (t + i) / 2, s = n > e ? 1 : -1, a = Math.min(o, Math.abs(n - e) / 2, Math.abs(r - t), Math.abs(i - r));
  return `M ${e} ${t} V ${r - a} Q ${e} ${r} ${e + s * a} ${r} H ${n - s * a} Q ${n} ${r} ${n} ${r + a} V ${i}`;
};
function qt({ pT: e, pL: t, pW: n, pH: i, cT: o, cL: r, cW: s, cH: a, direction: c, containerHeight: l, containerWidth: h }) {
  if (c === I.DOWN) {
    const f = t + n / 2, m = r + s / 2, w = e + i;
    return Yt(f, w, m, o);
  }
  let d = t + n / 2;
  const u = e + i / 2;
  let b;
  c === I.LHS ? b = r + s : b = r;
  const y = o + a / 2, x = (1 - Math.abs(y - u) / l) * 0.25 * (n / 2);
  return c === I.LHS ? d = d - n / 10 - x : d = d + n / 10 + x, `M ${d} ${u} Q ${d} ${y} ${b} ${y}`;
}
function zt({ pT: e, pL: t, pW: n, pH: i, cT: o, cL: r, cW: s, cH: a, direction: c, isFirst: l }) {
  if (c === I.DOWN) {
    const w = t + n / 2, T = e + i, _ = r + s / 2;
    return Yt(w, T, _, o);
  }
  const h = parseInt(this.container.style.getPropertyValue("--node-gap-x"));
  let d = 0, u = 0;
  l ? d = e + i / 2 : d = e + i;
  const b = o + a;
  let y = 0, x = 0, f = 0;
  const m = Math.abs(d - b) / 300 * h;
  return c === I.LHS ? (f = t, y = f + h, x = f - h, u = r + h, `M ${y} ${d} C ${f} ${d} ${f + m} ${b} ${x} ${b} H ${u}`) : (f = t + n, y = f - h, x = f + h, u = r + s - h, `M ${y} ${d} C ${f} ${d} ${f - m} ${b} ${x} ${b} H ${u}`);
}
const po = function(e, t = !0) {
  this.theme = e, this.generateMainBranch = this.theme.generateMainBranch || qt, this.generateSubBranch = this.theme.generateSubBranch || zt;
  const n = {
    ...(this.theme.type === "dark" ? Ke : ze).cssVar,
    ...this.theme.cssVar
  };
  this.compact && (n["--node-gap-x"] = "15px", n["--node-gap-y"] = "2px", n["--main-gap-x"] = "30px", n["--main-gap-y"] = "6px");
  const i = Object.keys(n);
  for (let o = 0; o < i.length; o++) {
    const r = i[o];
    this.container.style.setProperty(r, n[r]);
  }
  t && this.refresh();
}, fo = function(e) {
  this.compact = e, this.theme && this.changeTheme(this.theme);
}, mo = function(e) {
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
      this.cb = n, this.onEnd = i || null, this.handleClear = this.handleClear.bind(this), this.handlePointerMove = this.handlePointerMove.bind(this), this.handlePointerDown = this.handlePointerDown.bind(this), this.destroy = Nt([
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
}, Ct = {
  create: mo
}, Kt = "#4dc4ff";
function Xt(e, t, n, i, o, r, s, a) {
  return {
    x: e / 8 + n * 3 / 8 + o * 3 / 8 + s / 8,
    y: t / 8 + i * 3 / 8 + r * 3 / 8 + a / 8
  };
}
function go(e, t, n) {
  e && (e.dataset.x = t.toString(), e.dataset.y = n.toString(), He(e));
}
function le(e, t, n, i, o) {
  H(e, {
    x1: t + "",
    y1: n + "",
    x2: i + "",
    y2: o + ""
  });
}
function Ge(e, t, n, i, o, r, s, a, c, l) {
  const h = `M ${t} ${n} C ${i} ${o} ${r} ${s} ${a} ${c}`;
  e.line.setAttribute("d", h);
  const d = l.style || {};
  e.line.setAttribute("stroke", d.stroke || "rgb(227, 125, 116)"), e.line.setAttribute("stroke-width", String(d.strokeWidth || "2")), e.line.setAttribute("stroke-dasharray", d.strokeDasharray || "8,2"), d.opacity !== void 0 && d.opacity !== null && d.opacity !== "" ? e.line.setAttribute("opacity", String(d.opacity)) : e.line.removeAttribute("opacity");
  const u = e.querySelectorAll('path[stroke="transparent"]');
  u.length > 0 && u[0].setAttribute("d", h);
  const b = $e(r, s, a, c);
  if (b) {
    const m = `M ${b.x1} ${b.y1} L ${a} ${c} L ${b.x2} ${b.y2}`;
    e.arrow1.setAttribute("d", m), u.length > 1 && u[1].setAttribute("d", m), e.arrow1.setAttribute("stroke", d.stroke || "rgb(227, 125, 116)"), e.arrow1.setAttribute("stroke-width", String(d.strokeWidth || "2")), d.opacity !== void 0 && d.opacity !== null && d.opacity !== "" ? e.arrow1.setAttribute("opacity", String(d.opacity)) : e.arrow1.removeAttribute("opacity");
  }
  if (l.bidirectional) {
    const m = $e(i, o, t, n);
    if (m) {
      const w = `M ${m.x1} ${m.y1} L ${t} ${n} L ${m.x2} ${m.y2}`;
      e.arrow2.setAttribute("d", w), u.length > 2 && u[2].setAttribute("d", w);
    }
  } else
    e.arrow2.setAttribute("d", ""), u.length > 2 && u[2].setAttribute("d", "");
  e.arrow2.setAttribute("stroke", d.stroke || "rgb(227, 125, 116)"), e.arrow2.setAttribute("stroke-width", String(d.strokeWidth || "2")), d.opacity !== void 0 && d.opacity !== null && d.opacity !== "" ? e.arrow2.setAttribute("opacity", String(d.opacity)) : e.arrow2.removeAttribute("opacity");
  const { x: y, y: x } = Xt(t, n, i, o, r, s, a, c);
  e.labelEl && go(e.labelEl, y, x);
  const f = e.labelEl;
  f && (f.style.color = d.labelColor || "rgb(235, 95, 82)"), So(e);
}
function he(e, t, n) {
  const { offsetLeft: i, offsetTop: o } = R(e.nodes, t), r = t.offsetWidth, s = t.offsetHeight, a = i + r / 2, c = o + s / 2, l = a + n.x, h = c + n.y;
  return {
    w: r,
    h: s,
    cx: a,
    cy: c,
    ctrlX: l,
    ctrlY: h
  };
}
function G(e) {
  const t = e.w / 2, n = e.h / 2, i = e.ctrlX - e.cx, o = e.ctrlY - e.cy, r = Math.hypot(i, o);
  if (r === 0 || t === 0 && n === 0)
    return { x: e.cx, y: e.cy };
  const s = i / r, a = o / r, c = Math.min(t / Math.abs(s), n / Math.abs(a));
  return { x: e.cx + s * c, y: e.cy + a * c };
}
const Ut = function(e, t, n) {
  const i = R(e.nodes, t), o = R(e.nodes, n), r = i.offsetLeft + t.offsetWidth / 2, s = i.offsetTop + t.offsetHeight / 2, a = o.offsetLeft + n.offsetWidth / 2, c = o.offsetTop + n.offsetHeight / 2, l = a - r, h = c - s, d = Math.sqrt(l * l + h * h), u = Math.max(50, Math.min(200, d * 0.3)), b = Math.abs(l), y = Math.abs(h);
  let x, f;
  if (d < 150) {
    const m = t.closest("me-main"), w = m ? m.className === "lhs" ? -1 : 1 : l > 0 ? -1 : 1;
    x = { x: 200 * w, y: 0 }, f = { x: 200 * w, y: 0 };
  } else if (b > y * 1.5) {
    const m = l > 0 ? t.offsetWidth / 2 : -t.offsetWidth / 2, w = l > 0 ? -n.offsetWidth / 2 : n.offsetWidth / 2;
    x = { x: m + (l > 0 ? u : -u), y: 0 }, f = { x: w + (l > 0 ? -u : u), y: 0 };
  } else if (y > b * 1.5) {
    const m = h > 0 ? t.offsetHeight / 2 : -t.offsetHeight / 2, w = h > 0 ? -n.offsetHeight / 2 : n.offsetHeight / 2;
    x = { x: 0, y: m + (h > 0 ? u : -u) }, f = { x: 0, y: w + (h > 0 ? -u : u) };
  } else {
    const m = Math.atan2(h, l), w = t.offsetWidth / 2 * Math.cos(m), T = t.offsetHeight / 2 * Math.sin(m), _ = -(n.offsetWidth / 2) * Math.cos(m), p = -(n.offsetHeight / 2) * Math.sin(m), v = u * 0.7 * (l > 0 ? 1 : -1), E = u * 0.7 * (h > 0 ? 1 : -1);
    x = { x: w + v, y: T + E }, f = { x: _ - v, y: p - E };
  }
  return {
    delta1: { x: Math.round(x.x), y: Math.round(x.y) },
    delta2: { x: Math.round(f.x), y: Math.round(f.y) }
  };
}, rt = function(e, t, n, i, o) {
  if (!t || !n)
    return;
  if (!i.delta1 || !i.delta2) {
    const N = Ut(e, t, n);
    i.delta1 = N.delta1, i.delta2 = N.delta2;
  }
  const r = he(e, t, i.delta1), s = he(e, n, i.delta2), { x: a, y: c } = G(r), { ctrlX: l, ctrlY: h } = r, { ctrlX: d, ctrlY: u } = s, { x: b, y } = G(s), x = $e(d, u, b, y);
  if (!x) return;
  const f = `M ${x.x1} ${x.y1} L ${b} ${y} L ${x.x2} ${x.y2}`;
  let m = "";
  if (i.bidirectional) {
    const N = $e(l, h, a, c);
    if (!N) return;
    m = `M ${N.x1} ${N.y1} L ${a} ${c} L ${N.x2} ${N.y2}`;
  }
  const w = Fi(`M ${a} ${c} C ${l} ${h} ${d} ${u} ${b} ${y}`, f, m, i.style), { x: T, y: _ } = Xt(a, c, l, h, d, u, b, y), p = i.style?.labelColor || "rgb(235, 95, 82)", v = "a-" + i.id;
  w.id = v;
  const E = e.markdown ? e.markdown(i.label, i) : i.label, k = Ae(E, T, _, {
    anchor: "middle",
    color: p,
    dataType: "arrow",
    svgId: v
  });
  w.labelEl = k, w.arrowObj = i, w.dataset.linkid = i.id, e.labelContainer.appendChild(k), e.arrowSvg.appendChild(w), He(k), o || (e.arrows.push(i), e.currentArrow = w, Jt(e, i, r, s));
}, bo = function(e, t, n = {}) {
  const i = {
    id: te(),
    label: "Custom Link",
    from: e.nodeObj.id,
    to: t.nodeObj.id,
    ...n
  };
  rt(this, e, t, i), this.bus.fire("operation", {
    name: "createArrow",
    obj: i
  });
}, yo = function(e) {
  Be(this);
  const t = { ...e, id: te() };
  rt(this, this.findEle(t.from), this.findEle(t.to), t), this.bus.fire("operation", {
    name: "createArrow",
    obj: t
  });
}, vo = function(e) {
  let t;
  if (e ? t = e : t = this.currentArrow, !t) return;
  Be(this);
  const n = t.arrowObj.id;
  this.arrows = this.arrows.filter((i) => i.id !== n), t.labelEl?.remove(), t.remove(), this.bus.fire("operation", {
    name: "removeArrow",
    obj: {
      id: n
    }
  });
}, wo = function(e) {
  this.currentArrow = e;
  const t = e.arrowObj, n = this.findEle(t.from), i = this.findEle(t.to), o = he(this, n, t.delta1), r = he(this, i, t.delta2);
  this.editable ? Jt(this, t, o, r) : Gt(e, Kt), this.bus.fire("selectArrow", t);
}, xo = function() {
  Be(this), this.currentArrow = null, this.bus.fire("unselectArrow");
}, Fe = function(e, t) {
  const n = document.createElementNS(F, "path");
  return H(n, {
    d: e,
    stroke: t,
    fill: "none",
    "stroke-width": "6",
    "stroke-linecap": "round",
    "stroke-linejoin": "round"
  }), n;
}, Gt = function(e, t) {
  const n = document.createElementNS(F, "g");
  n.setAttribute("class", "arrow-highlight"), n.setAttribute("opacity", "0.45");
  const i = Fe(e.line.getAttribute("d"), t);
  n.appendChild(i);
  const o = Fe(e.arrow1.getAttribute("d"), t);
  if (n.appendChild(o), e.arrow2.getAttribute("d")) {
    const r = Fe(e.arrow2.getAttribute("d"), t);
    n.appendChild(r);
  }
  e.insertBefore(n, e.firstChild);
}, Eo = function(e) {
  const t = e.querySelector(".arrow-highlight");
  t && t.remove();
}, So = function(e) {
  const t = e.querySelector(".arrow-highlight");
  if (!t) return;
  const n = t.querySelectorAll("path");
  n.length >= 1 && n[0].setAttribute("d", e.line.getAttribute("d")), n.length >= 2 && n[1].setAttribute("d", e.arrow1.getAttribute("d")), n.length >= 3 && e.arrow2.getAttribute("d") && n[2].setAttribute("d", e.arrow2.getAttribute("d"));
}, Be = function(e) {
  e.helper1?.destroy(), e.helper2?.destroy(), e.linkController.style.display = "none", e.P2.style.display = "none", e.P3.style.display = "none", e.currentArrow && Eo(e.currentArrow);
}, Jt = function(e, t, n, i) {
  const { linkController: o, P2: r, P3: s, line1: a, line2: c, nodes: l, map: h, currentArrow: d, bus: u } = e;
  if (!d) return;
  o.style.display = "initial", r.style.display = "initial", s.style.display = "initial", l.appendChild(o), l.appendChild(r), l.appendChild(s), Gt(d, Kt);
  let { x: b, y } = G(n), { ctrlX: x, ctrlY: f } = n, { ctrlX: m, ctrlY: w } = i, { x: T, y: _ } = G(i);
  r.style.cssText = `top:${f}px;left:${x}px;`, s.style.cssText = `top:${w}px;left:${m}px;`, le(a, b, y, x, f), le(c, m, w, T, _), e.helper1 = Ct.create(r), e.helper2 = Ct.create(s);
  let p = de(t);
  const v = () => {
    u.fire("operation", {
      name: "reshapeArrow",
      obj: t,
      origin: p
    }), p = de(t);
  };
  e.helper1.init(
    h,
    (E, k) => {
      x = x + E / e.scaleVal, f = f + k / e.scaleVal;
      const N = G({ ...n, ctrlX: x, ctrlY: f });
      b = N.x, y = N.y, r.style.top = f + "px", r.style.left = x + "px", Ge(d, b, y, x, f, m, w, T, _, t), le(a, b, y, x, f), t.delta1.x = Math.round(x - n.cx), t.delta1.y = Math.round(f - n.cy), u.fire("updateArrowDelta", t);
    },
    v
  ), e.helper2.init(
    h,
    (E, k) => {
      m = m + E / e.scaleVal, w = w + k / e.scaleVal;
      const N = G({ ...i, ctrlX: m, ctrlY: w });
      T = N.x, _ = N.y, s.style.top = w + "px", s.style.left = m + "px", Ge(d, b, y, x, f, m, w, T, _, t), le(c, m, w, T, _), t.delta2.x = Math.round(m - i.cx), t.delta2.y = Math.round(w - i.cy), u.fire("updateArrowDelta", t);
    },
    v
  );
};
function Co() {
  this.arrowSvg.innerHTML = "", this.labelContainer.querySelectorAll('.svg-label[data-type="arrow"]').forEach((e) => e.remove());
  for (let e = 0; e < this.arrows.length; e++) {
    const t = this.arrows[e];
    try {
      rt(this, this.findEle(t.from), this.findEle(t.to), t, !0);
    } catch {
    }
  }
  this.nodes.appendChild(this.arrowSvg);
}
function ko(e) {
  Be(this), e && e.labelEl && Rt(this, e.labelEl, e.arrowObj);
}
function No() {
  this.arrows = this.arrows.filter((e) => Pe(e.from, this.nodeData) && Pe(e.to, this.nodeData));
}
const To = function(e, t) {
  const n = de(e);
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
        const f = Ut(this, o, r);
        e.delta1 = e.delta1 || f.delta1, e.delta2 = e.delta2 || f.delta2;
      }
      const s = he(this, o, e.delta1), a = he(this, r, e.delta2), { x: c, y: l } = G(s), { ctrlX: h, ctrlY: d } = s, { ctrlX: u, ctrlY: b } = a, { x: y, y: x } = G(a);
      Ge(i, c, l, h, d, u, b, y, x, e), this.currentArrow?.arrowObj?.id === e.id && (this.P2.style.cssText = `top:${d}px;left:${h}px;`, this.P3.style.cssText = `top:${b}px;left:${u}px;`, le(this.line1, c, l, h, d), le(this.line2, u, b, y, x));
    }
  }
  this.bus.fire("operation", {
    name: "reshapeArrow",
    obj: e,
    origin: n
  });
}, Mo = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  createArrow: bo,
  createArrowFrom: yo,
  editArrowLabel: ko,
  removeArrow: vo,
  renderArrow: Co,
  reshapeArrow: To,
  selectArrow: wo,
  tidyArrow: No,
  unselectArrow: xo
}, Symbol.toStringTag, { value: "Module" })), _o = function(e) {
  if (e.length === 0) throw new Error("No selected node.");
  if (e.length === 1) {
    const c = e[0].nodeObj, l = e[0].nodeObj.parent;
    if (!l) throw new Error("Can not select root node.");
    const h = l.children.findIndex((d) => c === d);
    return {
      parent: l.id,
      start: h,
      end: h
    };
  }
  let t = 0;
  const n = e.map((c) => {
    let l = c.nodeObj;
    const h = [];
    for (; l.parent; ) {
      const d = l.parent, u = d.children?.indexOf(l);
      l = d, h.unshift({ node: l, index: u });
    }
    return h.length > t && (t = h.length), h;
  });
  let i = 0;
  e: for (; i < t; i++) {
    const c = n[0][i]?.node;
    for (let l = 1; l < n.length; l++)
      if (n[l][i]?.node !== c)
        break e;
  }
  if (!i) throw new Error("Can not select root node.");
  const o = n.map((c) => c[i - 1].index).sort((c, l) => c - l), r = o[0] || 0, s = o[o.length - 1] || 0, a = n[0][i - 1].node;
  if (!a.parent) throw new Error("Please select nodes in the same main topic.");
  return {
    parent: a.id,
    start: r,
    end: s
  };
}, Do = function(e) {
  const t = document.createElementNS(F, "g");
  return t.setAttribute("id", e), t;
}, Ve = function(e, t) {
  const n = document.createElementNS(F, "path");
  return H(n, {
    d: e,
    stroke: t || "#666",
    fill: "none",
    "stroke-linecap": "round",
    "stroke-width": "2"
  }), n;
}, Lo = (e) => e.parentElement.parentElement, Zt = function(e, t) {
  const n = e.summaries.findIndex((i) => i.id === t);
  return n === -1 ? !1 : (e.summaries.splice(n, 1), e.nodes.querySelector("#s-" + t)?.remove(), e.nodes.querySelector("#label-s-" + t)?.remove(), !0);
}, Ao = function(e, { parent: t, start: n }) {
  const i = e.findEle(t), o = i.nodeObj;
  let r;
  return o.parent ? r = i.closest("me-main").className : r = e.findEle(o.children[n].id).closest("me-main").className, r;
}, st = function(e, t) {
  const { id: n, label: i, parent: o, start: r, end: s, style: a } = t, { nodes: c, theme: l, summarySvg: h } = e, d = e.findEle(o).nodeObj, u = Ao(e, t);
  let b = 1 / 0, y = 0, x = 0, f = 0, m = 0, w = 1 / 0, T = 0;
  for (let M = r; M <= s; M++) {
    const P = d.children?.[M];
    if (!P)
      return null;
    const $ = Lo(e.findEle(P.id)), { offsetLeft: B, offsetTop: K } = R(c, $), ne = r === s ? 10 : 20;
    M === r && (x = K + ne), M === s && (f = K + $.offsetHeight - ne), M === r && (w = B + ne), M === s && (T = B + $.offsetWidth - ne), K + $.offsetHeight > m && (m = K + $.offsetHeight), B < b && (b = B), $.offsetWidth + B > y && (y = $.offsetWidth + B);
  }
  let _, p;
  const v = a?.stroke || l.cssVar["--color"], E = a?.labelColor || l.cssVar["--color"], k = "s-" + n, N = e.markdown ? e.markdown(i, t) : i;
  if (u === I.DOWN) {
    const M = m + 10, P = (w + T) / 2;
    _ = Ve(`M ${w} ${M - 10} c 0 5 5 10 10 10 L ${T - 10} ${M} c 5 0 10 -5 10 -10 M ${P} ${M} v 10`, v), p = Ae(N, P, M + 20, { anchor: "middle", color: E, dataType: "summary", svgId: k });
  } else {
    const M = d.parent ? 10 : 0, P = x + M, $ = f + M, B = (P + $) / 2;
    u === I.LHS ? (_ = Ve(`M ${b + 10} ${P} c -5 0 -10 5 -10 10 L ${b} ${$ - 10} c 0 5 5 10 10 10 M ${b} ${B} h -10`, v), p = Ae(N, b - 20, B, { anchor: "end", color: E, dataType: "summary", svgId: k })) : (_ = Ve(`M ${y - 10} ${P} c 5 0 10 5 10 10 L ${y} ${$ - 10} c 0 5 -5 10 -10 10 M ${y} ${B} h 10`, v), p = Ae(N, y + 20, B, { anchor: "start", color: E, dataType: "summary", svgId: k }));
  }
  const L = Do(k);
  return L.appendChild(_), e.labelContainer.appendChild(p), He(p), L.summaryObj = t, L.labelEl = p, h.appendChild(L), L;
}, Po = function(e = {}) {
  if (!this.currentNodes) return;
  const { currentNodes: t, summaries: n, bus: i } = this, { parent: o, start: r, end: s } = _o(t), a = { id: te(), parent: o, start: r, end: s, label: "summary", style: e.style }, c = st(this, a);
  n.push(a), this.editSummary(c), i.fire("operation", {
    name: "createSummary",
    obj: a
  });
}, $o = function(e) {
  const t = te(), n = { ...e, id: t };
  st(this, n), this.summaries.push(n), this.bus.fire("operation", {
    name: "createSummary",
    obj: n
  });
}, jo = function(e) {
  Zt(this, e) && this.bus.fire("operation", {
    name: "removeSummary",
    obj: { id: e }
  });
}, Oo = function(e) {
  const t = e.labelEl;
  t && t.classList.add("selected"), this.currentSummary = e, this.bus.fire("selectSummary", e.summaryObj);
}, Ho = function() {
  this.currentSummary?.labelEl?.classList.remove("selected"), this.currentSummary = null, this.bus.fire("unselectSummary");
}, Bo = function() {
  this.summarySvg.innerHTML = "";
  const e = [];
  this.summaries.forEach((t) => {
    try {
      st(this, t) === null && e.push(t.id);
    } catch {
    }
  }), e.forEach((t) => Zt(this, t)), this.nodes.insertAdjacentElement("beforeend", this.summarySvg);
}, Io = function(e) {
  e && e.labelEl && Rt(this, e.labelEl, e.summaryObj);
}, Wo = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  createSummary: Po,
  createSummaryFrom: $o,
  editSummary: Io,
  removeSummary: jo,
  renderSummary: Bo,
  selectSummary: Oo,
  unselectSummary: Ho
}, Symbol.toStringTag, { value: "Module" })), W = "http://www.w3.org/2000/svg";
function Ro(e, t) {
  const n = document.createElementNS(W, "svg");
  return H(n, {
    version: "1.1",
    xmlns: W,
    height: e,
    width: t
  }), n;
}
function Fo(e, t) {
  return (parseInt(e) - parseInt(t)) / 2;
}
function Vo(e, t, n, i) {
  const o = document.createElementNS(W, "g");
  let r = "";
  return e.text ? r = e.text.textContent : r = e.childNodes[0].textContent, r.split(`
`).forEach((s, a) => {
    const c = document.createElementNS(W, "text");
    H(c, {
      x: n + parseInt(t.paddingLeft) + "",
      y: i + parseInt(t.paddingTop) + Fo(t.lineHeight, t.fontSize) * (a + 1) + parseFloat(t.fontSize) * (a + 1) + "",
      "text-anchor": "start",
      "font-family": t.fontFamily,
      "font-size": `${t.fontSize}`,
      "font-weight": `${t.fontWeight}`,
      fill: `${t.color}`
    }), c.innerHTML = s, o.appendChild(c);
  }), o;
}
function Yo(e, t, n, i) {
  let o = "";
  e.nodeObj?.dangerouslySetInnerHTML ? o = e.nodeObj.dangerouslySetInnerHTML : e.text ? o = e.text.textContent : o = e.childNodes[0].textContent;
  const r = document.createElementNS(W, "foreignObject");
  H(r, {
    x: n + parseInt(t.paddingLeft) + "",
    y: i + parseInt(t.paddingTop) + "",
    width: t.width,
    height: t.height
  });
  const s = document.createElement("div");
  return H(s, {
    xmlns: "http://www.w3.org/1999/xhtml",
    style: `font-family: ${t.fontFamily}; font-size: ${t.fontSize}; font-weight: ${t.fontWeight}; color: ${t.color}; white-space: pre-wrap;`
  }), s.innerHTML = o, r.appendChild(s), r;
}
function qo(e, t) {
  const n = getComputedStyle(t), { offsetLeft: i, offsetTop: o } = R(e.nodes, t), r = document.createElementNS(W, "rect");
  return H(r, {
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
function Me(e, t, n = !1) {
  const i = getComputedStyle(t), { offsetLeft: o, offsetTop: r } = R(e.nodes, t), s = document.createElementNS(W, "rect");
  H(s, {
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
  const a = document.createElementNS(W, "g");
  a.appendChild(s);
  let c;
  return n ? c = Yo(t, i, o, r) : c = Vo(t, i, o, r), a.appendChild(c), a;
}
function zo(e, t) {
  const n = getComputedStyle(t), { offsetLeft: i, offsetTop: o } = R(e.nodes, t), r = document.createElementNS(W, "a"), s = document.createElementNS(W, "text");
  return H(s, {
    x: i + "",
    y: o + parseInt(n.fontSize) + "",
    "text-anchor": "start",
    "font-family": n.fontFamily,
    "font-size": `${n.fontSize}`,
    "font-weight": `${n.fontWeight}`,
    fill: `${n.color}`
  }), s.innerHTML = t.textContent, r.appendChild(s), r.setAttribute("href", t.href), r;
}
function Ko(e, t) {
  const n = getComputedStyle(t), { offsetLeft: i, offsetTop: o } = R(e.nodes, t), r = document.createElementNS(W, "image");
  return H(r, {
    x: i + "",
    y: o + "",
    width: n.width + "",
    height: n.height + "",
    href: t.src
  }), r;
}
const _e = 100, Xo = '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">', Uo = (e, t = !1) => {
  const n = e.nodes, i = n.offsetHeight + _e * 2, o = n.offsetWidth + _e * 2, r = Ro(i + "px", o + "px"), s = document.createElementNS(W, "svg"), a = document.createElementNS(W, "rect");
  H(a, {
    x: "0",
    y: "0",
    width: `${o}`,
    height: `${i}`,
    fill: e.theme.cssVar["--bgcolor"]
  }), r.appendChild(a), n.querySelectorAll(".subLines").forEach((d) => {
    const u = d.cloneNode(!0), { offsetLeft: b, offsetTop: y } = R(n, d.parentElement);
    u.setAttribute("x", `${b}`), u.setAttribute("y", `${y}`), s.appendChild(u);
  });
  const c = n.querySelector(".lines")?.cloneNode(!0);
  c && s.appendChild(c);
  const l = n.querySelector(".topiclinks")?.cloneNode(!0);
  l && s.appendChild(l);
  const h = n.querySelector(".summary")?.cloneNode(!0);
  return h && s.appendChild(h), n.querySelectorAll("me-tpc").forEach((d) => {
    d.nodeObj.dangerouslySetInnerHTML ? s.appendChild(Me(e, d, !t)) : (s.appendChild(qo(e, d)), s.appendChild(Me(e, d.text, !t)));
  }), n.querySelectorAll(".tags > span").forEach((d) => {
    s.appendChild(Me(e, d));
  }), n.querySelectorAll(".icons > span").forEach((d) => {
    s.appendChild(Me(e, d));
  }), n.querySelectorAll(".hyper-link").forEach((d) => {
    s.appendChild(zo(e, d));
  }), n.querySelectorAll("img").forEach((d) => {
    s.appendChild(Ko(e, d));
  }), H(s, {
    x: _e + "",
    y: _e + "",
    overflow: "visible"
  }), r.appendChild(s), r;
}, Go = (e, t) => (t && e.insertAdjacentHTML("afterbegin", "<style>" + t + "</style>"), Xo + e.outerHTML);
function Jo(e) {
  return new Promise((t, n) => {
    const i = new FileReader();
    i.onload = (o) => {
      t(o.target.result);
    }, i.onerror = (o) => {
      n(o);
    }, i.readAsDataURL(e);
  });
}
const Zo = function(e = !1, t) {
  const n = Uo(this, e), i = Go(n, t);
  return new Blob([i], { type: "image/svg+xml" });
}, Qo = async function(e = !1, t) {
  const n = this.exportSvg(e, t), i = await Jo(n);
  return new Promise((o, r) => {
    const s = new Image();
    s.setAttribute("crossOrigin", "anonymous"), s.onload = () => {
      const a = document.createElement("canvas");
      a.width = s.width, a.height = s.height, a.getContext("2d").drawImage(s, 0, 0), a.toBlob(o, "image/png", 1);
    }, s.src = i, s.onerror = r;
  });
}, er = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  exportPng: Qo,
  exportSvg: Zo
}, Symbol.toStringTag, { value: "Module" }));
function tr(e, t) {
  return async function(...n) {
    const i = this.before[t];
    i && !await i.apply(this, n) || e.apply(this, n);
  };
}
const kt = Object.keys(jt), Qt = {};
for (let e = 0; e < kt.length; e++) {
  const t = kt[e];
  Qt[t] = tr(jt[t], t);
}
const nr = {
  getObjById: Pe,
  generateNewObj: kn,
  layout: Pn,
  linkDiv: Vi,
  editTopic: Wn,
  createWrapper: On,
  createParent: Hn,
  createChildren: Bn,
  createTopic: In,
  findEle: _t,
  changeTheme: po,
  changeCompact: fo,
  ...Di,
  ...Qt,
  ...Mo,
  ...Wo,
  ...er,
  init(e) {
    if (e = JSON.parse(JSON.stringify(e)), !e || !e.nodeData) return new Error("MindElixir: `data` is required");
    e.direction !== void 0 && (this.direction = e.direction), e.compact !== void 0 && (this.compact = e.compact), this.changeTheme(e.theme || this.theme, !1), e.meta && (this.meta = e.meta), this.nodeData = e.nodeData, ee(this.nodeData), this.arrows = e.arrows || [], this.summaries = e.summaries || [], this.tidyArrow(), this.toolBar && oo(this), this.keypress && Ii(this, this.keypress), uo(this), this.disposable.push(An()), this.contextMenu && this.disposable.push(qi(this, this.contextMenu)), this.allowUndo && this.disposable.push(Ki(this)), this.layout(), this.linkDiv(), this.toCenter();
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
}, ir = "5.15.1";
function or(e) {
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
class J {
  static LEFT = 0;
  static RIGHT = 1;
  static SIDE = 2;
  static DOWN = 3;
  static THEME = ze;
  static DARK_THEME = Ke;
  /**
   * @memberof MindElixir
   * @static
   */
  static version = ir;
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
  static E = _t;
  /**
   * @function new
   * @memberof MindElixir
   * @static
   * @param {String} topic root topic
   */
  static new = (t) => ({
    nodeData: {
      id: te(),
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
    mouseSelectionButton: a,
    selectionContainer: c,
    before: l,
    newTopicName: h,
    allowUndo: d,
    generateMainBranch: u,
    generateSubBranch: b,
    overflowHidden: y,
    compact: x,
    theme: f,
    alignment: m,
    scaleSensitivity: w,
    scaleMax: T,
    scaleMin: _,
    handleWheel: p,
    markdown: v,
    imageProxy: E,
    pasteHandler: k,
    mobileMultiSelect: N
  }) {
    let L = null;
    const M = Object.prototype.toString.call(t);
    if (M === "[object HTMLDivElement]" ? L = t : M === "[object String]" && (L = document.querySelector(t)), !L) throw new Error("MindElixir: el is not a valid element");
    L.style.position = "relative", L.innerHTML = "", this.el = L, this.disposable = [], this.before = l || {}, this.newTopicName = h || "New Node", this.contextMenu = o ?? !0, this.toolBar = r ?? !0, this.keypress = s ?? !0, this.mouseSelectionButton = a ?? 0, this.direction = n ?? 1, this.editable = i ?? !0, this.allowUndo = d ?? !0, this.scaleSensitivity = w ?? 0.1, this.scaleMax = T ?? 1.4, this.scaleMin = _ ?? 0.2, this.generateMainBranch = u || qt, this.generateSubBranch = b || zt, this.overflowHidden = y ?? !1, this.compact = x ?? !1, this.alignment = m ?? "root", this.handleWheel = p ?? !0, this.markdown = v || void 0, this.imageProxy = E || void 0, this.currentNodes = [], this.currentArrow = null, this.scaleVal = 1, this.tempDirection = null, this.mobileMultiSelect = N ?? !1, this.panHelper = or(this), this.bus = Ri(), this.container = document.createElement("div"), this.selectionContainer = c || this.container, this.container.className = "map-container";
    const P = window.matchMedia("(prefers-color-scheme: dark)");
    this.theme = f || (P.matches ? Ke : ze);
    const $ = document.createElement("div");
    $.className = "map-canvas", this.map = $, this.container.setAttribute("tabindex", "0"), this.container.appendChild(this.map), this.el.appendChild(this.container), this.nodes = document.createElement("me-nodes"), this.lines = ge("lines"), this.summarySvg = ge("summary"), this.linkController = ge("linkcontroller"), this.P2 = document.createElement("div"), this.P3 = document.createElement("div"), this.P2.className = this.P3.className = "circle", this.P2.style.display = this.P3.style.display = "none", this.line1 = gt(), this.line2 = gt(), this.linkController.appendChild(this.line1), this.linkController.appendChild(this.line2), this.arrowSvg = ge("topiclinks"), this.labelContainer = document.createElement("div"), this.labelContainer.className = "label-container", this.map.appendChild(this.nodes), this.overflowHidden ? this.container.style.overflow = "hidden" : this.disposable.push(Wi(this)), k && (this.pasteHandler = k);
  }
}
Object.assign(J.prototype, nr);
const rr = {
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
}, sr = rr, ar = {
  addChild: "插入子節點",
  addParent: "插入父節點",
  addSibling: "插入同級節點",
  removeNode: "刪除節點",
  focus: "專注",
  cancelFocus: "取消專注",
  moveUp: "上移",
  moveDown: "下移",
  link: "連接",
  linkBidirectional: "雙向連接",
  clickTips: "請點擊目標節點",
  summary: "摘要"
}, lr = {
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
}, cr = {
  addChild: "子ノードを追加する",
  addParent: "親ノードを追加します",
  addSibling: "兄弟ノードを追加する",
  removeNode: "ノードを削除",
  focus: "集中",
  cancelFocus: "集中解除",
  moveUp: "上へ移動",
  moveDown: "下へ移動",
  link: "コネクト",
  linkBidirectional: "双方向リンク",
  clickTips: "ターゲットノードをクリックしてください",
  summary: "概要"
}, dr = {
  addChild: "Adicionar item filho",
  addParent: "Adicionar item pai",
  addSibling: "Adicionar item irmao",
  removeNode: "Remover item",
  focus: "Modo Foco",
  cancelFocus: "Cancelar Modo Foco",
  moveUp: "Mover para cima",
  moveDown: "Mover para baixo",
  link: "Link",
  linkBidirectional: "Link bidirecional",
  clickTips: "Favor clicar no item alvo",
  summary: "Resumo"
}, hr = {
  addChild: "Aggiungi figlio",
  addParent: "Aggiungi genitore",
  addSibling: "Aggiungi fratello",
  removeNode: "Rimuovi nodo",
  focus: "Modalità Focus",
  cancelFocus: "Annulla Modalità Focus",
  moveUp: "Sposta su",
  moveDown: "Sposta giù",
  link: "Collega",
  linkBidirectional: "Collegamento bidirezionale",
  clickTips: "Si prega di fare clic sul nodo di destinazione",
  summary: "Unisci nodi"
}, ur = {
  addChild: "Agregar hijo",
  addParent: "Agregar padre",
  addSibling: "Agregar hermano",
  removeNode: "Eliminar nodo",
  focus: "Modo Enfoque",
  cancelFocus: "Cancelar Modo Enfoque",
  moveUp: "Mover hacia arriba",
  moveDown: "Mover hacia abajo",
  link: "Enlace",
  linkBidirectional: "Enlace bidireccional",
  clickTips: "Por favor haga clic en el nodo de destino",
  summary: "Resumen"
}, pr = {
  addChild: "Ajout enfant",
  addParent: "Ajout parent",
  addSibling: "Ajout voisin",
  removeNode: "Supprimer",
  focus: "Cibler",
  cancelFocus: "Retour",
  moveUp: "Monter",
  moveDown: "Descendre",
  link: "Lier",
  linkBidirectional: "Lien bidirectionnel",
  clickTips: "Cliquer sur le noeud cible",
  summary: "Annoter"
}, fr = {
  addChild: "자식 추가",
  addParent: "부모 추가",
  addSibling: "형제 추가",
  removeNode: "노드 삭제",
  focus: "포커스 모드",
  cancelFocus: "포커스 모드 취소",
  moveUp: "위로 이동",
  moveDown: "아래로 이동",
  link: "연결",
  linkBidirectional: "양방향 연결",
  clickTips: "대상 노드를 클릭하십시오",
  summary: "요약"
}, mr = {
  addChild: "Kind hinzufügen",
  addParent: "Eltern hinzufügen",
  addSibling: "Geschwister hinzufügen",
  removeNode: "Knoten entfernen",
  focus: "Fokusmodus",
  cancelFocus: "Fokusmodus abbrechen",
  moveUp: "Nach oben verschieben",
  moveDown: "Nach unten verschieben",
  link: "Link",
  linkBidirectional: "Zweiseitiger Link",
  clickTips: "Bitte klicken Sie auf den Zielknoten",
  summary: "Zusammenfassung"
}, Ye = { en: lr, zh_CN: sr, zh_TW: ar, ja: cr, ko: fr, es: ur, pt: dr, fr: pr, de: mr, it: hr }, gr = {
  "cm-add_child": "addChild",
  "cm-add_parent": "addParent",
  "cm-add_sibling": "addSibling",
  "cm-remove_child": "removeNode",
  "cm-fucus": "focus",
  "cm-unfucus": "cancelFocus",
  "cm-up": "moveUp",
  "cm-down": "moveDown",
  "cm-link": "link",
  "cm-link-bidirectional": "linkBidirectional",
  "cm-summary": "summary"
};
function br(e, t) {
  if (e)
    for (const [n, i] of Object.entries(gr)) {
      const o = e.querySelector(`#${n} > span:first-child`);
      o && (o.textContent = t[i]);
    }
}
const be = {
  emerald: { root: "#00856a", rootText: "#ffffff", node: "#e8f5f0", text: "#17332b", accent: "#00856a", palette: ["#00856a", "#2b8f75", "#5aa58f", "#83bbaa", "#a8d0c3", "#d4e7df"] },
  ocean: { root: "#2563eb", rootText: "#ffffff", node: "#eaf2ff", text: "#17324d", accent: "#2563eb", palette: ["#2563eb", "#0ea5e9", "#0891b2", "#14b8a6", "#67e8f9", "#bfdbfe"] },
  sunset: { root: "#c2410c", rootText: "#ffffff", node: "#fff7ed", text: "#7c2d12", accent: "#ea580c", palette: ["#c2410c", "#ea580c", "#f59e0b", "#eab308", "#fb923c", "#fed7aa"] },
  mono: { root: "#334155", rootText: "#ffffff", node: "#f1f5f9", text: "#1e293b", accent: "#475569", palette: ["#334155", "#475569", "#64748b", "#94a3b8", "#cbd5e1", "#e2e8f0"] }
};
function fe(e) {
  const t = be[e];
  return {
    ...J.THEME,
    name: `Knowledge ${e}`,
    palette: t.palette,
    cssVar: {
      ...J.THEME.cssVar,
      "--accent-color": t.accent,
      "--root-bgcolor": t.root,
      "--root-color": t.rootText,
      "--selected": `${t.accent}22`,
      "--panel-bgcolor": "var(--knowledge-surface-elevated)",
      "--panel-border-color": "var(--knowledge-border)"
    }
  };
}
const en = { left: J.LEFT, right: J.RIGHT, side: J.SIDE, down: J.DOWN };
function tn(e) {
  return {
    id: e.id,
    topic: e.text,
    expanded: e.expanded,
    direction: e.direction === "left" ? 0 : e.direction === "right" ? 1 : void 0,
    style: { color: e.style.color, background: e.style.background_color, fontWeight: e.style.font_weight },
    ...e.tags?.length ? { tags: e.tags } : {},
    ...e.note ? { note: e.note } : {},
    ...e.link ? { hyperLink: e.link } : {},
    children: e.children.map(tn)
  };
}
function ae(e) {
  return {
    nodeData: tn(e.root),
    direction: en[e.layout],
    compact: e.compact,
    arrows: e.relations.map((t) => ({ id: t.id, from: t.from, to: t.to, label: t.label, bidirectional: t.bidirectional, style: { stroke: t.color, strokeWidth: t.width, strokeDasharray: t.dashed ? "6 4" : "" } }))
  };
}
function nn(e) {
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
    children: (e.children || []).map(nn)
  };
}
function on(e, t) {
  if (e.id === t) return e;
  for (const n of e.children) {
    const i = on(n, t);
    if (i) return i;
  }
  return null;
}
function rn(e, t, n) {
  return e.id === t ? { ...e, ...n } : { ...e, children: e.children.map((i) => rn(i, t, n)) };
}
function De(e, t) {
  return qe(JSON.stringify({
    schema_version: 1,
    ...t,
    root: nn(e.nodeData),
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
function sn(e, t, n = !1) {
  const i = be[t];
  return {
    ...e,
    style: {
      color: n ? i.rootText : i.text,
      background_color: n ? i.root : i.node,
      font_weight: n ? "bold" : e.style.font_weight
    },
    children: e.children.map((o) => sn(o, t))
  };
}
function me(e, t) {
  if (!t || !e.getObjById(t, e.nodeData)) return !1;
  try {
    return e.selectNode(e.findEle(t)), !0;
  } catch {
    return !1;
  }
}
function Sr({ body: e, readOnly: t = !1, documentTitle: n = C("knowledge.auto.c59fdacd6a72a12c"), initialBlockID: i, pageActionHost: o, authorizeContentAction: r, onChange: s, onPresence: a, onCommentAnchor: c, onActionFeedback: l }) {
  const h = dn(), d = X(null), u = X(null), b = X({ ...Ye[Re[h]] });
  Object.assign(b.current, Ye[Re[h]]);
  const y = X(null), x = X(e), f = X(at(e)), m = X(s), w = X({ onPresence: a, onCommentAnchor: c }), [T, _] = Se(f.current.theme), [p, v] = Se(f.current.layout), [E, k] = Se(""), [N, L] = Se(0);
  m.current = s, w.current = { onPresence: a, onCommentAnchor: c };
  const M = (g) => {
    f.current = g, _(g.theme), v(g.layout), m.current(Ee(g));
  };
  Ce(() => {
    if (!d.current) return;
    f.current = at(x.current);
    const g = new J({
      el: d.current,
      direction: en[f.current.layout],
      editable: !t,
      contextMenu: t ? !1 : { locale: b.current, focus: !0, link: !0 },
      newTopicName: C("knowledge.auto.bdbce97482269b4c"),
      toolBar: !t,
      keypress: !t,
      overflowHidden: !0,
      compact: f.current.compact,
      theme: fe(f.current.theme)
    });
    g.init(ae(f.current)), u.current = g;
    const S = () => {
      t || M(De(g.getData(), f.current));
    }, A = (V) => {
      const Y = g.currentNodes.map((xe) => xe.nodeObj), oe = Y.length > 0 ? Y : V, q = oe[0];
      k(q?.id || ""), w.current.onPresence?.(q?.id, oe.length > 1 ? oe[oe.length - 1]?.id : void 0), w.current.onCommentAnchor?.(q ? { nodeID: q.id, quote: (q.topic || C("knowledge.auto.96a32e8e207257b2")).trim() } : void 0);
    }, j = (V) => A([V]), ie = () => {
      const V = g.currentNodes.map((Y) => Y.nodeObj);
      if (V.length > 0) {
        A(V);
        return;
      }
      k(""), w.current.onPresence?.(), w.current.onCommentAnchor?.();
    }, we = (V) => {
      const Y = V.target instanceof Element ? V.target.closest("me-tpc") : null;
      if (!Y || !d.current?.contains(Y)) {
        ie();
        return;
      }
      const oe = Y.nodeObj, q = Y.getAttribute("data-nodeid") || "", xe = q.startsWith("me") ? q.slice(2) : q, pe = oe || (xe ? g.getObjById(xe, g.nodeData) : null);
      pe && (k(pe.id), w.current.onPresence?.(pe.id), w.current.onCommentAnchor?.({ nodeID: pe.id, quote: (pe.topic || C("knowledge.auto.96a32e8e207257b2")).trim() }));
    };
    return g.bus.addListener("operation", S), g.bus.addListener("selectNodes", A), g.bus.addListener("selectNewNode", j), d.current.addEventListener("pointerdown", we, !0), () => {
      d.current?.removeEventListener("pointerdown", we, !0), u.current = null, g.destroy();
    };
  }, [t]), Ce(() => {
    const g = u.current;
    g && (Object.assign(b.current, Ye[Re[h]]), g.newTopicName = C("knowledge.auto.bdbce97482269b4c"), br(d.current, b.current));
  }, [h]), Ce(() => {
    const g = u.current;
    !g || !i || !me(g, i) || (k(i), g.findEle(i)?.scrollIntoView({ block: "center", inline: "center" }));
  }, [i]), Ce(() => {
    const g = u.current;
    if (!g) return;
    let S;
    try {
      S = qe(e);
    } catch {
      return;
    }
    Ee(S) !== Ee(f.current) && (f.current = S, _(S.theme), v(S.layout), g.changeTheme(fe(S.theme), !1), g.refresh(ae(S)), g.clearHistory?.(), me(g, E) || k(""));
  }, [e, E]);
  const P = (g) => {
    const S = u.current;
    if (!S) return;
    const A = be[g], j = De(S.getData(), f.current), ie = {
      ...j,
      theme: g,
      root: sn(j.root, g, !0),
      relations: j.relations.map((we) => ({ ...we, color: A.accent }))
    };
    S.changeTheme(fe(g), !1), S.refresh(ae(ie)), me(S, E), M(ie);
  }, $ = (g) => {
    const S = u.current;
    S && ({ left: S.initLeft, right: S.initRight, side: S.initSide, down: S.initDown }[g].call(S), me(S, E), M(De(S.getData(), { ...f.current, layout: g })));
  }, B = async (g) => {
    const S = u.current;
    if (!S || !E) return;
    const A = S.getObjById(E, S.nodeData), j = S.findEle(E);
    !A || !j || await S.reshapeNode(j, { style: { ...A.style, ...g.color ? { color: g.color } : {}, ...g.background_color ? { background: g.background_color } : {}, ...g.font_weight ? { fontWeight: g.font_weight } : {} } });
  }, K = (g) => {
    const S = u.current;
    if (!(!S || !E))
      try {
        const A = De(S.getData(), f.current), j = { ...A, root: rn(A.root, E, g) };
        S.refresh(ae(j)), me(S, E), M(j), L((ie) => ie + 1);
      } catch (A) {
        l?.(A instanceof Error ? A.message : C("knowledge.auto.a2d658fe1b4f4fe0"));
      }
  }, ne = (g) => {
    const S = u.current, A = mn[g];
    if (!S || !A) return;
    const j = structuredClone(A);
    f.current = j, S.changeTheme(fe(j.theme), !1), S.refresh(ae(j)), S.clearHistory?.(), M(j), l?.(C("knowledge.auto.4ec7e5d9784d732f"));
  }, an = async (g) => {
    if (g) {
      try {
        const S = qe(await g.text());
        f.current = S, u.current?.changeTheme(fe(S.theme), !1), u.current?.refresh(ae(S)), u.current?.clearHistory?.(), M(S), l?.(C("knowledge.auto.5c7e4df57c189f49"));
      } catch (S) {
        l?.(S instanceof Error ? S.message : C("knowledge.auto.d5d4ca58693603db"));
      }
      y.current && (y.current.value = "");
    }
  }, ln = async () => {
    if (!r) throw Error(C("knowledge.auto.5838a06d4990c165"));
    await r("export"), lt(new Blob([Ee(f.current)], { type: "application/json" }), `${n || C("knowledge.auto.c59fdacd6a72a12c")}.json`);
  }, cn = async () => {
    if (!r) throw Error(C("knowledge.auto.5838a06d4990c165"));
    await r("export");
    const g = await u.current?.exportPng(!1);
    g ? lt(g, `${n || C("knowledge.auto.c59fdacd6a72a12c")}.png`) : l?.(C("knowledge.auto.4aaefa3d89b28b78"));
  }, ue = E ? on(f.current.root, E) : null;
  return /* @__PURE__ */ O("div", { className: "knowledge-open-editor is-mind-elixir", children: [
    r && /* @__PURE__ */ O(hn, { host: o, children: [
      /* @__PURE__ */ O(Ie, { title: C("knowledge.auto.28ff768a104f56a9"), onClick: () => {
        ln().catch((g) => l?.(g instanceof Error ? g.message : C("knowledge.auto.f7862b83251f2349")));
      }, children: [
        /* @__PURE__ */ D(gn, { size: 15 }),
        "JSON"
      ] }),
      /* @__PURE__ */ O(Ie, { title: C("knowledge.auto.8c52149aae4527da"), onClick: () => {
        cn().catch((g) => l?.(g instanceof Error ? g.message : C("knowledge.auto.f7862b83251f2349")));
      }, children: [
        /* @__PURE__ */ D(bn, { size: 15 }),
        "PNG"
      ] })
    ] }),
    !t && /* @__PURE__ */ O("div", { className: "diagram-editor-toolbar", "aria-label": C("knowledge.auto.8bdb02e8292144e9"), children: [
      /* @__PURE__ */ O("label", { children: [
        /* @__PURE__ */ D(yn, { size: 15 }),
        C("knowledge.auto.788db1cfec2a3db5"),
        /* @__PURE__ */ D(We, { "aria-label": C("knowledge.auto.6e63dcaf2f8260c5"), value: T, onChange: (g) => P(g.target.value), children: un.map((g) => /* @__PURE__ */ D("option", { value: g, children: { emerald: C("knowledge.auto.8fabc966781dcce2"), ocean: C("knowledge.auto.44467431f287c616"), sunset: C("knowledge.auto.67995f590a93c211"), mono: C("knowledge.auto.574ce385b86dddcc") }[g] }, g)) })
      ] }),
      /* @__PURE__ */ O("label", { children: [
        C("knowledge.auto.faa2f2ed67357847"),
        /* @__PURE__ */ D(We, { "aria-label": C("knowledge.auto.f03d544a0bc27c56"), value: p, onChange: (g) => $(g.target.value), children: pn.map((g) => /* @__PURE__ */ D("option", { value: g, children: { side: C("knowledge.auto.1aaf161623b5d59e"), left: C("knowledge.auto.233b5e712d178862"), right: C("knowledge.auto.09ea06dc6b2b90e8"), down: C("knowledge.auto.967a206e3aa79ada") }[g] }, g)) })
      ] }),
      /* @__PURE__ */ O("label", { children: [
        /* @__PURE__ */ D(vn, { size: 15 }),
        C("knowledge.auto.62b95daecb7f81da"),
        /* @__PURE__ */ O(We, { "aria-label": C("knowledge.auto.079640d090bdfc05"), defaultValue: "", onChange: (g) => {
          ne(g.target.value), g.target.value = "";
        }, children: [
          /* @__PURE__ */ D("option", { value: "", disabled: !0, children: C("knowledge.auto.a3623cdcb7e18390") }),
          /* @__PURE__ */ D("option", { value: "brainstorming", children: C("knowledge.auto.ea4d59a0e56e937f") }),
          /* @__PURE__ */ D("option", { value: "swot", children: C("knowledge.auto.8498736be653401c") })
        ] })
      ] }),
      /* @__PURE__ */ O("span", { className: "diagram-style-tools", "aria-label": C("knowledge.auto.bd4825d7d6ce923d"), children: [
        /* @__PURE__ */ D("button", { type: "button", disabled: !E, "aria-label": C("knowledge.auto.3b3faff736f848df"), onClick: () => B({ font_weight: "bold" }), children: /* @__PURE__ */ D("strong", { children: "B" }) }),
        [be[T].node, be[T].text].map((g, S) => /* @__PURE__ */ D("button", { type: "button", disabled: !E, className: "diagram-color-swatch", style: { background: g }, "aria-label": S === 0 ? C("knowledge.auto.8482ed6c4fd90539") : C("knowledge.auto.da7a563d4a6be766"), onClick: () => B(S === 0 ? { background_color: g } : { color: g }) }, g))
      ] }),
      /* @__PURE__ */ O(Ie, { title: C("knowledge.auto.40a86fa9e4a4ac09"), "aria-label": C("knowledge.auto.52b4bea345a5f5a8"), onClick: () => y.current?.click(), children: [
        /* @__PURE__ */ D(wn, { size: 15 }),
        C("knowledge.auto.576d81bb0631b165")
      ] }),
      /* @__PURE__ */ O("span", { className: "diagram-toolbar-hint", children: [
        /* @__PURE__ */ D(xn, { size: 14 }),
        C("knowledge.auto.cafd94a3ebf01e7e")
      ] }),
      /* @__PURE__ */ D("input", { ref: y, hidden: !0, type: "file", accept: "application/json,.json", onChange: (g) => an(g.target.files?.[0]) })
    ] }),
    !t && ue && /* @__PURE__ */ O("section", { className: "mindmap-node-metadata", "aria-label": C("knowledge.auto.0edd9e06a41d4430"), children: [
      /* @__PURE__ */ O("label", { children: [
        /* @__PURE__ */ D(En, { size: 14 }),
        /* @__PURE__ */ D("span", { children: C("knowledge.auto.1d0fd5f9336d9103") }),
        /* @__PURE__ */ D("input", { defaultValue: (ue.tags || []).join(", "), placeholder: C("knowledge.auto.02d3a3e342d411f2"), onBlur: (g) => K({ tags: [...new Set(g.target.value.split(/[,，]/).map((S) => Array.from(S.trim()).slice(0, 20).join("")).filter(Boolean))].slice(0, 12) }) })
      ] }),
      /* @__PURE__ */ O("label", { children: [
        /* @__PURE__ */ D(Sn, { size: 14 }),
        /* @__PURE__ */ D("span", { children: C("knowledge.auto.daede9881787abe7") }),
        /* @__PURE__ */ D("input", { maxLength: 1365, defaultValue: ue.note || "", placeholder: C("knowledge.auto.db2ae6cfbd885fd7"), onBlur: (g) => K({ note: g.target.value }) })
      ] }),
      /* @__PURE__ */ O("label", { children: [
        /* @__PURE__ */ D(Cn, { size: 14 }),
        /* @__PURE__ */ D("span", { children: C("knowledge.auto.305378ddd2b86b60") }),
        /* @__PURE__ */ D("input", { type: "url", maxLength: 2048, defaultValue: ue.link || "", placeholder: "https://example.com", onBlur: (g) => K({ link: g.target.value.trim() }) })
      ] })
    ] }, `${ue.id}:${N}`),
    /* @__PURE__ */ D("div", { ref: d, className: "native-mindmap-host", "data-plain-text": fn(f.current) })
  ] });
}
export {
  Sr as MindMapEditor
};
