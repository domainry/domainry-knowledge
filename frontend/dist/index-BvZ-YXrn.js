import * as u from "react";
import { useState as he } from "react";
import * as me from "react-dom";
import { jsx as B, Fragment as ye } from "react/jsx-runtime";
var F = function(e, t) {
  return F = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(r, n) {
    r.__proto__ = n;
  } || function(r, n) {
    for (var o in n) Object.prototype.hasOwnProperty.call(n, o) && (r[o] = n[o]);
  }, F(e, t);
};
function vt(e, t) {
  if (typeof t != "function" && t !== null)
    throw new TypeError("Class extends value " + String(t) + " is not a constructor or null");
  F(e, t);
  function r() {
    this.constructor = e;
  }
  e.prototype = t === null ? Object.create(t) : (r.prototype = t.prototype, new r());
}
var C = function() {
  return C = Object.assign || function(t) {
    for (var r, n = 1, o = arguments.length; n < o; n++) {
      r = arguments[n];
      for (var a in r) Object.prototype.hasOwnProperty.call(r, a) && (t[a] = r[a]);
    }
    return t;
  }, C.apply(this, arguments);
};
function ne(e, t) {
  var r = {};
  for (var n in e) Object.prototype.hasOwnProperty.call(e, n) && t.indexOf(n) < 0 && (r[n] = e[n]);
  if (e != null && typeof Object.getOwnPropertySymbols == "function")
    for (var o = 0, n = Object.getOwnPropertySymbols(e); o < n.length; o++)
      t.indexOf(n[o]) < 0 && Object.prototype.propertyIsEnumerable.call(e, n[o]) && (r[n[o]] = e[n[o]]);
  return r;
}
function ht(e, t, r, n) {
  function o(a) {
    return a instanceof r ? a : new r(function(c) {
      c(a);
    });
  }
  return new (r || (r = Promise))(function(a, c) {
    function i(v) {
      try {
        l(n.next(v));
      } catch (d) {
        c(d);
      }
    }
    function h(v) {
      try {
        l(n.throw(v));
      } catch (d) {
        c(d);
      }
    }
    function l(v) {
      v.done ? a(v.value) : o(v.value).then(i, h);
    }
    l((n = n.apply(e, t || [])).next());
  });
}
function mt(e, t) {
  var r = { label: 0, sent: function() {
    if (a[0] & 1) throw a[1];
    return a[1];
  }, trys: [], ops: [] }, n, o, a, c = Object.create((typeof Iterator == "function" ? Iterator : Object).prototype);
  return c.next = i(0), c.throw = i(1), c.return = i(2), typeof Symbol == "function" && (c[Symbol.iterator] = function() {
    return this;
  }), c;
  function i(l) {
    return function(v) {
      return h([l, v]);
    };
  }
  function h(l) {
    if (n) throw new TypeError("Generator is already executing.");
    for (; c && (c = 0, l[0] && (r = 0)), r; ) try {
      if (n = 1, o && (a = l[0] & 2 ? o.return : l[0] ? o.throw || ((a = o.return) && a.call(o), 0) : o.next) && !(a = a.call(o, l[1])).done) return a;
      switch (o = 0, a && (l = [l[0] & 2, a.value]), l[0]) {
        case 0:
        case 1:
          a = l;
          break;
        case 4:
          return r.label++, { value: l[1], done: !1 };
        case 5:
          r.label++, o = l[1], l = [0];
          continue;
        case 7:
          l = r.ops.pop(), r.trys.pop();
          continue;
        default:
          if (a = r.trys, !(a = a.length > 0 && a[a.length - 1]) && (l[0] === 6 || l[0] === 2)) {
            r = 0;
            continue;
          }
          if (l[0] === 3 && (!a || l[1] > a[0] && l[1] < a[3])) {
            r.label = l[1];
            break;
          }
          if (l[0] === 6 && r.label < a[1]) {
            r.label = a[1], a = l;
            break;
          }
          if (a && r.label < a[2]) {
            r.label = a[2], r.ops.push(l);
            break;
          }
          a[2] && r.ops.pop(), r.trys.pop();
          continue;
      }
      l = t.call(e, r);
    } catch (v) {
      l = [6, v], o = 0;
    } finally {
      n = a = 0;
    }
    if (l[0] & 5) throw l[1];
    return { value: l[0] ? l[1] : void 0, done: !0 };
  }
}
function q(e) {
  var t = typeof Symbol == "function" && Symbol.iterator, r = t && e[t], n = 0;
  if (r) return r.call(e);
  if (e && typeof e.length == "number") return {
    next: function() {
      return e && n >= e.length && (e = void 0), { value: e && e[n++], done: !e };
    }
  };
  throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
}
function yt(e, t) {
  var r = typeof Symbol == "function" && e[Symbol.iterator];
  if (!r) return e;
  var n = r.call(e), o, a = [], c;
  try {
    for (; (t === void 0 || t-- > 0) && !(o = n.next()).done; ) a.push(o.value);
  } catch (i) {
    c = { error: i };
  } finally {
    try {
      o && !o.done && (r = n.return) && r.call(n);
    } finally {
      if (c) throw c.error;
    }
  }
  return a;
}
function pe(e, t, r) {
  if (r || arguments.length === 2) for (var n = 0, o = t.length, a; n < o; n++)
    (a || !(n in t)) && (a || (a = Array.prototype.slice.call(t, 0, n)), a[n] = t[n]);
  return e.concat(a || Array.prototype.slice.call(t));
}
function Z(e) {
  return this instanceof Z ? (this.v = e, this) : new Z(e);
}
function pt(e, t, r) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var n = r.apply(e, t || []), o, a = [];
  return o = Object.create((typeof AsyncIterator == "function" ? AsyncIterator : Object).prototype), i("next"), i("throw"), i("return", c), o[Symbol.asyncIterator] = function() {
    return this;
  }, o;
  function c(f) {
    return function(p) {
      return Promise.resolve(p).then(f, d);
    };
  }
  function i(f, p) {
    n[f] && (o[f] = function(s) {
      return new Promise(function(m, g) {
        a.push([f, s, m, g]) > 1 || h(f, s);
      });
    }, p && (o[f] = p(o[f])));
  }
  function h(f, p) {
    try {
      l(n[f](p));
    } catch (s) {
      y(a[0][3], s);
    }
  }
  function l(f) {
    f.value instanceof Z ? Promise.resolve(f.value.v).then(v, d) : y(a[0][2], f);
  }
  function v(f) {
    h("next", f);
  }
  function d(f) {
    h("throw", f);
  }
  function y(f, p) {
    f(p), a.shift(), a.length && h(a[0][0], a[0][1]);
  }
}
function gt(e) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var t = e[Symbol.asyncIterator], r;
  return t ? t.call(e) : (e = typeof q == "function" ? q(e) : e[Symbol.iterator](), r = {}, n("next"), n("throw"), n("return"), r[Symbol.asyncIterator] = function() {
    return this;
  }, r);
  function n(a) {
    r[a] = e[a] && function(c) {
      return new Promise(function(i, h) {
        c = e[a](c), o(i, h, c.done, c.value);
      });
    };
  }
  function o(a, c, i, h) {
    Promise.resolve(h).then(function(l) {
      a({ value: l, done: i });
    }, c);
  }
}
var ge = function(e) {
  if (typeof document > "u")
    return null;
  var t = Array.isArray(e) ? e[0] : e;
  return t.ownerDocument.body;
}, P = /* @__PURE__ */ new WeakMap(), _ = /* @__PURE__ */ new WeakMap(), I = {}, V = 0, ae = function(e) {
  return e && (e.host || ae(e.parentNode));
}, we = function(e, t) {
  return t.map(function(r) {
    if (e.contains(r))
      return r;
    var n = ae(r);
    return n && e.contains(n) ? n : (console.error("aria-hidden", r, "in not contained inside", e, ". Doing nothing"), null);
  }).filter(function(r) {
    return !!r;
  });
}, be = function(e, t, r, n) {
  var o = we(t, Array.isArray(e) ? e : [e]);
  I[r] || (I[r] = /* @__PURE__ */ new WeakMap());
  var a = I[r], c = [], i = /* @__PURE__ */ new Set(), h = new Set(o), l = function(d) {
    !d || i.has(d) || (i.add(d), l(d.parentNode));
  };
  o.forEach(l);
  var v = function(d) {
    !d || h.has(d) || Array.prototype.forEach.call(d.children, function(y) {
      if (i.has(y))
        v(y);
      else
        try {
          var f = y.getAttribute(n), p = f !== null && f !== "false", s = (P.get(y) || 0) + 1, m = (a.get(y) || 0) + 1;
          P.set(y, s), a.set(y, m), c.push(y), s === 1 && p && _.set(y, !0), m === 1 && y.setAttribute(r, "true"), p || y.setAttribute(n, "true");
        } catch (g) {
          console.error("aria-hidden: cannot operate on ", y, g);
        }
    });
  };
  return v(t), i.clear(), V++, function() {
    c.forEach(function(d) {
      var y = P.get(d) - 1, f = a.get(d) - 1;
      P.set(d, y), a.set(d, f), y || (_.has(d) || d.removeAttribute(n), _.delete(d)), f || d.removeAttribute(r);
    }), V--, V || (P = /* @__PURE__ */ new WeakMap(), P = /* @__PURE__ */ new WeakMap(), _ = /* @__PURE__ */ new WeakMap(), I = {});
  };
}, wt = function(e, t, r) {
  r === void 0 && (r = "data-aria-hidden");
  var n = Array.from(Array.isArray(e) ? e : [e]), o = ge(e);
  return o ? (n.push.apply(n, Array.from(o.querySelectorAll("[aria-live], script"))), be(n, o, r, "aria-hidden")) : function() {
    return null;
  };
}, W = "right-scroll-bar-position", j = "width-before-scroll-bar", Se = "with-scroll-bars-hidden", Ce = "--removed-body-scroll-bar-size";
function X(e, t) {
  return typeof e == "function" ? e(t) : e && (e.current = t), e;
}
function Ee(e, t) {
  var r = he(function() {
    return {
      // value
      value: e,
      // last callback
      callback: t,
      // "memoized" public interface
      facade: {
        get current() {
          return r.value;
        },
        set current(n) {
          var o = r.value;
          o !== n && (r.value = n, r.callback(n, o));
        }
      }
    };
  })[0];
  return r.callback = t, r.facade;
}
var Re = typeof window < "u" ? u.useLayoutEffect : u.useEffect, K = /* @__PURE__ */ new WeakMap();
function ke(e, t) {
  var r = Ee(null, function(n) {
    return e.forEach(function(o) {
      return X(o, n);
    });
  });
  return Re(function() {
    var n = K.get(r);
    if (n) {
      var o = new Set(n), a = new Set(e), c = r.current;
      o.forEach(function(i) {
        a.has(i) || X(i, null);
      }), a.forEach(function(i) {
        o.has(i) || X(i, c);
      });
    }
    K.set(r, e);
  }, [e]), r;
}
function Pe(e) {
  return e;
}
function Ae(e, t) {
  t === void 0 && (t = Pe);
  var r = [], n = !1, o = {
    read: function() {
      if (n)
        throw new Error("Sidecar: could not `read` from an `assigned` medium. `read` could be used only with `useMedium`.");
      return r.length ? r[r.length - 1] : e;
    },
    useMedium: function(a) {
      var c = t(a, n);
      return r.push(c), function() {
        r = r.filter(function(i) {
          return i !== c;
        });
      };
    },
    assignSyncMedium: function(a) {
      for (n = !0; r.length; ) {
        var c = r;
        r = [], c.forEach(a);
      }
      r = {
        push: function(i) {
          return a(i);
        },
        filter: function() {
          return r;
        }
      };
    },
    assignMedium: function(a) {
      n = !0;
      var c = [];
      if (r.length) {
        var i = r;
        r = [], i.forEach(a), c = r;
      }
      var h = function() {
        var v = c;
        c = [], v.forEach(a);
      }, l = function() {
        return Promise.resolve().then(h);
      };
      l(), r = {
        push: function(v) {
          c.push(v), l();
        },
        filter: function(v) {
          return c = c.filter(v), r;
        }
      };
    }
  };
  return o;
}
function Oe(e) {
  e === void 0 && (e = {});
  var t = Ae(null);
  return t.options = C({ async: !0, ssr: !1 }, e), t;
}
var oe = function(e) {
  var t = e.sideCar, r = ne(e, ["sideCar"]);
  if (!t)
    throw new Error("Sidecar: please provide `sideCar` property to import the right car");
  var n = t.read();
  if (!n)
    throw new Error("Sidecar medium not found");
  return u.createElement(n, C({}, r));
};
oe.isSideCarExport = !0;
function xe(e, t) {
  return e.useMedium(t), oe;
}
var ie = Oe(), Y = function() {
}, L = u.forwardRef(function(e, t) {
  var r = u.useRef(null), n = u.useState({
    onScrollCapture: Y,
    onWheelCapture: Y,
    onTouchMoveCapture: Y
  }), o = n[0], a = n[1], c = e.forwardProps, i = e.children, h = e.className, l = e.removeScrollBar, v = e.enabled, d = e.shards, y = e.sideCar, f = e.noRelative, p = e.noIsolation, s = e.inert, m = e.allowPinchZoom, g = e.as, w = g === void 0 ? "div" : g, S = e.gapMode, E = ne(e, ["forwardProps", "children", "className", "removeScrollBar", "enabled", "shards", "sideCar", "noRelative", "noIsolation", "inert", "allowPinchZoom", "as", "gapMode"]), b = y, R = ke([r, t]), k = C(C({}, E), o);
  return u.createElement(
    u.Fragment,
    null,
    v && u.createElement(b, { sideCar: ie, removeScrollBar: l, shards: d, noRelative: f, noIsolation: p, inert: s, setCallbacks: a, allowPinchZoom: !!m, lockRef: r, gapMode: S }),
    c ? u.cloneElement(u.Children.only(i), C(C({}, k), { ref: R })) : u.createElement(w, C({}, k, { className: h, ref: R }), i)
  );
});
L.defaultProps = {
  enabled: !0,
  removeScrollBar: !0,
  inert: !1
};
L.classNames = {
  fullWidth: j,
  zeroRight: W
};
var Me = function() {
  if (typeof __webpack_nonce__ < "u")
    return __webpack_nonce__;
};
function _e() {
  if (!document)
    return null;
  var e = document.createElement("style");
  e.type = "text/css";
  var t = Me();
  return t && e.setAttribute("nonce", t), e;
}
function Ie(e, t) {
  e.styleSheet ? e.styleSheet.cssText = t : e.appendChild(document.createTextNode(t));
}
function Ne(e) {
  var t = document.head || document.getElementsByTagName("head")[0];
  t.appendChild(e);
}
var Te = function() {
  var e = 0, t = null;
  return {
    add: function(r) {
      e == 0 && (t = _e()) && (Ie(t, r), Ne(t)), e++;
    },
    remove: function() {
      e--, !e && t && (t.parentNode && t.parentNode.removeChild(t), t = null);
    }
  };
}, We = function() {
  var e = Te();
  return function(t, r) {
    u.useEffect(function() {
      return e.add(t), function() {
        e.remove();
      };
    }, [t && r]);
  };
}, ce = function() {
  var e = We(), t = function(r) {
    var n = r.styles, o = r.dynamic;
    return e(n, o), null;
  };
  return t;
}, je = {
  left: 0,
  top: 0,
  right: 0,
  gap: 0
}, H = function(e) {
  return parseInt(e || "", 10) || 0;
}, Be = function(e) {
  var t = window.getComputedStyle(document.body), r = t[e === "padding" ? "paddingLeft" : "marginLeft"], n = t[e === "padding" ? "paddingTop" : "marginTop"], o = t[e === "padding" ? "paddingRight" : "marginRight"];
  return [H(r), H(n), H(o)];
}, Le = function(e) {
  if (e === void 0 && (e = "margin"), typeof window > "u")
    return je;
  var t = Be(e), r = document.documentElement.clientWidth, n = window.innerWidth;
  return {
    left: t[0],
    top: t[1],
    right: t[2],
    gap: Math.max(0, n - r + t[2] - t[0])
  };
}, De = ce(), x = "data-scroll-locked", Ve = function(e, t, r, n) {
  var o = e.left, a = e.top, c = e.right, i = e.gap;
  return r === void 0 && (r = "margin"), `
  .`.concat(Se, ` {
   overflow: hidden `).concat(n, `;
   padding-right: `).concat(i, "px ").concat(n, `;
  }
  body[`).concat(x, `] {
    overflow: hidden `).concat(n, `;
    overscroll-behavior: contain;
    `).concat([
    t && "position: relative ".concat(n, ";"),
    r === "margin" && `
    padding-left: `.concat(o, `px;
    padding-top: `).concat(a, `px;
    padding-right: `).concat(c, `px;
    margin-left:0;
    margin-top:0;
    margin-right: `).concat(i, "px ").concat(n, `;
    `),
    r === "padding" && "padding-right: ".concat(i, "px ").concat(n, ";")
  ].filter(Boolean).join(""), `
  }
  
  .`).concat(W, ` {
    right: `).concat(i, "px ").concat(n, `;
  }
  
  .`).concat(j, ` {
    margin-right: `).concat(i, "px ").concat(n, `;
  }
  
  .`).concat(W, " .").concat(W, ` {
    right: 0 `).concat(n, `;
  }
  
  .`).concat(j, " .").concat(j, ` {
    margin-right: 0 `).concat(n, `;
  }
  
  body[`).concat(x, `] {
    `).concat(Ce, ": ").concat(i, `px;
  }
`);
}, U = function() {
  var e = parseInt(document.body.getAttribute(x) || "0", 10);
  return isFinite(e) ? e : 0;
}, Xe = function() {
  u.useEffect(function() {
    return document.body.setAttribute(x, (U() + 1).toString()), function() {
      var e = U() - 1;
      e <= 0 ? document.body.removeAttribute(x) : document.body.setAttribute(x, e.toString());
    };
  }, []);
}, Ye = function(e) {
  var t = e.noRelative, r = e.noImportant, n = e.gapMode, o = n === void 0 ? "margin" : n;
  Xe();
  var a = u.useMemo(function() {
    return Le(o);
  }, [o]);
  return u.createElement(De, { styles: Ve(a, !t, o, r ? "" : "!important") });
}, z = !1;
if (typeof window < "u")
  try {
    var N = Object.defineProperty({}, "passive", {
      get: function() {
        return z = !0, !0;
      }
    });
    window.addEventListener("test", N, N), window.removeEventListener("test", N, N);
  } catch {
    z = !1;
  }
