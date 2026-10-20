import { a as F, i as l, d as x, e as h, b as C, c as $, f as q, g as L, h as G, o as D, j as H, k as R, r as W, U as y, l as J, m as Q, n as w, p as X, q as I, s as Y, t as Z, S as z, u as V, v as j } from "./isArrayLikeObject-22lj2fKO.js";
var k = /\s/;
function rr(r) {
  for (var n = r.length; n-- && k.test(r.charAt(n)); )
    ;
  return n;
}
var nr = /^\s+/;
function er(r) {
  return r && r.slice(0, rr(r) + 1).replace(nr, "");
}
var _ = NaN, tr = /^[-+]0x[0-9a-f]+$/i, ir = /^0b[01]+$/i, fr = /^0o[0-7]+$/i, ar = parseInt;
function Br(r) {
  if (typeof r == "number")
    return r;
  if (F(r))
    return _;
  if (l(r)) {
    var n = typeof r.valueOf == "function" ? r.valueOf() : r;
    r = l(n) ? n + "" : n;
  }
  if (typeof r != "string")
    return r === 0 ? r : +r;
  r = er(r);
  var e = ir.test(r);
  return e || fr.test(r) ? ar(r.slice(2), e ? 2 : 8) : tr.test(r) ? _ : +r;
}
var b = Object.create, sr = /* @__PURE__ */ (function() {
  function r() {
  }
  return function(n) {
    if (!l(n))
      return {};
    if (b)
      return b(n);
    r.prototype = n;
    var e = new r();
    return r.prototype = void 0, e;
  };
})();
function or(r, n) {
  var e = -1, i = r.length;
  for (n || (n = Array(i)); ++e < i; )
    n[e] = r[e];
  return n;
}
function m(r, n, e) {
  n == "__proto__" && x ? x(r, n, {
    configurable: !0,
    enumerable: !0,
    value: e,
    writable: !0
  }) : r[n] = e;
}
var ur = Object.prototype, lr = ur.hasOwnProperty;
function B(r, n, e) {
  var i = r[n];
  (!(lr.call(r, n) && h(i, e)) || e === void 0 && !(n in r)) && m(r, n, e);
}
function dr(r, n, e, i) {
  var a = !e;
  e || (e = {});
  for (var s = -1, o = n.length; ++s < o; ) {
    var t = n[s], f = void 0;
    f === void 0 && (f = r[t]), a ? m(e, t, f) : B(e, t, f);
  }
  return e;
}
function cr(r, n, e) {
  if (!l(e))
    return !1;
  var i = typeof n;
  return (i == "number" ? C(e) && $(n, e.length) : i == "string" && n in e) ? h(e[n], r) : !1;
}
function pr(r) {
  return q(function(n, e) {
    var i = -1, a = e.length, s = a > 1 ? e[a - 1] : void 0, o = a > 2 ? e[2] : void 0;
    for (s = r.length > 3 && typeof s == "function" ? (a--, s) : void 0, o && cr(e[0], e[1], o) && (s = a < 3 ? void 0 : s, a = 1), n = Object(n); ++i < a; ) {
      var t = e[i];
      t && r(n, t, i, s);
    }
    return n;
  });
}
function gr(r) {
  var n = [];
  if (r != null)
    for (var e in Object(r))
      n.push(e);
  return n;
}
var vr = Object.prototype, Or = vr.hasOwnProperty;
function hr(r) {
  if (!l(r))
    return gr(r);
  var n = L(r), e = [];
  for (var i in r)
    i == "constructor" && (n || !Or.call(r, i)) || e.push(i);
  return e;
}
function K(r) {
  return C(r) ? G(r, !0) : hr(r);
}
var M = D(Object.getPrototypeOf, Object), mr = "[object Object]", Pr = Function.prototype, xr = Object.prototype, N = Pr.toString, yr = xr.hasOwnProperty, wr = N.call(Object);
function Ir(r) {
  if (!H(r) || R(r) != mr)
    return !1;
  var n = M(r);
  if (n === null)
    return !0;
  var e = yr.call(n, "constructor") && n.constructor;
  return typeof e == "function" && e instanceof e && N.call(e) == wr;
}
var U = typeof exports == "object" && exports && !exports.nodeType && exports, A = U && typeof module == "object" && module && !module.nodeType && module, _r = A && A.exports === U, S = _r ? W.Buffer : void 0, T = S ? S.allocUnsafe : void 0;
function br(r, n) {
  if (n)
    return r.slice();
  var e = r.length, i = T ? T(e) : new r.constructor(e);
  return r.copy(i), i;
}
function Ar(r) {
  var n = new r.constructor(r.byteLength);
  return new y(n).set(new y(r)), n;
}
function Sr(r, n) {
  var e = n ? Ar(r.buffer) : r.buffer;
  return new r.constructor(e, r.byteOffset, r.length);
}
function Tr(r) {
  return typeof r.constructor == "function" && !L(r) ? sr(M(r)) : {};
}
function v(r, n, e) {
  (e !== void 0 && !h(r[n], e) || e === void 0 && !(n in r)) && m(r, n, e);
}
function O(r, n) {
  if (!(n === "constructor" && typeof r[n] == "function") && n != "__proto__")
    return r[n];
}
function Cr(r) {
  return dr(r, K(r));
}
function $r(r, n, e, i, a, s, o) {
  var t = O(r, e), f = O(n, e), d = o.get(f);
  if (d) {
    v(r, e, d);
    return;
  }
  var u = s ? s(t, f, e + "", r, n, o) : void 0, c = u === void 0;
  if (c) {
    var p = w(f), g = !p && J(f), P = !p && !g && Q(f);
    u = f, p || g || P ? w(t) ? u = t : X(t) ? u = or(t) : g ? (c = !1, u = br(f, !0)) : P ? (c = !1, u = Sr(f, !0)) : u = [] : Ir(f) || I(f) ? (u = t, I(t) ? u = Cr(t) : (!l(t) || Y(t)) && (u = Tr(f))) : c = !1;
  }
  c && (o.set(f, u), a(u, f, i, s, o), o.delete(f)), v(r, e, u);
}
function E(r, n, e, i, a) {
  r !== n && Z(n, function(s, o) {
    if (a || (a = new z()), l(s))
      $r(r, n, o, e, E, i, a);
    else {
      var t = i ? i(O(r, o), s, o + "", r, n, a) : void 0;
      t === void 0 && (t = s), v(r, o, t);
    }
  }, K);
}
var Kr = pr(function(r, n, e) {
  E(r, n, e);
});
function Mr(r, n, e, i) {
  if (!l(r))
    return r;
  n = V(n, r);
  for (var a = -1, s = n.length, o = s - 1, t = r; t != null && ++a < s; ) {
    var f = j(n[a]), d = e;
    if (f === "__proto__" || f === "constructor" || f === "prototype")
      return r;
    if (a != o) {
      var u = t[f];
      d = void 0, d === void 0 && (d = l(u) ? u : $(n[a + 1]) ? [] : {});
    }
    B(t, f, d), t = t[f];
  }
  return r;
}
export {
  Sr as a,
  Mr as b,
  Ar as c,
  br as d,
  B as e,
  cr as f,
  m as g,
  pr as h,
  Tr as i,
  dr as j,
  K as k,
  E as l,
  Kr as m,
  Br as t
};
