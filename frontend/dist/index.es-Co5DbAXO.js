import { r as be, a as mt, b as nt, c as Ln, d as Bn, e as xt, f as Oe, g as Ka, h as Ja, i as Ue, j as Ee, k as ce, l as en, m as Un, n as Fe, o as Fn, p as jn, q as tn, s as rn, t as Hn, u as zn, v as $n, w as Qe, x as an, y as st, z as le, A as Gn, B as Ae, C as bt, D as Wn, E as Xn, F as Ze, G as nn, H as sn, I as Yn, J as Qn, K as Zn, L as on, M as je, N as ot, O as kr, P as un, Q as qr, R as ln, S as Kn, T as Jn, U as es, V as ts, W as hn, X as rs } from "./web.dom-collections.iterator-LH99iQ_h.js";
import { _ as Ir } from "./jspdf.es.min-Bz8ZbFmQ.js";
import { C as is, D as fn } from "./index-DYsA9s7a.js";
var Xr = {}, Yr = {}, It, Qr;
function cn() {
  if (Qr) return It;
  Qr = 1;
  var o = be(), e = mt(), t = nt(), r = function(i) {
    return e.slice(0, i.length) === i;
  };
  return It = (function() {
    return r("Bun/") ? "BUN" : r("Cloudflare-Workers") ? "CLOUDFLARE" : r("Deno/") ? "DENO" : r("Node.js/") ? "NODE" : o.Bun && typeof Bun.version == "string" ? "BUN" : o.Deno && typeof Deno.version == "object" ? "DENO" : t(o.process) === "process" ? "NODE" : o.window && o.document ? "BROWSER" : "REST";
  })(), It;
}
var Mt, Zr;
function Et() {
  if (Zr) return Mt;
  Zr = 1;
  var o = cn();
  return Mt = o === "NODE", Mt;
}
var _t, Kr;
function as() {
  if (Kr) return _t;
  Kr = 1;
  var o = Ln(), e = Bn();
  return _t = function(t, r, i) {
    return i.get && o(i.get, r, { getter: !0 }), i.set && o(i.set, r, { setter: !0 }), e.f(t, r, i);
  }, _t;
}
var Vt, Jr;
function ns() {
  if (Jr) return Vt;
  Jr = 1;
  var o = xt(), e = as(), t = Oe(), r = Ka(), i = t("species");
  return Vt = function(a) {
    var s = o(a);
    r && s && !s[i] && e(s, i, {
      configurable: !0,
      get: function() {
        return this;
      }
    });
  }, Vt;
}
var Dt, ei;
function ss() {
  if (ei) return Dt;
  ei = 1;
  var o = Ja(), e = TypeError;
  return Dt = function(t, r) {
    if (o(r, t)) return t;
    throw new e("Incorrect invocation");
  }, Dt;
}
var kt, ti;
function os() {
  if (ti) return kt;
  ti = 1;
  var o = Oe(), e = o("toStringTag"), t = {};
  return t[e] = "z", kt = String(t) === "[object z]", kt;
}
var qt, ri;
function vn() {
  if (ri) return qt;
  ri = 1;
  var o = os(), e = Ue(), t = nt(), r = Oe(), i = r("toStringTag"), a = Object, s = t(/* @__PURE__ */ (function() {
    return arguments;
  })()) === "Arguments", n = function(u, l) {
    try {
      return u[l];
    } catch {
    }
  };
  return qt = o ? t : function(u) {
    var l, h, c;
    return u === void 0 ? "Undefined" : u === null ? "Null" : typeof (h = n(l = a(u), i)) == "string" ? h : s ? t(l) : (c = t(l)) === "Object" && e(l.callee) ? "Arguments" : c;
  }, qt;
}
var Lt, ii;
function us() {
  if (ii) return Lt;
  ii = 1;
  var o = Ee(), e = ce(), t = Ue(), r = vn(), i = xt(), a = en(), s = function() {
  }, n = i("Reflect", "construct"), u = /^\s*(?:class|function)\b/, l = o(u.exec), h = !u.test(s), c = function(d) {
    if (!t(d)) return !1;
    try {
      return n(s, [], d), !0;
    } catch {
      return !1;
    }
  }, v = function(d) {
    if (!t(d)) return !1;
    switch (r(d)) {
      case "AsyncFunction":
      case "GeneratorFunction":
      case "AsyncGeneratorFunction":
        return !1;
    }
    try {
      return h || !!l(u, a(d));
    } catch {
      return !0;
    }
  };
  return v.sham = !0, Lt = !n || e(function() {
    var f;
    return c(c.call) || !c(Object) || !c(function() {
      f = !0;
    }) || f;
  }) ? v : c, Lt;
}
var Bt, ai;
function ls() {
  if (ai) return Bt;
  ai = 1;
  var o = us(), e = Un(), t = TypeError;
  return Bt = function(r) {
    if (o(r)) return r;
    throw new t(e(r) + " is not a constructor");
  }, Bt;
}
var Ut, ni;
function gn() {
  if (ni) return Ut;
  ni = 1;
  var o = Fe(), e = ls(), t = Fn(), r = Oe(), i = r("species");
  return Ut = function(a, s) {
    var n = o(a).constructor, u;
    return n === void 0 || t(u = o(n)[i]) ? s : e(u);
  }, Ut;
}
var Ft, si;
function dn() {
  if (si) return Ft;
  si = 1;
  var o = jn(), e = Function.prototype, t = e.apply, r = e.call;
  return Ft = typeof Reflect == "object" && Reflect.apply || (o ? r.bind(t) : function() {
    return r.apply(t, arguments);
  }), Ft;
}
var jt, oi;
function hs() {
  if (oi) return jt;
  oi = 1;
  var o = Ee();
  return jt = o([].slice), jt;
}
var Ht, ui;
function fs() {
  if (ui) return Ht;
  ui = 1;
  var o = TypeError;
  return Ht = function(e, t) {
    if (e < t) throw new o("Not enough arguments");
    return e;
  }, Ht;
}
var zt, li;
function pn() {
  if (li) return zt;
  li = 1;
  var o = mt();
  return zt = /ipad|iphone|ipod/i.test(o) && /applewebkit/i.test(o), zt;
}
var $t, hi;
function yn() {
  if (hi) return $t;
  hi = 1;
  var o = be(), e = dn(), t = tn(), r = Ue(), i = rn(), a = ce(), s = Hn(), n = hs(), u = zn(), l = fs(), h = pn(), c = Et(), v = o.setImmediate, f = o.clearImmediate, d = o.process, g = o.Dispatch, p = o.Function, y = o.MessageChannel, b = o.String, m = 0, x = {}, A = "onreadystatechange", C, T, O, P;
  a(function() {
    C = o.location;
  });
  var V = function(w) {
    if (i(x, w)) {
      var _ = x[w];
      delete x[w], _();
    }
  }, U = function(w) {
    return function() {
      V(w);
    };
  }, N = function(w) {
    V(w.data);
  }, q = function(w) {
    o.postMessage(b(w), C.protocol + "//" + C.host);
  };
  return (!v || !f) && (v = function(_) {
    l(arguments.length, 1);
    var $ = r(_) ? _ : p(_), F = n(arguments, 1);
    return x[++m] = function() {
      e($, void 0, F);
    }, T(m), m;
  }, f = function(_) {
    delete x[_];
  }, c ? T = function(w) {
    d.nextTick(U(w));
  } : g && g.now ? T = function(w) {
    g.now(U(w));
  } : y && !h ? (O = new y(), P = O.port2, O.port1.onmessage = N, T = t(P.postMessage, P)) : o.addEventListener && r(o.postMessage) && !o.importScripts && C && C.protocol !== "file:" && !a(q) ? (T = q, o.addEventListener("message", N, !1)) : A in u("script") ? T = function(w) {
    s.appendChild(u("script"))[A] = function() {
      s.removeChild(this), V(w);
    };
  } : T = function(w) {
    setTimeout(U(w), 0);
  }), $t = {
    set: v,
    clear: f
  }, $t;
}
var Gt, fi;
function cs() {
  if (fi) return Gt;
  fi = 1;
  var o = be(), e = Ka(), t = Object.getOwnPropertyDescriptor;
  return Gt = function(r) {
    if (!e) return o[r];
    var i = t(o, r);
    return i && i.value;
  }, Gt;
}
var Wt, ci;
function mn() {
  if (ci) return Wt;
  ci = 1;
  var o = function() {
    this.head = null, this.tail = null;
  };
  return o.prototype = {
    add: function(e) {
      var t = { item: e, next: null }, r = this.tail;
      r ? r.next = t : this.head = t, this.tail = t;
    },
    get: function() {
      var e = this.head;
      if (e) {
        var t = this.head = e.next;
        return t === null && (this.tail = null), e.item;
      }
    }
  }, Wt = o, Wt;
}
var Xt, vi;
function vs() {
  if (vi) return Xt;
  vi = 1;
  var o = mt();
  return Xt = /ipad|iphone|ipod/i.test(o) && typeof Pebble < "u", Xt;
}
var Yt, gi;
function gs() {
  if (gi) return Yt;
  gi = 1;
  var o = mt();
  return Yt = /web0s(?!.*chrome)/i.test(o), Yt;
}
var Qt, di;
function ds() {
  if (di) return Qt;
  di = 1;
  var o = be(), e = cs(), t = tn(), r = yn().set, i = mn(), a = pn(), s = vs(), n = gs(), u = Et(), l = o.MutationObserver || o.WebKitMutationObserver, h = o.document, c = o.process, v = o.Promise, f = e("queueMicrotask"), d, g, p, y, b;
  if (!f) {
    var m = new i(), x = function() {
      var A, C;
      for (u && (A = c.domain) && A.exit(); C = m.get(); ) try {
        C();
      } catch (T) {
        throw m.head && d(), T;
      }
      A && A.enter();
    };
    !a && !u && !n && l && h ? (g = !0, p = h.createTextNode(""), new l(x).observe(p, { characterData: !0 }), d = function() {
      p.data = g = !g;
    }) : !s && v && v.resolve ? (y = v.resolve(void 0), y.constructor = v, b = t(y.then, y), d = function() {
      b(x);
    }) : u ? d = function() {
      c.nextTick(x);
    } : (r = t(r, o), d = function() {
      r(x);
    }), f = function(A) {
      m.head || d(), m.add(A);
    };
  }
  return Qt = f, Qt;
}
var Zt, pi;
function ps() {
  return pi || (pi = 1, Zt = function(o, e) {
    try {
      arguments.length === 1 ? console.error(o) : console.error(o, e);
    } catch {
    }
  }), Zt;
}
var Kt, yi;
function Lr() {
  return yi || (yi = 1, Kt = function(o) {
    try {
      return { error: !1, value: o() };
    } catch (e) {
      return { error: !0, value: e };
    }
  }), Kt;
}
var Jt, mi;
function ut() {
  if (mi) return Jt;
  mi = 1;
  var o = be();
  return Jt = o.Promise, Jt;
}
var er, xi;
function lt() {
  if (xi) return er;
  xi = 1;
  var o = be(), e = ut(), t = Ue(), r = $n(), i = en(), a = Oe(), s = cn(), n = Qe(), u = an(), l = e && e.prototype, h = a("species"), c = !1, v = t(o.PromiseRejectionEvent), f = r("Promise", function() {
    var d = i(e), g = d !== String(e);
    if (!g && u === 66 || n && !(l.catch && l.finally)) return !0;
    if (!u || u < 51 || !/native code/.test(d)) {
      var p = new e(function(m) {
        m(1);
      }), y = function(m) {
        m(function() {
        }, function() {
        });
      }, b = p.constructor = {};
      if (b[h] = y, c = p.then(function() {
      }) instanceof y, !c) return !0;
    }
    return !g && (s === "BROWSER" || s === "DENO") && !v;
  });
  return er = {
    CONSTRUCTOR: f,
    REJECTION_EVENT: v,
    SUBCLASSING: c
  }, er;
}
var tr = {}, bi;
function ht() {
  if (bi) return tr;
  bi = 1;
  var o = st(), e = TypeError, t = function(r) {
    var i, a;
    this.promise = new r(function(s, n) {
      if (i !== void 0 || a !== void 0) throw new e("Bad Promise constructor");
      i = s, a = n;
    }), this.resolve = o(i), this.reject = o(a);
  };
  return tr.f = function(r) {
    return new t(r);
  }, tr;
}
var Ei;
function ys() {
  if (Ei) return Yr;
  Ei = 1;
  var o = le(), e = Qe(), t = Et(), r = be(), i = Gn(), a = Ae(), s = bt(), n = Wn(), u = Xn(), l = ns(), h = st(), c = Ue(), v = Ze(), f = ss(), d = gn(), g = yn().set, p = ds(), y = ps(), b = Lr(), m = mn(), x = nn(), A = ut(), C = lt(), T = ht(), O = "Promise", P = C.CONSTRUCTOR, V = C.REJECTION_EVENT, U = C.SUBCLASSING, N = x.getterFor(O), q = x.set, w = A && A.prototype, _ = A, $ = w, F = r.TypeError, L = r.document, M = r.process, I = T.f, j = I, D = !!(L && L.createEvent && r.dispatchEvent), G = "unhandledrejection", J = "rejectionhandled", ee = 0, te = 1, re = 2, Ve = 1, De = 2, ae, Se, Ce, fe, ne = function(S) {
    var k;
    return v(S) && c(k = S.then) ? k : !1;
  }, ve = function(S, k) {
    var H = k.value, z = k.state === te, W = z ? S.ok : S.fail, de = S.resolve, Ne = S.reject, pe = S.domain, ye, et, tt;
    try {
      W ? (z || (k.rejection === De && ke(k), k.rejection = Ve), W === !0 ? ye = H : (pe && pe.enter(), ye = W(H), pe && (pe.exit(), tt = !0)), ye === S.promise ? Ne(new F("Promise-chain cycle")) : (et = ne(ye)) ? a(et, ye, de, Ne) : de(ye)) : Ne(H);
    } catch (rt) {
      pe && !tt && pe.exit(), Ne(rt);
    }
  }, Re = function(S, k) {
    S.notified || (S.notified = !0, p(function() {
      for (var H = S.reactions, z; z = H.get(); )
        ve(z, S);
      S.notified = !1, k && !S.rejection && He(S);
    }));
  }, Pe = function(S, k, H) {
    var z, W;
    D ? (z = L.createEvent("Event"), z.promise = k, z.reason = H, z.initEvent(S, !1, !0), r.dispatchEvent(z)) : z = { promise: k, reason: H }, !V && (W = r["on" + S]) ? W(z) : S === G && y("Unhandled promise rejection", H);
  }, He = function(S) {
    a(g, r, function() {
      var k = S.facade, H = S.value, z = Je(S), W;
      if (z && (W = b(function() {
        t ? M.emit("unhandledRejection", H, k) : Pe(G, k, H);
      }), S.rejection = t || Je(S) ? De : Ve, W.error))
        throw W.value;
    });
  }, Je = function(S) {
    return S.rejection !== Ve && !S.parent;
  }, ke = function(S) {
    a(g, r, function() {
      var k = S.facade;
      t ? M.emit("rejectionHandled", k) : Pe(J, k, S.value);
    });
  }, se = function(S, k, H) {
    return function(z) {
      S(k, z, H);
    };
  }, oe = function(S, k, H) {
    S.done || (S.done = !0, H && (S = H), S.value = k, S.state = re, Re(S, !0));
  }, ge = function(S, k, H) {
    if (!S.done) {
      S.done = !0, H && (S = H);
      try {
        if (S.facade === k) throw new F("Promise can't be resolved itself");
        var z = ne(k);
        z ? p(function() {
          var W = { done: !1 };
          try {
            a(
              z,
              k,
              se(ge, W, S),
              se(oe, W, S)
            );
          } catch (de) {
            oe(W, de, S);
          }
        }) : (S.value = k, S.state = te, Re(S, !1));
      } catch (W) {
        oe({ done: !1 }, W, S);
      }
    }
  };
  if (P && (_ = function(k) {
    f(this, $), h(k), a(ae, this);
    var H = N(this);
    try {
      k(se(ge, H), se(oe, H));
    } catch (z) {
      oe(H, z);
    }
  }, $ = _.prototype, ae = function(k) {
    q(this, {
      type: O,
      done: !1,
      notified: !1,
      parent: !1,
      reactions: new m(),
      rejection: !1,
      state: ee,
      value: null
    });
  }, ae.prototype = s($, "then", function(k, H) {
    var z = N(this), W = I(d(this, _));
    return z.parent = !0, W.ok = c(k) ? k : !0, W.fail = c(H) && H, W.domain = t ? M.domain : void 0, z.state === ee ? z.reactions.add(W) : p(function() {
      ve(W, z);
    }), W.promise;
  }), Se = function() {
    var S = new ae(), k = N(S);
    this.promise = S, this.resolve = se(ge, k), this.reject = se(oe, k);
  }, T.f = I = function(S) {
    return S === _ || S === Ce ? new Se(S) : j(S);
  }, !e && c(A) && w !== Object.prototype)) {
    fe = w.then, U || s(w, "then", function(k, H) {
      var z = this;
      return new _(function(W, de) {
        a(fe, z, W, de);
      }).then(k, H);
    }, { unsafe: !0 });
    try {
      delete w.constructor;
    } catch {
    }
    n && n(w, $);
  }
  return o({ global: !0, constructor: !0, wrap: !0, forced: P }, {
    Promise: _
  }), Ce = i.Promise, u(_, O, !1, !0), l(O), Yr;
}
var Ti = {}, rr, Si;
function ms() {
  if (Si) return rr;
  Si = 1;
  var o = Oe(), e = o("iterator"), t = !1;
  try {
    var r = 0, i = {
      next: function() {
        return { done: !!r++ };
      },
      return: function() {
        t = !0;
      }
    };
    i[e] = function() {
      return this;
    }, Array.from(i, function() {
      throw 2;
    });
  } catch {
  }
  return rr = function(a, s) {
    try {
      if (!s && !t) return !1;
    } catch {
      return !1;
    }
    var n = !1;
    try {
      var u = {};
      u[e] = function() {
        return {
          next: function() {
            return { done: n = !0 };
          }
        };
      }, a(u);
    } catch {
    }
    return n;
  }, rr;
}
var ir, Ci;
function xn() {
  if (Ci) return ir;
  Ci = 1;
  var o = ut(), e = ms(), t = lt().CONSTRUCTOR;
  return ir = t || !e(function(r) {
    o.all(r).then(void 0, function() {
    });
  }), ir;
}
var Oi;
function xs() {
  if (Oi) return Ti;
  Oi = 1;
  var o = le(), e = Ae(), t = st(), r = ht(), i = Lr(), a = sn(), s = xn();
  return o({ target: "Promise", stat: !0, forced: s }, {
    all: function(u) {
      var l = this, h = r.f(l), c = h.resolve, v = h.reject, f = i(function() {
        var d = t(l.resolve), g = [], p = 0, y = 1;
        a(u, function(b) {
          var m = p++, x = !1;
          y++, e(d, l, b).then(function(A) {
            x || (x = !0, g[m] = A, --y || c(g));
          }, v);
        }), --y || c(g);
      });
      return f.error && v(f.value), h.promise;
    }
  }), Ti;
}
var Ai = {}, wi;
function bs() {
  if (wi) return Ai;
  wi = 1;
  var o = le(), e = Qe(), t = lt().CONSTRUCTOR, r = ut(), i = xt(), a = Ue(), s = bt(), n = r && r.prototype;
  if (o({ target: "Promise", proto: !0, forced: t, real: !0 }, {
    catch: function(l) {
      return this.then(void 0, l);
    }
  }), !e && a(r)) {
    var u = i("Promise").prototype.catch;
    n.catch !== u && s(n, "catch", u, { unsafe: !0 });
  }
  return Ai;
}
var Ri = {}, Pi;
function Es() {
  if (Pi) return Ri;
  Pi = 1;
  var o = le(), e = Ae(), t = st(), r = ht(), i = Lr(), a = sn(), s = xn();
  return o({ target: "Promise", stat: !0, forced: s }, {
    race: function(u) {
      var l = this, h = r.f(l), c = h.reject, v = i(function() {
        var f = t(l.resolve);
        a(u, function(d) {
          e(f, l, d).then(h.resolve, c);
        });
      });
      return v.error && c(v.value), h.promise;
    }
  }), Ri;
}
var Ni = {}, Ii;
function Ts() {
  if (Ii) return Ni;
  Ii = 1;
  var o = le(), e = ht(), t = lt().CONSTRUCTOR;
  return o({ target: "Promise", stat: !0, forced: t }, {
    reject: function(i) {
      var a = e.f(this), s = a.reject;
      return s(i), a.promise;
    }
  }), Ni;
}
var Mi = {}, ar, _i;
function Ss() {
  if (_i) return ar;
  _i = 1;
  var o = Fe(), e = Ze(), t = ht();
  return ar = function(r, i) {
    if (o(r), e(i) && i.constructor === r) return i;
    var a = t.f(r), s = a.resolve;
    return s(i), a.promise;
  }, ar;
}
var Vi;
function Cs() {
  if (Vi) return Mi;
  Vi = 1;
  var o = le(), e = xt(), t = Qe(), r = ut(), i = lt().CONSTRUCTOR, a = Ss(), s = e("Promise"), n = t && !i;
  return o({ target: "Promise", stat: !0, forced: t || i }, {
    resolve: function(l) {
      return a(n && this === s ? r : this, l);
    }
  }), Mi;
}
var Di;
function Os() {
  return Di || (Di = 1, ys(), xs(), bs(), Es(), Ts(), Cs()), Xr;
}
Os();
function ki(o, e, t, r, i, a, s) {
  try {
    var n = o[a](s), u = n.value;
  } catch (l) {
    return void t(l);
  }
  n.done ? e(u) : Promise.resolve(u).then(r, i);
}
function _e(o) {
  return function() {
    var e = this, t = arguments;
    return new Promise(function(r, i) {
      var a = o.apply(e, t);
      function s(u) {
        ki(a, r, i, s, n, "next", u);
      }
      function n(u) {
        ki(a, r, i, s, n, "throw", u);
      }
      s(void 0);
    });
  };
}
var qi = {}, Li = {}, nr, Bi;
function we() {
  if (Bi) return nr;
  Bi = 1;
  var o = vn(), e = String;
  return nr = function(t) {
    if (o(t) === "Symbol") throw new TypeError("Cannot convert a Symbol value to a string");
    return e(t);
  }, nr;
}
var sr, Ui;
function bn() {
  if (Ui) return sr;
  Ui = 1;
  var o = Fe();
  return sr = function() {
    var e = o(this), t = "";
    return e.hasIndices && (t += "d"), e.global && (t += "g"), e.ignoreCase && (t += "i"), e.multiline && (t += "m"), e.dotAll && (t += "s"), e.unicode && (t += "u"), e.unicodeSets && (t += "v"), e.sticky && (t += "y"), t;
  }, sr;
}
var or, Fi;
function En() {
  if (Fi) return or;
  Fi = 1;
  var o = ce(), e = be(), t = e.RegExp, r = o(function() {
    var s = t("a", "y");
    return s.lastIndex = 2, s.exec("abcd") !== null;
  }), i = r || o(function() {
    return !t("a", "y").sticky;
  }), a = r || o(function() {
    var s = t("^r", "gy");
    return s.lastIndex = 2, s.exec("str") !== null;
  });
  return or = {
    BROKEN_CARET: a,
    MISSED_STICKY: i,
    UNSUPPORTED_Y: r
  }, or;
}
var ur, ji;
function As() {
  if (ji) return ur;
  ji = 1;
  var o = ce(), e = be(), t = e.RegExp;
  return ur = o(function() {
    var r = t(".", "s");
    return !(r.dotAll && r.test(`
`) && r.flags === "s");
  }), ur;
}
var lr, Hi;
function ws() {
  if (Hi) return lr;
  Hi = 1;
  var o = ce(), e = be(), t = e.RegExp;
  return lr = o(function() {
    var r = t("(?<a>b)", "g");
    return r.exec("b").groups.a !== "b" || "b".replace(r, "$<a>c") !== "bc";
  }), lr;
}
var hr, zi;
function Br() {
  if (zi) return hr;
  zi = 1;
  var o = Ae(), e = Ee(), t = we(), r = bn(), i = En(), a = Yn(), s = Qn(), n = nn().get, u = As(), l = ws(), h = a("native-string-replace", String.prototype.replace), c = RegExp.prototype.exec, v = c, f = e("".charAt), d = e("".indexOf), g = e("".replace), p = e("".slice), y = (function() {
    var C = /a/, T = /b*/g;
    return o(c, C, "a"), o(c, T, "a"), C.lastIndex !== 0 || T.lastIndex !== 0;
  })(), b = i.BROKEN_CARET, m = /()??/.exec("")[1] !== void 0, x = y || m || b || u || l, A = function(C, T) {
    for (var O = C.groups = s(null), P = 0; P < T.length; P++) {
      var V = T[P];
      O[V[0]] = C[V[1]];
    }
  };
  return x && (v = function(T) {
    var O = this, P = n(O), V = t(T), U = P.raw, N, q, w;
    if (U)
      return U.lastIndex = O.lastIndex, N = o(v, U, V), O.lastIndex = U.lastIndex, N && P.groups && A(N, P.groups), N;
    var _ = P.groups, $ = b && O.sticky, F = o(r, O), L = O.source, M = 0, I = V;
    if ($) {
      F = g(F, "y", ""), d(F, "g") === -1 && (F += "g"), I = p(V, O.lastIndex);
      var j = O.lastIndex > 0 && f(V, O.lastIndex - 1);
      O.lastIndex > 0 && (!O.multiline || O.multiline && j !== `
` && j !== "\r" && j !== "\u2028" && j !== "\u2029") && (L = "(?: (?:" + L + "))", I = " " + I, M++), q = new RegExp("^(?:" + L + ")", F);
    }
    m && (q = new RegExp("^" + L + "$(?!\\s)", F)), y && (w = O.lastIndex);
    var D = o(c, $ ? q : O, I);
    return $ ? D ? (D.input = V, D[0] = p(D[0], M), D.index = O.lastIndex, O.lastIndex += D[0].length) : O.lastIndex = 0 : y && D && (O.lastIndex = O.global ? D.index + D[0].length : w), m && D && D.length > 1 && o(h, D[0], q, function() {
      for (var G = 1; G < arguments.length - 2; G++)
        arguments[G] === void 0 && (D[G] = void 0);
    }), D && _ && A(D, _), D;
  }), hr = v, hr;
}
var $i;
function Rs() {
  if ($i) return Li;
  $i = 1;
  var o = le(), e = Br();
  return o({ target: "RegExp", proto: !0, forced: /./.exec !== e }, {
    exec: e
  }), Li;
}
var fr, Gi;
function Ur() {
  if (Gi) return fr;
  Gi = 1, Rs();
  var o = Ae(), e = bt(), t = Br(), r = ce(), i = Oe(), a = Zn(), s = i("species"), n = RegExp.prototype;
  return fr = function(u, l, h, c) {
    var v = i(u), f = !r(function() {
      var y = {};
      return y[v] = function() {
        return 7;
      }, ""[u](y) !== 7;
    }), d = f && !r(function() {
      var y = !1, b = /a/;
      if (u === "split") {
        var m = {};
        m[s] = function() {
          return b;
        }, b = { constructor: m, flags: "" }, b[v] = /./[v];
      }
      return b.exec = function() {
        return y = !0, null;
      }, b[v](""), !y;
    });
    if (!f || !d || h) {
      var g = /./[v], p = l(v, ""[u], function(y, b, m, x, A) {
        var C = b.exec;
        return C === t || C === n.exec ? f && !A ? { done: !0, value: o(g, b, m, x) } : { done: !0, value: o(y, m, b, x) } : { done: !1 };
      });
      e(String.prototype, u, p[0]), e(n, v, p[1]);
    }
    c && a(n[v], "sham", !0);
  }, fr;
}
var cr, Wi;
function Ps() {
  if (Wi) return cr;
  Wi = 1;
  var o = Ee(), e = on(), t = we(), r = je(), i = o("".charAt), a = o("".charCodeAt), s = o("".slice), n = function(u) {
    return function(l, h) {
      var c = t(r(l)), v = e(h), f = c.length, d, g;
      return v < 0 || v >= f ? u ? "" : void 0 : (d = a(c, v), d < 55296 || d > 56319 || v + 1 === f || (g = a(c, v + 1)) < 56320 || g > 57343 ? u ? i(c, v) : d : u ? s(c, v, v + 2) : (d - 55296 << 10) + (g - 56320) + 65536);
    };
  };
  return cr = {
    // `String.prototype.codePointAt` method
    // https://tc39.es/ecma262/#sec-string.prototype.codepointat
    codeAt: n(!1),
    // `String.prototype.at` method
    // https://github.com/mathiasbynens/String.prototype.at
    charAt: n(!0)
  }, cr;
}
var vr, Xi;
function Fr() {
  if (Xi) return vr;
  Xi = 1;
  var o = Ps().charAt;
  return vr = function(e, t, r) {
    return t + (r && o(e, t).length || 1);
  }, vr;
}
var gr, Yi;
function Ns() {
  if (Yi) return gr;
  Yi = 1;
  var o = be(), e = ce(), t = o.RegExp, r = !e(function() {
    var i = !0;
    try {
      t(".", "d");
    } catch {
      i = !1;
    }
    var a = {}, s = "", n = i ? "dgimsy" : "gimsy", u = function(v, f) {
      Object.defineProperty(a, v, { get: function() {
        return s += f, !0;
      } });
    }, l = {
      dotAll: "s",
      global: "g",
      ignoreCase: "i",
      multiline: "m",
      sticky: "y"
    };
    i && (l.hasIndices = "d");
    for (var h in l) u(h, l[h]);
    var c = Object.getOwnPropertyDescriptor(t.prototype, "flags").get.call(a);
    return c !== n || s !== n;
  });
  return gr = { correct: r }, gr;
}
var dr, Qi;
function Tt() {
  if (Qi) return dr;
  Qi = 1;
  var o = Ae(), e = rn(), t = Ja(), r = Ns(), i = bn(), a = RegExp.prototype;
  return dr = r.correct ? function(s) {
    return s.flags;
  } : function(s) {
    return !r.correct && t(a, s) && !e(s, "flags") ? o(i, s) : s.flags;
  }, dr;
}
var pr, Zi;
function jr() {
  if (Zi) return pr;
  Zi = 1;
  var o = Ae(), e = Fe(), t = Ue(), r = nt(), i = Br(), a = TypeError;
  return pr = function(s, n) {
    var u = s.exec;
    if (t(u)) {
      var l = o(u, s, n);
      return l !== null && e(l), l;
    }
    if (r(s) === "RegExp") return o(i, s, n);
    throw new a("RegExp#exec called on incompatible receiver");
  }, pr;
}
var Ki;
function Is() {
  if (Ki) return qi;
  Ki = 1;
  var o = Ae(), e = Ee(), t = Ur(), r = Fe(), i = Ze(), a = ot(), s = we(), n = je(), u = kr(), l = Fr(), h = Tt(), c = jr(), v = e("".indexOf);
  return t("match", function(f, d, g) {
    return [
      // `String.prototype.match` method
      // https://tc39.es/ecma262/#sec-string.prototype.match
      function(y) {
        var b = n(this), m = i(y) ? u(y, f) : void 0;
        if (m) return o(m, y, b);
        var x = s(b);
        return new RegExp(y)[f](x);
      },
      // `RegExp.prototype[@@match]` method
      // https://tc39.es/ecma262/#sec-regexp.prototype-@@match
      function(p) {
        var y = r(this), b = s(p), m = g(d, y, b);
        if (m.done) return m.value;
        var x = s(h(y));
        if (!~v(x, "g")) return c(y, b);
        var A = !!~v(x, "u") || !!~v(x, "v");
        y.lastIndex = 0;
        for (var C = [], T = 0, O; (O = c(y, b)) !== null; ) {
          var P = s(O[0]);
          C[T] = P, P === "" && (y.lastIndex = l(b, a(y.lastIndex), A)), T++;
        }
        return T === 0 ? null : C;
      }
    ];
  }), qi;
}
Is();
var Ji = {}, yr, ea;
function Ms() {
  if (ea) return yr;
  ea = 1;
  var o = Ee(), e = un(), t = Math.floor, r = o("".charAt), i = o("".replace), a = o("".slice), s = /\$([$&'`]|\d{1,2}|<[^>]*>)/g, n = /\$([$&'`]|\d{1,2})/g;
  return yr = function(u, l, h, c, v, f) {
    var d = h + u.length, g = c.length, p = n;
    return v !== void 0 && (v = e(v), p = s), i(f, p, function(y, b) {
      var m;
      switch (r(b, 0)) {
        case "$":
          return "$";
        case "&":
          return u;
        case "`":
          return a(l, 0, h);
        case "'":
          return a(l, d);
        case "<":
          m = v[a(b, 1, -1)];
          break;
        default:
          var x = +b;
          if (x === 0) return y;
          if (x > g) {
            var A = t(x / 10);
            return A === 0 ? y : A <= g ? c[A - 1] === void 0 ? r(b, 1) : c[A - 1] + r(b, 1) : y;
          }
          m = c[x - 1];
      }
      return m === void 0 ? "" : m;
    });
  }, yr;
}
var ta;
function _s() {
  if (ta) return Ji;
  ta = 1;
  var o = dn(), e = Ae(), t = Ee(), r = Ur(), i = ce(), a = Fe(), s = Ue(), n = Ze(), u = on(), l = ot(), h = we(), c = je(), v = Fr(), f = kr(), d = Ms(), g = Tt(), p = jr(), y = Oe(), b = y("replace"), m = Math.max, x = Math.min, A = t([].concat), C = t([].push), T = t("".indexOf), O = t("".slice), P = function(q) {
    return q === void 0 ? q : String(q);
  }, V = (function() {
    return "a".replace(/./, "$0") === "$0";
  })(), U = (function() {
    return /./[b] ? /./[b]("a", "$0") === "" : !1;
  })(), N = !i(function() {
    var q = /./;
    return q.exec = function() {
      var w = [];
      return w.groups = { a: "7" }, w;
    }, "".replace(q, "$<a>") !== "7";
  });
  return r("replace", function(q, w, _) {
    var $ = U ? "$" : "$0";
    return [
      // `String.prototype.replace` method
      // https://tc39.es/ecma262/#sec-string.prototype.replace
      function(L, M) {
        var I = c(this), j = n(L) ? f(L, b) : void 0;
        return j ? e(j, L, I, M) : e(w, h(I), L, M);
      },
      // `RegExp.prototype[@@replace]` method
      // https://tc39.es/ecma262/#sec-regexp.prototype-@@replace
      function(F, L) {
        var M = a(this), I = h(F), j = s(L);
        j || (L = h(L));
        var D = h(g(M));
        if (typeof L == "string" && !~T(L, $) && !~T(L, "$<") && !~T(D, "y")) {
          var G = _(w, M, I, L);
          if (G.done) return G.value;
        }
        var J = !!~T(D, "g"), ee;
        J && (ee = !!~T(D, "u") || !!~T(D, "v"), M.lastIndex = 0);
        for (var te = [], re; re = p(M, I), !(re === null || (C(te, re), !J)); ) {
          var Ve = h(re[0]);
          Ve === "" && (M.lastIndex = v(I, l(M.lastIndex), ee));
        }
        for (var De = "", ae = 0, Se = 0; Se < te.length; Se++) {
          re = te[Se];
          for (var Ce = h(re[0]), fe = m(x(u(re.index), I.length), 0), ne = [], ve, Re = 1; Re < re.length; Re++) C(ne, P(re[Re]));
          var Pe = re.groups;
          if (j) {
            var He = A([Ce], ne, fe, I);
            Pe !== void 0 && C(He, Pe), ve = h(o(L, void 0, He));
          } else
            ve = d(Ce, I, fe, ne, Pe, L);
          fe >= ae && (De += O(I, ae, fe) + ve, ae = fe + Ce.length);
        }
        return De + O(I, ae);
      }
    ];
  }, !N || !V || U), Ji;
}
_s();
var ra = {}, mr, ia;
function Vs() {
  if (ia) return mr;
  ia = 1;
  var o = Ze(), e = nt(), t = Oe(), r = t("match");
  return mr = function(i) {
    var a;
    return o(i) && ((a = i[r]) !== void 0 ? !!a : e(i) === "RegExp");
  }, mr;
}
var xr, aa;
function Hr() {
  if (aa) return xr;
  aa = 1;
  var o = Vs(), e = TypeError;
  return xr = function(t) {
    if (o(t))
      throw new e("The method doesn't accept regular expressions");
    return t;
  }, xr;
}
var br, na;
function zr() {
  if (na) return br;
  na = 1;
  var o = Oe(), e = o("match");
  return br = function(t) {
    var r = /./;
    try {
      "/./"[t](r);
    } catch {
      try {
        return r[e] = !1, "/./"[t](r);
      } catch {
      }
    }
    return !1;
  }, br;
}
var sa;
function Ds() {
  if (sa) return ra;
  sa = 1;
  var o = le(), e = qr(), t = ln().f, r = ot(), i = we(), a = Hr(), s = je(), n = zr(), u = Qe(), l = e("".slice), h = Math.min, c = n("startsWith"), v = !u && !c && !!(function() {
    var f = t(String.prototype, "startsWith");
    return f && !f.writable;
  })();
  return o({ target: "String", proto: !0, forced: !v && !c }, {
    startsWith: function(d) {
      var g = i(s(this));
      a(d);
      var p = i(d), y = r(h(arguments.length > 1 ? arguments[1] : void 0, g.length));
      return l(g, y, y + p.length) === p;
    }
  }), ra;
}
Ds();
Kn();
Jn();
function ks(o, e) {
  if (Ir(o) != "object" || !o) return o;
  var t;
  if (typeof Symbol < "u" && (t = o[Symbol.toPrimitive]) !== void 0) {
    var r = t.call(o, e);
    if (Ir(r) != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(o);
}
function qs(o) {
  var e = ks(o, "string");
  return Ir(e) == "symbol" ? e : e + "";
}
function $r(o, e, t) {
  return (e = qs(e)) in o ? Object.defineProperty(o, e, {
    value: t,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : o[e] = t, o;
}
var oa = {}, Er, ua;
function Ls() {
  if (ua) return Er;
  ua = 1;
  var o = st(), e = un(), t = es(), r = ts(), i = TypeError, a = "Reduce of empty array with no initial value", s = function(n) {
    return function(u, l, h, c) {
      var v = e(u), f = t(v), d = r(v);
      if (o(l), d === 0 && h < 2) throw new i(a);
      var g = n ? d - 1 : 0, p = n ? -1 : 1;
      if (h < 2) for (; ; ) {
        if (g in f) {
          c = f[g], g += p;
          break;
        }
        if (g += p, n ? g < 0 : d <= g)
          throw new i(a);
      }
      for (; n ? g >= 0 : d > g; g += p) g in f && (c = l(c, f[g], g, v));
      return c;
    };
  };
  return Er = {
    // `Array.prototype.reduce` method
    // https://tc39.es/ecma262/#sec-array.prototype.reduce
    left: s(!1),
    // `Array.prototype.reduceRight` method
    // https://tc39.es/ecma262/#sec-array.prototype.reduceright
    right: s(!0)
  }, Er;
}
var Tr, la;
function Tn() {
  if (la) return Tr;
  la = 1;
  var o = ce();
  return Tr = function(e, t) {
    var r = [][e];
    return !!r && o(function() {
      r.call(null, t || function() {
        return 1;
      }, 1);
    });
  }, Tr;
}
var ha;
function Bs() {
  if (ha) return oa;
  ha = 1;
  var o = le(), e = Ls().left, t = Tn(), r = an(), i = Et(), a = !i && r > 79 && r < 83, s = a || !t("reduce");
  return o({ target: "Array", proto: !0, forced: s }, {
    reduce: function(u) {
      var l = arguments.length;
      return e(this, u, l, l > 1 ? arguments[1] : void 0);
    }
  }), oa;
}
Bs();
var fa = {}, ca;
function Us() {
  if (ca) return fa;
  ca = 1;
  var o = le(), e = qr(), t = ln().f, r = ot(), i = we(), a = Hr(), s = je(), n = zr(), u = Qe(), l = e("".slice), h = Math.min, c = n("endsWith"), v = !u && !c && !!(function() {
    var f = t(String.prototype, "endsWith");
    return f && !f.writable;
  })();
  return o({ target: "String", proto: !0, forced: !v && !c }, {
    endsWith: function(d) {
      var g = i(s(this));
      a(d);
      var p = i(d), y = arguments.length > 1 ? arguments[1] : void 0, b = g.length, m = y === void 0 ? b : h(r(y), b);
      return l(g, m - p.length, m) === p;
    }
  }), fa;
}
Us();
var va = {}, ga;
function Fs() {
  if (ga) return va;
  ga = 1;
  var o = Ae(), e = Ee(), t = Ur(), r = Fe(), i = Ze(), a = je(), s = gn(), n = Fr(), u = ot(), l = we(), h = kr(), c = Tt(), v = jr(), f = En(), d = ce(), g = f.UNSUPPORTED_Y, p = 4294967295, y = Math.min, b = e([].push), m = e("".slice), x = e("".indexOf), A = !d(function() {
    var T = /(?:)/, O = T.exec;
    T.exec = function() {
      return O.apply(this, arguments);
    };
    var P = "ab".split(T);
    return P.length !== 2 || P[0] !== "a" || P[1] !== "b";
  }), C = "abbc".split(/(b)*/)[1] === "c" || // eslint-disable-next-line regexp/no-empty-group -- required for testing
  "test".split(/(?:)/, -1).length !== 4 || "ab".split(/(?:ab)*/).length !== 2 || ".".split(/(.?)(.?)/).length !== 4 || // eslint-disable-next-line regexp/no-empty-capturing-group, regexp/no-empty-group -- required for testing
  ".".split(/()()/).length > 1 || "".split(/.?/).length;
  return t("split", function(T, O, P) {
    var V = "0".split(void 0, 0).length ? function(U, N) {
      return U === void 0 && N === 0 ? [] : o(O, this, U, N);
    } : O;
    return [
      // `String.prototype.split` method
      // https://tc39.es/ecma262/#sec-string.prototype.split
      function(N, q) {
        var w = a(this), _ = i(N) ? h(N, T) : void 0;
        return _ ? o(_, N, w, q) : o(V, l(w), N, q);
      },
      // `RegExp.prototype[@@split]` method
      // https://tc39.es/ecma262/#sec-regexp.prototype-@@split
      //
      // NOTE: This cannot be properly polyfilled in engines that don't support
      // the 'y' flag.
      function(U, N) {
        var q = r(this), w = l(U);
        if (!C) {
          var _ = P(V, q, w, N, V !== O);
          if (_.done) return _.value;
        }
        var $ = s(q, RegExp), F = l(c(q)), L = !!~x(F, "u") || !!~x(F, "v");
        g ? ~x(F, "g") || (F += "g") : ~x(F, "y") || (F += "y");
        var M = new $(g ? "^(?:" + q.source + ")" : q, F), I = N === void 0 ? p : N >>> 0;
        if (I === 0) return [];
        if (w.length === 0) return v(M, w) === null ? [w] : [];
        for (var j = 0, D = 0, G = []; D < w.length; ) {
          M.lastIndex = g ? 0 : D;
          var J = v(M, g ? m(w, D) : w), ee;
          if (J === null || (ee = y(u(M.lastIndex + (g ? D : 0)), w.length)) === j)
            D = n(w, D, L);
          else {
            if (b(G, m(w, j, D)), G.length === I) return G;
            for (var te = 1; te <= J.length - 1; te++)
              if (b(G, J[te]), G.length === I) return G;
            D = j = ee;
          }
        }
        return b(G, m(w, j)), G;
      }
    ];
  }, C || !A, g), va;
}
Fs();
var it = { exports: {} }, Ge = { exports: {} }, js = Ge.exports, da;
function Hs() {
  return da || (da = 1, (function() {
    var o, e, t, r, i, a;
    typeof performance < "u" && performance !== null && performance.now ? Ge.exports = function() {
      return performance.now();
    } : typeof process < "u" && process !== null && process.hrtime ? (Ge.exports = function() {
      return (o() - i) / 1e6;
    }, e = process.hrtime, o = function() {
      var s;
      return s = e(), s[0] * 1e9 + s[1];
    }, r = o(), a = process.uptime() * 1e9, i = r - a) : Date.now ? (Ge.exports = function() {
      return Date.now() - t;
    }, t = Date.now()) : (Ge.exports = function() {
      return (/* @__PURE__ */ new Date()).getTime() - t;
    }, t = (/* @__PURE__ */ new Date()).getTime());
  }).call(js)), Ge.exports;
}
var pa;
function zs() {
  if (pa) return it.exports;
  pa = 1;
  for (var o = Hs(), e = typeof window > "u" ? is : window, t = ["moz", "webkit"], r = "AnimationFrame", i = e["request" + r], a = e["cancel" + r] || e["cancelRequest" + r], s = 0; !i && s < t.length; s++)
    i = e[t[s] + "Request" + r], a = e[t[s] + "Cancel" + r] || e[t[s] + "CancelRequest" + r];
  if (!i || !a) {
    var n = 0, u = 0, l = [], h = 1e3 / 60;
    i = function(c) {
      if (l.length === 0) {
        var v = o(), f = Math.max(0, h - (v - n));
        n = f + v, setTimeout(function() {
          var d = l.slice(0);
          l.length = 0;
          for (var g = 0; g < d.length; g++)
            if (!d[g].cancelled)
              try {
                d[g].callback(n);
              } catch (p) {
                setTimeout(function() {
                  throw p;
                }, 0);
              }
        }, Math.round(f));
      }
      return l.push({
        handle: ++u,
        callback: c,
        cancelled: !1
      }), u;
    }, a = function(c) {
      for (var v = 0; v < l.length; v++)
        l[v].handle === c && (l[v].cancelled = !0);
    };
  }
  return it.exports = function(c) {
    return i.call(e, c);
  }, it.exports.cancel = function() {
    a.apply(e, arguments);
  }, it.exports.polyfill = function(c) {
    c || (c = e), c.requestAnimationFrame = i, c.cancelAnimationFrame = a;
  }, it.exports;
}
var $s = zs();
const Sr = /* @__PURE__ */ fn($s);
var ya = {}, Cr, ma;
function Sn() {
  return ma || (ma = 1, Cr = `	
\v\f\r                　\u2028\u2029\uFEFF`), Cr;
}
var Or, xa;
function Gs() {
  if (xa) return Or;
  xa = 1;
  var o = Ee(), e = je(), t = we(), r = Sn(), i = o("".replace), a = RegExp("^[" + r + "]+"), s = RegExp("(^|[^" + r + "])[" + r + "]+$"), n = function(u) {
    return function(l) {
      var h = t(e(l));
      return u & 1 && (h = i(h, a, "")), u & 2 && (h = i(h, s, "$1")), h;
    };
  };
  return Or = {
    // `String.prototype.{ trimLeft, trimStart }` methods
    // https://tc39.es/ecma262/#sec-string.prototype.trimstart
    start: n(1),
    // `String.prototype.{ trimRight, trimEnd }` methods
    // https://tc39.es/ecma262/#sec-string.prototype.trimend
    end: n(2),
    // `String.prototype.trim` method
    // https://tc39.es/ecma262/#sec-string.prototype.trim
    trim: n(3)
  }, Or;
}
var Ar, ba;
function Ws() {
  if (ba) return Ar;
  ba = 1;
  var o = hn().PROPER, e = ce(), t = Sn(), r = "​᠎";
  return Ar = function(i) {
    return e(function() {
      return !!t[i]() || r[i]() !== r || o && t[i].name !== i;
    });
  }, Ar;
}
var Ea;
function Xs() {
  if (Ea) return ya;
  Ea = 1;
  var o = le(), e = Gs().trim, t = Ws();
  return o({ target: "String", proto: !0, forced: t("trim") }, {
    trim: function() {
      return e(this);
    }
  }), ya;
}
Xs();
var wr, Ta;
function Ys() {
  return Ta || (Ta = 1, wr = function(o) {
    this.ok = !1, this.alpha = 1, o.charAt(0) == "#" && (o = o.substr(1, 6)), o = o.replace(/ /g, ""), o = o.toLowerCase();
    var e = {
      aliceblue: "f0f8ff",
      antiquewhite: "faebd7",
      aqua: "00ffff",
      aquamarine: "7fffd4",
      azure: "f0ffff",
      beige: "f5f5dc",
      bisque: "ffe4c4",
      black: "000000",
      blanchedalmond: "ffebcd",
      blue: "0000ff",
      blueviolet: "8a2be2",
      brown: "a52a2a",
      burlywood: "deb887",
      cadetblue: "5f9ea0",
      chartreuse: "7fff00",
      chocolate: "d2691e",
      coral: "ff7f50",
      cornflowerblue: "6495ed",
      cornsilk: "fff8dc",
      crimson: "dc143c",
      cyan: "00ffff",
      darkblue: "00008b",
      darkcyan: "008b8b",
      darkgoldenrod: "b8860b",
      darkgray: "a9a9a9",
      darkgreen: "006400",
      darkkhaki: "bdb76b",
      darkmagenta: "8b008b",
      darkolivegreen: "556b2f",
      darkorange: "ff8c00",
      darkorchid: "9932cc",
      darkred: "8b0000",
      darksalmon: "e9967a",
      darkseagreen: "8fbc8f",
      darkslateblue: "483d8b",
      darkslategray: "2f4f4f",
      darkturquoise: "00ced1",
      darkviolet: "9400d3",
      deeppink: "ff1493",
      deepskyblue: "00bfff",
      dimgray: "696969",
      dodgerblue: "1e90ff",
      feldspar: "d19275",
      firebrick: "b22222",
      floralwhite: "fffaf0",
      forestgreen: "228b22",
      fuchsia: "ff00ff",
      gainsboro: "dcdcdc",
      ghostwhite: "f8f8ff",
      gold: "ffd700",
      goldenrod: "daa520",
      gray: "808080",
      green: "008000",
      greenyellow: "adff2f",
      honeydew: "f0fff0",
      hotpink: "ff69b4",
      indianred: "cd5c5c",
      indigo: "4b0082",
      ivory: "fffff0",
      khaki: "f0e68c",
      lavender: "e6e6fa",
      lavenderblush: "fff0f5",
      lawngreen: "7cfc00",
      lemonchiffon: "fffacd",
      lightblue: "add8e6",
      lightcoral: "f08080",
      lightcyan: "e0ffff",
      lightgoldenrodyellow: "fafad2",
      lightgrey: "d3d3d3",
      lightgreen: "90ee90",
      lightpink: "ffb6c1",
      lightsalmon: "ffa07a",
      lightseagreen: "20b2aa",
      lightskyblue: "87cefa",
      lightslateblue: "8470ff",
      lightslategray: "778899",
      lightsteelblue: "b0c4de",
      lightyellow: "ffffe0",
      lime: "00ff00",
      limegreen: "32cd32",
      linen: "faf0e6",
      magenta: "ff00ff",
      maroon: "800000",
      mediumaquamarine: "66cdaa",
      mediumblue: "0000cd",
      mediumorchid: "ba55d3",
      mediumpurple: "9370d8",
      mediumseagreen: "3cb371",
      mediumslateblue: "7b68ee",
      mediumspringgreen: "00fa9a",
      mediumturquoise: "48d1cc",
      mediumvioletred: "c71585",
      midnightblue: "191970",
      mintcream: "f5fffa",
      mistyrose: "ffe4e1",
      moccasin: "ffe4b5",
      navajowhite: "ffdead",
      navy: "000080",
      oldlace: "fdf5e6",
      olive: "808000",
      olivedrab: "6b8e23",
      orange: "ffa500",
      orangered: "ff4500",
      orchid: "da70d6",
      palegoldenrod: "eee8aa",
      palegreen: "98fb98",
      paleturquoise: "afeeee",
      palevioletred: "d87093",
      papayawhip: "ffefd5",
      peachpuff: "ffdab9",
      peru: "cd853f",
      pink: "ffc0cb",
      plum: "dda0dd",
      powderblue: "b0e0e6",
      purple: "800080",
      rebeccapurple: "663399",
      red: "ff0000",
      rosybrown: "bc8f8f",
      royalblue: "4169e1",
      saddlebrown: "8b4513",
      salmon: "fa8072",
      sandybrown: "f4a460",
      seagreen: "2e8b57",
      seashell: "fff5ee",
      sienna: "a0522d",
      silver: "c0c0c0",
      skyblue: "87ceeb",
      slateblue: "6a5acd",
      slategray: "708090",
      snow: "fffafa",
      springgreen: "00ff7f",
      steelblue: "4682b4",
      tan: "d2b48c",
      teal: "008080",
      thistle: "d8bfd8",
      tomato: "ff6347",
      turquoise: "40e0d0",
      violet: "ee82ee",
      violetred: "d02090",
      wheat: "f5deb3",
      white: "ffffff",
      whitesmoke: "f5f5f5",
      yellow: "ffff00",
      yellowgreen: "9acd32"
    };
    o = e[o] || o;
    for (var t = [
      {
        re: /^rgba\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),\s*((?:\d?\.)?\d)\)$/,
        example: ["rgba(123, 234, 45, 0.8)", "rgba(255,234,245,1.0)"],
        process: function(u) {
          return [
            parseInt(u[1]),
            parseInt(u[2]),
            parseInt(u[3]),
            parseFloat(u[4])
          ];
        }
      },
      {
        re: /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/,
        example: ["rgb(123, 234, 45)", "rgb(255,234,245)"],
        process: function(u) {
          return [
            parseInt(u[1]),
            parseInt(u[2]),
            parseInt(u[3])
          ];
        }
      },
      {
        re: /^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
        example: ["#00ff00", "336699"],
        process: function(u) {
          return [
            parseInt(u[1], 16),
            parseInt(u[2], 16),
            parseInt(u[3], 16)
          ];
        }
      },
      {
        re: /^([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
        example: ["#fb0", "f0f"],
        process: function(u) {
          return [
            parseInt(u[1] + u[1], 16),
            parseInt(u[2] + u[2], 16),
            parseInt(u[3] + u[3], 16)
          ];
        }
      }
    ], r = 0; r < t.length; r++) {
      var i = t[r].re, a = t[r].process, s = i.exec(o);
      if (s) {
        var n = a(s);
        this.r = n[0], this.g = n[1], this.b = n[2], n.length > 3 && (this.alpha = n[3]), this.ok = !0;
      }
    }
    this.r = this.r < 0 || isNaN(this.r) ? 0 : this.r > 255 ? 255 : this.r, this.g = this.g < 0 || isNaN(this.g) ? 0 : this.g > 255 ? 255 : this.g, this.b = this.b < 0 || isNaN(this.b) ? 0 : this.b > 255 ? 255 : this.b, this.alpha = this.alpha < 0 ? 0 : this.alpha > 1 || isNaN(this.alpha) ? 1 : this.alpha, this.toRGB = function() {
      return "rgb(" + this.r + ", " + this.g + ", " + this.b + ")";
    }, this.toRGBA = function() {
      return "rgba(" + this.r + ", " + this.g + ", " + this.b + ", " + this.alpha + ")";
    }, this.toHex = function() {
      var u = this.r.toString(16), l = this.g.toString(16), h = this.b.toString(16);
      return u.length == 1 && (u = "0" + u), l.length == 1 && (l = "0" + l), h.length == 1 && (h = "0" + h), "#" + u + l + h;
    }, this.getHelpXML = function() {
      for (var u = new Array(), l = 0; l < t.length; l++)
        for (var h = t[l].example, c = 0; c < h.length; c++)
          u[u.length] = h[c];
      for (var v in e)
        u[u.length] = v;
      var f = document.createElement("ul");
      f.setAttribute("id", "rgbcolor-examples");
      for (var l = 0; l < u.length; l++)
        try {
          var d = document.createElement("li"), g = new RGBColor(u[l]), p = document.createElement("div");
          p.style.cssText = "margin: 3px; border: 1px solid black; background:" + g.toHex() + "; color:" + g.toHex(), p.appendChild(document.createTextNode("test"));
          var y = document.createTextNode(
            " " + u[l] + " -> " + g.toRGB() + " -> " + g.toHex()
          );
          d.appendChild(p), d.appendChild(y), f.appendChild(d);
        } catch {
        }
      return f;
    };
  }), wr;
}
var Qs = Ys();
const Mr = /* @__PURE__ */ fn(Qs);
var Sa = {}, Ca;
function Zs() {
  if (Ca) return Sa;
  Ca = 1;
  var o = le(), e = qr(), t = rs().indexOf, r = Tn(), i = e([].indexOf), a = !!i && 1 / i([1], 1, -0) < 0, s = a || !r("indexOf");
  return o({ target: "Array", proto: !0, forced: s }, {
    indexOf: function(u) {
      var l = arguments.length > 1 ? arguments[1] : void 0;
      return a ? i(this, u, l) || 0 : t(this, u, l);
    }
  }), Sa;
}
Zs();
var Oa = {}, Aa;
function Ks() {
  if (Aa) return Oa;
  Aa = 1;
  var o = le(), e = Ee(), t = Hr(), r = je(), i = we(), a = zr(), s = e("".indexOf);
  return o({ target: "String", proto: !0, forced: !a("includes") }, {
    includes: function(u) {
      return !!~s(
        i(r(this)),
        i(t(u)),
        arguments.length > 1 ? arguments[1] : void 0
      );
    }
  }), Oa;
}
Ks();
var wa = {}, Rr, Ra;
function Js() {
  if (Ra) return Rr;
  Ra = 1;
  var o = nt();
  return Rr = Array.isArray || function(t) {
    return o(t) === "Array";
  }, Rr;
}
var Pa;
function eo() {
  if (Pa) return wa;
  Pa = 1;
  var o = le(), e = Ee(), t = Js(), r = e([].reverse), i = [1, 2];
  return o({ target: "Array", proto: !0, forced: String(i) === String(i.reverse()) }, {
    reverse: function() {
      return t(this) && (this.length = this.length), r(this);
    }
  }), wa;
}
eo();
var Cn = function(o, e) {
  return (Cn = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(t, r) {
    t.__proto__ = r;
  } || function(t, r) {
    for (var i in r) Object.prototype.hasOwnProperty.call(r, i) && (t[i] = r[i]);
  })(o, e);
};
function On(o, e) {
  if (typeof e != "function" && e !== null) throw new TypeError("Class extends value " + String(e) + " is not a constructor or null");
  function t() {
    this.constructor = o;
  }
  Cn(o, e), o.prototype = e === null ? Object.create(e) : (t.prototype = e.prototype, new t());
}
function to(o) {
  var e = "";
  Array.isArray(o) || (o = [o]);
  for (var t = 0; t < o.length; t++) {
    var r = o[t];
    if (r.type === E.CLOSE_PATH) e += "z";
    else if (r.type === E.HORIZ_LINE_TO) e += (r.relative ? "h" : "H") + r.x;
    else if (r.type === E.VERT_LINE_TO) e += (r.relative ? "v" : "V") + r.y;
    else if (r.type === E.MOVE_TO) e += (r.relative ? "m" : "M") + r.x + " " + r.y;
    else if (r.type === E.LINE_TO) e += (r.relative ? "l" : "L") + r.x + " " + r.y;
    else if (r.type === E.CURVE_TO) e += (r.relative ? "c" : "C") + r.x1 + " " + r.y1 + " " + r.x2 + " " + r.y2 + " " + r.x + " " + r.y;
    else if (r.type === E.SMOOTH_CURVE_TO) e += (r.relative ? "s" : "S") + r.x2 + " " + r.y2 + " " + r.x + " " + r.y;
    else if (r.type === E.QUAD_TO) e += (r.relative ? "q" : "Q") + r.x1 + " " + r.y1 + " " + r.x + " " + r.y;
    else if (r.type === E.SMOOTH_QUAD_TO) e += (r.relative ? "t" : "T") + r.x + " " + r.y;
    else {
      if (r.type !== E.ARC) throw new Error('Unexpected command type "' + r.type + '" at index ' + t + ".");
      e += (r.relative ? "a" : "A") + r.rX + " " + r.rY + " " + r.xRot + " " + +r.lArcFlag + " " + +r.sweepFlag + " " + r.x + " " + r.y;
    }
  }
  return e;
}
function _r(o, e) {
  var t = o[0], r = o[1];
  return [t * Math.cos(e) - r * Math.sin(e), t * Math.sin(e) + r * Math.cos(e)];
}
function xe() {
  for (var o = [], e = 0; e < arguments.length; e++) o[e] = arguments[e];
  for (var t = 0; t < o.length; t++) if (typeof o[t] != "number") throw new Error("assertNumbers arguments[" + t + "] is not a number. " + typeof o[t] + " == typeof " + o[t]);
  return !0;
}
var qe = Math.PI;
function Pr(o, e, t) {
  o.lArcFlag = o.lArcFlag === 0 ? 0 : 1, o.sweepFlag = o.sweepFlag === 0 ? 0 : 1;
  var r = o.rX, i = o.rY, a = o.x, s = o.y;
  r = Math.abs(o.rX), i = Math.abs(o.rY);
  var n = _r([(e - a) / 2, (t - s) / 2], -o.xRot / 180 * qe), u = n[0], l = n[1], h = Math.pow(u, 2) / Math.pow(r, 2) + Math.pow(l, 2) / Math.pow(i, 2);
  1 < h && (r *= Math.sqrt(h), i *= Math.sqrt(h)), o.rX = r, o.rY = i;
  var c = Math.pow(r, 2) * Math.pow(l, 2) + Math.pow(i, 2) * Math.pow(u, 2), v = (o.lArcFlag !== o.sweepFlag ? 1 : -1) * Math.sqrt(Math.max(0, (Math.pow(r, 2) * Math.pow(i, 2) - c) / c)), f = r * l / i * v, d = -i * u / r * v, g = _r([f, d], o.xRot / 180 * qe);
  o.cX = g[0] + (e + a) / 2, o.cY = g[1] + (t + s) / 2, o.phi1 = Math.atan2((l - d) / i, (u - f) / r), o.phi2 = Math.atan2((-l - d) / i, (-u - f) / r), o.sweepFlag === 0 && o.phi2 > o.phi1 && (o.phi2 -= 2 * qe), o.sweepFlag === 1 && o.phi2 < o.phi1 && (o.phi2 += 2 * qe), o.phi1 *= 180 / qe, o.phi2 *= 180 / qe;
}
function Na(o, e, t) {
  xe(o, e, t);
  var r = o * o + e * e - t * t;
  if (0 > r) return [];
  if (r === 0) return [[o * t / (o * o + e * e), e * t / (o * o + e * e)]];
  var i = Math.sqrt(r);
  return [[(o * t + e * i) / (o * o + e * e), (e * t - o * i) / (o * o + e * e)], [(o * t - e * i) / (o * o + e * e), (e * t + o * i) / (o * o + e * e)]];
}
var K, Ie = Math.PI / 180;
function Ia(o, e, t) {
  return (1 - t) * o + t * e;
}
function Ma(o, e, t, r) {
  return o + Math.cos(r / 180 * qe) * e + Math.sin(r / 180 * qe) * t;
}
function _a(o, e, t, r) {
  var i = 1e-6, a = e - o, s = t - e, n = 3 * a + 3 * (r - t) - 6 * s, u = 6 * (s - a), l = 3 * a;
  return Math.abs(n) < i ? [-l / u] : (function(h, c, v) {
    var f = h * h / 4 - c;
    if (f < -v) return [];
    if (f <= v) return [-h / 2];
    var d = Math.sqrt(f);
    return [-h / 2 - d, -h / 2 + d];
  })(u / n, l / n, i);
}
function Va(o, e, t, r, i) {
  var a = 1 - i;
  return o * (a * a * a) + e * (3 * a * a * i) + t * (3 * a * i * i) + r * (i * i * i);
}
(function(o) {
  function e() {
    return i((function(n, u, l) {
      return n.relative && (n.x1 !== void 0 && (n.x1 += u), n.y1 !== void 0 && (n.y1 += l), n.x2 !== void 0 && (n.x2 += u), n.y2 !== void 0 && (n.y2 += l), n.x !== void 0 && (n.x += u), n.y !== void 0 && (n.y += l), n.relative = !1), n;
    }));
  }
  function t() {
    var n = NaN, u = NaN, l = NaN, h = NaN;
    return i((function(c, v, f) {
      return c.type & E.SMOOTH_CURVE_TO && (c.type = E.CURVE_TO, n = isNaN(n) ? v : n, u = isNaN(u) ? f : u, c.x1 = c.relative ? v - n : 2 * v - n, c.y1 = c.relative ? f - u : 2 * f - u), c.type & E.CURVE_TO ? (n = c.relative ? v + c.x2 : c.x2, u = c.relative ? f + c.y2 : c.y2) : (n = NaN, u = NaN), c.type & E.SMOOTH_QUAD_TO && (c.type = E.QUAD_TO, l = isNaN(l) ? v : l, h = isNaN(h) ? f : h, c.x1 = c.relative ? v - l : 2 * v - l, c.y1 = c.relative ? f - h : 2 * f - h), c.type & E.QUAD_TO ? (l = c.relative ? v + c.x1 : c.x1, h = c.relative ? f + c.y1 : c.y1) : (l = NaN, h = NaN), c;
    }));
  }
  function r() {
    var n = NaN, u = NaN;
    return i((function(l, h, c) {
      if (l.type & E.SMOOTH_QUAD_TO && (l.type = E.QUAD_TO, n = isNaN(n) ? h : n, u = isNaN(u) ? c : u, l.x1 = l.relative ? h - n : 2 * h - n, l.y1 = l.relative ? c - u : 2 * c - u), l.type & E.QUAD_TO) {
        n = l.relative ? h + l.x1 : l.x1, u = l.relative ? c + l.y1 : l.y1;
        var v = l.x1, f = l.y1;
        l.type = E.CURVE_TO, l.x1 = ((l.relative ? 0 : h) + 2 * v) / 3, l.y1 = ((l.relative ? 0 : c) + 2 * f) / 3, l.x2 = (l.x + 2 * v) / 3, l.y2 = (l.y + 2 * f) / 3;
      } else n = NaN, u = NaN;
      return l;
    }));
  }
  function i(n) {
    var u = 0, l = 0, h = NaN, c = NaN;
    return function(v) {
      if (isNaN(h) && !(v.type & E.MOVE_TO)) throw new Error("path must start with moveto");
      var f = n(v, u, l, h, c);
      return v.type & E.CLOSE_PATH && (u = h, l = c), v.x !== void 0 && (u = v.relative ? u + v.x : v.x), v.y !== void 0 && (l = v.relative ? l + v.y : v.y), v.type & E.MOVE_TO && (h = u, c = l), f;
    };
  }
  function a(n, u, l, h, c, v) {
    return xe(n, u, l, h, c, v), i((function(f, d, g, p) {
      var y = f.x1, b = f.x2, m = f.relative && !isNaN(p), x = f.x !== void 0 ? f.x : m ? 0 : d, A = f.y !== void 0 ? f.y : m ? 0 : g;
      function C(D) {
        return D * D;
      }
      f.type & E.HORIZ_LINE_TO && u !== 0 && (f.type = E.LINE_TO, f.y = f.relative ? 0 : g), f.type & E.VERT_LINE_TO && l !== 0 && (f.type = E.LINE_TO, f.x = f.relative ? 0 : d), f.x !== void 0 && (f.x = f.x * n + A * l + (m ? 0 : c)), f.y !== void 0 && (f.y = x * u + f.y * h + (m ? 0 : v)), f.x1 !== void 0 && (f.x1 = f.x1 * n + f.y1 * l + (m ? 0 : c)), f.y1 !== void 0 && (f.y1 = y * u + f.y1 * h + (m ? 0 : v)), f.x2 !== void 0 && (f.x2 = f.x2 * n + f.y2 * l + (m ? 0 : c)), f.y2 !== void 0 && (f.y2 = b * u + f.y2 * h + (m ? 0 : v));
      var T = n * h - u * l;
      if (f.xRot !== void 0 && (n !== 1 || u !== 0 || l !== 0 || h !== 1)) if (T === 0) delete f.rX, delete f.rY, delete f.xRot, delete f.lArcFlag, delete f.sweepFlag, f.type = E.LINE_TO;
      else {
        var O = f.xRot * Math.PI / 180, P = Math.sin(O), V = Math.cos(O), U = 1 / C(f.rX), N = 1 / C(f.rY), q = C(V) * U + C(P) * N, w = 2 * P * V * (U - N), _ = C(P) * U + C(V) * N, $ = q * h * h - w * u * h + _ * u * u, F = w * (n * h + u * l) - 2 * (q * l * h + _ * n * u), L = q * l * l - w * n * l + _ * n * n, M = (Math.atan2(F, $ - L) + Math.PI) % Math.PI / 2, I = Math.sin(M), j = Math.cos(M);
        f.rX = Math.abs(T) / Math.sqrt($ * C(j) + F * I * j + L * C(I)), f.rY = Math.abs(T) / Math.sqrt($ * C(I) - F * I * j + L * C(j)), f.xRot = 180 * M / Math.PI;
      }
      return f.sweepFlag !== void 0 && 0 > T && (f.sweepFlag = +!f.sweepFlag), f;
    }));
  }
  function s() {
    return function(n) {
      var u = {};
      for (var l in n) u[l] = n[l];
      return u;
    };
  }
  o.ROUND = function(n) {
    function u(l) {
      return Math.round(l * n) / n;
    }
    return n === void 0 && (n = 1e13), xe(n), function(l) {
      return l.x1 !== void 0 && (l.x1 = u(l.x1)), l.y1 !== void 0 && (l.y1 = u(l.y1)), l.x2 !== void 0 && (l.x2 = u(l.x2)), l.y2 !== void 0 && (l.y2 = u(l.y2)), l.x !== void 0 && (l.x = u(l.x)), l.y !== void 0 && (l.y = u(l.y)), l.rX !== void 0 && (l.rX = u(l.rX)), l.rY !== void 0 && (l.rY = u(l.rY)), l;
    };
  }, o.TO_ABS = e, o.TO_REL = function() {
    return i((function(n, u, l) {
      return n.relative || (n.x1 !== void 0 && (n.x1 -= u), n.y1 !== void 0 && (n.y1 -= l), n.x2 !== void 0 && (n.x2 -= u), n.y2 !== void 0 && (n.y2 -= l), n.x !== void 0 && (n.x -= u), n.y !== void 0 && (n.y -= l), n.relative = !0), n;
    }));
  }, o.NORMALIZE_HVZ = function(n, u, l) {
    return n === void 0 && (n = !0), u === void 0 && (u = !0), l === void 0 && (l = !0), i((function(h, c, v, f, d) {
      if (isNaN(f) && !(h.type & E.MOVE_TO)) throw new Error("path must start with moveto");
      return u && h.type & E.HORIZ_LINE_TO && (h.type = E.LINE_TO, h.y = h.relative ? 0 : v), l && h.type & E.VERT_LINE_TO && (h.type = E.LINE_TO, h.x = h.relative ? 0 : c), n && h.type & E.CLOSE_PATH && (h.type = E.LINE_TO, h.x = h.relative ? f - c : f, h.y = h.relative ? d - v : d), h.type & E.ARC && (h.rX === 0 || h.rY === 0) && (h.type = E.LINE_TO, delete h.rX, delete h.rY, delete h.xRot, delete h.lArcFlag, delete h.sweepFlag), h;
    }));
  }, o.NORMALIZE_ST = t, o.QT_TO_C = r, o.INFO = i, o.SANITIZE = function(n) {
    n === void 0 && (n = 0), xe(n);
    var u = NaN, l = NaN, h = NaN, c = NaN;
    return i((function(v, f, d, g, p) {
      var y = Math.abs, b = !1, m = 0, x = 0;
      if (v.type & E.SMOOTH_CURVE_TO && (m = isNaN(u) ? 0 : f - u, x = isNaN(l) ? 0 : d - l), v.type & (E.CURVE_TO | E.SMOOTH_CURVE_TO) ? (u = v.relative ? f + v.x2 : v.x2, l = v.relative ? d + v.y2 : v.y2) : (u = NaN, l = NaN), v.type & E.SMOOTH_QUAD_TO ? (h = isNaN(h) ? f : 2 * f - h, c = isNaN(c) ? d : 2 * d - c) : v.type & E.QUAD_TO ? (h = v.relative ? f + v.x1 : v.x1, c = v.relative ? d + v.y1 : v.y2) : (h = NaN, c = NaN), v.type & E.LINE_COMMANDS || v.type & E.ARC && (v.rX === 0 || v.rY === 0 || !v.lArcFlag) || v.type & E.CURVE_TO || v.type & E.SMOOTH_CURVE_TO || v.type & E.QUAD_TO || v.type & E.SMOOTH_QUAD_TO) {
        var A = v.x === void 0 ? 0 : v.relative ? v.x : v.x - f, C = v.y === void 0 ? 0 : v.relative ? v.y : v.y - d;
        m = isNaN(h) ? v.x1 === void 0 ? m : v.relative ? v.x : v.x1 - f : h - f, x = isNaN(c) ? v.y1 === void 0 ? x : v.relative ? v.y : v.y1 - d : c - d;
        var T = v.x2 === void 0 ? 0 : v.relative ? v.x : v.x2 - f, O = v.y2 === void 0 ? 0 : v.relative ? v.y : v.y2 - d;
        y(A) <= n && y(C) <= n && y(m) <= n && y(x) <= n && y(T) <= n && y(O) <= n && (b = !0);
      }
      return v.type & E.CLOSE_PATH && y(f - g) <= n && y(d - p) <= n && (b = !0), b ? [] : v;
    }));
  }, o.MATRIX = a, o.ROTATE = function(n, u, l) {
    u === void 0 && (u = 0), l === void 0 && (l = 0), xe(n, u, l);
    var h = Math.sin(n), c = Math.cos(n);
    return a(c, h, -h, c, u - u * c + l * h, l - u * h - l * c);
  }, o.TRANSLATE = function(n, u) {
    return u === void 0 && (u = 0), xe(n, u), a(1, 0, 0, 1, n, u);
  }, o.SCALE = function(n, u) {
    return u === void 0 && (u = n), xe(n, u), a(n, 0, 0, u, 0, 0);
  }, o.SKEW_X = function(n) {
    return xe(n), a(1, 0, Math.atan(n), 1, 0, 0);
  }, o.SKEW_Y = function(n) {
    return xe(n), a(1, Math.atan(n), 0, 1, 0, 0);
  }, o.X_AXIS_SYMMETRY = function(n) {
    return n === void 0 && (n = 0), xe(n), a(-1, 0, 0, 1, n, 0);
  }, o.Y_AXIS_SYMMETRY = function(n) {
    return n === void 0 && (n = 0), xe(n), a(1, 0, 0, -1, 0, n);
  }, o.A_TO_C = function() {
    return i((function(n, u, l) {
      return E.ARC === n.type ? (function(h, c, v) {
        var f, d, g, p;
        h.cX || Pr(h, c, v);
        for (var y = Math.min(h.phi1, h.phi2), b = Math.max(h.phi1, h.phi2) - y, m = Math.ceil(b / 90), x = new Array(m), A = c, C = v, T = 0; T < m; T++) {
          var O = Ia(h.phi1, h.phi2, T / m), P = Ia(h.phi1, h.phi2, (T + 1) / m), V = P - O, U = 4 / 3 * Math.tan(V * Ie / 4), N = [Math.cos(O * Ie) - U * Math.sin(O * Ie), Math.sin(O * Ie) + U * Math.cos(O * Ie)], q = N[0], w = N[1], _ = [Math.cos(P * Ie), Math.sin(P * Ie)], $ = _[0], F = _[1], L = [$ + U * Math.sin(P * Ie), F - U * Math.cos(P * Ie)], M = L[0], I = L[1];
          x[T] = { relative: h.relative, type: E.CURVE_TO };
          var j = function(D, G) {
            var J = _r([D * h.rX, G * h.rY], h.xRot), ee = J[0], te = J[1];
            return [h.cX + ee, h.cY + te];
          };
          f = j(q, w), x[T].x1 = f[0], x[T].y1 = f[1], d = j(M, I), x[T].x2 = d[0], x[T].y2 = d[1], g = j($, F), x[T].x = g[0], x[T].y = g[1], h.relative && (x[T].x1 -= A, x[T].y1 -= C, x[T].x2 -= A, x[T].y2 -= C, x[T].x -= A, x[T].y -= C), A = (p = [x[T].x, x[T].y])[0], C = p[1];
        }
        return x;
      })(n, n.relative ? 0 : u, n.relative ? 0 : l) : n;
    }));
  }, o.ANNOTATE_ARCS = function() {
    return i((function(n, u, l) {
      return n.relative && (u = 0, l = 0), E.ARC === n.type && Pr(n, u, l), n;
    }));
  }, o.CLONE = s, o.CALCULATE_BOUNDS = function() {
    var n = function(v) {
      var f = {};
      for (var d in v) f[d] = v[d];
      return f;
    }, u = e(), l = r(), h = t(), c = i((function(v, f, d) {
      var g = h(l(u(n(v))));
      function p(I) {
        I > c.maxX && (c.maxX = I), I < c.minX && (c.minX = I);
      }
      function y(I) {
        I > c.maxY && (c.maxY = I), I < c.minY && (c.minY = I);
      }
      if (g.type & E.DRAWING_COMMANDS && (p(f), y(d)), g.type & E.HORIZ_LINE_TO && p(g.x), g.type & E.VERT_LINE_TO && y(g.y), g.type & E.LINE_TO && (p(g.x), y(g.y)), g.type & E.CURVE_TO) {
        p(g.x), y(g.y);
        for (var b = 0, m = _a(f, g.x1, g.x2, g.x); b < m.length; b++)
          0 < (M = m[b]) && 1 > M && p(Va(f, g.x1, g.x2, g.x, M));
        for (var x = 0, A = _a(d, g.y1, g.y2, g.y); x < A.length; x++)
          0 < (M = A[x]) && 1 > M && y(Va(d, g.y1, g.y2, g.y, M));
      }
      if (g.type & E.ARC) {
        p(g.x), y(g.y), Pr(g, f, d);
        for (var C = g.xRot / 180 * Math.PI, T = Math.cos(C) * g.rX, O = Math.sin(C) * g.rX, P = -Math.sin(C) * g.rY, V = Math.cos(C) * g.rY, U = g.phi1 < g.phi2 ? [g.phi1, g.phi2] : -180 > g.phi2 ? [g.phi2 + 360, g.phi1 + 360] : [g.phi2, g.phi1], N = U[0], q = U[1], w = function(I) {
          var j = I[0], D = I[1], G = 180 * Math.atan2(D, j) / Math.PI;
          return G < N ? G + 360 : G;
        }, _ = 0, $ = Na(P, -T, 0).map(w); _ < $.length; _++)
          (M = $[_]) > N && M < q && p(Ma(g.cX, T, P, M));
        for (var F = 0, L = Na(V, -O, 0).map(w); F < L.length; F++) {
          var M;
          (M = L[F]) > N && M < q && y(Ma(g.cY, O, V, M));
        }
      }
      return v;
    }));
    return c.minX = 1 / 0, c.maxX = -1 / 0, c.minY = 1 / 0, c.maxY = -1 / 0, c;
  };
})(K || (K = {}));
var me, An = (function() {
  function o() {
  }
  return o.prototype.round = function(e) {
    return this.transform(K.ROUND(e));
  }, o.prototype.toAbs = function() {
    return this.transform(K.TO_ABS());
  }, o.prototype.toRel = function() {
    return this.transform(K.TO_REL());
  }, o.prototype.normalizeHVZ = function(e, t, r) {
    return this.transform(K.NORMALIZE_HVZ(e, t, r));
  }, o.prototype.normalizeST = function() {
    return this.transform(K.NORMALIZE_ST());
  }, o.prototype.qtToC = function() {
    return this.transform(K.QT_TO_C());
  }, o.prototype.aToC = function() {
    return this.transform(K.A_TO_C());
  }, o.prototype.sanitize = function(e) {
    return this.transform(K.SANITIZE(e));
  }, o.prototype.translate = function(e, t) {
    return this.transform(K.TRANSLATE(e, t));
  }, o.prototype.scale = function(e, t) {
    return this.transform(K.SCALE(e, t));
  }, o.prototype.rotate = function(e, t, r) {
    return this.transform(K.ROTATE(e, t, r));
  }, o.prototype.matrix = function(e, t, r, i, a, s) {
    return this.transform(K.MATRIX(e, t, r, i, a, s));
  }, o.prototype.skewX = function(e) {
    return this.transform(K.SKEW_X(e));
  }, o.prototype.skewY = function(e) {
    return this.transform(K.SKEW_Y(e));
  }, o.prototype.xSymmetry = function(e) {
    return this.transform(K.X_AXIS_SYMMETRY(e));
  }, o.prototype.ySymmetry = function(e) {
    return this.transform(K.Y_AXIS_SYMMETRY(e));
  }, o.prototype.annotateArcs = function() {
    return this.transform(K.ANNOTATE_ARCS());
  }, o;
})(), ro = function(o) {
  return o === " " || o === "	" || o === "\r" || o === `
`;
}, Da = function(o) {
  return 48 <= o.charCodeAt(0) && o.charCodeAt(0) <= 57;
}, io = (function(o) {
  function e() {
    var t = o.call(this) || this;
    return t.curNumber = "", t.curCommandType = -1, t.curCommandRelative = !1, t.canParseCommandOrComma = !0, t.curNumberHasExp = !1, t.curNumberHasExpDigits = !1, t.curNumberHasDecimal = !1, t.curArgs = [], t;
  }
  return On(e, o), e.prototype.finish = function(t) {
    if (t === void 0 && (t = []), this.parse(" ", t), this.curArgs.length !== 0 || !this.canParseCommandOrComma) throw new SyntaxError("Unterminated command at the path end.");
    return t;
  }, e.prototype.parse = function(t, r) {
    var i = this;
    r === void 0 && (r = []);
    for (var a = function(c) {
      r.push(c), i.curArgs.length = 0, i.canParseCommandOrComma = !0;
    }, s = 0; s < t.length; s++) {
      var n = t[s], u = !(this.curCommandType !== E.ARC || this.curArgs.length !== 3 && this.curArgs.length !== 4 || this.curNumber.length !== 1 || this.curNumber !== "0" && this.curNumber !== "1"), l = Da(n) && (this.curNumber === "0" && n === "0" || u);
      if (!Da(n) || l) if (n !== "e" && n !== "E") if (n !== "-" && n !== "+" || !this.curNumberHasExp || this.curNumberHasExpDigits) if (n !== "." || this.curNumberHasExp || this.curNumberHasDecimal || u) {
        if (this.curNumber && this.curCommandType !== -1) {
          var h = Number(this.curNumber);
          if (isNaN(h)) throw new SyntaxError("Invalid number ending at " + s);
          if (this.curCommandType === E.ARC) {
            if (this.curArgs.length === 0 || this.curArgs.length === 1) {
              if (0 > h) throw new SyntaxError('Expected positive number, got "' + h + '" at index "' + s + '"');
            } else if ((this.curArgs.length === 3 || this.curArgs.length === 4) && this.curNumber !== "0" && this.curNumber !== "1") throw new SyntaxError('Expected a flag, got "' + this.curNumber + '" at index "' + s + '"');
          }
          this.curArgs.push(h), this.curArgs.length === ao[this.curCommandType] && (E.HORIZ_LINE_TO === this.curCommandType ? a({ type: E.HORIZ_LINE_TO, relative: this.curCommandRelative, x: h }) : E.VERT_LINE_TO === this.curCommandType ? a({ type: E.VERT_LINE_TO, relative: this.curCommandRelative, y: h }) : this.curCommandType === E.MOVE_TO || this.curCommandType === E.LINE_TO || this.curCommandType === E.SMOOTH_QUAD_TO ? (a({ type: this.curCommandType, relative: this.curCommandRelative, x: this.curArgs[0], y: this.curArgs[1] }), E.MOVE_TO === this.curCommandType && (this.curCommandType = E.LINE_TO)) : this.curCommandType === E.CURVE_TO ? a({ type: E.CURVE_TO, relative: this.curCommandRelative, x1: this.curArgs[0], y1: this.curArgs[1], x2: this.curArgs[2], y2: this.curArgs[3], x: this.curArgs[4], y: this.curArgs[5] }) : this.curCommandType === E.SMOOTH_CURVE_TO ? a({ type: E.SMOOTH_CURVE_TO, relative: this.curCommandRelative, x2: this.curArgs[0], y2: this.curArgs[1], x: this.curArgs[2], y: this.curArgs[3] }) : this.curCommandType === E.QUAD_TO ? a({ type: E.QUAD_TO, relative: this.curCommandRelative, x1: this.curArgs[0], y1: this.curArgs[1], x: this.curArgs[2], y: this.curArgs[3] }) : this.curCommandType === E.ARC && a({ type: E.ARC, relative: this.curCommandRelative, rX: this.curArgs[0], rY: this.curArgs[1], xRot: this.curArgs[2], lArcFlag: this.curArgs[3], sweepFlag: this.curArgs[4], x: this.curArgs[5], y: this.curArgs[6] })), this.curNumber = "", this.curNumberHasExpDigits = !1, this.curNumberHasExp = !1, this.curNumberHasDecimal = !1, this.canParseCommandOrComma = !0;
        }
        if (!ro(n)) if (n === "," && this.canParseCommandOrComma) this.canParseCommandOrComma = !1;
        else if (n !== "+" && n !== "-" && n !== ".") if (l) this.curNumber = n, this.curNumberHasDecimal = !1;
        else {
          if (this.curArgs.length !== 0) throw new SyntaxError("Unterminated command at index " + s + ".");
          if (!this.canParseCommandOrComma) throw new SyntaxError('Unexpected character "' + n + '" at index ' + s + ". Command cannot follow comma");
          if (this.canParseCommandOrComma = !1, n !== "z" && n !== "Z") if (n === "h" || n === "H") this.curCommandType = E.HORIZ_LINE_TO, this.curCommandRelative = n === "h";
          else if (n === "v" || n === "V") this.curCommandType = E.VERT_LINE_TO, this.curCommandRelative = n === "v";
          else if (n === "m" || n === "M") this.curCommandType = E.MOVE_TO, this.curCommandRelative = n === "m";
          else if (n === "l" || n === "L") this.curCommandType = E.LINE_TO, this.curCommandRelative = n === "l";
          else if (n === "c" || n === "C") this.curCommandType = E.CURVE_TO, this.curCommandRelative = n === "c";
          else if (n === "s" || n === "S") this.curCommandType = E.SMOOTH_CURVE_TO, this.curCommandRelative = n === "s";
          else if (n === "q" || n === "Q") this.curCommandType = E.QUAD_TO, this.curCommandRelative = n === "q";
          else if (n === "t" || n === "T") this.curCommandType = E.SMOOTH_QUAD_TO, this.curCommandRelative = n === "t";
          else {
            if (n !== "a" && n !== "A") throw new SyntaxError('Unexpected character "' + n + '" at index ' + s + ".");
            this.curCommandType = E.ARC, this.curCommandRelative = n === "a";
          }
          else r.push({ type: E.CLOSE_PATH }), this.canParseCommandOrComma = !0, this.curCommandType = -1;
        }
        else this.curNumber = n, this.curNumberHasDecimal = n === ".";
      } else this.curNumber += n, this.curNumberHasDecimal = !0;
      else this.curNumber += n;
      else this.curNumber += n, this.curNumberHasExp = !0;
      else this.curNumber += n, this.curNumberHasExpDigits = this.curNumberHasExp;
    }
    return r;
  }, e.prototype.transform = function(t) {
    return Object.create(this, { parse: { value: function(r, i) {
      i === void 0 && (i = []);
      for (var a = 0, s = Object.getPrototypeOf(this).parse.call(this, r); a < s.length; a++) {
        var n = s[a], u = t(n);
        Array.isArray(u) ? i.push.apply(i, u) : i.push(u);
      }
      return i;
    } } });
  }, e;
})(An), E = (function(o) {
  function e(t) {
    var r = o.call(this) || this;
    return r.commands = typeof t == "string" ? e.parse(t) : t, r;
  }
  return On(e, o), e.prototype.encode = function() {
    return e.encode(this.commands);
  }, e.prototype.getBounds = function() {
    var t = K.CALCULATE_BOUNDS();
    return this.transform(t), t;
  }, e.prototype.transform = function(t) {
    for (var r = [], i = 0, a = this.commands; i < a.length; i++) {
      var s = t(a[i]);
      Array.isArray(s) ? r.push.apply(r, s) : r.push(s);
    }
    return this.commands = r, this;
  }, e.encode = function(t) {
    return to(t);
  }, e.parse = function(t) {
    var r = new io(), i = [];
    return r.parse(t, i), r.finish(i), i;
  }, e.CLOSE_PATH = 1, e.MOVE_TO = 2, e.HORIZ_LINE_TO = 4, e.VERT_LINE_TO = 8, e.LINE_TO = 16, e.CURVE_TO = 32, e.SMOOTH_CURVE_TO = 64, e.QUAD_TO = 128, e.SMOOTH_QUAD_TO = 256, e.ARC = 512, e.LINE_COMMANDS = e.LINE_TO | e.HORIZ_LINE_TO | e.VERT_LINE_TO, e.DRAWING_COMMANDS = e.HORIZ_LINE_TO | e.VERT_LINE_TO | e.LINE_TO | e.CURVE_TO | e.SMOOTH_CURVE_TO | e.QUAD_TO | e.SMOOTH_QUAD_TO | e.ARC, e;
})(An), ao = ((me = {})[E.MOVE_TO] = 2, me[E.LINE_TO] = 2, me[E.HORIZ_LINE_TO] = 1, me[E.VERT_LINE_TO] = 1, me[E.CLOSE_PATH] = 0, me[E.QUAD_TO] = 4, me[E.SMOOTH_QUAD_TO] = 2, me[E.CURVE_TO] = 6, me[E.SMOOTH_CURVE_TO] = 4, me[E.ARC] = 7, me), ka = {}, qa;
function no() {
  if (qa) return ka;
  qa = 1;
  var o = hn().PROPER, e = bt(), t = Fe(), r = we(), i = ce(), a = Tt(), s = "toString", n = RegExp.prototype, u = n[s], l = i(function() {
    return u.call({ source: "a", flags: "b" }) !== "/a/b";
  }), h = o && u.name !== s;
  return (l || h) && e(n, s, function() {
    var v = t(this), f = r(v.source), d = r(a(v));
    return "/" + f + "/" + d;
  }, { unsafe: !0 }), ka;
}
no();
function yt(o) {
  "@babel/helpers - typeof";
  return typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? yt = function(e) {
    return typeof e;
  } : yt = function(e) {
    return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
  }, yt(o);
}
function so(o, e) {
  if (!(o instanceof e))
    throw new TypeError("Cannot call a class as a function");
}
var oo = [512, 512, 456, 512, 328, 456, 335, 512, 405, 328, 271, 456, 388, 335, 292, 512, 454, 405, 364, 328, 298, 271, 496, 456, 420, 388, 360, 335, 312, 292, 273, 512, 482, 454, 428, 405, 383, 364, 345, 328, 312, 298, 284, 271, 259, 496, 475, 456, 437, 420, 404, 388, 374, 360, 347, 335, 323, 312, 302, 292, 282, 273, 265, 512, 497, 482, 468, 454, 441, 428, 417, 405, 394, 383, 373, 364, 354, 345, 337, 328, 320, 312, 305, 298, 291, 284, 278, 271, 265, 259, 507, 496, 485, 475, 465, 456, 446, 437, 428, 420, 412, 404, 396, 388, 381, 374, 367, 360, 354, 347, 341, 335, 329, 323, 318, 312, 307, 302, 297, 292, 287, 282, 278, 273, 269, 265, 261, 512, 505, 497, 489, 482, 475, 468, 461, 454, 447, 441, 435, 428, 422, 417, 411, 405, 399, 394, 389, 383, 378, 373, 368, 364, 359, 354, 350, 345, 341, 337, 332, 328, 324, 320, 316, 312, 309, 305, 301, 298, 294, 291, 287, 284, 281, 278, 274, 271, 268, 265, 262, 259, 257, 507, 501, 496, 491, 485, 480, 475, 470, 465, 460, 456, 451, 446, 442, 437, 433, 428, 424, 420, 416, 412, 408, 404, 400, 396, 392, 388, 385, 381, 377, 374, 370, 367, 363, 360, 357, 354, 350, 347, 344, 341, 338, 335, 332, 329, 326, 323, 320, 318, 315, 312, 310, 307, 304, 302, 299, 297, 294, 292, 289, 287, 285, 282, 280, 278, 275, 273, 271, 269, 267, 265, 263, 261, 259], uo = [9, 11, 12, 13, 13, 14, 14, 15, 15, 15, 15, 16, 16, 16, 16, 17, 17, 17, 17, 17, 17, 17, 18, 18, 18, 18, 18, 18, 18, 18, 18, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24];
function lo(o, e, t, r, i) {
  if (typeof o == "string" && (o = document.getElementById(o)), !o || yt(o) !== "object" || !("getContext" in o))
    throw new TypeError("Expecting canvas with `getContext` method in processCanvasRGB(A) calls!");
  var a = o.getContext("2d");
  try {
    return a.getImageData(e, t, r, i);
  } catch (s) {
    throw new Error("unable to access image data: " + s);
  }
}
function ho(o, e, t, r, i, a) {
  if (!(isNaN(a) || a < 1)) {
    a |= 0;
    var s = lo(o, e, t, r, i);
    s = fo(s, e, t, r, i, a), o.getContext("2d").putImageData(s, e, t);
  }
}
function fo(o, e, t, r, i, a) {
  for (var s = o.data, n = 2 * a + 1, u = r - 1, l = i - 1, h = a + 1, c = h * (h + 1) / 2, v = new La(), f = v, d, g = 1; g < n; g++)
    f = f.next = new La(), g === h && (d = f);
  f.next = v;
  for (var p = null, y = null, b = 0, m = 0, x = oo[a], A = uo[a], C = 0; C < i; C++) {
    f = v;
    for (var T = s[m], O = s[m + 1], P = s[m + 2], V = s[m + 3], U = 0; U < h; U++)
      f.r = T, f.g = O, f.b = P, f.a = V, f = f.next;
    for (var N = 0, q = 0, w = 0, _ = 0, $ = h * T, F = h * O, L = h * P, M = h * V, I = c * T, j = c * O, D = c * P, G = c * V, J = 1; J < h; J++) {
      var ee = m + ((u < J ? u : J) << 2), te = s[ee], re = s[ee + 1], Ve = s[ee + 2], De = s[ee + 3], ae = h - J;
      I += (f.r = te) * ae, j += (f.g = re) * ae, D += (f.b = Ve) * ae, G += (f.a = De) * ae, N += te, q += re, w += Ve, _ += De, f = f.next;
    }
    p = v, y = d;
    for (var Se = 0; Se < r; Se++) {
      var Ce = G * x >>> A;
      if (s[m + 3] = Ce, Ce !== 0) {
        var fe = 255 / Ce;
        s[m] = (I * x >>> A) * fe, s[m + 1] = (j * x >>> A) * fe, s[m + 2] = (D * x >>> A) * fe;
      } else
        s[m] = s[m + 1] = s[m + 2] = 0;
      I -= $, j -= F, D -= L, G -= M, $ -= p.r, F -= p.g, L -= p.b, M -= p.a;
      var ne = Se + a + 1;
      ne = b + (ne < u ? ne : u) << 2, N += p.r = s[ne], q += p.g = s[ne + 1], w += p.b = s[ne + 2], _ += p.a = s[ne + 3], I += N, j += q, D += w, G += _, p = p.next;
      var ve = y, Re = ve.r, Pe = ve.g, He = ve.b, Je = ve.a;
      $ += Re, F += Pe, L += He, M += Je, N -= Re, q -= Pe, w -= He, _ -= Je, y = y.next, m += 4;
    }
    b += r;
  }
  for (var ke = 0; ke < r; ke++) {
    m = ke << 2;
    var se = s[m], oe = s[m + 1], ge = s[m + 2], S = s[m + 3], k = h * se, H = h * oe, z = h * ge, W = h * S, de = c * se, Ne = c * oe, pe = c * ge, ye = c * S;
    f = v;
    for (var et = 0; et < h; et++)
      f.r = se, f.g = oe, f.b = ge, f.a = S, f = f.next;
    for (var tt = r, rt = 0, wt = 0, Rt = 0, Pt = 0, ct = 1; ct <= a; ct++) {
      m = tt + ke << 2;
      var vt = h - ct;
      de += (f.r = se = s[m]) * vt, Ne += (f.g = oe = s[m + 1]) * vt, pe += (f.b = ge = s[m + 2]) * vt, ye += (f.a = S = s[m + 3]) * vt, Pt += se, rt += oe, wt += ge, Rt += S, f = f.next, ct < l && (tt += r);
    }
    m = ke, p = v, y = d;
    for (var Nt = 0; Nt < i; Nt++) {
      var ue = m << 2;
      s[ue + 3] = S = ye * x >>> A, S > 0 ? (S = 255 / S, s[ue] = (de * x >>> A) * S, s[ue + 1] = (Ne * x >>> A) * S, s[ue + 2] = (pe * x >>> A) * S) : s[ue] = s[ue + 1] = s[ue + 2] = 0, de -= k, Ne -= H, pe -= z, ye -= W, k -= p.r, H -= p.g, z -= p.b, W -= p.a, ue = ke + ((ue = Nt + h) < l ? ue : l) * r << 2, de += Pt += p.r = s[ue], Ne += rt += p.g = s[ue + 1], pe += wt += p.b = s[ue + 2], ye += Rt += p.a = s[ue + 3], p = p.next, k += se = y.r, H += oe = y.g, z += ge = y.b, W += S = y.a, Pt -= se, rt -= oe, wt -= ge, Rt -= S, y = y.next, m += r;
    }
  }
  return o;
}
var La = (
  /**
   * Set properties.
   */
  function o() {
    so(this, o), this.r = 0, this.g = 0, this.b = 0, this.a = 0, this.next = null;
  }
);
function co() {
  var {
    DOMParser: o
  } = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, e = {
    window: null,
    ignoreAnimation: !0,
    ignoreMouse: !0,
    DOMParser: o,
    createCanvas(t, r) {
      return new OffscreenCanvas(t, r);
    },
    createImage(t) {
      return _e(function* () {
        var r = yield fetch(t), i = yield r.blob(), a = yield createImageBitmap(i);
        return a;
      })();
    }
  };
  return (typeof DOMParser < "u" || typeof o > "u") && Reflect.deleteProperty(e, "DOMParser"), e;
}
function vo(o) {
  var {
    DOMParser: e,
    canvas: t,
    fetch: r
  } = o;
  return {
    window: null,
    ignoreAnimation: !0,
    ignoreMouse: !0,
    DOMParser: e,
    fetch: r,
    createCanvas: t.createCanvas,
    createImage: t.loadImage
  };
}
var Ru = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  offscreen: co,
  node: vo
});
function Ke(o) {
  return o.replace(/(?!\u3000)\s+/gm, " ");
}
function go(o) {
  return o.replace(/^[\n \t]+/, "");
}
function po(o) {
  return o.replace(/[\n \t]+$/, "");
}
function he(o) {
  var e = (o || "").match(/-?(\d+(?:\.\d*(?:[eE][+-]?\d+)?)?|\.\d+)(?=\D|$)/gm) || [];
  return e.map(parseFloat);
}
var yo = /^[A-Z-]+$/;
function mo(o) {
  return yo.test(o) ? o.toLowerCase() : o;
}
function wn(o) {
  var e = /url\(('([^']+)'|"([^"]+)"|([^'")]+))\)/.exec(o) || [];
  return e[2] || e[3] || e[4];
}
function xo(o) {
  if (!o.startsWith("rgb"))
    return o;
  var e = 3, t = o.replace(/\d+(\.\d+)?/g, (r, i) => e-- && i ? String(Math.round(parseFloat(r))) : r);
  return t;
}
var bo = /(\[[^\]]+\])/g, Eo = /(#[^\s+>~.[:]+)/g, To = /(\.[^\s+>~.[:]+)/g, So = /(::[^\s+>~.[:]+|:first-line|:first-letter|:before|:after)/gi, Co = /(:[\w-]+\([^)]*\))/gi, Oo = /(:[^\s+>~.[:]+)/g, Ao = /([^\s+>~.[:]+)/g;
function ze(o, e) {
  var t = e.exec(o);
  return t ? [o.replace(e, " "), t.length] : [o, 0];
}
function wo(o) {
  var e = [0, 0, 0], t = o.replace(/:not\(([^)]*)\)/g, "     $1 ").replace(/{[\s\S]*/gm, " "), r = 0;
  return [t, r] = ze(t, bo), e[1] += r, [t, r] = ze(t, Eo), e[0] += r, [t, r] = ze(t, To), e[1] += r, [t, r] = ze(t, So), e[2] += r, [t, r] = ze(t, Co), e[1] += r, [t, r] = ze(t, Oo), e[1] += r, t = t.replace(/[*\s+>~]/g, " ").replace(/[#.]/g, " "), [t, r] = ze(t, Ao), e[2] += r, e.join("");
}
var Ye = 1e-8;
function Ba(o) {
  return Math.sqrt(Math.pow(o[0], 2) + Math.pow(o[1], 2));
}
function Vr(o, e) {
  return (o[0] * e[0] + o[1] * e[1]) / (Ba(o) * Ba(e));
}
function Ua(o, e) {
  return (o[0] * e[1] < o[1] * e[0] ? -1 : 1) * Math.acos(Vr(o, e));
}
function Fa(o) {
  return o * o * o;
}
function ja(o) {
  return 3 * o * o * (1 - o);
}
function Ha(o) {
  return 3 * o * (1 - o) * (1 - o);
}
function za(o) {
  return (1 - o) * (1 - o) * (1 - o);
}
function $a(o) {
  return o * o;
}
function Ga(o) {
  return 2 * o * (1 - o);
}
function Wa(o) {
  return (1 - o) * (1 - o);
}
class R {
  constructor(e, t, r) {
    this.document = e, this.name = t, this.value = r, this.isNormalizedColor = !1;
  }
  static empty(e) {
    return new R(e, "EMPTY", "");
  }
  split() {
    var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : " ", {
      document: t,
      name: r
    } = this;
    return Ke(this.getString()).trim().split(e).map((i) => new R(t, r, i));
  }
  hasValue(e) {
    var {
      value: t
    } = this;
    return t !== null && t !== "" && (e || t !== 0) && typeof t < "u";
  }
  isString(e) {
    var {
      value: t
    } = this, r = typeof t == "string";
    return !r || !e ? r : e.test(t);
  }
  isUrlDefinition() {
    return this.isString(/^url\(/);
  }
  isPixels() {
    if (!this.hasValue())
      return !1;
    var e = this.getString();
    switch (!0) {
      case e.endsWith("px"):
      case /^[0-9]+$/.test(e):
        return !0;
      default:
        return !1;
    }
  }
  setValue(e) {
    return this.value = e, this;
  }
  getValue(e) {
    return typeof e > "u" || this.hasValue() ? this.value : e;
  }
  getNumber(e) {
    if (!this.hasValue())
      return typeof e > "u" ? 0 : parseFloat(e);
    var {
      value: t
    } = this, r = parseFloat(t);
    return this.isString(/%$/) && (r /= 100), r;
  }
  getString(e) {
    return typeof e > "u" || this.hasValue() ? typeof this.value > "u" ? "" : String(this.value) : String(e);
  }
  getColor(e) {
    var t = this.getString(e);
    return this.isNormalizedColor || (this.isNormalizedColor = !0, t = xo(t), this.value = t), t;
  }
  getDpi() {
    return 96;
  }
  getRem() {
    return this.document.rootEmSize;
  }
  getEm() {
    return this.document.emSize;
  }
  getUnits() {
    return this.getString().replace(/[0-9.-]/g, "");
  }
  getPixels(e) {
    var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1;
    if (!this.hasValue())
      return 0;
    var [r, i] = typeof e == "boolean" ? [void 0, e] : [e], {
      viewPort: a
    } = this.document.screen;
    switch (!0) {
      case this.isString(/vmin$/):
        return this.getNumber() / 100 * Math.min(a.computeSize("x"), a.computeSize("y"));
      case this.isString(/vmax$/):
        return this.getNumber() / 100 * Math.max(a.computeSize("x"), a.computeSize("y"));
      case this.isString(/vw$/):
        return this.getNumber() / 100 * a.computeSize("x");
      case this.isString(/vh$/):
        return this.getNumber() / 100 * a.computeSize("y");
      case this.isString(/rem$/):
        return this.getNumber() * this.getRem();
      case this.isString(/em$/):
        return this.getNumber() * this.getEm();
      case this.isString(/ex$/):
        return this.getNumber() * this.getEm() / 2;
      case this.isString(/px$/):
        return this.getNumber();
      case this.isString(/pt$/):
        return this.getNumber() * this.getDpi() * (1 / 72);
      case this.isString(/pc$/):
        return this.getNumber() * 15;
      case this.isString(/cm$/):
        return this.getNumber() * this.getDpi() / 2.54;
      case this.isString(/mm$/):
        return this.getNumber() * this.getDpi() / 25.4;
      case this.isString(/in$/):
        return this.getNumber() * this.getDpi();
      case (this.isString(/%$/) && i):
        return this.getNumber() * this.getEm();
      case this.isString(/%$/):
        return this.getNumber() * a.computeSize(r);
      default: {
        var s = this.getNumber();
        return t && s < 1 ? s * a.computeSize(r) : s;
      }
    }
  }
  getMilliseconds() {
    return this.hasValue() ? this.isString(/ms$/) ? this.getNumber() : this.getNumber() * 1e3 : 0;
  }
  getRadians() {
    if (!this.hasValue())
      return 0;
    switch (!0) {
      case this.isString(/deg$/):
        return this.getNumber() * (Math.PI / 180);
      case this.isString(/grad$/):
        return this.getNumber() * (Math.PI / 200);
      case this.isString(/rad$/):
        return this.getNumber();
      default:
        return this.getNumber() * (Math.PI / 180);
    }
  }
  getDefinition() {
    var e = this.getString(), t = /#([^)'"]+)/.exec(e);
    return t && (t = t[1]), t || (t = e), this.document.definitions[t];
  }
  getFillStyleDefinition(e, t) {
    var r = this.getDefinition();
    if (!r)
      return null;
    if (typeof r.createGradient == "function")
      return r.createGradient(this.document.ctx, e, t);
    if (typeof r.createPattern == "function") {
      if (r.getHrefAttribute().hasValue()) {
        var i = r.getAttribute("patternTransform");
        r = r.getHrefAttribute().getDefinition(), i.hasValue() && r.getAttribute("patternTransform", !0).setValue(i.value);
      }
      return r.createPattern(this.document.ctx, e, t);
    }
    return null;
  }
  getTextBaseline() {
    return this.hasValue() ? R.textBaselineMapping[this.getString()] : null;
  }
  addOpacity(e) {
    for (var t = this.getColor(), r = t.length, i = 0, a = 0; a < r && (t[a] === "," && i++, i !== 3); a++)
      ;
    if (e.hasValue() && this.isString() && i !== 3) {
      var s = new Mr(t);
      s.ok && (s.alpha = e.getNumber(), t = s.toRGBA());
    }
    return new R(this.document, this.name, t);
  }
}
R.textBaselineMapping = {
  baseline: "alphabetic",
  "before-edge": "top",
  "text-before-edge": "top",
  middle: "middle",
  central: "middle",
  "after-edge": "bottom",
  "text-after-edge": "bottom",
  ideographic: "ideographic",
  alphabetic: "alphabetic",
  hanging: "hanging",
  mathematical: "alphabetic"
};
class Ro {
  constructor() {
    this.viewPorts = [];
  }
  clear() {
    this.viewPorts = [];
  }
  setCurrent(e, t) {
    this.viewPorts.push({
      width: e,
      height: t
    });
  }
  removeCurrent() {
    this.viewPorts.pop();
  }
  getCurrent() {
    var {
      viewPorts: e
    } = this;
    return e[e.length - 1];
  }
  get width() {
    return this.getCurrent().width;
  }
  get height() {
    return this.getCurrent().height;
  }
  computeSize(e) {
    return typeof e == "number" ? e : e === "x" ? this.width : e === "y" ? this.height : Math.sqrt(Math.pow(this.width, 2) + Math.pow(this.height, 2)) / Math.sqrt(2);
  }
}
class Q {
  constructor(e, t) {
    this.x = e, this.y = t;
  }
  static parse(e) {
    var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0, [r = t, i = t] = he(e);
    return new Q(r, i);
  }
  static parseScale(e) {
    var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 1, [r = t, i = r] = he(e);
    return new Q(r, i);
  }
  static parsePath(e) {
    for (var t = he(e), r = t.length, i = [], a = 0; a < r; a += 2)
      i.push(new Q(t[a], t[a + 1]));
    return i;
  }
  angleTo(e) {
    return Math.atan2(e.y - this.y, e.x - this.x);
  }
  applyTransform(e) {
    var {
      x: t,
      y: r
    } = this, i = t * e[0] + r * e[2] + e[4], a = t * e[1] + r * e[3] + e[5];
    this.x = i, this.y = a;
  }
}
class Po {
  constructor(e) {
    this.screen = e, this.working = !1, this.events = [], this.eventElements = [], this.onClick = this.onClick.bind(this), this.onMouseMove = this.onMouseMove.bind(this);
  }
  isWorking() {
    return this.working;
  }
  start() {
    if (!this.working) {
      var {
        screen: e,
        onClick: t,
        onMouseMove: r
      } = this, i = e.ctx.canvas;
      i.onclick = t, i.onmousemove = r, this.working = !0;
    }
  }
  stop() {
    if (this.working) {
      var e = this.screen.ctx.canvas;
      this.working = !1, e.onclick = null, e.onmousemove = null;
    }
  }
  hasEvents() {
    return this.working && this.events.length > 0;
  }
  runEvents() {
    if (this.working) {
      var {
        screen: e,
        events: t,
        eventElements: r
      } = this, {
        style: i
      } = e.ctx.canvas;
      i && (i.cursor = ""), t.forEach((a, s) => {
        for (var {
          run: n
        } = a, u = r[s]; u; )
          n(u), u = u.parent;
      }), this.events = [], this.eventElements = [];
    }
  }
  checkPath(e, t) {
    if (!(!this.working || !t)) {
      var {
        events: r,
        eventElements: i
      } = this;
      r.forEach((a, s) => {
        var {
          x: n,
          y: u
        } = a;
        !i[s] && t.isPointInPath && t.isPointInPath(n, u) && (i[s] = e);
      });
    }
  }
  checkBoundingBox(e, t) {
    if (!(!this.working || !t)) {
      var {
        events: r,
        eventElements: i
      } = this;
      r.forEach((a, s) => {
        var {
          x: n,
          y: u
        } = a;
        !i[s] && t.isPointInBox(n, u) && (i[s] = e);
      });
    }
  }
  mapXY(e, t) {
    for (var {
      window: r,
      ctx: i
    } = this.screen, a = new Q(e, t), s = i.canvas; s; )
      a.x -= s.offsetLeft, a.y -= s.offsetTop, s = s.offsetParent;
    return r.scrollX && (a.x += r.scrollX), r.scrollY && (a.y += r.scrollY), a;
  }
  onClick(e) {
    var {
      x: t,
      y: r
    } = this.mapXY(e.clientX, e.clientY);
    this.events.push({
      type: "onclick",
      x: t,
      y: r,
      run(i) {
        i.onClick && i.onClick();
      }
    });
  }
  onMouseMove(e) {
    var {
      x: t,
      y: r
    } = this.mapXY(e.clientX, e.clientY);
    this.events.push({
      type: "onmousemove",
      x: t,
      y: r,
      run(i) {
        i.onMouseMove && i.onMouseMove();
      }
    });
  }
}
var Rn = typeof window < "u" ? window : null, Pn = typeof fetch < "u" ? fetch.bind(void 0) : null;
class St {
  constructor(e) {
    var {
      fetch: t = Pn,
      window: r = Rn
    } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    this.ctx = e, this.FRAMERATE = 30, this.MAX_VIRTUAL_PIXELS = 3e4, this.CLIENT_WIDTH = 800, this.CLIENT_HEIGHT = 600, this.viewPort = new Ro(), this.mouse = new Po(this), this.animations = [], this.waits = [], this.frameDuration = 0, this.isReadyLock = !1, this.isFirstRender = !0, this.intervalId = null, this.window = r, this.fetch = t;
  }
  wait(e) {
    this.waits.push(e);
  }
  ready() {
    return this.readyPromise ? this.readyPromise : Promise.resolve();
  }
  isReady() {
    if (this.isReadyLock)
      return !0;
    var e = this.waits.every((t) => t());
    return e && (this.waits = [], this.resolveReady && this.resolveReady()), this.isReadyLock = e, e;
  }
  setDefaults(e) {
    e.strokeStyle = "rgba(0,0,0,0)", e.lineCap = "butt", e.lineJoin = "miter", e.miterLimit = 4;
  }
  setViewBox(e) {
    var {
      document: t,
      ctx: r,
      aspectRatio: i,
      width: a,
      desiredWidth: s,
      height: n,
      desiredHeight: u,
      minX: l = 0,
      minY: h = 0,
      refX: c,
      refY: v,
      clip: f = !1,
      clipX: d = 0,
      clipY: g = 0
    } = e, p = Ke(i).replace(/^defer\s/, ""), [y, b] = p.split(" "), m = y || "xMidYMid", x = b || "meet", A = a / s, C = n / u, T = Math.min(A, C), O = Math.max(A, C), P = s, V = u;
    x === "meet" && (P *= T, V *= T), x === "slice" && (P *= O, V *= O);
    var U = new R(t, "refX", c), N = new R(t, "refY", v), q = U.hasValue() && N.hasValue();
    if (q && r.translate(-T * U.getPixels("x"), -T * N.getPixels("y")), f) {
      var w = T * d, _ = T * g;
      r.beginPath(), r.moveTo(w, _), r.lineTo(a, _), r.lineTo(a, n), r.lineTo(w, n), r.closePath(), r.clip();
    }
    if (!q) {
      var $ = x === "meet" && T === C, F = x === "slice" && O === C, L = x === "meet" && T === A, M = x === "slice" && O === A;
      m.startsWith("xMid") && ($ || F) && r.translate(a / 2 - P / 2, 0), m.endsWith("YMid") && (L || M) && r.translate(0, n / 2 - V / 2), m.startsWith("xMax") && ($ || F) && r.translate(a - P, 0), m.endsWith("YMax") && (L || M) && r.translate(0, n - V);
    }
    switch (!0) {
      case m === "none":
        r.scale(A, C);
        break;
      case x === "meet":
        r.scale(T, T);
        break;
      case x === "slice":
        r.scale(O, O);
        break;
    }
    r.translate(-l, -h);
  }
  start(e) {
    var {
      enableRedraw: t = !1,
      ignoreMouse: r = !1,
      ignoreAnimation: i = !1,
      ignoreDimensions: a = !1,
      ignoreClear: s = !1,
      forceRedraw: n,
      scaleWidth: u,
      scaleHeight: l,
      offsetX: h,
      offsetY: c
    } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, {
      FRAMERATE: v,
      mouse: f
    } = this, d = 1e3 / v;
    if (this.frameDuration = d, this.readyPromise = new Promise((m) => {
      this.resolveReady = m;
    }), this.isReady() && this.render(e, a, s, u, l, h, c), !!t) {
      var g = Date.now(), p = g, y = 0, b = () => {
        g = Date.now(), y = g - p, y >= d && (p = g - y % d, this.shouldUpdate(i, n) && (this.render(e, a, s, u, l, h, c), f.runEvents())), this.intervalId = Sr(b);
      };
      r || f.start(), this.intervalId = Sr(b);
    }
  }
  stop() {
    this.intervalId && (Sr.cancel(this.intervalId), this.intervalId = null), this.mouse.stop();
  }
  shouldUpdate(e, t) {
    if (!e) {
      var {
        frameDuration: r
      } = this, i = this.animations.reduce((a, s) => s.update(r) || a, !1);
      if (i)
        return !0;
    }
    return !!(typeof t == "function" && t() || !this.isReadyLock && this.isReady() || this.mouse.hasEvents());
  }
  render(e, t, r, i, a, s, n) {
    var {
      CLIENT_WIDTH: u,
      CLIENT_HEIGHT: l,
      viewPort: h,
      ctx: c,
      isFirstRender: v
    } = this, f = c.canvas;
    h.clear(), f.width && f.height ? h.setCurrent(f.width, f.height) : h.setCurrent(u, l);
    var d = e.getStyle("width"), g = e.getStyle("height");
    !t && (v || typeof i != "number" && typeof a != "number") && (d.hasValue() && (f.width = d.getPixels("x"), f.style && (f.style.width = "".concat(f.width, "px"))), g.hasValue() && (f.height = g.getPixels("y"), f.style && (f.style.height = "".concat(f.height, "px"))));
    var p = f.clientWidth || f.width, y = f.clientHeight || f.height;
    if (t && d.hasValue() && g.hasValue() && (p = d.getPixels("x"), y = g.getPixels("y")), h.setCurrent(p, y), typeof s == "number" && e.getAttribute("x", !0).setValue(s), typeof n == "number" && e.getAttribute("y", !0).setValue(n), typeof i == "number" || typeof a == "number") {
      var b = he(e.getAttribute("viewBox").getString()), m = 0, x = 0;
      if (typeof i == "number") {
        var A = e.getStyle("width");
        A.hasValue() ? m = A.getPixels("x") / i : isNaN(b[2]) || (m = b[2] / i);
      }
      if (typeof a == "number") {
        var C = e.getStyle("height");
        C.hasValue() ? x = C.getPixels("y") / a : isNaN(b[3]) || (x = b[3] / a);
      }
      m || (m = x), x || (x = m), e.getAttribute("width", !0).setValue(i), e.getAttribute("height", !0).setValue(a);
      var T = e.getStyle("transform", !0, !0);
      T.setValue("".concat(T.getString(), " scale(").concat(1 / m, ", ").concat(1 / x, ")"));
    }
    r || c.clearRect(0, 0, p, y), e.render(c), v && (this.isFirstRender = !1);
  }
}
St.defaultWindow = Rn;
St.defaultFetch = Pn;
var {
  defaultFetch: No
} = St, Io = typeof DOMParser < "u" ? DOMParser : null;
class Nr {
  constructor() {
    var {
      fetch: e = No,
      DOMParser: t = Io
    } = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    this.fetch = e, this.DOMParser = t;
  }
  parse(e) {
    var t = this;
    return _e(function* () {
      return e.startsWith("<") ? t.parseFromString(e) : t.load(e);
    })();
  }
  parseFromString(e) {
    var t = new this.DOMParser();
    try {
      return this.checkDocument(t.parseFromString(e, "image/svg+xml"));
    } catch {
      return this.checkDocument(t.parseFromString(e, "text/xml"));
    }
  }
  checkDocument(e) {
    var t = e.getElementsByTagName("parsererror")[0];
    if (t)
      throw new Error(t.textContent);
    return e;
  }
  load(e) {
    var t = this;
    return _e(function* () {
      var r = yield t.fetch(e), i = yield r.text();
      return t.parseFromString(i);
    })();
  }
}
class Mo {
  constructor(e, t) {
    this.type = "translate", this.point = null, this.point = Q.parse(t);
  }
  apply(e) {
    var {
      x: t,
      y: r
    } = this.point;
    e.translate(t || 0, r || 0);
  }
  unapply(e) {
    var {
      x: t,
      y: r
    } = this.point;
    e.translate(-1 * t || 0, -1 * r || 0);
  }
  applyToPoint(e) {
    var {
      x: t,
      y: r
    } = this.point;
    e.applyTransform([1, 0, 0, 1, t || 0, r || 0]);
  }
}
class _o {
  constructor(e, t, r) {
    this.type = "rotate", this.angle = null, this.originX = null, this.originY = null, this.cx = 0, this.cy = 0;
    var i = he(t);
    this.angle = new R(e, "angle", i[0]), this.originX = r[0], this.originY = r[1], this.cx = i[1] || 0, this.cy = i[2] || 0;
  }
  apply(e) {
    var {
      cx: t,
      cy: r,
      originX: i,
      originY: a,
      angle: s
    } = this, n = t + i.getPixels("x"), u = r + a.getPixels("y");
    e.translate(n, u), e.rotate(s.getRadians()), e.translate(-n, -u);
  }
  unapply(e) {
    var {
      cx: t,
      cy: r,
      originX: i,
      originY: a,
      angle: s
    } = this, n = t + i.getPixels("x"), u = r + a.getPixels("y");
    e.translate(n, u), e.rotate(-1 * s.getRadians()), e.translate(-n, -u);
  }
  applyToPoint(e) {
    var {
      cx: t,
      cy: r,
      angle: i
    } = this, a = i.getRadians();
    e.applyTransform([
      1,
      0,
      0,
      1,
      t || 0,
      r || 0
      // this.p.y
    ]), e.applyTransform([Math.cos(a), Math.sin(a), -Math.sin(a), Math.cos(a), 0, 0]), e.applyTransform([
      1,
      0,
      0,
      1,
      -t || 0,
      -r || 0
      // -this.p.y
    ]);
  }
}
class Vo {
  constructor(e, t, r) {
    this.type = "scale", this.scale = null, this.originX = null, this.originY = null;
    var i = Q.parseScale(t);
    (i.x === 0 || i.y === 0) && (i.x = Ye, i.y = Ye), this.scale = i, this.originX = r[0], this.originY = r[1];
  }
  apply(e) {
    var {
      scale: {
        x: t,
        y: r
      },
      originX: i,
      originY: a
    } = this, s = i.getPixels("x"), n = a.getPixels("y");
    e.translate(s, n), e.scale(t, r || t), e.translate(-s, -n);
  }
  unapply(e) {
    var {
      scale: {
        x: t,
        y: r
      },
      originX: i,
      originY: a
    } = this, s = i.getPixels("x"), n = a.getPixels("y");
    e.translate(s, n), e.scale(1 / t, 1 / r || t), e.translate(-s, -n);
  }
  applyToPoint(e) {
    var {
      x: t,
      y: r
    } = this.scale;
    e.applyTransform([t || 0, 0, 0, r || 0, 0, 0]);
  }
}
class Nn {
  constructor(e, t, r) {
    this.type = "matrix", this.matrix = [], this.originX = null, this.originY = null, this.matrix = he(t), this.originX = r[0], this.originY = r[1];
  }
  apply(e) {
    var {
      originX: t,
      originY: r,
      matrix: i
    } = this, a = t.getPixels("x"), s = r.getPixels("y");
    e.translate(a, s), e.transform(i[0], i[1], i[2], i[3], i[4], i[5]), e.translate(-a, -s);
  }
  unapply(e) {
    var {
      originX: t,
      originY: r,
      matrix: i
    } = this, a = i[0], s = i[2], n = i[4], u = i[1], l = i[3], h = i[5], c = 0, v = 0, f = 1, d = 1 / (a * (l * f - h * v) - s * (u * f - h * c) + n * (u * v - l * c)), g = t.getPixels("x"), p = r.getPixels("y");
    e.translate(g, p), e.transform(d * (l * f - h * v), d * (h * c - u * f), d * (n * v - s * f), d * (a * f - n * c), d * (s * h - n * l), d * (n * u - a * h)), e.translate(-g, -p);
  }
  applyToPoint(e) {
    e.applyTransform(this.matrix);
  }
}
class In extends Nn {
  constructor(e, t, r) {
    super(e, t, r), this.type = "skew", this.angle = null, this.angle = new R(e, "angle", t);
  }
}
class Do extends In {
  constructor(e, t, r) {
    super(e, t, r), this.type = "skewX", this.matrix = [1, 0, Math.tan(this.angle.getRadians()), 1, 0, 0];
  }
}
class ko extends In {
  constructor(e, t, r) {
    super(e, t, r), this.type = "skewY", this.matrix = [1, Math.tan(this.angle.getRadians()), 0, 1, 0, 0];
  }
}
function qo(o) {
  return Ke(o).trim().replace(/\)([a-zA-Z])/g, ") $1").replace(/\)(\s?,\s?)/g, ") ").split(/\s(?=[a-z])/);
}
function Lo(o) {
  var [e, t] = o.split("(");
  return [e.trim(), t.trim().replace(")", "")];
}
class We {
  constructor(e, t, r) {
    this.document = e, this.transforms = [];
    var i = qo(t);
    i.forEach((a) => {
      if (a !== "none") {
        var [s, n] = Lo(a), u = We.transformTypes[s];
        typeof u < "u" && this.transforms.push(new u(this.document, n, r));
      }
    });
  }
  static fromElement(e, t) {
    var r = t.getStyle("transform", !1, !0), [i, a = i] = t.getStyle("transform-origin", !1, !0).split(), s = [i, a];
    return r.hasValue() ? new We(e, r.getString(), s) : null;
  }
  apply(e) {
    for (var {
      transforms: t
    } = this, r = t.length, i = 0; i < r; i++)
      t[i].apply(e);
  }
  unapply(e) {
    for (var {
      transforms: t
    } = this, r = t.length, i = r - 1; i >= 0; i--)
      t[i].unapply(e);
  }
  // TODO: applyToPoint unused ... remove?
  applyToPoint(e) {
    for (var {
      transforms: t
    } = this, r = t.length, i = 0; i < r; i++)
      t[i].applyToPoint(e);
  }
}
We.transformTypes = {
  translate: Mo,
  rotate: _o,
  scale: Vo,
  matrix: Nn,
  skewX: Do,
  skewY: ko
};
class Y {
  constructor(e, t) {
    var r = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : !1;
    if (this.document = e, this.node = t, this.captureTextNodes = r, this.attributes = /* @__PURE__ */ Object.create(null), this.styles = /* @__PURE__ */ Object.create(null), this.stylesSpecificity = /* @__PURE__ */ Object.create(null), this.animationFrozen = !1, this.animationFrozenValue = "", this.parent = null, this.children = [], !(!t || t.nodeType !== 1)) {
      if (Array.from(t.attributes).forEach((n) => {
        var u = mo(n.nodeName);
        this.attributes[u] = new R(e, u, n.value);
      }), this.addStylesFromStyleDefinition(), this.getAttribute("style").hasValue()) {
        var i = this.getAttribute("style").getString().split(";").map((n) => n.trim());
        i.forEach((n) => {
          if (n) {
            var [u, l] = n.split(":").map((h) => h.trim());
            this.styles[u] = new R(e, u, l);
          }
        });
      }
      var {
        definitions: a
      } = e, s = this.getAttribute("id");
      s.hasValue() && (a[s.getString()] || (a[s.getString()] = this)), Array.from(t.childNodes).forEach((n) => {
        if (n.nodeType === 1)
          this.addChild(n);
        else if (r && (n.nodeType === 3 || n.nodeType === 4)) {
          var u = e.createTextNode(n);
          u.getText().length > 0 && this.addChild(u);
        }
      });
    }
  }
  getAttribute(e) {
    var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1, r = this.attributes[e];
    if (!r && t) {
      var i = new R(this.document, e, "");
      return this.attributes[e] = i, i;
    }
    return r || R.empty(this.document);
  }
  getHrefAttribute() {
    for (var e in this.attributes)
      if (e === "href" || e.endsWith(":href"))
        return this.attributes[e];
    return R.empty(this.document);
  }
  getStyle(e) {
    var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1, r = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : !1, i = this.styles[e];
    if (i)
      return i;
    var a = this.getAttribute(e);
    if (a != null && a.hasValue())
      return this.styles[e] = a, a;
    if (!r) {
      var {
        parent: s
      } = this;
      if (s) {
        var n = s.getStyle(e);
        if (n != null && n.hasValue())
          return n;
      }
    }
    if (t) {
      var u = new R(this.document, e, "");
      return this.styles[e] = u, u;
    }
    return i || R.empty(this.document);
  }
  render(e) {
    if (!(this.getStyle("display").getString() === "none" || this.getStyle("visibility").getString() === "hidden")) {
      if (e.save(), this.getStyle("mask").hasValue()) {
        var t = this.getStyle("mask").getDefinition();
        t && (this.applyEffects(e), t.apply(e, this));
      } else if (this.getStyle("filter").getValue("none") !== "none") {
        var r = this.getStyle("filter").getDefinition();
        r && (this.applyEffects(e), r.apply(e, this));
      } else
        this.setContext(e), this.renderChildren(e), this.clearContext(e);
      e.restore();
    }
  }
  setContext(e) {
  }
  applyEffects(e) {
    var t = We.fromElement(this.document, this);
    t && t.apply(e);
    var r = this.getStyle("clip-path", !1, !0);
    if (r.hasValue()) {
      var i = r.getDefinition();
      i && i.apply(e);
    }
  }
  clearContext(e) {
  }
  renderChildren(e) {
    this.children.forEach((t) => {
      t.render(e);
    });
  }
  addChild(e) {
    var t = e instanceof Y ? e : this.document.createElement(e);
    t.parent = this, Y.ignoreChildTypes.includes(t.type) || this.children.push(t);
  }
  matchesSelector(e) {
    var t, {
      node: r
    } = this;
    if (typeof r.matches == "function")
      return r.matches(e);
    var i = (t = r.getAttribute) === null || t === void 0 ? void 0 : t.call(r, "class");
    return !i || i === "" ? !1 : i.split(" ").some((a) => ".".concat(a) === e);
  }
  addStylesFromStyleDefinition() {
    var {
      styles: e,
      stylesSpecificity: t
    } = this.document;
    for (var r in e)
      if (!r.startsWith("@") && this.matchesSelector(r)) {
        var i = e[r], a = t[r];
        if (i)
          for (var s in i) {
            var n = this.stylesSpecificity[s];
            typeof n > "u" && (n = "000"), a >= n && (this.styles[s] = i[s], this.stylesSpecificity[s] = a);
          }
      }
  }
  removeStyles(e, t) {
    var r = t.reduce((i, a) => {
      var s = e.getStyle(a);
      if (!s.hasValue())
        return i;
      var n = s.getString();
      return s.setValue(""), [...i, [a, n]];
    }, []);
    return r;
  }
  restoreStyles(e, t) {
    t.forEach((r) => {
      var [i, a] = r;
      e.getStyle(i, !0).setValue(a);
    });
  }
  isFirstChild() {
    var e;
    return ((e = this.parent) === null || e === void 0 ? void 0 : e.children.indexOf(this)) === 0;
  }
}
Y.ignoreChildTypes = ["title"];
class Bo extends Y {
  constructor(e, t, r) {
    super(e, t, r);
  }
}
function Uo(o) {
  var e = o.trim();
  return /^('|")/.test(e) ? e : '"'.concat(e, '"');
}
function Fo(o) {
  return typeof process > "u" ? o : o.trim().split(",").map(Uo).join(",");
}
function jo(o) {
  if (!o)
    return "";
  var e = o.trim().toLowerCase();
  switch (e) {
    case "normal":
    case "italic":
    case "oblique":
    case "inherit":
    case "initial":
    case "unset":
      return e;
    default:
      return /^oblique\s+(-|)\d+deg$/.test(e) ? e : "";
  }
}
function Ho(o) {
  if (!o)
    return "";
  var e = o.trim().toLowerCase();
  switch (e) {
    case "normal":
    case "bold":
    case "lighter":
    case "bolder":
    case "inherit":
    case "initial":
    case "unset":
      return e;
    default:
      return /^[\d.]+$/.test(e) ? e : "";
  }
}
class ie {
  constructor(e, t, r, i, a, s) {
    var n = s ? typeof s == "string" ? ie.parse(s) : s : {};
    this.fontFamily = a || n.fontFamily, this.fontSize = i || n.fontSize, this.fontStyle = e || n.fontStyle, this.fontWeight = r || n.fontWeight, this.fontVariant = t || n.fontVariant;
  }
  static parse() {
    var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", t = arguments.length > 1 ? arguments[1] : void 0, r = "", i = "", a = "", s = "", n = "", u = Ke(e).trim().split(" "), l = {
      fontSize: !1,
      fontStyle: !1,
      fontWeight: !1,
      fontVariant: !1
    };
    return u.forEach((h) => {
      switch (!0) {
        case (!l.fontStyle && ie.styles.includes(h)):
          h !== "inherit" && (r = h), l.fontStyle = !0;
          break;
        case (!l.fontVariant && ie.variants.includes(h)):
          h !== "inherit" && (i = h), l.fontStyle = !0, l.fontVariant = !0;
          break;
        case (!l.fontWeight && ie.weights.includes(h)):
          h !== "inherit" && (a = h), l.fontStyle = !0, l.fontVariant = !0, l.fontWeight = !0;
          break;
        case !l.fontSize:
          h !== "inherit" && ([s] = h.split("/")), l.fontStyle = !0, l.fontVariant = !0, l.fontWeight = !0, l.fontSize = !0;
          break;
        default:
          h !== "inherit" && (n += h);
      }
    }), new ie(r, i, a, s, n, t);
  }
  toString() {
    return [
      jo(this.fontStyle),
      this.fontVariant,
      Ho(this.fontWeight),
      this.fontSize,
      // Wrap fontFamily only on nodejs and only for canvas.ctx
      Fo(this.fontFamily)
    ].join(" ").trim();
  }
}
ie.styles = "normal|italic|oblique|inherit";
ie.variants = "normal|small-caps|inherit";
ie.weights = "normal|bold|bolder|lighter|100|200|300|400|500|600|700|800|900|inherit";
class Te {
  constructor() {
    var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : Number.NaN, t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Number.NaN, r = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : Number.NaN, i = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : Number.NaN;
    this.x1 = e, this.y1 = t, this.x2 = r, this.y2 = i, this.addPoint(e, t), this.addPoint(r, i);
  }
  get x() {
    return this.x1;
  }
  get y() {
    return this.y1;
  }
  get width() {
    return this.x2 - this.x1;
  }
  get height() {
    return this.y2 - this.y1;
  }
  addPoint(e, t) {
    typeof e < "u" && ((isNaN(this.x1) || isNaN(this.x2)) && (this.x1 = e, this.x2 = e), e < this.x1 && (this.x1 = e), e > this.x2 && (this.x2 = e)), typeof t < "u" && ((isNaN(this.y1) || isNaN(this.y2)) && (this.y1 = t, this.y2 = t), t < this.y1 && (this.y1 = t), t > this.y2 && (this.y2 = t));
  }
  addX(e) {
    this.addPoint(e, null);
  }
  addY(e) {
    this.addPoint(null, e);
  }
  addBoundingBox(e) {
    if (e) {
      var {
        x1: t,
        y1: r,
        x2: i,
        y2: a
      } = e;
      this.addPoint(t, r), this.addPoint(i, a);
    }
  }
  sumCubic(e, t, r, i, a) {
    return Math.pow(1 - e, 3) * t + 3 * Math.pow(1 - e, 2) * e * r + 3 * (1 - e) * Math.pow(e, 2) * i + Math.pow(e, 3) * a;
  }
  bezierCurveAdd(e, t, r, i, a) {
    var s = 6 * t - 12 * r + 6 * i, n = -3 * t + 9 * r - 9 * i + 3 * a, u = 3 * r - 3 * t;
    if (n === 0) {
      if (s === 0)
        return;
      var l = -u / s;
      0 < l && l < 1 && (e ? this.addX(this.sumCubic(l, t, r, i, a)) : this.addY(this.sumCubic(l, t, r, i, a)));
      return;
    }
    var h = Math.pow(s, 2) - 4 * u * n;
    if (!(h < 0)) {
      var c = (-s + Math.sqrt(h)) / (2 * n);
      0 < c && c < 1 && (e ? this.addX(this.sumCubic(c, t, r, i, a)) : this.addY(this.sumCubic(c, t, r, i, a)));
      var v = (-s - Math.sqrt(h)) / (2 * n);
      0 < v && v < 1 && (e ? this.addX(this.sumCubic(v, t, r, i, a)) : this.addY(this.sumCubic(v, t, r, i, a)));
    }
  }
  // from http://blog.hackers-cafe.net/2009/06/how-to-calculate-bezier-curves-bounding.html
  addBezierCurve(e, t, r, i, a, s, n, u) {
    this.addPoint(e, t), this.addPoint(n, u), this.bezierCurveAdd(!0, e, r, a, n), this.bezierCurveAdd(!1, t, i, s, u);
  }
  addQuadraticCurve(e, t, r, i, a, s) {
    var n = e + 0.6666666666666666 * (r - e), u = t + 2 / 3 * (i - t), l = n + 1 / 3 * (a - e), h = u + 1 / 3 * (s - t);
    this.addBezierCurve(e, t, n, l, u, h, a, s);
  }
  isPointInBox(e, t) {
    var {
      x1: r,
      y1: i,
      x2: a,
      y2: s
    } = this;
    return r <= e && e <= a && i <= t && t <= s;
  }
}
class B extends E {
  constructor(e) {
    super(e.replace(/([+\-.])\s+/gm, "$1").replace(/[^MmZzLlHhVvCcSsQqTtAae\d\s.,+-].*/g, "")), this.control = null, this.start = null, this.current = null, this.command = null, this.commands = this.commands, this.i = -1, this.previousCommand = null, this.points = [], this.angles = [];
  }
  reset() {
    this.i = -1, this.command = null, this.previousCommand = null, this.start = new Q(0, 0), this.control = new Q(0, 0), this.current = new Q(0, 0), this.points = [], this.angles = [];
  }
  isEnd() {
    var {
      i: e,
      commands: t
    } = this;
    return e >= t.length - 1;
  }
  next() {
    var e = this.commands[++this.i];
    return this.previousCommand = this.command, this.command = e, e;
  }
  getPoint() {
    var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "x", t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "y", r = new Q(this.command[e], this.command[t]);
    return this.makeAbsolute(r);
  }
  getAsControlPoint(e, t) {
    var r = this.getPoint(e, t);
    return this.control = r, r;
  }
  getAsCurrentPoint(e, t) {
    var r = this.getPoint(e, t);
    return this.current = r, r;
  }
  getReflectedControlPoint() {
    var e = this.previousCommand.type;
    if (e !== E.CURVE_TO && e !== E.SMOOTH_CURVE_TO && e !== E.QUAD_TO && e !== E.SMOOTH_QUAD_TO)
      return this.current;
    var {
      current: {
        x: t,
        y: r
      },
      control: {
        x: i,
        y: a
      }
    } = this, s = new Q(2 * t - i, 2 * r - a);
    return s;
  }
  makeAbsolute(e) {
    if (this.command.relative) {
      var {
        x: t,
        y: r
      } = this.current;
      e.x += t, e.y += r;
    }
    return e;
  }
  addMarker(e, t, r) {
    var {
      points: i,
      angles: a
    } = this;
    r && a.length > 0 && !a[a.length - 1] && (a[a.length - 1] = i[i.length - 1].angleTo(r)), this.addMarkerAngle(e, t ? t.angleTo(e) : null);
  }
  addMarkerAngle(e, t) {
    this.points.push(e), this.angles.push(t);
  }
  getMarkerPoints() {
    return this.points;
  }
  getMarkerAngles() {
    for (var {
      angles: e
    } = this, t = e.length, r = 0; r < t; r++)
      if (!e[r]) {
        for (var i = r + 1; i < t; i++)
          if (e[i]) {
            e[r] = e[i];
            break;
          }
      }
    return e;
  }
}
class Xe extends Y {
  constructor() {
    super(...arguments), this.modifiedEmSizeStack = !1;
  }
  calculateOpacity() {
    for (var e = 1, t = this; t; ) {
      var r = t.getStyle("opacity", !1, !0);
      r.hasValue(!0) && (e *= r.getNumber()), t = t.parent;
    }
    return e;
  }
  setContext(e) {
    var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1;
    if (!t) {
      var r = this.getStyle("fill"), i = this.getStyle("fill-opacity"), a = this.getStyle("stroke"), s = this.getStyle("stroke-opacity");
      if (r.isUrlDefinition()) {
        var n = r.getFillStyleDefinition(this, i);
        n && (e.fillStyle = n);
      } else if (r.hasValue()) {
        r.getString() === "currentColor" && r.setValue(this.getStyle("color").getColor());
        var u = r.getColor();
        u !== "inherit" && (e.fillStyle = u === "none" ? "rgba(0,0,0,0)" : u);
      }
      if (i.hasValue()) {
        var l = new R(this.document, "fill", e.fillStyle).addOpacity(i).getColor();
        e.fillStyle = l;
      }
      if (a.isUrlDefinition()) {
        var h = a.getFillStyleDefinition(this, s);
        h && (e.strokeStyle = h);
      } else if (a.hasValue()) {
        a.getString() === "currentColor" && a.setValue(this.getStyle("color").getColor());
        var c = a.getString();
        c !== "inherit" && (e.strokeStyle = c === "none" ? "rgba(0,0,0,0)" : c);
      }
      if (s.hasValue()) {
        var v = new R(this.document, "stroke", e.strokeStyle).addOpacity(s).getString();
        e.strokeStyle = v;
      }
      var f = this.getStyle("stroke-width");
      if (f.hasValue()) {
        var d = f.getPixels();
        e.lineWidth = d || Ye;
      }
      var g = this.getStyle("stroke-linecap"), p = this.getStyle("stroke-linejoin"), y = this.getStyle("stroke-miterlimit"), b = this.getStyle("stroke-dasharray"), m = this.getStyle("stroke-dashoffset");
      if (g.hasValue() && (e.lineCap = g.getString()), p.hasValue() && (e.lineJoin = p.getString()), y.hasValue() && (e.miterLimit = y.getNumber()), b.hasValue() && b.getString() !== "none") {
        var x = he(b.getString());
        typeof e.setLineDash < "u" ? e.setLineDash(x) : typeof e.webkitLineDash < "u" ? e.webkitLineDash = x : typeof e.mozDash < "u" && !(x.length === 1 && x[0] === 0) && (e.mozDash = x);
        var A = m.getPixels();
        typeof e.lineDashOffset < "u" ? e.lineDashOffset = A : typeof e.webkitLineDashOffset < "u" ? e.webkitLineDashOffset = A : typeof e.mozDashOffset < "u" && (e.mozDashOffset = A);
      }
    }
    if (this.modifiedEmSizeStack = !1, typeof e.font < "u") {
      var C = this.getStyle("font"), T = this.getStyle("font-style"), O = this.getStyle("font-variant"), P = this.getStyle("font-weight"), V = this.getStyle("font-size"), U = this.getStyle("font-family"), N = new ie(T.getString(), O.getString(), P.getString(), V.hasValue() ? "".concat(V.getPixels(!0), "px") : "", U.getString(), ie.parse(C.getString(), e.font));
      T.setValue(N.fontStyle), O.setValue(N.fontVariant), P.setValue(N.fontWeight), V.setValue(N.fontSize), U.setValue(N.fontFamily), e.font = N.toString(), V.isPixels() && (this.document.emSize = V.getPixels(), this.modifiedEmSizeStack = !0);
    }
    t || (this.applyEffects(e), e.globalAlpha = this.calculateOpacity());
  }
  clearContext(e) {
    super.clearContext(e), this.modifiedEmSizeStack && this.document.popEmSize();
  }
}
class X extends Xe {
  constructor(e, t, r) {
    super(e, t, r), this.type = "path", this.pathParser = null, this.pathParser = new B(this.getAttribute("d").getString());
  }
  path(e) {
    var {
      pathParser: t
    } = this, r = new Te();
    for (t.reset(), e && e.beginPath(); !t.isEnd(); )
      switch (t.next().type) {
        case B.MOVE_TO:
          this.pathM(e, r);
          break;
        case B.LINE_TO:
          this.pathL(e, r);
          break;
        case B.HORIZ_LINE_TO:
          this.pathH(e, r);
          break;
        case B.VERT_LINE_TO:
          this.pathV(e, r);
          break;
        case B.CURVE_TO:
          this.pathC(e, r);
          break;
        case B.SMOOTH_CURVE_TO:
          this.pathS(e, r);
          break;
        case B.QUAD_TO:
          this.pathQ(e, r);
          break;
        case B.SMOOTH_QUAD_TO:
          this.pathT(e, r);
          break;
        case B.ARC:
          this.pathA(e, r);
          break;
        case B.CLOSE_PATH:
          this.pathZ(e, r);
          break;
      }
    return r;
  }
  getBoundingBox(e) {
    return this.path();
  }
  getMarkers() {
    var {
      pathParser: e
    } = this, t = e.getMarkerPoints(), r = e.getMarkerAngles(), i = t.map((a, s) => [a, r[s]]);
    return i;
  }
  renderChildren(e) {
    this.path(e), this.document.screen.mouse.checkPath(this, e);
    var t = this.getStyle("fill-rule");
    e.fillStyle !== "" && (t.getString("inherit") !== "inherit" ? e.fill(t.getString()) : e.fill()), e.strokeStyle !== "" && (this.getAttribute("vector-effect").getString() === "non-scaling-stroke" ? (e.save(), e.setTransform(1, 0, 0, 1, 0, 0), e.stroke(), e.restore()) : e.stroke());
    var r = this.getMarkers();
    if (r) {
      var i = r.length - 1, a = this.getStyle("marker-start"), s = this.getStyle("marker-mid"), n = this.getStyle("marker-end");
      if (a.isUrlDefinition()) {
        var u = a.getDefinition(), [l, h] = r[0];
        u.render(e, l, h);
      }
      if (s.isUrlDefinition())
        for (var c = s.getDefinition(), v = 1; v < i; v++) {
          var [f, d] = r[v];
          c.render(e, f, d);
        }
      if (n.isUrlDefinition()) {
        var g = n.getDefinition(), [p, y] = r[i];
        g.render(e, p, y);
      }
    }
  }
  static pathM(e) {
    var t = e.getAsCurrentPoint();
    return e.start = e.current, {
      point: t
    };
  }
  pathM(e, t) {
    var {
      pathParser: r
    } = this, {
      point: i
    } = X.pathM(r), {
      x: a,
      y: s
    } = i;
    r.addMarker(i), t.addPoint(a, s), e && e.moveTo(a, s);
  }
  static pathL(e) {
    var {
      current: t
    } = e, r = e.getAsCurrentPoint();
    return {
      current: t,
      point: r
    };
  }
  pathL(e, t) {
    var {
      pathParser: r
    } = this, {
      current: i,
      point: a
    } = X.pathL(r), {
      x: s,
      y: n
    } = a;
    r.addMarker(a, i), t.addPoint(s, n), e && e.lineTo(s, n);
  }
  static pathH(e) {
    var {
      current: t,
      command: r
    } = e, i = new Q((r.relative ? t.x : 0) + r.x, t.y);
    return e.current = i, {
      current: t,
      point: i
    };
  }
  pathH(e, t) {
    var {
      pathParser: r
    } = this, {
      current: i,
      point: a
    } = X.pathH(r), {
      x: s,
      y: n
    } = a;
    r.addMarker(a, i), t.addPoint(s, n), e && e.lineTo(s, n);
  }
  static pathV(e) {
    var {
      current: t,
      command: r
    } = e, i = new Q(t.x, (r.relative ? t.y : 0) + r.y);
    return e.current = i, {
      current: t,
      point: i
    };
  }
  pathV(e, t) {
    var {
      pathParser: r
    } = this, {
      current: i,
      point: a
    } = X.pathV(r), {
      x: s,
      y: n
    } = a;
    r.addMarker(a, i), t.addPoint(s, n), e && e.lineTo(s, n);
  }
  static pathC(e) {
    var {
      current: t
    } = e, r = e.getPoint("x1", "y1"), i = e.getAsControlPoint("x2", "y2"), a = e.getAsCurrentPoint();
    return {
      current: t,
      point: r,
      controlPoint: i,
      currentPoint: a
    };
  }
  pathC(e, t) {
    var {
      pathParser: r
    } = this, {
      current: i,
      point: a,
      controlPoint: s,
      currentPoint: n
    } = X.pathC(r);
    r.addMarker(n, s, a), t.addBezierCurve(i.x, i.y, a.x, a.y, s.x, s.y, n.x, n.y), e && e.bezierCurveTo(a.x, a.y, s.x, s.y, n.x, n.y);
  }
  static pathS(e) {
    var {
      current: t
    } = e, r = e.getReflectedControlPoint(), i = e.getAsControlPoint("x2", "y2"), a = e.getAsCurrentPoint();
    return {
      current: t,
      point: r,
      controlPoint: i,
      currentPoint: a
    };
  }
  pathS(e, t) {
    var {
      pathParser: r
    } = this, {
      current: i,
      point: a,
      controlPoint: s,
      currentPoint: n
    } = X.pathS(r);
    r.addMarker(n, s, a), t.addBezierCurve(i.x, i.y, a.x, a.y, s.x, s.y, n.x, n.y), e && e.bezierCurveTo(a.x, a.y, s.x, s.y, n.x, n.y);
  }
  static pathQ(e) {
    var {
      current: t
    } = e, r = e.getAsControlPoint("x1", "y1"), i = e.getAsCurrentPoint();
    return {
      current: t,
      controlPoint: r,
      currentPoint: i
    };
  }
  pathQ(e, t) {
    var {
      pathParser: r
    } = this, {
      current: i,
      controlPoint: a,
      currentPoint: s
    } = X.pathQ(r);
    r.addMarker(s, a, a), t.addQuadraticCurve(i.x, i.y, a.x, a.y, s.x, s.y), e && e.quadraticCurveTo(a.x, a.y, s.x, s.y);
  }
  static pathT(e) {
    var {
      current: t
    } = e, r = e.getReflectedControlPoint();
    e.control = r;
    var i = e.getAsCurrentPoint();
    return {
      current: t,
      controlPoint: r,
      currentPoint: i
    };
  }
  pathT(e, t) {
    var {
      pathParser: r
    } = this, {
      current: i,
      controlPoint: a,
      currentPoint: s
    } = X.pathT(r);
    r.addMarker(s, a, a), t.addQuadraticCurve(i.x, i.y, a.x, a.y, s.x, s.y), e && e.quadraticCurveTo(a.x, a.y, s.x, s.y);
  }
  static pathA(e) {
    var {
      current: t,
      command: r
    } = e, {
      rX: i,
      rY: a,
      xRot: s,
      lArcFlag: n,
      sweepFlag: u
    } = r, l = s * (Math.PI / 180), h = e.getAsCurrentPoint(), c = new Q(Math.cos(l) * (t.x - h.x) / 2 + Math.sin(l) * (t.y - h.y) / 2, -Math.sin(l) * (t.x - h.x) / 2 + Math.cos(l) * (t.y - h.y) / 2), v = Math.pow(c.x, 2) / Math.pow(i, 2) + Math.pow(c.y, 2) / Math.pow(a, 2);
    v > 1 && (i *= Math.sqrt(v), a *= Math.sqrt(v));
    var f = (n === u ? -1 : 1) * Math.sqrt((Math.pow(i, 2) * Math.pow(a, 2) - Math.pow(i, 2) * Math.pow(c.y, 2) - Math.pow(a, 2) * Math.pow(c.x, 2)) / (Math.pow(i, 2) * Math.pow(c.y, 2) + Math.pow(a, 2) * Math.pow(c.x, 2)));
    isNaN(f) && (f = 0);
    var d = new Q(f * i * c.y / a, f * -a * c.x / i), g = new Q((t.x + h.x) / 2 + Math.cos(l) * d.x - Math.sin(l) * d.y, (t.y + h.y) / 2 + Math.sin(l) * d.x + Math.cos(l) * d.y), p = Ua([1, 0], [(c.x - d.x) / i, (c.y - d.y) / a]), y = [(c.x - d.x) / i, (c.y - d.y) / a], b = [(-c.x - d.x) / i, (-c.y - d.y) / a], m = Ua(y, b);
    return Vr(y, b) <= -1 && (m = Math.PI), Vr(y, b) >= 1 && (m = 0), {
      currentPoint: h,
      rX: i,
      rY: a,
      sweepFlag: u,
      xAxisRotation: l,
      centp: g,
      a1: p,
      ad: m
    };
  }
  pathA(e, t) {
    var {
      pathParser: r
    } = this, {
      currentPoint: i,
      rX: a,
      rY: s,
      sweepFlag: n,
      xAxisRotation: u,
      centp: l,
      a1: h,
      ad: c
    } = X.pathA(r), v = 1 - n ? 1 : -1, f = h + v * (c / 2), d = new Q(l.x + a * Math.cos(f), l.y + s * Math.sin(f));
    if (r.addMarkerAngle(d, f - v * Math.PI / 2), r.addMarkerAngle(i, f - v * Math.PI), t.addPoint(i.x, i.y), e && !isNaN(h) && !isNaN(c)) {
      var g = a > s ? a : s, p = a > s ? 1 : a / s, y = a > s ? s / a : 1;
      e.translate(l.x, l.y), e.rotate(u), e.scale(p, y), e.arc(0, 0, g, h, h + c, !!(1 - n)), e.scale(1 / p, 1 / y), e.rotate(-u), e.translate(-l.x, -l.y);
    }
  }
  static pathZ(e) {
    e.current = e.start;
  }
  pathZ(e, t) {
    X.pathZ(this.pathParser), e && t.x1 !== t.x2 && t.y1 !== t.y2 && e.closePath();
  }
}
class Mn extends X {
  constructor(e, t, r) {
    super(e, t, r), this.type = "glyph", this.horizAdvX = this.getAttribute("horiz-adv-x").getNumber(), this.unicode = this.getAttribute("unicode").getString(), this.arabicForm = this.getAttribute("arabic-form").getString();
  }
}
class Be extends Xe {
  constructor(e, t, r) {
    super(e, t, new.target === Be ? !0 : r), this.type = "text", this.x = 0, this.y = 0, this.measureCache = -1;
  }
  setContext(e) {
    var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1;
    super.setContext(e, t);
    var r = this.getStyle("dominant-baseline").getTextBaseline() || this.getStyle("alignment-baseline").getTextBaseline();
    r && (e.textBaseline = r);
  }
  initializeCoordinates() {
    this.x = 0, this.y = 0, this.leafTexts = [], this.textChunkStart = 0, this.minX = Number.POSITIVE_INFINITY, this.maxX = Number.NEGATIVE_INFINITY;
  }
  getBoundingBox(e) {
    if (this.type !== "text")
      return this.getTElementBoundingBox(e);
    this.initializeCoordinates(), this.adjustChildCoordinatesRecursive(e);
    var t = null;
    return this.children.forEach((r, i) => {
      var a = this.getChildBoundingBox(e, this, this, i);
      t ? t.addBoundingBox(a) : t = a;
    }), t;
  }
  getFontSize() {
    var {
      document: e,
      parent: t
    } = this, r = ie.parse(e.ctx.font).fontSize, i = t.getStyle("font-size").getNumber(r);
    return i;
  }
  getTElementBoundingBox(e) {
    var t = this.getFontSize();
    return new Te(this.x, this.y - t, this.x + this.measureText(e), this.y);
  }
  getGlyph(e, t, r) {
    var i = t[r], a = null;
    if (e.isArabic) {
      var s = t.length, n = t[r - 1], u = t[r + 1], l = "isolated";
      if ((r === 0 || n === " ") && r < s - 1 && u !== " " && (l = "terminal"), r > 0 && n !== " " && r < s - 1 && u !== " " && (l = "medial"), r > 0 && n !== " " && (r === s - 1 || u === " ") && (l = "initial"), typeof e.glyphs[i] < "u") {
        var h = e.glyphs[i];
        a = h instanceof Mn ? h : h[l];
      }
    } else
      a = e.glyphs[i];
    return a || (a = e.missingGlyph), a;
  }
  getText() {
    return "";
  }
  getTextFromNode(e) {
    var t = e || this.node, r = Array.from(t.parentNode.childNodes), i = r.indexOf(t), a = r.length - 1, s = Ke(
      // textNode.value
      // || textNode.text
      t.textContent || ""
    );
    return i === 0 && (s = go(s)), i === a && (s = po(s)), s;
  }
  renderChildren(e) {
    if (this.type !== "text") {
      this.renderTElementChildren(e);
      return;
    }
    this.initializeCoordinates(), this.adjustChildCoordinatesRecursive(e), this.children.forEach((r, i) => {
      this.renderChild(e, this, this, i);
    });
    var {
      mouse: t
    } = this.document.screen;
    t.isWorking() && t.checkBoundingBox(this, this.getBoundingBox(e));
  }
  renderTElementChildren(e) {
    var {
      document: t,
      parent: r
    } = this, i = this.getText(), a = r.getStyle("font-family").getDefinition();
    if (a) {
      for (var {
        unitsPerEm: s
      } = a.fontFace, n = ie.parse(t.ctx.font), u = r.getStyle("font-size").getNumber(n.fontSize), l = r.getStyle("font-style").getString(n.fontStyle), h = u / s, c = a.isRTL ? i.split("").reverse().join("") : i, v = he(r.getAttribute("dx").getString()), f = c.length, d = 0; d < f; d++) {
        var g = this.getGlyph(a, c, d);
        e.translate(this.x, this.y), e.scale(h, -h);
        var p = e.lineWidth;
        e.lineWidth = e.lineWidth * s / u, l === "italic" && e.transform(1, 0, 0.4, 1, 0, 0), g.render(e), l === "italic" && e.transform(1, 0, -0.4, 1, 0, 0), e.lineWidth = p, e.scale(1 / h, -1 / h), e.translate(-this.x, -this.y), this.x += u * (g.horizAdvX || a.horizAdvX) / s, typeof v[d] < "u" && !isNaN(v[d]) && (this.x += v[d]);
      }
      return;
    }
    var {
      x: y,
      y: b
    } = this;
    e.fillStyle && e.fillText(i, y, b), e.strokeStyle && e.strokeText(i, y, b);
  }
  applyAnchoring() {
    if (!(this.textChunkStart >= this.leafTexts.length)) {
      var e = this.leafTexts[this.textChunkStart], t = e.getStyle("text-anchor").getString("start"), r = !1, i = 0;
      t === "start" && !r || t === "end" && r ? i = e.x - this.minX : t === "end" && !r || t === "start" && r ? i = e.x - this.maxX : i = e.x - (this.minX + this.maxX) / 2;
      for (var a = this.textChunkStart; a < this.leafTexts.length; a++)
        this.leafTexts[a].x += i;
      this.minX = Number.POSITIVE_INFINITY, this.maxX = Number.NEGATIVE_INFINITY, this.textChunkStart = this.leafTexts.length;
    }
  }
  adjustChildCoordinatesRecursive(e) {
    this.children.forEach((t, r) => {
      this.adjustChildCoordinatesRecursiveCore(e, this, this, r);
    }), this.applyAnchoring();
  }
  adjustChildCoordinatesRecursiveCore(e, t, r, i) {
    var a = r.children[i];
    a.children.length > 0 ? a.children.forEach((s, n) => {
      t.adjustChildCoordinatesRecursiveCore(e, t, a, n);
    }) : this.adjustChildCoordinates(e, t, r, i);
  }
  adjustChildCoordinates(e, t, r, i) {
    var a = r.children[i];
    if (typeof a.measureText != "function")
      return a;
    e.save(), a.setContext(e, !0);
    var s = a.getAttribute("x"), n = a.getAttribute("y"), u = a.getAttribute("dx"), l = a.getAttribute("dy"), h = a.getStyle("font-family").getDefinition(), c = !!h && h.isRTL;
    i === 0 && (s.hasValue() || s.setValue(a.getInheritedAttribute("x")), n.hasValue() || n.setValue(a.getInheritedAttribute("y")), u.hasValue() || u.setValue(a.getInheritedAttribute("dx")), l.hasValue() || l.setValue(a.getInheritedAttribute("dy")));
    var v = a.measureText(e);
    return c && (t.x -= v), s.hasValue() ? (t.applyAnchoring(), a.x = s.getPixels("x"), u.hasValue() && (a.x += u.getPixels("x"))) : (u.hasValue() && (t.x += u.getPixels("x")), a.x = t.x), t.x = a.x, c || (t.x += v), n.hasValue() ? (a.y = n.getPixels("y"), l.hasValue() && (a.y += l.getPixels("y"))) : (l.hasValue() && (t.y += l.getPixels("y")), a.y = t.y), t.y = a.y, t.leafTexts.push(a), t.minX = Math.min(t.minX, a.x, a.x + v), t.maxX = Math.max(t.maxX, a.x, a.x + v), a.clearContext(e), e.restore(), a;
  }
  getChildBoundingBox(e, t, r, i) {
    var a = r.children[i];
    if (typeof a.getBoundingBox != "function")
      return null;
    var s = a.getBoundingBox(e);
    return s ? (a.children.forEach((n, u) => {
      var l = t.getChildBoundingBox(e, t, a, u);
      s.addBoundingBox(l);
    }), s) : null;
  }
  renderChild(e, t, r, i) {
    var a = r.children[i];
    a.render(e), a.children.forEach((s, n) => {
      t.renderChild(e, t, a, n);
    });
  }
  measureText(e) {
    var {
      measureCache: t
    } = this;
    if (~t)
      return t;
    var r = this.getText(), i = this.measureTargetText(e, r);
    return this.measureCache = i, i;
  }
  measureTargetText(e, t) {
    if (!t.length)
      return 0;
    var {
      parent: r
    } = this, i = r.getStyle("font-family").getDefinition();
    if (i) {
      for (var a = this.getFontSize(), s = i.isRTL ? t.split("").reverse().join("") : t, n = he(r.getAttribute("dx").getString()), u = s.length, l = 0, h = 0; h < u; h++) {
        var c = this.getGlyph(i, s, h);
        l += (c.horizAdvX || i.horizAdvX) * a / i.fontFace.unitsPerEm, typeof n[h] < "u" && !isNaN(n[h]) && (l += n[h]);
      }
      return l;
    }
    if (!e.measureText)
      return t.length * 10;
    e.save(), this.setContext(e, !0);
    var {
      width: v
    } = e.measureText(t);
    return this.clearContext(e), e.restore(), v;
  }
  /**
   * Inherits positional attributes from {@link TextElement} parent(s). Attributes
   * are only inherited from a parent to its first child.
   * @param name - The attribute name.
   * @returns The attribute value or null.
   */
  getInheritedAttribute(e) {
    for (var t = this; t instanceof Be && t.isFirstChild(); ) {
      var r = t.parent.getAttribute(e);
      if (r.hasValue(!0))
        return r.getValue("0");
      t = t.parent;
    }
    return null;
  }
}
class Ct extends Be {
  constructor(e, t, r) {
    super(e, t, new.target === Ct ? !0 : r), this.type = "tspan", this.text = this.children.length > 0 ? "" : this.getTextFromNode();
  }
  getText() {
    return this.text;
  }
}
class zo extends Ct {
  constructor() {
    super(...arguments), this.type = "textNode";
  }
}
class ft extends Xe {
  constructor() {
    super(...arguments), this.type = "svg", this.root = !1;
  }
  setContext(e) {
    var t, {
      document: r
    } = this, {
      screen: i,
      window: a
    } = r, s = e.canvas;
    if (i.setDefaults(e), s.style && typeof e.font < "u" && a && typeof a.getComputedStyle < "u") {
      e.font = a.getComputedStyle(s).getPropertyValue("font");
      var n = new R(r, "fontSize", ie.parse(e.font).fontSize);
      n.hasValue() && (r.rootEmSize = n.getPixels("y"), r.emSize = r.rootEmSize);
    }
    this.getAttribute("x").hasValue() || this.getAttribute("x", !0).setValue(0), this.getAttribute("y").hasValue() || this.getAttribute("y", !0).setValue(0);
    var {
      width: u,
      height: l
    } = i.viewPort;
    this.getStyle("width").hasValue() || this.getStyle("width", !0).setValue("100%"), this.getStyle("height").hasValue() || this.getStyle("height", !0).setValue("100%"), this.getStyle("color").hasValue() || this.getStyle("color", !0).setValue("black");
    var h = this.getAttribute("refX"), c = this.getAttribute("refY"), v = this.getAttribute("viewBox"), f = v.hasValue() ? he(v.getString()) : null, d = !this.root && this.getStyle("overflow").getValue("hidden") !== "visible", g = 0, p = 0, y = 0, b = 0;
    f && (g = f[0], p = f[1]), this.root || (u = this.getStyle("width").getPixels("x"), l = this.getStyle("height").getPixels("y"), this.type === "marker" && (y = g, b = p, g = 0, p = 0)), i.viewPort.setCurrent(u, l), this.node && (!this.parent || ((t = this.node.parentNode) === null || t === void 0 ? void 0 : t.nodeName) === "foreignObject") && this.getStyle("transform", !1, !0).hasValue() && !this.getStyle("transform-origin", !1, !0).hasValue() && this.getStyle("transform-origin", !0, !0).setValue("50% 50%"), super.setContext(e), e.translate(this.getAttribute("x").getPixels("x"), this.getAttribute("y").getPixels("y")), f && (u = f[2], l = f[3]), r.setViewBox({
      ctx: e,
      aspectRatio: this.getAttribute("preserveAspectRatio").getString(),
      width: i.viewPort.width,
      desiredWidth: u,
      height: i.viewPort.height,
      desiredHeight: l,
      minX: g,
      minY: p,
      refX: h.getValue(),
      refY: c.getValue(),
      clip: d,
      clipX: y,
      clipY: b
    }), f && (i.viewPort.removeCurrent(), i.viewPort.setCurrent(u, l));
  }
  clearContext(e) {
    super.clearContext(e), this.document.screen.viewPort.removeCurrent();
  }
  /**
   * Resize SVG to fit in given size.
   * @param width
   * @param height
   * @param preserveAspectRatio
   */
  resize(e) {
    var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : e, r = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : !1, i = this.getAttribute("width", !0), a = this.getAttribute("height", !0), s = this.getAttribute("viewBox"), n = this.getAttribute("style"), u = i.getNumber(0), l = a.getNumber(0);
    if (r)
      if (typeof r == "string")
        this.getAttribute("preserveAspectRatio", !0).setValue(r);
      else {
        var h = this.getAttribute("preserveAspectRatio");
        h.hasValue() && h.setValue(h.getString().replace(/^\s*(\S.*\S)\s*$/, "$1"));
      }
    if (i.setValue(e), a.setValue(t), s.hasValue() || s.setValue("0 0 ".concat(u || e, " ").concat(l || t)), n.hasValue()) {
      var c = this.getStyle("width"), v = this.getStyle("height");
      c.hasValue() && c.setValue("".concat(e, "px")), v.hasValue() && v.setValue("".concat(t, "px"));
    }
  }
}
class _n extends X {
  constructor() {
    super(...arguments), this.type = "rect";
  }
  path(e) {
    var t = this.getAttribute("x").getPixels("x"), r = this.getAttribute("y").getPixels("y"), i = this.getStyle("width", !1, !0).getPixels("x"), a = this.getStyle("height", !1, !0).getPixels("y"), s = this.getAttribute("rx"), n = this.getAttribute("ry"), u = s.getPixels("x"), l = n.getPixels("y");
    if (s.hasValue() && !n.hasValue() && (l = u), n.hasValue() && !s.hasValue() && (u = l), u = Math.min(u, i / 2), l = Math.min(l, a / 2), e) {
      var h = 4 * ((Math.sqrt(2) - 1) / 3);
      e.beginPath(), a > 0 && i > 0 && (e.moveTo(t + u, r), e.lineTo(t + i - u, r), e.bezierCurveTo(t + i - u + h * u, r, t + i, r + l - h * l, t + i, r + l), e.lineTo(t + i, r + a - l), e.bezierCurveTo(t + i, r + a - l + h * l, t + i - u + h * u, r + a, t + i - u, r + a), e.lineTo(t + u, r + a), e.bezierCurveTo(t + u - h * u, r + a, t, r + a - l + h * l, t, r + a - l), e.lineTo(t, r + l), e.bezierCurveTo(t, r + l - h * l, t + u - h * u, r, t + u, r), e.closePath());
    }
    return new Te(t, r, t + i, r + a);
  }
  getMarkers() {
    return null;
  }
}
class $o extends X {
  constructor() {
    super(...arguments), this.type = "circle";
  }
  path(e) {
    var t = this.getAttribute("cx").getPixels("x"), r = this.getAttribute("cy").getPixels("y"), i = this.getAttribute("r").getPixels();
    return e && i > 0 && (e.beginPath(), e.arc(t, r, i, 0, Math.PI * 2, !1), e.closePath()), new Te(t - i, r - i, t + i, r + i);
  }
  getMarkers() {
    return null;
  }
}
class Go extends X {
  constructor() {
    super(...arguments), this.type = "ellipse";
  }
  path(e) {
    var t = 4 * ((Math.sqrt(2) - 1) / 3), r = this.getAttribute("rx").getPixels("x"), i = this.getAttribute("ry").getPixels("y"), a = this.getAttribute("cx").getPixels("x"), s = this.getAttribute("cy").getPixels("y");
    return e && r > 0 && i > 0 && (e.beginPath(), e.moveTo(a + r, s), e.bezierCurveTo(a + r, s + t * i, a + t * r, s + i, a, s + i), e.bezierCurveTo(a - t * r, s + i, a - r, s + t * i, a - r, s), e.bezierCurveTo(a - r, s - t * i, a - t * r, s - i, a, s - i), e.bezierCurveTo(a + t * r, s - i, a + r, s - t * i, a + r, s), e.closePath()), new Te(a - r, s - i, a + r, s + i);
  }
  getMarkers() {
    return null;
  }
}
class Wo extends X {
  constructor() {
    super(...arguments), this.type = "line";
  }
  getPoints() {
    return [new Q(this.getAttribute("x1").getPixels("x"), this.getAttribute("y1").getPixels("y")), new Q(this.getAttribute("x2").getPixels("x"), this.getAttribute("y2").getPixels("y"))];
  }
  path(e) {
    var [{
      x: t,
      y: r
    }, {
      x: i,
      y: a
    }] = this.getPoints();
    return e && (e.beginPath(), e.moveTo(t, r), e.lineTo(i, a)), new Te(t, r, i, a);
  }
  getMarkers() {
    var [e, t] = this.getPoints(), r = e.angleTo(t);
    return [[e, r], [t, r]];
  }
}
class Vn extends X {
  constructor(e, t, r) {
    super(e, t, r), this.type = "polyline", this.points = [], this.points = Q.parsePath(this.getAttribute("points").getString());
  }
  path(e) {
    var {
      points: t
    } = this, [{
      x: r,
      y: i
    }] = t, a = new Te(r, i);
    return e && (e.beginPath(), e.moveTo(r, i)), t.forEach((s) => {
      var {
        x: n,
        y: u
      } = s;
      a.addPoint(n, u), e && e.lineTo(n, u);
    }), a;
  }
  getMarkers() {
    var {
      points: e
    } = this, t = e.length - 1, r = [];
    return e.forEach((i, a) => {
      a !== t && r.push([i, i.angleTo(e[a + 1])]);
    }), r.length > 0 && r.push([e[e.length - 1], r[r.length - 1][1]]), r;
  }
}
class Xo extends Vn {
  constructor() {
    super(...arguments), this.type = "polygon";
  }
  path(e) {
    var t = super.path(e), [{
      x: r,
      y: i
    }] = this.points;
    return e && (e.lineTo(r, i), e.closePath()), t;
  }
}
class Yo extends Y {
  constructor() {
    super(...arguments), this.type = "pattern";
  }
  createPattern(e, t, r) {
    var i = this.getStyle("width").getPixels("x", !0), a = this.getStyle("height").getPixels("y", !0), s = new ft(this.document, null);
    s.attributes.viewBox = new R(this.document, "viewBox", this.getAttribute("viewBox").getValue()), s.attributes.width = new R(this.document, "width", "".concat(i, "px")), s.attributes.height = new R(this.document, "height", "".concat(a, "px")), s.attributes.transform = new R(this.document, "transform", this.getAttribute("patternTransform").getValue()), s.children = this.children;
    var n = this.document.createCanvas(i, a), u = n.getContext("2d"), l = this.getAttribute("x"), h = this.getAttribute("y");
    l.hasValue() && h.hasValue() && u.translate(l.getPixels("x", !0), h.getPixels("y", !0)), r.hasValue() ? this.styles["fill-opacity"] = r : Reflect.deleteProperty(this.styles, "fill-opacity");
    for (var c = -1; c <= 1; c++)
      for (var v = -1; v <= 1; v++)
        u.save(), s.attributes.x = new R(this.document, "x", c * n.width), s.attributes.y = new R(this.document, "y", v * n.height), s.render(u), u.restore();
    var f = e.createPattern(n, "repeat");
    return f;
  }
}
class Qo extends Y {
  constructor() {
    super(...arguments), this.type = "marker";
  }
  render(e, t, r) {
    if (t) {
      var {
        x: i,
        y: a
      } = t, s = this.getAttribute("orient").getString("auto"), n = this.getAttribute("markerUnits").getString("strokeWidth");
      e.translate(i, a), s === "auto" && e.rotate(r), n === "strokeWidth" && e.scale(e.lineWidth, e.lineWidth), e.save();
      var u = new ft(this.document, null);
      u.type = this.type, u.attributes.viewBox = new R(this.document, "viewBox", this.getAttribute("viewBox").getValue()), u.attributes.refX = new R(this.document, "refX", this.getAttribute("refX").getValue()), u.attributes.refY = new R(this.document, "refY", this.getAttribute("refY").getValue()), u.attributes.width = new R(this.document, "width", this.getAttribute("markerWidth").getValue()), u.attributes.height = new R(this.document, "height", this.getAttribute("markerHeight").getValue()), u.attributes.overflow = new R(this.document, "overflow", this.getAttribute("overflow").getValue()), u.attributes.fill = new R(this.document, "fill", this.getAttribute("fill").getColor("black")), u.attributes.stroke = new R(this.document, "stroke", this.getAttribute("stroke").getValue("none")), u.children = this.children, u.render(e), e.restore(), n === "strokeWidth" && e.scale(1 / e.lineWidth, 1 / e.lineWidth), s === "auto" && e.rotate(-r), e.translate(-i, -a);
    }
  }
}
class Zo extends Y {
  constructor() {
    super(...arguments), this.type = "defs";
  }
  render() {
  }
}
class Gr extends Xe {
  constructor() {
    super(...arguments), this.type = "g";
  }
  getBoundingBox(e) {
    var t = new Te();
    return this.children.forEach((r) => {
      t.addBoundingBox(r.getBoundingBox(e));
    }), t;
  }
}
class Dn extends Y {
  constructor(e, t, r) {
    super(e, t, r), this.attributesToInherit = ["gradientUnits"], this.stops = [];
    var {
      stops: i,
      children: a
    } = this;
    a.forEach((s) => {
      s.type === "stop" && i.push(s);
    });
  }
  getGradientUnits() {
    return this.getAttribute("gradientUnits").getString("objectBoundingBox");
  }
  createGradient(e, t, r) {
    var i = this;
    this.getHrefAttribute().hasValue() && (i = this.getHrefAttribute().getDefinition(), this.inheritStopContainer(i));
    var {
      stops: a
    } = i, s = this.getGradient(e, t);
    if (!s)
      return this.addParentOpacity(r, a[a.length - 1].color);
    if (a.forEach((p) => {
      s.addColorStop(p.offset, this.addParentOpacity(r, p.color));
    }), this.getAttribute("gradientTransform").hasValue()) {
      var {
        document: n
      } = this, {
        MAX_VIRTUAL_PIXELS: u,
        viewPort: l
      } = n.screen, [h] = l.viewPorts, c = new _n(n, null);
      c.attributes.x = new R(n, "x", -u / 3), c.attributes.y = new R(n, "y", -u / 3), c.attributes.width = new R(n, "width", u), c.attributes.height = new R(n, "height", u);
      var v = new Gr(n, null);
      v.attributes.transform = new R(n, "transform", this.getAttribute("gradientTransform").getValue()), v.children = [c];
      var f = new ft(n, null);
      f.attributes.x = new R(n, "x", 0), f.attributes.y = new R(n, "y", 0), f.attributes.width = new R(n, "width", h.width), f.attributes.height = new R(n, "height", h.height), f.children = [v];
      var d = n.createCanvas(h.width, h.height), g = d.getContext("2d");
      return g.fillStyle = s, f.render(g), g.createPattern(d, "no-repeat");
    }
    return s;
  }
  inheritStopContainer(e) {
    this.attributesToInherit.forEach((t) => {
      !this.getAttribute(t).hasValue() && e.getAttribute(t).hasValue() && this.getAttribute(t, !0).setValue(e.getAttribute(t).getValue());
    });
  }
  addParentOpacity(e, t) {
    if (e.hasValue()) {
      var r = new R(this.document, "color", t);
      return r.addOpacity(e).getColor();
    }
    return t;
  }
}
class Ko extends Dn {
  constructor(e, t, r) {
    super(e, t, r), this.type = "linearGradient", this.attributesToInherit.push("x1", "y1", "x2", "y2");
  }
  getGradient(e, t) {
    var r = this.getGradientUnits() === "objectBoundingBox", i = r ? t.getBoundingBox(e) : null;
    if (r && !i)
      return null;
    !this.getAttribute("x1").hasValue() && !this.getAttribute("y1").hasValue() && !this.getAttribute("x2").hasValue() && !this.getAttribute("y2").hasValue() && (this.getAttribute("x1", !0).setValue(0), this.getAttribute("y1", !0).setValue(0), this.getAttribute("x2", !0).setValue(1), this.getAttribute("y2", !0).setValue(0));
    var a = r ? i.x + i.width * this.getAttribute("x1").getNumber() : this.getAttribute("x1").getPixels("x"), s = r ? i.y + i.height * this.getAttribute("y1").getNumber() : this.getAttribute("y1").getPixels("y"), n = r ? i.x + i.width * this.getAttribute("x2").getNumber() : this.getAttribute("x2").getPixels("x"), u = r ? i.y + i.height * this.getAttribute("y2").getNumber() : this.getAttribute("y2").getPixels("y");
    return a === n && s === u ? null : e.createLinearGradient(a, s, n, u);
  }
}
class Jo extends Dn {
  constructor(e, t, r) {
    super(e, t, r), this.type = "radialGradient", this.attributesToInherit.push("cx", "cy", "r", "fx", "fy", "fr");
  }
  getGradient(e, t) {
    var r = this.getGradientUnits() === "objectBoundingBox", i = t.getBoundingBox(e);
    if (r && !i)
      return null;
    this.getAttribute("cx").hasValue() || this.getAttribute("cx", !0).setValue("50%"), this.getAttribute("cy").hasValue() || this.getAttribute("cy", !0).setValue("50%"), this.getAttribute("r").hasValue() || this.getAttribute("r", !0).setValue("50%");
    var a = r ? i.x + i.width * this.getAttribute("cx").getNumber() : this.getAttribute("cx").getPixels("x"), s = r ? i.y + i.height * this.getAttribute("cy").getNumber() : this.getAttribute("cy").getPixels("y"), n = a, u = s;
    this.getAttribute("fx").hasValue() && (n = r ? i.x + i.width * this.getAttribute("fx").getNumber() : this.getAttribute("fx").getPixels("x")), this.getAttribute("fy").hasValue() && (u = r ? i.y + i.height * this.getAttribute("fy").getNumber() : this.getAttribute("fy").getPixels("y"));
    var l = r ? (i.width + i.height) / 2 * this.getAttribute("r").getNumber() : this.getAttribute("r").getPixels(), h = this.getAttribute("fr").getPixels();
    return e.createRadialGradient(n, u, h, a, s, l);
  }
}
class eu extends Y {
  constructor(e, t, r) {
    super(e, t, r), this.type = "stop";
    var i = Math.max(0, Math.min(1, this.getAttribute("offset").getNumber())), a = this.getStyle("stop-opacity"), s = this.getStyle("stop-color", !0);
    s.getString() === "" && s.setValue("#000"), a.hasValue() && (s = s.addOpacity(a)), this.offset = i, this.color = s.getColor();
  }
}
class Wr extends Y {
  constructor(e, t, r) {
    super(e, t, r), this.type = "animate", this.duration = 0, this.initialValue = null, this.initialUnits = "", this.removed = !1, this.frozen = !1, e.screen.animations.push(this), this.begin = this.getAttribute("begin").getMilliseconds(), this.maxDuration = this.begin + this.getAttribute("dur").getMilliseconds(), this.from = this.getAttribute("from"), this.to = this.getAttribute("to"), this.values = new R(e, "values", null);
    var i = this.getAttribute("values");
    i.hasValue() && this.values.setValue(i.getString().split(";"));
  }
  getProperty() {
    var e = this.getAttribute("attributeType").getString(), t = this.getAttribute("attributeName").getString();
    return e === "CSS" ? this.parent.getStyle(t, !0) : this.parent.getAttribute(t, !0);
  }
  calcValue() {
    var {
      initialUnits: e
    } = this, {
      progress: t,
      from: r,
      to: i
    } = this.getProgress(), a = r.getNumber() + (i.getNumber() - r.getNumber()) * t;
    return e === "%" && (a *= 100), "".concat(a).concat(e);
  }
  update(e) {
    var {
      parent: t
    } = this, r = this.getProperty();
    if (this.initialValue || (this.initialValue = r.getString(), this.initialUnits = r.getUnits()), this.duration > this.maxDuration) {
      var i = this.getAttribute("fill").getString("remove");
      if (this.getAttribute("repeatCount").getString() === "indefinite" || this.getAttribute("repeatDur").getString() === "indefinite")
        this.duration = 0;
      else if (i === "freeze" && !this.frozen)
        this.frozen = !0, t.animationFrozen = !0, t.animationFrozenValue = r.getString();
      else if (i === "remove" && !this.removed)
        return this.removed = !0, r.setValue(t.animationFrozen ? t.animationFrozenValue : this.initialValue), !0;
      return !1;
    }
    this.duration += e;
    var a = !1;
    if (this.begin < this.duration) {
      var s = this.calcValue(), n = this.getAttribute("type");
      if (n.hasValue()) {
        var u = n.getString();
        s = "".concat(u, "(").concat(s, ")");
      }
      r.setValue(s), a = !0;
    }
    return a;
  }
  getProgress() {
    var {
      document: e,
      values: t
    } = this, r = {
      progress: (this.duration - this.begin) / (this.maxDuration - this.begin)
    };
    if (t.hasValue()) {
      var i = r.progress * (t.getValue().length - 1), a = Math.floor(i), s = Math.ceil(i);
      r.from = new R(e, "from", parseFloat(t.getValue()[a])), r.to = new R(e, "to", parseFloat(t.getValue()[s])), r.progress = (i - a) / (s - a);
    } else
      r.from = this.from, r.to = this.to;
    return r;
  }
}
class tu extends Wr {
  constructor() {
    super(...arguments), this.type = "animateColor";
  }
  calcValue() {
    var {
      progress: e,
      from: t,
      to: r
    } = this.getProgress(), i = new Mr(t.getColor()), a = new Mr(r.getColor());
    if (i.ok && a.ok) {
      var s = i.r + (a.r - i.r) * e, n = i.g + (a.g - i.g) * e, u = i.b + (a.b - i.b) * e;
      return "rgb(".concat(Math.floor(s), ", ").concat(Math.floor(n), ", ").concat(Math.floor(u), ")");
    }
    return this.getAttribute("from").getColor();
  }
}
class ru extends Wr {
  constructor() {
    super(...arguments), this.type = "animateTransform";
  }
  calcValue() {
    var {
      progress: e,
      from: t,
      to: r
    } = this.getProgress(), i = he(t.getString()), a = he(r.getString()), s = i.map((n, u) => {
      var l = a[u];
      return n + (l - n) * e;
    }).join(" ");
    return s;
  }
}
class iu extends Y {
  constructor(e, t, r) {
    super(e, t, r), this.type = "font", this.glyphs = /* @__PURE__ */ Object.create(null), this.horizAdvX = this.getAttribute("horiz-adv-x").getNumber();
    var {
      definitions: i
    } = e, {
      children: a
    } = this;
    for (var s of a)
      switch (s.type) {
        case "font-face": {
          this.fontFace = s;
          var n = s.getStyle("font-family");
          n.hasValue() && (i[n.getString()] = this);
          break;
        }
        case "missing-glyph":
          this.missingGlyph = s;
          break;
        case "glyph": {
          var u = s;
          u.arabicForm ? (this.isRTL = !0, this.isArabic = !0, typeof this.glyphs[u.unicode] > "u" && (this.glyphs[u.unicode] = /* @__PURE__ */ Object.create(null)), this.glyphs[u.unicode][u.arabicForm] = u) : this.glyphs[u.unicode] = u;
          break;
        }
      }
  }
  render() {
  }
}
class au extends Y {
  constructor(e, t, r) {
    super(e, t, r), this.type = "font-face", this.ascent = this.getAttribute("ascent").getNumber(), this.descent = this.getAttribute("descent").getNumber(), this.unitsPerEm = this.getAttribute("units-per-em").getNumber();
  }
}
class nu extends X {
  constructor() {
    super(...arguments), this.type = "missing-glyph", this.horizAdvX = 0;
  }
}
class su extends Be {
  constructor() {
    super(...arguments), this.type = "tref";
  }
  getText() {
    var e = this.getHrefAttribute().getDefinition();
    if (e) {
      var t = e.children[0];
      if (t)
        return t.getText();
    }
    return "";
  }
}
class ou extends Be {
  constructor(e, t, r) {
    super(e, t, r), this.type = "a";
    var {
      childNodes: i
    } = t, a = i[0], s = i.length > 0 && Array.from(i).every((n) => n.nodeType === 3);
    this.hasText = s, this.text = s ? this.getTextFromNode(a) : "";
  }
  getText() {
    return this.text;
  }
  renderChildren(e) {
    if (this.hasText) {
      super.renderChildren(e);
      var {
        document: t,
        x: r,
        y: i
      } = this, {
        mouse: a
      } = t.screen, s = new R(t, "fontSize", ie.parse(t.ctx.font).fontSize);
      a.isWorking() && a.checkBoundingBox(this, new Te(r, i - s.getPixels("y"), r + this.measureText(e), i));
    } else if (this.children.length > 0) {
      var n = new Gr(this.document, null);
      n.children = this.children, n.parent = this, n.render(e);
    }
  }
  onClick() {
    var {
      window: e
    } = this.document;
    e && e.open(this.getHrefAttribute().getString());
  }
  onMouseMove() {
    var e = this.document.ctx;
    e.canvas.style.cursor = "pointer";
  }
}
function Xa(o, e) {
  var t = Object.keys(o);
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(o);
    e && (r = r.filter(function(i) {
      return Object.getOwnPropertyDescriptor(o, i).enumerable;
    })), t.push.apply(t, r);
  }
  return t;
}
function gt(o) {
  for (var e = 1; e < arguments.length; e++) {
    var t = arguments[e] != null ? arguments[e] : {};
    e % 2 ? Xa(Object(t), !0).forEach(function(r) {
      $r(o, r, t[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(o, Object.getOwnPropertyDescriptors(t)) : Xa(Object(t)).forEach(function(r) {
      Object.defineProperty(o, r, Object.getOwnPropertyDescriptor(t, r));
    });
  }
  return o;
}
class uu extends Be {
  constructor(e, t, r) {
    super(e, t, r), this.type = "textPath", this.textWidth = 0, this.textHeight = 0, this.pathLength = -1, this.glyphInfo = null, this.letterSpacingCache = [], this.measuresCache = /* @__PURE__ */ new Map([["", 0]]);
    var i = this.getHrefAttribute().getDefinition();
    this.text = this.getTextFromNode(), this.dataArray = this.parsePathData(i);
  }
  getText() {
    return this.text;
  }
  path(e) {
    var {
      dataArray: t
    } = this;
    e && e.beginPath(), t.forEach((r) => {
      var {
        type: i,
        points: a
      } = r;
      switch (i) {
        case B.LINE_TO:
          e && e.lineTo(a[0], a[1]);
          break;
        case B.MOVE_TO:
          e && e.moveTo(a[0], a[1]);
          break;
        case B.CURVE_TO:
          e && e.bezierCurveTo(a[0], a[1], a[2], a[3], a[4], a[5]);
          break;
        case B.QUAD_TO:
          e && e.quadraticCurveTo(a[0], a[1], a[2], a[3]);
          break;
        case B.ARC: {
          var [s, n, u, l, h, c, v, f] = a, d = u > l ? u : l, g = u > l ? 1 : u / l, p = u > l ? l / u : 1;
          e && (e.translate(s, n), e.rotate(v), e.scale(g, p), e.arc(0, 0, d, h, h + c, !!(1 - f)), e.scale(1 / g, 1 / p), e.rotate(-v), e.translate(-s, -n));
          break;
        }
        case B.CLOSE_PATH:
          e && e.closePath();
          break;
      }
    });
  }
  renderChildren(e) {
    this.setTextData(e), e.save();
    var t = this.parent.getStyle("text-decoration").getString(), r = this.getFontSize(), {
      glyphInfo: i
    } = this, a = e.fillStyle;
    t === "underline" && e.beginPath(), i.forEach((s, n) => {
      var {
        p0: u,
        p1: l,
        rotation: h,
        text: c
      } = s;
      e.save(), e.translate(u.x, u.y), e.rotate(h), e.fillStyle && e.fillText(c, 0, 0), e.strokeStyle && e.strokeText(c, 0, 0), e.restore(), t === "underline" && (n === 0 && e.moveTo(u.x, u.y + r / 8), e.lineTo(l.x, l.y + r / 5));
    }), t === "underline" && (e.lineWidth = r / 20, e.strokeStyle = a, e.stroke(), e.closePath()), e.restore();
  }
  getLetterSpacingAt() {
    var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0;
    return this.letterSpacingCache[e] || 0;
  }
  findSegmentToFitChar(e, t, r, i, a, s, n, u, l) {
    var h = s, c = this.measureText(e, u);
    u === " " && t === "justify" && r < i && (c += (i - r) / a), l > -1 && (h += this.getLetterSpacingAt(l));
    var v = this.textHeight / 20, f = this.getEquidistantPointOnPath(h, v, 0), d = this.getEquidistantPointOnPath(h + c, v, 0), g = {
      p0: f,
      p1: d
    }, p = f && d ? Math.atan2(d.y - f.y, d.x - f.x) : 0;
    if (n) {
      var y = Math.cos(Math.PI / 2 + p) * n, b = Math.cos(-p) * n;
      g.p0 = gt(gt({}, f), {}, {
        x: f.x + y,
        y: f.y + b
      }), g.p1 = gt(gt({}, d), {}, {
        x: d.x + y,
        y: d.y + b
      });
    }
    return h += c, {
      offset: h,
      segment: g,
      rotation: p
    };
  }
  measureText(e, t) {
    var {
      measuresCache: r
    } = this, i = t || this.getText();
    if (r.has(i))
      return r.get(i);
    var a = this.measureTargetText(e, i);
    return r.set(i, a), a;
  }
  // This method supposes what all custom fonts already loaded.
  // If some font will be loaded after this method call, <textPath> will not be rendered correctly.
  // You need to call this method manually to update glyphs cache.
  setTextData(e) {
    if (!this.glyphInfo) {
      var t = this.getText(), r = t.split(""), i = t.split(" ").length - 1, a = this.parent.getAttribute("dx").split().map((x) => x.getPixels("x")), s = this.parent.getAttribute("dy").getPixels("y"), n = this.parent.getStyle("text-anchor").getString("start"), u = this.getStyle("letter-spacing"), l = this.parent.getStyle("letter-spacing"), h = 0;
      !u.hasValue() || u.getValue() === "inherit" ? h = l.getPixels() : u.hasValue() && u.getValue() !== "initial" && u.getValue() !== "unset" && (h = u.getPixels());
      var c = [], v = t.length;
      this.letterSpacingCache = c;
      for (var f = 0; f < v; f++)
        c.push(typeof a[f] < "u" ? a[f] : h);
      var d = c.reduce((x, A, C) => C === 0 ? 0 : x + A || 0, 0), g = this.measureText(e), p = Math.max(g + d, 0);
      this.textWidth = g, this.textHeight = this.getFontSize(), this.glyphInfo = [];
      var y = this.getPathLength(), b = this.getStyle("startOffset").getNumber(0) * y, m = 0;
      (n === "middle" || n === "center") && (m = -p / 2), (n === "end" || n === "right") && (m = -p), m += b, r.forEach((x, A) => {
        var {
          offset: C,
          segment: T,
          rotation: O
        } = this.findSegmentToFitChar(e, n, p, y, i, m, s, x, A);
        m = C, !(!T.p0 || !T.p1) && this.glyphInfo.push({
          // transposeX: midpoint.x,
          // transposeY: midpoint.y,
          text: r[A],
          p0: T.p0,
          p1: T.p1,
          rotation: O
        });
      });
    }
  }
  parsePathData(e) {
    if (this.pathLength = -1, !e)
      return [];
    var t = [], {
      pathParser: r
    } = e;
    for (r.reset(); !r.isEnd(); ) {
      var {
        current: i
      } = r, a = i ? i.x : 0, s = i ? i.y : 0, n = r.next(), u = n.type, l = [];
      switch (n.type) {
        case B.MOVE_TO:
          this.pathM(r, l);
          break;
        case B.LINE_TO:
          u = this.pathL(r, l);
          break;
        case B.HORIZ_LINE_TO:
          u = this.pathH(r, l);
          break;
        case B.VERT_LINE_TO:
          u = this.pathV(r, l);
          break;
        case B.CURVE_TO:
          this.pathC(r, l);
          break;
        case B.SMOOTH_CURVE_TO:
          u = this.pathS(r, l);
          break;
        case B.QUAD_TO:
          this.pathQ(r, l);
          break;
        case B.SMOOTH_QUAD_TO:
          u = this.pathT(r, l);
          break;
        case B.ARC:
          l = this.pathA(r);
          break;
        case B.CLOSE_PATH:
          X.pathZ(r);
          break;
      }
      n.type !== B.CLOSE_PATH ? t.push({
        type: u,
        points: l,
        start: {
          x: a,
          y: s
        },
        pathLength: this.calcLength(a, s, u, l)
      }) : t.push({
        type: B.CLOSE_PATH,
        points: [],
        pathLength: 0
      });
    }
    return t;
  }
  pathM(e, t) {
    var {
      x: r,
      y: i
    } = X.pathM(e).point;
    t.push(r, i);
  }
  pathL(e, t) {
    var {
      x: r,
      y: i
    } = X.pathL(e).point;
    return t.push(r, i), B.LINE_TO;
  }
  pathH(e, t) {
    var {
      x: r,
      y: i
    } = X.pathH(e).point;
    return t.push(r, i), B.LINE_TO;
  }
  pathV(e, t) {
    var {
      x: r,
      y: i
    } = X.pathV(e).point;
    return t.push(r, i), B.LINE_TO;
  }
  pathC(e, t) {
    var {
      point: r,
      controlPoint: i,
      currentPoint: a
    } = X.pathC(e);
    t.push(r.x, r.y, i.x, i.y, a.x, a.y);
  }
  pathS(e, t) {
    var {
      point: r,
      controlPoint: i,
      currentPoint: a
    } = X.pathS(e);
    return t.push(r.x, r.y, i.x, i.y, a.x, a.y), B.CURVE_TO;
  }
  pathQ(e, t) {
    var {
      controlPoint: r,
      currentPoint: i
    } = X.pathQ(e);
    t.push(r.x, r.y, i.x, i.y);
  }
  pathT(e, t) {
    var {
      controlPoint: r,
      currentPoint: i
    } = X.pathT(e);
    return t.push(r.x, r.y, i.x, i.y), B.QUAD_TO;
  }
  pathA(e) {
    var {
      rX: t,
      rY: r,
      sweepFlag: i,
      xAxisRotation: a,
      centp: s,
      a1: n,
      ad: u
    } = X.pathA(e);
    return i === 0 && u > 0 && (u -= 2 * Math.PI), i === 1 && u < 0 && (u += 2 * Math.PI), [s.x, s.y, t, r, n, u, a, i];
  }
  calcLength(e, t, r, i) {
    var a = 0, s = null, n = null, u = 0;
    switch (r) {
      case B.LINE_TO:
        return this.getLineLength(e, t, i[0], i[1]);
      case B.CURVE_TO:
        for (a = 0, s = this.getPointOnCubicBezier(0, e, t, i[0], i[1], i[2], i[3], i[4], i[5]), u = 0.01; u <= 1; u += 0.01)
          n = this.getPointOnCubicBezier(u, e, t, i[0], i[1], i[2], i[3], i[4], i[5]), a += this.getLineLength(s.x, s.y, n.x, n.y), s = n;
        return a;
      case B.QUAD_TO:
        for (a = 0, s = this.getPointOnQuadraticBezier(0, e, t, i[0], i[1], i[2], i[3]), u = 0.01; u <= 1; u += 0.01)
          n = this.getPointOnQuadraticBezier(u, e, t, i[0], i[1], i[2], i[3]), a += this.getLineLength(s.x, s.y, n.x, n.y), s = n;
        return a;
      case B.ARC: {
        a = 0;
        var l = i[4], h = i[5], c = i[4] + h, v = Math.PI / 180;
        if (Math.abs(l - c) < v && (v = Math.abs(l - c)), s = this.getPointOnEllipticalArc(i[0], i[1], i[2], i[3], l, 0), h < 0)
          for (u = l - v; u > c; u -= v)
            n = this.getPointOnEllipticalArc(i[0], i[1], i[2], i[3], u, 0), a += this.getLineLength(s.x, s.y, n.x, n.y), s = n;
        else
          for (u = l + v; u < c; u += v)
            n = this.getPointOnEllipticalArc(i[0], i[1], i[2], i[3], u, 0), a += this.getLineLength(s.x, s.y, n.x, n.y), s = n;
        return n = this.getPointOnEllipticalArc(i[0], i[1], i[2], i[3], c, 0), a += this.getLineLength(s.x, s.y, n.x, n.y), a;
      }
    }
    return 0;
  }
  getPointOnLine(e, t, r, i, a) {
    var s = arguments.length > 5 && arguments[5] !== void 0 ? arguments[5] : t, n = arguments.length > 6 && arguments[6] !== void 0 ? arguments[6] : r, u = (a - r) / (i - t + Ye), l = Math.sqrt(e * e / (1 + u * u));
    i < t && (l *= -1);
    var h = u * l, c = null;
    if (i === t)
      c = {
        x: s,
        y: n + h
      };
    else if ((n - r) / (s - t + Ye) === u)
      c = {
        x: s + l,
        y: n + h
      };
    else {
      var v = 0, f = 0, d = this.getLineLength(t, r, i, a);
      if (d < Ye)
        return null;
      var g = (s - t) * (i - t) + (n - r) * (a - r);
      g /= d * d, v = t + g * (i - t), f = r + g * (a - r);
      var p = this.getLineLength(s, n, v, f), y = Math.sqrt(e * e - p * p);
      l = Math.sqrt(y * y / (1 + u * u)), i < t && (l *= -1), h = u * l, c = {
        x: v + l,
        y: f + h
      };
    }
    return c;
  }
  getPointOnPath(e) {
    var t = this.getPathLength(), r = 0, i = null;
    if (e < -5e-5 || e - 5e-5 > t)
      return null;
    var {
      dataArray: a
    } = this;
    for (var s of a) {
      if (s && (s.pathLength < 5e-5 || r + s.pathLength + 5e-5 < e)) {
        r += s.pathLength;
        continue;
      }
      var n = e - r, u = 0;
      switch (s.type) {
        case B.LINE_TO:
          i = this.getPointOnLine(n, s.start.x, s.start.y, s.points[0], s.points[1], s.start.x, s.start.y);
          break;
        case B.ARC: {
          var l = s.points[4], h = s.points[5], c = s.points[4] + h;
          if (u = l + n / s.pathLength * h, h < 0 && u < c || h >= 0 && u > c)
            break;
          i = this.getPointOnEllipticalArc(s.points[0], s.points[1], s.points[2], s.points[3], u, s.points[6]);
          break;
        }
        case B.CURVE_TO:
          u = n / s.pathLength, u > 1 && (u = 1), i = this.getPointOnCubicBezier(u, s.start.x, s.start.y, s.points[0], s.points[1], s.points[2], s.points[3], s.points[4], s.points[5]);
          break;
        case B.QUAD_TO:
          u = n / s.pathLength, u > 1 && (u = 1), i = this.getPointOnQuadraticBezier(u, s.start.x, s.start.y, s.points[0], s.points[1], s.points[2], s.points[3]);
          break;
      }
      if (i)
        return i;
      break;
    }
    return null;
  }
  getLineLength(e, t, r, i) {
    return Math.sqrt((r - e) * (r - e) + (i - t) * (i - t));
  }
  getPathLength() {
    return this.pathLength === -1 && (this.pathLength = this.dataArray.reduce((e, t) => t.pathLength > 0 ? e + t.pathLength : e, 0)), this.pathLength;
  }
  getPointOnCubicBezier(e, t, r, i, a, s, n, u, l) {
    var h = u * Fa(e) + s * ja(e) + i * Ha(e) + t * za(e), c = l * Fa(e) + n * ja(e) + a * Ha(e) + r * za(e);
    return {
      x: h,
      y: c
    };
  }
  getPointOnQuadraticBezier(e, t, r, i, a, s, n) {
    var u = s * $a(e) + i * Ga(e) + t * Wa(e), l = n * $a(e) + a * Ga(e) + r * Wa(e);
    return {
      x: u,
      y: l
    };
  }
  getPointOnEllipticalArc(e, t, r, i, a, s) {
    var n = Math.cos(s), u = Math.sin(s), l = {
      x: r * Math.cos(a),
      y: i * Math.sin(a)
    };
    return {
      x: e + (l.x * n - l.y * u),
      y: t + (l.x * u + l.y * n)
    };
  }
  // TODO need some optimisations. possibly build cache only for curved segments?
  buildEquidistantCache(e, t) {
    var r = this.getPathLength(), i = t || 0.25, a = e || r / 100;
    if (!this.equidistantCache || this.equidistantCache.step !== a || this.equidistantCache.precision !== i) {
      this.equidistantCache = {
        step: a,
        precision: i,
        points: []
      };
      for (var s = 0, n = 0; n <= r; n += i) {
        var u = this.getPointOnPath(n), l = this.getPointOnPath(n + i);
        !u || !l || (s += this.getLineLength(u.x, u.y, l.x, l.y), s >= a && (this.equidistantCache.points.push({
          x: u.x,
          y: u.y,
          distance: n
        }), s -= a));
      }
    }
  }
  getEquidistantPointOnPath(e, t, r) {
    if (this.buildEquidistantCache(t, r), e < 0 || e - this.getPathLength() > 5e-5)
      return null;
    var i = Math.round(e / this.getPathLength() * (this.equidistantCache.points.length - 1));
    return this.equidistantCache.points[i] || null;
  }
}
var lu = /^\s*data:(([^/,;]+\/[^/,;]+)(?:;([^,;=]+=[^,;=]+))?)?(?:;(base64))?,(.*)$/i;
class hu extends Xe {
  constructor(e, t, r) {
    super(e, t, r), this.type = "image", this.loaded = !1;
    var i = this.getHrefAttribute().getString();
    if (i) {
      var a = i.endsWith(".svg") || /^\s*data:image\/svg\+xml/i.test(i);
      e.images.push(this), a ? this.loadSvg(i) : this.loadImage(i), this.isSvg = a;
    }
  }
  loadImage(e) {
    var t = this;
    return _e(function* () {
      try {
        var r = yield t.document.createImage(e);
        t.image = r;
      } catch (i) {
        console.error('Error while loading image "'.concat(e, '":'), i);
      }
      t.loaded = !0;
    })();
  }
  loadSvg(e) {
    var t = this;
    return _e(function* () {
      var r = lu.exec(e);
      if (r) {
        var i = r[5];
        r[4] === "base64" ? t.image = atob(i) : t.image = decodeURIComponent(i);
      } else
        try {
          var a = yield t.document.fetch(e), s = yield a.text();
          t.image = s;
        } catch (n) {
          console.error('Error while loading image "'.concat(e, '":'), n);
        }
      t.loaded = !0;
    })();
  }
  renderChildren(e) {
    var {
      document: t,
      image: r,
      loaded: i
    } = this, a = this.getAttribute("x").getPixels("x"), s = this.getAttribute("y").getPixels("y"), n = this.getStyle("width").getPixels("x"), u = this.getStyle("height").getPixels("y");
    if (!(!i || !r || !n || !u)) {
      if (e.save(), e.translate(a, s), this.isSvg) {
        var l = t.canvg.forkString(e, this.image, {
          ignoreMouse: !0,
          ignoreAnimation: !0,
          ignoreDimensions: !0,
          ignoreClear: !0,
          offsetX: 0,
          offsetY: 0,
          scaleWidth: n,
          scaleHeight: u
        });
        l.document.documentElement.parent = this, l.render();
      } else {
        var h = this.image;
        t.setViewBox({
          ctx: e,
          aspectRatio: this.getAttribute("preserveAspectRatio").getString(),
          width: n,
          desiredWidth: h.width,
          height: u,
          desiredHeight: h.height
        }), this.loaded && (typeof h.complete > "u" || h.complete) && e.drawImage(h, 0, 0);
      }
      e.restore();
    }
  }
  getBoundingBox() {
    var e = this.getAttribute("x").getPixels("x"), t = this.getAttribute("y").getPixels("y"), r = this.getStyle("width").getPixels("x"), i = this.getStyle("height").getPixels("y");
    return new Te(e, t, e + r, t + i);
  }
}
class fu extends Xe {
  constructor() {
    super(...arguments), this.type = "symbol";
  }
  render(e) {
  }
}
class cu {
  constructor(e) {
    this.document = e, this.loaded = !1, e.fonts.push(this);
  }
  load(e, t) {
    var r = this;
    return _e(function* () {
      try {
        var {
          document: i
        } = r, a = yield i.canvg.parser.load(t), s = a.getElementsByTagName("font");
        Array.from(s).forEach((n) => {
          var u = i.createElement(n);
          i.definitions[e] = u;
        });
      } catch (n) {
        console.error('Error while loading font "'.concat(t, '":'), n);
      }
      r.loaded = !0;
    })();
  }
}
class kn extends Y {
  constructor(e, t, r) {
    super(e, t, r), this.type = "style";
    var i = Ke(
      Array.from(t.childNodes).map((s) => s.textContent).join("").replace(/(\/\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*+\/)|(^[\s]*\/\/.*)/gm, "").replace(/@import.*;/g, "")
      // remove imports
    ), a = i.split("}");
    a.forEach((s) => {
      var n = s.trim();
      if (n) {
        var u = n.split("{"), l = u[0].split(","), h = u[1].split(";");
        l.forEach((c) => {
          var v = c.trim();
          if (v) {
            var f = e.styles[v] || {};
            if (h.forEach((p) => {
              var y = p.indexOf(":"), b = p.substr(0, y).trim(), m = p.substr(y + 1, p.length - y).trim();
              b && m && (f[b] = new R(e, b, m));
            }), e.styles[v] = f, e.stylesSpecificity[v] = wo(v), v === "@font-face") {
              var d = f["font-family"].getString().replace(/"|'/g, ""), g = f.src.getString().split(",");
              g.forEach((p) => {
                if (p.indexOf('format("svg")') > 0) {
                  var y = wn(p);
                  y && new cu(e).load(d, y);
                }
              });
            }
          }
        });
      }
    });
  }
}
kn.parseExternalUrl = wn;
class vu extends Xe {
  constructor() {
    super(...arguments), this.type = "use";
  }
  setContext(e) {
    super.setContext(e);
    var t = this.getAttribute("x"), r = this.getAttribute("y");
    t.hasValue() && e.translate(t.getPixels("x"), 0), r.hasValue() && e.translate(0, r.getPixels("y"));
  }
  path(e) {
    var {
      element: t
    } = this;
    t && t.path(e);
  }
  renderChildren(e) {
    var {
      document: t,
      element: r
    } = this;
    if (r) {
      var i = r;
      if (r.type === "symbol" && (i = new ft(t, null), i.attributes.viewBox = new R(t, "viewBox", r.getAttribute("viewBox").getString()), i.attributes.preserveAspectRatio = new R(t, "preserveAspectRatio", r.getAttribute("preserveAspectRatio").getString()), i.attributes.overflow = new R(t, "overflow", r.getAttribute("overflow").getString()), i.children = r.children, r.styles.opacity = new R(t, "opacity", this.calculateOpacity())), i.type === "svg") {
        var a = this.getStyle("width", !1, !0), s = this.getStyle("height", !1, !0);
        a.hasValue() && (i.attributes.width = new R(t, "width", a.getString())), s.hasValue() && (i.attributes.height = new R(t, "height", s.getString()));
      }
      var n = i.parent;
      i.parent = this, i.render(e), i.parent = n;
    }
  }
  getBoundingBox(e) {
    var {
      element: t
    } = this;
    return t ? t.getBoundingBox(e) : null;
  }
  elementTransform() {
    var {
      document: e,
      element: t
    } = this;
    return We.fromElement(e, t);
  }
  get element() {
    return this.cachedElement || (this.cachedElement = this.getHrefAttribute().getDefinition()), this.cachedElement;
  }
}
function dt(o, e, t, r, i, a) {
  return o[t * r * 4 + e * 4 + a];
}
function pt(o, e, t, r, i, a, s) {
  o[t * r * 4 + e * 4 + a] = s;
}
function Z(o, e, t) {
  var r = o[e];
  return r * t;
}
function Me(o, e, t, r) {
  return e + Math.cos(o) * t + Math.sin(o) * r;
}
class qn extends Y {
  constructor(e, t, r) {
    super(e, t, r), this.type = "feColorMatrix";
    var i = he(this.getAttribute("values").getString());
    switch (this.getAttribute("type").getString("matrix")) {
      // http://www.w3.org/TR/SVG/filters.html#feColorMatrixElement
      case "saturate": {
        var a = i[0];
        i = [0.213 + 0.787 * a, 0.715 - 0.715 * a, 0.072 - 0.072 * a, 0, 0, 0.213 - 0.213 * a, 0.715 + 0.285 * a, 0.072 - 0.072 * a, 0, 0, 0.213 - 0.213 * a, 0.715 - 0.715 * a, 0.072 + 0.928 * a, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1];
        break;
      }
      case "hueRotate": {
        var s = i[0] * Math.PI / 180;
        i = [Me(s, 0.213, 0.787, -0.213), Me(s, 0.715, -0.715, -0.715), Me(s, 0.072, -0.072, 0.928), 0, 0, Me(s, 0.213, -0.213, 0.143), Me(s, 0.715, 0.285, 0.14), Me(s, 0.072, -0.072, -0.283), 0, 0, Me(s, 0.213, -0.213, -0.787), Me(s, 0.715, -0.715, 0.715), Me(s, 0.072, 0.928, 0.072), 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1];
        break;
      }
      case "luminanceToAlpha":
        i = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.2125, 0.7154, 0.0721, 0, 0, 0, 0, 0, 0, 1];
        break;
    }
    this.matrix = i, this.includeOpacity = this.getAttribute("includeOpacity").hasValue();
  }
  apply(e, t, r, i, a) {
    for (var {
      includeOpacity: s,
      matrix: n
    } = this, u = e.getImageData(0, 0, i, a), l = 0; l < a; l++)
      for (var h = 0; h < i; h++) {
        var c = dt(u.data, h, l, i, a, 0), v = dt(u.data, h, l, i, a, 1), f = dt(u.data, h, l, i, a, 2), d = dt(u.data, h, l, i, a, 3), g = Z(n, 0, c) + Z(n, 1, v) + Z(n, 2, f) + Z(n, 3, d) + Z(n, 4, 1), p = Z(n, 5, c) + Z(n, 6, v) + Z(n, 7, f) + Z(n, 8, d) + Z(n, 9, 1), y = Z(n, 10, c) + Z(n, 11, v) + Z(n, 12, f) + Z(n, 13, d) + Z(n, 14, 1), b = Z(n, 15, c) + Z(n, 16, v) + Z(n, 17, f) + Z(n, 18, d) + Z(n, 19, 1);
        s && (g = 0, p = 0, y = 0, b *= d / 255), pt(u.data, h, l, i, a, 0, g), pt(u.data, h, l, i, a, 1, p), pt(u.data, h, l, i, a, 2, y), pt(u.data, h, l, i, a, 3, b);
      }
    e.clearRect(0, 0, i, a), e.putImageData(u, 0, 0);
  }
}
class Ot extends Y {
  constructor() {
    super(...arguments), this.type = "mask";
  }
  apply(e, t) {
    var {
      document: r
    } = this, i = this.getAttribute("x").getPixels("x"), a = this.getAttribute("y").getPixels("y"), s = this.getStyle("width").getPixels("x"), n = this.getStyle("height").getPixels("y");
    if (!s && !n) {
      var u = new Te();
      this.children.forEach((d) => {
        u.addBoundingBox(d.getBoundingBox(e));
      }), i = Math.floor(u.x1), a = Math.floor(u.y1), s = Math.floor(u.width), n = Math.floor(u.height);
    }
    var l = this.removeStyles(t, Ot.ignoreStyles), h = r.createCanvas(i + s, a + n), c = h.getContext("2d");
    r.screen.setDefaults(c), this.renderChildren(c), new qn(r, {
      nodeType: 1,
      childNodes: [],
      attributes: [{
        nodeName: "type",
        value: "luminanceToAlpha"
      }, {
        nodeName: "includeOpacity",
        value: "true"
      }]
    }).apply(c, 0, 0, i + s, a + n);
    var v = r.createCanvas(i + s, a + n), f = v.getContext("2d");
    r.screen.setDefaults(f), t.render(f), f.globalCompositeOperation = "destination-in", f.fillStyle = c.createPattern(h, "no-repeat"), f.fillRect(0, 0, i + s, a + n), e.fillStyle = f.createPattern(v, "no-repeat"), e.fillRect(0, 0, i + s, a + n), this.restoreStyles(t, l);
  }
  render(e) {
  }
}
Ot.ignoreStyles = ["mask", "transform", "clip-path"];
var Ya = () => {
};
class gu extends Y {
  constructor() {
    super(...arguments), this.type = "clipPath";
  }
  apply(e) {
    var {
      document: t
    } = this, r = Reflect.getPrototypeOf(e), {
      beginPath: i,
      closePath: a
    } = e;
    r && (r.beginPath = Ya, r.closePath = Ya), Reflect.apply(i, e, []), this.children.forEach((s) => {
      if (!(typeof s.path > "u")) {
        var n = typeof s.elementTransform < "u" ? s.elementTransform() : null;
        n || (n = We.fromElement(t, s)), n && n.apply(e), s.path(e), r && (r.closePath = a), n && n.unapply(e);
      }
    }), Reflect.apply(a, e, []), e.clip(), r && (r.beginPath = i, r.closePath = a);
  }
  render(e) {
  }
}
class At extends Y {
  constructor() {
    super(...arguments), this.type = "filter";
  }
  apply(e, t) {
    var {
      document: r,
      children: i
    } = this, a = t.getBoundingBox(e);
    if (a) {
      var s = 0, n = 0;
      i.forEach((y) => {
        var b = y.extraFilterDistance || 0;
        s = Math.max(s, b), n = Math.max(n, b);
      });
      var u = Math.floor(a.width), l = Math.floor(a.height), h = u + 2 * s, c = l + 2 * n;
      if (!(h < 1 || c < 1)) {
        var v = Math.floor(a.x), f = Math.floor(a.y), d = this.removeStyles(t, At.ignoreStyles), g = r.createCanvas(h, c), p = g.getContext("2d");
        r.screen.setDefaults(p), p.translate(-v + s, -f + n), t.render(p), i.forEach((y) => {
          typeof y.apply == "function" && y.apply(p, 0, 0, h, c);
        }), e.drawImage(g, 0, 0, h, c, v - s, f - n, h, c), this.restoreStyles(t, d);
      }
    }
  }
  render(e) {
  }
}
At.ignoreStyles = ["filter", "transform", "clip-path"];
class du extends Y {
  constructor(e, t, r) {
    super(e, t, r), this.type = "feDropShadow", this.addStylesFromStyleDefinition();
  }
  apply(e, t, r, i, a) {
  }
}
class pu extends Y {
  constructor() {
    super(...arguments), this.type = "feMorphology";
  }
  apply(e, t, r, i, a) {
  }
}
class yu extends Y {
  constructor() {
    super(...arguments), this.type = "feComposite";
  }
  apply(e, t, r, i, a) {
  }
}
class mu extends Y {
  constructor(e, t, r) {
    super(e, t, r), this.type = "feGaussianBlur", this.blurRadius = Math.floor(this.getAttribute("stdDeviation").getNumber()), this.extraFilterDistance = this.blurRadius;
  }
  apply(e, t, r, i, a) {
    var {
      document: s,
      blurRadius: n
    } = this, u = s.window ? s.window.document.body : null, l = e.canvas;
    l.id = s.getUniqueId(), u && (l.style.display = "none", u.appendChild(l)), ho(l, t, r, i, a, n), u && u.removeChild(l);
  }
}
class xu extends Y {
  constructor() {
    super(...arguments), this.type = "title";
  }
}
class bu extends Y {
  constructor() {
    super(...arguments), this.type = "desc";
  }
}
var Eu = {
  svg: ft,
  rect: _n,
  circle: $o,
  ellipse: Go,
  line: Wo,
  polyline: Vn,
  polygon: Xo,
  path: X,
  pattern: Yo,
  marker: Qo,
  defs: Zo,
  linearGradient: Ko,
  radialGradient: Jo,
  stop: eu,
  animate: Wr,
  animateColor: tu,
  animateTransform: ru,
  font: iu,
  "font-face": au,
  "missing-glyph": nu,
  glyph: Mn,
  text: Be,
  tspan: Ct,
  tref: su,
  a: ou,
  textPath: uu,
  image: hu,
  g: Gr,
  symbol: fu,
  style: kn,
  use: vu,
  mask: Ot,
  clipPath: gu,
  filter: At,
  feDropShadow: du,
  feMorphology: pu,
  feComposite: yu,
  feColorMatrix: qn,
  feGaussianBlur: mu,
  title: xu,
  desc: bu
};
function Qa(o, e) {
  var t = Object.keys(o);
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(o);
    e && (r = r.filter(function(i) {
      return Object.getOwnPropertyDescriptor(o, i).enumerable;
    })), t.push.apply(t, r);
  }
  return t;
}
function Tu(o) {
  for (var e = 1; e < arguments.length; e++) {
    var t = arguments[e] != null ? arguments[e] : {};
    e % 2 ? Qa(Object(t), !0).forEach(function(r) {
      $r(o, r, t[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(o, Object.getOwnPropertyDescriptors(t)) : Qa(Object(t)).forEach(function(r) {
      Object.defineProperty(o, r, Object.getOwnPropertyDescriptor(t, r));
    });
  }
  return o;
}
function Su(o, e) {
  var t = document.createElement("canvas");
  return t.width = o, t.height = e, t;
}
function Cu(o) {
  return Dr.apply(this, arguments);
}
function Dr() {
  return Dr = _e(function* (o) {
    var e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1, t = document.createElement("img");
    return e && (t.crossOrigin = "Anonymous"), new Promise((r, i) => {
      t.onload = () => {
        r(t);
      }, t.onerror = (a, s, n, u, l) => {
        i(l);
      }, t.src = o;
    });
  }), Dr.apply(this, arguments);
}
class Le {
  constructor(e) {
    var {
      rootEmSize: t = 12,
      emSize: r = 12,
      createCanvas: i = Le.createCanvas,
      createImage: a = Le.createImage,
      anonymousCrossOrigin: s
    } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    this.canvg = e, this.definitions = /* @__PURE__ */ Object.create(null), this.styles = /* @__PURE__ */ Object.create(null), this.stylesSpecificity = /* @__PURE__ */ Object.create(null), this.images = [], this.fonts = [], this.emSizeStack = [], this.uniqueId = 0, this.screen = e.screen, this.rootEmSize = t, this.emSize = r, this.createCanvas = i, this.createImage = this.bindCreateImage(a, s), this.screen.wait(this.isImagesLoaded.bind(this)), this.screen.wait(this.isFontsLoaded.bind(this));
  }
  bindCreateImage(e, t) {
    return typeof t == "boolean" ? (r, i) => e(r, typeof i == "boolean" ? i : t) : e;
  }
  get window() {
    return this.screen.window;
  }
  get fetch() {
    return this.screen.fetch;
  }
  get ctx() {
    return this.screen.ctx;
  }
  get emSize() {
    var {
      emSizeStack: e
    } = this;
    return e[e.length - 1];
  }
  set emSize(e) {
    var {
      emSizeStack: t
    } = this;
    t.push(e);
  }
  popEmSize() {
    var {
      emSizeStack: e
    } = this;
    e.pop();
  }
  getUniqueId() {
    return "canvg".concat(++this.uniqueId);
  }
  isImagesLoaded() {
    return this.images.every((e) => e.loaded);
  }
  isFontsLoaded() {
    return this.fonts.every((e) => e.loaded);
  }
  createDocumentElement(e) {
    var t = this.createElement(e.documentElement);
    return t.root = !0, t.addStylesFromStyleDefinition(), this.documentElement = t, t;
  }
  createElement(e) {
    var t = e.nodeName.replace(/^[^:]+:/, ""), r = Le.elementTypes[t];
    return typeof r < "u" ? new r(this, e) : new Bo(this, e);
  }
  createTextNode(e) {
    return new zo(this, e);
  }
  setViewBox(e) {
    this.screen.setViewBox(Tu({
      document: this
    }, e));
  }
}
Le.createCanvas = Su;
Le.createImage = Cu;
Le.elementTypes = Eu;
function Za(o, e) {
  var t = Object.keys(o);
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(o);
    e && (r = r.filter(function(i) {
      return Object.getOwnPropertyDescriptor(o, i).enumerable;
    })), t.push.apply(t, r);
  }
  return t;
}
function $e(o) {
  for (var e = 1; e < arguments.length; e++) {
    var t = arguments[e] != null ? arguments[e] : {};
    e % 2 ? Za(Object(t), !0).forEach(function(r) {
      $r(o, r, t[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(o, Object.getOwnPropertyDescriptors(t)) : Za(Object(t)).forEach(function(r) {
      Object.defineProperty(o, r, Object.getOwnPropertyDescriptor(t, r));
    });
  }
  return o;
}
class at {
  /**
   * Main constructor.
   * @param ctx - Rendering context.
   * @param svg - SVG Document.
   * @param options - Rendering options.
   */
  constructor(e, t) {
    var r = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    this.parser = new Nr(r), this.screen = new St(e, r), this.options = r;
    var i = new Le(this, r), a = i.createDocumentElement(t);
    this.document = i, this.documentElement = a;
  }
  /**
   * Create Canvg instance from SVG source string or URL.
   * @param ctx - Rendering context.
   * @param svg - SVG source string or URL.
   * @param options - Rendering options.
   * @returns Canvg instance.
   */
  static from(e, t) {
    var r = arguments;
    return _e(function* () {
      var i = r.length > 2 && r[2] !== void 0 ? r[2] : {}, a = new Nr(i), s = yield a.parse(t);
      return new at(e, s, i);
    })();
  }
  /**
   * Create Canvg instance from SVG source string.
   * @param ctx - Rendering context.
   * @param svg - SVG source string.
   * @param options - Rendering options.
   * @returns Canvg instance.
   */
  static fromString(e, t) {
    var r = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, i = new Nr(r), a = i.parseFromString(t);
    return new at(e, a, r);
  }
  /**
   * Create new Canvg instance with inherited options.
   * @param ctx - Rendering context.
   * @param svg - SVG source string or URL.
   * @param options - Rendering options.
   * @returns Canvg instance.
   */
  fork(e, t) {
    var r = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    return at.from(e, t, $e($e({}, this.options), r));
  }
  /**
   * Create new Canvg instance with inherited options.
   * @param ctx - Rendering context.
   * @param svg - SVG source string.
   * @param options - Rendering options.
   * @returns Canvg instance.
   */
  forkString(e, t) {
    var r = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    return at.fromString(e, t, $e($e({}, this.options), r));
  }
  /**
   * Document is ready promise.
   * @returns Ready promise.
   */
  ready() {
    return this.screen.ready();
  }
  /**
   * Document is ready value.
   * @returns Is ready or not.
   */
  isReady() {
    return this.screen.isReady();
  }
  /**
   * Render only first frame, ignoring animations and mouse.
   * @param options - Rendering options.
   */
  render() {
    var e = arguments, t = this;
    return _e(function* () {
      var r = e.length > 0 && e[0] !== void 0 ? e[0] : {};
      t.start($e({
        enableRedraw: !0,
        ignoreAnimation: !0,
        ignoreMouse: !0
      }, r)), yield t.ready(), t.stop();
    })();
  }
  /**
   * Start rendering.
   * @param options - Render options.
   */
  start() {
    var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, {
      documentElement: t,
      screen: r,
      options: i
    } = this;
    r.start(t, $e($e({
      enableRedraw: !0
    }, i), e));
  }
  /**
   * Stop rendering.
   */
  stop() {
    this.screen.stop();
  }
  /**
   * Resize SVG to fit in given size.
   * @param width
   * @param height
   * @param preserveAspectRatio
   */
  resize(e) {
    var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : e, r = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : !1;
    this.documentElement.resize(e, t, r);
  }
}
export {
  ou as AElement,
  tu as AnimateColorElement,
  Wr as AnimateElement,
  ru as AnimateTransformElement,
  Te as BoundingBox,
  Fa as CB1,
  ja as CB2,
  Ha as CB3,
  za as CB4,
  at as Canvg,
  $o as CircleElement,
  gu as ClipPathElement,
  Zo as DefsElement,
  bu as DescElement,
  Le as Document,
  Y as Element,
  Go as EllipseElement,
  qn as FeColorMatrixElement,
  yu as FeCompositeElement,
  du as FeDropShadowElement,
  mu as FeGaussianBlurElement,
  pu as FeMorphologyElement,
  At as FilterElement,
  ie as Font,
  iu as FontElement,
  au as FontFaceElement,
  Gr as GElement,
  Mn as GlyphElement,
  Dn as GradientElement,
  hu as ImageElement,
  Wo as LineElement,
  Ko as LinearGradientElement,
  Qo as MarkerElement,
  Ot as MaskElement,
  Nn as Matrix,
  nu as MissingGlyphElement,
  Po as Mouse,
  Ye as PSEUDO_ZERO,
  Nr as Parser,
  X as PathElement,
  B as PathParser,
  Yo as PatternElement,
  Q as Point,
  Xo as PolygonElement,
  Vn as PolylineElement,
  R as Property,
  $a as QB1,
  Ga as QB2,
  Wa as QB3,
  Jo as RadialGradientElement,
  _n as RectElement,
  Xe as RenderedElement,
  _o as Rotate,
  ft as SVGElement,
  cu as SVGFontLoader,
  Vo as Scale,
  St as Screen,
  In as Skew,
  Do as SkewX,
  ko as SkewY,
  eu as StopElement,
  kn as StyleElement,
  fu as SymbolElement,
  su as TRefElement,
  Ct as TSpanElement,
  Be as TextElement,
  uu as TextPathElement,
  xu as TitleElement,
  We as Transform,
  Mo as Translate,
  Bo as UnknownElement,
  vu as UseElement,
  Ro as ViewPort,
  Ke as compressSpaces,
  at as default,
  wo as getSelectorSpecificity,
  mo as normalizeAttributeName,
  xo as normalizeColor,
  wn as parseExternalUrl,
  Ru as presets,
  he as toNumbers,
  go as trimLeft,
  po as trimRight,
  Ba as vectorMagnitude,
  Ua as vectorsAngle,
  Vr as vectorsRatio
};
