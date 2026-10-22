import { r as L, i as y } from "./isArrayLikeObject-CvpqkKQ7.js";
import { t as b, c as A, b as R, a as F } from "./_baseSet-BSnJXlbH.js";
var x = function() {
  return L.Date.now();
}, N = "Expected a function", O = Math.max, _ = Math.min;
function X(r, n, t) {
  var a, d, m, s, i, f, o = 0, E = !1, l = !1, v = !0;
  if (typeof r != "function")
    throw new TypeError(N);
  n = b(n) || 0, y(t) && (E = !!t.leading, l = "maxWait" in t, m = l ? O(b(t.maxWait) || 0, n) : m, v = "trailing" in t ? !!t.trailing : v);
  function T(e) {
    var u = a, c = d;
    return a = d = void 0, o = e, s = r.apply(c, u), s;
  }
  function M(e) {
    return o = e, i = setTimeout(g, n), E ? T(e) : s;
  }
  function S(e) {
    var u = e - f, c = e - o, W = n - u;
    return l ? _(W, m - c) : W;
  }
  function k(e) {
    var u = e - f, c = e - o;
    return f === void 0 || u >= n || u < 0 || l && c >= m;
  }
  function g() {
    var e = x();
    if (k(e))
      return I(e);
    i = setTimeout(g, S(e));
  }
  function I(e) {
    return i = void 0, v && a ? T(e) : (a = d = void 0, s);
  }
  function p() {
    i !== void 0 && clearTimeout(i), o = 0, a = f = d = i = void 0;
  }
  function C() {
    return i === void 0 ? s : I(x());
  }
  function h() {
    var e = x(), u = k(e);
    if (a = arguments, d = this, f = e, u) {
      if (i === void 0)
        return M(f);
      if (l)
        return clearTimeout(i), i = setTimeout(g, n), T(f);
    }
    return i === void 0 && (i = setTimeout(g, n)), s;
  }
  return h.cancel = p, h.flush = C, h;
}
var q = A(function(r, n, t, a) {
  R(r, n, t, a);
});
function z(r, n, t) {
  return r == null ? r : F(r, n, t);
}
export {
  X as d,
  q as m,
  x as n,
  z as s
};
