import { jsxs as Vt, jsx as wr } from "react/jsx-runtime";
import { useRef as ln, useEffect as au } from "react";
import { k as Xs, g as su, o as lu, p as uu, q as du, d as fu, l as cu, s as bo, m as pe, n as lr, r as pu, t as Ho } from "./reduce-BdL4HU--.js";
import { c as I, p as er, m as ht, a as kt, h as Wi, l as hu } from "./pick-EJzteDLH.js";
import { g as vu, b as yu, B as gu, j as _u, k as mu, i as Ys, L as uo, s as Fs, n as xu } from "./isArrayLikeObject-22lj2fKO.js";
import { h as Eu, j as bu, e as Ou, g as wu, m as wi } from "./_baseSet-DtN1xX6L.js";
import { d as Si, s as Su } from "./set-BCm3xjGO.js";
import { g as Hs, B as Oo } from "./index-CpwBliWZ.js";
import { Circle as Au, Square as Mu, Diamond as Pu, Plus as Du } from "lucide-react";
var Tu = Object.prototype, Nu = Tu.hasOwnProperty, V = Eu(function(r, e) {
  if (vu(e) || yu(e)) {
    bu(e, Xs(e), r);
    return;
  }
  for (var t in e)
    Nu.call(e, t) && Ou(r, t, e[t]);
});
function Cu(r, e) {
  return gu(e, function(t) {
    return [t, r[t]];
  });
}
function Lu(r) {
  var e = -1, t = Array(r.size);
  return r.forEach(function(n) {
    t[++e] = [n, n];
  }), t;
}
var ju = "[object Map]", Ru = "[object Set]";
function Iu(r) {
  return function(e) {
    var t = su(e);
    return t == ju ? lu(e) : t == Ru ? Lu(e) : Cu(e, r(e));
  };
}
var St = Iu(Xs);
function ku(r, e, t) {
  var n = r == null ? 0 : r.length;
  if (!n)
    return -1;
  var o = 0;
  return uu(r, e, o);
}
var Bu = "[object Boolean]";
function Go(r) {
  return r === !0 || r === !1 || _u(r) && mu(r) == Bu;
}
function Ki(r, e) {
  return du(r, e);
}
function Me(r) {
  return r == null;
}
function Xu(r, e) {
  var t = {};
  return e = fu(e), cu(r, function(n, o, i) {
    wu(t, e(n, o, i), n);
  }), t;
}
var Yu = "Expected a function";
function Fu(r, e, t) {
  var n = !0, o = !0;
  if (typeof r != "function")
    throw new TypeError(Yu);
  return Ys(t) && (n = "leading" in t ? !!t.leading : n, o = "trailing" in t ? !!t.trailing : o), Si(r, e, {
    leading: n,
    maxWait: e,
    trailing: o
  });
}
var fo, F, Gs, yt, Zi, zs, Us, wo, Nn, Lr, Vs, Ai, zo, Uo, In = {}, kn = [], Hu = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i, tn = Array.isArray;
function ct(r, e) {
  for (var t in e) r[t] = e[t];
  return r;
}
function Mi(r) {
  r && r.parentNode && r.parentNode.removeChild(r);
}
function ur(r, e, t) {
  var n, o, i, a = {};
  for (i in e) i == "key" ? n = e[i] : i == "ref" ? o = e[i] : a[i] = e[i];
  if (arguments.length > 2 && (a.children = arguments.length > 3 ? fo.call(arguments, 2) : t), typeof r == "function" && r.defaultProps != null) for (i in r.defaultProps) a[i] === void 0 && (a[i] = r.defaultProps[i]);
  return Cn(r, a, n, o, null);
}
function Cn(r, e, t, n, o) {
  var i = { type: r, props: e, key: t, ref: n, __k: null, __: null, __b: 0, __e: null, __c: null, constructor: void 0, __v: o ?? ++Gs, __i: -1, __u: 0 };
  return o == null && F.vnode != null && F.vnode(i), i;
}
function Pi() {
  return { current: null };
}
function dr(r) {
  return r.children;
}
function $(r, e) {
  this.props = r, this.context = e;
}
function Bt(r, e) {
  if (e == null) return r.__ ? Bt(r.__, r.__i + 1) : null;
  for (var t; e < r.__k.length; e++) if ((t = r.__k[e]) != null && t.__e != null) return t.__e;
  return typeof r.type == "function" ? Bt(r) : null;
}
function Gu(r) {
  if (r.__P && r.__d) {
    var e = r.__v, t = e.__e, n = [], o = [], i = ct({}, e);
    i.__v = e.__v + 1, F.vnode && F.vnode(i), Di(r.__P, i, e, r.__n, r.__P.namespaceURI, 32 & e.__u ? [t] : null, n, t ?? Bt(e), !!(32 & e.__u), o), i.__v = e.__v, i.__.__k[i.__i] = i, qs(n, i, o), e.__e = e.__ = null, i.__e != t && $s(i);
  }
}
function $s(r) {
  if ((r = r.__) != null && r.__c != null) return r.__e = r.__c.base = null, r.__k.some(function(e) {
    if (e != null && e.__e != null) return r.__e = r.__c.base = e.__e;
  }), $s(r);
}
function qi(r) {
  (!r.__d && (r.__d = !0) && yt.push(r) && !Bn.__r++ || Zi != F.debounceRendering) && ((Zi = F.debounceRendering) || zs)(Bn);
}
function Bn() {
  try {
    for (var r, e = 1; yt.length; ) yt.length > e && yt.sort(Us), r = yt.shift(), e = yt.length, Gu(r);
  } finally {
    yt.length = Bn.__r = 0;
  }
}
function Ws(r, e, t, n, o, i, a, s, l, u, d) {
  var f, c, p, h, v, g, y = n && n.__k || kn, _ = e.length;
  for (l = zu(t, e, y, l, _), f = 0; f < _; f++) (p = t.__k[f]) != null && (c = p.__i != -1 && y[p.__i] || In, p.__i = f, g = Di(r, p, c, o, i, a, s, l, u, d), h = p.__e, p.ref && c.ref != p.ref && (c.ref && Ti(c.ref, null, p), d.push(p.ref, p.__c || h, p)), v == null && h != null && (v = h), 4 & p.__u ? (l = Ks(p, l, r), c.__e && (c.__e = null)) : typeof p.type == "function" && g !== void 0 ? l = g : h && (l = h.nextSibling), p.__u &= -7);
  return t.__e = v, l;
}
function zu(r, e, t, n, o) {
  var i, a, s, l, u, d = t.length, f = d, c = 0;
  for (r.__k = new Array(o), i = 0; i < o; i++) (a = e[i]) != null && typeof a != "boolean" && typeof a != "function" ? (typeof a == "string" || typeof a == "number" || typeof a == "bigint" || a.constructor == String ? a = r.__k[i] = Cn(null, a, null, null, null) : tn(a) ? a = r.__k[i] = Cn(dr, { children: a }, null, null, null) : a.constructor === void 0 && a.__b > 0 ? a = r.__k[i] = Cn(a.type, a.props, a.key, a.ref ? a.ref : null, a.__v) : r.__k[i] = a, l = i + c, a.__ = r, a.__b = r.__b + 1, s = null, (u = a.__i = Uu(a, t, l, f)) != -1 && (f--, (s = t[u]) && (s.__u |= 2)), s == null || s.__v == null ? (u == -1 && (o > d ? c-- : o < d && c++), typeof a.type != "function" && (a.__u |= 4)) : u != l && (u == l - 1 ? c-- : u == l + 1 ? c++ : (u > l ? c-- : c++, a.__u |= 4))) : r.__k[i] = null;
  if (f) for (i = 0; i < d; i++) (s = t[i]) != null && (2 & s.__u) == 0 && (s.__e == n && (n = Bt(s)), Qs(s, s));
  return n;
}
function Ks(r, e, t) {
  var n, o;
  if (typeof r.type == "function") {
    for (n = r.__k, o = 0; n && o < n.length; o++) n[o] && (n[o].__ = r, e = Ks(n[o], e, t));
    return e;
  }
  r.__e != e && (e && r.type && !e.parentNode && (e = Bt(r)), e = t.insertBefore(r.__e, e || null));
  do
    e = e && e.nextSibling;
  while (e != null && e.nodeType == 8);
  return e;
}
function Xn(r, e) {
  return e = e || [], r == null || typeof r == "boolean" || (tn(r) ? r.some(function(t) {
    Xn(t, e);
  }) : e.push(r)), e;
}
function Uu(r, e, t, n) {
  var o, i, a, s = r.key, l = r.type, u = e[t], d = u != null && (2 & u.__u) == 0;
  if (u === null && s == null || d && s == u.key && l == u.type) return t;
  if (n > (d ? 1 : 0)) {
    for (o = t - 1, i = t + 1; o >= 0 || i < e.length; ) if ((u = e[a = o >= 0 ? o-- : i++]) != null && (2 & u.__u) == 0 && s == u.key && l == u.type) return a;
  }
  return -1;
}
function Ji(r, e, t) {
  e[0] == "-" ? r.setProperty(e, t ?? "") : r[e] = t == null ? "" : typeof t != "number" || Hu.test(e) ? t : t + "px";
}
function un(r, e, t, n, o) {
  var i, a;
  e: if (e == "style") if (typeof t == "string") r.style.cssText = t;
  else {
    if (typeof n == "string" && (r.style.cssText = n = ""), n) for (e in n) t && e in t || Ji(r.style, e, "");
    if (t) for (e in t) n && t[e] == n[e] || Ji(r.style, e, t[e]);
  }
  else if (e[0] == "o" && e[1] == "n") i = e != (e = e.replace(Vs, "$1")), a = e.toLowerCase(), e = a in r || e == "onFocusOut" || e == "onFocusIn" ? a.slice(2) : e.slice(2), r.l || (r.l = {}), r.l[e + i] = t, t ? n ? t[Lr] = n[Lr] : (t[Lr] = Ai, r.addEventListener(e, i ? Uo : zo, i)) : r.removeEventListener(e, i ? Uo : zo, i);
  else {
    if (o == "http://www.w3.org/2000/svg") e = e.replace(/xlink(H|:h)/, "h").replace(/sName$/, "s");
    else if (e != "width" && e != "height" && e != "href" && e != "list" && e != "form" && e != "tabIndex" && e != "download" && e != "rowSpan" && e != "colSpan" && e != "role" && e != "popover" && e in r) try {
      r[e] = t ?? "";
      break e;
    } catch {
    }
    typeof t == "function" || (t == null || t === !1 && e[4] != "-" ? r.removeAttribute(e) : r.setAttribute(e, e == "popover" && t == 1 ? "" : t));
  }
}
function Qi(r) {
  return function(e) {
    if (this.l) {
      var t = this.l[e.type + r];
      if (e[Nn] == null) e[Nn] = Ai++;
      else if (e[Nn] < t[Lr]) return;
      return t(F.event ? F.event(e) : e);
    }
  };
}
function Di(r, e, t, n, o, i, a, s, l, u) {
  var d, f, c, p, h, v, g, y, _, S, A, x, E, m, b, P, D = e.type;
  if (e.constructor !== void 0) return null;
  128 & t.__u && (l = !!(32 & t.__u), i = [s = e.__e = t.__e]), (d = F.__b) && d(e);
  e: if (typeof D == "function") {
    f = a.length;
    try {
      if (_ = e.props, S = D.prototype && D.prototype.render, A = (d = D.contextType) && n[d.__c], x = d ? A ? A.props.value : d.__ : n, t.__c ? y = (c = e.__c = t.__c).__ = c.__E : (S ? e.__c = c = new D(_, x) : (e.__c = c = new $(_, x), c.constructor = D, c.render = $u), A && A.sub(c), c.state || (c.state = {}), c.__n = n, p = c.__d = !0, c.__h = [], c._sb = []), S && c.__s == null && (c.__s = c.state), S && D.getDerivedStateFromProps != null && (c.__s == c.state && (c.__s = ct({}, c.__s)), ct(c.__s, D.getDerivedStateFromProps(_, c.__s))), h = c.props, v = c.state, c.__v = e, p) S && D.getDerivedStateFromProps == null && c.componentWillMount != null && c.componentWillMount(), S && c.componentDidMount != null && c.__h.push(c.componentDidMount);
      else {
        if (S && D.getDerivedStateFromProps == null && _ !== h && c.componentWillReceiveProps != null && c.componentWillReceiveProps(_, x), e.__v == t.__v || !c.__e && c.shouldComponentUpdate != null && c.shouldComponentUpdate(_, c.__s, x) === !1) {
          e.__v != t.__v && (c.props = _, c.state = c.__s, c.__d = !1), e.__e = t.__e, e.__k = t.__k, e.__k.some(function(k) {
            k && (k.__ = e);
          }), kn.push.apply(c.__h, c._sb), c._sb = [], c.__h.length && a.push(c), s = Bt(t);
          break e;
        }
        c.componentWillUpdate != null && c.componentWillUpdate(_, c.__s, x), S && c.componentDidUpdate != null && c.__h.push(function() {
          c.componentDidUpdate(h, v, g);
        });
      }
      if (c.context = x, c.props = _, c.__P = r, c.__e = !1, E = F.__r, m = 0, S) c.state = c.__s, c.__d = !1, E && E(e), d = c.render(c.props, c.state, c.context), kn.push.apply(c.__h, c._sb), c._sb = [];
      else do
        c.__d = !1, E && E(e), d = c.render(c.props, c.state, c.context), c.state = c.__s;
      while (c.__d && ++m < 25);
      c.state = c.__s, c.getChildContext != null && (n = ct(ct({}, n), c.getChildContext())), S && !p && c.getSnapshotBeforeUpdate != null && (g = c.getSnapshotBeforeUpdate(h, v)), b = d != null && d.type === dr && d.key == null ? Js(d.props.children) : d, s = Ws(r, tn(b) ? b : [b], e, t, n, o, i, a, s, l, u), c.base = e.__e, e.__u &= -161, c.__h.length && a.push(c), y && (c.__E = c.__ = null);
    } catch (k) {
      if (a.length = f, e.__v = null, l || i != null) {
        if (k.then) {
          for (e.__u |= l ? 160 : 128; s && s.nodeType == 8 && s.nextSibling; ) s = s.nextSibling;
          i != null && (i[i.indexOf(s)] = null), e.__e = s;
        } else if (i != null) for (P = i.length; P--; ) Mi(i[P]);
      } else e.__e = t.__e;
      e.__k == null && (e.__k = t.__k || []), k.then || Zs(e), F.__e(k, e, t);
    }
  } else i == null && e.__v == t.__v ? (e.__k = t.__k, e.__e = t.__e) : s = e.__e = Vu(t.__e, e, t, n, o, i, a, l, u);
  return (d = F.diffed) && d(e), 128 & e.__u ? void 0 : s;
}
function Zs(r) {
  r && (r.__c && (r.__c.__e = !0), r.__k && r.__k.some(Zs));
}
function qs(r, e, t) {
  for (var n = 0; n < t.length; n++) Ti(t[n], t[++n], t[++n]);
  F.__c && F.__c(e, r), r.some(function(o) {
    try {
      r = o.__h, o.__h = [], r.some(function(i) {
        i.call(o);
      });
    } catch (i) {
      F.__e(i, o.__v);
    }
  });
}
function Js(r) {
  return typeof r != "object" || r == null || r.__b > 0 ? r : tn(r) ? r.map(Js) : r.constructor !== void 0 ? null : ct({}, r);
}
function Vu(r, e, t, n, o, i, a, s, l) {
  var u, d, f, c, p, h, v, g = t.props || In, y = e.props, _ = e.type;
  if (_ == "svg" ? o = "http://www.w3.org/2000/svg" : _ == "math" ? o = "http://www.w3.org/1998/Math/MathML" : o || (o = "http://www.w3.org/1999/xhtml"), i != null) {
    for (u = 0; u < i.length; u++) if ((p = i[u]) && "setAttribute" in p == !!_ && (_ ? p.localName == _ : p.nodeType == 3)) {
      r = p, i[u] = null;
      break;
    }
  }
  if (r == null) {
    if (_ == null) return document.createTextNode(y);
    r = document.createElementNS(o, _, y.is && y), s && (F.__m && F.__m(e, i), s = !1), i = null;
  }
  if (_ == null) g === y || s && r.data == y || (r.data = y);
  else {
    if (i = _ == "textarea" && y.defaultValue != null ? null : i && fo.call(r.childNodes), !s && i != null) for (g = {}, u = 0; u < r.attributes.length; u++) g[(p = r.attributes[u]).name] = p.value;
    for (u in g) p = g[u], u == "dangerouslySetInnerHTML" ? f = p : u == "children" || u in y || u == "value" && "defaultValue" in y || u == "checked" && "defaultChecked" in y || un(r, u, null, p, o);
    for (u in y) p = y[u], u == "children" ? c = p : u == "dangerouslySetInnerHTML" ? d = p : u == "value" ? h = p : u == "checked" ? v = p : s && typeof p != "function" || g[u] === p || un(r, u, p, g[u], o);
    if (d) s || f && (d.__html == f.__html || d.__html == r.innerHTML) || (r.innerHTML = d.__html), e.__k = [];
    else if (f && (r.innerHTML = ""), Ws(e.type == "template" ? r.content : r, tn(c) ? c : [c], e, t, n, _ == "foreignObject" ? "http://www.w3.org/1999/xhtml" : o, i, a, i ? i[0] : t.__k && Bt(t, 0), s, l), i != null) for (u = i.length; u--; ) Mi(i[u]);
    s && _ != "textarea" || (u = "value", _ == "progress" && h == null ? r.removeAttribute("value") : h != null && (h !== r[u] || _ == "progress" && !h || _ == "option" && h != g[u]) && un(r, u, h, g[u], o), u = "checked", v != null && v != r[u] && un(r, u, v, g[u], o));
  }
  return r;
}
function Ti(r, e, t) {
  try {
    if (typeof r == "function") {
      var n = typeof r.__u == "function";
      n && r.__u(), n && e == null || (r.__u = r(e));
    } else r.current = e;
  } catch (o) {
    F.__e(o, t);
  }
}
function Qs(r, e, t) {
  var n, o;
  if (F.unmount && F.unmount(r), (n = r.ref) && (n.current && n.current != r.__e || Ti(n, null, e)), (n = r.__c) != null) {
    if (n.componentWillUnmount) try {
      n.componentWillUnmount();
    } catch (i) {
      F.__e(i, e);
    }
    n.base = n.__P = n.__n = null;
  }
  if (n = r.__k) for (o = 0; o < n.length; o++) n[o] && Qs(n[o], e, t || typeof r.type != "function");
  t || Mi(r.__e), r.__c = r.__ = r.__e = void 0;
}
function $u(r, e, t) {
  return this.constructor(r, t);
}
function Wu(r, e, t) {
  var n, o, i, a;
  e == document && (e = document.documentElement), F.__ && F.__(r, e), o = (n = !1) ? null : e.__k, i = [], a = [], Di(e, r = e.__k = ur(dr, null, [r]), o || In, In, e.namespaceURI, o ? null : e.firstChild ? fo.call(e.childNodes) : null, i, o ? o.__e : e.firstChild, n, a), qs(i, r, a), r.props.children = null;
}
fo = kn.slice, F = { __e: function(r, e, t, n) {
  for (var o, i, a; e = e.__; ) if ((o = e.__c) && !o.__) try {
    if ((i = o.constructor) && i.getDerivedStateFromError != null && (o.setState(i.getDerivedStateFromError(r)), a = o.__d), o.componentDidCatch != null && (o.componentDidCatch(r, n || {}), a = o.__d), a) return o.__E = o;
  } catch (s) {
    r = s;
  }
  throw r;
} }, Gs = 0, $.prototype.setState = function(r, e) {
  var t;
  t = this.__s != null && this.__s != this.state ? this.__s : this.__s = ct({}, this.state), typeof r == "function" && (r = r(ct({}, t), this.props)), r && ct(t, r), r != null && this.__v && (e && this._sb.push(e), qi(this));
}, $.prototype.forceUpdate = function(r) {
  this.__v && (this.__e = !0, r && this.__h.push(r), qi(this));
}, $.prototype.render = dr, yt = [], zs = typeof Promise == "function" ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, Us = function(r, e) {
  return r.__v.__b - e.__v.__b;
}, Bn.__r = 0, wo = Math.random().toString(8), Nn = "__d" + wo, Lr = "__a" + wo, Vs = /(PointerCapture)$|Capture$/i, Ai = 0, zo = Qi(!1), Uo = Qi(!0);
var Ku = "An invariant failed, however the error is obfuscated because this is a production build.", Yn = [];
Object.freeze(Yn);
var Ni = {};
Object.freeze(Ni);
function De() {
  return ++T.mobxGuid;
}
function X(r) {
  throw le(!1, r), "X";
}
function le(r, e) {
  if (!r)
    throw new Error("[mobx] " + (e || Ku));
}
var ea = [];
function Zu(r, e) {
  return process.env.NODE_ENV === "production" || ea.indexOf(r) !== -1 ? !1 : (ea.push(r), console.error("[mobx] Deprecated: " + r), !0);
}
function Ci(r) {
  var e = !1;
  return function() {
    if (!e)
      return e = !0, r.apply(this, arguments);
  };
}
var dn = function() {
};
function qu(r) {
  var e = [];
  return r.forEach(function(t) {
    e.indexOf(t) === -1 && e.push(t);
  }), e;
}
function Li(r) {
  return r !== null && typeof r == "object";
}
function Ft(r) {
  if (r === null || typeof r != "object")
    return !1;
  var e = Object.getPrototypeOf(r);
  return e === Object.prototype || e === null;
}
function Ju(r) {
  if (Er(r) || Pe(r))
    return r;
  if (Array.isArray(r))
    return new Map(r);
  if (Ft(r)) {
    var e = /* @__PURE__ */ new Map();
    for (var t in r)
      e.set(t, r[t]);
    return e;
  } else
    return X("Cannot convert to map from '" + r + "'");
}
function xr(r, e, t) {
  Object.defineProperty(r, e, {
    enumerable: !1,
    writable: !0,
    configurable: !0,
    value: t
  });
}
function Qu(r, e, t) {
  Object.defineProperty(r, e, {
    enumerable: !1,
    writable: !1,
    configurable: !0,
    value: t
  });
}
function el(r, e) {
  var t = Object.getOwnPropertyDescriptor(r, e);
  return !t || t.configurable !== !1 && t.writable !== !1;
}
function ed(r, e) {
  process.env.NODE_ENV !== "production" && !el(r, e) && X("Cannot make property '" + e.toString() + "' observable, it is not configurable and writable in the target object");
}
function At(r, e) {
  var t = "isMobX" + r;
  return e.prototype[t] = !0, function(n) {
    return Li(n) && n[t] === !0;
  };
}
function Er(r) {
  return r instanceof Map;
}
function rn(r) {
  return r instanceof Set;
}
function ji(r) {
  var e = /* @__PURE__ */ new Set();
  for (var t in r)
    e.add(t);
  return Object.getOwnPropertySymbols(r).forEach(function(n) {
    Object.getOwnPropertyDescriptor(r, n).enumerable && e.add(n);
  }), Array.from(e);
}
function ke(r) {
  return r && r.toString ? r.toString() : new String(r).toString();
}
function tl(r) {
  return r === null ? null : typeof r == "object" ? "" + r : r;
}
var td = typeof Reflect < "u" && Reflect.ownKeys ? Reflect.ownKeys : Object.getOwnPropertySymbols ? function(r) {
  return Object.getOwnPropertyNames(r).concat(Object.getOwnPropertySymbols(r));
} : (
  /* istanbul ignore next */
  Object.getOwnPropertyNames
), B = /* @__PURE__ */ Symbol("mobx administration"), br = (
  /** @class */
  (function() {
    function r(e) {
      e === void 0 && (e = "Atom@" + De()), this.name = e, this.isPendingUnobservation = !1, this.isBeingObserved = !1, this.observers = /* @__PURE__ */ new Set(), this.diffValue = 0, this.lastAccessedBy = 0, this.lowestObserverState = Q.NOT_TRACKING;
    }
    return r.prototype.onBecomeObserved = function() {
      this.onBecomeObservedListeners && this.onBecomeObservedListeners.forEach(function(e) {
        return e();
      });
    }, r.prototype.onBecomeUnobserved = function() {
      this.onBecomeUnobservedListeners && this.onBecomeUnobservedListeners.forEach(function(e) {
        return e();
      });
    }, r.prototype.reportObserved = function() {
      return cl(this);
    }, r.prototype.reportChanged = function() {
      Ze(), Ad(this), qe();
    }, r.prototype.toString = function() {
      return this.name;
    }, r;
  })()
), Ri = At("Atom", br);
function Ii(r, e, t) {
  e === void 0 && (e = dn), t === void 0 && (t = dn);
  var n = new br(r);
  return e !== dn && Fd(n, e), t !== dn && _l(n, t), n;
}
function rd(r, e) {
  return Dl(r, e);
}
function nd(r, e) {
  return Object.is(r, e);
}
var fr = {
  structural: rd,
  default: nd
};
var Vo = function(r, e) {
  return Vo = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(t, n) {
    t.__proto__ = n;
  } || function(t, n) {
    for (var o in n) n.hasOwnProperty(o) && (t[o] = n[o]);
  }, Vo(r, e);
};
function od(r, e) {
  Vo(r, e);
  function t() {
    this.constructor = r;
  }
  r.prototype = e === null ? Object.create(e) : (t.prototype = e.prototype, new t());
}
var ie = function() {
  return ie = Object.assign || function(e) {
    for (var t, n = 1, o = arguments.length; n < o; n++) {
      t = arguments[n];
      for (var i in t) Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
    }
    return e;
  }, ie.apply(this, arguments);
};
function Ve(r) {
  var e = typeof Symbol == "function" && r[Symbol.iterator], t = 0;
  return e ? e.call(r) : {
    next: function() {
      return r && t >= r.length && (r = void 0), { value: r && r[t++], done: !r };
    }
  };
}
function tr(r, e) {
  var t = typeof Symbol == "function" && r[Symbol.iterator];
  if (!t) return r;
  var n = t.call(r), o, i = [], a;
  try {
    for (; (e === void 0 || e-- > 0) && !(o = n.next()).done; ) i.push(o.value);
  } catch (s) {
    a = { error: s };
  } finally {
    try {
      o && !o.done && (t = n.return) && t.call(n);
    } finally {
      if (a) throw a.error;
    }
  }
  return i;
}
function ki() {
  for (var r = [], e = 0; e < arguments.length; e++)
    r = r.concat(tr(arguments[e]));
  return r;
}
var Fn = /* @__PURE__ */ Symbol("mobx did run lazy initializers"), Pr = /* @__PURE__ */ Symbol("mobx pending decorators"), id = {}, ad = {};
function sd(r, e) {
  var t = e ? id : ad;
  return t[r] || (t[r] = {
    configurable: !0,
    enumerable: e,
    get: function() {
      return Xt(this), this[r];
    },
    set: function(n) {
      Xt(this), this[r] = n;
    }
  });
}
function Xt(r) {
  var e, t;
  if (r[Fn] !== !0) {
    var n = r[Pr];
    if (n) {
      xr(r, Fn, !0);
      var o = ki(Object.getOwnPropertySymbols(n), Object.keys(n));
      try {
        for (var i = Ve(o), a = i.next(); !a.done; a = i.next()) {
          var s = a.value, l = n[s];
          l.propertyCreator(r, l.prop, l.descriptor, l.decoratorTarget, l.decoratorArguments);
        }
      } catch (u) {
        e = { error: u };
      } finally {
        try {
          a && !a.done && (t = i.return) && t.call(i);
        } finally {
          if (e) throw e.error;
        }
      }
    }
  }
}
function rl(r, e) {
  return function() {
    var n, o = function(a, s, l, u) {
      if (u === !0)
        return e(a, s, l, a, n), null;
      if (process.env.NODE_ENV !== "production" && !ta(arguments) && X("This function is a decorator, but it wasn't invoked like a decorator"), !Object.prototype.hasOwnProperty.call(a, Pr)) {
        var d = a[Pr];
        xr(a, Pr, ie({}, d));
      }
      return a[Pr][s] = {
        prop: s,
        propertyCreator: e,
        descriptor: l,
        decoratorTarget: a,
        decoratorArguments: n
      }, sd(s, r);
    };
    return ta(arguments) ? (n = Yn, o.apply(null, arguments)) : (n = Array.prototype.slice.call(arguments), o);
  };
}
function ta(r) {
  return (r.length === 2 || r.length === 3) && (typeof r[1] == "string" || typeof r[1] == "symbol") || r.length === 4 && r[3] === !0;
}
function nn(r, e, t) {
  return bt(r) ? r : Array.isArray(r) ? M.array(r, { name: t }) : Ft(r) ? M.object(r, void 0, { name: t }) : Er(r) ? M.map(r, { name: t }) : rn(r) ? M.set(r, { name: t }) : r;
}
function ld(r, e, t) {
  return r == null || et(r) || lt(r) || Pe(r) || Ye(r) ? r : Array.isArray(r) ? M.array(r, { name: t, deep: !1 }) : Ft(r) ? M.object(r, void 0, { name: t, deep: !1 }) : Er(r) ? M.map(r, { name: t, deep: !1 }) : rn(r) ? M.set(r, { name: t, deep: !1 }) : X(process.env.NODE_ENV !== "production" && "The shallow modifier / decorator can only used in combination with arrays, objects, maps and sets");
}
function co(r) {
  return r;
}
function ud(r, e, t) {
  if (process.env.NODE_ENV !== "production" && bt(r))
    throw "observable.struct should not be used with observable values";
  return Dl(r, e) ? e : r;
}
function po(r) {
  le(r);
  var e = rl(!0, function(n, o, i, a, s) {
    process.env.NODE_ENV !== "production" && le(!i || !i.get, '@observable cannot be used on getter (property "' + ke(o) + '"), use @computed instead.');
    var l = i ? i.initializer ? i.initializer.call(n) : i.value : void 0;
    Hi(n).addObservableProp(o, l, r);
  }), t = (
    // Extra process checks, as this happens during module initialization
    typeof process < "u" && process.env && process.env.NODE_ENV !== "production" ? function() {
      return arguments.length < 2 ? X("Incorrect decorator invocation. @observable decorator doesn't expect any arguments") : e.apply(null, arguments);
    } : e
  );
  return t.enhancer = r, t;
}
var nl = {
  deep: !0,
  name: void 0,
  defaultDecorator: void 0,
  proxy: !0
};
Object.freeze(nl);
function dd(r) {
  /^(deep|name|equals|defaultDecorator|proxy)$/.test(r) || X("invalid option for (extend)observable: " + r);
}
function Qt(r) {
  if (r == null)
    return nl;
  if (typeof r == "string")
    return { name: r, deep: !0, proxy: !0 };
  if (process.env.NODE_ENV !== "production") {
    if (typeof r != "object")
      return X("expected options object");
    Object.keys(r).forEach(dd);
  }
  return r;
}
var Bi = po(nn), fd = po(ld), ol = po(co), cd = po(ud);
function fn(r) {
  return r.defaultDecorator ? r.defaultDecorator.enhancer : r.deep === !1 ? co : nn;
}
function pd(r, e, t) {
  if (typeof arguments[1] == "string" || typeof arguments[1] == "symbol")
    return Bi.apply(null, arguments);
  if (bt(r))
    return r;
  var n = Ft(r) ? M.object(r, e, t) : Array.isArray(r) ? M.array(r, e) : Er(r) ? M.map(r, e) : rn(r) ? M.set(r, e) : r;
  if (n !== r)
    return n;
  X(process.env.NODE_ENV !== "production" && "The provided value could not be converted into an observable. If you want just create an observable reference to the object use 'observable.box(value)'");
}
var ra = {
  box: function(r, e) {
    arguments.length > 2 && Sr("box");
    var t = Qt(e);
    return new Rt(r, fn(t), t.name, !0, t.equals);
  },
  array: function(r, e) {
    arguments.length > 2 && Sr("array");
    var t = Qt(e);
    return tf(r, fn(t), t.name);
  },
  map: function(r, e) {
    arguments.length > 2 && Sr("map");
    var t = Qt(e);
    return new Fi(r, fn(t), t.name);
  },
  set: function(r, e) {
    arguments.length > 2 && Sr("set");
    var t = Qt(e);
    return new Ml(r, fn(t), t.name);
  },
  object: function(r, e, t) {
    typeof arguments[1] == "string" && Sr("object");
    var n = Qt(t);
    if (n.proxy === !1)
      return qo({}, r, e, n);
    var o = xl(n), i = qo({}, void 0, void 0, n), a = Jd(i);
    return El(a, r, e, o), a;
  },
  ref: ol,
  shallow: fd,
  deep: Bi,
  struct: cd
}, M = pd;
Object.keys(ra).forEach(function(r) {
  return M[r] = ra[r];
});
function Sr(r) {
  X(
    // process.env.NODE_ENV !== "production" &&
    "Expected one or two arguments to observable." + r + ". Did you accidentally try to use observable." + r + " as decorator?"
  );
}
var Hn = rl(!1, function(r, e, t, n, o) {
  process.env.NODE_ENV !== "production" && le(t && t.get, "Trying to declare a computed value for unspecified getter '" + ke(e) + "'");
  var i = t.get, a = t.set, s = o[0] || {};
  Hi(r).addComputedProp(r, e, ie({
    get: i,
    set: a,
    context: r
  }, s));
}), hd = Hn({ equals: fr.structural }), te = function(e, t, n) {
  if (typeof t == "string" || e !== null && typeof e == "object" && arguments.length === 1)
    return Hn.apply(null, arguments);
  process.env.NODE_ENV !== "production" && (le(typeof e == "function", "First argument to `computed` should be an expression."), le(arguments.length < 3, "Computed takes one or two arguments if used as function"));
  var o = typeof t == "object" ? t : {};
  return o.get = e, o.set = typeof t == "function" ? t : o.set, o.name = o.name || e.name || "", new pr(o);
};
te.struct = hd;
var Q;
(function(r) {
  r[r.NOT_TRACKING = -1] = "NOT_TRACKING", r[r.UP_TO_DATE = 0] = "UP_TO_DATE", r[r.POSSIBLY_STALE = 1] = "POSSIBLY_STALE", r[r.STALE = 2] = "STALE";
})(Q || (Q = {}));
var Ke;
(function(r) {
  r[r.NONE = 0] = "NONE", r[r.LOG = 1] = "LOG", r[r.BREAK = 2] = "BREAK";
})(Ke || (Ke = {}));
var Gn = (
  /** @class */
  /* @__PURE__ */ (function() {
    function r(e) {
      this.cause = e;
    }
    return r;
  })()
);
function Dr(r) {
  return r instanceof Gn;
}
function $o(r) {
  switch (r.dependenciesState) {
    case Q.UP_TO_DATE:
      return !1;
    case Q.NOT_TRACKING:
    case Q.STALE:
      return !0;
    case Q.POSSIBLY_STALE: {
      for (var e = Xi(!0), t = Or(), n = r.observing, o = n.length, i = 0; i < o; i++) {
        var a = n[i];
        if (hr(a)) {
          if (T.disableErrorBoundaries)
            a.get();
          else
            try {
              a.get();
            } catch {
              return xt(t), jr(e), !0;
            }
          if (r.dependenciesState === Q.STALE)
            return xt(t), jr(e), !0;
        }
      }
      return sl(r), xt(t), jr(e), !1;
    }
  }
}
function cr(r) {
  var e = r.observers.size > 0;
  T.computationDepth > 0 && e && X(process.env.NODE_ENV !== "production" && "Computed values are not allowed to cause side effects by changing observables that are already being observed. Tried to modify: " + r.name), !T.allowStateChanges && (e || T.enforceActions === "strict") && X(process.env.NODE_ENV !== "production" && (T.enforceActions ? "Since strict-mode is enabled, changing observed observable values outside actions is not allowed. Please wrap the code in an `action` if this change is intended. Tried to modify: " : "Side effects like changing state are not allowed at this point. Are you trying to modify state from, for example, the render function of a React component? Tried to modify: ") + r.name);
}
function vd(r) {
  process.env.NODE_ENV !== "production" && !T.allowStateReads && T.observableRequiresReaction && console.warn("[mobx] Observable " + r.name + " being read outside a reactive context");
}
function il(r, e, t) {
  var n = Xi(!0);
  sl(r), r.newObserving = new Array(r.observing.length + 100), r.unboundDepsCount = 0, r.runId = ++T.runId;
  var o = T.trackingDerivation;
  T.trackingDerivation = r;
  var i;
  if (T.disableErrorBoundaries === !0)
    i = e.call(t);
  else
    try {
      i = e.call(t);
    } catch (a) {
      i = new Gn(a);
    }
  return T.trackingDerivation = o, gd(r), yd(r), jr(n), i;
}
function yd(r) {
  process.env.NODE_ENV !== "production" && r.observing.length === 0 && (T.reactionRequiresObservable || r.requiresObservable) && console.warn("[mobx] Derivation " + r.name + " is created/updated without reading any observable value");
}
function gd(r) {
  for (var e = r.observing, t = r.observing = r.newObserving, n = Q.UP_TO_DATE, o = 0, i = r.unboundDepsCount, a = 0; a < i; a++) {
    var s = t[a];
    s.diffValue === 0 && (s.diffValue = 1, o !== a && (t[o] = s), o++), s.dependenciesState > n && (n = s.dependenciesState);
  }
  for (t.length = o, r.newObserving = null, i = e.length; i--; ) {
    var s = e[i];
    s.diffValue === 0 && dl(s, r), s.diffValue = 0;
  }
  for (; o--; ) {
    var s = t[o];
    s.diffValue === 1 && (s.diffValue = 0, Sd(s, r));
  }
  n !== Q.UP_TO_DATE && (r.dependenciesState = n, r.onBecomeStale());
}
function Wo(r) {
  var e = r.observing;
  r.observing = [];
  for (var t = e.length; t--; )
    dl(e[t], r);
  r.dependenciesState = Q.NOT_TRACKING;
}
function al(r) {
  var e = Or();
  try {
    return r();
  } finally {
    xt(e);
  }
}
function Or() {
  var r = T.trackingDerivation;
  return T.trackingDerivation = null, r;
}
function xt(r) {
  T.trackingDerivation = r;
}
function Xi(r) {
  var e = T.allowStateReads;
  return T.allowStateReads = r, e;
}
function jr(r) {
  T.allowStateReads = r;
}
function sl(r) {
  if (r.dependenciesState !== Q.UP_TO_DATE) {
    r.dependenciesState = Q.UP_TO_DATE;
    for (var e = r.observing, t = e.length; t--; )
      e[t].lowestObserverState = Q.UP_TO_DATE;
  }
}
var zn = 0, _d = 1, na = Object.getOwnPropertyDescriptor(function() {
}, "name"), md = na && na.configurable;
function jt(r, e, t) {
  process.env.NODE_ENV !== "production" && (le(typeof e == "function", "`action` can only be invoked on functions"), (typeof r != "string" || !r) && X("actions should have valid names, got: '" + r + "'"));
  var n = function() {
    return ll(r, e, t || this, arguments);
  };
  return n.isMobxAction = !0, process.env.NODE_ENV !== "production" && md && Object.defineProperty(n, "name", { value: r }), n;
}
function ll(r, e, t, n) {
  var o = xd(r, t, n);
  try {
    return e.apply(t, n);
  } catch (i) {
    throw o.error = i, i;
  } finally {
    Ed(o);
  }
}
function xd(r, e, t) {
  var n = be() && !!r, o = 0;
  if (n && process.env.NODE_ENV !== "production") {
    o = Date.now();
    var i = t && t.length || 0, a = new Array(i);
    if (i > 0)
      for (var s = 0; s < i; s++)
        a[s] = t[s];
    Ce({
      type: "action",
      name: r,
      object: e,
      arguments: a
    });
  }
  var l = Or();
  Ze();
  var u = ho(!0), d = Xi(!0), f = {
    prevDerivation: l,
    prevAllowStateChanges: u,
    prevAllowStateReads: d,
    notifySpy: n,
    startTime: o,
    actionId: _d++,
    parentActionId: zn
  };
  return zn = f.actionId, f;
}
function Ed(r) {
  zn !== r.actionId && X("invalid action stack. did you forget to finish an action?"), zn = r.parentActionId, r.error !== void 0 && (T.suppressReactionErrors = !0), vo(r.prevAllowStateChanges), jr(r.prevAllowStateReads), qe(), xt(r.prevDerivation), r.notifySpy && process.env.NODE_ENV !== "production" && Le({ time: Date.now() - r.startTime }), T.suppressReactionErrors = !1;
}
function ho(r) {
  var e = T.allowStateChanges;
  return T.allowStateChanges = r, e;
}
function vo(r) {
  T.allowStateChanges = r;
}
var Rt = (
  /** @class */
  (function(r) {
    od(e, r);
    function e(t, n, o, i, a) {
      o === void 0 && (o = "ObservableValue@" + De()), i === void 0 && (i = !0), a === void 0 && (a = fr.default);
      var s = r.call(this, o) || this;
      return s.enhancer = n, s.name = o, s.equals = a, s.hasUnreportedChange = !1, s.value = n(t, void 0, o), i && be() && process.env.NODE_ENV !== "production" && Yt({ type: "create", name: s.name, newValue: "" + s.value }), s;
    }
    return e.prototype.dehanceValue = function(t) {
      return this.dehancer !== void 0 ? this.dehancer(t) : t;
    }, e.prototype.set = function(t) {
      var n = this.value;
      if (t = this.prepareNewValue(t), t !== T.UNCHANGED) {
        var o = be();
        o && process.env.NODE_ENV !== "production" && Ce({
          type: "update",
          name: this.name,
          newValue: t,
          oldValue: n
        }), this.setNewValue(t), o && process.env.NODE_ENV !== "production" && Le();
      }
    }, e.prototype.prepareNewValue = function(t) {
      if (cr(this), at(this)) {
        var n = st(this, {
          object: this,
          type: "update",
          newValue: t
        });
        if (!n)
          return T.UNCHANGED;
        t = n.newValue;
      }
      return t = this.enhancer(t, this.value, this.name), this.equals(this.value, t) ? T.UNCHANGED : t;
    }, e.prototype.setNewValue = function(t) {
      var n = this.value;
      this.value = t, this.reportChanged(), Je(this) && Qe(this, {
        type: "update",
        object: this,
        newValue: t,
        oldValue: n
      });
    }, e.prototype.get = function() {
      return this.reportObserved(), this.dehanceValue(this.value);
    }, e.prototype.intercept = function(t) {
      return on(this, t);
    }, e.prototype.observe = function(t, n) {
      return n && t({
        object: this,
        type: "update",
        newValue: this.value,
        oldValue: void 0
      }), an(this, t);
    }, e.prototype.toJSON = function() {
      return this.get();
    }, e.prototype.toString = function() {
      return this.name + "[" + this.value + "]";
    }, e.prototype.valueOf = function() {
      return tl(this.get());
    }, e.prototype[Symbol.toPrimitive] = function() {
      return this.valueOf();
    }, e;
  })(br)
), bd = At("ObservableValue", Rt), pr = (
  /** @class */
  (function() {
    function r(e) {
      this.dependenciesState = Q.NOT_TRACKING, this.observing = [], this.newObserving = null, this.isBeingObserved = !1, this.isPendingUnobservation = !1, this.observers = /* @__PURE__ */ new Set(), this.diffValue = 0, this.runId = 0, this.lastAccessedBy = 0, this.lowestObserverState = Q.UP_TO_DATE, this.unboundDepsCount = 0, this.__mapid = "#" + De(), this.value = new Gn(null), this.isComputing = !1, this.isRunningSetter = !1, this.isTracing = Ke.NONE, le(e.get, "missing option for computed: get"), this.derivation = e.get, this.name = e.name || "ComputedValue@" + De(), e.set && (this.setter = jt(this.name + "-setter", e.set)), this.equals = e.equals || (e.compareStructural || e.struct ? fr.structural : fr.default), this.scope = e.context, this.requiresReaction = !!e.requiresReaction, this.keepAlive = !!e.keepAlive;
    }
    return r.prototype.onBecomeStale = function() {
      Pd(this);
    }, r.prototype.onBecomeObserved = function() {
      this.onBecomeObservedListeners && this.onBecomeObservedListeners.forEach(function(e) {
        return e();
      });
    }, r.prototype.onBecomeUnobserved = function() {
      this.onBecomeUnobservedListeners && this.onBecomeUnobservedListeners.forEach(function(e) {
        return e();
      });
    }, r.prototype.get = function() {
      this.isComputing && X("Cycle detected in computation " + this.name + ": " + this.derivation), T.inBatch === 0 && this.observers.size === 0 && !this.keepAlive ? $o(this) && (this.warnAboutUntrackedRead(), Ze(), this.value = this.computeValue(!1), qe()) : (cl(this), $o(this) && this.trackAndCompute() && Md(this));
      var e = this.value;
      if (Dr(e))
        throw e.cause;
      return e;
    }, r.prototype.peek = function() {
      var e = this.computeValue(!1);
      if (Dr(e))
        throw e.cause;
      return e;
    }, r.prototype.set = function(e) {
      if (this.setter) {
        le(!this.isRunningSetter, "The setter of computed value '" + this.name + "' is trying to update itself. Did you intend to update an _observable_ value, instead of the computed property?"), this.isRunningSetter = !0;
        try {
          this.setter.call(this.scope, e);
        } finally {
          this.isRunningSetter = !1;
        }
      } else
        le(!1, process.env.NODE_ENV !== "production" && "[ComputedValue '" + this.name + "'] It is not possible to assign a new value to a computed value.");
    }, r.prototype.trackAndCompute = function() {
      be() && process.env.NODE_ENV !== "production" && Yt({
        object: this.scope,
        type: "compute",
        name: this.name
      });
      var e = this.value, t = (
        /* see #1208 */
        this.dependenciesState === Q.NOT_TRACKING
      ), n = this.computeValue(!0), o = t || Dr(e) || Dr(n) || !this.equals(e, n);
      return o && (this.value = n), o;
    }, r.prototype.computeValue = function(e) {
      this.isComputing = !0, T.computationDepth++;
      var t;
      if (e)
        t = il(this, this.derivation, this.scope);
      else if (T.disableErrorBoundaries === !0)
        t = this.derivation.call(this.scope);
      else
        try {
          t = this.derivation.call(this.scope);
        } catch (n) {
          t = new Gn(n);
        }
      return T.computationDepth--, this.isComputing = !1, t;
    }, r.prototype.suspend = function() {
      this.keepAlive || (Wo(this), this.value = void 0);
    }, r.prototype.observe = function(e, t) {
      var n = this, o = !0, i = void 0;
      return Bd(function() {
        var a = n.get();
        if (!o || t) {
          var s = Or();
          e({
            type: "update",
            object: n,
            newValue: a,
            oldValue: i
          }), xt(s);
        }
        o = !1, i = a;
      });
    }, r.prototype.warnAboutUntrackedRead = function() {
      process.env.NODE_ENV !== "production" && (this.requiresReaction === !0 && X("[mobx] Computed value " + this.name + " is read outside a reactive context"), this.isTracing !== Ke.NONE && console.log("[mobx.trace] '" + this.name + "' is being read outside a reactive context. Doing a full recompute"), T.computedRequiresReaction && console.warn("[mobx] Computed value " + this.name + " is being read outside a reactive context. Doing a full recompute"));
    }, r.prototype.toJSON = function() {
      return this.get();
    }, r.prototype.toString = function() {
      return this.name + "[" + this.derivation.toString() + "]";
    }, r.prototype.valueOf = function() {
      return tl(this.get());
    }, r.prototype[Symbol.toPrimitive] = function() {
      return this.valueOf();
    }, r;
  })()
), hr = At("ComputedValue", pr), Ln = (
  /** @class */
  /* @__PURE__ */ (function() {
    function r() {
      this.version = 5, this.UNCHANGED = {}, this.trackingDerivation = null, this.computationDepth = 0, this.runId = 0, this.mobxGuid = 0, this.inBatch = 0, this.pendingUnobservations = [], this.pendingReactions = [], this.isRunningReactions = !1, this.allowStateChanges = !0, this.allowStateReads = !0, this.enforceActions = !1, this.spyListeners = [], this.globalReactionErrorHandlers = [], this.computedRequiresReaction = !1, this.reactionRequiresObservable = !1, this.observableRequiresReaction = !1, this.computedConfigurable = !1, this.disableErrorBoundaries = !1, this.suppressReactionErrors = !1;
    }
    return r;
  })()
), Od = {};
function Un() {
  return typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : Od;
}
var jn = !0, ul = !1, T = (function() {
  var r = Un();
  return r.__mobxInstanceCount > 0 && !r.__mobxGlobals && (jn = !1), r.__mobxGlobals && r.__mobxGlobals.version !== new Ln().version && (jn = !1), jn ? r.__mobxGlobals ? (r.__mobxInstanceCount += 1, r.__mobxGlobals.UNCHANGED || (r.__mobxGlobals.UNCHANGED = {}), r.__mobxGlobals) : (r.__mobxInstanceCount = 1, r.__mobxGlobals = new Ln()) : (setTimeout(function() {
    ul || X("There are multiple, different versions of MobX active. Make sure MobX is loaded only once or use `configure({ isolateGlobalState: true })`");
  }, 1), new Ln());
})();
function wd() {
  (T.pendingReactions.length || T.inBatch || T.isRunningReactions) && X("isolateGlobalState should be called before MobX is running any reactions"), ul = !0, jn && (--Un().__mobxInstanceCount === 0 && (Un().__mobxGlobals = void 0), T = new Ln());
}
function Ko() {
  return T;
}
function Sd(r, e) {
  r.observers.add(e), r.lowestObserverState > e.dependenciesState && (r.lowestObserverState = e.dependenciesState);
}
function dl(r, e) {
  r.observers.delete(e), r.observers.size === 0 && fl(r);
}
function fl(r) {
  r.isPendingUnobservation === !1 && (r.isPendingUnobservation = !0, T.pendingUnobservations.push(r));
}
function Ze() {
  T.inBatch++;
}
function qe() {
  if (--T.inBatch === 0) {
    vl();
    for (var r = T.pendingUnobservations, e = 0; e < r.length; e++) {
      var t = r[e];
      t.isPendingUnobservation = !1, t.observers.size === 0 && (t.isBeingObserved && (t.isBeingObserved = !1, t.onBecomeUnobserved()), t instanceof pr && t.suspend());
    }
    T.pendingUnobservations = [];
  }
}
function cl(r) {
  vd(r);
  var e = T.trackingDerivation;
  return e !== null ? (e.runId !== r.lastAccessedBy && (r.lastAccessedBy = e.runId, e.newObserving[e.unboundDepsCount++] = r, r.isBeingObserved || (r.isBeingObserved = !0, r.onBecomeObserved())), !0) : (r.observers.size === 0 && T.inBatch > 0 && fl(r), !1);
}
function Ad(r) {
  r.lowestObserverState !== Q.STALE && (r.lowestObserverState = Q.STALE, r.observers.forEach(function(e) {
    e.dependenciesState === Q.UP_TO_DATE && (e.isTracing !== Ke.NONE && pl(e, r), e.onBecomeStale()), e.dependenciesState = Q.STALE;
  }));
}
function Md(r) {
  r.lowestObserverState !== Q.STALE && (r.lowestObserverState = Q.STALE, r.observers.forEach(function(e) {
    e.dependenciesState === Q.POSSIBLY_STALE ? e.dependenciesState = Q.STALE : e.dependenciesState === Q.UP_TO_DATE && (r.lowestObserverState = Q.UP_TO_DATE);
  }));
}
function Pd(r) {
  r.lowestObserverState === Q.UP_TO_DATE && (r.lowestObserverState = Q.POSSIBLY_STALE, r.observers.forEach(function(e) {
    e.dependenciesState === Q.UP_TO_DATE && (e.dependenciesState = Q.POSSIBLY_STALE, e.isTracing !== Ke.NONE && pl(e, r), e.onBecomeStale());
  }));
}
function pl(r, e) {
  if (console.log("[mobx.trace] '" + r.name + "' is invalidated due to a change in: '" + e.name + "'"), r.isTracing === Ke.BREAK) {
    var t = [];
    hl(Gd(r), t, 1), new Function(`debugger;
/*
Tracing '` + r.name + `'

You are entering this break point because derivation '` + r.name + "' is being traced and '" + e.name + `' is now forcing it to update.
Just follow the stacktrace you should now see in the devtools to see precisely what piece of your code is causing this update
The stackframe you are looking for is at least ~6-8 stack-frames up.

` + (r instanceof pr ? r.derivation.toString().replace(/[*]\//g, "/") : "") + `

The dependencies for this derivation are:

` + t.join(`
`) + `
*/
    `)();
  }
}
function hl(r, e, t) {
  if (e.length >= 1e3) {
    e.push("(and many more)");
    return;
  }
  e.push("" + new Array(t).join("	") + r.name), r.dependencies && r.dependencies.forEach(function(n) {
    return hl(n, e, t + 1);
  });
}
var Vr = (
  /** @class */
  (function() {
    function r(e, t, n, o) {
      e === void 0 && (e = "Reaction@" + De()), o === void 0 && (o = !1), this.name = e, this.onInvalidate = t, this.errorHandler = n, this.requiresObservable = o, this.observing = [], this.newObserving = [], this.dependenciesState = Q.NOT_TRACKING, this.diffValue = 0, this.runId = 0, this.unboundDepsCount = 0, this.__mapid = "#" + De(), this.isDisposed = !1, this._isScheduled = !1, this._isTrackPending = !1, this._isRunning = !1, this.isTracing = Ke.NONE;
    }
    return r.prototype.onBecomeStale = function() {
      this.schedule();
    }, r.prototype.schedule = function() {
      this._isScheduled || (this._isScheduled = !0, T.pendingReactions.push(this), vl());
    }, r.prototype.isScheduled = function() {
      return this._isScheduled;
    }, r.prototype.runReaction = function() {
      if (!this.isDisposed) {
        if (Ze(), this._isScheduled = !1, $o(this)) {
          this._isTrackPending = !0;
          try {
            this.onInvalidate(), this._isTrackPending && be() && process.env.NODE_ENV !== "production" && Yt({
              name: this.name,
              type: "scheduled-reaction"
            });
          } catch (e) {
            this.reportExceptionInDerivation(e);
          }
        }
        qe();
      }
    }, r.prototype.track = function(e) {
      if (!this.isDisposed) {
        Ze();
        var t = be(), n;
        t && process.env.NODE_ENV !== "production" && (n = Date.now(), Ce({
          name: this.name,
          type: "reaction"
        })), this._isRunning = !0;
        var o = il(this, e, void 0);
        this._isRunning = !1, this._isTrackPending = !1, this.isDisposed && Wo(this), Dr(o) && this.reportExceptionInDerivation(o.cause), t && process.env.NODE_ENV !== "production" && Le({
          time: Date.now() - n
        }), qe();
      }
    }, r.prototype.reportExceptionInDerivation = function(e) {
      var t = this;
      if (this.errorHandler) {
        this.errorHandler(e, this);
        return;
      }
      if (T.disableErrorBoundaries)
        throw e;
      var n = "[mobx] Encountered an uncaught exception that was thrown by a reaction or observer component, in: '" + this + "'";
      T.suppressReactionErrors ? console.warn("[mobx] (error in reaction '" + this.name + "' suppressed, fix error of causing action below)") : console.error(n, e), be() && Yt({
        type: "error",
        name: this.name,
        message: n,
        error: "" + e
      }), T.globalReactionErrorHandlers.forEach(function(o) {
        return o(e, t);
      });
    }, r.prototype.dispose = function() {
      this.isDisposed || (this.isDisposed = !0, this._isRunning || (Ze(), Wo(this), qe()));
    }, r.prototype.getDisposer = function() {
      var e = this.dispose.bind(this);
      return e[B] = this, e;
    }, r.prototype.toString = function() {
      return "Reaction[" + this.name + "]";
    }, r.prototype.trace = function(e) {
      e === void 0 && (e = !1), Kd(this, e);
    }, r;
  })()
), oa = 100, Zo = function(r) {
  return r();
};
function vl() {
  T.inBatch > 0 || T.isRunningReactions || Zo(Dd);
}
function Dd() {
  T.isRunningReactions = !0;
  for (var r = T.pendingReactions, e = 0; r.length > 0; ) {
    ++e === oa && (console.error("Reaction doesn't converge to a stable state after " + oa + " iterations." + (" Probably there is a cycle in the reactive function: " + r[0])), r.splice(0));
    for (var t = r.splice(0), n = 0, o = t.length; n < o; n++)
      t[n].runReaction();
  }
  T.isRunningReactions = !1;
}
var Vn = At("Reaction", Vr);
function Td(r) {
  var e = Zo;
  Zo = function(t) {
    return r(function() {
      return e(t);
    });
  };
}
function be() {
  return process.env.NODE_ENV !== "production" && !!T.spyListeners.length;
}
function Yt(r) {
  if (process.env.NODE_ENV !== "production" && T.spyListeners.length)
    for (var e = T.spyListeners, t = 0, n = e.length; t < n; t++)
      e[t](r);
}
function Ce(r) {
  if (process.env.NODE_ENV !== "production") {
    var e = ie(ie({}, r), { spyReportStart: !0 });
    Yt(e);
  }
}
var Nd = { spyReportEnd: !0 };
function Le(r) {
  process.env.NODE_ENV !== "production" && Yt(r ? ie(ie({}, r), { spyReportEnd: !0 }) : Nd);
}
function Cd(r) {
  return process.env.NODE_ENV === "production" ? (console.warn("[mobx.spy] Is a no-op in production builds"), function() {
  }) : (T.spyListeners.push(r), Ci(function() {
    T.spyListeners = T.spyListeners.filter(function(e) {
      return e !== r;
    });
  }));
}
function Ld() {
  X(process.env.NODE_ENV !== "production" && "@action fields are not reassignable");
}
function ia(r) {
  return function(e, t, n) {
    if (n) {
      if (process.env.NODE_ENV !== "production" && n.get !== void 0)
        return X("@action cannot be used with getters");
      if (n.value)
        return {
          value: jt(r, n.value),
          enumerable: !1,
          configurable: !0,
          writable: !0
          // for typescript, this must be writable, otherwise it cannot inherit :/ (see inheritable actions test)
        };
      var o = n.initializer;
      return {
        enumerable: !1,
        configurable: !0,
        writable: !0,
        initializer: function() {
          return jt(r, o.call(this));
        }
      };
    }
    return jd(r).apply(this, arguments);
  };
}
function jd(r) {
  return function(e, t, n) {
    Object.defineProperty(e, t, {
      configurable: !0,
      enumerable: !1,
      get: function() {
      },
      set: function(o) {
        xr(this, t, O(r, o));
      }
    });
  };
}
function Rd(r, e, t, n) {
  return n === !0 ? (So(r, e, t.value), null) : t ? {
    configurable: !0,
    enumerable: !1,
    get: function() {
      return So(this, e, t.value || t.initializer.call(this)), this[e];
    },
    set: Ld
  } : {
    enumerable: !1,
    configurable: !0,
    set: function(o) {
      So(this, e, o);
    },
    get: function() {
    }
  };
}
var O = function(e, t, n, o) {
  if (arguments.length === 1 && typeof e == "function")
    return jt(e.name || "<unnamed action>", e);
  if (arguments.length === 2 && typeof t == "function")
    return jt(e, t);
  if (arguments.length === 1 && typeof e == "string")
    return ia(e);
  if (o === !0)
    xr(e, t, jt(e.name || t, n.value, this));
  else
    return ia(t).apply(null, arguments);
};
O.bound = Rd;
function Id(r, e) {
  var t = typeof r == "string" ? r : r.name || "<unnamed action>", n = typeof r == "function" ? r : e;
  return process.env.NODE_ENV !== "production" && (le(typeof n == "function" && n.length === 0, "`runInAction` expects a function without arguments"), (typeof t != "string" || !t) && X("actions should have valid names, got: '" + t + "'")), ll(t, n, this, void 0);
}
function kd(r) {
  return typeof r == "function" && r.isMobxAction === !0;
}
function So(r, e, t) {
  xr(r, e, jt(e, t.bind(r)));
}
function Bd(r, e) {
  e === void 0 && (e = Ni), process.env.NODE_ENV !== "production" && (le(typeof r == "function", "Autorun expects a function as first argument"), le(kd(r) === !1, "Autorun does not accept actions since actions are untrackable"));
  var t = e && e.name || r.name || "Autorun@" + De(), n = !e.scheduler && !e.delay, o;
  if (n)
    o = new Vr(t, function() {
      this.track(s);
    }, e.onError, e.requiresObservable);
  else {
    var i = yl(e), a = !1;
    o = new Vr(t, function() {
      a || (a = !0, i(function() {
        a = !1, o.isDisposed || o.track(s);
      }));
    }, e.onError, e.requiresObservable);
  }
  function s() {
    r(o);
  }
  return o.schedule(), o.getDisposer();
}
var Xd = function(r) {
  return r();
};
function yl(r) {
  return r.scheduler ? r.scheduler : r.delay ? function(e) {
    return setTimeout(e, r.delay);
  } : Xd;
}
function gl(r, e, t) {
  t === void 0 && (t = Ni), process.env.NODE_ENV !== "production" && (le(typeof r == "function", "First argument to reaction should be a function"), le(typeof t == "object", "Third argument of reactions should be an object"));
  var n = t.name || "Reaction@" + De(), o = O(n, t.onError ? Yd(t.onError, e) : e), i = !t.scheduler && !t.delay, a = yl(t), s = !0, l = !1, u, d = t.compareStructural ? fr.structural : t.equals || fr.default, f = new Vr(n, function() {
    s || i ? c() : l || (l = !0, a(c));
  }, t.onError, t.requiresObservable);
  function c() {
    if (l = !1, !f.isDisposed) {
      var p = !1;
      f.track(function() {
        var h = r(f);
        p = s || !d(u, h), u = h;
      }), s && t.fireImmediately && o(u, f), !s && p === !0 && o(u, f), s && (s = !1);
    }
  }
  return f.schedule(), f.getDisposer();
}
function Yd(r, e) {
  return function() {
    try {
      return e.apply(this, arguments);
    } catch (t) {
      r.call(this, t);
    }
  };
}
function Fd(r, e, t) {
  return ml("onBecomeObserved", r, e);
}
function _l(r, e, t) {
  return ml("onBecomeUnobserved", r, e);
}
function ml(r, e, t, n) {
  var o = Ot(e), i = t, a = r + "Listeners";
  o[a] ? o[a].add(i) : o[a] = /* @__PURE__ */ new Set([i]);
  var s = o[r];
  return typeof s != "function" ? X(process.env.NODE_ENV !== "production" && "Not an atom that can be (un)observed") : function() {
    var l = o[a];
    l && (l.delete(i), l.size === 0 && delete o[a]);
  };
}
function Hd(r) {
  var e = r.enforceActions, t = r.computedRequiresReaction, n = r.computedConfigurable, o = r.disableErrorBoundaries, i = r.reactionScheduler, a = r.reactionRequiresObservable, s = r.observableRequiresReaction;
  if (wd(), e !== void 0) {
    (typeof e == "boolean" || e === "strict") && Zu(`Deprecated value for 'enforceActions', use 'false' => '"never"', 'true' => '"observed"', '"strict"' => "'always'" instead`);
    var l = void 0;
    switch (e) {
      case !0:
      case "observed":
        l = !0;
        break;
      case !1:
      case "never":
        l = !1;
        break;
      case "strict":
      case "always":
        l = "strict";
        break;
      default:
        X("Invalid value for 'enforceActions': '" + e + "', expected 'never', 'always' or 'observed'");
    }
    T.enforceActions = l, T.allowStateChanges = !(l === !0 || l === "strict");
  }
  t !== void 0 && (T.computedRequiresReaction = !!t), a !== void 0 && (T.reactionRequiresObservable = !!a), s !== void 0 && (T.observableRequiresReaction = !!s, T.allowStateReads = !T.observableRequiresReaction), n !== void 0 && (T.computedConfigurable = !!n), o !== void 0 && (o === !0 && console.warn("WARNING: Debug feature only. MobX will NOT recover from errors when `disableErrorBoundaries` is enabled."), T.disableErrorBoundaries = !!o), i && Td(i);
}
function qo(r, e, t, n) {
  process.env.NODE_ENV !== "production" && (le(arguments.length >= 2 && arguments.length <= 4, "'extendObservable' expected 2-4 arguments"), le(typeof r == "object", "'extendObservable' expects an object as first argument"), le(!Pe(r), "'extendObservable' should not be used on maps, use map.merge instead")), n = Qt(n);
  var o = xl(n);
  return Xt(r), Hi(r, n.name, o.enhancer), e && El(r, e, t, o), r;
}
function xl(r) {
  return r.defaultDecorator || (r.deep === !1 ? ol : Bi);
}
function El(r, e, t, n) {
  var o, i, a, s;
  if (process.env.NODE_ENV !== "production" && (le(!bt(e), "Extending an object with another observable (object) is not supported. Please construct an explicit propertymap, using `toJS` if need. See issue #540"), t)) {
    var l = ji(t);
    try {
      for (var u = Ve(l), d = u.next(); !d.done; d = u.next()) {
        var f = d.value;
        f in e || X("Trying to declare a decorator for unspecified property '" + ke(f) + "'");
      }
    } catch (y) {
      o = { error: y };
    } finally {
      try {
        d && !d.done && (i = u.return) && i.call(u);
      } finally {
        if (o) throw o.error;
      }
    }
  }
  Ze();
  try {
    var l = td(e);
    try {
      for (var c = Ve(l), p = c.next(); !p.done; p = c.next()) {
        var f = p.value, h = Object.getOwnPropertyDescriptor(e, f);
        process.env.NODE_ENV !== "production" && (Ft(e) || X("'extendObservable' only accepts plain objects as second argument"), wl(h.value) && X("Passing a 'computed' as initial property value is no longer supported by extendObservable. Use a getter or decorator instead"));
        var v = t && f in t ? t[f] : h.get ? Hn : n;
        process.env.NODE_ENV !== "production" && typeof v != "function" && X("Not a valid decorator for '" + ke(f) + "', got: " + v);
        var g = v(r, f, h, !0);
        g && Object.defineProperty(r, f, g);
      }
    } catch (_) {
      a = { error: _ };
    } finally {
      try {
        p && !p.done && (s = c.return) && s.call(c);
      } finally {
        if (a) throw a.error;
      }
    }
  } finally {
    qe();
  }
}
function Gd(r, e) {
  return bl(Ot(r, e));
}
function bl(r) {
  var e = {
    name: r.name
  };
  return r.observing && r.observing.length > 0 && (e.dependencies = qu(r.observing).map(bl)), e;
}
function Ol(r, e) {
  if (r == null)
    return !1;
  if (e !== void 0) {
    if (et(r) === !1 || !r[B].values.has(e))
      return !1;
    var t = Ot(r, e);
    return hr(t);
  }
  return hr(r);
}
function wl(r) {
  return arguments.length > 1 ? X(process.env.NODE_ENV !== "production" && "isComputed expects only 1 argument. Use isObservableProp to inspect the observability of a property") : Ol(r);
}
function aa(r, e) {
  return typeof e != "string" ? X(process.env.NODE_ENV !== "production" && "isComputed expected a property name as second argument") : Ol(r, e);
}
function zd(r, e) {
  return r == null ? !1 : et(r) || !!r[B] || Ri(r) || Vn(r) || hr(r);
}
function bt(r) {
  return arguments.length !== 1 && X(process.env.NODE_ENV !== "production" && "isObservable expects only 1 argument. Use isObservableProp to inspect the observability of a property"), zd(r);
}
function vr(r) {
  return et(r) ? r[B].getKeys() : Pe(r) || Ye(r) ? Array.from(r.keys()) : lt(r) ? r.map(function(e, t) {
    return t;
  }) : X(process.env.NODE_ENV !== "production" && "'keys()' can only be used on observable objects, arrays, sets and maps");
}
function Ud(r) {
  return et(r) ? vr(r).map(function(e) {
    return r[e];
  }) : Pe(r) ? vr(r).map(function(e) {
    return r.get(e);
  }) : Ye(r) ? Array.from(r.values()) : lt(r) ? r.slice() : X(process.env.NODE_ENV !== "production" && "'values()' can only be used on observable objects, arrays, sets and maps");
}
function Vd(r) {
  return et(r) ? vr(r).map(function(e) {
    return [e, r[e]];
  }) : Pe(r) ? vr(r).map(function(e) {
    return [e, r.get(e)];
  }) : Ye(r) ? Array.from(r.entries()) : lt(r) ? r.map(function(e, t) {
    return [t, e];
  }) : X(process.env.NODE_ENV !== "production" && "'entries()' can only be used on observable objects, arrays and maps");
}
function Yi(r, e, t) {
  if (arguments.length === 2 && !Ye(r)) {
    Ze();
    var n = e;
    try {
      for (var o in n)
        Yi(r, o, n[o]);
    } finally {
      qe();
    }
    return;
  }
  if (et(r)) {
    var i = r[B], a = i.values.get(e);
    a ? i.write(e, t) : i.addObservableProp(e, t, i.defaultEnhancer);
  } else if (Pe(r))
    r.set(e, t);
  else if (Ye(r))
    r.add(e);
  else if (lt(r))
    typeof e != "number" && (e = parseInt(e, 10)), le(e >= 0, "Not a valid index: '" + e + "'"), Ze(), e >= r.length && (r.length = e + 1), r[e] = t, qe();
  else
    return X(process.env.NODE_ENV !== "production" && "'set()' can only be used on observable objects, arrays and maps");
}
function Sl(r, e, t, n) {
  return $d(r, e, t);
}
function $d(r, e, t) {
  return yo(r).observe(e, t);
}
var Wd = {
  detectCycles: !0,
  exportMapsAsObjects: !0,
  recurseEverything: !1
};
function $t(r, e, t, n) {
  return n.detectCycles && r.set(e, t), t;
}
function vt(r, e, t) {
  if (!e.recurseEverything && !bt(r) || typeof r != "object")
    return r;
  if (r === null)
    return null;
  if (r instanceof Date)
    return r;
  if (bd(r))
    return vt(r.get(), e, t);
  bt(r) && vr(r);
  var n = e.detectCycles === !0;
  if (n && r !== null && t.has(r))
    return t.get(r);
  if (lt(r) || Array.isArray(r)) {
    var o = $t(t, r, [], e), i = r.map(function(p) {
      return vt(p, e, t);
    });
    o.length = i.length;
    for (var a = 0, s = i.length; a < s; a++)
      o[a] = i[a];
    return o;
  }
  if (Ye(r) || Object.getPrototypeOf(r) === Set.prototype)
    if (e.exportMapsAsObjects === !1) {
      var l = $t(t, r, /* @__PURE__ */ new Set(), e);
      return r.forEach(function(p) {
        l.add(vt(p, e, t));
      }), l;
    } else {
      var u = $t(t, r, [], e);
      return r.forEach(function(p) {
        u.push(vt(p, e, t));
      }), u;
    }
  if (Pe(r) || Object.getPrototypeOf(r) === Map.prototype)
    if (e.exportMapsAsObjects === !1) {
      var d = $t(t, r, /* @__PURE__ */ new Map(), e);
      return r.forEach(function(p, h) {
        d.set(h, vt(p, e, t));
      }), d;
    } else {
      var f = $t(t, r, {}, e);
      return r.forEach(function(p, h) {
        f[h] = vt(p, e, t);
      }), f;
    }
  var c = $t(t, r, {}, e);
  return ji(r).forEach(function(p) {
    c[p] = vt(r[p], e, t);
  }), c;
}
function nt(r, e) {
  typeof e == "boolean" && (e = { detectCycles: e }), e || (e = Wd), e.detectCycles = e.detectCycles === void 0 ? e.recurseEverything === !0 : e.detectCycles === !0;
  var t;
  return e.detectCycles && (t = /* @__PURE__ */ new Map()), vt(r, e, t);
}
function Kd() {
  for (var r = [], e = 0; e < arguments.length; e++)
    r[e] = arguments[e];
  var t = !1;
  typeof r[r.length - 1] == "boolean" && (t = r.pop());
  var n = Zd(r);
  if (!n)
    return X(process.env.NODE_ENV !== "production" && "'trace(break?)' can only be used inside a tracked computed value or a Reaction. Consider passing in the computed value or reaction explicitly");
  n.isTracing === Ke.NONE && console.log("[mobx.trace] '" + n.name + "' tracing enabled"), n.isTracing = t ? Ke.BREAK : Ke.LOG;
}
function Zd(r) {
  switch (r.length) {
    case 0:
      return T.trackingDerivation;
    case 1:
      return Ot(r[0]);
    case 2:
      return Ot(r[0], r[1]);
  }
}
function $e(r, e) {
  e === void 0 && (e = void 0), Ze();
  try {
    return r.apply(e);
  } finally {
    qe();
  }
}
function cn(r) {
  return r[B];
}
function pn(r) {
  return typeof r == "string" || typeof r == "number" || typeof r == "symbol";
}
var qd = {
  has: function(r, e) {
    if (e === B || e === "constructor" || e === Fn)
      return !0;
    var t = cn(r);
    return pn(e) ? t.has(e) : e in r;
  },
  get: function(r, e) {
    if (e === B || e === "constructor" || e === Fn)
      return r[e];
    var t = cn(r), n = t.values.get(e);
    if (n instanceof br) {
      var o = n.get();
      return o === void 0 && t.has(e), o;
    }
    return pn(e) && t.has(e), r[e];
  },
  set: function(r, e, t) {
    return pn(e) ? (Yi(r, e, t), !0) : !1;
  },
  deleteProperty: function(r, e) {
    if (!pn(e))
      return !1;
    var t = cn(r);
    return t.remove(e), !0;
  },
  ownKeys: function(r) {
    var e = cn(r);
    return e.keysAtom.reportObserved(), Reflect.ownKeys(r);
  },
  preventExtensions: function(r) {
    return X("Dynamic observable objects cannot be frozen"), !1;
  }
};
function Jd(r) {
  var e = new Proxy(r, qd);
  return r[B].proxy = e, e;
}
function at(r) {
  return r.interceptors !== void 0 && r.interceptors.length > 0;
}
function on(r, e) {
  var t = r.interceptors || (r.interceptors = []);
  return t.push(e), Ci(function() {
    var n = t.indexOf(e);
    n !== -1 && t.splice(n, 1);
  });
}
function st(r, e) {
  var t = Or();
  try {
    for (var n = ki(r.interceptors || []), o = 0, i = n.length; o < i && (e = n[o](e), le(!e || e.type, "Intercept handlers should return nothing or a change object"), !!e); o++)
      ;
    return e;
  } finally {
    xt(t);
  }
}
function Je(r) {
  return r.changeListeners !== void 0 && r.changeListeners.length > 0;
}
function an(r, e) {
  var t = r.changeListeners || (r.changeListeners = []);
  return t.push(e), Ci(function() {
    var n = t.indexOf(e);
    n !== -1 && t.splice(n, 1);
  });
}
function Qe(r, e) {
  var t = Or(), n = r.changeListeners;
  if (n) {
    n = n.slice();
    for (var o = 0, i = n.length; o < i; o++)
      n[o](e);
    xt(t);
  }
}
var Qd = 1e4, ef = {
  get: function(r, e) {
    return e === B ? r[B] : e === "length" ? r[B].getArrayLength() : typeof e == "number" ? ft.get.call(r, e) : typeof e == "string" && !isNaN(e) ? ft.get.call(r, parseInt(e)) : ft.hasOwnProperty(e) ? ft[e] : r[e];
  },
  set: function(r, e, t) {
    return e === "length" && r[B].setArrayLength(t), typeof e == "number" && ft.set.call(r, e, t), typeof e == "symbol" || isNaN(e) ? r[e] = t : ft.set.call(r, parseInt(e), t), !0;
  },
  preventExtensions: function(r) {
    return X("Observable arrays cannot be frozen"), !1;
  }
};
function tf(r, e, t, n) {
  t === void 0 && (t = "ObservableArray@" + De()), n === void 0 && (n = !1);
  var o = new Al(t, e, n);
  Qu(o.values, B, o);
  var i = new Proxy(o.values, ef);
  if (o.proxy = i, r && r.length) {
    var a = ho(!0);
    o.spliceWithArray(0, 0, r), vo(a);
  }
  return i;
}
var Al = (
  /** @class */
  (function() {
    function r(e, t, n) {
      this.owned = n, this.values = [], this.proxy = void 0, this.lastKnownLength = 0, this.atom = new br(e || "ObservableArray@" + De()), this.enhancer = function(o, i) {
        return t(o, i, e + "[..]");
      };
    }
    return r.prototype.dehanceValue = function(e) {
      return this.dehancer !== void 0 ? this.dehancer(e) : e;
    }, r.prototype.dehanceValues = function(e) {
      return this.dehancer !== void 0 && e.length > 0 ? e.map(this.dehancer) : e;
    }, r.prototype.intercept = function(e) {
      return on(this, e);
    }, r.prototype.observe = function(e, t) {
      return t === void 0 && (t = !1), t && e({
        object: this.proxy,
        type: "splice",
        index: 0,
        added: this.values.slice(),
        addedCount: this.values.length,
        removed: [],
        removedCount: 0
      }), an(this, e);
    }, r.prototype.getArrayLength = function() {
      return this.atom.reportObserved(), this.values.length;
    }, r.prototype.setArrayLength = function(e) {
      if (typeof e != "number" || e < 0)
        throw new Error("[mobx.array] Out of range: " + e);
      var t = this.values.length;
      if (e !== t)
        if (e > t) {
          for (var n = new Array(e - t), o = 0; o < e - t; o++)
            n[o] = void 0;
          this.spliceWithArray(t, 0, n);
        } else
          this.spliceWithArray(e, t - e);
    }, r.prototype.updateArrayLength = function(e, t) {
      if (e !== this.lastKnownLength)
        throw new Error("[mobx] Modification exception: the internal structure of an observable array was changed.");
      this.lastKnownLength += t;
    }, r.prototype.spliceWithArray = function(e, t, n) {
      var o = this;
      cr(this.atom);
      var i = this.values.length;
      if (e === void 0 ? e = 0 : e > i ? e = i : e < 0 && (e = Math.max(0, i + e)), arguments.length === 1 ? t = i - e : t == null ? t = 0 : t = Math.max(0, Math.min(t, i - e)), n === void 0 && (n = Yn), at(this)) {
        var a = st(this, {
          object: this.proxy,
          type: "splice",
          index: e,
          removedCount: t,
          added: n
        });
        if (!a)
          return Yn;
        t = a.removedCount, n = a.added;
      }
      if (n = n.length === 0 ? n : n.map(function(u) {
        return o.enhancer(u, void 0);
      }), process.env.NODE_ENV !== "production") {
        var s = n.length - t;
        this.updateArrayLength(i, s);
      }
      var l = this.spliceItemsIntoValues(e, t, n);
      return (t !== 0 || n.length !== 0) && this.notifyArraySplice(e, n, l), this.dehanceValues(l);
    }, r.prototype.spliceItemsIntoValues = function(e, t, n) {
      var o;
      if (n.length < Qd)
        return (o = this.values).splice.apply(o, ki([e, t], n));
      var i = this.values.slice(e, e + t);
      return this.values = this.values.slice(0, e).concat(n, this.values.slice(e + t)), i;
    }, r.prototype.notifyArrayChildUpdate = function(e, t, n) {
      var o = !this.owned && be(), i = Je(this), a = i || o ? {
        object: this.proxy,
        type: "update",
        index: e,
        newValue: t,
        oldValue: n
      } : null;
      o && process.env.NODE_ENV !== "production" && Ce(ie(ie({}, a), { name: this.atom.name })), this.atom.reportChanged(), i && Qe(this, a), o && process.env.NODE_ENV !== "production" && Le();
    }, r.prototype.notifyArraySplice = function(e, t, n) {
      var o = !this.owned && be(), i = Je(this), a = i || o ? {
        object: this.proxy,
        type: "splice",
        index: e,
        removed: n,
        added: t,
        removedCount: n.length,
        addedCount: t.length
      } : null;
      o && process.env.NODE_ENV !== "production" && Ce(ie(ie({}, a), { name: this.atom.name })), this.atom.reportChanged(), i && Qe(this, a), o && process.env.NODE_ENV !== "production" && Le();
    }, r;
  })()
), ft = {
  intercept: function(r) {
    return this[B].intercept(r);
  },
  observe: function(r, e) {
    e === void 0 && (e = !1);
    var t = this[B];
    return t.observe(r, e);
  },
  clear: function() {
    return this.splice(0);
  },
  replace: function(r) {
    var e = this[B];
    return e.spliceWithArray(0, e.values.length, r);
  },
  /**
   * Converts this array back to a (shallow) javascript structure.
   * For a deep clone use mobx.toJS
   */
  toJS: function() {
    return this.slice();
  },
  toJSON: function() {
    return this.toJS();
  },
  /*
   * functions that do alter the internal structure of the array, (based on lib.es6.d.ts)
   * since these functions alter the inner structure of the array, the have side effects.
   * Because the have side effects, they should not be used in computed function,
   * and for that reason the do not call dependencyState.notifyObserved
   */
  splice: function(r, e) {
    for (var t = [], n = 2; n < arguments.length; n++)
      t[n - 2] = arguments[n];
    var o = this[B];
    switch (arguments.length) {
      case 0:
        return [];
      case 1:
        return o.spliceWithArray(r);
      case 2:
        return o.spliceWithArray(r, e);
    }
    return o.spliceWithArray(r, e, t);
  },
  spliceWithArray: function(r, e, t) {
    var n = this[B];
    return n.spliceWithArray(r, e, t);
  },
  push: function() {
    for (var r = [], e = 0; e < arguments.length; e++)
      r[e] = arguments[e];
    var t = this[B];
    return t.spliceWithArray(t.values.length, 0, r), t.values.length;
  },
  pop: function() {
    return this.splice(Math.max(this[B].values.length - 1, 0), 1)[0];
  },
  shift: function() {
    return this.splice(0, 1)[0];
  },
  unshift: function() {
    for (var r = [], e = 0; e < arguments.length; e++)
      r[e] = arguments[e];
    var t = this[B];
    return t.spliceWithArray(0, 0, r), t.values.length;
  },
  reverse: function() {
    process.env.NODE_ENV !== "production" && console.warn("[mobx] `observableArray.reverse()` will not update the array in place. Use `observableArray.slice().reverse()` to suppress this warning and perform the operation on a copy, or `observableArray.replace(observableArray.slice().reverse())` to reverse & update in place");
    var r = this.slice();
    return r.reverse.apply(r, arguments);
  },
  sort: function(r) {
    process.env.NODE_ENV !== "production" && console.warn("[mobx] `observableArray.sort()` will not update the array in place. Use `observableArray.slice().sort()` to suppress this warning and perform the operation on a copy, or `observableArray.replace(observableArray.slice().sort())` to sort & update in place");
    var e = this.slice();
    return e.sort.apply(e, arguments);
  },
  remove: function(r) {
    var e = this[B], t = e.dehanceValues(e.values).indexOf(r);
    return t > -1 ? (this.splice(t, 1), !0) : !1;
  },
  get: function(r) {
    var e = this[B];
    if (e) {
      if (r < e.values.length)
        return e.atom.reportObserved(), e.dehanceValue(e.values[r]);
      console.warn("[mobx.array] Attempt to read an array index (" + r + ") that is out of bounds (" + e.values.length + "). Please check length first. Out of bound indices will not be tracked by MobX");
    }
  },
  set: function(r, e) {
    var t = this[B], n = t.values;
    if (r < n.length) {
      cr(t.atom);
      var o = n[r];
      if (at(t)) {
        var i = st(t, {
          type: "update",
          object: t.proxy,
          index: r,
          newValue: e
        });
        if (!i)
          return;
        e = i.newValue;
      }
      e = t.enhancer(e, o);
      var a = e !== o;
      a && (n[r] = e, t.notifyArrayChildUpdate(r, e, o));
    } else if (r === n.length)
      t.spliceWithArray(r, 0, [e]);
    else
      throw new Error("[mobx.array] Index out of bounds, " + r + " is larger than " + n.length);
  }
};
[
  "concat",
  "flat",
  "includes",
  "indexOf",
  "join",
  "lastIndexOf",
  "slice",
  "toString",
  "toLocaleString"
].forEach(function(r) {
  typeof Array.prototype[r] == "function" && (ft[r] = function() {
    var e = this[B];
    e.atom.reportObserved();
    var t = e.dehanceValues(e.values);
    return t[r].apply(t, arguments);
  });
});
["every", "filter", "find", "findIndex", "flatMap", "forEach", "map", "some"].forEach(function(r) {
  typeof Array.prototype[r] == "function" && (ft[r] = function(e, t) {
    var n = this, o = this[B];
    o.atom.reportObserved();
    var i = o.dehanceValues(o.values);
    return i[r](function(a, s) {
      return e.call(t, a, s, n);
    }, t);
  });
});
["reduce", "reduceRight"].forEach(function(r) {
  ft[r] = function() {
    var e = this, t = this[B];
    t.atom.reportObserved();
    var n = arguments[0];
    return arguments[0] = function(o, i, a) {
      return i = t.dehanceValue(i), n(o, i, a, e);
    }, t.values[r].apply(t.values, arguments);
  };
});
var rf = At("ObservableArrayAdministration", Al);
function lt(r) {
  return Li(r) && rf(r[B]);
}
var sa, nf = {}, Fi = (
  /** @class */
  (function() {
    function r(e, t, n) {
      if (t === void 0 && (t = nn), n === void 0 && (n = "ObservableMap@" + De()), this.enhancer = t, this.name = n, this[sa] = nf, this._keysAtom = Ii(this.name + ".keys()"), this[Symbol.toStringTag] = "Map", typeof Map != "function")
        throw new Error("mobx.map requires Map polyfill for the current browser. Check babel-polyfill or core-js/es6/map.js");
      this._data = /* @__PURE__ */ new Map(), this._hasMap = /* @__PURE__ */ new Map(), this.merge(e);
    }
    return r.prototype._has = function(e) {
      return this._data.has(e);
    }, r.prototype.has = function(e) {
      var t = this;
      if (!T.trackingDerivation)
        return this._has(e);
      var n = this._hasMap.get(e);
      if (!n) {
        var o = n = new Rt(this._has(e), co, this.name + "." + ke(e) + "?", !1);
        this._hasMap.set(e, o), _l(o, function() {
          return t._hasMap.delete(e);
        });
      }
      return n.get();
    }, r.prototype.set = function(e, t) {
      var n = this._has(e);
      if (at(this)) {
        var o = st(this, {
          type: n ? "update" : "add",
          object: this,
          newValue: t,
          name: e
        });
        if (!o)
          return this;
        t = o.newValue;
      }
      return n ? this._updateValue(e, t) : this._addValue(e, t), this;
    }, r.prototype.delete = function(e) {
      var t = this;
      if (cr(this._keysAtom), at(this)) {
        var n = st(this, {
          type: "delete",
          object: this,
          name: e
        });
        if (!n)
          return !1;
      }
      if (this._has(e)) {
        var o = be(), i = Je(this), n = i || o ? {
          type: "delete",
          object: this,
          oldValue: this._data.get(e).value,
          name: e
        } : null;
        return o && process.env.NODE_ENV !== "production" && Ce(ie(ie({}, n), { name: this.name, key: e })), $e(function() {
          t._keysAtom.reportChanged(), t._updateHasMapEntry(e, !1);
          var s = t._data.get(e);
          s.setNewValue(void 0), t._data.delete(e);
        }), i && Qe(this, n), o && process.env.NODE_ENV !== "production" && Le(), !0;
      }
      return !1;
    }, r.prototype._updateHasMapEntry = function(e, t) {
      var n = this._hasMap.get(e);
      n && n.setNewValue(t);
    }, r.prototype._updateValue = function(e, t) {
      var n = this._data.get(e);
      if (t = n.prepareNewValue(t), t !== T.UNCHANGED) {
        var o = be(), i = Je(this), a = i || o ? {
          type: "update",
          object: this,
          oldValue: n.value,
          name: e,
          newValue: t
        } : null;
        o && process.env.NODE_ENV !== "production" && Ce(ie(ie({}, a), { name: this.name, key: e })), n.setNewValue(t), i && Qe(this, a), o && process.env.NODE_ENV !== "production" && Le();
      }
    }, r.prototype._addValue = function(e, t) {
      var n = this;
      cr(this._keysAtom), $e(function() {
        var s = new Rt(t, n.enhancer, n.name + "." + ke(e), !1);
        n._data.set(e, s), t = s.value, n._updateHasMapEntry(e, !0), n._keysAtom.reportChanged();
      });
      var o = be(), i = Je(this), a = i || o ? {
        type: "add",
        object: this,
        name: e,
        newValue: t
      } : null;
      o && process.env.NODE_ENV !== "production" && Ce(ie(ie({}, a), { name: this.name, key: e })), i && Qe(this, a), o && process.env.NODE_ENV !== "production" && Le();
    }, r.prototype.get = function(e) {
      return this.has(e) ? this.dehanceValue(this._data.get(e).get()) : this.dehanceValue(void 0);
    }, r.prototype.dehanceValue = function(e) {
      return this.dehancer !== void 0 ? this.dehancer(e) : e;
    }, r.prototype.keys = function() {
      return this._keysAtom.reportObserved(), this._data.keys();
    }, r.prototype.values = function() {
      var e = this, t = this.keys();
      return $n({
        next: function() {
          var n = t.next(), o = n.done, i = n.value;
          return {
            done: o,
            value: o ? void 0 : e.get(i)
          };
        }
      });
    }, r.prototype.entries = function() {
      var e = this, t = this.keys();
      return $n({
        next: function() {
          var n = t.next(), o = n.done, i = n.value;
          return {
            done: o,
            value: o ? void 0 : [i, e.get(i)]
          };
        }
      });
    }, r.prototype[sa = B, Symbol.iterator] = function() {
      return this.entries();
    }, r.prototype.forEach = function(e, t) {
      var n, o;
      try {
        for (var i = Ve(this), a = i.next(); !a.done; a = i.next()) {
          var s = tr(a.value, 2), l = s[0], u = s[1];
          e.call(t, u, l, this);
        }
      } catch (d) {
        n = { error: d };
      } finally {
        try {
          a && !a.done && (o = i.return) && o.call(i);
        } finally {
          if (n) throw n.error;
        }
      }
    }, r.prototype.merge = function(e) {
      var t = this;
      return Pe(e) && (e = e.toJS()), $e(function() {
        var n = ho(!0);
        try {
          Ft(e) ? ji(e).forEach(function(o) {
            return t.set(o, e[o]);
          }) : Array.isArray(e) ? e.forEach(function(o) {
            var i = tr(o, 2), a = i[0], s = i[1];
            return t.set(a, s);
          }) : Er(e) ? (e.constructor !== Map && X("Cannot initialize from classes that inherit from Map: " + e.constructor.name), e.forEach(function(o, i) {
            return t.set(i, o);
          })) : e != null && X("Cannot initialize map from " + e);
        } finally {
          vo(n);
        }
      }), this;
    }, r.prototype.clear = function() {
      var e = this;
      $e(function() {
        al(function() {
          var t, n;
          try {
            for (var o = Ve(e.keys()), i = o.next(); !i.done; i = o.next()) {
              var a = i.value;
              e.delete(a);
            }
          } catch (s) {
            t = { error: s };
          } finally {
            try {
              i && !i.done && (n = o.return) && n.call(o);
            } finally {
              if (t) throw t.error;
            }
          }
        });
      });
    }, r.prototype.replace = function(e) {
      var t = this;
      return $e(function() {
        var n, o, i, a, s = Ju(e), l = /* @__PURE__ */ new Map(), u = !1;
        try {
          for (var d = Ve(t._data.keys()), f = d.next(); !f.done; f = d.next()) {
            var c = f.value;
            if (!s.has(c)) {
              var p = t.delete(c);
              if (p)
                u = !0;
              else {
                var h = t._data.get(c);
                l.set(c, h);
              }
            }
          }
        } catch (b) {
          n = { error: b };
        } finally {
          try {
            f && !f.done && (o = d.return) && o.call(d);
          } finally {
            if (n) throw n.error;
          }
        }
        try {
          for (var v = Ve(s.entries()), g = v.next(); !g.done; g = v.next()) {
            var y = tr(g.value, 2), c = y[0], h = y[1], _ = t._data.has(c);
            if (t.set(c, h), t._data.has(c)) {
              var S = t._data.get(c);
              l.set(c, S), _ || (u = !0);
            }
          }
        } catch (b) {
          i = { error: b };
        } finally {
          try {
            g && !g.done && (a = v.return) && a.call(v);
          } finally {
            if (i) throw i.error;
          }
        }
        if (!u)
          if (t._data.size !== l.size)
            t._keysAtom.reportChanged();
          else
            for (var A = t._data.keys(), x = l.keys(), E = A.next(), m = x.next(); !E.done; ) {
              if (E.value !== m.value) {
                t._keysAtom.reportChanged();
                break;
              }
              E = A.next(), m = x.next();
            }
        t._data = l;
      }), this;
    }, Object.defineProperty(r.prototype, "size", {
      get: function() {
        return this._keysAtom.reportObserved(), this._data.size;
      },
      enumerable: !0,
      configurable: !0
    }), r.prototype.toPOJO = function() {
      var e, t, n = {};
      try {
        for (var o = Ve(this), i = o.next(); !i.done; i = o.next()) {
          var a = tr(i.value, 2), s = a[0], l = a[1];
          n[typeof s == "symbol" ? s : ke(s)] = l;
        }
      } catch (u) {
        e = { error: u };
      } finally {
        try {
          i && !i.done && (t = o.return) && t.call(o);
        } finally {
          if (e) throw e.error;
        }
      }
      return n;
    }, r.prototype.toJS = function() {
      return new Map(this);
    }, r.prototype.toJSON = function() {
      return this.toPOJO();
    }, r.prototype.toString = function() {
      var e = this;
      return this.name + "[{ " + Array.from(this.keys()).map(function(t) {
        return ke(t) + ": " + ("" + e.get(t));
      }).join(", ") + " }]";
    }, r.prototype.observe = function(e, t) {
      return process.env.NODE_ENV !== "production" && le(t !== !0, "`observe` doesn't support fireImmediately=true in combination with maps."), an(this, e);
    }, r.prototype.intercept = function(e) {
      return on(this, e);
    }, r;
  })()
), Pe = At("ObservableMap", Fi), la, of = {}, Ml = (
  /** @class */
  (function() {
    function r(e, t, n) {
      if (t === void 0 && (t = nn), n === void 0 && (n = "ObservableSet@" + De()), this.name = n, this[la] = of, this._data = /* @__PURE__ */ new Set(), this._atom = Ii(this.name), this[Symbol.toStringTag] = "Set", typeof Set != "function")
        throw new Error("mobx.set requires Set polyfill for the current browser. Check babel-polyfill or core-js/es6/set.js");
      this.enhancer = function(o, i) {
        return t(o, i, n);
      }, e && this.replace(e);
    }
    return r.prototype.dehanceValue = function(e) {
      return this.dehancer !== void 0 ? this.dehancer(e) : e;
    }, r.prototype.clear = function() {
      var e = this;
      $e(function() {
        al(function() {
          var t, n;
          try {
            for (var o = Ve(e._data.values()), i = o.next(); !i.done; i = o.next()) {
              var a = i.value;
              e.delete(a);
            }
          } catch (s) {
            t = { error: s };
          } finally {
            try {
              i && !i.done && (n = o.return) && n.call(o);
            } finally {
              if (t) throw t.error;
            }
          }
        });
      });
    }, r.prototype.forEach = function(e, t) {
      var n, o;
      try {
        for (var i = Ve(this), a = i.next(); !a.done; a = i.next()) {
          var s = a.value;
          e.call(t, s, s, this);
        }
      } catch (l) {
        n = { error: l };
      } finally {
        try {
          a && !a.done && (o = i.return) && o.call(i);
        } finally {
          if (n) throw n.error;
        }
      }
    }, Object.defineProperty(r.prototype, "size", {
      get: function() {
        return this._atom.reportObserved(), this._data.size;
      },
      enumerable: !0,
      configurable: !0
    }), r.prototype.add = function(e) {
      var t = this;
      if (cr(this._atom), at(this)) {
        var n = st(this, {
          type: "add",
          object: this,
          newValue: e
        });
        if (!n)
          return this;
      }
      if (!this.has(e)) {
        $e(function() {
          t._data.add(t.enhancer(e, void 0)), t._atom.reportChanged();
        });
        var o = be(), i = Je(this), n = i || o ? {
          type: "add",
          object: this,
          newValue: e
        } : null;
        o && process.env.NODE_ENV !== "production" && Ce(n), i && Qe(this, n), o && process.env.NODE_ENV !== "production" && Le();
      }
      return this;
    }, r.prototype.delete = function(e) {
      var t = this;
      if (at(this)) {
        var n = st(this, {
          type: "delete",
          object: this,
          oldValue: e
        });
        if (!n)
          return !1;
      }
      if (this.has(e)) {
        var o = be(), i = Je(this), n = i || o ? {
          type: "delete",
          object: this,
          oldValue: e
        } : null;
        return o && process.env.NODE_ENV !== "production" && Ce(ie(ie({}, n), { name: this.name })), $e(function() {
          t._atom.reportChanged(), t._data.delete(e);
        }), i && Qe(this, n), o && process.env.NODE_ENV !== "production" && Le(), !0;
      }
      return !1;
    }, r.prototype.has = function(e) {
      return this._atom.reportObserved(), this._data.has(this.dehanceValue(e));
    }, r.prototype.entries = function() {
      var e = 0, t = Array.from(this.keys()), n = Array.from(this.values());
      return $n({
        next: function() {
          var o = e;
          return e += 1, o < n.length ? { value: [t[o], n[o]], done: !1 } : { done: !0 };
        }
      });
    }, r.prototype.keys = function() {
      return this.values();
    }, r.prototype.values = function() {
      this._atom.reportObserved();
      var e = this, t = 0, n = Array.from(this._data.values());
      return $n({
        next: function() {
          return t < n.length ? { value: e.dehanceValue(n[t++]), done: !1 } : { done: !0 };
        }
      });
    }, r.prototype.replace = function(e) {
      var t = this;
      return Ye(e) && (e = e.toJS()), $e(function() {
        var n = ho(!0);
        try {
          Array.isArray(e) ? (t.clear(), e.forEach(function(o) {
            return t.add(o);
          })) : rn(e) ? (t.clear(), e.forEach(function(o) {
            return t.add(o);
          })) : e != null && X("Cannot initialize set from " + e);
        } finally {
          vo(n);
        }
      }), this;
    }, r.prototype.observe = function(e, t) {
      return process.env.NODE_ENV !== "production" && le(t !== !0, "`observe` doesn't support fireImmediately=true in combination with sets."), an(this, e);
    }, r.prototype.intercept = function(e) {
      return on(this, e);
    }, r.prototype.toJS = function() {
      return new Set(this);
    }, r.prototype.toString = function() {
      return this.name + "[ " + Array.from(this).join(", ") + " ]";
    }, r.prototype[la = B, Symbol.iterator] = function() {
      return this.values();
    }, r;
  })()
), Ye = At("ObservableSet", Ml), Pl = (
  /** @class */
  (function() {
    function r(e, t, n, o) {
      t === void 0 && (t = /* @__PURE__ */ new Map()), this.target = e, this.values = t, this.name = n, this.defaultEnhancer = o, this.keysAtom = new br(n + ".keys");
    }
    return r.prototype.read = function(e) {
      return this.values.get(e).get();
    }, r.prototype.write = function(e, t) {
      var n = this.target, o = this.values.get(e);
      if (o instanceof pr) {
        o.set(t);
        return;
      }
      if (at(this)) {
        var i = st(this, {
          type: "update",
          object: this.proxy || n,
          name: e,
          newValue: t
        });
        if (!i)
          return;
        t = i.newValue;
      }
      if (t = o.prepareNewValue(t), t !== T.UNCHANGED) {
        var a = Je(this), s = be(), i = a || s ? {
          type: "update",
          object: this.proxy || n,
          oldValue: o.value,
          name: e,
          newValue: t
        } : null;
        s && process.env.NODE_ENV !== "production" && Ce(ie(ie({}, i), { name: this.name, key: e })), o.setNewValue(t), a && Qe(this, i), s && process.env.NODE_ENV !== "production" && Le();
      }
    }, r.prototype.has = function(e) {
      var t = this.pendingKeys || (this.pendingKeys = /* @__PURE__ */ new Map()), n = t.get(e);
      if (n)
        return n.get();
      var o = !!this.values.get(e);
      return n = new Rt(o, co, this.name + "." + ke(e) + "?", !1), t.set(e, n), n.get();
    }, r.prototype.addObservableProp = function(e, t, n) {
      n === void 0 && (n = this.defaultEnhancer);
      var o = this.target;
      if (ed(o, e), at(this)) {
        var i = st(this, {
          object: this.proxy || o,
          name: e,
          type: "add",
          newValue: t
        });
        if (!i)
          return;
        t = i.newValue;
      }
      var a = new Rt(t, n, this.name + "." + ke(e), !1);
      this.values.set(e, a), t = a.value, Object.defineProperty(o, e, af(e)), this.notifyPropertyAddition(e, t);
    }, r.prototype.addComputedProp = function(e, t, n) {
      var o = this.target;
      n.name = n.name || this.name + "." + ke(t), this.values.set(t, new pr(n)), (e === o || el(e, t)) && Object.defineProperty(e, t, sf(t));
    }, r.prototype.remove = function(e) {
      if (this.values.has(e)) {
        var t = this.target;
        if (at(this)) {
          var n = st(this, {
            object: this.proxy || t,
            name: e,
            type: "remove"
          });
          if (!n)
            return;
        }
        try {
          Ze();
          var o = Je(this), i = be(), a = this.values.get(e), s = a && a.get();
          if (a && a.set(void 0), this.keysAtom.reportChanged(), this.values.delete(e), this.pendingKeys) {
            var l = this.pendingKeys.get(e);
            l && l.set(!1);
          }
          delete this.target[e];
          var n = o || i ? {
            type: "remove",
            object: this.proxy || t,
            oldValue: s,
            name: e
          } : null;
          i && process.env.NODE_ENV !== "production" && Ce(ie(ie({}, n), { name: this.name, key: e })), o && Qe(this, n), i && process.env.NODE_ENV !== "production" && Le();
        } finally {
          qe();
        }
      }
    }, r.prototype.illegalAccess = function(e, t) {
      console.warn("Property '" + t + "' of '" + e + "' was accessed through the prototype chain. Use 'decorate' instead to declare the prop or access it statically through it's owner");
    }, r.prototype.observe = function(e, t) {
      return process.env.NODE_ENV !== "production" && le(t !== !0, "`observe` doesn't support the fire immediately property for observable objects."), an(this, e);
    }, r.prototype.intercept = function(e) {
      return on(this, e);
    }, r.prototype.notifyPropertyAddition = function(e, t) {
      var n = Je(this), o = be(), i = n || o ? {
        type: "add",
        object: this.proxy || this.target,
        name: e,
        newValue: t
      } : null;
      if (o && process.env.NODE_ENV !== "production" && Ce(ie(ie({}, i), { name: this.name, key: e })), n && Qe(this, i), o && process.env.NODE_ENV !== "production" && Le(), this.pendingKeys) {
        var a = this.pendingKeys.get(e);
        a && a.set(!0);
      }
      this.keysAtom.reportChanged();
    }, r.prototype.getKeys = function() {
      var e, t;
      this.keysAtom.reportObserved();
      var n = [];
      try {
        for (var o = Ve(this.values), i = o.next(); !i.done; i = o.next()) {
          var a = tr(i.value, 2), s = a[0], l = a[1];
          l instanceof Rt && n.push(s);
        }
      } catch (u) {
        e = { error: u };
      } finally {
        try {
          i && !i.done && (t = o.return) && t.call(o);
        } finally {
          if (e) throw e.error;
        }
      }
      return n;
    }, r;
  })()
);
function Hi(r, e, t) {
  if (e === void 0 && (e = ""), t === void 0 && (t = nn), Object.prototype.hasOwnProperty.call(r, B))
    return r[B];
  process.env.NODE_ENV !== "production" && le(Object.isExtensible(r), "Cannot make the designated object observable; it is not extensible"), Ft(r) || (e = (r.constructor.name || "ObservableObject") + "@" + De()), e || (e = "ObservableObject@" + De());
  var n = new Pl(r, /* @__PURE__ */ new Map(), ke(e), t);
  return xr(r, B, n), n;
}
var ua = /* @__PURE__ */ Object.create(null), da = /* @__PURE__ */ Object.create(null);
function af(r) {
  return ua[r] || (ua[r] = {
    configurable: !0,
    enumerable: !0,
    get: function() {
      return this[B].read(r);
    },
    set: function(e) {
      this[B].write(r, e);
    }
  });
}
function fa(r) {
  var e = r[B];
  return e || (Xt(r), r[B]);
}
function sf(r) {
  return da[r] || (da[r] = {
    configurable: T.computedConfigurable,
    enumerable: !1,
    get: function() {
      return fa(this).read(r);
    },
    set: function(e) {
      fa(this).write(r, e);
    }
  });
}
var lf = At("ObservableObjectAdministration", Pl);
function et(r) {
  return Li(r) ? (Xt(r), lf(r[B])) : !1;
}
function Ot(r, e) {
  if (typeof r == "object" && r !== null) {
    if (lt(r))
      return e !== void 0 && X(process.env.NODE_ENV !== "production" && "It is not possible to get index atoms from arrays"), r[B].atom;
    if (Ye(r))
      return r[B];
    if (Pe(r)) {
      var t = r;
      if (e === void 0)
        return t._keysAtom;
      var n = t._data.get(e) || t._hasMap.get(e);
      return n || X(process.env.NODE_ENV !== "production" && "the entry '" + e + "' does not exist in the observable map '" + Jo(r) + "'"), n;
    }
    if (Xt(r), e && !r[B] && r[e], et(r)) {
      if (!e)
        return X(process.env.NODE_ENV !== "production" && "please specify a property");
      var n = r[B].values.get(e);
      return n || X(process.env.NODE_ENV !== "production" && "no observable property '" + e + "' found on the observable object '" + Jo(r) + "'"), n;
    }
    if (Ri(r) || hr(r) || Vn(r))
      return r;
  } else if (typeof r == "function" && Vn(r[B]))
    return r[B];
  return X(process.env.NODE_ENV !== "production" && "Cannot obtain atom from " + r);
}
function yo(r, e) {
  if (r || X("Expecting some object"), e !== void 0)
    return yo(Ot(r, e));
  if (Ri(r) || hr(r) || Vn(r) || Pe(r) || Ye(r))
    return r;
  if (Xt(r), r[B])
    return r[B];
  X(process.env.NODE_ENV !== "production" && "Cannot obtain administration from " + r);
}
function Jo(r, e) {
  var t;
  return e !== void 0 ? t = Ot(r, e) : et(r) || Pe(r) || Ye(r) ? t = yo(r) : t = Ot(r), t.name;
}
var ca = Object.prototype.toString;
function Dl(r, e, t) {
  return t === void 0 && (t = -1), Qo(r, e, t);
}
function Qo(r, e, t, n, o) {
  if (r === e)
    return r !== 0 || 1 / r === 1 / e;
  if (r == null || e == null)
    return !1;
  if (r !== r)
    return e !== e;
  var i = typeof r;
  if (i !== "function" && i !== "object" && typeof e != "object")
    return !1;
  var a = ca.call(r);
  if (a !== ca.call(e))
    return !1;
  switch (a) {
    // Strings, numbers, regular expressions, dates, and booleans are compared by value.
    case "[object RegExp]":
    // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
    case "[object String]":
      return "" + r == "" + e;
    case "[object Number]":
      return +r != +r ? +e != +e : +r == 0 ? 1 / +r === 1 / e : +r == +e;
    case "[object Date]":
    case "[object Boolean]":
      return +r == +e;
    case "[object Symbol]":
      return typeof Symbol < "u" && Symbol.valueOf.call(r) === Symbol.valueOf.call(e);
    case "[object Map]":
    case "[object Set]":
      t >= 0 && t++;
      break;
  }
  r = pa(r), e = pa(e);
  var s = a === "[object Array]";
  if (!s) {
    if (typeof r != "object" || typeof e != "object")
      return !1;
    var l = r.constructor, u = e.constructor;
    if (l !== u && !(typeof l == "function" && l instanceof l && typeof u == "function" && u instanceof u) && "constructor" in r && "constructor" in e)
      return !1;
  }
  if (t === 0)
    return !1;
  t < 0 && (t = -1), n = n || [], o = o || [];
  for (var d = n.length; d--; )
    if (n[d] === r)
      return o[d] === e;
  if (n.push(r), o.push(e), s) {
    if (d = r.length, d !== e.length)
      return !1;
    for (; d--; )
      if (!Qo(r[d], e[d], t - 1, n, o))
        return !1;
  } else {
    var f = Object.keys(r), c = void 0;
    if (d = f.length, Object.keys(e).length !== d)
      return !1;
    for (; d--; )
      if (c = f[d], !(uf(e, c) && Qo(r[c], e[c], t - 1, n, o)))
        return !1;
  }
  return n.pop(), o.pop(), !0;
}
function pa(r) {
  return lt(r) ? r.slice() : Er(r) || Pe(r) || rn(r) || Ye(r) ? Array.from(r.entries()) : r;
}
function uf(r, e) {
  return Object.prototype.hasOwnProperty.call(r, e);
}
function $n(r) {
  return r[Symbol.iterator] = df, r;
}
function df() {
  return this;
}
if (typeof Proxy > "u" || typeof Symbol > "u")
  throw new Error("[mobx] MobX 5+ requires Proxy and Symbol objects. If your environment doesn't support Symbol or Proxy objects, please downgrade to MobX 4. For React Native Android, consider upgrading JSCore.");
try {
  process.env.NODE_ENV;
} catch {
  var ha = Un();
  typeof process > "u" && (ha.process = {}), ha.process.env = {};
}
(function() {
  function r() {
  }
  if (r.name !== "testCodeMinification" && process.env.NODE_ENV !== "production" && typeof process < "u" && process.env.IGNORE_MOBX_MINIFY_WARNING !== "true") {
    var e = ["process", "env", "NODE_ENV"].join(".");
    console.warn("[mobx] you are running a minified build, but '" + e + "' was not set to 'production' in your bundler. This results in an unnecessarily large and slow bundle");
  }
})();
typeof __MOBX_DEVTOOLS_GLOBAL_HOOK__ == "object" && __MOBX_DEVTOOLS_GLOBAL_HOOK__.injectMobx({
  spy: Cd,
  extras: {
    getDebugName: Jo
  },
  $mobx: B
});
function ff(r) {
  return !(r.prototype && r.prototype.render) && !$.isPrototypeOf(r);
}
function Tl(r) {
  var e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, t = e.prefix, n = t === void 0 ? "" : t, o = e.suffix, i = o === void 0 ? "" : o, a = r.displayName || r.name || r.constructor && r.constructor.name || "<component>";
  return n + a + i;
}
var va = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(r) {
  return typeof r;
} : function(r) {
  return r && typeof Symbol == "function" && r.constructor === Symbol && r !== Symbol.prototype ? "symbol" : typeof r;
}, Nl = function(r, e) {
  if (!(r instanceof e))
    throw new TypeError("Cannot call a class as a function");
}, Cl = /* @__PURE__ */ (function() {
  function r(e, t) {
    for (var n = 0; n < t.length; n++) {
      var o = t[n];
      o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, o.key, o);
    }
  }
  return function(e, t, n) {
    return t && r(e.prototype, t), n && r(e, n), e;
  };
})(), Ll = function(r, e) {
  if (typeof e != "function" && e !== null)
    throw new TypeError("Super expression must either be null or a function, not " + typeof e);
  r.prototype = Object.create(e && e.prototype, {
    constructor: {
      value: r,
      enumerable: !1,
      writable: !0,
      configurable: !0
    }
  }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(r, e) : r.__proto__ = e);
}, jl = function(r, e) {
  if (!r)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e && (typeof e == "object" || typeof e == "function") ? e : r;
}, ya = console;
function cf(r) {
  var e = Ko().allowStateChanges;
  return Ko().allowStateChanges = r, e;
}
function pf(r) {
  Ko().allowStateChanges = r;
}
function hf(r, e, t, n, o) {
  var i = cf(r), a = void 0;
  try {
    a = e(t, n, o);
  } finally {
    pf(i);
  }
  return a;
}
function ga(r, e) {
  var t = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : !1, n = r[e], o = Rl[e], i = n ? t === !0 ? function() {
    o.apply(this, arguments), n.apply(this, arguments);
  } : function() {
    n.apply(this, arguments), o.apply(this, arguments);
  } : o;
  r[e] = i;
}
function _a(r, e) {
  if (r == null || e == null || (typeof r > "u" ? "undefined" : va(r)) !== "object" || (typeof e > "u" ? "undefined" : va(e)) !== "object")
    return r !== e;
  var t = Object.keys(r);
  if (t.length !== Object.keys(e).length)
    return !0;
  for (var n = void 0, o = t.length - 1; n = t[o]; o--)
    if (e[n] !== r[n])
      return !0;
  return !1;
}
var Rl = {
  componentWillMount: function() {
    var e = this, t = Tl(this), n = !1, o = !1;
    function i(f) {
      var c = this[f], p = Ii("reactive " + f);
      Object.defineProperty(this, f, {
        configurable: !0,
        enumerable: !0,
        get: function() {
          return p.reportObserved(), c;
        },
        set: function(v) {
          !o && _a(c, v) ? (c = v, n = !0, p.reportChanged(), n = !1) : c = v;
        }
      });
    }
    i.call(this, "props"), i.call(this, "state");
    var a = this.render.bind(this), s = null, l = !1, u = function() {
      return s = new Vr(t + ".render()", function() {
        if (!l && (l = !0, typeof e.componentWillReact == "function" && e.componentWillReact(), e.__$mobxIsUnmounted !== !0)) {
          var c = !0;
          try {
            o = !0, n || $.prototype.forceUpdate.call(e), c = !1;
          } finally {
            o = !1, c && s.dispose();
          }
        }
      }), s.reactComponent = e, d.$mobx = s, e.render = d, d(e.props, e.state, e.context);
    }, d = function(c, p, h) {
      l = !1;
      var v = void 0, g = void 0;
      if (s.track(function() {
        try {
          g = hf(!1, a, c, p, h);
        } catch (y) {
          v = y;
        }
      }), v)
        throw v;
      return g;
    };
    this.render = u;
  },
  componentWillUnmount: function() {
    this.render.$mobx && this.render.$mobx.dispose(), this.__$mobxIsUnmounted = !0;
  },
  componentDidMount: function() {
  },
  componentDidUpdate: function() {
  },
  shouldComponentUpdate: function(e, t) {
    return this.state !== t ? !0 : _a(this.props, e);
  }
};
function Gi(r) {
  if (arguments.length > 1 && ya.warn('Mobx observer: Using observer to inject stores is not supported. Use `@connect(["store1", "store2"]) ComponentClass instead or preferably, use `@inject("store1", "store2") @observer ComponentClass` or `inject("store1", "store2")(observer(componentClass))``'), r.isMobxInjector === !0 && ya.warn("Mobx observer: You are trying to use 'observer' on a component that already has 'inject'. Please apply 'observer' before applying 'inject'"), ff(r)) {
    var e, t;
    return Gi((t = e = (function(o) {
      Ll(i, o);
      function i() {
        return Nl(this, i), jl(this, (i.__proto__ || Object.getPrototypeOf(i)).apply(this, arguments));
      }
      return Cl(i, [{
        key: "render",
        value: function() {
          return r.call(this, this.props, this.context);
        }
      }]), i;
    })($), e.displayName = Tl(r), t));
  }
  if (!r)
    throw new Error("Please pass a valid component to 'observer'");
  var n = r.prototype || r;
  return vf(n), r.isMobXReactObserver = !0, r;
}
function vf(r) {
  ga(r, "componentWillMount", !0), ga(r, "componentDidMount"), r.shouldComponentUpdate || (r.shouldComponentUpdate = Rl.shouldComponentUpdate);
}
var yf = Gi(function(r) {
  var e = r.children;
  return e[0]();
});
yf.displayName = "Observer";
var gf = typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function _f(r, e) {
  return e = { exports: {} }, r(e, e.exports), e.exports;
}
_f(function(r, e) {
  (function(t, n) {
    r.exports = n();
  })(gf, (function() {
    var t = {
      childContextTypes: !0,
      contextTypes: !0,
      defaultProps: !0,
      displayName: !0,
      getDefaultProps: !0,
      getDerivedStateFromProps: !0,
      mixins: !0,
      propTypes: !0,
      type: !0
    }, n = {
      name: !0,
      length: !0,
      prototype: !0,
      caller: !0,
      callee: !0,
      arguments: !0,
      arity: !0
    }, o = Object.defineProperty, i = Object.getOwnPropertyNames, a = Object.getOwnPropertySymbols, s = Object.getOwnPropertyDescriptor, l = Object.getPrototypeOf, u = l && l(Object);
    return function d(f, c, p) {
      if (typeof c != "string") {
        if (u) {
          var h = l(c);
          h && h !== u && d(f, h, p);
        }
        var v = i(c);
        a && (v = v.concat(a(c)));
        for (var g = 0; g < v.length; ++g) {
          var y = v[g];
          if (!t[y] && !n[y] && (!p || !p[y])) {
            var _ = s(c, y);
            try {
              o(f, y, _);
            } catch {
            }
          }
        }
        return f;
      }
      return f;
    };
  }));
});
var ma = { children: !0, key: !0, ref: !0 }, xa = console;
(function(r) {
  Ll(e, r);
  function e() {
    return Nl(this, e), jl(this, (e.__proto__ || Object.getPrototypeOf(e)).apply(this, arguments));
  }
  return Cl(e, [{
    key: "render",
    value: function(n) {
      var o = n.children;
      return o.length > 1 ? ur(
        "div",
        null,
        " ",
        o,
        " "
      ) : o[0];
    }
  }, {
    key: "getChildContext",
    value: function() {
      var n = {}, o = this.context.mobxStores;
      if (o)
        for (var i in o)
          n[i] = o[i];
      for (var a in this.props)
        !ma[a] && a !== "suppressChangedStoreWarning" && (n[a] = this.props[a]);
      return {
        mobxStores: n
      };
    }
  }, {
    key: "componentWillReceiveProps",
    value: function(n) {
      if (Object.keys(n).length !== Object.keys(this.props).length && xa.warn("MobX Provider: The set of provided stores has changed. Please avoid changing stores as the change might not propagate to all children"), !n.suppressChangedStoreWarning)
        for (var o in n)
          !ma[o] && this.props[o] !== n[o] && xa.warn("MobX Provider: Provided store '" + o + "' has changed. Please avoid replacing stores as the change might not propagate to all children");
    }
  }]), e;
})($);
if (!$)
  throw new Error("mobx-preact requires Preact to be available");
var ot, Ao, Ea, Il = [], Ee = F, ba = Ee.__b, Oa = Ee.__r, wa = Ee.diffed, Sa = Ee.__c, Aa = Ee.unmount, Ma = Ee.__;
function mf() {
  for (var r; r = Il.shift(); ) {
    var e = r.__H;
    if (r.__P && e) try {
      e.__h.some(Rn), e.__h.some(ei), e.__h = [];
    } catch (t) {
      e.__h = [], Ee.__e(t, r.__v);
    }
  }
}
Ee.__b = function(r) {
  ot = null, ba && ba(r);
}, Ee.__ = function(r, e) {
  r && e.__k && e.__k.__m && (r.__m = e.__k.__m), Ma && Ma(r, e);
}, Ee.__r = function(r) {
  Oa && Oa(r);
  var e = (ot = r.__c).__H;
  e && (Ao === ot ? (e.__h = [], ot.__h = [], e.__.some(function(t) {
    t.__N && (t.__ = t.__N), t.u = t.__N = void 0;
  })) : (e.__h.some(Rn), e.__h.some(ei), e.__h = [])), Ao = ot;
}, Ee.diffed = function(r) {
  wa && wa(r);
  var e = r.__c;
  e && e.__H && (e.__H.__h.length && (Il.push(e) !== 1 && Ea === Ee.requestAnimationFrame || ((Ea = Ee.requestAnimationFrame) || xf)(mf)), e.__H.__.some(function(t) {
    t.u && (t.__H = t.u, t.u = void 0);
  })), Ao = ot = null;
}, Ee.__c = function(r, e) {
  e.some(function(t) {
    try {
      t.__h.some(Rn), t.__h = t.__h.filter(function(n) {
        return !n.__ || ei(n);
      });
    } catch (n) {
      e.some(function(o) {
        o.__h && (o.__h = []);
      }), e = [], Ee.__e(n, t.__v);
    }
  }), Sa && Sa(r, e);
}, Ee.unmount = function(r) {
  Aa && Aa(r);
  var e, t = r.__c;
  t && t.__H && (t.__H.__.some(function(n) {
    try {
      Rn(n);
    } catch (o) {
      e = o;
    }
  }), t.__H = void 0, e && Ee.__e(e, t.__v));
};
var Pa = typeof requestAnimationFrame == "function";
function xf(r) {
  var e, t = function() {
    clearTimeout(n), Pa && cancelAnimationFrame(e), setTimeout(r);
  }, n = setTimeout(t, 35);
  Pa && (e = requestAnimationFrame(t));
}
function Rn(r) {
  var e = ot, t = r.__c;
  typeof t == "function" && (r.__c = void 0, t()), ot = e;
}
function ei(r) {
  var e = ot;
  r.__c = r.__(), ot = e;
}
function Ef(r, e) {
  for (var t in e) r[t] = e[t];
  return r;
}
function Da(r, e) {
  for (var t in r) if (t !== "__source" && !(t in e)) return !0;
  for (var n in e) if (n !== "__source" && r[n] !== e[n]) return !0;
  return !1;
}
function Ta(r, e) {
  this.props = r, this.context = e;
}
(Ta.prototype = new $()).isPureReactComponent = !0, Ta.prototype.shouldComponentUpdate = function(r, e) {
  return Da(this.props, r) || Da(this.state, e);
};
var Na = F.__b;
F.__b = function(r) {
  r.type && r.type.__f && r.ref && (r.props.ref = r.ref, r.ref = null), Na && Na(r);
};
var bf = F.__e;
F.__e = function(r, e, t, n) {
  if (r.then) {
    for (var o, i = e; i = i.__; ) if ((o = i.__c) && o.__c) return e.__e == null && (e.__e = t.__e, e.__k = t.__k || []), o.__c(r, e);
  }
  bf(r, e, t, n);
};
var Ca = F.unmount;
function kl(r, e, t) {
  return r && (r.__c && r.__c.__H && (r.__c.__H.__.forEach(function(n) {
    typeof n.__c == "function" && n.__c();
  }), r.__c.__H = null), (r = Ef({}, r)).__c != null && (r.__c.__P === t && (r.__c.__P = e), r.__c.__e = !0, r.__c = null), r.__k = r.__k && r.__k.map(function(n) {
    return kl(n, e, t);
  })), r;
}
function Bl(r, e, t) {
  return r && t && (r.__v = null, r.__k = r.__k && r.__k.map(function(n) {
    return Bl(n, e, t);
  }), r.__c && r.__c.__P === e && (r.__e && t.appendChild(r.__e), r.__c.__e = !0, r.__c.__P = t)), r;
}
function Mo() {
  this.__u = 0, this.o = null, this.__b = null;
}
function Xl(r) {
  var e = r.__ && r.__.__c;
  return e && e.__a && e.__a(r);
}
function hn() {
  this.i = null, this.l = null;
}
F.unmount = function(r) {
  var e = r.__c;
  e && (e.__z = !0), e && e.__R && e.__R(), e && 32 & r.__u && (r.type = null), Ca && Ca(r);
}, (Mo.prototype = new $()).__c = function(r, e) {
  var t = e.__c, n = this;
  n.o == null && (n.o = []), n.o.push(t);
  var o = Xl(n.__v), i = !1, a = function() {
    i || n.__z || (i = !0, t.__R = null, o ? o(l) : l());
  };
  t.__R = a;
  var s = t.__P;
  t.__P = null;
  var l = function() {
    if (!--n.__u) {
      if (n.state.__a) {
        var u = n.state.__a;
        n.__v.__k[0] = Bl(u, u.__c.__P, u.__c.__O);
      }
      var d;
      for (n.setState({ __a: n.__b = null }); d = n.o.pop(); ) d.__P = s, d.forceUpdate();
    }
  };
  n.__u++ || 32 & e.__u || n.setState({ __a: n.__b = n.__v.__k[0] }), r.then(a, a);
}, Mo.prototype.componentWillUnmount = function() {
  this.o = [];
}, Mo.prototype.render = function(r, e) {
  if (this.__b) {
    if (this.__v.__k) {
      var t = document.createElement("div"), n = this.__v.__k[0].__c;
      this.__v.__k[0] = kl(this.__b, t, n.__O = n.__P);
    }
    this.__b = null;
  }
  var o = e.__a && ur(dr, null, r.fallback);
  return o && (o.__u &= -33), [ur(dr, null, e.__a ? null : r.children), o];
};
var La = function(r, e, t) {
  if (++t[1] === t[0] && r.l.delete(e), r.props.revealOrder && (r.props.revealOrder[0] !== "t" || !r.l.size)) for (t = r.i; t; ) {
    for (; t.length > 3; ) t.pop()();
    if (t[1] < t[0]) break;
    r.i = t = t[2];
  }
};
(hn.prototype = new $()).__a = function(r) {
  var e = this, t = Xl(e.__v), n = e.l.get(r);
  return n[0]++, function(o) {
    var i = function() {
      e.props.revealOrder ? (n.push(o), La(e, r, n)) : o();
    };
    t ? t(i) : i();
  };
}, hn.prototype.render = function(r) {
  this.i = null, this.l = /* @__PURE__ */ new Map();
  var e = Xn(r.children);
  r.revealOrder && r.revealOrder[0] === "b" && e.reverse();
  for (var t = e.length; t--; ) this.l.set(e[t], this.i = [1, 0, this.i]);
  return r.children;
}, hn.prototype.componentDidUpdate = hn.prototype.componentDidMount = function() {
  var r = this;
  this.l.forEach(function(e, t) {
    La(r, t, e);
  });
};
var Of = typeof Symbol < "u" && Symbol.for && /* @__PURE__ */ Symbol.for("react.element") || 60103, wf = /^(?:accent|alignment|arabic|baseline|cap|clip(?!PathU)|color|dominant|fill|flood|font|glyph(?!R)|horiz|image(!S)|letter|lighting|marker(?!H|W|U)|overline|paint|pointer|shape|stop|strikethrough|stroke|text(?!L)|transform|underline|unicode|units|v|vector|vert|word|writing|x(?!C))[A-Z]/, Sf = /^on(Ani|Tra|Tou|BeforeInp|Compo)/, Af = /[A-Z0-9]/g, Mf = typeof document < "u", Pf = function(r) {
  return (typeof Symbol < "u" && typeof /* @__PURE__ */ Symbol() == "symbol" ? /fil|che|rad/ : /fil|che|ra/).test(r);
};
function ja(r, e, t) {
  return e.__k == null && (e.textContent = ""), Wu(r, e), typeof t == "function" && t(), r ? r.__c : null;
}
$.prototype.isReactComponent = !0, ["componentWillMount", "componentWillReceiveProps", "componentWillUpdate"].forEach(function(r) {
  Object.defineProperty($.prototype, r, { configurable: !0, get: function() {
    return this["UNSAFE_" + r];
  }, set: function(e) {
    Object.defineProperty(this, r, { configurable: !0, writable: !0, value: e });
  } });
});
var Ra = F.event;
F.event = function(r) {
  return Ra && (r = Ra(r)), r.persist = function() {
  }, r.isPropagationStopped = function() {
    return this.cancelBubble;
  }, r.isDefaultPrevented = function() {
    return this.defaultPrevented;
  }, r.nativeEvent = r;
};
var Df = { configurable: !0, get: function() {
  return this.class;
} }, Ia = F.vnode;
F.vnode = function(r) {
  typeof r.type == "string" && (function(e) {
    var t = e.props, n = e.type, o = {}, i = n.indexOf("-") == -1;
    for (var a in t) {
      var s = t[a];
      if (!(a === "value" && "defaultValue" in t && s == null || Mf && a === "children" && n === "noscript" || a === "class" || a === "className")) {
        var l = a.toLowerCase();
        a === "defaultValue" && "value" in t && t.value == null ? a = "value" : a === "download" && s === !0 ? s = "" : l === "translate" && s === "no" ? s = !1 : l[0] === "o" && l[1] === "n" ? l === "ondoubleclick" ? a = "ondblclick" : l !== "onchange" || n !== "input" && n !== "textarea" || Pf(t.type) ? l === "onfocus" ? a = "onfocusin" : l === "onblur" ? a = "onfocusout" : Sf.test(a) && (a = l) : l = a = "oninput" : i && wf.test(a) ? a = a.replace(Af, "-$&").toLowerCase() : s === null && (s = void 0), l === "oninput" && o[a = l] && (a = "oninputCapture"), o[a] = s;
      }
    }
    n == "select" && (o.multiple && Array.isArray(o.value) && (o.value = Xn(t.children).forEach(function(u) {
      u.props.selected = o.value.indexOf(u.props.value) != -1;
    })), o.defaultValue != null && (o.value = Xn(t.children).forEach(function(u) {
      u.props.selected = o.multiple ? o.defaultValue.indexOf(u.props.value) != -1 : o.defaultValue == u.props.value;
    }))), t.class && !t.className ? (o.class = t.class, Object.defineProperty(o, "className", Df)) : t.className && (o.class = o.className = t.className), e.props = o;
  })(r), r.$$typeof = Of, Ia && Ia(r);
};
var ka = F.__r;
F.__r = function(r) {
  ka && ka(r), r.__c;
};
var Ba = F.diffed;
F.diffed = function(r) {
  Ba && Ba(r);
  var e = r.props, t = r.__e;
  t != null && r.type === "textarea" && "value" in e && e.value !== t.value && (t.value = e.value == null ? "" : e.value);
};
var Tf = 0;
function w(r, e, t, n, o, i) {
  e || (e = {});
  var a, s, l = e;
  if ("ref" in l) for (s in l = {}, e) s == "ref" ? a = e[s] : l[s] = e[s];
  var u = { type: r, props: l, key: t, ref: a, __k: null, __: null, __b: 0, __e: null, __c: null, constructor: void 0, __v: --Tf, __i: -1, __u: 0, __source: o, __self: i };
  if (typeof r == "function" && (a = r.defaultProps)) for (s in a) l[s] === void 0 && (l[s] = a[s]);
  return F.vnode && F.vnode(u), u;
}
var Nf = function(r, e) {
  var t = {};
  for (var n in r) Object.prototype.hasOwnProperty.call(r, n) && e.indexOf(n) < 0 && (t[n] = r[n]);
  if (r != null && typeof Object.getOwnPropertySymbols == "function")
    for (var o = 0, n = Object.getOwnPropertySymbols(r); o < n.length; o++)
      e.indexOf(n[o]) < 0 && Object.prototype.propertyIsEnumerable.call(r, n[o]) && (t[n[o]] = r[n[o]]);
  return t;
}, $r;
(function(r) {
  function e(t) {
    var n = Nf(t, []), o = t.container;
    if (!o)
      throw new Error("Ensure the container of LogicFlow is specified and valid.");
    return V({}, r.defaults, n);
  }
  r.get = e;
})($r || ($r = {}));
(function(r) {
  r.defaults = {
    background: !1,
    grid: !1,
    textEdit: !0,
    snapline: !0,
    outline: !1,
    disabledTools: []
  };
})($r || ($r = {}));
var Xa = {
  node: !1,
  edge: !1
}, Cf = {
  node: !0,
  edge: !0
}, Lf = function(r) {
  return !r || typeof r == "boolean" ? r === !0 ? I(Cf) : I(Xa) : wi(I(Xa), r);
}, jf = function() {
  return uo(window, "navigator.userAgent", "").match(/MSIE|Trident/) !== null;
};
function Se(r) {
  try {
    return JSON.parse(JSON.stringify(r));
  } catch {
    return r;
  }
}
var go = 10, Rf = {
  baseNode: {
    fill: "#fff",
    stroke: "#474747",
    strokeWidth: 2,
    radius: 12
  },
  baseEdge: {
    stroke: "#474747",
    strokeWidth: 2,
    radius: 12
  },
  rect: {
    shadow: {
      dx: 0,
      dy: 0,
      stdDeviation: 4,
      floodColor: "#9CA1AA55"
    }
  },
  circle: {},
  diamond: {},
  ellipse: {},
  polygon: {},
  html: {
    fill: "transparent",
    stroke: "transparent",
    shadow: {
      dx: 0,
      dy: 0,
      stdDeviation: 4,
      floodColor: "#9CA1AA55"
    }
  },
  text: {
    color: "#474747",
    stroke: "none",
    fontSize: 12,
    background: {
      fill: "transparent"
    }
  },
  nodeText: {
    color: "#474747",
    overflowMode: "default",
    fontSize: 12,
    lineHeight: 1.2
  },
  anchor: {
    stroke: "#474747",
    fill: "#fff",
    r: 4,
    hover: {
      r: 8,
      fill: "#707070",
      fillOpacity: 0.15,
      stroke: "transparent"
    }
  },
  anchorLine: {
    stroke: "#474747",
    strokeWidth: 2,
    strokeDasharray: "3,2"
  },
  line: {},
  polyline: {},
  bezier: {
    fill: "none",
    adjustLine: {
      stroke: "#949494"
    },
    adjustAnchor: {
      r: 4,
      fill: "#949494",
      fillOpacity: 1,
      stroke: "#949494"
    }
  },
  edgeText: {
    textWidth: 100,
    overflowMode: "default",
    fontSize: 12,
    background: {
      fill: "#fff"
    }
  },
  arrow: {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    offset: 10,
    verticalLength: 5
    // 箭头垂直于边的距离
  },
  snapline: {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    stroke: "#AAAAAA",
    strokeWidth: 1,
    strokeDasharray: "3,3"
  },
  edgeAdjust: {
    r: 4,
    fill: "#fff",
    stroke: "#474747",
    strokeWidth: 1
  },
  outline: {
    fill: "none",
    stroke: "transparent",
    // 矩形默认不显示调整边框
    strokeWidth: 0
  },
  edgeOutline: {
    fill: "transparent",
    stroke: "#757575",
    strokeWidth: 1.5,
    strokeDasharray: "4,4",
    radius: 8,
    hover: {
      stroke: "#4271DF"
    }
  },
  edgeAnimation: {
    stroke: "#4271DF",
    strokeDasharray: "12,4,6,4",
    strokeDashoffset: "100%",
    animationName: "lf_animate_dash",
    animationDuration: "20s",
    animationIterationCount: "infinite",
    animationTimingFunction: "linear",
    animationDirection: "normal"
  },
  rotateControl: {
    stroke: "#474747",
    fill: "#fff",
    strokeWidth: 1,
    hover: {
      fill: "#707070",
      fillOpacity: 0.15,
      stroke: "transparent"
    }
  },
  resizeControl: {
    width: 8,
    height: 8,
    radius: 2,
    fill: "#fff",
    stroke: "#474747",
    hover: {
      width: 12,
      height: 12,
      fill: "#707070",
      fillOpacity: 0.15,
      stroke: "transparent"
    }
  },
  resizeOutline: {
    fill: "transparent",
    stroke: "#757575",
    strokeWidth: 1.5,
    strokeDasharray: "4,4",
    radius: 8,
    hover: {
      stroke: "#4271DF"
    }
  }
}, If = {
  baseNode: {
    fill: "#fff",
    stroke: "#000",
    strokeWidth: 2
  },
  baseEdge: {
    stroke: "#000",
    strokeWidth: 2
  },
  rect: {},
  circle: {},
  diamond: {},
  ellipse: {},
  polygon: {},
  html: {
    fill: "transparent",
    stroke: "transparent"
  },
  text: {
    color: "#000",
    stroke: "none",
    fontSize: 12,
    background: {
      fill: "transparent"
    }
  },
  anchor: {
    stroke: "#000",
    fill: "#fff",
    r: 4,
    hover: {
      r: 10,
      fill: "#949494",
      fillOpacity: 0.5,
      stroke: "#949494"
    }
  },
  anchorLine: {
    stroke: "#000",
    strokeWidth: 2,
    strokeDasharray: "3,2"
  },
  nodeText: {
    color: "#000",
    overflowMode: "default",
    fontSize: 12,
    lineHeight: 1.2
  },
  edgeText: {
    textWidth: 100,
    overflowMode: "default",
    fontSize: 12,
    background: {
      fill: "#fff"
    }
  },
  line: {},
  polyline: {},
  bezier: {
    fill: "none",
    adjustLine: {
      stroke: "#949494"
    },
    adjustAnchor: {
      r: 4,
      fill: "#949494",
      fillOpacity: 1,
      stroke: "#949494"
    }
  },
  arrow: {
    offset: 10,
    verticalLength: 5
    // 箭头垂直于边的距离
  },
  snapline: {
    stroke: "#949494",
    strokeWidth: 1
  },
  edgeAdjust: {
    r: 4,
    fill: "#fff",
    stroke: "#949494",
    strokeWidth: 2
  },
  outline: {
    fill: "transparent",
    stroke: "#949494",
    strokeDasharray: "3,3",
    hover: {
      stroke: "#949494"
    }
  },
  edgeOutline: {
    fill: "transparent",
    stroke: "#949494",
    strokeDasharray: "3,3",
    hover: {
      stroke: "#949494"
    }
  },
  edgeAnimation: {
    stroke: "red",
    strokeDasharray: "10,10",
    strokeDashoffset: "100%",
    animationName: "lf_animate_dash",
    animationDuration: "20s",
    animationIterationCount: "infinite",
    animationTimingFunction: "linear",
    animationDirection: "normal"
  },
  rotateControl: {
    stroke: "#000",
    fill: "#fff",
    strokeWidth: 1.5
  },
  resizeControl: {
    width: 7,
    height: 7,
    fill: "#fff",
    stroke: "#000"
  },
  resizeOutline: {
    fill: "none",
    stroke: "transparent",
    // 矩形默认不显示调整边框
    strokeWidth: 1,
    strokeDasharray: "3,3"
  }
}, kf = {
  baseNode: {
    fill: "#33353A",
    stroke: "#EAEAEA",
    strokeWidth: 2,
    radius: 12
  },
  baseEdge: {
    stroke: "#EAEAEA",
    strokeWidth: 2,
    radius: 12
  },
  rect: {},
  circle: {},
  diamond: {},
  ellipse: {},
  polygon: {},
  html: {
    fill: "#33353A",
    stroke: "transparent",
    shadow: {
      dx: 0,
      dy: 0,
      stdDeviation: 4,
      floodColor: "#9CA1AA55"
    }
  },
  text: {
    color: "#EAEAEA",
    stroke: "none",
    fontSize: 12,
    background: {
      fill: "transparent"
    }
  },
  nodeText: {
    color: "#EAEAEA",
    overflowMode: "default",
    fontSize: 12,
    lineHeight: 1.2
  },
  anchor: {
    stroke: "#EAEAEA",
    fill: "#33353A",
    r: 4,
    hover: {
      r: 8,
      fill: "#707070",
      fillOpacity: 0.15,
      stroke: "transparent"
    }
  },
  anchorLine: {
    stroke: "#EAEAEA",
    strokeWidth: 2,
    strokeDasharray: "3,2"
  },
  line: {},
  polyline: {},
  bezier: {
    fill: "none",
    adjustLine: {
      stroke: "#EAEAEA"
    },
    adjustAnchor: {
      r: 4,
      fill: "#33353A",
      fillOpacity: 1,
      stroke: "#EAEAEA"
    }
  },
  edgeText: {
    textWidth: 100,
    overflowMode: "default",
    fontSize: 12,
    background: {
      fill: "#EAEAEA"
    }
  },
  arrow: {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    offset: 10,
    verticalLength: 5
    // 箭头垂直于边的距离
  },
  snapline: {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    stroke: "#949494",
    strokeWidth: 1
  },
  edgeAdjust: {
    r: 4,
    fill: "#33353A",
    stroke: "#EAEAEA",
    strokeWidth: 1
  },
  outline: {
    fill: "none",
    stroke: "transparent",
    // 矩形默认不显示调整边框
    strokeWidth: 0
  },
  edgeOutline: {
    fill: "transparent",
    stroke: "#EAEAEA",
    strokeWidth: 1.5,
    strokeDasharray: "4,4",
    radius: 8,
    hover: {
      stroke: "#4271DF"
    }
  },
  edgeAnimation: {
    stroke: "#4271DF",
    strokeDasharray: "12,4,6,4",
    strokeDashoffset: "100%",
    animationName: "lf_animate_dash",
    animationDuration: "20s",
    animationIterationCount: "infinite",
    animationTimingFunction: "linear",
    animationDirection: "normal"
  },
  rotateControl: {
    stroke: "#EAEAEA",
    fill: "#33353A",
    strokeWidth: 1,
    hover: {
      fill: "#707070",
      fillOpacity: 0.15,
      stroke: "transparent"
    }
  },
  resizeControl: {
    width: 8,
    height: 8,
    radius: 2,
    fill: "#33353A",
    stroke: "#EAEAEA",
    hover: {
      width: 12,
      height: 12,
      fill: "#707070",
      fillOpacity: 0.15,
      stroke: "transparent"
    }
  },
  resizeOutline: {
    fill: "transparent",
    stroke: "#EAEAEA",
    strokeWidth: 1.5,
    strokeDasharray: "4,4",
    radius: 8,
    hover: {
      stroke: "#4271DF"
    }
  }
}, Bf = {
  baseNode: {
    fill: "#fff",
    stroke: "#474747",
    strokeWidth: 2,
    radius: 12
  },
  baseEdge: {
    stroke: "#474747",
    strokeWidth: 2,
    radius: 12
  },
  rect: { fill: "#72CBFF", stroke: "#3ABDF9", radius: 8 },
  circle: { fill: "#FFE075", stroke: "#F9CE3A", radius: 8 },
  ellipse: { fill: "#FFA8A8", stroke: "#FF6B66", radius: 8 },
  text: { fill: "#72CBFF", radius: 8, fontSize: 12 },
  diamond: { fill: "#96F7AF", stroke: "#40EF7E", radius: 8 },
  polygon: { fill: "#E0A8FF", stroke: "#C271FF", radius: 8 },
  nodeText: {
    color: "#474747",
    overflowMode: "default",
    fontSize: 12,
    lineHeight: 1.2
  },
  edgeText: {
    textWidth: 100,
    overflowMode: "default",
    fontSize: 12,
    background: {
      fill: "#fff"
    }
  },
  html: {
    fill: "#fff",
    stroke: "transparent",
    strokeWidth: 0
  },
  anchor: {
    stroke: "#474747",
    fill: "#fff",
    r: 4,
    hover: {
      r: 8,
      fill: "#707070",
      fillOpacity: 0.15,
      stroke: "transparent"
    }
  },
  anchorLine: {
    stroke: "#474747",
    strokeWidth: 2,
    strokeDasharray: "3,2"
  },
  line: {},
  polyline: { radius: 8 },
  bezier: {
    fill: "none",
    adjustLine: {
      stroke: "#3ABDF9"
    },
    adjustAnchor: {
      r: 4,
      fill: "#3ABDF9",
      fillOpacity: 1,
      stroke: "#3ABDF9"
    }
  },
  edgeAdjust: {
    r: 4,
    fill: "#fff",
    stroke: "#474747",
    strokeWidth: 1
  },
  arrow: {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    offset: 10,
    verticalLength: 5
    // 箭头垂直于边的距离
  },
  snapline: {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    stroke: "#949494",
    strokeWidth: 1
  },
  outline: {
    radius: 8,
    fill: "transparent",
    stroke: "#949494",
    strokeDasharray: "3,3",
    hover: {
      stroke: "#949494"
    }
  },
  edgeOutline: {
    fill: "transparent",
    stroke: "#757575",
    strokeWidth: 1.5,
    strokeDasharray: "4,4",
    radius: 8,
    hover: {
      stroke: "#4271DF"
    }
  },
  edgeAnimation: {
    stroke: "#4271DF",
    strokeDasharray: "12,4,6,4",
    strokeDashoffset: "100%",
    animationName: "lf_animate_dash",
    animationDuration: "20s",
    animationIterationCount: "infinite",
    animationTimingFunction: "linear",
    animationDirection: "normal"
  },
  rotateControl: {
    stroke: "#474747",
    fill: "#fff",
    strokeWidth: 1,
    hover: {
      fill: "#707070",
      fillOpacity: 0.15,
      stroke: "transparent"
    }
  },
  resizeControl: {
    width: 8,
    height: 8,
    radius: 2,
    fill: "#fff",
    stroke: "#474747",
    hover: {
      width: 12,
      height: 12,
      fill: "#707070",
      fillOpacity: 0.15,
      stroke: "transparent"
    }
  },
  resizeOutline: {
    fill: "transparent",
    stroke: "#757575",
    strokeWidth: 1.5,
    strokeDasharray: "4,4",
    radius: 8,
    hover: {
      stroke: "#4271DF"
    }
  }
}, yr = {
  default: Rf,
  colorful: Bf,
  dark: kf,
  retro: If
}, Xf = {
  background: "#33353A"
}, Yf = {
  background: "#fefeff"
}, Yl = {
  background: "#FBFCFE"
}, Ff = {
  background: "#ffffff"
}, Ct = {
  colorful: Yf,
  dark: Xf,
  default: Yl,
  retro: Ff
}, Hf = {
  size: go,
  visible: !0,
  type: "mesh",
  config: {
    color: "#83838377",
    thickness: 2
  },
  majorBold: !0
}, Gf = {
  size: go,
  visible: !0,
  type: "dot",
  config: {
    color: "#b7c2d9",
    thickness: 2
  },
  majorBold: !1
}, zi = {
  size: go,
  visible: !0,
  type: "mesh",
  config: {
    color: "#D7DEEB",
    thickness: 1
  },
  // majorBold: true,
  majorBold: {
    opacity: 0.6,
    boldIndices: [5],
    dashArrayConfig: { pattern: [] },
    customBoldWidth: 2
  }
}, zf = {
  size: go,
  visible: !0,
  type: "dot",
  config: {
    color: "#ababab",
    thickness: 1
  },
  majorBold: !1
}, Lt = {
  colorful: Gf,
  dark: Hf,
  retro: zf,
  default: zi
}, vn = 200, Uf = 9999, q;
(function(r) {
  r[r.DEFAULT = 1] = "DEFAULT", r[r.TEXT_EDIT = 2] = "TEXT_EDIT", r[r.SHOW_MENU = 3] = "SHOW_MENU", r[r.ALLOW_CONNECT = 4] = "ALLOW_CONNECT", r[r.NOT_ALLOW_CONNECT = 5] = "NOT_ALLOW_CONNECT";
})(q || (q = {}));
var fe;
(function(r) {
  r.NODE = "node", r.EDGE = "edge", r.GRAPH = "graph";
})(fe || (fe = {}));
var G;
(function(r) {
  r.NODE = "node", r.CIRCLE_NODE = "circle-node", r.POLYGON_NODE = "polygon-node", r.RECT_NODE = "rect-node", r.TEXT_NODE = "text-node", r.ELLIPSE_NODE = "ellipse-node", r.DIAMOND_NODE = "diamond-node", r.HTML_NODE = "html-node", r.CUSTOM_HTML_NODE = "custom-html-node", r.EDGE = "edge", r.LINE_EDGE = "line-edge", r.POLYLINE_EDGE = "polyline-edge", r.BEZIER_EDGE = "bezier-edge", r.GRAPH = "graph";
})(G || (G = {}));
var C;
(function(r) {
  r.ELEMENT_CLICK = "element:click", r.NODE_ADD = "node:add", r.NODE_DELETE = "node:delete", r.NODE_CLICK = "node:click", r.NODE_DBCLICK = "node:dbclick", r.NODE_GROUP_COPY = "node:group-copy-add", r.NODE_DND_ADD = "node:dnd-add", r.NODE_DND_DRAG = "node:dnd-drag", r.NODE_MOUSEDOWN = "node:mousedown", r.NODE_DRAGSTART = "node:dragstart", r.NODE_DRAG = "node:drag", r.NODE_DROP = "node:drop", r.NODE_MOUSEUP = "node:mouseup", r.NODE_MOUSEMOVE = "node:mousemove", r.NODE_MOUSEENTER = "node:mouseenter", r.NODE_MOUSELEAVE = "node:mouseleave", r.NODE_CONTEXTMENU = "node:contextmenu", r.NODE_ROTATE = "node:rotate", r.NODE_RESIZE = "node:resize", r.NODE_FOCUS = "node:focus", r.NODE_BLUR = "node:blur", r.NODE_PROPERTIES_CHANGE = "node:properties-change", r.NODE_PROPERTIES_DELETE = "node:properties-delete", r.EDGE_ADD = "edge:add", r.EDGE_DELETE = "edge:delete", r.EDGE_CLICK = "edge:click", r.EDGE_DBCLICK = "edge:dbclick", r.EDGE_FOCUS = "edge:focus", r.EDGE_BLUR = "edge:blur", r.EDGE_MOUSEENTER = "edge:mouseenter", r.EDGE_MOUSELEAVE = "edge:mouseleave", r.EDGE_CONTEXTMENU = "edge:contextmenu", r.EDGE_ADJUST = "edge:adjust", r.EDGE_EXCHANGE_NODE = "edge:exchange-node", r.ANCHOR_CLICK = "anchor:click", r.ANCHOR_MOUSEDOWN = "anchor:mousedown", r.ANCHOR_DRAGSTART = "anchor:dragstart", r.ANCHOR_DRAG = "anchor:drag", r.ANCHOR_DROP = "anchor:drop", r.ANCHOR_DRAGEND = "anchor:dragend", r.ADJUST_POINT_MOUSEDOWN = "adjustPoint:mousedown", r.ADJUST_POINT_MOUSEUP = "adjustPoint:mouseup", r.ADJUST_POINT_MOUSEMOVE = "adjustPoint:mousemove", r.ADJUST_POINT_DRAGSTART = "adjustPoint:dragstart", r.ADJUST_POINT_DRAG = "adjustPoint:drag", r.ADJUST_POINT_DROP = "adjustPoint:drop", r.ADJUST_POINT_DRAGEND = "adjustPoint:dragend", r.BLANK_MOUSEDOWN = "blank:mousedown", r.BLANK_DRAGSTART = "blank:dragstart", r.BLANK_DRAG = "blank:drag", r.BLANK_DROP = "blank:drop", r.BLANK_MOUSEMOVE = "blank:mousemove", r.BLANK_CANVAS_MOUSEMOVE = "blank:canvas-mousemove", r.BLANK_MOUSEUP = "blank:mouseup", r.BLANK_CLICK = "blank:click", r.BLANK_CONTEXTMENU = "blank:contextmenu", r.SELECTION_MOUSEDOWN = "selection:mousedown", r.SELECTION_DRAGSTART = "selection:dragstart", r.SELECTION_DRAG = "selection:drag", r.SELECTION_DROP = "selection:drop", r.SELECTION_MOUSEMOVE = "selection:mousemove", r.SELECTION_MOUSEUP = "selection:mouseup", r.SELECTION_CONTEXTMENU = "selection:contextmenu", r.CONNECTION_NOT_ALLOWED = "connection:not-allowed", r.TEXT_MOUSEDOWN = "text:mousedown", r.TEXT_DRAGSTART = "text:dragstart", r.TEXT_DRAG = "text:drag", r.TEXT_DROP = "text:drop", r.TEXT_CLICK = "text:click", r.TEXT_DBCLICK = "text:dbclick", r.TEXT_BLUR = "text:blur", r.TEXT_MOUSEMOVE = "text:mousemove", r.TEXT_MOUSEUP = "text:mouseup", r.TEXT_FOCUS = "text:focus", r.TEXT_ADD = "text:add", r.TEXT_UPDATE = "text:update", r.TEXT_CLEAR = "text:clear", r.LABEL_MOUSEDOWN = "label:mousedown", r.LABEL_DRAGSTART = "label:dragstart", r.LABEL_DRAG = "label:drag", r.LABEL_DROP = "label:drop", r.LABEL_CLICK = "label:click", r.LABEL_DBCLICK = "label:dbclick", r.LABEL_BLUR = "label:blur", r.LABEL_MOUSEMOVE = "label:mousemove", r.LABEL_MOUSEUP = "label:mouseup", r.LABEL_FOCUS = "label:focus", r.LABEL_ADD = "label:add", r.LABEL_UPDATE = "label:update", r.LABEL_CLEAR = "label:clear", r.LABEL_DELETE = "label:delete", r.LABEL_SHOULD_ADD = "label:should-add", r.LABEL_BATCH_ADD = "label:batch-add", r.LABEL_SHOULD_UPDATE = "label:should-update", r.LABEL_SHOULD_DELETE = "label:should-delete", r.LABEL_BATCH_DELETE = "label:batch-delete", r.LABEL_NOT_ALLOWED_ADD = "label:not-allowed-add", r.HISTORY_CHANGE = "history:change", r.GRAPH_TRANSFORM = "graph:transform", r.GRAPH_RENDERED = "graph:rendered", r.GRAPH_UPDATED = "graph:updated", r.EDIT_CONFIG_CHANGED = "editConfig:changed";
})(C || (C = {}));
var _e;
(function(r) {
  r[r.STATIC = -1] = "STATIC", r[r.DEFAULT = 0] = "DEFAULT", r[r.INCREASE = 1] = "INCREASE", r[r.EDGE_TOP = 2] = "EDGE_TOP";
})(_e || (_e = {}));
var z;
(function(r) {
  r.HORIZONTAL = "horizontal", r.VERTICAL = "vertical";
})(z || (z = {}));
var Xe;
(function(r) {
  r.TEXT = "text", r.LABEL = "label";
})(Xe || (Xe = {}));
var Vf = 0, ut = (
  /** @class */
  (function() {
    function r(e) {
      var t = e.onDragStart, n = t === void 0 ? bo : t, o = e.onDragging, i = o === void 0 ? bo : o, a = e.onDragEnd, s = a === void 0 ? bo : a, l = e.eventType, u = l === void 0 ? "" : l, d = e.eventCenter, f = e.step, c = f === void 0 ? 1 : f, p = e.isStopPropagation, h = p === void 0 ? !0 : p, v = e.model, g = e.data, y = this;
      this.isDragging = !1, this.isStartDragging = !1, this.startX = 0, this.startY = 0, this.sumDeltaX = 0, this.sumDeltaY = 0, this.handleMouseDown = function(_) {
        var S, A, x = window?.document;
        if (_.button === Vf) {
          y.isStopPropagation && _.stopPropagation(), y.isStartDragging = !0, y.startX = _.clientX, y.startY = _.clientY, x.addEventListener("pointermove", y.handleMouseMove, !1), x.addEventListener("pointerup", y.handleMouseUp, !1);
          var E = (S = y.model) === null || S === void 0 ? void 0 : S.getData();
          (A = y.eventCenter) === null || A === void 0 || A.emit(C["".concat(y.eventType, "_MOUSEDOWN")], {
            e: _,
            data: y.data || E
          }), y.startTime = (/* @__PURE__ */ new Date()).getTime();
        }
      }, this.handleMouseMove = function(_) {
        var S, A;
        if (y.isStopPropagation && _.stopPropagation(), _.preventDefault(), !!y.isStartDragging && (y.sumDeltaX += _.clientX - y.startX, y.sumDeltaY += _.clientY - y.startY, y.startX = _.clientX, y.startY = _.clientY, y.step <= 1 || Math.abs(y.sumDeltaX) > y.step || Math.abs(y.sumDeltaY) > y.step)) {
          var x = y.sumDeltaX % y.step, E = y.sumDeltaY % y.step, m = y.sumDeltaX - x, b = y.sumDeltaY - E;
          y.sumDeltaX = x, y.sumDeltaY = E;
          var P = (S = y.model) === null || S === void 0 ? void 0 : S.getData();
          y.isDragging || ((A = y.eventCenter) === null || A === void 0 || A.emit(C["".concat(y.eventType, "_DRAGSTART")], {
            e: _,
            data: y.data || P
          }), y.onDragStart({ event: _ })), y.isDragging = !0, Promise.resolve().then(function() {
            var D, k;
            y.onDragging({
              deltaX: m,
              deltaY: b,
              event: _
            }), (D = y.eventCenter) === null || D === void 0 || D.emit(C["".concat(y.eventType, "_MOUSEMOVE")], {
              deltaX: m,
              deltaY: b,
              e: _,
              data: y.data || P
            }), (k = y.eventCenter) === null || k === void 0 || k.emit(C["".concat(y.eventType, "_DRAG")], {
              e: _,
              data: y.data || P
            });
          });
        }
      }, this.handleMouseUp = function(_) {
        var S = window.document;
        y.isStartDragging = !1, y.isStopPropagation && _.stopPropagation();
        var A = _.target;
        A && typeof A.releasePointerCapture == "function" && A.releasePointerCapture(_.pointerId), Promise.resolve().then(function() {
          var x, E, m;
          S.removeEventListener("pointermove", y.handleMouseMove, !1), S.removeEventListener("pointerup", y.handleMouseUp, !1);
          var b = (x = y.model) === null || x === void 0 ? void 0 : x.getData();
          (E = y.eventCenter) === null || E === void 0 || E.emit(C["".concat(y.eventType, "_MOUSEUP")], {
            e: _,
            data: y.data || b
          }), y.isDragging && (y.isDragging = !1, y.onDragEnd({ event: _ }), (m = y.eventCenter) === null || m === void 0 || m.emit(C["".concat(y.eventType, "_DROP")], {
            e: _,
            data: y.data || b
          }));
        });
      }, this.cancelDrag = function() {
        var _ = window?.document;
        _.removeEventListener("pointermove", y.handleMouseMove, !1), _.removeEventListener("pointerup", y.handleMouseUp, !1), y.onDragEnd({ event: void 0 }), y.isDragging = !1;
      }, this.destroy = function() {
        y.isStartDragging && y.cancelDrag();
      }, this.onDragStart = n, this.onDragging = i, this.onDragEnd = s, this.step = c, this.isStopPropagation = h, this.eventType = u, this.eventCenter = d, this.model = v, this.data = g;
    }
    return r.prototype.setStep = function(e) {
      this.step = e;
    }, r.prototype.setModel = function(e) {
      this.model = e;
    }, r;
  })()
), $f = function(r) {
  var e = r.x, t = r.y, n = r.width, o = r.height;
  return {
    x: e - n / 2,
    y: t - o / 2,
    x1: e + n / 2,
    y1: t + o / 2
  };
}, Wf = function(r) {
  var e = r.startPoint, t = r.endPoint, n = (e.x + t.x) / 2, o = (e.y + t.y) / 2, i = Math.abs(e.x - t.x) + 10, a = Math.abs(e.y - t.y) + 10;
  return {
    x: n - i / 2,
    y: o - a / 2,
    x1: n + i / 2,
    y1: o + a / 2
  };
}, Kf = function(r) {
  var e = r.points, t = Et(e), n = _o(t, 8), o = n.x, i = n.y, a = n.width, s = n.height;
  return {
    x: o - a / 2,
    y: i - s / 2,
    x1: o + a / 2,
    y1: i + s / 2
  };
}, Zf = function(r) {
  var e = r.path, t = Ui(e), n = _o(t, 8), o = n.x, i = n.y, a = n.width, s = n.height;
  return {
    x: o - a / 2,
    y: i - s / 2,
    x1: o + a / 2,
    y1: i + s / 2
  };
}, qf = function(r) {
  if (r.modelType === G.LINE_EDGE)
    return Wf(r);
  if (r.modelType === G.POLYLINE_EDGE)
    return Kf(r);
  if (r.modelType === G.BEZIER_EDGE)
    return Zf(r);
}, Jf = function(r, e, t, n) {
  var o = (e.y - r.y) * (n.x - t.x) - (r.x - e.x) * (t.y - n.y);
  if (o === 0)
    return !1;
  var i = ((e.x - r.x) * (n.x - t.x) * (t.y - r.y) + (e.y - r.y) * (n.x - t.x) * r.x - (n.y - t.y) * (e.x - r.x) * t.x) / o, a = -((e.y - r.y) * (n.y - t.y) * (t.x - r.x) + (e.x - r.x) * (n.y - t.y) * r.y - (n.x - t.x) * (e.y - r.y) * t.y) / o;
  return (
    // 交点在线段1上
    (i - r.x) * (i - e.x) <= 0 && (a - r.y) * (a - e.y) <= 0 && // 且交点也在线段2上
    (i - t.x) * (i - n.x) <= 0 && (a - t.y) * (a - n.y) <= 0 ? {
      x: i,
      y: a
    } : !1
  );
}, Wr = function(r, e, t) {
  var n = r.x, o = r.y, i = e.x, a = e.y, s = t.x, l = t.y, u = (l - a) / (s - i), d = a - u * i;
  return (n >= i && n <= s || n <= i && n >= s) && (o >= a && o <= l || o <= a && o >= l) && Math.abs(o - u * n - d) < Number.EPSILON;
}, Kr = function(r) {
  var e = r.start, t = r.end, n = r.offset, o = r.verticalLength, i = r.type, a = {
    leftX: 0,
    leftY: 0,
    rightX: 0,
    rightY: 0
  }, s = Math.atan((t.y - e.y) / (t.x - e.x)), l = Math.atan(n / o), u = Math.sqrt(o * o + n * n);
  return i === "start" ? t.x >= e.x ? (a.leftX = e.x + u * Math.sin(s + l), a.leftY = e.y - u * Math.cos(s + l), a.rightX = e.x - u * Math.sin(s - l), a.rightY = e.y + u * Math.cos(s - l)) : (a.leftX = e.x - u * Math.sin(s + l), a.leftY = e.y + u * Math.cos(s + l), a.rightX = e.x + u * Math.sin(s - l), a.rightY = e.y - u * Math.cos(s - l)) : i === "end" && (t.x >= e.x ? (a.leftX = t.x + u * Math.sin(s - l), a.leftY = t.y - u * Math.cos(s - l), a.rightX = t.x - u * Math.sin(s + l), a.rightY = t.y + u * Math.cos(s + l)) : (a.leftX = t.x - u * Math.sin(s - l), a.leftY = t.y + u * Math.cos(s - l), a.rightX = t.x + u * Math.sin(s + l), a.rightY = t.y - u * Math.cos(s + l))), a;
}, rr = function() {
  return rr = Object.assign || function(r) {
    for (var e, t = 1, n = arguments.length; t < n; t++) {
      e = arguments[t];
      for (var o in e) Object.prototype.hasOwnProperty.call(e, o) && (r[o] = e[o]);
    }
    return r;
  }, rr.apply(this, arguments);
}, Be = function(r, e) {
  var t = typeof Symbol == "function" && r[Symbol.iterator];
  if (!t) return r;
  var n = t.call(r), o, i = [], a;
  try {
    for (; (e === void 0 || e-- > 0) && !(o = n.next()).done; ) i.push(o.value);
  } catch (s) {
    a = { error: s };
  } finally {
    try {
      o && !o.done && (t = n.return) && t.call(n);
    } finally {
      if (a) throw a.error;
    }
  }
  return i;
}, mt = function(r, e, t) {
  if (t || arguments.length === 2) for (var n = 0, o = e.length, i; n < o; n++)
    (i || !(n in e)) && (i || (i = Array.prototype.slice.call(e, 0, n)), i[n] = e[n]);
  return r.concat(i || Array.prototype.slice.call(e));
}, Qf = function(r, e) {
  return Math.abs(r.centerX - e.centerX) * 2 < r.width + e.width && Math.abs(r.centerY - e.centerY) * 2 < r.height + e.height;
}, ti = function(r) {
  var e = [], t = {};
  return r.forEach(function(n) {
    var o = "".concat(n.x, "-").concat(n.y);
    n.id = o, t[o] = n;
  }), Object.keys(t).forEach(function(n) {
    e.push(t[n]);
  }), e;
}, Wn = function(r, e) {
  return r.width === 0 && r.height === 0 ? r : {
    x: r.x,
    y: r.y,
    centerX: r.centerX,
    centerY: r.centerY,
    minX: r.minX - e,
    minY: r.minY - e,
    maxX: r.maxX + e,
    maxY: r.maxY + e,
    height: r.height + 2 * e,
    width: r.width + 2 * e
  };
}, ec = function(r, e) {
  var t = Math.abs(r.x - e.centerX), n = Math.abs(r.y - e.centerY);
  return t / e.width > n / e.height ? z.HORIZONTAL : z.VERTICAL;
}, Kn = function(r, e, t) {
  var n = ec(t, e);
  return n === z.HORIZONTAL ? {
    x: t.x > r.centerX ? r.maxX : r.minX,
    y: t.y
  } : {
    x: t.x,
    y: t.y > r.centerY ? r.maxY : r.minY
  };
}, Ya = function(r, e) {
  var t = Math.min(r.minX, e.minX), n = Math.min(r.minY, e.minY), o = Math.max(r.maxX, e.maxX), i = Math.max(r.maxY, e.maxY);
  return {
    x: (t + o) / 2,
    y: (n + i) / 2,
    centerX: (t + o) / 2,
    centerY: (n + i) / 2,
    minX: t,
    minY: n,
    maxX: o,
    maxY: i,
    height: i - n,
    width: o - t
  };
}, _o = function(r, e, t) {
  r === void 0 && (r = []);
  var n = [], o = [];
  r.forEach(function(f) {
    n.push(f.x), o.push(f.y);
  });
  var i = Math.min.apply(Math, mt([], Be(n), !1)), a = Math.max.apply(Math, mt([], Be(n), !1)), s = Math.min.apply(Math, mt([], Be(o), !1)), l = Math.max.apply(Math, mt([], Be(o), !1)), u = a - i, d = l - s;
  return e && (u += e, d += t || e), {
    centerX: (i + a) / 2,
    centerY: (s + l) / 2,
    maxX: a,
    maxY: l,
    minX: i,
    minY: s,
    x: (i + a) / 2,
    y: (s + l) / 2,
    height: d,
    width: u
  };
}, Zn = function(r) {
  var e = r.minX, t = r.minY, n = r.maxX, o = r.maxY;
  return [
    {
      x: e,
      y: t
    },
    {
      x: n,
      y: t
    },
    {
      x: n,
      y: o
    },
    {
      x: e,
      y: o
    }
  ];
}, yn = function(r, e) {
  var t = r.x, n = r.y;
  return t < e.minX || t > e.maxX || n < e.minY || n > e.maxY;
}, tc = function(r, e) {
  return e < r.minX || e > r.maxX ? [] : [
    {
      x: e,
      y: r.minY
    },
    {
      x: e,
      y: r.maxY
    }
  ];
}, rc = function(r, e) {
  return e < r.minY || e > r.maxY ? [] : [
    {
      x: r.minX,
      y: e
    },
    {
      x: r.maxX,
      y: e
    }
  ];
}, nc = function(r, e) {
  return mt(mt([], Be(tc(r, e.x)), !1), Be(rc(r, e.y)), !1);
}, ri = function(r, e) {
  return Math.abs(r.x - e.x) + Math.abs(r.y - e.y);
}, oc = function(r, e) {
  var t = -2, n = 0;
  return e.forEach(function(o) {
    o && (r.x === o.x && (n += t), r.y === o.y && (n += t));
  }), n;
}, Fa = function(r, e, t, n, o) {
  return ri(r, e) + ri(r, t) + oc(r, [e, t, n, o]);
}, Fl = function(r, e, t, n, o) {
  o || (o = 0), r.unshift(e[n]), t[n] && t[n] !== n && o <= 100 && Fl(r, e, t, t[n], o + 1);
}, ic = function(r, e) {
  var t = r.indexOf(e);
  t > -1 && r.splice(t, 1);
}, Tr = function(r, e, t, n) {
  var o = e.x - r.x, i = e.y - r.y, a = n.x - t.x, s = n.y - t.y, l = (-i * (r.x - t.x) + o * (r.y - t.y)) / (-a * i + o * s), u = (a * (r.y - t.y) - s * (r.x - t.x)) / (-a * i + o * s);
  return l >= 0 && l <= 1 && u >= 0 && u <= 1;
}, Ha = function(r, e, t) {
  if (t.width === 0 && t.height === 0)
    return !1;
  var n = Be(Zn(t), 4), o = n[0], i = n[1], a = n[2], s = n[3];
  return Tr(r, e, o, i) || Tr(r, e, o, s) || Tr(r, e, i, a) || Tr(r, e, a, s);
}, ac = function(r, e, t, n) {
  var o = [];
  return r.forEach(function(i) {
    i !== e && (i.x === e.x || i.y === e.y) && !Ha(i, e, t) && !Ha(i, e, n) && o.push(i);
  }), ti(o);
}, sc = function(r, e, t, n, o, i, a) {
  var s = [], l = [e], u = {}, d = {}, f = {};
  e.id && (d[e.id] = 0, f[e.id] = Fa(e, t, e));
  var c = {};
  r.forEach(function(v) {
    v.id && (c[v.id] = v);
  });
  for (var p = function() {
    var v, g = 1 / 0;
    if (l.forEach(function(_) {
      _.id && f[_.id] < g && (g = f[_.id], v = _);
    }), v === t && t.id) {
      var y = [];
      return Fl(y, c, u, t.id), { value: y };
    }
    if (!v)
      return { value: [e, t] };
    ic(l, v), s.push(v), ac(r, v, n, o).forEach(function(_) {
      var S;
      if (s.indexOf(_) === -1 && (l.indexOf(_) === -1 && l.push(_), v?.id && _?.id)) {
        var A = ((S = d[v.id]) !== null && S !== void 0 ? S : 0) + ri(v, _);
        if (d[_.id] && A >= d[_.id])
          return;
        u[_.id] = v.id, d[_.id] = A, f[_.id] = d[_.id] + Fa(_, t, e, i, a);
      }
    });
  }; l.length; ) {
    var h = p();
    if (typeof h == "object")
      return h.value;
  }
  return [e, t];
}, Ga = function(r) {
  return Ne(r);
}, Hl = function(r) {
  for (var e = 1; e < r.length - 1; ) {
    var t = r[e - 1], n = r[e], o = r[e + 1];
    t.x === n.x && n.x === o.x || t.y === n.y && n.y === o.y ? r.splice(e, 1) : e++;
  }
  return r;
}, za = function(r, e, t, n, o) {
  var i = Ga(t), a = Ga(n), s = Wn(i, o), l = Wn(a, o), u = Kn(s, i, r), d = Kn(l, a, e);
  if (Qf(s, l)) {
    var f = uc(r, e, u, d);
    return mt(mt([r, u], Be(f), !1), [d, e], !1);
  }
  var c = _o([u, d]), p = Ya(s, c), h = Ya(l, c), v = [];
  v = v.concat(Zn(p)), v = v.concat(Zn(h));
  var g = {
    x: (r.x + e.x) / 2,
    y: (r.y + e.y) / 2
  };
  [c, p, h].forEach(function(_) {
    v = v.concat(nc(_, g).filter(function(S) {
      return yn(S, s) && yn(S, l);
    }));
  }), [
    {
      x: u.x,
      y: d.y
    },
    {
      x: d.x,
      y: u.y
    }
  ].forEach(function(_) {
    yn(_, s) && yn(_, l) && v.push(_);
  }), v.unshift(u), v.push(d), v = ti(v);
  var y = sc(v, u, d, i, a, r, e);
  return y.unshift(r), y.push(e), y.length > 2 && (y = Hl(y)), ti(y);
}, lc = function(r) {
  if (r.length === 1) {
    var e = Be(r, 1), t = e[0];
    return [t, t];
  } else {
    for (var n = r[0], o = r[1], i = We(n.x, n.y, o.x, o.y), a = 1; a < r.length - 1; a++) {
      var s = r[a], l = r[a + 1], u = We(s.x, s.y, l.x, l.y);
      u > i && (i = u, n = s, o = l);
    }
    return [n, o];
  }
}, Ua = function(r, e, t) {
  var n = pt(r, t), o = pt(e, t);
  return n && o;
}, Va = function(r, e, t) {
  var n = pt(r, t), o = pt(e, t), i = n && o, a = n || o;
  return !i && a;
}, $a = function(r, e, t) {
  for (var n = void 0, o = Ne(t), i = Zn(o), a = 0; a < i.length; a++) {
    var s = Tr(r, e, i[a], i[(a + 1) % i.length]);
    s && (n = [i[a], i[(a + 1) % i.length]]);
  }
  if (n)
    return Jf(r, e, n[0], n[1]);
}, qn = function(r, e) {
  var t = void 0;
  return r.x === e.x ? t = z.VERTICAL : r.y === e.y && (t = z.HORIZONTAL), t;
}, Et = function(r) {
  var e = r.split(" "), t = [];
  return e && e.forEach(function(n) {
    var o = Be(n.split(","), 2), i = o[0], a = o[1];
    t.push({
      x: Number(i),
      y: Number(a)
    });
  }), t;
}, uc = function(r, e, t, n) {
  var o = [], i = qn(r, t), a = qn(e, n);
  if (i === a)
    r.y === t.y ? (o.push({
      x: t.x,
      y: (t.y + n.y) / 2
    }), o.push({
      x: n.x,
      y: (t.y + n.y) / 2
    })) : (o.push({
      x: (t.x + n.x) / 2,
      y: t.y
    }), o.push({
      x: (t.x + n.x) / 2,
      y: n.y
    }));
  else {
    var s = {
      x: t.x,
      y: n.y
    }, l = Wr(s, r, t), u = Wr(s, e, n);
    if (l || u)
      s = {
        x: n.x,
        y: t.y
      };
    else {
      var d = Wa(s, r, t), f = Wa(s, e, n);
      d && f && (s = {
        x: n.x,
        y: t.y
      });
    }
    o.push(s);
  }
  return o;
}, Wa = function(r, e, t) {
  return r.x === e.x && r.x === t.x || r.y === e.y && r.y === t.y;
}, Gl = function(r) {
  if (!r)
    return 0;
  for (var e = 0, t = 0; t < r.length; t++) {
    var n = r.charCodeAt(t);
    r.match(/[A-Z]/) ? e += 1.5 : n >= 1 && n <= 126 || n >= 65376 && n <= 65439 ? e += 1 : e += 2;
  }
  return e;
}, dc = function(r) {
  var e = r.start, t = r.end, n;
  if (e.x === t.x && e.y === t.y)
    n = "";
  else {
    var o = {
      start: e,
      end: t,
      offset: 10,
      verticalLength: 5
    }, i = Kr(rr(rr({}, o), { type: "start" })), a = Kr(rr(rr({}, o), { type: "end" }));
    n = "M".concat(i.leftX, " ").concat(i.leftY, `
    L`).concat(i.rightX, " ").concat(i.rightY, `
    L`).concat(a.rightX, " ").concat(a.rightY, `
    L`).concat(a.leftX, " ").concat(a.leftY, " z");
  }
  return {
    d: n,
    fill: "transparent",
    stroke: "transparent",
    strokeWidth: 1,
    strokeDasharray: "4, 4"
  };
}, Ka = function(r) {
  var e = r.start, t = r.end, n = r.sourceNode, o = r.targetNode, i = r.offset, a = Ne(n), s = Ne(o), l = Wn(a, i), u = Wn(s, i), d = Kn(l, a, e), f = Kn(u, s, t);
  return {
    sNext: d,
    ePre: f
  };
}, Ui = function(r) {
  var e = r.replace(/M/g, "").replace(/C/g, ",").split(","), t = gn(e[0]), n = gn(e[1]), o = gn(e[2]), i = gn(e[3]);
  return [t, n, o, i];
}, gn = function(r) {
  var e = Be(r.replace(/(^\s*)/g, "").split(" "), 2), t = e[0], n = e[1];
  return {
    x: +t,
    y: +n
  };
}, Za = function(r, e) {
  var t = Be(r, 4), n = t[0], o = t[1], i = t[2], a = t[3], s = ep(n, o, i, a, e);
  return [s, r[3]];
}, zl = function(r, e) {
  for (var t = r.x, n = r.y, o = Et(e), i = Number.MAX_SAFE_INTEGER, a, s = [], l = 0; l < o.length; l++)
    s.push({
      start: o[l],
      end: o[(l + 1) % o.length]
    });
  if (s.forEach(function(c) {
    var p = c.start, h = c.end;
    if (p.x === h.x) {
      var v = {
        x: p.x,
        y: n
      }, g = Wr(v, p, h);
      if (g) {
        var y = Math.abs(p.x - t);
        y < i && (i = y, a = v);
      }
    } else if (p.y === h.y) {
      var v = {
        x: t,
        y: p.y
      }, g = Wr(v, p, h);
      if (g) {
        var y = Math.abs(p.y - n);
        y < i && (i = y, a = v);
      }
    }
  }), !a) {
    var u = s[0], d = u.start, f = u.end;
    a = {
      x: d.x + (f.x - d.x) / 2,
      y: d.y + (f.y - d.y) / 2
    };
  }
  return a;
}, fc = function(r) {
  return er(r, [
    "id",
    "type",
    "sourceNodeId",
    "sourceAnchorId",
    "targetNodeId",
    "targetAnchorId",
    "pointsList",
    "startPoint",
    "endPoint",
    "properties"
  ]);
}, qa = function(r, e) {
  return Math.sqrt(Math.pow(r.x - e.x, 2) + Math.pow(r.y - e.y, 2));
};
function cc(r, e) {
  return typeof e != "function" ? function(t, n, o) {
    return Object.assign({ type: r.edgeType }, o);
  } : function(t, n, o) {
    var i = e(t, n, o);
    return i ? typeof i == "string" ? Object.assign({}, o, { type: i }) : Object.assign({ type: i }, o) : { type: r.edgeType };
  };
}
var pc = function(r) {
  var e = r.rows, t = r.rowsLength, n = r.fontSize, o = 0;
  return pe(e, function(i) {
    var a = Gl(i);
    o = a > o ? a : o;
  }), {
    width: Math.ceil(o / 2) * n + n / 4,
    height: t * (n + 2) + n / 4
  };
}, Wt = function(r, e) {
  var t = typeof Symbol == "function" && r[Symbol.iterator];
  if (!t) return r;
  var n = t.call(r), o, i = [], a;
  try {
    for (; (e === void 0 || e-- > 0) && !(o = n.next()).done; ) i.push(o.value);
  } catch (s) {
    a = { error: s };
  } finally {
    try {
      o && !o.done && (t = n.return) && t.call(n);
    } finally {
      if (a) throw a.error;
    }
  }
  return i;
}, _n = function(r, e, t) {
  if (t || arguments.length === 2) for (var n = 0, o = e.length, i; n < o; n++)
    (i || !(n in e)) && (i || (i = Array.prototype.slice.call(e, 0, n)), i[n] = e[n]);
  return r.concat(i || Array.prototype.slice.call(e));
};
function gr(r, e, t) {
  return t && e * Math.round(r / e) || r;
}
function hc(r, e, t) {
  if (!r)
    return [];
  var n = Math.min.apply(Math, _n([], Wt(r.map(function(v) {
    return v[0];
  })), !1)), o = Math.max.apply(Math, _n([], Wt(r.map(function(v) {
    return v[0];
  })), !1)), i = Math.min.apply(Math, _n([], Wt(r.map(function(v) {
    return v[1];
  })), !1)), a = Math.max.apply(Math, _n([], Wt(r.map(function(v) {
    return v[1];
  })), !1)), s = -n, l = -i, u = r.map(function(v) {
    var g = Wt(v, 2), y = g[0], _ = g[1];
    return [
      y + s,
      _ + l
    ];
  }), d = o - n, f = a - i, c = e ? e / d : 1, p = t ? t / f : 1, h = Math.min(c, p);
  return u.map(function(v) {
    var g = Wt(v, 2), y = g[0], _ = g[1];
    return [y * h, _ * h];
  });
}
var Ul = function(r, e, t) {
  var n = r.length;
  if (n < 2 || e <= 0)
    return r.slice();
  for (var o = function(x, E) {
    return { x: E.x - x.x, y: E.y - x.y };
  }, i = function(x) {
    return Math.hypot(x.x, x.y);
  }, a = function(x) {
    var E = i(x) || 1;
    return { x: x.x / E, y: x.y / E };
  }, s = [], l = function(x, E, m) {
    var b = o(E, x), P = o(E, m), D = i(b), k = i(P);
    if (D < 1e-6 || k < 1e-6)
      return [E];
    for (var Y = a(b), J = a(P), H = Math.min(e, D * 0.45, k * 0.45), oe = { x: E.x + Y.x * H, y: E.y + Y.y * H }, ne = { x: E.x + J.x * H, y: E.y + J.y * H }, ae = 10, ue = [oe], ve = 1; ve < ae; ve++) {
      var he = ve / ae, j = 1 - he;
      ue.push({
        x: j * j * oe.x + 2 * j * he * E.x + he * he * ne.x,
        y: j * j * oe.y + 2 * j * he * E.y + he * he * ne.y
      });
    }
    return ue.push(ne), ue;
  }, u = 0; u < n; u++) {
    var d = u === 0 ? t ? n - 1 : 0 : u - 1, f = u === n - 1 ? t ? 0 : n - 1 : u + 1, c = r[d], p = r[u], h = r[f], v = !t && (u === 0 || u === n - 1);
    if (v)
      s.push(p);
    else {
      var g = l(c, p, h);
      g.forEach(function(x) {
        return s.push(x);
      });
    }
  }
  for (var y = [], u = 0; u < s.length; u++) {
    var _ = s[u];
    (y.length === 0 || Math.hypot(_.x - y[y.length - 1].x, _.y - y[y.length - 1].y) > 1e-6) && y.push(_);
  }
  if (t && y.length > 1) {
    var S = y[0], A = y[y.length - 1];
    Math.hypot(S.x - A.x, S.y - A.y) < 1e-6 && y.pop();
  }
  return y;
}, Po = function(r, e) {
  var t = typeof Symbol == "function" && r[Symbol.iterator];
  if (!t) return r;
  var n = t.call(r), o, i = [], a;
  try {
    for (; (e === void 0 || e-- > 0) && !(o = n.next()).done; ) i.push(o.value);
  } catch (s) {
    a = { error: s };
  } finally {
    try {
      o && !o.done && (t = n.return) && t.call(n);
    } finally {
      if (a) throw a.error;
    }
  }
  return i;
}, Do = function(r, e, t) {
  var n = Po(r, 2), o = n[0], i = n[1], a = Po(e, 2), s = a[0], l = a[1], u = Po(t, 2), d = u[0], f = u[1];
  return o > s && o < d && i > l && i < f;
}, Vl = function(r, e) {
  var t = e.multipleSelectKey, n = !1;
  switch (t) {
    case "meta":
      n = r.metaKey;
      break;
    case "alt":
      n = r.altKey;
      break;
    case "shift":
      n = r.shiftKey;
      break;
    case "ctrl":
      n = r.ctrlKey;
      break;
    default:
      n = !1;
      break;
  }
  return n;
}, Vi = /* @__PURE__ */ (function() {
  var r = function(e, t) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, o) {
      n.__proto__ = o;
    } || function(n, o) {
      for (var i in o) Object.prototype.hasOwnProperty.call(o, i) && (n[i] = o[i]);
    }, r(e, t);
  };
  return function(e, t) {
    if (typeof t != "function" && t !== null)
      throw new TypeError("Class extends value " + String(t) + " is not a constructor or null");
    r(e, t);
    function n() {
      this.constructor = e;
    }
    e.prototype = t === null ? Object.create(t) : (n.prototype = t.prototype, new n());
  };
})();
function Ja(r, e) {
  return r instanceof Oe && e instanceof Oe;
}
var $l = (
  /** @class */
  (function(r) {
    Vi(e, r);
    function e(t, n, o) {
      var i = r.call(this, 3) || this;
      return i[0] = t, i[1] = n, i[2] = o, i.x = t, i.y = n, i.z = o, Object.setPrototypeOf(i, e.prototype), i;
    }
    return e.prototype.add = function(t) {
      if (Ja(this, t))
        return new Oe(this.x + t.x, this.y + t.y);
      var n = this.z + t.z;
      return new ni((this.x + t.x) / n, (this.y + t.y) / n);
    }, e.prototype.subtract = function(t) {
      if (Ja(this, t))
        return new Oe(this.x - t.x, this.y - t.y);
      var n = this.z - t.z;
      return n === 0 ? new Oe(this.x - t.x, this.y - t.y) : new ni((this.x - t.x) / n, (this.y - t.y) / n);
    }, e;
  })(Array)
), Oe = (
  /** @class */
  (function(r) {
    Vi(e, r);
    function e(t, n, o) {
      var i = r.call(this, t, n, o ?? 0) || this;
      return Object.setPrototypeOf(i, e.prototype), i;
    }
    return e.prototype.toString = function() {
      return "Vector";
    }, e.prototype.dot = function(t) {
      var n = this;
      return t.reduce(function(o, i, a) {
        return o + i * n[a];
      });
    }, e.prototype.cross = function(t) {
      return new e(this.y * t.z - this.z * t.y, this.z * t.x - this.x * t.z, this.x * t.y - this.y * t.x);
    }, e.prototype.getLength = function() {
      return Math.hypot(this.x, this.y);
    }, e.prototype.normalize = function() {
      var t = this.getLength();
      return new e(this.x / t, this.y / t);
    }, e.prototype.crossZ = function(t) {
      return this.x * t.y - this.y * t.x;
    }, e.prototype.angle = function(t) {
      var n = this.crossZ(t), o = Math.acos(this.normalize().dot(t.normalize()));
      return n >= 0 ? o : -o;
    }, e;
  })($l)
), ni = (
  /** @class */
  (function(r) {
    Vi(e, r);
    function e(t, n) {
      var o = r.call(this, t, n, 1) || this;
      return Object.setPrototypeOf(o, e.prototype), o;
    }
    return e.prototype.toString = function() {
      return "Point";
    }, e;
  })($l)
), mo = /* @__PURE__ */ (function() {
  var r = function(e, t) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, o) {
      n.__proto__ = o;
    } || function(n, o) {
      for (var i in o) Object.prototype.hasOwnProperty.call(o, i) && (n[i] = o[i]);
    }, r(e, t);
  };
  return function(e, t) {
    if (typeof t != "function" && t !== null)
      throw new TypeError("Class extends value " + String(t) + " is not a constructor or null");
    r(e, t);
    function n() {
      this.constructor = e;
    }
    e.prototype = t === null ? Object.create(t) : (n.prototype = t.prototype, new n());
  };
})(), Kt = function(r, e) {
  var t = typeof Symbol == "function" && r[Symbol.iterator];
  if (!t) return r;
  var n = t.call(r), o, i = [], a;
  try {
    for (; (e === void 0 || e-- > 0) && !(o = n.next()).done; ) i.push(o.value);
  } catch (s) {
    a = { error: s };
  } finally {
    try {
      o && !o.done && (t = n.return) && t.call(n);
    } finally {
      if (a) throw a.error;
    }
  }
  return i;
}, To = function(r, e, t) {
  if (t || arguments.length === 2) for (var n = 0, o = e.length, i; n < o; n++)
    (i || !(n in e)) && (i || (i = Array.prototype.slice.call(e, 0, n)), i[n] = e[n]);
  return r.concat(i || Array.prototype.slice.call(e));
}, sn = (
  /** @class */
  (function(r) {
    mo(e, r);
    function e() {
      for (var t = [], n = 0; n < arguments.length; n++)
        t[n] = arguments[n];
      var o = r.call(this, t.length) || this;
      return o.fill(new Array(3)), t.forEach(function(i, a) {
        o[a] = i;
      }), o.columns = t[0].length, o.rows = t.length, Object.setPrototypeOf(o, e.prototype), o;
    }
    return e.prototype.getRow = function(t) {
      return this[t];
    }, e.prototype.getColumn = function(t) {
      return To([], Kt(this.map(function(n) {
        return n[t];
      })), !1);
    }, e.prototype.transpose = function() {
      for (var t = [], n = 0; n < this.columns; n++)
        t.push(this.getColumn(n));
      return new (e.bind.apply(e, To([void 0], Kt(t), !1)))();
    }, e.prototype.cross = function(t) {
      var n = new Array(this.rows).fill("").map(function() {
        return [];
      });
      if (this.columns === t.rows)
        for (var o = 0; o < this.rows; o++)
          for (var i = this.getRow(o), a = function(l) {
            var u = t.getColumn(l);
            n[o][l] = i.reduce(function(d, f, c) {
              return d + f * u[c];
            }, 0);
          }, s = 0; s < t.columns; s++)
            a(s);
      return new (e.bind.apply(e, To([void 0], Kt(n), !1)))();
    }, e.prototype.to2D = function() {
      return this.map(function(t) {
        return [t[0], t[1]];
      });
    }, e.prototype.toPoints = function() {
      return this.map(function(t) {
        return new ni(t[0], t[1]);
      });
    }, e.prototype.toString = function() {
      var t = Kt(this[0], 2), n = t[0], o = t[1], i = Kt(this[1], 2), a = i[0], s = i[1], l = Kt(this[2], 2), u = l[0], d = l[1];
      return "matrix(".concat(n, " ").concat(o, " ").concat(a, " ").concat(s, " ").concat(u, " ").concat(d, ")");
    }, e.prototype.translate = function(t, n) {
      return this.cross(new Jn(t, n));
    }, e.prototype.rotate = function(t) {
      return this.cross(new vc(t));
    }, e.prototype.scale = function(t, n) {
      return this.cross(new yc(t, n));
    }, e;
  })(Array)
), vc = (
  /** @class */
  (function(r) {
    mo(e, r);
    function e(t) {
      var n = r.call(this, new Oe(+Math.cos(t).toFixed(2), +Math.sin(t).toFixed(2), 0), new Oe(-Math.sin(t).toFixed(2), +Math.cos(t).toFixed(2), 0), new Oe(0, 0, 1)) || this;
      return Object.setPrototypeOf(n, e.prototype), n;
    }
    return e.prototype.inverse = function() {
      return this.transpose();
    }, e;
  })(sn)
), yc = (
  /** @class */
  (function(r) {
    mo(e, r);
    function e(t, n) {
      var o = r.call(this, new Oe(t, 0, 0), new Oe(0, n, 0), new Oe(0, 0, 1)) || this;
      return o.sx = t, o.sy = n, Object.setPrototypeOf(o, e.prototype), o;
    }
    return e.prototype.inverse = function() {
      return new e(1 / this.sx, 1 / this.sy);
    }, e;
  })(sn)
), Jn = (
  /** @class */
  (function(r) {
    mo(e, r);
    function e(t, n) {
      var o = r.call(this, new Oe(1, 0, 0), new Oe(0, 1, 0), new Oe(t, n, 1)) || this;
      return o.tx = t, o.ty = n, Object.setPrototypeOf(o, e.prototype), o;
    }
    return e.prototype.inverse = function() {
      return new e(-this.tx, -this.ty);
    }, e;
  })(sn)
);
Hd({});
var Qn = function() {
  return Qn = Object.assign || function(r) {
    for (var e, t = 1, n = arguments.length; t < n; t++) {
      e = arguments[t];
      for (var o in e) Object.prototype.hasOwnProperty.call(e, o) && (r[o] = e[o]);
    }
    return r;
  }, Qn.apply(this, arguments);
}, gc = function(r, e) {
  var t = typeof Symbol == "function" && r[Symbol.iterator];
  if (!t) return r;
  var n = t.call(r), o, i = [], a;
  try {
    for (; (e === void 0 || e-- > 0) && !(o = n.next()).done; ) i.push(o.value);
  } catch (s) {
    a = { error: s };
  } finally {
    try {
      o && !o.done && (t = n.return) && t.call(n);
    } finally {
      if (a) throw a.error;
    }
  }
  return i;
}, oi = function(r) {
  var e = r.anchors;
  return e;
}, eo = function(r, e) {
  for (var t = e.nodes, n, o = t.length - 1; o >= 0; o--) {
    var i = t[o], a = xc(r, i);
    if (a) {
      var s = i.getTargetAnchor(r);
      if (s) {
        var l = {
          node: i,
          anchorIndex: s.index,
          anchor: s.anchor
        };
        (!n || _c(i, n.node, e)) && (n = l);
      }
    }
  }
  return n;
}, _c = function(r, e, t) {
  return r.zIndex > e.zIndex ? !0 : t.nodesMap[r.id].index > t.nodesMap[e.id].index;
}, mc = function(r, e) {
  for (var t = oi(e), n, o = Number.MAX_SAFE_INTEGER, i = 0; i < t.length; i++) {
    var a = We(r.x, r.y, t[i].x, t[i].y);
    a < o && (o = a, n = {
      index: i,
      anchor: Qn(Qn({}, t[i]), { x: t[i].x, y: t[i].y, id: t[i].id })
    });
  }
  return n;
}, We = function(r, e, t, n) {
  return Math.hypot(r - t, e - n);
}, pt = function(r, e, t) {
  t === void 0 && (t = 0);
  var n = !1, o = Ne(e), i = gc(new sn([r.x, r.y, 1]).translate(-e.x, -e.y).rotate(-e.rotate).translate(e.x, e.y)[0], 2), a = i[0], s = i[1], l = {
    x: a,
    y: s
  };
  return l.x >= o.minX - t && l.x <= o.maxX + t && l.y >= o.minY - t && l.y <= o.maxY + t && (n = !0), n;
}, xc = function(r, e) {
  return pt(r, e, 5);
}, Ne = function(r) {
  var e = r.x, t = r.y, n = r.width, o = r.height;
  return {
    minX: e - n / 2,
    minY: t - o / 2,
    maxX: e + n / 2,
    maxY: t + o / 2,
    x: e,
    y: t,
    width: n,
    height: o,
    centerX: e,
    centerY: t
  };
}, Ec = function(r) {
  var e = r, t = e.x, n = e.y, o = e.width, i = e.height, a = e.radius;
  return [
    {
      x: t - o / 2 + a,
      y: n - i / 2 + a,
      r: a
    },
    {
      x: t + o / 2 - a,
      y: n - i / 2 + a,
      r: a
    },
    {
      x: t - o / 2 + a,
      y: n + i / 2 - a,
      r: a
    },
    {
      x: t + o / 2 - a,
      y: n + i / 2 - a,
      r: a
    }
  ];
}, Qa = function(r, e, t) {
  var n = Ec(t), o, i = Number.MAX_SAFE_INTEGER;
  if (n.forEach(function(d) {
    var f = e === z.HORIZONTAL ? Math.abs(r.y - d.y) <= d.r : e === z.VERTICAL ? Math.abs(r.x - d.x) <= d.r : !1;
    if (f) {
      var c = We(r.x, r.y, d.x, d.y);
      c < i && (i = c, o = d);
    }
  }), o)
    return ii(r, e, o);
  var a = t.x, s = t.y, l = t.width, u = t.height;
  return e === z.HORIZONTAL ? {
    x: r.x <= a ? a - l / 2 : a + l / 2,
    y: r.y
  } : e === z.VERTICAL ? {
    x: r.x,
    y: r.y <= s ? s - u / 2 : s + u / 2
  } : r;
}, ii = function(r, e, t) {
  var n, o = t.x, i = t.y, a = t.r;
  if (e === z.HORIZONTAL) {
    var s = o - Math.sqrt(a * a - (r.y - i) * (r.y - i)), l = o + Math.sqrt(a * a - (r.y - i) * (r.y - i)), u = Math.abs(s - r.x) < Math.abs(l - r.x) ? s : l;
    n = {
      x: u,
      y: r.y
    };
  } else if (e === z.VERTICAL) {
    var d = i - Math.sqrt(a * a - (r.x - o) * (r.x - o)), f = i + Math.sqrt(a * a - (r.x - o) * (r.x - o)), c = Math.abs(d - r.y) < Math.abs(f - r.y) ? d : f;
    n = {
      x: r.x,
      y: c
    };
  }
  return n;
}, es = function(r, e) {
  var t = e, n = !1, o = t.x, i = t.y, a = t.width, s = t.height, l = t.radius, u = {
    minX: o - a / 2 + l,
    maxX: o + a / 2 - l,
    minY: i - s / 2 + l,
    maxY: i + s / 2 - l
  };
  return r.y === i + s / 2 || r.y === i - s / 2 ? n = r.x > u.minX && r.x < u.maxX : (r.x === o + a / 2 || r.x === o - a / 2) && (n = r.y > u.minY && r.y < u.maxY), n;
}, ts = function(r, e, t) {
  var n, o = t, i = o.x, a = o.y, s = o.rx, l = o.ry;
  if (e === z.HORIZONTAL) {
    var u = i - Math.sqrt(s * s - (r.y - a) * (r.y - a) * s * s / (l * l)), d = i + Math.sqrt(s * s - (r.y - a) * (r.y - a) * s * s / (l * l)), f = Math.abs(u - r.x) < Math.abs(d - r.x) ? u : d;
    n = {
      x: f,
      y: r.y
    };
  } else if (e === z.VERTICAL) {
    var c = a - Math.sqrt(l * l - (r.x - i) * (r.x - i) * l * l / (s * s)), p = a + Math.sqrt(l * l - (r.x - i) * (r.x - i) * l * l / (s * s)), h = Math.abs(c - r.y) < Math.abs(p - r.y) ? c : p;
    n = {
      x: r.x,
      y: h
    };
  }
  return n;
}, mn = function(r, e, t) {
  for (var n = t.pointsPosition, o = Number.MAX_SAFE_INTEGER, i, a = [], s = 0; s < n.length; s++)
    a.push({
      start: n[s],
      end: n[(s + 1) % n.length]
    });
  return a.forEach(function(l) {
    var u = l.start, d = l.end, f = u, c = d;
    u.x > d.x && (f = d, c = u);
    var p = {
      x: r.x,
      y: r.y
    };
    if (f.x === c.x && e === z.HORIZONTAL && (p = {
      x: f.x,
      y: r.y
    }), f.y === c.y && e === z.VERTICAL && (p = {
      x: r.x,
      y: f.y
    }), f.x !== c.x && f.y !== c.y) {
      var h = (c.y - f.y) / (c.x - f.x), v = (f.x * c.y - c.x * f.y) / (f.x - c.x);
      e === z.HORIZONTAL ? p = {
        x: (r.y - v) / h,
        y: r.y
      } : e === z.VERTICAL && (p = {
        x: r.x,
        y: h * r.x + v
      });
    }
    var g = Wr(p, u, d);
    if (g) {
      var y = We(p.x, p.y, r.x, r.y);
      y < o && (o = y, i = p);
    }
  }), i;
}, bc = function(r) {
  var e = er(r, [
    "id",
    "type",
    "x",
    "y",
    "text",
    "label",
    "properties",
    "virtual",
    // 区域节点是否为dnd添加的虚拟节点
    "rotate",
    // TODO: 确认是否可以加到此处
    "resizable",
    "rotatable"
  ]);
  return e;
}, rs = function(r, e, t, n) {
  var o = r.x, i = r.y;
  return e.x > r.x ? o = r.x + t / 2 : e.x < r.x && (o = r.x - t / 2), e.y > r.y ? i = r.y + n / 2 : e.y < r.y && (i = r.y - n / 2), {
    x: o,
    y: i
  };
}, Wl = function(r) {
  var e = r.rows, t = r.style, n = r.rowsLength, o = r.className, i = document.createElement("div");
  i.className = o, i.style.fontSize = "".concat(t.fontSize), i.style.width = "".concat(t.width), i.style.lineHeight = "".concat(t.lineHeight), i.style.padding = "".concat(t.padding), t.fontFamily && (i.style.fontFamily = "".concat(t.fontFamily)), n > 1 ? e.forEach(function(s) {
    var l = document.createElement("div");
    l.textContent = s, i.appendChild(l);
  }) : i.textContent = e[0], document.body.appendChild(i);
  var a = i.clientHeight;
  return document.body.removeChild(i), a;
}, ns = function(r) {
  var e = r.rows, t = r.rowsLength, n = r.fontSize, o = 0;
  return e && e.forEach(function(i) {
    var a = Gl(i);
    o = a > o ? a : o;
  }), {
    width: Math.ceil(o / 2) * n + n / 4,
    height: t * (n + 2) + n / 4
  };
}, to = function(r) {
  return typeof r != "object" ? {
    isAllPass: !!r,
    msg: r ? "" : "不允许连接"
  } : r;
};
let xn;
const Oc = new Uint8Array(16);
function wc() {
  if (!xn && (xn = typeof crypto < "u" && crypto.getRandomValues && crypto.getRandomValues.bind(crypto), !xn))
    throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
  return xn(Oc);
}
const xe = [];
for (let r = 0; r < 256; ++r)
  xe.push((r + 256).toString(16).slice(1));
function Sc(r, e = 0) {
  return xe[r[e + 0]] + xe[r[e + 1]] + xe[r[e + 2]] + xe[r[e + 3]] + "-" + xe[r[e + 4]] + xe[r[e + 5]] + "-" + xe[r[e + 6]] + xe[r[e + 7]] + "-" + xe[r[e + 8]] + xe[r[e + 9]] + "-" + xe[r[e + 10]] + xe[r[e + 11]] + xe[r[e + 12]] + xe[r[e + 13]] + xe[r[e + 14]] + xe[r[e + 15]];
}
const Ac = typeof crypto < "u" && crypto.randomUUID && crypto.randomUUID.bind(crypto), os = {
  randomUUID: Ac
};
function Mc(r, e, t) {
  if (os.randomUUID && !r)
    return os.randomUUID();
  r = r || {};
  const n = r.random || (r.rng || wc)();
  return n[6] = n[6] & 15 | 64, n[8] = n[8] & 63 | 128, Sc(n);
}
var It = function() {
  return Mc();
}, Rr = /* @__PURE__ */ new Map(), Kl = function(r) {
  var e = It();
  function t() {
    r();
    var o = Rr.get(e);
    if (o) {
      var i = window.requestAnimationFrame(t);
      Rr.set(e, i);
    }
  }
  var n = window.requestAnimationFrame(t);
  return Rr.set(e, n), e;
}, ro = function(r) {
  var e = Rr.get(r);
  e && (window.cancelAnimationFrame(e), Rr.delete(r));
}, Zr = function() {
  return Zr = Object.assign || function(r) {
    for (var e, t = 1, n = arguments.length; t < n; t++) {
      e = arguments[t];
      for (var o in e) Object.prototype.hasOwnProperty.call(e, o) && (r[o] = e[o]);
    }
    return r;
  }, Zr.apply(this, arguments);
}, Pc = function(r, e) {
  var t = typeof Symbol == "function" && r[Symbol.iterator];
  if (!t) return r;
  var n = t.call(r), o, i = [], a;
  try {
    for (; (e === void 0 || e-- > 0) && !(o = n.next()).done; ) i.push(o.value);
  } catch (s) {
    a = { error: s };
  } finally {
    try {
      o && !o.done && (t = n.return) && t.call(n);
    } finally {
      if (a) throw a.error;
    }
  }
  return i;
};
function Zl(r) {
  var e = r.x, t = e === void 0 ? 0 : e, n = r.y, o = n === void 0 ? 0 : n, i = r.value, a = r.fontSize, s = a === void 0 ? 12 : a, l = r.fill, u = l === void 0 ? "currentColor" : l, d = r.overflowMode, f = d === void 0 ? "default" : d, c = r.textWidth, p = c === void 0 ? void 0 : c, h = r.model, v = {
    x: t,
    y: o,
    fill: u,
    fontSize: s,
    textAnchor: "middle",
    dominantBaseline: "central"
    // ...props,
  };
  if (pe(St(r), function(x) {
    var E = Pc(x, 2), m = E[0], b = E[1];
    typeof b != "object" && (v[m] = b);
  }), i) {
    var g = String(i).split(/[\r\n]/g), y = g.length;
    if (f !== "default") {
      var _ = h.BaseType, S = h.modelType;
      if (_ === fe.NODE && S !== G.TEXT_NODE || _ === fe.EDGE && p)
        return Dc(r);
    }
    if (y > 1) {
      var A = g.map(function(x, E) {
        var m = s + 2, b = (E - (y - 1) / 2) * m;
        return w("tspan", { className: "lf-text-tspan", x: t, y: o + b, children: x });
      });
      return w("text", Zr({}, v, { children: A }));
    }
    return w("text", Zr({}, v, { children: i }));
  }
  return null;
}
function Dc(r) {
  var e = r.x, t = r.y, n = r.value, o = r.model, i = r.textWidth, a = r.fontSize, s = a === void 0 ? 12 : a, l = r.lineHeight, u = r.fontFamily, d = u === void 0 ? "" : u, f = r.wrapPadding, c = f === void 0 ? "0, 0" : f, p = r.overflowMode, h = o.width, v = o.height, g = o.textHeight, y = i || h, _ = String(n).split(/[\r\n]/g), S = _.length, A = Wl({
    rows: _,
    style: {
      fontSize: "".concat(s, "px"),
      width: "".concat(y, "px"),
      fontFamily: d,
      lineHeight: l,
      padding: c
    },
    rowsLength: S,
    className: "lf-get-text-height"
  }), x = v > A ? v : A;
  g && (x = g);
  var E = p === "ellipsis";
  return E && (x = s + 2), w("g", { children: w("foreignObject", { width: y, height: x, x: e - y / 2, y: t - x / 2, style: { overflow: "visible", textAlign: "left" }, children: w("div", { className: "lf-node-text-auto-wrap", style: {
    minHeight: x,
    width: y,
    padding: c
  }, children: w("div", { className: E ? "lf-node-text-ellipsis-content" : "lf-node-text-auto-wrap-content", title: E ? _.join("") : "", style: Zr({}, r), children: _.map(function(m) {
    return w("div", { className: "lf-node-text--auto-wrap-inner", children: m });
  }) }) }) }) });
}
var ai = function() {
  return ai = Object.assign || function(r) {
    for (var e, t = 1, n = arguments.length; t < n; t++) {
      e = arguments[t];
      for (var o in e) Object.prototype.hasOwnProperty.call(e, o) && (r[o] = e[o]);
    }
    return r;
  }, ai.apply(this, arguments);
}, Tc = function(r, e) {
  var t = typeof Symbol == "function" && r[Symbol.iterator];
  if (!t) return r;
  var n = t.call(r), o, i = [], a;
  try {
    for (; (e === void 0 || e-- > 0) && !(o = n.next()).done; ) i.push(o.value);
  } catch (s) {
    a = { error: s };
  } finally {
    try {
      o && !o.done && (t = n.return) && t.call(n);
    } finally {
      if (a) throw a.error;
    }
  }
  return i;
};
function _r(r) {
  var e = {
    // default
    x1: 10,
    y1: 10,
    x2: 20,
    y2: 20,
    stroke: "black"
    // ...props
  };
  return pe(St(r), function(t) {
    var n = Tc(t, 2), o = n[0], i = n[1];
    (o === "style" || typeof i != "object") && (e[o] = i);
  }), w("line", ai({}, e));
}
var si = function() {
  return si = Object.assign || function(r) {
    for (var e, t = 1, n = arguments.length; t < n; t++) {
      e = arguments[t];
      for (var o in e) Object.prototype.hasOwnProperty.call(e, o) && (r[o] = e[o]);
    }
    return r;
  }, si.apply(this, arguments);
}, Nc = function(r, e) {
  var t = typeof Symbol == "function" && r[Symbol.iterator];
  if (!t) return r;
  var n = t.call(r), o, i = [], a;
  try {
    for (; (e === void 0 || e-- > 0) && !(o = n.next()).done; ) i.push(o.value);
  } catch (s) {
    a = { error: s };
  } finally {
    try {
      o && !o.done && (t = n.return) && t.call(n);
    } finally {
      if (a) throw a.error;
    }
  }
  return i;
};
function wt(r) {
  var e = r.x, t = r.y, n = r.width, o = r.height, i = r.className, a = r.strokeWidth, s = r.radius, l = s === void 0 ? 0 : s, u = e - n / 2, d = t - o / 2, f = {};
  return f["stroke-width"] = a, pe(St(r), function(c) {
    var p = Nc(c, 2), h = p[0], v = p[1];
    typeof v != "object" && (f[h] = v);
  }), i ? f.className = "lf-basic-shape ".concat(i) : f.className = "lf-basic-shape", l && (f.rx = l, f.ry = l), f.x = u, f.y = d, w("rect", si({}, f));
}
var li = function() {
  return li = Object.assign || function(r) {
    for (var e, t = 1, n = arguments.length; t < n; t++) {
      e = arguments[t];
      for (var o in e) Object.prototype.hasOwnProperty.call(e, o) && (r[o] = e[o]);
    }
    return r;
  }, li.apply(this, arguments);
}, Cc = function(r, e) {
  var t = typeof Symbol == "function" && r[Symbol.iterator];
  if (!t) return r;
  var n = t.call(r), o, i = [], a;
  try {
    for (; (e === void 0 || e-- > 0) && !(o = n.next()).done; ) i.push(o.value);
  } catch (s) {
    a = { error: s };
  } finally {
    try {
      o && !o.done && (t = n.return) && t.call(n);
    } finally {
      if (a) throw a.error;
    }
  }
  return i;
};
function qr(r) {
  var e = {
    d: ""
  };
  return pe(St(r), function(t) {
    var n = Cc(t, 2), o = n[0], i = n[1];
    (o === "style" || typeof i != "object") && (e[o] = i);
  }), w("path", li({}, e));
}
var ui = function() {
  return ui = Object.assign || function(r) {
    for (var e, t = 1, n = arguments.length; t < n; t++) {
      e = arguments[t];
      for (var o in e) Object.prototype.hasOwnProperty.call(e, o) && (r[o] = e[o]);
    }
    return r;
  }, ui.apply(this, arguments);
}, Lc = function(r, e) {
  var t = typeof Symbol == "function" && r[Symbol.iterator];
  if (!t) return r;
  var n = t.call(r), o, i = [], a;
  try {
    for (; (e === void 0 || e-- > 0) && !(o = n.next()).done; ) i.push(o.value);
  } catch (s) {
    a = { error: s };
  } finally {
    try {
      o && !o.done && (t = n.return) && t.call(n);
    } finally {
      if (a) throw a.error;
    }
  }
  return i;
};
function mr(r) {
  var e = r.x, t = e === void 0 ? 0 : e, n = r.y, o = n === void 0 ? 0 : n, i = r.r, a = i === void 0 ? 4 : i, s = r.className, l = {
    cx: t,
    cy: o,
    r: a,
    fill: "transparent",
    fillOpacity: 1,
    strokeWidth: 1,
    stroke: "#000",
    strokeOpacity: 1
  };
  return pe(St(r), function(u) {
    var d = Lc(u, 2), f = d[0], c = d[1];
    typeof c != "object" && (l[f] = c);
  }), s ? l.className = "lf-basic-shape ".concat(s) : l.className = "lf-basic-shape", w("circle", ui({}, l));
}
var di = function() {
  return di = Object.assign || function(r) {
    for (var e, t = 1, n = arguments.length; t < n; t++) {
      e = arguments[t];
      for (var o in e) Object.prototype.hasOwnProperty.call(e, o) && (r[o] = e[o]);
    }
    return r;
  }, di.apply(this, arguments);
}, jc = function(r, e) {
  var t = typeof Symbol == "function" && r[Symbol.iterator];
  if (!t) return r;
  var n = t.call(r), o, i = [], a;
  try {
    for (; (e === void 0 || e-- > 0) && !(o = n.next()).done; ) i.push(o.value);
  } catch (s) {
    a = { error: s };
  } finally {
    try {
      o && !o.done && (t = n.return) && t.call(n);
    } finally {
      if (a) throw a.error;
    }
  }
  return i;
};
function Rc(r) {
  var e = r.x, t = e === void 0 ? 0 : e, n = r.y, o = n === void 0 ? 0 : n, i = r.rx, a = i === void 0 ? 4 : i, s = r.ry, l = s === void 0 ? 4 : s, u = r.className, d = {
    cx: t,
    cy: o,
    rx: a,
    ry: l,
    fill: "transparent",
    fillOpacity: 1,
    strokeWidth: 1,
    stroke: "#000",
    strokeOpacity: 1
  };
  return pe(St(r), function(f) {
    var c = jc(f, 2), p = c[0], h = c[1];
    typeof h != "object" && (d[p] = h);
  }), u ? d.className = "lf-basic-shape ".concat(u) : d.className = "lf-basic-shape", w("ellipse", di({}, d));
}
var no = function() {
  return no = Object.assign || function(r) {
    for (var e, t = 1, n = arguments.length; t < n; t++) {
      e = arguments[t];
      for (var o in e) Object.prototype.hasOwnProperty.call(e, o) && (r[o] = e[o]);
    }
    return r;
  }, no.apply(this, arguments);
}, Ic = function(r, e) {
  var t = typeof Symbol == "function" && r[Symbol.iterator];
  if (!t) return r;
  var n = t.call(r), o, i = [], a;
  try {
    for (; (e === void 0 || e-- > 0) && !(o = n.next()).done; ) i.push(o.value);
  } catch (s) {
    a = { error: s };
  } finally {
    try {
      o && !o.done && (t = n.return) && t.call(n);
    } finally {
      if (a) throw a.error;
    }
  }
  return i;
};
function ql(r) {
  var e = r.points, t = e === void 0 ? [] : e, n = r.className, o = r.radius, i = {
    fill: "transparent",
    fillOpacity: 1,
    strokeWidth: 1,
    stroke: "#000",
    strokeOpacity: 1,
    points: ""
  };
  if (pe(St(r), function(u) {
    var d = Ic(u, 2), f = d[0], c = d[1];
    typeof c != "object" && (i[f] = c);
  }), n ? i.className = "lf-basic-shape ".concat(n) : i.className = "lf-basic-shape", o) {
    var a = t.map(function(u) {
      return { x: u[0], y: u[1] };
    }), s = Ul(a, o, !0), l = s.length ? "M ".concat(s[0].x, " ").concat(s[0].y, " ").concat(s.slice(1).map(function(u) {
      return "L ".concat(u.x, " ").concat(u.y);
    }).join(" "), " Z") : "";
    return i.d = l, delete i.points, w("path", no({}, i));
  } else
    return i.points = t.map(function(u) {
      return u.join(",");
    }).join(" "), w("polygon", no({}, i));
}
var fi = function() {
  return fi = Object.assign || function(r) {
    for (var e, t = 1, n = arguments.length; t < n; t++) {
      e = arguments[t];
      for (var o in e) Object.prototype.hasOwnProperty.call(e, o) && (r[o] = e[o]);
    }
    return r;
  }, fi.apply(this, arguments);
}, kc = function(r, e) {
  var t = typeof Symbol == "function" && r[Symbol.iterator];
  if (!t) return r;
  var n = t.call(r), o, i = [], a;
  try {
    for (; (e === void 0 || e-- > 0) && !(o = n.next()).done; ) i.push(o.value);
  } catch (s) {
    a = { error: s };
  } finally {
    try {
      o && !o.done && (t = n.return) && t.call(n);
    } finally {
      if (a) throw a.error;
    }
  }
  return i;
};
function Bc(r) {
  var e = r.className, t = {
    points: "",
    fill: "none"
  };
  return pe(St(r), function(n) {
    var o = kc(n, 2), i = o[0], a = o[1];
    (i === "style" || typeof a != "object") && (t[i] = a);
  }), e && (t.className = "".concat(e)), w("polyline", fi({}, t));
}
var Jl = /* @__PURE__ */ (function() {
  var r = function(e, t) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, o) {
      n.__proto__ = o;
    } || function(n, o) {
      for (var i in o) Object.prototype.hasOwnProperty.call(o, i) && (n[i] = o[i]);
    }, r(e, t);
  };
  return function(e, t) {
    if (typeof t != "function" && t !== null)
      throw new TypeError("Class extends value " + String(t) + " is not a constructor or null");
    r(e, t);
    function n() {
      this.constructor = e;
    }
    e.prototype = t === null ? Object.create(t) : (n.prototype = t.prototype, new n());
  };
})(), Jr = function() {
  return Jr = Object.assign || function(r) {
    for (var e, t = 1, n = arguments.length; t < n; t++) {
      e = arguments[t];
      for (var o in e) Object.prototype.hasOwnProperty.call(e, o) && (r[o] = e[o]);
    }
    return r;
  }, Jr.apply(this, arguments);
}, Xc = function(r, e) {
  var t = {};
  for (var n in r) Object.prototype.hasOwnProperty.call(r, n) && e.indexOf(n) < 0 && (t[n] = r[n]);
  if (r != null && typeof Object.getOwnPropertySymbols == "function")
    for (var o = 0, n = Object.getOwnPropertySymbols(r); o < n.length; o++)
      e.indexOf(n[o]) < 0 && Object.prototype.propertyIsEnumerable.call(r, n[o]) && (t[n[o]] = r[n[o]]);
  return t;
}, Yc = function(r, e) {
  var t = typeof Symbol == "function" && r[Symbol.iterator];
  if (!t) return r;
  var n = t.call(r), o, i = [], a;
  try {
    for (; (e === void 0 || e-- > 0) && !(o = n.next()).done; ) i.push(o.value);
  } catch (s) {
    a = { error: s };
  } finally {
    try {
      o && !o.done && (t = n.return) && t.call(n);
    } finally {
      if (a) throw a.error;
    }
  }
  return i;
}, K;
(function(r) {
  r[r.LEFT_TOP = 0] = "LEFT_TOP", r[r.RIGHT_TOP = 1] = "RIGHT_TOP", r[r.RIGHT_BOTTOM = 2] = "RIGHT_BOTTOM", r[r.LEFT_BOTTOM = 3] = "LEFT_BOTTOM";
})(K || (K = {}));
var Fc = (
  /** @class */
  (function(r) {
    Jl(e, r);
    function e(t) {
      var n = r.call(this) || this;
      n.isShiftPressed = !1, n.bindKeyboardEvents = function() {
        document.addEventListener("keydown", n.handleKeyDown), document.addEventListener("keyup", n.handleKeyUp);
      }, n.handleKeyDown = function(s) {
        s.key === "Shift" && (n.isShiftPressed = !0);
      }, n.handleKeyUp = function(s) {
        s.key === "Shift" && (n.isShiftPressed = !1);
      }, n.updateEdgePointByAnchors = function() {
        var s = n.nodeModel, l = s.id, u = s.anchors, d = n.graphModel.getNodeEdges(l);
        pe(d, function(f) {
          if (f.sourceNodeId === l) {
            var c = kt(u, function(p) {
              return p.id === f.sourceAnchorId;
            });
            c && f.updateStartPoint({
              x: c.x,
              y: c.y
            });
          } else if (f.targetNodeId === l) {
            var c = kt(u, function(h) {
              return h.id === f.targetAnchorId;
            });
            c && f.updateEndPoint({
              x: c.x,
              y: c.y
            });
          }
        });
      }, n.triggerResizeEvent = function(s, l, u, d, f, c) {
        n.graphModel.eventCenter.emit(C.NODE_RESIZE, {
          preData: s,
          data: l,
          deltaX: u,
          deltaY: d,
          index: f,
          model: c
        });
      }, n.recalcResizeInfo = function(s, l, u, d, f) {
        u === void 0 && (u = 1), d === void 0 && (d = !1), f === void 0 && (f = !1);
        var c = I(l), p = c.deltaX, h = c.deltaY, v = c.width, g = c.height, y = c.PCTResizeInfo;
        if (y) {
          var _ = 4, S = 0, A = 0;
          switch (s) {
            case K.LEFT_TOP:
              A = (p * -1 - h) / _;
              break;
            case K.RIGHT_TOP:
              A = (p - h) / _;
              break;
            case K.RIGHT_BOTTOM:
              A = (p + h) / _;
              break;
            case K.LEFT_BOTTOM:
              A = (p * -1 + h) / _;
              break;
          }
          A !== 0 && (S = Math.round(A / y.ResizeBasis.basisHeight * 1e5) / 1e3), y.ResizePCT.widthPCT = Math.max(Math.min(y.ResizePCT.widthPCT + S, y.ScaleLimit.maxScaleLimit), y.ScaleLimit.minScaleLimit), y.ResizePCT.heightPCT = Math.max(Math.min(y.ResizePCT.heightPCT + S, y.ScaleLimit.maxScaleLimit), y.ScaleLimit.minScaleLimit);
          var x = Math.round(y.ResizePCT.widthPCT * y.ResizeBasis.basisWidth / 100), E = Math.round(y.ResizePCT.heightPCT * y.ResizeBasis.basisHeight / 100);
          switch (s) {
            case K.LEFT_TOP:
              p = v - x, h = g - E;
              break;
            case K.RIGHT_TOP:
              p = x - v, h = g - E;
              break;
            case K.RIGHT_BOTTOM:
              p = x - v, h = E - g;
              break;
            case K.LEFT_BOTTOM:
              p = v - x, h = E - g;
              break;
          }
          return c;
        }
        switch (s) {
          case K.LEFT_TOP:
            c.width = d ? v : v - p * u, c.height = f ? g : g - h * u;
            break;
          case K.RIGHT_TOP:
            c.width = d ? v : v + p * u, c.height = f ? g : g - h * u;
            break;
          case K.RIGHT_BOTTOM:
            c.width = d ? v : v + p * u, c.height = f ? g : g + h * u;
            break;
          case K.LEFT_BOTTOM:
            c.width = d ? v : v - p * u, c.height = f ? g : g + h * u;
            break;
        }
        return c;
      }, n.resizeNode = function(s) {
        var l = s.deltaX, u = s.deltaY, d = n.index, f = n.props, c = f.model, p = f.graphModel, h = f.x, v = f.y;
        qc({
          x: h,
          y: v,
          deltaX: l,
          deltaY: u,
          index: d,
          nodeModel: c,
          graphModel: p,
          forceProportional: n.isShiftPressed,
          cancelCallback: function() {
            n.dragHandler.cancelDrag();
          }
        });
      }, n.onDragStart = function() {
        n.graphModel.selectNodeById(n.nodeModel.id);
      }, n.onDragging = function(s) {
        var l = s.deltaX, u = s.deltaY, d = n.graphModel.transformModel, f = Yc(d.fixDeltaXY(l, u), 2), c = f[0], p = f[1];
        n.resizeNode({
          deltaX: c,
          deltaY: p
        });
      }, n.onDragEnd = function() {
        var s = n.nodeModel.x, l = n.nodeModel.y;
        n.nodeModel.moveTo(s, l), n.updateEdgePointByAnchors();
      }, n.onPointerDown = function(s) {
        s.stopPropagation(), n.dragHandler.handleMouseDown(s);
      };
      var o = t.index, i = t.model, a = t.graphModel;
      return n.index = o, n.nodeModel = i, n.graphModel = a, n.dragHandler = new ut({
        onDragStart: n.onDragStart,
        onDragging: n.onDragging,
        onDragEnd: n.onDragEnd,
        step: a.gridSize
      }), n.bindKeyboardEvents(), n;
    }
    return e.prototype.componentWillUnmount = function() {
      this.dragHandler.destroy(), document.removeEventListener("keydown", this.handleKeyDown), document.removeEventListener("keyup", this.handleKeyUp);
    }, e.prototype.getViewPosition = function(t, n, o) {
      var i = this.props.model.getResizeControlStyle(), a = i.width, s = a === void 0 ? 8 : a, l = i.height, u = l === void 0 ? 8 : l;
      switch (t) {
        case "nw":
          return {
            x: n - s / 2,
            y: o - u / 2
          };
        case "ne":
          return {
            x: n + s / 2,
            y: o - u / 2
          };
        case "se":
          return {
            x: n + s / 2,
            y: o + u / 2
          };
        case "sw":
          return {
            x: n - s / 2,
            y: o + u / 2
          };
        default:
          return {
            x: n,
            y: o
          };
      }
    }, e.prototype.render = function() {
      var t = this.props, n = t.x, o = t.y, i = t.direction, a = t.model, s = a.getResizeControlStyle(), l = s.width, u = s.height, d = Xc(s, ["width", "height"]), f = this.getViewPosition(i, n, o), c = f.x, p = f.y;
      return w("g", { className: "lf-resize-control lf-resize-control-".concat(i), children: [w(wt, Jr({ className: "lf-resize-control-content", x: c, y: p, width: l ?? 7, height: u ?? 7 }, d)), w(wt, { className: "lf-resize-control-content", x: c, y: p, width: l ? l + 5 : 25, height: l ? l + 5 : 25, fill: "transparent", stroke: "transparent", onPointerDown: this.onPointerDown })] });
    }, e;
  })($)
), Hc = (
  /** @class */
  (function(r) {
    Jl(e, r);
    function e() {
      return r.call(this) || this;
    }
    return e.prototype.getResizeControl = function() {
      var t = this.props, n = t.model, o = t.graphModel, i = Ne(n), a = i.minX, s = i.minY, l = i.maxX, u = i.maxY, d = [
        {
          index: K.LEFT_TOP,
          direction: "nw",
          x: a,
          y: s
        },
        // 左上角
        {
          index: K.RIGHT_TOP,
          direction: "ne",
          x: l,
          y: s
        },
        // 右上角
        {
          index: K.RIGHT_BOTTOM,
          direction: "se",
          x: l,
          y: u
        },
        // 右下角
        {
          index: K.LEFT_BOTTOM,
          direction: "sw",
          x: a,
          y: u
        }
        // 左下角
      ];
      return ht(d, function(f) {
        return w(Fc, Jr({}, f, { model: n, graphModel: o }));
      });
    }, e.prototype.getResizeOutline = function() {
      var t = this.props.model, n = t.x, o = t.y, i = t.width, a = t.height, s = t.getResizeOutlineStyle();
      return w(wt, Jr({}, s, {
        "pointer-events": "none",
        x: n,
        y: o,
        // TODO：宽高padding后续改成配置化的
        width: i + 10,
        height: a + 10
      }));
    }, e.prototype.render = function() {
      return w("g", { className: "lf-resize-control-group", children: [this.getResizeOutline(), this.getResizeControl()] });
    }, e;
  })($)
);
function Gc(r, e) {
  var t = r.x, n = r.y, o = e.x, i = e.y, a = {
    x: t + (o - t) / 2,
    y: n + (i - n) / 2
  };
  return a;
}
function Nr(r, e, t) {
  var n = zc(t), o = r.x - e.x, i = r.y - e.y, a = o * Math.cos(n) - i * Math.sin(n) + e.x, s = o * Math.sin(n) + i * Math.cos(n) + e.y;
  return {
    x: a,
    y: s
  };
}
function zc(r) {
  return r * Math.PI / 180;
}
function Uc(r) {
  return r / Math.PI * 180;
}
function Vc(r, e, t, n, o, i, a, s) {
  o === void 0 && (o = !1), i === void 0 && (i = !1);
  var l = {
    x: t.x - (r.x - t.x),
    y: t.y - (r.y - t.y)
  }, u = Gc(l, e), d = Nr(e, u, -n), f = Nr(l, u, -n);
  if (o) {
    var c = Math.abs(d.x - f.x), p = c - a;
    u.x > d.x ? u.x = u.x + p / 2 : u.x = u.x - p / 2;
  }
  if (i) {
    var h = Math.abs(d.y - f.y), v = h - s;
    u.y > d.y ? u.y = u.y + v / 2 : u.y = u.y - v / 2;
  }
  if (o || i) {
    var g = Nr(f, u, n), y = g.x - l.x, _ = g.y - l.y;
    u.x = u.x - y, u.y = u.y - _, f = Nr(l, u, -n), d = {
      x: u.x - (f.x - u.x),
      y: u.y - (f.y - u.y)
    };
  }
  var S = Math.abs(d.x - f.x), A = Math.abs(d.y - f.y);
  return o && (S = a), i && (A = s), {
    width: S,
    height: A,
    center: u
  };
}
function $c(r, e, t, n, o, i, a, s, l) {
  s === void 0 && (s = !1), l === void 0 && (l = !1);
  var u = e.deltaX, d = e.deltaY, f = e.width, c = e.height, p = Uc(t), h = {
    x: n,
    // control锚点的坐标x
    y: o
    // control锚点的坐标y
  }, v = { x: i, y: a }, g = Nr(h, v, p), y = {
    x: g.x + u,
    y: g.y + d
  }, _ = Vc(g, y, v, p, s, l, f, c), S = _.width, A = _.height, x = _.center;
  return e.width = S * r, e.height = A * r, e.deltaX = (x.x - v.x) * 2, e.deltaY = (x.y - v.y) * 2, e;
}
var Wc = function(r, e, t, n, o, i, a, s, l, u, d) {
  t === void 0 && (t = 1), n === void 0 && (n = !1), o === void 0 && (o = !1), i === void 0 && (i = 0), d === void 0 && (d = !1);
  var f = I(e), c = f.deltaX, p = f.deltaY, h = f.width, v = f.height, g = f.PCTResizeInfo;
  if (g) {
    var y = 4, _ = 0, S = 0;
    switch (r) {
      case K.LEFT_TOP:
        S = (c * -1 - p) / y;
        break;
      case K.RIGHT_TOP:
        S = (c - p) / y;
        break;
      case K.RIGHT_BOTTOM:
        S = (c + p) / y;
        break;
      case K.LEFT_BOTTOM:
        S = (c * -1 + p) / y;
        break;
    }
    S !== 0 && (_ = Math.round(S / g.ResizeBasis.basisHeight * 1e5) / 1e3), g.ResizePCT.widthPCT = Math.max(Math.min(g.ResizePCT.widthPCT + _, g.ScaleLimit.maxScaleLimit), g.ScaleLimit.minScaleLimit), g.ResizePCT.heightPCT = Math.max(Math.min(g.ResizePCT.heightPCT + _, g.ScaleLimit.maxScaleLimit), g.ScaleLimit.minScaleLimit);
    var A = Math.round(g.ResizePCT.widthPCT * g.ResizeBasis.basisWidth / 100), x = Math.round(g.ResizePCT.heightPCT * g.ResizeBasis.basisHeight / 100);
    switch (r) {
      case K.LEFT_TOP:
        c = h - A, p = v - x;
        break;
      case K.RIGHT_TOP:
        c = A - h, p = v - x;
        break;
      case K.RIGHT_BOTTOM:
        c = A - h, p = x - v;
        break;
      case K.LEFT_BOTTOM:
        c = h - A, p = x - v;
        break;
    }
    return f;
  }
  if (i % (2 * Math.PI) !== 0 && a !== void 0 && s !== void 0)
    return $c(t, f, i, a, s, l, u, n, o);
  if (d) {
    var E = h / v, m = 0, b = h, P = v;
    switch (r) {
      case K.LEFT_TOP:
        m = Math.abs(c) > Math.abs(p) ? -c : -p, E >= 1 ? (b = h + m, P = b / E) : (P = v + m, b = P * E), f.width = b, f.height = P, f.deltaX = h - b, f.deltaY = v - P;
        break;
      case K.RIGHT_TOP:
        m = Math.abs(c) > Math.abs(p) ? c : -p, E >= 1 ? (b = h + m, P = b / E) : (P = v - m, b = P * E), f.width = b, f.height = P, f.deltaX = b - h, f.deltaY = v - P;
        break;
      case K.RIGHT_BOTTOM:
        m = Math.abs(c) > Math.abs(p) ? c : p, E >= 1 ? (b = h + m, P = b / E) : (P = v + m, b = P * E), f.width = b, f.height = P, f.deltaX = b - h, f.deltaY = P - v;
        break;
      case K.LEFT_BOTTOM:
        m = Math.abs(c) > Math.abs(p) ? -c : p, E >= 1 ? (b = h - m, P = b / E) : (P = v + m, b = P * E), f.width = b, f.height = P, f.deltaX = h - b, f.deltaY = P - v;
        break;
    }
    return f;
  }
  switch (r) {
    case K.LEFT_TOP:
      f.width = n ? h : h - c * t, f.height = o ? v : v - p * t;
      break;
    case K.RIGHT_TOP:
      f.width = n ? h : h + c * t, f.height = o ? v : v - p * t;
      break;
    case K.RIGHT_BOTTOM:
      f.width = n ? h : h + c * t, f.height = o ? v : v + p * t;
      break;
    case K.LEFT_BOTTOM:
      f.width = n ? h : h - c * t, f.height = o ? v : v + p * t;
      break;
  }
  return f;
}, Kc = function(r, e) {
  var t = r.id, n = r.anchors, o = e.getNodeEdges(t);
  pe(o, function(i) {
    if (i.sourceNodeId === t) {
      var a = kt(n, function(s) {
        return s.id === i.sourceAnchorId;
      });
      a && i.updateStartPoint({
        x: a.x,
        y: a.y
      });
    } else if (i.targetNodeId === t) {
      var a = kt(n, function(l) {
        return l.id === i.targetAnchorId;
      });
      a && i.updateEndPoint({
        x: a.x,
        y: a.y
      });
    }
  });
}, Zc = function(r, e, t, n, o, i, a) {
  a.eventCenter.emit(C.NODE_RESIZE, {
    preData: r,
    data: e,
    deltaX: t,
    deltaY: n,
    index: o,
    model: i
  });
}, qc = function(r) {
  var e = r.x, t = r.y, n = r.deltaX, o = r.deltaY, i = r.index, a = r.nodeModel, s = r.graphModel, l = r.cancelCallback, u = r.forceProportional, d = u === void 0 ? !1 : u, f = a.r, c = a.rx, p = a.ry, h = a.width, v = a.height, g = a.PCTResizeInfo, y = a.minWidth, _ = a.minHeight, S = a.maxWidth, A = a.maxHeight, x = a.rotate, E = a.x, m = a.y, b = y === S, P = _ === A, D = {
    width: f || c || h,
    height: f || p || v,
    deltaX: n,
    deltaY: o,
    PCTResizeInfo: g
  }, k = f || c && p ? 1 / 2 : 1, Y = e, J = t, H = Wc(i, D, k, b, P, x, Y, J, E, m, d);
  if (H.width < y || H.width > S || H.height < _ || H.height > A) {
    l?.();
    return;
  }
  (x % (2 * Math.PI) == 0 || g || Y === void 0 || J === void 0) && (H.deltaX = b ? 0 : H.deltaX, H.deltaY = P ? 0 : H.deltaY);
  var oe = a.getData(), ne = a.resize(H);
  oe.x === ne.x && oe.y === ne.y || (Kc(a, s), Zc(oe, ne, n, o, i, a, s));
}, Jc = 100, Qc = {
  x: 1,
  y: 0
};
function ep(r, e, t, n, o) {
  for (var i = function(p) {
    if (p < 0 || p > 1)
      throw new RangeError('The value range of parameter "t" is [0,1]');
    return {
      x: r.x * Math.pow(1 - p, 3) + 3 * e.x * p * Math.pow(1 - p, 2) + 3 * t.x * Math.pow(p, 2) * (1 - p) + n.x * Math.pow(p, 3),
      y: r.y * Math.pow(1 - p, 3) + 3 * e.y * p * Math.pow(1 - p, 2) + 3 * t.y * Math.pow(p, 2) * (1 - p) + n.y * Math.pow(p, 3)
    };
  }, a = 0, s = 2, l = n.x, u = n.y, d = n; a < o && s < 50; ) {
    d = i(1 - s / Jc);
    var f = d.x, c = d.y;
    a = We(l, u, f, c), s++;
  }
  return d;
}
function tp(r, e) {
  return r.x * e.y - r.y * e.x;
}
function rp(r, e) {
  var t = [r.x, r.y, r.z], n = [e.x, e.y, e.z];
  return n.reduce(function(o, i, a) {
    return o + i * t[a];
  });
}
function np(r, e) {
  var t = tp(r, e), n = Math.acos(rp(is(r), is(e)));
  return t >= 0 ? n : -n;
}
function is(r) {
  var e = Math.hypot(r.x, r.y);
  return {
    x: r.x / e,
    y: r.y / e,
    z: 0
  };
}
function op(r) {
  return np(Qc, r);
}
function ip(r) {
  return r * (180 / Math.PI);
}
var Ql = function(r, e) {
  var t = I(yr[e || "default"]) || I(yr.default);
  return r && (t = wi(t, r)), t;
}, ap = function(r, e) {
  if (yr[r]) {
    console.warn("theme mode ".concat(r, " already exists"));
    return;
  }
  yr[r] = e, Ct[r] = e.background || Yl, Lt[r] = e.grid || zi;
}, sp = function(r) {
  delete yr[r], delete Ct[r], delete Lt[r];
}, lp = function() {
  var r = {
    colorful: {},
    dark: {},
    retro: {},
    default: {}
  };
  V(yr, r), V(Ct, r), V(Lt, r);
}, up = Ql, dp = 1e3, fp = 999, Qr = function() {
  return ++dp;
}, cp = function() {
  return --fp;
}, de = function() {
  return de = Object.assign || function(r) {
    for (var e, t = 1, n = arguments.length; t < n; t++) {
      e = arguments[t];
      for (var o in e) Object.prototype.hasOwnProperty.call(e, o) && (r[o] = e[o]);
    }
    return r;
  }, de.apply(this, arguments);
}, L = function(r, e, t, n) {
  var o = arguments.length, i = o < 3 ? e : n === null ? n = Object.getOwnPropertyDescriptor(e, t) : n, a;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") i = Reflect.decorate(r, e, t, n);
  else for (var s = r.length - 1; s >= 0; s--) (a = r[s]) && (i = (o < 3 ? a(i) : o > 3 ? a(e, t, i) : a(e, t)) || i);
  return o > 3 && i && Object.defineProperty(e, t, i), i;
}, xo = (
  /** @class */
  (function() {
    function r(e, t) {
      var n;
      this.BaseType = fe.EDGE, this.id = "", this.type = "", this.sourceNodeId = "", this.targetNodeId = "", this.textMode = Xe.TEXT, this.text = {
        value: "",
        x: 0,
        y: 0,
        draggable: !1,
        editable: !0
      }, this.points = "", this.pointsList = [], this.virtual = !1, this.isSelected = !1, this.isHovered = !1, this.isHitable = !0, this.isHittable = !0, this.draggable = !0, this.visible = !0, this.isAnimation = !1, this.isShowAdjustPoint = !1, this.zIndex = 0, this.state = q.DEFAULT, this.modelType = G.EDGE, this.customTextPosition = !1, this.style = {}, this.arrowConfig = {
        markerEnd: "url(#marker-end-".concat(this.id, ")"),
        markerStart: "url(#marker-start-".concat(this.id, ")")
      }, this.graphModel = t, this.properties = (n = e.properties) !== null && n !== void 0 ? n : {}, this.initEdgeData(e), this.setAttributes();
    }
    return r.prototype.initEdgeData = function(e) {
      var t = this;
      if (e.properties || (e.properties = {}), !e.id) {
        var n = this.graphModel.idGenerator, o = n && n(e.type), i = this.createId();
        e.id = i || o || It();
      }
      this.arrowConfig.markerEnd = "url(#marker-end-".concat(e.id, ")"), this.arrowConfig.markerStart = "url(#marker-start-".concat(e.id, ")");
      var a = this.graphModel.editConfigModel.adjustEdgeStartAndEnd;
      this.isShowAdjustPoint = a, V(this, fc(e));
      var s = this.graphModel, l = s.overlapMode, u = s.eventCenter;
      this.updateZIndexByOverlap(l, e.zIndex || Qr()), this.setAnchors(), this.initPoints(), this.formatText(e), u.on("overlap:change", function(d) {
        var f = d.overlapMode;
        t.updateZIndexByOverlap(f, t.zIndex || Qr());
      });
    }, r.prototype.setAttributes = function() {
    }, r.prototype.createId = function() {
      return null;
    }, r.prototype.getEdgeStyle = function() {
      return de(de({}, this.graphModel.theme.baseEdge), this.style);
    }, r.prototype.getAdjustPointStyle = function() {
      return de({}, this.graphModel.theme.edgeAdjust);
    }, r.prototype.getTextStyle = function() {
      var e = this.graphModel.theme.edgeText;
      return I(e);
    }, r.prototype.getEdgeAnimationStyle = function() {
      var e = this.graphModel.theme.edgeAnimation;
      return I(e);
    }, r.prototype.getArrowStyle = function() {
      var e = this.getEdgeStyle(), t = this.getEdgeAnimationStyle(), n = this.graphModel.theme.arrow, o = this.isAnimation ? t.stroke : e.stroke;
      return de(de(de({}, e), { fill: o, stroke: o }), n);
    }, r.prototype.getOutlineStyle = function() {
      var e = this.graphModel, t = e.theme.edgeOutline, n = de({}, t);
      if (this.isHovered) {
        var o = t.hover || {};
        n = de(de({}, n), o);
      }
      return I(n);
    }, r.prototype.getTextPosition = function() {
      return {
        x: 0,
        y: 0
      };
    }, Object.defineProperty(r.prototype, "sourceNode", {
      /**
       * 边的前一个节点
       */
      get: function() {
        var e, t;
        return (t = (e = this.graphModel) === null || e === void 0 ? void 0 : e.nodesMap[this.sourceNodeId]) === null || t === void 0 ? void 0 : t.model;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "targetNode", {
      /**
       * 边的后一个节点
       */
      get: function() {
        var e, t;
        return (t = (e = this.graphModel) === null || e === void 0 ? void 0 : e.nodesMap[this.targetNodeId]) === null || t === void 0 ? void 0 : t.model;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "textPosition", {
      get: function() {
        return this.getTextPosition();
      },
      enumerable: !1,
      configurable: !0
    }), r.prototype.getBeginAnchor = function(e, t, n) {
      var o, i, a = oi(e);
      if (n) {
        if (o = kt(a, function(s) {
          return s.id === n;
        }), o)
          return o;
        console.warn("未在节点上找到指定的起点锚点".concat(n, "，已使用默认锚点作为起点"));
      }
      return a.forEach(function(s) {
        var l = qa(s, t);
        (i === void 0 || l < i) && (i = l, o = s);
      }), o;
    }, r.prototype.getEndAnchor = function(e, t) {
      var n = this, o, i, a = oi(e);
      if (t) {
        if (o = kt(a, function(s) {
          return s.id === t;
        }), o)
          return o;
        console.warn("未在节点上找到指定的终点锚点".concat(t, "，已使用默认锚点作为终点"));
      }
      return a.forEach(function(s) {
        if (n.startPoint) {
          var l = qa(s, n.startPoint);
          (i === void 0 || l < i) && (i = l, o = s);
        }
      }), o;
    }, r.prototype.getProperties = function() {
      return nt(this.properties);
    }, r.prototype.getData = function() {
      var e = this.properties;
      bt(e) && (e = nt(e));
      var t = {
        id: this.id,
        type: this.type,
        properties: e,
        sourceNodeId: this.sourceNodeId,
        targetNodeId: this.targetNodeId,
        sourceAnchorId: this.sourceAnchorId,
        targetAnchorId: this.targetAnchorId,
        startPoint: V({}, this.startPoint),
        endPoint: V({}, this.endPoint)
      };
      [_e.INCREASE, _e.STATIC].includes(this.graphModel.overlapMode) && (t.zIndex = this.zIndex);
      var n = this.text, o = n.x, i = n.y, a = n.value;
      return a && (t.text = {
        x: o,
        y: i,
        value: a
      }), t;
    }, r.prototype.getHistoryData = function() {
      return this.getData();
    }, r.prototype.setProperty = function(e, t) {
      Yi(this.properties, e, Se(t)), this.setAttributes();
    }, r.prototype.deleteProperty = function(e) {
      delete this.properties[e], this.setAttributes();
    }, r.prototype.setProperties = function(e) {
      this.properties = de(de({}, nt(this.properties)), Se(e)), this.setAttributes();
    }, r.prototype.changeEdgeId = function(e) {
      var t = this.arrowConfig, n = t.markerEnd, o = t.markerStart;
      o && o === "url(#marker-start-".concat(this.id, ")") && (this.arrowConfig.markerStart = "url(#marker-start-".concat(e, ")")), n && n === "url(#marker-end-".concat(this.id, ")") && (this.arrowConfig.markerEnd = "url(#marker-end-".concat(e, ")")), this.id = e;
    }, r.prototype.setStyle = function(e, t) {
      var n;
      this.style = de(de({}, this.style), (n = {}, n[e] = Se(t), n));
    }, r.prototype.setStyles = function(e) {
      this.style = de(de({}, this.style), Se(e));
    }, r.prototype.updateStyles = function(e) {
      this.style = de({}, Se(e));
    }, r.prototype.setTextMode = function(e) {
      this.textMode = e;
    }, r.prototype.formatText = function(e) {
      var t, n, o, i = this.graphModel.editConfigModel, a = i.edgeTextDraggable, s = i.edgeTextEdit, l = this.textPosition, u = l.x, d = l.y, f = e.text, c = {
        value: "",
        x: u,
        y: d,
        draggable: a,
        editable: s
      };
      f && (typeof f == "string" ? c = de(de({}, c), { value: f }) : (c = de(de({}, c), { x: (t = f.x) !== null && t !== void 0 ? t : u, y: (n = f.y) !== null && n !== void 0 ? n : d, value: (o = f.value) !== null && o !== void 0 ? o : "" }), lr(f.draggable) || (c.draggable = f.draggable), lr(f.editable) || (c.editable = f.editable))), this.text = c;
    }, r.prototype.resetTextPosition = function() {
      var e = this.textPosition, t = e.x, n = e.y;
      this.text.x = t, this.text.y = n;
    }, r.prototype.moveText = function(e, t) {
      var n = this.text, o = n.x, i = n.y, a = n.value, s = n.draggable, l = n.editable;
      this.text = {
        value: a,
        editable: l,
        draggable: s,
        x: o + e,
        y: i + t
      };
    }, r.prototype.setText = function(e) {
      e && V(this.text, e);
    }, r.prototype.updateText = function(e) {
      this.text = de(de({}, nt(this.text)), { value: e });
    }, r.prototype.setAnchors = function() {
      if (!this.sourceAnchorId || !this.startPoint) {
        var e = this.getBeginAnchor(this.sourceNode, this.targetNode, this.sourceAnchorId);
        if (!e)
          throw new Error("无法获取beginAnchor，请检查anchors相关逻辑，anchors不能为空");
        this.startPoint || (this.startPoint = {
          x: e.x,
          y: e.y
        }), this.sourceAnchorId || (this.sourceAnchorId = e.id);
      }
      if (!this.targetAnchorId || !this.endPoint) {
        var e = this.getEndAnchor(this.targetNode, this.targetAnchorId);
        if (!e)
          throw new Error("无法获取endAnchor，请检查anchors相关逻辑，anchors不能为空");
        this.endPoint || (this.endPoint = {
          x: e.x,
          y: e.y
        }), this.targetAnchorId || (this.targetAnchorId = e.id);
      }
    }, r.prototype.setSelected = function(e) {
      e === void 0 && (e = !0), this.isSelected = e;
    }, r.prototype.setHovered = function(e) {
      e === void 0 && (e = !0), this.isHovered = e;
    }, r.prototype.setHitable = function(e) {
      e === void 0 && (e = !0), this.isHitable = e;
    }, r.prototype.setHittable = function(e) {
      e === void 0 && (e = !0), this.isHittable = e;
    }, r.prototype.openEdgeAnimation = function() {
      this.isAnimation = !0;
    }, r.prototype.closeEdgeAnimation = function() {
      this.isAnimation = !1;
    }, r.prototype.setElementState = function(e, t) {
      this.state = e, this.additionStateData = t;
    }, r.prototype.updateStartPoint = function(e) {
      this.startPoint = e;
    }, r.prototype.moveStartPoint = function(e, t) {
      this.startPoint && (this.startPoint.x += e, this.startPoint.y += t);
    }, r.prototype.updateEndPoint = function(e) {
      this.endPoint = e;
    }, r.prototype.moveEndPoint = function(e, t) {
      this.endPoint && (this.endPoint.x += e, this.endPoint.y += t);
    }, r.prototype.setZIndex = function(e) {
      e === void 0 && (e = 0), this.zIndex = e;
    }, r.prototype.initPoints = function() {
    }, r.prototype.updateAttributes = function(e) {
      V(this, e);
    }, r.prototype.getAdjustStart = function() {
      return this.startPoint;
    }, r.prototype.getAdjustEnd = function() {
      return this.endPoint;
    }, r.prototype.updateAfterAdjustStartAndEnd = function(e) {
      var t = e.startPoint, n = e.endPoint;
      this.updateStartPoint({ x: t.x, y: t.y }), this.updateEndPoint({ x: n.x, y: n.y });
    }, r.prototype.updateZIndexByOverlap = function(e, t) {
      switch (e) {
        case _e.DEFAULT:
          this.zIndex = 0;
          break;
        case _e.EDGE_TOP:
          this.zIndex = 1;
          break;
        case _e.INCREASE:
          this.zIndex = t;
          break;
      }
    }, r.BaseType = fe.EDGE, L([
      M
    ], r.prototype, "type", void 0), L([
      M
    ], r.prototype, "sourceNodeId", void 0), L([
      M
    ], r.prototype, "targetNodeId", void 0), L([
      M
    ], r.prototype, "startPoint", void 0), L([
      M
    ], r.prototype, "endPoint", void 0), L([
      M
    ], r.prototype, "textMode", void 0), L([
      M
    ], r.prototype, "text", void 0), L([
      M
    ], r.prototype, "properties", void 0), L([
      M
    ], r.prototype, "points", void 0), L([
      M
    ], r.prototype, "pointsList", void 0), L([
      M
    ], r.prototype, "isSelected", void 0), L([
      M
    ], r.prototype, "isHovered", void 0), L([
      M
    ], r.prototype, "isHitable", void 0), L([
      M
    ], r.prototype, "isHittable", void 0), L([
      M
    ], r.prototype, "draggable", void 0), L([
      M
    ], r.prototype, "visible", void 0), L([
      M
    ], r.prototype, "isAnimation", void 0), L([
      M
    ], r.prototype, "isShowAdjustPoint", void 0), L([
      M
    ], r.prototype, "zIndex", void 0), L([
      M
    ], r.prototype, "state", void 0), L([
      M
    ], r.prototype, "style", void 0), L([
      M
    ], r.prototype, "arrowConfig", void 0), L([
      te
    ], r.prototype, "sourceNode", null), L([
      te
    ], r.prototype, "targetNode", null), L([
      te
    ], r.prototype, "textPosition", null), L([
      O
    ], r.prototype, "setProperty", null), L([
      O
    ], r.prototype, "deleteProperty", null), L([
      O
    ], r.prototype, "setProperties", null), L([
      O
    ], r.prototype, "changeEdgeId", null), L([
      O
    ], r.prototype, "setStyle", null), L([
      O
    ], r.prototype, "setStyles", null), L([
      O
    ], r.prototype, "updateStyles", null), L([
      O
    ], r.prototype, "setTextMode", null), L([
      O
    ], r.prototype, "formatText", null), L([
      O
    ], r.prototype, "resetTextPosition", null), L([
      O
    ], r.prototype, "moveText", null), L([
      O
    ], r.prototype, "setText", null), L([
      O
    ], r.prototype, "updateText", null), L([
      O
    ], r.prototype, "setAnchors", null), L([
      O
    ], r.prototype, "setSelected", null), L([
      O
    ], r.prototype, "setHovered", null), L([
      O
    ], r.prototype, "setHitable", null), L([
      O
    ], r.prototype, "setHittable", null), L([
      O
    ], r.prototype, "openEdgeAnimation", null), L([
      O
    ], r.prototype, "closeEdgeAnimation", null), L([
      O
    ], r.prototype, "setElementState", null), L([
      O
    ], r.prototype, "updateStartPoint", null), L([
      O
    ], r.prototype, "moveStartPoint", null), L([
      O
    ], r.prototype, "updateEndPoint", null), L([
      O
    ], r.prototype, "moveEndPoint", null), L([
      O
    ], r.prototype, "setZIndex", null), L([
      O
    ], r.prototype, "initPoints", null), L([
      O
    ], r.prototype, "updateAttributes", null), L([
      O
    ], r.prototype, "getAdjustStart", null), L([
      O
    ], r.prototype, "getAdjustEnd", null), L([
      O
    ], r.prototype, "updateAfterAdjustStartAndEnd", null), L([
      O
    ], r.prototype, "updateZIndexByOverlap", null), r;
  })()
), pp = /* @__PURE__ */ (function() {
  var r = function(e, t) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, o) {
      n.__proto__ = o;
    } || function(n, o) {
      for (var i in o) Object.prototype.hasOwnProperty.call(o, i) && (n[i] = o[i]);
    }, r(e, t);
  };
  return function(e, t) {
    if (typeof t != "function" && t !== null)
      throw new TypeError("Class extends value " + String(t) + " is not a constructor or null");
    r(e, t);
    function n() {
      this.constructor = e;
    }
    e.prototype = t === null ? Object.create(t) : (n.prototype = t.prototype, new n());
  };
})(), Dt = function() {
  return Dt = Object.assign || function(r) {
    for (var e, t = 1, n = arguments.length; t < n; t++) {
      e = arguments[t];
      for (var o in e) Object.prototype.hasOwnProperty.call(e, o) && (r[o] = e[o]);
    }
    return r;
  }, Dt.apply(this, arguments);
}, Ie = function(r, e, t, n) {
  var o = arguments.length, i = o < 3 ? e : n === null ? n = Object.getOwnPropertyDescriptor(e, t) : n, a;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") i = Reflect.decorate(r, e, t, n);
  else for (var s = r.length - 1; s >= 0; s--) (a = r[s]) && (i = (o < 3 ? a(i) : o > 3 ? a(e, t, i) : a(e, t)) || i);
  return o > 3 && i && Object.defineProperty(e, t, i), i;
}, No = function(r, e) {
  var t = typeof Symbol == "function" && r[Symbol.iterator];
  if (!t) return r;
  var n = t.call(r), o, i = [], a;
  try {
    for (; (e === void 0 || e-- > 0) && !(o = n.next()).done; ) i.push(o.value);
  } catch (s) {
    a = { error: s };
  } finally {
    try {
      o && !o.done && (t = n.return) && t.call(n);
    } finally {
      if (a) throw a.error;
    }
  }
  return i;
}, as = (
  /** @class */
  (function(r) {
    pp(e, r);
    function e(t, n) {
      var o = r.call(this, t, n) || this;
      return o.modelType = G.BEZIER_EDGE, o.path = "", o.initEdgeData(t), o.setAttributes(), o;
    }
    return e.prototype.initEdgeData = function(t) {
      this.offset = uo(t, "properties.offset", 100), r.prototype.initEdgeData.call(this, t);
    }, e.prototype.getEdgeStyle = function() {
      var t = this.graphModel.theme.bezier, n = r.prototype.getEdgeStyle.call(this), o = this.properties.style, i = o === void 0 ? {} : o;
      return Dt(Dt(Dt({}, n), I(t)), I(i));
    }, e.prototype.getTextPosition = function() {
      if (this.pointsList && this.pointsList.length > 0) {
        var t = 0, n = 0;
        return this.pointsList.forEach(function(o) {
          var i = o.x, a = o.y;
          t += i, n += a;
        }), {
          x: t / this.pointsList.length,
          y: n / this.pointsList.length
        };
      }
      return {
        x: (this.startPoint.x + this.endPoint.x) / 2,
        y: (this.startPoint.y + this.endPoint.y) / 2
      };
    }, e.prototype.getData = function() {
      var t = r.prototype.getData.call(this), n = this.pointsList.map(function(o) {
        var i = o.x, a = o.y;
        return { x: i, y: a };
      });
      return Dt(Dt({}, t), { pointsList: n });
    }, e.prototype.getControls = function() {
      var t = this.startPoint, n = this.endPoint, o = Ka({
        start: t,
        end: n,
        sourceNode: this.sourceNode,
        targetNode: this.targetNode,
        offset: this.offset
      });
      return o;
    }, e.prototype.getPath = function(t) {
      var n = No(t, 4), o = n[0], i = n[1], a = n[2], s = n[3];
      return "M ".concat(o.x, " ").concat(o.y, `
    C `).concat(i.x, " ").concat(i.y, `,
    `).concat(a.x, " ").concat(a.y, `,
    `).concat(s.x, " ").concat(s.y);
    }, e.prototype.initPoints = function() {
      this.pointsList.length > 0 ? this.path = this.getPath(this.pointsList) : this.updatePoints();
    }, e.prototype.updatePoints = function() {
      var t = this.getControls(), n = t.sNext, o = t.ePre;
      this.updatePath(n, o);
    }, e.prototype.updatePath = function(t, n) {
      t = I(t), n = I(n);
      var o = {
        x: this.startPoint.x,
        y: this.startPoint.y
      }, i = {
        x: this.endPoint.x,
        y: this.endPoint.y
      };
      if (!t || !n) {
        var a = this.getControls();
        t = a.sNext, n = a.ePre;
      }
      this.pointsList = [o, t, n, i], this.path = this.getPath(this.pointsList);
    }, e.prototype.updateStartPoint = function(t) {
      this.startPoint = Object.assign({}, t), this.updatePoints();
    }, e.prototype.updateEndPoint = function(t) {
      this.endPoint = Object.assign({}, t), this.updatePoints();
    }, e.prototype.moveStartPoint = function(t, n) {
      this.startPoint.x += t, this.startPoint.y += n;
      var o = No(this.pointsList, 3), i = o[1], a = o[2];
      i.x += t, i.y += n, this.updatePath(i, a);
    }, e.prototype.moveEndPoint = function(t, n) {
      this.endPoint.x += t, this.endPoint.y += n;
      var o = No(this.pointsList, 3), i = o[1], a = o[2];
      a.x += t, a.y += n, this.updatePath(i, a);
    }, e.prototype.updateAdjustAnchor = function(t, n) {
      var o;
      n === "sNext" ? this.pointsList[1] = t : n === "ePre" && (this.pointsList[2] = t), this.path = this.getPath(this.pointsList), !((o = this.text) === null || o === void 0) && o.value && this.setText(V({}, this.text, this.textPosition));
    }, e.prototype.getAdjustStart = function() {
      return this.pointsList[0] || this.startPoint;
    }, e.prototype.getAdjustEnd = function() {
      var t = this.pointsList;
      return t[t.length - 1] || this.endPoint;
    }, e.prototype.updateAfterAdjustStartAndEnd = function(t) {
      var n = t.startPoint, o = t.endPoint, i = t.sourceNode, a = t.targetNode, s = Ka({
        start: n,
        end: o,
        sourceNode: i,
        targetNode: a,
        offset: this.offset
      }), l = s.sNext, u = s.ePre;
      this.pointsList = [n, l, u, o], this.initPoints();
    }, Ie([
      M
    ], e.prototype, "offset", void 0), Ie([
      M
    ], e.prototype, "path", void 0), Ie([
      O
    ], e.prototype, "initPoints", null), Ie([
      O
    ], e.prototype, "updatePoints", null), Ie([
      O
    ], e.prototype, "updateStartPoint", null), Ie([
      O
    ], e.prototype, "updateEndPoint", null), Ie([
      O
    ], e.prototype, "moveStartPoint", null), Ie([
      O
    ], e.prototype, "moveEndPoint", null), Ie([
      O
    ], e.prototype, "updateAdjustAnchor", null), Ie([
      O
    ], e.prototype, "getAdjustStart", null), Ie([
      O
    ], e.prototype, "getAdjustEnd", null), Ie([
      O
    ], e.prototype, "updateAfterAdjustStartAndEnd", null), e;
  })(xo)
), hp = /* @__PURE__ */ (function() {
  var r = function(e, t) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, o) {
      n.__proto__ = o;
    } || function(n, o) {
      for (var i in o) Object.prototype.hasOwnProperty.call(o, i) && (n[i] = o[i]);
    }, r(e, t);
  };
  return function(e, t) {
    if (typeof t != "function" && t !== null)
      throw new TypeError("Class extends value " + String(t) + " is not a constructor or null");
    r(e, t);
    function n() {
      this.constructor = e;
    }
    e.prototype = t === null ? Object.create(t) : (n.prototype = t.prototype, new n());
  };
})(), Ir = function() {
  return Ir = Object.assign || function(r) {
    for (var e, t = 1, n = arguments.length; t < n; t++) {
      e = arguments[t];
      for (var o in e) Object.prototype.hasOwnProperty.call(e, o) && (r[o] = e[o]);
    }
    return r;
  }, Ir.apply(this, arguments);
}, ss = function(r, e) {
  var t = typeof Symbol == "function" && r[Symbol.iterator];
  if (!t) return r;
  var n = t.call(r), o, i = [], a;
  try {
    for (; (e === void 0 || e-- > 0) && !(o = n.next()).done; ) i.push(o.value);
  } catch (s) {
    a = { error: s };
  } finally {
    try {
      o && !o.done && (t = n.return) && t.call(n);
    } finally {
      if (a) throw a.error;
    }
  }
  return i;
}, vp = function(r, e, t) {
  if (t || arguments.length === 2) for (var n = 0, o = e.length, i; n < o; n++)
    (i || !(n in e)) && (i || (i = Array.prototype.slice.call(e, 0, n)), i[n] = e[n]);
  return r.concat(i || Array.prototype.slice.call(e));
}, ls = (
  /** @class */
  (function(r) {
    hp(e, r);
    function e() {
      var t = r.apply(this, vp([], ss(arguments), !1)) || this;
      return t.modelType = G.LINE_EDGE, t;
    }
    return e.prototype.getEdgeStyle = function() {
      var t = this.graphModel.theme.line, n = r.prototype.getEdgeStyle.call(this), o = this.properties.style, i = o === void 0 ? {} : o;
      return Ir(Ir(Ir({}, n), I(t)), I(i));
    }, e.prototype.initEdgeData = function(t) {
      r.prototype.initEdgeData.call(this, t), this.points = this.getPath([this.startPoint, this.endPoint]);
    }, e.prototype.getPath = function(t) {
      var n = ss(t, 2), o = n[0], i = n[1];
      return "".concat(o.x, ",").concat(o.y, " ").concat(i.x, ",").concat(i.y);
    }, e.prototype.getTextPosition = function() {
      return {
        x: (this.startPoint.x + this.endPoint.x) / 2,
        y: (this.startPoint.y + this.endPoint.y) / 2
      };
    }, e;
  })(xo)
), yp = /* @__PURE__ */ (function() {
  var r = function(e, t) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, o) {
      n.__proto__ = o;
    } || function(n, o) {
      for (var i in o) Object.prototype.hasOwnProperty.call(o, i) && (n[i] = o[i]);
    }, r(e, t);
  };
  return function(e, t) {
    if (typeof t != "function" && t !== null)
      throw new TypeError("Class extends value " + String(t) + " is not a constructor or null");
    r(e, t);
    function n() {
      this.constructor = e;
    }
    e.prototype = t === null ? Object.create(t) : (n.prototype = t.prototype, new n());
  };
})(), kr = function() {
  return kr = Object.assign || function(r) {
    for (var e, t = 1, n = arguments.length; t < n; t++) {
      e = arguments[t];
      for (var o in e) Object.prototype.hasOwnProperty.call(e, o) && (r[o] = e[o]);
    }
    return r;
  }, kr.apply(this, arguments);
}, me = function(r, e, t, n) {
  var o = arguments.length, i = o < 3 ? e : n === null ? n = Object.getOwnPropertyDescriptor(e, t) : n, a;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") i = Reflect.decorate(r, e, t, n);
  else for (var s = r.length - 1; s >= 0; s--) (a = r[s]) && (i = (o < 3 ? a(i) : o > 3 ? a(e, t, i) : a(e, t)) || i);
  return o > 3 && i && Object.defineProperty(e, t, i), i;
}, us = function(r, e) {
  var t = typeof Symbol == "function" && r[Symbol.iterator];
  if (!t) return r;
  var n = t.call(r), o, i = [], a;
  try {
    for (; (e === void 0 || e-- > 0) && !(o = n.next()).done; ) i.push(o.value);
  } catch (s) {
    a = { error: s };
  } finally {
    try {
      o && !o.done && (t = n.return) && t.call(n);
    } finally {
      if (a) throw a.error;
    }
  }
  return i;
}, gp = function(r, e, t) {
  if (t || arguments.length === 2) for (var n = 0, o = e.length, i; n < o; n++)
    (i || !(n in e)) && (i || (i = Array.prototype.slice.call(e, 0, n)), i[n] = e[n]);
  return r.concat(i || Array.prototype.slice.call(e));
}, ds = function(r) {
  return !!r && Number.isFinite(r.x) && Number.isFinite(r.y);
}, fs = (
  /** @class */
  (function(r) {
    yp(e, r);
    function e() {
      var t = r.apply(this, gp([], us(arguments), !1)) || this;
      return t.modelType = G.POLYLINE_EDGE, t.draggingPointList = [], t;
    }
    return e.prototype.initEdgeData = function(t) {
      var n = uo(t, "properties.offset");
      if (this.offset = typeof n == "number" ? n : this.getDefaultOffset(), t.pointsList) {
        var o = this.orthogonalizePath(t.pointsList);
        t.pointsList = o, this.pointsList = o;
      }
      r.prototype.initEdgeData.call(this, t);
    }, e.prototype.setAttributes = function() {
      var t = this.properties.offset;
      t && t !== this.offset && (this.offset = t, this.updatePoints());
    }, e.prototype.orthogonalizePath = function(t) {
      if (!Array.isArray(t) || t.length < 2)
        return t;
      var n = function(A, x) {
        var E = A[A.length - 1];
        (!E || E.x !== x.x || E.y !== x.y) && A.push({ x: x.x, y: x.y });
      }, o = function(A, x) {
        return A.x === x.x || A.y === x.y;
      }, i = function(A, x) {
        return Math.abs(A.x - x.x) + Math.abs(A.y - x.y);
      }, a = [];
      n(a, t[0]);
      for (var s, l = 0; l < t.length - 1; l++) {
        var u = a[a.length - 1], d = t[l + 1];
        if (!(!u || !d)) {
          if (o(u, d)) {
            n(a, d), s = u.x === d.x ? z.VERTICAL : z.HORIZONTAL;
            continue;
          }
          var f = { x: d.x, y: u.y }, c = { x: u.x, y: d.y }, p = s === z.VERTICAL ? c : s === z.HORIZONTAL || i(u, f) <= i(u, c) ? f : c;
          (p.x !== u.x || p.y !== u.y) && n(a, p), n(a, d);
          var h = a[a.length - 2], v = a[a.length - 1];
          s = h && v ? h.x === v.x ? z.VERTICAL : z.HORIZONTAL : s;
        }
      }
      for (var g = [], l = 0; l < a.length; l++) {
        var y = a[l - 1], _ = a[l], d = a[l + 1];
        y && _ && d && (y.x === _.x && _.x === d.x || // 水平共线
        y.y === _.y && _.y === d.y) || n(g, _);
      }
      g.length >= 2 && (g[0] = { x: t[0].x, y: t[0].y }, g[g.length - 1] = {
        x: t[t.length - 1].x,
        y: t[t.length - 1].y
      });
      var S = g.length < 2 || g.every(function(A, x, E) {
        return x === 0 ? !0 : o(E[x - 1], E[x]);
      });
      return S ? g : [
        { x: t[0].x, y: t[0].y },
        { x: t[t.length - 1].x, y: t[t.length - 1].y }
      ];
    }, e.prototype.getDefaultOffset = function() {
      var t = this.getArrowStyle(), n = typeof t.offset == "number" ? t.offset : 0;
      return n + 5;
    }, e.prototype.getEdgeStyle = function() {
      var t = this.graphModel.theme.polyline, n = r.prototype.getEdgeStyle.call(this), o = this.properties.style, i = o === void 0 ? {} : o;
      return kr(kr(kr({}, n), I(t)), I(i));
    }, e.prototype.getTextPosition = function() {
      var t, n = (t = this.text) === null || t === void 0 ? void 0 : t.value;
      if (this.dbClickPosition && !n) {
        var o = this.dbClickPosition, i = o.x, a = o.y;
        return { x: i, y: a };
      }
      var s = Et(this.points), l = us(lc(s), 2), u = l[0], d = l[1];
      return {
        x: (u.x + d.x) / 2,
        y: (u.y + d.y) / 2
      };
    }, e.prototype.getAfterAnchor = function(t, n, o) {
      var i, a;
      return o.forEach(function(s) {
        var l;
        t === z.HORIZONTAL ? l = Math.abs(n.y - s.y) : t === z.VERTICAL && (l = Math.abs(n.x - s.x)), (!a || a > l) && (a = l, i = s);
      }), i;
    }, e.prototype.getCrossPoint = function(t, n, o) {
      var i;
      return t === z.HORIZONTAL ? i = {
        x: o.x,
        y: n.y
      } : t === z.VERTICAL && (i = {
        x: n.x,
        y: o.y
      }), i;
    }, e.prototype.removeCrossPoints = function(t, n, o) {
      var i = o.map(function(y) {
        return y;
      });
      if (t === 1) {
        var a = i[t], s = i[n], l = i[t - 1], u = Ua(l, a, this.sourceNode);
        if (u) {
          var d = Va(a, s, this.sourceNode);
          if (d) {
            var f = $a(a, s, this.sourceNode);
            f && (i[t] = f, i.splice(t - 1, 1), t--, n--);
          }
        } else {
          var c = this.sourceNode.anchors;
          c.forEach(function(y) {
            if (y.x === l.x && y.x === a.x || y.y === l.y && y.y === a.y) {
              var _ = We(y.x, y.y, a.x, a.y), S = We(l.x, l.y, a.x, a.y);
              _ < S && (i[t - 1] = y);
            }
          });
        }
      }
      if (n === o.length - 2) {
        var p = i[t], h = i[n], v = i[n + 1], g = Ua(h, v, this.targetNode);
        if (g) {
          var d = Va(p, h, this.targetNode);
          if (d) {
            var f = $a(p, h, this.targetNode);
            f && (i[n] = f, i.splice(n + 1, 1));
          }
        } else {
          var c = this.targetNode.anchors;
          c.forEach(function(_) {
            if (_.x === v.x && _.x === h.x || _.y === v.y && _.y === h.y) {
              var S = We(_.x, _.y, h.x, h.y), A = We(v.x, v.y, h.x, h.y);
              S < A && (i[n + 1] = _);
            }
          });
        }
      }
      return i;
    }, e.prototype.getDraggingPoints = function(t, n, o, i, a) {
      var s = a.map(function(d) {
        return d;
      }), l = this.getAfterAnchor(t, o, i), u = this.getCrossPoint(t, o, l);
      return n === "start" ? (s.unshift(u), s.unshift(l)) : (s.push(u), s.push(l)), s;
    }, e.prototype.updateCrossPoints = function(t) {
      var n = t.map(function(_) {
        return _;
      }), o = t[0], i = t[1], a = t[n.length - 2], s = t[n.length - 1], l = this, u = l.sourceNode, d = l.targetNode, f = u.modelType, c = d.modelType, p = qn(o, i), h = n[0];
      switch (f) {
        case G.RECT_NODE:
          if (u.radius !== 0) {
            var v = es(o, u);
            v || (h = Qa(o, p, u));
          }
          break;
        case G.CIRCLE_NODE:
          h = ii(o, p, u);
          break;
        case G.ELLIPSE_NODE:
          h = ts(o, p, u);
          break;
        case G.DIAMOND_NODE:
          h = mn(o, p, u);
          break;
        case G.POLYGON_NODE:
          h = mn(o, p, u);
          break;
      }
      ds(h) && (n[0] = h);
      var g = qn(a, s), y = n[n.length - 1];
      switch (c) {
        case G.RECT_NODE:
          if (d.radius !== 0) {
            var v = es(s, d);
            v || (y = Qa(s, g, d));
          }
          break;
        case G.CIRCLE_NODE:
          y = ii(s, g, d);
          break;
        case G.ELLIPSE_NODE:
          y = ts(s, g, d);
          break;
        case G.DIAMOND_NODE:
          y = mn(s, g, d);
          break;
        case G.POLYGON_NODE:
          y = mn(s, g, d);
          break;
      }
      return ds(y) && (n[n.length - 1] = y), n;
    }, e.prototype.updatePath = function(t) {
      this.pointsList = this.orthogonalizePath(t), this.points = this.getPath(this.pointsList);
    }, e.prototype.getData = function() {
      var t = r.prototype.getData.call(this), n = this.pointsList.map(function(o) {
        var i = o.x, a = o.y;
        return {
          x: i,
          y: a
        };
      });
      return Object.assign({}, t, {
        pointsList: n
      });
    }, e.prototype.getPath = function(t) {
      return t.map(function(n) {
        return "".concat(n.x, ",").concat(n.y);
      }).join(" ");
    }, e.prototype.initPoints = function() {
      this.pointsList.length > 0 ? this.points = this.getPath(this.pointsList) : this.updatePoints();
    }, e.prototype.updatePoints = function() {
      var t = za({
        x: this.startPoint.x,
        y: this.startPoint.y
      }, {
        x: this.endPoint.x,
        y: this.endPoint.y
      }, this.sourceNode, this.targetNode, this.offset || 0);
      this.pointsList = this.orthogonalizePath(t), this.points = this.pointsList.map(function(n) {
        return "".concat(n.x, ",").concat(n.y);
      }).join(" ");
    }, e.prototype.updateStartPoint = function(t) {
      this.startPoint = Object.assign({}, t), this.updatePoints();
    }, e.prototype.moveStartPoint = function(t, n) {
      this.startPoint.x += t, this.startPoint.y += n, this.updatePoints();
    }, e.prototype.updateEndPoint = function(t) {
      this.endPoint = Object.assign({}, t), this.updatePoints();
    }, e.prototype.moveEndPoint = function(t, n) {
      this.endPoint.x += t, this.endPoint.y += n, this.updatePoints();
    }, e.prototype.updatePointsList = function(t, n) {
      this.pointsList.forEach(function(a) {
        a.x += t, a.y += n;
      });
      var o = this.pointsList[0];
      this.startPoint = Object.assign({}, o);
      var i = this.pointsList[this.pointsList.length - 1];
      this.endPoint = Object.assign({}, i), this.initPoints();
    }, e.prototype.dragAppendStart = function() {
      this.draggingPointList = this.pointsList.map(function(t) {
        return t;
      });
    }, e.prototype.dragAppendSimple = function(t, n) {
      var o;
      this.isDragging = !0;
      var i = t.start, a = t.end, s = t.startIndex, l = t.endIndex, u = t.direction, d = this.pointsList, f = d;
      return u === z.HORIZONTAL ? (d[s] = {
        x: i.x,
        y: i.y + n.y
      }, d[l] = {
        x: a.x,
        y: a.y + n.y
      }, f = this.pointsList.map(function(c) {
        return c;
      })) : u === z.VERTICAL && (d[s] = {
        x: i.x + n.x,
        y: i.y
      }, d[l] = {
        x: a.x + n.x,
        y: a.y
      }, f = this.pointsList.map(function(c) {
        return c;
      })), this.updatePointsAfterDrag(f), this.draggingPointList = f, !((o = this.text) === null || o === void 0) && o.value && this.setText(V({}, this.text, this.textPosition)), {
        start: V({}, d[s]),
        end: V({}, d[l]),
        startIndex: s,
        endIndex: l,
        direction: u
      };
    }, e.prototype.dragAppend = function(t, n) {
      var o;
      this.isDragging = !0;
      var i = t.start, a = t.end, s = t.startIndex, l = t.endIndex, u = t.direction, d = this.pointsList;
      if (u === z.HORIZONTAL) {
        d[s] = {
          x: i.x,
          y: i.y + n.y
        }, d[l] = {
          x: a.x,
          y: a.y + n.y
        };
        var f = this.pointsList.map(function(g) {
          return g;
        });
        if (s !== 0 && l !== this.pointsList.length - 1 && (f = this.removeCrossPoints(s, l, f)), s === 0) {
          var c = {
            x: i.x,
            y: i.y + n.y
          }, p = pt(c, this.sourceNode);
          if (!p) {
            var h = this.sourceNode.anchors;
            f = this.getDraggingPoints(u, "start", c, h, f);
          }
        }
        if (l === this.pointsList.length - 1) {
          var v = {
            x: a.x,
            y: a.y + n.y
          }, p = pt(v, this.targetNode);
          if (!p) {
            var h = this.targetNode.anchors;
            f = this.getDraggingPoints(u, "end", v, h, f);
          }
        }
        this.updatePointsAfterDrag(f), this.draggingPointList = f;
      } else if (u === z.VERTICAL) {
        d[s] = {
          x: i.x + n.x,
          y: i.y
        }, d[l] = {
          x: a.x + n.x,
          y: a.y
        };
        var f = this.pointsList.map(function(y) {
          return y;
        });
        if (s !== 0 && l !== this.pointsList.length - 1 && (f = this.removeCrossPoints(s, l, f)), s === 0) {
          var c = {
            x: i.x + n.x,
            y: i.y
          }, p = pt(c, this.sourceNode);
          if (!p) {
            var h = this.sourceNode.anchors;
            f = this.getDraggingPoints(u, "start", c, h, f);
          }
        }
        if (l === this.pointsList.length - 1) {
          var v = {
            x: a.x + n.x,
            y: a.y
          }, p = pt(v, this.targetNode);
          if (!p) {
            var h = this.targetNode.anchors;
            f = this.getDraggingPoints(u, "end", v, h, f);
          }
        }
        this.updatePointsAfterDrag(f), this.draggingPointList = f;
      }
      return !((o = this.text) === null || o === void 0) && o.value && this.setText(V({}, this.text, this.textPosition)), {
        start: V({}, d[s]),
        end: V({}, d[l]),
        startIndex: s,
        endIndex: l,
        direction: u
      };
    }, e.prototype.dragAppendEnd = function() {
      if (this.draggingPointList) {
        var t = Hl(Et(this.points));
        this.pointsList = t.map(function(i) {
          return i;
        }), this.draggingPointList = [];
        var n = t[0];
        this.startPoint = V({}, n);
        var o = t[t.length - 1];
        this.endPoint = V({}, o);
      }
      this.isDragging = !1;
    }, e.prototype.updatePointsAfterDrag = function(t) {
      var n = this.updateCrossPoints(t);
      this.points = n.map(function(o) {
        return "".concat(o.x, ",").concat(o.y);
      }).join(" ");
    }, e.prototype.getAdjustStart = function() {
      return this.pointsList[0] || this.startPoint;
    }, e.prototype.getAdjustEnd = function() {
      var t = this.pointsList;
      return t[t.length - 1] || this.endPoint;
    }, e.prototype.updateAfterAdjustStartAndEnd = function(t) {
      var n = t.startPoint, o = t.endPoint, i = t.sourceNode, a = t.targetNode;
      this.pointsList = this.orthogonalizePath(za({
        x: n.x,
        y: n.y
      }, {
        x: o.x,
        y: o.y
      }, i, a, this.offset || 0)), this.initPoints();
    }, me([
      M
    ], e.prototype, "offset", void 0), me([
      M
    ], e.prototype, "dbClickPosition", void 0), me([
      O
    ], e.prototype, "initPoints", null), me([
      O
    ], e.prototype, "updatePoints", null), me([
      O
    ], e.prototype, "updateStartPoint", null), me([
      O
    ], e.prototype, "moveStartPoint", null), me([
      O
    ], e.prototype, "updateEndPoint", null), me([
      O
    ], e.prototype, "moveEndPoint", null), me([
      O
    ], e.prototype, "updatePointsList", null), me([
      O
    ], e.prototype, "dragAppendStart", null), me([
      O
    ], e.prototype, "dragAppendSimple", null), me([
      O
    ], e.prototype, "dragAppend", null), me([
      O
    ], e.prototype, "dragAppendEnd", null), me([
      O
    ], e.prototype, "updatePointsAfterDrag", null), me([
      O
    ], e.prototype, "getAdjustStart", null), me([
      O
    ], e.prototype, "getAdjustEnd", null), me([
      O
    ], e.prototype, "updateAfterAdjustStartAndEnd", null), e;
  })(xo)
), ce = function() {
  return ce = Object.assign || function(r) {
    for (var e, t = 1, n = arguments.length; t < n; t++) {
      e = arguments[t];
      for (var o in e) Object.prototype.hasOwnProperty.call(e, o) && (r[o] = e[o]);
    }
    return r;
  }, ce.apply(this, arguments);
}, R = function(r, e, t, n) {
  var o = arguments.length, i = o < 3 ? e : n === null ? n = Object.getOwnPropertyDescriptor(e, t) : n, a;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") i = Reflect.decorate(r, e, t, n);
  else for (var s = r.length - 1; s >= 0; s--) (a = r[s]) && (i = (o < 3 ? a(i) : o > 3 ? a(e, t, i) : a(e, t)) || i);
  return o > 3 && i && Object.defineProperty(e, t, i), i;
}, cs = function(r) {
  var e = typeof Symbol == "function" && Symbol.iterator, t = e && r[e], n = 0;
  if (t) return t.call(r);
  if (r && typeof r.length == "number") return {
    next: function() {
      return r && n >= r.length && (r = void 0), { value: r && r[n++], done: !r };
    }
  };
  throw new TypeError(e ? "Object is not iterable." : "Symbol.iterator is not defined.");
}, _p = function(r, e) {
  var t = typeof Symbol == "function" && r[Symbol.iterator];
  if (!t) return r;
  var n = t.call(r), o, i = [], a;
  try {
    for (; (e === void 0 || e-- > 0) && !(o = n.next()).done; ) i.push(o.value);
  } catch (s) {
    a = { error: s };
  } finally {
    try {
      o && !o.done && (t = n.return) && t.call(n);
    } finally {
      if (a) throw a.error;
    }
  }
  return i;
}, Mt = (
  /** @class */
  (function() {
    function r(e, t) {
      var n;
      this.BaseType = fe.NODE, this.id = "", this.type = "", this.x = 0, this.y = 0, this.textMode = Xe.TEXT, this.text = {
        value: "",
        x: 0,
        y: 0,
        draggable: !1,
        editable: !0
      }, this._width = 100, this._height = 80, this.minWidth = 30, this.minHeight = 30, this.maxWidth = 2e3, this.maxHeight = 2e3, this.anchorsOffset = [], this.virtual = !1, this.isSelected = !1, this.isHovered = !1, this.isShowAnchor = !1, this.isDragging = !1, this.isHitable = !0, this.isHittable = !0, this.draggable = !0, this.visible = !0, this.rotatable = !0, this.resizable = !0, this.zIndex = 1, this.state = q.DEFAULT, this.autoToFront = !0, this.style = {}, this._rotate = 0, this.modelType = G.NODE, this.additionStateData = {}, this.targetRules = [], this.sourceRules = [], this.moveRules = [], this.resizeRules = [], this.hasSetTargetRules = !1, this.hasSetSourceRules = !1, this.graphModel = t, this.properties = (n = e.properties) !== null && n !== void 0 ? n : {}, this.initNodeData(e), this.setAttributes();
    }
    return Object.defineProperty(r.prototype, "width", {
      get: function() {
        return this._width;
      },
      set: function(e) {
        this._width = e;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "height", {
      get: function() {
        return this._height;
      },
      set: function(e) {
        this._height = e;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "rotate", {
      get: function() {
        return this._rotate;
      },
      set: function(e) {
        this._rotate = e;
        var t = this, n = t.x, o = n === void 0 ? 0 : n, i = t.y, a = i === void 0 ? 0 : i;
        this.transform = new Jn(-o, -a).rotate(e).translate(o, a).toString();
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "incoming", {
      /**
       * 获取进入当前节点的边和节点
       */
      get: function() {
        return {
          nodes: this.graphModel.getNodeIncomingNode(this.id),
          edges: this.graphModel.getNodeIncomingEdge(this.id)
        };
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "outgoing", {
      /*
       * 获取离开当前节点的边和节点
       */
      get: function() {
        return {
          nodes: this.graphModel.getNodeOutgoingNode(this.id),
          edges: this.graphModel.getNodeOutgoingEdge(this.id)
        };
      },
      enumerable: !1,
      configurable: !0
    }), r.prototype.initNodeData = function(e) {
      var t = this;
      if (e.properties || (e.properties = {}), !e.id) {
        var n = this.graphModel.idGenerator, o = n && n(e.type), i = this.createId();
        e.id = i || o || It();
      }
      this.formatText(e), V(this, bc(e));
      var a = this.graphModel, s = a.overlapMode, l = a.eventCenter;
      this.updateZIndexByOverlap(s, e.zIndex || Qr()), l.on("overlap:change", function(u) {
        var d = u.overlapMode;
        t.updateZIndexByOverlap(d, t.zIndex || Qr());
      });
    }, r.prototype.setAttributes = function() {
    }, r.prototype.createId = function() {
      return null;
    }, r.prototype.setTextMode = function(e) {
      this.textMode = e;
    }, r.prototype.formatText = function(e) {
      var t, n, o, i = this.graphModel.editConfigModel, a = i.nodeTextDraggable, s = i.nodeTextEdit, l = e.x, u = e.y, d = e.text, f = {
        value: "",
        x: l,
        y: u,
        draggable: a,
        editable: s
      };
      d && (typeof d == "string" ? f.value = d : (f = ce(ce({}, f), { x: (t = d.x) !== null && t !== void 0 ? t : l, y: (n = d.y) !== null && n !== void 0 ? n : u, value: (o = d.value) !== null && o !== void 0 ? o : "" }), lr(d.draggable) || (f.draggable = d.draggable), lr(d.editable) || (f.editable = d.editable))), e.text = f;
    }, r.prototype.resize = function(e) {
      var t = e.width, n = e.height, o = e.deltaX, i = e.deltaY, a = this.isAllowResizeNode(o, i, t, n);
      return a ? (this.move(o / 2, i / 2), this.width = t, this.height = n, this.setProperties({
        width: t,
        height: n
      }), this.getData()) : this.getData();
    }, r.prototype.proportionalResize = function() {
    }, r.prototype.getData = function() {
      var e = this.text, t = e.x, n = e.y, o = e.value, i = this.properties;
      bt(i) && (i = nt(i)), Me(i.width) && (i.width = this.width), Me(i.height) && (i.height = this.height);
      var a = {
        id: this.id,
        type: this.type,
        x: this.x,
        y: this.y,
        properties: i
      };
      return this.rotate && (a.rotate = this.rotate), [_e.INCREASE, _e.STATIC].includes(this.graphModel.overlapMode) && (a.zIndex = this.zIndex), o && (a.text = {
        x: t,
        y: n,
        value: o
      }), a;
    }, r.prototype.getHistoryData = function() {
      return this.getData();
    }, r.prototype.getProperties = function() {
      return nt(this.properties);
    }, r.prototype.getOuterGAttributes = function() {
      return {
        className: ""
      };
    }, r.prototype.getNodeStyle = function() {
      return ce(ce({}, this.graphModel.theme.baseNode), this.style);
    }, r.prototype.getTextStyle = function() {
      var e = this.graphModel.theme.nodeText, t = this.properties.textStyle, n = t === void 0 ? {} : t;
      return ce(ce({}, I(e)), I(n));
    }, r.prototype.getRotateControlStyle = function() {
      var e = this.graphModel.theme.rotateControl;
      return I(e);
    }, r.prototype.getResizeControlStyle = function() {
      var e = this.graphModel.theme.resizeControl;
      return I(e);
    }, r.prototype.getResizeOutlineStyle = function() {
      var e = this.graphModel.theme.resizeOutline, t = ce({}, e);
      if (this.isHovered) {
        var n = e.hover || {};
        t = ce(ce({}, t), n);
      }
      return I(t);
    }, r.prototype.getAnchorStyle = function(e) {
      var t = this.graphModel.theme.anchor;
      return I(t);
    }, r.prototype.getAnchorLineStyle = function(e) {
      var t = this.graphModel.theme.anchorLine;
      return I(t);
    }, r.prototype.getOutlineStyle = function() {
      var e = this.graphModel.theme.outline;
      return I(e);
    }, r.prototype.isAllowConnectedAsSource = function(e, t, n, o) {
      var i = this.hasSetSourceRules ? this.sourceRules : this.getConnectedSourceRules();
      this.hasSetSourceRules = !0;
      for (var a = !0, s = "", l = 0; l < i.length; l++) {
        var u = i[l];
        if (!u.validate.call(this, this, e, t, n, o)) {
          a = !1, s = u.message;
          break;
        }
      }
      return {
        isAllPass: a,
        msg: s
      };
    }, r.prototype.getConnectedSourceRules = function() {
      return this.sourceRules;
    }, r.prototype.isAllowConnectedAsTarget = function(e, t, n, o) {
      var i = this.hasSetTargetRules ? this.targetRules : this.getConnectedTargetRules();
      this.hasSetTargetRules = !0;
      for (var a = !0, s = "", l = 0; l < i.length; l++) {
        var u = i[l];
        if (!u.validate.call(this, e, this, t, n, o)) {
          a = !1, s = u.message;
          break;
        }
      }
      return {
        isAllPass: a,
        msg: s
      };
    }, r.prototype.isAllowMoveNode = function(e, t) {
      var n, o, i = !0, a = !0, s = this.moveRules.concat(this.graphModel.nodeMoveRules);
      try {
        for (var l = cs(s), u = l.next(); !u.done; u = l.next()) {
          var d = u.value, f = d(this, e, t);
          if (!f)
            return !1;
          if (typeof f == "object") {
            var c = f;
            if (!c.x && !c.y)
              return !1;
            i = i && c.x, a = a && c.y;
          }
        }
      } catch (p) {
        n = { error: p };
      } finally {
        try {
          u && !u.done && (o = l.return) && o.call(l);
        } finally {
          if (n) throw n.error;
        }
      }
      return {
        x: i,
        y: a
      };
    }, r.prototype.getConnectedTargetRules = function() {
      return this.targetRules;
    }, r.prototype.getAnchorsByOffset = function() {
      var e = this, t = e.anchorsOffset, n = e.id, o = e.x, i = e.y;
      return t && t.length > 0 ? t.map(function(a, s) {
        return a.length ? (a = a, {
          id: "".concat(n, "_").concat(s),
          x: o + a[0],
          y: i + a[1]
        }) : (a = a, ce(ce({}, a), { x: o + a.x, y: i + a.y, id: a.id || "".concat(n, "_").concat(s) }));
      }) : this.getDefaultAnchor();
    }, r.prototype.getDefaultAnchor = function() {
      return [];
    }, r.prototype.getTargetAnchor = function(e) {
      var t, n = this.graphModel.customTargetAnchor;
      return (t = n?.(this, e)) !== null && t !== void 0 ? t : mc(e, this);
    }, r.prototype.getBounds = function() {
      return {
        minX: this.x - this.width / 2,
        minY: this.y - this.height / 2,
        maxX: this.x + this.width / 2,
        maxY: this.y + this.height / 2
      };
    }, Object.defineProperty(r.prototype, "anchors", {
      get: function() {
        var e = this.getAnchorsByOffset(), t = this, n = t.x, o = t.y, i = t.rotate;
        return e.forEach(function(a) {
          var s = a.x, l = a.y, u = _p(new sn([s, l, 1]).translate(-n, -o).rotate(i).translate(n, o)[0], 2), d = u[0], f = u[1];
          a.x = d, a.y = f;
        }), e;
      },
      enumerable: !1,
      configurable: !0
    }), r.prototype.getAnchorInfo = function(e) {
      if (!Me(e))
        for (var t = 0; t < this.anchors.length; t++) {
          var n = this.anchors[t];
          if (n.id === e)
            return n;
        }
    }, r.prototype.addNodeMoveRules = function(e) {
      this.moveRules.includes(e) || this.moveRules.push(e);
    }, r.prototype.isAllowMoveByXORY = function(e, t, n) {
      var o, i;
      if (n)
        o = !0, i = !0;
      else {
        var a = this.isAllowMoveNode(e, t);
        typeof a == "boolean" ? (o = a, i = a) : (o = a.x, i = a.y);
      }
      return {
        isAllowMoveX: o,
        isAllowMoveY: i
      };
    }, r.prototype.move = function(e, t, n) {
      n === void 0 && (n = !1);
      var o = this.isAllowMoveByXORY(e, t, n), i = o.isAllowMoveX, a = o.isAllowMoveY;
      return i && (this.x = this.x + e, this.text && this.moveText(e, 0)), a && (this.y = this.y + t, this.text && this.moveText(0, t)), (i || a) && (this.rotate = this._rotate), i || a;
    }, r.prototype.getMoveDistance = function(e, t, n) {
      n === void 0 && (n = !1);
      var o = this.isAllowMoveByXORY(e, t, n), i = o.isAllowMoveX, a = o.isAllowMoveY, s = 0, l = 0;
      return i && e && (this.x = this.x + e, this.text && this.moveText(e, 0), s = e), a && t && (this.y = this.y + t, this.text && this.moveText(0, t), l = t), this.transform = new Jn(-this.x, -this.y).rotate(this.rotate).translate(this.x, this.y).toString(), [s, l];
    }, r.prototype.moveTo = function(e, t, n) {
      n === void 0 && (n = !1);
      var o = e - this.x, i = t - this.y;
      return !n && !this.isAllowMoveNode(o, i) ? !1 : (this.text && this.moveText(o, i), this.x = e, this.y = t, !0);
    }, r.prototype.moveText = function(e, t) {
      var n = this.text, o = n.x, i = n.y, a = n.value, s = n.draggable, l = n.editable;
      this.text = {
        value: a,
        editable: l,
        draggable: s,
        x: o + e,
        y: i + t
      };
    }, r.prototype.updateText = function(e) {
      this.text = ce(ce({}, nt(this.text)), { value: e });
    }, r.prototype.addNodeResizeRules = function(e) {
      this.resizeRules.includes(e) || this.resizeRules.push(e);
    }, r.prototype.isAllowResizeNode = function(e, t, n, o) {
      var i, a, s = this.resizeRules.concat(this.graphModel.nodeResizeRules);
      try {
        for (var l = cs(s), u = l.next(); !u.done; u = l.next()) {
          var d = u.value, f = d(this, e, t, n, o);
          if (!f)
            return !1;
        }
      } catch (c) {
        i = { error: c };
      } finally {
        try {
          u && !u.done && (a = l.return) && a.call(l);
        } finally {
          if (i) throw i.error;
        }
      }
      return !0;
    }, r.prototype.setSelected = function(e) {
      e === void 0 && (e = !0), this.isSelected = e;
    }, r.prototype.setHovered = function(e) {
      e === void 0 && (e = !0), this.isHovered = e, this.setIsShowAnchor(e);
    }, r.prototype.setIsShowAnchor = function(e) {
      e === void 0 && (e = !0), this.isShowAnchor = e;
    }, r.prototype.setRotatable = function(e) {
      e === void 0 && (e = !0), this.rotatable = e;
    }, r.prototype.setResizable = function(e) {
      e === void 0 && (e = !0), this.resizable = e;
    }, r.prototype.setHitable = function(e) {
      e === void 0 && (e = !0), this.isHitable = e;
    }, r.prototype.setHittable = function(e) {
      e === void 0 && (e = !0), this.isHittable = e;
    }, r.prototype.setElementState = function(e, t) {
      this.state = e, this.additionStateData = t;
    }, r.prototype.updateProperties = function(e, t) {
      var n = nt(this.properties);
      this.properties = e, this.setAttributes(), this.graphModel.eventCenter.emit(C.NODE_PROPERTIES_CHANGE, {
        id: this.id,
        keys: t,
        preProperties: n,
        properties: e
      });
    }, r.prototype.setProperty = function(e, t) {
      var n = nt(this.properties), o = I(n);
      Su(o, e, Se(t)), this.updateProperties(o, [e]);
    }, r.prototype.setProperties = function(e) {
      var t = nt(this.properties), n = ce(ce({}, t), Se(e)), o = [];
      Xu(e, function(i, a) {
        (Wi(t, a) && t[a] !== i || !Wi(t, a)) && o.push(a);
      }), this.updateProperties(n, o);
    }, r.prototype.deleteProperty = function(e) {
      delete this.properties[e], this.setAttributes();
    }, r.prototype.setStyle = function(e, t) {
      var n;
      this.style = ce(ce({}, this.style), (n = {}, n[e] = Se(t), n));
    }, r.prototype.setStyles = function(e) {
      this.style = ce(ce({}, this.style), Se(e));
    }, r.prototype.updateStyles = function(e) {
      this.style = ce({}, Se(e));
    }, r.prototype.setZIndex = function(e) {
      e === void 0 && (e = 1), this.zIndex = e;
    }, r.prototype.updateAttributes = function(e) {
      V(this, e);
    }, r.prototype.updateZIndexByOverlap = function(e, t) {
      switch (e) {
        case _e.DEFAULT:
          this.zIndex = 1;
          break;
        case _e.EDGE_TOP:
          this.zIndex = 0;
          break;
        case _e.INCREASE:
          this.zIndex = t;
          break;
      }
    }, r.BaseType = fe.NODE, R([
      M
    ], r.prototype, "type", void 0), R([
      M
    ], r.prototype, "x", void 0), R([
      M
    ], r.prototype, "y", void 0), R([
      M
    ], r.prototype, "textMode", void 0), R([
      M
    ], r.prototype, "text", void 0), R([
      M
    ], r.prototype, "properties", void 0), R([
      M
    ], r.prototype, "_width", void 0), R([
      M
    ], r.prototype, "_height", void 0), R([
      M
    ], r.prototype, "anchorsOffset", void 0), R([
      M
    ], r.prototype, "isSelected", void 0), R([
      M
    ], r.prototype, "isHovered", void 0), R([
      M
    ], r.prototype, "isShowAnchor", void 0), R([
      M
    ], r.prototype, "isDragging", void 0), R([
      M
    ], r.prototype, "isHitable", void 0), R([
      M
    ], r.prototype, "isHittable", void 0), R([
      M
    ], r.prototype, "draggable", void 0), R([
      M
    ], r.prototype, "visible", void 0), R([
      M
    ], r.prototype, "rotatable", void 0), R([
      M
    ], r.prototype, "resizable", void 0), R([
      M
    ], r.prototype, "zIndex", void 0), R([
      M
    ], r.prototype, "state", void 0), R([
      M
    ], r.prototype, "autoToFront", void 0), R([
      M
    ], r.prototype, "style", void 0), R([
      M
    ], r.prototype, "transform", void 0), R([
      M
    ], r.prototype, "_rotate", void 0), R([
      te
    ], r.prototype, "incoming", null), R([
      te
    ], r.prototype, "outgoing", null), R([
      O
    ], r.prototype, "setTextMode", null), R([
      O
    ], r.prototype, "addNodeMoveRules", null), R([
      O
    ], r.prototype, "move", null), R([
      O
    ], r.prototype, "getMoveDistance", null), R([
      O
    ], r.prototype, "moveTo", null), R([
      O
    ], r.prototype, "moveText", null), R([
      O
    ], r.prototype, "updateText", null), R([
      O
    ], r.prototype, "addNodeResizeRules", null), R([
      O
    ], r.prototype, "setSelected", null), R([
      O
    ], r.prototype, "setHovered", null), R([
      O
    ], r.prototype, "setIsShowAnchor", null), R([
      O
    ], r.prototype, "setRotatable", null), R([
      O
    ], r.prototype, "setResizable", null), R([
      O
    ], r.prototype, "setHitable", null), R([
      O
    ], r.prototype, "setHittable", null), R([
      O
    ], r.prototype, "setElementState", null), R([
      O
    ], r.prototype, "setProperty", null), R([
      O
    ], r.prototype, "setProperties", null), R([
      O
    ], r.prototype, "deleteProperty", null), R([
      O
    ], r.prototype, "setStyle", null), R([
      O
    ], r.prototype, "setStyles", null), R([
      O
    ], r.prototype, "updateStyles", null), R([
      O
    ], r.prototype, "setZIndex", null), R([
      O
    ], r.prototype, "updateAttributes", null), R([
      O
    ], r.prototype, "updateZIndexByOverlap", null), r;
  })()
), mp = /* @__PURE__ */ (function() {
  var r = function(e, t) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, o) {
      n.__proto__ = o;
    } || function(n, o) {
      for (var i in o) Object.prototype.hasOwnProperty.call(o, i) && (n[i] = o[i]);
    }, r(e, t);
  };
  return function(e, t) {
    if (typeof t != "function" && t !== null)
      throw new TypeError("Class extends value " + String(t) + " is not a constructor or null");
    r(e, t);
    function n() {
      this.constructor = e;
    }
    e.prototype = t === null ? Object.create(t) : (n.prototype = t.prototype, new n());
  };
})(), Br = function() {
  return Br = Object.assign || function(r) {
    for (var e, t = 1, n = arguments.length; t < n; t++) {
      e = arguments[t];
      for (var o in e) Object.prototype.hasOwnProperty.call(e, o) && (r[o] = e[o]);
    }
    return r;
  }, Br.apply(this, arguments);
}, Co = function(r, e, t, n) {
  var o = arguments.length, i = o < 3 ? e : n === null ? n = Object.getOwnPropertyDescriptor(e, t) : n, a;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") i = Reflect.decorate(r, e, t, n);
  else for (var s = r.length - 1; s >= 0; s--) (a = r[s]) && (i = (o < 3 ? a(i) : o > 3 ? a(e, t, i) : a(e, t)) || i);
  return o > 3 && i && Object.defineProperty(e, t, i), i;
}, ps = (
  /** @class */
  (function(r) {
    mp(e, r);
    function e(t, n) {
      var o = r.call(this, t, n) || this;
      return o.modelType = G.CIRCLE_NODE, o.r = 50, o.initNodeData(t), o.setAttributes(), o;
    }
    return Object.defineProperty(e.prototype, "width", {
      get: function() {
        return this.r * 2;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "height", {
      get: function() {
        return this.r * 2;
      },
      enumerable: !1,
      configurable: !0
    }), e.prototype.setAttributes = function() {
      r.prototype.setAttributes.call(this);
      var t = this.properties.r;
      t && (this.r = t);
    }, e.prototype.getNodeStyle = function() {
      var t = r.prototype.getNodeStyle.call(this), n = this.graphModel.theme.circle, o = this.properties.style, i = o === void 0 ? {} : o;
      return Br(Br(Br({}, t), I(n)), I(i));
    }, e.prototype.getDefaultAnchor = function() {
      var t = this, n = t.x, o = t.y, i = t.r;
      return [
        { x: n, y: o - i, id: "".concat(this.id, "_0") },
        { x: n + i, y: o, id: "".concat(this.id, "_1") },
        { x: n, y: o + i, id: "".concat(this.id, "_2") },
        { x: n - i, y: o, id: "".concat(this.id, "_3") }
      ];
    }, e.prototype.resize = function(t) {
      var n = t.width, o = t.deltaX, i = t.deltaY;
      return this.move(o / 2, i / 2), this.r = n, this.setProperties({
        r: n
      }), this.getData();
    }, Co([
      M
    ], e.prototype, "r", void 0), Co([
      te
    ], e.prototype, "width", null), Co([
      te
    ], e.prototype, "height", null), e;
  })(Mt)
), xp = /* @__PURE__ */ (function() {
  var r = function(e, t) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, o) {
      n.__proto__ = o;
    } || function(n, o) {
      for (var i in o) Object.prototype.hasOwnProperty.call(o, i) && (n[i] = o[i]);
    }, r(e, t);
  };
  return function(e, t) {
    if (typeof t != "function" && t !== null)
      throw new TypeError("Class extends value " + String(t) + " is not a constructor or null");
    r(e, t);
    function n() {
      this.constructor = e;
    }
    e.prototype = t === null ? Object.create(t) : (n.prototype = t.prototype, new n());
  };
})(), Xr = function() {
  return Xr = Object.assign || function(r) {
    for (var e, t = 1, n = arguments.length; t < n; t++) {
      e = arguments[t];
      for (var o in e) Object.prototype.hasOwnProperty.call(e, o) && (r[o] = e[o]);
    }
    return r;
  }, Xr.apply(this, arguments);
}, Zt = function(r, e, t, n) {
  var o = arguments.length, i = o < 3 ? e : n === null ? n = Object.getOwnPropertyDescriptor(e, t) : n, a;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") i = Reflect.decorate(r, e, t, n);
  else for (var s = r.length - 1; s >= 0; s--) (a = r[s]) && (i = (o < 3 ? a(i) : o > 3 ? a(e, t, i) : a(e, t)) || i);
  return o > 3 && i && Object.defineProperty(e, t, i), i;
}, En = function(r, e) {
  var t = typeof Symbol == "function" && r[Symbol.iterator];
  if (!t) return r;
  var n = t.call(r), o, i = [], a;
  try {
    for (; (e === void 0 || e-- > 0) && !(o = n.next()).done; ) i.push(o.value);
  } catch (s) {
    a = { error: s };
  } finally {
    try {
      o && !o.done && (t = n.return) && t.call(n);
    } finally {
      if (a) throw a.error;
    }
  }
  return i;
}, hs = (
  /** @class */
  (function(r) {
    xp(e, r);
    function e(t, n) {
      var o = r.call(this, t, n) || this;
      return o.modelType = G.DIAMOND_NODE, o.rx = 30, o.ry = 50, o.initNodeData(t), o.setAttributes(), o;
    }
    return e.prototype.setAttributes = function() {
      r.prototype.setAttributes.call(this);
      var t = this.properties, n = t.rx, o = t.ry;
      n && (this.rx = n), o && (this.ry = o);
    }, e.prototype.getNodeStyle = function() {
      var t = r.prototype.getNodeStyle.call(this), n = this.graphModel.theme.diamond, o = this.properties.style, i = o === void 0 ? {} : o;
      return Xr(Xr(Xr({}, t), I(n)), I(i));
    }, Object.defineProperty(e.prototype, "points", {
      get: function() {
        var t = this, n = t.x, o = t.y, i = t.rx, a = t.ry;
        return [
          [n, o - a],
          [n + i, o],
          [n, o + a],
          [n - i, o]
        ];
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "pointsPosition", {
      get: function() {
        return ht(this.points, function(t) {
          var n = En(t, 2), o = n[0], i = n[1];
          return { x: o, y: i };
        });
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "width", {
      get: function() {
        var t = Number.MAX_SAFE_INTEGER, n = Number.MIN_SAFE_INTEGER;
        return pe(this.points, function(o) {
          var i = En(o, 1), a = i[0];
          a < t && (t = a), a > n && (n = a);
        }), n - t;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "height", {
      get: function() {
        var t = Number.MAX_SAFE_INTEGER, n = Number.MIN_SAFE_INTEGER;
        return pe(this.points, function(o) {
          var i = En(o, 2), a = i[1];
          a < t && (t = a), a > n && (n = a);
        }), n - t;
      },
      enumerable: !1,
      configurable: !0
    }), e.prototype.getDefaultAnchor = function() {
      var t = this;
      return ht(this.points, function(n, o) {
        var i = En(n, 2), a = i[0], s = i[1];
        return {
          x: a,
          y: s,
          id: "".concat(t.id, "_").concat(o)
        };
      });
    }, e.prototype.resize = function(t) {
      var n = t.width, o = t.height, i = t.deltaX, a = t.deltaY;
      return this.move(i / 2, a / 2), this.rx = n, this.ry = o, this.setProperties({
        rx: n,
        ry: o
      }), this.getData();
    }, Zt([
      M
    ], e.prototype, "rx", void 0), Zt([
      M
    ], e.prototype, "ry", void 0), Zt([
      te
    ], e.prototype, "points", null), Zt([
      te
    ], e.prototype, "pointsPosition", null), Zt([
      te
    ], e.prototype, "width", null), Zt([
      te
    ], e.prototype, "height", null), e;
  })(Mt)
), Ep = /* @__PURE__ */ (function() {
  var r = function(e, t) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, o) {
      n.__proto__ = o;
    } || function(n, o) {
      for (var i in o) Object.prototype.hasOwnProperty.call(o, i) && (n[i] = o[i]);
    }, r(e, t);
  };
  return function(e, t) {
    if (typeof t != "function" && t !== null)
      throw new TypeError("Class extends value " + String(t) + " is not a constructor or null");
    r(e, t);
    function n() {
      this.constructor = e;
    }
    e.prototype = t === null ? Object.create(t) : (n.prototype = t.prototype, new n());
  };
})(), Yr = function() {
  return Yr = Object.assign || function(r) {
    for (var e, t = 1, n = arguments.length; t < n; t++) {
      e = arguments[t];
      for (var o in e) Object.prototype.hasOwnProperty.call(e, o) && (r[o] = e[o]);
    }
    return r;
  }, Yr.apply(this, arguments);
}, bn = function(r, e, t, n) {
  var o = arguments.length, i = o < 3 ? e : n === null ? n = Object.getOwnPropertyDescriptor(e, t) : n, a;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") i = Reflect.decorate(r, e, t, n);
  else for (var s = r.length - 1; s >= 0; s--) (a = r[s]) && (i = (o < 3 ? a(i) : o > 3 ? a(e, t, i) : a(e, t)) || i);
  return o > 3 && i && Object.defineProperty(e, t, i), i;
}, vs = (
  /** @class */
  (function(r) {
    Ep(e, r);
    function e(t, n) {
      var o = r.call(this, t, n) || this;
      return o.modelType = G.ELLIPSE_NODE, o.rx = 30, o.ry = 45, o.initNodeData(t), o.setAttributes(), o;
    }
    return e.prototype.setAttributes = function() {
      r.prototype.setAttributes.call(this);
      var t = this.properties, n = t.rx, o = t.ry;
      n && (this.rx = n), o && (this.ry = o);
    }, e.prototype.getNodeStyle = function() {
      var t = r.prototype.getNodeStyle.call(this), n = this.graphModel.theme.ellipse, o = this.properties.style, i = o === void 0 ? {} : o;
      return Yr(Yr(Yr({}, t), I(n)), I(i));
    }, Object.defineProperty(e.prototype, "width", {
      get: function() {
        return this.rx * 2;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "height", {
      get: function() {
        return this.ry * 2;
      },
      enumerable: !1,
      configurable: !0
    }), e.prototype.getDefaultAnchor = function() {
      var t = this, n = t.x, o = t.y, i = t.rx, a = t.ry;
      return [
        { x: n, y: o - a, id: "".concat(this.id, "_0") },
        { x: n + i, y: o, id: "".concat(this.id, "_1") },
        { x: n, y: o + a, id: "".concat(this.id, "_2") },
        { x: n - i, y: o, id: "".concat(this.id, "_3") }
      ];
    }, e.prototype.resize = function(t) {
      var n = t.width, o = t.height, i = t.deltaX, a = t.deltaY;
      return this.move(i / 2, a / 2), this.rx = n, this.ry = o, this.setProperties({
        rx: n,
        ry: o
      }), this.getData();
    }, bn([
      M
    ], e.prototype, "rx", void 0), bn([
      M
    ], e.prototype, "ry", void 0), bn([
      te
    ], e.prototype, "width", null), bn([
      te
    ], e.prototype, "height", null), e;
  })(Mt)
), bp = /* @__PURE__ */ (function() {
  var r = function(e, t) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, o) {
      n.__proto__ = o;
    } || function(n, o) {
      for (var i in o) Object.prototype.hasOwnProperty.call(o, i) && (n[i] = o[i]);
    }, r(e, t);
  };
  return function(e, t) {
    if (typeof t != "function" && t !== null)
      throw new TypeError("Class extends value " + String(t) + " is not a constructor or null");
    r(e, t);
    function n() {
      this.constructor = e;
    }
    e.prototype = t === null ? Object.create(t) : (n.prototype = t.prototype, new n());
  };
})(), nr = function() {
  return nr = Object.assign || function(r) {
    for (var e, t = 1, n = arguments.length; t < n; t++) {
      e = arguments[t];
      for (var o in e) Object.prototype.hasOwnProperty.call(e, o) && (r[o] = e[o]);
    }
    return r;
  }, nr.apply(this, arguments);
}, On = function(r, e, t, n) {
  var o = arguments.length, i = o < 3 ? e : n === null ? n = Object.getOwnPropertyDescriptor(e, t) : n, a;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") i = Reflect.decorate(r, e, t, n);
  else for (var s = r.length - 1; s >= 0; s--) (a = r[s]) && (i = (o < 3 ? a(i) : o > 3 ? a(e, t, i) : a(e, t)) || i);
  return o > 3 && i && Object.defineProperty(e, t, i), i;
}, wn = function(r, e) {
  var t = typeof Symbol == "function" && r[Symbol.iterator];
  if (!t) return r;
  var n = t.call(r), o, i = [], a;
  try {
    for (; (e === void 0 || e-- > 0) && !(o = n.next()).done; ) i.push(o.value);
  } catch (s) {
    a = { error: s };
  } finally {
    try {
      o && !o.done && (t = n.return) && t.call(n);
    } finally {
      if (a) throw a.error;
    }
  }
  return i;
}, ys = (
  /** @class */
  (function(r) {
    bp(e, r);
    function e(t, n) {
      var o = r.call(this, t, n) || this;
      return o.modelType = G.POLYGON_NODE, o.points = [
        [50, 0],
        [100, 50],
        [50, 100],
        [0, 50]
        // 菱形
        // [0,100], [50,25], [50,75], [100,0] // 闪电
        // [100, 10],
        // [40, 198],
        // [190, 78],
        // [10, 78],
        // [160, 198], // 五角星
      ], o.initNodeData(t), o.setAttributes(), o;
    }
    return e.prototype.setAttributes = function() {
      r.prototype.setAttributes.call(this);
      var t = this.properties, n = t.points, o = t.width, i = t.height, a = n || this.points;
      this.points = hc(a, o, i);
    }, e.prototype.getNodeStyle = function() {
      var t = r.prototype.getNodeStyle.call(this), n = this.graphModel, o = n.theme.polygon, i = n.customStyles.polygon, a = this.properties.style, s = a === void 0 ? {} : a;
      return nr(nr(nr(nr({}, t), I(o)), I(i)), I(s));
    }, Object.defineProperty(e.prototype, "pointsPosition", {
      /**
       * 由于大多数情况下，我们初始化拿到的多边形坐标都是基于原点的（例如绘图工具到处的svg）。
       * 在logicflow中对多边形进行移动，我们不需要去更新points，
       * 而是去更新多边形中心点即可。
       */
      get: function() {
        var t = this, n = t.x, o = t.y, i = t.width, a = t.height;
        return this.points.map(function(s) {
          return {
            x: s[0] + n - i / 2,
            y: s[1] + o - a / 2
          };
        });
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "width", {
      get: function() {
        var t = Number.MAX_SAFE_INTEGER, n = Number.MIN_SAFE_INTEGER;
        return this.points.forEach(function(o) {
          var i = wn(o, 1), a = i[0];
          a < t && (t = a), a > n && (n = a);
        }), n - t;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "height", {
      get: function() {
        var t = Number.MAX_SAFE_INTEGER, n = Number.MIN_SAFE_INTEGER;
        return this.points.forEach(function(o) {
          var i = wn(o, 2), a = i[1];
          a < t && (t = a), a > n && (n = a);
        }), n - t;
      },
      enumerable: !1,
      configurable: !0
    }), e.prototype.getDefaultAnchor = function() {
      var t = this, n = this, o = n.x, i = n.y, a = n.width, s = n.height, l = n.points;
      return l.map(function(u, d) {
        var f = wn(u, 2), c = f[0], p = f[1];
        return {
          x: o + c - a / 2,
          y: i + p - s / 2,
          id: "".concat(t.id, "_").concat(d)
        };
      });
    }, e.prototype.resize = function(t) {
      var n = this, o = t.width, i = t.height, a = t.deltaX, s = t.deltaY;
      this.move(a / 2, s / 2);
      var l = ht(this.points, function(u) {
        var d = wn(u, 2), f = d[0], c = d[1];
        return [
          f * o / n.width,
          c * i / n.height
        ];
      });
      return this.points = l, this.properties.points = l, this.getData();
    }, On([
      M
    ], e.prototype, "points", void 0), On([
      te
    ], e.prototype, "pointsPosition", null), On([
      te
    ], e.prototype, "width", null), On([
      te
    ], e.prototype, "height", null), e;
  })(Mt)
), Op = /* @__PURE__ */ (function() {
  var r = function(e, t) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, o) {
      n.__proto__ = o;
    } || function(n, o) {
      for (var i in o) Object.prototype.hasOwnProperty.call(o, i) && (n[i] = o[i]);
    }, r(e, t);
  };
  return function(e, t) {
    if (typeof t != "function" && t !== null)
      throw new TypeError("Class extends value " + String(t) + " is not a constructor or null");
    r(e, t);
    function n() {
      this.constructor = e;
    }
    e.prototype = t === null ? Object.create(t) : (n.prototype = t.prototype, new n());
  };
})(), Fr = function() {
  return Fr = Object.assign || function(r) {
    for (var e, t = 1, n = arguments.length; t < n; t++) {
      e = arguments[t];
      for (var o in e) Object.prototype.hasOwnProperty.call(e, o) && (r[o] = e[o]);
    }
    return r;
  }, Fr.apply(this, arguments);
}, wp = function(r, e, t, n) {
  var o = arguments.length, i = o < 3 ? e : n === null ? n = Object.getOwnPropertyDescriptor(e, t) : n, a;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") i = Reflect.decorate(r, e, t, n);
  else for (var s = r.length - 1; s >= 0; s--) (a = r[s]) && (i = (o < 3 ? a(i) : o > 3 ? a(e, t, i) : a(e, t)) || i);
  return o > 3 && i && Object.defineProperty(e, t, i), i;
}, gs = (
  /** @class */
  (function(r) {
    Op(e, r);
    function e(t, n) {
      var o = r.call(this, t, n) || this;
      return o.modelType = G.RECT_NODE, o.radius = 0, o.initNodeData(t), o.setAttributes(), o;
    }
    return e.prototype.setAttributes = function() {
      r.prototype.setAttributes.call(this);
      var t = this.properties, n = t.width, o = t.height, i = t.radius, a = this.getNodeStyle().radius;
      Me(n) || (this.width = n), Me(o) || (this.height = o), Me(i) || (this.radius = i), Me(a) || (this.radius = a);
    }, e.prototype.getDefaultAnchor = function() {
      var t = this, n = t.x, o = t.y, i = t.width, a = t.height;
      return [
        { x: n, y: o - a / 2, id: "".concat(this.id, "_0") },
        { x: n + i / 2, y: o, id: "".concat(this.id, "_1") },
        { x: n, y: o + a / 2, id: "".concat(this.id, "_2") },
        { x: n - i / 2, y: o, id: "".concat(this.id, "_3") }
      ];
    }, e.prototype.getNodeStyle = function() {
      var t = r.prototype.getNodeStyle.call(this), n = this.graphModel.theme.rect, o = this.properties.style, i = o === void 0 ? {} : o;
      return Fr(Fr(Fr({}, t), I(n)), I(i));
    }, wp([
      M
    ], e.prototype, "radius", void 0), e;
  })(Mt)
), Sp = /* @__PURE__ */ (function() {
  var r = function(e, t) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, o) {
      n.__proto__ = o;
    } || function(n, o) {
      for (var i in o) Object.prototype.hasOwnProperty.call(o, i) && (n[i] = o[i]);
    }, r(e, t);
  };
  return function(e, t) {
    if (typeof t != "function" && t !== null)
      throw new TypeError("Class extends value " + String(t) + " is not a constructor or null");
    r(e, t);
    function n() {
      this.constructor = e;
    }
    e.prototype = t === null ? Object.create(t) : (n.prototype = t.prototype, new n());
  };
})(), Hr = function() {
  return Hr = Object.assign || function(r) {
    for (var e, t = 1, n = arguments.length; t < n; t++) {
      e = arguments[t];
      for (var o in e) Object.prototype.hasOwnProperty.call(e, o) && (r[o] = e[o]);
    }
    return r;
  }, Hr.apply(this, arguments);
}, _s = function(r, e, t, n) {
  var o = arguments.length, i = o < 3 ? e : n === null ? n = Object.getOwnPropertyDescriptor(e, t) : n, a;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") i = Reflect.decorate(r, e, t, n);
  else for (var s = r.length - 1; s >= 0; s--) (a = r[s]) && (i = (o < 3 ? a(i) : o > 3 ? a(e, t, i) : a(e, t)) || i);
  return o > 3 && i && Object.defineProperty(e, t, i), i;
}, Ap = function(r, e) {
  var t = typeof Symbol == "function" && r[Symbol.iterator];
  if (!t) return r;
  var n = t.call(r), o, i = [], a;
  try {
    for (; (e === void 0 || e-- > 0) && !(o = n.next()).done; ) i.push(o.value);
  } catch (s) {
    a = { error: s };
  } finally {
    try {
      o && !o.done && (t = n.return) && t.call(n);
    } finally {
      if (a) throw a.error;
    }
  }
  return i;
}, Mp = function(r, e, t) {
  if (t || arguments.length === 2) for (var n = 0, o = e.length, i; n < o; n++)
    (i || !(n in e)) && (i || (i = Array.prototype.slice.call(e, 0, n)), i[n] = e[n]);
  return r.concat(i || Array.prototype.slice.call(e));
}, ms = (
  /** @class */
  (function(r) {
    Sp(e, r);
    function e() {
      var t = r.apply(this, Mp([], Ap(arguments), !1)) || this;
      return t.modelType = G.TEXT_NODE, t;
    }
    return e.prototype.getTextStyle = function() {
      var t = r.prototype.getTextStyle.call(this), n = this.graphModel.theme.text, o = this.properties.textStyle;
      return Hr(Hr(Hr({}, t), I(n)), I(o));
    }, Object.defineProperty(e.prototype, "width", {
      get: function() {
        var t = String(this.text.value).split(/[\r\n]/g), n = this.getTextStyle().fontSize, o = ns({
          rows: t,
          fontSize: n,
          rowsLength: t.length
        }).width;
        return o;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "height", {
      get: function() {
        var t = String(this.text.value).split(/[\r\n]/g), n = this.getTextStyle().fontSize, o = ns({
          rows: t,
          fontSize: n,
          rowsLength: t.length
        }).height;
        return o;
      },
      enumerable: !1,
      configurable: !0
    }), _s([
      te
    ], e.prototype, "width", null), _s([
      te
    ], e.prototype, "height", null), e;
  })(Mt)
), Pp = /* @__PURE__ */ (function() {
  var r = function(e, t) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, o) {
      n.__proto__ = o;
    } || function(n, o) {
      for (var i in o) Object.prototype.hasOwnProperty.call(o, i) && (n[i] = o[i]);
    }, r(e, t);
  };
  return function(e, t) {
    if (typeof t != "function" && t !== null)
      throw new TypeError("Class extends value " + String(t) + " is not a constructor or null");
    r(e, t);
    function n() {
      this.constructor = e;
    }
    e.prototype = t === null ? Object.create(t) : (n.prototype = t.prototype, new n());
  };
})(), or = function() {
  return or = Object.assign || function(r) {
    for (var e, t = 1, n = arguments.length; t < n; t++) {
      e = arguments[t];
      for (var o in e) Object.prototype.hasOwnProperty.call(e, o) && (r[o] = e[o]);
    }
    return r;
  }, or.apply(this, arguments);
}, xs = (
  /** @class */
  (function(r) {
    Pp(e, r);
    function e(t, n) {
      var o = r.call(this, t, n) || this;
      return o.modelType = G.HTML_NODE, o.setAttributes(), o;
    }
    return e.prototype.setAttributes = function() {
      r.prototype.setAttributes.call(this);
      var t = this.properties, n = t.width, o = t.height;
      n && (this.width = n), o && (this.height = o);
    }, e.prototype.getDefaultAnchor = function() {
      var t = this, n = t.x, o = t.y, i = t.width, a = t.height;
      return [
        { x: n, y: o - a / 2, id: "".concat(this.id, "_0") },
        { x: n + i / 2, y: o, id: "".concat(this.id, "_1") },
        { x: n, y: o + a / 2, id: "".concat(this.id, "_2") },
        { x: n - i / 2, y: o, id: "".concat(this.id, "_3") }
      ];
    }, e.prototype.getNodeStyle = function() {
      var t = r.prototype.getNodeStyle.call(this), n = this.graphModel.theme, o = n.baseNode, i = n.html, a = this.properties.style, s = a === void 0 ? {} : a, l = or(or(or(or({}, t), I(o)), I(i)), I(s));
      return l;
    }, e;
  })(Mt)
), W = function(r, e, t, n) {
  var o = arguments.length, i = o < 3 ? e : n === null ? n = Object.getOwnPropertyDescriptor(e, t) : n, a;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") i = Reflect.decorate(r, e, t, n);
  else for (var s = r.length - 1; s >= 0; s--) (a = r[s]) && (i = (o < 3 ? a(i) : o > 3 ? a(e, t, i) : a(e, t)) || i);
  return o > 3 && i && Object.defineProperty(e, t, i), i;
}, Dp = {
  // SilentMode 下允许用户操作画布
  stopZoomGraph: !1,
  stopScrollGraph: !1,
  stopMoveGraph: !1,
  // 节点 & 边相关配置
  adjustEdge: !1,
  adjustEdgeStartAndEnd: !1,
  adjustNodePosition: !1,
  hideAnchors: !0,
  allowRotate: !1,
  allowResize: !1,
  nodeSelectedOutline: !0,
  // 文本相关配置
  textEdit: !1,
  nodeTextEdit: !1,
  edgeTextEdit: !1,
  textDraggable: !1,
  nodeTextDraggable: !1,
  edgeTextDraggable: !1
}, Sn = [
  "isSilentMode",
  // 是否为静默模式
  "stopZoomGraph",
  // 禁止缩放画布
  "stopScrollGraph",
  // 禁止鼠标滚动移动画布
  "stopMoveGraph",
  // 禁止拖动画布
  "snapGrid",
  // 是否开启网格对齐
  "adjustEdge",
  // 允许调整边
  "adjustEdgeMiddle",
  // 允许调整边中点
  "adjustEdgeStartAndEnd",
  // 允许调整边起点和终点
  "adjustEdgeStart",
  // 允许调整边起点
  "adjustEdgeEnd",
  // 允许调整边终点
  "adjustNodePosition",
  // 允许拖动节点
  "hideAnchors",
  // 隐藏节点所有锚点
  "allowRotate",
  // 是否允许节点旋转
  "allowResize",
  // 是否允许节点缩放
  "autoExpand",
  // 是否自动展开
  "hoverOutline",
  // 显示节点悬浮时的外框
  "nodeSelectedOutline",
  // 节点被选中时是否显示 outline
  "edgeSelectedOutline",
  // 边被选中时是否显示 outline
  "textEdit",
  // 是否允许文本可编辑（全局）
  "nodeTextEdit",
  // 允许节点文本可以编辑
  "edgeTextEdit",
  // 允许边文本可以编辑
  "textDraggable",
  // 是否允许文本可拖拽（全局）
  "nodeTextDraggable",
  // 允许节点文本可以拖拽
  "edgeTextDraggable",
  // 允许边文本可以拖拽
  "multipleSelectKey",
  // 多选按键
  // 2.0.0 新增配置
  "textMode",
  // 文本模式（全局）
  "nodeTextMode",
  // 节点文本模式
  "edgeTextMode",
  // 边文本模式
  "nodeTextMultiple",
  // 是否支持多个节点文本
  "edgeTextMultiple",
  // 是否支持多个边文本
  "nodeTextVertical",
  // 节点文本是否纵向显示
  "edgeTextVertical",
  // 边文本是否纵向显示
  "isPinching"
  //是否是双指捏合态
], Tp = (
  /** @class */
  (function() {
    function r(e) {
      this.isSilentMode = !1, this.stopZoomGraph = !1, this.stopMoveGraph = !1, this.stopScrollGraph = !1, this.snapGrid = !1, this.isPinching = !1, this.textMode = Xe.TEXT, this.textEdit = !0, this.textDraggable = !1, this.nodeTextEdit = !0, this.nodeTextDraggable = !1, this.nodeTextMultiple = !1, this.nodeTextVertical = !1, this.nodeTextMode = Xe.TEXT, this.edgeTextMode = Xe.TEXT, this.edgeTextEdit = !0, this.edgeTextDraggable = !1, this.edgeTextMultiple = !1, this.edgeTextVertical = !1, this.hideAnchors = !1, this.allowRotate = !1, this.allowResize = !1, this.hoverOutline = !0, this.nodeSelectedOutline = !0, this.adjustNodePosition = !0, this.autoExpand = !1, this.adjustEdge = !0, this.adjustEdgeMiddle = !1, this.adjustEdgeStartAndEnd = !1, this.adjustEdgeStart = !1, this.adjustEdgeEnd = !1, this.edgeSelectedOutline = !0, this.multipleSelectKey = "", V(this, this.computeConfig(e));
    }
    return r.prototype.updateEditConfig = function(e) {
      var t = this.computeConfig(e);
      V(this, t);
    }, r.prototype.computeConfig = function(e) {
      var t = e.isSilentMode, n = e.textDraggable, o = e.textMode, i = e.textEdit, a = e.adjustEdgeStartAndEnd, s = {};
      if (t === !1 && V(s, this.stagedConfig), t === !0 && t !== this.isSilentMode) {
        var l = er(Dp, Sn);
        this.stagedConfig = er(this, Sn), V(s, l);
      }
      lr(i) || V(s, {
        nodeTextEdit: i,
        edgeTextEdit: i
      }), lr(n) || V(s, {
        nodeTextDraggable: n,
        edgeTextDraggable: n
      }), o && V(s, {
        nodeTextMode: o,
        edgeTextMode: o
      }), Go(a) && V(s, {
        adjustEdgeStart: a,
        adjustEdgeEnd: a
      });
      var u = er(e, Sn);
      return V(s, u);
    }, r.prototype.updateTextMode = function(e) {
      this.textMode = e, this.edgeTextMode = e, this.nodeTextMode = e;
    }, r.prototype.getConfig = function() {
      return er(this, Sn);
    }, W([
      M
    ], r.prototype, "isSilentMode", void 0), W([
      M
    ], r.prototype, "stopZoomGraph", void 0), W([
      M
    ], r.prototype, "stopMoveGraph", void 0), W([
      M
    ], r.prototype, "stopScrollGraph", void 0), W([
      M
    ], r.prototype, "snapGrid", void 0), W([
      M
    ], r.prototype, "isPinching", void 0), W([
      M
    ], r.prototype, "textMode", void 0), W([
      M
    ], r.prototype, "textEdit", void 0), W([
      M
    ], r.prototype, "textDraggable", void 0), W([
      M
    ], r.prototype, "nodeTextEdit", void 0), W([
      M
    ], r.prototype, "nodeTextDraggable", void 0), W([
      M
    ], r.prototype, "nodeTextMultiple", void 0), W([
      M
    ], r.prototype, "nodeTextVertical", void 0), W([
      M
    ], r.prototype, "nodeTextMode", void 0), W([
      M
    ], r.prototype, "edgeTextMode", void 0), W([
      M
    ], r.prototype, "edgeTextEdit", void 0), W([
      M
    ], r.prototype, "edgeTextDraggable", void 0), W([
      M
    ], r.prototype, "edgeTextMultiple", void 0), W([
      M
    ], r.prototype, "edgeTextVertical", void 0), W([
      M
    ], r.prototype, "hideAnchors", void 0), W([
      M
    ], r.prototype, "allowRotate", void 0), W([
      M
    ], r.prototype, "allowResize", void 0), W([
      M
    ], r.prototype, "hoverOutline", void 0), W([
      M
    ], r.prototype, "nodeSelectedOutline", void 0), W([
      M
    ], r.prototype, "adjustNodePosition", void 0), W([
      M
    ], r.prototype, "autoExpand", void 0), W([
      M
    ], r.prototype, "adjustEdge", void 0), W([
      M
    ], r.prototype, "adjustEdgeMiddle", void 0), W([
      M
    ], r.prototype, "adjustEdgeStartAndEnd", void 0), W([
      M
    ], r.prototype, "adjustEdgeStart", void 0), W([
      M
    ], r.prototype, "adjustEdgeEnd", void 0), W([
      M
    ], r.prototype, "edgeSelectedOutline", void 0), W([
      O
    ], r.prototype, "updateEditConfig", null), W([
      O
    ], r.prototype, "updateTextMode", null), r;
  })()
), Np = "*", Cp = (
  /** @class */
  (function() {
    function r() {
      this._events = {};
    }
    return r.prototype.on = function(e, t, n) {
      var o = this;
      e?.split(",").forEach(function(i) {
        i = i.trim(), o._events[i] || (o._events[i] = []), o._events[i].push({
          callback: t,
          once: !!n
        });
      });
    }, r.prototype.once = function(e, t) {
      var n = this;
      e?.split(",").forEach(function(o) {
        o = o.trim(), n.on(o, t, !0);
      });
    }, r.prototype.emit = function(e, t) {
      var n = this;
      e?.split(",").forEach(function(o) {
        var i = n._events[o] || [], a = n._events[Np] || [], s = function(l) {
          for (var u = l.length, d = 0; d < u; d++)
            if (l[d]) {
              var f = l[d], c = f.callback, p = f.once;
              p && (l.splice(d, 1), l.length === 0 && delete n._events[o], u--, d--), c.apply(n, [t]);
            }
        };
        s(i), s(a);
      });
    }, r.prototype.off = function(e, t) {
      var n = this;
      e || (this._events = {}), e.split(",").forEach(function(o) {
        if (!t)
          delete n._events[o];
        else {
          for (var i = n._events[o] || [], a = i.length, s = 0; s < a; s++)
            i[s].callback === t && (i.splice(s, 1), a--, s--);
          i.length === 0 && delete n._events[o];
        }
      });
    }, r.prototype.getEvents = function() {
      return this._events;
    }, r.prototype.destroy = function() {
      this._events = {};
    }, r;
  })()
), Lp = /* @__PURE__ */ (function() {
  var r = function(e, t) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, o) {
      n.__proto__ = o;
    } || function(n, o) {
      for (var i in o) Object.prototype.hasOwnProperty.call(o, i) && (n[i] = o[i]);
    }, r(e, t);
  };
  return function(e, t) {
    if (typeof t != "function" && t !== null)
      throw new TypeError("Class extends value " + String(t) + " is not a constructor or null");
    r(e, t);
    function n() {
      this.constructor = e;
    }
    e.prototype = t === null ? Object.create(t) : (n.prototype = t.prototype, new n());
  };
})(), jp = function(r, e, t, n) {
  var o = arguments.length, i = o < 3 ? e : n === null ? n = Object.getOwnPropertyDescriptor(e, t) : n, a;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") i = Reflect.decorate(r, e, t, n);
  else for (var s = r.length - 1; s >= 0; s--) (a = r[s]) && (i = (o < 3 ? a(i) : o > 3 ? a(e, t, i) : a(e, t)) || i);
  return o > 3 && i && Object.defineProperty(e, t, i), i;
}, Rp = (
  /** @class */
  (function(r) {
    Lp(e, r);
    function e(t) {
      var n = r.call(this) || this;
      n.stepScrollX = 0, n.stepScrollY = 0, n.pointers = /* @__PURE__ */ new Map(), n.onDragging = function(s) {
        var l = s.deltaX, u = s.deltaY;
        n.longPressTimer && (clearTimeout(n.longPressTimer), n.longPressTimer = void 0), n.setState({
          isDragging: !0
        });
        var d = n.props.graphModel, f = d.transformModel, c = d.editConfigModel;
        c.stopMoveGraph !== !0 && f.translate(l, u);
      }, n.onDragEnd = function() {
        n.setState({
          isDragging: !1
        });
      }, n.zoomHandler = function(s) {
        var l = n.props, u = l.graphModel, d = u.editConfigModel, f = u.transformModel, c = u.gridSize, p = l.graphModel, h = s.deltaX, v = s.deltaY, g = d.stopScrollGraph, y = d.stopZoomGraph;
        if (!g && !s.ctrlKey && !s.metaKey) {
          if (s.preventDefault(), n.stepScrollX += h, n.stepScrollY += v, Math.abs(n.stepScrollX) >= c) {
            var _ = n.stepScrollX % c, S = n.stepScrollX - _;
            f.translate(-S * f.SCALE_X, 0), n.stepScrollX = _;
          }
          if (Math.abs(n.stepScrollY) >= c) {
            var A = n.stepScrollY % c, x = n.stepScrollY - A;
            f.translate(0, -x * f.SCALE_Y), n.stepScrollY = A;
          }
          return;
        }
        if (!y) {
          s.preventDefault();
          var E = p.getPointByClient({
            x: s.clientX,
            y: s.clientY
          }), m = E.canvasOverlayPosition, b = m.x, P = m.y;
          f.zoom(s.deltaY < 0, [b, P]);
        }
      }, n.clickHandler = function(s) {
        var l = s.target;
        if (l.getAttribute("name") === "canvas-overlay") {
          var u = n.props.graphModel, d = u.selectElements;
          if (d.size > 0 && u.clearSelectElements(), n.state.isDragging)
            return;
          u.eventCenter.emit(C.BLANK_CLICK, { e: s });
        }
      }, n.handleContextMenu = function(s) {
        var l = s.target;
        if (l.getAttribute("name") === "canvas-overlay") {
          s.preventDefault();
          var u = n.props.graphModel, d = u.getPointByClient({
            x: s.clientX,
            y: s.clientY
          });
          u.eventCenter.emit(C.BLANK_CONTEXTMENU, {
            e: s,
            position: d
          });
        }
      }, n.pointerDownHandler = function(s) {
        var l = n.props.graphModel, u = l.eventCenter, d = l.editConfigModel, f = l.transformModel.SCALE_X, c = l.gridSize;
        if (n.pointers.set(s.pointerId, { x: s.clientX, y: s.clientY }), n.longPressTimer && clearTimeout(n.longPressTimer), s.pointerType === "touch" && (n.longPressTimer = window.setTimeout(function() {
          n.handleContextMenu(s);
        }, 500)), n.pointers.size === 2) {
          var p = n.props.graphModel, h = p.transformModel, v = p.editConfigModel, g = Array.from(n.pointers.values()), y = g[0].x - g[1].x, _ = g[0].y - g[1].y, S = (g[0].x + g[1].x) / 2, A = (g[0].y + g[1].y) / 2;
          n.pinchStartDistance = Math.hypot(y, _), n.pinchStartScale = h.SCALE_X, n.stepDrag.cancelDrag(), n.pinchLastCenterX = S, n.pinchLastCenterY = A, v.updateEditConfig({ isPinching: !0 });
          return;
        }
        var x = d.adjustEdge, E = d.adjustNodePosition, m = d.stopMoveGraph, b = s.target, P = !x && !E;
        (b.getAttribute("name") === "canvas-overlay" || P) && (m !== !0 ? (n.stepDrag.setStep(c * f), n.stepDrag.handleMouseDown(s)) : u.emit(C.BLANK_MOUSEDOWN, { e: s }));
      }, n.pointerMoveHandler = function(s) {
        var l;
        if (n.pointers.set(s.pointerId, { x: s.clientX, y: s.clientY }), n.pinchStartDistance && n.pointers.size >= 2) {
          var u = n.props, d = u.graphModel, f = u.graphModel, c = f.editConfigModel, p = f.transformModel;
          if (c.stopZoomGraph)
            return;
          n.longPressTimer && clearTimeout(n.longPressTimer);
          var h = Array.from(n.pointers.values()), v = h[0].x - h[1].x, g = h[0].y - h[1].y, y = Math.hypot(v, g), _ = ((l = n.pinchStartScale) !== null && l !== void 0 ? l : p.SCALE_X) * (y / n.pinchStartDistance), S = (h[0].x + h[1].x) / 2, A = (h[0].y + h[1].y) / 2, x = d.getPointByClient({ x: S, y: A }), E = x.canvasOverlayPosition, m = E.x, b = E.y;
          if (p.zoom(_, [m, b]), !c.stopMoveGraph || c.isPinching) {
            var P = n.pinchLastCenterX === void 0 ? 0 : S - n.pinchLastCenterX, D = n.pinchLastCenterY === void 0 ? 0 : A - n.pinchLastCenterY;
            p.translate(P, D), n.pinchLastCenterX = S, n.pinchLastCenterY = A;
          }
          s.preventDefault();
        }
      }, n.pointerUpHandler = function(s) {
        if (n.pointers.delete(s.pointerId), n.longPressTimer && (clearTimeout(n.longPressTimer), n.longPressTimer = void 0), n.pointers.size < 2) {
          n.pinchStartDistance = void 0, n.pinchStartScale = void 0, n.pinchLastCenterX = void 0, n.pinchLastCenterY = void 0;
          var l = n.props.graphModel.editConfigModel;
          l.updateEditConfig({ isPinching: !1 }), n.clickHandler(s);
        }
      };
      var o = t.graphModel, i = o.gridSize, a = o.eventCenter;
      return n.stepDrag = new ut({
        onDragging: n.onDragging,
        onDragEnd: n.onDragEnd,
        step: i,
        eventType: "BLANK",
        isStopPropagation: !1,
        eventCenter: a,
        model: void 0
      }), n.state = {
        isDragging: !1
      }, n;
    }
    return e.prototype.render = function() {
      var t = this.props.graphModel.transformModel, n = t.getTransformStyle().transform, o = this.props.children, i = this.state.isDragging;
      return w("svg", { xmlns: "http://www.w3.org/2000/svg", width: "100%", height: "100%", name: "canvas-overlay", onWheel: this.zoomHandler, onPointerDown: this.pointerDownHandler, onPointerMove: this.pointerMoveHandler, onPointerUp: this.pointerUpHandler, onPointerCancel: this.pointerUpHandler, onContextMenu: this.handleContextMenu, style: { touchAction: "none", WebkitUserSelect: "none" }, className: i ? "lf-canvas-overlay lf-dragging" : "lf-canvas-overlay lf-drag-able", children: w("g", { transform: n, children: o }) });
    }, e = jp([
      je
    ], e), e;
  })($)
), eu = /* @__PURE__ */ (function() {
  var r = function(e, t) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, o) {
      n.__proto__ = o;
    } || function(n, o) {
      for (var i in o) Object.prototype.hasOwnProperty.call(o, i) && (n[i] = o[i]);
    }, r(e, t);
  };
  return function(e, t) {
    if (typeof t != "function" && t !== null)
      throw new TypeError("Class extends value " + String(t) + " is not a constructor or null");
    r(e, t);
    function n() {
      this.constructor = e;
    }
    e.prototype = t === null ? Object.create(t) : (n.prototype = t.prototype, new n());
  };
})(), en = function() {
  return en = Object.assign || function(r) {
    for (var e, t = 1, n = arguments.length; t < n; t++) {
      e = arguments[t];
      for (var o in e) Object.prototype.hasOwnProperty.call(e, o) && (r[o] = e[o]);
    }
    return r;
  }, en.apply(this, arguments);
}, Ip = function(r, e, t, n) {
  var o = arguments.length, i = o < 3 ? e : n === null ? n = Object.getOwnPropertyDescriptor(e, t) : n, a;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") i = Reflect.decorate(r, e, t, n);
  else for (var s = r.length - 1; s >= 0; s--) (a = r[s]) && (i = (o < 3 ? a(i) : o > 3 ? a(e, t, i) : a(e, t)) || i);
  return o > 3 && i && Object.defineProperty(e, t, i), i;
}, kp = function(r, e) {
  var t = typeof Symbol == "function" && r[Symbol.iterator];
  if (!t) return r;
  var n = t.call(r), o, i = [], a;
  try {
    for (; (e === void 0 || e-- > 0) && !(o = n.next()).done; ) i.push(o.value);
  } catch (s) {
    a = { error: s };
  } finally {
    try {
      o && !o.done && (t = n.return) && t.call(n);
    } finally {
      if (a) throw a.error;
    }
  }
  return i;
}, Es = (
  /** @class */
  (function(r) {
    eu(e, r);
    function e() {
      var t = r.call(this) || this;
      return t.onDragging = function(n) {
        var o = n.event, i = t.props, a = i.graphModel, s = i.bezierModel, l = i.type, u = a.getPointByClient({
          x: o.clientX,
          y: o.clientY
        }).canvasOverlayPosition, d = u.x, f = u.y;
        s.updateAdjustAnchor({
          x: d,
          y: f
        }, l), a.eventCenter.emit(C.EDGE_ADJUST, {
          data: s.getData()
        });
      }, t.onDragEnd = function() {
        var n = t.props.bezierModel;
        n.isDragging = !1;
      }, t.dragHandler = new ut({
        onDragging: t.onDragging,
        onDragEnd: t.onDragEnd
      }), t;
    }
    return e.prototype.render = function() {
      var t = this, n = this.props.position, o = n.x, i = n.y, a = this.props.bezierModel, s = a.getEdgeStyle().adjustAnchor;
      return w(mr, en({ className: "lf-bezier-adjust-anchor", x: o, y: i }, s, { onPointerDown: function(l) {
        t.dragHandler.handleMouseDown(l);
      } }));
    }, e;
  })($)
), Bp = (
  /** @class */
  (function(r) {
    eu(e, r);
    function e() {
      return r !== null && r.apply(this, arguments) || this;
    }
    return e.prototype.getBezierAdjust = function(t, n) {
      var o = t.path, i = t.id, a = Ui(o), s = kp(a, 4), l = s[0], u = s[1], d = s[2], f = s[3], c = t.getEdgeStyle().adjustLine, p = [];
      return p.push(w(_r, en({ x1: l.x, y1: l.y, x2: u.x, y2: u.y }, c))), p.push(w(Es, { position: u, bezierModel: t, graphModel: n, type: "sNext" }, "".concat(i, "_ePre"))), p.push(w(_r, en({ x1: f.x, y1: f.y, x2: d.x, y2: d.y }, c))), p.push(w(Es, { position: d, bezierModel: t, graphModel: n, type: "ePre" }, "".concat(i, "_sNext"))), p;
    }, e.prototype.selectedBezierEdge = function() {
      for (var t = this.props.graphModel, n = t.edges, o = [], i = 0; i < n.length; i++) {
        var a = n[i];
        a.isSelected && a.modelType === G.BEZIER_EDGE && a.draggable && o.push(this.getBezierAdjust(a, t));
      }
      return o;
    }, e.prototype.render = function() {
      return w("g", { className: "lf-bezier-adjust", children: this.selectedBezierEdge() });
    }, e = Ip([
      je
    ], e), e;
  })($)
), Xp = /* @__PURE__ */ (function() {
  var r = function(e, t) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, o) {
      n.__proto__ = o;
    } || function(n, o) {
      for (var i in o) Object.prototype.hasOwnProperty.call(o, i) && (n[i] = o[i]);
    }, r(e, t);
  };
  return function(e, t) {
    if (typeof t != "function" && t !== null)
      throw new TypeError("Class extends value " + String(t) + " is not a constructor or null");
    r(e, t);
    function n() {
      this.constructor = e;
    }
    e.prototype = t === null ? Object.create(t) : (n.prototype = t.prototype, new n());
  };
})(), Yp = function(r, e, t, n) {
  var o = arguments.length, i = o < 3 ? e : n === null ? n = Object.getOwnPropertyDescriptor(e, t) : n, a;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") i = Reflect.decorate(r, e, t, n);
  else for (var s = r.length - 1; s >= 0; s--) (a = r[s]) && (i = (o < 3 ? a(i) : o > 3 ? a(e, t, i) : a(e, t)) || i);
  return o > 3 && i && Object.defineProperty(e, t, i), i;
}, Fp = (
  /** @class */
  (function(r) {
    Xp(e, r);
    function e() {
      return r !== null && r.apply(this, arguments) || this;
    }
    return e.prototype.render = function() {
      var t = this.props.background;
      return w("div", { className: "lf-background", children: w("div", { style: Ys(t) ? t : {}, className: "lf-background-area" }) });
    }, e = Yp([
      je
    ], e), e;
  })($)
), ci = function() {
  return ci = Object.assign || function(r) {
    for (var e, t = 1, n = arguments.length; t < n; t++) {
      e = arguments[t];
      for (var o in e) Object.prototype.hasOwnProperty.call(e, o) && (r[o] = e[o]);
    }
    return r;
  }, ci.apply(this, arguments);
}, Hp = function(r) {
  var e = typeof Symbol == "function" && Symbol.iterator, t = e && r[e], n = 0;
  if (t) return t.call(r);
  if (r && typeof r.length == "number") return {
    next: function() {
      return r && n >= r.length && (r = void 0), { value: r && r[n++], done: !r };
    }
  };
  throw new TypeError(e ? "Object is not iterable." : "Symbol.iterator is not defined.");
}, Cr = {
  opacity: 1,
  boldIndices: [5],
  dashArrayConfig: {
    pattern: [2, 1]
  },
  customBoldWidth: 2
};
function Gp(r) {
  var e, t, n, o, i = Math.max(0, Math.min(1, (n = r.opacity) !== null && n !== void 0 ? n : Cr.opacity)), a = /* @__PURE__ */ new Set(), s = Array.isArray(r.boldIndices) ? r.boldIndices : Cr.boldIndices;
  try {
    for (var l = Hp(s), u = l.next(); !u.done; u = l.next()) {
      var d = u.value;
      typeof d == "number" && Number.isFinite(d) && d > 0 && a.add(Math.floor(d));
    }
  } catch (v) {
    e = { error: v };
  } finally {
    try {
      u && !u.done && (t = l.return) && t.call(l);
    } finally {
      if (e) throw e.error;
    }
  }
  var f = Array.from(a), c = Array.isArray((o = r.dashArrayConfig) === null || o === void 0 ? void 0 : o.pattern) ? r.dashArrayConfig.pattern : Cr.dashArrayConfig.pattern, p = {
    pattern: c
  }, h = r.customBoldWidth;
  return {
    opacity: i,
    boldIndices: f.length ? f : Cr.boldIndices,
    dashArrayConfig: p,
    customBoldWidth: h
  };
}
function bs(r) {
  return r === !1 ? {
    mode: "disabled",
    config: {
      opacity: 1,
      boldIndices: [],
      dashArrayConfig: {
        pattern: []
      }
    }
  } : r === !0 || r == null ? { mode: "default", config: ci({}, Cr) } : { mode: "custom", config: Gp(r) };
}
var zp = /* @__PURE__ */ (function() {
  var r = function(e, t) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, o) {
      n.__proto__ = o;
    } || function(n, o) {
      for (var i in o) Object.prototype.hasOwnProperty.call(o, i) && (n[i] = o[i]);
    }, r(e, t);
  };
  return function(e, t) {
    if (typeof t != "function" && t !== null)
      throw new TypeError("Class extends value " + String(t) + " is not a constructor or null");
    r(e, t);
    function n() {
      this.constructor = e;
    }
    e.prototype = t === null ? Object.create(t) : (n.prototype = t.prototype, new n());
  };
})(), Up = function(r, e, t, n) {
  var o = arguments.length, i = o < 3 ? e : n === null ? n = Object.getOwnPropertyDescriptor(e, t) : n, a;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") i = Reflect.decorate(r, e, t, n);
  else for (var s = r.length - 1; s >= 0; s--) (a = r[s]) && (i = (o < 3 ? a(i) : o > 3 ? a(e, t, i) : a(e, t)) || i);
  return o > 3 && i && Object.defineProperty(e, t, i), i;
}, Vp = function(r, e) {
  var t = typeof Symbol == "function" && r[Symbol.iterator];
  if (!t) return r;
  var n = t.call(r), o, i = [], a;
  try {
    for (; (e === void 0 || e-- > 0) && !(o = n.next()).done; ) i.push(o.value);
  } catch (s) {
    a = { error: s };
  } finally {
    try {
      o && !o.done && (t = n.return) && t.call(n);
    } finally {
      if (a) throw a.error;
    }
  }
  return i;
}, $p = function(r, e, t) {
  if (t || arguments.length === 2) for (var n = 0, o = e.length, i; n < o; n++)
    (i || !(n in e)) && (i || (i = Array.prototype.slice.call(e, 0, n)), i[n] = e[n]);
  return r.concat(i || Array.prototype.slice.call(e));
}, sr = (
  /** @class */
  (function(r) {
    zp(e, r);
    function e(t) {
      var n = r.call(this, t) || this;
      return n.id = It(), n.gridOptions = n.props.graphModel.grid, n;
    }
    return e.prototype.renderDot = function() {
      var t = this.gridOptions, n = t.config, o = t.size, i = o === void 0 ? 1 : o, a = t.visible, s = n ?? {}, l = s.color, u = s.thickness, d = u === void 0 ? 2 : u, f = Math.min(Math.max(2, d), i / 4), c = a ? 1 : 0;
      return w("g", { fill: l, opacity: c, children: [w("circle", { cx: 0, cy: 0, r: f / 2 }), w("circle", { cx: 0, cy: i, r: f / 2 }), w("circle", { cx: i, cy: 0, r: f / 2 }), w("circle", { cx: i, cy: i, r: f / 2 })] });
    }, e.prototype.getDashArrayForSize = function(t) {
      var n, o = (n = t?.pattern) === null || n === void 0 ? void 0 : n.filter(function(i) {
        return typeof i == "number" && i > 0;
      });
      return o?.join(",") || "2,1";
    }, e.prototype.getPeriod = function(t) {
      var n = Array.isArray(t?.boldIndices) ? t.boldIndices.filter(function(o) {
        return typeof o == "number" && o > 0;
      }) : [];
      return n.length ? Math.max.apply(Math, $p([], Vp(n), !1)) : 0;
    }, e.prototype.getBoldStrokeWidth = function(t, n, o, i) {
      if (typeof t?.customBoldWidth == "number")
        return t.customBoldWidth;
      var a = Math.max(1, o ?? 1), s = Math.max(1, i ?? this.getPeriod(t));
      return Math.min(a, n * s / 2) / 2;
    }, e.prototype.renderMeshEdgeLines = function(t, n, o, i, a) {
      var s = [
        { d: "M 0 0 H ".concat(t) },
        { d: "M 0 ".concat(t, " H ").concat(t) },
        { d: "M 0 0 V ".concat(t) },
        { d: "M ".concat(t, " 0 V ").concat(t) }
      ];
      return w("g", { opacity: i, fill: "transparent", children: s.map(function(l) {
        return w("path", { d: l.d, stroke: n, strokeWidth: o / 2, strokeDasharray: a, strokeLinecap: "butt", fill: "transparent" });
      }) });
    }, e.prototype.renderMesh = function() {
      var t, n, o = this.gridOptions, i = o.config, a = o.size, s = a === void 0 ? 1 : a, l = o.visible, u = o.majorBold, d = bs(u).config, f = d.opacity, c = (t = i?.color) !== null && t !== void 0 ? t : "#D7DEEB", p = (n = i?.thickness) !== null && n !== void 0 ? n : 1, h = Math.min(Math.max(1, p), s / 2), v = l ? f : 0, g = u === !1 ? void 0 : this.getDashArrayForSize(d.dashArrayConfig);
      return this.renderMeshEdgeLines(s, c, h, v, g);
    }, e.prototype.render = function() {
      var t = this, n, o, i, a = this.props.graphModel, s = a.transformModel, l = a.grid;
      this.gridOptions = l;
      var u = this.gridOptions, d = u.type, f = u.config, c = f === void 0 ? {} : f, p = u.size, h = p === void 0 ? 1 : p, v = u.majorBold, g = v !== !1 && !Me(v), y = bs(v).config, _ = s.SCALE_X, S = s.SKEW_Y, A = s.SKEW_X, x = s.SCALE_Y, E = s.TRANSLATE_X, m = s.TRANSLATE_Y, b = [
        _,
        S,
        A,
        x,
        E,
        m
      ].join(","), P = "matrix(".concat(b, ")"), D = Math.min(Math.max(2, (n = c.thickness) !== null && n !== void 0 ? n : 1), h / 4), k = g ? y.opacity : 1;
      return w("div", { className: "lf-grid", children: w("svg", { xmlns: "http://www.w3.org/2000/svg", version: "1.1", width: "100%", height: "100%", children: [w("defs", { children: [w("pattern", { id: this.id, patternUnits: "userSpaceOnUse", patternTransform: P, x: "0", y: "0", width: h, height: h, children: [d === "dot" && this.renderDot(), d === "mesh" && this.renderMesh()] }), d === "dot" && y.boldIndices.length ? w("pattern", { id: "".concat(this.id, "-dot-major"), patternUnits: "userSpaceOnUse", patternTransform: P, x: "0", y: "0", width: h * this.getPeriod(y), height: h * this.getPeriod(y), children: w("g", { fill: (i = (o = this.gridOptions.config) === null || o === void 0 ? void 0 : o.color) !== null && i !== void 0 ? i : "#D7DEEB", opacity: this.gridOptions.visible ? k : 0, children: [w("circle", { cx: 0, cy: 0, r: D * 1.5 / 2 }), w("circle", { cx: h * this.getPeriod(y), cy: 0, r: D * 1.5 / 2 }), w("circle", { cx: 0, cy: h * this.getPeriod(y), r: D * 1.5 / 2 }), w("circle", { cx: h * this.getPeriod(y), cy: h * this.getPeriod(y), r: D * 1.5 / 2 })] }) }) : null, d === "mesh" && y.boldIndices.length ? w("pattern", { id: "".concat(this.id, "-major"), patternUnits: "userSpaceOnUse", patternTransform: P, x: "0", y: "0", width: h * this.getPeriod(y), height: h * this.getPeriod(y), children: y.boldIndices.map(function(Y) {
        var J, H, oe, ne, ae, ue;
        return w("g", { children: [w("path", { d: "M ".concat(h * Y, " 0 V ").concat(h * t.getPeriod(y)), stroke: (H = (J = t.gridOptions.config) === null || J === void 0 ? void 0 : J.color) !== null && H !== void 0 ? H : "#D7DEEB", strokeWidth: t.getBoldStrokeWidth(y, h, ((oe = t.gridOptions.config) !== null && oe !== void 0 ? oe : {}).thickness, t.getPeriod(y)), opacity: t.gridOptions.visible ? k : 0, fill: "transparent" }), w("path", { d: "M 0 ".concat(h * Y, " H ").concat(h * t.getPeriod(y)), stroke: (ae = (ne = t.gridOptions.config) === null || ne === void 0 ? void 0 : ne.color) !== null && ae !== void 0 ? ae : "#D7DEEB", strokeWidth: t.getBoldStrokeWidth(y, h, ((ue = t.gridOptions.config) !== null && ue !== void 0 ? ue : {}).thickness, t.getPeriod(y)), opacity: t.gridOptions.visible ? k : 0, fill: "transparent" })] });
      }) }) : null] }), w("rect", { width: "100%", height: "100%", fill: "url(#".concat(this.id, ")") }), d === "dot" && g && y.boldIndices.length ? w("rect", { width: "100%", height: "100%", fill: "url(#".concat(this.id, "-dot-major)") }) : null, d === "mesh" && g && y.boldIndices.length ? w("rect", { width: "100%", height: "100%", fill: "url(#".concat(this.id, "-major)") }) : null] }) });
    }, e = Up([
      je
    ], e), e;
  })($)
);
(function(r) {
  function e(t) {
    var n = I(zi);
    return typeof t == "number" ? V(n, { size: t }) : typeof t == "boolean" ? V(n, { visible: t }) : V(n, t);
  }
  r.getGridOptions = e;
})(sr || (sr = {}));
var Wp = /* @__PURE__ */ (function() {
  var r = function(e, t) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, o) {
      n.__proto__ = o;
    } || function(n, o) {
      for (var i in o) Object.prototype.hasOwnProperty.call(o, i) && (n[i] = o[i]);
    }, r(e, t);
  };
  return function(e, t) {
    if (typeof t != "function" && t !== null)
      throw new TypeError("Class extends value " + String(t) + " is not a constructor or null");
    r(e, t);
    function n() {
      this.constructor = e;
    }
    e.prototype = t === null ? Object.create(t) : (n.prototype = t.prototype, new n());
  };
})(), Kp = function(r, e, t, n) {
  var o = arguments.length, i = o < 3 ? e : n === null ? n = Object.getOwnPropertyDescriptor(e, t) : n, a;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") i = Reflect.decorate(r, e, t, n);
  else for (var s = r.length - 1; s >= 0; s--) (a = r[s]) && (i = (o < 3 ? a(i) : o > 3 ? a(e, t, i) : a(e, t)) || i);
  return o > 3 && i && Object.defineProperty(e, t, i), i;
}, Zp = (
  /** @class */
  (function(r) {
    Wp(e, r);
    function e() {
      return r !== null && r.apply(this, arguments) || this;
    }
    return e.prototype.render = function() {
      var t = this.props.graphModel.transformModel, n = t.getTransformStyle().transform, o = this.props.children;
      return w("svg", { xmlns: "http://www.w3.org/2000/svg", version: "1.1", width: "100%", height: "100%", className: "modification-overlay", children: w("g", { transform: n, children: o }) });
    }, e = Kp([
      je
    ], e), e;
  })($)
), qp = /* @__PURE__ */ (function() {
  var r = function(e, t) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, o) {
      n.__proto__ = o;
    } || function(n, o) {
      for (var i in o) Object.prototype.hasOwnProperty.call(o, i) && (n[i] = o[i]);
    }, r(e, t);
  };
  return function(e, t) {
    if (typeof t != "function" && t !== null)
      throw new TypeError("Class extends value " + String(t) + " is not a constructor or null");
    r(e, t);
    function n() {
      this.constructor = e;
    }
    e.prototype = t === null ? Object.create(t) : (n.prototype = t.prototype, new n());
  };
})(), ir = function() {
  return ir = Object.assign || function(r) {
    for (var e, t = 1, n = arguments.length; t < n; t++) {
      e = arguments[t];
      for (var o in e) Object.prototype.hasOwnProperty.call(e, o) && (r[o] = e[o]);
    }
    return r;
  }, ir.apply(this, arguments);
}, Jp = function(r, e, t, n) {
  var o = arguments.length, i = o < 3 ? e : n === null ? n = Object.getOwnPropertyDescriptor(e, t) : n, a;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") i = Reflect.decorate(r, e, t, n);
  else for (var s = r.length - 1; s >= 0; s--) (a = r[s]) && (i = (o < 3 ? a(i) : o > 3 ? a(e, t, i) : a(e, t)) || i);
  return o > 3 && i && Object.defineProperty(e, t, i), i;
}, Qp = (
  /** @class */
  (function(r) {
    qp(e, r);
    function e() {
      return r !== null && r.apply(this, arguments) || this;
    }
    return e.prototype.renderRectOutline = function(t, n, o, i) {
      var a = n || {}, s = a.widthOffset, l = s === void 0 ? i.widthOffset : s, u = a.heightOffset, d = u === void 0 ? i.heightOffset : u, f = _o(t, l, d), c = f.x, p = f.y, h = f.width, v = f.height;
      return w(wt, ir({ className: o, x: c, y: p, width: h, height: v }, n));
    }, e.prototype.getNodesOutline = function() {
      var t = this.props.graphModel, n = t.nodes, o = t.editConfigModel, i = o.hoverOutline, a = o.nodeSelectedOutline, s = [];
      return n.forEach(function(l) {
        if (l.isHovered || l.isSelected) {
          var u = l.isHovered, d = l.isSelected, f = l.x, c = l.y, p = l.width, h = l.height;
          if (a && d || i && u) {
            var v = l.getOutlineStyle() || {}, g = {};
            if (Object.keys(v).forEach(function(_) {
              _ !== "hover" && (g[_] = v[_]);
            }), u) {
              var y = v.hover;
              g = ir(ir({}, g), y);
            }
            s.push(w(wt, ir({
              transform: l.transform,
              className: "lf-outline-node",
              x: f,
              y: c,
              width: p + 4,
              height: h + 4
            }, g)));
          }
        }
      }), s;
    }, e.prototype.getEdgeOutline = function() {
      for (var t = this.props.graphModel, n = t.edges, o = t.editConfigModel, i = o.edgeSelectedOutline, a = o.hoverOutline, s = [], l = 0; l < n.length; l++) {
        var u = n[l];
        (i && u.isSelected || a && u.isHovered) && (u.modelType === G.LINE_EDGE ? s.push(this.getLineOutline(u)) : u.modelType === G.POLYLINE_EDGE ? s.push(this.getPolylineOutline(u)) : u.modelType === G.BEZIER_EDGE && s.push(this.getBezierOutline(u)));
      }
      return s;
    }, e.prototype.getLineOutline = function(t) {
      var n = t.startPoint, o = t.endPoint, i = t.getOutlineStyle();
      return this.renderRectOutline([n, o], i, "lf-outline-edge", { widthOffset: 10, heightOffset: 10 });
    }, e.prototype.getPolylineOutline = function(t) {
      var n = t.points, o = Et(n), i = t.getOutlineStyle();
      return this.renderRectOutline(o, i, "lf-outline", {
        widthOffset: 8,
        heightOffset: 16
      });
    }, e.prototype.getBezierOutline = function(t) {
      var n = t.path, o = Ui(n), i = t.getOutlineStyle();
      return this.renderRectOutline(o, i, "lf-outline", {
        widthOffset: 8,
        heightOffset: 16
      });
    }, e.prototype.render = function() {
      return w("g", { className: "lf-outline", children: [this.getNodesOutline(), this.getEdgeOutline()] });
    }, e = Jp([
      je
    ], e), e;
  })($)
), eh = /* @__PURE__ */ (function() {
  var r = function(e, t) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, o) {
      n.__proto__ = o;
    } || function(n, o) {
      for (var i in o) Object.prototype.hasOwnProperty.call(o, i) && (n[i] = o[i]);
    }, r(e, t);
  };
  return function(e, t) {
    if (typeof t != "function" && t !== null)
      throw new TypeError("Class extends value " + String(t) + " is not a constructor or null");
    r(e, t);
    function n() {
      this.constructor = e;
    }
    e.prototype = t === null ? Object.create(t) : (n.prototype = t.prototype, new n());
  };
})(), gt = function() {
  return gt = Object.assign || function(r) {
    for (var e, t = 1, n = arguments.length; t < n; t++) {
      e = arguments[t];
      for (var o in e) Object.prototype.hasOwnProperty.call(e, o) && (r[o] = e[o]);
    }
    return r;
  }, gt.apply(this, arguments);
}, th = function(r, e, t, n) {
  var o = arguments.length, i = o < 3 ? e : n === null ? n = Object.getOwnPropertyDescriptor(e, t) : n, a;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") i = Reflect.decorate(r, e, t, n);
  else for (var s = r.length - 1; s >= 0; s--) (a = r[s]) && (i = (o < 3 ? a(i) : o > 3 ? a(e, t, i) : a(e, t)) || i);
  return o > 3 && i && Object.defineProperty(e, t, i), i;
}, rh = (
  /** @class */
  (function(r) {
    eh(e, r);
    function e() {
      return r !== null && r.apply(this, arguments) || this;
    }
    return e.prototype.render = function() {
      var t = this.props.snaplineModel, n = t ?? {}, o = n.position, i = n.isShowHorizontal, a = n.isShowVertical, s = t?.getStyle(), l = o ?? {}, u = l.x, d = u === void 0 ? 0 : u, f = l.y, c = f === void 0 ? 0 : f, p = gt(gt({ x1: -1e5, y1: c, x2: 1e5, y2: c }, s), { stroke: i ? s?.stroke : "none" }), h = gt(gt({ x1: d, y1: -1e5, x2: d, y2: 1e5 }, s), { stroke: a ? s?.stroke : "none" });
      return w("g", { className: "lf-snapline", children: [w(_r, gt({}, p)), w(_r, gt({}, h))] });
    }, e = th([
      je
    ], e), e;
  })($)
), nh = /* @__PURE__ */ (function() {
  var r = function(e, t) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, o) {
      n.__proto__ = o;
    } || function(n, o) {
      for (var i in o) Object.prototype.hasOwnProperty.call(o, i) && (n[i] = o[i]);
    }, r(e, t);
  };
  return function(e, t) {
    if (typeof t != "function" && t !== null)
      throw new TypeError("Class extends value " + String(t) + " is not a constructor or null");
    r(e, t);
    function n() {
      this.constructor = e;
    }
    e.prototype = t === null ? Object.create(t) : (n.prototype = t.prototype, new n());
  };
})(), oh = function(r, e, t, n) {
  var o = arguments.length, i = o < 3 ? e : n === null ? n = Object.getOwnPropertyDescriptor(e, t) : n, a;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") i = Reflect.decorate(r, e, t, n);
  else for (var s = r.length - 1; s >= 0; s--) (a = r[s]) && (i = (o < 3 ? a(i) : o > 3 ? a(e, t, i) : a(e, t)) || i);
  return o > 3 && i && Object.defineProperty(e, t, i), i;
}, ih = (
  /** @class */
  (function(r) {
    nh(e, r);
    function e() {
      return r !== null && r.apply(this, arguments) || this;
    }
    return e.prototype.componentDidMount = function() {
      this.triggerToolRender();
    }, e.prototype.componentDidUpdate = function() {
      this.triggerToolRender();
    }, e.prototype.getTools = function() {
      var t = this.props, n = t.tool, o = t.graphModel, i = o.textEditElement, a = n.getTools(), s = a.map(function(l) {
        return ur(l, {
          textEditElement: i,
          graphModel: o,
          lf: n.instance
        });
      });
      return n.components = s, s;
    }, e.prototype.triggerToolRender = function() {
      var t = this.props, n = t.tool, o = t.graphModel, i = document.querySelector("#ToolOverlay_".concat(o.flowId)), a = n.getInstance();
      a.components.forEach(function(s) {
        return s(a, i);
      }), a.components = [];
    }, e.prototype.render = function() {
      var t = this.props.graphModel;
      return w("div", { className: "lf-tool-overlay", id: "ToolOverlay_".concat(t.flowId), children: this.getTools() });
    }, e = oh([
      je
    ], e), e;
  })($)
), He = function(r, e, t, n) {
  var o = arguments.length, i = o < 3 ? e : n === null ? n = Object.getOwnPropertyDescriptor(e, t) : n, a;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") i = Reflect.decorate(r, e, t, n);
  else for (var s = r.length - 1; s >= 0; s--) (a = r[s]) && (i = (o < 3 ? a(i) : o > 3 ? a(e, t, i) : a(e, t)) || i);
  return o > 3 && i && Object.defineProperty(e, t, i), i;
}, qt = function(r, e) {
  var t = typeof Symbol == "function" && r[Symbol.iterator];
  if (!t) return r;
  var n = t.call(r), o, i = [], a;
  try {
    for (; (e === void 0 || e-- > 0) && !(o = n.next()).done; ) i.push(o.value);
  } catch (s) {
    a = { error: s };
  } finally {
    try {
      o && !o.done && (t = n.return) && t.call(n);
    } finally {
      if (a) throw a.error;
    }
  }
  return i;
}, ah = {
  false: [-1 / 0, -1 / 0, 1 / 0, 1 / 0],
  true: [-1 / 0, -1 / 0, 1 / 0, 1 / 0],
  vertical: [-1 / 0, 0, 1 / 0, 0],
  horizontal: [0, -1 / 0, 0, 1 / 0]
}, sh = (
  /** @class */
  (function() {
    function r(e, t) {
      this.MINI_SCALE_SIZE = 0.2, this.MAX_SCALE_SIZE = 16, this.SCALE_X = 1, this.SKEW_Y = 0, this.SKEW_X = 0, this.SCALE_Y = 1, this.TRANSLATE_X = 0, this.TRANSLATE_Y = 0, this.ZOOM_SIZE = 0.04, this.translateLimitMinX = -1 / 0, this.translateLimitMinY = -1 / 0, this.translateLimitMaxX = 1 / 0, this.translateLimitMaxY = 1 / 0, this.eventCenter = e;
      var n = t.stopMoveGraph, o = n === void 0 ? !1 : n;
      this.updateTranslateLimits(o);
    }
    return r.prototype.setZoomMiniSize = function(e) {
      this.MINI_SCALE_SIZE = e;
    }, r.prototype.setZoomMaxSize = function(e) {
      this.MAX_SCALE_SIZE = e;
    }, r.prototype.HtmlPointToCanvasPoint = function(e) {
      var t = qt(e, 2), n = t[0], o = t[1];
      return [
        (n - this.TRANSLATE_X) / this.SCALE_X,
        (o - this.TRANSLATE_Y) / this.SCALE_Y
      ];
    }, r.prototype.CanvasPointToHtmlPoint = function(e) {
      var t = qt(e, 2), n = t[0], o = t[1];
      return [
        n * this.SCALE_X + this.TRANSLATE_X,
        o * this.SCALE_Y + this.TRANSLATE_Y
      ];
    }, r.prototype.moveCanvasPointByHtml = function(e, t, n) {
      var o = qt(e, 2), i = o[0], a = o[1];
      return [i + t / this.SCALE_X, a + n / this.SCALE_Y];
    }, r.prototype.fixDeltaXY = function(e, t) {
      return [e / this.SCALE_X, t / this.SCALE_Y];
    }, r.prototype.getTransformStyle = function() {
      var e = [
        this.SCALE_X,
        this.SKEW_Y,
        this.SKEW_X,
        this.SCALE_Y,
        this.TRANSLATE_X,
        this.TRANSLATE_Y
      ].join(",");
      return {
        transform: "matrix(".concat(e, ")")
      };
    }, r.prototype.zoom = function(e, t) {
      e === void 0 && (e = !1);
      var n = this.SCALE_X, o = this.SCALE_Y;
      return typeof e == "number" ? (n = e, o = e) : e ? (n += this.ZOOM_SIZE, o += this.ZOOM_SIZE) : (n -= this.ZOOM_SIZE, o -= this.ZOOM_SIZE), n < this.MINI_SCALE_SIZE || n > this.MAX_SCALE_SIZE ? "".concat(this.SCALE_X * 100, "%") : (t && (this.TRANSLATE_X -= (n - this.SCALE_X) * t[0], this.TRANSLATE_Y -= (o - this.SCALE_Y) * t[1]), this.SCALE_X = n, this.SCALE_Y = o, this.emitGraphTransform("zoom"), "".concat(this.SCALE_X * 100, "%"));
    }, r.prototype.emitGraphTransform = function(e) {
      this.eventCenter.emit(C.GRAPH_TRANSFORM, {
        type: e,
        transform: {
          SCALE_X: this.SCALE_X,
          SKEW_Y: this.SKEW_Y,
          SKEW_X: this.SKEW_X,
          SCALE_Y: this.SCALE_Y,
          TRANSLATE_X: this.TRANSLATE_X,
          TRANSLATE_Y: this.TRANSLATE_Y
        }
      });
    }, r.prototype.resetZoom = function() {
      this.SCALE_X = 1, this.SCALE_Y = 1, this.emitGraphTransform("resetZoom");
    }, r.prototype.translate = function(e, t) {
      this.TRANSLATE_X + e <= this.translateLimitMaxX && this.TRANSLATE_X + e >= this.translateLimitMinX && (this.TRANSLATE_X += e), this.TRANSLATE_Y + t <= this.translateLimitMaxY && this.TRANSLATE_Y + t >= this.translateLimitMinY && (this.TRANSLATE_Y += t), this.emitGraphTransform("translate");
    }, r.prototype.focusOn = function(e, t, n, o) {
      var i = qt(this.CanvasPointToHtmlPoint([e, t]), 2), a = i[0], s = i[1], l = qt([n / 2 - a, o / 2 - s], 2), u = l[0], d = l[1];
      this.TRANSLATE_X += u, this.TRANSLATE_Y += d, this.emitGraphTransform("focusOn");
    }, r.prototype.updateTranslateLimits = function(e) {
      var t;
      t = qt(Array.isArray(e) && e.length === 4 ? e : ah[e.toString()], 4), this.translateLimitMinX = t[0], this.translateLimitMinY = t[1], this.translateLimitMaxX = t[2], this.translateLimitMaxY = t[3];
    }, He([
      M
    ], r.prototype, "SCALE_X", void 0), He([
      M
    ], r.prototype, "SKEW_Y", void 0), He([
      M
    ], r.prototype, "SKEW_X", void 0), He([
      M
    ], r.prototype, "SCALE_Y", void 0), He([
      M
    ], r.prototype, "TRANSLATE_X", void 0), He([
      M
    ], r.prototype, "TRANSLATE_Y", void 0), He([
      M
    ], r.prototype, "ZOOM_SIZE", void 0), He([
      O
    ], r.prototype, "zoom", null), He([
      O
    ], r.prototype, "resetZoom", null), He([
      O
    ], r.prototype, "translate", null), He([
      O
    ], r.prototype, "focusOn", null), r;
  })()
), lh = /* @__PURE__ */ (function() {
  var r = function(e, t) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, o) {
      n.__proto__ = o;
    } || function(n, o) {
      for (var i in o) Object.prototype.hasOwnProperty.call(o, i) && (n[i] = o[i]);
    }, r(e, t);
  };
  return function(e, t) {
    if (typeof t != "function" && t !== null)
      throw new TypeError("Class extends value " + String(t) + " is not a constructor or null");
    r(e, t);
    function n() {
      this.constructor = e;
    }
    e.prototype = t === null ? Object.create(t) : (n.prototype = t.prototype, new n());
  };
})(), Lo = function(r, e) {
  var t = typeof Symbol == "function" && r[Symbol.iterator];
  if (!t) return r;
  var n = t.call(r), o, i = [], a;
  try {
    for (; (e === void 0 || e-- > 0) && !(o = n.next()).done; ) i.push(o.value);
  } catch (s) {
    a = { error: s };
  } finally {
    try {
      o && !o.done && (t = n.return) && t.call(n);
    } finally {
      if (a) throw a.error;
    }
  }
  return i;
}, uh = (
  /** @class */
  (function(r) {
    lh(e, r);
    function e(t, n) {
      var o = r.call(this, t, n) || this;
      return o.parentTransform = n.parentTransform, o;
    }
    return e.prototype.setParentTransform = function(t) {
      this.parentTransform = t;
    }, e.prototype.getCumulativeScale = function() {
      var t = this.SCALE_X, n = this.SCALE_Y;
      if (this.parentTransform)
        if (this.parentTransform instanceof e) {
          var o = this.parentTransform.getCumulativeScale();
          t *= o.scaleX, n *= o.scaleY;
        } else
          t *= this.parentTransform.SCALE_X, n *= this.parentTransform.SCALE_Y;
      return { scaleX: t, scaleY: n };
    }, e.prototype.getCumulativeTranslate = function() {
      var t = this.TRANSLATE_X, n = this.TRANSLATE_Y;
      if (this.parentTransform && this.parentTransform instanceof e) {
        var o = this.parentTransform.getCumulativeScale(), i = o.scaleX, a = o.scaleY;
        t = i * t, n = a * n;
      }
      return { translateX: t, translateY: n };
    }, e.prototype.HtmlPointToCanvasPoint = function(t) {
      var n = Lo(t, 2), o = n[0], i = n[1], a = this.getCumulativeScale(), s = a.scaleX, l = a.scaleY, u = this.getCumulativeTranslate(), d = u.translateX, f = u.translateY;
      return [(o - d) / s, (i - f) / l];
    }, e.prototype.CanvasPointToHtmlPoint = function(t) {
      var n = Lo(t, 2), o = n[0], i = n[1], a = this.getCumulativeScale(), s = a.scaleX, l = a.scaleY, u = this.getCumulativeTranslate(), d = u.translateX, f = u.translateY;
      return [o * s + d, i * l + f];
    }, e.prototype.moveCanvasPointByHtml = function(t, n, o) {
      var i = Lo(t, 2), a = i[0], s = i[1], l = this.getCumulativeScale(), u = l.scaleX, d = l.scaleY;
      return [a + n / u, s + o / d];
    }, e.prototype.fixDeltaXY = function(t, n) {
      var o = this.getCumulativeScale(), i = o.scaleX, a = o.scaleY;
      return [t / i, n / a];
    }, e;
  })(sh)
), we = function() {
  return we = Object.assign || function(r) {
    for (var e, t = 1, n = arguments.length; t < n; t++) {
      e = arguments[t];
      for (var o in e) Object.prototype.hasOwnProperty.call(e, o) && (r[o] = e[o]);
    }
    return r;
  }, we.apply(this, arguments);
}, N = function(r, e, t, n) {
  var o = arguments.length, i = o < 3 ? e : n === null ? n = Object.getOwnPropertyDescriptor(e, t) : n, a;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") i = Reflect.decorate(r, e, t, n);
  else for (var s = r.length - 1; s >= 0; s--) (a = r[s]) && (i = (o < 3 ? a(i) : o > 3 ? a(e, t, i) : a(e, t)) || i);
  return o > 3 && i && Object.defineProperty(e, t, i), i;
}, dh = function(r) {
  var e = typeof Symbol == "function" && Symbol.iterator, t = e && r[e], n = 0;
  if (t) return t.call(r);
  if (r && typeof r.length == "number") return {
    next: function() {
      return r && n >= r.length && (r = void 0), { value: r && r[n++], done: !r };
    }
  };
  throw new TypeError(e ? "Object is not iterable." : "Symbol.iterator is not defined.");
}, ye = function(r, e) {
  var t = typeof Symbol == "function" && r[Symbol.iterator];
  if (!t) return r;
  var n = t.call(r), o, i = [], a;
  try {
    for (; (e === void 0 || e-- > 0) && !(o = n.next()).done; ) i.push(o.value);
  } catch (s) {
    a = { error: s };
  } finally {
    try {
      o && !o.done && (t = n.return) && t.call(n);
    } finally {
      if (a) throw a.error;
    }
  }
  return i;
}, Te = function(r, e, t) {
  if (t || arguments.length === 2) for (var n = 0, o = e.length, i; n < o; n++)
    (i || !(n in e)) && (i || (i = Array.prototype.slice.call(e, 0, n)), i[n] = e[n]);
  return r.concat(i || Array.prototype.slice.call(e));
}, fh = (
  /** @class */
  (function() {
    function r(e) {
      var t = this, n, o;
      this.themeMode = "default", this.modelMap = /* @__PURE__ */ new Map(), this.nodeModelMap = /* @__PURE__ */ new Map(), this.edgeModelMap = /* @__PURE__ */ new Map(), this.elementsModelMap = /* @__PURE__ */ new Map(), this.nodeMoveRules = [], this.nodeResizeRules = [], this.nodes = [], this.edges = [], this.overlapMode = _e.DEFAULT, this.gridSize = 1, this.partial = !1, this.waitCleanEffects = [];
      var i = e.container, a = e.partial, s = e.background, l = s === void 0 ? {} : s, u = e.grid, d = e.idGenerator, f = e.edgeGenerator, c = e.animation, p = e.customTrajectory, h = e.customTargetAnchor;
      this.themeMode = e.themeMode || "default";
      var v = Lt[this.themeMode] || Lt.default, g = Ct[this.themeMode] || Ct.default;
      this.rootEl = i, this.partial = !!a, this.background = l, this.customStyles = e.style || {}, this.theme = Ql(e.style, e.themeMode), this.grid = sr.getGridOptions(typeof u == "object" && u !== null ? V({}, v, u) : u ?? !1), this.theme.grid = I(this.grid), e.snapGrid && (this.gridSize = this.grid.size || 1), l && (this.background = I(V({}, g, l)), this.theme.background = I(V({}, g, l))), this.edgeType = e.edgeType || "polyline", this.animation = Lf(c), this.overlapMode = e.overlapMode || _e.DEFAULT, this.isMiniMap = e.isMiniMap || !1, this.width = (n = e.width) !== null && n !== void 0 ? n : this.rootEl.getBoundingClientRect().width, this.isContainerWidth = Me(e.width), this.height = (o = e.height) !== null && o !== void 0 ? o : this.rootEl.getBoundingClientRect().height, this.isContainerHeight = Me(e.height);
      var y = new ResizeObserver(Si((function(_) {
        var S, A;
        try {
          for (var x = dh(_), E = x.next(); !E.done; E = x.next()) {
            var m = E.value;
            if (m.target === t.rootEl) {
              var b = document.body.contains(t.rootEl);
              if (!b)
                return;
              t.resize(), t.eventCenter.emit("graph:resize", {
                target: t.rootEl,
                contentRect: m.contentRect
              });
            }
          }
        } catch (P) {
          S = { error: P };
        } finally {
          try {
            E && !E.done && (A = x.return) && A.call(x);
          } finally {
            if (S) throw S.error;
          }
        }
      }), 16));
      y.observe(this.rootEl), this.waitCleanEffects.push(function() {
        y.disconnect();
      }), this.eventCenter = new Cp(), this.editConfigModel = new Tp(e), this.transformModel = new uh(this.eventCenter, e), this.flowId = It(), this.idGenerator = d, this.edgeGenerator = cc(this, f), this.customTrajectory = p, this.customTargetAnchor = h;
    }
    return Object.defineProperty(r.prototype, "nodesMap", {
      get: function() {
        return this.nodes.reduce(function(e, t, n) {
          return e[t.id] = {
            index: n,
            model: t
          }, e;
        }, {});
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "edgesMap", {
      get: function() {
        return this.edges.reduce(function(e, t, n) {
          return e[t.id] = {
            index: n,
            model: t
          }, e;
        }, {});
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "modelsMap", {
      get: function() {
        return Te(Te([], ye(this.nodes), !1), ye(this.edges), !1).reduce(function(e, t) {
          return e[t.id] = t, e;
        }, {});
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "sortElements", {
      /**
       * 基于zIndex对元素进行排序。
       * todo: 性能优化
       */
      get: function() {
        for (var e = function(l) {
          return Te([], ye(l), !1).sort(function(u, d) {
            return u.zIndex - d.zIndex;
          });
        }, t = e(Te(Te([], ye(this.nodes), !1), ye(this.edges), !1)), n = [], o = [
          -vn,
          -vn
        ], i = [
          this.width + vn,
          this.height + vn
        ], a = 0; a < t.length; a++) {
          var s = t[a];
          s.visible && (!this.partial || s.isSelected || this.isElementInArea(s, o, i, !1, !1)) && n.push(s);
        }
        return n;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "textEditElement", {
      /**
       * 当前编辑的元素，低频操作，先循环找。
       */
      get: function() {
        var e = this.nodes.find(function(n) {
          return n.state === q.TEXT_EDIT;
        }), t = this.edges.find(function(n) {
          return n.state === q.TEXT_EDIT;
        });
        return e || t;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "selectElements", {
      /**
       * 当前画布所有被选中的元素
       */
      get: function() {
        var e = /* @__PURE__ */ new Map();
        return this.nodes.forEach(function(t) {
          t.isSelected && e.set(t.id, t);
        }), this.edges.forEach(function(t) {
          t.isSelected && e.set(t.id, t);
        }), e;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "selectNodes", {
      get: function() {
        var e = [];
        return this.nodes.forEach(function(t) {
          t.isSelected && e.push(t);
        }), e;
      },
      enumerable: !1,
      configurable: !0
    }), r.prototype.getAreaElement = function(e, t, n, o, i) {
      var a = this;
      n === void 0 && (n = !0), o === void 0 && (o = !0), i === void 0 && (i = !1);
      var s = [];
      return pe(Te(Te([], ye(this.nodes), !1), ye(this.edges), !1), function(l) {
        var u = a.isElementInArea(l, e, t, n, o);
        (!i || l.visible) && u && s.push(l);
      }), s;
    }, r.prototype.getModel = function(e) {
      return this.modelMap.get(e);
    }, r.prototype.getNodeModelById = function(e) {
      var t;
      return this.fakeNode && e === this.fakeNode.id ? this.fakeNode : (t = this.nodesMap[e]) === null || t === void 0 ? void 0 : t.model;
    }, r.prototype.getPointByClient = function(e) {
      var t = e.x, n = e.y, o = this.rootEl.getBoundingClientRect(), i = {
        x: t - o.left,
        y: n - o.top
      }, a = ye(this.transformModel.HtmlPointToCanvasPoint([
        i.x,
        i.y
      ]), 2), s = a[0], l = a[1], u = { x: s, y: l };
      return {
        domOverlayPosition: i,
        canvasOverlayPosition: u
      };
    }, r.prototype.isElementInArea = function(e, t, n, o, i) {
      var a;
      if (o === void 0 && (o = !0), i === void 0 && (i = !0), e.BaseType === fe.NODE) {
        e = e;
        for (var s = Ne(e), l = s.minX, u = s.minY, d = s.maxX, f = s.maxY, c = [
          {
            x: l,
            y: u
          },
          {
            x: d,
            y: u
          },
          {
            x: d,
            y: f
          },
          {
            x: l,
            y: f
          }
        ], p = i, h = 0; h < c.length; h++) {
          var v = c[h], g = v.x, y = v.y;
          if (a = ye(this.transformModel.CanvasPointToHtmlPoint([g, y]), 2), g = a[0], y = a[1], Do([g, y], t, n) !== i) {
            p = !i;
            break;
          }
        }
        return p;
      }
      if (e.BaseType === fe.EDGE) {
        e = e;
        var _ = e.startPoint, S = e.endPoint, A = this.transformModel.CanvasPointToHtmlPoint([
          _.x,
          _.y
        ]), x = this.transformModel.CanvasPointToHtmlPoint([
          S.x,
          S.y
        ]), E = Do(A, t, n), m = Do(x, t, n);
        return o ? E && m : E || m;
      }
      return !1;
    }, r.prototype.graphDataToModel = function(e) {
      var t = this;
      if (!e) {
        this.clearData();
        return;
      }
      if (this.elementsModelMap.clear(), this.nodeModelMap.clear(), this.edgeModelMap.clear(), e.nodes ? this.nodes = ht(e.nodes, function(o) {
        var i = t.getModelAfterSnapToGrid(o);
        return t.elementsModelMap.set(i.id, i), t.nodeModelMap.set(i.id, i), i;
      }) : this.nodes = [], e.edges) {
        var n = this.edgeType;
        this.edges = ht(e.edges, function(o) {
          var i, a = t.getModel((i = o.type) !== null && i !== void 0 ? i : n);
          if (!a)
            throw new Error("找不到".concat(o.type, "对应的边。"));
          var s = new a(o, t);
          return t.edgeModelMap.set(s.id, s), t.elementsModelMap.set(s.id, s), s;
        });
      } else
        this.edges = [];
    }, r.prototype.modelToGraphData = function() {
      var e = [];
      this.edges.forEach(function(n) {
        var o = n.getData();
        o && !n.virtual && e.push(o);
      });
      var t = [];
      return this.nodes.forEach(function(n) {
        var o = n.getData();
        o && !n.virtual && t.push(o);
      }), {
        nodes: t,
        edges: e
      };
    }, r.prototype.modelToHistoryData = function() {
      for (var e = !1, t = [], n = 0; n < this.nodes.length; n++) {
        var o = this.nodes[n];
        if (o.isDragging) {
          e = !0;
          break;
        } else
          t.push(o.getHistoryData());
      }
      if (e)
        return !1;
      for (var i = !1, a = [], s = 0; s < this.edges.length; s++) {
        var l = this.edges[s];
        if (l.isDragging) {
          i = !0;
          break;
        }
        l.virtual || a.push(l.getHistoryData());
      }
      return i ? !1 : {
        nodes: t,
        edges: a
      };
    }, r.prototype.getEdgeModelById = function(e) {
      var t;
      return (t = this.edgesMap[e]) === null || t === void 0 ? void 0 : t.model;
    }, r.prototype.getElement = function(e) {
      return this.modelsMap[e];
    }, r.prototype.getNodeEdges = function(e) {
      for (var t = [], n = 0; n < this.edges.length; n++) {
        var o = this.edges[n], i = o.sourceNodeId === e, a = o.targetNodeId === e;
        (i || a) && t.push(o);
      }
      return t;
    }, r.prototype.getSelectElements = function(e) {
      e === void 0 && (e = !0);
      var t = this.selectElements, n = {
        nodes: [],
        edges: []
      };
      return t.forEach(function(o) {
        if (o.BaseType === fe.NODE && n.nodes.push(o.getData()), o.BaseType === fe.EDGE) {
          var i = o.getData(), a = t.get(i.sourceNodeId) && t.get(i.targetNodeId);
          (e || a) && n.edges.push(i);
        }
      }), n;
    }, r.prototype.updateAttributes = function(e, t) {
      var n = this.getElement(e);
      n?.updateAttributes(t);
    }, r.prototype.changeNodeId = function(e, t) {
      return t || (t = It()), this.nodesMap[t] ? (console.warn("当前流程图已存在节点".concat(t, ", 修改失败")), "") : this.nodesMap[e] ? (this.edges.forEach(function(n) {
        n.sourceNodeId === e && (n.sourceNodeId = t), n.targetNodeId === e && (n.targetNodeId = t);
      }), this.nodesMap[e].model.id = t, this.nodesMap[t] = this.nodesMap[e], t) : (console.warn("当前流程图找不到节点".concat(e, ", 修改失败")), "");
    }, r.prototype.changeEdgeId = function(e, t) {
      return t || (t = It()), this.edgesMap[t] ? (console.warn("当前流程图已存在边: ".concat(t, ", 修改失败")), "") : this.edgesMap[e] ? (this.edges.forEach(function(n) {
        n.id === e && n.changeEdgeId(t);
      }), t) : (console.warn("当前流程图找不到边: ".concat(t, ", 修改失败")), "");
    }, r.prototype.getTextModel = function(e) {
      var t = this.editConfigModel, n = t.textMode, o = t.nodeTextMode, i = t.edgeTextMode;
      if (e.BaseType === fe.NODE)
        return e.textMode || o || n || Xe.TEXT;
      if (e.BaseType === fe.EDGE)
        return e.textMode || i || n || Xe.TEXT;
    }, r.prototype.setOverlapMode = function(e) {
      this.overlapMode = e, this.eventCenter.emit("overlap:change", {
        overlapMode: e
      });
    }, r.prototype.setTextMode = function(e, t) {
      this.editConfigModel.updateEditConfig({ textMode: e });
    }, r.prototype.setFakeNode = function(e) {
      this.fakeNode = e;
    }, r.prototype.removeFakeNode = function() {
      this.fakeNode = null;
    }, r.prototype.setModel = function(e, t) {
      return this.modelMap.set(e, t);
    }, r.prototype.toFront = function(e) {
      var t, n, o, i = ((t = this.nodesMap[e]) === null || t === void 0 ? void 0 : t.model) || ((n = this.edgesMap[e]) === null || n === void 0 ? void 0 : n.model);
      if (i) {
        if (this.overlapMode === _e.STATIC)
          return;
        if (this.overlapMode === _e.INCREASE) {
          this.setElementZIndex(e, "top");
          return;
        }
        (o = this.topElement) === null || o === void 0 || o.setZIndex(), i.setZIndex(Uf), this.topElement = i;
      }
    }, r.prototype.setElementZIndex = function(e, t) {
      var n, o, i = ((n = this.nodesMap[e]) === null || n === void 0 ? void 0 : n.model) || ((o = this.edgesMap[e]) === null || o === void 0 ? void 0 : o.model);
      if (i) {
        var a = void 0;
        typeof t == "number" ? a = t : (t === "top" && (a = Qr()), t === "bottom" && (a = cp())), i.setZIndex(a);
      }
    }, r.prototype.deleteNode = function(e) {
      var t = this.nodesMap[e].model, n = t.getData();
      this.deleteEdgeBySource(e), this.deleteEdgeByTarget(e), this.nodes.splice(this.nodesMap[e].index, 1), this.eventCenter.emit(C.NODE_DELETE, {
        data: n,
        model: t
      });
    }, r.prototype.addNode = function(e, t, n) {
      t === void 0 && (t = C.NODE_ADD);
      var o = Se(e), i = o.id;
      i && this.nodesMap[i] && delete o.id;
      var a = this.getModelAfterSnapToGrid(o);
      this.nodes.push(a);
      var s = a.getData(), l = { data: s };
      return n && (l.e = n), this.eventCenter.emit(t, l), a;
    }, r.prototype.getModelAfterSnapToGrid = function(e) {
      var t = this.getModel(e.type), n = this.editConfigModel.snapGrid;
      if (!t)
        throw new Error("找不到".concat(e.type, "对应的节点，请确认是否已注册此类型节点。"));
      var o = e.x, i = e.y;
      o && i && (e.x = gr(o, this.gridSize, n), e.y = gr(i, this.gridSize, n), typeof e.text == "object" && e.text !== null && (e.text.x += e.x - o, e.text.y += e.y - i));
      var a = new t(e, this);
      return this.nodeModelMap.set(a.id, a), this.elementsModelMap.set(a.id, a), a;
    }, r.prototype.cloneNode = function(e) {
      var t = this.getNodeModelById(e), n = t?.getData();
      if (n) {
        n.x += 30, n.y += 30, n.id = "", typeof n.text == "object" && n.text !== null && (n.text.x += 30, n.text.y += 30);
        var o = this.addNode(n);
        return o.setSelected(!0), t?.setSelected(!1), o.getData();
      }
    }, r.prototype.moveNode = function(e, t, n, o) {
      var i;
      o === void 0 && (o = !1);
      var a = this.nodesMap[e];
      if (!a) {
        console.warn("不存在id为".concat(e, "的节点"));
        return;
      }
      var s = a.model;
      i = ye(s.getMoveDistance(t, n, o), 2), t = i[0], n = i[1], this.moveEdge(e, t, n);
    }, r.prototype.moveNode2Coordinate = function(e, t, n, o) {
      o === void 0 && (o = !1);
      var i = this.nodesMap[e];
      if (!i) {
        console.warn("不存在id为".concat(e, "的节点"));
        return;
      }
      var a = i.model, s = a.x, l = a.y, u = t - s, d = n - l;
      this.moveNode(e, u, d, o);
    }, r.prototype.editText = function(e) {
      this.setElementStateById(e, q.TEXT_EDIT);
    }, r.prototype.addEdge = function(e) {
      var t = Se(e), n = t.type;
      n || (n = this.edgeType), t.id && this.edgesMap[t.id] && (delete t.id, delete t.sourceAnchorId, delete t.targetAnchorId);
      var o = this.getModel(n);
      if (!o)
        throw new Error("找不到".concat(n, "对应的边，请确认是否已注册此类型边。"));
      var i = new o(we(we({}, t), { type: n }), this);
      this.edgeModelMap.set(i.id, i), this.elementsModelMap.set(i.id, i);
      var a = i.getData();
      return this.edges.push(i), this.eventCenter.emit(C.EDGE_ADD, { data: a }), i;
    }, r.prototype.moveEdge = function(e, t, n) {
      for (var o = 0; o < this.edges.length; o++) {
        var i = this.edges[o], a = i.textPosition, s = a.x, l = a.y, u = this.edges[o].sourceNodeId === e, d = this.edges[o].targetNodeId === e;
        u && i.moveStartPoint(t, n), d && i.moveEndPoint(t, n), (u || d) && this.handleEdgeTextMove(i, s, l);
      }
    }, r.prototype.handleEdgeTextMove = function(e, t, n) {
      var o;
      if (e.customTextPosition) {
        e.resetTextPosition();
        return;
      }
      if (e.modelType === G.POLYLINE_EDGE && (!((o = e.text) === null || o === void 0) && o.value)) {
        var i = e.text, a = zl(i, e.points);
        e.moveText(a.x - i.x, a.y - i.y);
      }
      var s = e.textPosition, l = s.x, u = s.y;
      e.moveText(l - t, u - n);
    }, r.prototype.deleteEdgeBySourceAndTarget = function(e, t) {
      for (var n = 0; n < this.edges.length; n++)
        if (this.edges[n].sourceNodeId === e && this.edges[n].targetNodeId === t) {
          var o = this.edges[n].getData();
          this.edges.splice(n, 1), n--, this.eventCenter.emit(C.EDGE_DELETE, { data: o });
        }
    }, r.prototype.deleteEdgeById = function(e) {
      var t = this.edgesMap[e];
      if (t) {
        var n = this.edgesMap[e].index, o = this.edgesMap[e].model.getData();
        this.edges.splice(n, 1), this.eventCenter.emit(C.EDGE_DELETE, { data: o });
      }
    }, r.prototype.deleteEdgeBySource = function(e) {
      for (var t = 0; t < this.edges.length; t++)
        if (this.edges[t].sourceNodeId === e) {
          var n = this.edges[t].getData();
          this.edges.splice(t, 1), t--, this.eventCenter.emit(C.EDGE_DELETE, { data: n });
        }
    }, r.prototype.deleteEdgeByTarget = function(e) {
      for (var t = 0; t < this.edges.length; t++)
        if (this.edges[t].targetNodeId === e) {
          var n = this.edges[t].getData();
          this.edges.splice(t, 1), t--, this.eventCenter.emit(C.EDGE_DELETE, { data: n });
        }
    }, r.prototype.setElementStateById = function(e, t, n) {
      this.nodes.forEach(function(o) {
        o.id === e ? o.setElementState(t, n) : o.setElementState(q.DEFAULT);
      }), this.edges.forEach(function(o) {
        o.id === e ? o.setElementState(t, n) : o.setElementState(q.DEFAULT);
      });
    }, r.prototype.updateText = function(e, t) {
      var n = kt(Te(Te([], ye(this.nodes), !1), ye(this.edges), !1), function(o) {
        return o.id === e;
      });
      n?.updateText(t);
    }, r.prototype.selectNodeById = function(e, t) {
      var n;
      t === void 0 && (t = !1), t || this.clearSelectElements();
      var o = (n = this.nodesMap[e]) === null || n === void 0 ? void 0 : n.model;
      o?.setSelected(!0);
    }, r.prototype.selectEdgeById = function(e, t) {
      var n;
      t === void 0 && (t = !1), t || this.clearSelectElements();
      var o = (n = this.edgesMap[e]) === null || n === void 0 ? void 0 : n.model;
      o?.setSelected(!0);
    }, r.prototype.selectElementById = function(e, t) {
      t === void 0 && (t = !1), t || this.clearSelectElements();
      var n = this.getElement(e);
      n?.setSelected(!0);
    }, r.prototype.deselectElementById = function(e) {
      var t = this.getElement(e);
      t && t.setSelected(!1);
    }, r.prototype.clearSelectElements = function() {
      var e;
      this.selectElements.forEach(function(t) {
        t?.setSelected(!1), t?.setHovered(!1);
      }), this.selectElements.clear(), [_e.DEFAULT, _e.EDGE_TOP].includes(this.overlapMode) && ((e = this.topElement) === null || e === void 0 || e.setZIndex());
    }, r.prototype.moveNodes = function(e, t, n, o) {
      var i, a, s, l = this;
      o === void 0 && (o = !1);
      for (var u = e.reduce(function(S, A) {
        var x, E = (x = l.nodesMap[A]) === null || x === void 0 ? void 0 : x.model;
        return E && (S[A] = E.getMoveDistance(t, n, o)), S;
      }, {}), d = 0; d < this.edges.length; d++) {
        var f = this.edges[d], c = f.textPosition, p = c.x, h = c.y, v = u[f.sourceNodeId], g = u[f.targetNodeId], y = void 0, _ = void 0;
        v && g && f.modelType === G.POLYLINE_EDGE ? (i = ye(v, 2), y = i[0], _ = i[1], f.updatePointsList(y, _)) : (v && (a = ye(v, 2), y = a[0], _ = a[1], f.moveStartPoint(y, _)), g && (s = ye(g, 2), y = s[0], _ = s[1], f.moveEndPoint(y, _))), (v || g) && this.handleEdgeTextMove(f, p, h);
      }
    }, r.prototype.addNodeMoveRules = function(e) {
      this.nodeMoveRules.includes(e) || this.nodeMoveRules.push(e);
    }, r.prototype.addNodeResizeRules = function(e) {
      this.nodeResizeRules.includes(e) || this.nodeResizeRules.push(e);
    }, r.prototype.setDefaultEdgeType = function(e) {
      this.edgeType = e;
    }, r.prototype.changeNodeType = function(e, t) {
      var n = this.getNodeModelById(e);
      if (!n) {
        console.warn("找不到id为".concat(e, "的节点"));
        return;
      }
      var o = n.getData();
      o.type = t;
      var i = this.getModel(t);
      if (!i)
        throw new Error("找不到".concat(t, "对应的节点，请确认是否已注册此类型节点。"));
      var a = new i(o, this);
      this.nodes.splice(this.nodesMap[e].index, 1, a);
      var s = this.getNodeEdges(e);
      s.forEach(function(l) {
        if (l.sourceNodeId === e) {
          var u = rs(a, l.startPoint, a.width, a.height);
          l.updateStartPoint(u);
        }
        if (l.targetNodeId === e) {
          var u = rs(a, l.endPoint, a.width, a.height);
          l.updateEndPoint(u);
        }
      });
    }, r.prototype.changeEdgeType = function(e, t) {
      var n = this.getEdgeModelById(e);
      if (!n) {
        console.warn("找不到id为".concat(e, "的边"));
        return;
      }
      if (n.type !== t) {
        var o = n.getData();
        o.type = t;
        var i = this.getModel(t);
        if (!i)
          throw new Error("找不到".concat(t, "对应的节点，请确认是否已注册此类型节点。"));
        delete o.pointsList;
        var a = new i(o, this);
        this.edges.splice(this.edgesMap[e].index, 1, a);
      }
    }, r.prototype.getNodeIncomingEdge = function(e) {
      var t = [];
      return this.edges.forEach(function(n) {
        n.targetNodeId === e && t.push(n);
      }), t;
    }, r.prototype.getNodeOutgoingEdge = function(e) {
      var t = [];
      return this.edges.forEach(function(n) {
        n.sourceNodeId === e && t.push(n);
      }), t;
    }, r.prototype.getAnchorIncomingEdge = function(e) {
      var t = [];
      return this.edges.forEach(function(n) {
        n.targetAnchorId === e && t.push(n);
      }), t;
    }, r.prototype.getAnchorOutgoingEdge = function(e) {
      var t = [];
      return this.edges.forEach(function(n) {
        n.sourceAnchorId === e && t.push(n);
      }), t;
    }, r.prototype.getNodeIncomingNode = function(e) {
      var t = this, n = [];
      return this.edges.forEach(function(o) {
        var i;
        o.targetNodeId === e && n.push((i = t.nodesMap[o.sourceNodeId]) === null || i === void 0 ? void 0 : i.model);
      }), n;
    }, r.prototype.getNodeOutgoingNode = function(e) {
      var t = this, n = [];
      return this.edges.forEach(function(o) {
        o.sourceNodeId === e && n.push(t.nodesMap[o.targetNodeId].model);
      }), n;
    }, r.prototype.setTheme = function(e, t) {
      var n;
      if (t && (this.themeMode = t, Ct[t] && this.updateBackgroundOptions(we(we({}, typeof this.background == "object" ? this.background : {}), Ct[t])), Lt[t] && this.updateGridOptions(sr.getGridOptions(we(we({}, this.grid), Lt[t])))), e.background && this.updateBackgroundOptions(e.background), e.grid) {
        var o = sr.getGridOptions((n = e.grid) !== null && n !== void 0 ? n : !1);
        this.updateGridOptions(o);
      }
      this.theme = up(we(we({}, this.customStyles), e), t), this.customStyles = we(we({}, this.customStyles), e);
    }, r.prototype.getTheme = function() {
      var e = this, t = e.background, n = e.grid, o = we(we({}, I(this.theme)), { background: t, grid: n });
      return o;
    }, r.prototype.updateGridOptions = function(e) {
      wi(this.grid, e);
    }, r.prototype.updateGridSize = function(e) {
      this.gridSize = e;
    }, r.prototype.updateBackgroundOptions = function(e) {
      Go(e) || Go(this.background) ? this.background = e : this.background = we(we({}, this.background), e);
    }, r.prototype.resize = function(e, t) {
      if (this.rootEl) {
        var n = document.body.contains(this.rootEl);
        if (n) {
          var o = this.rootEl.offsetParent !== null;
          if (o)
            try {
              this.width = e ?? this.rootEl.getBoundingClientRect().width, this.isContainerWidth = Me(e), this.height = t ?? this.rootEl.getBoundingClientRect().height, this.isContainerHeight = Me(t), o && (!this.width || !this.height) && console.warn("渲染画布的时候无法获取画布宽高，请确认在container已挂载到DOM。@see https://github.com/didi/LogicFlow/issues/675");
            } catch (i) {
              console.warn("获取画布宽高时发生错误:", i);
            }
        }
      }
    }, r.prototype.clearData = function() {
      this.nodes = [], this.edges = [], this.edgeModelMap.clear(), this.nodeModelMap.clear(), this.elementsModelMap.clear();
    }, r.prototype.getVirtualRectSize = function() {
      var e = this.nodes, t = [], n = [];
      e.forEach(function(c) {
        var p = c.x, h = c.y, v = c.width, g = c.height, y = c.getNodeStyle().strokeWidth, _ = y === void 0 ? 0 : y, S = p + v / 2 + _, A = p - v / 2 - _, x = h + g / 2 + _, E = h - g / 2 - _;
        t = t.concat([S, A].filter(function(m) {
          return !Number.isNaN(m);
        })), n = n.concat([x, E].filter(function(m) {
          return !Number.isNaN(m);
        }));
      });
      var o = Math.min.apply(Math, Te([], ye(t), !1)), i = Math.max.apply(Math, Te([], ye(t), !1)), a = Math.min.apply(Math, Te([], ye(n), !1)), s = Math.max.apply(Math, Te([], ye(n), !1)), l = i - o || 0, u = s - a || 0, d = o + l / 2, f = a + u / 2;
      return {
        width: l,
        height: u,
        x: d,
        y: f
      };
    }, r.prototype.translateCenter = function() {
      var e = this, t = e.nodes, n = e.width, o = e.height, i = e.rootEl, a = e.transformModel;
      if (t.length) {
        var s = n || i.clientWidth, l = o || i.clientHeight, u = this.getVirtualRectSize(), d = u.x, f = u.y;
        a.focusOn(d, f, s, l);
      }
    }, r.prototype.fitView = function(e, t) {
      e === void 0 && (e = 20), t === void 0 && (t = 20);
      var n = this, o = n.nodes, i = n.width, a = n.height, s = n.rootEl, l = n.transformModel;
      if (o.length) {
        var u = i || s.clientWidth, d = a || s.clientHeight, f = this.getVirtualRectSize(), c = f.width, p = f.height, h = f.x, v = f.y, g = (c + t) / u, y = (p + e) / d, _ = 1 / Math.max(g, y), S = [u / 2, d / 2];
        l.zoom(_, S), l.focusOn(h, v, u, d);
      }
    }, r.prototype.openEdgeAnimation = function(e) {
      var t = this.getEdgeModelById(e);
      t?.openEdgeAnimation();
    }, r.prototype.closeEdgeAnimation = function(e) {
      var t = this.getEdgeModelById(e);
      t?.closeEdgeAnimation();
    }, r.prototype.getPartial = function() {
      return this.partial;
    }, r.prototype.setPartial = function(e) {
      this.partial = e;
    }, r.prototype.destroy = function() {
      try {
        this.waitCleanEffects.forEach(function(e) {
          e();
        });
      } catch (e) {
        console.warn("error on destroy GraphModel", e);
      }
      this.waitCleanEffects.length = 0, this.eventCenter.destroy();
    }, N([
      M
    ], r.prototype, "width", void 0), N([
      M
    ], r.prototype, "height", void 0), N([
      M
    ], r.prototype, "theme", void 0), N([
      M
    ], r.prototype, "themeMode", void 0), N([
      M
    ], r.prototype, "grid", void 0), N([
      M
    ], r.prototype, "edgeType", void 0), N([
      M
    ], r.prototype, "nodes", void 0), N([
      M
    ], r.prototype, "edges", void 0), N([
      M
    ], r.prototype, "fakeNode", void 0), N([
      M
    ], r.prototype, "overlapMode", void 0), N([
      M
    ], r.prototype, "background", void 0), N([
      M
    ], r.prototype, "gridSize", void 0), N([
      M
    ], r.prototype, "transformModel", void 0), N([
      M
    ], r.prototype, "editConfigModel", void 0), N([
      M
    ], r.prototype, "partial", void 0), N([
      te
    ], r.prototype, "nodesMap", null), N([
      te
    ], r.prototype, "edgesMap", null), N([
      te
    ], r.prototype, "modelsMap", null), N([
      te
    ], r.prototype, "sortElements", null), N([
      te
    ], r.prototype, "textEditElement", null), N([
      te
    ], r.prototype, "selectElements", null), N([
      te
    ], r.prototype, "selectNodes", null), N([
      O
    ], r.prototype, "setOverlapMode", null), N([
      O
    ], r.prototype, "setTextMode", null), N([
      O
    ], r.prototype, "setFakeNode", null), N([
      O
    ], r.prototype, "removeFakeNode", null), N([
      O
    ], r.prototype, "setModel", null), N([
      O
    ], r.prototype, "toFront", null), N([
      O
    ], r.prototype, "setElementZIndex", null), N([
      O
    ], r.prototype, "deleteNode", null), N([
      O
    ], r.prototype, "addNode", null), N([
      O
    ], r.prototype, "cloneNode", null), N([
      O
    ], r.prototype, "moveNode", null), N([
      O
    ], r.prototype, "moveNode2Coordinate", null), N([
      O
    ], r.prototype, "editText", null), N([
      O
    ], r.prototype, "addEdge", null), N([
      O
    ], r.prototype, "moveEdge", null), N([
      O
    ], r.prototype, "deleteEdgeBySourceAndTarget", null), N([
      O
    ], r.prototype, "deleteEdgeById", null), N([
      O
    ], r.prototype, "deleteEdgeBySource", null), N([
      O
    ], r.prototype, "deleteEdgeByTarget", null), N([
      O
    ], r.prototype, "setElementStateById", null), N([
      O
    ], r.prototype, "updateText", null), N([
      O
    ], r.prototype, "selectNodeById", null), N([
      O
    ], r.prototype, "selectEdgeById", null), N([
      O
    ], r.prototype, "selectElementById", null), N([
      O
    ], r.prototype, "deselectElementById", null), N([
      O
    ], r.prototype, "clearSelectElements", null), N([
      O
    ], r.prototype, "moveNodes", null), N([
      O
    ], r.prototype, "setDefaultEdgeType", null), N([
      O
    ], r.prototype, "changeNodeType", null), N([
      O
    ], r.prototype, "changeEdgeType", null), N([
      O
    ], r.prototype, "getNodeIncomingEdge", null), N([
      O
    ], r.prototype, "getNodeOutgoingEdge", null), N([
      O
    ], r.prototype, "getAnchorIncomingEdge", null), N([
      O
    ], r.prototype, "getAnchorOutgoingEdge", null), N([
      O
    ], r.prototype, "getNodeIncomingNode", null), N([
      O
    ], r.prototype, "getNodeOutgoingNode", null), N([
      O
    ], r.prototype, "setTheme", null), N([
      O
    ], r.prototype, "getTheme", null), N([
      O
    ], r.prototype, "resize", null), N([
      O
    ], r.prototype, "clearData", null), N([
      O
    ], r.prototype, "translateCenter", null), N([
      O
    ], r.prototype, "fitView", null), N([
      O
    ], r.prototype, "openEdgeAnimation", null), N([
      O
    ], r.prototype, "closeEdgeAnimation", null), N([
      O
    ], r.prototype, "setPartial", null), r;
  })()
), Tt = function() {
  return Tt = Object.assign || function(r) {
    for (var e, t = 1, n = arguments.length; t < n; t++) {
      e = arguments[t];
      for (var o in e) Object.prototype.hasOwnProperty.call(e, o) && (r[o] = e[o]);
    }
    return r;
  }, Tt.apply(this, arguments);
}, Ar = function(r, e, t, n) {
  var o = arguments.length, i = o < 3 ? e : n === null ? n = Object.getOwnPropertyDescriptor(e, t) : n, a;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") i = Reflect.decorate(r, e, t, n);
  else for (var s = r.length - 1; s >= 0; s--) (a = r[s]) && (i = (o < 3 ? a(i) : o > 3 ? a(e, t, i) : a(e, t)) || i);
  return o > 3 && i && Object.defineProperty(e, t, i), i;
}, ch = (
  /** @class */
  (function() {
    function r(e, t) {
      t === void 0 && (t = 1), this.isShowHorizontal = !1, this.isShowVertical = !1, this.position = {
        x: 0,
        y: 0
      }, this.graphModel = e, this.epsilon = t;
    }
    return r.prototype.getStyle = function() {
      return Tt({}, this.graphModel.theme.snapline);
    }, r.prototype.getCenterSnapLine = function(e, t) {
      for (var n = e.x, o = e.y, i = !1, a = !1, s = 0; s < t.length; s++) {
        var l = t[s];
        if (l.id !== e.id && (Ge(n, l.x, this.epsilon) && (i = !0), Ge(o, l.y, this.epsilon) && (a = !0), i && a))
          break;
      }
      return {
        isShowVertical: i,
        isShowHorizontal: a,
        position: {
          x: n,
          y: o
        }
      };
    }, r.prototype.getHorizontalSnapline = function(e, t) {
      var n = !1, o = 0, i = e.id, a;
      if (i) {
        var s = this.graphModel.fakeNode;
        if (s && s.id === i)
          a = Ne(s);
        else {
          var l = this.graphModel.getNodeModelById(i);
          l && (a = Ne(l));
        }
      }
      for (var u = 0; u < t.length; u++) {
        var d = t[u];
        if (d.id !== e.id) {
          var f = Ne(d);
          if (Ge(f.minY, a?.minY, this.epsilon) || Ge(f.maxY, a?.minY, this.epsilon)) {
            n = !0, o = a.minY;
            break;
          }
          if (Ge(f.minY, a?.maxY, this.epsilon) || Ge(f.maxY, a?.maxY, this.epsilon)) {
            n = !0, o = a.maxY;
            break;
          }
        }
      }
      return {
        isShowHorizontal: n,
        isShowVertical: this.isShowVertical,
        position: Tt(Tt({}, this.position), { y: o })
      };
    }, r.prototype.getVerticalSnapline = function(e, t) {
      var n = !1, o = 0, i = e.id, a;
      if (i) {
        var s = this.graphModel.fakeNode;
        if (s && s.id === i)
          a = Ne(s);
        else {
          var l = this.graphModel.getNodeModelById(i);
          l && (a = Ne(l));
        }
      }
      for (var u = 0; u < t.length; u++) {
        var d = t[u];
        if (d.id !== e.id) {
          var f = Ne(d);
          if (Ge(f.minX, a?.minX, this.epsilon)) {
            n = !0, o = a.minX;
            break;
          }
          if (Ge(f.minX, a?.minX, this.epsilon) || Ge(f.maxX, a?.minX, this.epsilon)) {
            n = !0, o = a.minX;
            break;
          }
          if (Ge(f.minX, a?.maxX, this.epsilon) || Ge(f.maxX, a?.maxX, this.epsilon)) {
            n = !0, o = a.maxX;
            break;
          }
        }
      }
      return {
        isShowHorizontal: this.isShowHorizontal,
        isShowVertical: n,
        position: Tt(Tt({}, this.position), { x: o })
      };
    }, r.prototype.getSnapLinePosition = function(e, t) {
      var n = this.getCenterSnapLine(e, t), o = n.isShowHorizontal, i = n.isShowVertical;
      if (!o) {
        var a = this.getHorizontalSnapline(e, t);
        a.isShowHorizontal && (n.isShowHorizontal = a.isShowHorizontal, n.position.y = a.position.y);
      }
      if (!i) {
        var s = this.getVerticalSnapline(e, t);
        s.isShowVertical && (n.isShowVertical = s.isShowVertical, n.position.x = s.position.x);
      }
      return n;
    }, r.prototype.setSnaplineInfo = function(e) {
      var t = e.isShowHorizontal, n = e.isShowVertical, o = e.position;
      this.position = o, this.isShowHorizontal = t, this.isShowVertical = n;
    }, r.prototype.clearSnapline = function() {
      this.position = {
        x: 0,
        y: 0
      }, this.isShowHorizontal = !1, this.isShowVertical = !1;
    }, r.prototype.setNodeSnapLine = function(e) {
      var t = this.graphModel.nodes, n = this.getSnapLinePosition(e, t);
      this.setSnaplineInfo(n);
    }, Ar([
      M
    ], r.prototype, "isShowHorizontal", void 0), Ar([
      M
    ], r.prototype, "isShowVertical", void 0), Ar([
      M
    ], r.prototype, "position", void 0), Ar([
      O
    ], r.prototype, "clearSnapline", null), Ar([
      O
    ], r.prototype, "setNodeSnapLine", null), r;
  })()
);
function Ge(r, e, t) {
  return Math.abs(r - e) <= t;
}
var ph = /* @__PURE__ */ (function() {
  var r = function(e, t) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, o) {
      n.__proto__ = o;
    } || function(n, o) {
      for (var i in o) Object.prototype.hasOwnProperty.call(o, i) && (n[i] = o[i]);
    }, r(e, t);
  };
  return function(e, t) {
    if (typeof t != "function" && t !== null)
      throw new TypeError("Class extends value " + String(t) + " is not a constructor or null");
    r(e, t);
    function n() {
      this.constructor = e;
    }
    e.prototype = t === null ? Object.create(t) : (n.prototype = t.prototype, new n());
  };
})(), hh = function(r, e, t, n) {
  var o = arguments.length, i = o < 3 ? e : n === null ? n = Object.getOwnPropertyDescriptor(e, t) : n, a;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") i = Reflect.decorate(r, e, t, n);
  else for (var s = r.length - 1; s >= 0; s--) (a = r[s]) && (i = (o < 3 ? a(i) : o > 3 ? a(e, t, i) : a(e, t)) || i);
  return o > 3 && i && Object.defineProperty(e, t, i), i;
}, vh = function(r, e) {
  var t = typeof Symbol == "function" && r[Symbol.iterator];
  if (!t) return r;
  var n = t.call(r), o, i = [], a;
  try {
    for (; (e === void 0 || e-- > 0) && !(o = n.next()).done; ) i.push(o.value);
  } catch (s) {
    a = { error: s };
  } finally {
    try {
      o && !o.done && (t = n.return) && t.call(n);
    } finally {
      if (a) throw a.error;
    }
  }
  return i;
}, yh = function(r, e, t) {
  if (t || arguments.length === 2) for (var n = 0, o = e.length, i; n < o; n++)
    (i || !(n in e)) && (i || (i = Array.prototype.slice.call(e, 0, n)), i[n] = e[n]);
  return r.concat(i || Array.prototype.slice.call(e));
}, gh = (
  /** @class */
  (function(r) {
    ph(e, r);
    function e() {
      var t = r.apply(this, yh([], vh(arguments), !1)) || this;
      return t.handleResize = function() {
        var n = t.props, o = n.graphModel, i = n.options, a = o.width, s = o.height, l = o.isContainerWidth, u = o.isContainerHeight, d = a, f = s, c = !1;
        l && (d = void 0, c = !0), u && (f = void 0, c = !0), c && o.resize(d, f), i.width = a, i.height = s;
      }, t.throttleResize = Fu(t.handleResize, 200), t;
    }
    return e.prototype.componentDidMount = function() {
      window.addEventListener("resize", this.throttleResize);
    }, e.prototype.componentDidUpdate = function() {
      var t = this.props.graphModel.modelToGraphData();
      this.props.graphModel.eventCenter.emit(C.GRAPH_UPDATED, { data: t });
    }, e.prototype.componentWillUnmount = function() {
      window.removeEventListener("resize", this.throttleResize);
    }, e.prototype.getComponent = function(t, n, o) {
      o === void 0 && (o = "canvas-overlay");
      var i = this.props.getView, a = i(t.type);
      return a ? w(a, { model: t, graphModel: n, overlay: o }, t.id) : null;
    }, e.prototype.render = function() {
      var t = this, n = this.props, o = n.graphModel, i = n.tool, a = n.options, s = n.dnd, l = n.snaplineModel, u = {};
      a.width && (u.width = "".concat(o.width, "px")), a.height && (u.height = "".concat(o.height, "px"));
      var d = o.fakeNode, f = o.editConfigModel, c = o.background, p = f.adjustEdge;
      return w("div", { className: "lf-graph", "flow-id": o.flowId, style: u, children: [w(Rp, { graphModel: o, dnd: s, children: [w("g", { className: "lf-base", children: ht(o.sortElements, function(h) {
        return t.getComponent(h, o);
      }) }), d ? this.getComponent(d, o) : ""] }), w(Zp, { graphModel: o, children: [w(Qp, { graphModel: o }), p ? w(Bp, { graphModel: o }) : "", a.snapline !== !1 ? w(rh, { snaplineModel: l }) : ""] }), w(ih, { graphModel: o, tool: i }), c && w(Fp, { background: c }), w(sr, { graphModel: o })] });
    }, e = hh([
      je
    ], e), e;
  })($)
), _h = /* @__PURE__ */ (function() {
  var r = function(e, t) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, o) {
      n.__proto__ = o;
    } || function(n, o) {
      for (var i in o) Object.prototype.hasOwnProperty.call(o, i) && (n[i] = o[i]);
    }, r(e, t);
  };
  return function(e, t) {
    if (typeof t != "function" && t !== null)
      throw new TypeError("Class extends value " + String(t) + " is not a constructor or null");
    r(e, t);
    function n() {
      this.constructor = e;
    }
    e.prototype = t === null ? Object.create(t) : (n.prototype = t.prototype, new n());
  };
})(), rt = function() {
  return rt = Object.assign || function(r) {
    for (var e, t = 1, n = arguments.length; t < n; t++) {
      e = arguments[t];
      for (var o in e) Object.prototype.hasOwnProperty.call(e, o) && (r[o] = e[o]);
    }
    return r;
  }, rt.apply(this, arguments);
}, mh = function(r, e) {
  var t = typeof Symbol == "function" && r[Symbol.iterator];
  if (!t) return r;
  var n = t.call(r), o, i = [], a;
  try {
    for (; (e === void 0 || e-- > 0) && !(o = n.next()).done; ) i.push(o.value);
  } catch (s) {
    a = { error: s };
  } finally {
    try {
      o && !o.done && (t = n.return) && t.call(n);
    } finally {
      if (a) throw a.error;
    }
  }
  return i;
}, xh = (
  /** @class */
  (function(r) {
    _h(e, r);
    function e() {
      var t = r.call(this) || this;
      return t.onDragStart = function(n) {
        var o = n.event, i = t.props, a = i.anchorData, s = i.nodeModel, l = i.graphModel;
        l.selectNodeById(s.id), s.autoToFront && l.toFront(s.id), l.eventCenter.emit(C.ANCHOR_DRAGSTART, {
          data: a,
          e: o,
          nodeModel: s
        }), t.setState({
          startX: a.x,
          startY: a.y,
          endX: a.x,
          endY: a.y
        });
      }, t.onDragging = function(n) {
        var o = n.event, i = t.props, a = i.graphModel, s = i.nodeModel, l = i.anchorData, u = a.transformModel, d = a.eventCenter, f = a.width, c = a.height, p = a.editConfigModel, h = p.autoExpand, v = p.stopMoveGraph;
        if (o) {
          var g = o.clientX, y = o.clientY, _ = a.getPointByClient({
            x: g,
            y
          }), S = _.domOverlayPosition, A = S.x, x = S.y, E = _.canvasOverlayPosition, m = E.x, b = E.y;
          t.t && ro(t.t);
          var P = [], D = 10;
          A < 10 ? P = [D, 0] : A + 10 > f ? P = [-D, 0] : x < 10 ? P = [0, D] : x + 10 > c && (P = [0, -D]), t.setState({
            endX: m,
            endY: b,
            dragging: !0
          }), t.moveAnchorEnd(m, b, o), P.length > 0 && !v && h && (t.t = Kl(function() {
            var k = mh(P, 2), Y = k[0], J = k[1];
            u.translate(Y, J);
            var H = t.state, oe = H.endX, ne = H.endY;
            t.setState({
              endX: oe - Y,
              endY: ne - J
            }), t.moveAnchorEnd(oe - Y, ne - J, o);
          })), d.emit(C.ANCHOR_DRAG, {
            data: l,
            e: o,
            nodeModel: s
          });
        }
      }, t.onDragEnd = function(n) {
        var o = n.event;
        t.t && ro(t.t);
        var i = t.checkEnd(o);
        t.setState({
          startX: 0,
          startY: 0,
          endX: 0,
          endY: 0,
          dragging: !1
        }), t.sourceRuleResults.clear(), t.targetRuleResults.clear();
        var a = t.props, s = a.graphModel, l = a.nodeModel, u = a.anchorData;
        t.preTargetNode && (t.preTargetNode.setHovered(!1), t.preTargetNode = void 0), s.eventCenter.emit(C.ANCHOR_DRAGEND, {
          data: u,
          e: o,
          nodeModel: l,
          edgeModel: i ?? void 0
        });
      }, t.checkEnd = function(n) {
        var o, i = t.props, a = i.graphModel, s = i.nodeModel, l = i.anchorData, u = l.x, d = l.y, f = l.id, c = t.state, p = c.endX, h = c.endY, v = c.dragging, g = eo({
          x: p,
          y: h
        }, a);
        if (t.preTargetNode && t.preTargetNode.state !== q.DEFAULT && t.preTargetNode.setElementState(q.DEFAULT), !!v && g && g.node) {
          var y = g.node, _ = g.anchor.id, S = "".concat(s.id, "_").concat(y.id, "_").concat(_, "_").concat(f), A = t.sourceRuleResults.get(S) || {}, x = A.isAllPass, E = A.msg, m = t.targetRuleResults.get(S) || {}, b = m.isAllPass, P = m.msg;
          if (x && b) {
            y.setElementState(q.DEFAULT);
            var D = a.getNodeModelById(g.node.id), k = (o = a.edgeGenerator) === null || o === void 0 ? void 0 : o.call(a, s.getData(), D?.getData()), Y = a.addEdge(rt(rt({}, k), { sourceNodeId: s.id, sourceAnchorId: f, startPoint: {
              x: u,
              y: d
            }, targetNodeId: g.node.id, targetAnchorId: g.anchor.id, endPoint: {
              x: g.anchor.x,
              y: g.anchor.y
            } })), J = t.props.anchorData;
            return a.eventCenter.emit(C.ANCHOR_DROP, {
              data: J,
              e: n,
              nodeModel: s,
              edgeModel: Y
            }), Y;
          }
          var H = y.getData();
          return a.eventCenter.emit(C.CONNECTION_NOT_ALLOWED, {
            data: H,
            msg: P || E || "不允许添加连线"
          }), null;
        }
      }, t.sourceRuleResults = /* @__PURE__ */ new Map(), t.targetRuleResults = /* @__PURE__ */ new Map(), t.state = {
        startX: 0,
        startY: 0,
        endX: 0,
        endY: 0,
        dragging: !1
      }, t.dragHandler = new ut({
        onDragStart: t.onDragStart,
        onDragging: t.onDragging,
        onDragEnd: t.onDragEnd
      }), t;
    }
    return e.prototype.getAnchorShape = function() {
      var t = this.props, n = t.anchorData, o = t.style, i = t.node, a = i.getAnchorShape(n);
      if (a)
        return a;
      var s = n.x, l = n.y, u = rt(rt({}, o), o?.hover);
      return w("g", { children: [w(mr, rt({ className: "lf-node-anchor-hover" }, u, { x: s, y: l })), w(mr, rt({ className: "lf-node-anchor" }, o, { x: s, y: l }))] });
    }, Object.defineProperty(e.prototype, "customTrajectory", {
      get: function() {
        var t = this.props.graphModel.customTrajectory;
        return t;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(e.prototype, "relateEdges", {
      get: function() {
        var t = this.props, n = t.graphModel, o = n.getAnchorIncomingEdge, i = n.getAnchorOutgoingEdge, a = t.anchorData.id;
        return {
          incomingEdgeList: o(a),
          outgoingEdgeList: i(a)
        };
      },
      enumerable: !1,
      configurable: !0
    }), e.prototype.moveAnchorEnd = function(t, n, o) {
      var i = this.props, a = i.graphModel, s = i.nodeModel, l = i.anchorData, u = eo({
        x: t,
        y: n
      }, a);
      if (u) {
        var d = u.node, f = u.anchor.id;
        if (this.preTargetNode && this.preTargetNode !== u.node && this.preTargetNode.setElementState(q.DEFAULT), l.id === f)
          return;
        if (this.preTargetNode = d, this.validateAndSetState(d, f, u.anchor, s, l), !d.isHovered) {
          var c = d.getData();
          o && a.eventCenter.emit(C.NODE_MOUSEENTER, {
            data: c,
            e: o
          }), d.setHovered(!0);
        }
      } else if (this.preTargetNode && this.preTargetNode.state !== q.DEFAULT) {
        this.preTargetNode.setElementState(q.DEFAULT);
        var p = this.preTargetNode.getData();
        o && a.eventCenter.emit(C.NODE_MOUSELEAVE, {
          data: p,
          e: o
        }), this.preTargetNode.setHovered(!1), this.preTargetNode = void 0;
      }
    }, e.prototype.validateAndSetState = function(t, n, o, i, a) {
      var s, l, u = "".concat(i.id, "_").concat(t.id, "_").concat(n, "_").concat(a.id);
      if (!this.targetRuleResults.has(u)) {
        var d = i.isAllowConnectedAsSource(t, a, o), f = t.isAllowConnectedAsTarget(i, a, o);
        this.sourceRuleResults.set(u, to(d)), this.targetRuleResults.set(u, to(f));
      }
      var c = ((s = this.sourceRuleResults.get(u)) !== null && s !== void 0 ? s : {}).isAllPass, p = ((l = this.targetRuleResults.get(u)) !== null && l !== void 0 ? l : {}).isAllPass;
      c && p ? t.setElementState(q.ALLOW_CONNECT) : t.setElementState(q.NOT_ALLOW_CONNECT);
    }, e.prototype.isShowLine = function() {
      var t = this.state, n = t.startX, o = t.startY, i = t.endX, a = t.endY, s = We(n, o, i, a);
      return s > 10;
    }, e.prototype.render = function() {
      var t = this, n = this.state, o = n.startX, i = n.startY, a = n.endX, s = n.endY, l = this.props, u = l.anchorData, d = l.edgeStyle, f = l.nodeModel, c = l.graphModel, p = u.edgeAddable;
      return (
        // className="lf-anchor" 作为下载时，需要将锚点删除的依据，不要修改类名
        w("g", { className: "lf-anchor", children: [w("g", { onClick: function(h) {
          h.stopPropagation(), c.eventCenter.emit(C.ANCHOR_CLICK, {
            data: u,
            e: h,
            nodeModel: f
          });
        }, onPointerDown: function(h) {
          c.eventCenter.emit(C.ANCHOR_MOUSEDOWN, {
            data: u,
            e: h,
            nodeModel: f
          }), p !== !1 && t.dragHandler.handleMouseDown(h);
        }, children: this.getAnchorShape() }), this.isShowLine() && (this.customTrajectory ? this.customTrajectory(rt({ sourcePoint: {
          x: o,
          y: i
        }, targetPoint: {
          x: a,
          y: s
        } }, d)) : w(_r, rt({ x1: o, y1: i, x2: a, y2: s }, d, { "pointer-events": "none" })))] })
      );
    }, e;
  })($)
), Eh = /* @__PURE__ */ (function() {
  var r = function(e, t) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, o) {
      n.__proto__ = o;
    } || function(n, o) {
      for (var i in o) Object.prototype.hasOwnProperty.call(o, i) && (n[i] = o[i]);
    }, r(e, t);
  };
  return function(e, t) {
    if (typeof t != "function" && t !== null)
      throw new TypeError("Class extends value " + String(t) + " is not a constructor or null");
    r(e, t);
    function n() {
      this.constructor = e;
    }
    e.prototype = t === null ? Object.create(t) : (n.prototype = t.prototype, new n());
  };
})(), pi = function() {
  return pi = Object.assign || function(r) {
    for (var e, t = 1, n = arguments.length; t < n; t++) {
      e = arguments[t];
      for (var o in e) Object.prototype.hasOwnProperty.call(e, o) && (r[o] = e[o]);
    }
    return r;
  }, pi.apply(this, arguments);
}, bh = (
  /** @class */
  (function(r) {
    Eh(e, r);
    function e(t) {
      var n = r.call(this, t) || this;
      return n.style = {}, n.onDragging = function(o) {
        var i, a = o.event, s = n.props, l = s.graphModel, u = s.nodeModel, d = s.eventCenter, f = l.selectNodes, c = u.x, p = u.y, h = a.clientX, v = a.clientY, g = l.getPointByClient({
          x: h,
          y: v
        }).canvasOverlayPosition, y = g.x, _ = g.y, S = new Oe(y - c, _ - p), A = ((i = n.normal) === null || i === void 0 ? void 0 : i.angle(S)) - n.defaultAngle, x = new Jn(-c, -p).rotate(A).translate(c, p).toString();
        u.transform = x, u.rotate = A;
        var E = ht(f, function(b) {
          return b.id;
        });
        E.indexOf(u.id) === -1 && (E = [u.id]);
        var m = pu(E, function(b, P) {
          var D = l.getNodeModelById(P);
          return b[P] = D?.getMoveDistance(0, 0, !1), b;
        }, {});
        E.forEach(function(b) {
          var P = l.getNodeEdges(b);
          P.forEach(function(D) {
            if (m[D.sourceNodeId]) {
              var k = l.getNodeModelById(D.sourceNodeId), Y = k.anchors.find(function(J) {
                return J.id === D.sourceAnchorId;
              });
              D.updateStartPoint(Y);
            }
            if (m[D.targetNodeId]) {
              var k = l.getNodeModelById(D.targetNodeId), Y = k.anchors.find(function(oe) {
                return oe.id === D.targetAnchorId;
              });
              D.updateEndPoint(Y);
            }
          });
        }), d.emit(C.NODE_ROTATE, {
          e: a,
          model: u,
          data: u.getData()
        });
      }, n.style = t.style, n.stepperDrag = new ut({
        onDragging: n.onDragging
      }), n;
    }
    return e.prototype.render = function() {
      var t = this, n = this.props.nodeModel, o = n.x, i = n.y, a = n.width, s = n.height, l = o + a / 2 + 20, u = i - s / 2 - 20;
      return this.normal = new Oe(1, 0), this.defaultAngle = this.normal.angle(new Oe(l - o, u - i)), n.defaultAngle = this.defaultAngle, w("g", { className: "lf-rotate-control", children: w("g", { onPointerDown: function(d) {
        t.stepperDrag.handleMouseDown(d);
      }, children: w(mr, pi({}, this.style, { cx: l, cy: u })) }) });
    }, e;
  })($)
), jo = { exports: {} };
var Os;
function Oh() {
  return Os || (Os = 1, (function(r) {
    (function() {
      var e = {}.hasOwnProperty;
      function t() {
        for (var i = "", a = 0; a < arguments.length; a++) {
          var s = arguments[a];
          s && (i = o(i, n(s)));
        }
        return i;
      }
      function n(i) {
        if (typeof i == "string" || typeof i == "number")
          return i;
        if (typeof i != "object")
          return "";
        if (Array.isArray(i))
          return t.apply(null, i);
        if (i.toString !== Object.prototype.toString && !i.toString.toString().includes("[native code]"))
          return i.toString();
        var a = "";
        for (var s in i)
          e.call(i, s) && i[s] && (a = o(a, s));
        return a;
      }
      function o(i, a) {
        return a ? i ? i + " " + a : i + a : i;
      }
      r.exports ? (t.default = t, r.exports = t) : window.classNames = t;
    })();
  })(jo)), jo.exports;
}
var wh = Oh();
const Sh = /* @__PURE__ */ Hs(wh);
var Ah = /* @__PURE__ */ (function() {
  var r = function(e, t) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, o) {
      n.__proto__ = o;
    } || function(n, o) {
      for (var i in o) Object.prototype.hasOwnProperty.call(o, i) && (n[i] = o[i]);
    }, r(e, t);
  };
  return function(e, t) {
    if (typeof t != "function" && t !== null)
      throw new TypeError("Class extends value " + String(t) + " is not a constructor or null");
    r(e, t);
    function n() {
      this.constructor = e;
    }
    e.prototype = t === null ? Object.create(t) : (n.prototype = t.prototype, new n());
  };
})(), hi = function() {
  return hi = Object.assign || function(r) {
    for (var e, t = 1, n = arguments.length; t < n; t++) {
      e = arguments[t];
      for (var o in e) Object.prototype.hasOwnProperty.call(e, o) && (r[o] = e[o]);
    }
    return r;
  }, hi.apply(this, arguments);
}, Mh = function(r, e) {
  var t = typeof Symbol == "function" && r[Symbol.iterator];
  if (!t) return r;
  var n = t.call(r), o, i = [], a;
  try {
    for (; (e === void 0 || e-- > 0) && !(o = n.next()).done; ) i.push(o.value);
  } catch (s) {
    a = { error: s };
  } finally {
    try {
      o && !o.done && (t = n.return) && t.call(n);
    } finally {
      if (a) throw a.error;
    }
  }
  return i;
}, tu = (
  /** @class */
  (function(r) {
    Ah(e, r);
    function e(t) {
      var n = r.call(this) || this;
      n.mouseDownHandler = function(i) {
        var a = n.props, s = a.draggable, l = a.model, u = a.graphModel, d = u.editConfigModel.nodeTextDraggable;
        (s ?? d) && (i.stopPropagation(), n.stepperDrag.model = l, n.stepperDrag.handleMouseDown(i));
      }, n.onDragging = function(i) {
        var a = i.deltaX, s = i.deltaY, l = n.props, u = l.model, d = l.graphModel.transformModel;
        if (a || s) {
          var f = Mh(d.fixDeltaXY(a, s), 2), c = f[0], p = f[1];
          u.moveText(c, p);
        }
      }, n.dbClickHandler = function() {
        var i = n.props, a = i.editable, s = i.graphModel.eventCenter, l = i.model;
        a && l.setElementState(q.TEXT_EDIT), s.emit(C.TEXT_DBCLICK, {
          data: l.text,
          model: l
        });
      };
      var o = t.draggable;
      return n.stepperDrag = new ut({
        onDragging: n.onDragging,
        step: 1,
        // model,
        eventType: "TEXT",
        isStopPropagation: o
      }), n;
    }
    return e.prototype.getShape = function() {
      var t = this.props, n = t.model, o = t.graphModel, i = o.editConfigModel, a = n.text, s = a.value, l = a.x, u = a.y, d = a.editable, f = a.draggable, c = {
        x: l,
        y: u,
        className: "",
        value: s
      }, p = n.getTextStyle(), h = i.nodeTextDraggable || f;
      return w(Zl, hi({}, c, p, { className: Sh({
        "lf-element-text": d,
        "lf-text-draggable": !d && h,
        "lf-text-disabled": !d && !h
      }), model: n }));
    }, e.prototype.render = function() {
      var t = this.props.model.text;
      if (t)
        return w("g", { onPointerDown: this.mouseDownHandler, onDblClick: this.dbClickHandler, children: this.getShape() });
    }, e;
  })($)
), Ph = /* @__PURE__ */ (function() {
  var r = function(e, t) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, o) {
      n.__proto__ = o;
    } || function(n, o) {
      for (var i in o) Object.prototype.hasOwnProperty.call(o, i) && (n[i] = o[i]);
    }, r(e, t);
  };
  return function(e, t) {
    if (typeof t != "function" && t !== null)
      throw new TypeError("Class extends value " + String(t) + " is not a constructor or null");
    r(e, t);
    function n() {
      this.constructor = e;
    }
    e.prototype = t === null ? Object.create(t) : (n.prototype = t.prototype, new n());
  };
})(), ze = function() {
  return ze = Object.assign || function(r) {
    for (var e, t = 1, n = arguments.length; t < n; t++) {
      e = arguments[t];
      for (var o in e) Object.prototype.hasOwnProperty.call(e, o) && (r[o] = e[o]);
    }
    return r;
  }, ze.apply(this, arguments);
}, An = function(r, e) {
  var t = typeof Symbol == "function" && r[Symbol.iterator];
  if (!t) return r;
  var n = t.call(r), o, i = [], a;
  try {
    for (; (e === void 0 || e-- > 0) && !(o = n.next()).done; ) i.push(o.value);
  } catch (s) {
    a = { error: s };
  } finally {
    try {
      o && !o.done && (t = n.return) && t.call(n);
    } finally {
      if (a) throw a.error;
    }
  }
  return i;
}, Dh = (
  /** @class */
  (function(r) {
    Ph(e, r);
    function e(t) {
      var n = r.call(this, t) || this;
      return n.setHoverOn = function() {
        n.setState({
          isHovered: !0
        });
      }, n.setHoverOff = function() {
        n.setState({
          isHovered: !1
        });
      }, n.state = {
        isHovered: !1
      }, n;
    }
    return e.prototype.getBackground = function() {
      var t = this.state.isHovered, n = this.props.model, o = n.text, i = n.getTextStyle(), a = i.background || {};
      if (t && i.hover && i.hover.background && (a = ze(ze({}, a), i.hover.background)), o?.value && a?.fill !== "transparent") {
        var s = i.fontSize, l = i.textWidth, u = i.lineHeight, d = i.overflowMode, f = a.wrapPadding, c = o?.value.split(/[\r\n]/g), p = c.length, h = o.x, v = o.y, g = {};
        if (d === "autoWrap" && l) {
          var y = Wl({
            rows: c,
            style: {
              fontSize: "".concat(s, "px"),
              width: "".concat(l, "px"),
              lineHeight: u,
              padding: f
            },
            rowsLength: p,
            className: "lf-get-text-height"
          });
          g = ze(ze({}, a), { x: h, y: v, width: l, height: y });
        } else {
          var _ = pc({ rows: c, rowsLength: p, fontSize: s }), S = _.width, A = _.height;
          if (d === "ellipsis" && (S = l, A = s + 2), typeof a.wrapPadding == "string") {
            var x = a.wrapPadding.split(",").filter(function(ve) {
              return ve.trim();
            }).map(function(ve) {
              return parseFloat(ve.trim());
            });
            if (x.length > 0 && x.length <= 4) {
              if (x.length === 1) {
                var E = An(x, 1), m = E[0];
                x = [m, m, m, m];
              } else if (x.length === 2) {
                var b = An(x, 2), P = b[0], D = b[1];
                x = [P, D, P, D];
              } else if (x.length === 3) {
                var k = An(x, 3), Y = k[0], D = k[1], J = k[2];
                x = [Y, D, J, D];
              }
              var H = An(x, 4), oe = H[0], ne = H[1], ae = H[2], ue = H[3];
              S += ne + ue, A += oe + ae, h = h + (ne - ue) / 2, v = v + (ae - oe) / 2;
            }
          }
          g = ze(ze({}, a), { x: h - 1, y: v - 1, width: S, height: A });
        }
        return w(wt, ze({}, g));
      }
      return null;
    }, e.prototype.getShape = function() {
      var t = this.props.model, n = t.text, o = n.x, i = n.y, a = n.value;
      if (!a)
        return null;
      var s = t.getTextStyle(), l = ze({ x: o, y: i, value: a, model: t, className: "lf-element-text" }, s);
      return w("g", { className: "lf-line-text", onMouseEnter: this.setHoverOn, onMouseLeave: this.setHoverOff, children: [this.getBackground(), w(Zl, ze({}, l))] });
    }, e;
  })(tu)
), Th = /* @__PURE__ */ (function() {
  var r = function(e, t) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, o) {
      n.__proto__ = o;
    } || function(n, o) {
      for (var i in o) Object.prototype.hasOwnProperty.call(o, i) && (n[i] = o[i]);
    }, r(e, t);
  };
  return function(e, t) {
    if (typeof t != "function" && t !== null)
      throw new TypeError("Class extends value " + String(t) + " is not a constructor or null");
    r(e, t);
    function n() {
      this.constructor = e;
    }
    e.prototype = t === null ? Object.create(t) : (n.prototype = t.prototype, new n());
  };
})(), oo = function() {
  return oo = Object.assign || function(r) {
    for (var e, t = 1, n = arguments.length; t < n; t++) {
      e = arguments[t];
      for (var o in e) Object.prototype.hasOwnProperty.call(e, o) && (r[o] = e[o]);
    }
    return r;
  }, oo.apply(this, arguments);
}, Nh = function(r, e) {
  var t = {};
  for (var n in r) Object.prototype.hasOwnProperty.call(r, n) && e.indexOf(n) < 0 && (t[n] = r[n]);
  if (r != null && typeof Object.getOwnPropertySymbols == "function")
    for (var o = 0, n = Object.getOwnPropertySymbols(r); o < n.length; o++)
      e.indexOf(n[o]) < 0 && Object.prototype.propertyIsEnumerable.call(r, n[o]) && (t[n[o]] = r[n[o]]);
  return t;
}, Mn = function(r, e) {
  var t = typeof Symbol == "function" && r[Symbol.iterator];
  if (!t) return r;
  var n = t.call(r), o, i = [], a;
  try {
    for (; (e === void 0 || e-- > 0) && !(o = n.next()).done; ) i.push(o.value);
  } catch (s) {
    a = { error: s };
  } finally {
    try {
      o && !o.done && (t = n.return) && t.call(n);
    } finally {
      if (a) throw a.error;
    }
  }
  return i;
}, Pt = (
  /** @class */
  (function(r) {
    Th(e, r);
    function e(t) {
      var n = r.call(this) || this;
      n.onDragStart = function(l) {
        var u = l.event, d = n.props, f = d.model, c = d.graphModel;
        if (u) {
          var p = c.getPointByClient({
            x: u.clientX,
            y: u.clientY
          }).canvasOverlayPosition, h = p.x, v = p.y;
          n.moveOffset = {
            dx: f.x - h,
            dy: f.y - v
          };
        }
      }, n.onDragging = function(l) {
        var u, d, f, c, p = l.event, h = n.props, v = h.model, g = h.graphModel, y = g.editConfigModel, _ = y.stopMoveGraph, S = y.autoExpand, A = y.snapGrid, x = g.transformModel, E = g.selectNodes, m = g.width, b = g.height, P = g.gridSize, D = p, k = D.clientX, Y = D.clientY, J = n.mouseDownPosition, H = J.x, oe = J.y;
        (k - H > P || Y - oe > P) && (v.isDragging = !0);
        var ne = g.getPointByClient({
          x: k,
          y: Y
        }).canvasOverlayPosition, ae = ne.x, ue = ne.y, ve = Mn(x.CanvasPointToHtmlPoint([ae, ue]), 2), he = ve[0], j = ve[1];
        if (ae = ae + ((d = (u = n.moveOffset) === null || u === void 0 ? void 0 : u.dx) !== null && d !== void 0 ? d : 0), ue = ue + ((c = (f = n.moveOffset) === null || f === void 0 ? void 0 : f.dy) !== null && c !== void 0 ? c : 0), ae = gr(ae, P, A), ue = gr(ue, P, A), !m || !b) {
          g.moveNode2Coordinate(v.id, ae, ue);
          return;
        }
        var Z = he < 0 || j < 0 || he > m || j > b;
        if (!(S && !_ && Z)) {
          var ee = Mn(x.CanvasPointToHtmlPoint([
            ae - v.width / 2,
            ue - v.height / 2
          ]), 2), U = ee[0], se = ee[1], Re = Mn(x.CanvasPointToHtmlPoint([
            ae + v.width / 2,
            ue + v.height / 2
          ]), 2), re = Re[0], ge = Re[1], Fe = Math.max(P, 20), Ae = [];
          U < 0 ? Ae = [Fe, 0] : re > g.width ? Ae = [-Fe, 0] : se < 0 ? Ae = [0, Fe] : ge > g.height && (Ae = [0, -Fe]), n.t && ro(n.t);
          var Ht = E.map(function(Gt) {
            return Gt.id;
          });
          Ht.indexOf(v.id) === -1 && (Ht = [v.id]), Ae.length > 0 && !_ && S ? n.t = Kl(function() {
            var Gt = Mn(Ae, 2), zt = Gt[0], Ut = Gt[1];
            x.translate(zt ?? 0, Ut ?? 0);
            var ou = -(zt ?? 0) / x.SCALE_X, iu = -(Ut ?? 0) / x.SCALE_X;
            g.moveNodes(Ht, ou, iu);
          }) : g.moveNodes(Ht, ae - v.x, ue - v.y);
        }
      }, n.onDragEnd = function() {
        n.t && ro(n.t);
        var l = n.props.model;
        l.isDragging = !1;
      }, n.onMouseOut = function(l) {
        jf() && n.setHoverOff(l);
      }, n.handleMouseUp = function() {
        var l = n.props.model;
        n.mouseUpDrag = l.isDragging, n.longPressTimer && (clearTimeout(n.longPressTimer), n.longPressTimer = void 0);
      }, n.handleClick = function(l) {
        var u = n.mouseUpDrag === !1, d = (/* @__PURE__ */ new Date()).getTime();
        if (n.startTime) {
          var f = d - n.startTime, c = n.props, p = c.model, h = c.graphModel;
          if (!(!u && f > 300)) {
            u || (n.onDragEnd(), n.handleMouseUp());
            var v = p.getData(), g = h.getPointByClient({
              x: l.clientX,
              y: l.clientY
            }), y = {
              data: v,
              e: l,
              position: g,
              isSelected: !1,
              isMultiple: !1
            }, _ = l.button === 2, S = l.detail === 2;
            if (!_) {
              var A = h.editConfigModel, x = Vl(l, A);
              if (y.isMultiple = x, p.isSelected && !S && x ? (y.isSelected = !1, p.setSelected(!1)) : (h.selectNodeById(p.id, x), y.isSelected = !0, A.isSilentMode || n.toFront()), S)
                A.nodeTextEdit && p.text.editable && A.textMode === Xe.TEXT && (p.setSelected(!1), h.setElementStateById(p.id, q.TEXT_EDIT)), h.eventCenter.emit(C.NODE_DBCLICK, y);
              else {
                h.eventCenter.emit(C.ELEMENT_CLICK, y), h.eventCenter.emit(C.NODE_CLICK, y);
                var E = l.currentTarget, m = !Me(window) && Fs(window.requestAnimationFrame) ? window.requestAnimationFrame.bind(window) : function(b) {
                  return setTimeout(b, 0);
                };
                m(function() {
                  E.focus();
                });
              }
            }
          }
        }
      }, n.handleContextMenu = function(l) {
        l.preventDefault();
        var u = n.props, d = u.model, f = u.graphModel, c = f.editConfigModel, p = d.getData(), h = f.getPointByClient({
          x: l.clientX,
          y: l.clientY
        });
        f.setElementStateById(d.id, q.SHOW_MENU, h.domOverlayPosition), d.isSelected || f.selectNodeById(d.id), f.eventCenter.emit(C.NODE_CONTEXTMENU, {
          data: p,
          e: l,
          position: h
        }), c.isSilentMode || n.toFront();
      }, n.handleMouseDown = function(l) {
        var u = n.props, d = u.model, f = u.graphModel;
        n.mouseDownPosition = { x: l.clientX, y: l.clientY }, n.startTime = (/* @__PURE__ */ new Date()).getTime();
        var c = f.editConfigModel;
        c.adjustNodePosition && d.draggable && n.stepDrag && n.stepDrag.handleMouseDown(l), n.longPressTimer && clearTimeout(n.longPressTimer), l.pointerType === "touch" && (n.longPressTimer = window.setTimeout(function() {
          n.props.model.isDragging || n.handleContextMenu(l);
        }, 500));
      }, n.handleFocus = function() {
        var l = n.props, u = l.model, d = l.graphModel;
        d.eventCenter.emit(C.NODE_FOCUS, {
          data: u.getData()
        });
      }, n.handleBlur = function() {
        if (n.props) {
          var l = n.props, u = l.model, d = l.graphModel;
          d.eventCenter.emit(C.NODE_BLUR, {
            data: u.getData()
          });
        }
      }, n.setHoverOn = function(l) {
        var u = n.props, d = u.model, f = u.graphModel;
        if (!d.isHovered) {
          var c = d.getData();
          d.setHovered(!0), f.eventCenter.emit(C.NODE_MOUSEENTER, {
            data: c,
            e: l
          });
        }
      }, n.setHoverOff = function(l) {
        var u = n.props, d = u.model, f = u.graphModel, c = d.getData();
        d.isHovered && (d.setHovered(!1), f.eventCenter.emit(C.NODE_MOUSELEAVE, {
          data: c,
          e: l
        }));
      };
      var o = t.graphModel, i = o.gridSize, a = o.eventCenter, s = t.model;
      return n.stepDrag = new ut({
        onDragStart: n.onDragStart,
        onDragging: n.onDragging,
        onDragEnd: n.onDragEnd,
        step: i,
        eventType: "NODE",
        isStopPropagation: !1,
        eventCenter: a,
        model: s
      }), n.modelDisposer = gl(function() {
        return n.props;
      }, function(l) {
        l && l.model && n.stepDrag.setModel(l.model);
      }), n;
    }
    return e.prototype.componentWillUnmount = function() {
      this.modelDisposer && this.modelDisposer(), this.render.$mobx && this.render.$mobx.dispose();
    }, e.prototype.componentDidMount = function() {
    }, e.prototype.componentDidUpdate = function() {
    }, e.prototype.getAnchorShape = function(t) {
      return null;
    }, e.prototype.getAnchors = function() {
      var t = this, n = this.props, o = n.model, i = n.graphModel, a = o.isSelected, s = o.isHitable, l = o.isDragging, u = o.isShowAnchor;
      return s && (a || u) && !l ? ht(o.anchors, function(d, f) {
        var c = o.getAnchorLineStyle(d), p = o.getAnchorStyle(d);
        return w(xh, { anchorData: d, node: t, style: p, edgeStyle: c, anchorIndex: f, nodeModel: o, graphModel: i, setHoverOff: t.setHoverOff });
      }) : [];
    }, e.prototype.getRotateControl = function() {
      var t = this.props, n = t.model, o = t.graphModel, i = o.editConfigModel, a = i.isSilentMode, s = i.allowRotate, l = n.isSelected, u = n.isHitable, d = n.rotatable, f = n.isHovered, c = s && d, p = n.getRotateControlStyle();
      if (!a && u && (l || f) && c)
        return w(bh, { graphModel: o, nodeModel: n, eventCenter: o.eventCenter, style: p });
    }, e.prototype.getResizeControl = function() {
      var t = this.props, n = t.model, o = t.graphModel, i = o.editConfigModel, a = i.isSilentMode, s = i.allowResize, l = n.isSelected, u = n.isHitable, d = n.resizable, f = n.isHovered, c = s && d, p = n.getResizeControlStyle();
      return !a && u && (l || f) && c ? w(Hc, { style: p, model: n, graphModel: o }) : null;
    }, e.prototype.getText = function() {
      var t, n = this.props, o = n.model, i = n.graphModel, a = i.editConfigModel;
      if (a.nodeTextMode !== Xe.TEXT || o.state === q.TEXT_EDIT)
        return null;
      if (o.text) {
        var s = !1;
        return a.nodeTextDraggable && o.text.draggable && (s = !0), w(tu, { editable: a.nodeTextEdit && ((t = o.text.editable) !== null && t !== void 0 ? t : !0), model: o, graphModel: i, draggable: s });
      }
      return null;
    }, e.prototype.getStateClassName = function() {
      var t = this.props.model, n = t.state, o = t.isDragging, i = t.isSelected, a = "lf-node";
      switch (n) {
        case q.ALLOW_CONNECT:
          a += " lf-node-allow";
          break;
        case q.NOT_ALLOW_CONNECT:
          a += " lf-node-not-allow";
          break;
        default:
          a += " lf-node-default";
          break;
      }
      return o && (a += " lf-dragging"), i && (a += " lf-node-selected"), a;
    }, e.prototype.toFront = function() {
      var t = this.props, n = t.model, o = t.graphModel;
      n.autoToFront && o.toFront(n.id);
    }, e.prototype.render = function() {
      var t = this.props, n = t.model, o = t.graphModel, i = o.editConfigModel, a = i.hideAnchors, s = i.adjustNodePosition, l = i.allowRotate, u = i.allowResize, d = o.gridSize, f = o.transformModel.SCALE_X, c = n.isHitable, p = n.draggable, h = n.transform, v = n.getOuterGAttributes(), g = v.className, y = g === void 0 ? "" : g, _ = Nh(v, ["className"]), S = w("g", { className: "lf-node-content", children: [w("g", { transform: h, children: [this.getShape(), this.getText(), u && this.getResizeControl(), l && this.getRotateControl()] }), !a && this.getAnchors()] }), A;
      return c ? (s && p && this.stepDrag.setStep(d * f), A = w("g", oo({
        className: "".concat(this.getStateClassName(), " ").concat(y),
        onPointerDown: this.handleMouseDown,
        onPointerUp: this.handleMouseUp,
        onClick: this.handleClick,
        //因为移动端点击操作完成会按顺序触发enter、leave、click事件，所以会造成节点的闪烁，所以在这里没有统一状态为Pointer
        onMouseEnter: this.setHoverOn,
        onMouseOver: this.setHoverOn,
        onMouseLeave: this.setHoverOff,
        onMouseOut: this.onMouseOut,
        onContextMenu: this.handleContextMenu,
        onFocus: this.handleFocus,
        onBlur: this.handleBlur
      }, _, { children: S }))) : A = w("g", oo({ className: "".concat(this.getStateClassName(), " ").concat(y) }, _, { children: S })), A;
    }, e.isObserved = !1, e;
  })($)
), Ch = /* @__PURE__ */ (function() {
  var r = function(e, t) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, o) {
      n.__proto__ = o;
    } || function(n, o) {
      for (var i in o) Object.prototype.hasOwnProperty.call(o, i) && (n[i] = o[i]);
    }, r(e, t);
  };
  return function(e, t) {
    if (typeof t != "function" && t !== null)
      throw new TypeError("Class extends value " + String(t) + " is not a constructor or null");
    r(e, t);
    function n() {
      this.constructor = e;
    }
    e.prototype = t === null ? Object.create(t) : (n.prototype = t.prototype, new n());
  };
})(), vi = function() {
  return vi = Object.assign || function(r) {
    for (var e, t = 1, n = arguments.length; t < n; t++) {
      e = arguments[t];
      for (var o in e) Object.prototype.hasOwnProperty.call(e, o) && (r[o] = e[o]);
    }
    return r;
  }, vi.apply(this, arguments);
}, ws = (
  /** @class */
  (function(r) {
    Ch(e, r);
    function e() {
      return r !== null && r.apply(this, arguments) || this;
    }
    return e.prototype.getShape = function() {
      var t = this.props.model, n = t.getNodeStyle();
      return w(wt, vi({}, n, { x: t.x, y: t.y, width: t.width, height: t.height, radius: t.radius }));
    }, e;
  })(Pt)
), Lh = /* @__PURE__ */ (function() {
  var r = function(e, t) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, o) {
      n.__proto__ = o;
    } || function(n, o) {
      for (var i in o) Object.prototype.hasOwnProperty.call(o, i) && (n[i] = o[i]);
    }, r(e, t);
  };
  return function(e, t) {
    if (typeof t != "function" && t !== null)
      throw new TypeError("Class extends value " + String(t) + " is not a constructor or null");
    r(e, t);
    function n() {
      this.constructor = e;
    }
    e.prototype = t === null ? Object.create(t) : (n.prototype = t.prototype, new n());
  };
})(), yi = function() {
  return yi = Object.assign || function(r) {
    for (var e, t = 1, n = arguments.length; t < n; t++) {
      e = arguments[t];
      for (var o in e) Object.prototype.hasOwnProperty.call(e, o) && (r[o] = e[o]);
    }
    return r;
  }, yi.apply(this, arguments);
}, Ss = (
  /** @class */
  (function(r) {
    Lh(e, r);
    function e() {
      return r !== null && r.apply(this, arguments) || this;
    }
    return e.prototype.getShape = function() {
      var t = this.props.model, n = t.x, o = t.y, i = t.r, a = t.getNodeStyle();
      return w(mr, yi({}, a, { x: n, y: o, r: i }));
    }, e;
  })(Pt)
), jh = /* @__PURE__ */ (function() {
  var r = function(e, t) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, o) {
      n.__proto__ = o;
    } || function(n, o) {
      for (var i in o) Object.prototype.hasOwnProperty.call(o, i) && (n[i] = o[i]);
    }, r(e, t);
  };
  return function(e, t) {
    if (typeof t != "function" && t !== null)
      throw new TypeError("Class extends value " + String(t) + " is not a constructor or null");
    r(e, t);
    function n() {
      this.constructor = e;
    }
    e.prototype = t === null ? Object.create(t) : (n.prototype = t.prototype, new n());
  };
})(), io = function() {
  return io = Object.assign || function(r) {
    for (var e, t = 1, n = arguments.length; t < n; t++) {
      e = arguments[t];
      for (var o in e) Object.prototype.hasOwnProperty.call(e, o) && (r[o] = e[o]);
    }
    return r;
  }, io.apply(this, arguments);
}, As = (
  /** @class */
  (function(r) {
    jh(e, r);
    function e() {
      return r !== null && r.apply(this, arguments) || this;
    }
    return e.prototype.getShape = function() {
      var t = this.props.model, n = t, o = n.x, i = n.y, a = n.width, s = n.height, l = n.points, u = t.getNodeStyle(), d = {
        transform: "matrix(1 0 0 1 ".concat(o - a / 2, " ").concat(i - s / 2, ")")
      };
      return w("g", io({}, d, { children: w(ql, io({}, u, { points: l, x: o, y: i })) }));
    }, e;
  })(Pt)
), Rh = /* @__PURE__ */ (function() {
  var r = function(e, t) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, o) {
      n.__proto__ = o;
    } || function(n, o) {
      for (var i in o) Object.prototype.hasOwnProperty.call(o, i) && (n[i] = o[i]);
    }, r(e, t);
  };
  return function(e, t) {
    if (typeof t != "function" && t !== null)
      throw new TypeError("Class extends value " + String(t) + " is not a constructor or null");
    r(e, t);
    function n() {
      this.constructor = e;
    }
    e.prototype = t === null ? Object.create(t) : (n.prototype = t.prototype, new n());
  };
})(), gi = function() {
  return gi = Object.assign || function(r) {
    for (var e, t = 1, n = arguments.length; t < n; t++) {
      e = arguments[t];
      for (var o in e) Object.prototype.hasOwnProperty.call(e, o) && (r[o] = e[o]);
    }
    return r;
  }, gi.apply(this, arguments);
}, Ms = (
  /** @class */
  (function(r) {
    Rh(e, r);
    function e() {
      return r !== null && r.apply(this, arguments) || this;
    }
    return e.prototype.getShape = function() {
      var t = this.props.model, n = t.getNodeStyle();
      return w("g", { children: w(ql, gi({}, n, { points: t.points, x: t.x, y: t.y })) });
    }, e;
  })(Pt)
), Ih = /* @__PURE__ */ (function() {
  var r = function(e, t) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, o) {
      n.__proto__ = o;
    } || function(n, o) {
      for (var i in o) Object.prototype.hasOwnProperty.call(o, i) && (n[i] = o[i]);
    }, r(e, t);
  };
  return function(e, t) {
    if (typeof t != "function" && t !== null)
      throw new TypeError("Class extends value " + String(t) + " is not a constructor or null");
    r(e, t);
    function n() {
      this.constructor = e;
    }
    e.prototype = t === null ? Object.create(t) : (n.prototype = t.prototype, new n());
  };
})(), _i = function() {
  return _i = Object.assign || function(r) {
    for (var e, t = 1, n = arguments.length; t < n; t++) {
      e = arguments[t];
      for (var o in e) Object.prototype.hasOwnProperty.call(e, o) && (r[o] = e[o]);
    }
    return r;
  }, _i.apply(this, arguments);
}, Ps = (
  /** @class */
  (function(r) {
    Ih(e, r);
    function e() {
      return r !== null && r.apply(this, arguments) || this;
    }
    return e.prototype.getShape = function() {
      var t = this.props.model, n = t.getNodeStyle();
      return w(Rc, _i({}, n, { x: t.x, y: t.y, rx: t.rx, ry: t.ry }));
    }, e;
  })(Pt)
), kh = /* @__PURE__ */ (function() {
  var r = function(e, t) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, o) {
      n.__proto__ = o;
    } || function(n, o) {
      for (var i in o) Object.prototype.hasOwnProperty.call(o, i) && (n[i] = o[i]);
    }, r(e, t);
  };
  return function(e, t) {
    if (typeof t != "function" && t !== null)
      throw new TypeError("Class extends value " + String(t) + " is not a constructor or null");
    r(e, t);
    function n() {
      this.constructor = e;
    }
    e.prototype = t === null ? Object.create(t) : (n.prototype = t.prototype, new n());
  };
})(), Gr = function() {
  return Gr = Object.assign || function(r) {
    for (var e, t = 1, n = arguments.length; t < n; t++) {
      e = arguments[t];
      for (var o in e) Object.prototype.hasOwnProperty.call(e, o) && (r[o] = e[o]);
    }
    return r;
  }, Gr.apply(this, arguments);
}, Ds = (
  /** @class */
  (function(r) {
    kh(e, r);
    function e() {
      return r !== null && r.apply(this, arguments) || this;
    }
    return e.prototype.getBackground = function() {
      var t = this.props.model, n = t.getTextStyle(), o = t.width, i = t.height, a = t.x, s = t.y, l = Gr(Gr({}, n.background), { x: a, y: s, width: o, height: i });
      return w(wt, Gr({}, l));
    }, e.prototype.getResizeControl = function() {
      return null;
    }, e.prototype.getShape = function() {
      return w("g", { children: this.getBackground() });
    }, e;
  })(Pt)
), Bh = /* @__PURE__ */ (function() {
  var r = function(e, t) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, o) {
      n.__proto__ = o;
    } || function(n, o) {
      for (var i in o) Object.prototype.hasOwnProperty.call(o, i) && (n[i] = o[i]);
    }, r(e, t);
  };
  return function(e, t) {
    if (typeof t != "function" && t !== null)
      throw new TypeError("Class extends value " + String(t) + " is not a constructor or null");
    r(e, t);
    function n() {
      this.constructor = e;
    }
    e.prototype = t === null ? Object.create(t) : (n.prototype = t.prototype, new n());
  };
})(), zr = function() {
  return zr = Object.assign || function(r) {
    for (var e, t = 1, n = arguments.length; t < n; t++) {
      e = arguments[t];
      for (var o in e) Object.prototype.hasOwnProperty.call(e, o) && (r[o] = e[o]);
    }
    return r;
  }, zr.apply(this, arguments);
}, Xh = function(r, e) {
  var t = typeof Symbol == "function" && r[Symbol.iterator];
  if (!t) return r;
  var n = t.call(r), o, i = [], a;
  try {
    for (; (e === void 0 || e-- > 0) && !(o = n.next()).done; ) i.push(o.value);
  } catch (s) {
    a = { error: s };
  } finally {
    try {
      o && !o.done && (t = n.return) && t.call(n);
    } finally {
      if (a) throw a.error;
    }
  }
  return i;
}, Yh = function(r, e, t) {
  if (t || arguments.length === 2) for (var n = 0, o = e.length, i; n < o; n++)
    (i || !(n in e)) && (i || (i = Array.prototype.slice.call(e, 0, n)), i[n] = e[n]);
  return r.concat(i || Array.prototype.slice.call(e));
}, Ts = (
  /** @class */
  (function(r) {
    Bh(e, r);
    function e() {
      var t = r.apply(this, Yh([], Xh(arguments), !1)) || this;
      return t.ref = Pi(), t;
    }
    return Object.defineProperty(e.prototype, "rootEl", {
      get: function() {
        return this.ref.current;
      },
      enumerable: !1,
      configurable: !0
    }), e.prototype.setHtml = function(t) {
      t.appendChild(document.createElement("div"));
    }, e.prototype.confirmUpdate = function(t) {
      this.setHtml(t);
    }, e.prototype.shouldUpdate = function() {
      return this.preProperties && this.preProperties === this.currentProperties ? !1 : (this.preProperties = this.currentProperties, !0);
    }, e.prototype.componentDidMount = function() {
      this.shouldUpdate() && this.rootEl && this.setHtml(this.rootEl);
    }, e.prototype.componentDidUpdate = function() {
      this.shouldUpdate() && this.rootEl && this.confirmUpdate(this.rootEl);
    }, e.prototype.componentWillUnmount = function() {
      r.prototype.componentWillUnmount.call(this), this.rootEl.innerHTML = "";
    }, e.prototype.getShape = function() {
      var t = this.props.model, n = t.x, o = t.y, i = t.height, a = t.width, s = t.getNodeStyle();
      return this.currentProperties = JSON.stringify(t.properties), w("g", { children: [s.shadow && w("defs", { children: w("filter", { id: "shadow", x: "-50%", y: "-50%", width: "200%", height: "200%", children: w("feDropShadow", zr({}, s.shadow)) }) }), w("rect", zr({ x: n - a / 2, y: o - i / 2, width: a, height: i, rx: s.radius, ry: s.radius }, s, { filter: "url(#shadow)" })), w("foreignObject", zr({}, s, { x: n - a / 2, y: o - i / 2, width: a, height: i, ref: this.ref }))] });
    }, e;
  })(Pt)
), Fh = /* @__PURE__ */ (function() {
  var r = function(e, t) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, o) {
      n.__proto__ = o;
    } || function(n, o) {
      for (var i in o) Object.prototype.hasOwnProperty.call(o, i) && (n[i] = o[i]);
    }, r(e, t);
  };
  return function(e, t) {
    if (typeof t != "function" && t !== null)
      throw new TypeError("Class extends value " + String(t) + " is not a constructor or null");
    r(e, t);
    function n() {
      this.constructor = e;
    }
    e.prototype = t === null ? Object.create(t) : (n.prototype = t.prototype, new n());
  };
})(), Ue = function() {
  return Ue = Object.assign || function(r) {
    for (var e, t = 1, n = arguments.length; t < n; t++) {
      e = arguments[t];
      for (var o in e) Object.prototype.hasOwnProperty.call(e, o) && (r[o] = e[o]);
    }
    return r;
  }, Ue.apply(this, arguments);
}, Hh = function(r, e) {
  var t = {};
  for (var n in r) Object.prototype.hasOwnProperty.call(r, n) && e.indexOf(n) < 0 && (t[n] = r[n]);
  if (r != null && typeof Object.getOwnPropertySymbols == "function")
    for (var o = 0, n = Object.getOwnPropertySymbols(r); o < n.length; o++)
      e.indexOf(n[o]) < 0 && Object.prototype.propertyIsEnumerable.call(r, n[o]) && (t[n[o]] = r[n[o]]);
  return t;
}, Gh = function(r, e) {
  var t = typeof Symbol == "function" && r[Symbol.iterator];
  if (!t) return r;
  var n = t.call(r), o, i = [], a;
  try {
    for (; (e === void 0 || e-- > 0) && !(o = n.next()).done; ) i.push(o.value);
  } catch (s) {
    a = { error: s };
  } finally {
    try {
      o && !o.done && (t = n.return) && t.call(n);
    } finally {
      if (a) throw a.error;
    }
  }
  return i;
}, it;
(function(r) {
  r.SOURCE = "SOURCE", r.TARGET = "TARGET";
})(it || (it = {}));
var Ns = (
  /** @class */
  (function(r) {
    Fh(e, r);
    function e(t) {
      var n = r.call(this) || this;
      n.handleMouseDown = function(l) {
        n.stepDrag && n.stepDrag.handleMouseDown(l);
      }, n.onDragStart = function() {
        var l = n.props, u = l.x, d = l.y, f = l.edgeModel, c = f.startPoint, p = f.endPoint, h = f.pointsList;
        n.oldEdge = {
          startPoint: c,
          endPoint: p,
          pointsList: h
        }, n.setState({
          endX: u,
          endY: d,
          dragging: !0
        });
      }, n.onDragging = function(l) {
        var u = l.deltaX, d = l.deltaY, f = n.state, c = f.endX, p = f.endY, h = n.props, v = h.graphModel, g = h.type, y = v.transformModel, _ = v.editConfigModel, S = Gh(y.moveCanvasPointByHtml([c, p], u, d), 2), A = S[0], x = S[1];
        n.setState({
          endX: A,
          endY: x,
          dragging: !0
        });
        var E = n.props.edgeModel, m = eo({
          x: c,
          y: p
        }, v);
        if (m && m.node && n.isAllowAdjust(m).pass) {
          var b = E.startPoint, P = E.endPoint, D = E.sourceNode, k = E.targetNode, Y = g === it.SOURCE ? {
            startPoint: {
              x: m.anchor.x,
              y: m.anchor.y
            },
            endPoint: {
              x: P.x,
              y: P.y
            },
            sourceNode: m.node,
            targetNode: k
          } : {
            startPoint: {
              x: b.x,
              y: b.y
            },
            endPoint: {
              x: m.anchor.x,
              y: m.anchor.y
            },
            sourceNode: D,
            targetNode: m.node
          };
          E.updateAfterAdjustStartAndEnd(Y);
        } else
          g === it.SOURCE ? E.updateStartPoint({ x: A, y: x }) : E.updateEndPoint({ x: A, y: x });
        E.text.value && _.adjustEdge && E.setText(Object.assign({}, E.text, E.textPosition));
      }, n.onDragEnd = function(l) {
        var u, d, f, c = l.event;
        try {
          n.setState({
            dragging: !1
          });
          var p = n.props, h = p.graphModel, v = p.edgeModel, g = p.type, y = n.state, _ = y.endX, S = y.endY, A = y.dragging, x = eo({
            x: _,
            y: S
          }, h);
          if (!A)
            return;
          var E = !1, m = void 0;
          if (x && x.node) {
            var b = n.isAllowAdjust(x), P = b.pass, D = b.msg, k = b.newTargetNode;
            if (P) {
              var Y = v.getData(), J = Y.text, H = Y.sourceAnchorId, oe = H === void 0 ? "" : H, ne = Y.targetAnchorId, ae = ne === void 0 ? "" : ne, ue = Hh(Y, ["text", "sourceAnchorId", "targetAnchorId"]);
              if (m = Ue(Ue({ sourceAnchorId: oe, targetAnchorId: ae }, ue), { text: J?.value || "" }), g === it.SOURCE) {
                var ve = h.getNodeModelById(x.node.id), he = h.getNodeModelById(v.targetNodeId), j = (u = h.edgeGenerator) === null || u === void 0 ? void 0 : u.call(h, ve?.getData(), he?.getData(), m);
                m = Ue(Ue({}, j), { sourceNodeId: x.node.id, sourceAnchorId: x.anchor.id, startPoint: {
                  x: x.anchor.x,
                  y: x.anchor.y
                }, targetNodeId: v.targetNodeId, endPoint: Ue({}, v.endPoint) }), v.sourceNodeId === x.node.id && v.sourceAnchorId === x.anchor.id && (E = !0);
              } else if (g === it.TARGET) {
                var ve = h.getNodeModelById(v.sourceNodeId), he = h.getNodeModelById(x.node.id), j = (d = h.edgeGenerator) === null || d === void 0 ? void 0 : d.call(h, ve?.getData(), he?.getData(), m);
                m = Ue(Ue({}, j), { sourceNodeId: v.sourceNodeId, startPoint: Ue({}, v.startPoint), targetNodeId: x.node.id, targetAnchorId: x.anchor.id, endPoint: {
                  x: x.anchor.x,
                  y: x.anchor.y
                } }), v.targetNodeId === x.node.id && v.targetAnchorId === x.anchor.id && (E = !0);
              }
            } else {
              E = !0;
              var Z = k.getData();
              h.eventCenter.emit(C.CONNECTION_NOT_ALLOWED, {
                data: Z,
                msg: D
              });
            }
          } else
            E = !0;
          if (E)
            n.recoveryEdge();
          else {
            var ee = v.getData();
            h.deleteEdgeById(v.id);
            var U = h.addEdge(Ue({}, m));
            h.eventCenter.emit(C.EDGE_EXCHANGE_NODE, {
              data: {
                newEdge: U.getData(),
                oldEdge: ee
              }
            });
          }
          (f = n.preTargetNode) === null || f === void 0 || f.setElementState(q.DEFAULT);
        } finally {
          var h = n.props.graphModel;
          h.eventCenter.emit(C.ADJUST_POINT_DRAGEND, {
            e: c,
            data: n.stepDragData
          });
        }
      }, n.recoveryEdge = function() {
        var l = n.props.edgeModel, u = n.oldEdge, d = u.startPoint, f = u.endPoint, c = u.pointsList;
        l.updateStartPoint(d), l.updateEndPoint(f), l.modelType !== G.LINE_EDGE && (l.pointsList = c ?? [], l.initPoints());
      }, n.getAdjustPointStyle = function() {
        var l = n.props.graphModel.theme, u = l.edgeAdjust;
        return u;
      }, n.state = {
        dragging: !1,
        endX: 0,
        endY: 0
      }, n.targetRuleResults = /* @__PURE__ */ new Map(), n.sourceRuleResults = /* @__PURE__ */ new Map();
      var o = t.type, i = t.edgeModel, a = t.graphModel, s = a.eventCenter;
      return n.stepDragData = {
        type: o,
        edgeData: i.getData()
      }, n.stepDrag = new ut({
        onDragStart: n.onDragStart,
        onDragging: n.onDragging,
        onDragEnd: n.onDragEnd,
        eventType: "ADJUST_POINT",
        isStopPropagation: !1,
        eventCenter: s,
        data: n.stepDragData
      }), n;
    }
    return e.prototype.isAllowAdjust = function(t) {
      var n = this.props, o = n.edgeModel, i = o.id, a = o.sourceNode, s = o.targetNode, l = o.sourceAnchorId, u = o.targetAnchorId, d = n.type, f, c, p, h;
      if (d === it.SOURCE ? (f = t.node, c = s, p = t.anchor, h = s.getAnchorInfo(u)) : (f = a, c = t.node, h = t.anchor, p = a.getAnchorInfo(l)), this.preTargetNode && this.preTargetNode !== t.node && this.preTargetNode.setElementState(q.DEFAULT), this.preTargetNode = t.node, h.id === p.id)
        return {
          pass: !1,
          msg: "",
          newTargetNode: c
        };
      var v = "".concat(f.id, "_").concat(c.id, "_").concat(p.id, "_").concat(h.id);
      if (!this.targetRuleResults.has(v)) {
        var g = f.isAllowConnectedAsSource(c, p, h, i), y = c.isAllowConnectedAsTarget(f, p, h, i);
        this.sourceRuleResults.set(v, to(g)), this.targetRuleResults.set(v, to(y));
      }
      var _ = this.sourceRuleResults.get(v), S = _.isAllPass, A = _.msg, x = this.targetRuleResults.get(v), E = x.isAllPass, m = x.msg, b = S && E ? q.ALLOW_CONNECT : q.NOT_ALLOW_CONNECT;
      return d === it.SOURCE ? f.setElementState(b) : c.setElementState(b), {
        pass: S && E,
        msg: m || A,
        newTargetNode: c
      };
    }, e.prototype.render = function() {
      var t = this.props, n = t.x, o = t.y, i = t.getAdjustPointShape, a = t.edgeModel, s = this.state.dragging;
      return w("g", { pointerEvents: s ? "none" : "", onPointerDown: this.handleMouseDown, children: s ? "" : i(n, o, a) });
    }, e;
  })($)
), zh = /* @__PURE__ */ (function() {
  var r = function(e, t) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, o) {
      n.__proto__ = o;
    } || function(n, o) {
      for (var i in o) Object.prototype.hasOwnProperty.call(o, i) && (n[i] = o[i]);
    }, r(e, t);
  };
  return function(e, t) {
    if (typeof t != "function" && t !== null)
      throw new TypeError("Class extends value " + String(t) + " is not a constructor or null");
    r(e, t);
    function n() {
      this.constructor = e;
    }
    e.prototype = t === null ? Object.create(t) : (n.prototype = t.prototype, new n());
  };
})(), mi = function() {
  return mi = Object.assign || function(r) {
    for (var e, t = 1, n = arguments.length; t < n; t++) {
      e = arguments[t];
      for (var o in e) Object.prototype.hasOwnProperty.call(e, o) && (r[o] = e[o]);
    }
    return r;
  }, mi.apply(this, arguments);
};
(function(r) {
  zh(e, r);
  function e() {
    return r !== null && r.apply(this, arguments) || this;
  }
  return e.prototype.getArrowAttributes = function() {
    var t = this.props, n = t.arrowInfo, o = t.style, i = n.start, a = n.end, s = {
      start: i,
      end: a,
      offset: o.offset,
      verticalLength: o.verticalLength,
      type: "end"
    }, l = Kr(s), u = l.leftX, d = l.leftY, f = l.rightX, c = l.rightY;
    return mi({ d: "M".concat(u, " ").concat(d, " L").concat(a.x, " ").concat(a.y, " L").concat(f, " ").concat(c, " z") }, o);
  }, e.prototype.getShape = function() {
    var t = this.getArrowAttributes(), n = t.d, o = t.strokeWidth, i = t.stroke, a = t.fill;
    return w(qr, { d: n, fill: a, strokeWidth: o, stroke: i });
  }, e.prototype.render = function() {
    return w("g", { className: "lf-arrow", children: this.getShape() });
  }, e;
})($);
var Uh = /* @__PURE__ */ (function() {
  var r = function(e, t) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, o) {
      n.__proto__ = o;
    } || function(n, o) {
      for (var i in o) Object.prototype.hasOwnProperty.call(o, i) && (n[i] = o[i]);
    }, r(e, t);
  };
  return function(e, t) {
    if (typeof t != "function" && t !== null)
      throw new TypeError("Class extends value " + String(t) + " is not a constructor or null");
    r(e, t);
    function n() {
      this.constructor = e;
    }
    e.prototype = t === null ? Object.create(t) : (n.prototype = t.prototype, new n());
  };
})(), Ur = function() {
  return Ur = Object.assign || function(r) {
    for (var e, t = 1, n = arguments.length; t < n; t++) {
      e = arguments[t];
      for (var o in e) Object.prototype.hasOwnProperty.call(e, o) && (r[o] = e[o]);
    }
    return r;
  }, Ur.apply(this, arguments);
}, Vh = function(r, e) {
  var t = typeof Symbol == "function" && r[Symbol.iterator];
  if (!t) return r;
  var n = t.call(r), o, i = [], a;
  try {
    for (; (e === void 0 || e-- > 0) && !(o = n.next()).done; ) i.push(o.value);
  } catch (s) {
    a = { error: s };
  } finally {
    try {
      o && !o.done && (t = n.return) && t.call(n);
    } finally {
      if (a) throw a.error;
    }
  }
  return i;
}, Eo = (
  /** @class */
  (function(r) {
    Uh(e, r);
    function e() {
      var t = r.call(this) || this;
      return t.textRef = Pi(), t.handleHover = function(n, o) {
        var i = t.props, a = i.model, s = i.graphModel.eventCenter;
        a.setHovered(n);
        var l = n ? C.EDGE_MOUSEENTER : C.EDGE_MOUSELEAVE, u = a.getData();
        s.emit(l, {
          data: u,
          e: o
        });
      }, t.setHoverOn = function(n) {
        var o = t.props.model.isHovered;
        o || (t.textRef && t.textRef.current && t.textRef.current.setHoverOn(), t.handleHover(!0, n));
      }, t.setHoverOff = function(n) {
        var o = t.props.model.isHovered;
        o && (t.textRef && t.textRef.current && t.textRef.current.setHoverOff(), t.handleHover(!1, n));
      }, t.handleContextMenu = function(n) {
        n.preventDefault(), t.contextMenuTime = (/* @__PURE__ */ new Date()).getTime(), t.clickTimer && clearTimeout(t.clickTimer);
        var o = t.props, i = o.model, a = o.graphModel, s = a.editConfigModel, l = a.getPointByClient({
          x: n.clientX,
          y: n.clientY
        });
        a.setElementStateById(i.id, q.SHOW_MENU, l.domOverlayPosition), s.isSilentMode || t.toFront(), i.isSelected || a.selectEdgeById(i.id);
        var u = i?.getData();
        a.eventCenter.emit(C.EDGE_CONTEXTMENU, {
          data: u,
          e: n,
          position: l
        });
      }, t.handleMouseDown = function(n) {
        n.stopPropagation(), t.startTime = (/* @__PURE__ */ new Date()).getTime(), t.longPressTimer && clearTimeout(t.longPressTimer), n.pointerType === "touch" && (t.longPressTimer = window.setTimeout(function() {
          t.props.model.isDragging || t.handleContextMenu(n);
        }, 500));
      }, t.handleMouseUp = function() {
        var n = t.props.model;
        t.mouseUpDrag = n.isDragging, t.longPressTimer && (clearTimeout(t.longPressTimer), t.longPressTimer = void 0);
      }, t.handleClick = function(n) {
        if (t.startTime && !t.mouseUpDrag) {
          var o = n.button === 2;
          if (!o) {
            var i = n.detail === 2, a = t.props, s = a.model, l = a.graphModel, u = s?.getData(), d = l.getPointByClient({
              x: n.clientX,
              y: n.clientY
            });
            if (i) {
              var f = l.editConfigModel, c = l.textEditElement, p = s.id, h = s.text, v = s.modelType;
              if (c && c.id === p && l.setElementStateById(p, q.DEFAULT), f.edgeTextEdit && h.editable && (s.setSelected(!1), l.setElementStateById(p, q.TEXT_EDIT)), v === G.POLYLINE_EDGE) {
                var g = s, y = l.getPointByClient({
                  x: n.x,
                  y: n.y
                }).canvasOverlayPosition, _ = y.x, S = y.y;
                g.dbClickPosition = zl({
                  x: _,
                  y: S
                }, g.points);
              }
              l.eventCenter.emit(C.EDGE_DBCLICK, {
                data: u,
                e: n,
                position: d
              });
            } else {
              l.eventCenter.emit(C.ELEMENT_CLICK, {
                data: u,
                e: n,
                position: d
              }), l.eventCenter.emit(C.EDGE_CLICK, {
                data: u,
                e: n,
                position: d
              });
              var A = n.currentTarget, x = !Me(window) && Fs(window.requestAnimationFrame) ? window.requestAnimationFrame.bind(window) : function(m) {
                return setTimeout(m, 0);
              };
              x(function() {
                A.focus();
              });
            }
            var E = l.editConfigModel;
            l.selectEdgeById(s.id, Vl(n, E)), E.isSilentMode || t.toFront();
          }
        }
      }, t.handleFocus = function() {
        var n = t.props, o = n.model, i = n.graphModel;
        i.eventCenter.emit(C.EDGE_FOCUS, {
          data: o.getData()
        });
      }, t.handleBlur = function() {
        var n = t.props, o = n.model, i = n.graphModel;
        i.eventCenter.emit(C.EDGE_BLUR, {
          data: o.getData()
        });
      }, t;
    }
    return e.prototype.getShape = function() {
      return w("g", { children: this.getEdge() });
    }, e.prototype.getTextStyle = function() {
    }, e.prototype.getText = function() {
      var t, n = this.props, o = n.model, i = n.graphModel, a = i.editConfigModel;
      if (a.edgeTextMode !== Xe.TEXT || o.state === q.TEXT_EDIT)
        return null;
      if (o.text) {
        var s = !1;
        return a.edgeTextDraggable && o.text.draggable && (s = !0), w(Dh, { ref: this.textRef, editable: a.edgeTextEdit && ((t = o.text.editable) !== null && t !== void 0 ? t : !0), model: o, graphModel: i, draggable: s });
      }
      return null;
    }, e.prototype.getArrowInfo = function() {
      var t = this.props.model, n = t.startPoint, o = t.endPoint, i = t.isSelected, a = this.state.hover;
      return {
        start: n,
        end: o,
        hover: a,
        isSelected: i
      };
    }, e.prototype.getLastTwoPoints = function() {
      var t = this.props.model, n = t.startPoint, o = t.endPoint;
      return [n, o];
    }, e.prototype.getArrowStyle = function() {
      return console.error("getArrowStyle is deprecated in 1.2.0, please use model.getArrowStyle"), null;
    }, e.prototype.getArrow = function() {
      var t = this.props.model, n = t.id, o = t.getArrowStyle(), i = o.refY, a = i === void 0 ? 0 : i, s = o.refX, l = s === void 0 ? 2 : s, u = Vh(this.getLastTwoPoints(), 2), d = u[0], f = u[1], c = "auto";
      if (d && f) {
        var p = f.x - d.x, h = f.y - d.y;
        if (p !== 0 || h !== 0) {
          var v = ip(op({
            x: p,
            y: h
          }));
          Number.isFinite(v) && !Number.isNaN(v) && (c = v);
        }
      }
      return w("g", { children: w("defs", { children: [w("marker", { id: "marker-start-".concat(n), refX: -l, refY: a, overflow: "visible", orient: "auto", markerUnits: "userSpaceOnUse", children: this.getStartArrow() }), w("marker", { id: "marker-end-".concat(n), refX: l, refY: a, overflow: "visible", orient: c, markerUnits: "userSpaceOnUse", children: this.getEndArrow() })] }) });
    }, e.prototype.getArrowPath = function(t, n) {
      var o = n.stroke, i = n.fill, a = i === void 0 ? o : i, s = n.strokeWidth, l = n.offset, u = l === void 0 ? 10 : l, d = n.verticalLength, f = n.strokeLinecap, c = n.strokeLinejoin, p = n.transform, h = "";
      switch (t) {
        case "solid":
          h = "M".concat(-u / 4, ",0 L").concat(3 * u / 4, ",").concat(d, " L").concat(3 * u / 4, ",-").concat(d, " Z");
          break;
        case "hollow":
          h = "M".concat(-u / 4, ",0 L").concat(3 * u / 4, ",").concat(d, " L").concat(-u / 4, ",0 L").concat(3 * u / 4, ",-").concat(d, " L").concat(-u / 4, ",0 Z");
          break;
        case "diamond":
          h = "M".concat(-u / 2, ",0 L0,").concat(d, " L").concat(u / 2, ",0 L0,-").concat(d, " L").concat(-u / 2, ",0 Z");
          break;
        case "circle":
          h = "M".concat(-u / 2, ",0 A").concat(u / 4, ",").concat(u / 4, " 0 1,0 ").concat(u / 2, ",0 A").concat(u / 4, ",").concat(u / 4, " 0 1,0 ").concat(-u / 2, ",0 Z");
          break;
        default:
          h = "";
          break;
      }
      return w("path", { d: h, stroke: o, fill: a, strokeWidth: s, strokeLinecap: f, strokeLinejoin: c, transform: p });
    }, e.prototype.getStartArrow = function() {
      var t = this.props.model, n = t.getArrowStyle(), o = n.stroke, i = n.strokeWidth, a = n.offset, s = n.verticalLength, l = n.startArrowType, u = l === void 0 ? "none" : l, d = n.strokeLinecap, f = n.strokeLinejoin;
      return this.getArrowPath(u, {
        stroke: o,
        strokeWidth: i,
        offset: a,
        verticalLength: s,
        strokeLinecap: d,
        strokeLinejoin: f
      });
    }, e.prototype.getEndArrow = function() {
      var t = this.props.model, n = t.getArrowStyle(), o = n.stroke, i = n.strokeWidth, a = n.offset, s = n.verticalLength, l = n.endArrowType, u = l === void 0 ? "solid" : l, d = n.strokeLinecap, f = n.strokeLinejoin;
      return this.getArrowPath(u, {
        stroke: o,
        strokeWidth: i,
        offset: a,
        verticalLength: s,
        strokeLinecap: d,
        strokeLinejoin: f,
        transform: "rotate(180)"
      });
    }, e.prototype.getAdjustPointShape = function(t, n, o) {
      var i = o.getAdjustPointStyle();
      return w(mr, Ur({ className: "lf-edge-adjust-point" }, i, { x: t, y: n }));
    }, e.prototype.getAdjustPoints = function() {
      var t = this.props, n = t.model, o = t.graphModel, i = o.editConfigModel, a = i.adjustEdgeStartAndEnd, s = i.adjustEdgeStart, l = i.adjustEdgeEnd, u = n.getAdjustStart(), d = n.getAdjustEnd();
      return w("g", { children: [a && s && w(Ns, Ur({ type: it.SOURCE }, u, { getAdjustPointShape: this.getAdjustPointShape, edgeModel: n, graphModel: o })), a && l && w(Ns, Ur({ type: it.TARGET }, d, { getAdjustPointShape: this.getAdjustPointShape, edgeModel: n, graphModel: o }))] });
    }, e.prototype.getAnimation = function() {
      console.error("getAnimation is deprecated in 1.2.0, please use model.getEdgeAnimationStyle");
    }, e.prototype.getAppendWidth = function() {
      return w("g", {});
    }, e.prototype.getAppend = function() {
      return w("g", { className: "lf-edge-append", children: this.getAppendWidth() });
    }, e.prototype.getEdge = function() {
      return null;
    }, e.prototype.toFront = function() {
      var t = this.props, n = t.graphModel, o = t.model;
      n.toFront(o.id);
    }, e.prototype.render = function() {
      var t = this.props.model, n = t.isSelected, o = t.isHitable, i = t.isShowAdjustPoint;
      return w("g", { children: [w("g", { className: [
        "lf-edge",
        !o && "pointer-none",
        n && "lf-edge-selected"
      ].filter(Boolean).join(" "), style: {
        touchAction: "none",
        WebkitTouchCallout: "none"
      }, onClick: this.handleClick, onContextMenu: this.handleContextMenu, onPointerDown: this.handleMouseDown, onPointerUp: this.handleMouseUp, onPointerCancel: this.handleMouseUp, onMouseOver: this.setHoverOn, onMouseEnter: this.setHoverOn, onMouseLeave: this.setHoverOff, onFocus: this.handleFocus, onBlur: this.handleBlur, children: [this.getShape(), this.getAppend(), this.getText(), this.getArrow()] }), i && n ? this.getAdjustPoints() : ""] });
    }, e.isObserved = !1, e;
  })($)
), $h = /* @__PURE__ */ (function() {
  var r = function(e, t) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, o) {
      n.__proto__ = o;
    } || function(n, o) {
      for (var i in o) Object.prototype.hasOwnProperty.call(o, i) && (n[i] = o[i]);
    }, r(e, t);
  };
  return function(e, t) {
    if (typeof t != "function" && t !== null)
      throw new TypeError("Class extends value " + String(t) + " is not a constructor or null");
    r(e, t);
    function n() {
      this.constructor = e;
    }
    e.prototype = t === null ? Object.create(t) : (n.prototype = t.prototype, new n());
  };
})(), xi = function() {
  return xi = Object.assign || function(r) {
    for (var e, t = 1, n = arguments.length; t < n; t++) {
      e = arguments[t];
      for (var o in e) Object.prototype.hasOwnProperty.call(e, o) && (r[o] = e[o]);
    }
    return r;
  }, xi.apply(this, arguments);
}, Wh = function(r, e) {
  var t = typeof Symbol == "function" && r[Symbol.iterator];
  if (!t) return r;
  var n = t.call(r), o, i = [], a;
  try {
    for (; (e === void 0 || e-- > 0) && !(o = n.next()).done; ) i.push(o.value);
  } catch (s) {
    a = { error: s };
  } finally {
    try {
      o && !o.done && (t = n.return) && t.call(n);
    } finally {
      if (a) throw a.error;
    }
  }
  return i;
}, Cs = (
  /** @class */
  (function(r) {
    $h(e, r);
    function e() {
      return r !== null && r.apply(this, arguments) || this;
    }
    return e.prototype.getEdge = function() {
      var t = this.props.model, n = t.getEdgeStyle(), o = t, i = o.path, a = o.isAnimation, s = o.arrowConfig, l = t.getEdgeAnimationStyle(), u = l.strokeDasharray, d = l.stroke, f = l.strokeDashoffset, c = l.animationName, p = l.animationDuration, h = l.animationIterationCount, v = l.animationTimingFunction, g = l.animationDirection;
      return w(qr, xi({ d: i }, n, s, a ? {
        strokeDasharray: u,
        stroke: d,
        style: {
          strokeDashoffset: f,
          animationName: c,
          animationDuration: p,
          animationIterationCount: h,
          animationTimingFunction: v,
          animationDirection: g
        }
      } : {}));
    }, e.prototype.getAppendWidth = function() {
      var t = this.props.model.path;
      return w(qr, { d: t, strokeWidth: 10, stroke: "transparent", fill: "none" });
    }, e.prototype.getArrowInfo = function() {
      var t = this.props.model, n = this.state.hover, o = t.isSelected, i = t.getArrowStyle().offset, a = t.pointsList.map(function(f) {
        return {
          x: f.x,
          y: f.y
        };
      }), s = Wh(Za(a, i), 2), l = s[0], u = s[1], d = {
        start: l,
        end: u,
        hover: n,
        isSelected: o
      };
      return d;
    }, e.prototype.getLastTwoPoints = function() {
      var t = this.props.model, n = t.getArrowStyle().offset, o = t.pointsList.map(function(i) {
        return {
          x: i.x,
          y: i.y
        };
      });
      return Za(o, n);
    }, e;
  })(Eo)
), Kh = /* @__PURE__ */ (function() {
  var r = function(e, t) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, o) {
      n.__proto__ = o;
    } || function(n, o) {
      for (var i in o) Object.prototype.hasOwnProperty.call(o, i) && (n[i] = o[i]);
    }, r(e, t);
  };
  return function(e, t) {
    if (typeof t != "function" && t !== null)
      throw new TypeError("Class extends value " + String(t) + " is not a constructor or null");
    r(e, t);
    function n() {
      this.constructor = e;
    }
    e.prototype = t === null ? Object.create(t) : (n.prototype = t.prototype, new n());
  };
})(), Ei = function() {
  return Ei = Object.assign || function(r) {
    for (var e, t = 1, n = arguments.length; t < n; t++) {
      e = arguments[t];
      for (var o in e) Object.prototype.hasOwnProperty.call(e, o) && (r[o] = e[o]);
    }
    return r;
  }, Ei.apply(this, arguments);
}, Ls = (
  /** @class */
  (function(r) {
    Kh(e, r);
    function e() {
      return r !== null && r.apply(this, arguments) || this;
    }
    return e.prototype.getEdge = function() {
      var t = this.props.model, n = t.startPoint, o = t.endPoint, i = t.isAnimation, a = t.arrowConfig, s = t.getEdgeStyle(), l = t.getEdgeAnimationStyle(), u = l.strokeDasharray, d = l.stroke, f = l.strokeDashoffset, c = l.animationName, p = l.animationDuration, h = l.animationIterationCount, v = l.animationTimingFunction, g = l.animationDirection;
      return w(_r, Ei({}, s, { x1: n.x, y1: n.y, x2: o.x, y2: o.y }, a, i ? {
        strokeDasharray: u,
        stroke: d,
        style: {
          strokeDashoffset: f,
          animationName: c,
          animationDuration: p,
          animationIterationCount: h,
          animationTimingFunction: v,
          animationDirection: g
        }
      } : {}));
    }, e.prototype.getAppendWidth = function() {
      var t = this.props.model, n = t.startPoint, o = t.endPoint, i = {
        start: n,
        end: o
      }, a = dc(i), s = a.d, l = a.strokeWidth, u = a.fill, d = a.strokeDasharray, f = a.stroke;
      return w(qr, { d: s, fill: u, strokeWidth: l, stroke: f, strokeDasharray: d });
    }, e;
  })(Eo)
), Zh = /* @__PURE__ */ (function() {
  var r = function(e, t) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, o) {
      n.__proto__ = o;
    } || function(n, o) {
      for (var i in o) Object.prototype.hasOwnProperty.call(o, i) && (n[i] = o[i]);
    }, r(e, t);
  };
  return function(e, t) {
    if (typeof t != "function" && t !== null)
      throw new TypeError("Class extends value " + String(t) + " is not a constructor or null");
    r(e, t);
    function n() {
      this.constructor = e;
    }
    e.prototype = t === null ? Object.create(t) : (n.prototype = t.prototype, new n());
  };
})(), Nt = function() {
  return Nt = Object.assign || function(r) {
    for (var e, t = 1, n = arguments.length; t < n; t++) {
      e = arguments[t];
      for (var o in e) Object.prototype.hasOwnProperty.call(e, o) && (r[o] = e[o]);
    }
    return r;
  }, Nt.apply(this, arguments);
}, qh = function(r, e) {
  var t = typeof Symbol == "function" && r[Symbol.iterator];
  if (!t) return r;
  var n = t.call(r), o, i = [], a;
  try {
    for (; (e === void 0 || e-- > 0) && !(o = n.next()).done; ) i.push(o.value);
  } catch (s) {
    a = { error: s };
  } finally {
    try {
      o && !o.done && (t = n.return) && t.call(n);
    } finally {
      if (a) throw a.error;
    }
  }
  return i;
}, js = (
  /** @class */
  (function(r) {
    Zh(e, r);
    function e() {
      var t = r.call(this) || this;
      return t.onDragStart = function() {
        var n = t.props.model;
        n.dragAppendStart(), t.isShowAdjustPointTemp = n.isShowAdjustPoint, n.isShowAdjustPoint = !1;
      }, t.onDragging = function(n) {
        var o = n.deltaX, i = n.deltaY, a = t.props, s = a.model, l = a.graphModel;
        t.isDragging = !0;
        var u = l.transformModel, d = l.editConfigModel, f = qh(u.fixDeltaXY(o, i), 2), c = f[0], p = f[1], h = s, v = d.adjustEdgeMiddle;
        v ? t.appendInfo = h.dragAppendSimple(t.appendInfo, {
          x: c,
          y: p
        }) : t.appendInfo = h.dragAppend(t.appendInfo, {
          x: c,
          y: p
        });
      }, t.onDragEnd = function() {
        var n, o = t.props, i = o.model, a = o.graphModel.eventCenter, s = i;
        s.dragAppendEnd(), t.isDragging = !1, s.isShowAdjustPoint = (n = t.isShowAdjustPointTemp) !== null && n !== void 0 ? n : !1, t.appendInfo = void 0, a.emit(C.EDGE_ADJUST, { data: s.getData() });
      }, t.beforeDragStart = function(n, o) {
        o.draggable && t.drag.handleMouseDown(n), t.appendInfo = o;
      }, t.drag = new ut({
        onDragStart: t.onDragStart,
        onDragging: t.onDragging,
        onDragEnd: t.onDragEnd,
        isStopPropagation: !1
      }), t;
    }
    return e.prototype.getEdge = function() {
      var t, n, o = this.props.model, i = o.points, a = o.isAnimation, s = o.arrowConfig, l = o.properties, u = o.getEdgeStyle(), d = o.getEdgeAnimationStyle(), f = d.strokeDasharray, c = d.stroke, p = d.strokeDashoffset, h = d.animationName, v = d.animationDuration, g = d.animationIterationCount, y = d.animationTimingFunction, _ = d.animationDirection, S = (n = (t = l?.radius) !== null && t !== void 0 ? t : u?.radius) !== null && n !== void 0 ? n : 0, A = (function() {
        if (!S || S <= 0)
          return i;
        var x = Et(i), E = Ul(x, S, !1);
        return E.map(function(m) {
          return "".concat(m.x, ",").concat(m.y);
        }).join(" ");
      })();
      return w(Bc, Nt({ points: A }, u, s, a ? {
        strokeDasharray: f,
        stroke: c,
        style: {
          strokeDashoffset: p,
          animationName: h,
          animationDuration: v,
          animationIterationCount: g,
          animationTimingFunction: y,
          animationDirection: _
        }
      } : {}));
    }, e.prototype.getArrowInfo = function() {
      var t = this.props.model, n = t.points, o = t.isSelected, i = this.state.hover, a = Et(n), s = a[0], l = a[0];
      return a.length >= 2 && (s = a[a.length - 2], l = a[a.length - 1]), {
        start: s,
        end: l,
        hover: i,
        isSelected: o
      };
    }, e.prototype.getLastTwoPoints = function() {
      var t = this.props.model, n = t.points, o = Et(n), i = o[0], a = o[0];
      return o.length >= 2 && (i = o[o.length - 2], a = o[o.length - 1]), [i, a];
    }, e.prototype.getAppendAttributes = function(t) {
      var n = t.start, o = t.end, i;
      if (n.x === o.x && n.y === o.y)
        i = "";
      else {
        var a = {
          start: n,
          end: o,
          offset: 10,
          verticalLength: 5
        }, s = Kr(Nt(Nt({}, a), { type: "start" })), l = Kr(Nt(Nt({}, a), { type: "end" }));
        i = "M".concat(s.leftX, " ").concat(s.leftY, `
      L`).concat(s.rightX, " ").concat(s.rightY, `
      L`).concat(l.rightX, " ").concat(l.rightY, `
      L`).concat(l.leftX, " ").concat(l.leftY, " z");
      }
      return {
        d: i,
        fill: "transparent",
        stroke: "transparent",
        strokeWidth: 1,
        strokeDasharray: "4, 4"
      };
    }, e.prototype.getAppendShape = function(t) {
      var n = this.getAppendAttributes(t), o = n.d, i = n.strokeWidth, a = n.fill, s = n.strokeDasharray, l = n.stroke;
      return w(qr, { d: o, fill: a, strokeWidth: i, stroke: l, strokeDasharray: s });
    }, e.prototype.getAppendWidth = function() {
      for (var t = this, n = this.props, o = n.model, i = n.graphModel, a = o.pointsList, s = o.draggable, l = [], u = a.length, d = function(p) {
        var h = "lf-polyline-append", v = {
          start: {
            x: a[p].x,
            y: a[p].y
          },
          end: {
            x: a[p + 1].x,
            y: a[p + 1].y
          },
          startIndex: p,
          endIndex: p + 1,
          direction: z.HORIZONTAL,
          draggable: !0
        }, g = w("g", { className: h, children: f.getAppendShape(v) }), y = i.editConfigModel, _ = y.adjustEdge, S = y.adjustEdgeMiddle;
        if (_ && s) {
          var A = v.startIndex, x = v.endIndex, E = S && (A === 0 || x === u - 1);
          v.draggable = !E, v.start.x === v.end.x ? (v.draggable && (h += "-ew-resize"), v.direction = z.VERTICAL) : v.start.y === v.end.y && (v.draggable && (h += "-ns-resize"), v.direction = z.HORIZONTAL), g = w("g", { className: f.isDragging ? "lf-dragging" : "lf-drag-able", onPointerDown: function(m) {
            return t.beforeDragStart(m, v);
          }, children: w("g", { className: h, children: f.getAppendShape(v) }) });
        }
        l.push(g);
      }, f = this, c = 0; c < u - 1; c++)
        d(c);
      return w("g", { children: l });
    }, e;
  })(Eo)
), ar = function() {
  return ar = Object.assign || function(r) {
    for (var e, t = 1, n = arguments.length; t < n; t++) {
      e = arguments[t];
      for (var o in e) Object.prototype.hasOwnProperty.call(e, o) && (r[o] = e[o]);
    }
    return r;
  }, ar.apply(this, arguments);
}, Jh = (
  /** @class */
  (function() {
    function r(e) {
      var t = this;
      this.nodeConfig = null, this.fakeNode = null, this.stopDrag = function() {
        t.nodeConfig = null, t.docPointerMove && window.document.removeEventListener("pointermove", t.docPointerMove), t.docPointerUp && window.document.removeEventListener("pointerup", t.docPointerUp);
      }, this.dragEnter = function(o) {
        !t.nodeConfig || t.fakeNode || (t.fakeNode = t.lf.createFakeNode(ar(ar({}, t.nodeConfig), t.clientToLocalPoint({
          x: o.clientX,
          y: o.clientY
        }))));
      }, this.onDragOver = function(o) {
        if (t.lf.graphModel.eventCenter.emit(C.BLANK_CANVAS_MOUSEMOVE, {
          e: o
        }), o.preventDefault(), t.fakeNode) {
          var i = t.clientToLocalPoint({
            x: o.clientX,
            y: o.clientY
          }), a = i.x, s = i.y;
          t.fakeNode.moveTo(a, s);
          var l = t.fakeNode.getData();
          t.lf.setNodeSnapLine(l), t.lf.graphModel.eventCenter.emit(C.NODE_DND_DRAG, {
            data: l,
            e: o
          });
        }
        return !1;
      }, this.onDragLeave = function() {
        t.fakeNode && (t.lf.removeNodeSnapLine(), t.lf.graphModel.removeFakeNode(), t.fakeNode = null);
      }, this.onDrop = function(o) {
        !t.lf.graphModel || !o || !t.nodeConfig || (t.lf.addNode(ar(ar({}, t.nodeConfig), t.clientToLocalPoint({
          x: o.clientX,
          y: o.clientY
        })), C.NODE_DND_ADD, o), o.preventDefault(), o.stopPropagation(), t.nodeConfig = null, t.lf.removeNodeSnapLine(), t.lf.graphModel.removeFakeNode(), t.fakeNode = null);
      };
      var n = e.lf;
      this.lf = n;
    }
    return r.prototype.clientToLocalPoint = function(e) {
      var t = e.x, n = e.y, o = uo(this.lf.options, ["grid", "size"]), i = this.lf.graphModel.getPointByClient({
        x: t,
        y: n
      }), a = i.canvasOverlayPosition, s = a.x, l = a.y, u = this.lf.graphModel.editConfigModel.snapGrid;
      return {
        x: gr(s, o, u),
        y: gr(l, o, u)
      };
    }, r.prototype.isInsideCanvas = function(e) {
      var t = this.lf.graphModel.rootEl.querySelector('[name="canvas-overlay"]'), n = window.document.elementFromPoint(e.clientX, e.clientY);
      return n === t || n !== null && !!t && t.contains(n);
    }, r.prototype.startDrag = function(e) {
      var t = this, n = this.lf.graphModel.editConfigModel;
      n?.isSilentMode || (this.nodeConfig = e, this.docPointerMove = function(o) {
        if (t.nodeConfig) {
          if (!t.isInsideCanvas(o)) {
            t.onDragLeave();
            return;
          }
          if (!t.fakeNode) {
            t.dragEnter(o);
            return;
          }
          t.onDragOver(o);
        }
      }, this.docPointerUp = function(o) {
        t.nodeConfig && (t.isInsideCanvas(o) ? t.onDrop(o) : t.onDragLeave(), o.preventDefault(), o.stopPropagation(), t.stopDrag());
      }, window.document.addEventListener("pointermove", this.docPointerMove), window.document.addEventListener("pointerup", this.docPointerUp));
    }, r;
  })()
);
function Qh(r, e) {
  r.on("node:mousemove", function(t) {
    var n = t.data;
    e.setNodeSnapLine(n);
  }), r.on("node:mouseup", function() {
    e.clearSnapline();
  });
}
var ev = /* @__PURE__ */ (function() {
  var r = function(e, t) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, o) {
      n.__proto__ = o;
    } || function(n, o) {
      for (var i in o) Object.prototype.hasOwnProperty.call(o, i) && (n[i] = o[i]);
    }, r(e, t);
  };
  return function(e, t) {
    if (typeof t != "function" && t !== null)
      throw new TypeError("Class extends value " + String(t) + " is not a constructor or null");
    r(e, t);
    function n() {
      this.constructor = e;
    }
    e.prototype = t === null ? Object.create(t) : (n.prototype = t.prototype, new n());
  };
})(), dt = function() {
  return dt = Object.assign || function(r) {
    for (var e, t = 1, n = arguments.length; t < n; t++) {
      e = arguments[t];
      for (var o in e) Object.prototype.hasOwnProperty.call(e, o) && (r[o] = e[o]);
    }
    return r;
  }, dt.apply(this, arguments);
}, tv = function(r, e, t, n) {
  var o = arguments.length, i = o < 3 ? e : n === null ? n = Object.getOwnPropertyDescriptor(e, t) : n, a;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") i = Reflect.decorate(r, e, t, n);
  else for (var s = r.length - 1; s >= 0; s--) (a = r[s]) && (i = (o < 3 ? a(i) : o > 3 ? a(e, t, i) : a(e, t)) || i);
  return o > 3 && i && Object.defineProperty(e, t, i), i;
}, rv = function(r, e) {
  var t = typeof Symbol == "function" && r[Symbol.iterator];
  if (!t) return r;
  var n = t.call(r), o, i = [], a;
  try {
    for (; (e === void 0 || e-- > 0) && !(o = n.next()).done; ) i.push(o.value);
  } catch (s) {
    a = { error: s };
  } finally {
    try {
      o && !o.done && (t = n.return) && t.call(n);
    } finally {
      if (a) throw a.error;
    }
  }
  return i;
}, nv = (
  /** @class */
  (function(r) {
    ev(e, r);
    function e(t) {
      var n = r.call(this, t) || this;
      return n.ref = Pi(), n.__prevText = {
        type: "",
        text: "",
        id: ""
      }, n.keyupHandler = function(o) {
        var i = n.props.graphModel.textEditElement;
        o.key === "Enter" && o.altKey && i?.setElementState(q.DEFAULT);
      }, n.inputHandler = function(o) {
        var i = o.target.innerText, a = n.props.graphModel.textEditElement;
        a && (n.__prevText = {
          type: a.type,
          text: i.replace(/(\r\n)+$|(\n)+$/, ""),
          // fix #488: 文本后面的换行符不保留
          id: a.id
        });
      }, n.keydownHandler = function(o) {
        o.stopPropagation();
      }, n.state = {
        style: {
          left: 0,
          top: 0
        }
      }, n;
    }
    return e.getDerivedStateFromProps = function(t) {
      var n, o = t.textEditElement, i = t.graphModel, a = i.transformModel, s = i.theme, l = s.inputText, u;
      if (o) {
        if (!(!((n = o.text) === null || n === void 0) && n.value) && o.BaseType === fe.EDGE) {
          var d = o.text, f = o.textPosition, c = f.x, p = f.y;
          d.x = c, d.y = p, o.setText(d);
        }
        var h = {
          resize: "auto",
          whiteSpace: "normal",
          wordBreak: "break-all"
        };
        if (o.BaseType === fe.EDGE) {
          var v = s.edgeText, g = v.overflowMode, y = v.lineHeight, _ = v.wrapPadding, S = v.textWidth;
          S && g === "autoWrap" && (u = dt(dt({}, h), { width: S, minWidth: S, lineHeight: y, padding: _ }));
        } else if (o.BaseType === fe.NODE) {
          var A = s.nodeText, g = A.overflowMode, y = A.lineHeight, _ = A.wrapPadding, S = A.textWidth, x = o.width, E = o.modelType, m = o.textWidth, b = m || S || x;
          (E !== G.TEXT_NODE && g === "autoWrap" || E === G.TEXT_NODE && S) && (u = dt(dt({}, h), { width: b, minWidth: b, lineHeight: y, padding: _ }));
        }
        var P = o.text, D = P.x, k = P.y, Y = rv(a.CanvasPointToHtmlPoint([D, k]), 2), J = Y[0], H = Y[1];
        return {
          style: dt(dt({ left: J, top: H }, u), l)
        };
      }
      return null;
    }, e.prototype.componentDidUpdate = function() {
      var t = this.props.graphModel;
      if (this.ref.current && (this.ref.current.focus(), this.placeCaretAtEnd(this.ref.current)), this.__prevText.id !== "") {
        var n = this.__prevText, o = n.text, i = n.id;
        t.updateText(i, o), t.eventCenter.emit(C.TEXT_UPDATE, {
          data: dt({}, this.__prevText)
        }), this.__prevText.id = "", this.__prevText.text = "", this.__prevText.type = "";
      }
    }, e.prototype.placeCaretAtEnd = function(t) {
      if (window.getSelection !== void 0 && document.createRange !== void 0) {
        var n = document.createRange();
        n.selectNodeContents(t), n.collapse(!1);
        var o = window.getSelection();
        o?.removeAllRanges(), o?.addRange(n);
      }
    }, e.prototype.render = function() {
      var t, n = this.props.graphModel.textEditElement, o = this.state.style;
      return n ? w("div", { contentEditable: !0, className: "lf-text-input", style: o, ref: this.ref, onKeyUp: this.keyupHandler, onKeyDown: this.keydownHandler, onKeyPress: this.keydownHandler, onInput: this.inputHandler, children: (t = n.text) === null || t === void 0 ? void 0 : t.value }, n.id) : null;
    }, e.toolName = "text-edit-tool", e = tv([
      je
    ], e), e;
  })($)
), ov = /* @__PURE__ */ (function() {
  var r = function(e, t) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, o) {
      n.__proto__ = o;
    } || function(n, o) {
      for (var i in o) Object.prototype.hasOwnProperty.call(o, i) && (n[i] = o[i]);
    }, r(e, t);
  };
  return function(e, t) {
    if (typeof t != "function" && t !== null)
      throw new TypeError("Class extends value " + String(t) + " is not a constructor or null");
    r(e, t);
    function n() {
      this.constructor = e;
    }
    e.prototype = t === null ? Object.create(t) : (n.prototype = t.prototype, new n());
  };
})(), iv = function(r, e, t, n) {
  var o = arguments.length, i = o < 3 ? e : n === null ? n = Object.getOwnPropertyDescriptor(e, t) : n, a;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") i = Reflect.decorate(r, e, t, n);
  else for (var s = r.length - 1; s >= 0; s--) (a = r[s]) && (i = (o < 3 ? a(i) : o > 3 ? a(e, t, i) : a(e, t)) || i);
  return o > 3 && i && Object.defineProperty(e, t, i), i;
}, Ro = function(r, e) {
  var t = typeof Symbol == "function" && r[Symbol.iterator];
  if (!t) return r;
  var n = t.call(r), o, i = [], a;
  try {
    for (; (e === void 0 || e-- > 0) && !(o = n.next()).done; ) i.push(o.value);
  } catch (s) {
    a = { error: s };
  } finally {
    try {
      o && !o.done && (t = n.return) && t.call(n);
    } finally {
      if (a) throw a.error;
    }
  }
  return i;
}, av = function(r, e, t) {
  if (t || arguments.length === 2) for (var n = 0, o = e.length, i; n < o; n++)
    (i || !(n in e)) && (i || (i = Array.prototype.slice.call(e, 0, n)), i[n] = e[n]);
  return r.concat(i || Array.prototype.slice.call(e));
}, sv = (
  /** @class */
  (function(r) {
    ov(e, r);
    function e(t) {
      var n = r.call(this, t) || this;
      n.handleMouseDown = function(s) {
        var l = n.props, u = l.graphModel.gridSize, d = l.lf, f = d.getTransform().SCALE_X;
        n.stepDrag.setStep(u * f), n.stepDrag.handleMouseDown(s);
      }, n.handleWheelEvent = function(s) {
        var l, u;
        s.preventDefault();
        var d = s.deltaX, f = s.deltaY, c = s.clientX, p = s.clientY, h = s.ctrlKey, v = new WheelEvent("wheel", {
          deltaX: d,
          deltaY: f,
          clientX: c,
          clientY: p,
          ctrlKey: h
        });
        (u = (l = n.props.lf.container) === null || l === void 0 ? void 0 : l.querySelector('.lf-canvas-overlay[name="canvas-overlay"]')) === null || u === void 0 || u.dispatchEvent(v);
      }, n.onDragging = function(s) {
        var l = s.deltaX, u = s.deltaY, d = n.props, f = d.graphModel, c = d.lf, p = c.getTransform(), h = p.SCALE_X, v = p.SCALE_Y, g = f.getSelectElements(!0);
        f.moveNodes(g.nodes.map(function(y) {
          return y.id;
        }), l / h, u / v);
      }, n.handleContextMenu = function(s) {
        s.preventDefault();
        var l = n.props, u = l.graphModel, d = l.graphModel, f = d.eventCenter, c = d.selectElements, p = u.getPointByClient({
          x: s.clientX,
          y: s.clientY
        }), h = {
          nodes: [],
          edges: []
        }, v = av([], Ro(c.values()), !1);
        v.forEach(function(g) {
          g.BaseType === fe.NODE && h.nodes.push(g.getData()), g.BaseType === fe.EDGE && h.edges.push(g.getData());
        }), f.emit(C.SELECTION_CONTEXTMENU, {
          data: h,
          e: s,
          position: p
        });
      };
      var o = t.graphModel, i = o.gridSize, a = o.eventCenter;
      return n.stepDrag = new ut({
        onDragging: n.onDragging,
        step: i,
        eventType: "SELECTION",
        eventCenter: a
      }), n;
    }
    return e.prototype.render = function() {
      var t, n, o = this.props.graphModel, i = o.selectElements, a = o.transformModel, s = o.theme, l = this.props.lf.getTransform(), u = l.SCALE_X, d = l.SCALE_Y, f = s.multiSelect || {}, c = f.xPadding, p = c === void 0 ? 8 : c, h = f.yPadding, v = h === void 0 ? 8 : h;
      if (!(i.size <= 1)) {
        var g = Number.MAX_SAFE_INTEGER, y = Number.MAX_SAFE_INTEGER, _ = Number.MIN_SAFE_INTEGER, S = Number.MIN_SAFE_INTEGER;
        i.forEach(function(x) {
          var E;
          x.BaseType === fe.NODE && (E = $f(x)), x.BaseType === fe.EDGE && (E = qf(x)), E !== void 0 && (g = Math.min(g, E.x), y = Math.min(y, E.y), _ = Math.max(_, E.x1), S = Math.max(S, E.y1));
        }), t = Ro(a.CanvasPointToHtmlPoint([g, y]), 2), g = t[0], y = t[1], n = Ro(a.CanvasPointToHtmlPoint([_, S]), 2), _ = n[0], S = n[1];
        var A = {
          left: "".concat(g - 20 * u / 2 - p / 2, "px"),
          top: "".concat(y - 20 * d / 2 - v / 2, "px"),
          width: "".concat(_ - g + 20 * u + p, "px"),
          height: "".concat(S - y + 20 * d + v, "px"),
          "border-width": "".concat(2 * u, "px")
        };
        return w("div", { className: "lf-multiple-select", style: A, onPointerDown: this.handleMouseDown, onContextMenu: this.handleContextMenu, onWheel: this.handleWheelEvent });
      }
    }, e.toolName = "multiple-select-tool", e = iv([
      je
    ], e), e;
  })($)
), Io = function(r, e, t, n) {
  var o = arguments.length, i = o < 3 ? e : n === null ? n = Object.getOwnPropertyDescriptor(e, t) : n, a;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") i = Reflect.decorate(r, e, t, n);
  else for (var s = r.length - 1; s >= 0; s--) (a = r[s]) && (i = (o < 3 ? a(i) : o > 3 ? a(e, t, i) : a(e, t)) || i);
  return o > 3 && i && Object.defineProperty(e, t, i), i;
}, lv = [nv, sv], uv = (
  /** @class */
  (function() {
    function r(e) {
      var t = this;
      this.toolMap = /* @__PURE__ */ new Map(), this.disabledToolMap = /* @__PURE__ */ new Map(), this.instance = e, pe(lv, function(i) {
        t.isDisabled(i.toolName) || t.registerTool(i.toolName, i);
      });
      var n = e.graphModel, o = n.eventCenter;
      o.on("".concat(C.GRAPH_TRANSFORM, ",").concat(C.NODE_CLICK, ",").concat(C.BLANK_CLICK, " "), function() {
        var i, a = n.textEditElement, s = n.editConfigModel, l = s.edgeTextEdit, u = s.nodeTextEdit;
        (l || u) && a && ((i = n.textEditElement) === null || i === void 0 || i.setElementState(q.DEFAULT));
      });
    }
    return r.prototype.isDisabled = function(e) {
      var t;
      return ((t = this.instance.options.disabledTools) === null || t === void 0 ? void 0 : t.indexOf(e)) !== -1;
    }, r.prototype.registerTool = function(e, t) {
      this.toolMap.set(e, t);
    }, r.prototype.disableTool = function(e) {
      var t = this.toolMap.get(e);
      if (t)
        return this.disabledToolMap.set(e, t), this.toolMap.delete(e), !0;
      throw new Error("禁用失败，不存在名为 ".concat(t, " 的工具"));
    }, r.prototype.enableTool = function(e) {
      var t = this.disabledToolMap.get(e);
      if (t)
        return this.toolMap.set(e, t), this.disabledToolMap.delete(e), !0;
      throw new Error("不存在名为 ".concat(t, " 的工具"));
    }, r.prototype.getTools = function() {
      return Array.from(this.toolMap.values());
    }, r.prototype.getInstance = function() {
      return this.instance;
    }, r.prototype.destroy = function() {
      this.toolMap.clear(), this.disabledToolMap.clear();
    }, Io([
      M
    ], r.prototype, "toolMap", void 0), Io([
      O
    ], r.prototype, "disableTool", null), Io([
      O
    ], r.prototype, "enableTool", null), r;
  })()
);
function dv(r) {
  throw new Error("[mobx-utils] " + r);
}
function ao(r, e) {
  e === void 0 && (e = "Illegal state"), r || dv(e);
}
var ru = function(r) {
  return r && r !== Object.prototype && Object.getOwnPropertyNames(r).concat(ru(Object.getPrototypeOf(r)) || []);
}, fv = function(r) {
  var e = ru(r), t = e.filter(function(n, o) {
    return e.indexOf(n) === o;
  });
  return t;
}, cv = function(r) {
  return fv(r).filter(function(e) {
    return e !== "constructor" && !~e.indexOf("__");
  });
}, nu = "pending", so = "fulfilled", $i = "rejected";
function pv(r) {
  switch (this.state) {
    case nu:
      return r.pending && r.pending(this.value);
    case $i:
      return r.rejected && r.rejected(this.value);
    case so:
      return r.fulfilled ? r.fulfilled(this.value) : this.value;
  }
}
function Rs(r, e) {
  if (ao(arguments.length <= 2, "fromPromise expects up to two arguments"), ao(typeof r == "function" || typeof r == "object" && r && typeof r.then == "function", "Please pass a promise or function to fromPromise"), r.isPromiseBasedObservable === !0)
    return r;
  typeof r == "function" && (r = new Promise(r));
  var t = r;
  r.then(O("observableFromPromise-resolve", function(o) {
    t.value = o, t.state = so;
  }), O("observableFromPromise-reject", function(o) {
    t.value = o, t.state = $i;
  })), t.isPromiseBasedObservable = !0, t.case = pv;
  var n = e && e.state === so ? e.value : void 0;
  return qo(t, {
    value: n,
    state: nu
  }, {}, { deep: !1 }), t;
}
(function(r) {
  r.reject = O("fromPromise.reject", function(t) {
    var n = r(Promise.reject(t));
    return n.state = $i, n.value = t, n;
  });
  function e(t) {
    t === void 0 && (t = void 0);
    var n = r(Promise.resolve(t));
    return n.state = so, n.value = t, n;
  }
  r.resolve = O("fromPromise.resolve", e);
})(Rs || (Rs = {}));
var Pn = function(r, e, t, n) {
  var o = arguments.length, i = o < 3 ? e : n === null ? n = Object.getOwnPropertyDescriptor(e, t) : n, a;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") i = Reflect.decorate(r, e, t, n);
  else for (var s = r.length - 1; s >= 0; s--) (a = r[s]) && (i = (o < 3 ? a(i) : o > 3 ? a(e, t, i) : a(e, t)) || i);
  return o > 3 && i && Object.defineProperty(e, t, i), i;
};
(function() {
  function r(e, t) {
    var n = this;
    Id(function() {
      n.current = t, n.subscription = e.subscribe(n);
    });
  }
  return r.prototype.dispose = function() {
    this.subscription && this.subscription.unsubscribe();
  }, r.prototype.next = function(e) {
    this.current = e;
  }, r.prototype.complete = function() {
    this.dispose();
  }, r.prototype.error = function(e) {
    this.current = e, this.dispose();
  }, Pn([
    M.ref
  ], r.prototype, "current", void 0), Pn([
    O.bound
  ], r.prototype, "next", null), Pn([
    O.bound
  ], r.prototype, "complete", null), Pn([
    O.bound
  ], r.prototype, "error", null), r;
})();
var lo = function() {
  return lo = Object.assign || function(r) {
    for (var e, t = 1, n = arguments.length; t < n; t++) {
      e = arguments[t];
      for (var o in e) Object.prototype.hasOwnProperty.call(e, o) && (r[o] = e[o]);
    }
    return r;
  }, lo.apply(this, arguments);
}, Mr = function(r, e, t, n) {
  var o = arguments.length, i = o < 3 ? e : n === null ? n = Object.getOwnPropertyDescriptor(e, t) : n, a;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") i = Reflect.decorate(r, e, t, n);
  else for (var s = r.length - 1; s >= 0; s--) (a = r[s]) && (i = (o < 3 ? a(i) : o > 3 ? a(e, t, i) : a(e, t)) || i);
  return o > 3 && i && Object.defineProperty(e, t, i), i;
}, hv = ["model", "reset", "submit", "isDirty", "isPropertyDirty", "resetProperty"];
(function() {
  function r(e) {
    var t = this;
    this.model = e, this.localValues = M.map({}), this.localComputedValues = M.map({}), this.isPropertyDirty = function(n) {
      return t.localValues.has(n);
    }, ao(et(e), "createViewModel expects an observable object"), cv(e).forEach(function(n) {
      if (!(n === B || n === "__mobxDidRunLazyInitializers")) {
        if (ao(hv.indexOf(n) === -1, "The propertyname " + n + " is reserved and cannot be used with viewModels"), aa(e, n)) {
          var o = yo(e, n).derivation;
          t.localComputedValues.set(n, te(o.bind(t)));
        }
        var i = Object.getOwnPropertyDescriptor(e, n), a = i ? { enumerable: i.enumerable } : {};
        Object.defineProperty(t, n, lo(lo({}, a), { configurable: !0, get: function() {
          return aa(e, n) ? t.localComputedValues.get(n).get() : t.isPropertyDirty(n) ? t.localValues.get(n) : t.model[n];
        }, set: O(function(s) {
          s !== t.model[n] ? t.localValues.set(n, s) : t.localValues.delete(n);
        }) }));
      }
    });
  }
  return Object.defineProperty(r.prototype, "isDirty", {
    get: function() {
      return this.localValues.size > 0;
    },
    enumerable: !1,
    configurable: !0
  }), Object.defineProperty(r.prototype, "changedValues", {
    get: function() {
      return this.localValues.toJS();
    },
    enumerable: !1,
    configurable: !0
  }), r.prototype.submit = function() {
    var e = this;
    vr(this.localValues).forEach(function(t) {
      var n = e.localValues.get(t), o = e.model[t];
      lt(o) ? o.replace(n) : Pe(o) ? (o.clear(), o.merge(n)) : wl(n) || (e.model[t] = n);
    }), this.localValues.clear();
  }, r.prototype.reset = function() {
    this.localValues.clear();
  }, r.prototype.resetProperty = function(e) {
    this.localValues.delete(e);
  }, Mr([
    te
  ], r.prototype, "isDirty", null), Mr([
    te
  ], r.prototype, "changedValues", null), Mr([
    O.bound
  ], r.prototype, "submit", null), Mr([
    O.bound
  ], r.prototype, "reset", null), Mr([
    O.bound
  ], r.prototype, "resetProperty", null), r;
})();
function ko(r) {
  if (!r)
    return "ROOT";
  for (var e = []; r.parent; )
    e.push(r.path), r = r.parent;
  return e.reverse().join("/");
}
function Bo(r) {
  return et(r) || lt(r) || Pe(r);
}
function vv(r, e) {
  var t = /* @__PURE__ */ new WeakMap();
  function n(s) {
    var l = t.get(s.object);
    o(s, l), e(s, ko(l), r);
  }
  function o(s, l) {
    switch (s.type) {
      // Object changes
      case "add":
        i(s.newValue, l, s.name);
        break;
      case "update":
        a(s.oldValue), i(s.newValue, l, s.name || "" + s.index);
        break;
      case "remove":
      // object
      case "delete":
        a(s.oldValue);
        break;
      // Array changes
      case "splice":
        s.removed.map(a), s.added.forEach(function(f, c) {
          return i(f, l, "" + (s.index + c));
        });
        for (var u = s.index + s.addedCount; u < s.object.length; u++)
          if (Bo(s.object[u])) {
            var d = t.get(s.object[u]);
            d && (d.path = "" + u);
          }
        break;
    }
  }
  function i(s, l, u) {
    if (Bo(s)) {
      var d = t.get(s);
      if (d) {
        if (d.parent !== l || d.path !== u)
          throw new Error("The same observable object cannot appear twice in the same tree," + (" trying to assign it to '" + ko(l) + "/" + u + "',") + (" but it already exists at '" + ko(d.parent) + "/" + d.path + "'"));
      } else {
        var f = {
          parent: l,
          path: u,
          dispose: Sl(s, n)
        };
        t.set(s, f), Vd(s).forEach(function(c) {
          var p = c[0], h = c[1];
          return i(h, f, p);
        });
      }
    }
  }
  function a(s) {
    if (Bo(s)) {
      var l = t.get(s);
      if (!l)
        return;
      t.delete(s), l.dispose(), Ud(s).forEach(a);
    }
  }
  return i(r, void 0, ""), function() {
    a(r);
  };
}
var yv = /* @__PURE__ */ (function() {
  var r = function(e, t) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, o) {
      n.__proto__ = o;
    } || function(n, o) {
      for (var i in o) o.hasOwnProperty(i) && (n[i] = o[i]);
    }, r(e, t);
  };
  return function(e, t) {
    r(e, t);
    function n() {
      this.constructor = e;
    }
    e.prototype = t === null ? Object.create(t) : (n.prototype = t.prototype, new n());
  };
})();
(function(r) {
  yv(e, r);
  function e(t, n, o) {
    var i = o === void 0 ? {} : o, a = i.name, s = a === void 0 ? "ogm" + (Math.random() * 1e3 | 0) : a, l = i.keyToName, u = l === void 0 ? function(c) {
      return "" + c;
    } : l, d = r.call(this) || this;
    d._keyToName = u, d._groupBy = n, d._ogmInfoKey = /* @__PURE__ */ Symbol("ogmInfo" + s), d._base = t;
    for (var f = 0; f < t.length; f++)
      d._addItem(t[f]);
    return d._disposeBaseObserver = Sl(d._base, function(c) {
      if (c.type === "splice")
        $e(function() {
          for (var p = 0, h = c.removed; p < h.length; p++) {
            var v = h[p];
            d._removeItem(v);
          }
          for (var g = 0, y = c.added; g < y.length; g++) {
            var _ = y[g];
            d._addItem(_);
          }
        });
      else if (c.type === "update")
        $e(function() {
          d._removeItem(c.oldValue), d._addItem(c.newValue);
        });
      else
        throw new Error("illegal state");
    }), d;
  }
  return e.prototype.clear = function() {
    throw new Error("not supported");
  }, e.prototype.delete = function(t) {
    throw new Error("not supported");
  }, e.prototype.set = function(t, n) {
    throw new Error("not supported");
  }, e.prototype.dispose = function() {
    this._disposeBaseObserver();
    for (var t = 0; t < this._base.length; t++) {
      var n = this._base[t], o = n[this._ogmInfoKey];
      o.reaction(), delete n[this._ogmInfoKey];
    }
  }, e.prototype._getGroupArr = function(t) {
    var n = r.prototype.get.call(this, t);
    return n === void 0 && (n = M([], { name: "GroupArray[" + this._keyToName(t) + "]", deep: !1 }), r.prototype.set.call(this, t, n)), n;
  }, e.prototype._removeFromGroupArr = function(t, n) {
    var o = r.prototype.get.call(this, t);
    o.length === 1 ? r.prototype.delete.call(this, t) : (n === o.length - 1 || (o[n] = o[o.length - 1], o[n][this._ogmInfoKey].groupArrIndex = n), o.length--);
  }, e.prototype._addItem = function(t) {
    var n = this, o = this._groupBy(t), i = this._getGroupArr(o), a = {
      groupByValue: o,
      groupArrIndex: i.length,
      reaction: gl(function() {
        return n._groupBy(t);
      }, function(s, l) {
        var u = t[n._ogmInfoKey];
        n._removeFromGroupArr(u.groupByValue, u.groupArrIndex);
        var d = n._getGroupArr(s), f = d.length;
        d.push(t), u.groupByValue = s, u.groupArrIndex = f;
      })
    };
    Object.defineProperty(t, this._ogmInfoKey, {
      configurable: !0,
      enumerable: !1,
      value: a
    }), i.push(t);
  }, e.prototype._removeItem = function(t) {
    var n = t[this._ogmInfoKey];
    this._removeFromGroupArr(n.groupByValue, n.groupArrIndex), n.reaction(), delete t[this._ogmInfoKey];
  }, e;
})(Fi);
Promise.resolve(), typeof queueMicrotask < "u" || typeof process < "u" && process.nextTick;
var bi = function() {
  return bi = Object.assign || function(r) {
    for (var e, t = 1, n = arguments.length; t < n; t++) {
      e = arguments[t];
      for (var o in e) Object.prototype.hasOwnProperty.call(e, o) && (r[o] = e[o]);
    }
    return r;
  }, bi.apply(this, arguments);
}, gv = (
  /** @class */
  (function() {
    function r(e) {
      this.undos = [], this.redos = [], this.callbacks = [], this.stopWatch = null, this.curData = null, this.maxSize = 50, this.waitTime = 100, this.eventCenter = e;
    }
    return r.prototype.add = function(e) {
      Ki(hu(this.undos), e) || (this.undos.push(e), Ki(this.curData, e) || (this.redos = []), this.eventCenter.emit(C.HISTORY_CHANGE, {
        data: {
          undos: this.undos,
          redos: this.redos,
          undoAble: this.undoAble(),
          redoAble: this.redoAble()
        }
      }), this.undos.length > this.maxSize && this.undos.shift());
    }, r.prototype.undoAble = function() {
      return this.undos.length > 1;
    }, r.prototype.undo = function() {
      if (this.undoAble()) {
        var e = this.undos.pop();
        this.redos.push(e);
        var t = this.undos.pop();
        return this.curData = I(t), t;
      }
    }, r.prototype.redoAble = function() {
      return this.redos.length > 0;
    }, r.prototype.redo = function() {
      if (this.redoAble()) {
        var e = this.redos.pop();
        return this.curData = I(e), e;
      }
    }, r.prototype.watch = function(e) {
      var t = this;
      this.stopWatch && this.stopWatch(), this.undos.push(e.modelToGraphData()), this.stopWatch = vv(
        // TODO：避免用户触发「The same observable object cannot appear twice in the same tree」 错误
        // 例如：在自定义节点的 setAttributes 方法中，将 nodeModel 属性赋值给另一个 observable 属性
        // eg:
        // setAttributes() {
        //   this.width = 120
        //   this.height = 50
        //
        //   if (this.text) {
        //     this.properties.text = this.text;
        //     this.text.value = '';
        //   }
        // }
        // 解决方案：使用 cloneDeep 方法，将 observable 对象克隆一份。需要测试下面操作是否会造成其它问题
        // https://stackoverflow.com/questions/55328504/a-node-cannot-exists-twice-in-the-state-tree-mobx-state-tree
        // cloneDeep(model),
        e,
        Si(function() {
          var n = e.modelToHistoryData();
          n && t.add(bi({}, n));
        }, this.waitTime)
      );
    }, r.prototype.destroy = function() {
      this.undos = [], this.redos = [], this.curData = null, this.stopWatch && this.stopWatch();
    }, r;
  })()
), Xo = { exports: {} }, Is;
function _v() {
  return Is || (Is = 1, (function(r) {
    (function(e, t, n) {
      if (!e)
        return;
      for (var o = {
        8: "backspace",
        9: "tab",
        13: "enter",
        16: "shift",
        17: "ctrl",
        18: "alt",
        20: "capslock",
        27: "esc",
        32: "space",
        33: "pageup",
        34: "pagedown",
        35: "end",
        36: "home",
        37: "left",
        38: "up",
        39: "right",
        40: "down",
        45: "ins",
        46: "del",
        91: "meta",
        93: "meta",
        224: "meta"
      }, i = {
        106: "*",
        107: "+",
        109: "-",
        110: ".",
        111: "/",
        186: ";",
        187: "=",
        188: ",",
        189: "-",
        190: ".",
        191: "/",
        192: "`",
        219: "[",
        220: "\\",
        221: "]",
        222: "'"
      }, a = {
        "~": "`",
        "!": "1",
        "@": "2",
        "#": "3",
        $: "4",
        "%": "5",
        "^": "6",
        "&": "7",
        "*": "8",
        "(": "9",
        ")": "0",
        _: "-",
        "+": "=",
        ":": ";",
        '"': "'",
        "<": ",",
        ">": ".",
        "?": "/",
        "|": "\\"
      }, s = {
        option: "alt",
        command: "meta",
        return: "enter",
        escape: "esc",
        plus: "+",
        mod: /Mac|iPod|iPhone|iPad/.test(navigator.platform) ? "meta" : "ctrl"
      }, l, u = 1; u < 20; ++u)
        o[111 + u] = "f" + u;
      for (u = 0; u <= 9; ++u)
        o[u + 96] = u.toString();
      function d(m, b, P) {
        if (m.addEventListener) {
          m.addEventListener(b, P, !1);
          return;
        }
        m.attachEvent("on" + b, P);
      }
      function f(m) {
        if (m.type == "keypress") {
          var b = String.fromCharCode(m.which);
          return m.shiftKey || (b = b.toLowerCase()), b;
        }
        return o[m.which] ? o[m.which] : i[m.which] ? i[m.which] : String.fromCharCode(m.which).toLowerCase();
      }
      function c(m, b) {
        return m.sort().join(",") === b.sort().join(",");
      }
      function p(m) {
        var b = [];
        return m.shiftKey && b.push("shift"), m.altKey && b.push("alt"), m.ctrlKey && b.push("ctrl"), m.metaKey && b.push("meta"), b;
      }
      function h(m) {
        if (m.preventDefault) {
          m.preventDefault();
          return;
        }
        m.returnValue = !1;
      }
      function v(m) {
        if (m.stopPropagation) {
          m.stopPropagation();
          return;
        }
        m.cancelBubble = !0;
      }
      function g(m) {
        return m == "shift" || m == "ctrl" || m == "alt" || m == "meta";
      }
      function y() {
        if (!l) {
          l = {};
          for (var m in o)
            m > 95 && m < 112 || o.hasOwnProperty(m) && (l[o[m]] = m);
        }
        return l;
      }
      function _(m, b, P) {
        return P || (P = y()[m] ? "keydown" : "keypress"), P == "keypress" && b.length && (P = "keydown"), P;
      }
      function S(m) {
        return m === "+" ? ["+"] : (m = m.replace(/\+{2}/g, "+plus"), m.split("+"));
      }
      function A(m, b) {
        var P, D, k, Y = [];
        for (P = S(m), k = 0; k < P.length; ++k)
          D = P[k], s[D] && (D = s[D]), b && b != "keypress" && a[D] && (D = a[D], Y.push("shift")), g(D) && Y.push(D);
        return b = _(D, Y, b), {
          key: D,
          modifiers: Y,
          action: b
        };
      }
      function x(m, b) {
        return m === null || m === t ? !1 : m === b ? !0 : x(m.parentNode, b);
      }
      function E(m) {
        var b = this;
        if (m = m || t, !(b instanceof E))
          return new E(m);
        b.target = m, b._callbacks = {}, b._directMap = {};
        var P = {}, D, k = !1, Y = !1, J = !1;
        function H(j) {
          j = j || {};
          var Z = !1, ee;
          for (ee in P) {
            if (j[ee]) {
              Z = !0;
              continue;
            }
            P[ee] = 0;
          }
          Z || (J = !1);
        }
        function oe(j, Z, ee, U, se, Re) {
          var re, ge, Fe = [], Ae = ee.type;
          if (!b._callbacks[j])
            return [];
          for (Ae == "keyup" && g(j) && (Z = [j]), re = 0; re < b._callbacks[j].length; ++re)
            if (ge = b._callbacks[j][re], !(!U && ge.seq && P[ge.seq] != ge.level) && Ae == ge.action && (Ae == "keypress" && !ee.metaKey && !ee.ctrlKey || c(Z, ge.modifiers))) {
              var Ht = !U && ge.combo == se, Gt = U && ge.seq == U && ge.level == Re;
              (Ht || Gt) && b._callbacks[j].splice(re, 1), Fe.push(ge);
            }
          return Fe;
        }
        function ne(j, Z, ee, U) {
          b.stopCallback(Z, Z.target || Z.srcElement, ee, U) || j(Z, ee) === !1 && (h(Z), v(Z));
        }
        b._handleKey = function(j, Z, ee) {
          var U = oe(j, Z, ee), se, Re = {}, re = 0, ge = !1;
          for (se = 0; se < U.length; ++se)
            U[se].seq && (re = Math.max(re, U[se].level));
          for (se = 0; se < U.length; ++se) {
            if (U[se].seq) {
              if (U[se].level != re)
                continue;
              ge = !0, Re[U[se].seq] = 1, ne(U[se].callback, ee, U[se].combo, U[se].seq);
              continue;
            }
            ge || ne(U[se].callback, ee, U[se].combo);
          }
          var Fe = ee.type == "keypress" && Y;
          ee.type == J && !g(j) && !Fe && H(Re), Y = ge && ee.type == "keydown";
        };
        function ae(j) {
          typeof j.which != "number" && (j.which = j.keyCode);
          var Z = f(j);
          if (Z) {
            if (j.type == "keyup" && k === Z) {
              k = !1;
              return;
            }
            b.handleKey(Z, p(j), j);
          }
        }
        function ue() {
          clearTimeout(D), D = setTimeout(H, 1e3);
        }
        function ve(j, Z, ee, U) {
          P[j] = 0;
          function se(Ae) {
            return function() {
              J = Ae, ++P[j], ue();
            };
          }
          function Re(Ae) {
            ne(ee, Ae, j), U !== "keyup" && (k = f(Ae)), setTimeout(H, 10);
          }
          for (var re = 0; re < Z.length; ++re) {
            var ge = re + 1 === Z.length, Fe = ge ? Re : se(U || A(Z[re + 1]).action);
            he(Z[re], Fe, U, j, re);
          }
        }
        function he(j, Z, ee, U, se) {
          b._directMap[j + ":" + ee] = Z, j = j.replace(/\s+/g, " ");
          var Re = j.split(" "), re;
          if (Re.length > 1) {
            ve(j, Re, Z, ee);
            return;
          }
          re = A(j, ee), b._callbacks[re.key] = b._callbacks[re.key] || [], oe(re.key, re.modifiers, { type: re.action }, U, j, se), b._callbacks[re.key][U ? "unshift" : "push"]({
            callback: Z,
            modifiers: re.modifiers,
            action: re.action,
            seq: U,
            level: se,
            combo: j
          });
        }
        b._bindMultiple = function(j, Z, ee) {
          for (var U = 0; U < j.length; ++U)
            he(j[U], Z, ee);
        }, d(m, "keypress", ae), d(m, "keydown", ae), d(m, "keyup", ae);
      }
      E.prototype.bind = function(m, b, P) {
        var D = this;
        return m = m instanceof Array ? m : [m], D._bindMultiple.call(D, m, b, P), D;
      }, E.prototype.unbind = function(m, b) {
        var P = this;
        return P.bind.call(P, m, function() {
        }, b);
      }, E.prototype.trigger = function(m, b) {
        var P = this;
        return P._directMap[m + ":" + b] && P._directMap[m + ":" + b]({}, m), P;
      }, E.prototype.reset = function() {
        var m = this;
        return m._callbacks = {}, m._directMap = {}, m;
      }, E.prototype.stopCallback = function(m, b) {
        var P = this;
        if ((" " + b.className + " ").indexOf(" mousetrap ") > -1 || x(b, P.target))
          return !1;
        if ("composedPath" in m && typeof m.composedPath == "function") {
          var D = m.composedPath()[0];
          D !== m.target && (b = D);
        }
        return b.tagName == "INPUT" || b.tagName == "SELECT" || b.tagName == "TEXTAREA" || b.isContentEditable;
      }, E.prototype.handleKey = function() {
        var m = this;
        return m._handleKey.apply(m, arguments);
      }, E.addKeycodes = function(m) {
        for (var b in m)
          m.hasOwnProperty(b) && (o[b] = m[b]);
        l = null;
      }, E.init = function() {
        var m = E(t);
        for (var b in m)
          b.charAt(0) !== "_" && (E[b] = /* @__PURE__ */ (function(P) {
            return function() {
              return m[P].apply(m, arguments);
            };
          })(b));
      }, E.init(), e.Mousetrap = E, r.exports && (r.exports = E);
    })(typeof window < "u" ? window : null, typeof window < "u" ? document : null);
  })(Xo)), Xo.exports;
}
var mv = _v();
const xv = /* @__PURE__ */ Hs(mv);
var tt = null;
function ks(r, e) {
  var t, n;
  return r.x += e, r.y += e, Ho(r.text) || (r.text.x += e, r.text.y += e), Ho((t = r.properties) === null || t === void 0 ? void 0 : t._label) || (n = r.properties) === null || n === void 0 || n._label.forEach(function(o) {
    o.x += e, o.y += e;
  }), r;
}
function Bs(r, e) {
  return r.startPoint && (r.startPoint.x += e, r.startPoint.y += e), r.endPoint && (r.endPoint.x += e, r.endPoint.y += e), r.pointsList && r.pointsList.length > 0 && r.pointsList.forEach(function(t) {
    t.x += e, t.y += e;
  }), Ho(r.text) || (r.text.x += e, r.text.y += e), r;
}
var Jt = 40, Dn = 40;
function Ev(r, e) {
  var t = r.keyboard, n = t.options.keyboard;
  t.on(["cmd + c", "ctrl + c"], function() {
    if (Dn = Jt, !n?.enabled || e.textEditElement)
      return !0;
    var o = r.options.guards, i = e.getSelectElements(!1), a = o && o.beforeClone ? o.beforeClone(i) : !0;
    return !a || i.nodes.length === 0 && i.edges.length === 0 ? (tt = null, !0) : (tt = i, tt.nodes.forEach(function(s) {
      return ks(s, Jt);
    }), tt.edges.forEach(function(s) {
      return Bs(s, Jt);
    }), !1);
  }), t.on(["cmd + v", "ctrl + v"], function() {
    if (!n?.enabled || e.textEditElement)
      return !0;
    if (tt && (tt.nodes || tt.edges)) {
      r.clearSelectElements();
      var o = r.addElements(tt, Dn);
      if (!o)
        return !0;
      o.nodes.forEach(function(i) {
        return r.selectElementById(i.id, !0);
      }), o.edges.forEach(function(i) {
        return r.selectElementById(i.id, !0);
      }), tt.nodes.forEach(function(i) {
        return ks(i, Jt);
      }), tt.edges.forEach(function(i) {
        return Bs(i, Jt);
      }), Dn = Dn + Jt;
    }
    return !1;
  }), t.on(["cmd + z", "ctrl + z"], function() {
    return !n?.enabled || e.textEditElement ? !0 : (r.undo(), !1);
  }), t.on(["cmd + y", "ctrl + y"], function() {
    return !n?.enabled || e.textEditElement ? !0 : (r.redo(), !1);
  }), t.on(["backspace"], function() {
    if (!n?.enabled || e.textEditElement)
      return !0;
    var o = e.getSelectElements(!0);
    return r.clearSelectElements(), o.edges.forEach(function(i) {
      return i.id && r.deleteEdge(i.id);
    }), o.nodes.forEach(function(i) {
      return i.id && r.deleteNode(i.id);
    }), !1;
  });
}
var bv = (
  /** @class */
  (function() {
    function r(e) {
      e.keyboard || (e.keyboard = { enabled: !1 }), this.options = e;
      var t = e.lf;
      this.target = t.container, this.mousetrap = new xv(this.target), e.keyboard.enabled && !t.options.isSilentMode && this.enable(!0);
    }
    return r.prototype.initShortcuts = function() {
      var e = this, t, n = ((t = this.options.keyboard) !== null && t !== void 0 ? t : {}).shortcuts;
      if (n)
        if (xu(n))
          n.forEach(function(s) {
            var l = s.keys, u = s.callback, d = s.action;
            return e.on(l, u, d);
          });
        else {
          var o = n.keys, i = n.callback, a = n.action;
          this.on(o, i, a);
        }
    }, r.prototype.on = function(e, t, n) {
      this.mousetrap.bind(this.getKeys(e), t, n);
    }, Object.defineProperty(r.prototype, "disabled", {
      get: function() {
        var e, t;
        return ((t = (e = this.options) === null || e === void 0 ? void 0 : e.keyboard) === null || t === void 0 ? void 0 : t.enabled) !== !0;
      },
      enumerable: !1,
      configurable: !0
    }), r.prototype.off = function(e, t) {
      this.mousetrap.unbind(this.getKeys(e), t);
    }, r.prototype.enable = function(e) {
      (this.disabled || e) && (this.options.keyboard && (this.options.keyboard.enabled = !0), this.target instanceof HTMLElement && (this.target.setAttribute("tabindex", "-1"), this.target.style.outline = "none"));
    }, r.prototype.disable = function() {
      this.disabled || (this.options.keyboard && (this.options.keyboard.enabled = !1), this.target instanceof HTMLElement && this.target.removeAttribute("tabindex"));
    }, r.prototype.destroy = function() {
      this.mousetrap.reset();
    }, r.prototype.getKeys = function(e) {
      var t = this;
      return (Array.isArray(e) ? e : [e]).map(function(n) {
        return t.formatKey(n);
      });
    }, r.prototype.formatKey = function(e) {
      return e.toLowerCase().replace(/\s/g, "").replace("delete", "del").replace("cmd", "command");
    }, r;
  })()
), _t = function() {
  return _t = Object.assign || function(r) {
    for (var e, t = 1, n = arguments.length; t < n; t++) {
      e = arguments[t];
      for (var o in e) Object.prototype.hasOwnProperty.call(e, o) && (r[o] = e[o]);
    }
    return r;
  }, _t.apply(this, arguments);
}, Tn = function(r, e) {
  var t = typeof Symbol == "function" && r[Symbol.iterator];
  if (!t) return r;
  var n = t.call(r), o, i = [], a;
  try {
    for (; (e === void 0 || e-- > 0) && !(o = n.next()).done; ) i.push(o.value);
  } catch (s) {
    a = { error: s };
  } finally {
    try {
      o && !o.done && (t = n.return) && t.call(n);
    } finally {
      if (a) throw a.error;
    }
  }
  return i;
}, Yo = function(r, e, t) {
  if (t || arguments.length === 2) for (var n = 0, o = e.length, i; n < o; n++)
    (i || !(n in e)) && (i || (i = Array.prototype.slice.call(e, 0, n)), i[n] = e[n]);
  return r.concat(i || Array.prototype.slice.call(e));
}, Fo = /* @__PURE__ */ Symbol("plugin registered by Logicflow.use"), Oi = (
  /** @class */
  (function() {
    function r(e) {
      var t = this, n;
      this.viewMap = /* @__PURE__ */ new Map(), this.components = [], this.extension = {}, this.setView = function(u, d) {
        return t.viewMap.set(u, d);
      }, this.getView = function(u) {
        return t.viewMap.get(u);
      };
      var o = $r.get(e), i = o.container, a = o.width, s = o.height;
      this.options = o, this.container = this.initContainer(i, a, s), this.graphModel = new fh(_t(_t({}, o), { container: this.container })), this.plugins = (n = o.plugins) !== null && n !== void 0 ? n : [];
      var l = this.graphModel.eventCenter;
      this.tool = new uv(this), this.dnd = new Jh({ lf: this }), this.history = new gv(l), this.keyboard = new bv({
        lf: this,
        keyboard: o.keyboard
      }), o.snapline !== !1 && (this.snaplineModel = new ch(this.graphModel, o.snaplineEpsilon), Qh(l, this.snaplineModel)), o.isSilentMode || (Ev(this, this.graphModel), this.keyboard.initShortcuts()), this.defaultRegister(), this.installPlugins(o.disabledPlugins);
    }
    return r.prototype.initContainer = function(e, t, n) {
      var o = document.createElement("div");
      return o.style.position = "relative", o.style.width = t ? "".concat(t, "px") : "100%", o.style.height = n ? "".concat(n, "px") : "100%", e.innerHTML = "", e.appendChild(o), o;
    }, Object.defineProperty(r.prototype, Symbol.toStringTag, {
      get: function() {
        return r.toStringTag;
      },
      enumerable: !1,
      configurable: !0
    }), r.prototype.register = function(e, t, n) {
      if (n === void 0 && (n = !0), typeof e != "string") {
        this.registerElement(e);
        return;
      }
      var o = {
        BaseEdge: Eo,
        BaseEdgeModel: xo,
        BaseNode: Pt,
        BaseNodeModel: Mt,
        RectNode: ws,
        RectNodeModel: gs,
        CircleNode: Ss,
        CircleNodeModel: ps,
        PolygonNode: As,
        PolygonNodeModel: ys,
        TextNode: Ds,
        TextNodeModel: ms,
        LineEdge: Ls,
        LineEdgeModel: ls,
        DiamondNode: Ms,
        DiamondNodeModel: hs,
        PolylineEdge: js,
        PolylineEdgeModel: fs,
        BezierEdge: Cs,
        BezierEdgeModel: as,
        EllipseNode: Ps,
        EllipseNodeModel: vs,
        HtmlNode: Ts,
        HtmlNodeModel: xs,
        // mobx,
        h: ur,
        type: e
      };
      if (this.viewMap.forEach(function(u) {
        var d = u.extendKey;
        d && (o[d] = u);
      }), this.graphModel.modelMap.forEach(function(u) {
        var d = u.extendKey;
        d && (o[d] = u);
      }), t) {
        var i = t(o), a = i.view, s = i.model, l = a;
        n && !l.isObserved && (l.isObserved = !0, l = je(l)), this.setView(e, l), this.graphModel.setModel(e, s);
      }
    }, r.prototype.registerElement = function(e) {
      var t = e.view;
      e.isObserverView !== !1 && !t.isObserved && (t.isObserved = !0, t = je(t)), this.setView(e.type, t), this.graphModel.setModel(e.type, e.model);
    }, r.prototype.batchRegister = function(e) {
      var t = this;
      e === void 0 && (e = []), pe(e, function(n) {
        t.registerElement(n);
      });
    }, r.prototype.defaultRegister = function() {
      var e = [
        // Node
        {
          type: "rect",
          view: ws,
          model: gs
        },
        {
          type: "circle",
          view: Ss,
          model: ps
        },
        {
          type: "polygon",
          view: As,
          model: ys
        },
        {
          type: "text",
          view: Ds,
          model: ms
        },
        {
          type: "ellipse",
          view: Ps,
          model: vs
        },
        {
          type: "diamond",
          view: Ms,
          model: hs
        },
        {
          type: "html",
          view: Ts,
          model: xs
        },
        // Edge
        {
          type: "line",
          view: Ls,
          model: ls
        },
        {
          type: "polyline",
          view: js,
          model: fs
        },
        {
          type: "bezier",
          view: Cs,
          model: as
        }
      ];
      this.batchRegister(e);
    }, r.prototype.addNode = function(e, t, n) {
      return t === void 0 && (t = C.NODE_ADD), this.graphModel.addNode(e, t, n);
    }, r.prototype.deleteNode = function(e) {
      var t = this.graphModel.getNodeModelById(e);
      if (!t)
        return !1;
      var n = t.getData(), o = this.options.guards, i = o?.beforeDelete ? o.beforeDelete(n) : !0;
      return i && this.graphModel.deleteNode(e), i;
    }, r.prototype.cloneNode = function(e) {
      var t = this.graphModel.getNodeModelById(e), n = t?.getData();
      if (n) {
        var o = this.options.guards, i = o?.beforeClone ? o.beforeClone(n) : !0;
        if (i)
          return this.graphModel.cloneNode(e);
      }
    }, r.prototype.changeNodeId = function(e, t) {
      return this.graphModel.changeNodeId(e, t);
    }, r.prototype.changeNodeType = function(e, t) {
      this.graphModel.changeNodeType(e, t);
    }, r.prototype.getNodeModelById = function(e) {
      return this.graphModel.getNodeModelById(e);
    }, r.prototype.getNodeDataById = function(e) {
      var t = this.getNodeModelById(e);
      return t?.getData();
    }, r.prototype.getNodeIncomingEdge = function(e) {
      return this.graphModel.getNodeIncomingEdge(e);
    }, r.prototype.getNodeOutgoingEdge = function(e) {
      return this.graphModel.getNodeOutgoingEdge(e);
    }, r.prototype.getNodeIncomingNode = function(e) {
      return this.graphModel.getNodeIncomingNode(e);
    }, r.prototype.getNodeOutgoingNode = function(e) {
      return this.graphModel.getNodeOutgoingNode(e);
    }, r.prototype.createFakeNode = function(e) {
      var t = this.graphModel.modelMap.get(e.type);
      if (!t)
        return console.warn("不存在为".concat(e.type, "类型的节点")), null;
      var n = new t(_t(_t({}, e), { virtual: !0 }), this.graphModel);
      return this.graphModel.setFakeNode(n), n;
    }, r.prototype.removeFakeNode = function() {
      this.graphModel.removeFakeNode();
    }, r.prototype.setNodeSnapLine = function(e) {
      var t;
      (t = this.snaplineModel) === null || t === void 0 || t.setNodeSnapLine(e);
    }, r.prototype.removeNodeSnapLine = function() {
      var e;
      (e = this.snaplineModel) === null || e === void 0 || e.clearSnapline();
    }, r.prototype.setDefaultEdgeType = function(e) {
      this.graphModel.setDefaultEdgeType(e);
    }, r.prototype.addEdge = function(e) {
      return this.graphModel.addEdge(e);
    }, r.prototype.getEdgeDataById = function(e) {
      var t = this.getEdgeModelById(e);
      return t?.getData();
    }, r.prototype.getEdgeModelById = function(e) {
      return this.graphModel.getEdgeModelById(e);
    }, r.prototype.getEdgeModels = function(e) {
      var t = e.sourceNodeId, n = e.targetNodeId, o = [], i = this.graphModel.edges;
      return t && n ? pe(i, function(a) {
        a.sourceNodeId === t && a.targetNodeId === n && o.push(a);
      }) : t ? pe(i, function(a) {
        a.sourceNodeId === t && o.push(a);
      }) : n && pe(i, function(a) {
        a.targetNodeId === n && o.push(a);
      }), o;
    }, r.prototype.changeEdgeId = function(e, t) {
      return this.graphModel.changeEdgeId(e, t);
    }, r.prototype.changeEdgeType = function(e, t) {
      this.graphModel.changeEdgeType(e, t);
    }, r.prototype.deleteEdge = function(e) {
      var t = this.graphModel.getEdgeModelById(e);
      if (!t)
        return !1;
      var n = t.getData(), o = this.options.guards, i = o?.beforeDelete ? o.beforeDelete(n) : !0;
      return i && this.graphModel.deleteEdgeById(e), i;
    }, r.prototype.deleteEdgeByNodeId = function(e) {
      var t = e.sourceNodeId, n = e.targetNodeId;
      t && n ? this.graphModel.deleteEdgeBySourceAndTarget(t, n) : t ? this.graphModel.deleteEdgeBySource(t) : n && this.graphModel.deleteEdgeByTarget(n);
    }, r.prototype.getNodeEdges = function(e) {
      return this.graphModel.getNodeEdges(e);
    }, r.prototype.addElements = function(e, t) {
      var n = this, o = e.nodes, i = e.edges;
      t === void 0 && (t = 40), console.log("distance", t);
      var a = {}, s = {
        nodes: [],
        edges: []
      };
      return pe(o, function(l) {
        var u = l.id, d = n.addNode(l);
        u && (a[u] = d.id), s.nodes.push(d);
      }), pe(i, function(l) {
        var u = l.sourceNodeId, d = l.targetNodeId;
        a[u] && (u = a[u]), a[d] && (d = a[d]);
        var f = n.graphModel.addEdge(_t(_t({}, l), { sourceNodeId: u, targetNodeId: d }));
        s.edges.push(f);
      }), s;
    }, r.prototype.selectElementById = function(e, t, n) {
      t === void 0 && (t = !1), n === void 0 && (n = !0), this.graphModel.selectElementById(e, t), !t && n && this.graphModel.toFront(e);
    }, r.prototype.deselectElementById = function(e) {
      this.graphModel.deselectElementById(e);
    }, r.prototype.getSelectElements = function(e) {
      return e === void 0 && (e = !0), this.graphModel.getSelectElements(e);
    }, r.prototype.clearSelectElements = function() {
      this.graphModel.clearSelectElements();
    }, r.prototype.getModelById = function(e) {
      return this.graphModel.getElement(e);
    }, r.prototype.getDataById = function(e) {
      var t;
      return (t = this.graphModel.getElement(e)) === null || t === void 0 ? void 0 : t.getData();
    }, r.prototype.deleteElement = function(e) {
      var t, n, o, i = this.getModelById(e);
      if (!i)
        return !1;
      var a = (t = {}, t[fe.NODE] = this.deleteNode, t[fe.EDGE] = this.deleteEdge, t);
      return (o = (n = a[i.BaseType]) === null || n === void 0 ? void 0 : n.call(this, e)) !== null && o !== void 0 ? o : !1;
    }, r.prototype.setElementZIndex = function(e, t) {
      return this.graphModel.setElementZIndex(e, t);
    }, r.prototype.getAreaElement = function(e, t, n, o, i) {
      return n === void 0 && (n = !0), o === void 0 && (o = !0), i === void 0 && (i = !1), this.graphModel.getAreaElement(e, t, n, o, i).map(function(a) {
        return a.getData();
      });
    }, r.prototype.setProperties = function(e, t) {
      var n;
      (n = this.graphModel.getElement(e)) === null || n === void 0 || n.setProperties(Se(t));
    }, r.prototype.getProperties = function(e) {
      var t;
      return (t = this.graphModel.getElement(e)) === null || t === void 0 ? void 0 : t.getProperties();
    }, r.prototype.deleteProperty = function(e, t) {
      var n;
      (n = this.graphModel.getElement(e)) === null || n === void 0 || n.deleteProperty(t);
    }, r.prototype.updateAttributes = function(e, t) {
      this.graphModel.updateAttributes(e, t);
    }, r.prototype.editText = function(e) {
      this.graphModel.editText(e);
    }, r.prototype.updateText = function(e, t) {
      this.graphModel.updateText(e, t);
    }, r.prototype.updateEditConfig = function(e) {
      var t = this.graphModel, n = t.editConfigModel, o = t.transformModel, i = n.snapGrid;
      if (n.updateEditConfig(e), e?.stopMoveGraph !== void 0 && o.updateTranslateLimits(e.stopMoveGraph), e?.isSilentMode ? this.keyboard.disable() : this.keyboard.enable(!0), !Me(e?.snapGrid) && e.snapGrid !== i) {
        var a = this.graphModel.grid.size, s = a === void 0 ? 1 : a;
        this.graphModel.updateGridSize(e.snapGrid ? s : 1);
      }
      this.emit(C.EDIT_CONFIG_CHANGED, {
        data: n.getConfig()
      });
    }, r.prototype.getEditConfig = function() {
      return this.graphModel.editConfigModel.getConfig();
    }, r.prototype.setTheme = function(e, t) {
      this.graphModel.setTheme(e, t);
    }, r.prototype.getTheme = function() {
      return this.graphModel.getTheme();
    }, r.prototype.focusByElement = function(e) {
      var t = void 0, n = this.getNodeModelById(e);
      if (n) {
        var o = n.getData(), i = o.x, a = o.y;
        t = {
          x: i,
          y: a
        };
      }
      var s = this.getEdgeModelById(e);
      if (s) {
        var l = s.textPosition, i = l.x, a = l.y;
        t = {
          x: i,
          y: a
        };
      }
      t && this.focusByCoordinate(t);
    }, r.prototype.focusByCoordinate = function(e) {
      var t = this.graphModel, n = t.transformModel, o = t.width, i = t.height, a = e.x, s = e.y;
      n.focusOn(a, s, o, i);
    }, r.prototype.focusOn = function(e) {
      if (typeof e == "string")
        this.focusByElement(e);
      else if ("x" in e && "y" in e)
        this.focusByCoordinate(e);
      else {
        var t = e.id, n = e.coordinate;
        t && this.focusByElement(t), n && this.focusByCoordinate(n);
      }
    }, r.prototype.resize = function(e, t) {
      this.graphModel.resize(e, t), this.options.width = this.graphModel.width, this.options.height = this.graphModel.height;
    }, r.prototype.toFront = function(e) {
      this.graphModel.toFront(e);
    }, r.prototype.getPointByClient = function(e, t) {
      if (typeof e == "object")
        return this.graphModel.getPointByClient(e);
      if (typeof t == "number")
        return this.graphModel.getPointByClient({
          x: e,
          y: t
        });
    }, r.prototype.getGraphData = function() {
      for (var e = [], t = 0; t < arguments.length; t++)
        e[t] = arguments[t];
      var n = this.getGraphRawData();
      return this.adapterOut ? this.adapterOut.apply(this, Yo([n], Tn(e), !1)) : n;
    }, r.prototype.getGraphRawData = function() {
      return this.graphModel.modelToGraphData();
    }, r.prototype.clearData = function() {
      this.graphModel.clearData(), this.render({});
    }, r.prototype.setOverlapMode = function(e) {
      this.graphModel.setOverlapMode(e);
    }, r.prototype.renderRawData = function(e) {
      this.graphModel.graphDataToModel(Se(e)), this.options.history !== !1 && this.history.watch(this.graphModel), ja(w(gh, { getView: this.getView, tool: this.tool, options: this.options, dnd: this.dnd, snaplineModel: this.snaplineModel, graphModel: this.graphModel }), this.container), this.emit(C.GRAPH_RENDERED, {
        data: this.graphModel.modelToGraphData(),
        graphModel: this.graphModel
      });
    }, r.prototype.render = function(e) {
      var t = I(e);
      this.adapterIn && (t = this.adapterIn(t)), this.renderRawData(t);
    }, r.prototype.undo = function() {
      if (this.history.undoAble()) {
        var e = Se(this.history.undo());
        this.clearSelectElements(), this.graphModel.graphDataToModel(e);
      }
    }, r.prototype.redo = function() {
      if (this.history.redoAble()) {
        var e = Se(this.history.redo());
        this.clearSelectElements(), this.graphModel.graphDataToModel(e);
      }
    }, r.prototype.zoom = function(e, t) {
      var n = this.graphModel.transformModel;
      return n.zoom(e, t);
    }, r.prototype.resetZoom = function() {
      var e = this.graphModel.transformModel;
      e.resetZoom();
    }, r.prototype.setZoomMiniSize = function(e) {
      var t = this.graphModel.transformModel;
      t.setZoomMiniSize(e);
    }, r.prototype.setZoomMaxSize = function(e) {
      var t = this.graphModel.transformModel;
      t.setZoomMaxSize(e);
    }, r.prototype.getTransform = function() {
      var e = this.graphModel.transformModel, t = e.SCALE_X, n = e.SCALE_Y, o = e.TRANSLATE_X, i = e.TRANSLATE_Y;
      return {
        SCALE_X: t,
        SCALE_Y: n,
        TRANSLATE_X: o,
        TRANSLATE_Y: i
      };
    }, r.prototype.translate = function(e, t) {
      var n = this.graphModel.transformModel;
      n.translate(e, t);
    }, r.prototype.resetTranslate = function() {
      var e = this.graphModel.transformModel, t = e.TRANSLATE_X, n = e.TRANSLATE_Y;
      this.translate(-t, -n);
    }, r.prototype.translateCenter = function() {
      this.graphModel.translateCenter();
    }, r.prototype.fitView = function(e, t) {
      t === void 0 && (t = e), this.graphModel.fitView(e, t);
    }, r.prototype.openEdgeAnimation = function(e) {
      this.graphModel.openEdgeAnimation(e);
    }, r.prototype.closeEdgeAnimation = function(e) {
      this.graphModel.closeEdgeAnimation(e);
    }, r.prototype.on = function(e, t) {
      this.graphModel.eventCenter.on(e, t);
    }, r.prototype.off = function(e, t) {
      this.graphModel.eventCenter.off(e, t);
    }, r.prototype.once = function(e, t) {
      this.graphModel.eventCenter.once(e, t);
    }, r.prototype.emit = function(e, t) {
      this.graphModel.eventCenter.emit(e, t);
    }, r.use = function(e, t) {
      var n, o = e.pluginName;
      if (!o)
        throw new Error("请给插件指定 pluginName!");
      this.extensions.set(o, (n = {}, n[Fo] = Fo, n.extension = e, n.props = t, n));
    }, r.addThemeMode = function(e, t) {
      ap(e, t);
    }, r.removeThemeMode = function(e) {
      sp(e);
    }, r.clearThemeMode = function() {
      lp();
    }, r.prototype.installPlugins = function(e) {
      var t = this;
      e === void 0 && (e = []);
      var n = Array.from(r.extensions, function(i) {
        var a = Tn(i, 2), s = a[1];
        return s;
      }), o = Yo(Yo([], Tn(this.plugins), !1), Tn(n), !1);
      pe(o, function(i) {
        var a, s;
        Fo in i ? (a = i.extension, s = i.props) : a = i;
        var l = a?.pluginName;
        ku(e, l) === -1 && t.installPlugin(a, s);
      });
    }, r.prototype.installPlugin = function(e, t) {
      var n, o;
      if ("pluginName" in e && "install" in e) {
        var i = e.pluginName, a = e.install, s = e.render;
        i && (a && a.call(e, this, r), s && this.components.push(s.bind(e)), this.extension[i] = e);
        return;
      }
      var l = e, u = l.pluginName, d = new l({
        lf: this,
        LogicFlow: r,
        props: t,
        // TODO: 这里的 options 应该传入插件对应的 options，而不是全局的 options
        // 所以应该这么写 this.options.pluginsOptions[ExtensionCtor.pluginName] ?? {}
        options: (o = (n = this.options.pluginsOptions) === null || n === void 0 ? void 0 : n[u]) !== null && o !== void 0 ? o : {}
      });
      d.render && this.components.push(d.render.bind(d)), this.extension[u] = d;
    }, r.prototype.destroy = function() {
      var e;
      this.clearData(), ja(null, this.container), this.keyboard.destroy(), this.graphModel.destroy(), this.tool.destroy(), this.history.destroy();
      for (var t in this.extension) {
        var n = this.extension[t];
        "destroy" in n && ((e = n.destroy) === null || e === void 0 || e.call(n));
      }
    }, r.extensions = /* @__PURE__ */ new Map(), r;
  })()
);
(function(r) {
  r.toStringTag = "LF.".concat(r.name);
})(Oi || (Oi = {}));
function je(r) {
  return Gi(r);
}
function Ov(r) {
  try {
    const e = JSON.parse(r);
    if (Array.isArray(e.nodes) && Array.isArray(e.edges)) return e;
  } catch {
  }
  return { nodes: [], edges: [] };
}
function Lv({ body: r, readOnly: e = !1, onChange: t }) {
  const n = ln(null), o = ln(null), i = ln(r), a = ln(t);
  a.current = t, au(() => {
    if (!n.current) return;
    const l = new Oi({ container: n.current, grid: !0, keyboard: { enabled: !e }, isSilentMode: e });
    l.setTheme({ rect: { stroke: "#739187", radius: 10 }, ellipse: { stroke: "#00856a" }, diamond: { stroke: "#b7791f" }, polyline: { stroke: "#789087" } }), l.render(Ov(i.current)), o.current = l;
    const u = "node:add,node:delete,node:drop,edge:add,edge:delete,edge:adjust,text:update", d = () => {
      e || a.current(JSON.stringify(l.getGraphRawData()));
    };
    return l.on(u, d), () => {
      l.off(u, d), o.current = null, n.current && n.current.replaceChildren();
    };
  }, [e]);
  const s = (l, u) => {
    const d = o.current;
    d && d.addNode({ type: l, x: 220 + Math.random() * 220, y: 130 + Math.random() * 220, text: u });
  };
  return /* @__PURE__ */ Vt("div", { className: "knowledge-open-editor is-logicflow", children: [
    !e && /* @__PURE__ */ Vt("div", { className: "native-editor-actions", children: [
      /* @__PURE__ */ Vt(Oo, { onClick: () => s("ellipse", "开始/结束"), children: [
        /* @__PURE__ */ wr(Au, { size: 15 }),
        "起止"
      ] }),
      /* @__PURE__ */ Vt(Oo, { onClick: () => s("rect", "处理步骤"), children: [
        /* @__PURE__ */ wr(Mu, { size: 15 }),
        "步骤"
      ] }),
      /* @__PURE__ */ Vt(Oo, { onClick: () => s("diamond", "判断条件"), children: [
        /* @__PURE__ */ wr(Pu, { size: 15 }),
        "判断"
      ] }),
      /* @__PURE__ */ Vt("span", { children: [
        /* @__PURE__ */ wr(Du, { size: 14 }),
        "拖动节点锚点即可连线"
      ] })
    ] }),
    /* @__PURE__ */ wr("div", { ref: n, className: "native-flowchart-host" })
  ] });
}
export {
  Lv as FlowchartEditor
};