var A = z ? { passive: !1 } : !1, He = function(e) {
  return e.tagName === "TEXTAREA";
}, ue = function(e, t) {
  if (!(e instanceof Element))
    return !1;
  var r = window.getComputedStyle(e);
  return (
    // not-not-scrollable
    r[t] !== "hidden" && // contains scroll inside self
    !(r.overflowY === r.overflowX && !He(e) && r[t] === "visible")
  );
}, Fe = function(e) {
  return ue(e, "overflowY");
}, Ze = function(e) {
  return ue(e, "overflowX");
}, J = function(e, t) {
  var r = t.ownerDocument, n = t;
  do {
    typeof ShadowRoot < "u" && n instanceof ShadowRoot && (n = n.host);
    var o = le(e, n);
    if (o) {
      var a = se(e, n), c = a[1], i = a[2];
      if (c > i)
        return !0;
    }
    n = n.parentNode;
  } while (n && n !== r.body);
  return !1;
}, ze = function(e) {
  var t = e.scrollTop, r = e.scrollHeight, n = e.clientHeight;
  return [
    t,
    r,
    n
  ];
}, Ge = function(e) {
  var t = e.scrollLeft, r = e.scrollWidth, n = e.clientWidth;
  return [
    t,
    r,
    n
  ];
}, le = function(e, t) {
  return e === "v" ? Fe(t) : Ze(t);
}, se = function(e, t) {
  return e === "v" ? ze(t) : Ge(t);
}, Qe = function(e, t) {
  return e === "h" && t === "rtl" ? -1 : 1;
}, $e = function(e, t, r, n, o) {
  var a = Qe(e, window.getComputedStyle(t).direction), c = a * n, i = r.target, h = t.contains(i), l = !1, v = c > 0, d = 0, y = 0;
  do {
    if (!i)
      break;
    var f = se(e, i), p = f[0], s = f[1], m = f[2], g = s - m - a * p;
    (p || g) && le(e, i) && (d += g, y += p);
    var w = i.parentNode;
    i = w && w.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? w.host : w;
  } while (
    // portaled content
    !h && i !== document.body || // self content
    h && (t.contains(i) || t === i)
  );
  return (v && Math.abs(d) < 1 || !v && Math.abs(y) < 1) && (l = !0), l;
}, T = function(e) {
  return "changedTouches" in e ? [e.changedTouches[0].clientX, e.changedTouches[0].clientY] : [0, 0];
}, ee = function(e) {
  return [e.deltaX, e.deltaY];
}, te = function(e) {
  return e && "current" in e ? e.current : e;
}, qe = function(e, t) {
  return e[0] === t[0] && e[1] === t[1];
}, Ke = function(e) {
  return `
  .block-interactivity-`.concat(e, ` {pointer-events: none;}
  .allow-interactivity-`).concat(e, ` {pointer-events: all;}
`);
}, Ue = 0, O = [];
function Je(e) {
  var t = u.useRef([]), r = u.useRef([0, 0]), n = u.useRef(), o = u.useState(Ue++)[0], a = u.useState(ce)[0], c = u.useRef(e);
  u.useEffect(function() {
    c.current = e;
  }, [e]), u.useEffect(function() {
    if (e.inert) {
      document.body.classList.add("block-interactivity-".concat(o));
      var s = pe([e.lockRef.current], (e.shards || []).map(te), !0).filter(Boolean);
      return s.forEach(function(m) {
        return m.classList.add("allow-interactivity-".concat(o));
      }), function() {
        document.body.classList.remove("block-interactivity-".concat(o)), s.forEach(function(m) {
          return m.classList.remove("allow-interactivity-".concat(o));
        });
      };
    }
  }, [e.inert, e.lockRef.current, e.shards]);
  var i = u.useCallback(function(s, m) {
    if ("touches" in s && s.touches.length === 2 || s.type === "wheel" && s.ctrlKey)
      return !c.current.allowPinchZoom;
    var g = T(s), w = r.current, S = "deltaX" in s ? s.deltaX : w[0] - g[0], E = "deltaY" in s ? s.deltaY : w[1] - g[1], b, R = s.target, k = Math.abs(S) > Math.abs(E) ? "h" : "v";
    if ("touches" in s && k === "h" && R.type === "range")
      return !1;
    var Q = window.getSelection(), D = Q && Q.anchorNode, ve = D ? D === R || D.contains(R) : !1;
    if (ve)
      return !1;
    var M = J(k, R);
    if (!M)
      return !0;
    if (M ? b = k : (b = k === "v" ? "h" : "v", M = J(k, R)), !M)
      return !1;
    if (!n.current && "changedTouches" in s && (S || E) && (n.current = b), !b)
      return !0;
    var $ = n.current || b;
    return $e($, m, s, $ === "h" ? S : E);
  }, []), h = u.useCallback(function(s) {
    var m = s;
    if (!(!O.length || O[O.length - 1] !== a)) {
      var g = "deltaY" in m ? ee(m) : T(m), w = t.current.filter(function(b) {
        return b.name === m.type && (b.target === m.target || m.target === b.shadowParent) && qe(b.delta, g);
      })[0];
      if (w && w.should) {
        m.cancelable && m.preventDefault();
        return;
      }
      if (!w) {
        var S = (c.current.shards || []).map(te).filter(Boolean).filter(function(b) {
          return b.contains(m.target);
        }), E = S.length > 0 ? i(m, S[0]) : !c.current.noIsolation;
        E && m.cancelable && m.preventDefault();
      }
    }
  }, []), l = u.useCallback(function(s, m, g, w) {
    var S = { name: s, delta: m, target: g, should: w, shadowParent: et(g) };
    t.current.push(S), setTimeout(function() {
      t.current = t.current.filter(function(E) {
        return E !== S;
      });
    }, 1);
  }, []), v = u.useCallback(function(s) {
    r.current = T(s), n.current = void 0;
  }, []), d = u.useCallback(function(s) {
    l(s.type, ee(s), s.target, i(s, e.lockRef.current));
  }, []), y = u.useCallback(function(s) {
    l(s.type, T(s), s.target, i(s, e.lockRef.current));
  }, []);
  u.useEffect(function() {
    return O.push(a), e.setCallbacks({
      onScrollCapture: d,
      onWheelCapture: d,
      onTouchMoveCapture: y
    }), document.addEventListener("wheel", h, A), document.addEventListener("touchmove", h, A), document.addEventListener("touchstart", v, A), function() {
      O = O.filter(function(s) {
        return s !== a;
      }), document.removeEventListener("wheel", h, A), document.removeEventListener("touchmove", h, A), document.removeEventListener("touchstart", v, A);
    };
  }, []);
  var f = e.removeScrollBar, p = e.inert;
  return u.createElement(
    u.Fragment,
    null,
    p ? u.createElement(a, { styles: Ke(o) }) : null,
    f ? u.createElement(Ye, { noRelative: e.noRelative, gapMode: e.gapMode }) : null
  );
}
function et(e) {
  for (var t = null; e !== null; )
    e instanceof ShadowRoot && (t = e.host, e = e.host), e = e.parentNode;
  return t;
}
const tt = xe(ie, Je);
var rt = u.forwardRef(function(e, t) {
  return u.createElement(L, C({}, e, { ref: t, sideCar: tt }));
});
rt.classNames = L.classNames;
function re(e, t) {
  if (typeof e == "function")
    return e(t);
  e != null && (e.current = t);
}
function fe(...e) {
  return (t) => {
    let r = !1;
    const n = e.map((o) => {
      const a = re(o, t);
      return !r && typeof a == "function" && (r = !0), a;
    });
    if (r)
      return () => {
        for (let o = 0; o < n.length; o++) {
          const a = n[o];
          typeof a == "function" ? a() : re(e[o], null);
        }
      };
  };
}
function bt(...e) {
  return u.useCallback(fe(...e), e);
}
var de = u.forwardRef((e, t) => {
  const { children: r, ...n } = e, o = u.Children.toArray(r), a = o.find(at);
  if (a) {
    const c = a.props.children, i = o.map((h) => h === a ? u.Children.count(c) > 1 ? u.Children.only(null) : u.isValidElement(c) ? c.props.children : null : h);
    return /* @__PURE__ */ B(G, { ...n, ref: t, children: u.isValidElement(c) ? u.cloneElement(c, void 0, i) : null });
  }
  return /* @__PURE__ */ B(G, { ...n, ref: t, children: r });
});
de.displayName = "Slot";
var G = u.forwardRef((e, t) => {
  const { children: r, ...n } = e;
  if (u.isValidElement(r)) {
    const o = it(r), a = ot(n, r.props);
    return r.type !== u.Fragment && (a.ref = t ? fe(t, o) : o), u.cloneElement(r, a);
  }
  return u.Children.count(r) > 1 ? u.Children.only(null) : null;
});
G.displayName = "SlotClone";
var nt = ({ children: e }) => /* @__PURE__ */ B(ye, { children: e });
function at(e) {
  return u.isValidElement(e) && e.type === nt;
}
function ot(e, t) {
  const r = { ...t };
  for (const n in t) {
    const o = e[n], a = t[n];
    /^on[A-Z]/.test(n) ? o && a ? r[n] = (...i) => {
      a(...i), o(...i);
    } : o && (r[n] = o) : n === "style" ? r[n] = { ...o, ...a } : n === "className" && (r[n] = [o, a].filter(Boolean).join(" "));
  }
  return { ...e, ...r };
}
function it(e) {
  let t = Object.getOwnPropertyDescriptor(e.props, "ref")?.get, r = t && "isReactWarning" in t && t.isReactWarning;
  return r ? e.ref : (t = Object.getOwnPropertyDescriptor(e, "ref")?.get, r = t && "isReactWarning" in t && t.isReactWarning, r ? e.props.ref : e.props.ref || e.ref);
}
var ct = [
  "a",
  "button",
  "div",
  "form",
  "h2",
  "h3",
  "img",
  "input",
  "label",
  "li",
  "nav",
  "ol",
  "p",
  "span",
  "svg",
  "ul"
], St = ct.reduce((e, t) => {
  const r = u.forwardRef((n, o) => {
    const { asChild: a, ...c } = n, i = a ? de : t;
    return typeof window < "u" && (window[/* @__PURE__ */ Symbol.for("radix-ui")] = !0), /* @__PURE__ */ B(i, { ...c, ref: o });
  });
  return r.displayName = `Primitive.${t}`, { ...e, [t]: r };
}, {});
function Ct(e, t) {
  e && me.flushSync(() => e.dispatchEvent(t));
}
var ut = globalThis?.document ? u.useLayoutEffect : () => {
}, lt = u.useId || (() => {
}), st = 0;
function Et(e) {
  const [t, r] = u.useState(lt());
  return ut(() => {
    r((n) => n ?? String(st++));
  }, [e]), t ? `radix-${t}` : "";
}
export {
  St as P,
  rt as R,
  de as S,
  q as _,
  ut as a,
  Et as b,
  pe as c,
  Ct as d,
  yt as e,
  vt as f,
  pt as g,
  wt as h,
  mt as i,
  Z as j,
  ht as k,
  gt as l,
  fe as m,
  bt as u
};
