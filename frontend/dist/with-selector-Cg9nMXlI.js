import { W as G, A as C } from "./index-lIm0768R.js";
import j from "react";
var L = { exports: {} }, p = {};
var y;
function z() {
  if (y) return p;
  y = 1;
  var v = j, O = G();
  function R(r, u) {
    return r === u && (r !== 0 || 1 / r === 1 / u) || r !== r && u !== u;
  }
  var V = typeof Object.is == "function" ? Object.is : R, A = O.useSyncExternalStore, D = v.useRef, S = v.useEffect, b = v.useMemo, T = v.useDebugValue;
  return p.useSyncExternalStoreWithSelector = function(r, u, _, c, f) {
    var t = D(null);
    if (t.current === null) {
      var o = { hasValue: !1, value: null };
      t.current = o;
    } else o = t.current;
    t = b(
      function() {
        function d(e) {
          if (!s) {
            if (s = !0, l = e, e = c(e), f !== void 0 && o.hasValue) {
              var i = o.value;
              if (f(i, e))
                return a = i;
            }
            return a = e;
          }
          if (i = a, V(l, e)) return i;
          var E = c(e);
          return f !== void 0 && f(i, E) ? (l = e, i) : (l = e, a = E);
        }
        var s = !1, l, a, m = _ === void 0 ? null : _;
        return [
          function() {
            return d(u());
          },
          m === null ? void 0 : function() {
            return d(m());
          }
        ];
      },
      [u, _, c, f]
    );
    var n = A(r, t[0], t[1]);
    return S(
      function() {
        o.hasValue = !0, o.value = n;
      },
      [n]
    ), T(n), n;
  }, p;
}
var M = {};
var W;
function B() {
  return W || (W = 1, process.env.NODE_ENV !== "production" && (function() {
    function v(r, u) {
      return r === u && (r !== 0 || 1 / r === 1 / u) || r !== r && u !== u;
    }
    typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error());
    var O = j, R = G(), V = typeof Object.is == "function" ? Object.is : v, A = R.useSyncExternalStore, D = O.useRef, S = O.useEffect, b = O.useMemo, T = O.useDebugValue;
    M.useSyncExternalStoreWithSelector = function(r, u, _, c, f) {
      var t = D(null);
      if (t.current === null) {
        var o = { hasValue: !1, value: null };
        t.current = o;
      } else o = t.current;
      t = b(
        function() {
          function d(e) {
            if (!s) {
              if (s = !0, l = e, e = c(e), f !== void 0 && o.hasValue) {
                var i = o.value;
                if (f(i, e))
                  return a = i;
              }
              return a = e;
            }
            if (i = a, V(l, e))
              return i;
            var E = c(e);
            return f !== void 0 && f(i, E) ? (l = e, i) : (l = e, a = E);
          }
          var s = !1, l, a, m = _ === void 0 ? null : _;
          return [
            function() {
              return d(u());
            },
            m === null ? void 0 : function() {
              return d(m());
            }
          ];
        },
        [u, _, c, f]
      );
      var n = A(r, t[0], t[1]);
      return S(
        function() {
          o.hasValue = !0, o.value = n;
        },
        [n]
      ), T(n), n;
    }, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());
  })()), M;
}
var h;
function H() {
  return h || (h = 1, process.env.NODE_ENV === "production" ? L.exports = z() : L.exports = B()), L.exports;
}
var I = H();
const N = /* @__PURE__ */ C(I);
export {
  N as u
};
