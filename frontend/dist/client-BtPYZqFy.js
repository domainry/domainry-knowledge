import cE from "react";
import iE from "react-dom";
var eb = { exports: {} }, s1 = {}, lb = { exports: {} }, Z2 = {};
var tE;
function R4() {
  return tE || (tE = 1, (function(K) {
    function ma(Y, L) {
      var Q = Y.length;
      Y.push(L);
      t: for (; 0 < Q; ) {
        var P = Q - 1 >>> 1, dt = Y[P];
        if (0 < ya(dt, L))
          Y[P] = L, Y[Q] = dt, Q = P;
        else break t;
      }
    }
    function hl(Y) {
      return Y.length === 0 ? null : Y[0];
    }
    function q(Y) {
      if (Y.length === 0) return null;
      var L = Y[0], Q = Y.pop();
      if (Q !== L) {
        Y[0] = Q;
        t: for (var P = 0, dt = Y.length, tt = dt >>> 1; P < tt; ) {
          var Ye = 2 * (P + 1) - 1, de = Y[Ye], yt = Ye + 1, vl = Y[yt];
          if (0 > ya(de, Q))
            yt < dt && 0 > ya(vl, de) ? (Y[P] = vl, Y[yt] = Q, P = yt) : (Y[P] = de, Y[Ye] = Q, P = Ye);
          else if (yt < dt && 0 > ya(vl, Q))
            Y[P] = vl, Y[yt] = Q, P = yt;
          else break t;
        }
      }
      return L;
    }
    function ya(Y, L) {
      var Q = Y.sortIndex - L.sortIndex;
      return Q !== 0 ? Q : Y.id - L.id;
    }
    if (K.unstable_now = void 0, typeof performance == "object" && typeof performance.now == "function") {
      var qa = performance;
      K.unstable_now = function() {
        return qa.now();
      };
    } else {
      var Mn = Date, W = Mn.now();
      K.unstable_now = function() {
        return Mn.now() - W;
      };
    }
    var ml = [], va = [], Wi = 1, Yt = null, Ot = 3, Cl = !1, yl = !1, vu = !1, Mt = !1, Wt = typeof setTimeout == "function" ? setTimeout : null, _n = typeof clearTimeout == "function" ? clearTimeout : null, Un = typeof setImmediate < "u" ? setImmediate : null;
    function Ga(Y) {
      for (var L = hl(va); L !== null; ) {
        if (L.callback === null) q(va);
        else if (L.startTime <= Y)
          q(va), L.sortIndex = L.expirationTime, ma(ml, L);
        else break;
        L = hl(va);
      }
    }
    function gu(Y) {
      if (vu = !1, Ga(Y), !yl)
        if (hl(ml) !== null)
          yl = !0, ga || (ga = !0, Va());
        else {
          var L = hl(va);
          L !== null && Rl(gu, L.startTime - Y);
        }
    }
    var ga = !1, mt = -1, nn = 5, Qe = -1;
    function Kl() {
      return Mt ? !0 : !(K.unstable_now() - Qe < nn);
    }
    function pa() {
      if (Mt = !1, ga) {
        var Y = K.unstable_now();
        Qe = Y;
        var L = !0;
        try {
          t: {
            yl = !1, vu && (vu = !1, _n(mt), mt = -1), Cl = !0;
            var Q = Ot;
            try {
              e: {
                for (Ga(Y), Yt = hl(ml); Yt !== null && !(Yt.expirationTime > Y && Kl()); ) {
                  var P = Yt.callback;
                  if (typeof P == "function") {
                    Yt.callback = null, Ot = Yt.priorityLevel;
                    var dt = P(
                      Yt.expirationTime <= Y
                    );
                    if (Y = K.unstable_now(), typeof dt == "function") {
                      Yt.callback = dt, Ga(Y), L = !0;
                      break e;
                    }
                    Yt === hl(ml) && q(ml), Ga(Y);
                  } else q(ml);
                  Yt = hl(ml);
                }
                if (Yt !== null) L = !0;
                else {
                  var tt = hl(va);
                  tt !== null && Rl(
                    gu,
                    tt.startTime - Y
                  ), L = !1;
                }
              }
              break t;
            } finally {
              Yt = null, Ot = Q, Cl = !1;
            }
            L = void 0;
          }
        } finally {
          L ? Va() : ga = !1;
        }
      }
    }
    var Va;
    if (typeof Un == "function")
      Va = function() {
        Un(pa);
      };
    else if (typeof MessageChannel < "u") {
      var It = new MessageChannel(), Ii = It.port2;
      It.port1.onmessage = pa, Va = function() {
        Ii.postMessage(null);
      };
    } else
      Va = function() {
        Wt(pa, 0);
      };
    function Rl(Y, L) {
      mt = Wt(function() {
        Y(K.unstable_now());
      }, L);
    }
    K.unstable_IdlePriority = 5, K.unstable_ImmediatePriority = 1, K.unstable_LowPriority = 4, K.unstable_NormalPriority = 3, K.unstable_Profiling = null, K.unstable_UserBlockingPriority = 2, K.unstable_cancelCallback = function(Y) {
      Y.callback = null;
    }, K.unstable_forceFrameRate = function(Y) {
      0 > Y || 125 < Y ? console.error(
        "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"
      ) : nn = 0 < Y ? Math.floor(1e3 / Y) : 5;
    }, K.unstable_getCurrentPriorityLevel = function() {
      return Ot;
    }, K.unstable_next = function(Y) {
      switch (Ot) {
        case 1:
        case 2:
        case 3:
          var L = 3;
          break;
        default:
          L = Ot;
      }
      var Q = Ot;
      Ot = L;
      try {
        return Y();
      } finally {
        Ot = Q;
      }
    }, K.unstable_requestPaint = function() {
      Mt = !0;
    }, K.unstable_runWithPriority = function(Y, L) {
      switch (Y) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          Y = 3;
      }
      var Q = Ot;
      Ot = Y;
      try {
        return L();
      } finally {
        Ot = Q;
      }
    }, K.unstable_scheduleCallback = function(Y, L, Q) {
      var P = K.unstable_now();
      switch (typeof Q == "object" && Q !== null ? (Q = Q.delay, Q = typeof Q == "number" && 0 < Q ? P + Q : P) : Q = P, Y) {
        case 1:
          var dt = -1;
          break;
        case 2:
          dt = 250;
          break;
        case 5:
          dt = 1073741823;
          break;
        case 4:
          dt = 1e4;
          break;
        default:
          dt = 5e3;
      }
      return dt = Q + dt, Y = {
        id: Wi++,
        callback: L,
        priorityLevel: Y,
        startTime: Q,
        expirationTime: dt,
        sortIndex: -1
      }, Q > P ? (Y.sortIndex = Q, ma(va, Y), hl(ml) === null && Y === hl(va) && (vu ? (_n(mt), mt = -1) : vu = !0, Rl(gu, Q - P))) : (Y.sortIndex = dt, ma(ml, Y), yl || Cl || (yl = !0, ga || (ga = !0, Va()))), Y;
    }, K.unstable_shouldYield = Kl, K.unstable_wrapCallback = function(Y) {
      var L = Ot;
      return function() {
        var Q = Ot;
        Ot = L;
        try {
          return Y.apply(this, arguments);
        } finally {
          Ot = Q;
        }
      };
    };
  })(Z2)), Z2;
}
var L2 = {};
var eE;
function M4() {
  return eE || (eE = 1, (function(K) {
    process.env.NODE_ENV !== "production" && (function() {
      function ma() {
        if (gu = !1, Qe) {
          var Y = K.unstable_now();
          Va = Y;
          var L = !0;
          try {
            t: {
              Un = !1, Ga && (Ga = !1, mt(Kl), Kl = -1), _n = !0;
              var Q = Wt;
              try {
                e: {
                  for (Mn(Y), Mt = q(Cl); Mt !== null && !(Mt.expirationTime > Y && ml()); ) {
                    var P = Mt.callback;
                    if (typeof P == "function") {
                      Mt.callback = null, Wt = Mt.priorityLevel;
                      var dt = P(
                        Mt.expirationTime <= Y
                      );
                      if (Y = K.unstable_now(), typeof dt == "function") {
                        Mt.callback = dt, Mn(Y), L = !0;
                        break e;
                      }
                      Mt === q(Cl) && ya(Cl), Mn(Y);
                    } else ya(Cl);
                    Mt = q(Cl);
                  }
                  if (Mt !== null) L = !0;
                  else {
                    var tt = q(yl);
                    tt !== null && va(
                      W,
                      tt.startTime - Y
                    ), L = !1;
                  }
                }
                break t;
              } finally {
                Mt = null, Wt = Q, _n = !1;
              }
              L = void 0;
            }
          } finally {
            L ? It() : Qe = !1;
          }
        }
      }
      function hl(Y, L) {
        var Q = Y.length;
        Y.push(L);
        t: for (; 0 < Q; ) {
          var P = Q - 1 >>> 1, dt = Y[P];
          if (0 < qa(dt, L))
            Y[P] = L, Y[Q] = dt, Q = P;
          else break t;
        }
      }
      function q(Y) {
        return Y.length === 0 ? null : Y[0];
      }
      function ya(Y) {
        if (Y.length === 0) return null;
        var L = Y[0], Q = Y.pop();
        if (Q !== L) {
          Y[0] = Q;
          t: for (var P = 0, dt = Y.length, tt = dt >>> 1; P < tt; ) {
            var Ye = 2 * (P + 1) - 1, de = Y[Ye], yt = Ye + 1, vl = Y[yt];
            if (0 > qa(de, Q))
              yt < dt && 0 > qa(vl, de) ? (Y[P] = vl, Y[yt] = Q, P = yt) : (Y[P] = de, Y[Ye] = Q, P = Ye);
            else if (yt < dt && 0 > qa(vl, Q))
              Y[P] = vl, Y[yt] = Q, P = yt;
            else break t;
          }
        }
        return L;
      }
      function qa(Y, L) {
        var Q = Y.sortIndex - L.sortIndex;
        return Q !== 0 ? Q : Y.id - L.id;
      }
      function Mn(Y) {
        for (var L = q(yl); L !== null; ) {
          if (L.callback === null) ya(yl);
          else if (L.startTime <= Y)
            ya(yl), L.sortIndex = L.expirationTime, hl(Cl, L);
          else break;
          L = q(yl);
        }
      }
      function W(Y) {
        if (Ga = !1, Mn(Y), !Un)
          if (q(Cl) !== null)
            Un = !0, Qe || (Qe = !0, It());
          else {
            var L = q(yl);
            L !== null && va(
              W,
              L.startTime - Y
            );
          }
      }
      function ml() {
        return gu ? !0 : !(K.unstable_now() - Va < pa);
      }
      function va(Y, L) {
        Kl = ga(function() {
          Y(K.unstable_now());
        }, L);
      }
      if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error()), K.unstable_now = void 0, typeof performance == "object" && typeof performance.now == "function") {
        var Wi = performance;
        K.unstable_now = function() {
          return Wi.now();
        };
      } else {
        var Yt = Date, Ot = Yt.now();
        K.unstable_now = function() {
          return Yt.now() - Ot;
        };
      }
      var Cl = [], yl = [], vu = 1, Mt = null, Wt = 3, _n = !1, Un = !1, Ga = !1, gu = !1, ga = typeof setTimeout == "function" ? setTimeout : null, mt = typeof clearTimeout == "function" ? clearTimeout : null, nn = typeof setImmediate < "u" ? setImmediate : null, Qe = !1, Kl = -1, pa = 5, Va = -1;
      if (typeof nn == "function")
        var It = function() {
          nn(ma);
        };
      else if (typeof MessageChannel < "u") {
        var Ii = new MessageChannel(), Rl = Ii.port2;
        Ii.port1.onmessage = ma, It = function() {
          Rl.postMessage(null);
        };
      } else
        It = function() {
          ga(ma, 0);
        };
      K.unstable_IdlePriority = 5, K.unstable_ImmediatePriority = 1, K.unstable_LowPriority = 4, K.unstable_NormalPriority = 3, K.unstable_Profiling = null, K.unstable_UserBlockingPriority = 2, K.unstable_cancelCallback = function(Y) {
        Y.callback = null;
      }, K.unstable_forceFrameRate = function(Y) {
        0 > Y || 125 < Y ? console.error(
          "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"
        ) : pa = 0 < Y ? Math.floor(1e3 / Y) : 5;
      }, K.unstable_getCurrentPriorityLevel = function() {
        return Wt;
      }, K.unstable_next = function(Y) {
        switch (Wt) {
          case 1:
          case 2:
          case 3:
            var L = 3;
            break;
          default:
            L = Wt;
        }
        var Q = Wt;
        Wt = L;
        try {
          return Y();
        } finally {
          Wt = Q;
        }
      }, K.unstable_requestPaint = function() {
        gu = !0;
      }, K.unstable_runWithPriority = function(Y, L) {
        switch (Y) {
          case 1:
          case 2:
          case 3:
          case 4:
          case 5:
            break;
          default:
            Y = 3;
        }
        var Q = Wt;
        Wt = Y;
        try {
          return L();
        } finally {
          Wt = Q;
        }
      }, K.unstable_scheduleCallback = function(Y, L, Q) {
        var P = K.unstable_now();
        switch (typeof Q == "object" && Q !== null ? (Q = Q.delay, Q = typeof Q == "number" && 0 < Q ? P + Q : P) : Q = P, Y) {
          case 1:
            var dt = -1;
            break;
          case 2:
            dt = 250;
            break;
          case 5:
            dt = 1073741823;
            break;
          case 4:
            dt = 1e4;
            break;
          default:
            dt = 5e3;
        }
        return dt = Q + dt, Y = {
          id: vu++,
          callback: L,
          priorityLevel: Y,
          startTime: Q,
          expirationTime: dt,
          sortIndex: -1
        }, Q > P ? (Y.sortIndex = Q, hl(yl, Y), q(Cl) === null && Y === q(yl) && (Ga ? (mt(Kl), Kl = -1) : Ga = !0, va(W, Q - P))) : (Y.sortIndex = dt, hl(Cl, Y), Un || _n || (Un = !0, Qe || (Qe = !0, It()))), Y;
      }, K.unstable_shouldYield = ml, K.unstable_wrapCallback = function(Y) {
        var L = Wt;
        return function() {
          var Q = Wt;
          Wt = L;
          try {
            return Y.apply(this, arguments);
          } finally {
            Wt = Q;
          }
        };
      }, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());
    })();
  })(L2)), L2;
}
var lE;
function oE() {
  return lE || (lE = 1, process.env.NODE_ENV === "production" ? lb.exports = R4() : lb.exports = M4()), lb.exports;
}
var aE;
function _4() {
  if (aE) return s1;
  aE = 1;
  var K = oE(), ma = cE, hl = iE;
  function q(l) {
    var n = "https://react.dev/errors/" + l;
    if (1 < arguments.length) {
      n += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var u = 2; u < arguments.length; u++)
        n += "&args[]=" + encodeURIComponent(arguments[u]);
    }
    return "Minified React error #" + l + "; visit " + n + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function ya(l) {
    return !(!l || l.nodeType !== 1 && l.nodeType !== 9 && l.nodeType !== 11);
  }
  function qa(l) {
    for (var n = l, u = n; u && !u.alternate; )
      n = u, (n.flags & 4098) !== 0 && (l = n.return), u = n.return;
    for (; n.return; ) n = n.return;
    return n.tag === 3 ? l : null;
  }
  function Mn(l) {
    if (l.tag === 13) {
      var n = l.memoizedState;
      if (n === null && (l = l.alternate, l !== null && (n = l.memoizedState)), n !== null) return n.dehydrated;
    }
    return null;
  }
  function W(l) {
    if (l.tag === 31) {
      var n = l.memoizedState;
      if (n === null && (l = l.alternate, l !== null && (n = l.memoizedState)), n !== null) return n.dehydrated;
    }
    return null;
  }
  function ml(l) {
    if (qa(l) !== l)
      throw Error(q(188));
  }
  function va(l) {
    var n = l.alternate;
    if (!n) {
      if (n = qa(l), n === null) throw Error(q(188));
      return n !== l ? null : l;
    }
    for (var u = l, i = n; ; ) {
      var s = u.return;
      if (s === null) break;
      var r = s.alternate;
      if (r === null) {
        if (i = s.return, i !== null) {
          u = i;
          continue;
        }
        break;
      }
      if (s.child === r.child) {
        for (r = s.child; r; ) {
          if (r === u) return ml(s), l;
          if (r === i) return ml(s), n;
          r = r.sibling;
        }
        throw Error(q(188));
      }
      if (u.return !== i.return) u = s, i = r;
      else {
        for (var m = !1, g = s.child; g; ) {
          if (g === u) {
            m = !0, u = s, i = r;
            break;
          }
          if (g === i) {
            m = !0, i = s, u = r;
            break;
          }
          g = g.sibling;
        }
        if (!m) {
          for (g = r.child; g; ) {
            if (g === u) {
              m = !0, u = r, i = s;
              break;
            }
            if (g === i) {
              m = !0, i = r, u = s;
              break;
            }
            g = g.sibling;
          }
          if (!m) throw Error(q(189));
        }
      }
      if (u.alternate !== i) throw Error(q(190));
    }
    if (u.tag !== 3) throw Error(q(188));
    return u.stateNode.current === u ? l : n;
  }
  function Wi(l) {
    var n = l.tag;
    if (n === 5 || n === 26 || n === 27 || n === 6) return l;
    for (l = l.child; l !== null; ) {
      if (n = Wi(l), n !== null) return n;
      l = l.sibling;
    }
    return null;
  }
  function Yt(l, n, u, i, s, r) {
    for (; l !== null; ) {
      if ((l.tag === 5 || l.tag === 27 || l.tag === 6) && u(l, i, s, r) || (l.tag !== 22 || l.memoizedState === null) && (n || l.tag !== 5 && l.tag !== 27) && Yt(
        l.child,
        n,
        u,
        i,
        s,
        r
      ))
        return !0;
      l = l.sibling;
    }
    return !1;
  }
  function Ot(l) {
    for (l = l.return; l !== null; ) {
      if (l.tag === 3 || l.tag === 5 || l.tag === 27) return l;
      l = l.return;
    }
    return null;
  }
  function Cl(l) {
    var n = !1;
    for (l = l.return; l !== null && (l.tag === 4 && (n = !0), !(l.tag === 3 || l.tag === 5 || l.tag === 27)); )
      l = l.return;
    return n;
  }
  function yl(l) {
    var n = [null, null], u = Ot(l);
    return u === null || vu(
      n,
      l,
      u.child,
      { foundSelf: !1 }
    ), n;
  }
  function vu(l, n, u, i) {
    for (; u !== null; ) {
      if (u === n) i.foundSelf = !0;
      else if (u.tag === 5 || u.tag === 27 || u.tag === 6) {
        if (i.foundSelf) return l[1] = u, !0;
        l[0] = u;
      } else if ((u.tag !== 22 || u.memoizedState === null) && vu(
        l,
        n,
        u.child,
        i
      ))
        return !0;
      u = u.sibling;
    }
    return !1;
  }
  function Mt(l) {
    switch (l.tag) {
      case 5:
      case 27:
      case 6:
        return l.stateNode;
      case 3:
        return l.stateNode.containerInfo;
      default:
        throw Error(q(559));
    }
  }
  var Wt = null, _n = null;
  function Un(l, n, u) {
    return l === u ? !0 : l === n ? (Wt = l, !0) : !1;
  }
  function Ga(l, n, u) {
    return l === u ? (_n = l, !1) : l === n ? (_n !== null && (Wt = l), !0) : !1;
  }
  function gu(l) {
    if (l === null) return null;
    do
      l = l === null ? null : l.return;
    while (l && l.tag !== 5 && l.tag !== 27 && l.tag !== 3);
    return l || null;
  }
  function ga(l, n, u) {
    for (var i = 0, s = l; s; s = u(s)) i++;
    s = 0;
    for (var r = n; r; r = u(r)) s++;
    for (; 0 < i - s; ) l = u(l), i--;
    for (; 0 < s - i; ) n = u(n), s--;
    for (; i--; ) {
      if (l === n || n !== null && l === n.alternate)
        return l;
      l = u(l), n = u(n);
    }
    return null;
  }
  var mt = Object.assign, nn = /* @__PURE__ */ Symbol.for("react.element"), Qe = /* @__PURE__ */ Symbol.for("react.transitional.element"), Kl = /* @__PURE__ */ Symbol.for("react.portal"), pa = /* @__PURE__ */ Symbol.for("react.fragment"), Va = /* @__PURE__ */ Symbol.for("react.strict_mode"), It = /* @__PURE__ */ Symbol.for("react.profiler"), Ii = /* @__PURE__ */ Symbol.for("react.consumer"), Rl = /* @__PURE__ */ Symbol.for("react.context"), Y = /* @__PURE__ */ Symbol.for("react.forward_ref"), L = /* @__PURE__ */ Symbol.for("react.suspense"), Q = /* @__PURE__ */ Symbol.for("react.suspense_list"), P = /* @__PURE__ */ Symbol.for("react.memo"), dt = /* @__PURE__ */ Symbol.for("react.lazy"), tt = /* @__PURE__ */ Symbol.for("react.activity"), Ye = /* @__PURE__ */ Symbol.for("react.legacy_hidden"), de = /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel"), yt = /* @__PURE__ */ Symbol.for("react.view_transition"), vl = /* @__PURE__ */ Symbol.for("react.recoverable"), Is = Symbol.iterator;
  function pu(l) {
    return l === null || typeof l != "object" ? null : (l = Is && l[Is] || l["@@iterator"], typeof l == "function" ? l : null);
  }
  var ki = /* @__PURE__ */ Symbol.for("react.client.reference");
  function ks(l) {
    if (l == null) return null;
    if (typeof l == "function")
      return l.$$typeof === ki ? null : l.displayName || l.name || null;
    if (typeof l == "string") return l;
    switch (l) {
      case pa:
        return "Fragment";
      case It:
        return "Profiler";
      case Va:
        return "StrictMode";
      case L:
        return "Suspense";
      case Q:
        return "SuspenseList";
      case tt:
        return "Activity";
      case yt:
        return "ViewTransition";
    }
    if (typeof l == "object")
      switch (l.$$typeof) {
        case Kl:
          return "Portal";
        case Rl:
          return l.displayName || "Context";
        case Ii:
          return (l._context.displayName || "Context") + ".Consumer";
        case Y:
          var n = l.render;
          return l = l.displayName, l || (l = n.displayName || n.name || "", l = l !== "" ? "ForwardRef(" + l + ")" : "ForwardRef"), l;
        case P:
          return n = l.displayName || null, n !== null ? n : ks(l.type) || "Memo";
        case dt:
          n = l._payload, l = l._init;
          try {
            return ks(l(n));
          } catch {
          }
      }
    return null;
  }
  var kc = Array.isArray, ft = ma.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, Jt = hl.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, Pi = {
    pending: !1,
    data: null,
    method: null,
    action: null
  }, Ps = [], Ze = -1;
  function un(l) {
    return { current: l };
  }
  function gl(l) {
    0 > Ze || (l.current = Ps[Ze], Ps[Ze] = null, Ze--);
  }
  function fe(l, n) {
    Ze++, Ps[Ze] = l.current, l.current = n;
  }
  var Nn = un(null), Pc = un(null), ti = un(null), $ = un(null);
  function gf(l, n) {
    switch (fe(ti, n), fe(Pc, l), fe(Nn, null), n.nodeType) {
      case 9:
      case 11:
        l = (l = n.documentElement) && (l = l.namespaceURI) ? Up(l) : 0;
        break;
      default:
        if (l = n.tagName, n = n.namespaceURI)
          n = Up(n), l = jv(n, l);
        else
          switch (l) {
            case "svg":
              l = 1;
              break;
            case "math":
              l = 2;
              break;
            default:
              l = 0;
          }
    }
    gl(Nn), fe(Nn, l);
  }
  function uc() {
    gl(Nn), gl(Pc), gl(ti);
  }
  function pf(l) {
    var n = l.memoizedState;
    n !== null && ($e._currentValue = n.memoizedState, fe($, l)), n = Nn.current;
    var u = jv(n, l.type);
    n !== u && (fe(Pc, l), fe(Nn, u));
  }
  function ei(l) {
    Pc.current === l && (gl(Nn), gl(Pc)), $.current === l && (gl($), $e._currentValue = Pi);
  }
  var ne, ih;
  function Su(l) {
    if (ne === void 0)
      try {
        throw Error();
      } catch (u) {
        var n = u.stack.trim().match(/\n( *(at )?)/);
        ne = n && n[1] || "", ih = -1 < u.stack.indexOf(`
    at`) ? " (<anonymous>)" : -1 < u.stack.indexOf("@") ? "@unknown:0:0" : "";
      }
    return `
` + ne + l + ih;
  }
  var km = !1;
  function he(l, n) {
    if (!l || km) return "";
    km = !0;
    var u = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      var i = {
        DetermineComponentFrameRoot: function() {
          try {
            if (n) {
              var G = function() {
                throw Error();
              };
              if (Object.defineProperty(G.prototype, "props", {
                set: function() {
                  throw Error();
                }
              }), typeof Reflect == "object" && Reflect.construct) {
                try {
                  Reflect.construct(G, []);
                } catch (Z) {
                  var D = Z;
                }
                Reflect.construct(l, [], G);
              } else {
                try {
                  G.call();
                } catch (Z) {
                  D = Z;
                }
                G = !1;
                try {
                  var U = Object.getOwnPropertyDescriptor(
                    l.prototype,
                    "props"
                  );
                  Object.defineProperty(l.prototype, "props", {
                    configurable: !0,
                    set: function() {
                      throw Error();
                    }
                  }), G = !0, new l();
                } finally {
                  G && (U !== void 0 ? Object.defineProperty(l.prototype, "props", U) : delete l.prototype.props);
                }
              }
            } else {
              try {
                throw Error();
              } catch (Z) {
                D = Z;
              }
              (G = l()) && typeof G.catch == "function" && G.catch(function() {
              });
            }
          } catch (Z) {
            if (Z && D && typeof Z.stack == "string")
              return [Z.stack, D.stack];
          }
          return [null, null];
        }
      };
      i.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
      var s = Object.getOwnPropertyDescriptor(
        i.DetermineComponentFrameRoot,
        "name"
      );
      s && s.configurable && Object.defineProperty(
        i.DetermineComponentFrameRoot,
        "name",
        { value: "DetermineComponentFrameRoot" }
      );
      var r = i.DetermineComponentFrameRoot(), m = r[0], g = r[1];
      if (m && g) {
        var S = m.split(`
`), C = g.split(`
`);
        for (s = i = 0; i < S.length && !S[i].includes("DetermineComponentFrameRoot"); )
          i++;
        for (; s < C.length && !C[s].includes(
          "DetermineComponentFrameRoot"
        ); )
          s++;
        if (i === S.length || s === C.length)
          for (i = S.length - 1, s = C.length - 1; 1 <= i && 0 <= s && S[i] !== C[s]; )
            s--;
        for (; 1 <= i && 0 <= s; i--, s--)
          if (S[i] !== C[s]) {
            if (i !== 1 || s !== 1)
              do
                if (i--, s--, 0 > s || S[i] !== C[s]) {
                  var N = `
` + S[i].replace(" at new ", " at ");
                  return l.displayName && N.includes("<anonymous>") && (N = N.replace("<anonymous>", l.displayName)), N;
                }
              while (1 <= i && 0 <= s);
            break;
          }
      }
    } finally {
      km = !1, Error.prepareStackTrace = u;
    }
    return (u = l ? l.displayName || l.name : "") ? Su(u) : "";
  }
  function ab(l, n) {
    switch (l.tag) {
      case 26:
      case 27:
      case 5:
        return Su(l.type);
      case 16:
        return Su("Lazy");
      case 13:
        return l.child !== n && n !== null ? Su("Suspense Fallback") : Su("Suspense");
      case 19:
        return Su("SuspenseList");
      case 0:
      case 15:
        return he(l.type, !1);
      case 11:
        return he(l.type.render, !1);
      case 1:
        return he(l.type, !0);
      case 31:
        return Su("Activity");
      case 30:
        return Su("ViewTransition");
      default:
        return "";
    }
  }
  function li(l) {
    try {
      var n = "", u = null;
      do
        n += ab(l, u), u = l, l = l.return;
      while (l);
      return n;
    } catch (i) {
      return `
Error generating stack: ` + i.message + `
` + i.stack;
    }
  }
  var Sf = Object.prototype.hasOwnProperty, to = K.unstable_scheduleCallback, oh = K.unstable_cancelCallback, nb = K.unstable_shouldYield, Pm = K.unstable_requestPaint, $l = K.unstable_now, tr = K.unstable_getCurrentPriorityLevel, d1 = K.unstable_ImmediatePriority, ty = K.unstable_UserBlockingPriority, er = K.unstable_NormalPriority, h1 = K.unstable_LowPriority, fh = K.unstable_IdlePriority, m1 = K.log, y1 = K.unstable_setDisableYieldValue, eo = null, Fl = null;
  function cc(l) {
    if (typeof m1 == "function" && y1(l), Fl && typeof Fl.setStrictMode == "function")
      try {
        Fl.setStrictMode(eo, l);
      } catch {
      }
  }
  var Ml = Math.clz32 ? Math.clz32 : lr, lo = Math.log, bu = Math.LN2;
  function lr(l) {
    return l >>>= 0, l === 0 ? 32 : 31 - (lo(l) / bu | 0) | 0;
  }
  var ic = 256, qe = 262144, ar = 4194304;
  function ja(l) {
    var n = l & 42;
    if (n !== 0) return n;
    switch (l & -l) {
      case 1:
        return 1;
      case 2:
        return 2;
      case 4:
        return 4;
      case 8:
        return 8;
      case 16:
        return 16;
      case 32:
        return 32;
      case 64:
        return 64;
      case 128:
        return 128;
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
        return l & -l;
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return l & 3932160;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        return l & 62914560;
      case 67108864:
        return 67108864;
      case 134217728:
        return 134217728;
      case 268435456:
        return 268435456;
      case 536870912:
        return 536870912;
      case 1073741824:
        return 0;
      default:
        return l;
    }
  }
  function oc(l, n, u) {
    var i = l.pendingLanes;
    if (i === 0) return 0;
    var s = 0, r = l.suspendedLanes, m = l.pingedLanes;
    l = l.warmLanes;
    var g = i & 134217727;
    return g !== 0 ? (i = g & ~r, i !== 0 ? s = ja(i) : (m &= g, m !== 0 ? s = ja(m) : u || (u = g & ~l, u !== 0 && (s = ja(u))))) : (g = i & ~r, g !== 0 ? s = ja(g) : m !== 0 ? s = ja(m) : u || (u = i & ~l, u !== 0 && (s = ja(u)))), s === 0 ? 0 : n !== 0 && n !== s && (n & r) === 0 && (r = s & -s, u = n & -n, r >= u || r === 32 && (u & 4194048) !== 0) ? n : s;
  }
  function Tu(l, n) {
    return (l.pendingLanes & ~(l.suspendedLanes & ~l.pingedLanes) & n) === 0;
  }
  function sh(l, n) {
    (n & 8) !== 0 && (n |= n & 32);
    var u = l.entangledLanes;
    if (u !== 0)
      for (l = l.entanglements, u &= n; 0 < u; ) {
        var i = 31 - Ml(u), s = 1 << i;
        n |= l[i], u &= ~s;
      }
    return n;
  }
  function v1(l, n) {
    switch (l) {
      case 1:
      case 2:
      case 4:
      case 8:
      case 64:
        return n + 250;
      case 16:
      case 32:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return n + 5e3;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        return -1;
      case 67108864:
      case 134217728:
      case 268435456:
      case 536870912:
      case 1073741824:
        return -1;
      default:
        return -1;
    }
  }
  function ey() {
    var l = ar;
    return ar <<= 1, (ar & 62914560) === 0 && (ar = 4194304), l;
  }
  function bf(l) {
    for (var n = [], u = 0; 31 > u; u++) n.push(l);
    return n;
  }
  function ai(l, n) {
    l.pendingLanes |= n, n !== 268435456 && (l.suspendedLanes = 0, l.pingedLanes = 0, l.warmLanes = 0);
  }
  function fc(l, n, u, i, s, r) {
    var m = l.pendingLanes;
    l.pendingLanes = u, l.suspendedLanes = 0, l.pingedLanes = 0, l.warmLanes = 0, l.expiredLanes &= u, l.entangledLanes &= u, l.errorRecoveryDisabledLanes &= u, l.shellSuspendCounter = 0;
    var g = l.entanglements, S = l.expirationTimes, C = l.hiddenUpdates;
    for (u = m & ~u; 0 < u; ) {
      var N = 31 - Ml(u), G = 1 << N;
      g[N] = 0, S[N] = -1;
      var D = C[N];
      if (D !== null)
        for (C[N] = null, N = 0; N < D.length; N++) {
          var U = D[N];
          U !== null && (U.lane &= -536870913);
        }
      u &= ~G;
    }
    i !== 0 && Sa(l, i, 0), r !== 0 && s === 0 && l.tag !== 0 && (l.suspendedLanes |= r & ~(m & ~n));
  }
  function Sa(l, n, u) {
    l.pendingLanes |= n, l.suspendedLanes &= ~n;
    var i = 31 - Ml(n);
    l.entangledLanes |= n, l.entanglements[i] = l.entanglements[i] | 1073741824 | u & 261930;
  }
  function ly(l, n) {
    var u = l.entangledLanes |= n;
    for (l = l.entanglements; u; ) {
      var i = 31 - Ml(u), s = 1 << i;
      s & n | l[i] & n && (l[i] |= n), u &= ~s;
    }
  }
  function g1(l, n) {
    var u = n & -n;
    return u = (u & 42) !== 0 ? 1 : nr(u), (u & (l.suspendedLanes | n)) !== 0 ? 0 : u;
  }
  function nr(l) {
    switch (l) {
      case 2:
        l = 1;
        break;
      case 8:
        l = 4;
        break;
      case 32:
        l = 16;
        break;
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        l = 128;
        break;
      case 268435456:
        l = 134217728;
        break;
      default:
        l = 0;
    }
    return l;
  }
  function rh(l) {
    return l &= -l, 2 < l ? 8 < l ? (l & 134217727) !== 0 ? 32 : 268435456 : 8 : 2;
  }
  function wa() {
    var l = Jt.p;
    return l !== 0 ? l : (l = window.event, l === void 0 ? 32 : Ip(l.type));
  }
  function ay(l, n) {
    var u = Jt.p;
    try {
      return Jt.p = l, n();
    } finally {
      Jt.p = u;
    }
  }
  var Hn = Math.random().toString(36).slice(2), ul = "__reactFiber$" + Hn, _l = "__reactProps$" + Hn, ao = "__reactContainer$" + Hn, ny = "__reactEvents$" + Hn, Tf = "__reactListeners$" + Hn, p1 = "__reactHandles$" + Hn, uy = "__reactResources$" + Hn, Ef = "__reactMarker$" + Hn, ur = "__reactLoad$" + Hn;
  function cr(l) {
    delete l[ul], delete l[_l], delete l[Tf], delete l[p1];
  }
  function We(l) {
    var n;
    if (n = l[ul]) return n;
    for (var u = l.parentNode; u; ) {
      if (n = u[ao] || u[ul]) {
        if (u = n.alternate, n.child !== null || u !== null && u.child !== null)
          for (l = Xp(l); l !== null; ) {
            if (u = l[ul]) return u;
            l = Xp(l);
          }
        return n;
      }
      l = u, u = l.parentNode;
    }
    return null;
  }
  function Bn(l) {
    if (l = l[ul] || l[ao]) {
      var n = l.tag;
      if (n === 5 || n === 6 || n === 13 || n === 31 || n === 26 || n === 27 || n === 3)
        return l;
    }
    return null;
  }
  function xn(l) {
    var n = l.tag;
    if (n === 5 || n === 26 || n === 27 || n === 6) return l.stateNode;
    throw Error(q(33));
  }
  function no(l) {
    var n = l[uy];
    return n || (n = l[uy] = { hoistableStyles: /* @__PURE__ */ new Map(), hoistableScripts: /* @__PURE__ */ new Map() }), n;
  }
  function De(l) {
    l[Ef] = !0;
  }
  function ir(l) {
    l[ur] = void 0;
  }
  var dh = /* @__PURE__ */ new Set(), zf = {};
  function cn(l, n) {
    ni(l, n), ni(l + "Capture", n);
  }
  function ni(l, n) {
    for (zf[l] = n, l = 0; l < n.length; l++)
      dh.add(n[l]);
  }
  var ub = RegExp(
    "^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"
  ), S1 = {}, cy = {};
  function iy(l) {
    return Sf.call(cy, l) ? !0 : Sf.call(S1, l) ? !1 : ub.test(l) ? cy[l] = !0 : (S1[l] = !0, !1);
  }
  var Vt = !1;
  function oy() {
    var l = Vt;
    return Vt = !1, l;
  }
  function or(l, n, u) {
    if (iy(n))
      if (u === null) l.removeAttribute(n);
      else {
        switch (typeof u) {
          case "undefined":
          case "function":
          case "symbol":
            l.removeAttribute(n);
            return;
          case "boolean":
            var i = n.toLowerCase().slice(0, 5);
            if (i !== "data-" && i !== "aria-") {
              l.removeAttribute(n);
              return;
            }
        }
        l.setAttribute(n, u);
      }
  }
  function fr(l, n, u) {
    if (u === null) l.removeAttribute(n);
    else {
      switch (typeof u) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          l.removeAttribute(n);
          return;
      }
      l.setAttribute(n, u);
    }
  }
  function sc(l, n, u, i) {
    if (i === null) l.removeAttribute(u);
    else {
      switch (typeof i) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          l.removeAttribute(u);
          return;
      }
      l.setAttributeNS(n, u, i);
    }
  }
  function ba(l) {
    switch (typeof l) {
      case "bigint":
      case "boolean":
      case "number":
      case "string":
      case "undefined":
        return l;
      case "object":
        return l;
      default:
        return "";
    }
  }
  function hh(l) {
    var n = l.type;
    return (l = l.nodeName) && l.toLowerCase() === "input" && (n === "checkbox" || n === "radio");
  }
  function mh(l, n, u) {
    var i = Object.getOwnPropertyDescriptor(
      l.constructor.prototype,
      n
    );
    if (!l.hasOwnProperty(n) && typeof i < "u" && typeof i.get == "function" && typeof i.set == "function") {
      var s = i.get, r = i.set;
      return Object.defineProperty(l, n, {
        configurable: !0,
        get: function() {
          return s.call(this);
        },
        set: function(m) {
          u = "" + m, r.call(this, m);
        }
      }), Object.defineProperty(l, n, {
        enumerable: i.enumerable
      }), {
        getValue: function() {
          return u;
        },
        setValue: function(m) {
          u = "" + m;
        },
        stopTracking: function() {
          l._valueTracker = null, delete l[n];
        }
      };
    }
  }
  function uo(l) {
    if (!l._valueTracker) {
      var n = hh(l) ? "checked" : "value";
      l._valueTracker = mh(
        l,
        n,
        "" + l[n]
      );
    }
  }
  function b1(l) {
    if (!l) return !1;
    var n = l._valueTracker;
    if (!n) return !0;
    var u = n.getValue(), i = "";
    return l && (i = hh(l) ? l.checked ? "true" : "false" : l.value), l = i, l !== u ? (n.setValue(l), !0) : !1;
  }
  var T1 = /[\n"\\]/g;
  function Xa(l) {
    return l.replace(
      T1,
      function(n) {
        return "\\" + n.charCodeAt(0).toString(16) + " ";
      }
    );
  }
  function co(l, n, u, i, s, r, m, g) {
    l.name = "", m != null && typeof m != "function" && typeof m != "symbol" && typeof m != "boolean" ? l.type = m : l.removeAttribute("type"), n != null ? m === "number" ? (n === 0 && l.value === "" || l.value != n) && (l.value = "" + ba(n)) : l.value !== "" + ba(n) && (l.value = "" + ba(n)) : m !== "submit" && m !== "reset" || l.removeAttribute("value"), n != null ? m === "number" && l.value == n ? sy(l, ba(l.value)) : sy(l, ba(n)) : u != null ? sy(l, ba(u)) : i != null && l.removeAttribute("value"), s == null && r != null && (l.defaultChecked = !!r), s != null && (l.checked = s && typeof s != "function" && typeof s != "symbol"), g != null && typeof g != "function" && typeof g != "symbol" && typeof g != "boolean" ? l.name = "" + ba(g) : l.removeAttribute("name");
  }
  function fy(l, n, u, i, s, r, m, g) {
    if (r != null && typeof r != "function" && typeof r != "symbol" && typeof r != "boolean" && (l.type = r), n != null || u != null) {
      if (!(r !== "submit" && r !== "reset" || n != null)) {
        uo(l);
        return;
      }
      u = u != null ? "" + ba(u) : "", n = n != null ? "" + ba(n) : u, g || n === l.value || (l.value = n), l.defaultValue = n;
    }
    i = i ?? s, i = typeof i != "function" && typeof i != "symbol" && !!i, l.checked = g ? l.checked : !!i, l.defaultChecked = !!i, m != null && typeof m != "function" && typeof m != "symbol" && typeof m != "boolean" && (l.name = m), uo(l);
  }
  function sy(l, n) {
    l.defaultValue !== "" + n && (l.defaultValue = "" + n);
  }
  function Af(l, n, u, i) {
    if (l = l.options, n) {
      n = {};
      for (var s = 0; s < u.length; s++)
        n["$" + u[s]] = !0;
      for (u = 0; u < l.length; u++)
        s = n.hasOwnProperty("$" + l[u].value), l[u].selected !== s && (l[u].selected = s), s && i && (l[u].defaultSelected = !0);
    } else {
      for (u = "" + ba(u), n = null, s = 0; s < l.length; s++) {
        if (l[s].value === u) {
          l[s].selected = !0, i && (l[s].defaultSelected = !0);
          return;
        }
        n !== null || l[s].disabled || (n = l[s]);
      }
      n !== null && (n.selected = !0);
    }
  }
  function E1(l, n, u) {
    if (n != null && (n = "" + ba(n), n !== l.value && (l.value = n), u == null)) {
      l.defaultValue !== n && (l.defaultValue = n);
      return;
    }
    l.defaultValue = u != null ? "" + ba(u) : "";
  }
  function z1(l, n, u, i) {
    if (n == null) {
      if (i != null) {
        if (u != null) throw Error(q(92));
        if (kc(i)) {
          if (1 < i.length) throw Error(q(93));
          i = i[0];
        }
        u = i;
      }
      u == null && (u = ""), n = u;
    }
    u = ba(n), l.defaultValue = u, i = l.textContent, i === u && i !== "" && i !== null && (l.value = i), uo(l);
  }
  function Eu(l, n) {
    if (n) {
      var u = l.firstChild;
      if (u && u === l.lastChild && u.nodeType === 3) {
        u.nodeValue = n;
        return;
      }
    }
    l.textContent = n;
  }
  var zu = new Set(
    "animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(
      " "
    )
  );
  function yh(l, n, u) {
    var i = n.indexOf("--") === 0;
    u == null || typeof u == "boolean" || u === "" ? i ? l.setProperty(n, "") : n === "float" ? l.cssFloat = "" : l[n] = "" : i ? l.setProperty(n, u) : typeof u != "number" || u === 0 || zu.has(n) ? n === "float" ? l.cssFloat = u : l[n] = ("" + u).trim() : l[n] = u + "px";
  }
  function ry(l, n, u) {
    if (n != null && typeof n != "object")
      throw Error(q(62));
    if (l = l.style, u != null) {
      for (var i in u)
        !u.hasOwnProperty(i) || n != null && n.hasOwnProperty(i) || (i.indexOf("--") === 0 ? l.setProperty(i, "") : i === "float" ? l.cssFloat = "" : l[i] = "", Vt = !0);
      for (var s in n)
        i = n[s], n.hasOwnProperty(s) && u[s] !== i && (yh(l, s, i), Vt = !0);
    } else
      for (var r in n)
        n.hasOwnProperty(r) && yh(l, r, n[r]);
  }
  function vh(l) {
    if (l.indexOf("-") === -1) return !1;
    switch (l) {
      case "annotation-xml":
      case "color-profile":
      case "font-face":
      case "font-face-src":
      case "font-face-uri":
      case "font-face-format":
      case "font-face-name":
      case "missing-glyph":
        return !1;
      default:
        return !0;
    }
  }
  var sr = /* @__PURE__ */ new Map([
    ["acceptCharset", "accept-charset"],
    ["htmlFor", "for"],
    ["httpEquiv", "http-equiv"],
    ["crossOrigin", "crossorigin"],
    ["accentHeight", "accent-height"],
    ["alignmentBaseline", "alignment-baseline"],
    ["arabicForm", "arabic-form"],
    ["baselineShift", "baseline-shift"],
    ["capHeight", "cap-height"],
    ["clipPath", "clip-path"],
    ["clipRule", "clip-rule"],
    ["colorInterpolation", "color-interpolation"],
    ["colorInterpolationFilters", "color-interpolation-filters"],
    ["colorProfile", "color-profile"],
    ["colorRendering", "color-rendering"],
    ["dominantBaseline", "dominant-baseline"],
    ["enableBackground", "enable-background"],
    ["fillOpacity", "fill-opacity"],
    ["fillRule", "fill-rule"],
    ["floodColor", "flood-color"],
    ["floodOpacity", "flood-opacity"],
    ["fontFamily", "font-family"],
    ["fontSize", "font-size"],
    ["fontSizeAdjust", "font-size-adjust"],
    ["fontStretch", "font-stretch"],
    ["fontStyle", "font-style"],
    ["fontVariant", "font-variant"],
    ["fontWeight", "font-weight"],
    ["glyphName", "glyph-name"],
    ["glyphOrientationHorizontal", "glyph-orientation-horizontal"],
    ["glyphOrientationVertical", "glyph-orientation-vertical"],
    ["horizAdvX", "horiz-adv-x"],
    ["horizOriginX", "horiz-origin-x"],
    ["imageRendering", "image-rendering"],
    ["letterSpacing", "letter-spacing"],
    ["lightingColor", "lighting-color"],
    ["markerEnd", "marker-end"],
    ["markerMid", "marker-mid"],
    ["markerStart", "marker-start"],
    ["maskType", "mask-type"],
    ["overlinePosition", "overline-position"],
    ["overlineThickness", "overline-thickness"],
    ["paintOrder", "paint-order"],
    ["panose-1", "panose-1"],
    ["pointerEvents", "pointer-events"],
    ["renderingIntent", "rendering-intent"],
    ["shapeRendering", "shape-rendering"],
    ["stopColor", "stop-color"],
    ["stopOpacity", "stop-opacity"],
    ["strikethroughPosition", "strikethrough-position"],
    ["strikethroughThickness", "strikethrough-thickness"],
    ["strokeDasharray", "stroke-dasharray"],
    ["strokeDashoffset", "stroke-dashoffset"],
    ["strokeLinecap", "stroke-linecap"],
    ["strokeLinejoin", "stroke-linejoin"],
    ["strokeMiterlimit", "stroke-miterlimit"],
    ["strokeOpacity", "stroke-opacity"],
    ["strokeWidth", "stroke-width"],
    ["textAnchor", "text-anchor"],
    ["textDecoration", "text-decoration"],
    ["textRendering", "text-rendering"],
    ["transformOrigin", "transform-origin"],
    ["underlinePosition", "underline-position"],
    ["underlineThickness", "underline-thickness"],
    ["unicodeBidi", "unicode-bidi"],
    ["unicodeRange", "unicode-range"],
    ["unitsPerEm", "units-per-em"],
    ["vAlphabetic", "v-alphabetic"],
    ["vHanging", "v-hanging"],
    ["vIdeographic", "v-ideographic"],
    ["vMathematical", "v-mathematical"],
    ["vectorEffect", "vector-effect"],
    ["vertAdvY", "vert-adv-y"],
    ["vertOriginX", "vert-origin-x"],
    ["vertOriginY", "vert-origin-y"],
    ["wordSpacing", "word-spacing"],
    ["writingMode", "writing-mode"],
    ["xmlnsXlink", "xmlns:xlink"],
    ["xHeight", "x-height"]
  ]), A1 = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
  function io(l) {
    return A1.test("" + l) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : l;
  }
  function Qa() {
  }
  var gh = null;
  function pl(l) {
    return l = l.target || l.srcElement || window, l.correspondingUseElement && (l = l.correspondingUseElement), l.nodeType === 3 ? l.parentNode : l;
  }
  var Of = null, ui = null;
  function dy(l) {
    var n = Bn(l);
    if (n && (l = n.stateNode)) {
      var u = l[_l] || null;
      t: switch (l = n.stateNode, n.type) {
        case "input":
          if (co(
            l,
            u.value,
            u.defaultValue,
            u.defaultValue,
            u.checked,
            u.defaultChecked,
            u.type,
            u.name
          ), n = u.name, u.type === "radio" && n != null) {
            for (u = l; u.parentNode; ) u = u.parentNode;
            for (u = u.querySelectorAll(
              'input[name="' + Xa(
                "" + n
              ) + '"][type="radio"]'
            ), n = 0; n < u.length; n++) {
              var i = u[n];
              if (i !== l && i.form === l.form) {
                var s = i[_l] || null;
                if (!s) throw Error(q(90));
                co(
                  i,
                  s.value,
                  s.defaultValue,
                  s.defaultValue,
                  s.checked,
                  s.defaultChecked,
                  s.type,
                  s.name
                );
              }
            }
            for (n = 0; n < u.length; n++)
              i = u[n], i.form === l.form && b1(i);
          }
          break t;
        case "textarea":
          E1(l, u.value, u.defaultValue);
          break t;
        case "select":
          n = u.value, n != null && Af(l, !!u.multiple, n, !1);
      }
    }
  }
  var ph = !1;
  function O1(l, n, u) {
    if (ph) return l(n, u);
    ph = !0;
    try {
      var i = l(n);
      return i;
    } finally {
      if (ph = !1, (Of !== null || ui !== null) && (J0(), Of && (n = Of, l = ui, ui = Of = null, dy(n), l)))
        for (n = 0; n < l.length; n++) dy(l[n]);
    }
  }
  function rr(l, n) {
    var u = l.stateNode;
    if (u === null) return null;
    var i = u[_l] || null;
    if (i === null) return null;
    u = i[n];
    t: switch (n) {
      case "onClick":
      case "onClickCapture":
      case "onDoubleClick":
      case "onDoubleClickCapture":
      case "onMouseDown":
      case "onMouseDownCapture":
      case "onMouseMove":
      case "onMouseMoveCapture":
      case "onMouseUp":
      case "onMouseUpCapture":
      case "onMouseEnter":
        (i = !i.disabled) || (l = l.type, i = !(l === "button" || l === "input" || l === "select" || l === "textarea")), l = !i;
        break t;
      default:
        l = !1;
    }
    if (l) return null;
    if (u && typeof u != "function")
      throw Error(
        q(231, n, typeof u)
      );
    return u;
  }
  var Au = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), hy = !1;
  if (Au)
    try {
      var Df = {};
      Object.defineProperty(Df, "passive", {
        get: function() {
          hy = !0;
        }
      }), window.addEventListener("test", Df, Df), window.removeEventListener("test", Df, Df);
    } catch {
      hy = !1;
    }
  var ci = null, Cf = null, dr = null;
  function my() {
    if (dr) return dr;
    var l, n = Cf, u = n.length, i, s = "value" in ci ? ci.value : ci.textContent, r = s.length;
    for (l = 0; l < u && n[l] === s[l]; l++) ;
    var m = u - l;
    for (i = 1; i <= m && n[u - i] === s[r - i]; i++) ;
    return dr = s.slice(l, 1 < i ? 1 - i : void 0);
  }
  function hr(l) {
    var n = l.keyCode;
    return "charCode" in l ? (l = l.charCode, l === 0 && n === 13 && (l = 13)) : l = n, l === 10 && (l = 13), 32 <= l || l === 13 ? l : 0;
  }
  function Sh() {
    return !0;
  }
  function D1() {
    return !1;
  }
  function Wl(l) {
    function n(u, i, s, r, m) {
      this._reactName = u, this._targetInst = s, this.type = i, this.nativeEvent = r, this.target = m, this.currentTarget = null;
      for (var g in l)
        l.hasOwnProperty(g) && (u = l[g], this[g] = u ? u(r) : r[g]);
      return this.isDefaultPrevented = (r.defaultPrevented != null ? r.defaultPrevented : r.returnValue === !1) ? Sh : D1, this.isPropagationStopped = D1, this;
    }
    return mt(n.prototype, {
      preventDefault: function() {
        this.defaultPrevented = !0;
        var u = this.nativeEvent;
        u && (u.preventDefault ? u.preventDefault() : typeof u.returnValue != "unknown" && (u.returnValue = !1), this.isDefaultPrevented = Sh);
      },
      stopPropagation: function() {
        var u = this.nativeEvent;
        u && (u.stopPropagation ? u.stopPropagation() : typeof u.cancelBubble != "unknown" && (u.cancelBubble = !0), this.isPropagationStopped = Sh);
      },
      persist: function() {
      },
      isPersistent: Sh
    }), n;
  }
  var ii = {
    eventPhase: 0,
    bubbles: 0,
    cancelable: 0,
    timeStamp: function(l) {
      return l.timeStamp || Date.now();
    },
    defaultPrevented: 0,
    isTrusted: 0
  }, bh = Wl(ii), rc = mt({}, ii, { view: 0, detail: 0 }), yy = Wl(rc), Th, Eh, Rf, mr = mt({}, rc, {
    screenX: 0,
    screenY: 0,
    clientX: 0,
    clientY: 0,
    pageX: 0,
    pageY: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    getModifierState: Mf,
    button: 0,
    buttons: 0,
    relatedTarget: function(l) {
      return l.relatedTarget === void 0 ? l.fromElement === l.srcElement ? l.toElement : l.fromElement : l.relatedTarget;
    },
    movementX: function(l) {
      return "movementX" in l ? l.movementX : (l !== Rf && (Rf && l.type === "mousemove" ? (Th = l.screenX - Rf.screenX, Eh = l.screenY - Rf.screenY) : Eh = Th = 0, Rf = l), Th);
    },
    movementY: function(l) {
      return "movementY" in l ? l.movementY : Eh;
    }
  }), zh = Wl(mr), C1 = mt({}, mr, { dataTransfer: 0 }), oo = Wl(C1), fo = mt({}, rc, { relatedTarget: 0 }), Za = Wl(fo), dc = mt({}, ii, {
    animationName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), R1 = Wl(dc), hc = mt({}, ii, {
    clipboardData: function(l) {
      return "clipboardData" in l ? l.clipboardData : window.clipboardData;
    }
  }), cb = Wl(hc), vy = mt({}, ii, { data: 0 }), yr = Wl(vy), Yn = {
    Esc: "Escape",
    Spacebar: " ",
    Left: "ArrowLeft",
    Up: "ArrowUp",
    Right: "ArrowRight",
    Down: "ArrowDown",
    Del: "Delete",
    Win: "OS",
    Menu: "ContextMenu",
    Apps: "ContextMenu",
    Scroll: "ScrollLock",
    MozPrintableKey: "Unidentified"
  }, M1 = {
    8: "Backspace",
    9: "Tab",
    12: "Clear",
    13: "Enter",
    16: "Shift",
    17: "Control",
    18: "Alt",
    19: "Pause",
    20: "CapsLock",
    27: "Escape",
    32: " ",
    33: "PageUp",
    34: "PageDown",
    35: "End",
    36: "Home",
    37: "ArrowLeft",
    38: "ArrowUp",
    39: "ArrowRight",
    40: "ArrowDown",
    45: "Insert",
    46: "Delete",
    112: "F1",
    113: "F2",
    114: "F3",
    115: "F4",
    116: "F5",
    117: "F6",
    118: "F7",
    119: "F8",
    120: "F9",
    121: "F10",
    122: "F11",
    123: "F12",
    144: "NumLock",
    145: "ScrollLock",
    224: "Meta"
  }, Ul = {
    Alt: "altKey",
    Control: "ctrlKey",
    Meta: "metaKey",
    Shift: "shiftKey"
  };
  function Ou(l) {
    var n = this.nativeEvent;
    return n.getModifierState ? n.getModifierState(l) : (l = Ul[l]) ? !!n[l] : !1;
  }
  function Mf() {
    return Ou;
  }
  var Ah = mt({}, rc, {
    key: function(l) {
      if (l.key) {
        var n = Yn[l.key] || l.key;
        if (n !== "Unidentified") return n;
      }
      return l.type === "keypress" ? (l = hr(l), l === 13 ? "Enter" : String.fromCharCode(l)) : l.type === "keydown" || l.type === "keyup" ? M1[l.keyCode] || "Unidentified" : "";
    },
    code: 0,
    location: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    repeat: 0,
    locale: 0,
    getModifierState: Mf,
    charCode: function(l) {
      return l.type === "keypress" ? hr(l) : 0;
    },
    keyCode: function(l) {
      return l.type === "keydown" || l.type === "keyup" ? l.keyCode : 0;
    },
    which: function(l) {
      return l.type === "keypress" ? hr(l) : l.type === "keydown" || l.type === "keyup" ? l.keyCode : 0;
    }
  }), gy = Wl(Ah), Du = mt({}, mr, {
    pointerId: 0,
    width: 0,
    height: 0,
    pressure: 0,
    tangentialPressure: 0,
    tiltX: 0,
    tiltY: 0,
    twist: 0,
    pointerType: 0,
    isPrimary: 0
  }), py = Wl(Du), _1 = mt({}, ii, { submitter: 0 }), Sy = Wl(_1), ib = mt({}, rc, {
    touches: 0,
    targetTouches: 0,
    changedTouches: 0,
    altKey: 0,
    metaKey: 0,
    ctrlKey: 0,
    shiftKey: 0,
    getModifierState: Mf
  }), U1 = Wl(ib), N1 = mt({}, ii, {
    propertyName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), oi = Wl(N1), Oh = mt({}, mr, {
    deltaX: function(l) {
      return "deltaX" in l ? l.deltaX : "wheelDeltaX" in l ? -l.wheelDeltaX : 0;
    },
    deltaY: function(l) {
      return "deltaY" in l ? l.deltaY : "wheelDeltaY" in l ? -l.wheelDeltaY : "wheelDelta" in l ? -l.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), Dh = Wl(Oh), by = mt({}, ii, {
    newState: 0,
    oldState: 0,
    source: 0
  }), Nl = Wl(by), H1 = [9, 13, 27, 32], _f = Au && "CompositionEvent" in window, Cu = null;
  Au && "documentMode" in document && (Cu = document.documentMode);
  var B1 = Au && "TextEvent" in window && !Cu, Ty = Au && (!_f || Cu && 8 < Cu && 11 >= Cu), Ey = " ", x1 = !1;
  function Ch(l, n) {
    switch (l) {
      case "keyup":
        return H1.indexOf(n.keyCode) !== -1;
      case "keydown":
        return n.keyCode !== 229;
      case "keypress":
      case "mousedown":
      case "focusout":
        return !0;
      default:
        return !1;
    }
  }
  function Ru(l) {
    return l = l.detail, typeof l == "object" && "data" in l ? l.data : null;
  }
  var so = !1;
  function zy(l, n) {
    switch (l) {
      case "compositionend":
        return Ru(n);
      case "keypress":
        return n.which !== 32 ? null : (x1 = !0, Ey);
      case "textInput":
        return l = n.data, l === Ey && x1 ? null : l;
      default:
        return null;
    }
  }
  function Rh(l, n) {
    if (so)
      return l === "compositionend" || !_f && Ch(l, n) ? (l = my(), dr = Cf = ci = null, so = !1, l) : null;
    switch (l) {
      case "paste":
        return null;
      case "keypress":
        if (!(n.ctrlKey || n.altKey || n.metaKey) || n.ctrlKey && n.altKey) {
          if (n.char && 1 < n.char.length)
            return n.char;
          if (n.which) return String.fromCharCode(n.which);
        }
        return null;
      case "compositionend":
        return Ty && n.locale !== "ko" ? null : n.data;
      default:
        return null;
    }
  }
  var ro = {
    color: !0,
    date: !0,
    datetime: !0,
    "datetime-local": !0,
    email: !0,
    month: !0,
    number: !0,
    password: !0,
    range: !0,
    search: !0,
    tel: !0,
    text: !0,
    time: !0,
    url: !0,
    week: !0
  };
  function Mh(l) {
    var n = l && l.nodeName && l.nodeName.toLowerCase();
    return n === "input" ? !!ro[l.type] : n === "textarea";
  }
  function Ay(l, n, u, i) {
    Of ? ui ? ui.push(i) : ui = [i] : Of = i, n = Yi(n, "onChange"), 0 < n.length && (u = new bh(
      "onChange",
      "change",
      null,
      u,
      i
    ), l.push({ event: u, listeners: n }));
  }
  var ho = null, Sl = null;
  function mc(l) {
    Cp(l, 0);
  }
  function vr(l) {
    var n = xn(l);
    if (b1(n)) return l;
  }
  function gr(l, n) {
    if (l === "change") return n;
  }
  var _h = !1;
  if (Au) {
    var Uh;
    if (Au) {
      var Nh = "oninput" in document;
      if (!Nh) {
        var yc = document.createElement("div");
        yc.setAttribute("oninput", "return;"), Nh = typeof yc.oninput == "function";
      }
      Uh = Nh;
    } else Uh = !1;
    _h = Uh && (!document.documentMode || 9 < document.documentMode);
  }
  function fi() {
    ho && (ho.detachEvent("onpropertychange", Oy), Sl = ho = null);
  }
  function Oy(l) {
    if (l.propertyName === "value" && vr(Sl)) {
      var n = [];
      Ay(
        n,
        Sl,
        l,
        pl(l)
      ), O1(mc, n);
    }
  }
  function Hh(l, n, u) {
    l === "focusin" ? (fi(), ho = n, Sl = u, ho.attachEvent("onpropertychange", Oy)) : l === "focusout" && fi();
  }
  function si(l) {
    if (l === "selectionchange" || l === "keyup" || l === "keydown")
      return vr(Sl);
  }
  function Y1(l, n) {
    if (l === "click") return vr(n);
  }
  function Bh(l, n) {
    if (l === "input" || l === "change")
      return vr(n);
  }
  function Uf(l, n) {
    return l === n && (l !== 0 || 1 / l === 1 / n) || l !== l && n !== n;
  }
  var Ie = typeof Object.is == "function" ? Object.is : Uf;
  function mo(l, n) {
    if (Ie(l, n)) return !0;
    if (typeof l != "object" || l === null || typeof n != "object" || n === null)
      return !1;
    var u = Object.keys(l), i = Object.keys(n);
    if (u.length !== i.length) return !1;
    for (i = 0; i < u.length; i++) {
      var s = u[i];
      if (!Sf.call(n, s) || !Ie(l[s], n[s]))
        return !1;
    }
    return !0;
  }
  function yo(l) {
    if (l = l || (typeof document < "u" ? document : void 0), typeof l > "u") return null;
    try {
      return l.activeElement || l.body;
    } catch {
      return l.body;
    }
  }
  function xh(l) {
    for (; l && l.firstChild; ) l = l.firstChild;
    return l;
  }
  function pr(l, n) {
    var u = xh(l);
    l = 0;
    for (var i; u; ) {
      if (u.nodeType === 3) {
        if (i = l + u.textContent.length, l <= n && i >= n)
          return { node: u, offset: n - l };
        l = i;
      }
      t: {
        for (; u; ) {
          if (u.nextSibling) {
            u = u.nextSibling;
            break t;
          }
          u = u.parentNode;
        }
        u = void 0;
      }
      u = xh(u);
    }
  }
  function vc(l, n) {
    return l && n ? l === n ? !0 : l && l.nodeType === 3 ? !1 : n && n.nodeType === 3 ? vc(l, n.parentNode) : "contains" in l ? l.contains(n) : l.compareDocumentPosition ? !!(l.compareDocumentPosition(n) & 16) : !1 : !1;
  }
  function Mu(l) {
    l = l != null && l.ownerDocument != null && l.ownerDocument.defaultView != null ? l.ownerDocument.defaultView : window;
    for (var n = yo(l.document); n instanceof l.HTMLIFrameElement; ) {
      try {
        var u = typeof n.contentWindow.location.href == "string";
      } catch {
        u = !1;
      }
      if (u) l = n.contentWindow;
      else break;
      n = yo(l.document);
    }
    return n;
  }
  function Nf(l) {
    var n = l && l.nodeName && l.nodeName.toLowerCase();
    return n && (n === "input" && (l.type === "text" || l.type === "search" || l.type === "tel" || l.type === "url" || l.type === "password") || n === "textarea" || l.contentEditable === "true");
  }
  var Dy = Au && "documentMode" in document && 11 >= document.documentMode, on = null, Hf = null, qn = null, se = !1;
  function Sr(l, n, u) {
    var i = u.window === u ? u.document : u.nodeType === 9 ? u : u.ownerDocument;
    se || on == null || on !== yo(i) || (i = on, "selectionStart" in i && Nf(i) ? i = { start: i.selectionStart, end: i.selectionEnd } : (i = (i.ownerDocument && i.ownerDocument.defaultView || window).getSelection(), i = {
      anchorNode: i.anchorNode,
      anchorOffset: i.anchorOffset,
      focusNode: i.focusNode,
      focusOffset: i.focusOffset
    }), qn && mo(qn, i) || (qn = i, i = Yi(Hf, "onSelect"), 0 < i.length && (n = new bh(
      "onSelect",
      "select",
      null,
      n,
      u
    ), l.push({ event: n, listeners: i }), n.target = on)));
  }
  function ri(l, n) {
    var u = {};
    return u[l.toLowerCase()] = n.toLowerCase(), u["Webkit" + l] = "webkit" + n, u["Moz" + l] = "moz" + n, u;
  }
  var di = {
    animationend: ri("Animation", "AnimationEnd"),
    animationiteration: ri("Animation", "AnimationIteration"),
    animationstart: ri("Animation", "AnimationStart"),
    transitionrun: ri("Transition", "TransitionRun"),
    transitionstart: ri("Transition", "TransitionStart"),
    transitioncancel: ri("Transition", "TransitionCancel"),
    transitionend: ri("Transition", "TransitionEnd")
  }, gc = {}, Bf = {};
  Au && (Bf = document.createElement("div").style, "AnimationEvent" in window || (delete di.animationend.animation, delete di.animationiteration.animation, delete di.animationstart.animation), "TransitionEvent" in window || delete di.transitionend.transition);
  function hi(l) {
    if (gc[l]) return gc[l];
    if (!di[l]) return l;
    var n = di[l], u;
    for (u in n)
      if (n.hasOwnProperty(u) && u in Bf)
        return gc[l] = n[u];
    return l;
  }
  var q1 = hi("animationend"), Gn = hi("animationiteration"), G1 = hi("animationstart"), pc = hi("transitionrun"), Yh = hi("transitionstart"), br = hi("transitioncancel"), Tr = hi("transitionend"), Ta = /* @__PURE__ */ new Map(), Il = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error fullscreenChange fullscreenError gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
    " "
  );
  Il.push("scrollEnd");
  function Le(l, n) {
    Ta.set(l, n), cn(n, [l]);
  }
  var _u = 0;
  function cl(l, n) {
    if (l.name != null && l.name !== "auto") return l.name;
    if (n.autoName !== null) return n.autoName;
    l = pn.identifierPrefix;
    var u = _u++;
    return l = "_" + l + "t_" + u.toString(32) + "_", n.autoName = l;
  }
  function Vn(l) {
    if (l == null || typeof l == "string")
      return l;
    var n = null, u = rs;
    if (u !== null)
      for (var i = 0; i < u.length; i++) {
        var s = l[u[i]];
        if (s != null) {
          if (s === "none") return "none";
          n = n == null ? s : n + (" " + s);
        }
      }
    return n ?? l.default;
  }
  function jn(l, n) {
    return l = Vn(l), n = Vn(n), n == null ? l === "auto" ? null : l : n === "auto" ? null : n;
  }
  var xf = typeof reportError == "function" ? reportError : function(l) {
    if (typeof window == "object" && typeof window.ErrorEvent == "function") {
      var n = new window.ErrorEvent("error", {
        bubbles: !0,
        cancelable: !0,
        message: typeof l == "object" && l !== null && typeof l.message == "string" ? String(l.message) : String(l),
        error: l
      });
      if (!window.dispatchEvent(n)) return;
    } else if (typeof process == "object" && typeof process.emit == "function") {
      process.emit("uncaughtException", l);
      return;
    }
    console.error(l);
  }, La = [], kl = 0, qh = 0;
  function Ja() {
    for (var l = kl, n = qh = kl = 0; n < l; ) {
      var u = La[n];
      La[n++] = null;
      var i = La[n];
      La[n++] = null;
      var s = La[n];
      La[n++] = null;
      var r = La[n];
      if (La[n++] = null, i !== null && s !== null) {
        var m = i.pending;
        m === null ? s.next = s : (s.next = m.next, m.next = s), i.pending = s;
      }
      r !== 0 && V1(u, s, r);
    }
  }
  function mi(l, n, u, i) {
    La[kl++] = l, La[kl++] = n, La[kl++] = u, La[kl++] = i, qh |= i, l.lanes |= i, l = l.alternate, l !== null && (l.lanes |= i);
  }
  function Cy(l, n, u, i) {
    return mi(l, n, u, i), Yf(l);
  }
  function yi(l, n) {
    return mi(l, null, null, n), Yf(l);
  }
  function V1(l, n, u) {
    l.lanes |= u;
    var i = l.alternate;
    i !== null && (i.lanes |= u);
    for (var s = !1, r = l.return; r !== null; )
      r.childLanes |= u, i = r.alternate, i !== null && (i.childLanes |= u), r.tag === 22 && (l = r.stateNode, l === null || l._visibility & 1 || (s = !0)), l = r, r = r.return;
    return l.tag === 3 ? (r = l.stateNode, s && n !== null && (s = 31 - Ml(u), l = r.hiddenUpdates, i = l[s], i === null ? l[s] = [n] : i.push(n), n.lane = u | 536870912), r) : null;
  }
  function Yf(l) {
    if (50 < qc)
      throw qc = 0, Hi = null, Error(q(185));
    for (var n = l.return; n !== null; )
      l = n, n = l.return;
    return l.tag === 3 ? l.stateNode : null;
  }
  var Sc = {};
  function j1(l, n, u, i) {
    this.tag = l, this.key = u, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = n, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = i, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function Pl(l, n, u, i) {
    return new j1(l, n, u, i);
  }
  function Gh(l) {
    return l = l.prototype, !(!l || !l.isReactComponent);
  }
  function Uu(l, n) {
    var u = l.alternate;
    return u === null ? (u = Pl(
      l.tag,
      n,
      l.key,
      l.mode
    ), u.elementType = l.elementType, u.type = l.type, u.stateNode = l.stateNode, u.alternate = l, l.alternate = u) : (u.pendingProps = n, u.type = l.type, u.flags = 0, u.subtreeFlags = 0, u.deletions = null), u.flags = l.flags & 1206910976, u.childLanes = l.childLanes, u.lanes = l.lanes, u.child = l.child, u.memoizedProps = l.memoizedProps, u.memoizedState = l.memoizedState, u.updateQueue = l.updateQueue, n = l.dependencies, u.dependencies = n === null ? null : { lanes: n.lanes, firstContext: n.firstContext }, u.sibling = l.sibling, u.index = l.index, u.ref = l.ref, u.refCleanup = l.refCleanup, u;
  }
  function bc(l, n) {
    l.flags &= 1206910978;
    var u = l.alternate;
    return u === null ? (l.childLanes = 0, l.lanes = n, l.child = null, l.subtreeFlags = 0, l.memoizedProps = null, l.memoizedState = null, l.updateQueue = null, l.dependencies = null, l.stateNode = null) : (l.childLanes = u.childLanes, l.lanes = u.lanes, l.child = u.child, l.subtreeFlags = 0, l.deletions = null, l.memoizedProps = u.memoizedProps, l.memoizedState = u.memoizedState, l.updateQueue = u.updateQueue, l.type = u.type, n = u.dependencies, l.dependencies = n === null ? null : {
      lanes: n.lanes,
      firstContext: n.firstContext
    }), l;
  }
  function Er(l, n, u, i, s, r) {
    var m = 0;
    if (i = l, typeof i == "function") Gh(i) && (m = 1);
    else if (typeof i == "string")
      m = zb(
        l,
        u,
        Nn.current
      ) ? 26 : l === "html" || l === "head" || l === "body" ? 27 : 5;
    else
      t: switch (i) {
        case tt:
          return l = Pl(31, u, n, s), l.elementType = tt, l.lanes = r, l;
        case pa:
          return vi(u.children, s, r, n);
        case Va:
          m = 8, s |= 24;
          break;
        case It:
          return l = Pl(12, u, n, s | 2), l.elementType = It, l.lanes = r, l;
        case L:
          return l = Pl(13, u, n, s), l.elementType = L, l.lanes = r, l;
        case Q:
          return l = Pl(19, u, n, s), l.elementType = Q, l.lanes = r, l;
        case Ye:
        case yt:
          return l = s | 32, l = Pl(30, u, n, l), l.elementType = yt, l.lanes = r, l.stateNode = {
            autoName: null,
            paired: null,
            clones: null,
            ref: null
          }, l;
        default:
          if (typeof i == "object" && i !== null)
            switch (i.$$typeof) {
              case Rl:
                m = 10;
                break t;
              case Ii:
                m = 9;
                break t;
              case Y:
                m = 11;
                break t;
              case P:
                m = 14;
                break t;
              case dt:
                m = 16, i = null;
                break t;
            }
          m = 29, u = Error(
            q(130, l === null ? "null" : typeof l, "")
          ), i = null;
      }
    return n = Pl(m, u, n, s), n.elementType = l, n.type = i, n.lanes = r, n;
  }
  function vi(l, n, u, i) {
    return l = Pl(7, l, i, n), l.lanes = u, l;
  }
  function Vh(l, n, u) {
    return l = Pl(6, l, null, n), l.lanes = u, l;
  }
  function Hl(l) {
    var n = Pl(18, null, null, 0);
    return n.stateNode = l, n;
  }
  function zr(l, n, u) {
    return n = Pl(
      4,
      l.children !== null ? l.children : [],
      l.key,
      n
    ), n.lanes = u, n.stateNode = {
      containerInfo: l.containerInfo,
      pendingChildren: null,
      implementation: l.implementation
    }, n;
  }
  var Ar = /* @__PURE__ */ new WeakMap();
  function ta(l, n) {
    if (typeof l == "object" && l !== null) {
      var u = Ar.get(l);
      return u !== void 0 ? u : (n = {
        value: l,
        source: n,
        stack: li(n)
      }, Ar.set(l, n), n);
    }
    return {
      value: l,
      source: n,
      stack: li(n)
    };
  }
  var Ka = [], vo = 0, go = null, qf = 0, ea = [], $a = 0, wn = null, Xn = 1, Qn = "";
  function Zn(l, n) {
    Ka[vo++] = qf, Ka[vo++] = go, go = l, qf = n;
  }
  function jh(l, n, u) {
    ea[$a++] = Xn, ea[$a++] = Qn, ea[$a++] = wn, wn = l;
    var i = Xn;
    l = Qn;
    var s = 32 - Ml(i) - 1;
    i &= ~(1 << s), u += 1;
    var r = 32 - Ml(n) + s;
    if (30 < r) {
      var m = s - s % 5;
      r = (i & (1 << m) - 1).toString(32), i >>= m, s -= m, Xn = 1 << 32 - Ml(n) + s | u << s | i, Qn = r + l;
    } else
      Xn = 1 << r | u << s | i, Qn = l;
  }
  function Ln(l) {
    l.return !== null && (Zn(l, 1), jh(l, 1, 0));
  }
  function Nu(l) {
    for (; l === go; )
      go = Ka[--vo], Ka[vo] = null, qf = Ka[--vo], Ka[vo] = null;
    for (; l === wn; )
      wn = ea[--$a], ea[$a] = null, Qn = ea[--$a], ea[$a] = null, Xn = ea[--$a], ea[$a] = null;
  }
  function Gf(l, n) {
    ea[$a++] = Xn, ea[$a++] = Qn, ea[$a++] = wn, Xn = n.id, Qn = n.overflow, wn = l;
  }
  var Ge = null, kt = null, vt = !1, Tc = null, fn = !1, wh = Error(q(519));
  function Ec(l) {
    var n = Error(
      q(
        418,
        1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? "text" : "HTML",
        ""
      )
    );
    throw sn(ta(n, l)), wh;
  }
  function Xh(l) {
    var n = l.stateNode, u = l.type, i = l.memoizedProps;
    switch (n[ul] = l, n[_l] = i, u) {
      case "dialog":
        Ut("cancel", n), Ut("close", n);
        break;
      case "iframe":
      case "object":
      case "embed":
        Ut("load", n);
        break;
      case "video":
      case "audio":
        for (u = 0; u < gd.length; u++)
          Ut(gd[u], n);
        break;
      case "source":
        Ut("error", n);
        break;
      case "img":
      case "image":
      case "link":
        Ut("error", n), Ut("load", n);
        break;
      case "details":
        Ut("toggle", n);
        break;
      case "input":
        Ut("invalid", n), fy(
          n,
          i.value,
          i.defaultValue,
          i.checked,
          i.defaultChecked,
          i.type,
          i.name,
          !0
        );
        break;
      case "select":
        Ut("invalid", n);
        break;
      case "textarea":
        Ut("invalid", n), z1(n, i.value, i.defaultValue, i.children);
    }
    u = i.children, typeof u != "string" && typeof u != "number" && typeof u != "bigint" || n.textContent === "" + u || i.suppressHydrationWarning === !0 || bd(n.textContent, u) ? (i.popover != null && (Ut("beforetoggle", n), Ut("toggle", n)), i.onScroll != null && Ut("scroll", n), i.onScrollEnd != null && Ut("scrollend", n), i.onClick != null && (n.onclick = Qa), n = !0) : n = !1, n || Ec(l, !0);
  }
  function Vf(l) {
    for (Ge = l.return; Ge; )
      switch (Ge.tag) {
        case 5:
        case 31:
        case 13:
          fn = !1;
          return;
        case 27:
        case 3:
          fn = !0;
          return;
        default:
          Ge = Ge.return;
      }
  }
  function Fa(l) {
    if (l !== Ge) return !1;
    if (!vt) return Vf(l), vt = !0, !1;
    var n = l.tag, u;
    if ((u = n !== 3 && n !== 27) && ((u = n === 5) && (u = l.type, u = !(u !== "form" && u !== "button") || wv(l.type, l.memoizedProps)), u = !u), u && kt && Ec(l), Vf(l), n === 13) {
      if (l = l.memoizedState, l = l !== null ? l.dehydrated : null, !l) throw Error(q(317));
      kt = om(l);
    } else if (n === 31) {
      if (l = l.memoizedState, l = l !== null ? l.dehydrated : null, !l) throw Error(q(317));
      kt = om(l);
    } else
      n === 27 ? (n = kt, Gc(l.type) ? (l = Vl, Vl = null, kt = l) : kt = n) : kt = Ge ? ra(l.stateNode.nextSibling) : null;
    return !0;
  }
  function zc() {
    kt = Ge = null, vt = !1;
  }
  function Qh() {
    var l = Tc;
    return l !== null && (oa === null ? oa = l : oa.push.apply(
      oa,
      l
    ), Tc = null), l;
  }
  function sn(l) {
    Tc === null ? Tc = [l] : Tc.push(l);
  }
  var la = un(null), Jn = null, Kn = null;
  function $n(l, n, u) {
    fe(la, n._currentValue), n._currentValue = u;
  }
  function st(l) {
    l._currentValue = la.current, gl(la);
  }
  function w(l, n, u) {
    for (; l !== null; ) {
      var i = l.alternate;
      if ((l.childLanes & n) !== n ? (l.childLanes |= n, i !== null && (i.childLanes |= n)) : i !== null && (i.childLanes & n) !== n && (i.childLanes |= n), l === u) break;
      l = l.return;
    }
  }
  function gi(l, n, u, i) {
    var s = l.child;
    for (s !== null && (s.return = l); s !== null; ) {
      var r = s.dependencies;
      if (r !== null) {
        var m = s.child;
        r = r.firstContext;
        t: for (; r !== null; ) {
          var g = r;
          r = s;
          for (var S = 0; S < n.length; S++)
            if (g.context === n[S]) {
              r.lanes |= u, g = r.alternate, g !== null && (g.lanes |= u), w(
                r.return,
                u,
                l
              ), i || (m = null);
              break t;
            }
          r = g.next;
        }
      } else if (s.tag === 18) {
        if (m = s.return, m === null) throw Error(q(341));
        m.lanes |= u, r = m.alternate, r !== null && (r.lanes |= u), w(m, u, l), m = null;
      } else
        s.tag === 13 && s.memoizedState !== null && s.memoizedState.dehydrated === null ? (s.lanes |= u, m = s.alternate, m !== null && (m.lanes |= u), w(
          s.return,
          u,
          l
        ), m = s.child, m = m !== null ? m.sibling : null) : m = s.child;
      if (m !== null) m.return = s;
      else
        for (m = s; m !== null; ) {
          if (m === l) {
            m = null;
            break;
          }
          if (s = m.sibling, s !== null) {
            s.return = m.return, m = s;
            break;
          }
          m = m.return;
        }
      s = m;
    }
  }
  function Hu(l, n, u, i) {
    l = null;
    for (var s = n, r = !1; s !== null; ) {
      if (!r) {
        if ((s.flags & 524288) !== 0) r = !0;
        else if ((s.flags & 262144) !== 0) break;
      }
      if (s.tag === 10) {
        var m = s.alternate;
        if (m === null) throw Error(q(387));
        if (m = m.memoizedProps, m !== null) {
          var g = s.type;
          Ie(s.pendingProps.value, m.value) || (l !== null ? l.push(g) : l = [g]);
        }
      } else if (s === $.current) {
        if (m = s.alternate, m === null) throw Error(q(387));
        m.memoizedState.memoizedState !== s.memoizedState.memoizedState && (l !== null ? l.push($e) : l = [$e]);
      }
      s = s.return;
    }
    return l !== null && gi(
      n,
      l,
      u,
      i
    ), n.flags |= 262144, l !== null;
  }
  function ve(l) {
    for (l = l.firstContext; l !== null; ) {
      if (!Ie(
        l.context._currentValue,
        l.memoizedValue
      ))
        return !0;
      l = l.next;
    }
    return !1;
  }
  function Ac(l) {
    Jn = l, Kn = null, l = l.dependencies, l !== null && (l.firstContext = null);
  }
  function ke(l) {
    return Zh(Jn, l);
  }
  function Or(l, n) {
    return Jn === null && Ac(l), Zh(l, n);
  }
  function Zh(l, n) {
    var u = n._currentValue;
    if (n = { context: n, memoizedValue: u, next: null }, Kn === null) {
      if (l === null) throw Error(q(308));
      Kn = n, l.dependencies = { lanes: 0, firstContext: n }, l.flags |= 524288;
    } else Kn = Kn.next = n;
    return u;
  }
  var ob = typeof AbortController < "u" ? AbortController : function() {
    var l = [], n = this.signal = {
      aborted: !1,
      addEventListener: function(u, i) {
        l.push(i);
      }
    };
    this.abort = function() {
      n.aborted = !0, l.forEach(function(u) {
        return u();
      });
    };
  }, Ry = K.unstable_scheduleCallback, My = K.unstable_NormalPriority, Ce = {
    $$typeof: Rl,
    Consumer: null,
    Provider: null,
    _currentValue: null,
    _currentValue2: null,
    _threadCount: 0
  };
  function bl() {
    return {
      controller: new ob(),
      data: /* @__PURE__ */ new Map(),
      refCount: 0
    };
  }
  function jt(l) {
    l.refCount--, l.refCount === 0 && Ry(My, function() {
      l.controller.abort();
    });
  }
  function Dr(l, n) {
    if ((l.pendingLanes & 4194048) !== 0) {
      var u = l.transitionTypes;
      for (u === null && (u = l.transitionTypes = []), l = 0; l < n.length; l++) {
        var i = n[l];
        u.indexOf(i) === -1 && u.push(i);
      }
    }
  }
  var Oc = null;
  function pi(l) {
    var n = l.transitionTypes;
    return l.transitionTypes = null, n;
  }
  var Fn = null, Wa = 0, Dc = 0, Wn = null;
  function _y(l, n) {
    if (Fn === null) {
      var u = Fn = [];
      Wa = 0, Dc = P0(), Wn = {
        status: "pending",
        value: void 0,
        then: function(i) {
          u.push(i);
        }
      };
    }
    return Wa++, n.then(jf, jf), n;
  }
  function jf() {
    if (--Wa === 0 && (Oc = null, Fn !== null)) {
      Wn !== null && (Wn.status = "fulfilled");
      var l = Fn;
      Fn = null, Dc = 0, Wn = null;
      for (var n = 0; n < l.length; n++) (0, l[n])();
    }
  }
  function Uy(l, n) {
    var u = [], i = {
      status: "pending",
      value: null,
      reason: null,
      then: function(s) {
        u.push(s);
      }
    };
    return l.then(
      function() {
        i.status = "fulfilled", i.value = n;
        for (var s = 0; s < u.length; s++) (0, u[s])(n);
      },
      function(s) {
        for (i.status = "rejected", i.reason = s, s = 0; s < u.length; s++)
          (0, u[s])(void 0);
      }
    ), i;
  }
  var Cr = ft.S;
  ft.S = function(l, n) {
    if (Q0 = $l(), typeof n == "object" && n !== null && typeof n.then == "function" && _y(l, n), Oc !== null)
      for (var u = Ko; u !== null; )
        Dr(u, Oc), u = u.next;
    if (u = l.types, u !== null) {
      for (var i = Ko; i !== null; )
        Dr(i, u), i = i.next;
      if (Dc !== 0) {
        i = Oc, i === null && (i = Oc = []);
        for (var s = 0; s < u.length; s++) {
          var r = u[s];
          i.indexOf(r) === -1 && i.push(r);
        }
      }
    }
    Cr !== null && Cr(l, n);
  };
  var Si = un(null);
  function Lh() {
    var l = Si.current;
    return l !== null ? l : ce.pooledCache;
  }
  function Rr(l, n) {
    n === null ? fe(Si, Si.current) : fe(Si, n.pool);
  }
  function Ny() {
    var l = Lh();
    return l === null ? null : { parent: Ce._currentValue, pool: l };
  }
  var po = Error(q(460)), Mr = Error(q(474)), wf = Error(q(542)), Xf = { then: function() {
  } };
  function Hy(l) {
    return l = l.status, l === "fulfilled" || l === "rejected";
  }
  function By(l, n, u) {
    switch (u = l[u], u === void 0 ? l.push(n) : u !== n && (n.then(Qa, Qa), n = u), n.status) {
      case "fulfilled":
        return n.value;
      case "rejected":
        throw l = n.reason, Yy(l), l === void 0 && !("reason" in n) ? Error(q(600)) : l;
      default:
        if (typeof n.status == "string") n.then(Qa, Qa);
        else {
          if (l = ce, l !== null && 100 < l.shellSuspendCounter)
            throw Error(q(482));
          l = n, l.status = "pending", l.then(
            function(i) {
              if (n.status === "pending") {
                var s = n;
                s.status = "fulfilled", s.value = i;
              }
            },
            function(i) {
              if (n.status === "pending") {
                var s = n;
                s.status = "rejected", s.reason = i;
              }
            }
          );
        }
        switch (n.status) {
          case "fulfilled":
            return n.value;
          case "rejected":
            throw l = n.reason, Yy(l), l;
        }
        throw So = n, po;
    }
  }
  function bi(l) {
    try {
      var n = l._init;
      return n(l._payload);
    } catch (u) {
      throw u !== null && typeof u == "object" && typeof u.then == "function" ? (So = u, po) : u;
    }
  }
  var So = null;
  function xy() {
    if (So === null) throw Error(q(459));
    var l = So;
    return So = null, l;
  }
  function Yy(l) {
    if (l === po || l === wf)
      throw Error(q(483));
  }
  var bo = null, To = 0;
  function _r(l) {
    var n = To;
    return To += 1, bo === null && (bo = []), By(bo, l, n);
  }
  function Cc(l, n) {
    n = n.props.ref, l.ref = n !== void 0 ? n : null;
  }
  function Rc(l, n) {
    throw n.$$typeof === nn ? Error(q(525)) : (l = Object.prototype.toString.call(n), Error(
      q(
        31,
        l === "[object Object]" ? "object with keys {" + Object.keys(n).join(", ") + "}" : l
      )
    ));
  }
  function Ur(l) {
    function n(R, O) {
      if (l) {
        var _ = R.deletions;
        _ === null ? (R.deletions = [O], R.flags |= 16) : _.push(O);
      }
    }
    function u(R, O) {
      if (!l) return null;
      for (; O !== null; )
        n(R, O), O = O.sibling;
      return null;
    }
    function i(R) {
      for (var O = /* @__PURE__ */ new Map(); R !== null; )
        R.key === null ? O.set(R.index, R) : O.set(R.key, R), R = R.sibling;
      return O;
    }
    function s(R, O) {
      return R = Uu(R, O), R.index = 0, R.sibling = null, R;
    }
    function r(R, O, _) {
      return R.index = _, l ? (_ = R.alternate, _ !== null ? (_ = _.index, _ < O ? (R.flags |= 2, O) : _) : (R.flags |= 134217730, O)) : (R.flags |= 1048576, O);
    }
    function m(R) {
      return l && R.alternate === null && (R.flags |= 134217730), R;
    }
    function g(R, O, _, V) {
      return O === null || O.tag !== 6 ? (O = Vh(_, R.mode, V), O.return = R, O) : (O = s(O, _), O.return = R, O);
    }
    function S(R, O, _, V) {
      var k = _.type;
      return k === pa ? (R = N(
        R,
        O,
        _.props.children,
        V,
        _.key
      ), Cc(R, _), R) : O !== null && (O.elementType === k || typeof k == "object" && k !== null && k.$$typeof === dt && bi(k) === O.type) ? (O = s(O, _.props), Cc(O, _), O.return = R, O) : (O = Er(
        _.type,
        _.key,
        _.props,
        null,
        R.mode,
        V
      ), Cc(O, _), O.return = R, O);
    }
    function C(R, O, _, V) {
      return O === null || O.tag !== 4 || O.stateNode.containerInfo !== _.containerInfo || O.stateNode.implementation !== _.implementation ? (O = zr(_, R.mode, V), O.return = R, O) : (O = s(O, _.children || []), O.return = R, O);
    }
    function N(R, O, _, V, k) {
      return O === null || O.tag !== 7 ? (O = vi(
        _,
        R.mode,
        V,
        k
      ), O.return = R, O) : (O = s(O, _), O.return = R, O);
    }
    function G(R, O, _) {
      if (typeof O == "string" && O !== "" || typeof O == "number" || typeof O == "bigint")
        return O = Vh(
          "" + O,
          R.mode,
          _
        ), O.return = R, O;
      if (typeof O == "object" && O !== null) {
        switch (O.$$typeof) {
          case Qe:
            return _ = Er(
              O.type,
              O.key,
              O.props,
              null,
              R.mode,
              _
            ), Cc(_, O), _.return = R, _;
          case Kl:
            return O = zr(
              O,
              R.mode,
              _
            ), O.return = R, O;
          case dt:
            return O = bi(O), G(R, O, _);
        }
        if (kc(O) || pu(O))
          return O = vi(
            O,
            R.mode,
            _,
            null
          ), O.return = R, O;
        if (typeof O.then == "function")
          return G(R, _r(O), _);
        if (O.$$typeof === Rl)
          return G(
            R,
            Or(R, O),
            _
          );
        Rc(R, O);
      }
      return null;
    }
    function D(R, O, _, V) {
      var k = O !== null ? O.key : null;
      if (typeof _ == "string" && _ !== "" || typeof _ == "number" || typeof _ == "bigint")
        return k !== null ? null : g(R, O, "" + _, V);
      if (typeof _ == "object" && _ !== null) {
        switch (_.$$typeof) {
          case Qe:
            return _.key === k ? S(R, O, _, V) : null;
          case Kl:
            return _.key === k ? C(R, O, _, V) : null;
          case dt:
            return _ = bi(_), D(R, O, _, V);
        }
        if (kc(_) || pu(_))
          return k !== null ? null : N(R, O, _, V, null);
        if (typeof _.then == "function")
          return D(
            R,
            O,
            _r(_),
            V
          );
        if (_.$$typeof === Rl)
          return D(
            R,
            O,
            Or(R, _),
            V
          );
        Rc(R, _);
      }
      return null;
    }
    function U(R, O, _, V, k) {
      if (typeof V == "string" && V !== "" || typeof V == "number" || typeof V == "bigint")
        return R = R.get(_) || null, g(O, R, "" + V, k);
      if (typeof V == "object" && V !== null) {
        switch (V.$$typeof) {
          case Qe:
            return R = R.get(
              V.key === null ? _ : V.key
            ) || null, S(O, R, V, k);
          case Kl:
            return R = R.get(
              V.key === null ? _ : V.key
            ) || null, C(O, R, V, k);
          case dt:
            return V = bi(V), U(
              R,
              O,
              _,
              V,
              k
            );
        }
        if (kc(V) || pu(V))
          return R = R.get(_) || null, N(O, R, V, k, null);
        if (typeof V.then == "function")
          return U(
            R,
            O,
            _,
            _r(V),
            k
          );
        if (V.$$typeof === Rl)
          return U(
            R,
            O,
            _,
            Or(O, V),
            k
          );
        Rc(O, V);
      }
      return null;
    }
    function Z(R, O, _, V) {
      for (var k = null, Bt = null, F = O, ct = O = 0, Fe = null; F !== null && ct < _.length; ct++) {
        F.index > ct ? (Fe = F, F = null) : Fe = F.sibling;
        var Xt = D(
          R,
          F,
          _[ct],
          V
        );
        if (Xt === null) {
          F === null && (F = Fe);
          break;
        }
        l && F && Xt.alternate === null && n(R, F), O = r(Xt, O, ct), Bt === null ? k = Xt : Bt.sibling = Xt, Bt = Xt, F = Fe;
      }
      if (ct === _.length)
        return u(R, F), vt && Zn(R, ct), k;
      if (F === null) {
        for (; ct < _.length; ct++)
          F = G(R, _[ct], V), F !== null && (O = r(
            F,
            O,
            ct
          ), Bt === null ? k = F : Bt.sibling = F, Bt = F);
        return vt && Zn(R, ct), k;
      }
      for (F = i(F); ct < _.length; ct++)
        Fe = U(
          F,
          R,
          ct,
          _[ct],
          V
        ), Fe !== null && (l && (Xt = Fe.alternate, Xt !== null && F.delete(Xt.key === null ? ct : Xt.key)), O = r(
          Fe,
          O,
          ct
        ), Bt === null ? k = Fe : Bt.sibling = Fe, Bt = Fe);
      return l && F.forEach(function(Vi) {
        return n(R, Vi);
      }), vt && Zn(R, ct), k;
    }
    function I(R, O, _, V) {
      if (_ == null) throw Error(q(151));
      for (var k = null, Bt = null, F = O, ct = O = 0, Fe = null, Xt = _.next(); F !== null && !Xt.done; ct++, Xt = _.next()) {
        F.index > ct ? (Fe = F, F = null) : Fe = F.sibling;
        var Vi = D(R, F, Xt.value, V);
        if (Vi === null) {
          F === null && (F = Fe);
          break;
        }
        l && F && Vi.alternate === null && n(R, F), O = r(Vi, O, ct), Bt === null ? k = Vi : Bt.sibling = Vi, Bt = Vi, F = Fe;
      }
      if (Xt.done)
        return u(R, F), vt && Zn(R, ct), k;
      if (F === null) {
        for (; !Xt.done; ct++, Xt = _.next())
          Xt = G(R, Xt.value, V), Xt !== null && (O = r(Xt, O, ct), Bt === null ? k = Xt : Bt.sibling = Xt, Bt = Xt);
        return vt && Zn(R, ct), k;
      }
      for (F = i(F); !Xt.done; ct++, Xt = _.next())
        Xt = U(F, R, ct, Xt.value, V), Xt !== null && (l && (Fe = Xt.alternate, Fe !== null && F.delete(
          Fe.key === null ? ct : Fe.key
        )), O = r(Xt, O, ct), Bt === null ? k = Xt : Bt.sibling = Xt, Bt = Xt);
      return l && F.forEach(function(Cb) {
        return n(R, Cb);
      }), vt && Zn(R, ct), k;
    }
    function bt(R, O, _, V) {
      if (typeof _ == "object" && _ !== null && _.type === pa && _.key === null && _.props.ref === void 0 && (_ = _.props.children), typeof _ == "object" && _ !== null) {
        switch (_.$$typeof) {
          case Qe:
            t: {
              for (var k = _.key; O !== null; ) {
                if (O.key === k) {
                  if (k = _.type, k === pa) {
                    if (O.tag === 7) {
                      u(
                        R,
                        O.sibling
                      ), V = s(
                        O,
                        _.props.children
                      ), Cc(V, _), V.return = R, R = V;
                      break t;
                    }
                  } else if (O.elementType === k || typeof k == "object" && k !== null && k.$$typeof === dt && bi(k) === O.type) {
                    u(
                      R,
                      O.sibling
                    ), V = s(O, _.props), Cc(V, _), V.return = R, R = V;
                    break t;
                  }
                  u(R, O);
                  break;
                } else n(R, O);
                O = O.sibling;
              }
              _.type === pa ? (V = vi(
                _.props.children,
                R.mode,
                V,
                _.key
              ), Cc(V, _), V.return = R, R = V) : (V = Er(
                _.type,
                _.key,
                _.props,
                null,
                R.mode,
                V
              ), Cc(V, _), V.return = R, R = V);
            }
            return m(R);
          case Kl:
            t: {
              for (k = _.key; O !== null; ) {
                if (O.key === k)
                  if (O.tag === 4 && O.stateNode.containerInfo === _.containerInfo && O.stateNode.implementation === _.implementation) {
                    u(
                      R,
                      O.sibling
                    ), V = s(O, _.children || []), V.return = R, R = V;
                    break t;
                  } else {
                    u(R, O);
                    break;
                  }
                else n(R, O);
                O = O.sibling;
              }
              V = zr(_, R.mode, V), V.return = R, R = V;
            }
            return m(R);
          case dt:
            return _ = bi(_), bt(
              R,
              O,
              _,
              V
            );
        }
        if (kc(_))
          return Z(
            R,
            O,
            _,
            V
          );
        if (pu(_)) {
          if (k = pu(_), typeof k != "function") throw Error(q(150));
          return _ = k.call(_), I(
            R,
            O,
            _,
            V
          );
        }
        if (typeof _.then == "function")
          return bt(
            R,
            O,
            _r(_),
            V
          );
        if (_.$$typeof === Rl)
          return bt(
            R,
            O,
            Or(R, _),
            V
          );
        Rc(R, _);
      }
      return typeof _ == "string" && _ !== "" || typeof _ == "number" || typeof _ == "bigint" ? (_ = "" + _, O !== null && O.tag === 6 ? (u(R, O.sibling), V = s(O, _), V.return = R, R = V) : (u(R, O), V = Vh(_, R.mode, V), V.return = R, R = V), m(R)) : u(R, O);
    }
    return function(R, O, _, V) {
      try {
        To = 0;
        var k = bt(
          R,
          O,
          _,
          V
        );
        return bo = null, k;
      } catch (F) {
        if (F === po || F === wf) throw F;
        var Bt = Pl(29, F, null, R.mode);
        return Bt.lanes = V, Bt.return = R, Bt;
      }
    };
  }
  var Ti = Ur(!0), w1 = Ur(!1), In = !1;
  function Ei(l) {
    l.updateQueue = {
      baseState: l.memoizedState,
      firstBaseUpdate: null,
      lastBaseUpdate: null,
      shared: { pending: null, lanes: 0, hiddenCallbacks: null },
      callbacks: null
    };
  }
  function Nr(l, n) {
    l = l.updateQueue, n.updateQueue === l && (n.updateQueue = {
      baseState: l.baseState,
      firstBaseUpdate: l.firstBaseUpdate,
      lastBaseUpdate: l.lastBaseUpdate,
      shared: l.shared,
      callbacks: null
    });
  }
  function Ea(l) {
    return { lane: l, tag: 0, payload: null, callback: null, next: null };
  }
  function Ve(l, n, u) {
    var i = l.updateQueue;
    if (i === null) return null;
    if (i = i.shared, (Kt & 2) !== 0) {
      var s = i.pending;
      return s === null ? n.next = n : (n.next = s.next, s.next = n), i.pending = n, n = Yf(l), V1(l, null, u), n;
    }
    return mi(l, i, n, u), Yf(l);
  }
  function zi(l, n, u) {
    if (n = n.updateQueue, n !== null && (n = n.shared, (u & 4194048) !== 0)) {
      var i = n.lanes;
      i &= l.pendingLanes, u |= i, n.lanes = u, ly(l, u);
    }
  }
  function qy(l, n) {
    var u = l.updateQueue, i = l.alternate;
    if (i !== null && (i = i.updateQueue, u === i)) {
      var s = null, r = null;
      if (u = u.firstBaseUpdate, u !== null) {
        do {
          var m = {
            lane: u.lane,
            tag: u.tag,
            payload: u.payload,
            callback: null,
            next: null
          };
          r === null ? s = r = m : r = r.next = m, u = u.next;
        } while (u !== null);
        r === null ? s = r = n : r = r.next = n;
      } else s = r = n;
      u = {
        baseState: i.baseState,
        firstBaseUpdate: s,
        lastBaseUpdate: r,
        shared: i.shared,
        callbacks: i.callbacks
      }, l.updateQueue = u;
      return;
    }
    l = u.lastBaseUpdate, l === null ? u.firstBaseUpdate = n : l.next = n, u.lastBaseUpdate = n;
  }
  var Hr = !1;
  function Ai() {
    if (Hr) {
      var l = Wn;
      if (l !== null) throw l;
    }
  }
  function Eo(l, n, u, i) {
    Hr = !1;
    var s = l.updateQueue;
    In = !1;
    var r = s.firstBaseUpdate, m = s.lastBaseUpdate, g = s.shared.pending;
    if (g !== null) {
      s.shared.pending = null;
      var S = g, C = S.next;
      S.next = null, m === null ? r = C : m.next = C, m = S;
      var N = l.alternate;
      N !== null && (N = N.updateQueue, g = N.lastBaseUpdate, g !== m && (g === null ? N.firstBaseUpdate = C : g.next = C, N.lastBaseUpdate = S));
    }
    if (r !== null) {
      var G = s.baseState;
      m = 0, N = C = S = null, g = r;
      do {
        var D = g.lane & -536870913, U = D !== g.lane;
        if (U ? (ut & D) === D : (i & D) === D) {
          D !== 0 && D === Dc && (Hr = !0), N !== null && (N = N.next = {
            lane: 0,
            tag: g.tag,
            payload: g.payload,
            callback: null,
            next: null
          });
          t: {
            var Z = l, I = g;
            D = n;
            var bt = u;
            switch (I.tag) {
              case 1:
                if (Z = I.payload, typeof Z == "function") {
                  G = Z.call(bt, G, D);
                  break t;
                }
                G = Z;
                break t;
              case 3:
                Z.flags = Z.flags & -65537 | 128;
              case 0:
                if (Z = I.payload, D = typeof Z == "function" ? Z.call(bt, G, D) : Z, D == null) break t;
                G = mt({}, G, D);
                break t;
              case 2:
                In = !0;
            }
          }
          D = g.callback, D !== null && (l.flags |= 64, U && (l.flags |= 8192), U = s.callbacks, U === null ? s.callbacks = [D] : U.push(D));
        } else
          U = {
            lane: D,
            tag: g.tag,
            payload: g.payload,
            callback: g.callback,
            next: null
          }, N === null ? (C = N = U, S = G) : N = N.next = U, m |= D;
        if (g = g.next, g === null) {
          if (g = s.shared.pending, g === null)
            break;
          U = g, g = U.next, U.next = null, s.lastBaseUpdate = U, s.shared.pending = null;
        }
      } while (!0);
      N === null && (S = G), s.baseState = S, s.firstBaseUpdate = C, s.lastBaseUpdate = N, r === null && (s.shared.lanes = 0), qt |= m, l.lanes = m, l.memoizedState = G;
    }
  }
  function Gy(l, n) {
    if (typeof l != "function")
      throw Error(q(191, l));
    l.call(n);
  }
  function Jh(l, n) {
    var u = l.callbacks;
    if (u !== null)
      for (l.callbacks = null, l = 0; l < u.length; l++)
        Gy(u[l], n);
  }
  var kn = un(null), Qf = un(0);
  function Br(l, n) {
    l = Gl, fe(Qf, l), fe(kn, n), Gl = l | n.baseLanes;
  }
  function xr() {
    fe(Qf, Gl), fe(kn, kn.current);
  }
  function Zf() {
    Gl = Qf.current, gl(kn), gl(Qf);
  }
  var Pe = un(null), Tl = null;
  function Mc(l) {
    var n = l.alternate;
    fe(tl, tl.current & 1), fe(Pe, l), Tl === null && (n === null || kn.current !== null || n.memoizedState !== null) && (Tl = l);
  }
  function Yr(l) {
    fe(tl, tl.current), fe(Pe, l), Tl === null && (Tl = l);
  }
  function Vy(l) {
    l.tag === 22 ? (fe(tl, tl.current), fe(Pe, l), Tl === null && (Tl = l)) : Pn();
  }
  function Pn() {
    fe(tl, tl.current), fe(Pe, Pe.current);
  }
  function za(l) {
    gl(Pe), Tl === l && (Tl = null), gl(tl);
  }
  var tl = un(0);
  function Lf(l, n) {
    fe(Pe, Pe.current), fe(tl, n);
  }
  function Kh(l) {
    gl(tl), gl(Pe), Tl === l && (Tl = null);
  }
  function Jf(l) {
    for (var n = l; n !== null; ) {
      if (n.tag === 13) {
        var u = n.memoizedState;
        if (u !== null && (u = u.dehydrated, u === null || Es(u) || Dd(u)))
          return n;
      } else if (n.tag === 19 && n.memoizedProps.revealOrder !== "independent") {
        if ((n.flags & 128) !== 0) return n;
      } else if (n.child !== null) {
        n.child.return = n, n = n.child;
        continue;
      }
      if (n === l) break;
      for (; n.sibling === null; ) {
        if (n.return === null || n.return === l) return null;
        n = n.return;
      }
      n.sibling.return = n.return, n = n.sibling;
    }
    return null;
  }
  var Bu = 0, gt = null, wt = null, Re = null, Kf = !1, $f = !1, zo = !1, qr = 0, _c = 0, Oi = null, $h = 0;
  function Te() {
    throw Error(q(321));
  }
  function Fh(l, n) {
    if (n === null) return !1;
    for (var u = 0; u < n.length && u < l.length; u++)
      if (!Ie(l[u], n[u])) return !1;
    return !0;
  }
  function Gr(l, n, u, i, s, r) {
    return Bu = r, gt = n, n.memoizedState = null, n.updateQueue = null, n.lanes = 0, ft.H = l === null || l.memoizedState === null ? W1 : Kr, zo = !1, r = u(i, s), zo = !1, $f && (r = jy(
      n,
      u,
      i,
      s
    )), Wh(l), r;
  }
  function Wh(l) {
    ft.H = Jr;
    var n = wt !== null && wt.next !== null;
    if (Bu = 0, Re = wt = gt = null, Kf = !1, _c = 0, Oi = null, n) throw Error(q(300));
    l === null || ae || (l = l.dependencies, l !== null && ve(l) && (ae = !0));
  }
  function jy(l, n, u, i) {
    gt = l;
    var s = 0;
    do {
      if ($f && (Oi = null), _c = 0, $f = !1, 25 <= s) throw Error(q(301));
      if (s += 1, Re = wt = null, l.updateQueue != null) {
        var r = l.updateQueue;
        r.lastEffect = null, r.events = null, r.stores = null, r.memoCache != null && (r.memoCache.index = 0);
      }
      ft.H = I1, r = n(u, i);
    } while ($f);
    return r;
  }
  function X1() {
    var l = ft.H, n = l.useState()[0];
    return n = typeof n.then == "function" ? Ao(n) : n, l = l.useState()[0], (wt !== null ? wt.memoizedState : null) !== l && (gt.flags |= 1024), n;
  }
  function Uc() {
    var l = qr !== 0;
    return qr = 0, l;
  }
  function Ih(l, n, u) {
    n.updateQueue = l.updateQueue, n.flags &= -2053, l.lanes &= ~u;
  }
  function kh(l) {
    if (Kf) {
      for (l = l.memoizedState; l !== null; ) {
        var n = l.queue;
        n !== null && (n.pending = null), l = l.next;
      }
      Kf = !1;
    }
    Bu = 0, Re = wt = gt = null, $f = !1, _c = qr = 0, Oi = null;
  }
  function Bl() {
    var l = {
      memoizedState: null,
      baseState: null,
      baseQueue: null,
      queue: null,
      next: null
    };
    return Re === null ? gt.memoizedState = Re = l : Re = Re.next = l, Re;
  }
  function Se() {
    if (wt === null) {
      var l = gt.alternate;
      l = l !== null ? l.memoizedState : null;
    } else l = wt.next;
    var n = Re === null ? gt.memoizedState : Re.next;
    if (n !== null)
      Re = n, wt = l;
    else {
      if (l === null)
        throw gt.alternate === null ? Error(q(467)) : Error(q(310));
      wt = l, l = {
        memoizedState: wt.memoizedState,
        baseState: wt.baseState,
        baseQueue: wt.baseQueue,
        queue: wt.queue,
        next: null
      }, Re === null ? gt.memoizedState = Re = l : Re = Re.next = l;
    }
    return Re;
  }
  function Vr() {
    return { lastEffect: null, events: null, stores: null, memoCache: null };
  }
  function Ao(l) {
    var n = _c;
    return _c += 1, Oi === null && (Oi = []), l = By(Oi, l, n), n = gt, (Re === null ? n.memoizedState : Re.next) === null && (n = n.alternate, ft.H = n === null || n.memoizedState === null ? W1 : Kr), l;
  }
  function Ff(l) {
    if (l !== null && typeof l == "object") {
      if (typeof l.then == "function") return Ao(l);
      if (l.$$typeof === vl) return;
      if (l.$$typeof === Rl) return ke(l);
    }
    throw Error(q(438, String(l)));
  }
  function jr(l) {
    var n = null, u = gt.updateQueue;
    if (u !== null && (n = u.memoCache), n == null) {
      var i = gt.alternate;
      i !== null && (i = i.updateQueue, i !== null && (i = i.memoCache, i != null && (n = {
        data: i.data.map(function(s) {
          return s.slice();
        }),
        index: 0
      })));
    }
    if (n == null && (n = { data: [], index: 0 }), u === null && (u = Vr(), gt.updateQueue = u), u.memoCache = n, u = n.data[n.index], u === void 0)
      for (u = n.data[n.index] = Array(l), i = 0; i < l; i++)
        u[i] = de;
    return n.index++, u;
  }
  function Nc(l, n) {
    return typeof n == "function" ? n(l) : n;
  }
  function Me(l) {
    var n = Se();
    return Ph(n, wt, l);
  }
  function Ph(l, n, u) {
    var i = l.queue;
    if (i === null) throw Error(q(311));
    i.lastRenderedReducer = u;
    var s = l.baseQueue, r = i.pending;
    if (r !== null) {
      if (s !== null) {
        var m = s.next;
        s.next = r.next, r.next = m;
      }
      n.baseQueue = s = r, i.pending = null;
    }
    if (r = l.baseState, s === null) l.memoizedState = r;
    else {
      n = s.next;
      var g = m = null, S = null, C = n, N = !1;
      do {
        var G = C.lane & -536870913;
        if (G !== C.lane ? (ut & G) === G : (Bu & G) === G) {
          var D = C.revertLane;
          if (D === 0)
            S !== null && (S = S.next = {
              lane: 0,
              revertLane: 0,
              gesture: null,
              action: C.action,
              hasEagerState: C.hasEagerState,
              eagerState: C.eagerState,
              next: null
            }), G === Dc && (N = !0);
          else if ((Bu & D) === D) {
            C = C.next, D === Dc && (N = !0);
            continue;
          } else
            G = {
              lane: 0,
              revertLane: C.revertLane,
              gesture: null,
              action: C.action,
              hasEagerState: C.hasEagerState,
              eagerState: C.eagerState,
              next: null
            }, S === null ? (g = S = G, m = r) : S = S.next = G, gt.lanes |= D, qt |= D;
          G = C.action, zo && u(r, G), r = C.hasEagerState ? C.eagerState : u(r, G);
        } else
          D = {
            lane: G,
            revertLane: C.revertLane,
            gesture: C.gesture,
            action: C.action,
            hasEagerState: C.hasEagerState,
            eagerState: C.eagerState,
            next: null
          }, S === null ? (g = S = D, m = r) : S = S.next = D, gt.lanes |= G, qt |= G;
        C = C.next;
      } while (C !== null && C !== n);
      if (S === null ? m = r : S.next = g, !Ie(r, l.memoizedState) && (ae = !0, N && (u = Wn, u !== null)))
        throw u;
      l.memoizedState = r, l.baseState = m, l.baseQueue = S, i.lastRenderedState = r;
    }
    return s === null && (i.lanes = 0), [l.memoizedState, i.dispatch];
  }
  function t0(l) {
    var n = Se(), u = n.queue;
    if (u === null) throw Error(q(311));
    u.lastRenderedReducer = l;
    var i = u.dispatch, s = u.pending, r = n.memoizedState;
    if (s !== null) {
      u.pending = null;
      var m = s = s.next;
      do
        r = l(r, m.action), m = m.next;
      while (m !== s);
      Ie(r, n.memoizedState) || (ae = !0), n.memoizedState = r, n.baseQueue === null && (n.baseState = r), u.lastRenderedState = r;
    }
    return [r, i];
  }
  function wy(l, n, u) {
    var i = gt, s = Se(), r = vt;
    if (r) {
      if (u === void 0) throw Error(q(407));
      u = u();
    } else u = n();
    var m = !Ie(
      (wt || s).memoizedState,
      u
    );
    if (m && (s.memoizedState = u, ae = !0), s = s.queue, c0(Qy.bind(null, i, s, l), [
      l
    ]), l = s.getSnapshot !== n || m || Re !== null && (Re.memoizedState.tag & 1) !== 0, Do(
      l ? 9 : 8,
      { destroy: void 0 },
      Wf.bind(null, i, s, u, n),
      null
    ), l) {
      if (i.flags |= 2048, ce === null) throw Error(q(349));
      r || (Bu & 127) !== 0 || Xy(i, n, u);
    }
    return u;
  }
  function Xy(l, n, u) {
    l.flags |= 16384, l = { getSnapshot: n, value: u }, n = gt.updateQueue, n === null ? (n = Vr(), gt.updateQueue = n, n.stores = [l]) : (u = n.stores, u === null ? n.stores = [l] : u.push(l));
  }
  function Wf(l, n, u, i) {
    n.value = u, n.getSnapshot = i, wr(n) && Zy(l);
  }
  function Qy(l, n, u) {
    return u(function() {
      wr(n) && Zy(l);
    });
  }
  function wr(l) {
    var n = l.getSnapshot;
    l = l.value;
    try {
      var u = n();
      return !Ie(l, u);
    } catch {
      return !0;
    }
  }
  function Zy(l) {
    var n = yi(l, 2);
    n !== null && Ma(n, l, 2);
  }
  function Ly(l) {
    var n = Bl();
    if (typeof l == "function") {
      var u = l;
      if (l = u(), zo) {
        cc(!0);
        try {
          u();
        } finally {
          cc(!1);
        }
      }
    }
    return n.memoizedState = n.baseState = l, n.queue = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: Nc,
      lastRenderedState: l
    }, n;
  }
  function Oo(l, n, u, i) {
    return l.baseState = u, Ph(
      l,
      wt,
      typeof i == "function" ? i : Nc
    );
  }
  function Jy(l, n, u, i, s) {
    if (h0(l)) throw Error(q(485));
    if (l = n.action, l !== null) {
      var r = {
        payload: s,
        action: l,
        next: null,
        isTransition: !0,
        status: "pending",
        value: null,
        reason: null,
        listeners: [],
        then: function(m) {
          r.listeners.push(m);
        }
      };
      ft.T !== null ? u(!0) : r.isTransition = !1, i(r), u = n.pending, u === null ? (r.next = n.pending = r, Ky(n, r)) : (r.next = u.next, n.pending = u.next = r);
    }
  }
  function Ky(l, n) {
    var u = n.action, i = n.payload, s = l.state;
    if (n.isTransition) {
      var r = ft.T, m = {};
      m.types = r !== null ? r.types : null, ft.T = m;
      try {
        var g = u(s, i), S = ft.S;
        S !== null && S(m, g), $y(l, n, g);
      } catch (C) {
        Xr(l, n, C);
      } finally {
        r !== null && m.types !== null && (r.types = m.types), ft.T = r;
      }
    } else
      try {
        r = u(s, i), $y(l, n, r);
      } catch (C) {
        Xr(l, n, C);
      }
  }
  function $y(l, n, u) {
    u !== null && typeof u == "object" && typeof u.then == "function" ? u.then(
      function(i) {
        Fy(l, n, i);
      },
      function(i) {
        return Xr(l, n, i);
      }
    ) : Fy(l, n, u);
  }
  function Fy(l, n, u) {
    n.status = "fulfilled", n.value = u, e0(n), l.state = u, n = l.pending, n !== null && (u = n.next, u === n ? l.pending = null : (u = u.next, n.next = u, Ky(l, u)));
  }
  function Xr(l, n, u) {
    var i = l.pending;
    if (l.pending = null, i !== null) {
      i = i.next;
      do
        n.status = "rejected", n.reason = u, e0(n), n = n.next;
      while (n !== i);
    }
    l.action = null;
  }
  function e0(l) {
    l = l.listeners;
    for (var n = 0; n < l.length; n++) (0, l[n])();
  }
  function l0(l, n) {
    return n;
  }
  function Wy(l, n) {
    if (vt) {
      var u = ce.formState;
      if (u !== null) {
        t: {
          var i = gt;
          if (vt) {
            if (kt) {
              e: {
                for (var s = kt, r = fn; s.nodeType !== 8; ) {
                  if (!r) {
                    s = null;
                    break e;
                  }
                  if (s = ra(
                    s.nextSibling
                  ), s === null) {
                    s = null;
                    break e;
                  }
                }
                r = s.data, s = r === "F!" || r === "F" ? s : null;
              }
              if (s) {
                kt = ra(
                  s.nextSibling
                ), i = s.data === "F!";
                break t;
              }
            }
            Ec(i);
          }
          i = !1;
        }
        i && (n = u[0]);
      }
    }
    return u = Bl(), u.memoizedState = u.baseState = n, i = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: l0,
      lastRenderedState: n
    }, u.queue = i, u = F1.bind(
      null,
      gt,
      i
    ), i.dispatch = u, i = Ly(!1), r = d0.bind(
      null,
      gt,
      !1,
      i.queue
    ), i = Bl(), s = {
      state: n,
      dispatch: null,
      action: l,
      pending: null
    }, i.queue = s, u = Jy.bind(
      null,
      gt,
      s,
      r,
      u
    ), s.dispatch = u, i.memoizedState = l, [n, u, !1];
  }
  function a0(l) {
    var n = Se();
    return Qr(n, wt, l);
  }
  function Qr(l, n, u) {
    if (n = Ph(
      l,
      n,
      l0
    )[0], l = Me(Nc)[0], typeof n == "object" && n !== null && typeof n.then == "function")
      try {
        var i = Ao(n);
      } catch (m) {
        throw m === po ? wf : m;
      }
    else i = n;
    n = Se();
    var s = n.queue, r = s.dispatch;
    return u !== n.memoizedState && (gt.flags |= 2048, Do(
      9,
      { destroy: void 0 },
      n0.bind(null, s, u),
      null
    )), [i, r, l];
  }
  function n0(l, n) {
    l.action = n;
  }
  function Q1(l) {
    var n = Se(), u = wt;
    if (u !== null)
      return Qr(n, u, l);
    Se(), n = n.memoizedState, u = Se();
    var i = u.queue.dispatch;
    return u.memoizedState = l, [n, i, !1];
  }
  function Do(l, n, u, i) {
    return l = { tag: l, create: u, deps: i, inst: n, next: null }, n = gt.updateQueue, n === null && (n = Vr(), gt.updateQueue = n), u = n.lastEffect, u === null ? n.lastEffect = l.next = l : (i = u.next, u.next = l, l.next = i, n.lastEffect = l), l;
  }
  function Iy() {
    return Se().memoizedState;
  }
  function Co(l, n, u, i) {
    var s = Bl();
    gt.flags |= l, s.memoizedState = Do(
      1 | n,
      { destroy: void 0 },
      u,
      i === void 0 ? null : i
    );
  }
  function If(l, n, u, i) {
    var s = Se();
    i = i === void 0 ? null : i;
    var r = s.memoizedState.inst;
    wt !== null && i !== null && Fh(i, wt.memoizedState.deps) ? s.memoizedState = Do(n, r, u, i) : (gt.flags |= l, s.memoizedState = Do(
      1 | n,
      r,
      u,
      i
    ));
  }
  function u0(l, n) {
    Co(8390656, 8, l, n);
  }
  function c0(l, n) {
    If(2048, 8, l, n);
  }
  function Hc(l) {
    gt.flags |= 4;
    var n = gt.updateQueue;
    if (n === null)
      n = Vr(), gt.updateQueue = n, n.events = [l];
    else {
      var u = n.events;
      u === null ? n.events = [l] : u.push(l);
    }
  }
  function i0(l) {
    var n = Se().memoizedState;
    return Hc({ ref: n, nextImpl: l }), function() {
      if ((Kt & 2) !== 0) throw Error(q(440));
      return n.impl.apply(void 0, arguments);
    };
  }
  function Z1(l, n) {
    return If(4, 2, l, n);
  }
  function o0(l, n) {
    return If(4, 4, l, n);
  }
  function xu(l, n) {
    if (typeof n == "function") {
      l = l();
      var u = n(l);
      return function() {
        typeof u == "function" ? u() : n(null);
      };
    }
    if (n != null)
      return l = l(), n.current = l, function() {
        n.current = null;
      };
  }
  function f0(l, n, u) {
    u = u != null ? u.concat([l]) : null, If(4, 4, xu.bind(null, n, l), u);
  }
  function s0() {
  }
  function Zr(l, n) {
    var u = Se();
    n = n === void 0 ? null : n;
    var i = u.memoizedState;
    return n !== null && Fh(n, i[1]) ? i[0] : (u.memoizedState = [l, n], l);
  }
  function kf(l, n) {
    var u = Se();
    n = n === void 0 ? null : n;
    var i = u.memoizedState;
    if (n !== null && Fh(n, i[1]))
      return i[0];
    if (i = l(), zo) {
      cc(!0);
      try {
        l();
      } finally {
        cc(!1);
      }
    }
    return u.memoizedState = [i, n], i;
  }
  function Pt(l, n, u) {
    return u === void 0 || (Bu & 1073741824) !== 0 && (ut & 261930) === 0 ? l.memoizedState = n : (l.memoizedState = u, l = sp(), gt.lanes |= l, qt |= l, u);
  }
  function L1(l, n, u, i) {
    return Ie(u, n) ? u : kn.current !== null ? (l = Pt(l, u, i), Ie(l, n) || (ae = !0), l) : (Bu & 106) === 0 || (Bu & 1073741824) !== 0 && (ut & 261930) === 0 ? (ae = !0, l.memoizedState = u) : (l = sp(), gt.lanes |= l, qt |= l, n);
  }
  function J1(l, n, u, i, s) {
    var r = Jt.p;
    Jt.p = r !== 0 && 8 > r ? r : 8;
    var m = ft.T, g = {};
    g.types = m !== null ? m.types : null, ft.T = g, d0(l, !1, n, u);
    try {
      var S = s(), C = ft.S;
      if (C !== null && C(g, S), S !== null && typeof S == "object" && typeof S.then == "function") {
        var N = Uy(
          S,
          i
        );
        Lr(
          l,
          n,
          N,
          ka(l)
        );
      } else
        Lr(
          l,
          n,
          i,
          ka(l)
        );
    } catch (G) {
      Lr(
        l,
        n,
        { then: function() {
        }, status: "rejected", reason: G },
        ka()
      );
    } finally {
      Jt.p = r, m !== null && g.types !== null && (m.types = g.types), ft.T = m;
    }
  }
  function K1() {
  }
  function rn(l, n, u, i) {
    if (l.tag !== 5) throw Error(q(476));
    var s = ky(l).queue;
    J1(
      l,
      s,
      n,
      Pi,
      u === null ? K1 : function() {
        return r0(l), u(i);
      }
    );
  }
  function ky(l) {
    var n = l.memoizedState;
    if (n !== null) return n;
    n = {
      memoizedState: Pi,
      baseState: Pi,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: Nc,
        lastRenderedState: Pi
      },
      next: null
    };
    var u = {};
    return n.next = {
      memoizedState: u,
      baseState: u,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: Nc,
        lastRenderedState: u
      },
      next: null
    }, l.memoizedState = n, l = l.alternate, l !== null && (l.memoizedState = n), n;
  }
  function r0(l) {
    var n = ky(l);
    n.next === null && (n = l.alternate.memoizedState), Lr(
      l,
      n.next.queue,
      {},
      ka()
    );
  }
  function Ro() {
    return ke($e);
  }
  function Mo() {
    return Se().memoizedState;
  }
  function Py() {
    return Se().memoizedState;
  }
  function tv(l) {
    for (var n = l.return; n !== null; ) {
      switch (n.tag) {
        case 24:
        case 3:
          var u = ka();
          l = Ea(u);
          var i = Ve(n, l, u);
          i !== null && (Ma(i, n, u), zi(i, n, u)), n = { cache: bl() }, l.payload = n;
          return;
      }
      n = n.return;
    }
  }
  function $1(l, n, u) {
    var i = ka();
    u = {
      lane: i,
      revertLane: 0,
      gesture: null,
      action: u,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, h0(l) ? tu(n, u) : (u = Cy(l, n, u, i), u !== null && (Ma(u, l, i), il(u, n, i)));
  }
  function F1(l, n, u) {
    var i = ka();
    Lr(l, n, u, i);
  }
  function Lr(l, n, u, i) {
    var s = {
      lane: i,
      revertLane: 0,
      gesture: null,
      action: u,
      hasEagerState: !1,
      eagerState: null,
      next: null
    };
    if (h0(l)) tu(n, s);
    else {
      var r = l.alternate;
      if (l.lanes === 0 && (r === null || r.lanes === 0) && (r = n.lastRenderedReducer, r !== null))
        try {
          var m = n.lastRenderedState, g = r(m, u);
          if (s.hasEagerState = !0, s.eagerState = g, Ie(g, m))
            return mi(l, n, s, 0), ce === null && Ja(), !1;
        } catch {
        }
      if (u = Cy(l, n, s, i), u !== null)
        return Ma(u, l, i), il(u, n, i), !0;
    }
    return !1;
  }
  function d0(l, n, u, i) {
    if (i = {
      lane: 2,
      revertLane: P0(),
      gesture: null,
      action: i,
      hasEagerState: !1,
      eagerState: null,
      next: null
    }, h0(l)) {
      if (n) throw Error(q(479));
    } else
      n = Cy(
        l,
        u,
        i,
        2
      ), n !== null && Ma(n, l, 2);
  }
  function h0(l) {
    var n = l.alternate;
    return l === gt || n !== null && n === gt;
  }
  function tu(l, n) {
    $f = Kf = !0;
    var u = l.pending;
    u === null ? n.next = n : (n.next = u.next, u.next = n), l.pending = n;
  }
  function il(l, n, u) {
    if ((u & 4194048) !== 0) {
      var i = n.lanes;
      i &= l.pendingLanes, u |= i, n.lanes = u, ly(l, u);
    }
  }
  var Jr = {
    readContext: ke,
    use: Ff,
    useCallback: Te,
    useContext: Te,
    useEffect: Te,
    useImperativeHandle: Te,
    useLayoutEffect: Te,
    useInsertionEffect: Te,
    useMemo: Te,
    useReducer: Te,
    useRef: Te,
    useState: Te,
    useDebugValue: Te,
    useDeferredValue: Te,
    useTransition: Te,
    useSyncExternalStore: Te,
    useId: Te,
    useHostTransitionStatus: Te,
    useFormState: Te,
    useActionState: Te,
    useOptimistic: Te,
    useMemoCache: Te,
    useCacheRefresh: Te,
    useEffectEvent: Te
  }, W1 = {
    readContext: ke,
    use: Ff,
    useCallback: function(l, n) {
      return Bl().memoizedState = [
        l,
        n === void 0 ? null : n
      ], l;
    },
    useContext: ke,
    useEffect: u0,
    useImperativeHandle: function(l, n, u) {
      u = u != null ? u.concat([l]) : null, Co(
        4194308,
        4,
        xu.bind(null, n, l),
        u
      );
    },
    useLayoutEffect: function(l, n) {
      return Co(4194308, 4, l, n);
    },
    useInsertionEffect: function(l, n) {
      Co(4, 2, l, n);
    },
    useMemo: function(l, n) {
      var u = Bl();
      n = n === void 0 ? null : n;
      var i = l();
      if (zo) {
        cc(!0);
        try {
          l();
        } finally {
          cc(!1);
        }
      }
      return u.memoizedState = [i, n], i;
    },
    useReducer: function(l, n, u) {
      var i = Bl();
      if (u !== void 0) {
        var s = u(n);
        if (zo) {
          cc(!0);
          try {
            u(n);
          } finally {
            cc(!1);
          }
        }
      } else s = n;
      return i.memoizedState = i.baseState = s, l = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: l,
        lastRenderedState: s
      }, i.queue = l, l = l.dispatch = $1.bind(
        null,
        gt,
        l
      ), [i.memoizedState, l];
    },
    useRef: function(l) {
      var n = Bl();
      return l = { current: l }, n.memoizedState = l;
    },
    useState: function(l) {
      l = Ly(l);
      var n = l.queue, u = F1.bind(null, gt, n);
      return n.dispatch = u, [l.memoizedState, u];
    },
    useDebugValue: s0,
    useDeferredValue: function(l, n) {
      var u = Bl();
      return Pt(u, l, n);
    },
    useTransition: function() {
      var l = Ly(!1);
      return l = J1.bind(
        null,
        gt,
        l.queue,
        !0,
        !1
      ), Bl().memoizedState = l, [!1, l];
    },
    useSyncExternalStore: function(l, n, u) {
      var i = gt, s = Bl();
      if (vt) {
        if (u === void 0)
          throw Error(q(407));
        u = u();
      } else {
        if (u = n(), ce === null)
          throw Error(q(349));
        (ut & 127) !== 0 || Xy(i, n, u);
      }
      s.memoizedState = u;
      var r = { value: u, getSnapshot: n };
      return s.queue = r, u0(Qy.bind(null, i, r, l), [
        l
      ]), i.flags |= 2048, Do(
        9,
        { destroy: void 0 },
        Wf.bind(
          null,
          i,
          r,
          u,
          n
        ),
        null
      ), u;
    },
    useId: function() {
      var l = Bl(), n = ce.identifierPrefix;
      if (vt) {
        var u = Qn, i = Xn;
        u = (i & ~(1 << 32 - Ml(i) - 1)).toString(32) + u, n = "_" + n + "R_" + u, u = qr++, 0 < u && (n += "H" + u.toString(32)), n += "_";
      } else
        u = $h++, n = "_" + n + "r_" + u.toString(32) + "_";
      return l.memoizedState = n;
    },
    useHostTransitionStatus: Ro,
    useFormState: Wy,
    useActionState: Wy,
    useOptimistic: function(l) {
      var n = Bl();
      n.memoizedState = n.baseState = l;
      var u = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: null,
        lastRenderedState: null
      };
      return n.queue = u, n = d0.bind(
        null,
        gt,
        !0,
        u
      ), u.dispatch = n, [l, n];
    },
    useMemoCache: jr,
    useCacheRefresh: function() {
      return Bl().memoizedState = tv.bind(
        null,
        gt
      );
    },
    useEffectEvent: function(l) {
      var n = Bl(), u = { impl: l };
      return n.memoizedState = u, function() {
        if ((Kt & 2) !== 0)
          throw Error(q(440));
        return u.impl.apply(void 0, arguments);
      };
    }
  }, Kr = {
    readContext: ke,
    use: Ff,
    useCallback: Zr,
    useContext: ke,
    useEffect: c0,
    useImperativeHandle: f0,
    useInsertionEffect: Z1,
    useLayoutEffect: o0,
    useMemo: kf,
    useReducer: Me,
    useRef: Iy,
    useState: function() {
      return Me(Nc);
    },
    useDebugValue: s0,
    useDeferredValue: function(l, n) {
      var u = Se();
      return L1(
        u,
        wt.memoizedState,
        l,
        n
      );
    },
    useTransition: function() {
      var l = Me(Nc)[0], n = Se().memoizedState;
      return [
        typeof l == "boolean" ? l : Ao(l),
        n
      ];
    },
    useSyncExternalStore: wy,
    useId: Mo,
    useHostTransitionStatus: Ro,
    useFormState: a0,
    useActionState: a0,
    useOptimistic: function(l, n) {
      var u = Se();
      return Oo(u, wt, l, n);
    },
    useMemoCache: jr,
    useCacheRefresh: Py,
    useEffectEvent: i0
  }, I1 = {
    readContext: ke,
    use: Ff,
    useCallback: Zr,
    useContext: ke,
    useEffect: c0,
    useImperativeHandle: f0,
    useInsertionEffect: Z1,
    useLayoutEffect: o0,
    useMemo: kf,
    useReducer: t0,
    useRef: Iy,
    useState: function() {
      return t0(Nc);
    },
    useDebugValue: s0,
    useDeferredValue: function(l, n) {
      var u = Se();
      return wt === null ? Pt(u, l, n) : L1(
        u,
        wt.memoizedState,
        l,
        n
      );
    },
    useTransition: function() {
      var l = t0(Nc)[0], n = Se().memoizedState;
      return [
        typeof l == "boolean" ? l : Ao(l),
        n
      ];
    },
    useSyncExternalStore: wy,
    useId: Mo,
    useHostTransitionStatus: Ro,
    useFormState: Q1,
    useActionState: Q1,
    useOptimistic: function(l, n) {
      var u = Se();
      return wt !== null ? Oo(u, wt, l, n) : (u.baseState = l, [l, u.queue.dispatch]);
    },
    useMemoCache: jr,
    useCacheRefresh: Py,
    useEffectEvent: i0
  };
  function _o(l, n, u, i) {
    n = l.memoizedState, u = u(i, n), u = u == null ? n : mt({}, n, u), l.memoizedState = u, l.lanes === 0 && (l.updateQueue.baseState = u);
  }
  var $r = {
    enqueueSetState: function(l, n, u) {
      l = l._reactInternals;
      var i = ka(), s = Ea(i);
      s.payload = n, u != null && (s.callback = u), n = Ve(l, s, i), n !== null && (Ma(n, l, i), zi(n, l, i));
    },
    enqueueReplaceState: function(l, n, u) {
      l = l._reactInternals;
      var i = ka(), s = Ea(i);
      s.tag = 1, s.payload = n, u != null && (s.callback = u), n = Ve(l, s, i), n !== null && (Ma(n, l, i), zi(n, l, i));
    },
    enqueueForceUpdate: function(l, n) {
      l = l._reactInternals;
      var u = ka(), i = Ea(u);
      i.tag = 2, n != null && (i.callback = n), n = Ve(l, i, u), n !== null && (Ma(n, l, u), zi(n, l, u));
    }
  };
  function m0(l, n, u, i, s, r, m) {
    return l = l.stateNode, typeof l.shouldComponentUpdate == "function" ? l.shouldComponentUpdate(i, r, m) : n.prototype && n.prototype.isPureReactComponent ? !mo(u, i) || !mo(s, r) : !0;
  }
  function y0(l, n, u, i) {
    l = n.state, typeof n.componentWillReceiveProps == "function" && n.componentWillReceiveProps(u, i), typeof n.UNSAFE_componentWillReceiveProps == "function" && n.UNSAFE_componentWillReceiveProps(u, i), n.state !== l && $r.enqueueReplaceState(n, n.state, null);
  }
  function Bc(l, n) {
    var u = n;
    if ("ref" in n) {
      u = {};
      for (var i in n)
        i !== "ref" && (u[i] = n[i]);
    }
    if (l = l.defaultProps) {
      u === n && (u = mt({}, u));
      for (var s in l)
        u[s] === void 0 && (u[s] = l[s]);
    }
    return u;
  }
  function ev(l) {
    xf(l);
  }
  function v0(l) {
    console.error(l);
  }
  function g0(l) {
    xf(l);
  }
  function Uo(l, n) {
    try {
      var u = l.onUncaughtError;
      u(n.value, { componentStack: n.stack });
    } catch (i) {
      setTimeout(function() {
        throw i;
      });
    }
  }
  function k1(l, n, u) {
    try {
      var i = l.onCaughtError;
      i(u.value, {
        componentStack: u.stack,
        errorBoundary: n.tag === 1 ? n.stateNode : null
      });
    } catch (s) {
      setTimeout(function() {
        throw s;
      });
    }
  }
  function p0(l, n, u) {
    return u = Ea(u), u.tag = 3, u.payload = { element: null }, u.callback = function() {
      Uo(l, n);
    }, u;
  }
  function lv(l) {
    return l = Ea(l), l.tag = 3, l;
  }
  function av(l, n, u, i) {
    var s = u.type.getDerivedStateFromError;
    if (typeof s == "function") {
      var r = i.value;
      l.payload = function() {
        return s(r);
      }, l.callback = function() {
        k1(n, u, i);
      };
    }
    var m = u.stateNode;
    m !== null && typeof m.componentDidCatch == "function" && (l.callback = function() {
      k1(n, u, i), typeof s != "function" && (Yc === null ? Yc = /* @__PURE__ */ new Set([this]) : Yc.add(this));
      var g = i.stack;
      this.componentDidCatch(i.value, {
        componentStack: g !== null ? g : ""
      });
    });
  }
  function Pf(l, n, u, i, s) {
    if (u.flags |= 32768, i !== null && typeof i == "object" && typeof i.then == "function") {
      if (n = u.alternate, n !== null && Hu(
        n,
        u,
        s,
        !0
      ), u = Pe.current, u !== null) {
        switch (u.tag) {
          case 31:
          case 13:
          case 19:
            return Tl === null ? K0() : u.alternate === null && ze === 0 && (ze = 3), u.flags &= -257, u.flags |= 65536, u.lanes = s, i === Xf ? u.flags |= 16384 : (n = u.updateQueue, n === null ? u.updateQueue = /* @__PURE__ */ new Set([i]) : n.add(i), Nv(l, i, s)), !1;
          case 22:
            return u.flags |= 65536, i === Xf ? u.flags |= 16384 : (n = u.updateQueue, n === null ? (n = {
              transitions: null,
              markerInstances: null,
              retryQueue: /* @__PURE__ */ new Set([i])
            }, u.updateQueue = n) : (u = n.retryQueue, u === null ? n.retryQueue = /* @__PURE__ */ new Set([i]) : u.add(i)), Nv(l, i, s)), !1;
        }
        throw Error(q(435, u.tag));
      }
      return Nv(l, i, s), K0(), !1;
    }
    if (vt)
      return n = Pe.current, n !== null ? ((n.flags & 65536) === 0 && (n.flags |= 256), n.flags |= 65536, n.lanes = s, i !== wh && (l = Error(q(422), { cause: i }), sn(ta(l, u)))) : (i !== wh && (n = Error(q(423), {
        cause: i
      }), sn(
        ta(n, u)
      )), l = l.current.alternate, l.flags |= 65536, s &= -s, l.lanes |= s, i = ta(i, u), s = p0(
        l.stateNode,
        i,
        s
      ), qy(l, s), ze !== 4 && (ze = 2)), !1;
    var r = Error(q(520), { cause: i });
    if (r = ta(r, u), Xo === null ? Xo = [r] : Xo.push(r), ze !== 4 && (ze = 2), n === null) return !0;
    i = ta(i, u), u = n;
    do {
      switch (u.tag) {
        case 3:
          return u.flags |= 65536, l = s & -s, u.lanes |= l, l = p0(u.stateNode, i, l), qy(u, l), !1;
        case 1:
          if (n = u.type, r = u.stateNode, (u.flags & 128) === 0 && (typeof n.getDerivedStateFromError == "function" || r !== null && typeof r.componentDidCatch == "function" && (Yc === null || !Yc.has(r))))
            return u.flags |= 65536, s &= -s, u.lanes |= s, s = lv(s), av(
              s,
              l,
              u,
              i
            ), qy(u, s), !1;
          break;
        case 22:
          if (u.memoizedState !== null)
            return u.flags |= 65536, !1;
      }
      u = u.return;
    } while (u !== null);
    return !1;
  }
  var S0 = Error(q(461)), ae = !1;
  function _e(l, n, u, i) {
    n.child = l === null ? w1(n, null, u, i) : Ti(
      n,
      l.child,
      u,
      i
    );
  }
  function b0(l, n, u, i, s) {
    u = u.render;
    var r = n.ref;
    if ("ref" in i) {
      var m = {};
      for (var g in i)
        g !== "ref" && (m[g] = i[g]);
    } else m = i;
    return Ac(n), i = Gr(
      l,
      n,
      u,
      m,
      r,
      s
    ), g = Uc(), l !== null && !ae ? (Ih(l, n, s), Yu(l, n, s)) : (vt && g && Ln(n), n.flags |= 1, _e(l, n, i, s), n.child);
  }
  function T0(l, n, u, i, s) {
    if (l === null) {
      var r = u.type;
      return typeof r == "function" && !Gh(r) && r.defaultProps === void 0 && u.compare === null ? (n.tag = 15, n.type = r, E0(
        l,
        n,
        r,
        i,
        s
      )) : (l = Er(
        u.type,
        null,
        i,
        n,
        n.mode,
        s
      ), l.ref = n.ref, l.return = n, n.child = l);
    }
    if (r = l.child, !Di(l, s)) {
      var m = r.memoizedProps;
      if (u = u.compare, u = u !== null ? u : mo, u(m, i) && l.ref === n.ref)
        return Yu(l, n, s);
    }
    return n.flags |= 1, l = Uu(r, i), l.ref = n.ref, l.return = n, n.child = l;
  }
  function E0(l, n, u, i, s) {
    if (l !== null) {
      var r = l.memoizedProps;
      if (mo(r, i) && l.ref === n.ref)
        if (ae = !1, n.pendingProps = i = r, Di(l, s))
          (l.flags & 131072) !== 0 && (ae = !0);
        else
          return n.lanes = l.lanes, Yu(l, n, s);
    }
    return A0(
      l,
      n,
      u,
      i,
      s
    );
  }
  function nv(l, n, u, i) {
    var s = i.children, r = l !== null ? l.memoizedState : null;
    if (l === null && n.stateNode === null && (n.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    }), i.mode === "hidden") {
      if ((n.flags & 128) !== 0) {
        if (r = r !== null ? r.baseLanes | u : u, l !== null) {
          for (i = n.child = l.child, s = 0; i !== null; )
            s = s | i.lanes | i.childLanes, i = i.sibling;
          i = s & ~r;
        } else i = 0, n.child = null;
        return Fr(
          l,
          n,
          r,
          u,
          i
        );
      }
      if ((u & 536870912) !== 0)
        n.memoizedState = { baseLanes: 0, cachePool: null }, l !== null && Rr(
          n,
          r !== null ? r.cachePool : null
        ), r !== null ? Br(n, r) : xr(), Vy(n);
      else
        return i = n.lanes = 536870912, Fr(
          l,
          n,
          r !== null ? r.baseLanes | u : u,
          u,
          i
        );
    } else
      r !== null ? (Rr(n, r.cachePool), Br(n, r), Pn(), n.memoizedState = null) : (l !== null && Rr(n, null), xr(), Pn());
    return _e(l, n, s, u), n.child;
  }
  function No(l, n) {
    return l !== null && l.tag === 22 || n.stateNode !== null || (n.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    }), n.sibling;
  }
  function Fr(l, n, u, i, s) {
    var r = Lh();
    return r = r === null ? null : { parent: Ce._currentValue, pool: r }, n.memoizedState = {
      baseLanes: u,
      cachePool: r
    }, l !== null && Rr(n, null), xr(), Vy(n), l !== null && Hu(l, n, i, !0), n.childLanes = s, null;
  }
  function Wr(l, n) {
    return n = Aa(
      { mode: n.mode, children: n.children },
      l.mode
    ), n.ref = l.ref, l.child = n, n.return = l, n;
  }
  function z0(l, n, u) {
    return Ti(n, l.child, null, u), l = Wr(n, n.pendingProps), l.flags |= 2, za(n), n.memoizedState = null, l;
  }
  function P1(l, n, u) {
    var i = n.pendingProps, s = (n.flags & 128) !== 0;
    if (n.flags &= -129, l === null) {
      if (vt) {
        if (i.mode === "hidden")
          return l = Wr(n, i), n.lanes = 536870912, l.memoizedState = { baseLanes: 0, cachePool: null }, No(null, l);
        if (Yr(n), (l = kt) ? (l = Sn(
          l,
          fn
        ), l = l !== null && l.data === "&" ? l : null, l !== null && (n.memoizedState = {
          dehydrated: l,
          treeContext: wn !== null ? { id: Xn, overflow: Qn } : null,
          retryLane: 536870912,
          hydrationErrors: null
        }, u = Hl(l), u.return = n, n.child = u, Ge = n, kt = null)) : l = null, l === null) throw Ec(n);
        return n.lanes = 536870912, null;
      }
      return Wr(n, i);
    }
    var r = l.memoizedState;
    if (r !== null) {
      var m = r.dehydrated;
      if (Yr(n), s)
        if (n.flags & 256)
          n.flags &= -257, n = z0(
            l,
            n,
            u
          );
        else if (n.memoizedState !== null)
          n.child = l.child, n.flags |= 128, n = null;
        else throw Error(q(558));
      else if (ae || Hu(l, n, u, !1), s = (u & l.childLanes) !== 0, ae || s) {
        if (kn.current === null) {
          if (i = ce, i !== null && (m = g1(i, u), m !== 0 && m !== r.retryLane))
            throw r.retryLane = m, yi(l, m), Ma(i, l, m), S0;
          K0();
        }
        n = z0(
          l,
          n,
          u
        );
      } else
        l = r.treeContext, kt = ra(m.nextSibling), Ge = n, vt = !0, Tc = null, fn = !1, l !== null && Gf(n, l), n = Wr(n, i), n.flags |= 134221824;
      return n;
    }
    return l = Uu(l.child, {
      mode: i.mode,
      children: i.children
    }), l.ref = n.ref, n.child = l, l.return = n, l;
  }
  function Ho(l, n) {
    var u = n.ref;
    if (u === null)
      l !== null && l.ref !== null && (n.flags |= 4194816);
    else {
      if (typeof u != "function" && typeof u != "object")
        throw Error(q(284));
      (l === null || l.ref !== u) && (n.flags |= 4194816);
    }
  }
  function A0(l, n, u, i, s) {
    return Ac(n), u = Gr(
      l,
      n,
      u,
      i,
      void 0,
      s
    ), i = Uc(), l !== null && !ae ? (Ih(l, n, s), Yu(l, n, s)) : (vt && i && Ln(n), n.flags |= 1, _e(l, n, u, s), n.child);
  }
  function uv(l, n, u, i, s, r) {
    return Ac(n), n.updateQueue = null, u = jy(
      n,
      i,
      u,
      s
    ), Wh(l), i = Uc(), l !== null && !ae ? (Ih(l, n, r), Yu(l, n, r)) : (vt && i && Ln(n), n.flags |= 1, _e(l, n, u, r), n.child);
  }
  function tp(l, n, u, i, s) {
    if (Ac(n), n.stateNode === null) {
      var r = Sc, m = u.contextType;
      typeof m == "object" && m !== null && (r = ke(m)), r = new u(i, r), n.memoizedState = r.state !== null && r.state !== void 0 ? r.state : null, r.updater = $r, n.stateNode = r, r._reactInternals = n, r = n.stateNode, r.props = i, r.state = n.memoizedState, r.refs = {}, Ei(n), m = u.contextType, r.context = typeof m == "object" && m !== null ? ke(m) : Sc, r.state = n.memoizedState, m = u.getDerivedStateFromProps, typeof m == "function" && (_o(
        n,
        u,
        m,
        i
      ), r.state = n.memoizedState), typeof u.getDerivedStateFromProps == "function" || typeof r.getSnapshotBeforeUpdate == "function" || typeof r.UNSAFE_componentWillMount != "function" && typeof r.componentWillMount != "function" || (m = r.state, typeof r.componentWillMount == "function" && r.componentWillMount(), typeof r.UNSAFE_componentWillMount == "function" && r.UNSAFE_componentWillMount(), m !== r.state && $r.enqueueReplaceState(r, r.state, null), Eo(n, i, r, s), Ai(), r.state = n.memoizedState), typeof r.componentDidMount == "function" && (n.flags |= 4194308), i = !0;
    } else if (l === null) {
      r = n.stateNode;
      var g = n.memoizedProps, S = Bc(u, g);
      r.props = S;
      var C = r.context, N = u.contextType;
      m = Sc, typeof N == "object" && N !== null && (m = ke(N));
      var G = u.getDerivedStateFromProps;
      N = typeof G == "function" || typeof r.getSnapshotBeforeUpdate == "function", g = n.pendingProps !== g, N || typeof r.UNSAFE_componentWillReceiveProps != "function" && typeof r.componentWillReceiveProps != "function" || (g || C !== m) && y0(
        n,
        r,
        i,
        m
      ), In = !1;
      var D = n.memoizedState;
      r.state = D, Eo(n, i, r, s), Ai(), C = n.memoizedState, g || D !== C || In ? (typeof G == "function" && (_o(
        n,
        u,
        G,
        i
      ), C = n.memoizedState), (S = In || m0(
        n,
        u,
        S,
        i,
        D,
        C,
        m
      )) ? (N || typeof r.UNSAFE_componentWillMount != "function" && typeof r.componentWillMount != "function" || (typeof r.componentWillMount == "function" && r.componentWillMount(), typeof r.UNSAFE_componentWillMount == "function" && r.UNSAFE_componentWillMount()), typeof r.componentDidMount == "function" && (n.flags |= 4194308)) : (typeof r.componentDidMount == "function" && (n.flags |= 4194308), n.memoizedProps = i, n.memoizedState = C), r.props = i, r.state = C, r.context = m, i = S) : (typeof r.componentDidMount == "function" && (n.flags |= 4194308), i = !1);
    } else {
      r = n.stateNode, Nr(l, n), m = n.memoizedProps, N = Bc(u, m), r.props = N, G = n.pendingProps, D = r.context, C = u.contextType, S = Sc, typeof C == "object" && C !== null && (S = ke(C)), g = u.getDerivedStateFromProps, (C = typeof g == "function" || typeof r.getSnapshotBeforeUpdate == "function") || typeof r.UNSAFE_componentWillReceiveProps != "function" && typeof r.componentWillReceiveProps != "function" || (m !== G || D !== S) && y0(
        n,
        r,
        i,
        S
      ), In = !1, D = n.memoizedState, r.state = D, Eo(n, i, r, s), Ai();
      var U = n.memoizedState;
      m !== G || D !== U || In || l !== null && l.dependencies !== null && ve(l.dependencies) ? (typeof g == "function" && (_o(
        n,
        u,
        g,
        i
      ), U = n.memoizedState), (N = In || m0(
        n,
        u,
        N,
        i,
        D,
        U,
        S
      ) || l !== null && l.dependencies !== null && ve(l.dependencies)) ? (C || typeof r.UNSAFE_componentWillUpdate != "function" && typeof r.componentWillUpdate != "function" || (typeof r.componentWillUpdate == "function" && r.componentWillUpdate(i, U, S), typeof r.UNSAFE_componentWillUpdate == "function" && r.UNSAFE_componentWillUpdate(
        i,
        U,
        S
      )), typeof r.componentDidUpdate == "function" && (n.flags |= 4), typeof r.getSnapshotBeforeUpdate == "function" && (n.flags |= 1024)) : (typeof r.componentDidUpdate != "function" || m === l.memoizedProps && D === l.memoizedState || (n.flags |= 4), typeof r.getSnapshotBeforeUpdate != "function" || m === l.memoizedProps && D === l.memoizedState || (n.flags |= 1024), n.memoizedProps = i, n.memoizedState = U), r.props = i, r.state = U, r.context = S, i = N) : (typeof r.componentDidUpdate != "function" || m === l.memoizedProps && D === l.memoizedState || (n.flags |= 4), typeof r.getSnapshotBeforeUpdate != "function" || m === l.memoizedProps && D === l.memoizedState || (n.flags |= 1024), i = !1);
    }
    return r = i, Ho(l, n), i = (n.flags & 128) !== 0, r || i ? (r = n.stateNode, u = i && typeof u.getDerivedStateFromError != "function" ? null : r.render(), n.flags |= 1, l !== null && i ? (n.child = Ti(
      n,
      l.child,
      null,
      s
    ), n.child = Ti(
      n,
      null,
      u,
      s
    )) : _e(l, n, u, s), n.memoizedState = r.state, l = n.child) : l = Yu(
      l,
      n,
      s
    ), l;
  }
  function Ir(l, n, u, i) {
    return zc(), n.flags |= 256, _e(l, n, u, i), n.child;
  }
  var O0 = {
    dehydrated: null,
    treeContext: null,
    retryLane: 0,
    hydrationErrors: null
  };
  function kr(l) {
    return { baseLanes: l, cachePool: Ny() };
  }
  function D0(l, n, u) {
    return l = l !== null ? l.childLanes & ~u : 0, n && (l |= Ia), l;
  }
  function C0(l, n, u) {
    var i = n.pendingProps, s = !1, r = (n.flags & 128) !== 0, m;
    if ((m = r) || (m = l !== null && l.memoizedState === null ? !1 : (tl.current & 2) !== 0), m && (s = !0, n.flags &= -129), m = (n.flags & 32) !== 0, n.flags &= -33, l === null) {
      if (vt) {
        if (s ? Mc(n) : Pn(), (l = kt) ? (l = Sn(
          l,
          fn
        ), l = l !== null && l.data !== "&" ? l : null, l !== null && (n.memoizedState = {
          dehydrated: l,
          treeContext: wn !== null ? { id: Xn, overflow: Qn } : null,
          retryLane: 536870912,
          hydrationErrors: null
        }, u = Hl(l), u.return = n, n.child = u, Ge = n, kt = null)) : l = null, l === null) throw Ec(n);
        return Dd(l) ? n.lanes = 32 : n.lanes = 536870912, null;
      }
      return r = i.children, i = i.fallback, s ? (Pn(), s = n.mode, r = Aa(
        { mode: "hidden", children: r },
        s
      ), i = vi(
        i,
        s,
        u,
        null
      ), r.return = n, i.return = n, r.sibling = i, n.child = r, i = n.child, i.memoizedState = kr(u), i.childLanes = D0(
        l,
        m,
        u
      ), n.memoizedState = O0, No(null, i)) : (Mc(n), R0(n, r));
    }
    var g = l.memoizedState;
    if (g !== null) {
      var S = g.dehydrated;
      if (S !== null)
        return ep(
          l,
          n,
          r,
          m,
          i,
          S,
          g,
          u
        );
    }
    return s ? (Pn(), s = i.fallback, r = n.mode, g = l.child, S = g.sibling, i = Uu(g, {
      mode: "hidden",
      children: i.children
    }), i.subtreeFlags = g.subtreeFlags & 1206910976, S !== null ? s = Uu(S, s) : (s = vi(
      s,
      r,
      u,
      null
    ), s.flags |= 2), s.return = n, i.return = n, i.sibling = s, n.child = i, No(null, i), i = n.child, s = l.child.memoizedState, s === null ? s = kr(u) : (r = s.cachePool, r !== null ? (g = Ce._currentValue, r = r.parent !== g ? { parent: g, pool: g } : r) : r = Ny(), s = {
      baseLanes: s.baseLanes | u,
      cachePool: r
    }), i.memoizedState = s, i.childLanes = D0(
      l,
      m,
      u
    ), n.memoizedState = O0, No(l.child, i)) : (Mc(n), u = l.child, l = u.sibling, u = Uu(u, {
      mode: "visible",
      children: i.children
    }), u.return = n, u.sibling = null, l !== null && (m = n.deletions, m === null ? (n.deletions = [l], n.flags |= 16) : m.push(l)), n.child = u, n.memoizedState = null, u);
  }
  function R0(l, n) {
    return n = Aa(
      { mode: "visible", children: n },
      l.mode
    ), n.return = l, l.child = n;
  }
  function Aa(l, n) {
    return l = Pl(22, l, null, n), l.lanes = 0, l;
  }
  function Pr(l, n, u) {
    return Ti(n, l.child, null, u), l = R0(
      n,
      n.pendingProps.children
    ), l.flags |= 2, n.memoizedState = null, l;
  }
  function ep(l, n, u, i, s, r, m, g) {
    if (u)
      return n.flags & 256 ? (Mc(n), n.flags &= -257, Pr(
        l,
        n,
        g
      )) : n.memoizedState !== null ? (Pn(), n.child = l.child, n.flags |= 128, null) : (Pn(), r = s.fallback, m = n.mode, s = Aa(
        { mode: "visible", children: s.children },
        m
      ), r = vi(
        r,
        m,
        g,
        null
      ), r.flags |= 2, s.return = n, r.return = n, s.sibling = r, n.child = s, Ti(n, l.child, null, g), s = n.child, s.memoizedState = kr(g), s.childLanes = D0(
        l,
        i,
        g
      ), n.memoizedState = O0, No(null, s));
    if (Mc(n), Dd(r)) {
      if (i = r.nextSibling && r.nextSibling.dataset, i) var S = i.dgst;
      return i = S, i !== "" && (s = Error(q(419)), s.stack = "", s.digest = i, sn({ value: s, source: null, stack: null })), Pr(
        l,
        n,
        g
      );
    }
    if (ae || Hu(l, n, g, !1), i = (g & l.childLanes) !== 0, ae || i) {
      if (kn.current !== null)
        return Pr(
          l,
          n,
          g
        );
      if (i = ce, i !== null && (s = g1(
        i,
        g
      ), s !== 0 && s !== m.retryLane))
        throw m.retryLane = s, yi(l, s), Ma(i, l, s), S0;
      return Es(r) || K0(), Pr(
        l,
        n,
        g
      );
    }
    return Es(r) ? (n.flags |= 192, n.child = l.child, null) : (l = m.treeContext, kt = ra(r.nextSibling), Ge = n, vt = !0, Tc = null, fn = !1, l !== null && Gf(n, l), n = R0(
      n,
      s.children
    ), n.flags |= 134221824, n);
  }
  function cv(l, n, u) {
    l.lanes |= n;
    var i = l.alternate;
    i !== null && (i.lanes |= n), w(l.return, n, u);
  }
  function lp(l) {
    for (var n = null; l !== null; ) {
      var u = l.alternate;
      u !== null && Jf(u) === null && (n = l), l = l.sibling;
    }
    return n;
  }
  function Bo(l, n, u, i, s, r) {
    var m = l.memoizedState;
    m === null ? l.memoizedState = {
      isBackwards: n,
      rendering: null,
      renderingStartTime: 0,
      last: i,
      tail: u,
      tailMode: s,
      treeForkCount: r
    } : (m.isBackwards = n, m.rendering = null, m.renderingStartTime = 0, m.last = i, m.tail = u, m.tailMode = s, m.treeForkCount = r);
  }
  function El(l) {
    var n = l.child;
    for (l.child = null; n !== null; ) {
      var u = n.sibling;
      n.sibling = l.child, l.child = n, n = u;
    }
  }
  function M0(l, n, u) {
    var i = n.pendingProps, s = i.revealOrder, r = i.tail;
    i = i.children;
    var m = tl.current;
    if (n.flags & 128)
      return Lf(n, m), null;
    var g = (m & 2) !== 0;
    if (g ? (m = m & 1 | 2, n.flags |= 128) : m &= 1, Lf(n, m), s === "backwards" && l !== null ? (El(l), _e(l, n, i, u), El(l)) : _e(l, n, i, u), i = vt ? qf : 0, !g && l !== null && (l.flags & 128) !== 0)
      t: for (l = n.child; l !== null; ) {
        if (l.tag === 13)
          l.memoizedState !== null && cv(l, u, n);
        else if (l.tag === 19)
          cv(l, u, n);
        else if (l.child !== null) {
          l.child.return = l, l = l.child;
          continue;
        }
        if (l === n) break t;
        for (; l.sibling === null; ) {
          if (l.return === null || l.return === n)
            break t;
          l = l.return;
        }
        l.sibling.return = l.return, l = l.sibling;
      }
    switch (s) {
      case "backwards":
        u = lp(n.child), u === null ? (s = n.child, n.child = null) : (s = u.sibling, u.sibling = null, El(n)), Bo(
          n,
          !0,
          s,
          null,
          r,
          i
        );
        break;
      case "unstable_legacy-backwards":
        for (u = null, s = n.child, n.child = null; s !== null; ) {
          if (l = s.alternate, l !== null && Jf(l) === null) {
            n.child = s;
            break;
          }
          l = s.sibling, s.sibling = u, u = s, s = l;
        }
        Bo(
          n,
          !0,
          u,
          null,
          r,
          i
        );
        break;
      case "together":
        Bo(
          n,
          !1,
          null,
          null,
          void 0,
          i
        );
        break;
      case "independent":
        n.memoizedState = null;
        break;
      default:
        u = lp(n.child), u === null ? (s = n.child, n.child = null) : (s = u.sibling, u.sibling = null), Bo(
          n,
          !1,
          s,
          u,
          r,
          i
        );
    }
    return n.child;
  }
  function xl(l, n, u) {
    var i = n.pendingProps;
    return $n(n, n.type, i.value), _e(l, n, i.children, u), n.child;
  }
  function Yu(l, n, u) {
    if (l !== null && (n.dependencies = l.dependencies), qt |= n.lanes, (u & n.childLanes) === 0)
      if (l !== null) {
        if (Hu(
          l,
          n,
          u,
          !1
        ), (u & n.childLanes) === 0)
          return null;
      } else return null;
    if (l !== null && n.child !== l.child)
      throw Error(q(153));
    if (n.child !== null) {
      for (l = n.child, u = Uu(l, l.pendingProps), n.child = u, u.return = n; l.sibling !== null; )
        l = l.sibling, u = u.sibling = Uu(l, l.pendingProps), u.return = n;
      u.sibling = null;
    }
    return n.child;
  }
  function Di(l, n) {
    return (l.lanes & n) !== 0 ? !0 : (l = l.dependencies, !!(l !== null && ve(l)));
  }
  function ap(l, n, u) {
    switch (n.tag) {
      case 3:
        gf(n, n.stateNode.containerInfo), $n(n, Ce, l.memoizedState.cache), zc();
        break;
      case 27:
      case 5:
        pf(n);
        break;
      case 4:
        gf(n, n.stateNode.containerInfo);
        break;
      case 10:
        $n(
          n,
          n.type,
          n.memoizedProps.value
        );
        break;
      case 31:
        if (n.memoizedState !== null)
          return n.flags |= 128, Yr(n), null;
        break;
      case 13:
        var i = n.memoizedState;
        if (i !== null) {
          if (i.dehydrated !== null)
            return Mc(n), n.flags |= 128, null;
          i = Hu(
            l,
            n,
            u,
            !1
          );
          var s = n.child.childLanes;
          return i || (u & s) !== 0 ? C0(l, n, u) : (Mc(n), l = Yu(
            l,
            n,
            u
          ), l !== null ? l.sibling : null);
        }
        Mc(n);
        break;
      case 19:
        if (n.flags & 128)
          return M0(
            l,
            n,
            u
          );
        if (s = (l.flags & 128) !== 0, i = (u & n.childLanes) !== 0, i || (Hu(
          l,
          n,
          u,
          !1
        ), i = (u & n.childLanes) !== 0), s) {
          if (i)
            return M0(
              l,
              n,
              u
            );
          n.flags |= 128;
        }
        if (s = n.memoizedState, s !== null && (s.rendering = null, s.tail = null, s.lastEffect = null), Lf(n, tl.current), i) break;
        return null;
      case 22:
        return n.lanes = 0, nv(
          l,
          n,
          u,
          n.pendingProps
        );
      case 24:
        $n(n, Ce, l.memoizedState.cache);
    }
    return Yu(l, n, u);
  }
  function dn(l, n, u) {
    if (l !== null)
      if (l.memoizedProps !== n.pendingProps)
        ae = !0;
      else {
        if (!Di(l, u) && (n.flags & 128) === 0)
          return ae = !1, ap(
            l,
            n,
            u
          );
        ae = (l.flags & 131072) !== 0;
      }
    else
      ae = !1, vt && (n.flags & 1048576) !== 0 && jh(n, qf, n.index);
    switch (n.lanes = 0, n.tag) {
      case 16:
        t: {
          var i = n.pendingProps;
          if (l = bi(n.elementType), n.type = l, typeof l == "function")
            Gh(l) ? (i = Bc(l, i), n.tag = 1, n = tp(
              null,
              n,
              l,
              i,
              u
            )) : (n.tag = 0, n = A0(
              null,
              n,
              l,
              i,
              u
            ));
          else {
            if (l != null) {
              var s = l.$$typeof;
              if (s === Y) {
                n.tag = 11, n = b0(
                  null,
                  n,
                  l,
                  i,
                  u
                );
                break t;
              } else if (s === P) {
                n.tag = 14, n = T0(
                  null,
                  n,
                  l,
                  i,
                  u
                );
                break t;
              } else if (s === Rl) {
                n.tag = 10, n.type = l, n = xl(
                  null,
                  n,
                  u
                );
                break t;
              }
            }
            throw n = ks(l) || l, Error(q(306, n, ""));
          }
        }
        return n;
      case 0:
        return A0(
          l,
          n,
          n.type,
          n.pendingProps,
          u
        );
      case 1:
        return i = n.type, s = Bc(
          i,
          n.pendingProps
        ), tp(
          l,
          n,
          i,
          s,
          u
        );
      case 3:
        t: {
          if (gf(
            n,
            n.stateNode.containerInfo
          ), l === null) throw Error(q(387));
          i = n.pendingProps;
          var r = n.memoizedState;
          s = r.element, Nr(l, n), Eo(n, i, null, u);
          var m = n.memoizedState;
          if (i = m.cache, $n(n, Ce, i), i !== r.cache && gi(
            n,
            [Ce],
            u,
            !0
          ), Ai(), i = m.element, r.isDehydrated)
            if (r = {
              element: i,
              isDehydrated: !1,
              cache: m.cache
            }, n.updateQueue.baseState = r, n.memoizedState = r, n.flags & 256) {
              n = Ir(
                l,
                n,
                i,
                u
              );
              break t;
            } else if (i !== s) {
              s = ta(
                Error(q(424)),
                n
              ), sn(s), n = Ir(
                l,
                n,
                i,
                u
              );
              break t;
            } else
              for (l = n.stateNode.containerInfo, l.nodeType === 9 ? l = l.body : l = l.nodeName === "HTML" ? l.ownerDocument.body : l, kt = ra(l.firstChild), Ge = n, vt = !0, Tc = null, fn = !0, u = w1(
                n,
                null,
                i,
                u
              ), n.child = u; u; )
                u.flags = u.flags & -3 | 134221824, u = u.sibling;
          else {
            if (zc(), i === s) {
              n = Yu(
                l,
                n,
                u
              );
              break t;
            }
            _e(l, n, i, u);
          }
          n = n.child;
        }
        return n;
      case 26:
        return Ho(l, n), l === null ? (u = ug(
          n.type,
          null,
          n.pendingProps,
          null
        )) ? n.memoizedState = u : vt || (n.stateNode = vs(
          n.type,
          n.pendingProps,
          ti.current,
          n
        )) : n.memoizedState = ug(
          n.type,
          l.memoizedProps,
          n.pendingProps,
          l.memoizedState
        ), null;
      case 27:
        return pf(n), l === null && vt && (i = n.stateNode = Qp(
          n.type,
          n.pendingProps,
          ti.current
        ), Ge = n, fn = !0, s = kt, Gc(n.type) ? (Vl = s, kt = ra(i.firstChild)) : kt = s), _e(
          l,
          n,
          n.pendingProps.children,
          u
        ), Ho(l, n), l === null && (n.flags |= 4194304), n.child;
      case 5:
        return l === null && vt && ((s = i = kt) && (i = Iv(
          i,
          n.type,
          n.pendingProps,
          fn
        ), i !== null ? (n.stateNode = i, Ge = n, kt = ra(i.firstChild), fn = !1, s = !0) : s = !1), s || Ec(n)), pf(n), s = n.type, r = n.pendingProps, m = l !== null ? l.memoizedProps : null, i = r.children, wv(s, r) ? i = null : m !== null && wv(s, m) && (n.flags |= 32), n.memoizedState !== null && (s = Gr(
          l,
          n,
          X1,
          null,
          null,
          u
        ), $e._currentValue = s), Ho(l, n), _e(l, n, i, u), n.child;
      case 6:
        return l === null && vt && ((l = u = kt) && (u = kv(
          u,
          n.pendingProps,
          fn
        ), u !== null ? (n.stateNode = u, Ge = n, kt = null, l = !0) : l = !1), l || Ec(n)), null;
      case 13:
        return C0(l, n, u);
      case 4:
        return gf(
          n,
          n.stateNode.containerInfo
        ), i = n.pendingProps, l === null ? n.child = Ti(
          n,
          null,
          i,
          u
        ) : _e(l, n, i, u), n.child;
      case 11:
        return b0(
          l,
          n,
          n.type,
          n.pendingProps,
          u
        );
      case 7:
        return i = n.pendingProps, Ho(l, n), _e(l, n, i, u), n.child;
      case 8:
        return _e(
          l,
          n,
          n.pendingProps.children,
          u
        ), n.child;
      case 12:
        return _e(
          l,
          n,
          n.pendingProps.children,
          u
        ), n.child;
      case 10:
        return xl(l, n, u);
      case 9:
        return s = n.type._context, i = n.pendingProps.children, Ac(n), s = ke(s), i = i(s), n.flags |= 1, _e(l, n, i, u), n.child;
      case 14:
        return T0(
          l,
          n,
          n.type,
          n.pendingProps,
          u
        );
      case 15:
        return E0(
          l,
          n,
          n.type,
          n.pendingProps,
          u
        );
      case 19:
        return M0(l, n, u);
      case 31:
        return P1(l, n, u);
      case 22:
        return nv(
          l,
          n,
          u,
          n.pendingProps
        );
      case 24:
        return Ac(n), i = ke(Ce), l === null ? (s = Lh(), s === null && (s = ce, r = bl(), s.pooledCache = r, r.refCount++, r !== null && (s.pooledCacheLanes |= u), s = r), n.memoizedState = { parent: i, cache: s }, Ei(n), $n(n, Ce, s)) : ((l.lanes & u) !== 0 && (Nr(l, n), Eo(n, null, null, u), Ai()), s = l.memoizedState, r = n.memoizedState, s.parent !== i ? (s = { parent: i, cache: i }, n.memoizedState = s, n.lanes === 0 && (n.memoizedState = n.updateQueue.baseState = s), $n(n, Ce, i)) : (i = r.cache, $n(n, Ce, i), i !== s.cache && gi(
          n,
          [Ce],
          u,
          !0
        ))), _e(
          l,
          n,
          n.pendingProps.children,
          u
        ), n.child;
      case 30:
        return n.stateNode === null && (n.stateNode = {
          autoName: null,
          paired: null,
          clones: null,
          ref: null
        }), i = n.pendingProps, i.name != null && i.name !== "auto" ? n.flags |= l === null ? 18882560 : 18874368 : vt && Ln(n), l !== null && l.memoizedProps.name !== i.name ? n.flags |= 4194816 : Ho(l, n), _e(l, n, i.children, u), n.child;
      case 29:
        throw n.pendingProps;
    }
    throw Error(q(156, n.tag));
  }
  function qu(l) {
    l.flags |= 4;
  }
  function Gu(l, n, u, i, s) {
    var r;
    if ((r = (l.mode & 32) !== 0) && (r = u === null ? Ue(n, i) : Ue(n, i) && (i.src !== u.src || i.srcSet !== u.srcSet)), r) {
      if (l.flags |= 16777216, (s & 335544128) === s)
        if (l.stateNode.complete) l.flags |= 8192;
        else if (hp()) l.flags |= 8192;
        else
          throw So = Xf, Mr;
    } else l.flags &= -16777217;
  }
  function iv(l, n) {
    if (n.type !== "stylesheet" || (n.state.loading & 4) !== 0)
      l.flags &= -16777217;
    else if (l.flags |= 16777216, !$p(n))
      if (hp()) l.flags |= 8192;
      else
        throw So = Xf, Mr;
  }
  function aa(l, n) {
    n !== null && (l.flags |= 4), l.flags & 16384 && (n = l.tag !== 22 ? ey() : 536870912, l.lanes |= n, wo |= n);
  }
  function xo(l, n) {
    if (!vt)
      switch (l.tailMode) {
        case "visible":
          break;
        case "collapsed":
          for (var u = l.tail, i = null; u !== null; )
            u.alternate !== null && (i = u), u = u.sibling;
          i === null ? n || l.tail === null ? l.tail = null : l.tail.sibling = null : i.sibling = null;
          break;
        default:
          for (n = l.tail, u = null; n !== null; )
            n.alternate !== null && (u = n), n = n.sibling;
          u === null ? l.tail = null : u.sibling = null;
      }
  }
  function ue(l) {
    var n = l.alternate !== null && l.alternate.child === l.child, u = 0, i = 0;
    if (n)
      for (var s = l.child; s !== null; )
        u |= s.lanes | s.childLanes, i |= s.subtreeFlags & 1206910976, i |= s.flags & 1206910976, s.return = l, s = s.sibling;
    else
      for (s = l.child; s !== null; )
        u |= s.lanes | s.childLanes, i |= s.subtreeFlags, i |= s.flags, s.return = l, s = s.sibling;
    return l.subtreeFlags |= i, l.childLanes = u, n;
  }
  function hn(l, n, u) {
    var i = n.pendingProps;
    switch (Nu(n), n.tag) {
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return ue(n), null;
      case 1:
        return ue(n), null;
      case 3:
        return u = n.stateNode, i = null, l !== null && (i = l.memoizedState.cache), n.memoizedState.cache !== i && (n.flags |= 2048), st(Ce), uc(), u.pendingContext && (u.context = u.pendingContext, u.pendingContext = null), (l === null || l.child === null) && (Fa(n) ? qu(n) : l === null || l.memoizedState.isDehydrated && (n.flags & 256) === 0 || (n.flags |= 1024, Qh())), ue(n), null;
      case 26:
        var s = n.type, r = n.memoizedState;
        return l === null ? (qu(n), r !== null ? (ue(n), iv(n, r)) : (ue(n), Gu(
          n,
          s,
          null,
          i,
          u
        ))) : r ? r !== l.memoizedState ? (qu(n), ue(n), iv(n, r)) : (ue(n), n.flags &= -16777217) : (l = l.memoizedProps, l !== i && qu(n), ue(n), Gu(
          n,
          s,
          l,
          i,
          u
        )), null;
      case 27:
        if (ei(n), u = ti.current, s = n.type, l !== null && n.stateNode != null)
          l.memoizedProps !== i && qu(n);
        else {
          if (!i) {
            if (n.stateNode === null)
              throw Error(q(166));
            return ue(n), n.subtreeFlags &= -33554433, null;
          }
          l = Nn.current, Fa(n) ? Xh(n) : (l = Qp(s, i, u), n.stateNode = l, qu(n));
        }
        return ue(n), n.subtreeFlags &= -33554433, null;
      case 5:
        if (ei(n), s = n.type, l !== null && n.stateNode != null)
          l.memoizedProps !== i && qu(n);
        else {
          if (!i) {
            if (n.stateNode === null)
              throw Error(q(166));
            return ue(n), n.subtreeFlags &= -33554433, null;
          }
          if (r = Nn.current, Fa(n))
            Xh(n);
          else {
            var m = Ed(
              ti.current
            );
            switch (r) {
              case 1:
                r = m.createElementNS(
                  "http://www.w3.org/2000/svg",
                  s
                );
                break;
              case 2:
                r = m.createElementNS(
                  "http://www.w3.org/1998/Math/MathML",
                  s
                );
                break;
              default:
                switch (s) {
                  case "svg":
                    r = m.createElementNS(
                      "http://www.w3.org/2000/svg",
                      s
                    );
                    break;
                  case "math":
                    r = m.createElementNS(
                      "http://www.w3.org/1998/Math/MathML",
                      s
                    );
                    break;
                  case "script":
                    r = m.createElement("div"), r.innerHTML = "<script><\/script>", r = r.removeChild(
                      r.firstChild
                    );
                    break;
                  case "select":
                    r = typeof i.is == "string" ? m.createElement("select", {
                      is: i.is
                    }) : m.createElement("select"), i.multiple ? r.multiple = !0 : i.size && (r.size = i.size);
                    break;
                  default:
                    r = typeof i.is == "string" ? m.createElement(s, { is: i.is }) : m.createElement(s);
                }
            }
            r[ul] = n, r[_l] = i;
            t: for (m = n.child; m !== null; ) {
              if (m.tag === 5 || m.tag === 6)
                r.appendChild(m.stateNode);
              else if (m.tag !== 4 && m.tag !== 27 && m.child !== null) {
                m.child.return = m, m = m.child;
                continue;
              }
              if (m === n) break t;
              for (; m.sibling === null; ) {
                if (m.return === null || m.return === n)
                  break t;
                m = m.return;
              }
              m.sibling.return = m.return, m = m.sibling;
            }
            n.stateNode = r;
            t: switch (fl(r, s, i), s) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                i = !!i.autoFocus;
                break t;
              case "img":
                i = !0;
                break t;
              default:
                i = !1;
            }
            i && qu(n);
          }
        }
        return ue(n), n.subtreeFlags &= -33554433, Gu(
          n,
          n.type,
          l === null ? null : l.memoizedProps,
          n.pendingProps,
          u
        ), null;
      case 6:
        if (l && n.stateNode != null)
          l.memoizedProps !== i && qu(n);
        else {
          if (typeof i != "string" && n.stateNode === null)
            throw Error(q(166));
          if (l = ti.current, Fa(n)) {
            if (l = n.stateNode, u = n.memoizedProps, i = null, s = Ge, s !== null)
              switch (s.tag) {
                case 27:
                case 5:
                  i = s.memoizedProps;
              }
            l[ul] = n, l = !!(l.nodeValue === u || i !== null && i.suppressHydrationWarning === !0 || bd(l.nodeValue, u)), l || Ec(n, !0);
          } else
            l = Ed(l).createTextNode(
              i
            ), l[ul] = n, n.stateNode = l;
        }
        return ue(n), null;
      case 31:
        if (u = n.memoizedState, l === null || l.memoizedState !== null) {
          if (i = Fa(n), u !== null) {
            if (l === null) {
              if (!i) throw Error(q(318));
              if (l = n.memoizedState, l = l !== null ? l.dehydrated : null, !l) throw Error(q(557));
              l[ul] = n;
            } else
              zc(), (n.flags & 128) === 0 && (n.memoizedState = null), n.flags |= 4;
            ue(n), l = !1;
          } else
            u = Qh(), l !== null && l.memoizedState !== null && (l.memoizedState.hydrationErrors = u), l = !0;
          if (!l)
            return n.flags & 256 ? (za(n), n) : (za(n), null);
          if ((n.flags & 128) !== 0)
            throw Error(q(558));
        }
        return ue(n), null;
      case 13:
        if (i = n.memoizedState, l === null || l.memoizedState !== null && l.memoizedState.dehydrated !== null) {
          if (s = Fa(n), i !== null && i.dehydrated !== null) {
            if (l === null) {
              if (!s) throw Error(q(318));
              if (s = n.memoizedState, s = s !== null ? s.dehydrated : null, !s) throw Error(q(317));
              s[ul] = n;
            } else
              zc(), (n.flags & 128) === 0 && (n.memoizedState = null), n.flags |= 4;
            ue(n), s = !1;
          } else
            s = Qh(), l !== null && l.memoizedState !== null && (l.memoizedState.hydrationErrors = s), s = !0;
          if (!s)
            return n.flags & 256 ? (za(n), n) : (za(n), null);
        }
        return za(n), (n.flags & 128) !== 0 ? (n.lanes = u, n) : (u = i !== null, l = l !== null && l.memoizedState !== null, u && (i = n.child, s = null, i.alternate !== null && i.alternate.memoizedState !== null && i.alternate.memoizedState.cachePool !== null && (s = i.alternate.memoizedState.cachePool.pool), r = null, i.memoizedState !== null && i.memoizedState.cachePool !== null && (r = i.memoizedState.cachePool.pool), r !== s && (i.flags |= 2048)), u !== l && u && (n.child.flags |= 8192), aa(n, n.updateQueue), ue(n), null);
      case 4:
        return uc(), l === null && em(n.stateNode.containerInfo), n.flags |= 67108864, ue(n), null;
      case 10:
        return st(n.type), ue(n), null;
      case 19:
        if (Kh(n), i = n.memoizedState, i === null) return ue(n), null;
        if (s = (n.flags & 128) !== 0, r = i.rendering, r === null)
          if (s) xo(i, !1);
          else {
            if (ze !== 0 || l !== null && (l.flags & 128) !== 0)
              for (l = n.child; l !== null; ) {
                if (r = Jf(l), r !== null) {
                  for (n.flags |= 128, xo(i, !1), l = r.updateQueue, n.updateQueue = l, aa(n, l), n.subtreeFlags = 0, l = u, u = n.child; u !== null; )
                    bc(u, l), u = u.sibling;
                  return Lf(
                    n,
                    tl.current & 1 | 2
                  ), vt && Zn(n, i.treeForkCount), n.child;
                }
                l = l.sibling;
              }
            i.tail !== null && $l() > hd && (n.flags |= 128, s = !0, xo(i, !1), n.lanes = 4194304);
          }
        else {
          if (!s)
            if (l = Jf(r), l !== null) {
              if (n.flags |= 128, s = !0, l = l.updateQueue, n.updateQueue = l, aa(n, l), xo(i, !0), i.tail === null && i.tailMode !== "collapsed" && i.tailMode !== "visible" && !r.alternate && !vt)
                return ue(n), null;
            } else
              2 * $l() - i.renderingStartTime > hd && u !== 536870912 && (n.flags |= 128, s = !0, xo(i, !1), n.lanes = 4194304);
          i.isBackwards ? (r.sibling = n.child, n.child = r) : (l = i.last, l !== null ? l.sibling = r : n.child = r, i.last = r);
        }
        if (i.tail !== null) {
          l = i.tail;
          t: {
            for (u = l; u !== null; ) {
              if (u.alternate !== null) {
                u = !1;
                break t;
              }
              u = u.sibling;
            }
            u = !0;
          }
          return i.rendering = l, i.tail = l.sibling, i.renderingStartTime = $l(), l.sibling = null, r = tl.current, r = s ? r & 1 | 2 : r & 1, i.tailMode === "visible" || i.tailMode === "collapsed" || !u || vt ? Lf(n, r) : (u = r, fe(Pe, n), fe(tl, u), Tl === null && (Tl = n)), vt && Zn(n, i.treeForkCount), l;
        }
        return ue(n), null;
      case 22:
      case 23:
        return za(n), Zf(), i = n.memoizedState !== null, l !== null ? l.memoizedState !== null !== i && (n.flags |= 8192) : i && (n.flags |= 8192), i ? (u & 536870912) !== 0 && (n.flags & 128) === 0 && (ue(n), n.subtreeFlags & 6 && (n.flags |= 8192)) : ue(n), u = n.updateQueue, u !== null && aa(n, u.retryQueue), u = null, l !== null && l.memoizedState !== null && l.memoizedState.cachePool !== null && (u = l.memoizedState.cachePool.pool), i = null, n.memoizedState !== null && n.memoizedState.cachePool !== null && (i = n.memoizedState.cachePool.pool), i !== u && (n.flags |= 2048), l !== null && gl(Si), null;
      case 24:
        return u = null, l !== null && (u = l.memoizedState.cache), n.memoizedState.cache !== u && (n.flags |= 2048), st(Ce), ue(n), null;
      case 25:
        return null;
      case 30:
        return n.flags |= 33554432, ue(n), null;
    }
    throw Error(q(156, n.tag));
  }
  function np(l, n) {
    switch (Nu(n), n.tag) {
      case 1:
        return l = n.flags, l & 65536 ? (n.flags = l & -65537 | 128, n) : null;
      case 3:
        return st(Ce), uc(), l = n.flags, (l & 65536) !== 0 && (l & 128) === 0 ? (n.flags = l & -65537 | 128, n) : null;
      case 26:
      case 27:
      case 5:
        return ei(n), null;
      case 31:
        if (n.memoizedState !== null) {
          if (za(n), n.alternate === null)
            throw Error(q(340));
          zc();
        }
        return l = n.flags, l & 65536 ? (n.flags = l & -65537 | 128, n) : null;
      case 13:
        if (za(n), l = n.memoizedState, l !== null && l.dehydrated !== null) {
          if (n.alternate === null)
            throw Error(q(340));
          zc();
        }
        return l = n.flags, l & 65536 ? (n.flags = l & -65537 | 128, n) : null;
      case 19:
        return Kh(n), l = n.flags, l & 65536 ? (n.flags = l & -65537 | 128, l = n.memoizedState, l !== null && (l.rendering = null, l.tail = null), n.flags |= 4, n) : null;
      case 4:
        return uc(), null;
      case 10:
        return st(n.type), null;
      case 22:
      case 23:
        return za(n), Zf(), l !== null && gl(Si), l = n.flags, l & 65536 ? (n.flags = l & -65537 | 128, n) : null;
      case 24:
        return st(Ce), null;
      case 25:
        return null;
      default:
        return null;
    }
  }
  function Yo(l, n) {
    switch (Nu(n), n.tag) {
      case 3:
        st(Ce), uc();
        break;
      case 26:
      case 27:
      case 5:
        ei(n);
        break;
      case 4:
        uc();
        break;
      case 31:
        n.memoizedState !== null && za(n);
        break;
      case 13:
        za(n);
        break;
      case 19:
        Kh(n);
        break;
      case 10:
        st(n.type);
        break;
      case 22:
      case 23:
        za(n), Zf(), l !== null && gl(Si);
        break;
      case 24:
        st(Ce);
    }
  }
  function ts(l, n) {
    try {
      var u = n.updateQueue, i = u !== null ? u.lastEffect : null;
      if (i !== null) {
        var s = i.next;
        u = s;
        do {
          if ((u.tag & l) === l) {
            i = void 0;
            var r = u.create, m = u.inst;
            i = r(), m.destroy = i;
          }
          u = u.next;
        } while (u !== s);
      }
    } catch (g) {
      $t(n, n.return, g);
    }
  }
  function mn(l, n, u) {
    try {
      var i = n.updateQueue, s = i !== null ? i.lastEffect : null;
      if (s !== null) {
        var r = s.next;
        i = r;
        do {
          if ((i.tag & l) === l) {
            var m = i.inst, g = m.destroy;
            if (g !== void 0) {
              m.destroy = void 0, s = n;
              var S = u, C = g;
              try {
                C();
              } catch (N) {
                $t(
                  s,
                  S,
                  N
                );
              }
            }
          }
          i = i.next;
        } while (i !== r);
      }
    } catch (N) {
      $t(n, n.return, N);
    }
  }
  function Ci(l) {
    var n = l.updateQueue;
    if (n !== null) {
      var u = l.stateNode;
      try {
        Jh(n, u);
      } catch (i) {
        $t(l, l.return, i);
      }
    }
  }
  function ov(l, n, u) {
    u.props = Bc(
      l.type,
      l.memoizedProps
    ), u.state = l.memoizedState;
    try {
      u.componentWillUnmount();
    } catch (i) {
      $t(l, n, i);
    }
  }
  function eu(l, n) {
    try {
      var u = l.ref;
      if (u !== null) {
        switch (l.tag) {
          case 26:
          case 27:
          case 5:
            var i = l.stateNode;
            break;
          case 30:
            var s = l.stateNode, r = cl(l.memoizedProps, s);
            (s.ref === null || s.ref.name !== r) && (s.ref = Vp(r)), i = s.ref;
            break;
          case 7:
            if (l.stateNode === null) {
              var m = new Ua(l);
              Yt(
                l.child,
                !1,
                Tb,
                m,
                void 0,
                void 0
              ), l.stateNode = m;
            }
            i = l.stateNode;
            break;
          default:
            i = l.stateNode;
        }
        typeof u == "function" ? l.refCleanup = u(i) : u.current = i;
      }
    } catch (g) {
      $t(l, n, g);
    }
  }
  function je(l, n) {
    var u = l.ref, i = l.refCleanup;
    if (u !== null)
      if (typeof i == "function")
        try {
          i();
        } catch (s) {
          $t(l, n, s);
        } finally {
          l.refCleanup = null, l = l.alternate, l != null && (l.refCleanup = null);
        }
      else if (typeof u == "function")
        try {
          u(null);
        } catch (s) {
          $t(l, n, s);
        }
      else u.current = null;
  }
  function td(l, n) {
    if ((l.tag === 5 || l.tag === 27 || l.tag === 6) && l.alternate === null && n !== null)
      for (var u = 0; u < n.length; u++)
        Fo(
          l.stateNode,
          n[u]
        );
  }
  function ed(l) {
    for (var n = l.return; n !== null && (fv(n) && Fo(l.stateNode, n.stateNode), !_0(n)); )
      n = n.return;
  }
  function es(l) {
    for (var n = l.return; n !== null && (fv(n) && bs(l.stateNode, n.stateNode), !_0(n)); )
      n = n.return;
  }
  function _0(l) {
    return l.tag === 5 || l.tag === 3 || l.tag === 27;
  }
  function fv(l) {
    return l && l.tag === 7 && l.stateNode !== null;
  }
  function U0(l) {
    var n = l.type, u = l.memoizedProps, i = l.stateNode;
    try {
      t: switch (n) {
        case "button":
        case "input":
        case "select":
        case "textarea":
          u.autoFocus && i.focus();
          break t;
        case "img":
          u.src ? i.src = u.src : u.srcSet && (i.srcset = u.srcSet);
      }
    } catch (s) {
      $t(l, l.return, s);
    }
  }
  function na(l, n, u) {
    try {
      var i = l.stateNode;
      pb(i, l.type, u, n), i[_l] = n;
    } catch (s) {
      $t(l, l.return, s);
    }
  }
  function sv(l) {
    return l.tag === 5 || l.tag === 3 || l.tag === 26 || l.tag === 27 && Gc(l.type) || l.tag === 4;
  }
  function Ri(l) {
    t: for (; ; ) {
      for (; l.sibling === null; ) {
        if (l.return === null || sv(l.return)) return null;
        l = l.return;
      }
      for (l.sibling.return = l.return, l = l.sibling; l.tag !== 5 && l.tag !== 6 && l.tag !== 18; ) {
        if (l.tag === 27 && Gc(l.type) || l.flags & 2 || l.child === null || l.tag === 4) continue t;
        l.child.return = l, l = l.child;
      }
      if (!(l.flags & 2)) return l.stateNode;
    }
  }
  function ge(l, n, u, i) {
    var s = l.tag;
    if (s === 5 || s === 6)
      s = l.stateNode, n ? (u.nodeType === 9 ? u.body : u.nodeName === "HTML" ? u.ownerDocument.body : u).insertBefore(s, n) : (n = u.nodeType === 9 ? u.body : u.nodeName === "HTML" ? u.ownerDocument.body : u, n.appendChild(s), u = u._reactRootContainer, u != null || n.onclick !== null || (n.onclick = Qa)), td(l, i), Vt = !0;
    else if (s !== 4 && (s === 27 && (td(l, i), i = null, Gc(l.type) && (u = l.stateNode, n = null)), l = l.child, l !== null))
      for (ge(
        l,
        n,
        u,
        i
      ), l = l.sibling; l !== null; )
        ge(
          l,
          n,
          u,
          i
        ), l = l.sibling;
  }
  function ld(l, n, u, i) {
    var s = l.tag;
    if (s === 5 || s === 6)
      s = l.stateNode, n ? u.insertBefore(s, n) : u.appendChild(s), td(l, i), Vt = !0;
    else if (s !== 4 && (s === 27 && (td(l, i), i = null, Gc(l.type) && (u = l.stateNode)), l = l.child, l !== null))
      for (ld(
        l,
        n,
        u,
        i
      ), l = l.sibling; l !== null; )
        ld(
          l,
          n,
          u,
          i
        ), l = l.sibling;
  }
  function rv(l) {
    var n = l.stateNode, u = l.memoizedProps;
    try {
      for (var i = l.type, s = n.attributes; s.length; )
        n.removeAttributeNode(s[0]);
      fl(n, i, u), n[ul] = l, n[_l] = u;
    } catch (r) {
      $t(l, l.return, r);
    }
  }
  var N0 = !1, Je = null;
  function qo(l) {
    (l.tag === 30 || (l.subtreeFlags & 33554432) !== 0) && (N0 = !0);
  }
  var yn = null;
  function Mi() {
    var l = yn;
    return yn = null, l;
  }
  var el = 0;
  function Go(l, n, u, i, s) {
    return el = 0, dv(
      l.child,
      n,
      u,
      i,
      s
    );
  }
  function dv(l, n, u, i, s) {
    for (var r = !1; l !== null; ) {
      if (l.tag === 5) {
        var m = l.stateNode;
        if (i !== null) {
          var g = zd(m);
          i.push(g), g.view && (r = !0);
        } else
          r || zd(m).view && (r = !0);
        N0 = !0, xp(
          m,
          el === 0 ? n : n + "_" + el,
          u
        ), el++;
      } else (l.tag !== 22 || l.memoizedState === null) && (l.tag === 30 && s || dv(
        l.child,
        n,
        u,
        i,
        s
      ) && (r = !0));
      l = l.sibling;
    }
    return r;
  }
  function lu(l, n) {
    for (; l !== null; )
      l.tag === 5 ? Yp(l.stateNode, l.memoizedProps) : (l.tag !== 22 || l.memoizedState === null) && (l.tag === 30 && n || lu(
        l.child,
        n
      )), l = l.sibling;
  }
  function ad(l) {
    if ((l.subtreeFlags & 18874368) !== 0)
      for (l = l.child; l !== null; ) {
        if ((l.tag !== 22 || l.memoizedState === null) && (ad(l), l.tag === 30 && (l.flags & 18874368) !== 0 && l.stateNode.paired)) {
          var n = l.memoizedProps;
          if (n.name == null || n.name === "auto")
            throw Error(q(544));
          var u = n.name;
          n = jn(n.default, n.share), n !== "none" && (Go(
            l,
            u,
            n,
            null,
            !1
          ) || lu(l.child, !1));
        }
        l = l.sibling;
      }
  }
  function ls(l, n) {
    if (l.tag === 30) {
      var u = l.stateNode, i = l.memoizedProps, s = cl(i, u), r = jn(
        i.default,
        u.paired ? i.share : i.enter
      );
      r !== "none" ? Go(l, s, r, null, !1) ? (ad(l), u.paired || n || ds(l, i.onEnter)) : lu(l.child, !1) : ad(l);
    } else if ((l.subtreeFlags & 33554432) !== 0)
      for (l = l.child; l !== null; )
        ls(l, n), l = l.sibling;
    else ad(l);
  }
  function as(l) {
    if (Je !== null && Je.size !== 0) {
      var n = Je;
      if ((l.subtreeFlags & 18874368) !== 0)
        for (l = l.child; l !== null; ) {
          if (l.tag !== 22 || l.memoizedState === null) {
            if (l.tag === 30 && (l.flags & 18874368) !== 0) {
              var u = l.memoizedProps, i = u.name;
              if (i != null && i !== "auto") {
                var s = n.get(i);
                if (s !== void 0) {
                  var r = jn(
                    u.default,
                    u.share
                  );
                  if (r !== "none" && (Go(
                    l,
                    i,
                    r,
                    null,
                    !1
                  ) ? (r = l.stateNode, s.paired = r, r.paired = s, ds(l, u.onShare)) : lu(l.child, !1)), n.delete(i), n.size === 0) break;
                }
              }
            }
            as(l);
          }
          l = l.sibling;
        }
    }
  }
  function nd(l) {
    if (l.tag === 30) {
      var n = l.memoizedProps, u = cl(n, l.stateNode), i = Je !== null ? Je.get(u) : void 0, s = jn(
        n.default,
        i !== void 0 ? n.share : n.exit
      );
      s !== "none" && (Go(l, u, s, null, !1) ? i !== void 0 ? (s = l.stateNode, i.paired = s, s.paired = i, Je.delete(u), ds(l, n.onShare)) : ds(l, n.onExit) : lu(l.child, !1)), Je !== null && as(l);
    } else if ((l.subtreeFlags & 33554432) !== 0)
      for (l = l.child; l !== null; )
        nd(l), l = l.sibling;
    else
      Je !== null && as(l);
  }
  function hv(l) {
    for (l = l.child; l !== null; ) {
      if (l.tag === 30) {
        var n = l.memoizedProps, u = cl(n, l.stateNode);
        n = jn(n.default, n.update), l.flags &= -5, n !== "none" && Go(
          l,
          u,
          n,
          l.memoizedState = [],
          !1
        );
      } else
        (l.subtreeFlags & 33554432) !== 0 && hv(l);
      l = l.sibling;
    }
  }
  function mv(l) {
    if ((l.subtreeFlags & 18874368) !== 0)
      for (l = l.child; l !== null; ) {
        if (l.tag !== 22 || l.memoizedState === null) {
          if (l.tag === 30 && (l.flags & 18874368) !== 0) {
            var n = l.stateNode;
            n.paired !== null && (n.paired = null, lu(l.child, !1));
          }
          mv(l);
        }
        l = l.sibling;
      }
  }
  function H0(l) {
    if (l.tag === 30)
      l.stateNode.paired = null, lu(l.child, !1), mv(l);
    else if ((l.subtreeFlags & 33554432) !== 0)
      for (l = l.child; l !== null; )
        H0(l), l = l.sibling;
    else mv(l);
  }
  function yv(l) {
    for (l = l.child; l !== null; )
      l.tag === 30 ? lu(l.child, !1) : (l.subtreeFlags & 33554432) !== 0 && yv(l), l = l.sibling;
  }
  function B0(l, n, u, i, s, r, m) {
    for (var g = !1; n !== null; ) {
      if (n.tag === 5) {
        var S = n.stateNode;
        if (r !== null && el < r.length) {
          var C = r[el], N = zd(S);
          (C.view || N.view) && (g = !0);
          var G;
          if (G = (l.flags & 4) === 0)
            if (N.clip) G = !0;
            else {
              G = C.rect;
              var D = N.rect;
              G = G.y !== D.y || G.x !== D.x || G.height !== D.height || G.width !== D.width;
            }
          G && (l.flags |= 4), N.abs ? N = !C.abs : (C = C.rect, N = N.rect, N = C.height !== N.height || C.width !== N.width), N && (l.flags |= 32);
        } else l.flags |= 32;
        (l.flags & 4) !== 0 && xp(
          S,
          el === 0 ? u : u + "_" + el,
          s
        ), g && (l.flags & 4) !== 0 || (yn === null && (yn = []), yn.push(
          S,
          el === 0 ? i : i + "_" + el,
          n.memoizedProps
        )), el++;
      } else (n.tag !== 22 || n.memoizedState === null) && (n.tag === 30 && m ? l.flags |= n.flags & 32 : B0(
        l,
        n.child,
        u,
        i,
        s,
        r,
        m
      ) && (g = !0));
      n = n.sibling;
    }
    return g;
  }
  function up(l, n) {
    for (l = l.child; l !== null; ) {
      if (l.tag === 30) {
        var u = l.memoizedProps, i = l.stateNode, s = cl(u, i), r = jn(u.default, u.update), m;
        m = l.memoizedState, l.memoizedState = null, i = l;
        var g = l.child;
        el = 0, s = B0(
          i,
          g,
          s,
          s,
          r,
          m,
          !1
        ), (l.flags & 4) !== 0 && s && ds(l, u.onUpdate);
      } else
        (l.subtreeFlags & 33554432) !== 0 && up(l);
      l = l.sibling;
    }
  }
  var Ee = !1, Qt = !1, au = !1, ud = !1, cp = typeof WeakSet == "function" ? WeakSet : Set, ol = null, Vu = !1, cd = !1, x0 = !1, id = !1;
  function vv(l, n, u) {
    if (l = l.containerInfo, lm = wc, l = Mu(l), Nf(l)) {
      if ("selectionStart" in l)
        var i = {
          start: l.selectionStart,
          end: l.selectionEnd
        };
      else
        t: {
          i = (i = l.ownerDocument) && i.defaultView || window;
          var s = i.getSelection && i.getSelection();
          if (s && s.rangeCount !== 0) {
            i = s.anchorNode;
            var r = s.anchorOffset, m = s.focusNode;
            s = s.focusOffset;
            try {
              i.nodeType, m.nodeType;
            } catch {
              i = null;
              break t;
            }
            var g = 0, S = -1, C = -1, N = 0, G = 0, D = l, U = null;
            e: for (; ; ) {
              for (var Z; D !== i || r !== 0 && D.nodeType !== 3 || (S = g + r), D !== m || s !== 0 && D.nodeType !== 3 || (C = g + s), D.nodeType === 3 && (g += D.nodeValue.length), (Z = D.firstChild) !== null; )
                U = D, D = Z;
              for (; ; ) {
                if (D === l) break e;
                if (U === i && ++N === r && (S = g), U === m && ++G === s && (C = g), (Z = D.nextSibling) !== null) break;
                D = U, U = D.parentNode;
              }
              D = Z;
            }
            i = S === -1 || C === -1 ? null : { start: S, end: C };
          } else i = null;
        }
      i = i || { start: 0, end: 0 };
    } else i = null;
    for (am = { focusedElem: l, selectionRange: i }, wc = !1, u = (u & 335544064) === u, ol = n, n = u ? 9270 : 1024; ol !== null; ) {
      if (l = ol, u && (i = l.deletions, i !== null))
        for (r = 0; r < i.length; r++)
          u && nd(i[r]);
      if (l.alternate === null && (l.flags & 2) !== 0)
        u && qo(l), ns(u);
      else {
        if (l.tag === 22) {
          if (i = l.alternate, l.memoizedState !== null) {
            i !== null && i.memoizedState === null && u && nd(i), ns(u);
            continue;
          } else if (i !== null && i.memoizedState !== null) {
            u && qo(l), ns(u);
            continue;
          }
        }
        i = l.child, (l.subtreeFlags & n) !== 0 && i !== null ? (i.return = l, ol = i) : (u && hv(l), ns(u));
      }
    }
    Je = null;
  }
  function ns(l) {
    for (; ol !== null; ) {
      var n = ol, u = l, i = n.alternate, s = n.flags;
      switch (n.tag) {
        case 0:
        case 11:
        case 15:
          break;
        case 1:
          if ((s & 1024) !== 0 && i !== null) {
            u = void 0, s = i.memoizedProps, i = i.memoizedState;
            var r = n.stateNode;
            try {
              var m = Bc(
                n.type,
                s
              );
              u = r.getSnapshotBeforeUpdate(
                m,
                i
              ), r.__reactInternalSnapshotBeforeUpdate = u;
            } catch (g) {
              $t(n, n.return, g);
            }
          }
          break;
        case 3:
          if ((s & 1024) !== 0) {
            if (i = n.stateNode.containerInfo, u = i.nodeType, u === 9)
              Ts(i);
            else if (u === 1)
              switch (i.nodeName) {
                case "HEAD":
                case "HTML":
                case "BODY":
                  Ts(i);
                  break;
                default:
                  i.textContent = "";
              }
          }
          break;
        case 5:
        case 26:
        case 27:
        case 6:
        case 4:
        case 17:
          break;
        case 30:
          u && i !== null && (u = cl(
            i.memoizedProps,
            i.stateNode
          ), s = n.memoizedProps, s = jn(s.default, s.update), s !== "none" && Go(
            i,
            u,
            s,
            i.memoizedState = [],
            !0
          ));
          break;
        default:
          if ((s & 1024) !== 0) throw Error(q(163));
      }
      if (i = n.sibling, i !== null) {
        i.return = n.return, ol = i;
        break;
      }
      ol = n.return;
    }
  }
  function gv(l, n, u) {
    var i = u.flags;
    switch (u.tag) {
      case 0:
      case 11:
      case 15:
        ju(l, u), i & 4 && ts(5, u);
        break;
      case 1:
        if (ju(l, u), i & 4)
          if (l = u.stateNode, n === null)
            try {
              l.componentDidMount();
            } catch (m) {
              $t(u, u.return, m);
            }
          else {
            var s = Bc(
              u.type,
              n.memoizedProps
            );
            n = n.memoizedState;
            try {
              l.componentDidUpdate(
                s,
                n,
                l.__reactInternalSnapshotBeforeUpdate
              );
            } catch (m) {
              $t(
                u,
                u.return,
                m
              );
            }
          }
        i & 64 && Ci(u), i & 512 && eu(u, u.return);
        break;
      case 3:
        if (ju(l, u), i & 64 && (l = u.updateQueue, l !== null)) {
          if (n = null, u.child !== null)
            switch (u.child.tag) {
              case 27:
              case 5:
                n = u.child.stateNode;
                break;
              case 1:
                n = u.child.stateNode;
            }
          try {
            Jh(l, n);
          } catch (m) {
            $t(u, u.return, m);
          }
        }
        break;
      case 27:
        n === null && i & 4 && rv(u);
      case 26:
      case 5:
        ju(l, u), n === null && i & 4 && U0(u), i & 512 && eu(u, u.return);
        break;
      case 12:
        ju(l, u);
        break;
      case 31:
        ju(l, u), i & 4 && ip(l, u);
        break;
      case 13:
        ju(l, u), i & 4 && op(l, u), i & 64 && (l = u.memoizedState, l !== null && (l = l.dehydrated, l !== null && (u = hb.bind(
          null,
          u
        ), Pv(l, u))));
        break;
      case 22:
        if (i = u.memoizedState !== null || Ee, !i) {
          var r = n !== null && n.memoizedState !== null || Qt;
          n = Ee, s = Qt, Ee = i, (Qt = r) && !s ? (i = 2, (u.subtreeFlags & 8772) !== 0 && (i |= 1), gn(
            l,
            u,
            i
          )) : ju(l, u), Ee = n, Qt = s;
        }
        break;
      case 30:
        ju(l, u), i & 512 && eu(u, u.return);
        break;
      case 7:
        i & 512 && eu(u, u.return);
      default:
        ju(l, u);
    }
  }
  function Y0(l, n) {
    for (l = l.child; l !== null; )
      us(l, n), l = l.sibling;
  }
  function us(l, n) {
    switch (l.tag) {
      case 5:
      case 26:
        try {
          var u = l.stateNode;
          if (n) {
            var i = u.style;
            typeof i.setProperty == "function" ? i.setProperty("display", "none", "important") : i.display = "none";
          } else {
            var s = l.stateNode, r = l.memoizedProps.style, m = r != null && r.hasOwnProperty("display") ? r.display : null;
            s.style.display = m == null || typeof m == "boolean" ? "" : ("" + m).trim();
          }
        } catch (S) {
          $t(l, l.return, S);
        }
        od(l, n);
        break;
      case 6:
        try {
          l.stateNode.nodeValue = n ? "" : l.memoizedProps, Vt = !0;
        } catch (S) {
          $t(l, l.return, S);
        }
        break;
      case 18:
        try {
          var g = l.stateNode;
          n ? Bp(g, !0) : Bp(l.stateNode, !1);
        } catch (S) {
          $t(l, l.return, S);
        }
        break;
      case 22:
      case 23:
        l.memoizedState === null && Y0(l, n);
        break;
      default:
        Y0(l, n);
    }
  }
  function od(l, n) {
    if (l.subtreeFlags & 67108864)
      for (l = l.child; l !== null; ) {
        t: {
          var u = l, i = n;
          switch (u.tag) {
            case 4:
              us(u, i);
              break t;
            case 22:
              u.memoizedState === null && od(u, i);
              break t;
            default:
              od(u, i);
          }
        }
        l = l.sibling;
      }
  }
  function pv(l) {
    var n = l.alternate;
    n !== null && (l.alternate = null, pv(n)), l.child = null, l.deletions = null, l.sibling = null, l.tag === 5 && (n = l.stateNode, n !== null && cr(n)), l.stateNode = null, l.return = null, l.dependencies = null, l.memoizedProps = null, l.memoizedState = null, l.pendingProps = null, l.stateNode = null, l.updateQueue = null;
  }
  var at = null, Yl = !1;
  function nu(l, n, u) {
    for (u = u.child; u !== null; )
      Sv(l, n, u), u = u.sibling;
  }
  function Sv(l, n, u) {
    if (Fl && typeof Fl.onCommitFiberUnmount == "function")
      try {
        Fl.onCommitFiberUnmount(eo, u);
      } catch {
      }
    switch (u.tag) {
      case 26:
        Qt || je(u, n), nu(
          l,
          n,
          u
        ), u.memoizedState ? u.memoizedState.count-- : u.stateNode && !Qt && (u = u.stateNode, u.parentNode.removeChild(u));
        break;
      case 27:
        Qt || je(u, n), es(u);
        var i = at, s = Yl;
        Gc(u.type) && (at = u.stateNode, Yl = !1), nu(
          l,
          n,
          u
        ), eg(
          u.stateNode,
          u.type,
          u.memoizedProps
        ), at = i, Yl = s;
        break;
      case 5:
        Qt || je(u, n), es(u);
      case 6:
        if (u.tag === 6 && es(u), i = at, s = Yl, at = null, nu(
          l,
          n,
          u
        ), at = i, Yl = s, at !== null)
          if (Yl)
            try {
              (at.nodeType === 9 ? at.body : at.nodeName === "HTML" ? at.ownerDocument.body : at).removeChild(u.stateNode), Vt = !0;
            } catch (r) {
              $t(
                u,
                n,
                r
              );
            }
          else
            try {
              at.removeChild(u.stateNode), Vt = !0;
            } catch (r) {
              $t(
                u,
                n,
                r
              );
            }
        break;
      case 18:
        at !== null && (Yl ? (l = at, Lv(
          l.nodeType === 9 ? l.body : l.nodeName === "HTML" ? l.ownerDocument.body : l,
          u.stateNode
        ), tf(l)) : Lv(at, u.stateNode));
        break;
      case 4:
        i = at, s = Yl, at = u.stateNode.containerInfo, Yl = !0, nu(
          l,
          n,
          u
        ), at = i, Yl = s;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        mn(2, u, n), Qt || mn(4, u, n), nu(
          l,
          n,
          u
        );
        break;
      case 1:
        Qt || (je(u, n), i = u.stateNode, typeof i.componentWillUnmount == "function" && ov(
          u,
          n,
          i
        )), nu(
          l,
          n,
          u
        );
        break;
      case 21:
        nu(
          l,
          n,
          u
        );
        break;
      case 22:
        Qt = (i = Qt) || u.memoizedState !== null, nu(
          l,
          n,
          u
        ), Qt = i;
        break;
      case 30:
        je(u, n), nu(
          l,
          n,
          u
        );
        break;
      case 7:
        Qt || je(u, n), nu(
          l,
          n,
          u
        );
        break;
      default:
        nu(
          l,
          n,
          u
        );
    }
  }
  function ip(l, n) {
    if (n.memoizedState === null && (l = n.alternate, l !== null && (l = l.memoizedState, l !== null))) {
      l = l.dehydrated;
      try {
        tf(l);
      } catch (u) {
        $t(n, n.return, u);
      }
    }
  }
  function op(l, n) {
    if (n.memoizedState === null && (l = n.alternate, l !== null && (l = l.memoizedState, l !== null && (l = l.dehydrated, l !== null))))
      try {
        tf(l);
      } catch (u) {
        $t(n, n.return, u);
      }
  }
  function bv(l) {
    switch (l.tag) {
      case 31:
      case 13:
      case 19:
        var n = l.stateNode;
        return n === null && (n = l.stateNode = new cp()), n;
      case 22:
        return l = l.stateNode, n = l._retryCache, n === null && (n = l._retryCache = new cp()), n;
      default:
        throw Error(q(435, l.tag));
    }
  }
  function fd(l, n) {
    var u = bv(l);
    n.forEach(function(i) {
      if (!u.has(i)) {
        u.add(i);
        var s = mb.bind(null, l, i);
        i.then(s, s);
      }
    });
  }
  function ql(l, n, u) {
    var i = n.deletions;
    if (i !== null)
      for (var s = 0; s < i.length; s++) {
        var r = i[s], m = l, g = n, S = g;
        t: for (; S !== null; ) {
          switch (S.tag) {
            case 27:
              if (Gc(S.type)) {
                at = S.stateNode, Yl = !1;
                break t;
              }
              break;
            case 5:
              at = S.stateNode, Yl = !1;
              break t;
            case 3:
            case 4:
              at = S.stateNode.containerInfo, Yl = !0;
              break t;
          }
          S = S.return;
        }
        if (at === null) throw Error(q(160));
        Sv(m, g, r), at = null, Yl = !1, m = r.alternate, m !== null && (m.return = null), r.return = null;
      }
    if (n.subtreeFlags & 13886)
      for (n = n.child; n !== null; )
        cs(n, l, u), n = n.sibling;
  }
  var vn = null;
  function cs(l, n, u) {
    var i = l.alternate, s = l.flags;
    switch (l.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        if (s & 4 && (i = l.updateQueue, i = i !== null ? i.events : null, i !== null))
          for (var r = 0; r < i.length; r++) {
            var m = i[r];
            m.ref.impl = m.nextImpl;
          }
        ql(n, l, u), ua(l), s & 4 && (mn(3, l, l.return), ts(3, l), mn(5, l, l.return));
        break;
      case 1:
        ql(n, l, u), ua(l), s & 512 && (Qt || i === null || je(i, i.return)), s & 64 && Ee && (l = l.updateQueue, l !== null && (n = l.callbacks, n !== null && (u = l.shared.hiddenCallbacks, l.shared.hiddenCallbacks = u === null ? n : u.concat(n))));
        break;
      case 26:
        if (r = vn, ql(n, l, u), ua(l), s & 512 && (Qt || i === null || je(i, i.return)), s & 4)
          if (s = i !== null ? i.memoizedState : null, u = l.memoizedState, i === null)
            if (u === null)
              if (l.stateNode === null)
                if (Ee)
                  l.stateNode = vs(
                    l.type,
                    l.memoizedProps,
                    n.containerInfo,
                    l
                  );
                else {
                  t: {
                    n = l.type, u = l.memoizedProps, s = r.ownerDocument || r;
                    e: switch (n) {
                      case "title":
                        i = s.getElementsByTagName("title")[0], (!i || i[Ef] || i[ul] || i.namespaceURI === "http://www.w3.org/2000/svg" || i.hasAttribute("itemprop")) && (i = s.createElement(n), s.head.insertBefore(
                          i,
                          s.querySelector("head > title")
                        )), fl(i, n, u), i[ul] = l, De(i), n = i;
                        break t;
                      case "link":
                        if (r = Kp(
                          "link",
                          "href",
                          s
                        ).get(n + (u.href || ""))) {
                          for (m = 0; m < r.length; m++)
                            if (i = r[m], i.getAttribute("href") === (u.href == null || u.href === "" ? null : u.href) && i.getAttribute("rel") === (u.rel == null ? null : u.rel) && i.getAttribute("title") === (u.title == null ? null : u.title) && i.getAttribute("crossorigin") === (u.crossOrigin == null ? null : u.crossOrigin)) {
                              r.splice(m, 1);
                              break e;
                            }
                        }
                        i = s.createElement(n), fl(i, n, u), s.head.appendChild(i);
                        break;
                      case "meta":
                        if (r = Kp(
                          "meta",
                          "content",
                          s
                        ).get(n + (u.content || ""))) {
                          for (m = 0; m < r.length; m++)
                            if (i = r[m], i.getAttribute("content") === (u.content == null ? null : "" + u.content) && i.getAttribute("name") === (u.name == null ? null : u.name) && i.getAttribute("property") === (u.property == null ? null : u.property) && i.getAttribute("http-equiv") === (u.httpEquiv == null ? null : u.httpEquiv) && i.getAttribute("charset") === (u.charSet == null ? null : u.charSet)) {
                              r.splice(m, 1);
                              break e;
                            }
                        }
                        i = s.createElement(n), fl(i, n, u), s.head.appendChild(i);
                        break;
                      default:
                        throw Error(q(468, n));
                    }
                    i[ul] = l, De(i), n = i;
                  }
                  l.stateNode = n;
                }
              else
                Ee || og(r, l.type, l.stateNode);
            else
              l.stateNode = sm(
                r,
                u,
                l.memoizedProps
              );
          else
            s !== u ? (s === null ? (n = i.stateNode, n === null || Qt || n.parentNode.removeChild(n)) : s.count--, u === null ? Ee || og(r, l.type, l.stateNode) : sm(r, u, l.memoizedProps)) : u === null && l.stateNode !== null && na(
              l,
              l.memoizedProps,
              i.memoizedProps
            );
        break;
      case 27:
        ql(n, l, u), ua(l), s & 512 && (Qt || i === null || je(i, i.return)), i !== null && s & 4 && na(
          l,
          l.memoizedProps,
          i.memoizedProps
        );
        break;
      case 5:
        if (r = au, au = !1, ql(n, l, u), au = r, ua(l), s & 512 && (Qt || i === null || je(i, i.return)), l.flags & 32) {
          n = l.stateNode;
          try {
            Eu(n, ""), Vt = !0;
          } catch (N) {
            $t(l, l.return, N);
          }
        }
        s & 4 && l.stateNode != null && (n = l.memoizedProps, na(
          l,
          n,
          i !== null ? i.memoizedProps : n
        )), s & 1024 && (ud = !0);
        break;
      case 6:
        if (ql(n, l, u), ua(l), s & 4) {
          if (l.stateNode === null)
            throw Error(q(162));
          n = l.memoizedProps, u = l.stateNode;
          try {
            u.nodeValue = n, Vt = !0;
          } catch (N) {
            $t(l, l.return, N);
          }
        }
        break;
      case 3:
        if (Vt = !1, As = null, r = vn, vn = Gt(n.containerInfo), ql(n, l, u), vn = r, ua(l), s & 4 && i !== null && i.memoizedState.isDehydrated)
          try {
            tf(n.containerInfo);
          } catch (N) {
            $t(l, l.return, N);
          }
        ud && (ud = !1, fp(l)), Vt = !1;
        break;
      case 4:
        s = au, au = Ee, i = oy(), r = vn, vn = Gt(
          l.stateNode.containerInfo
        ), ql(n, l, u), ua(l), vn = r, Vt && cd && (x0 = !0), Vt = i, au = s;
        break;
      case 12:
        ql(n, l, u), ua(l);
        break;
      case 31:
        ql(n, l, u), ua(l), s & 4 && (n = l.updateQueue, n !== null && (l.updateQueue = null, fd(l, n)));
        break;
      case 13:
        ql(n, l, u), ua(l), l.child.flags & 8192 && l.memoizedState !== null != (i !== null && i.memoizedState !== null) && (dd = $l()), s & 4 && (n = l.updateQueue, n !== null && (l.updateQueue = null, fd(l, n)));
        break;
      case 22:
        r = l.memoizedState !== null, m = i !== null && i.memoizedState !== null;
        var g = Ee, S = Qt, C = au;
        Ee = g || r, au = C || r, Qt = S || m, ql(n, l, u), Qt = S, au = C, Ee = g, ua(l), s & 8192 && (n = l.stateNode, n._visibility = r ? n._visibility & -2 : n._visibility | 1, !r || i === null || m || Ee || Qt || (n = m || Qt, u = Ee, i = Qt, Ee = r || Ee, Qt = n, wu(l, 2), Ee = u, Qt = i), !r && au || Y0(l, r)), s & 4 && (n = l.updateQueue, n !== null && (u = n.retryQueue, u !== null && (n.retryQueue = null, fd(l, u))));
        break;
      case 19:
        ql(n, l, u), ua(l), s & 4 && (n = l.updateQueue, n !== null && (l.updateQueue = null, fd(l, n)));
        break;
      case 30:
        s & 512 && (Qt || i === null || je(i, i.return)), s = oy(), r = cd, m = (u & 335544064) === u, g = l.memoizedProps, cd = m && jn(
          g.default,
          g.update
        ) !== "none", ql(n, l, u), ua(l), m && i !== null && Vt && (l.flags |= 4), cd = r, Vt = s;
        break;
      case 21:
        break;
      case 7:
        s & 512 && (Qt || i === null || je(i, i.return)), i && i.stateNode !== null && (i.stateNode._fragmentFiber = l);
      default:
        ql(n, l, u), ua(l);
    }
  }
  function ua(l) {
    var n = l.flags;
    if (n & 2) {
      try {
        for (var u, i = l.return; i !== null; ) {
          if (sv(i)) {
            u = i;
            break;
          }
          i = i.return;
        }
        i = null;
        for (var s = l.return; s !== null; ) {
          if (fv(s)) {
            var r = s.stateNode;
            i === null ? i = [r] : i.push(r);
          }
          if (_0(s)) break;
          s = s.return;
        }
        var m = i;
        if (u == null) throw Error(q(160));
        switch (u.tag) {
          case 27:
            var g = u.stateNode, S = Ri(l);
            ld(
              l,
              S,
              g,
              m
            );
            break;
          case 5:
            var C = u.stateNode;
            u.flags & 32 && (Eu(C, ""), u.flags &= -33);
            var N = Ri(l);
            ld(
              l,
              N,
              C,
              m
            );
            break;
          case 3:
          case 4:
            var G = u.stateNode.containerInfo, D = Ri(l);
            ge(
              l,
              D,
              G,
              m
            );
            break;
          default:
            throw Error(q(161));
        }
      } catch (U) {
        $t(l, l.return, U);
      }
      l.flags &= -3;
    }
    n & 4096 && (l.flags &= -4097);
  }
  function fp(l) {
    if (l.subtreeFlags & 1024)
      for (l = l.child; l !== null; ) {
        var n = l;
        fp(n), n.tag === 5 && n.flags & 1024 && (n = n.stateNode, wc = !0, n.reset(), wc = !1), l = l.sibling;
      }
  }
  function ca(l, n) {
    if (n.subtreeFlags & 9270)
      for (n = n.child; n !== null; )
        is(n, l), n = n.sibling;
    else up(n);
  }
  function is(l, n) {
    var u = l.alternate;
    if (u === null) ls(l, !1);
    else
      switch (l.tag) {
        case 3:
          if (id = Vu = !1, Mi(), ca(n, l), !Vu && !x0) {
            if (l = yn, l !== null)
              for (var i = 0; i < l.length; i += 3) {
                u = l[i];
                var s = l[i + 1];
                Yp(u, l[i + 2]), u = u.ownerDocument.documentElement, u !== null && u.animate(
                  { opacity: [0, 0], pointerEvents: ["none", "none"] },
                  {
                    duration: 0,
                    fill: "forwards",
                    pseudoElement: "::view-transition-group(" + s + ")"
                  }
                );
              }
            l = n.containerInfo, l = l.nodeType === 9 ? l.documentElement : l.ownerDocument.documentElement, l !== null && l.style.viewTransitionName === "" && (l.style.viewTransitionName = "none", l.animate(
              { opacity: [0, 0], pointerEvents: ["none", "none"] },
              {
                duration: 0,
                fill: "forwards",
                pseudoElement: "::view-transition-group(root)"
              }
            ), l.animate(
              { width: [0, 0], height: [0, 0] },
              {
                duration: 0,
                fill: "forwards",
                pseudoElement: "::view-transition"
              }
            )), id = !0;
          }
          yn = null;
          break;
        case 5:
          ca(n, l);
          break;
        case 4:
          i = Vu, Vu = !1, ca(n, l), Vu && (x0 = !0), Vu = i;
          break;
        case 22:
          l.memoizedState === null && (u.memoizedState !== null ? ls(l, !1) : ca(n, l));
          break;
        case 30:
          i = Vu, s = Mi(), Vu = !1, ca(n, l), Vu && (l.flags |= 4);
          var r = l.memoizedProps, m = l.stateNode;
          n = cl(r, m), m = cl(u.memoizedProps, m);
          var g = jn(r.default, r.update);
          g === "none" ? n = !1 : (r = u.memoizedState, u.memoizedState = null, u = l.child, el = 0, n = B0(
            l,
            u,
            n,
            m,
            g,
            r,
            !0
          ), el !== (r === null ? 0 : r.length) && (l.flags |= 32)), (l.flags & 4) !== 0 && n ? (ds(
            l,
            l.memoizedProps.onUpdate
          ), yn = s) : s !== null && (s.push.apply(s, yn), yn = s), Vu = (l.flags & 32) !== 0 ? !0 : i;
          break;
        default:
          ca(n, l);
      }
  }
  function ju(l, n) {
    if (n.subtreeFlags & 8772)
      for (n = n.child; n !== null; )
        gv(l, n.alternate, n), n = n.sibling;
  }
  function wu(l, n) {
    for (l = l.child; l !== null; ) {
      var u = l, i = n;
      switch (u.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          mn(4, u, u.return), wu(
            u,
            i
          );
          break;
        case 1:
          je(u, u.return);
          var s = u.stateNode;
          typeof s.componentWillUnmount == "function" && ov(
            u,
            u.return,
            s
          ), wu(
            u,
            i
          );
          break;
        case 27:
          (i & 2) !== 0 && eg(
            u.stateNode,
            u.type,
            u.memoizedProps
          );
        case 5:
          je(u, u.return), u.tag !== 5 && u.tag !== 27 || es(u), wu(
            u,
            i
          );
          break;
        case 6:
          es(u);
          break;
        case 26:
          je(u, u.return), s = u.stateNode, u.memoizedState !== null || s === null || Qt || s.parentNode.removeChild(s), wu(
            u,
            i
          );
          break;
        case 22:
          u.memoizedState === null && wu(
            u,
            i
          );
          break;
        case 30:
          je(u, u.return), wu(
            u,
            i
          );
          break;
        case 7:
          je(u, u.return);
        default:
          wu(
            u,
            i
          );
      }
      l = l.sibling;
    }
  }
  function gn(l, n, u) {
    for (u = (n.subtreeFlags & 8772) !== 0 ? u : u & -2, n = n.child; n !== null; ) {
      var i = n.alternate, s = l, r = n, m = r.flags, g = (u & 1) !== 0;
      switch (r.tag) {
        case 0:
        case 11:
        case 15:
          gn(
            s,
            r,
            u
          ), ts(4, r);
          break;
        case 1:
          if (gn(
            s,
            r,
            u
          ), i = r, s = i.stateNode, typeof s.componentDidMount == "function")
            try {
              s.componentDidMount();
            } catch (N) {
              $t(i, i.return, N);
            }
          if (i = r, s = i.updateQueue, s !== null) {
            var S = i.stateNode;
            try {
              var C = s.shared.hiddenCallbacks;
              if (C !== null)
                for (s.shared.hiddenCallbacks = null, s = 0; s < C.length; s++)
                  Gy(C[s], S);
            } catch (N) {
              $t(i, i.return, N);
            }
          }
          g && m & 64 && Ci(r), eu(r, r.return);
          break;
        case 27:
          (u & 2) !== 0 && rv(r);
        case 5:
          r.tag !== 5 && r.tag !== 27 || ed(r), gn(
            s,
            r,
            u
          ), g && i === null && m & 4 && U0(r), eu(r, r.return);
          break;
        case 6:
          ed(r);
          break;
        case 26:
          S = r.stateNode, r.memoizedState !== null || S === null || Ee || og(
            Gt(S.ownerDocument),
            r.type,
            S
          ), gn(
            s,
            r,
            u
          ), g && i === null && m & 4 && U0(r), eu(r, r.return);
          break;
        case 12:
          gn(
            s,
            r,
            u
          );
          break;
        case 31:
          gn(
            s,
            r,
            u
          ), g && m & 4 && ip(s, r);
          break;
        case 13:
          gn(
            s,
            r,
            u
          ), g && m & 4 && op(s, r);
          break;
        case 22:
          r.memoizedState === null && gn(
            s,
            r,
            u
          ), eu(r, r.return);
          break;
        case 30:
          gn(
            s,
            r,
            u
          ), eu(r, r.return);
          break;
        case 7:
          eu(r, r.return);
        default:
          gn(
            s,
            r,
            u
          );
      }
      n = n.sibling;
    }
  }
  function q0(l, n) {
    var u = null;
    l !== null && l.memoizedState !== null && l.memoizedState.cachePool !== null && (u = l.memoizedState.cachePool.pool), l = null, n.memoizedState !== null && n.memoizedState.cachePool !== null && (l = n.memoizedState.cachePool.pool), l !== u && (l != null && l.refCount++, u != null && jt(u));
  }
  function G0(l, n) {
    l = null, n.alternate !== null && (l = n.alternate.memoizedState.cache), n = n.memoizedState.cache, n !== l && (n.refCount++, l != null && jt(l));
  }
  function Oa(l, n, u, i) {
    var s = (u & 335544064) === u;
    if (n.subtreeFlags & (s ? 10262 : 10256))
      for (n = n.child; n !== null; )
        Tv(
          l,
          n,
          u,
          i
        ), n = n.sibling;
    else s && yv(n);
  }
  function Tv(l, n, u, i) {
    var s = (u & 335544064) === u;
    s && n.alternate === null && n.return !== null && n.return.alternate !== null && H0(n);
    var r = n.flags;
    switch (n.tag) {
      case 0:
      case 11:
      case 15:
        Oa(
          l,
          n,
          u,
          i
        ), r & 2048 && ts(9, n);
        break;
      case 1:
        Oa(
          l,
          n,
          u,
          i
        );
        break;
      case 3:
        Oa(
          l,
          n,
          u,
          i
        ), s && id && (l = l.containerInfo, l = l.nodeType === 9 ? l.body : l.nodeName === "HTML" ? l.ownerDocument.body : l, l.style.viewTransitionName === "root" && (l.style.viewTransitionName = ""), l = l.ownerDocument.documentElement, l !== null && l.style.viewTransitionName === "none" && (l.style.viewTransitionName = "")), r & 2048 && (r = null, n.alternate !== null && (r = n.alternate.memoizedState.cache), n = n.memoizedState.cache, n !== r && (n.refCount++, r != null && jt(r)));
        break;
      case 12:
        if (r & 2048) {
          Oa(
            l,
            n,
            u,
            i
          ), r = n.stateNode;
          try {
            var m = n.memoizedProps, g = m.id, S = m.onPostCommit;
            typeof S == "function" && S(
              g,
              n.alternate === null ? "mount" : "update",
              r.passiveEffectDuration,
              -0
            );
          } catch (C) {
            $t(n, n.return, C);
          }
        } else
          Oa(
            l,
            n,
            u,
            i
          );
        break;
      case 31:
        Oa(
          l,
          n,
          u,
          i
        );
        break;
      case 13:
        Oa(
          l,
          n,
          u,
          i
        );
        break;
      case 23:
        break;
      case 22:
        m = n.stateNode, g = n.alternate, n.memoizedState !== null ? (s && g !== null && g.memoizedState === null && H0(g), m._visibility & 2 ? Oa(
          l,
          n,
          u,
          i
        ) : os(
          l,
          n
        )) : (s && g !== null && g.memoizedState !== null && H0(n), m._visibility & 2 ? Oa(
          l,
          n,
          u,
          i
        ) : (m._visibility |= 2, _i(
          l,
          n,
          u,
          i,
          (n.subtreeFlags & 10256) !== 0 || !1
        ))), r & 2048 && q0(g, n);
        break;
      case 24:
        Oa(
          l,
          n,
          u,
          i
        ), r & 2048 && G0(n.alternate, n);
        break;
      case 30:
        s && (r = n.alternate, r !== null && (lu(r.child, !0), lu(n.child, !0))), Oa(
          l,
          n,
          u,
          i
        );
        break;
      default:
        Oa(
          l,
          n,
          u,
          i
        );
    }
  }
  function _i(l, n, u, i, s) {
    for (s = s && ((n.subtreeFlags & 10256) !== 0 || !1), n = n.child; n !== null; ) {
      var r = l, m = n, g = u, S = i, C = m.flags;
      switch (m.tag) {
        case 0:
        case 11:
        case 15:
          _i(
            r,
            m,
            g,
            S,
            s
          ), ts(8, m);
          break;
        case 23:
          break;
        case 22:
          var N = m.stateNode;
          m.memoizedState !== null ? N._visibility & 2 ? _i(
            r,
            m,
            g,
            S,
            s
          ) : os(
            r,
            m
          ) : (N._visibility |= 2, _i(
            r,
            m,
            g,
            S,
            s
          )), s && C & 2048 && q0(
            m.alternate,
            m
          );
          break;
        case 24:
          _i(
            r,
            m,
            g,
            S,
            s
          ), s && C & 2048 && G0(m.alternate, m);
          break;
        default:
          _i(
            r,
            m,
            g,
            S,
            s
          );
      }
      n = n.sibling;
    }
  }
  function os(l, n) {
    if (n.subtreeFlags & 10256)
      for (n = n.child; n !== null; ) {
        var u = l, i = n, s = i.flags;
        switch (i.tag) {
          case 22:
            os(u, i), s & 2048 && q0(
              i.alternate,
              i
            );
            break;
          case 24:
            os(u, i), s & 2048 && G0(i.alternate, i);
            break;
          default:
            os(u, i);
        }
        n = n.sibling;
      }
  }
  var Vo = 8192;
  function Xu(l, n, u) {
    if (l.subtreeFlags & Vo)
      for (l = l.child; l !== null; )
        Ev(
          l,
          n,
          u
        ), l = l.sibling;
  }
  function Ev(l, n, u) {
    switch (l.tag) {
      case 26:
        Xu(
          l,
          n,
          u
        ), l.flags & Vo && (l.memoizedState !== null ? Os(
          u,
          vn,
          l.memoizedState,
          l.memoizedProps
        ) : (l = l.stateNode, (n & 335544128) === n && dm(u, l)));
        break;
      case 5:
        Xu(
          l,
          n,
          u
        ), l.flags & Vo && (l = l.stateNode, (n & 335544128) === n && dm(u, l));
        break;
      case 3:
      case 4:
        var i = vn;
        vn = Gt(l.stateNode.containerInfo), Xu(
          l,
          n,
          u
        ), vn = i;
        break;
      case 22:
        l.memoizedState === null && (i = l.alternate, i !== null && i.memoizedState !== null ? (i = Vo, Vo = 16777216, Xu(
          l,
          n,
          u
        ), Vo = i) : Xu(
          l,
          n,
          u
        ));
        break;
      case 30:
        if ((l.flags & Vo) !== 0 && (i = l.memoizedProps.name, i != null && i !== "auto")) {
          var s = l.stateNode;
          s.paired = null, Je === null && (Je = /* @__PURE__ */ new Map()), Je.set(i, s);
        }
        Xu(
          l,
          n,
          u
        );
        break;
      default:
        Xu(
          l,
          n,
          u
        );
    }
  }
  function _t(l) {
    var n = l.alternate;
    if (n !== null && (l = n.child, l !== null)) {
      n.child = null;
      do
        n = l.sibling, l.sibling = null, l = n;
      while (l !== null);
    }
  }
  function jo(l) {
    var n = l.deletions;
    if ((l.flags & 16) !== 0) {
      if (n !== null)
        for (var u = 0; u < n.length; u++) {
          var i = n[u];
          ol = i, j0(
            i,
            l
          );
        }
      _t(l);
    }
    if (l.subtreeFlags & 10256)
      for (l = l.child; l !== null; )
        V0(l), l = l.sibling;
  }
  function V0(l) {
    switch (l.tag) {
      case 0:
      case 11:
      case 15:
        jo(l), l.flags & 2048 && mn(9, l, l.return);
        break;
      case 3:
        jo(l);
        break;
      case 12:
        jo(l);
        break;
      case 22:
        var n = l.stateNode;
        l.memoizedState !== null && n._visibility & 2 && (l.return === null || l.return.tag !== 13) ? (n._visibility &= -3, sd(l)) : jo(l);
        break;
      default:
        jo(l);
    }
  }
  function sd(l) {
    var n = l.deletions;
    if ((l.flags & 16) !== 0) {
      if (n !== null)
        for (var u = 0; u < n.length; u++) {
          var i = n[u];
          ol = i, j0(
            i,
            l
          );
        }
      _t(l);
    }
    for (l = l.child; l !== null; ) {
      switch (n = l, n.tag) {
        case 0:
        case 11:
        case 15:
          mn(8, n, n.return), sd(n);
          break;
        case 22:
          u = n.stateNode, u._visibility & 2 && (u._visibility &= -3, sd(n));
          break;
        default:
          sd(n);
      }
      l = l.sibling;
    }
  }
  function j0(l, n) {
    for (; ol !== null; ) {
      var u = ol;
      switch (u.tag) {
        case 0:
        case 11:
        case 15:
          mn(8, u, n);
          break;
        case 23:
        case 22:
          if (u.memoizedState !== null && u.memoizedState.cachePool !== null) {
            var i = u.memoizedState.cachePool.pool;
            i != null && i.refCount++;
          }
          break;
        case 24:
          jt(u.memoizedState.cache);
      }
      if (i = u.child, i !== null) i.return = u, ol = i;
      else
        t: for (u = l; ol !== null; ) {
          i = ol;
          var s = i.sibling, r = i.return;
          if (pv(i), i === u) {
            ol = null;
            break t;
          }
          if (s !== null) {
            s.return = r, ol = s;
            break t;
          }
          ol = r;
        }
    }
  }
  var rd = {
    getCacheForType: function(l) {
      var n = ke(Ce), u = n.data.get(l);
      return u === void 0 && (u = l(), n.data.set(l, u)), u;
    },
    cacheSignal: function() {
      return ke(Ce).controller.signal;
    }
  }, w0 = typeof WeakMap == "function" ? WeakMap : Map, Kt = 0, ce = null, Dt = null, ut = 0, te = 0, Da = null, Ui = !1, ia = !1, X0 = !1, Gl = 0, ze = 0, qt = 0, xc = 0, Ke = 0, Ia = 0, wo = 0, Xo = null, oa = null, Ca = !1, dd = 0, Q0 = 0, hd = 1 / 0, fs = null, Yc = null, Ae = 0, pn = null, Qo = null, Ra = 0, Z0 = 0, L0 = null, zv = null, ss = null, Ni = null, rs = null, qc = 0, Hi = null;
  function ka() {
    return (Kt & 2) !== 0 && ut !== 0 ? ut & -ut : ft.T !== null ? P0() : wa();
  }
  function sp() {
    if (Ia === 0)
      if ((ut & 536870912) === 0 || vt) {
        var l = qe;
        qe <<= 1, (qe & 3932160) === 0 && (qe = 262144), Ia = l;
      } else Ia = 536870912;
    return l = Pe.current, l !== null && (l.flags |= 32), Ia;
  }
  function ds(l, n) {
    if (n != null) {
      var u = l.stateNode, i = u.ref;
      i === null && (i = u.ref = Vp(
        cl(l.memoizedProps, u)
      )), Ni === null && (Ni = []), Ni.push(n.bind(null, i));
    }
  }
  function Ma(l, n, u) {
    (l === ce && (te === 2 || te === 9) || l.cancelPendingCommit !== null) && (Zo(l, 0), fa(
      l,
      ut,
      Ia,
      !1
    )), ai(l, u), ((Kt & 2) === 0 || l !== ce) && (l === ce && ((Kt & 2) === 0 && (xc |= u), ze === 4 && fa(
      l,
      ut,
      Ia,
      !1
    )), Zu(l));
  }
  function Av(l, n, u) {
    if ((Kt & 6) !== 0) throw Error(q(327));
    var i = !u && (n & 127) === 0 && (n & l.expiredLanes) === 0 || Tu(l, n), s = i ? sb(l, n) : Cv(l, n, !0), r = i;
    do {
      if (s === 0) {
        ia && !i && fa(l, n, 0, !1);
        break;
      } else {
        if (u = l.current.alternate, r && !dp(u)) {
          s = Cv(l, n, !1), r = !1;
          continue;
        }
        if (s === 2) {
          if (r = n, l.errorRecoveryDisabledLanes & r)
            var m = 0;
          else
            m = l.pendingLanes & -536870913, m = m !== 0 ? m : m & 536870912 ? 536870912 : 0;
          if (m !== 0) {
            n = m;
            t: {
              var g = l;
              s = Xo;
              var S = g.current.memoizedState.isDehydrated;
              if (S && (Zo(g, m).flags |= 256), m = Cv(
                g,
                m,
                !1
              ), m !== 2 && m !== 6) {
                if (X0 && !S) {
                  g.errorRecoveryDisabledLanes |= r, xc |= r, s = 4;
                  break t;
                }
                r = oa, oa = s, r !== null && (oa === null ? oa = r : oa.push.apply(
                  oa,
                  r
                ));
              }
              s = m;
            }
            if (r = !1, s !== 2) continue;
          }
        }
        if (s === 1) {
          Zo(l, 0), fa(l, n, 0, !0);
          break;
        }
        t: {
          switch (i = l, r = s, r) {
            case 0:
            case 1:
              throw Error(q(345));
            case 4:
              if ((n & 4194048) !== n && (n & 62914560) !== n)
                break;
            case 6:
              fa(
                i,
                n,
                Ia,
                !Ui
              );
              break t;
            case 2:
              oa = null;
              break;
            case 3:
            case 5:
              break;
            default:
              throw Error(q(329));
          }
          if ((n & 62914560) === n && (s = dd + 300 - $l(), 10 < s)) {
            if (fa(
              i,
              n,
              Ia,
              !Ui
            ), oc(i, 0, !0) !== 0) break t;
            Ra = n, i.timeoutHandle = Xv(
              rp.bind(
                null,
                i,
                u,
                oa,
                fs,
                Ca,
                n,
                Ia,
                xc,
                wo,
                Ui,
                r,
                "Throttled",
                -0,
                0
              ),
              s
            );
            break t;
          }
          rp(
            i,
            u,
            oa,
            fs,
            Ca,
            n,
            Ia,
            xc,
            wo,
            Ui,
            r,
            null,
            -0,
            0
          );
        }
      }
      break;
    } while (!0);
    Zu(l);
  }
  function rp(l, n, u, i, s, r, m, g, S, C, N, G, D, U) {
    l.timeoutHandle = -1;
    var Z = n.subtreeFlags, I = (r & 335544064) === r;
    if (G = null, (I || Z & 8192 || (Z & 16785408) === 16785408) && (G = {
      stylesheets: null,
      count: 0,
      imgCount: 0,
      imgBytes: 0,
      suspenseyImages: [],
      waitingForImages: !0,
      waitingForViewTransition: !1,
      unsuspend: Qa
    }, Je = null, Ev(
      n,
      r,
      G
    ), I && (Z = G, I = l.containerInfo, I = (I.nodeType === 9 ? I : I.ownerDocument).__reactViewTransition, I != null && (Z.count++, Z.waitingForViewTransition = !0, Z = Md.bind(Z), I.finished.then(Z, Z))), Z = (r & 62914560) === r ? dd - $l() : (r & 4194048) === r ? Q0 - $l() : 0, Z = fg(
      G,
      Z
    ), Z !== null)) {
      Ra = r, l.cancelPendingCommit = Z(
        Sp.bind(
          null,
          l,
          n,
          r,
          u,
          i,
          s,
          m,
          g,
          S,
          C,
          N,
          G,
          null,
          D,
          U
        )
      ), fa(l, r, m, !C);
      return;
    }
    Sp(
      l,
      n,
      r,
      u,
      i,
      s,
      m,
      g,
      S,
      C,
      N,
      G
    );
  }
  function dp(l) {
    for (var n = l; ; ) {
      var u = n.tag;
      if ((u === 0 || u === 11 || u === 15) && n.flags & 16384 && (u = n.updateQueue, u !== null && (u = u.stores, u !== null)))
        for (var i = 0; i < u.length; i++) {
          var s = u[i], r = s.getSnapshot;
          s = s.value;
          try {
            if (!Ie(r(), s)) return !1;
          } catch {
            return !1;
          }
        }
      if (u = n.child, n.subtreeFlags & 16384 && u !== null)
        u.return = n, n = u;
      else {
        if (n === l) break;
        for (; n.sibling === null; ) {
          if (n.return === null || n.return === l) return !0;
          n = n.return;
        }
        n.sibling.return = n.return, n = n.sibling;
      }
    }
    return !0;
  }
  function fa(l, n, u, i) {
    n = sh(l, n), n &= ~Ke, n &= ~xc, l.suspendedLanes |= n, l.pingedLanes &= ~n, i && (l.warmLanes |= n), i = l.expirationTimes;
    for (var s = n; 0 < s; ) {
      var r = 31 - Ml(s), m = 1 << r;
      i[r] = -1, s &= ~m;
    }
    u !== 0 && Sa(l, u, n);
  }
  function J0() {
    return (Kt & 6) === 0 ? (vd(0), !1) : !0;
  }
  function Ov() {
    if (Dt !== null) {
      if (te === 0)
        var l = Dt.return;
      else
        l = Dt, Kn = Jn = null, kh(l), bo = null, To = 0, l = Dt;
      for (; l !== null; )
        Yo(l.alternate, l), l = l.return;
      Dt = null;
    }
  }
  function Zo(l, n) {
    var u = l.timeoutHandle;
    return u !== -1 && (l.timeoutHandle = -1, Np(u)), u = l.cancelPendingCommit, u !== null && (l.cancelPendingCommit = null, u()), Ra = 0, Ov(), ce = l, Dt = u = Uu(l.current, null), ut = n, te = 0, Da = null, Ui = !1, ia = Tu(l, n), X0 = !1, wo = Ia = Ke = xc = qt = ze = 0, oa = Xo = null, Ca = !1, Gl = sh(l, n), Ja(), u;
  }
  function Dv(l, n) {
    gt = null, ft.H = Jr, n === po || n === wf ? (n = xy(), te = 3) : n === Mr ? (n = xy(), te = 4) : te = n === S0 ? 8 : n !== null && typeof n == "object" && typeof n.then == "function" ? 6 : 1, Da = n, Dt === null && (ze = 1, Uo(
      l,
      ta(n, l.current)
    ));
  }
  function hp() {
    var l = Pe.current;
    return l === null ? !0 : (ut & 4194048) === ut ? Tl === null : (ut & 62914560) === ut || (ut & 536870912) !== 0 ? l === Tl : !1;
  }
  function mp() {
    var l = ft.H;
    return ft.H = Jr, l === null ? Jr : l;
  }
  function yp() {
    var l = ft.A;
    return ft.A = rd, l;
  }
  function K0() {
    ze = 4, Ui || (ut & 4194048) !== ut && Pe.current !== null || (ia = !0), (qt & 134217727) === 0 && (xc & 134217727) === 0 || ce === null || fa(
      ce,
      ut,
      Ia,
      !1
    );
  }
  function Cv(l, n, u) {
    var i = Kt;
    Kt |= 2;
    var s = mp(), r = yp();
    (ce !== l || ut !== n) && (fs = null, Zo(l, n)), n = !1;
    var m = ze;
    t: do
      try {
        if (te !== 0 && Dt !== null) {
          var g = Dt, S = Da;
          switch (te) {
            case 8:
              Ov(), m = 6;
              break t;
            case 3:
            case 2:
            case 9:
            case 6:
              Pe.current === null && (n = !0);
              var C = te;
              if (te = 0, Da = null, Bi(l, g, S, C), u && ia) {
                m = 0;
                break t;
              }
              break;
            default:
              C = te, te = 0, Da = null, Bi(l, g, S, C);
          }
        }
        fb(), m = ze;
        break;
      } catch (N) {
        Dv(l, N);
      }
    while (!0);
    return n && l.shellSuspendCounter++, Kn = Jn = null, Kt = i, ft.H = s, ft.A = r, Dt === null && (ce = null, ut = 0, Ja()), m;
  }
  function fb() {
    for (; Dt !== null; ) Rv(Dt);
  }
  function sb(l, n) {
    var u = Kt;
    Kt |= 2;
    var i = mp(), s = yp();
    ce !== l || ut !== n ? (fs = null, hd = $l() + 500, Zo(l, n)) : ia = Tu(
      l,
      n
    );
    t: do
      try {
        if (te !== 0 && Dt !== null) {
          n = Dt;
          var r = Da;
          e: switch (te) {
            case 1:
              te = 0, Da = null, Bi(l, n, r, 1);
              break;
            case 2:
            case 9:
              if (Hy(r)) {
                te = 0, Da = null, gp(n);
                break;
              }
              n = function() {
                te !== 2 && te !== 9 || ce !== l || (te = 7), Zu(l);
              }, r.then(n, n);
              break t;
            case 3:
              te = 7;
              break t;
            case 4:
              te = 5;
              break t;
            case 7:
              Hy(r) ? (te = 0, Da = null, gp(n)) : (te = 0, Da = null, Bi(l, n, r, 7));
              break;
            case 5:
              var m = null;
              switch (Dt.tag) {
                case 26:
                  m = Dt.memoizedState;
                case 5:
                case 27:
                  var g = Dt;
                  if (m ? $p(m) : g.stateNode.complete) {
                    te = 0, Da = null;
                    var S = g.sibling;
                    if (S !== null) Dt = S;
                    else {
                      var C = g.return;
                      C !== null ? (Dt = C, $0(C)) : Dt = null;
                    }
                    break e;
                  }
              }
              te = 0, Da = null, Bi(l, n, r, 5);
              break;
            case 6:
              te = 0, Da = null, Bi(l, n, r, 6);
              break;
            case 8:
              Ov(), ze = 6;
              break t;
            default:
              throw Error(q(462));
          }
        }
        vp();
        break;
      } catch (N) {
        Dv(l, N);
      }
    while (!0);
    return Kn = Jn = null, ft.H = i, ft.A = s, Kt = u, Dt !== null ? 0 : (ce = null, ut = 0, Ja(), ze);
  }
  function vp() {
    for (; Dt !== null && !nb(); )
      Rv(Dt);
  }
  function Rv(l) {
    var n = dn(l.alternate, l, Gl);
    l.memoizedProps = l.pendingProps, n === null ? $0(l) : Dt = n;
  }
  function gp(l) {
    var n = l, u = n.alternate;
    switch (n.tag) {
      case 15:
      case 0:
        n = uv(
          u,
          n,
          n.pendingProps,
          n.type,
          void 0,
          ut
        );
        break;
      case 11:
        n = uv(
          u,
          n,
          n.pendingProps,
          n.type.render,
          n.ref,
          ut
        );
        break;
      case 5:
        kh(n);
        var i = n;
        i === Ge && (vt ? (Vf(i), i.tag === 5 && i.stateNode != null && (kt = i.stateNode)) : (Vf(i), vt = !0));
      default:
        Yo(u, n), n = Dt = bc(n, Gl), n = dn(u, n, Gl);
    }
    l.memoizedProps = l.pendingProps, n === null ? $0(l) : Dt = n;
  }
  function Bi(l, n, u, i) {
    Kn = Jn = null, kh(n), bo = null, To = 0;
    var s = n.return;
    try {
      if (Pf(
        l,
        s,
        n,
        u,
        ut
      )) {
        ze = 1, Uo(
          l,
          ta(u, l.current)
        ), Dt = null;
        return;
      }
    } catch (r) {
      if (s !== null) throw Dt = s, r;
      ze = 1, Uo(
        l,
        ta(u, l.current)
      ), Dt = null;
      return;
    }
    n.flags & 32768 ? (vt || i === 1 ? l = !0 : ia || (ut & 536870912) !== 0 ? l = !1 : (Ui = l = !0, (i === 2 || i === 9 || i === 3 || i === 6) && (i = Pe.current, i !== null && i.tag === 13 && (i.flags |= 16384))), pp(n, l)) : $0(n);
  }
  function $0(l) {
    var n = l;
    do {
      if ((n.flags & 32768) !== 0) {
        pp(
          n,
          Ui
        );
        return;
      }
      l = n.return;
      var u = hn(
        n.alternate,
        n,
        Gl
      );
      if (u !== null) {
        Dt = u;
        return;
      }
      if (n = n.sibling, n !== null) {
        Dt = n;
        return;
      }
      Dt = n = l;
    } while (n !== null);
    ze === 0 && (ze = 5);
  }
  function pp(l, n) {
    do {
      var u = np(l.alternate, l);
      if (u !== null) {
        u.flags &= 32767, Dt = u;
        return;
      }
      if (u = l.return, u !== null && (u.flags |= 32768, u.subtreeFlags = 0, u.deletions = null), !n && (l = l.sibling, l !== null)) {
        Dt = l;
        return;
      }
      Dt = l = u;
    } while (l !== null);
    ze = 6, Dt = null;
  }
  function Sp(l, n, u, i, s, r, m, g, S, C, N, G) {
    l.cancelPendingCommit = null;
    do
      md();
    while (Ae !== 0);
    if ((Kt & 6) !== 0) throw Error(q(327));
    if (n !== null) {
      if (n === l.current) throw Error(q(177));
      l === ce && (Dt = ce = null, ut = 0), Qo = n, pn = l, Ra = u, L0 = s, zv = i, rb(
        l,
        n,
        u,
        m,
        g,
        S,
        G
      );
    }
  }
  function rb(l, n, u, i, s, r, m) {
    var g = n.lanes | n.childLanes;
    if (Z0 = g, g |= qh, fc(
      l,
      u,
      g,
      i,
      s,
      r
    ), Ni = null, (u & 335544064) === u ? (rs = pi(l), i = 10262) : (rs = null, i = 10256), (n.subtreeFlags & i) !== 0 || (n.flags & i) !== 0 ? (l.callbackNode = null, l.callbackPriority = 0, yb(er, function() {
      return F0(), null;
    })) : (l.callbackNode = null, l.callbackPriority = 0), N0 = !1, i = (n.flags & 13878) !== 0, (n.subtreeFlags & 13878) !== 0 || i) {
      i = ft.T, ft.T = null, s = Jt.p, Jt.p = 2, r = Kt, Kt |= 4;
      try {
        vv(l, n, u);
      } finally {
        Kt = r, Jt.p = s, ft.T = i;
      }
    }
    Ae = 1, N0 ? ss = Gp(
      m,
      l.containerInfo,
      rs,
      sa,
      Mv,
      bp,
      _v,
      F0,
      Lo
    ) : (sa(), Mv(), _v());
  }
  function Lo(l) {
    if (Ae !== 0) {
      var n = pn.onRecoverableError;
      n(l, { componentStack: null });
    }
  }
  function bp() {
    Ae === 3 && (Ae = 0, is(Qo, pn), Ae = 4);
  }
  function sa() {
    if (Ae === 1) {
      Ae = 0;
      var l = pn, n = Qo, u = Ra, i = (n.flags & 13878) !== 0;
      if ((n.subtreeFlags & 13878) !== 0 || i) {
        i = ft.T, ft.T = null;
        var s = Jt.p;
        Jt.p = 2;
        var r = Kt;
        Kt |= 4;
        try {
          cd = x0 = !1, cs(n, l, u), u = am;
          var m = Mu(l.containerInfo), g = u.focusedElem, S = u.selectionRange;
          if (m !== g && g && g.ownerDocument && vc(
            g.ownerDocument.documentElement,
            g
          )) {
            if (S !== null && Nf(g)) {
              var C = S.start, N = S.end;
              if (N === void 0 && (N = C), "selectionStart" in g)
                g.selectionStart = C, g.selectionEnd = Math.min(
                  N,
                  g.value.length
                );
              else {
                var G = g.ownerDocument || document, D = G && G.defaultView || window;
                if (D.getSelection) {
                  var U = D.getSelection(), Z = g.textContent.length, I = Math.min(S.start, Z), bt = S.end === void 0 ? I : Math.min(S.end, Z);
                  !U.extend && I > bt && (m = bt, bt = I, I = m);
                  var R = pr(
                    g,
                    I
                  ), O = pr(
                    g,
                    bt
                  );
                  if (R && O && (U.rangeCount !== 1 || U.anchorNode !== R.node || U.anchorOffset !== R.offset || U.focusNode !== O.node || U.focusOffset !== O.offset)) {
                    var _ = G.createRange();
                    _.setStart(R.node, R.offset), U.removeAllRanges(), I > bt ? (U.addRange(_), U.extend(O.node, O.offset)) : (_.setEnd(O.node, O.offset), U.addRange(_));
                  }
                }
              }
            }
            for (G = [], U = g; U = U.parentNode; )
              U.nodeType === 1 && G.push({
                element: U,
                left: U.scrollLeft,
                top: U.scrollTop
              });
            for (typeof g.focus == "function" && g.focus(), g = 0; g < G.length; g++) {
              var V = G[g];
              V.element.scrollLeft = V.left, V.element.scrollTop = V.top;
            }
          }
          wc = !!lm, am = lm = null;
        } finally {
          Kt = r, Jt.p = s, ft.T = i;
        }
      }
      l.current = n, Ae = 2;
    }
  }
  function Mv() {
    if (Ae === 2) {
      Ae = 0;
      var l = pn, n = Qo, u = (n.flags & 8772) !== 0;
      if ((n.subtreeFlags & 8772) !== 0 || u) {
        u = ft.T, ft.T = null;
        var i = Jt.p;
        Jt.p = 2;
        var s = Kt;
        Kt |= 4;
        try {
          gv(l, n.alternate, n);
        } finally {
          Kt = s, Jt.p = i, ft.T = u;
        }
      }
      Ae = 3;
    }
  }
  function _v() {
    if (Ae === 4 || Ae === 3) {
      Ae = 0;
      var l = ss;
      ss = null, Pm();
      var n = pn, u = Qo, i = Ra, s = zv, r = (i & 335544064) === i ? 10262 : 10256;
      if ((u.subtreeFlags & r) !== 0 || (u.flags & r) !== 0 ? Ae = 5 : (Ae = 0, Qo = pn = null, Jo(n, n.pendingLanes)), r = n.pendingLanes, r === 0 && (Yc = null), rh(i), u = u.stateNode, Fl && typeof Fl.onCommitFiberRoot == "function")
        try {
          Fl.onCommitFiberRoot(
            eo,
            u,
            void 0,
            (u.current.flags & 128) === 128
          );
        } catch {
        }
      if (s !== null) {
        u = ft.T, r = Jt.p, Jt.p = 2, ft.T = null;
        try {
          for (var m = n.onRecoverableError, g = 0; g < s.length; g++) {
            var S = s[g];
            m(S.value, {
              componentStack: S.stack
            });
          }
        } finally {
          ft.T = u, Jt.p = r;
        }
      }
      if (s = Ni, m = rs, rs = null, s !== null && (Ni = null, m === null && (m = []), l !== null))
        for (S = 0; S < s.length; S++)
          u = (0, s[S])(
            m
          ), u !== void 0 && l.finished.finally(u);
      (Ra & 3) !== 0 && md(), Zu(n), r = n.pendingLanes, (i & 261930) !== 0 && (r & 42) !== 0 ? n === Hi ? qc++ : (qc = 0, Hi = n) : (qc = 0, Hi = null), vd(0);
    }
  }
  function Jo(l, n) {
    (l.pooledCacheLanes &= n) === 0 && (n = l.pooledCache, n != null && (l.pooledCache = null, jt(n)));
  }
  function md() {
    return ss !== null && (ss.skipTransition(), ss = null), sa(), Mv(), _v(), F0();
  }
  function F0() {
    if (Ae !== 5) return !1;
    var l = pn, n = Z0;
    Z0 = 0;
    var u = rh(Ra), i = ft.T, s = Jt.p;
    try {
      Jt.p = 32 > u ? 32 : u, ft.T = null, u = L0, L0 = null;
      var r = pn, m = Ra;
      if (Ae = 0, Qo = pn = null, Ra = 0, (Kt & 6) !== 0) throw Error(q(331));
      var g = Kt;
      if (Kt |= 4, V0(r.current), Tv(
        r,
        r.current,
        m,
        u
      ), Kt = g, vd(0, !1), Fl && typeof Fl.onPostCommitFiberRoot == "function")
        try {
          Fl.onPostCommitFiberRoot(eo, r);
        } catch {
        }
      return !0;
    } finally {
      Jt.p = s, ft.T = i, Jo(l, n);
    }
  }
  function Uv(l, n, u) {
    n = ta(u, n), n = p0(l.stateNode, n, 2), l = Ve(l, n, 2), l !== null && (ai(l, 2), Zu(l));
  }
  function $t(l, n, u) {
    if (l.tag === 3)
      Uv(l, l, u);
    else
      for (; n !== null; ) {
        if (n.tag === 3) {
          Uv(
            n,
            l,
            u
          );
          break;
        } else if (n.tag === 1) {
          var i = n.stateNode;
          if (typeof n.type.getDerivedStateFromError == "function" || typeof i.componentDidCatch == "function" && (Yc === null || !Yc.has(i))) {
            l = ta(u, l), u = lv(2), i = Ve(n, u, 2), i !== null && (av(
              u,
              i,
              n,
              l
            ), ai(i, 2), Zu(i));
            break;
          }
        }
        n = n.return;
      }
  }
  function Nv(l, n, u) {
    var i = l.pingCache;
    if (i === null) {
      i = l.pingCache = new w0();
      var s = /* @__PURE__ */ new Set();
      i.set(n, s);
    } else
      s = i.get(n), s === void 0 && (s = /* @__PURE__ */ new Set(), i.set(n, s));
    s.has(u) || (X0 = !0, s.add(u), l = db.bind(null, l, n, u), n.then(l, l));
  }
  function db(l, n, u) {
    var i = l.pingCache;
    i !== null && i.delete(n), l.pingedLanes |= l.suspendedLanes & u, l.warmLanes &= ~u, ce === l && (ut & u) === u && ((ze === 4 || ze === 3 && (ut & 62914560) === ut && 300 > $l() - dd) && (Kt & 2) === 0 ? Zo(l, 0) : Ke |= u, wo === ut && (wo = 0)), Zu(l);
  }
  function Tp(l, n) {
    n === 0 && (n = ey()), l = yi(l, n), l !== null && (ai(l, n), Zu(l));
  }
  function hb(l) {
    var n = l.memoizedState, u = 0;
    n !== null && (u = n.retryLane), Tp(l, u);
  }
  function mb(l, n) {
    var u = 0;
    switch (l.tag) {
      case 31:
      case 13:
        var i = l.stateNode, s = l.memoizedState;
        s !== null && (u = s.retryLane);
        break;
      case 19:
        i = l.stateNode;
        break;
      case 22:
        i = l.stateNode._retryCache;
        break;
      default:
        throw Error(q(314));
    }
    i !== null && i.delete(n), Tp(l, u);
  }
  function yb(l, n) {
    return to(l, n);
  }
  var Ko = null, hs = null, W0 = !1, yd = !1, Hv = !1, Qu = 0;
  function Zu(l) {
    l !== hs && l.next === null && (hs === null ? Ko = hs = l : hs = hs.next = l), yd = !0, W0 || (W0 = !0, Ap());
  }
  function vd(l, n) {
    if (!Hv && yd) {
      Hv = !0;
      do
        for (var u = !1, i = Ko; i !== null; ) {
          if (l !== 0) {
            var s = i.pendingLanes;
            if (s === 0) var r = 0;
            else {
              var m = i.suspendedLanes, g = i.pingedLanes;
              r = (1 << 31 - Ml(42 | l) + 1) - 1, r &= s & ~(m & ~g), r = r & 201326741 ? r & 201326741 | 1 : r ? r | 2 : 0;
            }
            r !== 0 && (u = !0, _a(i, r));
          } else
            r = ut, r = oc(
              i,
              i === ce ? r : 0,
              i.cancelPendingCommit !== null || i.timeoutHandle !== -1
            ), (r & 3) === 0 || Tu(i, r) || (u = !0, _a(i, r));
          i = i.next;
        }
      while (u);
      Hv = !1;
    }
  }
  function Ep() {
    I0();
  }
  function I0() {
    yd = W0 = !1;
    var l = 0;
    Qu !== 0 && Sb() && (l = Qu);
    for (var n = $l(), u = null, i = Ko; i !== null; ) {
      var s = i.next, r = k0(i, n);
      r === 0 ? (i.next = null, u === null ? Ko = s : u.next = s, s === null && (hs = u)) : (u = i, (l !== 0 || (r & 3) !== 0) && (yd = !0)), i = s;
    }
    Ae !== 0 && Ae !== 5 || vd(l), Qu !== 0 && (Qu = 0);
  }
  function k0(l, n) {
    for (var u = l.suspendedLanes, i = l.pingedLanes, s = l.expirationTimes, r = l.pendingLanes & -62914561; 0 < r; ) {
      var m = 31 - Ml(r), g = 1 << m, S = s[m];
      S === -1 ? ((g & u) === 0 || (g & i) !== 0) && (s[m] = v1(g, n)) : S <= n && (l.expiredLanes |= g), r &= ~g;
    }
    if (n = ce, u = ut, u = oc(
      l,
      l === n ? u : 0,
      l.cancelPendingCommit !== null || l.timeoutHandle !== -1
    ), i = l.callbackNode, u === 0 || l === n && (te === 2 || te === 9) || l.cancelPendingCommit !== null)
      return i !== null && i !== null && oh(i), l.callbackNode = null, l.callbackPriority = 0;
    if ((u & 3) === 0 || Tu(l, u)) {
      if (n = u & -u, n === l.callbackPriority) return n;
      switch (i !== null && oh(i), rh(u)) {
        case 2:
        case 8:
          u = ty;
          break;
        case 32:
          u = er;
          break;
        case 268435456:
          u = fh;
          break;
        default:
          u = er;
      }
      return i = zp.bind(null, l), u = to(u, i), l.callbackPriority = n, l.callbackNode = u, n;
    }
    return i !== null && i !== null && oh(i), l.callbackPriority = 2, l.callbackNode = null, 2;
  }
  function zp(l, n) {
    if (Ae !== 0 && Ae !== 5)
      return l.callbackNode = null, l.callbackPriority = 0, null;
    var u = l.callbackNode;
    if (md() && l.callbackNode !== u)
      return null;
    var i = ut;
    return i = oc(
      l,
      l === ce ? i : 0,
      l.cancelPendingCommit !== null || l.timeoutHandle !== -1
    ), i === 0 ? null : (Av(l, i, n), k0(l, $l()), l.callbackNode != null && l.callbackNode === u ? zp.bind(null, l) : null);
  }
  function _a(l, n) {
    if (md()) return null;
    Av(l, n, !0);
  }
  function Ap() {
    Hp(function() {
      (Kt & 6) !== 0 ? to(
        d1,
        Ep
      ) : I0();
    });
  }
  function P0() {
    if (Qu === 0) {
      var l = Dc;
      l === 0 && (l = ic, ic <<= 1, (ic & 261888) === 0 && (ic = 256)), Qu = l;
    }
    return Qu;
  }
  function tm(l) {
    return l == null || typeof l == "symbol" || typeof l == "boolean" ? null : typeof l == "function" ? l : io(l);
  }
  function Op(l, n, u, i, s) {
    if (n === "submit" && u && u.stateNode === s) {
      var r = tm(
        (s[_l] || null).action
      ), m = i.submitter;
      m && (n = (n = m[_l] || null) ? tm(n.formAction) : m.getAttribute("formAction"), n !== null && (r = n, m = null));
      var g = new bh(
        "action",
        "action",
        null,
        i,
        s
      );
      l.push({
        event: g,
        listeners: [
          {
            instance: null,
            listener: function() {
              if (i.defaultPrevented) {
                if (Qu !== 0) {
                  var S = new FormData(s, m);
                  rn(
                    u,
                    {
                      pending: !0,
                      data: S,
                      method: s.method,
                      action: r
                    },
                    null,
                    S
                  );
                }
              } else
                typeof r == "function" && (g.preventDefault(), S = new FormData(s, m), rn(
                  u,
                  {
                    pending: !0,
                    data: S,
                    method: s.method,
                    action: r
                  },
                  r,
                  S
                ));
            },
            currentTarget: s
          }
        ]
      });
    }
  }
  for (var Bv = 0; Bv < Il.length; Bv++) {
    var xv = Il[Bv], vb = xv.toLowerCase(), gb = xv[0].toUpperCase() + xv.slice(1);
    Le(
      vb,
      "on" + gb
    );
  }
  Le(q1, "onAnimationEnd"), Le(Gn, "onAnimationIteration"), Le(G1, "onAnimationStart"), Le("dblclick", "onDoubleClick"), Le("focusin", "onFocus"), Le("focusout", "onBlur"), Le(pc, "onTransitionRun"), Le(Yh, "onTransitionStart"), Le(br, "onTransitionCancel"), Le(Tr, "onTransitionEnd"), ni("onMouseEnter", ["mouseout", "mouseover"]), ni("onMouseLeave", ["mouseout", "mouseover"]), ni("onPointerEnter", ["pointerout", "pointerover"]), ni("onPointerLeave", ["pointerout", "pointerover"]), cn(
    "onChange",
    "change click focusin focusout input keydown keyup selectionchange".split(" ")
  ), cn(
    "onSelect",
    "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
      " "
    )
  ), cn("onBeforeInput", [
    "compositionend",
    "keypress",
    "textInput",
    "paste"
  ]), cn(
    "onCompositionEnd",
    "compositionend focusout keydown keypress keyup mousedown".split(" ")
  ), cn(
    "onCompositionStart",
    "compositionstart focusout keydown keypress keyup mousedown".split(" ")
  ), cn(
    "onCompositionUpdate",
    "compositionupdate focusout keydown keypress keyup mousedown".split(" ")
  );
  var gd = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
    " "
  ), Dp = new Set(
    "beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(gd)
  );
  function Cp(l, n) {
    n = (n & 4) !== 0;
    for (var u = 0; u < l.length; u++) {
      var i = l[u], s = i.event;
      i = i.listeners;
      t: {
        var r = void 0;
        if (n)
          for (var m = i.length - 1; 0 <= m; m--) {
            var g = i[m], S = g.instance, C = g.currentTarget;
            if (g = g.listener, S !== r && s.isPropagationStopped())
              break t;
            r = g, s.currentTarget = C;
            try {
              r(s);
            } catch (N) {
              xf(N);
            }
            s.currentTarget = null, r = S;
          }
        else
          for (m = 0; m < i.length; m++) {
            if (g = i[m], S = g.instance, C = g.currentTarget, g = g.listener, S !== r && s.isPropagationStopped())
              break t;
            r = g, s.currentTarget = C;
            try {
              r(s);
            } catch (N) {
              xf(N);
            }
            s.currentTarget = null, r = S;
          }
      }
    }
  }
  function Ut(l, n) {
    var u = n[ny];
    u === void 0 && (u = n[ny] = /* @__PURE__ */ new Set());
    var i = l + "__bubble";
    u.has(i) || (Yv(n, l, 2, !1), u.add(i));
  }
  function pd(l, n, u) {
    var i = 0;
    n && (i |= 4), Yv(
      u,
      l,
      i,
      n
    );
  }
  var xi = "_reactListening" + Math.random().toString(36).slice(2);
  function em(l) {
    if (!l[xi]) {
      l[xi] = !0, dh.forEach(function(u) {
        u !== "selectionchange" && (Dp.has(u) || pd(u, !1, l), pd(u, !0, l));
      });
      var n = l.nodeType === 9 ? l : l.ownerDocument;
      n === null || n[xi] || (n[xi] = !0, pd("selectionchange", !1, n));
    }
  }
  function Yv(l, n, u, i) {
    switch (Ip(n)) {
      case 2:
        var s = Xc;
        break;
      case 8:
        s = zl;
        break;
      default:
        s = Al;
    }
    u = s.bind(
      null,
      n,
      u,
      l
    ), s = void 0, !hy || n !== "touchstart" && n !== "touchmove" && n !== "wheel" || (s = !0), i ? s !== void 0 ? l.addEventListener(n, u, {
      capture: !0,
      passive: s
    }) : l.addEventListener(n, u, !0) : s !== void 0 ? l.addEventListener(n, u, {
      passive: s
    }) : l.addEventListener(n, u, !1);
  }
  function ms(l, n, u, i, s) {
    var r = i;
    if ((n & 1) === 0 && (n & 2) === 0 && i !== null)
      t: for (; ; ) {
        if (i === null) return;
        var m = i.tag;
        if (m === 3 || m === 4) {
          var g = i.stateNode.containerInfo;
          if (g === s) break;
          if (m === 4)
            for (m = i.return; m !== null; ) {
              var S = m.tag;
              if ((S === 3 || S === 4) && m.stateNode.containerInfo === s)
                return;
              m = m.return;
            }
          for (; g !== null; ) {
            if (m = We(g), m === null) return;
            if (S = m.tag, S === 5 || S === 6 || S === 26 || S === 27) {
              i = r = m;
              continue t;
            }
            g = g.parentNode;
          }
        }
        i = i.return;
      }
    O1(function() {
      var C = r, N = pl(u), G = [];
      t: {
        var D = Ta.get(l);
        if (D !== void 0) {
          var U = bh, Z = l;
          switch (l) {
            case "keypress":
              if (hr(u) === 0) break t;
            case "keydown":
            case "keyup":
              U = gy;
              break;
            case "focusin":
              Z = "focus", U = Za;
              break;
            case "focusout":
              Z = "blur", U = Za;
              break;
            case "beforeblur":
            case "afterblur":
              U = Za;
              break;
            case "click":
              if (u.button === 2) break t;
            case "auxclick":
            case "dblclick":
            case "mousedown":
            case "mousemove":
            case "mouseup":
            case "mouseout":
            case "mouseover":
            case "contextmenu":
              U = zh;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              U = oo;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              U = U1;
              break;
            case q1:
            case Gn:
            case G1:
              U = R1;
              break;
            case Tr:
              U = oi;
              break;
            case "scroll":
            case "scrollend":
              U = yy;
              break;
            case "wheel":
              U = Dh;
              break;
            case "copy":
            case "cut":
            case "paste":
              U = cb;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              U = py;
              break;
            case "submit":
              U = Sy;
              break;
            case "toggle":
            case "beforetoggle":
              U = Nl;
          }
          var I = (n & 4) !== 0, bt = !I && (l === "scroll" || l === "scrollend"), R = I ? D !== null ? D + "Capture" : null : D;
          I = [];
          for (var O = C, _; O !== null; ) {
            var V = O;
            if (_ = V.stateNode, V = V.tag, V !== 5 && V !== 26 && V !== 27 || _ === null || R === null || (V = rr(O, R), V != null && I.push(
              Lu(O, V, _)
            )), bt) break;
            O = O.return;
          }
          0 < I.length && (D = new U(
            D,
            Z,
            null,
            u,
            N
          ), G.push({ event: D, listeners: I }));
        }
      }
      if ((n & 7) === 0) {
        t: {
          if (U = l === "mouseover" || l === "pointerover", D = l === "mouseout" || l === "pointerout", U && u !== gh && (Z = u.relatedTarget || u.fromElement) && (We(Z) || Z[ao]))
            break t;
          (D || U) && (Z = N.window === N ? N : (U = N.ownerDocument) ? U.defaultView || U.parentWindow : window, D ? (U = u.relatedTarget || u.toElement, D = C, U = U ? We(U) : null, U !== null && (bt = qa(U), I = U.tag, U !== bt || I !== 5 && I !== 27 && I !== 6) && (U = null)) : (D = null, U = C), D !== U && (I = zh, V = "onMouseLeave", R = "onMouseEnter", O = "mouse", (l === "pointerout" || l === "pointerover") && (I = py, V = "onPointerLeave", R = "onPointerEnter", O = "pointer"), bt = D == null ? Z : xn(D), _ = U == null ? Z : xn(U), Z = new I(
            V,
            O + "leave",
            D,
            u,
            N
          ), Z.target = bt, Z.relatedTarget = _, V = null, We(N) === C && (I = new I(
            R,
            O + "enter",
            U,
            u,
            N
          ), I.target = _, I.relatedTarget = bt, V = I), bt = V, I = D && U ? ga(
            D,
            U,
            Rp
          ) : null, D !== null && Mp(
            G,
            Z,
            D,
            I,
            !1
          ), U !== null && bt !== null && Mp(
            G,
            bt,
            U,
            I,
            !0
          )));
        }
        t: {
          if (D = C ? xn(C) : window, U = D.nodeName && D.nodeName.toLowerCase(), U === "select" || U === "input" && D.type === "file")
            var k = gr;
          else if (Mh(D))
            if (_h)
              k = Bh;
            else {
              k = si;
              var Bt = Hh;
            }
          else
            U = D.nodeName, !U || U.toLowerCase() !== "input" || D.type !== "checkbox" && D.type !== "radio" ? C && vh(C.elementType) && (k = gr) : k = Y1;
          if (k && (k = k(l, C))) {
            Ay(
              G,
              k,
              u,
              N
            );
            break t;
          }
          Bt && Bt(l, D, C);
        }
        switch (Bt = C ? xn(C) : window, l) {
          case "focusin":
            (Mh(Bt) || Bt.contentEditable === "true") && (on = Bt, Hf = C, qn = null);
            break;
          case "focusout":
            qn = Hf = on = null;
            break;
          case "mousedown":
            se = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            se = !1, Sr(G, u, N);
            break;
          case "selectionchange":
            if (Dy) break;
          case "keydown":
          case "keyup":
            Sr(G, u, N);
        }
        var F;
        if (_f)
          t: {
            switch (l) {
              case "compositionstart":
                var ct = "onCompositionStart";
                break t;
              case "compositionend":
                ct = "onCompositionEnd";
                break t;
              case "compositionupdate":
                ct = "onCompositionUpdate";
                break t;
            }
            ct = void 0;
          }
        else
          so ? Ch(l, u) && (ct = "onCompositionEnd") : l === "keydown" && u.keyCode === 229 && (ct = "onCompositionStart");
        ct && (Ty && u.locale !== "ko" && (so || ct !== "onCompositionStart" ? ct === "onCompositionEnd" && so && (F = my()) : (ci = N, Cf = "value" in ci ? ci.value : ci.textContent, so = !0)), Bt = Yi(C, ct), 0 < Bt.length && (ct = new yr(
          ct,
          l,
          null,
          u,
          N
        ), G.push({ event: ct, listeners: Bt }), F ? ct.data = F : (F = Ru(u), F !== null && (ct.data = F)))), (F = B1 ? zy(l, u) : Rh(l, u)) && (ct = Yi(C, "onBeforeInput"), 0 < ct.length && (Bt = new yr(
          "onBeforeInput",
          "beforeinput",
          null,
          u,
          N
        ), G.push({
          event: Bt,
          listeners: ct
        }), Bt.data = F)), Op(
          G,
          l,
          C,
          u,
          N
        );
      }
      Cp(G, n);
    });
  }
  function Lu(l, n, u) {
    return {
      instance: l,
      listener: n,
      currentTarget: u
    };
  }
  function Yi(l, n) {
    for (var u = n + "Capture", i = []; l !== null; ) {
      var s = l, r = s.stateNode;
      if (s = s.tag, s !== 5 && s !== 26 && s !== 27 || r === null || (s = rr(l, u), s != null && i.unshift(
        Lu(l, s, r)
      ), s = rr(l, n), s != null && i.push(
        Lu(l, s, r)
      )), l.tag === 3) return i;
      l = l.return;
    }
    return [];
  }
  function Rp(l) {
    if (l === null) return null;
    do
      l = l.return;
    while (l && l.tag !== 5 && l.tag !== 27);
    return l || null;
  }
  function Mp(l, n, u, i, s) {
    for (var r = n._reactName, m = []; u !== null && u !== i; ) {
      var g = u, S = g.alternate, C = g.stateNode;
      if (g = g.tag, S !== null && S === i) break;
      g !== 5 && g !== 26 && g !== 27 || C === null || (S = C, s ? (C = rr(u, r), C != null && m.unshift(
        Lu(u, C, S)
      )) : s || (C = rr(u, r), C != null && m.push(
        Lu(u, C, S)
      ))), u = u.return;
    }
    m.length !== 0 && l.push({ event: n, listeners: m });
  }
  var ys = /\r\n?/g, Sd = /\u0000|\uFFFD/g;
  function qv(l) {
    return (typeof l == "string" ? l : "" + l).replace(ys, `
`).replace(Sd, "");
  }
  function bd(l, n) {
    return n = qv(n), qv(l) === n;
  }
  function Ft(l, n, u, i, s, r) {
    switch (u) {
      case "children":
        if (typeof i == "string")
          n === "body" || n === "textarea" && i === "" || Eu(l, i);
        else if (typeof i == "number" || typeof i == "bigint")
          n !== "body" && Eu(l, "" + i);
        else return;
        break;
      case "className":
        fr(l, "class", i);
        break;
      case "tabIndex":
        fr(l, "tabindex", i);
        break;
      case "dir":
      case "role":
      case "viewBox":
      case "width":
      case "height":
        fr(l, u, i);
        break;
      case "style":
        ry(l, i, r);
        return;
      case "data":
        if (n !== "object") {
          fr(l, "data", i);
          break;
        }
      case "src":
      case "href":
        if (i === "" && (n !== "a" || u !== "href")) {
          l.removeAttribute(u);
          break;
        }
        if (i == null || typeof i == "function" || typeof i == "symbol" || typeof i == "boolean") {
          l.removeAttribute(u);
          break;
        }
        i = io(i), l.setAttribute(u, i);
        break;
      case "action":
      case "formAction":
        if (typeof i == "function") {
          l.setAttribute(
            u,
            "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')"
          );
          break;
        } else
          typeof r == "function" && (u === "formAction" ? (n !== "input" && Ft(l, n, "name", s.name, s, null), Ft(
            l,
            n,
            "formEncType",
            s.formEncType,
            s,
            null
          ), Ft(
            l,
            n,
            "formMethod",
            s.formMethod,
            s,
            null
          ), Ft(
            l,
            n,
            "formTarget",
            s.formTarget,
            s,
            null
          )) : (Ft(l, n, "encType", s.encType, s, null), Ft(l, n, "method", s.method, s, null), Ft(l, n, "target", s.target, s, null)));
        if (i == null || typeof i == "symbol" || typeof i == "boolean") {
          l.removeAttribute(u);
          break;
        }
        i = io(i), l.setAttribute(u, i);
        break;
      case "onClick":
        i != null && (l.onclick = Qa);
        return;
      case "onScroll":
        i != null && Ut("scroll", l);
        return;
      case "onScrollEnd":
        i != null && Ut("scrollend", l);
        return;
      case "dangerouslySetInnerHTML":
        if (i != null) {
          if (typeof i != "object" || !("__html" in i))
            throw Error(q(61));
          if (u = i.__html, u != null) {
            if (s.children != null) throw Error(q(60));
            r?.__html !== u && (l.innerHTML = u);
          }
        }
        break;
      case "multiple":
        l.multiple = i && typeof i != "function" && typeof i != "symbol";
        break;
      case "muted":
        l.muted = i && typeof i != "function" && typeof i != "symbol";
        break;
      case "suppressContentEditableWarning":
      case "suppressHydrationWarning":
      case "defaultValue":
      case "defaultChecked":
      case "innerHTML":
      case "ref":
        break;
      case "autoFocus":
        break;
      case "xlinkHref":
        if (i == null || typeof i == "function" || typeof i == "boolean" || typeof i == "symbol") {
          l.removeAttribute("xlink:href");
          break;
        }
        u = io(i), l.setAttributeNS(
          "http://www.w3.org/1999/xlink",
          "xlink:href",
          u
        );
        break;
      case "contentEditable":
      case "spellCheck":
      case "draggable":
      case "value":
      case "autoReverse":
      case "externalResourcesRequired":
      case "focusable":
      case "preserveAlpha":
        i != null && typeof i != "function" && typeof i != "symbol" ? l.setAttribute(u, i) : l.removeAttribute(u);
        break;
      case "inert":
      case "allowFullScreen":
      case "async":
      case "autoPlay":
      case "controls":
      case "credentialless":
      case "default":
      case "defer":
      case "disabled":
      case "disablePictureInPicture":
      case "disableRemotePlayback":
      case "formNoValidate":
      case "hidden":
      case "loop":
      case "noModule":
      case "noValidate":
      case "open":
      case "playsInline":
      case "readOnly":
      case "required":
      case "reversed":
      case "scoped":
      case "seamless":
      case "itemScope":
        i && typeof i != "function" && typeof i != "symbol" ? l.setAttribute(u, "") : l.removeAttribute(u);
        break;
      case "capture":
      case "download":
        i === !0 ? l.setAttribute(u, "") : i !== !1 && i != null && typeof i != "function" && typeof i != "symbol" ? l.setAttribute(u, i) : l.removeAttribute(u);
        break;
      case "cols":
      case "rows":
      case "size":
      case "span":
        i != null && typeof i != "function" && typeof i != "symbol" && !isNaN(i) && 1 <= i ? l.setAttribute(u, i) : l.removeAttribute(u);
        break;
      case "rowSpan":
      case "start":
        i == null || typeof i == "function" || typeof i == "symbol" || isNaN(i) ? l.removeAttribute(u) : l.setAttribute(u, i);
        break;
      case "popover":
        Ut("beforetoggle", l), Ut("toggle", l), or(l, "popover", i);
        break;
      case "xlinkActuate":
        sc(
          l,
          "http://www.w3.org/1999/xlink",
          "xlink:actuate",
          i
        );
        break;
      case "xlinkArcrole":
        sc(
          l,
          "http://www.w3.org/1999/xlink",
          "xlink:arcrole",
          i
        );
        break;
      case "xlinkRole":
        sc(
          l,
          "http://www.w3.org/1999/xlink",
          "xlink:role",
          i
        );
        break;
      case "xlinkShow":
        sc(
          l,
          "http://www.w3.org/1999/xlink",
          "xlink:show",
          i
        );
        break;
      case "xlinkTitle":
        sc(
          l,
          "http://www.w3.org/1999/xlink",
          "xlink:title",
          i
        );
        break;
      case "xlinkType":
        sc(
          l,
          "http://www.w3.org/1999/xlink",
          "xlink:type",
          i
        );
        break;
      case "xmlBase":
        sc(
          l,
          "http://www.w3.org/XML/1998/namespace",
          "xml:base",
          i
        );
        break;
      case "xmlLang":
        sc(
          l,
          "http://www.w3.org/XML/1998/namespace",
          "xml:lang",
          i
        );
        break;
      case "xmlSpace":
        sc(
          l,
          "http://www.w3.org/XML/1998/namespace",
          "xml:space",
          i
        );
        break;
      case "is":
        or(l, "is", i);
        break;
      case "innerText":
      case "textContent":
        return;
      default:
        if (!(2 < u.length) || u[0] !== "o" && u[0] !== "O" || u[1] !== "n" && u[1] !== "N")
          u = sr.get(u) || u, or(l, u, i);
        else return;
    }
    Vt = !0;
  }
  function Td(l, n, u, i, s, r) {
    switch (u) {
      case "style":
        ry(l, i, r);
        return;
      case "dangerouslySetInnerHTML":
        if (i != null) {
          if (typeof i != "object" || !("__html" in i))
            throw Error(q(61));
          if (u = i.__html, u != null) {
            if (s.children != null) throw Error(q(60));
            r?.__html !== u && (l.innerHTML = u);
          }
        }
        break;
      case "children":
        if (typeof i == "string") Eu(l, i);
        else if (typeof i == "number" || typeof i == "bigint")
          Eu(l, "" + i);
        else return;
        break;
      case "onScroll":
        i != null && Ut("scroll", l);
        return;
      case "onScrollEnd":
        i != null && Ut("scrollend", l);
        return;
      case "onClick":
        i != null && (l.onclick = Qa);
        return;
      case "suppressContentEditableWarning":
      case "suppressHydrationWarning":
      case "innerHTML":
      case "ref":
        return;
      case "innerText":
      case "textContent":
        return;
      default:
        if (!zf.hasOwnProperty(u))
          t: {
            if (u[0] === "o" && u[1] === "n" && (s = u.endsWith("Capture"), r = u.slice(2, s ? u.length - 7 : void 0), n = l[_l] || null, n = n != null ? n[u] : null, typeof n == "function" && l.removeEventListener(r, n, s), typeof i == "function")) {
              typeof n != "function" && n !== null && (u in l ? l[u] = null : l.hasAttribute(u) && l.removeAttribute(u)), l.addEventListener(r, i, s);
              break t;
            }
            Vt = !0, u in l ? l[u] = i : i === !0 ? l.setAttribute(u, "") : or(l, u, i);
          }
        return;
    }
    Vt = !0;
  }
  function fl(l, n, u) {
    switch (n) {
      case "div":
      case "span":
      case "svg":
      case "path":
      case "a":
      case "g":
      case "p":
      case "li":
        break;
      case "img":
        Ut("error", l), Ut("load", l);
        var i = !1, s = !1, r;
        for (r in u)
          if (u.hasOwnProperty(r)) {
            var m = u[r];
            if (m != null)
              switch (r) {
                case "src":
                  i = !0;
                  break;
                case "srcSet":
                  s = !0;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  throw Error(q(137, n));
                default:
                  Ft(l, n, r, m, u, null);
              }
          }
        s && Ft(l, n, "srcSet", u.srcSet, u, null), i && Ft(l, n, "src", u.src, u, null);
        return;
      case "input":
        Ut("invalid", l);
        var g = r = m = s = null, S = null, C = null;
        for (i in u)
          if (u.hasOwnProperty(i)) {
            var N = u[i];
            if (N != null)
              switch (i) {
                case "name":
                  s = N;
                  break;
                case "type":
                  m = N;
                  break;
                case "checked":
                  S = N;
                  break;
                case "defaultChecked":
                  C = N;
                  break;
                case "value":
                  r = N;
                  break;
                case "defaultValue":
                  g = N;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  if (N != null)
                    throw Error(q(137, n));
                  break;
                default:
                  Ft(l, n, i, N, u, null);
              }
          }
        fy(
          l,
          r,
          g,
          S,
          C,
          m,
          s,
          !1
        );
        return;
      case "select":
        Ut("invalid", l), i = m = r = null;
        for (s in u)
          if (u.hasOwnProperty(s) && (g = u[s], g != null))
            switch (s) {
              case "value":
                r = g;
                break;
              case "defaultValue":
                m = g;
                break;
              case "multiple":
                i = g;
              default:
                Ft(l, n, s, g, u, null);
            }
        n = r, u = m, l.multiple = !!i, n != null ? Af(l, !!i, n, !1) : u != null && Af(l, !!i, u, !0);
        return;
      case "textarea":
        Ut("invalid", l), r = s = i = null;
        for (m in u)
          if (u.hasOwnProperty(m) && (g = u[m], g != null))
            switch (m) {
              case "value":
                i = g;
                break;
              case "defaultValue":
                s = g;
                break;
              case "children":
                r = g;
                break;
              case "dangerouslySetInnerHTML":
                if (g != null) throw Error(q(91));
                break;
              default:
                Ft(l, n, m, g, u, null);
            }
        z1(l, i, s, r);
        return;
      case "option":
        for (S in u)
          u.hasOwnProperty(S) && (i = u[S], i != null) && (S === "selected" ? l.selected = i && typeof i != "function" && typeof i != "symbol" : Ft(l, n, S, i, u, null));
        return;
      case "dialog":
        Ut("beforetoggle", l), Ut("toggle", l), Ut("cancel", l), Ut("close", l);
        break;
      case "iframe":
      case "object":
        Ut("load", l);
        break;
      case "video":
      case "audio":
        for (i = 0; i < gd.length; i++)
          Ut(gd[i], l);
        break;
      case "image":
        Ut("error", l), Ut("load", l);
        break;
      case "details":
        Ut("toggle", l);
        break;
      case "embed":
      case "source":
      case "link":
        Ut("error", l), Ut("load", l);
      case "area":
      case "base":
      case "br":
      case "col":
      case "hr":
      case "keygen":
      case "meta":
      case "param":
      case "track":
      case "wbr":
      case "menuitem":
        for (C in u)
          if (u.hasOwnProperty(C) && (i = u[C], i != null))
            switch (C) {
              case "children":
              case "dangerouslySetInnerHTML":
                throw Error(q(137, n));
              default:
                Ft(l, n, C, i, u, null);
            }
        return;
      default:
        if (vh(n)) {
          for (N in u)
            u.hasOwnProperty(N) && (i = u[N], i !== void 0 && Td(
              l,
              n,
              N,
              i,
              u,
              void 0
            ));
          return;
        }
    }
    for (g in u)
      u.hasOwnProperty(g) && (i = u[g], i != null && Ft(l, n, g, i, u, null));
  }
  var Gv = {};
  function pb(l, n, u, i) {
    switch (n) {
      case "div":
      case "span":
      case "svg":
      case "path":
      case "a":
      case "g":
      case "p":
      case "li":
        break;
      case "input":
        var s = null, r = null, m = null, g = null, S = null, C = null, N = null;
        for (U in u) {
          var G = u[U];
          if (u.hasOwnProperty(U) && G != null)
            switch (U) {
              case "checked":
                break;
              case "value":
                break;
              case "defaultValue":
                S = G;
              default:
                i.hasOwnProperty(U) || Ft(l, n, U, null, i, G);
            }
        }
        for (var D in i) {
          var U = i[D];
          if (G = u[D], i.hasOwnProperty(D) && (U != null || G != null))
            switch (D) {
              case "type":
                U !== G && (Vt = !0), r = U;
                break;
              case "name":
                U !== G && (Vt = !0), s = U;
                break;
              case "checked":
                U !== G && (Vt = !0), C = U;
                break;
              case "defaultChecked":
                U !== G && (Vt = !0), N = U;
                break;
              case "value":
                U !== G && (Vt = !0), m = U;
                break;
              case "defaultValue":
                U !== G && (Vt = !0), g = U;
                break;
              case "children":
              case "dangerouslySetInnerHTML":
                if (U != null)
                  throw Error(q(137, n));
                break;
              default:
                U !== G && Ft(
                  l,
                  n,
                  D,
                  U,
                  i,
                  G
                );
            }
        }
        co(
          l,
          m,
          g,
          S,
          C,
          N,
          r,
          s
        );
        return;
      case "select":
        U = m = g = D = null;
        for (r in u)
          if (S = u[r], u.hasOwnProperty(r) && S != null)
            switch (r) {
              case "value":
                break;
              case "multiple":
                U = S;
              default:
                i.hasOwnProperty(r) || Ft(
                  l,
                  n,
                  r,
                  null,
                  i,
                  S
                );
            }
        for (s in i)
          if (r = i[s], S = u[s], i.hasOwnProperty(s) && (r != null || S != null))
            switch (s) {
              case "value":
                r !== S && (Vt = !0), D = r;
                break;
              case "defaultValue":
                r !== S && (Vt = !0), g = r;
                break;
              case "multiple":
                r !== S && (Vt = !0), m = r;
              default:
                r !== S && Ft(
                  l,
                  n,
                  s,
                  r,
                  i,
                  S
                );
            }
        n = g, u = m, i = U, D != null ? Af(l, !!u, D, !1) : !!i != !!u && (n != null ? Af(l, !!u, n, !0) : Af(l, !!u, u ? [] : "", !1));
        return;
      case "textarea":
        U = D = null;
        for (g in u)
          if (s = u[g], u.hasOwnProperty(g) && s != null && !i.hasOwnProperty(g))
            switch (g) {
              case "value":
                break;
              case "children":
                break;
              default:
                Ft(l, n, g, null, i, s);
            }
        for (m in i)
          if (s = i[m], r = u[m], i.hasOwnProperty(m) && (s != null || r != null))
            switch (m) {
              case "value":
                s !== r && (Vt = !0), D = s;
                break;
              case "defaultValue":
                s !== r && (Vt = !0), U = s;
                break;
              case "children":
                break;
              case "dangerouslySetInnerHTML":
                if (s != null) throw Error(q(91));
                break;
              default:
                s !== r && Ft(l, n, m, s, i, r);
            }
        E1(l, D, U);
        return;
      case "option":
        for (var Z in u)
          D = u[Z], u.hasOwnProperty(Z) && D != null && !i.hasOwnProperty(Z) && (Z === "selected" ? l.selected = !1 : Ft(
            l,
            n,
            Z,
            null,
            i,
            D
          ));
        for (S in i)
          D = i[S], U = u[S], i.hasOwnProperty(S) && D !== U && (D != null || U != null) && (S === "selected" ? (D !== U && (Vt = !0), l.selected = D && typeof D != "function" && typeof D != "symbol") : Ft(
            l,
            n,
            S,
            D,
            i,
            U
          ));
        return;
      case "img":
      case "link":
      case "area":
      case "base":
      case "br":
      case "col":
      case "embed":
      case "hr":
      case "keygen":
      case "meta":
      case "param":
      case "source":
      case "track":
      case "wbr":
      case "menuitem":
        for (var I in u)
          D = u[I], u.hasOwnProperty(I) && D != null && !i.hasOwnProperty(I) && Ft(l, n, I, null, i, D);
        for (C in i)
          if (D = i[C], U = u[C], i.hasOwnProperty(C) && D !== U && (D != null || U != null))
            switch (C) {
              case "children":
              case "dangerouslySetInnerHTML":
                if (D != null)
                  throw Error(q(137, n));
                break;
              default:
                Ft(
                  l,
                  n,
                  C,
                  D,
                  i,
                  U
                );
            }
        return;
      default:
        if (vh(n)) {
          for (var bt in u)
            D = u[bt], u.hasOwnProperty(bt) && D !== void 0 && !i.hasOwnProperty(bt) && Td(
              l,
              n,
              bt,
              void 0,
              i,
              D
            );
          for (N in i)
            D = i[N], U = u[N], !i.hasOwnProperty(N) || D === U || D === void 0 && U === void 0 || Td(
              l,
              n,
              N,
              D,
              i,
              U
            );
          return;
        }
    }
    for (var R in u)
      D = u[R], u.hasOwnProperty(R) && D != null && !i.hasOwnProperty(R) && Ft(l, n, R, null, i, D);
    for (G in i)
      D = i[G], U = u[G], !i.hasOwnProperty(G) || D === U || D == null && U == null || Ft(l, n, G, D, i, U);
  }
  function Vv(l) {
    switch (l) {
      case "css":
      case "script":
      case "font":
      case "img":
      case "image":
      case "input":
      case "link":
        return !0;
      default:
        return !1;
    }
  }
  function _p() {
    if (typeof performance.getEntriesByType == "function") {
      for (var l = 0, n = 0, u = performance.getEntriesByType("resource"), i = 0; i < u.length; i++) {
        var s = u[i], r = s.transferSize, m = s.initiatorType, g = s.duration;
        if (r && g && Vv(m)) {
          for (m = 0, g = s.responseEnd, i += 1; i < u.length; i++) {
            var S = u[i], C = S.startTime;
            if (C > g) break;
            var N = S.transferSize, G = S.initiatorType;
            N && Vv(G) && (S = S.responseEnd, m += N * (S < g ? 1 : (g - C) / (S - C)));
          }
          if (--i, n += 8 * (r + m) / (s.duration / 1e3), l++, 10 < l) break;
        }
      }
      if (0 < l) return n / l / 1e6;
    }
    return navigator.connection && (l = navigator.connection.downlink, typeof l == "number") ? l : 5;
  }
  var lm = null, am = null;
  function Ed(l) {
    return l.nodeType === 9 ? l : l.ownerDocument;
  }
  function Up(l) {
    switch (l) {
      case "http://www.w3.org/2000/svg":
        return 1;
      case "http://www.w3.org/1998/Math/MathML":
        return 2;
      default:
        return 0;
    }
  }
  function jv(l, n) {
    if (l === 0)
      switch (n) {
        case "svg":
          return 1;
        case "math":
          return 2;
        default:
          return 0;
      }
    return l === 1 && n === "foreignObject" ? 0 : l;
  }
  function vs(l, n, u, i) {
    return u = Ed(
      u
    ).createElement(l), u[ul] = i, u[_l] = n, fl(u, l, n), De(u), u;
  }
  function wv(l, n) {
    return l === "textarea" || l === "noscript" || typeof n.children == "string" || typeof n.children == "number" || typeof n.children == "bigint" || typeof n.dangerouslySetInnerHTML == "object" && n.dangerouslySetInnerHTML !== null && n.dangerouslySetInnerHTML.__html != null;
  }
  var gs = null;
  function Sb() {
    var l = window.event;
    return l && l.type === "popstate" ? l === gs ? !1 : (gs = l, !0) : (gs = null, !1);
  }
  var Xv = typeof setTimeout == "function" ? setTimeout : void 0, Np = typeof clearTimeout == "function" ? clearTimeout : void 0, Qv = typeof Promise == "function" ? Promise : void 0, nm = typeof requestAnimationFrame == "function" ? requestAnimationFrame : Xv, Hp = typeof queueMicrotask == "function" ? queueMicrotask : typeof Qv < "u" ? function(l) {
    return Qv.resolve(null).then(l).catch(Zv);
  } : Xv;
  function Zv(l) {
    setTimeout(function() {
      throw l;
    });
  }
  function Gc(l) {
    return l === "head";
  }
  function Lv(l, n) {
    var u = n, i = 0;
    do {
      var s = u.nextSibling;
      if (l.removeChild(u), s && s.nodeType === 8)
        if (u = s.data, u === "/$" || u === "/&") {
          if (i === 0) {
            l.removeChild(s), tf(n);
            return;
          }
          i--;
        } else if (u === "$" || u === "$?" || u === "$~" || u === "$!" || u === "&")
          i++;
        else if (u === "html")
          lg(
            l.ownerDocument.documentElement
          );
        else if (u === "head") {
          u = l.ownerDocument.head, lg(u);
          for (var r = u.firstChild; r; ) {
            var m = r.nextSibling, g = r.nodeName;
            r[Ef] || g === "SCRIPT" || g === "STYLE" || g === "LINK" && r.rel.toLowerCase() === "stylesheet" || u.removeChild(r), r = m;
          }
        } else
          u === "body" && lg(l.ownerDocument.body);
      u = s;
    } while (u);
    tf(n);
  }
  function Bp(l, n) {
    var u = l;
    l = 0;
    do {
      var i = u.nextSibling;
      if (u.nodeType === 1 ? n ? (u._stashedDisplay = u.style.display, u.style.display = "none") : (u.style.display = u._stashedDisplay || "", u.getAttribute("style") === "" && u.removeAttribute("style")) : u.nodeType === 3 && (n ? (u._stashedText = u.nodeValue, u.nodeValue = "") : u.nodeValue = u._stashedText || ""), i && i.nodeType === 8)
        if (u = i.data, u === "/$") {
          if (l === 0) break;
          l--;
        } else
          u !== "$" && u !== "$?" && u !== "$~" && u !== "$!" || l++;
      u = i;
    } while (u);
  }
  function xp(l, n, u) {
    if (n = CSS.escape(n) !== n ? "r-" + btoa(n).replace(/=/g, "") : n, l.style.viewTransitionName = n, u != null && (l.style.viewTransitionClass = u), u = getComputedStyle(l), u.display === "inline") {
      if (n = l.getClientRects(), n.length === 1) var i = 1;
      else
        for (var s = i = 0; s < n.length; s++) {
          var r = n[s];
          0 < r.width && 0 < r.height && i++;
        }
      i === 1 && (l = l.style, l.display = n.length === 1 ? "inline-block" : "block", l.marginTop = "-" + u.paddingTop, l.marginBottom = "-" + u.paddingBottom);
    }
  }
  function Yp(l, n) {
    l = l.style, n = n.style;
    var u = n != null ? n.hasOwnProperty("viewTransitionName") ? n.viewTransitionName : n.hasOwnProperty("view-transition-name") ? n["view-transition-name"] : null : null;
    l.viewTransitionName = u == null || typeof u == "boolean" ? "" : ("" + u).trim(), u = n != null ? n.hasOwnProperty("viewTransitionClass") ? n.viewTransitionClass : n.hasOwnProperty("view-transition-class") ? n["view-transition-class"] : null : null, l.viewTransitionClass = u == null || typeof u == "boolean" ? "" : ("" + u).trim(), l.display === "inline-block" && (n == null ? l.display = l.margin = "" : (u = n.display, l.display = u == null || typeof u == "boolean" ? "" : u, u = n.margin, u != null ? l.margin = u : (u = n.hasOwnProperty("marginTop") ? n.marginTop : n["margin-top"], l.marginTop = u == null || typeof u == "boolean" ? "" : u, n = n.hasOwnProperty("marginBottom") ? n.marginBottom : n["margin-bottom"], l.marginBottom = n == null || typeof n == "boolean" ? "" : n)));
  }
  function Jv(l, n, u) {
    return u = u.ownerDocument.defaultView, {
      rect: l,
      abs: n.position === "absolute" || n.position === "fixed",
      clip: n.clipPath !== "none" || n.overflow !== "visible" || n.filter !== "none" || n.mask !== "none" || n.mask !== "none" || n.borderRadius !== "0px",
      view: 0 <= l.bottom && 0 <= l.right && l.top <= u.innerHeight && l.left <= u.innerWidth
    };
  }
  function zd(l) {
    var n = l.getBoundingClientRect(), u = getComputedStyle(l);
    return Jv(n, u, l);
  }
  function Kv(l) {
    return l.documentElement.clientHeight;
  }
  function qp(l) {
    this.addEventListener("load", l), this.addEventListener("error", l);
  }
  function Gp(l, n, u, i, s, r, m, g, S) {
    var C = n.nodeType === 9 ? n : n.ownerDocument;
    try {
      var N = C.startViewTransition({
        update: function() {
          var D = C.defaultView, U = D.navigation && D.navigation.transition, Z = C.fonts.status;
          i();
          var I = [];
          if (Z === "loaded" && (Kv(C), C.fonts.status === "loading" && I.push(C.fonts.ready)), Z = I.length, l !== null)
            for (var bt = l.suspenseyImages, R = 0, O = 0; O < bt.length; O++) {
              var _ = bt[O];
              if (!_.complete) {
                var V = _.getBoundingClientRect();
                if (0 < V.bottom && 0 < V.right && V.top < D.innerHeight && V.left < D.innerWidth) {
                  if (R += rm(_), R > hm) {
                    I.length = Z;
                    break;
                  }
                  _ = new Promise(
                    qp.bind(_)
                  ), I.push(_);
                }
              }
            }
          if (0 < I.length)
            return D = Promise.race([
              Promise.all(I),
              new Promise(function(k) {
                return setTimeout(k, 500);
              })
            ]).then(s, s), (U ? Promise.allSettled([U.finished, D]) : D).then(r, r);
          if (s(), U)
            return U.finished.then(
              r,
              r
            );
          r();
        },
        types: u
      });
      C.__reactViewTransition = N;
      var G = [];
      return N.ready.then(
        function() {
          for (var D = C.documentElement.getAnimations({
            subtree: !0
          }), U = 0; U < D.length; U++) {
            var Z = D[U], I = Z.effect, bt = I.pseudoElement;
            if (bt != null && bt.startsWith("::view-transition")) {
              G.push(Z), Z = I.getKeyframes();
              for (var R = bt = void 0, O = !0, _ = 0; _ < Z.length; _++) {
                var V = Z[_], k = V.width;
                if (bt === void 0) bt = k;
                else if (bt !== k) {
                  O = !1;
                  break;
                }
                if (k = V.height, R === void 0) R = k;
                else if (R !== k) {
                  O = !1;
                  break;
                }
                delete V.width, delete V.height, V.transform === "none" && delete V.transform;
              }
              O && bt !== void 0 && R !== void 0 && (I.setKeyframes(Z), O = getComputedStyle(
                I.target,
                I.pseudoElement
              ), O.width !== bt || O.height !== R) && (O = Z[0], O.width = bt, O.height = R, O = Z[Z.length - 1], O.width = bt, O.height = R, I.setKeyframes(Z));
            }
          }
          m();
        },
        function(D) {
          C.__reactViewTransition === N && (C.__reactViewTransition = null);
          try {
            typeof D == "object" && D !== null && D.name === "InvalidStateError" && (D.message === "View transition was skipped because document visibility state is hidden." || D.message === "Skipping view transition because document visibility state has become hidden." || D.message === "Skipping view transition because viewport size changed." || D.message === "Transition was aborted because of invalid state") && (D = null), D !== null && S(D);
          } finally {
            i(), s(), m();
          }
        }
      ), N.finished.finally(function() {
        for (var D = 0; D < G.length; D++)
          G[D].cancel();
        C.__reactViewTransition === N && (C.__reactViewTransition = null), g();
      }), N;
    } catch {
      return i(), s(), m(), null;
    }
  }
  function uu(l, n) {
    this._scope = document.documentElement, this._selector = "::view-transition-" + l + "(" + n + ")";
  }
  uu.prototype.animate = function(l, n) {
    return n = typeof n == "number" ? { duration: n } : mt({}, n), n.pseudoElement = this._selector, this._scope.animate(l, n);
  }, uu.prototype.getAnimations = function() {
    for (var l = this._scope, n = this._selector, u = l.getAnimations({ subtree: !0 }), i = [], s = 0; s < u.length; s++) {
      var r = u[s].effect;
      r !== null && r.target === l && r.pseudoElement === n && i.push(u[s]);
    }
    return i;
  }, uu.prototype.getComputedStyle = function() {
    return getComputedStyle(this._scope, this._selector);
  };
  function Vp(l) {
    return {
      name: l,
      group: new uu("group", l),
      imagePair: new uu("image-pair", l),
      old: new uu("old", l),
      new: new uu("new", l)
    };
  }
  function Ua(l) {
    this._fragmentFiber = l, this._observers = this._eventListeners = null;
  }
  Ua.prototype.addEventListener = function(l, n, u) {
    var i = null, s = null;
    if (!(u != null && typeof u != "boolean" && (i = u.signal || null, i !== null && i.aborted))) {
      this._eventListeners === null && (this._eventListeners = []);
      var r = this._eventListeners;
      if ($v(r, l, n, u) === -1) {
        var m = this, g = n;
        u != null && typeof u != "boolean" && u.once === !0 && (g = function(S) {
          m.removeEventListener(
            l,
            n,
            u
          ), typeof n == "function" ? n.call(this, S) : n.handleEvent(S);
        }), i !== null && (s = m.removeEventListener.bind(
          m,
          l,
          n,
          u
        ), i.addEventListener("abort", s, { once: !0 }), s = i.removeEventListener.bind(i, "abort", s)), i = ps(u), r.push({
          type: l,
          listener: n,
          optionsOrUseCapture: u,
          attachedListener: g,
          cleanup: s
        }), Yt(
          this._fragmentFiber.child,
          !1,
          um,
          l,
          g,
          i
        );
      }
      this._eventListeners = r;
    }
  };
  function um(l, n, u, i) {
    return Mt(l).addEventListener(
      n,
      u,
      i
    ), !1;
  }
  Ua.prototype.removeEventListener = function(l, n, u) {
    var i = this._eventListeners;
    if (i !== null && (n = $v(
      i,
      l,
      n,
      u
    ), n !== -1)) {
      var s = i[n];
      u = s.attachedListener;
      var r = s.cleanup;
      s = ps(s.optionsOrUseCapture), Yt(
        this._fragmentFiber.child,
        !1,
        jp,
        l,
        u,
        s
      ), i.splice(n, 1), r !== null && r();
    }
  };
  function jp(l, n, u, i) {
    return Mt(l).removeEventListener(
      n,
      u,
      i
    ), !1;
  }
  function ps(l) {
    return l != null && typeof l != "boolean" && (l.once === !0 || l.signal instanceof AbortSignal) ? { capture: l.capture, passive: l.passive } : l;
  }
  function Ad(l) {
    return l == null ? "c=0" : typeof l == "boolean" ? "c=" + (l ? "1" : "0") : "c=" + (l.capture ? "1" : "0");
  }
  function $v(l, n, u, i) {
    if (l.length === 0) return -1;
    i = Ad(i);
    for (var s = 0; s < l.length; s++) {
      var r = l[s];
      if (r.type === n && r.listener === u && Ad(r.optionsOrUseCapture) === i)
        return s;
    }
    return -1;
  }
  Ua.prototype.dispatchEvent = function(l) {
    var n = Ot(
      this._fragmentFiber
    );
    if (n === null) return !0;
    n = Mt(n);
    var u = this._eventListeners;
    if (u !== null && 0 < u.length || !l.bubbles) {
      var i = n.nodeType === 9 ? n.createComment("") : document.createTextNode("");
      if (u)
        for (var s = 0; s < u.length; s++) {
          var r = u[s];
          i.addEventListener(
            r.type,
            r.attachedListener,
            ps(r.optionsOrUseCapture)
          );
        }
      if (n.appendChild(i), l = i.dispatchEvent(l), u)
        for (s = 0; s < u.length; s++)
          r = u[s], i.removeEventListener(
            r.type,
            r.attachedListener,
            ps(r.optionsOrUseCapture)
          );
      return n.removeChild(i), l;
    }
    return n.dispatchEvent(l);
  }, Ua.prototype.focus = function(l) {
    Yt(
      this._fragmentFiber.child,
      !0,
      $o,
      l,
      void 0,
      void 0
    );
  };
  function $o(l, n) {
    return l.tag === 6 ? !1 : (l = Mt(l), Eb(l, n));
  }
  Ua.prototype.focusLast = function(l) {
    var n = [];
    Yt(
      this._fragmentFiber.child,
      !0,
      cm,
      n,
      void 0,
      void 0
    );
    for (var u = n.length - 1; 0 <= u && !$o(n[u], l); u--) ;
  };
  function cm(l, n) {
    return n.push(l), !1;
  }
  Ua.prototype.blur = function() {
    var l = Ot(
      this._fragmentFiber
    );
    l !== null && (l = Mt(l), l = Ed(l).activeElement, l !== null && Yt(
      this._fragmentFiber.child,
      !1,
      Fv,
      l,
      void 0,
      void 0
    ));
  };
  function Fv(l, n) {
    return l.tag === 6 ? !1 : (l = Mt(l), l === n || l.contains(n) ? (n.blur(), !0) : !1);
  }
  Ua.prototype.observeUsing = function(l) {
    this._observers === null && (this._observers = /* @__PURE__ */ new Set()), this._observers.add(l), Yt(
      this._fragmentFiber.child,
      !1,
      im,
      l,
      void 0,
      void 0
    );
  };
  function im(l, n) {
    return l.tag === 6 || (l = Mt(l), n.observe(l)), !1;
  }
  Ua.prototype.unobserveUsing = function(l) {
    var n = this._observers;
    if (n !== null && n.has(l)) {
      n.delete(l), Yt(
        this._fragmentFiber.child,
        !1,
        wp,
        l,
        void 0,
        void 0
      );
      for (var u = n = 0; u < ee.length; u++) {
        var i = ee[u];
        i.fragmentInstance === this && i.observer === l ? l.unobserve(i.instance) : ee[n++] = i;
      }
      ee.length = n;
    }
  };
  function wp(l, n) {
    return l.tag === 6 || (l = Mt(l), n.unobserve(l)), !1;
  }
  var ee = [], Od = !1;
  function bb(l, n, u) {
    ee.push({
      fragmentInstance: l,
      observer: n,
      instance: u
    }), Od || (Od = !0, tg(function() {
      Od = !1;
      var i = ee;
      ee = [];
      for (var s = 0; s < i.length; s++) {
        var r = i[s];
        r.observer.unobserve(r.instance);
      }
    }));
  }
  Ua.prototype.getClientRects = function() {
    var l = [];
    return Yt(
      this._fragmentFiber.child,
      !1,
      Ss,
      l,
      void 0,
      void 0
    ), l;
  };
  function Ss(l, n) {
    if (l.tag === 6) {
      l = l.stateNode;
      var u = l.ownerDocument.createRange();
      u.selectNodeContents(l), n.push.apply(n, u.getClientRects());
    } else
      l = Mt(l), n.push.apply(n, l.getClientRects());
    return !1;
  }
  Ua.prototype.getRootNode = function(l) {
    var n = Ot(
      this._fragmentFiber
    );
    return n === null ? this : Mt(n).getRootNode(l);
  }, Ua.prototype.compareDocumentPosition = function(l) {
    var n = Ot(
      this._fragmentFiber
    );
    if (n === null) return Node.DOCUMENT_POSITION_DISCONNECTED;
    var u = [];
    Yt(
      this._fragmentFiber.child,
      !1,
      cm,
      u,
      void 0,
      void 0
    );
    var i = Mt(n);
    if (u.length === 0) {
      if (u = i, Cl(this._fragmentFiber)) {
        t: {
          for (n = this._fragmentFiber.return; n !== null; ) {
            if (n.tag === 4) {
              n = n.stateNode.containerInfo;
              break t;
            }
            if (n.tag === 3 || n.tag === 5 || n.tag === 27)
              break;
            n = n.return;
          }
          n = null;
        }
        n != null && (u = n);
      }
      n = this._fragmentFiber;
      var s = i = u.compareDocumentPosition(l);
      return u === l ? s = Node.DOCUMENT_POSITION_CONTAINS : i & Node.DOCUMENT_POSITION_CONTAINED_BY && (u = yl(n)[1], u === null ? s = Node.DOCUMENT_POSITION_PRECEDING : (l = Mt(u).compareDocumentPosition(
        l
      ), s = l === 0 || l & Node.DOCUMENT_POSITION_FOLLOWING ? Node.DOCUMENT_POSITION_FOLLOWING : Node.DOCUMENT_POSITION_PRECEDING)), s |= Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC;
    }
    n = Mt(u[0]), s = Mt(u[u.length - 1]);
    var r = Cl(this._fragmentFiber) ? n.parentElement : i;
    if (r == null)
      return Node.DOCUMENT_POSITION_DISCONNECTED;
    i = r.compareDocumentPosition(n) & Node.DOCUMENT_POSITION_CONTAINED_BY, r = r.compareDocumentPosition(s) & Node.DOCUMENT_POSITION_CONTAINED_BY;
    var m = n.compareDocumentPosition(l), g = s.compareDocumentPosition(l), S = m & Node.DOCUMENT_POSITION_CONTAINED_BY || g & Node.DOCUMENT_POSITION_CONTAINED_BY;
    return g = i && r && m & Node.DOCUMENT_POSITION_FOLLOWING && g & Node.DOCUMENT_POSITION_PRECEDING, n = i && n === l || r && s === l || S || g ? Node.DOCUMENT_POSITION_CONTAINED_BY : !i && n === l || !r && s === l ? Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC : m, n & Node.DOCUMENT_POSITION_DISCONNECTED || n & Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC || Wv(
      n,
      this._fragmentFiber,
      u[0],
      u[u.length - 1],
      l
    ) ? n : Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC;
  };
  function Wv(l, n, u, i, s) {
    var r = We(s);
    if (l & Node.DOCUMENT_POSITION_CONTAINED_BY) {
      if (u = !!r)
        t: {
          for (; r !== null; ) {
            if (r.tag === 7 && (r === n || r.alternate === n)) {
              u = !0;
              break t;
            }
            r = r.return;
          }
          u = !1;
        }
      return u;
    }
    if (l & Node.DOCUMENT_POSITION_CONTAINS) {
      if (r === null)
        return r = s.ownerDocument, s === r || s === r.documentElement || s === r.body;
      t: {
        for (r = n, n = Ot(n); r !== null; ) {
          if (!(r.tag !== 5 && r.tag !== 3 && r.tag !== 27 || r !== n && r.alternate !== n)) {
            r = !0;
            break t;
          }
          r = r.return;
        }
        r = !1;
      }
      return r;
    }
    return l & Node.DOCUMENT_POSITION_PRECEDING ? ((n = !!r) && !(n = r === u) && (n = ga(
      u,
      r,
      gu
    ), n === null ? n = !1 : (Yt(
      n,
      !0,
      Un,
      r,
      u
    ), r = Wt, Wt = null, n = r !== null)), n) : l & Node.DOCUMENT_POSITION_FOLLOWING ? ((n = !!r) && !(n = r === i) && (n = ga(
      i,
      r,
      gu
    ), n === null ? n = !1 : (Yt(
      n,
      !0,
      Ga,
      r,
      i
    ), r = Wt, _n = Wt = null, n = r !== null)), n) : !1;
  }
  function pt(l, n) {
    var u = l.ownerDocument.createRange();
    u.selectNodeContents(l), l = u.getBoundingClientRect(), window.scrollTo(
      window.scrollX + l.left,
      n ? window.scrollY + l.top : window.scrollY + l.bottom - window.innerHeight
    );
  }
  Ua.prototype.scrollIntoView = function(l) {
    if (typeof l == "object") throw Error(q(566));
    var n = [];
    Yt(
      this._fragmentFiber.child,
      !1,
      cm,
      n,
      void 0,
      void 0
    );
    var u = l !== !1;
    if (n.length === 0) {
      var i = yl(
        this._fragmentFiber
      );
      if (i = u ? i[1] || i[0] || Ot(this._fragmentFiber) : i[0] || i[1], i === null) return;
      if (i.tag === 6) {
        l = Mt(i), pt(l, u);
        return;
      }
      if (i = Mt(i), i.nodeType !== 9) {
        if (i.nodeType === 11) {
          u = "host" in i ? i.host : null, u !== null && u.scrollIntoView(l);
          return;
        }
        i.scrollIntoView(l);
      }
    }
    for (i = u ? n.length - 1 : 0; i !== (u ? -1 : n.length); ) {
      var s = n[i];
      s.tag === 6 ? (s = Mt(s), pt(s, u)) : Mt(s).scrollIntoView(l), i += u ? -1 : 1;
    }
  };
  function Tb(l, n) {
    return l = Mt(l), cu(l, n), !1;
  }
  function cu(l, n) {
    l.reactFragments == null && (l.reactFragments = /* @__PURE__ */ new Set()), l.reactFragments.add(n);
  }
  function Fo(l, n) {
    var u = n._eventListeners;
    if (u !== null)
      for (var i = 0; i < u.length; i++) {
        var s = u[i];
        l.addEventListener(
          s.type,
          s.attachedListener,
          ps(s.optionsOrUseCapture)
        );
      }
    l.nodeType !== 3 && (u = n._observers, u !== null && u.forEach(function(r) {
      for (var m = 0, g = 0; g < ee.length; g++) {
        var S = ee[g];
        (S.fragmentInstance !== n || S.observer !== r || S.instance !== l) && (ee[m++] = S);
      }
      ee.length = m, r.observe(l);
    }), cu(l, n));
  }
  function bs(l, n) {
    var u = n._eventListeners;
    if (u !== null)
      for (var i = 0; i < u.length; i++) {
        var s = u[i];
        l.removeEventListener(
          s.type,
          s.attachedListener,
          ps(s.optionsOrUseCapture)
        );
      }
    l.nodeType !== 3 && (u = n._observers, u !== null && u.forEach(function(r) {
      typeof r.rootMargin == "string" ? bb(
        n,
        r,
        l
      ) : r.unobserve(l);
    }), l.reactFragments != null && l.reactFragments.delete(n));
  }
  function Ts(l) {
    var n = l.firstChild;
    for (n && n.nodeType === 10 && (n = n.nextSibling); n; ) {
      var u = n;
      switch (n = n.nextSibling, u.nodeName) {
        case "HTML":
        case "HEAD":
        case "BODY":
          Ts(u), cr(u);
          continue;
        case "SCRIPT":
        case "STYLE":
          continue;
        case "LINK":
          if (u.rel.toLowerCase() === "stylesheet") continue;
      }
      l.removeChild(u);
    }
  }
  function Iv(l, n, u, i) {
    for (; l.nodeType === 1; ) {
      var s = u;
      if (l.nodeName.toLowerCase() !== n.toLowerCase()) {
        if (!i && (l.nodeName !== "INPUT" || l.type !== "hidden"))
          break;
      } else if (i) {
        if (!l[Ef])
          switch (n) {
            case "meta":
              if (!l.hasAttribute("itemprop")) break;
              return l;
            case "link":
              if (r = l.getAttribute("rel"), r === "stylesheet" && l.hasAttribute("data-precedence"))
                break;
              if (r !== s.rel || l.getAttribute("href") !== (s.href == null || s.href === "" ? null : s.href) || l.getAttribute("crossorigin") !== (s.crossOrigin == null ? null : s.crossOrigin) || l.getAttribute("title") !== (s.title == null ? null : s.title))
                break;
              return l;
            case "style":
              if (l.hasAttribute("data-precedence")) break;
              return l;
            case "script":
              if (r = l.getAttribute("src"), (r !== (s.src == null ? null : s.src) || l.getAttribute("type") !== (s.type == null ? null : s.type) || l.getAttribute("crossorigin") !== (s.crossOrigin == null ? null : s.crossOrigin)) && r && l.hasAttribute("async") && !l.hasAttribute("itemprop"))
                break;
              return l;
            default:
              return l;
          }
      } else if (n === "input" && l.type === "hidden") {
        var r = s.name == null ? null : "" + s.name;
        if (s.type === "hidden" && l.getAttribute("name") === r)
          return l;
      } else return l;
      if (l = ra(l.nextSibling), l === null) break;
    }
    return null;
  }
  function kv(l, n, u) {
    if (n === "") return null;
    for (; l.nodeType !== 3; )
      if ((l.nodeType !== 1 || l.nodeName !== "INPUT" || l.type !== "hidden") && !u || (l = ra(l.nextSibling), l === null)) return null;
    return l;
  }
  function Sn(l, n) {
    for (; l.nodeType !== 8; )
      if ((l.nodeType !== 1 || l.nodeName !== "INPUT" || l.type !== "hidden") && !n || (l = ra(l.nextSibling), l === null)) return null;
    return l;
  }
  function Es(l) {
    return l.data === "$?" || l.data === "$~";
  }
  function Dd(l) {
    return l.data === "$!" || l.data === "$?" && l.ownerDocument.readyState !== "loading";
  }
  function Pv(l, n) {
    var u = l.ownerDocument;
    if (l.data === "$~") l._reactRetry = n;
    else if (l.data !== "$?" || u.readyState !== "loading")
      n();
    else {
      var i = function() {
        n(), u.removeEventListener("DOMContentLoaded", i);
      };
      u.addEventListener("DOMContentLoaded", i), l._reactRetry = i;
    }
  }
  function ra(l) {
    for (; l != null; l = l.nextSibling) {
      var n = l.nodeType;
      if (n === 1 || n === 3) break;
      if (n === 8) {
        if (n = l.data, n === "$" || n === "$!" || n === "$?" || n === "$~" || n === "&" || n === "F!" || n === "F")
          break;
        if (n === "/$" || n === "/&") return null;
      }
    }
    return l;
  }
  var Vl = null;
  function om(l) {
    l = l.nextSibling;
    for (var n = 0; l; ) {
      if (l.nodeType === 8) {
        var u = l.data;
        if (u === "/$" || u === "/&") {
          if (n === 0)
            return ra(l.nextSibling);
          n--;
        } else
          u !== "$" && u !== "$!" && u !== "$?" && u !== "$~" && u !== "&" || n++;
      }
      l = l.nextSibling;
    }
    return null;
  }
  function Xp(l) {
    l = l.previousSibling;
    for (var n = 0; l; ) {
      if (l.nodeType === 8) {
        var u = l.data;
        if (u === "$" || u === "$!" || u === "$?" || u === "$~" || u === "&") {
          if (n === 0) return l;
          n--;
        } else u !== "/$" && u !== "/&" || n++;
      }
      l = l.previousSibling;
    }
    return null;
  }
  function Eb(l, n) {
    function u() {
      i = !0;
    }
    if (l.ownerDocument.activeElement === l) return !0;
    var i = !1;
    try {
      l.ownerDocument.addEventListener("focus", u, !0), (l.focus || HTMLElement.prototype.focus).call(l, n);
    } finally {
      l.ownerDocument.removeEventListener("focus", u, !0);
    }
    return i;
  }
  function tg(l) {
    nm(function() {
      nm(function(n) {
        return l(n);
      });
    });
  }
  function Qp(l, n, u) {
    switch (n = Ed(u), l) {
      case "html":
        if (l = n.documentElement, !l) throw Error(q(452));
        return l;
      case "head":
        if (l = n.head, !l) throw Error(q(453));
        return l;
      case "body":
        if (l = n.body, !l) throw Error(q(454));
        return l;
      default:
        throw Error(q(451));
    }
  }
  function eg(l, n, u) {
    for (var i in u) {
      var s = u[i];
      u.hasOwnProperty(i) && s != null && Ft(l, n, i, null, Gv, s);
    }
    u.dangerouslySetInnerHTML != null && (l.textContent = ""), l.onclick === Qa && (l.onclick = null), cr(l);
  }
  function lg(l) {
    for (var n = l.attributes; n.length; )
      l.removeAttributeNode(n[0]);
    cr(l);
  }
  var le = /* @__PURE__ */ new Map(), x = /* @__PURE__ */ new Set();
  function Gt(l) {
    if (typeof l.getRootNode == "function") {
      var n = l.getRootNode();
      if (n.nodeType === 9 || n.nodeType === 11) return n;
    }
    return l.nodeType === 9 ? l : l.ownerDocument;
  }
  var Vc = Jt.d;
  Jt.d = {
    f: ag,
    r: ng,
    D: Cd,
    C: qi,
    L: fm,
    m: Rd,
    X: Lp,
    S: Zp,
    M: Jp
  };
  function ag() {
    var l = Vc.f(), n = J0();
    return l || n;
  }
  function ng(l) {
    var n = Bn(l);
    n !== null && n.tag === 5 && n.type === "form" ? r0(n) : Vc.r(l);
  }
  var Na = typeof document > "u" ? null : document;
  function jc(l, n, u) {
    var i = Na;
    if (i && typeof n == "string" && n) {
      var s = Xa(n);
      s = 'link[rel="' + l + '"][href="' + s + '"]', typeof u == "string" && (s += '[crossorigin="' + u + '"]'), x.has(s) || (x.add(s), l = { rel: l, crossOrigin: u, href: n }, i.querySelector(s) === null && (n = i.createElement("link"), fl(n, "link", l), De(n), i.head.appendChild(n)));
    }
  }
  function Cd(l) {
    Vc.D(l), jc("dns-prefetch", l, null);
  }
  function qi(l, n) {
    Vc.C(l, n), jc("preconnect", l, n);
  }
  function fm(l, n, u) {
    Vc.L(l, n, u);
    var i = Na;
    if (i && l && n) {
      var s = 'link[rel="preload"][as="' + Xa(n) + '"]';
      n === "image" && u && u.imageSrcSet ? (s += '[imagesrcset="' + Xa(
        u.imageSrcSet
      ) + '"]', typeof u.imageSizes == "string" && (s += '[imagesizes="' + Xa(
        u.imageSizes
      ) + '"]')) : s += '[href="' + Xa(l) + '"]';
      var r = s;
      switch (n) {
        case "style":
          r = Wo(l);
          break;
        case "script":
          r = Io(l);
      }
      if (!(le.has(r) || (l = mt(
        {
          rel: "preload",
          href: n === "image" && u && u.imageSrcSet ? void 0 : l,
          as: n
        },
        u
      ), le.set(r, l), i.querySelector(s) !== null || n === "style" && i.querySelector(zs(r)) || n === "script" && i.querySelector(ko(r))))) {
        var m = i.createElement("link");
        fl(m, "link", l), n === "style" && (m[ur] = !0, m.onload = m.onerror = function() {
          ir(m);
        }), De(m), i.head.appendChild(m);
      }
    }
  }
  function Rd(l, n) {
    Vc.m(l, n);
    var u = Na;
    if (u && l) {
      var i = n && typeof n.as == "string" ? n.as : "script", s = 'link[rel="modulepreload"][as="' + Xa(i) + '"][href="' + Xa(l) + '"]', r = s;
      switch (i) {
        case "audioworklet":
        case "paintworklet":
        case "serviceworker":
        case "sharedworker":
        case "worker":
        case "script":
          r = Io(l);
      }
      if (!le.has(r) && (l = mt({ rel: "modulepreload", href: l }, n), le.set(r, l), u.querySelector(s) === null)) {
        switch (i) {
          case "audioworklet":
          case "paintworklet":
          case "serviceworker":
          case "sharedworker":
          case "worker":
          case "script":
            if (u.querySelector(ko(r)))
              return;
        }
        i = u.createElement("link"), fl(i, "link", l), De(i), u.head.appendChild(i);
      }
    }
  }
  function Zp(l, n, u) {
    Vc.S(l, n, u);
    var i = Na;
    if (i && l) {
      var s = no(i).hoistableStyles, r = Wo(l);
      n = n || "default";
      var m = s.get(r);
      if (!m) {
        var g = { loading: 0, preload: null };
        if (m = i.querySelector(
          zs(r)
        ))
          g.loading = 5;
        else {
          l = mt(
            { rel: "stylesheet", href: l, "data-precedence": n },
            u
          ), (u = le.get(r)) && bn(l, u);
          var S = m = i.createElement("link");
          De(S), fl(S, "link", l), S._p = new Promise(function(C, N) {
            S.onload = C, S.onerror = N;
          }), S.addEventListener("load", function() {
            g.loading |= 1;
          }), S.addEventListener("error", function() {
            g.loading |= 2;
          }), g.loading |= 4, jl(m, n, i);
        }
        m = {
          type: "stylesheet",
          instance: m,
          count: 1,
          state: g
        }, s.set(r, m);
      }
    }
  }
  function Lp(l, n) {
    Vc.X(l, n);
    var u = Na;
    if (u && l) {
      var i = no(u).hoistableScripts, s = Io(l), r = i.get(s);
      r || (r = u.querySelector(ko(s)), r || (l = mt({ src: l, async: !0 }, n), (n = le.get(s)) && Ha(l, n), r = u.createElement("script"), De(r), fl(r, "link", l), u.head.appendChild(r)), r = {
        type: "script",
        instance: r,
        count: 1,
        state: null
      }, i.set(s, r));
    }
  }
  function Jp(l, n) {
    Vc.M(l, n);
    var u = Na;
    if (u && l) {
      var i = no(u).hoistableScripts, s = Io(l), r = i.get(s);
      r || (r = u.querySelector(ko(s)), r || (l = mt({ src: l, async: !0, type: "module" }, n), (n = le.get(s)) && Ha(l, n), r = u.createElement("script"), De(r), fl(r, "link", l), u.head.appendChild(r)), r = {
        type: "script",
        instance: r,
        count: 1,
        state: null
      }, i.set(s, r));
    }
  }
  function ug(l, n, u, i) {
    var s = (s = ti.current) ? Gt(s) : null;
    if (!s) throw Error(q(446));
    switch (l) {
      case "meta":
      case "title":
        return null;
      case "style":
        return typeof u.precedence == "string" && typeof u.href == "string" ? (u = Wo(u.href), n = no(
          s
        ).hoistableStyles, i = n.get(u), i || (i = {
          type: "style",
          instance: null,
          count: 0,
          state: null
        }, n.set(u, i)), i) : { type: "void", instance: null, count: 0, state: null };
      case "link":
        if (u.rel === "stylesheet" && typeof u.href == "string" && typeof u.precedence == "string") {
          l = Wo(u.href);
          var r = no(
            s
          ).hoistableStyles, m = r.get(l);
          if (m || (s = s.ownerDocument || s, m = {
            type: "stylesheet",
            instance: null,
            count: 0,
            state: { loading: 0, preload: null }
          }, r.set(l, m), (r = s.querySelector(
            zs(l)
          )) ? r._p || (m.instance = r, m.state.loading = 5) : (r = le.get(l), r || (r = {
            rel: "preload",
            as: "style",
            href: u.href,
            crossOrigin: u.crossOrigin,
            integrity: u.integrity,
            media: u.media,
            hrefLang: u.hrefLang,
            referrerPolicy: u.referrerPolicy
          }, le.set(l, r)), ig(
            s,
            l,
            r,
            m.state
          ))), n && i === null)
            throw Error(q(528, ""));
          return m;
        }
        if (n && i !== null)
          throw Error(q(529, ""));
        return null;
      case "script":
        return n = u.async, u = u.src, typeof u == "string" && n && typeof n != "function" && typeof n != "symbol" ? (u = Io(u), n = no(
          s
        ).hoistableScripts, i = n.get(u), i || (i = {
          type: "script",
          instance: null,
          count: 0,
          state: null
        }, n.set(u, i)), i) : { type: "void", instance: null, count: 0, state: null };
      default:
        throw Error(q(444, l));
    }
  }
  function Wo(l) {
    return 'href="' + Xa(l) + '"';
  }
  function zs(l) {
    return 'link[rel="stylesheet"][' + l + "]";
  }
  function cg(l) {
    return mt({}, l, {
      "data-precedence": l.precedence,
      precedence: null
    });
  }
  function ig(l, n, u, i) {
    if (n = l.querySelector(
      'link[rel="preload"][as="style"][' + n + "]"
    )) {
      if (n[ur] !== !0) {
        i.loading = 1;
        return;
      }
    } else
      n = l.createElement("link"), n[ur] = !0, n.onload = n.onerror = ir.bind(null, n), fl(n, "link", u), De(n), l.head.appendChild(n);
    i.preload = n, n.addEventListener("load", function() {
      return i.loading |= 1;
    }), n.addEventListener("error", function() {
      return i.loading |= 2;
    });
  }
  function Io(l) {
    return '[src="' + Xa(l) + '"]';
  }
  function ko(l) {
    return "script[async]" + l;
  }
  function sm(l, n, u) {
    if (n.count++, n.instance === null)
      switch (n.type) {
        case "style":
          var i = l.querySelector(
            'style[data-href~="' + Xa(u.href) + '"]'
          );
          if (i)
            return n.instance = i, De(i), i;
          var s = mt({}, u, {
            "data-href": u.href,
            "data-precedence": u.precedence,
            href: null,
            precedence: null
          });
          return i = (l.ownerDocument || l).createElement(
            "style"
          ), De(i), fl(i, "style", s), jl(i, u.precedence, l), n.instance = i;
        case "stylesheet":
          s = Wo(u.href);
          var r = l.querySelector(
            zs(s)
          );
          if (r)
            return n.state.loading |= 4, n.instance = r, De(r), r;
          i = cg(u), (s = le.get(s)) && bn(i, s), r = (l.ownerDocument || l).createElement("link"), De(r);
          var m = r;
          return m._p = new Promise(function(g, S) {
            m.onload = g, m.onerror = S;
          }), fl(r, "link", i), n.state.loading |= 4, jl(r, u.precedence, l), n.instance = r;
        case "script":
          return r = Io(u.src), (s = l.querySelector(
            ko(r)
          )) ? (n.instance = s, De(s), s) : (i = u, (s = le.get(r)) && (i = mt({}, u), Ha(i, s)), l = l.ownerDocument || l, s = l.createElement("script"), De(s), fl(s, "link", i), l.head.appendChild(s), n.instance = s);
        case "void":
          return null;
        default:
          throw Error(q(443, n.type));
      }
    else
      n.type === "stylesheet" && (n.state.loading & 4) === 0 && (i = n.instance, n.state.loading |= 4, jl(i, u.precedence, l));
    return n.instance;
  }
  function jl(l, n, u) {
    for (var i = u.querySelectorAll(
      'link[rel="stylesheet"][data-precedence],style[data-precedence]'
    ), s = i.length ? i[i.length - 1] : null, r = s, m = 0; m < i.length; m++) {
      var g = i[m];
      if (g.dataset.precedence === n) r = g;
      else if (r !== s) break;
    }
    r ? r.parentNode.insertBefore(l, r.nextSibling) : (n = u.nodeType === 9 ? u.head : u, n.insertBefore(l, n.firstChild));
  }
  function bn(l, n) {
    l.crossOrigin == null && (l.crossOrigin = n.crossOrigin), l.referrerPolicy == null && (l.referrerPolicy = n.referrerPolicy), l.title == null && (l.title = n.title);
  }
  function Ha(l, n) {
    l.crossOrigin == null && (l.crossOrigin = n.crossOrigin), l.referrerPolicy == null && (l.referrerPolicy = n.referrerPolicy), l.integrity == null && (l.integrity = n.integrity);
  }
  var As = null;
  function Kp(l, n, u) {
    if (As === null) {
      var i = /* @__PURE__ */ new Map(), s = As = /* @__PURE__ */ new Map();
      s.set(u, i);
    } else
      s = As, i = s.get(u), i || (i = /* @__PURE__ */ new Map(), s.set(u, i));
    if (i.has(l)) return i;
    for (i.set(l, null), u = u.getElementsByTagName(l), s = 0; s < u.length; s++) {
      var r = u[s];
      if (!(r[Ef] || r[ul] || l === "link" && r.getAttribute("rel") === "stylesheet") && r.namespaceURI !== "http://www.w3.org/2000/svg") {
        var m = r.getAttribute(n) || "";
        m = l + m;
        var g = i.get(m);
        g ? g.push(r) : i.set(m, [r]);
      }
    }
    return i;
  }
  function og(l, n, u) {
    l = l.ownerDocument || l, l.head.insertBefore(
      u,
      n === "title" ? l.querySelector("head > title") : null
    );
  }
  function zb(l, n, u) {
    if (u === 1 || n.itemProp != null) return !1;
    switch (l) {
      case "meta":
      case "title":
        return !0;
      case "style":
        if (typeof n.precedence != "string" || typeof n.href != "string" || n.href === "")
          break;
        return !0;
      case "link":
        if (typeof n.rel != "string" || typeof n.href != "string" || n.href === "" || n.onLoad || n.onError)
          break;
        return n.rel === "stylesheet" ? (l = n.disabled, typeof n.precedence == "string" && l == null) : !0;
      case "script":
        if (n.async && typeof n.async != "function" && typeof n.async != "symbol" && !n.onLoad && !n.onError && n.src && typeof n.src == "string")
          return !0;
    }
    return !1;
  }
  function Ue(l, n) {
    return l === "img" && n.src != null && n.src !== "" && n.onLoad == null && n.loading !== "lazy";
  }
  function $p(l) {
    return !(l.type === "stylesheet" && (l.state.loading & 3) === 0);
  }
  function rm(l) {
    return (l.width || 100) * (l.height || 100) * (typeof devicePixelRatio == "number" ? devicePixelRatio : 1) * 0.25;
  }
  function dm(l, n) {
    typeof n.decode == "function" && (l.imgCount++, n.complete || (l.imgBytes += rm(n), l.suspenseyImages.push(n)), l = Ds.bind(l), n.decode().then(l, l));
  }
  function Os(l, n, u, i) {
    if (u.type === "stylesheet" && (typeof i.media != "string" || matchMedia(i.media).matches !== !1) && (u.state.loading & 4) === 0) {
      if (u.instance === null) {
        var s = Wo(i.href), r = n.querySelector(
          zs(s)
        );
        if (r) {
          n = r._p, n !== null && typeof n == "object" && typeof n.then == "function" && (l.count++, l = Md.bind(l), n.then(l, l)), u.state.loading |= 4, u.instance = r, De(r);
          return;
        }
        r = n.ownerDocument || n, i = cg(i), (s = le.get(s)) && bn(i, s), r = r.createElement("link"), De(r);
        var m = r;
        m._p = new Promise(function(g, S) {
          m.onload = g, m.onerror = S;
        }), fl(r, "link", i), u.instance = r;
      }
      l.stylesheets === null && (l.stylesheets = /* @__PURE__ */ new Map()), l.stylesheets.set(u, n), (n = u.state.preload) && (u.state.loading & 3) === 0 && (l.count++, u = Md.bind(l), n.addEventListener("load", u), n.addEventListener("error", u));
    }
  }
  var hm = 0;
  function fg(l, n) {
    return l.stylesheets && l.count === 0 && Pa(l, l.stylesheets), 0 < l.count || 0 < l.imgCount ? function(u) {
      var i = setTimeout(function() {
        if (l.stylesheets && Pa(l, l.stylesheets), l.unsuspend) {
          var r = l.unsuspend;
          l.unsuspend = null, r();
        }
      }, 6e4 + n);
      0 < l.imgBytes && hm === 0 && (hm = 62500 * _p());
      var s = setTimeout(
        function() {
          if (l.waitingForImages = !1, l.count === 0 && (l.stylesheets && Pa(l, l.stylesheets), l.unsuspend)) {
            var r = l.unsuspend;
            l.unsuspend = null, r();
          }
        },
        (l.imgBytes > hm ? 50 : 800) + n
      );
      return l.unsuspend = u, function() {
        l.unsuspend = null, clearTimeout(i), clearTimeout(s);
      };
    } : null;
  }
  function Fp(l) {
    if (l.count === 0 && (l.imgCount === 0 || !l.waitingForImages)) {
      if (l.stylesheets) Pa(l, l.stylesheets);
      else if (l.unsuspend) {
        var n = l.unsuspend;
        l.unsuspend = null, n();
      }
    }
  }
  function Md() {
    this.count--, Fp(this);
  }
  function Ds() {
    this.imgCount--, Fp(this);
  }
  var ll = null;
  function Pa(l, n) {
    l.stylesheets = null, l.unsuspend !== null && (l.count++, ll = /* @__PURE__ */ new Map(), n.forEach(Ju, l), ll = null, Md.call(l));
  }
  function Ju(l, n) {
    if (!(n.state.loading & 4)) {
      var u = ll.get(l);
      if (u) var i = u.get(null);
      else {
        u = /* @__PURE__ */ new Map(), ll.set(l, u);
        for (var s = l.querySelectorAll(
          "link[data-precedence],style[data-precedence]"
        ), r = 0; r < s.length; r++) {
          var m = s[r];
          (m.nodeName === "LINK" || m.getAttribute("media") !== "not all") && (u.set(m.dataset.precedence, m), i = m);
        }
        i && u.set(null, i);
      }
      s = n.instance, m = s.getAttribute("data-precedence"), r = u.get(m) || i, r === i && u.set(null, s), u.set(m, s), this.count++, i = Md.bind(this), s.addEventListener("load", i), s.addEventListener("error", i), r ? r.parentNode.insertBefore(s, r.nextSibling) : (l = l.nodeType === 9 ? l.head : l, l.insertBefore(s, l.firstChild)), n.state.loading |= 4;
    }
  }
  var $e = {
    $$typeof: Rl,
    Provider: null,
    Consumer: null,
    _currentValue: Pi,
    _currentValue2: Pi,
    _threadCount: 0
  };
  function Ab(l, n, u, i, s, r, m, g, S) {
    this.tag = 1, this.containerInfo = l, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = bf(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = bf(0), this.hiddenUpdates = bf(null), this.identifierPrefix = i, this.onUncaughtError = s, this.onCaughtError = r, this.onRecoverableError = m, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = S, this.transitionTypes = null, this.incompleteTransitions = /* @__PURE__ */ new Map();
  }
  function Wp(l, n, u, i, s, r, m, g, S, C, N, G) {
    return l = new Ab(
      l,
      n,
      u,
      m,
      S,
      C,
      N,
      G,
      g
    ), n = 1, r === !0 && (n |= 24), r = Pl(3, null, null, n), l.current = r, r.stateNode = l, n = bl(), n.refCount++, l.pooledCache = n, n.refCount++, r.memoizedState = {
      element: i,
      isDehydrated: u,
      cache: n
    }, Ei(r), l;
  }
  function _d(l) {
    return l ? (l = Sc, l) : Sc;
  }
  function Ud(l, n, u, i, s, r) {
    s = _d(s), i.context === null ? i.context = s : i.pendingContext = s, i = Ea(n), i.payload = { element: u }, r = r === void 0 ? null : r, r !== null && (i.callback = r), u = Ve(l, i, n), u !== null && (Ma(u, l, n), zi(u, l, n));
  }
  function Nd(l, n) {
    if (l = l.memoizedState, l !== null && l.dehydrated !== null) {
      var u = l.retryLane;
      l.retryLane = u !== 0 && u < n ? u : n;
    }
  }
  function wl(l, n) {
    Nd(l, n), (l = l.alternate) && Nd(l, n);
  }
  function iu(l) {
    if (l.tag === 13 || l.tag === 31) {
      var n = yi(l, 67108864);
      n !== null && Ma(n, l, 67108864), wl(l, 67108864);
    }
  }
  function Ku(l) {
    if (l.tag === 13 || l.tag === 31) {
      var n = ka();
      n = nr(n);
      var u = yi(l, n);
      u !== null && Ma(u, l, n), wl(l, n);
    }
  }
  var wc = !0;
  function Xc(l, n, u, i) {
    var s = ft.T;
    ft.T = null;
    var r = Jt.p;
    try {
      Jt.p = 2, Al(l, n, u, i);
    } finally {
      Jt.p = r, ft.T = s;
    }
  }
  function zl(l, n, u, i) {
    var s = ft.T;
    ft.T = null;
    var r = Jt.p;
    try {
      Jt.p = 8, Al(l, n, u, i);
    } finally {
      Jt.p = r, ft.T = s;
    }
  }
  function Al(l, n, u, i) {
    if (wc) {
      var s = $u(i);
      if (s === null)
        ms(
          l,
          n,
          i,
          Hd,
          u
        ), rg(l, i);
      else if (Lt(
        s,
        l,
        n,
        u,
        i
      ))
        i.stopPropagation();
      else if (rg(l, i), n & 4 && -1 < Ob.indexOf(l)) {
        for (; s !== null; ) {
          var r = Bn(s);
          if (r !== null)
            switch (r.tag) {
              case 3:
                if (r = r.stateNode, r.current.memoizedState.isDehydrated) {
                  var m = ja(r.pendingLanes);
                  if (m !== 0) {
                    var g = r;
                    for (g.pendingLanes |= 2, g.entangledLanes |= 2; m; ) {
                      var S = 1 << 31 - Ml(m);
                      g.entanglements[1] |= S, m &= ~S;
                    }
                    Zu(r), (Kt & 6) === 0 && (hd = $l() + 500, vd(0));
                  }
                }
                break;
              case 31:
              case 13:
                g = yi(r, 2), g !== null && Ma(g, r, 2), J0(), wl(r, 2);
            }
          if (r = $u(i), r === null && ms(
            l,
            n,
            i,
            Hd,
            u
          ), r === s) break;
          s = r;
        }
        s !== null && i.stopPropagation();
      } else
        ms(
          l,
          n,
          i,
          null,
          u
        );
    }
  }
  function $u(l) {
    return l = pl(l), sg(l);
  }
  var Hd = null;
  function sg(l) {
    if (Hd = null, l = We(l), l !== null) {
      var n = qa(l);
      if (n === null) l = null;
      else {
        var u = n.tag;
        if (u === 13) {
          if (l = Mn(n), l !== null) return l;
          l = null;
        } else if (u === 31) {
          if (l = W(n), l !== null) return l;
          l = null;
        } else if (u === 3) {
          if (n.stateNode.current.memoizedState.isDehydrated)
            return n.tag === 3 ? n.stateNode.containerInfo : null;
          l = null;
        } else n !== l && (l = null);
      }
    }
    return Hd = l, null;
  }
  function Ip(l) {
    switch (l) {
      case "beforetoggle":
      case "cancel":
      case "click":
      case "close":
      case "contextmenu":
      case "copy":
      case "cut":
      case "auxclick":
      case "dblclick":
      case "dragend":
      case "dragstart":
      case "drop":
      case "focusin":
      case "focusout":
      case "input":
      case "invalid":
      case "keydown":
      case "keypress":
      case "keyup":
      case "mousedown":
      case "mouseup":
      case "paste":
      case "pause":
      case "play":
      case "pointercancel":
      case "pointerdown":
      case "pointerup":
      case "ratechange":
      case "reset":
      case "seeked":
      case "submit":
      case "toggle":
      case "touchcancel":
      case "touchend":
      case "touchstart":
      case "volumechange":
      case "change":
      case "selectionchange":
      case "textInput":
      case "compositionstart":
      case "compositionend":
      case "compositionupdate":
      case "beforeblur":
      case "afterblur":
      case "beforeinput":
      case "blur":
      case "fullscreenchange":
      case "fullscreenerror":
      case "focus":
      case "hashchange":
      case "popstate":
      case "select":
      case "selectstart":
        return 2;
      case "drag":
      case "dragenter":
      case "dragexit":
      case "dragleave":
      case "dragover":
      case "mousemove":
      case "mouseout":
      case "mouseover":
      case "pointermove":
      case "pointerout":
      case "pointerover":
      case "resize":
      case "scroll":
      case "touchmove":
      case "wheel":
      case "mouseenter":
      case "mouseleave":
      case "pointerenter":
      case "pointerleave":
        return 8;
      case "message":
        switch (tr()) {
          case d1:
            return 2;
          case ty:
            return 8;
          case er:
          case h1:
            return 32;
          case fh:
            return 268435456;
          default:
            return 32;
        }
      default:
        return 32;
    }
  }
  var mm = !1, Tn = null, ou = null, Qc = null, fu = /* @__PURE__ */ new Map(), Po = /* @__PURE__ */ new Map(), Gi = [], Ob = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(
    " "
  );
  function rg(l, n) {
    switch (l) {
      case "focusin":
      case "focusout":
        Tn = null;
        break;
      case "dragenter":
      case "dragleave":
        ou = null;
        break;
      case "mouseover":
      case "mouseout":
        Qc = null;
        break;
      case "pointerover":
      case "pointerout":
        fu.delete(n.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        Po.delete(n.pointerId);
    }
  }
  function Cs(l, n, u, i, s, r) {
    return l === null || l.nativeEvent !== r ? (l = {
      blockedOn: n,
      domEventName: u,
      eventSystemFlags: i,
      nativeEvent: r,
      targetContainers: [s]
    }, n !== null && (n = Bn(n), n !== null && iu(n)), l) : (l.eventSystemFlags |= i, n = l.targetContainers, s !== null && n.indexOf(s) === -1 && n.push(s), l);
  }
  function Lt(l, n, u, i, s) {
    switch (n) {
      case "focusin":
        return Tn = Cs(
          Tn,
          l,
          n,
          u,
          i,
          s
        ), !0;
      case "dragenter":
        return ou = Cs(
          ou,
          l,
          n,
          u,
          i,
          s
        ), !0;
      case "mouseover":
        return Qc = Cs(
          Qc,
          l,
          n,
          u,
          i,
          s
        ), !0;
      case "pointerover":
        var r = s.pointerId;
        return fu.set(
          r,
          Cs(
            fu.get(r) || null,
            l,
            n,
            u,
            i,
            s
          )
        ), !0;
      case "gotpointercapture":
        return r = s.pointerId, Po.set(
          r,
          Cs(
            Po.get(r) || null,
            l,
            n,
            u,
            i,
            s
          )
        ), !0;
    }
    return !1;
  }
  function kp(l) {
    var n = We(l.target);
    if (n !== null) {
      var u = qa(n);
      if (u !== null) {
        if (n = u.tag, n === 13) {
          if (n = Mn(u), n !== null) {
            l.blockedOn = n, ay(l.priority, function() {
              Ku(u);
            });
            return;
          }
        } else if (n === 31) {
          if (n = W(u), n !== null) {
            l.blockedOn = n, ay(l.priority, function() {
              Ku(u);
            });
            return;
          }
        } else if (n === 3 && u.stateNode.current.memoizedState.isDehydrated) {
          l.blockedOn = u.tag === 3 ? u.stateNode.containerInfo : null;
          return;
        }
      }
    }
    l.blockedOn = null;
  }
  function Bd(l) {
    if (l.blockedOn !== null) return !1;
    for (var n = l.targetContainers; 0 < n.length; ) {
      var u = $u(l.nativeEvent);
      if (u === null) {
        u = l.nativeEvent;
        var i = new u.constructor(
          u.type,
          u
        );
        gh = i, u.target.dispatchEvent(i), gh = null;
      } else
        return n = Bn(u), n !== null && iu(n), l.blockedOn = u, !1;
      n.shift();
    }
    return !0;
  }
  function dg(l, n, u) {
    Bd(l) && u.delete(n);
  }
  function Pp() {
    mm = !1, Tn !== null && Bd(Tn) && (Tn = null), ou !== null && Bd(ou) && (ou = null), Qc !== null && Bd(Qc) && (Qc = null), fu.forEach(dg), Po.forEach(dg);
  }
  function xd(l, n) {
    l.blockedOn === n && (l.blockedOn = null, mm || (mm = !0, K.unstable_scheduleCallback(
      K.unstable_NormalPriority,
      Pp
    )));
  }
  var Yd = null;
  function hg(l) {
    Yd !== l && (Yd = l, K.unstable_scheduleCallback(
      K.unstable_NormalPriority,
      function() {
        Yd === l && (Yd = null);
        for (var n = 0; n < l.length; n += 3) {
          var u = l[n], i = l[n + 1], s = l[n + 2];
          if (typeof i != "function") {
            if (sg(i || u) === null)
              continue;
            break;
          }
          var r = Bn(u);
          r !== null && (l.splice(n, 3), n -= 3, rn(
            r,
            {
              pending: !0,
              data: s,
              method: u.method,
              action: i
            },
            i,
            s
          ));
        }
      }
    ));
  }
  function tf(l) {
    function n(S) {
      return xd(S, l);
    }
    Tn !== null && xd(Tn, l), ou !== null && xd(ou, l), Qc !== null && xd(Qc, l), fu.forEach(n), Po.forEach(n);
    for (var u = 0; u < Gi.length; u++) {
      var i = Gi[u];
      i.blockedOn === l && (i.blockedOn = null);
    }
    for (; 0 < Gi.length && (u = Gi[0], u.blockedOn === null); )
      kp(u), u.blockedOn === null && Gi.shift();
    if (u = (l.ownerDocument || l).$$reactFormReplay, u != null)
      for (i = 0; i < u.length; i += 3) {
        var s = u[i], r = u[i + 1], m = s[_l] || null;
        if (typeof r == "function")
          m || hg(u);
        else if (m) {
          var g = null;
          if (r && r.hasAttribute("formAction")) {
            if (s = r, m = r[_l] || null)
              g = m.formAction;
            else if (sg(s) !== null) continue;
          } else g = m.action;
          typeof g == "function" ? u[i + 1] = g : (u.splice(i, 3), i -= 3), hg(u);
        }
      }
  }
  function mg() {
    function l(r) {
      r.canIntercept && r.info === "react-transition" && r.intercept({
        handler: function() {
          return new Promise(function(m) {
            return s = m;
          });
        },
        focusReset: "manual",
        scroll: "manual"
      });
    }
    function n() {
      s !== null && (s(), s = null), i || setTimeout(u, 20);
    }
    function u() {
      if (!i && !navigation.transition) {
        var r = navigation.currentEntry;
        r && r.url != null && navigation.navigate(r.url, {
          state: r.getState(),
          info: "react-transition",
          history: "replace"
        });
      }
    }
    if (typeof navigation == "object") {
      var i = !1, s = null;
      return navigation.addEventListener("navigate", l), navigation.addEventListener("navigatesuccess", n), navigation.addEventListener("navigateerror", n), setTimeout(u, 100), function() {
        i = !0, navigation.removeEventListener("navigate", l), navigation.removeEventListener("navigatesuccess", n), navigation.removeEventListener("navigateerror", n), s !== null && (s(), s = null);
      };
    }
  }
  function ym(l) {
    this._internalRoot = l;
  }
  vm.prototype.render = ym.prototype.render = function(l) {
    var n = this._internalRoot;
    if (n === null) throw Error(q(409));
    var u = n.current, i = ka();
    Ud(u, i, l, n, null, null);
  }, vm.prototype.unmount = ym.prototype.unmount = function() {
    var l = this._internalRoot;
    if (l !== null) {
      this._internalRoot = null;
      var n = l.containerInfo;
      Ud(l.current, 2, null, l, null, null), J0(), n[ao] = null;
    }
  };
  function vm(l) {
    this._internalRoot = l;
  }
  vm.prototype.unstable_scheduleHydration = function(l) {
    if (l) {
      var n = wa();
      l = { blockedOn: null, target: l, priority: n };
      for (var u = 0; u < Gi.length && n !== 0 && n < Gi[u].priority; u++) ;
      Gi.splice(u, 0, l), u === 0 && kp(l);
    }
  };
  var yg = ma.version;
  if (yg !== "19.3.1")
    throw Error(
      q(
        527,
        yg,
        "19.3.1"
      )
    );
  Jt.findDOMNode = function(l) {
    var n = l._reactInternals;
    if (n === void 0)
      throw typeof l.render == "function" ? Error(q(188)) : (l = Object.keys(l).join(","), Error(q(268, l)));
    return l = va(n), l = l !== null ? Wi(l) : null, l = l === null ? null : l.stateNode, l;
  };
  var Db = {
    bundleType: 0,
    version: "19.3.1",
    rendererPackageName: "react-dom",
    currentDispatcherRef: ft,
    reconcilerVersion: "19.3.1"
  };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var gm = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!gm.isDisabled && gm.supportsFiber)
      try {
        eo = gm.inject(
          Db
        ), Fl = gm;
      } catch {
      }
  }
  return s1.createRoot = function(l, n) {
    if (!ya(l)) throw Error(q(299));
    var u = !1, i = "", s = ev, r = v0, m = g0;
    return n != null && (n.unstable_strictMode === !0 && (u = !0), n.identifierPrefix !== void 0 && (i = n.identifierPrefix), n.onUncaughtError !== void 0 && (s = n.onUncaughtError), n.onCaughtError !== void 0 && (r = n.onCaughtError), n.onRecoverableError !== void 0 && (m = n.onRecoverableError)), n = Wp(
      l,
      1,
      !1,
      null,
      null,
      u,
      i,
      null,
      s,
      r,
      m,
      mg
    ), l[ao] = n.current, em(l), new ym(n);
  }, s1.hydrateRoot = function(l, n, u) {
    if (!ya(l)) throw Error(q(299));
    var i = !1, s = "", r = ev, m = v0, g = g0, S = null;
    return u != null && (u.unstable_strictMode === !0 && (i = !0), u.identifierPrefix !== void 0 && (s = u.identifierPrefix), u.onUncaughtError !== void 0 && (r = u.onUncaughtError), u.onCaughtError !== void 0 && (m = u.onCaughtError), u.onRecoverableError !== void 0 && (g = u.onRecoverableError), u.formState !== void 0 && (S = u.formState)), n = Wp(
      l,
      1,
      !0,
      n,
      u ?? null,
      i,
      s,
      S,
      r,
      m,
      g,
      mg
    ), n.context = _d(null), u = n.current, i = ka(), i = nr(i), s = Ea(i), s.callback = null, Ve(u, s, i), u = i, n.current.lanes = u, ai(n, u), Zu(n), l[ao] = n.current, em(l), new vm(n);
  }, s1.version = "19.3.1", s1;
}
var r1 = {};
var nE;
function U4() {
  return nE || (nE = 1, process.env.NODE_ENV !== "production" && (function() {
    function K(t, e) {
      for (t = t.memoizedState; t !== null && 0 < e; )
        t = t.next, e--;
      return t;
    }
    function ma(t, e, a, c) {
      if (a >= e.length) return c;
      var o = e[a], f = le(t) ? t.slice() : pt({}, t);
      return f[o] = ma(t[o], e, a + 1, c), f;
    }
    function hl(t, e, a) {
      if (e.length !== a.length)
        console.warn("copyWithRename() expects paths of the same length");
      else {
        for (var c = 0; c < a.length - 1; c++)
          if (e[c] !== a[c]) {
            console.warn(
              "copyWithRename() expects paths to be the same except for the deepest key"
            );
            return;
          }
        return q(t, e, a, 0);
      }
    }
    function q(t, e, a, c) {
      var o = e[c], f = le(t) ? t.slice() : pt({}, t);
      return c + 1 === e.length ? (f[a[c]] = f[o], le(f) ? f.splice(o, 1) : delete f[o]) : f[o] = q(
        t[o],
        e,
        a,
        c + 1
      ), f;
    }
    function ya(t, e, a) {
      var c = e[a], o = le(t) ? t.slice() : pt({}, t);
      return a + 1 === e.length ? (le(o) ? o.splice(c, 1) : delete o[c], o) : (o[c] = ya(t[c], e, a + 1), o);
    }
    function qa() {
      return !1;
    }
    function Mn() {
      return null;
    }
    function W() {
      console.error(
        "Do not call Hooks inside useEffect(...), useMemo(...), or other built-in Hooks. You can only call Hooks at the top level of your React function. For more information, see https://react.dev/link/rules-of-hooks"
      );
    }
    function ml() {
      console.error(
        "Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo()."
      );
    }
    function va() {
    }
    function Wi() {
    }
    function Yt(t) {
      var e = [];
      return t.forEach(function(a) {
        e.push(a);
      }), e.sort().join(", ");
    }
    function Ot(t, e, a, c) {
      return new x1(t, e, a, c);
    }
    function Cl(t, e) {
      t.context === Ns && (nm(t.current, 2, e, t, null, null), qo());
    }
    function yl(t, e) {
      if (af !== null) {
        var a = e.staleFamilies;
        e = e.updatedFamilies, us(), Ey(
          t.current,
          e,
          a
        ), qo();
      }
    }
    function vu(t) {
      af = t;
    }
    function Mt(t) {
      return !(!t || t.nodeType !== 1 && t.nodeType !== 9 && t.nodeType !== 11);
    }
    function Wt(t) {
      for (var e = t, a = e; a && !a.alternate; )
        e = a, (e.flags & 4098) !== 0 && (t = e.return), a = e.return;
      for (; e.return; ) e = e.return;
      return e.tag === 3 ? t : null;
    }
    function _n(t) {
      if (t.tag === 13) {
        var e = t.memoizedState;
        if (e === null && (t = t.alternate, t !== null && (e = t.memoizedState)), e !== null) return e.dehydrated;
      }
      return null;
    }
    function Un(t) {
      if (t.tag === 31) {
        var e = t.memoizedState;
        if (e === null && (t = t.alternate, t !== null && (e = t.memoizedState)), e !== null) return e.dehydrated;
      }
      return null;
    }
    function Ga(t) {
      if (Wt(t) !== t)
        throw Error("Unable to find node on an unmounted component.");
    }
    function gu(t) {
      var e = t.alternate;
      if (!e) {
        if (e = Wt(t), e === null)
          throw Error("Unable to find node on an unmounted component.");
        return e !== t ? null : t;
      }
      for (var a = t, c = e; ; ) {
        var o = a.return;
        if (o === null) break;
        var f = o.alternate;
        if (f === null) {
          if (c = o.return, c !== null) {
            a = c;
            continue;
          }
          break;
        }
        if (o.child === f.child) {
          for (f = o.child; f; ) {
            if (f === a) return Ga(o), t;
            if (f === c) return Ga(o), e;
            f = f.sibling;
          }
          throw Error("Unable to find node on an unmounted component.");
        }
        if (a.return !== c.return) a = o, c = f;
        else {
          for (var d = !1, h = o.child; h; ) {
            if (h === a) {
              d = !0, a = o, c = f;
              break;
            }
            if (h === c) {
              d = !0, c = o, a = f;
              break;
            }
            h = h.sibling;
          }
          if (!d) {
            for (h = f.child; h; ) {
              if (h === a) {
                d = !0, a = f, c = o;
                break;
              }
              if (h === c) {
                d = !0, c = f, a = o;
                break;
              }
              h = h.sibling;
            }
            if (!d)
              throw Error(
                "Child was not found in either parent set. This indicates a bug in React related to the return pointer. Please file an issue."
              );
          }
        }
        if (a.alternate !== c)
          throw Error(
            "Return fibers should always be each others' alternates. This error is likely caused by a bug in React. Please file an issue."
          );
      }
      if (a.tag !== 3)
        throw Error("Unable to find node on an unmounted component.");
      return a.stateNode.current === a ? t : e;
    }
    function ga(t) {
      var e = t.tag;
      if (e === 5 || e === 26 || e === 27 || e === 6) return t;
      for (t = t.child; t !== null; ) {
        if (e = ga(t), e !== null) return e;
        t = t.sibling;
      }
      return null;
    }
    function mt(t, e, a, c, o) {
      nn(
        t.child,
        !1,
        e,
        a,
        c,
        o
      );
    }
    function nn(t, e, a, c, o, f) {
      for (; t !== null; ) {
        if ((t.tag === 5 || t.tag === 27 || t.tag === 6) && a(t, c, o, f) || (t.tag !== 22 || t.memoizedState === null) && (e || t.tag !== 5 && t.tag !== 27) && nn(
          t.child,
          e,
          a,
          c,
          o,
          f
        ))
          return !0;
        t = t.sibling;
      }
      return !1;
    }
    function Qe(t) {
      for (t = t.return; t !== null; ) {
        if (t.tag === 3 || t.tag === 5 || t.tag === 27)
          return t;
        t = t.return;
      }
      return null;
    }
    function Kl(t) {
      var e = !1;
      for (t = t.return; t !== null && (t.tag === 4 && (e = !0), !(t.tag === 3 || t.tag === 5 || t.tag === 27)); )
        t = t.return;
      return e;
    }
    function pa(t) {
      var e = [null, null], a = Qe(t);
      return a === null || Va(
        e,
        t,
        a.child,
        { foundSelf: !1 }
      ), e;
    }
    function Va(t, e, a, c) {
      for (; a !== null; ) {
        if (a === e) c.foundSelf = !0;
        else if (a.tag === 5 || a.tag === 27 || a.tag === 6) {
          if (c.foundSelf) return t[1] = a, !0;
          t[0] = a;
        } else if ((a.tag !== 22 || a.memoizedState === null) && Va(
          t,
          e,
          a.child,
          c
        ))
          return !0;
        a = a.sibling;
      }
      return !1;
    }
    function It(t) {
      switch (t.tag) {
        case 5:
        case 27:
        case 6:
          return t.stateNode;
        case 3:
          return t.stateNode.containerInfo;
        default:
          throw Error("Expected to find a host node. This is a bug in React.");
      }
    }
    function Ii(t, e, a) {
      return t === a ? !0 : t === e ? (Ss = t, !0) : !1;
    }
    function Rl(t, e, a) {
      return t === a ? (Wv = t, !1) : t === e ? (Wv !== null && (Ss = t), !0) : !1;
    }
    function Y(t) {
      if (t === null) return null;
      do
        t = t === null ? null : t.return;
      while (t && t.tag !== 5 && t.tag !== 27 && t.tag !== 3);
      return t || null;
    }
    function L(t, e, a) {
      for (var c = 0, o = t; o; o = a(o))
        c++;
      o = 0;
      for (var f = e; f; f = a(f)) o++;
      for (; 0 < c - o; ) t = a(t), c--;
      for (; 0 < o - c; ) e = a(e), o--;
      for (; c--; ) {
        if (t === e || e !== null && t === e.alternate)
          return t;
        t = a(t), e = a(e);
      }
      return null;
    }
    function Q(t) {
      return t === null || typeof t != "object" ? null : (t = eg && t[eg] || t["@@iterator"], typeof t == "function" ? t : null);
    }
    function P(t) {
      if (t == null) return null;
      if (typeof t == "function")
        return t.$$typeof === lg ? null : t.displayName || t.name || null;
      if (typeof t == "string") return t;
      switch (t) {
        case bs:
          return "Fragment";
        case Iv:
          return "Profiler";
        case Ts:
          return "StrictMode";
        case Dd:
          return "Suspense";
        case Pv:
          return "SuspenseList";
        case om:
          return "Activity";
        case tg:
          return "ViewTransition";
      }
      if (typeof t == "object")
        switch (typeof t.tag == "number" && console.error(
          "Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."
        ), t.$$typeof) {
          case Fo:
            return "Portal";
          case Sn:
            return t.displayName || "Context";
          case kv:
            return (t._context.displayName || "Context") + ".Consumer";
          case Es:
            var e = t.render;
            return t = t.displayName, t || (t = e.displayName || e.name || "", t = t !== "" ? "ForwardRef(" + t + ")" : "ForwardRef"), t;
          case ra:
            return e = t.displayName || null, e !== null ? e : P(t.type) || "Memo";
          case Vl:
            e = t._payload, t = t._init;
            try {
              return P(t(e));
            } catch {
            }
        }
      return null;
    }
    function dt(t) {
      return typeof t.tag == "number" ? tt(t) : typeof t.name == "string" ? t.name : null;
    }
    function tt(t) {
      var e = t.type;
      switch (t.tag) {
        case 31:
          return "Activity";
        case 24:
          return "Cache";
        case 9:
          return (e._context.displayName || "Context") + ".Consumer";
        case 10:
          return e.displayName || "Context";
        case 18:
          return "DehydratedFragment";
        case 11:
          return t = e.render, t = t.displayName || t.name || "", e.displayName || (t !== "" ? "ForwardRef(" + t + ")" : "ForwardRef");
        case 7:
          return "Fragment";
        case 26:
        case 27:
        case 5:
          return e;
        case 4:
          return "Portal";
        case 3:
          return "Root";
        case 6:
          return "Text";
        case 16:
          return P(e);
        case 8:
          return e === Ts ? "StrictMode" : "Mode";
        case 22:
          if (t.return !== null)
            return tt(t.return);
          break;
        case 12:
          return "Profiler";
        case 21:
          return "Scope";
        case 13:
          return "Suspense";
        case 19:
          return "SuspenseList";
        case 25:
          return "TracingMarker";
        case 30:
          return "ViewTransition";
        case 1:
        case 0:
        case 14:
        case 15:
          if (typeof e == "function")
            return e.displayName || e.name || null;
          if (typeof e == "string") return e;
          break;
        case 29:
          if (e = t._debugInfo, e != null) {
            for (var a = e.length - 1; 0 <= a; a--)
              if (typeof e[a].name == "string") return e[a].name;
          }
          if (t.return !== null)
            return tt(t.return);
      }
      return null;
    }
    function Ye(t) {
      return { current: t };
    }
    function de(t, e) {
      0 > Na ? console.error("Unexpected pop.") : (e !== ng[Na] && console.error("Unexpected Fiber popped."), t.current = ag[Na], ag[Na] = null, ng[Na] = null, Na--);
    }
    function yt(t, e, a) {
      Na++, ag[Na] = t.current, ng[Na] = a, t.current = e;
    }
    function vl(t) {
      return t === null && console.error(
        "Expected host context to exist. This error is likely caused by a bug in React. Please file an issue."
      ), t;
    }
    function Is(t, e) {
      yt(qi, e, t), yt(Cd, t, t), yt(jc, null, t);
      var a = e.nodeType;
      switch (a) {
        case 9:
        case 11:
          a = a === 9 ? "#document" : "#fragment", e = (e = e.documentElement) && (e = e.namespaceURI) ? Z0(e) : mf;
          break;
        default:
          if (a = e.tagName, e = e.namespaceURI)
            e = Z0(e), e = L0(
              e,
              a
            );
          else
            switch (a) {
              case "svg":
                e = $m;
                break;
              case "math":
                e = $S;
                break;
              default:
                e = mf;
            }
      }
      a = a.toLowerCase(), a = or(null, a), a = {
        context: e,
        ancestorInfo: a
      }, de(jc, t), yt(jc, a, t);
    }
    function pu(t) {
      de(jc, t), de(Cd, t), de(qi, t);
    }
    function ki() {
      return vl(jc.current);
    }
    function ks(t) {
      var e = t.memoizedState;
      e !== null && (Wm._currentValue = e.memoizedState, yt(fm, t, t)), e = vl(jc.current);
      var a = t.type, c = L0(e.context, a);
      a = or(e.ancestorInfo, a), c = { context: c, ancestorInfo: a }, e !== c && (yt(Cd, t, t), yt(jc, c, t));
    }
    function kc(t) {
      Cd.current === t && (de(jc, t), de(Cd, t)), fm.current === t && (de(fm, t), Wm._currentValue = ch);
    }
    function ft() {
    }
    function Jt() {
      if (Rd === 0) {
        Zp = console.log, Lp = console.info, Jp = console.warn, ug = console.error, Wo = console.group, zs = console.groupCollapsed, cg = console.groupEnd;
        var t = {
          configurable: !0,
          enumerable: !0,
          value: ft,
          writable: !0
        };
        Object.defineProperties(console, {
          info: t,
          log: t,
          warn: t,
          error: t,
          group: t,
          groupCollapsed: t,
          groupEnd: t
        });
      }
      Rd++;
    }
    function Pi() {
      if (Rd--, Rd === 0) {
        var t = { configurable: !0, enumerable: !0, writable: !0 };
        Object.defineProperties(console, {
          log: pt({}, t, { value: Zp }),
          info: pt({}, t, { value: Lp }),
          warn: pt({}, t, { value: Jp }),
          error: pt({}, t, { value: ug }),
          group: pt({}, t, { value: Wo }),
          groupCollapsed: pt({}, t, { value: zs }),
          groupEnd: pt({}, t, { value: cg })
        });
      }
      0 > Rd && console.error(
        "disabledDepth fell below zero. This is a bug in React. Please file an issue."
      );
    }
    function Ps(t) {
      var e = Error.prepareStackTrace;
      if (Error.prepareStackTrace = void 0, t = t.stack, Error.prepareStackTrace = e, t.startsWith(`Error: react-stack-top-frame
`) && (t = t.slice(29)), e = t.indexOf(`
`), e !== -1 && (t = t.slice(e + 1)), e = t.indexOf("react_stack_bottom_frame"), e !== -1 && (e = t.lastIndexOf(
        `
`,
        e
      )), e !== -1)
        t = t.slice(0, e);
      else return "";
      return t;
    }
    function Ze(t) {
      if (ig === void 0)
        try {
          throw Error();
        } catch (a) {
          var e = a.stack.trim().match(/\n( *(at )?)/);
          ig = e && e[1] || "", Io = -1 < a.stack.indexOf(`
    at`) ? " (<anonymous>)" : -1 < a.stack.indexOf("@") ? "@unknown:0:0" : "";
        }
      return `
` + ig + t + Io;
    }
    function un(t, e) {
      if (!t || ko) return "";
      var a = sm.get(t);
      if (a !== void 0) return a;
      ko = !0, a = Error.prepareStackTrace, Error.prepareStackTrace = void 0;
      var c = null;
      c = x.H, x.H = null, Jt();
      try {
        var o = {
          DetermineComponentFrameRoot: function() {
            try {
              if (e) {
                var E = function() {
                  throw Error();
                };
                if (Object.defineProperty(E.prototype, "props", {
                  set: function() {
                    throw Error();
                  }
                }), typeof Reflect == "object" && Reflect.construct) {
                  try {
                    Reflect.construct(E, []);
                  } catch (J) {
                    var M = J;
                  }
                  Reflect.construct(t, [], E);
                } else {
                  try {
                    E.call();
                  } catch (J) {
                    M = J;
                  }
                  E = !1;
                  try {
                    var j = Object.getOwnPropertyDescriptor(
                      t.prototype,
                      "props"
                    );
                    Object.defineProperty(t.prototype, "props", {
                      configurable: !0,
                      set: function() {
                        throw Error();
                      }
                    }), E = !0, new t();
                  } finally {
                    E && (j !== void 0 ? Object.defineProperty(
                      t.prototype,
                      "props",
                      j
                    ) : delete t.prototype.props);
                  }
                }
              } else {
                try {
                  throw Error();
                } catch (J) {
                  M = J;
                }
                (E = t()) && typeof E.catch == "function" && E.catch(function() {
                });
              }
            } catch (J) {
              if (J && M && typeof J.stack == "string")
                return [J.stack, M.stack];
            }
            return [null, null];
          }
        };
        o.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
        var f = Object.getOwnPropertyDescriptor(
          o.DetermineComponentFrameRoot,
          "name"
        );
        f && f.configurable && Object.defineProperty(
          o.DetermineComponentFrameRoot,
          "name",
          { value: "DetermineComponentFrameRoot" }
        );
        var d = o.DetermineComponentFrameRoot(), h = d[0], y = d[1];
        if (h && y) {
          var v = h.split(`
`), p = y.split(`
`);
          for (d = f = 0; f < v.length && !v[f].includes(
            "DetermineComponentFrameRoot"
          ); )
            f++;
          for (; d < p.length && !p[d].includes(
            "DetermineComponentFrameRoot"
          ); )
            d++;
          if (f === v.length || d === p.length)
            for (f = v.length - 1, d = p.length - 1; 1 <= f && 0 <= d && v[f] !== p[d]; )
              d--;
          for (; 1 <= f && 0 <= d; f--, d--)
            if (v[f] !== p[d]) {
              if (f !== 1 || d !== 1)
                do
                  if (f--, d--, 0 > d || v[f] !== p[d]) {
                    var z = `
` + v[f].replace(
                      " at new ",
                      " at "
                    );
                    return t.displayName && z.includes("<anonymous>") && (z = z.replace("<anonymous>", t.displayName)), typeof t == "function" && sm.set(t, z), z;
                  }
                while (1 <= f && 0 <= d);
              break;
            }
        }
      } finally {
        ko = !1, x.H = c, Pi(), Error.prepareStackTrace = a;
      }
      return v = (v = t ? t.displayName || t.name : "") ? Ze(v) : "", typeof t == "function" && sm.set(t, v), v;
    }
    function gl(t, e) {
      switch (t.tag) {
        case 26:
        case 27:
        case 5:
          return Ze(t.type);
        case 16:
          return Ze("Lazy");
        case 13:
          return t.child !== e && e !== null ? Ze("Suspense Fallback") : Ze("Suspense");
        case 19:
          return Ze("SuspenseList");
        case 0:
        case 15:
          return un(t.type, !1);
        case 11:
          return un(t.type.render, !1);
        case 1:
          return un(t.type, !0);
        case 31:
          return Ze("Activity");
        case 30:
          return Ze("ViewTransition");
        default:
          return "";
      }
    }
    function fe(t) {
      try {
        var e = "", a = null;
        do {
          e += gl(t, a);
          var c = t._debugInfo;
          if (c)
            for (var o = c.length - 1; 0 <= o; o--) {
              var f = c[o];
              if (typeof f.name == "string") {
                var d = e;
                t: {
                  var h = f.name, y = f.env, v = f.debugLocation;
                  if (v != null) {
                    var p = Ps(v), z = p.lastIndexOf(`
`), E = z === -1 ? p : p.slice(z + 1);
                    if (E.indexOf(h) !== -1) {
                      var M = `
` + E;
                      break t;
                    }
                  }
                  M = Ze(
                    h + (y ? " [" + y + "]" : "")
                  );
                }
                e = d + M;
              }
            }
          a = t, t = t.return;
        } while (t);
        return e;
      } catch (j) {
        return `
Error generating stack: ` + j.message + `
` + j.stack;
      }
    }
    function Nn(t) {
      return (t = t ? t.displayName || t.name : "") ? Ze(t) : "";
    }
    function Pc() {
      if (jl === null) return null;
      var t = jl._debugOwner;
      return t != null ? dt(t) : null;
    }
    function ti() {
      if (jl === null) return "";
      var t = jl;
      try {
        var e = "";
        switch (t.tag === 6 && (t = t.return), t.tag) {
          case 26:
          case 27:
          case 5:
            e += Ze(t.type);
            break;
          case 13:
            e += Ze("Suspense");
            break;
          case 19:
            e += Ze("SuspenseList");
            break;
          case 31:
            e += Ze("Activity");
            break;
          case 30:
            e += Ze("ViewTransition");
            break;
          case 0:
          case 15:
          case 1:
            t._debugOwner || e !== "" || (e += Nn(
              t.type
            ));
            break;
          case 11:
            t._debugOwner || e !== "" || (e += Nn(
              t.type.render
            ));
        }
        for (; t; )
          if (typeof t.tag == "number") {
            var a = t;
            t = a._debugOwner;
            var c = a._debugStack;
            if (t && c) {
              var o = Ps(c);
              o !== "" && (e += `
` + o);
            }
          } else if (t.debugStack != null) {
            var f = t.debugStack;
            (t = t.owner) && f && (e += `
` + Ps(f));
          } else break;
        var d = e;
      } catch (h) {
        d = `
Error generating stack: ` + h.message + `
` + h.stack;
      }
      return d;
    }
    function $(t, e, a, c, o, f, d) {
      var h = jl;
      gf(t);
      try {
        return t !== null && t._debugTask ? t._debugTask.run(
          e.bind(null, a, c, o, f, d)
        ) : e(a, c, o, f, d);
      } finally {
        gf(h);
      }
      throw Error(
        "runWithFiberInDEV should never be called in production. This is a bug in React."
      );
    }
    function gf(t) {
      x.getCurrentStack = t === null ? null : ti, bn = !1, jl = t;
    }
    function uc(t) {
      return typeof Symbol == "function" && Symbol.toStringTag && t[Symbol.toStringTag] || t.constructor.name || "Object";
    }
    function pf(t) {
      try {
        return ei(t), !1;
      } catch {
        return !0;
      }
    }
    function ei(t) {
      return "" + t;
    }
    function ne(t, e) {
      if (pf(t))
        return console.error(
          "The provided `%s` attribute is an unsupported type %s. This value must be coerced to a string before using it here.",
          e,
          uc(t)
        ), ei(t);
    }
    function ih(t, e) {
      if (pf(t))
        return console.error(
          "The provided `%s` CSS property is an unsupported type %s. This value must be coerced to a string before using it here.",
          e,
          uc(t)
        ), ei(t);
    }
    function Su(t) {
      if (pf(t))
        return console.error(
          "Form field values (value, checked, defaultValue, or defaultChecked props) must be strings, not %s. This value must be coerced to a string before using it here.",
          uc(t)
        ), ei(t);
    }
    function km(t) {
      if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u") return !1;
      var e = __REACT_DEVTOOLS_GLOBAL_HOOK__;
      if (e.isDisabled) return !0;
      if (!e.supportsFiber)
        return console.error(
          "The installed version of React DevTools is too old and will not work with the current version of React. Please update React DevTools. https://react.dev/link/react-devtools"
        ), !0;
      try {
        Ds = e.inject(t), ll = e;
      } catch (a) {
        console.error("React instrumentation encountered an error: %o.", a);
      }
      return !!e.checkDCE;
    }
    function he(t) {
      if (typeof Fp == "function" && Md(t), ll && typeof ll.setStrictMode == "function")
        try {
          ll.setStrictMode(Ds, t);
        } catch (e) {
          Pa || (Pa = !0, console.error(
            "React instrumentation encountered an error: %o",
            e
          ));
        }
    }
    function ab(t) {
      return t >>>= 0, t === 0 ? 32 : 31 - (Ab(t) / Wp | 0) | 0;
    }
    function li(t) {
      var e = t & 42;
      if (e !== 0) return e;
      switch (t & -t) {
        case 1:
          return 1;
        case 2:
          return 2;
        case 4:
          return 4;
        case 8:
          return 8;
        case 16:
          return 16;
        case 32:
          return 32;
        case 64:
          return 64;
        case 128:
          return 128;
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
          return t & -t;
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
          return t & 3932160;
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
          return t & 62914560;
        case 67108864:
          return 67108864;
        case 134217728:
          return 134217728;
        case 268435456:
          return 268435456;
        case 536870912:
          return 536870912;
        case 1073741824:
          return 0;
        default:
          return console.error(
            "Should have found matching lanes. This is a bug in React."
          ), t;
      }
    }
    function Sf(t, e, a) {
      var c = t.pendingLanes;
      if (c === 0) return 0;
      var o = 0, f = t.suspendedLanes, d = t.pingedLanes;
      t = t.warmLanes;
      var h = c & 134217727;
      return h !== 0 ? (c = h & ~f, c !== 0 ? o = li(c) : (d &= h, d !== 0 ? o = li(d) : a || (a = h & ~t, a !== 0 && (o = li(a))))) : (h = c & ~f, h !== 0 ? o = li(h) : d !== 0 ? o = li(d) : a || (a = c & ~t, a !== 0 && (o = li(a)))), o === 0 ? 0 : e !== 0 && e !== o && (e & f) === 0 && (f = o & -o, a = e & -e, f >= a || f === 32 && (a & 4194048) !== 0) ? e : o;
    }
    function to(t, e) {
      return (t.pendingLanes & ~(t.suspendedLanes & ~t.pingedLanes) & e) === 0;
    }
    function oh(t, e) {
      (e & 8) !== 0 && (e |= e & 32);
      var a = t.entangledLanes;
      if (a !== 0)
        for (t = t.entanglements, a &= e; 0 < a; ) {
          var c = 31 - $e(a), o = 1 << c;
          e |= t[c], a &= ~o;
        }
      return e;
    }
    function nb(t, e) {
      switch (t) {
        case 1:
        case 2:
        case 4:
        case 8:
        case 64:
          return e + 250;
        case 16:
        case 32:
        case 128:
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
          return e + 5e3;
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
          return -1;
        case 67108864:
        case 134217728:
        case 268435456:
        case 536870912:
        case 1073741824:
          return -1;
        default:
          return console.error(
            "Should have found matching lanes. This is a bug in React."
          ), -1;
      }
    }
    function Pm() {
      var t = Nd;
      return Nd <<= 1, (Nd & 62914560) === 0 && (Nd = 4194304), t;
    }
    function $l(t) {
      for (var e = [], a = 0; 31 > a; a++) e.push(t);
      return e;
    }
    function tr(t, e) {
      t.pendingLanes |= e, e !== 268435456 && (t.suspendedLanes = 0, t.pingedLanes = 0, t.warmLanes = 0);
    }
    function d1(t, e, a, c, o, f) {
      var d = t.pendingLanes;
      t.pendingLanes = a, t.suspendedLanes = 0, t.pingedLanes = 0, t.warmLanes = 0, t.expiredLanes &= a, t.entangledLanes &= a, t.errorRecoveryDisabledLanes &= a, t.shellSuspendCounter = 0;
      var h = t.entanglements, y = t.expirationTimes, v = t.hiddenUpdates;
      for (a = d & ~a; 0 < a; ) {
        var p = 31 - $e(a), z = 1 << p;
        h[p] = 0, y[p] = -1;
        var E = v[p];
        if (E !== null)
          for (v[p] = null, p = 0; p < E.length; p++) {
            var M = E[p];
            M !== null && (M.lane &= -536870913);
          }
        a &= ~z;
      }
      c !== 0 && ty(t, c, 0), f !== 0 && o === 0 && t.tag !== 0 && (t.suspendedLanes |= f & ~(d & ~e));
    }
    function ty(t, e, a) {
      t.pendingLanes |= e, t.suspendedLanes &= ~e;
      var c = 31 - $e(e);
      t.entangledLanes |= e, t.entanglements[c] = t.entanglements[c] | 1073741824 | a & 261930;
    }
    function er(t, e) {
      var a = t.entangledLanes |= e;
      for (t = t.entanglements; a; ) {
        var c = 31 - $e(a), o = 1 << c;
        o & e | t[c] & e && (t[c] |= e), a &= ~o;
      }
    }
    function h1(t, e) {
      var a = e & -e;
      return a = (a & 42) !== 0 ? 1 : fh(a), (a & (t.suspendedLanes | e)) !== 0 ? 0 : a;
    }
    function fh(t) {
      switch (t) {
        case 2:
          t = 1;
          break;
        case 8:
          t = 4;
          break;
        case 32:
          t = 16;
          break;
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
          t = 128;
          break;
        case 268435456:
          t = 134217728;
          break;
        default:
          t = 0;
      }
      return t;
    }
    function m1(t, e, a) {
      if (Ju)
        for (t = t.pendingUpdatersLaneMap; 0 < a; ) {
          var c = 31 - $e(a), o = 1 << c;
          t[c].add(e), a &= ~o;
        }
    }
    function y1(t, e) {
      if (Ju)
        for (var a = t.pendingUpdatersLaneMap, c = t.memoizedUpdaters; 0 < e; ) {
          var o = 31 - $e(e);
          t = 1 << o, o = a[o], 0 < o.size && (o.forEach(function(f) {
            var d = f.alternate;
            d !== null && c.has(d) || c.add(f);
          }), o.clear()), e &= ~t;
        }
    }
    function eo(t) {
      return t &= -t, wl < t ? iu < t ? (t & 134217727) !== 0 ? Ku : wc : iu : wl;
    }
    function Fl() {
      var t = Gt.p;
      return t !== 0 ? t : (t = window.event, t === void 0 ? Ku : qp(t.type));
    }
    function cc(t, e) {
      var a = Gt.p;
      try {
        return Gt.p = t, e();
      } finally {
        Gt.p = a;
      }
    }
    function Ml(t) {
      delete t[zl], delete t[Al], delete t[sg], delete t[Ip];
    }
    function lo(t) {
      var e;
      if (e = t[zl]) return e;
      for (var a = t.parentNode; a; ) {
        if (e = a[$u] || a[zl]) {
          if (a = e.alternate, e.child !== null || a !== null && a.child !== null)
            for (t = Op(t); t !== null; ) {
              if (a = t[zl])
                return a;
              t = Op(t);
            }
          return e;
        }
        t = a, a = t.parentNode;
      }
      return null;
    }
    function bu(t) {
      if (t = t[zl] || t[$u]) {
        var e = t.tag;
        if (e === 5 || e === 6 || e === 13 || e === 31 || e === 26 || e === 27 || e === 3)
          return t;
      }
      return null;
    }
    function lr(t) {
      var e = t.tag;
      if (e === 5 || e === 26 || e === 27 || e === 6)
        return t.stateNode;
      throw Error("getNodeFromInstance: Invalid argument.");
    }
    function ic(t) {
      var e = t[mm];
      return e || (e = t[mm] = { hoistableStyles: /* @__PURE__ */ new Map(), hoistableScripts: /* @__PURE__ */ new Map() }), e;
    }
    function qe(t) {
      t[Tn] = !0;
    }
    function ar(t) {
      t[ou] = void 0;
    }
    function ja(t, e) {
      oc(t, e), oc(t + "Capture", e);
    }
    function oc(t, e) {
      fu[t] && console.error(
        "EventRegistry: More than one plugin attempted to publish the same registration name, `%s`.",
        t
      ), fu[t] = e;
      var a = t.toLowerCase();
      for (Po[a] = t, t === "onDoubleClick" && (Po.ondblclick = t), t = 0; t < e.length; t++)
        Qc.add(e[t]);
    }
    function Tu(t, e) {
      Gi[e.type] || e.onChange || e.onInput || e.readOnly || e.disabled || e.value == null || console.error(
        t === "select" ? "You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set `onChange`." : "You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`."
      ), e.onChange || e.readOnly || e.disabled || e.checked == null || console.error(
        "You provided a `checked` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultChecked`. Otherwise, set either `onChange` or `readOnly`."
      );
    }
    function sh(t) {
      return Ha.call(Cs, t) ? !0 : Ha.call(rg, t) ? !1 : Ob.test(t) ? Cs[t] = !0 : (rg[t] = !0, console.error("Invalid attribute name: `%s`", t), !1);
    }
    function v1() {
      var t = Lt;
      return Lt = !1, t;
    }
    function ey(t, e, a) {
      if (sh(e)) {
        if (!t.hasAttribute(e)) {
          switch (typeof a) {
            case "symbol":
            case "object":
              return a;
            case "function":
              return a;
            case "boolean":
              if (a === !1) return a;
          }
          return a === void 0 ? void 0 : null;
        }
        return t = e.toLowerCase() === "nonce" ? t.nonce : t.getAttribute(e), t === "" && a === !0 ? !0 : (ne(a, e), t === "" + a ? a : t);
      }
    }
    function bf(t, e, a) {
      if (sh(e))
        if (a === null) t.removeAttribute(e);
        else {
          switch (typeof a) {
            case "undefined":
            case "function":
            case "symbol":
              t.removeAttribute(e);
              return;
            case "boolean":
              var c = e.toLowerCase().slice(0, 5);
              if (c !== "data-" && c !== "aria-") {
                t.removeAttribute(e);
                return;
              }
          }
          ne(a, e), t.setAttribute(e, a);
        }
    }
    function ai(t, e, a) {
      if (a === null) t.removeAttribute(e);
      else {
        switch (typeof a) {
          case "undefined":
          case "function":
          case "symbol":
          case "boolean":
            t.removeAttribute(e);
            return;
        }
        ne(a, e), t.setAttribute(e, a);
      }
    }
    function fc(t, e, a, c) {
      if (c === null) t.removeAttribute(a);
      else {
        switch (typeof c) {
          case "undefined":
          case "function":
          case "symbol":
          case "boolean":
            t.removeAttribute(a);
            return;
        }
        ne(c, a), t.setAttributeNS(e, a, c);
      }
    }
    function Sa(t) {
      switch (typeof t) {
        case "bigint":
        case "boolean":
        case "number":
        case "string":
        case "undefined":
          return t;
        case "object":
          return Su(t), t;
        default:
          return "";
      }
    }
    function ly(t) {
      var e = t.type;
      return (t = t.nodeName) && t.toLowerCase() === "input" && (e === "checkbox" || e === "radio");
    }
    function g1(t, e, a) {
      var c = Object.getOwnPropertyDescriptor(
        t.constructor.prototype,
        e
      );
      if (!t.hasOwnProperty(e) && typeof c < "u" && typeof c.get == "function" && typeof c.set == "function") {
        var o = c.get, f = c.set;
        return Object.defineProperty(t, e, {
          configurable: !0,
          get: function() {
            return o.call(this);
          },
          set: function(d) {
            Su(d), a = "" + d, f.call(this, d);
          }
        }), Object.defineProperty(t, e, {
          enumerable: c.enumerable
        }), {
          getValue: function() {
            return a;
          },
          setValue: function(d) {
            Su(d), a = "" + d;
          },
          stopTracking: function() {
            t._valueTracker = null, delete t[e];
          }
        };
      }
    }
    function nr(t) {
      if (!t._valueTracker) {
        var e = ly(t) ? "checked" : "value";
        t._valueTracker = g1(
          t,
          e,
          "" + t[e]
        );
      }
    }
    function rh(t) {
      if (!t) return !1;
      var e = t._valueTracker;
      if (!e) return !0;
      var a = e.getValue(), c = "";
      return t && (c = ly(t) ? t.checked ? "true" : "false" : t.value), t = c, t !== a ? (e.setValue(t), !0) : !1;
    }
    function wa(t) {
      return t.replace(
        kp,
        function(e) {
          return "\\" + e.charCodeAt(0).toString(16) + " ";
        }
      );
    }
    function ay(t, e) {
      e.checked === void 0 || e.defaultChecked === void 0 || dg || (console.error(
        "%s contains an input of type %s with both checked and defaultChecked props. Input elements must be either controlled or uncontrolled (specify either the checked prop, or the defaultChecked prop, but not both). Decide between using a controlled or uncontrolled input element and remove one of these props. More info: https://react.dev/link/controlled-components",
        Pc() || "A component",
        e.type
      ), dg = !0), e.value === void 0 || e.defaultValue === void 0 || Bd || (console.error(
        "%s contains an input of type %s with both value and defaultValue props. Input elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled input element and remove one of these props. More info: https://react.dev/link/controlled-components",
        Pc() || "A component",
        e.type
      ), Bd = !0);
    }
    function Hn(t, e, a, c, o, f, d, h) {
      t.name = "", d != null && typeof d != "function" && typeof d != "symbol" && typeof d != "boolean" ? (ne(d, "type"), t.type = d) : t.removeAttribute("type"), e != null ? d === "number" ? (e === 0 && t.value === "" || t.value != e) && (t.value = "" + Sa(e)) : t.value !== "" + Sa(e) && (t.value = "" + Sa(e)) : d !== "submit" && d !== "reset" || t.removeAttribute("value"), e != null ? d === "number" && t.value == e ? _l(t, Sa(t.value)) : _l(t, Sa(e)) : a != null ? _l(t, Sa(a)) : c != null && t.removeAttribute("value"), o == null && f != null && (t.defaultChecked = !!f), o != null && (t.checked = o && typeof o != "function" && typeof o != "symbol"), h != null && typeof h != "function" && typeof h != "symbol" && typeof h != "boolean" ? (ne(h, "name"), t.name = "" + Sa(h)) : t.removeAttribute("name");
    }
    function ul(t, e, a, c, o, f, d, h) {
      if (f != null && typeof f != "function" && typeof f != "symbol" && typeof f != "boolean" && (ne(f, "type"), t.type = f), e != null || a != null) {
        if (!(f !== "submit" && f !== "reset" || e != null)) {
          nr(t);
          return;
        }
        a = a != null ? "" + Sa(a) : "", e = e != null ? "" + Sa(e) : a, h || e === t.value || (t.value = e), t.defaultValue = e;
      }
      c = c ?? o, c = typeof c != "function" && typeof c != "symbol" && !!c, t.checked = h ? t.checked : !!c, t.defaultChecked = !!c, d != null && typeof d != "function" && typeof d != "symbol" && typeof d != "boolean" && (ne(d, "name"), t.name = d), nr(t);
    }
    function _l(t, e) {
      t.defaultValue !== "" + e && (t.defaultValue = "" + e);
    }
    function ao(t, e) {
      e.value == null && (typeof e.children == "object" && e.children !== null ? Od.Children.forEach(e.children, function(a) {
        a == null || typeof a == "string" || typeof a == "number" || typeof a == "bigint" || xd || (xd = !0, console.error(
          "Cannot infer the option value of complex children. Pass a `value` prop or use a plain string as children to <option>."
        ));
      }) : e.dangerouslySetInnerHTML == null || Yd || (Yd = !0, console.error(
        "Pass a `value` prop if you set dangerouslyInnerHTML so React knows which value should be selected."
      ))), e.selected == null || Pp || (console.error(
        "Use the `defaultValue` or `value` props on <select> instead of setting `selected` on <option>."
      ), Pp = !0);
    }
    function ny() {
      var t = Pc();
      return t ? `

Check the render method of \`` + t + "`." : "";
    }
    function Tf(t, e, a, c) {
      if (t = t.options, e) {
        e = {};
        for (var o = 0; o < a.length; o++)
          e["$" + a[o]] = !0;
        for (a = 0; a < t.length; a++)
          o = e.hasOwnProperty("$" + t[a].value), t[a].selected !== o && (t[a].selected = o), o && c && (t[a].defaultSelected = !0);
      } else {
        for (a = "" + Sa(a), e = null, o = 0; o < t.length; o++) {
          if (t[o].value === a) {
            t[o].selected = !0, c && (t[o].defaultSelected = !0);
            return;
          }
          e !== null || t[o].disabled || (e = t[o]);
        }
        e !== null && (e.selected = !0);
      }
    }
    function p1(t, e) {
      for (t = 0; t < tf.length; t++) {
        var a = tf[t];
        if (e[a] != null) {
          var c = le(e[a]);
          e.multiple && !c ? console.error(
            "The `%s` prop supplied to <select> must be an array if `multiple` is true.%s",
            a,
            ny()
          ) : !e.multiple && c && console.error(
            "The `%s` prop supplied to <select> must be a scalar value if `multiple` is false.%s",
            a,
            ny()
          );
        }
      }
      e.value === void 0 || e.defaultValue === void 0 || hg || (console.error(
        "Select elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled select element and remove one of these props. More info: https://react.dev/link/controlled-components"
      ), hg = !0);
    }
    function uy(t, e) {
      e.value === void 0 || e.defaultValue === void 0 || mg || (console.error(
        "%s contains a textarea with both value and defaultValue props. Textarea elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled textarea and remove one of these props. More info: https://react.dev/link/controlled-components",
        Pc() || "A component"
      ), mg = !0), e.children != null && e.value == null && console.error(
        "Use the `defaultValue` or `value` props instead of setting children on <textarea>."
      );
    }
    function Ef(t, e, a) {
      if (e != null && (e = "" + Sa(e), e !== t.value && (t.value = e), a == null)) {
        t.defaultValue !== e && (t.defaultValue = e);
        return;
      }
      t.defaultValue = a != null ? "" + Sa(a) : "";
    }
    function ur(t, e, a, c) {
      if (e == null) {
        if (c != null) {
          if (a != null)
            throw Error(
              "If you supply `defaultValue` on a <textarea>, do not pass children."
            );
          if (le(c)) {
            if (1 < c.length)
              throw Error("<textarea> can only have at most one child.");
            c = c[0];
          }
          a = c;
        }
        a == null && (a = ""), e = a;
      }
      a = Sa(e), t.defaultValue = a, c = t.textContent, c === a && c !== "" && c !== null && (t.value = c), nr(t);
    }
    function cr(t, e) {
      return t.serverProps === void 0 && t.serverTail.length === 0 && t.children.length === 1 && 3 < t.distanceFromLeaf && t.distanceFromLeaf > 15 - e ? cr(t.children[0], e) : t;
    }
    function We(t) {
      return "  " + "  ".repeat(t);
    }
    function Bn(t) {
      return "+ " + "  ".repeat(t);
    }
    function xn(t) {
      return "- " + "  ".repeat(t);
    }
    function no(t) {
      switch (t.tag) {
        case 26:
        case 27:
        case 5:
          return t.type;
        case 16:
          return "Lazy";
        case 31:
          return "Activity";
        case 13:
          return "Suspense";
        case 19:
          return "SuspenseList";
        case 0:
        case 15:
          return t = t.type, t.displayName || t.name || null;
        case 11:
          return t = t.type.render, t.displayName || t.name || null;
        case 1:
          return t = t.type, t.displayName || t.name || null;
        default:
          return null;
      }
    }
    function De(t, e) {
      return ym.test(t) ? (t = JSON.stringify(t), t.length > e - 2 ? 8 > e ? '{"..."}' : "{" + t.slice(0, e - 7) + '..."}' : "{" + t + "}") : t.length > e ? 5 > e ? '{"..."}' : t.slice(0, e - 3) + "..." : t;
    }
    function ir(t, e, a) {
      var c = 120 - 2 * a;
      if (e === null)
        return Bn(a) + De(t, c) + `
`;
      if (typeof e == "string") {
        for (var o = 0; o < e.length && o < t.length && e.charCodeAt(o) === t.charCodeAt(o); o++) ;
        return o > c - 8 && 10 < o && (t = "..." + t.slice(o - 8), e = "..." + e.slice(o - 8)), Bn(a) + De(t, c) + `
` + xn(a) + De(e, c) + `
`;
      }
      return We(a) + De(t, c) + `
`;
    }
    function dh(t) {
      return Object.prototype.toString.call(t).replace(/^\[object (.*)\]$/, function(e, a) {
        return a;
      });
    }
    function zf(t, e) {
      switch (typeof t) {
        case "string":
          return t = JSON.stringify(t), t.length > e ? 5 > e ? '"..."' : t.slice(0, e - 4) + '..."' : t;
        case "object":
          if (t === null) return "null";
          if (le(t)) return "[...]";
          if (t.$$typeof === cu)
            return (e = P(t.type)) ? "<" + e + ">" : "<...>";
          var a = dh(t);
          if (a === "Object") {
            a = "", e -= 2;
            for (var c in t)
              if (t.hasOwnProperty(c)) {
                var o = JSON.stringify(c);
                if (o !== '"' + c + '"' && (c = o), e -= c.length - 2, o = zf(
                  t[c],
                  15 > e ? e : 15
                ), e -= o.length, 0 > e) {
                  a += a === "" ? "..." : ", ...";
                  break;
                }
                a += (a === "" ? "" : ",") + c + ":" + o;
              }
            return "{" + a + "}";
          }
          return a;
        case "function":
          return (e = t.displayName || t.name) ? "function " + e : "function";
        default:
          return String(t);
      }
    }
    function cn(t, e) {
      return typeof t != "string" || ym.test(t) ? "{" + zf(t, e - 2) + "}" : t.length > e - 2 ? 5 > e ? '"..."' : '"' + t.slice(0, e - 5) + '..."' : '"' + t + '"';
    }
    function ni(t, e, a) {
      var c = 120 - a.length - t.length, o = [], f;
      for (f in e)
        if (e.hasOwnProperty(f) && f !== "children") {
          var d = cn(
            e[f],
            120 - a.length - f.length - 1
          );
          c -= f.length + d.length + 2, o.push(f + "=" + d);
        }
      return o.length === 0 ? a + "<" + t + `>
` : 0 < c ? a + "<" + t + " " + o.join(" ") + `>
` : a + "<" + t + `
` + a + "  " + o.join(`
` + a + "  ") + `
` + a + `>
`;
    }
    function ub(t, e, a) {
      var c = "", o = pt({}, e), f;
      for (f in t)
        if (t.hasOwnProperty(f)) {
          delete o[f];
          var d = 120 - 2 * a - f.length - 2, h = zf(t[f], d);
          e.hasOwnProperty(f) ? (d = zf(e[f], d), c += Bn(a) + f + ": " + h + `
`, c += xn(a) + f + ": " + d + `
`) : c += Bn(a) + f + ": " + h + `
`;
        }
      for (var y in o)
        o.hasOwnProperty(y) && (t = zf(
          o[y],
          120 - 2 * a - y.length - 2
        ), c += xn(a) + y + ": " + t + `
`);
      return c;
    }
    function S1(t, e, a, c) {
      var o = "", f = /* @__PURE__ */ new Map();
      for (v in a)
        a.hasOwnProperty(v) && f.set(
          v.toLowerCase(),
          v
        );
      if (f.size === 1 && f.has("children"))
        o += ni(
          t,
          e,
          We(c)
        );
      else {
        for (var d in e)
          if (e.hasOwnProperty(d) && d !== "children") {
            var h = 120 - 2 * (c + 1) - d.length - 1, y = f.get(d.toLowerCase());
            if (y !== void 0) {
              f.delete(d.toLowerCase());
              var v = e[d];
              y = a[y];
              var p = cn(
                v,
                h
              );
              h = cn(
                y,
                h
              ), typeof v == "object" && v !== null && typeof y == "object" && y !== null && dh(v) === "Object" && dh(y) === "Object" && (2 < Object.keys(v).length || 2 < Object.keys(y).length || -1 < p.indexOf("...") || -1 < h.indexOf("...")) ? o += We(c + 1) + d + `={{
` + ub(
                v,
                y,
                c + 2
              ) + We(c + 1) + `}}
` : (o += Bn(c + 1) + d + "=" + p + `
`, o += xn(c + 1) + d + "=" + h + `
`);
            } else
              o += We(c + 1) + d + "=" + cn(e[d], h) + `
`;
          }
        f.forEach(function(z) {
          if (z !== "children") {
            var E = 120 - 2 * (c + 1) - z.length - 1;
            o += xn(c + 1) + z + "=" + cn(a[z], E) + `
`;
          }
        }), o = o === "" ? We(c) + "<" + t + `>
` : We(c) + "<" + t + `
` + o + We(c) + `>
`;
      }
      return t = a.children, e = e.children, typeof t == "string" || typeof t == "number" || typeof t == "bigint" ? (f = "", (typeof e == "string" || typeof e == "number" || typeof e == "bigint") && (f = "" + e), o += ir(f, "" + t, c + 1)) : (typeof e == "string" || typeof e == "number" || typeof e == "bigint") && (o = t == null ? o + ir("" + e, null, c + 1) : o + ir("" + e, void 0, c + 1)), o;
    }
    function cy(t, e) {
      var a = no(t);
      if (a === null) {
        for (a = "", t = t.child; t; )
          a += cy(t, e), t = t.sibling;
        return a;
      }
      return We(e) + "<" + a + `>
`;
    }
    function iy(t, e) {
      var a = cr(t, e);
      if (a !== t && (t.children.length !== 1 || t.children[0] !== a))
        return We(e) + `...
` + iy(a, e + 1);
      a = "";
      var c = t.fiber._debugInfo;
      if (c)
        for (var o = 0; o < c.length; o++) {
          var f = c[o].name;
          typeof f == "string" && (a += We(e) + "<" + f + `>
`, e++);
        }
      if (c = "", o = t.fiber.pendingProps, t.fiber.tag === 6)
        c = ir(o, t.serverProps, e), e++;
      else if (f = no(t.fiber), f !== null)
        if (t.serverProps === void 0) {
          c = e;
          var d = 120 - 2 * c - f.length - 2, h = "";
          for (v in o)
            if (o.hasOwnProperty(v) && v !== "children") {
              var y = cn(o[v], 15);
              if (d -= v.length + y.length + 2, 0 > d) {
                h += " ...";
                break;
              }
              h += " " + v + "=" + y;
            }
          c = We(c) + "<" + f + h + `>
`, e++;
        } else
          t.serverProps === null ? (c = ni(
            f,
            o,
            Bn(e)
          ), e++) : typeof t.serverProps == "string" ? console.error(
            "Should not have matched a non HostText fiber to a Text node. This is a bug in React."
          ) : (c = S1(
            f,
            o,
            t.serverProps,
            e
          ), e++);
      var v = "";
      for (o = t.fiber.child, f = 0; o && f < t.children.length; )
        d = t.children[f], d.fiber === o ? (v += iy(d, e), f++) : v += cy(o, e), o = o.sibling;
      for (o && 0 < t.children.length && (v += We(e) + `...
`), o = t.serverTail, t.serverProps === null && e--, t = 0; t < o.length; t++)
        f = o[t], v = typeof f == "string" ? v + (xn(e) + De(f, 120 - 2 * e) + `
`) : v + ni(
          f.type,
          f.props,
          xn(e)
        );
      return a + c + v;
    }
    function Vt(t) {
      try {
        return `

` + iy(t, 0);
      } catch {
        return "";
      }
    }
    function oy(t, e, a) {
      for (var c = e, o = null, f = 0; c; )
        c === t && (f = 0), o = {
          fiber: c,
          children: o !== null ? [o] : [],
          serverProps: c === e ? a : c === t ? null : void 0,
          serverTail: [],
          distanceFromLeaf: f
        }, f++, c = c.return;
      return o !== null ? Vt(o).replaceAll(/^[+-]/gm, ">") : "";
    }
    function or(t, e) {
      var a = pt({}, t || l), c = { tag: e };
      return yg.indexOf(e) !== -1 && (a.aTagInScope = null, a.buttonTagInScope = null, a.nobrTagInScope = null), Db.indexOf(e) !== -1 && (a.pTagInButtonScope = null), vm.indexOf(e) !== -1 && e !== "address" && e !== "div" && e !== "p" && (a.listItemTagAutoclosing = null, a.dlItemTagAutoclosing = null), a.current = c, e === "form" && (a.formTag = c), e === "a" && (a.aTagInScope = c), e === "button" && (a.buttonTagInScope = c), e === "nobr" && (a.nobrTagInScope = c), e === "p" && (a.pTagInButtonScope = c), e === "li" && (a.listItemTagAutoclosing = c), (e === "dd" || e === "dt") && (a.dlItemTagAutoclosing = c), e === "#document" || e === "html" ? a.containerTagInScope = null : a.containerTagInScope || (a.containerTagInScope = c), t !== null || e !== "#document" && e !== "html" && e !== "body" ? a.implicitRootScope === !0 && (a.implicitRootScope = !1) : a.implicitRootScope = !0, a;
    }
    function fr(t, e, a) {
      switch (e) {
        case "tr":
          return t === "th" || t === "td" || t === "style" || t === "script" || t === "template";
        case "tbody":
        case "thead":
        case "tfoot":
          return t === "tr" || t === "style" || t === "script" || t === "template";
        case "colgroup":
          return t === "col" || t === "template";
        case "table":
          return t === "caption" || t === "colgroup" || t === "tbody" || t === "tfoot" || t === "thead" || t === "style" || t === "script" || t === "template";
        case "head":
          return t === "base" || t === "basefont" || t === "bgsound" || t === "link" || t === "meta" || t === "title" || t === "noscript" || t === "noframes" || t === "style" || t === "script" || t === "template";
        case "html":
          if (a) break;
          return t === "head" || t === "body" || t === "frameset";
        case "frameset":
          return t === "frame";
        case "#document":
          if (!a) return t === "html";
      }
      switch (t) {
        case "h1":
        case "h2":
        case "h3":
        case "h4":
        case "h5":
        case "h6":
          return e !== "h1" && e !== "h2" && e !== "h3" && e !== "h4" && e !== "h5" && e !== "h6";
        case "rp":
        case "rt":
          return gm.indexOf(e) === -1;
        case "caption":
        case "col":
        case "colgroup":
        case "input":
          return e !== "select";
        case "frameset":
        case "frame":
        case "tbody":
        case "td":
        case "tfoot":
        case "th":
        case "thead":
        case "tr":
          return e == null;
        case "head":
          return a || e === null;
        case "html":
          return a && e === "#document" || e === null;
        case "body":
          return a && (e === "#document" || e === "html") || e === null;
      }
      return !0;
    }
    function sc(t, e) {
      switch (t) {
        case "address":
        case "article":
        case "aside":
        case "blockquote":
        case "center":
        case "details":
        case "dialog":
        case "dir":
        case "div":
        case "dl":
        case "fieldset":
        case "figcaption":
        case "figure":
        case "footer":
        case "header":
        case "hgroup":
        case "main":
        case "menu":
        case "nav":
        case "ol":
        case "p":
        case "section":
        case "summary":
        case "ul":
        case "pre":
        case "listing":
        case "table":
        case "hr":
        case "xmp":
        case "h1":
        case "h2":
        case "h3":
        case "h4":
        case "h5":
        case "h6":
          return e.pTagInButtonScope;
        case "form":
          return e.formTag || e.pTagInButtonScope;
        case "li":
          return e.listItemTagAutoclosing;
        case "dd":
        case "dt":
          return e.dlItemTagAutoclosing;
        case "button":
          return e.buttonTagInScope;
        case "a":
          return e.aTagInScope;
        case "nobr":
          return e.nobrTagInScope;
      }
      return null;
    }
    function ba(t, e) {
      for (; t; ) {
        switch (t.tag) {
          case 5:
          case 26:
          case 27:
            if (t.type === e) return t;
        }
        t = t.return;
      }
      return null;
    }
    function hh(t, e) {
      e = e || l;
      var a = e.current;
      if (e = (a = fr(
        t,
        a && a.tag,
        e.implicitRootScope
      ) ? null : a) ? null : sc(t, e), e = a || e, !e) return !0;
      var c = e.tag;
      if (e = String(!!a) + "|" + t + "|" + c, n[e]) return !1;
      n[e] = !0;
      var o = (e = jl) ? ba(e.return, c) : null, f = e !== null && o !== null ? oy(o, e, null) : "", d = "<" + t + ">";
      return a ? (a = "", c === "table" && t === "tr" && (a += " Add a <tbody>, <thead> or <tfoot> to your code to match the DOM tree generated by the browser."), console.error(
        `In HTML, %s cannot be a child of <%s>.%s
This will cause a hydration error.%s`,
        d,
        c,
        a,
        f
      )) : console.error(
        `In HTML, %s cannot be a descendant of <%s>.
This will cause a hydration error.%s`,
        d,
        c,
        f
      ), e && (t = e.return, o === null || t === null || o === t && t._debugOwner === e._debugOwner || $(o, function() {
        console.error(
          `<%s> cannot contain a nested %s.
See this log for the ancestor stack trace.`,
          c,
          d
        );
      })), !1;
    }
    function mh(t, e, a) {
      if (a || fr("#text", e, !1))
        return !0;
      if (a = "#text|" + e, n[a]) return !1;
      n[a] = !0;
      var c = (a = jl) ? ba(a, e) : null;
      return a = a !== null && c !== null ? oy(
        c,
        a,
        a.tag !== 6 ? { children: null } : null
      ) : "", /\S/.test(t) ? console.error(
        `In HTML, text nodes cannot be a child of <%s>.
This will cause a hydration error.%s`,
        e,
        a
      ) : console.error(
        `In HTML, whitespace text nodes cannot be a child of <%s>. Make sure you don't have any extra whitespace between tags on each line of your source code.
This will cause a hydration error.%s`,
        e,
        a
      ), !1;
    }
    function uo(t, e) {
      if (e) {
        var a = t.firstChild;
        if (a && a === t.lastChild && a.nodeType === 3) {
          a.nodeValue = e;
          return;
        }
      }
      t.textContent = e;
    }
    function b1(t) {
      return t.replace(g, function(e, a) {
        return a.toUpperCase();
      });
    }
    function T1(t, e, a) {
      var c = e.indexOf("--") === 0;
      c || (-1 < e.indexOf("-") ? C.hasOwnProperty(e) && C[e] || (C[e] = !0, console.error(
        "Unsupported style property %s. Did you mean %s?",
        e,
        b1(e.replace(m, "ms-"))
      )) : r.test(e) ? C.hasOwnProperty(e) && C[e] || (C[e] = !0, console.error(
        "Unsupported vendor-prefixed style property %s. Did you mean %s?",
        e,
        e.charAt(0).toUpperCase() + e.slice(1)
      )) : !S.test(a) || N.hasOwnProperty(a) && N[a] || (N[a] = !0, console.error(
        `Style property values shouldn't contain a semicolon. Try "%s: %s" instead.`,
        e,
        a.replace(S, "")
      )), typeof a == "number" && (isNaN(a) ? G || (G = !0, console.error(
        "`NaN` is an invalid value for the `%s` css style property.",
        e
      )) : isFinite(a) || D || (D = !0, console.error(
        "`Infinity` is an invalid value for the `%s` css style property.",
        e
      )))), a == null || typeof a == "boolean" || a === "" ? c ? t.setProperty(e, "") : e === "float" ? t.cssFloat = "" : t[e] = "" : c ? t.setProperty(e, a) : typeof a != "number" || a === 0 || U.has(e) ? e === "float" ? t.cssFloat = a : (ih(a, e), t[e] = ("" + a).trim()) : t[e] = a + "px";
    }
    function Xa(t, e, a) {
      if (e != null && typeof e != "object")
        throw Error(
          "The `style` prop expects a mapping from style properties to values, not a string. For example, style={{marginRight: spacing + 'em'}} when using JSX."
        );
      if (e && Object.freeze(e), t = t.style, a != null) {
        if (e) {
          var c = {};
          if (a) {
            for (var o in a)
              if (a.hasOwnProperty(o) && !e.hasOwnProperty(o))
                for (var f = u[o] || [o], d = 0; d < f.length; d++)
                  c[f[d]] = o;
          }
          for (var h in e)
            if (e.hasOwnProperty(h) && (!a || a[h] !== e[h]))
              for (o = u[h] || [h], f = 0; f < o.length; f++)
                c[o[f]] = h;
          h = {};
          for (var y in e)
            for (o = u[y] || [y], f = 0; f < o.length; f++)
              h[o[f]] = y;
          y = {};
          for (var v in c)
            if (o = c[v], (f = h[v]) && o !== f && (d = o + "," + f, !y[d])) {
              y[d] = !0, d = console;
              var p = e[o];
              d.error.call(
                d,
                "%s a style property during rerender (%s) when a conflicting property is set (%s) can lead to styling bugs. To avoid this, don't mix shorthand and non-shorthand properties for the same value; instead, replace the shorthand with separate values.",
                p == null || typeof p == "boolean" || p === "" ? "Removing" : "Updating",
                o,
                f
              );
            }
        }
        for (var z in a)
          !a.hasOwnProperty(z) || e != null && e.hasOwnProperty(z) || (z.indexOf("--") === 0 ? t.setProperty(z, "") : z === "float" ? t.cssFloat = "" : t[z] = "", Lt = !0);
        for (var E in e)
          v = e[E], e.hasOwnProperty(E) && a[E] !== v && (T1(t, E, v), Lt = !0);
      } else
        for (c in e)
          e.hasOwnProperty(c) && T1(t, c, e[c]);
    }
    function co(t) {
      if (t.indexOf("-") === -1) return !1;
      switch (t) {
        case "annotation-xml":
        case "color-profile":
        case "font-face":
        case "font-face-src":
        case "font-face-uri":
        case "font-face-format":
        case "font-face-name":
        case "missing-glyph":
          return !1;
        default:
          return !0;
      }
    }
    function fy(t) {
      return bt.get(t) || t;
    }
    function sy(t, e) {
      if (Ha.call(_, e) && _[e])
        return !0;
      if (k.test(e)) {
        if (t = "aria-" + e.slice(4).toLowerCase(), t = O.hasOwnProperty(t) ? t : null, t == null)
          return console.error(
            "Invalid ARIA attribute `%s`. ARIA attributes follow the pattern aria-* and must be lowercase.",
            e
          ), _[e] = !0;
        if (e !== t)
          return console.error(
            "Invalid ARIA attribute `%s`. Did you mean `%s`?",
            e,
            t
          ), _[e] = !0;
      }
      if (V.test(e)) {
        if (t = e.toLowerCase(), t = O.hasOwnProperty(t) ? t : null, t == null) return _[e] = !0, !1;
        e !== t && (console.error(
          "Unknown ARIA attribute `%s`. Did you mean `%s`?",
          e,
          t
        ), _[e] = !0);
      }
      return !0;
    }
    function Af(t, e) {
      var a = [], c;
      for (c in e)
        sy(t, c) || a.push(c);
      e = a.map(function(o) {
        return "`" + o + "`";
      }).join(", "), a.length === 1 ? console.error(
        "Invalid aria prop %s on <%s> tag. For details, see https://react.dev/link/invalid-aria-props",
        e,
        t
      ) : 1 < a.length && console.error(
        "Invalid aria props %s on <%s> tag. For details, see https://react.dev/link/invalid-aria-props",
        e,
        t
      );
    }
    function E1(t, e, a, c) {
      if (Ha.call(F, e) && F[e])
        return !0;
      var o = e.toLowerCase();
      if (o === "onfocusin" || o === "onfocusout")
        return console.error(
          "React uses onFocus and onBlur instead of onFocusIn and onFocusOut. All React events are normalized to bubble, so onFocusIn and onFocusOut are not needed/supported by React."
        ), F[e] = !0;
      if (typeof a == "function" && (t === "form" && e === "action" || t === "input" && e === "formAction" || t === "button" && e === "formAction"))
        return !0;
      if (c != null) {
        if (t = c.possibleRegistrationNames, c.registrationNameDependencies.hasOwnProperty(e))
          return !0;
        if (c = t.hasOwnProperty(o) ? t[o] : null, c != null)
          return console.error(
            "Invalid event handler property `%s`. Did you mean `%s`?",
            e,
            c
          ), F[e] = !0;
        if (ct.test(e))
          return console.error(
            "Unknown event handler property `%s`. It will be ignored.",
            e
          ), F[e] = !0;
      } else if (ct.test(e))
        return Fe.test(e) && console.error(
          "Invalid event handler property `%s`. React events use the camelCase naming convention, for example `onClick`.",
          e
        ), F[e] = !0;
      if (Xt.test(e) || Vi.test(e)) return !0;
      if (o === "innerhtml")
        return console.error(
          "Directly setting property `innerHTML` is not permitted. For more information, lookup documentation on `dangerouslySetInnerHTML`."
        ), F[e] = !0;
      if (o === "aria")
        return console.error(
          "The `aria` attribute is reserved for future use in React. Pass individual `aria-` attributes instead."
        ), F[e] = !0;
      if (o === "is" && a !== null && a !== void 0 && typeof a != "string")
        return console.error(
          "Received a `%s` for a string attribute `is`. If this is expected, cast the value to a string.",
          typeof a
        ), F[e] = !0;
      if (typeof a == "number" && isNaN(a))
        return console.error(
          "Received NaN for the `%s` attribute. If this is expected, cast the value to a string.",
          e
        ), F[e] = !0;
      if (R.hasOwnProperty(o)) {
        if (o = R[o], o !== e)
          return console.error(
            "Invalid DOM property `%s`. Did you mean `%s`?",
            e,
            o
          ), F[e] = !0;
      } else if (e !== o)
        return console.error(
          "React does not recognize the `%s` prop on a DOM element. If you intentionally want it to appear in the DOM as a custom attribute, spell it as lowercase `%s` instead. If you accidentally passed it from a parent component, remove it from the DOM element.",
          e,
          o
        ), F[e] = !0;
      switch (e) {
        case "dangerouslySetInnerHTML":
        case "children":
        case "style":
        case "suppressContentEditableWarning":
        case "suppressHydrationWarning":
        case "defaultValue":
        case "defaultChecked":
        case "innerHTML":
        case "ref":
          return !0;
        case "innerText":
        case "textContent":
          return !0;
      }
      switch (typeof a) {
        case "boolean":
          switch (e) {
            case "autoFocus":
            case "checked":
            case "multiple":
            case "muted":
            case "selected":
            case "contentEditable":
            case "spellCheck":
            case "draggable":
            case "value":
            case "autoReverse":
            case "externalResourcesRequired":
            case "focusable":
            case "preserveAlpha":
            case "allowFullScreen":
            case "async":
            case "autoPlay":
            case "controls":
            case "credentialless":
            case "default":
            case "defer":
            case "disabled":
            case "disablePictureInPicture":
            case "disableRemotePlayback":
            case "formNoValidate":
            case "hidden":
            case "loop":
            case "noModule":
            case "noValidate":
            case "open":
            case "playsInline":
            case "readOnly":
            case "required":
            case "reversed":
            case "scoped":
            case "seamless":
            case "itemScope":
            case "capture":
            case "download":
            case "inert":
              return !0;
            default:
              return o = e.toLowerCase().slice(0, 5), o === "data-" || o === "aria-" ? !0 : (a ? console.error(
                'Received `%s` for a non-boolean attribute `%s`.\n\nIf you want to write it to the DOM, pass a string instead: %s="%s" or %s={value.toString()}.',
                a,
                e,
                e,
                a,
                e
              ) : console.error(
                'Received `%s` for a non-boolean attribute `%s`.\n\nIf you want to write it to the DOM, pass a string instead: %s="%s" or %s={value.toString()}.\n\nIf you used to conditionally omit it with %s={condition && value}, pass %s={condition ? value : undefined} instead.',
                a,
                e,
                e,
                a,
                e,
                e,
                e
              ), F[e] = !0);
          }
        case "function":
        case "symbol":
          return F[e] = !0, !1;
        case "string":
          if (a === "false" || a === "true") {
            switch (e) {
              case "checked":
              case "selected":
              case "multiple":
              case "muted":
              case "allowFullScreen":
              case "async":
              case "autoPlay":
              case "controls":
              case "credentialless":
              case "default":
              case "defer":
              case "disabled":
              case "disablePictureInPicture":
              case "disableRemotePlayback":
              case "formNoValidate":
              case "hidden":
              case "loop":
              case "noModule":
              case "noValidate":
              case "open":
              case "playsInline":
              case "readOnly":
              case "required":
              case "reversed":
              case "scoped":
              case "seamless":
              case "itemScope":
              case "inert":
                break;
              default:
                return !0;
            }
            console.error(
              "Received the string `%s` for the boolean attribute `%s`. %s Did you mean %s={%s}?",
              a,
              e,
              a === "false" ? "The browser will interpret it as a truthy value." : 'Although this works, it will not work as expected if you pass the string "false".',
              e,
              a
            ), F[e] = !0;
          }
      }
      return !0;
    }
    function z1(t, e, a) {
      var c = [], o;
      for (o in e)
        E1(t, o, e[o], a) || c.push(o);
      e = c.map(function(f) {
        return "`" + f + "`";
      }).join(", "), c.length === 1 ? console.error(
        "Invalid value for prop %s on <%s> tag. Either remove it from the element, or pass a string or number value to keep it in the DOM. For details, see https://react.dev/link/attribute-behavior ",
        e,
        t
      ) : 1 < c.length && console.error(
        "Invalid values for props %s on <%s> tag. Either remove them from the element, or pass a string or number value to keep them in the DOM. For details, see https://react.dev/link/attribute-behavior ",
        e,
        t
      );
    }
    function Eu(t) {
      return Cb.test("" + t) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : t;
    }
    function zu() {
    }
    function yh(t) {
      return t = t.target || t.srcElement || window, t.correspondingUseElement && (t = t.correspondingUseElement), t.nodeType === 3 ? t.parentNode : t;
    }
    function ry(t) {
      var e = bu(t);
      if (e && (t = e.stateNode)) {
        var a = t[Al] || null;
        t: switch (t = e.stateNode, e.type) {
          case "input":
            if (Hn(
              t,
              a.value,
              a.defaultValue,
              a.defaultValue,
              a.checked,
              a.defaultChecked,
              a.type,
              a.name
            ), e = a.name, a.type === "radio" && e != null) {
              for (a = t; a.parentNode; ) a = a.parentNode;
              for (ne(e, "name"), a = a.querySelectorAll(
                'input[name="' + wa(
                  "" + e
                ) + '"][type="radio"]'
              ), e = 0; e < a.length; e++) {
                var c = a[e];
                if (c !== t && c.form === t.form) {
                  var o = c[Al] || null;
                  if (!o)
                    throw Error(
                      "ReactDOMInput: Mixing React and non-React radio inputs with the same `name` is not supported."
                    );
                  Hn(
                    c,
                    o.value,
                    o.defaultValue,
                    o.defaultValue,
                    o.checked,
                    o.defaultChecked,
                    o.type,
                    o.name
                  );
                }
              }
              for (e = 0; e < a.length; e++)
                c = a[e], c.form === t.form && rh(c);
            }
            break t;
          case "textarea":
            Ef(t, a.value, a.defaultValue);
            break t;
          case "select":
            e = a.value, e != null && Tf(t, !!a.multiple, e, !1);
        }
      }
    }
    function vh(t, e, a) {
      if (Rb) return t(e, a);
      Rb = !0;
      try {
        var c = t(e);
        return c;
      } finally {
        if (Rb = !1, (pm !== null || Sm !== null) && (qo(), pm && (e = pm, t = Sm, Sm = pm = null, ry(e), t)))
          for (e = 0; e < t.length; e++) ry(t[e]);
      }
    }
    function sr(t, e) {
      var a = t.stateNode;
      if (a === null) return null;
      var c = a[Al] || null;
      if (c === null) return null;
      a = c[e];
      t: switch (e) {
        case "onClick":
        case "onClickCapture":
        case "onDoubleClick":
        case "onDoubleClickCapture":
        case "onMouseDown":
        case "onMouseDownCapture":
        case "onMouseMove":
        case "onMouseMoveCapture":
        case "onMouseUp":
        case "onMouseUpCapture":
        case "onMouseEnter":
          (c = !c.disabled) || (t = t.type, c = !(t === "button" || t === "input" || t === "select" || t === "textarea")), t = !c;
          break t;
        default:
          t = !1;
      }
      if (t) return null;
      if (a && typeof a != "function")
        throw Error(
          "Expected `" + e + "` listener to be a function, instead got a value of `" + typeof a + "` type."
        );
      return a;
    }
    function A1() {
      if (tS) return tS;
      var t, e = _b, a = e.length, c, o = "value" in Rs ? Rs.value : Rs.textContent, f = o.length;
      for (t = 0; t < a && e[t] === o[t]; t++) ;
      var d = a - t;
      for (c = 1; c <= d && e[a - c] === o[f - c]; c++) ;
      return tS = o.slice(t, 1 < c ? 1 - c : void 0);
    }
    function io(t) {
      var e = t.keyCode;
      return "charCode" in t ? (t = t.charCode, t === 0 && e === 13 && (t = 13)) : t = e, t === 10 && (t = 13), 32 <= t || t === 13 ? t : 0;
    }
    function Qa() {
      return !0;
    }
    function gh() {
      return !1;
    }
    function pl(t) {
      function e(a, c, o, f, d) {
        this._reactName = a, this._targetInst = o, this.type = c, this.nativeEvent = f, this.target = d, this.currentTarget = null;
        for (var h in t)
          t.hasOwnProperty(h) && (a = t[h], this[h] = a ? a(f) : f[h]);
        return this.isDefaultPrevented = (f.defaultPrevented != null ? f.defaultPrevented : f.returnValue === !1) ? Qa : gh, this.isPropagationStopped = gh, this;
      }
      return pt(e.prototype, {
        preventDefault: function() {
          this.defaultPrevented = !0;
          var a = this.nativeEvent;
          a && (a.preventDefault ? a.preventDefault() : typeof a.returnValue != "unknown" && (a.returnValue = !1), this.isDefaultPrevented = Qa);
        },
        stopPropagation: function() {
          var a = this.nativeEvent;
          a && (a.stopPropagation ? a.stopPropagation() : typeof a.cancelBubble != "unknown" && (a.cancelBubble = !0), this.isPropagationStopped = Qa);
        },
        persist: function() {
        },
        isPersistent: Qa
      }), e;
    }
    function Of(t) {
      var e = this.nativeEvent;
      return e.getModifierState ? e.getModifierState(t) : (t = TE[t]) ? !!e[t] : !1;
    }
    function ui() {
      return Of;
    }
    function dy(t, e) {
      switch (t) {
        case "keyup":
          return xE.indexOf(e.keyCode) !== -1;
        case "keydown":
          return e.keyCode !== F2;
        case "keypress":
        case "mousedown":
        case "focusout":
          return !0;
        default:
          return !1;
      }
    }
    function ph(t) {
      return t = t.detail, typeof t == "object" && "data" in t ? t.data : null;
    }
    function O1(t, e) {
      switch (t) {
        case "compositionend":
          return ph(e);
        case "keypress":
          return e.which !== I2 ? null : (P2 = !0, k2);
        case "textInput":
          return t = e.data, t === k2 && P2 ? null : t;
        default:
          return null;
      }
    }
    function rr(t, e) {
      if (bm)
        return t === "compositionend" || !Bb && dy(t, e) ? (t = A1(), tS = _b = Rs = null, bm = !1, t) : null;
      switch (t) {
        case "paste":
          return null;
        case "keypress":
          if (!(e.ctrlKey || e.altKey || e.metaKey) || e.ctrlKey && e.altKey) {
            if (e.char && 1 < e.char.length)
              return e.char;
            if (e.which)
              return String.fromCharCode(e.which);
          }
          return null;
        case "compositionend":
          return W2 && e.locale !== "ko" ? null : e.data;
        default:
          return null;
      }
    }
    function Au(t) {
      var e = t && t.nodeName && t.nodeName.toLowerCase();
      return e === "input" ? !!qE[t.type] : e === "textarea";
    }
    function hy(t) {
      if (!ji) return !1;
      t = "on" + t;
      var e = t in document;
      return e || (e = document.createElement("div"), e.setAttribute(t, "return;"), e = typeof e[t] == "function"), e;
    }
    function Df(t, e, a, c) {
      pm ? Sm ? Sm.push(c) : Sm = [c] : pm = c, e = w0(e, "onChange"), 0 < e.length && (a = new eS(
        "onChange",
        "change",
        null,
        a,
        c
      ), t.push({ event: a, listeners: e }));
    }
    function ci(t) {
      Ev(t, 0);
    }
    function Cf(t) {
      var e = lr(t);
      if (rh(e)) return t;
    }
    function dr(t, e) {
      if (t === "change") return e;
    }
    function my() {
      Tg && (Tg.detachEvent("onpropertychange", hr), Eg = Tg = null);
    }
    function hr(t) {
      if (t.propertyName === "value" && Cf(Eg)) {
        var e = [];
        Df(
          e,
          Eg,
          t,
          yh(t)
        ), vh(ci, e);
      }
    }
    function Sh(t, e, a) {
      t === "focusin" ? (my(), Tg = e, Eg = a, Tg.attachEvent("onpropertychange", hr)) : t === "focusout" && my();
    }
    function D1(t) {
      if (t === "selectionchange" || t === "keyup" || t === "keydown")
        return Cf(Eg);
    }
    function Wl(t, e) {
      if (t === "click") return Cf(e);
    }
    function ii(t, e) {
      if (t === "input" || t === "change")
        return Cf(e);
    }
    function bh(t, e) {
      return t === e && (t !== 0 || 1 / t === 1 / e) || t !== t && e !== e;
    }
    function rc(t, e) {
      if (tn(t, e)) return !0;
      if (typeof t != "object" || t === null || typeof e != "object" || e === null)
        return !1;
      var a = Object.keys(t), c = Object.keys(e);
      if (a.length !== c.length) return !1;
      for (c = 0; c < a.length; c++) {
        var o = a[c];
        if (!Ha.call(e, o) || !tn(t[o], e[o]))
          return !1;
      }
      return !0;
    }
    function yy(t) {
      if (t = t || (typeof document < "u" ? document : void 0), typeof t > "u") return null;
      try {
        return t.activeElement || t.body;
      } catch {
        return t.body;
      }
    }
    function Th(t) {
      for (; t && t.firstChild; ) t = t.firstChild;
      return t;
    }
    function Eh(t, e) {
      var a = Th(t);
      t = 0;
      for (var c; a; ) {
        if (a.nodeType === 3) {
          if (c = t + a.textContent.length, t <= e && c >= e)
            return { node: a, offset: e - t };
          t = c;
        }
        t: {
          for (; a; ) {
            if (a.nextSibling) {
              a = a.nextSibling;
              break t;
            }
            a = a.parentNode;
          }
          a = void 0;
        }
        a = Th(a);
      }
    }
    function Rf(t, e) {
      return t && e ? t === e ? !0 : t && t.nodeType === 3 ? !1 : e && e.nodeType === 3 ? Rf(t, e.parentNode) : "contains" in t ? t.contains(e) : t.compareDocumentPosition ? !!(t.compareDocumentPosition(e) & 16) : !1 : !1;
    }
    function mr(t) {
      t = t != null && t.ownerDocument != null && t.ownerDocument.defaultView != null ? t.ownerDocument.defaultView : window;
      for (var e = yy(t.document); e instanceof t.HTMLIFrameElement; ) {
        try {
          var a = typeof e.contentWindow.location.href == "string";
        } catch {
          a = !1;
        }
        if (a) t = e.contentWindow;
        else break;
        e = yy(t.document);
      }
      return e;
    }
    function zh(t) {
      var e = t && t.nodeName && t.nodeName.toLowerCase();
      return e && (e === "input" && (t.type === "text" || t.type === "search" || t.type === "tel" || t.type === "url" || t.type === "password") || e === "textarea" || t.contentEditable === "true");
    }
    function C1(t, e, a) {
      var c = a.window === a ? a.document : a.nodeType === 9 ? a : a.ownerDocument;
      Yb || Tm == null || Tm !== yy(c) || (c = Tm, "selectionStart" in c && zh(c) ? c = { start: c.selectionStart, end: c.selectionEnd } : (c = (c.ownerDocument && c.ownerDocument.defaultView || window).getSelection(), c = {
        anchorNode: c.anchorNode,
        anchorOffset: c.anchorOffset,
        focusNode: c.focusNode,
        focusOffset: c.focusOffset
      }), zg && rc(zg, c) || (zg = c, c = w0(xb, "onSelect"), 0 < c.length && (e = new eS(
        "onSelect",
        "select",
        null,
        e,
        a
      ), t.push({ event: e, listeners: c }), e.target = Tm)));
    }
    function oo(t, e) {
      var a = {};
      return a[t.toLowerCase()] = e.toLowerCase(), a["Webkit" + t] = "webkit" + e, a["Moz" + t] = "moz" + e, a;
    }
    function fo(t) {
      if (qb[t]) return qb[t];
      if (!Em[t]) return t;
      var e = Em[t], a;
      for (a in e)
        if (e.hasOwnProperty(a) && a in eT)
          return qb[t] = e[a];
      return t;
    }
    function Za(t, e) {
      cT.set(t, e), ja(e, [t]);
    }
    function dc(t, e) {
      if (t.name != null && t.name !== "auto") return t.name;
      if (e.autoName !== null) return e.autoName;
      t = Wc.identifierPrefix;
      var a = XE++;
      return t = "_" + t + "t_" + a.toString(32) + "_", e.autoName = t;
    }
    function R1(t) {
      if (t == null || typeof t == "string")
        return t;
      var e = null, a = Qm;
      if (a !== null)
        for (var c = 0; c < a.length; c++) {
          var o = t[a[c]];
          if (o != null) {
            if (o === "none") return "none";
            e = e == null ? o : e + (" " + o);
          }
        }
      return e ?? t.default;
    }
    function hc(t, e) {
      return t = R1(t), e = R1(e), e == null ? t === "auto" ? null : t : e === "auto" ? null : e;
    }
    function cb(t) {
      for (var e = aS, a = 0; a < t.length && a < Fu; a++) {
        var c = t[a];
        if (typeof c == "object" && c !== null)
          if (le(c) && c.length === 2 && typeof c[0] == "string") {
            if (e !== aS && e !== Xb)
              return jb;
            e = Xb;
          } else return jb;
        else {
          if (typeof c == "function" || typeof c == "string" && 50 < c.length || e !== aS && e !== wb || typeof c == "bigint")
            return jb;
          e = wb;
        }
      }
      return e;
    }
    function vy(t, e, a, c) {
      if (!ArrayBuffer.isView(t)) {
        var o = 0, f;
        for (f in t)
          if (Ha.call(t, f) && f[0] !== "_" && (o++, Yn(f, t[f], e, a, c), o >= Fu)) {
            e.push([
              c + "  ".repeat(a) + "Only " + Fu + " properties are shown. React will not log more properties of this object.",
              ""
            ]);
            break;
          }
      }
    }
    function yr(t) {
      return "$$typeof" in t && Ha.call(t, "$$typeof") ? t.$$typeof : void 0;
    }
    function Yn(t, e, a, c, o) {
      switch (typeof e) {
        case "object":
          if (e === null) {
            e = "null";
            break;
          } else {
            if (yr(e) === cu) {
              var f = P(e.type) || "…", d = e.key;
              e = e.props;
              var h = Object.keys(e), y = h.length;
              if (d == null && y === 0) {
                e = "<" + f + " />";
                break;
              }
              if (3 > c || y === 1 && h[0] === "children" && d == null) {
                e = "<" + f + " … />";
                break;
              }
              a.push([
                o + "  ".repeat(c) + t,
                "<" + f
              ]), d !== null && Yn(
                "key",
                d,
                a,
                c + 1,
                o
              ), t = !1, d = 0;
              for (var v in e)
                if (d++, v === "children" ? e.children != null && (!le(e.children) || 0 < e.children.length) && (t = !0) : Ha.call(e, v) && v[0] !== "_" && Yn(
                  v,
                  e[v],
                  a,
                  c + 1,
                  o
                ), d >= Fu)
                  break;
              a.push([
                "",
                t ? ">…</" + f + ">" : "/>"
              ]);
              return;
            }
            if (f = Object.prototype.toString.call(e), f = f.slice(8, f.length - 1), ArrayBuffer.isView(e)) {
              e = e.length, e = typeof e == "number" ? f + "(" + e + ")" : f;
              break;
            }
            if (f === "Array") {
              if (v = e.length > Fu, d = cb(e), d === wb || d === aS) {
                e = JSON.stringify(
                  v ? e.slice(0, Fu).concat("…") : e
                );
                break;
              } else if (d === Xb) {
                for (a.push([
                  o + "  ".repeat(c) + t,
                  ""
                ]), t = 0; t < e.length && t < Fu; t++)
                  f = e[t], Yn(
                    f[0],
                    f[1],
                    a,
                    c + 1,
                    o
                  );
                v && Yn(
                  Fu.toString(),
                  "…",
                  a,
                  c + 1,
                  o
                );
                return;
              }
            }
            if (f === "Promise") {
              if (e.status === "fulfilled") {
                if (f = a.length, Yn(
                  t,
                  e.value,
                  a,
                  c,
                  o
                ), a.length > f) {
                  a = a[f], a[1] = "Promise<" + (a[1] || "Object") + ">";
                  return;
                }
              } else if (e.status === "rejected" && (f = a.length, Yn(
                t,
                e.reason,
                a,
                c,
                o
              ), a.length > f)) {
                a = a[f], a[1] = "Rejected Promise<" + a[1] + ">";
                return;
              }
              a.push([
                "  ".repeat(c) + t,
                "Promise"
              ]);
              return;
            }
            f === "Object" && (v = Object.getPrototypeOf(e)) && typeof v.constructor == "function" && (f = v.constructor.name), a.push([
              o + "  ".repeat(c) + t,
              f === "Object" ? 3 > c ? "" : "…" : f
            ]), 3 > c && vy(e, a, c + 1, o);
            return;
          }
        case "function":
          e = e.name, e = e === "" || typeof e != "string" ? "() => {}" : e + "() {}";
          break;
        case "string":
          e = e === LE ? "…" : JSON.stringify(
            1024 <= e.length ? e.slice(0, 1023) + "…" : e
          );
          break;
        case "undefined":
          e = "undefined";
          break;
        case "boolean":
          e = e ? "true" : "false";
          break;
        default:
          e = String(e);
      }
      a.push([
        o + "  ".repeat(c) + t,
        e
      ]);
    }
    function M1(t, e, a, c) {
      var o = !0, f = 0;
      for (h in t) {
        if (f > Fu) {
          a.push([
            "Previous object has more than " + Fu + " properties. React will not attempt to diff objects with too many properties.",
            ""
          ]), o = !1;
          break;
        }
        h in e || (a.push([
          nS + "  ".repeat(c) + h,
          "…"
        ]), o = !1), f++;
      }
      f = 0;
      for (var d in e) {
        if (f > Fu) {
          a.push([
            "Next object has more than " + Fu + " properties. React will not attempt to diff objects with too many properties.",
            ""
          ]), o = !1;
          break;
        }
        if (d in t) {
          var h = t[d], y = e[d];
          if (h !== y) {
            if (c === 0 && d === "children") {
              o = "  ".repeat(c) + d, a.push(
                [nS + o, "…"],
                [uS + o, "…"]
              ), o = !1;
              continue;
            }
            if (!(3 <= c)) {
              if (typeof h == "object" && typeof y == "object" && h !== null && y !== null && yr(h) === yr(y))
                if (yr(y) === cu) {
                  if (h.type === y.type && h.key === y.key) {
                    h = P(y.type) || "…", o = "  ".repeat(c) + d, h = "<" + h + " … />", a.push(
                      [nS + o, h],
                      [uS + o, h]
                    ), o = !1;
                    continue;
                  }
                } else {
                  var v = Object.prototype.toString.call(h), p = Object.prototype.toString.call(y);
                  if (v === p && (p === "[object Object]" || p === "[object Array]")) {
                    v = [
                      fT + "  ".repeat(c) + d,
                      p === "[object Array]" ? "Array" : ""
                    ], a.push(v), p = a.length, M1(
                      h,
                      y,
                      a,
                      c + 1
                    ) ? p === a.length && (v[1] = "Referentially unequal but deeply equal objects. Consider memoization.") : o = !1;
                    continue;
                  }
                }
              else if (typeof h == "function" && typeof y == "function" && h.name === y.name && h.length === y.length && (v = Function.prototype.toString.call(h), p = Function.prototype.toString.call(y), v === p)) {
                h = y.name === "" ? "() => {}" : y.name + "() {}", a.push([
                  fT + "  ".repeat(c) + d,
                  h + " Referentially unequal function closure. Consider memoization."
                ]);
                continue;
              }
            }
            Yn(d, h, a, c, nS), Yn(d, y, a, c, uS), o = !1;
          }
        } else
          a.push([
            uS + "  ".repeat(c) + d,
            "…"
          ]), o = !1;
        f++;
      }
      return o;
    }
    function Ul(t) {
      xt = t & 63 ? "Blocking" : t & 64 ? "Gesture" : t & 4194176 ? "Transition" : t & 62914560 ? "Suspense" : t & 2080374784 ? "Idle" : "Other";
    }
    function Ou(t, e, a, c) {
      be && (Us.start = e, Us.end = a, ef.color = "warning", ef.tooltipText = c, ef.properties = null, (t = t._debugTask) ? t.run(
        performance.measure.bind(
          performance,
          c,
          Us
        )
      ) : performance.measure(c, Us), performance.clearMeasures(c));
    }
    function Mf(t, e, a) {
      Ou(t, e, a, "Reconnect");
    }
    function Ah(t, e, a, c, o) {
      var f = tt(t);
      if (f !== null && be) {
        var d = t.alternate, h = t.actualDuration;
        if (d === null || d.child !== t.child)
          for (var y = t.child; y !== null; y = y.sibling)
            h -= y.actualDuration;
        h = 0.5 > h ? c ? "tertiary-light" : "primary-light" : 10 > h ? c ? "tertiary" : "primary" : 100 > h ? c ? "tertiary-dark" : "primary-dark" : "error";
        var v = t.memoizedProps;
        c = t._debugTask, v !== null && d !== null && d.memoizedProps !== v ? (y = [JE], v = M1(
          d.memoizedProps,
          v,
          y,
          0
        ), 1 < y.length ? (v && !_s && (d.lanes & o) === 0 && 100 < t.actualDuration ? (_s = !0, y[0] = KE, ef.color = "warning", ef.tooltipText = sT) : (ef.color = h, ef.tooltipText = f), ef.properties = y, Us.start = e, Us.end = a, t = "​" + f, c != null ? c.run(
          performance.measure.bind(
            performance,
            t,
            Us
          )
        ) : performance.measure(t, Us), performance.clearMeasures(t)) : c != null ? c.run(
          console.timeStamp.bind(
            console,
            f,
            e,
            a,
            En,
            void 0,
            h
          )
        ) : console.timeStamp(
          f,
          e,
          a,
          En,
          void 0,
          h
        )) : c != null ? c.run(
          console.timeStamp.bind(
            console,
            f,
            e,
            a,
            En,
            void 0,
            h
          )
        ) : console.timeStamp(
          f,
          e,
          a,
          En,
          void 0,
          h
        );
      }
    }
    function gy(t, e, a, c) {
      if (be) {
        var o = tt(t);
        if (o !== null) {
          for (var f = null, d = [], h = 0; h < c.length; h++) {
            var y = c[h];
            f == null && y.source !== null && (f = y.source._debugTask), y = y.value, d.push([
              "Error",
              typeof y == "object" && y !== null && typeof y.message == "string" ? String(y.message) : String(y)
            ]);
          }
          t.key !== null && Yn("key", t.key, d, 0, ""), t.memoizedProps !== null && vy(t.memoizedProps, d, 0, ""), f == null && (f = t._debugTask), t = {
            start: e,
            end: a,
            detail: {
              devtools: {
                color: "error",
                track: En,
                tooltipText: t.tag === 13 ? "Hydration failed" : "Error boundary caught an error",
                properties: d
              }
            }
          }, o = "​" + o, f ? f.run(performance.measure.bind(performance, o, t)) : performance.measure(o, t), performance.clearMeasures(o);
        }
      }
    }
    function Du(t, e, a, c, o) {
      if (o !== null) {
        if (be) {
          var f = tt(t);
          if (f !== null) {
            c = [];
            for (var d = 0; d < o.length; d++) {
              var h = o[d].value;
              c.push([
                "Error",
                typeof h == "object" && h !== null && typeof h.message == "string" ? String(h.message) : String(h)
              ]);
            }
            t.key !== null && Yn("key", t.key, c, 0, ""), t.memoizedProps !== null && vy(t.memoizedProps, c, 0, ""), e = {
              start: e,
              end: a,
              detail: {
                devtools: {
                  color: "error",
                  track: En,
                  tooltipText: "A lifecycle or effect errored",
                  properties: c
                }
              }
            }, t = t._debugTask, a = "​" + f, t ? t.run(
              performance.measure.bind(performance, a, e)
            ) : performance.measure(a, e), performance.clearMeasures(a);
          }
        }
      } else
        f = tt(t), f !== null && be && (o = 1 > c ? "secondary-light" : 100 > c ? "secondary" : 500 > c ? "secondary-dark" : "error", (t = t._debugTask) ? t.run(
          console.timeStamp.bind(
            console,
            f,
            e,
            a,
            En,
            void 0,
            o
          )
        ) : console.timeStamp(
          f,
          e,
          a,
          En,
          void 0,
          o
        ));
    }
    function py(t, e, a, c) {
      !be || e <= t || (a = (a & 738197653) === a ? "tertiary-dark" : "primary-dark", c ? c.run(
        console.timeStamp.bind(
          console,
          "Prewarm",
          t,
          e,
          xt,
          Nt,
          a
        )
      ) : console.timeStamp(
        "Prewarm",
        t,
        e,
        xt,
        Nt,
        a
      ));
    }
    function _1(t, e, a, c) {
      !be || e <= t || (a = (a & 738197653) === a ? "tertiary-dark" : "primary-dark", c ? c.run(
        console.timeStamp.bind(
          console,
          "Suspended",
          t,
          e,
          xt,
          Nt,
          a
        )
      ) : console.timeStamp(
        "Suspended",
        t,
        e,
        xt,
        Nt,
        a
      ));
    }
    function Sy(t, e, a, c) {
      !be || e <= t || (c ? c.run(
        console.timeStamp.bind(
          console,
          "Errored",
          t,
          e,
          xt,
          Nt,
          "error"
        )
      ) : console.timeStamp(
        "Errored",
        t,
        e,
        xt,
        Nt,
        "error"
      ));
    }
    function ib(t, e, a, c) {
      !be || e <= t || (c ? c.run(
        console.timeStamp.bind(
          console,
          a,
          t,
          e,
          xt,
          Nt,
          "secondary-light"
        )
      ) : console.timeStamp(
        a,
        t,
        e,
        xt,
        Nt,
        "secondary-light"
      ));
    }
    function U1(t, e, a, c, o) {
      if (be && !(e <= t)) {
        for (var f = [], d = 0; d < a.length; d++) {
          var h = a[d].value;
          f.push([
            "Error",
            typeof h == "object" && h !== null && typeof h.message == "string" ? String(h.message) : String(h)
          ]);
        }
        t = {
          start: t,
          end: e,
          detail: {
            devtools: {
              color: "error",
              track: xt,
              trackGroup: Nt,
              tooltipText: c ? "Remaining Effects Errored" : "Commit Errored",
              properties: f
            }
          }
        }, o ? o.run(
          performance.measure.bind(performance, "Errored", t)
        ) : performance.measure("Errored", t), performance.clearMeasures("Errored");
      }
    }
    function N1(t, e, a, c, o) {
      a !== null ? U1(t, e, a, !1, o) : !be || e <= t || (o ? o.run(
        console.timeStamp.bind(
          console,
          c ? "Commit Interrupted View Transition" : "Commit",
          t,
          e,
          xt,
          Nt,
          c ? "error" : "secondary-dark"
        )
      ) : console.timeStamp(
        c ? "Commit Interrupted View Transition" : "Commit",
        t,
        e,
        xt,
        Nt,
        c ? "error" : "secondary-dark"
      ));
    }
    function oi(t, e, a) {
      !be || e <= t || (a ? a.run(
        console.timeStamp.bind(
          console,
          "Animating",
          t,
          e,
          xt,
          Nt,
          "secondary-dark"
        )
      ) : console.timeStamp(
        "Animating",
        t,
        e,
        xt,
        Nt,
        "secondary-dark"
      ));
    }
    function Oh() {
      for (var t = zm, e = Qb = zm = 0; e < t; ) {
        var a = Wu[e];
        Wu[e++] = null;
        var c = Wu[e];
        Wu[e++] = null;
        var o = Wu[e];
        Wu[e++] = null;
        var f = Wu[e];
        if (Wu[e++] = null, c !== null && o !== null) {
          var d = c.pending;
          d === null ? o.next = o : (o.next = d.next, d.next = o), c.pending = o;
        }
        f !== 0 && H1(a, o, f);
      }
    }
    function Dh(t, e, a, c) {
      Wu[zm++] = t, Wu[zm++] = e, Wu[zm++] = a, Wu[zm++] = c, Qb |= c, t.lanes |= c, t = t.alternate, t !== null && (t.lanes |= c);
    }
    function by(t, e, a, c) {
      return Dh(t, e, a, c), _f(t);
    }
    function Nl(t, e) {
      return Dh(t, null, null, e), _f(t);
    }
    function H1(t, e, a) {
      t.lanes |= a;
      var c = t.alternate;
      c !== null && (c.lanes |= a);
      for (var o = !1, f = t.return; f !== null; )
        f.childLanes |= a, c = f.alternate, c !== null && (c.childLanes |= a), f.tag === 22 && (t = f.stateNode, t === null || t._visibility & Ag || (o = !0)), t = f, f = f.return;
      return t.tag === 3 ? (f = t.stateNode, o && e !== null && (o = 31 - $e(a), t = f.hiddenUpdates, c = t[o], c === null ? t[o] = [e] : c.push(e), e.lane = a | 536870912), f) : null;
    }
    function _f(t) {
      if (e1 > o4)
        throw th = e1 = 0, l1 = GS = null, Error(
          "Maximum update depth exceeded. This can happen when a component repeatedly calls setState inside componentWillUpdate or componentDidUpdate. React limits the number of nested updates to prevent infinite loops."
        );
      th > f4 && (th = 0, l1 = null, console.error(
        "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."
      )), t.alternate === null && (t.flags & 4098) !== 0 && vn(t);
      for (var e = t, a = e.return; a !== null; )
        e.alternate === null && (e.flags & 4098) !== 0 && vn(t), e = a, a = e.return;
      return e.tag === 3 ? e.stateNode : null;
    }
    function Cu(t) {
      if (af === null) return t;
      var e = af(t);
      return e === void 0 ? t : e.current;
    }
    function B1(t, e) {
      if (af === null) return !1;
      var a = af, c = t.elementType;
      e = e.type;
      var o = !1, f = typeof e == "object" && e !== null ? e.$$typeof : null;
      switch (t.tag) {
        case 1:
          typeof e == "function" && (o = !0);
          break;
        case 0:
          (typeof e == "function" || f === Vl) && (o = !0);
          break;
        case 11:
          (f === Es || f === Vl) && (o = !0);
          break;
        case 14:
        case 15:
          (f === ra || f === Vl) && (o = !0);
          break;
        default:
          return !1;
      }
      return !!(o && (t = a(c), t !== void 0 && t === a(e)));
    }
    function Ty(t) {
      af !== null && typeof WeakSet == "function" && (Am === null && (Am = /* @__PURE__ */ new WeakSet()), Am.add(t));
    }
    function Ey(t, e, a) {
      do {
        var c = t, o = c.alternate, f = c.child, d = c.sibling, h = c.tag, y = c.type, v = c.elementType, p = null;
        switch (c = null, h) {
          case 0:
          case 1:
            p = y;
            break;
          case 15:
            p = y, c = v;
            break;
          case 14:
            c = v;
            break;
          case 11:
            p = y.render, c = v;
        }
        if (af === null)
          throw Error("Expected resolveFamily to be set during hot reload.");
        var z = af;
        if (y = v = !1, p !== null && (p = z(p), p !== void 0 && (a.has(p) ? y = !0 : e.has(p) && (h === 1 ? y = !0 : v = !0))), y || c === null || (h = z(c), h !== void 0 && a.has(h) ? y = !0 : typeof c == "object" && c.$$typeof === Vl && (h = c._payload, h._status === 1 && (h = z(h._result.default), h !== void 0 && a.has(h) && (y = !0)))), Am !== null && (Am.has(t) || o !== null && Am.has(o)) && (y = !0), y && (t._debugNeedsRemount = !0), (y || v) && (o = Nl(t, 2), o !== null && ge(o, t, 2)), f === null || y || Ey(
          f,
          e,
          a
        ), d === null) break;
        t = d;
      } while (!0);
    }
    function x1(t, e, a, c) {
      this.tag = t, this.key = a, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = e, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = c, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null, this.actualDuration = -0, this.actualStartTime = -1.1, this.treeBaseDuration = this.selfBaseDuration = -0, this._debugTask = this._debugStack = this._debugOwner = this._debugInfo = null, this._debugNeedsRemount = !1, this._debugHookTypes = null, dT || typeof Object.preventExtensions != "function" || Object.preventExtensions(this);
    }
    function Ch(t) {
      return t = t.prototype, !(!t || !t.isReactComponent);
    }
    function Ru(t, e) {
      var a = t.alternate;
      switch (a === null ? (a = Ot(
        t.tag,
        e,
        t.key,
        t.mode
      ), a.elementType = t.elementType, a.type = t.type, a.stateNode = t.stateNode, a._debugOwner = t._debugOwner, a._debugStack = t._debugStack, a._debugTask = t._debugTask, a._debugHookTypes = t._debugHookTypes, a.alternate = t, t.alternate = a) : (a.pendingProps = e, a.type = t.type, a.flags = 0, a.subtreeFlags = 0, a.deletions = null, a.actualDuration = -0, a.actualStartTime = -1.1), a.flags = t.flags & 1206910976, a.childLanes = t.childLanes, a.lanes = t.lanes, a.child = t.child, a.memoizedProps = t.memoizedProps, a.memoizedState = t.memoizedState, a.updateQueue = t.updateQueue, e = t.dependencies, a.dependencies = e === null ? null : {
        lanes: e.lanes,
        firstContext: e.firstContext,
        _debugThenableState: e._debugThenableState
      }, a.sibling = t.sibling, a.index = t.index, a.ref = t.ref, a.refCleanup = t.refCleanup, a.selfBaseDuration = t.selfBaseDuration, a.treeBaseDuration = t.treeBaseDuration, a._debugInfo = t._debugInfo, a._debugNeedsRemount = t._debugNeedsRemount, a.tag) {
        case 0:
        case 15:
        case 14:
        case 1:
        case 11:
          a.type = Cu(t.type);
      }
      return a;
    }
    function so(t, e) {
      t.flags &= 1206910978;
      var a = t.alternate;
      return a === null ? (t.childLanes = 0, t.lanes = e, t.child = null, t.subtreeFlags = 0, t.memoizedProps = null, t.memoizedState = null, t.updateQueue = null, t.dependencies = null, t.stateNode = null, t.selfBaseDuration = 0, t.treeBaseDuration = 0) : (t.childLanes = a.childLanes, t.lanes = a.lanes, t.child = a.child, t.subtreeFlags = 0, t.deletions = null, t.memoizedProps = a.memoizedProps, t.memoizedState = a.memoizedState, t.updateQueue = a.updateQueue, t.type = a.type, e = a.dependencies, t.dependencies = e === null ? null : {
        lanes: e.lanes,
        firstContext: e.firstContext,
        _debugThenableState: e._debugThenableState
      }, t.selfBaseDuration = a.selfBaseDuration, t.treeBaseDuration = a.treeBaseDuration), t;
    }
    function zy(t, e, a, c, o, f) {
      var d = 0, h = Cu(t);
      if (typeof h == "function")
        Ch(h) && (d = 1);
      else if (typeof h == "string")
        d = ki(), d = pb(t, a, d) ? 26 : t === "html" || t === "head" || t === "body" ? 27 : 5;
      else
        t: switch (h) {
          case om:
            return e = Ot(31, a, e, o), e.elementType = om, e.lanes = f, e;
          case bs:
            return ro(
              a.children,
              o,
              f,
              e
            );
          case Ts:
            d = 8, o |= Ba, o |= Zc;
            break;
          case Iv:
            return t = a, c = o, typeof t.id != "string" && console.error(
              'Profiler must specify an "id" of type `string` as a prop. Received the type `%s` instead.',
              typeof t.id
            ), e = Ot(12, t, e, c | zt), e.elementType = Iv, e.lanes = f, e.stateNode = { effectDuration: 0, passiveEffectDuration: 0 }, e;
          case Dd:
            return e = Ot(13, a, e, o), e.elementType = Dd, e.lanes = f, e;
          case Pv:
            return e = Ot(19, a, e, o), e.elementType = Pv, e.lanes = f, e;
          case Xp:
          case tg:
            return t = o | rT, e = Ot(30, a, e, t), e.elementType = tg, e.lanes = f, e.stateNode = {
              autoName: null,
              paired: null,
              clones: null,
              ref: null
            }, e;
          default:
            if (typeof h == "object" && h !== null)
              switch (h.$$typeof) {
                case Sn:
                  d = 10;
                  break t;
                case kv:
                  d = 9;
                  break t;
                case Es:
                  d = 11;
                  break t;
                case ra:
                  d = 14;
                  break t;
                case Vl:
                  d = 16, h = null;
                  break t;
              }
            a = "", (t === void 0 || typeof t == "object" && t !== null && Object.keys(t).length === 0) && (a += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports."), t === null ? h = "null" : le(t) ? h = "array" : t !== void 0 && t.$$typeof === cu ? (h = "<" + (P(t.type) || "Unknown") + " />", a = " Did you accidentally export a JSX literal instead of a component?") : h = typeof t, (d = c ? dt(c) : null) && (a += `

Check the render method of \`` + d + "`."), d = 29, a = Error(
              "Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: " + (h + "." + a)
            ), h = null;
        }
      return e = Ot(d, a, e, o), e.elementType = t, e.type = h, e.lanes = f, e._debugOwner = c, e;
    }
    function Rh(t, e, a) {
      return e = zy(
        t.type,
        t.key,
        t.props,
        t._owner,
        e,
        a
      ), e._debugOwner = t._owner, e._debugStack = t._debugStack, e._debugTask = t._debugTask, e;
    }
    function ro(t, e, a, c) {
      return t = Ot(7, t, c, e), t.lanes = a, t;
    }
    function Mh(t, e, a) {
      return t = Ot(6, t, null, e), t.lanes = a, t;
    }
    function Ay(t) {
      var e = Ot(18, null, null, rt);
      return e.stateNode = t, e;
    }
    function ho(t, e, a) {
      return e = Ot(
        4,
        t.children !== null ? t.children : [],
        t.key,
        e
      ), e.lanes = a, e.stateNode = {
        containerInfo: t.containerInfo,
        pendingChildren: null,
        implementation: t.implementation
      }, e;
    }
    function Sl(t, e) {
      if (typeof t == "object" && t !== null) {
        var a = Zb.get(t);
        return a !== void 0 ? a : (e = {
          value: t,
          source: e,
          stack: fe(e)
        }, Zb.set(t, e), e);
      }
      return {
        value: t,
        source: e,
        stack: fe(e)
      };
    }
    function mc(t, e) {
      yc(), Om[Dm++] = Og, Om[Dm++] = cS, cS = t, Og = e;
    }
    function vr(t, e, a) {
      yc(), Iu[ku++] = nf, Iu[ku++] = uf, Iu[ku++] = qd, qd = t;
      var c = nf;
      t = uf;
      var o = 32 - $e(c) - 1;
      c &= ~(1 << o), a += 1;
      var f = 32 - $e(e) + o;
      if (30 < f) {
        var d = o - o % 5;
        f = (c & (1 << d) - 1).toString(32), c >>= d, o -= d, nf = 1 << 32 - $e(e) + o | a << o | c, uf = f + t;
      } else
        nf = 1 << f | a << o | c, uf = t;
    }
    function gr(t) {
      yc(), t.return !== null && (mc(t, 1), vr(t, 1, 0));
    }
    function _h(t) {
      for (; t === cS; )
        cS = Om[--Dm], Om[Dm] = null, Og = Om[--Dm], Om[Dm] = null;
      for (; t === qd; )
        qd = Iu[--ku], Iu[ku] = null, uf = Iu[--ku], Iu[ku] = null, nf = Iu[--ku], Iu[ku] = null;
    }
    function Uh() {
      return yc(), qd !== null ? { id: nf, overflow: uf } : null;
    }
    function Nh(t, e) {
      yc(), Iu[ku++] = nf, Iu[ku++] = uf, Iu[ku++] = qd, nf = e.id, uf = e.overflow, qd = t;
    }
    function yc() {
      At || console.error(
        "Expected to be hydrating. This is a bug in React. Please file an issue."
      );
    }
    function fi(t, e) {
      if (t.return === null) {
        if (su === null)
          su = {
            fiber: t,
            children: [],
            serverProps: void 0,
            serverTail: [],
            distanceFromLeaf: e
          };
        else {
          if (su.fiber !== t)
            throw Error(
              "Saw multiple hydration diff roots in a pass. This is a bug in React."
            );
          su.distanceFromLeaf > e && (su.distanceFromLeaf = e);
        }
        return su;
      }
      var a = fi(
        t.return,
        e + 1
      ).children;
      return 0 < a.length && a[a.length - 1].fiber === t ? (a = a[a.length - 1], a.distanceFromLeaf > e && (a.distanceFromLeaf = e), a) : (e = {
        fiber: t,
        children: [],
        serverProps: void 0,
        serverTail: [],
        distanceFromLeaf: e
      }, a.push(e), e);
    }
    function Oy() {
      At && console.error(
        "We should not be hydrating here. This is a bug in React. Please file a bug."
      );
    }
    function Hh(t, e) {
      wi || (t = fi(t, 0), t.serverProps = null, e !== null && (e = Ap(e), t.serverTail.push(e)));
    }
    function si(t) {
      var e = 1 < arguments.length && arguments[1] !== void 0 ? arguments[1] : !1, a = "", c = su;
      throw c !== null && (su = null, a = Vt(c)), yo(
        Sl(
          Error(
            "Hydration failed because the server rendered " + (e ? "text" : "HTML") + ` didn't match the client. As a result this tree will be regenerated on the client. This can happen if a SSR-ed Client Component used:

- A server/client branch \`if (typeof window !== 'undefined')\`.
- Variable input such as \`Date.now()\` or \`Math.random()\` which changes each time it's called.
- Date formatting in a user's locale which doesn't match the server.
- External changing data without sending a snapshot of it along with the HTML.
- Invalid HTML tag nesting.

It can also happen if the client has a browser extension installed which messes with the HTML before React loaded.

https://react.dev/link/hydration-mismatch` + a
          ),
          t
        )
      ), Lb;
    }
    function Y1(t) {
      var e = t.stateNode, a = t.type, c = t.memoizedProps;
      switch (e[zl] = t, e[Al] = c, Dt(a, c), a) {
        case "dialog":
          _t("cancel", e), _t("close", e);
          break;
        case "iframe":
        case "object":
        case "embed":
          _t("load", e);
          break;
        case "video":
        case "audio":
          for (a = 0; a < a1.length; a++)
            _t(a1[a], e);
          break;
        case "source":
          _t("error", e);
          break;
        case "img":
        case "image":
        case "link":
          _t("error", e), _t("load", e);
          break;
        case "details":
          _t("toggle", e);
          break;
        case "input":
          Tu("input", c), _t("invalid", e), ay(e, c), ul(
            e,
            c.value,
            c.defaultValue,
            c.checked,
            c.defaultChecked,
            c.type,
            c.name,
            !0
          );
          break;
        case "option":
          ao(e, c);
          break;
        case "select":
          Tu("select", c), _t("invalid", e), p1(e, c);
          break;
        case "textarea":
          Tu("textarea", c), _t("invalid", e), uy(e, c), ur(
            e,
            c.value,
            c.defaultValue,
            c.children
          );
      }
      a = c.children, typeof a != "string" && typeof a != "number" && typeof a != "bigint" || e.textContent === "" + a || c.suppressHydrationWarning === !0 || ze(e.textContent, a) ? (c.popover != null && (_t("beforetoggle", e), _t("toggle", e)), c.onScroll != null && _t("scroll", e), c.onScrollEnd != null && _t("scrollend", e), c.onClick != null && (e.onclick = zu), e = !0) : e = !1, e || si(t, !0);
    }
    function Bh(t) {
      for (Xl = t.return; Xl; )
        switch (Xl.tag) {
          case 5:
          case 31:
          case 13:
            Pu = !1;
            return;
          case 27:
          case 3:
            Pu = !0;
            return;
          default:
            Xl = Xl.return;
        }
    }
    function Uf(t) {
      if (t !== Xl) return !1;
      if (!At)
        return Bh(t), At = !0, !1;
      var e = t.tag, a;
      if ((a = e !== 3 && e !== 27) && ((a = e === 5) && (a = t.type, a = !(a !== "form" && a !== "button") || Ni(t.type, t.memoizedProps)), a = !a), a && pe) {
        for (a = pe; a; ) {
          var c = fi(t, 0), o = Ap(a);
          c.serverTail.push(o), a = o.type === "Suspense" ? tm(a) : _a(a.nextSibling);
        }
        si(t);
      }
      if (Bh(t), e === 13) {
        if (t = t.memoizedState, t = t !== null ? t.dehydrated : null, !t)
          throw Error(
            "Expected to have a hydrated suspense instance. This error is likely caused by a bug in React. Please file an issue."
          );
        pe = tm(t);
      } else if (e === 31) {
        if (t = t.memoizedState, t = t !== null ? t.dehydrated : null, !t)
          throw Error(
            "Expected to have a hydrated suspense instance. This error is likely caused by a bug in React. Please file an issue."
          );
        pe = tm(t);
      } else
        e === 27 ? (e = pe, fa(t.type) ? (t = w2, w2 = null, pe = t) : pe = e) : pe = Xl ? _a(t.stateNode.nextSibling) : null;
      return !0;
    }
    function Ie() {
      pe = Xl = null, wi = At = !1;
    }
    function mo() {
      var t = Hs;
      return t !== null && (an === null ? an = t : an.push.apply(
        an,
        t
      ), Hs = null), t;
    }
    function yo(t) {
      Hs === null ? Hs = [t] : Hs.push(t);
    }
    function xh() {
      var t = su;
      if (t !== null) {
        su = null;
        for (var e = Vt(t); 0 < t.children.length; )
          t = t.children[0];
        $(t.fiber, function() {
          console.error(
            `A tree hydrated but some attributes of the server rendered HTML didn't match the client properties. This won't be patched up. This can happen if a SSR-ed Client Component used:

- A server/client branch \`if (typeof window !== 'undefined')\`.
- Variable input such as \`Date.now()\` or \`Math.random()\` which changes each time it's called.
- Date formatting in a user's locale which doesn't match the server.
- External changing data without sending a snapshot of it along with the HTML.
- Invalid HTML tag nesting.

It can also happen if the client has a browser extension installed which messes with the HTML before React loaded.

%s%s`,
            "https://react.dev/link/hydration-mismatch",
            e
          );
        });
      }
    }
    function pr() {
      Cm = iS = null, Rm = !1;
    }
    function vc(t, e, a) {
      yt(Jb, e._currentValue, t), e._currentValue = a, yt(Kb, e._currentRenderer, t), e._currentRenderer !== void 0 && e._currentRenderer !== null && e._currentRenderer !== mT && console.error(
        "Detected multiple renderers concurrently rendering the same context provider. This is currently unsupported."
      ), e._currentRenderer = mT;
    }
    function Mu(t, e) {
      t._currentValue = Jb.current;
      var a = Kb.current;
      de(Kb, e), t._currentRenderer = a, de(Jb, e);
    }
    function Nf(t, e, a) {
      for (; t !== null; ) {
        var c = t.alternate;
        if ((t.childLanes & e) !== e ? (t.childLanes |= e, c !== null && (c.childLanes |= e)) : c !== null && (c.childLanes & e) !== e && (c.childLanes |= e), t === a) break;
        t = t.return;
      }
      t !== a && console.error(
        "Expected to find the propagation root when scheduling context work. This error is likely caused by a bug in React. Please file an issue."
      );
    }
    function Dy(t, e, a, c) {
      var o = t.child;
      for (o !== null && (o.return = t); o !== null; ) {
        var f = o.dependencies;
        if (f !== null) {
          var d = o.child;
          f = f.firstContext;
          t: for (; f !== null; ) {
            var h = f;
            f = o;
            for (var y = 0; y < e.length; y++)
              if (h.context === e[y]) {
                f.lanes |= a, h = f.alternate, h !== null && (h.lanes |= a), Nf(
                  f.return,
                  a,
                  t
                ), c || (d = null);
                break t;
              }
            f = h.next;
          }
        } else if (o.tag === 18) {
          if (d = o.return, d === null)
            throw Error(
              "We just came from a parent so we must have had a parent. This is a bug in React."
            );
          d.lanes |= a, f = d.alternate, f !== null && (f.lanes |= a), Nf(
            d,
            a,
            t
          ), d = null;
        } else
          o.tag === 13 && o.memoizedState !== null && o.memoizedState.dehydrated === null ? (o.lanes |= a, d = o.alternate, d !== null && (d.lanes |= a), Nf(
            o.return,
            a,
            t
          ), d = o.child, d = d !== null ? d.sibling : null) : d = o.child;
        if (d !== null) d.return = o;
        else
          for (d = o; d !== null; ) {
            if (d === t) {
              d = null;
              break;
            }
            if (o = d.sibling, o !== null) {
              o.return = d.return, d = o;
              break;
            }
            d = d.return;
          }
        o = d;
      }
    }
    function on(t, e, a, c) {
      t = null;
      for (var o = e, f = !1; o !== null; ) {
        if (!f) {
          if ((o.flags & 524288) !== 0) f = !0;
          else if ((o.flags & 262144) !== 0) break;
        }
        if (o.tag === 10) {
          var d = o.alternate;
          if (d === null)
            throw Error("Should have a current fiber. This is a bug in React.");
          if (d = d.memoizedProps, d !== null) {
            var h = o.type;
            tn(o.pendingProps.value, d.value) || (t !== null ? t.push(h) : t = [h]);
          }
        } else if (o === fm.current) {
          if (d = o.alternate, d === null)
            throw Error("Should have a current fiber. This is a bug in React.");
          d.memoizedState.memoizedState !== o.memoizedState.memoizedState && (t !== null ? t.push(Wm) : t = [Wm]);
        }
        o = o.return;
      }
      return t !== null && Dy(
        e,
        t,
        a,
        c
      ), e.flags |= 262144, t !== null;
    }
    function Hf(t) {
      for (t = t.firstContext; t !== null; ) {
        if (!tn(
          t.context._currentValue,
          t.memoizedValue
        ))
          return !0;
        t = t.next;
      }
      return !1;
    }
    function qn(t) {
      iS = t, Cm = null, t = t.dependencies, t !== null && (t.firstContext = null);
    }
    function se(t) {
      return Rm && console.error(
        "Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo()."
      ), ri(iS, t);
    }
    function Sr(t, e) {
      return iS === null && qn(t), ri(t, e);
    }
    function ri(t, e) {
      var a = e._currentValue;
      if (e = { context: e, memoizedValue: a, next: null }, Cm === null) {
        if (t === null)
          throw Error(
            "Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo()."
          );
        Cm = e, t.dependencies = {
          lanes: 0,
          firstContext: e,
          _debugThenableState: null
        }, t.flags |= 524288;
      } else Cm = Cm.next = e;
      return a;
    }
    function di() {
      return {
        controller: new FE(),
        data: /* @__PURE__ */ new Map(),
        refCount: 0
      };
    }
    function gc(t) {
      t.controller.signal.aborted && console.warn(
        "A cache instance was retained after it was already freed. This likely indicates a bug in React."
      ), t.refCount++;
    }
    function Bf(t) {
      t.refCount--, 0 > t.refCount && console.warn(
        "A cache instance was released after it was already freed. This likely indicates a bug in React."
      ), t.refCount === 0 && WE(IE, function() {
        t.controller.abort();
      });
    }
    function hi(t, e) {
      if ((t.pendingLanes & 4194048) !== 0) {
        var a = t.transitionTypes;
        for (a === null && (a = t.transitionTypes = []), t = 0; t < e.length; t++) {
          var c = e[t];
          a.indexOf(c) === -1 && a.push(c);
        }
      }
    }
    function q1(t) {
      var e = t.transitionTypes;
      return t.transitionTypes = null, e;
    }
    function Gn(t, e, a) {
      (t & 127) !== 0 ? 0 > Xi && (Xi = al(), Rg = oS(e), $b = e, a != null && (Fb = tt(a)), (Zt & (Dl | hu)) !== Jl && (we = !0, xs = Cg), t = Hi(), e = qc(), t !== Mm || e !== Mg ? Mm = -1.1 : e !== null && (xs = Cg), Vd = t, Mg = e) : (t & 4194048) !== 0 && 0 > tc && (tc = al(), _g = oS(e), yT = e, a != null && (vT = tt(a)), 0 > ff) && (t = Hi(), e = qc(), (t !== qs || e !== jd) && (qs = -1.1), Ys = t, jd = e);
    }
    function G1(t) {
      if (0 > Xi) {
        Xi = al(), Rg = t._debugTask != null ? t._debugTask : null, (Zt & (Dl | hu)) !== Jl && (xs = Cg);
        var e = Hi(), a = qc();
        e !== Mm || a !== Mg ? Mm = -1.1 : a !== null && (xs = Cg), Vd = e, Mg = a;
      }
      0 > tc && (tc = al(), _g = t._debugTask != null ? t._debugTask : null, 0 > ff) && (t = Hi(), e = qc(), (t !== qs || e !== jd) && (qs = -1.1), Ys = t, jd = e);
    }
    function pc() {
      var t = Gd;
      return Gd = 0, t;
    }
    function Yh(t) {
      var e = Gd;
      return Gd = t, e;
    }
    function br(t) {
      var e = Gd;
      return Gd += t, e;
    }
    function Tr() {
      it = nt = -1.1;
    }
    function Ta() {
      var t = nt;
      return nt = -1.1, t;
    }
    function Il(t) {
      0 <= t && (nt = t);
    }
    function Le() {
      var t = Ne;
      return Ne = -0, t;
    }
    function _u(t) {
      0 <= t && (Ne = t);
    }
    function cl() {
      var t = Oe;
      return Oe = null, t;
    }
    function Vn() {
      var t = we;
      return we = !1, t;
    }
    function jn(t) {
      en = al(), 0 > t.actualStartTime && (t.actualStartTime = en);
    }
    function xf(t) {
      if (0 <= en) {
        var e = al() - en;
        t.actualDuration += e, t.selfBaseDuration = e, en = -1;
      }
    }
    function La(t) {
      if (0 <= en) {
        var e = al() - en;
        t.actualDuration += e, en = -1;
      }
    }
    function kl() {
      if (0 <= en) {
        var t = al(), e = t - en;
        en = -1, Gd += e, Ne += e, it = t;
      }
    }
    function qh(t) {
      Oe === null && (Oe = []), Oe.push(t), of === null && (of = []), of.push(t);
    }
    function Ja() {
      en = al(), 0 > nt && (nt = en);
    }
    function mi(t) {
      for (var e = t.child; e; )
        t.actualDuration += e.actualDuration, e = e.sibling;
    }
    function Cy(t, e) {
      if (Ng === null) {
        var a = Ng = [];
        Pb = 0, Gs = _i(), _m = {
          status: "pending",
          value: void 0,
          then: function(c) {
            a.push(c);
          }
        };
      }
      return Pb++, e.then(yi, yi), e;
    }
    function yi() {
      if (--Pb === 0 && (-1 < tc || (ff = -1.1), Dg = null, Ng !== null)) {
        _m !== null && (_m.status = "fulfilled");
        var t = Ng;
        Ng = null, Gs = 0, _m = null;
        for (var e = 0; e < t.length; e++) (0, t[e])();
      }
    }
    function V1(t, e) {
      var a = [], c = {
        status: "pending",
        value: null,
        reason: null,
        then: function(o) {
          a.push(o);
        }
      };
      return t.then(
        function() {
          c.status = "fulfilled", c.value = e;
          for (var o = 0; o < a.length; o++) (0, a[o])(e);
        },
        function(o) {
          for (c.status = "rejected", c.reason = o, o = 0; o < a.length; o++)
            (0, a[o])(void 0);
        }
      ), c;
    }
    function Yf() {
      var t = Xd.current;
      return t !== null ? t : ye.pooledCache;
    }
    function Sc(t, e) {
      e === null ? yt(Xd, Xd.current, t) : yt(Xd, e.pool, t);
    }
    function j1() {
      var t = Yf();
      return t === null ? null : { parent: sl._currentValue, pool: t };
    }
    function Pl() {
      return { didWarnAboutUncachedPromise: !1, thenables: [] };
    }
    function Gh(t) {
      return t = t.status, t === "fulfilled" || t === "rejected";
    }
    function Uu(t, e, a, c) {
      x.actQueue !== null && (x.didUsePromise = !0);
      var o = t.thenables;
      if (a = o[a], a === void 0 ? o.push(e) : a !== e && (t.didWarnAboutUncachedPromise || (t.didWarnAboutUncachedPromise = !0, console.error(
        "A component was suspended by an uncached promise. Creating promises inside a Client Component or hook is not yet supported, except via a Suspense-compatible library or framework."
      )), e.then(zu, zu), e = a), e._debugInfo === void 0) {
        t = performance.now(), o = e.displayName;
        var f = {
          name: typeof o == "string" ? o : "Promise",
          start: t,
          end: t,
          value: e
        };
        e._debugInfo = [{ awaited: f }], e.status !== "fulfilled" && e.status !== "rejected" && (t = function() {
          f.end = performance.now();
        }, e.then(t, t));
      }
      switch (e.status) {
        case "fulfilled":
          return e.value;
        case "rejected":
          throw c = e.reason, vi(c), c === void 0 && !("reason" in e) ? Error(
            "A rejected Promise was passed to React without a `reason` property. React threw a generic error from where the Promise was used to assist in identifying the problematic Promise. Make sure that instrumented Promises correctly set the `reason` property when setting `status` to `'rejected'`."
          ) : c;
        default:
          if (typeof e.status == "string")
            e.then(zu, zu);
          else {
            if (t = ye, t !== null && 100 < t.shellSuspendCounter)
              throw Error(
                "An unknown Component is an async Client Component. Only Server Components can be async at the moment. This error is often caused by accidentally adding `'use client'` to a module that was originally written for the server."
              );
            t = e, t.status = "pending", t.then(
              function(d) {
                if (e.status === "pending") {
                  var h = e;
                  h.status = "fulfilled", h.value = d;
                }
              },
              function(d) {
                if (e.status === "pending") {
                  var h = e;
                  h.status = "rejected", h.reason = d;
                }
              }
            );
          }
          switch (e.status) {
            case "fulfilled":
              return e.value;
            case "rejected":
              throw c = e.reason, vi(c), c;
          }
          throw Ld = e, Vg = !0, a2 || c === null || c.alternate !== null || (Zd = c, gS = Error(
            "This library called use() to suspend in a previous render but did not call use() when it finished. This indicates an incorrect use of use(). Learn more: https://react.dev/warnings/conditional-use-of-use"
          )), Um;
      }
    }
    function bc(t) {
      try {
        return l4(t);
      } catch (e) {
        throw e !== null && typeof e == "object" && typeof e.then == "function" ? (Ld = e, Vg = !0, Um) : e;
      }
    }
    function Er() {
      if (Ld === null)
        throw Error(
          "Expected a suspended thenable. This is a bug in React. Please file an issue."
        );
      var t = Ld;
      return Ld = null, Vg = !1, t;
    }
    function vi(t) {
      if (t === Um || t === yS)
        throw Error(
          "Hooks are not supported inside an async component. This error is often caused by accidentally adding `'use client'` to a module that was originally written for the server."
        );
    }
    function Vh(t, e) {
      return t === e ? !0 : t.tag !== e.tag || t.type !== e.type || t.key !== e.key || t.index !== e.index || t.tag === 3 && t.stateNode !== e.stateNode || t.return === null || e.return === null ? !1 : Vh(t.return, e.return);
    }
    function Hl(t) {
      var e = Ht;
      return t != null && (Ht = e === null ? t : e.concat(t)), e;
    }
    function zr() {
      var t = Ht;
      if (t != null) {
        for (var e = t.length - 1; 0 <= e; e--)
          if (t[e].name != null) {
            var a = t[e].debugTask;
            if (a != null) return a;
          }
      }
      return null;
    }
    function Ar(t, e, a) {
      for (var c = Object.keys(t.props), o = 0; o < c.length; o++) {
        var f = c[o];
        if (f !== "children" && f !== "key" && f !== "ref") {
          e === null && (e = Rh(t, a.mode, 0), e._debugInfo = Ht, e.return = a), $(
            e,
            function(d) {
              console.error(
                "Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key`, `ref`, and `children` props.",
                d
              );
            },
            f
          );
          break;
        }
      }
    }
    function ta(t) {
      var e = jg;
      return jg += 1, Nm === null && (Nm = Pl()), Uu(Nm, t, e, null);
    }
    function Ka(t, e) {
      e = e.props.ref, t.ref = e !== void 0 ? e : null;
    }
    function vo(t, e) {
      throw e.$$typeof === Tb ? Error(
        `A React Element from an older version of React was rendered. This is not supported. It can happen if:
- Multiple copies of the "react" package is used.
- A library pre-bundled an old copy of "react" or "react/jsx-runtime".
- A compiler tries to "inline" JSX instead of using the runtime.`
      ) : (t = Object.prototype.toString.call(e), Error(
        "Objects are not valid as a React child (found: " + (t === "[object Object]" ? "object with keys {" + Object.keys(e).join(", ") + "}" : t) + "). If you meant to render a collection of children, use an array instead."
      ));
    }
    function go(t, e) {
      var a = zr();
      a !== null ? a.run(
        vo.bind(null, t, e)
      ) : vo(t, e);
    }
    function qf(t, e) {
      var a = tt(t) || "Component";
      BT[a] || (BT[a] = !0, e = e.displayName || e.name || "Component", t.tag === 3 ? console.error(
        `Functions are not valid as a React child. This may happen if you return %s instead of <%s /> from render. Or maybe you meant to call this function rather than return it.
  root.render(%s)`,
        e,
        e,
        e
      ) : console.error(
        `Functions are not valid as a React child. This may happen if you return %s instead of <%s /> from render. Or maybe you meant to call this function rather than return it.
  <%s>{%s}</%s>`,
        e,
        e,
        a,
        e,
        a
      ));
    }
    function ea(t, e) {
      var a = zr();
      a !== null ? a.run(
        qf.bind(null, t, e)
      ) : qf(t, e);
    }
    function $a(t, e) {
      var a = tt(t) || "Component";
      xT[a] || (xT[a] = !0, e = String(e), t.tag === 3 ? console.error(
        `Symbols are not valid as a React child.
  root.render(%s)`,
        e
      ) : console.error(
        `Symbols are not valid as a React child.
  <%s>%s</%s>`,
        a,
        e,
        a
      ));
    }
    function wn(t, e) {
      var a = zr();
      a !== null ? a.run(
        $a.bind(null, t, e)
      ) : $a(t, e);
    }
    function Xn(t) {
      function e(b, T) {
        if (t) {
          var A = b.deletions;
          A === null ? (b.deletions = [T], b.flags |= 16) : A.push(T);
        }
      }
      function a(b, T) {
        if (!t) return null;
        for (; T !== null; )
          e(b, T), T = T.sibling;
        return null;
      }
      function c(b) {
        for (var T = /* @__PURE__ */ new Map(); b !== null; )
          b.key === null ? T.set(b.index, b) : T.set(b.key, b), b = b.sibling;
        return T;
      }
      function o(b, T) {
        return b = Ru(b, T), b.index = 0, b.sibling = null, b;
      }
      function f(b, T, A) {
        return b.index = A, t ? (A = b.alternate, A !== null ? (A = A.index, A < T ? (b.flags |= 2, T) : A) : (b.flags |= 134217730, T)) : (b.flags |= 1048576, T);
      }
      function d(b) {
        return t && b.alternate === null && (b.flags |= 134217730), b;
      }
      function h(b, T, A, B) {
        return T === null || T.tag !== 6 ? (T = Mh(
          A,
          b.mode,
          B
        ), T.return = b, T._debugOwner = b, T._debugTask = b._debugTask, T._debugInfo = Ht, T) : (T = o(T, A), T.return = b, T._debugInfo = Ht, T);
      }
      function y(b, T, A, B) {
        var X = A.type;
        return X === bs ? (T = p(
          b,
          T,
          A.props.children,
          B,
          A.key
        ), Ka(T, A), Ar(A, T, b), T) : T !== null && (T.elementType === X || B1(T, A) || typeof X == "object" && X !== null && X.$$typeof === Vl && bc(X) === T.type) ? (T = o(T, A.props), Ka(T, A), T.return = b, T._debugOwner = A._owner, T._debugInfo = Ht, T) : (T = Rh(A, b.mode, B), Ka(T, A), T.return = b, T._debugInfo = Ht, T);
      }
      function v(b, T, A, B) {
        return T === null || T.tag !== 4 || T.stateNode.containerInfo !== A.containerInfo || T.stateNode.implementation !== A.implementation ? (T = ho(A, b.mode, B), T.return = b, T._debugInfo = Ht, T) : (T = o(T, A.children || []), T.return = b, T._debugInfo = Ht, T);
      }
      function p(b, T, A, B, X) {
        return T === null || T.tag !== 7 ? (T = ro(
          A,
          b.mode,
          B,
          X
        ), T.return = b, T._debugOwner = b, T._debugTask = b._debugTask, T._debugInfo = Ht, T) : (T = o(T, A), T.return = b, T._debugInfo = Ht, T);
      }
      function z(b, T, A) {
        if (typeof T == "string" && T !== "" || typeof T == "number" || typeof T == "bigint")
          return T = Mh(
            "" + T,
            b.mode,
            A
          ), T.return = b, T._debugOwner = b, T._debugTask = b._debugTask, T._debugInfo = Ht, T;
        if (typeof T == "object" && T !== null) {
          switch (T.$$typeof) {
            case cu:
              return A = Rh(
                T,
                b.mode,
                A
              ), Ka(A, T), A.return = b, b = Hl(T._debugInfo), A._debugInfo = Ht, Ht = b, A;
            case Fo:
              return T = ho(
                T,
                b.mode,
                A
              ), T.return = b, T._debugInfo = Ht, T;
            case Vl:
              var B = Hl(T._debugInfo);
              return T = bc(T), b = z(b, T, A), Ht = B, b;
          }
          if (le(T) || Q(T))
            return A = ro(
              T,
              b.mode,
              A,
              null
            ), A.return = b, A._debugOwner = b, A._debugTask = b._debugTask, b = Hl(T._debugInfo), A._debugInfo = Ht, Ht = b, A;
          if (typeof T.then == "function")
            return B = Hl(T._debugInfo), b = z(
              b,
              ta(T),
              A
            ), Ht = B, b;
          if (T.$$typeof === Sn)
            return z(
              b,
              Sr(b, T),
              A
            );
          go(b, T);
        }
        return typeof T == "function" && ea(b, T), typeof T == "symbol" && wn(b, T), null;
      }
      function E(b, T, A, B) {
        var X = T !== null ? T.key : null;
        if (typeof A == "string" && A !== "" || typeof A == "number" || typeof A == "bigint")
          return X !== null ? null : h(b, T, "" + A, B);
        if (typeof A == "object" && A !== null) {
          switch (A.$$typeof) {
            case cu:
              return A.key === X ? (X = Hl(A._debugInfo), b = y(
                b,
                T,
                A,
                B
              ), Ht = X, b) : null;
            case Fo:
              return A.key === X ? v(b, T, A, B) : null;
            case Vl:
              return X = Hl(A._debugInfo), A = bc(A), b = E(
                b,
                T,
                A,
                B
              ), Ht = X, b;
          }
          if (le(A) || Q(A))
            return X !== null ? null : (X = Hl(A._debugInfo), b = p(
              b,
              T,
              A,
              B,
              null
            ), Ht = X, b);
          if (typeof A.then == "function")
            return X = Hl(A._debugInfo), b = E(
              b,
              T,
              ta(A),
              B
            ), Ht = X, b;
          if (A.$$typeof === Sn)
            return E(
              b,
              T,
              Sr(b, A),
              B
            );
          go(b, A);
        }
        return typeof A == "function" && ea(b, A), typeof A == "symbol" && wn(b, A), null;
      }
      function M(b, T, A, B, X) {
        if (typeof B == "string" && B !== "" || typeof B == "number" || typeof B == "bigint")
          return b = b.get(A) || null, h(T, b, "" + B, X);
        if (typeof B == "object" && B !== null) {
          switch (B.$$typeof) {
            case cu:
              return A = b.get(
                B.key === null ? A : B.key
              ) || null, b = Hl(B._debugInfo), T = y(
                T,
                A,
                B,
                X
              ), Ht = b, T;
            case Fo:
              return b = b.get(
                B.key === null ? A : B.key
              ) || null, v(T, b, B, X);
            case Vl:
              var ot = Hl(B._debugInfo);
              return B = bc(B), T = M(
                b,
                T,
                A,
                B,
                X
              ), Ht = ot, T;
          }
          if (le(B) || Q(B))
            return A = b.get(A) || null, b = Hl(B._debugInfo), T = p(
              T,
              A,
              B,
              X,
              null
            ), Ht = b, T;
          if (typeof B.then == "function")
            return ot = Hl(B._debugInfo), T = M(
              b,
              T,
              A,
              ta(B),
              X
            ), Ht = ot, T;
          if (B.$$typeof === Sn)
            return M(
              b,
              T,
              A,
              Sr(T, B),
              X
            );
          go(T, B);
        }
        return typeof B == "function" && ea(T, B), typeof B == "symbol" && wn(T, B), null;
      }
      function j(b, T, A, B) {
        if (typeof A != "object" || A === null) return B;
        switch (A.$$typeof) {
          case cu:
          case Fo:
            Wi(b, T, A);
            var X = A.key;
            if (typeof X != "string") break;
            if (B === null) {
              B = /* @__PURE__ */ new Set(), B.add(X);
              break;
            }
            if (!B.has(X)) {
              B.add(X);
              break;
            }
            $(T, function() {
              console.error(
                "Encountered two children with the same key, `%s`. Keys should be unique so that components maintain their identity across updates. Non-unique keys may cause children to be duplicated and/or omitted — the behavior is unsupported and could change in a future version.",
                X
              );
            });
            break;
          case Vl:
            A = bc(A), j(b, T, A, B);
        }
        return B;
      }
      function J(b, T, A, B) {
        for (var X = null, ot = null, lt = null, Tt = T, Rt = T = 0, xe = null; Tt !== null && Rt < A.length; Rt++) {
          Tt.index > Rt ? (xe = Tt, Tt = null) : xe = Tt.sibling;
          var re = E(
            b,
            Tt,
            A[Rt],
            B
          );
          if (re === null) {
            Tt === null && (Tt = xe);
            break;
          }
          X = j(
            b,
            re,
            A[Rt],
            X
          ), t && Tt && re.alternate === null && e(b, Tt), T = f(re, T, Rt), lt === null ? ot = re : lt.sibling = re, lt = re, Tt = xe;
        }
        if (Rt === A.length)
          return a(b, Tt), At && mc(b, Rt), ot;
        if (Tt === null) {
          for (; Rt < A.length; Rt++)
            Tt = z(b, A[Rt], B), Tt !== null && (X = j(
              b,
              Tt,
              A[Rt],
              X
            ), T = f(
              Tt,
              T,
              Rt
            ), lt === null ? ot = Tt : lt.sibling = Tt, lt = Tt);
          return At && mc(b, Rt), ot;
        }
        for (Tt = c(Tt); Rt < A.length; Rt++)
          xe = M(
            Tt,
            b,
            Rt,
            A[Rt],
            B
          ), xe !== null && (X = j(
            b,
            xe,
            A[Rt],
            X
          ), t && (re = xe.alternate, re !== null && Tt.delete(
            re.key === null ? Rt : re.key
          )), T = f(
            xe,
            T,
            Rt
          ), lt === null ? ot = xe : lt.sibling = xe, lt = xe);
        return t && Tt.forEach(function(vf) {
          return e(b, vf);
        }), At && mc(b, Rt), ot;
      }
      function et(b, T, A, B) {
        if (A == null)
          throw Error("An iterable object provided no iterator.");
        for (var X = null, ot = null, lt = T, Tt = T = 0, Rt = null, xe = null, re = A.next(); lt !== null && !re.done; Tt++, re = A.next()) {
          lt.index > Tt ? (Rt = lt, lt = null) : Rt = lt.sibling;
          var vf = E(b, lt, re.value, B);
          if (vf === null) {
            lt === null && (lt = Rt);
            break;
          }
          xe = j(
            b,
            vf,
            re.value,
            xe
          ), t && lt && vf.alternate === null && e(b, lt), T = f(vf, T, Tt), ot === null ? X = vf : ot.sibling = vf, ot = vf, lt = Rt;
        }
        if (re.done)
          return a(b, lt), At && mc(b, Tt), X;
        if (lt === null) {
          for (; !re.done; Tt++, re = A.next())
            lt = z(b, re.value, B), lt !== null && (xe = j(
              b,
              lt,
              re.value,
              xe
            ), T = f(
              lt,
              T,
              Tt
            ), ot === null ? X = lt : ot.sibling = lt, ot = lt);
          return At && mc(b, Tt), X;
        }
        for (lt = c(lt); !re.done; Tt++, re = A.next())
          Rt = M(
            lt,
            b,
            Tt,
            re.value,
            B
          ), Rt !== null && (xe = j(
            b,
            Rt,
            re.value,
            xe
          ), t && (re = Rt.alternate, re !== null && lt.delete(re.key === null ? Tt : re.key)), T = f(
            Rt,
            T,
            Tt
          ), ot === null ? X = Rt : ot.sibling = Rt, ot = Rt);
        return t && lt.forEach(function(C4) {
          return e(b, C4);
        }), At && mc(b, Tt), X;
      }
      function Et(b, T, A, B) {
        if (typeof A == "object" && A !== null && A.type === bs && A.key === null && A.props.ref === void 0 && (Ar(A, null, b), A = A.props.children), typeof A == "object" && A !== null) {
          switch (A.$$typeof) {
            case cu:
              var X = Hl(A._debugInfo);
              t: {
                for (var ot = A.key; T !== null; ) {
                  if (T.key === ot) {
                    if (ot = A.type, ot === bs) {
                      if (T.tag === 7) {
                        a(
                          b,
                          T.sibling
                        ), B = o(
                          T,
                          A.props.children
                        ), Ka(B, A), B.return = b, B._debugOwner = A._owner, B._debugInfo = Ht, Ar(A, B, b), b = B;
                        break t;
                      }
                    } else if (T.elementType === ot || B1(
                      T,
                      A
                    ) || typeof ot == "object" && ot !== null && ot.$$typeof === Vl && bc(ot) === T.type) {
                      a(
                        b,
                        T.sibling
                      ), B = o(T, A.props), Ka(B, A), B.return = b, B._debugOwner = A._owner, B._debugInfo = Ht, b = B;
                      break t;
                    }
                    a(b, T);
                    break;
                  } else e(b, T);
                  T = T.sibling;
                }
                A.type === bs ? (B = ro(
                  A.props.children,
                  b.mode,
                  B,
                  A.key
                ), Ka(B, A), B.return = b, B._debugOwner = b, B._debugTask = b._debugTask, B._debugInfo = Ht, Ar(A, B, b), b = B) : (B = Rh(
                  A,
                  b.mode,
                  B
                ), Ka(B, A), B.return = b, B._debugInfo = Ht, b = B);
              }
              return b = d(b), Ht = X, b;
            case Fo:
              t: {
                for (X = A, A = X.key; T !== null; ) {
                  if (T.key === A)
                    if (T.tag === 4 && T.stateNode.containerInfo === X.containerInfo && T.stateNode.implementation === X.implementation) {
                      a(
                        b,
                        T.sibling
                      ), B = o(
                        T,
                        X.children || []
                      ), B.return = b, b = B;
                      break t;
                    } else {
                      a(b, T);
                      break;
                    }
                  else e(b, T);
                  T = T.sibling;
                }
                B = ho(
                  X,
                  b.mode,
                  B
                ), B.return = b, b = B;
              }
              return d(b);
            case Vl:
              return X = Hl(A._debugInfo), A = bc(A), b = Et(
                b,
                T,
                A,
                B
              ), Ht = X, b;
          }
          if (le(A))
            return J(
              b,
              T,
              A,
              B
            );
          if (Q(A)) {
            if (X = A, A = Q(X), typeof A != "function")
              throw Error(
                "An object is not an iterable. This error is likely caused by a bug in React. Please file an issue."
              );
            return ot = A.call(X), ot === X ? (b.tag !== 0 || Object.prototype.toString.call(b.type) !== "[object GeneratorFunction]" || Object.prototype.toString.call(ot) !== "[object Generator]") && (NT || console.error(
              "Using Iterators as children is unsupported and will likely yield unexpected results because enumerating a generator mutates it. You may convert it to an array with `Array.from()` or the `[...spread]` operator before rendering. You can also use an Iterable that can iterate multiple times over the same items."
            ), NT = !0) : X.entries !== A || n2 || (console.error(
              "Using Maps as children is not supported. Use an array of keyed ReactElements instead."
            ), n2 = !0), et(
              b,
              T,
              ot,
              B
            );
          }
          if (typeof A.then == "function")
            return X = Hl(A._debugInfo), b = Et(
              b,
              T,
              ta(A),
              B
            ), Ht = X, b;
          if (A.$$typeof === Sn)
            return Et(
              b,
              T,
              Sr(b, A),
              B
            );
          go(b, A);
        }
        return typeof A == "string" && A !== "" || typeof A == "number" || typeof A == "bigint" ? (X = "" + A, T !== null && T.tag === 6 ? (a(
          b,
          T.sibling
        ), B = o(T, X), B.return = b, b = B) : (a(b, T), B = Mh(
          X,
          b.mode,
          B
        ), B.return = b, B._debugOwner = b, B._debugTask = b._debugTask, B._debugInfo = Ht, b = B), d(b)) : (typeof A == "function" && ea(b, A), typeof A == "symbol" && wn(b, A), a(b, T));
      }
      return function(b, T, A, B) {
        var X = Ht;
        Ht = null;
        try {
          jg = 0;
          var ot = Et(
            b,
            T,
            A,
            B
          );
          return Nm = null, ot;
        } catch (xe) {
          if (xe === Um || xe === yS) throw xe;
          var lt = Ot(29, xe, null, b.mode);
          lt.lanes = B, lt.return = b;
          var Tt = lt._debugInfo = Ht;
          if (lt._debugOwner = b._debugOwner, lt._debugTask = b._debugTask, Tt != null) {
            for (var Rt = Tt.length - 1; 0 <= Rt; Rt--)
              if (typeof Tt[Rt].stack == "string") {
                lt._debugOwner = Tt[Rt], lt._debugTask = Tt[Rt].debugTask;
                break;
              }
          }
          return lt;
        } finally {
          Ht = X;
        }
      };
    }
    function Qn(t, e) {
      var a = le(t);
      return t = !a && typeof Q(t) == "function", a || t ? (a = a ? "array" : "iterable", console.error(
        "A nested %s was passed to row #%s in <SuspenseList />. Wrap it in an additional SuspenseList to configure its revealOrder: <SuspenseList revealOrder=...> ... <SuspenseList revealOrder=...>{%s}</SuspenseList> ... </SuspenseList>",
        a,
        e,
        a
      ), !1) : !0;
    }
    function Zn(t) {
      t.updateQueue = {
        baseState: t.memoizedState,
        firstBaseUpdate: null,
        lastBaseUpdate: null,
        shared: { pending: null, lanes: 0, hiddenCallbacks: null },
        callbacks: null
      };
    }
    function jh(t, e) {
      t = t.updateQueue, e.updateQueue === t && (e.updateQueue = {
        baseState: t.baseState,
        firstBaseUpdate: t.firstBaseUpdate,
        lastBaseUpdate: t.lastBaseUpdate,
        shared: t.shared,
        callbacks: null
      });
    }
    function Ln(t) {
      return {
        lane: t,
        tag: qT,
        payload: null,
        callback: null,
        next: null
      };
    }
    function Nu(t, e, a) {
      var c = t.updateQueue;
      if (c === null) return null;
      if (c = c.shared, c2 === c && !jT) {
        var o = tt(t);
        console.error(
          `An update (setState, replaceState, or forceUpdate) was scheduled from inside an update function. Update functions should be pure, with zero side-effects. Consider using componentDidUpdate or a callback.

Please update the following component: %s`,
          o
        ), jT = !0;
      }
      return (Zt & Dl) !== Jl ? (o = c.pending, o === null ? e.next = e : (e.next = o.next, o.next = e), c.pending = e, e = _f(t), H1(t, null, a), e) : (Dh(t, c, e, a), _f(t));
    }
    function Gf(t, e, a) {
      if (e = e.updateQueue, e !== null && (e = e.shared, (a & 4194048) !== 0)) {
        var c = e.lanes;
        c &= t.pendingLanes, a |= c, e.lanes = a, er(t, a);
      }
    }
    function Ge(t, e) {
      var a = t.updateQueue, c = t.alternate;
      if (c !== null && (c = c.updateQueue, a === c)) {
        var o = null, f = null;
        if (a = a.firstBaseUpdate, a !== null) {
          do {
            var d = {
              lane: a.lane,
              tag: a.tag,
              payload: a.payload,
              callback: null,
              next: null
            };
            f === null ? o = f = d : f = f.next = d, a = a.next;
          } while (a !== null);
          f === null ? o = f = e : f = f.next = e;
        } else o = f = e;
        a = {
          baseState: c.baseState,
          firstBaseUpdate: o,
          lastBaseUpdate: f,
          shared: c.shared,
          callbacks: c.callbacks
        }, t.updateQueue = a;
        return;
      }
      t = a.lastBaseUpdate, t === null ? a.firstBaseUpdate = e : t.next = e, a.lastBaseUpdate = e;
    }
    function kt() {
      if (i2) {
        var t = _m;
        if (t !== null) throw t;
      }
    }
    function vt(t, e, a, c) {
      i2 = !1;
      var o = t.updateQueue;
      Vs = !1, c2 = o.shared;
      var f = o.firstBaseUpdate, d = o.lastBaseUpdate, h = o.shared.pending;
      if (h !== null) {
        o.shared.pending = null;
        var y = h, v = y.next;
        y.next = null, d === null ? f = v : d.next = v, d = y;
        var p = t.alternate;
        p !== null && (p = p.updateQueue, h = p.lastBaseUpdate, h !== d && (h === null ? p.firstBaseUpdate = v : h.next = v, p.lastBaseUpdate = y));
      }
      if (f !== null) {
        var z = o.baseState;
        d = 0, p = v = y = null, h = f;
        do {
          var E = h.lane & -536870913, M = E !== h.lane;
          if (M ? (St & E) === E : (c & E) === E) {
            E !== 0 && E === Gs && (i2 = !0), p !== null && (p = p.next = {
              lane: 0,
              tag: h.tag,
              payload: h.payload,
              callback: null,
              next: null
            });
            t: {
              E = t;
              var j = h, J = e, et = a;
              switch (j.tag) {
                case GT:
                  if (j = j.payload, typeof j == "function") {
                    Rm = !0;
                    var Et = j.call(
                      et,
                      z,
                      J
                    );
                    if (E.mode & Ba) {
                      he(!0);
                      try {
                        j.call(et, z, J);
                      } finally {
                        he(!1);
                      }
                    }
                    Rm = !1, z = Et;
                    break t;
                  }
                  z = j;
                  break t;
                case u2:
                  E.flags = E.flags & -65537 | 128;
                case qT:
                  if (Et = j.payload, typeof Et == "function") {
                    if (Rm = !0, j = Et.call(
                      et,
                      z,
                      J
                    ), E.mode & Ba) {
                      he(!0);
                      try {
                        Et.call(et, z, J);
                      } finally {
                        he(!1);
                      }
                    }
                    Rm = !1;
                  } else j = Et;
                  if (j == null) break t;
                  z = pt({}, z, j);
                  break t;
                case VT:
                  Vs = !0;
              }
            }
            E = h.callback, E !== null && (t.flags |= 64, M && (t.flags |= 8192), M = o.callbacks, M === null ? o.callbacks = [E] : M.push(E));
          } else
            M = {
              lane: E,
              tag: h.tag,
              payload: h.payload,
              callback: h.callback,
              next: null
            }, p === null ? (v = p = M, y = z) : p = p.next = M, d |= E;
          if (h = h.next, h === null) {
            if (h = o.shared.pending, h === null)
              break;
            M = h, h = M.next, M.next = null, o.lastBaseUpdate = M, o.shared.pending = null;
          }
        } while (!0);
        p === null && (y = z), o.baseState = y, o.firstBaseUpdate = v, o.lastBaseUpdate = p, f === null && (o.shared.lanes = 0), Xs |= d, t.lanes = d, t.memoizedState = z;
      }
      c2 = null;
    }
    function Tc(t, e) {
      if (typeof t != "function")
        throw Error(
          "Invalid argument passed as callback. Expected a function. Instead received: " + t
        );
      t.call(e);
    }
    function fn(t, e) {
      var a = t.shared.hiddenCallbacks;
      if (a !== null)
        for (t.shared.hiddenCallbacks = null, t = 0; t < a.length; t++)
          Tc(a[t], e);
    }
    function wh(t, e) {
      var a = t.callbacks;
      if (a !== null)
        for (t.callbacks = null, t = 0; t < a.length; t++)
          Tc(a[t], e);
    }
    function Ec(t, e) {
      var a = $i;
      yt(pS, a, t), yt(js, e, t), $i = a | e.baseLanes;
    }
    function Xh(t) {
      yt(pS, $i, t), yt(
        js,
        js.current,
        t
      );
    }
    function Vf(t) {
      $i = pS.current, de(js, t), de(pS, t);
    }
    function Fa(t) {
      var e = t.alternate;
      yt(
        ha,
        ha.current & Hm,
        t
      ), yt(da, t, t), xa === null && (e === null || js.current !== null || e.memoizedState !== null) && (xa = t);
    }
    function zc(t) {
      yt(ha, ha.current, t), yt(da, t, t), xa === null && (xa = t);
    }
    function Qh(t) {
      t.tag === 22 ? (yt(ha, ha.current, t), yt(da, t, t), xa === null && (xa = t)) : sn(t);
    }
    function sn(t) {
      yt(ha, ha.current, t), yt(
        da,
        da.current,
        t
      );
    }
    function la(t) {
      de(da, t), xa === t && (xa = null), de(ha, t);
    }
    function Jn(t, e) {
      yt(
        da,
        da.current,
        t
      ), yt(ha, e, t);
    }
    function Kn(t) {
      de(ha, t), de(da, t), xa === t && (xa = null);
    }
    function $n(t) {
      for (var e = t; e !== null; ) {
        if (e.tag === 13) {
          var a = e.memoizedState;
          if (a !== null && (a = a.dehydrated, a === null || I0(a) || k0(a)))
            return e;
        } else if (e.tag === 19 && e.memoizedProps.revealOrder !== "independent") {
          if ((e.flags & 128) !== 0) return e;
        } else if (e.child !== null) {
          e.child.return = e, e = e.child;
          continue;
        }
        if (e === t) break;
        for (; e.sibling === null; ) {
          if (e.return === null || e.return === t) return null;
          e = e.return;
        }
        e.sibling.return = e.return, e = e.sibling;
      }
      return null;
    }
    function st() {
      var t = H;
      lc === null ? lc = [t] : lc.push(t);
    }
    function w() {
      var t = H;
      if (lc !== null && (rf++, lc[rf] !== t)) {
        var e = tt(ht);
        if (!wT.has(e) && (wT.add(e), lc !== null)) {
          for (var a = "", c = 0; c <= rf; c++) {
            var o = lc[c], f = c === rf ? t : o;
            for (o = c + 1 + ". " + o; 30 > o.length; )
              o += " ";
            o += f + `
`, a += o;
          }
          console.error(
            `React has detected a change in the order of Hooks called by %s. This will lead to bugs and errors if not fixed. For more information, read the Rules of Hooks: https://react.dev/link/rules-of-hooks

   Previous render            Next render
   ------------------------------------------------------
%s   ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
`,
            e,
            a
          );
        }
      }
    }
    function gi(t) {
      t == null || le(t) || console.error(
        "%s received a final argument that is not an array (instead, received `%s`). When specified, the final argument must be an array.",
        H,
        typeof t
      );
    }
    function Hu() {
      var t = tt(ht);
      QT.has(t) || (QT.add(t), console.error(
        "ReactDOM.useFormState has been renamed to React.useActionState. Please update %s to use React.useActionState.",
        t
      ));
    }
    function ve() {
      throw Error(
        `Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:
1. You might have mismatching versions of React and the renderer (such as React DOM)
2. You might be breaking the Rules of Hooks
3. You might have more than one copy of React in the same app
See https://react.dev/link/invalid-hook-call for tips about how to debug and fix this problem.`
      );
    }
    function Ac(t, e) {
      if (Zg) return !1;
      if (e === null)
        return console.error(
          "%s received a final argument during this render, but not during the previous render. Even though the final argument is optional, its type cannot change between renders.",
          H
        ), !1;
      t.length !== e.length && console.error(
        `The final argument passed to %s changed size between renders. The order and size of this array must remain constant.

Previous: %s
Incoming: %s`,
        H,
        "[" + e.join(", ") + "]",
        "[" + t.join(", ") + "]"
      );
      for (var a = 0; a < e.length && a < t.length; a++)
        if (!tn(t[a], e[a])) return !1;
      return !0;
    }
    function ke(t, e, a, c, o, f) {
      sf = f, ht = e, lc = t !== null ? t._debugHookTypes : null, rf = -1, Zg = t !== null && t.type !== e.type, (Object.prototype.toString.call(a) === "[object AsyncFunction]" || Object.prototype.toString.call(a) === "[object AsyncGeneratorFunction]") && (f = tt(ht), o2.has(f) || (o2.add(f), console.error(
        "%s is an async Client Component. Only Server Components can be async at the moment. This error is often caused by accidentally adding `'use client'` to a module that was originally written for the server.",
        f === null ? "An unknown Component" : "<" + f + ">"
      ))), e.memoizedState = null, e.updateQueue = null, e.lanes = 0, x.H = t !== null && t.memoizedState !== null ? s2 : lc !== null ? ZT : f2, Kd = f = (e.mode & Ba) !== rt;
      var d = t2(a, c, o);
      if (Kd = !1, xm && (d = Zh(
        e,
        a,
        c,
        o
      )), f) {
        he(!0);
        try {
          d = Zh(
            e,
            a,
            c,
            o
          );
        } finally {
          he(!1);
        }
      }
      return Or(t, e), d;
    }
    function Or(t, e) {
      e._debugHookTypes = lc, e.dependencies === null ? Qi !== null && (e.dependencies = {
        lanes: 0,
        firstContext: null,
        _debugThenableState: Qi
      }) : e.dependencies._debugThenableState = Qi;
      var a = Qi;
      if (Zd !== null && Vh(Zd, e) && (a !== null || gS === null || a2 || (a2 = !0, console.error(gS)), gS = Zd = null), x.H = TS, a = me !== null && me.next !== null, sf = 0, lc = H = rl = me = ht = null, rf = -1, t !== null && (t.flags & 1206910976) !== (e.flags & 1206910976) && console.error(
        "Internal React error: Expected static flag was missing. Please notify the React team."
      ), SS = !1, Qg = 0, Qi = null, a)
        throw Error(
          "Rendered fewer hooks than expected. This may be caused by an accidental early return statement."
        );
      t === null || nl || (t = t.dependencies, t !== null && Hf(t) && (nl = !0)), Vg ? (Vg = !1, t = !0) : t = !1, t && (e = tt(e) || "Unknown", XT.has(e) || o2.has(e) || (XT.add(e), console.error(
        "`use` was called from inside a try/catch block. This is not allowed and can lead to unexpected behavior. To handle errors triggered by `use`, wrap your component in a error boundary."
      )));
    }
    function Zh(t, e, a, c) {
      ht = t;
      var o = 0;
      do {
        if (xm && (Qi = null), Qg = 0, xm = !1, o >= n4)
          throw Error(
            "Too many re-renders. React limits the number of renders to prevent an infinite loop."
          );
        if (o += 1, Zg = !1, rl = me = null, t.updateQueue != null) {
          var f = t.updateQueue;
          f.lastEffect = null, f.events = null, f.stores = null, f.memoCache != null && (f.memoCache.index = 0);
        }
        rf = -1, x.H = LT, f = t2(e, a, c);
      } while (xm);
      return f;
    }
    function ob() {
      var t = x.H, e = t.useState()[0];
      return e = typeof e.then == "function" ? Oc(e) : e, t = t.useState()[0], (me !== null ? me.memoizedState : null) !== t && (ht.flags |= 1024), e;
    }
    function Ry() {
      var t = bS !== 0;
      return bS = 0, t;
    }
    function My(t, e, a) {
      e.updateQueue = t.updateQueue, e.flags = (e.mode & Zc) !== rt ? e.flags & -805308421 : e.flags & -2053, t.lanes &= ~a;
    }
    function Ce(t) {
      if (SS) {
        for (t = t.memoizedState; t !== null; ) {
          var e = t.queue;
          e !== null && (e.pending = null), t = t.next;
        }
        SS = !1;
      }
      sf = 0, lc = rl = me = ht = null, rf = -1, H = null, xm = !1, Qg = bS = 0, Qi = null;
    }
    function bl() {
      var t = {
        memoizedState: null,
        baseState: null,
        baseQueue: null,
        queue: null,
        next: null
      };
      return rl === null ? ht.memoizedState = rl = t : rl = rl.next = t, rl;
    }
    function jt() {
      if (me === null) {
        var t = ht.alternate;
        t = t !== null ? t.memoizedState : null;
      } else t = me.next;
      var e = rl === null ? ht.memoizedState : rl.next;
      if (e !== null)
        rl = e, me = t;
      else {
        if (t === null)
          throw ht.alternate === null ? Error(
            "Update hook called on initial render. This is likely a bug in React. Please file an issue."
          ) : Error("Rendered more hooks than during the previous render.");
        me = t, t = {
          memoizedState: me.memoizedState,
          baseState: me.baseState,
          baseQueue: me.baseQueue,
          queue: me.queue,
          next: null
        }, rl === null ? ht.memoizedState = rl = t : rl = rl.next = t;
      }
      return rl;
    }
    function Dr() {
      return { lastEffect: null, events: null, stores: null, memoCache: null };
    }
    function Oc(t) {
      var e = Qg;
      return Qg += 1, Qi === null && (Qi = Pl()), t = Uu(
        Qi,
        t,
        e,
        ht
      ), e = ht, (rl === null ? e.memoizedState : rl.next) === null && (e = e.alternate, x.H = e !== null && e.memoizedState !== null ? s2 : f2), t;
    }
    function pi(t) {
      if (t !== null && typeof t == "object") {
        if (typeof t.then == "function") return Oc(t);
        if (t.$$typeof === Qp) return;
        if (t.$$typeof === Sn) return se(t);
      }
      throw Error("An unsupported type was passed to use(): " + String(t));
    }
    function Fn(t) {
      var e = null, a = ht.updateQueue;
      if (a !== null && (e = a.memoCache), e == null) {
        var c = ht.alternate;
        c !== null && (c = c.updateQueue, c !== null && (c = c.memoCache, c != null && (e = {
          data: c.data.map(function(o) {
            return o.slice();
          }),
          index: 0
        })));
      }
      if (e == null && (e = { data: [], index: 0 }), a === null && (a = Dr(), ht.updateQueue = a), a.memoCache = e, a = e.data[e.index], a === void 0 || Zg)
        for (a = e.data[e.index] = Array(t), c = 0; c < t; c++)
          a[c] = Eb;
      else
        a.length !== t && console.error(
          "Expected a constant size argument for each invocation of useMemoCache. The previous cache was allocated with size %s but size %s was requested.",
          a.length,
          t
        );
      return e.index++, a;
    }
    function Wa(t, e) {
      return typeof e == "function" ? e(t) : e;
    }
    function Dc(t, e, a) {
      var c = bl();
      if (a !== void 0) {
        var o = a(e);
        if (Kd) {
          he(!0);
          try {
            a(e);
          } finally {
            he(!1);
          }
        }
      } else o = e;
      return c.memoizedState = c.baseState = o, t = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: t,
        lastRenderedState: o
      }, c.queue = t, t = t.dispatch = zo.bind(
        null,
        ht,
        t
      ), [c.memoizedState, t];
    }
    function Wn(t) {
      var e = jt();
      return _y(e, me, t);
    }
    function _y(t, e, a) {
      var c = t.queue;
      if (c === null)
        throw Error(
          "Should have a queue. You are likely calling Hooks conditionally, which is not allowed. (https://react.dev/link/invalid-hook-call)"
        );
      c.lastRenderedReducer = a;
      var o = t.baseQueue, f = c.pending;
      if (f !== null) {
        if (o !== null) {
          var d = o.next;
          o.next = f.next, f.next = d;
        }
        e.baseQueue !== o && console.error(
          "Internal error: Expected work-in-progress queue to be a clone. This is a bug in React."
        ), e.baseQueue = o = f, c.pending = null;
      }
      if (f = t.baseState, o === null) t.memoizedState = f;
      else {
        e = o.next;
        var h = d = null, y = null, v = e, p = !1;
        do {
          var z = v.lane & -536870913;
          if (z !== v.lane ? (St & z) === z : (sf & z) === z) {
            var E = v.revertLane;
            if (E === 0)
              y !== null && (y = y.next = {
                lane: 0,
                revertLane: 0,
                gesture: null,
                action: v.action,
                hasEagerState: v.hasEagerState,
                eagerState: v.eagerState,
                next: null
              }), z === Gs && (p = !0);
            else if ((sf & E) === E) {
              v = v.next, E === Gs && (p = !0);
              continue;
            } else
              z = {
                lane: 0,
                revertLane: v.revertLane,
                gesture: null,
                action: v.action,
                hasEagerState: v.hasEagerState,
                eagerState: v.eagerState,
                next: null
              }, y === null ? (h = y = z, d = f) : y = y.next = z, ht.lanes |= E, Xs |= E;
            z = v.action, Kd && a(f, z), f = v.hasEagerState ? v.eagerState : a(f, z);
          } else
            E = {
              lane: z,
              revertLane: v.revertLane,
              gesture: v.gesture,
              action: v.action,
              hasEagerState: v.hasEagerState,
              eagerState: v.eagerState,
              next: null
            }, y === null ? (h = y = E, d = f) : y = y.next = E, ht.lanes |= z, Xs |= z;
          v = v.next;
        } while (v !== null && v !== e);
        if (y === null ? d = f : y.next = h, !tn(f, t.memoizedState) && (nl = !0, p && (a = _m, a !== null)))
          throw a;
        t.memoizedState = f, t.baseState = d, t.baseQueue = y, c.lastRenderedState = f;
      }
      return o === null && (c.lanes = 0), [t.memoizedState, c.dispatch];
    }
    function jf(t) {
      var e = jt(), a = e.queue;
      if (a === null)
        throw Error(
          "Should have a queue. You are likely calling Hooks conditionally, which is not allowed. (https://react.dev/link/invalid-hook-call)"
        );
      a.lastRenderedReducer = t;
      var c = a.dispatch, o = a.pending, f = e.memoizedState;
      if (o !== null) {
        a.pending = null;
        var d = o = o.next;
        do
          f = t(f, d.action), d = d.next;
        while (d !== o);
        tn(f, e.memoizedState) || (nl = !0), e.memoizedState = f, e.baseQueue === null && (e.baseState = f), a.lastRenderedState = f;
      }
      return [f, c];
    }
    function Uy(t, e, a) {
      var c = ht, o = bl();
      if (At) {
        if (a === void 0)
          throw Error(
            "Missing getServerSnapshot, which is required for server-rendered content. Will revert to client rendering."
          );
        var f = a();
        Bm || f === a() || (console.error(
          "The result of getServerSnapshot should be cached to avoid an infinite loop"
        ), Bm = !0);
      } else {
        if (f = e(), Bm || (a = e(), tn(f, a) || (console.error(
          "The result of getSnapshot should be cached to avoid an infinite loop"
        ), Bm = !0)), ye === null)
          throw Error(
            "Expected a work-in-progress root. This is a bug in React. Please file an issue."
          );
        (St & 127) !== 0 || Si(c, e, f);
      }
      return o.memoizedState = f, a = { value: f, getSnapshot: e }, o.queue = a, zi(
        Rr.bind(null, c, a, t),
        [t]
      ), c.flags |= 2048, Ei(
        ec | Ya,
        { destroy: void 0 },
        Lh.bind(
          null,
          c,
          a,
          f,
          e
        ),
        null
      ), f;
    }
    function Cr(t, e, a) {
      var c = ht, o = jt(), f = At;
      if (f) {
        if (a === void 0)
          throw Error(
            "Missing getServerSnapshot, which is required for server-rendered content. Will revert to client rendering."
          );
        a = a();
      } else if (a = e(), !Bm) {
        var d = e();
        tn(a, d) || (console.error(
          "The result of getSnapshot should be cached to avoid an infinite loop"
        ), Bm = !0);
      }
      (d = !tn(
        (me || o).memoizedState,
        a
      )) && (o.memoizedState = a, nl = !0), o = o.queue;
      var h = Rr.bind(null, c, o, t);
      if (Ve(2048, Ya, h, [t]), t = o.getSnapshot !== e || d || rl !== null && (rl.memoizedState.tag & ec) !== Xg, Ei(
        t ? ec | Ya : Ya,
        { destroy: void 0 },
        Lh.bind(
          null,
          c,
          o,
          a,
          e
        ),
        null
      ), t) {
        if (c.flags |= 2048, ye === null)
          throw Error(
            "Expected a work-in-progress root. This is a bug in React. Please file an issue."
          );
        f || (sf & 127) !== 0 || Si(c, e, a);
      }
      return a;
    }
    function Si(t, e, a) {
      t.flags |= 16384, t = { getSnapshot: e, value: a }, e = ht.updateQueue, e === null ? (e = Dr(), ht.updateQueue = e, e.stores = [t]) : (a = e.stores, a === null ? e.stores = [t] : a.push(t));
    }
    function Lh(t, e, a, c) {
      e.value = a, e.getSnapshot = c, Ny(e) && po(t);
    }
    function Rr(t, e, a) {
      return a(function() {
        Ny(e) && (Gn(2, "updateSyncExternalStore()", t), po(t));
      });
    }
    function Ny(t) {
      var e = t.getSnapshot;
      t = t.value;
      try {
        var a = e();
        return !tn(t, a);
      } catch {
        return !0;
      }
    }
    function po(t) {
      var e = Nl(t, 2);
      e !== null && ge(e, t, 2);
    }
    function Mr(t) {
      var e = bl();
      if (typeof t == "function") {
        var a = t;
        if (t = a(), Kd) {
          he(!0);
          try {
            a();
          } finally {
            he(!1);
          }
        }
      }
      return e.memoizedState = e.baseState = t, e.queue = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: Wa,
        lastRenderedState: t
      }, e;
    }
    function wf(t) {
      t = Mr(t);
      var e = t.queue, a = qr.bind(null, ht, e);
      return e.dispatch = a, [t.memoizedState, a];
    }
    function Xf(t) {
      var e = bl();
      e.memoizedState = e.baseState = t;
      var a = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: null,
        lastRenderedState: null
      };
      return e.queue = a, e = Oi.bind(
        null,
        ht,
        !0,
        a
      ), a.dispatch = e, [t, e];
    }
    function Hy(t, e) {
      var a = jt();
      return By(a, me, t, e);
    }
    function By(t, e, a, c) {
      return t.baseState = a, _y(
        t,
        me,
        typeof c == "function" ? c : Wa
      );
    }
    function bi(t, e) {
      var a = jt();
      return me !== null ? By(a, me, t, e) : (a.baseState = t, [t, a.queue.dispatch]);
    }
    function So(t, e, a, c, o) {
      if ($h(t))
        throw Error("Cannot update action state while rendering.");
      if (t = e.action, t !== null) {
        var f = {
          payload: o,
          action: t,
          next: null,
          isTransition: !0,
          status: "pending",
          value: null,
          reason: null,
          listeners: [],
          then: function(d) {
            f.listeners.push(d);
          }
        };
        x.T !== null ? a(!0) : f.isTransition = !1, c(f), a = e.pending, a === null ? (f.next = e.pending = f, xy(e, f)) : (f.next = a.next, e.pending = a.next = f);
      }
    }
    function xy(t, e) {
      var a = e.action, c = e.payload, o = t.state;
      if (e.isTransition) {
        var f = x.T, d = {};
        d.types = f !== null ? f.types : null, d._updatedFibers = /* @__PURE__ */ new Set(), x.T = d;
        try {
          var h = a(o, c), y = x.S;
          y !== null && y(d, h), Yy(t, e, h);
        } catch (v) {
          To(t, e, v);
        } finally {
          f !== null && d.types !== null && (f.types !== null && f.types !== d.types && console.error(
            "We expected inner Transitions to have transferred the outer types set and that you cannot add to the outer Transition while inside the inner.This is a bug in React."
          ), f.types = d.types), x.T = f, f === null && d._updatedFibers && (t = d._updatedFibers.size, d._updatedFibers.clear(), 10 < t && console.warn(
            "Detected a large number of updates inside startTransition. If this is due to a subscription please re-write it to use React provided hooks. Otherwise concurrent mode guarantees are off the table."
          ));
        }
      } else
        try {
          d = a(o, c), Yy(t, e, d);
        } catch (v) {
          To(t, e, v);
        }
    }
    function Yy(t, e, a) {
      a !== null && typeof a == "object" && typeof a.then == "function" ? (x.asyncTransitions++, a.then(Pn, Pn), a.then(
        function(c) {
          bo(t, e, c);
        },
        function(c) {
          return To(t, e, c);
        }
      ), e.isTransition || console.error(
        "An async function with useActionState was called outside of a transition. This is likely not what you intended (for example, isPending will not update correctly). Either call the returned function inside startTransition, or pass it to an `action` or `formAction` prop."
      )) : bo(t, e, a);
    }
    function bo(t, e, a) {
      e.status = "fulfilled", e.value = a, _r(e), t.state = a, e = t.pending, e !== null && (a = e.next, a === e ? t.pending = null : (a = a.next, e.next = a, xy(t, a)));
    }
    function To(t, e, a) {
      var c = t.pending;
      if (t.pending = null, c !== null) {
        c = c.next;
        do
          e.status = "rejected", e.reason = a, _r(e), e = e.next;
        while (e !== c);
      }
      t.action = null;
    }
    function _r(t) {
      t = t.listeners;
      for (var e = 0; e < t.length; e++) (0, t[e])();
    }
    function Cc(t, e) {
      return e;
    }
    function Rc(t, e) {
      if (At) {
        var a = ye.formState;
        if (a !== null) {
          t: {
            var c = ht;
            if (At) {
              if (pe) {
                e: {
                  for (var o = pe, f = Pu; o.nodeType !== 8; ) {
                    if (!f) {
                      o = null;
                      break e;
                    }
                    if (o = _a(
                      o.nextSibling
                    ), o === null) {
                      o = null;
                      break e;
                    }
                  }
                  f = o.data, o = f === x2 || f === M3 ? o : null;
                }
                if (o) {
                  pe = _a(
                    o.nextSibling
                  ), c = o.data === x2;
                  break t;
                }
              }
              si(c);
            }
            c = !1;
          }
          c && (e = a[0]);
        }
      }
      return a = bl(), a.memoizedState = a.baseState = e, c = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: Cc,
        lastRenderedState: e
      }, a.queue = c, a = qr.bind(
        null,
        ht,
        c
      ), c.dispatch = a, c = Mr(!1), f = Oi.bind(
        null,
        ht,
        !1,
        c.queue
      ), c = bl(), o = {
        state: e,
        dispatch: null,
        action: t,
        pending: null
      }, c.queue = o, a = So.bind(
        null,
        ht,
        o,
        f,
        a
      ), o.dispatch = a, c.memoizedState = t, [e, a, !1];
    }
    function Ur(t) {
      var e = jt();
      return Ti(e, me, t);
    }
    function Ti(t, e, a) {
      if (e = _y(
        t,
        e,
        Cc
      )[0], t = Wn(Wa)[0], typeof e == "object" && e !== null && typeof e.then == "function")
        try {
          var c = Oc(e);
        } catch (d) {
          throw d === Um ? yS : d;
        }
      else c = e;
      e = jt();
      var o = e.queue, f = o.dispatch;
      return a !== e.memoizedState && (ht.flags |= 2048, Ei(
        ec | Ya,
        { destroy: void 0 },
        w1.bind(null, o, a),
        null
      )), [c, f, t];
    }
    function w1(t, e) {
      t.action = e;
    }
    function In(t) {
      var e = jt(), a = me;
      if (a !== null)
        return Ti(e, a, t);
      jt(), e = e.memoizedState, a = jt();
      var c = a.queue.dispatch;
      return a.memoizedState = t, [e, c, !1];
    }
    function Ei(t, e, a, c) {
      return t = { tag: t, create: a, deps: c, inst: e, next: null }, e = ht.updateQueue, e === null && (e = Dr(), ht.updateQueue = e), a = e.lastEffect, a === null ? e.lastEffect = t.next = t : (c = a.next, a.next = t, t.next = c, e.lastEffect = t), t;
    }
    function Nr(t) {
      var e = bl();
      return t = { current: t }, e.memoizedState = t;
    }
    function Ea(t, e, a, c) {
      var o = bl();
      ht.flags |= t, o.memoizedState = Ei(
        ec | e,
        { destroy: void 0 },
        a,
        c === void 0 ? null : c
      );
    }
    function Ve(t, e, a, c) {
      var o = jt();
      c = c === void 0 ? null : c;
      var f = o.memoizedState.inst;
      me !== null && c !== null && Ac(c, me.memoizedState.deps) ? o.memoizedState = Ei(e, f, a, c) : (ht.flags |= t, o.memoizedState = Ei(
        ec | e,
        f,
        a,
        c
      ));
    }
    function zi(t, e) {
      (ht.mode & Zc) !== rt ? Ea(545261568, Ya, t, e) : Ea(8390656, Ya, t, e);
    }
    function qy(t) {
      ht.flags |= 4;
      var e = ht.updateQueue;
      if (e === null)
        e = Dr(), ht.updateQueue = e, e.events = [t];
      else {
        var a = e.events;
        a === null ? e.events = [t] : a.push(t);
      }
    }
    function Hr(t) {
      var e = bl(), a = { impl: t };
      return e.memoizedState = a, function() {
        if ((Zt & Dl) !== Jl)
          throw Error(
            "A function wrapped in useEffectEvent can't be called during rendering."
          );
        return a.impl.apply(void 0, arguments);
      };
    }
    function Ai(t) {
      var e = jt().memoizedState;
      return qy({ ref: e, nextImpl: t }), function() {
        if ((Zt & Dl) !== Jl)
          throw Error(
            "A function wrapped in useEffectEvent can't be called during rendering."
          );
        return e.impl.apply(void 0, arguments);
      };
    }
    function Eo(t, e) {
      var a = 4194308;
      return (ht.mode & Zc) !== rt && (a |= 268435456), Ea(a, ru, t, e);
    }
    function Gy(t, e) {
      if (typeof e == "function") {
        t = t();
        var a = e(t);
        return function() {
          typeof a == "function" ? a() : e(null);
        };
      }
      if (e != null)
        return e.hasOwnProperty("current") || console.error(
          "Expected useImperativeHandle() first argument to either be a ref callback or React.createRef() object. Instead received: %s.",
          "an object with keys {" + Object.keys(e).join(", ") + "}"
        ), t = t(), e.current = t, function() {
          e.current = null;
        };
    }
    function Jh(t, e, a) {
      typeof e != "function" && console.error(
        "Expected useImperativeHandle() second argument to be a function that creates a handle. Instead received: %s.",
        e !== null ? typeof e : "null"
      ), a = a != null ? a.concat([t]) : null;
      var c = 4194308;
      (ht.mode & Zc) !== rt && (c |= 268435456), Ea(
        c,
        ru,
        Gy.bind(null, e, t),
        a
      );
    }
    function kn(t, e, a) {
      typeof e != "function" && console.error(
        "Expected useImperativeHandle() second argument to be a function that creates a handle. Instead received: %s.",
        e !== null ? typeof e : "null"
      ), a = a != null ? a.concat([t]) : null, Ve(
        4,
        ru,
        Gy.bind(null, e, t),
        a
      );
    }
    function Qf(t, e) {
      return bl().memoizedState = [
        t,
        e === void 0 ? null : e
      ], t;
    }
    function Br(t, e) {
      var a = jt();
      e = e === void 0 ? null : e;
      var c = a.memoizedState;
      return e !== null && Ac(e, c[1]) ? c[0] : (a.memoizedState = [t, e], t);
    }
    function xr(t, e) {
      var a = bl();
      e = e === void 0 ? null : e;
      var c = t();
      if (Kd) {
        he(!0);
        try {
          t();
        } finally {
          he(!1);
        }
      }
      return a.memoizedState = [c, e], c;
    }
    function Zf(t, e) {
      var a = jt();
      e = e === void 0 ? null : e;
      var c = a.memoizedState;
      if (e !== null && Ac(e, c[1]))
        return c[0];
      if (c = t(), Kd) {
        he(!0);
        try {
          t();
        } finally {
          he(!1);
        }
      }
      return a.memoizedState = [c, e], c;
    }
    function Pe(t, e) {
      var a = bl();
      return Yr(a, t, e);
    }
    function Tl(t, e) {
      var a = jt();
      return Vy(
        a,
        me.memoizedState,
        t,
        e
      );
    }
    function Mc(t, e) {
      var a = jt();
      return me === null ? Yr(a, t, e) : Vy(
        a,
        me.memoizedState,
        t,
        e
      );
    }
    function Yr(t, e, a) {
      return a === void 0 || (sf & 1073741824) !== 0 && (St & 261930) === 0 ? t.memoizedState = e : (t.memoizedState = a, t = sv(), ht.lanes |= t, Xs |= t, a);
    }
    function Vy(t, e, a, c) {
      return tn(a, e) ? a : js.current !== null ? (t = Yr(t, a, c), tn(t, e) || (nl = !0), t) : (sf & 106) === 0 || (sf & 1073741824) !== 0 && (St & 261930) === 0 ? (nl = !0, t.memoizedState = a) : (t = sv(), ht.lanes |= t, Xs |= t, e);
    }
    function Pn() {
      x.asyncTransitions--;
    }
    function za(t, e, a, c, o) {
      var f = Gt.p;
      Gt.p = f !== 0 && f < iu ? f : iu;
      var d = x.T, h = {};
      h.types = d !== null ? d.types : null, h._updatedFibers = /* @__PURE__ */ new Set(), x.T = h, Oi(t, !1, e, a);
      try {
        var y = o(), v = x.S;
        if (v !== null && v(h, y), y !== null && typeof y == "object" && typeof y.then == "function") {
          x.asyncTransitions++, y.then(Pn, Pn);
          var p = V1(
            y,
            c
          );
          _c(
            t,
            e,
            p,
            na(t)
          );
        } else
          _c(
            t,
            e,
            c,
            na(t)
          );
      } catch (z) {
        _c(
          t,
          e,
          { then: function() {
          }, status: "rejected", reason: z },
          na(t)
        );
      } finally {
        Gt.p = f, d !== null && h.types !== null && (d.types !== null && d.types !== h.types && console.error(
          "We expected inner Transitions to have transferred the outer types set and that you cannot add to the outer Transition while inside the inner.This is a bug in React."
        ), d.types = h.types), x.T = d, d === null && h._updatedFibers && (t = h._updatedFibers.size, h._updatedFibers.clear(), 10 < t && console.warn(
          "Detected a large number of updates inside startTransition. If this is due to a subscription please re-write it to use React provided hooks. Otherwise concurrent mode guarantees are off the table."
        ));
      }
    }
    function tl(t, e, a, c) {
      if (t.tag !== 5)
        throw Error(
          "Expected the form instance to be a HostComponent. This is a bug in React."
        );
      var o = Lf(t).queue;
      G1(t), za(
        t,
        o,
        e,
        ch,
        a === null ? va : function() {
          return Kh(t), a(c);
        }
      );
    }
    function Lf(t) {
      var e = t.memoizedState;
      if (e !== null) return e;
      e = {
        memoizedState: ch,
        baseState: ch,
        baseQueue: null,
        queue: {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: Wa,
          lastRenderedState: ch
        },
        next: null
      };
      var a = {};
      return e.next = {
        memoizedState: a,
        baseState: a,
        baseQueue: null,
        queue: {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: Wa,
          lastRenderedState: a
        },
        next: null
      }, t.memoizedState = e, t = t.alternate, t !== null && (t.memoizedState = e), e;
    }
    function Kh(t) {
      x.T === null && console.error(
        "requestFormReset was called outside a transition or action. To fix, move to an action, or wrap with startTransition."
      );
      var e = Lf(t);
      e.next === null && (e = t.alternate.memoizedState), _c(
        t,
        e.next.queue,
        {},
        na(t)
      );
    }
    function Jf() {
      var t = Mr(!1);
      return t = za.bind(
        null,
        ht,
        t.queue,
        !0,
        !1
      ), bl().memoizedState = t, [!1, t];
    }
    function Bu() {
      var t = Wn(Wa)[0], e = jt().memoizedState;
      return [
        typeof t == "boolean" ? t : Oc(t),
        e
      ];
    }
    function gt() {
      var t = jf(Wa)[0], e = jt().memoizedState;
      return [
        typeof t == "boolean" ? t : Oc(t),
        e
      ];
    }
    function wt() {
      return se(Wm);
    }
    function Re() {
      var t = bl(), e = ye.identifierPrefix;
      if (At) {
        var a = uf, c = nf;
        a = (c & ~(1 << 32 - $e(c) - 1)).toString(32) + a, e = "_" + e + "R_" + a, a = bS++, 0 < a && (e += "H" + a.toString(32)), e += "_";
      } else
        a = a4++, e = "_" + e + "r_" + a.toString(32) + "_";
      return t.memoizedState = e;
    }
    function Kf() {
      return bl().memoizedState = $f.bind(
        null,
        ht
      );
    }
    function $f(t, e) {
      for (var a = t.return; a !== null; ) {
        switch (a.tag) {
          case 24:
          case 3:
            var c = na(a), o = Ln(c), f = Nu(a, o, c);
            f !== null && (Gn(c, "refresh()", t), ge(f, a, c), Gf(f, a, c)), t = di(), e != null && f !== null && console.error(
              "The seed argument is not enabled outside experimental channels."
            ), o.payload = { cache: t };
            return;
        }
        a = a.return;
      }
    }
    function zo(t, e, a) {
      var c = arguments;
      typeof c[3] == "function" && console.error(
        "State updates from the useState() and useReducer() Hooks don't support the second callback argument. To execute a side effect after rendering, declare it in the component body with useEffect()."
      ), c = na(t);
      var o = {
        lane: c,
        revertLane: 0,
        gesture: null,
        action: a,
        hasEagerState: !1,
        eagerState: null,
        next: null
      };
      $h(t) ? Te(e, o) : (o = by(t, e, o, c), o !== null && (Gn(c, "dispatch()", t), ge(o, t, c), Fh(o, e, c)));
    }
    function qr(t, e, a) {
      var c = arguments;
      typeof c[3] == "function" && console.error(
        "State updates from the useState() and useReducer() Hooks don't support the second callback argument. To execute a side effect after rendering, declare it in the component body with useEffect()."
      ), c = na(t), _c(t, e, a, c) && Gn(c, "setState()", t);
    }
    function _c(t, e, a, c) {
      var o = {
        lane: c,
        revertLane: 0,
        gesture: null,
        action: a,
        hasEagerState: !1,
        eagerState: null,
        next: null
      };
      if ($h(t)) Te(e, o);
      else {
        var f = t.alternate;
        if (t.lanes === 0 && (f === null || f.lanes === 0) && (f = e.lastRenderedReducer, f !== null)) {
          var d = x.H;
          x.H = $c;
          try {
            var h = e.lastRenderedState, y = f(h, a);
            if (o.hasEagerState = !0, o.eagerState = y, tn(y, h))
              return Dh(t, e, o, 0), ye === null && Oh(), !1;
          } catch {
          } finally {
            x.H = d;
          }
        }
        if (a = by(t, e, o, c), a !== null)
          return ge(a, t, c), Fh(a, e, c), !0;
      }
      return !1;
    }
    function Oi(t, e, a, c) {
      if (x.T === null && Gs === 0 && console.error(
        "An optimistic state update occurred outside a transition or action. To fix, move the update to an action, or wrap with startTransition."
      ), c = {
        lane: 2,
        revertLane: _i(),
        gesture: null,
        action: c,
        hasEagerState: !1,
        eagerState: null,
        next: null
      }, $h(t)) {
        if (e)
          throw Error("Cannot update optimistic state while rendering.");
        console.error("Cannot call startTransition while rendering.");
      } else
        e = by(
          t,
          a,
          c,
          2
        ), e !== null && (Gn(2, "setOptimistic()", t), ge(e, t, 2));
    }
    function $h(t) {
      var e = t.alternate;
      return t === ht || e !== null && e === ht;
    }
    function Te(t, e) {
      xm = SS = !0;
      var a = t.pending;
      a === null ? e.next = e : (e.next = a.next, a.next = e), t.pending = e;
    }
    function Fh(t, e, a) {
      if ((a & 4194048) !== 0) {
        var c = e.lanes;
        c &= t.pendingLanes, a |= c, e.lanes = a, er(t, a);
      }
    }
    function Gr(t) {
      if (t !== null && typeof t != "function") {
        var e = String(t);
        l3.has(e) || (l3.add(e), console.error(
          "Expected the last optional `callback` argument to be a function. Instead received: %s.",
          t
        ));
      }
    }
    function Wh(t, e, a, c) {
      var o = t.memoizedState, f = a(c, o);
      if (t.mode & Ba) {
        he(!0);
        try {
          f = a(c, o);
        } finally {
          he(!1);
        }
      }
      f === void 0 && (e = P(e) || "Component", kT.has(e) || (kT.add(e), console.error(
        "%s.getDerivedStateFromProps(): A valid state object (or null) must be returned. You have returned undefined.",
        e
      ))), o = f == null ? o : pt({}, o, f), t.memoizedState = o, t.lanes === 0 && (t.updateQueue.baseState = o);
    }
    function jy(t, e, a, c, o, f, d) {
      var h = t.stateNode;
      if (typeof h.shouldComponentUpdate == "function") {
        if (a = h.shouldComponentUpdate(
          c,
          f,
          d
        ), t.mode & Ba) {
          he(!0);
          try {
            a = h.shouldComponentUpdate(
              c,
              f,
              d
            );
          } finally {
            he(!1);
          }
        }
        return a === void 0 && console.error(
          "%s.shouldComponentUpdate(): Returned undefined instead of a boolean value. Make sure to return true or false.",
          P(e) || "Component"
        ), a;
      }
      return e.prototype && e.prototype.isPureReactComponent ? !rc(a, c) || !rc(o, f) : !0;
    }
    function X1(t, e, a, c) {
      var o = e.state;
      typeof e.componentWillReceiveProps == "function" && e.componentWillReceiveProps(a, c), typeof e.UNSAFE_componentWillReceiveProps == "function" && e.UNSAFE_componentWillReceiveProps(a, c), e.state !== o && (t = tt(t) || "Component", KT.has(t) || (KT.add(t), console.error(
        "%s.componentWillReceiveProps(): Assigning directly to this.state is deprecated (except inside a component's constructor). Use setState instead.",
        t
      )), r2.enqueueReplaceState(
        e,
        e.state,
        null
      ));
    }
    function Uc(t, e) {
      var a = e;
      if ("ref" in e) {
        a = {};
        for (var c in e)
          c !== "ref" && (a[c] = e[c]);
      }
      if (t = t.defaultProps) {
        a === e && (a = pt({}, a));
        for (var o in t)
          a[o] === void 0 && (a[o] = t[o]);
      }
      return a;
    }
    function Ih(t) {
      Vb(t), console.warn(
        `%s

%s
`,
        Ym ? "An error occurred in the <" + Ym + "> component." : "An error occurred in one of your React components.",
        `Consider adding an error boundary to your tree to customize error handling behavior.
Visit https://react.dev/link/error-boundaries to learn more about error boundaries.`
      );
    }
    function kh(t) {
      var e = Ym ? "The above error occurred in the <" + Ym + "> component." : "The above error occurred in one of your React components.", a = "React will try to recreate this component tree from scratch using the error boundary you provided, " + ((d2 || "Anonymous") + ".");
      if (typeof t == "object" && t !== null && typeof t.environmentName == "string") {
        var c = t.environmentName;
        t = [
          `%o

%s

%s
`,
          t,
          e,
          a
        ].slice(0), typeof t[0] == "string" ? t.splice(
          0,
          1,
          V3 + " " + t[0],
          j3,
          kS + c + kS,
          w3
        ) : t.splice(
          0,
          0,
          V3,
          j3,
          kS + c + kS,
          w3
        ), t.unshift(console), c = O4.apply(console.error, t), c();
      } else
        console.error(
          `%o

%s

%s
`,
          t,
          e,
          a
        );
    }
    function Bl(t) {
      Vb(t);
    }
    function Se(t, e) {
      try {
        Ym = e.source ? tt(e.source) : null, d2 = null;
        var a = e.value;
        if (x.actQueue !== null)
          x.thrownErrors.push(a);
        else {
          var c = t.onUncaughtError;
          c(a, { componentStack: e.stack });
        }
      } catch (o) {
        setTimeout(function() {
          throw o;
        });
      }
    }
    function Vr(t, e, a) {
      try {
        Ym = a.source ? tt(a.source) : null, d2 = tt(e);
        var c = t.onCaughtError;
        c(a.value, {
          componentStack: a.stack,
          errorBoundary: e.tag === 1 ? e.stateNode : null
        });
      } catch (o) {
        setTimeout(function() {
          throw o;
        });
      }
    }
    function Ao(t, e, a) {
      return a = Ln(a), a.tag = u2, a.payload = { element: null }, a.callback = function() {
        $(e.source, Se, t, e);
      }, a;
    }
    function Ff(t) {
      return t = Ln(t), t.tag = u2, t;
    }
    function jr(t, e, a, c) {
      var o = a.type.getDerivedStateFromError;
      if (typeof o == "function") {
        var f = c.value;
        t.payload = function() {
          return o(f);
        }, t.callback = function() {
          Ty(a), $(
            c.source,
            Vr,
            e,
            a,
            c
          );
        };
      }
      var d = a.stateNode;
      d !== null && typeof d.componentDidCatch == "function" && (t.callback = function() {
        Ty(a), $(
          c.source,
          Vr,
          e,
          a,
          c
        ), typeof o != "function" && (Zs === null ? Zs = /* @__PURE__ */ new Set([this]) : Zs.add(this)), PE(this, c), typeof o == "function" || (a.lanes & 2) === 0 && console.error(
          "%s: Error boundaries should implement getDerivedStateFromError(). In that method, return a state update to display an error message or fallback UI.",
          tt(a) || "Unknown"
        );
      });
    }
    function Nc(t, e, a, c, o) {
      if (a.flags |= 32768, Ju && cs(t, o), c !== null && typeof c == "object" && typeof c.then == "function") {
        if (e = a.alternate, e !== null && on(
          e,
          a,
          o,
          !0
        ), At && (wi = !0), a = da.current, a !== null) {
          switch (a.tag) {
            case 31:
            case 13:
            case 19:
              return xa === null ? as() : a.alternate === null && He === df && (He = CS), a.flags &= -257, a.flags |= 65536, a.lanes = o, c === vS ? a.flags |= 16384 : (e = a.updateQueue, e === null ? a.updateQueue = /* @__PURE__ */ new Set([c]) : e.add(c), Yl(t, c, o)), !1;
            case 22:
              return a.flags |= 65536, c === vS ? a.flags |= 16384 : (e = a.updateQueue, e === null ? (e = {
                transitions: null,
                markerInstances: null,
                retryQueue: /* @__PURE__ */ new Set([c])
              }, a.updateQueue = e) : (a = e.retryQueue, a === null ? e.retryQueue = /* @__PURE__ */ new Set([c]) : a.add(c)), Yl(t, c, o)), !1;
          }
          throw Error(
            "Unexpected Suspense handler tag (" + a.tag + "). This is a bug in React."
          );
        }
        return Yl(t, c, o), as(), !1;
      }
      if (At)
        return wi = !0, e = da.current, e !== null ? (e.tag === 19 && console.error(
          "SuspenseList should never catch while hydrating. This is a bug in React."
        ), (e.flags & 65536) === 0 && (e.flags |= 256), e.flags |= 65536, e.lanes = o, c !== Lb && yo(
          Sl(
            Error(
              "There was an error while hydrating but React was able to recover by instead client rendering from the nearest Suspense boundary.",
              { cause: c }
            ),
            a
          )
        )) : (c !== Lb && yo(
          Sl(
            Error(
              "There was an error while hydrating but React was able to recover by instead client rendering the entire root.",
              { cause: c }
            ),
            a
          )
        ), t = t.current.alternate, t.flags |= 65536, o &= -o, t.lanes |= o, c = Sl(c, a), o = Ao(
          t.stateNode,
          c,
          o
        ), Ge(t, o), He !== ws && (He = Fd)), !1;
      var f = Sl(
        Error(
          "There was an error during concurrent rendering but React was able to recover by instead synchronously rendering the entire root.",
          { cause: c }
        ),
        a
      );
      if (kg === null ? kg = [f] : kg.push(f), He !== ws && (He = Fd), e === null) return !0;
      c = Sl(c, a), a = e;
      do {
        switch (a.tag) {
          case 3:
            return a.flags |= 65536, t = o & -o, a.lanes |= t, t = Ao(
              a.stateNode,
              c,
              t
            ), Ge(a, t), !1;
          case 1:
            if (e = a.type, f = a.stateNode, (a.flags & 128) === 0 && (typeof e.getDerivedStateFromError == "function" || f !== null && typeof f.componentDidCatch == "function" && (Zs === null || !Zs.has(f))))
              return a.flags |= 65536, o &= -o, a.lanes |= o, o = Ff(o), jr(
                o,
                t,
                a,
                c
              ), Ge(a, o), !1;
            break;
          case 22:
            if (a.memoizedState !== null)
              return a.flags |= 65536, !1;
        }
        a = a.return;
      } while (a !== null);
      return !1;
    }
    function Me(t, e, a, c) {
      e.child = t === null ? YT(e, null, a, c) : Jd(
        e,
        t.child,
        a,
        c
      );
    }
    function Ph(t, e, a, c, o) {
      a = a.render;
      var f = Cu(a);
      if (f !== a && (a = f, t !== null && (nl = !0)), f = e.ref, "ref" in c) {
        var d = {};
        for (var h in c)
          h !== "ref" && (d[h] = c[h]);
      } else d = c;
      return qn(e), c = ke(
        t,
        e,
        a,
        d,
        f,
        o
      ), h = Ry(), t !== null && !nl ? (My(t, e, o), Hc(t, e, o)) : (At && h && gr(e), e.flags |= 1, Me(t, e, c, o), e.child);
    }
    function t0(t, e, a, c, o) {
      if (t === null) {
        var f = a.type;
        return typeof f == "function" && !Ch(f) && f.defaultProps === void 0 && a.compare === null ? (a = Cu(f), e.tag = 15, e.type = a, Xr(e, f), wy(
          t,
          e,
          a,
          c,
          o
        )) : (t = zy(
          a.type,
          null,
          c,
          e,
          e.mode,
          o
        ), t.ref = e.ref, t.return = e, e.child = t);
      }
      if (f = t.child, !i0(t, o)) {
        var d = f.memoizedProps;
        if (a = a.compare, a = a !== null ? a : rc, a(d, c) && t.ref === e.ref)
          return Hc(
            t,
            e,
            o
          );
      }
      return e.flags |= 1, t = Ru(f, c), t.ref = e.ref, t.return = e, e.child = t;
    }
    function wy(t, e, a, c, o) {
      if (t !== null) {
        var f = t.memoizedProps;
        if (rc(f, c) && t.ref === e.ref && e.type === t.type)
          if (nl = !1, e.pendingProps = c = f, i0(t, o))
            (t.flags & 131072) !== 0 && (nl = !0);
          else
            return e.lanes = t.lanes, Hc(t, e, o);
      }
      return Jy(
        t,
        e,
        a,
        c,
        o
      );
    }
    function Xy(t, e, a, c) {
      var o = c.children, f = t !== null ? t.memoizedState : null;
      if (t === null && e.stateNode === null && (e.stateNode = {
        _visibility: Ag,
        _pendingMarkers: null,
        _retryCache: null,
        _transitions: null
      }), c.mode === "hidden") {
        if ((e.flags & 128) !== 0) {
          if (f = f !== null ? f.baseLanes | a : a, t !== null) {
            for (c = e.child = t.child, o = 0; c !== null; )
              o = o | c.lanes | c.childLanes, c = c.sibling;
            c = o & ~f;
          } else c = 0, e.child = null;
          return Qy(
            t,
            e,
            f,
            a,
            c
          );
        }
        if ((a & 536870912) !== 0)
          e.memoizedState = { baseLanes: 0, cachePool: null }, t !== null && Sc(
            e,
            f !== null ? f.cachePool : null
          ), f !== null ? Ec(e, f) : Xh(e), Qh(e);
        else
          return c = e.lanes = 536870912, Qy(
            t,
            e,
            f !== null ? f.baseLanes | a : a,
            a,
            c
          );
      } else
        f !== null ? (Sc(e, f.cachePool), Ec(e, f), sn(e), e.memoizedState = null) : (t !== null && Sc(e, null), Xh(e), sn(e));
      return Me(t, e, o, a), e.child;
    }
    function Wf(t, e) {
      return t !== null && t.tag === 22 || e.stateNode !== null || (e.stateNode = {
        _visibility: Ag,
        _pendingMarkers: null,
        _retryCache: null,
        _transitions: null
      }), e.sibling;
    }
    function Qy(t, e, a, c, o) {
      var f = Yf();
      return f = f === null ? null : {
        parent: sl._currentValue,
        pool: f
      }, e.memoizedState = {
        baseLanes: a,
        cachePool: f
      }, t !== null && Sc(e, null), Xh(e), Qh(e), t !== null && on(t, e, c, !0), e.childLanes = o, null;
    }
    function wr(t, e) {
      var a = e.hidden;
      return a !== void 0 && console.error(
        `<Activity> doesn't accept a hidden prop. Use mode="hidden" instead.
- <Activity %s>
+ <Activity %s>`,
        a === !0 ? "hidden" : a === !1 ? "hidden={false}" : "hidden={...}",
        a ? 'mode="hidden"' : 'mode="visible"'
      ), e = Qr(
        { mode: e.mode, children: e.children },
        t.mode
      ), e.ref = t.ref, t.child = e, e.return = t, e;
    }
    function Zy(t, e, a) {
      return Jd(e, t.child, null, a), t = wr(
        e,
        e.pendingProps
      ), t.flags |= 2, la(e), e.memoizedState = null, t;
    }
    function Ly(t, e, a) {
      var c = e.pendingProps, o = (e.flags & 128) !== 0;
      if (e.flags &= -129, t === null) {
        if (At) {
          if (c.mode === "hidden")
            return t = wr(e, c), e.lanes = 536870912, t.memoizedState = { baseLanes: 0, cachePool: null }, Wf(null, t);
          if (zc(e), (t = pe) ? (a = Ep(
            t,
            Pu
          ), a = a !== null && a.data === lh ? a : null, a !== null && (c = {
            dehydrated: a,
            treeContext: Uh(),
            retryLane: 536870912,
            hydrationErrors: null
          }, e.memoizedState = c, c = Ay(a), c.return = e, e.child = c, Xl = e, pe = null)) : a = null, a === null)
            throw Hh(e, t), si(e);
          return e.lanes = 536870912, null;
        }
        return wr(e, c);
      }
      var f = t.memoizedState;
      if (f !== null) {
        var d = f.dehydrated;
        if (zc(e), o)
          if (e.flags & 256)
            e.flags &= -257, e = Zy(
              t,
              e,
              a
            );
          else if (e.memoizedState !== null)
            e.child = t.child, e.flags |= 128, e = null;
          else
            throw Error(
              "Client rendering an Activity suspended it again. This is a bug in React."
            );
        else if (Oy(), (a & 536870912) !== 0 && ls(e), nl || on(
          t,
          e,
          a,
          !1
        ), o = (a & t.childLanes) !== 0, nl || o) {
          if (js.current === null) {
            if (c = ye, c !== null && (d = h1(
              c,
              a
            ), d !== 0 && d !== f.retryLane))
              throw f.retryLane = d, Nl(t, d), ge(c, t, d), h2;
            as();
          }
          e = Zy(
            t,
            e,
            a
          );
        } else
          t = f.treeContext, pe = _a(
            d.nextSibling
          ), Xl = e, At = !0, Hs = null, wi = !1, su = null, Pu = !1, t !== null && Nh(e, t), e = wr(e, c), e.flags |= 134221824;
        return e;
      }
      return f = t.child, c = { mode: c.mode, children: c.children }, (a & 536870912) !== 0 && (a & t.lanes) !== 0 && ls(e), t = Ru(f, c), t.ref = e.ref, e.child = t, t.return = e, t;
    }
    function Oo(t, e) {
      var a = e.ref;
      if (a === null)
        t !== null && t.ref !== null && (e.flags |= 4194816);
      else {
        if (typeof a != "function" && typeof a != "object")
          throw Error(
            "Expected ref to be a function, an object returned by React.createRef(), or undefined/null."
          );
        (t === null || t.ref !== a) && (e.flags |= 4194816);
      }
    }
    function Jy(t, e, a, c, o) {
      if (a.prototype && typeof a.prototype.render == "function") {
        var f = P(a) || "Unknown";
        a3[f] || (console.error(
          "The <%s /> component appears to have a render method, but doesn't extend React.Component. This is likely to cause errors. Change %s to extend React.Component instead.",
          f,
          f
        ), a3[f] = !0);
      }
      return e.mode & Ba && Kc.recordLegacyContextWarning(
        e,
        null
      ), t === null && (Xr(e, e.type), a.contextTypes && (f = P(a) || "Unknown", u3[f] || (u3[f] = !0, console.error(
        "%s uses the legacy contextTypes API which was removed in React 19. Use React.createContext() with React.useContext() instead. (https://react.dev/link/legacy-context)",
        f
      )))), qn(e), a = ke(
        t,
        e,
        a,
        c,
        void 0,
        o
      ), c = Ry(), t !== null && !nl ? (My(t, e, o), Hc(t, e, o)) : (At && c && gr(e), e.flags |= 1, Me(t, e, a, o), e.child);
    }
    function Ky(t, e, a, c, o, f) {
      return qn(e), rf = -1, Zg = t !== null && t.type !== e.type, e.updateQueue = null, a = Zh(
        e,
        c,
        a,
        o
      ), Or(t, e), c = Ry(), t !== null && !nl ? (My(t, e, f), Hc(t, e, f)) : (At && c && gr(e), e.flags |= 1, Me(t, e, a, f), e.child);
    }
    function $y(t, e, a, c, o) {
      switch (Mn(e)) {
        case !1:
          var f = e.stateNode, d = new e.type(
            e.memoizedProps,
            f.context
          ).state;
          f.updater.enqueueSetState(f, d, null);
          break;
        case !0:
          e.flags |= 128, e.flags |= 65536, f = Error("Simulated error coming from DevTools");
          var h = o & -o;
          if (e.lanes |= h, d = ye, d === null)
            throw Error(
              "Expected a work-in-progress root. This is a bug in React. Please file an issue."
            );
          h = Ff(h), jr(
            h,
            d,
            e,
            Sl(f, e)
          ), Ge(e, h);
      }
      if (qn(e), e.stateNode === null) {
        if (d = Ns, f = a.contextType, "contextType" in a && f !== null && (f === void 0 || f.$$typeof !== Sn) && !e3.has(a) && (e3.add(a), h = f === void 0 ? " However, it is set to undefined. This can be caused by a typo or by mixing up named and default imports. This can also happen due to a circular dependency, so try moving the createContext() call to a separate file." : typeof f != "object" ? " However, it is set to a " + typeof f + "." : f.$$typeof === kv ? " Did you accidentally pass the Context.Consumer instead?" : " However, it is set to an object with keys {" + Object.keys(f).join(", ") + "}.", console.error(
          "%s defines an invalid contextType. contextType should point to the Context object returned by React.createContext().%s",
          P(a) || "Component",
          h
        )), typeof f == "object" && f !== null && (d = se(f)), f = new a(c, d), e.mode & Ba) {
          he(!0);
          try {
            f = new a(c, d);
          } finally {
            he(!1);
          }
        }
        if (d = e.memoizedState = f.state !== null && f.state !== void 0 ? f.state : null, f.updater = r2, e.stateNode = f, f._reactInternals = e, f._reactInternalInstance = JT, typeof a.getDerivedStateFromProps == "function" && d === null && (d = P(a) || "Component", $T.has(d) || ($T.add(d), console.error(
          "`%s` uses `getDerivedStateFromProps` but its initial state is %s. This is not recommended. Instead, define the initial state by assigning an object to `this.state` in the constructor of `%s`. This ensures that `getDerivedStateFromProps` arguments have a consistent shape.",
          d,
          f.state === null ? "null" : "undefined",
          d
        ))), typeof a.getDerivedStateFromProps == "function" || typeof f.getSnapshotBeforeUpdate == "function") {
          var y = h = d = null;
          if (typeof f.componentWillMount == "function" && f.componentWillMount.__suppressDeprecationWarning !== !0 ? d = "componentWillMount" : typeof f.UNSAFE_componentWillMount == "function" && (d = "UNSAFE_componentWillMount"), typeof f.componentWillReceiveProps == "function" && f.componentWillReceiveProps.__suppressDeprecationWarning !== !0 ? h = "componentWillReceiveProps" : typeof f.UNSAFE_componentWillReceiveProps == "function" && (h = "UNSAFE_componentWillReceiveProps"), typeof f.componentWillUpdate == "function" && f.componentWillUpdate.__suppressDeprecationWarning !== !0 ? y = "componentWillUpdate" : typeof f.UNSAFE_componentWillUpdate == "function" && (y = "UNSAFE_componentWillUpdate"), d !== null || h !== null || y !== null) {
            f = P(a) || "Component";
            var v = typeof a.getDerivedStateFromProps == "function" ? "getDerivedStateFromProps()" : "getSnapshotBeforeUpdate()";
            WT.has(f) || (WT.add(f), console.error(
              `Unsafe legacy lifecycles will not be called for components using new component APIs.

%s uses %s but also contains the following legacy lifecycles:%s%s%s

The above lifecycles should be removed. Learn more about this warning here:
https://react.dev/link/unsafe-component-lifecycles`,
              f,
              v,
              d !== null ? `
  ` + d : "",
              h !== null ? `
  ` + h : "",
              y !== null ? `
  ` + y : ""
            ));
          }
        }
        f = e.stateNode, d = P(a) || "Component", f.render || (a.prototype && typeof a.prototype.render == "function" ? console.error(
          "No `render` method found on the %s instance: did you accidentally return an object from the constructor?",
          d
        ) : console.error(
          "No `render` method found on the %s instance: you may have forgotten to define `render`.",
          d
        )), !f.getInitialState || f.getInitialState.isReactClassApproved || f.state || console.error(
          "getInitialState was defined on %s, a plain JavaScript class. This is only supported for classes created using React.createClass. Did you mean to define a state property instead?",
          d
        ), f.getDefaultProps && !f.getDefaultProps.isReactClassApproved && console.error(
          "getDefaultProps was defined on %s, a plain JavaScript class. This is only supported for classes created using React.createClass. Use a static property to define defaultProps instead.",
          d
        ), f.contextType && console.error(
          "contextType was defined as an instance property on %s. Use a static property to define contextType instead.",
          d
        ), a.childContextTypes && !t3.has(a) && (t3.add(a), console.error(
          "%s uses the legacy childContextTypes API which was removed in React 19. Use React.createContext() instead. (https://react.dev/link/legacy-context)",
          d
        )), a.contextTypes && !PT.has(a) && (PT.add(a), console.error(
          "%s uses the legacy contextTypes API which was removed in React 19. Use React.createContext() with static contextType instead. (https://react.dev/link/legacy-context)",
          d
        )), typeof f.componentShouldUpdate == "function" && console.error(
          "%s has a method called componentShouldUpdate(). Did you mean shouldComponentUpdate()? The name is phrased as a question because the function is expected to return a value.",
          d
        ), a.prototype && a.prototype.isPureReactComponent && typeof f.shouldComponentUpdate < "u" && console.error(
          "%s has a method called shouldComponentUpdate(). shouldComponentUpdate should not be used when extending React.PureComponent. Please extend React.Component if shouldComponentUpdate is used.",
          P(a) || "A pure component"
        ), typeof f.componentDidUnmount == "function" && console.error(
          "%s has a method called componentDidUnmount(). But there is no such lifecycle method. Did you mean componentWillUnmount()?",
          d
        ), typeof f.componentDidReceiveProps == "function" && console.error(
          "%s has a method called componentDidReceiveProps(). But there is no such lifecycle method. If you meant to update the state in response to changing props, use componentWillReceiveProps(). If you meant to fetch data or run side-effects or mutations after React has updated the UI, use componentDidUpdate().",
          d
        ), typeof f.componentWillRecieveProps == "function" && console.error(
          "%s has a method called componentWillRecieveProps(). Did you mean componentWillReceiveProps()?",
          d
        ), typeof f.UNSAFE_componentWillRecieveProps == "function" && console.error(
          "%s has a method called UNSAFE_componentWillRecieveProps(). Did you mean UNSAFE_componentWillReceiveProps()?",
          d
        ), h = f.props !== c, f.props !== void 0 && h && console.error(
          "When calling super() in `%s`, make sure to pass up the same props that your component's constructor was passed.",
          d
        ), f.defaultProps && console.error(
          "Setting defaultProps as an instance property on %s is not supported and will be ignored. Instead, define defaultProps as a static property on %s.",
          d,
          d
        ), typeof f.getSnapshotBeforeUpdate != "function" || typeof f.componentDidUpdate == "function" || FT.has(a) || (FT.add(a), console.error(
          "%s: getSnapshotBeforeUpdate() should be used with componentDidUpdate(). This component defines getSnapshotBeforeUpdate() only.",
          P(a)
        )), typeof f.getDerivedStateFromProps == "function" && console.error(
          "%s: getDerivedStateFromProps() is defined as an instance method and will be ignored. Instead, declare it as a static method.",
          d
        ), typeof f.getDerivedStateFromError == "function" && console.error(
          "%s: getDerivedStateFromError() is defined as an instance method and will be ignored. Instead, declare it as a static method.",
          d
        ), typeof a.getSnapshotBeforeUpdate == "function" && console.error(
          "%s: getSnapshotBeforeUpdate() is defined as a static method and will be ignored. Instead, declare it as an instance method.",
          d
        ), (h = f.state) && (typeof h != "object" || le(h)) && console.error("%s.state: must be set to an object or null", d), typeof f.getChildContext == "function" && typeof a.childContextTypes != "object" && console.error(
          "%s.getChildContext(): childContextTypes must be defined in order to use getChildContext().",
          d
        ), f = e.stateNode, f.props = c, f.state = e.memoizedState, f.refs = {}, Zn(e), d = a.contextType, f.context = typeof d == "object" && d !== null ? se(d) : Ns, f.state === c && (d = P(a) || "Component", IT.has(d) || (IT.add(d), console.error(
          "%s: It is not recommended to assign props directly to state because updates to props won't be reflected in state. In most cases, it is better to use props directly.",
          d
        ))), e.mode & Ba && Kc.recordLegacyContextWarning(
          e,
          f
        ), Kc.recordUnsafeLifecycleWarnings(
          e,
          f
        ), f.state = e.memoizedState, d = a.getDerivedStateFromProps, typeof d == "function" && (Wh(
          e,
          a,
          d,
          c
        ), f.state = e.memoizedState), typeof a.getDerivedStateFromProps == "function" || typeof f.getSnapshotBeforeUpdate == "function" || typeof f.UNSAFE_componentWillMount != "function" && typeof f.componentWillMount != "function" || (d = f.state, typeof f.componentWillMount == "function" && f.componentWillMount(), typeof f.UNSAFE_componentWillMount == "function" && f.UNSAFE_componentWillMount(), d !== f.state && (console.error(
          "%s.componentWillMount(): Assigning directly to this.state is deprecated (except inside a component's constructor). Use setState instead.",
          tt(e) || "Component"
        ), r2.enqueueReplaceState(
          f,
          f.state,
          null
        )), vt(e, c, f, o), kt(), f.state = e.memoizedState), typeof f.componentDidMount == "function" && (e.flags |= 4194308), (e.mode & Zc) !== rt && (e.flags |= 268435456), f = !0;
      } else if (t === null) {
        f = e.stateNode;
        var p = e.memoizedProps;
        h = Uc(a, p), f.props = h;
        var z = f.context;
        y = a.contextType, d = Ns, typeof y == "object" && y !== null && (d = se(y)), v = a.getDerivedStateFromProps, y = typeof v == "function" || typeof f.getSnapshotBeforeUpdate == "function", p = e.pendingProps !== p, y || typeof f.UNSAFE_componentWillReceiveProps != "function" && typeof f.componentWillReceiveProps != "function" || (p || z !== d) && X1(
          e,
          f,
          c,
          d
        ), Vs = !1;
        var E = e.memoizedState;
        f.state = E, vt(e, c, f, o), kt(), z = e.memoizedState, p || E !== z || Vs ? (typeof v == "function" && (Wh(
          e,
          a,
          v,
          c
        ), z = e.memoizedState), (h = Vs || jy(
          e,
          a,
          h,
          c,
          E,
          z,
          d
        )) ? (y || typeof f.UNSAFE_componentWillMount != "function" && typeof f.componentWillMount != "function" || (typeof f.componentWillMount == "function" && f.componentWillMount(), typeof f.UNSAFE_componentWillMount == "function" && f.UNSAFE_componentWillMount()), typeof f.componentDidMount == "function" && (e.flags |= 4194308), (e.mode & Zc) !== rt && (e.flags |= 268435456)) : (typeof f.componentDidMount == "function" && (e.flags |= 4194308), (e.mode & Zc) !== rt && (e.flags |= 268435456), e.memoizedProps = c, e.memoizedState = z), f.props = c, f.state = z, f.context = d, f = h) : (typeof f.componentDidMount == "function" && (e.flags |= 4194308), (e.mode & Zc) !== rt && (e.flags |= 268435456), f = !1);
      } else {
        f = e.stateNode, jh(t, e), d = e.memoizedProps, y = Uc(a, d), f.props = y, v = e.pendingProps, E = f.context, z = a.contextType, h = Ns, typeof z == "object" && z !== null && (h = se(z)), p = a.getDerivedStateFromProps, (z = typeof p == "function" || typeof f.getSnapshotBeforeUpdate == "function") || typeof f.UNSAFE_componentWillReceiveProps != "function" && typeof f.componentWillReceiveProps != "function" || (d !== v || E !== h) && X1(
          e,
          f,
          c,
          h
        ), Vs = !1, E = e.memoizedState, f.state = E, vt(e, c, f, o), kt();
        var M = e.memoizedState;
        d !== v || E !== M || Vs || t !== null && t.dependencies !== null && Hf(t.dependencies) ? (typeof p == "function" && (Wh(
          e,
          a,
          p,
          c
        ), M = e.memoizedState), (y = Vs || jy(
          e,
          a,
          y,
          c,
          E,
          M,
          h
        ) || t !== null && t.dependencies !== null && Hf(t.dependencies)) ? (z || typeof f.UNSAFE_componentWillUpdate != "function" && typeof f.componentWillUpdate != "function" || (typeof f.componentWillUpdate == "function" && f.componentWillUpdate(c, M, h), typeof f.UNSAFE_componentWillUpdate == "function" && f.UNSAFE_componentWillUpdate(
          c,
          M,
          h
        )), typeof f.componentDidUpdate == "function" && (e.flags |= 4), typeof f.getSnapshotBeforeUpdate == "function" && (e.flags |= 1024)) : (typeof f.componentDidUpdate != "function" || d === t.memoizedProps && E === t.memoizedState || (e.flags |= 4), typeof f.getSnapshotBeforeUpdate != "function" || d === t.memoizedProps && E === t.memoizedState || (e.flags |= 1024), e.memoizedProps = c, e.memoizedState = M), f.props = c, f.state = M, f.context = h, f = y) : (typeof f.componentDidUpdate != "function" || d === t.memoizedProps && E === t.memoizedState || (e.flags |= 4), typeof f.getSnapshotBeforeUpdate != "function" || d === t.memoizedProps && E === t.memoizedState || (e.flags |= 1024), f = !1);
      }
      if (h = f, Oo(t, e), d = (e.flags & 128) !== 0, h || d) {
        if (h = e.stateNode, gf(e), d && typeof a.getDerivedStateFromError != "function")
          a = null, en = -1;
        else if (a = ET(h), e.mode & Ba) {
          he(!0);
          try {
            ET(h);
          } finally {
            he(!1);
          }
        }
        e.flags |= 1, t !== null && d ? (e.child = Jd(
          e,
          t.child,
          null,
          o
        ), e.child = Jd(
          e,
          null,
          a,
          o
        )) : Me(t, e, a, o), e.memoizedState = h.state, t = e.child;
      } else
        t = Hc(
          t,
          e,
          o
        );
      return o = e.stateNode, f && o.props !== c && (qm || console.error(
        "It looks like %s is reassigning its own `this.props` while rendering. This is not supported and can lead to confusing bugs.",
        tt(e) || "a component"
      ), qm = !0), t;
    }
    function Fy(t, e, a, c) {
      return Ie(), e.flags |= 256, Me(t, e, a, c), e.child;
    }
    function Xr(t, e) {
      e && e.childContextTypes && console.error(
        `childContextTypes cannot be defined on a function component.
  %s.childContextTypes = ...`,
        e.displayName || e.name || "Component"
      ), typeof e.getDerivedStateFromProps == "function" && (t = P(e) || "Unknown", c3[t] || (console.error(
        "%s: Function components do not support getDerivedStateFromProps.",
        t
      ), c3[t] = !0)), typeof e.contextType == "object" && e.contextType !== null && (e = P(e) || "Unknown", n3[e] || (console.error(
        "%s: Function components do not support contextType.",
        e
      ), n3[e] = !0));
    }
    function e0(t) {
      return { baseLanes: t, cachePool: j1() };
    }
    function l0(t, e, a) {
      return t = t !== null ? t.childLanes & ~a : 0, e && (t |= Cn), t;
    }
    function Wy(t, e, a) {
      var c = e.pendingProps;
      qa(e) && (e.flags |= 128);
      var o = !1, f = (e.flags & 128) !== 0, d;
      if ((d = f) || (d = t !== null && t.memoizedState === null ? !1 : (ha.current & wg) !== 0), d && (o = !0, e.flags &= -129), d = (e.flags & 32) !== 0, e.flags &= -33, t === null) {
        if (At) {
          if (o ? Fa(e) : sn(e), (t = pe) ? (a = Ep(
            t,
            Pu
          ), a = a !== null && a.data !== lh ? a : null, a !== null && (d = {
            dehydrated: a,
            treeContext: Uh(),
            retryLane: 536870912,
            hydrationErrors: null
          }, e.memoizedState = d, d = Ay(a), d.return = e, e.child = d, Xl = e, pe = null)) : a = null, a === null)
            throw Hh(e, t), si(e);
          return k0(a) ? e.lanes = 32 : e.lanes = 536870912, null;
        }
        return f = c.children, c = c.fallback, o ? (sn(e), o = e.mode, f = Qr(
          { mode: "hidden", children: f },
          o
        ), c = ro(
          c,
          o,
          a,
          null
        ), f.return = e, c.return = e, f.sibling = c, e.child = f, c = e.child, c.memoizedState = e0(a), c.childLanes = l0(
          t,
          d,
          a
        ), e.memoizedState = y2, Wf(null, c)) : (Fa(e), a0(e, f));
      }
      var h = t.memoizedState;
      if (h !== null) {
        var y = h.dehydrated;
        if (y !== null)
          return Q1(
            t,
            e,
            f,
            d,
            c,
            y,
            h,
            a
          );
      }
      return o ? (sn(e), o = c.fallback, f = e.mode, h = t.child, y = h.sibling, c = Ru(h, {
        mode: "hidden",
        children: c.children
      }), c.subtreeFlags = h.subtreeFlags & 1206910976, y !== null ? o = Ru(y, o) : (o = ro(
        o,
        f,
        a,
        null
      ), o.flags |= 2), o.return = e, c.return = e, c.sibling = o, e.child = c, Wf(null, c), c = e.child, o = t.child.memoizedState, o === null ? o = e0(a) : (f = o.cachePool, f !== null ? (h = sl._currentValue, f = f.parent !== h ? { parent: h, pool: h } : f) : f = j1(), o = {
        baseLanes: o.baseLanes | a,
        cachePool: f
      }), c.memoizedState = o, c.childLanes = l0(
        t,
        d,
        a
      ), e.memoizedState = y2, Wf(t.child, c)) : (h !== null && (a & 62914560) === a && (a & t.lanes) !== 0 && ls(e), Fa(e), a = t.child, t = a.sibling, a = Ru(a, {
        mode: "visible",
        children: c.children
      }), a.return = e, a.sibling = null, t !== null && (d = e.deletions, d === null ? (e.deletions = [t], e.flags |= 16) : d.push(t)), e.child = a, e.memoizedState = null, a);
    }
    function a0(t, e) {
      return e = Qr(
        { mode: "visible", children: e },
        t.mode
      ), e.return = t, t.child = e;
    }
    function Qr(t, e) {
      return t = Ot(22, t, null, e), t.lanes = 0, t;
    }
    function n0(t, e, a) {
      return Jd(e, t.child, null, a), t = a0(
        e,
        e.pendingProps.children
      ), t.flags |= 2, e.memoizedState = null, t;
    }
    function Q1(t, e, a, c, o, f, d, h) {
      if (a) {
        if (e.flags & 256)
          return Fa(e), e.flags &= -257, n0(
            t,
            e,
            h
          );
        if (e.memoizedState !== null)
          return sn(e), e.child = t.child, e.flags |= 128, null;
        sn(e);
        var y = o.fallback, v = e.mode, p = Qr(
          { mode: "visible", children: o.children },
          v
        );
        return y = ro(
          y,
          v,
          h,
          null
        ), y.flags |= 2, p.return = e, y.return = e, p.sibling = y, e.child = p, Jd(e, t.child, null, h), y = e.child, y.memoizedState = e0(h), y.childLanes = l0(
          t,
          c,
          h
        ), e.memoizedState = y2, Wf(null, y);
      }
      if (Fa(e), Oy(), (h & 536870912) !== 0 && ls(e), k0(f)) {
        if (c = f.nextSibling && f.nextSibling.dataset, c) {
          y = c.dgst;
          var z = c.msg;
          v = c.stck, p = c.cstck;
        }
        return f = z, d = y, o = v, c = p, y = d, v = f, p = o, o = c, y !== kE && (c = Error(v || "The server could not finish this Suspense boundary, likely due to an error during server rendering. Switched to client rendering."), c.stack = p || "", c.digest = y, y = o === void 0 ? null : o, v = {
          value: c,
          source: null,
          stack: y
        }, typeof y == "string" && Zb.set(c, v), yo(v)), n0(
          t,
          e,
          h
        );
      }
      if (nl || on(t, e, h, !1), c = (h & t.childLanes) !== 0, nl || c) {
        if (js.current !== null)
          return n0(
            t,
            e,
            h
          );
        if (c = ye, c !== null && (y = h1(
          c,
          h
        ), y !== 0 && y !== d.retryLane))
          throw d.retryLane = y, Nl(t, y), ge(
            c,
            t,
            y
          ), h2;
        return I0(f) || as(), n0(
          t,
          e,
          h
        );
      }
      return I0(f) ? (e.flags |= 192, e.child = t.child, null) : (t = d.treeContext, pe = _a(f.nextSibling), Xl = e, At = !0, Hs = null, wi = !1, su = null, Pu = !1, t !== null && Nh(e, t), e = a0(
        e,
        o.children
      ), e.flags |= 134221824, e);
    }
    function Do(t, e, a) {
      t.lanes |= e;
      var c = t.alternate;
      c !== null && (c.lanes |= e), Nf(
        t.return,
        e,
        a
      );
    }
    function Iy(t) {
      for (var e = null; t !== null; ) {
        var a = t.alternate;
        a !== null && $n(a) === null && (e = t), t = t.sibling;
      }
      return e;
    }
    function Co(t, e, a, c, o, f) {
      var d = t.memoizedState;
      d === null ? t.memoizedState = {
        isBackwards: e,
        rendering: null,
        renderingStartTime: 0,
        last: c,
        tail: a,
        tailMode: o,
        treeForkCount: f
      } : (d.isBackwards = e, d.rendering = null, d.renderingStartTime = 0, d.last = c, d.tail = a, d.tailMode = o, d.treeForkCount = f);
    }
    function If(t) {
      var e = t.child;
      for (t.child = null; e !== null; ) {
        var a = e.sibling;
        e.sibling = t.child, t.child = e, e = a;
      }
    }
    function u0(t, e, a) {
      var c = e.pendingProps, o = c.revealOrder, f = c.tail, d = c.children, h = ha.current;
      if (e.flags & 128)
        return Jn(e, h), null;
      if ((c = (h & wg) !== 0) ? (h = h & Hm | wg, e.flags |= 128) : h &= Hm, Jn(e, h), h = o ?? "null", o != null && o !== "forwards" && o !== "backwards" && o !== "unstable_legacy-backwards" && o !== "together" && o !== "independent" && !i3[h])
        if (i3[h] = !0, typeof o == "string")
          switch (o.toLowerCase()) {
            case "together":
            case "forwards":
            case "backwards":
            case "independent":
              console.error(
                '"%s" is not a valid value for revealOrder on <SuspenseList />. Use lowercase "%s" instead.',
                o,
                o.toLowerCase()
              );
              break;
            case "forward":
            case "backward":
              console.error(
                '"%s" is not a valid value for revealOrder on <SuspenseList />. React uses the -s suffix in the spelling. Use "%ss" instead.',
                o,
                o.toLowerCase()
              );
              break;
            default:
              console.error(
                '"%s" is not a supported revealOrder on <SuspenseList />. Did you mean "independent", "together", "forwards" or "backwards"?',
                o
              );
          }
        else
          console.error(
            '%s is not a supported value for revealOrder on <SuspenseList />. Did you mean "independent", "together", "forwards" or "backwards"?',
            o
          );
      h = f ?? "null", m2[h] || f == null || (f !== "visible" && f !== "collapsed" && f !== "hidden" ? (m2[h] = !0, console.error(
        '"%s" is not a supported value for tail on <SuspenseList />. Did you mean "visible", "collapsed" or "hidden"?',
        f
      )) : o != null && o !== "forwards" && o !== "backwards" && o !== "unstable_legacy-backwards" && (m2[h] = !0, console.error(
        '<SuspenseList tail="%s" /> is only valid if revealOrder is "forwards" (default) or "backwards". Did you mean to specify revealOrder="forwards"?',
        f
      )));
      t: if ((o == null || o === "forwards" || o === "backwards" || o === "unstable_legacy-backwards") && d !== void 0 && d !== null && d !== !1)
        if (le(d)) {
          for (h = 0; h < d.length; h++)
            if (!Qn(
              d[h],
              h
            ))
              break t;
        } else if (h = Q(d), typeof h == "function") {
          if (h = h.call(d))
            for (var y = h.next(), v = 0; !y.done; y = h.next()) {
              if (!Qn(y.value, v)) break t;
              v++;
            }
        } else
          console.error(
            'A single row was passed to a <SuspenseList revealOrder="%s" />. This is not useful since it needs multiple rows. Did you mean to pass multiple children or an array?',
            o
          );
      if (o === "backwards" && t !== null ? (If(t), Me(t, e, d, a), If(t)) : Me(t, e, d, a), At ? (yc(), d = Og) : d = 0, !c && t !== null && (t.flags & 128) !== 0)
        t: for (t = e.child; t !== null; ) {
          if (t.tag === 13)
            t.memoizedState !== null && Do(t, a, e);
          else if (t.tag === 19)
            Do(t, a, e);
          else if (t.child !== null) {
            t.child.return = t, t = t.child;
            continue;
          }
          if (t === e) break t;
          for (; t.sibling === null; ) {
            if (t.return === null || t.return === e)
              break t;
            t = t.return;
          }
          t.sibling.return = t.return, t = t.sibling;
        }
      switch (o) {
        case "backwards":
          a = Iy(e.child), a === null ? (o = e.child, e.child = null) : (o = a.sibling, a.sibling = null, If(e)), Co(
            e,
            !0,
            o,
            null,
            f,
            d
          );
          break;
        case "unstable_legacy-backwards":
          for (a = null, o = e.child, e.child = null; o !== null; ) {
            if (t = o.alternate, t !== null && $n(t) === null) {
              e.child = o;
              break;
            }
            t = o.sibling, o.sibling = a, a = o, o = t;
          }
          Co(
            e,
            !0,
            a,
            null,
            f,
            d
          );
          break;
        case "together":
          Co(
            e,
            !1,
            null,
            null,
            void 0,
            d
          );
          break;
        case "independent":
          e.memoizedState = null;
          break;
        default:
          a = Iy(e.child), a === null ? (o = e.child, e.child = null) : (o = a.sibling, a.sibling = null), Co(
            e,
            !1,
            o,
            a,
            f,
            d
          );
      }
      return e.child;
    }
    function c0(t, e, a) {
      var c = e.type, o = e.pendingProps, f = o.value;
      return "value" in o || f3 || (f3 = !0, console.error(
        "The `value` prop is required for the `<Context.Provider>`. Did you misspell it or forget to pass it?"
      )), vc(e, c, f), Me(
        t,
        e,
        o.children,
        a
      ), e.child;
    }
    function Hc(t, e, a) {
      if (t !== null && (e.dependencies = t.dependencies), en = -1, Xs |= e.lanes, (a & e.childLanes) === 0)
        if (t !== null) {
          if (on(
            t,
            e,
            a,
            !1
          ), (a & e.childLanes) === 0)
            return null;
        } else return null;
      if (t !== null && e.child !== t.child)
        throw Error("Resuming work not yet implemented.");
      if (e.child !== null) {
        for (t = e.child, a = Ru(t, t.pendingProps), e.child = a, a.return = e; t.sibling !== null; )
          t = t.sibling, a = a.sibling = Ru(t, t.pendingProps), a.return = e;
        a.sibling = null;
      }
      return e.child;
    }
    function i0(t, e) {
      return (t.lanes & e) !== 0 ? !0 : (t = t.dependencies, !!(t !== null && Hf(t)));
    }
    function Z1(t, e, a) {
      switch (e.tag) {
        case 3:
          Is(
            e,
            e.stateNode.containerInfo
          ), vc(
            e,
            sl,
            t.memoizedState.cache
          ), Ie();
          break;
        case 27:
        case 5:
          ks(e);
          break;
        case 4:
          Is(
            e,
            e.stateNode.containerInfo
          );
          break;
        case 10:
          vc(
            e,
            e.type,
            e.memoizedProps.value
          );
          break;
        case 12:
          (a & e.childLanes) !== 0 && (e.flags |= 4), e.flags |= 2048;
          var c = e.stateNode;
          c.effectDuration = -0, c.passiveEffectDuration = -0;
          break;
        case 31:
          if (e.memoizedState !== null)
            return e.flags |= 128, zc(e), null;
          break;
        case 13:
          if (c = e.memoizedState, c !== null) {
            if (c.dehydrated !== null)
              return Fa(e), e.flags |= 128, null;
            c = on(
              t,
              e,
              a,
              !1
            );
            var o = e.child.childLanes;
            return c || (a & o) !== 0 ? Wy(
              t,
              e,
              a
            ) : (Fa(e), t = Hc(
              t,
              e,
              a
            ), t !== null ? t.sibling : null);
          }
          Fa(e);
          break;
        case 19:
          if (e.flags & 128)
            return u0(
              t,
              e,
              a
            );
          if (o = (t.flags & 128) !== 0, c = (a & e.childLanes) !== 0, c || (on(
            t,
            e,
            a,
            !1
          ), c = (a & e.childLanes) !== 0), o) {
            if (c)
              return u0(
                t,
                e,
                a
              );
            e.flags |= 128;
          }
          if (o = e.memoizedState, o !== null && (o.rendering = null, o.tail = null, o.lastEffect = null), Jn(e, ha.current), c) break;
          return null;
        case 22:
          return e.lanes = 0, Xy(
            t,
            e,
            a,
            e.pendingProps
          );
        case 24:
          vc(
            e,
            sl,
            t.memoizedState.cache
          );
      }
      return Hc(t, e, a);
    }
    function o0(t, e, a) {
      if (e._debugNeedsRemount && t !== null) {
        a = zy(
          Cu(e.elementType),
          e.key,
          e.pendingProps,
          e._debugOwner || null,
          e.mode,
          e.lanes
        ), a._debugStack = e._debugStack, a._debugTask = e._debugTask;
        var c = e.return;
        if (c === null) throw Error("Cannot swap the root fiber.");
        if (t.alternate = null, e.alternate = null, a.index = e.index, a.sibling = e.sibling, a.return = e.return, a.ref = e.ref, a._debugInfo = e._debugInfo, e === c.child)
          c.child = a;
        else {
          var o = c.child;
          if (o === null)
            throw Error("Expected parent to have a child.");
          for (; o.sibling !== e; )
            if (o = o.sibling, o === null)
              throw Error("Expected to find the previous sibling.");
          o.sibling = a;
        }
        return e = c.deletions, e === null ? (c.deletions = [t], c.flags |= 16) : e.push(t), a.flags |= 134217730, a;
      }
      if (t !== null)
        if (t.memoizedProps !== e.pendingProps || e.type !== t.type)
          nl = !0;
        else {
          if (!i0(t, a) && (e.flags & 128) === 0)
            return nl = !1, Z1(
              t,
              e,
              a
            );
          nl = (t.flags & 131072) !== 0;
        }
      else
        nl = !1, (c = At) && (yc(), c = (e.flags & 1048576) !== 0), c && (c = e.index, yc(), vr(e, Og, c));
      switch (e.lanes = 0, e.tag) {
        case 16:
          t: if (c = e.pendingProps, t = bc(e.elementType), t = Cu(t), e.type = t, typeof t == "function")
            Ch(t) ? (c = Uc(
              t,
              c
            ), e.tag = 1, e = $y(
              null,
              e,
              t,
              c,
              a
            )) : (e.tag = 0, Xr(e, t), e = Jy(
              null,
              e,
              t,
              c,
              a
            ));
          else {
            if (t != null) {
              if (o = t.$$typeof, o === Es) {
                e.tag = 11, e = Ph(
                  null,
                  e,
                  t,
                  c,
                  a
                );
                break t;
              } else if (o === ra) {
                e.tag = 14, e = t0(
                  null,
                  e,
                  t,
                  c,
                  a
                );
                break t;
              } else if (o === Sn) {
                e.tag = 10, e.type = t, e = c0(
                  null,
                  e,
                  a
                );
                break t;
              }
            }
            throw e = "", t !== null && typeof t == "object" && t.$$typeof === Vl && (e = " Did you wrap a component in React.lazy() more than once?"), a = P(t) || t, Error(
              "Element type is invalid. Received a promise that resolves to: " + a + ". Lazy element type must resolve to a class or function." + e
            );
          }
          return e;
        case 0:
          return Jy(
            t,
            e,
            e.type,
            e.pendingProps,
            a
          );
        case 1:
          return c = e.type, o = Uc(
            c,
            e.pendingProps
          ), $y(
            t,
            e,
            c,
            o,
            a
          );
        case 3:
          t: {
            if (Is(
              e,
              e.stateNode.containerInfo
            ), t === null)
              throw Error(
                "Should have a current fiber. This is a bug in React."
              );
            c = e.pendingProps;
            var f = e.memoizedState;
            o = f.element, jh(t, e), vt(e, c, null, a);
            var d = e.memoizedState;
            if (c = d.cache, vc(e, sl, c), c !== f.cache && Dy(
              e,
              [sl],
              a,
              !0
            ), kt(), c = d.element, f.isDehydrated)
              if (f = {
                element: c,
                isDehydrated: !1,
                cache: d.cache
              }, e.updateQueue.baseState = f, e.memoizedState = f, e.flags & 256) {
                e = Fy(
                  t,
                  e,
                  c,
                  a
                );
                break t;
              } else if (c !== o) {
                o = Sl(
                  Error(
                    "This root received an early update, before anything was able hydrate. Switched the entire root to client rendering."
                  ),
                  e
                ), yo(o), e = Fy(
                  t,
                  e,
                  c,
                  a
                );
                break t;
              } else
                for (t = e.stateNode.containerInfo, t.nodeType === 9 ? t = t.body : t = t.nodeName === "HTML" ? t.ownerDocument.body : t, pe = _a(t.firstChild), Xl = e, At = !0, Hs = null, wi = !1, su = null, Pu = !0, a = YT(
                  e,
                  null,
                  c,
                  a
                ), e.child = a; a; )
                  a.flags = a.flags & -3 | 134221824, a = a.sibling;
            else {
              if (Ie(), c === o) {
                e = Hc(
                  t,
                  e,
                  a
                );
                break t;
              }
              Me(
                t,
                e,
                c,
                a
              );
            }
            e = e.child;
          }
          return e;
        case 26:
          return Oo(t, e), t === null ? (a = Yv(
            e.type,
            null,
            e.pendingProps,
            null
          )) ? e.memoizedState = a : At || (e.stateNode = zv(
            e.type,
            e.pendingProps,
            vl(qi.current),
            e
          )) : e.memoizedState = Yv(
            e.type,
            t.memoizedProps,
            e.pendingProps,
            t.memoizedState
          ), null;
        case 27:
          return ks(e), t === null && At && (c = vl(qi.current), o = ki(), c = e.stateNode = Dp(
            e.type,
            e.pendingProps,
            c,
            o,
            !1
          ), wi || (o = Yc(
            c,
            e.type,
            e.pendingProps,
            o
          ), o !== null && (fi(e, 0).serverProps = o)), Xl = e, Pu = !0, o = pe, fa(e.type) ? (w2 = o, pe = _a(
            c.firstChild
          )) : pe = o), Me(
            t,
            e,
            e.pendingProps.children,
            a
          ), Oo(t, e), t === null && (e.flags |= 4194304), e.child;
        case 5:
          return t === null && At && (f = ki(), c = hh(
            e.type,
            f.ancestorInfo
          ), o = pe, (d = !o) || (d = Zu(
            o,
            e.type,
            e.pendingProps,
            Pu
          ), d !== null ? (e.stateNode = d, wi || (f = Yc(
            d,
            e.type,
            e.pendingProps,
            f
          ), f !== null && (fi(e, 0).serverProps = f)), Xl = e, pe = _a(
            d.firstChild
          ), Pu = !1, f = !0) : f = !1, d = !f), d && (c && Hh(e, o), si(e))), ks(e), o = e.type, f = e.pendingProps, d = t !== null ? t.memoizedProps : null, c = f.children, Ni(o, f) ? c = null : d !== null && Ni(o, d) && (e.flags |= 32), e.memoizedState !== null && (o = ke(
            t,
            e,
            ob,
            null,
            null,
            a
          ), Wm._currentValue = o), Oo(t, e), Me(
            t,
            e,
            c,
            a
          ), e.child;
        case 6:
          return t === null && At && (a = e.pendingProps, t = ki(), c = t.ancestorInfo.current, a = c != null ? mh(
            a,
            c.tag,
            t.ancestorInfo.implicitRootScope
          ) : !0, t = pe, (c = !t) || (c = vd(
            t,
            e.pendingProps,
            Pu
          ), c !== null ? (e.stateNode = c, Xl = e, pe = null, c = !0) : c = !1, c = !c), c && (a && Hh(e, t), si(e))), null;
        case 13:
          return Wy(t, e, a);
        case 4:
          return Is(
            e,
            e.stateNode.containerInfo
          ), c = e.pendingProps, t === null ? e.child = Jd(
            e,
            null,
            c,
            a
          ) : Me(
            t,
            e,
            c,
            a
          ), e.child;
        case 11:
          return Ph(
            t,
            e,
            e.type,
            e.pendingProps,
            a
          );
        case 7:
          return c = e.pendingProps, Oo(t, e), Me(
            t,
            e,
            c,
            a
          ), e.child;
        case 8:
          return Me(
            t,
            e,
            e.pendingProps.children,
            a
          ), e.child;
        case 12:
          return e.flags |= 4, e.flags |= 2048, c = e.stateNode, c.effectDuration = -0, c.passiveEffectDuration = -0, Me(
            t,
            e,
            e.pendingProps.children,
            a
          ), e.child;
        case 10:
          return c0(t, e, a);
        case 9:
          return o = e.type._context, c = e.pendingProps.children, typeof c != "function" && console.error(
            "A context consumer was rendered with multiple children, or a child that isn't a function. A context consumer expects a single child that is a function. If you did pass a function, make sure there is no trailing or leading whitespace around it."
          ), qn(e), o = se(o), c = t2(
            c,
            o,
            void 0
          ), e.flags |= 1, Me(
            t,
            e,
            c,
            a
          ), e.child;
        case 14:
          return t0(
            t,
            e,
            e.type,
            e.pendingProps,
            a
          );
        case 15:
          return wy(
            t,
            e,
            e.type,
            e.pendingProps,
            a
          );
        case 19:
          return u0(
            t,
            e,
            a
          );
        case 31:
          return Ly(t, e, a);
        case 22:
          return Xy(
            t,
            e,
            a,
            e.pendingProps
          );
        case 24:
          return qn(e), c = se(sl), t === null ? (o = Yf(), o === null && (o = ye, f = di(), o.pooledCache = f, gc(f), f !== null && (o.pooledCacheLanes |= a), o = f), e.memoizedState = {
            parent: c,
            cache: o
          }, Zn(e), vc(e, sl, o)) : ((t.lanes & a) !== 0 && (jh(t, e), vt(e, null, null, a), kt()), o = t.memoizedState, f = e.memoizedState, o.parent !== c ? (o = {
            parent: c,
            cache: c
          }, e.memoizedState = o, e.lanes === 0 && (e.memoizedState = e.updateQueue.baseState = o), vc(e, sl, c)) : (c = f.cache, vc(e, sl, c), c !== o.cache && Dy(
            e,
            [sl],
            a,
            !0
          ))), Me(
            t,
            e,
            e.pendingProps.children,
            a
          ), e.child;
        case 30:
          return e.stateNode === null && (e.stateNode = {
            autoName: null,
            paired: null,
            clones: null,
            ref: null
          }), c = e.pendingProps, c.name != null && c.name !== "auto" ? e.flags |= t === null ? 18882560 : 18874368 : At && gr(e), c.className !== void 0 && (o = typeof c.className == "string" ? JSON.stringify(c.className) : "{...}", o3[o] || (o3[o] = !0, console.error(
            `<ViewTransition> doesn't accept a "className" prop. It has been renamed to "default".
-   <ViewTransition className=%s>
+   <ViewTransition default=%s>`,
            o,
            o
          ))), t !== null && t.memoizedProps.name !== c.name ? e.flags |= 4194816 : Oo(t, e), Me(
            t,
            e,
            c.children,
            a
          ), e.child;
        case 29:
          throw e.pendingProps;
      }
      throw Error(
        "Unknown unit of work tag (" + e.tag + "). This error is likely caused by a bug in React. Please file an issue."
      );
    }
    function xu(t) {
      t.flags |= 4;
    }
    function f0(t, e, a, c, o) {
      var f;
      if ((f = (t.mode & rT) !== rt) && (f = a === null ? Vv(e, c) : Vv(e, c) && (c.src !== a.src || c.srcSet !== a.srcSet)), f) {
        if (t.flags |= 16777216, (o & 335544128) === o)
          if (t.stateNode.complete) t.flags |= 8192;
          else if (dv()) t.flags |= 8192;
          else
            throw Ld = vS, l2;
      } else t.flags &= -16777217;
    }
    function s0(t, e) {
      if (e.type !== "stylesheet" || (e.state.loading & ac) !== uh)
        t.flags &= -16777217;
      else if (t.flags |= 16777216, !_p(e))
        if (dv()) t.flags |= 8192;
        else
          throw Ld = vS, l2;
    }
    function Zr(t, e) {
      e !== null && (t.flags |= 4), t.flags & 16384 && (e = t.tag !== 22 ? Pm() : 536870912, t.lanes |= e, kd |= e);
    }
    function kf(t, e) {
      if (!At)
        switch (t.tailMode) {
          case "visible":
            break;
          case "collapsed":
            for (var a = t.tail, c = null; a !== null; )
              a.alternate !== null && (c = a), a = a.sibling;
            c === null ? e || t.tail === null ? t.tail = null : t.tail.sibling = null : c.sibling = null;
            break;
          default:
            for (e = t.tail, a = null; e !== null; )
              e.alternate !== null && (a = e), e = e.sibling;
            a === null ? t.tail = null : a.sibling = null;
        }
    }
    function Pt(t) {
      var e = t.alternate !== null && t.alternate.child === t.child, a = 0, c = 0;
      if (e)
        if ((t.mode & zt) !== rt) {
          for (var o = t.selfBaseDuration, f = t.child; f !== null; )
            a |= f.lanes | f.childLanes, c |= f.subtreeFlags & 1206910976, c |= f.flags & 1206910976, o += f.treeBaseDuration, f = f.sibling;
          t.treeBaseDuration = o;
        } else
          for (o = t.child; o !== null; )
            a |= o.lanes | o.childLanes, c |= o.subtreeFlags & 1206910976, c |= o.flags & 1206910976, o.return = t, o = o.sibling;
      else if ((t.mode & zt) !== rt) {
        o = t.actualDuration, f = t.selfBaseDuration;
        for (var d = t.child; d !== null; )
          a |= d.lanes | d.childLanes, c |= d.subtreeFlags, c |= d.flags, o += d.actualDuration, f += d.treeBaseDuration, d = d.sibling;
        t.actualDuration = o, t.treeBaseDuration = f;
      } else
        for (o = t.child; o !== null; )
          a |= o.lanes | o.childLanes, c |= o.subtreeFlags, c |= o.flags, o.return = t, o = o.sibling;
      return t.subtreeFlags |= c, t.childLanes = a, e;
    }
    function L1(t, e, a) {
      var c = e.pendingProps;
      switch (_h(e), e.tag) {
        case 16:
        case 15:
        case 0:
        case 11:
        case 7:
        case 8:
        case 12:
        case 9:
        case 14:
          return Pt(e), null;
        case 1:
          return Pt(e), null;
        case 3:
          return a = e.stateNode, c = null, t !== null && (c = t.memoizedState.cache), e.memoizedState.cache !== c && (e.flags |= 2048), Mu(sl, e), pu(e), a.pendingContext && (a.context = a.pendingContext, a.pendingContext = null), (t === null || t.child === null) && (Uf(e) ? (xh(), xu(e)) : t === null || t.memoizedState.isDehydrated && (e.flags & 256) === 0 || (e.flags |= 1024, mo())), Pt(e), null;
        case 26:
          var o = e.type, f = e.memoizedState;
          return t === null ? (xu(e), f !== null ? (Pt(e), s0(
            e,
            f
          )) : (Pt(e), f0(
            e,
            o,
            null,
            c,
            a
          ))) : f ? f !== t.memoizedState ? (xu(e), Pt(e), s0(
            e,
            f
          )) : (Pt(e), e.flags &= -16777217) : (t = t.memoizedProps, t !== c && xu(e), Pt(e), f0(
            e,
            o,
            t,
            c,
            a
          )), null;
        case 27:
          if (kc(e), a = vl(qi.current), o = e.type, t !== null && e.stateNode != null)
            t.memoizedProps !== c && xu(e);
          else {
            if (!c) {
              if (e.stateNode === null)
                throw Error(
                  "We must have new props for new mounts. This error is likely caused by a bug in React. Please file an issue."
                );
              return Pt(e), e.subtreeFlags &= -33554433, null;
            }
            t = ki(), Uf(e) ? Y1(e) : (t = Dp(
              o,
              c,
              a,
              t,
              !0
            ), e.stateNode = t, xu(e));
          }
          return Pt(e), e.subtreeFlags &= -33554433, null;
        case 5:
          if (kc(e), o = e.type, t !== null && e.stateNode != null)
            t.memoizedProps !== c && xu(e);
          else {
            if (!c) {
              if (e.stateNode === null)
                throw Error(
                  "We must have new props for new mounts. This error is likely caused by a bug in React. Please file an issue."
                );
              return Pt(e), e.subtreeFlags &= -33554433, null;
            }
            var d = ki();
            if (Uf(e))
              Y1(e);
            else {
              switch (f = vl(qi.current), hh(o, d.ancestorInfo), d = d.context, f = Ra(f), d) {
                case $m:
                  f = f.createElementNS(
                    I,
                    o
                  );
                  break;
                case $S:
                  f = f.createElementNS(
                    Z,
                    o
                  );
                  break;
                default:
                  switch (o) {
                    case "svg":
                      f = f.createElementNS(
                        I,
                        o
                      );
                      break;
                    case "math":
                      f = f.createElementNS(
                        Z,
                        o
                      );
                      break;
                    case "script":
                      f = f.createElement("div"), N3 || ss(c) || (console.error(
                        "Encountered a script tag while rendering React component. Scripts inside React components are never executed when rendering on the client. Consider using template tag instead (https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template)."
                      ), N3 = !0), f.innerHTML = "<script><\/script>", f = f.removeChild(
                        f.firstChild
                      );
                      break;
                    case "select":
                      f = typeof c.is == "string" ? f.createElement("select", {
                        is: c.is
                      }) : f.createElement("select"), c.multiple ? f.multiple = !0 : c.size && (f.size = c.size);
                      break;
                    default:
                      f = typeof c.is == "string" ? f.createElement(o, {
                        is: c.is
                      }) : f.createElement(o), o.indexOf("-") === -1 && (o !== o.toLowerCase() && console.error(
                        "<%s /> is using incorrect casing. Use PascalCase for React components, or lowercase for HTML elements.",
                        o
                      ), Object.prototype.toString.call(f) !== "[object HTMLUnknownElement]" || Ha.call(H3, o) || (H3[o] = !0, console.error(
                        "The tag <%s> is unrecognized in this browser. If you meant to render a React component, start its name with an uppercase letter.",
                        o
                      )));
                  }
              }
              f[zl] = e, f[Al] = c;
              t: for (d = e.child; d !== null; ) {
                if (d.tag === 5 || d.tag === 6)
                  f.appendChild(d.stateNode);
                else if (d.tag !== 4 && d.tag !== 27 && d.child !== null) {
                  d.child.return = d, d = d.child;
                  continue;
                }
                if (d === e) break t;
                for (; d.sibling === null; ) {
                  if (d.return === null || d.return === e)
                    break t;
                  d = d.return;
                }
                d.sibling.return = d.return, d = d.sibling;
              }
              e.stateNode = f;
              t: switch (Ke(f, o, c), o) {
                case "button":
                case "input":
                case "select":
                case "textarea":
                  c = !!c.autoFocus;
                  break t;
                case "img":
                  c = !0;
                  break t;
                default:
                  c = !1;
              }
              c && xu(e);
            }
          }
          return Pt(e), e.subtreeFlags &= -33554433, f0(
            e,
            e.type,
            t === null ? null : t.memoizedProps,
            e.pendingProps,
            a
          ), null;
        case 6:
          if (t && e.stateNode != null)
            t.memoizedProps !== c && xu(e);
          else {
            if (typeof c != "string" && e.stateNode === null)
              throw Error(
                "We must have new props for new mounts. This error is likely caused by a bug in React. Please file an issue."
              );
            if (t = vl(qi.current), a = ki(), Uf(e)) {
              if (t = e.stateNode, a = e.memoizedProps, o = !wi, c = null, f = Xl, f !== null)
                switch (f.tag) {
                  case 3:
                    o && (o = P0(
                      t,
                      a,
                      c
                    ), o !== null && (fi(e, 0).serverProps = o));
                    break;
                  case 27:
                  case 5:
                    c = f.memoizedProps, o && (o = P0(
                      t,
                      a,
                      c
                    ), o !== null && (fi(
                      e,
                      0
                    ).serverProps = o));
                }
              t[zl] = e, t = !!(t.nodeValue === a || c !== null && c.suppressHydrationWarning === !0 || ze(t.nodeValue, a)), t || si(e, !0);
            } else
              o = a.ancestorInfo.current, o != null && mh(
                c,
                o.tag,
                a.ancestorInfo.implicitRootScope
              ), t = Ra(t).createTextNode(
                c
              ), t[zl] = e, e.stateNode = t;
          }
          return Pt(e), null;
        case 31:
          if (a = e.memoizedState, t === null || t.memoizedState !== null) {
            if (c = Uf(e), a !== null) {
              if (t === null) {
                if (!c)
                  throw Error(
                    "A dehydrated suspense component was completed without a hydrated node. This is probably a bug in React."
                  );
                if (t = e.memoizedState, t = t !== null ? t.dehydrated : null, !t)
                  throw Error(
                    "Expected to have a hydrated activity instance. This error is likely caused by a bug in React. Please file an issue."
                  );
                t[zl] = e, Pt(e), (e.mode & zt) !== rt && a !== null && (t = e.child, t !== null && (e.treeBaseDuration -= t.treeBaseDuration));
              } else
                xh(), Ie(), (e.flags & 128) === 0 && (a = e.memoizedState = null), e.flags |= 4, Pt(e), (e.mode & zt) !== rt && a !== null && (t = e.child, t !== null && (e.treeBaseDuration -= t.treeBaseDuration));
              t = !1;
            } else
              a = mo(), t !== null && t.memoizedState !== null && (t.memoizedState.hydrationErrors = a), t = !0;
            if (!t)
              return e.flags & 256 ? (la(e), e) : (la(e), null);
            if ((e.flags & 128) !== 0)
              throw Error(
                "Client rendering an Activity suspended it again. This is a bug in React."
              );
          }
          return Pt(e), null;
        case 13:
          if (c = e.memoizedState, t === null || t.memoizedState !== null && t.memoizedState.dehydrated !== null) {
            if (o = c, f = Uf(e), o !== null && o.dehydrated !== null) {
              if (t === null) {
                if (!f)
                  throw Error(
                    "A dehydrated suspense component was completed without a hydrated node. This is probably a bug in React."
                  );
                if (f = e.memoizedState, f = f !== null ? f.dehydrated : null, !f)
                  throw Error(
                    "Expected to have a hydrated suspense instance. This error is likely caused by a bug in React. Please file an issue."
                  );
                f[zl] = e, Pt(e), (e.mode & zt) !== rt && o !== null && (o = e.child, o !== null && (e.treeBaseDuration -= o.treeBaseDuration));
              } else
                xh(), Ie(), (e.flags & 128) === 0 && (o = e.memoizedState = null), e.flags |= 4, Pt(e), (e.mode & zt) !== rt && o !== null && (o = e.child, o !== null && (e.treeBaseDuration -= o.treeBaseDuration));
              o = !1;
            } else
              o = mo(), t !== null && t.memoizedState !== null && (t.memoizedState.hydrationErrors = o), o = !0;
            if (!o)
              return e.flags & 256 ? (la(e), e) : (la(e), null);
          }
          return la(e), (e.flags & 128) !== 0 ? (e.lanes = a, (e.mode & zt) !== rt && mi(e), e) : (a = c !== null, t = t !== null && t.memoizedState !== null, a && (c = e.child, o = null, c.alternate !== null && c.alternate.memoizedState !== null && c.alternate.memoizedState.cachePool !== null && (o = c.alternate.memoizedState.cachePool.pool), f = null, c.memoizedState !== null && c.memoizedState.cachePool !== null && (f = c.memoizedState.cachePool.pool), f !== o && (c.flags |= 2048)), a !== t && a && (e.child.flags |= 8192), Zr(e, e.updateQueue), Pt(e), (e.mode & zt) !== rt && a && (t = e.child, t !== null && (e.treeBaseDuration -= t.treeBaseDuration)), null);
        case 4:
          return pu(e), t === null && V0(
            e.stateNode.containerInfo
          ), e.flags |= 67108864, Pt(e), null;
        case 10:
          return Mu(e.type, e), Pt(e), null;
        case 19:
          if (Kn(e), c = e.memoizedState, c === null) return Pt(e), null;
          if (o = (e.flags & 128) !== 0, f = c.rendering, f === null)
            if (o) kf(c, !1);
            else {
              if (He !== df || t !== null && (t.flags & 128) !== 0)
                for (t = e.child; t !== null; ) {
                  if (f = $n(t), f !== null) {
                    for (e.flags |= 128, kf(c, !1), t = f.updateQueue, e.updateQueue = t, Zr(e, t), e.subtreeFlags = 0, t = a, a = e.child; a !== null; )
                      so(a, t), a = a.sibling;
                    return Jn(
                      e,
                      ha.current & Hm | wg
                    ), At && mc(e, c.treeForkCount), e.child;
                  }
                  t = t.sibling;
                }
              c.tail !== null && Ue() > HS && (e.flags |= 128, o = !0, kf(c, !1), e.lanes = 4194304);
            }
          else {
            if (!o)
              if (t = $n(f), t !== null) {
                if (e.flags |= 128, o = !0, t = t.updateQueue, e.updateQueue = t, Zr(e, t), kf(c, !0), c.tail === null && c.tailMode !== "collapsed" && c.tailMode !== "visible" && !f.alternate && !At)
                  return Pt(e), null;
              } else
                2 * Ue() - c.renderingStartTime > HS && a !== 536870912 && (e.flags |= 128, o = !0, kf(c, !1), e.lanes = 4194304);
            c.isBackwards ? (f.sibling = e.child, e.child = f) : (t = c.last, t !== null ? t.sibling = f : e.child = f, c.last = f);
          }
          if (c.tail !== null) {
            t = c.tail;
            t: {
              for (a = t; a !== null; ) {
                if (a.alternate !== null) {
                  a = !1;
                  break t;
                }
                a = a.sibling;
              }
              a = !0;
            }
            return c.rendering = t, c.tail = t.sibling, c.renderingStartTime = Ue(), t.sibling = null, f = ha.current, f = o ? f & Hm | wg : f & Hm, c.tailMode === "visible" || c.tailMode === "collapsed" || !a || At ? Jn(e, f) : (a = f, yt(
              da,
              e,
              e
            ), yt(ha, a, e), xa === null && (xa = e)), At && mc(e, c.treeForkCount), t;
          }
          return Pt(e), null;
        case 22:
        case 23:
          return la(e), Vf(e), c = e.memoizedState !== null, t !== null ? t.memoizedState !== null !== c && (e.flags |= 8192) : c && (e.flags |= 8192), c ? (a & 536870912) !== 0 && (e.flags & 128) === 0 && (Pt(e), e.subtreeFlags & 6 && (e.flags |= 8192)) : Pt(e), a = e.updateQueue, a !== null && Zr(e, a.retryQueue), a = null, t !== null && t.memoizedState !== null && t.memoizedState.cachePool !== null && (a = t.memoizedState.cachePool.pool), c = null, e.memoizedState !== null && e.memoizedState.cachePool !== null && (c = e.memoizedState.cachePool.pool), c !== a && (e.flags |= 2048), t !== null && de(Xd, e), null;
        case 24:
          return a = null, t !== null && (a = t.memoizedState.cache), e.memoizedState.cache !== a && (e.flags |= 2048), Mu(sl, e), Pt(e), null;
        case 25:
          return null;
        case 30:
          return e.flags |= 33554432, Pt(e), null;
      }
      throw Error(
        "Unknown unit of work tag (" + e.tag + "). This error is likely caused by a bug in React. Please file an issue."
      );
    }
    function J1(t, e) {
      switch (_h(e), e.tag) {
        case 1:
          return t = e.flags, t & 65536 ? (e.flags = t & -65537 | 128, (e.mode & zt) !== rt && mi(e), e) : null;
        case 3:
          return Mu(sl, e), pu(e), t = e.flags, (t & 65536) !== 0 && (t & 128) === 0 ? (e.flags = t & -65537 | 128, e) : null;
        case 26:
        case 27:
        case 5:
          return kc(e), null;
        case 31:
          if (e.memoizedState !== null) {
            if (la(e), e.alternate === null)
              throw Error(
                "Threw in newly mounted dehydrated component. This is likely a bug in React. Please file an issue."
              );
            Ie();
          }
          return t = e.flags, t & 65536 ? (e.flags = t & -65537 | 128, (e.mode & zt) !== rt && mi(e), e) : null;
        case 13:
          if (la(e), t = e.memoizedState, t !== null && t.dehydrated !== null) {
            if (e.alternate === null)
              throw Error(
                "Threw in newly mounted dehydrated component. This is likely a bug in React. Please file an issue."
              );
            Ie();
          }
          return t = e.flags, t & 65536 ? (e.flags = t & -65537 | 128, (e.mode & zt) !== rt && mi(e), e) : null;
        case 19:
          return Kn(e), t = e.flags, t & 65536 ? (e.flags = t & -65537 | 128, t = e.memoizedState, t !== null && (t.rendering = null, t.tail = null), e.flags |= 4, e) : null;
        case 4:
          return pu(e), null;
        case 10:
          return Mu(e.type, e), null;
        case 22:
        case 23:
          return la(e), Vf(e), t !== null && de(Xd, e), t = e.flags, t & 65536 ? (e.flags = t & -65537 | 128, (e.mode & zt) !== rt && mi(e), e) : null;
        case 24:
          return Mu(sl, e), null;
        case 25:
          return null;
        default:
          return null;
      }
    }
    function K1(t, e) {
      switch (_h(e), e.tag) {
        case 3:
          Mu(sl, e), pu(e);
          break;
        case 26:
        case 27:
        case 5:
          kc(e);
          break;
        case 4:
          pu(e);
          break;
        case 31:
          e.memoizedState !== null && la(e);
          break;
        case 13:
          la(e);
          break;
        case 19:
          Kn(e);
          break;
        case 10:
          Mu(e.type, e);
          break;
        case 22:
        case 23:
          la(e), Vf(e), t !== null && de(Xd, e);
          break;
        case 24:
          Mu(sl, e);
      }
    }
    function rn(t) {
      return (t.mode & zt) !== rt;
    }
    function ky(t, e) {
      rn(t) ? (Ja(), Ro(e, t), kl()) : Ro(e, t);
    }
    function r0(t, e, a) {
      rn(t) ? (Ja(), Mo(
        a,
        t,
        e
      ), kl()) : Mo(
        a,
        t,
        e
      );
    }
    function Ro(t, e) {
      try {
        var a = e.updateQueue, c = a !== null ? a.lastEffect : null;
        if (c !== null) {
          var o = c.next;
          a = o;
          do {
            if ((a.tag & t) === t && (c = void 0, (t & ln) !== Xg && (Zm = !0), c = $(
              e,
              t4,
              a
            ), (t & ln) !== Xg && (Zm = !1), c !== void 0 && typeof c != "function")) {
              var f = void 0;
              f = (a.tag & ru) !== 0 ? "useLayoutEffect" : (a.tag & ln) !== 0 ? "useInsertionEffect" : "useEffect";
              var d = void 0;
              d = c === null ? " You returned null. If your effect does not require clean up, return undefined (or nothing)." : typeof c.then == "function" ? `

It looks like you wrote ` + f + `(async () => ...) or returned a Promise. Instead, write the async function inside your effect and call it immediately:

` + f + `(() => {
  async function fetchData() {
    // You can await here
    const response = await MyAPI.getData(someId);
    // ...
  }
  fetchData();
}, [someId]); // Or [] if effect doesn't need props or state

Learn more about data fetching with Hooks: https://react.dev/link/hooks-data-fetching` : " You returned: " + c, $(
                e,
                function(h, y) {
                  console.error(
                    "%s must not return anything besides a function, which is used for clean-up.%s",
                    h,
                    y
                  );
                },
                f,
                d
              );
            }
            a = a.next;
          } while (a !== o);
        }
      } catch (h) {
        at(e, e.return, h);
      }
    }
    function Mo(t, e, a) {
      try {
        var c = e.updateQueue, o = c !== null ? c.lastEffect : null;
        if (o !== null) {
          var f = o.next;
          c = f;
          do {
            if ((c.tag & t) === t) {
              var d = c.inst, h = d.destroy;
              h !== void 0 && (d.destroy = void 0, (t & ln) !== Xg && (Zm = !0), o = e, $(
                o,
                e4,
                o,
                a,
                h
              ), (t & ln) !== Xg && (Zm = !1));
            }
            c = c.next;
          } while (c !== f);
        }
      } catch (y) {
        at(e, e.return, y);
      }
    }
    function Py(t, e) {
      rn(t) ? (Ja(), Ro(e, t), kl()) : Ro(e, t);
    }
    function tv(t, e, a) {
      rn(t) ? (Ja(), Mo(
        a,
        t,
        e
      ), kl()) : Mo(
        a,
        t,
        e
      );
    }
    function $1(t) {
      var e = t.updateQueue;
      if (e !== null) {
        var a = t.stateNode;
        t.type.defaultProps || "ref" in t.memoizedProps || qm || (a.props !== t.memoizedProps && console.error(
          "Expected %s props to match memoized props before processing the update queue. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.",
          tt(t) || "instance"
        ), a.state !== t.memoizedState && console.error(
          "Expected %s state to match memoized state before processing the update queue. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.",
          tt(t) || "instance"
        ));
        try {
          $(
            t,
            wh,
            e,
            a
          );
        } catch (c) {
          at(t, t.return, c);
        }
      }
    }
    function F1(t, e, a) {
      return t.getSnapshotBeforeUpdate(e, a);
    }
    function Lr(t, e) {
      var a = e.memoizedProps, c = e.memoizedState;
      e = t.stateNode, t.type.defaultProps || "ref" in t.memoizedProps || qm || (e.props !== t.memoizedProps && console.error(
        "Expected %s props to match memoized props before getSnapshotBeforeUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.",
        tt(t) || "instance"
      ), e.state !== t.memoizedState && console.error(
        "Expected %s state to match memoized state before getSnapshotBeforeUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.",
        tt(t) || "instance"
      ));
      try {
        var o = Uc(
          t.type,
          a
        ), f = $(
          t,
          F1,
          e,
          o,
          c
        );
        a = s3, f !== void 0 || a.has(t.type) || (a.add(t.type), $(t, function() {
          console.error(
            "%s.getSnapshotBeforeUpdate(): A snapshot value (or null) must be returned. You have returned undefined.",
            tt(t)
          );
        })), e.__reactInternalSnapshotBeforeUpdate = f;
      } catch (d) {
        at(t, t.return, d);
      }
    }
    function d0(t, e, a) {
      a.props = Uc(
        t.type,
        t.memoizedProps
      ), a.state = t.memoizedState, rn(t) ? (Ja(), $(
        t,
        RT,
        t,
        e,
        a
      ), kl()) : $(
        t,
        RT,
        t,
        e,
        a
      );
    }
    function h0(t) {
      var e = t.ref;
      if (e !== null) {
        switch (t.tag) {
          case 26:
          case 27:
          case 5:
            var a = t.stateNode;
            break;
          case 30:
            a = t.stateNode;
            var c = dc(
              t.memoizedProps,
              a
            );
            (a.ref === null || a.ref.name !== c) && (a.ref = bp(c)), a = a.ref;
            break;
          case 7:
            t.stateNode === null && (a = new sa(t), mt(
              t,
              hs,
              a
            ), t.stateNode = a), a = t.stateNode;
            break;
          default:
            a = t.stateNode;
        }
        if (typeof e == "function")
          if (rn(t))
            try {
              Ja(), t.refCleanup = e(a);
            } finally {
              kl();
            }
          else t.refCleanup = e(a);
        else
          typeof e == "string" ? console.error("String refs are no longer supported.") : e.hasOwnProperty("current") || console.error(
            "Unexpected ref object provided for %s. Use either a ref-setter function or React.createRef().",
            tt(t)
          ), e.current = a;
      }
    }
    function tu(t, e) {
      try {
        $(t, h0, t);
      } catch (a) {
        at(t, e, a);
      }
    }
    function il(t, e) {
      var a = t.ref, c = t.refCleanup;
      if (a !== null)
        if (typeof c == "function")
          try {
            if (rn(t))
              try {
                Ja(), $(t, c);
              } finally {
                kl(t);
              }
            else $(t, c);
          } catch (o) {
            at(t, e, o);
          } finally {
            t.refCleanup = null, t = t.alternate, t != null && (t.refCleanup = null);
          }
        else if (typeof a == "function")
          try {
            if (rn(t))
              try {
                Ja(), $(t, a, null);
              } finally {
                kl(t);
              }
            else $(t, a, null);
          } catch (o) {
            at(t, e, o);
          }
        else a.current = null;
    }
    function Jr(t, e, a, c) {
      var o = t.memoizedProps, f = o.id, d = o.onCommit;
      o = o.onRender, e = e === null ? "mount" : "update", dS && (e = "nested-update"), typeof o == "function" && o(
        f,
        e,
        t.actualDuration,
        t.treeBaseDuration,
        t.actualStartTime,
        a
      ), typeof d == "function" && d(f, e, c, a);
    }
    function W1(t, e, a, c) {
      var o = t.memoizedProps;
      t = o.id, o = o.onPostCommit, e = e === null ? "mount" : "update", dS && (e = "nested-update"), typeof o == "function" && o(
        t,
        e,
        c,
        a
      );
    }
    function Kr(t, e) {
      if ((t.tag === 5 || t.tag === 27 || t.tag === 6) && t.alternate === null && e !== null)
        for (var a = 0; a < e.length; a++)
          yd(
            t.stateNode,
            e[a]
          );
    }
    function I1(t) {
      for (var e = t.return; e !== null && (m0(e) && yd(t.stateNode, e.stateNode), !$r(e)); )
        e = e.return;
    }
    function _o(t) {
      for (var e = t.return; e !== null && (m0(e) && Hv(t.stateNode, e.stateNode), !$r(e)); )
        e = e.return;
    }
    function $r(t) {
      return t.tag === 5 || t.tag === 3 || t.tag === 27;
    }
    function m0(t) {
      return t && t.tag === 7 && t.stateNode !== null;
    }
    function y0(t) {
      var e = t.type, a = t.memoizedProps, c = t.stateNode;
      try {
        $(
          t,
          sp,
          c,
          e,
          a,
          t
        );
      } catch (o) {
        at(t, t.return, o);
      }
    }
    function Bc(t, e, a) {
      try {
        $(
          t,
          Ma,
          t.stateNode,
          t.type,
          a,
          e,
          t
        );
      } catch (c) {
        at(t, t.return, c);
      }
    }
    function ev(t) {
      return t.tag === 5 || t.tag === 3 || t.tag === 26 || t.tag === 27 && fa(t.type) || t.tag === 4;
    }
    function v0(t) {
      t: for (; ; ) {
        for (; t.sibling === null; ) {
          if (t.return === null || ev(t.return)) return null;
          t = t.return;
        }
        for (t.sibling.return = t.return, t = t.sibling; t.tag !== 5 && t.tag !== 6 && t.tag !== 18; ) {
          if (t.tag === 27 && fa(t.type) || t.flags & 2 || t.child === null || t.tag === 4) continue t;
          t.child.return = t, t = t.child;
        }
        if (!(t.flags & 2)) return t.stateNode;
      }
    }
    function g0(t, e, a, c) {
      var o = t.tag;
      if (o === 5 || o === 6)
        o = t.stateNode, e ? (dp(a), (a.nodeType === 9 ? a.body : a.nodeName === "HTML" ? a.ownerDocument.body : a).insertBefore(o, e)) : (dp(a), e = a.nodeType === 9 ? a.body : a.nodeName === "HTML" ? a.ownerDocument.body : a, e.appendChild(o), o = a._reactRootContainer, o != null || e.onclick !== null || (e.onclick = zu)), Kr(t, c), Lt = !0;
      else if (o !== 4 && (o === 27 && (Kr(t, c), c = null, fa(t.type) && (a = t.stateNode, e = null)), t = t.child, t !== null))
        for (g0(
          t,
          e,
          a,
          c
        ), t = t.sibling; t !== null; )
          g0(
            t,
            e,
            a,
            c
          ), t = t.sibling;
    }
    function Uo(t, e, a, c) {
      var o = t.tag;
      if (o === 5 || o === 6)
        o = t.stateNode, e ? a.insertBefore(o, e) : a.appendChild(o), Kr(t, c), Lt = !0;
      else if (o !== 4 && (o === 27 && (Kr(t, c), c = null, fa(t.type) && (a = t.stateNode)), t = t.child, t !== null))
        for (Uo(
          t,
          e,
          a,
          c
        ), t = t.sibling; t !== null; )
          Uo(
            t,
            e,
            a,
            c
          ), t = t.sibling;
    }
    function k1(t) {
      for (var e, a = t.return; a !== null; ) {
        if (ev(a)) {
          e = a;
          break;
        }
        a = a.return;
      }
      a = null;
      for (var c = t.return; c !== null; ) {
        if (m0(c)) {
          var o = c.stateNode;
          a === null ? a = [o] : a.push(o);
        }
        if ($r(c)) break;
        c = c.return;
      }
      if (e == null)
        throw Error(
          "Expected to find a host parent. This error is likely caused by a bug in React. Please file an issue."
        );
      switch (e.tag) {
        case 27:
          e = e.stateNode, c = v0(t), Uo(
            t,
            c,
            e,
            a
          );
          break;
        case 5:
          c = e.stateNode, e.flags & 32 && (Av(c), e.flags &= -33), e = v0(t), Uo(
            t,
            e,
            c,
            a
          );
          break;
        case 3:
        case 4:
          e = e.stateNode.containerInfo, c = v0(t), g0(
            t,
            c,
            e,
            a
          );
          break;
        default:
          throw Error(
            "Invalid host parent fiber. This error is likely caused by a bug in React. Please file an issue."
          );
      }
    }
    function p0(t) {
      var e = t.stateNode, a = t.memoizedProps;
      try {
        $(
          t,
          Cp,
          t.type,
          a,
          e,
          t
        );
      } catch (c) {
        at(t, t.return, c);
      }
    }
    function lv(t) {
      (t.tag === 30 || (t.subtreeFlags & 33554432) !== 0) && (zS = !0);
    }
    function av() {
      var t = Li;
      return Li = null, t;
    }
    function Pf(t, e, a, c, o) {
      return An = 0, (e = S0(
        t.child,
        e,
        a,
        c,
        o
      )) && t._debugTask != null && zn === null && (zn = t._debugTask), e;
    }
    function S0(t, e, a, c, o) {
      for (var f = !1; t !== null; ) {
        if (t.tag === 5) {
          var d = t.stateNode;
          if (c !== null) {
            var h = Bi(d);
            c.push(h), h.view && (f = !0);
          } else
            f || Bi(d).view && (f = !0);
          zS = !0, vp(
            d,
            An === 0 ? e : e + "_" + An,
            a
          ), An++;
        } else (t.tag !== 22 || t.memoizedState === null) && (t.tag === 30 && o || S0(
          t.child,
          e,
          a,
          c,
          o
        ) && (f = !0));
        t = t.sibling;
      }
      return f;
    }
    function ae(t, e) {
      for (; t !== null; )
        t.tag === 5 ? Rv(t.stateNode, t.memoizedProps) : (t.tag !== 22 || t.memoizedState === null) && (t.tag === 30 && e || ae(
          t.child,
          e
        )), t = t.sibling;
    }
    function _e(t) {
      if ((t.subtreeFlags & 18874368) !== 0)
        for (t = t.child; t !== null; ) {
          if ((t.tag !== 22 || t.memoizedState === null) && (_e(t), t.tag === 30 && (t.flags & 18874368) !== 0 && t.stateNode.paired)) {
            var e = t.memoizedProps;
            if (e.name == null || e.name === "auto")
              throw Error(
                "Found a pair with an auto name. This is a bug in React."
              );
            var a = e.name;
            e = hc(e.default, e.share), e !== "none" && (Pf(
              t,
              a,
              e,
              null,
              !1
            ) || ae(t.child, !1));
          }
          t = t.sibling;
        }
    }
    function b0(t, e) {
      if (t.tag === 30) {
        var a = t.stateNode, c = t.memoizedProps, o = dc(c, a), f = hc(
          c.default,
          a.paired ? c.share : c.enter
        );
        f !== "none" ? Pf(
          t,
          o,
          f,
          null,
          !1
        ) ? (_e(t), a.paired || e || Ri(t, c.onEnter)) : ae(t.child, !1) : _e(t);
      } else if ((t.subtreeFlags & 33554432) !== 0)
        for (t = t.child; t !== null; )
          b0(t, e), t = t.sibling;
      else _e(t);
    }
    function T0(t) {
      if (du !== null && du.size !== 0) {
        var e = du;
        if ((t.subtreeFlags & 18874368) !== 0)
          for (t = t.child; t !== null; ) {
            if (t.tag !== 22 || t.memoizedState === null) {
              if (t.tag === 30 && (t.flags & 18874368) !== 0) {
                var a = t.memoizedProps, c = a.name;
                if (c != null && c !== "auto") {
                  var o = e.get(c);
                  if (o !== void 0) {
                    var f = hc(
                      a.default,
                      a.share
                    );
                    if (f !== "none" && (Pf(
                      t,
                      c,
                      f,
                      null,
                      !1
                    ) ? (f = t.stateNode, o.paired = f, f.paired = o, Ri(t, a.onShare)) : ae(
                      t.child,
                      !1
                    )), e.delete(c), e.size === 0) break;
                  }
                }
              }
              T0(t);
            }
            t = t.sibling;
          }
      }
    }
    function E0(t) {
      if (t.tag === 30) {
        var e = t.memoizedProps, a = dc(e, t.stateNode), c = du !== null ? du.get(a) : void 0, o = hc(
          e.default,
          c !== void 0 ? e.share : e.exit
        );
        o !== "none" && (Pf(
          t,
          a,
          o,
          null,
          !1
        ) ? c !== void 0 ? (o = t.stateNode, c.paired = o, o.paired = c, du.delete(a), Ri(t, e.onShare)) : Ri(t, e.onExit) : ae(t.child, !1)), du !== null && T0(t);
      } else if ((t.subtreeFlags & 33554432) !== 0)
        for (t = t.child; t !== null; )
          E0(t), t = t.sibling;
      else
        du !== null && T0(t);
    }
    function nv(t) {
      for (t = t.child; t !== null; ) {
        if (t.tag === 30) {
          var e = t.memoizedProps, a = dc(e, t.stateNode);
          e = hc(e.default, e.update), t.flags &= -5, e !== "none" && Pf(
            t,
            a,
            e,
            t.memoizedState = [],
            !1
          );
        } else
          (t.subtreeFlags & 33554432) !== 0 && nv(t);
        t = t.sibling;
      }
    }
    function No(t) {
      if ((t.subtreeFlags & 18874368) !== 0)
        for (t = t.child; t !== null; ) {
          if (t.tag !== 22 || t.memoizedState === null) {
            if (t.tag === 30 && (t.flags & 18874368) !== 0) {
              var e = t.stateNode;
              e.paired !== null && (e.paired = null, ae(t.child, !1));
            }
            No(t);
          }
          t = t.sibling;
        }
    }
    function Fr(t) {
      if (t.tag === 30)
        t.stateNode.paired = null, ae(t.child, !1), No(t);
      else if ((t.subtreeFlags & 33554432) !== 0)
        for (t = t.child; t !== null; )
          Fr(t), t = t.sibling;
      else No(t);
    }
    function Wr(t) {
      for (t = t.child; t !== null; )
        t.tag === 30 ? ae(t.child, !1) : (t.subtreeFlags & 33554432) !== 0 && Wr(t), t = t.sibling;
    }
    function z0(t, e, a, c, o, f, d) {
      for (var h = !1; e !== null; ) {
        if (e.tag === 5) {
          var y = e.stateNode;
          if (f !== null && An < f.length) {
            var v = f[An], p = Bi(y);
            (v.view || p.view) && (h = !0);
            var z;
            if (z = (t.flags & 4) === 0)
              if (p.clip) z = !0;
              else {
                z = v.rect;
                var E = p.rect;
                z = z.y !== E.y || z.x !== E.x || z.height !== E.height || z.width !== E.width;
              }
            z && (t.flags |= 4), p.abs ? p = !v.abs : (v = v.rect, p = p.rect, p = v.height !== p.height || v.width !== p.width), p && (t.flags |= 32);
          } else t.flags |= 32;
          (t.flags & 4) !== 0 && vp(
            y,
            An === 0 ? a : a + "_" + An,
            o
          ), h && (t.flags & 4) !== 0 || (Li === null && (Li = []), Li.push(
            y,
            An === 0 ? c : c + "_" + An,
            e.memoizedProps
          )), An++;
        } else (e.tag !== 22 || e.memoizedState === null) && (e.tag === 30 && d ? t.flags |= e.flags & 32 : z0(
          t,
          e.child,
          a,
          c,
          o,
          f,
          d
        ) && (h = !0));
        e = e.sibling;
      }
      return h;
    }
    function P1(t, e) {
      for (t = t.child; t !== null; ) {
        if (t.tag === 30) {
          var a = t.memoizedProps, c = t.stateNode, o = dc(a, c), f = hc(a.default, a.update), d;
          d = t.memoizedState, t.memoizedState = null, c = t;
          var h = t.child, y = o;
          An = 0, f = z0(
            c,
            h,
            y,
            o,
            f,
            d,
            !1
          ), (t.flags & 4) !== 0 && f && Ri(t, a.onUpdate);
        } else
          (t.subtreeFlags & 33554432) !== 0 && P1(t);
        t = t.sibling;
      }
    }
    function Ho(t) {
      var e = t.memoizedProps.name;
      if (e != null && e !== "auto") {
        var a = AS.get(e);
        if (a !== void 0) {
          if (a !== t && a !== t.alternate && !r3[e]) {
            r3[e] = !0;
            var c = JSON.stringify(e);
            $(t, function() {
              console.error(
                "There are two <ViewTransition name=%s> components with the same name mounted at the same time. This is not supported and will cause View Transitions to error. Try to use a more unique name e.g. by using a namespace prefix and adding the id of an item to the name.",
                c
              );
            }), $(a, function() {
              console.error(
                "The existing <ViewTransition name=%s> duplicate has this stack trace.",
                c
              );
            });
          }
        } else AS.set(e, t);
      }
    }
    function A0(t) {
      var e = t.memoizedProps.name;
      if (e != null && e !== "auto") {
        var a = AS.get(e);
        a === void 0 || a !== t && a !== t.alternate || AS.delete(e);
      }
    }
    function uv(t, e) {
      return e.tag === 31 ? (e = e.memoizedState, t.memoizedState !== null && e === null) : e.tag === 13 ? (t = t.memoizedState, e = e.memoizedState, t !== null && t.dehydrated !== null && (e === null || e.dehydrated === null)) : e.tag === 3 ? t.memoizedState.isDehydrated && (e.flags & 256) === 0 : !1;
    }
    function tp(t, e, a) {
      if (t = t.containerInfo, Y2 = Im, t = mr(t), zh(t)) {
        if ("selectionStart" in t)
          var c = {
            start: t.selectionStart,
            end: t.selectionEnd
          };
        else
          t: {
            c = (c = t.ownerDocument) && c.defaultView || window;
            var o = c.getSelection && c.getSelection();
            if (o && o.rangeCount !== 0) {
              c = o.anchorNode;
              var f = o.anchorOffset, d = o.focusNode;
              o = o.focusOffset;
              try {
                c.nodeType, d.nodeType;
              } catch {
                c = null;
                break t;
              }
              var h = 0, y = -1, v = -1, p = 0, z = 0, E = t, M = null;
              e: for (; ; ) {
                for (var j; E !== c || f !== 0 && E.nodeType !== 3 || (y = h + f), E !== d || o !== 0 && E.nodeType !== 3 || (v = h + o), E.nodeType === 3 && (h += E.nodeValue.length), (j = E.firstChild) !== null; )
                  M = E, E = j;
                for (; ; ) {
                  if (E === t) break e;
                  if (M === c && ++p === f && (y = h), M === d && ++z === o && (v = h), (j = E.nextSibling) !== null) break;
                  E = M, M = E.parentNode;
                }
                E = j;
              }
              c = y === -1 || v === -1 ? null : { start: y, end: v };
            } else c = null;
          }
        c = c || { start: 0, end: 0 };
      } else c = null;
      for (q2 = {
        focusedElem: t,
        selectionRange: c
      }, Im = !1, a = (a & 335544064) === a, Ll = e, e = a ? 9270 : 1024; Ll !== null; ) {
        if (t = Ll, a && (c = t.deletions, c !== null))
          for (f = 0; f < c.length; f++)
            a && E0(c[f]);
        if (t.alternate === null && (t.flags & 2) !== 0)
          a && lv(t), Ir(a);
        else {
          if (t.tag === 22) {
            if (c = t.alternate, t.memoizedState !== null) {
              c !== null && c.memoizedState === null && a && E0(c), Ir(a);
              continue;
            } else if (c !== null && c.memoizedState !== null) {
              a && lv(t), Ir(a);
              continue;
            }
          }
          c = t.child, (t.subtreeFlags & e) !== 0 && c !== null ? (c.return = t, Ll = c) : (a && nv(t), Ir(a));
        }
      }
      du = null;
    }
    function Ir(t) {
      for (; Ll !== null; ) {
        var e = Ll, a = e, c = t, o = a.alternate, f = a.flags;
        switch (a.tag) {
          case 0:
          case 11:
          case 15:
            break;
          case 1:
            (f & 1024) !== 0 && o !== null && Lr(a, o);
            break;
          case 3:
            if ((f & 1024) !== 0) {
              if (c = a.stateNode.containerInfo, a = c.nodeType, a === 9)
                Qu(c);
              else if (a === 1)
                switch (c.nodeName) {
                  case "HEAD":
                  case "HTML":
                  case "BODY":
                    Qu(c);
                    break;
                  default:
                    c.textContent = "";
                }
            }
            break;
          case 5:
          case 26:
          case 27:
          case 6:
          case 4:
          case 17:
            break;
          case 30:
            c && o !== null && (c = o, o = a, a = dc(
              c.memoizedProps,
              c.stateNode
            ), o = o.memoizedProps, o = hc(
              o.default,
              o.update
            ), o !== "none" && Pf(
              c,
              a,
              o,
              c.memoizedState = [],
              !0
            ));
            break;
          default:
            if ((f & 1024) !== 0)
              throw Error(
                "This unit of work tag should not have side-effects. This error is likely caused by a bug in React. Please file an issue."
              );
        }
        if (c = e.sibling, c !== null) {
          c.return = e.return, Ll = c;
          break;
        }
        Ll = e.return;
      }
    }
    function O0(t, e, a) {
      var c = Ta(), o = Le(), f = cl(), d = Vn(), h = a.flags;
      switch (a.tag) {
        case 0:
        case 11:
        case 15:
          dn(t, a), h & 4 && ky(a, ru | ec);
          break;
        case 1:
          if (dn(t, a), h & 4)
            if (t = a.stateNode, e === null)
              a.type.defaultProps || "ref" in a.memoizedProps || qm || (t.props !== a.memoizedProps && console.error(
                "Expected %s props to match memoized props before componentDidMount. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.",
                tt(a) || "instance"
              ), t.state !== a.memoizedState && console.error(
                "Expected %s state to match memoized state before componentDidMount. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.",
                tt(a) || "instance"
              )), rn(a) ? (Ja(), $(
                a,
                e2,
                a,
                t
              ), kl()) : $(
                a,
                e2,
                a,
                t
              );
            else {
              var y = Uc(
                a.type,
                e.memoizedProps
              );
              e = e.memoizedState, a.type.defaultProps || "ref" in a.memoizedProps || qm || (t.props !== a.memoizedProps && console.error(
                "Expected %s props to match memoized props before componentDidUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.",
                tt(a) || "instance"
              ), t.state !== a.memoizedState && console.error(
                "Expected %s state to match memoized state before componentDidUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.",
                tt(a) || "instance"
              )), rn(a) ? (Ja(), $(
                a,
                OT,
                a,
                t,
                y,
                e,
                t.__reactInternalSnapshotBeforeUpdate
              ), kl()) : $(
                a,
                OT,
                a,
                t,
                y,
                e,
                t.__reactInternalSnapshotBeforeUpdate
              );
            }
          h & 64 && $1(a), h & 512 && tu(a, a.return);
          break;
        case 3:
          if (e = pc(), dn(t, a), h & 64 && (h = a.updateQueue, h !== null)) {
            if (y = null, a.child !== null)
              switch (a.child.tag) {
                case 27:
                case 5:
                  y = a.child.stateNode;
                  break;
                case 1:
                  y = a.child.stateNode;
              }
            try {
              $(
                a,
                wh,
                h,
                y
              );
            } catch (p) {
              at(a, a.return, p);
            }
          }
          t.effectDuration += Yh(e);
          break;
        case 27:
          e === null && h & 4 && p0(a);
        case 26:
        case 5:
          if (dn(t, a), e === null) {
            if (h & 4) y0(a);
            else if (h & 64) {
              t = a.type, e = a.memoizedProps, y = a.stateNode;
              try {
                $(
                  a,
                  ds,
                  y,
                  t,
                  e,
                  a
                );
              } catch (p) {
                at(
                  a,
                  a.return,
                  p
                );
              }
            }
          }
          h & 512 && tu(a, a.return);
          break;
        case 12:
          if (h & 4) {
            h = pc(), dn(t, a), t = a.stateNode, t.effectDuration += br(h);
            try {
              $(
                a,
                Jr,
                a,
                e,
                cf,
                t.effectDuration
              );
            } catch (p) {
              at(a, a.return, p);
            }
          } else dn(t, a);
          break;
        case 31:
          dn(t, a), h & 4 && ep(t, a);
          break;
        case 13:
          dn(t, a), h & 4 && cv(t, a), h & 64 && (t = a.memoizedState, t !== null && (t = t.dehydrated, t !== null && (h = ip.bind(
            null,
            a
          ), zp(t, h))));
          break;
        case 22:
          if (h = a.memoizedState !== null || Zl, !h) {
            var v = e !== null && e.memoizedState !== null || ie;
            e = Zl, y = ie, Zl = h, (ie = v) && !y ? (h = OS, (a.subtreeFlags & 8772) !== 0 && (h |= v2), aa(
              t,
              a,
              h
            ), (a.mode & zt) !== rt && 0 <= nt && 0 <= it && 0.05 < it - nt && Mf(
              a,
              nt,
              it
            )) : dn(t, a), Zl = e, ie = y;
          }
          break;
        case 30:
          h & 18874368 && Ho(a), dn(t, a), h & 512 && tu(a, a.return);
          break;
        case 7:
          h & 512 && tu(a, a.return);
        default:
          dn(t, a);
      }
      (a.mode & zt) !== rt && 0 <= nt && 0 <= it && ((we || 0.05 < Ne) && Du(
        a,
        nt,
        it,
        Ne,
        Oe
      ), a.alternate === null && a.return !== null && a.return.alternate !== null && 0.05 < it - nt && (uv(
        a.return.alternate,
        a.return
      ) || Ou(
        a,
        nt,
        it,
        "Mount"
      ))), Il(c), _u(o), Oe = f, we = d;
    }
    function kr(t, e) {
      for (t = t.child; t !== null; )
        D0(t, e), t = t.sibling;
    }
    function D0(t, e) {
      switch (t.tag) {
        case 5:
        case 26:
          try {
            var a = t.stateNode;
            e ? $(t, mp, a) : $(
              t,
              Cv,
              t.stateNode,
              t.memoizedProps
            );
          } catch (f) {
            at(t, t.return, f);
          }
          C0(t, e);
          break;
        case 6:
          try {
            var c = t.stateNode;
            e ? $(t, yp, c) : $(
              t,
              fb,
              c,
              t.memoizedProps
            ), Lt = !0;
          } catch (f) {
            at(t, t.return, f);
          }
          break;
        case 18:
          try {
            var o = t.stateNode;
            e ? $(
              t,
              hp,
              o
            ) : $(
              t,
              K0,
              t.stateNode
            );
          } catch (f) {
            at(t, t.return, f);
          }
          break;
        case 22:
        case 23:
          t.memoizedState === null && kr(t, e);
          break;
        default:
          kr(t, e);
      }
    }
    function C0(t, e) {
      if (t.subtreeFlags & 67108864)
        for (t = t.child; t !== null; ) {
          t: {
            var a = t, c = e;
            switch (a.tag) {
              case 4:
                D0(a, c);
                break t;
              case 22:
                a.memoizedState === null && C0(a, c);
                break t;
              default:
                C0(a, c);
            }
          }
          t = t.sibling;
        }
    }
    function R0(t) {
      var e = t.alternate;
      e !== null && (t.alternate = null, R0(e)), t.child = null, t.deletions = null, t.sibling = null, t.tag === 5 && (e = t.stateNode, e !== null && Ml(e)), t.stateNode = null, t._debugOwner = null, t.return = null, t.dependencies = null, t.memoizedProps = null, t.memoizedState = null, t.pendingProps = null, t.stateNode = null, t.updateQueue = null;
    }
    function Aa(t, e, a) {
      for (a = a.child; a !== null; )
        Pr(
          t,
          e,
          a
        ), a = a.sibling;
    }
    function Pr(t, e, a) {
      if (ll && typeof ll.onCommitFiberUnmount == "function")
        try {
          ll.onCommitFiberUnmount(Ds, a);
        } catch (v) {
          Pa || (Pa = !0, console.error(
            "React instrumentation encountered an error: %o",
            v
          ));
        }
      var c = Ta(), o = Le(), f = cl(), d = Vn();
      switch (a.tag) {
        case 26:
          ie || il(a, e), Aa(
            t,
            e,
            a
          ), a.memoizedState ? a.memoizedState.count-- : a.stateNode && !ie && (t = a.stateNode, t.parentNode.removeChild(t));
          break;
        case 27:
          ie || il(a, e), _o(a);
          var h = dl, y = On;
          fa(a.type) && (dl = a.stateNode, On = !1), Aa(
            t,
            e,
            a
          ), $(
            a,
            Ut,
            a.stateNode,
            a.type,
            a.memoizedProps
          ), dl = h, On = y;
          break;
        case 5:
          ie || il(a, e), _o(a);
        case 6:
          if (a.tag === 6 && _o(a), h = dl, y = On, dl = null, Aa(
            t,
            e,
            a
          ), dl = h, On = y, dl !== null)
            if (On)
              try {
                $(
                  a,
                  Ov,
                  dl,
                  a.stateNode
                ), Lt = !0;
              } catch (v) {
                at(
                  a,
                  e,
                  v
                );
              }
            else
              try {
                $(
                  a,
                  J0,
                  dl,
                  a.stateNode
                ), Lt = !0;
              } catch (v) {
                at(
                  a,
                  e,
                  v
                );
              }
          break;
        case 18:
          dl !== null && (On ? (t = dl, Zo(
            t.nodeType === 9 ? t.body : t.nodeName === "HTML" ? t.ownerDocument.body : t,
            a.stateNode
          ), $o(t)) : Zo(dl, a.stateNode));
          break;
        case 4:
          h = dl, y = On, dl = a.stateNode.containerInfo, On = !0, Aa(
            t,
            e,
            a
          ), dl = h, On = y;
          break;
        case 0:
        case 11:
        case 14:
        case 15:
          Mo(
            ln,
            a,
            e
          ), ie || r0(
            a,
            e,
            ru
          ), Aa(
            t,
            e,
            a
          );
          break;
        case 1:
          ie || (il(a, e), h = a.stateNode, typeof h.componentWillUnmount == "function" && d0(
            a,
            e,
            h
          )), Aa(
            t,
            e,
            a
          );
          break;
        case 21:
          Aa(
            t,
            e,
            a
          );
          break;
        case 22:
          ie = (h = ie) || a.memoizedState !== null, Aa(
            t,
            e,
            a
          ), ie = h;
          break;
        case 30:
          a.flags & 18874368 && A0(a), il(a, e), Aa(
            t,
            e,
            a
          );
          break;
        case 7:
          ie || il(a, e), Aa(
            t,
            e,
            a
          );
          break;
        default:
          Aa(
            t,
            e,
            a
          );
      }
      (a.mode & zt) !== rt && 0 <= nt && 0 <= it && (we || 0.05 < Ne) && Du(
        a,
        nt,
        it,
        Ne,
        Oe
      ), Il(c), _u(o), Oe = f, we = d;
    }
    function ep(t, e) {
      if (e.memoizedState === null && (t = e.alternate, t !== null && (t = t.memoizedState, t !== null))) {
        t = t.dehydrated;
        try {
          $(
            e,
            xv,
            t
          );
        } catch (a) {
          at(e, e.return, a);
        }
      }
    }
    function cv(t, e) {
      if (e.memoizedState === null && (t = e.alternate, t !== null && (t = t.memoizedState, t !== null && (t = t.dehydrated, t !== null))))
        try {
          $(
            e,
            vb,
            t
          );
        } catch (a) {
          at(e, e.return, a);
        }
    }
    function lp(t) {
      switch (t.tag) {
        case 31:
        case 13:
        case 19:
          var e = t.stateNode;
          return e === null && (e = t.stateNode = new d3()), e;
        case 22:
          return t = t.stateNode, e = t._retryCache, e === null && (e = t._retryCache = new d3()), e;
        default:
          throw Error(
            "Unexpected Suspense handler tag (" + t.tag + "). This is a bug in React."
          );
      }
    }
    function Bo(t, e) {
      var a = lp(t);
      e.forEach(function(c) {
        if (!a.has(c)) {
          if (a.add(c), Ju)
            if (Gm !== null && Vm !== null)
              cs(Vm, Gm);
            else
              throw Error(
                "Expected finished root and lanes to be set. This is a bug in React."
              );
          var o = op.bind(null, t, c);
          c.then(o, o);
        }
      });
    }
    function El(t, e, a) {
      var c = e.deletions;
      if (c !== null)
        for (var o = 0; o < c.length; o++) {
          var f = t, d = e, h = c[o], y = Ta(), v = d;
          t: for (; v !== null; ) {
            switch (v.tag) {
              case 27:
                if (fa(v.type)) {
                  dl = v.stateNode, On = !1;
                  break t;
                }
                break;
              case 5:
                dl = v.stateNode, On = !1;
                break t;
              case 3:
              case 4:
                dl = v.stateNode.containerInfo, On = !0;
                break t;
            }
            v = v.return;
          }
          if (dl === null)
            throw Error(
              "Expected to find a host parent. This error is likely caused by a bug in React. Please file an issue."
            );
          Pr(f, d, h), dl = null, On = !1, (h.mode & zt) !== rt && 0 <= nt && 0 <= it && 0.05 < it - nt && Ou(
            h,
            nt,
            it,
            "Unmount"
          ), Il(y), f = h, d = f.alternate, d !== null && (d.return = null), f.return = null;
        }
      if (e.subtreeFlags & 13886)
        for (e = e.child; e !== null; )
          M0(e, t, a), e = e.sibling;
    }
    function M0(t, e, a) {
      var c = Ta(), o = Le(), f = cl(), d = Vn(), h = t.alternate, y = t.flags;
      switch (t.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          if (y & 4 && (h = t.updateQueue, h = h !== null ? h.events : null, h !== null))
            for (var v = 0; v < h.length; v++) {
              var p = h[v];
              p.ref.impl = p.nextImpl;
            }
          El(e, t, a), xl(t), y & 4 && (Mo(
            ln | ec,
            t,
            t.return
          ), Ro(ln | ec, t), r0(
            t,
            t.return,
            ru | ec
          ));
          break;
        case 1:
          El(e, t, a), xl(t), y & 512 && (ie || h === null || il(h, h.return)), y & 64 && Zl && (e = t.updateQueue, e !== null && (a = e.callbacks, a !== null && (y = e.shared.hiddenCallbacks, e.shared.hiddenCallbacks = y === null ? a : y.concat(a))));
          break;
        case 26:
          if (v = Fc, El(e, t, a), xl(t), y & 512 && (ie || h === null || il(h, h.return)), y & 4)
            if (y = h !== null ? h.memoizedState : null, a = t.memoizedState, h === null)
              if (a === null)
                if (t.stateNode === null)
                  if (Zl)
                    t.stateNode = zv(
                      t.type,
                      t.memoizedProps,
                      e.containerInfo,
                      t
                    );
                  else {
                    t: {
                      e = t.type, a = t.memoizedProps, y = v.ownerDocument || v;
                      e: switch (e) {
                        case "title":
                          h = y.getElementsByTagName("title")[0], (!h || h[Tn] || h[zl] || h.namespaceURI === I || h.hasAttribute("itemprop")) && (h = y.createElement(e), y.head.insertBefore(
                            h,
                            y.querySelector("head > title")
                          )), Ke(h, e, a), h[zl] = t, qe(h), e = h;
                          break t;
                        case "link":
                          if (v = fl(
                            "link",
                            "href",
                            y
                          ).get(e + (a.href || ""))) {
                            for (p = 0; p < v.length; p++)
                              if (h = v[p], h.getAttribute("href") === (a.href == null || a.href === "" ? null : a.href) && h.getAttribute("rel") === (a.rel == null ? null : a.rel) && h.getAttribute("title") === (a.title == null ? null : a.title) && h.getAttribute("crossorigin") === (a.crossOrigin == null ? null : a.crossOrigin)) {
                                v.splice(p, 1);
                                break e;
                              }
                          }
                          h = y.createElement(e), Ke(h, e, a), y.head.appendChild(h);
                          break;
                        case "meta":
                          if (v = fl(
                            "meta",
                            "content",
                            y
                          ).get(e + (a.content || ""))) {
                            for (p = 0; p < v.length; p++)
                              if (h = v[p], ne(
                                a.content,
                                "content"
                              ), h.getAttribute("content") === (a.content == null ? null : "" + a.content) && h.getAttribute("name") === (a.name == null ? null : a.name) && h.getAttribute("property") === (a.property == null ? null : a.property) && h.getAttribute("http-equiv") === (a.httpEquiv == null ? null : a.httpEquiv) && h.getAttribute("charset") === (a.charSet == null ? null : a.charSet)) {
                                v.splice(p, 1);
                                break e;
                              }
                          }
                          h = y.createElement(e), Ke(h, e, a), y.head.appendChild(h);
                          break;
                        default:
                          throw Error(
                            'getNodesForType encountered a type it did not expect: "' + e + '". This is a bug in React.'
                          );
                      }
                      h[zl] = t, qe(h), e = h;
                    }
                    t.stateNode = e;
                  }
                else
                  Zl || Gv(
                    v,
                    t.type,
                    t.stateNode
                  );
              else
                t.stateNode = qv(
                  v,
                  a,
                  t.memoizedProps
                );
            else
              y !== a ? (y === null ? (e = h.stateNode, e === null || ie || e.parentNode.removeChild(e)) : y.count--, a === null ? Zl || Gv(
                v,
                t.type,
                t.stateNode
              ) : qv(v, a, t.memoizedProps)) : a === null && t.stateNode !== null && Bc(
                t,
                t.memoizedProps,
                h.memoizedProps
              );
          break;
        case 27:
          El(e, t, a), xl(t), y & 512 && (ie || h === null || il(h, h.return)), h !== null && y & 4 && Bc(
            t,
            t.memoizedProps,
            h.memoizedProps
          );
          break;
        case 5:
          if (v = Ji, Ji = !1, El(e, t, a), Ji = v, xl(t), y & 512 && (ie || h === null || il(h, h.return)), t.flags & 32) {
            e = t.stateNode;
            try {
              $(t, Av, e), Lt = !0;
            } catch (j) {
              at(t, t.return, j);
            }
          }
          y & 4 && t.stateNode != null && (e = t.memoizedProps, Bc(
            t,
            e,
            h !== null ? h.memoizedProps : e
          )), y & 1024 && (g2 = !0, t.type !== "form" && console.error(
            "Unexpected host component type. Expected a form. This is a bug in React."
          ));
          break;
        case 6:
          if (El(e, t, a), xl(t), y & 4) {
            if (t.stateNode === null)
              throw Error(
                "This should have a text node initialized. This error is likely caused by a bug in React. Please file an issue."
              );
            e = t.memoizedProps, a = h !== null ? h.memoizedProps : e, y = t.stateNode;
            try {
              $(
                t,
                rp,
                y,
                a,
                e
              ), Lt = !0;
            } catch (j) {
              at(t, t.return, j);
            }
          }
          break;
        case 3:
          if (v = pc(), Lt = !1, FS = null, p = Fc, Fc = xi(e.containerInfo), El(e, t, a), Fc = p, xl(t), y & 4 && h !== null && h.memoizedState.isDehydrated)
            try {
              $(
                t,
                Bv,
                e.containerInfo
              );
            } catch (j) {
              at(t, t.return, j);
            }
          g2 && (g2 = !1, Yu(t)), e.effectDuration += Yh(v), Lt = !1;
          break;
        case 4:
          y = Ji, Ji = Zl, h = v1(), v = Fc, Fc = xi(
            t.stateNode.containerInfo
          ), El(e, t, a), xl(t), Fc = v, Lt && Jg && (DS = !0), Lt = h, Ji = y;
          break;
        case 12:
          y = pc(), El(e, t, a), xl(t), t.stateNode.effectDuration += br(y);
          break;
        case 31:
          El(e, t, a), xl(t), y & 4 && (e = t.updateQueue, e !== null && (t.updateQueue = null, Bo(t, e)));
          break;
        case 13:
          El(e, t, a), xl(t), t.child.flags & 8192 && t.memoizedState !== null != (h !== null && h.memoizedState !== null) && (NS = Ue()), y & 4 && (e = t.updateQueue, e !== null && (t.updateQueue = null, Bo(t, e)));
          break;
        case 22:
          v = t.memoizedState !== null, p = h !== null && h.memoizedState !== null;
          var z = Zl, E = ie, M = Ji;
          Zl = z || v, Ji = M || v, ie = E || p, El(e, t, a), ie = E, Ji = M, Zl = z, p && !v && !z && !E && (t.mode & zt) !== rt && 0 <= nt && 0 <= it && 0.05 < it - nt && Mf(
            t,
            nt,
            it
          ), xl(t), y & 8192 && (e = t.stateNode, e._visibility = v ? e._visibility & ~Ag : e._visibility | Ag, !v || h === null || p || Zl || ie || (e = OS, a = p || ie, h = Zl, p = ie, Zl = v || Zl, ie = a, Gu(t, e), (t.mode & zt) !== rt && 0 <= nt && 0 <= it && 0.05 < it - nt && Ou(
            t,
            nt,
            it,
            "Disconnect"
          ), Zl = h, ie = p), !v && Ji || kr(t, v)), y & 4 && (e = t.updateQueue, e !== null && (a = e.retryQueue, a !== null && (e.retryQueue = null, Bo(t, a))));
          break;
        case 19:
          El(e, t, a), xl(t), y & 4 && (e = t.updateQueue, e !== null && (t.updateQueue = null, Bo(t, e)));
          break;
        case 30:
          y & 512 && (ie || h === null || il(h, h.return)), y = v1(), v = Jg, p = (a & 335544064) === a, z = t.memoizedProps, Jg = p && hc(
            z.default,
            z.update
          ) !== "none", El(e, t, a), xl(t), p && h !== null && Lt && (t.flags |= 4), Jg = v, Lt = y;
          break;
        case 21:
          break;
        case 7:
          y & 512 && (ie || h === null || il(h, h.return)), h && h.stateNode !== null && (h.stateNode._fragmentFiber = t);
        default:
          El(e, t, a), xl(t);
      }
      (t.mode & zt) !== rt && 0 <= nt && 0 <= it && ((we || 0.05 < Ne) && Du(
        t,
        nt,
        it,
        Ne,
        Oe
      ), t.alternate === null && t.return !== null && t.return.alternate !== null && 0.05 < it - nt && (uv(
        t.return.alternate,
        t.return
      ) || Ou(
        t,
        nt,
        it,
        "Mount"
      ))), Il(c), _u(o), Oe = f, we = d;
    }
    function xl(t) {
      var e = t.flags;
      if (e & 2) {
        try {
          $(t, k1, t);
        } catch (a) {
          at(t, t.return, a);
        }
        t.flags &= -3;
      }
      e & 4096 && (t.flags &= -4097);
    }
    function Yu(t) {
      if (t.subtreeFlags & 1024)
        for (t = t.child; t !== null; ) {
          var e = t;
          Yu(e), e.tag === 5 && e.flags & 1024 && (e = e.stateNode, Im = !0, e.reset(), Im = !1), t = t.sibling;
        }
    }
    function Di(t, e) {
      if (e.subtreeFlags & 9270)
        for (e = e.child; e !== null; )
          ap(e, t), e = e.sibling;
      else P1(e);
    }
    function ap(t, e) {
      var a = t.alternate;
      if (a === null) b0(t, !1);
      else
        switch (t.tag) {
          case 3:
            if (p2 = Ki = !1, av(), Di(e, t), !Ki && !DS) {
              if (t = Li, t !== null)
                for (var c = 0; c < t.length; c += 3) {
                  a = t[c];
                  var o = t[c + 1];
                  Rv(a, t[c + 2]), a = a.ownerDocument.documentElement, a !== null && a.animate(
                    { opacity: [0, 0], pointerEvents: ["none", "none"] },
                    {
                      duration: 0,
                      fill: "forwards",
                      pseudoElement: "::view-transition-group(" + o + ")"
                    }
                  );
                }
              t = e.containerInfo, t = t.nodeType === 9 ? t.documentElement : t.ownerDocument.documentElement, t !== null && t.style.viewTransitionName === "" && (t.style.viewTransitionName = "none", t.animate(
                { opacity: [0, 0], pointerEvents: ["none", "none"] },
                {
                  duration: 0,
                  fill: "forwards",
                  pseudoElement: "::view-transition-group(root)"
                }
              ), t.animate(
                { width: [0, 0], height: [0, 0] },
                {
                  duration: 0,
                  fill: "forwards",
                  pseudoElement: "::view-transition"
                }
              )), p2 = !0;
            }
            Li = null;
            break;
          case 5:
            Di(e, t);
            break;
          case 4:
            c = Ki, Ki = !1, Di(e, t), Ki && (DS = !0), Ki = c;
            break;
          case 22:
            t.memoizedState === null && (a.memoizedState !== null ? b0(t, !1) : Di(e, t));
            break;
          case 30:
            c = Ki, o = av(), Ki = !1, Di(e, t), Ki && (t.flags |= 4);
            var f = t.memoizedProps, d = t.stateNode;
            e = dc(f, d), d = dc(a.memoizedProps, d);
            var h = hc(
              f.default,
              f.update
            );
            h === "none" ? e = !1 : (f = a.memoizedState, a.memoizedState = null, a = t.child, An = 0, e = z0(
              t,
              a,
              e,
              d,
              h,
              f,
              !0
            ), An !== (f === null ? 0 : f.length) && (t.flags |= 32)), (t.flags & 4) !== 0 && e ? (Ri(
              t,
              t.memoizedProps.onUpdate
            ), Li = o) : o !== null && (o.push.apply(o, Li), Li = o), Ki = (t.flags & 32) !== 0 ? !0 : c;
            break;
          default:
            Di(e, t);
        }
    }
    function dn(t, e) {
      if (e.subtreeFlags & 8772)
        for (e = e.child; e !== null; )
          O0(t, e.alternate, e), e = e.sibling;
    }
    function qu(t, e) {
      var a = Ta(), c = Le(), o = cl(), f = Vn();
      switch (t.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          r0(
            t,
            t.return,
            ru
          ), Gu(
            t,
            e
          );
          break;
        case 1:
          il(t, t.return);
          var d = t.stateNode;
          typeof d.componentWillUnmount == "function" && d0(
            t,
            t.return,
            d
          ), Gu(
            t,
            e
          );
          break;
        case 27:
          (e & OS) !== Lg && $(
            t,
            Ut,
            t.stateNode,
            t.type,
            t.memoizedProps
          );
        case 5:
          il(t, t.return), t.tag !== 5 && t.tag !== 27 || _o(t), Gu(
            t,
            e
          );
          break;
        case 6:
          _o(t);
          break;
        case 26:
          il(t, t.return), d = t.stateNode, t.memoizedState !== null || d === null || ie || d.parentNode.removeChild(d), Gu(
            t,
            e
          );
          break;
        case 22:
          t.memoizedState === null && Gu(
            t,
            e
          );
          break;
        case 30:
          t.flags & 18874368 && A0(t), il(t, t.return), Gu(
            t,
            e
          );
          break;
        case 7:
          il(t, t.return);
        default:
          Gu(
            t,
            e
          );
      }
      (t.mode & zt) !== rt && 0 <= nt && 0 <= it && (we || 0.05 < Ne) && Du(
        t,
        nt,
        it,
        Ne,
        Oe
      ), Il(a), _u(c), Oe = o, we = f;
    }
    function Gu(t, e) {
      for (t = t.child; t !== null; )
        qu(t, e), t = t.sibling;
    }
    function iv(t, e, a, c) {
      var o = Ta(), f = Le(), d = cl(), h = Vn(), y = a.flags, v = (c & v2) !== Lg;
      switch (a.tag) {
        case 0:
        case 11:
        case 15:
          aa(
            t,
            a,
            c
          ), ky(a, ru);
          break;
        case 1:
          if (aa(
            t,
            a,
            c
          ), e = a.stateNode, typeof e.componentDidMount == "function" && $(
            a,
            e2,
            a,
            e
          ), e = a.updateQueue, e !== null) {
            t = a.stateNode;
            try {
              $(
                a,
                fn,
                e,
                t
              );
            } catch (z) {
              at(a, a.return, z);
            }
          }
          v && y & 64 && $1(a), tu(a, a.return);
          break;
        case 27:
          (c & OS) !== Lg && p0(a);
        case 5:
          a.tag !== 5 && a.tag !== 27 || I1(a), aa(
            t,
            a,
            c
          ), v && e === null && y & 4 && y0(a), tu(a, a.return);
          break;
        case 6:
          I1(a);
          break;
        case 26:
          var p = a.stateNode;
          a.memoizedState !== null || p === null || Zl || Gv(
            xi(p.ownerDocument),
            a.type,
            p
          ), aa(
            t,
            a,
            c
          ), v && e === null && y & 4 && y0(a), tu(a, a.return);
          break;
        case 12:
          if (v && y & 4) {
            y = pc(), aa(
              t,
              a,
              c
            ), v = a.stateNode, v.effectDuration += br(y);
            try {
              $(
                a,
                Jr,
                a,
                e,
                cf,
                v.effectDuration
              );
            } catch (z) {
              at(a, a.return, z);
            }
          } else
            aa(
              t,
              a,
              c
            );
          break;
        case 31:
          aa(
            t,
            a,
            c
          ), v && y & 4 && ep(t, a);
          break;
        case 13:
          aa(
            t,
            a,
            c
          ), v && y & 4 && cv(t, a);
          break;
        case 22:
          a.memoizedState === null && aa(
            t,
            a,
            c
          ), tu(a, a.return);
          break;
        case 30:
          aa(
            t,
            a,
            c
          ), y & 18874368 && Ho(a), tu(a, a.return);
          break;
        case 7:
          tu(a, a.return);
        default:
          aa(
            t,
            a,
            c
          );
      }
      (a.mode & zt) !== rt && 0 <= nt && 0 <= it && (we || 0.05 < Ne) && Du(
        a,
        nt,
        it,
        Ne,
        Oe
      ), Il(o), _u(f), Oe = d, we = h;
    }
    function aa(t, e, a) {
      for (a = (e.subtreeFlags & 8772) !== 0 ? a : a & ~v2, e = e.child; e !== null; )
        iv(
          t,
          e.alternate,
          e,
          a
        ), e = e.sibling;
    }
    function xo(t, e) {
      var a = null;
      t !== null && t.memoizedState !== null && t.memoizedState.cachePool !== null && (a = t.memoizedState.cachePool.pool), t = null, e.memoizedState !== null && e.memoizedState.cachePool !== null && (t = e.memoizedState.cachePool.pool), t !== a && (t != null && gc(t), a != null && Bf(a));
    }
    function ue(t, e) {
      t = null, e.alternate !== null && (t = e.alternate.memoizedState.cache), e = e.memoizedState.cache, e !== t && (gc(e), t != null && Bf(t));
    }
    function hn(t, e, a, c, o) {
      var f = (a & 335544064) === a;
      if (e.subtreeFlags & (f ? 10262 : 10256) || e.actualDuration !== 0 && (e.alternate === null || e.alternate.child !== e.child))
        for (e = e.child; e !== null; )
          f = e.sibling, np(
            t,
            e,
            a,
            c,
            f !== null ? f.actualStartTime : o
          ), e = f;
      else
        f && Wr(e);
    }
    function np(t, e, a, c, o) {
      var f = Ta(), d = Le(), h = cl(), y = Vn(), v = _s, p = (a & 335544064) === a;
      p && e.alternate === null && e.return !== null && e.return.alternate !== null && Fr(e);
      var z = e.flags;
      switch (e.tag) {
        case 0:
        case 11:
        case 15:
          (e.mode & zt) !== rt && 0 < e.actualStartTime && (e.flags & 1) !== 0 && Ah(
            e,
            e.actualStartTime,
            o,
            Ol,
            a
          ), hn(
            t,
            e,
            a,
            c,
            o
          ), z & 2048 && Py(e, Ya | ec);
          break;
        case 1:
          (e.mode & zt) !== rt && 0 < e.actualStartTime && ((e.flags & 128) !== 0 ? gy(
            e,
            e.actualStartTime,
            o,
            []
          ) : (e.flags & 1) !== 0 && Ah(
            e,
            e.actualStartTime,
            o,
            Ol,
            a
          )), hn(
            t,
            e,
            a,
            c,
            o
          );
          break;
        case 3:
          var E = pc(), M = Ol;
          Ol = e.alternate !== null && e.alternate.memoizedState.isDehydrated && (e.flags & 256) === 0, hn(
            t,
            e,
            a,
            c,
            o
          ), Ol = M, p && p2 && (a = t.containerInfo, a = a.nodeType === 9 ? a.body : a.nodeName === "HTML" ? a.ownerDocument.body : a, a.style.viewTransitionName === "root" && (a.style.viewTransitionName = ""), a = a.ownerDocument.documentElement, a !== null && a.style.viewTransitionName === "none" && (a.style.viewTransitionName = "")), z & 2048 && (a = null, e.alternate !== null && (a = e.alternate.memoizedState.cache), c = e.memoizedState.cache, c !== a && (gc(c), a != null && Bf(a))), t.passiveEffectDuration += Yh(
            E
          );
          break;
        case 12:
          if (z & 2048) {
            z = pc(), hn(
              t,
              e,
              a,
              c,
              o
            ), t = e.stateNode, t.passiveEffectDuration += br(z);
            try {
              $(
                e,
                W1,
                e,
                e.alternate,
                cf,
                t.passiveEffectDuration
              );
            } catch (j) {
              at(e, e.return, j);
            }
          } else
            hn(
              t,
              e,
              a,
              c,
              o
            );
          break;
        case 31:
          z = Ol, E = e.alternate !== null ? e.alternate.memoizedState : null, p = e.memoizedState, E !== null && p === null ? (p = e.deletions, p !== null && 0 < p.length && p[0].tag === 18 ? (Ol = !1, E = E.hydrationErrors, E !== null && gy(
            e,
            e.actualStartTime,
            o,
            E
          )) : Ol = !0) : Ol = !1, hn(
            t,
            e,
            a,
            c,
            o
          ), Ol = z;
          break;
        case 13:
          z = Ol, E = e.alternate !== null ? e.alternate.memoizedState : null, p = e.memoizedState, E === null || E.dehydrated === null || p !== null && p.dehydrated !== null ? Ol = !1 : (p = e.deletions, p !== null && 0 < p.length && p[0].tag === 18 ? (Ol = !1, E = E.hydrationErrors, E !== null && gy(
            e,
            e.actualStartTime,
            o,
            E
          )) : Ol = !0), hn(
            t,
            e,
            a,
            c,
            o
          ), Ol = z;
          break;
        case 23:
          break;
        case 22:
          M = e.stateNode, E = e.alternate, e.memoizedState !== null ? (p && E !== null && E.memoizedState === null && Fr(E), M._visibility & lf ? hn(
            t,
            e,
            a,
            c,
            o
          ) : mn(
            t,
            e,
            a,
            c,
            o
          )) : (p && E !== null && E.memoizedState !== null && Fr(e), M._visibility & lf ? hn(
            t,
            e,
            a,
            c,
            o
          ) : (M._visibility |= lf, Yo(
            t,
            e,
            a,
            c,
            (e.subtreeFlags & 10256) !== 0 || e.actualDuration !== 0 && (e.alternate === null || e.alternate.child !== e.child),
            o
          ), (e.mode & zt) === rt || Ol || (t = e.actualStartTime, 0 <= t && 0.05 < o - t && Mf(
            e,
            t,
            o
          ), 0 <= nt && 0 <= it && 0.05 < it - nt && Mf(
            e,
            nt,
            it
          )))), z & 2048 && xo(
            E,
            e
          );
          break;
        case 24:
          hn(
            t,
            e,
            a,
            c,
            o
          ), z & 2048 && ue(e.alternate, e);
          break;
        case 30:
          p && (z = e.alternate, z !== null && (ae(z.child, !0), ae(e.child, !0))), hn(
            t,
            e,
            a,
            c,
            o
          );
          break;
        default:
          hn(
            t,
            e,
            a,
            c,
            o
          );
      }
      (e.mode & zt) !== rt && ((t = !Ol && e.alternate === null && e.return !== null && e.return.alternate !== null) && (a = e.actualStartTime, 0 <= a && 0.05 < o - a && Ou(
        e,
        a,
        o,
        "Mount"
      )), 0 <= nt && 0 <= it && ((we || 0.05 < Ne) && Du(
        e,
        nt,
        it,
        Ne,
        Oe
      ), t && 0.05 < it - nt && Ou(
        e,
        nt,
        it,
        "Mount"
      ))), Il(f), _u(d), Oe = h, we = y, _s = v;
    }
    function Yo(t, e, a, c, o, f) {
      for (o = o && ((e.subtreeFlags & 10256) !== 0 || e.actualDuration !== 0 && (e.alternate === null || e.alternate.child !== e.child)), e = e.child; e !== null; ) {
        var d = e.sibling;
        ts(
          t,
          e,
          a,
          c,
          o,
          d !== null ? d.actualStartTime : f
        ), e = d;
      }
    }
    function ts(t, e, a, c, o, f) {
      var d = Ta(), h = Le(), y = cl(), v = Vn(), p = _s;
      o && (e.mode & zt) !== rt && 0 < e.actualStartTime && (e.flags & 1) !== 0 && Ah(
        e,
        e.actualStartTime,
        f,
        Ol,
        a
      );
      var z = e.flags;
      switch (e.tag) {
        case 0:
        case 11:
        case 15:
          Yo(
            t,
            e,
            a,
            c,
            o,
            f
          ), Py(e, Ya);
          break;
        case 23:
          break;
        case 22:
          var E = e.stateNode;
          e.memoizedState !== null ? E._visibility & lf ? Yo(
            t,
            e,
            a,
            c,
            o,
            f
          ) : mn(
            t,
            e,
            a,
            c,
            f
          ) : (E._visibility |= lf, Yo(
            t,
            e,
            a,
            c,
            o,
            f
          )), o && z & 2048 && xo(
            e.alternate,
            e
          );
          break;
        case 24:
          Yo(
            t,
            e,
            a,
            c,
            o,
            f
          ), o && z & 2048 && ue(e.alternate, e);
          break;
        default:
          Yo(
            t,
            e,
            a,
            c,
            o,
            f
          );
      }
      (e.mode & zt) !== rt && 0 <= nt && 0 <= it && (we || 0.05 < Ne) && Du(
        e,
        nt,
        it,
        Ne,
        Oe
      ), Il(d), _u(h), Oe = y, we = v, _s = p;
    }
    function mn(t, e, a, c, o) {
      if (e.subtreeFlags & 10256 || e.actualDuration !== 0 && (e.alternate === null || e.alternate.child !== e.child))
        for (var f = e.child; f !== null; ) {
          e = f.sibling;
          var d = t, h = a, y = c, v = e !== null ? e.actualStartTime : o, p = _s;
          (f.mode & zt) !== rt && 0 < f.actualStartTime && (f.flags & 1) !== 0 && Ah(
            f,
            f.actualStartTime,
            v,
            Ol,
            h
          );
          var z = f.flags;
          switch (f.tag) {
            case 22:
              mn(
                d,
                f,
                h,
                y,
                v
              ), z & 2048 && xo(f.alternate, f);
              break;
            case 24:
              mn(
                d,
                f,
                h,
                y,
                v
              ), z & 2048 && ue(f.alternate, f);
              break;
            default:
              mn(
                d,
                f,
                h,
                y,
                v
              );
          }
          _s = p, f = e;
        }
    }
    function Ci(t, e, a) {
      if (t.subtreeFlags & $d)
        for (t = t.child; t !== null; )
          ov(
            t,
            e,
            a
          ), t = t.sibling;
    }
    function ov(t, e, a) {
      switch (t.tag) {
        case 26:
          Ci(
            t,
            e,
            a
          ), t.flags & $d && (t.memoizedState !== null ? Ed(
            a,
            Fc,
            t.memoizedState,
            t.memoizedProps
          ) : (t = t.stateNode, (e & 335544128) === e && am(a, t)));
          break;
        case 5:
          Ci(
            t,
            e,
            a
          ), t.flags & $d && (t = t.stateNode, (e & 335544128) === e && am(a, t));
          break;
        case 3:
        case 4:
          var c = Fc;
          Fc = xi(
            t.stateNode.containerInfo
          ), Ci(
            t,
            e,
            a
          ), Fc = c;
          break;
        case 22:
          t.memoizedState === null && (c = t.alternate, c !== null && c.memoizedState !== null ? (c = $d, $d = 16777216, Ci(
            t,
            e,
            a
          ), $d = c) : Ci(
            t,
            e,
            a
          ));
          break;
        case 30:
          if ((t.flags & $d) !== 0 && (c = t.memoizedProps.name, c != null && c !== "auto")) {
            var o = t.stateNode;
            o.paired = null, du === null && (du = /* @__PURE__ */ new Map()), du.set(c, o);
          }
          Ci(
            t,
            e,
            a
          );
          break;
        default:
          Ci(
            t,
            e,
            a
          );
      }
    }
    function eu(t) {
      var e = t.alternate;
      if (e !== null && (t = e.child, t !== null)) {
        e.child = null;
        do
          e = t.sibling, t.sibling = null, t = e;
        while (t !== null);
      }
    }
    function je(t) {
      var e = t.deletions;
      if ((t.flags & 16) !== 0) {
        if (e !== null)
          for (var a = 0; a < e.length; a++) {
            var c = e[a], o = Ta();
            Ll = c, _0(
              c,
              t
            ), (c.mode & zt) !== rt && 0 <= nt && 0 <= it && 0.05 < it - nt && Ou(
              c,
              nt,
              it,
              "Unmount"
            ), Il(o);
          }
        eu(t);
      }
      if (t.subtreeFlags & 10256)
        for (t = t.child; t !== null; )
          td(t), t = t.sibling;
    }
    function td(t) {
      var e = Ta(), a = Le(), c = cl(), o = Vn();
      switch (t.tag) {
        case 0:
        case 11:
        case 15:
          je(t), t.flags & 2048 && tv(
            t,
            t.return,
            Ya | ec
          );
          break;
        case 3:
          var f = pc();
          je(t), t.stateNode.passiveEffectDuration += Yh(f);
          break;
        case 12:
          f = pc(), je(t), t.stateNode.passiveEffectDuration += br(f);
          break;
        case 22:
          f = t.stateNode, t.memoizedState !== null && f._visibility & lf && (t.return === null || t.return.tag !== 13) ? (f._visibility &= ~lf, ed(t), (t.mode & zt) !== rt && 0 <= nt && 0 <= it && 0.05 < it - nt && Ou(
            t,
            nt,
            it,
            "Disconnect"
          )) : je(t);
          break;
        default:
          je(t);
      }
      (t.mode & zt) !== rt && 0 <= nt && 0 <= it && (we || 0.05 < Ne) && Du(
        t,
        nt,
        it,
        Ne,
        Oe
      ), Il(e), _u(a), we = o, Oe = c;
    }
    function ed(t) {
      var e = t.deletions;
      if ((t.flags & 16) !== 0) {
        if (e !== null)
          for (var a = 0; a < e.length; a++) {
            var c = e[a], o = Ta();
            Ll = c, _0(
              c,
              t
            ), (c.mode & zt) !== rt && 0 <= nt && 0 <= it && 0.05 < it - nt && Ou(
              c,
              nt,
              it,
              "Unmount"
            ), Il(o);
          }
        eu(t);
      }
      for (t = t.child; t !== null; )
        es(t), t = t.sibling;
    }
    function es(t) {
      var e = Ta(), a = Le(), c = cl(), o = Vn();
      switch (t.tag) {
        case 0:
        case 11:
        case 15:
          tv(
            t,
            t.return,
            Ya
          ), ed(t);
          break;
        case 22:
          var f = t.stateNode;
          f._visibility & lf && (f._visibility &= ~lf, ed(t));
          break;
        default:
          ed(t);
      }
      (t.mode & zt) !== rt && 0 <= nt && 0 <= it && (we || 0.05 < Ne) && Du(
        t,
        nt,
        it,
        Ne,
        Oe
      ), Il(e), _u(a), we = o, Oe = c;
    }
    function _0(t, e) {
      for (; Ll !== null; ) {
        var a = Ll, c = a, o = e, f = Ta(), d = Le(), h = cl(), y = Vn();
        switch (c.tag) {
          case 0:
          case 11:
          case 15:
            tv(
              c,
              o,
              Ya
            );
            break;
          case 23:
          case 22:
            c.memoizedState !== null && c.memoizedState.cachePool !== null && (o = c.memoizedState.cachePool.pool, o != null && gc(o));
            break;
          case 24:
            Bf(c.memoizedState.cache);
        }
        if ((c.mode & zt) !== rt && 0 <= nt && 0 <= it && (we || 0.05 < Ne) && Du(
          c,
          nt,
          it,
          Ne,
          Oe
        ), Il(f), _u(d), we = y, Oe = h, c = a.child, c !== null) c.return = a, Ll = c;
        else
          t: for (a = t; Ll !== null; ) {
            if (c = Ll, f = c.sibling, d = c.return, R0(c), c === a) {
              Ll = null;
              break t;
            }
            if (f !== null) {
              f.return = d, Ll = f;
              break t;
            }
            Ll = d;
          }
      }
    }
    function fv() {
      c4.forEach(function(t) {
        return t();
      });
    }
    function U0() {
      var t = typeof IS_REACT_ACT_ENVIRONMENT < "u" ? IS_REACT_ACT_ENVIRONMENT : void 0;
      return t || x.actQueue === null || console.error(
        "The current testing environment is not configured to support act(...)"
      ), t;
    }
    function na(t) {
      if ((Zt & Dl) !== Jl && St !== 0)
        return St & -St;
      var e = x.T;
      return e !== null ? (e._updatedFibers || (e._updatedFibers = /* @__PURE__ */ new Set()), e._updatedFibers.add(t), Zd !== null && Fl() === wl && (Zd = null), _i()) : (t = Fl(), t === wl && (Zd = null), t);
    }
    function sv() {
      if (Cn === 0)
        if ((St & 536870912) === 0 || At) {
          var t = Ud;
          Ud <<= 1, (Ud & 3932160) === 0 && (Ud = 262144), Cn = t;
        } else Cn = 536870912;
      return t = da.current, t !== null && (t.flags |= 32), Cn;
    }
    function Ri(t, e) {
      if (e != null) {
        var a = t.stateNode, c = a.ref;
        c === null && (c = a.ref = bp(
          dc(t.memoizedProps, a)
        )), Xm === null && (Xm = []), Xm.push(e.bind(null, c));
      }
    }
    function ge(t, e, a) {
      if (Zm && console.error("useInsertionEffect must not schedule updates."), R2 && (VS = !0), (t === ye && (oe === Wd || oe === Id) || t.cancelPendingCommit !== null) && (el(t, 0), Je(
        t,
        St,
        Cn,
        !1
      )), tr(t, a), (Zt & Dl) !== Jl && t === ye) {
        if (bn)
          switch (e.tag) {
            case 0:
            case 11:
            case 15:
              t = Ct && tt(Ct) || "Unknown", A3.has(t) || (A3.add(t), e = tt(e) || "Unknown", console.error(
                "Cannot update a component (`%s`) while rendering a different component (`%s`). To locate the bad setState() call inside `%s`, follow the stack trace as described in https://react.dev/link/setstate-in-render",
                e,
                t,
                t
              ));
              break;
            case 1:
              z3 || (console.error(
                "Cannot update during an existing state transition (such as within `render`). Render methods should be a pure function of props and state."
              ), z3 = !0);
          }
      } else
        Ju && m1(t, e, a), fp(e), t === ye && ((Zt & Dl) === Jl && (Qs |= a), He === ws && Je(
          t,
          St,
          Cn,
          !1
        )), ca(t);
    }
    function ld(t, e, a) {
      if ((Zt & (Dl | hu)) !== Jl)
        throw Error("Should not already be working.");
      if (St !== 0 && Ct !== null) {
        var c = Ct, o = Ue();
        switch (gT) {
          case Wg:
          case Wd:
            var f = Ug;
            be && ((c = c._debugTask) ? c.run(
              console.timeStamp.bind(
                console,
                "Suspended",
                f,
                o,
                En,
                void 0,
                "primary-light"
              )
            ) : console.timeStamp(
              "Suspended",
              f,
              o,
              En,
              void 0,
              "primary-light"
            ));
            break;
          case Id:
            f = Ug, be && ((c = c._debugTask) ? c.run(
              console.timeStamp.bind(
                console,
                "Action",
                f,
                o,
                En,
                void 0,
                "primary-light"
              )
            ) : console.timeStamp(
              "Action",
              f,
              o,
              En,
              void 0,
              "primary-light"
            ));
            break;
          default:
            be && (c = o - Ug, 3 > c || console.timeStamp(
              "Blocked",
              Ug,
              o,
              En,
              void 0,
              5 > c ? "primary-light" : 10 > c ? "primary" : 100 > c ? "primary-dark" : "error"
            ));
        }
      }
      f = (a = !a && (e & 127) === 0 && (e & t.expiredLanes) === 0 || to(t, e)) ? mv(t, e) : nd(t, e, !0);
      var d = a;
      do {
        if (f === df) {
          jm && !a && Je(t, e, 0, !1), e = oe, Ug = al(), gT = e;
          break;
        } else {
          if (c = Ue(), o = t.current.alternate, d && !N0(o)) {
            Ul(e), o = Ql, f = c, !be || f <= o || (Xe ? Xe.run(
              console.timeStamp.bind(
                console,
                "Teared Render",
                o,
                f,
                xt,
                Nt,
                "error"
              )
            ) : console.timeStamp(
              "Teared Render",
              o,
              f,
              xt,
              Nt,
              "error"
            )), Mi(e, c), f = nd(t, e, !1), d = !1;
            continue;
          }
          if (f === Fd) {
            if (d = e, t.errorRecoveryDisabledLanes & d)
              var h = 0;
            else
              h = t.pendingLanes & -536870913, h = h !== 0 ? h : h & 536870912 ? 536870912 : 0;
            if (h !== 0) {
              Ul(e), Sy(
                Ql,
                c,
                e,
                Xe
              ), Mi(e, c), e = h;
              t: {
                c = t, f = d, d = kg;
                var y = c.current.memoizedState.isDehydrated;
                if (y && (el(c, h).flags |= 256), h = nd(
                  c,
                  h,
                  !1
                ), h !== Fd && h !== Fg) {
                  if (T2 && !y) {
                    c.errorRecoveryDisabledLanes |= f, Qs |= f, f = ws;
                    break t;
                  }
                  c = an, an = d, c !== null && (an === null ? an = c : an.push.apply(
                    an,
                    c
                  ));
                }
                f = h;
              }
              if (d = !1, f !== Fd) continue;
              c = Ue();
            }
          }
          if (f === $g) {
            Ul(e), Sy(
              Ql,
              c,
              e,
              Xe
            ), Mi(e, c), el(t, 0), Je(t, e, 0, !0);
            break;
          }
          t: {
            switch (a = t, f) {
              case df:
              case $g:
                throw Error("Root did not complete. This is a bug in React.");
              case ws:
                if ((e & 4194048) !== e && (e & 62914560) !== e)
                  break;
              case Fg:
                Ul(e), py(
                  Ql,
                  c,
                  e,
                  Xe
                ), Mi(e, c), o = e, (o & 127) !== 0 ? sS = c : (o & 4194048) !== 0 && (rS = c), Je(
                  a,
                  e,
                  Cn,
                  !hf
                );
                break t;
              case Fd:
                an = null;
                break;
              case CS:
              case h3:
                break;
              default:
                throw Error("Unknown root exit status.");
            }
            if (x.actQueue !== null)
              ud(
                a,
                o,
                e,
                an,
                Pg,
                US,
                Cn,
                Qs,
                kd,
                hf,
                f,
                null,
                null,
                Ql,
                c
              );
            else {
              if ((e & 62914560) === e && (d = NS + v3 - Ue(), 10 < d)) {
                if (Je(
                  a,
                  e,
                  Cn,
                  !hf
                ), Sf(a, 0, !0) !== 0) break t;
                Rn = e, a.timeoutHandle = V2(
                  rv.bind(
                    null,
                    a,
                    o,
                    an,
                    Pg,
                    US,
                    e,
                    Cn,
                    Qs,
                    kd,
                    hf,
                    f,
                    "Throttled",
                    Ql,
                    c
                  ),
                  d
                );
                break t;
              }
              rv(
                a,
                o,
                an,
                Pg,
                US,
                e,
                Cn,
                Qs,
                kd,
                hf,
                f,
                null,
                Ql,
                c
              );
            }
          }
        }
        break;
      } while (!0);
      ca(t);
    }
    function rv(t, e, a, c, o, f, d, h, y, v, p, z, E, M) {
      t.timeoutHandle = nh;
      var j = e.subtreeFlags, J = (f & 335544064) === f, et = null;
      if ((J || j & 8192 || (j & 16785408) === 16785408) && (et = {
        stylesheets: null,
        count: 0,
        imgCount: 0,
        imgBytes: 0,
        suspenseyImages: [],
        waitingForImages: !0,
        waitingForViewTransition: !1,
        unsuspend: zu
      }, du = null, ov(e, f, et), J && (j = et, J = t.containerInfo, J = (J.nodeType === 9 ? J : J.ownerDocument).__reactViewTransition, J != null && (j.count++, j.waitingForViewTransition = !0, j = vs.bind(j), J.finished.then(
        j,
        j
      ))), j = (f & 62914560) === f ? NS - Ue() : (f & 4194048) === f ? y3 - Ue() : 0, j = Up(et, j), j !== null)) {
        Rn = f, t.cancelPendingCommit = j(
          ud.bind(
            null,
            t,
            e,
            f,
            a,
            c,
            o,
            d,
            h,
            y,
            v,
            p,
            et,
            et.waitingForViewTransition ? "Waiting for the previous Animation" : 0 < et.count ? 0 < et.imgCount ? "Suspended on CSS and Images" : "Suspended on CSS" : et.imgCount === 1 ? "Suspended on an Image" : 0 < et.imgCount ? "Suspended on Images" : null,
            E,
            M
          )
        ), Je(
          t,
          f,
          d,
          !v
        );
        return;
      }
      ud(
        t,
        e,
        f,
        a,
        c,
        o,
        d,
        h,
        y,
        v,
        p,
        et,
        z,
        E,
        M
      );
    }
    function N0(t) {
      for (var e = t; ; ) {
        var a = e.tag;
        if ((a === 0 || a === 11 || a === 15) && e.flags & 16384 && (a = e.updateQueue, a !== null && (a = a.stores, a !== null)))
          for (var c = 0; c < a.length; c++) {
            var o = a[c], f = o.getSnapshot;
            o = o.value;
            try {
              if (!tn(f(), o)) return !1;
            } catch {
              return !1;
            }
          }
        if (a = e.child, e.subtreeFlags & 16384 && a !== null)
          a.return = e, e = a;
        else {
          if (e === t) break;
          for (; e.sibling === null; ) {
            if (e.return === null || e.return === t) return !0;
            e = e.return;
          }
          e.sibling.return = e.return, e = e.sibling;
        }
      }
      return !0;
    }
    function Je(t, e, a, c) {
      e = oh(t, e), e &= ~_S, e &= ~Qs, t.suspendedLanes |= e, t.pingedLanes &= ~e, c && (t.warmLanes |= e), c = t.expirationTimes;
      for (var o = e; 0 < o; ) {
        var f = 31 - $e(o), d = 1 << f;
        c[f] = -1, o &= ~d;
      }
      a !== 0 && ty(t, a, e);
    }
    function qo() {
      return (Zt & (Dl | hu)) === Jl ? (is(0), !1) : !0;
    }
    function yn() {
      if (Ct !== null) {
        if (oe === Dn)
          var t = Ct.return;
        else
          t = Ct, pr(), Ce(t), Nm = null, jg = 0, t = Ct;
        for (; t !== null; )
          K1(t.alternate, t), t = t.return;
        Ct = null;
      }
    }
    function Mi(t, e) {
      (t & 127) !== 0 && (Bs = e), (t & 4194048) !== 0 && (Jc = e), (t & 62914560) !== 0 && (Ib = e), (t & 2080374784) !== 0 && (kb = e);
    }
    function el(t, e) {
      be && (console.timeStamp(
        "Blocking Track",
        3e-3,
        3e-3,
        "Blocking",
        Nt,
        "primary-light"
      ), console.timeStamp(
        "Transition Track",
        3e-3,
        3e-3,
        "Transition",
        Nt,
        "primary-light"
      ), console.timeStamp(
        "Suspense Track",
        3e-3,
        3e-3,
        "Suspense",
        Nt,
        "primary-light"
      ), console.timeStamp(
        "Idle Track",
        3e-3,
        3e-3,
        "Idle",
        Nt,
        "primary-light"
      ));
      var a = Ql;
      if (Ql = al(), St !== 0 && 0 < a) {
        if (Ul(St), He === CS || He === ws)
          py(
            a,
            Ql,
            e,
            Xe
          );
        else {
          var c = Ql, o = Xe;
          if (be && !(c <= a)) {
            var f = (e & 738197653) === e ? "tertiary-dark" : "primary-dark", d = (e & 536870912) === e ? "Prewarm" : (e & 201326741) === e ? "Interrupted Hydration" : "Interrupted Render";
            o ? o.run(
              console.timeStamp.bind(
                console,
                d,
                a,
                c,
                xt,
                Nt,
                f
              )
            ) : console.timeStamp(
              d,
              a,
              c,
              xt,
              Nt,
              f
            );
          }
        }
        Mi(St, Ql);
      }
      if (a = Xe, Xe = null, (e & 127) !== 0) {
        Xe = Rg, o = 0 <= Xi && Xi < Bs ? Bs : Xi, c = 0 <= Vd && Vd < Bs ? Bs : Vd, f = 0 <= c ? c : 0 <= o ? o : Ql, 0 <= sS ? (Ul(2), _1(
          sS,
          f,
          e,
          a
        )) : (wd & 127) !== 0 && (Ul(2), oi(Bs, f, zn)), a = o;
        var h = c, y = Mg, v = 0 < Mm, p = xs === Cg, z = xs === fS;
        if (o = Ql, c = Rg, f = $b, d = Fb, be) {
          if (xt = "Blocking", 0 < a ? a > o && (a = o) : a = o, 0 < h ? h > a && (h = a) : h = a, y !== null && a > h) {
            var E = v ? "secondary-light" : "warning";
            c ? c.run(
              console.timeStamp.bind(
                console,
                v ? "Consecutive" : "Event: " + y,
                h,
                a,
                xt,
                Nt,
                E
              )
            ) : console.timeStamp(
              v ? "Consecutive" : "Event: " + y,
              h,
              a,
              xt,
              Nt,
              E
            );
          }
          o > a && (h = p ? "error" : (e & 738197653) === e ? "tertiary-light" : "primary-light", p = z ? "Promise Resolved" : p ? "Cascading Update" : 5 < o - a ? "Update Blocked" : "Update", z = [], d != null && z.push(["Component name", d]), f != null && z.push(["Method name", f]), a = {
            start: a,
            end: o,
            detail: {
              devtools: {
                properties: z,
                track: xt,
                trackGroup: Nt,
                color: h
              }
            }
          }, c ? c.run(
            performance.measure.bind(
              performance,
              p,
              a
            )
          ) : performance.measure(p, a), performance.clearMeasures(p));
        }
        Xi = -1.1, xs = 0, Fb = $b = null, sS = -1.1, Mm = Vd, Vd = -1.1, Bs = al();
      }
      return (e & 4194048) !== 0 && (Xe = _g, o = 0 <= ff && ff < Jc ? Jc : ff, a = 0 <= tc && tc < Jc ? Jc : tc, c = 0 <= Ys && Ys < Jc ? Jc : Ys, f = 0 <= c ? c : 0 <= a ? a : Ql, 0 <= rS ? (Ul(256), _1(
        rS,
        f,
        e,
        Xe
      )) : (wd & 4194048) !== 0 && (Ul(256), oi(Jc, f, zn)), z = c, h = jd, y = 0 < qs, v = Wb === fS, f = Ql, c = _g, d = yT, p = vT, be && (xt = "Transition", 0 < a ? a > f && (a = f) : a = f, 0 < o ? o > a && (o = a) : o = a, 0 < z ? z > o && (z = o) : z = o, o > z && h !== null && (E = y ? "secondary-light" : "warning", c ? c.run(
        console.timeStamp.bind(
          console,
          y ? "Consecutive" : "Event: " + h,
          z,
          o,
          xt,
          Nt,
          E
        )
      ) : console.timeStamp(
        y ? "Consecutive" : "Event: " + h,
        z,
        o,
        xt,
        Nt,
        E
      )), a > o && (c ? c.run(
        console.timeStamp.bind(
          console,
          "Action",
          o,
          a,
          xt,
          Nt,
          "primary-dark"
        )
      ) : console.timeStamp(
        "Action",
        o,
        a,
        xt,
        Nt,
        "primary-dark"
      )), f > a && (o = v ? "Promise Resolved" : 5 < f - a ? "Update Blocked" : "Update", z = [], p != null && z.push(["Component name", p]), d != null && z.push(["Method name", d]), a = {
        start: a,
        end: f,
        detail: {
          devtools: {
            properties: z,
            track: xt,
            trackGroup: Nt,
            color: "primary-light"
          }
        }
      }, c ? c.run(
        performance.measure.bind(
          performance,
          o,
          a
        )
      ) : performance.measure(o, a), performance.clearMeasures(o))), tc = ff = -1.1, Wb = 0, rS = -1.1, qs = Ys, Ys = -1.1, Jc = al()), (e & 62914560) !== 0 && (wd & 62914560) !== 0 && (Ul(4194304), oi(Ib, Ql, zn)), (e & 2080374784) !== 0 && (wd & 2080374784) !== 0 && (Ul(268435456), oi(kb, Ql, zn)), a = t.timeoutHandle, a !== nh && (t.timeoutHandle = nh, S4(a)), a = t.cancelPendingCommit, a !== null && (t.cancelPendingCommit = null, a()), Rn = 0, yn(), ye = t, Ct = a = Ru(
        t.current,
        null
      ), St = e, oe = Dn, mu = null, hf = !1, jm = to(t, e), T2 = !1, He = df, kd = Cn = _S = Qs = Xs = 0, an = kg = null, US = !1, $i = oh(t, e), Oh(), t = oT(), 1e3 < t - iT && (x.recentlyCreatedOwnerStacks = 0, iT = t), Kc.discardPendingWarnings(), a;
    }
    function Go(t, e) {
      ht = null, x.H = TS, x.getCurrentStack = null, bn = !1, jl = null, e === Um || e === yS ? (e = Er(), oe = Wg) : e === l2 ? (e = Er(), oe = m3) : oe = e === h2 ? b2 : e !== null && typeof e == "object" && typeof e.then == "function" ? Ig : RS, mu = e;
      var a = Ct;
      a === null ? (He = $g, Se(
        t,
        Sl(e, t.current)
      )) : a.mode & zt && xf(a);
    }
    function dv() {
      var t = da.current;
      return t === null ? !0 : (St & 4194048) === St ? xa === null : (St & 62914560) === St || (St & 536870912) !== 0 ? t === xa : !1;
    }
    function lu() {
      var t = x.H;
      return x.H = TS, t === null ? TS : t;
    }
    function ad() {
      var t = x.A;
      return x.A = u4, t;
    }
    function ls(t) {
      Xe === null && (Xe = t._debugTask == null ? null : t._debugTask);
    }
    function as() {
      He = ws, hf || (St & 4194048) !== St && da.current !== null || (jm = !0), (Xs & 134217727) === 0 && (Qs & 134217727) === 0 || ye === null || Je(
        ye,
        St,
        Cn,
        !1
      );
    }
    function nd(t, e, a) {
      var c = Zt;
      Zt |= Dl;
      var o = lu(), f = ad();
      if (ye !== t || St !== e) {
        if (Ju) {
          var d = t.memoizedUpdaters;
          0 < d.size && (cs(t, St), d.clear()), y1(t, e);
        }
        Pg = null, el(t, e);
      }
      e = !1, d = He;
      t: do
        try {
          if (oe !== Dn && Ct !== null) {
            var h = Ct, y = mu;
            switch (oe) {
              case b2:
                yn(), d = Fg;
                break t;
              case Wg:
              case Wd:
              case Id:
              case Ig:
                da.current === null && (e = !0);
                var v = oe;
                if (oe = Dn, mu = null, Ee(t, h, y, v), a && jm) {
                  d = df;
                  break t;
                }
                break;
              default:
                v = oe, oe = Dn, mu = null, Ee(t, h, y, v);
            }
          }
          hv(), d = He;
          break;
        } catch (p) {
          Go(t, p);
        }
      while (!0);
      return e && t.shellSuspendCounter++, pr(), Zt = c, x.H = o, x.A = f, Ct === null && (ye = null, St = 0, Oh()), d;
    }
    function hv() {
      for (; Ct !== null; ) yv(Ct);
    }
    function mv(t, e) {
      var a = Zt;
      Zt |= Dl;
      var c = lu(), o = ad();
      if (ye !== t || St !== e) {
        if (Ju) {
          var f = t.memoizedUpdaters;
          0 < f.size && (cs(t, St), f.clear()), y1(t, e);
        }
        Pg = null, HS = Ue() + g3, el(t, e);
      } else
        jm = to(
          t,
          e
        );
      t: do
        try {
          if (oe !== Dn && Ct !== null)
            e: switch (e = Ct, f = mu, oe) {
              case RS:
                oe = Dn, mu = null, Ee(
                  t,
                  e,
                  f,
                  RS
                );
                break;
              case Wd:
              case Id:
                if (Gh(f)) {
                  oe = Dn, mu = null, B0(e);
                  break;
                }
                e = function() {
                  oe !== Wd && oe !== Id || ye !== t || (oe = MS), ca(t);
                }, f.then(e, e);
                break t;
              case Wg:
                oe = MS;
                break t;
              case m3:
                oe = S2;
                break t;
              case MS:
                Gh(f) ? (oe = Dn, mu = null, B0(e)) : (oe = Dn, mu = null, Ee(
                  t,
                  e,
                  f,
                  MS
                ));
                break;
              case S2:
                var d = null;
                switch (Ct.tag) {
                  case 26:
                    d = Ct.memoizedState;
                  case 5:
                  case 27:
                    var h = Ct;
                    if (d ? _p(d) : h.stateNode.complete) {
                      oe = Dn, mu = null;
                      var y = h.sibling;
                      if (y !== null) Ct = y;
                      else {
                        var v = h.return;
                        v !== null ? (Ct = v, Qt(v)) : Ct = null;
                      }
                      break e;
                    }
                    break;
                  default:
                    console.error(
                      "Unexpected type of fiber triggered a suspensey commit. This is a bug in React."
                    );
                }
                oe = Dn, mu = null, Ee(
                  t,
                  e,
                  f,
                  S2
                );
                break;
              case Ig:
                oe = Dn, mu = null, Ee(
                  t,
                  e,
                  f,
                  Ig
                );
                break;
              case b2:
                yn(), He = Fg;
                break t;
              default:
                throw Error(
                  "Unexpected SuspendedReason. This is a bug in React."
                );
            }
          x.actQueue !== null ? hv() : H0();
          break;
        } catch (p) {
          Go(t, p);
        }
      while (!0);
      return pr(), x.H = c, x.A = o, Zt = a, Ct !== null ? df : (ye = null, St = 0, Oh(), He);
    }
    function H0() {
      for (; Ct !== null && !og(); )
        yv(Ct);
    }
    function yv(t) {
      var e = t.alternate;
      (t.mode & zt) !== rt ? (jn(t), e = $(
        t,
        o0,
        e,
        t,
        $i
      ), xf(t)) : e = $(
        t,
        o0,
        e,
        t,
        $i
      ), t.memoizedProps = t.pendingProps, e === null ? Qt(t) : Ct = e;
    }
    function B0(t) {
      var e = $(t, up, t);
      t.memoizedProps = t.pendingProps, e === null ? Qt(t) : Ct = e;
    }
    function up(t) {
      var e = t.alternate, a = (t.mode & zt) !== rt;
      switch (a && jn(t), t.tag) {
        case 15:
        case 0:
          e = Ky(
            e,
            t,
            t.pendingProps,
            t.type,
            void 0,
            St
          );
          break;
        case 11:
          e = Ky(
            e,
            t,
            t.pendingProps,
            t.type.render,
            t.ref,
            St
          );
          break;
        case 5:
          Ce(t);
          var c = t;
          c === Xl && (At ? (Bh(c), c.tag === 5 && c.stateNode != null && (pe = c.stateNode)) : (Bh(c), At = !0));
        default:
          K1(e, t), t = Ct = so(t, $i), e = o0(e, t, $i);
      }
      return a && xf(t), e;
    }
    function Ee(t, e, a, c) {
      pr(), Ce(e), Nm = null, jg = 0;
      var o = e.return;
      try {
        if (Nc(
          t,
          o,
          e,
          a,
          St
        )) {
          He = $g, Se(
            t,
            Sl(a, t.current)
          ), Ct = null;
          return;
        }
      } catch (f) {
        if (o !== null) throw Ct = o, f;
        He = $g, Se(
          t,
          Sl(a, t.current)
        ), Ct = null;
        return;
      }
      e.flags & 32768 ? (At || c === RS ? t = !0 : jm || (St & 536870912) !== 0 ? t = !1 : (hf = t = !0, (c === Wd || c === Id || c === Wg || c === Ig) && (c = da.current, c !== null && c.tag === 13 && (c.flags |= 16384))), au(e, t)) : Qt(e);
    }
    function Qt(t) {
      var e = t;
      do {
        if ((e.flags & 32768) !== 0) {
          au(
            e,
            hf
          );
          return;
        }
        var a = e.alternate;
        if (t = e.return, jn(e), a = $(
          e,
          L1,
          a,
          e,
          $i
        ), (e.mode & zt) !== rt && La(e), a !== null) {
          Ct = a;
          return;
        }
        if (e = e.sibling, e !== null) {
          Ct = e;
          return;
        }
        Ct = e = t;
      } while (e !== null);
      He === df && (He = h3);
    }
    function au(t, e) {
      do {
        var a = J1(t.alternate, t);
        if (a !== null) {
          a.flags &= 32767, Ct = a;
          return;
        }
        if ((t.mode & zt) !== rt) {
          La(t), a = t.actualDuration;
          for (var c = t.child; c !== null; )
            a += c.actualDuration, c = c.sibling;
          t.actualDuration = a;
        }
        if (a = t.return, a !== null && (a.flags |= 32768, a.subtreeFlags = 0, a.deletions = null), !e && (t = t.sibling, t !== null)) {
          Ct = t;
          return;
        }
        Ct = t = a;
      } while (t !== null);
      He = Fg, Ct = null;
    }
    function ud(t, e, a, c, o, f, d, h, y, v, p, z, E, M, j) {
      t.cancelPendingCommit = null;
      do
        us();
      while (Be !== Fi);
      if (Kc.flushLegacyContextWarning(), Kc.flushPendingUnsafeLifecycleWarnings(), (Zt & (Dl | hu)) !== Jl)
        throw Error("Should not already be working.");
      if (Ul(a), p === Fd)
        Sy(
          M,
          j,
          a,
          Xe
        );
      else if (c !== null) {
        if (v = e !== null && e.alternate !== null && e.alternate.memoizedState.isDehydrated && (e.flags & 256) !== 0, f = Xe, be && !(j <= M)) {
          p = [];
          for (var J = 0; J < c.length; J++) {
            var et = c[J].value;
            p.push([
              "Recoverable Error",
              typeof et == "object" && et !== null && typeof et.message == "string" ? String(et.message) : String(et)
            ]);
          }
          M = {
            start: M,
            end: j,
            detail: {
              devtools: {
                color: "primary-dark",
                track: xt,
                trackGroup: Nt,
                tooltipText: v ? "Hydration Failed" : "Recovered after Error",
                properties: p
              }
            }
          }, f ? f.run(
            performance.measure.bind(
              performance,
              "Recovered",
              M
            )
          ) : performance.measure("Recovered", M), performance.clearMeasures("Recovered");
        }
      } else
        f = Xe, !be || j <= M || (v = (a & 738197653) === a ? "tertiary-dark" : "primary-dark", p = (a & 536870912) === a ? "Prepared" : (a & 201326741) === a ? "Hydrated" : "Render", f ? f.run(
          console.timeStamp.bind(
            console,
            p,
            M,
            j,
            xt,
            Nt,
            v
          )
        ) : console.timeStamp(
          p,
          M,
          j,
          xt,
          Nt,
          v
        ));
      if (e !== null) {
        if (a === 0 && console.error(
          "finishedLanes should not be empty during a commit. This is a bug in React."
        ), e === t.current)
          throw Error(
            "Cannot commit the same tree as before. This error is likely caused by a bug in React. Please file an issue."
          );
        t === ye && (Ct = ye = null, St = 0), Pd = e, Wc = t, Rn = a, D2 = o, T3 = c, YS = j, qS = E, yu = BS, C2 = null, cp(
          t,
          e,
          a,
          d,
          h,
          y,
          z,
          E,
          j
        );
      }
    }
    function cp(t, e, a, c, o, f, d, h, y) {
      var v = e.lanes | e.childLanes;
      if (O2 = v, v |= Qb, d1(
        t,
        a,
        v,
        c,
        o,
        f
      ), Xm = null, (a & 335544064) === a ? (Qm = q1(t), c = 10262) : (Qm = null, c = 10256), e.actualDuration !== 0 || (e.subtreeFlags & c) !== 0 || (e.flags & c) !== 0 ? (t.callbackNode = null, t.callbackPriority = 0, ua(Os, function() {
        return c1 = window.event, yu === BS && (yu = E2), od(), null;
      })) : (t.callbackNode = null, t.callbackPriority = 0), of = null, cf = al(), h !== null && ib(
        y,
        cf,
        h,
        Xe
      ), zS = !1, h = (e.flags & 13878) !== 0, (e.subtreeFlags & 13878) !== 0 || h) {
        h = x.T, x.T = null, y = Gt.p, Gt.p = wl, c = Zt, Zt |= hu;
        try {
          tp(t, e, a);
        } finally {
          Zt = c, Gt.p = y, x.T = h;
        }
      }
      Be = S3, zS ? (wd |= a, zn = null, wm = rb(
        d,
        t.containerInfo,
        Qm,
        id,
        vv,
        x0,
        ns,
        od,
        ol,
        Vu,
        cd.bind(null, a)
      )) : (id(), vv(), ns());
    }
    function ol(t) {
      if (Be !== Fi) {
        var e = Wc.onRecoverableError;
        e(t, gv(null));
      }
    }
    function Vu(t) {
      Lc = al(), N1(
        qS === null ? YS : cf,
        Lc,
        of,
        yu === t1,
        Xe
      ), qS = C2 = t;
    }
    function cd(t) {
      if ((wd & t) !== 0) {
        var e = zn;
        wd &= ~t, zn = null, (t & 4194048) !== 0 && (St & 4194048) === 0 && (Rn & 4194048) === 0 && (Ul(256), oi(Jc, Ue(), e)), (t & 62914560) !== 0 && (St & 62914560) === 0 && (Rn & 62914560) === 0 && (Ul(4194304), oi(Ib, Ue(), e)), (t & 2080374784) !== 0 && (St & 2080374784) === 0 && (Rn & 2080374784) === 0 && (Ul(268435456), oi(kb, Ue(), e));
      }
    }
    function x0() {
      Be === z2 && (Be = Fi, ap(
        Pd,
        Wc
      ), Be = A2);
    }
    function id() {
      if (Be === S3) {
        Be = Fi;
        var t = Wc, e = Pd, a = Rn, c = (e.flags & 13878) !== 0;
        if ((e.subtreeFlags & 13878) !== 0 || c) {
          c = x.T, x.T = null;
          var o = Gt.p;
          Gt.p = wl;
          var f = Zt;
          Zt |= hu;
          try {
            Gm = a, Vm = t, Jg = DS = !1, Tr(), M0(e, t, a), Vm = Gm = null, a = q2;
            var d = mr(t.containerInfo), h = a.focusedElem, y = a.selectionRange;
            if (d !== h && h && h.ownerDocument && Rf(
              h.ownerDocument.documentElement,
              h
            )) {
              if (y !== null && zh(h)) {
                var v = y.start, p = y.end;
                if (p === void 0 && (p = v), "selectionStart" in h)
                  h.selectionStart = v, h.selectionEnd = Math.min(
                    p,
                    h.value.length
                  );
                else {
                  var z = h.ownerDocument || document, E = z && z.defaultView || window;
                  if (E.getSelection) {
                    var M = E.getSelection(), j = h.textContent.length, J = Math.min(
                      y.start,
                      j
                    ), et = y.end === void 0 ? J : Math.min(y.end, j);
                    !M.extend && J > et && (d = et, et = J, J = d);
                    var Et = Eh(
                      h,
                      J
                    ), b = Eh(
                      h,
                      et
                    );
                    if (Et && b && (M.rangeCount !== 1 || M.anchorNode !== Et.node || M.anchorOffset !== Et.offset || M.focusNode !== b.node || M.focusOffset !== b.offset)) {
                      var T = z.createRange();
                      T.setStart(Et.node, Et.offset), M.removeAllRanges(), J > et ? (M.addRange(T), M.extend(b.node, b.offset)) : (T.setEnd(b.node, b.offset), M.addRange(T));
                    }
                  }
                }
              }
              for (z = [], M = h; M = M.parentNode; )
                M.nodeType === 1 && z.push({
                  element: M,
                  left: M.scrollLeft,
                  top: M.scrollTop
                });
              for (typeof h.focus == "function" && h.focus(), h = 0; h < z.length; h++) {
                var A = z[h];
                A.element.scrollLeft = A.left, A.element.scrollTop = A.top;
              }
            }
            Im = !!Y2, q2 = Y2 = null;
          } finally {
            Zt = f, Gt.p = o, x.T = c;
          }
        }
        t.current = e, Be = b3;
      }
    }
    function vv() {
      if (Be === b3) {
        Be = Fi;
        var t = C2;
        if (t !== null) {
          cf = al();
          var e = Lc, a = cf;
          !be || a <= e || (zn ? zn.run(
            console.timeStamp.bind(
              console,
              t,
              e,
              a,
              xt,
              Nt,
              "secondary-light"
            )
          ) : console.timeStamp(
            t,
            e,
            a,
            xt,
            Nt,
            "secondary-light"
          ));
        }
        t = Wc, e = Pd, a = Rn;
        var c = (e.flags & 8772) !== 0;
        if ((e.subtreeFlags & 8772) !== 0 || c) {
          c = x.T, x.T = null;
          var o = Gt.p;
          Gt.p = wl;
          var f = Zt;
          Zt |= hu;
          try {
            Gm = a, Vm = t, Tr(), O0(
              t,
              e.alternate,
              e
            ), Vm = Gm = null;
          } finally {
            Zt = f, Gt.p = o, x.T = c;
          }
        }
        t = YS, e = qS, Lc = al(), N1(
          e === null ? t : cf,
          Lc,
          of,
          yu === t1,
          Xe
        ), Be = z2;
      }
    }
    function ns() {
      if (Be === A2 || Be === z2) {
        if (Be === A2) {
          var t = Lc;
          Lc = al();
          var e = Lc, a = yu === t1;
          !be || e <= t || (zn ? zn.run(
            console.timeStamp.bind(
              console,
              a ? "Interrupted View Transition" : "Starting Animation",
              t,
              e,
              xt,
              Nt,
              a ? "error" : "secondary-light"
            )
          ) : console.timeStamp(
            a ? "Interrupted View Transition" : "Starting Animation",
            t,
            e,
            xt,
            Nt,
            a ? " error" : "secondary-light"
          )), yu !== t1 && (yu = p3);
        }
        Be = Fi, t = wm, wm = null, zb(), e = Wc;
        var c = Pd;
        a = Rn;
        var o = T3, f = (a & 335544064) === a ? 10262 : 10256;
        (f = c.actualDuration !== 0 || (c.subtreeFlags & f) !== 0 || (c.flags & f) !== 0) ? Be = xS : (Be = Fi, Pd = Wc = null, Y0(e, e.pendingLanes), th = 0, l1 = null);
        var d = e.pendingLanes;
        if (d === 0 && (Zs = null), f || ql(e), d = eo(a), c = c.stateNode, ll && typeof ll.onCommitFiberRoot == "function")
          try {
            var h = (c.current.flags & 128) === 128;
            switch (d) {
              case wl:
                var y = rm;
                break;
              case iu:
                y = dm;
                break;
              case Ku:
                y = Os;
                break;
              case wc:
                y = fg;
                break;
              default:
                y = Os;
            }
            ll.onCommitFiberRoot(
              Ds,
              c,
              y,
              h
            );
          } catch (E) {
            Pa || (Pa = !0, console.error(
              "React instrumentation encountered an error: %o",
              E
            ));
          }
        if (Ju && e.memoizedUpdaters.clear(), fv(), o !== null) {
          h = x.T, y = Gt.p, Gt.p = wl, x.T = null;
          try {
            var v = e.onRecoverableError;
            for (c = 0; c < o.length; c++) {
              var p = o[c], z = gv(p.stack);
              $(
                p.source,
                v,
                p.value,
                z
              );
            }
          } finally {
            x.T = h, Gt.p = y;
          }
        }
        if (v = Xm, p = Qm, Qm = null, v !== null && (Xm = null, p === null && (p = []), t !== null))
          for (z = 0; z < v.length; z++)
            o = (0, v[z])(
              p
            ), o !== void 0 && t.finished.finally(
              o
            );
        (Rn & 3) !== 0 && us(), ca(e), d = e.pendingLanes, (a & 261930) !== 0 && (d & 42) !== 0 ? (hS = !0, e === GS ? e1++ : (e1 = 0, GS = e)) : (e1 = 0, GS = null), f || Mi(a, Lc), is(0);
      }
    }
    function gv(t) {
      return t = { componentStack: t }, Object.defineProperty(t, "digest", {
        get: function() {
          console.error(
            'You are accessing "digest" from the errorInfo object passed to onRecoverableError. This property is no longer provided as part of errorInfo but can be accessed as a property of the Error instance itself.'
          );
        }
      }), t;
    }
    function Y0(t, e) {
      (t.pooledCacheLanes &= e) === 0 && (e = t.pooledCache, e != null && (t.pooledCache = null, Bf(e)));
    }
    function us() {
      return wm !== null && (wm.skipTransition(), E3 || (E3 = !0, console.warn(
        "A flushSync update cancelled a View Transition because it was called while the View Transition was still preparing. To preserve the synchronous semantics, React had to skip the View Transition. If you can, try to avoid flushSync() in a scenario that's likely to interfere."
      )), wm = null, yu = t1), id(), vv(), ns(), od();
    }
    function od() {
      if (Be !== xS) return !1;
      var t = Wc, e = O2;
      O2 = 0;
      var a = eo(Rn), c = Ku > a ? Ku : a;
      a = x.T;
      var o = Gt.p;
      try {
        Gt.p = c, x.T = null;
        var f = D2;
        D2 = null, c = Wc;
        var d = Rn;
        if (Be = Fi, Pd = Wc = null, Rn = 0, (Zt & (Dl | hu)) !== Jl)
          throw Error("Cannot flush passive effects while already rendering.");
        Ul(d), R2 = !0, VS = !1;
        var h = 0;
        if (of = null, h = Ue(), yu === p3)
          oi(
            Lc,
            h,
            zn
          );
        else {
          var y = Lc, v = h, p = yu === E2;
          !be || v <= y || (Xe ? Xe.run(
            console.timeStamp.bind(
              console,
              p ? "Waiting for Paint" : "Waiting",
              y,
              v,
              xt,
              Nt,
              "secondary-light"
            )
          ) : console.timeStamp(
            p ? "Waiting for Paint" : "Waiting",
            y,
            v,
            xt,
            Nt,
            "secondary-light"
          ));
        }
        y = Zt, Zt |= hu;
        var z = c.current;
        Tr(), td(z);
        var E = c.current;
        z = YS, Tr(), np(
          c,
          E,
          d,
          f,
          z
        ), ql(c), Zt = y;
        var M = Ue();
        if (E = h, z = Xe, of !== null ? U1(
          E,
          M,
          of,
          !0,
          z
        ) : !be || M <= E || (z ? z.run(
          console.timeStamp.bind(
            console,
            "Remaining Effects",
            E,
            M,
            xt,
            Nt,
            "secondary-dark"
          )
        ) : console.timeStamp(
          "Remaining Effects",
          E,
          M,
          xt,
          Nt,
          "secondary-dark"
        )), Mi(d, M), is(0, !1), VS ? c === l1 ? th++ : (th = 0, l1 = c) : th = 0, VS = R2 = !1, ll && typeof ll.onPostCommitFiberRoot == "function")
          try {
            ll.onPostCommitFiberRoot(Ds, c);
          } catch (J) {
            Pa || (Pa = !0, console.error(
              "React instrumentation encountered an error: %o",
              J
            ));
          }
        var j = c.current.stateNode;
        return j.effectDuration = 0, j.passiveEffectDuration = 0, !0;
      } finally {
        Gt.p = o, x.T = a, Y0(t, e);
      }
    }
    function pv(t, e, a) {
      e = Sl(a, e), qh(e), e = Ao(t.stateNode, e, 2), t = Nu(t, e, 2), t !== null && (tr(t, 2), ca(t));
    }
    function at(t, e, a) {
      if (Zm = !1, t.tag === 3)
        pv(t, t, a);
      else {
        for (; e !== null; ) {
          if (e.tag === 3) {
            pv(
              e,
              t,
              a
            );
            return;
          }
          if (e.tag === 1) {
            var c = e.stateNode;
            if (typeof e.type.getDerivedStateFromError == "function" || typeof c.componentDidCatch == "function" && (Zs === null || !Zs.has(c))) {
              t = Sl(a, t), qh(t), a = Ff(2), c = Nu(e, a, 2), c !== null && (jr(
                a,
                c,
                e,
                t
              ), tr(c, 2), ca(c));
              return;
            }
          }
          e = e.return;
        }
        console.error(
          `Internal React error: Attempted to capture a commit phase error inside a detached tree. This indicates a bug in React. Potential causes include deleting the same fiber more than once, committing an already-finished tree, or an inconsistent return pointer.

Error message:

%s`,
          a
        );
      }
    }
    function Yl(t, e, a) {
      var c = t.pingCache;
      if (c === null) {
        c = t.pingCache = new i4();
        var o = /* @__PURE__ */ new Set();
        c.set(e, o);
      } else
        o = c.get(e), o === void 0 && (o = /* @__PURE__ */ new Set(), c.set(e, o));
      o.has(a) || (T2 = !0, o.add(a), c = nu.bind(null, t, e, a), Ju && cs(t, a), e.then(c, c));
    }
    function nu(t, e, a) {
      var c = t.pingCache;
      c !== null && c.delete(e), t.pingedLanes |= t.suspendedLanes & a, t.warmLanes &= ~a, (a & 127) !== 0 ? 0 > Xi && (Bs = Xi = al(), Rg = oS("Promise Resolved"), xs = fS) : (a & 4194048) !== 0 && 0 > tc && (Jc = tc = al(), _g = oS("Promise Resolved"), Wb = fS), U0() && x.actQueue === null && console.error(
        `A suspended resource finished loading inside a test, but the event was not wrapped in act(...).

When testing, code that resolves suspended data should be wrapped into act(...):

act(() => {
  /* finish loading suspended data */
});
/* assert on the output */

This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act`
      ), ye === t && (St & a) === a && ((He === ws || He === CS && (St & 62914560) === St && Ue() - NS < v3) && (Zt & Dl) === Jl ? el(t, 0) : _S |= a, kd === St && (kd = 0)), ca(t);
    }
    function Sv(t, e) {
      e === 0 && (e = Pm()), t = Nl(t, e), t !== null && (tr(t, e), ca(t));
    }
    function ip(t) {
      var e = t.memoizedState, a = 0;
      e !== null && (a = e.retryLane), Sv(t, a);
    }
    function op(t, e) {
      var a = 0;
      switch (t.tag) {
        case 31:
        case 13:
          var c = t.stateNode, o = t.memoizedState;
          o !== null && (a = o.retryLane);
          break;
        case 19:
          c = t.stateNode;
          break;
        case 22:
          c = t.stateNode._retryCache;
          break;
        default:
          throw Error(
            "Pinged unknown suspense boundary type. This is probably a bug in React."
          );
      }
      c !== null && c.delete(e), Sv(t, a);
    }
    function bv(t, e, a) {
      if ((e.subtreeFlags & 134225920) !== 0)
        for (e = e.child; e !== null; ) {
          var c = t, o = e, f = o.type === Ts;
          f = a || f, o.tag !== 22 ? o.flags & 134217728 ? f && $(
            o,
            fd,
            c,
            o
          ) : bv(
            c,
            o,
            f
          ) : o.memoizedState === null && (f && o.flags & 134225920 ? $(
            o,
            fd,
            c,
            o
          ) : o.subtreeFlags & 134217728 && $(
            o,
            bv,
            c,
            o,
            f
          )), e = e.sibling;
        }
    }
    function fd(t, e) {
      he(!0);
      try {
        qu(e, Lg), es(e), iv(
          t,
          e.alternate,
          e,
          Lg
        ), ts(t, e, 0, null, !1, 0);
      } finally {
        he(!1);
      }
    }
    function ql(t) {
      var e = !0;
      t.current.mode & (Ba | Zc) || (e = !1), bv(
        t,
        t.current,
        e
      );
    }
    function vn(t) {
      if ((Zt & Dl) === Jl) {
        var e = t.tag;
        if (e === 3 || e === 1 || e === 0 || e === 11 || e === 14 || e === 15) {
          if (e = tt(t) || "ReactComponent", jS !== null) {
            if (jS.has(e)) return;
            jS.add(e);
          } else jS = /* @__PURE__ */ new Set([e]);
          $(t, function() {
            console.error(
              "Can't perform a React state update on a component that hasn't mounted yet. This indicates that you have a side-effect in your render function that asynchronously tries to update the component. Move this work to useEffect instead."
            );
          });
        }
      }
    }
    function cs(t, e) {
      Ju && t.memoizedUpdaters.forEach(function(a) {
        m1(t, a, e);
      });
    }
    function ua(t, e) {
      var a = x.actQueue;
      return a !== null ? (a.push(e), s4) : As(t, e);
    }
    function fp(t) {
      U0() && x.actQueue === null && $(t, function() {
        console.error(
          `An update to %s inside a test was not wrapped in act(...).

When testing, code that causes React state updates should be wrapped into act(...):

act(() => {
  /* fire events that update state */
});
/* assert on the output */

This ensures that you're testing the behavior the user would see in the browser. Learn more at https://react.dev/link/wrap-tests-with-act`,
          tt(t)
        );
      });
    }
    function ca(t) {
      t !== Jm && t.next === null && (Jm === null ? Lm = Jm = t : Jm = Jm.next = t), wS = !0, x.actQueue !== null ? _2 || (_2 = !0, Tv()) : M2 || (M2 = !0, Tv());
    }
    function is(t, e) {
      if (!U2 && wS) {
        U2 = !0;
        do
          for (var a = !1, c = Lm; c !== null; ) {
            if (t !== 0) {
              var o = c.pendingLanes;
              if (o === 0) var f = 0;
              else {
                var d = c.suspendedLanes, h = c.pingedLanes;
                f = (1 << 31 - $e(42 | t) + 1) - 1, f &= o & ~(d & ~h), f = f & 201326741 ? f & 201326741 | 1 : f ? f | 2 : 0;
              }
              f !== 0 && (a = !0, G0(c, f));
            } else
              f = St, f = Sf(
                c,
                c === ye ? f : 0,
                c.cancelPendingCommit !== null || c.timeoutHandle !== nh
              ), (f & 3) === 0 || to(c, f) || (a = !0, G0(c, f));
            c = c.next;
          }
        while (a);
        U2 = !1;
      }
    }
    function ju() {
      c1 = window.event, wu();
    }
    function wu() {
      wS = _2 = M2 = !1;
      var t = 0;
      Ls !== 0 && rs() && (t = Ls);
      for (var e = Ue(), a = null, c = Lm; c !== null; ) {
        var o = c.next, f = gn(c, e);
        f === 0 ? (c.next = null, a === null ? Lm = o : a.next = o, o === null && (Jm = a)) : (a = c, (t !== 0 || (f & 3) !== 0) && (wS = !0)), c = o;
      }
      Be !== Fi && Be !== xS || is(t), Ls !== 0 && (Ls = 0);
    }
    function gn(t, e) {
      for (var a = t.suspendedLanes, c = t.pingedLanes, o = t.expirationTimes, f = t.pendingLanes & -62914561; 0 < f; ) {
        var d = 31 - $e(f), h = 1 << d, y = o[d];
        y === -1 ? ((h & a) === 0 || (h & c) !== 0) && (o[d] = nb(h, e)) : y <= e && (t.expiredLanes |= h), f &= ~h;
      }
      if (e = ye, a = St, a = Sf(
        t,
        t === e ? a : 0,
        t.cancelPendingCommit !== null || t.timeoutHandle !== nh
      ), c = t.callbackNode, a === 0 || t === e && (oe === Wd || oe === Id) || t.cancelPendingCommit !== null)
        return c !== null && Oa(c), t.callbackNode = null, t.callbackPriority = 0;
      if ((a & 3) === 0 || to(t, a)) {
        if (e = a & -a, e !== t.callbackPriority || x.actQueue !== null && c !== N2)
          Oa(c);
        else return e;
        switch (eo(a)) {
          case wl:
          case iu:
            a = dm;
            break;
          case Ku:
            a = Os;
            break;
          case wc:
            a = fg;
            break;
          default:
            a = Os;
        }
        return c = q0.bind(null, t), x.actQueue !== null ? (x.actQueue.push(c), a = N2) : a = As(a, c), t.callbackPriority = e, t.callbackNode = a, e;
      }
      return c !== null && Oa(c), t.callbackPriority = 2, t.callbackNode = null, 2;
    }
    function q0(t, e) {
      if (hS = dS = !1, c1 = window.event, Be !== Fi && Be !== xS)
        return t.callbackNode = null, t.callbackPriority = 0, null;
      var a = t.callbackNode;
      if (yu === BS && (yu = E2), us() && t.callbackNode !== a)
        return null;
      var c = St;
      return c = Sf(
        t,
        t === ye ? c : 0,
        t.cancelPendingCommit !== null || t.timeoutHandle !== nh
      ), c === 0 ? null : (ld(
        t,
        c,
        e
      ), gn(t, Ue()), t.callbackNode != null && t.callbackNode === a ? q0.bind(null, t) : null);
    }
    function G0(t, e) {
      if (us()) return null;
      dS = hS, hS = !1, ld(t, e, !0);
    }
    function Oa(t) {
      t !== N2 && t !== null && Kp(t);
    }
    function Tv() {
      x.actQueue !== null && x.actQueue.push(function() {
        return wu(), null;
      }), b4(function() {
        (Zt & (Dl | hu)) !== Jl ? As(
          rm,
          ju
        ) : wu();
      });
    }
    function _i() {
      if (Ls === 0) {
        var t = Gs;
        t === 0 && (t = _d, _d <<= 1, (_d & 261888) === 0 && (_d = 256)), Ls = t;
      }
      return Ls;
    }
    function os(t) {
      return t == null || typeof t == "symbol" || typeof t == "boolean" ? null : typeof t == "function" ? t : (ne(t, "action"), Eu(t));
    }
    function Vo(t, e, a, c, o) {
      if (e === "submit" && a && a.stateNode === o) {
        var f = os(
          (o[Al] || null).action
        ), d = c.submitter;
        d && (e = (e = d[Al] || null) ? os(e.formAction) : d.getAttribute("formAction"), e !== null && (f = e, d = null));
        var h = new eS(
          "action",
          "action",
          null,
          c,
          o
        );
        t.push({
          event: h,
          listeners: [
            {
              instance: null,
              listener: function() {
                if (c.defaultPrevented) {
                  if (Ls !== 0) {
                    var y = new FormData(o, d), v = {
                      pending: !0,
                      data: y,
                      method: o.method,
                      action: f
                    };
                    Object.freeze(v), tl(
                      a,
                      v,
                      null,
                      y
                    );
                  }
                } else
                  typeof f == "function" && (h.preventDefault(), y = new FormData(o, d), v = {
                    pending: !0,
                    data: y,
                    method: o.method,
                    action: f
                  }, Object.freeze(v), tl(
                    a,
                    v,
                    f,
                    y
                  ));
              },
              currentTarget: o
            }
          ]
        });
      }
    }
    function Xu(t, e, a) {
      t.currentTarget = a;
      try {
        e(t);
      } catch (c) {
        Vb(c);
      }
      t.currentTarget = null;
    }
    function Ev(t, e) {
      e = (e & 4) !== 0;
      for (var a = 0; a < t.length; a++) {
        var c = t[a];
        t: {
          var o = void 0, f = c.event;
          if (c = c.listeners, e)
            for (var d = c.length - 1; 0 <= d; d--) {
              var h = c[d], y = h.instance, v = h.currentTarget;
              if (h = h.listener, y !== o && f.isPropagationStopped())
                break t;
              y !== null ? $(
                y,
                Xu,
                f,
                h,
                v
              ) : Xu(f, h, v), o = y;
            }
          else
            for (d = 0; d < c.length; d++) {
              if (h = c[d], y = h.instance, v = h.currentTarget, h = h.listener, y !== o && f.isPropagationStopped())
                break t;
              y !== null ? $(
                y,
                Xu,
                f,
                h,
                v
              ) : Xu(f, h, v), o = y;
            }
        }
      }
    }
    function _t(t, e) {
      H2.has(t) || console.error(
        'Did not expect a listenToNonDelegatedEvent() call for "%s". This is a bug in React. Please file an issue.',
        t
      );
      var a = e[Hd];
      a === void 0 && (a = e[Hd] = /* @__PURE__ */ new Set());
      var c = t + "__bubble";
      a.has(c) || (sd(e, t, 2, !1), a.add(c));
    }
    function jo(t, e, a) {
      H2.has(t) && !e && console.error(
        'Did not expect a listenToNativeEvent() call for "%s" in the bubble phase. This is a bug in React. Please file an issue.',
        t
      );
      var c = 0;
      e && (c |= 4), sd(
        a,
        t,
        c,
        e
      );
    }
    function V0(t) {
      if (!t[XS]) {
        t[XS] = !0, Qc.forEach(function(a) {
          a !== "selectionchange" && (H2.has(a) || jo(a, !1, t), jo(a, !0, t));
        });
        var e = t.nodeType === 9 ? t : t.ownerDocument;
        e === null || e[XS] || (e[XS] = !0, jo("selectionchange", !1, e));
      }
    }
    function sd(t, e, a, c) {
      switch (qp(e)) {
        case wl:
          var o = xp;
          break;
        case iu:
          o = Yp;
          break;
        default:
          o = Jv;
      }
      a = o.bind(
        null,
        e,
        a,
        t
      ), o = void 0, !Mb || e !== "touchstart" && e !== "touchmove" && e !== "wheel" || (o = !0), c ? o !== void 0 ? t.addEventListener(e, a, {
        capture: !0,
        passive: o
      }) : t.addEventListener(e, a, !0) : o !== void 0 ? t.addEventListener(e, a, {
        passive: o
      }) : t.addEventListener(
        e,
        a,
        !1
      );
    }
    function j0(t, e, a, c, o) {
      var f = c;
      if ((e & 1) === 0 && (e & 2) === 0 && c !== null)
        t: for (; ; ) {
          if (c === null) return;
          var d = c.tag;
          if (d === 3 || d === 4) {
            var h = c.stateNode.containerInfo;
            if (h === o) break;
            if (d === 4)
              for (d = c.return; d !== null; ) {
                var y = d.tag;
                if ((y === 3 || y === 4) && d.stateNode.containerInfo === o)
                  return;
                d = d.return;
              }
            for (; h !== null; ) {
              if (d = lo(h), d === null) return;
              if (y = d.tag, y === 5 || y === 6 || y === 26 || y === 27) {
                c = f = d;
                continue t;
              }
              h = h.parentNode;
            }
          }
          c = c.return;
        }
      vh(function() {
        var v = f, p = yh(a), z = [];
        t: {
          var E = cT.get(t);
          if (E !== void 0) {
            var M = eS, j = t;
            switch (t) {
              case "keypress":
                if (io(a) === 0) break t;
              case "keydown":
              case "keyup":
                M = zE;
                break;
              case "focusin":
                j = "focus", M = Hb;
                break;
              case "focusout":
                j = "blur", M = Hb;
                break;
              case "beforeblur":
              case "afterblur":
                M = Hb;
                break;
              case "click":
                if (a.button === 2) break t;
              case "auxclick":
              case "dblclick":
              case "mousedown":
              case "mousemove":
              case "mouseup":
              case "mouseout":
              case "mouseover":
              case "contextmenu":
                M = J2;
                break;
              case "drag":
              case "dragend":
              case "dragenter":
              case "dragexit":
              case "dragleave":
              case "dragover":
              case "dragstart":
              case "drop":
                M = rE;
                break;
              case "touchcancel":
              case "touchend":
              case "touchmove":
              case "touchstart":
                M = RE;
                break;
              case lT:
              case aT:
              case nT:
                M = mE;
                break;
              case uT:
                M = _E;
                break;
              case "scroll":
              case "scrollend":
                M = fE;
                break;
              case "wheel":
                M = NE;
                break;
              case "copy":
              case "cut":
              case "paste":
                M = vE;
                break;
              case "gotpointercapture":
              case "lostpointercapture":
              case "pointercancel":
              case "pointerdown":
              case "pointermove":
              case "pointerout":
              case "pointerover":
              case "pointerup":
                M = $2;
                break;
              case "submit":
                M = DE;
                break;
              case "toggle":
              case "beforetoggle":
                M = BE;
            }
            var J = (e & 4) !== 0, et = !J && (t === "scroll" || t === "scrollend"), Et = J ? E !== null ? E + "Capture" : null : E;
            J = [];
            for (var b = v, T; b !== null; ) {
              var A = b;
              if (T = A.stateNode, A = A.tag, A !== 5 && A !== 26 && A !== 27 || T === null || Et === null || (A = sr(b, Et), A != null && J.push(
                rd(
                  b,
                  A,
                  T
                )
              )), et) break;
              b = b.return;
            }
            0 < J.length && (E = new M(
              E,
              j,
              null,
              a,
              p
            ), z.push({
              event: E,
              listeners: J
            }));
          }
        }
        if ((e & 7) === 0) {
          t: {
            if (M = t === "mouseover" || t === "pointerover", E = t === "mouseout" || t === "pointerout", M && a !== vg && (j = a.relatedTarget || a.fromElement) && (lo(j) || j[$u]))
              break t;
            (E || M) && (j = p.window === p ? p : (M = p.ownerDocument) ? M.defaultView || M.parentWindow : window, E ? (M = a.relatedTarget || a.toElement, E = v, M = M ? lo(M) : null, M !== null && (et = Wt(M), J = M.tag, M !== et || J !== 5 && J !== 27 && J !== 6) && (M = null)) : (E = null, M = v), E !== M && (J = J2, A = "onMouseLeave", Et = "onMouseEnter", b = "mouse", (t === "pointerout" || t === "pointerover") && (J = $2, A = "onPointerLeave", Et = "onPointerEnter", b = "pointer"), et = E == null ? j : lr(E), T = M == null ? j : lr(M), j = new J(
              A,
              b + "leave",
              E,
              a,
              p
            ), j.target = et, j.relatedTarget = T, A = null, lo(p) === v && (J = new J(
              Et,
              b + "enter",
              M,
              a,
              p
            ), J.target = T, J.relatedTarget = et, A = J), et = A, J = E && M ? L(
              E,
              M,
              Kt
            ) : null, E !== null && ce(
              z,
              j,
              E,
              J,
              !1
            ), M !== null && et !== null && ce(
              z,
              et,
              M,
              J,
              !0
            )));
          }
          t: {
            if (E = v ? lr(v) : window, M = E.nodeName && E.nodeName.toLowerCase(), M === "select" || M === "input" && E.type === "file")
              var B = dr;
            else if (Au(E))
              if (tT)
                B = ii;
              else {
                B = D1;
                var X = Sh;
              }
            else
              M = E.nodeName, !M || M.toLowerCase() !== "input" || E.type !== "checkbox" && E.type !== "radio" ? v && co(v.elementType) && (B = dr) : B = Wl;
            if (B && (B = B(t, v))) {
              Df(
                z,
                B,
                a,
                p
              );
              break t;
            }
            X && X(t, E, v);
          }
          switch (X = v ? lr(v) : window, t) {
            case "focusin":
              (Au(X) || X.contentEditable === "true") && (Tm = X, xb = v, zg = null);
              break;
            case "focusout":
              zg = xb = Tm = null;
              break;
            case "mousedown":
              Yb = !0;
              break;
            case "contextmenu":
            case "mouseup":
            case "dragend":
              Yb = !1, C1(
                z,
                a,
                p
              );
              break;
            case "selectionchange":
              if (GE) break;
            case "keydown":
            case "keyup":
              C1(
                z,
                a,
                p
              );
          }
          var ot;
          if (Bb)
            t: {
              switch (t) {
                case "compositionstart":
                  var lt = "onCompositionStart";
                  break t;
                case "compositionend":
                  lt = "onCompositionEnd";
                  break t;
                case "compositionupdate":
                  lt = "onCompositionUpdate";
                  break t;
              }
              lt = void 0;
            }
          else
            bm ? dy(t, a) && (lt = "onCompositionEnd") : t === "keydown" && a.keyCode === F2 && (lt = "onCompositionStart");
          lt && (W2 && a.locale !== "ko" && (bm || lt !== "onCompositionStart" ? lt === "onCompositionEnd" && bm && (ot = A1()) : (Rs = p, _b = "value" in Rs ? Rs.value : Rs.textContent, bm = !0)), X = w0(
            v,
            lt
          ), 0 < X.length && (lt = new K2(
            lt,
            t,
            null,
            a,
            p
          ), z.push({
            event: lt,
            listeners: X
          }), ot ? lt.data = ot : (ot = ph(a), ot !== null && (lt.data = ot)))), (ot = YE ? O1(t, a) : rr(t, a)) && (lt = w0(
            v,
            "onBeforeInput"
          ), 0 < lt.length && (X = new pE(
            "onBeforeInput",
            "beforeinput",
            null,
            a,
            p
          ), z.push({
            event: X,
            listeners: lt
          }), X.data = ot)), Vo(
            z,
            t,
            v,
            a,
            p
          );
        }
        Ev(z, e);
      });
    }
    function rd(t, e, a) {
      return {
        instance: t,
        listener: e,
        currentTarget: a
      };
    }
    function w0(t, e) {
      for (var a = e + "Capture", c = []; t !== null; ) {
        var o = t, f = o.stateNode;
        if (o = o.tag, o !== 5 && o !== 26 && o !== 27 || f === null || (o = sr(t, a), o != null && c.unshift(
          rd(t, o, f)
        ), o = sr(t, e), o != null && c.push(
          rd(t, o, f)
        )), t.tag === 3) return c;
        t = t.return;
      }
      return [];
    }
    function Kt(t) {
      if (t === null) return null;
      do
        t = t.return;
      while (t && t.tag !== 5 && t.tag !== 27);
      return t || null;
    }
    function ce(t, e, a, c, o) {
      for (var f = e._reactName, d = []; a !== null && a !== c; ) {
        var h = a, y = h.alternate, v = h.stateNode;
        if (h = h.tag, y !== null && y === c) break;
        h !== 5 && h !== 26 && h !== 27 || v === null || (y = v, o ? (v = sr(a, f), v != null && d.unshift(
          rd(a, v, y)
        )) : o || (v = sr(a, f), v != null && d.push(
          rd(a, v, y)
        ))), a = a.return;
      }
      d.length !== 0 && t.push({ event: e, listeners: d });
    }
    function Dt(t, e) {
      Af(t, e), t !== "input" && t !== "textarea" && t !== "select" || e == null || e.value !== null || Bt || (Bt = !0, t === "select" && e.multiple ? console.error(
        "`value` prop on `%s` should not be null. Consider using an empty array when `multiple` is set to `true` to clear the component or `undefined` for uncontrolled components.",
        t
      ) : console.error(
        "`value` prop on `%s` should not be null. Consider using an empty string to clear the component or `undefined` for uncontrolled components.",
        t
      ));
      var a = {
        registrationNameDependencies: fu,
        possibleRegistrationNames: Po
      };
      co(t) || typeof e.is == "string" || z1(t, e, a), e.contentEditable && !e.suppressContentEditableWarning && e.children != null && console.error(
        "A component is `contentEditable` and contains `children` managed by React. It is now your responsibility to guarantee that none of those nodes are unexpectedly modified or duplicated. This is probably not intentional."
      );
    }
    function ut(t, e, a, c) {
      e !== a && (a = Gl(a), Gl(e) !== a && (c[t] = e));
    }
    function te(t) {
      return !!(t.getAttribute("vt-share") || t.getAttribute("vt-exit") || t.getAttribute("vt-enter") || t.getAttribute("vt-update"));
    }
    function Da(t) {
      if (!te(t)) return !1;
      var e = t.getAttribute("vt-name");
      return t = t.style["view-transition-name"], e ? e === t : t.startsWith("_T_");
    }
    function Ui(t, e, a) {
      e.forEach(function(c) {
        c === "style" ? t.getAttribute(c) !== "" && (c = t.style, (c.length === 1 && c[0] === "view-transition-name" || c.length === 2 && c[0] === "view-transition-class" && c[1] === "view-transition-name") && Da(t) || (a.style = Xo(t))) : a[wo(c)] = t.getAttribute(c);
      });
    }
    function ia(t, e) {
      e === !1 ? console.error(
        "Expected `%s` listener to be a function, instead got `false`.\n\nIf you used to conditionally omit it with %s={condition && value}, pass %s={condition ? value : undefined} instead.",
        t,
        t,
        t
      ) : console.error(
        "Expected `%s` listener to be a function, instead got a value of `%s` type.",
        t,
        typeof e
      );
    }
    function X0(t, e) {
      return t = t.namespaceURI === Z || t.namespaceURI === I ? t.ownerDocument.createElementNS(
        t.namespaceURI,
        t.tagName
      ) : t.ownerDocument.createElement(t.tagName), t.innerHTML = e, t.innerHTML;
    }
    function Gl(t) {
      return pf(t) && (console.error(
        "The provided HTML markup uses a value of unsupported type %s. This value must be coerced to a string before using it here.",
        uc(t)
      ), ei(t)), (typeof t == "string" ? t : "" + t).replace(r4, `
`).replace(d4, "");
    }
    function ze(t, e) {
      return e = Gl(e), Gl(t) === e;
    }
    function qt(t, e, a, c, o, f) {
      switch (a) {
        case "children":
          if (typeof c == "string")
            mh(c, e, !1), e === "body" || e === "textarea" && c === "" || uo(t, c);
          else if (typeof c == "number" || typeof c == "bigint")
            mh("" + c, e, !1), e !== "body" && uo(t, "" + c);
          else return;
          break;
        case "className":
          ai(t, "class", c);
          break;
        case "tabIndex":
          ai(t, "tabindex", c);
          break;
        case "dir":
        case "role":
        case "viewBox":
        case "width":
        case "height":
          ai(t, a, c);
          break;
        case "style":
          Xa(t, c, f);
          return;
        case "data":
          if (e !== "object") {
            ai(t, "data", c);
            break;
          }
        case "src":
        case "href":
          if (c === "" && (e !== "a" || a !== "href")) {
            console.error(
              a === "src" ? 'An empty string ("") was passed to the %s attribute. This may cause the browser to download the whole page again over the network. To fix this, either do not render the element at all or pass null to %s instead of an empty string.' : 'An empty string ("") was passed to the %s attribute. To fix this, either do not render the element at all or pass null to %s instead of an empty string.',
              a,
              a
            ), t.removeAttribute(a);
            break;
          }
          if (c == null || typeof c == "function" || typeof c == "symbol" || typeof c == "boolean") {
            t.removeAttribute(a);
            break;
          }
          ne(c, a), c = Eu(c), t.setAttribute(a, c);
          break;
        case "action":
        case "formAction":
          if (c != null && (e === "form" ? a === "formAction" ? console.error(
            "You can only pass the formAction prop to <input> or <button>. Use the action prop on <form>."
          ) : typeof c == "function" && (o.encType == null && o.method == null || LS || (LS = !0, console.error(
            "Cannot specify a encType or method for a form that specifies a function as the action. React provides those automatically. They will get overridden."
          )), o.target == null || ZS || (ZS = !0, console.error(
            "Cannot specify a target for a form that specifies a function as the action. The function will always be executed in the same window."
          ))) : e === "input" || e === "button" ? a === "action" ? console.error(
            "You can only pass the action prop to <form>. Use the formAction prop on <input> or <button>."
          ) : e !== "input" || o.type === "submit" || o.type === "image" || QS ? e !== "button" || o.type == null || o.type === "submit" || QS ? typeof c == "function" && (o.name == null || C3 || (C3 = !0, console.error(
            'Cannot specify a "name" prop for a button that specifies a function as a formAction. React needs it to encode which action should be invoked. It will get overridden.'
          )), o.formEncType == null && o.formMethod == null || LS || (LS = !0, console.error(
            "Cannot specify a formEncType or formMethod for a button that specifies a function as a formAction. React provides those automatically. They will get overridden."
          )), o.formTarget == null || ZS || (ZS = !0, console.error(
            "Cannot specify a formTarget for a button that specifies a function as a formAction. The function will always be executed in the same window."
          ))) : (QS = !0, console.error(
            'A button can only specify a formAction along with type="submit" or no type.'
          )) : (QS = !0, console.error(
            'An input can only specify a formAction along with type="submit" or type="image".'
          )) : console.error(
            a === "action" ? "You can only pass the action prop to <form>." : "You can only pass the formAction prop to <input> or <button>."
          )), typeof c == "function") {
            t.setAttribute(
              a,
              "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')"
            );
            break;
          } else
            typeof f == "function" && (a === "formAction" ? (e !== "input" && qt(t, e, "name", o.name, o, null), qt(
              t,
              e,
              "formEncType",
              o.formEncType,
              o,
              null
            ), qt(
              t,
              e,
              "formMethod",
              o.formMethod,
              o,
              null
            ), qt(
              t,
              e,
              "formTarget",
              o.formTarget,
              o,
              null
            )) : (qt(
              t,
              e,
              "encType",
              o.encType,
              o,
              null
            ), qt(t, e, "method", o.method, o, null), qt(
              t,
              e,
              "target",
              o.target,
              o,
              null
            )));
          if (c == null || typeof c == "symbol" || typeof c == "boolean") {
            t.removeAttribute(a);
            break;
          }
          ne(c, a), c = Eu(c), t.setAttribute(a, c);
          break;
        case "onClick":
          c != null && (typeof c != "function" && ia(a, c), t.onclick = zu);
          return;
        case "onScroll":
          c != null && (typeof c != "function" && ia(a, c), _t("scroll", t));
          return;
        case "onScrollEnd":
          c != null && (typeof c != "function" && ia(a, c), _t("scrollend", t));
          return;
        case "dangerouslySetInnerHTML":
          if (c != null) {
            if (typeof c != "object" || !("__html" in c))
              throw Error(
                "`props.dangerouslySetInnerHTML` must be in the form `{__html: ...}`. Please visit https://react.dev/link/dangerously-set-inner-html for more information."
              );
            if (a = c.__html, a != null) {
              if (o.children != null)
                throw Error(
                  "Can only set one of `children` or `props.dangerouslySetInnerHTML`."
                );
              f?.__html !== a && (t.innerHTML = a);
            }
          }
          break;
        case "multiple":
          t.multiple = c && typeof c != "function" && typeof c != "symbol";
          break;
        case "muted":
          t.muted = c && typeof c != "function" && typeof c != "symbol";
          break;
        case "suppressContentEditableWarning":
        case "suppressHydrationWarning":
        case "defaultValue":
        case "defaultChecked":
        case "innerHTML":
        case "ref":
          break;
        case "autoFocus":
          break;
        case "xlinkHref":
          if (c == null || typeof c == "function" || typeof c == "boolean" || typeof c == "symbol") {
            t.removeAttribute("xlink:href");
            break;
          }
          ne(c, a), a = Eu(c), t.setAttributeNS(eh, "xlink:href", a);
          break;
        case "contentEditable":
        case "spellCheck":
        case "draggable":
        case "value":
        case "autoReverse":
        case "externalResourcesRequired":
        case "focusable":
        case "preserveAlpha":
          c != null && typeof c != "function" && typeof c != "symbol" ? (ne(c, a), t.setAttribute(a, c)) : t.removeAttribute(a);
          break;
        case "inert":
          c !== "" || JS[a] || (JS[a] = !0, console.error(
            "Received an empty string for a boolean attribute `%s`. This will treat the attribute as if it were false. Either pass `false` to silence this warning, or pass `true` if you used an empty string in earlier versions of React to indicate this attribute is true.",
            a
          ));
        case "allowFullScreen":
        case "async":
        case "autoPlay":
        case "controls":
        case "credentialless":
        case "default":
        case "defer":
        case "disabled":
        case "disablePictureInPicture":
        case "disableRemotePlayback":
        case "formNoValidate":
        case "hidden":
        case "loop":
        case "noModule":
        case "noValidate":
        case "open":
        case "playsInline":
        case "readOnly":
        case "required":
        case "reversed":
        case "scoped":
        case "seamless":
        case "itemScope":
          c && typeof c != "function" && typeof c != "symbol" ? t.setAttribute(a, "") : t.removeAttribute(a);
          break;
        case "capture":
        case "download":
          c === !0 ? t.setAttribute(a, "") : c !== !1 && c != null && typeof c != "function" && typeof c != "symbol" ? (ne(c, a), t.setAttribute(a, c)) : t.removeAttribute(a);
          break;
        case "cols":
        case "rows":
        case "size":
        case "span":
          c != null && typeof c != "function" && typeof c != "symbol" && !isNaN(c) && 1 <= c ? (ne(c, a), t.setAttribute(a, c)) : t.removeAttribute(a);
          break;
        case "rowSpan":
        case "start":
          c == null || typeof c == "function" || typeof c == "symbol" || isNaN(c) ? t.removeAttribute(a) : (ne(c, a), t.setAttribute(a, c));
          break;
        case "popover":
          _t("beforetoggle", t), _t("toggle", t), bf(t, "popover", c);
          break;
        case "xlinkActuate":
          fc(
            t,
            eh,
            "xlink:actuate",
            c
          );
          break;
        case "xlinkArcrole":
          fc(
            t,
            eh,
            "xlink:arcrole",
            c
          );
          break;
        case "xlinkRole":
          fc(
            t,
            eh,
            "xlink:role",
            c
          );
          break;
        case "xlinkShow":
          fc(
            t,
            eh,
            "xlink:show",
            c
          );
          break;
        case "xlinkTitle":
          fc(
            t,
            eh,
            "xlink:title",
            c
          );
          break;
        case "xlinkType":
          fc(
            t,
            eh,
            "xlink:type",
            c
          );
          break;
        case "xmlBase":
          fc(
            t,
            B2,
            "xml:base",
            c
          );
          break;
        case "xmlLang":
          fc(
            t,
            B2,
            "xml:lang",
            c
          );
          break;
        case "xmlSpace":
          fc(
            t,
            B2,
            "xml:space",
            c
          );
          break;
        case "is":
          f != null && console.error(
            'Cannot update the "is" prop after it has been initialized.'
          ), bf(t, "is", c);
          break;
        case "innerText":
        case "textContent":
          return;
        case "popoverTarget":
          R3 || c == null || typeof c != "object" || (R3 = !0, console.error(
            "The `popoverTarget` prop expects the ID of an Element as a string. Received %s instead.",
            c
          ));
        default:
          if (!(2 < a.length) || a[0] !== "o" && a[0] !== "O" || a[1] !== "n" && a[1] !== "N")
            a = fy(a), bf(t, a, c);
          else {
            fu.hasOwnProperty(a) && c != null && typeof c != "function" && ia(a, c);
            return;
          }
      }
      Lt = !0;
    }
    function xc(t, e, a, c, o, f) {
      switch (a) {
        case "style":
          Xa(t, c, f);
          return;
        case "dangerouslySetInnerHTML":
          if (c != null) {
            if (typeof c != "object" || !("__html" in c))
              throw Error(
                "`props.dangerouslySetInnerHTML` must be in the form `{__html: ...}`. Please visit https://react.dev/link/dangerously-set-inner-html for more information."
              );
            if (a = c.__html, a != null) {
              if (o.children != null)
                throw Error(
                  "Can only set one of `children` or `props.dangerouslySetInnerHTML`."
                );
              f?.__html !== a && (t.innerHTML = a);
            }
          }
          break;
        case "children":
          if (typeof c == "string") uo(t, c);
          else if (typeof c == "number" || typeof c == "bigint")
            uo(t, "" + c);
          else return;
          break;
        case "onScroll":
          c != null && (typeof c != "function" && ia(a, c), _t("scroll", t));
          return;
        case "onScrollEnd":
          c != null && (typeof c != "function" && ia(a, c), _t("scrollend", t));
          return;
        case "onClick":
          c != null && (typeof c != "function" && ia(a, c), t.onclick = zu);
          return;
        case "suppressContentEditableWarning":
        case "suppressHydrationWarning":
        case "innerHTML":
        case "ref":
          return;
        case "innerText":
        case "textContent":
          return;
        default:
          if (fu.hasOwnProperty(a))
            c != null && typeof c != "function" && ia(a, c);
          else
            t: {
              if (a[0] === "o" && a[1] === "n" && (o = a.endsWith("Capture"), f = a.slice(2, o ? a.length - 7 : void 0), e = t[Al] || null, e = e != null ? e[a] : null, typeof e == "function" && t.removeEventListener(f, e, o), typeof c == "function")) {
                typeof e != "function" && e !== null && (a in t ? t[a] = null : t.hasAttribute(a) && t.removeAttribute(a)), t.addEventListener(f, c, o);
                break t;
              }
              Lt = !0, a in t ? t[a] = c : c === !0 ? t.setAttribute(a, "") : bf(t, a, c);
            }
          return;
      }
      Lt = !0;
    }
    function Ke(t, e, a) {
      switch (Dt(e, a), e) {
        case "div":
        case "span":
        case "svg":
        case "path":
        case "a":
        case "g":
        case "p":
        case "li":
          break;
        case "img":
          _t("error", t), _t("load", t);
          var c = !1, o = !1, f;
          for (f in a)
            if (a.hasOwnProperty(f)) {
              var d = a[f];
              if (d != null)
                switch (f) {
                  case "src":
                    c = !0;
                    break;
                  case "srcSet":
                    o = !0;
                    break;
                  case "children":
                  case "dangerouslySetInnerHTML":
                    throw Error(
                      e + " is a void element tag and must neither have `children` nor use `dangerouslySetInnerHTML`."
                    );
                  default:
                    qt(t, e, f, d, a, null);
                }
            }
          o && qt(t, e, "srcSet", a.srcSet, a, null), c && qt(t, e, "src", a.src, a, null);
          return;
        case "input":
          Tu("input", a), _t("invalid", t);
          var h = f = d = o = null, y = null, v = null;
          for (c in a)
            if (a.hasOwnProperty(c)) {
              var p = a[c];
              if (p != null)
                switch (c) {
                  case "name":
                    o = p;
                    break;
                  case "type":
                    d = p;
                    break;
                  case "checked":
                    y = p;
                    break;
                  case "defaultChecked":
                    v = p;
                    break;
                  case "value":
                    f = p;
                    break;
                  case "defaultValue":
                    h = p;
                    break;
                  case "children":
                  case "dangerouslySetInnerHTML":
                    if (p != null)
                      throw Error(
                        e + " is a void element tag and must neither have `children` nor use `dangerouslySetInnerHTML`."
                      );
                    break;
                  default:
                    qt(t, e, c, p, a, null);
                }
            }
          ay(t, a), ul(
            t,
            f,
            h,
            y,
            v,
            d,
            o,
            !1
          );
          return;
        case "select":
          Tu("select", a), _t("invalid", t), c = d = f = null;
          for (o in a)
            if (a.hasOwnProperty(o) && (h = a[o], h != null))
              switch (o) {
                case "value":
                  f = h;
                  break;
                case "defaultValue":
                  d = h;
                  break;
                case "multiple":
                  c = h;
                default:
                  qt(
                    t,
                    e,
                    o,
                    h,
                    a,
                    null
                  );
              }
          p1(t, a), e = f, a = d, t.multiple = !!c, e != null ? Tf(t, !!c, e, !1) : a != null && Tf(t, !!c, a, !0);
          return;
        case "textarea":
          Tu("textarea", a), _t("invalid", t), f = o = c = null;
          for (d in a)
            if (a.hasOwnProperty(d) && (h = a[d], h != null))
              switch (d) {
                case "value":
                  c = h;
                  break;
                case "defaultValue":
                  o = h;
                  break;
                case "children":
                  f = h;
                  break;
                case "dangerouslySetInnerHTML":
                  if (h != null)
                    throw Error(
                      "`dangerouslySetInnerHTML` does not make sense on <textarea>."
                    );
                  break;
                default:
                  qt(
                    t,
                    e,
                    d,
                    h,
                    a,
                    null
                  );
              }
          uy(t, a), ur(t, c, o, f);
          return;
        case "option":
          ao(t, a);
          for (y in a)
            a.hasOwnProperty(y) && (c = a[y], c != null) && (y === "selected" ? t.selected = c && typeof c != "function" && typeof c != "symbol" : qt(t, e, y, c, a, null));
          return;
        case "dialog":
          _t("beforetoggle", t), _t("toggle", t), _t("cancel", t), _t("close", t);
          break;
        case "iframe":
        case "object":
          _t("load", t);
          break;
        case "video":
        case "audio":
          for (c = 0; c < a1.length; c++)
            _t(a1[c], t);
          break;
        case "image":
          _t("error", t), _t("load", t);
          break;
        case "details":
          _t("toggle", t);
          break;
        case "embed":
        case "source":
        case "link":
          _t("error", t), _t("load", t);
        case "area":
        case "base":
        case "br":
        case "col":
        case "hr":
        case "keygen":
        case "meta":
        case "param":
        case "track":
        case "wbr":
        case "menuitem":
          for (v in a)
            if (a.hasOwnProperty(v) && (c = a[v], c != null))
              switch (v) {
                case "children":
                case "dangerouslySetInnerHTML":
                  throw Error(
                    e + " is a void element tag and must neither have `children` nor use `dangerouslySetInnerHTML`."
                  );
                default:
                  qt(t, e, v, c, a, null);
              }
          return;
        default:
          if (co(e)) {
            for (p in a)
              a.hasOwnProperty(p) && (c = a[p], c !== void 0 && xc(
                t,
                e,
                p,
                c,
                a,
                void 0
              ));
            return;
          }
      }
      for (h in a)
        a.hasOwnProperty(h) && (c = a[h], c != null && qt(t, e, h, c, a, null));
    }
    function Ia(t, e, a, c) {
      switch (Dt(e, c), e) {
        case "div":
        case "span":
        case "svg":
        case "path":
        case "a":
        case "g":
        case "p":
        case "li":
          break;
        case "input":
          var o = null, f = null, d = null, h = null, y = null, v = null, p = null;
          for (M in a) {
            var z = a[M];
            if (a.hasOwnProperty(M) && z != null)
              switch (M) {
                case "checked":
                  break;
                case "value":
                  break;
                case "defaultValue":
                  y = z;
                default:
                  c.hasOwnProperty(M) || qt(
                    t,
                    e,
                    M,
                    null,
                    c,
                    z
                  );
              }
          }
          for (var E in c) {
            var M = c[E];
            if (z = a[E], c.hasOwnProperty(E) && (M != null || z != null))
              switch (E) {
                case "type":
                  M !== z && (Lt = !0), f = M;
                  break;
                case "name":
                  M !== z && (Lt = !0), o = M;
                  break;
                case "checked":
                  M !== z && (Lt = !0), v = M;
                  break;
                case "defaultChecked":
                  M !== z && (Lt = !0), p = M;
                  break;
                case "value":
                  M !== z && (Lt = !0), d = M;
                  break;
                case "defaultValue":
                  M !== z && (Lt = !0), h = M;
                  break;
                case "children":
                case "dangerouslySetInnerHTML":
                  if (M != null)
                    throw Error(
                      e + " is a void element tag and must neither have `children` nor use `dangerouslySetInnerHTML`."
                    );
                  break;
                default:
                  M !== z && qt(
                    t,
                    e,
                    E,
                    M,
                    c,
                    z
                  );
              }
          }
          e = a.type === "checkbox" || a.type === "radio" ? a.checked != null : a.value != null, c = c.type === "checkbox" || c.type === "radio" ? c.checked != null : c.value != null, e || !c || D3 || (console.error(
            "A component is changing an uncontrolled input to be controlled. This is likely caused by the value changing from undefined to a defined value, which should not happen. Decide between using a controlled or uncontrolled input element for the lifetime of the component. More info: https://react.dev/link/controlled-components"
          ), D3 = !0), !e || c || O3 || (console.error(
            "A component is changing a controlled input to be uncontrolled. This is likely caused by the value changing from a defined to undefined, which should not happen. Decide between using a controlled or uncontrolled input element for the lifetime of the component. More info: https://react.dev/link/controlled-components"
          ), O3 = !0), Hn(
            t,
            d,
            h,
            y,
            v,
            p,
            f,
            o
          );
          return;
        case "select":
          M = d = h = E = null;
          for (f in a)
            if (y = a[f], a.hasOwnProperty(f) && y != null)
              switch (f) {
                case "value":
                  break;
                case "multiple":
                  M = y;
                default:
                  c.hasOwnProperty(f) || qt(
                    t,
                    e,
                    f,
                    null,
                    c,
                    y
                  );
              }
          for (o in c)
            if (f = c[o], y = a[o], c.hasOwnProperty(o) && (f != null || y != null))
              switch (o) {
                case "value":
                  f !== y && (Lt = !0), E = f;
                  break;
                case "defaultValue":
                  f !== y && (Lt = !0), h = f;
                  break;
                case "multiple":
                  f !== y && (Lt = !0), d = f;
                default:
                  f !== y && qt(
                    t,
                    e,
                    o,
                    f,
                    c,
                    y
                  );
              }
          c = h, e = d, a = M, E != null ? Tf(t, !!e, E, !1) : !!a != !!e && (c != null ? Tf(t, !!e, c, !0) : Tf(t, !!e, e ? [] : "", !1));
          return;
        case "textarea":
          M = E = null;
          for (h in a)
            if (o = a[h], a.hasOwnProperty(h) && o != null && !c.hasOwnProperty(h))
              switch (h) {
                case "value":
                  break;
                case "children":
                  break;
                default:
                  qt(t, e, h, null, c, o);
              }
          for (d in c)
            if (o = c[d], f = a[d], c.hasOwnProperty(d) && (o != null || f != null))
              switch (d) {
                case "value":
                  o !== f && (Lt = !0), E = o;
                  break;
                case "defaultValue":
                  o !== f && (Lt = !0), M = o;
                  break;
                case "children":
                  break;
                case "dangerouslySetInnerHTML":
                  if (o != null)
                    throw Error(
                      "`dangerouslySetInnerHTML` does not make sense on <textarea>."
                    );
                  break;
                default:
                  o !== f && qt(t, e, d, o, c, f);
              }
          Ef(t, E, M);
          return;
        case "option":
          for (var j in a)
            E = a[j], a.hasOwnProperty(j) && E != null && !c.hasOwnProperty(j) && (j === "selected" ? t.selected = !1 : qt(
              t,
              e,
              j,
              null,
              c,
              E
            ));
          for (y in c)
            E = c[y], M = a[y], c.hasOwnProperty(y) && E !== M && (E != null || M != null) && (y === "selected" ? (E !== M && (Lt = !0), t.selected = E && typeof E != "function" && typeof E != "symbol") : qt(
              t,
              e,
              y,
              E,
              c,
              M
            ));
          return;
        case "img":
        case "link":
        case "area":
        case "base":
        case "br":
        case "col":
        case "embed":
        case "hr":
        case "keygen":
        case "meta":
        case "param":
        case "source":
        case "track":
        case "wbr":
        case "menuitem":
          for (var J in a)
            E = a[J], a.hasOwnProperty(J) && E != null && !c.hasOwnProperty(J) && qt(
              t,
              e,
              J,
              null,
              c,
              E
            );
          for (v in c)
            if (E = c[v], M = a[v], c.hasOwnProperty(v) && E !== M && (E != null || M != null))
              switch (v) {
                case "children":
                case "dangerouslySetInnerHTML":
                  if (E != null)
                    throw Error(
                      e + " is a void element tag and must neither have `children` nor use `dangerouslySetInnerHTML`."
                    );
                  break;
                default:
                  qt(
                    t,
                    e,
                    v,
                    E,
                    c,
                    M
                  );
              }
          return;
        default:
          if (co(e)) {
            for (var et in a)
              E = a[et], a.hasOwnProperty(et) && E !== void 0 && !c.hasOwnProperty(et) && xc(
                t,
                e,
                et,
                void 0,
                c,
                E
              );
            for (p in c)
              E = c[p], M = a[p], !c.hasOwnProperty(p) || E === M || E === void 0 && M === void 0 || xc(
                t,
                e,
                p,
                E,
                c,
                M
              );
            return;
          }
      }
      for (var Et in a)
        E = a[Et], a.hasOwnProperty(Et) && E != null && !c.hasOwnProperty(Et) && qt(t, e, Et, null, c, E);
      for (z in c)
        E = c[z], M = a[z], !c.hasOwnProperty(z) || E === M || E == null && M == null || qt(t, e, z, E, c, M);
    }
    function wo(t) {
      switch (t) {
        case "class":
          return "className";
        case "for":
          return "htmlFor";
        default:
          return t;
      }
    }
    function Xo(t) {
      for (var e = {}, a = t.style, c = 0; c < a.length; c++) {
        var o = a[c];
        o === "view-transition-name" && Da(t) || (e[o] = a.getPropertyValue(o));
      }
      return e;
    }
    function oa(t, e, a) {
      if (e != null && typeof e != "object")
        console.error(
          "The `style` prop expects a mapping from style properties to values, not a string. For example, style={{marginRight: spacing + 'em'}} when using JSX."
        );
      else {
        var c, o = c = "", f;
        for (f in e)
          if (e.hasOwnProperty(f)) {
            var d = e[f];
            d != null && typeof d != "boolean" && d !== "" && (f.indexOf("--") === 0 ? (ih(d, f), c += o + f + ":" + ("" + d).trim()) : typeof d != "number" || d === 0 || U.has(f) ? (ih(d, f), c += o + f.replace(i, "-$1").toLowerCase().replace(s, "-ms-") + ":" + ("" + d).trim()) : c += o + f.replace(i, "-$1").toLowerCase().replace(s, "-ms-") + ":" + d + "px", o = ";");
          }
        c = c || null, e = t.getAttribute("style"), e !== c && (c = Gl(c), e = Gl(e), e === c || e[e.length - 1] === ";" && te(t) || (a.style = Xo(t)));
      }
    }
    function Ca(t, e, a, c, o, f) {
      if (o.delete(a), t = t.getAttribute(a), t === null)
        switch (typeof c) {
          case "undefined":
          case "function":
          case "symbol":
          case "boolean":
            return;
        }
      else if (c != null)
        switch (typeof c) {
          case "function":
          case "symbol":
          case "boolean":
            break;
          default:
            if (ne(c, e), t === "" + c)
              return;
        }
      ut(e, t, c, f);
    }
    function dd(t, e, a, c, o, f) {
      if (o.delete(a), t = t.getAttribute(a), t === null) {
        switch (typeof c) {
          case "function":
          case "symbol":
            return;
        }
        if (!c) return;
      } else
        switch (typeof c) {
          case "function":
          case "symbol":
            break;
          default:
            if (c) return;
        }
      ut(e, t, c, f);
    }
    function Q0(t, e, a, c, o, f) {
      if (o.delete(a), t = t.getAttribute(a), t === null)
        switch (typeof c) {
          case "undefined":
          case "function":
          case "symbol":
            return;
        }
      else if (c != null)
        switch (typeof c) {
          case "function":
          case "symbol":
            break;
          default:
            if (ne(c, a), t === "" + c)
              return;
        }
      ut(e, t, c, f);
    }
    function hd(t, e, a, c, o, f) {
      if (o.delete(a), t = t.getAttribute(a), t === null)
        switch (typeof c) {
          case "undefined":
          case "function":
          case "symbol":
          case "boolean":
            return;
          default:
            if (isNaN(c)) return;
        }
      else if (c != null)
        switch (typeof c) {
          case "function":
          case "symbol":
          case "boolean":
            break;
          default:
            if (!isNaN(c) && (ne(c, e), t === "" + c))
              return;
        }
      ut(e, t, c, f);
    }
    function fs(t, e, a, c, o, f) {
      if (o.delete(a), t = t.getAttribute(a), t === null)
        switch (typeof c) {
          case "undefined":
          case "function":
          case "symbol":
          case "boolean":
            return;
        }
      else if (c != null)
        switch (typeof c) {
          case "function":
          case "symbol":
          case "boolean":
            break;
          default:
            if (ne(c, e), a = Eu("" + c), t === a)
              return;
        }
      ut(e, t, c, f);
    }
    function Yc(t, e, a, c) {
      for (var o = {}, f = /* @__PURE__ */ new Set(), d = t.attributes, h = 0; h < d.length; h++)
        switch (d[h].name.toLowerCase()) {
          case "value":
            break;
          case "checked":
            break;
          case "selected":
            break;
          case "vt-name":
          case "vt-update":
          case "vt-enter":
          case "vt-exit":
          case "vt-share":
          case "vt-parent-enter":
          case "vt-parent-exit":
            break;
          default:
            f.add(d[h].name);
        }
      if (co(e)) {
        for (var y in a)
          if (a.hasOwnProperty(y)) {
            var v = a[y];
            if (v != null) {
              if (fu.hasOwnProperty(y))
                typeof v != "function" && ia(y, v);
              else if (a.suppressHydrationWarning !== !0)
                switch (y) {
                  case "children":
                    typeof v != "string" && typeof v != "number" || ut(
                      "children",
                      t.textContent,
                      v,
                      o
                    );
                    continue;
                  case "suppressContentEditableWarning":
                  case "suppressHydrationWarning":
                  case "defaultValue":
                  case "defaultChecked":
                  case "innerHTML":
                  case "ref":
                    continue;
                  case "dangerouslySetInnerHTML":
                    d = t.innerHTML, v = v ? v.__html : void 0, v != null && (v = X0(t, v), ut(
                      y,
                      d,
                      v,
                      o
                    ));
                    continue;
                  case "style":
                    f.delete(y), oa(t, v, o);
                    continue;
                  case "offsetParent":
                  case "offsetTop":
                  case "offsetLeft":
                  case "offsetWidth":
                  case "offsetHeight":
                  case "isContentEditable":
                  case "outerText":
                  case "outerHTML":
                    f.delete(y.toLowerCase()), console.error(
                      "Assignment to read-only property will result in a no-op: `%s`",
                      y
                    );
                    continue;
                  case "className":
                    f.delete("class"), d = ey(
                      t,
                      "class",
                      v
                    ), ut(
                      "className",
                      d,
                      v,
                      o
                    );
                    continue;
                  default:
                    c.context === mf && e !== "svg" && e !== "math" ? f.delete(y.toLowerCase()) : f.delete(y), d = ey(
                      t,
                      y,
                      v
                    ), ut(
                      y,
                      d,
                      v,
                      o
                    );
                }
            }
          }
      } else
        for (v in a)
          if (a.hasOwnProperty(v) && (y = a[v], y != null)) {
            if (fu.hasOwnProperty(v))
              typeof y != "function" && ia(v, y);
            else if (a.suppressHydrationWarning !== !0)
              switch (v) {
                case "children":
                  typeof y != "string" && typeof y != "number" || ut(
                    "children",
                    t.textContent,
                    y,
                    o
                  );
                  continue;
                case "suppressContentEditableWarning":
                case "suppressHydrationWarning":
                case "value":
                case "checked":
                case "selected":
                case "defaultValue":
                case "defaultChecked":
                case "innerHTML":
                case "ref":
                  continue;
                case "dangerouslySetInnerHTML":
                  d = t.innerHTML, y = y ? y.__html : void 0, y != null && (y = X0(t, y), d !== y && (o[v] = { __html: d }));
                  continue;
                case "className":
                  Ca(
                    t,
                    v,
                    "class",
                    y,
                    f,
                    o
                  );
                  continue;
                case "tabIndex":
                  Ca(
                    t,
                    v,
                    "tabindex",
                    y,
                    f,
                    o
                  );
                  continue;
                case "style":
                  f.delete(v), oa(t, y, o);
                  continue;
                case "multiple":
                  f.delete(v), ut(
                    v,
                    t.multiple,
                    y,
                    o
                  );
                  continue;
                case "muted":
                  f.delete(v), ut(
                    v,
                    t.muted,
                    y,
                    o
                  );
                  continue;
                case "autoFocus":
                  f.delete("autofocus"), ut(
                    v,
                    t.autofocus,
                    y,
                    o
                  );
                  continue;
                case "data":
                  if (e !== "object") {
                    f.delete(v), d = t.getAttribute("data"), ut(
                      v,
                      d,
                      y,
                      o
                    );
                    continue;
                  }
                case "src":
                case "href":
                  if (!(y !== "" || e === "a" && v === "href" || e === "object" && v === "data")) {
                    console.error(
                      v === "src" ? 'An empty string ("") was passed to the %s attribute. This may cause the browser to download the whole page again over the network. To fix this, either do not render the element at all or pass null to %s instead of an empty string.' : 'An empty string ("") was passed to the %s attribute. To fix this, either do not render the element at all or pass null to %s instead of an empty string.',
                      v,
                      v
                    );
                    continue;
                  }
                  fs(
                    t,
                    v,
                    v,
                    y,
                    f,
                    o
                  );
                  continue;
                case "action":
                case "formAction":
                  if (d = t.getAttribute(v), typeof y == "function") {
                    f.delete(v.toLowerCase()), v === "formAction" ? (f.delete("name"), f.delete("formenctype"), f.delete("formmethod"), f.delete("formtarget")) : (f.delete("enctype"), f.delete("method"), f.delete("target"));
                    continue;
                  } else if (d === m4) {
                    f.delete(v.toLowerCase()), ut(
                      v,
                      "function",
                      y,
                      o
                    );
                    continue;
                  }
                  fs(
                    t,
                    v,
                    v.toLowerCase(),
                    y,
                    f,
                    o
                  );
                  continue;
                case "xlinkHref":
                  fs(
                    t,
                    v,
                    "xlink:href",
                    y,
                    f,
                    o
                  );
                  continue;
                case "contentEditable":
                  Q0(
                    t,
                    v,
                    "contenteditable",
                    y,
                    f,
                    o
                  );
                  continue;
                case "spellCheck":
                  Q0(
                    t,
                    v,
                    "spellcheck",
                    y,
                    f,
                    o
                  );
                  continue;
                case "draggable":
                case "autoReverse":
                case "externalResourcesRequired":
                case "focusable":
                case "preserveAlpha":
                  Q0(
                    t,
                    v,
                    v,
                    y,
                    f,
                    o
                  );
                  continue;
                case "allowFullScreen":
                case "async":
                case "autoPlay":
                case "controls":
                case "credentialless":
                case "default":
                case "defer":
                case "disabled":
                case "disablePictureInPicture":
                case "disableRemotePlayback":
                case "formNoValidate":
                case "hidden":
                case "loop":
                case "noModule":
                case "noValidate":
                case "open":
                case "playsInline":
                case "readOnly":
                case "required":
                case "reversed":
                case "scoped":
                case "seamless":
                case "itemScope":
                  dd(
                    t,
                    v,
                    v.toLowerCase(),
                    y,
                    f,
                    o
                  );
                  continue;
                case "capture":
                case "download":
                  t: {
                    h = t;
                    var p = d = v, z = o;
                    if (f.delete(p), h = h.getAttribute(p), h === null)
                      switch (typeof y) {
                        case "undefined":
                        case "function":
                        case "symbol":
                          break t;
                        default:
                          if (y === !1) break t;
                      }
                    else if (y != null)
                      switch (typeof y) {
                        case "function":
                        case "symbol":
                          break;
                        case "boolean":
                          if (y === !0 && h === "") break t;
                          break;
                        default:
                          if (ne(y, d), h === "" + y)
                            break t;
                      }
                    ut(
                      d,
                      h,
                      y,
                      z
                    );
                  }
                  continue;
                case "cols":
                case "rows":
                case "size":
                case "span":
                  t: {
                    if (h = t, p = d = v, z = o, f.delete(p), h = h.getAttribute(p), h === null)
                      switch (typeof y) {
                        case "undefined":
                        case "function":
                        case "symbol":
                        case "boolean":
                          break t;
                        default:
                          if (isNaN(y) || 1 > y) break t;
                      }
                    else if (y != null)
                      switch (typeof y) {
                        case "function":
                        case "symbol":
                        case "boolean":
                          break;
                        default:
                          if (!(isNaN(y) || 1 > y) && (ne(y, d), h === "" + y))
                            break t;
                      }
                    ut(
                      d,
                      h,
                      y,
                      z
                    );
                  }
                  continue;
                case "rowSpan":
                  hd(
                    t,
                    v,
                    "rowspan",
                    y,
                    f,
                    o
                  );
                  continue;
                case "start":
                  hd(
                    t,
                    v,
                    v,
                    y,
                    f,
                    o
                  );
                  continue;
                case "xHeight":
                  Ca(
                    t,
                    v,
                    "x-height",
                    y,
                    f,
                    o
                  );
                  continue;
                case "xlinkActuate":
                  Ca(
                    t,
                    v,
                    "xlink:actuate",
                    y,
                    f,
                    o
                  );
                  continue;
                case "xlinkArcrole":
                  Ca(
                    t,
                    v,
                    "xlink:arcrole",
                    y,
                    f,
                    o
                  );
                  continue;
                case "xlinkRole":
                  Ca(
                    t,
                    v,
                    "xlink:role",
                    y,
                    f,
                    o
                  );
                  continue;
                case "xlinkShow":
                  Ca(
                    t,
                    v,
                    "xlink:show",
                    y,
                    f,
                    o
                  );
                  continue;
                case "xlinkTitle":
                  Ca(
                    t,
                    v,
                    "xlink:title",
                    y,
                    f,
                    o
                  );
                  continue;
                case "xlinkType":
                  Ca(
                    t,
                    v,
                    "xlink:type",
                    y,
                    f,
                    o
                  );
                  continue;
                case "xmlBase":
                  Ca(
                    t,
                    v,
                    "xml:base",
                    y,
                    f,
                    o
                  );
                  continue;
                case "xmlLang":
                  Ca(
                    t,
                    v,
                    "xml:lang",
                    y,
                    f,
                    o
                  );
                  continue;
                case "xmlSpace":
                  Ca(
                    t,
                    v,
                    "xml:space",
                    y,
                    f,
                    o
                  );
                  continue;
                case "inert":
                  y !== "" || JS[v] || (JS[v] = !0, console.error(
                    "Received an empty string for a boolean attribute `%s`. This will treat the attribute as if it were false. Either pass `false` to silence this warning, or pass `true` if you used an empty string in earlier versions of React to indicate this attribute is true.",
                    v
                  )), dd(
                    t,
                    v,
                    v,
                    y,
                    f,
                    o
                  );
                  continue;
                default:
                  if (!(2 < v.length) || v[0] !== "o" && v[0] !== "O" || v[1] !== "n" && v[1] !== "N") {
                    h = fy(v), d = !1, c.context === mf && e !== "svg" && e !== "math" ? f.delete(h.toLowerCase()) : (p = v.toLowerCase(), p = R.hasOwnProperty(
                      p
                    ) && R[p] || null, p !== null && p !== v && (d = !0, f.delete(p)), f.delete(h));
                    t: if (p = t, z = h, h = y, sh(z))
                      if (p.hasAttribute(z))
                        p = z.toLowerCase() === "nonce" ? p.nonce : p.getAttribute(
                          z
                        ), ne(
                          h,
                          z
                        ), h = p === "" + h ? h : p;
                      else {
                        switch (typeof h) {
                          case "function":
                          case "symbol":
                            break t;
                          case "boolean":
                            if (p = z.toLowerCase().slice(0, 5), p !== "data-" && p !== "aria-")
                              break t;
                        }
                        h = h === void 0 ? void 0 : null;
                      }
                    else h = void 0;
                    d || ut(
                      v,
                      h,
                      y,
                      o
                    );
                  }
              }
          }
      return 0 < f.size && a.suppressHydrationWarning !== !0 && Ui(t, f, o), Object.keys(o).length === 0 ? null : o;
    }
    function Ae(t, e) {
      switch (t.length) {
        case 0:
          return "";
        case 1:
          return t[0];
        case 2:
          return t[0] + " " + e + " " + t[1];
        default:
          return t.slice(0, -1).join(", ") + ", " + e + " " + t[t.length - 1];
      }
    }
    function pn(t) {
      switch (t) {
        case "css":
        case "script":
        case "font":
        case "img":
        case "image":
        case "input":
        case "link":
          return !0;
        default:
          return !1;
      }
    }
    function Qo() {
      if (typeof performance.getEntriesByType == "function") {
        for (var t = 0, e = 0, a = performance.getEntriesByType("resource"), c = 0; c < a.length; c++) {
          var o = a[c], f = o.transferSize, d = o.initiatorType, h = o.duration;
          if (f && h && pn(d)) {
            for (d = 0, h = o.responseEnd, c += 1; c < a.length; c++) {
              var y = a[c], v = y.startTime;
              if (v > h) break;
              var p = y.transferSize, z = y.initiatorType;
              p && pn(z) && (y = y.responseEnd, d += p * (y < h ? 1 : (h - v) / (y - v)));
            }
            if (--c, e += 8 * (f + d) / (o.duration / 1e3), t++, 10 < t) break;
          }
        }
        if (0 < t) return e / t / 1e6;
      }
      return navigator.connection && (t = navigator.connection.downlink, typeof t == "number") ? t : 5;
    }
    function Ra(t) {
      return t.nodeType === 9 ? t : t.ownerDocument;
    }
    function Z0(t) {
      switch (t) {
        case I:
          return $m;
        case Z:
          return $S;
        default:
          return mf;
      }
    }
    function L0(t, e) {
      if (t === mf)
        switch (e) {
          case "svg":
            return $m;
          case "math":
            return $S;
          default:
            return mf;
        }
      return t === $m && e === "foreignObject" ? mf : t;
    }
    function zv(t, e, a, c) {
      return a = Ra(
        a
      ).createElement(t), a[zl] = c, a[Al] = e, Ke(a, t, e), qe(a), a;
    }
    function ss(t) {
      if (t = t.type, typeof t != "string" || t === "" || (t = t.toLowerCase(), t === "module" || t === "importmap" || t === "speculationrules"))
        return !1;
      switch (t) {
        case "application/ecmascript":
        case "application/javascript":
        case "application/x-ecmascript":
        case "application/x-javascript":
        case "text/ecmascript":
        case "text/javascript":
        case "text/javascript1.0":
        case "text/javascript1.1":
        case "text/javascript1.2":
        case "text/javascript1.3":
        case "text/javascript1.4":
        case "text/javascript1.5":
        case "text/jscript":
        case "text/livescript":
        case "text/x-ecmascript":
        case "text/x-javascript":
          return !1;
      }
      return !0;
    }
    function Ni(t, e) {
      return t === "textarea" || t === "noscript" || typeof e.children == "string" || typeof e.children == "number" || typeof e.children == "bigint" || typeof e.dangerouslySetInnerHTML == "object" && e.dangerouslySetInnerHTML !== null && e.dangerouslySetInnerHTML.__html != null;
    }
    function rs() {
      var t = window.event;
      return t && t.type === "popstate" ? t === G2 ? !1 : (G2 = t, !0) : (G2 = null, !1);
    }
    function qc() {
      var t = window.event;
      return t && t !== c1 ? t.type : null;
    }
    function Hi() {
      var t = window.event;
      return t && t !== c1 ? t.timeStamp : -1.1;
    }
    function ka(t) {
      setTimeout(function() {
        throw t;
      });
    }
    function sp(t, e, a) {
      switch (e) {
        case "button":
        case "input":
        case "select":
        case "textarea":
          a.autoFocus && t.focus();
          break;
        case "img":
          a.src ? t.src = a.src : a.srcSet && (t.srcset = a.srcSet);
      }
    }
    function ds() {
    }
    function Ma(t, e, a, c) {
      Ia(t, e, a, c), t[Al] = c;
    }
    function Av(t) {
      uo(t, "");
    }
    function rp(t, e, a) {
      t.nodeValue = a;
    }
    function dp(t) {
      if (!t.__reactWarnedAboutChildrenConflict) {
        var e = t[Al] || null;
        if (e !== null) {
          var a = bu(t);
          a !== null && (typeof e.children == "string" || typeof e.children == "number" ? (t.__reactWarnedAboutChildrenConflict = !0, $(a, function() {
            console.error(
              'Cannot use a ref on a React element as a container to `createRoot` or `createPortal` if that element also sets "children" text content using React. It should be a leaf with no children. Otherwise it\'s ambiguous which children should be used.'
            );
          })) : e.dangerouslySetInnerHTML != null && (t.__reactWarnedAboutChildrenConflict = !0, $(a, function() {
            console.error(
              'Cannot use a ref on a React element as a container to `createRoot` or `createPortal` if that element also sets "dangerouslySetInnerHTML" using React. It should be a leaf with no children. Otherwise it\'s ambiguous which children should be used.'
            );
          })));
        }
      }
    }
    function fa(t) {
      return t === "head";
    }
    function J0(t, e) {
      t.removeChild(e);
    }
    function Ov(t, e) {
      (t.nodeType === 9 ? t.body : t.nodeName === "HTML" ? t.ownerDocument.body : t).removeChild(e);
    }
    function Zo(t, e) {
      var a = e, c = 0;
      do {
        var o = a.nextSibling;
        if (t.removeChild(a), o && o.nodeType === 8)
          if (a = o.data, a === u1 || a === KS) {
            if (c === 0) {
              t.removeChild(o), $o(e);
              return;
            }
            c--;
          } else if (a === n1 || a === Js || a === ah || a === Km || a === lh)
            c++;
          else if (a === v4)
            pd(
              t.ownerDocument.documentElement
            );
          else if (a === p4) {
            a = t.ownerDocument.head, pd(a);
            for (var f = a.firstChild; f; ) {
              var d = f.nextSibling, h = f.nodeName;
              f[Tn] || h === "SCRIPT" || h === "STYLE" || h === "LINK" && f.rel.toLowerCase() === "stylesheet" || a.removeChild(f), f = d;
            }
          } else
            a === g4 && pd(
              t.ownerDocument.body
            );
        a = o;
      } while (a);
      $o(e);
    }
    function Dv(t, e) {
      var a = t;
      t = 0;
      do {
        var c = a.nextSibling;
        if (a.nodeType === 1 ? e ? (a._stashedDisplay = a.style.display, a.style.display = "none") : (a.style.display = a._stashedDisplay || "", a.getAttribute("style") === "" && a.removeAttribute("style")) : a.nodeType === 3 && (e ? (a._stashedText = a.nodeValue, a.nodeValue = "") : a.nodeValue = a._stashedText || ""), c && c.nodeType === 8)
          if (a = c.data, a === u1) {
            if (t === 0) break;
            t--;
          } else
            a !== n1 && a !== Js && a !== ah && a !== Km || t++;
        a = c;
      } while (a);
    }
    function hp(t) {
      Dv(t, !0);
    }
    function mp(t) {
      t = t.style, typeof t.setProperty == "function" ? t.setProperty("display", "none", "important") : t.display = "none";
    }
    function yp(t) {
      t.nodeValue = "";
    }
    function K0(t) {
      Dv(t, !1);
    }
    function Cv(t, e) {
      e = e[U3], e = e != null && e.hasOwnProperty("display") ? e.display : null, t.style.display = e == null || typeof e == "boolean" ? "" : ("" + e).trim();
    }
    function fb(t, e) {
      t.nodeValue = e;
    }
    function sb(t) {
      for (var e = t.firstChild; e != null; ) {
        if (e.nodeType === 1 && getComputedStyle(e).display === "block") {
          var a = bu(e) || bu(t);
          $(
            a,
            function(c, o) {
              console.error(
                `You're about to start a <ViewTransition> around a display: inline element <%s>, which itself has a display: block element <%s> inside it. This might trigger a bug in Safari which causes the View Transition to be skipped with a duplicate name error.
https://bugs.webkit.org/show_bug.cgi?id=290923`,
                c.toLocaleLowerCase(),
                o.toLocaleLowerCase()
              );
            },
            t.tagName,
            e.tagName
          );
          break;
        }
        if (e.firstChild != null) e = e.firstChild;
        else {
          if (e === t) break;
          for (; e.nextSibling == null && e.parentNode != null && e.parentNode !== t; )
            e = e.parentNode;
          e = e.nextSibling;
        }
      }
    }
    function vp(t, e, a) {
      if (e = CSS.escape(e) !== e ? "r-" + btoa(e).replace(/=/g, "") : e, t.style.viewTransitionName = e, a != null && (t.style.viewTransitionClass = a), a = getComputedStyle(t), a.display === "inline") {
        if (e = t.getClientRects(), e.length === 1) var c = 1;
        else
          for (var o = c = 0; o < e.length; o++) {
            var f = e[o];
            0 < f.width && 0 < f.height && c++;
          }
        c === 1 ? (t = t.style, t.display = e.length === 1 ? "inline-block" : "block", t.marginTop = "-" + a.paddingTop, t.marginBottom = "-" + a.paddingBottom) : sb(t);
      }
    }
    function Rv(t, e) {
      t = t.style, e = e[U3];
      var a = e != null ? e.hasOwnProperty("viewTransitionName") ? e.viewTransitionName : e.hasOwnProperty("view-transition-name") ? e["view-transition-name"] : null : null;
      t.viewTransitionName = a == null || typeof a == "boolean" ? "" : ("" + a).trim(), a = e != null ? e.hasOwnProperty("viewTransitionClass") ? e.viewTransitionClass : e.hasOwnProperty("view-transition-class") ? e["view-transition-class"] : null : null, t.viewTransitionClass = a == null || typeof a == "boolean" ? "" : ("" + a).trim(), t.display === "inline-block" && (e == null ? t.display = t.margin = "" : (a = e.display, t.display = a == null || typeof a == "boolean" ? "" : a, a = e.margin, a != null ? t.margin = a : (a = e.hasOwnProperty("marginTop") ? e.marginTop : e["margin-top"], t.marginTop = a == null || typeof a == "boolean" ? "" : a, e = e.hasOwnProperty("marginBottom") ? e.marginBottom : e["margin-bottom"], t.marginBottom = e == null || typeof e == "boolean" ? "" : e)));
    }
    function gp(t, e, a) {
      return a = a.ownerDocument.defaultView, {
        rect: t,
        abs: e.position === "absolute" || e.position === "fixed",
        clip: e.clipPath !== "none" || e.overflow !== "visible" || e.filter !== "none" || e.mask !== "none" || e.mask !== "none" || e.borderRadius !== "0px",
        view: 0 <= t.bottom && 0 <= t.right && t.top <= a.innerHeight && t.left <= a.innerWidth
      };
    }
    function Bi(t) {
      var e = t.getBoundingClientRect(), a = getComputedStyle(t);
      return gp(e, a, t);
    }
    function $0(t, e) {
      if (typeof t == "object" && t !== null)
        switch (t.name) {
          case "TimeoutError":
            return Error(
              "A ViewTransition timed out because a Navigation stalled. This can happen if a Navigation is blocked on React itself. Such as if it's resolved inside useEffect. This can be solved by moving the resolution to useLayoutEffect.",
              { cause: t }
            );
          case "AbortError":
            return e ? null : Error(
              "A ViewTransition was aborted early. This might be because you have other View Transition libraries on the page and only one can run at a time. To avoid this, use only React's built-in <ViewTransition> to coordinate.",
              { cause: t }
            );
          case "InvalidStateError":
            if (t.message === "View transition was skipped because document visibility state is hidden." || t.message === "Skipping view transition because document visibility state has become hidden." || t.message === "Skipping view transition because viewport size changed." || t.message === "Transition was aborted because of invalid state")
              return null;
        }
      return t;
    }
    function pp(t) {
      return t.documentElement.clientHeight;
    }
    function Sp(t) {
      this.addEventListener("load", t), this.addEventListener("error", t);
    }
    function rb(t, e, a, c, o, f, d, h, y, v, p) {
      var z = e.nodeType === 9 ? e : e.ownerDocument;
      try {
        var E = z.startViewTransition({
          update: function() {
            var j = z.defaultView, J = j.navigation && j.navigation.transition, et = z.fonts.status;
            c();
            var Et = [];
            if (et === "loaded" && (pp(z), z.fonts.status === "loading" && Et.push(z.fonts.ready)), et = Et.length, t !== null)
              for (var b = t.suspenseyImages, T = 0, A = 0; A < b.length; A++) {
                var B = b[A];
                if (!B.complete) {
                  var X = B.getBoundingClientRect();
                  if (0 < X.bottom && 0 < X.right && X.top < j.innerHeight && X.left < j.innerWidth) {
                    if (T += lm(B), T > WS) {
                      Et.length = et;
                      break;
                    }
                    B = new Promise(
                      Sp.bind(B)
                    ), Et.push(B);
                  }
                }
              }
            if (0 < Et.length)
              return v(
                0 < et ? Et.length > et ? "Waiting on Fonts and Images" : "Waiting on Fonts" : "Waiting on Images"
              ), j = Promise.race([
                Promise.all(Et),
                new Promise(function(ot) {
                  return setTimeout(
                    ot,
                    T4
                  );
                })
              ]).then(o, o), (J ? Promise.allSettled([
                J.finished,
                j
              ]) : j).then(f, f);
            if (o(), J)
              return J.finished.then(
                f,
                f
              );
            f();
          },
          types: a
        });
        z.__reactViewTransition = E;
        var M = [];
        return E.ready.then(
          function() {
            for (var j = z.documentElement.getAnimations({
              subtree: !0
            }), J = 0; J < j.length; J++) {
              var et = j[J], Et = et.effect, b = Et.pseudoElement;
              if (b != null && b.startsWith("::view-transition")) {
                M.push(et), et = Et.getKeyframes();
                for (var T = b = void 0, A = !0, B = 0; B < et.length; B++) {
                  var X = et[B], ot = X.width;
                  if (b === void 0) b = ot;
                  else if (b !== ot) {
                    A = !1;
                    break;
                  }
                  if (ot = X.height, T === void 0) T = ot;
                  else if (T !== ot) {
                    A = !1;
                    break;
                  }
                  delete X.width, delete X.height, X.transform === "none" && delete X.transform;
                }
                A && b !== void 0 && T !== void 0 && (Et.setKeyframes(et), A = getComputedStyle(
                  Et.target,
                  Et.pseudoElement
                ), A.width !== b || A.height !== T) && (A = et[0], A.width = b, A.height = T, A = et[et.length - 1], A.width = b, A.height = T, Et.setKeyframes(et));
              }
            }
            d();
          },
          function(j) {
            z.__reactViewTransition === E && (z.__reactViewTransition = null);
            try {
              j = $0(j, !1), j !== null && y(j);
            } finally {
              c(), o(), d(), p();
            }
          }
        ), E.finished.finally(function() {
          for (var j = 0; j < M.length; j++)
            M[j].cancel();
          z.__reactViewTransition === E && (z.__reactViewTransition = null), p(), h();
        }), E;
      } catch {
        return c(), o(), p(), d(), null;
      }
    }
    function Lo(t, e) {
      this._scope = document.documentElement, this._selector = "::view-transition-" + t + "(" + e + ")";
    }
    function bp(t) {
      return {
        name: t,
        group: new Lo("group", t),
        imagePair: new Lo("image-pair", t),
        old: new Lo("old", t),
        new: new Lo("new", t)
      };
    }
    function sa(t) {
      this._fragmentFiber = t, this._observers = this._eventListeners = null;
    }
    function Mv(t, e, a, c) {
      return It(t).addEventListener(
        e,
        a,
        c
      ), !1;
    }
    function _v(t, e, a, c) {
      return It(t).removeEventListener(
        e,
        a,
        c
      ), !1;
    }
    function Jo(t) {
      return t != null && typeof t != "boolean" && (t.once === !0 || t.signal instanceof AbortSignal) ? { capture: t.capture, passive: t.passive } : t;
    }
    function md(t) {
      return t == null ? "c=0" : typeof t == "boolean" ? "c=" + (t ? "1" : "0") : "c=" + (t.capture ? "1" : "0");
    }
    function F0(t, e, a, c) {
      if (t.length === 0) return -1;
      c = md(c);
      for (var o = 0; o < t.length; o++) {
        var f = t[o];
        if (f.type === e && f.listener === a && md(f.optionsOrUseCapture) === c)
          return o;
      }
      return -1;
    }
    function Uv(t, e) {
      return t.tag === 6 ? !1 : (t = It(t), gb(t, e));
    }
    function $t(t, e) {
      return e.push(t), !1;
    }
    function Nv(t, e) {
      return t.tag === 6 ? !1 : (t = It(t), t === e || t.contains(e) ? (e.blur(), !0) : !1);
    }
    function db(t, e) {
      return t.tag === 6 || (t = It(t), e.observe(t)), !1;
    }
    function Tp(t, e) {
      return t.tag === 6 || (t = It(t), e.unobserve(t)), !1;
    }
    function hb(t, e, a) {
      Ic.push({
        fragmentInstance: t,
        observer: e,
        instance: a
      }), j2 || (j2 = !0, gd(function() {
        j2 = !1;
        var c = Ic;
        Ic = [];
        for (var o = 0; o < c.length; o++) {
          var f = c[o];
          f.observer.unobserve(f.instance);
        }
      }));
    }
    function mb(t, e) {
      if (t.tag === 6) {
        t = t.stateNode;
        var a = t.ownerDocument.createRange();
        a.selectNodeContents(t), e.push.apply(e, a.getClientRects());
      } else
        t = It(t), e.push.apply(e, t.getClientRects());
      return !1;
    }
    function yb(t, e, a, c, o) {
      var f = lo(o);
      if (t & Node.DOCUMENT_POSITION_CONTAINED_BY) {
        if (a = !!f)
          t: {
            for (; f !== null; ) {
              if (f.tag === 7 && (f === e || f.alternate === e)) {
                a = !0;
                break t;
              }
              f = f.return;
            }
            a = !1;
          }
        return a;
      }
      if (t & Node.DOCUMENT_POSITION_CONTAINS) {
        if (f === null)
          return f = o.ownerDocument, o === f || o === f.documentElement || o === f.body;
        t: {
          for (f = e, e = Qe(e); f !== null; ) {
            if (!(f.tag !== 5 && f.tag !== 3 && f.tag !== 27 || f !== e && f.alternate !== e)) {
              f = !0;
              break t;
            }
            f = f.return;
          }
          f = !1;
        }
        return f;
      }
      return t & Node.DOCUMENT_POSITION_PRECEDING ? ((e = !!f) && !(e = f === a) && (e = L(
        a,
        f,
        Y
      ), e === null ? e = !1 : (nn(
        e,
        !0,
        Ii,
        f,
        a
      ), f = Ss, Ss = null, e = f !== null)), e) : t & Node.DOCUMENT_POSITION_FOLLOWING ? ((e = !!f) && !(e = f === c) && (e = L(
        c,
        f,
        Y
      ), e === null ? e = !1 : (nn(
        e,
        !0,
        Rl,
        f,
        c
      ), f = Ss, Wv = Ss = null, e = f !== null)), e) : !1;
    }
    function Ko(t, e) {
      var a = t.ownerDocument.createRange();
      a.selectNodeContents(t), t = a.getBoundingClientRect(), window.scrollTo(
        window.scrollX + t.left,
        e ? window.scrollY + t.top : window.scrollY + t.bottom - window.innerHeight
      );
    }
    function hs(t, e) {
      return t = It(t), W0(t, e), !1;
    }
    function W0(t, e) {
      t.reactFragments == null && (t.reactFragments = /* @__PURE__ */ new Set()), t.reactFragments.add(e);
    }
    function yd(t, e) {
      var a = e._eventListeners;
      if (a !== null)
        for (var c = 0; c < a.length; c++) {
          var o = a[c];
          t.addEventListener(
            o.type,
            o.attachedListener,
            Jo(o.optionsOrUseCapture)
          );
        }
      t.nodeType !== 3 && (a = e._observers, a !== null && a.forEach(function(f) {
        for (var d = 0, h = 0; h < Ic.length; h++) {
          var y = Ic[h];
          (y.fragmentInstance !== e || y.observer !== f || y.instance !== t) && (Ic[d++] = y);
        }
        Ic.length = d, f.observe(t);
      }), W0(t, e));
    }
    function Hv(t, e) {
      var a = e._eventListeners;
      if (a !== null)
        for (var c = 0; c < a.length; c++) {
          var o = a[c];
          t.removeEventListener(
            o.type,
            o.attachedListener,
            Jo(o.optionsOrUseCapture)
          );
        }
      t.nodeType !== 3 && (a = e._observers, a !== null && a.forEach(function(f) {
        typeof f.rootMargin == "string" ? hb(
          e,
          f,
          t
        ) : f.unobserve(t);
      }), t.reactFragments != null && t.reactFragments.delete(e));
    }
    function Qu(t) {
      var e = t.firstChild;
      for (e && e.nodeType === 10 && (e = e.nextSibling); e; ) {
        var a = e;
        switch (e = e.nextSibling, a.nodeName) {
          case "HTML":
          case "HEAD":
          case "BODY":
            Qu(a), Ml(a);
            continue;
          case "SCRIPT":
          case "STYLE":
            continue;
          case "LINK":
            if (a.rel.toLowerCase() === "stylesheet") continue;
        }
        t.removeChild(a);
      }
    }
    function Zu(t, e, a, c) {
      for (; t.nodeType === 1; ) {
        var o = a;
        if (t.nodeName.toLowerCase() !== e.toLowerCase()) {
          if (!c && (t.nodeName !== "INPUT" || t.type !== "hidden"))
            break;
        } else if (c) {
          if (!t[Tn])
            switch (e) {
              case "meta":
                if (!t.hasAttribute("itemprop")) break;
                return t;
              case "link":
                if (f = t.getAttribute("rel"), f === "stylesheet" && t.hasAttribute("data-precedence"))
                  break;
                if (f !== o.rel || t.getAttribute("href") !== (o.href == null || o.href === "" ? null : o.href) || t.getAttribute("crossorigin") !== (o.crossOrigin == null ? null : o.crossOrigin) || t.getAttribute("title") !== (o.title == null ? null : o.title))
                  break;
                return t;
              case "style":
                if (t.hasAttribute("data-precedence")) break;
                return t;
              case "script":
                if (f = t.getAttribute("src"), (f !== (o.src == null ? null : o.src) || t.getAttribute("type") !== (o.type == null ? null : o.type) || t.getAttribute("crossorigin") !== (o.crossOrigin == null ? null : o.crossOrigin)) && f && t.hasAttribute("async") && !t.hasAttribute("itemprop"))
                  break;
                return t;
              default:
                return t;
            }
        } else if (e === "input" && t.type === "hidden") {
          ne(o.name, "name");
          var f = o.name == null ? null : "" + o.name;
          if (o.type === "hidden" && t.getAttribute("name") === f)
            return t;
        } else return t;
        if (t = _a(t.nextSibling), t === null) break;
      }
      return null;
    }
    function vd(t, e, a) {
      if (e === "") return null;
      for (; t.nodeType !== 3; )
        if ((t.nodeType !== 1 || t.nodeName !== "INPUT" || t.type !== "hidden") && !a || (t = _a(t.nextSibling), t === null)) return null;
      return t;
    }
    function Ep(t, e) {
      for (; t.nodeType !== 8; )
        if ((t.nodeType !== 1 || t.nodeName !== "INPUT" || t.type !== "hidden") && !e || (t = _a(t.nextSibling), t === null)) return null;
      return t;
    }
    function I0(t) {
      return t.data === Js || t.data === ah;
    }
    function k0(t) {
      return t.data === Km || t.data === Js && t.ownerDocument.readyState !== _3;
    }
    function zp(t, e) {
      var a = t.ownerDocument;
      if (t.data === ah)
        t._reactRetry = e;
      else if (t.data !== Js || a.readyState !== _3)
        e();
      else {
        var c = function() {
          e(), a.removeEventListener("DOMContentLoaded", c);
        };
        a.addEventListener("DOMContentLoaded", c), t._reactRetry = c;
      }
    }
    function _a(t) {
      for (; t != null; t = t.nextSibling) {
        var e = t.nodeType;
        if (e === 1 || e === 3) break;
        if (e === 8) {
          if (e = t.data, e === n1 || e === Km || e === Js || e === ah || e === lh || e === x2 || e === M3)
            break;
          if (e === u1 || e === KS)
            return null;
        }
      }
      return t;
    }
    function Ap(t) {
      if (t.nodeType === 1) {
        for (var e = t.nodeName.toLowerCase(), a = {}, c = t.attributes, o = 0; o < c.length; o++) {
          var f = c[o];
          a[wo(f.name)] = f.name.toLowerCase() === "style" ? Xo(t) : f.value;
        }
        return { type: e, props: a };
      }
      return t.nodeType === 8 ? t.data === lh ? { type: "Activity", props: {} } : { type: "Suspense", props: {} } : t.nodeValue;
    }
    function P0(t, e, a) {
      return a === null || a[y4] !== !0 ? (t.nodeValue === e ? t = null : (e = Gl(e), t = Gl(t.nodeValue) === e ? null : t.nodeValue), t) : null;
    }
    function tm(t) {
      t = t.nextSibling;
      for (var e = 0; t; ) {
        if (t.nodeType === 8) {
          var a = t.data;
          if (a === u1 || a === KS) {
            if (e === 0)
              return _a(t.nextSibling);
            e--;
          } else
            a !== n1 && a !== Km && a !== Js && a !== ah && a !== lh || e++;
        }
        t = t.nextSibling;
      }
      return null;
    }
    function Op(t) {
      t = t.previousSibling;
      for (var e = 0; t; ) {
        if (t.nodeType === 8) {
          var a = t.data;
          if (a === n1 || a === Km || a === Js || a === ah || a === lh) {
            if (e === 0) return t;
            e--;
          } else
            a !== u1 && a !== KS || e++;
        }
        t = t.previousSibling;
      }
      return null;
    }
    function Bv(t) {
      $o(t);
    }
    function xv(t) {
      $o(t);
    }
    function vb(t) {
      $o(t);
    }
    function gb(t, e) {
      function a() {
        c = !0;
      }
      if (t.ownerDocument.activeElement === t) return !0;
      var c = !1;
      try {
        t.ownerDocument.addEventListener("focus", a, !0), (t.focus || HTMLElement.prototype.focus).call(t, e);
      } finally {
        t.ownerDocument.removeEventListener("focus", a, !0);
      }
      return c;
    }
    function gd(t) {
      x3(function() {
        x3(function(e) {
          return t(e);
        });
      });
    }
    function Dp(t, e, a, c, o) {
      switch (o && hh(t, c.ancestorInfo), e = Ra(a), t) {
        case "html":
          if (t = e.documentElement, !t)
            throw Error(
              "React expected an <html> element (document.documentElement) to exist in the Document but one was not found. React never removes the documentElement for any Document it renders into so the cause is likely in some other script running on this page."
            );
          return t;
        case "head":
          if (t = e.head, !t)
            throw Error(
              "React expected a <head> element (document.head) to exist in the Document but one was not found. React never removes the head for any Document it renders into so the cause is likely in some other script running on this page."
            );
          return t;
        case "body":
          if (t = e.body, !t)
            throw Error(
              "React expected a <body> element (document.body) to exist in the Document but one was not found. React never removes the body for any Document it renders into so the cause is likely in some other script running on this page."
            );
          return t;
        default:
          throw Error(
            "resolveSingletonInstance was called with an element type that is not supported. This is a bug in React."
          );
      }
    }
    function Cp(t, e, a, c) {
      if (!a[$u] && bu(a)) {
        var o = a.tagName.toLowerCase();
        console.error(
          "You are mounting a new %s component when a previous one has not first unmounted. It is an error to render more than one %s component at a time and attributes and children of these components will likely fail in unpredictable ways. Please only render a single instance of <%s> and if you need to mount a new one, ensure any previous ones have unmounted first.",
          o,
          o,
          o
        );
      }
      switch (t) {
        case "html":
        case "head":
        case "body":
          break;
        default:
          console.error(
            "acquireSingletonInstance was called with an element type that is not supported. This is a bug in React."
          );
      }
      for (o = a.attributes; o.length; )
        a.removeAttributeNode(o[0]);
      Ke(a, t, e), a[zl] = c, a[Al] = e;
    }
    function Ut(t, e, a) {
      for (var c in a) {
        var o = a[c];
        a.hasOwnProperty(c) && o != null && qt(t, e, c, null, h4, o);
      }
      a.dangerouslySetInnerHTML != null && (t.textContent = ""), t.onclick === zu && (t.onclick = null), Ml(t);
    }
    function pd(t) {
      for (var e = t.attributes; e.length; )
        t.removeAttributeNode(e[0]);
      Ml(t);
    }
    function xi(t) {
      if (typeof t.getRootNode == "function") {
        var e = t.getRootNode();
        if (e.nodeType === 9 || e.nodeType === 11)
          return e;
      }
      return t.nodeType === 9 ? t : t.ownerDocument;
    }
    function em(t, e, a) {
      var c = Fm;
      if (c && typeof e == "string" && e) {
        var o = wa(e);
        o = 'link[rel="' + t + '"][href="' + o + '"]', typeof a == "string" && (o += '[crossorigin="' + a + '"]'), G3.has(o) || (G3.add(o), t = { rel: t, crossOrigin: a, href: e }, c.querySelector(o) === null && (e = c.createElement("link"), Ke(e, "link", t), qe(e), c.head.appendChild(e)));
      }
    }
    function Yv(t, e, a, c) {
      var o = (o = qi.current) ? xi(o) : null;
      if (!o)
        throw Error(
          '"resourceRoot" was expected to exist. This is a bug in React.'
        );
      switch (t) {
        case "meta":
        case "title":
          return null;
        case "style":
          return typeof a.precedence == "string" && typeof a.href == "string" ? (a = Lu(a.href), e = ic(o).hoistableStyles, c = e.get(a), c || (c = {
            type: "style",
            instance: null,
            count: 0,
            state: null
          }, e.set(a, c)), c) : { type: "void", instance: null, count: 0, state: null };
        case "link":
          if (a.rel === "stylesheet" && typeof a.href == "string" && typeof a.precedence == "string") {
            t = Lu(a.href);
            var f = ic(o).hoistableStyles, d = f.get(t);
            if (d || (o = o.ownerDocument || o, d = {
              type: "stylesheet",
              instance: null,
              count: 0,
              state: { loading: uh, preload: null }
            }, f.set(t, d), (f = o.querySelector(
              Yi(t)
            )) ? f._p || (d.instance = f, d.state.loading = i1 | ac) : (f = nc.get(t), f || (f = {
              rel: "preload",
              as: "style",
              href: a.href,
              crossOrigin: a.crossOrigin,
              integrity: a.integrity,
              media: a.media,
              hrefLang: a.hrefLang,
              referrerPolicy: a.referrerPolicy
            }, nc.set(t, f)), Mp(
              o,
              t,
              f,
              d.state
            ))), e && c === null)
              throw a = `

  - ` + ms(e) + `
  + ` + ms(a), Error(
                "Expected <link> not to update to be updated to a stylesheet with precedence. Check the `rel`, `href`, and `precedence` props of this component. Alternatively, check whether two different <link> components render in the same slot or share the same key." + a
              );
            return d;
          }
          if (e && c !== null)
            throw a = `

  - ` + ms(e) + `
  + ` + ms(a), Error(
              "Expected stylesheet with precedence to not be updated to a different kind of <link>. Check the `rel`, `href`, and `precedence` props of this component. Alternatively, check whether two different <link> components render in the same slot or share the same key." + a
            );
          return null;
        case "script":
          return e = a.async, a = a.src, typeof a == "string" && e && typeof e != "function" && typeof e != "symbol" ? (a = ys(a), e = ic(o).hoistableScripts, c = e.get(a), c || (c = {
            type: "script",
            instance: null,
            count: 0,
            state: null
          }, e.set(a, c)), c) : { type: "void", instance: null, count: 0, state: null };
        default:
          throw Error(
            'getResource encountered a type it did not expect: "' + t + '". this is a bug in React.'
          );
      }
    }
    function ms(t) {
      var e = 0, a = "<link";
      return typeof t.rel == "string" ? (e++, a += ' rel="' + t.rel + '"') : Ha.call(t, "rel") && (e++, a += ' rel="' + (t.rel === null ? "null" : "invalid type " + typeof t.rel) + '"'), typeof t.href == "string" ? (e++, a += ' href="' + t.href + '"') : Ha.call(t, "href") && (e++, a += ' href="' + (t.href === null ? "null" : "invalid type " + typeof t.href) + '"'), typeof t.precedence == "string" ? (e++, a += ' precedence="' + t.precedence + '"') : Ha.call(t, "precedence") && (e++, a += " precedence={" + (t.precedence === null ? "null" : "invalid type " + typeof t.precedence) + "}"), Object.getOwnPropertyNames(t).length > e && (a += " ..."), a + " />";
    }
    function Lu(t) {
      return 'href="' + wa(t) + '"';
    }
    function Yi(t) {
      return 'link[rel="stylesheet"][' + t + "]";
    }
    function Rp(t) {
      return pt({}, t, {
        "data-precedence": t.precedence,
        precedence: null
      });
    }
    function Mp(t, e, a, c) {
      if (e = t.querySelector(
        'link[rel="preload"][as="style"][' + e + "]"
      )) {
        if (e[ou] !== !0) {
          c.loading = i1;
          return;
        }
      } else
        e = t.createElement("link"), e[ou] = !0, e.onload = e.onerror = ar.bind(null, e), Ke(e, "link", a), qe(e), t.head.appendChild(e);
      c.preload = e, e.addEventListener("load", function() {
        return c.loading |= i1;
      }), e.addEventListener("error", function() {
        return c.loading |= Y3;
      });
    }
    function ys(t) {
      return '[src="' + wa(t) + '"]';
    }
    function Sd(t) {
      return "script[async]" + t;
    }
    function qv(t, e, a) {
      if (e.count++, e.instance === null)
        switch (e.type) {
          case "style":
            var c = t.querySelector(
              'style[data-href~="' + wa(a.href) + '"]'
            );
            if (c)
              return e.instance = c, qe(c), c;
            var o = pt({}, a, {
              "data-href": a.href,
              "data-precedence": a.precedence,
              href: null,
              precedence: null
            });
            return c = (t.ownerDocument || t).createElement("style"), qe(c), Ke(c, "style", o), bd(c, a.precedence, t), e.instance = c;
          case "stylesheet":
            o = Lu(a.href);
            var f = t.querySelector(
              Yi(o)
            );
            if (f)
              return e.state.loading |= ac, e.instance = f, qe(f), f;
            c = Rp(a), (o = nc.get(o)) && Ft(c, o), f = (t.ownerDocument || t).createElement("link"), qe(f);
            var d = f;
            return d._p = new Promise(function(h, y) {
              d.onload = h, d.onerror = y;
            }), Ke(f, "link", c), e.state.loading |= ac, bd(f, a.precedence, t), e.instance = f;
          case "script":
            return f = ys(a.src), (o = t.querySelector(
              Sd(f)
            )) ? (e.instance = o, qe(o), o) : (c = a, (o = nc.get(f)) && (c = pt({}, a), Td(c, o)), t = t.ownerDocument || t, o = t.createElement("script"), qe(o), Ke(o, "link", c), t.head.appendChild(o), e.instance = o);
          case "void":
            return null;
          default:
            throw Error(
              'acquireResource encountered a resource type it did not expect: "' + e.type + '". this is a bug in React.'
            );
        }
      else
        e.type === "stylesheet" && (e.state.loading & ac) === uh && (c = e.instance, e.state.loading |= ac, bd(c, a.precedence, t));
      return e.instance;
    }
    function bd(t, e, a) {
      for (var c = a.querySelectorAll(
        'link[rel="stylesheet"][data-precedence],style[data-precedence]'
      ), o = c.length ? c[c.length - 1] : null, f = o, d = 0; d < c.length; d++) {
        var h = c[d];
        if (h.dataset.precedence === e) f = h;
        else if (f !== o) break;
      }
      f ? f.parentNode.insertBefore(t, f.nextSibling) : (e = a.nodeType === 9 ? a.head : a, e.insertBefore(t, e.firstChild));
    }
    function Ft(t, e) {
      t.crossOrigin == null && (t.crossOrigin = e.crossOrigin), t.referrerPolicy == null && (t.referrerPolicy = e.referrerPolicy), t.title == null && (t.title = e.title);
    }
    function Td(t, e) {
      t.crossOrigin == null && (t.crossOrigin = e.crossOrigin), t.referrerPolicy == null && (t.referrerPolicy = e.referrerPolicy), t.integrity == null && (t.integrity = e.integrity);
    }
    function fl(t, e, a) {
      if (FS === null) {
        var c = /* @__PURE__ */ new Map(), o = FS = /* @__PURE__ */ new Map();
        o.set(a, c);
      } else
        o = FS, c = o.get(a), c || (c = /* @__PURE__ */ new Map(), o.set(a, c));
      if (c.has(t)) return c;
      for (c.set(t, null), a = a.getElementsByTagName(t), o = 0; o < a.length; o++) {
        var f = a[o];
        if (!(f[Tn] || f[zl] || t === "link" && f.getAttribute("rel") === "stylesheet") && f.namespaceURI !== I) {
          var d = f.getAttribute(e) || "";
          d = t + d;
          var h = c.get(d);
          h ? h.push(f) : c.set(d, [f]);
        }
      }
      return c;
    }
    function Gv(t, e, a) {
      t = t.ownerDocument || t, t.head.insertBefore(
        a,
        e === "title" ? t.querySelector("head > title") : null
      );
    }
    function pb(t, e, a) {
      var c = !a.ancestorInfo.containerTagInScope;
      if (a.context === $m || e.itemProp != null)
        return !c || e.itemProp == null || t !== "meta" && t !== "title" && t !== "style" && t !== "link" && t !== "script" || console.error(
          "Cannot render a <%s> outside the main document if it has an `itemProp` prop. `itemProp` suggests the tag belongs to an `itemScope` which can appear anywhere in the DOM. If you were intending for React to hoist this <%s> remove the `itemProp` prop. Otherwise, try moving this tag into the <head> or <body> of the Document.",
          t,
          t
        ), !1;
      switch (t) {
        case "meta":
        case "title":
          return !0;
        case "style":
          if (typeof e.precedence != "string" || typeof e.href != "string" || e.href === "") {
            c && console.error(
              'Cannot render a <style> outside the main document without knowing its precedence and a unique href key. React can hoist and deduplicate <style> tags if you provide a `precedence` prop along with an `href` prop that does not conflict with the `href` values used in any other hoisted <style> or <link rel="stylesheet" ...> tags.  Note that hoisting <style> tags is considered an advanced feature that most will not use directly. Consider moving the <style> tag to the <head> or consider adding a `precedence="default"` and `href="some unique resource identifier"`.'
            );
            break;
          }
          return !0;
        case "link":
          if (typeof e.rel != "string" || typeof e.href != "string" || e.href === "" || e.onLoad || e.onError) {
            if (e.rel === "stylesheet" && typeof e.precedence == "string") {
              t = e.href;
              var o = e.onError, f = e.disabled;
              a = [], e.onLoad && a.push("`onLoad`"), o && a.push("`onError`"), f != null && a.push("`disabled`"), o = Ae(a, "and"), o += a.length === 1 ? " prop" : " props", f = a.length === 1 ? "an " + o : "the " + o, a.length && console.error(
                'React encountered a <link rel="stylesheet" href="%s" ... /> with a `precedence` prop that also included %s. The presence of loading and error handlers indicates an intent to manage the stylesheet loading state from your from your Component code and React will not hoist or deduplicate this stylesheet. If your intent was to have React hoist and deduplciate this stylesheet using the `precedence` prop remove the %s, otherwise remove the `precedence` prop.',
                t,
                f,
                o
              );
            }
            c && (typeof e.rel != "string" || typeof e.href != "string" || e.href === "" ? console.error(
              "Cannot render a <link> outside the main document without a `rel` and `href` prop. Try adding a `rel` and/or `href` prop to this <link> or moving the link into the <head> tag"
            ) : (e.onError || e.onLoad) && console.error(
              "Cannot render a <link> with onLoad or onError listeners outside the main document. Try removing onLoad={...} and onError={...} or moving it into the root <head> tag or somewhere in the <body>."
            ));
            break;
          }
          return e.rel === "stylesheet" ? (t = e.precedence, e = e.disabled, typeof t != "string" && c && console.error(
            'Cannot render a <link rel="stylesheet" /> outside the main document without knowing its precedence. Consider adding precedence="default" or moving it into the root <head> tag.'
          ), typeof t == "string" && e == null) : !0;
        case "script":
          if (t = e.async && typeof e.async != "function" && typeof e.async != "symbol", !t || e.onLoad || e.onError || !e.src || typeof e.src != "string") {
            c && (t ? e.onLoad || e.onError ? console.error(
              "Cannot render a <script> with onLoad or onError listeners outside the main document. Try removing onLoad={...} and onError={...} or moving it into the root <head> tag or somewhere in the <body>."
            ) : console.error(
              "Cannot render a <script> outside the main document without `async={true}` and a non-empty `src` prop. Ensure there is a valid `src` and either make the script async or move it into the root <head> tag or somewhere in the <body>."
            ) : console.error(
              'Cannot render a sync or defer <script> outside the main document without knowing its order. Try adding async="" or moving it into the root <head> tag.'
            ));
            break;
          }
          return !0;
        case "noscript":
        case "template":
          c && console.error(
            "Cannot render <%s> outside the main document. Try moving it into the root <head> tag.",
            t
          );
      }
      return !1;
    }
    function Vv(t, e) {
      return t === "img" && e.src != null && e.src !== "" && e.onLoad == null && e.loading !== "lazy";
    }
    function _p(t) {
      return !(t.type === "stylesheet" && (t.state.loading & q3) === uh);
    }
    function lm(t) {
      return (t.width || 100) * (t.height || 100) * (typeof devicePixelRatio == "number" ? devicePixelRatio : 1) * 0.25;
    }
    function am(t, e) {
      typeof e.decode == "function" && (t.imgCount++, e.complete || (t.imgBytes += lm(e), t.suspenseyImages.push(e)), t = wv.bind(t), e.decode().then(t, t));
    }
    function Ed(t, e, a, c) {
      if (a.type === "stylesheet" && (typeof c.media != "string" || matchMedia(c.media).matches !== !1) && (a.state.loading & ac) === uh) {
        if (a.instance === null) {
          var o = Lu(c.href), f = e.querySelector(
            Yi(o)
          );
          if (f) {
            e = f._p, e !== null && typeof e == "object" && typeof e.then == "function" && (t.count++, t = vs.bind(t), e.then(t, t)), a.state.loading |= ac, a.instance = f, qe(f);
            return;
          }
          f = e.ownerDocument || e, c = Rp(c), (o = nc.get(o)) && Ft(c, o), f = f.createElement("link"), qe(f);
          var d = f;
          d._p = new Promise(function(h, y) {
            d.onload = h, d.onerror = y;
          }), Ke(f, "link", c), a.instance = f;
        }
        t.stylesheets === null && (t.stylesheets = /* @__PURE__ */ new Map()), t.stylesheets.set(a, e), (e = a.state.preload) && (a.state.loading & q3) === uh && (t.count++, a = vs.bind(t), e.addEventListener("load", a), e.addEventListener("error", a));
      }
    }
    function Up(t, e) {
      return t.stylesheets && t.count === 0 && gs(t, t.stylesheets), 0 < t.count || 0 < t.imgCount ? function(a) {
        var c = setTimeout(function() {
          if (t.stylesheets && gs(t, t.stylesheets), t.unsuspend) {
            var f = t.unsuspend;
            t.unsuspend = null, f();
          }
        }, E4 + e);
        0 < t.imgBytes && WS === 0 && (WS = 125 * Qo() * A4);
        var o = setTimeout(
          function() {
            if (t.waitingForImages = !1, t.count === 0 && (t.stylesheets && gs(t, t.stylesheets), t.unsuspend)) {
              var f = t.unsuspend;
              t.unsuspend = null, f();
            }
          },
          (t.imgBytes > WS ? 50 : z4) + e
        );
        return t.unsuspend = a, function() {
          t.unsuspend = null, clearTimeout(c), clearTimeout(o);
        };
      } : null;
    }
    function jv(t) {
      if (t.count === 0 && (t.imgCount === 0 || !t.waitingForImages)) {
        if (t.stylesheets)
          gs(t, t.stylesheets);
        else if (t.unsuspend) {
          var e = t.unsuspend;
          t.unsuspend = null, e();
        }
      }
    }
    function vs() {
      this.count--, jv(this);
    }
    function wv() {
      this.imgCount--, jv(this);
    }
    function gs(t, e) {
      t.stylesheets = null, t.unsuspend !== null && (t.count++, IS = /* @__PURE__ */ new Map(), e.forEach(Sb, t), IS = null, vs.call(t));
    }
    function Sb(t, e) {
      if (!(e.state.loading & ac)) {
        var a = IS.get(t);
        if (a) var c = a.get(X2);
        else {
          a = /* @__PURE__ */ new Map(), IS.set(t, a);
          for (var o = t.querySelectorAll(
            "link[data-precedence],style[data-precedence]"
          ), f = 0; f < o.length; f++) {
            var d = o[f];
            (d.nodeName === "LINK" || d.getAttribute("media") !== "not all") && (a.set(d.dataset.precedence, d), c = d);
          }
          c && a.set(X2, c);
        }
        o = e.instance, d = o.getAttribute("data-precedence"), f = a.get(d) || c, f === c && a.set(X2, o), a.set(d, o), this.count++, c = vs.bind(this), o.addEventListener("load", c), o.addEventListener("error", c), f ? f.parentNode.insertBefore(o, f.nextSibling) : (t = t.nodeType === 9 ? t.head : t, t.insertBefore(o, t.firstChild)), e.state.loading |= ac;
      }
    }
    function Xv(t, e, a, c, o, f, d, h, y) {
      for (this.tag = 1, this.containerInfo = t, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = nh, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = $l(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = $l(0), this.hiddenUpdates = $l(null), this.identifierPrefix = c, this.onUncaughtError = o, this.onCaughtError = f, this.onRecoverableError = d, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = y, this.transitionTypes = null, this.incompleteTransitions = /* @__PURE__ */ new Map(), this.passiveEffectDuration = this.effectDuration = -0, this.memoizedUpdaters = /* @__PURE__ */ new Set(), t = this.pendingUpdatersLaneMap = [], e = 0; 31 > e; e++) t.push(/* @__PURE__ */ new Set());
      this._debugRootType = a ? "hydrateRoot()" : "createRoot()";
    }
    function Np(t, e, a, c, o, f, d, h, y, v, p, z) {
      return t = new Xv(
        t,
        e,
        a,
        d,
        y,
        v,
        p,
        z,
        h
      ), e = $E, f === !0 && (e |= Ba | Zc), e |= zt, f = Ot(3, null, null, e), t.current = f, f.stateNode = t, e = di(), gc(e), t.pooledCache = e, gc(e), f.memoizedState = {
        element: c,
        isDehydrated: a,
        cache: e
      }, Zn(f), t;
    }
    function Qv(t) {
      return t ? (t = Ns, t) : Ns;
    }
    function nm(t, e, a, c, o, f) {
      if (ll && typeof ll.onScheduleFiberRoot == "function")
        try {
          ll.onScheduleFiberRoot(Ds, c, a);
        } catch (d) {
          Pa || (Pa = !0, console.error(
            "React instrumentation encountered an error: %o",
            d
          ));
        }
      o = Qv(o), c.context === null ? c.context = o : c.pendingContext = o, bn && jl !== null && !X3 && (X3 = !0, console.error(
        `Render methods should be a pure function of props and state; triggering nested component updates from render is not allowed. If necessary, trigger nested updates in componentDidUpdate.

Check the render method of %s.`,
        tt(jl) || "Unknown"
      )), c = Ln(e), c.payload = { element: a }, f = f === void 0 ? null : f, f !== null && (typeof f != "function" && console.error(
        "Expected the last optional `callback` argument to be a function. Instead received: %s.",
        f
      ), c.callback = f), a = Nu(t, c, e), a !== null && (Gn(e, "root.render()", null), ge(a, t, e), Gf(a, t, e));
    }
    function Hp(t, e) {
      if (t = t.memoizedState, t !== null && t.dehydrated !== null) {
        var a = t.retryLane;
        t.retryLane = a !== 0 && a < e ? a : e;
      }
    }
    function Zv(t, e) {
      Hp(t, e), (t = t.alternate) && Hp(t, e);
    }
    function Gc(t) {
      if (t.tag === 13 || t.tag === 31) {
        var e = Nl(t, 67108864);
        e !== null && ge(e, t, 67108864), Zv(t, 67108864);
      }
    }
    function Lv(t) {
      if (t.tag === 13 || t.tag === 31) {
        var e = na(t);
        e = fh(e);
        var a = Nl(t, e);
        a !== null && ge(a, t, e), Zv(t, e);
      }
    }
    function Bp() {
      return jl;
    }
    function xp(t, e, a, c) {
      var o = x.T;
      x.T = null;
      var f = Gt.p;
      try {
        Gt.p = wl, Jv(t, e, a, c);
      } finally {
        Gt.p = f, x.T = o;
      }
    }
    function Yp(t, e, a, c) {
      var o = x.T;
      x.T = null;
      var f = Gt.p;
      try {
        Gt.p = iu, Jv(t, e, a, c);
      } finally {
        Gt.p = f, x.T = o;
      }
    }
    function Jv(t, e, a, c) {
      if (Im) {
        var o = zd(c);
        if (o === null)
          j0(
            t,
            e,
            c,
            PS,
            a
          ), Gp(t, c);
        else if (Vp(
          o,
          t,
          e,
          a,
          c
        ))
          c.stopPropagation();
        else if (Gp(t, c), e & 4 && -1 < D4.indexOf(t)) {
          for (; o !== null; ) {
            var f = bu(o);
            if (f !== null)
              switch (f.tag) {
                case 3:
                  if (f = f.stateNode, f.current.memoizedState.isDehydrated) {
                    var d = li(f.pendingLanes);
                    if (d !== 0) {
                      var h = f;
                      for (h.pendingLanes |= 2, h.entangledLanes |= 2; d; ) {
                        var y = 1 << 31 - $e(d);
                        h.entanglements[1] |= y, d &= ~y;
                      }
                      ca(f), (Zt & (Dl | hu)) === Jl && (HS = Ue() + g3, is(0));
                    }
                  }
                  break;
                case 31:
                case 13:
                  h = Nl(f, 2), h !== null && ge(h, f, 2), qo(), Zv(f, 2);
              }
            if (f = zd(c), f === null && j0(
              t,
              e,
              c,
              PS,
              a
            ), f === o) break;
            o = f;
          }
          o !== null && c.stopPropagation();
        } else
          j0(
            t,
            e,
            c,
            null,
            a
          );
      }
    }
    function zd(t) {
      return t = yh(t), Kv(t);
    }
    function Kv(t) {
      if (PS = null, t = lo(t), t !== null) {
        var e = Wt(t);
        if (e === null) t = null;
        else {
          var a = e.tag;
          if (a === 13) {
            if (t = _n(e), t !== null) return t;
            t = null;
          } else if (a === 31) {
            if (t = Un(e), t !== null) return t;
            t = null;
          } else if (a === 3) {
            if (e.stateNode.current.memoizedState.isDehydrated)
              return e.tag === 3 ? e.stateNode.containerInfo : null;
            t = null;
          } else e !== t && (t = null);
        }
      }
      return PS = t, null;
    }
    function qp(t) {
      switch (t) {
        case "beforetoggle":
        case "cancel":
        case "click":
        case "close":
        case "contextmenu":
        case "copy":
        case "cut":
        case "auxclick":
        case "dblclick":
        case "dragend":
        case "dragstart":
        case "drop":
        case "focusin":
        case "focusout":
        case "input":
        case "invalid":
        case "keydown":
        case "keypress":
        case "keyup":
        case "mousedown":
        case "mouseup":
        case "paste":
        case "pause":
        case "play":
        case "pointercancel":
        case "pointerdown":
        case "pointerup":
        case "ratechange":
        case "reset":
        case "seeked":
        case "submit":
        case "toggle":
        case "touchcancel":
        case "touchend":
        case "touchstart":
        case "volumechange":
        case "change":
        case "selectionchange":
        case "textInput":
        case "compositionstart":
        case "compositionend":
        case "compositionupdate":
        case "beforeblur":
        case "afterblur":
        case "beforeinput":
        case "blur":
        case "fullscreenchange":
        case "fullscreenerror":
        case "focus":
        case "hashchange":
        case "popstate":
        case "select":
        case "selectstart":
          return wl;
        case "drag":
        case "dragenter":
        case "dragexit":
        case "dragleave":
        case "dragover":
        case "mousemove":
        case "mouseout":
        case "mouseover":
        case "pointermove":
        case "pointerout":
        case "pointerover":
        case "resize":
        case "scroll":
        case "touchmove":
        case "wheel":
        case "mouseenter":
        case "mouseleave":
        case "pointerenter":
        case "pointerleave":
          return iu;
        case "message":
          switch ($p()) {
            case rm:
              return wl;
            case dm:
              return iu;
            case Os:
            case hm:
              return Ku;
            case fg:
              return wc;
            default:
              return Ku;
          }
        default:
          return Ku;
      }
    }
    function Gp(t, e) {
      switch (t) {
        case "focusin":
        case "focusout":
          Ks = null;
          break;
        case "dragenter":
        case "dragleave":
          $s = null;
          break;
        case "mouseover":
        case "mouseout":
          Fs = null;
          break;
        case "pointerover":
        case "pointerout":
          o1.delete(e.pointerId);
          break;
        case "gotpointercapture":
        case "lostpointercapture":
          f1.delete(e.pointerId);
      }
    }
    function uu(t, e, a, c, o, f) {
      return t === null || t.nativeEvent !== f ? (t = {
        blockedOn: e,
        domEventName: a,
        eventSystemFlags: c,
        nativeEvent: f,
        targetContainers: [o]
      }, e !== null && (e = bu(e), e !== null && Gc(e)), t) : (t.eventSystemFlags |= c, e = t.targetContainers, o !== null && e.indexOf(o) === -1 && e.push(o), t);
    }
    function Vp(t, e, a, c, o) {
      switch (e) {
        case "focusin":
          return Ks = uu(
            Ks,
            t,
            e,
            a,
            c,
            o
          ), !0;
        case "dragenter":
          return $s = uu(
            $s,
            t,
            e,
            a,
            c,
            o
          ), !0;
        case "mouseover":
          return Fs = uu(
            Fs,
            t,
            e,
            a,
            c,
            o
          ), !0;
        case "pointerover":
          var f = o.pointerId;
          return o1.set(
            f,
            uu(
              o1.get(f) || null,
              t,
              e,
              a,
              c,
              o
            )
          ), !0;
        case "gotpointercapture":
          return f = o.pointerId, f1.set(
            f,
            uu(
              f1.get(f) || null,
              t,
              e,
              a,
              c,
              o
            )
          ), !0;
      }
      return !1;
    }
    function Ua(t) {
      var e = lo(t.target);
      if (e !== null) {
        var a = Wt(e);
        if (a !== null) {
          if (e = a.tag, e === 13) {
            if (e = _n(a), e !== null) {
              t.blockedOn = e, cc(t.priority, function() {
                Lv(a);
              });
              return;
            }
          } else if (e === 31) {
            if (e = Un(a), e !== null) {
              t.blockedOn = e, cc(t.priority, function() {
                Lv(a);
              });
              return;
            }
          } else if (e === 3 && a.stateNode.current.memoizedState.isDehydrated) {
            t.blockedOn = a.tag === 3 ? a.stateNode.containerInfo : null;
            return;
          }
        }
      }
      t.blockedOn = null;
    }
    function um(t) {
      if (t.blockedOn !== null) return !1;
      for (var e = t.targetContainers; 0 < e.length; ) {
        var a = zd(t.nativeEvent);
        if (a === null) {
          a = t.nativeEvent;
          var c = new a.constructor(
            a.type,
            a
          ), o = c;
          vg !== null && console.error(
            "Expected currently replaying event to be null. This error is likely caused by a bug in React. Please file an issue."
          ), vg = o, a.target.dispatchEvent(c), vg === null && console.error(
            "Expected currently replaying event to not be null. This error is likely caused by a bug in React. Please file an issue."
          ), vg = null;
        } else
          return e = bu(a), e !== null && Gc(e), t.blockedOn = a, !1;
        e.shift();
      }
      return !0;
    }
    function jp(t, e, a) {
      um(t) && a.delete(e);
    }
    function ps() {
      Q2 = !1, Ks !== null && um(Ks) && (Ks = null), $s !== null && um($s) && ($s = null), Fs !== null && um(Fs) && (Fs = null), o1.forEach(jp), f1.forEach(jp);
    }
    function Ad(t, e) {
      t.blockedOn === e && (t.blockedOn = null, Q2 || (Q2 = !0, ee.unstable_scheduleCallback(
        ee.unstable_NormalPriority,
        ps
      )));
    }
    function $v(t) {
      tb !== t && (tb = t, ee.unstable_scheduleCallback(
        ee.unstable_NormalPriority,
        function() {
          tb === t && (tb = null);
          for (var e = 0; e < t.length; e += 3) {
            var a = t[e], c = t[e + 1], o = t[e + 2];
            if (typeof c != "function") {
              if (Kv(c || a) === null)
                continue;
              break;
            }
            var f = bu(a);
            f !== null && (t.splice(e, 3), e -= 3, a = {
              pending: !0,
              data: o,
              method: a.method,
              action: c
            }, Object.freeze(a), tl(
              f,
              a,
              c,
              o
            ));
          }
        }
      ));
    }
    function $o(t) {
      function e(y) {
        return Ad(y, t);
      }
      Ks !== null && Ad(Ks, t), $s !== null && Ad($s, t), Fs !== null && Ad(Fs, t), o1.forEach(e), f1.forEach(e);
      for (var a = 0; a < Ws.length; a++) {
        var c = Ws[a];
        c.blockedOn === t && (c.blockedOn = null);
      }
      for (; 0 < Ws.length && (a = Ws[0], a.blockedOn === null); )
        Ua(a), a.blockedOn === null && Ws.shift();
      if (a = (t.ownerDocument || t).$$reactFormReplay, a != null)
        for (c = 0; c < a.length; c += 3) {
          var o = a[c], f = a[c + 1], d = o[Al] || null;
          if (typeof f == "function")
            d || $v(a);
          else if (d) {
            var h = null;
            if (f && f.hasAttribute("formAction")) {
              if (o = f, d = f[Al] || null)
                h = d.formAction;
              else if (Kv(o) !== null) continue;
            } else h = d.action;
            typeof h == "function" ? a[c + 1] = h : (a.splice(c, 3), c -= 3), $v(a);
          }
        }
    }
    function cm() {
      function t(f) {
        f.canIntercept && f.info === "react-transition" && f.intercept({
          handler: function() {
            return new Promise(function(d) {
              return o = d;
            });
          },
          focusReset: "manual",
          scroll: "manual"
        });
      }
      function e() {
        o !== null && (o(), o = null), c || setTimeout(a, 20);
      }
      function a() {
        if (!c && !navigation.transition) {
          var f = navigation.currentEntry;
          f && f.url != null && navigation.navigate(f.url, {
            state: f.getState(),
            info: "react-transition",
            history: "replace"
          });
        }
      }
      if (typeof navigation == "object") {
        var c = !1, o = null;
        return navigation.addEventListener("navigate", t), navigation.addEventListener("navigatesuccess", e), navigation.addEventListener("navigateerror", e), setTimeout(a, 100), function() {
          c = !0, navigation.removeEventListener("navigate", t), navigation.removeEventListener(
            "navigatesuccess",
            e
          ), navigation.removeEventListener(
            "navigateerror",
            e
          ), o !== null && (o(), o = null);
        };
      }
    }
    function Fv(t) {
      this._internalRoot = t;
    }
    function im(t) {
      this._internalRoot = t;
    }
    function wp(t) {
      t[$u] && (t._reactRootContainer ? console.error(
        "You are calling ReactDOMClient.createRoot() on a container that was previously passed to ReactDOM.render(). This is not supported."
      ) : console.error(
        "You are calling ReactDOMClient.createRoot() on a container that has already been passed to createRoot() before. Instead, call root.render() on the existing root instead if you want to update it."
      ));
    }
    typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error());
    var ee = oE(), Od = cE, bb = iE, Ss = null, Wv = null, pt = Object.assign, Tb = /* @__PURE__ */ Symbol.for("react.element"), cu = /* @__PURE__ */ Symbol.for("react.transitional.element"), Fo = /* @__PURE__ */ Symbol.for("react.portal"), bs = /* @__PURE__ */ Symbol.for("react.fragment"), Ts = /* @__PURE__ */ Symbol.for("react.strict_mode"), Iv = /* @__PURE__ */ Symbol.for("react.profiler"), kv = /* @__PURE__ */ Symbol.for("react.consumer"), Sn = /* @__PURE__ */ Symbol.for("react.context"), Es = /* @__PURE__ */ Symbol.for("react.forward_ref"), Dd = /* @__PURE__ */ Symbol.for("react.suspense"), Pv = /* @__PURE__ */ Symbol.for("react.suspense_list"), ra = /* @__PURE__ */ Symbol.for("react.memo"), Vl = /* @__PURE__ */ Symbol.for("react.lazy"), om = /* @__PURE__ */ Symbol.for("react.activity"), Xp = /* @__PURE__ */ Symbol.for("react.legacy_hidden"), Eb = /* @__PURE__ */ Symbol.for("react.memo_cache_sentinel"), tg = /* @__PURE__ */ Symbol.for("react.view_transition"), Qp = /* @__PURE__ */ Symbol.for("react.recoverable"), eg = Symbol.iterator, lg = /* @__PURE__ */ Symbol.for("react.client.reference"), le = Array.isArray, x = Od.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, Gt = bb.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, Vc = Object.freeze({
      pending: !1,
      data: null,
      method: null,
      action: null
    }), ag = [], ng = [], Na = -1, jc = Ye(null), Cd = Ye(null), qi = Ye(null), fm = Ye(null), Rd = 0, Zp, Lp, Jp, ug, Wo, zs, cg;
    ft.__reactDisabledLog = !0;
    var ig, Io, ko = !1, sm = new (typeof WeakMap == "function" ? WeakMap : Map)(), jl = null, bn = !1, Ha = Object.prototype.hasOwnProperty, As = ee.unstable_scheduleCallback, Kp = ee.unstable_cancelCallback, og = ee.unstable_shouldYield, zb = ee.unstable_requestPaint, Ue = ee.unstable_now, $p = ee.unstable_getCurrentPriorityLevel, rm = ee.unstable_ImmediatePriority, dm = ee.unstable_UserBlockingPriority, Os = ee.unstable_NormalPriority, hm = ee.unstable_LowPriority, fg = ee.unstable_IdlePriority, Fp = ee.log, Md = ee.unstable_setDisableYieldValue, Ds = null, ll = null, Pa = !1, Ju = typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u", $e = Math.clz32 ? Math.clz32 : ab, Ab = Math.log, Wp = Math.LN2, _d = 256, Ud = 262144, Nd = 4194304, wl = 2, iu = 8, Ku = 32, wc = 268435456, Xc = Math.random().toString(36).slice(2), zl = "__reactFiber$" + Xc, Al = "__reactProps$" + Xc, $u = "__reactContainer$" + Xc, Hd = "__reactEvents$" + Xc, sg = "__reactListeners$" + Xc, Ip = "__reactHandles$" + Xc, mm = "__reactResources$" + Xc, Tn = "__reactMarker$" + Xc, ou = "__reactLoad$" + Xc, Qc = /* @__PURE__ */ new Set(), fu = {}, Po = {}, Gi = {
      button: !0,
      checkbox: !0,
      image: !0,
      hidden: !0,
      radio: !0,
      reset: !0,
      submit: !0
    }, Ob = RegExp(
      "^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"
    ), rg = {}, Cs = {}, Lt = !1, kp = /[\n"\\]/g, Bd = !1, dg = !1, Pp = !1, xd = !1, Yd = !1, hg = !1, tf = ["value", "defaultValue"], mg = !1, ym = /["'&<>\n\t]|^\s|\s$/, vm = "address applet area article aside base basefont bgsound blockquote body br button caption center col colgroup dd details dir div dl dt embed fieldset figcaption figure footer form frame frameset h1 h2 h3 h4 h5 h6 head header hgroup hr html iframe img input isindex li link listing main marquee menu menuitem meta nav noembed noframes noscript object ol p param plaintext pre script section select source style summary table tbody td template textarea tfoot th thead title tr track ul wbr xmp".split(
      " "
    ), yg = "applet caption html table td th marquee object select template foreignObject desc title".split(
      " "
    ), Db = yg.concat(["button"]), gm = "dd dt li option optgroup p rp rt".split(" "), l = {
      current: null,
      formTag: null,
      aTagInScope: null,
      buttonTagInScope: null,
      nobrTagInScope: null,
      pTagInButtonScope: null,
      listItemTagAutoclosing: null,
      dlItemTagAutoclosing: null,
      containerTagInScope: null,
      implicitRootScope: !1
    }, n = {}, u = {
      animation: "animationDelay animationDirection animationDuration animationFillMode animationIterationCount animationName animationPlayState animationTimingFunction".split(
        " "
      ),
      background: "backgroundAttachment backgroundClip backgroundColor backgroundImage backgroundOrigin backgroundPositionX backgroundPositionY backgroundRepeat backgroundSize".split(
        " "
      ),
      backgroundPosition: ["backgroundPositionX", "backgroundPositionY"],
      border: "borderBottomColor borderBottomStyle borderBottomWidth borderImageOutset borderImageRepeat borderImageSlice borderImageSource borderImageWidth borderLeftColor borderLeftStyle borderLeftWidth borderRightColor borderRightStyle borderRightWidth borderTopColor borderTopStyle borderTopWidth".split(
        " "
      ),
      borderBlock: "borderBlockEndColor borderBlockEndStyle borderBlockEndWidth borderBlockStartColor borderBlockStartStyle borderBlockStartWidth".split(
        " "
      ),
      borderBlockColor: ["borderBlockEndColor", "borderBlockStartColor"],
      borderBlockEnd: [
        "borderBlockEndColor",
        "borderBlockEndStyle",
        "borderBlockEndWidth"
      ],
      borderBlockStart: [
        "borderBlockStartColor",
        "borderBlockStartStyle",
        "borderBlockStartWidth"
      ],
      borderBlockStyle: ["borderBlockEndStyle", "borderBlockStartStyle"],
      borderBlockWidth: ["borderBlockEndWidth", "borderBlockStartWidth"],
      borderBottom: [
        "borderBottomColor",
        "borderBottomStyle",
        "borderBottomWidth"
      ],
      borderColor: [
        "borderBottomColor",
        "borderLeftColor",
        "borderRightColor",
        "borderTopColor"
      ],
      borderImage: [
        "borderImageOutset",
        "borderImageRepeat",
        "borderImageSlice",
        "borderImageSource",
        "borderImageWidth"
      ],
      borderInline: "borderInlineEndColor borderInlineEndStyle borderInlineEndWidth borderInlineStartColor borderInlineStartStyle borderInlineStartWidth".split(
        " "
      ),
      borderInlineColor: ["borderInlineEndColor", "borderInlineStartColor"],
      borderInlineEnd: [
        "borderInlineEndColor",
        "borderInlineEndStyle",
        "borderInlineEndWidth"
      ],
      borderInlineStart: [
        "borderInlineStartColor",
        "borderInlineStartStyle",
        "borderInlineStartWidth"
      ],
      borderInlineStyle: ["borderInlineEndStyle", "borderInlineStartStyle"],
      borderInlineWidth: ["borderInlineEndWidth", "borderInlineStartWidth"],
      borderLeft: ["borderLeftColor", "borderLeftStyle", "borderLeftWidth"],
      borderRadius: [
        "borderBottomLeftRadius",
        "borderBottomRightRadius",
        "borderTopLeftRadius",
        "borderTopRightRadius"
      ],
      borderRight: [
        "borderRightColor",
        "borderRightStyle",
        "borderRightWidth"
      ],
      borderStyle: [
        "borderBottomStyle",
        "borderLeftStyle",
        "borderRightStyle",
        "borderTopStyle"
      ],
      borderTop: ["borderTopColor", "borderTopStyle", "borderTopWidth"],
      borderWidth: [
        "borderBottomWidth",
        "borderLeftWidth",
        "borderRightWidth",
        "borderTopWidth"
      ],
      colorAdjust: ["printColorAdjust"],
      columnRule: ["columnRuleColor", "columnRuleStyle", "columnRuleWidth"],
      columns: ["columnCount", "columnWidth"],
      containIntrinsicSize: [
        "containIntrinsicHeight",
        "containIntrinsicWidth"
      ],
      container: ["containerName", "containerType"],
      flex: ["flexBasis", "flexGrow", "flexShrink"],
      flexFlow: ["flexDirection", "flexWrap"],
      font: "fontFamily fontFeatureSettings fontKerning fontLanguageOverride fontSize fontSizeAdjust fontStretch fontStyle fontVariant fontVariantAlternates fontVariantCaps fontVariantEastAsian fontVariantLigatures fontVariantNumeric fontVariantPosition fontWeight lineHeight".split(
        " "
      ),
      fontSynthesis: [
        "fontSynthesisPosition",
        "fontSynthesisSmallCaps",
        "fontSynthesisStyle",
        "fontSynthesisWeight"
      ],
      fontVariant: "fontVariantAlternates fontVariantCaps fontVariantEastAsian fontVariantLigatures fontVariantNumeric fontVariantPosition".split(
        " "
      ),
      gap: ["columnGap", "rowGap"],
      grid: "gridAutoColumns gridAutoFlow gridAutoRows gridTemplateAreas gridTemplateColumns gridTemplateRows".split(
        " "
      ),
      gridArea: [
        "gridColumnEnd",
        "gridColumnStart",
        "gridRowEnd",
        "gridRowStart"
      ],
      gridColumn: ["gridColumnEnd", "gridColumnStart"],
      gridColumnGap: ["columnGap"],
      gridGap: ["columnGap", "rowGap"],
      gridRow: ["gridRowEnd", "gridRowStart"],
      gridRowGap: ["rowGap"],
      gridTemplate: [
        "gridTemplateAreas",
        "gridTemplateColumns",
        "gridTemplateRows"
      ],
      inset: ["bottom", "left", "right", "top"],
      insetBlock: ["insetBlockEnd", "insetBlockStart"],
      insetInline: ["insetInlineEnd", "insetInlineStart"],
      listStyle: ["listStyleImage", "listStylePosition", "listStyleType"],
      margin: ["marginBottom", "marginLeft", "marginRight", "marginTop"],
      marginBlock: ["marginBlockEnd", "marginBlockStart"],
      marginInline: ["marginInlineEnd", "marginInlineStart"],
      marker: ["markerEnd", "markerMid", "markerStart"],
      mask: "maskClip maskComposite maskImage maskMode maskOrigin maskPositionX maskPositionY maskRepeat maskSize".split(
        " "
      ),
      maskPosition: ["maskPositionX", "maskPositionY"],
      offset: [
        "offsetAnchor",
        "offsetDistance",
        "offsetPath",
        "offsetPosition",
        "offsetRotate"
      ],
      outline: ["outlineColor", "outlineStyle", "outlineWidth"],
      overflow: ["overflowX", "overflowY"],
      overscrollBehavior: ["overscrollBehaviorX", "overscrollBehaviorY"],
      padding: ["paddingBottom", "paddingLeft", "paddingRight", "paddingTop"],
      paddingBlock: ["paddingBlockEnd", "paddingBlockStart"],
      paddingInline: ["paddingInlineEnd", "paddingInlineStart"],
      pageBreakAfter: ["breakAfter"],
      pageBreakBefore: ["breakBefore"],
      pageBreakInside: ["breakInside"],
      placeContent: ["alignContent", "justifyContent"],
      placeItems: ["alignItems", "justifyItems"],
      placeSelf: ["alignSelf", "justifySelf"],
      scrollMargin: [
        "scrollMarginBottom",
        "scrollMarginLeft",
        "scrollMarginRight",
        "scrollMarginTop"
      ],
      scrollMarginBlock: ["scrollMarginBlockEnd", "scrollMarginBlockStart"],
      scrollMarginInline: [
        "scrollMarginInlineEnd",
        "scrollMarginInlineStart"
      ],
      scrollPadding: [
        "scrollPaddingBottom",
        "scrollPaddingLeft",
        "scrollPaddingRight",
        "scrollPaddingTop"
      ],
      scrollPaddingBlock: [
        "scrollPaddingBlockEnd",
        "scrollPaddingBlockStart"
      ],
      scrollPaddingInline: [
        "scrollPaddingInlineEnd",
        "scrollPaddingInlineStart"
      ],
      textDecoration: [
        "textDecorationColor",
        "textDecorationLine",
        "textDecorationStyle",
        "textDecorationThickness"
      ],
      textEmphasis: ["textEmphasisColor", "textEmphasisStyle"],
      textWrap: ["textWrapMode", "textWrapStyle"],
      transition: [
        "transitionBehavior",
        "transitionDelay",
        "transitionDuration",
        "transitionProperty",
        "transitionTimingFunction"
      ],
      verticalAlign: ["alignmentBaseline", "baselineShift", "baselineSource"],
      whiteSpace: ["textWrapMode", "whiteSpaceCollapse"],
      wordWrap: ["overflowWrap"]
    }, i = /([A-Z])/g, s = /^ms-/, r = /^(?:webkit|moz|o)[A-Z]/, m = /^-ms-/, g = /-(.)/g, S = /;\s*$/, C = {}, N = {}, G = !1, D = !1, U = new Set(
      "animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(
        " "
      )
    ), Z = "http://www.w3.org/1998/Math/MathML", I = "http://www.w3.org/2000/svg", bt = /* @__PURE__ */ new Map([
      ["acceptCharset", "accept-charset"],
      ["htmlFor", "for"],
      ["httpEquiv", "http-equiv"],
      ["crossOrigin", "crossorigin"],
      ["accentHeight", "accent-height"],
      ["alignmentBaseline", "alignment-baseline"],
      ["arabicForm", "arabic-form"],
      ["baselineShift", "baseline-shift"],
      ["capHeight", "cap-height"],
      ["clipPath", "clip-path"],
      ["clipRule", "clip-rule"],
      ["colorInterpolation", "color-interpolation"],
      ["colorInterpolationFilters", "color-interpolation-filters"],
      ["colorProfile", "color-profile"],
      ["colorRendering", "color-rendering"],
      ["dominantBaseline", "dominant-baseline"],
      ["enableBackground", "enable-background"],
      ["fillOpacity", "fill-opacity"],
      ["fillRule", "fill-rule"],
      ["floodColor", "flood-color"],
      ["floodOpacity", "flood-opacity"],
      ["fontFamily", "font-family"],
      ["fontSize", "font-size"],
      ["fontSizeAdjust", "font-size-adjust"],
      ["fontStretch", "font-stretch"],
      ["fontStyle", "font-style"],
      ["fontVariant", "font-variant"],
      ["fontWeight", "font-weight"],
      ["glyphName", "glyph-name"],
      ["glyphOrientationHorizontal", "glyph-orientation-horizontal"],
      ["glyphOrientationVertical", "glyph-orientation-vertical"],
      ["horizAdvX", "horiz-adv-x"],
      ["horizOriginX", "horiz-origin-x"],
      ["imageRendering", "image-rendering"],
      ["letterSpacing", "letter-spacing"],
      ["lightingColor", "lighting-color"],
      ["markerEnd", "marker-end"],
      ["markerMid", "marker-mid"],
      ["markerStart", "marker-start"],
      ["maskType", "mask-type"],
      ["overlinePosition", "overline-position"],
      ["overlineThickness", "overline-thickness"],
      ["paintOrder", "paint-order"],
      ["panose-1", "panose-1"],
      ["pointerEvents", "pointer-events"],
      ["renderingIntent", "rendering-intent"],
      ["shapeRendering", "shape-rendering"],
      ["stopColor", "stop-color"],
      ["stopOpacity", "stop-opacity"],
      ["strikethroughPosition", "strikethrough-position"],
      ["strikethroughThickness", "strikethrough-thickness"],
      ["strokeDasharray", "stroke-dasharray"],
      ["strokeDashoffset", "stroke-dashoffset"],
      ["strokeLinecap", "stroke-linecap"],
      ["strokeLinejoin", "stroke-linejoin"],
      ["strokeMiterlimit", "stroke-miterlimit"],
      ["strokeOpacity", "stroke-opacity"],
      ["strokeWidth", "stroke-width"],
      ["textAnchor", "text-anchor"],
      ["textDecoration", "text-decoration"],
      ["textRendering", "text-rendering"],
      ["transformOrigin", "transform-origin"],
      ["underlinePosition", "underline-position"],
      ["underlineThickness", "underline-thickness"],
      ["unicodeBidi", "unicode-bidi"],
      ["unicodeRange", "unicode-range"],
      ["unitsPerEm", "units-per-em"],
      ["vAlphabetic", "v-alphabetic"],
      ["vHanging", "v-hanging"],
      ["vIdeographic", "v-ideographic"],
      ["vMathematical", "v-mathematical"],
      ["vectorEffect", "vector-effect"],
      ["vertAdvY", "vert-adv-y"],
      ["vertOriginX", "vert-origin-x"],
      ["vertOriginY", "vert-origin-y"],
      ["wordSpacing", "word-spacing"],
      ["writingMode", "writing-mode"],
      ["xmlnsXlink", "xmlns:xlink"],
      ["xHeight", "x-height"]
    ]), R = {
      accept: "accept",
      acceptcharset: "acceptCharset",
      "accept-charset": "acceptCharset",
      accesskey: "accessKey",
      action: "action",
      allowfullscreen: "allowFullScreen",
      alt: "alt",
      as: "as",
      async: "async",
      autocapitalize: "autoCapitalize",
      autocomplete: "autoComplete",
      autocorrect: "autoCorrect",
      autofocus: "autoFocus",
      autoplay: "autoPlay",
      autosave: "autoSave",
      capture: "capture",
      cellpadding: "cellPadding",
      cellspacing: "cellSpacing",
      challenge: "challenge",
      charset: "charSet",
      checked: "checked",
      children: "children",
      cite: "cite",
      class: "className",
      classid: "classID",
      classname: "className",
      cols: "cols",
      colspan: "colSpan",
      content: "content",
      contenteditable: "contentEditable",
      contextmenu: "contextMenu",
      controls: "controls",
      controlslist: "controlsList",
      coords: "coords",
      credentialless: "credentialless",
      crossorigin: "crossOrigin",
      dangerouslysetinnerhtml: "dangerouslySetInnerHTML",
      data: "data",
      datetime: "dateTime",
      default: "default",
      defaultchecked: "defaultChecked",
      defaultvalue: "defaultValue",
      defer: "defer",
      dir: "dir",
      disabled: "disabled",
      disablepictureinpicture: "disablePictureInPicture",
      disableremoteplayback: "disableRemotePlayback",
      download: "download",
      draggable: "draggable",
      enctype: "encType",
      enterkeyhint: "enterKeyHint",
      fetchpriority: "fetchPriority",
      for: "htmlFor",
      form: "form",
      formmethod: "formMethod",
      formaction: "formAction",
      formenctype: "formEncType",
      formnovalidate: "formNoValidate",
      formtarget: "formTarget",
      frameborder: "frameBorder",
      headers: "headers",
      height: "height",
      hidden: "hidden",
      high: "high",
      href: "href",
      hreflang: "hrefLang",
      htmlfor: "htmlFor",
      httpequiv: "httpEquiv",
      "http-equiv": "httpEquiv",
      icon: "icon",
      id: "id",
      imagesizes: "imageSizes",
      imagesrcset: "imageSrcSet",
      inert: "inert",
      innerhtml: "innerHTML",
      inputmode: "inputMode",
      integrity: "integrity",
      is: "is",
      itemid: "itemID",
      itemprop: "itemProp",
      itemref: "itemRef",
      itemscope: "itemScope",
      itemtype: "itemType",
      keyparams: "keyParams",
      keytype: "keyType",
      kind: "kind",
      label: "label",
      lang: "lang",
      list: "list",
      loop: "loop",
      low: "low",
      manifest: "manifest",
      marginwidth: "marginWidth",
      marginheight: "marginHeight",
      max: "max",
      maxlength: "maxLength",
      media: "media",
      mediagroup: "mediaGroup",
      method: "method",
      min: "min",
      minlength: "minLength",
      multiple: "multiple",
      muted: "muted",
      name: "name",
      nomodule: "noModule",
      nonce: "nonce",
      novalidate: "noValidate",
      open: "open",
      optimum: "optimum",
      pattern: "pattern",
      placeholder: "placeholder",
      playsinline: "playsInline",
      poster: "poster",
      preload: "preload",
      profile: "profile",
      radiogroup: "radioGroup",
      readonly: "readOnly",
      referrerpolicy: "referrerPolicy",
      rel: "rel",
      required: "required",
      reversed: "reversed",
      role: "role",
      rows: "rows",
      rowspan: "rowSpan",
      sandbox: "sandbox",
      scope: "scope",
      scoped: "scoped",
      scrolling: "scrolling",
      seamless: "seamless",
      selected: "selected",
      shape: "shape",
      size: "size",
      sizes: "sizes",
      span: "span",
      spellcheck: "spellCheck",
      src: "src",
      srcdoc: "srcDoc",
      srclang: "srcLang",
      srcset: "srcSet",
      start: "start",
      step: "step",
      style: "style",
      summary: "summary",
      tabindex: "tabIndex",
      target: "target",
      title: "title",
      type: "type",
      usemap: "useMap",
      value: "value",
      width: "width",
      wmode: "wmode",
      wrap: "wrap",
      about: "about",
      accentheight: "accentHeight",
      "accent-height": "accentHeight",
      accumulate: "accumulate",
      additive: "additive",
      alignmentbaseline: "alignmentBaseline",
      "alignment-baseline": "alignmentBaseline",
      allowreorder: "allowReorder",
      alphabetic: "alphabetic",
      amplitude: "amplitude",
      arabicform: "arabicForm",
      "arabic-form": "arabicForm",
      ascent: "ascent",
      attributename: "attributeName",
      attributetype: "attributeType",
      autoreverse: "autoReverse",
      azimuth: "azimuth",
      basefrequency: "baseFrequency",
      baselineshift: "baselineShift",
      "baseline-shift": "baselineShift",
      baseprofile: "baseProfile",
      bbox: "bbox",
      begin: "begin",
      bias: "bias",
      by: "by",
      calcmode: "calcMode",
      capheight: "capHeight",
      "cap-height": "capHeight",
      clip: "clip",
      clippath: "clipPath",
      "clip-path": "clipPath",
      clippathunits: "clipPathUnits",
      cliprule: "clipRule",
      "clip-rule": "clipRule",
      color: "color",
      colorinterpolation: "colorInterpolation",
      "color-interpolation": "colorInterpolation",
      colorinterpolationfilters: "colorInterpolationFilters",
      "color-interpolation-filters": "colorInterpolationFilters",
      colorprofile: "colorProfile",
      "color-profile": "colorProfile",
      colorrendering: "colorRendering",
      "color-rendering": "colorRendering",
      contentscripttype: "contentScriptType",
      contentstyletype: "contentStyleType",
      cursor: "cursor",
      cx: "cx",
      cy: "cy",
      d: "d",
      datatype: "datatype",
      decelerate: "decelerate",
      descent: "descent",
      diffuseconstant: "diffuseConstant",
      direction: "direction",
      display: "display",
      divisor: "divisor",
      dominantbaseline: "dominantBaseline",
      "dominant-baseline": "dominantBaseline",
      dur: "dur",
      dx: "dx",
      dy: "dy",
      edgemode: "edgeMode",
      elevation: "elevation",
      enablebackground: "enableBackground",
      "enable-background": "enableBackground",
      end: "end",
      exponent: "exponent",
      externalresourcesrequired: "externalResourcesRequired",
      fill: "fill",
      fillopacity: "fillOpacity",
      "fill-opacity": "fillOpacity",
      fillrule: "fillRule",
      "fill-rule": "fillRule",
      filter: "filter",
      filterres: "filterRes",
      filterunits: "filterUnits",
      floodopacity: "floodOpacity",
      "flood-opacity": "floodOpacity",
      floodcolor: "floodColor",
      "flood-color": "floodColor",
      focusable: "focusable",
      fontfamily: "fontFamily",
      "font-family": "fontFamily",
      fontsize: "fontSize",
      "font-size": "fontSize",
      fontsizeadjust: "fontSizeAdjust",
      "font-size-adjust": "fontSizeAdjust",
      fontstretch: "fontStretch",
      "font-stretch": "fontStretch",
      fontstyle: "fontStyle",
      "font-style": "fontStyle",
      fontvariant: "fontVariant",
      "font-variant": "fontVariant",
      fontweight: "fontWeight",
      "font-weight": "fontWeight",
      format: "format",
      from: "from",
      fx: "fx",
      fy: "fy",
      g1: "g1",
      g2: "g2",
      glyphname: "glyphName",
      "glyph-name": "glyphName",
      glyphorientationhorizontal: "glyphOrientationHorizontal",
      "glyph-orientation-horizontal": "glyphOrientationHorizontal",
      glyphorientationvertical: "glyphOrientationVertical",
      "glyph-orientation-vertical": "glyphOrientationVertical",
      glyphref: "glyphRef",
      gradienttransform: "gradientTransform",
      gradientunits: "gradientUnits",
      hanging: "hanging",
      horizadvx: "horizAdvX",
      "horiz-adv-x": "horizAdvX",
      horizoriginx: "horizOriginX",
      "horiz-origin-x": "horizOriginX",
      ideographic: "ideographic",
      imagerendering: "imageRendering",
      "image-rendering": "imageRendering",
      in2: "in2",
      in: "in",
      inlist: "inlist",
      intercept: "intercept",
      k1: "k1",
      k2: "k2",
      k3: "k3",
      k4: "k4",
      k: "k",
      kernelmatrix: "kernelMatrix",
      kernelunitlength: "kernelUnitLength",
      kerning: "kerning",
      keypoints: "keyPoints",
      keysplines: "keySplines",
      keytimes: "keyTimes",
      lengthadjust: "lengthAdjust",
      letterspacing: "letterSpacing",
      "letter-spacing": "letterSpacing",
      lightingcolor: "lightingColor",
      "lighting-color": "lightingColor",
      limitingconeangle: "limitingConeAngle",
      local: "local",
      markerend: "markerEnd",
      "marker-end": "markerEnd",
      markerheight: "markerHeight",
      markermid: "markerMid",
      "marker-mid": "markerMid",
      markerstart: "markerStart",
      "marker-start": "markerStart",
      markerunits: "markerUnits",
      markerwidth: "markerWidth",
      mask: "mask",
      maskcontentunits: "maskContentUnits",
      masktype: "maskType",
      maskunits: "maskUnits",
      mathematical: "mathematical",
      mode: "mode",
      numoctaves: "numOctaves",
      offset: "offset",
      opacity: "opacity",
      operator: "operator",
      order: "order",
      orient: "orient",
      orientation: "orientation",
      origin: "origin",
      overflow: "overflow",
      overlineposition: "overlinePosition",
      "overline-position": "overlinePosition",
      overlinethickness: "overlineThickness",
      "overline-thickness": "overlineThickness",
      paintorder: "paintOrder",
      "paint-order": "paintOrder",
      panose1: "panose1",
      "panose-1": "panose1",
      pathlength: "pathLength",
      patterncontentunits: "patternContentUnits",
      patterntransform: "patternTransform",
      patternunits: "patternUnits",
      pointerevents: "pointerEvents",
      "pointer-events": "pointerEvents",
      points: "points",
      pointsatx: "pointsAtX",
      pointsaty: "pointsAtY",
      pointsatz: "pointsAtZ",
      popover: "popover",
      popovertarget: "popoverTarget",
      popovertargetaction: "popoverTargetAction",
      prefix: "prefix",
      preservealpha: "preserveAlpha",
      preserveaspectratio: "preserveAspectRatio",
      primitiveunits: "primitiveUnits",
      property: "property",
      r: "r",
      radius: "radius",
      refx: "refX",
      refy: "refY",
      renderingintent: "renderingIntent",
      "rendering-intent": "renderingIntent",
      repeatcount: "repeatCount",
      repeatdur: "repeatDur",
      requiredextensions: "requiredExtensions",
      requiredfeatures: "requiredFeatures",
      resource: "resource",
      restart: "restart",
      result: "result",
      results: "results",
      rotate: "rotate",
      rx: "rx",
      ry: "ry",
      scale: "scale",
      security: "security",
      seed: "seed",
      shaperendering: "shapeRendering",
      "shape-rendering": "shapeRendering",
      slope: "slope",
      spacing: "spacing",
      specularconstant: "specularConstant",
      specularexponent: "specularExponent",
      speed: "speed",
      spreadmethod: "spreadMethod",
      startoffset: "startOffset",
      stddeviation: "stdDeviation",
      stemh: "stemh",
      stemv: "stemv",
      stitchtiles: "stitchTiles",
      stopcolor: "stopColor",
      "stop-color": "stopColor",
      stopopacity: "stopOpacity",
      "stop-opacity": "stopOpacity",
      strikethroughposition: "strikethroughPosition",
      "strikethrough-position": "strikethroughPosition",
      strikethroughthickness: "strikethroughThickness",
      "strikethrough-thickness": "strikethroughThickness",
      string: "string",
      stroke: "stroke",
      strokedasharray: "strokeDasharray",
      "stroke-dasharray": "strokeDasharray",
      strokedashoffset: "strokeDashoffset",
      "stroke-dashoffset": "strokeDashoffset",
      strokelinecap: "strokeLinecap",
      "stroke-linecap": "strokeLinecap",
      strokelinejoin: "strokeLinejoin",
      "stroke-linejoin": "strokeLinejoin",
      strokemiterlimit: "strokeMiterlimit",
      "stroke-miterlimit": "strokeMiterlimit",
      strokewidth: "strokeWidth",
      "stroke-width": "strokeWidth",
      strokeopacity: "strokeOpacity",
      "stroke-opacity": "strokeOpacity",
      suppresscontenteditablewarning: "suppressContentEditableWarning",
      suppresshydrationwarning: "suppressHydrationWarning",
      surfacescale: "surfaceScale",
      systemlanguage: "systemLanguage",
      tablevalues: "tableValues",
      targetx: "targetX",
      targety: "targetY",
      textanchor: "textAnchor",
      "text-anchor": "textAnchor",
      textdecoration: "textDecoration",
      "text-decoration": "textDecoration",
      textlength: "textLength",
      textrendering: "textRendering",
      "text-rendering": "textRendering",
      to: "to",
      transform: "transform",
      transformorigin: "transformOrigin",
      "transform-origin": "transformOrigin",
      typeof: "typeof",
      u1: "u1",
      u2: "u2",
      underlineposition: "underlinePosition",
      "underline-position": "underlinePosition",
      underlinethickness: "underlineThickness",
      "underline-thickness": "underlineThickness",
      unicode: "unicode",
      unicodebidi: "unicodeBidi",
      "unicode-bidi": "unicodeBidi",
      unicoderange: "unicodeRange",
      "unicode-range": "unicodeRange",
      unitsperem: "unitsPerEm",
      "units-per-em": "unitsPerEm",
      unselectable: "unselectable",
      valphabetic: "vAlphabetic",
      "v-alphabetic": "vAlphabetic",
      values: "values",
      vectoreffect: "vectorEffect",
      "vector-effect": "vectorEffect",
      version: "version",
      vertadvy: "vertAdvY",
      "vert-adv-y": "vertAdvY",
      vertoriginx: "vertOriginX",
      "vert-origin-x": "vertOriginX",
      vertoriginy: "vertOriginY",
      "vert-origin-y": "vertOriginY",
      vhanging: "vHanging",
      "v-hanging": "vHanging",
      videographic: "vIdeographic",
      "v-ideographic": "vIdeographic",
      viewbox: "viewBox",
      viewtarget: "viewTarget",
      visibility: "visibility",
      vmathematical: "vMathematical",
      "v-mathematical": "vMathematical",
      vocab: "vocab",
      widths: "widths",
      wordspacing: "wordSpacing",
      "word-spacing": "wordSpacing",
      writingmode: "writingMode",
      "writing-mode": "writingMode",
      x1: "x1",
      x2: "x2",
      x: "x",
      xchannelselector: "xChannelSelector",
      xheight: "xHeight",
      "x-height": "xHeight",
      xlinkactuate: "xlinkActuate",
      "xlink:actuate": "xlinkActuate",
      xlinkarcrole: "xlinkArcrole",
      "xlink:arcrole": "xlinkArcrole",
      xlinkhref: "xlinkHref",
      "xlink:href": "xlinkHref",
      xlinkrole: "xlinkRole",
      "xlink:role": "xlinkRole",
      xlinkshow: "xlinkShow",
      "xlink:show": "xlinkShow",
      xlinktitle: "xlinkTitle",
      "xlink:title": "xlinkTitle",
      xlinktype: "xlinkType",
      "xlink:type": "xlinkType",
      xmlbase: "xmlBase",
      "xml:base": "xmlBase",
      xmllang: "xmlLang",
      "xml:lang": "xmlLang",
      xmlns: "xmlns",
      "xml:space": "xmlSpace",
      xmlnsxlink: "xmlnsXlink",
      "xmlns:xlink": "xmlnsXlink",
      xmlspace: "xmlSpace",
      y1: "y1",
      y2: "y2",
      y: "y",
      ychannelselector: "yChannelSelector",
      z: "z",
      zoomandpan: "zoomAndPan"
    }, O = {
      "aria-current": 0,
      "aria-description": 0,
      "aria-details": 0,
      "aria-disabled": 0,
      "aria-hidden": 0,
      "aria-invalid": 0,
      "aria-keyshortcuts": 0,
      "aria-label": 0,
      "aria-roledescription": 0,
      "aria-autocomplete": 0,
      "aria-checked": 0,
      "aria-expanded": 0,
      "aria-haspopup": 0,
      "aria-level": 0,
      "aria-modal": 0,
      "aria-multiline": 0,
      "aria-multiselectable": 0,
      "aria-orientation": 0,
      "aria-placeholder": 0,
      "aria-pressed": 0,
      "aria-readonly": 0,
      "aria-required": 0,
      "aria-selected": 0,
      "aria-sort": 0,
      "aria-valuemax": 0,
      "aria-valuemin": 0,
      "aria-valuenow": 0,
      "aria-valuetext": 0,
      "aria-atomic": 0,
      "aria-busy": 0,
      "aria-live": 0,
      "aria-relevant": 0,
      "aria-dropeffect": 0,
      "aria-grabbed": 0,
      "aria-activedescendant": 0,
      "aria-colcount": 0,
      "aria-colindex": 0,
      "aria-colspan": 0,
      "aria-controls": 0,
      "aria-describedby": 0,
      "aria-errormessage": 0,
      "aria-flowto": 0,
      "aria-labelledby": 0,
      "aria-owns": 0,
      "aria-posinset": 0,
      "aria-rowcount": 0,
      "aria-rowindex": 0,
      "aria-rowspan": 0,
      "aria-setsize": 0,
      "aria-braillelabel": 0,
      "aria-brailleroledescription": 0,
      "aria-colindextext": 0,
      "aria-rowindextext": 0
    }, _ = {}, V = RegExp(
      "^(aria)-[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"
    ), k = RegExp(
      "^(aria)[A-Z][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"
    ), Bt = !1, F = {}, ct = /^on./, Fe = /^on[^A-Z]/, Xt = RegExp(
      "^(aria)-[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"
    ), Vi = RegExp(
      "^(aria)[A-Z][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"
    ), Cb = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i, vg = null, pm = null, Sm = null, Rb = !1, ji = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), Mb = !1;
    if (ji)
      try {
        var gg = {};
        Object.defineProperty(gg, "passive", {
          get: function() {
            Mb = !0;
          }
        }), window.addEventListener("test", gg, gg), window.removeEventListener("test", gg, gg);
      } catch {
        Mb = !1;
      }
    var Rs = null, _b = null, tS = null, Ms = {
      eventPhase: 0,
      bubbles: 0,
      cancelable: 0,
      timeStamp: function(t) {
        return t.timeStamp || Date.now();
      },
      defaultPrevented: 0,
      isTrusted: 0
    }, eS = pl(Ms), pg = pt({}, Ms, { view: 0, detail: 0 }), fE = pl(pg), Ub, Nb, Sg, lS = pt({}, pg, {
      screenX: 0,
      screenY: 0,
      clientX: 0,
      clientY: 0,
      pageX: 0,
      pageY: 0,
      ctrlKey: 0,
      shiftKey: 0,
      altKey: 0,
      metaKey: 0,
      getModifierState: ui,
      button: 0,
      buttons: 0,
      relatedTarget: function(t) {
        return t.relatedTarget === void 0 ? t.fromElement === t.srcElement ? t.toElement : t.fromElement : t.relatedTarget;
      },
      movementX: function(t) {
        return "movementX" in t ? t.movementX : (t !== Sg && (Sg && t.type === "mousemove" ? (Ub = t.screenX - Sg.screenX, Nb = t.screenY - Sg.screenY) : Nb = Ub = 0, Sg = t), Ub);
      },
      movementY: function(t) {
        return "movementY" in t ? t.movementY : Nb;
      }
    }), J2 = pl(lS), sE = pt({}, lS, { dataTransfer: 0 }), rE = pl(sE), dE = pt({}, pg, { relatedTarget: 0 }), Hb = pl(dE), hE = pt({}, Ms, {
      animationName: 0,
      elapsedTime: 0,
      pseudoElement: 0
    }), mE = pl(hE), yE = pt({}, Ms, {
      clipboardData: function(t) {
        return "clipboardData" in t ? t.clipboardData : window.clipboardData;
      }
    }), vE = pl(yE), gE = pt({}, Ms, { data: 0 }), K2 = pl(
      gE
    ), pE = K2, SE = {
      Esc: "Escape",
      Spacebar: " ",
      Left: "ArrowLeft",
      Up: "ArrowUp",
      Right: "ArrowRight",
      Down: "ArrowDown",
      Del: "Delete",
      Win: "OS",
      Menu: "ContextMenu",
      Apps: "ContextMenu",
      Scroll: "ScrollLock",
      MozPrintableKey: "Unidentified"
    }, bE = {
      8: "Backspace",
      9: "Tab",
      12: "Clear",
      13: "Enter",
      16: "Shift",
      17: "Control",
      18: "Alt",
      19: "Pause",
      20: "CapsLock",
      27: "Escape",
      32: " ",
      33: "PageUp",
      34: "PageDown",
      35: "End",
      36: "Home",
      37: "ArrowLeft",
      38: "ArrowUp",
      39: "ArrowRight",
      40: "ArrowDown",
      45: "Insert",
      46: "Delete",
      112: "F1",
      113: "F2",
      114: "F3",
      115: "F4",
      116: "F5",
      117: "F6",
      118: "F7",
      119: "F8",
      120: "F9",
      121: "F10",
      122: "F11",
      123: "F12",
      144: "NumLock",
      145: "ScrollLock",
      224: "Meta"
    }, TE = {
      Alt: "altKey",
      Control: "ctrlKey",
      Meta: "metaKey",
      Shift: "shiftKey"
    }, EE = pt({}, pg, {
      key: function(t) {
        if (t.key) {
          var e = SE[t.key] || t.key;
          if (e !== "Unidentified") return e;
        }
        return t.type === "keypress" ? (t = io(t), t === 13 ? "Enter" : String.fromCharCode(t)) : t.type === "keydown" || t.type === "keyup" ? bE[t.keyCode] || "Unidentified" : "";
      },
      code: 0,
      location: 0,
      ctrlKey: 0,
      shiftKey: 0,
      altKey: 0,
      metaKey: 0,
      repeat: 0,
      locale: 0,
      getModifierState: ui,
      charCode: function(t) {
        return t.type === "keypress" ? io(t) : 0;
      },
      keyCode: function(t) {
        return t.type === "keydown" || t.type === "keyup" ? t.keyCode : 0;
      },
      which: function(t) {
        return t.type === "keypress" ? io(t) : t.type === "keydown" || t.type === "keyup" ? t.keyCode : 0;
      }
    }), zE = pl(EE), AE = pt({}, lS, {
      pointerId: 0,
      width: 0,
      height: 0,
      pressure: 0,
      tangentialPressure: 0,
      tiltX: 0,
      tiltY: 0,
      twist: 0,
      pointerType: 0,
      isPrimary: 0
    }), $2 = pl(AE), OE = pt({}, Ms, { submitter: 0 }), DE = pl(OE), CE = pt({}, pg, {
      touches: 0,
      targetTouches: 0,
      changedTouches: 0,
      altKey: 0,
      metaKey: 0,
      ctrlKey: 0,
      shiftKey: 0,
      getModifierState: ui
    }), RE = pl(CE), ME = pt({}, Ms, {
      propertyName: 0,
      elapsedTime: 0,
      pseudoElement: 0
    }), _E = pl(ME), UE = pt({}, lS, {
      deltaX: function(t) {
        return "deltaX" in t ? t.deltaX : "wheelDeltaX" in t ? -t.wheelDeltaX : 0;
      },
      deltaY: function(t) {
        return "deltaY" in t ? t.deltaY : "wheelDeltaY" in t ? -t.wheelDeltaY : "wheelDelta" in t ? -t.wheelDelta : 0;
      },
      deltaZ: 0,
      deltaMode: 0
    }), NE = pl(UE), HE = pt({}, Ms, {
      newState: 0,
      oldState: 0,
      source: 0
    }), BE = pl(HE), xE = [9, 13, 27, 32], F2 = 229, Bb = ji && "CompositionEvent" in window, bg = null;
    ji && "documentMode" in document && (bg = document.documentMode);
    var YE = ji && "TextEvent" in window && !bg, W2 = ji && (!Bb || bg && 8 < bg && 11 >= bg), I2 = 32, k2 = String.fromCharCode(I2), P2 = !1, bm = !1, qE = {
      color: !0,
      date: !0,
      datetime: !0,
      "datetime-local": !0,
      email: !0,
      month: !0,
      number: !0,
      password: !0,
      range: !0,
      search: !0,
      tel: !0,
      text: !0,
      time: !0,
      url: !0,
      week: !0
    }, Tg = null, Eg = null, tT = !1;
    ji && (tT = hy("input") && (!document.documentMode || 9 < document.documentMode));
    var tn = typeof Object.is == "function" ? Object.is : bh, GE = ji && "documentMode" in document && 11 >= document.documentMode, Tm = null, xb = null, zg = null, Yb = !1, Em = {
      animationend: oo("Animation", "AnimationEnd"),
      animationiteration: oo("Animation", "AnimationIteration"),
      animationstart: oo("Animation", "AnimationStart"),
      transitionrun: oo("Transition", "TransitionRun"),
      transitionstart: oo("Transition", "TransitionStart"),
      transitioncancel: oo("Transition", "TransitionCancel"),
      transitionend: oo("Transition", "TransitionEnd")
    }, qb = {}, eT = {};
    ji && (eT = document.createElement("div").style, "AnimationEvent" in window || (delete Em.animationend.animation, delete Em.animationiteration.animation, delete Em.animationstart.animation), "TransitionEvent" in window || delete Em.transitionend.transition);
    var lT = fo("animationend"), aT = fo("animationiteration"), nT = fo("animationstart"), VE = fo("transitionrun"), jE = fo("transitionstart"), wE = fo("transitioncancel"), uT = fo("transitionend"), cT = /* @__PURE__ */ new Map(), Gb = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error fullscreenChange fullscreenError gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
      " "
    );
    Gb.push("scrollEnd");
    var XE = 0, iT = 0;
    if (typeof performance == "object" && typeof performance.now == "function")
      var QE = performance, oT = function() {
        return QE.now();
      };
    else {
      var ZE = Date;
      oT = function() {
        return ZE.now();
      };
    }
    var Vb = typeof reportError == "function" ? reportError : function(t) {
      if (typeof window == "object" && typeof window.ErrorEvent == "function") {
        var e = new window.ErrorEvent("error", {
          bubbles: !0,
          cancelable: !0,
          message: typeof t == "object" && t !== null && typeof t.message == "string" ? String(t.message) : String(t),
          error: t
        });
        if (!window.dispatchEvent(e)) return;
      } else if (typeof process == "object" && typeof process.emit == "function") {
        process.emit("uncaughtException", t);
        return;
      }
      console.error(t);
    }, LE = "This object has been omitted by React in the console log to avoid sending too much data from the server. Try logging smaller or more specific objects.", aS = 0, jb = 1, wb = 2, Xb = 3, Fu = 100, nS = "- ", uS = "+ ", fT = "  ", be = typeof console < "u" && typeof console.timeStamp == "function" && typeof performance < "u" && typeof performance.measure == "function", En = "Components ⚛", Nt = "Scheduler ⚛", xt = "Blocking", _s = !1, ef = {
      color: "primary",
      properties: null,
      tooltipText: "",
      track: En
    }, Us = {
      start: -0,
      end: -0,
      detail: { devtools: ef }
    }, JE = ["Changed Props", ""], sT = "This component received deeply equal props. It might benefit from useMemo or the React Compiler in its owner.", KE = ["Changed Props", sT], Ag = 1, lf = 2, Wu = [], zm = 0, Qb = 0, Ns = {};
    Object.freeze(Ns);
    var af = null, Am = null, rt = 0, $E = 1, zt = 2, Ba = 8, Zc = 16, rT = 32, dT = !1;
    try {
      var hT = Object.preventExtensions({});
    } catch {
      dT = !0;
    }
    var Zb = /* @__PURE__ */ new WeakMap(), Om = [], Dm = 0, cS = null, Og = 0, Iu = [], ku = 0, qd = null, nf = 1, uf = "", Xl = null, pe = null, At = !1, wi = !1, su = null, Hs = null, Pu = !1, Lb = Error(
      "Hydration Mismatch Exception: This is not a real error, and should not leak into userspace. If you're seeing this, it's likely a bug in React."
    ), Jb = Ye(null), Kb = Ye(null), mT = {}, iS = null, Cm = null, Rm = !1, FE = typeof AbortController < "u" ? AbortController : function() {
      var t = [], e = this.signal = {
        aborted: !1,
        addEventListener: function(a, c) {
          t.push(c);
        }
      };
      this.abort = function() {
        e.aborted = !0, t.forEach(function(a) {
          return a();
        });
      };
    }, WE = ee.unstable_scheduleCallback, IE = ee.unstable_NormalPriority, sl = {
      $$typeof: Sn,
      Consumer: null,
      Provider: null,
      _currentValue: null,
      _currentValue2: null,
      _threadCount: 0,
      _currentRenderer: null,
      _currentRenderer2: null
    }, Dg = null, al = ee.unstable_now, oS = console.createTask ? console.createTask : function() {
      return null;
    }, Cg = 1, fS = 2, Ql = -0, cf = -0, Lc = -0, of = null, en = -1.1, Gd = -0, Ne = -0, nt = -1.1, it = -1.1, Oe = null, we = !1, Bs = -0, Xi = -1.1, Rg = null, xs = 0, $b = null, Fb = null, Vd = -1.1, Mg = null, Mm = -1.1, sS = -1.1, Jc = -0, ff = -1.1, tc = -1.1, Wb = 0, _g = null, yT = null, vT = null, Ys = -1.1, jd = null, qs = -1.1, rS = -1.1, Ib = -0, kb = -0, wd = 0, zn = null, gT = 0, Ug = -1.1, dS = !1, hS = !1, Ng = null, Pb = 0, Gs = 0, _m = null, pT = x.S;
    x.S = function(t, e) {
      if (y3 = Ue(), typeof e == "object" && e !== null && typeof e.then == "function") {
        if (0 > ff && 0 > tc) {
          ff = al();
          var a = Hi(), c = qc();
          (a !== qs || c !== jd) && (qs = -1.1), Ys = a, jd = c;
        }
        Cy(t, e);
      }
      if (Dg !== null)
        for (a = Lm; a !== null; )
          hi(a, Dg), a = a.next;
      if (a = t.types, a !== null) {
        for (c = Lm; c !== null; )
          hi(c, a), c = c.next;
        if (Gs !== 0) {
          c = Dg, c === null && (c = Dg = []);
          for (var o = 0; o < a.length; o++) {
            var f = a[o];
            c.indexOf(f) === -1 && c.push(f);
          }
        }
      }
      pT !== null && pT(t, e);
    };
    var Xd = Ye(null), Kc = {
      recordUnsafeLifecycleWarnings: function() {
      },
      flushPendingUnsafeLifecycleWarnings: function() {
      },
      recordLegacyContextWarning: function() {
      },
      flushLegacyContextWarning: function() {
      },
      discardPendingWarnings: function() {
      }
    }, Hg = [], Bg = [], xg = [], Yg = [], qg = [], Gg = [], Qd = /* @__PURE__ */ new Set();
    Kc.recordUnsafeLifecycleWarnings = function(t, e) {
      Qd.has(t.type) || (typeof e.componentWillMount == "function" && e.componentWillMount.__suppressDeprecationWarning !== !0 && Hg.push(t), t.mode & Ba && typeof e.UNSAFE_componentWillMount == "function" && Bg.push(t), typeof e.componentWillReceiveProps == "function" && e.componentWillReceiveProps.__suppressDeprecationWarning !== !0 && xg.push(t), t.mode & Ba && typeof e.UNSAFE_componentWillReceiveProps == "function" && Yg.push(t), typeof e.componentWillUpdate == "function" && e.componentWillUpdate.__suppressDeprecationWarning !== !0 && qg.push(t), t.mode & Ba && typeof e.UNSAFE_componentWillUpdate == "function" && Gg.push(t));
    }, Kc.flushPendingUnsafeLifecycleWarnings = function() {
      var t = /* @__PURE__ */ new Set();
      0 < Hg.length && (Hg.forEach(function(h) {
        t.add(
          tt(h) || "Component"
        ), Qd.add(h.type);
      }), Hg = []);
      var e = /* @__PURE__ */ new Set();
      0 < Bg.length && (Bg.forEach(function(h) {
        e.add(
          tt(h) || "Component"
        ), Qd.add(h.type);
      }), Bg = []);
      var a = /* @__PURE__ */ new Set();
      0 < xg.length && (xg.forEach(function(h) {
        a.add(
          tt(h) || "Component"
        ), Qd.add(h.type);
      }), xg = []);
      var c = /* @__PURE__ */ new Set();
      0 < Yg.length && (Yg.forEach(
        function(h) {
          c.add(
            tt(h) || "Component"
          ), Qd.add(h.type);
        }
      ), Yg = []);
      var o = /* @__PURE__ */ new Set();
      0 < qg.length && (qg.forEach(function(h) {
        o.add(
          tt(h) || "Component"
        ), Qd.add(h.type);
      }), qg = []);
      var f = /* @__PURE__ */ new Set();
      if (0 < Gg.length && (Gg.forEach(function(h) {
        f.add(
          tt(h) || "Component"
        ), Qd.add(h.type);
      }), Gg = []), 0 < e.size) {
        var d = Yt(
          e
        );
        console.error(
          `Using UNSAFE_componentWillMount in strict mode is not recommended and may indicate bugs in your code. See https://react.dev/link/unsafe-component-lifecycles for details.

* Move code with side effects to componentDidMount, and set initial state in the constructor.

Please update the following components: %s`,
          d
        );
      }
      0 < c.size && (d = Yt(
        c
      ), console.error(
        `Using UNSAFE_componentWillReceiveProps in strict mode is not recommended and may indicate bugs in your code. See https://react.dev/link/unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.
* If you're updating state whenever props change, refactor your code to use memoization techniques or move it to static getDerivedStateFromProps. Learn more at: https://react.dev/link/derived-state

Please update the following components: %s`,
        d
      )), 0 < f.size && (d = Yt(
        f
      ), console.error(
        `Using UNSAFE_componentWillUpdate in strict mode is not recommended and may indicate bugs in your code. See https://react.dev/link/unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.

Please update the following components: %s`,
        d
      )), 0 < t.size && (d = Yt(t), console.warn(
        `componentWillMount has been renamed, and is not recommended for use. See https://react.dev/link/unsafe-component-lifecycles for details.

* Move code with side effects to componentDidMount, and set initial state in the constructor.
* Rename componentWillMount to UNSAFE_componentWillMount to suppress this warning in non-strict mode. In React 18.x, only the UNSAFE_ name will work. To rename all deprecated lifecycles to their new names, you can run \`npx react-codemod rename-unsafe-lifecycles\` in your project source folder.

Please update the following components: %s`,
        d
      )), 0 < a.size && (d = Yt(
        a
      ), console.warn(
        `componentWillReceiveProps has been renamed, and is not recommended for use. See https://react.dev/link/unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.
* If you're updating state whenever props change, refactor your code to use memoization techniques or move it to static getDerivedStateFromProps. Learn more at: https://react.dev/link/derived-state
* Rename componentWillReceiveProps to UNSAFE_componentWillReceiveProps to suppress this warning in non-strict mode. In React 18.x, only the UNSAFE_ name will work. To rename all deprecated lifecycles to their new names, you can run \`npx react-codemod rename-unsafe-lifecycles\` in your project source folder.

Please update the following components: %s`,
        d
      )), 0 < o.size && (d = Yt(o), console.warn(
        `componentWillUpdate has been renamed, and is not recommended for use. See https://react.dev/link/unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.
* Rename componentWillUpdate to UNSAFE_componentWillUpdate to suppress this warning in non-strict mode. In React 18.x, only the UNSAFE_ name will work. To rename all deprecated lifecycles to their new names, you can run \`npx react-codemod rename-unsafe-lifecycles\` in your project source folder.

Please update the following components: %s`,
        d
      ));
    };
    var mS = /* @__PURE__ */ new Map(), ST = /* @__PURE__ */ new Set();
    Kc.recordLegacyContextWarning = function(t, e) {
      for (var a = null, c = t; c !== null; )
        c.mode & Ba && (a = c), c = c.return;
      a === null ? console.error(
        "Expected to find a StrictMode component in a strict mode tree. This error is likely caused by a bug in React. Please file an issue."
      ) : !ST.has(t.type) && (c = mS.get(a), t.type.contextTypes != null || t.type.childContextTypes != null || e !== null && typeof e.getChildContext == "function") && (c === void 0 && (c = [], mS.set(a, c)), c.push(t));
    }, Kc.flushLegacyContextWarning = function() {
      mS.forEach(function(t) {
        if (t.length !== 0) {
          var e = t[0], a = /* @__PURE__ */ new Set();
          t.forEach(function(o) {
            a.add(tt(o) || "Component"), ST.add(o.type);
          });
          var c = Yt(a);
          $(e, function() {
            console.error(
              `Legacy context API has been detected within a strict-mode tree.

The old API will be supported in all 16.x releases, but applications using it should migrate to the new version.

Please update the following components: %s

Learn more about this warning here: https://react.dev/link/legacy-context`,
              c
            );
          });
        }
      });
    }, Kc.discardPendingWarnings = function() {
      Hg = [], Bg = [], xg = [], Yg = [], qg = [], Gg = [], mS = /* @__PURE__ */ new Map();
    };
    var kE = "", bT = {
      react_stack_bottom_frame: function(t, e, a) {
        var c = bn;
        bn = !0;
        try {
          return t(e, a);
        } finally {
          bn = c;
        }
      }
    }, t2 = bT.react_stack_bottom_frame.bind(bT), TT = {
      react_stack_bottom_frame: function(t) {
        var e = bn;
        bn = !0;
        try {
          return t.render();
        } finally {
          bn = e;
        }
      }
    }, ET = TT.react_stack_bottom_frame.bind(TT), zT = {
      react_stack_bottom_frame: function(t, e) {
        try {
          e.componentDidMount();
        } catch (a) {
          at(t, t.return, a);
        }
      }
    }, e2 = zT.react_stack_bottom_frame.bind(
      zT
    ), AT = {
      react_stack_bottom_frame: function(t, e, a, c, o) {
        try {
          e.componentDidUpdate(a, c, o);
        } catch (f) {
          at(t, t.return, f);
        }
      }
    }, OT = AT.react_stack_bottom_frame.bind(
      AT
    ), DT = {
      react_stack_bottom_frame: function(t, e) {
        var a = e.stack;
        t.componentDidCatch(e.value, {
          componentStack: a !== null ? a : ""
        });
      }
    }, PE = DT.react_stack_bottom_frame.bind(
      DT
    ), CT = {
      react_stack_bottom_frame: function(t, e, a) {
        try {
          a.componentWillUnmount();
        } catch (c) {
          at(t, e, c);
        }
      }
    }, RT = CT.react_stack_bottom_frame.bind(
      CT
    ), MT = {
      react_stack_bottom_frame: function(t) {
        var e = t.create;
        return t = t.inst, e = e(), t.destroy = e;
      }
    }, t4 = MT.react_stack_bottom_frame.bind(MT), _T = {
      react_stack_bottom_frame: function(t, e, a) {
        try {
          a();
        } catch (c) {
          at(t, e, c);
        }
      }
    }, e4 = _T.react_stack_bottom_frame.bind(_T), UT = {
      react_stack_bottom_frame: function(t) {
        var e = t._init;
        return e(t._payload);
      }
    }, l4 = UT.react_stack_bottom_frame.bind(UT), Um = Error(
      "Suspense Exception: This is not a real error! It's an implementation detail of `use` to interrupt the current render. You must either rethrow it immediately, or move the `use` call outside of the `try/catch` block. Capturing without rethrowing will lead to unexpected behavior.\n\nTo handle async errors, wrap your component in an error boundary, or call the promise's `.catch` method and pass the result to `use`."
    ), l2 = Error(
      "Suspense Exception: This is not a real error, and should not leak into userspace. If you're seeing this, it's likely a bug in React."
    ), yS = Error(
      "Suspense Exception: This is not a real error! It's an implementation detail of `useActionState` to interrupt the current render. You must either rethrow it immediately, or move the `useActionState` call outside of the `try/catch` block. Capturing without rethrowing will lead to unexpected behavior.\n\nTo handle async errors, wrap your component in an error boundary."
    ), vS = {
      then: function() {
        console.error(
          'Internal React error: A listener was unexpectedly attached to a "noop" thenable. This is a bug in React. Please file an issue.'
        );
      }
    }, Zd = null, gS = null, a2 = !1, Ld = null, Vg = !1, Nm = null, jg = 0, Ht = null, n2, NT = n2 = !1, HT = {}, BT = {}, xT = {};
    Wi = function(t, e, a) {
      if (a !== null && typeof a == "object" && a._store && (!a._store.validated && a.key == null || a._store.validated === 2)) {
        if (typeof a._store != "object")
          throw Error(
            "React Component in warnForMissingKey should have a _store. This error is likely caused by a bug in React. Please file an issue."
          );
        a._store.validated = 1;
        var c = tt(t), o = c || "null";
        if (!HT[o]) {
          HT[o] = !0, a = a._owner, t = t._debugOwner;
          var f = "";
          t && typeof t.tag == "number" && (o = tt(t)) && (f = `

Check the render method of \`` + o + "`."), f || c && (f = `

Check the top-level render call using <` + c + ">.");
          var d = "";
          a != null && t !== a && (c = null, typeof a.tag == "number" ? c = tt(a) : typeof a.name == "string" && (c = a.name), c && (d = " It was passed a child from " + c + ".")), $(e, function() {
            console.error(
              'Each child in a list should have a unique "key" prop.%s%s See https://react.dev/link/warning-keys for more information.',
              f,
              d
            );
          });
        }
      }
    };
    var Jd = Xn(!0), YT = Xn(!1), qT = 0, GT = 1, VT = 2, u2 = 3, Vs = !1, jT = !1, c2 = null, i2 = !1, js = Ye(null), pS = Ye(0), da = Ye(null), xa = null, Hm = 1, wg = 2, ha = Ye(0), Xg = 0, ec = 1, ln = 2, ru = 4, Ya = 8, Bm, wT = /* @__PURE__ */ new Set(), XT = /* @__PURE__ */ new Set(), o2 = /* @__PURE__ */ new Set(), QT = /* @__PURE__ */ new Set(), sf = 0, ht = null, me = null, rl = null, SS = !1, xm = !1, Kd = !1, bS = 0, Qg = 0, Qi = null, a4 = 0, n4 = 25, H = null, lc = null, rf = -1, Zg = !1, TS = {
      readContext: se,
      use: pi,
      useCallback: ve,
      useContext: ve,
      useEffect: ve,
      useImperativeHandle: ve,
      useLayoutEffect: ve,
      useInsertionEffect: ve,
      useMemo: ve,
      useReducer: ve,
      useRef: ve,
      useState: ve,
      useDebugValue: ve,
      useDeferredValue: ve,
      useTransition: ve,
      useSyncExternalStore: ve,
      useId: ve,
      useHostTransitionStatus: ve,
      useFormState: ve,
      useActionState: ve,
      useOptimistic: ve,
      useMemoCache: ve,
      useCacheRefresh: ve,
      useEffectEvent: ve
    }, f2 = null, ZT = null, s2 = null, LT = null, Zi = null, $c = null, ES = null;
    f2 = {
      readContext: function(t) {
        return se(t);
      },
      use: pi,
      useCallback: function(t, e) {
        return H = "useCallback", st(), gi(e), Qf(t, e);
      },
      useContext: function(t) {
        return H = "useContext", st(), se(t);
      },
      useEffect: function(t, e) {
        return H = "useEffect", st(), gi(e), zi(t, e);
      },
      useImperativeHandle: function(t, e, a) {
        return H = "useImperativeHandle", st(), gi(a), Jh(t, e, a);
      },
      useInsertionEffect: function(t, e) {
        H = "useInsertionEffect", st(), gi(e), Ea(4, ln, t, e);
      },
      useLayoutEffect: function(t, e) {
        return H = "useLayoutEffect", st(), gi(e), Eo(t, e);
      },
      useMemo: function(t, e) {
        H = "useMemo", st(), gi(e);
        var a = x.H;
        x.H = Zi;
        try {
          return xr(t, e);
        } finally {
          x.H = a;
        }
      },
      useReducer: function(t, e, a) {
        H = "useReducer", st();
        var c = x.H;
        x.H = Zi;
        try {
          return Dc(t, e, a);
        } finally {
          x.H = c;
        }
      },
      useRef: function(t) {
        return H = "useRef", st(), Nr(t);
      },
      useState: function(t) {
        H = "useState", st();
        var e = x.H;
        x.H = Zi;
        try {
          return wf(t);
        } finally {
          x.H = e;
        }
      },
      useDebugValue: function() {
        H = "useDebugValue", st();
      },
      useDeferredValue: function(t, e) {
        return H = "useDeferredValue", st(), Pe(t, e);
      },
      useTransition: function() {
        return H = "useTransition", st(), Jf();
      },
      useSyncExternalStore: function(t, e, a) {
        return H = "useSyncExternalStore", st(), Uy(
          t,
          e,
          a
        );
      },
      useId: function() {
        return H = "useId", st(), Re();
      },
      useFormState: function(t, e) {
        return H = "useFormState", st(), Hu(), Rc(t, e);
      },
      useActionState: function(t, e) {
        return H = "useActionState", st(), Rc(t, e);
      },
      useOptimistic: function(t) {
        return H = "useOptimistic", st(), Xf(t);
      },
      useHostTransitionStatus: wt,
      useMemoCache: Fn,
      useCacheRefresh: function() {
        return H = "useCacheRefresh", st(), Kf();
      },
      useEffectEvent: function(t) {
        return H = "useEffectEvent", st(), Hr(t);
      }
    }, ZT = {
      readContext: function(t) {
        return se(t);
      },
      use: pi,
      useCallback: function(t, e) {
        return H = "useCallback", w(), Qf(t, e);
      },
      useContext: function(t) {
        return H = "useContext", w(), se(t);
      },
      useEffect: function(t, e) {
        return H = "useEffect", w(), zi(t, e);
      },
      useImperativeHandle: function(t, e, a) {
        return H = "useImperativeHandle", w(), Jh(t, e, a);
      },
      useInsertionEffect: function(t, e) {
        H = "useInsertionEffect", w(), Ea(4, ln, t, e);
      },
      useLayoutEffect: function(t, e) {
        return H = "useLayoutEffect", w(), Eo(t, e);
      },
      useMemo: function(t, e) {
        H = "useMemo", w();
        var a = x.H;
        x.H = Zi;
        try {
          return xr(t, e);
        } finally {
          x.H = a;
        }
      },
      useReducer: function(t, e, a) {
        H = "useReducer", w();
        var c = x.H;
        x.H = Zi;
        try {
          return Dc(t, e, a);
        } finally {
          x.H = c;
        }
      },
      useRef: function(t) {
        return H = "useRef", w(), Nr(t);
      },
      useState: function(t) {
        H = "useState", w();
        var e = x.H;
        x.H = Zi;
        try {
          return wf(t);
        } finally {
          x.H = e;
        }
      },
      useDebugValue: function() {
        H = "useDebugValue", w();
      },
      useDeferredValue: function(t, e) {
        return H = "useDeferredValue", w(), Pe(t, e);
      },
      useTransition: function() {
        return H = "useTransition", w(), Jf();
      },
      useSyncExternalStore: function(t, e, a) {
        return H = "useSyncExternalStore", w(), Uy(
          t,
          e,
          a
        );
      },
      useId: function() {
        return H = "useId", w(), Re();
      },
      useActionState: function(t, e) {
        return H = "useActionState", w(), Rc(t, e);
      },
      useFormState: function(t, e) {
        return H = "useFormState", w(), Hu(), Rc(t, e);
      },
      useOptimistic: function(t) {
        return H = "useOptimistic", w(), Xf(t);
      },
      useHostTransitionStatus: wt,
      useMemoCache: Fn,
      useCacheRefresh: function() {
        return H = "useCacheRefresh", w(), Kf();
      },
      useEffectEvent: function(t) {
        return H = "useEffectEvent", w(), Hr(t);
      }
    }, s2 = {
      readContext: function(t) {
        return se(t);
      },
      use: pi,
      useCallback: function(t, e) {
        return H = "useCallback", w(), Br(t, e);
      },
      useContext: function(t) {
        return H = "useContext", w(), se(t);
      },
      useEffect: function(t, e) {
        H = "useEffect", w(), Ve(2048, Ya, t, e);
      },
      useImperativeHandle: function(t, e, a) {
        return H = "useImperativeHandle", w(), kn(t, e, a);
      },
      useInsertionEffect: function(t, e) {
        return H = "useInsertionEffect", w(), Ve(4, ln, t, e);
      },
      useLayoutEffect: function(t, e) {
        return H = "useLayoutEffect", w(), Ve(4, ru, t, e);
      },
      useMemo: function(t, e) {
        H = "useMemo", w();
        var a = x.H;
        x.H = $c;
        try {
          return Zf(t, e);
        } finally {
          x.H = a;
        }
      },
      useReducer: function(t, e, a) {
        H = "useReducer", w();
        var c = x.H;
        x.H = $c;
        try {
          return Wn(t, e, a);
        } finally {
          x.H = c;
        }
      },
      useRef: function() {
        return H = "useRef", w(), jt().memoizedState;
      },
      useState: function() {
        H = "useState", w();
        var t = x.H;
        x.H = $c;
        try {
          return Wn(Wa);
        } finally {
          x.H = t;
        }
      },
      useDebugValue: function() {
        H = "useDebugValue", w();
      },
      useDeferredValue: function(t, e) {
        return H = "useDeferredValue", w(), Tl(t, e);
      },
      useTransition: function() {
        return H = "useTransition", w(), Bu();
      },
      useSyncExternalStore: function(t, e, a) {
        return H = "useSyncExternalStore", w(), Cr(
          t,
          e,
          a
        );
      },
      useId: function() {
        return H = "useId", w(), jt().memoizedState;
      },
      useFormState: function(t) {
        return H = "useFormState", w(), Hu(), Ur(t);
      },
      useActionState: function(t) {
        return H = "useActionState", w(), Ur(t);
      },
      useOptimistic: function(t, e) {
        return H = "useOptimistic", w(), Hy(t, e);
      },
      useHostTransitionStatus: wt,
      useMemoCache: Fn,
      useCacheRefresh: function() {
        return H = "useCacheRefresh", w(), jt().memoizedState;
      },
      useEffectEvent: function(t) {
        return H = "useEffectEvent", w(), Ai(t);
      }
    }, LT = {
      readContext: function(t) {
        return se(t);
      },
      use: pi,
      useCallback: function(t, e) {
        return H = "useCallback", w(), Br(t, e);
      },
      useContext: function(t) {
        return H = "useContext", w(), se(t);
      },
      useEffect: function(t, e) {
        H = "useEffect", w(), Ve(2048, Ya, t, e);
      },
      useImperativeHandle: function(t, e, a) {
        return H = "useImperativeHandle", w(), kn(t, e, a);
      },
      useInsertionEffect: function(t, e) {
        return H = "useInsertionEffect", w(), Ve(4, ln, t, e);
      },
      useLayoutEffect: function(t, e) {
        return H = "useLayoutEffect", w(), Ve(4, ru, t, e);
      },
      useMemo: function(t, e) {
        H = "useMemo", w();
        var a = x.H;
        x.H = ES;
        try {
          return Zf(t, e);
        } finally {
          x.H = a;
        }
      },
      useReducer: function(t, e, a) {
        H = "useReducer", w();
        var c = x.H;
        x.H = ES;
        try {
          return jf(t, e, a);
        } finally {
          x.H = c;
        }
      },
      useRef: function() {
        return H = "useRef", w(), jt().memoizedState;
      },
      useState: function() {
        H = "useState", w();
        var t = x.H;
        x.H = ES;
        try {
          return jf(Wa);
        } finally {
          x.H = t;
        }
      },
      useDebugValue: function() {
        H = "useDebugValue", w();
      },
      useDeferredValue: function(t, e) {
        return H = "useDeferredValue", w(), Mc(t, e);
      },
      useTransition: function() {
        return H = "useTransition", w(), gt();
      },
      useSyncExternalStore: function(t, e, a) {
        return H = "useSyncExternalStore", w(), Cr(
          t,
          e,
          a
        );
      },
      useId: function() {
        return H = "useId", w(), jt().memoizedState;
      },
      useFormState: function(t) {
        return H = "useFormState", w(), Hu(), In(t);
      },
      useActionState: function(t) {
        return H = "useActionState", w(), In(t);
      },
      useOptimistic: function(t, e) {
        return H = "useOptimistic", w(), bi(t, e);
      },
      useHostTransitionStatus: wt,
      useMemoCache: Fn,
      useCacheRefresh: function() {
        return H = "useCacheRefresh", w(), jt().memoizedState;
      },
      useEffectEvent: function(t) {
        return H = "useEffectEvent", w(), Ai(t);
      }
    }, Zi = {
      readContext: function(t) {
        return ml(), se(t);
      },
      use: function(t) {
        return W(), pi(t);
      },
      useCallback: function(t, e) {
        return H = "useCallback", W(), st(), Qf(t, e);
      },
      useContext: function(t) {
        return H = "useContext", W(), st(), se(t);
      },
      useEffect: function(t, e) {
        return H = "useEffect", W(), st(), zi(t, e);
      },
      useImperativeHandle: function(t, e, a) {
        return H = "useImperativeHandle", W(), st(), Jh(t, e, a);
      },
      useInsertionEffect: function(t, e) {
        H = "useInsertionEffect", W(), st(), Ea(4, ln, t, e);
      },
      useLayoutEffect: function(t, e) {
        return H = "useLayoutEffect", W(), st(), Eo(t, e);
      },
      useMemo: function(t, e) {
        H = "useMemo", W(), st();
        var a = x.H;
        x.H = Zi;
        try {
          return xr(t, e);
        } finally {
          x.H = a;
        }
      },
      useReducer: function(t, e, a) {
        H = "useReducer", W(), st();
        var c = x.H;
        x.H = Zi;
        try {
          return Dc(t, e, a);
        } finally {
          x.H = c;
        }
      },
      useRef: function(t) {
        return H = "useRef", W(), st(), Nr(t);
      },
      useState: function(t) {
        H = "useState", W(), st();
        var e = x.H;
        x.H = Zi;
        try {
          return wf(t);
        } finally {
          x.H = e;
        }
      },
      useDebugValue: function() {
        H = "useDebugValue", W(), st();
      },
      useDeferredValue: function(t, e) {
        return H = "useDeferredValue", W(), st(), Pe(t, e);
      },
      useTransition: function() {
        return H = "useTransition", W(), st(), Jf();
      },
      useSyncExternalStore: function(t, e, a) {
        return H = "useSyncExternalStore", W(), st(), Uy(
          t,
          e,
          a
        );
      },
      useId: function() {
        return H = "useId", W(), st(), Re();
      },
      useFormState: function(t, e) {
        return H = "useFormState", W(), st(), Rc(t, e);
      },
      useActionState: function(t, e) {
        return H = "useActionState", W(), st(), Rc(t, e);
      },
      useOptimistic: function(t) {
        return H = "useOptimistic", W(), st(), Xf(t);
      },
      useMemoCache: function(t) {
        return W(), Fn(t);
      },
      useHostTransitionStatus: wt,
      useCacheRefresh: function() {
        return H = "useCacheRefresh", st(), Kf();
      },
      useEffectEvent: function(t) {
        return H = "useEffectEvent", W(), st(), Hr(t);
      }
    }, $c = {
      readContext: function(t) {
        return ml(), se(t);
      },
      use: function(t) {
        return W(), pi(t);
      },
      useCallback: function(t, e) {
        return H = "useCallback", W(), w(), Br(t, e);
      },
      useContext: function(t) {
        return H = "useContext", W(), w(), se(t);
      },
      useEffect: function(t, e) {
        H = "useEffect", W(), w(), Ve(2048, Ya, t, e);
      },
      useImperativeHandle: function(t, e, a) {
        return H = "useImperativeHandle", W(), w(), kn(t, e, a);
      },
      useInsertionEffect: function(t, e) {
        return H = "useInsertionEffect", W(), w(), Ve(4, ln, t, e);
      },
      useLayoutEffect: function(t, e) {
        return H = "useLayoutEffect", W(), w(), Ve(4, ru, t, e);
      },
      useMemo: function(t, e) {
        H = "useMemo", W(), w();
        var a = x.H;
        x.H = $c;
        try {
          return Zf(t, e);
        } finally {
          x.H = a;
        }
      },
      useReducer: function(t, e, a) {
        H = "useReducer", W(), w();
        var c = x.H;
        x.H = $c;
        try {
          return Wn(t, e, a);
        } finally {
          x.H = c;
        }
      },
      useRef: function() {
        return H = "useRef", W(), w(), jt().memoizedState;
      },
      useState: function() {
        H = "useState", W(), w();
        var t = x.H;
        x.H = $c;
        try {
          return Wn(Wa);
        } finally {
          x.H = t;
        }
      },
      useDebugValue: function() {
        H = "useDebugValue", W(), w();
      },
      useDeferredValue: function(t, e) {
        return H = "useDeferredValue", W(), w(), Tl(t, e);
      },
      useTransition: function() {
        return H = "useTransition", W(), w(), Bu();
      },
      useSyncExternalStore: function(t, e, a) {
        return H = "useSyncExternalStore", W(), w(), Cr(
          t,
          e,
          a
        );
      },
      useId: function() {
        return H = "useId", W(), w(), jt().memoizedState;
      },
      useFormState: function(t) {
        return H = "useFormState", W(), w(), Ur(t);
      },
      useActionState: function(t) {
        return H = "useActionState", W(), w(), Ur(t);
      },
      useOptimistic: function(t, e) {
        return H = "useOptimistic", W(), w(), Hy(t, e);
      },
      useMemoCache: function(t) {
        return W(), Fn(t);
      },
      useHostTransitionStatus: wt,
      useCacheRefresh: function() {
        return H = "useCacheRefresh", w(), jt().memoizedState;
      },
      useEffectEvent: function(t) {
        return H = "useEffectEvent", W(), w(), Ai(t);
      }
    }, ES = {
      readContext: function(t) {
        return ml(), se(t);
      },
      use: function(t) {
        return W(), pi(t);
      },
      useCallback: function(t, e) {
        return H = "useCallback", W(), w(), Br(t, e);
      },
      useContext: function(t) {
        return H = "useContext", W(), w(), se(t);
      },
      useEffect: function(t, e) {
        H = "useEffect", W(), w(), Ve(2048, Ya, t, e);
      },
      useImperativeHandle: function(t, e, a) {
        return H = "useImperativeHandle", W(), w(), kn(t, e, a);
      },
      useInsertionEffect: function(t, e) {
        return H = "useInsertionEffect", W(), w(), Ve(4, ln, t, e);
      },
      useLayoutEffect: function(t, e) {
        return H = "useLayoutEffect", W(), w(), Ve(4, ru, t, e);
      },
      useMemo: function(t, e) {
        H = "useMemo", W(), w();
        var a = x.H;
        x.H = $c;
        try {
          return Zf(t, e);
        } finally {
          x.H = a;
        }
      },
      useReducer: function(t, e, a) {
        H = "useReducer", W(), w();
        var c = x.H;
        x.H = $c;
        try {
          return jf(t, e, a);
        } finally {
          x.H = c;
        }
      },
      useRef: function() {
        return H = "useRef", W(), w(), jt().memoizedState;
      },
      useState: function() {
        H = "useState", W(), w();
        var t = x.H;
        x.H = $c;
        try {
          return jf(Wa);
        } finally {
          x.H = t;
        }
      },
      useDebugValue: function() {
        H = "useDebugValue", W(), w();
      },
      useDeferredValue: function(t, e) {
        return H = "useDeferredValue", W(), w(), Mc(t, e);
      },
      useTransition: function() {
        return H = "useTransition", W(), w(), gt();
      },
      useSyncExternalStore: function(t, e, a) {
        return H = "useSyncExternalStore", W(), w(), Cr(
          t,
          e,
          a
        );
      },
      useId: function() {
        return H = "useId", W(), w(), jt().memoizedState;
      },
      useFormState: function(t) {
        return H = "useFormState", W(), w(), In(t);
      },
      useActionState: function(t) {
        return H = "useActionState", W(), w(), In(t);
      },
      useOptimistic: function(t, e) {
        return H = "useOptimistic", W(), w(), bi(t, e);
      },
      useMemoCache: function(t) {
        return W(), Fn(t);
      },
      useHostTransitionStatus: wt,
      useCacheRefresh: function() {
        return H = "useCacheRefresh", w(), jt().memoizedState;
      },
      useEffectEvent: function(t) {
        return H = "useEffectEvent", W(), w(), Ai(t);
      }
    };
    var JT = {}, KT = /* @__PURE__ */ new Set(), $T = /* @__PURE__ */ new Set(), FT = /* @__PURE__ */ new Set(), WT = /* @__PURE__ */ new Set(), IT = /* @__PURE__ */ new Set(), kT = /* @__PURE__ */ new Set(), PT = /* @__PURE__ */ new Set(), t3 = /* @__PURE__ */ new Set(), e3 = /* @__PURE__ */ new Set(), l3 = /* @__PURE__ */ new Set();
    Object.freeze(JT);
    var r2 = {
      enqueueSetState: function(t, e, a) {
        t = t._reactInternals;
        var c = na(t), o = Ln(c);
        o.payload = e, a != null && (Gr(a), o.callback = a), e = Nu(t, o, c), e !== null && (Gn(c, "this.setState()", t), ge(e, t, c), Gf(e, t, c));
      },
      enqueueReplaceState: function(t, e, a) {
        t = t._reactInternals;
        var c = na(t), o = Ln(c);
        o.tag = GT, o.payload = e, a != null && (Gr(a), o.callback = a), e = Nu(t, o, c), e !== null && (Gn(c, "this.replaceState()", t), ge(e, t, c), Gf(e, t, c));
      },
      enqueueForceUpdate: function(t, e) {
        t = t._reactInternals;
        var a = na(t), c = Ln(a);
        c.tag = VT, e != null && (Gr(e), c.callback = e), e = Nu(t, c, a), e !== null && (Gn(a, "this.forceUpdate()", t), ge(e, t, a), Gf(e, t, a));
      }
    }, Ym = null, d2 = null, h2 = Error(
      "This is not a real error. It's an implementation detail of React's selective hydration feature. If this leaks into userspace, it's a bug in React. Please file an issue."
    ), nl = !1, a3 = {}, n3 = {}, u3 = {}, c3 = {}, qm = !1, i3 = {}, m2 = {}, o3 = {}, y2 = {
      dehydrated: null,
      treeContext: null,
      retryLane: 0,
      hydrationErrors: null
    }, f3 = !1, s3 = null;
    s3 = /* @__PURE__ */ new Set();
    var zS = !1, du = null, Li = null, An = 0, AS = /* @__PURE__ */ new Map(), r3 = {}, Lg = 0, v2 = 1, OS = 2, Zl = !1, ie = !1, Ji = !1, g2 = !1, d3 = typeof WeakSet == "function" ? WeakSet : Set, Ll = null, Gm = null, Vm = null, Ki = !1, Jg = !1, DS = !1, p2 = !1, dl = null, On = !1, Fc = null, Ol = !1, $d = 8192, u4 = {
      getCacheForType: function(t) {
        var e = se(sl), a = e.data.get(t);
        return a === void 0 && (a = t(), e.data.set(t, a)), a;
      },
      cacheSignal: function() {
        return se(sl).controller.signal;
      },
      getOwner: function() {
        return jl;
      }
    };
    if (typeof Symbol == "function" && Symbol.for) {
      var Kg = Symbol.for;
      Kg("selector.component"), Kg("selector.has_pseudo_class"), Kg("selector.role"), Kg("selector.test_id"), Kg("selector.text");
    }
    var c4 = [], i4 = typeof WeakMap == "function" ? WeakMap : Map, Jl = 0, Dl = 2, hu = 4, df = 0, $g = 1, Fd = 2, CS = 3, ws = 4, Fg = 6, h3 = 5, Zt = Jl, ye = null, Ct = null, St = 0, Dn = 0, RS = 1, Wd = 2, Wg = 3, m3 = 4, S2 = 5, Ig = 6, MS = 7, b2 = 8, Id = 9, oe = Dn, mu = null, hf = !1, jm = !1, T2 = !1, $i = 0, He = df, Xs = 0, Qs = 0, _S = 0, Cn = 0, kd = 0, kg = null, an = null, US = !1, NS = 0, y3 = 0, v3 = 300, HS = 1 / 0, g3 = 500, Pg = null, Xe = null, Zs = null, BS = 0, t1 = 1, E2 = 2, p3 = 3, Fi = 0, S3 = 1, b3 = 2, z2 = 3, A2 = 4, xS = 5, Be = 0, Wc = null, Pd = null, Rn = 0, O2 = 0, YS = -0, D2 = null, T3 = null, wm = null, Xm = null, Qm = null, qS = null, yu = BS, C2 = null, o4 = 50, e1 = 0, GS = null, R2 = !1, VS = !1, f4 = 50, th = 0, l1 = null, Zm = !1, E3 = !1, jS = null, z3 = !1, A3 = /* @__PURE__ */ new Set(), s4 = {}, Lm = null, Jm = null, M2 = !1, _2 = !1, wS = !1, U2 = !1, Ls = 0, N2 = {};
    (function() {
      for (var t = 0; t < Gb.length; t++) {
        var e = Gb[t], a = e.toLowerCase();
        e = e[0].toUpperCase() + e.slice(1), Za(a, "on" + e);
      }
      Za(lT, "onAnimationEnd"), Za(aT, "onAnimationIteration"), Za(nT, "onAnimationStart"), Za("dblclick", "onDoubleClick"), Za("focusin", "onFocus"), Za("focusout", "onBlur"), Za(VE, "onTransitionRun"), Za(jE, "onTransitionStart"), Za(wE, "onTransitionCancel"), Za(uT, "onTransitionEnd");
    })(), oc("onMouseEnter", ["mouseout", "mouseover"]), oc("onMouseLeave", ["mouseout", "mouseover"]), oc("onPointerEnter", ["pointerout", "pointerover"]), oc("onPointerLeave", ["pointerout", "pointerover"]), ja(
      "onChange",
      "change click focusin focusout input keydown keyup selectionchange".split(
        " "
      )
    ), ja(
      "onSelect",
      "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
        " "
      )
    ), ja("onBeforeInput", [
      "compositionend",
      "keypress",
      "textInput",
      "paste"
    ]), ja(
      "onCompositionEnd",
      "compositionend focusout keydown keypress keyup mousedown".split(" ")
    ), ja(
      "onCompositionStart",
      "compositionstart focusout keydown keypress keyup mousedown".split(" ")
    ), ja(
      "onCompositionUpdate",
      "compositionupdate focusout keydown keypress keyup mousedown".split(" ")
    );
    var a1 = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
      " "
    ), H2 = new Set(
      "beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(a1)
    ), XS = "_reactListening" + Math.random().toString(36).slice(2), O3 = !1, D3 = !1, QS = !1, C3 = !1, ZS = !1, LS = !1, R3 = !1, JS = {}, r4 = /\r\n?/g, d4 = /\u0000|\uFFFD/g, eh = "http://www.w3.org/1999/xlink", B2 = "http://www.w3.org/XML/1998/namespace", h4 = {}, m4 = "javascript:throw new Error('React form unexpectedly submitted.')", y4 = "suppressHydrationWarning", lh = "&", KS = "/&", n1 = "$", u1 = "/$", Js = "$?", ah = "$~", Km = "$!", v4 = "html", g4 = "body", p4 = "head", x2 = "F!", M3 = "F", _3 = "loading", U3 = "style", mf = 0, $m = 1, $S = 2, Y2 = null, q2 = null, N3 = !1, H3 = { dialog: !0, webview: !0 }, G2 = null, c1 = void 0, V2 = typeof setTimeout == "function" ? setTimeout : void 0, S4 = typeof clearTimeout == "function" ? clearTimeout : void 0, nh = -1, B3 = typeof Promise == "function" ? Promise : void 0, x3 = typeof requestAnimationFrame == "function" ? requestAnimationFrame : V2, b4 = typeof queueMicrotask == "function" ? queueMicrotask : typeof B3 < "u" ? function(t) {
      return B3.resolve(null).then(t).catch(ka);
    } : V2, T4 = 500;
    Lo.prototype.animate = function(t, e) {
      return e = typeof e == "number" ? { duration: e } : pt({}, e), e.pseudoElement = this._selector, this._scope.animate(t, e);
    }, Lo.prototype.getAnimations = function() {
      for (var t = this._scope, e = this._selector, a = t.getAnimations({ subtree: !0 }), c = [], o = 0; o < a.length; o++) {
        var f = a[o].effect;
        f !== null && f.target === t && f.pseudoElement === e && c.push(a[o]);
      }
      return c;
    }, Lo.prototype.getComputedStyle = function() {
      return getComputedStyle(this._scope, this._selector);
    }, sa.prototype.addEventListener = function(t, e, a) {
      var c = null, o = null;
      if (!(a != null && typeof a != "boolean" && (c = a.signal || null, c !== null && c.aborted))) {
        this._eventListeners === null && (this._eventListeners = []);
        var f = this._eventListeners;
        if (F0(f, t, e, a) === -1) {
          var d = this, h = e;
          a != null && typeof a != "boolean" && a.once === !0 && (h = function(y) {
            d.removeEventListener(
              t,
              e,
              a
            ), typeof e == "function" ? e.call(this, y) : e.handleEvent(y);
          }), c !== null && (o = d.removeEventListener.bind(
            d,
            t,
            e,
            a
          ), c.addEventListener("abort", o, { once: !0 }), o = c.removeEventListener.bind(
            c,
            "abort",
            o
          )), c = Jo(a), f.push({
            type: t,
            listener: e,
            optionsOrUseCapture: a,
            attachedListener: h,
            cleanup: o
          }), mt(
            this._fragmentFiber,
            Mv,
            t,
            h,
            c
          );
        }
        this._eventListeners = f;
      }
    }, sa.prototype.removeEventListener = function(t, e, a) {
      var c = this._eventListeners;
      if (c !== null && (e = F0(
        c,
        t,
        e,
        a
      ), e !== -1)) {
        var o = c[e];
        a = o.attachedListener;
        var f = o.cleanup;
        o = Jo(
          o.optionsOrUseCapture
        ), mt(
          this._fragmentFiber,
          _v,
          t,
          a,
          o
        ), c.splice(e, 1), f !== null && f();
      }
    }, sa.prototype.dispatchEvent = function(t) {
      var e = Qe(
        this._fragmentFiber
      );
      if (e === null) return !0;
      e = It(e);
      var a = this._eventListeners;
      if (a !== null && 0 < a.length || !t.bubbles) {
        var c = e.nodeType === 9 ? e.createComment("") : document.createTextNode("");
        if (a)
          for (var o = 0; o < a.length; o++) {
            var f = a[o];
            c.addEventListener(
              f.type,
              f.attachedListener,
              Jo(f.optionsOrUseCapture)
            );
          }
        if (e.appendChild(c), t = c.dispatchEvent(t), a)
          for (o = 0; o < a.length; o++)
            f = a[o], c.removeEventListener(
              f.type,
              f.attachedListener,
              Jo(f.optionsOrUseCapture)
            );
        return e.removeChild(c), t;
      }
      return e.dispatchEvent(t);
    }, sa.prototype.focus = function(t) {
      nn(
        this._fragmentFiber.child,
        !0,
        Uv,
        t,
        void 0,
        void 0
      );
    }, sa.prototype.focusLast = function(t) {
      var e = [];
      nn(
        this._fragmentFiber.child,
        !0,
        $t,
        e,
        void 0,
        void 0
      );
      for (var a = e.length - 1; 0 <= a && !Uv(e[a], t); a--) ;
    }, sa.prototype.blur = function() {
      var t = Qe(
        this._fragmentFiber
      );
      t !== null && (t = It(t), t = Ra(t).activeElement, t !== null && mt(
        this._fragmentFiber,
        Nv,
        t
      ));
    }, sa.prototype.observeUsing = function(t) {
      var e = !1, a = !1;
      mt(
        this._fragmentFiber,
        function(c) {
          if (c.tag === 6) e = !0;
          else return a = !0;
          return !1;
        }
      ), e && !a && console.error(
        "observeUsing() was called on a FragmentInstance with only text children. Observers do not work on text nodes."
      ), this._observers === null && (this._observers = /* @__PURE__ */ new Set()), this._observers.add(t), mt(
        this._fragmentFiber,
        db,
        t
      );
    }, sa.prototype.unobserveUsing = function(t) {
      var e = this._observers;
      if (e !== null && e.has(t)) {
        e.delete(t), mt(
          this._fragmentFiber,
          Tp,
          t
        );
        for (var a = e = 0; a < Ic.length; a++) {
          var c = Ic[a];
          c.fragmentInstance === this && c.observer === t ? t.unobserve(c.instance) : Ic[e++] = c;
        }
        Ic.length = e;
      } else
        console.error(
          "You are calling unobserveUsing() with an observer that is not being observed with this fragment instance. First attach the observer with observeUsing()"
        );
    };
    var Ic = [], j2 = !1;
    sa.prototype.getClientRects = function() {
      var t = [];
      return mt(
        this._fragmentFiber,
        mb,
        t
      ), t;
    }, sa.prototype.getRootNode = function(t) {
      var e = Qe(
        this._fragmentFiber
      );
      return e === null ? this : It(e).getRootNode(
        t
      );
    }, sa.prototype.compareDocumentPosition = function(t) {
      var e = Qe(
        this._fragmentFiber
      );
      if (e === null) return Node.DOCUMENT_POSITION_DISCONNECTED;
      var a = [];
      mt(
        this._fragmentFiber,
        $t,
        a
      );
      var c = It(e);
      if (a.length === 0) {
        if (e = c, Kl(this._fragmentFiber)) {
          t: {
            for (a = this._fragmentFiber.return; a !== null; ) {
              if (a.tag === 4) {
                a = a.stateNode.containerInfo;
                break t;
              }
              if (a.tag === 3 || a.tag === 5 || a.tag === 27)
                break;
              a = a.return;
            }
            a = null;
          }
          a != null && (e = a);
        }
        a = this._fragmentFiber;
        var o = c = e.compareDocumentPosition(t);
        return e === t ? o = Node.DOCUMENT_POSITION_CONTAINS : c & Node.DOCUMENT_POSITION_CONTAINED_BY && (a = pa(a)[1], a === null ? o = Node.DOCUMENT_POSITION_PRECEDING : (t = It(a).compareDocumentPosition(
          t
        ), o = t === 0 || t & Node.DOCUMENT_POSITION_FOLLOWING ? Node.DOCUMENT_POSITION_FOLLOWING : Node.DOCUMENT_POSITION_PRECEDING)), o |= Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC;
      }
      e = It(a[0]), o = It(a[a.length - 1]);
      var f = Kl(
        this._fragmentFiber
      ) ? e.parentElement : c;
      if (f == null)
        return Node.DOCUMENT_POSITION_DISCONNECTED;
      c = f.compareDocumentPosition(e) & Node.DOCUMENT_POSITION_CONTAINED_BY, f = f.compareDocumentPosition(o) & Node.DOCUMENT_POSITION_CONTAINED_BY;
      var d = e.compareDocumentPosition(t), h = o.compareDocumentPosition(t), y = d & Node.DOCUMENT_POSITION_CONTAINED_BY || h & Node.DOCUMENT_POSITION_CONTAINED_BY;
      return h = c && f && d & Node.DOCUMENT_POSITION_FOLLOWING && h & Node.DOCUMENT_POSITION_PRECEDING, e = c && e === t || f && o === t || y || h ? Node.DOCUMENT_POSITION_CONTAINED_BY : !c && e === t || !f && o === t ? Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC : d, e & Node.DOCUMENT_POSITION_DISCONNECTED || e & Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC || yb(
        e,
        this._fragmentFiber,
        a[0],
        a[a.length - 1],
        t
      ) ? e : Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC;
    }, sa.prototype.scrollIntoView = function(t) {
      if (typeof t == "object")
        throw Error(
          "FragmentInstance.scrollIntoView() does not support scrollIntoViewOptions. Use the alignToTop boolean instead."
        );
      var e = [];
      mt(
        this._fragmentFiber,
        $t,
        e
      );
      var a = t !== !1;
      if (e.length === 0) {
        var c = pa(
          this._fragmentFiber
        );
        if (c = a ? c[1] || c[0] || Qe(this._fragmentFiber) : c[0] || c[1], c === null) return;
        if (c.tag === 6) {
          t = It(c), Ko(t, a);
          return;
        }
        if (c = It(c), c.nodeType !== 9) {
          if (c.nodeType === 11) {
            a = "host" in c ? c.host : null, a !== null ? a.scrollIntoView(t) : console.warn(
              "You are attempting to scroll a FragmentInstance that is only mounted inside a detached DocumentFragment. No scroll was performed."
            );
            return;
          }
          c.scrollIntoView(t);
        }
      }
      for (c = a ? e.length - 1 : 0; c !== (a ? -1 : e.length); ) {
        var o = e[c];
        o.tag === 6 ? (o = It(o), Ko(o, a)) : It(o).scrollIntoView(t), c += a ? -1 : 1;
      }
    };
    var w2 = null, uh = 0, i1 = 1, Y3 = 2, q3 = 3, ac = 4, nc = /* @__PURE__ */ new Map(), G3 = /* @__PURE__ */ new Set(), yf = Gt.d;
    Gt.d = {
      f: function() {
        var t = yf.f(), e = qo();
        return t || e;
      },
      r: function(t) {
        var e = bu(t);
        e !== null && e.tag === 5 && e.type === "form" ? Kh(e) : yf.r(t);
      },
      D: function(t) {
        yf.D(t), em("dns-prefetch", t, null);
      },
      C: function(t, e) {
        yf.C(t, e), em("preconnect", t, e);
      },
      L: function(t, e, a) {
        yf.L(t, e, a);
        var c = Fm;
        if (c && t && e) {
          var o = 'link[rel="preload"][as="' + wa(e) + '"]';
          e === "image" && a && a.imageSrcSet ? (o += '[imagesrcset="' + wa(
            a.imageSrcSet
          ) + '"]', typeof a.imageSizes == "string" && (o += '[imagesizes="' + wa(
            a.imageSizes
          ) + '"]')) : o += '[href="' + wa(t) + '"]';
          var f = o;
          switch (e) {
            case "style":
              f = Lu(t);
              break;
            case "script":
              f = ys(t);
          }
          if (!(nc.has(f) || (t = pt(
            {
              rel: "preload",
              href: e === "image" && a && a.imageSrcSet ? void 0 : t,
              as: e
            },
            a
          ), nc.set(f, t), c.querySelector(o) !== null || e === "style" && c.querySelector(
            Yi(f)
          ) || e === "script" && c.querySelector(Sd(f))))) {
            var d = c.createElement("link");
            Ke(d, "link", t), e === "style" && (d[ou] = !0, d.onload = d.onerror = function() {
              ar(d);
            }), qe(d), c.head.appendChild(d);
          }
        }
      },
      m: function(t, e) {
        yf.m(t, e);
        var a = Fm;
        if (a && t) {
          var c = e && typeof e.as == "string" ? e.as : "script", o = 'link[rel="modulepreload"][as="' + wa(c) + '"][href="' + wa(t) + '"]', f = o;
          switch (c) {
            case "audioworklet":
            case "paintworklet":
            case "serviceworker":
            case "sharedworker":
            case "worker":
            case "script":
              f = ys(t);
          }
          if (!nc.has(f) && (t = pt({ rel: "modulepreload", href: t }, e), nc.set(f, t), a.querySelector(o) === null)) {
            switch (c) {
              case "audioworklet":
              case "paintworklet":
              case "serviceworker":
              case "sharedworker":
              case "worker":
              case "script":
                if (a.querySelector(Sd(f)))
                  return;
            }
            c = a.createElement("link"), Ke(c, "link", t), qe(c), a.head.appendChild(c);
          }
        }
      },
      X: function(t, e) {
        yf.X(t, e);
        var a = Fm;
        if (a && t) {
          var c = ic(a).hoistableScripts, o = ys(t), f = c.get(o);
          f || (f = a.querySelector(
            Sd(o)
          ), f || (t = pt({ src: t, async: !0 }, e), (e = nc.get(o)) && Td(t, e), f = a.createElement("script"), qe(f), Ke(f, "link", t), a.head.appendChild(f)), f = {
            type: "script",
            instance: f,
            count: 1,
            state: null
          }, c.set(o, f));
        }
      },
      S: function(t, e, a) {
        yf.S(t, e, a);
        var c = Fm;
        if (c && t) {
          var o = ic(c).hoistableStyles, f = Lu(t);
          e = e || "default";
          var d = o.get(f);
          if (!d) {
            var h = { loading: uh, preload: null };
            if (d = c.querySelector(
              Yi(f)
            ))
              h.loading = i1 | ac;
            else {
              t = pt(
                {
                  rel: "stylesheet",
                  href: t,
                  "data-precedence": e
                },
                a
              ), (a = nc.get(f)) && Ft(t, a);
              var y = d = c.createElement("link");
              qe(y), Ke(y, "link", t), y._p = new Promise(function(v, p) {
                y.onload = v, y.onerror = p;
              }), y.addEventListener("load", function() {
                h.loading |= i1;
              }), y.addEventListener("error", function() {
                h.loading |= Y3;
              }), h.loading |= ac, bd(d, e, c);
            }
            d = {
              type: "stylesheet",
              instance: d,
              count: 1,
              state: h
            }, o.set(f, d);
          }
        }
      },
      M: function(t, e) {
        yf.M(t, e);
        var a = Fm;
        if (a && t) {
          var c = ic(a).hoistableScripts, o = ys(t), f = c.get(o);
          f || (f = a.querySelector(
            Sd(o)
          ), f || (t = pt({ src: t, async: !0, type: "module" }, e), (e = nc.get(o)) && Td(t, e), f = a.createElement("script"), qe(f), Ke(f, "link", t), a.head.appendChild(f)), f = {
            type: "script",
            instance: f,
            count: 1,
            state: null
          }, c.set(o, f));
        }
      }
    };
    var Fm = typeof document > "u" ? null : document, FS = null, E4 = 6e4, z4 = 800, A4 = 500, WS = 0, X2 = null, IS = null, ch = Vc, Wm = {
      $$typeof: Sn,
      Provider: null,
      Consumer: null,
      _currentValue: ch,
      _currentValue2: ch,
      _threadCount: 0
    }, V3 = "%c%s%c", j3 = "background: #e6e6e6;background: light-dark(rgba(0,0,0,0.1), rgba(255,255,255,0.25));color: #000000;color: light-dark(#000000, #ffffff);border-radius: 2px", w3 = "", kS = " ", O4 = Function.prototype.bind, X3 = !1, Q3 = null, Z3 = null, L3 = null, J3 = null, K3 = null, $3 = null, F3 = null, W3 = null, I3 = null, k3 = null;
    Q3 = function(t, e, a, c) {
      e = K(t, e), e !== null && (a = ma(e.memoizedState, a, 0, c), e.memoizedState = a, e.baseState = a, t.memoizedProps = pt({}, t.memoizedProps), a = Nl(t, 2), a !== null && ge(a, t, 2));
    }, Z3 = function(t, e, a) {
      e = K(t, e), e !== null && (a = ya(e.memoizedState, a, 0), e.memoizedState = a, e.baseState = a, t.memoizedProps = pt({}, t.memoizedProps), a = Nl(t, 2), a !== null && ge(a, t, 2));
    }, L3 = function(t, e, a, c) {
      e = K(t, e), e !== null && (a = hl(e.memoizedState, a, c), e.memoizedState = a, e.baseState = a, t.memoizedProps = pt({}, t.memoizedProps), a = Nl(t, 2), a !== null && ge(a, t, 2));
    }, J3 = function(t, e, a) {
      t.pendingProps = ma(t.memoizedProps, e, 0, a), t.alternate && (t.alternate.pendingProps = t.pendingProps), e = Nl(t, 2), e !== null && ge(e, t, 2);
    }, K3 = function(t, e) {
      t.pendingProps = ya(t.memoizedProps, e, 0), t.alternate && (t.alternate.pendingProps = t.pendingProps), e = Nl(t, 2), e !== null && ge(e, t, 2);
    }, $3 = function(t, e, a) {
      t.pendingProps = hl(
        t.memoizedProps,
        e,
        a
      ), t.alternate && (t.alternate.pendingProps = t.pendingProps), e = Nl(t, 2), e !== null && ge(e, t, 2);
    }, F3 = function(t) {
      var e = Nl(t, 2);
      e !== null && ge(e, t, 2);
    }, W3 = function(t) {
      var e = Pm(), a = Nl(t, e);
      a !== null && ge(a, t, e);
    }, I3 = function(t) {
      Mn = t;
    }, k3 = function(t) {
      qa = t;
    };
    var Im = !0, PS = null, Q2 = !1, Ks = null, $s = null, Fs = null, o1 = /* @__PURE__ */ new Map(), f1 = /* @__PURE__ */ new Map(), Ws = [], D4 = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(
      " "
    ), tb = null;
    if (im.prototype.render = Fv.prototype.render = function(t) {
      var e = this._internalRoot;
      if (e === null) throw Error("Cannot update an unmounted root.");
      var a = arguments;
      typeof a[1] == "function" ? console.error(
        "does not support the second callback argument. To execute a side effect after rendering, declare it in a component body with useEffect()."
      ) : Mt(a[1]) ? console.error(
        "You passed a container to the second argument of root.render(...). You don't need to pass it again since you already passed it to create the root."
      ) : typeof a[1] < "u" && console.error(
        "You passed a second argument to root.render(...) but it only accepts one argument."
      ), a = t;
      var c = e.current, o = na(c);
      nm(c, o, a, e, null, null);
    }, im.prototype.unmount = Fv.prototype.unmount = function() {
      var t = arguments;
      if (typeof t[0] == "function" && console.error(
        "does not support a callback argument. To execute a side effect after rendering, declare it in a component body with useEffect()."
      ), t = this._internalRoot, t !== null) {
        this._internalRoot = null;
        var e = t.containerInfo;
        (Zt & (Dl | hu)) !== Jl && console.error(
          "Attempted to synchronously unmount a root while React was already rendering. React cannot finish unmounting the root until the current render has completed, which may lead to a race condition."
        ), nm(t.current, 2, null, t, null, null), qo(), e[$u] = null;
      }
    }, im.prototype.unstable_scheduleHydration = function(t) {
      if (t) {
        var e = Fl();
        t = { blockedOn: null, target: t, priority: e };
        for (var a = 0; a < Ws.length && e !== 0 && e < Ws[a].priority; a++) ;
        Ws.splice(a, 0, t), a === 0 && Ua(t);
      }
    }, (function() {
      var t = Od.version;
      if (t !== "19.3.1")
        throw Error(
          `Incompatible React versions: The "react" and "react-dom" packages must have the exact same version. Instead got:
  - react:      ` + (t + `
  - react-dom:  19.3.1
Learn more: https://react.dev/warnings/version-mismatch`)
        );
    })(), typeof Map == "function" && Map.prototype != null && typeof Map.prototype.forEach == "function" && typeof Set == "function" && Set.prototype != null && typeof Set.prototype.clear == "function" && typeof Set.prototype.forEach == "function" || console.error(
      "React depends on Map and Set built-in types. Make sure that you load a polyfill in older browsers. https://react.dev/link/react-polyfills"
    ), Gt.findDOMNode = function(t) {
      var e = t._reactInternals;
      if (e === void 0)
        throw typeof t.render == "function" ? Error("Unable to find node on an unmounted component.") : (t = Object.keys(t).join(","), Error(
          "Argument appears to not be a ReactComponent. Keys: " + t
        ));
      return t = gu(e), t = t !== null ? ga(t) : null, t = t === null ? null : t.stateNode, t;
    }, !(function() {
      var t = {
        bundleType: 1,
        version: "19.3.1",
        rendererPackageName: "react-dom",
        currentDispatcherRef: x,
        reconcilerVersion: "19.3.1"
      };
      return t.overrideHookState = Q3, t.overrideHookStateDeletePath = Z3, t.overrideHookStateRenamePath = L3, t.overrideProps = J3, t.overridePropsDeletePath = K3, t.overridePropsRenamePath = $3, t.scheduleUpdate = F3, t.scheduleRetry = W3, t.setErrorHandler = I3, t.setSuspenseHandler = k3, t.scheduleRefresh = yl, t.scheduleRoot = Cl, t.setRefreshHandler = vu, t.getCurrentFiber = Bp, km(t);
    })() && ji && window.top === window.self && (-1 < navigator.userAgent.indexOf("Chrome") && navigator.userAgent.indexOf("Edge") === -1 || -1 < navigator.userAgent.indexOf("Firefox"))) {
      var P3 = window.location.protocol;
      /^(https?|file):$/.test(P3) && console.info(
        "%cDownload the React DevTools for a better development experience: https://react.dev/link/react-devtools" + (P3 === "file:" ? `
You might need to use a local HTTP server (instead of file://): https://react.dev/link/react-devtools-faq` : ""),
        "font-weight:bold"
      );
    }
    r1.createRoot = function(t, e) {
      if (!Mt(t))
        throw Error("Target container is not a DOM element.");
      wp(t);
      var a = !1, c = "", o = Ih, f = kh, d = Bl;
      return e != null && (e.hydrate ? console.warn(
        "hydrate through createRoot is deprecated. Use ReactDOMClient.hydrateRoot(container, <App />) instead."
      ) : typeof e == "object" && e !== null && e.$$typeof === cu && console.error(
        `You passed a JSX element to createRoot. You probably meant to call root.render instead. Example usage:

  let root = createRoot(domContainer);
  root.render(<App />);`
      ), e.unstable_strictMode === !0 && (a = !0), e.identifierPrefix !== void 0 && (c = e.identifierPrefix), e.onUncaughtError !== void 0 && (o = e.onUncaughtError), e.onCaughtError !== void 0 && (f = e.onCaughtError), e.onRecoverableError !== void 0 && (d = e.onRecoverableError)), e = Np(
        t,
        1,
        !1,
        null,
        null,
        a,
        c,
        null,
        o,
        f,
        d,
        cm
      ), t[$u] = e.current, V0(t), new Fv(e);
    }, r1.hydrateRoot = function(t, e, a) {
      if (!Mt(t))
        throw Error("Target container is not a DOM element.");
      wp(t), e === void 0 && console.error(
        "Must provide initial children as second argument to hydrateRoot. Example usage: hydrateRoot(domContainer, <App />)"
      );
      var c = !1, o = "", f = Ih, d = kh, h = Bl, y = null;
      return a != null && (a.unstable_strictMode === !0 && (c = !0), a.identifierPrefix !== void 0 && (o = a.identifierPrefix), a.onUncaughtError !== void 0 && (f = a.onUncaughtError), a.onCaughtError !== void 0 && (d = a.onCaughtError), a.onRecoverableError !== void 0 && (h = a.onRecoverableError), a.formState !== void 0 && (y = a.formState)), e = Np(
        t,
        1,
        !0,
        e,
        a ?? null,
        c,
        o,
        y,
        f,
        d,
        h,
        cm
      ), e.context = Qv(null), a = e.current, c = na(a), c = fh(c), o = Ln(c), o.callback = null, Nu(a, o, c), Gn(c, "hydrateRoot()", null), a = c, e.current.lanes = a, tr(e, a), ca(e), t[$u] = e.current, V0(t), new im(e);
    }, r1.version = "19.3.1", typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());
  })()), r1;
}
var uE;
function N4() {
  if (uE) return eb.exports;
  uE = 1;
  function K() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function")) {
      if (process.env.NODE_ENV !== "production")
        throw new Error("^_^");
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(K);
      } catch (ma) {
        console.error(ma);
      }
    }
  }
  return process.env.NODE_ENV === "production" ? (K(), eb.exports = _4()) : eb.exports = U4(), eb.exports;
}
var x4 = N4();
export {
  x4 as c
};
