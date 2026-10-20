import { g as W } from "./index-Dohiw6b-.js";
import D from "react";
var V = { exports: {} }, b = {};
var C;
function x() {
  if (C) return b;
  C = 1;
  var c = D;
  function d(n, u) {
    return n === u && (n !== 0 || 1 / n === 1 / u) || n !== n && u !== u;
  }
  var v = typeof Object.is == "function" ? Object.is : d, y = c.useState, l = c.useEffect, m = c.useLayoutEffect, L = c.useDebugValue;
  function h(n, u) {
    var e = u(), r = y({ inst: { value: e, getSnapshot: u } }), t = r[0].inst, a = r[1];
    return m(
      function() {
        t.value = e, t.getSnapshot = u, S(t) && a({ inst: t });
      },
      [n, e, u]
    ), l(
      function() {
        return S(t) && a({ inst: t }), n(function() {
          S(t) && a({ inst: t });
        });
      },
      [n]
    ), L(e), e;
  }
  function S(n) {
    var u = n.getSnapshot;
    n = n.value;
    try {
      var e = u();
      return !v(n, e);
    } catch {
      return !0;
    }
  }
  function i(n, u) {
    return u();
  }
  var o = typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u" ? i : h;
  return b.useSyncExternalStore = c.useSyncExternalStore !== void 0 ? c.useSyncExternalStore : o, b;
}
var w = {};
var I;
function N() {
  return I || (I = 1, process.env.NODE_ENV !== "production" && (function() {
    function c(e, r) {
      return e === r && (e !== 0 || 1 / e === 1 / r) || e !== e && r !== r;
    }
    function d(e, r) {
      o || l.startTransition === void 0 || (o = !0, console.error(
        "You are using an outdated, pre-release alpha of React 18 that does not support useSyncExternalStore. The use-sync-external-store shim will not work correctly. Upgrade to a newer pre-release."
      ));
      var t = r();
      if (!n) {
        var a = r();
        m(t, a) || (console.error(
          "The result of getSnapshot should be cached to avoid an infinite loop"
        ), n = !0);
      }
      a = L({
        inst: { value: t, getSnapshot: r }
      });
      var s = a[0].inst, O = a[1];
      return S(
        function() {
          s.value = t, s.getSnapshot = r, v(s) && O({ inst: s });
        },
        [e, t, r]
      ), h(
        function() {
          return v(s) && O({ inst: s }), e(function() {
            v(s) && O({ inst: s });
          });
        },
        [e]
      ), i(t), t;
    }
    function v(e) {
      var r = e.getSnapshot;
      e = e.value;
      try {
        var t = r();
        return !m(e, t);
      } catch {
        return !0;
      }
    }
    function y(e, r) {
      return r();
    }
    typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error());
    var l = D, m = typeof Object.is == "function" ? Object.is : c, L = l.useState, h = l.useEffect, S = l.useLayoutEffect, i = l.useDebugValue, o = !1, n = !1, u = typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u" ? y : d;
    w.useSyncExternalStore = l.useSyncExternalStore !== void 0 ? l.useSyncExternalStore : u, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());
  })()), w;
}
var M;
function K() {
  return M || (M = 1, process.env.NODE_ENV === "production" ? V.exports = x() : V.exports = N()), V.exports;
}
var A = { exports: {} }, G = {};
var j;
function U() {
  if (j) return G;
  j = 1;
  var c = D, d = K();
  function v(i, o) {
    return i === o && (i !== 0 || 1 / i === 1 / o) || i !== i && o !== o;
  }
  var y = typeof Object.is == "function" ? Object.is : v, l = d.useSyncExternalStore, m = c.useRef, L = c.useEffect, h = c.useMemo, S = c.useDebugValue;
  return G.useSyncExternalStoreWithSelector = function(i, o, n, u, e) {
    var r = m(null);
    if (r.current === null) {
      var t = { hasValue: !1, value: null };
      r.current = t;
    } else t = r.current;
    r = h(
      function() {
        function s(f) {
          if (!O) {
            if (O = !0, E = f, f = u(f), e !== void 0 && t.hasValue) {
              var _ = t.value;
              if (e(_, f))
                return p = _;
            }
            return p = f;
          }
          if (_ = p, y(E, f)) return _;
          var T = u(f);
          return e !== void 0 && e(_, T) ? (E = f, _) : (E = f, p = T);
        }
        var O = !1, E, p, R = n === void 0 ? null : n;
        return [
          function() {
            return s(o());
          },
          R === null ? void 0 : function() {
            return s(R());
          }
        ];
      },
      [o, n, u, e]
    );
    var a = l(i, r[0], r[1]);
    return L(
      function() {
        t.hasValue = !0, t.value = a;
      },
      [a]
    ), S(a), a;
  }, G;
}
var g = {};
var B;
function z() {
  return B || (B = 1, process.env.NODE_ENV !== "production" && (function() {
    function c(i, o) {
      return i === o && (i !== 0 || 1 / i === 1 / o) || i !== i && o !== o;
    }
    typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error());
    var d = D, v = K(), y = typeof Object.is == "function" ? Object.is : c, l = v.useSyncExternalStore, m = d.useRef, L = d.useEffect, h = d.useMemo, S = d.useDebugValue;
    g.useSyncExternalStoreWithSelector = function(i, o, n, u, e) {
      var r = m(null);
      if (r.current === null) {
        var t = { hasValue: !1, value: null };
        r.current = t;
      } else t = r.current;
      r = h(
        function() {
          function s(f) {
            if (!O) {
              if (O = !0, E = f, f = u(f), e !== void 0 && t.hasValue) {
                var _ = t.value;
                if (e(_, f))
                  return p = _;
              }
              return p = f;
            }
            if (_ = p, y(E, f))
              return _;
            var T = u(f);
            return e !== void 0 && e(_, T) ? (E = f, _) : (E = f, p = T);
          }
          var O = !1, E, p, R = n === void 0 ? null : n;
          return [
            function() {
              return s(o());
            },
            R === null ? void 0 : function() {
              return s(R());
            }
          ];
        },
        [o, n, u, e]
      );
      var a = l(i, r[0], r[1]);
      return L(
        function() {
          t.hasValue = !0, t.value = a;
        },
        [a]
      ), S(a), a;
    }, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());
  })()), g;
}
var H;
function q() {
  return H || (H = 1, process.env.NODE_ENV === "production" ? A.exports = U() : A.exports = z()), A.exports;
}
var $ = q();
const Y = /* @__PURE__ */ W($);
export {
  K as r,
  Y as u
};
