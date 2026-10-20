var Z = { exports: {} }, ot = Z.exports, B;
function ct() {
  return B || (B = 1, (function(C, J) {
    (function(F, g) {
      C.exports = g();
    })(ot, (function() {
      return function(F, g) {
        var z = g.prototype, v = z.format;
        z.format = function(o) {
          var a = this, u = this.$locale();
          if (!this.isValid()) return v.bind(this)(o);
          var k = this.$utils(), s = (o || "YYYY-MM-DDTHH:mm:ssZ").replace(/\[([^\]]+)]|Q|wo|ww|w|WW|W|zzz|z|gggg|GGGG|Do|X|x|k{1,2}|S/g, (function(M) {
            switch (M) {
              case "Q":
                return Math.ceil((a.$M + 1) / 3);
              case "Do":
                return u.ordinal(a.$D);
              case "gggg":
                return a.weekYear();
              case "GGGG":
                return a.isoWeekYear();
              case "wo":
                return u.ordinal(a.week(), "W");
              case "w":
              case "ww":
                return k.s(a.week(), M === "w" ? 1 : 2, "0");
              case "W":
              case "WW":
                return k.s(a.isoWeek(), M === "W" ? 1 : 2, "0");
              case "k":
              case "kk":
                return k.s(String(a.$H === 0 ? 24 : a.$H), M === "k" ? 1 : 2, "0");
              case "X":
                return Math.floor(a.$d.getTime() / 1e3);
              case "x":
                return a.$d.getTime();
              case "z":
                return "[" + a.offsetName() + "]";
              case "zzz":
                return "[" + a.offsetName("long") + "]";
              default:
                return M;
            }
          }));
          return v.bind(this)(s);
        };
      };
    }));
  })(Z)), Z.exports;
}
var P = { exports: {} }, it = P.exports, I;
function ft() {
  return I || (I = 1, (function(C, J) {
    (function(F, g) {
      C.exports = g();
    })(it, (function() {
      var F = { LTS: "h:mm:ss A", LT: "h:mm A", L: "MM/DD/YYYY", LL: "MMMM D, YYYY", LLL: "MMMM D, YYYY h:mm A", LLLL: "dddd, MMMM D, YYYY h:mm A" }, g = /(\[[^[]*\])|([-_:/.,()\s]+)|(A|a|Q|YYYY|YY?|ww?|MM?M?M?|Do|DD?|hh?|HH?|mm?|ss?|S{1,3}|z|ZZ?)/g, z = /\d/, v = /\d\d/, o = /\d\d?/, a = /\d*[^-_:/,()\s\d]+/, u = {}, k = function(t) {
        return (t = +t) + (t > 68 ? 1900 : 2e3);
      }, s = function(t) {
        return function(r) {
          this[t] = +r;
        };
      }, M = [/[+-]\d\d:?(\d\d)?|Z/, function(t) {
        (this.zone || (this.zone = {})).offset = (function(r) {
          if (!r || r === "Z") return 0;
          var e = r.match(/([+-]|\d\d)/g), n = 60 * e[1] + (+e[2] || 0);
          return n === 0 ? 0 : e[0] === "+" ? -n : n;
        })(t);
      }], O = function(t) {
        var r = u[t];
        return r && (r.indexOf ? r : r.s.concat(r.f));
      }, V = function(t, r) {
        var e, n = u.meridiem;
        if (n) {
          for (var h = 1; h <= 24; h += 1) if (t.indexOf(n(h, 0, r)) > -1) {
            e = h > 12;
            break;
          }
        } else e = t === (r ? "pm" : "PM");
        return e;
      }, K = { A: [a, function(t) {
        this.afternoon = V(t, !1);
      }], a: [a, function(t) {
        this.afternoon = V(t, !0);
      }], Q: [z, function(t) {
        this.month = 3 * (t - 1) + 1;
      }], S: [z, function(t) {
        this.milliseconds = 100 * +t;
      }], SS: [v, function(t) {
        this.milliseconds = 10 * +t;
      }], SSS: [/\d{3}/, function(t) {
        this.milliseconds = +t;
      }], s: [o, s("seconds")], ss: [o, s("seconds")], m: [o, s("minutes")], mm: [o, s("minutes")], H: [o, s("hours")], h: [o, s("hours")], HH: [o, s("hours")], hh: [o, s("hours")], D: [o, s("day")], DD: [v, s("day")], Do: [a, function(t) {
        var r = u.ordinal, e = t.match(/\d+/);
        if (this.day = e[0], r) for (var n = 1; n <= 31; n += 1) r(n).replace(/\[|\]/g, "") === t && (this.day = n);
      }], w: [o, s("week")], ww: [v, s("week")], M: [o, s("month")], MM: [v, s("month")], MMM: [a, function(t) {
        var r = O("months"), e = (O("monthsShort") || r.map((function(n) {
          return n.slice(0, 3);
        }))).indexOf(t) + 1;
        if (e < 1) throw new Error();
        this.month = e % 12 || e;
      }], MMMM: [a, function(t) {
        var r = O("months").indexOf(t) + 1;
        if (r < 1) throw new Error();
        this.month = r % 12 || r;
      }], Y: [/[+-]?\d+/, s("year")], YY: [v, function(t) {
        this.year = k(t);
      }], YYYY: [/\d{4}/, s("year")], Z: M, ZZ: M };
      function tt(t) {
        var r, e;
        r = t, e = u && u.formats;
        for (var n = (t = r.replace(/(\[[^\]]+])|(LTS?|l{1,4}|L{1,4})/g, (function(x, p, f) {
          var c = f && f.toUpperCase();
          return p || e[f] || F[f] || e[c].replace(/(\[[^\]]+])|(MMMM|MM|DD|dddd)/g, (function(Y, w, $) {
            return w || $.slice(1);
          }));
        }))).match(g), h = n.length, d = 0; d < h; d += 1) {
          var S = n[d], D = K[S], m = D && D[0], l = D && D[1];
          n[d] = l ? { regex: m, parser: l } : S.replace(/^\[|\]$/g, "");
        }
        return function(x) {
          for (var p = {}, f = 0, c = 0; f < h; f += 1) {
            var Y = n[f];
            if (typeof Y == "string") c += Y.length;
            else {
              var w = Y.regex, $ = Y.parser, T = x.slice(c), y = w.exec(T)[0];
              $.call(p, y), x = x.replace(y, "");
            }
          }
          return (function(L) {
            var W = L.afternoon;
            if (W !== void 0) {
              var i = L.hours;
              W ? i < 12 && (L.hours += 12) : i === 12 && (L.hours = 0), delete L.afternoon;
            }
          })(p), p;
        };
      }
      return function(t, r, e) {
        e.p.customParseFormat = !0, t && t.parseTwoDigitYear && (k = t.parseTwoDigitYear);
        var n = r.prototype, h = n.parse;
        n.parse = function(d) {
          var S = d.date, D = d.utc, m = d.args;
          this.$u = D;
          var l = m[1];
          if (typeof l == "string") {
            var x = m[2] === !0, p = m[3] === !0, f = x || p, c = m[2];
            p && (c = m[2]), u = this.$locale(), !x && c && (u = e.Ls[c]), this.$d = (function(T, y, L, W) {
              try {
                if (["x", "X"].indexOf(y) > -1) return new Date((y === "X" ? 1e3 : 1) * T);
                var i = tt(y)(T), b = i.year, A = i.month, rt = i.day, et = i.hours, nt = i.minutes, at = i.seconds, st = i.milliseconds, _ = i.zone, j = i.week, q = /* @__PURE__ */ new Date(), Q = rt || (b || A ? 1 : q.getDate()), X = b || q.getFullYear(), H = 0;
                b && !A || (H = A > 0 ? A - 1 : q.getMonth());
                var G, U = et || 0, E = nt || 0, N = at || 0, R = st || 0;
                return _ ? new Date(Date.UTC(X, H, Q, U, E, N, R + 60 * _.offset * 1e3)) : L ? new Date(Date.UTC(X, H, Q, U, E, N, R)) : (G = new Date(X, H, Q, U, E, N, R), j && (G = W(G).week(j).toDate()), G);
              } catch {
                return /* @__PURE__ */ new Date("");
              }
            })(S, l, D, e), this.init(), c && c !== !0 && (this.$L = this.locale(c).$L), f && S != this.format(l) && (this.$d = /* @__PURE__ */ new Date("")), u = {};
          } else if (l instanceof Array) for (var Y = l.length, w = 1; w <= Y; w += 1) {
            m[1] = l[w - 1];
            var $ = e.apply(this, m);
            if ($.isValid()) {
              this.$d = $.$d, this.$L = $.$L, this.init();
              break;
            }
            w === Y && (this.$d = /* @__PURE__ */ new Date(""));
          }
          else h.call(this, d);
        };
      };
    }));
  })(P)), P.exports;
}
export {
  ct as a,
  ft as r
};
