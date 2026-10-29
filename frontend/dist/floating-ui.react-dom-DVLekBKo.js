import { r as J, s as K, t as N, u as Q, v as T, w as U, x as X, y as Y, z } from "./index-DYsA9s7a.js";
import * as s from "react";
import { useLayoutEffect as Z } from "react";
import * as b from "react-dom";
var ee = typeof document < "u", te = function() {
}, h = ee ? Z : te;
function R(e, n) {
  if (e === n)
    return !0;
  if (typeof e != typeof n)
    return !1;
  if (typeof e == "function" && e.toString() === n.toString())
    return !0;
  let t, r, o;
  if (e && n && typeof e == "object") {
    if (Array.isArray(e)) {
      if (t = e.length, t !== n.length) return !1;
      for (r = t; r-- !== 0; )
        if (!R(e[r], n[r]))
          return !1;
      return !0;
    }
    if (o = Object.keys(e), t = o.length, t !== Object.keys(n).length)
      return !1;
    for (r = t; r-- !== 0; )
      if (!{}.hasOwnProperty.call(n, o[r]))
        return !1;
    for (r = t; r-- !== 0; ) {
      const p = o[r];
      if (!(p === "_owner" && e.$$typeof) && !R(e[p], n[p]))
        return !1;
    }
    return !0;
  }
  return e !== e && n !== n;
}
function A(e) {
  return typeof window > "u" ? 1 : (e.ownerDocument.defaultView || window).devicePixelRatio || 1;
}
function L(e, n) {
  const t = A(e);
  return Math.round(n * t) / t;
}
function k(e) {
  const n = s.useRef(e);
  return h(() => {
    n.current = e;
  }), n;
}
function fe(e) {
  e === void 0 && (e = {});
  const {
    placement: n = "bottom",
    strategy: t = "absolute",
    middleware: r = [],
    platform: o,
    elements: {
      reference: p,
      floating: q
    } = {},
    transform: D = !0,
    whileElementsMounted: E,
    open: x
  } = e, [u, v] = s.useState({
    x: 0,
    y: 0,
    strategy: t,
    placement: n,
    middlewareData: {},
    isPositioned: !1
  }), [M, B] = s.useState(r);
  R(M, r) || B(r);
  const [V, W] = s.useState(null), [G, H] = s.useState(null), C = s.useCallback((f) => {
    f !== c.current && (c.current = f, W(f));
  }, []), O = s.useCallback((f) => {
    f !== m.current && (m.current = f, H(f));
  }, []), i = p || V, a = q || G, c = s.useRef(null), m = s.useRef(null), y = s.useRef(u), I = E != null, P = k(E), S = k(o), _ = k(x), g = s.useCallback(() => {
    if (!c.current || !m.current)
      return;
    const f = {
      placement: n,
      strategy: t,
      middleware: M
    };
    S.current && (f.platform = S.current), T(c.current, m.current, f).then((w) => {
      const d = {
        ...w,
        // The floating element's position may be recomputed while it's closed
        // but still mounted (such as when transitioning out). To ensure
        // `isPositioned` will be `false` initially on the next open, avoid
        // setting it to `true` when `open === false` (must be specified).
        isPositioned: _.current !== !1
      };
      $.current && !R(y.current, d) && (y.current = d, b.flushSync(() => {
        v(d);
      }));
    });
  }, [M, n, t, S, _]);
  h(() => {
    x === !1 && y.current.isPositioned && (y.current.isPositioned = !1, v((f) => ({
      ...f,
      isPositioned: !1
    })));
  }, [x]);
  const $ = s.useRef(!1);
  h(() => ($.current = !0, () => {
    $.current = !1;
  }), []), h(() => {
    if (i && (c.current = i), a && (m.current = a), i && a) {
      if (P.current)
        return P.current(i, a, g);
      g();
    }
  }, [i, a, g, P, I]);
  const F = s.useMemo(() => ({
    reference: c,
    floating: m,
    setReference: C,
    setFloating: O
  }), [C, O]), l = s.useMemo(() => ({
    reference: i,
    floating: a
  }), [i, a]), j = s.useMemo(() => {
    const f = {
      position: t,
      left: 0,
      top: 0
    };
    if (!l.floating)
      return f;
    const w = L(l.floating, u.x), d = L(l.floating, u.y);
    return D ? {
      ...f,
      transform: "translate(" + w + "px, " + d + "px)",
      ...A(l.floating) >= 1.5 && {
        willChange: "transform"
      }
    } : {
      position: t,
      left: w,
      top: d
    };
  }, [t, D, l.floating, u.x, u.y]);
  return s.useMemo(() => ({
    ...u,
    update: g,
    refs: F,
    elements: l,
    floatingStyles: j
  }), [u, g, F, l, j]);
}
const ne = (e) => {
  function n(t) {
    return {}.hasOwnProperty.call(t, "current");
  }
  return {
    name: "arrow",
    options: e,
    fn(t) {
      const {
        element: r,
        padding: o
      } = typeof e == "function" ? e(t) : e;
      return r && n(r) ? r.current != null ? z({
        element: r.current,
        padding: o
      }).fn(t) : {} : r ? z({
        element: r,
        padding: o
      }).fn(t) : {};
    }
  };
}, oe = (e, n) => {
  const t = J(e);
  return {
    name: t.name,
    fn: t.fn,
    options: [e, n]
  };
}, ue = (e, n) => {
  const t = K(e);
  return {
    name: t.name,
    fn: t.fn,
    options: [e, n]
  };
}, ie = (e, n) => ({
  fn: Y(e).fn,
  options: [e, n]
}), ae = (e, n) => {
  const t = N(e);
  return {
    name: t.name,
    fn: t.fn,
    options: [e, n]
  };
}, le = (e, n) => {
  const t = Q(e);
  return {
    name: t.name,
    fn: t.fn,
    options: [e, n]
  };
}, ce = (e, n) => {
  const t = U(e);
  return {
    name: t.name,
    fn: t.fn,
    options: [e, n]
  };
}, me = (e, n) => {
  const t = X(e);
  return {
    name: t.name,
    fn: t.fn,
    options: [e, n]
  };
}, de = (e, n) => {
  const t = ne(e);
  return {
    name: t.name,
    fn: t.fn,
    options: [e, n]
  };
};
export {
  le as a,
  de as b,
  ae as f,
  ce as h,
  me as i,
  ie as l,
  oe as o,
  ue as s,
  fe as u
};
